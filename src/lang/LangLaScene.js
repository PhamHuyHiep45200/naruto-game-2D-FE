import Phaser from "phaser";
import { characters } from "../nhan-vat/configs";
import { getCharacterClass } from "../nhan-vat/registry";
import { MocNhan } from "../quai-vat/MocNhan";

export class LangLaScene extends Phaser.Scene {
  constructor() { super("lang-la"); }

  preload() {
    this.load.image("lang-la", "/imgs/lang/lang-la.png");
    this.load.image("rasengan", "/imgs/chuong/rasengan.png");
    this.load.image("chuong-rong", "/imgs/chuong/chuong-rong.png");
    this.load.image("chuong-ho", "/imgs/chuong/chuong-ho.png");
    characters.forEach(c => this.load.spritesheet(c.key, `/imgs/nhan-vat/${c.spriteKey ?? c.key}.png`, { frameWidth: c.frameWidth, frameHeight: c.frameHeight }));
    this.load.spritesheet("moc-nhan", "/imgs/quai-vat/moc-nhan.png", { frameWidth: 530, frameHeight: 512 });
  }

  create() {
    this.characterList = characters;
    this.physics.world.setBounds(0, 0, 2048, 768);
    this.add.image(1024, 384, "lang-la").setDepth(0);
    this.add.rectangle(1024, 720, 2048, 96, 0x07130d, .18).setDepth(1);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("W,A,S,D,E,Q");
    this.virtualMove = { x: 0, y: 0 };
    this.cooldowns = { punch: 0, blast: 0 };
    this.homingProjectiles = new Set();
    this.gameplayEnabled = false;
    this.input.keyboard.on("keydown-SPACE", () => this.punch());
    this.input.keyboard.on("keydown-E", () => this.castSkill());
    this.input.keyboard.on("keydown-Q", () => this.nextTarget());
    this.input.keyboard.on("keydown-W", () => this.player?.jump());
    this.input.keyboard.on("keydown-UP", () => this.player?.jump());
    this.enemies = [new MocNhan(this, 900, 570, 0), new MocNhan(this, 1330, 570, 1), new MocNhan(this, 1740, 570, 2)];
    this.enemies.forEach(enemy => enemy.on("pointerdown", () => this.setTarget(enemy)));
    this.targetArrow = this.add.triangle(0, 0, 0, 0, 22, 0, 11, 18, 0xff3737).setDepth(9);
    this.tweens.add({ targets: this.targetArrow, y: "-=10", duration: 500, yoyo: true, repeat: -1 });
    this.switchCharacter(characters[0]);
    this.setTarget(this.enemies[0]);
    this.cameras.main.setBounds(0, 0, 2048, 768).startFollow(this.player, true, .08, .08).setZoom(1);
  }

