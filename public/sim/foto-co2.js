// Fotografski prikaz poskusa lab-co2 (soda bikarbona in kislina, dokaz CO₂): sloji iz scripts/lab-foto/prizor_co2.py,
// krmilnik in gradniki v foto.js (docs/laboratorij.md »Fotografski prikaz«). Iz modela (lab-model.js Co2Bench) so:
// gladina tekočine v bučki, višina pene, masa sode na dnu (velikost kupčka), zamašek, motnost apnice (CaCO₃), mehurčki
// v bučki in epruveti, odčitka tehtnice in štoparice, plamen ali tleča trska z dimom. Izris je brezbarven, zasloni so
// prazni, plamena ni.
import { s, label } from "./kit.js";
import { visinaIzProstornine } from "./foto.js";
import { zarenje, nasici } from "./foto-plamenska.js";

export const OKNA_CO2 = { co2: [0, 0, 400, 300] };
// Lastna barva tekočine pri referenčni debelini 40 mm (ocena; model barve nima): limonin sok bledo rumen in rahlo moten,
// kis (5 %) bledo slamnat (kot risba, .lab-liq-kis), klorovodikova kislina in voda brezbarvni.
export const BARVE_TEKOCIN = {
  limona: { barva: [238, 225, 152], motnost: 0.18 },
  kis: { barva: [244, 237, 214], motnost: 0 },
  mesanica: { barva: [244, 237, 214], motnost: 0 },
};
export const MLEKO = [244, 244, 239]; // suspenzija CaCO₃ (bela oborina)
const rgb = (c, a) => (a == null ? `rgb(${c.map((v) => Math.round(v)).join(",")})` : `rgb(${c.map((v) => Math.round(v)).join(" ")} / ${+a.toFixed(3)})`);
const lin = (tab, x) => {
  for (let i = 1; i < tab.length; i++) if (tab[i][0] >= x) return tab[i - 1][1] + ((tab[i][1] - tab[i - 1][1]) * (x - tab[i - 1][0])) / (tab[i][0] - tab[i - 1][0] || 1);
  return tab[tab.length - 1][1];
};
export const zaslon = (v, d) => (v == null ? "" : v.toFixed(d).replace(".", ",").replace("-", "−"));
// Kupček sode: izris je 5 g; pri masi m je podobno telo z merilom (m / 5 g)^(1/3) (prostornina ∝ m pri isti nasipni gostoti).
export const meriloKupcka = (g, ref) => Math.min(1.2, Math.cbrt(Math.max(0, g) / ref));
// Višina pene nad notranjim dnom [mm]: tekočina + pena (mL) po pravi notranji obliki bučke, največ do vrha izrisane pene
// ali do spodnjega roba zamaška.
export function visinaPene(F, V, pena, strop) {
  return Math.min(F.penaMm, strop ?? Infinity, visinaIzProstornine(F.VodH, V + pena));
}

