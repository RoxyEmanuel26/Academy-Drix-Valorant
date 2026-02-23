"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const connection_1 = require("./database/connection");
const eventHandler_1 = require("./utils/eventHandler");
const commandHandler_1 = require("./utils/commandHandler");
const env_1 = require("./config/env");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel, discord_js_1.Partials.GuildMember],
});
client.slashCommands = new discord_js_1.Collection();
client.prefixCommands = new discord_js_1.Collection();
const init = async () => {
    if (!env_1.env.database.mongoUri) {
        console.error('MONGO_URI is missing in .env!');
        process.exit(1);
    }
    // Connect to DB
    await (0, connection_1.connectDatabase)(env_1.env.database.mongoUri);
    // Load Handlers
    await (0, eventHandler_1.loadEvents)(client);
    await (0, commandHandler_1.loadCommands)(client);
    // Login
    if (env_1.env.discord.token) {
        await client.login(env_1.env.discord.token);
    }
    else {
        console.warn('DISCORD_TOKEN is not provided. Bot will not connect to Discord.');
    }
};
init();
