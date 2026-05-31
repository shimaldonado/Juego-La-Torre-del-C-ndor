import Phaser from 'phaser';
import { CHARACTERS, COLORS, STORY } from '../config/constants.js';
import { addScreenBackground, addTitle, makeButton } from './uiHelpers.js';

export class StoryScene extends Phaser.Scene {
  constructor() { super('StoryScene'); }

  create(data = {}) {
    this.gameData = data.gameData || null;
    this.page = 0;
    this.storySprites = [];

    addScreenBackground(this, 'fondo_nivel2');
    addTitle(this, STORY.title.toUpperCase(), 78);

    this.add.rectangle(640, 350, 900, 410, 0x0f172a, 0.9)
      .setStrokeStyle(3, COLORS.gold);
    this.storyText = this.add.text(640, 432, '', {
      fontSize: '22px',
      color: '#fff3bf',
      align: 'center',
      wordWrap: { width: 760 },
      lineSpacing: 8,
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.nextButton = makeButton(this, 640, 585, 'SIGUIENTE', () => this.nextPage(), 390, 58);
    makeButton(this, 640, 650, '← VOLVER AL MENÚ', () => this.scene.start('MainMenuScene'), 320, 50);

    this.input.keyboard.on('keydown-ENTER', () => this.nextPage());
    this.renderPage();
  }

  nextPage() {
    if (this.page < STORY.chapters.length - 1) {
      this.page += 1;
      this.renderPage();
      return;
    }
    if (this.gameData) this.scene.start('GameScene', this.gameData);
    else this.scene.start('CharacterSelectScene');
  }

  renderPage() {
    this.storySprites.forEach((item) => item.destroy());
    this.storySprites = [];

    const chapter = STORY.chapters[this.page] || STORY.chapters[0];
    this.storyText.setText(chapter.text);
    this.nextButton.text.setText(this.page === STORY.chapters.length - 1
      ? (this.gameData ? 'COMENZAR LA ASCENSIÓN' : 'ELEGIR PERSONAJE')
      : 'SIGUIENTE');

    const add = (item) => {
      this.storySprites.push(item);
      return item;
    };

    if (chapter.visual === 'flame') {
      const glow = add(this.add.circle(640, 260, 78, COLORS.gold, 0.18));
      add(this.add.image(640, 260, 'simbolo_condor').setScale(0.95).setTint(0xffe6a7));
      add(this.add.image(560, 282, 'cristal_andino').setScale(0.58));
      add(this.add.image(720, 282, 'pluma_dorada').setScale(0.62));
      this.tweens.add({ targets: glow, alpha: 0.36, scale: 1.16, duration: 1000, yoyo: true, repeat: -1 });
    } else if (chapter.visual === 'shadow') {
      add(this.add.image(470, 286, 'puerta_torre').setScale(1.05).setTint(0x7c3aed));
      add(this.add.sprite(690, 270, 'kunturax_idle').play('boss_idle').setScale(0.58).setTint(0xe879f9));
      add(this.add.image(815, 308, 'proyectil_kunturax').setScale(0.76));
    } else if (chapter.visual === 'heroes') {
      const heroes = [
        { x: 540, data: CHARACTERS.auki },
        { x: 640, data: CHARACTERS.killa },
        { x: 740, data: CHARACTERS.rumi },
      ];
      heroes.forEach(({ x, data }, index) => {
        const hero = add(this.add.image(x, 288, 'heroe_idle').setScale(0.62).setTint(data.tint));
        add(this.add.text(x, 354, data.name, { fontSize: '18px', color: '#ffcc5c', fontStyle: 'bold', stroke: '#000', strokeThickness: 3 }).setOrigin(0.5));
        this.tweens.add({ targets: hero, y: hero.y - 8, delay: index * 120, duration: 900, yoyo: true, repeat: -1 });
      });
    } else {
      add(this.add.image(515, 296, 'heroe_idle').setScale(0.7).setTint(CHARACTERS.auki.tint));
      const slash = add(this.add.image(610, 288, 'ataque_dorado').setScale(0.52).setAngle(-8));
      add(this.add.sprite(765, 286, 'kunturax_idle').play('boss_idle').setScale(0.46).setTint(0xe879f9));
      this.tweens.add({ targets: slash, alpha: 0.45, scale: 0.62, duration: 520, yoyo: true, repeat: -1 });
    }
  }
}
