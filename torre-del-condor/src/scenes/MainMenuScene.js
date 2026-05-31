import Phaser from 'phaser';
import { addScreenBackground, addTitle, makeButton } from './uiHelpers.js';
import { SaveManager } from '../managers/SaveManager.js';
import { LeaderboardManager } from '../managers/LeaderboardManager.js';
import { ExternalApiManager } from '../managers/ExternalApiManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { COLORS } from '../config/constants.js';

export class MainMenuScene extends Phaser.Scene {
  constructor() { super('MainMenuScene'); }

  create() {
    AudioManager.music(this, 'music_level');
    addScreenBackground(this, 'fondo_nivel1');
    addTitle(this, 'LA TORRE DEL CÓNDOR', 78);

    const condor = this.add.sprite(160, 150, 'condor_volar').play('condor_fly').setScale(0.9).setTint(0xffe6a7);
    this.tweens.add({ targets: condor, x: 1120, y: 110, duration: 5500, repeat: -1, yoyo: true, ease: 'Sine.easeInOut' });

    this.add.text(640, 148, 'Aventura 2D andina · PWA · minimapa · boss final · guardado múltiple', {
      fontSize: '22px', color: '#fff3bf', align: 'center', stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5);

    makeButton(this, 640, 245, '▶ JUGAR', () => this.scene.start('CharacterSelectScene'));
    makeButton(this, 640, 315, '🗺 SELECCIONAR NIVEL', () => this.scene.start('LevelSelectScene'));
    makeButton(this, 640, 385, '💾 CARGAR PARTIDA', () => this.showSaves());
    makeButton(this, 640, 455, '🏆 LEADERBOARD ONLINE', () => this.showLeaderboard());
    makeButton(this, 640, 525, '⚙ OPCIONES', () => this.scene.start('SettingsScene'));
    makeButton(this, 640, 595, '📜 CRÉDITOS', () => this.scene.start('CreditsScene'));

    this.infoPanel = this.add.container(980, 355).setVisible(false);
    const panel = this.add.rectangle(0, 0, 420, 470, 0x0f172a, 0.88).setStrokeStyle(3, COLORS.gold);
    this.panelTitle = this.add.text(0, -205, '', { fontSize: '28px', color: '#ffcc5c', fontStyle: 'bold' }).setOrigin(0.5);
    this.panelBody = this.add.text(-180, -160, '', { fontSize: '18px', color: '#fff3bf', wordWrap: { width: 360 }, lineSpacing: 8 });
    this.infoPanel.add([panel, this.panelTitle, this.panelBody]);

    this.tipText = this.add.text(640, 690, 'Conectando con API externa...', { fontSize: '18px', color: '#c7f9ff' }).setOrigin(0.5);
    ExternalApiManager.getDailyTip().then((tip) => this.tipText?.setText(tip));
  }

  showSaves() {
    const slots = SaveManager.getSlots();
    this.infoPanel.setVisible(true);
    this.panelTitle.setText('Ranuras de guardado');
    const lines = [1, 2, 3].map((slot) => {
      const save = slots[slot];
      if (!save) return `Ranura ${slot}: vacía`;
      return `Ranura ${slot}: Nivel ${save.level} · ${save.characterName || 'Auki'} · ${save.score} pts`;
    });
    this.panelBody.setText(`${lines.join('\n')}\n\nTeclas: 1, 2 o 3 para cargar.\nESC para cerrar.`);
    this.input.keyboard.once('keydown-ONE', () => this.loadSlot(1));
    this.input.keyboard.once('keydown-TWO', () => this.loadSlot(2));
    this.input.keyboard.once('keydown-THREE', () => this.loadSlot(3));
    this.input.keyboard.once('keydown-ESC', () => this.infoPanel.setVisible(false));
  }

  loadSlot(slot) {
    const save = SaveManager.load(slot);
    if (!save) {
      this.panelBody.setText(`La ranura ${slot} está vacía.\n\nCrea una partida y guarda desde pausa.`);
      return;
    }
    this.scene.start('GameScene', { ...save, fromSave: true });
  }

  async showLeaderboard() {
    this.infoPanel.setVisible(true);
    this.panelTitle.setText('Leaderboard');
    this.panelBody.setText('Cargando puntajes online...');
    const online = await LeaderboardManager.getOnlineScores();
    const local = LeaderboardManager.getLocalScores();
    const all = [...local, ...online].sort((a, b) => b.score - a.score).slice(0, 10);
    const body = all.map((s, i) => `${i + 1}. ${s.name} — ${s.score} pts ${s.online ? '(online)' : '(local)'}`).join('\n');
    this.panelBody.setText(`${body || 'Aún no hay puntajes.'}\n\nESC para cerrar.`);
    this.input.keyboard.once('keydown-ESC', () => this.infoPanel.setVisible(false));
  }
}
