"use strict";
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
const createLfgEmbed = (mode, note, participants, voiceChannelId, isTimeout = false) => {
    let playersList = '';
    for (let i = 0; i < 5; i++) {
        if (participants[i]) {
            playersList += `${i + 1}. <@${participants[i]}>\n`;
        }
        else {
            playersList += `${i + 1}. ${isTimeout ? '- Timeout -' : '- Open -'}\n`;
        }
    }
    const isFull = participants.length >= 5;
    let embedTitle = `🎮 Looking For Group: ${mode} ${isFull ? '[FULL]' : ''}`;
    if (isTimeout) {
        embedTitle = `[TIMEOUT] Looking For Group: ${mode}`;
    }
    let voiceJoinText = '*balas pesan ini jika ingin ikut!*\n*Join voice channel yukk!!*';
    if (voiceChannelId) {
        voiceJoinText = `*balas pesan ini jika ingin ikut!*\n*Join voice channel <#${voiceChannelId}>*`;
    }
    const embedDesc = `**Mode:** ${mode}\n**Catatan:** ${note}\n\n${isTimeout ? '*LFG ini sudah melebihi batas waktu!*' : (isFull ? '*Team sudah penuh!*' : voiceJoinText)}\n\n**Daftar Pemain:**\n${playersList}`;
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
