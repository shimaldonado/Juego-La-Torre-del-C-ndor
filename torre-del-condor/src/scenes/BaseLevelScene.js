import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/constants.js';
import { SaveManager } from '../managers/SaveManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { Player } from '../entities/Player.js';
import { Barrel } from '../entities/Barrel.js';
import { TouchControls } from '../ui/TouchControls.js';
import { MuteButton } from '../ui/MuteButton.js';

export class BaseLevelScene extends Phaser.Scene {
  constructor(key, levelConfig) {
    super(key);
    this.levelConfig = levelConfig;
  }

  create() {
    this.save = SaveManager.load();
    this.score = this.registry.get('score') || 0;
    this.lives = this.registry.get('lives') || 3;
    this.timeLeft = this.levelConfig.timeLimit || 120;
    this.finished = false;
    this.respawnPoint = { ...this.levelConfig.spawn };

    this.physics.world.setBounds(0, 0, GAME_WIDTH, this.levelConfig.worldHeight);
    this.cameras.main.setBounds(0, 0, GAME_WIDTH, this.levelConfig.worldHeight);
    this.cameras.main.setBackgroundColor(this.levelConfig.cameraColor || '#10182f');

    this.createWorldBackground();
    this.createGroups();
    this.createMap();
    this.createDecorations();
    this.createPlayer();
    this.createCollisions();
    this.createHud();
    this.createInput();
    this.createEvents();

    AudioManager.startMusic();
  }

  createWorldBackground() {
    const theme = this.levelConfig.theme || 'entrada';
    const backgroundKey = this.levelConfig.backgroundKey;

    if (backgroundKey && this.textures.exists(backgroundKey)) {
      this.add.image(0, 0, backgroundKey)
        .setOrigin(0, 0)
        .setDisplaySize(GAME_WIDTH, this.levelConfig.worldHeight)
        .setDepth(-140);
      this.add.rectangle(GAME_WIDTH / 2, this.levelConfig.worldHeight / 2, GAME_WIDTH, this.levelConfig.worldHeight, 0x000000, 0.12)
        .setDepth(-130);
    } else if (theme === 'interior') this.createInteriorBackground();
    else if (theme === 'cima') this.createSummitBackground();
    else this.createEntranceBackground();

    this.createAmbientParticles(theme);
  }

  getArtScale(key, scale = 1) {
    const base = {
      feather: 0.09,
      crystal: 0.085,
      checkpoint: 0.12,
      portal: 0.12,
      fire: 0.08,
      spikes: 0.08,
      'deco-rock': 0.085,
      'deco-grass': 0.09,
      'deco-symbol': 0.08,
      'deco-torch': 0.08
    };
    return (base[key] || 1) * scale;
  }

  createEntranceBackground() {
    const h = this.levelConfig.worldHeight;
    const bg = this.add.graphics().setDepth(-120);
    bg.fillGradientStyle(0x8ecae6, 0x8ecae6, 0x1d3557, 0x2c1744, 1);
    bg.fillRect(0, 0, GAME_WIDTH, h);

    // Montañas andinas de fondo con scroll más lento para dar profundidad.
    const mountains = this.add.graphics().setDepth(-110).setScrollFactor(0.35, 0.75);
    mountains.fillStyle(0x1f3b57, 0.85);
    mountains.fillTriangle(-80, h - 160, 150, h - 760, 390, h - 160);
    mountains.fillTriangle(220, h - 160, 520, h - 880, 840, h - 160);
    mountains.fillTriangle(600, h - 160, 850, h - 720, 1100, h - 160);
    mountains.fillStyle(0xf1f5f9, 0.7);
    mountains.fillTriangle(118, h - 680, 150, h - 760, 190, h - 680);
    mountains.fillTriangle(470, h - 780, 520, h - 880, 585, h - 780);
    mountains.fillTriangle(810, h - 650, 850, h - 720, 900, h - 650);

    const tower = this.add.graphics().setDepth(-100).setScrollFactor(0.6, 0.9);
    tower.fillStyle(0x2f2b2a, 0.9);
    tower.fillRoundedRect(665, h - 1120, 170, 1000, 22);
    tower.fillStyle(0x1f1b1a, 0.95);
    tower.fillTriangle(630, h - 1088, 750, h - 1280, 870, h - 1088);
    tower.lineStyle(3, 0xc9a961, 0.4);
    for (let y = h - 1030; y < h - 180; y += 115) {
      tower.strokeRoundedRect(696, y, 108, 46, 8);
      tower.strokeCircle(750, y + 23, 13);
    }

    const ground = this.add.graphics().setDepth(-90);
    ground.fillStyle(0x6b4f2a, 0.75);
    ground.fillRect(0, h - 240, GAME_WIDTH, 240);
    ground.fillStyle(0xa37a3b, 0.55);
    ground.fillEllipse(170, h - 235, 450, 80);
    ground.fillEllipse(690, h - 225, 650, 90);
  }

