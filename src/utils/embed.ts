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

export const createLfgEmbed = (mode: string, note: string, participants: string[]) => {
    let playersList = '';
    for (let i = 0; i < 5; i++) {
        if (participants[i]) {
            playersList += `${i + 1}. <@${participants[i]}>\n`;
        } else {
            playersList += `${i + 1}. - Open -\n`;
        }
    }

    const isFull = participants.length >= 5;
    const embedTitle = `🎮 Looking For Group: ${mode} ${isFull ? '[FULL]' : ''}`;
    const embedDesc = `**Mode:** ${mode}\n**Catatan:** ${note}\n\n${isFull ? '*Team sudah penuh!*' : '*Join voice channel dan balas pesan ini jika ingin ikut!*'}\n\n**Daftar Pemain:**\n${playersList}`;

    let embedColor: `#${string}` = '#ff4655'; // Default Valorant Red
    if (isFull) {
        embedColor = '#aaaaaa'; // Gray out if full
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
