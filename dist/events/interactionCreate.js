"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const LfgPost_1 = require("../database/models/LfgPost");
const embed_1 = require("../utils/embed");
exports.default = {
    name: discord_js_1.Events.InteractionCreate,
    once: false,
    async execute(client, interaction) {
        // --- LFG Timeout Buttons Logic ---
        if (interaction.isButton()) {
            if (interaction.customId.startsWith('lfg_masih_') || interaction.customId.startsWith('lfg_telat_')) {
                const action = interaction.customId.startsWith('lfg_masih_') ? 'masih' : 'telat';
                const lfgId = interaction.customId.replace(`lfg_${action}_`, '');
                try {
                    const lfgPost = await LfgPost_1.LfgPost.findById(lfgId);
                    if (!lfgPost) {
                        await interaction.reply({ content: 'LFG ini sudah tidak ditemukan di database.', ephemeral: true });
                        return;
                    }
                    if (interaction.user.id !== lfgPost.ownerId) {
                        await interaction.reply({ content: 'Hanya pembuat LFG yang bisa menekan tombol ini!', ephemeral: true });
                        return;
                    }
                    if (action === 'masih') {
                        // Reset "createdAt" to current time to extend another hour
                        lfgPost.createdAt = new Date();
                        lfgPost.timeoutPrompted = false;
                        await lfgPost.save();
                        await interaction.message.delete().catch(() => { });
                        await interaction.reply({ content: 'Sip! LFG diperpanjang 1 jam lagi pencariannya. 🕒', ephemeral: true });
                    }
                    else if (action === 'telat') {
                        lfgPost.active = false;
                        lfgPost.isTimeout = true;
                        await lfgPost.save();
                        // Try updating the original embed to reflect [TIMEOUT] status
                        try {
                            const originalMessage = await interaction.channel?.messages.fetch(lfgPost.messageId);
                            if (originalMessage) {
                                const newEmbed = (0, embed_1.createLfgEmbed)(lfgPost.mode, lfgPost.note, lfgPost.participants, lfgPost.voiceChannelId, true)
                                    .setThumbnail(originalMessage.embeds[0]?.thumbnail?.url || interaction.user.displayAvatarURL());
                                await originalMessage.edit({ embeds: [newEmbed] });
                            }
                        }
                        catch (e) {
                            console.error('Failed to update timed out LFG embed:', e);
                        }
                        await interaction.message.delete().catch(() => { });
                        await interaction.reply({ content: 'Oke, LFG ini ditandai sebagai batal / telat. 🛑', ephemeral: true });
                    }
                }
                catch (err) {
                    console.error('LFG Timeout Button Error:', err);
                    await interaction.reply({ content: 'Terjadi kesalahan saat memproses.', ephemeral: true });
                }
                return;
            }
        }
        // ---------------------------------
        if (!interaction.isChatInputCommand())
            return;
        const command = client.slashCommands.get(interaction.commandName);
        if (!command)
            return;
        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Ada kesalahan saat mengeksekusi command ini!', ephemeral: true });
            }
            else {
                await interaction.reply({ content: 'Ada kesalahan saat mengeksekusi command ini!', ephemeral: true });
            }
        }
    },
};
