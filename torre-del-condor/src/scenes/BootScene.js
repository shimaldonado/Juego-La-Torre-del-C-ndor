import Phaser from 'phaser';
import { AudioManager } from '../managers/AudioManager.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  create() {
    AudioManager.boot(this);
    this.scene.start('PreloadScene');
  }
}
