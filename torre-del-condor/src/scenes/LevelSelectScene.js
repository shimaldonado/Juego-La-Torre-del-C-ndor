import Phaser from 'phaser';
import { GAME_WIDTH } from '../config/constants.js';
import { SaveManager } from '../managers/SaveManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { addBackground, addPanel, addSubtitle, addTitle, createButton } from '../utils/ui.js';

const LEVELS = [
  { number: 1, title: 'Nivel 1: Entrada de la Torre', scene: 'Level1Scene', description: 'Montañas, ruinas y primeros guardianes de piedra.' },
  { number: 2, title: 'Nivel 2: Interior de la Torre', scene: 'Level2Scene', description: 'Piedra antigua, antorchas, trampas y murciélagos.' },
  { number: 3, title: 'Nivel 3: Cima del Cóndor', scene: 'Level3Scene', description: 'Altar ancestral, cielo dramático y enemigos voladores.' },
  { number: 4, title: 'Jefe final: Kunturax', scene: 'BossScene', description: 'Activa las palancas sagradas y derrota al espíritu oscuro.' }
];

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectScene');
  }

  create() {
    addBackground(this);
    addTitle(this, 'SELECCIÓN DE NIVEL', 70, 42);
    addSubtitle(this, 'Los niveles se desbloquean automáticamente con localStorage.', 118, 18);

    const save = SaveManager.load();
    this.add.text(24, 18, `Progreso guardado: ${this.getProgressLabel(save.unlockedLevel)}`, {
      fontFamily: 'Arial Black, Arial',
      fontSize: '18px',
      color: '#fff3c4'
    });

    LEVELS.forEach((level, index) => {
      const y = 185 + index * 72;
      const unlocked = save.unlockedLevel >= level.number;
      addPanel(this, GAME_WIDTH / 2, y, 720, 56, unlocked ? 0x111827 : 0x1f2937, unlocked ? 0.86 : 0.62);

      this.add.text(150, y - 11, unlocked ? level.title : `🔒 ${level.title}`, {
        fontFamily: 'Arial Black, Arial',
        fontSize: '18px',
        color: unlocked ? '#fff3c4' : '#9ca3af'
      });
      this.add.text(150, y + 13, level.description, {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: unlocked ? '#dfe7ff' : '#9ca3af'
      });

      createButton(this, 710, y, unlocked ? 'JUGAR' : 'BLOQUEADO', () => {
        if (!unlocked) {
          AudioManager.playTone(160, 0.08, 'square', 0.16);
          return;
        }
        this.startLevel(level.scene);
      }, 190);
    });

    createButton(this, GAME_WIDTH / 2, 500, 'VOLVER AL MENÚ', () => this.scene.start('MainMenuScene'), 300);
  }

  getProgressLabel(unlockedLevel) {
    if (unlockedLevel >= 4) return 'jefe final desbloqueado';
    return `nivel ${unlockedLevel} desbloqueado`;
  }

  startLevel(sceneKey) {
    this.registry.set('score', 0);
    this.registry.set('lives', 3);
    AudioManager.unlock();
    AudioManager.startMusic();
    this.scene.start(sceneKey);
  }
}
