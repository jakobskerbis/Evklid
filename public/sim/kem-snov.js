// Simulacije pri kemiji: snovi in zmesi, varnost, atom, periodni sistem, vezi, formule, medmolekulske sile, oksidacijska števila.
import { h, s, svgBox, slider, select, segmented, toggle, button, buttons, readout, layout, tex, texBlock, fmt, clamp, label, animate, playButton, axes, lcm } from "./kit.js";
import { ELEMENTS, BY_SYM, groupOf, periodOf, configText, shells, shellsOS, sub, texF, atomBall, drawMolecule, heat } from "./kem-skupno.js";

const shuffle = (a) => {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ------------------------------------------------------------ razvrsti: varnostni znaki, snovi in zmesi, kovine in nekovine
const GHS = [
  ["GHS01", "eksplozivno", "Snov lahko eksplodira ob udarcu, trenju, iskri ali segrevanju.", "ognjemet, smodnik"],
  ["GHS02", "vnetljivo", "Snov se zlahka vžge, njeni hlapi lahko gorijo že ob iskri.", "bencin, etanol (špirit), aceton"],
  ["GHS03", "oksidativno", "Snov oddaja kisik in pospešuje gorenje drugih snovi.", "kalijev permanganat, kalijev nitrat"],
  ["GHS04", "plin pod tlakom", "Jeklenka s stisnjenim ali utekočinjenim plinom; ob segrevanju lahko eksplodira.", "jeklenka s CO₂, kisikom ali propan-butanom"],
  ["GHS05", "jedko", "Razjeda kožo, oči in kovine. Nosi zaščitna očala in rokavice.", "koncentrirana žveplova kislina, natrijev hidroksid"],
  ["GHS06", "akutno strupeno", "Že majhna količina lahko povzroči hudo zastrupitev ali smrt.", "metanol, živosrebrove spojine"],
  ["GHS07", "zdravju škodljivo, dražilno", "Draži kožo, oči ali dihala, škodljivo pri zaužitju.", "razredčen amonijak, bakrov(II) sulfat"],
  ["GHS08", "nevarno za zdravje", "Dolgoročno lahko povzroči raka, okvare organov ali alergije dihal.", "bencin, formaldehid"],
  ["GHS09", "nevarno za okolje", "Strupeno za vodne organizme. Ne zlivaj v odtok.", "bakrov(II) sulfat, motorno olje"],
];
const GHS_QUIZ = [
  ["bencin", ["GHS02", "GHS07", "GHS08", "GHS09"]],
  ["ognjemet", ["GHS01"]],
  ["kalijev permanganat", ["GHS03", "GHS07", "GHS09"]],
  ["jeklenka z ogljikovim dioksidom", ["GHS04"]],
  ["koncentrirana žveplova kislina", ["GHS05"]],
  ["trdni natrijev hidroksid", ["GHS05"]],
  ["metanol", ["GHS02", "GHS06", "GHS08"]],
  ["aceton (odstranjevalec laka)", ["GHS02", "GHS07"]],
  ["bakrov(II) sulfat", ["GHS07", "GHS09"]],
  ["čistilo za odtoke", ["GHS05"]],
  ["špirit (etanol)", ["GHS02"]],
  ["30-odstotni vodikov peroksid", ["GHS05", "GHS07"]],
];

function ghsIcon(g, code) {
  const ink = { class: "ghs-ink" };
  const P = (d, extra = {}) => s("path", { d, ...ink, ...extra }, g);
  const flame = (ox, oy, k) =>
    P(`M${ox} ${oy + 14 * k} C${ox - 12 * k} ${oy + 14 * k} ${ox - 12 * k} ${oy + 2 * k} ${ox - 6 * k} ${oy - 6 * k} C${ox - 5 * k} ${oy} ${ox - 2 * k} ${oy + k} ${ox - k} ${oy} C${ox - 3 * k} ${oy - 8 * k} ${ox + 2 * k} ${oy - 14 * k} ${ox + 4 * k} ${oy - 18 * k} C${ox + 5 * k} ${oy - 10 * k} ${ox + 12 * k} ${oy - 6 * k} ${ox + 10 * k} ${oy + 4 * k} C${ox + 9 * k} ${oy + 10 * k} ${ox + 5 * k} ${oy + 14 * k} ${ox} ${oy + 14 * k} Z`);
  if (code === "GHS01") {
    s("circle", { cx: -3, cy: 8, r: 8, ...ink }, g);
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI * (0.05 + (i / 8) * 0.9);
      s("line", { x1: 4 * Math.cos(a), y1: 2 + 4 * Math.sin(a), x2: 20 * Math.cos(a), y2: 2 + 20 * Math.sin(a), class: "ghs-line" }, g);
    }
    [[14, 12], [-16, -6], [10, -16]].forEach(([x, y]) => s("rect", { x, y, width: 4, height: 4, ...ink }, g));
  } else if (code === "GHS02") {
    flame(0, 0, 1);
    s("rect", { x: -15, y: 17, width: 30, height: 3, ...ink }, g);
  } else if (code === "GHS03") {
    s("circle", { cx: 0, cy: 9, r: 8, class: "ghs-line", fill: "none" }, g);
    flame(0, -6, 0.75);
    s("rect", { x: -15, y: 20, width: 30, height: 3, ...ink }, g);
  } else if (code === "GHS04") {
    s("rect", { x: -16, y: -4, width: 28, height: 12, rx: 6, ...ink, transform: "rotate(-25)" }, g);
    s("rect", { x: 11, y: -2, width: 6, height: 8, ...ink, transform: "rotate(-25)" }, g);
  } else if (code === "GHS05") {
    s("rect", { x: -16, y: -18, width: 8, height: 14, rx: 2, ...ink, transform: "rotate(-30 -12 -11)" }, g);
    s("rect", { x: 6, y: -18, width: 8, height: 14, rx: 2, ...ink, transform: "rotate(-30 10 -11)" }, g);
    [[-12, 0], [-12, 5], [10, 0], [10, 5]].forEach(([x, y]) => s("circle", { cx: x, cy: y, r: 1.6, ...ink }, g));
    P("M-20 12 H-4 V16 H-8 L-10 13 L-12 16 H-20 Z");
    P("M2 16 C2 10 6 9 10 9 H20 V12 H14 C14 14 13 16 11 16 Z");
  } else if (code === "GHS06") {
    s("circle", { cx: 0, cy: -8, r: 10, ...ink }, g);
    s("rect", { x: -6, y: -1, width: 12, height: 6, ...ink }, g);
    s("circle", { cx: -4, cy: -9, r: 3, class: "ghs-hole" }, g);
    s("circle", { cx: 4, cy: -9, r: 3, class: "ghs-hole" }, g);
    s("line", { x1: -14, y1: 8, x2: 14, y2: 18, class: "ghs-bone" }, g);
    s("line", { x1: 14, y1: 8, x2: -14, y2: 18, class: "ghs-bone" }, g);
  } else if (code === "GHS07") {
    s("rect", { x: -3.5, y: -18, width: 7, height: 24, rx: 2, ...ink }, g);
    s("circle", { cx: 0, cy: 13, r: 4, ...ink }, g);
  } else if (code === "GHS08") {
    s("circle", { cx: 0, cy: -15, r: 5, ...ink }, g);
    P("M-10 20 L-10 -2 Q-10 -8 -4 -8 L4 -8 Q10 -8 10 -2 L10 20 Z");
    P("M0 -2 L2 3 L7 3 L3 6 L5 11 L0 8 L-5 11 L-3 6 L-7 3 L-2 3 Z", { class: "ghs-hole" });
  } else if (code === "GHS09") {
    s("line", { x1: -10, y1: 18, x2: -10, y2: -16, class: "ghs-line" }, g);
    s("line", { x1: -10, y1: -6, x2: -18, y2: -14, class: "ghs-line" }, g);
    s("line", { x1: -10, y1: 2, x2: -2, y2: -8, class: "ghs-line" }, g);
    s("ellipse", { cx: 8, cy: 12, rx: 8, ry: 4, ...ink }, g);
    P("M15 12 L21 8 L21 16 Z");
    s("rect", { x: -18, y: 18, width: 38, height: 2.5, ...ink }, g);
  }
}

