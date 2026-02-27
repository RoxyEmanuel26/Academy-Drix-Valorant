/**
 * ---------------------------------------------------------------------
 * ⚡ WONDERPLAY - ACADEMY DRIX VALORANT BOT
 * ---------------------------------------------------------------------
 * Manual Slash Command Deployer script.
 * Run this via: npm run deploy-commands
 * ---------------------------------------------------------------------
 */

import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

const slashCommandsToRegister: any[] = [];

// Helper function to recursively get all files
const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const absolutePath = path.join(dirPath, file);
        if (fs.statSync(absolutePath).isDirectory()) {
            arrayOfFiles = getAllFiles(absolutePath, arrayOfFiles);
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
            arrayOfFiles.push(absolutePath);
        }
    });

    return arrayOfFiles;
};

// Load Slash Commands
const slashPath = path.join(__dirname, '../commands/slash');
if (fs.existsSync(slashPath)) {
    const commandFiles = getAllFiles(slashPath);
    for (const file of commandFiles) {
        const command = require(file).default;
        if (command?.data && command?.execute) {
            slashCommandsToRegister.push(command.data.toJSON());
        }
    }
}

const deployCommands = async () => {
    if (!env.discord.token) {
        console.error('❌ DISCORD_TOKEN is missing in .env!');
        process.exit(1);
    }

    if (!env.discord.clientId) {
        console.error('❌ DISCORD_CLIENT_ID is missing in .env!');
        process.exit(1);
    }

    if (slashCommandsToRegister.length === 0) {
        console.log('⚠️ No slash commands found to register.');
        return;
    }

    const rest = new REST({ version: '10' }).setToken(env.discord.token);

    try {
        console.log(`Started refreshing ${slashCommandsToRegister.length} application (/) commands.`);

        if (env.discord.guildId) {
            const guildIds = env.discord.guildId.split(',').map(id => id.trim()).filter(id => id.length > 0);

            for (const guildId of guildIds) {
                console.log(`\tRefreshing commands for Guild ID: ${guildId}`);
                await rest.put(
                    Routes.applicationGuildCommands(env.discord.clientId, guildId),
                    { body: slashCommandsToRegister },
                );
            }
        } else {
            console.log(`\tRefreshing global commands...`);
            await rest.put(
                Routes.applicationCommands(env.discord.clientId),
                { body: slashCommandsToRegister },
            );
        }

        console.log('✅ Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('❌ Error registering slash commands:', error);
    }
};

deployCommands();
