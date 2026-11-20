// Kdaj objaviti novo različico na Renderju (j, 2026-10-30: »optimiziraj samodejne posodobitve«).
// GitHub Actions ob vsaki združitvi v main (in vsako uro za vsak primer): .github/workflows/render-posodobitev.yml.
// Na Renderju s trajnim diskom vsaka objava pomeni ~1 minuto izpada, zato (j, 19. 11. 2026: »Noč zdaj, baza po pilotu«):
//  - objavlja samo ponoči, med NOC_OD in NOC_DO po ljubljanskem času, ko se nihče ne uči;
//  - v nočnem oknu objavi, ko je strežnik miren, v zadnjih NOC_ZADNJIH_MIN minutah okna pa v vsakem primeru;
//  - nujen popravek ([nujno] v sporočilu združitve v main) ali ročni zagon objavi takoj;
//  - med dvema objavama vsaj MED_OBJAVAMA_MIN (razen nujnih);
//  - nikoli pred zelenimi testi (j, 20. 11. 2026): vsi posli POTREBNI_TESTI iz .github/workflows/testi.yml za
//    točno ta commit morajo biti končani z uspehom. Tudi [nujno] in ročni zagon počakata nanje (ročni zagon
//    jih preskoči samo z izrecno izbiro »brez_testov«). Padli testi: ta različica se ne objavi nikoli.
// Render Deploy Hook objavi vrh veje, zato tik pred sprožitvijo še enkrat preveri, da je vrh main še preverjeni commit,
// in ga pošlje kot ?ref=<sha>.
// Po pilotu (po 15. 12. 2026) se baza preseli izven Renderja; potem izpada ob objavi ni več in to okno ni potrebno.
// Okolje: HOOK (Render Deploy Hook), GH_TOKEN (bere teste: actions: read), REPO, URL (privzeto https://<domena>),
// ROCNO=1 (takoj, ko so testi zeleni), BREZ_TESTOV=1 (samo z ROCNO: objavi tudi brez zelenih testov).
export const MIRNO_MIN = 10; // toliko minut nihče ni nič poslal
export const MED_OBJAVAMA_MIN = 60;
export const NAJDLJE_MIN = 180;
export const NOC_OD = 3 * 60; // minute od polnoči, Europe/Ljubljana
export const NOC_DO = 5 * 60;
export const NOC_ZADNJIH_MIN = 30;
export const NUJNO = /^\s*\[nujno\]/i; // na začetku naslova PR (prva vrstica sporočila združitve)
export const TESTI_WORKFLOW = "testi.yml";
export const POTREBNI_TESTI = ["testi", "preveri", "hrosci", "tipi"]; // posli v testi.yml
export const TESTI_NAJDLJE_MIN = 75; // ročni zagon počaka na teste največ toliko (posel testi ima omejitev 75 min)

const URA_LJ = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Ljubljana", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
// Minute od polnoči po ljubljanskem času (poletni in zimski čas).
export function ljubljanaMin(now = Date.now()) {
  const p = Object.fromEntries(URA_LJ.formatToParts(new Date(now)).map((x) => [x.type, x.value]));
  return Number(p.hour) * 60 + Number(p.minute);
}
// Koliko minut do začetka nočnega okna (0 = okno je odprto). Ob prehodu na poletni/zimski čas ±60 min.
export function doNoci(now = Date.now()) {
  const m = ljubljanaMin(now);
  return m < NOC_OD ? NOC_OD - m : m < NOC_DO ? 0 : 1440 - m + NOC_OD;
}
// Začasno (j, 14. 11. 2026: »Odstrani to pravilo o objavah do ponedeljka«): do nedelje 15. 11. 00:00 (Ljubljana)
// se vsaka združitev v main objavi takoj, brez čakanja na miren strežnik in brez ure med objavama.
// Konec skrajšan na začetek pilota (j, 14. 11. 2026): objava med pilotom ne sme prekiniti odgovora inštruktorja.
export const TAKOJ_DO = Date.parse("2026-11-15T00:00:00+01:00");