const ZMESI = [
  ["železo", "element", { k: "lattice", a: "Fe" }, "Iz enakih atomov, urejenih v kristalno mrežo."],
  ["kisik", "element", { k: "gas", mols: [[["O", -6, 0], ["O", 6, 0]]], n: [9] }, "Molekule O₂ iz dveh enakih atomov."],
  ["helij", "element", { k: "gas", mols: [[["He", 0, 0]]], n: [12] }, "Posamezni enaki atomi."],
  ["destilirana voda", "spojina", { k: "liquid", mols: [[["O", 0, 0], ["H", -8, 6], ["H", 8, 6]]], n: [16] }, "Vse molekule so enake (H₂O), vsaka iz dveh vrst atomov."],
  ["ogljikov dioksid", "spojina", { k: "gas", mols: [[["C", 0, 0], ["O", -12, 0], ["O", 12, 0]]], n: [8] }, "Enake molekule CO₂, sestavljene iz ogljika in kisika."],
  ["kuhinjska sol (NaCl)", "spojina", { k: "ionic", a: "Na", b: "Cl" }, "Natrijevi in kloridni ioni v stalnem razmerju 1 : 1."],
  ["zrak", "homogena", { k: "gas", mols: [[["N", -6, 0], ["N", 6, 0]], [["O", -6, 0], ["O", 6, 0]]], n: [8, 3] }, "Dve (in več) vrst molekul, enakomerno premešanih."],
  ["slana voda", "homogena", { k: "liquid", mols: [[["O", 0, 0], ["H", -8, 6], ["H", 8, 6]], [["Na", 0, 0]], [["Cl", 0, 0]]], n: [14, 3, 3] }, "Ioni soli so enakomerno porazdeljeni med molekulami vode."],
  ["medenina (zlitina bakra in cinka)", "homogena", { k: "alloy", a: "Cu", b: "Zn" }, "Atomi bakra in cinka so naključno premešani v kristalu."],
  ["sladkorna raztopina", "homogena", { k: "liquid", mols: [[["O", 0, 0], ["H", -8, 6], ["H", 8, 6]], [["C", -10, -6], ["C", 0, -6], ["C", 10, -6], ["O", -5, 5], ["O", 5, 5]]], n: [13, 3] }, "Molekule sladkorja so enakomerno porazdeljene po vodi."],
  ["pesek v vodi", "heterogena", { k: "layers", bottom: "Si", top: [["O", 0, 0], ["H", -8, 6], ["H", 8, 6]] }, "Vidimo dva dela: pesek se usede na dno."],
  ["olje in voda", "heterogena", { k: "layers", bottom: null, top: [["C", -12, 0], ["C", 0, 0], ["C", 12, 0]], low: [["O", 0, 0], ["H", -8, 6], ["H", 8, 6]] }, "Olje plava na vodi, nastaneta dve plasti."],
  ["granit", "heterogena", { k: "patches" }, "Vidimo različna zrna: kremen, glinenec in sljudo."],
];
const KOVINE = [
  ["dobro prevaja električni tok", "kovina", "Kovine imajo proste (delokalizirane) elektrone. Izjema med nekovinami je grafit."],
  ["ima kovinski sijaj", "kovina", "Prosti elektroni odbijajo svetlobo, zato se kovine svetijo."],
  ["je kovna in raztegljiva", "kovina", "Plasti atomov v kovini lahko drsijo druga ob drugi, ne da bi se vez pretrgala."],
  ["je v trdnem stanju krhka", "nekovina", "Trdne nekovine (žveplo, jod) se pri udarcu zdrobijo."],
  ["slabo prevaja toploto", "nekovina", "Nekovine so dobri toplotni izolatorji."],
  ["pri sobni temperaturi je lahko plin", "nekovina", "Kisik, dušik, klor in žlahtni plini so nekovine."],
  ["atomi rade volje oddajo elektrone in tvorijo katione", "kovina", "Kovine imajo malo valenčnih elektronov, npr. Na → Na⁺ + e⁻."],
  ["atomi sprejmejo elektrone in tvorijo anione", "nekovina", "Nekovine imajo veliko valenčnih elektronov, npr. Cl + e⁻ → Cl⁻."],
  ["železo", "kovina", "Železo je prehodna kovina; največ ga porabimo za jeklo."],
  ["žveplo", "nekovina", "Rumena, krhka nekovina, ne prevaja toka."],
  ["živo srebro", "kovina", "Edina kovina, ki je pri sobni temperaturi tekoča."],
  ["brom", "nekovina", "Edina nekovina, ki je pri sobni temperaturi tekoča."],
  ["grafit (ogljik)", "nekovina", "Ogljik je nekovina, a grafit izjemoma prevaja električni tok."],
  ["magnezij", "kovina", "Lahka kovina, gori s svetlim belim plamenom."],
  ["jod", "nekovina", "Vijolično-črni kristali, pri segrevanju sublimira."],
  ["aluminij", "kovina", "Lahka kovina, iz nje so pločevinke in folija."],
];
const CATS = {
  ghs: null,
  zmesi: [["element", "element"], ["spojina", "spojina"], ["homogena", "homogena zmes"], ["heterogena", "heterogena zmes"]],
  kovine: [["kovina", "kovina"], ["nekovina", "nekovina"]],
};

function particleBox(svg, pic, X, Y, W, H) {
  s("rect", { x: X, y: Y, width: W, height: H, rx: 8, class: "box" }, svg);
  const g = s("g", {}, svg);
  const r = (sym) => (sym === "H" ? 4.5 : sym === "Na" ? 6 : sym === "Cl" ? 8 : 7);
  const mol = (m, x, y, rot = 0) => {
    const c = Math.cos(rot), sn = Math.sin(rot);
    m.forEach(([sym, dx, dy]) => atomBall(g, x + dx * c - dy * sn, y + dx * sn + dy * c, sym, r(sym)));
  };
  const scatter = (n, pad, area) => {
    const pts = [];
    let tries = 0;
    while (pts.length < n && tries++ < 2000) {
      const p = [area.x + pad + Math.random() * (area.w - 2 * pad), area.y + pad + Math.random() * (area.h - 2 * pad)];
      if (pts.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > pad * 1.9)) pts.push(p);
    }
    return pts;
  };
  const all = { x: X, y: Y, w: W, h: H };
  if (pic.k === "lattice" || pic.k === "ionic" || pic.k === "alloy") {
    const cols = 9, rows = 5, d = 17, x0 = X + W / 2 - ((cols - 1) * d) / 2, y0 = Y + H - 20 - (rows - 1) * d;
    for (let i = 0; i < rows; i++)
      for (let j = 0; j < cols; j++) {
        const sym = pic.k === "lattice" ? pic.a : pic.k === "ionic" ? ((i + j) % 2 ? pic.b : pic.a) : Math.random() < 0.35 ? pic.b : pic.a;
        atomBall(g, x0 + j * d, y0 + i * d, sym, pic.k === "ionic" ? (sym === pic.a ? 5.5 : 8) : 8);
      }
  } else if (pic.k === "gas" || pic.k === "liquid") {
    const list = pic.mols.flatMap((m, i) => Array(pic.n[i]).fill(m));
    const pts = scatter(list.length, pic.k === "gas" ? 18 : 15, pic.k === "liquid" ? { x: X, y: Y + H * 0.22, w: W, h: H * 0.78 } : all);
    if (pic.k === "liquid") s("rect", { x: X + 2, y: Y + H * 0.2, width: W - 4, height: H * 0.8 - 2, rx: 6, class: "fill-soft", opacity: 0.6 }, g);
    shuffle(list).forEach((m, i) => pts[i] && mol(m, pts[i][0], pts[i][1], Math.random() * 6.28));
  } else if (pic.k === "layers") {
    const mid = Y + H * 0.55;
    if (pic.low) {
      s("rect", { x: X + 2, y: Y + H * 0.15, width: W - 4, height: H * 0.4, class: "fill-a", opacity: 0.18 }, g);
      s("rect", { x: X + 2, y: mid, width: W - 4, height: H * 0.45 - 2, class: "fill-soft", opacity: 0.6 }, g);
      scatter(7, 18, { x: X, y: Y + H * 0.15, w: W, h: H * 0.4 }).forEach(([x, y]) => mol(pic.top, x, y, Math.random() * 0.5));
      scatter(9, 14, { x: X, y: mid, w: W, h: H * 0.45 }).forEach(([x, y]) => mol(pic.low, x, y, Math.random() * 6.28));
    } else {
      s("rect", { x: X + 2, y: Y + H * 0.15, width: W - 4, height: H * 0.85 - 2, class: "fill-soft", opacity: 0.6 }, g);
      scatter(9, 15, { x: X, y: Y + H * 0.15, w: W, h: H * 0.5 }).forEach(([x, y]) => mol(pic.top, x, y, Math.random() * 6.28));
      for (let j = 0; j < 8; j++) for (let i = 0; i < 2; i++) s("path", { d: `M${X + 22 + j * 32 + i * 14} ${Y + H - 8 - i * 14} l10 -12 l12 4 l-4 10 Z`, class: "fill-a", opacity: 0.75 }, g);
    }
  } else if (pic.k === "patches") {
    const cols = ["#e7e1d6", "#e8a38a", "#3f3f46"];
    for (let i = 0; i < 70; i++) {
      const x = X + 10 + Math.random() * (W - 30), y = Y + 10 + Math.random() * (H - 30);
      s("rect", { x, y, width: 12 + Math.random() * 10, height: 10 + Math.random() * 8, rx: 3, style: `fill:${cols[i % 3]}`, opacity: 0.9 }, g);
    }
  }
}

export function razvrsti(el, { set = "zmesi" } = {}) {
  const out = readout();
  if (set === "ghs") return ghsSim(el, out);
  const svg = svgBox(340, set === "zmesi" ? 230 : 150);
  const items = set === "zmesi" ? ZMESI : KOVINE;
  let order = shuffle(items.map((_, i) => i)), k = 0, right = 0, total = 0, answered = false;
  const cur = () => items[order[k % order.length]];
  const draw = () => {
    svg.replaceChildren();
    const it = cur();
    if (set === "zmesi") {
      label(svg, 170, 16, it[0], "lbl big");
      particleBox(svg, it[2], 20, 32, 300, 190);
    } else {
      s("rect", { x: 20, y: 20, width: 300, height: 110, rx: 14, class: "box" }, svg);
      const words = it[0].split(" ");
      const lines = [];
      words.forEach((w) => (lines.length && (lines.at(-1) + " " + w).length < 26 ? (lines[lines.length - 1] += " " + w) : lines.push(w)));
      lines.forEach((ln, i) => label(svg, 170, 75 + (i - (lines.length - 1) / 2) * 22, ln, "lbl big"));
    }
  };
  const catBtns = buttons(
    ...CATS[set].map(([v, t]) =>
      button(t, () => {
        if (answered) return;
        answered = true;
        total++;
        const it = cur(), ok = it[1] === v;
        if (ok) right++;
        const name = CATS[set].find((c) => c[0] === it[1])[1];
        out.innerHTML = `<p>${ok ? '<b class="ok-text">Pravilno!</b>' : `<b class="bad-text">Ne čisto.</b> Pravilno je: <b>${name}</b>.`} ${set === "zmesi" ? it[3] : it[2]}</p><p class="muted">Pravilnih odgovorov: ${right} od ${total}.</p>`;
      }, "secondary")
    )
  );
  const next = () => {
    k++;
    answered = false;
    draw();
    out.innerHTML = `<p>${set === "zmesi" ? "Poglej delce. Je snov <b>element, spojina, homogena ali heterogena zmes</b>?" : "Ali ta lastnost oziroma snov sodi h <b>kovinam</b> ali <b>nekovinam</b>?"}</p><p class="muted">Pravilnih odgovorov: ${right} od ${total}.</p>`;
  };
  k = -1;
  next();
  layout(el, {
    stage: svg,
    controls: [catBtns, buttons(button("Naslednja ▸", next, "primary small"))],
    out,
    tryText: set === "zmesi" ? { razmisli: "Kako po sliki delcev ločiš element od spojine? Koliko različnih vrst atomov je v eni molekuli?" } : "Poišči dve izjemi: kovino, ki je tekoča, in nekovino, ki prevaja tok.",
  });
}

