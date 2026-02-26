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

import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember, EmbedBuilder, MessageFlags } from 'discord.js';
import { featureGuard } from '../../../utils/featureGuard';
import { featureFlags } from '../../../config/featureFlags';
import { User } from '../../../database/models/User';
import { GamePoints } from '../../../database/models/GamePoints';
import { Badge } from '../../../database/models/Badge';
import { getMemberRank } from '../../../utils/rankDetector';
import { agentEmojiHints } from '../../../data/valorant';

const cooldowns = new Map<string, number>();

export default {
    data: new SlashCommandBuilder()
        .setName('profile-card')
        .setDescription('Tampilkan Profile Card Valorant kamu yang keren!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Pilih user lain untuk melihat profile mereka (opsional)')
                .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const guard = featureGuard('PROFILE');
        if (!guard.allowed) {
            return interaction.reply({ content: guard.reason, flags: MessageFlags.Ephemeral });
        }

        const callerId = interaction.user.id;
        const now = Date.now();
        if (cooldowns.has(callerId) && (now - cooldowns.get(callerId)!) < 5000) {
            return interaction.reply({ content: '⏳ Sabar ya, cooldown command Profile adalah 5 detik!', flags: MessageFlags.Ephemeral });
        }

        const targetUser = interaction.options.getUser('user') || interaction.user;
        const guild = interaction.guild;
        if (!guild) return interaction.reply({ content: 'Command ini hanya bisa digunakan di server!', flags: MessageFlags.Ephemeral });

        let targetMember = interaction.options.getMember('user') as GuildMember;
        if (!targetMember) {
            try {
                targetMember = await guild.members.fetch(targetUser.id);
            } catch {
                return interaction.reply({ content: '❌ User tersebut tidak ada di server ini.', flags: MessageFlags.Ephemeral });
            }
        }

        await interaction.deferReply();
        cooldowns.set(callerId, now);

        try {
            // Fetch All Associated Data
            const [userDb, gamePoints, badges, rankPosCount] = await Promise.all([
                User.findOne({ discordId: targetUser.id }),
                GamePoints.findOne({ guildId: guild.id, userId: targetUser.id }),
                Badge.find({ guildId: guild.id, userId: targetUser.id }),
                GamePoints.countDocuments({
                    guildId: guild.id,
                    totalPoints: { $gt: GamePoints.findOne({ guildId: guild.id, userId: targetUser.id }).select('totalPoints').lean() as any }
                }) // Note: Needs raw execution below to work properly
            ]);

            // Proper rank position derivation
            let serverRank = '-';
            if (gamePoints) {
                const higherPlayers = await GamePoints.countDocuments({
                    guildId: guild.id,
                    totalPoints: { $gt: gamePoints.totalPoints }
                });
                serverRank = `#${higherPlayers + 1}`;
            }

            const { rank, emoji, color, source } = await getMemberRank(targetMember, userDb, featureFlags);

            // Compose The Embed
            const embed = new EmbedBuilder()
                .setColor(color)
                .setAuthor({
                    name: `${targetUser.username}'s Profile`,
                    iconURL: targetUser.displayAvatarURL()
                });

            // Bio
            const bioText = userDb?.bio ? `*"${userDb.bio}"*` : '*Belum set bio (Gunakan `/set-bio`)*';
            embed.setDescription(bioText);

            // Rank Source Note
            let sourceStr = 'Manual Claim';
            if (source === 'riot_api') sourceStr = 'Riot API (Verified)';
            if (source === 'discord_role') sourceStr = 'Discord Role';

            embed.addFields({
                name: '🏅 Rank saat ini',
                value: `${emoji} **${rank}**`,
                inline: true
            });

            // Riot Link
            const riotTag = userDb?.riotTagLine ? `#${userDb.riotTagLine}` : '';
            const linkStatus = userDb?.optedIn ? `✅ Terhubung (${userDb.riotGameName}${riotTag})` : '❌ Belum Terhubung (`/link-account`)';
            embed.addFields({
                name: '🎮 Riot Account',
                value: linkStatus,
                inline: true
            });

            // Format Agent Visuals
            const getAgFmt = (ag?: string) => {
                if (!ag) return '*-*';
                const emj = agentEmojiHints[ag] ? agentEmojiHints[ag][0] : '';
                return `**${ag}** ${emj}`;
            };
            const agentsList = [getAgFmt(userDb?.mainAgent), getAgFmt(userDb?.mainAgent2), getAgFmt(userDb?.mainAgent3)].filter(x => x !== '*-*');
            const agentField = agentsList.length > 0 ? agentsList.join(' | ') : '*Belum set agent (`/set-main-agent`)*';

            embed.addFields({
                name: '👥 Main Agents',
                value: agentField,
                inline: false
            });

            // Server Minigame Stats
            const totalPts = gamePoints?.totalPoints || 0;
            const streak = gamePoints?.currentStreak || 0;
            const games = gamePoints?.gamesPlayed || 0;
            const winRate = games > 0 ? ((gamePoints!.gamesWon / games) * 100).toFixed(1) + '%' : '0%';

            embed.addFields(
                { name: '🔥 Total Points', value: `\`${totalPts}\` PTS\n(Server Rank: **${serverRank}**)`, inline: true },
                { name: '📊 Win Rate', value: `\`${winRate}\`\n(Dari ${games} game)`, inline: true },
                { name: '🔥 Winstreak', value: `\`${streak}\` Wins`, inline: true }
            );

            // Badges logic max 6 displaying
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

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('[Profile Card]', error);
            await interaction.editReply('❌ Terjadi kesalahan saat memuat profile. Coba lagi nanti ya!');
        }
    },
};


