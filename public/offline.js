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
// zapomni samo seznam profilov (id, ime, nastavitve, zaklep) tega računa; ob odjavi, izbrisu ali menjavi
// računa se pobriše skupaj s paketi vaj, vrsto odgovorov, zgodovino skenerja in predpomnilnikom API.
const STUDENTS = "evklid.offline.students";
const OWNER = "evklid.offline.owner";
const PRIVATE_KEYS = /^evklid\.(offline\.|scan\.)/;

export function saveStudents(list) {
  if (!Array.isArray(list)) return;
  write(STUDENTS, list.map((s) => (s.locked ? { id: s.id, name: s.name, locked: true } : { id: s.id, name: s.name, settings: s.settings })));
}

// Odgovor brez povezave za zagon: seznam profilov in prazen seznam pogovorov (pogovori niso shranjeni).
export function offlineBootApi(url, opts = {}) {
  if ((opts.method || "GET").toUpperCase() !== "GET") return undefined;
  const p = new URL(url, location.origin).pathname;
  if (p === "/api/students") return read(STUDENTS, undefined);
  if (/^\/api\/students\/\d+\/conversations$/.test(p)) return [];
  return undefined;
}

// Podatki, ki so samo na tej napravi (za izvoz vseh podatkov): zgodovina skenerja in neposlani odgovori.
export function deviceData() {
  const out = { scanner_history: {}, offline_answers: {} };
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const scan = /^evklid\.scan\.(.+)$/.exec(k);
      const queue = /^evklid\.offline\.queue\.(.+)$/.exec(k);
      if (scan) out.scanner_history[scan[1]] = read(k, []);
      if (queue) out.offline_answers[queue[1]] = read(k, []);
    }
  } catch {}
  return out;
}

// Pobriše osebne podatke na napravi: predpomnilnik API (service worker), pakete vaj, vrsto, seznam profilov in
// zgodovino skenerja. Ob odjavi, izbrisu računa in prijavi v drug račun.
export async function clearPrivate() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
    for (const k of keys) if (PRIVATE_KEYS.test(k)) localStorage.removeItem(k);
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

// Prijava v drug račun na isti napravi: podatki prejšnjega računa se pobrišejo. Vrne true, če je bilo kaj pobrisano.
export async function checkOwner(parentId) {
  if (parentId == null) return false;
  const prev = read(OWNER, null);
  if (prev !== null && prev !== parentId) {
    await clearPrivate();
    write(OWNER, parentId);
    return true;
  }
  write(OWNER, parentId);
  return false;
}
