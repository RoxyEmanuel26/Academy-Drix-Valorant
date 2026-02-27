import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, AttachmentBuilder, MessageFlags } from 'discord.js';
import { getCatalog, getCharacterFullImagePathByName, getCharacterDisplayIconPathByName } from '../../../utils/assetManager';
import fs from 'fs';

export default {
    data: new SlashCommandBuilder()
        .setName('agent')
        .setDescription('Tampilkan informasi lengkap mengenai agent Valorant')
        .addStringOption(option =>
            option.setName('nama')
                .setDescription('Nama agent yang ingin dicari (misal: Jett, Omen, Killjoy)')
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const agentName = interaction.options.getString('nama');
        if (!agentName) return;

        await interaction.deferReply();

        const catalog = getCatalog();
        if (!catalog.characters) {
            return interaction.editReply('❌ Data catalog tidak tersedia saat ini.');
        }

        // Find the character
        const agent = catalog.characters.find((c: any) =>
            c.name?.defaultText?.toLowerCase() === agentName.toLowerCase() ||
            c.name?.localizedByCulture?.['en-US']?.toLowerCase() === agentName.toLowerCase() ||
            c.name?.localizedByCulture?.['id-ID']?.toLowerCase() === agentName.toLowerCase()
        );

        if (!agent) {
            return interaction.editReply(`❌ Agent dengan nama **${agentName}** tidak ditemukan!`);
        }

        const name = agent.name?.localizedByCulture?.['id-ID'] || agent.name?.defaultText || 'Unknown Agent';
        const role = agent.role?.name?.localizedByCulture?.['id-ID'] || agent.role?.name?.defaultText || 'Unknown Role';
        const bio = agent.description?.localizedByCulture?.['id-ID'] || agent.description?.defaultText || 'Tidak ada deskripsi.';

        const embed = new EmbedBuilder()
            .setTitle(`Valorant Agent: ${name}`)
            .setDescription(bio)
            .setColor(0xFA4454) // Valorant Red
            .addFields(
                { name: 'Roles', value: role, inline: true }
            );

        // Append Abilities if available
        if (agent.abilities && Array.isArray(agent.abilities)) {
            let abilitiesText = '';
            agent.abilities.forEach((ab: any) => {
                const abName = ab.name?.localizedByCulture?.['id-ID'] || ab.name?.defaultText || 'Unknown';
                const abKey = ab.slot || 'Ability';
                abilitiesText += `**[${abKey}] ${abName}**\n`;
            });
            if (abilitiesText) {
                embed.addFields({ name: 'Abilities', value: abilitiesText, inline: false });
            }
        }

        const files: AttachmentBuilder[] = [];

        // Attach Image
        const fullImagePath = getCharacterFullImagePathByName(name);
        const iconImagePath = getCharacterDisplayIconPathByName(name);

        if (fullImagePath && fs.existsSync(fullImagePath)) {
            const attachment = new AttachmentBuilder(fullImagePath, { name: 'agent.png' });
            embed.setImage('attachment://agent.png');
            files.push(attachment);
        }

        if (iconImagePath && fs.existsSync(iconImagePath)) {
            const iconAttachment = new AttachmentBuilder(iconImagePath, { name: 'icon.png' });
            embed.setThumbnail('attachment://icon.png');
            files.push(iconAttachment);
        }

        await interaction.editReply({ embeds: [embed], files });
    }
};
