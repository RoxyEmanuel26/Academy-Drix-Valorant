"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const GuildConfig_1 = require("../database/models/GuildConfig");
exports.default = {
    name: discord_js_1.Events.MessageCreate,
    once: false,
    async execute(client, message) {
        if (message.author.bot)
            return;
        // Fetch prefix from DB or use default
        let prefix = '!';
        if (message.guildId) {
            try {
                const config = await GuildConfig_1.GuildConfig.findOne({ guildId: message.guildId });
                if (config?.prefix) {
                    prefix = config.prefix;
                }
                else {
                    // Create default if not exist
                    await GuildConfig_1.GuildConfig.create({ guildId: message.guildId, prefix: '!' });
                }
            }
            catch (error) {
                console.error('Failed to fetch/create GuildConfig:', error);
            }
        }
        if (!message.content.startsWith(prefix))
            return;
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName)
            return;
        const command = client.prefixCommands.get(commandName);
        if (!command)
            return;
        try {
            await command.execute(message, args);
        }
        catch (error) {
            console.error(error);
            await message.reply('Ada kesalahan saat menjalankan command ini!');
        }
    },
};
