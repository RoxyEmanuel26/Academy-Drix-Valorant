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

import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember, MessageFlags } from 'discord.js';
import { featureFlags } from '../../../config/featureFlags';
import { User } from '../../../database/models/User';
import { getMemberRank } from '../../../utils/rankDetector';
import { generateProfileCard } from '../../../utils/imageGenerator';

const cooldowns = new Map<string, number>();

export default {
    data: new SlashCommandBuilder()
        .setName('card')
        .setDescription('Tampilkan Graphic ID Card Valorant kamu!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Pilih user lain untuk melihat kartu mereka (opsional)')
                .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!featureFlags.profile) {
            return interaction.reply({ content: 'Fitur Profile sedang dinonaktifkan oleh admin.', flags: MessageFlags.Ephemeral });
        }

        const callerId = interaction.user.id;
        const now = Date.now();
        if (cooldowns.has(callerId) && (now - cooldowns.get(callerId)!) < 5000) {
            return interaction.reply({ content: '⏳ Sabar ya, cooldown command Card adalah 5 detik!', flags: MessageFlags.Ephemeral });
        }

        const targetUser = interaction.options.getUser('user') || interaction.user;
        const guild = interaction.guild;
        if (!guild) return interaction.reply({ content: 'Command ini hanya bisa digunakan di server!', flags: MessageFlags.Ephemeral });

        let targetMember = interaction.options.getMember('user') as GuildMember;
        if (!targetMember) {
            try {
                targetMember = await guild.members.fetch(targetUser.id);
            } catch {
                return interaction.reply({ content: '❌ User tersebut tidak ada di server ini.', flags: MessageFlags.Ephemeral });
            }
        }

        await interaction.deferReply();
        cooldowns.set(callerId, now);

        try {
            const userDb = await User.findOne({ discordId: targetUser.id });
            const { rank } = await getMemberRank(targetMember, userDb, featureFlags);

            let gender = '-';
            const roleNames = targetMember.roles.cache.map(r => r.name.toLowerCase());
            if (roleNames.some(r => r.includes('prince') && !r.includes('princess'))) gender = 'Laki Laki';
            else if (roleNames.some(r => r.includes('princess'))) gender = 'Perempuan';

            const joinDate = targetMember.joinedAt
                ? targetMember.joinedAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                : '-';

            const attachment = await generateProfileCard({
                discordId: targetUser.id,
                username: targetMember.displayName || targetUser.username,
                gender: gender,
                rankName: rank,
                domicile: userDb?.domicile || '-',
                joinDate: joinDate,
                avatarUrl: targetUser.displayAvatarURL({ extension: 'png', size: 256 })
            });

            await interaction.editReply({ files: [attachment] });

        } catch (error) {
            console.error('[Card Slash]', error);
            await interaction.editReply('❌ Terjadi kesalahan saat memuat KTP. Coba lagi nanti ya!');
        }
    },
};


