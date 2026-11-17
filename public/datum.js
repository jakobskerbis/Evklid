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
