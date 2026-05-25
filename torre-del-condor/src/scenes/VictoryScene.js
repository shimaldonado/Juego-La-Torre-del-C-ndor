import Phaser from 'phaser';
import { GAME_WIDTH } from '../config/constants.js';
import { SaveManager } from '../managers/SaveManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { addBackground, addPanel, addTitle, createButton } from '../utils/ui.js';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  create() {
    AudioManager.stopMusic();
    AudioManager.win();
    addBackground(this);
    addTitle(this, '¡VICTORIA!', 80, 56);
    addPanel(this, GAME_WIDTH / 2, 275, 720, 300);
    const score = this.registry.get('score') || 0;
    const best = SaveManager.load().bestScore;

    this.add.image(GAME_WIDTH / 2, 185, 'crystal').setScale(1.5);
    this.add.text(GAME_WIDTH / 2, 310,
      `Recuperaste el cristal y salvaste la ciudad.\n\nPuntaje final: ${score}\nRécord guardado: ${best}\n\nLa Torre del Cóndor ha sido liberada.`,
      {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#fff3c4',
        align: 'center',
        lineSpacing: 8
      }
    ).setOrigin(0.5);

    createButton(this, GAME_WIDTH / 2, 460, 'JUGAR DE NUEVO', () => {
      this.registry.set('score', 0);
      this.registry.set('lives', 3);
      AudioManager.startMusic();
      this.scene.start('StoryScene', { next: 'Level1Scene' });
    }, 320);
    createButton(this, GAME_WIDTH / 2, 525, 'MENÚ PRINCIPAL', () => this.scene.start('MainMenuScene'), 320);
  }
}
