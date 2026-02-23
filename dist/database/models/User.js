"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
    }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', userSchema);
