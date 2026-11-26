// Tematski zemljevid priprave (docs/priprava.md, PR 4): izseki → Evklidove teme, obseg testa, pokritost in predznanje.
// Brez AI: tema izseka je iskanje po kazalu tem (server/lekcija-za-vprasanje.js, IDF po naslovih, ciljih in lekcijah),
// isto kot pri »Mojih zapiskih« in šibkih točkah. Izsek, ki se z nobeno temo ne ujema dovolj jasno, ostane »samo v
// zapiskih« (ne ugibamo). Obseg testa je iz načrta testa (pot in sklopi); brez načrta obsega ni, so samo teme zapiskov.
// Predznanje: teme iste poti pred prvim sklopom testa (učni načrt gre od lažjega k težjemu); brez trditev o znanju.
import { getPath, getTopic, listPaths } from "../curriculum.js";
import { ravenKeeps, ravenProfila } from "../exams.js";
import { rankLessons, searchOn, levelOf, terms } from "../lekcija-za-vprasanje.js";

const MIN_SCORE = 4.5; // kot lessonForQuestion / topicForName
const MIN_LEAD = 1.2;
const OBSEG_DELEZ = 0.8; // tema iz obsega testa ima prednost, če ima vsaj 80 % ocene najboljše
export const PREDZNANJE = 5;
const IZSEK_ZNAKOV = 400;
export const MAX_IZSEKOV = 5000; // več izsekov (zelo dolgi viri) zemljevid ne pregleda: delno

// Formula v iskanju: ukazi LaTeX, ki povedo snov, postanejo besede (\\int → integral), ostalo odpade.
// Ena beseda na formulo, po prednosti (\\lim sin x / x je limita, ne kotne funkcije); \\sqrt ne pove snovi
// (rešitev kvadratne enačbe, Pitagorov izrek).
const LATEX_BESEDE = { int: "integral", iint: "integral", oint: "integral", lim: "limita", sum: "vsota", prod: "produkt", det: "determinanta", binom: "binomski", vec: "vektor", log: "logaritem", ln: "logaritem", sin: "kotne funkcije", cos: "kotne funkcije", tan: "kotne funkcije" };
const LATEX_RED = Object.keys(LATEX_BESEDE);
const brezFormul = (t) =>
  String(t || "").replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g, (f) => {
    // Integral z mejama je določeni, brez mej nedoločeni.
    const int = /\\int\s*_/.test(f) ? "določeni integral" : /\\int\b/.test(f) ? "nedoločeni integral" : "";
    const ukazi = new Set([...f.matchAll(/\\([a-z]+)/g)].map((m) => m[1]));
    const prvi = LATEX_RED.find((c) => ukazi.has(c));
    return ` ${int || (prvi ? LATEX_BESEDE[prvi] : "")} `;
  });

/**
 * Tema enega izseka ali null. Najprej besedilo izseka (začetek), nato naslov razdelka (»Integrali«), ki velja za vse
 * izseke razdelka brez jasne lastne teme. obseg: Set id-jev tem testa ali null; tema iz obsega dobi prednost pred
 * sosednjo temo drugega sklopa z malo boljšo oceno.
 */
export function temaIzseka(izsek, settings, obseg = null, predpomnilnik = new Map()) {
  const iz = temaBesedila(brezFormul(izsek.besedilo).slice(0, IZSEK_ZNAKOV), settings, obseg);
  if (iz) return iz;
  const naslov = brezFormul(izsek.naslov).trim();
  if (!naslov) return null;
  if (!predpomnilnik.has(naslov)) predpomnilnik.set(naslov, temaBesedila(naslov, settings, obseg, true));
  return predpomnilnik.get(naslov);
}

function temaBesedila(tekst, settings, obseg, naslov = false) {
  const hits = rankLessons(tekst, settings).slice(0, 8);
  const [best, second] = hits;
  if (!best || !best.inTitle || best.score < MIN_SCORE) return null;
  const q = new Set(terms(tekst));
  const ujema = (h) => [...h.d.title].filter((w) => q.has(w));
  // Naslov, ki imenuje več tem (»Kemijske reakcije in množina snovi«, »Delo in energija«), ne da teme izsekom.
  if (naslov) {
    const b = new Set(ujema(best));
    if (hits.some((h) => h !== best && h.inTitle === h.d.title.size && ujema(h).every((w) => !b.has(w)))) return null;
  }
  // Tema iz obsega testa ima prednost le, kadar ni dvoumna: cel naslov, vsaj dve besedi naslova ali besede, ki jih nima
  // nobena druga tema zunaj obsega (sicer bi vse o »funkciji« pristalo pri »Kvadratni funkciji«).
  if (obseg) {
    const nedvoumna = (h) => {
      if (h.inTitle === h.d.title.size || h.inTitle >= 2) return true;
      const w = ujema(h);
      return hits.every((o) => o === h || obseg.has(o.d.id) || w.every((x) => !o.d.title.has(x)));
    };
    const v = hits.find((h) => obseg.has(h.d.id) && h.inTitle && h.score >= best.score * OBSEG_DELEZ && nedvoumna(h));
    if (v) return v.d.id;
  }
  const whole = best.inTitle === best.d.title.size;
  if (!whole && (best.inTitle === 1 || (second && best.score < second.score * MIN_LEAD))) return null;
  return best.d.id;
}

// Teme sklopov poti (sklopi so indeksi sklopov, kot v načrtu testa).
export function temeObsega(pot, sklopi) {
  const path = pot ? getPath(pot) : null;
  if (!path || !Array.isArray(sklopi)) return [];
  return [...new Set(sklopi)].filter((i) => Number.isInteger(i) && path.units[i]).sort((a, b) => a - b).flatMap((i) => path.units[i].topics);
}

