import Phaser from 'phaser';
import { CHARACTERS, COLORS } from '../config/constants.js';
import { addScreenBackground, addTitle } from '../ui/uiHelpers.js';

function activeColorFromHex(hex, fallback = COLORS.gold) {
  if (typeof hex !== 'string') return fallback;
  const clean = hex.replace('#', '');
  const value = Number.parseInt(clean, 16);
  return Number.isFinite(value) ? value : fallback;
}

export default class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelectScene');
  }

  init(data = {}) {
    this.playerCount = data.playerCount || 1;
    this.selected = data.selected || 'auki';
  }

  create() {
    const { width, height } = this.scale;
    addScreenBackground(this, 'fondo_menu');

    this.add.rectangle(width / 2, height / 2, width, height, COLORS.navy, 0.34)
      .setDepth(0);

    this.createModeButtons();
    addTitle(this, 'ELIGE TU GUARDIÁN', 130, 42).setDepth(4);

    this.add.text(width / 2, 170, 'Cada personaje tiene un poder diferente. Úsalo con E o Q.', {
      fontSize: '19px',
      color: '#c7f9ff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(4);

    this.cards = {};
    this.createCharacterCards();
    this.createFooterButtons();
    this.refreshSelection();
  }

  createModeButtons() {
    this.modeButtons = {};
    this.modeButtons.one = this.createModeButton(420, 58, '1 JUGADOR', 1);
    this.modeButtons.two = this.createModeButton(860, 58, '2 JUGADORES', 2);
    this.refreshModeButtons();
  }

  createModeButton(x, y, label, count) {
    const box = this.add.rectangle(x, y, 330, 74, COLORS.purple, 0.94)
      .setStrokeStyle(4, COLORS.gold)
      .setInteractive({ useHandCursor: true })
      .setDepth(5);

    const text = this.add.text(x, y, label, {
      fontSize: '31px',
      color: '#fff3bf',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5).setDepth(6);

    const setMode = () => {
      this.playerCount = count;
      this.refreshModeButtons();
    };

    box.on('pointerdown', setMode);
    text.setInteractive({ useHandCursor: true }).on('pointerdown', setMode);
    box.on('pointerover', () => box.setFillStyle(COLORS.goldDark, 0.98));
    box.on('pointerout', () => this.refreshModeButtons());

    return { box, text, count };
  }

  refreshModeButtons() {
    if (!this.modeButtons) return;
    Object.values(this.modeButtons).forEach(({ box, count }) => {
      const active = this.playerCount === count;
      box.setFillStyle(active ? 0x4c1d95 : COLORS.purple, active ? 0.98 : 0.9);
      box.setStrokeStyle(active ? 5 : 3, active ? COLORS.cyan : COLORS.gold);
    });
  }

  createCharacterCards() {
    const characters = Object.values(CHARACTERS);
    const positions = [235, 640, 1045];

    characters.forEach((char, index) => {
      this.cards[char.id] = this.createCharacterCard(char, positions[index], 382);
    });
  }

  createCharacterCard(char, x, y) {
    const selectedColor = char.id === 'auki' ? COLORS.cyan : COLORS.gold;
    const power = char.power || {};

    const shadow = this.add.rectangle(x + 10, y + 12, 340, 430, 0x000000, 0.35)
      .setDepth(1);

    const panel = this.add.rectangle(x, y, 340, 430, COLORS.navy, 0.86)
      .setStrokeStyle(4, COLORS.gold)
      .setInteractive({ useHandCursor: true })
      .setDepth(2);

    const halo = this.add.rectangle(x, y, 346, 436, selectedColor, 0.08)
      .setStrokeStyle(2, selectedColor, 0.75)
      .setDepth(1.5);

    const previewKey = this.textures.exists(char.idle) ? char.idle : 'heroe_idle';
    const preview = this.add.sprite(x, y - 118, previewKey)
      .setScale(char.previewScale || 0.58)
      .setDepth(5);

    if (preview.anims && char.anims?.run && this.anims.exists(char.anims.run)) {
      preview.play(char.anims.run, true);
    }

    const name = this.add.text(x, y - 18, char.name.toUpperCase(), {
      fontSize: '29px',
      color: '#ffcc5c',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5).setDepth(5);

    const stats = this.add.text(x, y + 24,
      `${char.subtitle}  ·  Poder: ${power.name || 'Ataque'}\nVel ${Math.round(char.speed)}  ·  Salto ${Math.round(char.jump)}`,
      {
        fontSize: '15px',
        color: '#dffaff',
        align: 'center',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
      }
    ).setOrigin(0.5).setDepth(5);

    const powerColor = char.powerColor || '#ffdf7a';
    const powerBox = this.add.rectangle(x, y + 120, 292, 108, 0x1f1235, 0.83)
      .setStrokeStyle(2, activeColorFromHex(powerColor, COLORS.goldDark), 0.85)
      .setDepth(3);

    const powerText = this.add.text(x, y + 118,
      `${power.icon || '⚡'}  ${power.name || 'Poder'}\n${power.summary || char.description}\n[tecla E / Q]`,
      {
        fontSize: '15px',
        color: powerColor,
        align: 'center',
        wordWrap: { width: 260 },
        lineSpacing: 5,
        stroke: '#000000',
        strokeThickness: 4,
      }
    ).setOrigin(0.5).setDepth(5);

    const selectedLabel = this.add.text(x, y + 188, 'SELECCIONADO', {
      fontSize: '17px',
      color: '#67e8f9',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(5);

    const select = () => {
      this.selected = char.id;
      this.refreshSelection();
    };

    [panel, preview, name, stats, powerText].forEach((obj) => {
      obj.setInteractive({ useHandCursor: true });
      obj.on('pointerdown', select);
    });

    panel.on('pointerover', () => panel.setFillStyle(0x172554, 0.92));
    panel.on('pointerout', () => panel.setFillStyle(COLORS.navy, 0.86));

    return { panel, halo, shadow, preview, name, stats, powerBox, powerText, selectedLabel };
  }

  refreshSelection() {
    Object.entries(this.cards || {}).forEach(([id, card]) => {
      const active = id === this.selected;
      card.panel.setStrokeStyle(active ? 5 : 3, active ? COLORS.cyan : COLORS.gold);
      card.halo.setVisible(active);
      card.selectedLabel.setVisible(active);
      card.preview.setAlpha(active ? 1 : 0.78);
      card.name.setColor(active ? '#ffcc5c' : '#fff3bf');
      card.powerBox.setStrokeStyle(active ? 3 : 2, active ? COLORS.cyan : COLORS.goldDark, active ? 0.95 : 0.75);
    });
  }

  createFooterButtons() {
    const back = this.add.text(34, 675, '← VOLVER', {
      fontSize: '22px',
      color: '#c7f9ff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setInteractive({ useHandCursor: true }).setDepth(6);

    back.on('pointerdown', () => this.scene.start('MainMenuScene'));

    const startBox = this.add.rectangle(640, 670, 470, 64, COLORS.purple, 0.95)
      .setStrokeStyle(4, COLORS.gold)
      .setInteractive({ useHandCursor: true })
      .setDepth(5);

    const startText = this.add.text(640, 670, 'INICIAR AVENTURA', {
      fontSize: '28px',
      color: '#fff3bf',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5).setDepth(6);

    const start = () => {
      const selectedCharacter = CHARACTERS[this.selected] || CHARACTERS.auki;

      // Se manda la selección dentro de gameData para que StoryScene y GameScene
      // no pierdan el personaje. Antes a veces entraba como Auki aunque se eligiera
      // Killa o Rumi, por eso se veía siempre el poder dorado.
      this.scene.start('StoryScene', {
        gameData: {
          level: 1,
          playerCount: this.playerCount,
          characterId: selectedCharacter.id,
          characterName: selectedCharacter.name,
          selected: selectedCharacter.id,
        },
      });
    };

    startBox.on('pointerdown', start);
    startText.setInteractive({ useHandCursor: true }).on('pointerdown', start);
    startBox.on('pointerover', () => startBox.setFillStyle(COLORS.goldDark, 0.98));
    startBox.on('pointerout', () => startBox.setFillStyle(COLORS.purple, 0.95));
  }
}
