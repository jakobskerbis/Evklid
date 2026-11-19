// Čakalna vrsta za AI (točka 23 načrta izboljšav, j 19. 11. 2026): ob navalu učenec vidi »Si v vrsti (mesto N)«
// namesto zamrznitve.
//
// Največ EVKLID_AI_SOCASNO odgovorov inštruktorja hkrati (privzeto 24; 0 = brez meje) dela z modelom: vse klice modela za
// eno sporočilo (povzetek, odgovor s krogi orodij, ponovni odgovor po sodbi, pregled, popravek) drži eno mesto. Ostali
// čakajo po vrstnem redu prihoda (FIFO) in dobijo svoje mesto v vrsti takoj ob vstopu ter ob vsaki spremembi (največ
// enkrat na razmikMs). Kdor čaka dlje od EVKLID_AI_VRSTA_MS (privzeto 90 s; 0 = brez čakanja), dobi isto napako kot ob
// preobremenjenem ponudniku (529, server/claude.js errorText); prekinjena povezava zapusti vrsto takoj.
// Mesto se vedno sprosti (sprosti() je varna za večkratni klic; server/app.js jo kliče tudi v finally).
// Vrsta je v procesu: en strežnik (Render), brez skupnega stanja med procesi.
import "./env.js";

const num = (k, d) => {
  const v = Number(process.env[k]);
  return process.env[k] !== undefined && process.env[k] !== "" && Number.isFinite(v) && v >= 0 ? v : d;
};

export const AI_SOCASNO = () => Math.floor(num("EVKLID_AI_SOCASNO", 24));
export const AI_VRSTA_MS = () => num("EVKLID_AI_VRSTA_MS", 90_000);

// Napaka po predolgem čakanju: status 529 kot pri preobremenjenem ponudniku; apiErrorCode jo prepozna po »vrsta«.
export const napakaVrste = () => Object.assign(new Error("čakanje v vrsti za AI je predolgo"), { status: 529, vrsta: true });

const napakaPrekinitve = (signal) => {
  const r = signal?.reason;
  return r instanceof Error ? r : Object.assign(new Error("aborted"), { name: "AbortError" });
};

/**
 * Vrsta z mejo hkratnih mest.
 * vstopi({ signal, onMesto }) → Promise<{ sprosti(), cakal }>: takoj, če je mesto prosto in nihče ne čaka; sicer ko
 * pride na vrsto. onMesto(n) (n = 1 je naslednji) takoj ob vstopu v vrsto in ob vsaki spremembi mesta.
 * Zavrne z napakaVrste() po cakanjeMs ali z napako prekinitve ob signal.abort().
 */
export function createVrsta({ socasno = AI_SOCASNO(), cakanjeMs = AI_VRSTA_MS(), razmikMs = 1000 } = {}) {
  let aktivni = 0;
  const cakajo = [];

  const zasedi = () => {
    aktivni++;
    let prosto = false;
    return () => {
      if (prosto) return;
      prosto = true;
      aktivni--;
      naprej();
    };
  };
  function naprej() {
    while (aktivni < socasno && cakajo.length) cakajo.shift().sprejmi();
    cakajo.forEach((c, i) => c.mesto(i + 1));
  }

  function vstopi({ signal = null, onMesto = null } = {}) {
    if (signal?.aborted) return Promise.reject(napakaPrekinitve(signal));
    if (!(socasno > 0)) return Promise.resolve({ sprosti() {}, cakal: false });
    if (aktivni < socasno && !cakajo.length) return Promise.resolve({ sprosti: zasedi(), cakal: false });
    return new Promise((resolve, reject) => {
      let poslano = 0;
      let zadnjic = 0;
      let trenutno = 0;
      let odlog = null;
      const javi = (n) => {
        if (n === poslano) return;
        poslano = n;
        zadnjic = Date.now();
        try {
          onMesto?.(n);
        } catch (e) {
          console.warn(`[evklid] vrsta za AI: ${e?.message || e}`);
        }
      };
      const pocisti = () => {
        clearTimeout(rok);
        clearTimeout(odlog);
        signal?.removeEventListener("abort", ob);
      };
      const zapusti = (err) => {
        pocisti();
        const i = cakajo.indexOf(c);
        if (i >= 0) cakajo.splice(i, 1);
        naprej();
        reject(err);
      };
      const c = {
        sprejmi() {
          pocisti();
          resolve({ sprosti: zasedi(), cakal: true });
        },
        mesto(n) {
          trenutno = n;
          if (n === poslano || odlog) return;
          const cez = zadnjic + razmikMs - Date.now();
          if (cez <= 0) return javi(n);
          odlog = setTimeout(() => {
            odlog = null;
            javi(trenutno);
          }, cez);
        },
      };
      const ob = () => zapusti(napakaPrekinitve(signal));
      const rok = setTimeout(() => zapusti(napakaVrste()), cakanjeMs);
      signal?.addEventListener("abort", ob, { once: true });
      cakajo.push(c);
      javi(cakajo.length);
    });
  }

  return { vstopi, stanje: () => ({ aktivni, cakajo: cakajo.length, socasno }) };
}