// st: { V, tekocina, pena (mL), soda (g), zamasek, epruveta, motnost, mehurcki [{h, f, r}], mehurckiEp [{h, s, r}],
//       trska { faza, out, t } | null, masa, cas (števili ali null), razlito (g) }
export function risiCo2(o, meta, st) {
  const S = meta.sidra.co2, g = o.okno("co2"), k = meta.merila.co2, kx = meta.merila.vodoravno, F = meta.bucka;
  const el = (meta.merila.visinaKamere.co2 * Math.PI) / 180;
  o.slika("co2", g);
  // izrezi z mehkim robom (1,5 enote): šum izrisa in stiskanje ne pustita vidnega pravokotnika
  const mehko = (ime, parent, rob = 1.5) => {
    const m = meta.sloji[ime], id = o.id("m"), fid = o.id("g");
    s("feGaussianBlur", { stdDeviation: rob / 2 }, s("filter", { id: fid, x: -0.2, y: -0.2, width: 1.4, height: 1.4 }, o.defs));
    const mk = s("mask", { id, maskUnits: "userSpaceOnUse", x: m.x, y: m.y, width: m.w, height: m.h }, o.defs);
    s("rect", { x: m.x + rob, y: m.y + rob, width: m.w - 2 * rob, height: m.h - 2 * rob, fill: "#fff", filter: `url(#${fid})` }, mk);
    return s("g", { mask: `url(#${id})` }, parent);
  };
  const [cx, yDno] = S.buckaDno;
  // ---- tekočina v bučki (polna slika, odrezana na gladini iz modela; barva po Beer–Lambertu)
  const hh = st.V > 0 ? Math.min(F.polnaMm, visinaIzProstornine(F.VodH, st.V)) : 0, yL = yDno - hh * k;
  if (hh > 0) {
    const m = meta.sloji["co2-bucka-polna"], B = BARVE_TEKOCIN[st.tekocina];
    o.tekocina("co2-bucka-polna", "co2-bucka-debelina", B?.barva ?? null, mehko("co2-bucka-polna", o.izrez(m.x, yL, m.w, m.y + m.h - yL, g)), B?.motnost ?? 0);
  }
  // ---- kupček sode na dnu (prosojen sloj, pomanjšan okoli središča dna)
  const f = meriloKupcka(st.soda, meta.soda.masa);
  if (f > 0.08) o.slika("co2-soda", g, { transform: `translate(${cx} ${yDno}) scale(${f.toFixed(4)}) translate(${-cx} ${-yDno})` });
  // ---- mehurčki v tekočini
  for (const b of st.mehurcki || []) {
    if (b.h <= 0 || b.h >= hh - 0.5) continue;
    const x = cx + b.f * lin(F.polmer, b.h) * kx, y = yDno - b.h * k, r = Math.max(0.5, b.r * k * 0.8);
    s("circle", { cx: x, cy: y, r, fill: "rgb(255 255 255 / 0.22)", stroke: "rgb(70 80 90 / 0.5)", "stroke-width": 0.35 }, g);
  }
  // ---- pena nad tekočino: slika bučke s peno med gladino in vrhom pene (zgornji rob valovit)
  const strop = st.zamasek !== "brez" ? (yDno - S.zamasek[1]) / k : null;
  const hp = hh > 0 ? visinaPene(F, st.V, st.pena, strop) : 0;
  const pena = hp - hh > 0.4;
  if (pena) {
    const m = meta.sloji["co2-pena"], yT = yDno - hp * k, a = Math.min(1.6, (hp - hh) * k * 0.3), n = 9;
    let d = `M${m.x},${yL + 0.6} V${yT}`;
    for (let i = 1; i <= n; i++) d += ` Q${m.x + (m.w * (i - 0.5)) / n},${yT - a * (i % 2 ? 1 : 0.4)} ${m.x + (m.w * i) / n},${yT}`;
    d += ` V${yL + 0.6} Z`;
    const id = o.id("p");
    s("path", { d }, s("clipPath", { id }, o.defs));
    o.slika("co2-pena", mehko("co2-pena", s("g", { "clip-path": `url(#${id})` }, g)));
  } else if (hh > 0) {
    // gladina od zgoraj (kamera 8° nad vodoravnico): svetla elipsa z robom meniska
    const r = lin(F.polmer, hh) * kx, ry = r * Math.sin(el), c = BARVE_TEKOCIN[st.tekocina]?.barva ?? [247, 250, 252];
    s("ellipse", { cx, cy: yL, rx: r, ry, fill: rgb(c.map((v) => 255 - (255 - v) * 0.5)), "fill-opacity": 0.28, stroke: "rgba(255,255,255,0.6)", "stroke-width": 0.3 }, g);
    s("path", { d: `M${cx - r},${yL} A${r},${ry} 0 0 0 ${cx + r},${yL}`, fill: "none", stroke: "rgba(40,50,60,0.35)", "stroke-width": 0.25 }, g);
  }
  // ---- pena, ki je prelila bučko (brez zamaška): curek po zunanji steni in luža na pultu desno od tehtnice
  if (st.razlito > 0.05 && st.zamasek === "brez") {
    const rv = (11 + 0.6) * kx, yV = S.buckaVrh[1], yC = yDno - 80 * k, xr = cx + 32 * kx;
    const run = `M${cx + rv},${yV + 1} V${yC} L${xr},${yDno + 2}`;
    s("path", { d: run, fill: "none", stroke: "rgb(150 150 140 / 0.45)", "stroke-width": 2.6, "stroke-linecap": "round" }, g);
    s("path", { d: run, fill: "none", stroke: "rgb(250 250 244 / 0.8)", "stroke-width": 1.8, "stroke-linecap": "round" }, g);
    const B = BARVE_TEKOCIN[st.tekocina]?.barva ?? [200, 214, 226];
    s("ellipse", { cx: S.tehtnica[0] + 98 * kx, cy: S.pult - 2, rx: Math.min(26, 8 + st.razlito * 3), ry: 2.6, fill: rgb(B.map((v) => v * 0.85), 0.55), stroke: "rgb(255 255 255 / 0.6)", "stroke-width": 0.5 }, g);
  }
  // ---- trska: goreča (plamen saj, ~1900 K) ali ugasla (tli, ~1000 K, dim)
  if (st.trska) {
    o.slika("co2-trska", g);
    plamenTrske(o, g, S, k, kx, st.trska);
  }
  // ---- zamašek (s cevko ali brez nje)
  if (st.zamasek === "cevka") o.slika("co2-cevka", mehko("co2-cevka", g));
  else if (st.zamasek === "zaprto") o.slika("co2-zaprto", mehko("co2-zaprto", g));
  // ---- epruveta: apnica (motnost CaCO₃ iz modela, maska iz sloja debeline); s cevko je cevka v njej
  const me = meta.sloji["co2-ep-debelina"], cev = st.zamasek === "cevka";
  if (cev || st.motnost > 0.01) o.tekocina(cev ? "co2-ep-cevka" : "co2", "co2-ep-debelina", MLEKO, mehko("co2-ep-debelina", g), Math.min(0.95, st.motnost));
  const E = meta.epruveta, [ex] = S.epruveta;
  if (cev) for (const b of st.mehurckiEp || []) {
    const h = meta.cevka.konicaMm + b.h, r = Math.min(1.6, b.r);
    if (b.h < 0 || h > E.gladinaMm - r) continue;
    s("circle", { cx: ex + Math.sign(b.s || 1) * (3.5 + 2.8 * Math.min(1, Math.abs(b.s))) * kx, cy: S.epruvetaDno - h * k, r: r * k, fill: "rgb(255 255 255 / 0.25)", stroke: "rgb(70 80 90 / 0.55)", "stroke-width": 0.35 }, g);
  }
  // ---- zasloni: besedilo v ravnini zaslona (afina preslikava vogalov: levo zgoraj, desno zgoraj, levo spodaj)
  const lcd = ([lz, dz, ls], [w, hh2], txt, enota) => {
    const mx = `matrix(${(dz[0] - lz[0]) / w} ${(dz[1] - lz[1]) / w} ${(ls[0] - lz[0]) / hh2} ${(ls[1] - lz[1]) / hh2} ${lz[0]} ${lz[1]})`;
    const zg = s("g", { transform: mx, fill: "rgb(24,28,24)", "font-family": "ui-monospace, Menlo, Consolas, monospace", "font-weight": 700 }, g);
    s("text", { x: w - 9, y: hh2 * 0.8, "font-size": hh2 * 0.72, "text-anchor": "end", class: "lab-foto-co2-lcd" }, zg, txt);
    s("text", { x: w - 2, y: hh2 * 0.8, "font-size": hh2 * 0.32, "text-anchor": "end" }, zg, enota);
  };
  lcd(S.lcdTehtnica, meta.zasloni.tehtnica, zaslon(st.masa, 2), "g");
  lcd(S.lcdStoparica, meta.zasloni.stoparica, zaslon(st.cas ?? 0, 1), "s");
  // ---- napisi
  const yN = S.pult + 12;
  label(o.g, S.tehtnica[0], yN, "tehtnica · 0,01 g", "lbl small");
  label(o.g, S.stoparica[0], yN, "štoparica", "lbl small");
  label(o.g, ex, yN, st.epruveta, "lbl small");
  if (st.epruveta === "apnica") label(o.g, ex + 13 * kx, S.epruvetaVrh + 12, st.motnost > 0.3 ? "motna" : "bistra", "lbl small", "start");
  const d = S.merilo20[1] - S.merilo20[0];
  s("path", { d: `M12,18 V22 H${12 + d} V18`, class: "lab-scale" }, o.g);
  label(o.g, 12 + d + 4, 22, "2 cm", "tick small", "start");
}

