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


import { Events, Interaction } from 'discord.js';
import { User } from '../database/models/User';
import { LfgPost } from '../database/models/LfgPost';
import { createLfgEmbed, createFunEmbed } from '../utils/embed';
import { agentEmojiHints } from '../data/valorant';

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

                if (action === 'masih') {
                    // ID format: lfg_masih_userId_lfgId
                    const parts = interaction.customId.split('_');
                    if (parts.length >= 4) {
                        pendingUserId = parts[2];
                        lfgId = parts.slice(3).join('_');
                    } else {
                        lfgId = interaction.customId.replace(`lfg_masih_`, '');
                    }
                } else {
                    // ID format: lfg_telat_lfgId
                    lfgId = interaction.customId.replace(`lfg_telat_`, '');
                }

                try {
                    const lfgPost = await LfgPost.findById(lfgId);

                    if (!lfgPost) {
                        await interaction.reply({ content: 'Party ini sudah tidak ditemukan di database.', ephemeral: true });
                        return;
                    }

                    if (interaction.user.id !== lfgPost.ownerId) {
                        await interaction.reply({ content: 'Hanya pembuat Party yang bisa menekan tombol ini!', ephemeral: true });
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
                                    const newEmbed = createLfgEmbed(lfgPost.mode, lfgPost.note, lfgPost.participants, lfgPost.voiceChannelId)
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

                        await interaction.reply({ content: replyText, ephemeral: false });

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
                                const newEmbed = createLfgEmbed(lfgPost.mode, lfgPost.note, lfgPost.participants, lfgPost.voiceChannelId, true)
                                    .setThumbnail(originalMessage.embeds[0]?.thumbnail?.url || interaction.user.displayAvatarURL());
                                await originalMessage.edit({ embeds: [newEmbed] });
                            }
                        } catch (e) {
                            console.error('Failed to update timed out LFG embed:', e);
                        }

                        await interaction.message.delete().catch(() => { });
                        await interaction.reply({ content: 'Oke, Party ini ditandai sebagai batal / telat. 🛑', ephemeral: true });
                    }
                } catch (err) {
                    console.error('LFG Timeout Button Error:', err);
                    await interaction.reply({ content: 'Terjadi kesalahan saat memproses.', ephemeral: true });
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
                    await interaction.reply({ content: `❌ Agent \`${agent1}\` tidak ditemukan di database game VALORANT.`, ephemeral: true });
                    return;
                }
                if (agent2 && !validAgents.includes(agent2)) {
                    await interaction.reply({ content: `❌ Agent \`${agent2}\` tidak ditemukan di database game VALORANT.`, ephemeral: true });
                    return;
                }
                if (agent3 && !validAgents.includes(agent3)) {
                    await interaction.reply({ content: `❌ Agent \`${agent3}\` tidak ditemukan di database game VALORANT.`, ephemeral: true });
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
                        await interaction.reply({ content: '❌ Bio kamu mengandung kata-kata tidak pantas! Tolong ganti dengan kata yang lebih baik 😊', ephemeral: true });
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
                await interaction.followUp({ content: 'Ada kesalahan saat mengeksekusi command ini!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Ada kesalahan saat mengeksekusi command ini!', ephemeral: true });
            }
        }
    },
};
