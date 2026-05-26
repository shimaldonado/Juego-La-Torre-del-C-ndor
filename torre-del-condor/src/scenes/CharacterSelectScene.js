import Phaser from 'phaser';
import { addScreenBackground, addTitle, makeButton } from './uiHelpers.js';
import { CHARACTERS, COLORS } from '../config/constants.js';

export class CharacterSelectScene extends Phaser.Scene {
  constructor() { super('CharacterSelectScene'); }

  create(data = {}) {
    this.playerCount = data.playerCount || 1;
    this.selectedCharacterId = data.characterId || 'auki';

    addScreenBackground(this, 'fondo_nivel1');
    addTitle(this, 'ELIGE TU PARTIDA', 72);

    this.add.text(640, 132, 'Primero escoge si jugarás solo o con 2 jugadores. Luego selecciona el personaje base.', {
      fontSize: '20px', color: '#fff3bf', stroke: '#000', strokeThickness: 3, align: 'center',
    }).setOrigin(0.5);

    this.modeText = this.add.text(640, 178, '', {
      fontSize: '24px', color: '#67e8f9', fontStyle: 'bold', stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5);

    makeButton(this, 500, 230, '1 JUGADOR', () => this.setMode(1), 230, 54);
    makeButton(this, 780, 230, '2 JUGADORES', () => this.setMode(2), 250, 54);

    const entries = Object.values(CHARACTERS);
    entries.forEach((ch, index) => {
      const x = 315 + index * 325;
      const y = 395;
      const card = this.add.rectangle(x, y, 265, 245, 0x111827, 0.82)
        .setStrokeStyle(3, ch.id === this.selectedCharacterId ? COLORS.cyan : COLORS.gold)
        .setInteractive({ useHandCursor: true });
      const hero = this.add.image(x, y - 65, 'heroe_idle').setScale(0.58).setTint(ch.tint);
      const title = this.add.text(x, y + 18, ch.name.toUpperCase(), {
        fontSize: '27px', color: '#ffcc5c', fontStyle: 'bold', stroke: '#000', strokeThickness: 4,
      }).setOrigin(0.5);
      const sub = this.add.text(x, y + 55, `${ch.subtitle}\n${ch.description}\nVelocidad ${ch.speed} · Salto ${ch.jump}`, {
        fontSize: '15px', color: '#fff3bf', align: 'center', lineSpacing: 4,
      }).setOrigin(0.5);

      const select = () => {
        this.selectedCharacterId = ch.id;
        this.cards.forEach(({ card: other, id }) => other.setStrokeStyle(3, id === ch.id ? COLORS.cyan : COLORS.gold));
      };
      card.on('pointerdown', select);
      hero.setInteractive({ useHandCursor: true }).on('pointerdown', select);
      this.cards ??= [];
      this.cards.push({ card, id: ch.id, title, sub });
    });

    makeButton(this, 640, 585, 'COMENZAR NIVEL 1', () => this.startGame(), 360, 60);
    makeButton(this, 640, 656, '← VOLVER AL MENÚ', () => this.scene.start('MainMenuScene'), 320, 48);
    this.setMode(this.playerCount);
  }

  setMode(count) {
    this.playerCount = count;
    this.modeText?.setText(count === 1
      ? 'Modo actual: 1 jugador · P1 usa A/D, ESPACIO y E'
      : 'Modo actual: 2 jugadores · P1 usa A/D/ESPACIO/E · P2 usa FLECHAS/SHIFT/ENTER');
  }

  startGame() {
    const character = CHARACTERS[this.selectedCharacterId] || CHARACTERS.auki;
    this.scene.start('GameScene', {
      level: 1,
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
      characterId: character.id,
      characterName: character.name,
    });
  }
}
