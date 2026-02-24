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
import { agentEmojiHints } from '../../../data/valorant';

const cooldowns = new Map<string, number>();

function sanitizeAgent(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export default {
    name: 'set-main-agent',
    aliases: ['set-agent', 'setagent'],
    description: 'Set 1 hingga 3 Agent VALORANT andalanmu (contoh: !set-agent Jett Reyna Omen)',
    async execute(message: Message, args: string[]) {
        if (!featureFlags.profile) {
            return message.reply('Fitur profil sedang dimatikan oleh admin.');
        }

        const userId = message.author.id;
        const now = Date.now();
        if (cooldowns.has(userId) && (now - cooldowns.get(userId)!) < 60000) {
            return message.reply('⏳ Tunggu sebentar! Kamu baru saja mengatur agent. Coba lagi 1 menit kemudian.');
        }

        if (args.length === 0) {
            return message.reply('❌ Tolong sebutkan minimal 1 agent! Contoh: `!set-agent Jett` atau `!set-agent Jett Reyna Omen`');
        }

        const agent1 = sanitizeAgent(args[0]);
        const agent2 = args[1] ? sanitizeAgent(args[1]) : '';
        const agent3 = args[2] ? sanitizeAgent(args[2]) : '';

        // Verification checking using agentEmojiHints as dictionary keys
        const validAgents = Object.keys(agentEmojiHints);

        if (!validAgents.includes(agent1)) {
            return message.reply(`❌ Agent \`${agent1}\` tidak ditemukan di database game VALORANT.`);
        }
        if (agent2 && !validAgents.includes(agent2)) {
            return message.reply(`❌ Agent \`${agent2}\` tidak ditemukan di database game VALORANT.`);
        }
        if (agent3 && !validAgents.includes(agent3)) {
            return message.reply(`❌ Agent \`${agent3}\` tidak ditemukan di database game VALORANT.`);
        }

        cooldowns.set(userId, now);

        // Save to DB
        await User.findOneAndUpdate(
            { discordId: userId },
            {
                mainAgent: agent1,
                mainAgent2: agent2 || undefined,
                mainAgent3: agent3 || undefined
            },
            { upsert: true, new: true }
        );

        // Build Response
        const getEmoji = (name: string) => agentEmojiHints[name] ? agentEmojiHints[name][0] : '';
        const lines = [];
        lines.push(`🥇 Main    : **${agent1}** ${getEmoji(agent1)}`);

        if (agent2) lines.push(`🥈 Second  : **${agent2}** ${getEmoji(agent2)}`);
        else lines.push(`🥈 Second  : *-*`);

        if (agent3) lines.push(`🥉 Third   : **${agent3}** ${getEmoji(agent3)}`);
        else lines.push(`🥉 Third   : *-*`);

        const embed = createFunEmbed(
            '✅ Main Agent Kamu Updated!',
            `━━━━━━━━━━━━━━━━━━━━━━\n${lines.join('\n')}\n━━━━━━━━━━━━━━━━━━━━━━\nSekarang semua orang tau kamu ${agent1} main sejati! 🔪`
        );

        return message.reply({ embeds: [embed] });
    },
};
