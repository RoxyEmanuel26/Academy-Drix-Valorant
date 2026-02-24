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

export interface ITournament extends Document {
    guildId: string;
    name: string;
    status: 'upcoming' | 'ongoing' | 'finished';
    teams: { name: string; captainId: string; members: string[] }[];
    matches: { round: number; team1: string; team2: string; winner?: string; score?: string }[];
    config: {
        maxTeams: number;
        mode: string;
        startDate: Date;
    };
}

const tournamentSchema = new Schema<ITournament>({
    guildId: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['upcoming', 'ongoing', 'finished'], default: 'upcoming' },
    teams: [{
        name: String,
        captainId: String,
        members: [String],
    }],
    matches: [{
        round: Number,
        team1: String,
        team2: String,
        winner: String,
        score: String,
    }],
    config: {
        maxTeams: { type: Number, default: 8 },
        mode: { type: String, default: '5v5' },
        startDate: { type: Date },
    }
}, { timestamps: true });

export const Tournament = model<ITournament>('Tournament', tournamentSchema);
