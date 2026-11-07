// Telo odgovora vedno preberemo ali zavržemo. Neprebrano telo odgovora s »Cache-Control: no-store« (vse /api in
// /healthz) Chrome drži odprto, dokler ga ne pobere smetar: zahteva v orodjih za razvijalce ostane »pending« in
// stran ne doseže »networkidle« (preveri-aplikacijo, posnetki). Klasične skripte (theme.js, starsi.js) ga naložijo z import().
export function zavrzi(r) {
  try {
    r?.body?.cancel().catch(() => {});
  } catch {
    /* telo je že prebrano ali zaklenjeno */
  }
}

// JSON uspešnega odgovora, sicer `privzeto` (telo napake zavrženo).
export function jsonAliNic(r, privzeto = null) {
  if (r.ok) return r.json();
  zavrzi(r);
  return privzeto;
}
