// Tempo izpisa odgovorov: besedilo se pokaže beseda za besedo z berljivo hitrostjo
// in kratkim premorom po vsakem stavku in odstavku. Formule ($...$) se pokažejo v celoti.

// cps = znaki na sekundo; sentence/para = premor v ms po stavku/odstavku.
export const PACES = {
  zelo_pocasi: { label: "Zelo počasi", cps: 9, sentence: 1400, para: 2200 },
  pocasi: { label: "Počasi", cps: 14, sentence: 900, para: 1500 },
  srednje: { label: "Srednje", cps: 24, sentence: 450, para: 800 },
  hitro: { label: "Hitro", cps: 45, sentence: 150, para: 300 },
  takoj: { label: "Takoj (brez animacije)", cps: 0, sentence: 0, para: 0 },
};
export const DEFAULT_PACE = "pocasi";

/**
 * Naslednji kos besedila od mesta `pos`: presledki + ena beseda ali cela formula.
 * Vrne null, če kos še ni celoten (npr. formula brez zaključnega $ ali beseda na koncu
 * besedila, ki se še pretaka) in `final` ni nastavljen.
 * @returns {{end:number, pause:"none"|"sentence"|"para"} | null}
 */
export function nextChunk(text, pos, final = false) {
  const n = text.length;
  if (pos >= n) return null;
  let i = pos;
  let para = false;
  while (i < n && /\s/.test(text[i])) {
    if (text[i] === "\n" && text.slice(pos, i).includes("\n")) para = true;
    i++;
  }
  if (i >= n) return final ? { end: n, pause: "none" } : null;
  if (para && i > pos) return { end: i, pause: "para" };

  // Vrstica tabele se pokaže v celoti (glava skupaj z ločilom), da tabela ne poskakuje.
  const lineStart = text.lastIndexOf("\n", i - 1) + 1;
  if (/^\s*(>\s*)?\|/.test(text.slice(lineStart, i + 1))) {
    let nl = text.indexOf("\n", i);
    if (nl === -1) return final ? { end: n, pause: "none" } : null;
    const prev = text.slice(text.lastIndexOf("\n", lineStart - 2) + 1, Math.max(0, lineStart - 1));
    if (!/^\s*(>\s*)?\|/.test(prev)) {
      // Prva vrstica tabele (glava): počakamo še na ločilo pod njo.
      const nl2 = text.indexOf("\n", nl + 1);
      const next = text.slice(nl + 1, nl2 === -1 ? n : nl2);
      if (nl2 === -1 && !final) return null;
      if (/^\s*(>\s*)?\|?\s*:?-+/.test(next)) nl = nl2 === -1 ? n : nl2;
    }
    return { end: nl, pause: "sentence" };
  }

  if (text[i] === "$") {
    const dbl = text[i + 1] === "$";
    const close = text.indexOf(dbl ? "$$" : "$", i + (dbl ? 2 : 1));
    if (close === -1) return final ? { end: n, pause: "none" } : null;
    i = close + (dbl ? 2 : 1);
  }
  while (i < n && !/\s/.test(text[i])) {
    if (text[i] === "$") break; // formula takoj za besedo (npr. »(»$x$«)
    i++;
  }
  if (i >= n && !final) return null;
  const last = text.slice(pos, i).replace(/[*_)»"'\]]+$/, "").slice(-1);
  const pause = /[.!?:]/.test(last) ? "sentence" : "none";
  return { end: i, pause };
}

/** Zamik (ms) po prikazu kosa dolžine `len` z danim premorom. */
export function chunkDelay(pace, len, pause) {
  if (!pace.cps) return 0;
  return Math.round((len / pace.cps) * 1000) + (pace[pause] || 0);
}

/**
 * Upravlja postopen prikaz enega sporočila.
 * paint(shownText) izriše trenutno vidni del.
 */
export function createPacer(pace, paint, { setTimer = setTimeout, clearTimer = clearTimeout } = {}) {
  let raw = "";
  let shown = 0;
  let final = false;
  let timer = null;
  let instant = !pace.cps;
  let resolveDone;
  const done = new Promise((r) => (resolveDone = r));

  const finishIfDone = () => {
    if (final && shown >= raw.length) {
      paint(raw);
      resolveDone();
      return true;
    }
    return false;
  };

  const step = () => {
    timer = null;
    if (instant) {
      shown = raw.length;
      paint(raw);
      finishIfDone();
      return;
    }
    const c = nextChunk(raw, shown, final);
    if (!c) {
      finishIfDone();
      return; // počakamo na nove znake
    }
    const len = c.end - shown;
    shown = c.end;
    paint(raw.slice(0, shown));
    if (finishIfDone()) return;
    timer = setTimer(step, chunkDelay(pace, len, c.pause));
  };
  const kick = () => {
    if (timer === null) step();
  };

  return {
    done,
    push(text) {
      raw += text;
      kick();
    },
    // Končno besedilo (brez META); če se razlikuje od pretočenega, ga zamenja.
    finish(text) {
      if (typeof text === "string" && text !== raw) {
        if (!text.startsWith(raw.slice(0, shown))) shown = 0;
        raw = text;
      }
      final = true;
      kick();
    },
    skip() {
      instant = true;
      if (timer !== null) clearTimer(timer);
      timer = null;
      shown = raw.length;
      paint(raw);
      finishIfDone();
    },
    get revealing() {
      return !final || shown < raw.length;
    },
  };
}
