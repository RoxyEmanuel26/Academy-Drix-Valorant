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
const featureFlags_1 = require("../../config/featureFlags");
const env_1 = require("../../config/env");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('lastmatch')
        .setDescription('Lihat info match VALORANT terakhir kamu.'),
    async execute(interaction) {
        if (!(0, featureFlags_1.isFeatureEnabled)('valorantStats')) {
            return interaction.reply({ content: 'Fitur last match sedang dinonaktifkan oleh admin.', flags: discord_js_1.MessageFlags.Ephemeral });
        }
        if (!env_1.env.riot.apiKey || !env_1.env.riot.rso.clientId || !env_1.env.riot.rso.clientSecret || !env_1.env.riot.rso.redirectUri) {
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Riot API/RSO belum dikonfigurasi. Fitur belum dapat digunakan.')], flags: discord_js_1.MessageFlags.Ephemeral });
        }
        await interaction.deferReply();
        const user = await User_1.User.findOne({ discordId: interaction.user.id });
        if (!user || !user.optIn || !user.riotPuuid) {
            return interaction.followUp({ embeds: [(0, embed_1.createErrorEmbed)('Kamu belum menghubungkan akun Riot! `/link`')] });
        }
        try {
            // Note: Actual implementation would fetch from `getMatchHistory` and then `getMatchDetails`
            // For showcase, we simulate the output result:
            const embed = (0, embed_1.createFunEmbed)(`🕹️ Last Match: ${user.riotGameName}`, `**Map:** Ascent\n**Agent:** Jett\n**KDA:** 20/15/5\n**Hasil:** VICTORY 🎉\n\n*Wah, ternyata kamu lumayan jago bawa Jett kemarin!*`);
            await interaction.followUp({ embeds: [embed] });
        }
        catch (error) {
            await interaction.followUp({ embeds: [(0, embed_1.createErrorEmbed)('Gagal mencapai Riot API.')] });
        }
    },
};
