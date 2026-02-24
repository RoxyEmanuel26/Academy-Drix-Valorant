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


import { Client, REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

export const loadCommands = async (client: Client) => {
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
                client.slashCommands.set(command.data.name, command);
                slashCommandsToRegister.push(command.data.toJSON());
            }
        }
    }

    // Load Prefix Commands
    const prefixPath = path.join(__dirname, '../commands/prefix');
    if (fs.existsSync(prefixPath)) {
        const commandFiles = getAllFiles(prefixPath);
        for (const file of commandFiles) {
            const command = require(file).default;
            if (command?.name && command?.execute) {
                client.prefixCommands.set(command.name, command);
            }
        }
    }

    // Register Slash Commands
    if (env.discord.token && env.discord.clientId && slashCommandsToRegister.length > 0) {
        const rest = new REST({ version: '10' }).setToken(env.discord.token);
        try {
            console.log('Started refreshing application (/) commands.');

            if (env.discord.guildId) {
                // Determine if we have multiple comma-separated guild IDs
                const guildIds = env.discord.guildId.split(',').map(id => id.trim()).filter(id => id.length > 0);

                for (const guildId of guildIds) {
                    console.log(`Refreshing commands for Guild ID: ${guildId}`);
                    await rest.put(
                        Routes.applicationGuildCommands(env.discord.clientId, guildId),
                        { body: slashCommandsToRegister },
                    );
                }
            } else {
                // Global commands
                console.log(`Refreshing global commands...`);
                await rest.put(
                    Routes.applicationCommands(env.discord.clientId),
                    { body: slashCommandsToRegister },
                );
            }
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error('Error registering slash commands:', error);
        }
    }
};
