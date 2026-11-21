// Branje in odstranjevanje strojnih blokov iz odgovorov modela:
// vrstice <<META ...>> (analitika), blokov <<KARTICA V: … O: … >> (kartice za ponavljanje) in
// <<IZBIRE ["…", "…"]>> (gumbi s kratkimi odgovori pod sporočilom; učenec tapne, odgovor se pošlje) in
// <<RACUN …>> (računske trditve za preverjanje s kodo, server/racun.js).

const META_RE = /<<\s*META\b([\s\S]*?)>>/g;
const CARD_RE = /<<\s*KARTICA\b([\s\S]*?)>>/g;
// Tudi »RAČUN« in blok v oznakah kode (```), kot v primeru v navodilih.
const RACUN_RE = /(?:^[ \t]*```[a-z]*[ \t]*\n)?[ \t]*<<\s*RA[CČ]UN\b[\s\S]*?>>(?:[ \t]*\n[ \t]*```[ \t]*$)?/gm;
// Gumbi: najprej natančen zapis s seznamom JSON (tudi »>>« ali »]« znotraj niza), sicer do prvega »>>«.
// Oznaka je lahko prevedena (CHOICES) ali z enim oklepajem; učenec bloka nikoli ne vidi.
const CHOICES_JSON_RE = /<{1,2}\s*(?:IZBIRE|CHOICES)\b\s*(\[(?:"(?:[^"\\\n]|\\.)*"|[^\]"\n])*\])\s*>{1,2}/g;
const CHOICES_RE = /<<\s*(?:IZBIRE|CHOICES)\b([\s\S]*?)>>/g;
const CHOICES_LOOSE_RE = /^[ \t]*[`*_]*<{1,2}[ \t]*(?:IZBIRE|CHOICES)\b[^\n]*$/gm;
// META brez oklepajev ali z enim samim (»META subject=MAT …«, »<META …>«, v oznakah kode): model se včasih
// zmoti v zapisu; učenec vrstice ne sme videti (digitalni razred, 2026-11-01: vidna pri treh učencih).
const META_LOOSE_RE = /^[ \t]*[`*_]*<{0,2}[ \t]*META\b[^\n]*\bsubject=[^\n]*$/gm;
// Bloki gumbov za orodja aplikacije (<<ODPRI …>>, <<GRAF […]>>, <<SKICA {…}>>, server/odpri.js).
const OPEN_RE = /`?<<\s*(?:ODPRI|GRAF|SKICA)\b[\s\S]*?>>`?/g;
const MARKERS = ["<<RACUN", "<< RACUN", "<<RAČUN", "<< RAČUN", "<<ODPRI", "<<GRAF", "<<SKICA", "<< ODPRI", "<< GRAF", "<< SKICA", "<<META", "<<KARTICA", "<<IZBIRE", "<< META", "<< KARTICA", "<< IZBIRE", "<META", "META subject=", "<IZBIRE", "< IZBIRE", "<CHOICES", "< CHOICES"];
const MARKER_MAX = Math.max(...MARKERS.map((m) => m.length));

import { ALL_SUBJECTS } from "./subjects.js";
import { polishHold, polishReply } from "./instruktor-kandidat.js";

const VALID = {
  subject: ALL_SUBJECTS,
  mode: ["A", "B"],
  flag: ["none", "offtopic", "distress", "unsafe", "injection", "photo"], // photo: fotografija ni učno gradivo
};

function parseAttrs(body) {
  const attrs = {};
  // key="vrednost s presledki" | key=vrednost
  const re = /(\w+)=(?:"([^"]*)"|«([^»]*)»|»([^«]*)«|(\S+))/g;
  let m;
  while ((m = re.exec(body))) {
    attrs[m[1]] = (m[2] ?? m[3] ?? m[4] ?? m[5] ?? "").trim();
  }
  return attrs;
}

