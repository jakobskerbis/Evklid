// Formule v besedilu poskusov so KaTeX s pravimi ulomki (j, 12. 11. 2026: »Popravi take formule povsod«, slika poskusa
// mešanja vode: T = (m₁T₁ + m₂T₂)/(m₁ + m₂) = (…)/198,2 g = 50,9 °C se je lomil sredi izraza). Formula v vrstici ostane
// cela, ko gre; sicer jo sirina.js prelomi pri =.
// 1) Nobena formula v laboratoriju ni več ulomek s poševnico v HTML (<i>a</i>/<i>b</i>, (…)/(…)).
// 2) Vsak tex(…) v laboratoriju se z vzorčnimi števili izriše brez napake, tudi v strogem načinu KaTeX.
// 3) Izpisi 3D teles (V = a³√2/12 = …) so formule; vsak zapis se prepiše v LaTeX.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import katex from "katex";
import { fixed, en, rez } from "../public/sim/lab.js";
import { fmt, decVejica } from "../public/sim/kit.js";

const DIR = "public/sim";
const FILES = fs.readdirSync(DIR).filter((f) => /^lab(?:-|\.js)/.test(f) && !f.startsWith("lab-model"));

// Vsebina vseh klicev tex(…) in texBlock(…) v datoteki: tex("…"), tex(`…`) in tex(String.raw`…`) z vgnezdenimi ${…} in predlogami.
function texKlici(src) {
  const out = [];
  const re = /(?<![\w.])tex(?:Block)?\(/g;
  for (let m; (m = re.exec(src)); ) {
    const i = m.index;
    let j = i + m[0].length;
    if (src.startsWith("String.raw`", j)) j += "String.raw".length;
    const q = src[j];
    if (!"`\"".includes(q)) continue;
    const end = q === "`" ? konecPredloge(src, j) : src.indexOf('"', j + 1) + 1;
    out.push({ raw: src.slice(i + m[0].length, end), vrstica: src.slice(0, i).split("\n").length });
    re.lastIndex = end;
  }
  return out;
}
// Konec predloge, ki se začne s ` na mestu j (upošteva ${…} in predloge v njih).
function konecPredloge(s, j) {
  let k = j + 1;
  while (k < s.length) {
    if (s[k] === "\\") k += 2;
    else if (s[k] === "`") return k + 1;
    else if (s[k] === "$" && s[k + 1] === "{") {
      let d = 1;
      k += 2;
      while (d > 0) {
        if (s[k] === "`") k = konecPredloge(s, k);
        else if (s[k] === '"' || s[k] === "'") k = s.indexOf(s[k], k + 1) + 1;
        else {
          if (s[k] === "{") d++;
          else if (s[k] === "}") d--;
          k++;
        }
      }
    } else k++;
  }
  throw new Error("nezaključena predloga");
}

// Vzorčna vrednost za vsako spremenljivko v ${…}: število 12,3, ki ima tudi vse lastnosti (x.k, x.pts.length, x.toFixed()).
const vzorec = new Proxy(function () {}, {
  get: (t, k) => (k === Symbol.toPrimitive ? (hint) => (hint === "string" ? "12,3" : 12.3) : k === "length" ? 3 : vzorec),
  apply: () => vzorec,
});
const ZNANE = { fixed: (x, d) => fixed(+x, d), en, rez, fmt: (x, d) => fmt(+x, d), num: (x, d = 1) => fixed(+x, d), String, Math, Number, parseFloat, Set };
const okolje = new Proxy({}, { has: (t, k) => k !== "undefined", get: (t, k) => (k === Symbol.unscopables ? undefined : ZNANE[k] ?? vzorec) });

test("laboratorij: formule z ulomki so KaTeX, ne <i>a</i>/<i>b</i> v besedilu", () => {
  const ostale = [];
  for (const f of FILES) {
    fs.readFileSync(`${DIR}/${f}`, "utf8")
      .split("\n")
      .forEach((l, n) => {
        if (/^\s*\/\//.test(l)) return;
        // ulomek med deloma formule v HTML: </i>/, </sub>/, ₁/, )/( ali …/<i>
        if (/(?:<\/i>|<\/sub>|[₀-₉])\s?\/\s?(?:\(|<i>|Δ)|\)\/\(<i>/.test(l.replace(/label: "[^"]*"/g, ""))) ostale.push(`${f}:${n + 1}`);
      });
  }
  assert.deepEqual(ostale, [], "formula s poševnico v besedilu; napiši jo s tex() in \\frac");
});

test("laboratorij: vsak tex(…) in texBlock(…) se izriše brez napake (strogi KaTeX, vzorčna števila)", () => {
  let n = 0;
  for (const f of FILES) {
    for (const k of texKlici(fs.readFileSync(`${DIR}/${f}`, "utf8"))) {
      // eslint-disable-next-line no-new-func
      const t = Function("o", `with (o) return ${k.raw};`)(okolje);
      assert.equal(typeof t, "string", `${f}:${k.vrstica}`);
      assert.doesNotThrow(() => katex.renderToString(decVejica(t), { throwOnError: true, strict: "error" }), `${f}:${k.vrstica}: ${t}`);
      assert.ok(!/\$\{|<\/?[ib]>|<sub>/.test(t), `${f}:${k.vrstica}: HTML v formuli: ${t}`);
      n++;
    }
  }
  assert.ok(n >= 60, `premalo formul (${n})`);
});

// 3) 3D telesa: prostornina, površina, osnovna ploskev, plašč in polmera krogel so v izpisu formule (tex: true).
test("3D telesa: vsak zapis količine (a³√2/12, O · v/3 …) se prepiše v LaTeX in izriše brez napake", async () => {
  const { fTex } = await import("../public/3d/modeli/matematika/telesa.js");
  const src = fs.readFileSync("public/3d/modeli/matematika/telesa.js", "utf8");
  const zapisi = [...new Set([...src.matchAll(/\b(?:V|P|O|O2|pl|Rv|Ro): \["([^"]+)",/g)].map((m) => m[1]))];
  assert.ok(zapisi.length >= 50, `premalo zapisov (${zapisi.length})`);
  for (const z of zapisi) {
    const t = fTex(z);
    assert.ok(!/[/√·²³ₛ₁₂]/.test(t.replace(/\\frac|\\sqrt/g, "")), `${z} → ${t}`);
    assert.doesNotThrow(() => katex.renderToString(t, { throwOnError: true, strict: "error" }), `${z} → ${t}`);
  }
  assert.equal(fTex("O · v/3"), "\\frac{O \\cdot v}{3}");
  assert.match(src, /id: "V", oznaka: "Prostornina", tex: true/);
});
