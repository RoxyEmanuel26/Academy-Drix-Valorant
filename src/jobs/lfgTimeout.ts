import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { LfgPost } from '../database/models/LfgPost';
import { env } from '../config/env';

export const startLfgTimeoutJob = (client: Client) => {
    // Run the check every 1 minute
    setInterval(async () => {
        try {
            const timeoutMs = env.bot.lfgTimeoutMinutes * 60 * 1000;
            // Find LFGs that are older than the configured timeout, still active, not prompted yet
            const unPromptedOldLfgs = await LfgPost.find({
                active: true,
                timeoutPrompted: false,
                isTimeout: false,
                createdAt: { $lt: new Date(Date.now() - timeoutMs) }
            });

            for (const lfg of unPromptedOldLfgs) {
                try {
                    const channel = await client.channels.fetch(lfg.channelId);
                    if (channel && channel.isTextBased()) {
                        const row = new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`lfg_masih_${lfg._id}`)
                                    .setLabel('Masih')
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId(`lfg_telat_${lfg._id}`)
                                    .setLabel('Telat')
                                    .setStyle(ButtonStyle.Danger)
                            );

                        if ('send' in channel) {
                            await channel.send({
                                content: `<@${lfg.ownerId}> LFG kamu belum penuh nih sejak 1 jam yang lalu. Masih mau main atau udahan?`,
                                components: [row]
                            });
                        }
                    }

                    // Mark as prompted so we don't spam them every minute
                    lfg.timeoutPrompted = true;
                    await lfg.save();

                } catch (channelError) {
                    console.error(`Failed to handle LFG Timeout prompt for ${lfg._id}:`, channelError);
                }
            }

        } catch (error) {
            console.error('LFG Timeout Job Error:', error);
        }
    }, 60000); // 60,000 ms = 1 minute
};
