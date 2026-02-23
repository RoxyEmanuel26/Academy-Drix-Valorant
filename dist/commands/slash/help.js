"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('help')
        .setDescription('Bantuan tentang semua fitur bot!'),
    async execute(interaction) {
        const embed = (0, embed_1.createFunEmbed)('📚 Academy Drix Valorant - Help Menu', 'Pilih kategori fitur lewat menu dropdown di bawah untuk melihat daftar command yang tersedia! 🎉');
        const row = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.StringSelectMenuBuilder()
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
        ]));
        const response = await interaction.reply({ embeds: [embed], components: [row] });
        const collector = response.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.StringSelect, time: 60000 });
        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                await i.reply({ content: 'Ini menu help punya orang lain! Gunakan `/help` sendiri ya.', ephemeral: true });
                return;
            }
            const selection = i.values[0];
            let newEmbed = (0, embed_1.createFunEmbed)('Bantuan', '');
            switch (selection) {
                case 'account':
                    if (!featureFlags_1.featureFlags.valorantStats) {
                        newEmbed.setTitle('🔗 Account & Linking (Segera Hadir 🚧)')
                            .setDescription('Fitur ini akan diaktifkan setelah integrasi Riot/RSO dihidupkan oleh admin. Sementara itu, nikmati dulu games & feature lainnya ya! ✨');
                    }
                    else {
                        newEmbed.setTitle('🔗 Account & Linking')
                            .setDescription('`/link` atau `!link` - Login RSO\n`/unlink` atau `!unlink` - Hapus akun\n`/me` atau `!me` - Lihat profil\n`/privacy` atau `!privacy` - Kebijakan privasi');
                    }
                    break;
                case 'stats':
                    if (!featureFlags_1.featureFlags.valorantStats) {
                        newEmbed.setTitle('📊 Personal Stats (Segera Hadir 🚧)')
                            .setDescription('Fitur ini akan diaktifkan setelah integrasi Riot/RSO dihidupkan oleh admin.');
                    }
                    else {
                        newEmbed.setTitle('📊 Personal Stats')
                            .setDescription('`/mystats` atau `!mystats` - Profil & Winrate kamu\n`/lastmatch` atau `!lastmatch` - Info Match Terakhir\n`/stats` atau `!stats @user` - Stats teman');
                    }
                    break;
                case 'leaderboard':
                    if (!featureFlags_1.featureFlags.valorantLeaderboards) {
                        newEmbed.setTitle('🏆 Leaderboards (Segera Hadir 🚧)')
                            .setDescription('Fitur ini akan diaktifkan setelah integrasi Riot/RSO dihidupkan oleh admin.');
                    }
                    else {
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
                    if (!featureFlags_1.featureFlags.valorantContent || !featureFlags_1.featureFlags.valorantStatus) {
                        newEmbed.setTitle('ℹ️ Info & Global Stats (Segera Hadir 🚧)')
                            .setDescription('Fitur info & server status sedang dimatikan oleh admin.');
                    }
                    else {
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
            interaction.editReply({ components: [] }).catch(() => { });
        });
    },
};
