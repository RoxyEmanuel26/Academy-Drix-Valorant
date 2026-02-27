"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const Tournament_1 = require("../../database/models/Tournament");
const User_1 = require("../../database/models/User");
const embed_1 = require("../../utils/embed");
exports.default = {
    name: 'tourney-register',
    description: 'Daftarkan dirimu ke turnamen yang sedang open!',
    async execute(message, args) {
        if (!message.guildId)
            return;
        const user = await User_1.User.findOne({ discordId: message.author.id });
        if (!user || !user.optedIn)
            return message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu wajib connect akun menggunakan `!link-account` sebelum ikut turnamen!')] });
        const tourney = await Tournament_1.Tournament.findOne({ guildId: message.guildId, status: 'upcoming' });
        if (!tourney)
            return message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Tidak ada turnamen yang open registration saat ini.')] });
        const teamName = args.join(' ');
        if (!teamName)
            return message.reply('Berikan nama tim! (contoh: `!tourney-register Tim GG`)');
        if (tourney.teams.some(t => t.name.toLowerCase() === teamName.toLowerCase() || t.captainId === message.author.id)) {
            return message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu sudah terdaftar sebagai kapten tim atau nama tim sudah dipakai.')] });
        }
        tourney.teams.push({ name: teamName, captainId: message.author.id, members: [message.author.id] });
        await tourney.save();
        await message.reply({ embeds: [(0, embed_1.createFunEmbed)('📜 Pendaftaran Berhasil', `Tim **${teamName}** berhasil didaftarkan ke turnamen **${tourney.name}**!`)] });
    },
};
