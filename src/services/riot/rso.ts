import axios from 'axios';
import { env } from '../../config/env';

const RSO_AUTH_URL = 'https://auth.riotgames.com/authorize';
const RSO_TOKEN_URL = 'https://auth.riotgames.com/token';
const RIOT_ACCOUNT_URL = 'https://americas.api.riotgames.com/riot/account/v1/accounts/me';

export const getRsoAuthUrl = (): string => {
    const clientId = env.riot.rso.clientId;
    const redirectUri = env.riot.rso.redirectUri;
    return `${RSO_AUTH_URL}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid`;
};

export const exchangeCodeForToken = async (code: string): Promise<string> => {
    const clientId = env.riot.rso.clientId;
    const clientSecret = env.riot.rso.clientSecret;
    const redirectUri = env.riot.rso.redirectUri;

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);

    const response = await axios.post(RSO_TOKEN_URL, params.toString(), {
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    return response.data.access_token;
};

export const getRiotAccountMe = async (accessToken: string) => {
    const response = await axios.get(RIOT_ACCOUNT_URL, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return response.data; // { puuid, gameName, tagLine }
};
