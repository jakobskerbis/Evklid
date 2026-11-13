// Zažene scripts/zagon.js ali scripts/telefon.js in ga zažene znova, ko se ta posodobi
// (izhodna koda 75). Če se nova različica takoj sesuje, vrne prejšnjo. Ta datoteka naj ostane
// kratka in se redko spreminja, saj se sama ne more posodobiti med tekom.
// Uporaba: node scripts/zaganjalnik.js zagon|telefon [možnosti]
import "../server/env.js";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const [name = "zagon", ...args] = process.argv.slice(2);
if (!/^(zagon|telefon)$/.test(name)) {
  console.log("Uporaba: node scripts/zaganjalnik.js zagon|telefon");
  process.exit(1);
}

let again = false; // ponovni zagon po posodobitvi (brez ponovnega odpiranja brskalnika)
let afterUpdate = 0;
function run() {
  const started = Date.now();
  const child = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", path.join(root, "scripts", `${name}.js`), ...args],
    { cwd: root, stdio: "inherit", env: { ...process.env, EVKLID_ZAGANJALNIK: "1", ...(again ? { EVKLID_PONOVNO: "1" } : {}) } });
  child.on("exit", async (code) => {
    if (code === 75) { again = true; afterUpdate = Date.now(); return run(); }
    // Posodobljeni zagonski program se je takoj sesul: vrnemo prejšnjo različico in poskusimo znova.
    if (code && afterUpdate && Date.now() - started < 60000) {
      afterUpdate = 0;
      const { rollback, installIfNeeded } = await import("./posodobitev.js");
      if (rollback(root)) { installIfNeeded(root); return run(); }
    }
    process.exit(code ?? 0);
  });
}
process.on("SIGINT", () => {}); // Ctrl+C dobi tudi podproces; počakamo, da se ustavi
run();
