import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/constants.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#080b16');
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Cargando la torre...', {
      fontFamily: 'Arial Black, Arial',
      fontSize: '34px',
      color: '#fff3c4'
    }).setOrigin(0.5);
    this.time.delayedCall(400, () => this.scene.start('PreloadScene'));
  }
}
