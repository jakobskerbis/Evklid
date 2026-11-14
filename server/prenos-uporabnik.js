// Prenosi z naslova, ki ga vpiše uporabnik (točka A4): en modul za vse take prenose (zdaj uvoz koledarja .ics,
// server/schedule.js). Samo https na vratih 443, brez uporabniškega imena in gesla, samo javni naslovi, brez
// preusmeritev, z mejo velikosti (tudi po razširjanju gzip/br) in časa.
// Naslov se preveri tudi ob samem povezovanju (lookup v https.request), ne samo pred njim: DNS rebinding (ob drugem
// poizvedovanju drug, zaseben odgovor) zato ne pomaga. Napake imajo code: ZASEBNI, NI_NASLOVA, PREVELIK, STATUS, NASLOV, CAS (rok).
import https from "node:https";
import net from "node:net";
import zlib from "node:zlib";
import dns from "node:dns/promises";

export const PRENOS_MAX = 3 * 1024 * 1024;
const napaka = (code, sporocilo, extra = {}) => Object.assign(new Error(sporocilo), { code, ...extra });
const prevelik = () => napaka("PREVELIK", "Odgovor je prevelik.");

function privateIpv4(ip) {
  const [a, b, c] = ip.split(".").map(Number);
  return (
    a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) || a >= 224 ||
    (a === 192 && b === 0 && (c === 0 || c === 2)) || (a === 198 && (b === 18 || b === 19)) || (a === 198 && b === 51 && c === 100) || (a === 203 && b === 0 && c === 113)
  );
}

// IPv6 v 8 skupin po 16 bitov (tudi oblika z IPv4 na koncu, npr. ::ffff:127.0.0.1); null, če ni veljaven naslov.
function ipv6Groups(ip) {
  let v = ip.toLowerCase().replace(/%.*$/, "");
  const v4 = /(\d+\.\d+\.\d+\.\d+)$/.exec(v);
  if (v4) {
    if (!net.isIPv4(v4[1])) return null;
    const [a, b, c, d] = v4[1].split(".").map(Number);
    v = v.slice(0, -v4[1].length) + ((a << 8) | b).toString(16) + ":" + ((c << 8) | d).toString(16);
  }
  const halves = v.split("::");
  if (halves.length > 2) return null;
  const part = (h) => (h ? h.split(":") : []);
  const head = part(halves[0]);
  const tail = halves.length === 2 ? part(halves[1]) : [];
  const fill = halves.length === 2 ? 8 - head.length - tail.length : 0;
  if (fill < 0 || (halves.length === 1 && head.length !== 8)) return null;
  const groups = [...head, ...Array(fill).fill("0"), ...tail].map((g) => (/^[0-9a-f]{1,4}$/.test(g) ? parseInt(g, 16) : NaN));
  return groups.length === 8 && groups.every((g) => g >= 0) ? groups : null;
}
const v4From = (hi, lo) => [hi >> 8, hi & 255, lo >> 8, lo & 255].join(".");

// Zasebni, posebni in prevajani naslovi. IPv6, ki nosi naslov IPv4 (preslikan ::ffff:…, združljiv ::a.b.c.d,
// 6to4 2002::), se preveri po vgrajenem naslovu IPv4 v vseh zapisih (tudi šestnajstiško, ::ffff:7f00:1);
// NAT64 (64:ff9b::/96, 64:ff9b:1::/48) in Teredo (2001::/32) sta zavrnjena v celoti (točka 1.3).
export function privateIp(ip) {
  if (net.isIPv4(ip)) return privateIpv4(ip);
  const g = ipv6Groups(String(ip));
  if (!g) return true; // česar ne razumemo, ni javno
  const zeros = (n) => g.slice(0, n).every((x) => x === 0);
  if (zeros(5) && g[5] === 0xffff) return privateIpv4(v4From(g[6], g[7])); // ::ffff:a.b.c.d
  if (zeros(4) && g[4] === 0xffff && g[5] === 0) return privateIpv4(v4From(g[6], g[7])); // ::ffff:0:a.b.c.d (SIIT)
  if (zeros(6)) return true; // ::, ::1 in zastareli ::a.b.c.d
  if (g[0] === 0x64 && g[1] === 0xff9b) return true; // NAT64
  if (g[0] === 0x2001 && g[1] === 0) return true; // Teredo
  if (g[0] === 0x2002) return privateIpv4(v4From(g[1], g[2])); // 6to4
  if ((g[0] & 0xfe00) === 0xfc00) return true; // fc00::/7 (ULA)
  if ((g[0] & 0xffc0) === 0xfe80 || (g[0] & 0xffc0) === 0xfec0) return true; // povezava, star site-local
  if ((g[0] & 0xff00) === 0xff00) return true; // multicast
  if (g[0] === 0x2001 && g[1] === 0xdb8) return true; // dokumentacija
  return false;
}

