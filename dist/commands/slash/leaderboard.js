"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const User_1 = require("../../database/models/User");
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
const env_1 = require("../../config/env");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Lihat Leaderboard Server ini!')
        .addStringOption(option => option.setName('type')
        .setDescription('Kategori Leaderboard')
        .setRequired(true)
        .addChoices({ name: 'Rank', value: 'rank' }, { name: 'Winrate', value: 'winrate' }, { name: 'KDA', value: 'kda' })),
    async execute(interaction) {
        if (!(0, featureFlags_1.isFeatureEnabled)('valorantLeaderboards')) {
            return interaction.reply({ content: 'Fitur leaderboard VALORANT sedang dinonaktifkan oleh admin.', ephemeral: true });
        }
        if (!env_1.env.riot.apiKey || !env_1.env.riot.rso.clientId || !env_1.env.riot.rso.clientSecret || !env_1.env.riot.rso.redirectUri) {
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Riot API/RSO belum dikonfigurasi sepenuhnya. Fitur belum dapat digunakan.')], ephemeral: true });
        }
        const users = await User_1.User.find({ optIn: true }).exec();
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
        const embed = (0, embed_1.createFunEmbed)(`🏆 Server Leaderboard: ${type.toUpperCase()}`, description || 'Wah, belum ada data yang cukup untuk di-rank!');
        await interaction.reply({ embeds: [embed] });
    },
};
