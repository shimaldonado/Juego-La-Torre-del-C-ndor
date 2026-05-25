import Phaser from 'phaser';
import { GAME_WIDTH } from '../config/constants.js';
import { SaveManager } from '../managers/SaveManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { addBackground, addPanel, addTitle, createButton } from '../utils/ui.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    AudioManager.stopMusic();
    addBackground(this);
    addTitle(this, 'GAME OVER', 95, 56);
    addPanel(this, GAME_WIDTH / 2, 280, 620, 250);
    const score = this.registry.get('score') || 0;
    const best = SaveManager.load().bestScore;
    this.add.text(GAME_WIDTH / 2, 255, `Puntaje final: ${score}\nRécord: ${best}\n\nKunturax ganó esta vez, pero la torre puede volver a intentarse.`, {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#fff3c4',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5);

    createButton(this, GAME_WIDTH / 2, 410, 'REINTENTAR', () => {
      this.registry.set('score', 0);
      this.registry.set('lives', 3);
      AudioManager.startMusic();
      this.scene.start('Level1Scene');
    }, 300);
    createButton(this, GAME_WIDTH / 2, 480, 'MENÚ PRINCIPAL', () => this.scene.start('MainMenuScene'), 300);
  }
}
