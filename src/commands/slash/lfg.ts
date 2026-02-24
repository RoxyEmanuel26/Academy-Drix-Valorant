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


import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember , MessageFlags } from 'discord.js';
import { LfgPost } from '../../database/models/LfgPost';
import { GuildConfig } from '../../database/models/GuildConfig';
import { createLfgEmbed } from '../../utils/embed';

export default {
    data: new SlashCommandBuilder()
        .setName('lfg')
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
        const embed = createLfgEmbed(mode, note, participants, voiceChannelId)
            .setThumbnail(interaction.user.displayAvatarURL());

        const roleMention = config?.valorantRoleId ? `<@&${config.valorantRoleId}>` : '@here';

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

