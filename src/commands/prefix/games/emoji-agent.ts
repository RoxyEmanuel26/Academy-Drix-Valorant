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
import { addPoints, POINT_CONFIG } from '../../../services/gamePointsService';

export default {
    name: 'emoji-agent',
    aliases: ['emojia', 'tebakemoji'],
    description: 'Tebak nama Agent dari 3 Emoji',
    async execute(message: Message, args: string[]) {
        if (!message.channel) return;

        if (!setGameActive(message.channel.id, 'emoji_agent')) {
            await message.reply('Sedang ada game yang berjalan di channel ini! Tunggu sebentar ya 🎮');
            return;
        }

        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        const emojis = agentEmojiHints[randomAgent] || ["❓", "❓", "❓"];
        const basePoints = POINT_CONFIG.emoji_agent.base;
        const timeLimit = 25000;

        const embed = new EmbedBuilder()
            .setTitle('🎭 Tebak Agent dari Emoji')
            .setColor(0x3498DB)
            .setDescription(`Siapa cepat dia dapat! Ketik nama agent di chat sebelum waktu habis (25 Detik).\n\nClue: **${emojis.join(' ')}**`)
            .setFooter({ text: 'Makin cepat jawab = Makin besar point multiplier!' });

        const sentMessage = await (message.channel as TextChannel).send({ embeds: [embed] });
        const startTime = Date.now();

        const filter = (m: Message) => !m.author.bot;
        const collector = (message.channel as TextChannel).createMessageCollector({ filter, time: timeLimit });

        let answered = false;

        collector.on('collect', async (m: Message) => {
            if (isAnswerCorrect(m.content, randomAgent)) {
                answered = true;
                collector.stop();

                const timeTaken = Date.now() - startTime;
                const timeTakenSeconds = (timeTaken / 1000).toFixed(1);

                try {
                    const result = await addPoints(
                        m.guildId!,
                        m.author.id,
                        m.author.username,
                        'emoji_agent',
                        basePoints,
                        timeTaken,
                        timeLimit,
                        true,
                        false
                    );

                    const winEmbed = new EmbedBuilder()
                        .setTitle('🎉 Jawaban Benar!')
                        .setColor(0x2ECC71)
                        .setDescription(`GG <@${m.author.id}>! Jawabannya adalah **${randomAgent}**.\nKamu menjawab dalam ${timeTakenSeconds} detik ⚡`)
                        .addFields(
                            { name: 'Base Poin', value: `+${result.breakDown.base} pts`, inline: true },
                            { name: 'Speed Bonus', value: `+${result.breakDown.speed} pts ⚡`, inline: true },
                            { name: 'First Blood', value: `+${result.breakDown.firstBlood} pts 🩸`, inline: true },
                            { name: 'Total Didapat', value: `**+${result.pointsEarned} pts** 🏆`, inline: false },
                            { name: 'Total Poin Kamu', value: `**${result.totalPoints} pts**`, inline: true }
                        );

                    if (result.breakDown.streak > 0) {
                        winEmbed.addFields({ name: 'Streak Bonus', value: `+${result.breakDown.streak} pts 🔥`, inline: true });
                    }

                    await (message.channel as TextChannel).send({ embeds: [winEmbed] });
                } catch (error) {
                    console.error('Failed to add points:', error);
                    await (message.channel as TextChannel).send(`Bener woy jawabannya **${randomAgent}**! Tapi database poin lagi error 😭`);
                }
            }
        });

        collector.on('end', () => {
            setGameInactive(message.channel.id);
            if (!answered) {
                const loseEmbed = new EmbedBuilder()
                    .setTitle('⏰ Waktu Habis!')
                    .setColor(0xE74C3C)
                    .setDescription(`Sayang sekali! Tidak ada yang berhasil menebak.\nJawabannya adalah **${randomAgent}**.`);
                (message.channel as TextChannel).send({ embeds: [loseEmbed] });
            }
        });
    },
};
