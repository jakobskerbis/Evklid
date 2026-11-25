// Datumi v besedilu: v slovenščini mesec v rodilniku (»do 23. novembra 2026«, »ponedeljek, 23. novembra«), kot ga
// zahteva pravopis; Intl ga piše v imenovalniku (»23. november 2026«). Drugi jeziki ostanejo pri Intl.
export const SL_MONTH = ["januarja", "februarja", "marca", "aprila", "maja", "junija", "julija", "avgusta", "septembra", "oktobra", "novembra", "decembra"];

/** Datum z Intl.DateTimeFormat(loc, opts); v slovenščini z mesecem v rodilniku. */
export function dateText(value, loc, opts = { day: "numeric", month: "long", year: "numeric" }) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const f = new Intl.DateTimeFormat(loc, opts);
  // Rodilnik samo z dnevom (»23. novembra«); sam mesec ostane v imenovalniku (»november 2026«).
  if (!/^sl\b/i.test(loc) || opts.month !== "long" || !opts.day) return f.format(d);
  // Mesec iz istih nastavitev (npr. timeZone: "UTC"), ne iz d.getMonth() v krajevnem času.
  const m = Number(new Intl.DateTimeFormat("en", { ...opts, month: "numeric" }).formatToParts(d).find((p) => p.type === "month").value);
  return f
    .formatToParts(d)
    .map((p) => (p.type === "month" ? SL_MONTH[m - 1] : p.value))
    .join("");
}

// Vrstica podatkov z ločilom »·« (»Osnovna šola 9. razred · NPZ · 29. 5. 2027 · še 185 dni«, A9): pred »·« je
// nedeljiv presledek, da se ločilo nikoli ne prelomi na začetek vrstice, datum s številkami (»29. 5. 2027«) pa ostane
// v eni vrstici. Za ločila »·« med podatki v besedilu, ne za množenje v formulah in nalogah.
export const NBSP = " ";
export const LOCILO = `${NBSP}· `;
/** Datum »29. 5. 2027« (tudi »29. 5.«) brez preloma: presledek za piko pred števko postane nedeljiv. */
export const celDatum = (s) => String(s ?? "").replace(/(\d\.) +(?=\d)/g, `$1${NBSP}`);
/** Deli, združeni z ločilom »·«: prazni izpadejo, datumi ostanejo celi. */
export const zdruzi = (deli) => deli.filter(Boolean).map(celDatum).join(LOCILO);
