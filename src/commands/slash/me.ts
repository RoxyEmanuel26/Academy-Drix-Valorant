import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { User } from '../../database/models/User';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';

export default {
    data: new SlashCommandBuilder()
        .setName('me')
        .setDescription('Tampilkan profil VALORANT kamu yang terhubung.'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!isFeatureEnabled('valorantStats')) {
            return interaction.reply({ content: 'Fitur profil VALORANT belum aktif.', ephemeral: true });
        }

        const user = await User.findOne({ discordId: interaction.user.id });

        if (!user || !user.optIn) {
            return interaction.reply({ embeds: [createErrorEmbed('Kamu belum menghubungkan akun Riot apa pun!\nGunakan `/link` untuk memulai.')], ephemeral: true });
        }

        const embed = createFunEmbed(
            `🎮 Profil: ${user.riotGameName}#${user.riotTagLine}`,
            `**Region:** ${user.region.toUpperCase()}\n**Status:** Terhubung sejak ${user.linkedAt?.toLocaleDateString() || 'tidak diketahui'}`
        ).setThumbnail(interaction.user.displayAvatarURL());

        await interaction.reply({ embeds: [embed] });
    },
};
