// Samodejna posodobitev Evklida z GitHuba (veja main), brez git in brez dodatnih orodij.
// - preveri zadnjo različico (GitHub API), prenese samo, ko je novejša (tar.gz, razpakira Node),
// - prepiše samo spremenjene datoteke in pobriše tiste, ki jih v main ni več,
// - .env, data/, node_modules/ in .git/ ostanejo nedotaknjeni,
// - stare datoteke shrani v data/posodobitev/prejsnja/, da jih lahko vrnemo, če se nova ne zažene,
// - namesti knjižnice, če se je spremenil package.json.
// Če je mapa klon z git (razvijalci), naredi `git merge --ff-only origin/main`.
// Uporaba: node scripts/posodobitev.js   (izhodna koda 0 = ni novega ali posodobljeno, 1 = napaka)
// Navodila: docs/posodobitve.md
import "../server/env.js";
import { BRAND, LEGACY } from "../server/brand.js";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
// Repozitorij: brand.json → repo; dokler j repozitorija na GitHubu ne preimenuje, deluje še prejšnje ime (legacy).
export const REPOS = [...new Set([process.env.EVKLID_REPO, BRAND.repo, ...LEGACY.map((l) => l.repo)].filter(Boolean))];
export let REPO = REPOS[0];
export const BRANCH = process.env.EVKLID_VEJA || "main";
// Zagonske datoteke (.bat, .command) prepišemo le, če so že v »varni« obliki (imajo to oznako):
// Windows in bash bereta skripto sproti, zato bi prepis stare oblike med tekom zmedel okno.
export const MARKER = `${BRAND.env}-SAMOPOSODOBITEV`;
// Enaka oznaka s prejšnjimi imeni aplikacije (brand.json → legacy).
export const LEGACY_MARKERS = LEGACY.map((l) => `${l.env}-SAMOPOSODOBITEV`);
const KEEP_TOP = new Set([".env", "data", "node_modules", ".git"]);
const LAUNCHER = /^[^/]+\.(bat|cmd|command)$/i;
const isWin = process.platform === "win32";

const dataDir = (root) => path.join(root, "data");
const stateFile = (root) => path.join(dataDir(root), "posodobitev.json");
const backupDir = (root) => path.join(dataDir(root), "posodobitev", "prejsnja");
const lockFile = (root) => path.join(dataDir(root), "posodobitev.lock");

export function readState(root = ROOT) {
  try { return JSON.parse(fs.readFileSync(stateFile(root), "utf8")); } catch { return {}; }
}
function writeState(root, state) {
  fs.mkdirSync(dataDir(root), { recursive: true });
  fs.writeFileSync(stateFile(root), JSON.stringify(state, null, 1) + "\n");
}

// --- tar.gz brez zunanjih orodij ---
const str = (buf, start, len) => {
  const s = buf.subarray(start, start + len);
  const end = s.indexOf(0);
  return s.subarray(0, end < 0 ? s.length : end).toString("utf8");
};
function paxPath(data) {
  let pos = 0, found = null;
  const text = data.toString("utf8");
  while (pos < text.length) {
    const sp = text.indexOf(" ", pos);
    if (sp < 0) break;
    const len = Number(text.slice(pos, sp));
    if (!len) break;
    const rec = text.slice(sp + 1, pos + len - 1);
    const eq = rec.indexOf("=");
    if (rec.slice(0, eq) === "path") found = rec.slice(eq + 1);
    pos += len;
  }
  return found;
}

