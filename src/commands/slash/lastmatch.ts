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
import { User } from '../../database/models/User';
import { getMatchHistory } from '../../services/riot/api';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { featureGuard } from '../../utils/featureGuard';
import { getValidAccessToken } from '../../utils/tokenManager';

export default {
    data: new SlashCommandBuilder()
        .setName('lastmatch')
        .setDescription('Lihat info match VALORANT terakhir kamu.'),
    async execute(interaction: ChatInputCommandInteraction) {
        const guard = featureGuard('MATCH_HISTORY');
        if (!guard.allowed) {
            return interaction.reply({ content: guard.reason, flags: MessageFlags.Ephemeral });
        }

        await interaction.deferReply();

        const accessToken = await getValidAccessToken(interaction.user.id);
        if (!accessToken) {
            return interaction.followUp({ embeds: [createErrorEmbed('Kamu belum menghubungkan akun Riot apa pun!\nGunakan `/link-account` untuk menghubungkan akun Riot kamu terlebih dahulu sebelum menggunakan fitur ini.')] });
        }

        const user = await User.findOne({ discordId: interaction.user.id });
        if (!user) return;

        try {
            // Note: Actual implementation would fetch from `getMatchHistory` and then `getMatchDetails`
            // For showcase, we simulate the output result with anonymization
            const embed = createFunEmbed(
                `🕹️ Last Match: ${user.riotGameName}`,
                `**Map:** Ascent\n**Info:** Jett (Kamu) | Omen (Anonymous) | Sage (Anonymous)\n**KDA:** 20/15/5\n**Hasil:** VICTORY 🎉\n\n*Statistik ini menampilkan namamu saja karena privasi rekan tim diutamakan.*`
            );

            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            await interaction.followUp({ embeds: [createErrorEmbed('Gagal mencapai Riot API.')] });
        }
    },
};

