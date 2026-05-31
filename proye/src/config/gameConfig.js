import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';
import { BootScene } from '../scenes/BootScene.js';
import { PreloadScene } from '../scenes/PreloadScene.js';
import { MainMenuScene } from '../scenes/MainMenuScene.js';
import { CharacterSelectScene } from '../scenes/CharacterSelectScene.js';
import { StoryScene } from '../scenes/StoryScene.js';
import { LevelSelectScene } from '../scenes/LevelSelectScene.js';
import { GameScene } from '../scenes/GameScene.js';
import { PauseScene } from '../scenes/PauseScene.js';
import { GameOverScene } from '../scenes/GameOverScene.js';
import { CreditsScene } from '../scenes/CreditsScene.js';
import { SettingsScene } from '../scenes/SettingsScene.js';

export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#111827',
  pixelArt: false,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    activePointers: 5,
    touch: { capture: true },
    mouse: { capture: true },
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 980 },
      debug: false,
    },
  },
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    CharacterSelectScene,
    StoryScene,
    LevelSelectScene,
    GameScene,
    PauseScene,
    GameOverScene,
    CreditsScene,
    SettingsScene,
  ],
};
