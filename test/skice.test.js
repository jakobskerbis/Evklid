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

test("stožnice: r₁ + r₂ = 2a, |r₁ − r₂| = 2a, d(T, G) = d(T, v) za vsak položaj T", async () => {
  const { elipsa, hiperbola, parabola, kroznica } = await import("../public/skice/stoznice.js");
  for (let a = 1; a <= 5.5; a += 0.5)
    for (let b = 0.5; b <= a; b += 0.5)
      for (let t = -Math.PI; t <= Math.PI; t += 0.3) {
        const q = elipsa(a, b, t);
        assert.ok(Math.abs(q.r1 + q.r2 - 2 * a) < 1e-9);
        assert.ok(Math.abs(q.T[0] ** 2 / a ** 2 + q.T[1] ** 2 / b ** 2 - 1) < 1e-9);
      }
  for (let a = 0.5; a <= 3.5; a += 0.5)
    for (let b = 0.5; b <= 3.5; b += 0.5)
      for (let t = -2.2; t <= 2.2; t += 0.4) // (skica omeji t še na okvir)
        for (const v of [1, -1]) {
          const q = hiperbola(a, b, t, v);
          assert.ok(Math.abs(Math.abs(q.r1 - q.r2) - 2 * a) < 1e-9);
          assert.ok(Math.abs(q.T[0] ** 2 / a ** 2 - q.T[1] ** 2 / b ** 2 - 1) < 1e-9);
        }
  for (let p = 0.5; p <= 4; p += 0.5)
    for (let y = -4.3; y <= 4.3; y += 0.7) {
      const q = parabola(p, y);
      assert.ok(Math.abs(q.dG - q.dV) < 1e-9);
      assert.ok(Math.abs(q.T[1] ** 2 - 2 * p * q.T[0]) < 1e-9);
    }
  assert.equal(kroznica(1, -2, 3).enacba, "(x − 1)² + (y + 2)² = 9");
  assert.equal(kroznica(0, 0.5, 2.5).enacba, "x² + (y − 0,5)² = 6,25");
});

test("hiperbola: točka T ostane v okvirju za vse a in b", async () => {
  const { tMeja } = await import("../public/skice/hiperbola.js");
  for (let a = 0.5; a <= 3.5; a += 0.5)
    for (let b = 0.5; b <= 3.5; b += 0.5) {
      const m = tMeja(a, b);
      assert.ok(a * Math.cosh(m) <= 5.8 + 1e-9 && b * Math.sinh(m) <= 4.3 + 1e-9);
    }
});

test("sinusni izrek: a/sin α = b/sin β = c/sin γ = 2R za vsak položaj C", async () => {
  const { sinusni, kotC, KOT_A, KOT_B, ODMIK } = await import("../public/skice/sinusni.js");
  for (let t = 0; t < 360; t += 0.5) {
    const q = sinusni(t);
    for (const r of [q.ra, q.rb, q.rc]) assert.ok(Math.abs(r - q.dveR) < 1e-9, `t = ${t}`);
    assert.ok(Math.abs(q.alfa + q.beta + q.gama - 180) < 1e-9);
    const v = kotC(t);
    assert.ok(Math.abs(v - KOT_A) >= ODMIK - 1e-9 && Math.abs(v - KOT_B) >= ODMIK - 1e-9);
  }
});

test("pravokotni trikotnik: Pitagorov, višinski in Evklidov izrek za vsak položaj C", async () => {
  const { pravokotni, C_HIP, omejiA1 } = await import("../public/skice/pitagora.js");
  for (let a1 = 0; a1 <= C_HIP; a1 += 0.25) {
    const q = pravokotni(a1);
    assert.equal(q.a1, omejiA1(a1));
    assert.ok(Math.abs(q.a1 + q.b1 - C_HIP) < 1e-12);
    // Narisana odseka: a₁ = NB, b₁ = AN.
    assert.ok(Math.abs(q.B[0] - q.N[0] - q.a1) < 1e-9 && Math.abs(q.N[0] - q.A[0] - q.b1) < 1e-9);
    // Čipi z »=«: a², b², v_c² so natančni na dve decimalki.
    for (const v of [q.a ** 2, q.b ** 2, q.vc ** 2]) assert.ok(Math.abs(v - Number(v.toFixed(2))) < 1e-9);
    assert.ok(Math.abs(q.a ** 2 + q.b ** 2 - C_HIP ** 2) < 1e-9);
    assert.ok(Math.abs(q.vc ** 2 - q.a1 * q.b1) < 1e-9);
    assert.ok(Math.abs(q.a ** 2 - C_HIP * q.a1) < 1e-9 && Math.abs(q.b ** 2 - C_HIP * q.b1) < 1e-9);
    // Pravi kot pri C: (A − C)·(B − C) = 0.
    assert.ok(Math.abs((q.A[0] - q.C[0]) * (q.B[0] - q.C[0]) + (q.A[1] - q.C[1]) * (q.B[1] - q.C[1])) < 1e-9);
  }
});

