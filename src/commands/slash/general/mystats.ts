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
import { featureGuard } from '../../../utils/featureGuard';
import { getValidAccessToken } from '../../../utils/tokenManager';

export default {
    data: new SlashCommandBuilder()
        .setName('mystats')
        .setDescription('Lihat statisik santai VALORANT kamu!'),
    async execute(interaction: ChatInputCommandInteraction) {
        const guard = featureGuard('STATS');
        if (!guard.allowed) {
            return interaction.reply({ content: guard.reason, flags: MessageFlags.Ephemeral });
        }

        await interaction.deferReply();

        const accessToken = await getValidAccessToken(interaction.user.id);
        if (!accessToken) {
            return interaction.followUp({ embeds: [createErrorEmbed('Kamu belum menghubungkan akun Riot apa pun!\nGunakan `/link-account` untuk menghubungkan akun Riot kamu terlebih dahulu sebelum menggunakan fitur ini.')] });
        }

        const user = await User.findOne({ discordId: interaction.user.id });
        if (!user) return; // Should exist if accessToken returned valid

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

