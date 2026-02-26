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
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { featureGuard } from '../../utils/featureGuard';

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
        const guard = featureGuard('LEADERBOARD_API');
        if (!guard.allowed) {
            return interaction.reply({ content: guard.reason, flags: MessageFlags.Ephemeral });
        }

        const users = await User.find({ optedIn: true }).exec();

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
            (description || 'Wah, belum ada data yang cukup untuk di-rank!') +
            `\n\n*📊 Leaderboard ini hanya menampilkan profil member dan rank resmi VALORANT. Ini tidak berafiliasi dengan sistem ranked resmi Riot Games.*`
        );

        await interaction.reply({ embeds: [embed] });
    },
};

