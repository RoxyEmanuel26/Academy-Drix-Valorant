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
 * ---------------------------------------------------------------------
 */

import { env } from '../config/env';

interface GuardResult {
    allowed: boolean;
    reason?: string;
}

export const featureGuard = (featureName: string): GuardResult => {
    const rsoEnabled = process.env.RIOT_RSO_ENABLED === 'true';
    const apiKeyType = process.env.RIOT_API_KEY_TYPE;
    const featureFlag = process.env[`FEATURE_${featureName}`];

    // Fitur RSO hanya boleh jalan dengan production key
    const rsoFeatures = [
        'LINK_ACCOUNT', 'RANK',
        'STATS', 'MATCH_HISTORY', 'LEADERBOARD_API'
    ];

    if (rsoFeatures.includes(featureName)) {
        if (!rsoEnabled || apiKeyType !== 'production') {
            return {
                allowed: false,
                reason: "⚙️ Fitur ini belum tersedia saat ini.\nFitur VALORANT API sedang dalam proses pengembangan dan akan segera hadir! Pantau terus update bot ya~ 🎮"
            };
        }
    }

    if (featureFlag === 'false') {
        return {
            allowed: false,
            reason: "⚙️ Fitur ini sedang dalam maintenance.\nCoba lagi nanti!"
        };
    }

    return { allowed: true };
};
