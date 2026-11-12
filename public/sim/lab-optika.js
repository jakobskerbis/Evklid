// Virtualni laboratorij, optika: optični disk z laserjem (lab-lom) in optična klop z zbiralno lečo (lab-leca).
// Modeli: lab-model-optika.js (brez DOM). Optika ne potrebuje ure: risba se nariše ob vsaki spremembi.
import { h, s, svgBox, slider, select, segmented, button, toggle, layout, label, stage as stageBox, controls as controlsBox } from "./kit.js";
import { lcd, dataTable, dataGraph, conclusion, eventLog, notes, fixed, tex, en, rez } from "./lab.js";
import { LomBench, LecaBench, SNOVI, DISK, KLOP, LECE, N_ZRAK, mejniKot, naklon, fIzMeritev, slika, POENOSTAVITVE_OPTIKA } from "./lab-model-optika.js";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const RAD = Math.PI / 180;
const NB = " ";
const grp = (title, ...kids) => h("fieldset", { class: "lab-tit-grp" }, h("legend", {}, title), ...kids);
const buttons = (...k) => h("div", { class: "demo-buttons" }, ...k);
const row = (lab, ...kids) => h("div", { class: "lab-row" }, h("span", { class: "demo-slider-label" }, lab), ...kids);
const seg = (name, options, value, onChange) => {
  const x = segmented({ options, value, onChange });
  x.setAttribute("aria-label", name);
  return x;
};
const hint = (text) => h("p", { class: "lab-tit-hint", html: text });
const kot = (x, d = 1) => (x == null ? "–" : `${fixed(x, d)}${NB}°`);
// Svetlost žarka na risbi: šibek odbiti žarek (4 %) je še viden, a bled.
const svetlost = (I) => clamp(0.12 + 0.88 * Math.sqrt(I), 0.12, 1).toFixed(2);
const RAZREDI = ["a", "b", "c"];

