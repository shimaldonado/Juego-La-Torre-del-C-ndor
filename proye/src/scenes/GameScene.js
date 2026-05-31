import Phaser from 'phaser';
import { CHARACTERS, COLORS, LEVELS, STORY } from '../config/constants.js';
import { SettingsManager } from '../managers/SettingsManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { EntityManager } from '../ecs/EntityManager.js';
import { Components } from '../ecs/components.js';
import { runPatrolAndAISystem } from '../ecs/systems.js';
import { StorageManager } from '../managers/StorageManager.js';


const LEVEL_PLANS = {
  1: {
    // Nivel 1 corregido: recorrido más largo, caminos planos, escaleras útiles,
    // más enemigos antes de la puerta y objetos alcanzables sobre cada plataforma.
    worldWidth: 4600,
    start: { x: 135, y: 560 },
    goal: { x: 4430, y: 558 },
    requiredKills: 5,
    platforms: [
      // Camino principal inferior: largo y casi continuo, con pequeños huecos para saltar.
      { x: 520, y: 650, w: 1000, h: 40 },
      { x: 1250, y: 650, w: 420, h: 40 },
      { x: 1830, y: 650, w: 720, h: 40 },
      { x: 2510, y: 650, w: 520, h: 40 },
      { x: 3150, y: 650, w: 760, h: 40 },
      { x: 3980, y: 650, w: 1040, h: 40 },

      // Caminos planos superiores para subir, recolectar y esquivar/atacar.
      { x: 740, y: 515, w: 620, h: 34 },
      { x: 1630, y: 515, w: 720, h: 34 },
      { x: 2660, y: 515, w: 720, h: 34 },
      { x: 3660, y: 515, w: 640, h: 34 },

      { x: 1210, y: 382, w: 580, h: 34 },
      { x: 2210, y: 382, w: 640, h: 34 },
      { x: 3310, y: 382, w: 720, h: 34 },
    ],
    ladders: [
      { x: 720, fromY: 630, toY: 498 },
      { x: 1370, fromY: 630, toY: 365 },
      { x: 2320, fromY: 630, toY: 365 },
      { x: 3450, fromY: 630, toY: 365 },
    ],
    enemies: [
      { type: 'guardian', x: 520, y: 560, minX: 250, maxX: 900 },
      { type: 'guardian', x: 1300, y: 560, minX: 1090, maxX: 1430 },
      { type: 'guardian', x: 1830, y: 560, minX: 1510, maxX: 2130 },
      { type: 'guardian', x: 2560, y: 560, minX: 2310, maxX: 2740 },
      { type: 'guardian', x: 3150, y: 560, minX: 2820, maxX: 3490 },
      { type: 'guardian', x: 3940, y: 560, minX: 3520, maxX: 4300 },
      { type: 'guardian', x: 4460, y: 560, minX: 4130, maxX: 4510 },
      { type: 'guardian', x: 1640, y: 425, minX: 1320, maxX: 1950 },
      { type: 'guardian', x: 2680, y: 425, minX: 2320, maxX: 2990 },
      { type: 'guardian', x: 3380, y: 292, minX: 2980, maxX: 3630 },
      { type: 'bat', x: 900, y: 445, minX: 520, maxX: 1020 },
      { type: 'bat', x: 3730, y: 445, minX: 3380, maxX: 3940 },
    ],
    collectibles: [
      // Camino inferior
      { type: 'feather', x: 300, y: 580 }, { type: 'crystal', x: 590, y: 580 },
      { type: 'feather', x: 1135, y: 580 }, { type: 'crystal', x: 1680, y: 580 },
      { type: 'feather', x: 2030, y: 580 }, { type: 'plate', x: 2485, y: 580 },
      { type: 'crystal', x: 3065, y: 580 }, { type: 'feather', x: 3600, y: 580 },
      { type: 'crystal', x: 4190, y: 580 },

      // Caminos medios y altos: todos alcanzables con escaleras.
      { type: 'crystal', x: 650, y: 450 }, { type: 'feather', x: 910, y: 450 },
      { type: 'feather', x: 1510, y: 450 }, { type: 'crystal', x: 1870, y: 450 },
      { type: 'plate', x: 2630, y: 450 }, { type: 'feather', x: 2880, y: 450 },
      { type: 'crystal', x: 3590, y: 450 }, { type: 'feather', x: 3850, y: 450 },
      { type: 'plate', x: 1130, y: 318 }, { type: 'crystal', x: 1390, y: 318 },
      { type: 'crystal', x: 2140, y: 318 }, { type: 'feather', x: 2370, y: 318 },
      { type: 'plate', x: 3210, y: 318 }, { type: 'crystal', x: 3570, y: 318 },
    ],
    hazards: [  ],
  },
  2: {
    worldWidth: 4900,
    start: { x: 135, y: 560 },
    goal: { x: 4720, y: 558 },
    requiredKills: 6,
    platforms: [
      { x: 500, y: 650, w: 960, h: 40 }, { x: 1280, y: 650, w: 500, h: 40 },
      { x: 1960, y: 650, w: 760, h: 40 }, { x: 2760, y: 650, w: 700, h: 40 },
      { x: 3590, y: 650, w: 820, h: 40 }, { x: 4480, y: 650, w: 760, h: 40 },
      { x: 820, y: 500, w: 670, h: 34 }, { x: 1850, y: 500, w: 720, h: 34 },
      { x: 2950, y: 500, w: 780, h: 34 }, { x: 4040, y: 500, w: 680, h: 34 },
      { x: 1420, y: 365, w: 630, h: 34 }, { x: 2550, y: 365, w: 700, h: 34 },
      { x: 3670, y: 365, w: 720, h: 34 },
    ],
    ladders: [
      { x: 710, fromY: 630, toY: 483 }, { x: 1440, fromY: 630, toY: 348 },
      { x: 2510, fromY: 630, toY: 348 }, { x: 3610, fromY: 630, toY: 348 },
      { x: 4250, fromY: 630, toY: 483 },
    ],
    enemies: [
      { type: 'guardian', x: 480, y: 560, minX: 230, maxX: 880 },
      { type: 'guardian', x: 1340, y: 560, minX: 1070, maxX: 1480 },
      { type: 'guardian', x: 1970, y: 560, minX: 1600, maxX: 2310 },
      { type: 'guardian', x: 2760, y: 560, minX: 2460, maxX: 3080 },
      { type: 'guardian', x: 3570, y: 560, minX: 3220, maxX: 3940 },
      { type: 'guardian', x: 4380, y: 560, minX: 4120, maxX: 4770 },
      { type: 'bat', x: 930, y: 430, minX: 540, maxX: 1120 },
      { type: 'bat', x: 1870, y: 430, minX: 1510, maxX: 2190 },
      { type: 'guardian', x: 2550, y: 292, minX: 2220, maxX: 2860 },
      { type: 'bat', x: 3650, y: 300, minX: 3340, maxX: 3980 },
      { type: 'guardian', x: 4040, y: 425, minX: 3720, maxX: 4330 },
    ],
    collectibles: [
      { type: 'feather', x: 280, y: 580 }, { type: 'crystal', x: 610, y: 580 },
      { type: 'feather', x: 1220, y: 580 }, { type: 'crystal', x: 1760, y: 580 },
      { type: 'feather', x: 2140, y: 580 }, { type: 'plate', x: 2680, y: 580 },
      { type: 'crystal', x: 3310, y: 580 }, { type: 'feather', x: 3830, y: 580 },
      { type: 'crystal', x: 4420, y: 580 }, { type: 'feather', x: 4680, y: 580 },
      { type: 'crystal', x: 760, y: 435 }, { type: 'feather', x: 980, y: 435 },
      { type: 'plate', x: 1420, y: 300 }, { type: 'crystal', x: 1690, y: 435 },
      { type: 'feather', x: 2010, y: 435 }, { type: 'crystal', x: 2520, y: 300 },
      { type: 'feather', x: 2800, y: 435 }, { type: 'plate', x: 3010, y: 435 },
      { type: 'crystal', x: 3600, y: 300 }, { type: 'feather', x: 3920, y: 435 },
    ],
    hazards: [ ],
  },
  3: {
    worldWidth: 5200,
    start: { x: 135, y: 560 },
    goal: { x: 5010, y: 558 },
    requiredKills: 7,
    platforms: [
      { x: 520, y: 650, w: 1000, h: 40 }, { x: 1370, y: 650, w: 620, h: 40 },
      { x: 2210, y: 650, w: 840, h: 40 }, { x: 3150, y: 650, w: 860, h: 40 },
      { x: 4100, y: 650, w: 820, h: 40 }, { x: 4890, y: 650, w: 620, h: 40 },
      { x: 820, y: 505, w: 700, h: 34 }, { x: 1760, y: 505, w: 760, h: 34 },
      { x: 2800, y: 505, w: 800, h: 34 }, { x: 3840, y: 505, w: 800, h: 34 },
      { x: 4700, y: 505, w: 520, h: 34 },
      { x: 1320, y: 370, w: 720, h: 34 }, { x: 2490, y: 370, w: 780, h: 34 },
      { x: 3640, y: 370, w: 820, h: 34 },
    ],
    ladders: [
      { x: 760, fromY: 630, toY: 488 }, { x: 1360, fromY: 630, toY: 353 },
      { x: 2470, fromY: 630, toY: 353 }, { x: 3590, fromY: 630, toY: 353 },
      { x: 4550, fromY: 630, toY: 488 },
    ],
    enemies: [
      { type: 'guardian', x: 520, y: 560, minX: 240, maxX: 900 },
      { type: 'bat', x: 900, y: 435, minX: 510, maxX: 1120 },
      { type: 'condor', x: 1420, y: 500, minX: 1080, maxX: 1660 },
      { type: 'guardian', x: 2240, y: 560, minX: 1820, maxX: 2570 },
      { type: 'bat', x: 2500, y: 300, minX: 2140, maxX: 2860 },
      { type: 'guardian', x: 3120, y: 560, minX: 2760, maxX: 3540 },
      { type: 'condor', x: 3650, y: 300, minX: 3260, maxX: 4010 },
      { type: 'guardian', x: 4050, y: 560, minX: 3720, maxX: 4430 },
      { type: 'guardian', x: 4670, y: 425, minX: 4460, maxX: 4910 },
      { type: 'guardian', x: 4920, y: 560, minX: 4620, maxX: 5120 },
    ],
    collectibles: [
      { type: 'feather', x: 310, y: 580 }, { type: 'crystal', x: 650, y: 580 },
      { type: 'feather', x: 1270, y: 580 }, { type: 'plate', x: 1470, y: 580 },
      { type: 'crystal', x: 2020, y: 580 }, { type: 'feather', x: 2420, y: 580 },
      { type: 'crystal', x: 3120, y: 580 }, { type: 'feather', x: 3420, y: 580 },
      { type: 'plate', x: 4010, y: 580 }, { type: 'crystal', x: 4390, y: 580 },
      { type: 'feather', x: 4860, y: 580 },
      { type: 'crystal', x: 780, y: 440 }, { type: 'feather', x: 1020, y: 440 },
      { type: 'plate', x: 1320, y: 305 }, { type: 'crystal', x: 1590, y: 305 },
      { type: 'feather', x: 1830, y: 440 }, { type: 'crystal', x: 2480, y: 305 },
      { type: 'plate', x: 2830, y: 440 }, { type: 'feather', x: 3320, y: 305 },
      { type: 'crystal', x: 3660, y: 305 }, { type: 'feather', x: 3900, y: 440 },
      { type: 'crystal', x: 4720, y: 440 },
    ],
    hazards: [],
  },
};

