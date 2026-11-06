// Vaje brez povezave (lahki način).
// Ko je povezava, odjemalec enkrat na dan prenese paket nalog za trenutno učno pot
// (naloge z rešitvami, ~30 KB stisnjeno). Brez povezave vadnica jemlje naloge iz paketa
// in jih preverja v brskalniku (isti check.js kot strežnik). Odgovori čakajo v vrsti in
// se ob ponovni povezavi pošljejo strežniku, ki vsako nalogo iz semena ustvari znova,
// odgovor preveri še enkrat in podeli XP.
import { checkAnswer } from "/practice/check.js";

// Enako kot hintSteps v server/practice/index.js: podatki → formula → namig.
function hintSteps(t) {
  const steps = [];
  const given = t.data?.given?.filter(Boolean) || [];
  if (given.length) steps.push({ kind: "data", given, find: t.data?.find?.filter(Boolean) || [] });
  const formula = t.formula ? [].concat(t.formula).filter(Boolean) : [];
  if (formula.length) steps.push({ kind: "formula", formula });
  if (t.hint) steps.push({ kind: "hint", text: t.hint });
  return steps;
}

const PACK = (sid) => `evklid.offline.pack.${sid}`;
const QUEUE = (sid) => `evklid.offline.queue.${sid}`;
const DAY = 86400000;

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const getPack = (sid) => read(PACK(sid), null);
export const pendingCount = (sid) => read(QUEUE(sid), []).length;
export const packTaskCount = (sid) => Object.values(getPack(sid)?.tasks || {}).reduce((n, list) => n + list.length, 0);

// Napaka omrežja (fetch ni uspel ali service worker javi, da ni povezave).
export class OfflineError extends Error {
  constructor() {
    super("offline");
    this.offline = true;
  }
}

// Prenese nov paket, če je stari starejši od dneva ali za drugo pot.
export async function refreshPack(api, sid, pathKey, { force = false } = {}) {
  if (!navigator.onLine) return getPack(sid);
  const old = getPack(sid);
  if (!force && old && old.path === pathKey && Date.now() - Date.parse(old.created) < DAY) return old;
  try {
    const pack = await api(`/api/students/${sid}/offline-pack?path=${encodeURIComponent(pathKey)}`);
    // Če ni prostora (zasebno okno, poln pomnilnik), paket preprosto ni na voljo.
    if (!write(PACK(sid), pack)) return old;
    return pack;
  } catch {
    return old;
  }
}

// Pošlje odgovore iz vrste. Vrne { synced, correct, xp } ali null, če ni česa poslati.
export async function syncOffline(api, sid) {
  const queue = read(QUEUE(sid), []);
  if (!queue.length || !navigator.onLine) return null;
  const out = await api(`/api/students/${sid}/offline-sync`, { method: "POST", body: { results: queue } });
  // Odstranimo samo poslane (med pošiljanjem so lahko prišli novi).
  const rest = read(QUEUE(sid), []).slice(queue.length);
  write(QUEUE(sid), rest);
  return out;
}

