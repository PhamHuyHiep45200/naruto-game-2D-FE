import { Hinata } from "./Hinata";
import { Itachi } from "./Itachi";
import { Kakashi } from "./Kakashi";
import { Minato } from "./Minato";
import { Naruto } from "./Naruto";
import { Neyji } from "./Neyji";
import { Obito } from "./Obito";
import { Sakura } from "./Sakura";
import { Sasuke } from "./Sasuke";

const characterClasses = {
  hinata: Hinata,
  itachi: Itachi,
  kakashi: Kakashi,
  minato: Minato,
  naruto: Naruto,
  neyji: Neyji,
  obito: Obito,
  sakura: Sakura,
  sasuke: Sasuke,
};

export function getCharacterClass(key) {
  const CharacterClass = characterClasses[key];
  if (!CharacterClass) throw new Error(`Không tìm thấy lớp nhân vật: ${key}`);
  return CharacterClass;
}
