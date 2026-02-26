/**
 * ---------------------------------------------------------------------
 * ⚡ WONDERPLAY - ACADEMY DRIX VALORANT BOT
 * ---------------------------------------------------------------------
 * @copyright (c) 2026 Roxy Emanuel - Soreang, West Java, Indonesia
 * @author    Roxy Emanuel <https://github.com/RoxyEmanuel26>
 * ---------------------------------------------------------------------
 */

import axios, { AxiosRequestConfig } from 'axios';
import { getValidAccessToken } from './tokenManager';

export interface RiotApiResponse<T = any> {
    success?: boolean;
    data?: T;
    error?: string;
    message?: string;
}

/**
 * Handler terpusat untuk semua request ke Riot API (Mewajibkan Opt-in RSO)
 * Sudah include: auth check, error handling, rate limit
 */
export const riotApiRequest = async <T = any>(discordUserId: string, endpoint: string, options: AxiosRequestConfig = {}): Promise<RiotApiResponse<T>> => {

    // Cek RSO enabled
    if (process.env.RIOT_RSO_ENABLED !== 'true') {
        return { error: 'RSO_DISABLED', message: '⚙️ Fitur ini belum tersedia saat ini.\nFitur VALORANT API sedang dalam proses pengembangan.' };
    }

    // Ambil token valid (sekaligus mengecek apakah player opted in)
    const accessToken = await getValidAccessToken(discordUserId);
    if (!accessToken) {
        return { error: 'NOT_LINKED', message: '❌ Sesi akun Riot kamu telah berakhir atau belum terhubung.\nSilakan gunakan `/link-account` untuk menghubungkan ulang akun Riot kamu.' };
    }

    try {
        const baseUrl = 'https://api.riotgames.com'; // Akan disesuaikan base origin per endpoint normally, but assuming general AP/Global endpoints here.

        // Setup Headers Ensure X-Riot-Token is NOT used if Bearer token is used! But leaving based on user prompt strictly
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            // 'X-Riot-Token': process.env.RIOT_API_KEY, // Note: You typically don't send BOTH. Bearer is for player specific endpoints.
            ...options.headers
        };

        const response = await axios({
            url: `${baseUrl}${endpoint}`,
            headers: headers,
            ...options
        });

        const data = response.data;

        // Cek apakah player anonymized/hidden
        if (data.anonymized === true || data.hidden === true) {
            return {
                error: 'PLAYER_HIDDEN',
                message: '❌ Data player ini tidak dapat ditampilkan karena player memilih untuk menyembunyikan informasi mereka.'
            };
        }

        return { success: true, data };

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;

            if (status === 403) {
                return {
                    error: 'FORBIDDEN',
                    message: '❌ Data player ini tidak dapat diakses.\nPlayer mungkin memilih untuk menyembunyikan data mereka.'
                };
            }

            if (status === 404) {
                return {
                    error: 'NOT_FOUND',
                    message: '❌ Data tidak ditemukan.'
                };
            }

            if (status === 429) {
                return {
                    error: 'RATE_LIMITED',
                    message: '⏳ Terlalu banyak request ke Riot Server. Coba lagi dalam beberapa detik.'
                };
            }

            return {
                error: 'API_ERROR',
                message: `❌ Gagal mengambil data (${status}).`
            };
        }

        console.error('[RiotAPI] Request error:', error);
        return {
            error: 'NETWORK_ERROR',
            message: '❌ Gagal terhubung ke Riot API. Coba lagi nanti.'
        };
    }
};
