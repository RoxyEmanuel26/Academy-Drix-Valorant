"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('privacy')
        .setDescription('Kebijakan Privasi Bot Academy Drix Valorant.'),
    async execute(interaction) {
        if (!(0, featureFlags_1.isFeatureEnabled)('valorantStats')) {
            return interaction.reply({ content: 'Kebijakan privasi RSO belum dapat ditampilkan karena fitur nonaktif.', ephemeral: true });
        }
        const embed = (0, embed_1.createFunEmbed)('🛡️ Kebijakan Privasi', 'Dengan menggunakan `/link`, kamu **opt-in** untuk membagikan data dasar VALORANT kamu (seperti Game Name, Tag, dan Match History publik) dengan bot kami.\n\nData kamu HANYA akan digunakan untuk fitur-fitur server ini seperti:\n- 🏆 Server Leaderboard\n- 🎯 Daily & Weekly Missions\n- 🎲 Fun Stats & Minigames\n\nKami **TIDAK** menyimpan password kamu dan **TIDAK** memodifikasi data in-game. Layanan ini tunduk pada Riot Games Policy.');
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
