// Raven prikaza 3D modelov po profilu učenca (j, 6. 11. »Prilagoditev starosti«): 1 OŠ, 2 SŠ, 3 študij. Deli modela
// imajo lahko »raven«; zahtevnejši od ravni profila so v seznamu delov pod gumbom »Več delov« (nikoli zaklenjeni).
// Aplikacija poda vir nastavitev profila (app.js: nastaviVirRavni(() => state.student?.settings)); brez profila SŠ.
import { stopnja } from "/stopnja.js";

let vir = () => null;
export function nastaviVirRavni(fn) {
  if (typeof fn === "function") vir = fn;
}
export function ravenProfila() {
  let s = null;
  try {
    s = vir();
  } catch {}
  if (!s) return 2;
  const st = stopnja(s);
  return st === "FAKS" ? 3 : st === "SS" ? 2 : 1;
}
// Ali je del na ravni (brez »raven« vedno).
export const naRavni = (d, raven) => !(Number(d?.raven) > raven);
