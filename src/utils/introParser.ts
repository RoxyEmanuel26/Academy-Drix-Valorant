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

import { Message } from 'discord.js';
import { User } from '../database/models/User';

export async function parseIntroduction(message: Message) {
    const content = message.content;
    const lines = content.split('\n');
    let riotId = '-';
    let hobbies = '-';
    let aboutMe = '-';

    for (const line of lines) {
        const lowerLine = line.toLowerCase();

        // Match: "★┇ID Roblox/Valo: Name#Tag"
        if (lowerLine.includes('id roblox/valo:') || lowerLine.includes('id valo:') || lowerLine.includes('id roblox:')) {
            const parts = line.split(':');
            if (parts.length > 1) {
                riotId = parts.slice(1).join(':').trim();
            }
        }

        // Match: "★┇Hobbies/Games: something"
        if (lowerLine.includes('hobbies/games:') || lowerLine.includes('hobbies:')) {
            const parts = line.split(':');
            if (parts.length > 1) {
                hobbies = parts.slice(1).join(':').trim();
            }
        }

        // Match: "★┇About me: something"
        if (lowerLine.includes('about me:')) {
            const parts = line.split(':');
            if (parts.length > 1) {
                aboutMe = parts.slice(1).join(':').trim();
            }
        }
    }

    // We will map these into the User's Profile
    // 1. riotId can go into riotGameName / riotTagLine (if it has a #)
    // 2. aboutMe + hobbies can be combined into their `bio`
    let finalBio = '';
    if (aboutMe !== '-' && aboutMe !== '') finalBio += `About: ${aboutMe} `;
    if (hobbies !== '-' && hobbies !== '') finalBio += `| Hobbies: ${hobbies}`;

    finalBio = finalBio.trim();
    if (finalBio.length > 100) {
        finalBio = finalBio.substring(0, 97) + '...'; // Truncate to fit schema limit (100)
    }

    try {
        let userRecord = await User.findOne({ discordId: message.author.id });
        if (!userRecord) {
            userRecord = new User({
                discordId: message.author.id,
                username: message.author.username,
            });
        }

        let updated = false;

        if (finalBio.length > 0) {
            userRecord.bio = finalBio;
            updated = true;
        }

        if (riotId !== '-' && riotId.includes('#')) {
            const [name, tag] = riotId.split('#');
            if (name && tag) {
                userRecord.riotGameName = name.trim();
                userRecord.riotTagLine = tag.trim();
                // Optionally auto opt-in since they provided it natively
                userRecord.optIn = true;
                updated = true;
            }
        }

        if (updated) {
            await userRecord.save();
            await message.react('✅'); // Acknowledge the parsing
        }

    } catch (e) {
        console.error('[IntroParser] Failed to save intro to DB', e);
    }
}
