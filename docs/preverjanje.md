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
| Formalno dokazano | `dokazano` | Lean je sprejel izrek trditve in njene popolnosti (cela množica rešitev); aksiomi samo `propext`, `Classical.choice`, `Quot.sound`. |
| Računsko preverjeno | `izracunano` | Točna aritmetika, točna algebra (`public/scan/algebra.js`) ali SymPy brez naključnih točk potrdi trditev v celoti. |
| Numerično preverjeno | `numericno` | Samo preizkus s števili (naključne točke, mreža). Ni dokaz in se nikoli ne zviša sam. |
| Delno preverjeno | `delno` | Del trditve ali odgovora je preverjen, del ne (npr. vsaka navedena rešitev drži, popolnost ne). |
| Preverjanje v teku | `v_teku` | Počasnejši motor (Lean) še dela. Začasno; po roku najvišji doseženi status. |
| Zaznana napaka | `napaka` | Preverjanje je pokazalo, da trditev ne drži (protiprimer, manjkajoča ali odvečna rešitev). |
| Nepreverjeno | `nepreverjeno` | Noben motor trditve ne zna preveriti, ali pa se motorja ne strinjata. |

Pravila:

- **Status ni nikoli močnejši od dokaza.** `statusIzDokazov({ holds, how, complete })` vzame šibkejšega od obeh
  delov: Lean dokaz trditve s popolnostjo iz SymPy je `izracunano`; številski preizkus je vedno največ `numericno`.
- **Odgovor je najšibkejši člen** (`statusOdgovora`): ena `napaka` → napaka; sicer ena `v_teku` → v teku;
  mešanica preverjenih in nepreverjenih → `delno`; `dokazano` samo, ko je dokazana vsaka trditev in vsak prehod
  med koraki (prehod je svoja trditev vrste `korak`).
- **Več dokazov za isto trditev** (`statusTrditve` v `trditev.js`): točen ali formalni protiprimer → `napaka`;
  številski »ne drži«, ki mu točen motor nasprotuje → `nepreverjeno` (neskladje gre v meritev); številski
  »ne drži« brez močnejšega dokaza → `napaka` (kot v skenerju); sicer najmočnejši dokaz. Mnenje AI ni dokaz.
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

## Znana omejitev: `racun.js` še nima statusa

SymPy ukaz `equal` (`server/cas/worker.py`, `is_zero`) ob neuspehu simbolnega poenostavljanja preide na preizkus v
naključnih točkah (zadošča 5 ujemanj) in vrne isti `ok: true` kot simbolni dokaz. Zato izidov bloka RACUN ne
preslikamo v `izracunano`, dokler worker ne vrne tudi načina preverjanja (PV-03, dogovor s profilom B na #539).

## Pravilo za nove funkcije

Vsaka nova funkcija, ki prikaže matematično trditev, jo odda v zapisu trditve in prikaže status iz
`statusi.js`; svojega pomena besede »preverjeno« ne uvaja. Pregledovalec (`docs/pregled.md`, prehod 2) to preveri.
