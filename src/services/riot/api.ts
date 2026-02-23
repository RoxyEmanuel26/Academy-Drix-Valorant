import axios from 'axios';
import { env } from '../../config/env';

const getHeaders = () => ({
    'X-Riot-Token': env.riot.apiKey,
});

const getRegionURL = (region: string) => `https://${region}.api.riotgames.com`;

export const getValContent = async (locale = 'en-US') => {
    // Content is available via generic regions, using 'ap' as default.
    const url = `${getRegionURL('ap')}/val/content/v1/contents?locale=${locale}`;
    const res = await axios.get(url, { headers: getHeaders() });
    return res.data;
};

export const getMatchHistory = async (region: string, puuid: string) => {
    const url = `${getRegionURL(region)}/val/match/v1/matchlists/by-puuid/${puuid}`;
    const res = await axios.get(url, { headers: getHeaders() });
    return res.data;
};

export const getMatchDetails = async (region: string, matchId: string) => {
    const url = `${getRegionURL(region)}/val/match/v1/matches/${matchId}`;
    const res = await axios.get(url, { headers: getHeaders() });
    return res.data;
};

export const getServerStatus = async (region: string) => {
    const url = `${getRegionURL(region)}/val/status/v1/platform-data`;
    const res = await axios.get(url, { headers: getHeaders() });
    return res.data;
};

export const getLeaderboard = async (region: string, actId: string, startIndex = 0, size = 10) => {
    const url = `${getRegionURL(region)}/val/ranked/v1/leaderboards/by-act/${actId}?size=${size}&startIndex=${startIndex}`;
    const res = await axios.get(url, { headers: getHeaders() });
    return res.data;
};
