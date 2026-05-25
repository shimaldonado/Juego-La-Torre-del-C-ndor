import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/constants.js';

const asset = (path) => new URL(path, import.meta.url).href;

const heroIdleUrl = asset('../assets/images/personajes/heroe_idle.png');
const heroRunUrl = asset('../assets/images/personajes/heroe_correr_sheet.png');
const heroJumpUrl = asset('../assets/images/personajes/heroe_salto.png');
const heroFallUrl = asset('../assets/images/personajes/heroe_caida.png');
const heroHitUrl = asset('../assets/images/personajes/heroe_golpe.png');
const heroDeathUrl = asset('../assets/images/personajes/heroe_muerte_sheet.png');

const golemWalkUrl = asset('../assets/images/enemigos/guardian_caminar_sheet.png');
const golemAttackUrl = asset('../assets/images/enemigos/guardian_ataque_sheet.png');
const golemHitUrl = asset('../assets/images/enemigos/guardian_golpe.png');
const batFlyUrl = asset('../assets/images/enemigos/murcielago_volar_sheet.png');
const condorFlyUrl = asset('../assets/images/enemigos/condor_volar_sheet.png');
const condorAttackUrl = asset('../assets/images/enemigos/condor_ataque_sheet.png');
const bossIdleUrl = asset('../assets/images/enemigos/kunturax_idle_sheet.png');
const bossAttackUrl = asset('../assets/images/enemigos/kunturax_ataque_sheet.png');
const bossHitUrl = asset('../assets/images/enemigos/kunturax_golpe.png');
const bossDeathUrl = asset('../assets/images/enemigos/kunturax_muerte_sheet.png');

const bg1Url = asset('../assets/images/fondos/fondo_nivel1.png');
const bg2Url = asset('../assets/images/fondos/fondo_nivel2.png');
const bg3Url = asset('../assets/images/fondos/fondo_nivel3.png');
const bgBossUrl = asset('../assets/images/fondos/fondo_boss.png');

