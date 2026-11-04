// Katera različica Evklida teče (za samodejno osvežitev odprtih strani po posodobitvi).
// Render: RENDER_GIT_COMMIT; računalnik: data/posodobitev.json (scripts/posodobitev.js) ali .git.
import "./env.js";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => { try { return fs.readFileSync(f, "utf8").trim(); } catch { return ""; } };

function gitHead() {
  const head = read(path.join(root, ".git", "HEAD"));
  if (!head.startsWith("ref: ")) return head;
  const ref = head.slice(5);
  return read(path.join(root, ".git", ref)) ||
    (read(path.join(root, ".git", "packed-refs")).split("\n").find((l) => l.endsWith(` ${ref}`)) || "").split(" ")[0];
}

function stateSha() {
  try { return JSON.parse(read(path.join(root, "data", "posodobitev.json"))).sha || ""; } catch { return ""; }
}

export function appVersion() {
  return (process.env.RENDER_GIT_COMMIT || process.env.EVKLID_RAZLICICA || stateSha() || gitHead() || "").slice(0, 12);
}

// Različice knjižnic, ki jih service worker hrani brez preverjanja (/vendor/): ob spremembi
// dobi nov predpomnilnik, da telefon ne obdrži stare knjižnice.
export function vendorVersion() {
  let fonts = [];
  try { fonts = Object.keys(JSON.parse(read(path.join(root, "package.json"))).dependencies || {}).filter((m) => m.startsWith("@fontsource-variable/")).sort(); } catch {}
  const mods = ["katex", "marked", "dompurify", "pdfjs-dist", "three", ...fonts];
  const v = mods.map((m) => {
    try { return JSON.parse(read(path.join(root, "node_modules", m, "package.json"))).version; } catch { return "?"; }
  });
  return crypto.createHash("sha256").update(v.join("|")).digest("hex").slice(0, 8);
}
