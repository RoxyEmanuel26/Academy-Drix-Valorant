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

    // Registering Slash Commands happens in a separate manual script: src/scripts/deploy-commands.ts
    // to prevent hitting Discord's API rate limits directly during rapid Node bot restarts.
};
