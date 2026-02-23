import { Message } from 'discord.js';
import { User } from '../../database/models/User';
import { Mission } from '../../database/models/Mission';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';

export default {
    name: 'missions',
    description: 'Lihat misi harian dan mingguan kamu!',
    async execute(message: Message, args: string[]) {
        if (!message.guildId) return;
        const user = await User.findOne({ discordId: message.author.id });
        if (!user || !user.optIn) return message.reply({ embeds: [createErrorEmbed('Kamu belum menghubungkan akun Riot! `!link`')] });

        let missions = await Mission.find({ guildId: message.guildId, userId: message.author.id, completed: false });

        if (missions.length === 0) {
            const newMission = new Mission({
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

        const embed = createFunEmbed('🎯 Misi Aktif', desc);
        await message.reply({ embeds: [embed] });
    },
};
