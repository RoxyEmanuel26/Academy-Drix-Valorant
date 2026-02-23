"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const LfgPost_1 = require("../../database/models/LfgPost");
const embed_1 = require("../../utils/embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('lfg-close')
        .setDescription('Tutup postingan LFG kamu yang aktif.'),
    async execute(interaction) {
        if (!interaction.guildId)
            return;
        const updateData = await LfgPost_1.LfgPost.updateMany({ guildId: interaction.guildId, ownerId: interaction.user.id, active: true }, { active: false });
        if (updateData.modifiedCount === 0) {
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu tidak punya postingan LFG aktif.')], ephemeral: true });
        }
        await interaction.reply({ embeds: [(0, embed_1.createFunEmbed)('❌ LFG Ditutup', `Berhasil menutup ${updateData.modifiedCount} postingan LFG kamu.`)] });
    },
};
