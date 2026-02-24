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
const LfgPost_1 = require("../../database/models/LfgPost");
const GuildConfig_1 = require("../../database/models/GuildConfig");
const embed_1 = require("../../utils/embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('lfg')
        .setDescription('Cari teman main VALORANT!')
        .addStringOption(option => option.setName('mode')
        .setDescription('Mode game')
        .setRequired(true)
        .addChoices({ name: 'Competitive', value: 'Competitive' }, { name: 'Unrated', value: 'Unrated' }))
        .addStringOption(option => option.setName('note')
        .setDescription('Catatan tambahan (Rank, Role, dll)')
        .setRequired(false)),
    async execute(interaction) {
        if (!interaction.guildId)
            return;
        const config = await GuildConfig_1.GuildConfig.findOne({ guildId: interaction.guildId });
        if (config?.lfgChannelId && interaction.channelId !== config.lfgChannelId) {
            await interaction.reply({ content: `Silakan cari party game di channel <#${config.lfgChannelId}>`, flags: discord_js_1.MessageFlags.Ephemeral });
            return;
        }
        const mode = interaction.options.getString('mode') || 'Unrated';
        const note = interaction.options.getString('note') || 'Ayo main bareng!';
        const member = interaction.member;
        const voiceChannelId = member.voice.channelId || undefined;
        const participants = [interaction.user.id];
        const embed = (0, embed_1.createLfgEmbed)(mode, note, participants, voiceChannelId)
            .setThumbnail(interaction.user.displayAvatarURL());
        const roleMention = config?.valorantRoleId ? `<@&${config.valorantRoleId}>` : '@here';
        const reply = await interaction.reply({ content: roleMention, embeds: [embed], fetchReply: true });
        await LfgPost_1.LfgPost.create({
            guildId: interaction.guildId,
            messageId: reply.id,
            ownerId: interaction.user.id,
            mode,
            note,
            active: true,
            participants,
            voiceChannelId,
            channelId: interaction.channelId
        });
    },
};
