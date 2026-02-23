import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { createFunEmbed } from '../../utils/embed';

export default {
    data: new SlashCommandBuilder()
        .setName('agent-roulette')
        .setDescription('Pilih Agent random untuk kamu mainkan!'),
    async execute(interaction: ChatInputCommandInteraction) {
        const agents = ['Brimstone', 'Viper', 'Omen', 'Killjoy', 'Cypher', 'Sova', 'Sage', 'Phoenix', 'Jett', 'Reyna', 'Raze', 'Breach', 'Skye', 'Yoru', 'Astra', 'KAY/O', 'Chamber', 'Neon', 'Fade', 'Harbor', 'Gekko', 'Deadlock', 'Iso', 'Clove'];
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];

        const embed = createFunEmbed(
            '🎲 Agent Roulette',
            `Bot memilihkan **${randomAgent}** untuk kamu mainkan di match selanjutnya!\n\nJangan lupa instalock ya! 😆`
        );

        await interaction.reply({ embeds: [embed] });
    },
};
