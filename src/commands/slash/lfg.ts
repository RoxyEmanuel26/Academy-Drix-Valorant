import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { LfgPost } from '../../database/models/LfgPost';
import { createFunEmbed } from '../../utils/embed';

export default {
    data: new SlashCommandBuilder()
        .setName('lfg')
        .setDescription('Cari teman main VALORANT!')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Mode game')
                .setRequired(true)
                .addChoices({ name: 'Competitive', value: 'Competitive' }, { name: 'Unrated', value: 'Unrated' }))
        .addStringOption(option =>
            option.setName('note')
                .setDescription('Catatan tambahan (Rank, Role, dll)')
                .setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return;
        const mode = interaction.options.getString('mode') || 'Unrated';
        const note = interaction.options.getString('note') || 'Ayo main bareng!';

        const embed = createFunEmbed(
            `🎮 Looking For Group: ${mode}`,
            `**Player:** <@${interaction.user.id}>\n**Mode:** ${mode}\n**Catatan:** ${note}\n\n*Join voice channel dan balas pesan ini jika ingin ikut!*`
        ).setThumbnail(interaction.user.displayAvatarURL());

        const reply = await interaction.reply({ content: '@here', embeds: [embed], fetchReply: true });

        await LfgPost.create({
            guildId: interaction.guildId,
            messageId: reply.id,
            ownerId: interaction.user.id,
            mode,
            note,
            active: true
        });
    },
};