test("trikotnik: R, r, Heronova formula, višina in koti za oglišča na mreži", async () => {
  const { trikotnik } = await import("../public/skice/geometrija.js");
  const { kosinusni } = await import("../public/skice/kosinusni.js");
  const razd = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
  const doPremice = (X, P, Q) => Math.abs((Q[0] - P[0]) * (X[1] - P[1]) - (Q[1] - P[1]) * (X[0] - P[0])) / razd(P, Q);
  let n = 0;
  for (let bx = 2; bx <= 9.5; bx += 1.5)
    for (let cx = 0.5; cx <= 9.5; cx += 1.5)
      for (let cy = 1.5; cy <= 7.5; cy += 1.5) {
        const A = [1, 1], B = [bx, 1], C = [cx, cy];
        const q = trikotnik(A, B, C);
        if (q.izrojen) continue;
        n++;
        for (const V of [A, B, C]) assert.ok(Math.abs(razd(q.O, V) - q.R) < 1e-9);
        for (const [P, Q] of [[A, B], [B, C], [C, A]]) assert.ok(Math.abs(doPremice(q.I, P, Q) - q.r) < 1e-9);
        assert.ok(Math.abs(Math.sqrt(q.s * (q.s - q.a) * (q.s - q.b) * (q.s - q.c)) - q.S) < 1e-9);
        assert.ok(Math.abs((q.c * q.vc) / 2 - q.S) < 1e-9);
        assert.ok(Math.abs(q.alfa + q.beta + q.gama - 180) < 1e-9);
        assert.ok(Math.abs(q.R - (q.a * q.b * q.c) / (4 * q.S)) < 1e-9 && Math.abs(q.r - q.S / q.s) < 1e-12);
        const k = kosinusni(A, B, C);
        assert.ok(Math.abs(k.c2 - k.desno) < 1e-9);
      }
  assert.ok(n > 100);
  assert.ok(trikotnik([0, 0], [2, 2], [4, 4]).izrojen);
});

test("pravilni n-kotnik, enakostranični trikotnik in krožni izsek", async () => {
  const { nKotnik, enakostranicni, izsek } = await import("../public/skice/geometrija.js");
  const { N_MIN, N_MAX } = await import("../public/skice/nkotnik.js");
  for (let n = N_MIN; n <= N_MAX; n++) {
    const q = nKotnik(n);
    let d = 0;
    for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1)) d++;
    assert.equal(q.d, d);
    assert.equal(q.vsota, (n - 2) * 180);
    assert.ok(Math.abs(q.S - (n * q.a * q.r) / 2) < 1e-12);
    assert.ok(Math.abs((q.a / 2) ** 2 + q.r ** 2 - 1) < 1e-12);
    // Stranica je razdalja sosednjih oglišč na enotski krožnici.
    assert.ok(Math.abs(q.a - Math.hypot(Math.cos((2 * Math.PI) / n) - 1, Math.sin((2 * Math.PI) / n))) < 1e-12);
  }
  assert.ok(Math.abs(nKotnik(6).a - 1) < 1e-12 && Math.abs(nKotnik(4).S - 2) < 1e-12);
  for (let a = 3; a <= 7; a += 0.5) {
    const q = enakostranicni(a);
    assert.ok(Math.abs(q.R + q.r - q.v) < 1e-12 && Math.abs(q.R - 2 * q.r) < 1e-12);
    assert.ok(Math.abs(q.S - (a * q.v) / 2) < 1e-12);
  }
  const k = izsek(2, 360);
  assert.ok(Math.abs(k.l - 4 * Math.PI) < 1e-12 && Math.abs(k.S - 4 * Math.PI) < 1e-12);
  assert.ok(Math.abs(izsek(3, 90).S - (izsek(3, 90).l * 3) / 2) < 1e-12);
});

