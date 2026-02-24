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

import { SlashCommandBuilder, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import { featureFlags } from '../../../config/featureFlags';

const cooldowns = new Map<string, number>();

export default {
    data: new SlashCommandBuilder()
        .setName('set-main-agent')
        .setDescription('Set 1 hingga 3 Agent VALORANT andalanmu untuk ditampilkan di Profile Card!'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!featureFlags.profile) {
            return interaction.reply({ content: 'Fitur profil sedang dimatikan oleh admin.', ephemeral: true });
        }

        // Standard 1 Minute Cooldown for DB Writes
        const userId = interaction.user.id;
        const now = Date.now();
        if (cooldowns.has(userId) && (now - cooldowns.get(userId)!) < 60000) {
            return interaction.reply({ content: '⏳ Tunggu sebentar! Kamu baru saja mengatur agent. Coba lagi dalam 1 menit.', ephemeral: true });
        }

        const modal = new ModalBuilder()
            .setCustomId('modal_set_main_agent')
            .setTitle('Set Main Agent Kamu');

        const agent1Input = new TextInputBuilder()
            .setCustomId('agent_1')
            .setLabel("Main Agent (Ke-1)")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Contoh: Jett")
            .setRequired(true)
            .setMaxLength(20);

        const agent2Input = new TextInputBuilder()
            .setCustomId('agent_2')
            .setLabel("Second Agent (Ke-2) [Opsional]")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Contoh: Reyna")
            .setRequired(false)
            .setMaxLength(20);

        const agent3Input = new TextInputBuilder()
            .setCustomId('agent_3')
            .setLabel("Third Agent (Ke-3) [Opsional]")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("Contoh: Omen")
            .setRequired(false)
            .setMaxLength(20);

        const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(agent1Input);
        const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(agent2Input);
        const row3 = new ActionRowBuilder<TextInputBuilder>().addComponents(agent3Input);

        modal.addComponents(row1, row2, row3);

        await interaction.showModal(modal);
        // Cooldown will be set in the modal submit handler (interactionCreate.ts)
    },
};
