const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = "shinobi-token";
const ACCOUNTS_KEY = "shinobi-demo-accounts";

let token = localStorage.getItem(TOKEN_KEY);

const readAccounts = () => JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
const writeAccounts = accounts => localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
const clone = value => JSON.parse(JSON.stringify(value));

function localProfile() {
  const accounts = readAccounts();
  const profile = accounts[token];
  if (!profile) throw new Error("Phiên đăng nhập đã hết hạn");
  return { accounts, profile };
}

async function localRequest(path, options = {}) {
  const body = options.body ? JSON.parse(options.body) : {};
  const accounts = readAccounts();

  if (path === "/auth/register") {
    if (Object.values(accounts).some(account => account.username === body.username)) throw new Error("Tên tài khoản đã tồn tại");
    token = crypto.randomUUID();
    accounts[token] = {
      username: body.username,
      email: body.email,
      password: body.password,
      character: null,
      chakra: 0,
      kills: 0,
      skills: { punch: 1, blast: 1 },
      settings: { bgm: true, sfx: true },
    };
    writeAccounts(accounts);
    return { token, profile: clone(accounts[token]) };
  }

  if (path === "/auth/login") {
    const entry = Object.entries(accounts).find(([, account]) => account.username === body.username && account.password === body.password);
    if (!entry) throw new Error("Tên tài khoản hoặc mật khẩu không đúng");
    [token] = entry;
    return { token, profile: clone(entry[1]) };
  }

  if (path === "/auth/logout") return {};
  const current = localProfile();
  if (path === "/profile") return clone(current.profile);
  if (path === "/profile/character") current.profile.character = { clan: body.clan, name: body.name };
  if (path === "/profile/progress") {
    if (body.chakra !== undefined) current.profile.chakra = body.chakra;
    if (body.kills !== undefined) current.profile.kills = body.kills;
    if (body.bgm !== undefined) current.profile.settings.bgm = body.bgm;
    if (body.sfx !== undefined) current.profile.settings.sfx = body.sfx;
  }
  if (path.includes("/profile/skills/")) {
    const skill = path.split("/")[3];
    const level = current.profile.skills[skill];
    const cost = level * 100;
    if (level >= 9) throw new Error("Kỹ năng đã đạt cấp tối đa");
    if (current.profile.chakra < cost) throw new Error("Không đủ Chakra");
    current.profile.chakra -= cost;
    current.profile.skills[skill] += 1;
  }
  writeAccounts(current.accounts);
  return clone(current.profile);
}

async function request(path, options = {}) {
  if (!API_URL) return localRequest(path, options);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(data.message) ? data.message[0] : data.message;
    throw new Error(message || "Không thể kết nối máy chủ");
  }
  return data;
}

function saveSession(session) {
  token = session.token;
  localStorage.setItem(TOKEN_KEY, token);
  return session.profile;
}

export const api = {
  hasSession: () => Boolean(token),
  register: data => request("/auth/register", { method: "POST", body: JSON.stringify(data) }).then(saveSession),
  login: data => request("/auth/login", { method: "POST", body: JSON.stringify(data) }).then(saveSession),
  profile: () => request("/profile"),
  selectCharacter: data => request("/profile/character", { method: "PATCH", body: JSON.stringify(data) }),
  updateProgress: data => request("/profile/progress", { method: "PATCH", body: JSON.stringify(data) }),
  upgrade: skill => request(`/profile/skills/${skill}/upgrade`, { method: "POST" }),
  async logout() {
    try {
      await request("/auth/logout", { method: "POST" });
    } finally {
      token = null;
      localStorage.removeItem(TOKEN_KEY);
    }
  },
};
