// Med objavo nove različice je strežnik ~1 minuto ustavljen (Render s trajnim diskom) in gostitelj vrne
// stran 502/503 brez JSON. Takrat zahtevo tiho ponovimo, vmesnik pa pokaže »Evklid se posodablja …«.
// Ponovimo le, ko je gostitelj odgovoril (zahteva ni prišla do našega strežnika); neuspel fetch pomeni
// brez povezave (vrne null) in gre takoj na vaje brez povezave. Enako dela mobile/src/lib/api.ts.
export const BUSY_WAIT = [2000, 3000, 5000, 8000, 10000, 12000, 15000, 15000]; // skupaj ~70 s

export async function fetchThroughRestart(url, init, { busy, fetchFn = fetch, wait = (ms) => new Promise((r) => setTimeout(r, ms)), delays = BUSY_WAIT } = {}) {
  for (let i = 0; ; i++) {
    let res;
    try {
      res = await fetchFn(url, init);
    } catch {
      return null;
    }
    if (!busy(res) || i >= delays.length) return res;
    await wait(delays[i]);
  }
}
