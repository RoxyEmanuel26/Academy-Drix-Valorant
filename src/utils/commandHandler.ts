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

    // Load Slash Commands
    const slashPath = path.join(__dirname, '../commands/slash');
    if (fs.existsSync(slashPath)) {
        const commandFiles = fs.readdirSync(slashPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/slash/${file}`).default;
            if (command?.data && command?.execute) {
                client.slashCommands.set(command.data.name, command);
                slashCommandsToRegister.push(command.data.toJSON());
            }
        }
    }

    // Load Prefix Commands
    const prefixPath = path.join(__dirname, '../commands/prefix');
    if (fs.existsSync(prefixPath)) {
        const commandFiles = fs.readdirSync(prefixPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/prefix/${file}`).default;
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
                // Guild commands for faster testing
                await rest.put(
                    Routes.applicationGuildCommands(env.discord.clientId, env.discord.guildId),
                    { body: slashCommandsToRegister },
                );
            } else {
                // Global commands
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
