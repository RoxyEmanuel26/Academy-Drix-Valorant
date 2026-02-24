/**
 * ---------------------------------------------------------------------
 * ⚡ WONDERPLAY - ACADEMY DRIX VALORANT BOT
 * ---------------------------------------------------------------------
 * @copyright (c) 2026 Roxy Emanuel - Soreang, West Java, Indonesia
 * @author    Roxy Emanuel <https://github.com/RoxyEmanuel26>
 * @link      https://github.com/RoxyEmanuel26/Academy-Drix-Valorant
 * @community WonderPlay Discord: https://discord.gg/A6b3dT2eey
 * 
 * Bot Discord eksklusif untuk komunitas WonderPlay & Academy Drix Valorant.
 * Hak cipta dilindungi undang-undang.
 * 
 * ⚠️ PERINGATAN EKSKLUSIVITAS:
 * Dilarang keras melakukan modifikasi, distribusi, atau komersialisasi
 * tanpa izin tertulis dari pemegang hak cipta.
 * ---------------------------------------------------------------------
 */


import { Message, EmbedBuilder, TextChannel } from 'discord.js';
import { agents, agentEmojiHints } from '../../../data/valorant';
import { activeGames, setGameActive, setGameInactive, isAnswerCorrect } from '../../../utils/gameState';
import { addPoints, POINT_CONFIG, hasClaimedDaily, claimDaily } from '../../../services/gamePointsService';

export default {
    name: 'daily-challenge',
    aliases: ['daily', 'tantanganharian'],
    description: 'Tantangan Harian dengan multiplier besar (Hanya bisa dimainkan 1x/hari)',
    async execute(message: Message, args: string[]) {
        if (!message.guildId || !message.channel) return;

        const claimed = await hasClaimedDaily(message.guildId, message.author.id);
        if (claimed) {
            await message.reply('❌ Kamu sudah menyelesaikan Daily Challenge hari ini! Coba lagi besok ya.');
            return;
        }

        if (!setGameActive(message.channel.id, 'daily_challenge')) {
            await message.reply('Sedang ada game yang berjalan di channel ini! Tunggu gamenya selesai untuk main Daily Challenge-mu. 🎮');
            return;
        }

        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        const emojis = agentEmojiHints[randomAgent] || ["❓", "❓", "❓"];
        const basePoints = POINT_CONFIG.daily_challenge.base;
        const timeLimit = 30000;

        const embed = new EmbedBuilder()
            .setTitle('🌅 DAILY CHALLENGE')
            .setColor(0xFFD700)
            .setDescription(`**Tebak Agent dari Emoji ini!**\nClue: **${emojis.join(' ')}**\n\nKamu punya 30 Detik untuk mengetik namanya. Gagal = hangus untuk hari ini!`)
            .setFooter({ text: 'Multiplier besar & Streak Bonus aktif!' });

        const sentMessage = await (message.channel as TextChannel).send({ content: `<@${message.author.id}>, your daily challenge begins NOW!`, embeds: [embed] });
        const startTime = Date.now();

        const filter = (m: Message) => m.author.id === message.author.id;
        const collector = (message.channel as TextChannel).createMessageCollector({ filter, time: timeLimit }); // no max limits, just 30s open window

        let answered = false;

        collector.on('collect', async (m: Message) => {
            if (isAnswerCorrect(m.content, randomAgent)) {
                answered = true;
                collector.stop();

                const timeTaken = Date.now() - startTime;
                const timeTakenSeconds = (timeTaken / 1000).toFixed(1);

                try {
                    await claimDaily(message.guildId!, message.author.id);
                    const result = await addPoints(
                        m.guildId!,
                        m.author.id,
                        m.author.username,
                        'daily_challenge',
                        basePoints,
                        timeTaken,
                        timeLimit,
                        false,
                        false,
                        true
                    );

                    const winEmbed = new EmbedBuilder()
                        .setTitle('🎉 Daily Challenge COMPLETE!')
                        .setColor(0x2ECC71)
                        .setDescription(`Luar biasa <@${m.author.id}>! Jawabannya adalah **${randomAgent}**.\nKamu merespons dalam ${timeTakenSeconds} detik ⚡`)
                        .addFields(
                            { name: 'Base Poin', value: `+${result.breakDown.base} pts`, inline: true },
                            { name: 'Speed Bonus', value: `+${result.breakDown.speed} pts ⚡`, inline: true },
                            { name: 'Streak Bonus', value: `+${result.breakDown.streak} pts 🔥\n(Streak: ${result.breakDown.currentStreak} hari)`, inline: true },
                            { name: 'Total Didapat', value: `**+${result.pointsEarned} pts** 🏆`, inline: false },
                            { name: 'Total Poin Kamu', value: `**${result.totalPoints} pts**`, inline: true }
                        )
                        .setThumbnail(m.author.displayAvatarURL());

                    await (message.channel as TextChannel).send({ embeds: [winEmbed] });
                } catch (error) {
                    console.error('Failed to add points:', error);
                    await (message.channel as TextChannel).send(`Bener woy jawabannya **${randomAgent}**! Tapi database poin lagi error 😭`);
                }
            } else {
                await m.reply('❌ Salah!');
            }
        });

        collector.on('end', async () => {
            setGameInactive(message.channel.id);
            if (!answered) {
                await claimDaily(message.guildId!, message.author.id);
                const loseEmbed = new EmbedBuilder()
                    .setTitle('⏰ Kesempatan Habis!')
                    .setColor(0xE74C3C)
                    .setDescription(`Sayang sekali <@${message.author.id}>! Kamu gagal di Daily Challenge hari ini.\nJawabannya adalah **${randomAgent}**. Coba lagi besok!`);
                (message.channel as TextChannel).send({ embeds: [loseEmbed] });
            }
        });
    },
};
