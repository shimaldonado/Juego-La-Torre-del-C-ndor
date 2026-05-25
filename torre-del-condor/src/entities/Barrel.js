import Phaser from 'phaser';

const DEFAULT_ANIMS = {
  'enemy-golem': 'enemy-golem-walk-anim',
  'enemy-bat': 'enemy-bat-fly-anim',
  'enemy-condor': 'enemy-condor-fly-anim'
};

export class Barrel extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, speed = 120, options = {}) {
    super(scene, x, y, options.texture || 'barrel');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.speed = speed;
    this.kind = options.kind || 'rolling';
    this.direction = options.direction || Phaser.Math.RND.pick([-1, 1]);
    this.animationKey = options.animation || DEFAULT_ANIMS[options.texture || 'barrel'];
    this.enemyTint = options.tint;

    this.setScale(options.scale || 1);
    this.setDepth(11);
    this.setBounce(options.bounce ?? 1);
    this.setCollideWorldBounds(true);
    this.body.allowGravity = options.allowGravity ?? this.kind !== 'flying';
    this.body.setSize(options.bodyWidth || 30, options.bodyHeight || 30);

    if (this.kind === 'rolling') {
      this.setVelocityX(this.speed * this.direction);
      this.setAngularVelocity(220 * this.direction);
    } else if (this.kind === 'walker') {
      this.setVelocityX(this.speed * this.direction);
      this.setAngularVelocity(0);
      this.setFlipX(this.direction < 0);
    } else if (this.kind === 'flying') {
      this.body.allowGravity = false;
      if (!options.manualVelocity) this.setVelocityX(this.speed * this.direction);
      this.baseY = y;
      this.floatOffset = Phaser.Math.FloatBetween(0, Math.PI * 2);
      this.setFlipX(this.direction < 0);
    }

    if (this.enemyTint) this.setTint(this.enemyTint);
    if (this.animationKey && scene.anims.exists(this.animationKey)) {
      this.play(this.animationKey);
    }
  }

  update() {
    if (this.kind === 'rolling' && (this.body.blocked.left || this.body.blocked.right)) {
      this.direction *= -1;
      this.setVelocityX(this.speed * this.direction);
      this.setAngularVelocity(220 * this.direction);
    }

    if (this.kind === 'walker') {
      if (this.body.blocked.left || this.body.blocked.right) {
        this.direction *= -1;
        this.setVelocityX(this.speed * this.direction);
      }
      this.setFlipX(this.direction < 0);
    }

    if (this.kind === 'flying') {
      this.y = this.baseY + Math.sin(this.scene.time.now / 220 + this.floatOffset) * 12;
      if (Math.abs(this.body.velocity.x) > 5) this.setFlipX(this.body.velocity.x < 0);
    }

    if (this.x < -120 || this.x > this.scene.physics.world.bounds.width + 120 || this.y > this.scene.physics.world.bounds.height + 120) {
      this.destroy();
    }
  }
}