// ================================================================ optični disk: odboj, lom, popolni odboj
export function labLom(el) {
  const B = new LomBench({ seed: (Math.random() * 2 ** 31) | 0 });
  const W = 400, H = 400, cx = 200, cy = 200, k = 160 / DISK.Rs; // 1 mm = 1,33 px
  const svg = svgBox(W, H, "lab-bench lab-opt lab-opt-disk");
  const log = eventLog();
  const aL = lcd("vpadni kot α"), rL = lcd("odbojni kot"), bL = lcd("lomni kot β");
  const table = dataTable([
    { key: "snov", label: "snov, smer" },
    { key: "a", label: "α" },
    { key: "r", label: "odbojni" },
    { key: "b", label: "β" },
    { key: "sa", label: "sin α" },
    { key: "sb", label: "sin β" },
  ], { empty: "Še ni meritev. Vklopi laser, nastavi vpadni kot, odčitaj odbojni in lomni kot in pritisni »Zapiši meritev«." });
  const graph = dataGraph({ x: [0, 1], y: [0, 1], xStep: 0.2, yStep: 0.2, xLabel: "sin α", yLabel: "sin β", title: "sin β v odvisnosti od sin α" });
  const calc = h("div", { class: "lab-top-calc", "aria-live": "polite" });
  const qBox = h("div");
  const serije = new Map(); // ključ snov:smer → { pts, ... }
  let odPloskve = false, cur = null, asked = false, rekliTIR = false;

  const snovSel = select({ label: "snov na disku", options: Object.entries(SNOVI).map(([k2, v]) => [k2, v.name]), value: B.snov, onChange: (v) => ((B.snov = v), (smerRow.hidden = !SNOVI[v].n), change()) });
  const smerSeg = seg("smer svetlobe", [["zrak", "iz zraka v snov"], ["snov", "iz snovi v zrak"]], B.smer, (v) => ((B.smer = v), change()));
  const smerRow = row("smer svetlobe", smerSeg);
  const laserT = toggle("laser vklopljen", false, (v) => {
    B.laser = v;
    if (v) log.push("Laser je vklopljen. <b>Nikoli ne glej v žarek</b> in ga ne usmeri v oči sošolcev, tudi ne prek zrcala.", "warn");
    change();
  });
  const aSl = slider({ label: "vpadni kot α (zasuk diska)", min: 0, max: 89, step: 1, value: 30, format: (v) => `${v}${NB}°`, onInput: (v) => (B.nastavi(v), change()) });
  const zSl = slider({ label: "zamik laserja od središča", min: 0, max: 5, step: 0.5, value: 0, unit: "mm", onInput: (v) => ((B.zamik = v), change()) });
  const odSeg = seg("kot merim od", [["normala", "vpadne pravokotnice"], ["ploskev", "ploskve"]], "normala", (v) => ((odPloskve = v === "ploskev"), change()));
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const clrBtn = button("Pobriši meritve", () => clear());

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, aL, rL, bL)), controlsBox(
        grp("1. Pripomočki", snovSel, smerRow),
        grp("2. Laser", hint(`Rdeči laser 650${NB}nm (razred 2): <b>nikoli ne glej v žarek</b>. Žarek naj gre skozi <b>središče</b> diska, kjer je sredina ravne ploskve.`), laserT, aSl, zSl),
        grp("3. Merjenje", hint("Kote meriš od <b>vpadne pravokotnice</b> (črtkana črta skozi središče). Skala ima razdelke po 1°; odčitaš na pol stopinje natančno."), row("kot merim od", odSeg), buttons(recBtn, clrBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table, calc,
      h("h4", { class: "lab-h" }, "Graf: sin β v odvisnosti od sin α"), graph, qBox,
      notes(POENOSTAVITVE_OPTIKA.lom, `Snellov zakon ${tex(String.raw`n_1\sin\alpha = n_2\sin\beta`)}; odbojni zakon: odbojni kot = vpadni kot. Lomni količniki pri 650${NB}nm: akril (PMMA) 1,488 (Sultanova in sod. 2009), steklo N-BK7 1,515 (Schott), voda 1,331 (Daimon in Masumura 2007), zrak 1,0003 (Ciddor 1996), vsi z refractiveindex.info. Delež odbite svetlobe: Fresnelove enačbe, pri pravokotnem vpadu ${tex(String.raw`\left(\frac{n - 1}{n + 1}\right)^2 = 3{,}8${en("%")}`)} za akril. Ocene: velikost diska in polvalja, odbojnost zrcala, natančnost odčitka.`),
    ],
    tryText: "Izberi akrilni polvalj in izmeri lomni kot pri vpadnih kotih 10°, 20° … 80°. Iz naklona grafa izračunaj lomni količnik. Nato obrni smer (iz snovi v zrak) in poišči kot, pri katerem lomljeni žarek izgine.",
  });
  el.classList.add("lab");

  function change() {
    cur = B.laser ? B.odcitaj({ odPloskve }) : null;
    if (cur?.popolni && B.smer === "snov" && !rekliTIR) {
      rekliTIR = true;
      log.push(`<b>Popolni odboj:</b> lomljenega žarka ni več, vsa svetloba se odbije nazaj v snov. Mejni kot za ${SNOVI[B.snov].kratko} je okoli ${fixed(mejniKot(SNOVI[B.snov].n), 1)}${NB}°.`, "info");
    }
    meters();
    draw();
  }
  function meters() {
    const lab = odPloskve ? "od ploskve" : "od pravokotnice";
    aL.set(B.laser ? fixed(cur.alfa, 0) : "", "°", B.laser ? lab : "laser je izklopljen");
    rL.set(cur ? fixed(cur.odboj, 1) : "", "°", cur ? `${Math.round(cur.Iodboj * 100)}${NB}% svetlobe` : "");
    const zrc = !SNOVI[B.snov].n;
    bL.set(cur && cur.lom != null ? fixed(cur.lom, 1) : "", "°", !cur ? "" : zrc ? "zrcalo ne lomi" : cur.popolni ? "popolni odboj" : `${Math.round(cur.Ilom * 100)}${NB}% svetlobe`);
  }
  function record() {
    if (!B.laser) return log.push("Najprej vklopi laser.", "warn");
    const S = SNOVI[B.snov], smer = S.n ? B.smer : "zrak";
    const key = `${B.snov}:${smer}`;
    const name = S.n ? (smer === "zrak" ? `zrak → ${S.kratko}` : `${S.kratko} → zrak`) : "zrcalo";
    const sa = Math.sin(cur.alfa * RAD), sb = cur.lom != null ? Math.sin(cur.lom * RAD) : null;
    table.add({ snov: name, a: kot(cur.alfa, 0), r: kot(cur.odboj), b: !S.n ? "–" : cur.popolni ? "popolni odboj" : kot(cur.lom), sa: fixed(sa, 3), sb: sb == null ? "–" : fixed(sb, 3) });
    if (odPloskve) log.push("Kote si meril od ploskve. Vpadni, odbojni in lomni kot merimo od <b>vpadne pravokotnice</b>, sicer Snellov zakon ne velja.", "bad");
    if (B.zamik > 0) log.push(`Laser je ${fixed(B.zamik, 1)}${NB}mm mimo središča: žarek ne zadene sredine ravne ploskve, zato se lomi še na okrogli ploskvi in odčitek je napačen. Zamik nastavi na 0.`, "bad");
    if (S.n && sb != null) {
      if (!serije.has(key)) serije.set(key, { name, smer, n: S.n, pts: [] });
      serije.get(key).pts.push([sa, sb]);
    }
    if (!S.n && Math.abs(cur.odboj - cur.alfa) <= 0.5) log.push("Odbojni kot je enak vpadnemu (v okviru napake odčitka ±0,5°).", "ok");
    sync();
    if (!asked && [...serije.values()].some((x) => x.smer === "zrak" && x.pts.length >= 4)) {
      asked = true;
      qBox.append(conclusion({
        text: "Kaj velja, ko svetloba preide iz zraka v akril, steklo ali vodo?",
        options: [
          { t: "Lomni kot je manjši od vpadnega, razmerje sin α / sin β pa je pri vseh kotih enako (lomni količnik).", ok: true, why: "Točke na grafu sin β od sin α ležijo na premici skozi izhodišče. Njen naklon je 1/<i>n</i>; za akril je okoli 0,67, torej <i>n</i> ≈ 1,49. Žarek se v snovi z večjim lomnim količnikom lomi <b>k</b> vpadni pravokotnici." },
          { t: "Lomni kot je vedno za enako število stopinj manjši od vpadnega.", ok: false, why: "Pri 10° je razlika za akril le ~3°, pri 60° pa ~25°. Stalno je razmerje sinusov, ne razlika kotov." },
          { t: "Razmerje α/β je pri vseh kotih enako.", ok: false, why: "Pri majhnih kotih je skoraj res (sin α ≈ α), pri velikih ne: pri 80° je α/β za akril ~1,9, pri 10° pa ~1,5." },
          { t: "Vsa svetloba gre v snov, nič se je ne odbije.", ok: false, why: `Šibek odbiti žarek vidiš na disku: pri pravokotnem vpadu se od akrila odbije ~4${NB}% svetlobe, pri velikih vpadnih kotih precej več.` },
        ],
      }));
    }
  }
  function sync() {
    const out = [];
    for (const x of serije.values()) {
      if (x.pts.length < 2) continue;
      const kk = naklon(x.pts), n = x.smer === "zrak" ? 1 / kk : kk;
      out.push(`<p>${x.name}: naklon ${tex(String.raw`\frac{\sin\beta}{\sin\alpha} = ${fixed(kk, 3)}`)} → ${tex(String.raw`n = ${x.smer === "zrak" ? String.raw`\frac{1}{${fixed(kk, 3)}} = ` : ""}${rez(fixed(n, 2))}`)} (iz ${x.pts.length} meritev).</p>`);
    }
    calc.innerHTML = out.join("") + (out.length ? `<p class="muted">Iz zraka v snov je naklon 1/<i>n</i>, iz snovi v zrak pa <i>n</i>.</p>` : "");
    graph.draw([...serije.values()].map((x, i) => {
      const kk = x.pts.length >= 2 ? naklon(x.pts) : null;
      return { id: x.name, pts: [...x.pts], cls: RAZREDI[i % 3], shape: i % 2 ? "^" : "o", label: x.name, line: kk ? (xx) => kk * xx : undefined };
    }));
  }
  function clear() {
    table.clear();
    serije.clear();
    sync();
  }

  // ---------------------------------------------------------------- risba (1 mm = 1,33 px)
  const P = ([x, y]) => [cx + x * k, cy - y * k];
  function draw() {
    svg.replaceChildren();
    const S = SNOVI[B.snov], Rs = DISK.Rs * k;
    s("circle", { cx, cy, r: Rs + 14, class: "lab-opt-disc" }, svg);
    // skala: razdelki po 1°, daljši po 5° in 10°, številke 0–90 v vsaki četrtini (od pravokotnice)
    for (let d = 0; d < 360; d++) {
      const L = d % 10 === 0 ? 10 : d % 5 === 0 ? 6 : 3.5, a = d * RAD;
      const sx = Math.sin(a), sy = -Math.cos(a);
      s("line", { x1: cx + sx * Rs, y1: cy + sy * Rs, x2: cx + sx * (Rs + L), y2: cy + sy * (Rs + L), class: `lab-opt-tick${d % 10 === 0 ? " big" : ""}` }, svg);
      if (d % 10 === 0) {
        const v = d <= 90 ? d : d <= 180 ? 180 - d : d <= 270 ? d - 180 : 360 - d;
        label(svg, cx + sx * (Rs - 11), cy + sy * (Rs - 11) + 4, String(v), "tick small lab-opt-num");
      }
    }
    // vpadna pravokotnica in ploskev
    s("line", { x1: cx, y1: cy - Rs, x2: cx, y2: cy + Rs, class: "lab-opt-normal" }, svg);
    s("line", { x1: cx - Rs, y1: cy, x2: cx + Rs, y2: cy, class: "lab-opt-axis" }, svg);
    const R = (S.n ? DISK.R : DISK.Rz) * k;
    if (S.n) s("path", { d: `M${cx - R},${cy} A${R},${R} 0 0 0 ${cx + R},${cy} Z`, class: `lab-opt-block ${B.snov}` }, svg);
    else {
      s("rect", { x: cx - R, y: cy, width: 2 * R, height: 5, class: "lab-opt-mirror-back" }, svg);
      s("line", { x1: cx - R, y1: cy, x2: cx + R, y2: cy, class: "lab-opt-mirror" }, svg);
    }
    // laser
    const T = B.sledi(), u = T.u, p0 = P(T.p0), ang = Math.atan2(-u[1], u[0]) / RAD;
    // ohišje laserja zunaj diska (za skalo), da ne prekrije številk in razdelkov; žarek do roba diska nariše spodnja črta
    const off = Rs + 15 - 160, tr = `translate(${p0[0].toFixed(1)},${p0[1].toFixed(1)}) rotate(${(-ang).toFixed(2)})`;
    if (B.laser) s("line", { x1: -off, y1: 0, x2: 0, y2: 0, class: "lab-opt-ray", transform: tr }, svg);
    s("rect", { x: -off - 24, y: -6, width: 24, height: 12, rx: 3, class: `lab-opt-laser${B.laser ? " on" : ""}`, transform: `translate(${p0[0].toFixed(1)},${p0[1].toFixed(1)}) rotate(${(-ang).toFixed(2)})` }, svg);
    if (B.laser) {
      for (const o of T.odseki) {
        const [x1, y1] = P(o.p0), [x2, y2] = P(o.p1);
        s("line", { x1, y1, x2, y2, class: "lab-opt-ray", "stroke-opacity": svetlost(o.I) }, svg);
      }
      for (const z of T.zadetki) {
        const [x1, y1] = P([z.x, z.y]);
        s("circle", { cx: x1, cy: y1, r: 4, class: "lab-opt-spot", "fill-opacity": svetlost(z.I) }, svg);
      }
    }
    s("text", { x: 0, y: 0, class: "tick small lab-opt-lbl", "text-anchor": "middle", transform: `translate(${cx - 5},${cy - Rs / 2 - 10}) rotate(-90)` }, svg, "vpadna pravokotnica");
    label(svg, W - 6, H - 6, S.n ? `${S.kratko}, n = ${fixed(S.n, 3)}` : "ravno zrcalo", "tick small", "end");
    const yb = H - 10;
    s("path", { d: `M8,${yb - 4} V${yb} H${8 + 20 * k} V${yb - 4}`, class: "lab-scale" }, svg);
    label(svg, 8 + 10 * k, yb - 7, "2 cm", "tick small");
    const zr = !S.n, smer = zr ? "zrak" : B.smer;
    svg.setAttribute("aria-label", `Optični disk s skalo po 1°. ${S.name}${zr ? "" : smer === "zrak" ? ", svetloba iz zraka v snov" : ", svetloba iz snovi v zrak"}. ${B.laser ? `Vpadni kot ${B.alfa}°${cur?.popolni ? ", popolni odboj" : ""}.` : "Laser je izklopljen."}`);
  }
  change();
  sync();
}

