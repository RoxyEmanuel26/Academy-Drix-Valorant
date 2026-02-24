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


// src/utils/gameState.ts

export const activeGames = new Map<string, string>(); // Maps channelId to game name

export function setGameActive(channelId: string, gameName: string): boolean {
    if (activeGames.has(channelId)) return false;
    activeGames.set(channelId, gameName);
    return true;
}

export function setGameInactive(channelId: string) {
    activeGames.delete(channelId);
}

export function normalizeAnswer(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

export function isAnswerCorrect(userAnswer: string, correctAnswer: string): boolean {
    const user = normalizeAnswer(userAnswer);
    const correct = normalizeAnswer(correctAnswer);

    if (user === correct) return true;

    // special cases
    if (correct.includes('kayo') && user.includes('kay')) return true;

    // partial string matcher for longer strings
    if (correct.includes(user) && user.length >= 4) return true;

    return false;
}
