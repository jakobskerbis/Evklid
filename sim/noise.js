// Realističen zapis učenca: jezikovni model piše preveč čisto, zato sporočilo
// po slogu učenca »pokvarimo« (brez šumnikov, male začetnice, tipkarske napake).
// Naključje je ponovljivo (seme), da sta dva zagona primerljiva.

export function rng(seed = 1) {
  let a = typeof seed === "number" ? seed >>> 0 : hashString(String(seed));
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.codePointAt(0), 16777619);
  return h >>> 0;
}

// Sosednje tipke na slovenski tipkovnici (QWERTZ).
const ROWS = ["qwertzuiopš", "asdfghjklčž", "yxcvbnm"];
function neighbour(ch, r) {
  const lower = ch.toLowerCase();
  for (let y = 0; y < ROWS.length; y++) {
    const x = ROWS[y].indexOf(lower);
    if (x === -1) continue;
    const opts = [ROWS[y][x - 1], ROWS[y][x + 1], ROWS[y - 1]?.[x], ROWS[y + 1]?.[x]].filter(Boolean);
    return opts[Math.floor(r() * opts.length)] || ch;
  }
  return ch;
}

const STRIP = { č: "c", š: "s", ž: "z", Č: "C", Š: "S", Ž: "Z", ć: "c", đ: "d" };
export const stripDiacritics = (s) => s.replace(/[čšžČŠŽćđ]/g, (c) => STRIP[c]);

// Besede z matematiko (števila, enačaj, potence, LaTeX) ostanejo nedotaknjene,
// da tipkarska napaka ne spremeni vsebine naloge.
const isMathy = (w) => /[\d=^/\\+*()[\]{}$<>|_]/.test(w);

function typo(word, r) {
  if (word.length < 3 || isMathy(word) || !/^[\p{L}]+$/u.test(word)) return word;
  const i = 1 + Math.floor(r() * (word.length - 2));
  const kind = r();
  if (kind < 0.35) return word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2); // zamenjava sosednjih črk
  if (kind < 0.6) return word.slice(0, i) + word.slice(i + 1); // izpuščena črka
  if (kind < 0.8) return word.slice(0, i) + neighbour(word[i], r) + word.slice(i + 1); // sosednja tipka
  return word.slice(0, i) + word[i] + word.slice(i); // podvojena črka
}

/**
 * @param {string} text sporočilo, kot ga je napisal model
 * @param {object} style persona.pisanje
 * @param {() => number} r generator naključnih števil
 */
export function applyNoise(text, style = {}, r = Math.random) {
  let out = String(text || "").trim();
  if (!out) return out;
  if (style.tipkarske) {
    out = out
      .split(/(\s+)/)
      .map((w) => (/\s/.test(w) || r() >= style.tipkarske ? w : typo(w, r)))
      .join("");
  }
  if (style.brezSumnikov && r() < style.brezSumnikov) out = stripDiacritics(out);
  if (style.maleZacetnice) {
    out = out.replace(/(^|[.!?]\s+)(\p{Lu})(?=\p{Ll})/gu, (m, pre, c) => pre + c.toLowerCase());
    if (r() < 0.7) out = out.replace(/\.$/, "");
  }
  return out;
}
