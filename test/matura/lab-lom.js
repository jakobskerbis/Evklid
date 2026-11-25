// Maturitetni poskus lab-lom (public/sim/matura/lab-lom.js), uvožen v test/laboratorij-matura.test.js:
// meritve iz dnevnika in tabele, neznana snov X iz semena, toleranca iz simulacije skrbnega dijaka in igra v brskalniku (igra).
import test from "node:test";
import assert from "node:assert/strict";
import { MATURA } from "../../public/sim/lab-matura-naloge.js";
import { LomBench, SNOVI, NX, naklon } from "../../public/sim/lab-model-optika.js";

const RAD = Math.PI / 180;
const NB = " ";
const PLOSKEV = "Kote si meril od ploskve. Vpadni, odbojni in lomni kot merimo od vpadne pravokotnice, sicer Snellov zakon ne velja.";
const MIMO = `Laser je 1,5${NB}mm mimo središča: žarek ne zadene sredine ravne ploskve, zato se lomi še na okrogli ploskvi in odčitek je napačen. Zamik nastavi na 0.`;
const LASER = "Laser je vklopljen. Nikoli ne glej v žarek in ga ne usmeri v oči sošolcev, tudi ne prek zrcala.";
const z = (x, d) => x.toFixed(d).replace(".", ",");
const N_X = 1.553;
// Vrstica tabele kot v lab-optika.js → labLom → record (kot z enoto: »30 °« z nedeljivim presledkom).
const vr = (a, snov = "zrak → snov X") => {
  const b = Math.asin(Math.sin(a * RAD) / N_X) / RAD;
  return { "snov, smer": snov, "α": `${a}${NB}°`, odbojni: `${z(a, 1)}${NB}°`, "β": `${z(Math.round(b * 2) / 2, 1)}${NB}°`, "sin α": z(Math.sin(a * RAD), 3), "sin β": z(Math.sin(b * RAD), 3) };
};
// Kot od ploskve (90° − kot): pri prehodu iz zraka v snov je potem β > α.
const odPloskve = (a) => ({ ...vr(a), "α": `${90 - a}${NB}°`, "β": `${z(90 - Math.asin(Math.sin(a * RAD) / N_X) / RAD, 1)}${NB}°` });

test("refraction matura: measurement criteria read the log and the table", () => {
  const t = MATURA["lab-lom"];
  const ok = (dn, vrstice) => t.meritve.map((m) => m.ok({ dnevnik: dn, vrstice }));
  const vse = [10, 20, 30, 40, 50, 60, 70, 80].map((a) => vr(a));
  assert.deepEqual(ok([LASER], vse), [true, true, true, true]);
  assert.deepEqual(ok([LASER], vse.slice(0, 5)), [false, false, true, true], "5 kotov do 50°");
  assert.deepEqual(ok([LASER], [30, 40, 50, 60, 70, 80].map((a) => vr(a))).slice(0, 2), [true, false], "najmanjši kot 30°");
  assert.deepEqual(ok([LASER, PLOSKEV], vse), [true, true, false, true]);
  assert.deepEqual(ok([LASER, MIMO], vse), [true, true, true, false]);
  // Vrstice, merjene od ploskve, vrstice iz snovi X v zrak in meritve akrila ne štejejo za lom iz zraka v snov X.
  assert.deepEqual(ok([LASER], [10, 20, 30, 40, 50, 60, 70, 80].map(odPloskve)), [false, false, false, false]);
  assert.deepEqual(ok([LASER], [10, 20, 30].map((a) => vr(a, "snov X → zrak"))), [false, false, false, false]);
  assert.deepEqual(ok([LASER], [10, 20, 30, 40, 50, 60, 70, 80].map((a) => vr(a, "zrak → akril"))), [false, false, false, false]);
  assert.deepEqual(ok([], []), [false, false, false, false]);
});

// Neznana snov X: n iz semena (1,42–1,62, na 4 decimalke), isti za isto seme, pri različnih semenih različen; prava vrednost
// naloge je B.nX, ne lomni količnik akrila.
test("refraction matura: the unknown material X has a seeded refractive index", () => {
  const t = MATURA["lab-lom"];
  assert.deepEqual(NX, [1.42, 1.62]);
  assert.equal(SNOVI.x.n, null, "n snovi X ni v SNOVI (noben napis ga ne pokaže)");
  const ns = [];
  for (let s = 1; s <= 2000; s++) {
    const B = new LomBench({ seed: s * 7919 });
    assert.ok(B.nX >= NX[0] && B.nX <= NX[1], `seme ${s}: ${B.nX}`);
    assert.equal(B.nX, Math.round(B.nX * 1e4) / 1e4, "4 decimalke");
    assert.equal(t.resnica(B), B.nX);
    ns.push(B.nX);
  }
  assert.equal(new LomBench({ seed: 42 }).nX, new LomBench({ seed: 42 }).nX, "isto seme, ista snov");
  // Približno enakomerno: v vsaki petini razpona je 15–25 % vzorcev; povprečje blizu sredine.
  for (let i = 0; i < 5; i++) {
    const d = ns.filter((n) => n >= 1.42 + 0.04 * i && n < 1.42 + 0.04 * (i + 1)).length / ns.length;
    assert.ok(d > 0.15 && d < 0.25, `petina ${i}: ${d}`);
  }
  assert.ok(Math.abs(ns.reduce((a, b) => a + b) / ns.length - 1.52) < 0.01);
  // Kdor si zapomni akril (1,49), je redko znotraj tolerance.
  assert.ok(ns.filter((n) => Math.abs(1.49 - n) / n <= t.tol).length / ns.length < 0.2);
});

