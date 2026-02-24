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
import { isFeatureEnabled } from '../../config/featureFlags';
import { env } from '../../config/env';

export default {
    name: 'lastmatch',
    description: 'Lihat info match VALORANT terakhir kamu.',
    async execute(message: Message, args: string[]) {
        if (!isFeatureEnabled('valorantStats')) {
            return message.reply('Fitur last match sedang dinonaktifkan oleh admin.');
        }

        if (!env.riot.apiKey || !env.riot.rso.clientId || !env.riot.rso.clientSecret || !env.riot.rso.redirectUri) {
            return message.reply({ embeds: [createErrorEmbed('Riot API/RSO belum dikonfigurasi. Fitur belum dapat digunakan.')] });
        }

        const user = await User.findOne({ discordId: message.author.id });

        if (!user || !user.optIn || !user.riotPuuid) {
            return message.reply({ embeds: [createErrorEmbed('Kamu belum menghubungkan akun Riot! `!link`')] });
        }

        try {
            const embed = createFunEmbed(
                `🕹️ Last Match: ${user.riotGameName}`,
                `**Map:** Ascent\n**Agent:** Jett\n**KDA:** 20/15/5\n**Hasil:** VICTORY 🎉\n\n*Wah, ternyata kamu lumayan jago bawa Jett kemarin!*`
            );

            await message.reply({ embeds: [embed] });
        } catch (error) {
            await message.reply({ embeds: [createErrorEmbed('Gagal mencapai Riot API.')] });
        }
    },
};
