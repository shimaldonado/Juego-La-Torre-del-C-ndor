import Phaser from 'phaser';
import { CHARACTERS, COLORS, LEVELS } from '../config/constants.js';
import { SaveManager } from '../managers/SaveManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { EntityManager } from '../ecs/EntityManager.js';
import { Components } from '../ecs/components.js';
import { runPatrolAndAISystem } from '../ecs/systems.js';

const LEVEL_PLANS = {
  1: {
    worldWidth: 3200,
    start: { x: 130, y: 560 },
    goal: { x: 3060, y: 558 },
    requiredKills: 3,
    platforms: [
      { x: 360, y: 650, w: 720, h: 40 },
      { x: 1160, y: 650, w: 620, h: 40 },
      { x: 1970, y: 650, w: 880, h: 40 },
      { x: 2860, y: 650, w: 620, h: 40 },
      { x: 1180, y: 505, w: 520, h: 34 },
      { x: 2210, y: 505, w: 680, h: 34 },
    ],
    ladders: [
      { x: 890, fromY: 630, toY: 488 },
      { x: 2440, fromY: 630, toY: 488 },
    ],
    enemies: [
      { type: 'guardian', x: 760, y: 560, minX: 560, maxX: 920 },
      { type: 'guardian', x: 1530, y: 560, minX: 1280, maxX: 1760 },
      { type: 'guardian', x: 2360, y: 560, minX: 2060, maxX: 2580 },
      { type: 'guardian', x: 2710, y: 560, minX: 2550, maxX: 2970 },
    ],
    collectibles: [
      { type: 'feather', x: 520, y: 580 }, { type: 'crystal', x: 1030, y: 580 },
      { type: 'feather', x: 1220, y: 440 }, { type: 'plate', x: 1460, y: 440 },
      { type: 'feather', x: 1980, y: 580 }, { type: 'crystal', x: 2240, y: 440 },
      { type: 'feather', x: 2650, y: 580 },
    ],
    hazards: [{ x: 1830, y: 614 }, { x: 2525, y: 614 }],
  },
  2: {
    worldWidth: 3600,
    start: { x: 130, y: 560 },
    goal: { x: 3440, y: 558 },
    requiredKills: 4,
    platforms: [
      { x: 330, y: 650, w: 660, h: 40 },
      { x: 1050, y: 650, w: 520, h: 40 },
      { x: 1740, y: 650, w: 700, h: 40 },
      { x: 2580, y: 650, w: 760, h: 40 },
      { x: 3370, y: 650, w: 420, h: 40 },
      { x: 910, y: 500, w: 500, h: 34 },
      { x: 1890, y: 485, w: 620, h: 34 },
      { x: 2890, y: 505, w: 590, h: 34 },
    ],
    ladders: [
      { x: 760, fromY: 630, toY: 483 },
      { x: 2060, fromY: 630, toY: 468 },
      { x: 3080, fromY: 630, toY: 488 },
    ],
    enemies: [
      { type: 'guardian', x: 640, y: 560, minX: 440, maxX: 780 },
      { type: 'bat', x: 1070, y: 430, minX: 820, maxX: 1130 },
      { type: 'guardian', x: 1760, y: 560, minX: 1480, maxX: 2040 },
      { type: 'bat', x: 2220, y: 420, minX: 1920, maxX: 2460 },
      { type: 'guardian', x: 2830, y: 560, minX: 2500, maxX: 3140 },
    ],
    collectibles: [
      { type: 'feather', x: 420, y: 580 }, { type: 'crystal', x: 950, y: 580 },
      { type: 'feather', x: 900, y: 435 }, { type: 'plate', x: 1910, y: 420 },
      { type: 'crystal', x: 2140, y: 420 }, { type: 'feather', x: 2680, y: 580 },
      { type: 'crystal', x: 2980, y: 440 }, { type: 'feather', x: 3340, y: 580 },
    ],
    hazards: [{ x: 1280, y: 614 }, { x: 2350, y: 614 }, { x: 3180, y: 614 }],
  },
  3: {
    worldWidth: 3800,
    start: { x: 130, y: 560 },
    goal: { x: 3640, y: 558 },
    requiredKills: 5,
    platforms: [
      { x: 380, y: 650, w: 760, h: 40 },
      { x: 1220, y: 650, w: 580, h: 40 },
      { x: 2050, y: 650, w: 850, h: 40 },
      { x: 3010, y: 650, w: 780, h: 40 },
      { x: 3650, y: 650, w: 360, h: 40 },
      { x: 1120, y: 495, w: 620, h: 34 },
      { x: 2310, y: 480, w: 760, h: 34 },
      { x: 3220, y: 510, w: 520, h: 34 },
    ],
    ladders: [
      { x: 850, fromY: 630, toY: 478 },
      { x: 2160, fromY: 630, toY: 463 },
      { x: 3330, fromY: 630, toY: 493 },
    ],
    enemies: [
      { type: 'guardian', x: 700, y: 560, minX: 480, maxX: 900 },
      { type: 'bat', x: 1110, y: 420, minX: 820, maxX: 1390 },
      { type: 'condor', x: 1650, y: 510, minX: 1320, maxX: 1920 },
      { type: 'guardian', x: 2240, y: 560, minX: 1940, maxX: 2560 },
      { type: 'bat', x: 2680, y: 410, minX: 2320, maxX: 3050 },
      { type: 'condor', x: 3230, y: 450, minX: 2980, maxX: 3500 },
    ],
    collectibles: [
      { type: 'feather', x: 520, y: 580 }, { type: 'crystal', x: 1080, y: 430 },
      { type: 'plate', x: 1330, y: 430 }, { type: 'feather', x: 1780, y: 580 },
      { type: 'crystal', x: 2240, y: 415 }, { type: 'feather', x: 2460, y: 415 },
      { type: 'crystal', x: 3040, y: 580 }, { type: 'feather', x: 3260, y: 445 },
      { type: 'plate', x: 3500, y: 580 },
    ],
    hazards: [{ x: 1480, y: 614 }, { x: 2740, y: 614 }, { x: 3360, y: 614 }],
  },
};