// stanje: odgovor /healthz/stanje ali null (strežnik ni dosegljiv)
// cakaMin: koliko minut je stara najstarejša neobjavljena sprememba v main
// zadnja: { sha, at } zadnje sprožene objave (predpomnilnik GitHub Actions) ali null
// nujno: med neobjavljenimi spremembami je združitev z [nujno] v sporočilu
// testi: stanjeTestov(...) za mainSha; brez njega (null) se ne objavi. brezTestov: samo z rocno (izrecna izbira v ročnem zagonu).
export function decide({ stanje, mainSha, cakaMin, testi = null, rocno = false, brezTestov = false, takoj = false, nujno = false, zadnja = null, now = Date.now() }) {
  if (stanje && mainSha.startsWith(stanje.razlicica || "\0")) return { objavi: false, zakaj: "že teče zadnja različica" };
  if (!(rocno && brezTestov) && testi?.stanje !== "uspeh") {
    if (testi?.stanje === "napaka") return { objavi: false, testi: "napaka", zakaj: `testi za to različico niso uspeli (${testi.zakaj}), ne objavim` };
    return { objavi: false, testi: "caka", zakaj: `čakam na zelene teste (${testi?.zakaj || "stanje testov ni znano"})` };
  }
  if (rocno) return { objavi: true, zakaj: testi?.stanje === "uspeh" ? "ročni zagon" : "ročni zagon brez testov (izrecno izbrano)" };
  // Ista različica je bila sprožena, a ne teče: objava še poteka ali ni uspela. Ne ponavljaj ob vsakem teku.
  if (zadnja?.sha === mainSha && now - zadnja.at < NAJDLJE_MIN * 60000) return { objavi: false, zakaj: "ta različica je že bila sprožena (objava poteka ali ni uspela)" };
  if (takoj) return { objavi: true, zakaj: "pravila o mirnem trenutku začasno ne veljajo (TAKOJ_DO)" };
  if (nujno) return { objavi: true, zakaj: "nujen popravek ([nujno])" };
  const doOkna = doNoci(now);
  if (doOkna > 0) return { objavi: false, zakaj: `čakam na nočno okno (še ${Math.round(doOkna)} min)`, doOkna };
  // Sprožena pred kratkim (druga različica): objava morda še poteka ali ni uspela – strežnik je še star, gorMs velik.
  const sprozenaMin = zadnja?.at ? (now - zadnja.at) / 60000 : Infinity;
  if (!stanje) return cakaMin >= MED_OBJAVAMA_MIN && sprozenaMin >= MED_OBJAVAMA_MIN ? { objavi: true, zakaj: "strežnik ni dosegljiv, sprememba čaka že dolgo" } : { objavi: false, zakaj: "strežnik ni dosegljiv (morda se ravno objavlja)" };
  const gorMin = Math.min((stanje.gorMs ?? Infinity) / 60000, sprozenaMin);
  if (gorMin < MED_OBJAVAMA_MIN) return { objavi: false, zakaj: `zadnja objava pred ${Math.round(gorMin)} min` };
  if (ljubljanaMin(now) >= NOC_DO - NOC_ZADNJIH_MIN) return { objavi: true, zakaj: "konec nočnega okna" };
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

// Ali je med združitvami v main (prva-starševska veriga od head, kot pendingSince) po času poMs kakšna z
// [nujno] na začetku naslova. Commiti iz vej PR in telo sporočila se ne štejejo; starejše nujne (že sprožene) tudi ne.
export function nujnaSprememba(commits, head, poMs = -Infinity) {
  const bySha = new Map(commits.filter((c) => c?.sha).map((c) => [c.sha, c]));
  const seen = new Set();
  for (let c = bySha.get(head); c && !seen.has(c); c = bySha.get(c.parents?.[0]?.sha)) {
    seen.add(c);
    const d = Date.parse(c.commit?.committer?.date || "");
    if (Number.isFinite(d) && d <= poMs) break;
    if (NUJNO.test(String(c.commit?.message || "").split("\n")[0])) return true;
  }
  return false;
}

// Stanje testov za commit iz GitHub Actions: run = zadnji zagon testi.yml ob pushu za ta commit (ali null),
// jobs = njegovi posli (filter=latest, torej zadnji poskus). Vrne { stanje: "uspeh" | "caka" | "napaka", zakaj }.
// Napaka ima prednost: že en padel posel pomeni, da se ta commit ne objavi (tudi če drugi še tečejo).
export function stanjeTestov(run, jobs, potrebni = POTREBNI_TESTI) {
  if (!run) return { stanje: "caka", zakaj: "testi se še niso začeli" };
  const zadnji = new Map();
  for (const j of jobs || []) if (!zadnji.has(j.name) || j.id > zadnji.get(j.name).id) zadnji.set(j.name, j);
  const padli = [], cakajo = [];
  for (const ime of potrebni) {
    const j = zadnji.get(ime);
    if (j?.status === "completed") { if (j.conclusion !== "success") padli.push(`${ime}: ${j.conclusion}`); }
    else if (j || run.status !== "completed") cakajo.push(ime);
    else padli.push(`${ime}: posla ni`);
  }
  if (padli.length) return { stanje: "napaka", zakaj: padli.join(", ") };
  if (cakajo.length) return { stanje: "caka", zakaj: `še tečejo: ${cakajo.join(", ")}` };
  if (run.status === "completed" && run.conclusion !== "success") return { stanje: "napaka", zakaj: `zagon: ${run.conclusion}` };
  return { stanje: "uspeh", zakaj: "vsi testi zeleni" };
}

async function main() {
  const { HOOK, GH_TOKEN, ROCNO, BREZ_TESTOV } = process.env;
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
  // Na teste počaka tudi ročni zagon. Ob združitvi pa novi tek sproži že konec testov (workflow_run v render-posodobitev.yml).
  const konecTesti = Math.max(konec, Date.now() + TESTI_NAJDLJE_MIN * 60000);
  const pocakaj = () => new Promise((res) => setTimeout(res, 5 * 60000));
  const testiZa = async (sha) => {
    try {
      const runs = (await gh(`actions/workflows/${TESTI_WORKFLOW}/runs?head_sha=${sha}&event=push&per_page=10`)).workflow_runs || [];
      const run = runs.sort((a, b) => b.id - a.id)[0] || null;
      return stanjeTestov(run, run ? (await gh(`actions/runs/${run.id}/jobs?filter=latest&per_page=100`)).jobs : []);
    } catch (e) {
      return { stanje: "caka", zakaj: `stanja testov ni bilo mogoče prebrati: ${e.message}` };
    }
  };
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
    let nujno = false;
    try {
      const cmp = stanje?.razlicica ? await gh(`compare/${stanje.razlicica}...main`) : { commits: [await gh("commits/main")] };
      const t = pendingSince(cmp.commits || [], mainSha);
      if (t) cakaMin = (Date.now() - t) / 60000;
      // Nujna je le združitev po zadnji sproženi objavi (sicer bi vsaka naslednja združitev objavila takoj,
      // dokler nujna različica ne teče). Brez različice strežnika: zadnjih 30 commitov, največ 1 dan nazaj.
      const vrsta = stanje?.razlicica ? cmp.commits || [] : await gh(`commits?sha=${mainSha}&per_page=30`);
      nujno = nujnaSprememba(vrsta, mainSha, Math.max(zadnja?.at ?? 0, stanje?.razlicica ? 0 : Date.now() - 86400000));
    } catch {}
    const testi = await testiZa(mainSha);
    const d = decide({ stanje, mainSha, cakaMin, testi, rocno: ROCNO === "1", brezTestov: BREZ_TESTOV === "1", takoj: Date.now() < TAKOJ_DO, nujno, zadnja });
    console.log(`${new Date().toISOString().slice(11, 16)} main ${mainSha.slice(0, 12)}, strežnik ${stanje?.razlicica || "?"}, čaka ${Math.round(cakaMin)} min${nujno ? ", [nujno]" : ""}: ${d.zakaj}`);
    if (d.objavi) {
      // Hook objavi vrh veje: če se je main medtem premaknil, odloči znova za novi vrh (tudi testi so drugi).
      let vrh = mainSha;
      try { vrh = (await gh("commits/main")).sha; } catch {}
      if (vrh !== mainSha) { console.log(`main se je medtem premaknil na ${vrh.slice(0, 12)}, preverim znova.`); continue; }
      const hook = new URL(HOOK);
      hook.searchParams.set("ref", mainSha); // točno preverjeni commit, ne vrh veje ob sprožitvi
      let r = await fetch(hook, { method: "POST" });
      // Če Render parametra ref ne sprejme (400; 404: commita še ne vidi), sproži brez njega, a samo, če je vrh main
      // še vedno preverjeni commit (brez ref Render objavi vrh veje); napaka GitHub API ali nov vrh: preverim znova.
      if (!r.ok && r.status >= 400 && r.status < 500) {
        let vrh2 = null;
        try { vrh2 = (await gh("commits/main")).sha; } catch {}
        if (vrh2 !== mainSha) { console.log(`Render z ref: ${r.status}; vrh main ${vrh2?.slice(0, 12) || "ni znan"}, preverim znova.`); await pocakaj(); continue; }
        console.log(`Render z ref: ${r.status}, sprožim brez ref.`);
        r = await fetch(HOOK, { method: "POST" });
      }
      if (!r.ok) throw new Error(`Render: ${r.status}`);
      fs.writeFileSync(file, JSON.stringify({ sha: mainSha, at: Date.now() }));
      if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, "sprozeno=1\n");
      return console.log("Objava sprožena.");
    }
    if (d.testi === "napaka") return console.log(`::warning::Render: ${mainSha.slice(0, 12)} se ne objavi, ker testi niso uspeli (objavi se, ko so zeleni: ponovni zagon testov ali nova združitev).`);
    if (d.testi === "caka") { if (Date.now() + 5 * 60000 > konecTesti) return; await pocakaj(); continue; }
    if (d.zakaj === "že teče zadnja različica" || d.zakaj.startsWith("ta različica je že bila sprožena") || Date.now() + 5 * 60000 > konec) return;
    // Do nočnega okna je dlje, kot ta tek sme čakati: objavi ga nočni tek urnika (ne porablja minut GitHub Actions).
    if (d.doOkna && Date.now() + d.doOkna * 60000 > konec) return;
    await pocakaj();
  }
}

if (process.argv[1]?.endsWith("render-objava.js")) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
