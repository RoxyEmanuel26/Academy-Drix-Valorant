"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../database/models/User");
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
exports.default = {
    name: 'me',
    description: 'Tampilkan profil VALORANT kamu yang terhubung.',
    async execute(message, args) {
        if (!(0, featureFlags_1.isFeatureEnabled)('valorantStats')) {
            return message.reply('Fitur profil VALORANT belum aktif.');
        }
        const user = await User_1.User.findOne({ discordId: message.author.id });
        if (!user || !user.optIn) {
            return message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu belum menghubungkan akun Riot apa pun!\nGunakan `!link` untuk memulai.')] });
        }
        const embed = (0, embed_1.createFunEmbed)(`🎮 Profil: ${user.riotGameName}#${user.riotTagLine}`, `**Region:** ${user.region.toUpperCase()}\n**Status:** Terhubung sejak ${user.linkedAt?.toLocaleDateString() || 'tidak diketahui'}`).setThumbnail(message.author.displayAvatarURL());
        await message.reply({ embeds: [embed] });
    },
};
