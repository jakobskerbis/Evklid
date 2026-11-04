// Interaktivne skice v karticah formul (public/skice/): računi v skici se ujemajo s formulami kartice.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { SKICE, skicaZa } from "../public/skice/index.js";
import { racunaj, C_HIP, ALFA_MIN, ALFA_MAX } from "../public/skice/pravokotni-trikotnik.js";

test("vsaka skica ima kartico z enakim imenom na svojem listu", () => {
  for (const key of Object.keys(SKICE)) {
    const [list, ime] = key.split("|");
    const md = fs.readFileSync(new URL(`../content/formulas/${list}.md`, import.meta.url), "utf8");
    assert.ok(md.split("\n").some((l) => l.startsWith(`| ${ime} |`)), `${key}: kartice ni`);
    assert.equal(skicaZa(list, ` ${ime} `), SKICE[key]);
  }
});

test("pravokotni trikotnik: c = 5, Pitagora in kotne funkcije za vsak položaj B", () => {
  for (let al = ALFA_MIN; al <= ALFA_MAX; al += 0.5) {
    const q = racunaj(al);
    assert.equal(q.c, C_HIP);
    assert.ok(Math.abs(q.a ** 2 + q.b ** 2 - 25) < 1e-9);
    assert.ok(Math.abs(q.sin ** 2 + q.cos ** 2 - 1) < 1e-12);
    assert.ok(Math.abs(q.tan - q.sin / q.cos) < 1e-9);
    assert.ok(Math.abs(q.tan * q.cot - 1) < 1e-9);
    assert.ok(Math.abs(q.sin - Math.sin((al * Math.PI) / 180)) < 1e-12);
  }
  // B ne zdrsne iz loka: kot ostane med mejama.
  assert.equal(racunaj(0).alfa, ALFA_MIN);
  assert.equal(racunaj(120).alfa, ALFA_MAX);
  assert.ok(Math.abs(racunaj(36.87).a - 3) < 0.001 && Math.abs(racunaj(36.87).b - 4) < 0.001);
});

test("skice v testu se naložijo brez brskalnika (samo računi)", async () => {
  for (const nalozi of Object.values(SKICE)) assert.equal(typeof (await nalozi()).default, "function");
});

test("intervali: krajišča in zapis po vrsti intervala", async () => {
  const { interval, uredi, VRSTE, MIN, MAX } = await import("../public/skice/intervali.js");
  for (const v of VRSTE) {
    const I = interval(v, -1, 2.5);
    assert.equal(I.vsebuje(-1), v[0] === "[");
    assert.equal(I.vsebuje(2.5), v.endsWith("]"));
    assert.ok(I.vsebuje(0) && !I.vsebuje(-1.01) && !I.vsebuje(3));
  }
  assert.equal(interval("[a, b)", -1, 2.5).zapis, "[−1; 2,5)");
  assert.equal(interval("(a, b]", -3, 2).zapis, "(−3, 2]");
  assert.equal(interval("[a, b)", -1, 2.5).neenacba, "−1 ≤ x < 2,5");
  // a < b ostane tudi na robu premice.
  assert.deepEqual(uredi(3, 2, "a"), [3, 3.5]);
  assert.deepEqual(uredi(MAX, MAX, "a"), [MAX - 0.5, MAX]);
  assert.deepEqual(uredi(MIN, MIN, "b"), [MIN, MIN + 0.5]);
});

test("kompleksna števila: z·z̄ = |z|², z̄ je zrcalna slika", async () => {
  const { kompleksno, zapisZ } = await import("../public/skice/kompleksna.js");
  for (let a = -4; a <= 4; a += 0.5)
    for (let b = -4; b <= 4; b += 0.5) {
      const q = kompleksno(a, b);
      assert.deepEqual(q.konj, [a, -b]);
      assert.ok(Math.abs(q.zKonj - q.abs ** 2) < 1e-9);
    }
  assert.equal(kompleksno(3, 4).abs, 5);
  assert.equal(zapisZ(2, -1.5), "2 − 1,5i");
});

