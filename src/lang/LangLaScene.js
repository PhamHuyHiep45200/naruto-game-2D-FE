import Phaser from "phaser";
import { characters } from "../nhan-vat/configs";
import { Naruto } from "../nhan-vat/Naruto";
import { Minato } from "../nhan-vat/Minato";
import { Kakashi } from "../nhan-vat/Kakashi";
import { Itachi } from "../nhan-vat/Itachi";
import { Obito } from "../nhan-vat/Obito";
import { Sakura } from "../nhan-vat/Sakura";
import { Neyji } from "../nhan-vat/Neyji";
import { Sasuke } from "../nhan-vat/Sasuke";
import { Hinata } from "../nhan-vat/Hinata";
import { MocNhan } from "../quai-vat/MocNhan";

const classes = { naruto: Naruto, minato: Minato, kakashi: Kakashi, sasuke: Sasuke, itachi: Itachi, obito: Obito, hinata: Hinata, sakura: Sakura, neyji: Neyji };

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
    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    this.player.move(left ? -1 : right ? 1 : 0);
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
    const CharacterClass = classes[config.key];
    this.player = new CharacterClass(this, config).setPosition(x, 570);
    this.cameras.main?.startFollow(this.player, true, .08, .08);
    this.events.emit("character", config);
  }

  setTarget(enemy) { if (enemy?.active) { this.target = enemy; this.events.emit("enemyHp", enemy); } }
  nextTarget() {
    const alive = this.enemies.filter(e => e.active);
    if (!alive.length) return;
    const index = Math.max(-1, alive.indexOf(this.target));
    this.setTarget(alive[(index + 1) % alive.length]);
  }

  punch() {
    if (!this.target?.active) return;
    const target = this.target;
    const distance = Math.abs(target.x - this.player.x);
    if (distance > 150) return this.notice("Mục tiêu quá xa để đấm");
    const hit = () => {
      if (!this.player.attackAnimation()) return;
      this.player.setFlipX(target.x < this.player.x);
      this.time.delayedCall(180, () => this.hitEnemy(target, this.player.config.punch));
    };
    if (distance > 40) {
      const destination = target.x + (this.player.x < target.x ? -38 : 38);
      this.tweens.add({ targets: this.player, x: destination, duration: 140, ease: "Power2", onComplete: hit });
    } else hit();
  }

  castSkill() {
    if (!this.target?.active) return;
    const target = this.target;
    const distance = Math.abs(target.x - this.player.x);
    if (distance < 40 || distance > 300) return this.notice(distance < 40 ? "Lùi ra để dùng chưởng" : "Mục tiêu ngoài tầm chưởng");
    if (!this.player.skillAnimation()) return;
    this.player.setFlipX(target.x < this.player.x);
    const direction = target.x < this.player.x ? -1 : 1;
    const orb = this.add.image(
      this.player.body.center.x,
      this.player.body.center.y,
      this.player.config.skillImage,
    )
      .setDepth(7)
      .setDisplaySize(84, 84)
      .setFlipX(direction < 0);
    this.tweens.add({
      targets: orb,
      x: target.body.center.x,
      y: target.body.center.y,
      duration: 360,
      ease: "Linear",
      onComplete: () => {
        orb.destroy();
        this.hitEnemy(target, this.player.config.skillDamage);
      },
    });
  }

  hitEnemy(enemy, amount) {
    if (!enemy?.active) return;
    const critical = Math.random() < .1;
    const damage = critical ? Math.round(amount * 1.5) : amount;
    const text = this.add.text(enemy.x, enemy.y - 100, `${critical ? "CRIT " : ""}-${damage}`, { font: "800 20px Arial", color: critical ? "#ff6b39" : "#ffffff", stroke: "#151515", strokeThickness: 4 }).setOrigin(.5).setDepth(10);
    this.tweens.add({ targets: text, y: text.y - 55, alpha: 0, duration: 750, onComplete: () => text.destroy() });
    const dead = enemy.damage(damage);
    this.events.emit("enemyHp", enemy);
    if (dead) this.killEnemy(enemy);
  }

  killEnemy(enemy) {
    for (let i = 0; i < 9; i++) {
      const smoke = this.add.circle(enemy.x, enemy.y - 30, Phaser.Math.Between(12, 28), 0xf4f1db, .8).setDepth(8);
      this.tweens.add({ targets: smoke, x: smoke.x + Phaser.Math.Between(-65, 65), y: smoke.y + Phaser.Math.Between(-70, 15), alpha: 0, scale: 2, duration: 700, onComplete: () => smoke.destroy() });
    }
    enemy.disableBody(true, true);
    this.time.delayedCall(6000, () => enemy.respawn());
    this.nextTarget();
  }

  notice(message) {
    this.events.emit("notice", message);
  }
}
