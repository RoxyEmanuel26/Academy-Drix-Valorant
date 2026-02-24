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

import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, EmbedBuilder } from 'discord.js';
import { featureFlags } from '../../../config/featureFlags';
import { User } from '../../../database/models/User';

export default {
    data: new SlashCommandBuilder()
        .setName('admin-profile')
        .setDescription('[ADMIN] Moderasi profile card user')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
        .addSubcommand(subcmd =>
            subcmd.setName('view')
                .setDescription('Lihat data mentah profile database user')
                .addUserOption(opt => opt.setName('user').setDescription('Target user').setRequired(true))
        )
        .addSubcommand(subcmd =>
            subcmd.setName('reset')
                .setDescription('Reset paksa bio atau agent seseorang jika melanggar')
                .addUserOption(opt => opt.setName('user').setDescription('Target user').setRequired(true))
                .addStringOption(opt =>
                    opt.setName('field')
                        .setDescription('Bagian mana yang mau direset?')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Bio', value: 'bio' },
                            { name: 'Agents', value: 'agents' },
                            { name: 'Keduanya', value: 'all' }
                        )
                )
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!featureFlags.profile) {
            return interaction.reply({ content: 'Fitur Profile sedang dinonaktifkan.', ephemeral: true });
        }

        const subcmd = interaction.options.getSubcommand();
        const targetUser = interaction.options.getUser('user', true);

        if (subcmd === 'view') {
            const userDb = await User.findOne({ discordId: targetUser.id });
            if (!userDb) {
                return interaction.reply({ content: 'Data User belum ada di database (Belum pernah main/set bio).', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle(`🛠️ Admin View: ${targetUser.username}`)
                .setColor(0xED4245)
                .addFields(
                    { name: 'Bio', value: userDb.bio || '*kosong*', inline: false },
                    { name: 'Agent 1', value: userDb.mainAgent || '*kosong*', inline: true },
                    { name: 'Agent 2', value: userDb.mainAgent2 || '*kosong*', inline: true },
                    { name: 'Agent 3', value: userDb.mainAgent3 || '*kosong*', inline: true },
                    { name: 'Riot Linked', value: userDb.optIn ? 'Yes' : 'No', inline: true },
                    { name: 'Riot PUUID', value: userDb.riotPuuid ? `\`${userDb.riotPuuid}\`` : '*kosong*', inline: true },
                    { name: 'Created', value: userDb.createdAt ? new Date(userDb.createdAt as any).toLocaleString() : '*unknown*', inline: true }
                );

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (subcmd === 'reset') {
            const field = interaction.options.getString('field', true);
            const userDb = await User.findOne({ discordId: targetUser.id });

            if (!userDb) {
                return interaction.reply({ content: 'Data User belum ada di database.', ephemeral: true });
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
            return interaction.reply({ content: `✅ Berhasil mereset **${actionTxt}** untuk <@${targetUser.id}>. Mereka telah dikembalikan ke default.` });
        }
    },
};
