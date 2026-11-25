// Napake 3D sveta (docs/3d.md »Errors«): iz napake razbere, kaj učencu povedati. Prej je vsaka napaka rekla »Preveri
// povezavo«, tudi star Safari (SyntaxError), premalo pomnilnika na iPadu in napaka v naši kodi, zato učenec ni vedel,
// kaj storiti. Brez three.js (preizkus v Node: test/3d-napake.test.js).
import { kakovostNaprave } from "./modeli.js";
import { jsonAliNic } from "../odgovor.js";

// Sporočila brskalnikov, ko modul ali datoteka ne pride čez omrežje (Chrome, Safari, Firefox).
const OMREZJE = /failed to fetch|load failed|networkerror|network error|importing a module script failed|error loading dynamically imported module|failed to fetch dynamically imported module|network connection was lost|internet connection appears to be offline|err_internet_disconnected/i;
// Uvoz modula ni uspel: lahko omrežje ali neskladje različic (service worker je dal star modul ob novem).
const UVOZ = /importing a module script failed|dynamically imported module|module script/i;
// Star modul ob novem: izvoza, ki ga novi modul uvozi, ni (Chrome, Firefox, Safari). Brskalnik to javi kot SyntaxError,
// zato ga moramo ločiti od starega brskalnika.
const NESKLADJE = /does not provide an export named|importing binding name|binding name .* (is )?not found|ambiguous indirect export|no such export|doesn't provide an export/i;
const POMNILNIK = /out of memory|memory|allocation|allocate|context lost|context_lost|contextlost/i;
// RangeError pomeni pomnilnik samo s takim sporočilom (»Array buffer allocation failed«); prirezan GLB (»Offset is outside
// the bounds of the DataView«) ni pomanjkanje pomnilnika.
const RANGE_POMNILNIK = /memory|allocation|buffer/i;
// SyntaxError, ki ni star brskalnik: HTML namesto JSON (prestrezna stran omrežja, posrednik), neveljaven izbirnik (DOMException).
const NI_BRSKALNIK = /JSON|Unrecognized token|token '<'|token <|selector/i;

const statusNapake = (err) => {
  const s = err?.status ?? err?.response?.status ?? err?.statusCode;
  if (Number.isInteger(s)) return s;
  const m = /(?:HTTP|status|responded with)\s*:?\s*(\d{3})\b/i.exec(String(err?.message || ""));
  return m ? Number(m[1]) : 0;
};

