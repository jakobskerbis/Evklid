// Branje in odstranjevanje strojnih blokov iz odgovorov modela:
// vrstice <<META ...>> (analitika) in blokov <<KARTICA V: … O: … >> (kartice za ponavljanje).

const META_RE = /<<\s*META\b([\s\S]*?)>>/g;
const CARD_RE = /<<\s*KARTICA\b([\s\S]*?)>>/g;
// META brez oklepajev ali z enim samim (»META subject=MAT …«, »<META …>«, v oznakah kode): model se včasih
// zmoti v zapisu; učenec vrstice ne sme videti (digitalni razred, 2026-11-01: vidna pri treh učencih).
const META_LOOSE_RE = /^[ \t]*[`*_]*<{0,2}[ \t]*META\b[^\n]*\bsubject=[^\n]*$/gm;
const MARKERS = ["<<META", "<<KARTICA", "<< META", "<< KARTICA", "<META", "META subject="];
const MARKER_MAX = Math.max(...MARKERS.map((m) => m.length));

import { ALL_SUBJECTS } from "./subjects.js";

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

export function stripMeta(text) {
  return String(text)
    // META v bloku kode: cel blok z oznakami (zaključne oznake pravih blokov kode ostanejo).
    .replace(/^[ \t]*```[^\n]*\n(?:[ \t]*\n)*[ \t]*[`*_]*<{0,2}[ \t]*META\b[^\n]*\n(?:[ \t]*\n)*[ \t]*```[ \t]*$/gm, "")
    .replace(META_LOOSE_RE, "") // cela vrstica, tudi z oznakami kode okoli (»`<<META …>>`«)
    .replace(META_RE, "")
    .replace(CARD_RE, "")
    .replace(/<<\s*(?:META|KARTICA)\b[\s\S]*$/, "") // nedokončan blok (npr. odrezan odgovor)
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+$/, "");
}

// Uvodne fraze, ki jih prompt prepoveduje (»Odlično vprašanje!«, »Seveda!«): odstranjene še na strežniku.
// Pohvala pravilnega koraka (»Točno tako.«, »Bravo.«) ni uvodna fraza in ostane.
const LEAD_RE = /^[ \t]*(?:(?:odlično|dobro|super|zanimivo|izvrstno|krasno|lepo|zelo dobro|fino)\s+vprašanje|seveda|z veseljem|jasno|great question|good question|of course|sure)[!.,:;]+(?![ \t]*da\b)[ \t]*(?:\n[ \t]*)?/i; // »Jasno, da …« je stavek, ne uvodna fraza
export const LEAD_MAX = 40; // toliko znakov zadrži pretakanje, dokler ni jasno, ali se odgovor začne z uvodno frazo
export const stripLeadPhrase = (text) => String(text).replace(LEAD_RE, (m) => (m.trim().length === String(text).trim().length ? m : "")).replace(/^[ \t]*\n/, "");

// Filter za pretakanje: sproti spušča besedilo naprej, a zadrži vse od
// začetka prvega strojnega bloka ("<<META" ali "<<KARTICA") naprej (in morebitno
// nedokončano predpono na koncu), da učenec strojnih blokov nikoli ne vidi.
export function createStreamFilter() {
  let buffer = "";
  let emitted = 0; // koliko znakov iz buffer je že šlo naprej
  let metaStarted = false;

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
      if (safeEnd <= emitted) return "";
      const out = buffer.slice(emitted, safeEnd);
      emitted = safeEnd;
      return lead(out);
    },
    // Na koncu vrne preostanek (brez strojnih blokov) in celotno surovo besedilo.
    end() {
      const rest = lead(stripMeta(buffer.slice(emitted)));
      return { rest, raw: buffer };
    },
  };
}
