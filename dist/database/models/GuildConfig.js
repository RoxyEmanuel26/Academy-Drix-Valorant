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
exports.GuildConfig = void 0;
const mongoose_1 = require("mongoose");
const guildConfigSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true, unique: true },
    leaderboardChannelId: { type: String },
    prefix: { type: String, default: '!' },
    missionsEnabled: { type: Boolean, default: true },
    rankRoleIds: {
        radiant: String,
        immortal: String,
        ascendant: String,
        diamond: String,
        platinum: String,
        gold: String,
        silver: String,
        bronze: String,
        iron: String,
        unranked: String,
    }
}, { timestamps: true });
exports.GuildConfig = (0, mongoose_1.model)('GuildConfig', guildConfigSchema);
