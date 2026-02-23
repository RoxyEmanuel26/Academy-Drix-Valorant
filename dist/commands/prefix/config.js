"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const GuildConfig_1 = require("../../database/models/GuildConfig");
const embed_1 = require("../../utils/embed");
exports.default = {
    name: 'config',
    description: 'Tampilkan konfigurasi guild (Admin Only).',
    async execute(message, args) {
        if (!message.guildId)
            return;
        if (!message.member?.permissions.has(discord_js_1.PermissionFlagsBits.Administrator)) {
            return message.reply('❌ Command admin!');
        }
        const config = await GuildConfig_1.GuildConfig.findOne({ guildId: message.guildId });
        const embed = (0, embed_1.createFunEmbed)('⚙️ Konfigurasi Server', `**Prefix:** ${config?.prefix || '!'}\n**Leaderboard Channel:** ${config?.leaderboardChannelId ? `<#${config.leaderboardChannelId}>` : 'Belum di-set'}\n**Missions Active:** ${config?.missionsEnabled !== false ? 'Ya' : 'Tidak'}`);
        await message.reply({ embeds: [embed] });
    },
};
