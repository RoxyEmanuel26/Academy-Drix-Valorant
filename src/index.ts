import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { connectDatabase } from './database/connection';
import { loadEvents } from './utils/eventHandler';
import { loadCommands } from './utils/commandHandler';

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

    // Connect to DB
    await connectDatabase(env.database.mongoUri);

    // Load Handlers
    await loadEvents(client);
    await loadCommands(client);

    // Login
    if (env.discord.token) {
        await client.login(env.discord.token);
    } else {
        console.warn('DISCORD_TOKEN is not provided. Bot will not connect to Discord.');
    }
};

init();
