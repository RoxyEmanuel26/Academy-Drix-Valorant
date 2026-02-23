import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { LfgPost } from '../../database/models/LfgPost';
import { createLfgEmbed } from '../../utils/embed';
import { env } from '../../config/env';

export default {
    name: 'lfg',
    description: 'Cari teman main VALORANT!',
    async execute(message: Message, args: string[]) {
        if (!message.guildId) return;

        if (env.discord.lfgChannelId && message.channelId !== env.discord.lfgChannelId) {
            await message.reply(`Silakan cari party game di channel <#${env.discord.lfgChannelId}>`);
            return;
        }

        const note = args.join(' ') || 'Ayo main bareng!';

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('lfg_unrated')
                    .setLabel('Mode: Unrated')
                    .setStyle(ButtonStyle.Success), // Green
                new ButtonBuilder()
                    .setCustomId('lfg_competitive')
                    .setLabel('Mode: Competitive')
                    .setStyle(ButtonStyle.Danger) // Red
            );

        const promptMessage = await message.reply({
            content: 'Pilih mode game untuk LFG kamu:',
            components: [row]
        });

        const collector = promptMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000
        });

        collector.on('collect', async i => {
            if (i.user.id !== message.author.id) {
                await i.reply({ content: 'Ini LFG punya orang lain!', ephemeral: true });
                return;
            }

            const mode = i.customId === 'lfg_competitive' ? 'Competitive' : 'Unrated';
            const participants = [message.author.id];

            // Interaction API carries the most up-to-date member state
            const member = await i.guild?.members.fetch(i.user.id);
            const voiceChannelId = member?.voice.channelId || undefined;

            const embed = createLfgEmbed(mode, note, participants, voiceChannelId)
                .setThumbnail(message.author.displayAvatarURL());

            const roleMention = env.discord.valorantRoleId ? `<@&${env.discord.valorantRoleId}>` : '@here';

            let replyId = '';
            if ('send' in message.channel) {
                const reply = await message.channel.send({ content: roleMention, embeds: [embed] });
                replyId = reply.id;
            } else {
                return; // Silently fail if channel can't receive messages
            }

            await LfgPost.create({
                guildId: message.guildId!,
                messageId: replyId,
                ownerId: message.author.id,
                mode,
                note,
                active: true,
                participants,
                voiceChannelId,
                channelId: message.channelId
            });

            await promptMessage.delete().catch(() => { });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                promptMessage.edit({ content: 'Waktu memilih LFG telah habis.', components: [] }).catch(() => { });
            }
        });
    },
};
