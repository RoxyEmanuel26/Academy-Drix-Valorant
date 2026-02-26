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


import { Client, Events, TextChannel } from 'discord.js';
import { GuildConfig } from '../database/models/GuildConfig';
import { User } from '../database/models/User';
import { createFunEmbed } from '../utils/embed';

export default {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        console.log(`Ready! Logged in as ${client.user?.tag}`);
        client.user?.setActivity({ name: '/help for commands', type: 3 });

        // Weekly Recap Auto-job (Mock interval: 7 days)
        setInterval(async () => {
            try {
                const configs = await GuildConfig.find({ leaderboardChannelId: { $exists: true } });
                for (const config of configs) {
                    if (!config.leaderboardChannelId) continue;
                    const channel = client.channels.cache.get(config.leaderboardChannelId) as TextChannel;
                    if (!channel) continue;

                    const users = await User.find({ optedIn: true }).sort({ 'statsCache.winrate': -1 }).limit(1);
                    const topPos = users[0];

                    if (topPos) {
                        const embed = createFunEmbed(
                            '🗓️ Weekly Recap Academy!',
                            `**Top Player Minggu Ini:** ${topPos.riotGameName}#${topPos.riotTagLine} dengan Winrate ${topPos.statsCache?.winrate || 0}%!\n\nMain terus & pantau leaderboard!`
                        );
                        await channel.send({ embeds: [embed] });
                    }
                }
            } catch (error) {
                console.error('Error in weekly recap cron:', error);
            }
        }, 7 * 24 * 60 * 60 * 1000); // 7 days
    },
};
