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


import { GamePoints, IGamePoints } from '../database/models/GamePoints';

export const POINT_CONFIG = {
    guess_agent: { easy: 50, medium: 100, hard: 200 },
    guess_map: { easy: 50, medium: 100, hard: 200 },
    emoji_agent: { base: 75 },
    scramble: { agent: 80, map: 100 },
    quiz: { easy: 60, medium: 120, hard: 250 },
    daily_challenge: { base: 300, streak_3: 100, streak_7: 300, streak_30: 1000 },
    would_you_rather: 0,
    this_or_that: 0,
    agent_personality: 0
};

export const FIRST_BLOOD_BONUS = 25;
export const PERFECT_SCORE_BONUS = 200;

export const GAME_COOLDOWNS = {
    guess_agent: 10000,
    guess_map: 10000,
    emoji_agent: 10000,
    scramble: 10000,
    quiz: 5000,
    daily_challenge: 0
};

export function calculateSpeedPoints(basePoints: number, timeLimit: number, timeTaken: number): number {
    if (timeTaken >= timeLimit) return basePoints;
    const speedRatio = 1 - (timeTaken / timeLimit);
    const speedBonus = Math.floor(basePoints * speedRatio);
    return basePoints + speedBonus;
}

export function calculateStreakBonus(currentStreak: number, basePoints: number): number {
    if (currentStreak >= 30) return basePoints + 1000;
    if (currentStreak >= 7) return basePoints + 300;
    if (currentStreak >= 3) return basePoints + 100;
    return basePoints;
}

export async function addPoints(
    guildId: string,
    userId: string,
    username: string,
    game: string,
    basePoints: number,
    timeTaken?: number,
    timeLimit?: number,
    isFirstBlood?: boolean,
    isPerfectScore?: boolean,
    isDaily?: boolean
): Promise<{ pointsEarned: number; totalPoints: number; breakDown: any }> {

    let userStats = await GamePoints.findOne({ guildId, userId });

    if (!userStats) {
        userStats = new GamePoints({ guildId, userId, username });
    } else if (username !== userStats.username) {
        userStats.username = username; // Update display name if changed
    }

    // Update Streak if playing a point-awarding game
    if (basePoints > 0) {
        const now = new Date();
        if (userStats.lastPlayedAt) {
            const diffMs = now.getTime() - userStats.lastPlayedAt.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                userStats.currentStreak += 1;
                if (userStats.currentStreak > userStats.longestStreak) {
                    userStats.longestStreak = userStats.currentStreak;
                }
            } else if (diffDays > 1) {
                userStats.currentStreak = 1; // reset streak if missed a day
            }
        } else {
            userStats.currentStreak = 1;
            userStats.longestStreak = 1;
        }
        userStats.lastPlayedAt = now;
    }

    let finalPoints = basePoints;
    let speedBonus = 0;

    if (timeTaken !== undefined && timeLimit !== undefined && timeTaken < timeLimit) {
        const maxSpeedBonus = basePoints;
        const ratio = 1 - (timeTaken / timeLimit);
        speedBonus = Math.floor(maxSpeedBonus * ratio);
        finalPoints += speedBonus;
    }

    const streakBonus = isDaily ? (calculateStreakBonus(userStats.currentStreak, basePoints) - basePoints) : 0;
    finalPoints += streakBonus;

    if (isFirstBlood) finalPoints += FIRST_BLOOD_BONUS;
    if (isPerfectScore) finalPoints += PERFECT_SCORE_BONUS;

    userStats.totalPoints += finalPoints;
    userStats.weeklyPoints += finalPoints;
    userStats.monthlyPoints += finalPoints;
    userStats.gamesPlayed += 1;
    if (finalPoints > 0) userStats.gamesWon += 1;

    if (finalPoints > 0 || game !== 'would_you_rather') { // Ignore pure fun games in history spam
        userStats.pointsHistory.unshift({
            game,
            points: finalPoints,
            reason: `Base: ${basePoints}${speedBonus > 0 ? `, Speed: ${speedBonus}` : ''}${isFirstBlood ? `, FB: ${FIRST_BLOOD_BONUS}` : ''}${isPerfectScore ? `, Perfect: ${PERFECT_SCORE_BONUS}` : ''}${streakBonus > 0 ? `, Streak: ${streakBonus}` : ''}`,
            earnedAt: new Date()
        });

        // Keep history trimmed to last 20
        if (userStats.pointsHistory.length > 20) {
            userStats.pointsHistory = userStats.pointsHistory.slice(0, 20);
        }
    }

    await userStats.save();

    return {
        pointsEarned: finalPoints,
        totalPoints: userStats.totalPoints,
        breakDown: {
            base: basePoints,
            speed: speedBonus,
            firstBlood: isFirstBlood ? FIRST_BLOOD_BONUS : 0,
            perfect: isPerfectScore ? PERFECT_SCORE_BONUS : 0,
            streak: streakBonus,
            currentStreak: userStats.currentStreak
        }
    };
}