// Plamen trske v vratu bučke: svetel plamen saj (črno telo ~1900 K, CIE 1931 kot v foto-plamenska.js), ki v CO₂ v
// pol sekunde ugasne; nato konica tli (~1000 K) in se ohlaja, dim se dviga. Plapolanje iz časa modela (risba se obnovi
// 10-krat na sekundo).
function plamenTrske(o, g, S, k, kx, T) {
  const [tx, ty] = S.trska, f = T.faza ?? 0, t = T.t ?? 0;
  const ostane = T.out ? Math.max(0, 1 - f / 0.5) : 1;
  if (ostane > 0.02) {
    const H = 24 * k * ostane * (1 + 0.07 * Math.sin(t * 23) + 0.04 * Math.sin(t * 37)), W = 8 * kx * (0.6 + 0.4 * ostane) * (1 + 0.05 * Math.sin(t * 29));
    const y0 = ty + 2.5 * k, id = o.id("t"), fid = o.id("f");
    s("feGaussianBlur", { stdDeviation: 0.7 }, s("filter", { id: fid, x: -0.5, y: -0.3, width: 2, height: 1.6 }, o.defs));
    const lg = s("linearGradient", { id, x1: 0, y1: 1, x2: 0, y2: 0 }, o.defs);
    const jedro = nasici(zarenje(1900), 2.2), rob = nasici(zarenje(1500), 0.8);
    [[0, [90, 120, 230], 0.55], [0.18, jedro, 0.95], [0.6, rob, 0.85], [1, rob, 0]].forEach(([q, c, a]) => s("stop", { offset: q, "stop-color": rgb(c), "stop-opacity": a }, lg));
    s("path", { d: `M${tx - W / 2},${y0} C${tx - W * 0.7},${y0 - H * 0.4} ${tx - W * 0.2},${y0 - H * 0.75} ${tx + 1},${y0 - H} C${tx + W * 0.3},${y0 - H * 0.75} ${tx + W * 0.7},${y0 - H * 0.4} ${tx + W / 2},${y0} Q${tx},${y0 + 2 * k} ${tx - W / 2},${y0} Z`, fill: `url(#${id})`, filter: `url(#${fid})`, class: "lab-foto-co2-plamen" }, g);
  }
  if (T.out) {
    const zar = Math.exp(-f / 1.2);
    if (zar > 0.03) s("circle", { cx: tx, cy: ty, r: 1.4 * kx, fill: rgb(zarenje(1000)), opacity: +zar.toFixed(3), class: "lab-foto-co2-tli" }, g);
    for (let i = 0; i < 4; i++) {
      const q = f - i * 0.35;
      if (q <= 0) continue;
      const a = 0.32 * Math.exp(-q / 1.4);
      s("circle", { cx: tx + Math.sin(q * 2.1 + i) * 3, cy: ty - 6 * k - q * 14 * k, r: (2 + q * 2.2) * kx, fill: "rgb(150 150 150)", opacity: +a.toFixed(3) }, g);
    }
  }
}
