import { Message } from 'discord.js';
import { User } from '../../database/models/User';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';

export default {
    name: 'me',
    description: 'Tampilkan profil VALORANT kamu yang terhubung.',
    async execute(message: Message, args: string[]) {
        if (!isFeatureEnabled('valorantStats')) {
            return message.reply('Fitur profil VALORANT belum aktif.');
        }

        const user = await User.findOne({ discordId: message.author.id });

        if (!user || !user.optIn) {
            return message.reply({ embeds: [createErrorEmbed('Kamu belum menghubungkan akun Riot apa pun!\nGunakan `!link` untuk memulai.')] });
        }

        const embed = createFunEmbed(
            `🎮 Profil: ${user.riotGameName}#${user.riotTagLine}`,
            `**Region:** ${user.region.toUpperCase()}\n**Status:** Terhubung sejak ${user.linkedAt?.toLocaleDateString() || 'tidak diketahui'}`
        ).setThumbnail(message.author.displayAvatarURL());

        await message.reply({ embeds: [embed] });
    },
};
