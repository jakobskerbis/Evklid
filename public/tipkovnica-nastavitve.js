// Nastavitve Evklidove tipkovnice v napravi ({ mode, words, buzz, glide }); tipkovnica-data.js jih izvozi naprej.
export const PREF_KEY = "evklid.tipkovnica";
export const MODES = ["always", "math", "never"];
export const DEFAULT_PREFS = { mode: "always", words: false, buzz: true, glide: true };
export function parsePrefs(raw) {
  let p = {};
  try {
    p = JSON.parse(raw || "{}") || {};
  } catch {}
  return {
    mode: MODES.includes(p.mode) ? p.mode : DEFAULT_PREFS.mode,
    words: typeof p.words === "boolean" ? p.words : DEFAULT_PREFS.words,
    buzz: typeof p.buzz === "boolean" ? p.buzz : DEFAULT_PREFS.buzz,
    glide: typeof p.glide === "boolean" ? p.glide : DEFAULT_PREFS.glide,
  };
}
