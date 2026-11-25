// Fotografski prikaz poskusa lab-ph (pH snovi iz gospodinjstva): sloji iz scripts/lab-foto/prizor_ph.py, krmilnik in
// gradniki v foto.js (docs/laboratorij.md »Fotografski prikaz«). Iz modela (lab-model-indikatorji.js) so: barva
// izvlečka rdečega zelja v epruveti, barva indikatorskega papirja, lastna barva vzorca v čaši, gladini (PH_KOLICINE),
// lega elektrode in odčitek pH-metra; izris je brezbarven, zaslon pH-metra prazen.
import { s, label } from "./kit.js";
import { visinaIzProstornine } from "./foto.js";
import { PH_VZORCI, PH_KOLICINE, PAPIR } from "./lab-model-indikatorji.js";

export const OKNA_PH = { ph: [0, 0, 400, 202] };
const rgb = (c) => `rgb(${c.map((v) => Math.round(v)).join(",")})`;
export const PAPIR_SUH = [243, 239, 226]; // suh papir, kot v risbi (.lab-ind-paper, #f3efe2)

// Lastna barva vzorca v čaši: motni vzorci (mleko, milo, zobna pasta: svetla barva) sipljejo svetlobo, obarvani
// (kola, kava) jo vpijajo. Pri vpijanju je barva iz modela (barva z deležem a čez belo) barva plasti debeline Lref.
export function barvaVzorca(id) {
  const V = PH_VZORCI[id];
  if (!V?.barva) return { barva: null, motnost: 0 };
  if (Math.min(...V.barva) >= 200) return { barva: V.barva, motnost: V.a };
  return { barva: V.barva.map((c) => 255 - (255 - c) * V.a), motnost: 0 };
}
// Višina tekočine v epruveti [mm nad notranjim dnom]: polkroglasto dno + valj.
export function gladinaEpruvete(V, premer, stena) {
  const r = premer / 2 - stena, Vk = (2 / 3) * Math.PI * r ** 3, mm3 = V * 1000;
  if (mm3 > Vk) return r + (mm3 - Vk) / (Math.PI * r * r);
  let lo = 0, hi = r; // krogelni odsek V = πh²(3r − h)/3
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; (Math.PI * m * m * (3 * r - m)) / 3 < mm3 ? (lo = m) : (hi = m); }
  return (lo + hi) / 2;
}
export const zaslonPh = (v) => (v == null ? "–,––" : v.toFixed(2).replace(".", ",").replace("-", "−"));

