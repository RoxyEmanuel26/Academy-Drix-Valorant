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


import { Events, Interaction, MessageFlags } from 'discord.js';
import { User } from '../database/models/User';
import { LfgPost } from '../database/models/LfgPost';
import { createLfgEmbed, createFunEmbed } from '../utils/embed';
import { agentEmojiHints } from '../data/valorant';
import { detectRankFromRoles } from '../utils/rankDetector';

function sanitizeAgent(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(client: any, interaction: Interaction) {
        // --- LFG Timeout Buttons Logic ---
        if (interaction.isButton()) {
            if (interaction.customId.startsWith('lfg_masih_') || interaction.customId.startsWith('lfg_telat_')) {
                const action = interaction.customId.startsWith('lfg_masih_') ? 'masih' : 'telat';

                // Parsing dynamic ID format
                let lfgId = '';
                let pendingUserId = '';

                // ID format: lfg_masih_userId_lfgId or lfg_telat_userId_lfgId_targetMessageId
                let targetMessageId = '';
                const parts = interaction.customId.split('_');

                if (action === 'masih' && parts.length >= 4) {
                    pendingUserId = parts[2];
                    lfgId = parts.slice(3).join('_');
                } else if (action === 'telat' && parts.length >= 5) {
                    pendingUserId = parts[2];
                    lfgId = parts[3];
                    targetMessageId = parts[4];
                } else {
                    lfgId = interaction.customId.replace(`lfg_${action}_`, '');
                }

                try {
                    const lfgPost = await LfgPost.findById(lfgId);

                    if (!lfgPost) {
                        await interaction.reply({ content: 'Party ini sudah tidak ditemukan di database.', flags: MessageFlags.Ephemeral });
                        return;
                    }

                    if (interaction.user.id !== lfgPost.ownerId) {
                        await interaction.reply({ content: 'Hanya pembuat Party yang bisa menekan tombol ini!', flags: MessageFlags.Ephemeral });
                        return;
                    }

                    if (action === 'masih') {
                        lfgPost.createdAt = new Date();
                        lfgPost.timeoutPrompted = false;

                        // Auto-join the pending user if they haven't joined yet
                        let autoJoined = false;
                        if (pendingUserId && !lfgPost.participants.includes(pendingUserId)) {
                            lfgPost.participants.push(pendingUserId);
                            autoJoined = true;

                            if (lfgPost.participants.length >= 5) {
                                lfgPost.active = false;
                            }
                        }

                        await lfgPost.save();

                        // Try updating the original embed to reflect the new player
                        if (autoJoined) {
                            try {
                                const originalMessage = await interaction.channel?.messages.fetch(lfgPost.messageId);
                                if (originalMessage) {
                                    // Build formatted participants list with dynamic roles
                                    const formattedParticipants: string[] = [];
                                    for (const pid of lfgPost.participants) {
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

                                    // Extract rank from note field or provide fallback
                                    let rankDisplay = '-';
                                    let cleanNote = lfgPost.note || '';
                                    if (cleanNote) {
                                        const rankMatch = cleanNote.match(/^\[(.*?)\]\s?(.*)/);
                                        if (rankMatch) {
                                            rankDisplay = rankMatch[1];
                                            cleanNote = rankMatch[2]; // Using clean note so embed places rank distinctively
                                        }
                                    }

                                    const newEmbed = createLfgEmbed(lfgPost.mode, cleanNote, formattedParticipants, rankDisplay, (lfgPost.voiceChannelId || undefined))
                                        .setThumbnail(originalMessage.embeds[0]?.thumbnail?.url || interaction.user.displayAvatarURL());
                                    await originalMessage.edit({ embeds: [newEmbed] });
                                }
                            } catch (e) {
                                console.error('Failed to update LFG embed after auto-join:', e);
                            }
                        }

                        await interaction.message.delete().catch(() => { });

                        let replyText = 'Sip! Pencarian party diperpanjang. 🕒';
                        if (autoJoined) {
                            replyText = `Sip! <@${pendingUserId}> berhasil ditambahkan ke tim.`;
                        }

                        await interaction.reply({ content: replyText });

                        if (autoJoined && lfgPost.participants.length === 5) {
                            const mentions = lfgPost.participants.map((id: string) => `<@${id}>`).join(' ');
                            if (interaction.channel && 'send' in interaction.channel) {
                                await interaction.channel.send(`Team penuh! Ayo berangkat 🚀\n${mentions}`);
                            }
                        }

                    } else if (action === 'telat') {
                        lfgPost.active = false;
                        lfgPost.isTimeout = true;
                        await lfgPost.save();

                        // Try updating the original embed to reflect [TIMEOUT] status
                        try {
                            const originalMessage = await interaction.channel?.messages.fetch(lfgPost.messageId);
                            if (originalMessage) {
                                // Build formatted participants list with dynamic roles
                                const formattedParticipants: string[] = [];
                                for (const pid of lfgPost.participants) {
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

                                // Extract rank from note field or provide fallback
                                let rankDisplay = '-';
                                let cleanNote = lfgPost.note || '';
                                if (cleanNote) {
                                    const rankMatch = cleanNote.match(/^\[(.*?)\]\s?(.*)/);
                                    if (rankMatch) {
                                        rankDisplay = rankMatch[1];
                                        cleanNote = rankMatch[2]; // Using clean note so embed places rank distinctively
                                    }
                                }

                                const newEmbed = createLfgEmbed(lfgPost.mode, cleanNote, formattedParticipants, rankDisplay, (lfgPost.voiceChannelId || undefined), true)
                                    .setThumbnail(originalMessage.embeds[0]?.thumbnail?.url || interaction.user.displayAvatarURL());
                                await originalMessage.edit({ embeds: [newEmbed] });
                            }
                        } catch (e) {
                            console.error('Failed to update timed out LFG embed:', e);
                        }

                        await interaction.message.delete().catch(() => { });

                        let repliedToJoiningUser = false;
                        if (pendingUserId && targetMessageId && interaction.channel) {
                            try {
                                const targetMsg = await interaction.channel.messages.fetch(targetMessageId);
                                if (targetMsg) {
                                    await targetMsg.reply({ content: `Haloo <@${pendingUserId}>, Yahh partynya sudah tutup atau kamu yang telat wkwkw 🛑 coba bikin baru aja yaa` });
                                    repliedToJoiningUser = true;
                                }
                            } catch (e) {
                                console.error('Failed to reply to joining user message', e);
                            }
                        }

                        if (!repliedToJoiningUser) {
                            if (interaction.channel && 'send' in interaction.channel) {
                                if (pendingUserId) {
                                    await interaction.channel.send({ content: `<@${pendingUserId}> Oke, Yahh partynya sudah tutup atau kamu yang telat wkwkw 🛑` }).catch(() => { });
                                } else {
                                    await interaction.channel.send({ content: 'Oke, Yahh partynya sudah tutup atau kamu yang telat wkwkw 🛑' }).catch(() => { });
                                }
                            }
                        }

                        await interaction.deferUpdate().catch(() => { }); // Ack interaction silently
                    }
                } catch (err) {
                    console.error('LFG Timeout Button Error:', err);
                    await interaction.reply({ content: 'Terjadi kesalahan saat memproses.', flags: MessageFlags.Ephemeral });
                }
                return;
            }
        }
        // --- Modal Submit Logic ---
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'modal_set_main_agent') {
                const agent1Raw = interaction.fields.getTextInputValue('agent_1');
                const agent2Raw = interaction.fields.getTextInputValue('agent_2') || '';
                const agent3Raw = interaction.fields.getTextInputValue('agent_3') || '';

                const agent1 = sanitizeAgent(agent1Raw);
                const agent2 = agent2Raw ? sanitizeAgent(agent2Raw) : '';
                const agent3 = agent3Raw ? sanitizeAgent(agent3Raw) : '';

                const validAgents = Object.keys(agentEmojiHints);

                if (!validAgents.includes(agent1)) {
                    await interaction.reply({ content: `❌ Agent \`${agent1}\` tidak ditemukan di database game VALORANT.`, flags: MessageFlags.Ephemeral });
                    return;
                }
                if (agent2 && !validAgents.includes(agent2)) {
                    await interaction.reply({ content: `❌ Agent \`${agent2}\` tidak ditemukan di database game VALORANT.`, flags: MessageFlags.Ephemeral });
                    return;
                }
                if (agent3 && !validAgents.includes(agent3)) {
                    await interaction.reply({ content: `❌ Agent \`${agent3}\` tidak ditemukan di database game VALORANT.`, flags: MessageFlags.Ephemeral });
                    return;
                }

                await User.findOneAndUpdate(
                    { discordId: interaction.user.id },
                    {
                        mainAgent: agent1,
                        mainAgent2: agent2 || undefined,
                        mainAgent3: agent3 || undefined
                    },
                    { upsert: true, new: true }
                );

                const getEmoji = (name: string) => agentEmojiHints[name] ? agentEmojiHints[name][0] : '';
                const lines = [];
                lines.push(`🥇 Main    : **${agent1}** ${getEmoji(agent1)}`);
                if (agent2) lines.push(`🥈 Second  : **${agent2}** ${getEmoji(agent2)}`);
                else lines.push(`🥈 Second  : *-*`);
                if (agent3) lines.push(`🥉 Third   : **${agent3}** ${getEmoji(agent3)}`);
                else lines.push(`🥉 Third   : *-*`);

                const embed = createFunEmbed(
                    '✅ Main Agent Kamu Updated!',
                    `━━━━━━━━━━━━━━━━━━━━━━\n${lines.join('\n')}\n━━━━━━━━━━━━━━━━━━━━━━\nSekarang semua orang tau kamu ${agent1} main sejati! 🔪`
                );

                await interaction.reply({ embeds: [embed] });
                return;
            }

            if (interaction.customId === 'modal_set_bio') {
                let bioText = interaction.fields.getTextInputValue('bio_text').trim();

                bioText = bioText.replace(/https?:\/\/\S+/gi, '[Link Removed]');

                const badWords = ['anjing', 'babi', 'kontol', 'memek', 'ngentot', 'bangsat', 'fuck', 'shit', 'bitch'];
                const lowerBio = bioText.toLowerCase();
                for (const word of badWords) {
                    if (lowerBio.includes(word)) {
                        await interaction.reply({ content: '❌ Bio kamu mengandung kata-kata tidak pantas! Tolong ganti dengan kata yang lebih baik 😊', flags: MessageFlags.Ephemeral });
                        return;
                    }
                }

                await User.findOneAndUpdate(
                    { discordId: interaction.user.id },
                    { bio: bioText },
                    { upsert: true, new: true }
                );

                const embed = createFunEmbed(
                    '✅ Bio Kamu Tersimpan!',
                    `━━━━━━━━━━━━━━━━━━━━━━\n📝 Bio baru kamu:\n*"${bioText}"*\n━━━━━━━━━━━━━━━━━━━━━━\nBio ini akan tampil secara permanen di profile card kamu!`
                );

                await interaction.reply({ embeds: [embed] });
                return;
            }
        }

        if (!interaction.isChatInputCommand()) return;

        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Ada kesalahan saat mengeksekusi command ini!', flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: 'Ada kesalahan saat mengeksekusi command ini!', flags: MessageFlags.Ephemeral });
            }
        }
    },
};

