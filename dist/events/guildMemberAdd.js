"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.GuildMemberAdd,
    once: false,
    async execute(client, member) {
        // Find system channel or specific welcome channel
        const channel = member.guild.systemChannel;
        if (!channel)
            return;
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`Welcome to Academy Drix Valorant! 🎉`)
            .setDescription(`Halo ${member}! Selamat datang di server.\n\nJangan lupa untuk menghubungkan akun Riot kamu dengan memakai command \`/link\` atau \`!link\` untuk memanjat Leaderboard, melihat misi harian, dan ikut fun games kita!\n\nKetik \`/help\` untuk bantuan lebih lanjut. 🚀`)
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
