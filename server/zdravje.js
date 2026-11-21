// Zdravje strežnika za lastnika (pilot, 21. 11. 2026): ali inštruktor AI dela za vse, nepričakovani ponovni zagoni,
// zasedenost diska in javni alarm /healthz/alarm (drugi monitor v UptimeRobotu, docs/spremljanje.md).
// Ob okvari, ki ustavi inštruktorja za vse (ni dobroimetja, neveljaven ključ, model ne obstaja ali ZAPORED zaporednih
// neuspelih klicev), ob nepričakovanem ponovnem zagonu in ob polnem disku dobi skrbnik (EVKLID_ADMIN_EMAILS) e-pošto,
// za vsako vrsto največ eno v RAZMIK (čas zadnjega opozorila je v kv, zato velja tudi čez ponovni zagon).
// Na javnih poteh so samo časi, vrste in zaokrožena števila: brez vsebine, naslovov, poti in ključev.
// Nov modul: zbira zdravje, ki ga drugi moduli (opozorilo-ai.js strošek, kopije*.js, pomnilnik.js) nimajo; opozorilo-ai.js
// ostane ločen, ker teče po urniku in šteje znesek, tu pa se odziva na dogodke.
import fs from "node:fs";
import path from "node:path";
import { BRAND } from "./brand.js";
import { Mailer, layout, esc } from "./accounts/email.js";
import { emailList } from "./accounts/pilot-meja.js";

const KV_KEY = "zdravje";
const MIN = 60_000;
const URA = 60 * MIN;
export const ZAPORED = 5; // toliko zaporednih neuspelih klicev AI (ne glede na vrsto) = inštruktor ne dela
export const RAZMIK = { ai: URA, zagon: 6 * URA, disk: 6 * URA };
export const SVEZ_ZAGON_MS = URA; // alarm »zagon« še uro po nepričakovanem ponovnem zagonu
export const PRIVZETO_DISK = 85; // % zasedenosti diska z bazo, nad tem opozorilo

const NAVODILA = `https://github.com/${BRAND.repo}/blob/main/docs/spremljanje.md`;

// Napake, po katerih inštruktor ne dela za nikogar, dokler lastnik nečesa ne popravi.
export const KRITICNE = {
  dobroimetje: { opis: "na API računu Anthropic ni več dobroimetja", korak: "Napolni dobroimetje v konzoli Anthropic (Billing) ali vklopi samodejno polnjenje." },
  kljuc: { opis: "ključ API ni veljaven (401)", korak: "Preveri ANTHROPIC_API_KEY v Render → Environment (nov ključ ustvariš v konzoli Anthropic)." },
  dovoljenje: { opis: "ključ API nima dovoljenja (403)", korak: "Preveri ključ in njegov delovni prostor v konzoli Anthropic." },
  model: { opis: "model ne obstaja več (404)", korak: "Preveri EVKLID_MODEL, EVKLID_MODEL_DEEP in EVKLID_MODEL_MID v Render → Environment." },
};

// Koda iz claude.js apiErrorCode → kratka vrsta. null: napaka enega učenca (predolgo sporočilo) ali naša vrsta za AI.
export function vrstaNapakeAi(koda) {
  const k = String(koda || "");
  if (!k || /^413/.test(k) || /hkratnih/.test(k)) return null;
  if (/dobroimetja/.test(k)) return "dobroimetje";
  if (/^401/.test(k)) return "kljuc";
  if (/^403/.test(k)) return "dovoljenje";
  if (/^404/.test(k)) return "model";
  if (/^429/.test(k)) return "omejitev";
  if (/^529/.test(k)) return "preobremenjen";
  if (/^5\d\d/.test(k)) return "streznik";
  if (/povezave/.test(k)) return "povezava";
  if (/zastoj/.test(k)) return "zastoj";
  if (/^400/.test(k)) return "zahteva";
  return "drugo";
}

export function pragDiska(env = process.env) {
  const v = Number(String(env.EVKLID_DISK_OPOZORILO ?? "").replace(",", "."));
  return Number.isFinite(v) && v > 0 && v <= 100 ? v : PRIVZETO_DISK;
}

