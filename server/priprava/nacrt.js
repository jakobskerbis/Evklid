// Načrtovalnik priprave (docs/priprava.md, PR 5): dnevni načrt do testa iz obsega testa (teme.js), izkazanega znanja
// (stanje tem iz rešenih nalog, kot pripravljenost na izpit v server/progress.js) in zapiskov. Načrtovalnik je koda, ne
// model: brez AI, brez napovedi ocen in obljub. Načrt se vsak dan izračuna znova iz trenutnega znanja, zato se sam
// prilagodi (tema, ki jo učenec obvlada, izpade; nova šibka tema pride naprej).
//
// Pravila:
// - delo teme po izkazanem znanju: nova (ocena 0) → nova snov, vaja, ponovitev; v učenju (< 0,8) → vaja, ponovitev;
//   za ponovitev (< 1) → ponovitev; obvladana → nič posebej (zajame jo poskusni test);
// - prednost: najnižja ocena, nato vrstni red učnega načrta; enote iste teme so razmaknjene (ponavljanje z razmikom);
// - zadnji dan pred testom: poskusni test (mešane naloge iz sklopov, obstoječi /test-prep), če sta vsaj dva dneva;
// - največ NA_DAN enot na dan; kar ne gre v načrt, je našteto v nePrideNaVrsto (najprej odpade ponovitev, nato vaja);
// - tema brez nalog v Vadnici (ni preverljiva s kodo): enota »zapiski« (preberi izseke), ne šteje v pripravljenost.
export const NA_DAN = 3;
export const BREZ_DATUMA_DNI = 7;
export const OPRAVLJENO_NALOG = 3; // enota vaje ali ponovitve je danes opravljena po 3 rešenih nalogah teme
const DAN = 86400000;

const dodajDni = (d, n) => new Date(Date.parse(`${d}T00:00:00Z`) + n * DAN).toISOString().slice(0, 10);
const razlika = (a, b) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / DAN);

// Ocena teme iz izkazanega znanja (kot examReadiness): obvladana 1 (za ponovitev 0,8), v učenju 0,2–0,6 po stopnji, nova 0.
export function ocenaTeme(s, zdaj) {
  if (!s) return 0;
  if (s.status === "mastered") return s.review_due && s.review_due <= zdaj ? 0.8 : 1;
  if (s.status === "learning") return 0.2 * Math.min(3, s.level || 1);
  return 0;
}

export function enoteTeme(t) {
  if (!t.vaja) return t.ocena >= 1 ? [] : ["zapiski"];
  if (t.ocena <= 0) return ["nova", "vaja", "ponovitev"];
  if (t.ocena < 0.8) return ["vaja", "ponovitev"];
  if (t.ocena < 1) return ["ponovitev"];
  return [];
}

/**
 * teme: [{ id, ime, sklop, red, izsekov, ocena, vaja, danesNalog }] (teme obsega testa).
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
  // Tema brez nalog nima izkazanega znanja: v vrstnem redu je sredi (0,5), ne pred preverjeno šibko temo.
  const kljuc = (t) => (t.vaja ? t.ocena : 0.5);
  const red = [...teme].sort((a, b) => kljuc(a) - kljuc(b) || a.red - b.red);
  const nePrideNaVrsto = [];
  // Razmik med enotami iste teme: čim večji, a vse tri enote morajo priti pred poskusni test.
  const razmik = Math.max(1, Math.floor(ucni / 3));
  // Najprej prve enote vseh tem (vsaka šibka tema pride na vrsto), nato druge, nato tretje.
  const enote = red.map((t) => ({ t, e: enoteTeme(t), dan: 0 }));
  for (let k = 0; k < 3; k++) {
    for (const x of enote) {
      const vrsta = x.e[k];
      if (!vrsta) continue;
      let d = k === 0 ? 0 : x.dan + razmik;
      while (d < ucni && dnevi[d].naloge.length >= naDan) d++;
      if (d >= ucni) {
        nePrideNaVrsto.push({ vrsta, tema: vec(x.t) });
        x.e = x.e.slice(0, k); // poznejše enote te teme brez prejšnje nimajo smisla
        continue;
      }
      dnevi[d].naloge.push({ vrsta, tema: vec(x.t) });
      x.dan = d;
    }
  }
  if (poskusni) dnevi[dni - 1].naloge.push({ vrsta: "poskusni_test", tema: null });
  // Danes: opravljeno po rešenih nalogah teme danes (nova snov in zapiski se ne preverijo, ostanejo odprti).
  const poId = new Map(teme.map((t) => [t.id, t]));
  if (dnevi[0]) {
    const porabljeno = new Map();
    for (const n of dnevi[0].naloge) {
      if (!n.tema || !(n.vrsta === "vaja" || n.vrsta === "ponovitev" || n.vrsta === "nova")) continue;
      const imam = (poId.get(n.tema.id)?.danesNalog || 0) - (porabljeno.get(n.tema.id) || 0);
      n.opravljeno = imam >= OPRAVLJENO_NALOG;
      if (n.opravljeno) porabljeno.set(n.tema.id, (porabljeno.get(n.tema.id) || 0) + OPRAVLJENO_NALOG);
    }
  }
  const naslednja = dnevi[0]?.naloge.find((n) => !n.opravljeno) || null;
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
