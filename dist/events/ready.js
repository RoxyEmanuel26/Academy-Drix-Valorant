"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const GuildConfig_1 = require("../database/models/GuildConfig");
const User_1 = require("../database/models/User");
const embed_1 = require("../utils/embed");
exports.default = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user?.tag}`);
        client.user?.setActivity({ name: '/help for commands', type: 3 });
        // Weekly Recap Auto-job (Mock interval: 7 days)
        setInterval(async () => {
            try {
                const configs = await GuildConfig_1.GuildConfig.find({ leaderboardChannelId: { $exists: true } });
                for (const config of configs) {
                    if (!config.leaderboardChannelId)
                        continue;
                    const channel = client.channels.cache.get(config.leaderboardChannelId);
                    if (!channel)
                        continue;
                    const users = await User_1.User.find({ optIn: true }).sort({ 'statsCache.winrate': -1 }).limit(1);
                    const topPos = users[0];
                    if (topPos) {
                        const embed = (0, embed_1.createFunEmbed)('🗓️ Weekly Recap Academy!', `**Top Player Minggu Ini:** ${topPos.riotGameName}#${topPos.riotTagLine} dengan Winrate ${topPos.statsCache?.winrate || 0}%!\n\nMain terus & pantau leaderboard!`);
                        await channel.send({ embeds: [embed] });
                    }
                }
            }
            catch (error) {
                console.error('Error in weekly recap cron:', error);
            }
        }, 7 * 24 * 60 * 60 * 1000); // 7 days
    },
};