function ghsSim(el, out) {
  const svg = svgBox(340, 330);
  let mode = "spoznaj", sel = null, q = null, right = 0, total = 0, done = false;
  const quiz = shuffle(GHS_QUIZ);
  let qi = 0;
  const draw = () => {
    svg.replaceChildren();
    GHS.forEach(([code, name], i) => {
      const cx = 60 + (i % 3) * 110, cy = 55 + Math.floor(i / 3) * 108;
      const g = s("g", { class: "ghs" + (sel === code ? " on" : ""), transform: `translate(${cx} ${cy})`, role: "button", tabindex: 0 }, svg);
      s("path", { d: "M0 -42 L42 0 L0 42 L-42 0 Z", class: "ghs-frame" }, g);
      ghsIcon(g, code);
      if (mode === "spoznaj") label(svg, cx, cy + 49, name.length > 18 ? name.split(",")[0] : name, "tick small");
      g.addEventListener("click", () => pick(code));
    });
  };
  const pick = (code) => {
    sel = code;
    const d = GHS.find((x) => x[0] === code);
    if (mode === "spoznaj") out.innerHTML = `<p><b>${d[1][0].toUpperCase() + d[1].slice(1)}</b> (${d[0]}): ${d[2]}</p><p class="muted">Primeri: ${d[3]}.</p>`;
    else if (!done) {
      done = true;
      total++;
      const ok = q[1].includes(code);
      if (ok) right++;
      const names = q[1].map((c) => GHS.find((x) => x[0] === c)[1]);
      out.innerHTML = `<p>${ok ? '<b class="ok-text">Pravilno!</b>' : '<b class="bad-text">Ta znak ni na embalaži.</b>'} Na embalaži snovi <b>${q[0]}</b> so znaki: ${names.join(", ")}.</p><p class="muted">Pravilnih: ${right} od ${total}.</p>`;
    }
    draw();
  };
  const ask = () => {
    q = quiz[qi++ % quiz.length];
    done = false;
    sel = null;
    out.innerHTML = `<p>Kateri znak je na embalaži snovi <b>${q[0]}</b>? Klikni ga.</p><p class="muted">Pravilnih: ${right} od ${total}.</p>`;
    draw();
  };
  const nextBtn = button("Naslednja ▸", ask, "primary small");
  nextBtn.hidden = true;
  const seg = segmented({
    options: [["spoznaj", "spoznaj znake"], ["preizkus", "preizkusi se"]],
    value: mode,
    onChange: (v) => {
      mode = v;
      nextBtn.hidden = v !== "preizkus";
      if (v === "preizkus") ask();
      else {
        sel = null;
        out.innerHTML = "<p>Klikni znak, da izveš, kaj pomeni.</p>";
        draw();
      }
    },
  });
  out.innerHTML = "<p>Klikni znak, da izveš, kaj pomeni. Znaki so rdeči rombi s črnim simbolom na beli podlagi.</p>";
  draw();
  layout(el, { stage: svg, controls: [seg, buttons(nextBtn)], out, tryText: "Katere tri znake najdeš na embalaži bencina? Poišči jih v načinu »preizkusi se«." });
}

// ------------------------------------------------------------ atom: sestavi atom, lupine
const STABLE = { 1: [1, 2], 2: [3, 4], 3: [6, 7], 4: [9], 5: [10, 11], 6: [12, 13], 7: [14, 15], 8: [16, 17, 18], 9: [19], 10: [20, 21, 22], 11: [23], 12: [24, 25, 26], 13: [27], 14: [28, 29, 30], 15: [31], 16: [32, 33, 34, 36], 17: [35, 37], 18: [36, 38, 40], 19: [39, 41], 20: [40, 42, 43, 44, 46, 48] };

function counter(name, value, min, max, onChange) {
  const out = h("output", { class: "cnt-val" }, String(value));
  const set = (v) => {
    v = clamp(v, min, max);
    out.textContent = v;
    onChange(v);
  };
  const wrap = h("div", { class: "demo-counter" }, h("span", { class: "demo-slider-label" }, name), button("−", () => set(+out.textContent - 1)), out, button("+", () => set(+out.textContent + 1)));
  wrap.set = (v) => ((out.textContent = v), onChange(v));
  return wrap;
}

function drawShells(svg, cx, cy, sh, { r0 = 42, dr = 26, phase = 0, valOnly = false, hlLast = true } = {}) {
  sh.forEach((n, i) => {
    const r = r0 + i * dr;
    s("circle", { cx, cy, r, class: "shell" + (hlLast && i === sh.length - 1 ? " last" : "") }, svg);
    if (valOnly && i < sh.length - 1) return;
    for (let k = 0; k < n; k++) {
      const a = phase / (i + 1) + (k / n) * 2 * Math.PI - Math.PI / 2;
      s("circle", { cx: cx + r * Math.cos(a), cy: cy + r * Math.sin(a), r: 4.5, class: "electron-dot" + (hlLast && i === sh.length - 1 ? " val" : "") }, svg);
    }
  });
}

function nucleus(svg, cx, cy, p, n) {
  const N = p + n, list = [];
  for (let i = 0; i < N; i++) list.push(i % 2 === 0 ? (Math.floor(i / 2) < p ? "p" : "n") : Math.floor(i / 2) < n ? "n" : "p");
  // popravi razmerje
  let pc = list.filter((x) => x === "p").length;
  for (let i = 0; pc !== p && i < N; i++) {
    if (pc > p && list[i] === "p") (list[i] = "n"), pc--;
    else if (pc < p && list[i] === "n") (list[i] = "p"), pc++;
  }
  const rr = N > 30 ? 4 : 5;
  list.forEach((t, i) => {
    const a = i * 2.39996, d = rr * 0.95 * Math.sqrt(i);
    s("circle", { cx: cx + d * Math.cos(a), cy: cy + d * Math.sin(a), r: rr, class: t === "p" ? "proton" : "neutron" }, svg);
  });
}

