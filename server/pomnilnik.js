// Pomnilnik strežnika za Stražo (točka D4, master brief j 13. 11.): delež porabe od meje gostovanja.
// Render starter ima mejo 512 MB za ves vsebnik (strežnik in podprocesi: SymPy, meritev po objavi); ob preseženi
// meji proces ubije. Straža (scripts/straza.mjs) vsakih 15 min prebere /healthz/stanje in opozori (delovni tok pade,
// lastnik dobi e-pošto), če je bil delež v zadnjih 30 minutah nad 85 %. Vzorec vsakih 10 s, da kratkega vrha med
// dvema pregledoma Straže ne zgrešimo.
import { readFileSync } from "node:fs";
import os from "node:os";

export const OPOZORILO_DELEZ = 85; // %, nad tem Straža opozori
export const OKNO_MS = 30 * 60_000; // dvakrat razmik med pregledi Straže (zagoni v GitHubu zamujajo)
const VZOREC_MS = 10_000;
const MB = 1024 * 1024;
const VELIKO = 2 ** 50; // »max« ali ogromno število v cgroup = brez meje

const stevilo = (beri, f) => {
  try {
    const n = Number(beri(f).trim());
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
};
const izStat = (beri, f, kljuc) => {
  try {
    const m = new RegExp(`^${kljuc} (\\d+)$`, "m").exec(beri(f));
    return m ? Number(m[1]) : 0;
  } catch {
    return 0;
  }
};

// Meja in poraba. EVKLID_POMNILNIK_MB (če je nastavljen) prepiše mejo; meja iz cgroup ni večja od pomnilnika stroja.
// Kjer je meja iz cgroup, je poraba iz istega cgroup (vsi procesi vsebnika, tudi SymPy in meritev po objavi), in sicer
// samo pomnilnik, ki ga jedro ne more sprostiti (anon + shmem): predpomnilnik datotek (npr. po nočni varnostni kopiji
// baze) bi sicer kazal visoko porabo brez nevarnosti. Brez meje v cgroup: RSS strežnika.
export function virPomnilnika({ beri = (f) => readFileSync(f, "utf8"), env = process.env, rss = () => process.memoryUsage.rss(), skupaj = os.totalmem() } = {}) {
  const izOkolja = Number(env.EVKLID_POMNILNIK_MB) > 0 ? Number(env.EVKLID_POMNILNIK_MB) * MB : null;
  const mejaCg = (n) => izOkolja ?? Math.min(n, skupaj || n);
  const v2 = stevilo(beri, "/sys/fs/cgroup/memory.max");
  if (v2 && v2 < VELIKO && stevilo(beri, "/sys/fs/cgroup/memory.current") != null) {
    const visoka = stevilo(beri, "/sys/fs/cgroup/memory.high");
    const stat = "/sys/fs/cgroup/memory.stat";
    return { meja: mejaCg(visoka && visoka < v2 ? visoka : v2), vir: "cgroup", poraba: () => izStat(beri, stat, "anon") + izStat(beri, stat, "shmem") || rss() };
  }
  const v1 = stevilo(beri, "/sys/fs/cgroup/memory/memory.limit_in_bytes");
  if (v1 && v1 < VELIKO && stevilo(beri, "/sys/fs/cgroup/memory/memory.usage_in_bytes") != null) {
    const stat = "/sys/fs/cgroup/memory/memory.stat";
    return { meja: mejaCg(v1), vir: "cgroup", poraba: () => izStat(beri, stat, "total_rss") + izStat(beri, stat, "total_shmem") || rss() };
  }
  return { meja: izOkolja ?? 512 * MB, vir: "rss", poraba: rss };
}

// Sledi največji porabi v zadnjem oknu (vzorci po 10 s). Branje stanja vzorca ne shrani (javna pot ne more
// napihniti seznama). poraba, now in meja so za teste.
export function createPomnilnik({ vir = virPomnilnika(), poraba = vir.poraba, now = Date.now, meja = vir.meja, zacni = true } = {}) {
  const vzorci = []; // [čas, bajti], največ OKNO_MS / VZOREC_MS
  const pocisti = (t) => {
    while (vzorci.length && vzorci[0][0] < t - OKNO_MS) vzorci.shift();
  };
  const vzorec = () => {
    const t = now();
    vzorci.push([t, poraba()]);
    pocisti(t);
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
      const zdaj = poraba();
      pocisti(now());
      let najvec = zdaj;
      for (const [, b] of vzorci) if (b > najvec) najvec = b;
      return { mb: Math.round(zdaj / MB), mejaMb: Math.round(meja / MB), delez: delez(zdaj), najvecDelez: delez(najvec), oknoMin: OKNO_MS / 60_000, opozorilo: OPOZORILO_DELEZ, vir: vir.vir };
    },
  };
}
