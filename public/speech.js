// Glasovni vnos vprašanj (prepoznavanje govora v brskalniku, slovenščina).
// Ne stane nič: govor pretvori brskalnik (Chrome, Edge, Safari), ne naš strežnik.
// Izgovorjene računske izraze (»x na kvadrat«, »koren iz 16«) zapišemo s simboli.

export const speechSupported = () =>
  typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

// Število, posamezna črka (x, a, b), zaprt oklepaj ali že zapisan simbol: okolica računske operacije.
const MATHY = /^(?:[-−]?\d+(?:[.,]\d+)?[²³⁴⁵°%]?|[a-zA-Zα-ω][²³⁴⁵]?|[()√∛π²³⁴⁵]+|.*[\d)²³][²³⁴⁵)]*)$/;
const isMathy = (w) => w !== undefined && MATHY.test(w.replace(/[?!.,;:]+$/, ""));

const POWERS = [
  [/\s+na\s+kvadrat\b/gi, "²"],
  [/\s+na\s+drugo\b/gi, "²"],
  [/\s+na\s+kub\b/gi, "³"],
  [/\s+na\s+tretjo\b/gi, "³"],
  [/\s+na\s+četrto\b/gi, "⁴"],
  [/\s+na\s+peto\b/gi, "⁵"],
];

// Besede, ki so računska operacija samo med dvema »računskima« besedama.
const BINARY = new Map([
  ["plus", "+"],
  ["minus", "−"],
  ["krat", "·"],
  ["deljeno", ":"],
  ["skozi", "/"],
  ["cela", ","],
  ["celih", ","],
]);

/** Izgovorjeno besedilo → zapis s simboli. Navadno besedilo ostane, kot je. */
export function spokenMath(text) {
  let s = String(text || "").trim();
  if (!s) return "";
  for (const [re, sym] of POWERS) s = s.replace(re, sym);
  s = s
    .replace(/\bkubičn\w*\s+koren\w*\s+iz\s+/gi, "∛")
    .replace(/\b(?:kvadratn\w*\s+)?koren\w*\s+iz\s+/gi, "√")
    .replace(/\bkoren\s+(?=\d)/gi, "√")
    .replace(/\bpi\b/gi, "π")
    .replace(/(\d)\s+stopin(?:j|e|ah|i)?\b/gi, "$1°")
    .replace(/(\d)\s+(?:odstot\w*|procent\w*)\b/gi, "$1 %");

  const w = s.split(/\s+/);
  const out = [];
  for (let i = 0; i < w.length; i++) {
    const word = w[i];
    const low = word.toLowerCase();
    const prev = out[out.length - 1];
    // »deljeno z 4«: predlog z/s izpustimo
    let next = w[i + 1];
    let skip = 0;
    if (low === "deljeno" && /^[zs]$/i.test(next || "")) {
      next = w[i + 2];
      skip = 1;
    }
    if (BINARY.has(low) && isMathy(prev) && isMathy(next)) {
      const sym = BINARY.get(low);
      if (sym === "," || sym === "/") out[out.length - 1] = prev + sym + next;
      else out.push(sym, next);
      i += 1 + skip;
      continue;
    }
    // »je enako« / »enako« med izrazoma → =
    if ((low === "je" && /^enak/i.test(w[i + 1] || "") && isMathy(prev) && isMathy(w[i + 2])) || (low === "enako" && isMathy(prev) && isMathy(next))) {
      out.push("=", low === "je" ? w[i + 2] : next);
      i += low === "je" ? 2 : 1;
      continue;
    }
    out.push(word);
  }
  return out.join(" ").replace(/([√∛])\s+/g, "$1");
}

/**
 * Gumb z mikrofonom ob polju za vnos. Prvi dotik začne poslušati, drugi ustavi.
 * Med govorom je sproti viden delni zapis; na koncu ga dopolnimo s simboli.
 * @param {HTMLElement} button
 * @param {HTMLTextAreaElement|HTMLInputElement} field
 * allowed: ali sme profil govoriti (stikalo starša za mlajše od 15 let, j 10. 11.); ob »ne« onBlocked namesto poslušanja.
 * @param {{ onMessage?: (msg: string) => void, onChange?: () => void, allowed?: () => boolean | Promise<boolean>, onBlocked?: () => void }} [opts]
 */
export function attachMic(button, field, { onMessage = () => {}, onChange = () => {}, allowed = null, onBlocked = () => {} } = {}) {
  button.hidden = !speechSupported();
  if (button.hidden) return null;
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null;
  let base = "";
  let finalText = "";

  const join = (a, b) => (a && b ? a.replace(/\s+$/, "") + " " + b : a || b);
  const setListening = (on) => {
    button.classList.toggle("rec", on);
    button.setAttribute("aria-pressed", String(on));
    button.title = on ? "Poslušam … dotakni se za konec" : "Povej vprašanje";
  };

  function stop() {
    rec?.stop();
  }

  function start() {
    rec = new Rec();
    rec.lang = "sl-SI";
    rec.interimResults = true;
    rec.continuous = true;
    rec.maxAlternatives = 1;
    base = field.value;
    finalText = "";
    let heard = false;

    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText = join(finalText, r[0].transcript.trim());
        else interim = join(interim, r[0].transcript.trim());
      }
      heard = true;
      field.value = join(base, join(spokenMath(finalText), interim));
      onChange();
    };
    rec.onerror = (e) => {
      const msg = {
        "not-allowed": "Dovoli uporabo mikrofona v brskalniku (ikona ob naslovu strani).",
        "service-not-allowed": "Brskalnik ne dovoli prepoznavanja govora. Poskusi v Chromu ali Safariju.",
        "no-speech": "Nič nisem slišal. Dotakni se mikrofona in govori.",
        "audio-capture": "Ne najdem mikrofona.",
        network: "Za glasovni vnos potrebuješ internetno povezavo.",
      }[e.error];
      if (msg) onMessage(msg);
    };
    rec.onend = () => {
      setListening(false);
      if (heard) {
        field.value = join(base, spokenMath(finalText));
        onChange();
      }
      rec = null;
      field.focus();
    };
    try {
      rec.start();
      setListening(true);
    } catch {
      rec = null;
      onMessage("Glasovnega vnosa ni bilo mogoče začeti. Poskusi znova.");
    }
  }

  button.addEventListener("click", async () => {
    if (rec) return stop();
    if (allowed && !(await allowed())) return onBlocked();
    start();
  });
  setListening(false);
  return { stop, get listening() { return !!rec; } };
}
