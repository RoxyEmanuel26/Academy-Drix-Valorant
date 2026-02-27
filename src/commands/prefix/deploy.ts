/**
 * ---------------------------------------------------------------------
 * ⚡ WONDERPLAY - ACADEMY DRIX VALORANT BOT
 * ---------------------------------------------------------------------
 * @copyright (c) 2026 Roxy Emanuel - Soreang, West Java, Indonesia
 * @author    Roxy Emanuel <https://github.com/RoxyEmanuel26>
 * ---------------------------------------------------------------------
 */

import { Message, REST, Routes, PermissionsBitField } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { env } from '../../config/env';

export default {
    name: 'deploy',
    aliases: ['registerbot', 'sync'],
    description: 'Manual trigger untuk meregistrasi Slash Commands (Admin Only)',
    async execute(message: Message, args: string[]) {
        // Keamanan Utama: Hanya Server Administrators yang bisa menjalankan ini!
        if (!message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Anda tidak memiliki izin Administrator untuk me-deploy commands!');
        }

        const waitMsg = await message.reply('🔄 Sedang mempersiapkan sinkronisasi Slash Commands...');

        const slashCommandsToRegister: any[] = [];
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

        const slashPath = path.join(__dirname, '../slash');
        if (fs.existsSync(slashPath)) {
            const commandFiles = getAllFiles(slashPath);
            for (const file of commandFiles) {
                // Delete cache so we can register newly edited data if needed without full bot reboot
                delete require.cache[require.resolve(file)];
                const command = require(file).default;
                if (command?.data && command?.execute) {
                    slashCommandsToRegister.push(command.data.toJSON());
                }
            }
        }

        if (slashCommandsToRegister.length === 0) {
            return waitMsg.edit('⚠️ Tidak ada Slash Command yang terdeteksi untuk didaftarkan.');
        }

        const rest = new REST({ version: '10' }).setToken(env.discord.token!);

        try {
            await waitMsg.edit(`🚀 Memulai pendaftaran **${slashCommandsToRegister.length}** Slash Commands...`);

            if (env.discord.guildId) {
                const guildIds = env.discord.guildId.split(',').map(id => id.trim()).filter(id => id.length > 0);
                for (const guildId of guildIds) {
                    await rest.put(
                        Routes.applicationGuildCommands(env.discord.clientId!, guildId),
                        { body: slashCommandsToRegister },
                    );
                }
            } else {
                await rest.put(
                    Routes.applicationCommands(env.discord.clientId!),
                    { body: slashCommandsToRegister },
                );
            }

            await waitMsg.edit('✅ **SUKSES!** Seluruh Slash Commands berhasil di-deploy ke Server/Global. Silakan cek menu command Discord (Mungkin perlu merestart aplikasi Discord kamu untuk langsung terlihat).');
        } catch (error) {
            console.error('Error registrasi manual command:', error);
            await waitMsg.edit('❌ **GAGAL!** Terjadi kesalahan saat mencoba deploy. Cek console bot untuk detail error.');
        }
    },
};
