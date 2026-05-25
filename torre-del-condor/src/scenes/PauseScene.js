import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/constants.js';
import { addPanel, createButton } from '../utils/ui.js';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  init(data) {
    this.levelKey = data.levelKey;
  }

  create() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.65);
    addPanel(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, 520, 390, 0x111827, 0.96);
    this.add.text(GAME_WIDTH / 2, 135, 'PAUSA', {
      fontFamily: 'Arial Black, Arial',
      fontSize: '48px',
      color: '#fff3c4',
      stroke: '#000000',
      strokeThickness: 7
    }).setOrigin(0.5);

    createButton(this, GAME_WIDTH / 2, 220, 'CONTINUAR', () => {
      this.scene.stop('PauseScene');
      this.scene.resume(this.levelKey);
    }, 330);

    createButton(this, GAME_WIDTH / 2, 290, 'REINICIAR NIVEL', () => {
      this.registry.set('score', 0);
      this.registry.set('lives', 3);
      this.scene.stop(this.levelKey);
      this.scene.stop('PauseScene');
      this.scene.start(this.levelKey);
    }, 330);

    createButton(this, GAME_WIDTH / 2, 360, 'AJUSTES', () => {
      this.scene.stop('PauseScene');
      this.scene.start('SettingsScene', { from: 'PauseScene', levelKey: this.levelKey });
    }, 330);

    createButton(this, GAME_WIDTH / 2, 430, 'MENÚ PRINCIPAL', () => {
      this.registry.set('score', 0);
      this.registry.set('lives', 3);
      this.scene.stop(this.levelKey);
      this.scene.stop('PauseScene');
      this.scene.start('MainMenuScene');
    }, 330);
  }
}
