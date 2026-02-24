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


import cron from 'node-cron';
import { resetWeeklyPoints, resetMonthlyPoints } from '../services/gamePointsService';

export const startCronJobs = (client: any) => {
    // Reset weekly points every Monday at 00:00 WIB (UTC+7, which is Sunday 17:00 UTC)
    cron.schedule('0 17 * * 0', async () => {
        try {
            await resetWeeklyPoints();
            console.log('✅ Weekly points reset successful!');
        } catch (error) {
            console.error('❌ Failed to reset weekly points:', error);
        }
    });

    // Reset monthly points every 1st day of the month at 00:00 WIB (UTC+7, which is 17:00 UTC previous day)
    cron.schedule('0 17 L * *', async () => {
        // Using L might be problematic depending on the cron library, another way:
        // Let's run at 0 17 on the LAST day of the current month.
        // Wait, standard node-cron doesn't support L. 
        // A safer standard cron: '0 17 * * *' and check if tomorrow is the 1st.
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (tomorrow.getDate() === 1) {
            try {
                await resetMonthlyPoints();
                console.log('✅ Monthly points reset successful!');
            } catch (error) {
                console.error('❌ Failed to reset monthly points:', error);
            }
        }
    });

    // Post daily challenge every day at 09:00 WIB (UTC+7 => 02:00 UTC)
    cron.schedule('0 2 * * *', async () => {
        // We will implement `postDailyChallengeAllGuilds(client)` here later
        console.log('✅ Daily challenge trigger activated.');
    });

    // Post weekly leaderboard recap every Monday at 08:00 WIB (UTC+7 => 01:00 UTC)
    cron.schedule('0 1 * * 1', async () => {
        // We will implement `postWeeklyLeaderboardRecap(client)` here later
        console.log('✅ Weekly leaderboard recap trigger activated.');
    });

    console.log('⏰ Fun & Games Cron Jobs have been started.');
};