export function atom(el, { mode = "sestavi" } = {}) {
  const out = readout();
  const svg = svgBox(340, 300);
  let p = 6, n = 6, e = 6, Z = 8, phase = 0;
  const sestavi = mode === "sestavi";
  const draw = () => {
    svg.replaceChildren();
    const cx = 150, cy = 150;
    if (sestavi) {
      const sh = shellsOS(e);
      drawShells(svg, cx, cy, sh, { phase, hlLast: false });
      nucleus(svg, cx, cy, p, n);
      label(svg, 300, 30, "p⁺", "lbl");
      s("circle", { cx: 280, cy: 30, r: 6, class: "proton" }, svg);
      s("circle", { cx: 280, cy: 52, r: 6, class: "neutron" }, svg);
      label(svg, 300, 52, "n⁰", "lbl");
      s("circle", { cx: 280, cy: 74, r: 4.5, class: "electron-dot" }, svg);
      label(svg, 300, 74, "e⁻", "lbl");
    } else {
      const sh = shellsOS(Z);
      drawShells(svg, cx, cy, sh, { phase });
      s("circle", { cx, cy, r: 18, class: "proton" }, svg);
      label(svg, cx, cy, `${Z}+`, "lbl small inv");
      // Lewisov simbol
      const el2 = ELEMENTS[Z - 1], v = Z === 2 ? 2 : sh.at(-1), lx = 300, ly = 60;
      label(svg, lx, ly - 34, "Lewisov simbol", "tick small");
      label(svg, lx, ly, el2.sym, "lbl big");
      const sides = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      sides.forEach(([dx, dy], side) => {
        const cnt = Z === 2 ? (side === 0 ? 2 : 0) : side < v - 4 ? 2 : side < v ? 1 : 0;
        for (let k = 0; k < cnt; k++) {
          const o = cnt === 2 ? (k ? 4 : -4) : 0;
          s("circle", { cx: lx + dx * 16 + (dx === 0 ? o : 0), cy: ly + dy * 16 + (dy === 0 ? o : 0), r: 2.6, class: "fill-text" }, svg);
        }
      });
    }
  };
  const info = () => {
    if (sestavi) {
      const el2 = p ? ELEMENTS[p - 1] : null, A = p + n, q = p - e;
      const qs = q === 0 ? "" : `${Math.abs(q) > 1 ? Math.abs(q) : ""}${q > 0 ? "+" : "-"}`;
      const stable = STABLE[p]?.includes(A);
      const ion = q > 0 ? `<b>kation</b> (pozitivni ion): ima ${q} ${q === 1 ? "elektron" : q === 2 ? "elektrona" : "elektrone"} manj kot protonov.` : q < 0 ? `<b>anion</b> (negativni ion): ima ${-q} ${q === -1 ? "elektron" : q === -2 ? "elektrona" : "elektrone"} več kot protonov.` : "<b>nevtralen atom</b>: protonov in elektronov je enako.";
      out.innerHTML =
        texBlock(`{}^{${A}}_{${p}}\\mathrm{${el2?.sym || "?"}}${qs ? `^{${qs}}` : ""}`) +
        `<p>Število protonov določa element: <b>${el2 ? el2.ime : "?"}</b> (Z = ${p}). Masno število A = p + n = ${p} + ${n} = <b>${A}</b>.</p>
         <p>To je ${ion}</p>
         <p>${stable ? `Jedro ${el2?.sym}-${A} je <b class="ok-text">stabilno</b>.` : `Jedro ${el2?.sym}-${A} je <b class="bad-text">nestabilno</b> (radioaktivno). Stabilni izotopi: ${(STABLE[p] || []).map((a) => `${el2?.sym}-${a}`).join(", ") || "jih ni"}.`}</p>
         <p class="muted">Izotopi istega elementa imajo enako število protonov in različno število nevtronov. Masa elektrona je okoli 1840-krat manjša od mase protona.</p>`;
    } else {
      const el2 = ELEMENTS[Z - 1], sh = shellsOS(Z), v = sh.at(-1);
      const grp = Z <= 2 ? (Z === 1 ? 1 : 18) : v <= 2 ? v : v + 10;
      const plemenit = (Z === 2 || v === 8) && Z !== 1;
      const tend = plemenit ? "Zunanja lupina je polna, zato je element <b>žlahtni plin</b> in skoraj ne reagira." : v <= 3 ? `Atom najlažje <b>odda ${v}</b> ${v === 1 ? "elektron" : v === 2 ? "elektrona" : "elektrone"} in postane ion ${el2.sym}${v > 1 ? "⁰¹²³"[v] : ""}⁺.` : `Atom najlažje <b>sprejme ${8 - v}</b> ${8 - v === 1 ? "elektron" : 8 - v === 2 ? "elektrona" : "elektrone"} in postane ion ${el2.sym}${8 - v > 1 ? "⁰¹²³⁴"[8 - v] : ""}⁻ (ali tvori kovalentne vezi).`;
      out.innerHTML = `<p><b>${el2.ime[0].toUpperCase() + el2.ime.slice(1)} (${el2.sym})</b>: ${Z} ${Z === 1 ? "elektron" : Z === 2 ? "elektrona" : Z < 5 ? "elektroni" : "elektronov"}, razporejenih po lupinah <b>${sh.join(", ")}</b>.</p>
        <p>Število lupin = <b>perioda ${sh.length}</b>. Valenčnih elektronov (v zadnji lupini) je ${v}, zato je v <b>${grp}. skupini</b>.</p><p>${tend}</p>
        <p class="muted">Za radovedne (SŠ): ${configText(Z, false)}</p>`;
    }
  };
  const anim = animate(el, (dt) => {
    phase += dt * 0.6;
    draw();
  });
  const upd = () => (draw(), info());
  const kids = sestavi
    ? [counter("protoni", p, 1, 20, (v) => ((p = v), upd())), counter("nevtroni", n, 0, 26, (v) => ((n = v), upd())), counter("elektroni", e, 0, 22, (v) => ((e = v), upd())), buttons(playButton(anim, { play: "Vrti", pause: "Ustavi" }))]
    : [slider({ label: "vrstno število Z", min: 1, max: 20, value: Z, format: (v) => `${v} (${ELEMENTS[v - 1].sym})`, onInput: (v) => ((Z = v), upd()) }), buttons(playButton(anim, { play: "Vrti", pause: "Ustavi" }))];
  upd();
  layout(el, {
    stage: svg,
    controls: kids,
    out,
    tryText: sestavi ? "Sestavi ion Na⁺ (11 protonov, 12 nevtronov) in ion Cl⁻. Kaj se zgodi z elementom, če dodaš proton?" : "Primerjaj Na, Mg in Al ter F, Cl. Kaj imajo skupnega elementi iste skupine?",
  });
}

// ------------------------------------------------------------ periodni: periodni sistem
const KIND_NAME = { alkalijska: "alkalijske kovine", zemeljskoalkalijska: "zemeljskoalkalijske kovine", prehodna: "prehodne kovine", lantanoid: "lantanoidi", aktinoid: "aktinoidi", ostala: "ostale kovine", polkovina: "polkovine", nekovina: "nekovine", halogen: "halogeni elementi", zlahtni: "žlahtni plini", neznano: "neznane lastnosti" };
const GROUP_NAME = { 1: "alkalijske kovine (in vodik)", 2: "zemeljskoalkalijske kovine", 13: "borova skupina", 14: "ogljikova skupina", 15: "dušikova skupina", 16: "halkogeni elementi", 17: "halogeni elementi", 18: "žlahtni plini" };
const PROPS = {
  en: ["elektronegativnost", "", (e) => e.en, 0.7, 4, "narašča v periodi od leve proti desni in v skupini od spodaj navzgor. Najbolj elektronegativen je fluor."],
  r: ["atomski polmer", "pm", (e) => e.r, 30, 260, "narašča v skupini navzdol (več lupin) in pada v periodi proti desni (večji naboj jedra bolj privlači elektrone)."],
  ie: ["1. ionizacijska energija", "kJ/mol", (e) => e.ie, 370, 2400, "narašča v periodi proti desni in pada v skupini navzdol. Žlahtni plini najtežje oddajo elektron."],
};

