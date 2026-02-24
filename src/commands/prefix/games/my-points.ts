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
import { getUserStats, getUserRank } from '../../../services/gamePointsService';

export default {
    name: 'my-points',
    aliases: ['mypoints', 'poinku', 'stats'],
    description: 'Cek statistik dan perolehan poin Mini-Games kamu',
    async execute(message: Message, args: string[]) {
        if (!message.guildId) return;

        const targetUser = message.mentions.users.first() || message.author;
        const stats = await getUserStats(message.guildId, targetUser.id);

        if (!stats) {
            await message.reply(`**${targetUser.username}** belum pernah bermain Mini-Games di server ini.`);
            return;
        }

        const rankAllTime = await getUserRank(message.guildId, targetUser.id, 'alltime');
        const rankWeekly = await getUserRank(message.guildId, targetUser.id, 'weekly');
        const rankMonthly = await getUserRank(message.guildId, targetUser.id, 'monthly');

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

        await (message.channel as TextChannel).send({ embeds: [embed] });
    },
};
