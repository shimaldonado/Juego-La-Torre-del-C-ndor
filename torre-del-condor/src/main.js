import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig.js';
import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { LevelSelectScene } from './scenes/LevelSelectScene.js';
import { CharacterSelectScene } from './scenes/CharacterSelectScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { CreditsScene } from './scenes/CreditsScene.js';
import { SettingsScene } from './scenes/SettingsScene.js';

const config = {
  ...gameConfig,
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    LevelSelectScene,
    CharacterSelectScene,
    GameScene,
    PauseScene,
    GameOverScene,
    CreditsScene,
    SettingsScene
  ]
};

window.addEventListener('load', () => {
  new Phaser.Game(config);

  const isLocalDev = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);

  // En desarrollo se desactiva el Service Worker para que Chrome no use archivos viejos
  // y no vuelva a aparecer el error de cache chrome-extension://.
  if ('serviceWorker' in navigator) {
    if (isLocalDev) {
      navigator.serviceWorker.getRegistrations()
        .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
        .catch(() => {});
    } else {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }
});
