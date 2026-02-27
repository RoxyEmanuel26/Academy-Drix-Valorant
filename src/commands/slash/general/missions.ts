/**
 * ---------------------------------------------------------------------
 * ⚡ WONDERPLAY - ACADEMY DRIX VALORANT BOT
 * ---------------------------------------------------------------------
 * @copyright (c) 2026 Roxy Emanuel - Soreang, West Java, Indonesia
 * @author    Roxy Emanuel <https://github.com/RoxyEmanuel26>
 * @link      https://github.com/RoxyEmanuel26/Academy-Drix-Valorant
 * @community WonderPlay Discord: https://discord.gg/A6b3dT2eey
 * 
 * Bot Discord eksklusif untuk komunitas WonderPlay & Academy Drix Valorant.
 * Hak cipta dilindungi undang-undang.
 * 
 * ⚠️ PERINGATAN EKSKLUSIVITAS:
 * Dilarang keras melakukan modifikasi, distribusi, atau komersialisasi
 * tanpa izin tertulis dari pemegang hak cipta.
 * ---------------------------------------------------------------------
 */


import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { User } from '../../../database/models/User';
import { Mission } from '../../../database/models/Mission';
import { createFunEmbed, createErrorEmbed } from '../../../utils/embed';

export default {
    data: new SlashCommandBuilder()
        .setName('missions')
        .setDescription('Lihat misi harian dan mingguan kamu!'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return;
        const user = await User.findOne({ discordId: interaction.user.id });
        if (!user || !user.optedIn) return interaction.reply({ embeds: [createErrorEmbed('Kamu belum menghubungkan akun Riot! `/link-account`')], flags: MessageFlags.Ephemeral });

        let missions = await Mission.find({ guildId: interaction.guildId, userId: interaction.user.id, completed: false });

        if (missions.length === 0) {
            const newMission = new Mission({
                guildId: interaction.guildId,
                userId: interaction.user.id,
                type: 'daily',
                description: 'Dapatkan 15 Kill di pertandingan apa saja',
                target: 15,
                progress: 0,
                startAt: new Date(),
                endAt: new Date(Date.now() + 86400000),
                completed: false
            });
            await newMission.save();
            missions = [newMission];
        }

        let desc = '';
        missions.forEach((m, i) => {
            desc += `**${i + 1}.** [${m.type.toUpperCase()}] ${m.description}\nProgress: **${m.progress} / ${m.target}**\n\n`;
        });

        const embed = createFunEmbed('🎯 Misi Aktif', desc);
        await interaction.reply({ embeds: [embed] });
    },
};

