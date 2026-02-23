import { Events, Message } from 'discord.js';
import { GuildConfig } from '../database/models/GuildConfig';
import { LfgPost } from '../database/models/LfgPost';
import { createLfgEmbed } from '../utils/embed';

export default {
    name: Events.MessageCreate,
    once: false,
    async execute(client: any, message: Message) {
        if (message.author.bot) return;

        // --- LFG Reply-to-Join Logic ---
        if (message.reference && message.reference.messageId) {
            const lfgPost = await LfgPost.findOne({ messageId: message.reference.messageId, active: true });

            if (lfgPost) {
                const userId = message.author.id;

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
                        const newEmbed = createLfgEmbed(lfgPost.mode, lfgPost.note, lfgPost.participants)
                            .setThumbnail(originalMessage.embeds[0]?.thumbnail?.url || message.author.displayAvatarURL());
                        await originalMessage.edit({ embeds: [newEmbed] });
                    }
                } catch (error) {
                    console.error('Failed to update LFG message:', error);
                }

                if (lfgPost.participants.length === 5) {
                    const mentions = lfgPost.participants.map(id => `<@${id}>`).join(' ');
                    if ('send' in message.channel) {
                        await message.channel.send(`Team penuh! Ayo berangkat 🚀\n${mentions}`);
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

        const command = client.prefixCommands.get(commandName);
        if (!command) return;

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            await message.reply('Ada kesalahan saat menjalankan command ini!');
        }
    },
};