// Vrne [{ name, data, mode }] za navadne datoteke v arhivu tar (ustar/pax/GNU dolga imena).
export function untar(buf) {
  const out = [];
  let off = 0, nextName = null;
  while (off + 512 <= buf.length) {
    const h = buf.subarray(off, off + 512);
    if (h.every((b) => b === 0)) break;
    let name = str(h, 0, 100);
    const size = parseInt(str(h, 124, 12).trim() || "0", 8) || 0;
    const mode = parseInt(str(h, 100, 8).trim() || "644", 8) & 0o777;
    const type = String.fromCharCode(h[156] || 48);
    if (str(h, 257, 5) === "ustar") {
      const prefix = str(h, 345, 155);
      if (prefix) name = `${prefix}/${name}`;
    }
    off += 512;
    const data = buf.subarray(off, off + size);
    off += Math.ceil(size / 512) * 512;
    if (type === "x") { nextName = paxPath(data) || nextName; continue; }
    if (type === "L") { nextName = str(data, 0, data.length); continue; }
    if (type === "g") continue;
    const full = nextName || name;
    nextName = null;
    if (type === "0" || type === "7") out.push({ name: full, data: Buffer.from(data), mode });
  }
  return out;
}

// Iz arhiva GitHub (mapa »evklid-<sha>/…«) vrne Map(relativna pot -> vsebina) brez .env, data …
export function filesFromTarball(gz) {
  const files = new Map();
  for (const f of untar(zlib.gunzipSync(gz))) {
    const parts = f.name.replace(/\\/g, "/").split("/").slice(1).filter(Boolean);
    if (!parts.length || parts.some((p) => p === ".." || p === ".") || KEEP_TOP.has(parts[0])) continue;
    if (f.mode & 0o111) f.data.executable = true; // npr. zagon-mac.command
    files.set(parts.join("/"), f.data);
  }
  return files;
}

// Kaj se spremeni: nove/spremenjene datoteke, pobrisane (samo tiste, ki jih je prinesla prejšnja
// posodobitev, zato lastnih datotek uporabnika nikoli ne brišemo) in preskočene zagonske datoteke.
export function planChanges(root, files, previousList = []) {
  const write = [], skipped = [];
  for (const [rel, data] of files) {
    const file = path.join(root, rel);
    let old = null;
    try { old = fs.readFileSync(file); } catch {}
    if (old && old.equals(data)) continue;
    if (old && LAUNCHER.test(rel) && ![MARKER, ...LEGACY_MARKERS].some((m) => old.includes(m))) { skipped.push(rel); continue; }
    write.push(rel);
  }
  const remove = previousList.filter((rel) => !files.has(rel) && !KEEP_TOP.has(rel.split("/")[0]) && fs.existsSync(path.join(root, rel)));
  return { write, remove, skipped };
}

