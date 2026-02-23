import { Events, Message } from 'discord.js';
import { GuildConfig } from '../database/models/GuildConfig';

export default {
    name: Events.MessageCreate,
    once: false,
    async execute(client: any, message: Message) {
        if (message.author.bot) return;

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