// Vrne zadnji META blok v besedilu kot objekt ali null.
export function parseMeta(text) {
  let last = null;
  for (const m of text.matchAll(META_RE)) last = m[1];
  if (last === null) for (const m of String(text).matchAll(META_LOOSE_RE)) last = m[0].replace(/^[\s`*_<]*META\b/, "").replace(/[>`*_\s]+$/, "");
  if (last === null) return null;
  const a = parseAttrs(last);
  const pick = (key, fallback) => (VALID[key].includes(a[key]) ? a[key] : fallback);
  const topic = (a.topic || "-").slice(0, 80);
  return {
    subject: pick("subject", null),
    topic: topic === "-" || topic === "…" ? null : topic,
    error: a.error === "1" ? 1 : 0,
    mode: pick("mode", null),
    flag: pick("flag", "none"),
    done: a.done === "1" ? 1 : 0,
  };
}

// Kartice za ponavljanje iz odgovora: [{ front, back }] (največ `max`, brez praznih in podvojenih).
// Oznaki V:/O: sta enaki v vseh jezikih; sprejmemo tudi Q:/A: (angleški zapis).
export function parseCards(text, max = 3) {
  const out = [];
  const seen = new Set();
  for (const m of String(text || "").matchAll(CARD_RE)) {
    const body = m[1];
    const q = /(?:^|\n)[ \t]*(?:V|Q)[ \t]*:[ \t]*([\s\S]*?)(?=\n[ \t]*(?:O|A)[ \t]*:)/.exec(body);
    const a = /\n[ \t]*(?:O|A)[ \t]*:[ \t]*([\s\S]*)$/.exec(body);
    const front = (q?.[1] || "").trim().slice(0, 300);
    const back = (a?.[1] || "").trim().slice(0, 600);
    if (!front || !back) continue;
    const key = front.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ front, back });
    if (out.length >= max) break;
  }
  return out;
}

// Gumbi z izbirami: JSON seznam 2–4 kratkih odgovorov (zadnji blok šteje). Neveljaven zapis = brez gumbov.
export const CHOICES_MAX = 4;
export const CHOICE_LEN = 60;
/** Besedilo brez bloka z gumbi (npr. ko popravek preverjanja zamenja konec odgovora). */
export const stripChoices = (text) => String(text).replace(CHOICES_JSON_RE, "").replace(CHOICES_RE, "").replace(CHOICES_LOOSE_RE, "");

export function parseChoices(text) {
  let last = null;
  for (const m of String(text || "").matchAll(CHOICES_JSON_RE)) last = m[1];
  if (last === null) for (const m of String(text || "").matchAll(CHOICES_RE)) last = m[1];
  if (last === null) return [];
  let list;
  try {
    list = JSON.parse(last.trim());
  } catch {
    return [];
  }
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const out = [];
  for (const c of list) {
    if (typeof c !== "string") continue;
    const v = c.replace(/\s+/g, " ").trim();
    if (!v || v.length > CHOICE_LEN || seen.has(v.toLowerCase())) continue;
    seen.add(v.toLowerCase());
    out.push(v);
  }
  return out.length >= 2 ? out.slice(0, CHOICES_MAX) : [];
}