function writeFileSafe(file, data, executable = false) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.posodobitev-${process.pid}`;
  let mode = executable ? 0o755 : 0o644;
  try { mode |= fs.statSync(file).mode & 0o111; } catch {} // izvedljiva ostane izvedljiva
  fs.writeFileSync(tmp, data, { mode });
  if (!isWin) fs.chmodSync(tmp, mode);
  try {
    fs.renameSync(tmp, file);
  } catch {
    fs.rmSync(tmp, { force: true }); // Windows: datoteka je odprta drugje, zapišemo neposredno
    fs.writeFileSync(file, data);
  }
}

// Zapiše spremembe; prejšnje datoteke shrani za morebitno vrnitev.
export function applyChanges(root, files, plan) {
  const bdir = backupDir(root);
  fs.rmSync(bdir, { recursive: true, force: true });
  fs.mkdirSync(bdir, { recursive: true });
  const added = [];
  for (const rel of [...plan.write, ...plan.remove]) {
    const file = path.join(root, rel);
    if (fs.existsSync(file)) {
      fs.mkdirSync(path.dirname(path.join(bdir, rel)), { recursive: true });
      fs.copyFileSync(file, path.join(bdir, rel));
    } else added.push(rel);
  }
  fs.writeFileSync(path.join(bdir, "..", "dodane.json"), JSON.stringify(added));
  for (const rel of plan.write) writeFileSafe(path.join(root, rel), files.get(rel), files.get(rel).executable);
  for (const rel of plan.remove) fs.rmSync(path.join(root, rel), { force: true });
}

// Vrne prejšnjo različico (če se nova ni zagnala) in si zapomni slabo različico, da je ne
// nameščamo znova, dokler na GitHubu ni novejše.
export function rollback(root = ROOT, say = console.log) {
  const state = readState(root);
  if (state.git && state.prejsnja) {
    try { git(root, "reset", "--keep", state.prejsnja); } catch (e) { say(`Vrnitev ni uspela: ${e.message}`); return false; }
  } else {
    const bdir = backupDir(root);
    if (!fs.existsSync(bdir)) return false;
    const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
      d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]);
    for (const f of walk(bdir)) writeFileSafe(path.join(root, path.relative(bdir, f)), fs.readFileSync(f));
    let added = [];
    try { added = JSON.parse(fs.readFileSync(path.join(bdir, "..", "dodane.json"), "utf8")); } catch {}
    for (const rel of added) fs.rmSync(path.join(root, rel), { force: true });
  }
  const datoteke = state.git ? state.datoteke : state.prejsnjeDatoteke;
  writeState(root, { ...state, sha: state.prejsnja || null, datoteke, slabe: [...new Set([...(state.slabe || []), state.sha].filter(Boolean))].slice(-20) });
  say("Nova različica se ni zagnala, vrnil sem prejšnjo.");
  return true;
}

// Ali je treba po spremembi znova zagnati strežnik oziroma nadzorni program.
export function needsRestart(changed) {
  return changed.some((f) => !/^(docs|test|\.github)\//.test(f) && !/^[^/]+\.md$/.test(f) && !LAUNCHER.test(f));
}
export function supervisorChanged(changed) {
  return changed.some((f) => /^scripts\/(posodobitev|nadzor|zagon|zaganjalnik|telefon|bliznjice)\.js$/.test(f));
}

function git(root, ...args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

async function latestSha() {
  let res;
  for (const repo of REPOS) {
    res = await fetch(`https://api.github.com/repos/${repo}/commits/${BRANCH}`, {
      headers: { Accept: "application/vnd.github.sha", "User-Agent": "evklid-posodobitev" },
      signal: AbortSignal.timeout(20000),
    });
    if (res.status !== 404) { REPO = repo; break; }
  }
  if (!res.ok) throw new Error(`GitHub ni odgovoril (${res.status})`);
  const sha = (await res.text()).trim();
  if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error("GitHub je vrnil neznan odgovor");
  return sha;
}

async function download(sha) {
  const res = await fetch(`https://codeload.github.com/${REPO}/tar.gz/${sha}`, {
    headers: { "User-Agent": "evklid-posodobitev" },
    signal: AbortSignal.timeout(5 * 60 * 1000),
  });
  if (!res.ok) throw new Error(`prenos ni uspel (${res.status})`);
  return Buffer.from(await res.arrayBuffer());
}

function gitMode(root) {
  if (!fs.existsSync(path.join(root, ".git"))) return false;
  try { git(root, "--version"); return true; } catch { return false; }
}

async function updateGit(root, say) {
  if (git(root, "rev-parse", "--abbrev-ref", "HEAD") !== BRANCH) return { changed: false, reason: `mapa ni na veji ${BRANCH}` };
  if (git(root, "status", "--porcelain", "--untracked-files=no")) return { changed: false, reason: "v mapi so neshranjene spremembe" };
  git(root, "fetch", "--quiet", "origin", BRANCH);
  const local = git(root, "rev-parse", "HEAD");
  const remote = git(root, "rev-parse", `origin/${BRANCH}`);
  const state = readState(root);
  if (local === remote || (state.slabe || []).includes(remote)) return { changed: false, sha: local };
  const changed = git(root, "diff", "--name-only", local, remote).split("\n").filter(Boolean);
  git(root, "merge", "--ff-only", "--quiet", `origin/${BRANCH}`);
  writeState(root, { ...state, git: true, sha: remote, prejsnja: local, cas: new Date().toISOString() });
  say(`Posodobljeno (git), spremenjenih datotek: ${changed.length}.`);
  return { changed: changed.length > 0, files: changed, sha: remote };
}

