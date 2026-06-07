import Phaser from "phaser";
import "./style.css";
import { gameConfig } from "./gameConfig";
import { startUI } from "./ui";

const game = new Phaser.Game(gameConfig);

const bindWhenReady = () => {
  const scene = game.scene.getScene("lang-la");
  if (scene?.characterList && scene.player) startUI(game);
  else window.setTimeout(bindWhenReady, 50);
};
bindWhenReady();

export default game;