test("štirikotniki: obseg in ploščina se ujemata z oglišči, lik je v okvirju pri vseh mejah drsnikov", async () => {
  const { stirikotnik } = await import("../public/skice/geometrija.js");
  const { LIKI } = await import("../public/skice/liki.js");
  const razd = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
  for (const [lik, L] of Object.entries(LIKI)) {
    const kljuci = Object.keys(L.mere);
    // Vse kombinacije mej in srednjih vrednosti drsnikov.
    const izbire = kljuci.map((k) => { const [lo, hi] = L.mere[k]; return [lo, (lo + hi) / 2, hi]; });
    const kombinacije = izbire.reduce((acc, xs) => acc.flatMap((c) => xs.map((x) => [...c, x])), [[]]);
    for (const c of kombinacije) {
      const p = Object.fromEntries(kljuci.map((k, i) => [k, c[i]]));
      const q = stirikotnik(lik, p);
      const T = q.T;
      const o = T.reduce((s, P, i) => s + razd(P, T[(i + 1) % 4]), 0);
      const S = Math.abs(T.reduce((s, P, i) => s + P[0] * T[(i + 1) % 4][1] - T[(i + 1) % 4][0] * P[1], 0)) / 2;
      assert.ok(Math.abs(o - q.o) < 1e-9, `${lik} o`);
      assert.ok(Math.abs(S - q.S) < 1e-9, `${lik} S`);
      if (q.Sef !== undefined) assert.ok(Math.abs(q.Sef - q.S) < 1e-9);
      if (lik === "trapez") assert.ok(Math.abs(q.s * p.v - q.S) < 1e-9 && T[3][0] >= 0);
      if (lik === "deltoid") assert.ok(Math.abs((p.e * p.f) / 2 - S) < 1e-9);
      const xs = T.map((t) => t[0]), ys = T.map((t) => t[1]);
      assert.ok(Math.max(...xs) - Math.min(...xs) <= 10 + 1e-9 && Math.max(...ys) - Math.min(...ys) <= 6.5 + 1e-9, `${lik} je prevelik`);
    }
  }
});

test("ime kartice s TeX: vidno besedilo najde skico (»Diagonale n-kotnika«)", () => {
  assert.equal(skicaZa("MAT-OS", "Diagonale n-kotnika"), SKICE["MAT-OS|Diagonale $n$-kotnika"]);
  assert.equal(skicaZa("MAT-OS", "Kvadrat"), SKICE["MAT-OS|Kvadrat"]);
  assert.equal(skicaZa("MAT-OS", "Kvadratni koren"), null);
});

test("zaporedja: a_n in s_n se ujemata s seštevanjem členov, tudi z negativnimi členi", async () => {
  const { zaporedje } = await import("../public/skice/analiza.js");
  for (const [vrsta, ks] of [["aritmeticno", [-2, -0.5, 0, 1.5, 2]], ["geometrijsko", [-2, -0.5, 0.25, 1, 2]]])
    for (const a1 of [-4, -1.5, 2, 4])
      for (const k of ks)
        for (let n = 1; n <= 8; n++) {
          const q = zaporedje(vrsta, a1, k, n);
          let vsota = 0;
          for (let i = 1; i <= n; i++) vsota += q.clen(i);
          assert.ok(Math.abs(q.sn - vsota) < 1e-9, `${vrsta} a1=${a1} k=${k} n=${n}`);
          assert.ok(Math.abs(q.an - q.clen(n)) < 1e-12);
          assert.equal(q.clen(1), a1);
          if (n > 1) assert.ok(Math.abs(vrsta === "aritmeticno" ? q.clen(n) - q.clen(n - 1) - k : q.clen(n) - q.clen(n - 1) * k) < 1e-9);
        }
});

