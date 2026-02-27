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


import { Message } from 'discord.js';
import { Tournament } from '../../../database/models/Tournament';
import { User } from '../../../database/models/User';
import { createFunEmbed, createErrorEmbed } from '../../../utils/embed';

export default {
    name: 'tourney-register',
    description: 'Daftarkan dirimu ke turnamen yang sedang open!',
    async execute(message: Message, args: string[]) {
        if (!message.guildId) return;

        const user = await User.findOne({ discordId: message.author.id });
        if (!user || !user.optedIn) return message.reply({ embeds: [createErrorEmbed('Kamu wajib connect akun menggunakan `!link-account` sebelum ikut turnamen!')] });

        const tourney = await Tournament.findOne({ guildId: message.guildId, status: 'upcoming' });
        if (!tourney) return message.reply({ embeds: [createErrorEmbed('Tidak ada turnamen yang open registration saat ini.')] });

        const teamName = args.join(' ');
        if (!teamName) return message.reply('Berikan nama tim! (contoh: `!tourney-register Tim GG`)');

        if (tourney.teams.some(t => t.name.toLowerCase() === teamName.toLowerCase() || t.captainId === message.author.id)) {
            return message.reply({ embeds: [createErrorEmbed('Kamu sudah terdaftar sebagai kapten tim atau nama tim sudah dipakai.')] });
        }

        tourney.teams.push({ name: teamName, captainId: message.author.id, members: [message.author.id] });
        await tourney.save();

        await message.reply({ embeds: [createFunEmbed('📜 Pendaftaran Berhasil', `Tim **${teamName}** berhasil didaftarkan ke turnamen **${tourney.name}**!`)] });
    },
};
