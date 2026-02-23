"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../database/models/User");
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
exports.default = {
    name: 'unlink',
    description: 'Hapus hubungan akun Riot dari bot ini.',
    async execute(message, args) {
        if (!(0, featureFlags_1.isFeatureEnabled)('valorantStats')) {
            return message.reply('Fitur akun dan statistik VALORANT sedang dinonaktifkan oleh admin.');
        }
        const user = await User_1.User.findOne({ discordId: message.author.id });
        if (!user || !user.optIn) {
            return message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu belum menghubungkan akun Riot apa pun!')] });
        }
        await User_1.User.deleteOne({ discordId: message.author.id });
        await message.reply({
            embeds: [(0, embed_1.createFunEmbed)('💔 Unlinked', 'Akun Riot kamu telah berhasil dihapus dari sistem kami. Kami harap kamu kembali lagi nanti!')]
        });
    },
};
