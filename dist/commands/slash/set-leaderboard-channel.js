"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const GuildConfig_1 = require("../../database/models/GuildConfig");
const embed_1 = require("../../utils/embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('set-leaderboard-channel')
        .setDescription('Set channel khusus untuk auto-update Leaderboard')
        .addChannelOption(option => option.setName('channel')
        .setDescription('Channel text untuk leaderboard')
        .setRequired(true))
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        if (!interaction.guildId || !channel)
            return;
        try {
            await GuildConfig_1.GuildConfig.findOneAndUpdate({ guildId: interaction.guildId }, { leaderboardChannelId: channel.id }, { upsert: true });
            await interaction.reply({
                embeds: [(0, embed_1.createFunEmbed)('✅ Channel Diatur', `Channel leaderboard berhasil di-set ke <#${channel.id}>. Bot akan meng-update leaderboard di sana!`)]
            });
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Gagal menyimpan konfigurasi server.')] });
        }
    },
};
