// Načrtovalnik priprave (docs/priprava.md, PR 5): dnevni načrt do testa iz obsega testa (teme.js), izkazanega znanja
// (stanje tem iz rešenih nalog, ocena progress.js topicScore kot pri pripravljenosti na izpit, strogo izkazano) in zapiskov. Načrtovalnik
// je koda, ne model: brez AI, brez napovedi ocen in obljub. Načrt se vsak dan izračuna znova iz trenutnega znanja in
// zgodovine vaje (kdaj je bila tema nazadnje vadena, kdaj je na vrsti ponovitev), zato se sam prilagodi in razmiki res
// veljajo: vaja po novi snovi pride čez dan ali dva po zadnji vaji, ne vsak dan znova.
//
// Pravila:
// - delo teme po izkazanem znanju: nova (ocena 0) → nova snov, vaja, ponovitev; v učenju (< 0,8) → vaja, ponovitev;
//   za ponovitev (< 1) → ponovitev; obvladana → ponovitev na dan, ko jo predvidi ponavljanje Evklida (review_due), in
//   osvežitev v zadnjih OSVEZITEV_DNI učnih dneh pred testom, če tam še ni bila vadena (neobvezno: če ni prostora, odpade);
// - razmiki: do vaje 1–2 dni (pred obvladanjem pogosto), do ponovitve tretjina preostalega časa, največ NAJVEC_RAZMIK dni;
//   prva enota teme, vadene pred kratkim, pride šele po razmiku od zadnje vaje;
// - prednost: najnižja ocena, nato vrstni red učnega načrta; samo en učni dan pred testom: najprej teme v učenju
//   (utrjevanje pred novo snovjo);
// - zadnji dan pred testom: poskusni test (mešane naloge iz sklopov, obstoječi /test-prep), če sta vsaj dva dneva;
// - največ NA_DAN enot na dan; kar ne gre v načrt, je našteto v nePrideNaVrsto (najprej odpade ponovitev, nato vaja);
// - tema brez nalog v Vadnici (ni preverljiva s kodo): enota »zapiski« (preberi izseke), največ ena na dan, za
//   preverljivimi enotami; ko učenec označi zapiske kot prebrane, je opravljena; ne šteje v pripravljenost.
import { RULES, topicScore } from "../progress.js";

export const NA_DAN = 3;
export const BREZ_DATUMA_DNI = 7;
export const NAJVEC_RAZMIK = 7;
export const OSVEZITEV_DNI = 3;
export const ZAPISKI_NA_DAN = 1;
// Enota je danes opravljena po toliko rešenih nalogah teme danes (ponovitev kot ponavljanje Evklida: 2 nalogi na temo).
export const OPRAVLJENO_NALOG = { nova: 3, vaja: 3, ponovitev: RULES.reviewPerTopic };
const DAN = 86400000;

const dodajDni = (d, n) => new Date(Date.parse(`${d}T00:00:00Z`) + n * DAN).toISOString().slice(0, 10);
const razlika = (a, b) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / DAN);

// Ocena teme iz izkazanega znanja (progress.js topicScore, ista lestvica kot pripravljenost na izpit; samo ročna oznaka
// »obvladano« in zgrešena zadnja ponovitev nista obvladano).
export const ocenaTeme = (s, zdaj) => topicScore(s, zdaj, { izkazano: true });

export function enoteTeme(t) {
  if (!t.vaja) return t.ocena >= 1 ? [] : ["zapiski"];
  if (t.ocena <= 0) return ["nova", "vaja", "ponovitev"];
  if (t.ocena < 0.8) return ["vaja", "ponovitev"];
  if (t.ocena < 1) return ["ponovitev"];
  return [];
}

// Razmik pred enoto glede na preostale učne dni od prejšnje enote.
const razmikPred = (vrsta, preostalo) =>
  vrsta === "vaja" ? (preostalo >= 12 ? 2 : 1) : Math.min(NAJVEC_RAZMIK, Math.max(1, Math.floor(preostalo / 3)));

/**
 * teme: [{ id, ime, sklop, red, izsekov, ocena, vaja, danesNalog, zadnjic?, ponovitev?, prebrano? }] (teme obsega testa);
 * zadnjic: dan zadnje rešene naloge teme, ponovitev: dan ponovitve obvladane teme (review_due), prebrano: dan, ko so bili
 * zapiski teme označeni kot prebrani (vse YYYY-MM-DD po slovenskem času ali null).
 * Vrne { danes, datum, dni, naDan, stisnjeno, dnevi: [{ datum, naloge: [{ vrsta, tema, opravljeno? }] }],
 *        nePrideNaVrsto: [{ vrsta, tema }], naslednja, pripravljenost }.
 */
