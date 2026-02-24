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


import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, TextChannel, Message , MessageFlags } from 'discord.js';
import { agents, maps } from '../../../data/valorant';
import { activeGames, setGameActive, setGameInactive, isAnswerCorrect } from '../../../utils/gameState';
import { addPoints, POINT_CONFIG } from '../../../services/gamePointsService';

function shuffleString(str: string): string {
    let arr = str.split('');
    // keep shuffling if the result is same as original
    let shuffled = '';
    do {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        shuffled = arr.join('');
    } while (shuffled.toLowerCase() === str.toLowerCase() && str.length > 2);

    return shuffled.toUpperCase();
}

export default {
    data: new SlashCommandBuilder()
        .setName('scramble')
        .setDescription('Susun acak huruf menjadi nama Agent atau Map (Berhadiah Poin)'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.channel) return;

        if (!setGameActive(interaction.channel.id, 'scramble')) {
            await interaction.reply({ content: 'Sedang ada game yang berjalan di channel ini! Tunggu sebentar ya 🎮', flags: MessageFlags.Ephemeral });
            return;
        }

        const type = Math.random() > 0.5 ? 'agent' : 'map';
        const wordList = type === 'agent' ? agents : maps;
        const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
        const scrambled = shuffleString(randomWord);

        const basePoints = type === 'agent' ? POINT_CONFIG.scramble.agent : POINT_CONFIG.scramble.map;
        const timeLimit = 30000;

        const embed = new EmbedBuilder()
            .setTitle('🔀 Tebak Kata Acak')
            .setColor(0x3498DB)
            .setDescription(`Susun kembali huruf acak berikut menjadi nama **${type.toUpperCase()}** VALORANT dalam 30 Detik.\n\nKetikan: **${scrambled}**`)
            .setFooter({ text: 'Hint otomatis muncul setelah 15 detik!' });

        const messageRaw = await interaction.reply({ embeds: [embed], fetchReply: true });
        const startTime = Date.now();

        const filter = (m: Message) => !m.author.bot;
        const collector = (interaction.channel as TextChannel).createMessageCollector({ filter, time: timeLimit });

        let answered = false;

        // Hint timer
        const hintTimeout = setTimeout(async () => {
            if (!answered) {
                const hintEmbed = EmbedBuilder.from(embed)
                    .addFields({ name: '💡 Hint', value: `Huruf pertama adalah: **${randomWord.charAt(0).toUpperCase()}**` });
                await interaction.editReply({ embeds: [hintEmbed] }).catch(() => { });
            }
        }, 15000);

        collector.on('collect', async (m: Message) => {
            if (isAnswerCorrect(m.content, randomWord)) {
                answered = true;
                collector.stop();
                clearTimeout(hintTimeout);

                const timeTaken = Date.now() - startTime;
                const timeTakenSeconds = (timeTaken / 1000).toFixed(1);

                try {
                    const result = await addPoints(
                        m.guildId!,
                        m.author.id,
                        m.author.username,
                        'scramble',
                        basePoints,
                        timeTaken,
                        timeLimit,
                        true,
                        false
                    );

                    const winEmbed = new EmbedBuilder()
                        .setTitle('🎉 Jawaban Benar!')
                        .setColor(0x2ECC71)
                        .setDescription(`GG <@${m.author.id}>! Jawabannya adalah **${randomWord}**.\nKamu menjawab dalam ${timeTakenSeconds} detik ⚡`)
                        .addFields(
                            { name: 'Base Poin', value: `+${result.breakDown.base} pts`, inline: true },
                            { name: 'Speed Bonus', value: `+${result.breakDown.speed} pts ⚡`, inline: true },
                            { name: 'First Blood', value: `+${result.breakDown.firstBlood} pts 🩸`, inline: true },
                            { name: 'Total Didapat', value: `**+${result.pointsEarned} pts** 🏆`, inline: false },
                            { name: 'Total Poin Kamu', value: `**${result.totalPoints} pts**`, inline: true }
                        );

                    if (result.breakDown.streak > 0) {
                        winEmbed.addFields({ name: 'Streak Bonus', value: `+${result.breakDown.streak} pts 🔥`, inline: true });
                    }

                    await (interaction.channel as TextChannel).send({ embeds: [winEmbed] });
                } catch (error) {
                    console.error('Failed to add points:', error);
                    await (interaction.channel as TextChannel).send(`Bener woy jawabannya **${randomWord}**! Tapi database poin lagi error 😭`);
                }
            }
        });

        collector.on('end', () => {
            setGameInactive(interaction.channel!.id);
            clearTimeout(hintTimeout);
            if (!answered) {
                const loseEmbed = new EmbedBuilder()
                    .setTitle('⏰ Waktu Habis!')
                    .setColor(0xE74C3C)
                    .setDescription(`Sayang sekali! Tidak ada yang berhasil menyusun kata.\nJawabannya adalah **${randomWord}**.`);
                (interaction.channel as TextChannel).send({ embeds: [loseEmbed] });
            }
        });
    },
};

