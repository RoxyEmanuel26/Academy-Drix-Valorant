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

import { Message, GuildMember } from 'discord.js';
import { featureFlags } from '../../../config/featureFlags';
import { User } from '../../../database/models/User';
import { getMemberRank } from '../../../utils/rankDetector';
import { generateProfileCard } from '../../../utils/imageGenerator';

const cooldowns = new Map<string, number>();

export default {
    name: 'card',
    aliases: ['c'],
    description: 'Tampilkan Graphic ID Card Valorant kamu (contoh: !card atau !card @user)',
    async execute(message: Message, args: string[]) {
        if (!featureFlags.profile) {
            return message.reply('Fitur Profile sedang dinonaktifkan oleh admin.');
        }

        const callerId = message.author.id;
        const now = Date.now();
        if (cooldowns.has(callerId) && (now - cooldowns.get(callerId)!) < 15000) {
            return message.reply('⏳ Sabar ya, cooldown command Card adalah 15 detik!');
        }

        const guild = message.guild;
        if (!guild) return message.reply('Command ini hanya bisa digunakan di server!');

        let targetUser = message.author;
        let targetMember = message.member as GuildMember;

        if (message.mentions.users.size > 0) {
            targetUser = message.mentions.users.first()!;
            targetMember = await guild.members.fetch(targetUser.id).catch(() => null) as GuildMember;
            if (!targetMember) return message.reply('❌ User tersebut tidak ada di server ini.');
        }

        cooldowns.set(callerId, now);

        // Wait message
        const waitMsg = await message.reply('🔄 Sedang mencetak KTP kamu...');

        try {
            const userDb = await User.findOne({ discordId: targetUser.id });
            const { rank } = await getMemberRank(targetMember, userDb, featureFlags);

            let gender = '-';
            const roleNames = targetMember.roles.cache.map(r => r.name.toLowerCase());
            if (roleNames.some(r => r.includes('prince') && !r.includes('princess'))) gender = 'Laki Laki';
            else if (roleNames.some(r => r.includes('princess'))) gender = 'Perempuan';

            const attachment = await generateProfileCard({
                discordId: targetUser.id,
                username: targetMember.displayName || targetUser.username,
                gender: gender,
                rankName: rank,
                avatarUrl: targetUser.displayAvatarURL({ extension: 'png', size: 256 })
            });

            await waitMsg.edit({ content: null, files: [attachment] });

        } catch (error) {
            console.error('[Card Prefix]', error);
            await waitMsg.edit('❌ Terjadi kesalahan saat mencetak KTP. Coba lagi nanti ya!');
        }
    },
};
