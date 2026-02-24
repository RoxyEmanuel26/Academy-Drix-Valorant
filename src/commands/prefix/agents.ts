/**
 * ---------------------------------------------------------------------
 * ⚡ WONDERPLAY - ACADEMY DRIX VALORANT BOT
 * ---------------------------------------------------------------------
 * @copyright (c) 2026 Roxy Emanuel - Soreang, West Java, Indonesia
 * @author    Roxy Emanuel <https://github.com/RoxyEmanuel26>
 * @link      https://github.com/RoxyEmanuel26/Academy-Drix-Valorant
 * @community WonderPlay Discord: https://discord.gg/A6b3dT2eey
 * 
 * Bot Discord eksklusif untuk komunitas WonderPlay & Academy Drix Valorant.
 * Hak cipta dilindungi undang-undang.
 * 
 * ⚠️ PERINGATAN EKSKLUSIVITAS:
 * Dilarang keras melakukan modifikasi, distribusi, atau komersialisasi
 * tanpa izin tertulis dari pemegang hak cipta.
 * ---------------------------------------------------------------------
 */


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
