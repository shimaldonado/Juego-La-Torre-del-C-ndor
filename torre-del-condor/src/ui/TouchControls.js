import { GAME_HEIGHT, GAME_WIDTH } from '../config/constants.js';

/**
 * Controles táctiles reutilizables para que el juego funcione también en celulares y tablets.
 * Los botones se dibujan con Phaser, por eso no dependen de HTML externo ni de imágenes.
 */
export class TouchControls {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.showInteract = options.showInteract ?? false;
    this.down = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      interact: false,
      pause: false,
      mute: false
    };
    this.pressed = {
      jump: 0,
      interact: 0,
      pause: 0,
      mute: 0
    };

    this.container = scene.add.container(0, 0)
      .setScrollFactor(0)
      .setDepth(1300)
      .setName('touch-controls');

    this.createControls();
  }

  createControls() {
    const baseY = GAME_HEIGHT - 74;
    const smallY = GAME_HEIGHT - 142;

    this.createHoldButton(72, baseY, '◀', 'left', 74, 58);
    this.createHoldButton(164, baseY, '▶', 'right', 74, 58);
    this.createHoldButton(118, smallY, '▲', 'up', 74, 54);
    this.createHoldButton(118, GAME_HEIGHT - 18, '▼', 'down', 74, 42);

    this.createActionButton(GAME_WIDTH - 132, baseY, 'SALTAR', 'jump', 132, 58);

    if (this.showInteract) {
      this.createActionButton(GAME_WIDTH - 286, baseY, 'E', 'interact', 82, 58);
    }

    this.createActionButton(GAME_WIDTH - 82, 86, '⏸', 'pause', 64, 44, 0x111827);
    this.createActionButton(GAME_WIDTH - 156, 86, '🔊', 'mute', 64, 44, 0x111827);

    this.scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 18, 'Controles táctiles: mover, subir/bajar escaleras, saltar, pausar y silenciar', {
      fontFamily: 'Arial',
      fontSize: '13px',
      color: '#ffffffcc',
      align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1300);
  }

  createBaseButton(x, y, label, width, height, color = 0x000000) {
    const group = this.scene.add.container(x, y);
    const bg = this.scene.add.rectangle(0, 0, width, height, color, 0.58)
      .setStrokeStyle(2, 0xffc857, 0.85)
      .setInteractive({ useHandCursor: true });
    const text = this.scene.add.text(0, 0, label, {
      fontFamily: 'Arial Black, Arial',
      fontSize: label.length > 2 ? '15px' : '24px',
      color: '#fff3c4',
      align: 'center'
    }).setOrigin(0.5);

    group.add([bg, text]);
    this.container.add(group);
    return { bg, group };
  }

  createHoldButton(x, y, label, key, width, height) {
    const { bg, group } = this.createBaseButton(x, y, label, width, height);
    const press = () => {
      this.down[key] = true;
      group.setScale(1.08);
      bg.setFillStyle(0x3a1c71, 0.72);
    };
    const release = () => {
      this.down[key] = false;
      group.setScale(1);
      bg.setFillStyle(0x000000, 0.58);
    };

    bg.on('pointerdown', press);
    bg.on('pointerup', release);
    bg.on('pointerout', release);
    bg.on('pointerupoutside', release);
  }

  createActionButton(x, y, label, key, width, height, color = 0x3a1c71) {
    const { bg, group } = this.createBaseButton(x, y, label, width, height, color);
    const press = () => {
      this.down[key] = true;
      this.pressed[key] += 1;
      group.setScale(1.08);
      bg.setFillStyle(0xffc857, 0.86);
    };
    const release = () => {
      this.down[key] = false;
      group.setScale(1);
      bg.setFillStyle(color, 0.58);
    };

    bg.on('pointerdown', press);
    bg.on('pointerup', release);
    bg.on('pointerout', release);
    bg.on('pointerupoutside', release);
  }

  isDown(key) {
    return Boolean(this.down[key]);
  }

  consume(key) {
    if (!this.pressed[key]) return false;
    this.pressed[key] -= 1;
    return true;
  }

  destroy() {
    this.container?.destroy(true);
  }
}