// Skrben dijak: polvalj iz snovi X, od vpadne pravokotnice, brez zamika, α = 10°, 20° … 80°, β na pol stopinje, sinusi na
// tri decimalke. n določi iz naklona premice sin β(sin α) ali kot povprečje sin α / sin β po točkah.
test("refraction tolerance: a careful student lands within tol in at least 95 % of runs", () => {
  const t = MATURA["lab-lom"];
  const N = 500;
  let vNaklon = 0, vPovp = 0;
  for (let s = 1; s <= N; s++) {
    const B = new LomBench({ seed: s * 7919 });
    B.snov = "x";
    B.laser = true;
    const pts = [];
    for (let a = 10; a <= 80; a += 10) {
      B.nastavi(a);
      const r3 = (x) => Math.round(x * 1000) / 1000;
      pts.push([r3(Math.sin(a * RAD)), r3(Math.sin(B.odcitaj().lom * RAD))]);
    }
    const prava = t.resnica(B);
    if (Math.abs(1 / naklon(pts) - prava) / prava <= t.tol) vNaklon++;
    if (Math.abs(pts.reduce((v, [x, y]) => v + x / y, 0) / pts.length - prava) / prava <= t.tol) vPovp++;
  }
  assert.ok(vNaklon / N >= 0.95, `naklon: le ${vNaklon}/${N} znotraj ${t.tol * 100} %`);
  assert.ok(vPovp / N >= 0.95, `povprečje: le ${vPovp}/${N} znotraj ${t.tol * 100} %`);
});

// Igra v brskalniku (test/laboratorij-matura.test.js): teče v testni strani po »Začni nalogo«, s kliki kot učenec.
// Preveri še, da je izbrana snov X (iz zraka v snov) in da njen lomni količnik ni nikjer v besedilu poskusa, v oznakah
// za bralnik zaslona ali v posnetku za inštruktorja (napis na disku kaže le »snov X«).
export async function igra() {
  const drsnik = async (t, v) => {
    const r = [...m.querySelectorAll(".demo-slider-label")].find((x) => txt(x).startsWith(t))?.parentElement.querySelector('input[type="range"]');
    if (!r) throw new Error("ni drsnika " + t);
    r.value = String(v);
    r.dispatchEvent(new Event("input", { bubbles: true }));
    await wait(80);
  };
  const sel = [...m.querySelectorAll("select")].find((s) => s.getAttribute("aria-label") === "snov na disku");
  if (sel?.value !== "x") throw new Error("snov X ni izbrana: " + sel?.value);
  const smer = [...m.querySelectorAll("[role=radiogroup]")].find((s) => s.getAttribute("aria-label") === "smer svetlobe");
  if (smer?.querySelector(".seg-btn.on")?.dataset.v !== "zrak") throw new Error("smer ni iz zraka v snov");
  await stikalo("laser vklopljen");
  for (let a = 10; a <= 80; a += 10) {
    await drsnik("vpadni kot α", a);
    await gumb("Zapiši meritev");
  }
  const n = m._labBench.nX;
  const napis = txt(m.querySelector(".lab-opt-n"));
  if (napis !== "snov X") throw new Error("napis na disku: " + napis);
  const { stanjePoskusa } = await import("/sim/lab.js");
  // Besedilo po vozliščih (sosednje celice tabele se ne zlepijo v novo število); viri z lomnimi količniki drugih snovi
  // (akril 1,488, steklo 1,515 …) so izpuščeni, da naključno enak n snovi X ne sproži napake.
  const deli = [];
  const tw = document.createTreeWalker(m, NodeFilter.SHOW_TEXT);
  while (tw.nextNode()) if (!tw.currentNode.parentElement.closest(".lab-opt-viri")) deli.push(tw.currentNode.textContent);
  for (const x of m.querySelectorAll("[aria-label]")) deli.push(x.getAttribute("aria-label"));
  const vse = [...deli, JSON.stringify(stanjePoskusa(m, { parametri: 60, odcitki: 20, vrstice: 500 }))].join(" | ");
  for (const d of [3, 4]) {
    const zapis = n.toFixed(d).replace(".", ",");
    if (vse.includes(zapis) || vse.includes(n.toFixed(d))) throw new Error(`lomni količnik snovi X (${zapis}) je viden`);
  }
  if (!/zrak → snov X/.test(m.querySelector("table.lab-table")?.textContent || "")) throw new Error("tabela nima vrstic »zrak → snov X«");
}
