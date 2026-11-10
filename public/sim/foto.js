// Fotografski prikaz laboratorija (docs/laboratorij.md »Fotografski prikaz«): vnaprej izrisani sloji iz Blenderja
// (scripts/lab-foto/, Cycles) namesto risbe za lab-titracija, lab-dokaz in lab-ohm. Privzeto IZKLOPLJENO.
// Modeli poskusov se ne spremenijo: gladino, barvo, vezavo in odčitke še vedno računa model, tu jih le položimo na
// sliko. Kamera izrisa je ortografska (stalno merilo), zato so sidra v meta.json linearna preslikava mm → enote risbe.
//   - gladina: slika »polne« posode je odrezana na višini iz modela (spodnji rob meniska), pri valjastih posodah
//     (bireta) je pas z meniskom premaknjen na to višino;
//   - barva raztopine: Beer–Lambert po slikovnih točkah. Sloj debeline hrani t = exp(−L/Lref); filter potencira
//     t^(−ln c) = c^(L/Lref) za vsak kanal (c = barva iz modela pri debelini Lref) in rezultat pomnoži s sliko;
//   - rezerva: dokler slike niso naložene, brez povezave, pri »manj podatkov« (varčevanje s podatki, lite) in ko je
//     stikalo izklopljeno, ostane risana različica (motor nariše sam, ko risi() vrne false).
// Stikalo: localStorage evklid.lab.foto = "1" (gumb s fotoaparatom se pokaže šele, ko ključ obstaja; ?labfoto=1 ga
// ustvari in vklopi, ?labfoto=0 ga izbriše).
import { h, s, label } from "./kit.js";
import SL from "../i18n/sl.js";
import { icon } from "../icons.js";

let t = (k) => String(SL[k] ?? k);
if (typeof document !== "undefined") import("../i18n.js").then((m) => (t = m.t)).catch(() => {});

export const FOTO_KEY = "evklid.lab.foto";
const beri = () => { try { return localStorage.getItem(FOTO_KEY); } catch { return null; } };
const pisi = (v) => { try { v == null ? localStorage.removeItem(FOTO_KEY) : localStorage.setItem(FOTO_KEY, v); } catch {} };
if (typeof location !== "undefined") {
  const q = new URLSearchParams(location.search).get("labfoto");
  if (q === "1") pisi("1");
  else if (q === "0") pisi(null);
}
// »Manj podatkov«: varčevanje s podatki v brskalniku, počasna zveza ali varčni način aplikacije (razred .lite).
export const varcno = () => {
  const c = typeof navigator !== "undefined" ? navigator.connection : null;
  return !!(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ""))) || (typeof document !== "undefined" && document.documentElement.classList.contains("lite"));
};
export const fotoNaVoljo = () => beri() != null;
export const fotoVklopljen = () => beri() === "1" && !varcno();

// ---------------------------------------------------------------- nalaganje (leno: šele ko je prikaz vklopljen)
const OSNOVA = new URL("./foto/", import.meta.url);
const paketi = new Map();
let avif = null;
function podpiraAvif() {
  if (avif) return avif;
  avif = new Promise((res) => {
    const i = new Image();
    i.onload = () => res(i.width === 1);
    i.onerror = () => res(false);
    i.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=";
  });
  return avif;
}
// Gostota slik (px na enoto risbe): telefon z gostim zaslonom 3×, običajen 2×, redek zaslon 1× (na širokem oknu 2×).
export function gostota(na_voljo = [1, 2], dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 2, sirina = typeof window !== "undefined" ? window.innerWidth : 0) {
  const zeli = dpr >= 2.5 ? 3 : dpr >= 1.5 || sirina >= 900 ? 2 : 1;
  return Math.max(...na_voljo.filter((g) => g <= zeli), Math.min(...na_voljo));
}
function nalozi(poskus) {
  if (paketi.has(poskus)) return paketi.get(poskus);
  const p = (async () => {
    const [meta, av] = await Promise.all([fetch(new URL(`${poskus}/meta.json`, OSNOVA)).then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status)))), podpiraAvif()]);
    const g = gostota(meta.gostote), kon = av && meta.formati.includes("avif") ? "avif" : "webp";
    const url = (ime) => new URL(`${poskus}/${ime}@${g}x.${meta.sloji[ime].brezIzgub ? "webp" : kon}`, OSNOVA).href;
    const pred = (ime) => new Promise((res, rej) => { const i = new Image(); i.onload = res; i.onerror = rej; i.src = url(ime); });
    await Promise.all(meta.nujni.map(pred)); // osnovni sloji pred prvim prikazom; drugi se naložijo, ko jih stanje potrebuje
    return { meta, url, pred };
  })();
  p.catch(() => paketi.delete(poskus)); // brez povezave: ostane risba, ob naslednjem vklopu poskusi znova
  paketi.set(poskus, p);
  return p;
}

