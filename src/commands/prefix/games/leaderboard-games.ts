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


import { Message, EmbedBuilder, TextChannel } from 'discord.js';
import { getLeaderboard } from '../../../services/gamePointsService';

export default {
    name: 'leaderboard-games',
    aliases: ['lb', 'topgames', 'ranking'],
    description: 'Tampilkan 10 pemain terbaik Mini-Games. \nPenggunaan: !lb [weekly/monthly/alltime]',
    async execute(message: Message, args: string[]) {
        if (!message.guildId) return;

        let category: 'weekly' | 'monthly' | 'alltime' = 'alltime';
        if (args[0]) {
            const arg = args[0].toLowerCase();
            if (arg === 'weekly' || arg === 'mingguan') category = 'weekly';
            else if (arg === 'monthly' || arg === 'bulanan') category = 'monthly';
        }

        const top10 = await getLeaderboard(message.guildId, category, 10);

        if (top10.length === 0) {
            await message.reply('Belum ada data poin untuk kategori ini.');
            return;
        }

        const categoryNames = {
            weekly: 'Mingguan 🥈',
            monthly: 'Bulanan 🥇',
            alltime: 'Sepanjang Waktu 🏆'
        };

        const embed = new EmbedBuilder()
            .setTitle(`Top 10 Klasemen - ${categoryNames[category]}`)
            .setColor(0xF1C40F)
            .setDescription('Siapa yang paling paham soal VALORANT di server ini?');

        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

        let boardText = '';
        top10.forEach((user, index) => {
            let pts = 0;
            if (category === 'weekly') pts = user.weeklyPoints;
            else if (category === 'monthly') pts = user.monthlyPoints;
            else pts = user.totalPoints;

            boardText += `${medals[index]} **${user.username}** — ${pts} Pts\n`;
        });

        embed.addFields({ name: 'Rankings', value: boardText, inline: false });
        embed.setFooter({ text: 'Kumpulkan poin lebih banyak dengan main terus!' });

        await (message.channel as TextChannel).send({ embeds: [embed] });
    },
};
