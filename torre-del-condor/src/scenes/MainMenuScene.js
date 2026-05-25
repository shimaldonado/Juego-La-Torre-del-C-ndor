import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/constants.js';
import { SaveManager } from '../managers/SaveManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { addBackground, addSubtitle, addTitle, createButton } from '../utils/ui.js';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    addBackground(this);
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'menu-bg').setAlpha(0.35).setDepth(-45);
    addTitle(this, 'LA TORRE DEL CÓNDOR', 85, 46);
    addSubtitle(this, 'Explora ruinas andinas, recoge plumas doradas y derrota a Kunturax.', 145, 20);

    const save = SaveManager.load();
    this.add.text(20, 18, `Récord: ${save.bestScore} pts`, {
      fontFamily: 'Arial Black, Arial',
      fontSize: '20px',
      color: '#fff3c4'
    });

    createButton(this, GAME_WIDTH / 2, 200, 'NUEVA PARTIDA', () => {
      AudioManager.unlock();
      AudioManager.startMusic();
      this.registry.set('score', 0);
      this.registry.set('lives', 3);
      this.scene.start('StoryScene', { next: 'Level1Scene' });
    });

    createButton(this, GAME_WIDTH / 2, 260, 'SELECCIONAR NIVEL', () => {
      AudioManager.unlock();
      this.scene.start('LevelSelectScene');
    });

    createButton(this, GAME_WIDTH / 2, 320, 'SELECCIONAR PERSONAJE', () => {
      AudioManager.unlock();
      this.scene.start('CharacterSelectScene');
    });

    createButton(this, GAME_WIDTH / 2, 380, 'AJUSTES', () => {
      AudioManager.unlock();
      this.scene.start('SettingsScene', { from: 'MainMenuScene' });
    });

    createButton(this, GAME_WIDTH / 2, 440, 'CRÉDITOS', () => {
      AudioManager.unlock();
      this.scene.start('CreditsScene');
    });

    this.add.text(GAME_WIDTH / 2, 510, 'Controles: ← → / A D moverse | ESPACIO saltar | W/S escaleras | E interactuar | ESC pausa | M mute', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#dfe7ff'
    }).setOrigin(0.5);
  }
}
