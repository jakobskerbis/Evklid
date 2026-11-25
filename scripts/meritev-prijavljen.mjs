// Pomožni deli za del »prijavljen« v scripts/meritev-zmogljivosti.mjs (prijavljen učenec na počasnem telefonu):
// načrt realistično napolnjenega učenca (nekaj tednov napredka, dolga zgodovina klepeta), povzetek zahtev po obisku
// (omrežje ali predpomnilnik service workerja) in merilnik v strani (od pravega tapa do uporabnega zaslona).
// Brez stranskih učinkov ob uvozu, zato ga testi uvozijo (test/meritev-prijavljen.test.js).

// Ponovljiva psevdonaključna števila (mulberry32), da je učenec pri vsaki meritvi enak.
export function nakljucno(seme = 1) {
  let a = seme >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Odgovor inštruktorja, kot ga piše pravi model: odstavki, krepko, formule KaTeX v vrstici in v svojem bloku.
function odgovor(r, i) {
  const a = 2 + Math.floor(r() * 7);
  const b = 1 + Math.floor(r() * 9);
  const c = a * (3 + Math.floor(r() * 5)) + b;
  const x = (c - b) / a;
  const deli = [
    `Dobro vprašanje! Poglejva enačbo $${a}x + ${b} = ${c}$ korak za korakom.`,
    `**1. korak:** na obeh straneh odštejemo $${b}$:\n\n$$${a}x = ${c} - ${b} = ${c - b}$$`,
    `**2. korak:** delimo z $${a}$:\n\n$$x = \\frac{${c - b}}{${a}} = ${x}$$`,
    `**Preizkus:** $${a} \\cdot ${x} + ${b} = ${a * x + b}$ ✓. Rešitev je pravilna.`,
  ];
  if (i % 3 === 0) deli.push(`Za vajo: reši še $\\frac{${a}x - ${b}}{${a + 1}} = ${x}$ in mi napiši, kaj dobiš.`);
  if (i % 4 === 1) deli.push(`- izraz poenostavi\n- neznanko osami na eni strani\n- vedno naredi preizkus`);
  return deli.join("\n\n");
}

// Naslov dolgega (najnovejšega) pogovora: meritev ga poišče v seznamu pogovorov po tem naslovu.
export const DOLGI_POGOVOR = "Enačbe z oklepaji (dolg pogovor)";

// Načrt učenca za `dni` dni: pogovori (prvi je najnovejši in dolg), dnevni XP in rešene naloge.
// Vrne samo podatke; zapis v bazo naredi meritev (šifrirano, kot strežnik).
export function nacrtUcenca({ dni = 21, pogovorov = 30, dolgih = 120, nalogNaDan = 6, seme = 7 } = {}) {
  const r = nakljucno(seme);
  const pogovori = [];
  for (let p = 0; p < pogovorov; p++) {
    const n = p === 0 ? dolgih : 6 + 2 * Math.floor(r() * 8); // vedno sodo: vprašanje, odgovor
    const dniNazaj = p === 0 ? 0 : Math.min(dni - 1, Math.floor((p * dni) / pogovorov));
    const sporocila = [];
    for (let m = 0; m < n; m++) {
      const user = m % 2 === 0;
      sporocila.push({ role: user ? "user" : "assistant", text: user ? `Kako rešim nalogo ${p + 1}.${m / 2 + 1}? Ne razumem, kaj naredim z oklepaji.` : odgovor(r, m) });
    }
    pogovori.push({ naslov: p === 0 ? DOLGI_POGOVOR : `Enačbe ${p + 1}`, dniNazaj, sporocila });
  }
  const xp = [];
  const naloge = [];
  for (let d = dni - 1; d >= 0; d--) {
    if (d % 7 === 5) continue; // en dan v tednu brez učenja
    const k = Math.max(2, Math.round(nalogNaDan * (0.5 + r())));
    for (let j = 0; j < k; j++) {
      naloge.push({ dniNazaj: d, pravilno: r() < 0.8 });
      xp.push({ dniNazaj: d, amount: 10 + Math.floor(r() * 15), reason: "naloga" });
    }
  }
  return { dni, pogovori, xp, naloge };
}

// Povzetek zahtev enega obiska. Zahteva: { prenos, surovo, izSw, odSw } — izSw: stran jo je dobila iz service workerja
// (predpomnilnik ali njegov fetch), odSw: zahteva, ki jo je poslal service worker sam (prek omrežja).
// zahtev/mreznih/prenosKB: zahteve strani (vse / po omrežju mimo service workerja / bajti teh); swZahtev/swKB: zahteve
// service workerja po omrežju (predpomnjenje v ozadju, fetch za stran). Po povezavi gre prenosKB + swKB.
export function povzemiZahteve(zahteve) {
  const out = { zahtev: 0, izSw: 0, mreznih: 0, prenosKB: 0, suroviKB: 0, swZahtev: 0, swKB: 0 };
  for (const z of zahteve) {
    if (z.odSw) {
      out.swZahtev++;
      out.swKB += (z.prenos || 0) / 1024;
      continue;
    }
    out.zahtev++;
    out.suroviKB += (z.surovo || 0) / 1024;
    if (z.izSw) out.izSw++;
    else {
      out.mreznih++;
      out.prenosKB += (z.prenos || 0) / 1024;
    }
  }
  for (const k of ["prenosKB", "suroviKB", "swKB"]) out[k] = Math.round(out[k]);
  return out;
}

// V strani (addInitScript): čas od pravega tapa (prvi zaupanja vreden pointerdown/click/keydown po začetku) do
// stanja »pripravljeno« in do interaktivnosti (zadnja dolga naloga ≥ 50 ms, nato 300 ms brez nove; window.__long iz
// PAGE_MERI v scripts/meri-hitrost.cjs). Stanja: »pot« (Učna pot uporabna), »vnos« (polje inštruktorja vidno in
// gumb Pošlji omogočen), »pogovor« (vsaj `min` odgovorov v pogovoru), »znak« (nov odgovor ima prvi znak besedila).
// Ob nalaganju beleži še window.__tPot: ms od začetka navigacije do uporabne Učne poti, in window.__tApp: do zagnanega app.js.
export function MERILNIK_PRIJAVLJEN() {
  const vidno = (el) => {
    if (!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    for (let x = el; x && x.nodeType === 1; x = x.parentElement) {
      if (x.hidden) return false;
      const cs = getComputedStyle(x);
      if (cs.display === "none" || cs.visibility === "hidden") return false;
    }
    return true;
  };
  const odgovori = () => [...document.querySelectorAll("#messages .msg.assistant")];
  const besediloOdgovora = (el) => {
    if (!el) return "";
    const k = el.cloneNode(true);
    k.querySelectorAll(".wait-note").forEach((w) => w.remove());
    return k.textContent.trim();
  };
  const STANJA = {
    pot: () => [...document.querySelectorAll("#view-path #xp-card .hero")].some(vidno),
    vnos: () => vidno(document.querySelector("#view-chat #input")) && !document.querySelector("#input").disabled && !document.querySelector("#send")?.disabled,
    pogovor: (o) => odgovori().filter(vidno).length >= o.min,
    znak: (o) => odgovori().length > o.prej && besediloOdgovora(odgovori().at(-1)).length > 0,
    // Meritev klikov (del »kliki«): vsaj o.min (1) vidnih elementov o.sel, vsaj eden z besedilom o.besedilo, in noben
    // viden o.brez; o.vse: več takih pogojev hkrati. (Brez new Function: CSP strani ne dovoli eval.)
    sel: (o) => {
      const v = [...document.querySelectorAll(o.sel)].filter(vidno);
      if (v.length < (o.min || 1)) return false;
      if (o.besedilo && !v.some((el) => el.textContent.includes(o.besedilo))) return false;
      return !o.brez || ![...document.querySelectorAll(o.brez)].some(vidno);
    },
    vse: (o) => o.vse.every((x) => STANJA.sel(x)),
  };
  window.__tPot = null;
  // Največji premiki postavitve z izvorom (kateri element se je premaknil), za iskanje vzroka CLS.
  window.__premiki = [];
  const oznaka = (n) =>
    n && n.nodeType === 1 ? n.tagName.toLowerCase() + (n.id ? "#" + n.id : "") + (typeof n.className === "string" && n.className ? "." + n.className.trim().split(/\s+/)[0] : "") : null;
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries())
        if (!e.hadRecentInput) window.__premiki.push({ t: Math.round(e.startTime), v: Math.round(e.value * 1000) / 1000, izvor: (e.sources || []).map((x) => oznaka(x.node)).filter(Boolean).slice(0, 3) });
    }).observe({ type: "layout-shift", buffered: true });
  } catch {}
  // window.__tApp: app.js zagnan (ni več posnetka ali Učne poti s strežnika, server/pot-takoj.js; dotik se izvede takoj).
  window.__tApp = null;
  const appPot = () => !document.documentElement.hasAttribute("data-zacetek") && [...document.querySelectorAll("main#view-path:not([data-posnetek]) #xp-card .hero")].some(vidno);
  const nalaganje = () => {
    if (window.__tPot === null && document.body && STANJA.pot()) window.__tPot = performance.now();
    if (window.__tApp === null && document.body && appPot()) window.__tApp = performance.now();
    if (window.__tPot === null || window.__tApp === null) requestAnimationFrame(nalaganje);
  };
  requestAnimationFrame(nalaganje);
  window.__prijavljenStanje = (ime, o = {}) => STANJA[ime](o);
  window.__cakaj = (ime, o = {}) =>
    new Promise((resolve) => {
      const zacetek = performance.now();
      // o.odZdaj: korak brez tapa (tipka Nazaj telefona, history.back()): čas teče od dogodka popstate.
      let t0 = null;
      const ob = (e) => {
        if (t0 === null && (e.isTrusted || (o.odZdaj && e.type === "popstate"))) t0 = e.timeStamp;
      };
      const VRSTE = o.odZdaj ? ["popstate"] : ["pointerdown", "click", "keydown"];
      for (const v of VRSTE) addEventListener(v, ob, true);
      let tReady = null;
      // INP tega klika: najdaljši dogodek interakcije (Event Timing, window.__vitali iz VITALI), ki se je začel ob tapu.
      // Vnosi pridejo šele po naslednjem izrisu, zato ga preberemo ob koncu (po 300 ms brez dolgih nalog).
      const inp = () => {
        const x = (window.__vitali?.interakcije || []).filter((e) => t0 !== null && e[2] >= t0 - 2);
        return x.length ? Math.max(...x.map((e) => e[1])) : null;
      };
      const konec = (r) => {
        for (const v of VRSTE) removeEventListener(v, ob, true);
        resolve({ ...r, inp: inp() });
      };
      const tick = () => {
        const zdaj = performance.now();
        if (t0 !== null && tReady === null && STANJA[ime](o)) tReady = zdaj - t0;
        if (tReady !== null) {
          const zadnja = Math.max(0, ...(window.__long || []).filter((x) => x > t0)) - t0;
          const doneAt = Math.max(tReady, zadnja);
          if (zdaj - t0 - doneAt > 300) return konec({ pripravljeno: Math.round(tReady), interaktivno: Math.round(doneAt) });
        }
        if (zdaj - zacetek > (o.rok || 60_000)) return konec({ pripravljeno: tReady === null ? null : Math.round(tReady), interaktivno: null, rok: true, tap: t0 !== null });
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
}

// Posrednik HTTP/2 s TLS pred strežnikom (HTTP/1.1): produkcija gre prek HTTP/2, kjer si ~170 zahtev deli eno povezavo;
// HTTP/1.1 ima v brskalniku največ 6 povezav na strežnik, kar na Slow 4G (0,56 s na krog) zahteve postavi v vrsto.
// Samopodpisano potrdilo (openssl) za 127.0.0.1; brskalnik mu zaupa z --ignore-certificate-errors-spki-list=<spki>
// (tako service worker deluje, kar z ignoreHTTPSErrors ne bi). Vrne { base, spki, ustavi }.
export async function zazeniHttp2Posrednik({ cilj, mapa }) {
  const [{ spawnSync }, fs, http, http2, path, crypto] = await Promise.all(
    ["node:child_process", "node:fs", "node:http", "node:http2", "node:path", "node:crypto"].map((m) => import(m)),
  );
  const key = path.join(mapa, "posrednik.key");
  const crt = path.join(mapa, "posrednik.crt");
  const args = ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", key, "-out", crt, "-days", "2", "-subj", "/CN=127.0.0.1", "-addext", "subjectAltName=IP:127.0.0.1"];
  const r = spawnSync("openssl", args, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`openssl: ${r.stderr || r.error}`);
  const cert = fs.readFileSync(crt);
  const spki = crypto.createHash("sha256").update(new crypto.X509Certificate(cert).publicKey.export({ type: "spki", format: "der" })).digest("base64");
  const gor = new URL(cilj);
  const agent = new http.Agent({ keepAlive: true, maxSockets: 64 });
  const PREC = new Set(["connection", "keep-alive", "transfer-encoding", "upgrade", "proxy-connection", "http2-settings"]);
  const srv = http2.createSecureServer({ key: fs.readFileSync(key), cert });
  srv.on("stream", (stream, h) => {
    const glave = {};
    for (const [k, v] of Object.entries(h)) if (!k.startsWith(":") && !PREC.has(k)) glave[k] = v;
    glave.host = h[":authority"];
    glave["x-forwarded-proto"] = "https";
    let koncano = false;
    const req = http.request({ host: gor.hostname, port: gor.port, method: h[":method"], path: h[":path"], headers: glave, agent }, (res) => {
      res.on("end", () => (koncano = true));
      const out = { ":status": res.statusCode };
      for (const [k, v] of Object.entries(res.headers)) if (!PREC.has(k)) out[k] = v;
      if (stream.destroyed) return res.destroy();
      stream.respond(out);
      res.pipe(stream);
    });
    req.on("error", () => stream.destroyed || stream.close(http2.constants.NGHTTP2_INTERNAL_ERROR));
    stream.on("close", () => koncano || req.destroy()); // prekinjen tok (SSE, zaprta stran): prekini tudi zahtevo
    stream.on("error", () => req.destroy()); // brskalnik prekine tok (RST_STREAM): brez tega bi napaka ustavila meritev
    stream.pipe(req);
  });
  srv.on("sessionError", () => {});
  await new Promise((res) => srv.listen(0, "127.0.0.1", res));
  return {
    base: `https://127.0.0.1:${srv.address().port}`,
    spki,
    ustavi: () =>
      new Promise((res) => {
        agent.destroy();
        srv.close(() => res());
        setTimeout(res, 2000);
      }),
  };
}
