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
import { Tournament } from '../../database/models/Tournament';
import { createFunEmbed } from '../../utils/embed';

export default {
    name: 'tourney-create',
    description: 'Buat turnamen komunitas baru (Admin Only)',
    async execute(message: Message, args: string[]) {
        if (!message.guildId) return;
        if (!message.member?.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ Command khusus admin.');
        }

        const name = args.join(' ');
        if (!name) return message.reply('Berikan nama turnamen! (contoh: `!tourney-create Academy Cup 1`)');

        await Tournament.create({
            guildId: message.guildId,
            name,
            status: 'upcoming',
            teams: [],
            matches: [],
            config: { maxTeams: 8, mode: '5v5', startDate: new Date(Date.now() + 86400000 * 7) }
        });

        const embed = createFunEmbed(
            '🏆 Turnamen Dibuat!',
            `Turnamen **${name}** berhasil dibuat!\n\nPlayer bisa mendaftar dengan command \`!tourney-register\`.`
        );
        await message.reply({ embeds: [embed] });
    },
};
