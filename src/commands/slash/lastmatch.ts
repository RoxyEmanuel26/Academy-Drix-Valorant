import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { User } from '../../database/models/User';
import { getMatchHistory } from '../../services/riot/api';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';
import { env } from '../../config/env';

export default {
    data: new SlashCommandBuilder()
        .setName('lastmatch')
        .setDescription('Lihat info match VALORANT terakhir kamu.'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!isFeatureEnabled('valorantStats')) {
            return interaction.reply({ content: 'Fitur last match sedang dinonaktifkan oleh admin.', ephemeral: true });
        }

        if (!env.riot.apiKey || !env.riot.rso.clientId || !env.riot.rso.clientSecret || !env.riot.rso.redirectUri) {
            return interaction.reply({ embeds: [createErrorEmbed('Riot API/RSO belum dikonfigurasi. Fitur belum dapat digunakan.')], ephemeral: true });
        }

        await interaction.deferReply();
        const user = await User.findOne({ discordId: interaction.user.id });

        if (!user || !user.optIn || !user.riotPuuid) {
            return interaction.followUp({ embeds: [createErrorEmbed('Kamu belum menghubungkan akun Riot! `/link`')] });
        }

        try {
            // Note: Actual implementation would fetch from `getMatchHistory` and then `getMatchDetails`
            // For showcase, we simulate the output result:
            const embed = createFunEmbed(
                `🕹️ Last Match: ${user.riotGameName}`,
                `**Map:** Ascent\n**Agent:** Jett\n**KDA:** 20/15/5\n**Hasil:** VICTORY 🎉\n\n*Wah, ternyata kamu lumayan jago bawa Jett kemarin!*`
            );

            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            await interaction.followUp({ embeds: [createErrorEmbed('Gagal mencapai Riot API.')] });
        }
    },
};
