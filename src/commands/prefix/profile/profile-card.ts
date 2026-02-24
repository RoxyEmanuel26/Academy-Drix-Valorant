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

import { Message, GuildMember, EmbedBuilder } from 'discord.js';
import { featureFlags } from '../../../config/featureFlags';
import { User } from '../../../database/models/User';
import { GamePoints } from '../../../database/models/GamePoints';
import { Badge } from '../../../database/models/Badge';
import { getMemberRank } from '../../../utils/rankDetector';
import { agentEmojiHints } from '../../../data/valorant';

const cooldowns = new Map<string, number>();

export default {
    name: 'profile',
    aliases: ['profile-card', 'p'],
    description: 'Tampilkan stat text profile Valorant kamu (!profile)',
    async execute(message: Message, args: string[]) {
        if (!featureFlags.profile) {
            return message.reply('Fitur Profile sedang dinonaktifkan oleh admin.');
        }

        const callerId = message.author.id;
        const now = Date.now();
        if (cooldowns.has(callerId) && (now - cooldowns.get(callerId)!) < 15000) {
            return message.reply('⏳ Sabar ya, cooldown command Profile adalah 15 detik!');
        }

        const guild = message.guild;
        if (!guild) return message.reply('Command ini hanya bisa digunakan di server!');

        let targetUser = message.author;
        let targetMember = message.member as GuildMember;

        if (message.mentions.users.size > 0) {
            targetUser = message.mentions.users.first()!;
            targetMember = await guild.members.fetch(targetUser.id).catch(() => null) as GuildMember;
            if (!targetMember) return message.reply('❌ User tersebut tidak ada di server ini.');
        }

        cooldowns.set(callerId, now);

        // Wait message
        const waitMsg = await message.reply('🔄 Memuat profile...');

        try {
            const [userDb, gamePoints, badges] = await Promise.all([
                User.findOne({ discordId: targetUser.id }),
                GamePoints.findOne({ guildId: guild.id, userId: targetUser.id }),
                Badge.find({ guildId: guild.id, userId: targetUser.id })
            ]);

            let serverRank = '-';
            if (gamePoints) {
                const higherPlayers = await GamePoints.countDocuments({
                    guildId: guild.id,
                    totalPoints: { $gt: gamePoints.totalPoints }
                });
                serverRank = `#${higherPlayers + 1}`;
            }

            const { rank, emoji, color, source } = await getMemberRank(targetMember, userDb, featureFlags);

            const embed = new EmbedBuilder()
                .setColor(color)
                .setAuthor({
                    name: `${targetUser.username}'s Profile`,
                    iconURL: targetUser.displayAvatarURL()
                });

            const bioText = userDb?.bio ? `*"${userDb.bio}"*` : '*Belum set bio (Gunakan `!set-bio`)*';
            embed.setDescription(bioText);

            let sourceStr = 'Manual Claim';
            if (source === 'riot_api') sourceStr = 'Riot API (Verified)';
            if (source === 'discord_role') sourceStr = 'Discord Role';

            embed.addFields({
                name: '🏅 Rank saat ini',
                value: `${emoji} **${rank}**`,
                inline: true
            });

            const linkStatus = userDb?.optIn ? `✅ Terhubung (${userDb.riotGameName}#${userDb.riotTagLine})` : '❌ Belum Terhubung (`!link`)';
            embed.addFields({
                name: '🎮 Riot Account',
                value: linkStatus,
                inline: true
            });

            const getAgFmt = (ag?: string) => {
                if (!ag) return '*-*';
                const emj = agentEmojiHints[ag] ? agentEmojiHints[ag][0] : '';
                return `**${ag}** ${emj}`;
            };
            const agentsList = [getAgFmt(userDb?.mainAgent), getAgFmt(userDb?.mainAgent2), getAgFmt(userDb?.mainAgent3)].filter(x => x !== '*-*');
            const agentField = agentsList.length > 0 ? agentsList.join(' | ') : '*Belum set agent (`!set-agent`)*';

            embed.addFields({
                name: '👥 Main Agents',
                value: agentField,
                inline: false
            });

            const totalPts = gamePoints?.totalPoints || 0;
            const streak = gamePoints?.currentStreak || 0;
            const games = gamePoints?.gamesPlayed || 0;
            const winRate = games > 0 ? ((gamePoints!.gamesWon / games) * 100).toFixed(1) + '%' : '0%';

            embed.addFields(
                { name: '🔥 Total Points', value: `\`${totalPts}\` PTS\n(Server Rank: **${serverRank}**)`, inline: true },
                { name: '📊 Win Rate', value: `\`${winRate}\`\n(Dari ${games} game)`, inline: true },
                { name: '🔥 Winstreak', value: `\`${streak}\` Wins`, inline: true }
            );

            const renderBadges = badges.length > 0
                ? badges.map(b => `\`[${b.code.toUpperCase()}]\` ${b.name}`).slice(0, 6).join('\n')
                + (badges.length > 6 ? `\n*+${badges.length - 6} badges lainnya...*` : '')
                : '*Belum memiliki Badge koleksi*';

            embed.addFields({
                name: `🏆 Badges (${badges.length})`,
                value: renderBadges,
                inline: false
            });

            embed.setThumbnail(targetUser.displayAvatarURL({ size: 256 }));
            embed.setFooter({ text: `Member sejak: ${targetMember.joinedAt?.toLocaleDateString('id-ID')}` });

            await waitMsg.edit({ content: null, embeds: [embed] });

        } catch (error) {
            console.error('[Profile Card Prefix]', error);
            await waitMsg.edit('❌ Terjadi kesalahan saat memuat profile. Coba lagi nanti ya!');
        }
    },
};
