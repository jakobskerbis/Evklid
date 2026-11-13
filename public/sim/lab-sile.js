// Virtualni laboratorij, »Silomer in uteži«: Hookov zakon (lab-hooke), gostota (lab-gostota), vzgon (lab-vzgon),
// hidrostatični tlak z manometrom (lab-tlak). Modeli: lab-model-sile.js (brez DOM). Odčitki analognih skal so v povečavi (lupa).
import { h, s, svgBox, slider, select, segmented, button, toggle, layout, label, stage as stageBox, controls as controlsBox } from "./kit.js";
import { ticker, lcd, dataTable, dataGraph, conclusion, eventLog, notes, fixed, tex, en, rez } from "./lab.js";
import {
  HookeBench, GostotaBench, VzgonBench, TlakBench, VZMETI, VZMET, VZORCI, TEKOCINE, VALJ, VALJ_PREREZ, VZOREC_PREREZ, VALJI,
  SILOMER, MANOMETER, G_SOLA, G_LJ, naklonSkoziIzhodisce, fmtSila, POENOSTAVITVE_SILE,
} from "./lab-model-sile.js";

const nb = " ";
const seme = () => (Math.random() * 2 ** 31) | 0;
const grp = (title, ...kids) => h("fieldset", { class: "lab-tit-grp" }, h("legend", {}, title), ...kids);
const buttons = (...k) => h("div", { class: "demo-buttons" }, ...k);
const row = (lab, ...kids) => h("div", { class: "lab-row" }, h("span", { class: "demo-slider-label" }, lab), ...kids);
const seg = (name, options, value, onChange) => {
  const x = segmented({ options, value, onChange });
  x.setAttribute("aria-label", name);
  return x;
};
const hint = (text) => h("p", { class: "lab-tit-hint", html: text });
const tekOpts = Object.entries(TEKOCINE).map(([id, t]) => [id, t.name]);
const g3 = (x) => fixed(x, 2);

// Serije za graf po skupinah (snov, vzmet, tekočina): barva in oblika po vrstnem redu, premica skozi izhodišče z naklonom k.
function serije(skupine) {
  return [...skupine.entries()].map(([name, pts], i) => {
    const k = pts.some(([x]) => x > 0) ? naklonSkoziIzhodisce(pts) : null;
    return { id: name, pts, cls: "abc"[i % 3], shape: i % 6 < 3 ? "o" : "^", label: name, line: k == null ? undefined : (x) => k * x };
  });
}
const skupaj = (list, key) => {
  const m = new Map();
  for (const r of list) (m.get(r[key]) || m.set(r[key], []).get(r[key])).push([r.x, r.y]);
  return m;
};

// Povečava skale (lupa): okvir x, y, w, h; vrednost v je na sredini; ppu px na enoto; razdelek »korak«, vsak »vsak«-ti z napisom.
// dol: skala narašča navzdol (ravnilo, silomer), sicer navzgor (merilni valj, manometer). vsebina(g, yc) nariše tekočino pod črtice.
function lupa(svg, { x, y, w, h: hh, v, ppu, korak, vsak, napis, dol = true, naslov }, vsebina) {
  const id = `${svg.uid}-lupa-${x}-${y}`;
  s("rect", { x, y, width: w, height: hh, rx: 8 }, s("clipPath", { id }, s("defs", {}, svg)));
  s("rect", { x, y, width: w, height: hh, rx: 8, class: "lab-sil-lupa-bg" }, svg);
  const g = s("g", { "clip-path": `url(#${id})` }, svg);
  const yc = y + hh / 2, sg = dol ? 1 : -1, Y = (u) => yc + sg * (u - v) * ppu;
  vsebina?.(g, yc);
  const n0 = Math.ceil((v - hh / 2 / ppu) / korak), n1 = Math.floor((v + hh / 2 / ppu) / korak);
  for (let n = n0; n <= n1; n++) {
    const yy = Y(n * korak), big = n % vsak === 0, mid = vsak % 2 === 0 && n % (vsak / 2) === 0;
    s("line", { x1: x, y1: yy, x2: x + (big ? 24 : mid ? 17 : 10), y2: yy, class: "lab-sil-tick" }, g);
    if (big && yy > y + 10 && yy < y + hh - 10) label(g, x + 28, yy, napis(Math.round(n * korak * 1e6) / 1e6).replace("-", "−"), "tick b", "start");
  }
  s("rect", { x, y, width: w, height: hh, rx: 8, class: "lab-sil-lupa-frame" }, svg);
  if (naslov) label(svg, x + w / 2, y - 8, naslov, "tick small");
  return { g, yc, Y };
}
function oko(svg, x, y) {
  s("ellipse", { cx: x, cy: y, rx: 8, ry: 5, class: "lab-tit-eye" }, svg);
  s("circle", { cx: x - 2, cy: y, r: 2.4, class: "lab-tit-pupil" }, svg);
}
function merilo(svg, x, y, px, text) {
  s("path", { d: `M${x},${y - 4} V${y} H${x + px} V${y - 4}`, class: "lab-scale" }, svg);
  label(svg, x + px / 2, y + 10, text, "tick small");
}
// Vijačna vzmet od y1 do y2 (n navojev).
function vzmet(svg, x, y1, y2, cls = "", n = 16, r = 8) {
  const d = [`M${x},${y1}`], st = (y2 - y1) / n;
  for (let i = 0; i < n; i++) d.push(`L${x + (i % 2 ? -r : r)},${(y1 + st * (i + 0.5)).toFixed(1)}`);
  d.push(`L${x},${y2}`);
  s("path", { d: d.join(" "), class: `lab-sil-spring ${cls}` }, svg);
}
function stojalo(svg, xRod, yTop, yBase, xArm, yArm) {
  s("rect", { x: xRod - 16, y: yBase - 7, width: 110, height: 7, rx: 2, class: "lab-sil-stand" }, svg);
  s("rect", { x: xRod - 3, y: yTop, width: 6, height: yBase - yTop - 7, class: "lab-sil-rod" }, svg);
  s("rect", { x: xRod - 3, y: yArm - 3, width: xArm - xRod + 6, height: 6, rx: 2, class: "lab-sil-rod" }, svg);
  s("rect", { x: xRod - 7, y: yArm - 7, width: 14, height: 14, rx: 2, class: "lab-tit-clamp" }, svg);
}
const tekCls = (id) => `lab-sil-tek lab-sil-${id}`;