export function periodni(el, { highlight = "skupine" } = {}) {
  const out = readout();
  const cw = 34, ch = 36, X0 = 22, Y0 = 26;
  const svg = svgBox(X0 + 18 * cw + 6, Y0 + 7 * ch + 26 + 2 * ch + 6, "ptable");
  const chart = svgBox(640, 170);
  chart.style.display = "none";
  let mode = highlight, prop = "en", sel = null, selGroup = null;
  const cellXY = (e) => [X0 + (e.g - 1) * cw, e.p <= 7 ? Y0 + (e.p - 1) * ch : Y0 + 7 * ch + 26 + (e.p - 9) * ch];
  const fillOf = (e) => {
    if (mode === "vrste") return { class: `pt-bg k-${e.kind}` };
    if (mode === "skupine") {
      const g = groupOf(e);
      if (selGroup && g === selGroup) return { class: "pt-bg k-sel" };
      return { class: `pt-bg ${GROUP_NAME[g] ? "g-" + g : "k-dim"}` };
    }
    const [, , f, lo, hi] = PROPS[prop];
    const v = f(e);
    return v == null ? { class: "pt-bg k-dim" } : { class: "pt-bg", style: `fill:${heat((v - lo) / (hi - lo))}` };
  };
  const draw = () => {
    svg.replaceChildren();
    for (let g = 1; g <= 18; g++) {
      const t = label(svg, X0 + (g - 1) * cw + cw / 2, Y0 - 10, String(g), "tick small" + (selGroup === g ? " b" : ""));
      if (mode === "skupine") {
        t.classList.add("drag");
        t.addEventListener("click", () => ((selGroup = selGroup === g ? null : g), (sel = null), draw(), info()));
      }
    }
    for (let p = 1; p <= 7; p++) label(svg, X0 - 10, Y0 + (p - 1) * ch + ch / 2, String(p), "tick small");
    label(svg, X0 + 1.5 * cw, Y0 + 7 * ch + 26 + ch / 2, "lantanoidi", "tick small");
    label(svg, X0 + 1.5 * cw, Y0 + 8 * ch + 26 + ch / 2, "aktinoidi", "tick small");
    ELEMENTS.forEach((e) => {
      const [x, y] = cellXY(e);
      const g = s("g", { class: "pt-cell" + (sel === e.z ? " sel" : ""), role: "button" }, svg);
      s("rect", { x: x + 1, y: y + 1, width: cw - 2, height: ch - 2, rx: 3, ...fillOf(e) }, g);
      s("text", { x: x + 3.5, y: y + 9, class: "pt-z" }, g, String(e.z));
      s("text", { x: x + cw / 2, y: y + ch / 2 + 5, class: "pt-sym", "text-anchor": "middle" }, g, e.sym);
      g.addEventListener("click", () => ((sel = e.z), draw(), info()));
    });
    if (mode === "trendi") {
      const yB = Y0 + 7 * ch + 13, id = "tri" + Math.random().toString(36).slice(2, 7);
      const m = s("marker", { id, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto" }, s("defs", {}, svg));
      s("path", { d: "M0 0 L10 5 L0 10 Z", class: "fill-text" }, m);
      s("line", { x1: X0 + 3 * cw, y1: yB, x2: X0 + 9 * cw, y2: yB, class: "trend-arrow", "marker-end": `url(#${id})` }, svg);
      label(svg, X0 + 9.4 * cw, yB, prop === "r" ? "v periodi proti desni polmer pada, v skupini navzdol narašča" : "v periodi proti desni vrednost narašča, v skupini navzdol pada", "tick small b", "start");
    }
    if (mode === "vrste") {
      const keys = ["alkalijska", "zemeljskoalkalijska", "prehodna", "ostala", "polkovina", "nekovina", "halogen", "zlahtni"];
      keys.forEach((k, i) => {
        const x = X0 + 2.3 * cw + (i % 2) * 5 * cw, y = Y0 + 8 + Math.floor(i / 2) * 15;
        s("rect", { x, y: y - 5, width: 10, height: 10, rx: 2, class: `pt-bg k-${k}` }, svg);
        s("text", { x: x + 14, y: y + 4, class: "pt-legend" }, svg, KIND_NAME[k]);
      });
    }
    drawChart();
  };
  const drawChart = () => {
    chart.style.display = mode === "trendi" ? "" : "none";
    if (mode !== "trendi") return;
    chart.replaceChildren();
    const [name, unit, f, lo, hi] = PROPS[prop];
    const A = axes(chart, { W: 640, H: 170, x: [0, 56], y: [0, hi * (prop === "en" ? 1 : 1.05)], xStep: 4, yStep: prop === "en" ? 1 : prop === "r" ? 50 : 500, xLabel: "Z", yLabel: unit || "EN", grid: true });
    let d = "";
    ELEMENTS.slice(0, 56).forEach((e) => {
      const v = f(e);
      if (v == null) return;
      d += (d ? "L" : "M") + A.X(e.z).toFixed(1) + " " + A.Y(v).toFixed(1);
    });
    s("path", { d, class: "graph-line" }, chart);
    ELEMENTS.slice(0, 56).forEach((e) => {
      const v = f(e);
      if (v == null) return;
      const isNoble = e.g === 18, isAlk = e.g === 1 && e.z > 1;
      s("circle", { cx: A.X(e.z), cy: A.Y(v), r: sel === e.z ? 5 : isNoble || isAlk ? 3.5 : 2, class: sel === e.z ? "fill-danger" : isNoble ? "fill-b" : isAlk ? "fill-a" : "fill-accent" }, chart);
      if ((isNoble || isAlk) && e.z < 56) label(chart, A.X(e.z), A.Y(v) + (prop === "r" ? (isAlk ? -9 : 10) : isAlk ? 10 : -9), e.sym, "tick small");
    });
  };
  const info = () => {
    if (sel) {
      const e = ELEMENTS[sel - 1];
      const g = groupOf(e);
      out.innerHTML = `<p><b>${e.ime[0].toUpperCase() + e.ime.slice(1)} (${e.sym})</b>: Z = ${e.z}, A<sub>r</sub> = ${fmt(e.M, e.M > 100 ? 1 : 2)}, ${g ? `${g}. skupina, ` : ""}${periodOf(e)}. perioda, ${KIND_NAME[e.kind]}.</p>
        <p>Elektronska konfiguracija: <b>${configText(e.z)}</b>${e.z <= 20 ? ` (po lupinah ${shells(e.z).join(", ")})` : ""}.</p>
        <p class="muted">Elektronegativnost ${e.en ? fmt(e.en, 2) : "–"}, atomski polmer ${e.r ? e.r + " pm" : "–"}, 1. ionizacijska energija ${e.ie ? e.ie + " kJ/mol" : "–"}.</p>`;
      return;
    }
    if (mode === "skupine")
      out.innerHTML = selGroup
        ? `<p><b>${selGroup}. skupina: ${GROUP_NAME[selGroup] || "prehodni elementi"}</b>. ${GROUP_NAME[selGroup] ? `Vsi elementi imajo v zunanji lupini ${selGroup === 18 ? "8 elektronov (helij 2)" : `${selGroup > 12 ? selGroup - 10 : selGroup} ${selGroup === 1 ? "elektron" : selGroup === 2 ? "elektrona" : "elektrone"}`}, zato imajo podobne kemijske lastnosti.` : "Prehodne kovine polnijo notranjo d-podlupino."}</p>`
        : `<p><b>Skupine</b> so stolpci (1–18), <b>periode</b> so vrstice (1–7). Elementi iste skupine imajo enako število valenčnih elektronov in podobne lastnosti. Perioda pove, koliko lupin ima atom.</p><p class="muted">Klikni številko skupine ali element.</p>`;
    else if (mode === "vrste") out.innerHTML = `<p>Večina elementov so <b>kovine</b> (levo in na sredini). <b>Nekovine</b> so desno zgoraj, med njimi pa so <b>polkovine</b> (B, Si, Ge, As, Sb, Te), ki imajo lastnosti obeh.</p><p class="muted">Klikni element za podrobnosti.</p>`;
    else out.innerHTML = `<p><b>${PROPS[prop][0][0].toUpperCase() + PROPS[prop][0].slice(1)}</b> ${PROPS[prop][5]}</p><p class="muted">Modra = majhna vrednost, oranžna = velika. Graf spodaj kaže vrednosti od H do Ba: oranžne pike so alkalijske kovine, turkizne žlahtni plini.</p>`;
  };
  const propSel = select({ label: "lastnost", options: Object.entries(PROPS).map(([k, v]) => [k, v[0]]), value: prop, onChange: (v) => ((prop = v), draw(), info()) });
  propSel.hidden = mode !== "trendi";
  const seg = segmented({
    options: [["skupine", "skupine in periode"], ["vrste", "kovine in nekovine"], ["trendi", "periodične lastnosti"]],
    value: mode,
    onChange: (v) => ((mode = v), (sel = null), (selGroup = null), (propSel.hidden = v !== "trendi"), draw(), info()),
  });
  draw();
  info();
  layout(el, {
    stage: [svg, chart],
    controls: [seg, propSel],
    out,
    tryText: highlight === "trendi" ? "Kateri element ima največjo elektronegativnost in kateri največji atom? Zakaj imajo žlahtni plini največjo ionizacijsko energijo?" : highlight === "vrste" ? "Kje v periodnem sistemu so polkovine? Katera nekovina je pri sobni temperaturi tekoča? Naštej nekaj trdnih nekovin." : "Klikni 17. skupino. Koliko valenčnih elektronov imajo halogeni elementi?",
  });
}

// ------------------------------------------------------------ vezi: ionska, kovalentna, polarnost
const METALS = { Li: [1, "litijev"], Na: [1, "natrijev"], K: [1, "kalijev"], Mg: [2, "magnezijev"], Ca: [2, "kalcijev"], Al: [3, "aluminijev"] };
const NONMETALS = { F: [1, "fluorid"], Cl: [1, "klorid"], Br: [1, "bromid"], O: [2, "oksid"], S: [2, "sulfid"], N: [3, "nitrid"] };
const MOLS = {
  H2: ["vodik", [["H", -20, 0, []], ["H", 20, 0, []]], [[0, 1, 1]]],
  Cl2: ["klor", [["Cl", -24, 0, [90, 180, 270]], ["Cl", 24, 0, [90, 0, 270]]], [[0, 1, 1]]],
  HCl: ["vodikov klorid", [["H", -26, 0, []], ["Cl", 22, 0, [90, 0, 270]]], [[0, 1, 1]]],
  O2: ["kisik", [["O", -22, 0, [135, 225]], ["O", 22, 0, [45, 315]]], [[0, 1, 2]]],
  N2: ["dušik", [["N", -20, 0, [180]], ["N", 20, 0, [0]]], [[0, 1, 3]]],
  H2O: ["voda", [["O", 0, 6, [35, 145]], ["H", -32, -16, []], ["H", 32, -16, []]], [[0, 1, 1], [0, 2, 1]]],
  NH3: ["amonijak", [["N", 0, 6, [90]], ["H", -34, -10, []], ["H", 34, -10, []], ["H", 0, -32, []]], [[0, 1, 1], [0, 2, 1], [0, 3, 1]]],
  CH4: ["metan", [["C", 0, 0, []], ["H", 0, 36, []], ["H", 0, -36, []], ["H", -36, 0, []], ["H", 36, 0, []]], [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]]],
  CO2: ["ogljikov dioksid", [["C", 0, 0, []], ["O", -42, 0, [135, 225]], ["O", 42, 0, [45, 315]]], [[0, 1, 2], [0, 2, 2]]],
  C2H4: ["eten", [["C", -22, 0, []], ["C", 22, 0, []], ["H", -46, 24, []], ["H", -46, -24, []], ["H", 46, 24, []], ["H", 46, -24, []]], [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]]],
  HCN: ["vodikov cianid", [["H", -46, 0, []], ["C", -10, 0, []], ["N", 28, 0, [0]]], [[0, 1, 1], [1, 2, 3]]],
};
const EN_LIST = ["H", "Li", "Na", "K", "Mg", "Ca", "Al", "C", "N", "O", "F", "S", "Cl", "Br", "I"];

export function vezi(el, { mode = "kovalentna" } = {}) {
  if (mode === "ionska") return ionska(el);
  if (mode === "polarnost") return polarnost(el);
  const out = readout();
  const svg = svgBox(340, 220);
  let key = "H2O", dots = false;
  const draw = () => {
    svg.replaceChildren();
    const [, atoms, bonds] = MOLS[key];
    const sc = 2.3, cx = 170, cy = 110;
    const P = (a) => [cx + a[1] * sc, cy - a[2] * sc];
    bonds.forEach(([i, j, o]) => {
      const [x1, y1] = P(atoms[i]), [x2, y2] = P(atoms[j]);
      const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, px = -uy, py = ux;
      for (let k = 0; k < o; k++) {
        const off = (k - (o - 1) / 2) * 7;
        if (dots) {
          const mx = (x1 + x2) / 2 + px * off, my = (y1 + y2) / 2 + py * off;
          s("ellipse", { cx: mx, cy: my, rx: 9, ry: 5, transform: `rotate(${(Math.atan2(uy, ux) * 180) / Math.PI} ${mx} ${my})`, class: "shared-pair" }, svg);
          [-3.5, 3.5].forEach((t) => s("circle", { cx: mx + ux * t, cy: my + uy * t, r: 2.4, class: "fill-text" }, svg));
        } else s("line", { x1: x1 + ux * 12 + px * off, y1: y1 + uy * 12 + py * off, x2: x2 - ux * 12 + px * off, y2: y2 - uy * 12 + py * off, class: "bond thick" }, svg);
      }
    });
    atoms.forEach((a) => {
      const [x, y] = P(a);
      label(svg, x, y, a[0], "lbl big atom-lbl");
      a[3].forEach((ang) => {
        const r = rad(ang), dx = Math.cos(r), dy = -Math.sin(r);
        [-4, 4].forEach((t) => s("circle", { cx: x + dx * 19 - dy * t, cy: y + dy * 19 + dx * t, r: 2.6, class: "fill-c" }, svg));
      });
    });
  };
  const info = () => {
    const [ime, atoms, bonds] = MOLS[key];
    const pairs = bonds.reduce((a, b) => a + b[2], 0), lone = atoms.reduce((a, x) => a + x[3].length, 0);
    const kinds = [...new Set(bonds.map((b) => b[2]))].map((o) => ["enojna", "dvojna", "trojna"][o - 1]);
    const oct = atoms
      .filter((a, i, arr) => arr.findIndex((b) => b[0] === a[0]) === i)
      .map((a) => {
        const i = atoms.indexOf(a), sh = bonds.filter((b) => b[0] === i || b[1] === i).reduce((t, b) => t + b[2], 0);
        const tot = 2 * sh + 2 * a[3].length;
        return `${a[0]}: ${sh} ${sh === 1 ? "vezni par" : sh < 5 ? "vezna para" : "veznih parov"} + ${a[3].length} nevezn${a[3].length === 1 ? "i par" : "a para"} → <b>${tot}</b> elektronov${a[0] === "H" ? " (dublet)" : " (oktet)"}`;
      });
    out.innerHTML = `<p><b>${ime} (${sub(key)})</b>: ${pairs} ${pairs === 1 ? "vezni elektronski par" : pairs < 5 ? "vezna elektronska para" : "veznih elektronskih parov"}, ${lone} ${lone === 1 ? "nevezni par" : lone === 2 ? "nevezna para" : lone < 5 ? "nevezni pari" : "neveznih parov"}. Vez${kinds.length > 1 ? "i" : ""}: ${kinds.join(" in ")}.</p>
      <p>${oct.join("<br>")}</p><p class="muted">Pri kovalentni vezi si atoma <b>delita</b> elektronski par. Tako vsak atom doseže elektronsko konfiguracijo žlahtnega plina.</p>`;
  };
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      select({ label: "molekula", options: Object.entries(MOLS).map(([k, v]) => [k, `${sub(k)} (${v[0]})`]), value: key, onChange: (v) => ((key = v), draw(), info()) }),
      segmented({ options: [["crte", "vezi kot črtice"], ["pike", "vezi kot elektronski pari"]], value: "crte", onChange: (v) => ((dots = v === "pike"), draw()) }),
    ],
    out,
    tryText: "Preštej elektrone okoli kisika v molekuli vode. Katera molekula ima trojno vez?",
  });
}
const rad = (d) => (d * Math.PI) / 180;

