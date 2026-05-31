import Phaser from 'phaser';
import { addScreenBackground, addTitle, makeButton } from '../ui/uiHelpers.js';
import { STORY } from '../config/constants.js';
import { StorageManager } from '../managers/StorageManager.js';


export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }

  create(data = {}) {
    
    addScreenBackground(this, data.won ? 'fondo_nivel3' : 'fondo_boss');

    const title = addTitle(this, data.won ? '¡TORRE LIBERADA!' : 'PARTIDA TERMINADA', 65);
    title.setFontSize('46px');

    const progress = StorageManager.saveRun({
      score: data.score || 0,
      level: data.level || 1,
      won: Boolean(data.won),
    });

    const players = Array.isArray(data.playersState) && data.playersState.length
      ? data.playersState
      : [{ id: 1, lives: data.lives || 0, feathers: data.feathers || 0, crystals: data.crystals || 0, plates: data.plates || 0 }];

    this.add.text(640, data.won ? 170 : 185,
      data.won ? STORY.victory : '',
      { fontSize: '20px', color: '#c7f9ff', align: 'center', wordWrap: { width: 820 }, stroke: '#000', strokeThickness: 3 }
    ).setOrigin(0.5);

    this.add.text(640, data.won ? 250 : 215,
      `${data.characterName || 'Auki'} · ${data.playerCount || 1} jugador${(data.playerCount || 1) === 2 ? 'es' : ''}\n` +
      `Puntaje final: ${data.score || 0}\n` +
      `High Score: ${progress.highScore}\n` +
      `Nivel máximo alcanzado: ${progress.maxLevelReached}\n` +
      players.map((p, idx) => `P${idx + 1}: ❤️${p.lives}  🪶${p.feathers}  💎${p.crystals}  🛡${p.plates}`).join('\n'),
      {
        fontSize: '21px',
        color: '#fff3bf',
        align: 'center',
        stroke: '#000',
        strokeThickness: 4,
        lineSpacing: 6,
      }
    ).setOrigin(0.5);

    const freshPlayers = [
      { id: 1, lives: 3, feathers: 0, crystals: 0, plates: 0, alive: true },
      { id: 2, lives: 3, feathers: 0, crystals: 0, plates: 0, alive: true },
    ];

    makeButton(this, 640, data.won ? 405 : 365, 'REINTENTAR NIVEL', () => this.scene.start('GameScene', {
      ...data,
      won: false,
      enemiesKilled: 0,
      playersState: freshPlayers,
      lives: 3,
      feathers: 0,
      crystals: 0,
      plates: 0,
    }), 360, 56);

    makeButton(this, 640, data.won ? 475 : 435, 'NUEVA PARTIDA', () => this.scene.start('CharacterSelectScene', {
      playerCount: data.playerCount || 1,
      characterId: data.characterId || 'auki',
    }), 360, 56);

    makeButton(this, 640, data.won ? 545 : 505, 'SELECCIONAR NIVEL', () => this.scene.start('LevelSelectScene', {
      playerCount: data.playerCount || 1,
    }), 360, 56);

    makeButton(this, 640, data.won ? 615 : 575, 'MENÚ PRINCIPAL', () => this.scene.start('MainMenuScene'), 360, 56);
  }
}
