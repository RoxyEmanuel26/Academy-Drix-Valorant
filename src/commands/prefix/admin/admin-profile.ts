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

import { Message, PermissionsBitField, EmbedBuilder } from 'discord.js';
import { featureFlags } from '../../../config/featureFlags';
import { User } from '../../../database/models/User';

export default {
    name: 'admin-profile',
    aliases: ['adminprofile', 'mod-profile'],
    description: '[ADMIN] Moderasi profile card user (!admin-profile view @user atau !admin-profile reset @user bio/agents/all)',
    async execute(message: Message, args: string[]) {
        if (!featureFlags.profile) {
            return message.reply('Fitur Profile sedang dinonaktifkan.');
        }

        if (!message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return message.reply('❌ Kamu tidak memiliki izin Manage Guild untuk menggunakan command ini.');
        }

        if (args.length < 2) {
            return message.reply('❌ Format: `!admin-profile view @user` atau `!admin-profile reset @user bio/agents/all`');
        }

        const subcmd = args[0].toLowerCase();
        const targetUser = message.mentions.users.first();

        if (!targetUser) {
            return message.reply('❌ Tolong mention user targetnya!');
        }

        if (subcmd === 'view') {
            const userDb = await User.findOne({ discordId: targetUser.id });
            if (!userDb) {
                return message.reply('Data User belum ada di database.');
            }

            const embed = new EmbedBuilder()
                .setTitle(`🛠️ Admin View: ${targetUser.username}`)
                .setColor(0xED4245)
                .addFields(
                    { name: 'Bio', value: userDb.bio || '*kosong*', inline: false },
                    { name: 'Agent 1', value: userDb.mainAgent || '*kosong*', inline: true },
                    { name: 'Agent 2', value: userDb.mainAgent2 || '*kosong*', inline: true },
                    { name: 'Agent 3', value: userDb.mainAgent3 || '*kosong*', inline: true },
                    { name: 'Riot Linked', value: userDb.optedIn ? 'Yes' : 'No', inline: true },
                    { name: 'Riot PUUID', value: userDb.riotPuuid ? `\`${userDb.riotPuuid}\`` : '*kosong*', inline: true },
                    { name: 'Created', value: userDb.createdAt ? new Date(userDb.createdAt as any).toLocaleString() : '*unknown*', inline: true }
                );

            return message.reply({ embeds: [embed] });
        }

        if (subcmd === 'reset') {
            if (args.length < 3) {
                return message.reply('❌ Tentukan yang mau direset: `bio`, `agents`, atau `all`');
            }

            const field = args[2].toLowerCase();
            if (!['bio', 'agents', 'all'].includes(field)) {
                return message.reply('❌ Pilihan reset hanya: `bio`, `agents`, atau `all`');
            }

            const userDb = await User.findOne({ discordId: targetUser.id });

            if (!userDb) {
                return message.reply('Data User belum ada di database.');
            }

            if (field === 'bio' || field === 'all') {
                userDb.bio = undefined;
            }
            if (field === 'agents' || field === 'all') {
                userDb.mainAgent = undefined;
                userDb.mainAgent2 = undefined;
                userDb.mainAgent3 = undefined;
            }

            await userDb.save();

            const actionTxt = field === 'all' ? 'Bio dan Agents' : (field === 'bio' ? 'Bio' : 'Agents');
            return message.reply(`✅ Berhasil mereset **${actionTxt}** untuk <@${targetUser.id}>. Mereka telah dikembalikan ke default.`);
        }
    },
};
