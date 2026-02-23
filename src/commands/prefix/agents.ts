import { Message } from 'discord.js';
import { createFunEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';

export default {
    name: 'agents',
    description: 'Daftar tipe/role Agent VALORANT.',
    async execute(message: Message, args: string[]) {
        if (!isFeatureEnabled('valorantContent')) {
            return message.reply('Informasi agent sedang dimatikan.');
        }

        const embed = createFunEmbed(
            '🕵️‍♂️ Tipe Agent VALORANT',
            `**Duelist:** Jett, Phoenix, Reyna, Raze, Yoru, Neon, Iso\n**Initiator:** Sova, Breach, Skye, KAY/O, Fade, Gekko\n**Controller:** Brimstone, Viper, Omen, Astra, Harbor, Clove\n**Sentinel:** Killjoy, Cypher, Sage, Chamber, Deadlock`
        );
        await message.reply({ embeds: [embed] });
    },
};
