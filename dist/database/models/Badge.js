"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Badge = void 0;
const mongoose_1 = require("mongoose");
const badgeSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    earnedAt: { type: Date, default: Date.now }
});
exports.Badge = (0, mongoose_1.model)('Badge', badgeSchema);
