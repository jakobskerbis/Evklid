// Napake 3D sveta (docs/3d.md »Napake«): iz napake razbere, kaj učencu povedati. Prej je vsaka napaka rekla »Preveri
// povezavo«, tudi star Safari (SyntaxError), premalo pomnilnika na iPadu in napaka v naši kodi, zato učenec ni vedel,
// kaj storiti. Brez three.js (preizkus v Node: test/3d-napake.test.js).
import { kakovostNaprave } from "./modeli.js";

// Sporočila brskalnikov, ko modul ali datoteka ne pride čez omrežje (Chrome, Safari, Firefox).
const OMREZJE = /failed to fetch|load failed|networkerror|network error|importing a module script failed|error loading dynamically imported module|failed to fetch dynamically imported module|network connection was lost|internet connection appears to be offline|err_internet_disconnected/i;
const POMNILNIK = /out of memory|memory|allocation|allocate|context lost|context_lost|contextlost/i;

const statusNapake = (err) => {
  const s = err?.status ?? err?.response?.status ?? err?.statusCode;
  if (Number.isInteger(s)) return s;
  const m = /(?:HTTP|status|responded with)\s*:?\s*(\d{3})\b/i.exec(String(err?.message || ""));
  return m ? Number(m[1]) : 0;
};

// Vrsta napake in ključ besedila: { vrsta, key, detail }. detail je kratka koda (ime napake ali HTTP status) za vrstico
// »Koda napake«, samo pri napakah, ki jih ne znamo razložiti.
export function napakaBesedilo(err, { naVoljo = typeof navigator !== "undefined" ? navigator.onLine !== false : true } = {}) {
  if (err?.koda === "webgl") return { vrsta: "webgl", key: "a3.noWebgl", detail: null };
  if (err?.koda === "brskalnik") return { vrsta: "brskalnik", key: "a3.oldBrowser", detail: null };
  if (err?.koda === "pomnilnik") return { vrsta: "pomnilnik", key: "a3.lowMemory", detail: null };
  const ime = String(err?.name || "");
  const sporocilo = String(err?.message ?? err ?? "");
  if (!naVoljo) return { vrsta: "povezava", key: "a3.loadError", detail: null };
  if (ime === "SyntaxError") return { vrsta: "brskalnik", key: "a3.oldBrowser", detail: null };
  if (ime === "RangeError" || POMNILNIK.test(sporocilo)) return { vrsta: "pomnilnik", key: "a3.lowMemory", detail: null };
  const status = statusNapake(err);
  if (status >= 400) return { vrsta: "povezava", key: "a3.loadError", detail: `HTTP ${status}` };
  if (OMREZJE.test(sporocilo)) return { vrsta: "povezava", key: "a3.loadError", detail: null };
  return { vrsta: "drugo", key: "a3.otherError", detail: ime || "Error" };
}

// Vsebina kartice z napako: odstavek z besedilom, pri neznani napaki vrstica s kodo, pri pomanjkanju pomnilnika povezava
// na nižjo kakovost (če naprava že nima nizke), in gumb »Poskusi znova«, kadar klicatelj da znova(). Vrne seznam elementov.
export function napakaVsebina(err, { t, znova = null, razredGumba = "a3-pill" } = {}) {
  const n = napakaBesedilo(err);
  const el = (tag, razred, besedilo) => {
    const x = document.createElement(tag);
    if (razred) x.className = razred;
    if (besedilo != null) x.textContent = besedilo;
    return x;
  };
  const out = [el("p", "", t(n.key))];
  if (n.vrsta === "drugo" && n.detail) out.push(el("p", "k3-napaka-koda", t("a3.errorCode", { koda: n.detail })));
  if (n.vrsta === "pomnilnik" && kakovostNaprave() !== "nizka" && typeof location !== "undefined") {
    const a = el("a", "k3-napaka-povezava", t("a3.lowQuality"));
    const u = new URL(location.href);
    u.searchParams.set("kakovost", "nizka");
    a.href = u.href;
    out.push(a);
  }
  if (typeof znova === "function" && n.vrsta !== "webgl" && n.vrsta !== "brskalnik") {
    const b = el("button", razredGumba, t("a3.retry"));
    b.type = "button";
    b.addEventListener("click", () => znova(), { once: true });
    out.push(b);
  }
  return out;
}