// Telo odgovora prebere po kosih in prekine, ko preseže mejo (ne prebere vsega v pomnilnik pred preverjanjem).
export async function readLimited(res, max = PRENOS_MAX) {
  if (Number(res.headers?.get?.("content-length")) > max) throw prevelik();
  if (!res.body?.getReader) {
    const text = await res.text();
    if (Buffer.byteLength(text) > max) throw prevelik();
    return text;
  }
  const reader = res.body.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel().catch(() => {});
      throw prevelik();
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

// Seznam naslovov za ime strežnika: vsi morajo biti javni.
async function javniNaslovi(host, lookup) {
  const list = (await Promise.resolve(lookup(host, { all: true })).catch(() => [])).filter((a) => a?.address);
  if (!list.length) throw napaka("NI_NASLOVA", "Strežnika na tej povezavi ni mogoče najti.");
  if (list.some((a) => privateIp(a.address))) throw napaka("ZASEBNI", "Ta naslov ni javen.");
  return list.map((a) => ({ address: a.address, family: a.family || (net.isIPv6(a.address) ? 6 : 4) }));
}

// lookup za https.request: isto preverjanje ob povezovanju (Node ga kliče z all: true ali brez).
const pripetLookup = (lookup) => (host, options, cb) => {
  javniNaslovi(host, lookup).then(
    (list) => (options?.all ? cb(null, list) : cb(null, list[0].address, list[0].family)),
    (err) => cb(err),
  );
};

// Telo odgovora https.request po kosih (po razširjanju), prekine nad mejo. Izvoženo za teste.
export function beriTok(res, max) {
  return new Promise((ok, ne) => {
    const enc = String(res.headers["content-encoding"] || "").toLowerCase().trim();
    const tok = enc === "gzip" || enc === "x-gzip" ? res.pipe(zlib.createGunzip()) : enc === "br" ? res.pipe(zlib.createBrotliDecompress()) : enc === "deflate" ? res.pipe(zlib.createInflate()) : res;
    const kosi = [];
    let velikost = 0;
    // Najprej zavrne s pravim razlogom: res.destroy() takoj sproži »aborted«, ki bi sicer zavrnil s »prekinjen«.
    const konec = (err) => {
      ne(err);
      res.destroy();
      if (tok !== res) tok.destroy();
    };
    tok.on("data", (d) => {
      velikost += d.length;
      if (velikost > max) return konec(prevelik());
      kosi.push(d);
    });
    tok.on("end", () => ok(new TextDecoder().decode(Buffer.concat(kosi))));
    tok.on("error", konec);
    res.on("error", konec);
    res.on("aborted", () => konec(napaka("STATUS", "Prenos je bil prekinjen.")));
  });
}

// Prenese besedilo z javnega naslova https. fetchFn: samo za teste (brez pripetega naslova ob povezovanju).
export async function prenesiJavno(url, { max = PRENOS_MAX, timeoutMs = 15000, headers = {}, lookup = dns.lookup, fetchFn = null } = {}) {
  let u;
  try {
    u = new URL(url);
  } catch {
    throw napaka("NASLOV", "Povezava ni veljavna.");
  }
  if (u.protocol !== "https:" || u.username || u.password || (u.port && u.port !== "443")) throw napaka("NASLOV", "Povezava mora biti javni naslov https.");
  const host = u.hostname.replace(/^\[|\]$/g, "");
  // En rok za vse: tudi počasno iskanje naslova (DNS) šteje v čas prenosa.
  const signal = AbortSignal.timeout(timeoutMs);
  if (net.isIP(host)) {
    if (privateIp(host)) throw napaka("ZASEBNI", "Ta naslov ni javen.");
  } else {
    // prej, za jasno sporočilo; ob povezovanju še enkrat
    const potekel = new Promise((_, ne) => signal.addEventListener("abort", () => ne(napaka("CAS", "Prenos je trajal predolgo.")), { once: true }));
    await Promise.race([javniNaslovi(host, lookup), potekel]);
  }
  if (signal.aborted) throw napaka("CAS", "Prenos je trajal predolgo.");
  if (fetchFn) {
    const res = await fetchFn(u.toString(), { redirect: "error", signal, headers });
    if (!res.ok) throw napaka("STATUS", `Strežnik je odgovoril ${res.status}.`, { status: res.status });
    return readLimited(res, max);
  }
  return new Promise((ok, ne) => {
    let odgovor = false;
    const req = https.request(u, { method: "GET", headers: { "accept-encoding": "gzip, deflate, br", ...headers }, lookup: pripetLookup(lookup), signal }, (res) => {
      odgovor = true;
      // Preusmeritev ne sledimo (cilj bi šel mimo preverjanja); vsak odgovor razen 2xx je napaka.
      if (res.statusCode < 200 || res.statusCode >= 300) {
        res.destroy(); // ne beremo naprej (neskončno telo bi sicer teklo do roka)
        return ne(napaka("STATUS", `Strežnik je odgovoril ${res.statusCode}.`, { status: res.statusCode }));
      }
      if (Number(res.headers["content-length"]) > max) {
        res.destroy();
        return ne(prevelik());
      }
      beriTok(res, max).then(ok, ne);
    });
    req.on("error", ne);
    // 101 (menjava protokola): ni odgovora, ni napake; brez tega obljuba ne bi bila nikoli razrešena.
    req.on("upgrade", (res, sock) => {
      odgovor = true;
      sock.destroy();
      ne(napaka("STATUS", `Strežnik je odgovoril ${res.statusCode}.`, { status: res.statusCode }));
    });
    // Zaprto brez odgovora in brez napake: zavrni (po odgovoru telo obravnava beriTok).
    req.on("close", () => {
      if (!odgovor) ne(napaka("STATUS", "Prenos je bil prekinjen."));
    });
    req.end();
  });
}
