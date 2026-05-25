import Phaser from 'phaser';
import { GAME_WIDTH, PLAYER_STATS } from '../config/constants.js';
import { SaveManager } from '../managers/SaveManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { addBackground, addSubtitle, addTitle, createButton } from '../utils/ui.js';

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelectScene');
  }

  create() {
    addBackground(this);
    addTitle(this, 'SELECCIONA TU PERSONAJE', 70, 38);
    addSubtitle(this, 'Cada personaje tiene una pequeña diferencia de velocidad o salto.', 120);

    const keys = Object.keys(PLAYER_STATS);
    keys.forEach((key, index) => {
      const stats = PLAYER_STATS[key];
      const x = 230 + index * 250;
      const y = 245;
      const selected = SaveManager.load().selectedCharacter === key;

      this.add.rectangle(x, y, 205, 230, selected ? 0x3a1c71 : 0x111827, 0.88)
        .setStrokeStyle(4, selected ? 0xffc857 : 0x4b5563);
      const avatar = this.add.image(x, y - 55, stats.texture).setScale(stats.previewScale ?? 1.2);
      if (stats.tint) avatar.setTint(stats.tint);
      this.add.text(x, y + 10, stats.label, {
        fontFamily: 'Arial Black, Arial',
        fontSize: '24px',
        color: '#fff3c4'
      }).setOrigin(0.5);
      this.add.text(x, y + 60, stats.description, {
        fontFamily: 'Arial',
        fontSize: '15px',
        color: '#dfe7ff',
        align: 'center',
        wordWrap: { width: 170 }
      }).setOrigin(0.5);

      createButton(this, x, y + 135, selected ? 'ELEGIDO' : 'ELEGIR', () => {
        SaveManager.save({ selectedCharacter: key });
        AudioManager.coin();
        this.scene.restart();
      }, 160);
    });

    createButton(this, GAME_WIDTH / 2, 500, 'VOLVER AL MENÚ', () => this.scene.start('MainMenuScene'), 300);
  }
}
