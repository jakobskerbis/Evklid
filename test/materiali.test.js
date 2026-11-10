// Materiali laboratorija (public/sim/materiali.js) in slog iger (public/games/slog.js): čiste funkcije,
// povezava slog ↔ <defs>, omejitve iz naloge (brez slik in filtrov, velikost, rahla tekstura, kontrast).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { DEFS, CSS, material, okvirPoti } from "../public/sim/materiali.js";
import { rgb, mesaj, svetlost, zrno, svetIgre } from "../public/games/slog.js";
import { ENGINES } from "../public/games/engines.js";

const beri = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

test("materiali: razredi poskusov dobijo pravi material", () => {
  assert.equal(material("lab-glass"), "steklo");
  assert.equal(material("lab-liq lab-liq-voda"), "tek");
  assert.equal(material("lab-ind-liq x"), "tek");
  assert.equal(material("lab-tit-bench"), "miza");
  assert.equal(material("lab-tit-rod"), "kovina");
  assert.equal(material("lab-box"), "naprava");
  assert.equal(material("lab-wire"), "zica");
  assert.equal(material("lab-sil-ruler"), "les");
  // luža in prazna cev nimata odseva; drugi razredi in ne-laboratorijski elementi ostanejo nedotaknjeni
  assert.equal(material("lab-liq lab-liq-voda lab-puddle"), null);
  assert.equal(material("lab-tit-none"), null);
  assert.equal(material("lab-mark"), null);
  assert.equal(material("tick small"), null);
  assert.equal(material(""), null);
});

test("materiali: okvir poti, ravno dno in telo cevi iz dveh sten", () => {
  // erlenmajerica (lab-kem.js): stoji na podlagi
  const buc = okvirPoti("M94.6,115 V150 L65.2,257 Q65.2,262 70.2,262 H149.8 Q154.8,262 154.8,257 L125.4,150 V115");
  assert.deepEqual([buc.x0, buc.x1, buc.y0, buc.y1], [65.2, 154.8, 115, 262]);
  assert.equal(buc.ravnoDno, true);
  assert.equal(buc.telo, null);
  // epruveta z okroglim dnom: brez sence na mizi
  const epr = okvirPoti("M89,60 V192 Q89,203 100,203 Q111,203 111,192 V60");
  assert.equal(epr.ravnoDno, false);
  // bireta: dve steni → mnogokotnik med njima (leva navzdol, desna nazaj gor)
  const bir = okvirPoti("M96,20 V300 M104,20 V300");
  assert.equal(bir.telo, "96 20 96 300 104 300 104 20");
  assert.equal(bir.ravnoDno, false);
  // relativni ukazi
  const rel = okvirPoti("M10,10 v20 h30 l4,-3");
  assert.deepEqual([rel.x0, rel.x1, rel.y0, rel.y1], [10, 44, 10, 30]);
  assert.equal(okvirPoti(""), null);
});

