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


import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags } from 'discord.js';
import { LfgPost } from '../../database/models/LfgPost';
import { GuildConfig } from '../../database/models/GuildConfig';
import { createLfgEmbed } from '../../utils/embed';
import { VALORANT_RANKS, detectRankFromRoles } from '../../utils/rankDetector';

export default {
    name: 'lfp',
    aliases: ['lfg', 'party', 'carimabar', 'mabar', 'valoyuk', 'valo', 'main'],
    description: 'Cari teman main VALORANT!',
    async execute(message: Message, args: string[]) {
        if (!message.guildId) return;

        const config = await GuildConfig.findOne({ guildId: message.guildId });

        if (config?.lfgChannelId && message.channelId !== config.lfgChannelId) {
            await message.reply(`Silakan cari party game di channel <#${config.lfgChannelId}>`);
            return;
        }

        const note = args.join(' ') || 'Ayo main bareng!';

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('lfg_unrated')
                    .setLabel('Mode: Unrated')
                    .setStyle(ButtonStyle.Success), // Green
                new ButtonBuilder()
                    .setCustomId('lfg_competitive')
                    .setLabel('Mode: Competitive')
                    .setStyle(ButtonStyle.Danger) // Red
            );

        const promptMessage = await message.reply({
            content: 'Pilih mode game untuk LFP / Mabar kamu:',
            components: [row]
        });

        const collector = promptMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 120000 // 2 minutes total for both steps
        });

        // Track state for the multi-step process
        let selectedMode: 'Competitive' | 'Unrated' | null = null;
        let selectedRank: string | null = null;

        collector.on('collect', async i => {
            if (i.user.id !== message.author.id) {
                await i.reply({ content: 'Ini pencarian party punya orang lain!', flags: MessageFlags.Ephemeral });
                return;
            }

            // Step 1: Mode Selection
            if (i.customId === 'lfg_competitive' || i.customId === 'lfg_unrated') {
                selectedMode = i.customId === 'lfg_competitive' ? 'Competitive' : 'Unrated';

                // Construct Rank Buttons
                const row1 = new ActionRowBuilder<ButtonBuilder>();
                const row2 = new ActionRowBuilder<ButtonBuilder>();

                const reversedRanks = [...VALORANT_RANKS].reverse();

                reversedRanks.forEach((rankData, index) => {
                    const btn = new ButtonBuilder()
                        .setCustomId(`rank_${rankData.rank}`)
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

                await i.update({
                    content: `Mode **${selectedMode}** dipilih! Sekarang pilih Rank Kamu saat ini:`,
                    components: [row1, row2]
                });
                return;
            }

            // Step 2: Rank Selection
            if (i.customId.startsWith('rank_')) {
                selectedRank = i.customId.replace('rank_', '');
                const rankInfo = VALORANT_RANKS.find(r => r.rank === selectedRank);

                const rankDisplay = `${rankInfo?.emoji || ''} ${selectedRank}`;

                const participants = [message.author.id];
                const member = await i.guild?.members.fetch(i.user.id);
                const voiceChannelId = member?.voice.channelId || undefined;

                // Build formatted participants list with dynamic roles
                const formattedParticipants = [];
                for (const pid of participants) {
                    try {
                        const pMember = await i.guild?.members.fetch(pid);
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

                const embed = createLfgEmbed(selectedMode!, note, formattedParticipants, rankDisplay, (voiceChannelId || undefined))
                    .setThumbnail(message.author.displayAvatarURL());

                const roleMention = config?.valorantRoleId ? `<@&${config.valorantRoleId}>` : '@here';

                let replyId = '';
                if ('send' in message.channel) {
                    const reply = await message.channel.send({ content: roleMention, embeds: [embed] });
                    replyId = reply.id;
                }

                if (replyId) {
                    await LfgPost.create({
                        guildId: message.guildId!,
                        messageId: replyId,
                        ownerId: message.author.id,
                        mode: selectedMode,
                        note: note, // note no longer contains rank prefix, it's pure note
                        active: true,
                        participants,
                        voiceChannelId,
                        channelId: message.channelId
                    });
                }

                await promptMessage.delete().catch(() => { });
                collector.stop('completed');
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                promptMessage.edit({ content: 'Waktu memilih opsi Party telah habis.', components: [] }).catch(() => { });
            }
        });
    },
};