// Mesto odstranjenega strojnega bloka (znak, ki ga v besedilu modela ni): oznake kode, ki obdajajo samo taka mesta, gredo
// z njimi (meritev 21. 11. 2026: odgovor se je končal z »``«). Pravi bloki kode z vsebino ostanejo nedotaknjeni.
const S = "\u0000";
const FENCE_AROUND_RE = /^[ \t]*`+[\w-]*[ \t]*\n(?:[ \t\u0000]*\n)*[ \t]*\u0000[ \t\u0000]*(?:\n[ \t\u0000]*)*\n[ \t]*`+[ \t]*$/gm;
const FENCE_OPEN_END_RE = /(^|\n)[ \t]*`+[\w-]*[ \t]*\n[\s\u0000]*\u0000[\s\u0000]*$/;

export function stripMeta(text) {
  return String(text)
    .replace(/\u0000/g, "")
    // META v bloku kode: cel blok z oznakami (zaključne oznake pravih blokov kode ostanejo).
    .replace(/^[ \t]*```[^\n]*\n(?:[ \t]*\n)*[ \t]*[`*_]*<{0,2}[ \t]*META\b[^\n]*\n(?:[ \t]*\n)*[ \t]*```[ \t]*$/gm, "")
    .replace(META_LOOSE_RE, S) // cela vrstica, tudi z oznakami kode okoli (»`<<META …>>`«)
    .replace(META_RE, S)
    .replace(CARD_RE, S)
    .replace(RACUN_RE, S)
    .replace(CHOICES_JSON_RE, S)
    .replace(CHOICES_RE, S)
    .replace(CHOICES_LOOSE_RE, S)
    .replace(OPEN_RE, S)
    .replace(/<orodje>[\s\S]*?(?:<\/orodje>|$)/g, S) // skrit zapis orodja (chat-settings.js actionNote), če ga model ponovi
    .replace(/(?:<<\s*(?:META|KARTICA|RA[CČ]UN|ODPRI|GRAF|SKICA)|<{1,2}\s*(?:IZBIRE|CHOICES))\b[\s\S]*$/, S) // nedokončan blok (npr. odrezan odgovor)
    .replace(/`+[ \t]*\u0000[ \t]*`+/g, S) // »``<<META …>>``« v vrstici
    .replace(FENCE_AROUND_RE, S)
    .replace(FENCE_OPEN_END_RE, "$1")
    .replace(/\u0000/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+$/, "");
}

// Uvodne fraze, ki jih prompt prepoveduje (»Odlično vprašanje!«, »Seveda!«): odstranjene še na strežniku.
// Pohvala pravilnega koraka (»Točno tako.«, »Bravo.«) ni uvodna fraza in ostane.
const LEAD_RE = /^[ \t]*(?:(?:odlično|dobro|super|zanimivo|izvrstno|krasno|lepo|zelo dobro|fino)\s+vprašanje|seveda|z veseljem|jasno|great question|good question|of course|sure)[!.,:;]+(?![ \t]*da\b)[ \t]*(?:\n[ \t]*)?/i; // »Jasno, da …« je stavek, ne uvodna fraza
export const LEAD_MAX = 40; // toliko znakov zadrži pretakanje, dokler ni jasno, ali se odgovor začne z uvodno frazo
export const stripLeadPhrase = (text) => String(text).replace(LEAD_RE, (m) => (m.trim().length === String(text).trim().length ? m : "")).replace(/^[ \t]*\n/, "");

// Besedilo odgovora, kot ga vidi učenec (prikaz in shranjeno sporočilo): brez strojnih blokov in uvodne fraze, s
// popravkoma predlogov in oznak (server/instruktor-kandidat.js; j 21. 11. 2026), enako kot pri pretakanju spodaj.
export function replyText(text, { polish = true, language = "sl" } = {}) {
  const t = stripLeadPhrase(stripMeta(text));
  return polish ? polishReply(t, { language }) : t;
}