// ================================================================ Hookov zakon: vzmet, uteži in ravnilo
export function labHooke(el) {
  const B = new HookeBench({ seed: seme() });
  const W = 400, H = 340, Y0 = 34, PX = 500; // ničla ravnila pri Y0, 1 cm = 5 px
  const svg = svgBox(W, H, "lab-bench lab-sil lab-sil-hooke");
  const log = eventLog();
  const rdL = lcd("tvoj odčitek ravnila");
  const table = dataTable([
    { key: "vz", label: "vzmet" },
    { key: "m", label: "<i>m</i> [g]" },
    { key: "F", label: "<i>F</i> = <i>mg</i> [N]" },
    { key: "r", label: "odčitek [cm]" },
    { key: "x", label: "podaljšek <i>x</i> [cm]" },
  ], { empty: "Še ni meritev. Najprej zapiši odčitek kazalca brez uteži, nato obešaj uteži." });
  const graph = dataGraph({ x: [0, 40], y: [0, 4], xStep: 5, yStep: 0.5, xLabel: "x [cm]", yLabel: "F [N]", title: "Sila v odvisnosti od podaljška vzmeti" });
  const calc = h("div", { class: "lab-top-calc", "aria-live": "polite" });
  const qBox = h("div");
  const meas = []; // { g: ime vzmeti, x [cm], y = F [N] }
  const x0 = {};
  let pogled = 0, asked = false;

  const vzSeg = seg("vzmet", Object.entries(VZMETI).map(([id, v]) => [id, v.name.replace(" vzmet", "")]), B.izbrana, (v) => {
    B.izberi(v);
    syncUt();
    log.push(`Na stojalu je ${VZMETI[v].name}${B.raztegnjena ? " (trajno raztegnjena)" : ""}.`, "info");
    draw();
  });
  const novaBtn = button("Zamenjaj z novo vzmetjo", () => {
    B.novaVzmet(B.izbrana);
    B.izberi(B.izbrana);
    delete x0[B.izbrana];
    syncUt();
    log.push("Nova vzmet je na stojalu. Znova zapiši odčitek brez uteži.", "ok");
    draw();
  });
  const utBtns = B.utezi.map((u, i) => h("button", { type: "button", class: "secondary small lab-sil-ut", "aria-pressed": "false", onclick: () => (B.obesene.includes(i) ? B.snemi(i) : B.obesi(i), syncUt(), draw()) }, `${u.n}${nb}g`));
  const vseBtn = button("Snemi vse", () => {
    for (const i of [...B.obesene]) B.snemi(i);
    syncUt();
    draw();
  });
  const umiriBtn = button("Umiri vzmet z roko", () => B.umiri());
  const okoSeg = seg("kje je oko", [["0", "v višini kazalca"], ["1", "više"], ["-1", "niže"]], "0", (v) => ((pogled = +v), draw()));
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const clrBtn = button("Izbriši meritve", () => (table.clear(), (meas.length = 0), redraw(), sync()));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, rdL)), controlsBox(
        grp("1. Vzmet", row("vzmet", vzSeg), buttons(novaBtn)),
        grp("2. Uteži", hint("Uteži obesi eno pod drugo (komplet: 10, 20, 20, 50, 100 in 200 g). Vzmet zaniha; počakaj, da se umiri."), h("div", { class: "lab-sil-uts" }, ...utBtns), buttons(vseBtn, umiriBtn)),
        grp("3. Odčitaj", hint("Kazalec odčitaš na ravnilu z razdelki po 1 mm (povečava desno). Oko naj bo v višini kazalca."), row("oko", okoSeg), buttons(recBtn, clrBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "Graf F(x) in prožnostni koeficient"), graph, calc, qBox,
      notes(POENOSTAVITVE_SILE.hooke, "Hookov zakon: <i>F</i> = <i>k x</i>. Teža uteži <i>F</i> = <i>m g</i>, <i>g</i> = 9,81 m/s². Uteži v mejah razreda M3 (OIML R111-1). Ocene: prožnostni koeficienti in meje prožnosti vzmeti, nihanje, paralaksa ~2 mm."),
    ],
    tryText: "Odčitaj kazalec brez uteži, nato mehko vzmet obremeni s 50, 100, 150, 200 in 250 g in nariši graf. Izračunaj k. Kaj se zgodi, ko na mehko vzmet obesiš 350 g in uteži nato snameš?",
  });
  el.classList.add("lab");

  function syncUt() {
    utBtns.forEach((b, i) => b.setAttribute("aria-pressed", String(B.obesene.includes(i))));
  }
  function record() {
    const r = B.odcitek(pogled), id = B.izbrana, ime = VZMETI[id].name.replace(" vzmet", "");
    if (!Number.isFinite(r.value)) return log.push("Kazalec je pod koncem ravnila. Snemi nekaj uteži.", "bad");
    const m = B.obesene.reduce((s, i) => s + B.utezi[i].n, 0);
    if (!r.mirna) log.push("Vzmet še niha: kazalec se premika, odčitek ni zanesljiv. Počakaj ali jo umiri z roko.", "warn");
    if (pogled) log.push(`Gledal si ${pogled > 0 ? "od zgoraj" : "od spodaj"}: zaradi paralakse je odčitek za ~2 mm ${pogled > 0 ? "prevelik" : "premajhen"}.`, "warn");
    if (m === 0) {
      if (x0[id] == null) (x0[id] = r.value), log.push(`Začetni odčitek: ${fixed(r.value * 100, 1)}${nb}cm. Podaljšek je odčitek z utežmi minus ta odčitek.`, "info");
      else if (r.value - x0[id] > 0.0025) log.push("Brez uteži kazalec ni več na začetnem mestu: vzmet je trajno raztegnjena, ker si jo obremenil prek meje prožnosti. Zamenjaj jo z novo.", "bad");
    } else if (x0[id] == null) return log.push("Najprej zapiši odčitek brez uteži (začetno lego kazalca).", "warn");
    const x = (r.value - x0[id]) * 100, F = (m / 1000) * G_SOLA;
    table.add({ vz: ime, m: String(m), F: fixed(F, 2), r: fixed(r.value * 100, 1), x: fixed(x, 1) });
    meas.push({ g: ime, x, y: F, id });
    redraw(), sync();
  }
  function sync() {
    const out = [];
    for (const [name, pts] of skupaj(meas, "g")) {
      if (pts.filter(([x]) => x > 0.05).length < 2) continue;
      const k = naklonSkoziIzhodisce(pts), id = Object.keys(VZMETI).find((i) => VZMETI[i].name.startsWith(name));
      out.push(`<p><b>${name} vzmet</b>: ${tex(String.raw`k = \frac{F}{x} \approx ${fixed(k, 3)}${en("N/cm")} = ${rez(fixed(k * 100, 1), "N/m")}`)} (naklon premice skozi izhodišče; na vzmeti piše ${VZMETI[id].k}${nb}N/m ±${nb}5${nb}%).</p>`);
    }
    calc.innerHTML = out.join("");
    const max = Math.max(0, ...[...skupaj(meas, "g").values()].map((p) => p.filter(([x]) => x > 0.05).length));
    if (max >= 4 && !asked) {
      asked = true;
      qBox.append(conclusion({
        text: "Kaj velja za podaljšek vzmeti, dokler je ne obremeniš prek meje prožnosti?",
        options: [
          { t: "Podaljšek je sorazmeren s silo: dvakrat večja sila, dvakrat večji podaljšek.", ok: true, why: "Točke ležijo na premici skozi izhodišče: <i>F</i> = <i>k x</i> (Hookov zakon). Naklon premice je prožnostni koeficient <i>k</i>. Prek meje prožnosti to ne velja več, vzmet se trajno raztegne." },
          { t: "Vse vzmeti se pri isti sili podaljšajo enako.", ok: false, why: `Trda vzmet ima večji <i>k</i>, zato se pri isti sili podaljša manj kot mehka: ${tex(String.raw`x = \frac{F}{k}`)}.` },
          { t: "Podaljšek raste s kvadratom sile.", ok: false, why: "Potem točke ne bi ležale na premici, ampak na krivulji, ki se vse bolj vzpenja. Meritve kažejo premico." },
          { t: "Vzmet z večjim prožnostnim koeficientom se pri isti sili bolj podaljša.", ok: false, why: "Obratno: <i>k</i> pove, koliko sile potrebuješ za podaljšek 1 m. Večji <i>k</i> pomeni trdo vzmet in manjši podaljšek." },
        ],
      }));
    }
  }
  function redraw() {
    graph.draw(serije(skupaj(meas, "g")));
  }
  ticker(el, (dt) => {
    B.step(dt);
    const r = B.odcitek(pogled);
    rdL.set(r.text, "cm", r.mirna ? "kazalec miruje" : "vzmet niha");
    draw();
  }, 100);

  function draw() {
    svg.replaceChildren();
    const yBase = H - 4, xs = 120, xr = 150;
    const yArm = Y0 + (B.p0 - VZMETI[B.izbrana].L0) * PX - 4, yp = Y0 + B.polozaj() * PX;
    stojalo(svg, 22, 10, yBase, xs + 10, yArm);
    // ravnilo 50 cm: črtice vsakih 5 mm (milimetri so v povečavi)
    s("rect", { x: xr, y: Y0 - 6, width: 30, height: 50 * 5 + 12, rx: 2, class: "lab-sil-ruler" }, svg);
    for (let c = 0; c <= 100; c++) {
      const y = Y0 + c * 2.5;
      s("line", { x1: xr, y1: y, x2: xr + (c % 2 ? 4 : c % 10 ? 8 : 12), y2: y, class: "lab-sil-tick" }, svg);
      if (c % 20 === 0) label(svg, xr + 21, y, String(c / 2), "tick small");
    }
    vzmet(svg, xs, yArm + 3, yp - 3, B.raztegnjena ? "bent" : "", B.izbrana === "mehka" ? 18 : B.izbrana === "srednja" ? 14 : 11);
    s("line", { x1: xs, y1: yp, x2: xr + 2, y2: yp, class: "lab-sil-needle" }, svg);
    let y = yp + 2;
    for (const i of B.obesene) {
      const n = B.utezi[i].n, hh = Math.max(4, n * 0.09);
      s("line", { x1: xs, y1: y, x2: xs, y2: y + 3, class: "lab-sil-hook" }, svg);
      s("rect", { x: xs - 15, y: y + 3, width: 30, height: hh, rx: 1.5, class: "lab-sil-mass" }, svg);
      y += hh + 3;
    }
    if (B.raztegnjena && !B.obesene.length) label(svg, xs - 34, yp + 2, "raztegnjena", "tick small", "end");
    // povečava ravnila
    const v = B.polozaj() * 1000, L = lupa(svg, { x: 236, y: 44, w: 150, h: 170, v, ppu: 9, korak: 1, vsak: 10, napis: (u) => `${u / 10}${nb}cm`, naslov: "povečano ravnilo (1 mm)" });
    // kazalec je pred ravnilom: pogled od zgoraj ali od spodaj zadene ravnilo za ~1,7 mm niže ali više (paralaksa)
    const xn = 236 + 64, xe = 236 + 138, dr = pogled * VZMET.paralaksa * 9000, yEye = L.yc - (dr * (xe - xn)) / (xn - 238);
    s("line", { x1: 236 + 30, y1: L.yc, x2: xn, y2: L.yc, class: "lab-sil-needle" }, svg);
    oko(svg, xe, yEye);
    s("line", { x1: xe - 8, y1: yEye, x2: 238, y2: L.yc + dr, class: "lab-tit-sight" }, svg);
    const r = B.odcitek(pogled);
    label(svg, 236 + 75, 232, `odčitek: ${r.text.replace(".", ",")}${nb}cm`, "tick b");
    merilo(svg, 300, H - 20, 25, "5 cm");
    svg.setAttribute("aria-label", `${VZMETI[B.izbrana].name} na stojalu z ravnilom, obešenih ${B.obesene.reduce((s, i) => s + B.utezi[i].n, 0)} g. Kazalec kaže ${r.text.replace(".", ",")} cm${B.nihanje() > VZMET.mirna ? ", vzmet niha" : ""}.`);
  }
  redraw();
  draw();
}

