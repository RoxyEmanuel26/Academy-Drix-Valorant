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


import { Message, EmbedBuilder, PermissionsBitField, TextChannel } from 'discord.js';
import { GamePoints } from '../../../database/models/GamePoints';

export default {
    name: 'admin-points',
    aliases: ['givepoints', 'addpoints', 'removepoints'],
    description: 'Manage user points (Administrator Only). Penggunaan: !givepoints @user 500',
    async execute(message: Message, args: string[]) {
        if (!message.guildId) return;

        // Check permission
        if (!message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await message.reply('❌ Kamu bukan Administrator!');
            return;
        }

        const action = message.content.split(' ')[0].toLowerCase(); // e.g. !givepoints

        if (args[0] === 'reset_weekly') {
            await GamePoints.updateMany({ guildId: message.guildId }, { $set: { weeklyPoints: 0 } });
            await message.reply('✅ Poin mingguan seluruh pemain di server ini telah direset.');
            return;
        }

        const targetUser = message.mentions.users.first();
        if (!targetUser) {
            await message.reply('⚠️ Harap mention player yang ingin diberikan/dikurangi poinnya.');
            return;
        }

        const amount = parseInt(args[1]);
        if (isNaN(amount) || amount <= 0) {
            await message.reply('⚠️ Harap masukkan jumlah poin yang valid (angka > 0).');
            return;
        }

        let userStats = await GamePoints.findOne({ guildId: message.guildId, userId: targetUser.id });

        if (!userStats) {
            if (action.includes('remove')) {
                await message.reply(`❌ ${targetUser.username} tidak memiliki data poin.`);
                return;
            }
            userStats = new GamePoints({ guildId: message.guildId, userId: targetUser.id, username: targetUser.username });
        }

        if (action.includes('give') || action.includes('add')) {
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
                .setDescription(`Admin <@${message.author.id}> memberikan **+${amount} Poin** kepada <@${targetUser.id}>!\nTotal Poin: ${userStats.totalPoints}`);

            await (message.channel as TextChannel).send({ embeds: [embed] });
        } else if (action.includes('remove')) {
            userStats.totalPoints = Math.max(0, userStats.totalPoints - amount);
            userStats.weeklyPoints = Math.max(0, userStats.weeklyPoints - amount);
            userStats.monthlyPoints = Math.max(0, userStats.monthlyPoints - amount);
            await userStats.save();

            await message.reply(`✅ Berhasil mengurangi ${amount} poin dari ${targetUser.username}. Sisa Poin: ${userStats.totalPoints}`);
        }
    },
};
