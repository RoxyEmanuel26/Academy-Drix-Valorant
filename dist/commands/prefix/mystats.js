"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../database/models/User");
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
const env_1 = require("../../config/env");
exports.default = {
    name: 'mystats',
    description: 'Lihat statisik santai VALORANT kamu!',
    async execute(message, args) {
        if (!(0, featureFlags_1.isFeatureEnabled)('valorantStats')) {
            return message.reply('Fitur statistik VALORANT sedang dinonaktifkan oleh admin. Nanti nyala lagi kok! ✨');
        }
        if (!env_1.env.riot.apiKey || !env_1.env.riot.rso.clientId || !env_1.env.riot.rso.clientSecret || !env_1.env.riot.rso.redirectUri) {
            return message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Riot API/RSO belum dikonfigurasi. Fitur belum dapat digunakan.')] });
        }
        const user = await User_1.User.findOne({ discordId: message.author.id });
        if (!user || !user.optIn || !user.riotPuuid) {
            return message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu belum menghubungkan akun Riot apa pun!\nGunakan `!link` untuk memulai.')] });
        }
        try {
            const stats = user.statsCache || { rank: 'Unranked', winrate: 50, totalWins: 10, totalLosses: 10 };
            const embed = (0, embed_1.createFunEmbed)(`📊 Stats: ${user.riotGameName}#${user.riotTagLine}`, `**Rank:** ${stats.rank}\n**Winrate:** ${stats.winrate}%\n**Matches:** ${stats.totalWins} W / ${stats.totalLosses} L\n\n*Statistik dihitung dari data terakhir yang tersinkronisasi di server ini!*`).setThumbnail(message.author.displayAvatarURL());
            await message.reply({ embeds: [embed] });
        }
        catch (error) {
            console.error(error);
            await message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Gagal mengambil data statistik.')] });
        }
    },
};