export function sestaviNacrt({ danes, datum = null, teme, naDan = NA_DAN, poskusniTest = true }) {
  const doTesta = datum ? razlika(danes, datum) : null;
  // Dnevi za učenje: od danes do dneva pred testom; brez datuma en teden.
  const dni = datum ? Math.max(0, doTesta) : BREZ_DATUMA_DNI;
  const poskusni = poskusniTest && !!datum && dni >= 2;
  const ucni = poskusni ? dni - 1 : dni;
  const dnevi = Array.from({ length: dni }, (_, i) => ({ datum: dodajDni(danes, i), naloge: [] }));
  const vec = (t) => ({ id: t.id, ime: t.ime, sklop: t.sklop, izsekov: t.izsekov, vaja: t.vaja });
  const dan = (d) => (d ? razlika(danes, d) : null); // dan glede na danes (negativen = v preteklosti)
  // Tema brez nalog nima izkazanega znanja: v vrstnem redu je sredi (0,5), ne pred preverjeno šibko temo. En sam učni dan:
  // najprej utrjevanje tem v učenju, nova snov za njimi.
  const kljuc = (t) => (!t.vaja ? 0.5 : ucni <= 1 && t.ocena <= 0 ? 0.7 : t.ocena);
  const red = [...teme].sort((a, b) => kljuc(a) - kljuc(b) || a.red - b.red);
  const nePrideNaVrsto = [];
  const zacetekOsvezitve = Math.max(0, ucni - OSVEZITEV_DNI);
  const enote = [];
  for (const t of red) {
    const zadnjic = dan(t.zadnjic);
    const vadenaDanes = zadnjic === 0;
    let e = enoteTeme(t);
    let od = 0;
    let neobvezno = false;
    if (e[0] === "zapiski") {
      const prebrano = dan(t.prebrano);
      if (prebrano !== null && prebrano < 0) e = [];
    } else if (e.length && !vadenaDanes && e[0] !== "nova" && t.ocena < 0.8 && zadnjic !== null) {
      // Tema v učenju: naslednja vaja šele po razmiku od zadnje vaje.
      od = Math.max(0, zadnjic + razmikPred(e[0], ucni - zadnjic));
    } else if (!e.length && t.vaja && t.ocena >= 1 && !vadenaDanes) {
      // Obvladana tema: ponovitev, ko je na vrsti v Evklidu, sicer osvežitev tik pred testom.
      const p = dan(t.ponovitev);
      if (p !== null && p >= 0 && p < ucni) e = ["ponovitev"], (od = p);
      else if (datum && (zadnjic === null || zadnjic < zacetekOsvezitve)) e = ["ponovitev"], (od = zacetekOsvezitve), (neobvezno = true);
    }
    if (e.length) enote.push({ t, e, od, neobvezno, dan: 0 });
  }
  const zapiskov = (d) => dnevi[d].naloge.filter((n) => n.vrsta === "zapiski").length;
  const prostor = (d, vrsta) => dnevi[d].naloge.length < naDan && (vrsta !== "zapiski" || zapiskov(d) < ZAPISKI_NA_DAN);
  // Najprej prve enote vseh tem (vsaka šibka tema pride na vrsto), nato druge, nato tretje.
  for (let k = 0; k < 3 && ucni > 0; k++) {
    for (const x of enote) {
      const vrsta = x.e[k];
      if (!vrsta) continue;
      let d = k === 0 ? x.od : x.dan + razmikPred(vrsta, ucni - x.dan);
      while (d < ucni && !prostor(d, vrsta)) d++;
      if (d >= ucni) {
        if (!x.neobvezno) nePrideNaVrsto.push({ vrsta, tema: vec(x.t) });
        x.e = x.e.slice(0, k); // poznejše enote te teme brez prejšnje nimajo smisla
        continue;
      }
      dnevi[d].naloge.push({ vrsta, tema: vec(x.t) });
      x.dan = d;
    }
  }
  // Na dan najprej preverljive enote, zapiski za njimi.
  for (const d of dnevi) d.naloge.sort((a, b) => (a.vrsta === "zapiski") - (b.vrsta === "zapiski"));
  if (poskusni) dnevi[dni - 1].naloge.push({ vrsta: "poskusni_test", tema: null });
  // Danes: opravljeno po rešenih nalogah teme danes; zapiski, ko so danes označeni kot prebrani.
  const poId = new Map(teme.map((t) => [t.id, t]));
  for (const n of dnevi[0]?.naloge || []) {
    if (!n.tema) continue;
    const t = poId.get(n.tema.id);
    n.opravljeno = n.vrsta === "zapiski" ? dan(t?.prebrano) === 0 : (t?.danesNalog || 0) >= OPRAVLJENO_NALOG[n.vrsta];
  }
  const odprte = (dnevi[0]?.naloge || []).filter((n) => n.tema && !n.opravljeno);
  const naslednja = odprte.find((n) => n.vrsta !== "zapiski") || odprte[0] || null;
  // Pripravljenost: samo teme, ki jih koda preveri z nalogami; povprečje ocen, brez napovedi ocene testa.
  const prev = teme.filter((t) => t.vaja);
  const pripravljenost = {
    odstotek: prev.length ? Math.round((100 * prev.reduce((s, t) => s + t.ocena, 0)) / prev.length) : null,
    obvladanih: prev.filter((t) => t.ocena >= 1).length,
    preverljivih: prev.length,
    nepreverljivih: teme.length - prev.length,
  };
  return {
    danes,
    datum,
    dni,
    ...(datum && doTesta < 0 ? { mimo: true } : {}),
    naDan,
    stisnjeno: nePrideNaVrsto.length > 0,
    dnevi,
    nePrideNaVrsto,
    naslednja,
    pripravljenost,
  };
}
