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
    name: 'lfp',
    aliases: ['lfg', 'party', 'carimabar', 'mabar', 'valoyuk'],
    description: 'Cari teman main VALORANT!',
    async execute(message, args) {
        if (!message.guildId)
            return;
        const config = await GuildConfig_1.GuildConfig.findOne({ guildId: message.guildId });
        if (config?.lfgChannelId && message.channelId !== config.lfgChannelId) {
            await message.reply(`Silakan cari party game di channel <#${config.lfgChannelId}>`);
            return;
        }
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
            content: 'Pilih mode game untuk LFP / Mabar kamu:',
            components: [row]
        });
        const collector = promptMessage.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            time: 60000
        });
        collector.on('collect', async (i) => {
            if (i.user.id !== message.author.id) {
                await i.reply({ content: 'Ini pencarian party punya orang lain!', ephemeral: true });
                return;
            }
            const mode = i.customId === 'lfg_competitive' ? 'Competitive' : 'Unrated';
            const participants = [message.author.id];
            // Interaction API carries the most up-to-date member state
            const member = await i.guild?.members.fetch(i.user.id);
            const voiceChannelId = member?.voice.channelId || undefined;
            const embed = (0, embed_1.createLfgEmbed)(mode, note, participants, voiceChannelId)
                .setThumbnail(message.author.displayAvatarURL());
            const roleMention = config?.valorantRoleId ? `<@&${config.valorantRoleId}>` : '@here';
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
                participants,
                voiceChannelId,
                channelId: message.channelId
            });
            await promptMessage.delete().catch(() => { });
        });
        collector.on('end', collected => {
            if (collected.size === 0) {
                promptMessage.edit({ content: 'Waktu memilih opsi Party telah habis.', components: [] }).catch(() => { });
            }
        });
    },
};
