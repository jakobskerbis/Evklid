// Vaje brez povezave: paket nalog učne poti (z rešitvami) se shrani na telefon, odgovori se preverijo
// na telefonu z istim preverjanjem kot na strežniku (server/practice/check.js) in počakajo v vrsti.
// Ob povezavi jih strežnik iz semena naloge preveri še enkrat in podeli XP (POST offline-sync).
// Enako kot public/offline.js v spletni aplikaciji, le da je shramba SQLite namesto localStorage.
import Storage from "expo-sqlite/kv-store";
import { checkAnswer } from "../../../server/practice/check.js";
import { isStalePack, offlineTask } from "../../../public/enote-izbira.js";
import brand from "../../../brand.json";
import { api } from "./api";
import { offlineKljuc, preseliStare } from "./zasebnost.js";

const DAY = 86400000;

// Ključa paketa in vrste sta vezana na račun in profil (src/lib/zasebnost.js offlineKljuc): nastavi ju
// src/lib/session.tsx ob vsakem seznamu profilov, ob koncu seje se pozabita (in shramba pobriše).
// Profil, ki ga ni na seznamu računa, nima paketa ne vrste (branje vrne nič, zapis se ne zgodi).
type Owner = { parentId: number; students: { id: number; created_at?: string }[] };
let owner: Owner | null = null;
let gen = 0; // poveča se ob menjavi lastnika: odgovor strežnika, ki pride po odjavi, se ne zapiše
const keyFor = (vrsta: "pack" | "queue", sid: number) => {
  const s = owner?.students.find((x) => x.id === sid);
  return owner && s ? offlineKljuc(brand.slug, vrsta, owner.parentId, s) : null;
};
const PACK = (sid: number) => keyFor("pack", sid);
const QUEUE = (sid: number) => keyFor("queue", sid);

export function setOfflineOwner(parentId: number | null | undefined, students: { id: number; created_at?: string }[]) {
  if (parentId == null) return forgetOffline();
  if (owner?.parentId !== parentId) gen++;
  owner = { parentId, students: students.map((s) => ({ id: s.id, created_at: s.created_at })) };
  // Ključi iz različice pred tem popravkom (samo id profila): neposlani odgovori tega računa se prenesejo.
  preseliStare(Storage, brand.slug, parentId, owner.students);
}
export function forgetOffline() {
  owner = null;
  current = null;
  gen++;
}

type PackTask = { level: number; seed: number; task: any; answer: any; solution: string; hint: string };
export type Pack = { path: string; created: string; view: any; topics: Record<string, any>; tasks: Record<string, PackTask[]> };
type Queued = { topic_id: string; level: number; seed: number; answer: string; at: string };

const read = <T,>(key: string | null, fallback: T): T => {
  if (!key) return fallback;
  try {
    const v = Storage.getItemSync(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string | null, v: unknown) => void (key && Storage.setItemSync(key, JSON.stringify(v)));

export const getPack = (sid: number) => read<Pack | null>(PACK(sid), null);
export const pendingCount = (sid: number) => read<Queued[]>(QUEUE(sid), []).length;
export const packTaskCount = (sid: number) => Object.values(getPack(sid)?.tasks || {}).reduce((n, list) => n + list.length, 0);

// Prenese nov paket, če je stari starejši od dneva ali za drugo pot.
export async function refreshPack(sid: number, pathKey?: string | null, force = false) {
  const old = getPack(sid);
  // Paket iz različice pred PR 786 (enota brez hasUnit) je zastarel tudi, če je mlajši od dneva.
  if (!force && old && (!pathKey || old.path === pathKey) && Date.now() - Date.parse(old.created) < DAY && !isStalePack(old)) return old;
  const g = gen;
  const pack = await api<Pack>(`/api/students/${sid}/offline-pack${pathKey ? `?path=${encodeURIComponent(pathKey)}` : ""}`);
  if (g === gen) write(PACK(sid), pack);
  return pack;
}

export async function syncOffline(sid: number) {
  const queue = read<Queued[]>(QUEUE(sid), []);
  if (!queue.length) return null;
  const g = gen;
  const out = await api<{ synced: number; correct: number; xp: any }>(`/api/students/${sid}/offline-sync`, { body: { results: queue } });
  if (g === gen) write(QUEUE(sid), read<Queued[]>(QUEUE(sid), []).slice(queue.length));
  return out;
}

// Pred odjavo: neposlani odgovori vseh profilov računa gredo na strežnik (kot public/account.js sendQueued),
// največ 6 s, napaka odjave ne ustavi (nato se pobrišejo s telefona).
export async function sendAllQueued() {
  const ids = (owner?.students || []).map((s) => s.id).filter((id) => pendingCount(id) > 0);
  if (!ids.length) return;
  const send = (async () => {
    for (const id of ids) await syncOffline(id).catch(() => null);
  })();
  await Promise.race([send, new Promise((r) => setTimeout(r, 6000))]);
}

// Naloga iz paketa (po vrsti, da se ne ponavljajo; ko zmanjka, naključna).
type Current = PackTask & { topic_id: string; attempts: number; id: string };
let current: Current | null = null;

export function offlineNext(sid: number, topicId: string) {
  const list = getPack(sid)?.tasks[topicId];
  if (!list?.length) return null;
  const done = new Set(read<Queued[]>(QUEUE(sid), []).map((r) => `${r.topic_id}:${r.seed}`));
  const item = list.find((x) => !done.has(`${topicId}:${x.seed}`)) || list[Math.floor(Math.random() * list.length)];
  current = { ...item, topic_id: topicId, attempts: 0, id: `off-${item.seed}` };
  return { task: { id: current.id, mode: "practice", ...offlineTask(item.task, item.answer, checkAnswer) }, state: { level: item.level, streak: 0 }, offline: true };
}

export function offlineHint(step: number) {
  if (!current) return null;
  const t = current.task;
  const steps: any[] = [];
  const given = t.data?.given?.filter(Boolean) || [];
  if (given.length) steps.push({ kind: "data", given, find: t.data?.find?.filter(Boolean) || [] });
  const formula = t.formula ? [].concat(t.formula).filter(Boolean) : [];
  if (formula.length) steps.push({ kind: "formula", formula });
  if (current.hint) steps.push({ kind: "hint", text: current.hint });
  return { steps: steps.slice(0, Math.max(1, step)), total: steps.length, offline: true };
}

export function offlineAnswer(sid: number, taskId: string, answer: string) {
  if (!current || current.id !== taskId) return null;
  const res: any = checkAnswer(current.answer, answer, { convert: true, text: current.task?.text });
  const out = { kind: res.kind, message: res.message || null, code: res.code, params: res.params || {}, offline: true };
  if (["format", "unit", "simplify"].includes(res.kind)) return { ...out, retry: true };
  current.attempts += 1;
  if (current.attempts === 1) {
    const queue = read<Queued[]>(QUEUE(sid), []);
    queue.push({ topic_id: current.topic_id, level: current.level, seed: current.seed, answer: String(answer ?? ""), at: new Date().toISOString() });
    write(QUEUE(sid), queue);
  }
  if (res.kind === "correct") return { ...out, correct: true, solution: current.solution };
  return { ...out, correct: false, hint: current.hint, mistake: res.mistake, ...(current.attempts >= 3 ? { solution: current.solution, final: true } : {}) };
}