// Filter za pretakanje: sproti spušča besedilo naprej, a zadrži vse od
// začetka prvega strojnega bloka ("<<META" ali "<<KARTICA") naprej (in morebitno
// nedokončano predpono na koncu), da učenec strojnih blokov nikoli ne vidi.
// polish (privzeto vklopljeno, server/instruktor-kandidat.js): pretočeno besedilo dobi enaka popravka kot
// končni prikaz (replyText zgoraj, server/app.js), da se izpis ob koncu ne začne znova; language: jezik pogovora.
export function createStreamFilter({ polish = true, language = "sl" } = {}) {
  let buffer = "";
  let emitted = 0; // koliko znakov iz buffer je že šlo naprej
  let metaStarted = false;
  let shown = ""; // polish: popravljeno besedilo, ki je že šlo naprej
  const view = (raw) => polishReply(stripLeadPhrase(raw), { language });
  // Popravljen nadaljnji del: popravek je odvisen le od besedila pred mestom (zadržan konec je pri tem upoštevan).
  const next = (raw) => {
    const all = view(raw);
    // Če se že prikazan začetek po popravku ne ujema več, ne pošlji nič: končni done.text ga popravi.
    const out = all.startsWith(shown) ? all.slice(shown.length) : "";
    shown = all;
    return out;
  };

  let leadDone = false; // začetek odgovora je pregledan za uvodno frazo
  const lead = (out) => {
    if (leadDone) return out;
    leadDone = true;
    return stripLeadPhrase(out);
  };

  return {
    push(chunk) {
      buffer += chunk;
      if (metaStarted) return "";
      // Začetek zadrži, dokler ni dovolj besedila (ali prelom vrstice), da se uvodna fraza odstrani kot celota.
      if (!leadDone && buffer.length < LEAD_MAX && !buffer.includes("\n")) return "";
      const from = Math.max(0, emitted - MARKER_MAX);
      const found = MARKERS.map((mk) => buffer.indexOf(mk, from)).filter((i) => i !== -1);
      const idx = found.length ? Math.min(...found) : -1;
      let safeEnd;
      if (idx !== -1) {
        metaStarted = true;
        safeEnd = idx;
      } else {
        // Zadrži konec, ki bi lahko bil začetek markerja (npr. "<", "<<M").
        safeEnd = buffer.length;
        for (let k = Math.min(MARKER_MAX - 1, buffer.length); k > 0; k--) {
          const tail = buffer.slice(-k);
          if (MARKERS.some((mk) => mk.length > k && mk.startsWith(tail))) {
            safeEnd = buffer.length - k;
            break;
          }
        }
      }
      // Presledke, prelome in oznake kode na koncu zadrži, dokler ne vemo, ali jim sledi META.
      while (safeEnd > emitted && /[\s`]/.test(buffer[safeEnd - 1])) safeEnd--;
      // Tudi začetek bloka kode z jezikom (»```json«) na koncu: lahko obdaja strojni blok (stripMeta ga odstrani).
      const vrstica = buffer.lastIndexOf("\n", safeEnd - 1) + 1;
      if (vrstica >= emitted && /^[ \t]*`{3,}[\w-]+[ \t]*$/.test(buffer.slice(vrstica, safeEnd))) safeEnd = vrstica;
      while (safeEnd > emitted && /\s/.test(buffer[safeEnd - 1])) safeEnd--;
      // Popravki: zadrži še predlog brez naslednje besede in začetek morebitne oznake (»Najprej pri…«).
      for (let i = 0; polish && i < 4 && safeEnd > emitted; i++) {
        let end = Math.max(emitted, safeEnd - polishHold(buffer.slice(0, safeEnd)));
        while (end > emitted && /[\s`]/.test(buffer[end - 1])) end--;
        if (end === safeEnd) break;
        safeEnd = end;
      }
      if (safeEnd <= emitted) return "";
      // Popravek gre vsakič čez celotno besedilo: pri dolgih odgovorih ga ne ponavljaj za vsak droben kos (pregled #915),
      // počakaj na vsaj 48 znakov (pri dolgem besedilu do 300) ali na prelom vrstice. Konec gre vedno naprej v end().
      if (polish && leadDone && safeEnd - emitted < Math.min(300, Math.max(48, buffer.length / 60)) && !buffer.slice(emitted, safeEnd).includes("\n")) return "";
      if (polish) {
        // Uvodna fraza se odloči šele na dovolj dolgem začetku (tudi ko je konec zadržan zaradi oznake ali predloga).
        if (!leadDone && safeEnd < LEAD_MAX && !buffer.slice(0, safeEnd).includes("\n")) return "";
        emitted = safeEnd;
        leadDone = true;
        return next(buffer.slice(0, safeEnd));
      }
      const out = buffer.slice(emitted, safeEnd);
      emitted = safeEnd;
      return lead(out);
    },
    // Začne znova (besedilo pred klicem orodja ni odgovor, server/claude.js onRetract).
    reset() {
      buffer = "";
      emitted = 0;
      metaStarted = false;
      leadDone = false;
      shown = "";
    },
    // Na koncu vrne preostanek (brez strojnih blokov) in celotno surovo besedilo.
    end() {
      if (polish) return { rest: next(buffer.slice(0, emitted) + stripMeta(buffer.slice(emitted))), raw: buffer };
      const rest = lead(stripMeta(buffer.slice(emitted)));
      return { rest, raw: buffer };
    },
  };
}
