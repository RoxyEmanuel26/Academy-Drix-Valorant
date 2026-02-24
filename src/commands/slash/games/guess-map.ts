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


import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, TextChannel, Message } from 'discord.js';
import { maps, mapClues } from '../../../data/valorant';
import { activeGames, setGameActive, setGameInactive, isAnswerCorrect } from '../../../utils/gameState';
import { addPoints, POINT_CONFIG } from '../../../services/gamePointsService';

export default {
    data: new SlashCommandBuilder()
        .setName('guess-map')
        .setDescription('Tebak nama Map VALORANT dari clue yang diberikan (Berhadiah Poin)'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.channel) return;

        if (!setGameActive(interaction.channel.id, 'guess_map')) {
            await interaction.reply({ content: 'Sedang ada game yang berjalan di channel ini! Tunggu sebentar ya 🎮', ephemeral: true });
            return;
        }

        const randomMap = maps[Math.floor(Math.random() * maps.length)];
        const clues = mapClues[randomMap];
        const difficulty = 'hard'; // For maximum point baseline if we don't separate it by user choice. Let's assume medium base.
        const basePoints = POINT_CONFIG.guess_map.medium;
        const timeLimit = 30000;

        const embed = new EmbedBuilder()
            .setTitle('🔍 Tebak Map VALORANT')
            .setColor(0x3498DB)
            .setDescription(`Siapa cepat dia dapat! Ketik nama map di chat sebelum waktu habis (30 Detik).\n\n**Easy Clue:** ${clues.easy}\n**Medium Clue:** ${clues.medium}\n**Hard Clue:** ${clues.hard}`)
            .setFooter({ text: 'Makin cepat jawab = Makin besar point multiplier!' });

        await interaction.reply({ embeds: [embed] });
        const startTime = Date.now();

        const filter = (m: Message) => !m.author.bot;
        const collector = (interaction.channel as TextChannel).createMessageCollector({ filter, time: timeLimit });

        let answered = false;

        collector.on('collect', async (m: Message) => {
            if (isAnswerCorrect(m.content, randomMap)) {
                answered = true;
                collector.stop();

                const timeTaken = Date.now() - startTime;
                const timeTakenSeconds = (timeTaken / 1000).toFixed(1);

                try {
                    const result = await addPoints(
                        m.guildId!,
                        m.author.id,
                        m.author.username,
                        'guess_map',
                        basePoints,
                        timeTaken,
                        timeLimit,
                        true, // first blood
                        false
                    );

                    const winEmbed = new EmbedBuilder()
                        .setTitle('🎉 Jawaban Benar!')
                        .setColor(0x2ECC71)
                        .setDescription(`GG <@${m.author.id}>! Jawabannya adalah **${randomMap}**.\nKamu menjawab dalam ${timeTakenSeconds} detik ⚡`)
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

                    await (interaction.channel as TextChannel).send({ embeds: [winEmbed] });
                } catch (error) {
                    console.error('Failed to add points:', error);
                    await (interaction.channel as TextChannel).send(`Bener woy jawabannya **${randomMap}**! Tapi database poin lagi error 😭`);
                }
            }
        });

        collector.on('end', () => {
            setGameInactive(interaction.channel!.id);
            if (!answered) {
                const loseEmbed = new EmbedBuilder()
                    .setTitle('⏰ Waktu Habis!')
                    .setColor(0xE74C3C)
                    .setDescription(`Sayang sekali! Tidak ada yang berhasil menebak.\nJawabannya adalah **${randomMap}**.`);
                (interaction.channel as TextChannel).send({ embeds: [loseEmbed] });
            }
        });
    },
};
