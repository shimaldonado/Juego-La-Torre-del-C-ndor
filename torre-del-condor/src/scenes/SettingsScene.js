import Phaser from 'phaser';
import { addScreenBackground, addTitle, makeButton } from './uiHelpers.js';
import { SaveManager } from '../managers/SaveManager.js';
import { AudioManager } from '../managers/AudioManager.js';

export class SettingsScene extends Phaser.Scene {
  constructor() { super('SettingsScene'); }

  create() {
    addScreenBackground(this, 'fondo_nivel1');
    addTitle(this, 'OPCIONES', 90);
    this.settings = SaveManager.getSettings();
    this.status = this.add.text(640, 205, this.getStatus(), { fontSize: '24px', color: '#fff3bf', align: 'center' }).setOrigin(0.5);
    makeButton(this, 640, 300, '🔊 ACTIVAR / SILENCIAR', () => {
      AudioManager.toggleMute(this);
      this.settings = SaveManager.getSettings();
      this.status.setText(this.getStatus());
    }, 380, 56);
    makeButton(this, 640, 375, '❔ MOSTRAR / OCULTAR AYUDA', () => {
      SaveManager.setSettings({ showHelp: !SaveManager.getSettings().showHelp });
      this.settings = SaveManager.getSettings();
      this.status.setText(this.getStatus());
    }, 380, 56);
    makeButton(this, 640, 530, '← VOLVER', () => this.scene.start('MainMenuScene'), 280, 52);
  }

  getStatus() {
    return `Sonido: ${this.settings.muted ? 'Silenciado' : 'Activado'}\nAyuda: ${this.settings.showHelp ? 'Visible' : 'Oculta'}`;
  }
}
