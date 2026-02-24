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

import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType , MessageFlags } from 'discord.js';
import { featureFlags } from '../../../config/featureFlags';
import { GamePoints } from '../../../database/models/GamePoints';
import { detectRankFromRoles } from '../../../utils/rankDetector';

export default {
    data: new SlashCommandBuilder()
        .setName('server-roster')
        .setDescription('Lihat daftar lengkap anggota server beserta rank dan poin mereka.'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!featureFlags.profile) {
            return interaction.reply({ content: 'Fitur Profile sedang dinonaktifkan.', flags: MessageFlags.Ephemeral });
        }

        const guild = interaction.guild;
        if (!guild) return interaction.reply({ content: 'Hanya bisa dipakai di server.', flags: MessageFlags.Ephemeral });

        await interaction.deferReply();

        try {
            // Fetch all points sorted by totalPoints descending
            const roasterData = await GamePoints.find({ guildId: guild.id })
                .sort({ totalPoints: -1 })
                .lean();

            if (roasterData.length === 0) {
                return interaction.editReply('Belum ada data member di server ini. Ayo main minigames!');
            }

            const itemsPerPage = 10;
            const maxPages = Math.ceil(roasterData.length / itemsPerPage);
            let currentPage = 0;

            const generateEmbed = async (page: number) => {
                const start = page * itemsPerPage;
                const end = start + itemsPerPage;
                const currentChunk = roasterData.slice(start, end);

                const embed = new EmbedBuilder()
                    .setColor(0xBE3D6B)
                    .setTitle(`📖 Server Roster - ${guild.name}`)
                    .setDescription(`Total Anggota Terdaftar: **${roasterData.length}**\n*(Diurutkan berdasarkan Total Points)*`)
                    .setFooter({ text: `Halaman ${page + 1} dari ${maxPages}` });

                const lines = [];
                for (let i = 0; i < currentChunk.length; i++) {
                    const entry = currentChunk[i];
                    const globalRank = start + i + 1;

                    let rankStr = '❓ Unranked';
                    try {
                        const member = await guild.members.fetch(entry.userId);
                        if (member) {
                            const { rank, emoji } = detectRankFromRoles(member.roles.cache);
                            rankStr = `${emoji} ${rank}`;
                        }
                    } catch {
                        rankStr = '👻 Unknown'; // Left the server
                    }

                    const winRate = entry.gamesPlayed > 0 ? ((entry.gamesWon / entry.gamesPlayed) * 100).toFixed(0) + '%' : '0%';
                    lines.push(`**#${globalRank}.** <@${entry.userId}> — ${rankStr}\n└ 🎮 **${entry.totalPoints}** PTS | WR: ${winRate}`);
                }

                embed.addFields({ name: '🏆 Leaderboard', value: lines.join('\n\n') });
                return embed;
            };

            const getActionRow = (page: number) => {
                const row = new ActionRowBuilder<ButtonBuilder>();
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId('roster_prev')
                        .setLabel('◀ Prev')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 0),
                    new ButtonBuilder()
                        .setCustomId('roster_next')
                        .setLabel('Next ▶')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === maxPages - 1)
                );
                return row;
            };

            const message = await interaction.editReply({
                embeds: [await generateEmbed(currentPage)],
                components: maxPages > 1 ? [getActionRow(currentPage)] : []
            });

            if (maxPages > 1) {
                const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120000 });

                collector.on('collect', async (i) => {
                    if (i.user.id !== interaction.user.id) {
                        await i.reply({ content: 'Hanya pemanggil command yang bisa klik tombol ini.', flags: MessageFlags.Ephemeral });
                        return;
                    }

                    if (i.customId === 'roster_prev' && currentPage > 0) {
                        currentPage--;
                    } else if (i.customId === 'roster_next' && currentPage < maxPages - 1) {
                        currentPage++;
                    }

                    await i.update({
                        embeds: [await generateEmbed(currentPage)],
                        components: [getActionRow(currentPage)]
                    });
                });

                collector.on('end', () => {
                    const disabledRow = getActionRow(currentPage);
                    disabledRow.components.forEach(c => c.setDisabled(true));
                    message.edit({ components: [disabledRow] }).catch(() => { });
                });
            }

        } catch (error) {
            console.error('[Server Roster Error]', error);
            await interaction.editReply('❌ Gagal memuat roster. Coba lagi nanti.');
        }
    },
};