test("materiali: vsak preliv iz sloga obstaja v <defs>; brez slik in filtrov", () => {
  const idji = new Set([...DEFS.matchAll(/id="(mat-[a-z-]+)"/g)].map((m) => m[1]));
  const raba = [...CSS.matchAll(/url\(#(mat-[a-z-]+)\)/g)].map((m) => m[1]);
  assert.ok(raba.length >= 8);
  for (const id of raba) assert.ok(idji.has(id), `slog uporablja #${id}, ki ga ni v <defs>`);
  assert.equal(idji.size, [...DEFS.matchAll(/id="/g)].length, "podvojen id v <defs>");
  assert.doesNotMatch(DEFS + CSS, /<image|<filter|data:image|\.png|\.jpg|\.webp|filter:/, "samo prelivi in vzorci iz kode");
  // vsaka url(#…) ima nadomestno barvo, če preliva (še) ni
  for (const m of CSS.matchAll(/url\(#mat-[a-z-]+\)([^;}]*)/g)) assert.ok(m[1].trim().length > 0, `brez nadomestne barve: ${m[0]}`);
  // temni način ima svoje robove in ploščo
  assert.match(CSS, /\.dark\{[^}]*--mat-st-rob[^}]*--mat-miza-1/);
});

// WCAG kontrast
const lum = (c) => {
  const [r, g, b] = rgb(c).map((v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const kontrast = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

test("materiali: napisi na ozadju risbe ostanejo berljivi (AA), svetlo in temno", () => {
  const css = beri("public/style.css");
  const blok = (re) => css.match(re)[1];
  const v = (b, ime) => b.match(new RegExp(`${ime}:\\s*(#[0-9a-fA-F]{3,8})`))[1];
  assert.match(CSS, /--mat-ozadje:color-mix\(in srgb,var\(--accent\) 8%,var\(--surface-2\)\)/);
  assert.match(CSS, /color-mix\(in srgb,var\(--text\) 3%,var\(--mat-ozadje\)\)/);
  assert.match(CSS, /color-mix\(in srgb,var\(--danger\) 78%,var\(--text\)\)/);
  for (const b of [blok(/:root \{([^}]+)\}/), blok(/:root\.dark \{([^}]+)\}/)]) {
    // ozadje risbe: --mat-ozadje = 8 % poudarka v --surface-2; najtemnejši rob še 3 % barve besedila
    const ozadje = mesaj(v(b, "--surface-2"), v(b, "--accent"), 0.08), rob = mesaj(ozadje, v(b, "--text"), 0.03);
    for (const o of [ozadje, rob]) {
      assert.ok(kontrast(v(b, "--muted"), o) >= 4.5, `drugotno besedilo na ${o}: ${kontrast(v(b, "--muted"), o).toFixed(2)}`);
      assert.ok(kontrast(v(b, "--text"), o) >= 7, `besedilo na ${o}`);
      // opozorila (»brez zaščitnih očal«): rdeča, primešana barvi besedila
      const opozorilo = mesaj(v(b, "--danger"), v(b, "--text"), 0.22);
      assert.ok(kontrast(opozorilo, o) >= 4.5, `opozorilo na ${o}: ${kontrast(opozorilo, o).toFixed(2)}`);
    }
  }
});

test("slog iger: barve", () => {
  assert.deepEqual(rgb("#fff"), [255, 255, 255]);
  assert.deepEqual(rgb("#1e1b4b"), [30, 27, 75]);
  assert.deepEqual(rgb("rgba(10, 20, 30, 0.5)"), [10, 20, 30]);
  assert.equal(mesaj("#000000", "#ffffff", 0.5), "#808080");
  assert.ok(svetlost("#0b1026") < 0.1 && svetlost("#fffbeb") > 0.9);
});

test("slog iger: tekstura sveta je rahla in določena za vsako igro", () => {
  let s = 7;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (const svet of ["vesolje", "narava", "voda", "platno"]) {
    const d = zrno(svet, 64, rnd);
    assert.equal(d.length, 64 * 64 * 4);
    let vsota = 0, max = 0;
    for (let i = 3; i < d.length; i += 4) (vsota += d[i]), (max = Math.max(max, d[i]));
    const povp = vsota / (64 * 64);
    assert.ok(povp > 2 && povp < 16, `${svet}: povprečna prekrivnost ${povp.toFixed(1)}/255`);
    assert.ok(max <= (svet === "vesolje" ? 120 : 45), `${svet}: največ ${max}`);
  }
  const sveti = new Set(["vesolje", "narava", "voda", "platno"]);
  for (const e of ENGINES) assert.ok(sveti.has(svetIgre(e)), e.id);
  assert.equal(svetIgre({ id: "meteor" }), "vesolje");
  assert.equal(svetIgre({ id: "nekaj-novega" }), "platno");
  assert.equal(svetIgre({ id: "meteor", svet: "voda" }), "voda");
});

test("teksture: skupaj največ 30 KB nove kode", () => {
  const velikost = ["public/sim/materiali.js", "public/games/slog.js"].reduce((n, p) => n + fs.statSync(new URL(`../${p}`, import.meta.url)).size, 0);
  assert.ok(velikost <= 29.5 * 1024, `${velikost} B`);
});
