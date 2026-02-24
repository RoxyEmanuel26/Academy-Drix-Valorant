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


import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';

const questions = [
    {
        q: "Apa peran utama kamu kalau lagi main VALORANT?",
        opts: [
            { text: "Maju paling depan, cari kill!", type: "duelist" },
            { text: "Ngasih info dan support teman", type: "initiator" },
            { text: "Jagain site atau flank musuh", type: "sentinel" },
            { text: "Nutupin vision musuh pakai smoke", type: "controller" }
        ]
    },
    {
        q: "Gimana reaksi kamu pas kalah clutch 1v1?",
        opts: [
            { text: "Marah-marah sambil banting mouse", type: "duelist" },
            { text: "Bilang 'Nice try' ke temen", type: "initiator" },
            { text: "Diem aja mikirin kesalahan", type: "sentinel" },
            { text: "Ya udahlah namanya juga game", type: "controller" }
        ]
    },
    {
        q: "Senjata favorit kamu apa nih?",
        opts: [
            { text: "Vandal, 1 tap harga mati", type: "duelist" },
            { text: "Phantom, akurat & bisa spray transfer", type: "controller" },
            { text: "Operator, one shot one kill", type: "sentinel" },
            { text: "Odin / Ares, brrrrrrrr", type: "initiator" }
        ]
    },
    {
        q: "Kalau temenmu toxic di voice chat, kamu bakal ngapain?",
        opts: [
            { text: "Toxicin balik lebih galak!", type: "duelist" },
            { text: "Mute dia langsung", type: "sentinel" },
            { text: "Coba tenangin dia biar fokus", type: "initiator" },
            { text: "Ketawa-ketawa dengerinnya", type: "controller" }
        ]
    },
    {
        q: "Strategi paling asik menurutmu?",
        opts: [
            { text: "Rush B NO STOP", type: "duelist" },
            { text: "Fake A trus rotasi ke B", type: "controller" },
            { text: "Nunggu musuh masuk site terus di-trap", type: "sentinel" },
            { text: "Flash semua orang lalu masuk bareng", type: "initiator" }
        ]
    }
];

const results: Record<string, any> = {
    duelist: {
        agent: "REYNA",
        color: 0x9B59B6,
        desc: "Kamu adalah REYNA! Kamu punya insting membunuh yang kuat, egoistik (dalam konotasi ingame yang baik), agresif, dan suka nge-carry teman-temanmu. Kamu nggak butuh siapa-siapa selama Vandalmu masih menembak lurus. EMPERORRR! 👁️💜"
    },
    initiator: {
        agent: "SOVA",
        color: 0x3498DB,
        desc: "Kamu adalah SOVA! Kamu sangat analitis, sabar, dan selalu memikirkan nasib satu tim. Kamu senang punya visi dan kontrol informasi atas pergerakan musuh, memandu timmu menuju kemenangan. I am the hunter! 🏹🦅"
    },
    sentinel: {
        agent: "CYPHER",
        color: 0xF1C40F,
        desc: "Kamu adalah CYPHER! Sangat rahasia, kalkulatif, dan tidak suka kejutan. Kamu lebih suka menunggu musuh membuat kesalahan lalu menghukum mereka seberat-beratnya. Kamu juga punya mata di mana-mana. 🕵️📸"
    },
    controller: {
        agent: "OMEN",
        color: 0x34495E,
        desc: "Kamu adalah OMEN! Misterius, tenang, tapi diam-diam mematikan. Kamu suka bermain pikiran (mind games) dengan musuh, muncul dari balik bayangan dan menghancurkan rencana mereka tanpa mereka sadari. Watch them run! 👻🌑"
    }
};

export default {
    name: 'agent-personality',
    aliases: ['personality', 'teskepribadian'],
    description: 'Tes psikologi kocak: Agent Valorant apa yang paling cocok buat kamu?',
    async execute(message: Message, args: string[]) {
        let currentQuestion = 0;
        let score: Record<string, number> = { duelist: 0, initiator: 0, sentinel: 0, controller: 0 };

        const initialEmbed = new EmbedBuilder().setDescription('Memulai Personality Test...');
        const sentMessage = await message.reply({ embeds: [initialEmbed] });

        const sendQuestion = async (qIndex: number) => {
            if (qIndex >= questions.length) {
                let highest = 0;
                let winner = 'duelist';
                for (const [key, val] of Object.entries(score)) {
                    if (val > highest) {
                        highest = val;
                        winner = key;
                    }
                }
                const resultData = results[winner];

                const finalEmbed = new EmbedBuilder()
                    .setTitle(`✨ Tes Kepribadian VALORANT ✨`)
                    .setColor(resultData.color)
                    .setDescription(`Berdasarkan tes psikologi singkat ini...\n\n${resultData.desc}\n\n*Bagikan hasil ini ke teman-temanmu!*`);

                await sentMessage.edit({ content: `<@${message.author.id}> baru saja menyelesaikan tes:`, embeds: [finalEmbed], components: [] });
                return;
            }

            const q = questions[qIndex];
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                q.opts.map((opt, i) => new ButtonBuilder()
                    .setCustomId(`pers_${i}_${message.author.id}`)
                    .setLabel(opt.text)
                    .setStyle(ButtonStyle.Primary)
                )
            );

            const embed = new EmbedBuilder()
                .setTitle(`🤔 Tes Kepribadian Agent (${qIndex + 1}/${questions.length})`)
                .setColor(0x3498DB)
                .setDescription(`**${q.q}**\n*(Klik tombol di bawah ini)*`);

            await sentMessage.edit({ embeds: [embed], components: [row] });
        };

        await sendQuestion(currentQuestion);

        const collector = sentMessage.createMessageComponentCollector({
            filter: i => i.user.id === message.author.id && i.customId.startsWith('pers_'),
            time: 60000 * 3,
            componentType: ComponentType.Button
        });

        collector.on('collect', async (i) => {
            const answerIndex = parseInt(i.customId.split('_')[1]);
            const selectedType = questions[currentQuestion].opts[answerIndex].type;

            score[selectedType] += 1;
            currentQuestion += 1;

            await i.deferUpdate(); // Acknowledge button press immediately
            await sendQuestion(currentQuestion);
        });

        collector.on('end', async (_, reason) => {
            if (reason === 'time' && currentQuestion < questions.length) {
                await sentMessage.edit({ content: 'Tes kedaluwarsa karena tidak ada respons.', components: [] });
            }
        });
    },
};
