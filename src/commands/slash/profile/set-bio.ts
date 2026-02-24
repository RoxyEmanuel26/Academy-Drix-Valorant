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

import { SlashCommandBuilder, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder , MessageFlags } from 'discord.js';
import { featureFlags } from '../../../config/featureFlags';

const cooldowns = new Map<string, number>();

export default {
    data: new SlashCommandBuilder()
        .setName('set-bio')
        .setDescription('Buat kalimat bio diri kamu untuk dipajang di Profile Card (Max 100 character)'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!featureFlags.profile) {
            return interaction.reply({ content: 'Fitur profil sedang dimatikan oleh admin.', flags: MessageFlags.Ephemeral });
        }

        // 1 Minute cooldown array
        const userId = interaction.user.id;
        const now = Date.now();
        if (cooldowns.has(userId) && (now - cooldowns.get(userId)!) < 5000) {
            return interaction.reply({ content: '⏳ Tunggu sebentar! Kamu baru saja mengganti bio. Coba lagi dalam 5 detik.', flags: MessageFlags.Ephemeral });
        }

        const modal = new ModalBuilder()
            .setCustomId('modal_set_bio')
            .setTitle('Tulis Bio Profil Kamu');

        const bioInput = new TextInputBuilder()
            .setCustomId('bio_text')
            .setLabel("Teks Bio")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Contoh: Solo controller player, clutch or kick!")
            .setRequired(true)
            .setMaxLength(100);

        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(bioInput);
        modal.addComponents(row);

        await interaction.showModal(modal);
    },
};


