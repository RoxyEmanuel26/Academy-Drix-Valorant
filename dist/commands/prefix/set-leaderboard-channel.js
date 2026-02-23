"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const GuildConfig_1 = require("../../database/models/GuildConfig");
const embed_1 = require("../../utils/embed");
exports.default = {
    name: 'set-leaderboard-channel',
    description: 'Set channel khusus untuk auto-update Leaderboard (Admin Only)',
    async execute(message, args) {
        if (!message.member?.permissions.has(discord_js_1.PermissionFlagsBits.Administrator)) {
            return message.reply('❌ Kamu harus jadi Admin untuk menggunakan command ini.');
        }
        const channel = message.mentions.channels.first();
        if (!message.guildId || !channel) {
            return message.reply('Silakan mention channel tujuan, contoh: `!set-leaderboard-channel #leaderboard`');
        }
        try {
            await GuildConfig_1.GuildConfig.findOneAndUpdate({ guildId: message.guildId }, { leaderboardChannelId: channel.id }, { upsert: true });
            await message.reply({
                embeds: [(0, embed_1.createFunEmbed)('✅ Channel Diatur', `Channel leaderboard berhasil di-set ke <#${channel.id}>.`)]
            });
        }
        catch (error) {
            console.error(error);
            await message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Gagal menyimpan konfigurasi server.')] });
        }
    },
};
