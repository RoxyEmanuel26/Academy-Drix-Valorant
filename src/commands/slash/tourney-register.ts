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


import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Tournament } from '../../database/models/Tournament';
import { User } from '../../database/models/User';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';

export default {
    data: new SlashCommandBuilder()
        .setName('tourney-register')
        .setDescription('Daftarkan dirimu ke turnamen yang sedang open!')
        .addStringOption(option =>
            option.setName('team')
                .setDescription('Nama Tim kamu')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return;

        const user = await User.findOne({ discordId: interaction.user.id });
        if (!user || !user.optIn) return interaction.reply({ embeds: [createErrorEmbed('Kamu wajib connect akun menggunakan `/link` sebelum ikut turnamen!')], ephemeral: true });

        const tourney = await Tournament.findOne({ guildId: interaction.guildId, status: 'upcoming' });
        if (!tourney) return interaction.reply({ embeds: [createErrorEmbed('Tidak ada turnamen yang open registration saat ini.')], ephemeral: true });

        const teamName = interaction.options.getString('team', true);

        if (tourney.teams.some(t => t.name.toLowerCase() === teamName.toLowerCase() || t.captainId === interaction.user.id)) {
            return interaction.reply({ embeds: [createErrorEmbed('Kamu sudah terdaftar sebagai kapten tim atau nama tim sudah dipakai.')], ephemeral: true });
        }

        tourney.teams.push({ name: teamName, captainId: interaction.user.id, members: [interaction.user.id] });
        await tourney.save();

        await interaction.reply({ embeds: [createFunEmbed('📜 Pendaftaran Berhasil', `Tim **${teamName}** berhasil didaftarkan ke turnamen **${tourney.name}**!`)] });
    },
};
