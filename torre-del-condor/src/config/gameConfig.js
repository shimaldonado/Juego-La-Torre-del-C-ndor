import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from './constants.js';
import { BootScene } from '../scenes/BootScene.js';
import { PreloadScene } from '../scenes/PreloadScene.js';
import { MainMenuScene } from '../scenes/MainMenuScene.js';
import { SettingsScene } from '../scenes/SettingsScene.js';
import { CharacterSelectScene } from '../scenes/CharacterSelectScene.js';
import { StoryScene } from '../scenes/StoryScene.js';
import { LevelSelectScene } from '../scenes/LevelSelectScene.js';
import { Level1Scene } from '../scenes/Level1Scene.js';
import { Level2Scene } from '../scenes/Level2Scene.js';
import { Level3Scene } from '../scenes/Level3Scene.js';
import { BossScene } from '../scenes/BossScene.js';
import { PauseScene } from '../scenes/PauseScene.js';
import { GameOverScene } from '../scenes/GameOverScene.js';
import { VictoryScene } from '../scenes/VictoryScene.js';
import { CreditsScene } from '../scenes/CreditsScene.js';

export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  pixelArt: false,
  backgroundColor: '#080b16',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 720 },
      debug: false
    }
  },
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    SettingsScene,
    CharacterSelectScene,
    StoryScene,
    LevelSelectScene,
    Level1Scene,
    Level2Scene,
    Level3Scene,
    BossScene,
    PauseScene,
    GameOverScene,
    VictoryScene,
    CreditsScene
  ]
};
