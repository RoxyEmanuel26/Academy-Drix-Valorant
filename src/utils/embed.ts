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
