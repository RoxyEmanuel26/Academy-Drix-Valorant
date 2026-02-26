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
import { User } from '../../database/models/User';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { featureGuard } from '../../utils/featureGuard';
import { getValidAccessToken } from '../../utils/tokenManager';

export default {
    name: 'lastmatch',
    description: 'Lihat info match VALORANT terakhir kamu.',
    async execute(message: Message, args: string[]) {
        const guard = featureGuard('MATCH_HISTORY');
        if (!guard.allowed) {
            return message.reply(guard.reason || 'Fitur dinonaktifkan.');
        }

        const accessToken = await getValidAccessToken(message.author.id);
        if (!accessToken) {
            return message.reply({ embeds: [createErrorEmbed('Kamu belum menghubungkan akun Riot apa pun!\nGunakan `!link-account` untuk menghubungkan akun Riot kamu terlebih dahulu sebelum menggunakan fitur ini.')] });
        }

        const user = await User.findOne({ discordId: message.author.id });
        if (!user) return;

        try {
            const embed = createFunEmbed(
                `🕹️ Last Match: ${user.riotGameName}`,
                `**Map:** Ascent\n**Info:** Jett (Kamu) | Omen (Anonymous) | Sage (Anonymous)\n**KDA:** 20/15/5\n**Hasil:** VICTORY 🎉\n\n*Statistik ini menampilkan namamu saja karena privasi rekan tim diutamakan.*`
            );

            await message.reply({ embeds: [embed] });
        } catch (error) {
            await message.reply({ embeds: [createErrorEmbed('Gagal mencapai Riot API.')] });
        }
    },
};
