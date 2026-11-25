// Obvestilo skrbniku ob oznaki stiske (j 18. 11. 2026): ko inštruktor označi stisko (events.flag »distress«), dobi
// skrbnik e-mail, da oznako pregleda v 24 urah. V e-mailu NI vsebine pogovora, imena učenca, besedila sporočila ali
// id-jev: samo, da je nova oznaka, njena vrsta (okno, ki ga je učenec videl) in stopnja, čas in povezava na stran
// skrbnika /api/admin/stiske (za prijavo skrbnika). Varnostni odgovor učencu ostane nespremenjen; obvestilo ga nikoli
// ne zadrži (pošiljanje teče v ozadju, napake gredo samo v dnevnik).
//
// Največ en e-mail na 10 minut (OKNO_MS): oznake v tem času se zberejo in pošljejo skupaj s številom. Čakajoče
// oznake so v kv šifrirane (crypto-polje.js), da preživijo ponovni zagon. Neuspešno pošiljanje se ponovi ob naslednjem
// oknu, po POSKUSOV neuspehih se opusti (oznake ostanejo na strani skrbnika).
//
// Prejemniki: EVKLID_ADMIN_EMAILS in neobvezno namestnik EVKLID_STISKA_EMAIL_NAMESTNIK. Stikalo EVKLID_STISKA_EMAIL
// (0/off/ne = izklop; privzeto vklopljeno, ko je nastavljen vsaj en prejemnik). Naslovi se nikoli ne izpišejo.
//
// Oznaka ob vsakem varnostnem oknu (IN-14, j 25. 11. 2026): ne le ob oznaki inštruktorja, tudi ko okno odpre lokalni
// zaznavalnik, varnostni pregled ali pozno okno (server/app.js).
//
// Obvestilo staršem (j 25. 11. 2026): e-mail gre tudi staršu, ki je odprl račun, a samo, če je otrok mlajši od 15 let
// (starost znana), je e-naslov starša potrjen in je okno vrste zdravje, nevarnost ali stiska. Pri nasilju in zlorabi
// ne (nasilnež je lahko nekdo doma), pri blažjem oknu »pogovor« ne. Največ en e-mail staršu na profil v STARS_OKNO_MS.
// V e-mailu je ime profila (ga je vpisal starš), čas in vrsta, nikoli vsebina pogovora. Učenec to ve vnaprej
// (zasebnost in nastavitve), ne iz okna ob stiski. Stikalo EVKLID_STISKA_STARSI=0 obvestila staršem izklopi.
import { BRAND } from "./brand.js";
import { Mailer, layout, esc, button } from "./accounts/email.js";
import { emailList } from "./accounts/pilot-meja.js";
import { seal, unseal, openFlag, openPregled, sealPregled } from "./crypto-polje.js";
import { audit } from "./dnevnik-dostopov.js";
import { messageCode } from "./reports.js";
import { IKONE_HEAD } from "./ikone.js";
import { stevilke } from "../public/nujno.js";

const KV_KEY = "stiska_obvestilo";
const MIN = 60 * 1000;
export const OKNO_MS = 10 * MIN;
export const POSKUSOV = 6;
export const ROK_UR = 24;
const NAJVEC_V_EMAILU = 20;
export const POT = "/api/admin/stiske";

// Vrsta varnostnega okna (server/nujno.js) → opis in stopnja. Brez vrste (stare oznake): neznana.
export const VRSTE = {
  zdravje: { opis: "nujni primer (zdravje)", stopnja: "nujno (112)", red: 3 },
  nevarnost: { opis: "nevarnost (požar, plin …)", stopnja: "nujno (112)", red: 3 },
  stiska: { opis: "stiska", stopnja: "visoka", red: 2 },
  nasilje: { opis: "nasilje, zloraba ali izsiljevanje", stopnja: "visoka", red: 2 },
  pogovor: { opis: "stiska (blažje okno »pogovor«)", stopnja: "srednja", red: 1 },
};
const NEZNANA = { opis: "stiska (vrsta ni zapisana)", stopnja: "neznana", red: 0 };

