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

import { Message } from 'discord.js';
import { featureFlags } from '../../../config/featureFlags';
import { VALORANT_RANKS } from '../../../utils/rankDetector';
import { createFunEmbed } from '../../../utils/embed';

const cooldowns = new Map<string, number>();

export default {
    name: 'rank-role-claim',
    aliases: ['rank-claim', 'claim-rank'],
    description: 'Klaim / assign role rank VALORANT kamu secara manual di server ini (contoh: !claim-rank Gold)',

    async execute(message: Message, args: string[]) {
        if (!featureFlags.profile || !featureFlags.rankFromRole) {
            return message.reply('Fitur Profile atau Rank Detection sedang dinonaktifkan.');
        }

        const userId = message.author.id;
        const now = Date.now();
        if (cooldowns.has(userId) && (now - cooldowns.get(userId)!) < 5000) {
            return message.reply('⏳ Tunggu sebentar! Kamu baru saja klaim role rank. Coba lagi dalam 5 detik.');
        }

        if (args.length === 0) {
            return message.reply('❌ Tolong sebutkan rank-nya! Contoh: `!claim-rank Gold` atau `!claim-rank Immortal`');
        }

        const requestedRank = args[0].toLowerCase();
        const rankData = VALORANT_RANKS.find(r => r.rank.toLowerCase() === requestedRank && r.rank !== 'Unranked');

        if (!rankData) {
            return message.reply('❌ Pilihan rank tidak valid. Pilih dari Iron hingga Radiant.');
        }

        const member = message.member;
        const guild = message.guild;
        if (!guild || !member) return message.reply('❌ Perintah ini hanya bisa dijalankan di dalam server!');

        let targetRole;
        for (const role of guild.roles.cache.values()) {
            const lowName = role.name.toLowerCase();
            if (rankData.keywords.some(kw => lowName.includes(kw))) {
                targetRole = role;
                break;
            }
        }

        if (!targetRole) {
            return message.reply(`❌ Waduh! Role untuk rank **${rankData.rank}** tidak ditemukan di server ini. Tolong minta admin server untuk membuat role yang mengandung kata "${rankData.rank}" ya!`);
        }

        const allSystemRankRoleIds: string[] = [];
        for (const role of guild.roles.cache.values()) {
            const lowName = role.name.toLowerCase();
            for (const rd of VALORANT_RANKS) {
                if (rd.keywords.some(kw => lowName.includes(kw))) {
                    allSystemRankRoleIds.push(role.id);
                    break;
                }
            }
        }

        const currentRankRoles = member.roles.cache.filter(r => allSystemRankRoleIds.includes(r.id) && r.id !== targetRole.id);

        try {
            if (currentRankRoles.size > 0) {
                await member.roles.remove(currentRankRoles);
            }
            await member.roles.add(targetRole);
            cooldowns.set(userId, now);

            const embed = createFunEmbed(
                '✅ Role Rank Diklaim!',
                `━━━━━━━━━━━━━━━━━━━━━━\n🥇 Rank      : **${rankData.rank}** ${rankData.emoji}\n🎭 Role      : <@&${targetRole.id}>\n📌 Status    : *Role berhasil ditambahkan!*\n━━━━━━━━━━━━━━━━━━━━━━\n\n⚠️ *Ini rank yang kamu set sendiri ya!*\n*Nanti kalau kamu sudah \`/link\` akun Riot, rank akan auto-update sesuai rank aslimu 🎯*`
            ).setColor(rankData.color);

            return message.reply({ embeds: [embed] });
        } catch (err) {
            console.error('[Role Claim Prefix] Failed to assign role', err);
            return message.reply('❌ Gagal menambahkan role. Pastikan bot memiliki hierarki Role yang lebih tinggi daripada role Rank yang ingin ditambahkan!');
        }
    },
};

