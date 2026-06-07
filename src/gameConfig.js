import Phaser from "phaser";
import { LangLaScene } from "./lang/LangLaScene";

export const gameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  width: 1280,
  height: 720,
  backgroundColor: "#0b151c",
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [LangLaScene],
  render: { antialias: true, pixelArt: false },
};
