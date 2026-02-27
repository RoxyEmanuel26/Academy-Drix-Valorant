/**
 * ---------------------------------------------------------------------
 * ⚡ WONDERPLAY - ACADEMY DRIX VALORANT BOT
 * ---------------------------------------------------------------------
 * @copyright (c) 2026 Roxy Emanuel - Soreang, West Java, Indonesia
 * @author    Roxy Emanuel <https://github.com/RoxyEmanuel26>
 * @link      https://github.com/RoxyEmanuel26/Academy-Drix-Valorant
 * @community WonderPlay Discord: https://discord.gg/A6b3dT2eey
 * ---------------------------------------------------------------------
 */


import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits , MessageFlags } from 'discord.js';
import { GuildConfig } from '../../../database/models/GuildConfig';
import { createFunEmbed } from '../../../utils/embed';

export default {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('⚙️ Setup ID Channel & Role Server untuk Bot (Admin Only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('lfg-channel')
                .setDescription('Set Channel untuk sistem LFG (Looking For Group/Party)')
                .setRequired(false))
        .addChannelOption(option =>
            option.setName('intro-channel')
                .setDescription('Set Channel untuk fitur perkenalan/parsing intro')
                .setRequired(false))
        .addRoleOption(option =>
            option.setName('valorant-role')
                .setDescription('Set Role Valorant yang akan di-ping ketika mencari party')
                .setRequired(false)),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return;

        const lfgChannel = interaction.options.getChannel('lfg-channel');
        const introChannel = interaction.options.getChannel('intro-channel');
        const valorantRole = interaction.options.getRole('valorant-role');

        if (!lfgChannel && !introChannel && !valorantRole) {
            return interaction.reply({ content: '❌ Silakan pilih minimal satu opsi untuk disetel.' });
        }

        // Fetch or create config
        let config = await GuildConfig.findOne({ guildId: interaction.guildId });
        if (!config) {
            config = new GuildConfig({ guildId: interaction.guildId });
        }

        const updates: string[] = [];

        if (lfgChannel) {
            config.lfgChannelId = lfgChannel.id;
            updates.push(`**LFG Channel:** <#${lfgChannel.id}>`);
        }
        if (introChannel) {
            config.introducingChannelId = introChannel.id;
            updates.push(`**Intro Channel:** <#${introChannel.id}>`);
        }
        if (valorantRole) {
            config.valorantRoleId = valorantRole.id;
            updates.push(`**Valorant Role:** <@&${valorantRole.id}>`);
        }

        await config.save();

        const embed = createFunEmbed(
            '✅ Setup Berhasil',
            `Konfigurasi untuk server ini telah diperbarui:\n\n${updates.join('\n')}`
        );

        await interaction.reply({ embeds: [embed] });
    },
};


