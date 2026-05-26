import { SAVE_KEY, SETTINGS_KEY } from '../config/constants.js';

function safeParse(value, fallback) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

export class SaveManager {
  static getSlots() {
    const slots = safeParse(localStorage.getItem(SAVE_KEY), null);
    return slots || { 1: null, 2: null, 3: null };
  }

  static save(slot, data) {
    const slots = SaveManager.getSlots();
    slots[slot] = { ...data, savedAt: new Date().toISOString() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(slots));
    return slots[slot];
  }

  static load(slot) {
    return SaveManager.getSlots()[slot] || null;
  }

  static clear(slot) {
    const slots = SaveManager.getSlots();
    slots[slot] = null;
    localStorage.setItem(SAVE_KEY, JSON.stringify(slots));
  }

  static getSettings() {
    return safeParse(localStorage.getItem(SETTINGS_KEY), { muted: false, volume: 0.65, showHelp: true });
  }

  static setSettings(settings) {
    const next = { ...SaveManager.getSettings(), ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    return next;
  }
}
