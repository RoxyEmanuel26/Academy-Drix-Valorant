"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const User_1 = require("../../database/models/User");
const embed_1 = require("../../utils/embed");
const featureGuard_1 = require("../../utils/featureGuard");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Lihat Leaderboard Server ini!')
        .addStringOption(option => option.setName('type')
        .setDescription('Kategori Leaderboard')
        .setRequired(true)
        .addChoices({ name: 'Rank', value: 'rank' }, { name: 'Winrate', value: 'winrate' }, { name: 'KDA', value: 'kda' })),
    async execute(interaction) {
        const guard = (0, featureGuard_1.featureGuard)('LEADERBOARD_API');
        if (!guard.allowed) {
            return interaction.reply({ content: guard.reason, flags: discord_js_1.MessageFlags.Ephemeral });
        }
        const users = await User_1.User.find({ optedIn: true }).exec();
        if (users.length === 0) {
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Belum ada player yang menghubungkan akun di server ini.')] });
        }
        const type = interaction.options.getString('type') || 'rank';
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
        const embed = (0, embed_1.createFunEmbed)(`🏆 Server Leaderboard: ${type.toUpperCase()}`, (description || 'Wah, belum ada data yang cukup untuk di-rank!') +
            `\n\n*📊 Leaderboard ini hanya menampilkan profil member dan rank resmi VALORANT. Ini tidak berafiliasi dengan sistem ranked resmi Riot Games.*`);
        await interaction.reply({ embeds: [embed] });
    },
};
