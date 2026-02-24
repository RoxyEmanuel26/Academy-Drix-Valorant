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

import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember, Role , MessageFlags } from 'discord.js';
import { featureFlags } from '../../../config/featureFlags';
import { VALORANT_RANKS } from '../../../utils/rankDetector';
import { createFunEmbed } from '../../../utils/embed';

const cooldowns = new Map<string, number>();

export default {
    data: new SlashCommandBuilder()
        .setName('rank-role-claim')
        .setDescription('Klaim / assign role rank VALORANT kamu secara manual di server ini')
        .addStringOption(option => {
            option.setName('rank')
                .setDescription('Pilih rank VALORANT kamu yang sebenarnya (Jujur ya!)')
                .setRequired(true);

            // Generate list of ranks, omitting the fallback "Unranked"
            for (const r of VALORANT_RANKS) {
                if (r.rank !== 'Unranked') {
                    option.addChoices({ name: r.rank, value: r.rank.toLowerCase() });
                }
            }
            return option;
        }),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!featureFlags.profile || !featureFlags.rankFromRole) {
            return interaction.reply({ content: 'Fitur Profile atau Rank Detection sedang dinonaktifkan.', flags: MessageFlags.Ephemeral });
        }

        const userId = interaction.user.id;
        const now = Date.now();
        // 10 minutes cooldown logic to prevent role-spamming
        if (cooldowns.has(userId) && (now - cooldowns.get(userId)!) < 5000) {
            return interaction.reply({ content: '⏳ Tunggu sebentar! Kamu baru saja klaim role rank. Coba lagi dalam 5 detik.', flags: MessageFlags.Ephemeral });
        }

        await interaction.deferReply({ ephemeral: false });

        const selectedRankValue = interaction.options.getString('rank', true);
        const rankData = VALORANT_RANKS.find(r => r.rank.toLowerCase() === selectedRankValue);

        if (!rankData) {
            return interaction.editReply('Pilihan rank tidak valid.');
        }

        const member = interaction.member as GuildMember;
        const guild = interaction.guild;
        if (!guild) return interaction.editReply('❌ Perintah ini hanya bisa dijalankan di dalam server!');

        // 1. Locate the exact role in the server
        let targetRole: Role | undefined;
        for (const role of guild.roles.cache.values()) {
            const lowName = role.name.toLowerCase();
            if (rankData.keywords.some(kw => lowName.includes(kw))) {
                targetRole = role;
                break;
            }
        }

        if (!targetRole) {
            return interaction.editReply(`❌ Waduh! Role untuk rank **${rankData.rank}** tidak ditemukan di server ini. Tolong minta admin server untuk membuat role yang mengandung kata "${rankData.rank}" ya!`);
        }

        // 2. Clear old rank roles if the member has any
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

        const currentRankRoles = member.roles.cache.filter(r => allSystemRankRoleIds.includes(r.id) && r.id !== targetRole?.id);

        try {
            if (currentRankRoles.size > 0) {
                await member.roles.remove(currentRankRoles);
            }
            // 3. Assign the new Role
            await member.roles.add(targetRole);
            cooldowns.set(userId, now);

            // 4. Return Confirmation
            const embed = createFunEmbed(
                '✅ Role Rank Diklaim!',
                `━━━━━━━━━━━━━━━━━━━━━━\n🥇 Rank      : **${rankData.rank}** ${rankData.emoji}\n🎭 Role      : <@&${targetRole.id}>\n📌 Status    : *Role berhasil ditambahkan!*\n━━━━━━━━━━━━━━━━━━━━━━\n\n⚠️ *Ini rank yang kamu set sendiri ya!*\n*Nanti kalau kamu sudah \`/link\` akun Riot, rank akan auto-update sesuai rank aslimu 🎯*`
            ).setColor(rankData.color);

            return interaction.editReply({ embeds: [embed] });
        } catch (err) {
            console.error('[Role Claim] Failed to assign role', err);
            return interaction.editReply('❌ Gagal menambahkan role. Pastikan bot memiliki hierarki Role yang lebih tinggi daripada role Rank yang ingin ditambahkan!');
        }
    },
};


