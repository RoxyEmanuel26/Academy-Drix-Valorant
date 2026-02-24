/**
 * ---------------------------------------------------------------------
 * ⚡ WONDERPLAY - ACADEMY DRIX VALORANT BOT
 * ---------------------------------------------------------------------
 * @copyright (c) 2026 Roxy Emanuel - Soreang, West Java, Indonesia
 * @author    Roxy Emanuel <https://github.com/RoxyEmanuel26>
 * @link      https://github.com/RoxyEmanuel26/Academy-Drix-Valorant
 * @community WonderPlay Discord: https://discord.gg/A6b3dT2eey
 * ---------------------------------------------------------------------
 */

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { GuildMember, User as DiscordUser, AttachmentBuilder } from 'discord.js';
import path from 'path';

// Register the custom font globally once
GlobalFonts.registerFromPath(path.join(process.cwd(), 'assets', 'Puffberry.ttf'), 'Puffberry');

// Define parameters object
export interface IDCardData {
    discordId: string;
    username: string;
    gender: string;
    rankName: string;
    domicile: string;
    joinDate: string;
    avatarUrl: string;
}

export async function generateProfileCard(data: IDCardData): Promise<AttachmentBuilder> {
    const canvas = createCanvas(800, 450);
    const ctx = canvas.getContext('2d');

    // 1. Draw Background
    try {
        const bgPath = path.join(process.cwd(), 'assets', 'background-card-profile.jpg');
        const bgImage = await loadImage(bgPath);
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } catch (e) {
        // Fallback solid color if background file is missing
        ctx.fillStyle = '#2b2d31';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Draw Header Title: "Kartu Academy Drix WONDERPLAY"
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000'; // Make sure this contrasts with the background
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('KARTU ACADEMY DRIX', canvas.width / 2, 50);
    ctx.font = '36px "Puffberry"'; // Use the newly registered custom font here
    ctx.fillText('WONDERPLAY', canvas.width / 2, 85);

    // 3. Draw Info Text (Left Side)
    ctx.textAlign = 'left';
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#000000';
    const startX = 50;
    const valueX = 250;
    let startY = 160;
    const lineHeight = 50;

    // Field Titles
    ctx.fillText('No ID', startX, startY);
    ctx.fillText('Nama', startX, startY + lineHeight * 1);
    ctx.fillText('Domisili', startX, startY + lineHeight * 2);
    ctx.fillText('Jenis Kelamin', startX, startY + lineHeight * 3);
    ctx.fillText('Rank', startX, startY + lineHeight * 4);

    // Colons
    for (let i = 0; i < 5; i++) {
        ctx.fillText(':', startX + 170, startY + (lineHeight * i));
    }

    // Values
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(data.discordId, valueX, startY);
    ctx.fillText(data.username, valueX, startY + lineHeight * 1);
    ctx.fillText(data.domicile, valueX, startY + lineHeight * 2);
    ctx.fillText(data.gender, valueX, startY + lineHeight * 3);
    ctx.fillText(data.rankName, valueX, startY + lineHeight * 4);

    // 4. Draw Avatar (Right Side block)
    const avatarSize = 200;
    const xAvatar = 540;
    const yAvatar = 140;

    try {
        const avatarImage = await loadImage(data.avatarUrl);

        // Clip avatar as a rounded square or circle (Let's do rounded square to mimic photo)
        ctx.save();
        const radius = 20;
        ctx.beginPath();
        ctx.moveTo(xAvatar + radius, yAvatar);
        ctx.lineTo(xAvatar + avatarSize - radius, yAvatar);
        ctx.quadraticCurveTo(xAvatar + avatarSize, yAvatar, xAvatar + avatarSize, yAvatar + radius);
        ctx.lineTo(xAvatar + avatarSize, yAvatar + avatarSize - radius);
        ctx.quadraticCurveTo(xAvatar + avatarSize, yAvatar + avatarSize, xAvatar + avatarSize - radius, yAvatar + avatarSize);
        ctx.lineTo(xAvatar + radius, yAvatar + avatarSize);
        ctx.quadraticCurveTo(xAvatar, yAvatar + avatarSize, xAvatar, yAvatar + avatarSize - radius);
        ctx.lineTo(xAvatar, yAvatar + radius);
        ctx.quadraticCurveTo(xAvatar, yAvatar, xAvatar + radius, yAvatar);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(avatarImage, xAvatar, yAvatar, avatarSize, avatarSize);
        ctx.restore();

        // Add a subtle border to avatar
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

    } catch (e) {
        console.error('Failed to load avatar user for canvas', e);
    }

    // 5. Draw Member Since / Footer Dates below Avatar
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';

    // Add a stroke outline to make it readable across vibrant gradients
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#000000'; // Fill with black text

    const dateParts = data.joinDate.split(' ');
    // Split the date text into two lines: 'DD Bulan' and 'YYYY'
    if (dateParts.length >= 3) {
        // Line 1
        ctx.strokeText(dateParts[0] + ' ' + dateParts[1], xAvatar + (avatarSize / 2), yAvatar + avatarSize + 35);
        ctx.fillText(dateParts[0] + ' ' + dateParts[1], xAvatar + (avatarSize / 2), yAvatar + avatarSize + 35);

        // Line 2
        ctx.strokeText(dateParts[2], xAvatar + (avatarSize / 2), yAvatar + avatarSize + 60);
        ctx.fillText(dateParts[2], xAvatar + (avatarSize / 2), yAvatar + avatarSize + 60);
    } else {
        ctx.strokeText(data.joinDate, xAvatar + (avatarSize / 2), yAvatar + avatarSize + 35);
        ctx.fillText(data.joinDate, xAvatar + (avatarSize / 2), yAvatar + avatarSize + 35);
    }


    const buffer = await canvas.encode('png');
    return new AttachmentBuilder(buffer, { name: 'profile-card.png' });
}
