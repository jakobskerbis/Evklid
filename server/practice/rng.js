// Ponovljiv generator naključnih števil (mulberry32) in pomožne funkcije.

export function makeRng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const r = {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    // decimalno število z d decimalkami
    dec: (min, max, d) => Math.round((min + next() * (max - min)) * 10 ** d) / 10 ** d,
    shuffle: (arr) => {
      const a2 = [...arr];
      for (let i = a2.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [a2[i], a2[j]] = [a2[j], a2[i]];
      }
      return a2;
    },
    nonZero: (min, max) => {
      let v = 0;
      while (v === 0) v = r.int(min, max);
      return v;
    },
  };
  return r;
}

export const NAMES = ["Ana", "Luka", "Eva", "Jan", "Nika", "Tim", "Zala", "Mark", "Lara", "Nejc", "Maja", "Žan"];
const FEMALE = new Set(["Ana", "Eva", "Nika", "Zala", "Lara", "Maja"]);

// Oblika glede na spol imena: g("Ana", "plačal", "plačala") → "plačala".
export const g = (name, m, f) => (FEMALE.has(name) ? f : m);

// Slovenska sklanjatev ob številu: n + ustrezna oblika (1 delavec, 2 delavca, 3 delavci, 5 delavcev).
// Odločata zadnji dve števki: 101 delavec, 102 delavca, 103 delavci, a 21 delavcev (ne »21 delavec«).
const oblika = (n) => {
  const h = Math.abs(n) % 100;
  return h === 1 ? 0 : h === 2 ? 1 : h === 3 || h === 4 ? 2 : 3;
};
export function nOf(n, ena, dve, tri, pet) {
  return `${n} ${[ena, dve, tri, pet][oblika(n)]}`;
}
// Glagol ob številu: verbOf(3, "prepleska", "prepleskata", "prepleskajo") → "prepleskajo".
// Pri 0 in 5–99 (zadnji dve števki, tudi 21–24) je glagol v ednini (srednji spol v pretekliku: "5 delavcev je prepleskalo").
export function verbOf(n, ena, dve, vec, pet = ena) {
  return [ena, dve, vec, pet][oblika(n)];
}

// Izbira odgovorov: pravilni + motilci, premešano. Vrne { options, index }.
export function choices(r, correct, distractors) {
  const unique = [...new Set(distractors.filter((d) => d !== correct))].slice(0, 3);
  const opts = r.shuffle([correct, ...unique]);
  return { options: opts, index: opts.indexOf(correct) };
}
