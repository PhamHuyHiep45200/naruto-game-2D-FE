const frames = {
  itachi: { idle: [1, 4], run: [5, 8], jump: [9, 13], attack: [14, 22], skill: [23, 25] },
  kakashi: { idle: [1, 4], run: [5, 8], jump: [9, 12], attack: [13, 20], skill: [21, 23] },
  minato: { idle: [1, 4], run: [5, 8], jump: [9, 12], attack: [13, 20], skill: [21, 23] },
  naruto: { idle: [1, 4], run: [5, 8], jump: [9, 12], attack: [14, 20], skill: [21, 23] },
  hinata: { idle: [1, 3], run: [5, 7], jump: [9, 11], attack: [12, 20], skill: [21, 23] },
  neyji: { idle: [1, 4], run: [5, 7], jump: [9, 10], attack: [11, 18], skill: [19, 20] },
  obito: { idle: [1, 4], run: [5, 8], jump: [9, 12], attack: [13, 20], skill: [21, 23] },
  sakura: { idle: [1, 4], run: [5, 8], jump: [9, 13], attack: [14, 19], skill: [20, 22] },
  sasuke: { idle: [1, 4], run: [5, 8], jump: [9, 12], attack: [13, 19], skill: [20, 23] },
};

export const characters = [
  { key: "naruto", name: "Naru Uzumaka", clan: "SEN-JIN", punch: 95, skillDamage: 250, skill: "Rasengan", skillImage: "rasengan", speed: 235, frameWidth: 299, frameHeight: 319, frames: frames.naruto },
  { key: "minato", name: "Mina Namikaz", clan: "SEN-JIN", punch: 95, skillDamage: 250, skill: "Phi Lôi Thần", skillImage: "rasengan", speed: 285, frameWidth: 300, frameHeight: 327, frames: frames.minato },
  { key: "kakashi", name: "KKshi Senpai", clan: "SEN-JIN", punch: 95, skillDamage: 250, skill: "Lôi Thiết", skillImage: "rasengan", speed: 240, frameWidth: 300, frameHeight: 327, frames: frames.kakashi },
  { key: "sasuke", name: "Sasuk Uchyha", clan: "UCHY-HA", punch: 110, skillDamage: 350, skill: "Hỏa Cầu Rồng", skillImage: "chuong-rong", speed: 245, frameWidth: 300, frameHeight: 327, frames: frames.sasuke },
  { key: "itachi", name: "Itach Uchyha", clan: "UCHY-HA", punch: 110, skillDamage: 350, skill: "Hỏa Cầu Rồng", skillImage: "chuong-rong", speed: 225, frameWidth: 350, frameHeight: 355, scale: 0.28, frames: frames.itachi },
  { key: "obito", name: "Obyto Uchyha", clan: "UCHY-HA", punch: 110, skillDamage: 350, skill: "Hỏa Cầu Rồng", skillImage: "chuong-rong", speed: 225, frameWidth: 300, frameHeight: 327, frames: frames.obito },
  { key: "hinata", name: "Hinat Hyuga", clan: "HYU-GA", punch: 80, skillDamage: 200, skill: "Chưởng Đầu Hổ", skillImage: "chuong-ho", speed: 270, frameWidth: 300, frameHeight: 327, scale: 0.3, frames: frames.hinata },
  { key: "sakura", name: "Sakur Haron", clan: "HYU-GA", punch: 80, skillDamage: 200, skill: "Chưởng Đầu Hổ", skillImage: "chuong-ho", speed: 255, frameWidth: 340, frameHeight: 327, scale: 0.28, frames: frames.sakura },
  { key: "neyji", name: "NeyJiii", clan: "HYU-GA", punch: 80, skillDamage: 200, skill: "Chưởng Đầu Hổ", skillImage: "chuong-ho", speed: 265, frameWidth: 400, frameHeight: 396, scale: 0.25, frames: frames.neyji },
];