const pismo = (naslov, odstavki, koraki) => ({
  subject: `${BRAND.name}: ${naslov}`,
  text: `${odstavki.join("\n\n")}\n\n${koraki.map((s) => `- ${s}`).join("\n")}\n\nNavodila: ${NAVODILA}`,
  html: layout(naslov, `${odstavki.map((o) => `<p>${esc(o)}</p>`).join("")}<ul>${koraki.map((s) => `<li>${esc(s)}</li>`).join("")}</ul><p>Navodila: <a href="${esc(NAVODILA)}">docs/spremljanje.md</a></p>`),
});

export function pismoAi(vrsta, zapored) {
  const k = KRITICNE[vrsta];
  if (k) return pismo(`inštruktor AI ne dela (${k.opis})`, [`Zadnji klic modela AI ni uspel: ${k.opis}. Dokler tega ne popraviš, učenci namesto odgovora dobijo napako.`], [k.korak, "Ko je popravljeno, prvi uspešen odgovor to stanje v /healthz/stanje počisti sam."]);
  return pismo(`inštruktor AI ne dela (${zapored} zaporednih napak)`, [`Zadnjih ${zapored} klicev modela AI ni uspelo (zadnja vrsta napake: ${vrsta}).`], ["Poglej status.anthropic.com in dnevnik strežnika na Renderju (»napaka pri klicu modela«).", "Ko je popravljeno, prvi uspešen odgovor to stanje počisti sam."]);
}
export function pismoZagon(z) {
  return pismo(
    "strežnik se je nepričakovano znova zagnal",
    [`Strežnik se ni ustavil po običajni poti (objava ali ročni ponovni zagon), ampak ${z.razlog === "neznan" ? "brez zapisa vzroka (npr. premalo pomnilnika ali SIGKILL)" : `zaradi napake v kodi (${z.razlog})`}. Odgovori v teku so se prekinili. Nepričakovanih zagonov doslej: ${z.nepricakovani}.`],
    ["Poglej dnevnik na Renderju (Events in Logs) okoli tega časa.", "Pri pomnilniku poglej /healthz/stanje → pomnilnik in disk."],
  );
}
export function pismoDisk(d) {
  return pismo(
    `disk z bazo je zaseden ${d.delez} %`,
    [`Disk z bazo je zaseden ${d.delez} % (prosto ${d.prostoMb} MB od ${d.skupajMb} MB, baza ${d.bazaMb} MB). Ko se napolni, baza zavrne zapise in kopije se tiho skrčijo.`],
    ["Povečaj disk na Renderju (Disks) ali pobriši stare ročne kopije in .pred-obnovo-* v mapi kopij.", `Mejo opozorila spremeniš z EVKLID_DISK_OPOZORILO (zdaj ${d.opozorilo} %).`],
  );
}

/**
 * Presoja za javni /healthz/alarm (in drugi monitor UptimeRobot): kratke kode brez podrobnosti, prazno = vse v redu.
 * j je isti objekt kot /healthz/stanje. Stanja trajajo, dokler okvara traja (UptimeRobot javi začetek in konec).
 */
export function razlogiAlarma(j, { bazaOk = true, now = Date.now() } = {}) {
  const r = [];
  if (!bazaOk) r.push("baza");
  if (j.ai?.deluje === false) r.push("ai");
  const po = j.posta;
  if (po?.nastavljena && po.zadnjaNapaka && (!po.zadnjiUspeh || po.zadnjaNapaka > po.zadnjiUspeh) && /^(omrežje|401|403|429|5\d\d)/.test(po.razlog || "")) r.push("posta");
  const pk = j.preverjanjeKopij;
  if (j.kopije?.napaka || j.kopijeZunaj?.napaka || (pk && pk.ok === false && !pk.prehodna)) r.push("kopije");
  if (j.disk && j.disk.delez >= j.disk.opozorilo) r.push("disk");
  const pm = j.pomnilnik;
  if (pm && pm.najvecDelez > (pm.opozorilo ?? 85)) r.push("pomnilnik");
  if (j.zagoni?.zadnji && now - Date.parse(j.zagoni.zadnji) < SVEZ_ZAGON_MS) r.push("zagon");
  return r;
}

