import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getRsoAuthUrl } from '../../services/riot/rso';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';
import { env } from '../../config/env';

export default {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Hubungkan akun Riot (VALORANT) kamu ke bot.'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!isFeatureEnabled('valorantStats')) {
            return interaction.reply({ content: 'Fitur akun dan statistik VALORANT sedang dinonaktifkan oleh admin. Nanti akan menyala ya! ✨', ephemeral: true });
        }

        if (!env.riot.apiKey || !env.riot.rso.clientId || !env.riot.rso.clientSecret || !env.riot.rso.redirectUri) {
            return interaction.reply({ embeds: [createErrorEmbed('Riot API/RSO belum dikonfigurasi sepenuhnya. Fitur belum dapat digunakan.')], ephemeral: true });
        }

        const url = getRsoAuthUrl();
        const embed = createFunEmbed(
            '🔗 Link Akun Riot',
            `Silakan klik [link ini](${url}) untuk login via Riot Sign On.\n\nJangan khawatir, bot ini aman dan mematuhi Riot Games Policy! Kami hanya mengambil data dasar untuk Leaderboard dan Fun Games.`
        );

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
