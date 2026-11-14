---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec Miha pravi: »Ukazna vrstica je samo starinski raziskovalec datotek brez slik. Vse, kar narediš v njej, z miško narediš enako hitro.«

Preizkusimo trditev. Teleskop na observatoriju vsako jasno noč posname okoli $400$ slik nočnega neba. Vsako jutro je treba slike premakniti v svoj imenik, ločiti od zapiskov in jih preimenovati po objektu. Z miško to pomeni stotine klikov vsak dan. V ukazni vrstici je to en ukaz. Še bolje: ukaze lahko zapišeš v datoteko in jih jutri poženeš znova, ne da bi karkoli klikal.

Miha ima delno prav. Oba načina delata z istimi datotekami in istimi imeniki. Razlika je v tem, *kako* jim poveš, kaj želiš. Lekcija te nauči drugega načina: kako se premikaš med imeniki, katere ukaze potrebuješ vsak dan in kako iz ukazov sestaviš skripto. Brez tega znanja ne boš poganjal programov v Pythonu, prevajal dokumentov v LaTeX-u ali obdeloval merskih podatkov.

## Razlaga

**1. Isto drevo, drug pogled.** Datoteke so na disku urejene v **imenike** (mape). Imenik lahko vsebuje datoteke in druge imenike. Tako nastane **drevo**: na vrhu je **koren**, iz njega se razraščajo veje. V raziskovalcu datotek drevo vidiš kot okna z ikonami. V ukazni vrstici ga ne vidiš, zato si ga moraš predstavljati. Primer drevesa astronomke Ane:

```
/
└── home/
    └── ana/
        └── astro/
            ├── mars/
            │   ├── slike/
            │   └── meritve.csv
            └── jupiter/
                └── lune.txt
```

**2. Kje sem?** V raziskovalcu vidiš, katera mapa je odprta. V ukazni vrstici si vedno »v« natanko enem imeniku. Temu rečemo **trenutni (delovni) imenik**. Izpiše ga ukaz `pwd` (*print working directory*):

```
ana@pc:~/astro/mars> pwd
/home/ana/astro/mars
```

Besedilo pred ukazom je **poziv**. Pokaže ime uporabnika, ime računalnika in trenutni imenik. (Pogosto se konča z znakom dolar; tu je namesto njega `>`.) Znak `~` je okrajšava za **domači imenik**, tu `/home/ana`.

**3. Pot je naslov datoteke.** Raziskovalec pokaže naslov v vrstici na vrhu okna. V ukazni vrstici ga napišeš sam. Imena imenikov ločiš s poševnico `/`. Ločimo dve vrsti poti:

- **absolutna pot** se začne s `/` (v korenu): `/home/ana/astro/jupiter/lune.txt`. Velja ne glede na to, kje si.
- **relativna pot** se ne začne s `/`. Bere se od trenutnega imenika naprej: iz `/home/ana/astro` je `jupiter/lune.txt` ista datoteka.

Dve posebni imeni: `.` je trenutni imenik, `..` pa imenik eno raven višje (starš).

:::premisli
Ana je v `/home/ana/astro/mars`. Kam jo pripelje `cd ..`, in kam `cd /`? Napovej, preden prebereš.
---
`cd ..` jo premakne eno raven višje, v `/home/ana/astro`. `cd /` jo pošlje v koren drevesa, ker se pot začne s poševnico in je zato absolutna.
:::

**4. Osnovni ukazi ob dejanjih z miško.** Vsako dejanje z miško ima svoj ukaz. Postavimo jih drug ob drugega:

| Z miško | Ukaz | Primer |
|---|---|---|
| odpreš mapo | `cd` | `cd slike` |
| pogledaš vsebino | `ls` | `ls -l` |
| nova mapa | `mkdir` | `mkdir arhiv` |
| kopiraš | `cp` | `cp a.txt b.txt` |
| premakneš, preimenuješ | `mv` | `mv a.txt arhiv/` |
| izbrišeš | `rm` | `rm stara.txt` |
| odpreš besedilo | `cat` | `cat lune.txt` |

