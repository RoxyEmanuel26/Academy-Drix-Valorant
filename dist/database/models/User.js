"use strict";
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
    },
    // Profile Fields
    mainAgent: { type: String },
    mainAgent2: { type: String },
    mainAgent3: { type: String },
    bio: { type: String, maxlength: 100 },
    // Parsed Intro Fields
    name: { type: String },
    age: { type: String },
    birthdate: { type: String },
    pronouns: { type: String },
    domicile: { type: String, maxlength: 30 },
    hobbies: { type: String },
    mbti: { type: String },
    sosmed: { type: String },
    lastKnownRank: { type: String, default: 'Unranked' },
    lastKnownRankSource: { type: String, enum: ['riot_api', 'discord_role', 'manual'], default: 'manual' },
    rankUpdatedAt: { type: Date }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', userSchema);
