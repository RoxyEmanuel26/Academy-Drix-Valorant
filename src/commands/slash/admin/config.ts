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


import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits , MessageFlags } from 'discord.js';
import { GuildConfig } from '../../../database/models/GuildConfig';
import { createFunEmbed } from '../../../utils/embed';

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

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    },
};

