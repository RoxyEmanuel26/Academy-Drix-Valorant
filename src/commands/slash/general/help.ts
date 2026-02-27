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


import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, MessageFlags } from 'discord.js';
import { createFunEmbed } from '../../../utils/embed';
import { featureFlags } from '../../../config/featureFlags';
import { env } from '../../../config/env';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Bantuan tentang semua fitur bot!'),
    async execute(interaction: ChatInputCommandInteraction) {
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
                        { label: 'Profil & Personalisasi', value: 'profile', emoji: '👤' },
                        { label: 'Fun & Games', value: 'fun', emoji: '🎲' },
                        { label: 'Missions', value: 'missions', emoji: '🎯' },
                        { label: 'LFP (Party)', value: 'lfp', emoji: '🎮' },
                        { label: 'Tournaments', value: 'tournaments', emoji: '🚩' },
                        { label: 'Info & Global', value: 'info', emoji: 'ℹ️' }
                    ])
            );

        const response = await interaction.reply({ embeds: [embed], components: [row] });

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 600000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                await i.reply({ content: 'Ini menu help punya orang lain! Gunakan `/help` sendiri ya.', flags: MessageFlags.Ephemeral });
                return;
            }

            const selection = i.values[0];
            let newEmbed = createFunEmbed('Bantuan', 'Memuat informasi...');

            switch (selection) {
                case 'account':
                    if (!env.riot.rsoEnabled) {
                        newEmbed.setTitle('🔗 Account & Linking (Segera Hadir 🚧)')
                            .setDescription('Fitur RSO/Riot Sign-On saat ini sedang dinonaktifkan oleh admin. Nikmati fitur lainnya sementara waktu! ✨');
                    } else {
                        newEmbed.setTitle('🔗 Account & Linking')
                            .setDescription('`/link-account` atau `!link-account` (Aliases: `!link`) - Tautkan akun Riot (RSO)\n' +
                                '`/unlink-account` atau `!unlink-account` (Aliases: `!unlink`) - Cabut tautan akun Riot\n\n' +
                                '*Catatan Privasi: Semua data VALORANT membutuhkan persetujuan/klaim RSO Anda. Anda dapat mencabut data kapan saja.*');
                    }
                    break;
                case 'stats':
                    if (!env.riot.features.stats) {
                        newEmbed.setTitle('📊 Personal Stats (Segera Hadir 🚧)')
                            .setDescription('Fitur ini akan diaktifkan setelah integrasi Riot/RSO dihidupkan oleh admin.');
                    } else {
                        newEmbed.setTitle('📊 Personal Stats')
                            .setDescription('`/mystats` atau `!mystats` (Aliases: `!ms`) - Profil & Winrate VALORANT resmi\n' +
                                '`/lastmatch` atau `!lastmatch` (Aliases: `!lm`) - Info Match Terakhir (Player Lain Anonymous jika tidak Link)\n' +
                                '`/stats` atau `!stats @user` - Stats teman');
                    }
                    break;
                case 'leaderboard':
                    if (!env.riot.features.leaderboardApi) {
                        newEmbed.setTitle('🏆 Leaderboards Riot (Segera Hadir 🚧)')
                            .setDescription('Fitur ini akan diaktifkan setelah integrasi Riot/RSO dihidupkan oleh admin.');
                    } else {
                        newEmbed.setTitle('🏆 Leaderboards')
                            .setDescription('`/leaderboard` atau `!leaderboard <type>` (Aliases: `!lbval`) - Lihat ranking resmi server (Wajib Opt-in)');
                    }
                    break;
                case 'profile':
                    newEmbed.setTitle('👤 Profil & Personalisasi')
                        .setDescription('`/profile-card` atau `!profile` (Aliases: `!profile-card`, `!p`) - Tampilkan statistik text profil Valorant\n' +
                            '`/card` atau `!card` (Aliases: `!c`) - Tampilkan Graphic ID Card (KTP) kamu\n' +
                            '`/set-main-agent` atau `!set-agent` (Aliases: `!setagent`) - Set 3 agent andalan\n' +
                            '`/set-bio` atau `!set-bio` (Aliases: `!setbio`) - Tulis bio pendek di profil\n' +
                            '`/rank-role-claim` atau `!rank-claim` (Aliases: `!claim-rank`) - Klaim role discord sesuai rank\n' +
                            '`/server-roster` atau `!roster` (Aliases: `!list-member`) - Lihat kolektif anggota server & poin');
                    break;
                case 'fun':
                    newEmbed.setTitle('🎲 Fun & Games')
                        .setDescription('**🔥 Mini-Games Berhadiah Poin:**\n' +
                            '`/guess-map` atau `!guess-map` (Aliases: `!map`, `!tebakmap`) - Tebak Map Valorant\n' +
                            '`/valorant-quiz` atau `!quiz` (Aliases: `!kuis`) - Kuis pilihan ganda VALORANT\n' +
                            '`/emoji-agent` atau `!emoji-agent` (Aliases: `!emojia`, `!tebakemoji`) - Tebak Agent dari 3 Emoji\n' +
                            '`/scramble` atau `!scramble` (Aliases: `!acak`, `!susunkata`) - Susun huruf acak nama Map/Agent\n' +
                            '`/daily-challenge` atau `!daily` (Aliases: `!tantanganharian`) - Tantangan harian (Multiplier & Streak Bonus)\n\n' +
                            '**✨ Casual Games (No Points):**\n' +
                            '`/would-you-rather` atau `!wyr` (Aliases: `!pilihmana`) - Polling skenario ekstrim\n' +
                            '`/this-or-that` atau `!tot` (Aliases: `!mending`) - Polling cepat 30 detik\n' +
                            '`/agent-personality` atau `!personality` (Aliases: `!teskepribadian`) - Tes kecocokan agent\n\n' +
                            '**🏆 Ekonomi Poin:**\n' +
                            '`/my-points` atau `!my-points` (Aliases: `!mypoints`, `!poinku`, `!stats`) - Cek stats & rank kamu\n' +
                            '`/leaderboard-games` atau `!lb` (Aliases: `!topgames`, `!ranking`) - Klasemen Top 10 Server\n' +
                            '`/admin-points` atau `!admin-points` (Aliases: `!givepoints`, `!addpoints`, `!removepoints`) - (Admin Only) Modifikasi Poin');
                    break;
                case 'missions':
                    newEmbed.setTitle('🎯 Missions')
                        .setDescription('`/missions` atau `!missions` - Lihat misi aktif harian/mingguan');
                    break;
                case 'lfp':
                    newEmbed.setTitle('🎮 Looking For Party (LFG/LFP)')
                        .setDescription('Gunakan fitur LFG/LFP (Aliases: `!lfg`, `!party`, `!carimabar`, `!mabar`, `!valoyuk`) untuk mencari teman mabar VALORANT dengan cepat!\n\n' +
                            '**📌 Command Buat Party:**\n' +
                            '`/lfg` atau `!lfp [catatan]` (contoh: `!lfg Butuh controller rank Gold`)\n' +
                            'Pilih mode (Unrated/Competitive), dan bot akan mengirimkan ping mabar otomatis. Orang lain bisa bergabung dengan mengklik tombol Join di pesan tersebut.\n\n' +
                            '**🎙️ Voice Channel Auto-Detect:**\n' +
                            'Jika kamu sedang berada di Voice Channel Discord saat menggunakan command ini, bot akan otomatis mencantumkannya di undangan LFG.\n\n' +
                            '**🛑 Menutup Party:**\n' +
                            '`/lfg-close` atau `!lfg-close` (Aliases: `!party-close`) - Tutup post LFG-mu jika anggota sudah penuh atau batal bermain.');
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
                            .setDescription('`/status` atau `!status` - Status Server AP Riot\n`/agents` atau `!agents` - Info role\n\n**🛠️ Admin Tools:**\n`!deploy` atau `!registerbot` (Aliases: `!sync`) - Registrasi/Update manual untuk Slash Commands secara instan pada server (Hanya Admin).');
                    }
                    break;
            }

            await i.update({ embeds: [newEmbed], components: [row] });
        });

        collector.on('end', () => {
            interaction.editReply({ components: [] }).catch(() => { });
        });
    },
};