function ionska(el) {
  const out = readout();
  const svg = svgBox(340, 250);
  let M = "Mg", X = "Cl", t = 0;
  const anim = animate(el, (dt) => {
    t = Math.min(1, t + dt * 0.6);
    draw();
    if (t >= 1) {
      info();
      return false;
    }
  }, { autoplay: false });
  const draw = () => {
    svg.replaceChildren();
    const qm = METALS[M][0], qx = NONMETALS[X][0], L = lcm(qm, qx), a = L / qm, b = L / qx;
    const mx = (i) => 170 + (i - (a - 1) / 2) * 92, nx = (j) => 170 + (j - (b - 1) / 2) * 92;
    const ease = t * t * (3 - 2 * t);
    const rm = 26 - 10 * ease, rx = 20 + 6 * ease;
    // slote za elektrone okoli nekovine
    const slot = (k, r) => {
      const ang = [90, 270, 0, 180, 90, 270, 0, 180][k] * (Math.PI / 180), off = k < 4 ? -4 : 4;
      return [Math.cos(ang) * (r + 7) - Math.sin(ang) * off, -Math.sin(ang) * (r + 7) - Math.cos(ang) * off];
    };
    for (let i = 0; i < a; i++) {
      s("circle", { cx: mx(i), cy: 70, r: rm, class: "ion-m" }, svg);
      label(svg, mx(i), 70, ease > 0.5 ? `${M}${qm > 1 ? qm : ""}+` : M, "lbl");
    }
    for (let j = 0; j < b; j++) {
      s("circle", { cx: nx(j), cy: 185, r: rx, class: "ion-x" }, svg);
      label(svg, nx(j), 185, ease > 0.5 ? `${X}${qx > 1 ? qx : ""}−` : X, "lbl");
      for (let k = 0; k < 8 - qx; k++) {
        const [dx, dy] = slot(k, rx);
        s("circle", { cx: nx(j) + dx, cy: 185 + dy, r: 3, class: "fill-c" }, svg);
      }
      if (ease > 0.9) {
        s("path", { d: `M${nx(j) - rx - 14} ${185 - rx - 10} h-4 v${2 * rx + 20} h4 M${nx(j) + rx + 14} ${185 - rx - 10} h4 v${2 * rx + 20} h-4`, class: "thin-line" }, svg);
      }
    }
    // elektroni kovine
    let e = 0;
    for (let i = 0; i < a; i++)
      for (let k = 0; k < qm; k++, e++) {
        const j = Math.floor(e / qx), kk = 8 - qx + (e % qx);
        const ang = (k / qm) * 2 * Math.PI - Math.PI / 2;
        const sx = mx(i) + Math.cos(ang) * (26 + 7), sy = 70 + Math.sin(ang) * (26 + 7);
        const [dx, dy] = slot(kk, rx);
        const ex = nx(j) + dx, ey = 185 + dy;
        s("circle", { cx: sx + (ex - sx) * ease, cy: sy + (ey - sy) * ease, r: 3.5, class: "fill-a" }, svg);
      }
    if (t === 0) label(svg, 170, 128, `${M} odda ${qm} e⁻, ${X} sprejme ${qx} e⁻`, "tick small");
  };
  const info = () => {
    const [qm, mname] = METALS[M], [qx, xname] = NONMETALS[X], L = lcm(qm, qx), a = L / qm, b = L / qx;
    const f = `${M}${a > 1 ? a : ""}${X}${b > 1 ? b : ""}`;
    out.innerHTML =
      (t >= 1
        ? texBlock(`${a > 1 ? a : ""}\\,\\mathrm{${M}} \\to ${a > 1 ? a : ""}\\,\\mathrm{${M}}^{${qm > 1 ? qm : ""}+} + ${L}\\,e^- \\qquad ${b > 1 ? b : ""}\\,\\mathrm{${X}} + ${L}\\,e^- \\to ${b > 1 ? b : ""}\\,\\mathrm{${X}}^{${qx > 1 ? qx : ""}-}`) +
          `<p>Nastala je ionska spojina <b>${sub(f)}</b> (${mname} ${xname}). Kation ${M}${qm > 1 ? qm : ""}⁺ je manjši od atoma, anion ${X}${qx > 1 ? qx : ""}⁻ pa večji. Nasprotno nabiti ioni se privlačijo: to je <b>ionska vez</b>.</p>`
        : `<p>Kovina ${M} ima ${qm} ${qm === 1 ? "valenčni elektron" : qm === 2 ? "valenčna elektrona" : "valenčne elektrone"}, nekovina ${X} pa ${8 - qx}. Pritisni <b>Prenesi elektrone</b>.</p>`) +
      `<p class="muted">Elektronov, ki jih oddajo kovine, mora biti toliko, kot jih sprejmejo nekovine: ${a} · ${qm} = ${b} · ${qx} = ${L}. Zato je razmerje ionov ${a} : ${b}.</p>`;
  };
  const reset = () => ((t = 0), anim.pause(), draw(), info());
  reset();
  layout(el, {
    stage: svg,
    controls: [
      select({ label: "kovina", options: Object.keys(METALS), value: M, onChange: (v) => ((M = v), reset()) }),
      select({ label: "nekovina", options: Object.keys(NONMETALS), value: X, onChange: (v) => ((X = v), reset()) }),
      buttons(button("Prenesi elektrone", () => ((t = 0), anim.play()), "primary small"), button("Znova", reset)),
    ],
    out,
    tryText: "Koliko atomov kisika potrebujeta dva atoma aluminija? Sestavi Al in O in preveri formulo Al₂O₃.",
  });
}

function polarnost(el) {
  const out = readout();
  const svg = svgBox(340, 230);
  let A = "H", B = "Cl";
  const draw = () => {
    svg.replaceChildren();
    const ea = BY_SYM[A].en, eb = BY_SYM[B].en, d = Math.abs(ea - eb);
    const xa = 110, xb = 230, y = 80;
    const shift = clamp((eb - ea) / 2.2, -1, 1); // + pomeni proti B
    if (d > 1.7) {
      const [an, cat] = eb > ea ? [xb, xa] : [xa, xb];
      s("circle", { cx: an, cy: y, r: 46, class: "e-cloud" }, svg);
      s("circle", { cx: cat, cy: y, r: 20, class: "e-cloud weak" }, svg);
    } else s("ellipse", { cx: 170 + shift * 45, cy: y, rx: 95 - Math.abs(shift) * 25, ry: 40, class: "e-cloud" }, svg);
    atomBall(svg, xa, y, A, 20);
    atomBall(svg, xb, y, B, 20);
    if (d >= 0.4) {
      const [plus, minus] = eb > ea ? [xa, xb] : [xb, xa];
      label(svg, plus, y - 52, d > 1.7 ? "+" : "δ+", "lbl big stroke-none fill-accent");
      label(svg, minus, y - 52, d > 1.7 ? "−" : "δ−", "lbl big fill-danger");
    }
    label(svg, xa, y + 56, `EN = ${fmt(ea, 2)}`, "tick small");
    label(svg, xb, y + 56, `EN = ${fmt(eb, 2)}`, "tick small");
    // lestvica
    const x0 = 30, x1 = 310, yy = 175, X = (v) => x0 + (v / 3.3) * (x1 - x0);
    [[0, 0.4, "nepolarna", "zone-a"], [0.4, 1.7, "polarna kovalentna", "zone-b"], [1.7, 3.3, "ionska", "zone-c"]].forEach(([a, b, t, c]) => {
      s("rect", { x: X(a), y: yy, width: X(b) - X(a), height: 16, class: c }, svg);
      label(svg, (X(a) + X(b)) / 2, yy + 30, t, "tick small");
    });
    [0, 0.4, 1.7, 3.3].forEach((v) => label(svg, X(v), yy - 8, fmt(v, 1), "tick small"));
    s("path", { d: `M${X(d)} ${yy - 2} l-6 -10 h12 Z`, class: "fill-danger" }, svg);
    label(svg, 170, yy + 46, `ΔEN = ${fmt(d, 2)}`, "lbl");
  };
  const info = () => {
    const ea = BY_SYM[A].en, eb = BY_SYM[B].en, d = Math.abs(ea - eb);
    const more = ea > eb ? A : B;
    const type = d < 0.4 ? "<b>nepolarna kovalentna vez</b>: elektroni so med atomoma porazdeljeni (skoraj) enakomerno." : d <= 1.7 ? `<b>polarna kovalentna vez</b>: skupni elektronski par je bližje bolj elektronegativnemu atomu ${more}, ki dobi delni negativni naboj δ−.` : `<b>ionska vez</b>: razlika je tako velika, da atom ${more} elektron praktično prevzame. Nastaneta iona.`;
    out.innerHTML = `<p>ΔEN = |${fmt(ea, 2)} − ${fmt(eb, 2)}| = ${fmt(d, 2)} → ${type}</p><p class="muted">Meji 0,4 in 1,7 sta dogovorjeni; prehod med vrstami vezi je zvezen.</p>`;
  };
  const opts = EN_LIST.map((x) => [x, `${x} (${fmt(BY_SYM[x].en, 2)})`]);
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      select({ label: "atom A", options: opts, value: A, onChange: (v) => ((A = v), draw(), info()) }),
      select({ label: "atom B", options: opts, value: B, onChange: (v) => ((B = v), draw(), info()) }),
    ],
    out,
    tryText: "Primerjaj vezi H–F, H–Cl, H–Br in H–I. Katera je najbolj polarna? Kakšna vez je med Na in Cl?",
  });
}