Splošna oblika je *ukaz, stikala, argumenti*, ločeni s presledki. **Stikalo** (npr. `-l` pri `ls`) spremeni obnašanje ukaza: `ls -l` izpiše še velikost in datum. **Argument** pove, na čem ukaz dela. Opis ukaza dobiš z `man ls` ali `ls --help`.

**5. Tri razlike, ki štejejo.** Tabela kaže, da se ukazi in kliki ujemajo. Pomembnejše so razlike.

*Ni koša.* Datoteka, izbrisana z `rm`, ne gre v koš. Izgine takoj in je ne moreš priklicati nazaj.

*Vzorec namesto izbiranja.* Z miško klikneš vsako datoteko posebej. V ukazni vrstici napišeš **vzorec**: zvezdica `*` pomeni »poljubno zaporedje znakov«. Ukaz `mv *.fits surovi/` premakne vse datoteke s končnico `.fits` (zapis za astronomske posnetke) naenkrat.

*Natančnost.* Raziskovalec odpusti marsikaj. Ukazna vrstica ne. Velike in male črke so na Linuxu različne (`Slike` ni `slike`), presledek pa loči argumente. Ime s presledkom zato zapiši v narekovaje: `cd "nocno nebo"`.

:::premisli
V imeniku so `m31.fits`, `m42.fits` in `m42.png`. Katere datoteke zajame vzorec `m42.*` in katere `*.fits`?
---
`m42.*` zajame `m42.fits` in `m42.png`, ker se obe začneta z `m42.`. `*.fits` zajame `m31.fits` in `m42.fits`, ker se obe končata s `.fits`. Datoteka `m42.fits` ustreza obema vzorcema.
:::

**6. Skripta: ukazi, ki si jih računalnik zapomni.** Raziskovalec si klikov ne zapomni. Ukaze pa lahko zapišeš v navadno besedilno datoteko, eno vrstico za drugo. Taki datoteki rečemo **skripta**. Navadno ima končnico `.sh`:

```
#!/bin/bash
# uredi.sh: pospravi nocne posnetke
mkdir -p surovi
mv *.fits surovi/
ls surovi
```

Prva vrstica (*shebang*) pove, kateri program izvede skripto. Vrstice z `#` so komentarji. Stikalo `-p` pri `mkdir` pomeni: ustvari imenik, če ga še ni, sicer ne javi napake.

Skripto poženeš na dva načina:

- `bash uredi.sh`, ali
- najprej enkrat `chmod +x uredi.sh` (dovoljenje za izvajanje), nato `./uredi.sh`.

Zakaj `./`? Lupina (program, ki bere tvoje ukaze) išče ukaze le v nekaj sistemskih imenikih, ne v trenutnem. Z `./` ji poveš, naj vzame skripto točno iz trenutnega imenika.

Skripta izvede ukaze tako, kot bi jih vtipkal sam, in to **v imeniku, iz katerega jo poženeš**. Ta podrobnost povzroči veliko presenečenj.

