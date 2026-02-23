import { Message, PermissionFlagsBits } from 'discord.js';
import { GuildConfig } from '../../database/models/GuildConfig';
import { createFunEmbed } from '../../utils/embed';

export default {
    name: 'config',
    description: 'Tampilkan konfigurasi guild (Admin Only).',
    async execute(message: Message, args: string[]) {
        if (!message.guildId) return;
        if (!message.member?.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ Command admin!');
        }

        const config = await GuildConfig.findOne({ guildId: message.guildId });

        const embed = createFunEmbed(
            '⚙️ Konfigurasi Server',
            `**Prefix:** ${config?.prefix || '!'}\n**Leaderboard Channel:** ${config?.leaderboardChannelId ? `<#${config.leaderboardChannelId}>` : 'Belum di-set'}\n**Missions Active:** ${config?.missionsEnabled !== false ? 'Ya' : 'Tidak'}`
        );

        await message.reply({ embeds: [embed] });
    },
};
