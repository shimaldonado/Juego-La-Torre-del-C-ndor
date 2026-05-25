import Phaser from 'phaser';
import { COLORS, GAME_WIDTH } from '../config/constants.js';

export function addTitle(scene, text, y = 70, size = 54) {
  return scene.add.text(GAME_WIDTH / 2, y, text, {
    fontFamily: 'Arial Black, Arial',
    fontSize: `${size}px`,
    color: COLORS.text,
    stroke: '#000000',
    strokeThickness: 8,
    align: 'center'
  }).setOrigin(0.5);
}

export function addSubtitle(scene, text, y = 125, size = 20) {
  return scene.add.text(GAME_WIDTH / 2, y, text, {
    fontFamily: 'Arial, sans-serif',
    fontSize: `${size}px`,
    color: '#dfe7ff',
    align: 'center',
    wordWrap: { width: 780 }
  }).setOrigin(0.5);
}

export function createButton(scene, x, y, label, callback, width = 310) {
  const container = scene.add.container(x, y);
  const bg = scene.add.rectangle(0, 0, width, 54, 0xffc857, 1)
    .setStrokeStyle(4, 0x3a1c71)
    .setInteractive({ useHandCursor: true });
  const text = scene.add.text(0, 0, label, {
    fontFamily: 'Arial Black, Arial',
    fontSize: '22px',
    color: '#1d1d2c'
  }).setOrigin(0.5);

  container.add([bg, text]);

  bg.on('pointerover', () => {
    bg.setFillStyle(0xffe08a);
    container.setScale(1.04);
  });
  bg.on('pointerout', () => {
    bg.setFillStyle(0xffc857);
    container.setScale(1);
  });
  bg.on('pointerdown', callback);

  return container;
}

export function addPanel(scene, x, y, width, height, color = 0x111827, alpha = 0.84) {
  return scene.add.rectangle(x, y, width, height, color, alpha)
    .setStrokeStyle(3, 0xffc857);
}

export function addBackground(scene) {
  const top = scene.add.rectangle(GAME_WIDTH / 2, 135, GAME_WIDTH, 270, 0x10182f).setDepth(-50);
  const bottom = scene.add.rectangle(GAME_WIDTH / 2, 405, GAME_WIDTH, 270, 0x2c1744).setDepth(-50);
  for (let i = 0; i < 65; i += 1) {
    const x = Phaser.Math.Between(0, GAME_WIDTH);
    const y = Phaser.Math.Between(0, 540);
    const size = Phaser.Math.Between(1, 3);
    scene.add.circle(x, y, size, 0xfff4c2, Phaser.Math.FloatBetween(0.25, 0.85)).setDepth(-40);
  }
  return { top, bottom };
}