**7. Windows.** Opisana ukazna vrstica je *bash* (Linux, macOS, na Windows prek WSL ali Git Bash). V PowerShellu delujejo `cd`, `ls`, `pwd`, `mkdir`, `cp`, `mv`, `rm` in `cat` podobno, poti pa ločuje `\`.

## Rešeni primeri

### Primer 1 (lažji): absolutna in relativna pot

Ana je v imeniku `/home/ana/astro/mars` (drevo zgoraj). Želi izpisati datoteko `lune.txt` iz imenika `jupiter`. Zapiši ukaz z absolutno in z relativno potjo.

**Podatki:** trenutni imenik `/home/ana/astro/mars`; datoteka `lune.txt` je v `/home/ana/astro/jupiter`; vsebino izpiše ukaz `cat`
**Iščemo:** ukaz `cat` z absolutno in z relativno potjo

:::formula
Absolutna pot: od korena `/` navzdol. Relativna pot: od trenutnega imenika; `..` pomeni eno raven višje.
:::

**Rešitev:**

1. Absolutna pot gre od korena: `/home/ana/astro/jupiter/lune.txt`.
2. Za relativno pot najprej poiščemo skupnega prednika. To je `astro`, ena raven nad `mars`, zato začnemo z `..`.
3. Iz `astro` se spustimo v `jupiter` in vzamemo datoteko: `../jupiter/lune.txt`.
4. Odgovor: `cat /home/ana/astro/jupiter/lune.txt` ali `cat ../jupiter/lune.txt`. Prvi ukaz deluje iz kateregakoli imenika, drugi le iz `mars`.

### Primer 2: pospravljanje z vzorcem

V imeniku `slike` je $12$ datotek: $9$ posnetkov s končnico `.fits` in $3$ zapiski `.txt`. Ana izvede `mkdir surovi` in nato `mv *.fits surovi/`. Koliko vnosov nato izpiše `ls` v imeniku `slike`?

**Podatki:** $12$ datotek, od tega $9$ `.fits` in $3$ `.txt`; ukaza `mkdir surovi` in `mv *.fits surovi/`
**Iščemo:** število vnosov, ki jih izpiše `ls`

:::formula
Vnosi po ukazih = prej $-$ premaknjene datoteke $+$ novi imeniki
:::

**Rešitev:**

1. `mkdir surovi` doda en nov vnos, imenik `surovi`.
2. Vzorec `*.fits` zajame vseh $9$ posnetkov, `mv` jih prestavi v `surovi`. V `slike` jih ni več.
3. Preštejemo: $12 - 9 + 1 = 4$.
4. Odgovor: `ls` izpiše $4$ vnose, tri zapiske `.txt` in imenik `surovi`. Posnetki niso izginili; vidiš jih z `ls surovi`.

### Primer 3 (težji): skripta, pognana iz napačnega imenika

Skripta `uredi.sh` (razlaga, točka 6) je shranjena v imeniku `/home/ana/noc`. Tam je prvo noč nastalo $40$ posnetkov `.fits`. Ana skripto požene v pravem imeniku. Naslednjo noč pride $35$ novih posnetkov. Ana je tokrat v domačem imeniku `~` in vpiše `bash noc/uredi.sh`. Kaj se zgodi in kako naj skripto požene pravilno? Koliko posnetkov je nato v `surovi`?

**Podatki:** skripta v `/home/ana/noc`; 1. noč $40$ posnetkov, 2. noč $35$ posnetkov; drugič pognana iz `/home/ana`
**Iščemo:** kaj naredi drugi zagon, pravilen ukaz in končno število posnetkov v `noc/surovi`

:::formula
Skripta izvaja ukaze v imeniku, iz katerega jo poženeš, ne v imeniku, kjer je shranjena.
:::

**Rešitev:**

1. Prvi zagon iz `noc`: nastane `noc/surovi` z $40$ posnetki.
2. Drugi zagon iz `~`: `mkdir -p surovi` ustvari *nov*, prazen imenik `~/surovi`, ker se relativna pot bere od `~`.
3. `mv *.fits surovi/` išče posnetke v `~`, kjer jih ni. Ukaz javi napako (`cannot stat '*.fits'`), novih $35$ posnetkov ostane v `noc`.
4. Pravilno: `cd ~/noc` in nato `bash uredi.sh`. Tokrat `mkdir -p` ne javi napake, ker `surovi` že obstaja.
5. V `surovi` je nato $40 + 35 = 75$ posnetkov.
6. Odgovor: zagon iz napačnega imenika ustvari prazen `~/surovi` in ničesar ne premakne. Po zagonu iz `noc` je v `noc/surovi` $75$ posnetkov.

### Primer 4: zdaj ti

Ana je zdaj v `/home/ana/astro/mars/slike`. Spet želi izpisati `lune.txt` iz `/home/ana/astro/jupiter`, tokrat z relativno potjo.

**Podatki:** trenutni imenik `/home/ana/astro/mars/slike`; cilj `/home/ana/astro/jupiter/lune.txt`
**Iščemo:** ukaz `cat` z relativno potjo

:::formula
Vsak `..` pomeni eno raven višje; od skupnega prednika greš navzdol.
:::

**Rešitev:**

1. Skupni prednik je spet `astro`.
2. Od `slike` do `astro` moraš dve ravni navzgor: najprej v `mars`, nato v `astro`.
3. Sestavi pot sam, nato preveri:

:::premisli
Kako se glasi ukaz?
---
`cat ../../jupiter/lune.txt`. Prvi `..` vodi v `mars`, drugi v `astro`, nato greš navzdol v `jupiter`.
:::

## Pogoste napake

- **»Ukaz naredi isto, kjerkoli sem.«** Relativna pot se bere od trenutnega imenika, zato `cat meritve.csv` v enem imeniku deluje, v drugem javi `No such file or directory`. Popravek: najprej `pwd`, nato pot; ali uporabi absolutno pot.
- **»Izbrisano gre v koš.«** Pri `rm` koša ni. `rm *` v napačnem imeniku izbriše vse datoteke v njem. Popravek: pred brisanjem z vzorcem poženi `ls` z istim vzorcem in poglej, kaj bo zajel.
- **Pot s poševnico na začetku.** `cd /slike` ne pomeni »imenik slike tukaj«, ampak »imenik slike v korenu«, ki ga ni. Popravek: relativna pot nima `/` na začetku.
- **Presledki in velike črke.** `cd nocno nebo` razume kot dva argumenta; `Slike` in `slike` sta dva različna imenika. Popravek: narekovaji okrog imena; pri imenih raje brez presledkov in z malimi črkami.
- **»Skripta se ne zažene, torej je pokvarjena.«** Napaka `Permission denied` pri `./uredi.sh` pomeni le, da datoteka nima dovoljenja za izvajanje. Popravek: `chmod +x uredi.sh` ali `bash uredi.sh`.

## Povzetek

- Datoteke tvorijo drevo imenikov s korenom `/`; `~` je domači imenik, `.` trenutni, `..` starš.
- Absolutna pot se začne s `/` in velja povsod; relativna se bere od trenutnega imenika (`pwd`).
- Osnovni ukazi: `pwd`, `cd`, `ls`, `mkdir`, `cp`, `mv`, `rm`, `cat`. Oblika: ukaz, stikala, argumenti.
- `*` v vzorcu pomeni poljubno zaporedje znakov; `rm` briše dokončno, brez koša.
- Skripta je besedilna datoteka z ukazi (`#!/bin/bash` na vrhu). Poženeš jo z `bash ime.sh` ali po `chmod +x` z `./ime.sh`. Ukazi se izvedejo v imeniku, iz katerega jo poženeš.

