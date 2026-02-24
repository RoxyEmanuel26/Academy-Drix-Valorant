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
import { getUserStats, getUserRank } from '../../../services/gamePointsService';

export default {
    data: new SlashCommandBuilder()
        .setName('my-points')
        .setDescription('Cek statistik dan perolehan poin Mini-Games kamu')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Lihat poin player lain (Opsional)')
                .setRequired(false)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return;

        const targetUser = interaction.options.getUser('user') || interaction.user;
        const stats = await getUserStats(interaction.guildId, targetUser.id);

        if (!stats) {
            await interaction.reply({ content: `**${targetUser.username}** belum pernah bermain Mini-Games di server ini.`, ephemeral: true });
            return;
        }

        const rankAllTime = await getUserRank(interaction.guildId, targetUser.id, 'alltime');
        const rankWeekly = await getUserRank(interaction.guildId, targetUser.id, 'weekly');
        const rankMonthly = await getUserRank(interaction.guildId, targetUser.id, 'monthly');

        const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

        const embed = new EmbedBuilder()
            .setTitle(`📊 Mini-Games Stats: ${stats.username}`)
            .setColor(0x3498DB)
            .setThumbnail(targetUser.displayAvatarURL())
            .addFields(
                { name: '🏆 All-Time Points', value: `${stats.totalPoints} pts\n(Rank #${rankAllTime})`, inline: true },
                { name: '🥇 Monthly Points', value: `${stats.monthlyPoints} pts\n(Rank #${rankMonthly})`, inline: true },
                { name: '🥈 Weekly Points', value: `${stats.weeklyPoints} pts\n(Rank #${rankWeekly})`, inline: true },
                { name: '🎮 Games Played', value: `${stats.gamesPlayed} (Won: ${stats.gamesWon})`, inline: true },
                { name: '📈 Win Rate', value: `${winRate}%`, inline: true },
                { name: '🔥 Streaks', value: `Current: ${stats.currentStreak}\nBest: ${stats.longestStreak}`, inline: true }
            );

        if (stats.pointsHistory && stats.pointsHistory.length > 0) {
            const recentHistory = stats.pointsHistory.slice(0, 5).map(h =>
                `\`[${h.game}]\` **+${h.points}** - ${h.reason}`
            ).join('\n');

            embed.addFields({ name: '📝 Recent History (Last 5)', value: recentHistory, inline: false });
        }

        await interaction.reply({ embeds: [embed] });
    },
};
