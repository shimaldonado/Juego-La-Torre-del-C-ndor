import { SaveManager } from './SaveManager.js';

export class AudioManager {
  static boot(scene) {
    const settings = SaveManager.getSettings();
    scene.sound.mute = settings.muted;
    scene.sound.volume = settings.volume ?? 0.65;
  }

  static play(scene, key, config = {}) {
    if (!scene.cache.audio.exists(key)) return null;
    return scene.sound.play(key, { volume: 0.65, ...config });
  }

  static music(scene, key) {
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

  static toggleMute(scene) {
    scene.sound.mute = !scene.sound.mute;
    SaveManager.setSettings({ muted: scene.sound.mute });
    return scene.sound.mute;
  }
}
