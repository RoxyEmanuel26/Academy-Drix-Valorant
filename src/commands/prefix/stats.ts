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
    name: 'stats',
    description: 'Lihat statisik santai temanmu!',
    async execute(message: Message, args: string[]) {
        if (!isFeatureEnabled('valorantStats')) {
            return message.reply('Fitur statistik VALORANT sedang dinonaktifkan oleh admin.');
        }

        if (!env.riot.apiKey || !env.riot.rso.clientId || !env.riot.rso.clientSecret || !env.riot.rso.redirectUri) {
            return message.reply({ embeds: [createErrorEmbed('Riot API/RSO belum dikonfigurasi. Fitur belum dapat digunakan.')] });
        }

        const target = message.mentions.users.first();
        if (!target) return message.reply('Silakan mention user. Contoh: `!stats @user`');

        const user = await User.findOne({ discordId: target.id });

        if (!user || !user.optIn) {
            return message.reply({ embeds: [createErrorEmbed(`<@${target.id}> belum menghubungkan akun Riot mereka.`)] });
        }

        const stats = user.statsCache || { rank: 'Unranked', winrate: 50, totalWins: 10, totalLosses: 10 };
        const embed = createFunEmbed(
            `📊 Stats: ${target.username}`,
            `**VALORANT ID:** ${user.riotGameName}#${user.riotTagLine}\n**Rank:** ${stats.rank}\n**Winrate:** ${stats.winrate}%\n**Matches:** ${stats.totalWins} W / ${stats.totalLosses} L`
        ).setThumbnail(target.displayAvatarURL());

        await message.reply({ embeds: [embed] });
    },
};
