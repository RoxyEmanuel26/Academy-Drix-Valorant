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
exports.isFeatureEnabled = exports.featureFlags = void 0;
const boolFlag = (name, defaultValue) => {
    const val = process.env[name];
    if (val === undefined || val === '')
        return defaultValue;
    return val.toLowerCase() === 'true';
};
exports.featureFlags = {
    help: boolFlag('FF_HELP', true),
    funGames: boolFlag('FF_FUN_GAMES', true),
    lfg: boolFlag('FF_LFG', true),
    missions: boolFlag('FF_MISSIONS', true),
    tournaments: boolFlag('FF_TOURNAMENTS', true),
    valorantContent: boolFlag('FF_VAL_CONTENT', true),
    valorantStatus: boolFlag('FF_VAL_STATUS', true),
    valorantOfficialTop: boolFlag('FF_VAL_OFFICIAL_TOP', true),
    valorantStats: boolFlag('FF_VAL_STATS', false),
    valorantLeaderboards: boolFlag('FF_VAL_LEADERBOARDS', false),
    valorantStreamer: boolFlag('FF_VAL_STREAMER', false),
    profile: boolFlag('FF_PROFILE', true),
    rankFromRole: boolFlag('FF_RANK_FROM_ROLE', true),
    rankFromApi: boolFlag('FF_RANK_FROM_API', false),
    autoRankSync: boolFlag('FF_AUTO_RANK_SYNC', false),
};
const isFeatureEnabled = (flag) => {
    return exports.featureFlags[flag];
};
exports.isFeatureEnabled = isFeatureEnabled;
