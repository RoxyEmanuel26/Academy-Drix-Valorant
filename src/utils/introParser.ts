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

export async function parseIntroduction(message: Message, isRetroactive: boolean = false) {
    const content = message.content;
    const lines = content.split('\n');
    let riotId = '-';
    let domicile = '-';
    let aboutMe = '-';
    let name = '-';
    let age = '-';
    let birthdate = '-';
    let pronouns = '-';
    let hobbies = '-';
    let mbti = '-';
    let sosmed = '-';

    for (const line of lines) {
        if (!line.includes('★┇')) continue;

        const lowerLine = line.toLowerCase();

        // Match: "★┇Nama: Drix"
        if (lowerLine.includes('nama:')) {
            const parts = line.split(':');
            if (parts.length > 1) name = parts.slice(1).join(':').trim();
        }

        // Match: "★┇Umur: 21"
        if (lowerLine.includes('umur:')) {
            const parts = line.split(':');
            if (parts.length > 1) age = parts.slice(1).join(':').trim();
        }

        // Match: "★┇Birthdate: 20/10/2004"
        if (lowerLine.includes('birthdate:')) {
            const parts = line.split(':');
            if (parts.length > 1) birthdate = parts.slice(1).join(':').trim();
        }

        // Match: "★┇Pronouns: He"
        if (lowerLine.includes('pronouns:')) {
            const parts = line.split(':');
            if (parts.length > 1) pronouns = parts.slice(1).join(':').trim();
        }

        // Match: "★┇ID Roblox/Valo: Name#Tag"
        if (lowerLine.includes('id roblox/valo:') || lowerLine.includes('id valo:') || lowerLine.includes('id roblox:')) {
            const parts = line.split(':');
            if (parts.length > 1) {
                riotId = parts.slice(1).join(':').trim();
            }
        }

        // Match: "★┇Domisili: Jakarta"
        if (lowerLine.includes('domisili:')) {
            const parts = line.split(':');
            if (parts.length > 1) {
                domicile = parts.slice(1).join(':').trim();
            }
        }

        // Match: "★┇Hobbies/Games: something"
        if (lowerLine.includes('hobbies/games:') || lowerLine.includes('hobbies:')) {
            const parts = line.split(':');
            if (parts.length > 1) hobbies = parts.slice(1).join(':').trim();
        }

        // Match: "★┇MBTI/Personality: ENFP"
        if (lowerLine.includes('mbti/personality:') || lowerLine.includes('mbti:')) {
            const parts = line.split(':');
            if (parts.length > 1) mbti = parts.slice(1).join(':').trim();
        }

        // Match: "★┇About me: something"
        if (lowerLine.includes('about me:')) {
            const parts = line.split(':');
            if (parts.length > 1) {
                aboutMe = parts.slice(1).join(':').trim();
            }
        }

        // Match: "★┇Sosmed (IG or TikTok): @laandrix"
        if (lowerLine.includes('sosmed')) {
            const parts = line.split(':');
            if (parts.length > 1) sosmed = parts.slice(1).join(':').trim();
        }
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

        const cleanField = (val: string) => {
            const lower = val.toLowerCase();
            if (lower === '-' || lower === 'opsional' || lower === '**opsional**' || lower === '') {
                return '';
            }
            return val;
        };

        const finalName = cleanField(name);
        const finalAge = cleanField(age);
        const finalBirthdate = cleanField(birthdate);
        const finalPronouns = cleanField(pronouns);

        let finalDomicile = cleanField(domicile);
        if (finalDomicile.length > 30) finalDomicile = finalDomicile.substring(0, 27) + '...';

        const finalHobbies = cleanField(hobbies);
        const finalMbti = cleanField(mbti);
        const finalSosmed = cleanField(sosmed);

        let finalBio = cleanField(aboutMe);
        if (finalBio.length > 100) finalBio = finalBio.substring(0, 97) + '...';

        if (userRecord.name !== finalName) { userRecord.name = finalName; updated = true; }
        if (userRecord.age !== finalAge) { userRecord.age = finalAge; updated = true; }
        if (userRecord.birthdate !== finalBirthdate) { userRecord.birthdate = finalBirthdate; updated = true; }
        if (userRecord.pronouns !== finalPronouns) { userRecord.pronouns = finalPronouns; updated = true; }
        if (userRecord.domicile !== finalDomicile) { userRecord.domicile = finalDomicile; updated = true; }
        if (userRecord.hobbies !== finalHobbies) { userRecord.hobbies = finalHobbies; updated = true; }
        if (userRecord.mbti !== finalMbti) { userRecord.mbti = finalMbti; updated = true; }
        if (userRecord.sosmed !== finalSosmed) { userRecord.sosmed = finalSosmed; updated = true; }
        if (userRecord.bio !== finalBio) { userRecord.bio = finalBio; updated = true; }

        if (riotId !== '-') {
            // Only update Riot ID if they haven't manually used `/link` to connect a real Riot Account
            if (!userRecord.riotPuuid) {
                if (riotId.includes('#')) {
                    const [name, tag] = riotId.split('#');
                    if (name && tag) {
                        userRecord.riotGameName = name.trim();
                        userRecord.riotTagLine = tag.trim();
                        userRecord.optedIn = true;
                        updated = true;
                    }
                } else {
                    // Support non-hashtag inputs like "XirdNall"
                    userRecord.riotGameName = riotId.trim();
                    userRecord.riotTagLine = ''; // Leave blank or NA
                    userRecord.optedIn = true;
                    updated = true;
                }
            }
        }

        if (updated) {
            await userRecord.save();
            if (!isRetroactive) {
                await message.react('✅'); // Acknowledge only if it's live
            }
        }

    } catch (e) {
        console.error('[IntroParser] Failed to save intro to DB', e);
    }
}
