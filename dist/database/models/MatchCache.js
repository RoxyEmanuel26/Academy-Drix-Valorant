"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchCache = void 0;
const mongoose_1 = require("mongoose");
const matchCacheSchema = new mongoose_1.Schema({
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
exports.MatchCache = (0, mongoose_1.model)('MatchCache', matchCacheSchema);
