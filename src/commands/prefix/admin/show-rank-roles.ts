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

import { Message, PermissionsBitField, EmbedBuilder } from 'discord.js';
import { VALORANT_RANKS } from '../../../utils/rankDetector';
import { featureFlags } from '../../../config/featureFlags';

export default {
    name: 'show-rank-roles',
    aliases: ['showrankroles', 'test-rank'],
    description: '[ADMIN] Tampilkan peran server apa saja yang terdeteksi sebagai rank VALORANT.',

    async execute(message: Message, args: string[]) {
        if (!featureFlags.profile || !featureFlags.rankFromRole) {
            return message.reply('Fitur Profile Rank sedang dinonaktifkan.');
        }

        if (!message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return message.reply('❌ Command admin!');
        }

        const guild = message.guild;
        if (!guild) return message.reply('Gunakan command di server.');

        const serverRoles = guild.roles.cache.values();
        const roleMapping: Record<string, string[]> = {};

        for (const rankData of VALORANT_RANKS) {
            if (rankData.rank === 'Unranked') continue;
            roleMapping[rankData.rank] = [];

            for (const role of serverRoles) {
                const lowName = role.name.toLowerCase();
                if (rankData.keywords.some(kw => lowName.includes(kw))) {
                    roleMapping[rankData.rank].push(`<@&${role.id}>`);
                }
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('🔍 Status Deteksi Role Rank Server')
            .setDescription('Daftar role server yang akan terdeteksi menjadi Rank oleh Bot.\n(Pastikan bot ditaruh di urutan tertinggi!)')
            .setColor(0x2B2D31);

        const lines = [];
        for (const rankData of VALORANT_RANKS) {
            if (rankData.rank === 'Unranked') continue;

            const detected = roleMapping[rankData.rank];
            if (detected.length > 0) {
                lines.push(`${rankData.emoji} **${rankData.rank}**: ${detected.join(', ')}`);
            } else {
                lines.push(`${rankData.emoji} **${rankData.rank}**: ❌ *TIDAK ADA*`);
            }
        }

        embed.addFields({ name: 'Assigned Server Roles', value: lines.join('\n') });
        embed.setFooter({ text: 'Agar terdeteksi, nama role harus mengandung string rank (contoh: "Diamond" atau "Plat")' });

        return message.reply({ embeds: [embed] });
    },
};
