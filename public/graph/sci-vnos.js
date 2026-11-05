// Vnos znanstvenega kalkulatorja kot lep zapis s kazalcem (j, 5. 11.: »nikjer v kalkulatorju naj ne bo viden surov vnos«).
// Besedilo, ki ga uporabnik vpisuje, je še nedokončano (odprt oklepaj, manjkajoč eksponent), zato ga pred izrisom
// dokončamo: kazalec je spremenljivka-oznaka, odprti oklepaji se zaprejo, manjkajoči operandi dobijo prazen okvirček.
// Brez DOM; test/sci-vnos.test.js.
import { previewTex } from "./scisolve.js";

const CARET = "\\color{#2f6bff}\\rule[-0.25em]{0.1em}{1.15em}";
const HOLE = "\\color{#8a94a6}\\square";
const LETTERS = "qwjkzvyuhg";

/** Dokonča besedilo za izris: zapre oklepaje in zapolni manjkajoče operande z oznako `hole`. */
export function complete(text, hole) {
  let s = text;
  const stack = [];
  for (const c of s) {
    if (c === "(" || c === "[") stack.push(c === "(" ? ")" : "]");
    else if ((c === ")" || c === "]") && stack.length) stack.pop();
  }
  s += stack.reverse().join("");
  // prazen argument: »(«, »; « pred »)« ali »;«, »^(« in »_(« brez vsebine
  s = s.replace(/([(\[;])(\s*)(?=[)\];])/g, `$1$2${hole}`);
  // operator na koncu ali pred zaprtim oklepajem / podpičjem
  s = s.replace(/([+\-−×÷*/^·=<>≤≥,])(\s*)(?=[)\];]|$)/g, `$1$2${hole}`);
  // oklepaj-konec: »(« takoj na koncu je že pokrit zgoraj (zaprt z »)«)
  return s;
}

/**
 * TeX vnosa s kazalcem na mestu `caret`. `fallback(text)` izriše besedilo, ki ga ni mogoče razčleniti.
 * Vrne { tex, ok } (ok: lep zapis iz izraza; sicer samo besedilo v matematični pisavi).
 */
export function entryTex(text, caret = text.length, env = {}) {
  const raw = String(text ?? "");
  if (!raw.trim()) return null;
  const at = Math.max(0, Math.min(raw.length, caret));
  const used = new Set(raw.toLowerCase());
  const free = [...LETTERS].filter((c) => !used.has(c));
  if (free.length >= 2) {
    const [cm, hm] = free;
    const withCaret = raw.slice(0, at) + cm + raw.slice(at);
    const done = complete(withCaret, hm);
    const tex = previewTex(done, env);
    if (tex) {
      const sub = (re, to, s) => s.replace(new RegExp(`(?<![\\\\A-Za-z])${re}(?![A-Za-z])`, "g"), () => to);
      return { ok: true, tex: sub(hm, `{${HOLE}}`, sub(cm, `{${CARET}}`, tex)) };
    }
  }
  // nerazčlenljivo: besedilo v matematični pisavi, kazalec na mestu
  const esc = (x) => x.replace(/[\\{}$&#^_%~]/g, (c) => `\\${c === "\\" ? "textbackslash " : c}`);
  return { ok: false, tex: `\\text{${esc(raw.slice(0, at))}}{${CARET}}\\text{${esc(raw.slice(at))}}` };
}