test("limita: za vsak x z 0 < |x − a| < δ je |f(x) − b| < ε, δ je največji", async () => {
  const { f, limita } = await import("../public/skice/analiza.js");
  for (let a = -2.4; a <= 2.4; a += 0.3)
    for (let eps = 0.1; eps <= 1.5; eps += 0.2) {
      const { b, delta } = limita(a, eps);
      for (let t = -0.999; t <= 0.999; t += 0.037) if (t) assert.ok(Math.abs(f(a + t * delta) - b) < eps + 1e-12, `a=${a} ε=${eps}`);
      // Malo širši pas že ne ustreza več.
      const izven = [a - delta * 1.02, a + delta * 1.02].some((x) => Math.abs(f(x) - b) >= eps);
      assert.ok(izven, `δ ni največji pri a=${a} ε=${eps}`);
    }
});

test("odvod in diferencial: Δf/Δx → f′(x₀), ko gre h proti 0; Δf − df = dx²/2", async () => {
  const { odvod, diferencial, brezNic } = await import("../public/skice/analiza.js");
  for (let x0 = -2.5; x0 <= 2.5; x0 += 0.5) {
    let prej = Infinity;
    for (const h of [1, 0.5, 0.1, 0.01, 0.001, -0.001]) {
      const q = odvod(x0, h);
      const nap = Math.abs(q.kvocient - q.k);
      assert.ok(nap <= prej + 1e-12);
      prej = nap;
    }
    assert.ok(prej < 1e-3);
    for (const dx of [-2, -0.3, 0.1, 1.4]) {
      const d = diferencial(x0, dx);
      assert.ok(Math.abs(d.razlika - (dx * dx) / 2) < 1e-12 && Math.abs(d.df - x0 * dx) < 1e-12);
    }
  }
  assert.equal(brezNic(0, 0.1, 0.1), -0.1);
  assert.equal(brezNic(0, -0.1, 0.1), 0.1);
});

test("skice: »≈« je vedno pred nedeljivim presledkom (v ozkem čipu se ne loči od števila)", () => {
  const dir = new URL("../public/skice/", import.meta.url);
  for (const ime of fs.readdirSync(dir).filter((x) => x.endsWith(".js"))) {
    const koda = fs.readFileSync(new URL(ime, dir), "utf8").split("\n").filter((l) => !l.trim().startsWith("//"));
    koda.forEach((l, i) => assert.ok(!/≈ /.test(l.replace(/\/\/.*$/, "")), `${ime}:${i + 1}`));
  }
});

test("integral: pri velikem n se Riemannova vsota in trapezna metoda ujemata z integralom na dve decimalki", async () => {
  const { riemann, trapez, TOCNO, f, F, simpson } = await import("../public/skice/integral.js");
  assert.ok(Math.abs(TOCNO - 82 / 15) < 1e-12);
  for (const x of [0, 0.7, 2, 3.3]) assert.ok(Math.abs((F(x + 1e-6) - F(x - 1e-6)) / 2e-6 - f(x)) < 1e-6, "F′ = f");
  assert.ok(Math.abs(simpson(f, 0, 4) - 82 / 15) < 1e-10);
  // Največji n na drsniku: razlika pod pol stotinke.
  assert.ok(Math.abs(riemann(40).vsota - TOCNO) < 0.005);
  assert.ok(Math.abs(trapez(12).T - TOCNO) < 0.005);
  // Pri majhnem n je napaka vidna (skica ima kaj pokazati).
  assert.ok(Math.abs(trapez(1).T - TOCNO) > 0.3 && Math.abs(riemann(1).vsota - TOCNO) > 0.1);
  // Približka se z večjim n približujeta točni vrednosti; trapez pri n = 1 je (f(0) + f(4))·2.
  assert.ok(Math.abs(riemann(40).vsota - TOCNO) < Math.abs(riemann(4).vsota - TOCNO));
  assert.ok(Math.abs(trapez(12).T - TOCNO) < Math.abs(trapez(2).T - TOCNO));
  assert.ok(Math.abs(trapez(1).T - (f(0) + f(4)) * 2) < 1e-12);
  assert.equal(riemann(5).pr.length, 5);
});

