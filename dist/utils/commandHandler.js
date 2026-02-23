"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCommands = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
const loadCommands = async (client) => {
    const slashCommandsToRegister = [];
    // Load Slash Commands
    const slashPath = path_1.default.join(__dirname, '../commands/slash');
    if (fs_1.default.existsSync(slashPath)) {
        const commandFiles = fs_1.default.readdirSync(slashPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/slash/${file}`).default;
            if (command?.data && command?.execute) {
                client.slashCommands.set(command.data.name, command);
                slashCommandsToRegister.push(command.data.toJSON());
            }
        }
    }
    // Load Prefix Commands
    const prefixPath = path_1.default.join(__dirname, '../commands/prefix');
    if (fs_1.default.existsSync(prefixPath)) {
        const commandFiles = fs_1.default.readdirSync(prefixPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/prefix/${file}`).default;
            if (command?.name && command?.execute) {
                client.prefixCommands.set(command.name, command);
            }
        }
    }
    // Register Slash Commands
    if (env_1.env.discord.token && env_1.env.discord.clientId && slashCommandsToRegister.length > 0) {
        const rest = new discord_js_1.REST({ version: '10' }).setToken(env_1.env.discord.token);
        try {
            console.log('Started refreshing application (/) commands.');
            if (env_1.env.discord.guildId) {
                // Guild commands for faster testing
                await rest.put(discord_js_1.Routes.applicationGuildCommands(env_1.env.discord.clientId, env_1.env.discord.guildId), { body: slashCommandsToRegister });
            }
            else {
                // Global commands
                await rest.put(discord_js_1.Routes.applicationCommands(env_1.env.discord.clientId), { body: slashCommandsToRegister });
            }
            console.log('Successfully reloaded application (/) commands.');
        }
        catch (error) {
            console.error('Error registering slash commands:', error);
        }
    }
};
exports.loadCommands = loadCommands;
