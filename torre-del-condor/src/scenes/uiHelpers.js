import { COLORS } from '../config/constants.js';

// Helpers internos sin depender de Phaser.Math globalmente
function rndInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function rndFloat(min, max) { return Math.random() * (max - min) + min; }

export function makeButton(scene, x, y, label, onClick, width = 300, height = 56) {
  const box = scene.add.rectangle(x, y, width, height, 0x23124d, 0.92)
    .setStrokeStyle(3, COLORS.gold)
    .setInteractive({ useHandCursor: true });
  const text = scene.add.text(x, y, label, {
    fontSize: '22px',
    fontFamily: 'Arial, sans-serif',
    color: '#fff3bf',
    fontStyle: 'bold',
  }).setOrigin(0.5);
  box.on('pointerover', () => {
    box.setFillStyle(0x4c1d95, 1);
    text.setColor('#ffffff');
    scene.tweens.add({ targets: [box, text], scaleX: 1.03, scaleY: 1.03, duration: 110 });
  });
  box.on('pointerout', () => {
    box.setFillStyle(0x23124d, 0.92);
    text.setColor('#fff3bf');
    scene.tweens.add({ targets: [box, text], scaleX: 1, scaleY: 1, duration: 110 });
  });
  box.on('pointerdown', () => {
    const ctx = scene.sound?.context;
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    onClick?.();
  });
  return { box, text, setVisible: (v) => { box.setVisible(v); text.setVisible(v); } };
}

export function addScreenBackground(scene, bgKey = 'fondo_nivel1') {
  const { width, height } = scene.scale;
  scene.add.image(0, 0, bgKey).setOrigin(0).setDisplaySize(width, height);
  scene.add.rectangle(width / 2, height / 2, width, height, 0x120718, 0.38);
  const stars = scene.add.graphics();
  stars.fillStyle(0xfff3bf, 0.55);
  for (let i = 0; i < 80; i++) {
    stars.fillCircle(rndInt(0, width), rndInt(20, 500), rndFloat(1, 2.5));
  }
  return stars;
}

export function addTitle(scene, text, y = 80) {
  const title = scene.add.text(scene.scale.width / 2, y, text, {
    fontSize: '58px',
    fontFamily: 'Georgia, serif',
    color: '#ffcc5c',
    stroke: '#120718',
    strokeThickness: 9,
    shadow: { offsetX: 0, offsetY: 5, color: '#000000', blur: 8, fill: true },
  }).setOrigin(0.5);
  scene.tweens.add({ targets: title, y: y + 8, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  return title;
}
