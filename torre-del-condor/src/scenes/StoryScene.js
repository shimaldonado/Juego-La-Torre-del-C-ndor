import Phaser from 'phaser';
import { GAME_WIDTH } from '../config/constants.js';
import { addBackground, addPanel, addTitle, createButton } from '../utils/ui.js';

export class StoryScene extends Phaser.Scene {
  constructor() {
    super('StoryScene');
  }

  init(data) {
    this.next = data.next || 'Level1Scene';
  }

  create() {
    addBackground(this);
    addTitle(this, 'HISTORIA', 72, 44);
    addPanel(this, GAME_WIDTH / 2, 275, 760, 300);

    this.add.text(GAME_WIDTH / 2, 270,
      'Hace muchos años, un cristal protegía la ciudad desde lo alto de una torre sagrada.\n\nPero Kunturax, un cóndor mecánico, robó el cristal para dominar la montaña.\n\nAhora Inti y sus aliados deben subir la torre, esquivar barriles, activar palancas y recuperar la energía perdida.',
      {
        fontFamily: 'Arial',
        fontSize: '22px',
        color: '#fff3c4',
        align: 'center',
        lineSpacing: 8,
        wordWrap: { width: 690 }
      }
    ).setOrigin(0.5);

    createButton(this, GAME_WIDTH / 2, 470, 'COMENZAR AVENTURA', () => this.scene.start(this.next), 340);
  }
}
