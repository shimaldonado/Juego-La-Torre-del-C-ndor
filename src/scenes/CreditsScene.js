import Phaser from 'phaser';
import { addScreenBackground, addTitle, makeButton } from '../ui/uiHelpers.js';

export class CreditsScene extends Phaser.Scene {
  constructor() { super('CreditsScene'); }

  create() {
    addScreenBackground(this, 'fondo_boss');
    addTitle(this, 'CRÉDITOS', 85);
    this.add.text(640, 255, [
      'La Torre del Cóndor',
      'Videojuego 2D de aventura andina.',
      'Historia: tres caminantes suben una torre sellada para liberar una llama sagrada.',
      '',
      'Incluye: multiplayer local simple, historia inicial, PWA instalable,',
      'IA de enemigos, generación procedural, efectos visuales tipo shader, minimapa,',
      'boss final, inventario, arquitectura ECS y API externa.',
      '',
      'Controles: P1 A/D/W/S/ESPACIO · P2 Flechas/ENTER · Pausa ESC/P.'
    ].join('\n'), {
      fontSize: '23px', color: '#fff3bf', align: 'center', lineSpacing: 8, stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);
    makeButton(this, 640, 610, '← VOLVER', () => this.scene.start('MainMenuScene'), 280, 52);
  }
}
