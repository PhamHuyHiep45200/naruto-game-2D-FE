import { api } from "./api";
import { skillFolderByClan, villages } from "./ui/constants";
import { bindJoystick } from "./ui/joystick";
import {
  ArrowLeft,
  CircleArrowUp,
  Eye,
  Flame,
  LockKeyhole,
  LogIn,
  LogOut,
  MapPinned,
  Menu,
  Music,
  Play,
  ScrollText,
  Settings,
  SlidersHorizontal,
  Sparkles,
  UserPlus,
  UserRound,
  Volume2,
  Wind,
  X,
  Zap,
  createIcons,
} from "lucide";

let started = false;
let profile = null;
let scene = null;
let selectedCharacter = null;
let selectedSkill = "punch";
let saveTimer = null;

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
const characterByName = name => scene.characterList.find(character => character.name === name);

function showScreen(id) {
  $$(".screen").forEach(screen => screen.classList.toggle("visible", screen.id === id));
  $("#game-ui").classList.toggle("visible", id === "game-ui");
  scene?.setGameplayEnabled(id === "game-ui");
}

function showMessage(text, error = false) {
  const message = $("#message");
  message.textContent = text;
  message.classList.toggle("error", error);
  message.classList.add("show");
  clearTimeout(message.timer);
  message.timer = setTimeout(() => message.classList.remove("show"), 1800);
}

function errorText(error) {
  return error instanceof TypeError ? "Không kết nối được máy chủ game" : error.message;
}

function setBusy(form, busy) {
  form.querySelector("button[type=submit]").disabled = busy;
}

function selectModalTab(tabId) {
  $$(".tab-button").forEach(button => button.classList.toggle("active", button.dataset.tab === tabId));
  $$(".tab-panel").forEach(panel => panel.classList.toggle("active", panel.id === tabId));
}

let modalTimeout1 = null;
let modalTimeout2 = null;
let modalTimeout3 = null;

function clearModalTimeouts() {
  if (modalTimeout1) clearTimeout(modalTimeout1);
  if (modalTimeout2) clearTimeout(modalTimeout2);
  if (modalTimeout3) clearTimeout(modalTimeout3);
  modalTimeout1 = null;
  modalTimeout2 = null;
  modalTimeout3 = null;
}

function openSystemModal(tabId = "quest-tab", settingsOnly = false) {
  const modal = $("#system-modal");
  modal.classList.toggle("settings-only", settingsOnly);
  selectModalTab(tabId);
  
  clearModalTimeouts();
  
  modal.classList.remove("opened", "closing");
  modal.classList.add("visible", "opening");
  
  // 1. Mở ra trong 2s
  modalTimeout1 = setTimeout(() => {
    modal.classList.remove("opening");
    modal.classList.add("opened");
  }, 2000);
  
  // 2. Hiển thị trong 6s (tổng cộng 8s từ lúc bắt đầu)
  modalTimeout2 = setTimeout(() => {
    closeSystemModal();
  }, 8000);
}

function closeSystemModal() {
  const modal = $("#system-modal");
  if (!modal.classList.contains("visible") || modal.classList.contains("closing")) return;
  
  clearModalTimeouts();
  
  modal.classList.remove("opening", "opened");
  modal.classList.add("closing");
  
  // 3. Đóng trong 2s
  modalTimeout3 = setTimeout(() => {
    modal.classList.remove("closing", "visible", "settings-only");
  }, 2000);
}

function renderProfile() {
  if (!profile) return;
  $("#account-name").textContent = profile.username || "";
  $("#chakra-value").textContent = profile.chakra ?? 0;
  $("#quest-progress").textContent = `${profile.kills ?? 0} / 10`;
  $("#quest-fill").style.width = `${Math.min((profile.kills ?? 0) / 10 * 100, 100)}%`;
  if (profile.settings) {
    $("#bgm-toggle").checked = !!profile.settings.bgm;
    $("#sfx-toggle").checked = !!profile.settings.sfx;
  }

  if (!profile.character) return;

  const character = characterByName(profile.character.name);
  if (character) {
    const skillFolder = skillFolderByClan[character.clan];
    const punchIcon = `/imgs/skill/${skillFolder}/dam.png`;
    const blastIcon = `/imgs/skill/${skillFolder}/chuong.png`;
    $(".hero-panel").className = `hero-panel ${character.clan.toLowerCase()}`;
    $("#hero-avatar").src = `/imgs/avatar/hud/${character.key}.png`;
    $("#punch-icon").src = punchIcon;
    $("#modal-punch-icon").src = punchIcon;
    $("#blast-icon").src = blastIcon;
    $("#modal-blast-icon").src = blastIcon;
    $("#hero-name").innerHTML = `${character.name.toUpperCase()} <span class="hero-rank">[ HẠ NHÂN ]</span>`;
    $("#hero-clan").textContent = `${character.clan} · ${character.skill}`;
    $("#punch-level").textContent = profile.skills.punch;
    $("#blast-level").textContent = profile.skills.blast;
    $("#punch-cost").textContent = profile.skills.punch >= 9 ? "Tối đa" : `${profile.skills.punch * 100} Chakra`;
    $("#blast-cost").textContent = profile.skills.blast >= 9 ? "Tối đa" : `${profile.skills.blast * 100} Chakra`;
    $("#punch-upgrade").disabled = profile.skills.punch >= 9;
    $("#blast-upgrade").disabled = profile.skills.blast >= 9;
    scene.applyProfile(profile);
  }
}

function queueProgressSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      profile = await api.updateProgress({ chakra: profile.chakra, kills: profile.kills });
      renderProfile();
    } catch (error) {
      showMessage(errorText(error), true);
    }
  }, 500);
}

function renderCharacterSelection() {
  const signs = $("#village-signs");
  const container = $("#clan-cards");
  const renderClan = village => {
    selectedCharacter = null;
    $("#start-game").disabled = true;
    $("#selected-village-label").textContent = village.village;
    $("#selected-clan-name").textContent = village.clan;
    $("#selected-clan-description").textContent = village.description;
    $("#character-stage").className = `character-stage ${village.theme}`;
    $$(".village-sign").forEach(sign => sign.classList.toggle("active", sign.dataset.clan === village.clan));
    container.innerHTML = "";

    scene.characterList.filter(character => character.clan === village.clan).forEach(character => {
      const button = document.createElement("button");
      button.className = "avatar-choice";
      button.dataset.name = character.name;
      button.innerHTML = `<img src="/imgs/avatar/select-actor/${character.key}.png" alt="${character.name}"><span>${character.name}</span>`;
      button.onclick = () => {
        selectedCharacter = character;
        $$(".avatar-choice").forEach(item => item.classList.toggle("active", item.dataset.name === character.name));
        $("#start-game").disabled = false;
      };
      container.append(button);
    });
  };

  signs.innerHTML = "";
  villages.forEach(village => {
    const button = document.createElement("button");
    button.className = `village-sign ${village.theme}`;
    button.dataset.clan = village.clan;
    button.innerHTML = `<i class="village-icon" data-lucide="${village.icon}"></i><small>${village.clan}</small><strong>${village.village}</strong><span>${village.description}</span>`;
    button.onclick = () => renderClan(village);
    signs.append(button);
  });

  renderClan(villages[0]);
}

async function enterGame() {
  showScreen("game-ui");
  renderProfile();
}

function bindAuth() {
  $$(".auth-switch").forEach(button => button.onclick = () => {
    $("#login-form").classList.toggle("active", button.dataset.form === "login");
    $("#register-form").classList.toggle("active", button.dataset.form === "register");
  });

  $("#login-form").onsubmit = async event => {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(form, true);
    try {
      profile = await api.login(Object.fromEntries(new FormData(form)));
      if (profile.character) await enterGame();
      else showScreen("character-screen");
    } catch (error) {
      showMessage(errorText(error), true);
    } finally {
      setBusy(form, false);
    }
  };

  $("#register-form").onsubmit = async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (data.password !== data.confirmPassword) return showMessage("Mật khẩu xác nhận không khớp", true);
    setBusy(form, true);
    try {
      profile = await api.register({ username: data.username, email: data.email, password: data.password });
      showScreen("character-screen");
    } catch (error) {
      showMessage(errorText(error), true);
    } finally {
      setBusy(form, false);
    }
  };
}

