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


const boolFlag = (name: string, defaultValue: boolean): boolean => {
    const val = process.env[name];
    if (val === undefined || val === '') return defaultValue;
    return val.toLowerCase() === 'true';
};

export interface FeatureFlags {
    // Fitur non-Riot
    help: boolean;
    funGames: boolean;
    lfg: boolean;
    missions: boolean;
    tournaments: boolean;

    // Fitur yang butuh RIOT_API_KEY saja
    valorantContent: boolean;     // /agents, /maps, dll.
    valorantStatus: boolean;      // /status
    valorantOfficialTop: boolean; // /top leaderboard official

    // Fitur yang butuh API + RSO (full player stats)
    valorantStats: boolean;       // /mystats, /stats, /lastmatch, dsb.
    valorantLeaderboards: boolean;// leaderboard server berdasarkan stats member
    valorantStreamer: boolean;    // /streamer-stats, dll.
}

export const featureFlags: FeatureFlags = {
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
};

export const isFeatureEnabled = (flag: keyof FeatureFlags): boolean => {
    return featureFlags[flag];
};
