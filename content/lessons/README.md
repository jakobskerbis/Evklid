# Lekcije učbenika

Vsaka tema učne poti ima lahko lekcijo v `content/lessons/<pot>/<slug-teme>.md`,
npr. `MAT-OS-8/pitagorov-izrek.md`. Id teme (pot + slug) je v `server/curriculum-data.js`
oz. se izpiše z `node scripts/generate-lessons.js --list`.

Lekcije se berejo brez stroškov AI. Datoteko lahko učitelj popravi kar tukaj;
aplikacija spremembo pobere ob naslednjem odprtju lekcije.

## Oblika

```markdown
---
stanje: osnutek        # osnutek | pregledano (osnutek pokaže opozorilo učencu)
demo: pitagora         # neobvezno: dodatna simulacija (simulacije za vsako temo so v public/sim/katalog.js)
avtor: učitelj / AI    # neobvezno, za evidenco
---

## Zakaj se tega učimo
Navezava na znano in zakaj je tema uporabna.

## Razlaga
Definicije in razlaga po korakih. Vmes 2 vprašanji »Premisli« (napoved ali
»zakaj«), odgovor je v aplikaciji skrit za gumbom:

:::premisli
Kaj se zgodi z gostoto, če kocko prerežemo na pol?
---
Ostane enaka: masa in prostornina se razpolovita, razmerje ostane.
:::

## Rešeni primeri
### Primer 1 (lažji)
Besedilo naloge (vsi podatki so v besedilu).

**Podatki:** $v = 9\,\mathrm{m/s}$, $t = 45\,\mathrm{s}$
**Iščemo:** pot $s$

:::formula
$s = v \cdot t$
:::

**Rešitev:**

1. $s = 9\,\mathrm{m/s} \cdot 45\,\mathrm{s} = 405\,\mathrm{m}$
2. Odgovor: kolesar prevozi $405\,\mathrm{m}$.

### Primer 2
### Primer 3 (težji)

## Pogoste napake

## Povzetek
Nekaj vrstic. Tutor ga dobi v kontekst, da razlaga skladno z učbenikom.

## Drugače: Na sliki
## Drugače: Iz vsakdanjega življenja
## Drugače: Korak za korakom s številkami
## Drugače: Bolj natančno
Razdelki, ki se začnejo z »Drugače:«, se pokažejo pod gumbom »Razloži drugače«.

**Telefon (360 px).** Formula, ki na telefonu ne gre v vrstico, se sama zloži pri enačajih (leva stran zgoraj, spodaj vsak »= …«); tabela ali formula brez enačaja se pomanjša do 80 %, ostalo se pomika vstran (`public/sirina.js`; isto velja za vsako enačbo v aplikaciji: simulacije, klepet, naloge). Zato dolgo verigo enačb razdeli v več `$$…$$`, vsak naj bo cela enačba z levo stranjo (`$$s = v \cdot t$$`, nato `$$s = 9 \cdot 45 = 405\,\mathrm{m}$$`), sicer `check-lesson.js` korakov ne preračuna; `aligned` in `$$= …$$` brez leve strani ne preverita ničesar. Tabela naj ima največ 3–4 kratke stolpce. Videz preveri `node scripts/preveri-videz-lekcij.cjs --samo POT/tema --vse` (napake: koreni brez črte, neporavnane tabele, formule čez rob ali ne na sredini; »drsnik« je opozorilo, kje bi krajši zapis pomagal).

## Preveri se
? Vprašanje (Markdown in $LaTeX$ sta dovoljena)
- napačen odgovor
~ Zakaj je ta odgovor napačen (tipična napačna predstava); pokaže se ob tej izbiri.
+ pravilen odgovor
- napačen odgovor
~ Razlaga za to napačno možnost.
> Pojasnilo, ki se pokaže po pravilnem odgovoru.

:::simboli
s | pot | s = v \cdot t | m
v | hitrost | v = \frac{s}{t} | m/s
t | čas | | s
:::
```

## Preveri se: vrste vprašanj