// ================================================================ gostota: tehtnica in merilni valj
export function labGostota(el) {
  const B = new GostotaBench({ seed: seme() });
  const W = 400, H = 300, PX = 12, yB = 270, A = VALJ_PREREZ, rv = Math.sqrt(A / Math.PI) * PX; // 1 cm = 12 px
  const svg = svgBox(W, H, "lab-bench lab-sil lab-sil-gost");
  const log = eventLog();
  const balL = lcd("tehtnica"), vL = lcd("tvoj odčitek valja");
  const table = dataTable([
    { key: "sn", label: "snov" },
    { key: "m", label: "<i>m</i> [g]" },
    { key: "V1", label: "<i>V</i>₁ [mL]" },
    { key: "V2", label: "<i>V</i>₂ [mL]" },
    { key: "V", label: "<i>V</i> [cm³]" },
    { key: "rho", label: "ρ [g/cm³]" },
    { key: "lit", label: "tabela" },
  ], { empty: "Še ni meritev. Stehtaj vzorec, odčitaj vodo v valju, potopi vzorec in odčitaj znova." });
  const graph = dataGraph({ x: [0, 40], y: [0, 150], xStep: 5, yStep: 25, xLabel: "V [cm³]", yLabel: "m [g]", title: "Masa v odvisnosti od prostornine" });
  const calc = h("div", { class: "lab-top-calc", "aria-live": "polite" });
  const qBox = h("div");
  const meas = []; // { g: snov, x: V, y: m }
  const st = { tek: "voda", V: 50, vz: "aluminij", i: 2, nacin: "zdrsni", zica: false, menisk: "dno", naTehtnici: null };
  let trial = {}, asked = false;

  const tekSel = select({ label: "tekočina", options: tekOpts, value: st.tek, onChange: (v) => (st.tek = v) });
  const vSl = slider({ label: "natoči do oznake", min: 15, max: 80, step: 5, value: 50, unit: "mL", onInput: (v) => (st.V = v) });
  const pourBtn = button("Natoči", () => pour(), "primary small");
  const emptyBtn = button("Izprazni valj", () => (B.izprazni(), (trial = {}), (st.naTehtnici = null), log.push("Valj je prazen in suh.", "info"), draw()));
  const weighCylBtn = button("Stehtaj valj", () => weighCyl());
  const vzSel = select({ label: "vzorec", options: Object.entries(VZORCI).map(([id, z]) => [id, z.name]), value: st.vz, onChange: (v) => newSample(v, st.i) });
  const vzSeg = seg("velikost vzorca", [["0", "majhen"], ["1", "srednji"], ["2", "velik"]], "2", (v) => newSample(st.vz, +v));
  const weighBtn = button("Stehtaj vzorec", () => weighSample());
  const nacSeg = seg("kako ga daš v valj", [["zdrsni", "nagni valj, naj zdrsne"], ["spusti", "spusti od zgoraj"]], "zdrsni", (v) => (st.nacin = v));
  const zicaT = toggle("potisni ga pod gladino s tanko žico", false, (v) => (st.zica = v));
  const inBtn = button("Vzorec v valj", () => sink(), "primary small");
  const outBtn = button("Vzemi vzorec ven", () => (B.vzemi(), (trial.V2 = undefined), draw()));
  const menSeg = seg("kje odčitaš menisk", [["dno", "pri dnu meniska"], ["vrh", "pri vrhu meniska"]], "dno", (v) => ((st.menisk = v), draw()));
  const readBtn = button("Odčitaj valj", () => readV(), "primary small");
  const recBtn = button("Zapiši v tabelo", () => record(), "primary small");
  const clrBtn = button("Izbriši meritve", () => (table.clear(), (meas.length = 0), redraw(), sync()));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, balL, vL)), controlsBox(
        grp("1. Merilni valj 100 mL", hint("Za trdnine natoči vodo. Za gostoto tekočine najprej stehtaj prazen valj, natoči tekočino, odčitaj prostornino in valj stehtaj še enkrat."), tekSel, vSl, buttons(pourBtn, emptyBtn, weighCylBtn)),
        grp("2. Vzorec", vzSel, row("velikost", vzSeg), buttons(weighBtn), row("v valj", nacSeg), zicaT, buttons(inBtn, outBtn)),
        grp("3. Odčitaj in zapiši", hint("Odčitaj vodo pred vzorcem (<i>V</i>₁) in z vzorcem (<i>V</i>₂). Prostornina vzorca je <i>V</i> = <i>V</i>₂ − <i>V</i>₁."), row("menisk", menSeg), buttons(readBtn, recBtn, clrBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "Graf m(V)"), graph, calc, qBox,
      notes(POENOSTAVITVE_SILE.gostota, `Gostota ${tex(String.raw`\rho = \frac{m}{V}`)}; 1 mL = 1 cm³. Tabela pri 20 °C: aluminij 2,70, baker 8,96, voda 0,998, etanol 0,789 g/cm³ (CRC Handbook); jeklo 7,85, medenina 8,47, PVC 1,38, granit 2,65, smreka 0,45, sončnično olje 0,92 g/cm³ (Engineering ToolBox); slana voda s 4 % soli 1,027 g/cm³ (CRC). Merilni valj razreda B ±1 mL (ISO 4788), tehtnica ±0,1 g. Ocene: menisk, mehurček, velikost valja.`),
    ],
    tryText: "Izmeri gostoto treh aluminijastih vzorcev različnih velikosti in jih nariši na graf m(V). Nato poskusi z lesom: kaj se zgodi, če ga ne potisneš pod gladino? Izmeri še gostoto olja in etanola.",
  });
  el.classList.add("lab");

  function newSample(id, i) {
    if (B.vzorec) B.vzemi(), log.push("Prejšnji vzorec si vzel iz valja.", "info");
    st.vz = id;
    st.i = i;
    trial = { V1: trial.V1 };
    st.naTehtnici = null;
    draw();
  }
  function pour() {
    if (B.tek) return log.push("V valju je že tekočina. Najprej ga izprazni.", "warn");
    B.nalij(st.tek, st.V);
    trial = { mPrazen: trial.mPrazen };
    st.naTehtnici = null;
    log.push(`V valj si natočil ${TEKOCINE[st.tek].name} do oznake ${st.V}${nb}mL.`, "info");
    draw();
  }
  function weighCyl() {
    if (B.vzorec) return log.push("Najprej vzemi vzorec iz valja.", "warn");
    const r = B.tehtajValj();
    st.naTehtnici = "valj";
    balL.set(r.text, "g", B.tek ? "valj s tekočino" : "prazen valj");
    if (B.tek) trial.mPoln = r.value;
    else trial.mPrazen = r.value;
    draw();
  }
  function weighSample() {
    if (B.vzorec) return log.push("Vzorec je v valju. Vzemi ga ven, preden ga stehtaš (moker bi tehtal preveč).", "warn");
    const r = B.tehtajVzorec(st.vz, st.i);
    st.naTehtnici = "vzorec";
    balL.set(r.text, "g", VZORCI[st.vz].name);
    trial.m = r.value;
    draw();
  }
  function sink() {
    if (!B.tek) return log.push("Najprej natoči vodo v valj.", "warn");
    if (B.vzorec) return log.push("Vzorec je že v valju.", "warn");
    if (st.tek !== "voda") log.push("Za merjenje prostornine trdnin uporabljamo vodo.", "info");
    const z = B.potopi(st.vz, st.i, { nacin: st.nacin, zica: st.zica });
    st.naTehtnici = null;
    if (B.prelito) log.push("Tekočina se je prelila čez rob valja. Izprazni valj in natoči manj vode.", "bad");
    else if (z.plava) log.push(`${VZORCI[st.vz].name[0].toUpperCase() + VZORCI[st.vz].name.slice(1)} plava: pod gladino je le del vzorca, zato izpodrine premalo vode. Potisni ga pod gladino s tanko žico.`, "warn");
    else if (!z.potopljen) log.push("Vzorec ni ves pod gladino: del gleda iz vode. Natoči več vode.", "warn");
    if (z.meh) log.push("Vzorec je pljusknil v vodo in pod njim se je ujel zračni mehurček. (Težek kovinski vzorec lahko tudi razbije dno valja.)", "warn");
    if (VZORCI[st.vz].rho < TEKOCINE[B.tek.id].rho && st.zica) log.push("Vzorec drži pod gladino tanka žica; njena prostornina je zanemarljiva (~0,05 mL).", "info");
    draw();
  }
  function readV() {
    const r = B.odcitekV(st.menisk);
    vL.set(r.text, "mL", st.menisk === "dno" ? "dno meniska" : "vrh meniska");
    if (!Number.isFinite(r.value)) return log.push(B.tek ? "Gladina je zunaj skale valja." : "Valj je prazen.", "warn");
    if (B.prelito) log.push("Del vode se je prelil, odčitek ne pove prave prostornine.", "bad");
    if (B.vzorec) trial.V2 = r.value;
    else trial.V1 = r.value;
    trial.menisk = st.menisk;
    draw();
  }
  function record() {
    const lit = (x) => `${fixed(x, 2)}`;
    if (B.vzorec && trial.V2 != null) {
      if (trial.m == null) return log.push("Vzorca nisi stehtal. Vzemi ga ven in ga stehtaj.", "warn");
      if (trial.V1 == null) return log.push("Manjka odčitek vode brez vzorca (<i>V</i>₁).", "warn");
      const V = trial.V2 - trial.V1, Z = VZORCI[st.vz];
      if (V <= 0) return log.push("<i>V</i>₂ ni večji od <i>V</i>₁.", "warn");
      const rho = trial.m / V;
      table.add({ sn: Z.name, m: fixed(trial.m, 1), V1: fixed(trial.V1, 1), V2: fixed(trial.V2, 1), V: fixed(V, 1), rho: fixed(rho, 2), lit: lit(Z.rho) });
      meas.push({ g: Z.name, x: V, y: trial.m });
      const dev = rho / Z.rho - 1;
      if (Math.abs(dev) > 0.05) log.push(`Gostota se od vrednosti v tabeli razlikuje za ${fixed(Math.abs(dev) * 100, 0)}${nb}%. ${B.vzorec.plava ? "Vzorec je plaval." : B.vzorec.meh ? "Pod vzorcem je mehurček zraka: prostornina je prevelika." : !B.vzorec.potopljen ? "Vzorec ni bil ves pod vodo." : "Preveri odčitke."}`, "warn");
      else log.push(`${Z.name}: ρ = ${fixed(rho, 2)}${nb}g/cm³ (tabela ${lit(Z.rho)}${nb}g/cm³).`, "ok");
    } else if (!B.vzorec && B.tek && trial.mPrazen != null && trial.mPoln != null && trial.V1 != null) {
      const m = trial.mPoln - trial.mPrazen, V = trial.V1, T = TEKOCINE[B.tek.id], rho = m / V;
      table.add({ sn: T.name, m: fixed(m, 1), V1: "–", V2: fixed(V, 1), V: fixed(V, 1), rho: fixed(rho, 3), lit: fixed(T.rho, 3) });
      meas.push({ g: T.name, x: V, y: m });
      if (trial.menisk === "vrh") log.push("Odčital si vrh meniska: prostornina je za ~1 mL prevelika, gostota premajhna. Pri tekočinah se ta napaka ne odšteje.", "warn");
      else log.push(`${T.name}: ρ = ${fixed(rho, 3)}${nb}g/cm³ (tabela ${fixed(T.rho, 3)}).`, "ok");
    } else return log.push(B.vzorec ? "Odčitaj valj z vzorcem (<i>V</i>₂)." : "Za trdnino: stehtaj vzorec, odčitaj <i>V</i>₁, potopi vzorec, odčitaj <i>V</i>₂. Za tekočino: stehtaj prazen valj, natoči, odčitaj, stehtaj poln valj.", "warn");
    redraw(), sync();
  }
  function sync() {
    const out = [];
    for (const [name, pts] of skupaj(meas, "g")) out.push(`<li>${name}: naklon premice ${fixed(naklonSkoziIzhodisce(pts), 2)}${nb}g/cm³${pts.length > 1 ? ` (${pts.length} vzorci)` : ""}</li>`);
    calc.innerHTML = out.length ? `<p>Gostota je naklon premice skozi izhodišče: ${tex(String.raw`\rho = \frac{m}{V}`)}.</p><ul>${out.join("")}</ul>` : "";
    if (meas.length >= 3 && !asked) {
      asked = true;
      qBox.append(conclusion({
        text: "Kaj pove graf <i>m</i>(<i>V</i>) za vzorce iz iste snovi?",
        options: [
          { t: "Točke ležijo na premici skozi izhodišče; naklon premice je gostota snovi, ki je enaka za majhen in velik kos.", ok: true, why: `Dvakrat večji kos ima dvakrat večjo maso, zato je ${tex(String.raw`\frac{m}{V}`)} stalno. To razmerje je gostota; od velikosti kosa ni odvisna, od snovi pa.` },
          { t: "Večji kos iste snovi ima večjo gostoto.", ok: false, why: `Večji kos ima večjo maso in večjo prostornino, razmerje ${tex(String.raw`\frac{m}{V}`)} pa ostane enako.` },
          { t: "Majhen kos lesa plava, velik kos istega lesa pa potone.", ok: false, why: "Gostota ni odvisna od velikosti kosa. Les plava, ker ima manjšo <b>gostoto</b> od vode; to velja za majhen in za velik kos, čeprav je velik kos težji od vode v valju." },
          { t: "Prostornine vzorca ne moremo izmeriti, ker ni kocka.", ok: false, why: "Z izpodrivanjem vode izmeriš prostornino telesa poljubne oblike: <i>V</i> = <i>V</i>₂ − <i>V</i>₁, tudi za nepravilen kamen." },
        ],
      }));
    }
  }
  function redraw() {
    const xm = Math.max(40, ...meas.map((p) => Math.ceil(p.x / 10) * 10)), ym = Math.max(150, ...meas.map((p) => Math.ceil(p.y / 50) * 50));
    graph.setAxes({ x: [0, xm], y: [0, ym], yStep: ym > 150 ? 50 : 25 });
    graph.draw(serije(skupaj(meas, "g")));
  }

  function draw() {
    svg.replaceChildren();
    s("line", { x1: 0, y1: yB + 12, x2: W, y2: yB + 12, class: "lab-tit-bench" }, svg);
    // tehtnica levo
    const tx = 18, tw = 104;
    s("rect", { x: tx, y: yB - 8, width: tw, height: 20, rx: 4, class: "lab-sil-balance" }, svg);
    s("rect", { x: tx + 14, y: yB - 13, width: tw - 28, height: 5, rx: 2, class: "lab-sil-plate" }, svg);
    const vzNaMizi = !B.vzorec, Z = B.vzorci[st.vz][st.i], zw = 2 * PX, zh = Z.H * PX;
    const cyl = st.naTehtnici === "valj" ? tx + tw / 2 : 200, cylB = st.naTehtnici === "valj" ? yB - 13 : yB + 12;
    // vzorec na tehtnici ali na mizi
    if (vzNaMizi) {
      const sx = st.naTehtnici === "vzorec" ? tx + tw / 2 - zw / 2 : 128, sy = st.naTehtnici === "vzorec" ? yB - 13 - zh : yB + 12 - zh;
      s("rect", { x: sx, y: sy, width: zw, height: zh, rx: st.vz === "kamen" ? 6 : 1.5, class: `lab-sil-sample lab-sil-${st.vz}` }, svg);
    }
    // merilni valj: dno valja je 12 px nad podstavkom
    const bot = cylB - 12, Yv = (V) => bot - (V / A) * PX, x0 = cyl - rv, x1 = cyl + rv;
    s("path", { d: `M${cyl - 26},${cylB} H${cyl + 26} L${cyl + 20},${bot} H${cyl - 20} Z`, class: "lab-sil-foot" }, svg);
    if (B.tek) {
      const yl = Yv(B.gladina());
      s("rect", { x: x0, y: yl, width: 2 * rv, height: bot - yl, class: tekCls(B.tek.id) }, svg);
      if (B.prelito) s("path", { d: `M${x1},${Yv(VALJ.V + VALJ.rob)} q8,10 6,${cylB - Yv(VALJ.V + VALJ.rob) - 4}`, class: `lab-sil-spill ${tekCls(B.tek.id)}` }, svg);
    }
    if (B.vzorec) {
      const z = B.vzorec, yl = Yv(B.gladina());
      let top = bot - zh;
      if (z.plava) top = yl - (zh - (z.Vizp / VZOREC_PREREZ) * PX);
      else if (z.zica) top = yl + 4;
      s("rect", { x: cyl - zw / 2, y: top, width: zw, height: zh, rx: st.vz === "kamen" ? 6 : 1.5, class: `lab-sil-sample lab-sil-${st.vz}` }, svg);
      if (z.zica) s("line", { x1: cyl + 3, y1: top, x2: cyl + 10, y2: Yv(VALJ.V + VALJ.rob) - 24, class: "lab-sil-wire" }, svg);
      if (z.meh) s("ellipse", { cx: cyl, cy: top + zh - 1, rx: 7, ry: 3, class: "lab-top-bubble" }, svg);
    }
    s("path", { d: `M${x0 - 3},${Yv(VALJ.V + VALJ.rob) - 2} V${bot} H${x1} V${Yv(VALJ.V + VALJ.rob)} l4,-3`, class: "lab-glass" }, svg);
    for (let V = 10; V <= 100; V += 1) {
      const y = Yv(V);
      if (V % 2 && V % 5) continue; // na risbi vsak drugi mL, v povečavi vsi
      s("line", { x1: x0, y1: y, x2: x0 + (V % 10 ? (V % 5 ? 3 : 6) : 10), y2: y, class: "lab-sil-tick" }, svg);
      if (V % 20 === 0 && st.naTehtnici !== "valj") label(svg, x0 - 6, y, String(V), "tick small", "end");
    }
    if (st.naTehtnici !== "valj") label(svg, cyl, yB + 22, "merilni valj 100 mL", "tick small");
    // povečava meniska
    if (B.tek) {
      const r = B.odcitekV(st.menisk), vTrue = B.gladina(), vSk = vTrue + (B.skala.a * vTrue) / 100 + B.skala.b;
      const m = TEKOCINE[B.tek.id].hm * 100 * A * 14, xa = 250, xb = 390, xm = (xa + xb) / 2;
      const L = lupa(svg, { x: 250, y: 40, w: 140, h: 160, v: vSk, ppu: 14, korak: 1, vsak: 10, napis: (u) => `${u}${nb}mL`, dol: false, naslov: "povečan menisk" }, (g, yc) => {
        s("path", { d: `M${xa},${yc - m} Q${xm},${yc + m} ${xb},${yc - m} V${240} H${xa} Z`, class: tekCls(B.tek.id) }, g);
        s("path", { d: `M${xa},${yc - m} Q${xm},${yc + m} ${xb},${yc - m}`, class: "lab-tit-menisk" }, g);
      });
      const yr = st.menisk === "dno" ? L.yc : L.yc - m;
      s("line", { x1: 252, y1: yr, x2: 372, y2: yr, class: "lab-tit-sight" }, svg);
      oko(svg, 380, yr);
      label(svg, 320, 218, `odčitek: ${r.text.replace(".", ",")}${nb}mL`, "tick b");
    }
    merilo(svg, 330, H - 14, 24, "2 cm");
    svg.setAttribute("aria-label", `Merilni valj ${B.tek ? `s tekočino (${TEKOCINE[B.tek.id].name}, ${B.odcitekV(st.menisk).text.replace(".", ",")} mL)` : "je prazen"}${B.vzorec ? `, v njem je ${VZORCI[B.vzorec.id].name}${B.vzorec.plava ? ", ki plava" : ""}` : ""}. Tehtnica levo.`);
  }
  newSample("aluminij", 2);
  balL.set("0.0", "g", "tara");
  vL.set("", "mL", "valj je prazen");
  redraw();
}

