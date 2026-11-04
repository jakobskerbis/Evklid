// Od kod je učenec prišel (server/rast.js): oznaka iz povezave se shrani ob prvem obisku in gre zraven,
// ko se ustvari profil. Samo v tem brskalniku (localStorage), brez piškotkov; po 30 dneh se pozabi.
const KEY = "evklid_vir";
const KEEP_MS = 30 * 86400000;

const clean = (v) =>
  String(v || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "")
    .slice(0, 32)
    .replace(/[-_]+$/, "");

// Prvi vir velja: kasnejša povezava z drugo oznako ga ne povozi, dokler ne poteče.
export function captureSource(search = location.search) {
  try {
    const q = new URLSearchParams(search);
    const vir = clean(q.get("utm_source")) || clean(q.get("vir")) || (q.get("ref")?.trim() ? "priporocilo" : q.get("koda")?.trim() ? "razred" : "");
    if (!vir || currentSource()) return;
    localStorage.setItem(KEY, JSON.stringify({ v: vir, t: Date.now() }));
  } catch {}
}

export function currentSource() {
  try {
    const o = JSON.parse(localStorage.getItem(KEY) || "null");
    return o && typeof o.v === "string" && Date.now() - o.t < KEEP_MS ? o.v : null;
  } catch {
    return null;
  }
}

// Tudi na straneh za starše in šole (starsi.html, placaj.html, sole.html), od koder starš šele pride v aplikacijo.
if (typeof location !== "undefined") captureSource();
