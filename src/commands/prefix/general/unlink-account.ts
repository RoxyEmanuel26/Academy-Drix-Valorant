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


import { Message } from 'discord.js';
import { User } from '../../../database/models/User';
import { createFunEmbed, createErrorEmbed } from '../../../utils/embed';

export default {
    name: 'unlink-account',
    description: 'Hapus hubungan akun Riot dari bot ini.',
    async execute(message: Message, args: string[]) {
        const user = await User.findOne({ discordId: message.author.id });

        if (!user || (!user.optedIn && !user.accessToken)) {
            return message.reply({ embeds: [createErrorEmbed('Kamu belum menghubungkan akun Riot apa pun!')] });
        }

        // Hapus HANYA data Riot/RSO dan reset optIn flag
        user.optedIn = false;
        user.accessToken = undefined;
        user.refreshToken = undefined;
        user.tokenExpiry = undefined;
        user.riotPuuid = undefined;
        user.riotGameName = undefined;
        user.riotTagLine = undefined;
        user.region = 'ap';

        await user.save();

        await message.reply({
            embeds: [createFunEmbed('💔 Unlinked', 'Akun Riot kamu telah berhasil dihapus dari sistem kami. Kami harap kamu kembali lagi nanti!')]
        });
    },
};
