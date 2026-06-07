import Phaser from "phaser";

export class BaseNinja extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, config) {
    super(scene, 260, 570, config.key, 0);
    this.config = config;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(config.scale ?? 0.31).setDepth(5).setCollideWorldBounds(true);
    this.body.setSize(config.frameWidth * 0.35, config.frameHeight * 0.62).setOffset(config.frameWidth * 0.32, config.frameHeight * 0.34);
    this.createAnimations();
  }

  createAnimations() {
    const key = this.config.key;
    if (!this.scene.anims.exists(`${key}-idle`)) {
      this.scene.anims.create({ key: `${key}-idle`, frames: this.scene.anims.generateFrameNumbers(key, { frames: [0, 1, 2, 3] }), frameRate: 4, repeat: -1 });
      this.scene.anims.create({ key: `${key}-run`, frames: this.scene.anims.generateFrameNumbers(key, { frames: [4, 5, 6, 7, 8] }), frameRate: 11, repeat: -1 });
      this.scene.anims.create({ key: `${key}-attack`, frames: this.scene.anims.generateFrameNumbers(key, { frames: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19] }), frameRate: 18 });
      this.scene.anims.create({ key: `${key}-skill`, frames: this.scene.anims.generateFrameNumbers(key, { frames: [20, 21, 22] }), frameRate: 10 });
    }
    this.play(`${key}-idle`);
  }

  move(direction) {
    this.setVelocityX(direction * this.config.speed);
    if (direction !== 0) {
      this.setFlipX(direction < 0);
      if (!this.anims.currentAnim?.key.endsWith("-attack")) this.play(`${this.config.key}-run`, true);
    } else if (!this.anims.currentAnim?.key.endsWith("-attack") && !this.anims.currentAnim?.key.endsWith("-skill")) {
      this.play(`${this.config.key}-idle`, true);
    }
  }

  attackAnimation() { this.play(`${this.config.key}-attack`, true); }
  skillAnimation() { this.play(`${this.config.key}-skill`, true); }
}
