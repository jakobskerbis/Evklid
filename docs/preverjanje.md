# Matematično preverjanje: skupni statusi in zapis trditve

j, 25. 11. 2026 (»Celovit sistem matematičnega preverjanja«): vsaka matematična trditev v Evklidu naj ima status
preverjanja, ki ne obljublja več, kot dokazi upravičijo. Načelo: **AI razloži. Matematika preveri. Lean dokaže.**
Ne obljubljamo 100-odstotne pravilnosti; cilj je 100-odstotna pokritost trditev s pravim statusom in čim manj
napačnih trditev, označenih kot preverjene (glavna metrika).

Načrt (22 PR-jev PV-01 do PV-22, faze A–J, delitev s profilom B): Claude Doc
<https://claude.ai/artifact/4MDrdZGAMias5kvAmNc1Ci>; predlogi za profil B na #539. Lean: `docs/lean.md` (L1–L6).
SymPy: `docs/preverjanje-s-kodo.md`.

## Sedem statusov (`public/preverjanje/statusi.js`)

| Status | Ključ | Kdaj velja |
| --- | --- | --- |
| Formalno dokazano | `dokazano` | Lean je dokazal trditev in njeno popolnost (cela množica rešitev). Pogoji iz `docs/lean.md`: izrek je zapisan tako kot v viru (prevod AI preveri neodvisno), predpostavke imajo `example`, ki pokaže, da se dajo izpolniti, aksiomi so samo `propext`, `Classical.choice`, `Quot.sound`. |
| Računsko preverjeno | `izracunano` | Točna aritmetika, točna algebra (`public/scan/algebra.js`) ali SymPy brez naključnih točk potrdi trditev v celoti. |
| Numerično preverjeno | `numericno` | Vsaj en del (trditev ali popolnost) je preverjen samo s števili (naključne točke, mreža). Ni dokaz in se nikoli ne zviša sam. |
| Delno preverjeno | `delno` | Del trditve ali odgovora je preverjen, del ne (npr. vsaka navedena rešitev drži, popolnost ne). |
| Preverjanje v teku | `v_teku` | Počasnejši motor (Lean) še dela. Začasno; po roku velja najvišji doseženi status (rok uvede PV-14). Oznaka »ni preverjeno z Lean« iz L6 (`docs/lean.md`) je ta status oziroma status, ki ga je trditev dobila brez Leana. |
| Zaznana napaka | `napaka` | Preverjanje je pokazalo, da trditev ne drži (protiprimer, manjkajoča ali odvečna rešitev). |
| Nepreverjeno | `nepreverjeno` | Noben motor trditve ne zna preveriti, ali pa se motorja ne strinjata. |

Pravila:

- **Status ni nikoli močnejši od dokaza.** `statusIzDokazov({ holds, how, complete })` vzame šibkejšega od obeh
  delov: Lean dokaz trditve s popolnostjo iz SymPy je `izracunano`; številski preizkus je vedno največ `numericno`.
- **Odgovor je najšibkejši člen** (`statusOdgovora`): ena `napaka` → napaka; sicer ena `v_teku` → v teku;
  mešanica preverjenih in nepreverjenih → `delno`; `dokazano` samo, ko je dokazana vsaka trditev in vsak prehod
  med koraki (prehod je svoja trditev vrste `korak`).
- **Vsak motor sme navesti največ svoj način** (`MOTORJI` v `trditev.js`): `formal` samo Lean, njegov »drži« pa samo z
  imenovanim izrekom (`dokaz.izrek`; protiprimer šteje tudi brez), `exact` aritmetika, algebra, SymPy in kemija, `numeric` števila. Močnejša navedba šteje
  le do meje motorja; mnenje AI in neznan motor nista dokaz. Pri enačbi, neenačbi in sistemu (in kadar vrsta ni
  podana) je popolnost del trditve, zato `complete: "na"` tam šteje kot »ni preverjena«.
- **Več dokazov za isto trditev** (`statusTrditve` v `trditev.js`): formalni protiprimer → `napaka`; točen
  »ne drži« → `napaka`, razen če Lean isto trditev dokaže (SymPy lahko »ne drži« odloči s preizkusom v točkah):
  takrat `nepreverjeno`; številski »ne drži« → `napaka`, razen če ga močnejši motor ovrže za isti del (»ne drži«
  le močnejši »drži«, manjkajočo rešitev le močnejši dokaz popolnosti): takrat `nepreverjeno`. Neskladje motorjev
  gre v meritev. Sicer velja najmočnejši dokaz.
- **Potrjeno** (`jePotrjeno`) pomeni `dokazano` ali `izracunano`. Napačna trditev s takim statusom je
  »napačno potrjena«; ta delež mora biti 0.

Skener ima na zaslonu svojih pet statusov (`public/scan/status.js`), ki so od PV-01 samo prevod skupnih:
`izracunano` in `dokazano` → »Preverjeno« (`verified`), `delno` → `partial`, `numericno` → `numeric`,
`napaka` → `wrong`, `nepreverjeno` in `v_teku` → `unverified`. Besedila na zaslonu se niso spremenila.

## Zapis trditve (`public/preverjanje/trditev.js`)

Vsak vir odda trditve v istem zapisu: `id`, `besedilo` (kot ga vidi učenec), `zapis` (strojni zapis, isti jezik kot
blok RACUN), `vrsta` (`VRSTE`), `predpostavke`, `obmocje`, `enote`, `prejsnji` (id koraka, iz katerega trditev
sledi), `pravilo`, `dokazi` (`{ motor, holds, how, complete, ms, razlicica }`), `dokaz` (Lean izrek in sha256) in
`izid` (status, izračunan iz dokazov; vir ga ne nastavi sam). `napakeZapisa(t)` preveri obliko, ne matematike.

## Znana omejitev: SymPy še ne pove, kako je preveril

Vsi ukazi SymPy, ki gredo skozi `is_zero` (`server/cas/worker.py`: `equal`, vstavljanje rešitev pri `solve`,
`diff`, nedoločeni `int`, `value`), ob neuspehu simbolnega poenostavljanja preidejo na preizkus v naključnih točkah
(ustavi se pri 8 ujemanjih, zadošča jih 5) in vrnejo isti `ok: true` kot simbolni dokaz; tudi konstanto sprejmejo kot
0, ko je |N(z, 30)| < 10⁻¹². Zato:

- izidov bloka RACUN (`server/racun.js`) še ne preslikamo v `izracunano`;
- »Preverjeno« skenerja, ki temelji na SymPy `ok: true` (`server/scan.js` `verifyAiFull`: izrazi, odvodi), se
  preslika v `izracunano`, čeprav je lahko le numerično. To je znana precenitev do PV-03.

PV-03 doda v odgovor workerja način preverjanja (`symbolic` ali `sampled`), dogovor s profilom B na #539.

## Pravilo za nove dele aplikacije

Vsak nov del aplikacije, ki prikaže matematično trditev, jo odda v zapisu trditve in prikaže status iz
`statusi.js`; svojega pomena besede »preverjeno« ne uvaja. Pregledovalec (`docs/pregled.md`, prehod 2) to preveri.
