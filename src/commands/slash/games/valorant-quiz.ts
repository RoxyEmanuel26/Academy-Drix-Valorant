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


import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, TextChannel } from 'discord.js';
import { quizQuestions } from '../../../data/valorant';
import { activeGames, setGameActive, setGameInactive } from '../../../utils/gameState';
import { addPoints, POINT_CONFIG } from '../../../services/gamePointsService';

function shuffleOptions(options: string[]) {
    const arr = [...options];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default {
    data: new SlashCommandBuilder()
        .setName('valorant-quiz')
        .setDescription('Kuis VALORANT pilihan ganda (Berhadiah Poin)'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.channel) return;

        if (!setGameActive(interaction.channel.id, 'valorant_quiz')) {
            await interaction.reply({ content: 'Sedang ada game yang berjalan di channel ini! Tunggu sebentar ya 🎮', ephemeral: true });
            return;
        }

        const questionData = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
        const shuffledOptions = shuffleOptions(questionData.options);

        let difficulty = 'medium';
        if (questionData.category === 'Esports Trivia' || questionData.category === 'Lore') difficulty = 'hard';
        else if (questionData.category === 'Agent Abilities') difficulty = 'medium';
        else difficulty = 'easy';

        const basePoints = (POINT_CONFIG.quiz as any)[difficulty] || 120;
        const timeLimit = 20000;

        const emojis = ['🇦', '🇧', '🇨', '🇩'];
        const row = new ActionRowBuilder<ButtonBuilder>();
        let correctCustomId = '';

        const descriptionLines = shuffledOptions.map((opt, i) => {
            const isCorrect = opt === questionData.answer;
            const customId = `quiz_${interaction.id}_${i}_${isCorrect ? 'true' : 'false'}`;
            if (isCorrect) correctCustomId = customId;

            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(customId)
                    .setLabel(emojis[i])
                    .setStyle(ButtonStyle.Primary)
            );

            return `${emojis[i]} ${opt}`;
        });

        const embed = new EmbedBuilder()
            .setTitle(`🧠 Kuis VALORANT - ${questionData.category}`)
            .setColor(0x3498DB)
            .setDescription(`**${questionData.question}**\n\nPilih jawaban yang benar dalam 20 detik!\n\n${descriptionLines.join('\n')}`)
            .setFooter({ text: `Difficulty: ${difficulty.toUpperCase()} | Makin cepat = Makin besar poin!` });

        const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
        const startTime = Date.now();

        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: timeLimit
        });

        let answered = false;

        collector.on('collect', async (i) => {
            if (i.user.bot) return;

            const customIdParts = i.customId.split('_');
            const isCorrect = customIdParts[3] === 'true';

            if (isCorrect) {
                if (answered) {
                    await i.reply({ content: 'Seseorang sudah menjawab benar duluan! 🏃💨', ephemeral: true });
                    return;
                }

                answered = true;
                collector.stop();

                const timeTaken = Date.now() - startTime;
                const timeTakenSeconds = (timeTaken / 1000).toFixed(1);

                try {
                    const result = await addPoints(
                        i.guildId!,
                        i.user.id,
                        i.user.username,
                        'quiz',
                        basePoints,
                        timeTaken,
                        timeLimit,
                        true,
                        false
                    );

                    const winEmbed = new EmbedBuilder()
                        .setTitle('🎉 Jawaban Benar!')
                        .setColor(0x2ECC71)
                        .setDescription(`GG <@${i.user.id}>! Jawabannya adalah **${questionData.answer}**.\nKamu menjawab dalam ${timeTakenSeconds} detik ⚡`)
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

                    // Disable buttons
                    const disabledRow = new ActionRowBuilder<ButtonBuilder>();
                    row.components.forEach(c => {
                        const newBtn = ButtonBuilder.from(c).setDisabled(true);
                        if ((c.data as any).custom_id === correctCustomId) newBtn.setStyle(ButtonStyle.Success);
                        else newBtn.setStyle(ButtonStyle.Secondary);
                        disabledRow.addComponents(newBtn);
                    });

                    await interaction.editReply({ components: [disabledRow] }).catch(() => { });
                    await i.reply({ embeds: [winEmbed] });

                } catch (error) {
                    console.error('Failed to add points:', error);
                    await i.reply({ content: `Bener bro! Jawabannya **${questionData.answer}**. Sayang DB poin error!`, ephemeral: true });
                }
            } else {
                await i.reply({ content: 'Jawaban kamu salah! ❌', ephemeral: true });
            }
        });

        collector.on('end', () => {
            setGameInactive(interaction.channel!.id);
            if (!answered) {
                const disabledRow = new ActionRowBuilder<ButtonBuilder>();
                const disabledComponents = row.components.map(c => {
                    const newBtn = ButtonBuilder.from(c).setDisabled(true);
                    if ((c.data as any).custom_id === correctCustomId) newBtn.setStyle(ButtonStyle.Success);
                    else newBtn.setStyle(ButtonStyle.Secondary);
                    return newBtn;
                });
                disabledRow.addComponents(...disabledComponents);

                interaction.editReply({ components: [disabledRow] }).catch(() => { });

                const loseEmbed = new EmbedBuilder()
                    .setTitle('⏰ Waktu Habis!')
                    .setColor(0xE74C3C)
                    .setDescription(`Tidak ada yang berhasil menjawab benar.\nJawabannya adalah **${questionData.answer}**.`);
                (interaction.channel as TextChannel).send({ embeds: [loseEmbed] });
            }
        });
    },
};
