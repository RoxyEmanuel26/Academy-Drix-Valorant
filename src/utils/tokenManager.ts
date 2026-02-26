/**
 * ---------------------------------------------------------------------
 * ⚡ WONDERPLAY - ACADEMY DRIX VALORANT BOT
 * ---------------------------------------------------------------------
 * @copyright (c) 2026 Roxy Emanuel - Soreang, West Java, Indonesia
 * @author    Roxy Emanuel <https://github.com/RoxyEmanuel26>
 * ---------------------------------------------------------------------
 */

import { User } from '../database/models/User';
import axios from 'axios';
import { env } from '../config/env';
import cron from 'node-cron';

/**
 * Cek apakah Access Token masih valid
 * Jika sudah expired -> refresh otomatis
 */
export const getValidAccessToken = async (discordUserId: string): Promise<string | null> => {
    const userData = await User.findOne({ discordId: discordUserId });

    if (!userData || !userData.refreshToken || !userData.optedIn) {
        return null; // user belum link akun atau belum opt-in
    }

    const now = Date.now();
    const isExpired = now >= (userData.tokenExpiry || 0);

    if (!isExpired && userData.accessToken) {
        // Token masih valid, langsung return
        return userData.accessToken;
    }

    // Token expired -> refresh menggunakan Refresh Token
    try {
        const authString = Buffer.from(
            `${env.riot.rso.clientId}:${env.riot.rso.clientSecret}`
        ).toString('base64');

        const response = await axios.post(
            'https://auth.riotgames.com/token',
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: userData.refreshToken
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${authString}`
                }
            }
        );

        const tokens = response.data;

        // Simpan token baru ke database
        userData.accessToken = tokens.access_token;
        userData.refreshToken = tokens.refresh_token || userData.refreshToken;
        userData.tokenExpiry = Date.now() + (tokens.expires_in * 1000);
        userData.lastUpdated = new Date();
        await userData.save();

        return tokens.access_token;

    } catch (error) {
        console.error('[TokenManager] Gagal refresh token:', error);

        // Jika grant_type invalid atau token ditarik, clean up
        if (axios.isAxiosError(error) && error.response?.status === 400) {
            userData.accessToken = undefined;
            userData.refreshToken = undefined;
            userData.tokenExpiry = undefined;
            userData.optedIn = false;
            await userData.save();
        }

        return null;
    }
};

/**
 * Cleanup function called by cron job
 */
export const clearExpiredTokens = async () => {
    const now = Date.now();
    try {
        await User.updateMany(
            { tokenExpiry: { $lt: now } },
            {
                $unset: { accessToken: "", refreshToken: "", tokenExpiry: "" },
                $set: { optedIn: false }
            }
        );
    } catch (error) {
        console.error('[TokenManager] Gagal membersihkan token expired:', error);
    }
};

export const startTokenCleanupCron = () => {
    // Run at minute 0 past every hour
    cron.schedule('0 * * * *', async () => {
        console.log('[Cron] Running RSO expired token cleanup...');
        await clearExpiredTokens();
    });
};
