"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const embed_1 = require("../../utils/embed");
exports.default = {
    name: 'guess-agent',
    description: 'Tebak nama Agent VALORANT dari clue!',
    async execute(message, args) {
        const agents = [
            { name: 'Jett', clue: 'Dash, Tailwind, Updraft... Siapa dia?' },
            { name: 'Cypher', clue: 'Orang yang tahu segalanya. Punya kamera di mana-mana.' },
            { name: 'Omen', clue: 'Bayangan yang berteleportasi dan membutakan musuhnya.' }
        ];
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        const options = [...agents].map(a => a.name).sort(() => Math.random() - 0.5);
        const row = new discord_js_1.ActionRowBuilder();
        options.forEach(opt => {
            row.addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId(`guess_${opt}`)
                .setLabel(opt)
                .setStyle(discord_js_1.ButtonStyle.Primary));
        });
        const embed = (0, embed_1.createFunEmbed)('🤔 Guess the Agent', `**Clue:** ${randomAgent.clue}`);
        const response = await message.reply({ embeds: [embed], components: [row] });
        const collector = response.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.Button, time: 15000 });
        collector.on('collect', async (i) => {
            if (i.user.id !== message.author.id) {
                await i.reply({ content: 'Ini bukan game tebakanmu!', ephemeral: true });
                return;
            }
            const guessed = i.customId.split('_')[1];
            if (guessed === randomAgent.name) {
                await i.update({ content: `✅ Benar! Itu adalah **${randomAgent.name}**!`, embeds: [], components: [] });
            }
            else {
                await i.update({ content: `❌ Salah! Jawabannya adalah **${randomAgent.name}**.`, embeds: [], components: [] });
            }
            collector.stop();
        });
        collector.on('end', collected => {
            if (collected.size === 0) {
                response.edit({ content: `⏰ Waktu habis! Jawabannya adalah **${randomAgent.name}**.`, embeds: [], components: [] }).catch(() => { });
            }
        });
    },
};
