"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LfgPost_1 = require("../../database/models/LfgPost");
const embed_1 = require("../../utils/embed");
exports.default = {
    name: 'lfg',
    description: 'Cari teman main VALORANT!',
    async execute(message, args) {
        if (!message.guildId)
            return;
        const modeInput = args[0]?.toLowerCase();
        let mode = 'Unrated';
        if (modeInput === 'comp' || modeInput === 'competitive')
            mode = 'Competitive';
        const note = args.slice(1).join(' ') || 'Ayo main bareng!';
        const embed = (0, embed_1.createFunEmbed)(`🎮 Looking For Group: ${mode}`, `**Player:** <@${message.author.id}>\n**Mode:** ${mode}\n**Catatan:** ${note}\n\n*Join voice channel dan balas pesan ini jika ingin ikut!*`).setThumbnail(message.author.displayAvatarURL());
        const reply = await message.reply({ content: '@here', embeds: [embed] });
        await LfgPost_1.LfgPost.create({
            guildId: message.guildId,
            messageId: reply.id,
            ownerId: message.author.id,
            mode,
            note,
            active: true
        });
    },
};
