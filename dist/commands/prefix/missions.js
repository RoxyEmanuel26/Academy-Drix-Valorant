"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../database/models/User");
const Mission_1 = require("../../database/models/Mission");
const embed_1 = require("../../utils/embed");
exports.default = {
    name: 'missions',
    description: 'Lihat misi harian dan mingguan kamu!',
    async execute(message, args) {
        if (!message.guildId)
            return;
        const user = await User_1.User.findOne({ discordId: message.author.id });
        if (!user || !user.optIn)
            return message.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu belum menghubungkan akun Riot! `!link`')] });
        let missions = await Mission_1.Mission.find({ guildId: message.guildId, userId: message.author.id, completed: false });
        if (missions.length === 0) {
            const newMission = new Mission_1.Mission({
                guildId: message.guildId,
                userId: message.author.id,
                type: 'daily',
                description: 'Mainkan 2 pertandingan',
                target: 2,
                progress: 0,
                startAt: new Date(),
                endAt: new Date(Date.now() + 86400000),
                completed: false
            });
            await newMission.save();
            missions = [newMission];
        }
        let desc = '';
        missions.forEach((m, i) => {
            desc += `**${i + 1}.** [${m.type.toUpperCase()}] ${m.description}\nProgress: **${m.progress} / ${m.target}**\n\n`;
        });
        const embed = (0, embed_1.createFunEmbed)('🎯 Misi Aktif', desc);
        await message.reply({ embeds: [embed] });
    },
};
