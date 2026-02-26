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


import dotenv from 'dotenv';
import path from 'path';

// Pastikan memanggil config di entry point (index.ts) atau module ini di-import pertama kalinya.
dotenv.config({ path: path.resolve(__dirname, '../../config/.env') });

export const env = {
    discord: {
        token: process.env.DISCORD_TOKEN || '',
        clientId: process.env.DISCORD_CLIENT_ID || '',
        guildId: process.env.DISCORD_GUILD_ID || '',
    },
    bot: {
        lfgTimeoutMinutes: parseInt(process.env.LFG_TIMEOUT_MINUTES || '60', 10),
    },
    database: {
        mongoUri: process.env.MONGO_URI || '',
    },
    riot: {
        apiKey: process.env.RIOT_API_KEY || '',
        apiKeyType: process.env.RIOT_API_KEY_TYPE || 'development',
        rsoEnabled: process.env.RIOT_RSO_ENABLED === 'true',
        rso: {
            clientId: process.env.RIOT_RSO_CLIENT_ID || '',
            clientSecret: process.env.RIOT_RSO_CLIENT_SECRET || '',
            redirectUri: process.env.RIOT_RSO_REDIRECT_URI || '',
        },
        features: {
            linkAccount: process.env.FEATURE_LINK_ACCOUNT === 'true',
            profile: process.env.FEATURE_PROFILE === 'true',
            rank: process.env.FEATURE_RANK === 'true',
            stats: process.env.FEATURE_STATS === 'true',
            matchHistory: process.env.FEATURE_MATCH_HISTORY === 'true',
            leaderboardApi: process.env.FEATURE_LEADERBOARD_API === 'true',
            leaderboardRole: process.env.FEATURE_LEADERBOARD_ROLE === 'true',
        }
    },
};
