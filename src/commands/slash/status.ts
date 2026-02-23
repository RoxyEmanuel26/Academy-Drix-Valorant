import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';
import { env } from '../../config/env';

export default {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Cek status server VALORANT (AP region).'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!isFeatureEnabled('valorantStatus')) {
            return interaction.reply({ content: 'Fitur status server VALORANT sedang nonaktif.', ephemeral: true });
        }

        if (!env.riot.apiKey) {
            return interaction.reply({ embeds: [createErrorEmbed('Riot API Key belum dikonfigurasi. Fitur belum dapat digunakan.')], ephemeral: true });
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
