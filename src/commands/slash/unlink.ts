import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { User } from '../../database/models/User';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';

export default {
    data: new SlashCommandBuilder()
        .setName('unlink')
        .setDescription('Hapus hubungan akun Riot dari bot ini.'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!isFeatureEnabled('valorantStats')) {
            return interaction.reply({ content: 'Fitur akun dan statistik VALORANT sedang dinonaktifkan oleh admin.', ephemeral: true });
        }

        const user = await User.findOne({ discordId: interaction.user.id });

        if (!user || !user.optIn) {
            return interaction.reply({ embeds: [createErrorEmbed('Kamu belum menghubungkan akun Riot apa pun!')], ephemeral: true });
        }

        await User.deleteOne({ discordId: interaction.user.id });

        await interaction.reply({
            embeds: [createFunEmbed('💔 Unlinked', 'Akun Riot kamu telah berhasil dihapus dari sistem kami. Kami harap kamu kembali lagi nanti!')],
            ephemeral: true
        });
    },
};
