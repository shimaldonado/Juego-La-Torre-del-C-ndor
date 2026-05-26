import Phaser from 'phaser';
import { CHARACTERS, COLORS, LEVELS } from '../config/constants.js';
import { SaveManager } from '../managers/SaveManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { EntityManager } from '../ecs/EntityManager.js';
import { Components } from '../ecs/components.js';
import { runPatrolAndAISystem } from '../ecs/systems.js';

export class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  init(data) {
    this.level        = data.level        || 1;
    this.score        = data.score        || 0;
    this.lives        = data.lives        ?? 3;
    this.feathers     = data.feathers     || 0;
    this.crystals     = data.crystals     || 0;
    this.characterId  = data.characterId  || 'auki';
    this.characterName = data.characterName || CHARACTERS[this.characterId]?.name || 'Auki';
    this.fromSave     = Boolean(data.fromSave);
    // reset flags
    this.changingLevel     = false;
    this.invulnerableUntil = 0;
    this.bossAttackCooldown = 0;
  }

  create() {
    this.levelDef   = LEVELS.find((item) => item.id === this.level) || LEVELS[0];
    this.character  = CHARACTERS[this.characterId] || CHARACTERS.auki;
    this.worldWidth  = this.level === 4 ? 1280 : 2600;
    this.worldHeight = 720;
    this.timeLeft    = this.levelDef.time;
    this.ecs         = new EntityManager();
    this.inventoryOpen = false;

    this.setupWorld();
    this.createGroups();
    if (this.level === 4) this.createBossArena();
    else this.createProceduralLevel();
    this.createPlayers();
    this.createCollisions();
    this.createUI();
    this.createKeyboard();
    this.applyVisualEffects();

    AudioManager.music(this, this.level === 4 ? 'music_boss' : 'music_level');
    this.levelTimer = this.time.addEvent({ delay: 1000, loop: true, callback: () => this.tickTimer() });
  }

  // ─── World ──────────────────────────────────────────────────────────────────

  setupWorld() {
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.add.image(0, 0, this.levelDef.bg).setOrigin(0).setScrollFactor(0).setDisplaySize(1280, 720);
    this.add.rectangle(640, 360, 1280, 720, 0x0f172a, 0.18).setScrollFactor(0);

    const parallax = this.add.graphics().setScrollFactor(0.25);
    parallax.fillStyle(0x1e1b4b, 0.22);
    for (let i = 0; i < 9; i++) {
      const bx = i * 340 - 80;
      parallax.fillTriangle(bx, 620, bx + 170, 330 + (i % 3) * 25, bx + 360, 620);
    }
  }

  createGroups() {
    // *** FIX: usar staticGroup para plataformas con física estática correcta ***
    this.platforms   = this.physics.add.staticGroup();
    this.ladders     = [];
    this.collectibles = this.physics.add.group({ allowGravity: false, immovable: true });
    this.hazards      = this.physics.add.group({ allowGravity: false, immovable: true });
    this.enemies      = this.physics.add.group({ allowGravity: true,  immovable: false });
    this.projectiles  = this.physics.add.group({ allowGravity: false, immovable: true });
  }

  // ─── Level construction ──────────────────────────────────────────────────────

  createProceduralLevel() {
    const seed = new Phaser.Math.RandomDataGenerator([`torre-condor-${this.level}`]);
    const floors = [650, 540, 430, 320, 210];
    const platformSets = [
      [[620, 1120], [1750, 1500]],
      [[620 + seed.between(-40, 40), 980], [1830, 820]],
      [[560, 840], [1540, 1060], [2380, 380]],
      [[840, 1120], [2150, 760]],
      [[1460, 1620]],
    ];

    floors.forEach((y, row) => {
      platformSets[row].forEach(([x, width]) => this.createPlatform(x, y, width, 34));
      this.createDecoration(row, y, seed);
    });

    const ladderPlan = [
      { x: 520,  from: 650, to: 540 },
      { x: 1440, from: 540, to: 430 },
      { x: 900,  from: 430, to: 320 },
      { x: 2080, from: 320, to: 210 },
    ];
    ladderPlan.forEach((l) => this.createLadder(l.x + seed.between(-25, 25), l.from, l.to));

    this.spawnCollectibles(floors, seed);
    this.spawnHazards(floors, seed);
    this.spawnEnemies(floors, seed);
    this.createGoal(2390, 152);

    if (this.level === 1 && SaveManager.getSettings().showHelp) {
      this.add.image(420, 480, 'tutorial_escalera').setScale(0.72).setDepth(3);
    }
  }

  createBossArena() {
    this.createPlatform(640, 650, 1280, 38);
    this.createPlatform(260, 495, 360, 28);
    this.createPlatform(1020, 495, 360, 28);
    this.createPlatform(640, 350, 400, 28);
    this.createLadder(640, 650, 350);

    for (let i = 0; i < 8; i++) this.createCollectible(170 + i * 130, 595, 'pluma_dorada', 'feather');
    for (let i = 0; i < 4; i++) this.createHazard(340 + i * 210, 622);

    this.boss = this.enemies.create(920, 520, 'kunturax_idle').play('boss_idle');
    this.boss.setScale(1.08).setCollideWorldBounds(true).setDepth(10);
    this.boss.body.setSize(110, 145).setOffset(60, 72);
    this.bossData = { hp: 12, maxHp: 12, state: 'idle', nextShoot: 0 };
    this.bossEcsId = this.ecs.create();
    this.ecs
      .add(this.bossEcsId, Components.Sprite,   this.boss)
      .add(this.bossEcsId, Components.Health,   this.bossData)
      .add(this.bossEcsId, Components.EnemyAI,  { detectionRadius: 999, chaseSpeed: 85 })
      .add(this.bossEcsId, Components.Patrol,   { minX: 760, maxX: 1120, speed: 70, direction: -1 });
  }

  createDecoration(row, y, seed) {
    const xs = [260 + seed.between(0, 60), 980 + seed.between(-60, 60), 1880 + seed.between(-70, 70)];
    xs.forEach((x, i) => {
      const torch = this.add.image(x, y - 72, i % 2 === 0 ? 'antorcha' : 'roca')
        .setScale(i % 2 === 0 ? 0.9 : 0.8).setDepth(2);
      if (i % 2 === 0) {
        this.tweens.add({ targets: torch, alpha: 0.65, duration: 600, yoyo: true, repeat: -1 });
      }
    });
  }

  createPlatform(x, y, width, height) {
    // *** FIX: crear rectángulo visual + cuerpo estático por separado ***
    // Visual
    const visual = this.add.rectangle(x, y, width, height, 0x3f3f46).setStrokeStyle(3, 0xffcc5c, 0.7).setDepth(1);
    // Cuerpo físico estático
    const body = this.physics.add.image(x, y, '__DEFAULT').setAlpha(0).setDepth(0);
    body.displayWidth  = width;
    body.displayHeight = height;
    body.body.setSize(width, height);
    body.body.allowGravity = false;
    body.body.immovable    = true;
    this.platforms.add(body, true);
    // Borde dorado superior
    this.add.rectangle(x, y - height / 2 - 3, width, 6, 0xffcc5c, 0.55).setDepth(2);
    return body;
  }

  createLadder(x, fromY, toY) {
    const height = Math.abs(fromY - toY) + 40;
    const y = (fromY + toY) / 2;
    const g = this.add.graphics().setDepth(2);
    g.lineStyle(5, 0xb7832f, 0.95);
    g.lineBetween(x - 22, y - height / 2, x - 22, y + height / 2);
    g.lineBetween(x + 22, y - height / 2, x + 22, y + height / 2);
    for (let yy = y - height / 2 + 18; yy < y + height / 2; yy += 28) {
      g.lineBetween(x - 25, yy, x + 25, yy);
    }
    this.ladders.push({ rect: new Phaser.Geom.Rectangle(x - 34, y - height / 2, 68, height), visual: g });
  }

  spawnCollectibles(floors, seed) {
    floors.forEach((y, row) => {
      const count = 3 + this.level;
      for (let i = 0; i < count; i++) {
        const x = 260 + i * 260 + row * 40 + seed.between(-45, 45);
        if (x < this.worldWidth - 160) {
          this.createCollectible(x, y - 58, i % 3 === 0 ? 'cristal_andino' : 'pluma_dorada', i % 3 === 0 ? 'crystal' : 'feather');
        }
      }
    });
  }

  createCollectible(x, y, texture, type) {
    const item = this.collectibles.create(x, y, texture)
      .setScale(type === 'crystal' ? 0.78 : 0.84).setDepth(5);
    item.body.setCircle(type === 'crystal' ? 26 : 22, 10, 10);
    item.itemType = type;
    this.tweens.add({ targets: item, y: y - 10, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: item, angle: 360, duration: 3000, repeat: -1 });
    return item;
  }

  spawnHazards(floors, seed) {
    floors.slice(1, 4).forEach((y, row) => {
      for (let i = 0; i < this.level; i++) {
        this.createHazard(800 + row * 360 + i * 330 + seed.between(-70, 70), y - 28);
      }
    });
  }

  createHazard(x, y) {
    const hazard = this.hazards.create(x, y, 'cristal_andino')
      .setTint(0xef4444).setScale(0.75).setDepth(4);
    hazard.body.setSize(48, 48).setOffset(25, 25);
    this.tweens.add({ targets: hazard, alpha: 0.55, duration: 450, yoyo: true, repeat: -1 });
  }

  spawnEnemies(floors, seed) {
    const normalTypes = this.levelDef.enemies.filter((t) => t !== 'boss');
    for (let i = 0; i < 2 + this.level; i++) {
      const y    = floors[1 + (i % 3)] - 70;
      const x    = 650 + i * 330 + seed.between(-80, 80);
      const type = normalTypes[i % normalTypes.length] || 'guardian';
      this.createEnemy(type, x, y, x - 150, x + 150);
    }
  }

  createEnemy(type, x, y, minX, maxX) {
    let sprite;
    if (type === 'bat') {
      sprite = this.enemies.create(x, y - 35, 'murcielago_volar').play('bat_fly');
      sprite.body.allowGravity = false;
      sprite.setScale(0.85);
      sprite.body.setSize(72, 44).setOffset(38, 34);
    } else if (type === 'condor') {
      sprite = this.enemies.create(x, y - 50, 'condor_volar').play('condor_fly');
      sprite.body.allowGravity = false;
      sprite.setScale(0.92);
      sprite.body.setSize(92, 62).setOffset(48, 38);
    } else {
      sprite = this.enemies.create(x, y, 'guardian_caminar').play('guardian_walk');
      sprite.setScale(0.96);
      sprite.body.setSize(68, 96).setOffset(44, 54);
    }
    sprite.setCollideWorldBounds(true).setDepth(6);
    const id = this.ecs.create();
    this.ecs
      .add(id, Components.Sprite,   sprite)
      .add(id, Components.Health,   { hp: type === 'guardian' ? 2 : 1 })
      .add(id, Components.EnemyAI,  { detectionRadius: 270 + this.level * 35, chaseSpeed: type === 'guardian' ? 105 : 135 })
      .add(id, Components.Patrol,   { minX, maxX, speed: type === 'guardian' ? 70 : 100, direction: Math.random() > 0.5 ? 1 : -1 });
    return sprite;
  }

  createGoal(x, y) {
    this.goal = this.physics.add.image(x, y, 'estatua_condor')
      .setScale(1.2).setDepth(4);
    this.goal.body.allowGravity = true;
    this.goal.body.immovable    = true;
    this.goal.body.setSize(80, 110).setOffset(20, 20);
    const halo = this.add.circle(x, y + 10, 72, 0xffcc5c, 0.18).setDepth(3);
    this.tweens.add({ targets: [this.goal, halo], scale: '+=0.08', alpha: 0.72, duration: 900, yoyo: true, repeat: -1 });
  }

  // ─── Players ─────────────────────────────────────────────────────────────────

  createPlayers() {
    this.players = [];
    const p1 = this.createPlayer(90, 560, this.character, 'P1', 0xffffff);
    const p2char = { ...this.character, speed: this.character.speed * 0.92, jump: this.character.jump * 0.94 };
    const p2 = this.createPlayer(140, 560, p2char, 'P2', 0x9be7ff);
    this.players.push(p1, p2);
    this.cameras.main.startFollow(p1.sprite, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(220, 120);
  }

  createPlayer(x, y, character, label, tint) {
    const sprite = this.physics.add.sprite(x, y, 'heroe_idle')
      .setScale(0.86).setDepth(8).setTint(tint || character.tint);
    sprite.setCollideWorldBounds(true);
    sprite.body.setSize(50, 104).setOffset(50, 48);
    const name = this.add.text(x, y - 86, label, {
      fontSize: '15px',
      color: label === 'P1' ? '#ffcc5c' : '#67e8f9',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(20);
    return { sprite, name, character, active: true, attackingUntil: 0, lastHitAt: 0 };
  }

  // ─── Collisions ──────────────────────────────────────────────────────────────

  createCollisions() {
    // Jugadores vs plataformas estáticas
    this.players.forEach((p) => this.physics.add.collider(p.sprite, this.platforms));
    // Enemigos vs plataformas estáticas
    this.physics.add.collider(this.enemies, this.platforms);
    // Proyectiles vs plataformas
    this.physics.add.collider(this.projectiles, this.platforms, (proj) => proj.destroy());

    this.players.forEach((player) => {
      this.physics.add.overlap(player.sprite, this.collectibles,
        (_, item) => this.collectItem(item));
      this.physics.add.overlap(player.sprite, this.hazards,
        () => this.damagePlayer(player));
      this.physics.add.overlap(player.sprite, this.enemies,
        (_, enemy) => this.touchEnemy(player, enemy));
      this.physics.add.overlap(player.sprite, this.projectiles,
        (_, proj) => { proj.destroy(); this.damagePlayer(player); });
      if (this.goal) {
        this.physics.add.overlap(player.sprite, this.goal,
          () => this.completeLevel());
      }
    });
  }

  // ─── Input ───────────────────────────────────────────────────────────────────

  createKeyboard() {
    this.keys = this.input.keyboard.addKeys({
      a:     Phaser.Input.Keyboard.KeyCodes.A,
      d:     Phaser.Input.Keyboard.KeyCodes.D,
      w:     Phaser.Input.Keyboard.KeyCodes.W,
      s:     Phaser.Input.Keyboard.KeyCodes.S,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      e:     Phaser.Input.Keyboard.KeyCodes.E,
      p:     Phaser.Input.Keyboard.KeyCodes.P,
      i:     Phaser.Input.Keyboard.KeyCodes.I,
      m:     Phaser.Input.Keyboard.KeyCodes.M,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
    });
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-ESC', () => this.openPause());
    this.input.keyboard.on('keydown-P',   () => this.openPause());
    this.input.keyboard.on('keydown-I',   () => this.toggleInventory());
    this.input.keyboard.on('keydown-M',   () => AudioManager.toggleMute(this));
  }

  // ─── UI ──────────────────────────────────────────────────────────────────────

  createUI() {
    this.uiBg = this.add.rectangle(640, 26, 1280, 52, 0x0f172a, 0.78).setScrollFactor(0).setDepth(50);
    this.hud  = this.add.text(20, 12, '', {
      fontSize: '20px', color: '#fff3bf', fontStyle: 'bold', stroke: '#000', strokeThickness: 3,
    }).setScrollFactor(0).setDepth(51);
    this.help = this.add.text(640, 56,
      'P1 A/D/W/S/ESPACIO/E · P2 FLECHAS/ENTER · I Inventario · M Sonido · ESC Pausa',
      { fontSize: '16px', color: '#c7f9ff', stroke: '#000', strokeThickness: 3 }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(51);

    this.pauseButton = this.add.rectangle(1220, 25, 92, 36, 0x23124d, 0.9)
      .setStrokeStyle(2, COLORS.gold).setInteractive({ useHandCursor: true })
      .setScrollFactor(0).setDepth(52);
    this.pauseLabel  = this.add.text(1220, 25, 'PAUSA', {
      fontSize: '17px', color: '#fff3bf', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(53);
    this.pauseButton.on('pointerdown', () => this.openPause());

    this.inventoryPanel = this.add.rectangle(170, 140, 300, 150, 0x111827, 0.9)
      .setStrokeStyle(3, COLORS.gold).setScrollFactor(0).setDepth(60).setVisible(false);
    this.inventoryText  = this.add.text(40, 86, '', {
      fontSize: '18px', color: '#fff3bf', lineSpacing: 8,
    }).setScrollFactor(0).setDepth(61).setVisible(false);

    this.minimap = this.add.graphics().setScrollFactor(0).setDepth(55);
    this.bossBar  = this.add.graphics().setScrollFactor(0).setDepth(55);
    this.updateHUD();
  }

  applyVisualEffects() {
    try {
      this.cameras.main.postFX.addVignette(0.5, 0.5, 0.62, 0.35);
      if (this.level === 4) this.cameras.main.postFX.addBloom(0xffcc5c, 0.55, 0.55, 1, 0.85);
    } catch { /* canvas fallback */ }
  }

  // ─── Update loop ─────────────────────────────────────────────────────────────

  update(time, delta) {
    if (!this.players?.length) return;
    this.updatePlayers(time);
    runPatrolAndAISystem(this, this.ecs, this.players);
    if (this.level === 4) this.updateBoss(time);
    this.updateNames();
    this.updateMinimap();
    this.updateBossBar();
    this.updateHUD();
    this.cleanupFalls();
  }

  updatePlayers(time) {
    this.updatePlayer(this.players[0], {
      left:   this.keys.a,
      right:  this.keys.d,
      up:     this.keys.w,
      down:   this.keys.s,
      jump:   this.keys.space,
      attack: this.keys.e,
    }, time);
    this.updatePlayer(this.players[1], {
      left:   this.cursors.left,
      right:  this.cursors.right,
      up:     this.cursors.up,
      down:   this.cursors.down,
      jump:   this.keys.enter,
      attack: this.keys.enter,
    }, time);
  }

  updatePlayer(player, controls, time) {
    const { sprite, character } = player;
    if (!sprite.active) return;
    const onLadder = this.isOnLadder(sprite);
    const left  = controls.left.isDown;
    const right = controls.right.isDown;
    const up    = controls.up.isDown;
    const down  = controls.down.isDown;

    sprite.setVelocityX(0);
    if (left)  sprite.setVelocityX(-character.speed);
    if (right) sprite.setVelocityX( character.speed);
    if (left || right) sprite.setFlipX(left);

    if (onLadder && (up || down)) {
      sprite.body.allowGravity = false;
      sprite.setVelocityY(up ? -190 : 190);
    } else if (onLadder) {
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
      player.attackingUntil = time + 260;
      this.tryAttackEnemy(player);
      this.tryAttackBoss(player);
    }

    // Animación
    if (time < player.attackingUntil)                                    sprite.play('hero_hit',  true);
    else if (!sprite.body.blocked.down && sprite.body.velocity.y < -30) sprite.play('hero_jump', true);
    else if (!sprite.body.blocked.down && sprite.body.velocity.y >  60) sprite.play('hero_fall', true);
    else if (Math.abs(sprite.body.velocity.x) > 10)                      sprite.play('hero_run',  true);
    else { sprite.anims.stop(); sprite.setTexture('heroe_idle'); }
  }

  isOnLadder(sprite) {
    const b = sprite.body;
    const feet = new Phaser.Geom.Rectangle(b.x + 8, b.y + 16, b.width - 16, b.height - 16);
    return this.ladders.some((l) => Phaser.Geom.Rectangle.Overlaps(feet, l.rect));
  }

  updateNames() {
    this.players.forEach((p) => {
      p.name.setPosition(p.sprite.x, p.sprite.y - 86);
      p.name.setVisible(p.sprite.active);
    });
  }

  // ─── Game logic ──────────────────────────────────────────────────────────────

  collectItem(item) {
    if (!item.active) return;
    if (item.itemType === 'crystal') { this.crystals += 1; this.score += 80; }
    else                             { this.feathers += 1; this.score += 50; }
    AudioManager.play(this, 'sfx_coin', { volume: 0.6 });
    item.disableBody(true, true);
  }

  touchEnemy(player, enemy) {
    if (!enemy.active) return;
    const fallingOn = player.sprite.body.velocity.y > 160 && player.sprite.y < enemy.y - 25;
    if (fallingOn && enemy !== this.boss) {
      enemy.disableBody(true, true);
      player.sprite.setVelocityY(-320);
      this.score += 120;
      AudioManager.play(this, 'sfx_hit', { volume: 0.5 });
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
    const cx = player.sprite.x + (player.sprite.flipX ? -60 : 60);
    const range = new Phaser.Geom.Circle(cx, player.sprite.y, 80);
    this.enemies.children.iterate((enemy) => {
      if (!enemy || !enemy.active || enemy === this.boss) return;
      if (Phaser.Geom.Circle.Contains(range, enemy.x, enemy.y)) {
        enemy.disableBody(true, true);
        this.score += 130;
        AudioManager.play(this, 'sfx_hit', { volume: 0.55 });
      }
    });
  }

  tryAttackBoss(player) {
    if (!this.boss?.active) return;
    const dist = Phaser.Math.Distance.Between(player.sprite.x, player.sprite.y, this.boss.x, this.boss.y);
    if (dist < 165 && this.time.now > this.bossAttackCooldown) {
      this.bossAttackCooldown = this.time.now + 450;
      this.hitBoss(1 + Math.min(2, this.feathers));
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
      this.bossData.nextShoot = time + 1450;
      this.boss.play('boss_attack', true);
      this.time.delayedCall(420, () => this.boss?.play('boss_idle', true));
      this.shootBossProjectile();
    }
  }

  shootBossProjectile() {
    const target = this.players[0].sprite.active ? this.players[0].sprite : this.players[1].sprite;
    const proj = this.projectiles.create(this.boss.x - 80, this.boss.y - 35, 'cristal_andino')
      .setTint(0xff5c7a).setScale(0.55).setDepth(12);
    proj.body.setCircle(22, 18, 18);
    this.physics.moveToObject(proj, target, 270);
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
    if (now < this.invulnerableUntil) return;
    this.invulnerableUntil = now + 1200;
    this.lives -= 1;
    this.cameras.main.shake(160, 0.008);
    AudioManager.play(this, 'sfx_hit', { volume: 0.7 });
    this.players.forEach((p, idx) => {
      p.sprite.setTint(0xff7777);
      this.tweens.add({
        targets: p.sprite, alpha: 0.4, yoyo: true, repeat: 4, duration: 90,
        onComplete: () => {
          p.sprite.setAlpha(1);
          p.sprite.setTint(idx === 1 ? 0x9be7ff : 0xffffff);
        },
      });
    });
    player.sprite.setVelocityY(-260);
    if (this.lives <= 0) this.gameOver(false);
  }

  completeLevel() {
    if (this.changingLevel) return;
    this.changingLevel = true;
    AudioManager.play(this, 'sfx_checkpoint', { volume: 0.75 });
    this.score += 300 + this.timeLeft * 5;
    this.cameras.main.fadeOut(700, 10, 10, 20);
    this.time.delayedCall(760, () => {
      const nextLevel = this.level >= 3 ? 4 : this.level + 1;
      this.scene.start('GameScene', { ...this.makeSaveData(false), level: nextLevel });
    });
  }

  gameOver(won) {
    this.players.forEach((p) => { if (p.sprite.active) p.sprite.play('hero_death', true); });
    this.physics.pause();
    this.time.delayedCall(1000, () => this.scene.start('GameOverScene', this.makeSaveData(won)));
  }

  makeSaveData(won = false) {
    return {
      level: this.level, score: this.score, lives: this.lives,
      feathers: this.feathers, crystals: this.crystals,
      characterId: this.characterId, characterName: this.characterName, won,
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
    this.inventoryText.setVisible(this.inventoryOpen);
    this.inventoryText.setText(
      `Inventario\n\nPlumas doradas: ${this.feathers}\nCristales andinos: ${this.crystals}\nPersonaje: ${this.characterName}`
    );
  }

  tickTimer() {
    this.timeLeft -= 1;
    if (this.timeLeft <= 0) this.gameOver(false);
  }

  updateHUD() {
    if (!this.hud) return;
    this.hud.setText(`❤️ ${this.lives}   ⭐ ${this.score}   🪶 ${this.feathers}   💎 ${this.crystals}   ⏱ ${this.timeLeft}s   ${this.levelDef.name}`);
    if (this.inventoryOpen) {
      this.inventoryText.setText(
        `Inventario\n\nPlumas doradas: ${this.feathers}\nCristales andinos: ${this.crystals}\nPersonaje: ${this.characterName}`
      );
    }
  }

  updateMinimap() {
    if (!this.minimap) return;
    const x = 990, y = 66, w = 260, h = 72;
    this.minimap.clear();
    this.minimap.fillStyle(0x0f172a, 0.72).fillRoundedRect(x, y, w, h, 8);
    this.minimap.lineStyle(2, COLORS.gold, 0.9).strokeRoundedRect(x, y, w, h, 8);
    const sx = w / this.worldWidth, sy = h / this.worldHeight;
    // *** FIX: staticGroup usa getChildren() ***
    this.platforms.getChildren().forEach((platform) => {
      this.minimap.fillStyle(0x6b7280, 0.65)
        .fillRect(x + (platform.x - platform.displayWidth / 2) * sx, y + platform.y * sy,
          Math.max(4, platform.displayWidth * sx), 3);
    });
    this.enemies.children.iterate((enemy) => {
      if (!enemy?.active) return;
      this.minimap.fillStyle(enemy === this.boss ? COLORS.danger : COLORS.goldDark, 1)
        .fillCircle(x + enemy.x * sx, y + enemy.y * sy, enemy === this.boss ? 5 : 3);
    });
    this.players.forEach((p, i) => {
      if (!p.sprite.active) return;
      this.minimap.fillStyle(i === 0 ? COLORS.gold : COLORS.cyan, 1)
        .fillCircle(x + p.sprite.x * sx, y + p.sprite.y * sy, 4);
    });
    if (this.goal) {
      this.minimap.fillStyle(COLORS.green, 1)
        .fillCircle(x + this.goal.x * sx, y + this.goal.y * sy, 4);
    }
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
      if (player.sprite.y > 780) {
        player.sprite.setPosition(90, 520);
        player.sprite.setVelocity(0, 0);
        this.damagePlayer(player);
      }
    });
  }
}