// ---------------------------------------------------------------- gradniki
const rgb = (c) => `rgb(${c.map((v) => Math.round(v)).join(",")})`;
export const eksponent = (v) => -Math.log(Math.max(4, Math.min(255, v)) / 255);
// h(V): višina gladine [mm nad notranjim dnom] iz tabele [[h, V]] prave notranje oblike posode
export function visinaIzProstornine(tabela, V) {
  if (V <= 0) return 0;
  for (let i = 1; i < tabela.length; i++) {
    if (tabela[i][1] >= V) {
      const [h0, v0] = tabela[i - 1], [h1, v1] = tabela[i];
      return h0 + ((h1 - h0) * (V - v0)) / (v1 - v0 || 1);
    }
  }
  return tabela[tabela.length - 1][0];
}
const lin = (tab, x) => {
  for (let i = 1; i < tab.length; i++) if (tab[i][0] >= x) return tab[i - 1][1] + ((tab[i][1] - tab[i - 1][1]) * (x - tab[i - 1][0])) / (tab[i][0] - tab[i - 1][0] || 1);
  return tab[tab.length - 1][1];
};

class Oder {
  constructor(svg, paket, okna) {
    this.svg = svg; this.p = paket; this.okna = okna; this.n = 0;
    this.g = s("g", { class: "lab-foto" });
    this.defs = s("defs", {}, this.g);
  }
  zacni() {
    this.g.replaceChildren(this.defs);
    this.defs.replaceChildren();
    this.n = 0;
    this.svg.append(this.g);
  }
  id(k) { return `${this.svg.uid}-f${k}${this.n++}`; }
  okno(ime, naslov) {
    const [x, y, w, hh] = this.okna[ime];
    const id = this.id("o");
    s("rect", { x: 0, y: 0, width: w, height: hh, rx: 8 }, s("clipPath", { id }, this.defs));
    const zunaj = s("g", { transform: `translate(${x} ${y})` }, this.g);
    const g = s("g", { "clip-path": `url(#${id})` }, zunaj);
    if (naslov) label(zunaj, w / 2, -12, naslov, "tick", "middle");
    g.okvir = () => s("rect", { x: 0, y: 0, width: w, height: hh, rx: 8, fill: "none", stroke: "var(--border)", "stroke-width": 1.5 }, zunaj);
    g.zunaj = zunaj;
    return g;
  }
  slika(ime, parent, extra = {}) {
    const m = this.p.meta.sloji[ime];
    return s("image", { href: this.p.url(ime), x: m.x, y: m.y, width: m.w, height: m.h, preserveAspectRatio: "none", ...extra }, parent);
  }
  izrez(x, y, w, hh, parent) {
    const id = this.id("c");
    s("rect", { x, y, width: w, height: Math.max(0, hh) }, s("clipPath", { id }, this.defs));
    return s("g", { "clip-path": `url(#${id})` }, parent);
  }
  // Tekočina: slika polne posode + sloj debeline, obarvan po Beer–Lambertu in pomnožen s sliko.
  tekocina(polna, debelina, barva, parent, motnost = 0) {
    const g = s("g", { style: "isolation:isolate" }, parent);
    this.slika(polna, g);
    if (!barva) return g;
    const id = this.id("b");
    const f = s("filter", { id, x: 0, y: 0, width: 1, height: 1, "color-interpolation-filters": "sRGB" }, this.defs);
    const ct = s("feComponentTransfer", {}, f);
    ["R", "G", "B"].forEach((k, i) => s(`feFunc${k}`, { type: "gamma", amplitude: 1, exponent: eksponent(barva[i]).toFixed(4), offset: 0 }, ct));
    this.slika(debelina, g, { filter: `url(#${id})`, style: "mix-blend-mode:multiply" });
    if (motnost > 0) {
      // motna raztopina ali oborina (npr. Cu₂O pri Fehlingu): neprosojna barva tam, kjer je tekočina (maska iz debeline)
      const mid = this.id("m"), fid = this.id("n");
      const mf = s("filter", { id: fid, x: 0, y: 0, width: 1, height: 1, "color-interpolation-filters": "sRGB" }, this.defs);
      const mc = s("feComponentTransfer", {}, mf);
      ["R", "G", "B"].forEach((k) => s(`feFunc${k}`, { type: "linear", slope: -4, intercept: 4 }, mc));
      const md = this.p.meta.sloji[debelina];
      this.slika(debelina, s("mask", { id: mid, maskUnits: "userSpaceOnUse", x: md.x, y: md.y, width: md.w, height: md.h, style: "mask-type:luminance" }, this.defs), { filter: `url(#${fid})` });
      // oborina se useda: proti dnu gostejša in temnejša
      const gid = this.id("u"), gr = s("linearGradient", { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, this.defs);
      s("stop", { offset: 0.45, "stop-color": rgb(barva), "stop-opacity": motnost * 0.75 }, gr);
      s("stop", { offset: 0.86, "stop-color": rgb(barva), "stop-opacity": Math.min(1, motnost * 1.2) }, gr);
      s("stop", { offset: 0.97, "stop-color": rgb(barva.map((v) => v * 0.72)), "stop-opacity": Math.min(1, motnost * 1.7) }, gr);
      s("rect", { x: md.x, y: md.y, width: md.w, height: md.h, fill: `url(#${gid})`, mask: `url(#${mid})` }, g);
    }
    return g;
  }
}

// ---------------------------------------------------------------- krmilnik za en poskus
// fotoPoskus(ime, svg, el, ponovno): risi(narisi) → true, če je fotografija narisana; false → motor nariše risbo.
export function fotoPoskus(poskus, svg, el, ponovno, okna) {
  let oder = null, cakam = false;
  const zacni = () => {
    if (oder || cakam || !fotoVklopljen()) return;
    cakam = true;
    nalozi(poskus).then((p) => { oder = new Oder(svg, p, okna); cakam = false; ponovno(); }, () => { cakam = false; });
  };
  if (fotoNaVoljo() && el) {
    queueMicrotask(() => {
      const st = el.querySelector(".demo-stage");
      if (!st || st.querySelector(".lab-foto-gumb")) return;
      const btn = h("button", { type: "button", class: "lab-foto-gumb", "aria-label": t("sim.lab.foto"), title: t("sim.lab.foto"), "aria-pressed": String(beri() === "1"), html: icon("camera"),
        style: "position:absolute;top:0;inset-inline-start:0;z-index:1;display:grid;place-items:center;width:40px;height:40px;min-height:40px;padding:0;border-radius:50%;border:1px solid var(--border);background:color-mix(in srgb,var(--surface) 90%,transparent);color:var(--muted)" });
      const kazi = () => { const on = beri() === "1"; btn.setAttribute("aria-pressed", String(on)); btn.style.color = on ? "var(--accent)" : "var(--muted)"; };
      btn.addEventListener("click", () => { pisi(beri() === "1" ? "0" : "1"); kazi(); zacni(); ponovno(); });
      kazi();
      if (getComputedStyle(st).position === "static") st.style.position = "relative";
      st.append(btn);
    });
  }
  zacni();
  return {
    get pripravljen() { return !!oder && fotoVklopljen(); },
    risi(narisi) {
      if (!fotoVklopljen()) return false;
      if (!oder) return zacni(), false;
      oder.zacni();
      svg.classList.add("lab-foto-on");
      narisi(oder, oder.p.meta);
      return true;
    },
  };
}

// ================================================================ TITRACIJA
export const OKNA_TITRACIJA = { celota: [0, 0, 200, 566], menisk: [206, 26, 188, 236], blizu: [206, 290, 188, 254] };
// st: { polna, R, pipa, mehur, V (mL v bučki), barva [r,g,b] | null, ph, blisk, bliskBarva, kapljice [{y}], curek, miruje }
export function risiTitracijo(o, meta, st) {
  const S = meta.sidra, B = meta.bireta, F = meta.bucka;
  // ---- celota
  const a = o.okno("celota"), A = S.celota;
  o.slika("celota", a);
  if (st.ph) o.slika("celota-el", a);
  const yR = (R) => A.bireta0[1] + ((A.bireta50[1] - A.bireta0[1]) * R) / 50;
  const pxMl = (A.bireta50[1] - A.bireta0[1]) / 50;
  if (st.polna) {
    const m = meta.sloji["celota-bireta-polna"], yL = yR(st.R), yF = yR(B.polnaDo), pas = B.meniskMm * (pxMl / B.mmNaML) + 1.5;
    if (yL + 2 < A.pipaVrh[1] - 4) {
      o.slika("celota-bireta-polna", o.izrez(m.x, yL + 2, m.w, m.y + m.h - yL - 2, a));
      o.slika("celota-bireta-polna", o.izrez(m.x, yL - pas, m.w, pas + 2.05, a), { transform: `translate(0 ${(yL - yF).toFixed(2)})` });
    } else o.slika("celota-bireta-polna", o.izrez(m.x, yL, m.w, m.y + m.h - yL, a));
  }
  if (st.pipa !== "zaprta") o.slika(st.polna ? "celota-pipa-odprta-polna" : "celota-pipa-odprta", a);
  const kMm = (S2) => (S2.buckaDno[1] - S2.buckaVrh[1]) / (meta.bucka.visina - F.dno);
  const tekocinaBucke = (g, S2, polna, debelina) => {
    if (!(st.V > 0)) return null;
    const hh = Math.min(F.polnaMm, visinaIzProstornine(F.VodH, st.V)), k = kMm(S2), y = S2.buckaDno[1] - hh * k, m = meta.sloji[polna];
    const r = lin(F.polmer, hh) * k / Math.cos((meta.merila.visinaKamere.celota * Math.PI) / 180), ry = r * Math.sin((meta.merila.visinaKamere.celota * Math.PI) / 180);
    o.tekocina(polna, debelina, st.barva, o.izrez(m.x, y, m.w, m.y + m.h - y, g));
    // gladina od zgoraj (kamera 6° nad vodoravnico): svetla elipsa z robom meniska
    const c = st.barva || [247, 250, 252];
    s("ellipse", { cx: S2.buckaDno[0], cy: y, rx: r, ry, fill: rgb(c.map((v) => 255 - (255 - v) * 0.5)), "fill-opacity": 0.28, stroke: "rgba(255,255,255,0.6)", "stroke-width": Math.max(0.25, k * 0.22) }, g);
    s("path", { d: `M${S2.buckaDno[0] - r},${y} A${r},${ry} 0 0 0 ${S2.buckaDno[0] + r},${y}`, fill: "none", stroke: "rgba(40,50,60,0.35)", "stroke-width": Math.max(0.2, k * 0.18) }, g);
    return { y, k, r };
  };
  tekocinaBucke(a, A, st.ph ? "celota-el-polna" : "celota-bucka-polna", "celota-bucka-debelina");
  if (st.mehur > 0 && st.polna) s("ellipse", { cx: A.konica[0], cy: A.konica[1] - 26, rx: 1.3, ry: 4, fill: "rgba(255,255,255,0.85)", stroke: "rgba(60,70,80,0.6)", "stroke-width": 0.4 }, a);
  label(o.g, A.pipeta[0], A.pipeta[1] - 20, "pipeta", "lbl small");
  label(o.g, A.pipeta[0], A.pipeta[1] - 7, "25 mL", "lbl small");
  label(o.g, A.bireta0[0] + 10, A.bireta0[1] - 30, "bireta 50 mL", "lbl small", "start");
  label(o.g, A.buckaDno[0] + 6, A.pult[1] + 13, "erlenmajerica 100 mL", "lbl small");
  s("line", { x1: 40, y1: 24, x2: 40 + (A.merilo100[1] - A.merilo100[0]), y2: 24, class: "lab-scale" }, o.g);
  s("text", { x: 40 + (A.merilo100[1] - A.merilo100[0]) / 2, y: 18, class: "lbl small", "text-anchor": "middle" }, o.g, "10 cm");

  // ---- menisk, povečan 15× (kamera v višini meniska: odčitek na spodnjem robu brez paralakse)
  const z = o.okno("menisk", "menisk, povečano 15×"), Z = S.menisk, [, , ZW, ZH] = o.okna.menisk;
  const pxNaMl = B.mmNaML * meta.merila.menisk, mid = Z.gladina[1];
  const c = st.polna ? Math.min(50, Math.max(0, st.R)) : 0.8, Y = (v) => mid + (v - c) * pxNaMl;
  if (st.polna && st.R <= 51.2) {
    const d = Y(st.R) - mid;
    // nad in pod sliko (ko je gladina nad ničlo ali pod 50): enakomeren del cevi, raztegnjen
    if (d > 0.5) o.slika("menisk", s("svg", { x: 0, y: 0, width: ZW, height: d + 1, viewBox: `0 2 ${ZW} 30`, preserveAspectRatio: "none" }, z));
    if (d < -0.5) o.slika("menisk", s("svg", { x: 0, y: ZH + d - 1, width: ZW, height: -d + 1, viewBox: `0 ${ZH - 32} ${ZW} 30`, preserveAspectRatio: "none" }, z));
    o.slika("menisk", z, { transform: `translate(0 ${d.toFixed(2)})` });
  } else o.slika("menisk-prazna", z);
  // lestvica (tisk na sprednji strani stekla): cel mL obroč, 0,5 mL srednja, 0,1 mL kratka črta; lege iz modela
  const tl = Z.levoZunaj, tr = Z.desnoZunaj, sr = (tl + tr) / 2, w = tr - tl, JANTAR = "rgb(188,128,12)";
  for (let i = Math.ceil((c - 1.4) * 10); i <= Math.floor((c + 1.4) * 10); i++) {
    if (i < 0 || i > 500) continue;
    const y = Y(i / 10), cel = i % 10 === 0, pol = i % 5 === 0, d = (pol ? 0.36 : 0.24) * w, x0 = sr - 0.06 * w;
    s("line", { x1: cel ? tl + 1.5 : x0 - d, y1: y, x2: cel ? tr - 1.5 : x0 + d, y2: y, stroke: JANTAR, "stroke-opacity": 0.92, "stroke-width": cel ? 2.8 : 2.4, "stroke-linecap": "round" }, z);
    if (cel) s("text", { x: tr - 0.2 * w, y: y - 6, fill: JANTAR, "fill-opacity": 0.95, "font-size": 19, "font-weight": 700, "text-anchor": "middle", style: "font-variant-numeric:tabular-nums" }, z, String(i / 10));
  }
  z.okvir();
  if (!st.polna) label(z.zunaj, sr, mid + 40, "prazna", "lbl small");
  else {
    const ym = Y(st.R);
    s("path", { d: `M8,${ym} q8,-7 16,0 q-8,7 -16,0 z`, class: "lab-tit-eye" }, z.zunaj);
    s("circle", { cx: 16, cy: ym, r: 2.4, class: "lab-tit-pupil" }, z.zunaj);
    s("line", { x1: 26, y1: ym, x2: tl - 6, y2: ym, class: "lab-tit-sight" }, z.zunaj);
  }

  // ---- erlenmajerica od blizu
  const b = o.okno("blizu", "erlenmajerica od blizu"), Bz = S.blizu;
  o.slika(st.ph ? "blizu-el" : "blizu", b);
  const gl = tekocinaBucke(b, Bz, st.ph ? "blizu-el-polna" : "blizu-polna", "blizu-debelina");
  const tx = Bz.konica[0], tip = Bz.konica[1], top = gl ? gl.y : Bz.buckaDno[1];
  if (gl && st.blisk > 0.05 && st.bliskBarva) {
    const fid = o.id("z");
    s("feGaussianBlur", { stdDeviation: 2.2 }, s("filter", { id: fid, x: -0.5, y: -0.5, width: 2, height: 2 }, o.defs));
    const globina = Bz.buckaDno[1] - top;
    s("ellipse", { cx: tx, cy: top + Math.min(8, globina / 2), rx: 8 + 10 * st.blisk, ry: Math.max(1, Math.min(globina / 2 - 1, 3 + 4 * st.blisk)), fill: rgb(st.bliskBarva), opacity: Math.min(0.8, st.blisk), filter: `url(#${fid})` }, b);
  }
  if (st.mehur > 0 && st.polna) {
    s("ellipse", { cx: tx, cy: 34, rx: 2.2, ry: 10, fill: "rgba(255,255,255,0.85)", stroke: "rgba(60,70,80,0.6)", "stroke-width": 0.6 }, b);
    label(b.zunaj, tx - 9, 34, "zrak", "lbl small", "end");
  }
  if (st.curek && st.polna && gl) s("line", { x1: tx, y1: tip, x2: tx, y2: top, stroke: "rgba(225,238,248,0.85)", "stroke-width": 2 }, b), s("line", { x1: tx - 0.5, y1: tip, x2: tx - 0.5, y2: top, stroke: "rgba(255,255,255,0.9)", "stroke-width": 0.6 }, b);
  const kaplja = (y) => {
    s("path", { d: `M${tx},${y - 4.2} C${tx + 3.4},${y} ${tx + 2.6},${y + 3.2} ${tx},${y + 3.2} C${tx - 2.6},${y + 3.2} ${tx - 3.4},${y} ${tx},${y - 4.2} Z`, fill: "rgba(214,230,242,0.8)", stroke: "rgba(70,90,110,0.55)", "stroke-width": 0.5 }, b);
    s("ellipse", { cx: tx - 0.9, cy: y + 0.6, rx: 0.6, ry: 1.3, fill: "rgba(255,255,255,0.95)" }, b);
  };
  if (!st.miruje) for (const d of st.kapljice || []) kaplja(tip + 4 + d.y * (top - tip - 4));
  else if (st.pipa === "kapljice") kaplja(tip + 5);
  b.okvir();
  if (st.ph) label(b.zunaj, Bz.elektroda[0] + 12, 22, "elektroda", "lbl small", "start");
  label(b.zunaj, Bz.ploscica[0], Bz.ploscica[1] + 19, "bela ploščica", "lbl small", "middle");
  const k2 = kMm(Bz) * 20;
  s("line", { x1: 12, y1: 24, x2: 12 + k2, y2: 24, class: "lab-scale" }, b.zunaj);
  s("text", { x: 12 + k2 / 2, y: 18, class: "lbl small", "text-anchor": "middle" }, b.zunaj, "2 cm");
}

// ================================================================ DOKAZNE REAKCIJE
export const OKNA_DOKAZ = { dokaz: [0, 0, 400, 220] };
// st: { stojalo: [{ rgb, t, p, motnost }], greje, ocala }
export function risiDokaz(o, meta, st) {
  const D = meta.sidra.dokaz, g = o.okno("dokaz");
  o.slika("dokaz", g);
  const m = meta.sloji["dokaz-polne"];
  D.epruvete.forEach(([x], i) => {
    const e = st.stojalo[i];
    if (!e) return;
    o.tekocina("dokaz-polne", "dokaz-debelina", e.rgb, o.izrez(x - D.polSirine - 1.5, m.y, 2 * D.polSirine + 3, m.h, g), e.motnost || 0);
    label(o.g, x, D.pult + 14, e.t, "lbl small");
    label(o.g, x, D.pult + 28, e.p, "lbl small");
  });
  if (st.greje) o.slika("dokaz-vre", g);
  label(o.g, D.kopel[0], D.pult + 14, st.greje ? "vrela vodna kopel" : "kopel (ne greje)", "lbl small");
  if (!st.ocala) label(o.g, 200, 16, "brez zaščitnih očal", "lab-warn");
  const d = D.merilo20[1] - D.merilo20[0];
  s("line", { x1: 376 - d, y1: 14, x2: 376, y2: 14, class: "lab-scale" }, o.g);
  s("text", { x: 376 - d - 5, y: 18, class: "lbl small", "text-anchor": "end" }, o.g, "2 cm");
}

// ================================================================ ELEKTRIČNI KROG (Ohmov zakon)
export const OKNA_KROG = { krog: [0, 0, 400, 250], makro: [4, 166, 120, 80] };
// Vodniki za vezavo iz modela (amPos, vmPos ∈ zaporedno | vzporedno | brez; obmocjeA "10" = priključek 10 A).
export function vodnikiKroga(amPos, vmPos, obmocjeA) {
  const Ap = obmocjeA === "10" ? "A10" : "AmA", v = [];
  const zap = [amPos === "zaporedno" && "A", vmPos === "zaporedno" && "V"].filter(Boolean);
  if (!zap.length) v.push("P-L1");
  else {
    v.push(zap[0] === "A" ? `P-${Ap}` : "P-VV");
    if (zap.length === 2) v.push("ACOM-VV", "VCOM-L1");
    else v.push(zap[0] === "A" ? "ACOM-L1" : "VCOM-L1");
  }
  v.push("L2-N");
  if (amPos === "vzporedno") v.push(`${Ap}-L1`, "ACOM-L2");
  if (vmPos === "vzporedno") v.push("VV-L1", "VCOM-L2");
  return v;
}
// st: { breme, tip "R"|"L", nom, zgorel, T, svetlost, amPos, vmPos, obmocjeA, obmocjeV, varovalka, cc, U, I, V (nizi za zaslone), dim(g, x, y) }
export function risiKrog(o, meta, st) {
  const K = meta.sidra.krog, g = o.okno("krog");
  o.slika("krog", g);
  const ima = (ime) => (meta.sloji[ime] ? (o.slika(ime, g), true) : false);
  if (st.obmocjeA !== "200m") ima(`krog-gumb-am-${st.obmocjeA}`);
  if (st.obmocjeV !== "20") ima(`krog-gumb-vm-${st.obmocjeV}`);
  const sprite = st.tip === "R" ? (st.zgorel ? "zgorel" : st.breme) : "L6";
  ima(`krog-breme-${sprite}`);
  const sv = st.tip === "L" && !st.zgorel ? Math.min(1, st.svetlost || 0) : 0;
  if (sv > 0.02) o.slika("krog-breme-L6-sveti", g, { opacity: sv.toFixed(2) });
  for (const v of vodnikiKroga(st.amPos, st.vmPos, st.obmocjeA)) ima(`krog-vod-${v}`);
  // zasloni: besedilo v ravnini zaslona (afina preslikava treh vogalov: levo zgoraj, desno zgoraj, levo spodaj)
  const zaslon = ([lz, dz, ls], [w, hh], txt, barva, sij) => {
    if (!txt) return;
    // enota = 1 mm na zaslonu: znaki so v ravnini zaslona in v pravem razmerju
    const m = `matrix(${(dz[0] - lz[0]) / w} ${(dz[1] - lz[1]) / w} ${(ls[0] - lz[0]) / hh} ${(ls[1] - lz[1]) / hh} ${lz[0]} ${lz[1]})`;
    s("text", { transform: m, x: w - 3, y: hh * 0.8, "font-size": hh * 0.82, "text-anchor": "end", fill: barva, "font-family": "ui-monospace, Menlo, Consolas, monospace", "font-weight": 700, stroke: sij || null, "stroke-width": sij ? 1.2 : null, style: sij ? "paint-order:stroke" : null }, g, String(txt).replace(".", ",").replace("-", "−"));
  };
  const Z = meta.zasloni;
  zaslon(K.psuZaslon, Z.psu, st.U, "rgb(255,84,60)", "rgba(255,60,40,0.3)");
  zaslon(K.amLcd, Z.am, st.I, "rgb(24,28,24)");
  zaslon(K.vmLcd, Z.vm, st.V, "rgb(24,28,24)");
  if (st.cc) s("circle", { cx: K.psuLed[0], cy: K.psuLed[1], r: 3.2, fill: "rgba(255,40,30,0.45)" }, g), s("circle", { cx: K.psuLed[0], cy: K.psuLed[1], r: 1.5, fill: "rgb(255,90,70)" }, g);
  const [bx, by] = K.breme;
  if (st.tip === "R" && !st.zgorel && st.T > 40) {
    const fid = o.id("v");
    s("feGaussianBlur", { stdDeviation: 1.6 }, s("filter", { id: fid, x: -1, y: -1, width: 3, height: 3 }, o.defs));
    s("ellipse", { cx: bx, cy: by, rx: 6, ry: 3, fill: "rgb(255,60,20)", opacity: Math.min(0.7, (st.T - 40) / 300), filter: `url(#${fid})` }, g);
  }
  if (sv > 0.02) {
    const fid = o.id("s");
    s("feGaussianBlur", { stdDeviation: 5 }, s("filter", { id: fid, x: -1.5, y: -1.5, width: 4, height: 4 }, o.defs));
    s("circle", { cx: bx, cy: by - 10, r: 6 + 12 * sv, fill: "rgb(255,214,140)", opacity: (0.15 + 0.5 * sv).toFixed(2), filter: `url(#${fid})`, style: "mix-blend-mode:screen" }, g);
  }
  if (st.zgorel && st.tip === "R" && st.dim) st.dim(g, bx, by - 8);
  // napisi
  label(o.g, K.psu[0] - 14, K.psu[1] + 8, "napajalnik", "lbl small");
  label(o.g, K.am[0], K.am[1] + 54, "ampermeter", "lbl small");
  if (st.varovalka) label(o.g, K.am[0], K.am[1] + 68, "pregorela varovalka", "lab-warn small");
  label(o.g, K.vm[0], K.vm[1] + 54, "voltmeter", "lbl small");
  const opis = st.tip === "R" ? `${st.nom} Ω${st.zgorel ? ", zgorel" : st.T > 90 ? ", vroč!" : ""}` : `žarnica 6 V${st.zgorel ? ", pregorela" : ""}`;
  label(o.g, bx, by + 34, opis, "lbl small");
  const d = K.merilo100[1] - K.merilo100[0];
  s("line", { x1: 392 - d, y1: 242, x2: 392, y2: 242, class: "lab-scale" }, o.g);
  s("text", { x: 392 - d / 2, y: 236, class: "lbl small", "text-anchor": "middle" }, o.g, "10 cm");
  // makro porabnika: barvni obročki so berljivi (IEC 60062)
  const m = o.okno("makro");
  s("rect", { x: 0, y: 0, width: 120, height: 80, fill: "#cfd3d4" }, m);
  if (st.tip === "R") o.slika(st.zgorel ? "makro-zgorel" : `makro-${st.breme}`, m);
  else {
    o.slika("makro-L6", m);
    if (sv > 0.02) o.slika("makro-L6-sveti", m, { opacity: sv.toFixed(2) });
  }
  m.okvir();
  label(m.zunaj, 60, 74, st.tip === "R" ? `povečano ${Math.round(meta.merila.makro / meta.merila.krog)}×` : `povečano ${String(Math.round((meta.merila.makroL / meta.merila.krog) * 10) / 10).replace(".", ",")}×`, "lbl small");
}
