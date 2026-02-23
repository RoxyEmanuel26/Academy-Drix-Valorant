"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const LfgPost_1 = require("../../database/models/LfgPost");
const embed_1 = require("../../utils/embed");
const env_1 = require("../../config/env");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('lfp')
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
        if (env_1.env.discord.lfgChannelId && interaction.channelId !== env_1.env.discord.lfgChannelId) {
            await interaction.reply({ content: `Silakan cari party game di channel <#${env_1.env.discord.lfgChannelId}>`, ephemeral: true });
            return;
        }
        const mode = interaction.options.getString('mode') || 'Unrated';
        const note = interaction.options.getString('note') || 'Ayo main bareng!';
        const member = interaction.member;
        const voiceChannelId = member.voice.channelId || undefined;
        const participants = [interaction.user.id];
        const embed = (0, embed_1.createLfgEmbed)(mode, note, participants, voiceChannelId)
            .setThumbnail(interaction.user.displayAvatarURL());
        const roleMention = env_1.env.discord.valorantRoleId ? `<@&${env_1.env.discord.valorantRoleId}>` : '@here';
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
