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
import { LfgPost } from '../../../database/models/LfgPost';
import { GuildConfig } from '../../../database/models/GuildConfig';
import { createLfgEmbed } from '../../../utils/embed';
import { detectRankFromRoles } from '../../../utils/rankDetector';

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

        const config = await GuildConfig.findOne({ guildId: interaction.guildId });

        if (config?.lfgChannelId && interaction.channelId !== config.lfgChannelId) {
            await interaction.reply({ content: `Silakan cari party game di channel <#${config.lfgChannelId}>`, flags: MessageFlags.Ephemeral });
            return;
        }

        const mode = interaction.options.getString('mode') || 'Unrated';
        const note = interaction.options.getString('note') || 'Ayo main bareng!';

        const member = interaction.member as GuildMember;
        const voiceChannelId = member.voice.channelId || undefined;

        const participants = [interaction.user.id];

        // Extracted Note logic (this command doesn't provide buttons, pure note provided mostly)
        let rankDisplay = '-';
        let cleanNote = note;
        if (cleanNote) {
            const rankMatch = cleanNote.match(/^\[(.*?)\]\s?(.*)/);
            if (rankMatch) {
                rankDisplay = rankMatch[1];
                cleanNote = rankMatch[2];
            }
        }

        // Build formatted participants list with dynamic roles
        const formattedParticipants = [];
        for (const pid of participants) {
            try {
                const pMember = await interaction.guild?.members.fetch(pid);
                if (pMember) {
                    const pRank = detectRankFromRoles(pMember.roles.cache);
                    formattedParticipants.push(`<@${pid}> (${pRank.emoji} ${pRank.rank})`);
                } else {
                    formattedParticipants.push(`<@${pid}>`);
                }
            } catch {
                formattedParticipants.push(`<@${pid}>`);
            }
        }

        const embed = createLfgEmbed(mode, cleanNote, formattedParticipants, rankDisplay, (voiceChannelId || undefined))
            .setThumbnail(interaction.user.displayAvatarURL());

        const roleMention = config?.valorantRoleId ? `<@&${config.valorantRoleId}>` : '@here';

        await interaction.reply({ content: roleMention, embeds: [embed] });
        const reply = await interaction.fetchReply();

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

