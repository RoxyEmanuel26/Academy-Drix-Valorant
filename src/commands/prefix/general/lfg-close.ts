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
import { LfgPost } from '../../../database/models/LfgPost';
import { createFunEmbed, createErrorEmbed } from '../../../utils/embed';

export default {
    name: 'lfp-close',
    aliases: ['lfg-close', 'party-close'],
    description: 'Tutup postingan LFP/LFG kamu yang aktif.',
    async execute(message: Message, args: string[]) {
        if (!message.guildId) return;

        const updateData = await LfgPost.updateMany(
            { guildId: message.guildId, ownerId: message.author.id, active: true },
            { active: false }
        );

        if (updateData.modifiedCount === 0) {
            return message.reply({ embeds: [createErrorEmbed('Kamu tidak punya postingan LFG aktif.')] });
        }

        await message.reply({ embeds: [createFunEmbed('❌ LFG Ditutup', `Berhasil menutup ${updateData.modifiedCount} postingan LFG kamu.`)] });
    },
};