test("ploščina in vrtenina: S = ∫|f − g| dx in V = π∫f² dx se ujemata z znanima vrednostma", async () => {
  const { ploscina, vrtenina, f1, g1 } = await import("../public/skice/integral.js");
  // f₁ − g = 1 + 1,5x − x²/2, nedoločeni integral x + 0,75x² − x³/6.
  const P = (x) => x + 0.75 * x * x - x ** 3 / 6;
  assert.ok(Math.abs(ploscina(0, 3) - 5.25) < 1e-9);
  assert.ok(Math.abs(ploscina(3, 0) - 5.25) < 1e-9, "meji v obratnem vrstnem redu");
  assert.equal(ploscina(2, 2), 0);
  // Čez presečišče x = (3 + √17)/2 se ploščina sešteva po absolutni vrednosti.
  const r = (3 + Math.sqrt(17)) / 2;
  assert.ok(Math.abs(f1(r) - g1(r)) < 1e-12);
  assert.ok(Math.abs(ploscina(0, 4) - (P(r) - P(0) + P(r) - P(4))) < 1e-6);
  assert.ok(Math.abs(vrtenina() - 6.272 * Math.PI) < 1e-9);
});

test("kombinatorika: C(n, r) = C(n, n − r) in Pascalovo pravilo za vse n in r; vsota vseh P_n(k) je 1", async () => {
  const { C, bernoulli } = await import("../public/skice/integral.js");
  const { clen, N_MAX } = await import("../public/skice/pascal.js");
  const fak = (n) => (n < 2 ? 1 : n * fak(n - 1));
  for (let n = 0; n <= N_MAX; n++)
    for (let r = 0; r <= n; r++) {
      assert.equal(C(n, r), fak(n) / (fak(r) * fak(n - r)));
      assert.equal(C(n, r), C(n, n - r));
      if (r > 0 && r < n) assert.equal(C(n - 1, r - 1) + C(n - 1, r), C(n, r));
    }
  assert.equal(C(3, 5), 0);
  assert.equal(C(30, 15), 155117520);
  assert.deepEqual([0, 1, 2, 4, 5].map((k) => clen(5, k)), ["a⁵", "5a⁴b", "10a³b²", "5ab⁴", "b⁵"]);
  assert.equal(clen(0, 0), "1");
  for (let n = 1; n <= 12; n++)
    for (const p of [0.05, 0.3, 0.5, 0.95]) {
      const P = Array.from({ length: n + 1 }, (_, k) => bernoulli(n, p, k));
      assert.ok(Math.abs(P.reduce((a, v) => a + v, 0) - 1) < 1e-12);
      assert.ok(Math.abs(P.reduce((a, v, k) => a + k * v, 0) - n * p) < 1e-12, "E = np");
    }
});

test("povprečje in odklon: σ se računa z delitvijo z N", async () => {
  const { statistika } = await import("../public/skice/integral.js");
  const q = statistika([2, 4, 4, 4, 5, 5, 7, 9]);
  assert.equal(q.x, 5);
  assert.equal(q.sigma, 2); // z delitvijo z N − 1 bi bil ≈ 2,14
  assert.equal(q.var, 4);
  const e = statistika([3, 3, 3]);
  assert.equal(e.sigma, 0);
  const d = statistika([2, 3.5, 5, 6, 8.5]);
  assert.ok(Math.abs(d.x - 5) < 1e-12 && Math.abs(d.var - (9 + 2.25 + 0 + 1 + 12.25) / 5) < 1e-12);
});

test("Bernoulli: zelo majhna verjetnost ni »= 0« (n = 12, p = 0,05, k = 12)", async () => {
  const { bernoulli } = await import("../public/skice/integral.js");
  const { zapisP } = await import("../public/skice/bernoulli.js");
  for (let k = 0; k <= 12; k++)
    for (const p of [0.05, 0.95]) {
      const z = zapisP(bernoulli(12, p, k));
      assert.ok(z !== "0" && !/^≈ 0$/.test(z), `k=${k} p=${p}: ${z}`);
    }
  assert.equal(zapisP(bernoulli(12, 0.05, 12)), "< 0,0001");
  assert.equal(zapisP(0.25), "0,25");
});

