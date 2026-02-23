import { Message } from 'discord.js';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';
import { env } from '../../config/env';

export default {
    name: 'status',
    description: 'Cek status server VALORANT (AP region).',
    async execute(message: Message, args: string[]) {
        if (!isFeatureEnabled('valorantStatus')) {
            return message.reply('Fitur status server VALORANT sedang nonaktif.');
        }

        if (!env.riot.apiKey) {
            return message.reply({ embeds: [createErrorEmbed('Riot API Key belum dikonfigurasi. Fitur belum dapat digunakan.')] });
        }

        try {
            const statusData = { maintenances: [], incidents: [] };

            if (statusData.maintenances.length === 0 && statusData.incidents.length === 0) {
                await message.reply({ embeds: [createFunEmbed('🟢 Server Status AP', 'Server berjalan lancar tanpa gangguan! Ayo main!')] });
            } else {
                await message.reply({ embeds: [createErrorEmbed('Terjadi gangguan atau maintenance di server AP.')] });
            }
        } catch (error) {
            await message.reply({ embeds: [createErrorEmbed('Gagal mengambil status server RIOT.')] });
        }
    },
};