// Kratek tehnični razlog za posnetek zaslona (j z iPada): »ime: prva vrstica sporočila«, največ 120 znakov. Brez sklada,
// iz naslovov ostane le pot (brez poizvedbe in izvora, kjer bi bil žeton), dolga zaporedja črk in številk (žetoni) skrita.
export function tehnicno(err) {
  if (err == null) return "";
  const ime = String(err?.name || (typeof err === "string" ? "Error" : typeof err)).slice(0, 40);
  let s = String(err?.message ?? (typeof err === "string" ? err : "")).split("\n")[0].trim();
  s = s.replace(/[^\s"'<>@]+@[^\s"'<>@]+\.[a-z]{2,}/gi, "[e-pošta]");
  // Naslov do presledka ali narekovaja (tudi z oklepaji v poti ali poizvedbi): ostane samo pot.
  s = s.replace(/\b(?:https?|wss?|blob|file):\/\/[^\s"'<>]+/gi, (u) => {
    try {
      return new URL(u).pathname;
    } catch {
      return "[naslov]";
    }
  });
  s = s.replace(/\?[^\s"'<>]*[=&][^\s"'<>]*/g, ""); // poizvedba brez izvora (…/a.js?t=x&y=1)
  // Žeton s pikami (JWT »eyJ….….…« ali tri dolge kose): pred dolgimi nizi, sicer bi ostale pike in kratki kosi.
  s = s.replace(/\beyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]*)?|\b[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{6,}\b/g, "[žeton]");
  s = s.replace(/[A-Za-z0-9_-]{32,}/g, "…");
  const v = s ? `${ime}: ${s}` : ime;
  return v.length > 120 ? `${v.slice(0, 119)}…` : v;
}

// Vrsta napake in ključ besedila: { vrsta, key, detail, modul }. detail: HTTP status ali ime napake. modul: napaka uvoza
// modula, zato »Poskusi znova« osveži stran mimo starih kopij service workerja (osveziMimoStarih). Napaka s
// `povezava: true` (npr. naloziModel brez povezave) je napaka povezave.
export function napakaBesedilo(err, { naVoljo = typeof navigator !== "undefined" ? navigator.onLine !== false : true } = {}) {
  if (err?.koda === "webgl") return { vrsta: "webgl", key: "a3.noWebgl", detail: null, modul: false };
  if (err?.koda === "brskalnik") return { vrsta: "brskalnik", key: "a3.oldBrowser", detail: null, modul: false };
  if (err?.koda === "pomnilnik") return { vrsta: "pomnilnik", key: "a3.lowMemory", detail: null, modul: false };
  const ime = String(err?.name || "");
  const sporocilo = String(err?.message ?? err ?? "");
  if (!naVoljo || err?.povezava === true) return { vrsta: "povezava", key: "a3.loadError", detail: null, modul: false };
  if (NESKLADJE.test(sporocilo)) return { vrsta: "posodobitev", key: "a3.updated", detail: null, modul: true };
  if (ime === "SyntaxError" && /JSON|Unrecognized token|token '<'|token </i.test(sporocilo)) return { vrsta: "povezava", key: "a3.loadError", detail: null, modul: false };
  if (ime === "SyntaxError" && !NI_BRSKALNIK.test(sporocilo)) return { vrsta: "brskalnik", key: "a3.oldBrowser", detail: null, modul: false };
  if ((ime === "RangeError" && RANGE_POMNILNIK.test(sporocilo)) || POMNILNIK.test(sporocilo)) return { vrsta: "pomnilnik", key: "a3.lowMemory", detail: null, modul: false };
  const status = statusNapake(err);
  if (status >= 400) return { vrsta: "povezava", key: "a3.loadError", detail: `HTTP ${status}`, modul: false };
  if (OMREZJE.test(sporocilo)) return { vrsta: "povezava", key: "a3.loadError", detail: null, modul: UVOZ.test(sporocilo) };
  return { vrsta: "drugo", key: "a3.otherError", detail: ime || "Error", modul: false };
}

// Osveži stran mimo starih kopij: service worker pobriše kopije različice, ki ni več na strežniku (public/sw.js
// »app-stale«, kot public/app.js dropStaleCopies), nato ponovno nalaganje. Tako star modul ob novi strani ne ostane.
export async function osveziMimoStarih({ okno = typeof window !== "undefined" ? window : null } = {}) {
  try {
    const sw = okno?.navigator?.serviceWorker?.controller;
    const stanje = sw ? await fetch("/healthz/stanje", { cache: "no-store" }).then((r) => jsonAliNic(r)) : null;
    if (sw && stanje?.datoteke) {
      const ch = new MessageChannel();
      let rok;
      await new Promise((konec) => {
        ch.port1.onmessage = () => konec();
        rok = setTimeout(konec, 1500);
        sw.postMessage({ type: "app-stale", app: stanje.datoteke }, [ch.port2]);
      });
      clearTimeout(rok);
      ch.port1.close();
    }
  } catch {} // brez povezave ali brez service workerja: samo osvežitev
  okno?.location.reload();
}

// Vsebina kartice z napako: odstavek z besedilom, drobna vrstica »Tehnično: …«, pri pomanjkanju pomnilnika povezava na
// nižjo kakovost (če naprava že nima nizke) in gumb »Poskusi znova«: pri napaki uvoza modula osveži stran mimo starih
// kopij (tudi brez znova), sicer pokliče znova(), če ga klicatelj da. Vrne seznam elementov.
export function napakaVsebina(err, { t, znova = null, razredGumba = "a3-pill" } = {}) {
  const n = napakaBesedilo(err);
  const el = (tag, razred, besedilo) => {
    const x = document.createElement(tag);
    if (razred) x.className = razred;
    if (besedilo != null) x.textContent = besedilo;
    return x;
  };
  const out = [el("p", "", t(n.key))];
  const teh = tehnicno(err);
  if (teh) out.push(el("p", "k3-napaka-koda", t("a3.errorTech", { koda: teh })));
  if (n.vrsta === "pomnilnik" && kakovostNaprave() !== "nizka" && typeof location !== "undefined") {
    const a = el("a", "k3-napaka-povezava", t("a3.lowQuality"));
    const u = new URL(location.href);
    u.searchParams.set("kakovost", "nizka");
    a.href = u.href;
    out.push(a);
  }
  const akcija = n.modul ? () => osveziMimoStarih() : n.vrsta !== "webgl" && n.vrsta !== "brskalnik" ? znova : null;
  if (typeof akcija === "function") {
    const b = el("button", razredGumba, t("a3.retry"));
    b.type = "button";
    b.dataset.znova = n.modul ? "osvezi" : "znova";
    b.addEventListener("click", () => akcija(), { once: true });
    out.push(b);
  }
  return out;
}
