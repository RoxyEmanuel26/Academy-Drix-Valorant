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


import { EmbedBuilder } from 'discord.js';

export const createFunEmbed = (title: string, description: string) => {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor('#ff4655') // Valorant Red
        .setTimestamp();
};

export const createErrorEmbed = (description: string) => {
    return new EmbedBuilder()
        .setTitle('Oops! Ada yang salah 😅')
        .setDescription(description)
        .setColor('#ff0000');
};

export const createLfgEmbed = (
    mode: string,
    note: string,
    formattedParticipants: string[], // Use pre-formatted strings to allow role injecting
    rankDisplay: string, // User's selected rank display
    voiceChannelId?: string,
    isTimeout: boolean = false
) => {
    let playersList = '';
    for (let i = 0; i < 5; i++) {
        if (formattedParticipants[i]) {
            playersList += `${formattedParticipants[i]}\n`;
        } else {
            playersList += `Open -\n`;
        }
    }

    // Determine count based on actual valid strings
    const participantCount = formattedParticipants.filter(p => p !== undefined && p !== null).length;
    const isFull = participantCount >= 5;

    let embedTitle = `🎮 Looking For Party: ${mode} ${isFull ? '[FULL]' : ''}`;
    if (isTimeout) {
        embedTitle = `[TIMEOUT] Looking For Party: ${mode}`;
    }

    let voiceJoinText = '*balas pesan ini jika ingin ikut!*\n*Join voice channel yukk!!*';
    if (voiceChannelId) {
        voiceJoinText = `*balas pesan ini jika ingin ikut!*\n*Join voice channel <#${voiceChannelId}>*`;
    }

    const embedDesc = `**Mode:** ${mode}\n**Rank:** ${rankDisplay}\n**Catatan:** ${note}\n\n${isTimeout ? '*Pencarian Party ini sudah melebihi batas waktu!*' : (isFull ? '*Team sudah penuh!*' : voiceJoinText)}\n\n**Daftar Pemain:**\n${playersList}`;

    let embedColor: `#${string}` = '#ff4655'; // Default Valorant Red
    if (isFull || isTimeout) {
        embedColor = '#aaaaaa'; // Gray out if full or timeout
    } else if (mode.toLowerCase() === 'unrated') {
        embedColor = '#28a745'; // Green for Unrated
    } else if (mode.toLowerCase() === 'competitive') {
        embedColor = '#ff4655'; // Red for Competitive
    }

    return new EmbedBuilder()
        .setTitle(embedTitle)
        .setDescription(embedDesc)
        .setColor(embedColor)
        .setTimestamp();
};