// Staršem samo te vrste (j 25. 11.): brez »nasilje« in »pogovor«.
export const STARSEM = { zdravje: "nujen zdravstveni primer", nevarnost: "nevarnost (npr. požar ali plin)", stiska: "hudo stisko" };
export const STARS_OKNO_MS = 12 * 60 * 60 * 1000;
export const STARS_DO_LET = 15;
const KV_STARSI = "stiska_starsi";
export const vrstaOpis = (v) => VRSTE[v] || NEZNANA;

const IZKLOP = /^(0|off|false|ne|no)$/i;
export function prejemniki(env = process.env) {
  if (IZKLOP.test(String(env.EVKLID_STISKA_EMAIL ?? "").trim())) return [];
  const all = [...emailList(env.EVKLID_ADMIN_EMAILS), ...emailList(env.EVKLID_STISKA_EMAIL_NAMESTNIK)];
  return [...new Set(all.map((a) => a.toLowerCase()))];
}
export const vklopljeno = (env = process.env) => prejemniki(env).length > 0;

const baseUrl = (env) => String(env.EVKLID_BASE_URL || `https://${BRAND.domain}`).replace(/\/$/, "");
// Čas v Ljubljani (skrbnik), npr. »18. 11. 2026 14.05«.
export function cas(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "?";
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("sl-SI", { timeZone: "Europe/Ljubljana", day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  );
  return `${p.day}. ${p.month}. ${p.year} ${p.hour}.${p.minute}`;
}
// SQLite datetime('now') (UTC brez pasu) → ISO.
const isoIzBaze = (s) => (s && !/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? `${String(s).replace(" ", "T")}Z` : s);

// Slovenska dvojina in množina: 1 nova oznaka, 2 novi oznaki, 3–4 nove oznake, 5+ novih oznak (101 kot 1 …).
export function oznak(n) {
  const r = n % 100;
  if (r === 1) return "nova oznaka";
  if (r === 2) return "novi oznaki";
  if (r === 3 || r === 4) return "nove oznake";
  return "novih oznak";
}

/** E-mail za seznam oznak [{ ob, vrsta }]. Samo vrsta, stopnja in čas; nič o učencu ali pogovoru. */
export function stiskaEmail(oznake, env = process.env) {
  const n = oznake.length;
  const naj = oznake.reduce((a, o) => (vrstaOpis(o.vrsta).red > vrstaOpis(a.vrsta).red ? o : a), oznake[0]);
  const stopnja = vrstaOpis(naj?.vrsta).stopnja;
  const url = `${baseUrl(env)}${POT}`;
  const koliko = `${n === 1 ? "" : `${n} `}${oznak(n)} stiske`;
  const subject = `${BRAND.name}: ${koliko}, ${n === 1 ? "stopnja" : "najvišja stopnja"}: ${stopnja} – preglej v ${ROK_UR} urah`;
  const vrstice = oznake.slice(0, NAJVEC_V_EMAILU).map((o) => `${cas(o.ob)} – ${vrstaOpis(o.vrsta).opis}, stopnja ${vrstaOpis(o.vrsta).stopnja}`);
  if (n > NAJVEC_V_EMAILU) vrstice.push(`… in še ${n - NAJVEC_V_EMAILU}`);
  const uvod = n === 1 ? "Inštruktor je pri enem od učencev označil stisko." : `Od zadnjega e-maila: ${koliko} (e-mail gre največ enkrat na ${OKNO_MS / MIN} minut).`;
  const opomba = "Ob oznaki aplikacija učencu pokaže varnostno okno s številkami za pomoč, če je povezava še odprta. V tem e-mailu namenoma ni imena, vsebine pogovora ali sporočila. Prijavi se kot skrbnik, odpri stran in oznako označi kot pregledano.";
  const text = `${uvod}\n\n${vrstice.map((v) => `- ${v}`).join("\n")}\n\nPreglej v ${ROK_UR} urah: ${url}\n\n${opomba}`;
  const html = layout(
    n === 1 ? "Nova oznaka stiske" : `${n} ${oznak(n)} stiske`,
    `<p>${esc(uvod)}</p><ul>${vrstice.map((v) => `<li>${esc(v)}</li>`).join("")}</ul><p>Preglej v ${ROK_UR} urah.</p>${button(url, "Odpri oznake stiske")}<p style="font-size:13px;color:#5f6779">${esc(opomba)}</p>`,
  );
  return { subject, text, html };
}

export const starsemVklopljeno = (env = process.env) => !IZKLOP.test(String(env.EVKLID_STISKA_STARSI ?? "").trim());

/**
 * Starš, ki dobi obvestilo za profil, ali null. accounts: { ageOfStudent, ownerOf, getParent } (server/accounts).
 * Samo otrok pod 15 let z znano starostjo; starš s potrjenim e-naslovom, ne gost in ne mladoleten imetnik.
 */
export function prejemnikStarsa(accounts, studentId) {
  if (!accounts || !studentId) return null;
  const age = accounts.ageOfStudent?.(studentId);
  if (typeof age !== "number" || !(age < STARS_DO_LET)) return null;
  const p = accounts.getParent?.(accounts.ownerOf?.(studentId));
  if (!p?.email || !p.email_verified_at || p.is_guest) return null;
  // Imetnik računa mora biti odrasel (ne najstnik z lastnim računom); brez datuma rojstva velja starš, ki je račun odprl.
  if (p.birth_date && Date.now() - Date.parse(p.birth_date) < 18 * 365.25 * 864e5) return null;
  return { email: p.email };
}

/** E-mail staršu: ime profila, čas in vrsta; nič o vsebini pogovora. */
export function starsEmail({ ime, vrsta, ob, settings } = {}, env = process.env) {
  const kaj = STARSEM[vrsta] || STARSEM.stiska;
  const st = stevilke(settings || {});
  const profil = ime ? `»${ime}«` : "vašega otroka";
  const nujno = `Če je otrok v nevarnosti ali se je poškodoval, takoj pokličite ${st.sos || "112"}.`;
  const linija = st.si ? " Za pogovor je otrokom in mladostnikom brezplačno na voljo TOM telefon 116 111." : "";
  const uvod = `${BRAND.name} je ${cas(ob)} v pogovoru profila ${profil} zaznal sporočilo, ki kaže na ${kaj}. Otroku je takoj pokazal številke za pomoč.`;
  const nasvet = `Poiščite miren trenutek in otroka vprašajte, kako je. Poslušajte ga brez obtoževanja in mu povejte, da ste ob njem. ${nujno}${linija} Pomagajo vam lahko tudi šolska svetovalna služba ali osebni zdravnik.`;
  const opomba = `Vsebine pogovora vam ne pošiljamo. To obvestilo dobite, ker ste odprli račun za otroka, mlajšega od ${STARS_DO_LET} let. Največ eno takšno obvestilo na profil v ${STARS_OKNO_MS / 3600000} urah.`;
  const subject = `${BRAND.name}: obvestilo o stiski pri profilu ${ime || "vašega otroka"}`;
  const text = `${uvod}\n\n${nasvet}\n\n${opomba}`;
  const html = layout("Obvestilo o stiski", `<p>${esc(uvod)}</p><p>${esc(nasvet)}</p><p style="font-size:13px;color:#5f6779">${esc(opomba)}</p>`);
  return { subject, text, html };
}

/**
 * @param {import("node:sqlite").DatabaseSync} db
 * Vrne { nova(eventId, vrsta, studentId), run(), stanje() }. nova() je sinhrona, ne vrže napake in ne čaka na pošto.
 * starsi: { prejemnik(studentId) → { email } | null, profil(studentId) → { ime, settings } } za obvestilo staršem.
 */
export function startStiskaObvestila(db, { scheduler = true, env = process.env, mailer = null, fetchFn, log = console, now = () => new Date(), starsi = null } = {}) {
  const kvGet = () => {
    try {
      const raw = db.prepare("SELECT value FROM kv WHERE key = ?").get(KV_KEY)?.value;
      const s = raw ? JSON.parse(unseal(raw, "null")) : null;
      return s && Array.isArray(s.cakajo) ? s : { zadnje: null, cakajo: [], poskusov: 0 };
    } catch {
      return { zadnje: null, cakajo: [], poskusov: 0 };
    }
  };
  // Šifrirano: tudi časi stisk ne smejo biti berljivi iz baze.
  const kvSet = (s) => db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(KV_KEY, seal(JSON.stringify(s)));
  let busy = false;
  let timer = null;

  const naslednjic = (cez) => {
    if (!scheduler || timer) return;
    timer = setTimeout(() => {
      timer = null;
      run().catch(() => {});
    }, Math.max(1000, cez));
    timer.unref?.();
  };

  // Pošlje zbrane oznake, če je od zadnjega poskusa minilo vsaj OKNO_MS. Vrne "poslano" | "napaka" | "čaka" | "ni nastavljeno" | null.
  async function run() {
    if (busy || db.isOpen === false) return null;
    busy = true;
    try {
      const s = kvGet();
      if (!s.cakajo.length) return null;
      const to = prejemniki(env);
      const m = mailer ?? new Mailer({ fetchFn });
      if (!to.length || !m.enabled) {
        // Brez prejemnika ali Resend: nič ne čaka (oznake so na strani skrbnika). Brez naslovov v dnevniku.
        log.error?.(`[evklid] oznaka stiske: e-pošta skrbniku ni poslana (${to.length ? "ni Resend" : "ni EVKLID_ADMIN_EMAILS ali EVKLID_STISKA_EMAIL=0"}); oznake čakajo na strani ${POT}`);
        kvSet({ ...s, cakajo: [], poskusov: 0 });
        return "ni nastavljeno";
      }
      const t = now().getTime();
      const zadnje = s.zadnje ? Date.parse(s.zadnje) : 0;
      if (t - zadnje < OKNO_MS) {
        naslednjic(zadnje + OKNO_MS - t);
        return "čaka";
      }
      const paket = s.cakajo.slice();
      const mail = stiskaEmail(paket, env);
      let sent = 0;
      for (const addr of to) {
        try {
          await m.send({ to: addr, ...mail });
          sent++;
        } catch (e) {
          log.error?.(`[evklid] oznaka stiske: e-pošta skrbniku ni uspela (${String(e?.message || e).replace(/[^\s<>"']+@[^\s<>"']+/g, "…").slice(0, 200)})`);
        }
      }
      // Med pošiljanjem so lahko prišle nove oznake: odstranimo samo poslane.
      const zdaj = kvGet();
      const ostale = zdaj.cakajo.slice(paket.length);
      if (sent) {
        kvSet({ zadnje: new Date(t).toISOString(), cakajo: ostale, poskusov: 0 });
        if (ostale.length) naslednjic(OKNO_MS);
        return "poslano";
      }
      const poskusov = (s.poskusov || 0) + 1;
      if (poskusov >= POSKUSOV) {
        log.error?.(`[evklid] oznaka stiske: e-pošta po ${POSKUSOV} poskusih ni uspela; ${paket.length} oznak čaka na strani ${POT}`);
        kvSet({ zadnje: new Date(t).toISOString(), cakajo: ostale, poskusov: 0 });
      } else {
        kvSet({ zadnje: new Date(t).toISOString(), cakajo: zdaj.cakajo, poskusov });
        naslednjic(OKNO_MS);
      }
      return "napaka";
    } catch (e) {
      log.error?.(`[evklid] oznaka stiske: obvestilo ni uspelo (${String(e?.message || e).replace(/[^\s<>"']+@[^\s<>"']+/g, "…").slice(0, 200)})`);
      return null;
    } finally {
      busy = false;
    }
  }

  // Staršu (glej glavo datoteke): takoj, ne v paketu; največ en e-mail na profil v STARS_OKNO_MS (šifrirano v kv).
  // Vrne "poslano" | "ne" | "nedavno" | "napaka".
  async function obvestiStarsa(studentId, vrsta) {
    try {
      if (!starsi || !STARSEM[vrsta] || !starsemVklopljeno(env)) return "ne";
      const to = starsi.prejemnik?.(studentId);
      if (!to?.email) return "ne";
      const m = mailer ?? new Mailer({ fetchFn });
      if (!m.enabled) return "ne";
      let zad = {};
      try {
        const raw = db.prepare("SELECT value FROM kv WHERE key = ?").get(KV_STARSI)?.value;
        zad = (raw && JSON.parse(unseal(raw, "null"))) || {};
      } catch {
        zad = {};
      }
      const t = now().getTime();
      const prej = zad[studentId] ? Date.parse(zad[studentId]) : 0;
      if (t - prej < STARS_OKNO_MS) return "nedavno";
      // Najprej zapis (dve okni hkrati ne pošljeta dveh e-mailov), stari zapisi se počistijo.
      for (const [k, v] of Object.entries(zad)) if (t - Date.parse(v) >= STARS_OKNO_MS) delete zad[k];
      zad[studentId] = new Date(t).toISOString();
      db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(KV_STARSI, seal(JSON.stringify(zad)));
      const p = starsi.profil?.(studentId) || {};
      await m.send({ to: to.email, ...starsEmail({ ime: p.ime, vrsta, ob: new Date(t).toISOString(), settings: p.settings }, env) });
      return "poslano";
    } catch (e) {
      log.error?.(`[evklid] oznaka stiske: e-pošta staršu ni uspela (${String(e?.message || e).replace(/[^\s<>"']+@[^\s<>"']+/g, "…").slice(0, 200)})`);
      return "napaka";
    }
  }

  // Nova oznaka stiske: zapiše vrsto okna v pregled dogodka in sproži obvestilo. Nikoli ne vrže napake in ne čaka.
  function nova(eventId, vrsta = null, studentId = null) {
    try {
      const v = VRSTE[vrsta] ? vrsta : null;
      if (eventId && v) db.prepare("UPDATE events SET pregled = ? WHERE id = ?").run(sealPregled({ v }), eventId);
      if (studentId && v) obvestiStarsa(studentId, v).catch(() => {});
      if (!vklopljeno(env)) return;
      const s = kvGet();
      kvSet({ ...s, cakajo: [...s.cakajo, { ob: now().toISOString(), vrsta: v }] });
      run().catch(() => {});
    } catch (e) {
      log.error?.(`[evklid] oznaka stiske: zapis obvestila ni uspel (${String(e?.message || e).slice(0, 200)})`);
    }
  }

  if (scheduler && env.NODE_ENV !== "test") {
    // Po ponovnem zagonu pošlje, kar je ostalo; nato vsakih 10 minut.
    setTimeout(() => run().catch(() => {}), 2 * MIN).unref?.();
    setInterval(() => run().catch(() => {}), OKNO_MS).unref?.();
  }
  const stanje = () => ({ vklopljeno: vklopljeno(env), cakajo: kvGet().cakajo.length });
  return { nova, run, stanje, obvestiStarsa };
}

// Oznake stiske za stran skrbnika (zadnjih 90 dni, kolikor je rok hrambe oznak): odšifrirane, brez imen in vsebine.
export function seznamStisk(db, nowMs = Date.now()) {
  const out = [];
  for (const r of db.prepare("SELECT id, student_id, message_id, flag, created_at, pregled FROM events WHERE flag <> 'none' ORDER BY id DESC").iterate()) {
    if (openFlag(r.flag) !== "distress") continue;
    const p = openPregled(r.pregled, {});
    const ob = isoIzBaze(r.created_at);
    const pregledano = p.pregledano_ob || null;
    const ur = (pregledano ? Date.parse(pregledano) : nowMs) - Date.parse(ob);
    out.push({
      id: r.id,
      profil: r.student_id,
      koda: r.message_id ? messageCode(r.message_id) : null,
      ob,
      vrsta: p.v || null,
      stopnja: vrstaOpis(p.v).stopnja,
      pregledano_ob: pregledano,
      ur_do_pregleda: pregledano ? Math.round((ur / 36e5) * 10) / 10 : null,
      v_roku: pregledano ? ur <= ROK_UR * 36e5 : null,
      zamuda: !pregledano && ur > ROK_UR * 36e5,
    });
  }
  return out;
}

export function povzetek(seznam) {
  const preg = seznam.filter((s) => s.pregledano_ob);
  return {
    vseh: seznam.length,
    pregledanih: preg.length,
    v_roku: preg.filter((s) => s.v_roku).length,
    odprtih: seznam.length - preg.length,
    zamujenih: seznam.filter((s) => s.zamuda).length,
  };
}

function stran(seznam) {
  const p = povzetek(seznam);
  const vrstica = (s) => {
    const stanje = s.pregledano_ob
      ? `pregledano ${esc(cas(s.pregledano_ob))} (po ${String(s.ur_do_pregleda).replace(".", ",")} h${s.v_roku ? "" : ", po roku"})`
      : `<b>${s.zamuda ? "nepregledano, rok 24 ur je potekel" : "nepregledano"}</b> <form method="post" action="${POT}/${s.id}/pregledano"><button type="submit">Označi kot pregledano</button></form>`;
    return `<tr><td data-l="Čas">${esc(cas(s.ob))}</td><td data-l="Vrsta">${esc(vrstaOpis(s.vrsta).opis)}</td><td data-l="Stopnja">${esc(s.stopnja)}</td><td data-l="Profil">${esc(s.profil)}</td><td data-l="Koda sporočila">${esc(s.koda || "–")}</td><td>${stanje}</td></tr>`;
  };
  return `<!doctype html><html lang="sl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">${IKONE_HEAD}<title>Oznake stiske – ${esc(BRAND.name)}</title>
<style>:root{color-scheme:light dark}body{font-family:system-ui,sans-serif;margin:16px;color:#1d2433;background:#fff}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #dde;padding:8px;text-align:left;vertical-align:top}form{display:inline}button{min-height:40px;padding:6px 12px}code{overflow-wrap:anywhere}@media (prefers-color-scheme:dark){body{color:#e6e9f0;background:#12151c}td,th{border-color:#333a48}}@media (max-width:640px){thead{display:none}tr{display:block;border-bottom:1px solid #dde;padding:8px 0}td{display:block;border:0;padding:2px 0}td[data-l]::before{content:attr(data-l) ": ";font-weight:600}}</style></head><body>
<h1>Oznake stiske</h1>
<p>Zadnjih 90 dni (rok hrambe oznak). Vsako oznako preglej v ${ROK_UR} urah. Pregledanih ${p.pregledanih} od ${p.vseh}, od tega v ${ROK_UR} urah ${p.v_roku}; odprtih ${p.odprtih}, od tega po roku ${p.zamujenih}.</p>
<p>Brez imen in vsebine. Profil je številka profila; koda sporočila je za <code>node scripts/najdi-sporocilo.js</code> na strežniku.</p>
${seznam.length ? `<table><thead><tr><th>Čas</th><th>Vrsta</th><th>Stopnja</th><th>Profil</th><th>Koda sporočila</th><th>Pregled</th></tr></thead><tbody>${seznam.map(vrstica).join("")}</tbody></table>` : "<p>Ni oznak stiske.</p>"}
</body></html>`;
}

// Stran skrbnika: seznam oznak stiske in »Označi kot pregledano« (zapiše pregledano_ob). Samo za skrbnika.
export function mountStiske(app, store, { isAdmin }) {
  const db = store.db;
  const ni = (req, res) => {
    res.set("Cache-Control", "no-store");
    if (isAdmin(req)) return false;
    res.status(403).type("text/plain; charset=utf-8").send("Samo za skrbnika. Prijavi se z računom skrbnika in odpri povezavo znova.");
    return true;
  };
  app.get(POT, (req, res) => {
    if (ni(req, res)) return;
    const seznam = seznamStisk(db);
    if (req.query.json) return res.json({ povzetek: povzetek(seznam), oznake: seznam });
    res.type("html").send(stran(seznam));
  });
  app.post(`${POT}/:id/pregledano`, (req, res) => {
    if (ni(req, res)) return;
    // Obrazec z druge strani ne sme označiti oznake (piškotek je SameSite=Lax, to je še dodatna zaščita).
    if (req.get("sec-fetch-site") === "cross-site") return res.status(403).type("text/plain; charset=utf-8").send("Zavrnjeno.");
    const id = /^\d+$/.test(req.params.id) ? Number(req.params.id) : NaN;
    const r = Number.isFinite(id) ? db.prepare("SELECT id, flag, pregled FROM events WHERE id = ?").get(id) : null;
    if (!r || openFlag(r.flag) !== "distress") return res.status(404).type("text/plain; charset=utf-8").send("Oznaka stiske ne obstaja.");
    const p = openPregled(r.pregled, {});
    if (!p.pregledano_ob) {
      db.prepare("UPDATE events SET pregled = ? WHERE id = ?").run(sealPregled({ ...p, pregledano_ob: new Date().toISOString(), pregledal: req.parent?.id ?? null }), id);
      audit(db, { req, actor: "admin", parentId: req.parent?.id ?? null, action: "stiska_pregledano", target: `event:${id}` });
    }
    if (req.query.json) return res.json({ ok: true, pregledano_ob: openPregled(db.prepare("SELECT pregled FROM events WHERE id = ?").get(id).pregled, {}).pregledano_ob });
    res.redirect(303, POT);
  });
}
