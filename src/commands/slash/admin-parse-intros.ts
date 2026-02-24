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

import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js';
import { GuildConfig } from '../../database/models/GuildConfig';
import { parseIntroduction } from '../../utils/introParser';

export default {
    data: new SlashCommandBuilder()
        .setName('admin-parse-intros')
        .setDescription('Scan riwayat channel #introducing dan masukkan data profil player lama ke DB.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption(option =>
            option.setName('limit')
                .setDescription('Jumlah maksimal pesan yang mau di scan ke belakang (max 100). Default 50.')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(100)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.guildId) return;

        const config = await GuildConfig.findOne({ guildId: interaction.guildId });

        if (!config?.introducingChannelId) {
            await interaction.reply({ content: '❌ Fitur ini belum dikonfigurasi. Gunakan `/setup intro-channel` terlebih dahulu.', ephemeral: true });
            return;
        }

        const channel = interaction.guild?.channels.cache.get(config.introducingChannelId) as TextChannel;
        if (!channel || !channel.isTextBased()) {
            return interaction.reply({ content: '❌ Channel Introducing tidak ditemukan atau bukan channel teks yang valid.', ephemeral: true });
        }

        const limit = interaction.options.getInteger('limit') || 50;

        await interaction.deferReply({ ephemeral: true });

        try {
            const messages = await channel.messages.fetch({ limit: limit });
            let parsedCount = 0;

            for (const [_, msg] of messages) {
                if (msg.author.bot) continue;

                const content = msg.content.toLowerCase();
                // Basic heuristic to check if it's a template
                if (content.includes('★┇')) {
                    // Call the parser helper, set retroactive = true so it doesn't spam react
                    await parseIntroduction(msg, true);
                    parsedCount++;
                }
            }

            await interaction.editReply(`✅ Berhasil melakukan scanning pada **${messages.size}** pesan terakhir.\nMenemukan dan memproses **${parsedCount}** formulir profil lama.`);

        } catch (error) {
            console.error('[Admin Parse Intros Error]', error);
            await interaction.editReply('❌ Gagal membaca pesan dari channel tersebut. Pastikan bot memiliki izin "Read Message History".');
        }
    },
};
