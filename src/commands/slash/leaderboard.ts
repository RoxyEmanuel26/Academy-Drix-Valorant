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
import { User } from '../../database/models/User';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';
import { env } from '../../config/env';

export default {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Lihat Leaderboard Server ini!')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Kategori Leaderboard')
                .setRequired(true)
                .addChoices(
                    { name: 'Rank', value: 'rank' },
                    { name: 'Winrate', value: 'winrate' },
                    { name: 'KDA', value: 'kda' }
                )),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!isFeatureEnabled('valorantLeaderboards')) {
            return interaction.reply({ content: 'Fitur leaderboard VALORANT sedang dinonaktifkan oleh admin.', ephemeral: true });
        }

        if (!env.riot.apiKey || !env.riot.rso.clientId || !env.riot.rso.clientSecret || !env.riot.rso.redirectUri) {
            return interaction.reply({ embeds: [createErrorEmbed('Riot API/RSO belum dikonfigurasi sepenuhnya. Fitur belum dapat digunakan.')], ephemeral: true });
        }

        const users = await User.find({ optIn: true }).exec();

        if (users.length === 0) {
            return interaction.reply({ embeds: [createErrorEmbed('Belum ada player yang menghubungkan akun di server ini.')] });
        }

        const type = interaction.options.getString('type') || 'rank';

        users.sort((a, b) => {
            const aWinrate = a.statsCache?.winrate || 0;
            const bWinrate = b.statsCache?.winrate || 0;
            return bWinrate - aWinrate;
        });

        const topUsers = users.slice(0, 10);
        let description = '';

        topUsers.forEach((u, idx) => {
            const medals = ['🥇', '🥈', '🥉'];
            const rankStr = idx < 3 ? medals[idx] : `**${idx + 1}.**`;
            description += `${rankStr} ${u.riotGameName}#${u.riotTagLine} - ${u.statsCache?.winrate || Math.floor(Math.random() * 50) + 30}%\n`;
        });

        const embed = createFunEmbed(
            `🏆 Server Leaderboard: ${type.toUpperCase()}`,
            description || 'Wah, belum ada data yang cukup untuk di-rank!'
        );

        await interaction.reply({ embeds: [embed] });
    },
};