/**
 * db: baza (kv), dbFile: datoteka baze (disk in oznaka teka ob njej; brez nje ali ":memory:" ni diska ne oznake).
 * Vrne { aiIzid, ai, zagon, sesutje, cistaZaustavitev, zagoni, disk, preveriDisk }.
 */
export function createZdravje(db, { dbFile = null, mailer = null, fetchFn, env = process.env, log = console, now = () => new Date(), statfs = (p) => fs.statfsSync(p), scheduler = true } = {}) {
  const naDisku = !!dbFile && dbFile !== ":memory:";
  const dir = naDisku ? path.dirname(path.resolve(dbFile)) : null;
  // Oznaka teka: nastane ob zagonu, ob čisti zaustavitvi se pobriše. Če je ob zagonu še tu, se prejšnji proces ni
  // ustavil po običajni poti. Datoteka ob bazi, ne v bazi: obnova iz kopije (narejene med tekom) je ne prinese nazaj.
  const oznaka = dir ? path.join(dir, "zagon.json") : null;
  const kvGet = () => {
    try {
      return JSON.parse(db.prepare("SELECT value FROM kv WHERE key = ?").get(KV_KEY)?.value || "null") || {};
    } catch {
      return {};
    }
  };
  const kvSet = (v) => {
    try {
      if (db.isOpen !== false) db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(KV_KEY, JSON.stringify(v));
    } catch (e) {
      log.warn?.(`[evklid] zdravje: zapis ni uspel (${e.message})`);
    }
  };
  const iso = () => now().toISOString();

  // E-pošta skrbniku za vrsto `kljuc`, največ ena v razmikMs. Vrne obljubo "poslano" | "napaka" | "ni nastavljeno" | "prezgodaj".
  async function opozori(kljuc, sporocilo, razmikMs) {
    const stanje = kvGet();
    const prej = stanje.opozorila?.[kljuc];
    if (prej && now().getTime() - Date.parse(prej) < razmikMs) return "prezgodaj";
    kvSet({ ...stanje, opozorila: { ...stanje.opozorila, [kljuc]: iso() } }); // tudi ob neuspehu: ne pošiljamo v zanki
    const to = emailList(env.EVKLID_ADMIN_EMAILS);
    const m = mailer ?? new Mailer({ fetchFn });
    if (!to.length || !m.enabled) {
      log.error?.(`[evklid] zdravje (${kljuc}): e-pošta skrbniku ni poslana (ni EVKLID_ADMIN_EMAILS ali Resend)`);
      return "ni nastavljeno";
    }
    let sent = 0;
    for (const addr of to) {
      try {
        await m.send({ to: addr, ...sporocilo });
        sent++;
      } catch (e) {
        log.error?.(`[evklid] zdravje (${kljuc}): e-pošta skrbniku ni uspela (${String(e.message).replace(/[^\s<>"']+@[^\s<>"']+/g, "…")})`);
      }
    }
    return sent ? "poslano" : "napaka";
  }
  const vOzadju = (p) => p.catch((e) => log.error?.(`[evklid] zdravje: ${e?.message || e}`));

  // --- AI ---
  const ai = { zadnjiUspeh: null, zadnjaNapaka: null, vrsta: null, zapored: 0 };
  // zapored: neuspeli klici od zadnjega uspeha (uspeh ga postavi na 0).
  const aiNeDela = () => ai.zapored > 0 && (!!KRITICNE[ai.vrsta] || ai.zapored >= ZAPORED);
  // Klic iz claude.js (nastaviOpazovalcaAi). Vrne obljubo e-pošte ali null (za teste).
  function aiIzid({ ok, koda } = {}) {
    if (ok) {
      ai.zadnjiUspeh = iso();
      ai.zapored = 0;
      return null;
    }
    const vrsta = vrstaNapakeAi(koda);
    if (!vrsta) return null;
    ai.zadnjaNapaka = iso();
    ai.vrsta = vrsta;
    ai.zapored++;
    if (KRITICNE[vrsta]) return vOzadju(opozori(`ai-${vrsta}`, pismoAi(vrsta), RAZMIK.ai));
    if (ai.zapored >= ZAPORED) return vOzadju(opozori("ai-zapored", pismoAi(vrsta, ai.zapored), RAZMIK.ai));
    return null;
  }
  const aiStanje = () => ({ deluje: !aiNeDela(), zadnjiUspeh: ai.zadnjiUspeh, zadnjaNapaka: ai.zadnjaNapaka, vrsta: ai.vrsta, zapored: ai.zapored });

  // --- ponovni zagoni ---
  const zagoni = () => {
    const z = kvGet().zagoni;
    return { nepricakovani: z?.nepricakovani || 0, zadnji: z?.zadnji || null, razlog: z?.razlog || null };
  };
  // Ob zagonu strežnika (server/index.js). Vrne stanje zagonov in obljubo e-pošte (za teste) ali null.
  function zagon() {
    if (!oznaka) return null;
    let prej = null;
    try {
      prej = JSON.parse(fs.readFileSync(oznaka, "utf8"));
    } catch (e) {
      if (e.code !== "ENOENT") prej = {}; // poškodovana oznaka: prejšnji tek se ni končal čisto
    }
    let posta = null;
    if (prej) {
      const z = zagoni();
      const nov = { nepricakovani: z.nepricakovani + 1, zadnji: iso(), razlog: prej.razlog || "neznan" };
      kvSet({ ...kvGet(), zagoni: nov });
      log.error?.(`[evklid] OPOZORILO: prejšnji tek strežnika se ni končal čisto (${nov.razlog}); nepričakovanih zagonov: ${nov.nepricakovani}`);
      posta = vOzadju(opozori("zagon", pismoZagon(nov), RAZMIK.zagon));
    }
    try {
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(oznaka, JSON.stringify({ od: iso(), pid: process.pid }));
    } catch (e) {
      log.warn?.(`[evklid] oznaka teka ni zapisana: ${e.message}`);
    }
    return { ...zagoni(), posta };
  }
  // Ob nepričakovani napaki pred izhodom (sinhrono): vrsta napake za naslednji zagon, brez sporočila (lahko vsebuje podatke).
  function sesutje(err, origin = "uncaughtException") {
    if (!oznaka) return;
    try {
      const ime = String(err?.name || err?.constructor?.name || typeof err).replace(/[^\w.-]/g, "").slice(0, 40) || "napaka";
      fs.writeFileSync(oznaka, JSON.stringify({ od: iso(), razlog: `${String(origin).replace(/[^\w]/g, "")} ${ime}` }));
    } catch {
      // oznaka ostane, kakršna je: naslednji zagon vseeno šteje nepričakovan zagon
    }
  }
  function cistaZaustavitev() {
    if (oznaka) fs.rmSync(oznaka, { force: true });
  }

  // --- disk ---
  function disk() {
    if (!dir) return null;
    try {
      const s = statfs(dir);
      const MB = 1024 * 1024;
      const skupaj = Number(s.blocks) * Number(s.bsize);
      const prosto = Number(s.bavail) * Number(s.bsize);
      if (!(skupaj > 0)) return null;
      let baza = 0;
      for (const f of [dbFile, `${dbFile}-wal`]) {
        try {
          baza += fs.statSync(f).size;
        } catch {
          // ni datoteke (npr. brez WAL)
        }
      }
      return { skupajMb: Math.round(skupaj / MB), prostoMb: Math.round(prosto / MB), delez: Math.round((1 - prosto / skupaj) * 100), bazaMb: Math.round(baza / MB), opozorilo: pragDiska(env) };
    } catch {
      return null;
    }
  }
  function preveriDisk() {
    const d = disk();
    if (!d || d.delez < d.opozorilo) return null;
    log.error?.(`[evklid] OPOZORILO: disk z bazo je zaseden ${d.delez} % (prosto ${d.prostoMb} MB)`);
    return vOzadju(opozori("disk", pismoDisk(d), RAZMIK.disk));
  }
  if (scheduler && dir && env.NODE_ENV !== "test") {
    setTimeout(preveriDisk, 2 * MIN).unref?.();
    setInterval(preveriDisk, 10 * MIN).unref?.();
  }

  return { aiIzid, ai: aiStanje, zagon, sesutje, cistaZaustavitev, zagoni, disk, preveriDisk };
}
