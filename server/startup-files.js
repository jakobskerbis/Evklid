// Datoteke, ki jih brskalnik potrebuje ob prvem odprtju strani: vse, kar naloži public/index.html
// (slogi, skripte), in vsi moduli, ki jih app.js uvozi statično (import … from "./…"), ne pa tisti z
// import(), ki se naložijo šele ob uporabi. Strežnik jih po zagonu vnaprej stisne (server/compress.js),
// da prvi obiski po posodobitvi niso počasni. Vrne poti URL (npr. "/app.js", "/vendor/katex/katex.min.css").
import fs from "node:fs";
import path from "node:path";

const LOCAL = /\b(?:src|href)="(?!https?:|\/\/|data:|#)([^"?#]+)(?:[?#][^"]*)?"/g; // ?v=… odrežemo (ikone)
const IMPORT = /(?:^|[;\n}])\s*(?:import\s+(?:[\w*{}\s,$]+?\s+from\s+)?|export\s+(?:\*(?:\s+as\s+\w+)?|\{[^}]*\})\s+from\s+)["']([^"']+)["']/g;

// later: moduli, ki jih stran naloži nekoliko kasneje (npr. "games/index.js"); pridejo na konec seznama.
export function startupFiles(publicDir, entry = "index.html", later = []) {
  const urls = new Set();
  const seen = new Set();
  const toUrl = (abs) => "/" + path.relative(publicDir, abs).split(path.sep).join("/");
  const visitModule = (abs) => {
    if (seen.has(abs) || !abs.startsWith(publicDir + path.sep)) return;
    seen.add(abs);
    let src;
    try {
      src = fs.readFileSync(abs, "utf8");
    } catch {
      return;
    }
    urls.add(toUrl(abs));
    for (const m of src.matchAll(IMPORT)) {
      const spec = m[1];
      if (spec.startsWith("/")) visitModule(path.join(publicDir, spec));
      else if (spec.startsWith(".")) visitModule(path.resolve(path.dirname(abs), spec));
    }
  };
  let html = "";
  try {
    html = fs.readFileSync(path.join(publicDir, entry), "utf8");
  } catch {
    return [];
  }
  urls.add("/");
  for (const m of html.matchAll(LOCAL)) {
    const ref = m[1].replace(/^\.\//, "");
    const url = ref.startsWith("/") ? ref : "/" + ref;
    if (url.startsWith("/vendor/")) urls.add(url); // knjižnice so v node_modules, uvozov ne sledimo
    else if (url.endsWith(".js")) visitModule(path.join(publicDir, url));
    else if (fs.existsSync(path.join(publicDir, url))) urls.add(url); // /manifest.webmanifest tvori strežnik sam
  }
  // Moduli strani, ki jih zažene public/zagon.js (data-moduli="a.js b.js"), so del prvega nalaganja.
  for (const m of html.matchAll(/\bdata-moduli="([^"]*)"/g))
    for (const ref of m[1].split(/\s+/).filter(Boolean)) visitModule(path.join(publicDir, ref.replace(/^\.?\//, "")));
  for (const m of later) visitModule(path.join(publicDir, m));
  return [...urls];
}