const temaVen = (id) => {
  const t = getTopic(id);
  return t ? { id, ime: t.name, sklop: t.unit, pot: t.path } : null;
};

/**
 * Zemljevid priprave iz izsekov ([{ id, naslov, besedilo }], že odšifrirani).
 * Vrne { iskanje, obseg: [{ id, ime, sklop, izsekov }] | null, pokritost: { pokrite, vseh } | null,
 *        teme: [{ id, ime, sklop, pot, izseki: [id], vObsegu }], samoVZapiskih: [id izseka], predznanje: [...],
 *        izkljucene: [{ id, ime, sklop, pot }] }.
 */
export async function zemljevid({ pot = null, sklopi = null, predmet = null, izkljucene = [] }, izseki, settings = {}) {
  const path = pot ? getPath(pot) : null;
  // Obseg samo za šolske poti (OŠ, SŠ); tekmovalne poti niso v kazalu tem, zato zanje ni pokritosti.
  const sola = !!path && (path.school === "OS" || path.school === "SS");
  // Teme samo za višjo raven gredo iz obsega učenca na osnovni ravni (»4. letnik OR«), kot na Učni poti in v testu.
  const zaRaven = ravenKeeps(ravenProfila(pot, settings?.curriculum_level));
  // Teme, ki jih je učenec odstranil iz obsega (PR 7), niso v obsegu, pokritosti ne načrtu; ostanejo naštete v izkljucene,
  // da jih lahko vrne. Če bi odstranil vse, obseg ostane cel (test brez tem ni test).
  const vsiObsega = sola ? temeObsega(pot, sklopi).filter(zaRaven) : [];
  const ven = new Set(Array.isArray(izkljucene) ? izkljucene : []);
  const obsegTeme = vsiObsega.some((t) => !ven.has(t.id)) ? vsiObsega.filter((t) => !ven.has(t.id)) : vsiObsega;
  const st = { ...(settings || {}), subject: path?.subject || predmet || settings?.subject };
  // Kazalo tem je do učenčeve ravni; test višje poti (ali zastarela raven v profilu) išče do ravni poti.
  if (sola) {
    const lv = levelOf(st);
    const rang = (sol, raz) => (sol === "SS" ? 100 : 0) + raz;
    if (!lv || rang(path.school, path.grade) > rang(lv.school, lv.grade)) {
      st.educational_track = path.school === "SS" ? "SREDNJA_SOLA" : "OSNOVNA_SOLA";
      st.curriculum_level = path.school === "SS" ? `${path.grade}. letnik` : `${path.grade}. razred`;
    }
  }
  const iskanje = !!st.subject && searchOn(st) && listPaths(st.subject).some((x) => x.school === "OS" || x.school === "SS");
  const obseg = obsegTeme.length ? new Set(obsegTeme.map((t) => t.id)) : null;
  const poTemi = new Map();
  const samoVZapiskih = [];
  const pp = new Map();
  const delno = izseki.length > MAX_IZSEKOV;
  let n = 0;
  for (const i of izseki.slice(0, MAX_IZSEKOV)) {
    // Ne zadrži strežnika: po vsakih 200 izsekih prepusti zanko drugim zahtevkom.
    if (++n % 200 === 0) await new Promise((r) => setImmediate(r));
    const id = iskanje ? temaIzseka(i, st, obseg, pp) : null;
    if (!id) {
      samoVZapiskih.push(i.id);
      continue;
    }
    if (!poTemi.has(id)) poTemi.set(id, []);
    poTemi.get(id).push(i.id);
  }
  // Teme v vrstnem redu učnega načrta (pot, sklop, tema), sicer po imenu.
  const red = (id) => {
    const t = getTopic(id);
    const p = getPath(t.path);
    const ui = t.unitIndex ?? 0;
    return [t.path, ui, p ? p.units[ui].topics.findIndex((x) => x.id === id) : 0];
  };
  const primerjaj = (a, b) => {
    const [x, y] = [red(a), red(b)];
    return x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : x[1] - y[1] || x[2] - y[2];
  };
  const teme = [...poTemi.keys()].sort(primerjaj).map((id) => ({ ...temaVen(id), izseki: poTemi.get(id), vObsegu: !!obseg?.has(id) }));
  let predznanje = [];
  if (path && obsegTeme.length) {
    const vse = path.units.flatMap((u) => u.topics).filter(zaRaven);
    // Predznanje je pred celim obsegom testa (odstranjena tema ni predznanje).
    const celObseg = new Set(vsiObsega.map((t) => t.id));
    const prva = vse.findIndex((t) => celObseg.has(t.id));
    predznanje = vse.slice(Math.max(0, prva - PREDZNANJE), prva).map((t) => temaVen(t.id));
  }
  return {
    iskanje,
    ...(delno ? { delno: true, pregledanih: MAX_IZSEKOV } : {}),
    obseg: obseg ? obsegTeme.map((t) => ({ ...temaVen(t.id), izsekov: poTemi.get(t.id)?.length || 0 })) : null,
    pokritost: obseg ? { pokrite: obsegTeme.filter((t) => poTemi.has(t.id)).length, vseh: obsegTeme.length } : null,
    teme,
    samoVZapiskih,
    predznanje,
    izkljucene: vsiObsega.filter((t) => !obsegTeme.includes(t)).map((t) => temaVen(t.id)),
  };
}
