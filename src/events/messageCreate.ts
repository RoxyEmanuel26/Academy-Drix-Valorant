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


import { Events, Message } from 'discord.js';
import { GuildConfig } from '../database/models/GuildConfig';
import { LfgPost } from '../database/models/LfgPost';
import { createLfgEmbed } from '../utils/embed';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { detectRankFromRoles } from '../utils/rankDetector';
import { env } from '../config/env';
import { parseIntroduction } from '../utils/introParser';

export default {
    name: Events.MessageCreate,
    once: false,
    async execute(client: any, message: Message) {
        if (message.author.bot) return;

        let config: any = null;
        if (message.guildId) {
            try {
                config = await GuildConfig.findOne({ guildId: message.guildId });
                if (!config) {
                    // Create default if not exist
                    config = await GuildConfig.create({ guildId: message.guildId, prefix: '!' });
                }
            } catch (error) {
                console.error('Failed to fetch/create GuildConfig:', error);
            }
        }

        // --- Auto Parse Introduction Rules ---
        // Refactored to Phase 27 Database configs
        if (config?.introducingChannelId && message.channelId === config.introducingChannelId) {
            await parseIntroduction(message);
            // Non-blocking, let it proceed in case they used a bot command there
        }

        // --- LFG Reply-to-Join Logic ---
        if (message.reference && message.reference.messageId) {
            // Find LFG even if inactive so we can reject late-comers
            const lfgPost = await LfgPost.findOne({ messageId: message.reference.messageId });

            if (lfgPost) {
                if (!lfgPost.active) {
                    if (lfgPost.isTimeout) {
                        await message.reply('LU TELAT bro! Partynya udah bubarrr... kelamaan sii wkwkwkwk 🗿 mending bikin baru lagi');
                    } else if (lfgPost.participants.length >= 5) {
                        await message.reply('Maaf, team ini udah penuh! 😔');
                    }
                    return;
                }

                const userId = message.author.id;
                const timeoutMs = env.bot.lfgTimeoutMinutes * 60 * 1000;

                // Reply-Driven Timeout Check
                if (Date.now() - lfgPost.createdAt.getTime() > timeoutMs) {
                    if (lfgPost.timeoutPrompted) {
                        await message.reply('Maaf bro, party ini lagi dikonfirmasi ke kaptennya apakah masih main atau sudah kelar. Tunggu sebentar ya! ⏳');
                        return;
                    }

                    // Prompt the Owner First
                    lfgPost.timeoutPrompted = true;
                    await lfgPost.save();

                    const row = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`lfg_masih_${userId}_${lfgPost._id}`)
                                .setLabel('Masih')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId(`lfg_telat_${userId}_${lfgPost._id}_${message.id}`)
                                .setLabel('Telat')
                                .setStyle(ButtonStyle.Danger)
                        );

                    if ('send' in message.channel) {
                        await message.channel.send({
                            content: `<@${lfgPost.ownerId}> Partynya masi ada gak?, nih ada <@${userId}> yang mau join. Masih mau main atau udahan?`,
                            components: [row]
                        });
                    }
                    return; // Pause the join process
                }

                if (lfgPost.participants.includes(userId)) {
                    await message.reply('Kamu sudah ada di dalam tim ini!');
                    return;
                }

                if (lfgPost.participants.length >= 5) {
                    await message.reply('Maaf, team ini sudah penuh! 😔');
                    return;
                }

                lfgPost.participants.push(userId);

                if (lfgPost.participants.length === 5) {
                    lfgPost.active = false;
                }

                await lfgPost.save();

                try {
                    const originalMessage = await message.channel.messages.fetch(lfgPost.messageId);
                    if (originalMessage) {
                        // Build formatted participants list with dynamic roles
                        const formattedParticipants: string[] = [];
                        for (const pid of lfgPost.participants) {
                            try {
                                const pMember = await message.guild?.members.fetch(pid);
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
                                cleanNote = rankMatch[2]; // Using clean note so embed logic places rank distinctively
                            }
                        }

                        const newEmbed = createLfgEmbed(lfgPost.mode, cleanNote, formattedParticipants, rankDisplay, (lfgPost.voiceChannelId || undefined))
                            .setThumbnail(originalMessage.embeds[0]?.thumbnail?.url || message.author.displayAvatarURL());
                        await originalMessage.edit({ embeds: [newEmbed] });
                    }
                } catch (error) {
                    console.error('Failed to update LFG message:', error);
                }

                if (lfgPost.participants.length === 5) {
                    const mentions = lfgPost.participants.map(id => `<@${id}>`).join(' ');
                    if ('send' in message.channel) {
                        await message.channel.send(`Team penuh! Ayo GASS mabar 🚀\n${mentions}`);
                    }
                } else {
                    await message.reply('Berhasil join team! 🎉');
                }
                return; // Stop processing further commands for this message
            }
        }
        // -------------------------------

        // Fetch prefix from DB or use default
        let prefix = '!';
        if (message.guildId) {
            try {
                const config = await GuildConfig.findOne({ guildId: message.guildId });
                if (config?.prefix) {
                    prefix = config.prefix;
                } else {
                    // Create default if not exist
                    await GuildConfig.create({ guildId: message.guildId, prefix: '!' });
                }
            } catch (error) {
                console.error('Failed to fetch/create GuildConfig:', error);
            }
        }

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;

        const command = client.prefixCommands.get(commandName) || client.prefixCommands.find((cmd: any) => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            await message.reply('Ada kesalahan saat menjalankan command ini!');
        }
    },
};
