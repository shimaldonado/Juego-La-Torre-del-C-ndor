import { SettingsManager } from './SettingsManager.js';

export class AudioManager {
  static boot(scene) {
    const settings = SettingsManager.getSettings();
    scene.sound.mute = settings.muted;
    scene.sound.volume = settings.volume ?? 0.65;

    AudioManager.installUnlockListeners(scene);
  }

  static resume(scene) {
    const ctx = scene.sound?.context;
    if (ctx && ctx.state === 'suspended') {
      ctx.resume()
        .then(() => AudioManager.tryStartPendingMusic(scene))
        .catch(() => {});
      return;
    }
    AudioManager.tryStartPendingMusic(scene);
  }

  static play(scene, key, config = {}) {
    if (!scene.cache.audio.exists(key)) return null;
    AudioManager.resume(scene);
    return scene.sound.play(key, { volume: 0.65, ...config });
  }

  static music(scene, key) {
    if (!scene.cache.audio.exists(key)) return null;
    scene.registry.set('pendingMusicKey', key);
    if (scene.sound?.context?.state === 'suspended') return null;
    return AudioManager.startMusic(scene, key);
  }

  static startMusic(scene, key) {
    if (!scene.cache.audio.exists(key)) return null;
    if (scene.registry.get('musicKey') === key && scene.registry.get('musicRef')) return scene.registry.get('musicRef');
    const prev = scene.registry.get('musicRef');
    if (prev) prev.stop();
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

    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
  }

  static toggleMute(scene) {
    scene.sound.mute = !scene.sound.mute;
    SettingsManager.setSettings({ muted: scene.sound.mute });
    AudioManager.resume(scene);
    return scene.sound.mute;
  }
}
