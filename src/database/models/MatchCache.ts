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

export interface IPlayerMatch {
    matchId: string;
    queue: string;
    mapId: string;
    agentId: string;
    kda: string;
    result: 'win' | 'loss' | 'draw';
    playedAt: Date;
}

export interface IMatchCache extends Document {
    puuid: string;
    matches: IPlayerMatch[];
    lastFetchedAt: Date;
}

const matchCacheSchema = new Schema<IMatchCache>({
    puuid: { type: String, required: true, unique: true },
    matches: [{
        matchId: String,
        queue: String,
        mapId: String,
        agentId: String,
        kda: String,
        result: { type: String, enum: ['win', 'loss', 'draw'] },
        playedAt: Date,
    }],
    lastFetchedAt: { type: Date, default: Date.now },
});

export const MatchCache = model<IMatchCache>('MatchCache', matchCacheSchema);
