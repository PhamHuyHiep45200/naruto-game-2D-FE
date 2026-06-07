import Phaser from "phaser";
import "./style.css";
import { LangLaScene } from "./lang/LangLaScene";
import { bindUI } from "./ui";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 1280,
  height: 720,
  backgroundColor: "#0b151c",
  physics: { default: "arcade", arcade: { gravity: { y: 0 }, debug: false } },
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [LangLaScene],
  render: { antialias: true, pixelArt: false },
});

const bindWhenReady = () => {
  const scene = game.scene.getScene("lang-la");
  if (scene?.characterList && scene.player) bindUI(game);
  else window.setTimeout(bindWhenReady, 50);
};
bindWhenReady();

export default game;
