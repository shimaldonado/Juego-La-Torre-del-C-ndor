const PROGRESS_KEY = 'torre-condor-progress-v1';

const DEFAULT_PROGRESS = {
  highScore: 0,
  maxLevelReached: 1,
  lastScore: 0,
  lastLevel: 1,
  gamesPlayed: 0,
  lastWon: false,
  lastPlayedAt: null,
};

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export class StorageManager {
  static getProgress() {
    return {
      ...DEFAULT_PROGRESS,
      ...safeParse(localStorage.getItem(PROGRESS_KEY), DEFAULT_PROGRESS),
    };
  }

  static saveProgress(progress) {
    const next = {
      ...StorageManager.getProgress(),
      ...progress,
    };

    localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
    return next;
  }

  static unlockLevel(level) {
    const progress = StorageManager.getProgress();

    return StorageManager.saveProgress({
      maxLevelReached: Math.max(progress.maxLevelReached || 1, level),
    });
  }

  static saveRun({ score = 0, level = 1, won = false } = {}) {
    const progress = StorageManager.getProgress();

    return StorageManager.saveProgress({
      highScore: Math.max(progress.highScore || 0, score || 0),
      maxLevelReached: Math.max(progress.maxLevelReached || 1, won ? 4 : level),
      lastScore: score,
      lastLevel: level,
      lastWon: Boolean(won),
      gamesPlayed: (progress.gamesPlayed || 0) + 1,
      lastPlayedAt: new Date().toISOString(),
    });
  }

  static resetProgress() {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(DEFAULT_PROGRESS));
    return DEFAULT_PROGRESS;
  }
}