  update() {
    if (!this.player) return;
    if (!this.gameplayEnabled) {
      this.player.move(0);
      return;
    }
    const left = this.cursors.left.isDown || this.keys.A.isDown || this.virtualMove.x < -.25;
    const right = this.cursors.right.isDown || this.keys.D.isDown || this.virtualMove.x > .25;
    this.player.move(left ? -1 : right ? 1 : 0);
    this.updateHomingProjectiles();
    this.enemies.forEach((enemy, i) => {
      if (enemy.active) enemy.setFlipX(enemy.x > this.player.x);
      if (enemy.active && Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y) < 115) {
        enemy.x += Math.sin(this.time.now / 700 + i) * .25;
      }
    });
    if (this.target?.active) {
      this.targetArrow
        .setVisible(true)
        .setPosition(this.target.x, this.target.y - this.target.displayHeight / 2 - 16);
    }
    else this.nextTarget();
  }

  switchCharacter(config) {
    const x = this.player?.x ?? 260;
    this.player?.destroy();
    const CharacterClass = getCharacterClass(config.key);
    this.player = new CharacterClass(this, config).setPosition(x, 570);
    this.cameras.main?.startFollow(this.player, true, .08, .08);
    this.events.emit("character", config);
  }

  applyProfile(profile) {
    this.profile = profile;
    const config = characters.find(character => character.name === profile.character?.name);
    if (config && this.player?.config.name !== config.name) this.switchCharacter(config);
  }

  setTarget(enemy) { if (enemy?.active) { this.target = enemy; this.events.emit("enemyHp", enemy); } }
  setGameplayEnabled(enabled) {
    this.gameplayEnabled = enabled;
    if (!enabled) this.setVirtualMove(0, 0);
  }

  setVirtualMove(x, y) {
    this.virtualMove = { x, y };
    if (y < -.45) this.player?.jump();
  }

  startCooldown(skill, duration) {
    if (this.cooldowns[skill] > this.time.now) return false;
    this.cooldowns[skill] = this.time.now + duration;
    this.events.emit("cooldown", { skill, duration });
    return true;
  }

  nextTarget() {
    const alive = this.enemies
      .filter(enemy => enemy.active)
      .sort((a, b) => Math.abs(a.x - this.player.x) - Math.abs(b.x - this.player.x));
    if (!alive.length) return;
    const index = Math.max(-1, alive.indexOf(this.target));
    this.setTarget(alive[(index + 1) % alive.length]);
  }

  punch() {
    if (!this.gameplayEnabled) return;
    if (!this.target?.active) return;
    const target = this.target;
    const distance = Math.abs(target.x - this.player.x);
    if (distance > 150) return this.notice("Mục tiêu quá xa để đấm");
    if (this.cooldowns.punch > this.time.now) return;
    const hit = () => {
      if (!this.player.attackAnimation()) return;
      if (!this.startCooldown("punch", this.player.config.punchCooldown)) return;
      this.player.setFlipX(target.x < this.player.x);
      this.time.delayedCall(180, () => this.hitEnemy(target, this.player.config.punch));
    };
    if (distance > 40) {
      const destination = target.x + (this.player.x < target.x ? -38 : 38);
      this.tweens.add({ targets: this.player, x: destination, duration: 140, ease: "Power2", onComplete: hit });
    } else hit();
  }

  castSkill() {
    if (!this.gameplayEnabled) return;
    if (!this.target?.active) return;
    const target = this.target;
    const distance = Math.abs(target.x - this.player.x);
    if (distance < 40 || distance > 300) return this.notice(distance < 40 ? "Lùi ra để dùng chưởng" : "Mục tiêu ngoài tầm chưởng");
    if (this.cooldowns.blast > this.time.now) return;
    if (!this.player.skillAnimation()) return;
    if (!this.startCooldown("blast", this.player.config.skillCooldown)) return;
    this.player.setFlipX(target.x < this.player.x);
    const orb = this.physics.add.image(
      this.player.body.center.x,
      this.player.body.center.y,
      this.player.config.skillImage,
    )
      .setDepth(7)
      .setDisplaySize(84, 84);
    orb.body.setAllowGravity(false);
    orb.homingTarget = target;
    orb.damageAmount = this.player.config.skillDamage;
    orb.expiresAt = this.time.now + 1800;
    this.homingProjectiles.add(orb);
  }

  updateHomingProjectiles() {
    this.homingProjectiles.forEach(projectile => {
      const target = projectile.homingTarget;
      if (!projectile.active || !target?.active || this.time.now >= projectile.expiresAt) {
        this.destroyProjectile(projectile);
        return;
      }

      this.physics.moveToObject(projectile, target, 680);
      projectile.setFlipX(projectile.body.velocity.x < 0);
      if (Phaser.Math.Distance.Between(projectile.x, projectile.y, target.body.center.x, target.body.center.y) <= 38) {
        const damage = projectile.damageAmount;
        this.destroyProjectile(projectile);
        this.hitEnemy(target, damage);
      }
    });
  }

  destroyProjectile(projectile) {
    this.homingProjectiles.delete(projectile);
    if (projectile?.active) projectile.destroy();
  }

  hitEnemy(enemy, amount) {
    if (!enemy?.active) return;
    const critical = Math.random() < .1;
    const skillKey = amount === this.player.config.punch ? "punch" : "blast";
    const level = this.profile?.skills?.[skillKey] ?? 1;
    const step = skillKey === "punch" ? 20 : { "HYU-GA": 50, "SEN-JIN": 60, "UCHY-HA": 80 }[this.player.config.clan];
    const leveledAmount = amount + (level - 1) * step;
    const damage = critical ? Math.round(leveledAmount * 1.5) : leveledAmount;
    const text = this.add.text(enemy.x, enemy.y - 100, `${critical ? "CRIT " : ""}-${damage}`, { font: "800 20px Arial", color: critical ? "#ff6b39" : "#ffffff", stroke: "#151515", strokeThickness: 4 }).setOrigin(.5).setDepth(10);
    this.tweens.add({ targets: text, y: text.y - 55, alpha: 0, duration: 750, onComplete: () => text.destroy() });
    const dead = enemy.damage(damage);
    this.events.emit("enemyHp", enemy);
    this.events.emit("hit", { enemy, damage });
    if (dead) this.killEnemy(enemy);
  }

  killEnemy(enemy) {
    for (let i = 0; i < 9; i++) {
      const smoke = this.add.circle(enemy.x, enemy.y - 30, Phaser.Math.Between(12, 28), 0xf4f1db, .8).setDepth(8);
      this.tweens.add({ targets: smoke, x: smoke.x + Phaser.Math.Between(-65, 65), y: smoke.y + Phaser.Math.Between(-70, 15), alpha: 0, scale: 2, duration: 700, onComplete: () => smoke.destroy() });
    }
    enemy.disableBody(true, true);
    this.events.emit("kill");
    this.time.delayedCall(6000, () => enemy.respawn());
    this.nextTarget();
  }

  notice(message) {
    this.events.emit("notice", message);
  }
}
