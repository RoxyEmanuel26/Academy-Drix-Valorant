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


import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { getLeaderboard } from '../../../services/gamePointsService';

export default {
    data: new SlashCommandBuilder()
        .setName('leaderboard-games')
        .setDescription('Tampilkan 10 pemain terbaik Mini-Games')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Kategori waktu klasemen')
                .setRequired(true)
                .addChoices(
                    { name: 'Mingguan (Weekly)', value: 'weekly' },
                    { name: 'Bulanan (Monthly)', value: 'monthly' },
                    { name: 'Sepanjang Waktu (All-Time)', value: 'alltime' }
                )
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return;

        const category = interaction.options.getString('category') as 'weekly' | 'monthly' | 'alltime';
        const top10 = await getLeaderboard(interaction.guildId, category, 10);

        if (top10.length === 0) {
            await interaction.reply({ content: 'Belum ada data poin untuk kategori ini.', ephemeral: true });
            return;
        }

        const categoryNames = {
            weekly: 'Mingguan 🥈',
            monthly: 'Bulanan 🥇',
            alltime: 'Sepanjang Waktu 🏆'
        };

        const embed = new EmbedBuilder()
            .setTitle(`Top 10 Klasemen - ${categoryNames[category]}`)
            .setColor(0xF1C40F)
            .setDescription('Siapa yang paling paham soal VALORANT di server ini?');

        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

        let boardText = '';
        top10.forEach((user, index) => {
            let pts = 0;
            if (category === 'weekly') pts = user.weeklyPoints;
            else if (category === 'monthly') pts = user.monthlyPoints;
            else pts = user.totalPoints;

            boardText += `${medals[index]} **${user.username}** — ${pts} Pts\n`;
        });

        embed.addFields({ name: 'Rankings', value: boardText, inline: false });
        embed.setFooter({ text: 'Kumpulkan poin lebih banyak dengan main terus!' });

        await interaction.reply({ embeds: [embed] });
    },
};