// ================================================================ optična klop: zbiralna leča
export function labLeca(el) {
  const B = new LecaBench({ seed: (Math.random() * 2 ** 31) | 0 });
  const W = 400, H = 322, x0 = 12, kx = (W - 2 * x0) / KLOP.L; // tračnica: 1 mm = 0,376 px
  const yA = 70; // optična os na risbi klopi
  const svg = svgBox(W, H, "lab-bench lab-opt lab-opt-klop");
  const fid = `${svg.uid}-blur`;
  const log = eventLog();
  const pL = lcd("predmet"), lL = lcd("leča"), zL = lcd("zaslon");
  const table = dataTable([
    { key: "f", label: "leča" },
    { key: "a", label: "<i>a</i> [mm]" },
    { key: "b", label: "<i>b</i> [mm]" },
    { key: "y", label: "slika [mm]" },
    { key: "ia", label: "1/<i>a</i> [m⁻¹]" },
    { key: "ib", label: "1/<i>b</i> [m⁻¹]" },
  ], { empty: "Še ni meritev. Postavi predmet, lečo in zaslon, poišči ostro sliko in pritisni »Zapiši meritev«." });
  const graph = dataGraph({ x: [0, 25], y: [0, 25], xStep: 5, yStep: 5, xLabel: "1/a [m⁻¹]", yLabel: "1/b [m⁻¹]", title: "1/b v odvisnosti od 1/a" });
  const calc = h("div", { class: "lab-top-calc", "aria-live": "polite" });
  const qBox = h("div");
  const meritve = new Map(); // f → [{ a, b }]
  let od = "leca", fino = "Z", lupa = false, asked = false;

  const fSeg = seg("zbiralna leča", LECE.map((f) => [String(f), `f = ${f}${NB}mm`]), String(B.f), (v) => ((B.f = +v), (lupa = false), draw()));
  const mk = (kaj, lab) => slider({ label: lab, min: 0, max: KLOP.L, step: 1, value: B[`x${kaj}`], unit: "mm", onInput: (v) => move(kaj, v) });
  const pSl = mk("P", "predmet (svetleča puščica)"), lSl = mk("L", "leča"), zSl = mk("Z", "zaslon");
  const sl = { P: pSl, L: lSl, Z: zSl };
  const finoSeg = seg("fino premikanje", [["L", "leča"], ["Z", "zaslon"]], fino, (v) => (fino = v));
  const korak = (d) => {
    const b = button(`${d > 0 ? "+" : "−"}${Math.abs(d)}`, () => move(fino, B[`x${fino}`] + d));
    b.setAttribute("aria-label", `${d > 0 ? "naprej" : "nazaj"} za ${Math.abs(d)} mm`);
    return b;
  };
  const odSel = select({ label: "a in b merim", options: [["leca", "od sredine leče"], ["konec", "od začetka tračnice (0 mm)"]], value: od, onChange: (v) => (od = v) });
  const lupaBtn = button("Poglej skozi lečo", () => ((lupa = true), lookThrough(), draw()));
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const clrBtn = button("Pobriši meritve", () => clear());

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, pL, lL, zL)), controlsBox(
        grp("1. Leča", row("goriščna razdalja (napisana)", fSeg)),
        grp("2. Lege na optični klopi", hint(`Predmet je svetleča puščica (2${NB}cm). Premikaj lečo ali zaslon, dokler slika na zaslonu ni ostra. Na tračnici so predmeti v pravem merilu in zato majhni; sliko na zaslonu vidiš povečano spodaj desno.`), pSl, lSl, zSl, row("fino premikanje (mm)", finoSeg), buttons(korak(-5), korak(-1), korak(1), korak(5))),
        grp("3. Merjenje", odSel, buttons(recBtn, lupaBtn, clrBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table, calc,
      h("h4", { class: "lab-h" }, "Graf: 1/b v odvisnosti od 1/a"), graph, qBox,
      notes(POENOSTAVITVE_OPTIKA.leca, `Enačba leče ${tex(String.raw`\frac{1}{a} + \frac{1}{b} = \frac{1}{f}`)}, povečava ${tex(String.raw`M = -\frac{b}{a}`)} (minus: slika je obrnjena). Ostra slika na zaslonu obstaja le, če je zaslon od predmeta oddaljen vsaj 4<i>f</i>. Ocene: odstopanje leče ±2${NB}%, odprtina 30${NB}mm, meja ostrine 0,5${NB}mm, zamik sredine leče od oznake ±1${NB}mm.`),
    ],
    tryText: "Z lečo f = 100 mm postavi predmet 200 mm pred lečo in poišči ostro sliko. Kje je in kako velika je? Nato zapiši vsaj pet meritev pri različnih a in iz grafa 1/b od 1/a določi goriščno razdaljo. Kaj vidiš, ko je predmet bližje kot f?",
  });
  el.classList.add("lab");

  function move(kaj, v) {
    const x = B.premakni(kaj, v);
    sl[kaj].set(x, true);
    lupa = false;
    draw();
  }
  function lookThrough() {
    const S = B.stanje();
    if (S.realna) log.push("Skozi lečo vidiš od daleč majhno obrnjeno sliko. Ko je predmet dlje od gorišča, je slika realna: ujameš jo na zaslon.", "info");
    else if (!isFinite(S.b)) log.push("Predmet je točno v gorišču: žarki gredo za lečo vzporedno, slike ni ne na zaslonu ne v leči.", "info");
    else log.push(`Predmet je bližje kot <i>f</i>: skozi lečo vidiš <b>pokončno, povečano navidezno sliko</b> (${fixed(S.M, 1)}-krat), ${Math.round(-S.b)}${NB}mm za lečo na strani predmeta. Tako deluje lupa. Na zaslon je ne ujameš.`, "ok");
  }
  function record() {
    const S = B.stanje(), f = B.f;
    if (!S.viden) return log.push(`Na zaslonu ni slike, le lisa svetlobe: predmet je ${S.a < f ? "bližje kot" : "v"} goriščni razdalji (${f}${NB}mm). Pritisni »Poglej skozi lečo«.`, "bad");
    if (!S.ostro) {
      if (S.L < 4 * B.fPravi[f] - 2) return log.push(`Zaslon je preblizu predmetu: razdalja predmet–zaslon je ${S.L}${NB}mm, manj kot 4<i>f</i> = ${4 * f}${NB}mm. Tu leča nikjer ne da ostre slike; odmakni zaslon.`, "bad");
      return log.push("Slika ni ostra. Premikaj zaslon (ali lečo) po milimetrih, dokler robovi puščice niso ostri.", "warn");
    }
    const r = B.odcitaj({ od });
    table.add({ f: `${f}${NB}mm`, a: String(r.a), b: String(r.b), y: `${fixed(r.y, 1)}, ${r.obrnjena ? "obrnjena" : "pokončna"}`, ia: fixed(1000 / r.a, 2), ib: fixed(1000 / r.b, 2) });
    if (od === "konec") log.push(`<i>a</i> in <i>b</i> si odčital od začetka tračnice. Razdalje merimo od <b>sredine leče</b>: <i>a</i> = ${r.xL} − ${r.xP}${NB}mm, <i>b</i> = ${r.xZ} − ${r.xL}${NB}mm.`, "bad");
    else if (Math.abs(r.a - r.b) <= 5) log.push(`<i>a</i> ≈ <i>b</i>: predmet je v dvojni goriščni razdalji, slika je enako velika (${fixed(r.y, 1)}${NB}mm) in obrnjena.`, "ok");
    if (!meritve.has(f)) meritve.set(f, []);
    meritve.get(f).push({ a: r.a, b: r.b });
    sync();
    if (!asked && [...meritve.values()].some((m) => m.length >= 3)) {
      asked = true;
      qBox.append(conclusion({
        text: "Kaj pove graf 1/<i>b</i> v odvisnosti od 1/<i>a</i>?",
        options: [
          { t: "Točke ležijo na premici z naklonom −1, ki seka obe osi pri 1/<i>f</i>: velja 1/<i>a</i> + 1/<i>b</i> = 1/<i>f</i>.", ok: true, why: `Za vsako meritev je vsota 1/<i>a</i> + 1/<i>b</i> skoraj enaka. Za lečo z <i>f</i> = 100${NB}mm je 10${NB}m⁻¹ (to je tudi njena lomnost v dioptrijah). Točke so malo raztresene, ker je slika ostra v nekaj milimetrov širokem območju lege zaslona.` },
          { t: "Razdalja slike <i>b</i> je sorazmerna z razdaljo predmeta <i>a</i>.", ok: false, why: "Ko predmet odmikaš, se slika <i>približuje</i> leči in gre proti gorišču. Če bi bila sorazmerna, bi točke v grafu 1/<i>b</i> od 1/<i>a</i> ležale na premici skozi izhodišče s pozitivnim naklonom." },
          { t: "Slika je vedno v gorišču leče.", ok: false, why: "V gorišču je slika le zelo oddaljenega predmeta (1/<i>a</i> ≈ 0). Pri <i>a</i> = 2<i>f</i> je na primer slika pri <i>b</i> = 2<i>f</i>." },
          { t: "Ostro sliko dobiš pri vsaki legi predmeta, le zaslon moraš dovolj odmakniti.", ok: false, why: "Če je predmet bližje kot <i>f</i>, je slika navidezna (lupa) in je na zaslonu nikoli ne ujameš." },
        ],
      }));
    }
  }
  function sync() {
    const out = [];
    let i = 0;
    const ser = [];
    for (const [f, rows] of meritve) {
      const fm = fIzMeritev(rows), cls = RAZREDI[i % 3];
      out.push(`<p>Leča ${f}${NB}mm: iz ${rows.length} ${rows.length === 1 ? "meritve" : "meritev"} ${tex(String.raw`f = \text{povprečje } \frac{ab}{a + b} = ${rez(fixed(fm, 1), "mm")}`)}, ${tex(String.raw`\frac{1}{f} = ${fixed(1000 / fm, 2)}${en("m⁻¹")}`)}.</p>`);
      ser.push({ id: `f${f}`, pts: rows.map((r) => [1000 / r.a, 1000 / r.b]), cls, shape: i % 2 ? "^" : "o", label: `f = ${f}${NB}mm`, line: (x) => 1000 / fm - x });
      i++;
    }
    const top = Math.max(25, ...[...meritve.keys()].map((f) => Math.ceil((1000 / f + 1) / 5) * 5));
    graph.setAxes({ x: [0, top], y: [0, top], xStep: top > 25 ? 10 : 5, yStep: top > 25 ? 10 : 5 });
    graph.draw(ser);
    calc.innerHTML = out.join("");
  }
  function clear() {
    table.clear();
    meritve.clear();
    sync();
  }

  // ---------------------------------------------------------------- risba: klop (1 mm = 0,376 px) in pogled na zaslon (1 mm = 1,6 px)
  function draw() {
    svg.replaceChildren();
    const S = B.stanje(), X = (x) => x0 + x * kx, Y = (y) => yA - y * kx;
    // tračnica z mm skalo (razdelki po 1 cm, številke po 10 cm)
    s("rect", { x: x0 - 4, y: yA + 34, width: KLOP.L * kx + 8, height: 14, rx: 2, class: "lab-opt-rail" }, svg);
    for (let c = 0; c <= 100; c++) {
      const L = c % 10 === 0 ? 7 : c % 5 === 0 ? 5 : 3;
      s("line", { x1: X(c * 10), y1: yA + 34, x2: X(c * 10), y2: yA + 34 + L, class: "lab-opt-tick" }, svg);
      if (c % 10 === 0) label(svg, X(c * 10), yA + 60, String(c), "tick small");
    }
    label(svg, W - x0, yA + 74, "cm", "tick small", "end");
    s("line", { x1: x0, y1: yA, x2: W - x0, y2: yA, class: "lab-opt-axisline" }, svg);
    // jahači
    for (const x of [B.xP, B.xL, B.xZ]) s("rect", { x: X(x) - 4, y: yA + 24, width: 8, height: 12, class: "lab-opt-rider" }, svg);
    const xp = B.xP + B.dP, xl = B.xL + B.dL;
    s("line", { x1: X(xp), y1: yA, x2: X(xp), y2: yA + 24, class: "lab-opt-post" }, svg);
    s("path", { d: `M${X(xp) - 5},${yA + 2} h10 v8 h-10 z`, class: "lab-opt-led" }, svg);
    s("path", { d: `M${X(xp)},${yA} V${Y(KLOP.h)} m-3,4 l3,-4 l3,4`, class: "lab-opt-arrow" }, svg);
    s("line", { x1: X(xl), y1: Y(-KLOP.D / 2 - 6), x2: X(xl), y2: yA + 24, class: "lab-opt-post" }, svg);
    s("ellipse", { cx: X(xl), cy: yA, rx: 3, ry: (KLOP.D / 2 + 5) * kx, class: "lab-opt-lens" }, svg);
    s("rect", { x: X(B.xZ) - 2, y: Y(50), width: 4, height: 100 * kx, class: "lab-opt-screen" }, svg);
    s("line", { x1: X(B.xZ), y1: Y(-50), x2: X(B.xZ), y2: yA + 24, class: "lab-opt-post" }, svg);
    // žarki iz konice puščice: skozi sredino in skozi oba roba leče do zaslona
    const tip = [xp, KLOP.h], zs = B.xZ;
    const yScreen = (yl) => {
      // žarek iz konice skozi točko leče na višini yl; po leči proti točki slike (ali od navidezne slike)
      if (!isFinite(S.b)) { const sl0 = (yl - KLOP.h) / S.a - yl / S.f; return yl + sl0 * S.s; }
      const yi = KLOP.h * S.M; // višina slike (negativna = obrnjena)
      return yl + ((yi - yl) / S.b) * S.s;
    };
    for (const yl of [KLOP.D / 2, 0, -KLOP.D / 2]) {
      s("polyline", { points: `${X(tip[0])},${Y(tip[1])} ${X(xl)},${Y(yl)} ${X(zs)},${Y(clamp(yScreen(yl), -60, 60))}`, class: "lab-opt-beam" }, svg);
    }
    // oznake
    label(svg, X(B.xP), yA - 22 - KLOP.h * kx, "predmet", "tick small");
    label(svg, X(B.xL), Y(KLOP.D / 2 + 9), "leča", "tick small");
    label(svg, X(B.xZ), Y(54), "zaslon", "tick small");

    // pogled na zaslon (bel zaslon 100 mm × 90 mm), 1 mm = 1,6 px
    const kz = 1.6, zx = 220, zy = 162, zw = 100 * kz, zh = 90 * kz, ox = zx + zw / 2, oy = zy + 18 + 40 * kz;
    label(svg, zx + zw / 2, zy - 4, "pogled na zaslon (povečano)", "tick small");
    s("rect", { x: zx, y: zy, width: zw, height: zh, rx: 3, class: "lab-opt-screenview" }, svg);
    const defs = s("defs", {}, svg), flt = s("filter", { id: fid, x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs);
    // krog nejasnosti c (premer) → standardni odklon zamegljenosti ~c/4; v meji ostrine ga oko ne opazi
    const sd = Math.max(0, S.c - B.cMeja * 0.8) * kz * 0.35;
    s("feGaussianBlur", { stdDeviation: Math.min(sd, 30).toFixed(2) }, flt);
    const clip = s("clipPath", { id: `${fid}-z` }, defs);
    s("rect", { x: zx, y: zy, width: zw, height: zh, rx: 3 }, clip);
    const g = s("g", { "clip-path": `url(#${fid}-z)` }, svg);
    const op = clamp(1.4 / (1 + S.c / 3), 0.06, 1);
    const yi = clamp(S.y, -80, 80) * kz, ht = yi < 0 ? 6 : -6;
    const img = s("g", { filter: sd > 0.05 ? `url(#${fid})` : undefined, opacity: op.toFixed(2) }, g);
    s("path", { d: `M${ox},${oy} V${oy - yi} m-5,${ht} l5,${-ht} l5,${ht}`, class: "lab-opt-image" }, img);
    if (S.c > 2) s("circle", { cx: ox, cy: oy - yi / 2, r: clamp((S.c * kz) / 2, 3, zh / 2), class: "lab-opt-patch", opacity: clamp(0.5 / (1 + S.c / 20), 0.08, 0.4).toFixed(2) }, g);
    s("path", { d: `M${zx + 8},${zy + zh - 8} h${10 * kz}`, class: "lab-scale" }, svg);
    label(svg, zx + 8, zy + zh - 12, "1 cm", "tick small lab-opt-ink", "start");
    label(svg, zx + zw - 6, zy + zh - 8, S.ostro ? "ostra" : S.c < 3 ? "skoraj ostra" : "zamegljena", `tick small lab-opt-ink${S.ostro ? " lab-opt-sharp" : ""}`, "end");

    // levo spodaj: pogled skozi lečo (lupa) ali kratka razlaga
    const lx = 14, ly = 162;
    if (lupa && !S.realna && isFinite(S.b)) {
      label(svg, lx + 90, ly - 4, "pogled skozi lečo", "tick small");
      s("rect", { x: lx, y: ly, width: 180, height: zh, rx: 90, class: "lab-opt-loupe" }, svg);
      const hh = clamp(KLOP.h * S.M * 1.2, 0, zh - 30);
      s("path", { d: `M${lx + 90},${ly + zh - 18} V${ly + zh - 18 - hh} m-6,8 l6,-8 l6,8`, class: "lab-opt-image" }, svg);
      label(svg, lx + 90, ly + zh + 13, `pokončna, ${fixed(S.M, 1)}-krat večja`, "tick small");
    }
    label(svg, W - x0, 12, "tračnica 1 m, skala v cm", "tick small", "end");

    pL.set(String(B.xP), "mm", "na tračnici");
    lL.set(String(B.xL), "mm", `f = ${B.f}${NB}mm`);
    zL.set(String(B.xZ), "mm", S.ostro ? "slika ostra" : "");
    svg.setAttribute("aria-label", `Optična klop 1 m: predmet pri ${B.xP} mm, leča f = ${B.f} mm pri ${B.xL} mm, zaslon pri ${B.xZ} mm. Slika na zaslonu je ${S.ostro ? "ostra" : "zamegljena"}.`);
  }
  draw();
  sync();
}

export { N_ZRAK, slika };
