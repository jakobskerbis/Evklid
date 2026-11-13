# Tedenske nove igre (j 2026-10-30)

j: »Naj kozmetika in sorodni aspekti dobivajo tedenske update, z novimi vrstami iger, ki naj bodo
usklajene s feedbackom uporabnikov.« Kozmetiko vodi svoj tedenski zagon (sreda 02:13 UTC, oznaka
»Novo« iz `public/avatar.js`); ta dokument velja za **eno novo vrsto igre na teden**.

## Kdaj in kako odloča j
Vsako sredo ob 06:13 UTC se oglasi tedenski opomnik v niti IGRE (po kozmetiki in po ponastavitvi
tedenske omejitve). j (30. 10.): »vsak teden seznam glasov, in ga da meni v pregled«, »kaj je dobilo
največ glasov in par načinov, kako bi to integrirali«. Zato:
1. Claude prosi j-ja, naj na računalniku odpre Evklid → Igre → »Glasovi tedna (za pregled)« →
   »Kopiraj seznam za Clauda« in seznam prilepi v nit. Glasove vidi samo j (skrbnik ali računalnik s
   strežnikom); j je izbral, da niso javni, zato jih oblak sam ne bere.
2. Claude pripravi zmagovalca in 2–3 kratke predloge, kako ga narediti kot učno igro, na kartici za
   odločitev s priporočilom.
3. Gradnja šele po j-jevi izbiri. Dokler velja omejitev porabe (`docs/token-rules.md`, optimizator):
   brez delovnih tokov, največ 2 agenta hkrati.

## Povratne informacije učencev
- **Glas za naslednjo igro** (Igre → »Glasuj za novo igro tedna«): en glas na teden, od srede do
  srede; seznam zvrsti je `public/games/wishes.js` (`WISHES`).
- **👍/👎 po koncu igre**: ocena vrste igre (`game_ratings`).
- **Vprašalnik o igrah iz otroštva** (`public/games/childhood.js`) in igranost v zadnjih 7 dneh.
- **Lastni naslovi iger** iz vprašalnika (`game_titles`, največ 5 × 40 znakov): `matchTitle` jih
  poveže z zvrstjo (doda jo v izbiro), z željo iz `WISHES` ali z »?« (Evklid te igre še ne pozna:
  kandidat za novo zvrst v `WISHES`).
- Povzetek: `GET /api/games/trends` (`server/games.js`, `gameTrends`) in plošča v Igrah: števila,
  brez imen učencev (edino besedilo so lastni naslovi s svojo povezavo), prazen pri manj kot 3 učencih.

## Izbira zvrsti (predlog za j-ja)
1. Največ glasov pravkar končanega tedna; izenačeno → več glasov skupaj.
2. Brez glasov: prva zvrst iz `WISHES`, ki je še ni (seznam je urejen po pričakovanem zanimanju).
3. Vrsta igre z več 👎 kot 👍 (vsaj 3 ocene): predlagaj še popravek te igre.

## Kako narediti igro
- Izvirna igra po `docs/igre-smernice.md`: učenje je jedro (izid odloči pravilni odgovor), lastni
  liki, risbe in imena, nikoli imena ali liki tujih iger. Vzorec: `public/games/retro.js`.
- Nova vrsta igre: motor v `public/games/*.js` z `added: "YYYY-MM-DD"` (oznaka »Novo« 7 dni),
  `PACE` v `unlock.js`, vzorec ploščice `.gm-k-<id>` v `games.css`, ikona (`scripts/build-icons.js`
  NAMES + ročni vnos v `public/icons.js`), ključa `games.e.<id>` in `.how` v vseh 33 jezikih.
- Zvrst prestavi iz `WISHES` (`wishes.js`) v `GENRES` (`childhood.js`, ključ `games.g.<id>`); ključ
  `games.w.<id>` lahko ostane; ključne besede lahko ostanejo v `WISH_HINTS` (`matchTitle` jih potem
  šteje kot zvrst). Seznam želja dopolni z novo zvrstjo, da jih ostane vsaj 12.
- Trojni pregled (`docs/pregled.md`), PR, združitev, kratko sporočilo j-ju v niti IGRE (slovensko,
  kaj je novo in zakaj ta zvrst).
