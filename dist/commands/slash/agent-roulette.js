"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const embed_1 = require("../../utils/embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('agent-roulette')
        .setDescription('Pilih Agent random untuk kamu mainkan!'),
    async execute(interaction) {
        const agents = ['Brimstone', 'Viper', 'Omen', 'Killjoy', 'Cypher', 'Sova', 'Sage', 'Phoenix', 'Jett', 'Reyna', 'Raze', 'Breach', 'Skye', 'Yoru', 'Astra', 'KAY/O', 'Chamber', 'Neon', 'Fade', 'Harbor', 'Gekko', 'Deadlock', 'Iso', 'Clove'];
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        const embed = (0, embed_1.createFunEmbed)('🎲 Agent Roulette', `Bot memilihkan **${randomAgent}** untuk kamu mainkan di match selanjutnya!\n\nJangan lupa instalock ya! 😆`);
        await interaction.reply({ embeds: [embed] });
    },
};
