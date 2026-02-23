"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const User_1 = require("../../database/models/User");
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('me')
        .setDescription('Tampilkan profil VALORANT kamu yang terhubung.'),
    async execute(interaction) {
        if (!(0, featureFlags_1.isFeatureEnabled)('valorantStats')) {
            return interaction.reply({ content: 'Fitur profil VALORANT belum aktif.', ephemeral: true });
        }
        const user = await User_1.User.findOne({ discordId: interaction.user.id });
        if (!user || !user.optIn) {
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu belum menghubungkan akun Riot apa pun!\nGunakan `/link` untuk memulai.')], ephemeral: true });
        }
        const embed = (0, embed_1.createFunEmbed)(`🎮 Profil: ${user.riotGameName}#${user.riotTagLine}`, `**Region:** ${user.region.toUpperCase()}\n**Status:** Terhubung sejak ${user.linkedAt?.toLocaleDateString() || 'tidak diketahui'}`).setThumbnail(interaction.user.displayAvatarURL());
        await interaction.reply({ embeds: [embed] });
    },
};
