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


import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, TextChannel, Message , MessageFlags } from 'discord.js';
import { agents, agentEmojiHints } from '../../../data/valorant';
import { activeGames, setGameActive, setGameInactive, isAnswerCorrect } from '../../../utils/gameState';
import { addPoints, POINT_CONFIG, hasClaimedDaily, claimDaily } from '../../../services/gamePointsService';

export default {
    data: new SlashCommandBuilder()
        .setName('daily-challenge')
        .setDescription('Tantangan Harian dengan multiplier besar (Hanya bisa dimainkan 1x/hari)'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId || !interaction.channel) return;

        const claimed = await hasClaimedDaily(interaction.guildId, interaction.user.id);
        if (claimed) {
            await interaction.reply({ content: '❌ Kamu sudah menyelesaikan Daily Challenge hari ini! Coba lagi besok ya.', flags: MessageFlags.Ephemeral });
            return;
        }

        if (!setGameActive(interaction.channel.id, 'daily_challenge')) {
            await interaction.reply({ content: 'Sedang ada game yang berjalan di channel ini! Tunggu gamenya selesai untuk main Daily Challenge-mu. 🎮', flags: MessageFlags.Ephemeral });
            return;
        }

        // We will make the daily challenge a guaranteed hard 'emoji-agent' or 'scramble' 
        // For simplicity and speed in personal execution, we'll randomize an agent emoji test
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        const emojis = agentEmojiHints[randomAgent] || ["❓", "❓", "❓"];
        const basePoints = POINT_CONFIG.daily_challenge.base;
        const timeLimit = 30000;

        const embed = new EmbedBuilder()
            .setTitle('🌅 DAILY CHALLENGE')
            .setColor(0xFFD700)
            .setDescription(`**Tebak Agent dari Emoji ini!**\nClue: **${emojis.join(' ')}**\n\nKamu punya 30 Detik untuk mengetik namanya. Gagal = hangus untuk hari ini!`)
            .setFooter({ text: 'Multiplier besar & Streak Bonus aktif!' });

        await interaction.reply({ embeds: [embed] });
        const startTime = Date.now();

        const filter = (m: Message) => m.author.id === interaction.user.id;
        const collector = (interaction.channel as TextChannel).createMessageCollector({ filter, time: timeLimit, max: 3 }); // 3 attempts max

        let answered = false;

        collector.on('collect', async (m: Message) => {
            if (isAnswerCorrect(m.content, randomAgent)) {
                answered = true;
                collector.stop();

                const timeTaken = Date.now() - startTime;
                const timeTakenSeconds = (timeTaken / 1000).toFixed(1);

                try {
                    await claimDaily(interaction.guildId!, interaction.user.id);
                    const result = await addPoints(
                        m.guildId!,
                        m.author.id,
                        m.author.username,
                        'daily_challenge',
                        basePoints,
                        timeTaken,
                        timeLimit,
                        false, // No first blood since it's personal
                        false,
                        true // isDaily = true
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

                    await (interaction.channel as TextChannel).send({ embeds: [winEmbed] });
                } catch (error) {
                    console.error('Failed to add points:', error);
                    await (interaction.channel as TextChannel).send(`Bener woy jawabannya **${randomAgent}**! Tapi database poin lagi error 😭`);
                }
            } else {
                await m.reply('❌ Salah!');
            }
        });

        collector.on('end', async () => {
            setGameInactive(interaction.channel!.id);
            if (!answered) {
                await claimDaily(interaction.guildId!, interaction.user.id); // It's claimed and failed
                const loseEmbed = new EmbedBuilder()
                    .setTitle('⏰ Kesempatan Habis!')
                    .setColor(0xE74C3C)
                    .setDescription(`Sayang sekali <@${interaction.user.id}>! Kamu gagal di Daily Challenge hari ini.\nJawabannya adalah **${randomAgent}**. Coba lagi besok!`);
                (interaction.channel as TextChannel).send({ embeds: [loseEmbed] });
            }
        });
    },
};

