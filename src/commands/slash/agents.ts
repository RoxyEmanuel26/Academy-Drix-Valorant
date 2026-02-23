import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { createFunEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';

export default {
    data: new SlashCommandBuilder()
        .setName('agents')
        .setDescription('Daftar tipe/role Agent VALORANT.'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!isFeatureEnabled('valorantContent')) {
            return interaction.reply({ content: 'Informasi agent sedang dimatikan.', ephemeral: true });
        }

        const embed = createFunEmbed(
            '🕵️‍♂️ Tipe Agent VALORANT',
            `**Duelist:** Jett, Phoenix, Reyna, Raze, Yoru, Neon, Iso\n**Initiator:** Sova, Breach, Skye, KAY/O, Fade, Gekko\n**Controller:** Brimstone, Viper, Omen, Astra, Harbor, Clove\n**Sentinel:** Killjoy, Cypher, Sage, Chamber, Deadlock`
        );
        await interaction.reply({ embeds: [embed] });
    },
};
