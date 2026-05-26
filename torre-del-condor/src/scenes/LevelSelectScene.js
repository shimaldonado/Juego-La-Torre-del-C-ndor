import Phaser from 'phaser';
import { addScreenBackground, addTitle, makeButton } from './uiHelpers.js';
import { LEVELS } from '../config/constants.js';

export class LevelSelectScene extends Phaser.Scene {
  constructor() { super('LevelSelectScene'); }

  create() {
    addScreenBackground(this, 'fondo_nivel3');
    addTitle(this, 'SELECCIÓN DE NIVEL', 80);
    LEVELS.forEach((level, index) => {
      const y = 220 + index * 86;
      makeButton(this, 640, y, level.name, () => this.scene.start('GameScene', {
        level: level.id,
        score: 0,
        lives: 3,
        feathers: 0,
        crystals: 0,
        characterId: 'auki',
        characterName: 'Auki',
      }), 520, 60);
    });
    makeButton(this, 640, 620, '← VOLVER', () => this.scene.start('MainMenuScene'), 280, 52);
  }
}
