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
| Računsko preverjeno | `izracunano` | Točna aritmetika, točna algebra (`public/scan/algebra.js`) ali SymPy z `how: "symbolic"` (PV-03) potrdi trditev v celoti. |
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

## Način preverjanja SymPy (PV-03)

Worker (`server/cas/worker.py`) v vsakem odgovoru vrne `how`, najšibkejši način, ki ga je ukaz uporabil
(dogovor s profilom B na #539):

- `symbolic`: simbolni račun (poenostavitev na 0, `solveset`, točna števila, ki jih SymPy odloči sam);
- `numeric`: števila na 30 mest (konstanta z decimalkami, |N| < 10⁻¹²), sprejem s toleranco zapisa (`decimals_tol`,
  približki rešitev, zaokroženi vmesni rezultati, enote z razmerjem, ki ni točno 1), numeričen določeni integral,
  realnost korenov in logaritmov, ki je SymPy ne dokaže, in popolnost periodičnih rešitev samo na [−20, 20];
- `sampled`: `is_zero` je odločil s preizkusom v naključnih točkah.

`server/cas.js` `casCheck` vrne `how`, kadar ga worker pošlje. Pravilo: SymPy »drži« je `izracunano` samo pri
`how: "symbolic"`, sicer (tudi brez `how`) največ `numericno`. Meja motorja `sympy` v `trditev.js` ostane `exact`;
vir v `dokazi` preslika besednjak workerja: `symbolic` → `exact`, `numeric` in `sampled` → `numeric`.

`ok` se spremeni le na robu: točno število, ki ni 0, a je manjše od 10⁻¹², je prej veljalo za 0, zdaj ga SymPy
odloči simbolno (`equal e^(-60) | 0`: prej `true`, zdaj `false`; `value sqrt(10^40+1) | 10^20`: prej `true`, zdaj
`null`). Na 5.329 trditvah RACUN iz lekcij se `ok` ni spremenil nikjer. Ker `simplify` sam ne najde vseh identitet,
`is_zero` pred vzorčenjem poskusi še tri simbolne prepise (`expand_trig`, `rewrite(exp)`, razstavljena osnova
korena), vsakega z lastnim časovnim robom 1,5 s; Piecewise, ki je 0 povsod razen v točki, kjer izraz ni definiran
(odvod |x|), šteje kot 0. Tako `tan x + cot x = 2/sin 2x`, `sqrt(x²+6x+9) = |x+3|`, `(|x|)' = x/|x|`,
`(ln|x|)' = 1/x` in točna rešitev eksponentne enačbe ostanejo `symbolic`. Skener (`verifyAiFull`) to že upošteva: SymPy, ki ni simbolno dokazal, da
največ »Numerično preverjeno«, razen če je lokalna točna algebra odgovor dokazala. Bloka RACUN (`server/racun.js`,
profil B) še ne preslikamo v statuse; ko ga, velja isto pravilo.

## Meritev (PV-02)

Referenčni nabor `test/fixtures/preverjanje/nabor-v1.json` (384 trditev, 191 pravilnih) ustvari
`node scripts/nabor-preverjanje.mjs` iz fiksnega semena (vedno enaka datoteka). Resnica je znana iz konstrukcije
(enačbe iz izbranih ničel, korenske in logaritemske enačbe iz izbrane veljavne in tuje rešitve, neenačbe iz izbranih
krajišč, znani odvodi, integrali in računi), ne iz preverjevalnikov Evklida; drugi pregledovalec je vse oznake
neodvisno preveril s SymPy. Skupine: polinomske enačbe, iracionalne ničle, zaokroženi približki, luknje racionalnih
enačb, korenske enačbe, neenačbe, identitete, odvodi, integrali, računi, limite, enote, periodične rešitve, velika
števila, »skoraj« (napake tik ob meji tolerance: veliki koeficienti, znanstveni zapis, »≈«, napačno zaokroženo,
odrezano namesto zaokroženo, bližnji ulomki, velika števila) in »druge« (logaritemske, eksponentne, z absolutno
vrednostjo, racionalne neenačbe, »ni rešitve«, kompleksni rešitvi kot realni, napačna perioda). Pravilen zaokrožen
odgovor ima mejo `najvec: "numericno"`.

Dogovora: rešitve so realne (kompleksni rešitvi pri realni enačbi sta napaka); identiteta, kot je
`(x^2-4)/(x-2) = x+2`, šteje kot pravilna poenostavitev (izključeno točko preverja skupina »luknja«).

`node scripts/meri-preverjanje.mjs [--json pot]` izmeri tri motorje: `sympy` (izid workerja z načinom `how`), `skener`
(`verifyAiFull`, kot ga vidi učenec) in `skener-lokalno` (isto brez SymPy). Razredi: napačno potrjena, previsok
status, lažni alarm, napačna s šibkim statusom (učenec vidi »delno« ali »numerično«), izjema, ujeta napaka, potrjena,
šibkejši status, nepreverjena. `test/preverjanje-meritev.test.js` (CI ima SymPy prek `npm ci`, postinstall) pade ob
vsaki novi napačni potrditvi, previsokem statusu, lažnem alarmu ali izjemi in kadar motor ujame ali potrdi manj kot
ob izhodišču. Limite in enote (21 trditev) nimajo oblike rešitve skenerja, zato jih meri samo surov SymPy.

Izhodišče 25. 11. 2026:

| Motor | Trditev | Napačno potrjene | Ujete napake | Napačne s šibkim statusom | Lažni alarmi | Pravilne potrjene |
| --- | --- | --- | --- | --- | --- | --- |
| sympy (surovo) | 384 | 5 | 187/193 | 0 | 0 | 179/191 (+12 previsoko) |
| sympy z načinom (PV-03) | 384 | 0 | 187/193 | 5 | 0 | 173/191 |
| skener | 363 | **4** | 178/182 | 0 | 5 | 153/181 (+1 previsoko) |
| skener-lokalno | 363 | 0 | 172/182 | 5 | 8 | 101/181 |
| skener po popravku | 363 | 0 | 178/182 | 0 | 5 | 154/181 |
| skener s PV-03 | 363 | 0 | 178/182 | 0 | 5 | 154/181 |
| skener-lokalno po popravku | 363 | 0 | 173/182 | 4 | 7 | 106/181 |

0 napačno potrjenih na tem naboru pomeni pri 95-odstotnem zaupanju delež pod približno 3/n (n = število napačnih
trditev) in velja samo za vrste napak v naboru.

Ugotovitve:

- **Skener: 4 napačno potrjene trditve (»Preverjeno« pri napačnem odgovoru).** Identiteta in odvod z velikimi
  koeficienti, napačnimi za 1 (`(x+1000000)^2` = `x^2+1999999*x+10^12`): `is_zero` v `server/cas/worker.py` šteje
  točko za ničlo, ko je |razlika| ≤ 10⁻⁹ · največji člen (≈ 10¹²), in vrne `ok: true`. Ničla v znanstvenem zapisu
  z napačno mantiso (`2*10^6` namesto 2,4·10⁶, `1e6` namesto 1,4·10⁶): `decimals_tol` da toleranco pol enote zadnjega
  mesta mantise (5·10⁵). Pri treh od štirih je lokalna točna algebra pravilno rekla »napaka«, a `verifyAiFull` je
  dal prednost SymPy. **Popravljeno:** točen lokalni protiprimer (`verifyAi` vrne `exact: true`) SymPy ne preglasi,
  skener pokaže »Nepreverjeno«; odvod polinoma `verify.js` preveri točno (ulomki); zapis `1.4e6` se lokalno prebere kot
  1,4·10⁶ (prej kot 1,4·e·6). **Ostane odprto:** popravek velja le za polinome. Napačen odgovor z velikimi koeficienti
  v nepolinomskem izrazu (npr. `(x+1000000)^2 + sin(x)` ali `e*(x+1000000)^3` za odvod) še dobi »Preverjeno«, ker
  vzroka v `is_zero` (relativna toleranca glede na največji člen) ni popravil. **PV-03:** worker zdaj pove, da je
  odločil v točkah (`how: "sampled"`), zato skener tam pokaže največ »Numerično preverjeno«.
- Skener: »≈1414« (zaokroženo na celo število) je dobil »Preverjeno«, ker je regex `rounded` v `verifyAiFull`
  prepoznal le decimalno piko. **Popravljeno:** »≈«, »approx« in znanstveni zapis (2e6, 2*10^6) so približek.
- Odprto, skener: pravilen določeni integral z mejo iz več znakov (`∫_0^pi sin(x) dx = 2`, `∫_1^10 1/x dx = ln(10)`) dobi
  »Zaznana napaka«, ker `public/scan/verify.js` mejo prebere le do prvega znaka. Zaokrožen račun (`1/3+1/7 ≈ 0.476`,
  `sqrt(2) ≈ 1.414`) dobi »Zaznana napaka«, ker skener račun pošlje v `equal` (točno), ne v `value`.
- Odprto, skener brez SymPy: luknja brez rešitev (`(x^2-1)/(x-1)=2`) dobi »Zaznana napaka«; štirje napačni
  odgovori dobijo šibek pozitiven status: trije periodični in napačna periodična rešitev s predolgo periodo
  »Delno preverjeno«.
- Surov SymPy: zaokrožene decimalke sprejme s toleranco (`decimals_tol`) in vrne `ok: true` (12 previsokih
  statusov); zmnožek velikih števil v zapisu `1.2193263111263526*10^17` (napaka 9) sprejme, ker `value` računa s
  plavajočo vejico. **PV-03:** vsi ti odgovori imajo `how` ≠ `symbolic`, zato so največ `numericno`; surov SymPy z
  načinom nima nobene napačno potrjene trditve in nobenega previsokega statusa, pet napačnih pa dobi `numericno`.
- Cena PV-03 v pokritosti: pravilne periodične rešitve (`sin x = 0` → `kπ`, `cos x = 0` → `π/2 + kπ`, 6 trditev)
  so zdaj `numericno`, ker worker popolnost preveri samo na [−20, 20]. Simbolni dokaz popolnosti ostaja odprt.
  Identitete, ki jih `simplify` sam ne najde (tan + cot, koren popolnega kvadrata, odvod |x| in ln|x|, točna rešitev
  eksponentne enačbe), po pregledu ostanejo `izracunano` (trije dodatni simbolni prepisi v `is_zero`).

## Pravilo za nove dele aplikacije

Vsak nov del aplikacije, ki prikaže matematično trditev, jo odda v zapisu trditve in prikaže status iz
`statusi.js`; svojega pomena besede »preverjeno« ne uvaja. Pregledovalec (`docs/pregled.md`, prehod 2) to preveri.
