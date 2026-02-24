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
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu tidak punya postingan LFG aktif.')], flags: discord_js_1.MessageFlags.Ephemeral });
        }
        await interaction.reply({ embeds: [(0, embed_1.createFunEmbed)('❌ LFG Ditutup', `Berhasil menutup ${updateData.modifiedCount} postingan LFG kamu.`)] });
    },
};