test("telesa: ploščina razgrnjene mreže je površina P, prostornine se ujemajo z računom", async () => {
  const { telo, mreza, ploscinaLika } = await import("../public/skice/telesa.js");
  for (const ime of ["kocka", "kvader", "prizma", "valj", "stozec", "piramida", "prisekana"]) {
    const T = telo(ime), M = mreza(T);
    const vsota = M.liki.reduce((a, l) => a + ploscinaLika(l.tocke), 0);
    assert.ok(Math.abs(vsota - T.P) / T.P < 1e-3, `${ime}: mreža ${vsota} ≠ P ${T.P}`);
    assert.equal(M.liki.filter((l) => l.vrsta === "osnova").length, ime === "stozec" || ime === "piramida" ? 1 : 2, ime);
  }
  const K = telo("kocka");
  assert.equal(K.P, 24);
  assert.equal(K.Vol, 8);
  assert.ok(Math.abs(K.D - 2 * Math.sqrt(3)) < 1e-12);
  // Prisekana piramida = velika piramida brez male (višina vrha H iz podobnosti).
  const Q = telo("prisekana"), Hv = (Q.v * Q.a1) / (Q.a1 - Q.a2);
  assert.ok(Math.abs(Q.Vol - (Q.a1 ** 2 * Hv - Q.a2 ** 2 * (Hv - Q.v)) / 3) < 1e-12);
  const S = telo("stozec");
  assert.ok(Math.abs(S.s ** 2 - (S.r ** 2 + S.v ** 2)) < 1e-12);
});

test("telesa: pri vsakem zasuku so pri kocki zakriti 3 robovi, valj in stožec imata 2 tvorilki na obrisu", async () => {
  const { telo, robovi } = await import("../public/skice/telesa.js");
  const K = telo("kocka"), V = telo("valj"), S = telo("stozec"), P = telo("prizma");
  for (let phi = 0.05; phi < 2 * Math.PI; phi += 0.21) {
    const k = robovi(K, phi).robovi;
    assert.equal(k.length, 12);
    assert.equal(k.filter((e) => !e.vidno).length, 3, `kocka φ=${phi}`);
    for (const T of [V, S]) assert.equal(robovi(T, phi).robovi.filter((e) => e.obris).length, 2, `${T.ime} φ=${phi}`);
    // Zgornja osnova prizme je pri pogledu od zgoraj vsa vidna, spodnja na zadnji strani zakrita.
    const p = robovi(P, phi).robovi;
    assert.ok(p.filter((e) => P.V[e.a][1] > 0 && P.V[e.b][1] > 0).every((e) => e.vidno));
    assert.ok(p.some((e) => !e.vidno));
  }
});

test("telesa: prizma ima 5 zakritih robov, deli mreže se ne prekrivajo, P in V v čipih sta kot na kartici", async () => {
  const { telo, robovi, mreza, cipi, verige } = await import("../public/skice/telesa.js");
  const P = telo("prizma");
  for (let phi = 0.05; phi < 2 * Math.PI; phi += 0.21) assert.equal(robovi(P, phi).robovi.filter((e) => !e.vidno).length, 5, `φ=${phi}`);
  // Zakriti lok osnove valja je ena veriga (enakomerno črtkanje).
  const V = telo("valj");
  assert.equal(verige(robovi(V, 0.5).robovi.filter((e) => !e.vidno)).length, 1);
  // Težišče vsakega dela mreže ne leži v nobenem drugem delu.
  const notri = ([x, y], t) => t.reduce((c, p, i) => {
    const q = t[(i + 1) % t.length];
    return (p[1] > y) !== (q[1] > y) && x < ((q[0] - p[0]) * (y - p[1])) / (q[1] - p[1]) + p[0] ? !c : c;
  }, false);
  for (const ime of ["kocka", "kvader", "prizma", "valj", "stozec", "piramida", "prisekana"]) {
    const L = mreza(telo(ime)).liki;
    L.forEach((a, i) => {
      const c = a.tocke.reduce((s, p) => [s[0] + p[0] / a.tocke.length, s[1] + p[1] / a.tocke.length], [0, 0]);
      L.forEach((b, j) => i !== j && assert.ok(!notri(c, b.tocke), `${ime}: del ${i} v delu ${j}`));
    });
  }
  const norm = (t) => t.replace(/\\dfrac/g, "\\frac").replace(/\s+/g, "");
  for (const [list, ss, vrste] of [["MAT-OS", false, { Kocka: "kocka", Kvader: "kvader", Prizma: "prizma", Valj: "valj", Piramida: "piramida", Stožec: "stozec" }], ["MAT-SS", true, { Prizma: "prizma", Piramida: "piramida", "Prisekana piramida": "prisekana", Valj: "valj", Stožec: "stozec" }]]) {
    const md = fs.readFileSync(new URL(`../content/formulas/${list}.md`, import.meta.url), "utf8").split("\n");
    for (const [ime, t] of Object.entries(vrste)) {
      const vrstica = norm(md.find((l) => l.startsWith(`| ${ime} |`)));
      for (const c of cipi(telo(t), ss).filter((c) => /^[PV] =/.test(c.oznaka))) assert.ok(vrstica.includes(norm(c.oznaka)), `${list} ${ime}: ${c.oznaka}`);
    }
  }
});

