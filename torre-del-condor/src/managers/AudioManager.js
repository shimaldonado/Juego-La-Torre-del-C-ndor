import { SaveManager } from './SaveManager.js';

export class AudioManager {
  static context = null;
  static musicNodes = [];
  static musicTimer = null;
  static step = 0;

  static get settings() {
    return SaveManager.load();
  }

  static unlock() {
    if (!AudioManager.context) {
      AudioManager.context = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (AudioManager.context.state === 'suspended') {
      AudioManager.context.resume();
    }
  }

  static playTone(frequency = 440, duration = 0.12, type = 'square', volume = 0.25) {
    const settings = AudioManager.settings;
    if (!settings.sfxEnabled) return;
    AudioManager.unlock();

    const ctx = AudioManager.context;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(settings.sfxVolume * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  }

  static coin() {
    AudioManager.playTone(880, 0.08, 'triangle', 0.28);
    setTimeout(() => AudioManager.playTone(1320, 0.08, 'triangle', 0.22), 60);
  }

  static jump() {
    AudioManager.playTone(540, 0.08, 'square', 0.18);
  }

  static hit() {
    AudioManager.playTone(130, 0.2, 'sawtooth', 0.3);
  }

  static win() {
    [523, 659, 784, 1046].forEach((note, index) => {
      setTimeout(() => AudioManager.playTone(note, 0.18, 'triangle', 0.35), index * 120);
    });
  }

  static startMusic() {
    const settings = AudioManager.settings;
    if (!settings.musicEnabled || AudioManager.musicTimer) return;
    AudioManager.unlock();

    const melody = [220, 277, 330, 392, 330, 277, 220, 196];
    AudioManager.step = 0;
    AudioManager.musicTimer = setInterval(() => {
      const latest = AudioManager.settings;
      if (!latest.musicEnabled) {
        AudioManager.stopMusic();
        return;
      }
      const note = melody[AudioManager.step % melody.length];
      AudioManager.musicNote(note, 0.16, latest.musicVolume);
      AudioManager.step += 1;
    }, 260);
  }

  static musicNote(frequency, duration, volume) {
    if (!AudioManager.context) return;
    const ctx = AudioManager.context;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume * 0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  }

  static stopMusic() {
    if (AudioManager.musicTimer) {
      clearInterval(AudioManager.musicTimer);
      AudioManager.musicTimer = null;
    }
  }

  static toggleMusic() {
    const settings = AudioManager.settings;
    SaveManager.save({ musicEnabled: !settings.musicEnabled });
    if (!settings.musicEnabled) AudioManager.startMusic();
    else AudioManager.stopMusic();
  }
}
