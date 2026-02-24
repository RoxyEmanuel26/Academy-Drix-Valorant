"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const embed_1 = require("../../utils/embed");
const featureFlags_1 = require("../../config/featureFlags");
exports.default = {
    name: 'help',
    description: 'Bantuan tentang semua fitur bot!',
    async execute(message, args) {
        const embed = (0, embed_1.createFunEmbed)('📚 Academy Drix Valorant - Help Menu', 'Pilih kategori fitur lewat menu dropdown di bawah untuk melihat daftar command yang tersedia! 🎉');
        const row = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.StringSelectMenuBuilder()
            .setCustomId('help_menu')
            .setPlaceholder('Pilih Kategori Command')
            .addOptions([
            { label: 'Account & Linking', value: 'account', emoji: '🔗' },
            { label: 'Personal Stats', value: 'stats', emoji: '📊' },
            { label: 'Leaderboards', value: 'leaderboard', emoji: '🏆' },
            { label: 'Profil & Personalisasi', value: 'profile', emoji: '👤' },
            { label: 'Fun & Games', value: 'fun', emoji: '🎲' },
            { label: 'Missions', value: 'missions', emoji: '🎯' },
            { label: 'LFP (Party)', value: 'lfp', emoji: '🎮' },
            { label: 'Tournaments', value: 'tournaments', emoji: '🚩' },
            { label: 'Info & Global', value: 'info', emoji: 'ℹ️' }
        ]));
        const response = await message.reply({ embeds: [embed], components: [row] });
        const collector = response.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.StringSelect, time: 60000 });
        collector.on('collect', async (i) => {
            if (i.user.id !== message.author.id) {
                await i.reply({ content: 'Ini menu help punya orang lain! Gunakan `!help` sendiri ya.', flags: discord_js_1.MessageFlags.Ephemeral });
                return;
            }
            const selection = i.values[0];
            let newEmbed = (0, embed_1.createFunEmbed)('Bantuan', 'Memuat informasi...');
            switch (selection) {
                // (Cases duplicated from slash command for brevity, normally you'd extract this mapping into a config)
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
                case 'profile':
                    newEmbed.setTitle('👤 Profil & Personalisasi')
                        .setDescription('`/profile-card` atau `!profile` - Tampilkan statistik text profil Valorant\n`/card` atau `!card` - Tampilkan Graphic ID Card (KTP) kamu\n`/set-main-agent` atau `!set-agent` - Set 3 agent andalan\n`/set-bio` atau `!set-bio` - Tulis bio pendek di profil\n`/rank-role-claim` atau `!rank-claim` - Klaim role discord sesuai rank\n`/server-roster` atau `!roster` - Lihat kolektif anggota server & poin');
                    break;
                case 'fun':
                    newEmbed.setTitle('🎲 Fun & Games')
                        .setDescription('**🔥 Mini-Games Berhadiah Poin:**\n`/guess-map` atau `!guess-map` - Tebak Map Valorant\n`/valorant-quiz` atau `!quiz` - Kuis pilihan ganda VALORANT\n`/emoji-agent` atau `!emoji-agent` - Tebak Agent dari 3 Emoji\n`/scramble` atau `!scramble` - Susun huruf acak nama Map/Agent\n`/daily-challenge` atau `!daily` - Tantangan harian (Multiplier & Streak Bonus)\n\n**✨ Casual Games (No Points):**\n`/would-you-rather` atau `!wyr` - Polling skenario ekstrim\n`/this-or-that` atau `!tot` - Polling cepat 30 detik\n`/agent-personality` atau `!personality` - Tes kecocokan agent\n\n**🏆 Ekonomi Poin:**\n`/my-points` atau `!my-points` - Cek stats & rank kamu\n`/leaderboard-games` atau `!lb` - Klasemen Top 10 Server\n`/admin-points` atau `!admin-points` - (Admin Only) Modifikasi Poin');
                    break;
                case 'missions':
                    newEmbed.setTitle('🎯 Missions')
                        .setDescription('`/missions` atau `!missions` - Lihat misi aktif harian/mingguan');
                    break;
                case 'lfg':
                    newEmbed.setTitle('🎮 Looking For Party (LFG/LFP)')
                        .setDescription('`/lfg` atau `/lfp` (Prefix: `!lfg`, `!lfp`) - Cari teman mabar\n`/lfg-close` atau `/lfp-close` (Prefix: `!lfg-close`, `!lfp-close`) - Tutup post aktif');
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
            }
            await i.update({ embeds: [newEmbed], components: [row] });
        });
        collector.on('end', () => {
            response.edit({ components: [] }).catch(() => { });
        });
    },
};
