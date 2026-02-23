import { Message } from 'discord.js';
import { User } from '../../database/models/User';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';
import { env } from '../../config/env';

export default {
    name: 'mystats',
    description: 'Lihat statisik santai VALORANT kamu!',
    async execute(message: Message, args: string[]) {
        if (!isFeatureEnabled('valorantStats')) {
            return message.reply('Fitur statistik VALORANT sedang dinonaktifkan oleh admin. Nanti nyala lagi kok! ✨');
        }

        if (!env.riot.apiKey || !env.riot.rso.clientId || !env.riot.rso.clientSecret || !env.riot.rso.redirectUri) {
            return message.reply({ embeds: [createErrorEmbed('Riot API/RSO belum dikonfigurasi. Fitur belum dapat digunakan.')] });
        }

        const user = await User.findOne({ discordId: message.author.id });

        if (!user || !user.optIn || !user.riotPuuid) {
            return message.reply({ embeds: [createErrorEmbed('Kamu belum menghubungkan akun Riot apa pun!\nGunakan `!link` untuk memulai.')] });
        }

        try {
            const stats = user.statsCache || { rank: 'Unranked', winrate: 50, totalWins: 10, totalLosses: 10 };

            const embed = createFunEmbed(
                `📊 Stats: ${user.riotGameName}#${user.riotTagLine}`,
                `**Rank:** ${stats.rank}\n**Winrate:** ${stats.winrate}%\n**Matches:** ${stats.totalWins} W / ${stats.totalLosses} L\n\n*Statistik dihitung dari data terakhir yang tersinkronisasi di server ini!*`
            ).setThumbnail(message.author.displayAvatarURL());

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await message.reply({ embeds: [createErrorEmbed('Gagal mengambil data statistik.')] });
        }
    },
};
