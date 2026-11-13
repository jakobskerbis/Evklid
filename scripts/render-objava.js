// Kdaj objaviti novo različico na Renderju (j, 2026-10-30: »optimiziraj samodejne posodobitve«).
// GitHub Actions ob vsaki združitvi v main (in vsako uro za vsak primer): .github/workflows/render-posodobitev.yml.
// Na Renderju s trajnim diskom vsaka objava pomeni ~1 minuto izpada, zato:
//  - objavi takoj, ko nihče ne uporablja Evklida (miren strežnik);
//  - med uporabo počaka, a najdlje NAJDLJE_MIN od prve neobjavljene spremembe;
//  - med dvema objavama vsaj MED_OBJAVAMA_MIN (ne zaganja ves dan znova).
// Okolje: HOOK (Render Deploy Hook), GH_TOKEN, REPO, URL (privzeto https://<domena>), ROCNO=1 (takoj).
export const MIRNO_MIN = 10; // toliko minut nihče ni nič poslal
export const MED_OBJAVAMA_MIN = 60;
export const NAJDLJE_MIN = 180;

// stanje: odgovor /healthz/stanje ali null (strežnik ni dosegljiv)
// cakaMin: koliko minut je stara najstarejša neobjavljena sprememba v main
// zadnja: { sha, at } zadnje sprožene objave (predpomnilnik GitHub Actions) ali null
export function decide({ stanje, mainSha, cakaMin, rocno = false, zadnja = null, now = Date.now() }) {
  if (stanje && mainSha.startsWith(stanje.razlicica || "\0")) return { objavi: false, zakaj: "že teče zadnja različica" };
  if (rocno) return { objavi: true, zakaj: "ročni zagon" };
  // Ista različica je bila sprožena, a ne teče: objava še poteka ali ni uspela. Ne ponavljaj ob vsakem teku.
  if (zadnja?.sha === mainSha && now - zadnja.at < NAJDLJE_MIN * 60000) return { objavi: false, zakaj: "ta različica je že bila sprožena (objava poteka ali ni uspela)" };
  // Sprožena pred kratkim (druga različica): objava morda še poteka ali ni uspela – strežnik je še star, gorMs velik.
  const sprozenaMin = zadnja?.at ? (now - zadnja.at) / 60000 : Infinity;
  if (!stanje) return cakaMin >= MED_OBJAVAMA_MIN && sprozenaMin >= MED_OBJAVAMA_MIN ? { objavi: true, zakaj: "strežnik ni dosegljiv, sprememba čaka že dolgo" } : { objavi: false, zakaj: "strežnik ni dosegljiv (morda se ravno objavlja)" };
  if (cakaMin >= NAJDLJE_MIN) return { objavi: true, zakaj: `sprememba čaka že ${Math.round(cakaMin)} min` };
  const gorMin = Math.min((stanje.gorMs ?? Infinity) / 60000, sprozenaMin);
  if (gorMin < MED_OBJAVAMA_MIN) return { objavi: false, zakaj: `zadnja objava pred ${Math.round(gorMin)} min` };
  const miren = !stanje.aktivni && (stanje.mirujeMs == null || stanje.mirujeMs >= MIRNO_MIN * 60000);
  return miren ? { objavi: true, zakaj: "strežnik je miren" } : { objavi: false, zakaj: "nekdo se ravno uči, počakam" };
}

// Od kdaj je v main sprememba, ki je na strežniku še ni. Commiti iz vej PR (tudi »Merge main« v veji)
// imajo stare datume, zato šteje le prva-starševska veriga main od head: združitve in squash commiti,
// ki jih ustvari GitHub z datumom združitve.
export function pendingSince(commits, head = commits[commits.length - 1]?.sha) {
  const date = (c) => Date.parse(c?.commit?.committer?.date || "");
  const bySha = new Map(commits.filter((c) => c?.sha).map((c) => [c.sha, c]));
  let t = null;
  const seen = new Set();
  for (let c = bySha.get(head) || commits[commits.length - 1]; c && !seen.has(c); c = bySha.get(c.parents?.[0]?.sha)) {
    seen.add(c);
    const d = date(c);
    if (Number.isFinite(d) && (t == null || d < t)) t = d;
  }
  return t;
}

async function main() {
  const { HOOK, GH_TOKEN, ROCNO } = process.env;
  if (!HOOK) return console.log("RENDER_DEPLOY_HOOK ni nastavljen, preskočeno.");
  const { BRAND } = await import("../server/brand.js");
  const REPO = process.env.REPO || BRAND.repo;
  const url = process.env.URL || `https://${BRAND.domain}`;
  const gh = async (p) => {
    const r = await fetch(`https://api.github.com/repos/${REPO}/${p}`, { headers: { Accept: "application/vnd.github+json", "User-Agent": "evklid-render-objava", ...(GH_TOKEN ? { Authorization: `Bearer ${GH_TOKEN}` } : {}) } });
    if (!r.ok) throw new Error(`GitHub ${p}: ${r.status}`);
    return r.json();
  };
  const fs = await import("node:fs");
  const file = process.env.ZADNJA || ".render-objava.json";
  let zadnja = null;
  try { zadnja = JSON.parse(fs.readFileSync(file, "utf8")); } catch {}
  // CAKAJ=1 (ob združitvi v main in ob urniku): če zdaj ni pravi trenutek, preverja vsakih 5 minut,
  // dokler se ne objavi ali ne mine NAJDLJE_MIN + 20 min. Novejša združitev ta tek prekine (concurrency).
  const konec = Date.now() + (process.env.CAKAJ === "1" ? (NAJDLJE_MIN + 20) * 60000 : 0);
  const pocakaj = () => new Promise((res) => setTimeout(res, 5 * 60000));
  for (;;) {
    let mainSha;
    try { mainSha = (await gh("commits/main")).sha; } catch (e) {
      if (Date.now() + 5 * 60000 > konec) throw e; // trenutna napaka GitHub API ne prekine čakanja
      console.log(e.message); await pocakaj(); continue;
    }
    let stanje = null;
    try {
      const r = await fetch(`${url}/healthz/stanje`, { signal: AbortSignal.timeout(10000) });
      if (r.ok) stanje = await r.json();
    } catch {}
    let cakaMin = 0;
    try {
      const cmp = stanje?.razlicica ? await gh(`compare/${stanje.razlicica}...main`) : { commits: [await gh("commits/main")] };
      const t = pendingSince(cmp.commits || [], mainSha);
      if (t) cakaMin = (Date.now() - t) / 60000;
    } catch {}
    const d = decide({ stanje, mainSha, cakaMin, rocno: ROCNO === "1", zadnja });
    console.log(`${new Date().toISOString().slice(11, 16)} main ${mainSha.slice(0, 12)}, strežnik ${stanje?.razlicica || "?"}, čaka ${Math.round(cakaMin)} min: ${d.zakaj}`);
    if (d.objavi) {
      const r = await fetch(HOOK, { method: "POST" });
      if (!r.ok) throw new Error(`Render: ${r.status}`);
      fs.writeFileSync(file, JSON.stringify({ sha: mainSha, at: Date.now() }));
      if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, "sprozeno=1\n");
      return console.log("Objava sprožena.");
    }
    if (d.zakaj === "že teče zadnja različica" || d.zakaj.startsWith("ta različica je že bila sprožena") || Date.now() + 5 * 60000 > konec) return;
    await pocakaj();
  }
}

if (process.argv[1]?.endsWith("render-objava.js")) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
