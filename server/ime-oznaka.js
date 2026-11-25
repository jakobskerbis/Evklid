// Ime učenca ne gre k ponudniku AI (j, 18. 11. 2026, po osnutku ocene učinka DPIA).
// Model v sistemskem promptu dobi oznako IME_OZNAKA namesto imena (server/prompt.js) in jo napiše v nagovor;
// strežnik jo zamenja s pravim imenom šele v besedilu za učenca (tok, končno besedilo, gumbi z izbirami).
// Zgodovina za API (messages.api_content) in skupni predpomnilnik odgovorov (answer_cache) hranita oznako.
// Kar učenec sam napiše (npr. »Ime mi je Ana«), ostane, kot je: to je njegovo sporočilo (docs/varnost-podatkov.md).

export const IME_OZNAKA = "{{IME}}";

// ---------- Neprimerna imena profila (#754, j 15. 11. 2026) ----------
// Ob ustvarjanju in preimenovanju profila strežnik zavrne kletvice, spolne izraze in žaljivke (sl, en, de, hr, it, hu).
// Normalizacija: male črke, brez šumnikov, »številke namesto črk« med črkami (l1lek, f4ck), podvojene črke (fuuuck),
// razmaknjene posamezne črke (l u l e k, f.u.c.k). Ime se preverja po besedah: cela beseda v BESEDE ali začetek
// besede v ZACETKI (oboje po isti normalizaciji). Prava imena ostanejo (Ana-Maria, Rita, Mona, Kurt, Nigel, As, Fuks, Tit, Bob, Ćazim);
// pred popolnostjo ima prednost, da otroka s pravim imenom nikoli ne zavrnemo. Začetek z dvojno črko se po
// normalizaciji skrajša (titt → tit, boob → bob), zato takih začetkov v ZACETKI ni. Inštruktor neprimernega imena ne uporabi (withName).
const LEET = { 0: "o", 1: "i", 3: "e", 4: "a", 5: "s", 7: "t", 8: "b", "@": "a", $: "s", "!": "i" };
const norma = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/(?<=\p{L})[013457@$!8](?=[013457@$!8]*\p{L})/gu, (c) => LEET[c] || c)
    .replace(/(\p{L})\1+/gu, "$1");
const BESEDE = new Set(
  [
    // sl, hr
    "rit", "fuk", "fukat", "fukam", "fukas", "drek", "srat", "scat", "scanje", "joske", "peder", "pedri", "buzi", "debil", "kreten", "butec", "bedak", "cipa", "sisa", "sise", "cigan", "cefur", "govno", "supak", "glupan", "kurva", "seks", "seksi", "kurec", "prdec", "prdac", "kakec", "pimpek", "guzica",
    "kurba", "kurbe", "kurbi", "kurbo", "kurbin", "kurbica", "picka", "picke", "picki", "picko", "picku", "pickin", "drkat", "drkam", "drkas", "drkal", "drkanje",
    // en
    "dick", "cock", "sex", "tits", "fag", "fagit", "niga", "nigas", "slut", "whore", "twat", "nazi", "hitler", "bastard", "bollocks", "porn", "shit", "shits", "shity", "shiter", "sexy", "dildo",
    // de
    "arsch", "fick", "ficken", "fotze", "hure", "titten", "schwanz", "kacke",
    // it
    "merda", "culo", "figa", "troia", "cazzo", "cazzi", "frocio", "bastardo",
    // hu
    "fasz", "geci", "szar", "neger", "kocsog", "faszfej", "seggfej",
  ].map(norma),
);
const ZACETKI = [
  "kurc", "kurac", "kurce", "pizd", "pickic", "jebem", "jebat", "jeban", "jebot", "jebac", "jebi", "jebo", "kurv", "sranj", "lulek", "lulc", "buzer", "pedof", "retard", "govn", "pofuk", "zjeb",
  "fuck", "shith", "bitch", "cunt", "pussy", "asshole", "wank", "niger", "penis", "vagin", "porno",
  "arschl", "scheis", "ficke", "schlamp", "wichs", "hurens", "missgeb", "schwucht",
  "stronz", "puttan", "vaffan", "cogli", "minch",
  "picsa", "bazm", "bazd", "baszd",
].map(norma);
// Besede imena; zaporedje posameznih črk (»l u l e k«, »f.u.c.k«) postane ena beseda.
function besedeImena(name) {
  const deli = norma(name).split(/[^\p{L}]+/u).filter(Boolean);
  const out = [];
  let crke = "";
  for (const d of deli) {
    if (d.length === 1) crke += d;
    else {
      if (crke) out.push(crke);
      crke = "";
      out.push(d);
    }
  }
  if (crke) out.push(crke);
  return out.map((b) => b.replace(/(\p{L})\1+/gu, "$1"));
}
/** Ali je ime profila neprimerno (kletvica, spolni izraz, žaljivka). */
export function neprimernoIme(name = "") {
  return besedeImena(name).some((b) => BESEDE.has(b) || ZACETKI.some((z) => b.startsWith(z)));
}
export const NEPRIMERNO_IME = "Tega imena ne moremo uporabiti. Izberi drugo ime ali vzdevek.";


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
  // Star profil z neprimernim imenom (pred #754): nagovor brez imena.
  const n = neprimernoIme(name) ? "" : String(name || "").trim();
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
  if (neprimernoIme(name)) name = "";
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