  createInteriorBackground() {
    const h = this.levelConfig.worldHeight;
    const wall = this.add.graphics().setDepth(-120);
    wall.fillGradientStyle(0x111827, 0x111827, 0x2f2a28, 0x161014, 1);
    wall.fillRect(0, 0, GAME_WIDTH, h);

    // Bloques de piedra y símbolos antiguos.
    const blocks = this.add.graphics().setDepth(-110);
    for (let y = 0; y < h; y += 86) {
      for (let x = 0; x < GAME_WIDTH; x += 112) {
        blocks.fillStyle((x / 112 + y / 86) % 2 === 0 ? 0x2d3436 : 0x343a40, 0.62);
        blocks.fillRoundedRect(x, y, 108, 82, 4);
      }
    }
    blocks.lineStyle(2, 0xc9a961, 0.28);
    for (let y = 170; y < h; y += 270) {
      blocks.strokeCircle(110, y, 28);
      blocks.strokeTriangle(830, y - 30, 795, y + 32, 865, y + 32);
      blocks.strokeRoundedRect(410, y - 35, 140, 70, 8);
    }

    const columns = this.add.graphics().setDepth(-100).setScrollFactor(0.8, 1);
    columns.fillStyle(0x1f2937, 0.78);
    for (let x of [54, 890]) {
      columns.fillRoundedRect(x - 30, 0, 60, h, 8);
      columns.lineStyle(3, 0xc9a961, 0.24);
      for (let y = 0; y < h; y += 150) columns.strokeRoundedRect(x - 22, y + 20, 44, 80, 8);
    }
  }

  createSummitBackground() {
    const h = this.levelConfig.worldHeight;
    const sky = this.add.graphics().setDepth(-120);
    sky.fillGradientStyle(0x4c1d95, 0x2563eb, 0x020617, 0x111827, 1);
    sky.fillRect(0, 0, GAME_WIDTH, h);

    const clouds = this.add.graphics().setDepth(-112).setScrollFactor(0.25, 0.55);
    clouds.fillStyle(0xf8fafc, 0.24);
    for (let y = 140; y < h; y += 360) {
      clouds.fillEllipse(130, y, 260, 70);
      clouds.fillEllipse(420, y + 90, 350, 95);
      clouds.fillEllipse(790, y + 35, 300, 80);
    }

    const altar = this.add.graphics().setDepth(-100).setScrollFactor(0.75, 0.95);
    altar.fillStyle(0x2a2520, 0.82);
    altar.fillRoundedRect(300, h - 760, 360, 600, 22);
    altar.lineStyle(4, 0xc9a961, 0.45);
    altar.strokeCircle(480, h - 620, 90);
    altar.strokeTriangle(480, h - 690, 410, h - 550, 550, h - 550);
    altar.fillStyle(0xc9a961, 0.35);
    altar.fillCircle(480, h - 620, 18);

    // Silueta del cóndor como símbolo central del final.
    const condor = this.add.graphics().setDepth(-95).setScrollFactor(0.55, 0.85);
    condor.fillStyle(0x05070a, 0.45);
    condor.fillEllipse(480, h - 1110, 85, 55);
    condor.fillTriangle(480, h - 1135, 165, h - 1010, 435, h - 1088);
    condor.fillTriangle(480, h - 1135, 795, h - 1010, 525, h - 1088);
  }

