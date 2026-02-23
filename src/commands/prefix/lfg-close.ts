import { Message } from 'discord.js';
import { LfgPost } from '../../database/models/LfgPost';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';

export default {
    name: 'lfg-close',
    description: 'Tutup postingan LFG kamu yang aktif.',
    async execute(message: Message, args: string[]) {
        if (!message.guildId) return;

        const updateData = await LfgPost.updateMany(
            { guildId: message.guildId, ownerId: message.author.id, active: true },
            { active: false }
        );

        if (updateData.modifiedCount === 0) {
            return message.reply({ embeds: [createErrorEmbed('Kamu tidak punya postingan LFG aktif.')] });
        }

        await message.reply({ embeds: [createFunEmbed('❌ LFG Ditutup', `Berhasil menutup ${updateData.modifiedCount} postingan LFG kamu.`)] });
    },
};
