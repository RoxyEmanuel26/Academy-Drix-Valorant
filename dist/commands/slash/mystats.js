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
const User_1 = require("../../database/models/User");
const embed_1 = require("../../utils/embed");
const featureGuard_1 = require("../../utils/featureGuard");
const tokenManager_1 = require("../../utils/tokenManager");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('mystats')
        .setDescription('Lihat statisik santai VALORANT kamu!'),
    async execute(interaction) {
        const guard = (0, featureGuard_1.featureGuard)('STATS');
        if (!guard.allowed) {
            return interaction.reply({ content: guard.reason, flags: discord_js_1.MessageFlags.Ephemeral });
        }
        await interaction.deferReply();
        const accessToken = await (0, tokenManager_1.getValidAccessToken)(interaction.user.id);
        if (!accessToken) {
            return interaction.followUp({ embeds: [(0, embed_1.createErrorEmbed)('Kamu belum menghubungkan akun Riot apa pun!\nGunakan `/link-account` untuk menghubungkan akun Riot kamu terlebih dahulu sebelum menggunakan fitur ini.')] });
        }
        const user = await User_1.User.findOne({ discordId: interaction.user.id });
        if (!user)
            return; // Should exist if accessToken returned valid
        try {
            const stats = user.statsCache || { rank: 'Unranked', winrate: 50, totalWins: 10, totalLosses: 10 };
            const embed = (0, embed_1.createFunEmbed)(`📊 Stats: ${user.riotGameName}#${user.riotTagLine}`, `**Rank:** ${stats.rank}\n**Winrate:** ${stats.winrate}%\n**Matches:** ${stats.totalWins} W / ${stats.totalLosses} L\n\n*Statistik dihitung dari data terakhir yang tersinkronisasi di server ini!*`).setThumbnail(interaction.user.displayAvatarURL());
            await interaction.followUp({ embeds: [embed] });
        }
        catch (error) {
            console.error(error);
            await interaction.followUp({ embeds: [(0, embed_1.createErrorEmbed)('Gagal mengambil data statistik dari database.')] });
        }
    },
};
