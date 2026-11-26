// Stopnja namiga v kodi (P1-6; načrt kakovosti pred obsegom, j 25. 11. 2026: »A gradi module, B jih vklopi«).
// Strežnik prešteje, kolikokrat se je učenec pri trenutni nalogi že zataknil, in inštruktorju v skriti opombi pove,
// katera stopnička »Lestvice pomoči« iz poziva (način A, točka 3) pride na vrsto. Tako model ne preskoči stopničke in
// ne izda rešitve zato, ker je pozabil, koliko namigov je že dal.
//
// Zatik: odgovor inštruktorja na učenčevo sporočilo ima META error=1 (vsebinska napaka) ali pa je učenec prosil za
// pomoč (»ne vem«, »namig«, »pomagaj«, »ne razumem« …). Štetje se ustavi pri prvem odgovoru brez zatika (učenec je
// naredil korak prav), pri done=1, pri načinu B, pri oznaki (flag) in pri drugi temi. Brez zatika vrne null (brez
// dodatnih žetonov). Brez AI, brez stanja; profil B odloči, kje opombo doda (#539).
import { parseMeta } from "./meta.js";
import { isHiddenNote } from "./skrite-opombe.js";

export const STOPNICKE = [
  "vprašanje, ki ga usmeri k lastnemu razmisleku",
  "splošen namig: kateri pojem, pravilo ali zveza tu pride v poštev",
  "natančen namig: kateri korak sledi in s katero količino, brez izračuna",
  "ta en korak narediš skupaj z njim, z razlogom; ostalo dokonča sam",
];
const MAX_SPOROCIL = 40;
// Prošnja za pomoč (pregled 2 in 3): celo sporočilo je »ne vem« ali podobno, ali pa je v njem izrecna prošnja
// (»pomagaj«, »daj mi namig«, »rabim pomoč«). Zahvala (»hvala za pomoč«) in poskus (»ne vem, če je prav: x = 3«,
// »ne znam si predstavljati, a mislim …«) nista prošnja: preveč štetja bi inštruktorja potisnilo previsoko po lestvici.
const CELA = /^(?:ne\s*vem|ne\s*znam|ne\s*razumem|ne\s*(?:š|s)tekam|ne\s*kapiram|nimam\s+pojma|ne\s+gre|kako\s+naprej|zataknil[ao]?\s+sem\s+se|obti(?:č|c)al[ao]?\s+sem|help|hint|idk)(?:\s+(?:več|vec|tega|naprej|kako|prosim|res|nič|nic))*[\s.!?…]*$/iu;
const PROSNJA = /(?<!\p{L})(?:pomagaj\p{L}*|(?:daj(?:te)?(?:\s+mi)?|rabim|potrebujem|prosim\s+za|lahko\s+dobim)\s+(?:(?:še\s+)?en\s+)?(?:namig|pomo(?:č|c))|namig\s+prosim|(?:a|ali)\s+(?:mi\s+)?lahko\s+pomaga(?:š|s)|zataknil[ao]?\s+sem\s+se|obti(?:č|c)al[ao]?\s+sem)(?!\p{L})/iu;

// Samo kratko sporočilo brez poskusa (do 80 znakov, brez števk in »=«) in brez zahvale.
export const prosiZaPomoc = (besedilo) => {
  const s = String(besedilo || "").trim();
  return s.length <= 80 && !/[\d=]/.test(s) && !/hvala/i.test(s) && (CELA.test(s) || PROSNJA.test(s));
};

// Nova naloga (pregled 2): dolgo sporočilo, »nova/naslednja naloga«, slika. Tu se štetje ustavi (zatik pri prvem
// poskusu nove naloge še šteje, prejšnja naloga ne več).
const NOVA = /(?<!\p{L})(?:nova|novo|naslednja|naslednjo|druga|drugo|še\s+ena|še\s+eno)\s+nalog\p{L}*|^\s*naloga(?!\p{L})/iu;
export const novaNaloga = (m) => {
  const s = besediloOd(m).trim();
  return s.length > 150 || NOVA.test(s) || (Array.isArray(m?.content) && m.content.some((b) => b?.type === "image"));
};

const fold = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
// Besedilo sporočila: niz ali vsebina API ([{ type: "text", text }]) brez skritih opomb strežnika (server/skrite-opombe.js).
// Opomba: messages.display_text nima vrstice META; podaj api_content (content) ali že prebrano meta.
function besediloOd(m) {
  if (typeof m?.text === "string") return m.text;
  if (Array.isArray(m?.content)) return m.content.filter((b) => b?.type === "text" && !isHiddenNote(b.text)).map((b) => b.text).join("\n");
  return typeof m?.content === "string" ? m.content : "";
}

/**
 * @param {{ role: "user"|"assistant", text?: string, content?: any, meta?: object }[]} sporocila zadnja sporočila pogovora (najstarejše prvo)
 * @param {{ besedilo?: string }} [zdaj] trenutno učenčevo sporočilo (še brez odgovora)
 * @returns {null | { zatikov: number, stopnicka: number, opomba: string }}
 */
export function stopnjaNamiga(sporocila = [], { besedilo = "" } = {}) {
  const msgs = Array.isArray(sporocila) ? sporocila.slice(-MAX_SPOROCIL) : [];
  let zatikov = 0;
  let tema;
  for (let k = msgs.length - 1; k >= 0; k--) {
    const m = msgs[k];
    if (m?.role !== "assistant") continue;
    const meta = m.meta ?? parseMeta(besediloOd(m));
    if (!meta || meta.done || meta.mode === "B" || (meta.flag && meta.flag !== "none")) break;
    const t = meta.topic ? fold(meta.topic) : null;
    if (tema === undefined) tema = t;
    else if (t && tema && t !== tema) break;
    let u = k - 1;
    while (u >= 0 && msgs[u]?.role !== "user") u--;
    const zatik = meta.error === 1 || (u >= 0 && prosiZaPomoc(besediloOd(msgs[u])));
    if (!zatik) break;
    zatikov++;
    if (u >= 0 && novaNaloga(msgs[u])) break; // prvi poskus nove naloge šteje, prejšnja naloga ne
    k = u; // en par (učenec, inštruktor) šteje enkrat
  }
  if (novaNaloga({ text: besedilo })) return null; // nova naloga: lestvica se začne znova
  const zdaj = prosiZaPomoc(besedilo);
  if (!zatikov && !zdaj) return null;
  const stopnicka = Math.min(STOPNICKE.length, zatikov + 1);
  const pogoj = zdaj ? "Učenec zdaj prosi za pomoč, zato je" : "Če se zatakne tudi zdaj (napačen korak ali prosi za pomoč), je";
  const prej = zatikov ? `Koda: učenec se je pri tej nalogi zataknil že ${zatikov}-krat. ` : "Koda: ";
  return {
    zatikov,
    stopnicka,
    opomba: `${prej}${pogoj} na vrsti ${stopnicka}. stopnička lestvice pomoči (${STOPNICKE[stopnicka - 1]}). Ne preskoči stopničke in ne izdaj končnega rezultata (razen ob izrecnem »Reši«).`,
  };
}
