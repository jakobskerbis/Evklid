// Predloga datoteke Lean in branje izpisa (docs/lean.md, L5). Datoteko sestavi delavec sam: iz naloge vzame samo
// trditev, ki je prestala filter (trditev.mjs). Vsaka taktika je svoj izrek v svoji vrstici, za njim #print axioms.
import { TAKTIKE, DOVOLJENI_AKSIOMI, NAJVEC_SPOROCILA, preveriTrditev } from "./trditev.mjs";

const GLAVA = ["import Mathlib", "set_option autoImplicit false", "open Real"];
export const ime = (k) => `evklid_t${k + 1}`;
// Vrstica (od 1) izreka k in njegovega #print axioms.
const vrsticaIzreka = (k) => GLAVA.length + 1 + 2 * k;

/** Besedilo datoteke Lean za trditev. Vrže napako, če trditev ne prestane filtra (dvojna varovalka). */
export function predloga(trditev, taktike = TAKTIKE) {
  const f = preveriTrditev(trditev);
  if (!f.ok) throw new Error(`trditev zavrnjena: ${f.razlog}`);
  if (/[\r\n]/.test(f.trditev)) throw new Error("trditev zavrnjena: nova vrstica");
  const vrstice = [...GLAVA];
  taktike.forEach((t, k) => {
    if (!TAKTIKE.includes(t)) throw new Error(`taktika ${t} ni dovoljena`);
    vrstice.push(`theorem ${ime(k)} : ${f.trditev} := by intros; ${t}`, `#print axioms ${ime(k)}`);
  });
  return vrstice.join("\n") + "\n";
}

const skrajsaj = (s, n = NAJVEC_SPOROCILA) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

/**
 * Izid iz izpisa `lean --json` (eno sporočilo na vrstico). Izrek k je dokazan, ko v njegovi vrstici ni napake ne
 * opozorila o sorry in #print axioms našteje samo dovoljene aksiome. Prvi tak izrek zmaga.
 * Vrne { izid: "proved" | "failed", taktika?, aksiomi?, sporocilo }.
 */
export function preberiIzpis(izpis, taktike = TAKTIKE) {
  const sporocila = [];
  for (const v of String(izpis).split("\n")) {
    if (!v.trim().startsWith("{")) continue;
    try {
      const m = JSON.parse(v);
      if (m && typeof m === "object") sporocila.push(m);
    } catch {
      /* nepopolna vrstica (ubit proces) */
    }
  }
  const vVrstici = (n) => sporocila.filter((m) => m?.pos?.line === n);
  let prvaNapaka = sporocila.find((m) => m.severity === "error" && m.pos?.line <= GLAVA.length);
  for (let k = 0; k < taktike.length; k++) {
    const izrek = vVrstici(vrsticaIzreka(k));
    const napaka = izrek.find((m) => m.severity === "error" || /sorry/i.test(String(m.data)));
    if (napaka) {
      prvaNapaka ||= napaka;
      continue;
    }
    const ax = vVrstici(vrsticaIzreka(k) + 1).map((m) => String(m.data)).find((d) => d.includes(`'${ime(k)}'`));
    if (!ax) continue;
    let aksiomi;
    if (ax.includes("does not depend on any axioms")) aksiomi = [];
    else {
      const m = ax.match(/depends on axioms: \[([^\]]*)\]/);
      if (!m) continue;
      aksiomi = m[1].split(",").map((a) => a.trim()).filter(Boolean);
    }
    if (aksiomi.some((a) => !DOVOLJENI_AKSIOMI.includes(a))) continue;
    return { izid: "proved", taktika: taktike[k], aksiomi, sporocilo: `dokazano s taktiko ${taktike[k]}` };
  }
  const opis = prvaNapaka ? String(prvaNapaka.data) : "nobena taktika ni dokazala trditve";
  return { izid: "failed", sporocilo: skrajsaj(`nobena taktika ni uspela; prva napaka: ${opis}`) };
}

/** Sporočilo brez poti na disku in uporabniškega imena (pošlje se na strežnik). */
export function ocistiSporocilo(s, poti = []) {
  let out = String(s ?? "");
  for (const p of poti.filter(Boolean).sort((a, b) => b.length - a.length)) out = out.split(p).join("…");
  out = out.replace(/[A-Za-z]:\\Users\\[^\\\s]+/gi, "…").replace(/\/(?:home|Users)\/[^/\s]+/g, "…");
  out = out.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "");
  return skrajsaj(out);
}
