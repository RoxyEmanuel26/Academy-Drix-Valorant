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
exports.MatchCache = void 0;
const mongoose_1 = require("mongoose");
const matchCacheSchema = new mongoose_1.Schema({
    puuid: { type: String, required: true, unique: true },
    matches: [{
            matchId: String,
            queue: String,
            mapId: String,
            agentId: String,
            kda: String,
            result: { type: String, enum: ['win', 'loss', 'draw'] },
            playedAt: Date,
        }],
    lastFetchedAt: { type: Date, default: Date.now },
});
exports.MatchCache = (0, mongoose_1.model)('MatchCache', matchCacheSchema);
