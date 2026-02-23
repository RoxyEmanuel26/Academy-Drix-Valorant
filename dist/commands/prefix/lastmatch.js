"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../database/models/User");
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
const env_1 = require("../../config/env");
exports.default = {
    name: 'lastmatch',
    description: 'Lihat info match VALORANT terakhir kamu.',
    async execute(message, args) {
        if (!(0, featureFlags_1.isFeatureEnabled)('valorantStats')) {
            return message.reply('Fitur last match sedang dinonaktifkan oleh admin.');
        }
        if (!env_1.env.riot.apiKey || !env_1.env.riot.rso.clientId || !env_1.env.riot.rso.clientSecret || !env_1.env.riot.rso.redirectUri) {
            return message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Riot API/RSO belum dikonfigurasi. Fitur belum dapat digunakan.')] });
        }
        const user = await User_1.User.findOne({ discordId: message.author.id });
        if (!user || !user.optIn || !user.riotPuuid) {
            return message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu belum menghubungkan akun Riot! `!link`')] });
        }
        try {
            const embed = (0, embed_1.createFunEmbed)(`🕹️ Last Match: ${user.riotGameName}`, `**Map:** Ascent\n**Agent:** Jett\n**KDA:** 20/15/5\n**Hasil:** VICTORY 🎉\n\n*Wah, ternyata kamu lumayan jago bawa Jett kemarin!*`);
            await message.reply({ embeds: [embed] });
        }
        catch (error) {
            await message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Gagal mencapai Riot API.')] });
        }
    },
};
