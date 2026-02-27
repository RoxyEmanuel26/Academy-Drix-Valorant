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
exports.createLfgEmbed = exports.createErrorEmbed = exports.createFunEmbed = void 0;
const discord_js_1 = require("discord.js");
const createFunEmbed = (title, description) => {
    return new discord_js_1.EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor('#ff4655') // Valorant Red
        .setTimestamp();
};
exports.createFunEmbed = createFunEmbed;
const createErrorEmbed = (description) => {
    return new discord_js_1.EmbedBuilder()
        .setTitle('Oops! Ada yang salah 😅')
        .setDescription(description)
        .setColor('#ff0000');
};
exports.createErrorEmbed = createErrorEmbed;
const createLfgEmbed = (mode, note, formattedParticipants, // Use pre-formatted strings to allow role injecting
rankDisplay, // User's selected rank display
voiceChannelId, isTimeout = false) => {
    // Determine count based on actual valid strings
    const participantCount = formattedParticipants.filter(p => p !== undefined && p !== null).length;
    const isFull = participantCount >= 5;
    let playersList = '';
    for (let i = 0; i < 5; i++) {
        if (formattedParticipants[i]) {
            playersList += `${i + 1}. ${formattedParticipants[i]}\n`;
        }
        else {
            if (isTimeout) {
                playersList += `${i + 1}. -[TIMEOUT]-\n`;
            }
            else if (isFull) {
                playersList += `${i + 1}. -[FULL]-\n`;
            }
            else {
                playersList += `${i + 1}. -[OPEN]-\n`;
            }
        }
    }
    let embedTitle = `🎮 Looking For Party: ${mode} ${isFull ? '[FULL]' : ''}`;
    if (isTimeout) {
        embedTitle = `[TIMEOUT] Looking For Party: ${mode}`;
    }
    let voiceJoinText = '*balas pesan ini jika ingin ikut!*\n*Join voice channel yukk!!*';
    if (voiceChannelId) {
        voiceJoinText = `*balas pesan ini jika ingin ikut!*\n*Join voice channel <#${voiceChannelId}>*`;
    }
    const embedDesc = `**Mode:** ${mode}\n**Rank:** ${rankDisplay}\n**Catatan:** ${note}\n\n${isTimeout ? '*Pencarian Party ini sudah melebihi batas waktu!*' : (isFull ? '*Team sudah penuh!*' : voiceJoinText)}\n\n**Daftar Pemain:**\n${playersList}`;
    let embedColor = '#ff4655'; // Default Valorant Red
    if (isFull || isTimeout) {
        embedColor = '#aaaaaa'; // Gray out if full or timeout
    }
    else if (mode.toLowerCase() === 'unrated') {
        embedColor = '#28a745'; // Green for Unrated
    }
    else if (mode.toLowerCase() === 'competitive') {
        embedColor = '#ff4655'; // Red for Competitive
    }
    return new discord_js_1.EmbedBuilder()
        .setTitle(embedTitle)
        .setDescription(embedDesc)
        .setColor(embedColor)
        .setTimestamp();
};
exports.createLfgEmbed = createLfgEmbed;
