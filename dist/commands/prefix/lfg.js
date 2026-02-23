"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const LfgPost_1 = require("../../database/models/LfgPost");
const embed_1 = require("../../utils/embed");
const env_1 = require("../../config/env");
exports.default = {
    name: 'lfg',
    description: 'Cari teman main VALORANT!',
    async execute(message, args) {
        if (!message.guildId)
            return;
        const note = args.join(' ') || 'Ayo main bareng!';
        const row = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId('lfg_unrated')
            .setLabel('Mode: Unrated')
            .setStyle(discord_js_1.ButtonStyle.Success), // Green
        new discord_js_1.ButtonBuilder()
            .setCustomId('lfg_competitive')
            .setLabel('Mode: Competitive')
            .setStyle(discord_js_1.ButtonStyle.Danger) // Red
        );
        const promptMessage = await message.reply({
            content: 'Pilih mode game untuk LFG kamu:',
            components: [row]
        });
        const collector = promptMessage.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            time: 60000
        });
        collector.on('collect', async (i) => {
            if (i.user.id !== message.author.id) {
                await i.reply({ content: 'Ini LFG punya orang lain!', ephemeral: true });
                return;
            }
            const mode = i.customId === 'lfg_competitive' ? 'Competitive' : 'Unrated';
            const participants = [message.author.id];
            const embed = (0, embed_1.createLfgEmbed)(mode, note, participants)
                .setThumbnail(message.author.displayAvatarURL());
            const roleMention = env_1.env.discord.valorantRoleId ? `<@&${env_1.env.discord.valorantRoleId}>` : '@here';
            let replyId = '';
            if ('send' in message.channel) {
                const reply = await message.channel.send({ content: roleMention, embeds: [embed] });
                replyId = reply.id;
            }
            else {
                return; // Silently fail if channel can't receive messages
            }
            await LfgPost_1.LfgPost.create({
                guildId: message.guildId,
                messageId: replyId,
                ownerId: message.author.id,
                mode,
                note,
                active: true,
                participants
            });
            await promptMessage.delete().catch(() => { });
        });
        collector.on('end', collected => {
            if (collected.size === 0) {
                promptMessage.edit({ content: 'Waktu memilih LFG telah habis.', components: [] }).catch(() => { });
            }
        });
    },
};
