import { DEFAULT_SAVE } from '../config/constants.js';

const STORAGE_KEY = 'torre-del-condor-save-v1';

export class SaveManager {
  static load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_SAVE };
      return { ...DEFAULT_SAVE, ...JSON.parse(raw) };
    } catch (error) {
      console.warn('No se pudo leer la partida guardada:', error);
      return { ...DEFAULT_SAVE };
    }
  }

  static save(data) {
    const current = SaveManager.load();
    const next = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  static reset() {
    localStorage.removeItem(STORAGE_KEY);
    return { ...DEFAULT_SAVE };
  }
}
