"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tournament = void 0;
const mongoose_1 = require("mongoose");
const tournamentSchema = new mongoose_1.Schema({
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
exports.Tournament = (0, mongoose_1.model)('Tournament', tournamentSchema);
