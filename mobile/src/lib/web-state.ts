// Strežnik še nima /api/mobile/web (posodobitev aplikacije OTA je prišla pred novo različico strežnika na
// Renderju): aplikacija začasno pokaže naravne zaslone in spletno stran poskusi znova, ko se vrne v ospredje.
import Storage from "expo-sqlite/kv-store";
import { key } from "./keys";

let pending = false;
export const setWebPending = (v: boolean) => void (pending = v);
export const webPending = () => pending;

// Konec seje v aplikaciji (odjava, izbris računa, potekla seja): spletna stran v WebView pobriše svoje osebne
// podatke (localStorage, predpomnilnik API; src/lib/zasebnost.js spletPocistiJs). Odprta stran takoj (cleaner),
// sicer ob naslednjem nalaganju, preden se zaženejo njeni skripti. Zastavica (nastavitev naprave, ostane ob
// brisanju) velja do prvega nalaganja strani po brisanju.
const FLAG = key("web.pocisti");
let cleaner: (() => void) | null = null;
export const setWebCleaner = (fn: (() => void) | null) => void (cleaner = fn);
export function requestWebClear() {
  try {
    Storage.setItemSync(FLAG, "1");
  } catch {}
  try {
    cleaner?.();
  } catch {}
}
export const webClearPending = () => {
  try {
    return Storage.getItemSync(FLAG) === "1";
  } catch {
    return false;
  }
};
export const webClearDone = () => {
  try {
    Storage.removeItemSync(FLAG);
  } catch {}
};
