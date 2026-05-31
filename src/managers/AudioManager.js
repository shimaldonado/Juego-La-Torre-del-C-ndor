import { SettingsManager } from './SettingsManager.js';

export class AudioManager {
  static boot(scene) {
    const settings = SettingsManager.getSettings();
    scene.sound.mute = Boolean(settings.muted);
    scene.sound.volume = Number.isFinite(settings.volume) ? settings.volume : 0.65;

    AudioManager.installUnlockListeners(scene);
  }

  static resume(scene) {
    const ctx = scene.sound?.context;

    const afterResume = () => AudioManager.tryStartPendingMusic(scene);

    if (ctx && ctx.state === 'suspended') {
      return ctx.resume()
        .then(afterResume)
        .catch(() => null);
    }

    return Promise.resolve(afterResume());
  }

  static play(scene, key, config = {}) {
    if (!scene.cache.audio.exists(key)) return null;

    const playNow = () => {
      if (!scene.cache.audio.exists(key)) return null;
      return scene.sound.play(key, { volume: 0.65, ...config });
    };

    const ctx = scene.sound?.context;
    if (ctx && ctx.state === 'suspended') {
      AudioManager.resume(scene).then(playNow).catch(() => {});
      return null;
    }

    AudioManager.tryStartPendingMusic(scene);
    return playNow();
  }

  static music(scene, key) {
    if (!scene.cache.audio.exists(key)) return null;

    scene.registry.set('pendingMusicKey', key);

    const ctx = scene.sound?.context;
    if (ctx && ctx.state === 'suspended') return null;

    return AudioManager.startMusic(scene, key);
  }

  static startMusic(scene, key) {
    if (!scene.cache.audio.exists(key)) return null;

    const currentKey = scene.registry.get('musicKey');
    const currentMusic = scene.registry.get('musicRef');

    if (currentKey === key && currentMusic) {
      if (!currentMusic.isPlaying) currentMusic.play();
      return currentMusic;
    }

    if (currentMusic) {
      try { currentMusic.stop(); currentMusic.destroy?.(); } catch { /* fallback */ }
    }

    const music = scene.sound.add(key, { loop: true, volume: 0.35 });
    music.play();

    scene.registry.set('musicKey', key);
    scene.registry.set('musicRef', music);
    return music;
  }

  static tryStartPendingMusic(scene) {
    const key = scene.registry.get('pendingMusicKey');
    if (!key || scene.sound?.context?.state === 'suspended') return null;
    return AudioManager.startMusic(scene, key);
  }

  static installUnlockListeners(scene) {
    if (scene.game.__torreCondorAudioUnlockInstalled) return;
    scene.game.__torreCondorAudioUnlockInstalled = true;

    const unlock = () => {
      const activeScenes = scene.game.scene.getScenes(true);
      const activeScene = activeScenes[activeScenes.length - 1] || scene;
      AudioManager.resume(activeScene);
    };

    ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'click'].forEach((eventName) => {
      window.addEventListener(eventName, unlock, { capture: true, passive: true });
    });
  }

  static toggleMute(scene) {
    scene.sound.mute = !scene.sound.mute;
    SettingsManager.setSettings({ muted: scene.sound.mute });
    AudioManager.resume(scene);
    return scene.sound.mute;
  }
}
