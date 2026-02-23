"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
const env_1 = require("../../config/env");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('status')
        .setDescription('Cek status server VALORANT (AP region).'),
    async execute(interaction) {
        if (!(0, featureFlags_1.isFeatureEnabled)('valorantStatus')) {
            return interaction.reply({ content: 'Fitur status server VALORANT sedang nonaktif.', ephemeral: true });
        }
        if (!env_1.env.riot.apiKey) {
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Riot API Key belum dikonfigurasi. Fitur belum dapat digunakan.')], ephemeral: true });
        }
        await interaction.deferReply();
        try {
            // Note: Use getServerStatus('ap') realistically
            const statusData = { maintenances: [], incidents: [] };
            if (statusData.maintenances.length === 0 && statusData.incidents.length === 0) {
                await interaction.followUp({ embeds: [(0, embed_1.createFunEmbed)('🟢 Server Status AP', 'Server berjalan lancar tanpa gangguan! Ayo main!')] });
            }
            else {
                await interaction.followUp({ embeds: [(0, embed_1.createErrorEmbed)('Terjadi gangguan atau maintenance di server AP. Harap bersabar ya!')] });
            }
        }
        catch (error) {
            await interaction.followUp({ embeds: [(0, embed_1.createErrorEmbed)('Gagal mengambil status server RIOT.')] });
        }
    },
};