export class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  init(data = {}) {
    this.level = data.level || 1;
    this.score = data.score || 0;
    this.playerCount = Math.max(1, Math.min(2, data.playerCount || data.mode || 1));

    // Acepta todos los nombres con los que las escenas pueden mandar el personaje.
    // Esto corrige el caso donde se elegía Killa/Rumi, pero GameScene entraba como Auki
    // y por eso se veía el poder dorado.
    this.characterId = data.characterId || data.selected || data.character || 'auki';
    this.character = CHARACTERS[this.characterId] || CHARACTERS.auki;
    this.characterId = this.character.id;
    this.characterName = data.characterName || this.character.name || 'Auki';

    this.playersState = this.normalizePlayersState(data);
    this.changingLevel = false;
    this.bossAttackCooldown = 0;
    this.messageUntil = 0;
    this.enemiesKilled = data.enemiesKilled || 0;
    this.doorOpen = false;
  }

  normalizePlayersState(data) {
    if (Array.isArray(data.playersState) && data.playersState.length > 0) {
      return data.playersState.slice(0, 2).map((state, idx) => ({
        id: idx + 1,
        lives: Number.isFinite(state.lives) ? state.lives : 3,
        feathers: state.feathers || 0,
        crystals: state.crystals || 0,
        plates: state.plates || 0,
        alive: state.alive !== false,
      }));
    }

    return [
      {
        id: 1,
        lives: Number.isFinite(data.lives) ? data.lives : 3,
        feathers: data.feathers || 0,
        crystals: data.crystals || 0,
        plates: data.plates || data.condorPlates || 0,
        alive: true,
      },
      { id: 2, lives: 3, feathers: 0, crystals: 0, plates: 0, alive: true },
    ];
  }
  

  isTouchLikeDevice() {
    return (
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      this.scale.width <= 1100
    );
  }

  create() {

    this.input.addPointer(4);
    this.usingTouchControls = this.isTouchLikeDevice();

    this.handleResponsiveUIBound = () => {
      this.handleResponsiveUI();
    };

    this.scale.on('resize', this.handleResponsiveUI, this);
    window.addEventListener('resize', this.handleResponsiveUIBound);

    this.events.once('shutdown', this.shutdown, this);
    this.events.once('destroy', this.shutdown, this);

    this.levelDef = LEVELS.find((item) => item.id === this.level) || LEVELS[0];
    StorageManager.unlockLevel(this.level);
    this.character = CHARACTERS[this.characterId] || CHARACTERS.auki;
    this.plan = LEVEL_PLANS[this.level] || LEVEL_PLANS[1];
    this.worldWidth = this.level === 4 ? 1900 : this.plan.worldWidth;
    this.worldHeight = 720;
    this.timeLeft = this.levelDef.time;
    this.ecs = new EntityManager();
    this.inventoryOpen = false;
    this.requiredKills = this.level === 4 ? 0 : this.plan.requiredKills;
    this.platformVisuals = [];
    this.lastCameraTarget = null;
    this.prepareDecorationTextures();

    this.events.on('shutdown', this.shutdown, this);
    this.events.on('destroy', this.shutdown, this);

    this.setupWorld();
    this.createGroups();
    if (this.level === 4) this.createBossArena();
    else this.createFlatLevel();
    this.createPlayers();
    this.createCollisions();
    this.createKeyboard();
    this.createUI();
    this.applyVisualEffects();
    this.updateDoorState(true);
    this.showLevelBriefing();

    AudioManager.music(this, this.level === 4 ? 'music_boss' : 'music_level');
    this.levelTimer = this.time.addEvent({ delay: 1000, loop: true, callback: () => this.tickTimer() });
  }


  handleResponsiveUI() {
    const shouldUseTouch = this.isTouchLikeDevice();
    this.usingTouchControls = shouldUseTouch;

    if (this.touchButtons) {
      this.touchButtons.forEach((btn) => btn.setVisible(shouldUseTouch));
    }

    if (this.touchLabels) {
      this.touchLabels.forEach((txt) => txt.setVisible(shouldUseTouch));
    }

    if (this.help) {
      const helpText = shouldUseTouch
        ? 'Usa los botones táctiles para moverte, saltar y atacar'
        : this.playerCount >= 2
          ? 'P1 A/D + ESPACIO saltar + E atacar · P2 ←/→ + SHIFT saltar + ENTER atacar · W/S o ↑/↓ escaleras · I/O Inventario · ESC Pausa'
          : 'A/D moverse · ESPACIO saltar · E atacar · W/S escaleras · I Inventario · M Sonido · ESC Pausa';

      this.help.setText(helpText);
    }
  }
  // ─── Mundo y nivel ──────────────────────────────────────────────────────────
  shutdown() {
    this.scale.off('resize', this.handleResponsiveUI, this);

    if (this.handleResponsiveUIBound) {
      window.removeEventListener('resize', this.handleResponsiveUIBound);
    }
  }

  prepareDecorationTextures() {
    this.createCroppedTexture(
      'plataforma_andina_recortada',
      'plataforma_andina',
      223,
      153,
      1564,
      236
    );

    this.createCroppedTexture(
      'escalera_andina_recortada',
      'escalera_andina',
      183,
      47,
      440,
      1146
    );
  }

  createCroppedTexture(newKey, sourceKey, cropX, cropY, cropW, cropH) {
    if (this.textures.exists(newKey)) return;
    if (!this.textures.exists(sourceKey)) return;

    const source = this.textures.get(sourceKey).getSourceImage();
    const canvasTexture = this.textures.createCanvas(newKey, cropW, cropH);
    const ctx = canvasTexture.getContext();

    ctx.clearRect(0, 0, cropW, cropH);
    ctx.drawImage(
      source,
      cropX,
      cropY,
      cropW,
      cropH,
      0,
      0,
      cropW,
      cropH
    );

    canvasTexture.refresh();
  }


  setupWorld() {
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight + 180);
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.add.image(0, 0, this.levelDef.bg).setOrigin(0).setScrollFactor(0).setDisplaySize(1280, 720);
    this.add.rectangle(640, 360, 1280, 720, 0x0f172a, 0.12).setScrollFactor(0);

    const parallax = this.add.graphics().setScrollFactor(0.18).setDepth(0);
    parallax.fillStyle(0x1e1b4b, 0.2);
    for (let i = 0; i < 14; i++) {
      const bx = i * 310 - 90;
      parallax.fillTriangle(bx, 650, bx + 170, 360 + (i % 4) * 22, bx + 360, 650);
    }
  }

  createGroups() {
    this.platforms = this.physics.add.staticGroup();
    this.ladders = [];
    this.collectibles = this.physics.add.group();
    this.hazards = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();
  }

  createFlatLevel() {
    this.plan.platforms.forEach((p) => this.createPlatform(p.x, p.y, p.w, p.h));
    this.plan.ladders.forEach((l) => this.createLadder(l.x, l.fromY, l.toY));
    this.plan.collectibles.forEach((item) => this.createCollectible(item.x, item.y, item.type));
    this.plan.hazards.forEach((hazard) => this.createHazard(hazard.x, hazard.y));
    this.plan.enemies.forEach((enemy) => this.createEnemy(enemy.type, enemy.x, enemy.y, enemy.minX, enemy.maxX));
    this.createGoal(this.plan.goal.x, this.plan.goal.y);
    this.addLevelHints();
  }

  addLevelHints() {
    if (this.level !== 1 || !SettingsManager.getSettings().showHelp) return;
    const hint = this.add.text(300, 545,
      'Camino plano: avanza, salta huecos y pisa enemigos.\nEscalera: W/S o ↑/↓ solo para subir al siguiente camino.',
      { fontSize: '18px', color: '#fff3bf', stroke: '#000', strokeThickness: 4, lineSpacing: 4 }
    ).setDepth(30);
    this.time.delayedCall(9000, () => hint?.destroy());
  }

  createBossArena() {
    this.createPlatform(950, 650, 1900, 42);
    this.createPlatform(520, 505, 420, 34);
    this.createPlatform(1340, 505, 420, 34);
    this.createLadder(520, 630, 488);
    this.createLadder(1340, 630, 488);
    [220, 430, 720, 1060, 1490, 1710].forEach((x, i) => this.createCollectible(x, i % 3 === 0 ? 440 : 580, i === 2 ? 'plate' : 'feather'));
    [650, 1190, 1570].forEach((x) => this.createHazard(x, 614));

    this.boss = this.enemies.create(1180, 535, 'kunturax_idle').play('boss_idle');
    this.boss.setScale(0.92).setCollideWorldBounds(true).setDepth(10);
    this.boss.body.setSize(100, 136).setOffset(64, 82);
    this.bossData = {
      hp: 12,
      maxHp: 12,
      state: 'idle',
      nextShoot: this.time.now + 3200,
      nextMove: 0,
      targetX: 1180,
      arenaMin: 560,
      arenaMax: 1540,
      charging: false,
    };
    this.boss.setData('hp', this.bossData.hp);
    this.boss.setData('type', 'boss');
  }

  createPlatform(x, y, width, height) {
    const platform = this.add.rectangle(x, y, width, height, 0x000000, 0)
      .setDepth(2);

    this.physics.add.existing(platform, true);
    platform.body.updateFromGameObject();

    // El sprite de piedra tiene bordes decorativos más anchos que el collider.
    // Por eso agrandamos un poco la zona real de apoyo y dejamos la plataforma
    // como piso de una sola dirección: se puede aterrizar encima sin quedarse
    // pegado en los costados ni caer por los bordes visuales.
    platform.body.setSize(width + 36, Math.max(height, 38), true);
    platform.body.checkCollision.up = true;
    platform.body.checkCollision.down = false;
    platform.body.checkCollision.left = false;
    platform.body.checkCollision.right = false;

    this.platforms.add(platform);
    this.platformVisuals.push(platform);

    const textureKey = this.textures.exists('plataforma_andina_recortada')
      ? 'plataforma_andina_recortada'
      : 'plataforma_andina';

    if (this.textures.exists(textureKey)) {
      const visualHeight = Math.max(70, height * 2.2);
      const visualTop = y - height / 2 - 6;

      this.add.image(x, visualTop, textureKey)
        .setOrigin(0.5, 0)
        .setDisplaySize(width, visualHeight)
        .setDepth(3);
    } else {
      platform.setFillStyle(0x3f3f46, 1);
      platform.setStrokeStyle(2, 0xffcc5c, 0.72);

      this.add.rectangle(
        x,
        y - height / 2 - 3,
        width,
        6,
        0xffcc5c,
        0.65
      ).setDepth(3);
    }

    return platform;
  }

  createLadder(x, fromY, toY) {
    const height = Math.abs(fromY - toY) + 60;
    const y = (fromY + toY) / 2;

    const topY = Math.min(fromY, toY);
    const bottomY = Math.max(fromY, toY);

    const textureKey = this.textures.exists('escalera_andina_recortada')
      ? 'escalera_andina_recortada'
      : 'escalera_andina';

    let visual = null;

    if (this.textures.exists(textureKey)) {
      visual = this.add.image(x, y, textureKey)
        .setOrigin(0.5)
        .setDisplaySize(85, height)
        .setDepth(4);
    } else {
      const g = this.add.graphics().setDepth(4);

      g.lineStyle(5, 0xb7832f, 0.96);
      g.lineBetween(x - 22, y - height / 2, x - 22, y + height / 2);
      g.lineBetween(x + 22, y - height / 2, x + 22, y + height / 2);

      for (let yy = y - height / 2 + 18; yy < y + height / 2; yy += 27) {
        g.lineBetween(x - 25, yy, x + 25, yy);
      }

      visual = g;
    }

    this.ladders.push({
      x,

      // Zona donde el jugador puede usar la escalera
      rect: new Phaser.Geom.Rectangle(x - 42, y - height / 2, 84, height),

      // Límites para que no se pase arriba ni abajo
      topY,
      bottomY,
      visual,
    });
  }

  createCollectible(x, y, type) {
    const texture = type === 'crystal' ? 'cristal_andino' : type === 'plate' ? 'simbolo_condor' : 'pluma_dorada';
    const item = this.collectibles.create(x, y, texture).setDepth(7);
    item.itemType = type;
    item.setScale(type === 'plate' ? 0.62 : type === 'crystal' ? 0.58 : 0.55);
    item.body.allowGravity = false;
    item.body.immovable = true;
    item.body.setSize(34, 34).setOffset(type === 'plate' ? 15 : 7, type === 'plate' ? 15 : 7);
    if (type === 'plate') item.setTint(0xffcc5c);
    this.tweens.add({ targets: item, y: y - 9, duration: 850, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: item, angle: 360, duration: type === 'plate' ? 2100 : 3000, repeat: -1 });
    return item;
  }

  createHazard(x, y) {
    const hazard = this.hazards.create(
      x,
      y,
      this.textures.exists('pinchos_piedra') ? 'pinchos_piedra' : 'cristal_andino'
    )
      // Tamaño visual del obstáculo
      .setScale(1.08)
      .setDepth(9);

    hazard.body.allowGravity = false;
    hazard.body.immovable = true;

    // Hitbox un poco más grande, pero no exagerado
    hazard.body.setSize(42, 20).setOffset(11, 12);

    return hazard;
  }

  createEnemy(type, x, y, minX, maxX) {
    let sprite;
    if (type === 'bat') {
      sprite = this.enemies.create(x, y - 70, 'murcielago_volar').play('bat_fly');
      sprite.body.allowGravity = false;
      sprite.setScale(0.64);
      sprite.body.setSize(68, 40).setOffset(40, 35);
      sprite.setData('flying', true);
      sprite.setData('walkAnim', 'bat_fly');
      sprite.setData('attackAnim', 'bat_fly');
    } else if (type === 'condor') {
      sprite = this.enemies.create(x, y - 80, 'condor_volar').play('condor_fly');
      sprite.body.allowGravity = false;
      sprite.setScale(0.72);
      sprite.body.setSize(90, 58).setOffset(50, 38);
      sprite.setData('flying', true);
      sprite.setData('walkAnim', 'condor_fly');
      sprite.setData('attackAnim', 'condor_attack');
    } else {
      sprite = this.enemies.create(x, y, 'guardian_caminar').play('guardian_walk');
      sprite.setScale(0.78);
      sprite.body.setSize(58, 82).setOffset(48, 52);
      sprite.body.setMaxVelocity(160, 720);
      sprite.setData('flying', false);
      sprite.setData('walkAnim', 'guardian_walk');
      sprite.setData('attackAnim', 'guardian_attack');
    }
    sprite.setCollideWorldBounds(true).setDepth(8);
    sprite.body.setBounce(0, 0);
    sprite.setData('type', type);
    sprite.setData('hp', type === 'guardian' ? 2 : 1);
    sprite.setData('spawnX', x);
    sprite.setData('spawnY', sprite.y);
    sprite.setData('originY', sprite.y);
    sprite.setData('patrolMinX', minX);
    sprite.setData('patrolMaxX', maxX);
    const id = this.ecs.create();
    const health = { hp: sprite.getData('hp') };
    sprite.setData('healthRef', health);
    this.ecs
      .add(id, Components.Sprite, sprite)
      .add(id, Components.Health, health)
      .add(id, Components.EnemyAI, { detectionRadius: type === 'guardian' ? 240 : 300, chaseSpeed: type === 'guardian' ? 90 : 115 })
      .add(id, Components.Patrol, { minX, maxX, speed: type === 'guardian' ? 62 : 92, direction: Math.random() > 0.5 ? 1 : -1 });
    return sprite;
  }

  createGoal(x, y) {
    const goalKey = this.textures.exists('puerta_torre')
      ? 'puerta_torre'
      : 'estatua_condor';

    this.goal = this.physics.add.staticImage(x, y, goalKey)
      // Tamaño visual del portal
      .setScale(1.45)
      .setDepth(7);

    // Área de contacto del portal.
    // Esto ayuda a que el jugador no tenga que tocarlo tan exacto.
    this.goal.body.setSize(88, 118).setOffset(1, 1);

    if (this.goal.refreshBody) this.goal.refreshBody();

    // Portal cerrado: oscuro
    this.goal.setAlpha(0.55).setTint(0x777777);

    // Aura del portal más grande
    this.doorHalo = this.add.circle(x, y + 8, 105, 0xffcc5c, 0.13)
      .setDepth(6)
      .setAlpha(0.25);

    this.tweens.add({
      targets: [this.goal, this.doorHalo],
      scale: '+=0.05',
      duration: 950,
      yoyo: true,
      repeat: -1,
    });
  }

  // ─── Jugadores ──────────────────────────────────────────────────────────────

  createPlayers() {
    this.players = [];
    const start = this.plan?.start || { x: 130, y: 560 };
    const p1 = this.createPlayer(start.x, start.y, this.character, 'P1', this.character.tint, this.playersState[0]);
    this.players.push(p1);

    if (this.playerCount >= 2) {
      const p2char = { ...this.character, speed: this.character.speed * 0.95, jump: this.character.jump * 0.98 };
      const p2 = this.createPlayer(start.x + 58, start.y, p2char, 'P2', 0x9be7ff, this.playersState[1]);
      this.players.push(p2);
    }

    this.setCameraTarget(this.getLivingPlayers()[0] || this.players[0]);
    this.cameras.main.setDeadzone(220, 120);
  }

  createPlayer(x, y, character, label, tint, state) {
    const textureKey = this.textures.exists(character.idle)
      ? character.idle
      : 'heroe_idle';

    const sprite = this.physics.add.sprite(x, y, textureKey)
      .setScale(character.gameScale || 0.72)
      .setDepth(12);

    const finalTint = tint ?? character.tint;

    if (finalTint && finalTint !== 0xffffff) {
      sprite.setTint(finalTint);
    }

    sprite.setCollideWorldBounds(false);

    // Hitbox general para personajes de 150x160 aprox.
    sprite.body.setSize(46, 98).setOffset(52, 54);

    const glowColor = label === 'P1' ? 0xffcc5c : 0x67e8f9;

    const playerGlow = this.add.ellipse(x, y + 4, 70, 115, glowColor, 0.18)
      .setDepth(11);

    const playerShadow = this.add.ellipse(x, y + 50, 58, 16, 0x000000, 0.42)
      .setDepth(11);

    const name = this.add.text(x, y - 72, label, {
      fontSize: '15px',
      color: label === 'P1' ? '#ffcc5c' : '#67e8f9',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(30);

    const active = state?.alive !== false && (state?.lives ?? 3) > 0;

    if (!active) {
      sprite.disableBody(true, true);
      name.setVisible(false);
      playerGlow.setVisible(false);
      playerShadow.setVisible(false);
    }

    return {
      sprite,
      name,
      playerGlow,
      playerShadow,
      character,
      label,
      tint: finalTint,
      active,
      lives: state?.lives ?? 3,
      feathers: state?.feathers || 0,
      crystals: state?.crystals || 0,
      plates: state?.plates || 0,
      attackingUntil: 0,
      invulnerableUntil: 0,
      spawn: { x, y },
      lastGroundedAt: 0,
      jumpBufferedUntil: 0,
      climbing: false,
      shieldUntil: 0,
    };
  }

  createCollisions() {
    this.players.forEach((player) => {
      this.physics.add.collider(player.sprite, this.platforms);
      this.physics.add.overlap(player.sprite, this.collectibles, (_, item) => this.collectItem(player, item));
      this.physics.add.overlap(player.sprite, this.hazards, () => this.damagePlayer(player));
      this.physics.add.overlap(player.sprite, this.enemies, (_, enemy) => this.touchEnemy(player, enemy));
      this.physics.add.overlap(player.sprite, this.projectiles, (_, proj) => { proj.destroy(); this.damagePlayer(player); });
      if (this.goal) this.physics.add.overlap(player.sprite, this.goal, () => this.tryCompleteLevel(player));
    });
    this.physics.add.collider(
      this.enemies,
      this.platforms,
      undefined,
      (enemy) => enemy?.getData?.('flying') !== true && enemy?.body?.allowGravity !== false
    );
    this.physics.add.collider(this.projectiles, this.platforms, (proj) => proj.destroy());
  }

  createKeyboard() {
    this.keys = this.input.keyboard.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      e: Phaser.Input.Keyboard.KeyCodes.E,
      q: Phaser.Input.Keyboard.KeyCodes.Q,
      p: Phaser.Input.Keyboard.KeyCodes.P,
      i: Phaser.Input.Keyboard.KeyCodes.I,
      o: Phaser.Input.Keyboard.KeyCodes.O,
      m: Phaser.Input.Keyboard.KeyCodes.M,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
    });
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-ESC', () => this.openPause());
    this.input.keyboard.on('keydown-P', () => this.openPause());
    this.input.keyboard.on('keydown-I', () => this.toggleInventory());
    this.input.keyboard.on('keydown-O', () => this.toggleInventory());
    this.input.keyboard.on('keydown-M', () => AudioManager.toggleMute(this));
    
    this.touchControls = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      attack: false,
      jumpPressed: false,
      attackPressed: false,
    };
  }

  createUI() {
    this.uiBg = this.add.rectangle(640, 26, 1280, 52, 0x0f172a, 0.8).setScrollFactor(0).setDepth(50);
    this.hud = this.add.text(18, 10, '', {
      fontSize: '18px', color: '#fff3bf', fontStyle: 'bold', stroke: '#000', strokeThickness: 3,
    }).setScrollFactor(0).setDepth(51);
    this.help = this.add.text(640, 56,
      this.playerCount >= 2
        ? 'P1 A/D + ESPACIO saltar + E/Q poder · P2 ←/→ + SHIFT saltar + ENTER poder · W/S o ↑/↓ escaleras · I/O Inventario · ESC Pausa'
        : 'A/D moverse · ESPACIO saltar · E/Q poder · W/S escaleras · I Inventario · M Sonido · ESC Pausa',
      { fontSize: '15px', color: '#c7f9ff', stroke: '#000', strokeThickness: 3 }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(51);

    this.pauseButton = this.add.rectangle(1220, 25, 92, 36, 0x23124d, 0.9)
      .setStrokeStyle(2, COLORS.gold).setInteractive({ useHandCursor: true }).setScrollFactor(0).setDepth(52);
    this.pauseLabel = this.add.text(1220, 25, 'PAUSA', { fontSize: '17px', color: '#fff3bf', fontStyle: 'bold' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(53).setInteractive({ useHandCursor: true });
    this.pauseButton.on('pointerdown', () => this.openPause());
    this.pauseLabel.on('pointerdown', () => this.openPause());

    this.statusText = this.add.text(640, 96, '', {
      fontSize: '18px', color: '#fff3bf', align: 'center', stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(52);

    this.inventoryPanel = this.add.rectangle(640, 360, 850, 330, 0x0f172a, 0.95)
      .setStrokeStyle(3, COLORS.gold).setScrollFactor(0).setDepth(60).setVisible(false);
    this.inventoryTitle = this.add.text(640, 220, '🎒 INVENTARIOS  [I/O para cerrar]', {
      fontSize: '23px', color: '#ffcc5c', fontStyle: 'bold', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(61).setVisible(false);
    this.inventoryText = this.add.text(245, 265, '', {
      fontSize: '18px',
      color: '#fff3bf',
      lineSpacing: 10,
      wordWrap: { width: 790, useAdvancedWrap: true },
    }).setScrollFactor(0).setDepth(61).setVisible(false);

    this.minimap = this.add.graphics().setScrollFactor(0).setDepth(55);
    this.bossBar = this.add.graphics().setScrollFactor(0).setDepth(55);
    
    this.createTouchControls();
    this.updateHUD();
    this.handleResponsiveUI();
  }

  createTouchControls() {
    this.touchControls = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      attack: false,
      jumpPressed: false,
      attackPressed: false,
    };

    this.touchButtons = [];
    this.touchLabels = [];
    this.touchAreas = [];

    const visible = this.isTouchLikeDevice();

    const makeTouchButton = (x, y, width, height, label, key) => {
      const box = this.add.rectangle(x, y, width, height, 0x24124d, 0.82)
        .setStrokeStyle(2, 0xe9c46a)
        .setScrollFactor(0)
        .setDepth(80)
        .setInteractive({ useHandCursor: true });

      const text = this.add.text(x, y, label, {
        fontSize: '18px',
        color: '#fff3bf',
        fontStyle: 'bold',
        align: 'center',
      })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(81)
        .setInteractive({ useHandCursor: true });

      const area = { x, y, width, height, key, box };
      this.touchAreas.push(area);

      const press = (pointer) => {
        pointer?.event?.preventDefault?.();
        AudioManager.resume(this);
        this.touchControls[key] = true;

        if (key === 'jump') this.touchControls.jumpPressed = true;
        if (key === 'attack') this.touchControls.attackPressed = true;

        box.setFillStyle(0x4c1d95, 0.95);
      };

      const release = (pointer) => {
        pointer?.event?.preventDefault?.();
        this.touchControls[key] = false;
        box.setFillStyle(0x24124d, 0.82);
      };

      [box, text].forEach((target) => {
        target.on('pointerdown', press);
        target.on('pointerup', release);
        target.on('pointerout', release);
        target.on('pointerupoutside', release);
      });

      box.setVisible(visible);
      text.setVisible(visible);

      this.touchButtons.push(box);
      this.touchLabels.push(text);
    };

    // Dirección
    makeTouchButton(95, 615, 64, 48, '←', 'left');
    makeTouchButton(165, 615, 64, 48, '↓', 'down');
    makeTouchButton(235, 615, 64, 48, '→', 'right');
    makeTouchButton(165, 555, 64, 48, '↑', 'up');

    // Acción
    makeTouchButton(980, 615, 110, 50, 'SALTAR', 'jump');
    makeTouchButton(1105, 615, 110, 50, 'ATACAR', 'attack');
  }

  refreshTouchControlsFromPointers() {
    if (!this.usingTouchControls || !this.touchControls || !this.touchAreas) return;

    const previous = { ...this.touchControls };
    const next = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      attack: false,
      jumpPressed: this.touchControls.jumpPressed,
      attackPressed: this.touchControls.attackPressed,
    };

    const pointers = [this.input.activePointer, ...(this.input.manager?.pointers || [])]
      .filter((pointer, index, arr) => pointer && pointer.isDown && arr.indexOf(pointer) === index);

    const isInside = (pointer, area) => (
      pointer.x >= area.x - area.width / 2 &&
      pointer.x <= area.x + area.width / 2 &&
      pointer.y >= area.y - area.height / 2 &&
      pointer.y <= area.y + area.height / 2
    );

    this.touchAreas.forEach((area) => {
      const down = pointers.some((pointer) => isInside(pointer, area));
      if (down) {
        next[area.key] = true;
        area.box.setFillStyle(0x4c1d95, 0.95);

        if (area.key === 'jump' && !previous.jump) next.jumpPressed = true;
        if (area.key === 'attack' && !previous.attack) next.attackPressed = true;
      } else {
        area.box.setFillStyle(0x24124d, 0.82);
      }
    });

    this.touchControls = next;
  }


  showLevelBriefing() {
    const text = STORY.levelBriefings[this.level];
    if (!text) return;
    const x = 520;
    const bg = this.add.rectangle(x, 132, 860, 74, 0x0f172a, 0.88)
      .setStrokeStyle(2, COLORS.gold)
      .setScrollFactor(0)
      .setDepth(57);
    const label = this.add.text(x, 132, text, {
      fontSize: '20px',
      color: '#fff3bf',
      align: 'center',
      wordWrap: { width: 780 },
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(58);
    this.tweens.add({ targets: [bg, label], alpha: 0, delay: 5200, duration: 500, onComplete: () => { bg.destroy(); label.destroy(); } });
  }

  applyVisualEffects() {
    try {
      this.cameras.main.postFX.addVignette(0.5, 0.5, 0.62, 0.25);
      if (this.level === 4) this.cameras.main.postFX.addBloom(0xffcc5c, 0.55, 0.55, 1, 0.85);
    } catch { /* fallback */ }
  }

  // ─── Update ─────────────────────────────────────────────────────────────────

  update(time) {
    if (!this.players?.length) return;
    this.updatePlayers(time);
    runPatrolAndAISystem(this, this.ecs, this.getLivingPlayers());
    if (this.level === 4) this.updateBoss(time);
    this.updateNames();
    this.updateCameraFollow();
    this.updateDoorState(false);
    this.updateMinimap();
    this.updateBossBar();
    this.updateHUD();
    this.cleanupFalls();
  }

  updatePlayers(time) {
    this.refreshTouchControlsFromPointers();
    const touch = this.touchControls || {};

    this.updatePlayer(this.players[0], {
      left: { isDown: this.keys.a.isDown || touch.left },
      right: { isDown: this.keys.d.isDown || touch.right },
      up: { isDown: this.keys.w.isDown || touch.up },
      down: { isDown: this.keys.s.isDown || touch.down },
      jump: this.keys.space,
      attack: this.keys.e,
      attackAlt: this.keys.q,
      touchJump: touch.jumpPressed,
      touchAttack: touch.attackPressed,
    }, time);

    if (this.players[1]) {
      this.updatePlayer(this.players[1], {
        left: this.cursors.left,
        right: this.cursors.right,
        up: this.cursors.up,
        down: this.cursors.down,
        jump: this.keys.shift,
        attack: this.keys.enter,
        touchJump: false,
        touchAttack: false,
      }, time);
    }

    if (this.touchControls) {
      this.touchControls.jumpPressed = false;
      this.touchControls.attackPressed = false;
    }
  }

  updatePlayer(player, controls, time) {
    if (!player?.sprite?.active || !player.active || player.lives <= 0) return;
    const { sprite, character } = player;
    const currentLadder = this.getCurrentLadder(sprite);
    const onLadder = Boolean(currentLadder);
    const left = controls.left.isDown;
    const right = controls.right.isDown;
    const up = controls.up.isDown;
    const down = controls.down.isDown;

    sprite.setVelocityX(0);
    if (left) sprite.setVelocityX(-character.speed);
    if (right) sprite.setVelocityX(character.speed);
    if (left || right) sprite.setFlipX(left);

    // En escaleras: solo se desactiva la gravedad mientras realmente está
    // subiendo/bajando. Antes se desactivaba aunque el jugador caminara por
    // una plataforma cercana a la escalera, y eso hacía que se cayera raro.
    const wantsToClimb = onLadder && (up || down);
    const canHoldLadder = onLadder && player.climbing && !left && !right && !this.isGrounded(sprite);

    if (wantsToClimb) {
      player.climbing = true;
      sprite.body.allowGravity = false;
      sprite.body.checkCollision.up = false;
      sprite.body.checkCollision.down = false;
      sprite.setVelocityX(0);

      // Centra suavemente al jugador en la escalera.
      sprite.x = Phaser.Math.Linear(sprite.x, currentLadder.x, 0.25);

      const ladderSpeed = 155;
      const topLimit = (currentLadder.topY ?? currentLadder.rect.top) - 45;
      const bottomLimit = (currentLadder.bottomY ?? currentLadder.rect.bottom) - 70;

      if (up) {
        if (sprite.y <= topLimit) {
          sprite.setVelocityY(0);
          sprite.y = topLimit;
          player.climbing = false;
          sprite.body.allowGravity = true;
          sprite.body.checkCollision.up = true;
          sprite.body.checkCollision.down = true;
        } else {
          sprite.setVelocityY(-ladderSpeed);
        }
      } else if (down) {
        if (sprite.y >= bottomLimit) {
          sprite.setVelocityY(0);
          sprite.y = bottomLimit;
          player.climbing = false;
          sprite.body.allowGravity = true;
          sprite.body.checkCollision.up = true;
          sprite.body.checkCollision.down = true;
        } else {
          sprite.setVelocityY(ladderSpeed);
        }
      }
    } else if (canHoldLadder) {
      sprite.body.allowGravity = false;
      sprite.body.checkCollision.up = false;
      sprite.body.checkCollision.down = false;
      sprite.setVelocityY(0);
    } else {
      player.climbing = false;
      sprite.body.allowGravity = true;
      sprite.body.checkCollision.up = true;
      sprite.body.checkCollision.down = true;
    }

    const jumpPressed = Phaser.Input.Keyboard.JustDown(controls.jump) || controls.touchJump;
    const attackPressed =
      Phaser.Input.Keyboard.JustDown(controls.attack) ||
      (controls.attackAlt ? Phaser.Input.Keyboard.JustDown(controls.attackAlt) : false) ||
      controls.touchAttack;

    // Guarda el último momento en el que el jugador estuvo tocando el piso.
    if (this.isGrounded(sprite)) {
      player.lastGroundedAt = time;
    }

    // Si el jugador presiona salto un poquito antes o justo al borde,
    // el juego lo recuerda por unos milisegundos.
    if (jumpPressed) {
      player.jumpBufferedUntil = time + 130;
    }

    // Permite saltar aunque el jugador haya salido apenas del borde.
    const canJump =
      this.isGrounded(sprite) ||
      onLadder ||
      time - player.lastGroundedAt <= 140;

    if (player.jumpBufferedUntil > time && canJump) {
      sprite.body.allowGravity = true;
      sprite.setVelocityY(-character.jump);
      player.jumpBufferedUntil = 0;
      player.lastGroundedAt = -9999;
      AudioManager.play(this, 'sfx_jump', { volume: 0.55 });
    }

    if (attackPressed) {
      player.attackingUntil = time + 250;
      this.showAttackEffect(player);
      this.tryAttackEnemy(player);
      this.tryAttackBoss(player);
    }

    if (this.isGrounded(sprite) && sprite.x > player.spawn.x + 320) player.spawn = { x: sprite.x, y: sprite.y };

    const anims = character.anims || CHARACTERS.auki.anims;

    if (time < player.attackingUntil) {
      sprite.play(anims.hit, true);
    } else if (!this.isGrounded(sprite) && sprite.body.velocity.y < -30) {
      sprite.play(anims.jump, true);
    } else if (!this.isGrounded(sprite) && sprite.body.velocity.y > 60) {
      sprite.play(anims.fall, true);
    } else if (Math.abs(sprite.body.velocity.x) > 10) {
      sprite.play(anims.run, true);
    } else {
      sprite.anims.stop();
      sprite.setTexture(character.idle || 'heroe_idle');
    }
  }

  isGrounded(sprite) {
    const body = sprite?.body;
    return Boolean(body && (body.blocked.down || body.touching.down || body.wasTouching.down));
  }

  getCurrentLadder(sprite) {
    const b = sprite.body;
    const bodyRect = new Phaser.Geom.Rectangle(b.x + 8, b.y + 10, b.width - 16, b.height - 20);
    return this.ladders.find((l) => Phaser.Geom.Rectangle.Overlaps(bodyRect, l.rect)) || null;
  }

  isOnLadder(sprite) {
    return Boolean(this.getCurrentLadder(sprite));
  }

  updateNames() {
    this.players.forEach((p) => {
      const visible = Boolean(p.sprite.active && p.active);

      p.name.setPosition(p.sprite.x, p.sprite.y - 78);
      p.name.setVisible(visible);

      if (p.playerGlow) {
        p.playerGlow.setPosition(p.sprite.x, p.sprite.y + 4);
        p.playerGlow.setVisible(visible);
      }

      if (p.playerShadow) {
        p.playerShadow.setPosition(p.sprite.x, p.sprite.y + 50);
        p.playerShadow.setVisible(visible);
      }
    });
  }

  updateCameraFollow() {
    const target = this.getLivingPlayers()[0];
    if (target && target !== this.lastCameraTarget) this.setCameraTarget(target);
  }

  setCameraTarget(player) {
    if (!player?.sprite) return;
    this.lastCameraTarget = player;
    this.cameras.main.startFollow(player.sprite, true, 0.12, 0.12);
  }

  getLivingPlayers() {
    return (this.players || []).filter((p) => p?.active && p?.sprite?.active && p.lives > 0);
  }

  // ─── Lógica ─────────────────────────────────────────────────────────────────


  collectItem(player, item) {
    if (!item.active || !player.active) return;
    if (item.itemType === 'crystal') { player.crystals += 1; this.score += 80; }
    else if (item.itemType === 'plate') { player.plates += 1; this.score += 150; this.showMessage(`${player.label} obtuvo una placa del cóndor: revive o suma vida.`); }
    else { player.feathers += 1; this.score += 50; }
    AudioManager.play(this, 'sfx_coin', { volume: 0.6 });
    item.disableBody(true, true);
  }

  touchEnemy(player, enemy) {
    if (!player.active || !enemy?.active) return;
    const fallingOn = player.sprite.body.velocity.y > 150 && player.sprite.y < enemy.y - 22;
    if (fallingOn && enemy !== this.boss) {
      this.damageEnemy(enemy, 1, 120, player);
      player.sprite.setVelocityY(-330);
      return;
    }
    if (enemy === this.boss && fallingOn) {
      this.hitBoss(1);
      player.sprite.setVelocityY(-360);
      return;
    }
    this.damagePlayer(player);
  }

  tryAttackEnemy(player) {
    const power = player.character.power || {};
    const powerId = power.id || 'remolino';
    const direction = player.sprite.flipX ? -1 : 1;

    if (powerId === 'zorro') {
      const range = new Phaser.Geom.Circle(player.sprite.x, player.sprite.y, power.radius || 220);
      this.getGroupChildren(this.enemies).forEach((enemy) => {
        if (!enemy?.active || enemy === this.boss) return;
        if (Phaser.Geom.Circle.Contains(range, enemy.x, enemy.y)) {
          this.damageEnemy(enemy, power.damage || 1, power.points || 150, player);
        }
      });
      return;
    }

    const cx = player.sprite.x + direction * (power.range || 110);
    const range = new Phaser.Geom.Circle(cx, player.sprite.y, power.radius || 78);
    this.getGroupChildren(this.enemies).forEach((enemy) => {
      if (!enemy?.active || enemy === this.boss) return;
      if (Phaser.Geom.Circle.Contains(range, enemy.x, enemy.y)) {
        this.damageEnemy(enemy, power.damage || 1, power.points || 130, player);
      }
    });

    if (powerId === 'piedra' && power.shieldMs) {
      player.shieldUntil = this.time.now + power.shieldMs;
      player.invulnerableUntil = Math.max(player.invulnerableUntil, player.shieldUntil);
    }
  }

  showAttackEffect(player) {
    const powerId = player.character.power?.id || 'remolino';
    if (powerId === 'zorro') {
      this.showKillaPowerEffect(player);
      return;
    }
    if (powerId === 'piedra') {
      this.showRumiPowerEffect(player);
      return;
    }
    this.showAukiPowerEffect(player);
  }

  showAukiPowerEffect(player) {
    if (!this.textures.exists('ataque_dorado')) return;
    const direction = player.sprite.flipX ? -1 : 1;
    const slash = this.add.image(player.sprite.x + direction * 40, player.sprite.y - 8, 'ataque_dorado')
      .setDepth(16)
      .setScale(0.34)
      .setAlpha(0.95)
      .setFlipX(direction < 0)
      .setOrigin(direction > 0 ? 0.18 : 0.82, 0.5)
      .setAngle(direction > 0 ? -7 : 7);
    this.tweens.add({
      targets: slash,
      x: slash.x + direction * 88,
      alpha: 0,
      scale: 0.48,
      duration: 260,
      ease: 'Sine.easeOut',
      onComplete: () => slash.destroy(),
    });
  }

  showKillaPowerEffect(player) {
    const direction = player.sprite.flipX ? -1 : 1;
    const aura = this.add.circle(player.sprite.x, player.sprite.y, 60, 0x67e8f9, 0.16)
      .setStrokeStyle(3, 0x67e8f9, 0.85)
      .setDepth(15);

    this.tweens.add({
      targets: aura,
      radius: 220,
      alpha: 0,
      duration: 360,
      ease: 'Sine.easeOut',
      onComplete: () => aura.destroy(),
    });

    if (this.textures.exists('killa_power_sheet')) {
      const fox = this.add.sprite(player.sprite.x - direction * 18, player.sprite.y + 10, 'killa_power_sheet')
        .setScale(0.82)
        .setFlipX(direction < 0)
        .setDepth(17);
      if (this.anims.exists('killa_power')) fox.play('killa_power', true);
      this.tweens.add({
        targets: fox,
        x: fox.x + direction * 175,
        y: fox.y - 12,
        alpha: 0,
        duration: 430,
        ease: 'Quad.easeOut',
        onComplete: () => fox.destroy(),
      });
    }
  }

  showRumiPowerEffect(player) {
    const direction = player.sprite.flipX ? -1 : 1;
    const groundY = player.sprite.y + 42;

    const shock = this.add.ellipse(player.sprite.x + direction * 78, groundY, 38, 16, 0x6b4f35, 0.42)
      .setStrokeStyle(3, 0xc0843e, 0.95)
      .setDepth(15);

    this.tweens.add({
      targets: shock,
      width: 215,
      height: 46,
      alpha: 0,
      duration: 320,
      ease: 'Sine.easeOut',
      onComplete: () => shock.destroy(),
    });

    if (this.textures.exists('rumi_power_sheet')) {
      const fist = this.add.sprite(player.sprite.x + direction * 74, player.sprite.y - 2, 'rumi_power_sheet')
        .setScale(0.78)
        .setFlipX(direction < 0)
        .setDepth(17);
      if (this.anims.exists('rumi_power')) fist.play('rumi_power', true);
      this.tweens.add({
        targets: fist,
        x: fist.x + direction * 48,
        alpha: 0,
        duration: 360,
        ease: 'Back.easeOut',
        onComplete: () => fist.destroy(),
      });
    }

    const shield = this.add.circle(player.sprite.x, player.sprite.y, 58, 0x8b5a2b, 0.15)
      .setStrokeStyle(3, 0xc0843e, 0.84)
      .setDepth(14);
    this.tweens.add({
      targets: shield,
      scale: 1.35,
      alpha: 0,
      duration: 2000,
      ease: 'Sine.easeOut',
      onUpdate: () => shield.setPosition(player.sprite.x, player.sprite.y),
      onComplete: () => shield.destroy(),
    });
  }

  damageEnemy(enemy, amount, points, player) {
    if (!enemy?.active || enemy.getData('defeated')) return;
    const hp = Number(enemy.getData('hp') ?? 1);
    const nextHp = Math.max(0, hp - amount);
    enemy.setData('hp', nextHp);
    const health = enemy.getData('healthRef');
    if (health) health.hp = nextHp;

    enemy.setData('hitstunUntil', this.time.now + 180);
    enemy.setTint(0xffe6a7);
    this.time.delayedCall(110, () => { if (enemy?.active) enemy.clearTint(); });
    if (player?.sprite && enemy.body?.allowGravity !== false) {
      const direction = Math.sign(enemy.x - player.sprite.x) || 1;
      enemy.setVelocityX(direction * 95);
    }

    if (nextHp <= 0) this.defeatEnemy(enemy, points);
    else AudioManager.play(this, 'sfx_hit', { volume: 0.45 });
  }

  defeatEnemy(enemy, points) {
    if (!enemy?.active || enemy.getData('defeated')) return;
    enemy.setData('defeated', true);
    enemy.disableBody(true, true);
    this.enemiesKilled += 1;
    this.score += points;
    AudioManager.play(this, 'sfx_hit', { volume: 0.55 });
    if (this.enemiesKilled >= this.requiredKills && this.level !== 4) this.showMessage('La puerta de la torre se abrió. Avanza al final del nivel.');
  }

  tryAttackBoss(player) {
    if (!this.boss?.active) return;
    const dist = Phaser.Math.Distance.Between(player.sprite.x, player.sprite.y, this.boss.x, this.boss.y);
    if (dist < 155 && this.time.now > this.bossAttackCooldown) {
      this.bossAttackCooldown = this.time.now + 430;
      this.hitBoss(1 + Math.min(2, player.feathers));
    }
  }

  hitBoss(amount) {
    if (!this.bossData || this.bossData.hp <= 0) return;
    this.bossData.hp -= amount;
    this.cameras.main.shake(90, 0.006);
    this.boss.setTint(0xff7777);
    this.time.delayedCall(120, () => this.boss?.clearTint());
    AudioManager.play(this, 'sfx_hit', { volume: 0.7 });
    if (this.bossData.hp <= 0) this.defeatBoss();
  }

  updateBoss(time) {
    if (!this.boss?.active || this.bossData.hp <= 0) return;
    this.updateBossMovement(time);

    if (!this.bossData.charging && time > this.bossData.nextShoot) {
      this.bossData.charging = true;
      this.bossData.nextShoot = time + 4200;
      this.boss.setVelocityX(0);
      this.boss.play('boss_attack', true);
      this.showBossProjectileWarning();
      this.time.delayedCall(950, () => {
        if (!this.boss?.active || this.bossData.hp <= 0) return;
        this.shootBossProjectile();
        this.bossData.charging = false;
        this.boss.play('boss_idle', true);
      });
    }
  }

  updateBossMovement(time) {
    if (this.bossData.charging) return;
    const target = this.getLivingPlayers()[0]?.sprite;
    const { arenaMin, arenaMax } = this.bossData;

    if (this.boss.x <= arenaMin + 10) this.bossData.targetX = Phaser.Math.Between(840, 1360);
    if (this.boss.x >= arenaMax - 10) this.bossData.targetX = Phaser.Math.Between(680, 1260);

    if (time > this.bossData.nextMove || Math.abs(this.boss.x - this.bossData.targetX) < 34) {
      if (target) {
        const keepDistance = target.x < this.boss.x ? 260 : -260;
        const pressureX = Phaser.Math.Clamp(target.x + keepDistance, arenaMin, arenaMax);
        const roamingX = Phaser.Math.Between(680, 1480);
        const pressureAtEdge = pressureX <= arenaMin + 12 || pressureX >= arenaMax - 12;
        this.bossData.targetX = Math.abs(target.x - this.boss.x) > 360 && !pressureAtEdge ? pressureX : roamingX;
      } else {
        this.bossData.targetX = Phaser.Math.Between(680, 1480);
      }
      this.bossData.nextMove = time + Phaser.Math.Between(900, 1500);
    }

    const direction = Math.sign(this.bossData.targetX - this.boss.x);
    this.boss.setVelocityX(direction * 95);
    if (target) this.boss.setFlipX(target.x < this.boss.x);
    else if (direction) this.boss.setFlipX(direction < 0);
  }

  shootBossProjectile() {
    const target = this.getLivingPlayers()[0]?.sprite;
    if (!target) return;
    const texture = this.textures.exists('proyectil_kunturax') ? 'proyectil_kunturax' : 'cristal_andino';
    const direction = target.x < this.boss.x ? -1 : 1;
    const proj = this.projectiles.create(this.boss.x + direction * 82, this.boss.y - 35, texture)
      .setScale(texture === 'proyectil_kunturax' ? 0.62 : 0.58)
      .setFlipX(direction < 0)
      .setDepth(13);
    if (texture !== 'proyectil_kunturax') proj.setTint(0xff5c7a);
    proj.body.allowGravity = false;
    proj.body.setSize(texture === 'proyectil_kunturax' ? 70 : 28, texture === 'proyectil_kunturax' ? 64 : 28)
      .setOffset(texture === 'proyectil_kunturax' ? 40 : 10, texture === 'proyectil_kunturax' ? 34 : 10);
    this.physics.moveToObject(proj, target, 260);
    this.tweens.add({ targets: proj, angle: 360, duration: 850, repeat: -1 });
    this.time.delayedCall(4200, () => proj?.destroy());
  }

  showBossProjectileWarning() {
    const target = this.getLivingPlayers()[0]?.sprite;
    if (!target) return;
    const direction = target.x < this.boss.x ? -1 : 1;
    const warning = this.add.circle(this.boss.x + direction * 82, this.boss.y - 35, 42, 0xc026d3, 0.22)
      .setStrokeStyle(3, 0xff5cff, 0.8)
      .setDepth(12);
    this.tweens.add({
      targets: warning,
      scale: 1.45,
      alpha: 0,
      duration: 930,
      ease: 'Sine.easeIn',
      onComplete: () => warning.destroy(),
    });
  }

  defeatBoss() {
    this.boss.play('boss_death', true);
    this.boss.setVelocity(0, 0);
    this.boss.body.enable = false;
    this.score += 1000 + this.timeLeft * 8;
    AudioManager.play(this, 'sfx_victory', { volume: 0.8 });
    this.cameras.main.flash(900, 255, 220, 100);
    this.time.delayedCall(1800, () => this.scene.start('GameOverScene', this.makeSaveData(true)));
  }

  damagePlayer(player) {
    const now = this.time.now;
    if (!player.active) return;
    if (now < (player.shieldUntil || 0)) {
      this.showMessage(`${player.label} bloqueó el golpe con Puño de Piedra.`);
      return;
    }
    if (now < player.invulnerableUntil) return;
    player.invulnerableUntil = now + 1250;
    player.lives -= 1;
    this.cameras.main.shake(130, 0.006);
    AudioManager.play(this, 'sfx_hit', { volume: 0.7 });

    if (player.lives <= 0) {
      this.handlePlayerDown(player);
      return;
    }

    this.flashPlayer(player);
    player.sprite.setVelocity(player.sprite.flipX ? 180 : -180, -260);
  }

  flashPlayer(player) {
    player.sprite.setTint(0xff7777);
    this.tweens.add({
      targets: player.sprite, alpha: 0.38, yoyo: true, repeat: 4, duration: 90,
      onComplete: () => { player.sprite.setAlpha(1); player.sprite.setTint(player.tint); },
    });
  }

  handlePlayerDown(player) {
    if (this.tryUseCondorPlate(player)) return;

    player.active = false;
    player.sprite.setVelocity(0, 0);
    player.sprite.play('hero_death', true);

    this.time.delayedCall(650, () => {
      player.sprite.disableBody(true, true);
      player.name.setVisible(false);
    });
    this.showMessage(`${player.label} cayó. ${this.playerCount >= 2 ? 'El otro jugador puede continuar.' : ''}`);

    if (this.getLivingPlayers().length === 0) this.gameOver(false);
  }

  tryUseCondorPlate(player) {
    let owner = player.plates > 0 ? player : null;
    if (!owner && this.playerCount >= 2) owner = this.players.find((p) => p !== player && p.active && p.plates > 0);
    if (!owner) return false;

    owner.plates -= 1;
    player.lives = 1;
    player.active = true;
    player.sprite.enableBody(true, player.spawn.x, player.spawn.y, true, true);
    player.sprite.setVelocity(0, -180);
    player.sprite.setAlpha(1).setTint(player.tint);
    player.invulnerableUntil = this.time.now + 1600;
    this.flashPlayer(player);
    this.showMessage(owner === player
      ? `${player.label} usó una placa del cóndor y obtuvo una vida extra.`
      : `${owner.label} usó una placa del cóndor para revivir a ${player.label}.`);
    return true;
  }

  updateDoorState(force) {
    if (!this.goal || this.level === 4) return;
    const shouldOpen = this.enemiesKilled >= this.requiredKills;
    if (!force && shouldOpen === this.doorOpen) return;
    this.doorOpen = shouldOpen;
    if (this.doorOpen) {
      this.goal.clearTint().setAlpha(1);
      this.doorHalo?.setAlpha(0.32);
    } else {
      this.goal.setTint(0x777777).setAlpha(0.55);
      this.doorHalo?.setAlpha(0.12);
    }
  }

  tryCompleteLevel(player) {
    if (!player.active || this.changingLevel) return;
    if (!this.doorOpen) {
      const left = Math.max(0, this.requiredKills - this.enemiesKilled);
      this.showMessage(`Puerta cerrada: derrota ${left} enemigo(s) más o esquívalos hasta poder abrirla.`);
      return;
    }
    this.completeLevel();
  }

  completeLevel() {
    if (this.changingLevel) return;
    this.changingLevel = true;
    AudioManager.play(this, 'sfx_checkpoint', { volume: 0.75 });
    this.score += 300 + this.timeLeft * 5;
    this.cameras.main.fadeOut(700, 10, 10, 20);
    this.time.delayedCall(760, () => {
      const nextLevel = this.level >= 3 ? 4 : this.level + 1;

      StorageManager.unlockLevel(nextLevel);

      this.scene.start('GameScene', {
        ...this.makeSaveData(false),
        level: nextLevel,
        enemiesKilled: 0,
      });
    });
  }

  gameOver(won) {
    this.physics.pause();
    this.time.delayedCall(900, () => this.scene.start('GameOverScene', this.makeSaveData(won)));
  }

  makeSaveData(won = false) {
    const playersState = this.players.map((p, idx) => ({
      id: idx + 1,
      lives: Math.max(0, p.lives),
      feathers: p.feathers,
      crystals: p.crystals,
      plates: p.plates,
      alive: p.active && p.lives > 0,
    }));
    const p1 = playersState[0] || { lives: 3, feathers: 0, crystals: 0, plates: 0 };
    return {
      level: this.level,
      score: this.score,
      lives: p1.lives,
      feathers: p1.feathers,
      crystals: p1.crystals,
      plates: p1.plates,
      playerCount: this.playerCount,
      playersState,
      characterId: this.characterId,
      characterName: this.characterName,
      won,
    };
  }

  openPause() {
    if (this.scene.isActive('PauseScene')) return;
    this.scene.launch('PauseScene', { gameSceneKey: 'GameScene' });
    this.scene.pause();
  }

  toggleInventory() {
    this.inventoryOpen = !this.inventoryOpen;
    this.inventoryPanel.setVisible(this.inventoryOpen);
    this.inventoryTitle.setVisible(this.inventoryOpen);
    this.inventoryText.setVisible(this.inventoryOpen);
    if (this.inventoryOpen) this.updateInventoryText();
  }

  updateInventoryText() {
    const lines = this.players.map((p) => (
      `${p.label} ${p.active ? 'activo' : 'caído'}\n` +
      `❤️ Vidas: ${p.lives}   🪶 Plumas: ${p.feathers}   💎 Cristales: ${p.crystals}   🛡 Placas cóndor: ${p.plates}`
    ));
    this.inventoryText.setText(
      `${lines.join('\n\n')}\n\n` +
      'La placa del cóndor revive a un compañero.\n' +
      'En modo 1 jugador suma una vida al caer.'
    );
  }

  tickTimer() {
    this.timeLeft -= 1;
    if (this.timeLeft <= 0) this.gameOver(false);
  }

  updateHUD() {
    if (!this.hud) return;
    const p1 = this.players[0];
    const p2 = this.players[1];
    const p1Hud = `P1 ❤️${p1?.lives ?? 0} 🪶${p1?.feathers ?? 0} 💎${p1?.crystals ?? 0} 🛡${p1?.plates ?? 0}`;
    const p2Hud = p2 ? `   P2 ❤️${p2.lives} 🪶${p2.feathers} 💎${p2.crystals} 🛡${p2.plates}` : '';
    const kills = this.level === 4 ? 'Boss final' : `Puerta: ${Math.min(this.enemiesKilled, this.requiredKills)}/${this.requiredKills} enemigos`;
    this.hud.setText(`${p1Hud}${p2Hud}   ⭐ ${this.score}   ⏱ ${this.timeLeft}s   ${kills}   ${this.levelDef.name}`);
    if (this.inventoryOpen) this.updateInventoryText();
    if (this.statusText && this.time.now > this.messageUntil) this.statusText.setText('');
  }

  updateMinimap() {
    if (!this.minimap) return;
    const x = 990, y = 66, w = 260, h = 72;
    this.minimap.clear();
    this.minimap.fillStyle(0x0f172a, 0.72).fillRoundedRect(x, y, w, h, 8);
    this.minimap.lineStyle(2, COLORS.gold, 0.9).strokeRoundedRect(x, y, w, h, 8);
    const sx = w / this.worldWidth, sy = h / this.worldHeight;
    this.getGroupChildren(this.platforms).forEach((platform) => {
      const pw = platform.displayWidth || platform.width || 10;
      this.minimap.fillStyle(0x6b7280, 0.65)
        .fillRect(x + (platform.x - pw / 2) * sx, y + platform.y * sy, Math.max(4, pw * sx), 3);
    });
    this.getGroupChildren(this.enemies).forEach((enemy) => {
      if (!enemy?.active) return;
      this.minimap.fillStyle(enemy === this.boss ? COLORS.danger : COLORS.goldDark, 1)
        .fillCircle(x + enemy.x * sx, y + enemy.y * sy, enemy === this.boss ? 5 : 3);
    });
    this.players.forEach((p, i) => {
      if (!p.sprite.active || !p.active) return;
      this.minimap.fillStyle(i === 0 ? COLORS.gold : COLORS.cyan, 1)
        .fillCircle(x + p.sprite.x * sx, y + p.sprite.y * sy, 4);
    });
    if (this.goal) this.minimap.fillStyle(this.doorOpen ? COLORS.green : COLORS.danger, 1).fillCircle(x + this.goal.x * sx, y + this.goal.y * sy, 4);
  }

  updateBossBar() {
    if (!this.bossBar) return;
    this.bossBar.clear();
    if (this.level !== 4 || !this.bossData) return;
    const x = 365, y = 58, w = 550, h = 18;
    this.bossBar.fillStyle(0x111827, 0.88).fillRoundedRect(x, y, w, h, 6);
    this.bossBar.fillStyle(COLORS.danger, 0.95)
      .fillRoundedRect(x + 3, y + 3, Math.max(0, (w - 6) * (this.bossData.hp / this.bossData.maxHp)), h - 6, 5);
    this.bossBar.lineStyle(2, COLORS.gold).strokeRoundedRect(x, y, w, h, 6);
  }

  cleanupFalls() {
    this.players.forEach((player) => {
      if (player.active && player.sprite.y > 805) {
        player.sprite.setPosition(player.spawn.x, player.spawn.y);
        player.sprite.setVelocity(0, 0);
        this.damagePlayer(player);
      }
    });
  }

  showMessage(text, duration = 2500) {
    if (!this.statusText) return;
    this.statusText.setText(text);
    this.messageUntil = this.time.now + duration;
  }

  getGroupChildren(group) {
    if (!group) return [];
    if (typeof group.getChildren === 'function') return group.getChildren();
    if (Array.isArray(group.children?.entries)) return group.children.entries;
    if (Array.isArray(group.children)) return group.children;
    return [];
  }
}
