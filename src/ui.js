export function bindUI(game) {
  const scene = game.scene.getScene("lang-la");
  const avatar = document.querySelector("#hero-avatar");
  const name = document.querySelector("#hero-name");
  const clan = document.querySelector("#hero-clan");
  const buttons = document.querySelector("#character-buttons");
  const enemyHp = document.querySelector("#enemy-hp");
  const enemyHpText = document.querySelector("#enemy-hp-text");
  const message = document.querySelector("#message");

  const updateCharacter = character => {
    avatar.src = `/imgs/avatar/hud/${character.key}.png`;
    name.textContent = character.name;
    clan.textContent = `${character.clan} · ${character.skill}`;
    document.querySelectorAll("#character-buttons button").forEach(button => {
      button.classList.toggle("active", button.dataset.key === character.key);
    });
  };
  scene.events.on("character", updateCharacter);

  scene.characterList.forEach(character => {
    const button = document.createElement("button");
    button.title = character.name;
    button.innerHTML = `<img src="/imgs/avatar/hud/${character.key}.png" alt="${character.name}">`;
    button.onclick = () => scene.switchCharacter(character);
    button.dataset.key = character.key;
    buttons.append(button);
  });
  updateCharacter(scene.characterList[0]);

  scene.events.on("enemyHp", enemy => {
    enemyHp.style.width = `${enemy.hp / enemy.maxHp * 100}%`;
    enemyHpText.textContent = `${enemy.hp} / ${enemy.maxHp}`;
  });
  scene.events.on("notice", text => {
    message.textContent = text;
    message.classList.add("show");
    clearTimeout(message.timer);
    message.timer = setTimeout(() => message.classList.remove("show"), 1200);
  });
  document.querySelector("#punch").onclick = () => scene.punch();
  document.querySelector("#skill").onclick = () => scene.castSkill();
  document.querySelector("#target").onclick = () => scene.nextTarget();
}
