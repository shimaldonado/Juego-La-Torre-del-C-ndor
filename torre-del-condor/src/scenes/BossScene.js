import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/constants.js';
import { SaveManager } from '../managers/SaveManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { Player } from '../entities/Player.js';
import { Boss } from '../entities/Boss.js';
import { Barrel } from '../entities/Barrel.js';
import { TouchControls } from '../ui/TouchControls.js';
import { MuteButton } from '../ui/MuteButton.js';

export class BossScene extends Phaser.Scene {
  constructor() {
    super('BossScene');
  }

  create() {
    this.save = SaveManager.load();
    this.score = this.registry.get('score') || 0;
    this.lives = this.registry.get('lives') || 3;
    this.finished = false;
    this.respawnPoint = { x: 90, y: 510 };

    this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.createBackground();
    this.createGroups();
    this.createArena();
    this.createActors();
    this.createInput();
    this.createHud();
    this.createCollisions();

    this.attackEvent = this.time.addEvent({ delay: 1800, loop: true, callback: () => this.bossAttack() });
    AudioManager.startMusic();
  }

  createBackground() {
    this.cameras.main.setBackgroundColor('#0b1020');
    if (this.textures.exists('bg-boss')) {
      this.add.image(0, 0, 'bg-boss').setOrigin(0, 0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT).setDepth(-60);
      this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x12081f, 0.22).setDepth(-55);
    }

    const g = this.add.graphics().setDepth(-50);
    g.fillStyle(0x111827, 0.55);
    g.fillRoundedRect(210, 92, 540, 430, 24);
    g.lineStyle(4, 0xc9a961, 0.42);
    g.strokeCircle(480, 210, 105);
    g.strokeTriangle(480, 118, 370, 306, 590, 306);
    g.fillStyle(0xc9a961, 0.22);
    g.fillCircle(480, 210, 20);

