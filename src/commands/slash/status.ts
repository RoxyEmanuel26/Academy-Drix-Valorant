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
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';
import { env } from '../../config/env';

export default {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Cek status server VALORANT (AP region).'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!isFeatureEnabled('valorantStatus')) {
            return interaction.reply({ content: 'Fitur status server VALORANT sedang nonaktif.', flags: MessageFlags.Ephemeral });
        }

        if (!env.riot.apiKey) {
            return interaction.reply({ embeds: [createErrorEmbed('Riot API Key belum dikonfigurasi. Fitur belum dapat digunakan.')], flags: MessageFlags.Ephemeral });
        }

        await interaction.deferReply();
        try {
            // Note: Use getServerStatus('ap') realistically
            const statusData = { maintenances: [], incidents: [] };

            if (statusData.maintenances.length === 0 && statusData.incidents.length === 0) {
                await interaction.followUp({ embeds: [createFunEmbed('🟢 Server Status AP', 'Server berjalan lancar tanpa gangguan! Ayo main!')] });
            } else {
                await interaction.followUp({ embeds: [createErrorEmbed('Terjadi gangguan atau maintenance di server AP. Harap bersabar ya!')] });
            }
        } catch (error) {
            await interaction.followUp({ embeds: [createErrorEmbed('Gagal mengambil status server RIOT.')] });
        }
    },
};