// ------------------------------------------------------------ formule: sestavljanje formul iz ionov
const CATIONS = [["Na", 1, "natrijev"], ["K", 1, "kalijev"], ["Ag", 1, "srebrov"], ["NH4", 1, "amonijev"], ["Cu", 1, "bakrov(I)"], ["Mg", 2, "magnezijev"], ["Ca", 2, "kalcijev"], ["Ba", 2, "barijev"], ["Zn", 2, "cinkov"], ["Cu", 2, "bakrov(II)"], ["Fe", 2, "železov(II)"], ["Fe", 3, "železov(III)"], ["Al", 3, "aluminijev"]];
const ANIONS = [["Cl", 1, "klorid"], ["Br", 1, "bromid"], ["I", 1, "jodid"], ["F", 1, "fluorid"], ["OH", 1, "hidroksid"], ["NO3", 1, "nitrat"], ["HCO3", 1, "hidrogenkarbonat"], ["O", 2, "oksid"], ["S", 2, "sulfid"], ["SO4", 2, "sulfat"], ["CO3", 2, "karbonat"], ["PO4", 3, "fosfat"], ["N", 3, "nitrid"]];
const multi = (f) => /[A-Z].*[A-Z]|\d/.test(f);

export function formule(el) {
  const out = readout();
  const svg = svgBox(340, 180);
  let ci = 12, ai = 9;
  const ion = (f, q, sign) => `${sub(f)}${q > 1 ? "⁰¹²³"[q] : ""}${sign}`;
  const draw = () => {
    svg.replaceChildren();
    const [cf, cq] = CATIONS[ci], [af, aq] = ANIONS[ai];
    const L = lcm(cq, aq), a = L / cq, b = L / aq, u = Math.min(46, 280 / L), x0 = 170 - (L * u) / 2;
    for (let i = 0; i < a; i++) {
      const x = x0 + i * cq * u;
      s("rect", { x: x + 1, y: 40, width: cq * u - 2, height: 44, rx: 8, class: "ion-tile cat" }, svg);
      for (let k = 0; k < cq; k++) s("path", { d: `M${x + (k + 0.5) * u - 7} 84 h14 l-7 9 Z`, class: "fill-accent" }, svg);
      label(svg, x + (cq * u) / 2, 62, ion(cf, cq, "⁺"), "lbl");
    }
    for (let j = 0; j < b; j++) {
      const x = x0 + j * aq * u;
      s("rect", { x: x + 1, y: 96, width: aq * u - 2, height: 44, rx: 8, class: "ion-tile an" }, svg);
      label(svg, x + (aq * u) / 2, 118, ion(af, aq, "⁻"), "lbl");
    }
    label(svg, 170, 22, `+${L}`, "tick b");
    label(svg, 170, 160, `−${L}`, "tick b");
  };
  const info = () => {
    const [cf, cq, cn] = CATIONS[ci], [af, aq, an] = ANIONS[ai];
    const L = lcm(cq, aq), a = L / cq, b = L / aq;
    const part = (f, n) => (n > 1 ? (multi(f) ? `(${sub(f)})${sub(String(n))}` : `${sub(f)}${sub(String(n))}`) : sub(f));
    const f = part(cf, a) + part(af, b);
    out.innerHTML = `<p>Formula: <b style="font-size:1.25em">${f}</b> — ${cn} ${an}</p>
      <p>Naboji se morajo izravnati: ${a} · (+${cq}) + ${b} · (−${aq}) = 0. Najmanjši skupni večkratnik nabojev je ${L}.</p>
      <p class="muted">${multi(cf) || multi(af) ? "Večatomni ion damo v oklepaj, če ga je v formuli več kot eden." : "Indeks 1 ne pišemo."} Pri kovinah z več možnimi naboji (Fe, Cu) naboj zapišemo z rimsko številko v imenu.</p>`;
  };
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      select({ label: "kation", options: CATIONS.map((c, i) => [i, `${ion(c[0], c[1], "⁺")} ${c[2]}`]), value: ci, onChange: (v) => ((ci = +v), draw(), info()) }),
      select({ label: "anion", options: ANIONS.map((c, i) => [i, `${ion(c[0], c[1], "⁻")} ${c[2]}`]), value: ai, onChange: (v) => ((ai = +v), draw(), info()) }),
    ],
    out,
    tryText: "Sestavi kalcijev fosfat. Koliko kalcijevih ionov potrebuješ za dva fosfatna iona?",
  });
}

// ------------------------------------------------------------ medmolekulske: medmolekulske sile in vrelišča
const HIDRIDI = [
  ["14. skupina", "b", [["CH4", -161.5], ["SiH4", -112], ["GeH4", -88], ["SnH4", -52]]],
  ["15. skupina", "c", [["NH3", -33], ["PH3", -88], ["AsH3", -62], ["SbH3", -17]]],
  ["16. skupina", "danger", [["H2O", 100], ["H2S", -60], ["H2Se", -41], ["H2Te", -2]]],
  ["17. skupina", "a", [["HF", 20], ["HCl", -85], ["HBr", -67], ["HI", -35]]],
];
const NIZI = {
  alkani: ["alkani", [["CH4", 16, -162, "L"], ["C2H6", 30, -89, "L"], ["C3H8", 44, -42, "L"], ["C4H10", 58, -1, "L"], ["C5H12", 72, 36, "L"], ["C6H14", 86, 69, "L"], ["C7H16", 100, 98, "L"], ["C8H18", 114, 126, "L"]], "Daljša kot je veriga, večja je površina molekule in močnejše so <b>disperzijske (Londonove) sile</b>. Vrelišče narašča."],
  halogeni: ["halogeni", [["F2", 38, -188, "L"], ["Cl2", 71, -34, "L"], ["Br2", 160, 59, "L"], ["I2", 254, 184, "L"]], "Večji atomi imajo več elektronov, ki se lažje premaknejo (so bolj polarizabilni). Disperzijske sile so močnejše: F₂ in Cl₂ sta plina, Br₂ tekočina, I₂ trdnina."],
  zlahtni: ["žlahtni plini", [["He", 4, -269, "L"], ["Ne", 20, -246, "L"], ["Ar", 40, -186, "L"], ["Kr", 84, -153, "L"], ["Xe", 131, -108, "L"]], "Med atomi žlahtnih plinov delujejo le šibke disperzijske sile. Helij ima najnižje vrelišče med vsemi snovmi."],
  masa: ["podobna molska masa", [["C3H8", 44, -42, "L", "propan"], ["CH3OCH3", 46, -24, "D", "dimetil eter"], ["CH3CHO", 44, 20, "D", "etanal"], ["C2H5OH", 46, 78, "V", "etanol"]], "Molekule so podobno velike, a etanol tvori <b>vodikove vezi</b> (skupina –OH), etanal in eter sta polarna (<b>dipol-dipol</b>), propan pa je nepolaren (le disperzijske sile)."],
};
const FORCE = { L: ["disperzijske sile", "b"], D: ["dipol-dipol", "c"], V: ["vodikove vezi", "danger"] };

