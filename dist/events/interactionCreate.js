"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.InteractionCreate,
    once: false,
    async execute(client, interaction) {
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
