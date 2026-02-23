"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const User_1 = require("../../database/models/User");
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('unlink')
        .setDescription('Hapus hubungan akun Riot dari bot ini.'),
    async execute(interaction) {
        if (!(0, featureFlags_1.isFeatureEnabled)('valorantStats')) {
            return interaction.reply({ content: 'Fitur akun dan statistik VALORANT sedang dinonaktifkan oleh admin.', ephemeral: true });
        }
        const user = await User_1.User.findOne({ discordId: interaction.user.id });
        if (!user || !user.optIn) {
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu belum menghubungkan akun Riot apa pun!')], ephemeral: true });
        }
        await User_1.User.deleteOne({ discordId: interaction.user.id });
        await interaction.reply({
            embeds: [(0, embed_1.createFunEmbed)('💔 Unlinked', 'Akun Riot kamu telah berhasil dihapus dari sistem kami. Kami harap kamu kembali lagi nanti!')],
            ephemeral: true
        });
    },
};
