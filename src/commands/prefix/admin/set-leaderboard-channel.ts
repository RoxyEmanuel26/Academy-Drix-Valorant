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


import { Message, PermissionFlagsBits } from 'discord.js';
import { GuildConfig } from '../../../database/models/GuildConfig';
import { createFunEmbed, createErrorEmbed } from '../../../utils/embed';

export default {
    name: 'set-leaderboard-channel',
    description: 'Set channel khusus untuk auto-update Leaderboard (Admin Only)',
    async execute(message: Message, args: string[]) {
        if (!message.member?.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ Kamu harus jadi Admin untuk menggunakan command ini.');
        }

        const channel = message.mentions.channels.first();

        if (!message.guildId || !channel) {
            return message.reply('Silakan mention channel tujuan, contoh: `!set-leaderboard-channel #leaderboard`');
        }

        try {
            await GuildConfig.findOneAndUpdate(
                { guildId: message.guildId },
                { leaderboardChannelId: channel.id },
                { upsert: true }
            );

            await message.reply({
                embeds: [createFunEmbed('✅ Channel Diatur', `Channel leaderboard berhasil di-set ke <#${channel.id}>.`)]
            });
        } catch (error) {
            console.error(error);
            await message.reply({ embeds: [createErrorEmbed('Gagal menyimpan konfigurasi server.')] });
        }
    },
};
