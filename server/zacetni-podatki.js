// Začetni podatki Učne poti v prvem odgovoru strežnika (naloga hitrost, docs/meritve/prijavljen-mobilno-2026-11-19.md
// ugotovitev 2). Prijavljen učenec je ob prvem obisku na počasnem telefonu čakal 11,4 s: po zagonu app.js je sledila
// veriga klicev API (račun → profili → pogovori → učna pot …), vsak z enim krogom do strežnika (Slow 4G: 0,56 s).
// Zdaj strežnik iste odgovore vstavi v vstopno stran (<script type="application/json" id="evklid-zacetni">);
// public/zacetek.js jih da app.js namesto prvih klicev (evklidZacetek.vnaprej), kot je prej delal s klici vnaprej.
//
// Varnost in zasebnost:
// - Odgovori nastanejo z notranjo zahtevo GET skozi celo aplikacijo (iste poti, ista prijava, isto preverjanje
//   lastništva, zaklepa profila in naprave), z glavami in naslovom IP prvotne zahteve: vsebina je enaka, kot bi jo
//   brskalnik dobil s klicem API v tej seji, in nikoli podatki koga drugega. Uporabimo samo odgovore 200.
// - Samo za navigacijo brskalnika (Sec-Fetch-Dest: document) s piškotkom seje; ne za zahtevo service workerja
//   (namestitev shrani »/« za delo brez povezave) in ne za mobilni odjemalec API (glava X-App-Client).
// - Stran s temi podatki ima Cache-Control: no-store (server/vstopna-stran.js): ne shrani je noben predpomnilnik,
//   tudi service worker ne (public/sw.js privateRes), in nima ETag.
// - JSON je v <script type="application/json">; vsak »<«, »>«, »&«, U+2028 in U+2029 je ubežen (< …), zato
//   besedilo iz baze (ime, naslov pogovora) ne more končati elementa (</script>) ali odpreti komentarja.
// - Piškotek, ki ga notranja zahteva nastavi (npr. nova naprava), gre v odgovor strani, kot bi ga dobil klic API.
// Strošek: ~10 notranjih klicev na odprtje strani, ki bi jih sicer brskalnik takoj naredil sam (isto delo strežnika,
// brez TLS in glav HTTP); skupni rok 1,5 s za vse klice, nato stran z do takrat zbranimi podatki.
import http from "node:http";
import { jeFaks } from "../public/stopnja.js";
import { gamesOn } from "../public/games/stage.js";

const SEJA = /(?:^|;\s*)sm_session=[^;\s]/;
const NAPRAVA = /(?:^|;\s*)sm_device=[^;\s]{20,}/; // krajši žeton strežnik zavrže (server/accounts/devices.js)
const ROK_MS = 1500;
const NAJVEC = 256 * 1024; // večji odgovor (npr. zelo dolg seznam pogovorov) ostane klic API
// Glave prvotne zahteve, ki jih notranja zahteva ne podeduje: pogojne (304 brez telesa), stiskanje (telo je JSON).
const BREZ = new Set(["if-none-match", "if-modified-since", "if-match", "if-unmodified-since", "if-range", "range", "accept-encoding", "content-length", "content-type", "transfer-encoding"]);

// Ali je to navigacija brskalnika na stran (ne fetch, service worker ali mobilni odjemalec) s piškotkom seje.
export function zaZacetnePodatke(req) {
  if (req.method !== "GET") return false;
  if (req.headers["sec-fetch-dest"] !== "document" || req.headers["sec-fetch-mode"] !== "navigate") return false;
  if (req.headers["x-app-client"]) return false;
  // Predhodno nalaganje (prefetch, prerender) ni odprtje strani: ne zasede profila in ne šteje kot dejavnost.
  if (/prefetch|prerender/i.test(`${req.headers.purpose || ""} ${req.headers["sec-purpose"] || ""}`)) return false;
  const piskotki = String(req.headers.cookie || "");
  // Brez piškotka naprave bi vsak notranji klic ustvaril svojo napravo in profil zasedel za neobstoječo; app.js ga dobi sam.
  return SEJA.test(piskotki) && NAPRAVA.test(piskotki);
}

