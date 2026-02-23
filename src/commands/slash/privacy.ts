import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { createFunEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';

export default {
    data: new SlashCommandBuilder()
        .setName('privacy')
        .setDescription('Kebijakan Privasi Bot Academy Drix Valorant.'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!isFeatureEnabled('valorantStats')) {
            return interaction.reply({ content: 'Kebijakan privasi RSO belum dapat ditampilkan karena fitur nonaktif.', ephemeral: true });
        }

        const embed = createFunEmbed(
            '🛡️ Kebijakan Privasi',
            'Dengan menggunakan `/link`, kamu **opt-in** untuk membagikan data dasar VALORANT kamu (seperti Game Name, Tag, dan Match History publik) dengan bot kami.\n\nData kamu HANYA akan digunakan untuk fitur-fitur server ini seperti:\n- 🏆 Server Leaderboard\n- 🎯 Daily & Weekly Missions\n- 🎲 Fun Stats & Minigames\n\nKami **TIDAK** menyimpan password kamu dan **TIDAK** memodifikasi data in-game. Layanan ini tunduk pada Riot Games Policy.'
        );

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
