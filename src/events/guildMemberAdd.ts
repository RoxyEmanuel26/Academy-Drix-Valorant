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


import { Events, GuildMember, EmbedBuilder } from 'discord.js';

export default {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(client: any, member: GuildMember) {
        // Find system channel or specific welcome channel
        const channel = member.guild.systemChannel;
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setTitle(`Welcome to Academy Drix Valorant! 🎉`)
            .setDescription(`Halo ${member}! Selamat datang di server.\n\nJangan lupa untuk menghubungkan akun Riot kamu dengan memakai command \`/link\` atau \`!link\` untuk memanjat Leaderboard, melihat misi harian, dan ikut fun games kita!\n\nKetik \`/help\` untuk bantuan lebih lanjut. 🚀`)
            .setColor('#ff4655')
            .setThumbnail(member.user.displayAvatarURL());

        try {
            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Failed to send welcome message', error);
        }
    },
};
