import Phaser from 'phaser';
import { addScreenBackground, addTitle, makeButton } from './uiHelpers.js';
import { CHARACTERS } from '../config/constants.js';

export class CharacterSelectScene extends Phaser.Scene {
  constructor() { super('CharacterSelectScene'); }

  create() {
    addScreenBackground(this, 'fondo_nivel2');
    addTitle(this, 'ELIGE TU EXPLORADOR', 78);
    this.add.text(640, 140, 'P1: A/D + ESPACIO · P2 local: FLECHAS + ENTER · Pausa: ESC/P', {
      fontSize: '20px', color: '#fff3bf', stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5);

    Object.values(CHARACTERS).forEach((character, index) => this.createCard(character, 315 + index * 325, 380));
    makeButton(this, 640, 650, '← VOLVER AL MENÚ', () => this.scene.start('MainMenuScene'), 300, 52);
  }

  createCard(character, x, y) {
    const card = this.add.rectangle(x, y, 270, 370, 0x0f172a, 0.82).setStrokeStyle(3, 0xffcc5c)
      .setInteractive({ useHandCursor: true });
    const hero = this.add.image(x, y - 70, 'heroe_idle').setScale(1.65).setTint(character.tint);
    const name = this.add.text(x, y + 82, character.name, { fontSize: '32px', color: '#ffcc5c', fontStyle: 'bold' }).setOrigin(0.5);
    const subtitle = this.add.text(x, y + 122, character.subtitle, { fontSize: '20px', color: '#c7f9ff' }).setOrigin(0.5);
    const desc = this.add.text(x, y + 158, character.description, { fontSize: '18px', color: '#fff3bf', align: 'center', wordWrap: { width: 220 } }).setOrigin(0.5);

    const select = () => this.scene.start('GameScene', {
      level: 1,
      score: 0,
      lives: 3,
      feathers: 0,
      crystals: 0,
      characterId: character.id,
      characterName: character.name,
    });
    card.on('pointerover', () => this.tweens.add({ targets: [card, hero, name, subtitle, desc], scaleX: 1.04, scaleY: 1.04, duration: 140 }));
    card.on('pointerout', () => this.tweens.add({ targets: [card, hero, name, subtitle, desc], scaleX: 1, scaleY: 1, duration: 140 }));
    card.on('pointerdown', select);
    hero.setInteractive({ useHandCursor: true }).on('pointerdown', select);
  }
}
