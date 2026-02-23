"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorEmbed = exports.createFunEmbed = void 0;
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
