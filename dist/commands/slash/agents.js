"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('agents')
        .setDescription('Daftar tipe/role Agent VALORANT.'),
    async execute(interaction) {
        if (!(0, featureFlags_1.isFeatureEnabled)('valorantContent')) {
            return interaction.reply({ content: 'Informasi agent sedang dimatikan.', ephemeral: true });
        }
        const embed = (0, embed_1.createFunEmbed)('🕵️‍♂️ Tipe Agent VALORANT', `**Duelist:** Jett, Phoenix, Reyna, Raze, Yoru, Neon, Iso\n**Initiator:** Sova, Breach, Skye, KAY/O, Fade, Gekko\n**Controller:** Brimstone, Viper, Omen, Astra, Harbor, Clove\n**Sentinel:** Killjoy, Cypher, Sage, Chamber, Deadlock`);
        await interaction.reply({ embeds: [embed] });
    },
};
