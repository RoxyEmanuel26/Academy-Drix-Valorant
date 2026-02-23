"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
exports.default = {
    name: 'agents',
    description: 'Daftar tipe/role Agent VALORANT.',
    async execute(message, args) {
        if (!(0, featureFlags_1.isFeatureEnabled)('valorantContent')) {
            return message.reply('Informasi agent sedang dimatikan.');
        }
        const embed = (0, embed_1.createFunEmbed)('🕵️‍♂️ Tipe Agent VALORANT', `**Duelist:** Jett, Phoenix, Reyna, Raze, Yoru, Neon, Iso\n**Initiator:** Sova, Breach, Skye, KAY/O, Fade, Gekko\n**Controller:** Brimstone, Viper, Omen, Astra, Harbor, Clove\n**Sentinel:** Killjoy, Cypher, Sage, Chamber, Deadlock`);
        await message.reply({ embeds: [embed] });
    },
};