async function updateTarball(root, say) {
  const state = readState(root);
  const sha = await latestSha();
  if (sha === state.sha || (state.slabe || []).includes(sha)) return { changed: false, sha: state.sha };
  say("Prenašam novo različico Evklida ...");
  const files = filesFromTarball(await download(sha));
  if (!files.has("package.json") || !files.has("server/index.js")) throw new Error("prenesena različica ni popolna");
  const plan = planChanges(root, files, state.datoteke || []);
  applyChanges(root, files, plan);
  writeState(root, {
    ...state, git: false, sha, prejsnja: state.sha || null, cas: new Date().toISOString(),
    datoteke: [...files.keys()].sort(), prejsnjeDatoteke: state.datoteke || [],
  });
  const changed = [...plan.write, ...plan.remove];
  if (plan.skipped.length) say(`Teh zagonskih datotek ne prepišem med tekom: ${plan.skipped.join(", ")} (posodobi jih posodobi-windows.bat).`);
  say(changed.length ? `Posodobljeno, spremenjenih datotek: ${changed.length}.` : "Že najnovejša različica.");
  return { changed: changed.length > 0, files: changed, sha };
}

// Namesti knjižnice, če se je package.json spremenil (ista oznaka kot v zagonskih datotekah).
export function installIfNeeded(root = ROOT, say = console.log) {
  const pkg = path.join(root, "package.json");
  const mark = path.join(root, "node_modules", `.${BRAND.slug}-package.json`);
  for (const l of LEGACY) { // oznaka s prejšnjim imenom aplikacije
    try { if (!fs.existsSync(mark)) fs.renameSync(path.join(root, "node_modules", `.${l.slug}-package.json`), mark); } catch {}
  }
  try { if (fs.readFileSync(pkg).equals(fs.readFileSync(mark))) return true; } catch {}
  say("Nameščam knjižnice za novo različico ...");
  const r = spawnSync(isWin ? "npm.cmd" : "npm", ["install", "--omit=dev", "--no-audit", "--no-fund"],
    { cwd: root, stdio: "inherit", shell: isWin });
  if (r.status !== 0) { say("Namestitev knjižnic ni uspela, poskusim ob naslednji posodobitvi."); return false; }
  fs.mkdirSync(path.dirname(mark), { recursive: true });
  fs.copyFileSync(pkg, mark);
  return true;
}

function takeLock(root) {
  fs.mkdirSync(dataDir(root), { recursive: true });
  try {
    const st = fs.statSync(lockFile(root));
    if (Date.now() - st.mtimeMs < 15 * 60 * 1000) return false; // druga posodobitev že teče
  } catch {}
  fs.writeFileSync(lockFile(root), String(process.pid));
  return true;
}

// Ena posodobitev. Vrne { changed, files, sha, restart, selfRestart } ali { error }.
export async function update({ root = ROOT, say = console.log, install = true } = {}) {
  if (!takeLock(root)) return { changed: false, reason: "posodobitev že teče" };
  try {
    const r = gitMode(root) ? await updateGit(root, say) : await updateTarball(root, say);
    if (r.reason) say(`Posodobitev preskočena: ${r.reason}.`);
    if (!r.changed) return r;
    const installed = install ? installIfNeeded(root, say) : true;
    return { ...r, installed, restart: needsRestart(r.files), selfRestart: supervisorChanged(r.files) };
  } catch (e) {
    say(`Posodobitev ni uspela (${e.message}), nadaljujem s trenutno različico.`);
    return { changed: false, error: e.message };
  } finally {
    fs.rmSync(lockFile(root), { force: true });
  }
}

// Zagnano kot program (node scripts/posodobitev.js)? Na Windows so poti lahko različno velike.
const same = (a, b) => (isWin ? a.toLowerCase() === b.toLowerCase() : a === b);
if (process.argv[1] && same(path.resolve(process.argv[1]), fileURLToPath(import.meta.url))) {
  if (process.env.EVKLID_POSODOBITEV === "0") process.exit(0);
  console.log("Preverjam posodobitve ...");
  const r = await update();
  process.exit(r.error ? 1 : 0);
}
