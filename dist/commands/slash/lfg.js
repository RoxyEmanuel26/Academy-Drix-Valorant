"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const LfgPost_1 = require("../../database/models/LfgPost");
const embed_1 = require("../../utils/embed");
const env_1 = require("../../config/env");
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
        const mode = interaction.options.getString('mode') || 'Unrated';
        const note = interaction.options.getString('note') || 'Ayo main bareng!';
        const participants = [interaction.user.id];
        const embed = (0, embed_1.createLfgEmbed)(mode, note, participants)
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
            participants
        });
    },
};
