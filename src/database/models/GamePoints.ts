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


import mongoose, { Document, Schema } from 'mongoose';

export interface IGamePoints extends Document {
    guildId: string;
    userId: string;
    username: string;

    // Total poin
    totalPoints: number;
    weeklyPoints: number;
    monthlyPoints: number;

    // History poin per game
    pointsHistory: {
        game: string;
        points: number;
        reason: string;
        earnedAt: Date;
    }[];

    // Statistik per game
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    longestStreak: number;
    lastPlayedAt: Date;

    // Daily challenge tracking
    lastDailyAt: Date | null;

    updatedAt: Date;
    createdAt: Date;
}

const GamePointsSchema = new Schema<IGamePoints>({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },

    totalPoints: { type: Number, default: 0 },
    weeklyPoints: { type: Number, default: 0 },
    monthlyPoints: { type: Number, default: 0 },

    pointsHistory: [{
        game: { type: String, required: true },
        points: { type: Number, required: true },
        reason: { type: String, required: true },
        earnedAt: { type: Date, default: Date.now }
    }],

    gamesPlayed: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastPlayedAt: { type: Date, default: null },

    lastDailyAt: { type: Date, default: null }

}, { timestamps: true });

// Ensure unique entry per user per guild
GamePointsSchema.index({ guildId: 1, userId: 1 }, { unique: true });
// Index for faster queries on leaderboard
GamePointsSchema.index({ guildId: 1, totalPoints: -1 });
GamePointsSchema.index({ guildId: 1, weeklyPoints: -1 });
GamePointsSchema.index({ guildId: 1, monthlyPoints: -1 });

export const GamePoints = mongoose.model<IGamePoints>('GamePoints', GamePointsSchema);
