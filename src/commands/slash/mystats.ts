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


import { SlashCommandBuilder, ChatInputCommandInteraction , MessageFlags } from 'discord.js';
import { User } from '../../database/models/User';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';
import { env } from '../../config/env';

export default {
    data: new SlashCommandBuilder()
        .setName('mystats')
        .setDescription('Lihat statisik santai VALORANT kamu!'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!isFeatureEnabled('valorantStats')) {
            return interaction.reply({ content: 'Fitur statistik VALORANT sedang dinonaktifkan oleh admin. Nanti nyala lagi kok! ✨', flags: MessageFlags.Ephemeral });
        }

        if (!env.riot.apiKey || !env.riot.rso.clientId || !env.riot.rso.clientSecret || !env.riot.rso.redirectUri) {
            return interaction.reply({ embeds: [createErrorEmbed('Riot API/RSO belum dikonfigurasi. Fitur belum dapat digunakan.')], flags: MessageFlags.Ephemeral });
        }

        await interaction.deferReply();
        const user = await User.findOne({ discordId: interaction.user.id });

        if (!user || !user.optIn || !user.riotPuuid) {
            return interaction.followUp({ embeds: [createErrorEmbed('Kamu belum menghubungkan akun Riot apa pun!\nGunakan `/link` untuk memulai.')] });
        }

        try {
            const stats = user.statsCache || { rank: 'Unranked', winrate: 50, totalWins: 10, totalLosses: 10 };

            const embed = createFunEmbed(
                `📊 Stats: ${user.riotGameName}#${user.riotTagLine}`,
                `**Rank:** ${stats.rank}\n**Winrate:** ${stats.winrate}%\n**Matches:** ${stats.totalWins} W / ${stats.totalLosses} L\n\n*Statistik dihitung dari data terakhir yang tersinkronisasi di server ini!*`
            ).setThumbnail(interaction.user.displayAvatarURL());

            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.followUp({ embeds: [createErrorEmbed('Gagal mengambil data statistik dari database.')] });
        }
    },
};