function bindGameUI() {
  scene.events.on("character", character => {
    if (!profile || !profile.character || character.name !== profile.character.name) return;
    $("#hero-avatar").src = `/imgs/avatar/hud/${character.key}.png`;
  });
  scene.events.on("enemyHp", enemy => {
    $("#enemy-hp").style.width = `${enemy.hp / enemy.maxHp * 100}%`;
    $("#enemy-hp-text").textContent = `${enemy.hp} / ${enemy.maxHp}`;
  });
  scene.events.on("notice", text => showMessage(text));
  scene.events.on("cooldown", ({ skill, duration }) => {
    const button = skill === "punch" ? $("#punch") : $("#skill");
    const timer = button.querySelector(".cooldown-time");
    const endsAt = performance.now() + duration;
    button.style.setProperty("--cooldown", `${duration}ms`);
    button.classList.remove("cooling");
    void button.offsetWidth;
    button.classList.add("cooling");
    clearInterval(button.cooldownTimer);
    const updateTimer = () => {
      const remaining = Math.max(0, endsAt - performance.now());
      timer.textContent = remaining > 0 ? (remaining / 1000).toFixed(1) : "";
      if (remaining <= 0) {
        clearInterval(button.cooldownTimer);
        button.classList.remove("cooling");
      }
    };
    updateTimer();
    button.cooldownTimer = window.setInterval(updateTimer, 50);
  });
  scene.events.on("hit", ({ enemy }) => {
    if (!profile) return;
    const gained = 10;
    profile.chakra += gained;
    renderProfile();
    queueProgressSave();
    const text = scene.add.text(scene.player.x, scene.player.y - 100, `+${gained}`, { font: "800 20px Arial", color: "#66ff8a", stroke: "#092b16", strokeThickness: 4 }).setDepth(12);
    scene.tweens.add({ targets: text, y: text.y - 45, alpha: 0, duration: 700, onComplete: () => text.destroy() });
    for (let i = 0; i < 5; i++) {
      const particle = scene.add.circle(enemy.x, enemy.y - 30, 4, 0x43ff75, 1).setDepth(10);
      scene.tweens.add({ targets: particle, x: scene.player.x, y: scene.player.y - 20, duration: 450 + i * 50, onComplete: () => particle.destroy() });
    }
  });
  scene.events.on("kill", () => {
    if (!profile) return;
    profile.kills += 1;
    renderProfile();
    queueProgressSave();
  });

  $$(".skill-slot[data-skill]").forEach(button => button.onclick = () => {
    selectedSkill = button.dataset.skill;
    $$(".skill-slot[data-skill]").forEach(item => item.classList.toggle("active", item === button));
    if (selectedSkill === "punch") {
      scene?.punch();
    } else {
      scene?.castSkill();
    }
  });
  $("#action").onclick = () => selectedSkill === "punch" ? scene?.punch() : scene?.castSkill();
  $("#target").onclick = () => scene?.nextTarget();
  bindJoystick($("#joystick"), (x, y) => scene.setVirtualMove(x, y));
  $(".hero-panel").onclick = () => openSystemModal("quest-tab");
  $("#character-settings").onclick = () => openSystemModal("settings-tab", true);
  $("#menu-close").onclick = () => {
    closeSystemModal();
  };
  $$(".tab-button").forEach(button => button.onclick = () => {
    selectModalTab(button.dataset.tab);
  });
  ["bgm", "sfx"].forEach(setting => {
    $(`#${setting}-toggle`).onchange = async event => {
      try {
        profile = await api.updateProgress({ [setting]: event.target.checked });
        renderProfile();
      } catch (error) {
        showMessage(errorText(error), true);
      }
    };
  });
  [["punch-upgrade", "punch"], ["blast-upgrade", "blast"]].forEach(([id, skill]) => {
    $(`#${id}`).onclick = async () => {
      try {
        profile = await api.upgrade(skill);
        renderProfile();
        showMessage("Nâng cấp kỹ năng thành công");
      } catch (error) {
        showMessage(errorText(error), true);
      }
    };
  });
  $("#logout").onclick = async () => {
    if (!confirm("Đăng xuất khỏi game?")) return;
    await api.logout();
    profile = null;
    clearModalTimeouts();
    $("#system-modal").className = "modal";
    showScreen("auth-screen");
  };
}

export async function startUI(game) {
  if (started) return;
  started = true;
  scene = game.scene.getScene("lang-la");
  const renderIcons = () => createIcons({
    icons: {
      ArrowLeft,
      CircleArrowUp,
      Eye,
      Flame,
      LockKeyhole,
      LogIn,
      LogOut,
      MapPinned,
      Menu,
      Music,
      Play,
      ScrollText,
      Settings,
      SlidersHorizontal,
      Sparkles,
      UserPlus,
      UserRound,
      Volume2,
      Wind,
      X,
      Zap,
    },
  });
  const particles = $(".auth-particles");
  particles.innerHTML = Array.from({ length: 18 }, (_, index) =>
    `<i style="--x:${(index * 37) % 100}%;--delay:${-(index % 7)}s;--duration:${5 + index % 5}s"></i>`
  ).join("");
  renderCharacterSelection();
  renderIcons();
  bindAuth();
  bindGameUI();
  $("#start-game").onclick = async () => {
    try {
      profile = await api.selectCharacter({ clan: selectedCharacter.clan, name: selectedCharacter.name });
      await enterGame();
    } catch (error) {
      showMessage(errorText(error), true);
    }
  };

  if (!api.hasSession()) return showScreen("auth-screen");
  try {
    profile = await api.profile();
    if (profile.character) await enterGame();
    else showScreen("character-screen");
  } catch {
    await api.logout();
    showScreen("auth-screen");
  }
}
