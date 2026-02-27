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
const User_1 = require("../../database/models/User");
const embed_1 = require("../../utils/embed");
const featureGuard_1 = require("../../utils/featureGuard");
exports.default = {
    name: 'stats',
    description: 'Lihat statisik santai temanmu!',
    async execute(message, args) {
        const guard = (0, featureGuard_1.featureGuard)('STATS');
        if (!guard.allowed) {
            return message.reply(guard.reason || 'Fitur dinonaktifkan.');
        }
        const target = message.mentions.users.first();
        if (!target)
            return message.reply('Silakan mention user. Contoh: `!stats @user`');
        const user = await User_1.User.findOne({ discordId: target.id });
        if (!user || !user.optedIn) {
            return message.reply('❌ Kamu hanya bisa melihat profil player yang sudah menghubungkan akun Riot mereka di server ini.');
        }
        const stats = user.statsCache || { rank: 'Unranked', winrate: 50, totalWins: 10, totalLosses: 10 };
        const embed = (0, embed_1.createFunEmbed)(`📊 Stats: ${target.username}`, `**VALORANT ID:** ${user.riotGameName}#${user.riotTagLine}\n**Rank:** ${stats.rank}\n**Winrate:** ${stats.winrate}%\n**Matches:** ${stats.totalWins} W / ${stats.totalLosses} L`).setThumbnail(target.displayAvatarURL());
        await message.reply({ embeds: [embed] });
    },
};
