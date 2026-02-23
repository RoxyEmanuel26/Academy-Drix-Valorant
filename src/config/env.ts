import dotenv from 'dotenv';
import path from 'path';

// Pastikan memanggil config di entry point (index.ts) atau module ini di-import pertama kalinya.
dotenv.config({ path: path.resolve(__dirname, '../../config/.env') });

export const env = {
    discord: {
        token: process.env.DISCORD_TOKEN || '',
        clientId: process.env.DISCORD_CLIENT_ID || '',
        guildId: process.env.DISCORD_GUILD_ID || '',
        valorantRoleId: process.env.DISCORD_VALORANT_ROLE_ID || '',
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
