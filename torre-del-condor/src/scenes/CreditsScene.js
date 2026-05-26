import Phaser from 'phaser';
import { addScreenBackground, addTitle, makeButton } from './uiHelpers.js';

export class CreditsScene extends Phaser.Scene {
  constructor() { super('CreditsScene'); }

  create() {
    addScreenBackground(this, 'fondo_boss');
    addTitle(this, 'CRÉDITOS', 85);
    this.add.text(640, 255, [
      'La Torre del Cóndor',
      'Videojuego 2D de aventura andina.',
      '',
      'Incluye: multiplayer local simple, leaderboard online, PWA instalable,',
      'IA de enemigos, generación procedural, efectos visuales tipo shader, minimapa,',
      'boss final, inventario, guardado múltiple, arquitectura ECS y API externa.',
      '',
      'Controles: P1 A/D/W/S/ESPACIO · P2 Flechas/ENTER · Pausa ESC/P.'
    ].join('\n'), {
      fontSize: '23px', color: '#fff3bf', align: 'center', lineSpacing: 8, stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);
    makeButton(this, 640, 610, '← VOLVER', () => this.scene.start('MainMenuScene'), 280, 52);
  }
}