const featherUrl = asset('../assets/images/decoracion/pluma_dorada.png');
const crystalUrl = asset('../assets/images/decoracion/cristal_andino.png');
const torchUrl = asset('../assets/images/decoracion/antorcha.png');
const statueUrl = asset('../assets/images/decoracion/estatua_condor.png');
const grassUrl = asset('../assets/images/decoracion/pasto_andino.png');
const spikesUrl = asset('../assets/images/decoracion/pinchos_piedra.png');
const doorUrl = asset('../assets/images/decoracion/puerta_torre.png');
const rockUrl = asset('../assets/images/decoracion/roca.png');
const symbolUrl = asset('../assets/images/decoracion/simbolo_condor.png');

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.image('hero-idle', heroIdleUrl);
    this.load.spritesheet('hero-run', heroRunUrl, { frameWidth: 150, frameHeight: 150 });
    this.load.spritesheet('hero-jump', heroJumpUrl, { frameWidth: 345, frameHeight: 752 });
    this.load.spritesheet('hero-fall', heroFallUrl, { frameWidth: 345, frameHeight: 752 });
    this.load.spritesheet('hero-hit', heroHitUrl, { frameWidth: 345, frameHeight: 752 });
    this.load.spritesheet('hero-death', heroDeathUrl, { frameWidth: 460, frameHeight: 376 });

    this.load.spritesheet('enemy-golem', golemWalkUrl, { frameWidth: 345, frameHeight: 752 });
    this.load.spritesheet('enemy-golem-attack', golemAttackUrl, { frameWidth: 345, frameHeight: 752 });
    this.load.spritesheet('enemy-golem-hit', golemHitUrl, { frameWidth: 345, frameHeight: 752 });
    this.load.spritesheet('enemy-bat', batFlyUrl, { frameWidth: 345, frameHeight: 752 });
    this.load.spritesheet('enemy-condor', condorFlyUrl, { frameWidth: 345, frameHeight: 752 });
    this.load.spritesheet('enemy-condor-attack', condorAttackUrl, { frameWidth: 345, frameHeight: 752 });
    this.load.spritesheet('boss-kunturax', bossIdleUrl, { frameWidth: 345, frameHeight: 752 });
    this.load.spritesheet('boss-kunturax-attack', bossAttackUrl, { frameWidth: 345, frameHeight: 752 });
    this.load.spritesheet('boss-kunturax-hit', bossHitUrl, { frameWidth: 345, frameHeight: 752 });
    this.load.spritesheet('boss-kunturax-death', bossDeathUrl, { frameWidth: 345, frameHeight: 752 });

    this.load.image('bg-level1', bg1Url);
    this.load.image('bg-level2', bg2Url);
    this.load.image('bg-level3', bg3Url);
    this.load.image('bg-boss', bgBossUrl);

    this.load.image('feather', featherUrl);
    this.load.image('crystal', crystalUrl);
    this.load.image('fire', torchUrl);
    this.load.image('checkpoint', statueUrl);
    this.load.image('portal', doorUrl);
    this.load.image('spikes', spikesUrl);
    this.load.image('deco-rock', rockUrl);
    this.load.image('deco-grass', grassUrl);
    this.load.image('deco-symbol', symbolUrl);
    this.load.image('deco-torch', torchUrl);
  }

  create() {
    this.createTextures();
    this.createAnimations();
    this.scene.start('MainMenuScene');
  }

  createAnimations() {
    const makeAnim = (key, texture, start, end, frameRate = 8, repeat = -1) => {
      if (this.textures.exists(texture) && !this.anims.exists(key)) {
        this.anims.create({
          key,
          frames: this.anims.generateFrameNumbers(texture, { start, end }),
          frameRate,
          repeat
        });
      }
    };

    makeAnim('hero-run-anim', 'hero-run', 0, 7, 10);
    makeAnim('hero-jump-anim', 'hero-jump', 0, 3, 8);
    makeAnim('hero-fall-anim', 'hero-fall', 0, 3, 8);
    makeAnim('hero-hit-anim', 'hero-hit', 0, 3, 9, 0);
    makeAnim('hero-death-anim', 'hero-death', 0, 5, 8, 0);

    makeAnim('enemy-golem-walk-anim', 'enemy-golem', 0, 3, 7);
    makeAnim('enemy-golem-attack-anim', 'enemy-golem-attack', 0, 3, 8);
    makeAnim('enemy-golem-hit-anim', 'enemy-golem-hit', 0, 3, 8, 0);
    makeAnim('enemy-bat-fly-anim', 'enemy-bat', 0, 3, 9);
    makeAnim('enemy-condor-fly-anim', 'enemy-condor', 0, 3, 7);
    makeAnim('enemy-condor-attack-anim', 'enemy-condor-attack', 0, 3, 8, 0);

    makeAnim('boss-idle-anim', 'boss-kunturax', 0, 3, 6);
    makeAnim('boss-attack-anim', 'boss-kunturax-attack', 0, 3, 8, 0);
    makeAnim('boss-hit-anim', 'boss-kunturax-hit', 0, 3, 8, 0);
    makeAnim('boss-death-anim', 'boss-kunturax-death', 0, 3, 6, 0);
  }

  createTextures() {
    const g = this.add.graphics();
    const generate = (key, width, height) => {
      if (!this.textures.exists(key)) g.generateTexture(key, width, height);
    };

    const makePlayer = (key, bodyColor, ponchoColor) => {
      g.clear();
      g.fillStyle(0x2b1d0e, 1);
      g.fillCircle(24, 13, 10);
      g.fillStyle(0xf0c28a, 1);
      g.fillCircle(24, 18, 9);
      g.fillStyle(bodyColor, 1);
      g.fillRoundedRect(10, 27, 28, 27, 7);
      g.fillStyle(ponchoColor, 1);
      g.fillTriangle(24, 27, 8, 54, 40, 54);
      g.fillStyle(0x111827, 1);
      g.fillRect(14, 54, 8, 10);
      g.fillRect(28, 54, 8, 10);
      generate(key, 48, 64);
    };

    makePlayer('player-inti', 0x1d9a8a, 0xffc857);
    makePlayer('player-quilla', 0x6c63ff, 0xff7ad9);
    makePlayer('player-rumi', 0xa16207, 0x63d471);

    g.clear();
    g.fillStyle(0x5f4a33, 1);
    g.fillRoundedRect(0, 0, 96, 22, 5);
    g.fillStyle(0x8a7555, 1);
    for (let i = 0; i < 96; i += 18) g.fillRect(i, 0, 10, 22);
    g.lineStyle(3, 0x2b2117, 1);
    g.strokeRoundedRect(1, 1, 94, 20, 5);
    generate('platform', 96, 22);

    g.clear();
    g.fillStyle(0x374151, 1);
    g.fillRoundedRect(0, 0, 96, 22, 5);
    g.fillStyle(0x6b7280, 1);
    for (let i = 0; i < 96; i += 24) g.fillRect(i, 3, 16, 6);
    g.lineStyle(3, 0xfacc15, 0.42);
    g.strokeRoundedRect(2, 2, 92, 18, 5);
    generate('platform-stone', 96, 22);

    g.clear();
    g.fillStyle(0xff784f, 1);
    g.fillCircle(18, 18, 18);
    g.fillStyle(0x7c2d12, 1);
    g.fillCircle(18, 18, 13);
    g.lineStyle(4, 0xffc857, 1);
    g.strokeCircle(18, 18, 15);
    generate('barrel', 36, 36);

    g.clear();
    g.fillStyle(0xffd166, 1);
    g.fillCircle(14, 14, 13);
    g.fillStyle(0xfff4b8, 1);
    g.fillCircle(10, 9, 4);
    generate('coin', 28, 28);

    g.clear();
    g.fillStyle(0xd6a35d, 1);
    g.fillRect(0, 0, 14, 96);
    g.fillRect(46, 0, 14, 96);
    g.fillStyle(0xfacc15, 1);
    for (let y = 10; y < 94; y += 18) g.fillRect(0, y, 60, 8);
    generate('ladder', 60, 96);

    g.clear();
    g.fillStyle(0xef4444, 1);
    for (let x = 0; x < 84; x += 14) g.fillTriangle(x, 36, x + 7, 0, x + 14, 36);
    generate('spike-long', 84, 40);

    g.clear();
    g.fillStyle(0xff4d6d, 1);
    g.fillCircle(12, 12, 12);
    g.fillCircle(28, 12, 12);
    g.fillTriangle(0, 18, 40, 18, 20, 42);
    generate('heart', 40, 42);

    g.clear();
    g.fillStyle(0xe63946, 1);
    g.fillRoundedRect(0, 0, 50, 36, 8);
    g.fillStyle(0xffc857, 1);
    g.fillRect(21, -12, 8, 12);
    generate('lever-off', 50, 36);

    g.clear();
    g.fillStyle(0x63d471, 1);
    g.fillRoundedRect(0, 0, 50, 36, 8);
    g.fillStyle(0xffc857, 1);
    g.fillRect(32, -12, 8, 12);
    generate('lever-on', 50, 36);

    g.clear();
    g.fillStyle(0x25324d, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.fillStyle(0x1a2540, 1);
    for (let x = 0; x < GAME_WIDTH; x += 160) g.fillTriangle(x, GAME_HEIGHT, x + 80, 280, x + 180, GAME_HEIGHT);
    g.fillStyle(0x7c4a19, 1);
    g.fillRoundedRect(650, 210, 190, 250, 18);
    g.fillStyle(0xffc857, 0.72);
    g.fillTriangle(745, 145, 610, 260, 880, 260);
    generate('menu-bg', GAME_WIDTH, GAME_HEIGHT);

    g.destroy();
  }
}