// Odgovor API iz paketa za klice, ki jih vadnica potrebuje. Vrne undefined, če klica ne zna.
let lastTask = null;
export function offlineApi(sid, url, opts = {}) {
  const pack = getPack(sid);
  if (!pack) return undefined;
  const u = new URL(url, location.origin);
  const p = u.pathname;
  const body = typeof opts.body === "string" ? JSON.parse(opts.body || "{}") : opts.body || {};

  if (p === "/api/topic") {
    const t = pack.topics[u.searchParams.get("id")];
    return t ? { ...t, explanation: null, offline: true } : undefined;
  }
  if (p === `/api/students/${sid}/path`) {
    const key = u.searchParams.get("key");
    return !key || key === pack.path ? { ...pack.view, defaultKey: pack.path, offline: true } : undefined;
  }
  if (p === `/api/students/${sid}/practice/next`) {
    const list = pack.tasks[body.topic_id];
    if (!list?.length) return undefined;
    // Po vrsti, da se naloge ne ponavljajo; ko zmanjka, začnemo znova.
    const done = new Set(read(QUEUE(sid), []).map((r) => `${r.topic_id}:${r.seed}`));
    const item = list.find((x) => !done.has(`${body.topic_id}:${x.seed}`)) || list[Math.floor(Math.random() * list.length)];
    lastTask = { ...item, topic_id: body.topic_id, attempts: 0, id: `off-${item.seed}` };
    return { task: { id: lastTask.id, mode: "practice", ...item.task }, state: { level: item.level, streak: 0 }, offline: true };
  }
  const m = /^\/api\/students\/\d+\/tasks\/(off-[^/]+)\/(answer|help|skip|read|hint)$/.exec(p);
  if (m && lastTask?.id === decodeURIComponent(m[1])) {
    if (m[2] === "hint") {
      const steps = hintSteps({ ...lastTask.task, hint: lastTask.hint });
      return { steps: steps.slice(0, Math.max(1, Number(body.step) || 1)), total: steps.length, offline: true };
    }
    if (m[2] !== "answer") throw new OfflineError();
    const res = checkAnswer(lastTask.answer, body.answer);
    const out = { kind: res.kind, message: res.message || null, ...(res.code ? { code: res.code, params: res.params || {} } : {}), offline: true };
    if (["format", "unit", "simplify"].includes(res.kind)) return { ...out, retry: true };
    lastTask.attempts += 1;
    // V vrsto gre samo prvi odgovor (tako kot prvi poskus na strežniku).
    if (lastTask.attempts === 1) {
      const queue = read(QUEUE(sid), []);
      queue.push({ topic_id: lastTask.topic_id, level: lastTask.level, seed: lastTask.seed, answer: String(body.answer ?? ""), at: new Date().toISOString() });
      write(QUEUE(sid), queue);
    }
    if (res.kind === "correct") return { ...out, correct: true, solution: lastTask.solution };
    return { ...out, correct: false, hint: lastTask.hint, ...(res.mistake ? { mistake: res.mistake } : {}), ...(lastTask.attempts >= 3 ? { solution: lastTask.solution, final: true } : {}) };
  }
  return undefined;
}

// ---------- zasebnost (P7) ----------
// Service worker osebnih odgovorov API ne shranjuje več. Da se aplikacija odpre tudi brez povezave, si stran
// zapomni seznam profilov (id, ime, nastavitve, zaklep) tega računa in očiščene nastavitve aplikacije
// (/api/config brez skrbniških zastavic). Ob odjavi, koncu seje, izbrisu ali menjavi računa se osebni
// podatki na napravi pobrišejo (PRIVATE_KEYS); nastavitve videza (jezik, tema, enote …) ostanejo.
const STUDENTS = "evklid.offline.students";
const OWNER = "evklid.offline.owner";
const CONFIG = "evklid.config";
// Osebni podatki na napravi: paketi vaj, vrsta odgovorov, seznam profilov, lastnik naprave (offline.),
// zgodovina skenerja (scan.), zapis postopka (work.), kalkulatorja (graph., sci.), ogledani cilji (goalSeen.),
// opomniki urnika (schedule…), točke na lastnih polah (ours.), pozdrav ob novem letniku (levelup.).
const PRIVATE_KEYS = /^evklid\.(offline\.|scan\.|work\.|graph\.|sci\.|goalSeen\.|schedule|ours\.|levelup\.)/;
// Posamezni ključi: učiteljev ključ razreda (dostop do razreda!), ime otroka iz povabila, darilna in
// priporočilna koda iz povezave, izbrani profil.
const LINK_KEYS = new Set(["evklid_invite_name", "evklid_koda", "evklid_ref"]);
const PRIVATE_EXACT = new Set(["teacherClasses", "studentId", ...LINK_KEYS]);
export const isPrivateKey = (k) => typeof k === "string" && (PRIVATE_KEYS.test(k) || PRIVATE_EXACT.has(k));

export function saveStudents(list) {
  if (!Array.isArray(list)) return;
  write(STUDENTS, list.map((s) => (s.locked ? { id: s.id, name: s.name, locked: true } : { id: s.id, name: s.name, settings: s.settings })));
}

// Nastavitve aplikacije za zagon brez povezave: samo javni del (brez skrbniških zastavic).
export function saveConfig(cfg) {
  if (!cfg || typeof cfg !== "object") return;
  const { enums, defaults, mock, chat_off, test_notice, daily_questions, model, model_deep } = cfg;
  const feedback = cfg.feedback ? { prompt: !!cfg.feedback.prompt, ai: !!cfg.feedback.ai, admin: false } : undefined;
  write(CONFIG, { enums, defaults, mock, chat_off, test_notice, daily_questions, model, model_deep, feedback, admin: false });
}

