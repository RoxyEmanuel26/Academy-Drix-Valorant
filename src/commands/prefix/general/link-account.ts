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


import { Message, EmbedBuilder } from 'discord.js';
import { getRsoAuthUrl } from '../../../services/riot/rso';
import { featureGuard } from '../../../utils/featureGuard';

export default {
    name: 'link-account',
    description: 'Hubungkan akun Riot (VALORANT) kamu ke bot.',
    async execute(message: Message, args: string[]) {
        const guard = featureGuard('LINK_ACCOUNT');
        if (!guard.allowed) {
            return message.reply(guard.reason || 'Fitur dinonaktifkan.');
        }

        const url = getRsoAuthUrl();

        const embed = new EmbedBuilder()
            .setTitle('🔗 Hubungkan Akun Riot Kamu')
            .setColor('#FF4655')
            .setDescription(`Dengan menghubungkan akun, kamu menyetujui bahwa:\n` +
                `✅ Bot akan mengakses data VALORANT kamu (rank, stats, match history) atas nama kamu\n` +
                `✅ Data kamu disimpan secara aman di database bot\n` +
                `✅ Kamu bisa mencabut akses kapan saja dengan \`!unlink-account\`\n\n` +
                `Klik link berikut untuk login dengan akun Riot kamu:\n[Login dengan Riot Games](${url})\n\n` +
                `⚠️ *Link ini hanya berlaku selama 5 menit.*`);

        try {
            await message.author.send({ embeds: [embed] });
            await message.reply('Cek DM kamu ya untuk link login RSO! 🚀');
        } catch (err) {
            await message.reply({ content: 'Sepertinya DM kamu tertutup. Ini linknya:', embeds: [embed] });
        }
    },
};
