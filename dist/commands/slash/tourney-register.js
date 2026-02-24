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
const discord_js_1 = require("discord.js");
const Tournament_1 = require("../../database/models/Tournament");
const User_1 = require("../../database/models/User");
const embed_1 = require("../../utils/embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('tourney-register')
        .setDescription('Daftarkan dirimu ke turnamen yang sedang open!')
        .addStringOption(option => option.setName('team')
        .setDescription('Nama Tim kamu')
        .setRequired(true)),
    async execute(interaction) {
        if (!interaction.guildId)
            return;
        const user = await User_1.User.findOne({ discordId: interaction.user.id });
        if (!user || !user.optIn)
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu wajib connect akun menggunakan `/link` sebelum ikut turnamen!')], flags: discord_js_1.MessageFlags.Ephemeral });
        const tourney = await Tournament_1.Tournament.findOne({ guildId: interaction.guildId, status: 'upcoming' });
        if (!tourney)
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Tidak ada turnamen yang open registration saat ini.')], flags: discord_js_1.MessageFlags.Ephemeral });
        const teamName = interaction.options.getString('team', true);
        if (tourney.teams.some(t => t.name.toLowerCase() === teamName.toLowerCase() || t.captainId === interaction.user.id)) {
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu sudah terdaftar sebagai kapten tim atau nama tim sudah dipakai.')], flags: discord_js_1.MessageFlags.Ephemeral });
        }
        tourney.teams.push({ name: teamName, captainId: interaction.user.id, members: [interaction.user.id] });
        await tourney.save();
        await interaction.reply({ embeds: [(0, embed_1.createFunEmbed)('📜 Pendaftaran Berhasil', `Tim **${teamName}** berhasil didaftarkan ke turnamen **${tourney.name}**!`)] });
    },
};
