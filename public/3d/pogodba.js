// Pogodba za modele iz kode (docs/3d.md): preverjanje `info` in tega, kar vrne `zgradi`. Brez uvozov, zato jo
// uporabljata pregledovalnik v brskalniku in test/atlas3d.test.js v Node (z three iz node_modules).
export const PODROCJA = ["celice", "organi", "sistemi", "kemija", "fizika", "matematika", "vesolje", "procesi"];
export const PREDMETI = ["BIO", "KEM", "FIZ", "MAT", "NAR"];
export const NADZOR = ["drsnik", "izbira", "gumb", "stikalo", "izpis"];

export function preveriInfo(info) {
  const napake = [];
  if (!info || typeof info !== "object") return ["manjka info"];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(info.id || "") || info.id.length > 60) napake.push(`id »${info.id}« mora biti ASCII z vezaji`);
  for (const k of ["naslov", "podrocje", "predmet", "opis"]) if (!info[k] || typeof info[k] !== "string") napake.push(`manjka ${k}`);
  if (info.podrocje && !PODROCJA.includes(info.podrocje)) napake.push(`neznano področje ${info.podrocje}`);
  if (info.predmet && !PREDMETI.includes(info.predmet)) napake.push(`neznan predmet ${info.predmet}`);
  if (info.merilo != null && !(info.merilo.m > 0 && typeof info.merilo.oznaka === "string")) napake.push("merilo potrebuje m > 0 in oznako");
  return napake;
}

// model = rezultat zgradi(THREE, ctx); vrne seznam napak (prazen = v redu).
export function preveriModel(model) {
  const napake = [];
  if (!model || typeof model !== "object") return ["zgradi ne vrne predmeta"];
  if (!model.group?.isObject3D) napake.push("manjka group (THREE.Group)");
  const ids = new Set();
  for (const d of Array.isArray(model.deli) ? model.deli : []) {
    if (!d.id || ids.has(d.id)) napake.push(`del brez id ali podvojen: ${d.id}`);
    ids.add(d.id);
    if (!d.ime) napake.push(`del ${d.id}: manjka ime`);
    if (!d.opis) napake.push(`del ${d.id}: manjka opis`);
    if (d.tocka != null && !(Array.isArray(d.tocka) && d.tocka.length === 3 && d.tocka.every(Number.isFinite))) napake.push(`del ${d.id}: tocka mora biti [x, y, z]`);
    if (d.meshes != null && !Array.isArray(d.meshes)) napake.push(`del ${d.id}: meshes mora biti seznam`);
  }
  if (model.deli != null && !Array.isArray(model.deli)) napake.push("deli mora biti seznam");
  const cids = new Set();
  for (const c of Array.isArray(model.nadzor) ? model.nadzor : []) {
    if (!NADZOR.includes(c.tip)) napake.push(`nadzor ${c.id}: neznan tip ${c.tip}`);
    if (!c.id || cids.has(c.id)) napake.push(`nadzor brez id ali podvojen: ${c.id}`);
    cids.add(c.id);
    if (!c.oznaka) napake.push(`nadzor ${c.id}: manjka oznaka`);
    if (c.tip === "drsnik" && !(c.min < c.max && Number.isFinite(c.vrednost))) napake.push(`nadzor ${c.id}: drsnik potrebuje min < max in vrednost`);
    if (c.tip === "izbira" && !(Array.isArray(c.moznosti) && c.moznosti.length >= 2)) napake.push(`nadzor ${c.id}: izbira potrebuje vsaj dve možnosti`);
    else if (c.tip === "izbira" && !c.moznosti.every((o) => Array.isArray(o) && o.length === 2 && o[1])) napake.push(`nadzor ${c.id}: možnost mora biti [ključ, oznaka]`);
    if (c.vidno != null && typeof c.vidno !== "function") napake.push(`nadzor ${c.id}: vidno mora biti funkcija`);
    if (c.tip === "izpis" && typeof c.vrednost !== "function") napake.push(`nadzor ${c.id}: izpis potrebuje vrednost()`);
    if (["drsnik", "izbira", "gumb", "stikalo"].includes(c.tip) && typeof c.ob !== "function") napake.push(`nadzor ${c.id}: manjka ob()`);
  }
  if (model.luci != null && typeof model.luci !== "boolean") napake.push("luci mora biti true ali false");
  for (const k of ["korak", "izberi", "dispose"]) if (model[k] != null && typeof model[k] !== "function") napake.push(`${k} mora biti funkcija`);
  return napake;
}

// Viri področja: oblika {viri: [{id, ime, avtor, opis, licenca, licencaUrl?, url?, datoteke?}], izkljuceno?}
// ali kratek seznam [{ime, za, licenca, url}]. Modeli v kodi področja so lastno delo Evklida.
export function normalizirajViri(d, podrocje = null) {
  if (!d) return { viri: [], izkljuceno: [] };
  const vrstice = Array.isArray(d)
    ? d.map((v, i) => ({ id: `${podrocje || "vir"}-${i + 1}`, ime: v.ime, avtor: v.avtor || v.ime, opis: v.opis || v.za || "", licenca: v.licenca, url: v.url }))
    : d.viri || [];
  const viri = [...vrstice];
  if (podrocje && !viri.some((v) => (v.datoteke || []).some((p) => p.startsWith(`${podrocje}/`) && p.endsWith(".js")))) {
    viri.push({ id: `${podrocje}-evklid`, ime: "Evklid", avtor: "Evklid", opis: "Modeli, narejeni v kodi", licenca: "CC BY-SA 4.0", datoteke: [`${podrocje}/*.js`] });
  }
  return { viri, izkljuceno: Array.isArray(d) ? [] : d.izkljuceno || [] };
}
