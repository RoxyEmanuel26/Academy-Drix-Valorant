import { Message } from 'discord.js';
import { User } from '../../database/models/User';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';

export default {
    name: 'unlink',
    description: 'Hapus hubungan akun Riot dari bot ini.',
    async execute(message: Message, args: string[]) {
        if (!isFeatureEnabled('valorantStats')) {
            return message.reply('Fitur akun dan statistik VALORANT sedang dinonaktifkan oleh admin.');
        }

        const user = await User.findOne({ discordId: message.author.id });

        if (!user || !user.optIn) {
            return message.reply({ embeds: [createErrorEmbed('Kamu belum menghubungkan akun Riot apa pun!')] });
        }

        await User.deleteOne({ discordId: message.author.id });

        await message.reply({
            embeds: [createFunEmbed('💔 Unlinked', 'Akun Riot kamu telah berhasil dihapus dari sistem kami. Kami harap kamu kembali lagi nanti!')]
        });
    },
};
