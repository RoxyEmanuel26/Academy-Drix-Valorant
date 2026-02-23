"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Pastikan memanggil config di entry point (index.ts) atau module ini di-import pertama kalinya.
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../config/.env') });
exports.env = {
    discord: {
        token: process.env.DISCORD_TOKEN || '',
        clientId: process.env.DISCORD_CLIENT_ID || '',
        guildId: process.env.DISCORD_GUILD_ID || '',
    },
    database: {
        mongoUri: process.env.MONGO_URI || '',
    },
    riot: {
        apiKey: process.env.RIOT_API_KEY || '',
        rso: {
            clientId: process.env.RIOT_RSO_CLIENT_ID || '',
            clientSecret: process.env.RIOT_RSO_CLIENT_SECRET || '',
            redirectUri: process.env.RIOT_RSO_REDIRECT_URI || '',
        },
    },
};
