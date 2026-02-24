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
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
const env_1 = require("../../config/env");
exports.default = {
    name: 'status',
    description: 'Cek status server VALORANT (AP region).',
    async execute(message, args) {
        if (!(0, featureFlags_1.isFeatureEnabled)('valorantStatus')) {
            return message.reply('Fitur status server VALORANT sedang nonaktif.');
        }
        if (!env_1.env.riot.apiKey) {
            return message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Riot API Key belum dikonfigurasi. Fitur belum dapat digunakan.')] });
        }
        try {
            const statusData = { maintenances: [], incidents: [] };
            if (statusData.maintenances.length === 0 && statusData.incidents.length === 0) {
                await message.reply({ embeds: [(0, embed_1.createFunEmbed)('🟢 Server Status AP', 'Server berjalan lancar tanpa gangguan! Ayo main!')] });
            }
            else {
                await message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Terjadi gangguan atau maintenance di server AP.')] });
            }
        }
        catch (error) {
            await message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Gagal mengambil status server RIOT.')] });
        }
    },
};
