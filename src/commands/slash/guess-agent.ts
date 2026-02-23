import { SlashCommandBuilder, ChatInputCommandInteraction, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import { createFunEmbed } from '../../utils/embed';

export default {
    data: new SlashCommandBuilder()
        .setName('guess-agent')
        .setDescription('Tebak nama Agent VALORANT dari clue!'),
    async execute(interaction: ChatInputCommandInteraction) {
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
        const response = await interaction.reply({ embeds: [embed], components: [row] });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
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
                interaction.editReply({ content: `⏰ Waktu habis! Jawabannya adalah **${randomAgent.name}**.`, embeds: [], components: [] }).catch(() => { });
            }
        });
    },
};
