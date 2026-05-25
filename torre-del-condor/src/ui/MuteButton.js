import { AudioManager } from '../managers/AudioManager.js';
import { SaveManager } from '../managers/SaveManager.js';

/** Botón visible de mute para cumplir el requisito de accesibilidad/audio. */
export class MuteButton {
  constructor(scene, x, y) {
    this.scene = scene;
    this.container = scene.add.container(x, y).setScrollFactor(0).setDepth(1400);
    this.bg = scene.add.rectangle(0, 0, 62, 34, 0x111827, 0.86)
      .setStrokeStyle(2, 0xffc857)
      .setInteractive({ useHandCursor: true });
    this.label = scene.add.text(0, 0, '', {
      fontFamily: 'Arial Black, Arial',
      fontSize: '18px',
      color: '#fff3c4'
    }).setOrigin(0.5);

    this.container.add([this.bg, this.label]);
    this.bg.on('pointerdown', () => {
      AudioManager.toggleMusic();
      this.refresh();
    });
    this.refresh();
  }

  refresh() {
    const save = SaveManager.load();
    this.label.setText(save.musicEnabled ? '🔊' : '🔇');
  }
}
