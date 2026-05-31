import { SETTINGS_KEY } from '../config/constants.js';

function safeParse(value, fallback) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

export class SettingsManager {
  static getSettings() {
    return safeParse(localStorage.getItem(SETTINGS_KEY), { muted: false, volume: 0.65, showHelp: true });
  }

  static setSettings(settings) {
    const next = { ...SettingsManager.getSettings(), ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    return next;
  }
}
