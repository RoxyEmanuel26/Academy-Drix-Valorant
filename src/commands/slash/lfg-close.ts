import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { LfgPost } from '../../database/models/LfgPost';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';

export default {
    data: new SlashCommandBuilder()
        .setName('lfg-close')
        .setDescription('Tutup postingan LFG kamu yang aktif.'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return;

        const updateData = await LfgPost.updateMany(
            { guildId: interaction.guildId, ownerId: interaction.user.id, active: true },
            { active: false }
        );

        if (updateData.modifiedCount === 0) {
            return interaction.reply({ embeds: [createErrorEmbed('Kamu tidak punya postingan LFG aktif.')], ephemeral: true });
        }

        await interaction.reply({ embeds: [createFunEmbed('❌ LFG Ditutup', `Berhasil menutup ${updateData.modifiedCount} postingan LFG kamu.`)] });
    },
};
