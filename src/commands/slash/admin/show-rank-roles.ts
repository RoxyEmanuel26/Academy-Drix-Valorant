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

import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, EmbedBuilder , MessageFlags } from 'discord.js';
import { VALORANT_RANKS } from '../../../utils/rankDetector';
import { featureFlags } from '../../../config/featureFlags';

export default {
    data: new SlashCommandBuilder()
        .setName('show-rank-roles')
        .setDescription('[ADMIN] Tampilkan peran server apa saja yang terdeteksi sebagai rank VALORANT.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!featureFlags.profile || !featureFlags.rankFromRole) {
            return interaction.reply({ content: 'Fitur Profile Rank sedang dinonaktifkan.', flags: MessageFlags.Ephemeral });
        }

        const guild = interaction.guild;
        if (!guild) return interaction.reply({ content: 'Gunakan command di server.', flags: MessageFlags.Ephemeral });

        // Map server roles logic
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
            .setDescription('Daftar role server yang akan terdeteksi menjadi Rank oleh Bot.\n(Pastikan bot ditaruh di atas role-role ini agar fitur klaim rank / auto sync bisa berjalan!)')
            .setColor(0x2B2D31);

        const lines = [];
        for (const rankData of VALORANT_RANKS) {
            if (rankData.rank === 'Unranked') continue;

            const detected = roleMapping[rankData.rank];
            if (detected.length > 0) {
                lines.push(`${rankData.emoji} **${rankData.rank}**: ${detected.join(', ')}`);
            } else {
                lines.push(`${rankData.emoji} **${rankData.rank}**: ❌ *Belum ada role server yang terhubung.*`);
            }
        }

        embed.addFields({ name: 'Role Associations', value: lines.join('\n') });
        embed.setFooter({ text: 'Agar terdeteksi, role harus mengandung nama rank (cth: "🔥 Radiant" atau "Ascendant")' });

        return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    },
};