export async function getLeaderboard(
    guildId: string,
    type: 'weekly' | 'monthly' | 'alltime',
    limit: number = 10
): Promise<IGamePoints[]> {
    const sortOption: any = {};
    if (type === 'weekly') sortOption.weeklyPoints = -1;
    else if (type === 'monthly') sortOption.monthlyPoints = -1;
    else sortOption.totalPoints = -1;

    // Filter out 0 points
    const matchOption: any = { guildId };
    if (type === 'weekly') matchOption.weeklyPoints = { $gt: 0 };
    else if (type === 'monthly') matchOption.monthlyPoints = { $gt: 0 };
    else matchOption.totalPoints = { $gt: 0 };

    return await GamePoints.find(matchOption)
        .sort(sortOption)
        .limit(limit)
        .exec();
}

export async function getUserStats(guildId: string, userId: string): Promise<IGamePoints | null> {
    return await GamePoints.findOne({ guildId, userId }).exec();
}

export async function getUserRank(guildId: string, userId: string, type: 'weekly' | 'monthly' | 'alltime'): Promise<number> {
    const user = await getUserStats(guildId, userId);
    if (!user) return 0;

    let pointsToCompare = 0;
    const matchOption: any = { guildId };

    if (type === 'weekly') {
        pointsToCompare = user.weeklyPoints;
        matchOption.weeklyPoints = { $gt: pointsToCompare };
    } else if (type === 'monthly') {
        pointsToCompare = user.monthlyPoints;
        matchOption.monthlyPoints = { $gt: pointsToCompare };
    } else {
        pointsToCompare = user.totalPoints;
        matchOption.totalPoints = { $gt: pointsToCompare };
    }

    const higherRankedCount = await GamePoints.countDocuments(matchOption);
    return higherRankedCount + 1;
}

export async function resetWeeklyPoints(guildId?: string): Promise<void> {
    const filter = guildId ? { guildId } : {};
    await GamePoints.updateMany(filter, { $set: { weeklyPoints: 0 } });
}

export async function resetMonthlyPoints(guildId?: string): Promise<void> {
    const filter = guildId ? { guildId } : {};
    await GamePoints.updateMany(filter, { $set: { monthlyPoints: 0 } });
}

export async function hasClaimedDaily(guildId: string, userId: string): Promise<boolean> {
    const userStats = await getUserStats(guildId, userId);
    if (!userStats || !userStats.lastDailyAt) return false;

    const now = new Date();
    const lastDaily = userStats.lastDailyAt;

    // Check if it's the same UTC day
    return now.getUTCFullYear() === lastDaily.getUTCFullYear() &&
        now.getUTCMonth() === lastDaily.getUTCMonth() &&
        now.getUTCDate() === lastDaily.getUTCDate();
}

export async function claimDaily(guildId: string, userId: string): Promise<void> {
    await GamePoints.updateOne(
        { guildId, userId },
        { $set: { lastDailyAt: new Date() } },
        { upsert: true }
    );
}

export const motivationMessages = [
    "LUAR BIASA! Kamu cepet banget! 🚀",
    "AXIOM ENJOYER DETECTED! 🔥",
    "GG EZ! Siapa lawan kamu? 😎",
    "RADIANT MATERIAL! 💎",
    "Otak VALORANT banget ini! 🧠",
    "Speed run tebak agent! ⚡",
    "CLUTCH ANSWER! 🎯"
];