test("množice: vsaka operacija se ujema z definicijo na končnih množicah", async () => {
  const { OPERACIJE } = await import("../public/skice/mnozice.js");
  const U = [1, 2, 3, 4, 5, 6, 7, 8], A = new Set([1, 2, 3, 4]), B = new Set([3, 4, 5, 6]);
  const prava = {
    "A∪B": U.filter((x) => A.has(x) || B.has(x)),
    "A∩B": U.filter((x) => A.has(x) && B.has(x)),
    "A−B": U.filter((x) => A.has(x) && !B.has(x)),
    "A′": U.filter((x) => !A.has(x)),
  };
  for (const [ime, op] of Object.entries(OPERACIJE)) assert.deepEqual(U.filter((x) => op.je(A.has(x), B.has(x))), prava[ime], ime);
});

test("moč množice: m(A∪B) = m(A) + m(B) − m(A∩B) za vse izbire", async () => {
  const { moc, mreza, NAJVEC } = await import("../public/skice/moc-mnozice.js");
  for (let a = 0; a <= NAJVEC; a++)
    for (let b = 0; b <= NAJVEC; b++)
      for (let k = 0; k <= NAJVEC; k++) {
        const q = moc(a, b, k);
        assert.ok(q.mAB <= Math.min(a, b) && q.samoA >= 0 && q.samoB >= 0);
        assert.equal(q.unija, q.samoA + q.samoB + q.mAB);
        assert.equal(q.unija, a + b - q.mAB);
      }
  assert.equal(moc(8, 6, 3).unija, 11);
  assert.equal(mreza(7, 0, 0).length, 7);
});

test("osnovne zveze: sin² + cos² = 1, tan = sin/cos, kot v radianih", async () => {
  const { zveze } = await import("../public/skice/zveze.js");
  for (let d = -360; d <= 720; d += 1) {
    const q = zveze(d);
    assert.ok(q.stopinj >= 0 && q.stopinj < 360);
    assert.ok(Math.abs(q.sin ** 2 + q.cos ** 2 - 1) < 1e-12);
    if (q.stopinj % 180 === 90) assert.equal(q.tan, null);
    else assert.ok(Math.abs(q.tan - q.sin / q.cos) < 1e-9);
  }
  assert.equal(zveze(60).radPi, "π/3");
  assert.equal(zveze(-90).radPi, "3π/2");
  assert.equal(zveze(50).radPi, null);
});

test("periodičnost: vrednost se ponovi v x₀ + kT, točka ne pade na asimptoto", async () => {
  const { PARI, ponovitve, omejiX, OD, DO } = await import("../public/skice/periodicnost.js");
  for (const par of Object.keys(PARI))
    for (let x = OD + 0.1; x < DO; x += 0.37) {
      const x0 = omejiX(par, x);
      const xs = ponovitve(par, x0);
      assert.ok(xs.length >= (par === "tan" ? 4 : 2) && xs.includes(x0));
      for (const xi of xs) {
        assert.ok(xi >= OD - 1e-9 && xi <= DO + 1e-9);
        assert.ok(Math.abs(PARI[par].f(xi) - PARI[par].f(x0)) < 1e-6 * Math.max(1, Math.abs(PARI[par].f(x0))));
        assert.ok(Math.abs(PARI[par].g(xi) - PARI[par].g(x0)) < 1e-6 * Math.max(1, Math.abs(PARI[par].g(x0))));
      }
      if (par === "tan") assert.ok(Math.abs(PARI.tan.f(x0)) < 2.5, "točka ostane v okvirju");
    }
});

