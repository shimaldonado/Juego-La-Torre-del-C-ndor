import Phaser from 'phaser';
import { addScreenBackground, addTitle, makeButton } from '../ui/uiHelpers.js';
import { ExternalApiManager } from '../managers/ExternalApiManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { COLORS, STORY } from '../config/constants.js';
import { StorageManager } from '../managers/StorageManager.js';

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


    const progress = StorageManager.getProgress();

    this.add.text(640, 188,
      `High Score: ${progress.highScore}   ·   Nivel máximo: ${progress.maxLevelReached}`,
      {
        fontSize: '19px',
        color: '#67e8f9',
        align: 'center',
        stroke: '#000',
        strokeThickness: 3,
      }
    ).setOrigin(0.5);

    this.tipText = this.add.text(640, 675, 'Conectando con API externa...', {
      fontSize: '17px',
      color: '#c7f9ff',
      align: 'center',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    makeButton(this, 640, 250, '▶ JUGAR', () => this.scene.start('CharacterSelectScene'));
    makeButton(this, 640, 320, '📖 HISTORIA', () => this.showStory());
    makeButton(this, 640, 390, '🗺 SELECCIONAR NIVEL', () => this.scene.start('LevelSelectScene'));
    makeButton(this, 640, 460, '⚙ OPCIONES', () => this.scene.start('SettingsScene'));
    makeButton(this, 640, 530, '📜 CRÉDITOS', () => this.scene.start('CreditsScene'));

    this.installButton = makeButton(this, 640, 600, '⬇ INSTALAR APP', () => this.installPWA(), 300, 50);
    this.installButton.setVisible(Boolean(window.__torreCondorInstallPrompt));

    window.addEventListener('torre-install-ready', () => {
      this.installButton?.setVisible(true);
    }, { once: true });

    const panelW = 470;
    const panelH = 540;

    this.infoPanel = this.add.container(985, 405).setVisible(false);

    const panel = this.add.rectangle(0, 0, panelW, panelH, 0x0f172a, 0.90)
      .setStrokeStyle(3, COLORS.gold);

    this.panelTitle = this.add.text(0, -panelH / 2 + 42, '', {
      fontSize: '28px',
      color: '#ffcc5c',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.panelBody = this.add.text(-panelW / 2 + 28, -panelH / 2 + 85, '', {
      fontSize: '16px',
      color: '#fff3bf',
      align: 'left',
      wordWrap: {
        width: panelW - 56,
        useAdvancedWrap: true,
      },
      lineSpacing: 7,
      stroke: '#000',
      strokeThickness: 2,
    }).setOrigin(0, 0);

    this.infoPanel.add([panel, this.panelTitle, this.panelBody]);

    ExternalApiManager.getDailyTip().then((tip) => this.tipText?.setText(tip));
  }

  showStory() {
    this.infoPanel.setVisible(!this.infoPanel.visible);
    if (!this.infoPanel.visible) return;

    this.panelTitle.setText('Historia');
    this.panelBody.setText(`${STORY.premise.join('\n\n')}\n\nPulsa JUGAR para iniciar la ascensión.\nESC para cerrar.`);

    this.input.keyboard.once('keydown-ESC', () => {
      this.infoPanel.setVisible(false);
    });
  }


  async installPWA() {
    const prompt = window.__torreCondorInstallPrompt;

    if (!prompt) {
      this.tipText?.setText('La instalación PWA aparece en localhost o en una página HTTPS.');
      return;
    }

    prompt.prompt();

    try {
      await prompt.userChoice;
    } catch {
      // El usuario puede cancelar la instalación.
    }

    window.__torreCondorInstallPrompt = null;
    this.installButton?.setVisible(false);
  }

}
