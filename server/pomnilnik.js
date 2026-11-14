// Pomnilnik strežnika za Stražo (točka D4, master brief j 13. 11.): delež porabe (RSS) od meje gostovanja.
// Render starter ima mejo 512 MB; ob preseženi meji proces ubije. Straža (scripts/straza.mjs) vsakih 15 min prebere
// /healthz/stanje in opozori (delovni tok pade, lastnik dobi e-pošto), če je bil delež v zadnjih 15 minutah nad 85 %.
// Vzorec vsakih 10 s, da kratkega vrha med dvema pregledoma Straže ne zgrešimo.
import { readFileSync } from "node:fs";

export const OPOZORILO_DELEZ = 85; // %, nad tem Straža opozori
export const OKNO_MS = 15 * 60_000; // kot razmik med pregledi Straže
const VZOREC_MS = 10_000;
const MB = 1024 * 1024;

// Meja v bajtih: cgroup v2 (memory.max), cgroup v1, sicer EVKLID_POMNILNIK_MB, sicer 512 MB (Render starter).
export function mejaPomnilnika({ beri = (f) => readFileSync(f, "utf8"), env = process.env } = {}) {
  for (const f of ["/sys/fs/cgroup/memory.max", "/sys/fs/cgroup/memory/memory.limit_in_bytes"]) {
    try {
      const n = Number(beri(f).trim());
      if (Number.isFinite(n) && n > 0 && n < 2 ** 50) return n; // »max« ali ogromno število = brez meje
    } catch {}
  }
  const mb = Number(env.EVKLID_POMNILNIK_MB);
  return (Number.isFinite(mb) && mb > 0 ? mb : 512) * MB;
}

// Sledi največjemu RSS v zadnjem oknu (vzorci po 10 s). rss in now sta za teste.
export function createPomnilnik({ rss = () => process.memoryUsage.rss(), now = Date.now, meja = mejaPomnilnika(), zacni = true } = {}) {
  const vzorci = []; // [čas, rss]
  const vzorec = () => {
    const t = now();
    vzorci.push([t, rss()]);
    while (vzorci.length && vzorci[0][0] < t - OKNO_MS) vzorci.shift();
  };
  let tik = null;
  if (zacni) {
    tik = setInterval(vzorec, VZOREC_MS);
    tik.unref();
  }
  const delez = (b) => Math.round((b / meja) * 100);
  return {
    vzorec,
    ustavi: () => tik && clearInterval(tik),
    // Za javni /healthz/stanje: samo zaokrožena števila, brez podrobnosti procesa.
    stanje() {
      vzorec();
      const zdaj = vzorci.at(-1)[1];
      const najvec = Math.max(...vzorci.map((v) => v[1]));
      return { rssMb: Math.round(zdaj / MB), mejaMb: Math.round(meja / MB), delez: delez(zdaj), najvecDelez15min: delez(najvec), opozorilo: OPOZORILO_DELEZ };
    },
  };
}