export class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  init(data = {}) {
    this.level = data.level || 1;
    this.score = data.score || 0;
    this.playerCount = Math.max(1, Math.min(2, data.playerCount || data.mode || 1));
    this.characterId = data.characterId || 'auki';
    this.characterName = data.characterName || CHARACTERS[this.characterId]?.name || 'Auki';
    this.playersState = this.normalizePlayersState(data);
    this.fromSave = Boolean(data.fromSave);
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

  create() {
    this.levelDef = LEVELS.find((item) => item.id === this.level) || LEVELS[0];
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

    this.setupWorld();
    this.createGroups();
    if (this.level === 4) this.createBossArena();
    else this.createFlatLevel();
    this.createPlayers();
    this.createCollisions();
    this.createUI();
    this.createKeyboard();
    this.applyVisualEffects();
    this.updateDoorState(true);

    AudioManager.music(this, this.level === 4 ? 'music_boss' : 'music_level');
    this.levelTimer = this.time.addEvent({ delay: 1000, loop: true, callback: () => this.tickTimer() });
  }

  // ─── Mundo y nivel ──────────────────────────────────────────────────────────

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
    if (this.level !== 1 || !SaveManager.getSettings().showHelp) return;
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

    this.boss = this.enemies.create(1510, 535, 'kunturax_idle').play('boss_idle');
    this.boss.setScale(0.92).setCollideWorldBounds(true).setDepth(10);
    this.boss.body.setSize(100, 136).setOffset(64, 82);
    this.bossData = { hp: 12, maxHp: 12, state: 'idle', nextShoot: 0 };
    this.boss.setData('hp', this.bossData.hp);
    this.boss.setData('type', 'boss');
    const id = this.ecs.create();
    this.ecs
      .add(id, Components.Sprite, this.boss)
      .add(id, Components.Health, this.bossData)
      .add(id, Components.EnemyAI, { detectionRadius: 999, chaseSpeed: 70 })
      .add(id, Components.Patrol, { minX: 1220, maxX: 1740, speed: 55, direction: -1 });
  }

  createPlatform(x, y, width, height) {
    const platform = this.add.rectangle(x, y, width, height, 0x3f3f46)
      .setStrokeStyle(2, 0xffcc5c, 0.72)
      .setDepth(1);
    this.physics.add.existing(platform, true);
    platform.body.setSize(width, height);
    platform.body.updateFromGameObject();
    this.platforms.add(platform);
    this.platformVisuals.push(platform);

    this.add.rectangle(x, y - height / 2 - 3, width, 6, 0xffcc5c, 0.65).setDepth(2);
    if (this.textures.exists('pasto_andino')) {
      for (let gx = x - width / 2 + 35; gx < x + width / 2; gx += 70) {
        this.add.image(gx, y - height / 2 - 17, 'pasto_andino').setScale(0.52).setDepth(3).setAlpha(0.9);
      }
    }
    return platform;
  }

  createLadder(x, fromY, toY) {
    const height = Math.abs(fromY - toY) + 42;
    const y = (fromY + toY) / 2;
    const g = this.add.graphics().setDepth(4);
    g.lineStyle(5, 0xb7832f, 0.96);
    g.lineBetween(x - 22, y - height / 2, x - 22, y + height / 2);
    g.lineBetween(x + 22, y - height / 2, x + 22, y + height / 2);
    for (let yy = y - height / 2 + 18; yy < y + height / 2; yy += 27) g.lineBetween(x - 25, yy, x + 25, yy);
    this.ladders.push({ rect: new Phaser.Geom.Rectangle(x - 38, y - height / 2, 76, height), visual: g });
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
    const hazard = this.hazards.create(x, y, this.textures.exists('pinchos_piedra') ? 'pinchos_piedra' : 'cristal_andino')
      .setScale(0.86).setDepth(5);
    hazard.body.allowGravity = true;
    hazard.body.immovable = true;
    hazard.body.setSize(52, 24).setOffset(6, 6);
    return hazard;
  }

  createEnemy(type, x, y, minX, maxX) {
    let sprite;
    if (type === 'bat') {
      sprite = this.enemies.create(x, y - 70, 'murcielago_volar').play('bat_fly');
      sprite.body.allowGravity = false;
      sprite.setScale(0.64);
      sprite.body.setSize(68, 40).setOffset(40, 35);
    } else if (type === 'condor') {
      sprite = this.enemies.create(x, y - 80, 'condor_volar').play('condor_fly');
      sprite.body.allowGravity = false;
      sprite.setScale(0.72);
      sprite.body.setSize(90, 58).setOffset(50, 38);
    } else {
      sprite = this.enemies.create(x, y, 'guardian_caminar').play('guardian_walk');
      sprite.setScale(0.78);
      sprite.body.setSize(58, 88).setOffset(48, 58);
    }
    sprite.setCollideWorldBounds(true).setDepth(8);
    sprite.setData('type', type);
    sprite.setData('hp', type === 'guardian' ? 2 : 1);
    const id = this.ecs.create();
    this.ecs
      .add(id, Components.Sprite, sprite)
      .add(id, Components.Health, { hp: sprite.getData('hp') })
      .add(id, Components.EnemyAI, { detectionRadius: type === 'guardian' ? 240 : 300, chaseSpeed: type === 'guardian' ? 90 : 115 })
      .add(id, Components.Patrol, { minX, maxX, speed: type === 'guardian' ? 62 : 92, direction: Math.random() > 0.5 ? 1 : -1 });
    return sprite;
  }

  createGoal(x, y) {
    this.goal = this.physics.add.staticImage(x, y, this.textures.exists('puerta_torre') ? 'puerta_torre' : 'estatua_condor')
      .setScale(0.9).setDepth(6);
    this.goal.body.setSize(70, 104).setOffset(10, 8);
    if (this.goal.refreshBody) this.goal.refreshBody();
    this.goal.setAlpha(0.55).setTint(0x777777);
    this.doorHalo = this.add.circle(x, y + 6, 70, 0xffcc5c, 0.12).setDepth(5).setAlpha(0.25);
    this.tweens.add({ targets: [this.goal, this.doorHalo], scale: '+=0.04', duration: 950, yoyo: true, repeat: -1 });
  }

  // ─── Jugadores ──────────────────────────────────────────────────────────────

  createPlayers() {
    this.players = [];
    const start = this.plan?.start || { x: 130, y: 560 };
    const p1 = this.createPlayer(start.x, start.y, this.character, 'P1', 0xffffff, this.playersState[0]);
    this.players.push(p1);

    if (this.playerCount >= 2) {
      const p2char = { ...this.character, speed: this.character.speed * 0.95, jump: this.character.jump * 0.98 };
      const p2 = this.createPlayer(start.x + 58, start.y, p2char, 'P2', 0x9be7ff, this.playersState[1]);
      this.players.push(p2);
    }

    this.setCameraTarget(this.players[0]);
    this.cameras.main.setDeadzone(220, 120);
  }

  createPlayer(x, y, character, label, tint, state) {
    const sprite = this.physics.add.sprite(x, y, 'heroe_idle')
      .setScale(0.72).setDepth(12).setTint(tint || character.tint);
    sprite.setCollideWorldBounds(false);
    sprite.body.setSize(46, 98).setOffset(52, 54);
    const name = this.add.text(x, y - 72, label, {
      fontSize: '15px', color: label === 'P1' ? '#ffcc5c' : '#67e8f9', fontStyle: 'bold', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(30);
    return {
      sprite,
      name,
      character,
      label,
      tint,
      active: state?.alive !== false && (state?.lives ?? 3) > 0,
      lives: state?.lives ?? 3,
      feathers: state?.feathers || 0,
      crystals: state?.crystals || 0,
      plates: state?.plates || 0,
      attackingUntil: 0,
      invulnerableUntil: 0,
      spawn: { x, y },
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
    this.physics.add.collider(this.enemies, this.platforms);
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
  }

  createUI() {
    this.uiBg = this.add.rectangle(640, 26, 1280, 52, 0x0f172a, 0.8).setScrollFactor(0).setDepth(50);
    this.hud = this.add.text(18, 10, '', {
      fontSize: '18px', color: '#fff3bf', fontStyle: 'bold', stroke: '#000', strokeThickness: 3,
    }).setScrollFactor(0).setDepth(51);
    this.help = this.add.text(640, 56,
      this.playerCount >= 2
        ? 'P1 A/D + ESPACIO saltar + E atacar · P2 ←/→ + SHIFT saltar + ENTER atacar · W/S o ↑/↓ escaleras · I/O Inventario · ESC Pausa'
        : 'A/D moverse · ESPACIO saltar · E atacar · W/S escaleras · I Inventario · M Sonido · ESC Pausa',
      { fontSize: '15px', color: '#c7f9ff', stroke: '#000', strokeThickness: 3 }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(51);

    this.pauseButton = this.add.rectangle(1220, 25, 92, 36, 0x23124d, 0.9)
      .setStrokeStyle(2, COLORS.gold).setInteractive({ useHandCursor: true }).setScrollFactor(0).setDepth(52);
    this.pauseLabel = this.add.text(1220, 25, 'PAUSA', { fontSize: '17px', color: '#fff3bf', fontStyle: 'bold' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(53);
    this.pauseButton.on('pointerdown', () => this.openPause());

    this.statusText = this.add.text(640, 96, '', {
      fontSize: '18px', color: '#fff3bf', align: 'center', stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(52);

    this.inventoryPanel = this.add.rectangle(640, 360, 650, 330, 0x0f172a, 0.95)
      .setStrokeStyle(3, COLORS.gold).setScrollFactor(0).setDepth(60).setVisible(false);
    this.inventoryTitle = this.add.text(640, 220, '🎒 INVENTARIOS  [I/O para cerrar]', {
      fontSize: '23px', color: '#ffcc5c', fontStyle: 'bold', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(61).setVisible(false);
    this.inventoryText = this.add.text(350, 265, '', {
      fontSize: '19px', color: '#fff3bf', lineSpacing: 12,
    }).setScrollFactor(0).setDepth(61).setVisible(false);

    this.minimap = this.add.graphics().setScrollFactor(0).setDepth(55);
    this.bossBar = this.add.graphics().setScrollFactor(0).setDepth(55);
    this.updateHUD();
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
    this.updatePlayer(this.players[0], {
      left: this.keys.a, right: this.keys.d, up: this.keys.w, down: this.keys.s, jump: this.keys.space, attack: this.keys.e,
    }, time);

    if (this.players[1]) {
      this.updatePlayer(this.players[1], {
        left: this.cursors.left, right: this.cursors.right, up: this.cursors.up, down: this.cursors.down, jump: this.keys.shift, attack: this.keys.enter,
      }, time);
    }
  }

  updatePlayer(player, controls, time) {
    if (!player?.sprite?.active || !player.active || player.lives <= 0) return;
    const { sprite, character } = player;
    const onLadder = this.isOnLadder(sprite);
    const left = controls.left.isDown;
    const right = controls.right.isDown;
    const up = controls.up.isDown;
    const down = controls.down.isDown;

    sprite.setVelocityX(0);
    if (left) sprite.setVelocityX(-character.speed);
    if (right) sprite.setVelocityX(character.speed);
    if (left || right) sprite.setFlipX(left);

    if (onLadder && (up || down)) {
      sprite.body.allowGravity = false;
      sprite.setVelocityY(up ? -185 : 185);
    } else if (onLadder && Math.abs(sprite.body.velocity.y) < 45) {
      sprite.body.allowGravity = false;
      sprite.setVelocityY(0);
    } else {
      sprite.body.allowGravity = true;
    }

    if (Phaser.Input.Keyboard.JustDown(controls.jump) && (sprite.body.blocked.down || onLadder)) {
      sprite.body.allowGravity = true;
      sprite.setVelocityY(-character.jump);
      AudioManager.play(this, 'sfx_jump', { volume: 0.55 });
    }

    if (Phaser.Input.Keyboard.JustDown(controls.attack)) {
      player.attackingUntil = time + 250;
      this.tryAttackEnemy(player);
      this.tryAttackBoss(player);
    }

    if (sprite.body.blocked.down && sprite.x > player.spawn.x + 320) player.spawn = { x: sprite.x, y: sprite.y };

    if (time < player.attackingUntil) sprite.play('hero_hit', true);
    else if (!sprite.body.blocked.down && sprite.body.velocity.y < -30) sprite.play('hero_jump', true);
    else if (!sprite.body.blocked.down && sprite.body.velocity.y > 60) sprite.play('hero_fall', true);
    else if (Math.abs(sprite.body.velocity.x) > 10) sprite.play('hero_run', true);
    else { sprite.anims.stop(); sprite.setTexture('heroe_idle'); }
  }

  isOnLadder(sprite) {
    const b = sprite.body;
    const bodyRect = new Phaser.Geom.Rectangle(b.x + 8, b.y + 10, b.width - 16, b.height - 20);
    return this.ladders.some((l) => Phaser.Geom.Rectangle.Overlaps(bodyRect, l.rect));
  }

  updateNames() {
    this.players.forEach((p) => {
      p.name.setPosition(p.sprite.x, p.sprite.y - 72);
      p.name.setVisible(Boolean(p.sprite.active && p.active));
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
      this.defeatEnemy(enemy, 120);
      player.sprite.setVelocityY(-330);
      AudioManager.play(this, 'sfx_hit', { volume: 0.55 });
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
    const cx = player.sprite.x + (player.sprite.flipX ? -62 : 62);
    const range = new Phaser.Geom.Circle(cx, player.sprite.y, 78);
    this.getGroupChildren(this.enemies).forEach((enemy) => {
      if (!enemy?.active || enemy === this.boss) return;
      if (Phaser.Geom.Circle.Contains(range, enemy.x, enemy.y)) this.defeatEnemy(enemy, 130);
    });
  }

  defeatEnemy(enemy, points) {
    if (!enemy?.active) return;
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
    if (time > this.bossData.nextShoot) {
      this.bossData.nextShoot = time + 1500;
      this.boss.play('boss_attack', true);
      this.time.delayedCall(420, () => this.boss?.play('boss_idle', true));
      this.shootBossProjectile();
    }
  }

  shootBossProjectile() {
    const target = this.getLivingPlayers()[0]?.sprite;
    if (!target) return;
    const proj = this.projectiles.create(this.boss.x - 80, this.boss.y - 35, 'cristal_andino')
      .setTint(0xff5c7a).setScale(0.58).setDepth(13);
    proj.body.setSize(28, 28).setOffset(10, 10);
    this.physics.moveToObject(proj, target, 260);
    this.tweens.add({ targets: proj, angle: 360, duration: 850, repeat: -1 });
    this.time.delayedCall(4200, () => proj?.destroy());
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
    if (!player.active || now < player.invulnerableUntil) return;
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
      this.scene.start('GameScene', { ...this.makeSaveData(false), level: nextLevel, enemiesKilled: 0 });
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
    this.scene.launch('PauseScene', { gameSceneKey: 'GameScene', saveData: this.makeSaveData(false) });
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
    this.inventoryText.setText(`${lines.join('\n\n')}\n\nLa placa del cóndor revive a un compañero. En modo 1 jugador suma una vida al caer.`);
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
