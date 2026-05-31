import Phaser from 'phaser';
import { COLORS } from '../config/constants.js';

export class PreloadScene extends Phaser.Scene {
  constructor() { super('PreloadScene'); }

  preload() {
    this.createLoadingUI();

    // Capturar errores de carga para no bloquear
    this.load.on('loaderror', (fileObj) => {
      console.warn(`[PreloadScene] No se pudo cargar: ${fileObj.key} (${fileObj.url})`);
    });

    const base = '/assets/images';
    this.load.image('fondo_nivel1', `${base}/fondos/fondo_nivel1.png`);
    this.load.image('fondo_nivel2', `${base}/fondos/fondo_nivel2.png`);
    this.load.image('fondo_nivel3', `${base}/fondos/fondo_nivel3.png`);
    this.load.image('fondo_boss',   `${base}/fondos/fondo_boss.png`);

    this.load.image('heroe_idle', `${base}/personajes/heroe_idle.png`);
    // heroe_correr: 8 frames (0-7)
    this.load.spritesheet('heroe_correr', `${base}/personajes/heroe_correr_sheet.png`, { frameWidth: 150, frameHeight: 160 });
    // heroe_salto: 4 frames (0-3)
    this.load.spritesheet('heroe_salto', `${base}/personajes/heroe_salto_sheet.png`, { frameWidth: 150, frameHeight: 160 });
    // heroe_caida: 4 frames (0-3)
    this.load.spritesheet('heroe_caida', `${base}/personajes/heroe_caida_sheet.png`, { frameWidth: 150, frameHeight: 160 });
    // heroe_golpe: 4 frames (0-3)
    this.load.spritesheet('heroe_golpe', `${base}/personajes/heroe_golpe_sheet.png`, { frameWidth: 150, frameHeight: 160 });
    // heroe_muerte: 5 frames (0-4)
    this.load.spritesheet('heroe_muerte', `${base}/personajes/heroe_muerte_sheet.png`, { frameWidth: 150, frameHeight: 160 });

    // murcielago_volar: 6 frames (0-5)
    this.load.spritesheet('murcielago_volar', `${base}/enemigos/murcielago_volar_sheet.png`, { frameWidth: 150, frameHeight: 110 });
    // condor_volar: 6 frames (0-5)
    this.load.spritesheet('condor_volar',    `${base}/enemigos/condor_volar_sheet.png`,    { frameWidth: 190, frameHeight: 130 });
    // condor_ataque: 3 frames (0-2)
    this.load.spritesheet('condor_ataque',   `${base}/enemigos/condor_ataque_sheet.png`,   { frameWidth: 190, frameHeight: 130 });
    // guardian_caminar: 6 frames (0-5)
    this.load.spritesheet('guardian_caminar', `${base}/enemigos/guardian_caminar_sheet.png`, { frameWidth: 155, frameHeight: 160 });
    // guardian_ataque: 4 frames (0-3)
    this.load.spritesheet('guardian_ataque',  `${base}/enemigos/guardian_ataque_sheet.png`,  { frameWidth: 155, frameHeight: 160 });
    // kunturax: idle 4f, ataque 6f, muerte 6f
    this.load.spritesheet('kunturax_idle',    `${base}/enemigos/kunturax_idle_sheet.png`,    { frameWidth: 230, frameHeight: 230 });
    this.load.spritesheet('kunturax_ataque',  `${base}/enemigos/kunturax_ataque_sheet.png`,  { frameWidth: 230, frameHeight: 230 });
    this.load.spritesheet('kunturax_muerte',  `${base}/enemigos/kunturax_muerte_sheet.png`,  { frameWidth: 230, frameHeight: 230 });

    this.load.image('pluma_dorada',     `${base}/decoracion/pluma_dorada.png`);
    this.load.image('cristal_andino',   `${base}/decoracion/cristal_andino.png`);
    this.load.image('antorcha',         `${base}/decoracion/antorcha.png`);
    this.load.image('estatua_condor',   `${base}/decoracion/estatua_condor.png`);
    this.load.image('roca',             `${base}/decoracion/roca.png`);
    this.load.image('pasto_andino',     `${base}/decoracion/pasto_andino.png`);
    this.load.image('pinchos_piedra',   `${base}/decoracion/pinchos_piedra.png`);
    this.load.image('puerta_torre',     `${base}/decoracion/puerta_torre.png`);
    this.load.image('simbolo_condor',   `${base}/decoracion/simbolo_condor.png`);
    this.load.image('tutorial_escalera',`${base}/decoracion/tutorial_escalera.png`);

    const audio = '/assets/audio';
    this.load.audio('sfx_jump',       `${audio}/salto.mp3`);
    this.load.audio('sfx_coin',       `${audio}/moneda.mp3`);
    this.load.audio('sfx_hit',        `${audio}/golpe.mp3`);
    this.load.audio('sfx_checkpoint', `${audio}/checkpoint.mp3`);
    this.load.audio('sfx_victory',    `${audio}/victoria.mp3`);
    this.load.audio('music_level',    `${audio}/musica_nivel1.mp3`);
    this.load.audio('music_boss',     `${audio}/musica_boss.mp3`);
  }

