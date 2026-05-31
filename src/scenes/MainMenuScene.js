import Phaser from 'phaser';
import { addScreenBackground, addTitle, makeButton } from './uiHelpers.js';
import { ExternalApiManager } from '../managers/ExternalApiManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { COLORS, STORY } from '../config/constants.js';

export class MainMenuScene extends Phaser.Scene {
  constructor() { super('MainMenuScene'); }

  create() {
    AudioManager.music(this, 'music_level');
    addScreenBackground(this, 'fondo_nivel1');
    addTitle(this, 'LA TORRE DEL CÓNDOR', 78);

    const condor = this.add.sprite(160, 150, 'condor_volar').play('condor_fly').setScale(0.9).setTint(0xffe6a7);
    this.tweens.add({ targets: condor, x: 1120, y: 110, duration: 5500, repeat: -1, yoyo: true, ease: 'Sine.easeInOut' });

    this.add.text(640, 148, 'Aventura 2D andina · historia · minimapa · boss final', {
      fontSize: '22px', color: '#fff3bf', align: 'center', stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5);

    makeButton(this, 640, 250, '▶ JUGAR', () => this.scene.start('CharacterSelectScene'));
    makeButton(this, 640, 320, '📖 HISTORIA', () => this.showStory());
    makeButton(this, 640, 390, '🗺 SELECCIONAR NIVEL', () => this.scene.start('LevelSelectScene'));
    makeButton(this, 640, 460, '⚙ OPCIONES', () => this.scene.start('SettingsScene'));
    makeButton(this, 640, 530, '📜 CRÉDITOS', () => this.scene.start('CreditsScene'));

    this.infoPanel = this.add.container(980, 355).setVisible(false);
    const panel = this.add.rectangle(0, 0, 420, 470, 0x0f172a, 0.88).setStrokeStyle(3, COLORS.gold);
    this.panelTitle = this.add.text(0, -205, '', { fontSize: '28px', color: '#ffcc5c', fontStyle: 'bold' }).setOrigin(0.5);
    this.panelBody = this.add.text(-180, -160, '', { fontSize: '18px', color: '#fff3bf', wordWrap: { width: 360 }, lineSpacing: 8 });
    this.infoPanel.add([panel, this.panelTitle, this.panelBody]);


    ExternalApiManager.getDailyTip().then((tip) => this.tipText?.setText(tip));
  }

  showStory() {
    this.infoPanel.setVisible(true);
    this.panelTitle.setText('Historia');
    this.panelBody.setText(`${STORY.premise.join('\n\n')}\n\nPulsa JUGAR para iniciar la ascensión.\nESC para cerrar.`);
    this.input.keyboard.once('keydown-ESC', () => this.infoPanel.setVisible(false));
  }
}
