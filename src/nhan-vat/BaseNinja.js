import Phaser from "phaser";

export class BaseNinja extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, config) {
    super(scene, 260, 570, config.key, 0);
    this.config = config;
    this.isJumping = false;
    this.isActing = false;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(config.scale ?? 0.31).setDepth(5).setCollideWorldBounds(true);
    this.body.setSize(config.frameWidth * 0.35, config.frameHeight * 0.62).setOffset(config.frameWidth * 0.32, config.frameHeight * 0.34);
    this.createAnimations();
  }

  createAnimations() {
    const key = this.config.key;
    const frameNumbers = ([start, end]) => Array.from(
      { length: end - start + 1 },
      (_, index) => start - 1 + index,
    );
    if (!this.scene.anims.exists(`${key}-idle`)) {
      const animation = (name, frameRate, repeat = 0) => this.scene.anims.create({
        key: `${key}-${name}`,
        frames: this.scene.anims.generateFrameNumbers(key, { frames: frameNumbers(this.config.frames[name]) }),
        frameRate,
        repeat,
      });
      animation("idle", 4, -1);
      animation("run", 11, -1);
      animation("jump", 6);
      animation("attack", 18);
      animation("skill", 10);
    }
    this.playAnimation("idle");
  }

  playAnimation(name) {
    const animationKey = `${this.config.key}-${name}`;
    if (this.anims.currentAnim?.key !== animationKey || !this.anims.isPlaying) {
      this.play(animationKey);
    }
  }

  move(direction) {
    if (this.isJumping) return;
    if (this.isActing) {
      this.setVelocityX(0);
      return;
    }
    this.setVelocityX(direction * this.config.speed);
    if (direction !== 0) {
      this.setFlipX(direction < 0);
      this.playAnimation("run");
    } else {
      this.playAnimation("idle");
    }
  }

  playAction(name, allowWhileJumping = false) {
    if ((this.isJumping && !allowWhileJumping) || this.isActing) return false;
    const animationKey = `${this.config.key}-${name}`;
    this.isActing = true;
    this.setVelocityX(0);
    this.play(animationKey, true);
    this.once(`animationcomplete-${animationKey}`, () => {
      this.isActing = false;
      this.playAnimation(this.isJumping ? "jump" : "idle");
    });
    return true;
  }

  attackAnimation() { return this.playAction("attack"); }
  skillAnimation() { return this.playAction("skill", true); }

  jump() {
    if (this.isJumping) return;
    this.isJumping = true;

    // Hủy bỏ di chuyển tự động khi thực hiện nhảy
    if (this.autoMoveTween) {
      this.autoMoveTween.stop();
      this.autoMoveTween = null;
      this.isActing = false;
    }

    this.play(`${this.config.key}-jump`, true);
    this.scene.tweens.add({
      targets: this,
      y: this.y - 115,
      duration: 440,
      ease: "Sine.Out",
      yoyo: true,
      onComplete: () => {
        this.isJumping = false;
        if (!this.isActing) this.playAnimation("idle");
      },
    });
  }
}
