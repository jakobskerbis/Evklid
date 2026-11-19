// Ime učenca ne gre k ponudniku AI (j, 18. 11. 2026, po osnutku ocene učinka DPIA).
// Model v sistemskem promptu dobi oznako IME_OZNAKA namesto imena (server/prompt.js) in jo napiše v nagovor;
// strežnik jo zamenja s pravim imenom šele v besedilu za učenca (tok, končno besedilo, gumbi z izbirami).
// Zgodovina za API (messages.api_content) in skupni predpomnilnik odgovorov (answer_cache) hranita oznako.
// Kar učenec sam napiše (npr. »Ime mi je Ana«), ostane, kot je: to je njegovo sporočilo (docs/varnost-podatkov.md).

export const IME_OZNAKA = "{{IME}}";

// Oznaka, tudi v skoraj pravi obliki (»{{ IME }}«, »{{Ime}}«), z morebitno končnico, ki jo je model prilepil
// nanjo (»{{IME}}u«, »{{IME}}-ju«). Model naj je ne sklanja (server/prompt.js); če jo, glej withName.
const OZNAKA = "\\{\\{\\s*IME\\s*\\}\\}";
// Končnica so samo latinične črke: v kitajščini, japonščini, tajščini ipd. besedilo za oznako ni končnica (pregled #845).
const OZNAKA_RE = new RegExp(`${OZNAKA}(?:[-:’']?[\\p{Script=Latin}\\p{M}]+)?`, "giu");
const OZNAKA_IN = new RegExp(OZNAKA, "iu");
// Prazno ime: oznaka gre ven skupaj s sosednjo vejico in presledkom (»Bravo, {{IME}}!« → »Bravo!«).
const PRAZNO_RE = new RegExp(`[^\\S\\n]*,[^\\S\\n]*${OZNAKA_RE.source}|${OZNAKA_RE.source}[^\\S\\n]*,[^\\S\\n]*|[^\\S\\n]*${OZNAKA_RE.source}(?![^\\S\\n]*,)`, "giu");
const plain = (s) => String(s).normalize("NFD").replace(/\p{M}+/gu, "").toLowerCase();

/**
 * Besedilo za učenca: oznaka → pravo ime. Končnico, prilepljeno na oznako, obdrži samo pri imenu na soglasnik
 * (»{{IME}}u« → »Jakobu«); pri imenu na samoglasnik jo izpusti (»Ana«, ne »Anau«). Ločilo pred njo (»-«, »:«,
 * opuščaj) odpade. Prazno ime: oznaka in sosednja vejica izgineta.
 */
