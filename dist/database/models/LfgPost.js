"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LfgPost = void 0;
const mongoose_1 = require("mongoose");
const lfgPostSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true },
    messageId: { type: String, required: true, unique: true },
    ownerId: { type: String, required: true },
    mode: { type: String, required: true },
    note: { type: String },
    active: { type: Boolean, default: true },
    participants: { type: [String], default: [] },
    voiceChannelId: { type: String },
    channelId: { type: String, required: true },
    timeoutPrompted: { type: Boolean, default: false },
    isTimeout: { type: Boolean, default: false },
}, { timestamps: true });
exports.LfgPost = (0, mongoose_1.model)('LfgPost', lfgPostSchema);