## Drugače: Na sliki

Drevo si predstavljaj kot zemljevid z napisom »Ti si tukaj«:

```
/home/ana/astro
├── jupiter/
│   └── lune.txt   <- cilj
└── mars/          <- ti si tukaj
    └── slike/
```

Relativna pot je opis poti po zemljevidu: »pojdi gor v `astro` (`..`), nato dol v `jupiter`, vzemi `lune.txt`«. Zapis: `../jupiter/lune.txt`. Če se oznaka »ti si tukaj« premakne v `slike`, se opis podaljša za en korak gor: `../../jupiter/lune.txt`.

Absolutna pot pa je natančen naslov od vrha zemljevida navzdol. Ne potrebuje oznake »ti si tukaj«, zato je vedno enaka.

## Drugače: Iz vsakdanjega življenja

Datotečni sistem je kot naslovi v vesolju. Absolutni naslov Zemlje bi bil: Rimska cesta, Sončev sistem, tretji planet. Relativni naslov pa je »sosednji planet navzven«. Na Zemlji to pomeni Mars, na Marsu pa Jupiter. Isti opis, drug izid, ker je odvisen od izhodišča.

Ukaz `..` je korak navzgor v hierarhiji: od Lune k Zemlji, od Zemlje k Soncu. Skripta pa je kot seznam navodil za avtomatsko sondo. Sonda vsak ukaz izvede tam, kjer je, ko ga dobi. Če jo pošlješ z napačnega izhodišča, bo navodila izvedla natančno, a na napačnem mestu.

## Preveri se