// ================================================================ vzgon: silomer in valj v tekočini
export function labVzgon(el) {
  const B = new VzgonBench({ seed: seme() });
  const W = 400, H = 330, PX = 800, yT = 318; // 1 cm = 8 px; miza pri yT
  const svg = svgBox(W, H, "lab-bench lab-sil lab-sil-vzg");
  const log = eventLog();
  const fL = lcd("tvoj odčitek silomera");
  const table = dataTable([
    { key: "vj", label: "valj" },
    { key: "tek", label: "tekočina" },
    { key: "d", label: "potopljeno [cm]" },
    { key: "Vi", label: "<i>V</i><sub>izp</sub> [cm³]" },
    { key: "F", label: "<i>F</i> [N]" },
    { key: "Fv", label: "<i>F</i><sub>vzg</sub> [N]" },
    { key: "Fa", label: "ρ<i>gV</i><sub>izp</sub> [N]" },
  ], { empty: "Še ni meritev. Zapiši silo, ko valj visi v zraku, nato ga spuščaj v tekočino." });
  const graph = dataGraph({ x: [0, 100], y: [0, 1.2], xStep: 20, yStep: 0.2, xLabel: "V izp [cm³]", yLabel: "F vzg [N]", title: "Vzgon v odvisnosti od prostornine potopljenega dela" });
  const calc = h("div", { class: "lab-top-calc", "aria-live": "polite" });
  const qBox = h("div");
  const meas = []; // { g: tekočina, x: Vizp, y: Fvzg }
  const zrak = {}; // sila v zraku za vsak valj
  let asked = false, dnoRekel = false;

  const valjSeg = seg("valj", Object.entries(VALJI).map(([id, v]) => [id, v.name]), B.valj, (v) => {
    if (B.s > 0) return valjSeg.set(B.valj, true), log.push("Najprej dvigni valj iz tekočine.", "warn");
    B.valj = v;
    draw();
  });
  const tekSel = select({ label: "tekočina v čaši", options: tekOpts, value: B.tek, onChange: (v) => {
    if (B.s > 0) return (tekSel.sel.value = B.tek), log.push("Najprej dvigni valj iz tekočine.", "warn");
    B.tek = v;
    log.push(`V čaši je 800${nb}mL: ${TEKOCINE[v].name}.`, "info");
    draw();
  } });
  const zeroBtn = button("Naravnaj ničlo silomera", () => {
    B.nicla = true;
    log.push("Valj si snel, silomer brez bremena naravnal na 0 in valj spet obesil.", "ok");
    draw();
  });
  const sSl = slider({ label: "dno valja pod gladino", min: -3, max: 13, step: 0.5, value: -2, unit: "cm", onInput: (v) => ((B.s = v / 100), draw()) });
  B.s = -0.02;
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const clrBtn = button("Izbriši meritve", () => (table.clear(), (meas.length = 0), redraw(), sync()));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, fL)), controlsBox(
        grp("1. Valj in tekočina", row("valj", valjSeg), tekSel),
        grp("2. Silomer 0–5 N", hint("Razdelki po 0,05 N; odčitaš na pol razdelka. Preden obesiš valj, naravnaj ničlo."), buttons(zeroBtn)),
        grp("3. Spuščaj valj", hint("Na valju so črte vsak centimeter: iz njih odčitaš, koliko je potopljeno. Vzgon je razlika sile v zraku in v tekočini."), sSl, buttons(recBtn, clrBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "Arhimedov zakon"), graph, calc, qBox,
      notes(POENOSTAVITVE_SILE.vzgon, "Arhimedov zakon: <i>F</i><sub>vzg</sub> = ρ<sub>tek</sub> <i>g</i> <i>V</i><sub>izp</sub>, <i>g</i> = 9,81 m/s². Gostote tekočin pri 20 °C: voda 0,998, etanol 0,789 g/cm³ (CRC), slana voda (4 % soli) 1,027 (CRC), sončnično olje 0,92 (Engineering ToolBox). Ocene: natančnost silomera ±0,05 N, zamik ničle 0,08–0,20 N, mere posode."),
    ],
    tryText: "Zapiši silo, ko aluminijast valj visi v zraku. Nato ga potapljaj v vodo po 2 cm in vsakič zapiši silo. Kako je vzgon odvisen od potopljenega dela? Ponovi v slani vodi in etanolu. Kaj se zgodi, ko valj spustiš do dna?",
  });
  el.classList.add("lab");

  function record() {
    const r = B.odcitek();
    if (!Number.isFinite(r.value)) return log.push("Sila je večja od 5 N, silomer je na koncu skale.", "bad");
    const vj = { aluminij: "aluminij", jeklo: "jeklo" }[B.valj] ?? VALJI[B.valj].name.split(" ")[0], d = Math.round(B.globina() * 1000) / 10, Vi = d * (B.a * 1e4);
    if (B.s <= 0 || d === 0) {
      zrak[B.valj] = r.value;
      table.add({ vj, tek: "zrak", d: "0", Vi: "0", F: r.text.replace(".", ","), Fv: "–", Fa: "–" });
      if (!B.nicla) log.push(`Ničla silomera ni naravnana: brez valja kaže ${fixed(B.nic0, 2)}${nb}N. Teža valja je zato prevelika. (Vzgon kot razlika dveh odčitkov bo vseeno pravilen.)`, "warn");
      else log.push(`Teža valja v zraku: ${r.text.replace(".", ",")}${nb}N.`, "info");
      return;
    }
    if (zrak[B.valj] == null) return log.push("Najprej zapiši silo, ko valj visi v zraku (dvigni ga nad gladino).", "warn");
    const Fv = zrak[B.valj] - r.value, Fa = TEKOCINE[B.tek].rho * G_SOLA * Vi * 1e-3;
    table.add({ vj, tek: TEKOCINE[B.tek].name, d: fixed(d, 1), Vi: fixed(Vi, 0), F: r.text.replace(".", ","), Fv: fixed(Fv, 3), Fa: fixed(Fa, 3) });
    meas.push({ g: TEKOCINE[B.tek].name, x: Vi, y: Fv });
    if (B.dno()) log.push("Valj stoji na dnu čaše: del teže nosi dno, zato silomer kaže premalo in je »vzgon« prevelik. Valj dvigni, da prosto visi.", "bad");
    redraw(), sync();
  }
  function sync() {
    const out = [];
    for (const [name, pts] of skupaj(meas, "g")) {
      if (!pts.some(([x]) => x > 5)) continue;
      const k = naklonSkoziIzhodisce(pts);
      out.push(`<li>${name}: naklon ${fixed(k * 1000, 2)}${nb}N na 1000 cm³ → ρ = naklon/<i>g</i> ≈ <b>${fixed((k * 1000) / G_SOLA, 2)}${nb}g/cm³</b></li>`);
    }
    calc.innerHTML = out.length ? `<p>Iz naklona premice <i>F</i><sub>vzg</sub>(<i>V</i><sub>izp</sub>) dobiš gostoto tekočine:</p><ul>${out.join("")}</ul>` : "";
    if (meas.length >= 4 && !asked) {
      asked = true;
      qBox.append(conclusion({
        text: "Od česa je odvisen vzgon na valj?",
        options: [
          { t: "Od prostornine potopljenega dela in od gostote tekočine.", ok: true, why: "<i>F</i><sub>vzg</sub> = ρ<sub>tek</sub> <i>g</i> <i>V</i><sub>izp</sub>: vzgon je enak teži izpodrinjene tekočine. Več potopiš, večji je; v slani vodi je večji kot v vodi, v etanolu manjši." },
          { t: "Od mase valja: težji valj ima večji vzgon.", ok: false, why: "Jeklen valj 50 cm³ je težji od aluminijastega 100 cm³, a ima v vodi le pol tolikšen vzgon. Šteje prostornina, ne masa." },
          { t: "Od globine: tudi ko je valj že ves pod gladino, vzgon še raste.", ok: false, why: "Ko je valj ves pod gladino, izpodriva vedno enako tekočine, zato se sila ne spreminja več, dokler se valj ne dotakne dna." },
          { t: "Vzgon je v vseh tekočinah enak.", ok: false, why: "V etanolu, vodi in slani vodi silomer pri isti potopljeni prostornini kaže različno: gostejša tekočina potiska navzgor močneje." },
        ],
      }));
    }
  }
  function redraw() {
    graph.draw(serije(skupaj(meas, "g")));
  }
  ticker(el, () => {
    const r = B.odcitek();
    fL.set(r.text, "N", B.dno() ? "valj na dnu" : B.globina() > 0 ? "v tekočini" : "v zraku");
    if (B.dno() && !dnoRekel) (dnoRekel = true), log.push("Valj se je dotaknil dna čaše.", "warn");
    if (!B.dno()) dnoRekel = false;
  }, 200);

  function draw() {
    svg.replaceChildren();
    const A = B.A, cw = CASA_W(A), cx = 112, x0 = cx - cw / 2, x1 = cx + cw / 2, ySurf0 = yT - B.h0 * PX;
    s("line", { x1: 0, y1: yT, x2: 220, y2: yT, class: "lab-tit-bench" }, svg);
    // čaša 1000 mL, visoka 15 cm
    const ySurf = ySurf0 - ((B.Vizp() * 1e-6) / A) * PX;
    if (B.tek) s("rect", { x: x0 + 1.5, y: ySurf, width: cw - 3, height: yT - ySurf - 1.5, class: tekCls(B.tek) }, svg);
    // valj
    const vw = VALJI[B.valj].d * PX, vh = B.H * PX, yBot = ySurf0 + Math.min(B.s, B.h0) * PX, yTop = yBot - vh;
    s("rect", { x: cx - vw / 2, y: yTop, width: vw, height: vh, rx: 2, class: `lab-sil-sample lab-sil-${B.valj}` }, svg);
    for (let c = 1; c < B.H * 100; c++) s("line", { x1: cx - vw / 2, y1: yBot - c * 8, x2: cx - vw / 2 + 8, y2: yBot - c * 8, class: "lab-sil-ring" }, svg);
    s("path", { d: `M${x0 - 5},${yT - 15 * 8} Q${x0},${yT - 15 * 8 + 2} ${x0},${yT - 15 * 8 + 6} V${yT - 4} Q${x0},${yT} ${x0 + 4},${yT} H${x1 - 4} Q${x1},${yT} ${x1},${yT - 4} V${yT - 15 * 8}`, class: "lab-glass" }, svg);
    // silomer: kavelj, cev s skalo 10 cm, ročaj; spodnji kavelj se premika s silo (5 N na 10 cm)
    const F = Math.min(SILOMER.max, Math.max(0, B.sila() * (1 + B.gain) + (B.nicla ? 0 : B.nic0)));
    const yHook = yTop - 10, yTube = yHook - 4 - 12 * 8; // cev 12 cm
    s("line", { x1: cx, y1: yTop, x2: cx, y2: yHook, class: "lab-sil-hook" }, svg);
    s("rect", { x: cx - 9, y: yTube, width: 18, height: 12 * 8, rx: 4, class: "lab-sil-meter" }, svg);
    const yZero = yTube + 14, yInd = yZero + (F / SILOMER.max) * 80;
    for (let n = 0; n <= 10; n++) s("line", { x1: cx - 9, y1: yZero + n * 8, x2: cx - (n % 2 ? 4 : 1), y2: yZero + n * 8, class: "lab-sil-tick" }, svg);
    s("rect", { x: cx - 3, y: yZero, width: 6, height: Math.max(1, yInd - yZero), class: "lab-sil-inner" }, svg);
    s("line", { x1: cx - 9, y1: yInd, x2: cx + 9, y2: yInd, class: "lab-sil-needle" }, svg);
    s("line", { x1: cx, y1: yTube, x2: cx, y2: Math.max(4, yTube - 14), class: "lab-sil-hook" }, svg);
    s("circle", { cx, cy: Math.max(4, yTube - 18), r: 4, class: "lab-sil-ringtop" }, svg);
    // povečava skale silomera
    const L = lupa(svg, { x: 240, y: 36, w: 150, h: 170, v: F, ppu: 240, korak: 0.05, vsak: 2, napis: (u) => `${fixed(u, 1)}${nb}N`, naslov: "povečana skala silomera" });
    s("line", { x1: 240 + 2, y1: L.yc, x2: 240 + 24, y2: L.yc, class: "lab-sil-needle" }, svg);
    s("line", { x1: 240 + 70, y1: L.yc, x2: 240 + 126, y2: L.yc, class: "lab-tit-sight" }, svg);
    oko(svg, 240 + 136, L.yc);
    const r = B.odcitek();
    label(svg, 240 + 75, 224, `odčitek: ${r.text.replace(".", ",")}${nb}N`, "tick b");
    label(svg, 240 + 75, 242, B.globina() > 0 ? `potopljeno ${fixed(B.globina() * 100, 1)}${nb}cm` : "valj je v zraku", "tick small");
    if (B.dno()) label(svg, cx, yT + 8, "valj stoji na dnu", "tick small");
    merilo(svg, 300, H - 18, 16, "2 cm");
    svg.setAttribute("aria-label", `${VALJI[B.valj].name} visi na silomeru nad čašo s tekočino (${TEKOCINE[B.tek].name}). ${B.globina() > 0 ? `Potopljeno ${fixed(B.globina() * 100, 1)} cm` : "Valj je v zraku"}; silomer kaže ${r.text.replace(".", ",")} N.`);
  }
  draw();
}
const CASA_W = (A) => 2 * Math.sqrt(A / Math.PI) * 800;

