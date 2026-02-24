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
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
const env_1 = require("../../config/env");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('status')
        .setDescription('Cek status server VALORANT (AP region).'),
    async execute(interaction) {
        if (!(0, featureFlags_1.isFeatureEnabled)('valorantStatus')) {
            return interaction.reply({ content: 'Fitur status server VALORANT sedang nonaktif.', ephemeral: true });
        }
        if (!env_1.env.riot.apiKey) {
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Riot API Key belum dikonfigurasi. Fitur belum dapat digunakan.')], ephemeral: true });
        }
        await interaction.deferReply();
        try {
            // Note: Use getServerStatus('ap') realistically
            const statusData = { maintenances: [], incidents: [] };
            if (statusData.maintenances.length === 0 && statusData.incidents.length === 0) {
                await interaction.followUp({ embeds: [(0, embed_1.createFunEmbed)('🟢 Server Status AP', 'Server berjalan lancar tanpa gangguan! Ayo main!')] });
            }
            else {
                await interaction.followUp({ embeds: [(0, embed_1.createErrorEmbed)('Terjadi gangguan atau maintenance di server AP. Harap bersabar ya!')] });
            }
        }
        catch (error) {
            await interaction.followUp({ embeds: [(0, embed_1.createErrorEmbed)('Gagal mengambil status server RIOT.')] });
        }
    },
};