// st: { vzorec, zelje: rgb | null, papir: rgb | null, elektroda (v vzorcu), cist, cal, ocala, odcitek }
export function risiPh(o, meta, st) {
  const S = meta.sidra.ph, g = o.okno("ph");
  o.slika("ph", g);
  const k = meta.merila.ph; // enot na mm višine (ortografska kamera)
  // polna posoda, odrezana nad gladino iz modela (rob pusti menisk in zgornji lok gladine, ki ju kamera vidi od zgoraj)
  const polna = (ime, deb, yGl, rob, barva, motnost) => {
    const m = meta.sloji[ime], y = yGl - rob;
    o.tekocina(ime, deb, barva, o.izrez(m.x, y, m.w, m.y + m.h - y, g), motnost);
  };
  // epruveta z izvlečkom rdečega zelja (2 mL vzorca + 2 mL izvlečka)
  if (st.zelje) {
    const E = meta.epruveta, h = gladinaEpruvete(PH_KOLICINE.epruvetaMl, E.premer, E.stena);
    const { motnost } = barvaVzorca(st.vzorec);
    polna("ph-epruveta-polna", "ph-epruveta-debelina", S.epruvetaDno - h * k, 4 * k, st.zelje, motnost / 2);
  }
  // čaša s 100 mL vzorca; elektroda v vzorcu ali dvignjena
  const C = meta.casa, hc = visinaIzProstornine(C.VodH, PH_KOLICINE.casaMl), yc = S.casaDno - hc * k;
  const rob = C.notranjiPolmer * k * Math.tan((meta.merila.visinaKamere.ph * Math.PI) / 180) + 4 * k;
  const { barva, motnost } = barvaVzorca(st.vzorec);
  if (st.elektroda) {
    o.slika("ph-el-v", g);
    polna("ph-el-v-polna", "ph-el-v-debelina", yc, rob, barva, motnost);
  } else {
    polna("ph-casa-polna", "ph-casa-debelina", yc, rob, barva, motnost);
    o.slika("ph-el-zunaj", g);
  }
  // indikatorski papir: suh trak, pomočeni konec (zgoraj) v barvi iz modela; papir je difuzen, zato množenje
  const [[px0, py0], [px1, py1]] = S.papir;
  s("rect", { x: px0, y: py0, width: px1 - px0, height: py1 - py0, fill: rgb(PAPIR_SUH), style: "mix-blend-mode:multiply" }, g);
  if (st.papir) s("rect", { x: px0, y: py0, width: px1 - px0, height: S.papirMokro - py0, fill: rgb(st.papir), style: "mix-blend-mode:multiply" }, g);
  // zaslon pH-metra: besedilo v ravnini zaslona (afina preslikava vogalov; enota = 1 mm na zaslonu)
  const [lz, dz, ls] = S.lcd, [w, hh] = meta.zaslon;
  const mx = `matrix(${(dz[0] - lz[0]) / w} ${(dz[1] - lz[1]) / w} ${(ls[0] - lz[0]) / hh} ${(ls[1] - lz[1]) / hh} ${lz[0]} ${lz[1]})`;
  const zg = s("g", { transform: mx, fill: "rgb(24,28,24)", "font-family": "ui-monospace, Menlo, Consolas, monospace", "font-weight": 700 }, g);
  s("text", { x: w - 13, y: hh * 0.78, "font-size": hh * 0.7, "text-anchor": "end", class: "lab-foto-ph-lcd" }, zg, zaslonPh(st.elektroda ? st.odcitek : null));
  s("text", { x: w - 2.5, y: hh * 0.78, "font-size": hh * 0.3, "text-anchor": "end" }, zg, "pH");
  if (!st.cal) s("text", { x: 3, y: hh * 0.3, "font-size": hh * 0.2 }, zg, "CAL ?");
  // napisi
  const yN = S.pult + 11;
  label(o.g, S.epruveta[0], yN, "rdeče zelje", "lbl small");
  label(o.g, (px0 + px1) / 2, py0 - 7, "papir", "lbl small"); // nad trakom: spodaj je napis epruvete
  label(o.g, S.casa[0], yN, "vzorec", "lbl small");
  label(o.g, S.meter[0], yN, st.cal ? "umerjen" : "ni umerjen", "tick small");
  if (!st.elektroda) label(o.g, S.elektrodaZunaj[0] + 10, S.elektrodaZunaj[1] - 4, st.cist ? "sprana" : "neoprana", "tick small", "start");
  if (!st.ocala) label(o.g, 72, 18, "brez zaščitnih očal", "lab-warn");
  const d = S.merilo20[1] - S.merilo20[0];
  s("path", { d: `M${392 - d},${yN - 4} V${yN} H392 V${yN - 4}`, class: "lab-scale" }, o.g);
  label(o.g, 388 - d, yN, "2 cm", "tick small", "end");
  // barvna lestvica papirja (kot v risbi; barve iz modela)
  const cw = 25;
  PAPIR.forEach((c, i) => (s("rect", { x: 12 + i * cw, y: 210, width: cw - 2, height: 18, rx: 2, fill: rgb(c) }, o.g), label(o.g, 12 + i * cw + (cw - 2) / 2, 238, String(i), "tick small")));
  label(o.g, 200, 252, "barvna lestvica indikatorskega papirja (pH)", "tick small");
}