? Katera trditev o ukazni vrstici je pravilna?
- `cd /slike` odpre imenik `slike` v trenutnem imeniku.
~ Poševnica na začetku pomeni koren. Imenik v trenutnem imeniku odpreš s `cd slike`.
+ `..` pomeni imenik eno raven višje od trenutnega.
- Datoteke, izbrisane z `rm`, gredo najprej v koš.
~ Pri `rm` koša ni, datoteka je izbrisana takoj in dokončno.
- `Meritve.csv` in `meritve.csv` sta ista datoteka.
~ Velike in male črke so v imenih na Linuxu različne, zato sta to dve različni imeni.
> `..` je starš trenutnega imenika; `cd ..` te premakne eno raven navzgor.

? V imeniku je $5$ datotek `.fits`, $4$ datoteke `.png` in $2$ datoteki `.txt`. Izvedeš `rm *.png`. Koliko datotek nato izpiše `ls`?
- $11$
~ Tako misliš, če verjameš, da `rm` le označi datoteke ali jih da v koš. Datoteke `.png` so izbrisane.
+ $7$
- $4$
~ Zamenjal si, kaj ostane in kaj gre: izbrisane so štiri datoteke `.png`, ostale ostanejo.
- $0$
~ Vzorec `*.png` zajame le datoteke, ki se končajo s `.png`, ne vseh datotek.
> Izbrisane so $4$ datoteke `.png`, ostane $5 + 2 = 7$ datotek.

? Sošolec rešuje: »Sem v `/home/ana/astro/mars`. Do `/home/ana/astro/jupiter` pridem s `cd jupiter`.« Kje je napaka?
- Pravilno bi bilo `cd /jupiter`.
~ `/jupiter` bi iskal imenik v korenu, kjer ga ni.
+ `jupiter` ni v `mars`, ampak ob njem; pravilno je `cd ../jupiter`.
- Pravilno bi bilo `cd jupiter/..`.
~ Ta pot gre skozi `mars/jupiter`, ki ne obstaja, zato `cd` javi napako; tudi če bi obstajal, bi ostal v `mars`.
> Relativna pot se bere od trenutnega imenika. `jupiter` je brat imenika `mars`, zato najprej gremo gor z `..`.

? Kako se zagon `bash uredi.sh` razlikuje od `./uredi.sh`?
- Prvi je hitrejši, drugi počasnejši.
~ Hitrost je enaka; razlikujeta se v tem, ali potrebuješ dovoljenje za izvajanje.
- Drugi izvede ukaze v imeniku skripte, prvi v trenutnem.
~ Oba izvedeta ukaze v trenutnem imeniku, iz katerega skripto poženeš.
+ Prvi ne potrebuje dovoljenja za izvajanje, drugi potrebuje `chmod +x`.
> Pri `bash uredi.sh` skripto prebere program `bash`. Pri `./uredi.sh` jo sistem zažene sam, zato mora imeti dovoljenje za izvajanje.

? Observatorij vsako noč posname $400$ posnetkov `.fits`, ki jih je treba premakniti v imenik `surovi`. Kaj je najboljša rešitev?
- Vsako jutro jih z miško označiš in povlečeš.
~ Deluje, a vsak dan znova porabiš čas in hitro kakšnega spregledaš.
- Vsako jutro ročno vtipkaš $400$ ukazov `mv`, za vsak posnetek enega.
~ Vzorec `*.fits` zajame vse posnetke v enem ukazu.
+ Skripta z `mkdir -p surovi` in `mv *.fits surovi/`, ki jo vsako jutro poženeš v imeniku posnetkov.
> Skripta ukaze shrani, vzorec zajame vse posnetke, `-p` pa prepreči napako, ko `surovi` že obstaja.

:::simboli
\text{vnosi po ukazih} | število vnosov v imeniku po ukazih | \text{vnosi po ukazih} = \text{prej} - \text{premaknjene datoteke} + \text{novi imeniki} | – |
\text{prej} | število vnosov v imeniku pred ukazi | | – |
\text{premaknjene datoteke} | število datotek, ki jih mv premakne drugam | | – | npr. vse datoteke .fits
\text{novi imeniki} | število imenikov, ki jih ustvari mkdir | | – | ls jih izpiše kot vnose
:::
