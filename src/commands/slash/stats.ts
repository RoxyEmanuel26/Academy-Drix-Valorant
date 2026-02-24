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


import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { User } from '../../database/models/User';
import { createFunEmbed, createErrorEmbed } from '../../utils/embed';
import { isFeatureEnabled } from '../../config/featureFlags';
import { env } from '../../config/env';

export default {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Lihat statisik santai temanmu!')
        .addUserOption(option =>
            option.setName('user').setDescription('Pilih player').setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!isFeatureEnabled('valorantStats')) {
            return interaction.reply({ content: 'Fitur statistik VALORANT sedang dinonaktifkan oleh admin.', ephemeral: true });
        }

        if (!env.riot.apiKey || !env.riot.rso.clientId || !env.riot.rso.clientSecret || !env.riot.rso.redirectUri) {
            return interaction.reply({ embeds: [createErrorEmbed('Riot API/RSO belum dikonfigurasi. Fitur belum dapat digunakan.')], ephemeral: true });
        }

        const target = interaction.options.getUser('user');
        if (!target) return interaction.reply({ content: 'User tidak ditemukan', ephemeral: true });

        const user = await User.findOne({ discordId: target.id });

        if (!user || !user.optIn) {
            return interaction.reply({ embeds: [createErrorEmbed(`<@${target.id}> belum menghubungkan akun Riot mereka.`)], ephemeral: true });
        }

        const stats = user.statsCache || { rank: 'Unranked', winrate: 50, totalWins: 10, totalLosses: 10 };
        const embed = createFunEmbed(
            `📊 Stats: ${target.username}`,
            `**VALORANT ID:** ${user.riotGameName}#${user.riotTagLine}\n**Rank:** ${stats.rank}\n**Winrate:** ${stats.winrate}%\n**Matches:** ${stats.totalWins} W / ${stats.totalLosses} L`
        ).setThumbnail(target.displayAvatarURL());

        await interaction.reply({ embeds: [embed] });
    },
};
