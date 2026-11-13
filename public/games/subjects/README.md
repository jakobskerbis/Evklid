# Pojmi za igre iz drugih predmetov

Igra v razdelku IGRE = vrsta igre (`../engines.js`, `../arcade.js`) × pojem. Matematični pojmi so v `../topics.js`, pojmi drugih predmetov pa tukaj, ena datoteka na predmet: `fiz.js`, `kem.js`, `bio.js`, `nar.js`, `geo.js`, `rac.js`, `eko.js`. Datoteka ne uvaža ničesar (brez krožnih uvozov) in izvozi:

```js
export const AREAS = [
  // [id področja, { sl, en }, barva]
  ["fz_meh", { sl: "Gibanje in sile", en: "Motion and forces" }, "#0ea5e9"],
];
export const CONCEPTS = [
  {
    id: "f_speed",              // [a-z0-9_], 2–30 znakov, enoličen v vsej aplikaciji (predpona predmeta: f_, k_, b_, n_, g_, r_, e_)
    area: "fz_meh",
    year: 8,                    // šolsko leto: OŠ 6–9 → 6–9, SŠ 1.–4. letnik → 10–13, fakulteta → 14
    name: { sl: "Hitrost", en: "Speed" },
    gen(tier, ctx) { ... },     // tier 1–3 (lažje → težje); ctx.lang je "sl" ali "en", ctx.num(x) oblikuje število
  },
];
```

Dodaten paket za predmet, ki že obstaja (npr. `mat15.js` za matematiko 1.–5. razreda, `mat2.js`, `fiz2.js`), izvozi še `export const SUBJECT = "MAT";` in v `AREAS` le nova področja (obstoječa uporabi po id-ju). Paketi `spo.js` (Spoznavanje okolja, 1.–3.) in `nit.js` (Naravoslovje in tehnika, 4.–5.) sta svoja predmeta. Vsak nov pojem dobi teme učne poti v `../lessons.js` (če jih ima), sicer velja njegov `year`.

`gen` vrne `{ q, a, w }`: vprašanje, pravilni odgovor in vsaj 3 različne napačne odgovore (nikoli enake pravilnemu). Vse so nizi.

## Pravila kakovosti

- **Pravilnost je na prvem mestu.** Vsak pravilni odgovor mora biti nedvoumno pravilen za to raven, vsak napačen nedvoumno napačen (tudi ob zaokroževanju in drugih zapisih). Raje manj pojmov kot en dvoumen.
- **Napačni odgovori so tipične napake** (zamenjana enota, pozabljen faktor, obrnjena formula, zamenjan pojem), ne naključne številke.
- **Kratko.** Vprašanje izpiše glava igre (do ~45 znakov, največ 60). Odgovor se izriše na predmetu v igri (meteor, balon, polica): do ~14 znakov, največ 20. Simboli namesto besed, kjer je to običajno (`v = 12 m/s`, `NaCl`, `ATP`).
- **Števila** vedno skozi `ctx.num(x)` (decimalna vejica v slovenščini, pravi minus). Enote SI s presledkom (`12 m/s`, `4,5 kJ`). Lepe vrednosti: izberi podatke tako, da je rezultat celo število ali kratko decimalno.
- **Jezik:** `ctx.lang === "sl"` → slovensko (strokovni izrazi kot v slovenskih učbenikih), sicer angleško. Slovenščina mora biti naravna in slovnično pravilna (sklon, spol, šumniki).
- **Stopnje:** 1 = osnovno priklic/en korak, 2 = uporaba/dva koraka ali manj znano dejstvo, 3 = zahtevnejše (pretvorbe enot, sestavljeno). Vse tri morajo delovati.
- **Raznolikost:** pri dejstvenih pojmih (banka vprašanj) naj ima vsak pojem vsaj ~12 različnih vprašanj na stopnjo ali generator, da se igra ne ponavlja. Za napačne odgovore premešaj in izberi 3–5 iz smiselnega nabora.
- **Pokritost:** pojmi naj skupaj pokrijejo učni načrt predmeta (OŠ in gimnazija; pri GEO, RAC, EKO prvi letnik fakultete). Vsako področje ima vsaj 2 pojma (z 9 vrstami iger je to ≥ 18 iger na področje).
- **Brez** imen resničnih oseb, blagovnih znamk in vsebin, ki niso primerne za otroke.

## Preverjanje

`node --test test/games.test.js` – vsak pojem 150-krat na vsaki stopnji v obeh jezikih (oblika, podvojeni, `NaN`, `undefined` …). Dodatno si sam izpiši vzorce (`node -e` z `makeQuestion` iz `../topics.js` po `setNumberStyle("sl")`) in jih preberi.
