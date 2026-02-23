import { Message, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import { createFunEmbed } from '../../utils/embed';

export default {
    name: 'guess-agent',
    description: 'Tebak nama Agent VALORANT dari clue!',
    async execute(message: Message, args: string[]) {
        const agents = [
            { name: 'Jett', clue: 'Dash, Tailwind, Updraft... Siapa dia?' },
            { name: 'Cypher', clue: 'Orang yang tahu segalanya. Punya kamera di mana-mana.' },
            { name: 'Omen', clue: 'Bayangan yang berteleportasi dan membutakan musuhnya.' }
        ];

        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        const options = [...agents].map(a => a.name).sort(() => Math.random() - 0.5);

        const row = new ActionRowBuilder<ButtonBuilder>();
        options.forEach(opt => {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`guess_${opt}`)
                    .setLabel(opt)
                    .setStyle(ButtonStyle.Primary)
            );
        });

        const embed = createFunEmbed('🤔 Guess the Agent', `**Clue:** ${randomAgent.clue}`);
        const response = await message.reply({ embeds: [embed], components: [row] });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

        collector.on('collect', async i => {
            if (i.user.id !== message.author.id) {
                await i.reply({ content: 'Ini bukan game tebakanmu!', ephemeral: true });
                return;
            }

            const guessed = i.customId.split('_')[1];
            if (guessed === randomAgent.name) {
                await i.update({ content: `✅ Benar! Itu adalah **${randomAgent.name}**!`, embeds: [], components: [] });
            } else {
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