    for (let i = 0; i < 60; i += 1) {
      const p = this.add.circle(
        Phaser.Math.Between(40, 920),
        Phaser.Math.Between(40, 560),
        Phaser.Math.Between(2, 5),
        i % 2 === 0 ? 0xa855f7 : 0xffd166,
        Phaser.Math.FloatBetween(0.06, 0.2)
      ).setDepth(-10);
      this.tweens.add({
        targets: p,
        y: p.y - Phaser.Math.Between(20, 60),
        alpha: Phaser.Math.FloatBetween(0.02, 0.18),
        duration: Phaser.Math.Between(1600, 3600),
        yoyo: true,
        repeat: -1
      });
    }
  }

  createGroups() {
    this.platforms = this.physics.add.staticGroup();
    this.ladders = this.physics.add.staticGroup();
    this.levers = this.physics.add.staticGroup();
    this.projectiles = this.physics.add.group({ runChildUpdate: true });
  }

  createArena() {
    const makePlatform = (x, y, width) => {
      const platform = this.platforms.create(x, y, 'platform-stone').setScale(width / 96, 1);
      platform.refreshBody();
    };

    makePlatform(480, 585, 960);
    makePlatform(210, 430, 240);
    makePlatform(750, 430, 240);
    makePlatform(480, 300, 260);
    makePlatform(160, 185, 200);
    makePlatform(800, 185, 200);

    const ladder1 = this.ladders.create(480, 445, 'ladder').setScale(0.9, 1.5);
    ladder1.refreshBody();
    const ladder2 = this.ladders.create(160, 305, 'ladder').setScale(0.8, 1.7);
    ladder2.refreshBody();
    const ladder3 = this.ladders.create(800, 305, 'ladder').setScale(0.8, 1.7);
    ladder3.refreshBody();

    [
      { x: 160, y: 150 },
      { x: 480, y: 265 },
      { x: 800, y: 150 }
    ].forEach((item) => {
      const lever = this.levers.create(item.x, item.y, 'lever-off').setScale(1);
      lever.activated = false;
      lever.refreshBody();
    });

    this.add.image(480, 560, 'checkpoint').setScale(0.14).setDepth(6).setTint(0xc4b5fd);
    this.add.text(480, 510, 'Altar del Cóndor', {
      fontFamily: 'Arial Black, Arial', fontSize: '18px', color: '#fff3c4', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(9);
  }

  createActors() {
    this.player = new Player(this, this.respawnPoint.x, this.respawnPoint.y, this.save.selectedCharacter);
    this.boss = new Boss(this, 480, 150);
    this.tweens.add({ targets: this.boss, y: 168, duration: 1200, yoyo: true, repeat: -1 });
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

  createHud() {
    this.add.rectangle(GAME_WIDTH / 2, 24, GAME_WIDTH, 48, 0x000000, 0.55).setScrollFactor(0).setDepth(1000);
    this.scoreText = this.add.text(18, 12, '', { fontFamily: 'Arial Black, Arial', fontSize: '20px', color: '#fff3c4' }).setDepth(1001);
    this.livesText = this.add.text(250, 12, '', { fontFamily: 'Arial Black, Arial', fontSize: '20px', color: '#fff3c4' }).setDepth(1001);
    this.bossText = this.add.text(500, 12, '', { fontFamily: 'Arial Black, Arial', fontSize: '20px', color: '#fff3c4' }).setDepth(1001);
    this.add.text(720, 12, 'Jefe final: Kunturax', { fontFamily: 'Arial Black, Arial', fontSize: '16px', color: '#dfe7ff' }).setDepth(1001);
    this.muteButton = new MuteButton(this, 918, 24);
    this.updateHud();
  }

  createCollisions() {
    this.playerPlatformCollider = this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.projectiles, this.platforms, (projectile) => projectile.destroy());
    this.physics.add.overlap(this.player, this.projectiles, () => this.hurtPlayer());
    this.physics.add.overlap(this.player, this.boss, () => this.hurtPlayer());
    this.physics.add.overlap(this.player, this.levers, (_, lever) => this.activateLever(lever));
  }

  bossAttack() {
    if (this.finished) return;
    const targetX = this.player.x;
    this.boss.playAttack();
    const useCondor = Phaser.Math.Between(0, 1) === 1;
    const projectile = new Barrel(this, this.boss.x, this.boss.y + 30, 0, {
      texture: useCondor ? 'enemy-condor' : 'enemy-bat',
      kind: 'flying',
      scale: useCondor ? 0.16 : 0.15,
      bodyWidth: useCondor ? 100 : 90,
      bodyHeight: useCondor ? 140 : 120,
      animation: useCondor ? 'enemy-condor-attack-anim' : 'enemy-bat-fly-anim',
      tint: 0xc084fc,
      manualVelocity: true
    });
    this.projectiles.add(projectile);
    this.physics.moveTo(projectile, targetX, this.player.y, 230);
  }

  activateLever(lever) {
    if (lever.activated || this.finished) return;
    lever.activated = true;
    lever.setTexture('lever-on');
    this.score += 100;
    AudioManager.win();
    const defeated = this.boss.hit();
    this.updateHud();
    if (defeated) this.winGame();
  }

  hurtPlayer() {
    if (this.finished) return;
    const damaged = this.player.damage();
    if (!damaged) return;
    this.lives -= 1;
    this.updateHud();
    if (this.lives <= 0) {
      SaveManager.save({ bestScore: Math.max(SaveManager.load().bestScore, this.score) });
      this.registry.set('score', this.score);
      this.finished = true;
      this.player.die(() => this.scene.start('GameOverScene'));
    } else {
      this.time.delayedCall(450, () => {
        this.player.setPosition(this.respawnPoint.x, this.respawnPoint.y);
        this.player.setVelocity(0, 0);
      });
    }
  }

  winGame() {
    this.finished = true;
    this.score += 500;
    this.registry.set('score', this.score);
    const current = SaveManager.load();
    SaveManager.save({ bestScore: Math.max(current.bestScore, this.score), unlockedLevel: 4 });
    AudioManager.win();
    this.cameras.main.flash(800, 255, 216, 102);
    this.boss.die(() => this.scene.start('VictoryScene'));
  }

  updateHud() {
    this.scoreText.setText(`Puntos: ${this.score}`);
    this.livesText.setText(`Vidas: ${this.lives}`);
    this.bossText.setText(`Kunturax: ${this.boss?.health ?? 3}/3`);
  }

  update() {
    if (this.finished) return;
    this.player.update(this.cursors, this.wasd, this.ladders, this.touchControls);
    if (this.playerPlatformCollider) this.playerPlatformCollider.active = !this.player.isClimbing;
    this.projectiles.children.each((projectile) => projectile.update());

    if (Phaser.Input.Keyboard.JustDown(this.wasd.pause) || this.touchControls.consume('pause')) {
      this.scene.pause(this.sys.settings.key);
      this.scene.launch('PauseScene', { levelKey: this.sys.settings.key });
    }
    if (Phaser.Input.Keyboard.JustDown(this.wasd.mute) || this.touchControls.consume('mute')) {
      AudioManager.toggleMusic();
      this.muteButton?.refresh();
    }
    if (this.player.y > GAME_HEIGHT + 80) this.hurtPlayer();
  }
}
