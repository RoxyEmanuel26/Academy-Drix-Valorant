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
exports.default = {
    name: discord_js_1.Events.GuildMemberAdd,
    once: false,
    async execute(client, member) {
        if (process.env.FF_WELCOME_MESSAGE === 'false')
            return;
        // Find system channel or specific welcome channel
        const channel = member.guild.systemChannel;
        if (!channel)
            return;
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`Welcome to Academy Drix Valorant! 🎉`);
        let description = `Halo ${member}! Selamat datang di server.`;
        // Only prompt to link account if the feature implies it is active
        const isRsoActive = process.env.RIOT_RSO_ENABLED === 'true' && process.env.RIOT_API_KEY_TYPE === 'production';
        const isLinkFeatureActive = process.env.FEATURE_LINK_ACCOUNT === 'true';
        if (isRsoActive && isLinkFeatureActive) {
            description += `\n\nJangan lupa untuk menghubungkan akun Riot kamu dengan memakai command \`/link-account\` atau \`!link-account\` untuk memanjat Leaderboard, melihat misi harian, dan ikut fun games kita!`;
        }
        description += `\n\nKetik \`/help\` untuk bantuan lebih lanjut. 🚀`;
        embed.setDescription(description)
            .setColor('#ff4655')
            .setThumbnail(member.user.displayAvatarURL());
        try {
            await channel.send({ embeds: [embed] });
        }
        catch (error) {
            console.error('Failed to send welcome message', error);
        }
    },
};