export function withName(text, name = "") {
  const s = String(text ?? "");
  if (!OZNAKA_IN.test(s)) return s;
  const n = String(name || "").trim();
  if (!n) return s.replace(PRAZNO_RE, "");
  const soglasnik = /[a-z]$/.test(plain(n)) && !/[aeiouy]$/.test(plain(n));
  return s.replace(OZNAKA_RE, (m) => {
    const konc = m.replace(OZNAKA_IN, "").replace(/^[-:’']/, "");
    return konc && soglasnik ? n + konc : n;
  });
}

// Konec besedila, ki je lahko (del) oznake: cela oznaka s končnico, ki se morda nadaljuje, ali začetek oznake.
const KONEC_CELA = new RegExp(`${OZNAKA}(?:[-:’']?[\\p{Script=Latin}\\p{M}]*)$`, "iu");
const KONEC_ZACETEK = /\{\{?\s*I?M?E?\s*\}?$/iu;

/**
 * Zamenjava med pretakanjem: oznaka je lahko razdeljena med dva kosa (»… {{I« + »ME}}!«). Konec, ki bi
 * lahko bil začetek oznake (ali oznaka s črkami, ki se morda še nadaljujejo), zadrži do naslednjega kosa.
 * push(kos) → besedilo, ki je varno za pošiljanje; end() → preostanek; reset() → zavrže zadržano (umik besedila).
 */
export function createNameStream(name = "") {
  const prazno = !String(name || "").trim();
  let buf = "";
  const hold = (s) => {
    const m = KONEC_CELA.exec(s) || KONEC_ZACETEK.exec(s);
    let at = m ? m.index : s.length;
    // Brez imena gre ven tudi vejica pred oznako: zadrži jo, dokler ne vemo, ali ji sledi oznaka.
    if (prazno) {
      const v = /[^\S\n]*,?[^\S\n]*$/.exec(s.slice(0, at));
      if (v && v.index + v[0].length === at) at = v.index;
    }
    return at;
  };
  return {
    push(chunk) {
      buf += String(chunk ?? "");
      const cut = hold(buf);
      const out = buf.slice(0, cut);
      buf = buf.slice(cut);
      return withName(out, name);
    },
    end() {
      const out = withName(buf, name);
      buf = "";
      return out;
    },
    reset() {
      buf = "";
    },
  };
}

/**
 * Gumb z izbiro (<<IZBIRE [...]>>): učenec vidi besedilo z imenom, model pa dobi nazaj izbiro z oznako. Če je
 * poslano besedilo prikazana izbira (sama ali pred », dopisano«), vrne izbiro z oznako; sicer besedilo, kot je.
 */
export function choiceAsToken(typed, choices = [], name = "") {
  const t = String(typed ?? "");
  for (const c of choices || []) {
    if (!OZNAKA_IN.test(c)) continue;
    const shown = withName(c, name);
    if (t === shown) return c;
    if (t.startsWith(`${shown}, `)) return c + t.slice(shown.length);
  }
  return t;
}

// ---------------------------------------------------------------------------
// Slovnični spol (j, 18. 11. 2026): model dobi samo spol, ne imena. Izbira v nastavitvah (settings.gender
// »m« / »z«) ima prednost; sicer ga ugane koda iz imena, ob dvomu »« (neznan: model se izogiba spolnim oblikam).

// Moška imena na -a in ženska imena, ki se ne končajo na -a (brez strešic, male črke).
const MOSKA_NA_A = new Set("luka jaka miha ziga matija mitja andrija tobija elija jeremija zaharija ilija jona kosta toma sava jasa joza nikita kuzma aleksa jurica jovica perica ivica mihajla grega aljosa vasja nemanja sinisa mirza borna ilja jaksa niksa".split(" "));
const ZENSKA_DRUGA = new Set("ines doris karmen carmen nives ingrid agnes edit judit judith ester esther karin rut ruth mirjam miriam rahel rachel iris dolores mercedes gertrud kristin ellen helen karen megan lauren sarah hannah elizabeth elisabeth isabel mabel abigail carol ann tamar lilit ivon cleo margo juno".split(" "));
const DVOUMNA = new Set("sasa andrea vanja nikola noa kim jasmin robin alex eli mika mattia misa luca".split(" "));
// Pogosta moška imena na -e (sicer neznan spol).
const MOSKA_NA_E = new Set("jure anze joze lojze tine tone azbe bine pavle nace zane".split(" "));

/** »m«, »z« ali »« (ne vemo) iz imena: prva beseda; -a → ženski, soglasnik ali -o → moški, z izjemami. */
export function genderFromName(name = "") {
  const first = String(name || "").trim().split(/[\s-]+/)[0] || "";
  const w = plain(first);
  if (w.length < 2 || !/^[a-z]+$/.test(w)) return ""; // druga pisava, številke, vzdevek
  if (DVOUMNA.has(w)) return "";
  if (ZENSKA_DRUGA.has(w)) return "z";
  if (MOSKA_NA_E.has(w)) return "m";
  if (w.endsWith("a")) return MOSKA_NA_A.has(w) ? "m" : "z";
  if (/[^aeiouy]$/.test(w) || w.endsWith("o")) return "m";
  return "";
}

/** Spol za prompt: izbira v nastavitvah, sicer iz imena. */
export function pupilGender(settings = {}, name = "") {
  return settings?.gender === "m" || settings?.gender === "z" ? settings.gender : genderFromName(name);
}

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Maska imena: pravo ime → oznaka v besedilu, ki ga je napisal model, ko je ime še poznal (odgovori in povzetki
 * izpred spremembe, glej nameCutoff v server/app.js). Cele besede, ne glede na velike črke in obliko zapisa
 * (NFC), kot genericAnswer (server/reports.js). Sklonjene oblike (»Jakobu«) ostanejo. null: ni imena.
 * Regularni izraz se sestavi enkrat.
 */
export function nameMasker(name = "") {
  const n = String(name || "").normalize("NFC").trim();
  if (n.length < 2) return null;
  const parts = [...new Set([n, ...n.split(/\s+/).filter((w) => w.length >= 2)])].sort((a, b) => b.length - a.length);
  const re = new RegExp(`(?<![\\p{L}\\p{N}_])(?:${parts.map(escRe).join("|")})(?![\\p{L}\\p{N}_])`, "giu");
  return (text) => String(text ?? "").normalize("NFC").replace(re, IME_OZNAKA);
}

export function maskName(text, name = "") {
  const m = nameMasker(name);
  return m ? m(text) : String(text ?? "");
}

/**
 * Zgodovina za API: v odgovorih inštruktorja ime → oznaka, samo v sporočilih z id ≤ cutoff (nastala, ko je model
 * ime še poznal). Novejših ne maskiramo: »Vid je čutilo« ali »Ana ima 20 €« v nalogi ni nagovor učenca Vida ali Ane.
 * Sporočila učenca ostanejo nespremenjena. messages: [{ id, role, content }] → [{ role, content }].
 */
export function maskHistory(messages, name = "", cutoff = Infinity) {
  const mask = nameMasker(name);
  return messages.map((m) => {
    const out = { role: m.role, content: m.content };
    if (!mask || m.role !== "assistant" || !(Number(m.id ?? 0) <= cutoff)) return out;
    if (typeof m.content === "string") out.content = mask(m.content);
    else if (Array.isArray(m.content)) out.content = m.content.map((b) => (b?.type === "text" && typeof b.text === "string" ? { ...b, text: mask(b.text) } : b));
    return out;
  });
}