test("sinusna krivulja: T = 2π/ω, ničle so ničle, vrh je A", async () => {
  const { sinusna } = await import("../public/skice/sinusna.js");
  const korak = [0.5, 1, 1.5, 2, 2.5, 3]; // vse izbire drsnikov A in ω
  for (const A of korak)
    for (const w of korak)
      for (let fi = -Math.PI; fi <= Math.PI + 1e-9; fi += Math.PI / 12) {
        const q = sinusna(A, w, fi);
        assert.ok(Math.abs(q.T - (2 * Math.PI) / w) < 1e-12);
        assert.ok(q.nicle.length >= 1);
        for (const x of q.nicle) assert.ok(Math.abs(q.f(x)) < 1e-9);
        assert.ok(Math.abs(q.f(q.vrh) - A) < 1e-9);
        assert.ok(Math.abs(q.f(1.3 + q.T) - q.f(1.3)) < 1e-9);
      }
});

test("krožne funkcije: inverzna vrne kot na zoženem območju; zrcalna točka leži na inverzni", async () => {
  const { KROZNE } = await import("../public/skice/krozne.js");
  for (const [ime, K] of Object.entries(KROZNE))
    for (let t = K.od; t <= K.do; t += (K.do - K.od) / 50) {
      assert.ok(Math.abs(K.inv(K.f(t)) - t) < 1e-9, `${ime} ${t}`);
    }
  assert.ok(Math.abs(KROZNE.arccot.inv(-1) - (3 * Math.PI) / 4) < 1e-12); // arccot v (0, π)
  assert.equal(KROZNE.arccos.Z, "[0, \\pi]");
});

test("π v skicah: piZapis", async () => {
  const { piZapis } = await import("../public/skice/skica.js");
  assert.equal(piZapis(Math.PI / 4), "π/4");
  assert.equal(piZapis(-Math.PI), "−π");
  assert.equal(piZapis(2 * Math.PI), "2π");
  assert.equal(piZapis(0), "0");
  assert.equal(piZapis(1), null);
});

test("vektorja: skalarni produkt, kot, vsota in razlika", async () => {
  const { vektorja } = await import("../public/skice/vektorja.js");
  for (let a1 = -4; a1 <= 4; a1 += 1.5)
    for (let a2 = -4; a2 <= 4; a2 += 1.5)
      for (const b of [[1, 2.5], [-3, 0.5], [0, -4]]) {
        const q = vektorja([a1, a2], b);
        assert.ok(Math.abs(q.skalarni - q.la * q.lb * Math.cos((q.fi * Math.PI) / 180)) < 1e-9);
        assert.deepEqual(q.vsota, [a1 + b[0], a2 + b[1]]);
        // |a + b|² + |a − b|² = 2(|a|² + |b|²) (paralelogramsko pravilo)
        assert.ok(Math.abs(Math.hypot(...q.vsota) ** 2 + Math.hypot(...q.razlika) ** 2 - 2 * (q.la ** 2 + q.lb ** 2)) < 1e-9);
      }
  assert.equal(vektorja([1, 0], [0, 1]).fi, 90);
  assert.equal(vektorja([0, 0], [1, 1]).fi, null);
});

test("linearna funkcija: k = tan α, ničla x₀ = −n/k", async () => {
  const { linearna } = await import("../public/skice/linearna.js");
  for (let k = -3; k <= 3; k += 0.25)
    for (let n = -3; n <= 3; n += 0.5) {
      const q = linearna(k, n);
      assert.ok(q.alfa >= 0 && q.alfa < 180);
      assert.ok(Math.abs(Math.tan((q.alfa * Math.PI) / 180) - k) < 1e-9);
      if (k) assert.ok(Math.abs(q.f(q.x0)) < 1e-9);
      else assert.equal(q.x0, null);
    }
  assert.equal(linearna(0, 0).vsakX, true);
});

test("točke: razdalja, razpolovišče, ploščina in orientacija", async () => {
  const { tocke } = await import("../public/skice/tocke.js");
  const q = tocke([0, 0], [3, 4], [0, 2]);
  assert.equal(q.d, 5);
  assert.deepEqual(q.S, [1.5, 2]);
  assert.equal(q.ploscina, 3);
  assert.equal(q.orientacija, 1); // A → B → C v nasprotni smeri urinega kazalca
  assert.equal(tocke([0, 0], [0, 2], [3, 4]).orientacija, -1);
  assert.equal(tocke([0, 0], [1, 1], [2, 2]).orientacija, 0);
});

