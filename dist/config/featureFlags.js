"use strict";
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
};
const isFeatureEnabled = (flag) => {
    return exports.featureFlags[flag];
};
exports.isFeatureEnabled = isFeatureEnabled;
