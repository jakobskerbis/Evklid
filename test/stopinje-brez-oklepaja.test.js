// AUDIT-025: »°« se v znanstvenem kalkulatorju veže na število pred njim, močneje kot funkcija brez oklepaja,
// potenca in deljenje, tako kot v grafičnem kalkulatorju. Prej je bil »sin 30°« v radianih (sin 30)·π/180 = −0,0172.
import test from "node:test";
import assert from "node:assert/strict";
import { evaluate } from "../public/graph/scicore.js";
import { buildModel, ZAPIS, toNum } from "../public/graph/model.js";

const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-9, `${msg}: ${a} ≠ ${b}`);
const sci = (t, mode) => evaluate(t, { comma: true, deg: mode === "deg", grad: mode === "grad" });
const graph = (t, deg) => {
  const o = buildModel({ zapis: ZAPIS, settings: { deg }, items: [{ id: "a", type: "expr", text: t }] }, { comma: true }).items[0];
  return toNum(o.value);
};

const CASES = [
  ["sin 30°", 0.5],
  ["cos 60°", 0.5],
  ["tan 45°", 1],
  ["sin 30°+1", 1.5],
  ["2sin 30°", 1],
  ["sin 30°·2", 1],
  ["sin 30° + cos 60°", 1],
  ["sin 2·15°", Math.sin(2) * (15 * Math.PI) / 180], // brez oklepaja argument konča »·« (kot sin x·2)
];

test("funkcija brez oklepaja s stopinjami: enako v radianih, stopinjah in gradih", () => {
  for (const mode of ["rad", "deg", "grad"]) {
    for (const [t, v] of CASES) {
      if (t.startsWith("sin 2·") && mode !== "rad") continue;
      near(sci(t, mode).value, v, `${t} (${mode})`);
    }
  }
});

test("° se veže močneje kot potenca in deljenje (kot v grafičnem kalkulatorju)", () => {
  const d = Math.PI / 180;
  near(sci("30°^2", "rad").value, (30 * d) ** 2, "30°^2");
  near(sci("1/30°", "rad").value, 1 / (30 * d), "1/30°");
  near(sci("√30°", "rad").value, Math.sqrt(30 * d), "√30°");
  near(sci("sin 30′", "deg").value, Math.sin((0.5 * Math.PI) / 180), "sin 30′");
  near(sci("30°15′20″", "deg").value, 30 + 15 / 60 + 20 / 3600, "30°15′20″");
  near(sci("-30°15′", "deg").value, -30.25, "-30°15′");
  for (const t of ["sin 30°", "cos 60°", "2sin 30°", "sin 30°·2", "30°^2", "1/30°", "√30°"]) near(sci(t, "rad").value, graph(t, false), `graf ${t}`);
});

test("zapis ostane berljiv (° pri številu, oklepaj pri funkciji in potenci)", () => {
  assert.equal(sci("sin 30°").tex, "\\sin\\left(30^{\\circ}\\right)");
  assert.equal(sci("30°").tex, "30^{\\circ}");
  assert.equal(sci("1/30°").tex, "\\frac{1}{30^{\\circ}}");
  assert.equal(sci("30°^2").tex, "\\left(30^{\\circ}\\right)^{2}");
  assert.equal(sci("90°-30°").tex, "90^{\\circ}-30^{\\circ}");
  assert.equal(sci("30°15′20″").tex, "30^{\\circ}15^{\\prime}20^{\\prime\\prime}");
});
