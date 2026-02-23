"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const GuildConfig_1 = require("../../database/models/GuildConfig");
const embed_1 = require("../../utils/embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('config')
        .setDescription('Tampilkan konfigurasi guild (Admin Only).')
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (!interaction.guildId)
            return;
        const config = await GuildConfig_1.GuildConfig.findOne({ guildId: interaction.guildId });
        const embed = (0, embed_1.createFunEmbed)('⚙️ Konfigurasi Server', `**Prefix:** ${config?.prefix || '!'}\n**Leaderboard Channel:** ${config?.leaderboardChannelId ? `<#${config.leaderboardChannelId}>` : 'Belum di-set'}\n**Missions Active:** ${config?.missionsEnabled !== false ? 'Ya' : 'Tidak'}`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
