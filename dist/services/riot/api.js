"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = exports.getServerStatus = exports.getMatchDetails = exports.getMatchHistory = exports.getValContent = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../config/env");
const getHeaders = () => ({
    'X-Riot-Token': env_1.env.riot.apiKey,
});
const getRegionURL = (region) => `https://${region}.api.riotgames.com`;
const getValContent = async (locale = 'en-US') => {
    // Content is available via generic regions, using 'ap' as default.
    const url = `${getRegionURL('ap')}/val/content/v1/contents?locale=${locale}`;
    const res = await axios_1.default.get(url, { headers: getHeaders() });
    return res.data;
};
exports.getValContent = getValContent;
const getMatchHistory = async (region, puuid) => {
    const url = `${getRegionURL(region)}/val/match/v1/matchlists/by-puuid/${puuid}`;
    const res = await axios_1.default.get(url, { headers: getHeaders() });
    return res.data;
};
exports.getMatchHistory = getMatchHistory;
const getMatchDetails = async (region, matchId) => {
    const url = `${getRegionURL(region)}/val/match/v1/matches/${matchId}`;
    const res = await axios_1.default.get(url, { headers: getHeaders() });
    return res.data;
};
exports.getMatchDetails = getMatchDetails;
const getServerStatus = async (region) => {
    const url = `${getRegionURL(region)}/val/status/v1/platform-data`;
    const res = await axios_1.default.get(url, { headers: getHeaders() });
    return res.data;
};
exports.getServerStatus = getServerStatus;
const getLeaderboard = async (region, actId, startIndex = 0, size = 10) => {
    const url = `${getRegionURL(region)}/val/ranked/v1/leaderboards/by-act/${actId}?size=${size}&startIndex=${startIndex}`;
    const res = await axios_1.default.get(url, { headers: getHeaders() });
    return res.data;
};
exports.getLeaderboard = getLeaderboard;
