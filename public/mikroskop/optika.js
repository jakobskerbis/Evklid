// Optika mikroskopa (docs/mikroskop.md »Optics«): čisti izračuni brez DOM, da jih preverijo testi (test/mikroskop.test.js).
// Svetlobni mikroskop: okular 10×, številka vidnega polja 18 mm, štirje objektivi (akromati), λ = 550 nm.
// TEM: povečava se nanaša na fluorescenčni zaslon premera 160 mm.

export const LAMBDA = 0.55; // µm, zelena svetloba (oko je tu najbolj občutljivo)
export const OKULAR = 10;
export const FN = 18; // mm, številka vidnega polja okularja
export const TEM_ZASLON = 160; // mm
export const N_OLJE = 1.515;
export const OBJEKTIVI = [
  // parfokal: koliko µm je slika pri menjavi objektiva iz ostrine (resnični objektivi niso povsem parfokalni)
  { m: 4, na: 0.1, olje: false, parfokal: 0 },
  { m: 10, na: 0.25, olje: false, parfokal: 0.8 },
  { m: 40, na: 0.65, olje: false, parfokal: -0.6 },
  { m: 100, na: 1.25, olje: true, parfokal: 0.3 },
];
export const MIN_M = 40;
export const SVETLOBNI_MAX = 1000; // 100× objektiv · 10× okular
export const TEM_MIN = 1000;
export const MAX_M = 5e7;

// Premer vidnega polja (µm) pri skupni povečavi m.
export function vidnoPolje(m, nacin = "svetloba") {
  return nacin === "tem" ? (TEM_ZASLON * 1000) / m : (FN * 1000 * OKULAR) / m;
}

// Učinkovita numerična apertura objektiva: 100× brez olja ne more preseči ~0,95 in ima veliko sferno aberacijo.
export function naObjektiva(obj, olje) {
  if (obj.olje && !olje) return 0.95;
  return obj.na;
}

// Ločljivost (Rayleigh, d = 1,22 λ / (NAobj + NAkond)); zaslonka (0–1) določa NA kondenzorja.
export function locljivost(obj, zaslonka = 0.7, olje = true) {
  const na = naObjektiva(obj, olje);
  const naK = na * Math.max(0.1, Math.min(1, zaslonka));
  return (1.22 * LAMBDA) / (na + naK);
}

// Globinska ostrina (µm): n λ / NA² (valovni del; pri suhih objektivih n = 1).
export function globinskaOstrina(obj, olje = true) {
  const n = obj.olje && olje ? N_OLJE : 1;
  const na = naObjektiva(obj, olje);
  return (n * LAMBDA) / (na * na);
}

// Zamegljenost slike v µm (σ Gaussove krivulje): uklon + razostritev + aberacija brez olja.
// dz = odmik od ravnine ostrine (µm).
export function zamegljenost(obj, { dz = 0, zaslonka = 0.7, olje = true } = {}) {
  const d = locljivost(obj, zaslonka, olje);
  const sUklon = d / 2.6;
  const n = obj.olje && olje ? N_OLJE : 1;
  const na = naObjektiva(obj, olje);
  const dof = globinskaOstrina(obj, olje);
  const izven = Math.max(0, Math.abs(dz) - dof / 2);
  const sRaz = (izven * Math.tan(Math.asin(Math.min(0.99, na / n)))) / 2;
  const sAber = obj.olje && !olje ? 1.0 : 0;
  return Math.hypot(sUklon, sRaz, sAber);
}

// Svetlost slike (0–~1,4): žarnica × zaslonka × prepustnost objektiva (manj svetlobe pri večji povečavi).
const PREPUSTNOST = { 4: 1, 10: 1, 40: 0.82, 100: 0.66 };
export function svetlost(obj, zarnica, zaslonka, olje = true) {
  const z = Math.max(0.05, Math.min(1, zaslonka));
  const brezOlja = obj.olje && !olje ? 0.6 : 1;
  return zarnica * (0.3 + 0.7 * z * z) * (PREPUSTNOST[obj.m] ?? 1) * brezOlja * 2.6;
}
// Kontrast: zaprta zaslonka poveča kontrast (in globinsko ostrino), a zmanjša ločljivost.
export function kontrast(zaslonka) {
  return 1 + 0.6 * (1 - Math.max(0.05, Math.min(1, zaslonka)));
}

// TEM: ločljivost tanke biološke rezine je omejena z vzorcem (~1,5 nm), ne z elektronsko optiko.
export const TEM_LOCLJIVOST = 0.0015; // µm

// Kaj se pri dani velikosti vidnega polja (µm) vidi: raven prikaza.
export function raven(m, nacin) {
  if (nacin === "svetloba") return m < 100 ? "tkivo" : m < 400 ? "celice" : "celice-blizu";
  const vp = vidnoPolje(m, "tem");
  if (vp > 15) return "celice";
  if (vp > 1.5) return "organeli";
  if (vp > 0.25) return "membrane";
  if (vp > 0.012) return "molekule";
  return "atomi";
}

// Utež modela molekul: 0 pod ~800 000×, 1 nad ~2 400 000× (vidno polje 0,2 µm → 0,067 µm).
export function utezModela(m) {
  const vp = vidnoPolje(m, "tem");
  const t = (Math.log(0.2) - Math.log(vp)) / (Math.log(0.2) - Math.log(0.067));
  return Math.max(0, Math.min(1, t));
}

// Lepa dolžina za merilce (1, 2, 5 × 10^n), največ maks; vrne [vrednost v µm, oznaka].
export function merilce(maks) {
  const e = Math.floor(Math.log10(maks));
  let v = 10 ** e;
  for (const k of [5, 2, 1]) if (k * 10 ** e <= maks) {
    v = k * 10 ** e;
    break;
  }
  return [v, oznakaDolzine(v)];
}
export function oznakaDolzine(um) {
  const st = (x) => String(Math.round(x * 100) / 100).replace(".", ","); // največ dve decimalki (j, 12. 11. 2026)
  if (um >= 1000) return `${st(um / 1000)} mm`;
  if (um >= 1) return `${st(um)} µm`;
  if (um >= 0.001) return `${um >= 0.01 ? Math.round(um * 1000) : st(um * 1000)} nm`; // 335 nm, ne 335,5 nm
  return `${st(um * 1e4)} Å`;
}
// Povečava z ločili tisočic: 50 000 000×.
export function oznakaPovecave(m) {
  // največ tri veljavne števke (29 995 000× → 30 000 000×), da drsnik ne kaže naključnih repov
  const k = m >= 1000 ? 10 ** (Math.floor(Math.log10(m)) - 2) : 1;
  const r = Math.round(m / k) * k;
  return `${String(r).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}×`;
}
