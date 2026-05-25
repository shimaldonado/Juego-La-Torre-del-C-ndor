import Phaser from 'phaser';
import { GAME_WIDTH } from '../config/constants.js';
import { SaveManager } from '../managers/SaveManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { addBackground, addPanel, addSubtitle, addTitle, createButton } from '../utils/ui.js';

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
  }

  init(data) {
    this.from = data.from || 'MainMenuScene';
    this.levelKey = data.levelKey;
  }

  create() {
    addBackground(this);
    addTitle(this, 'AJUSTES', 80, 46);
    addSubtitle(this, 'Configura música, efectos y pantalla completa.', 132);
    addPanel(this, GAME_WIDTH / 2, 300, 650, 300);
    this.renderOptions();
  }

  renderOptions() {
    const save = SaveManager.load();
    this.children.removeAll(true);
    addBackground(this);
    addTitle(this, 'AJUSTES', 80, 46);
    addSubtitle(this, 'Configura música, efectos y pantalla completa.', 132);
    addPanel(this, GAME_WIDTH / 2, 300, 650, 300);

    createButton(this, GAME_WIDTH / 2, 205, `Música: ${save.musicEnabled ? 'ON' : 'OFF'}`, () => {
      SaveManager.save({ musicEnabled: !save.musicEnabled });
      if (save.musicEnabled) AudioManager.stopMusic();
      else AudioManager.startMusic();
      this.renderOptions();
    }, 420);

    createButton(this, GAME_WIDTH / 2, 270, `Efectos: ${save.sfxEnabled ? 'ON' : 'OFF'}`, () => {
      SaveManager.save({ sfxEnabled: !save.sfxEnabled });
      AudioManager.coin();
      this.renderOptions();
    }, 420);

    createButton(this, GAME_WIDTH / 2, 335, 'Pantalla completa', () => {
      if (this.scale.isFullscreen) this.scale.stopFullscreen();
      else this.scale.startFullscreen();
    }, 420);

    createButton(this, GAME_WIDTH / 2, 400, 'Reiniciar récord', () => {
      SaveManager.save({ bestScore: 0, unlockedLevel: 1 });
      this.renderOptions();
    }, 420);

    createButton(this, GAME_WIDTH / 2, 470, 'VOLVER', () => {
      if (this.from === 'PauseScene') {
        this.scene.start('PauseScene', { levelKey: this.levelKey });
      } else {
        this.scene.start(this.from);
      }
    }, 280);
  }
}
