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


import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { LfgPost } from '../../database/models/LfgPost';
import { createLfgEmbed } from '../../utils/embed';
import { env } from '../../config/env';

export default {
    data: new SlashCommandBuilder()
        .setName('lfp')
        .setDescription('Cari teman main VALORANT!')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Mode game')
                .setRequired(true)
                .addChoices({ name: 'Competitive', value: 'Competitive' }, { name: 'Unrated', value: 'Unrated' }))
        .addStringOption(option =>
            option.setName('note')
                .setDescription('Catatan tambahan (Rank, Role, dll)')
                .setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return;

        if (env.discord.lfgChannelId && interaction.channelId !== env.discord.lfgChannelId) {
            await interaction.reply({ content: `Silakan cari party game di channel <#${env.discord.lfgChannelId}>`, ephemeral: true });
            return;
        }

        const mode = interaction.options.getString('mode') || 'Unrated';
        const note = interaction.options.getString('note') || 'Ayo main bareng!';

        const member = interaction.member as GuildMember;
        const voiceChannelId = member.voice.channelId || undefined;

        const participants = [interaction.user.id];
        const embed = createLfgEmbed(mode, note, participants, voiceChannelId)
            .setThumbnail(interaction.user.displayAvatarURL());

        const roleMention = env.discord.valorantRoleId ? `<@&${env.discord.valorantRoleId}>` : '@here';

        const reply = await interaction.reply({ content: roleMention, embeds: [embed], fetchReply: true });

        await LfgPost.create({
            guildId: interaction.guildId,
            messageId: reply.id,
            ownerId: interaction.user.id,
            mode,
            note,
            active: true,
            participants,
            voiceChannelId,
            channelId: interaction.channelId
        });
    },
};
