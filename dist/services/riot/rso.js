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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRiotAccountMe = exports.exchangeCodeForToken = exports.getRsoAuthUrl = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../config/env");
const RSO_AUTH_URL = 'https://auth.riotgames.com/authorize';
const RSO_TOKEN_URL = 'https://auth.riotgames.com/token';
const RIOT_ACCOUNT_URL = 'https://americas.api.riotgames.com/riot/account/v1/accounts/me';
const getRsoAuthUrl = () => {
    const clientId = env_1.env.riot.rso.clientId;
    const redirectUri = env_1.env.riot.rso.redirectUri;
    return `${RSO_AUTH_URL}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid`;
};
exports.getRsoAuthUrl = getRsoAuthUrl;
const exchangeCodeForToken = async (code) => {
    const clientId = env_1.env.riot.rso.clientId;
    const clientSecret = env_1.env.riot.rso.clientSecret;
    const redirectUri = env_1.env.riot.rso.redirectUri;
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    const response = await axios_1.default.post(RSO_TOKEN_URL, params.toString(), {
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data.access_token;
};
exports.exchangeCodeForToken = exchangeCodeForToken;
const getRiotAccountMe = async (accessToken) => {
    const response = await axios_1.default.get(RIOT_ACCOUNT_URL, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return response.data; // { puuid, gameName, tagLine }
};
exports.getRiotAccountMe = getRiotAccountMe;
