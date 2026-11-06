// Varnost čez mejo porabe (j, 6. 11. 2026; kartica-nujno, potrjena 6. 11.).
// 1. Lokalni zaznavalnik brez AI (public/nujno.js, strošek 0).
// 2. Če ta ne najde ničesar in učenec ne dobi odgovora inštruktorja (meja, izklopljen klepet), zelo kratek
//    varnostni pregled s Haikujem: model vrne samo vrsto (ZDRAVJE/STISKA/NASILJE/NEVARNOST/NE), besedilo
//    odgovora je vedno potrjeno besedilo iz i18n (AI ne piše nasveta). Največ VAROVALKA pregledov na profil
//    na dan; strošek se zapiše z student_id NULL in kind »varnost«: šteje v porabo aplikacije, ne v mejo učenca.
import { getClient, isMockMode, quickParams } from "./claude.js";
import { zaznajNujno, stevilke } from "../public/nujno.js";

const env = (k, d) => (process.env[k] === undefined || process.env[k] === "" ? d : process.env[k]);
export const VAROVALKA = Number(env("EVKLID_VARNOST_NA_DAN", 10));
// Vedno najcenejši model (kartica: Haiku), tudi če je EVKLID_MODEL za inštruktorja večji (pregled A S1).
export const MODEL_VARNOST = env("EVKLID_VARNOST_MODEL", "claude-haiku-5-5");
// Učenec ob zavrnitvi ne sme čakati: kratek rok, brez ponovitev (pregled A V4).
export const ROK_MS = 5000;

export const NAVODILO =
  "Si varnostni filter aplikacije za učenje (otroci in mladi). Preberi sporočilo učenca. Odgovori samo z eno besedo: " +
  "ZDRAVJE, STISKA, NASILJE, NEVARNOST ali NE. ZDRAVJE = nekdo je zdaj resno bolan ali poškodovan; STISKA = samopoškodovanje, " +
  "samomor, huda stiska; NASILJE = nasilje, zloraba, izsiljevanje ali ustrahovanje (tudi s slikami ali na spletu); NEVARNOST = požar, plin, druga nevarnost zdaj. Šolska naloga, zgodba ali " +
  "vprašanje o snovi brez prave nevarnosti = NE. Če nisi prepričan, izberi kategorijo, ne NE.";

const BESEDA = { ZDRAVJE: "zdravje", STISKA: "stiska", NASILJE: "nasilje", NEVARNOST: "nevarnost" };

// Odgovor modela → vrsta ali null. Neznan odgovor (ni »NE«) šteje kot nujno: raje lažni alarm.
export function preberiVrsto(raw) {
  const w = String(raw || "").trim().toUpperCase().match(/[A-ZČŠŽ]+/)?.[0] || "";
  if (BESEDA[w]) return BESEDA[w];
  if (w === "NE" || w === "NO" || w === "") return null;
  return "zdravje";
}

const danes = () => new Date().toISOString().slice(0, 10);
const kljuc = (studentId) => `varnost_${danes()}_${studentId}`;

// Števci prejšnjih dni niso več potrebni (pregled A N2): ob prvem pregledu dneva izbrišemo starejše od včeraj.
let pocisceno = "";
function pocisti(usage) {
  if (pocisceno === danes() || !usage.db) return;
  pocisceno = danes();
  const vceraj = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  try {
    usage.db.prepare("DELETE FROM kv WHERE key LIKE 'varnost\\_%' ESCAPE '\\' AND key < ?").run(`varnost_${vceraj}`);
  } catch {}
}

export function pregledovDanes(usage, studentId) {
  return Number(usage.kvGet(kljuc(studentId))) || 0;
}

/**
 * Kratek varnostni pregled z AI. Vrne vrsto ali null (tudi ob napaki, porabljeni varovalki ali brez API).
 * @param {{ text: string, usage: object, studentId: number, createFn?: Function }} a
 */
export async function varnostniPregled({ text, usage, studentId, createFn = null }) {
  if (!text || !usage || studentId == null) return null;
  if (!createFn && isMockMode()) return null;
  // Dobroimetje za AI porabljeno: klic bi zagotovo padel (pregled A V4).
  if (usage.creditOut?.()) return null;
  if (pregledovDanes(usage, studentId) >= VAROVALKA) return null;
  pocisti(usage);
  usage.kvSet(kljuc(studentId), pregledovDanes(usage, studentId) + 1);
  try {
    const create = createFn || ((body) => getClient().messages.create(body, { timeout: ROK_MS, maxRetries: 0 }));
    const out = await create({
      model: MODEL_VARNOST,
      max_tokens: 150,
      ...quickParams(MODEL_VARNOST),
      system: NAVODILO,
      messages: [{ role: "user", content: String(text).slice(0, 2000) }],
    });
    // Strošek aplikacije (student_id NULL), ne učenca; vrsta »varnost« v Števcu porabe.
    if (out?.usage) usage.log(null, out.model || MODEL_VARNOST, out.usage, "varnost");
    const raw = (out?.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    return preberiVrsto(raw);
  } catch (err) {
    console.warn(`[evklid] varnostni pregled ni uspel: ${err?.message || err}`);
    return null;
  }
}

// Podatki za odjemalca: { vrsta, st } (st = številke po državi in stopnji) ali null.
export const nujnoZa = (vrsta, settings) => (vrsta ? { vrsta, st: stevilke(settings) } : null);

/**
 * Pred zavrnitvijo (meja, izklopljen klepet): lokalni zaznavalnik, nato (če ta ne najde) AI pregled.
 * @returns {Promise<{vrsta, st, ai?: boolean} | null>}
 */
export async function nujnoPredZavrnitvijo({ text, student, usage, createFn = null, ai = true }) {
  const local = zaznajNujno(text);
  if (local) return nujnoZa(local, student?.settings);
  if (!ai) return null;
  const vrsta = await varnostniPregled({ text, usage, studentId: student?.id, createFn });
  return vrsta ? { ...nujnoZa(vrsta, student?.settings), ai: true } : null;
}
