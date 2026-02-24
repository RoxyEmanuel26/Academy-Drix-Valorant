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


import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType , MessageFlags } from 'discord.js';

export const totQuestions = [
    { title: "Lebih OP mana?", a: "Vandal", b: "Phantom" },
    { title: "Lebih ngeselin mana?", a: "Judge Camper", b: "Odin Spammer" },
    { title: "Lebih tebal mana?", a: "Icoshield Iso", b: "Full Armor" },
    { title: "Lebih sakit mana?", a: "Ulti Raze", b: "Ulti Sova" },
    { title: "Lebih cantik mana?", a: "Viper", b: "Sage" },
    { title: "Lebih ganteng mana?", a: "Chamber", b: "Yoru" },
    { title: "Mending main mana?", a: "Ascent", b: "Bind" },
    { title: "Mending skip mana?", a: "Breeze", b: "Icebox" },
    { title: "Lebih berguna mana?", a: "Heal Sage", b: "Heal Skye" },
    { title: "Lebih buta mana?", a: "Flash Phoenix", b: "Flash KAY/O" }
];

export default {
    data: new SlashCommandBuilder()
        .setName('this-or-that')
        .setDescription('Voting cepat 30 detik: Lebih OP mana? (VALORANT Edition)'),
    async execute(interaction: ChatInputCommandInteraction) {
        const item = totQuestions[Math.floor(Math.random() * totQuestions.length)];

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('tot_a')
                .setLabel(item.a)
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('tot_b')
                .setLabel(item.b)
                .setStyle(ButtonStyle.Success)
        );

        const embed = new EmbedBuilder()
            .setTitle('⚡ This or That (VALORANT)')
            .setColor(0xE67E22)
            .setDescription(`**${item.title}**\n\n🟩 **A.** ${item.a}\n\n🟩 **B.** ${item.b}`)
            .setFooter({ text: 'Waktu voting cuma 30 detik! Gasss!' });

        const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 30000
        });

        const votesA = new Set<string>();
        const votesB = new Set<string>();

        collector.on('collect', async (i) => {
            if (i.user.bot) return;

            if (i.customId === 'tot_a') {
                votesB.delete(i.user.id);
                votesA.add(i.user.id);
            } else if (i.customId === 'tot_b') {
                votesA.delete(i.user.id);
                votesB.add(i.user.id);
            }

            await i.reply({ content: `Suara kamu masuk! Pilihan: ${i.customId === 'tot_a' ? item.a : item.b}`, flags: MessageFlags.Ephemeral });
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
                .setDescription(`**${item.title}**\n\n🟩 **A.** ${item.a}\n\n🟩 **B.** ${item.b}\n\n**Hasil Voting (${total} Suara):**\n[${barA}] ${percentA}% (${item.a})\n[${barB}] ${percentB}% (${item.b})`)
                .setFooter({ text: 'Voting Cepat Ditutup!' });

            const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                ButtonBuilder.from(row.components[0] as any).setDisabled(true),
                ButtonBuilder.from(row.components[1] as any).setDisabled(true)
            );

            await interaction.editReply({ embeds: [resultEmbed], components: [disabledRow] }).catch(() => { });
        });
    },
};

