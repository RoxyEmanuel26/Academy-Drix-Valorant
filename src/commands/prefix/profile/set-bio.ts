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

import { Message } from 'discord.js';
import { featureFlags } from '../../../config/featureFlags';
import { User } from '../../../database/models/User';
import { createFunEmbed } from '../../../utils/embed';

const cooldowns = new Map<string, number>();
const badWords = ['anjing', 'babi', 'kontol', 'memek', 'ngentot', 'bangsat', 'fuck', 'shit', 'bitch'];

export default {
    name: 'set-bio',
    aliases: ['setbio'],
    description: 'Set kalimat bio kamu langsung (contoh: !set-bio Aku Jett main!)',
    async execute(message: Message, args: string[]) {
        if (!featureFlags.profile) {
            return message.reply('Fitur profil sedang dimatikan oleh admin.');
        }

        const userId = message.author.id;
        const now = Date.now();
        if (cooldowns.has(userId) && (now - cooldowns.get(userId)!) < 60000) {
            return message.reply('⏳ Tunggu sebentar! Kamu baru saja mengatur bio. Coba lagi dalam 1 menit.');
        }

        let bioText = args.join(' ').trim();
        if (!bioText) {
            return message.reply('❌ Tolong ketik bio kamu! Contoh: `!set-bio Clutch or kick!`');
        }

        // Limit 100 char
        if (bioText.length > 100) {
            return message.reply('❌ Bio terlalu panjang! Maksimal 100 karakter ya.');
        }

        // URL Stripper
        bioText = bioText.replace(/https?:\/\/\S+/gi, '[Link Removed]');

        // Simple Profanity Filter
        const lowerBio = bioText.toLowerCase();
        for (const word of badWords) {
            if (lowerBio.includes(word)) {
                return message.reply('❌ Bio kamu mengandung kata-kata tidak pantas! Tolong ganti dengan kata yang lebih baik 😊');
            }
        }

        cooldowns.set(userId, now);

        await User.findOneAndUpdate(
            { discordId: userId },
            { bio: bioText },
            { upsert: true, new: true }
        );

        const embed = createFunEmbed(
            '✅ Bio Kamu Tersimpan!',
            `━━━━━━━━━━━━━━━━━━━━━━\n📝 Bio baru kamu:\n*"${bioText}"*\n━━━━━━━━━━━━━━━━━━━━━━\nBio ini akan tampil secara permanen di profile card kamu!`
        );

        return message.reply({ embeds: [embed] });
    },
};
