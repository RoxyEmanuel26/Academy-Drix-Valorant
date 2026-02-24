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


import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { connectDatabase } from './database/connection';
import { loadEvents } from './utils/eventHandler';
import { loadCommands } from './utils/commandHandler';
import { startCronJobs } from './jobs/cronJobs';

import { env } from './config/env';

// Environment variables are now automatically loaded when env.ts is imported.
declare module 'discord.js' {
    interface Client {
        slashCommands: Collection<string, any>;
        prefixCommands: Collection<string, any>;
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
});

client.slashCommands = new Collection();
client.prefixCommands = new Collection();

const init = async () => {
    if (!env.database.mongoUri) {
        console.error('MONGO_URI is missing in .env!');
        process.exit(1);
    }

    // Connect to DB dynamically based on server ID
    const dbName = env.discord.guildId ? `guild_${env.discord.guildId}` : 'academy_drix_global';
    await connectDatabase(env.database.mongoUri, dbName);

    // Load Handlers
    await loadEvents(client);
    await loadCommands(client);

    // Login
    if (env.discord.token) {
        await client.login(env.discord.token);

        // Start Fun & Games Cron Jobs
        startCronJobs(client);
    } else {
        console.warn('DISCORD_TOKEN is not provided. Bot will not connect to Discord.');
    }
};

init();
