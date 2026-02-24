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
const LfgPost_1 = require("../../database/models/LfgPost");
const embed_1 = require("../../utils/embed");
exports.default = {
    name: 'lfg-close',
    description: 'Tutup postingan LFG kamu yang aktif.',
    async execute(message, args) {
        if (!message.guildId)
            return;
        const updateData = await LfgPost_1.LfgPost.updateMany({ guildId: message.guildId, ownerId: message.author.id, active: true }, { active: false });
        if (updateData.modifiedCount === 0) {
            return message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu tidak punya postingan LFG aktif.')] });
        }
        await message.reply({ embeds: [(0, embed_1.createFunEmbed)('❌ LFG Ditutup', `Berhasil menutup ${updateData.modifiedCount} postingan LFG kamu.`)] });
    },
};