export function medmolekulske(el) {
  const out = readout();
  const svg = svgBox(340, 250);
  let set = "hidridi", sel = null;
  const draw = () => {
    svg.replaceChildren();
    if (set === "hidridi") {
      const A = axes(svg, { W: 340, H: 250, x: [1.3, 5.4], y: [-180, 120], pad: 38, xStep: 1, yStep: 50, xLabel: "perioda", yLabel: "t_v / °C", xFmt: (v) => (v >= 2 && v <= 5 ? String(v) : "") });
      HIDRIDI.forEach(([name, col, pts], gi) => {
        s("path", { d: pts.map(([, t], i) => `${i ? "L" : "M"}${A.X(i + 2)} ${A.Y(t)}`).join(" "), class: `graph-line stroke-${col}` }, svg);
        pts.forEach(([f, t], i) => {
          s("circle", { cx: A.X(i + 2), cy: A.Y(t), r: 4, class: `fill-${col}` }, svg);
          if (i === 0) label(svg, A.X(2) + (gi === 2 ? 22 : -20), A.Y(t) + (gi === 1 ? 10 : 0), sub(f), "tick small b");
        });
        label(svg, 330, 170 + gi * 14, name, `tick small fill-${col}`, "end");
      });
    } else {
      const [, list] = NIZI[set];
      const tMin = Math.min(...list.map((x) => x[2])) - 20, tMax = Math.max(...list.map((x) => x[2])) + 20;
      const A = axes(svg, { W: 340, H: 250, x: [0, list.length], y: [Math.floor(tMin / 50) * 50, Math.ceil(tMax / 50) * 50], pad: 38, xStep: 100, yStep: 50, xLabel: "", yLabel: "t_v / °C", grid: true });
      const bw = (A.X(1) - A.X(0)) * 0.7;
      list.forEach(([f, M, t, k, nm], i) => {
        const x = A.X(i + 0.5) - bw / 2, y0 = A.Y(clamp(0, A.y0, A.y1)), y1 = A.Y(t);
        const r = s("rect", { x, y: Math.min(y0, y1), width: bw, height: Math.abs(y1 - y0), rx: 3, class: `bar fill-${FORCE[k][1]}` + (sel === i ? " on" : ""), opacity: sel === null || sel === i ? 0.85 : 0.4 }, svg);
        r.classList.add("drag");
        r.addEventListener("click", () => ((sel = i), draw(), info()));
        label(svg, A.X(i + 0.5), 236, sub(f), "tick small");
        label(svg, A.X(i + 0.5), t >= 0 ? y1 - 8 : y1 + 9, fmt(t, 0), "tick small");
      });
    }
  };
  const info = () => {
    if (set === "hidridi") {
      out.innerHTML = `<p>Vrelišča spojin z vodikom večinoma naraščajo s periodo (večje molekule, močnejše disperzijske sile). <b>H₂O, HF in NH₃</b> pa močno odstopajo navzgor: med njihovimi molekulami so <b>vodikove vezi</b>.</p><p class="muted">Brez vodikovih vezi bi voda vrela pri približno −80 °C in na Zemlji ne bi bilo tekoče vode.</p>`;
      return;
    }
    const [, list, text] = NIZI[set];
    const it = sel != null ? list[sel] : null;
    out.innerHTML = `<p>${text}</p>` + (it ? `<p><b>${it[4] || sub(it[0])}</b>: M = ${it[1]} g/mol, vrelišče ${fmt(it[2], 0)} °C, prevladujejo ${FORCE[it[3]][0]}.</p>` : `<p class="muted">Klikni stolpec za podrobnosti. Barva pove vrsto sil: turkizna disperzijske, vijolična dipol-dipol, rdeča vodikove vezi.</p>`);
  };
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [select({ label: "primerjava", options: [["hidridi", "spojine z vodikom (14.–17. skupina)"], ["alkani", "alkani"], ["halogeni", "halogeni elementi"], ["zlahtni", "žlahtni plini"], ["masa", "podobna molska masa"]], value: set, onChange: (v) => ((set = v), (sel = null), draw(), info()) })],
    out,
    tryText: "Zakaj ima voda (M = 18 g/mol) višje vrelišče kot H₂S (M = 34 g/mol)? Primerjaj še propan in etanol.",
  });
}

// ------------------------------------------------------------ oksidacijska: določanje oksidacijskih števil
const OX = [
  ["CO2", 0, "C", [["O", 2, -2]]], ["CH4", 0, "C", [["H", 4, 1]]], ["NH3", 0, "N", [["H", 3, 1]]], ["HNO3", 0, "N", [["H", 1, 1], ["O", 3, -2]]], ["NO2", 0, "N", [["O", 2, -2]]],
  ["NH4", 1, "N", [["H", 4, 1]]], ["NO3", -1, "N", [["O", 3, -2]]], ["H2SO4", 0, "S", [["H", 2, 1], ["O", 4, -2]]], ["SO2", 0, "S", [["O", 2, -2]]], ["H2S", 0, "S", [["H", 2, 1]]],
  ["SO4", -2, "S", [["O", 4, -2]]], ["KMnO4", 0, "Mn", [["K", 1, 1], ["O", 4, -2]]], ["MnO2", 0, "Mn", [["O", 2, -2]]], ["K2Cr2O7", 0, "Cr", [["K", 2, 1], ["O", 7, -2]]], ["Cr2O7", -2, "Cr", [["O", 7, -2]]],
  ["Fe2O3", 0, "Fe", [["O", 3, -2]]], ["FeO", 0, "Fe", [["O", 1, -2]]], ["HClO4", 0, "Cl", [["H", 1, 1], ["O", 4, -2]]], ["NaClO", 0, "Cl", [["Na", 1, 1], ["O", 1, -2]]], ["HCl", 0, "Cl", [["H", 1, 1]]],
  ["H2O2", 0, "O", [["H", 2, 1]]], ["NaH", 0, "H", [["Na", 1, 1]]], ["OF2", 0, "O", [["F", 2, -1]]], ["Cl2", 0, "Cl", []], ["PO4", -3, "P", [["O", 4, -2]]], ["CO3", -2, "C", [["O", 3, -2]]],
];
const RULE = { O: "kisik v spojinah: −2", H: "vodik z nekovinami: +1", K: "alkalijske kovine: +1", Na: "alkalijske kovine: +1", F: "fluor: vedno −1" };

export function oksidacijska(el) {
  const out = readout();
  const svg = svgBox(340, 150);
  let idx = 11, guess = 0;
  const cur = () => OX[idx];
  const xCount = () => parseCount(cur());
  const draw = () => {
    svg.replaceChildren();
    const [f, q, x, known] = cur();
    const parts = [[x, xCount(), guess, true], ...known.map(([e, n, v]) => [e, n, v, false])];
    // vrstni red kot v formuli
    const order = [];
    f.replace(/([A-Z][a-z]?)(\d*)/g, (_, e) => (order.includes(e) ? "" : order.push(e), ""));
    const list = order.map((e) => parts.find((p) => p[0] === e)).filter(Boolean);
    const w = 70, x0 = 170 - (list.length * w) / 2;
    list.forEach(([e, n, v, unk], i) => {
      const cx = x0 + i * w + w / 2;
      s("rect", { x: cx - 26, y: 24, width: 52, height: 30, rx: 8, class: unk ? "ox-chip unk" : "ox-chip" }, svg);
      label(svg, cx, 39, `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v)}`, "lbl big");
      label(svg, cx, 82, `${e}${n > 1 ? sub(String(n)) : ""}`, "lbl big");
      label(svg, cx, 112, `${n} · (${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v)}) = ${n * v > 0 ? "+" : n * v < 0 ? "−" : ""}${Math.abs(n * v)}`, "tick small");
    });
    if (q) label(svg, x0 + list.length * w + 8, 70, `${Math.abs(q) > 1 ? Math.abs(q) : ""}${q > 0 ? "+" : "−"}`, "lbl", "start");
  };
  const info = () => {
    const [f, q, x, known] = cur();
    const n = xCount(), sum = n * guess + known.reduce((a, [, k, v]) => a + k * v, 0), ok = sum === q;
    const sol = (q - known.reduce((a, [, k, v]) => a + k * v, 0)) / n;
    const special = f === "H2O2" ? "V peroksidih ima kisik −1." : f === "NaH" ? "V hidridih kovin ima vodik −1." : f === "OF2" ? "Fluor je bolj elektronegativen od kisika, zato ima kisik tu pozitivno število." : f === "Cl2" ? "V elementarni snovi je oksidacijsko število 0." : "";
    out.innerHTML =
      texBlock(`${[[x, n, guess], ...known].map(([e, k, v]) => `${k}\\cdot(${v > 0 ? "+" : ""}${v})`).join(" + ")} = ${sum} ${ok ? "=" : "\\neq"} ${q}`) +
      `<p>${ok ? `<b class="ok-text">Pravilno!</b> Oksidacijsko število ${x} v ${sub(f)}${q ? (q > 0 ? "⁺" : "⁻") : ""} je ${guess > 0 ? "+" : ""}${guess}.` : `Vsota oksidacijskih števil mora biti enaka naboju delca (${q}). Nastavi oksidacijsko število za ${x}.`}</p>
       <p class="muted">${known.map(([e]) => RULE[e]).filter((r, i, a) => r && a.indexOf(r) === i).join("; ")}${special ? ". " + special : ""}${Number.isInteger(sol) ? "" : ` (Rešitev ni celo število: ${fmt(sol, 2)}.)`}</p>`;
  };
  const sl = slider({ label: "ox. število", min: -4, max: 8, value: guess, format: (v) => (v > 0 ? "+" + v : String(v).replace("-", "−")), onInput: (v) => ((guess = v), draw(), info()) });
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      select({ label: "spojina ali ion", options: OX.map((o, i) => [i, `${sub(o[0])}${o[1] ? `${Math.abs(o[1]) > 1 ? "⁰¹²³"[Math.abs(o[1])] : ""}${o[1] > 0 ? "⁺" : "⁻"}` : ""}`]), value: idx, onChange: (v) => ((idx = +v), sl.set(0)) }),
      sl,
      buttons(button("Pokaži rešitev", () => { const [, q, , known] = cur(); sl.set((q - known.reduce((a, [, k, v]) => a + k * v, 0)) / xCount()); })),
    ],
    out,
    tryText: "Določi oksidacijsko število mangana v KMnO₄ in kroma v K₂Cr₂O₇. V kateri spojini ima kisik pozitivno oksidacijsko število?",
  });
}
function parseCount([f, , x]) {
  let n = 0;
  f.replace(/([A-Z][a-z]?)(\d*)/g, (_, e, k) => (e === x ? (n += k ? +k : 1) : 0, ""));
  return n;
}
