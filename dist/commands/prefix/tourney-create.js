"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Tournament_1 = require("../../database/models/Tournament");
const embed_1 = require("../../utils/embed");
exports.default = {
    name: 'tourney-create',
    description: 'Buat turnamen komunitas baru (Admin Only)',
    async execute(message, args) {
        if (!message.guildId)
            return;
        if (!message.member?.permissions.has(discord_js_1.PermissionFlagsBits.Administrator)) {
            return message.reply('❌ Command khusus admin.');
        }
        const name = args.join(' ');
        if (!name)
            return message.reply('Berikan nama turnamen! (contoh: `!tourney-create Academy Cup 1`)');
        await Tournament_1.Tournament.create({
            guildId: message.guildId,
            name,
            status: 'upcoming',
            teams: [],
            matches: [],
            config: { maxTeams: 8, mode: '5v5', startDate: new Date(Date.now() + 86400000 * 7) }
        });
        const embed = (0, embed_1.createFunEmbed)('🏆 Turnamen Dibuat!', `Turnamen **${name}** berhasil dibuat!\n\nPlayer bisa mendaftar dengan command \`!tourney-register\`.`);
        await message.reply({ embeds: [embed] });
    },
};
