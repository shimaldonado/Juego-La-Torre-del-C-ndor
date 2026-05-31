import Phaser from 'phaser';
import { COLORS } from '../config/constants.js';
import { makeButton } from './uiHelpers.js';

export class PauseScene extends Phaser.Scene {
  constructor() { super('PauseScene'); }

  init(data) { this.gameSceneKey = data.gameSceneKey || 'GameScene'; }

  create() {
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.62);
    this.add.rectangle(640, 360, 560, 360, 0x111827, 0.96).setStrokeStyle(4, COLORS.gold);
    this.add.text(640, 210, 'PAUSA', { fontSize: '54px', color: '#ffcc5c', fontStyle: 'bold', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5);
    this.add.text(640, 270, 'Elige una opción', { fontSize: '20px', color: '#fff3bf' }).setOrigin(0.5);

    makeButton(this, 640, 340, '▶ CONTINUAR', () => this.resumeGame(), 340, 56);
    makeButton(this, 640, 430, '🏠 MENÚ PRINCIPAL', () => {
      this.scene.stop(this.gameSceneKey);
      this.scene.start('MainMenuScene');
    }, 340, 56);

    this.input.keyboard.once('keydown-ESC', () => this.resumeGame());
    this.input.keyboard.once('keydown-P', () => this.resumeGame());
  }

  resumeGame() {
    this.scene.stop();
    this.scene.resume(this.gameSceneKey);
  }
}