// Notranja zahteva GET skozi aplikacijo z glavami in naslovom prvotne zahteve. Vrne { status, body, cookies } ali null.
export function notranjiGet(app, req, url, rokMs = ROK_MS) {
  return new Promise((resolve) => {
    let konec = false;
    const done = (v) => {
      if (konec) return;
      konec = true;
      clearTimeout(t);
      resolve(v);
    };
    let s = null;
    let zaprt = false;
    const zapri = () => {
      if (zaprt || !s) return;
      zaprt = true;
      s.emit("finish");
      s.emit("close");
    };
    // Po roku: brez podatkov, odgovor pa zaprt (števec aktivnih zahtev v server/app.js se zmanjša tudi, če obdelava obvisi).
    const t = setTimeout(() => (done(null), zapri()), Math.max(1, rokMs));
    t.unref?.();
    try {
      const sock = req.socket || {};
      // Samo podatki povezave (IP za meje in isLocalRequest, šifriranje za req.secure); brez branja ali pisanja.
      const socket = { remoteAddress: sock.remoteAddress, remotePort: sock.remotePort, remoteFamily: sock.remoteFamily, encrypted: sock.encrypted, readable: false, writable: false, destroy() {}, end() {}, on() { return this; }, once() { return this; }, off() { return this; }, removeListener() { return this; }, setTimeout() { return this; }, pause() {}, resume() {} };
      const r = new http.IncomingMessage(socket);
      r.method = "GET";
      r.url = url;
      r.httpVersionMajor = 1;
      r.httpVersionMinor = 1;
      r.httpVersion = "1.1";
      const headers = {};
      for (const [k, v] of Object.entries(req.headers)) if (!BREZ.has(k)) headers[k] = v;
      Object.assign(headers, { accept: "application/json", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin" });
      r.headers = headers;
      r.complete = true;
      r.push(null);
      s = new http.ServerResponse(r);
      const chunks = [];
      const add = (c, enc) => {
        if (c == null || typeof c === "function") return;
        chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c, typeof enc === "string" ? enc : "utf8"));
      };
      s.write = (c, enc) => (add(c, enc), true);
      s.end = (c, enc) => {
        add(c, enc);
        if (!konec) {
          const raw = s.getHeader("set-cookie");
          const cookies = raw == null ? [] : [].concat(raw).map(String);
          done({ status: s.statusCode, type: String(s.getHeader("content-type") || ""), body: Buffer.concat(chunks), cookies });
        }
        // Poslušalci konca odgovora (števec aktivnih zahtev, dnevnik napak) se izvedejo kot pri pravi zahtevi.
        setImmediate(zapri);
        return s;
      };
      app.handle(r, s, () => (done(null), zapri()));
    } catch {
      done(null);
    }
  });
}

// Besedilo JSON za <script type="application/json">: brez znakov, ki bi lahko končali element ali komentar.
export const varenJson = (s) => String(s).replace(/[<>&\u2028\u2029]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);

// Naslovi poti, ki jih app.js ob odprtju Učne poti kliče za ta profil (public/app.js loadPath, refreshXp, refreshModes,
// showLevelCard, public/schedule.js, public/pilot-naloge.js, public/anketa-teden.js). Pot (path) je že znana.
function naslovi(s, pot) {
  const id = s.id;
  const st = s.settings || {};
  const uni = jeFaks(st);
  const out = [`/api/students/${id}/xp`, `/api/students/${id}/modes`, `/api/students/${id}/level-up`, `/api/students/${id}/schedule`, `/api/students/${id}/pilot`, `/api/students/${id}/anketa-teden`];
  if (pot?.key) out.push(`/api/students/${id}/modes?path=${encodeURIComponent(pot.key)}`);
  if (gamesOn(st)) out.push(`/api/students/${id}/daily`);
  if (uni) {
    if (st.study_program) out.push(`/api/paths?program=${encodeURIComponent(st.study_program)}`);
    out.push("/api/programs");
  } else out.push(`/api/paths?subject=${st.subject}&system=${encodeURIComponent(st.school_system || "SI")}`);
  return out;
}

// Podatki za vstopno stran ali null. Vrne { json (varen za <script>), cookies, student }.
export function zacetniPodatki(app) {
  return async (req) => {
    if (!zaZacetnePodatke(req)) return null;
    const d = {};
    const cookies = [];
    const rok = Date.now() + ROK_MS; // en skupni rok za vse klice: stran nikoli ne čaka dlje
    const get = async (url) => {
      const ostane = rok - Date.now();
      if (ostane <= 0) return null;
      const r = await notranjiGet(app, req, url, ostane);
      if (!r) return null;
      for (const c of r.cookies) if (!cookies.includes(c)) cookies.push(c);
      if (r.status !== 200 || !/json/i.test(r.type) || r.body.length > NAJVEC) return null;
      const txt = r.body.toString("utf8");
      d[url] = txt;
      return txt;
    };
    const parse = (txt) => {
      try {
        return txt == null ? null : JSON.parse(txt);
      } catch {
        return null;
      }
    };
    const status = parse(await get("/api/account/status"));
    // Seja ni (več) veljavna ali računi niso vklopljeni: app.js pokaže prijavo, podatkov ni.
    if (!status?.enabled || !status.logged_in) return cookies.length ? { json: null, cookies, student: null } : null;
    await get("/api/config");
    const list = parse(await get("/api/students"));
    // Profil, ki ga bo izbral app.js (loadStudents), je gotov samo, ko je en sam: pri več profilih je izbira v brskalniku
    // (localStorage), klic za drug profil pa bi ga na tej napravi zasedel (server/accounts/devices.js).
    const s = Array.isArray(list) && list.length === 1 && !list[0].locked && !list[0].needs_password ? list[0] : null;
    if (s && Number.isInteger(s.id)) {
      await get(`/api/students/${s.id}/conversations`);
      const pot = parse(await get(`/api/students/${s.id}/path`));
      for (const url of naslovi(s, pot)) await get(url);
    }
    const parts = Object.entries(d).map(([url, txt]) => `${JSON.stringify(url)}:${txt}`);
    const json = varenJson(`{"s":${s ? s.id : "null"},"d":{${parts.join(",")}}}`);
    return { json, cookies, student: s ? s.id : null };
  };
}