test("presek stožca: parabola nastane natanko pri τ = 90° − α, pri manjšem nagibu zaprta krivulja, pri večjem dve veji", async () => {
  const { vrsta, nastavitev, krivulja, izsrednost, VISINA } = await import("../public/skice/presek-stozca.js");
  for (let alfa = 15; alfa <= 60; alfa++) {
    const par = nastavitev("Parabola", alfa);
    assert.equal(par.tau, 90 - alfa, "gumb Parabola");
    assert.equal(vrsta(par.tau, alfa, par.h), "parabola");
    assert.ok(Math.abs(izsrednost(par.tau, alfa) - 1) < 1e-12, "e = 1");
    assert.equal(vrsta(par.tau - 1, alfa, 0.6), par.tau - 1 === 0 ? "krožnica" : "elipsa");
    assert.equal(vrsta(par.tau + 1, alfa, 0.6), "hiperbola");
    for (const ime of ["Krožnica", "Elipsa", "Parabola", "Hiperbola"]) assert.equal(vrsta(nastavitev(ime, alfa).tau, alfa, 1), ime.toLowerCase(), `${ime} α=${alfa}`);
    assert.equal(nastavitev("Skozi vrh", alfa).h, 0);
  }
  // Izrojeni primeri (h = 0): točka, premica, par premic.
  assert.equal(vrsta(20, 30, 0), "točka");
  assert.equal(vrsta(60, 30, 0), "premica");
  assert.equal(vrsta(80, 30, 0), "par premic");
  assert.equal(krivulja(20, 30, 0).odseki.length, 0);
  assert.deepEqual(krivulja(20, 30, 0).tocka, [0, 0, 0]);
  assert.equal(krivulja(60, 30, 0).odseki.length, 1);
  assert.equal(krivulja(80, 30, 0).odseki.length, 2);
  // Točke krivulje ležijo na stožcu (x² + z² = y² tan² α) in na ravnini (n·p = h cos τ); elipsa je ena zaprta krivulja.
  const na = (tau, alfa, hh) => (p) => {
    const t = Math.tan((alfa * Math.PI) / 180), r = (tau * Math.PI) / 180;
    assert.ok(Math.abs(p[0] ** 2 + p[2] ** 2 - p[1] ** 2 * t * t) < 1e-9);
    assert.ok(Math.abs(p[1] * Math.cos(r) + p[2] * Math.sin(r) - hh * Math.cos(r)) < 1e-9);
    assert.ok(Math.abs(p[1]) <= VISINA + 1e-9);
  };
  const el = krivulja(30, 30, 0.6);
  assert.equal(el.odseki.length, 1);
  const o = el.odseki[0];
  assert.ok(Math.hypot(...o[0].map((x, k) => x - o[o.length - 1][k])) < 1e-9, "zaprta");
  o.forEach(na(30, 30, 0.6));
  const hip = krivulja(75, 30, 0.6);
  assert.equal(hip.odseki.length, 2, "dve veji");
  assert.ok(hip.odseki.some((s) => s.every((p) => p[1] > 0)) && hip.odseki.some((s) => s.every((p) => p[1] < 0)), "veji na obeh plaščih");
  hip.odseki.flat().forEach(na(75, 30, 0.6));
  const pa = krivulja(60, 30, 0.6);
  assert.equal(pa.odseki.length, 1);
  pa.odseki[0].forEach(na(60, 30, 0.6));
  assert.ok(pa.odseki[0].every((p) => p[1] > 0), "parabola na enem plašču");
  const kr = krivulja(0, 30, 0.6);
  assert.equal(kr.odseki.length, 1);
  kr.odseki[0].forEach((p) => assert.ok(Math.abs(p[1] - 0.6) < 1e-12));
});
