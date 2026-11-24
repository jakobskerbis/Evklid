// Fotografski prikaz poskusa lab-plamenska (plamenska reakcija): sloji iz scripts/lab-foto/prizor_plamenska.py, krmilnik
// in gradniki v foto.js (docs/laboratorij.md »Fotografski prikaz«). Plamen NI izrisan: obliko (svetel plamen s sajami,
// nesvetel z modrim notranjim stožcem) in barve (saje, CH/C₂, črte in pasovi soli, kobaltovo steklo) računamo iz modela
// (lab-model-reakcije.js) in jih narišemo v plast nad fotografijo, ki plapola. Iz modela so tudi barva in jakost
// obarvanega plamena, prepustnost kobaltovega stekla in pogled skozi spektroskop (riše ga motor); barva soli na urnem
// steklu je dokumentirana (CuCl₂·2H₂O modro zelen, drugi kloridi beli), izris je bel.
import { s, label } from "./kit.js";
import { barvaSpektra, spekterPlamena, spekterSoli, cmf, xyzRgb } from "./lab-model-reakcije.js";

export const OKNA_PLAMENSKA = { plamenska: [0, 0, 400, 300] };
export const SPEKTROSKOP_FOTO = [160, 8]; // okno spektroskopa (232 × 74) zgoraj desno, nad steno, stran od plamena in ročaja zanke

// Oblika plamena v mm (iste mere kot risba v lab-reakcije.js plamen(), 1 cm = 10 enot): višina, širina, notranji stožec
// (le pri odprti ali pol odprti odprtini; osnova = notranji premer cevi), meja sajastega dela (delež višine).
export const oblikaPlamena = (z) => ({ H: 120 - 40 * z, W: 24 - 6 * z, stozec: z >= 0.3 ? 25 + 20 * (1 - z) : 0, saje: z < 0.3 ? 0.06 : 0.45 });

// Barva soli na urnem steklu (sRGB): CuCl₂·2H₂O je modro zelen (#5fb3a0, kot v risbi), LiCl, NaCl, KCl, CaCl₂, SrCl₂ in
// BaCl₂ so beli (izris je bel, null = brez barve). Neznani vzorci imajo barvo svoje sestave, kot v risbi.
export const BARVA_SOLI = { Cu: [95, 179, 160] };
export function barvaVzorca(sestava) {
  const c = Object.keys(sestava).find((k) => BARVA_SOLI[k]);
  return c ? BARVA_SOLI[c] : null;
}

const rgb = (c, a) => (a == null ? `rgb(${c.map((v) => Math.round(v)).join(",")})` : `rgb(${c.map((v) => Math.round(v)).join(" ")} / ${+a.toFixed(3)})`);
const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const gam = (u) => 255 * (u <= 0.0031308 ? 12.92 * u : 1.055 * u ** (1 / 2.4) - 0.055);
// Svetilo z barvo modela (kromatičnost) in jakostjo J (svetlost / referenca): kot oko ali kamera nasiti svetle dele
// (svetel natrijev ali sajast plamen ima rumeno bel stržen), šibki ostanejo nasičene barve.
export const nasici = (c, J) => c.map((v) => gam(1 - Math.exp(-(1 + J) * lin(v))));
const Y_REF = 10; // svetlost Y za jakost 1 (natrij na zanki ~11,6 → rumeno oranžen, Cu ~1,1, Li ~0,16; sajast plamen ~52 → rumen)

