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

// Različica datotek aplikacije za service worker (public/sw.js APP): commit in prstni odtis mape public/
// (pot, velikost in čas spremembe vsake datoteke). Ob objavi ali spremembi katere koli datoteke je nova,
// zato telefon shranjenih kopij ne uporabi več in vsako datoteko prenese znova (takojšnje odpiranje iz
// predpomnilnika samo za isto različico, j 6. 11. 2026). Izračun ob zagonu strežnika (~600 datotek, nekaj ms).
export function staticVersion(dir = path.join(root, "public")) {
  const h = crypto.createHash("sha256").update(appVersion());
  const walk = (d) => {
    let list = [];
    try { list = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of list.sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) walk(f);
      else if (e.isFile()) {
        try { const st = fs.statSync(f); h.update(`${path.relative(dir, f)}|${st.size}|${Math.round(st.mtimeMs)}\n`); } catch {}
      }
    }
  };
  walk(dir);
  return h.digest("hex").slice(0, 12);
}
