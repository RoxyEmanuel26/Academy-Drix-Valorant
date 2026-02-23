import { Message, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } from 'discord.js';
import { createFunEmbed } from '../../utils/embed';
import { featureFlags } from '../../config/featureFlags';

export default {
    name: 'help',
    description: 'Bantuan tentang semua fitur bot!',
    async execute(message: Message, args: string[]) {
        const embed = createFunEmbed(
            '📚 Academy Drix Valorant - Help Menu',
            'Pilih kategori fitur lewat menu dropdown di bawah untuk melihat daftar command yang tersedia! 🎉'
        );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help_menu')
                    .setPlaceholder('Pilih Kategori Command')
                    .addOptions([
                        { label: 'Account & Linking', value: 'account', emoji: '🔗' },
                        { label: 'Personal Stats', value: 'stats', emoji: '📊' },
                        { label: 'Leaderboards', value: 'leaderboard', emoji: '🏆' },
                        { label: 'Fun & Games', value: 'fun', emoji: '🎲' },
                        { label: 'Missions', value: 'missions', emoji: '🎯' },
                        { label: 'LFG', value: 'lfg', emoji: '🎮' },
                        { label: 'Tournaments', value: 'tournaments', emoji: '🚩' },
                        { label: 'Info & Global', value: 'info', emoji: 'ℹ️' },
                        { label: 'Admin', value: 'admin', emoji: '⚙️' },
                    ])
            );

        const response = await message.reply({ embeds: [embed], components: [row] });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== message.author.id) {
                await i.reply({ content: 'Ini menu help punya orang lain! Gunakan `!help` sendiri ya.', ephemeral: true });
                return;
            }

            const selection = i.values[0];
            let newEmbed = createFunEmbed('Bantuan', '');

            switch (selection) {
                // (Cases duplicated from slash command for brevity, normally you'd extract this mapping into a config)
                case 'account':
                    if (!featureFlags.valorantStats) {
                        newEmbed.setTitle('🔗 Account & Linking (Segera Hadir 🚧)')
                            .setDescription('Fitur ini akan diaktifkan setelah integrasi Riot/RSO dihidupkan oleh admin. Sementara itu, nikmati dulu games & feature lainnya ya! ✨');
                    } else {
                        newEmbed.setTitle('🔗 Account & Linking')
                            .setDescription('`/link` atau `!link` - Login RSO\n`/unlink` atau `!unlink` - Hapus akun\n`/me` atau `!me` - Lihat profil\n`/privacy` atau `!privacy` - Kebijakan privasi');
                    }
                    break;
                case 'stats':
                    if (!featureFlags.valorantStats) {
                        newEmbed.setTitle('📊 Personal Stats (Segera Hadir 🚧)')
                            .setDescription('Fitur ini akan diaktifkan setelah integrasi Riot/RSO dihidupkan oleh admin.');
                    } else {
                        newEmbed.setTitle('📊 Personal Stats')
                            .setDescription('`/mystats` atau `!mystats` - Profil & Winrate kamu\n`/lastmatch` atau `!lastmatch` - Info Match Terakhir\n`/stats` atau `!stats @user` - Stats teman');
                    }
                    break;
                case 'leaderboard':
                    if (!featureFlags.valorantLeaderboards) {
                        newEmbed.setTitle('🏆 Leaderboards (Segera Hadir 🚧)')
                            .setDescription('Fitur ini akan diaktifkan setelah integrasi Riot/RSO dihidupkan oleh admin.');
                    } else {
                        newEmbed.setTitle('🏆 Leaderboards')
                            .setDescription('`/leaderboard` atau `!leaderboard <type>` - Lihat ranking server');
                    }
                    break;
                case 'fun':
                    newEmbed.setTitle('🎲 Fun & Games')
                        .setDescription('`/guess-agent` atau `!guess-agent` - Tebak Agent\n`/agent-roulette` atau `!agent-roulette` - Spin Agent Random');
                    break;
                case 'missions':
                    newEmbed.setTitle('🎯 Missions')
                        .setDescription('`/missions` atau `!missions` - Lihat misi aktif harian/mingguan');
                    break;
                case 'lfg':
                    newEmbed.setTitle('🎮 Looking For Group')
                        .setDescription('`/lfg` atau `!lfg` - Cari teman mabar\n`/lfg-close` atau `!lfg-close` - Tutup post LFG');
                    break;
                case 'tournaments':
                    newEmbed.setTitle('🚩 Tournaments')
                        .setDescription('`/tourney-register` atau `!tourney-register` - Daftar Turnamen\n`/tourney-create` (Admin) - Buat turnamen');
                    break;
                case 'info':
                    if (!featureFlags.valorantContent || !featureFlags.valorantStatus) {
                        newEmbed.setTitle('ℹ️ Info & Global Stats (Segera Hadir 🚧)')
                            .setDescription('Fitur info & server status sedang dimatikan oleh admin.');
                    } else {
                        newEmbed.setTitle('ℹ️ Info & Global Stats')
                            .setDescription('`/status` atau `!status` - Status Server AP Riot\n`/agents` atau `!agents` - Info role');
                    }
                    break;
                case 'admin':
                    newEmbed.setTitle('⚙️ Admin Config')
                        .setDescription('`/config` atau `!config` - Settings Server\n`/set-leaderboard-channel` - Set channel LB');
                    break;
            }

            await i.update({ embeds: [newEmbed], components: [row] });
        });

        collector.on('end', () => {
            response.edit({ components: [] }).catch(() => { });
        });
    },
};
