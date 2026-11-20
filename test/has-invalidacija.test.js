// Pravila s :has(), ki za :has() ciljajo pogost element (span, svg.i, div …), upočasnijo vsak klik (j 15. 11. 2026: »vse
// se ob kliku odpre takoj«). Chrome vse, kar v slogih stoji za kakšnim :has(), združi v en nabor; ob vsaki spremembi
// strani (meni profila, okno, zamenjava profila) z njim znova preračuna slog vseh ujemajočih se elementov pod body. Ko sta
// bila v naboru span in razred i (vse ikone), je bilo to ~270 elementov in ~40 ms na telefonu na dotik (sled
// scripts/meritev-zmogljivosti.mjs --sled). Zato: za :has() naj stoji redek razred ali id; velikost ikone pravilo
// s :has() nastavi na staršu s spremenljivko (npr. --ta-ic v style.css, --dz-ic v games.css).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PUBLIC = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const POGOSTI = new Set(["*", "span", "svg", "div", "button", "a", "li", "b", "small", "path", "i"]);

// selektor razdeli na vrhnji ravni (vejice zunaj oklepajev)
function razdeli(s) {
  const out = [];
  let d = 0, cur = "";
  for (const c of s) {
    if (c === "(") d++;
    if (c === ")") d--;
    if (c === "," && !d) (out.push(cur.trim()), (cur = ""));
    else cur += c;
  }
  out.push(cur.trim());
  return out.filter(Boolean);
}
// zadnji sestavljeni selektor (desno od zadnjega kombinatorja zunaj oklepajev)
function zadnji(s) {
  let d = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const c = s[i];
    if (c === ")") d++;
    else if (c === "(") d--;
    else if (!d && /[\s>+~]/.test(c)) return s.slice(i + 1);
  }
  return s;
}
// znak, po katerem Chrome izbira elemente za preračun: id, sicer razredi, sicer atribut, sicer oznaka
function znak(comp) {
  // seznama v :is() tu ne presojamo; sam :not() (otroci .tb-demo-mount v ui.css, le v učbeniku) v sledi ni širil preračuna
  if (/:(is|where)\(/.test(comp) || /^:not\(/.test(comp)) return null;
  const s = comp.replace(/:(?:not|has|nth-[a-z-]+)\((?:[^()]|\([^()]*\))*\)/g, "").replace(/::?[a-z-]+/g, "");
  if (/#[\w-]/.test(s)) return null;
  const cls = s.match(/\.[\w-]+/g);
  if (cls) return cls.every((c) => c === ".i") ? ".i" : null;
  if (/\[/.test(s)) return null;
  return (s.match(/^[a-z][\w-]*/i) || ["*"])[0].toLowerCase();
}

test("za :has() ne stoji pogost element (span, svg.i …), ki bi ob vsakem kliku preračunal vse ikone", () => {
  const files = fs.readdirSync(PUBLIC, { recursive: true }).filter((f) => f.endsWith(".css") && !f.includes("node_modules") && !/(^|\/)vendor\//.test(f));
  assert.ok(files.length > 10, "najde sloge");
  const slabi = [];
  let nesubjektni = 0;
  for (const f of files) {
    const css = fs.readFileSync(path.join(PUBLIC, f), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    for (const m of css.matchAll(/([^{}]+)\{[^{}]*\}/g)) {
      for (const sel of razdeli(m[1].trim())) {
        if (!sel.includes(":has(")) continue;
        const z = zadnji(sel);
        if (z.includes(":has(")) continue; // :has() na samem cilju: preračuna le tega
        nesubjektni++;
        const k = znak(z);
        if (k && (k === ".i" || POGOSTI.has(k))) slabi.push(`${f}: ${sel}`);
      }
    }
  }
  assert.ok(nesubjektni > 20, "pregleda pravila s :has() pred ciljem");
  assert.deepEqual(slabi, []);
});
