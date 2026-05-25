import Phaser from 'phaser';
import { GAME_WIDTH } from '../config/constants.js';
import { addBackground, addPanel, addTitle, createButton } from '../utils/ui.js';

export class CreditsScene extends Phaser.Scene {
  constructor() {
    super('CreditsScene');
  }

  create() {
    addBackground(this);
    addTitle(this, 'CRÉDITOS', 75, 46);
    addPanel(this, GAME_WIDTH / 2, 275, 700, 285);
    this.add.text(GAME_WIDTH / 2, 275,
      'La Torre del Cóndor\n\nDesarrollado con JavaScript avanzado y Phaser.js\n\nIncluye escenas, clases, físicas, sonidos generados por código, pausa, ajustes, niveles, enemigos y jefe final.\n\nIdea original: aventura andina tipo plataformas verticales.',
      {
        fontFamily: 'Arial',
        fontSize: '22px',
        color: '#fff3c4',
        align: 'center',
        lineSpacing: 7,
        wordWrap: { width: 650 }
      }
    ).setOrigin(0.5);
    createButton(this, GAME_WIDTH / 2, 480, 'VOLVER', () => this.scene.start('MainMenuScene'), 250);
  }
}
