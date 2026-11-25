// Evklidova tipkovnica (tipkovnica.js s podatki, ~45 KB stisnjeno) ni del prvega izrisa Učne poti
// (docs/meritve/prijavljen-mobilno-2026-11-19.md točka 2): app.js jo naloži takoj po njem (zasloniPozneje) ali ob prvi
// uporabi. Do takrat ta modul shrani nastavitve polj (configureKeyboard …) in jih ob prihodu modula preda naprej v istem
// vrstnem redu; vprašanja (keyboardOpenFor, keyboardLayer) odgovorijo, da tipkovnica ni odprta (še ni mogla biti).
// Moduli, ki se naložijo pozneje (kalkulator, skener, ustno), uvozijo tipkovnica.js neposredno: isti modul.
let mod = null;
let nalaganje = null;
let poskusov = 0;
const caka = [];
export function naloziTipkovnico() {
  if (mod) return Promise.resolve(mod);
  // Ob neuspehu (brez povezave, nova različica) nov poskus z drugim naslovom, kot app.js lenModul.
  return (nalaganje ||= (poskusov++ ? import(`./tipkovnica.js?r=${poskusov}`) : import("./tipkovnica.js")).then(
    (m) => (prijaviTipkovnico(m), mod),
    (err) => {
      nalaganje = null;
      throw err;
    },
  ));
}
// tipkovnica.js se ob nalaganju prijavi sam (tudi, ko ga prvi uvozi drug modul, npr. kalkulator ali skener).
export function prijaviTipkovnico(m) {
  if (mod) return;
  mod = m;
  for (const f of caka.splice(0)) f(m);
}
export const tipkovnica = () => mod;
const ali = (f) => (mod ? f(mod) : void caka.push(f));
export const initKeyboard = () => ali((m) => m.initKeyboard());
export const configureKeyboard = (el, cfg) => ali((m) => m.configureKeyboard(el, cfg));
export const setKeyboardContext = (o) => ali((m) => m.setKeyboardContext(o));
export const mountKeyboardSettings = (box) => ali((m) => m.mountKeyboardSettings(box));
export const hideKeyboard = (o) => mod?.hideKeyboard(o);
export const keyboardOpenFor = (field) => !!mod?.keyboardOpenFor(field);
export const keyboardLayer = () => mod?.keyboardLayer() ?? null;
const zNalaganjem = (ime) => (...a) => (mod ? mod[ime](...a) : naloziTipkovnico().then((m) => m[ime](...a), () => {}));
export const toggleKeyboard = zNalaganjem("toggleKeyboard");
export const openKeyboard = zNalaganjem("openKeyboard");
// fn(modul) ob prihodu modula (ali takoj, če je že tu); ne sproži nalaganja.
export const obTipkovnici = (fn) => ali(fn);