// Odgovor brez povezave za zagon: nastavitve, seznam profilov in prazen seznam pogovorov (pogovori niso shranjeni).
export function offlineBootApi(url, opts = {}) {
  if ((opts.method || "GET").toUpperCase() !== "GET") return undefined;
  const p = new URL(url, location.origin).pathname;
  if (p === "/api/config") return read(CONFIG, undefined);
  if (p === "/api/students") return read(STUDENTS, undefined);
  if (/^\/api\/students\/\d+\/conversations$/.test(p)) return [];
  return undefined;
}

// Podatki, ki so samo na tej napravi (za izvoz vseh podatkov), samo za profile tega računa (ids):
// zgodovina skenerja, neposlani odgovori, kalkulatorja in zapisi postopka pri nalogah.
export function deviceData(ids = []) {
  const own = new Set(ids.map(String));
  const out = { scanner_history: {}, offline_answers: {}, calculator: {}, task_work: {} };
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const m = /^evklid\.(scan|offline\.queue|graph|sci)\.(.+)$/.exec(k);
      if (m && own.has(m[2])) {
        const box = { scan: "scanner_history", "offline.queue": "offline_answers" }[m[1]];
        if (box) out[box][m[2]] = read(k, []);
        else (out.calculator[m[2]] ||= {})[m[1]] = read(k, null);
      }
      // Zapis postopka je vezan na nalogo, ne na profil; po prijavi drugega računa se pobriše (checkOwner).
      const w = /^evklid\.work\.(.+)$/.exec(k);
      if (w) out.task_work[w[1]] = localStorage.getItem(k);
    }
  } catch {}
  return out;
}

// Pobriše osebne podatke na napravi (PRIVATE_KEYS, PRIVATE_EXACT) in predpomnilnik API (service worker).
// Ob odjavi, koncu seje, izbrisu računa in prijavi v drug račun.
export async function clearPrivate() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
    for (const k of keys) if (isPrivateKey(k)) localStorage.removeItem(k);
  } catch {}
  try {
    navigator.serviceWorker?.controller?.postMessage({ type: "clear-private" });
  } catch {}
  try {
    if (typeof caches !== "undefined") {
      const names = await caches.keys();
      await Promise.all(names.filter((n) => /-api(-|$)/.test(n)).map((n) => caches.delete(n)));
    }
  } catch {}
}

// Izbris enega profila: pobrišejo se njegovi podatki na napravi (paket, vrsta, skener, kalkulator, cilji …).
export function clearProfile(sid) {
  const id = String(sid);
  const own = new RegExp(`^evklid\\.(offline\\.pack|offline\\.queue|scan|graph|sci|goalSeen)\\.${id}$|^evklid\\.(ours|levelup)\\.${id}\\.`);
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
    for (const k of keys) if (own.test(k)) localStorage.removeItem(k);
    const list = read(STUDENTS, null);
    if (Array.isArray(list)) write(STUDENTS, list.filter((s) => String(s.id) !== id));
  } catch {}
}

// Ali so na napravi osebni podatki (brez zapisa o lastniku).
function hasPrivate() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      // Ključi iz povezave (povabilo, koda) so od tega obiskovalca, ne od prejšnjega lastnika.
      if (k !== OWNER && !LINK_KEYS.has(k) && isPrivateKey(k)) return true;
    }
  } catch {}
  return false;
}

// Prijava v drug račun na isti napravi: podatki prejšnjega računa se pobrišejo. Neznan lastnik (prva prijava
// po namestitvi te različice) z osebnimi podatki na napravi šteje za tujega. Vrne true, če je bilo kaj pobrisano.
export async function checkOwner(parentId) {
  if (parentId == null) return false;
  const prev = read(OWNER, null);
  if (prev !== parentId && (prev !== null || hasPrivate())) {
    await clearPrivate();
    write(OWNER, parentId);
    return true;
  }
  write(OWNER, parentId);
  return false;
}

// Seja na tej napravi je končana (odjava drugje, iztek seje, odjava vseh drugih naprav): če je naprava imela
// lastnika, se njegovi podatki pobrišejo. Vrne true, če je bilo kaj pobrisano.
export async function endedSession() {
  if (read(OWNER, null) === null) return false;
  await clearPrivate();
  return true;
}
