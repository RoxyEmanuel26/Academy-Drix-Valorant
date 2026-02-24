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

export interface IUser extends Document {
    discordId: string;
    riotPuuid?: string;
    riotGameName?: string;
    riotTagLine?: string;
    region: string;
    linkedAt?: Date;
    optIn: boolean;
    statsCache?: {
        rank?: string;
        totalWins?: number;
        totalLosses?: number;
        winrate?: number;
    };

    // Personal Info (Parsed from Intros)
    name?: string;
    age?: string;
    birthdate?: string;
    pronouns?: string;
    domicile?: string;
    hobbies?: string;
    mbti?: string;
    sosmed?: string;

    // Profile Customization
    mainAgent?: string;
    mainAgent2?: string;
    mainAgent3?: string;
    bio?: string;

    // Rank History Tracking
    lastKnownRank?: string;
    lastKnownRankSource?: 'riot_api' | 'discord_role' | 'manual';
    rankUpdatedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
    discordId: { type: String, required: true, unique: true },
    riotPuuid: { type: String, sparse: true },
    riotGameName: { type: String },
    riotTagLine: { type: String },
    region: { type: String, default: 'ap' },
    linkedAt: { type: Date },
    optIn: { type: Boolean, default: false },
    statsCache: {
        rank: String,
        totalWins: Number,
        totalLosses: Number,
        winrate: Number,
    },

    // Profile Fields
    mainAgent: { type: String },
    mainAgent2: { type: String },
    mainAgent3: { type: String },
    bio: { type: String, maxlength: 100 },

    // Parsed Intro Fields
    name: { type: String },
    age: { type: String },
    birthdate: { type: String },
    pronouns: { type: String },
    domicile: { type: String, maxlength: 30 },
    hobbies: { type: String },
    mbti: { type: String },
    sosmed: { type: String },

    lastKnownRank: { type: String, default: 'Unranked' },
    lastKnownRankSource: { type: String, enum: ['riot_api', 'discord_role', 'manual'], default: 'manual' },
    rankUpdatedAt: { type: Date }
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);
