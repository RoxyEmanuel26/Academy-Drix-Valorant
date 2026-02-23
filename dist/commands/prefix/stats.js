"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../database/models/User");
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
const env_1 = require("../../config/env");
exports.default = {
    name: 'stats',
    description: 'Lihat statisik santai temanmu!',
    async execute(message, args) {
        if (!(0, featureFlags_1.isFeatureEnabled)('valorantStats')) {
            return message.reply('Fitur statistik VALORANT sedang dinonaktifkan oleh admin.');
        }
        if (!env_1.env.riot.apiKey || !env_1.env.riot.rso.clientId || !env_1.env.riot.rso.clientSecret || !env_1.env.riot.rso.redirectUri) {
            return message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Riot API/RSO belum dikonfigurasi. Fitur belum dapat digunakan.')] });
        }
        const target = message.mentions.users.first();
        if (!target)
            return message.reply('Silakan mention user. Contoh: `!stats @user`');
        const user = await User_1.User.findOne({ discordId: target.id });
        if (!user || !user.optIn) {
            return message.reply({ embeds: [(0, embed_1.createErrorEmbed)(`<@${target.id}> belum menghubungkan akun Riot mereka.`)] });
        }
        const stats = user.statsCache || { rank: 'Unranked', winrate: 50, totalWins: 10, totalLosses: 10 };
        const embed = (0, embed_1.createFunEmbed)(`📊 Stats: ${target.username}`, `**VALORANT ID:** ${user.riotGameName}#${user.riotTagLine}\n**Rank:** ${stats.rank}\n**Winrate:** ${stats.winrate}%\n**Matches:** ${stats.totalWins} W / ${stats.totalLosses} L`).setThumbnail(target.displayAvatarURL());
        await message.reply({ embeds: [embed] });
    },
};
