// Jezik vmesnika: t("ključ", { spremenljivke }) in prevod statičnih napisov v strani (data-i18n).
// Izbrani jezik je shranjen na napravi in v profilu učenca (inštruktor odgovarja v njem).
// Vse je v public/i18n-osnova.js; ta datoteka mu doda cel slovar izvirnih (slovenskih) besedil (public/i18n/sl.js).
// Kdor uvozi to datoteko, ima ob svojem nalaganju vsa besedila (statični uvoz). Moduli prvega izrisa aplikacije
// uvozijo i18n-osnova.js (brez sl.js, ~75 KB stisnjeno manj); test/i18n-jedro.test.js preveri, da je tako.
import SL from "./i18n/sl.js";
import { dodajSlovenscino } from "./i18n-osnova.js";

dodajSlovenscino(SL);

export * from "./i18n-osnova.js";
