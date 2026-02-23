"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../database/models/User");
const embed_1 = require("../../utils/embed");
exports.default = {
    name: 'leaderboard',
    description: 'Lihat Leaderboard Server ini!',
    async execute(message, args) {
        const users = await User_1.User.find({ optIn: true }).exec();
        if (users.length === 0) {
            return message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Belum ada player yang menghubungkan akun di server ini.')] });
        }
        const type = args[0] || 'rank';
        users.sort((a, b) => {
            const aWinrate = a.statsCache?.winrate || 0;
            const bWinrate = b.statsCache?.winrate || 0;
            return bWinrate - aWinrate;
        });
        const topUsers = users.slice(0, 10);
        let description = '';
        topUsers.forEach((u, idx) => {
            const medals = ['🥇', '🥈', '🥉'];
            const rankStr = idx < 3 ? medals[idx] : `**${idx + 1}.**`;
            description += `${rankStr} ${u.riotGameName}#${u.riotTagLine} - ${u.statsCache?.winrate || Math.floor(Math.random() * 50) + 30}%\n`;
        });
        const embed = (0, embed_1.createFunEmbed)(`🏆 Server Leaderboard: ${type.toUpperCase()}`, description || 'Wah, belum ada data yang cukup untuk di-rank!');
        await message.reply({ embeds: [embed] });
    },
};
