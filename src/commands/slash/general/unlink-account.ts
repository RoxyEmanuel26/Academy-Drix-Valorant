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


import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { User } from '../../../database/models/User';
import { createFunEmbed, createErrorEmbed } from '../../../utils/embed';

export default {
    data: new SlashCommandBuilder()
        .setName('unlink-account')
        .setDescription('Hapus hubungan akun Riot dari bot ini.'),
    async execute(interaction: ChatInputCommandInteraction) {
        const user = await User.findOne({ discordId: interaction.user.id });

        if (!user || (!user.optedIn && !user.accessToken)) {
            return interaction.reply({ embeds: [createErrorEmbed('Kamu belum menghubungkan akun Riot apa pun!')], flags: MessageFlags.Ephemeral });
        }

        // Hapus HANYA data Riot/RSO dan reset optIn flag, biarkan data intro/poin tetap ada
        user.optedIn = false;
        user.accessToken = undefined;
        user.refreshToken = undefined;
        user.tokenExpiry = undefined;
        user.riotPuuid = undefined;
        user.riotGameName = undefined;
        user.riotTagLine = undefined;
        user.region = 'ap';

        await user.save();

        await interaction.reply({
            embeds: [createFunEmbed('💔 Unlinked', 'Akun Riot kamu telah berhasil dihapus dari sistem kami. Kami harap kamu kembali lagi nanti!')],
            flags: MessageFlags.Ephemeral
        });
    },
};

