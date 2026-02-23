import { Events, Interaction } from 'discord.js';
import { LfgPost } from '../database/models/LfgPost';
import { createLfgEmbed } from '../utils/embed';

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
                            const mentions = lfgPost.participants.map(id => `<@${id}>`).join(' ');
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
        // ---------------------------------

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
