"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const LfgPost_1 = require("../../database/models/LfgPost");
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
        const mode = interaction.options.getString('mode') || 'Unrated';
        const note = interaction.options.getString('note') || 'Ayo main bareng!';
        const embed = (0, embed_1.createFunEmbed)(`🎮 Looking For Group: ${mode}`, `**Player:** <@${interaction.user.id}>\n**Mode:** ${mode}\n**Catatan:** ${note}\n\n*Join voice channel dan balas pesan ini jika ingin ikut!*`).setThumbnail(interaction.user.displayAvatarURL());
        const reply = await interaction.reply({ content: '@here', embeds: [embed], fetchReply: true });
        await LfgPost_1.LfgPost.create({
            guildId: interaction.guildId,
            messageId: reply.id,
            ownerId: interaction.user.id,
            mode,
            note,
            active: true
        });
    },
};