// ================================================================ hidrostatični tlak: sonda in manometer
export function labTlak(el) {
  const B = new TlakBench({ seed: seme() });
  const W = 400, H = 330, PX = 800, ySurf = 50; // 1 cm = 8 px
  const svg = svgBox(W, H, "lab-bench lab-sil lab-sil-tlak");
  const log = eventLog();
  const lL = lcd("levi krak"), dL = lcd("desni krak");
  const table = dataTable([
    { key: "tek", label: "tekočina" },
    { key: "h", label: "globina <i>h</i> [cm]" },
    { key: "L", label: "levi [mm]" },
    { key: "D", label: "desni [mm]" },
    { key: "dh", label: "Δ<i>h</i> [mm]" },
    { key: "pm", label: "<i>p</i> = ρ<sub>v</sub><i>g</i>Δ<i>h</i> [Pa]" },
    { key: "pt", label: "ρ<i>gh</i> [Pa]" },
  ], { empty: "Še ni meritev. Spusti sondo, počakaj, da se voda v manometru umiri, in zapiši oba kraka." });
  const graph = dataGraph({ x: [0, 30], y: [0, 320], xStep: 5, yStep: 40, xLabel: "h [cm]", yLabel: "Δh [mm]", title: "Razlika višin v manometru v odvisnosti od globine sonde" });
  const calc = h("div", { class: "lab-top-calc", "aria-live": "polite" });
  const qBox = h("div");
  const meas = [];
  let enKrak = false, asked = false, tMir = 0, prej = null, puscaRekel = false, smeri = new Set();

  const tekSel = select({ label: "tekočina v posodi", options: tekOpts.filter(([id]) => id !== "etanol"), value: B.tek, onChange: (v) => ((B.tek = v), log.push(`V posodi je ${TEKOCINE[v].name}.`, "info"), draw()) });
  const hSl = slider({ label: "globina sonde", min: 0, max: MANOMETER.hMax * 100, step: 0.5, value: 0, unit: "cm", onInput: (v) => ((B.h = v / 100), draw()) });
  const smerSeg = seg("kam gleda opna", [["dol", "navzdol"], ["gor", "navzgor"], ["stran", "vstran"]], B.smer, (v) => ((B.smer = v), draw()));
  const puscaT = toggle("cevka je slabo nataknjena na sondo", false, (v) => ((B.pusca = v), (puscaRekel = false)));
  const fillBtn = button("Dvigni sondo, napolni manometer in natakni cevko", () => {
    hSl.set(0);
    B.h = 0;
    B.napolni();
    B.pusca = false;
    puscaT.set(false);
    log.push("Sonda je nad gladino, voda v manometru je v obeh krakih pri ničli, cevka dobro tesni.", "ok");
    draw();
  });
  const odcSeg = seg("odčitek", [["2", "oba kraka"], ["1", "samo desni krak"]], "2", (v) => (enKrak = v === "1"));
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const clrBtn = button("Izbriši meritve", () => (table.clear(), (meas.length = 0), redraw(), sync()));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, lL, dL)), controlsBox(
        grp("1. Posoda in sonda", hint("Sonda je lijak z gumijasto opno. Cevka vodi zrak iz lijaka do manometra (cev oblike U z vodo)."), tekSel, hSl, row("opna", smerSeg)),
        grp("2. Manometer", hint("Odčitaj, za koliko se je voda v levem kraku spustila in v desnem dvignila (skala v mm od ničle)."), row("odčitek", odcSeg), puscaT, buttons(fillBtn)),
        grp("3. Zapiši", buttons(recBtn, clrBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "Hidrostatični tlak"), graph, calc, qBox,
      notes(POENOSTAVITVE_SILE.tlak, "Hidrostatični tlak <i>p</i> = ρ <i>g</i> <i>h</i>; manometer z vodo pokaže <i>p</i> = ρ<sub>vode</sub> <i>g</i> Δ<i>h</i>, <i>g</i> = 9,81 m/s². Gostote pri 20 °C: voda 0,998 (CRC), slana voda (4 % soli) 1,027 (CRC), sončnično olje 0,92 g/cm³ (Engineering ToolBox). Ocene: opna 1 %, umirjanje 0,8 s, puščanje 15 s."),
    ],
    tryText: "Spuščaj sondo v vodo po 5 cm in vsakič zapiši razliko višin v manometru. Obrni opno navzgor in vstran: se odčitek spremeni? Ponovi v slani vodi in olju. Kaj pokaže manometer, če cevka pušča?",
  });
  el.classList.add("lab");

  function record() {
    const o = B.odcitek();
    if (B.prelito) return log.push("Voda je pljusknila iz manometra. Dvigni sondo in manometer napolni znova.", "bad");
    if (Math.abs(B.dh - B.pZrak / (MANOMETER.rho * 1000 * G_LJ)) > 0.0008) log.push("Voda v manometru se še premika. Počakaj, da se umiri.", "warn");
    const dh = enKrak ? o.desni : o.dh, h = B.h * 100, T = TEKOCINE[B.tek];
    table.add({ tek: T.name, h: fixed(h, 1), L: enKrak ? "–" : fixed(o.levi, 0), D: fixed(o.desni, 0), dh: fixed(dh, 0), pm: fixed(MANOMETER.rho * 1000 * G_SOLA * dh / 1000, 0), pt: fixed(T.rho * 1000 * G_SOLA * B.h, 0) });
    meas.push({ g: T.name, x: h, y: dh });
    smeri.add(`${B.tek}:${B.h}:${B.smer}`);
    if (enKrak && dh > 4) log.push("Odčital si le desni krak: en krak se dvigne le za polovico razlike. Δ<i>h</i> je razlika med obema krakoma, zato je tvoj odčitek dvakrat premajhen.", "warn");
    if (B.pusca) log.push("Cevka pušča: zrak uhaja, zato se gladini v manometru počasi izenačujeta in manometer kaže vse manj.", "bad");
    if ([...smeri].filter((k) => k.startsWith(`${B.tek}:${B.h}:`)).length >= 2) log.push("V isti globini, a z drugače obrnjeno opno, je odčitek enak: tlak v tekočini deluje v vse smeri enako.", "ok");
    redraw(), sync();
  }
  function sync() {
    const out = [];
    for (const [name, pts] of skupaj(meas, "g")) {
      if (!pts.some(([x]) => x > 1)) continue;
      const k = naklonSkoziIzhodisce(pts);
      out.push(`<li>${name}: ${tex(String.raw`\frac{\Delta h}{h} \approx ${fixed(k / 10, 3)}`)} → ${tex(String.raw`\rho \approx \rho_\text{vode} \cdot \frac{\Delta h}{h} = ${rez(fixed((MANOMETER.rho * k) / 10, 2), "g/cm³")}`)}</li>`);
    }
    calc.innerHTML = out.length ? `<p>Ker je v manometru voda, je ρ<sub>tek</sub> <i>h</i> = ρ<sub>vode</sub> Δ<i>h</i>:</p><ul>${out.join("")}</ul>` : "";
    if (meas.length >= 4 && !asked) {
      asked = true;
      qBox.append(conclusion({
        text: "Kaj velja za hidrostatični tlak?",
        options: [
          { t: "Narašča sorazmerno z globino in z gostoto tekočine; v isti globini deluje v vse smeri enako.", ok: true, why: "<i>p</i> = ρ <i>g</i> <i>h</i>: dvakrat globlje, dvakrat večji tlak; v olju manjši, v slani vodi večji kot v vodi. Obrnjena opna ne spremeni odčitka." },
          { t: "Navzdol pritiska močneje kot navzgor ali vstran.", ok: false, why: "Ko opno v isti globini obrneš navzgor ali vstran, manometer kaže enako. Tlak v mirujoči tekočini deluje v vse smeri enako." },
          { t: "Odvisen je od tega, koliko tekočine je v posodi, ne od globine.", ok: false, why: "Šteje le globina pod gladino. V ozki ali široki posodi je tlak v isti globini enak." },
          { t: "V globini 10 cm je tlak v vseh tekočinah enak.", ok: false, why: "V isti globini kaže manometer v olju manj kot v vodi, v slani vodi pa več: tlak je sorazmeren z gostoto tekočine." },
        ],
      }));
    }
  }
  function redraw() {
    graph.draw(serije(skupaj(meas, "g")));
  }
  ticker(el, (dt) => {
    B.step(dt);
    const o = B.odcitek();
    lL.set(B.prelito ? "" : String(o.levi), "mm", B.prelito ? "voda je pljusknila ven" : "od ničle");
    dL.set(B.prelito ? "" : (o.desni > 0 ? "+" : "") + o.desni, "mm", B.prelito ? "" : "od ničle");
    if (B.prelito && !prej) log.push("Razlika višin je večja od manometra: voda je pljusknila iz desnega kraka. Dvigni sondo in manometer napolni znova.", "bad");
    prej = B.prelito;
    tMir = B.pusca && B.dh > 0.005 ? tMir + dt : 0;
    if (tMir > 6 && !puscaRekel) (puscaRekel = true), log.push("Gladini v manometru se počasi izenačujeta, čeprav sonda miruje. Kje uhaja zrak?", "warn");
    draw();
  }, 100);

  function draw() {
    svg.replaceChildren();
    const yBot = ySurf + MANOMETER.globina * PX, vx0 = 24, vx1 = 104, xc = 64;
    s("line", { x1: 0, y1: yBot + 2, x2: 236, y2: yBot + 2, class: "lab-tit-bench" }, svg);
    s("rect", { x: vx0 + 1.5, y: ySurf, width: vx1 - vx0 - 3, height: yBot - ySurf, class: tekCls(B.tek) }, svg);
    s("path", { d: `M${vx0 - 4},${ySurf - 26} Q${vx0},${ySurf - 24} ${vx0},${ySurf - 20} V${yBot - 4} Q${vx0},${yBot} ${vx0 + 4},${yBot} H${vx1 - 4} Q${vx1},${yBot} ${vx1},${yBot - 4} V${ySurf - 26}`, class: "lab-glass" }, svg);
    // sonda: lijak s premerom 3 cm, sredina opne v globini h
    const yp = ySurf + B.h * PX, r = 12, rot = B.smer === "dol" ? 0 : B.smer === "gor" ? 180 : -90;
    const g = s("g", { transform: `translate(${xc},${yp}) rotate(${rot})` }, svg);
    s("path", { d: `M${-r},0 L-3,-14 V-22 H3 V-14 L${r},0 Z`, class: "lab-sil-funnel" }, g);
    s("line", { x1: -r, y1: 0, x2: r, y2: 0, class: "lab-sil-membrane" }, g);
    // cevka od sonde do levega kraka
    const lx = 176, rx = 216, yZero = 180, yUb = 300;
    const tip = B.smer === "dol" ? [xc, yp - 22] : B.smer === "gor" ? [xc, yp + 22] : [xc + 22, yp];
    s("path", { d: `M${tip[0]},${tip[1]} C${tip[0] + 30},${tip[1] - 10} 118,${ySurf - 40} 140,${ySurf - 40} H${lx} V${yZero - 130}`, class: `lab-sil-tube${B.pusca ? " leak" : ""}` }, svg);
    if (B.pusca) label(svg, tip[0] + 22, tip[1] - 10, "pušča", "tick small", "start");
    // manometer: kraka ±15 cm od ničle
    const dh = B.prelito ? 0 : B.dh, yL = yZero + (dh / 2) * PX, yR = yZero - (dh / 2) * PX;
    s("path", { d: `M${lx},${yL} V${yUb} A${(rx - lx) / 2},${(rx - lx) / 2} 0 0 0 ${rx},${yUb} V${yR}`, class: "lab-sil-utube-water" }, svg);
    s("path", { d: `M${lx},${yZero - 130} V${yUb} A${(rx - lx) / 2},${(rx - lx) / 2} 0 0 0 ${rx},${yUb} V${yZero - 130}`, class: "lab-sil-utube" }, svg);
    s("rect", { x: lx + 7, y: yZero - 124, width: rx - lx - 14, height: 248, rx: 2, class: "lab-sil-ruler" }, svg);
    for (let c = -15; c <= 15; c++) {
      const y = yZero - c * 8;
      s("line", { x1: lx + 7, y1: y, x2: lx + (c % 5 ? 12 : 16), y2: y, class: "lab-sil-tick" }, svg);
      if (c % 5 === 0) label(svg, (lx + rx) / 2 + 2, y, String(Math.abs(c)), "tick small");
    }
    label(svg, (lx + rx) / 2, yZero - 138, "cm", "tick small");
    // povečava obeh krakov
    const o = B.odcitek();
    for (const [i, nm, yv, val] of [[0, "levi krak", -dh / 2, o.levi], [1, "desni krak", dh / 2, o.desni]]) {
      const y0 = 24 + i * 140;
      lupa(svg, { x: 262, y: y0, w: 128, h: 106, v: yv * 1000, ppu: 6, korak: 1, vsak: 10, napis: (u) => `${u}`, dol: false }, (g, yc) => {
        s("path", { d: `M322,${yc - 4} Q352,${yc + 4} 382,${yc - 4} V${y0 + 110} H322 Z`, class: "lab-sil-tek lab-sil-voda" }, g);
        s("path", { d: `M322,${y0 - 2} V${y0 + 110} M382,${y0 - 2} V${y0 + 110}`, class: "lab-sil-utube" }, g);
      });
      label(svg, 326, y0 + 120, `${nm}: ${B.prelito ? "–" : `${val > 0 ? "+" : ""}${val}`.replace("-", "−")}${nb}mm`, "tick b");
    }
    merilo(svg, 120, H - 16, 40, "5 cm");
    svg.setAttribute("aria-label", `Sonda v globini ${fixed(B.h * 100, 1)} cm (${TEKOCINE[B.tek].name}), opna gleda ${B.smer === "dol" ? "navzdol" : B.smer === "gor" ? "navzgor" : "vstran"}. Manometer: levi krak ${o.levi} mm, desni ${o.desni} mm.`);
  }
  draw();
}
