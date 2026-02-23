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