// Barve plamena iz modela: saje (zvezni spekter ~1500 K), CH in C₂ (moder stožec in plašč), sol (črte in pasovi).
export function barvePlamena({ zrak, steklo = false, zanka = {}, vPlamenu = false }) {
  const sp = spekterPlamena(zrak);
  const saje = barvaSpektra(sp.filter((q) => q.vir === "saje"), { steklo });
  const ref = barvaSpektra(spekterPlamena(0).filter((q) => q.vir === "saje")).Y;
  const modri = barvaSpektra(sp.filter((q) => q.vir === "plamen"), { steklo }), modri0 = barvaSpektra(sp.filter((q) => q.vir === "plamen"));
  // skozi kobaltovo steklo ostane od soli malo svetlobe (Na ~0,1 %), zato barvo določi tudi moder plamen (kot barva() v modelu)
  const sol = vPlamenu ? barvaSpektra([...spekterSoli(zanka), ...(steklo ? sp.filter((q) => q.vir === "plamen") : [])], { steklo }) : null;
  return {
    saje: saje.Y > 0 ? nasici(saje.rgb, saje.Y / Y_REF) : null,
    sajeA: Math.min(0.92, (0.92 * saje.Y) / ref),
    modri: modri0.Y > 0 ? modri.rgb : null,
    modriF: modri0.Y > 0 ? modri.Y / modri0.Y : 0, // prepustnost kobaltovega stekla za modro svetlobo plamena
    sol: sol && sol.Y > 0 ? nasici(sol.rgb, sol.Y / Y_REF) : null,
  };
}
// Barva in prepustnost kobaltovega stekla za belo svetlobo (enakomeren spekter 380–780 nm) iz modela kobalt(λ).
export function kobaltovoSteklo() {
  const w = [];
  for (let l = 380; l <= 780; l += 5) w.push({ l, I: 1, w: 0 });
  const a = barvaSpektra(w), g = barvaSpektra(w, { steklo: true }), L = g.rgb.map(lin);
  const Yl = 0.2126 * L[0] + 0.7152 * L[1] + 0.0722 * L[2], T = g.Y / a.Y;
  return { rgb: L.map((v) => gam(Math.min(1, (v * T) / Yl))), T };
}
// Žareča nikromova žica v plamenu (~1300 K, sevanje črnega telesa): barva iz CIE 1931 kot v modelu.
export function zarenje(T = 1300) {
  let X = 0, Y = 0, Z = 0;
  for (let l = 380; l <= 780; l += 5) {
    const B = 1 / (l ** 5 * (Math.exp(1.4388e7 / (l * T)) - 1)), [x, y, z] = cmf(l);
    X += B * x; Y += B * y; Z += B * z;
  }
  return xyzRgb([X / Y, 1, Z / Y]);
}

