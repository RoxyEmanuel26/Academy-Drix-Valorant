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
const rankDetector_1 = require("../../utils/rankDetector");
exports.default = {
    name: 'lfp',
    aliases: ['lfg', 'party', 'carimabar', 'mabar', 'valoyuk', 'valo', 'main'],
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
            time: 120000 // 2 minutes total for both steps
        });
        // Track state for the multi-step process
        let selectedMode = null;
        let selectedRank = null;
        collector.on('collect', async (i) => {
            if (i.user.id !== message.author.id) {
                await i.reply({ content: 'Ini pencarian party punya orang lain!', flags: discord_js_1.MessageFlags.Ephemeral });
                return;
            }
            // Step 1: Mode Selection
            if (i.customId === 'lfg_competitive' || i.customId === 'lfg_unrated') {
                selectedMode = i.customId === 'lfg_competitive' ? 'Competitive' : 'Unrated';
                // Construct Rank Buttons
                const row1 = new discord_js_1.ActionRowBuilder();
                const row2 = new discord_js_1.ActionRowBuilder();
                const reversedRanks = [...rankDetector_1.VALORANT_RANKS].reverse();
                reversedRanks.forEach((rankData, index) => {
                    const btn = new discord_js_1.ButtonBuilder()
                        .setCustomId(`rank_${rankData.rank}`)
                        .setLabel(rankData.rank)
                        .setStyle(discord_js_1.ButtonStyle.Secondary);
                    if (rankData.emoji && rankData.emoji !== '') {
                        btn.setEmoji(rankData.emoji);
                    }
                    if (index < 5) {
                        row1.addComponents(btn);
                    }
                    else {
                        row2.addComponents(btn);
                    }
                });
                await i.update({
                    content: `Mode **${selectedMode}** dipilih! Sekarang pilih Rank Kamu saat ini:`,
                    components: [row1, row2]
                });
                return;
            }
            // Step 2: Rank Selection
            if (i.customId.startsWith('rank_')) {
                selectedRank = i.customId.replace('rank_', '');
                const rankInfo = rankDetector_1.VALORANT_RANKS.find(r => r.rank === selectedRank);
                const rankDisplay = `${rankInfo?.emoji || ''} ${selectedRank}`;
                const participants = [message.author.id];
                const member = await i.guild?.members.fetch(i.user.id);
                const voiceChannelId = member?.voice.channelId || undefined;
                // Build formatted participants list with dynamic roles
                const formattedParticipants = [];
                for (const pid of participants) {
                    try {
                        const pMember = await i.guild?.members.fetch(pid);
                        if (pMember) {
                            const pRank = (0, rankDetector_1.detectRankFromRoles)(pMember.roles.cache);
                            formattedParticipants.push(`<@${pid}> (${pRank.emoji} ${pRank.rank})`);
                        }
                        else {
                            formattedParticipants.push(`<@${pid}>`);
                        }
                    }
                    catch {
                        formattedParticipants.push(`<@${pid}>`);
                    }
                }
                const embed = (0, embed_1.createLfgEmbed)(selectedMode, note, formattedParticipants, rankDisplay, (voiceChannelId || undefined))
                    .setThumbnail(message.author.displayAvatarURL());
                const roleMention = config?.valorantRoleId ? `<@&${config.valorantRoleId}>` : '@here';
                let replyId = '';
                if ('send' in message.channel) {
                    const reply = await message.channel.send({ content: roleMention, embeds: [embed] });
                    replyId = reply.id;
                }
                if (replyId) {
                    await LfgPost_1.LfgPost.create({
                        guildId: message.guildId,
                        messageId: replyId,
                        ownerId: message.author.id,
                        mode: selectedMode,
                        note: note, // note no longer contains rank prefix, it's pure note
                        active: true,
                        participants,
                        voiceChannelId,
                        channelId: message.channelId
                    });
                }
                await promptMessage.delete().catch(() => { });
                collector.stop('completed');
            }
        });
        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                promptMessage.edit({ content: 'Waktu memilih opsi Party telah habis.', components: [] }).catch(() => { });
            }
        });
    },
};
