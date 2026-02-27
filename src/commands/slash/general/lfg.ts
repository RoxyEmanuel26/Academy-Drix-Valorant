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


import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { LfgPost } from '../../../database/models/LfgPost';
import { GuildConfig } from '../../../database/models/GuildConfig';
import { createLfgEmbed } from '../../../utils/embed';
import { VALORANT_RANKS, detectRankFromRoles } from '../../../utils/rankDetector';

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

        // Construct Rank Buttons
        const row1 = new ActionRowBuilder<ButtonBuilder>();
        const row2 = new ActionRowBuilder<ButtonBuilder>();

        const reversedRanks = [...VALORANT_RANKS].reverse();

        reversedRanks.forEach((rankData, index) => {
            const btn = new ButtonBuilder()
                .setCustomId(`lfg_rank_${rankData.rank}`)
                .setLabel(rankData.rank)
                .setStyle(ButtonStyle.Secondary);

            if (rankData.emoji && rankData.emoji !== '') {
                btn.setEmoji(rankData.emoji);
            }

            if (index < 5) {
                row1.addComponents(btn);
            } else {
                row2.addComponents(btn);
            }
        });

        await interaction.reply({
            content: `Mode **${mode}** dipilih! Sebelum mencari party, pilih Rank Kamu saat ini:`,
            components: [row1, row2]
        });
        const promptMessage = await interaction.fetchReply();

        const collector = promptMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                await i.reply({ content: 'Ini pencarian party punya orang lain!', flags: MessageFlags.Ephemeral });
                return;
            }

            if (i.customId.startsWith('lfg_rank_')) {
                const selectedRank = i.customId.replace('lfg_rank_', '');
                const rankInfo = VALORANT_RANKS.find(r => r.rank === selectedRank);

                const rankDisplay = `${rankInfo?.emoji || ''} ${selectedRank}`;

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

                const embed = createLfgEmbed(mode, note, formattedParticipants, rankDisplay, (voiceChannelId || undefined))
                    .setThumbnail(interaction.user.displayAvatarURL());

                const roleMention = config?.valorantRoleId ? `<@&${config.valorantRoleId}>` : '@here';

                await i.update({
                    content: roleMention,
                    embeds: [embed],
                    components: []
                });

                await LfgPost.create({
                    guildId: interaction.guildId!,
                    messageId: promptMessage.id,
                    ownerId: interaction.user.id,
                    mode,
                    note: note, // note no longer contains rank prefix
                    active: true,
                    participants,
                    voiceChannelId,
                    channelId: interaction.channelId
                });

                collector.stop('completed');
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                interaction.editReply({ content: 'Waktu memilih opsi Party telah habis.', components: [] }).catch(() => { });
            }
        });
    },
};

