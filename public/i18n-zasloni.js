// Besedila zaslonov po prvem izrisu (vadnica, Račun, Kartice, Kotiček, kalkulator, Urnik …). Modul zaslona uvozi to
// datoteko namesto public/i18n.js: ob prvem kliku tako ne čaka celega slovarja (i18n/sl.js, ~75 KB stisnjeno), ampak
// samo svoj del (/i18n/zasloni-sl.js, ~15 KB), ki ga strežnik sestavi iz kode teh modulov (server/i18n-jedro.js
// slZasloni). Del se doda za jedrom; cel slovar ga, ko pride, nadomesti. Brez jedra (drug jezik, stran brez seje)
// stran pred zagonom že ima cel slovar, del pa je odveč, a ne škodi. test/zasloni-leno.test.js zaslone izriše brez
// celega slovarja in preveri, da ni nobenega ključa namesto besedila.
import DEL from "./i18n/zasloni-sl.js";
import { dodajDel } from "./i18n-osnova.js";

dodajDel(DEL);

export * from "./i18n-osnova.js";
