// Seznam preparatov mikroskopa (docs/mikroskop.md): id → datoteka in izvoz. Datoteka s senčilnikom se naloži šele ob
// izbiri (dinamični import), zato so tu imena za izbirnik. test/mikroskop.test.js preveri, da se seznam ujema z datotekami.
export const SKUPINE = [
  ["celice", "Celice in mikrobi"],
  ["rastline", "Rastline"],
  ["tkiva", "Osnovna tkiva"],
  ["organi", "Organi"],
  ["cutila", "Oko in zob"],
  ["virusi", "Virusi (samo TEM)"],
];

// [id, datoteka, izvoz, ime, skupina]
const P = [
  ["ustne", "celice", "ustne", "Celice ustne sluznice", "celice"],
  ["kri", "kost-kri", "kri", "Krvni razmaz", "celice"],
  ["bakterije", "celice", "bakterije", "Bakterije (barvanje po Gramu)", "celice"],
  ["kvasovke", "celice", "kvasovke", "Kvasovke", "celice"],
  ["kapljica", "celice", "kapljica", "Kapljica vode iz ribnika", "celice"],
  ["cebula", "celice", "cebula", "Povrhnjica čebule", "rastline"],
  ["list", "celice", "list", "List (prečni prerez)", "rastline"],
  ["reza", "celice", "reza", "Listna povrhnjica z režami", "rastline"],
  ["koren", "celice", "koren", "Koreninski vršiček (mitoza)", "rastline"],
  ["steblo", "celice", "steblo", "Steblo (prečni prerez)", "rastline"],
  ["kost", "kost-kri", "kost", "Kompaktna kost", "tkiva"],
  ["hrustanec", "vezivo", "hrustanec", "Hialini hrustanec", "tkiva"],
  ["kita", "vezivo", "kita", "Kita in vez", "tkiva"],
  ["vezivo", "vezivo", "vezivo", "Gosto neurejeno vezivo", "tkiva"],
  ["mascevje", "vezivo", "mascevje", "Maščevje", "tkiva"],
  ["skeletna-misica", "misice", "skeletna", "Skeletna mišica", "tkiva"],
  ["srcna-misica", "misice", "srcna", "Srčna mišica", "tkiva"],
  ["gladka-misica", "misice", "gladka", "Gladka mišica", "tkiva"],
  ["zivec", "snop", "zivec", "Periferni živec", "tkiva"],
  ["arterija", "snop", "arterija", "Arterija", "tkiva"],
  ["vena", "snop", "vena", "Vena", "tkiva"],
  ["koza", "koza-mozgani", "koza", "Koža", "organi"],
  ["skorja", "koza-mozgani", "skorja", "Možganska skorja", "organi"],
  ["bela-snov", "koza-mozgani", "bela", "Bela možganovina", "organi"],
  ["mali-mozgani", "koza-mozgani", "mali", "Mali možgani", "organi"],
  ["pljuca", "organi", "pljuca", "Pljuča", "organi"],
  ["sapnik", "organi", "sapnik", "Sapnik in bronhij", "organi"],
  ["jetra", "organi", "jetra", "Jetra", "organi"],
  ["ledvica", "organi", "ledvica", "Ledvica", "organi"],
  ["bezgavka", "organi", "bezgavka", "Bezgavka", "organi"],
  ["poziralnik", "prebavila", "poziralnik", "Požiralnik", "organi"],
  ["zelodec", "prebavila", "zelodec", "Želodec", "organi"],
  ["tanko-crevo", "prebavila", "tankoCrevo", "Tanko črevo", "organi"],
  ["debelo-crevo", "prebavila", "debeloCrevo", "Debelo črevo", "organi"],
  ["zleza", "zleze", "zleza", "Trebušna slinavka", "organi"],
  ["scitnica", "zleze", "scitnica", "Ščitnica", "organi"],
  ["nadledvicna", "zleze", "nadledvicna", "Nadledvična žleza", "organi"],
  ["mehur", "zleze", "mehur", "Sečni mehur", "organi"],
  ["modo", "zleze", "modo", "Modo", "organi"],
  ["jajcnik", "zleze", "jajcnik", "Jajčnik", "organi"],
  ["mreznica", "oko-zob", "mreznica", "Mrežnica", "cutila"],
  ["rozenica", "oko-zob", "rozenica", "Roženica", "cutila"],
  ["leca", "oko-zob", "leca", "Leča", "cutila"],
  ["zob", "oko-zob", "zob", "Zob (obrus)", "cutila"],
  ["virus-sars", "celice", "virusSars", "Virus SARS-CoV-2", "virusi"],
  ["virus-hiv", "celice", "virusHiv", "Virus HIV", "virusi"],
  ["virus-t4", "celice", "virusT4", "Bakteriofag T4", "virusi"],
];

export const PREPARATI = P.map(([id, datoteka, izvoz, ime, skupina]) => ({ id, datoteka, izvoz, ime, skupina }));
export const ZACETNI = "cebula";

// Naloži preparat (objekt z glsl); null, če ga ni.
export async function naloziPreparat(id) {
  const e = PREPARATI.find((p) => p.id === id);
  if (!e) return null;
  const mod = await import(`./${e.datoteka}.js`);
  return mod[e.izvoz] || null;
}