// st: { zrak, prizgan, vPlamenu, steklo, zanka {el: n}, vid, sestava (vzorec na urnem steklu), imeVzorca, ocala }
// plast: plast motorja nad sliko (plastMehurckov: _sig, _uid), v njej plamen plapola in se zamenja le ob spremembi.
// spekter(g, x, y): motor nariše pogled skozi spektroskop (iz modela, kot v risbi) v okno na (x, y); false = brez.
export function risiPlamensko(o, meta, st, plast, spekter) {
  const S = meta.sidra.plamenska, g = o.okno("plamenska"), k = meta.merila.plamenska, kx = meta.merila.vodoravno;
  o.slika("plamenska", g);
  if (st.zrak > 0.75) o.slika("pl-zrak1", g);
  else if (st.zrak > 0.25) o.slika("pl-zrak05", g);
  // sol na urnem steklu: izris je bel, barvo doda maska (t = 0 v soli): 1 − (1 − t)(1 − c) = c + t(1 − c)
  const c = barvaVzorca(st.sestava);
  if (c) {
    const id = o.id("s");
    const f = s("filter", { id, x: 0, y: 0, width: 1, height: 1, "color-interpolation-filters": "sRGB" }, o.defs);
    const ct = s("feComponentTransfer", {}, f);
    ["R", "G", "B"].forEach((ch, i) => s(`feFunc${ch}`, { type: "linear", slope: +(1 - c[i] / 255).toFixed(4), intercept: +(c[i] / 255).toFixed(4) }, ct));
    o.slika("pl-sol-maska", g, { filter: `url(#${id})`, style: "mix-blend-mode:multiply" });
  }
  // zanka v plamenu ali na pultu; žari, ko je v gorečem plamenu; sol na zanki
  const vP = st.vPlamenu;
  o.slika(vP ? "pl-zanka-plamen" : "pl-zanka-miza", g);
  const [lx, ly] = vP ? S.zankaPlamen : S.zankaMiza, rz = (meta.zanka.premer / 2) * kx;
  const naZanki = Object.entries(st.zanka).filter(([, n]) => n > 0.01);
  if (vP && st.prizgan) s("circle", { cx: lx, cy: ly, r: rz, fill: "none", stroke: rgb(zarenje()), "stroke-width": meta.zanka.zica * kx * 1.6, class: "lab-foto-zari" }, g);
  if (naZanki.length) s("ellipse", { cx: lx, cy: ly + rz * 0.6, rx: rz * 0.8, ry: rz * 0.55, fill: rgb(barvaVzorca(Object.fromEntries(naZanki)) ?? [246, 246, 240], 0.95) }, g);
  // kobaltovo steklo 92 × 100 mm (kot risba) pred plamenom: pomnoži sliko z barvo prepuščene bele svetlobe
  const [ux, uy] = S.ustje;
  if (st.steklo) {
    const kb = kobaltovoSteklo(), x0 = ux - 46 * kx, y0 = uy - 110 * k;
    s("rect", { x: x0, y: y0, width: 92 * kx, height: 100 * k, rx: 2, fill: rgb(kb.rgb), style: "mix-blend-mode:multiply" }, g);
    const id = o.id("k"), lg = s("linearGradient", { id, x1: 0, y1: 0, x2: 1, y2: 1 }, o.defs); // odsev na steklu
    [[0, 0.16], [0.35, 0.03], [1, 0]].forEach(([q, a]) => s("stop", { offset: q, "stop-color": "#fff", "stop-opacity": a }, lg));
    s("rect", { x: x0, y: y0, width: 92 * kx, height: 100 * k, rx: 2, fill: `url(#${id})`, stroke: "rgb(150 170 230 / 0.7)", "stroke-width": 1 }, g);
    label(o.g, ux, y0 - 5, "kobaltovo steklo", "tick small");
  }
  if (st.prizgan) plamen(plast, meta, st);
  if (spekter) spekter(o.g, ...SPEKTROSKOP_FOTO);
  // napisi
  const yN = S.pult + 12;
  label(o.g, S.podnozje[0], yN, "plinski gorilnik", "lbl small");
  label(o.g, S.odprtina[0] - 14, S.odprtina[1] + 3, "zrak", "tick small", "end");
  label(o.g, S.hcl[0], yN, "HCl (konc.)", "lbl small");
  label(o.g, S.vzorec[0], yN, st.imeVzorca, "lbl small");
  if (!st.ocala) label(o.g, 280, 116, "brez zaščitnih očal", "lab-warn");
  const d = S.merilo20[1] - S.merilo20[0];
  s("path", { d: `M${392 - d},${yN + 8} V${yN + 12} H392 V${yN + 8}`, class: "lab-scale" }, o.g);
  label(o.g, 388 - d, yN + 12, "2 cm", "tick small", "end");
}

