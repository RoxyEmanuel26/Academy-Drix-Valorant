import { Message } from 'discord.js';
import { getRsoAuthUrl } from '../../services/riot/rso';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';
import { env } from '../../config/env';

export default {
    name: 'link',
    description: 'Hubungkan akun Riot (VALORANT) kamu ke bot.',
    async execute(message: Message, args: string[]) {
        if (!isFeatureEnabled('valorantStats')) {
            return message.reply('Fitur akun dan statistik VALORANT sedang dinonaktifkan oleh admin. Nanti akan menyala ya! ✨');
        }

        if (!env.riot.apiKey || !env.riot.rso.clientId || !env.riot.rso.clientSecret || !env.riot.rso.redirectUri) {
            return message.reply({ embeds: [createErrorEmbed('Riot API/RSO belum dikonfigurasi sepenuhnya. Fitur belum dapat digunakan.')] });
        }

        const url = getRsoAuthUrl();
        const embed = createFunEmbed(
            '🔗 Link Akun Riot',
            `Halo ${message.author}! Silakan klik [link ini](${url}) untuk login via Riot Sign On.\n\nJangan khawatir, bot ini aman dan mematuhi Riot Games Policy! Kami hanya mengambil data dasar untuk Leaderboard dan Fun Games.`
        );

        try {
            await message.author.send({ embeds: [embed] });
            await message.reply('Cek DM kamu ya untuk link login RSO! 🚀');
        } catch (err) {
            await message.reply({ embeds: [embed] });
        }
    },
};
