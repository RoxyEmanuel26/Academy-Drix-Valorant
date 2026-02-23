import { Message } from 'discord.js';
import { LfgPost } from '../../database/models/LfgPost';
import { createFunEmbed } from '../../utils/embed';

export default {
    name: 'lfg',
    description: 'Cari teman main VALORANT!',
    async execute(message: Message, args: string[]) {
        if (!message.guildId) return;

        const modeInput = args[0]?.toLowerCase();
        let mode = 'Unrated';
        if (modeInput === 'comp' || modeInput === 'competitive') mode = 'Competitive';

        const note = args.slice(1).join(' ') || 'Ayo main bareng!';

        const embed = createFunEmbed(
            `🎮 Looking For Group: ${mode}`,
            `**Player:** <@${message.author.id}>\n**Mode:** ${mode}\n**Catatan:** ${note}\n\n*Join voice channel dan balas pesan ini jika ingin ikut!*`
        ).setThumbnail(message.author.displayAvatarURL());

        const reply = await message.reply({ content: '@here', embeds: [embed] });

        await LfgPost.create({
            guildId: message.guildId,
            messageId: reply.id,
            ownerId: message.author.id,
            mode,
            note,
            active: true
        });
    },
};
