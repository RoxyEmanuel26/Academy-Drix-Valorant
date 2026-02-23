"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const User_1 = require("../../database/models/User");
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
const env_1 = require("../../config/env");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('stats')
        .setDescription('Lihat statisik santai temanmu!')
        .addUserOption(option => option.setName('user').setDescription('Pilih player').setRequired(true)),
    async execute(interaction) {
        if (!(0, featureFlags_1.isFeatureEnabled)('valorantStats')) {
            return interaction.reply({ content: 'Fitur statistik VALORANT sedang dinonaktifkan oleh admin.', ephemeral: true });
        }
        if (!env_1.env.riot.apiKey || !env_1.env.riot.rso.clientId || !env_1.env.riot.rso.clientSecret || !env_1.env.riot.rso.redirectUri) {
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Riot API/RSO belum dikonfigurasi. Fitur belum dapat digunakan.')], ephemeral: true });
        }
        const target = interaction.options.getUser('user');
        if (!target)
            return interaction.reply({ content: 'User tidak ditemukan', ephemeral: true });
        const user = await User_1.User.findOne({ discordId: target.id });
        if (!user || !user.optIn) {
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)(`<@${target.id}> belum menghubungkan akun Riot mereka.`)], ephemeral: true });
        }
        const stats = user.statsCache || { rank: 'Unranked', winrate: 50, totalWins: 10, totalLosses: 10 };
        const embed = (0, embed_1.createFunEmbed)(`📊 Stats: ${target.username}`, `**VALORANT ID:** ${user.riotGameName}#${user.riotTagLine}\n**Rank:** ${stats.rank}\n**Winrate:** ${stats.winrate}%\n**Matches:** ${stats.totalWins} W / ${stats.totalLosses} L`).setThumbnail(target.displayAvatarURL());
        await interaction.reply({ embeds: [embed] });
    },
};
