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
    name: 'privacy',
    description: 'Kebijakan Privasi Bot Academy Drix Valorant.',
    async execute(message: Message, args: string[]) {
        if (!isFeatureEnabled('valorantStats')) {
            return message.reply('Kebijakan privasi RSO belum dapat ditampilkan karena fitur nonaktif.');
        }

        const embed = createFunEmbed(
            '🛡️ Kebijakan Privasi',
            'Dengan menggunakan `!link`, kamu **opt-in** untuk membagikan data dasar VALORANT kamu (seperti Game Name, Tag, dan Match History publik) dengan bot kami.\n\nData kamu HANYA akan digunakan untuk fitur-fitur server ini seperti:\n- 🏆 Server Leaderboard\n- 🎯 Daily & Weekly Missions\n- 🎲 Fun Stats & Minigames\n\nKami **TIDAK** menyimpan password kamu dan **TIDAK** memodifikasi data in-game. Layanan ini tunduk pada Riot Games Policy.'
        );

        await message.reply({ embeds: [embed] });
    },
};
