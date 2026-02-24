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


import { Schema, model, Document } from 'mongoose';

export interface IGuildConfig extends Document {
    guildId: string;
    leaderboardChannelId?: string;
    prefix: string;
    missionsEnabled: boolean;
    rankRoleIds?: {
        radiant?: string;
        immortal?: string;
        ascendant?: string;
        diamond?: string;
        platinum?: string;
        gold?: string;
        silver?: string;
        bronze?: string;
        iron?: string;
        unranked?: string;
    };
}

const guildConfigSchema = new Schema<IGuildConfig>({
    guildId: { type: String, required: true, unique: true },
    leaderboardChannelId: { type: String },
    prefix: { type: String, default: '!' },
    missionsEnabled: { type: Boolean, default: true },
    rankRoleIds: {
        radiant: String,
        immortal: String,
        ascendant: String,
        diamond: String,
        platinum: String,
        gold: String,
        silver: String,
        bronze: String,
        iron: String,
        unranked: String,
    }
}, { timestamps: true });

export const GuildConfig = model<IGuildConfig>('GuildConfig', guildConfigSchema);
