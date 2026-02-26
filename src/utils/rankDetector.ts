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

import { Collection, Role, GuildMember } from 'discord.js';
import { featureFlags, FeatureFlags } from '../config/featureFlags';
import { IUser } from '../database/models/User';

export const VALORANT_RANKS = [
    { rank: 'Radiant', keywords: ['radiant'], color: 0xFFFCE0, emoji: '<:radiant:1475926641652924489>', tier: 9 },
    { rank: 'Immortal', keywords: ['immortal'], color: 0xBE3D6B, emoji: '<:immortal:1475926638150815794>', tier: 8 },
    { rank: 'Ascendant', keywords: ['ascendant', 'asc'], color: 0x18A76B, emoji: '<:ascendant:1475926635034443890>', tier: 7 },
    { rank: 'Diamond', keywords: ['diamond', 'dia'], color: 0x6ACDDE, emoji: '<:diamond:1475926631804567645>', tier: 6 },
    { rank: 'Platinum', keywords: ['platinum', 'plat'], color: 0x3BCBBF, emoji: '<:platinum:1475926629057433743>', tier: 5 },
    { rank: 'Gold', keywords: ['gold'], color: 0xFFD700, emoji: '<:gold:1475926625441943685>', tier: 4 },
    { rank: 'Silver', keywords: ['silver', 'silv'], color: 0xC0C0C0, emoji: '<:silver:1475926622887481476>', tier: 3 },
    { rank: 'Bronze', keywords: ['bronze', 'brnz'], color: 0xCD7F32, emoji: '<:bronze:1475926620199194667>', tier: 2 },
    { rank: 'Iron', keywords: ['iron'], color: 0x8E8E8E, emoji: '<:iron:1475926617275629588>', tier: 1 },
    { rank: 'Unranked', keywords: ['unranked', 'unrank', 'norank'], color: 0x4B4B4B, emoji: '<:loveheart:1475926648007299174>', tier: 0 },
];

/**
 * Detects a Valorant rank based on the Discord roles assigned to a member.
 * Falls back to 'Unranked' if none match.
 */
export function detectRankFromRoles(
    memberRoles: Collection<string, Role>
): { rank: string; emoji: string; color: number; tier: number; roleId: string | null } {
    for (const [roleId, role] of memberRoles) {
        const roleName = role.name.toLowerCase();

        for (const rankData of VALORANT_RANKS) {
            for (const keyword of rankData.keywords) {
                if (roleName.includes(keyword)) {
                    return {
                        rank: rankData.rank,
                        emoji: rankData.emoji,
                        color: rankData.color,
                        tier: rankData.tier,
                        roleId: roleId
                    };
                }
            }
        }
    }

    // Default Fallback
    return {
        rank: 'Unranked',
        emoji: '<:loveheart:1475926648007299174>',
        color: 0x4B4B4B,
        tier: 0,
        roleId: null
    };
}

/**
 * Aggregates the visual and data source of a member's rank based on priority settings.
 * Priority 1: Riot API (If feature flag and player opted in)
 * Priority 2: Discord Role detection
 * Priority 3: Fallback 'Unranked'
 */
export async function getMemberRank(
    member: GuildMember,
    userDb: IUser | null,
    flags: FeatureFlags
): Promise<{ rank: string; emoji: string; color: number; source: 'riot_api' | 'discord_role' | 'manual' }> {

    // PRIORITY 1: Riot API Source
    if (flags.rankFromApi && flags.valorantStats && userDb?.optedIn && userDb?.riotPuuid) {
        // TODO: Await Valorant API Implementation in rankSyncService.ts
        // const riotRank = await getRankFromRiotAPI(userDb.riotPuuid);
        // return { ...riotRank, source: 'riot_api' };
    }

    // PRIORITY 2: Discord Role Source
    if (flags.rankFromRole) {
        const roleRank = detectRankFromRoles(member.roles.cache);
        return { ...roleRank, source: 'discord_role' };
    }

    // PRIORITY 3: Fallbacks
    return {
        rank: 'Unranked',
        emoji: '<:loveheart:1475926648007299174>',
        color: 0x4B4B4B,
        source: 'manual'
    };
}
