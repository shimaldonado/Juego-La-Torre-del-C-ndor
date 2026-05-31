import Phaser from 'phaser';
import { addScreenBackground, addTitle, makeButton } from './uiHelpers.js';
import { LeaderboardManager } from '../managers/LeaderboardManager.js';

export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }

  init(data) { this.dataResult = data || {}; }

  create() {
    const won = Boolean(this.dataResult.won);
    addScreenBackground(this, won ? 'fondo_boss' : 'fondo_nivel1');
    addTitle(this, won ? '¡VICTORIA ANDINA!' : 'FIN DE LA PARTIDA', 90);

    const score = this.dataResult.score || 0;
    const level = this.dataResult.level || 1;
    this.add.text(640, 215, `Puntaje final: ${score}\nNivel alcanzado: ${level}`, {
      fontSize: '30px', color: '#fff3bf', align: 'center', stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5);

    this.status = this.add.text(640, 330, 'Guardando puntaje local y publicando al leaderboard online...', {
      fontSize: '20px', color: '#c7f9ff', align: 'center', wordWrap: { width: 740 },
    }).setOrigin(0.5);
    LeaderboardManager.publishScore(this.dataResult.characterName || 'Jugador', score, level).then((online) => {
      this.status.setText(online ? 'Puntaje publicado en el servicio online de prueba.' : 'Sin conexión: puntaje guardado localmente.');
    });

    makeButton(this, 640, 445, '🔁 REINTENTAR NIVEL', () => this.scene.start('GameScene', {
      ...this.dataResult,
      lives: 3,
      score: Math.max(0, score - 150),
    }), 360, 56);
    makeButton(this, 640, 520, '👤 CAMBIAR PERSONAJE', () => this.scene.start('CharacterSelectScene'), 360, 56);
    makeButton(this, 640, 595, '🏠 MENÚ PRINCIPAL', () => this.scene.start('MainMenuScene'), 360, 56);
  }
}
