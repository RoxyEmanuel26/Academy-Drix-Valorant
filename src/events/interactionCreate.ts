import { Events, Interaction } from 'discord.js';

export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(client: any, interaction: Interaction) {
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
