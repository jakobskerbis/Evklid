// Ime učenca ne gre k ponudniku AI (j, 18. 11. 2026, po osnutku ocene učinka DPIA).
// Model v sistemskem promptu dobi oznako IME_OZNAKA namesto imena (server/prompt.js) in jo napiše v nagovor;
// strežnik jo zamenja s pravim imenom šele v besedilu za učenca (tok, končno besedilo, gumbi z izbirami).
// Zgodovina za API (messages.api_content) in skupni predpomnilnik odgovorov (answer_cache) hranita oznako.
// Kar učenec sam napiše (npr. »Ime mi je Ana«), ostane, kot je: to je njegovo sporočilo (docs/varnost-podatkov.md).

export const IME_OZNAKA = "{{IME}}";

// Oznaka in morebitne črke, ki jih je model prilepil nanjo (»{{IME}}u« namesto nesklonjenega nagovora):
// učenec vidi ime v imenovalniku, ne »Anau«.
const OZNAKA_RE = /\{\{IME\}\}[\p{L}\p{M}]*/gu;

/** Besedilo za učenca: oznaka → pravo ime. */
export function withName(text, name = "") {
  const s = String(text ?? "");
  if (!s.includes(IME_OZNAKA)) return s;
  const n = String(name || "").trim();
  return s.replace(OZNAKA_RE, () => n);
}

/**
 * Zamenjava med pretakanjem: oznaka je lahko razdeljena med dva kosa (»… {{I« + »ME}}!«). Konec, ki bi
 * lahko bil začetek oznake (ali oznaka s črkami, ki se morda še nadaljujejo), zadrži do naslednjega kosa.
 * push(kos) → besedilo, ki je varno za pošiljanje; end() → preostanek; reset() → zavrže zadržano (umik besedila).
 */
export function createNameStream(name = "") {
  let buf = "";
  const hold = (s) => {
    // Celotna oznaka čisto na koncu (morda ji sledijo še črke) ali konec, ki je začetek oznake.
    const at = s.lastIndexOf(IME_OZNAKA);
    if (at !== -1 && /^[\p{L}\p{M}]*$/u.test(s.slice(at + IME_OZNAKA.length))) return at;
    for (let k = Math.min(IME_OZNAKA.length - 1, s.length); k > 0; k--) {
      if (IME_OZNAKA.startsWith(s.slice(-k))) return s.length - k;
    }
    return s.length;
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

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Pravo ime → oznaka v besedilu, ki ga je napisal model (stari odgovori iz časa, ko je model ime še poznal,
 * in shranjeni povzetki pogovorov). Samo cele besede, z enako veliko začetnico, kot jo ima ime (manj lažnih
 * zadetkov pri imenih, ki so tudi besede). Sklonjene oblike (»Jakobu«) ostanejo: le v pogovorih izpred te spremembe.
 */
export function maskName(text, name = "") {
  const s = String(text ?? "");
  const n = String(name || "").trim();
  if (n.length < 2) return s;
  const parts = [n, ...n.split(/\s+/).filter((w) => w.length >= 2 && w !== n)];
  let out = s;
  for (const p of parts) out = out.replace(new RegExp(`(?<![\\p{L}\\p{N}_])${escRe(p)}(?![\\p{L}\\p{N}_])`, "gu"), IME_OZNAKA);
  return out;
}

/** Zgodovina za API: v odgovorih inštruktorja ime → oznaka. Sporočila učenca ostanejo nespremenjena. */
export function maskHistory(messages, name = "") {
  if (String(name || "").trim().length < 2) return messages;
  return messages.map((m) => {
    if (m.role !== "assistant") return m;
    if (typeof m.content === "string") return { ...m, content: maskName(m.content, name) };
    if (!Array.isArray(m.content)) return m;
    let changed = false;
    const content = m.content.map((b) => {
      if (b?.type !== "text" || typeof b.text !== "string") return b;
      const t = maskName(b.text, name);
      if (t === b.text) return b;
      changed = true;
      return { ...b, text: t };
    });
    return changed ? { ...m, content } : m;
  });
}
