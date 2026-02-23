"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mission = void 0;
const mongoose_1 = require("mongoose");
const missionSchema = new mongoose_1.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    type: { type: String, enum: ['daily', 'weekly'], required: true },
    description: { type: String, required: true },
    target: { type: Number, required: true },
    progress: { type: Number, default: 0 },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    completed: { type: Boolean, default: false },
}, { timestamps: true });
exports.Mission = (0, mongoose_1.model)('Mission', missionSchema);