Vsako vprašanje se začne z `?`; besedilo vprašanja (tudi tabela ali risba `:::risba`) stoji med vrstico `?` in
prvim odgovorom. Vrsta vprašanja sledi iz odgovorov; v enem vprašanju je samo ena vrsta. Mešaj vrste: kjer je odgovor
število, naj ga učenec vpiše; kjer ima tema graf, skico ali tabelo, naj vsaj eno vprašanje zahteva branje risbe.

**Izbira** (kot zgoraj): vsaj 3 možnosti, natanko ena `+`, vsaka `-` ima svojo vrstico `~`.

**Vpiši število:** natanko ena vrstica `= vrednost | toleranca`.

```markdown
? Kolikšen je pH raztopine HCl s koncentracijo $0{,}0050\,\mathrm{mol/L}$?
= 2,30 | 0,01
~ 5,30 | Uporabil si naravni logaritem (ln) namesto desetiškega (log).
~ -2,30 | pH kisle raztopine ni negativen: pozabil si na minus pred logaritmom.
> $\mathrm{pH} = -\log 0{,}0050 = 2{,}30$.
```

- Vrednost z decimalno vejico, brez `$`; potenca kot `1,5·10^-3`. Za vrednostjo sme stati enota (`= 2,5 m/s | 0,1`), ki se izpiše ob polju za vnos (enoto lahko zapišeš tudi v `$…$`).
- Toleranca je neobvezna; brez nje velja natančno na izpisane decimalke (`= 2,30` sprejme 2,295 do 2,305, tudi »2,3«).
- `~ vrednost | zakaj`: tipična napačna vrednost in razlaga, ki se pokaže ob njej. Ujema se na svoje izpisane decimalke (`~ 501` sprejme 501,19; `~ 1·10^-10` le vrednosti okoli 10⁻¹⁰), zato jo zapiši tako natančno, kot jo dijak res vpiše. Napačna vrednost ne sme biti znotraj tolerance pravilne.
- Učenec sme pisati vejico ali piko, katerikoli minus (−, -), potenco tudi brez množitelja (»10^-4«) in enoto (se ne upošteva).

**Razvrsti:** 3 do 6 vrstic `1.`, `2.` … v pravilnem vrstnem redu; aplikacija jih pokaže premešane (ob vsakem
nalaganju enako), učenec jih postavi po vrsti z dotikom ali puščicama. Razlaga je v `>`, vrstic `~` ni.

```markdown
? Razvrsti raztopine od najbolj kisle do najbolj bazične.
1. HCl, $0{,}1\,\mathrm{mol/L}$
2. ocetna kislina, $0{,}1\,\mathrm{mol/L}$
3. voda
4. NaOH, $0{,}1\,\mathrm{mol/L}$
> Močna kislina ima najnižji pH, šibka višjega, voda 7, močna baza najvišjega.
```

**Risba v vprašanju:** blok `:::risba … :::` (razdelek Risbe) takoj pod vrstico `?`, pred odgovori. Izriše se v
aplikaciji, tisku in PDF; inštruktor dobi njen `opis:`. Vprašanje naj se nanjo nanaša (»Z grafa odčitaj …«).

V tisku in PDF ima vpiši število prazno črto, razvrsti premešane elemente z začetnicami (a, b, c), rešitve pa
pravilno vrednost oziroma vrstni red. `check-lesson.js` preveri zapis vseh treh vrst (pri številu samo zapis, ne
računa).

## Risbe (`:::risba`)

