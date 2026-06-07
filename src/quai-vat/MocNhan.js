import Phaser from "phaser";

export class MocNhan extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, index) {
    super(scene, x, y, "moc-nhan", 0);
    this.spawn = { x, y };
    this.index = index;
    this.maxHp = 700;
    this.hp = this.maxHp;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(.27).setDepth(4).setInteractive({ useHandCursor: true });
    this.body.setImmovable(true).setSize(170, 330).setOffset(180, 150);
    if (!scene.anims.exists("moc-idle")) {
      scene.anims.create({ key: "moc-idle", frames: scene.anims.generateFrameNumbers("moc-nhan", { frames: [0, 1] }), frameRate: 3, repeat: -1 });
      scene.anims.create({ key: "moc-hit", frames: scene.anims.generateFrameNumbers("moc-nhan", { frames: [4, 5, 6, 7] }), frameRate: 10 });
    }
    this.play("moc-idle");
  }

  damage(amount) {
    if (!this.active) return false;
    this.hp = Math.max(0, this.hp - amount);
    this.play("moc-hit", true);
    this.once("animationcomplete", () => this.active && this.play("moc-idle"));
    return this.hp === 0;
  }

  respawn() {
    this.hp = this.maxHp;
    this.enableBody(true, this.spawn.x, this.spawn.y, true, true).play("moc-idle");
  }
}
