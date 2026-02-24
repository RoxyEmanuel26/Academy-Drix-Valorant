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


import { SlashCommandBuilder, ChatInputCommandInteraction , MessageFlags } from 'discord.js';
import { LfgPost } from '../../database/models/LfgPost';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';

export default {
    data: new SlashCommandBuilder()
        .setName('lfg-close')
        .setDescription('Tutup postingan LFG kamu yang aktif.'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return;

        const updateData = await LfgPost.updateMany(
            { guildId: interaction.guildId, ownerId: interaction.user.id, active: true },
            { active: false }
        );

        if (updateData.modifiedCount === 0) {
            return interaction.reply({ embeds: [createErrorEmbed('Kamu tidak punya postingan LFG aktif.')], flags: MessageFlags.Ephemeral });
        }

        await interaction.reply({ embeds: [createFunEmbed('❌ LFG Ditutup', `Berhasil menutup ${updateData.modifiedCount} postingan LFG kamu.`)] });
    },
};

