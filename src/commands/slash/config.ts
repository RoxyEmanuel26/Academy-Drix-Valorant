import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { GuildConfig } from '../../database/models/GuildConfig';
import { createFunEmbed } from '../../utils/embed';

export default {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Tampilkan konfigurasi guild (Admin Only).')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return;
        const config = await GuildConfig.findOne({ guildId: interaction.guildId });

        const embed = createFunEmbed(
            '⚙️ Konfigurasi Server',
            `**Prefix:** ${config?.prefix || '!'}\n**Leaderboard Channel:** ${config?.leaderboardChannelId ? `<#${config.leaderboardChannelId}>` : 'Belum di-set'}\n**Missions Active:** ${config?.missionsEnabled !== false ? 'Ya' : 'Tidak'}`
        );

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