// Plamen v plasti nad sliko (enote okna; ustje gorilnika in merili iz meta.json).
function plamen(g, meta, st) {
  const S = meta.sidra.plamenska, k = meta.merila.plamenska, kx = meta.merila.vodoravno, [bx, ct] = S.ustje;
  const z = st.zrak, F = oblikaPlamena(z), b = barvePlamena(st), Hf = F.H * k, Wf = F.W * kx;
  const vid = st.vid ?? 0, salt = st.vPlamenu && vid > 0.05 && b.sol;
  g._sig.push(`F${z}|${b.sol?.map(Math.round).join() ?? ""}|${Math.round(vid * 20)}|${st.steklo}`);
  const d = s("defs", {}, g), uid = `${g._uid}-pf`;
  const grad = (id, stops, x2 = 0, y1 = 1) => {
    const lg = s("linearGradient", { id: `${uid}${id}`, x1: 0, y1, x2, y2: 0 }, d);
    for (const [o, c, a] of stops) s("stop", { offset: o, "stop-color": rgb(c), "stop-opacity": +a.toFixed(3) }, lg);
    return `url(#${uid}${id})`;
  };
  const obris = (w, h0, h1) => `M${bx - w / 2},${ct - h0} C${bx - w * 0.7},${ct - h0 - (h1 - h0) * 0.4} ${bx - w * 0.25},${ct - h0 - (h1 - h0) * 0.75} ${bx},${ct - h1} C${bx + w * 0.25},${ct - h0 - (h1 - h0) * 0.75} ${bx + w * 0.7},${ct - h0 - (h1 - h0) * 0.4} ${bx + w / 2},${ct - h0} Z`;
  const mz = s("filter", { id: `${uid}b`, x: -0.5, y: -0.2, width: 2, height: 1.4 }, d);
  s("feGaussianBlur", { stdDeviation: +(0.9 * kx).toFixed(2) }, mz); // mehak rob: plamen nima ostrega obrisa
  const fl = s("g", { filter: `url(#${uid}b)` }, s("g", { class: z < 0.3 ? "lab-rk-flame lab-rk-flame-s" : "lab-rk-flame", style: `transform-origin:${bx}px ${ct}px` }, g));
  // plašč (CH, C₂): v osvetljenem prostoru komaj viden; z odprtino bolj izrazit
  if (b.modri) {
    const a = (0.07 + 0.13 * z) * Math.min(1, b.modriF * 1.5);
    s("path", { d: obris(Wf, 0, Hf), fill: grad("m", [[0, b.modri, a * 1.6], [0.35, b.modri, a], [1, b.modri, 0]]) }, fl);
  } else {
    // zaprta odprtina: le droben moder pas ob ustju (zrak se primeša šele ob robu)
    s("path", { d: obris(meta.gorilnik.cev * kx * 1.05, 0, 6 * k), fill: "rgb(60 90 220 / 0.55)" }, fl);
  }
  // sajasti del: svetel, rumen; pri pol odprti odprtini le vrh
  if (b.saje && b.sajeA > 0.01) {
    const y0 = F.saje, a = b.sajeA, spodaj = nasici(b.saje.map((v) => v * 0.9), 0.5);
    s("path", { d: obris(Wf, F.saje * Hf * 0.2, Hf), fill: grad("s", [[0, spodaj, 0], [Math.min(0.5, y0 + 0.05), b.saje, a * 0.85], [0.55, b.saje, a], [0.85, spodaj, a * 0.6], [1, spodaj, 0]]) }, fl);
    if (z < 0.3) s("path", { d: obris(Wf * 0.35, 2 * k, Hf * 0.25), fill: "rgb(40 50 90 / 0.25)" }, fl); // neizgoreli plin nad ustjem (temnejši stržen)
  }
  // notranji stožec (osnova = notranji premer cevi)
  if (F.stozec && b.modri) {
    const w = (meta.gorilnik.cev - 2 * meta.gorilnik.stena) * kx, hc = F.stozec * k, a = (z >= 0.75 ? 0.7 : 0.45) * Math.min(1, b.modriF * 1.5);
    s("path", { d: `M${bx - w / 2},${ct} Q${bx - w * 0.38},${ct - hc * 0.7} ${bx},${ct - hc} Q${bx + w * 0.38},${ct - hc * 0.7} ${bx + w / 2},${ct} Z`, fill: grad("c", [[0, nasici(b.modri, 0.5), a * 0.5], [0.75, nasici(b.modri, 1.5), a], [1, nasici(b.modri, 3), a * 0.8]]) }, fl);
  }
  // sol: obarvan pramen od zanke navzgor (pare soli nosi plin), močnost kot v risbi
  if (salt) {
    const a = Math.min(0.92, 0.15 + vid * (z < 0.3 ? 0.4 : 0.85)), hz = Math.max(0, ct - S.zankaPlamen[1]);
    const h0 = Math.min(hz * 0.8, Hf * 0.5);
    s("path", { d: obris(Wf * 1.05, h0, Hf * 1.04), fill: grad("n", [[0, b.sol, 0], [0.2, b.sol, a], [0.75, b.sol, a * 0.8], [1, b.sol, 0]]) }, fl); // brez razreda lab-rk-salt (materiali.js mu doda zrnat vzorec)
  }
}
