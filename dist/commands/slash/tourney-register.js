"use strict";
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
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu wajib connect akun menggunakan `/link` sebelum ikut turnamen!')], ephemeral: true });
        const tourney = await Tournament_1.Tournament.findOne({ guildId: interaction.guildId, status: 'upcoming' });
        if (!tourney)
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Tidak ada turnamen yang open registration saat ini.')], ephemeral: true });
        const teamName = interaction.options.getString('team', true);
        if (tourney.teams.some(t => t.name.toLowerCase() === teamName.toLowerCase() || t.captainId === interaction.user.id)) {
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu sudah terdaftar sebagai kapten tim atau nama tim sudah dipakai.')], ephemeral: true });
        }
        tourney.teams.push({ name: teamName, captainId: interaction.user.id, members: [interaction.user.id] });
        await tourney.save();
        await interaction.reply({ embeds: [(0, embed_1.createFunEmbed)('📜 Pendaftaran Berhasil', `Tim **${teamName}** berhasil didaftarkan ke turnamen **${tourney.name}**!`)] });
    },
};
