// Star Safari (pred 16.4) in /3d: three.js r187 ima statične bloke razreda, zato stran pred three.js preveri brskalnik
// z uvozom public/3d/podpora.js (CSP ne dovoli eval). Statični uvozi strani /3d se morajo prebrati tudi v starem Safariju,
// sicer ostane stran prazna (prej: pogled nazaj v public/mikroskop/mapa.js).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import * as acorn from "acorn";

const PUB = path.resolve("public");
const beri = (f) => fs.readFileSync(f, "utf8");
const razcleni = (f) => acorn.parse(beri(f), { ecmaVersion: "latest", sourceType: "module" });

// Vsa vozlišča drevesa (brez acorn-walk).
function* vozlisca(n) {
  if (!n || typeof n.type !== "string") return;
  yield n;
  for (const [k, v] of Object.entries(n)) {
    if (k === "loc" || k === "start" || k === "end") continue;
    if (Array.isArray(v)) for (const x of v) yield* vozlisca(x);
    else if (v && typeof v === "object" && typeof v.type === "string") yield* vozlisca(v);
  }
}

// Izraz s pogledom nazaj ali zastavico v (Safari 17) v regularnem izrazu ali nizu za new RegExp.
function tezave(f) {
  const out = [];
  for (const tok of acorn.tokenizer(beri(f), { ecmaVersion: "latest", sourceType: "module", locations: true })) {
    const vr = tok.type.label;
    if (vr === "regexp") {
      if (/\(\?<[=!]/.test(tok.value.pattern)) out.push(`${tok.loc.start.line}: pogled nazaj /${tok.value.pattern}/`);
      if (tok.value.flags.includes("v")) out.push(`${tok.loc.start.line}: zastavica v`);
    } else if ((vr === "string" || vr === "template") && /\(\?<[=!]/.test(String(tok.value))) out.push(`${tok.loc.start.line}: pogled nazaj v nizu`);
  }
  return out;
}

const datoteke = (d) =>
  fs
    .readdirSync(d, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile() && /\.m?js$/.test(e.name))
    .map((e) => path.join(e.parentPath ?? e.path, e.name));

test("public/3d in public/mikroskop: brez pogleda nazaj (?<= (?<! in brez zastavice v v regularnih izrazih", () => {
  const najdbe = [];
  for (const f of [...datoteke(path.join(PUB, "3d")), ...datoteke(path.join(PUB, "mikroskop"))]) for (const n of tezave(f)) najdbe.push(`${path.relative(PUB, f)}:${n}`);
  assert.deepEqual(najdbe, []);
});

// Statični uvozi od vstopa strani /3d (stran.js): preberejo se, preden lahko stran karkoli pokaže.
function staticniGraf(vstop) {
  const videno = new Set();
  const vrsta = [vstop];
  while (vrsta.length) {
    const f = vrsta.pop();
    if (videno.has(f) || !fs.existsSync(f)) continue;
    videno.add(f);
    for (const n of razcleni(f).body) {
      if ((n.type !== "ImportDeclaration" && n.type !== "ExportNamedDeclaration" && n.type !== "ExportAllDeclaration") || !n.source) continue;
      const s = n.source.value;
      vrsta.push(s.startsWith("/") ? path.join(PUB, s) : path.resolve(path.dirname(f), s));
    }
  }
  return [...videno];
}

test("statični uvozi strani /3d nimajo statičnih blokov razreda (Safari 16.4) in jih three.js ne naloži", () => {
  const graf = staticniGraf(path.join(PUB, "3d", "stran.js"));
  assert.ok(graf.some((f) => f.endsWith(path.join("mikroskop", "mapa.js"))), "mapa.js je statični uvoz strani");
  for (const f of graf) {
    assert.ok(!f.includes(`${path.sep}vendor${path.sep}three`), `${path.relative(PUB, f)}: three.js mora priti šele po preverjanju`);
    const bloki = [...vozlisca(razcleni(f))].filter((n) => n.type === "StaticBlock");
    assert.equal(bloki.length, 0, `${path.relative(PUB, f)}: statični blok razreda`);
    assert.deepEqual(tezave(f), [], path.relative(PUB, f));
  }
});

test("podpora.js ima statični blok razreda; stran.js in sim.js ga uvozita pred three.js", () => {
  const podpora = path.join(PUB, "3d", "podpora.js");
  assert.ok([...vozlisca(razcleni(podpora))].some((n) => n.type === "StaticBlock"), "podpora.js brez statičnega bloka ne preveri ničesar");
  assert.equal(staticniGraf(podpora).length, 1, "podpora.js ne uvaža ničesar");
  const stran = beri(path.join(PUB, "3d", "stran.js"));
  assert.match(stran, /if \(id\) await preveriPodporo\(\);/);
  const sim = beri(path.join(PUB, "3d", "sim.js"));
  assert.ok(sim.indexOf("preveriPodporo()") > 0 && sim.indexOf("preveriPodporo()") < sim.indexOf('import("./pregledovalnik.js")'), "sim.js: preverjanje pred pregledovalnikom");
});

test("preveriPodporo: uvoz, ki ne uspe, a se datoteka prenese, pomeni star brskalnik; brez prenosa ostane napaka povezave", async () => {
  const { razlogPodpore } = await import("../public/3d/napake.js");
  const omrezje = new TypeError("Importing a module script failed.");
  assert.equal((await razlogPodpore(omrezje, async () => true)).koda, "brskalnik");
  assert.equal(await razlogPodpore(omrezje, async () => false), omrezje);
  const sintaksa = await razlogPodpore(new SyntaxError("Unexpected token '{'"), async () => false);
  assert.equal(sintaksa.koda, "brskalnik");
  const { tehnicno, napakaBesedilo } = await import("../public/3d/napake.js");
  assert.equal(tehnicno(sintaksa), "SyntaxError: Unexpected token '{'", "tehnična vrstica pove pravi vzrok");
  assert.equal(napakaBesedilo(sintaksa).key, "a3.oldBrowser");
});
