"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildConfig = void 0;
const mongoose_1 = require("mongoose");
const guildConfigSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true, unique: true },
    leaderboardChannelId: { type: String },
    prefix: { type: String, default: '!' },
    missionsEnabled: { type: Boolean, default: true },
}, { timestamps: true });
exports.GuildConfig = (0, mongoose_1.model)('GuildConfig', guildConfigSchema);
