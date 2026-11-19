// Vrsta ocene ocenjevalca v scripts/meri-prav-matura.mjs: OK, POTRDI, ZAVRNE, NAPAKA ali NEJASNO.
// Ocenjevalec (Opus) včasih napiše razmislek in šele v zadnji vrstici sodbo (meritev 19. 11.: 4 od 121 ocen so bile
// zato »NEJASNO«, čeprav so se končale z »OK«). Šteje zadnja vrstica, ki se začne z eno od oznak.
const OZNAKA = /^[\s*`_>#-]*(OK|POTRDI|ZAVRNE|NAPAKA)\b/i;
export function vrstaOcene(besedilo) {
  const vrstice = String(besedilo || "").split("\n").map((v) => v.trim()).filter(Boolean);
  for (let i = vrstice.length - 1; i >= 0; i--) {
    const m = OZNAKA.exec(vrstice[i]);
    if (m) return m[1].toUpperCase();
  }
  return "NEJASNO";
}