test("kvadratna funkcija: temenska in splošna oblika se ujemata, ničli sta ničli", async () => {
  const { kvadratna, brezNic } = await import("../public/skice/kvadratna.js");
  for (const a of [-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2])
    for (let p = -3; p <= 3; p += 0.5)
      for (let q = -3; q <= 3; q += 0.5) {
        const k = kvadratna(a, p, q);
        for (const x of [-2, 0, 1.3]) assert.ok(Math.abs(k.f(x) - (a * x * x + k.b * x + k.c)) < 1e-9);
        assert.ok(Math.abs(k.D - -4 * a * q) < 1e-9);
        assert.equal(k.nicle.length, k.D > 0 ? 2 : k.D === 0 ? 1 : 0);
        for (const x of k.nicle) assert.ok(Math.abs(k.f(x)) < 1e-9);
      }
  assert.equal(brezNic(0, 0.5), -0.5);
  assert.equal(brezNic(0, -0.5), 0.5);
});

test("potenčna funkcija: sodost, lihost in zaloga vrednosti po vrsti eksponenta", async () => {
  const { VRSTE, potenca } = await import("../public/skice/potencna.js");
  for (const [vrsta, V] of Object.entries(VRSTE))
    for (const n of V.n) {
      const f = potenca(n);
      for (const x of [0.5, 1.3, 2]) {
        assert.ok(Math.abs(f(-x) - (V.parnost === "soda" ? f(x) : -f(x))) < 1e-9, vrsta);
        if (V.Z === "(0, \\infty)" || V.Z === "[0, \\infty)") assert.ok(f(-x) > 0);
      }
      // Korenska funkcija je inverzna k prvemu primeru (x² ↔ √x, x³ ↔ ∛x).
      if (V.koren && n === V.n[0]) for (const x of [0.25, 1.7]) assert.ok(Math.abs(V.koren.f(f(x)) - x) < 1e-9);
    }
});

test("eksponentna in logaritemska: zrcalni čez y = x, a = 1 se preskoči", async () => {
  const { exp, log, brezEna } = await import("../public/skice/eksponentna.js");
  for (let a = 0.2; a <= 4; a += 0.1) {
    if (Math.abs(a - 1) < 1e-9) continue;
    for (const x of [-2, -0.5, 0, 1, 2.5]) assert.ok(Math.abs(log(a)(exp(a)(x)) - x) < 1e-9);
    assert.equal(exp(a)(0), 1);
    assert.ok(Math.abs(log(a)(1)) < 1e-12);
  }
  assert.equal(brezEna(1, 0.9), 1.1);
  assert.equal(brezEna(1, 1.1), 0.9);
});

test("eksponentna in logaritemska pri a blizu 1: graf nima navpičnih skokov čez okvir", async () => {
  const { exp, log } = await import("../public/skice/eksponentna.js");
  const { fnPath } = await import("../public/sim/kit.js");
  // Ista preslikava kot v skici (okvir 274 × 274 px za [−3, 5] × [−3, 5]).
  const A = { x0: -3, x1: 5, y0: -3, y1: 5, X: (x) => 8 + ((x + 3) / 8) * 274, Y: (y) => 282 - ((y + 3) / 8) * 274 };
  for (const a of [0.2, 0.9, 1.1, 4])
    for (const [f, od] of [[exp(a), -3], [log(a), 0.0005]]) {
      const d = fnPath(f, A, { from: od, to: 5, n: 600 });
      const tocke = [...d.matchAll(/([ML])(-?[\d.]+),(-?[\d.]+)/g)].map((m) => [m[1], Number(m[3])]);
      for (let i = 1; i < tocke.length; i++) if (tocke[i][0] === "L") assert.ok(Math.abs(tocke[i][1] - tocke[i - 1][1]) < 274, `a = ${a}`);
    }
});
