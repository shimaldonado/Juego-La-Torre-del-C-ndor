import Phaser from 'phaser';
import { addScreenBackground, addTitle, makeButton } from '../ui/uiHelpers.js';
import { LEVELS } from '../config/constants.js';

export class LevelSelectScene extends Phaser.Scene {
  constructor() { super('LevelSelectScene'); }

  create(data = {}) {
    this.playerCount = data.playerCount || 1;
    addScreenBackground(this, 'fondo_nivel3');
    addTitle(this, 'SELECCIÓN DE NIVEL', 72);

    this.modeLabel = this.add.text(640, 135, '', {
      fontSize: '20px', color: '#67e8f9', fontStyle: 'bold', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);
    makeButton(this, 500, 180, '1 JUGADOR', () => this.setMode(1), 220, 48);
    makeButton(this, 780, 180, '2 JUGADORES', () => this.setMode(2), 240, 48);

    LEVELS.forEach((level, index) => {
      const y = 275 + index * 72;
      makeButton(this, 640, y, level.name, () => this.scene.start('GameScene', {
        level: level.id,
        score: 0,
        lives: 3,
        feathers: 0,
        crystals: 0,
        plates: 0,
        playerCount: this.playerCount,
        playersState: [
          { id: 1, lives: 3, feathers: 0, crystals: 0, plates: 0, alive: true },
          { id: 2, lives: 3, feathers: 0, crystals: 0, plates: 0, alive: true },
        ],
        characterId: 'auki',
        characterName: 'Auki',
      }), 560, 54);
    });
    makeButton(this, 640, 640, '← VOLVER', () => this.scene.start('MainMenuScene'), 280, 52);
    this.setMode(this.playerCount);
  }

  setMode(count) {
    this.playerCount = count;
    this.modeLabel?.setText(`Modo seleccionado: ${count} jugador${count === 2 ? 'es' : ''}`);
  }
}
