"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const User_1 = require("../../database/models/User");
const Mission_1 = require("../../database/models/Mission");
const embed_1 = require("../../utils/embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('missions')
        .setDescription('Lihat misi harian dan mingguan kamu!'),
    async execute(interaction) {
        if (!interaction.guildId)
            return;
        const user = await User_1.User.findOne({ discordId: interaction.user.id });
        if (!user || !user.optedIn)
            return interaction.reply({ embeds: [(0, embed_1.createErrorEmbed)('Kamu belum menghubungkan akun Riot! `/link-account`')], flags: discord_js_1.MessageFlags.Ephemeral });
        let missions = await Mission_1.Mission.find({ guildId: interaction.guildId, userId: interaction.user.id, completed: false });
        if (missions.length === 0) {
            const newMission = new Mission_1.Mission({
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
        const embed = (0, embed_1.createFunEmbed)('🎯 Misi Aktif', desc);
        await interaction.reply({ embeds: [embed] });
    },
};
