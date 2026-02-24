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


import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { GamePoints } from '../../../database/models/GamePoints';

export default {
    data: new SlashCommandBuilder()
        .setName('admin-points')
        .setDescription('Manage user points (Administrator Only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcmd =>
            subcmd.setName('add')
                .setDescription('Tambahkan poin ke player')
                .addUserOption(opt => opt.setName('user').setDescription('Player').setRequired(true))
                .addIntegerOption(opt => opt.setName('amount').setDescription('Jumlah Poin').setRequired(true))
        )
        .addSubcommand(subcmd =>
            subcmd.setName('remove')
                .setDescription('Kurangi poin dari player')
                .addUserOption(opt => opt.setName('user').setDescription('Player').setRequired(true))
                .addIntegerOption(opt => opt.setName('amount').setDescription('Jumlah Poin').setRequired(true))
        )
        .addSubcommand(subcmd =>
            subcmd.setName('reset_weekly')
                .setDescription('Manual reset poin mingguan server ini')
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return;

        const subcmd = interaction.options.getSubcommand();

        if (subcmd === 'reset_weekly') {
            await GamePoints.updateMany({ guildId: interaction.guildId }, { $set: { weeklyPoints: 0 } });
            await interaction.reply({ content: '✅ Poin mingguan seluruh pemain di server ini telah direset.', ephemeral: true });
            return;
        }

        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        if (!user || !amount) return;

        let userStats = await GamePoints.findOne({ guildId: interaction.guildId, userId: user.id });

        if (!userStats) {
            if (subcmd === 'remove') {
                await interaction.reply({ content: `❌ ${user.username} tidak memiliki data poin.`, ephemeral: true });
                return;
            }
            userStats = new GamePoints({ guildId: interaction.guildId, userId: user.id, username: user.username });
        }

        if (subcmd === 'add') {
            userStats.totalPoints += amount;
            userStats.weeklyPoints += amount;
            userStats.monthlyPoints += amount;
            userStats.pointsHistory.unshift({
                game: 'Admin Give',
                points: amount,
                reason: 'Diberikan oleh Administrator',
                earnedAt: new Date()
            });
            await userStats.save();

            const embed = new EmbedBuilder()
                .setTitle('🎁 Reward Poin Admin')
                .setColor(0x2ECC71)
                .setDescription(`Admin memberikan **+${amount} Poin** kepada <@${user.id}>!`);

            await interaction.reply({ embeds: [embed] });

        } else if (subcmd === 'remove') {
            userStats.totalPoints = Math.max(0, userStats.totalPoints - amount);
            userStats.weeklyPoints = Math.max(0, userStats.weeklyPoints - amount);
            userStats.monthlyPoints = Math.max(0, userStats.monthlyPoints - amount);
            await userStats.save();

            await interaction.reply({ content: `✅ Berhasil mengurangi ${amount} poin dari ${user.username}.`, ephemeral: true });
        }
    },
};
