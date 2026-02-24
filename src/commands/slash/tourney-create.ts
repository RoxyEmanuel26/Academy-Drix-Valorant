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


import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { Tournament } from '../../database/models/Tournament';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';

export default {
    data: new SlashCommandBuilder()
        .setName('tourney-create')
        .setDescription('Buat turnamen komunitas baru (Admin Only)')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Nama Turnamen')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return;
        const name = interaction.options.getString('name', true);

        await Tournament.create({
            guildId: interaction.guildId,
            name,
            status: 'upcoming',
            teams: [],
            matches: [],
            config: { maxTeams: 8, mode: '5v5', startDate: new Date(Date.now() + 86400000 * 7) }
        });

        const embed = createFunEmbed(
            '🏆 Turnamen Dibuat!',
            `Turnamen **${name}** berhasil dibuat!\n\nPlayer bisa mendaftar dengan command \`/tourney-register\`.`
        );
        await interaction.reply({ embeds: [embed] });
    },
};
