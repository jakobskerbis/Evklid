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
  for (const A of [0.5, 2, 3])
    for (const w of [0.5, 1, 2, 3])
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
