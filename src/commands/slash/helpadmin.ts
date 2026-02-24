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
import { createFunEmbed } from '../../utils/embed';

export default {
    data: new SlashCommandBuilder()
        .setName('helpadmin')
        .setDescription('Menu Bantuan khusus untuk para Administrator Bot!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        const embed = createFunEmbed(
            '⚙️ Academy Drix Valorant - Admin Help Menu',
            'Daftar Perintah Eksklusif Administrator:\n\n' +
            '`/config` atau `!config` - Panel Pengaturan Global Server\n' +
            '`/set-leaderboard-channel` - Menetapkan channel auto-post leaderboard\n' +
            '`/admin-profile` atau `!admin-profile` - Mereset Profil atau Bio anggota yang nakal\n' +
            '`/show-rank-roles` atau `!show-rank-roles` - Verifikasi mapping Role Tracker Discord\n' +
            '`/admin-points` atau `!admin-points` - Bypass limit koin / reset point seseorang\n' +
            '`/tourney-create` - Membangun Setup Turnamen Valorant\n' +
            '`/admin-parse-intros` - Mengekstrak Bio player lawas dari riwayat channel #introducing\n'
        );

        await interaction.reply({ embeds: [embed] });
    },
};


