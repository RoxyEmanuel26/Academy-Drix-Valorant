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


import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags } from 'discord.js';
import { wyrQuestions } from '../../../data/valorant';

export default {
    data: new SlashCommandBuilder()
        .setName('would-you-rather')
        .setDescription('Pilih antara dua skenario mematikan di VALORANT (Voting Terbuka)'),
    async execute(interaction: ChatInputCommandInteraction) {
        const question = wyrQuestions[Math.floor(Math.random() * wyrQuestions.length)];

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('wyr_a')
                .setLabel('Pilihan Merah')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('wyr_b')
                .setLabel('Pilihan Biru')
                .setStyle(ButtonStyle.Primary)
        );

        const embed = new EmbedBuilder()
            .setTitle('⚖️ Would You Rather')
            .setColor(0x9B59B6)
            .setDescription(`**Mana yang lebih kamu pilih?**\n\n🔴 **A.** ${question.optionA}\n\n🔵 **B.** ${question.optionB}`)
            .setFooter({ text: 'Waktu voting 60 detik! (Tidak ada poin, pure for fun)' });

        await interaction.reply({ embeds: [embed], components: [row] });
        const message = await interaction.fetchReply();

        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000
        });

        const votesA = new Set<string>();
        const votesB = new Set<string>();

        collector.on('collect', async (i) => {
            if (i.user.bot) return;

            if (i.customId === 'wyr_a') {
                votesB.delete(i.user.id);
                votesA.add(i.user.id);
            } else if (i.customId === 'wyr_b') {
                votesA.delete(i.user.id);
                votesB.add(i.user.id);
            }

            await i.reply({ content: `Kamu memilih ${i.customId === 'wyr_a' ? 'Merah 🔴' : 'Biru 🔵'}`, flags: MessageFlags.Ephemeral });
        });

        collector.on('end', async () => {
            const total = votesA.size + votesB.size;
            let percentA = 0;
            let percentB = 0;

            if (total > 0) {
                percentA = Math.round((votesA.size / total) * 100);
                percentB = Math.round((votesB.size / total) * 100);
            }

            let barA = '█'.repeat(Math.round(percentA / 10)) + '░'.repeat(10 - Math.round(percentA / 10));
            let barB = '█'.repeat(Math.round(percentB / 10)) + '░'.repeat(10 - Math.round(percentB / 10));

            const resultEmbed = EmbedBuilder.from(embed)
                .setDescription(`**Mana yang lebih kamu pilih?**\n\n🔴 **A.** ${question.optionA}\n\n🔵 **B.** ${question.optionB}\n\n**Hasil Voting (${total} Suara):**\n🔴 [${barA}] ${percentA}% (${votesA.size})\n🔵 [${barB}] ${percentB}% (${votesB.size})`)
                .setFooter({ text: 'Voting Ditutup!' });

            // Disable buttons
            const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                ButtonBuilder.from(row.components[0] as any).setDisabled(true),
                ButtonBuilder.from(row.components[1] as any).setDisabled(true)
            );

            await interaction.editReply({ embeds: [resultEmbed], components: [disabledRow] }).catch(() => { });
        });
    },
};