  create() {
    this.createAnimations();
    this.scene.start('MainMenuScene');
  }

  createLoadingUI() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, COLORS.night);
    this.add.text(width / 2, height / 2 - 90, 'LA TORRE DEL CÓNDOR', {
      fontSize: '48px',
      fontFamily: 'Georgia, serif',
      color: '#ffcc5c',
      stroke: '#120718',
      strokeThickness: 7,
    }).setOrigin(0.5);
    const box = this.add.rectangle(width / 2, height / 2, 560, 24, 0x0f172a).setStrokeStyle(3, COLORS.gold);
    const bar = this.add.rectangle(width / 2 - 275, height / 2, 0, 14, COLORS.gold).setOrigin(0, 0.5);
    const label = this.add.text(width / 2, height / 2 + 42, 'Cargando assets...', {
      fontSize: '22px', color: '#fff3bf',
    }).setOrigin(0.5);

    this.load.on('progress', (value) => {
      bar.width = 550 * value;
      label.setText(`Cargando assets... ${Math.round(value * 100)}%`);
    });
    this.load.on('complete', () => {
      box.setStrokeStyle(3, 0x22c55e);
      bar.width = 550;
      label.setText('¡Listo!');
    });
  }

  createAnimations() {
    const make = (key, sheet, start, end, frameRate = 8, repeat = -1) => {
      if (this.anims.exists(key)) return;
      // Solo crear si el spritesheet fue cargado
      if (!this.textures.exists(sheet)) {
        console.warn(`[Anims] Spritesheet no cargado: ${sheet}, omitiendo animación ${key}`);
        return;
      }
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(sheet, { start, end }),
        frameRate,
        repeat,
      });
    };

    // Personaje (frames corregidos según spritesheets generados)
    make('hero_run',    'heroe_correr',    0, 7, 12);   // 8 frames
    make('hero_jump',   'heroe_salto',     0, 3,  8);   // 4 frames
    make('hero_fall',   'heroe_caida',     0, 3,  7);   // 4 frames
    make('hero_hit',    'heroe_golpe',     0, 3, 10, 0); // 4 frames
    make('hero_death',  'heroe_muerte',    0, 4,  7, 0); // 5 frames

    // Enemigos (frames corregidos)
    make('bat_fly',        'murcielago_volar',  0, 5,  9);   // 6 frames
    make('condor_fly',     'condor_volar',      0, 5,  8);   // 6 frames
    make('condor_attack',  'condor_ataque',     0, 2,  9);   // 3 frames
    make('guardian_walk',  'guardian_caminar',  0, 5,  7);   // 6 frames
    make('guardian_attack','guardian_ataque',   0, 3,  8);   // 4 frames
    make('boss_idle',      'kunturax_idle',     0, 3,  6);   // 4 frames
    make('boss_attack',    'kunturax_ataque',   0, 5,  7);   // 6 frames
    make('boss_death',     'kunturax_muerte',   0, 5,  5, 0); // 6 frames
  }
}
