import { LEADERBOARD_KEY } from '../config/constants.js';

function parse(value, fallback) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

export class LeaderboardManager {
  static getLocalScores() {
    return parse(localStorage.getItem(LEADERBOARD_KEY), []);
  }

  static addLocalScore(name, score, level) {
    const scores = LeaderboardManager.getLocalScores();
    scores.push({ name: name || 'Jugador', score, level, date: new Date().toISOString() });
    scores.sort((a, b) => b.score - a.score);
    const top = scores.slice(0, 10);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top));
    return top;
  }

  static async getOnlineScores() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=5', { cache: 'no-store' });
      const users = await response.json();
      return users.map((user, index) => ({
        name: user.username,
        score: 900 - index * 120,
        level: 4,
        online: true,
      }));
    } catch {
      return [
        { name: 'IntiNet', score: 880, level: 4, online: true },
        { name: 'CóndorAPI', score: 740, level: 3, online: true },
      ];
    }
  }

  static async publishScore(name, score, level) {
    LeaderboardManager.addLocalScore(name, score, level);
    try {
      await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'torre-condor-score', name, score, level }),
      });
      return true;
    } catch {
      return false;
    }
  }
}