Slike nikoli ne riši z znaki v bloku ```` ``` ```` (črtice, `|---|`, ■): v aplikaciji in PDF je to videti kot surov izpis.
Blok ```` ``` ```` je samo za programsko kodo in izpis ukazov, vedno z oznako jezika (```` ```python ````).
Risbo zapišeš s podatki, strežnik jo izriše v SVG (`server/risbe.js`, videz `public/risbe.css`): enaka je v
aplikaciji, tisku in PDF, v svetli in temni temi, na telefonu so napisi veliki vsaj 12 px.

```markdown
:::risba premica
opis: Številska premica s celimi števili od −6 do 3. Negativna so levo od 0.
od: -6
do: 3
:::
```

- `opis:` je obvezen: besedilo, ki sliko nadomesti slepemu učencu, inštruktorju in branju na glas (kaj je na sliki, s števili). Opis bere bralnik zaslona dobesedno, zato indekse in eksponente piši z besedami ali znaki Unicode (F₁, x², »Theveninova napetost«), nikoli z `_` ali `^` (check-lesson to javi). Enako velja za `podnapis:`, ki je neobvezen napis pod sliko.
- Števila piši z decimalno vejico, točko kot `x; y`, polja loči z `|`. Indeks in eksponent v napisih: `F_1`, `x^2`, `a_12`, `10^-3` (celo število s predznakom), več črk v zavitih oklepajih `U_{Th}` (`U_Th` je napaka).
- Slog (zadnje polje): barve `modra`, `oranžna`, `zelena`, `rdeča`, `siva` (pomenijo vlogo, ne odtenka; pomen naj nikoli ne bo samo v barvi), `črtkano`, `debelo`, `puščica`, `polno`, `ozadje`, `zaprto`. Lega napisa: `nad`, `pod`, `levo`, `desno`, `sredina` (tudi `nad levo`).

| Vrsta | Ključi |
|---|---|
| `premica` | `od`, `do`, `korak`, `oznake` (vsaka koliko enot; `ne`), `oznaka: x \| besedilo`, `točka: x \| napis \| slog` (`prazna`), `skok: a -> b \| napis`, `interval: a .. b \| napis` |
| `mreža` | `vrstic`, `stolpcev`, `spodaj`, `desno` (napisa ob stranicah), `številke: da` |
| `stolpci` | `stolpec: ime \| vrednost` (2–8), `os` (ime navpične osi), `korak` |
| `graf` | `x: od .. do \| korak \| ime`, `y: …`, `enako: da` (ista enota na obeh oseh), `višina`, `oznake: ne`, `oznakax` / `oznakay: vrednost \| besedilo`, `f: izraz \| slog \| od .. do`, `drsnik: ime \| od .. do \| korak \| začetna \| napis` (spodaj) in liki |
| `skica` | `območje: x0; y0 .. x1; y1`, `enota` (px na enoto), `mreža: da` in liki |
| `atom` | `jedro` (napis), `lupine: 2, 8, 1`, `imena: K, L, M` |
| `molekula` | pod vrstico `---` strukturna formula z znaki: atomi, vezi `– \| = ≡ / \\`, nevezni pari `··` ali `:` |

Liki (v `graf` in `skica`, v koordinatah lekcije, rišejo se po vrsti): `črta: x; y -> x; y -> … | slog`,
`lik: x; y -> … | slog`, `pravokotnik: x; y .. x; y | slog`, `krog: x; y | polmer | slog`, `točka: x; y | napis | lega | slog`,
`napis: x; y | besedilo | lega | slog`, `puščica: x; y -> x; y | napis | lega | slog`, `pravikot: oglišče | točka | točka`.

**Graf z drsniki** (samo `graf`, 1 do 3 drsniki): učenec pod sliko premika drsnik in graf se sproti izriše znova.

```markdown
:::risba graf
opis: Premica y = kx + n. V aplikaciji se k in n spreminjata z drsnikoma; izbrano je k = {k} in n = {n}.
x: -6 .. 6
y: -6 .. 6
drsnik: k | -3 .. 3 | 0,5 | 1 | smerni koeficient k
drsnik: n | -3 .. 3 | 1 | 2 | začetna vrednost n
f: k*x + n
točka: 0; n | (0, {n}) | levo
podnapis: Premica y = kx + n pri k = {k} in n = {n}
:::
```

- `drsnik: ime | od .. do | korak | začetna | napis`: ime je ena črka (ne `x`, `y`, `e`), korak razdeli območje na največ 200 enakih delov, začetna vrednost leži na koraku. Napis je navadno besedilo (bere ga bralnik zaslona); če ga ni, je napis ime.
- Ime uporabiš v `f:` (`k*x + n`), v koordinatah likov in polmeru kroga (`točka: 0; n`, `črta: 0; n -> 1; k + n`) ter kot `{izraz}` v napisih likov, v `opis:` in `podnapis:` (`k = {k}`, `{-n/k}`; `{+n}` izpiše predznak: »+ 2« ali »− 2«; v podnapisu raje piši »k = {k} in n = {n}« kot »y = {k}x {+n}«, ker bi to dalo »y = 1x + 2«). Besedilo ob risbi naj ima smisel tudi v tisku, kjer drsnikov ni (»v aplikaciji …«). Vrednost se izpiše z decimalno vejico, zaokrožena na 2 decimalki (pri drobnejšem koraku drsnika do 4); izraz, ki ni določen (deljenje z 0), se izpiše kot »/«. V koordinati `|x|` piši kot `abs(x)`.
- Tisk, PDF, inštruktor in branje na glas dobijo sliko oziroma opis pri začetnih vrednostih, zato mora biti takrat vse na sliki (sicer napaka). Pri drugih vrednostih se lik, ki pade iz območja ali ni določen, samo ne nariše.
- check-lesson javi: napačno območje, korak ali začetno vrednost, več kot 3 drsnike, drsnik, ki ni nikjer uporabljen, in neznano črko v izrazu. Vzorec: `MAT-SS-1/linearna-funkcija.md`.

Vsi liki (tudi napisi in točke) morajo biti znotraj `območje` oziroma osi `x`, `y`, sicer check-lesson javi napako.
Risba mora kazati točno to, kar pove besedilo (ista števila in oznake). Koordinate izračunaj, ne ocenjuj na oko:
funkcijo nariše `f:` iz izraza, lik iz koordinat oglišč. `check-lesson.js` javi napako v zapisu risbe in opozori na
slike iz znakov, ki so še ostale. Vzorci: `MAT-OS-8/cela-stevila.md` (premica, skica), `MAT-SS-3/graf-polinoma.md` (graf),
`KEM-OS-8/razporeditev-elektronov.md` (atom), `KEM-OS-8/kovalentna-vez.md` (molekula), `MAT-OS-6/prikazi-podatkov.md` (stolpci).

## Oznake (`:::simboli`) – klikljive formule

V aplikaciji je vsaka oznaka v formuli klikljiva: kartica pokaže ime, zvezo,
iz česa je sestavljena (pri $\rho = \frac{m}{V}$: $m$ masa, $V$ prostornina) in enoto.
Pomen oznake je odvisen od lekcije ($T$ je lahko temperatura, nihajni čas ali
prepustnost), zato ga lekcija zapiše sama v bloku `:::simboli` na koncu datoteke.
Blok se ne izpiše; brez njega aplikacija ugiba iz splošnega slovarja
(`public/formula-data.js`).

Ena vrstica na oznako, polja ločena z `|`:

1. oznaka v TeX (`I_0`, `\varepsilon`, `\Delta H`, `\mathrm{pH}`); več oznak z istim pomenom loči z vejico (`x_1, x_2`);
2. ime, kot ga uporablja lekcija (`prepustnost (transmitanca)`);
3. zveza v TeX, s katero jo izračunamo (`T = \frac{I}{I_0}`), ali prazno;
4. enota v TeX (`kg/m^3`, `mol/L`, `L\,mol^{-1}\,cm^{-1}`); `–`, če nima enote; prazno pri čisti matematiki;
5. neobvezna kratka opomba (`število med 0 in 1`).

Formula v imenu ali opombi je med `$…$` (`največje odstopanje od $\bar{h}$`), sicer se izpiše surov TeX.

Preverjevalnik opozori na oznake iz izpostavljenih formul (`$$…$$` in `:::formula`),
ki v bloku manjkajo. Pomoč za obstoječe lekcije: `node scripts/simboli.js <lekcija>`
izpiše formule, manjkajoče oznake, slovarski pomen in stavke, kjer se pojavijo.

Merila kakovosti (vrhunska raven) za lekcije, naloge in simulacije so v
`docs/kakovost.md`; pisec in pregledovalec jih preverita pri vsaki lekciji.
Preverjevalnik opozori, če razlaga nima 2 blokov `:::premisli` ali če kateri
napačni odgovor nima vrstice `~`.

Pravila za rešene primere (vsak `### Primer`):

- **Podatki:** vedno izpiši *vse* podatke iz besedila naloge (z oznakami in
  enotami), tudi če je naloga brez računanja (napiši, kaj je dano).
- **Iščemo:** kaj naloga sprašuje.
- Blok `:::formula … :::` z formulo oziroma pravilom, ki ga potrebujemo. V
  aplikaciji je skrit za gumbom »Pokaži formulo«, da učenec najprej poskusi
  sam; v PDF-ju je izpisan. Vsebina bloka je navaden Markdown z LaTeX.
- **Rešitev:** koraki z vmesnimi rezultati in odgovor v stavku.

Obliko preveriš z `node scripts/check-lesson.js -q content/lessons/<pot>/<slug>.md` (`-q` izpiše samo težave). Preverjevalnik tudi sam preračuna čisto številske korake v formulah (`$37 \cdot 7 = 259$`) in javi napako, če se ne ujemajo; pretvorb enot in razdelkov »Pogoste napake« / »Preveri se« ne preverja. Enakosti z neznankami (pravila, identitete, `:::simboli`, pravilni odgovor `+` v kvizu, miselni vzorci) preveri z naključnimi števili (`server/lesson-identity.js`): $(a+b)^2 = a^2 + b^2$ ali $z \cdot \bar z = a^2 - b^2$ je napaka. Enačbo ali pogoj označi v isti vrstici (»enačba«, »če je …«, »za $x < 0$«), namerno napačen zapis z »napačno« ali »napaka«. Navodila za pisca ali pregledovalca izpiše `node scripts/lesson-brief.js [--review] <id-teme> [...]`. Za varčno pisanje glej `docs/token-rules.md`.
(brez argumentov preveri vse lekcije). Simulacijo v besedilu omeni kot
»simulacija spodaj« z njenim naslovom iz public/sim/katalog.js.

Demonstracija se pokaže za razdelkom »Rešeni primeri«. Formule piši v LaTeX z
decimalno vejico (`$3{,}5$`). Če je med naštetimi števili vsaj eno decimalno, jih loči s podpičjem:
`$1{,}5$; $2$ ali $2{,}99$`, točka `$(1{,}5; 2)$` (preveri `check-lesson.js`).

## Račun za kodo (`<<RACUN`)

Na koncu lekcije je blok z vsemi končnimi in pomembnimi vmesnimi rezultati rešenih primerov, vaj in vprašanj v strojni obliki, ena trditev na vrstico (zapis in ključne besede kot v `prompts/system_prompt.md`, »Račun za kodo«: `resi`, `neenacba`, `enako`, `odvod`, `integral`, `limita`, `vrednost`, `enote`, `kemija`, `molska`). Učenec ga ne vidi (`server/textbook.js`); `node scripts/check-lesson.js` vsako trditev preveri s SymPy oziroma urejevalnikom enačb in napačno javi kot napako.

```
<<RACUN
resi: 2*x+3=11 | x | 4
enote: 72*km/h | 20*m/s
kemija: CH4 + 2 O2 -> CO2 + 2 H2O
>>
```

## Fakultetne lekcije

Fakultetna tema z enakim naslovom in predmetom se pojavi v več predmetih (npr.
»Odvod funkcije« v 42 programih). Lekcijo napišeš enkrat, v mapo prvega
predmeta (`sameTopics(id)[0]` v `server/curriculum.js`), in velja za vse
predmete s to temo. Lastna datoteka v mapi drugega predmeta ima prednost.
Zato naj bo fakultetna lekcija splošna (brez imena enega predmeta ali
fakultete).

Fakultetna lekcija ima zgradbo, prilagojeno izpitom (j, 4. 11. 2026, `docs/kakovost.md` §1c):
natančne definicije, izreki s pogoji in dokazi, ki jih izpit zahteva, so v »Razlaga«;
Primer 3 je na ravni izpita; za »## Povzetek« pride razdelek »## Za izpit«
(»Znati moraš povedati:« in 2–3 »### Naloga« z »**Rešitev:**«, ki je v aplikaciji
skrita za gumbom); namesto »Drugače: Iz vsakdanjega življenja« je »Drugače: Uporaba v stroki«.

Katere teme še nimajo lekcije, urejeno po številu programov:
`node scripts/fakultetne-lekcije.js --letnik 1 --n 40`.
