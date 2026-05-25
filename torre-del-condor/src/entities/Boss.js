import Phaser from 'phaser';

export class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss-kunturax');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.health = 3;
    this.setScale(0.22);
    this.setImmovable(true);
    this.body.allowGravity = false;
    this.setDepth(30);
    this.setSize(150, 320);
    this.setOffset(100, 220);
    if (scene.anims.exists('boss-idle-anim')) this.play('boss-idle-anim');
  }

  playAttack() {
    if (this.scene.anims.exists('boss-attack-anim')) {
      this.play('boss-attack-anim');
      this.scene.time.delayedCall(450, () => {
        if (this.active && this.health > 0 && this.scene.anims.exists('boss-idle-anim')) this.play('boss-idle-anim');
      });
    }
  }

  hit() {
    this.health -= 1;
    if (this.scene.anims.exists('boss-hit-anim')) {
      this.play('boss-hit-anim');
      this.scene.time.delayedCall(350, () => {
        if (this.active && this.health > 0 && this.scene.anims.exists('boss-idle-anim')) this.play('boss-idle-anim');
      });
    } else {
      this.setTint(0xff4d4d);
      this.scene.time.delayedCall(250, () => this.clearTint());
    }

    this.scene.tweens.add({
      targets: this,
      x: this.x + 15,
      duration: 60,
      yoyo: true,
      repeat: 5
    });
    return this.health <= 0;
  }

  die(onComplete) {
    this.body.enable = false;
    if (this.scene.anims.exists('boss-death-anim')) {
      this.play('boss-death-anim');
      this.scene.time.delayedCall(1100, () => onComplete?.());
    } else {
      onComplete?.();
    }
  }
}
