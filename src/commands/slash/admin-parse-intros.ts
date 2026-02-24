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

import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel, MessageFlags } from 'discord.js';
import { GuildConfig } from '../../database/models/GuildConfig';
import { parseIntroduction } from '../../utils/introParser';

export default {
    data: new SlashCommandBuilder()
        .setName('admin-parse-intros')
        .setDescription('Scan riwayat channel #introducing dan masukkan data profil player lama ke DB.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption(option =>
            option.setName('limit')
                .setDescription('Jumlah maksimal pesan yang mau di scan (0 untuk UNLIMITED/semua). Default: Unlimited.')
                .setRequired(false)
                .setMinValue(0)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return;

        const config = await GuildConfig.findOne({ guildId: interaction.guildId });

        if (!config?.introducingChannelId) {
            await interaction.reply({ content: '❌ Fitur ini belum dikonfigurasi. Gunakan `/setup intro-channel` terlebih dahulu.' });
            return;
        }

        const channel = interaction.guild?.channels.cache.get(config.introducingChannelId) as TextChannel;
        if (!channel || !channel.isTextBased()) {
            return interaction.reply({ content: '❌ Channel Introducing tidak ditemukan atau bukan channel teks yang valid.' });
        }

        // If 0 or null, treat as unlimited
        const rawLimit = interaction.options.getInteger('limit');
        const isUnlimited = rawLimit === 0 || rawLimit === null;
        const targetLimit = rawLimit || 999999;

        await interaction.deferReply();

        try {
            let totalFetched = 0;
            let parsedCount = 0;
            let skippedCount = 0;
            let lastMessageId: string | undefined = undefined;
            let hasMore = true;
            const processedUserIds = new Set<string>();

            while (hasMore && totalFetched < targetLimit) {
                const fetchLimit = Math.min(100, targetLimit - totalFetched);
                const fetchOptions: any = { limit: fetchLimit };
                if (lastMessageId) fetchOptions.before = lastMessageId;

                const messages = await channel.messages.fetch(fetchOptions) as any;
                if (!messages || messages.size === 0) {
                    hasMore = false;
                    break;
                }

                for (const [_, msg] of (messages as Map<string, any>)) {
                    if (!msg.author.bot) {
                        const content = msg.content.toLowerCase();
                        // Basic heuristic to check if it's a template
                        if (content.includes('★┇')) {
                            // If we already parsed an intro for this user (which would be newer), skip the old one
                            if (!processedUserIds.has(msg.author.id)) {
                                // Call the parser helper, set retroactive = true so it doesn't spam react
                                await parseIntroduction(msg, true);
                                processedUserIds.add(msg.author.id);
                                parsedCount++;
                            } else {
                                skippedCount++;
                            }
                        }
                    }
                    totalFetched++;
                    lastMessageId = msg.id;

                    if (totalFetched >= targetLimit) {
                        hasMore = false;
                        break;
                    }
                }

                if (messages.size < 100) {
                    hasMore = false; // Reached the beginning of the channel
                }
            }

            const limitText = isUnlimited ? 'Semua pesan (Unlimited)' : `Maksimal **${targetLimit}** pesan`;
            await interaction.editReply(`✅ Berhasil melakukan scanning pada riwayat: ${limitText}.\n🔍 Total pesan dibaca: **${totalFetched}**\n📝 Berhasil memperbarui **${parsedCount}** profil pemain.\n⏭️ Melewati **${skippedCount}** data duplikat lama.`);

        } catch (error) {
            console.error('[Admin Parse Intros Error]', error);
            await interaction.editReply('❌ Gagal membaca pesan dari channel tersebut. Pastikan bot memiliki izin "Read Message History".');
        }
    },
};


