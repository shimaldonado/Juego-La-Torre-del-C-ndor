import Phaser from 'phaser';
import { PLAYER_STATS } from '../config/constants.js';
import { AudioManager } from '../managers/AudioManager.js';

const BODY_RATIOS = {
  width: 0.27,
  height: 0.45,
  offsetX: 0.365,
  offsetY: 0.395
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, characterKey) {
    const stats = PLAYER_STATS[characterKey];
    super(scene, x, y, stats.texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.characterKey = characterKey;
    this.stats = stats;
    this.isClimbing = false;
    this.isInvulnerable = false;
    this.currentVisualState = '';
    this.touchMoveLeft = false;
    this.touchMoveRight = false;
    this.touchMoveDown = false;

    this.setScale(stats.scale);
    this.setBounce(0.05);
    this.setCollideWorldBounds(true);
    this.setDepth(12);
    if (stats.tint) this.setTint(stats.tint);
    this.applyBodyForCurrentFrame();
  }

  applyBodyForCurrentFrame() {
    const frameWidth = this.frame?.realWidth || this.width || 128;
    const frameHeight = this.frame?.realHeight || this.height || 160;
    this.body.setSize(frameWidth * BODY_RATIOS.width, frameHeight * BODY_RATIOS.height);
    this.body.setOffset(frameWidth * BODY_RATIOS.offsetX, frameHeight * BODY_RATIOS.offsetY);
  }

  setTextureAndScale(textureKey, scale) {
    if (this.texture.key !== textureKey) {
      this.setTexture(textureKey);
    }
    this.setScale(scale);
    if (this.stats.tint) this.setTint(this.stats.tint);
    this.applyBodyForCurrentFrame();
  }

  playAnimation(animationKey, fallbackTexture, scale, stateName) {
    if (this.currentVisualState === stateName) return;
    this.currentVisualState = stateName;
    this.setTextureAndScale(fallbackTexture, scale);
    if (this.anims.currentAnim?.key !== animationKey) {
      this.play(animationKey, true);
    }
  }

  showIdle() {
    if (this.currentVisualState === 'idle') return;
    this.currentVisualState = 'idle';
    this.anims.stop();
    this.setTextureAndScale(this.stats.texture, this.stats.scale);
  }

  showRun() {
    if (this.currentVisualState === 'run') return;
    this.currentVisualState = 'run';
    this.setTextureAndScale(this.stats.runTexture, this.stats.scale);
    if (this.stats.runAnimation) this.play(this.stats.runAnimation, true);
  }

  update(cursors, wasd, ladders, touchControls) {
    const left = cursors.left.isDown || wasd.left.isDown || touchControls.isDown('left');
    const right = cursors.right.isDown || wasd.right.isDown || touchControls.isDown('right');
    const upPressed = Phaser.Input.Keyboard.JustDown(cursors.up)
      || Phaser.Input.Keyboard.JustDown(wasd.up)
      || touchControls.consume('jump');
    const climbUp = cursors.up.isDown || wasd.up.isDown || touchControls.isDown('up');
    const climbDown = cursors.down.isDown || wasd.down.isDown || touchControls.isDown('down');

    const onLadder = this.scene.physics.overlap(this, ladders);
    if (onLadder && (climbUp || climbDown)) {
      this.isClimbing = true;
      this.body.allowGravity = false;
      this.setVelocityY((climbDown ? 1 : 0) * 150 + (climbUp ? -150 : 0));
    } else {
      this.isClimbing = false;
      this.body.allowGravity = true;
    }

    if (left) {
      this.setVelocityX(-this.stats.speed);
      this.setFlipX(true);
    } else if (right) {
      this.setVelocityX(this.stats.speed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if ((this.body.blocked.down || this.body.touching.down) && upPressed && !this.isClimbing) {
      this.setVelocityY(-this.stats.jump);
      AudioManager.jump();
    }

    this.updateAnimation(left || right);
  }

  updateAnimation(isMovingHorizontally) {
    if (this.isInvulnerable) {
      if (this.scene.anims.exists('hero-hit-anim')) {
        this.playAnimation('hero-hit-anim', 'hero-hit', this.stats.actionScale || 0.13, 'hurt');
      }
      return;
    }

    if (this.isClimbing) {
      if (isMovingHorizontally) this.showRun();
      else this.showIdle();
      return;
    }

    const airborne = !(this.body.blocked.down || this.body.touching.down);
    if (airborne) {
      if (this.body.velocity.y < -10 && this.scene.anims.exists('hero-jump-anim')) {
        this.playAnimation('hero-jump-anim', 'hero-jump', this.stats.actionScale || 0.13, 'jump');
        return;
      }
      if (this.scene.anims.exists('hero-fall-anim')) {
        this.playAnimation('hero-fall-anim', 'hero-fall', this.stats.actionScale || 0.13, 'fall');
        return;
      }
    }

    if (isMovingHorizontally) this.showRun();
    else this.showIdle();
  }

  damage() {
    if (this.isInvulnerable) return false;
    this.isInvulnerable = true;
    this.setVelocityY(-220);
    AudioManager.hit();
    this.updateAnimation(false);

    this.scene.tweens.add({
      targets: this,
      alpha: 0.35,
      duration: 85,
      repeat: 6,
      yoyo: true,
      onComplete: () => {
        this.alpha = 1;
        this.isInvulnerable = false;
        this.currentVisualState = '';
      }
    });
    return true;
  }

  die(onComplete) {
    this.setVelocity(0, 0);
    this.body.enable = false;
    this.isInvulnerable = true;
    if (this.scene.anims.exists('hero-death-anim')) {
      this.currentVisualState = 'death';
      this.setTextureAndScale('hero-death', 0.22);
      this.play('hero-death-anim');
      this.scene.time.delayedCall(900, () => onComplete?.());
    } else {
      onComplete?.();
    }
  }
}