  createAmbientParticles(theme) {
    const h = this.levelConfig.worldHeight;
    const amount = theme === 'interior' ? 100 : 135;
    const color = theme === 'interior' ? 0xffc857 : 0xffffff;
    for (let i = 0; i < amount; i += 1) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, GAME_WIDTH),
        Phaser.Math.Between(0, h),
        Phaser.Math.Between(1, 3),
        color,
        Phaser.Math.FloatBetween(0.08, theme === 'interior' ? 0.26 : 0.42)
      ).setDepth(-80);
      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-20, 20),
        y: particle.y - Phaser.Math.Between(15, 45),
        alpha: Phaser.Math.FloatBetween(0.05, 0.25),
        duration: Phaser.Math.Between(2500, 5200),
        yoyo: true,
        repeat: -1
      });
    }
  }

  createGroups() {
    this.platforms = this.physics.add.staticGroup();
    this.ladders = this.physics.add.staticGroup();
    this.coins = this.physics.add.staticGroup();
    this.crystals = this.physics.add.staticGroup();
    this.checkpoints = this.physics.add.staticGroup();
    this.obstacles = this.physics.add.staticGroup();
    this.barrels = this.physics.add.group({ runChildUpdate: true });
  }

  createMap() {
    const platformKey = this.levelConfig.platformKey || 'platform-stone';
    const collectibleKey = this.levelConfig.collectibleKey || 'feather';

    this.levelConfig.platforms.forEach((item) => {
      const platform = this.platforms.create(item.x, item.y, item.key || platformKey)
        .setScale(item.width / 96, item.scaleY || 1)
        .setOrigin(0.5);
      platform.refreshBody();
    });

    this.levelConfig.ladders.forEach((item) => {
      const ladder = this.ladders.create(item.x, item.y, 'ladder')
        .setScale(item.scaleX || 1, item.height / 96)
        .setOrigin(0.5);
      ladder.refreshBody();
    });

    this.levelConfig.coins.forEach((item) => {
      const key = item.key || collectibleKey;
      const coin = this.coins.create(item.x, item.y, key)
        .setScale(key === 'feather' ? this.getArtScale(key, item.scale || 1) : (item.scale || 1));
      coin.refreshBody();
      this.tweens.add({ targets: coin, y: coin.y - 8, duration: 800, yoyo: true, repeat: -1 });
    });

    this.levelConfig.crystals.forEach((item) => {
      const key = item.key || 'crystal';
      const crystal = this.crystals.create(item.x, item.y, key)
        .setScale(key === 'crystal' ? this.getArtScale(key, item.scale || 1) : (item.scale || 1));
      crystal.refreshBody();
      this.tweens.add({ targets: crystal, angle: 8, duration: 600, yoyo: true, repeat: -1 });
    });

    (this.levelConfig.checkpoints || []).forEach((item) => {
      const checkpoint = this.checkpoints.create(item.x, item.y, 'checkpoint')
        .setScale(this.getArtScale('checkpoint', item.scale || 1));
      checkpoint.activated = false;
      checkpoint.refreshBody();
    });

    this.levelConfig.obstacles.forEach((item) => {
      const type = item.type || 'spikes';
      const obstacle = this.obstacles.create(item.x, item.y, type)
        .setScale(
          type === 'spike-long' ? (item.scaleX || item.scale || 1) : this.getArtScale(type, item.scaleX || item.scale || 1),
          type === 'spike-long' ? (item.scaleY || item.scale || 1) : this.getArtScale(type, item.scaleY || item.scale || 1)
        )
        .setOrigin(0.5);
      obstacle.refreshBody();
      if ((item.type || '').includes('fire')) {
        this.tweens.add({ targets: obstacle, scaleY: obstacle.scaleY * 1.15, alpha: 0.75, duration: 420, yoyo: true, repeat: -1 });
      }
    });

    this.goal = this.add.zone(this.levelConfig.goal.x, this.levelConfig.goal.y, 96, 130);
    this.physics.add.existing(this.goal, true);
    this.add.image(this.levelConfig.goal.x, this.levelConfig.goal.y - 35, this.levelConfig.goalKey || 'portal')
      .setScale(this.getArtScale(this.levelConfig.goalKey || 'portal', this.levelConfig.goalScale || 1))
      .setDepth(8);
    this.add.text(this.levelConfig.goal.x, this.levelConfig.goal.y + 36, this.levelConfig.goalLabel || 'PORTAL', {
      fontFamily: 'Arial Black, Arial',
      fontSize: '18px',
      color: '#fff3c4',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(9);
  }

  createDecorations() {
    const decorations = this.levelConfig.decorations || [];
    decorations.forEach((item) => {
      if (item.type === 'torch' && this.textures.exists('deco-torch')) {
        const sprite = this.add.image(item.x, item.y, 'deco-torch')
          .setScale(this.getArtScale('deco-torch', item.scale || 1))
          .setDepth(6);
        this.tweens.add({ targets: sprite, alpha: 0.72, scaleY: sprite.scaleY * 1.08, duration: 360, yoyo: true, repeat: -1 });
        this.add.circle(item.x, item.y + 4, 42 * (item.scale || 1), 0xffc857, 0.08).setDepth(5);
        return;
      }
      if (item.type === 'symbol' && this.textures.exists('deco-symbol')) {
        this.add.image(item.x, item.y, 'deco-symbol').setScale(this.getArtScale('deco-symbol', item.scale || 1)).setDepth(2);
        return;
      }
      if (item.type === 'rock' && this.textures.exists('deco-rock')) {
        this.add.image(item.x, item.y, 'deco-rock').setScale(this.getArtScale('deco-rock', item.scale || 1)).setDepth(3);
        return;
      }
      if (item.type === 'grass' && this.textures.exists('deco-grass')) {
        this.add.image(item.x, item.y, 'deco-grass').setScale(this.getArtScale('deco-grass', item.scale || 1)).setDepth(3);
        return;
      }
      if (item.type === 'torch') this.drawTorch(item.x, item.y, item.scale || 1);
      if (item.type === 'ruin') this.drawRuin(item.x, item.y, item.scale || 1);
      if (item.type === 'symbol') this.drawSymbol(item.x, item.y, item.scale || 1);
      if (item.type === 'rock') this.drawRock(item.x, item.y, item.scale || 1);
      if (item.type === 'altar') this.drawAltar(item.x, item.y, item.scale || 1);
    });
  }

  drawTorch(x, y, scale = 1) {
    const base = this.add.image(x, y, 'fire').setScale(scale).setDepth(6);
    this.tweens.add({ targets: base, alpha: 0.68, scaleY: scale * 1.12, duration: 360, yoyo: true, repeat: -1 });
    this.add.circle(x, y + 4, 42 * scale, 0xffc857, 0.08).setDepth(5);
  }

  drawRuin(x, y, scale = 1) {
    const g = this.add.graphics().setDepth(2);
    g.fillStyle(0x3f3b34, 0.95);
    g.fillRoundedRect(x - 28 * scale, y - 74 * scale, 56 * scale, 92 * scale, 8 * scale);
    g.fillStyle(0x1f2937, 0.8);
    g.fillRoundedRect(x - 15 * scale, y - 45 * scale, 30 * scale, 42 * scale, 6 * scale);
    g.lineStyle(2 * scale, 0xc9a961, 0.42);
    g.strokeCircle(x, y - 58 * scale, 13 * scale);
  }

  drawSymbol(x, y, scale = 1) {
    const g = this.add.graphics().setDepth(1);
    g.lineStyle(3 * scale, 0xc9a961, 0.36);
    g.strokeCircle(x, y, 24 * scale);
    g.strokeTriangle(x, y - 24 * scale, x - 22 * scale, y + 16 * scale, x + 22 * scale, y + 16 * scale);
    g.fillStyle(0x4ecdc4, 0.25);
    g.fillCircle(x, y, 6 * scale);
  }

  drawRock(x, y, scale = 1) {
    const g = this.add.graphics().setDepth(3);
    g.fillStyle(0x45433d, 0.95);
    g.fillEllipse(x, y, 74 * scale, 34 * scale);
    g.fillStyle(0x5e6258, 0.75);
    g.fillEllipse(x - 18 * scale, y - 8 * scale, 38 * scale, 24 * scale);
    g.fillStyle(0x2e332c, 0.6);
    g.fillEllipse(x + 22 * scale, y + 1 * scale, 44 * scale, 25 * scale);
  }

  drawAltar(x, y, scale = 1) {
    const g = this.add.graphics().setDepth(4);
    g.fillStyle(0x3f3b34, 0.95);
    g.fillRoundedRect(x - 70 * scale, y - 22 * scale, 140 * scale, 44 * scale, 10 * scale);
    g.fillStyle(0x24211f, 0.95);
    g.fillRoundedRect(x - 48 * scale, y - 66 * scale, 96 * scale, 44 * scale, 8 * scale);
    g.lineStyle(3 * scale, 0xc9a961, 0.55);
    g.strokeCircle(x, y - 45 * scale, 18 * scale);
  }

  createPlayer() {
    const spawn = this.levelConfig.spawn;
    this.player = new Player(this, spawn.x, spawn.y, this.save.selectedCharacter);
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
  }

  createCollisions() {
    this.playerPlatformCollider = this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.barrels, this.platforms);
    this.physics.add.collider(this.barrels, this.barrels);

    this.physics.add.overlap(this.player, this.coins, (_, coin) => this.collectCoin(coin));
    this.physics.add.overlap(this.player, this.crystals, (_, crystal) => this.collectCrystal(crystal));
    this.physics.add.overlap(this.player, this.checkpoints, (_, checkpoint) => this.activateCheckpoint(checkpoint));
    this.physics.add.overlap(this.player, this.obstacles, () => this.hurtPlayer());
    this.physics.add.overlap(this.player, this.barrels, () => this.hurtPlayer());
    this.physics.add.overlap(this.player, this.goal, () => this.finishLevel());
  }

  createHud() {
    this.hud = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);
    const bg = this.add.rectangle(GAME_WIDTH / 2, 24, GAME_WIDTH, 48, 0x000000, 0.45);
    this.scoreText = this.add.text(18, 12, '', { fontFamily: 'Arial Black, Arial', fontSize: '20px', color: '#fff3c4' });
    this.livesText = this.add.text(270, 12, '', { fontFamily: 'Arial Black, Arial', fontSize: '20px', color: '#fff3c4' });
    this.timeText = this.add.text(500, 12, '', { fontFamily: 'Arial Black, Arial', fontSize: '20px', color: '#fff3c4' });
    this.levelText = this.add.text(720, 12, this.levelConfig.title, { fontFamily: 'Arial Black, Arial', fontSize: '16px', color: '#dfe7ff' });
    this.muteButton = new MuteButton(this, 918, 24);
    this.hud.add([bg, this.scoreText, this.livesText, this.timeText, this.levelText, this.muteButton.container]);
    this.updateHud();
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      pause: Phaser.Input.Keyboard.KeyCodes.ESC,
      mute: Phaser.Input.Keyboard.KeyCodes.M
    });

    this.touchControls = new TouchControls(this);
  }

  createEvents() {
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.finished) return;
        this.timeLeft -= 1;
        this.updateHud();
        if (this.timeLeft <= 0) this.hurtPlayer(true);
      }
    });

    this.spawnEvent = this.time.addEvent({
      delay: this.levelConfig.barrelDelay,
      loop: true,
      callback: () => this.spawnBarrel()
    });
  }

  spawnBarrel() {
    if (this.finished) return;
    const spawn = Phaser.Utils.Array.GetRandom(this.levelConfig.barrelSpawns);
    const barrel = new Barrel(this, spawn.x, spawn.y, spawn.speed || this.levelConfig.barrelSpeed, {
      texture: spawn.texture || this.levelConfig.enemyTexture || 'barrel',
      kind: spawn.kind || this.levelConfig.enemyKind || 'rolling',
      scale: spawn.scale || this.levelConfig.enemyScale || 1,
      bodyWidth: spawn.bodyWidth || this.levelConfig.enemyBodyWidth,
      bodyHeight: spawn.bodyHeight || this.levelConfig.enemyBodyHeight,
      animation: spawn.animation || this.levelConfig.enemyAnimation,
      direction: spawn.direction,
      allowGravity: spawn.allowGravity,
      manualVelocity: spawn.manualVelocity,
      tint: spawn.tint
    });
    this.barrels.add(barrel);
  }

  collectCoin(coin) {
    if (!coin.active) return;
    coin.disableBody(true, true);
    this.score += 10;
    AudioManager.coin();
    this.updateHud();
  }

  collectCrystal(crystal) {
    if (!crystal.active) return;
    crystal.disableBody(true, true);
    this.score += 50;
    this.lives = Math.min(5, this.lives + 1);
    AudioManager.win();
    this.updateHud();
  }

  activateCheckpoint(checkpoint) {
    if (checkpoint.activated) return;
    checkpoint.activated = true;
    checkpoint.setTint(0x63d471);
    this.respawnPoint = { x: checkpoint.x, y: checkpoint.y - 74 };
    this.score += 25;
    this.add.text(checkpoint.x, checkpoint.y - 82, 'Checkpoint', {
      fontFamily: 'Arial Black, Arial',
      fontSize: '16px',
      color: '#fff3c4',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(30);
    AudioManager.win();
    this.updateHud();
  }

  hurtPlayer(force = false) {
    if (this.finished) return;
    const damaged = force ? true : this.player.damage();
    if (!damaged) return;
    this.lives -= 1;
    this.updateHud();
    if (this.lives <= 0) {
      this.gameOver();
      return;
    }
    const spawn = this.respawnPoint || this.levelConfig.spawn;
    this.time.delayedCall(350, () => {
      this.player.setPosition(spawn.x, spawn.y);
      this.player.setVelocity(0, 0);
    });
  }

  finishLevel() {
    if (this.finished) return;
    this.finished = true;
    this.score += Math.max(0, this.timeLeft) * 2;
    this.registry.set('score', this.score);
    this.registry.set('lives', this.lives);
    const currentSave = SaveManager.load();
    SaveManager.save({
      bestScore: Math.max(currentSave.bestScore, this.score),
      unlockedLevel: Math.max(currentSave.unlockedLevel, this.levelConfig.unlocks || 1)
    });
    AudioManager.win();
    this.cameras.main.flash(500, 255, 216, 102);
    this.time.delayedCall(700, () => this.scene.start(this.levelConfig.nextScene));
  }

  gameOver() {
    this.finished = true;
    SaveManager.save({ bestScore: Math.max(SaveManager.load().bestScore, this.score) });
    this.registry.set('score', this.score);
    this.player.die(() => this.scene.start('GameOverScene'));
  }

  updateHud() {
    this.scoreText.setText(`Puntos: ${this.score}`);
    this.livesText.setText(`Vidas: ${this.lives}`);
    this.timeText.setText(`Tiempo: ${this.timeLeft}`);
  }

  update() {
    if (this.finished) return;
    this.player.update(this.cursors, this.wasd, this.ladders, this.touchControls);
    if (this.playerPlatformCollider) this.playerPlatformCollider.active = !this.player.isClimbing;
    this.barrels.children.each((barrel) => barrel.update());

    if (Phaser.Input.Keyboard.JustDown(this.wasd.pause) || this.touchControls.consume('pause')) {
      this.scene.pause(this.sys.settings.key);
      this.scene.launch('PauseScene', { levelKey: this.sys.settings.key });
    }

    if (Phaser.Input.Keyboard.JustDown(this.wasd.mute) || this.touchControls.consume('mute')) {
      AudioManager.toggleMusic();
      this.muteButton?.refresh();
    }

    if (this.player.y > this.levelConfig.worldHeight + 80) {
      this.hurtPlayer(true);
    }
  }
}
