import Phaser from 'phaser';
import { COLORS } from '../config/constants.js';
import { makeButton } from './uiHelpers.js';
import { SaveManager } from '../managers/SaveManager.js';

export class PauseScene extends Phaser.Scene {
  constructor() { super('PauseScene'); }

  init(data) { this.gameSceneKey = data.gameSceneKey || 'GameScene'; this.saveData = data.saveData || {}; }

  create() {
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.62);
    this.add.rectangle(640, 360, 560, 520, 0x111827, 0.96).setStrokeStyle(4, COLORS.gold);
    this.add.text(640, 145, 'PAUSA', { fontSize: '54px', color: '#ffcc5c', fontStyle: 'bold', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5);
    this.message = this.add.text(640, 205, 'Elige una opción', { fontSize: '20px', color: '#fff3bf' }).setOrigin(0.5);

    makeButton(this, 640, 275, '▶ CONTINUAR', () => this.resumeGame(), 340, 56);
    makeButton(this, 640, 345, '💾 GUARDAR RANURA 1', () => this.saveSlot(1), 340, 56);
    makeButton(this, 640, 415, '💾 GUARDAR RANURA 2', () => this.saveSlot(2), 340, 56);
    makeButton(this, 640, 485, '💾 GUARDAR RANURA 3', () => this.saveSlot(3), 340, 56);
    makeButton(this, 640, 575, '🏠 MENÚ PRINCIPAL', () => {
      this.scene.stop(this.gameSceneKey);
      this.scene.start('MainMenuScene');
    }, 340, 56);

    this.input.keyboard.once('keydown-ESC', () => this.resumeGame());
    this.input.keyboard.once('keydown-P', () => this.resumeGame());
  }

  saveSlot(slot) {
    SaveManager.save(slot, this.saveData);
    this.message.setText(`Partida guardada en ranura ${slot}.`);
  }

  resumeGame() {
    this.scene.stop();
    this.scene.resume(this.gameSceneKey);
  }
}
