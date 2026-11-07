---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na začetku sedemdesetih let so v Bellovih laboratorijih razvijali operacijski sistem Unix. Doug McIlroy je predlagal, naj programi ne bodo veliki in vsestranski, temveč majhni, in naj izhod enega postane vhod naslednjega, kot pri ceveh za vodo. Ken Thompson je **cevi** vgradil v sistem in v lupino. Od takrat velja načelo: vsak program naredi eno stvar dobro, sestavljamo pa jih v verige. Lupina **bash** (Bourne Again Shell) je nastala konec osemdesetih let za projekt GNU in je danes privzeta lupina večine sistemov Linux.

Zakaj to potrebuje računalnikar? Ker podatki pogosto ne pridejo v lepi obliki. Predstavljaj si, da dobiš tisoč datotek z meritvami temperature in padavin z vremenskih postaj in moraš ugotoviti, koliko vročih dni je imela vsaka postaja. V lupini to narediš z eno vrstico, brez pisanja programa. Enake veščine potrebuješ na strežnikih brez grafičnega vmesnika, pri prevajanju programov v C in pri skriptah, ki jih boš pisal v naslednji lekciji.

## Razlaga

Vsak razdelek začnemo z mislijo, ki se zdi samoumevna, a je napačna, in jo popravimo.

### Napačna misel 1: »ukaz sam razume, kaj sem natipkal«

**Definicija.** **Lupina** je program, ki bere ukazno vrstico, jo razčleni in zažene druge programe. Ni del jedra operacijskega sistema, temveč navaden uporabniški proces.

Ko natipkaš `ls -l *.csv`, program `ls` nikoli ne vidi zvezdice. Lupina vrstico obdela v tem vrstnem redu:

1. razdeli jo na **besede** (presledki ločijo, narekovaji združijo);
2. naredi **razširitve**: `~` v domači imenik, <code>&#36;IME</code> v vrednost spremenljivke, <code>&#36;(ukaz)</code> v izhod ukaza, nato **nadomestne znake** (`*` poljubno zaporedje znakov, `?` en znak, `[abc]` en znak iz množice) v seznam ujemajočih se imen datotek;
3. uredi **preusmeritve** (glej spodaj);
4. zažene program in mu poda seznam besed kot argumente.

Program `ls` torej dobi argumente `-l`, `kopija.csv`, `meritve.csv`. Preizkus:

```
echo *.csv
# izpis: kopija.csv meritve.csv
echo '*.csv'
# izpis: *.csv
```

Enojni narekovaji preprečijo vse razširitve. Če se vzorec ne ujema z nobeno datoteko, ga bash pusti nespremenjenega (`echo nič*.xyz` izpiše `nič*.xyz`).

Datoteke tvorijo drevo imenikov s korenom `/`. **Absolutna pot** se začne s `/` (`/home/ana/podatki/meritve.csv`), **relativna** se bere od trenutnega imenika, ki ga izpiše `pwd`; `.` je trenutni imenik, `..` nadrejeni, `~` domači. `cd ../arhiv` gre torej en imenik višje in nato v `arhiv`.

Osnovni ukazi, ki jih potrebujemo: `pwd`, `cd`, `ls`, `cp`, `mv`, `rm`, `mkdir`, `cat`, `man` (navodila za vsak ukaz) in filtri `head`, `tail`, `grep`, `cut`, `sort`, `uniq`, `wc`.

### Napačna misel 2: »pravice so lastnost uporabnika«

V Linuxu ima pravice **datoteka** (natančneje njen inode), in sicer za tri razrede: **lastnika** (u), **skupino** (g) in **ostale** (o). Vsak razred ima tri pravice:

- `r` (branje): pri datoteki beri vsebino, pri imeniku izpiši imena v njem;
- `w` (pisanje): pri datoteki spreminjaj vsebino, pri imeniku ustvarjaj, preimenuj in briši datoteke v njem;
- `x` (izvajanje): pri datoteki jo poženi kot program, pri imeniku vanj vstopi (`cd`) in dostopaj do datotek v njem.

`ls -l` izpiše npr. `-rw-r-----`: prvi znak je vrsta (`-` datoteka, `d` imenik), nato po trije znaki za u, g, o. **Osmiški zapis** pretvori vsako trojko v števko: $r = 4$, $w = 2$, $x = 1$, odsotnost $0$. `rw-` je $4 + 2 = 6$, `r--` je $4$, `---` je $0$, skupaj `640`.

Nove datoteke dobijo pravice iz **umaska**: ta pove, katere bite *odvzamemo* privzetim pravicam `666` za datoteke in `777` za imenike. Pri `umask 022` dobi nova datoteka `644`, nov imenik `755`.

:::premisli
Imenik ima pravice `r--` za ostale (brez `x`). Ali lahko drug uporabnik prebere datoteko v njem, če ima datoteka sama pravico `r` za vse?
---
Ne. Imena v imeniku lahko izpiše, do datoteke pa ne pride, ker za dostop do vsebine imenika potrebuje `x`. Pravice se preverjajo na vsakem imeniku poti, ne le pri zadnji datoteki.
:::

Pomembna posledica: brisanje datoteke je sprememba *imenika*. Datoteko brez pravice `w` lahko izbrišeš, če imaš `w` in `x` na imeniku, v katerem je.

### Napačna misel 3: »izpis gre vedno na zaslon«

Vsak proces ob zagonu dobi tri **opisnike datotek** (številke odprtih tokov):

```
         0 stdin
            |
            v
       +---------+
       | proces  |--1 stdout->
       +---------+
            |
         2 stderr
            v
```

Privzeto je $0$ tipkovnica, $1$ in $2$ pa zaslon. **Preusmeritve** spremenijo, kam kaže opisnik, *preden* se program zažene:

- `ukaz > f`: stdout v datoteko `f`; datoteka se najprej **izprazni**;
- `ukaz >> f`: stdout na **konec** datoteke;
- `ukaz < f`: stdin iz datoteke;
- `ukaz 2> f`: stderr v datoteko;
- `ukaz > f 2>&1`: stdout v `f`, nato stderr tja, kamor *trenutno* kaže stdout;
- `/dev/null`: posebna datoteka, ki vse zavrže.

Preusmeritve se izvajajo **od leve proti desni**. Zato `ukaz 2>&1 > f` ni isto kot `ukaz > f 2>&1`: v prvem primeru stderr kopira stari cilj stdout (zaslon), šele nato stdout preusmerimo v `f`.

### Napačna misel 4: »cev je začasna datoteka«

**Definicija.** **Cev** `ukaz1 | ukaz2` poveže stdout prvega procesa s stdin drugega. Oba procesa tečeta **hkrati**; jedro med njima drži majhen medpomnilnik. Ko je ta poln, prvi proces počaka; ko je prazen, čaka drugi.

Program, ki bere stdin in piše stdout, je **filter**. Ker se podatki ne shranjujejo v vmesne datoteke, cev deluje tudi za tok, ki ga ni mogoče shraniti (neskončen izpis senzorja).

**Izhodni status.** Vsak program ob koncu vrne celo število: $0$ pomeni uspeh, karkoli drugega napako. Lupina ga hrani v <code>&#36;?</code>. Operator `a && b` požene `b` le, če je `a` uspel; `a || b` le, če `a` ni uspel. Status cevi je status **zadnjega** ukaza v njej.

:::premisli
Kaj ostane v datoteki `podatki.csv` po ukazu `sort podatki.csv > podatki.csv`?
---
Nič, datoteka je prazna. Lupina najprej uredi preusmeritev in datoteko izprazni, šele nato zažene `sort`, ki prebere prazno datoteko. Pravilno je `sort -o podatki.csv podatki.csv` ali urejanje v začasno datoteko in nato `mv`.
:::

## Rešeni primeri

Vsi primeri uporabljajo datoteko `meritve.csv` z izmišljenimi dnevnimi meritvami treh vremenskih postaj (glava in $11$ vrstic):

```
datum,postaja,tmax,padavine
2025-07-01,Ljubljana,31.2,0.0
2025-07-01,Koper,30.4,0.0
2025-07-01,Maribor,32.0,0.0
2025-07-02,Ljubljana,33.5,0.0
2025-07-02,Koper,31.1,0.0
2025-07-02,Maribor,29.8,4.2
2025-07-03,Ljubljana,28.4,12.6
2025-07-03,Koper,29.9,0.0
2025-07-03,Maribor,27.1,18.0
2025-07-04,Ljubljana,30.6,0.0
2025-07-04,Maribor,31.4,0.0
```

Decimalna pika je tu del zapisa v datoteki, kot ga berejo programi.

### Primer 1 (lažji): pravice za skupno raziskovalno mapo

Skupina za podnebne podatke ima datoteko `meritve.csv` in skripto `uvoz.sh`. Lastnik naj lahko vse, člani skupine naj meritve berejo, skripto berejo in poganjajo, ostali nič. Kateri osmiški pravici nastaviš? Kaj pomeni `-rw-r-----`? Kakšne pravice dobi nova datoteka pri `umask 027`?

**Podatki:** zahteve za datoteko: u `rw`, g `r`, o nič; za skripto: u `rwx`, g `rx`, o nič; umask `027`; privzeto `666` za datoteke in `777` za imenike
**Iščemo:** ukaza `chmod`, pomen izpisa, pravice nove datoteke in imenika

:::formula
števka razreda $= 4r + 2w + x$, kjer so $r, w, x \in \{0, 1\}$; nove pravice: privzete brez bitov, ki so v umasku
:::

**Rešitev:**

1. Meritve: u $4 + 2 = 6$, g $4$, o $0$, torej `chmod 640 meritve.csv`.
2. Skripta: u $4 + 2 + 1 = 7$, g $4 + 1 = 5$, o $0$, torej `chmod 750 uvoz.sh`.
3. `-rw-r-----` je navadna datoteka (`-`) s pravicami `rw-` (6), `r--` (4), `---` (0), torej `640`, kar je ravno prva zahteva.
4. Umask `027` odvzame skupini `w` (2), ostalim vse (7). Datoteka: od `666` ostane `640`. Imenik: od `777` ostane `750`. Preizkus z `touch` in `stat -c '%a'` res izpiše `640` in `750`.
5. Odgovor: `chmod 640 meritve.csv`, `chmod 750 uvoz.sh`; pri `umask 027` dobijo nove datoteke `640`, novi imeniki `750`.

### Primer 2: kam gre izpis

Predvidi vsebino datotek po ukazih in nato preveri (datoteka `ni.csv` ne obstaja):

```
echo prva > a.txt
echo druga > a.txt
echo tretja >> a.txt
ls meritve.csv ni.csv \
  > izpis.txt 2> napake.txt
```

Kolikšen je izhodni status zadnjega ukaza?

**Podatki:** zaporedje štirih ukazov, `meritve.csv` obstaja, `ni.csv` ne
**Iščemo:** vsebino `a.txt`, `izpis.txt`, `napake.txt` in <code>&#36;?</code>

:::formula
`>` izprazni in piše, `>>` dodaja na konec, `2>` preusmeri stderr; status $0$ pomeni uspeh
:::

**Rešitev:**

1. Prvi ukaz zapiše `prva`. Drugi datoteko izprazni in zapiše `druga`, zato `prva` izgine.
2. Tretji doda `tretja` na konec. V `a.txt` sta vrstici `druga` in `tretja`.
3. `ls` izpiše ime obstoječe datoteke na stdout, zato je v `izpis.txt` vrstica `meritve.csv`.
4. Sporočilo o neobstoječi datoteki (`cannot access 'ni.csv'`, v slovenskem okolju prevedeno) gre na stderr, torej v `napake.txt`.
5. Ker en argument ni uspel, `ls` vrne neničeln status; v GNU `ls` je to $2$.
6. Odgovor: `a.txt` vsebuje `druga` in `tretja`, `izpis.txt` ime `meritve.csv`, `napake.txt` sporočilo o napaki, <code>&#36;?</code> je $2$.

### Primer 3 (težji): vroči dnevi po postajah

Iz `meritve.csv` ugotovi: (a) koliko meritev ima vsaka postaja, urejeno po številu; (b) tri najtoplejše meritve; (c) koliko vročih dni ($t_\mathrm{max} \ge 30\,^\circ\mathrm C$) je imela vsaka postaja. Glava se ne sme šteti.

**Podatki:** `meritve.csv` z glavo in $11$ vrsticami; polja ločena z vejico: datum, postaja, tmax, padavine
**Iščemo:** tri cevi in njihove izpise

:::formula
`tail -n +2` preskoči glavo, `cut -d, -fN` izbere polje, `sort | uniq -c` prešteje enake vrstice, `sort -t, -kN -nr` uredi po polju številsko padajoče, `grep -E` izbere vrstice po vzorcu
:::

**Rešitev:**

1. (a) Izberemo polje 2, uredimo (ker `uniq` združi le *sosednje* enake vrstice), preštejemo in uredimo po številu:

```
tail -n +2 meritve.csv |
  cut -d, -f2 | sort |
  uniq -c | sort -nr
```

   Izpis: `4 Maribor`, `4 Ljubljana`, `3 Koper`.

2. (b) Urejamo cele vrstice po tretjem polju:

```
tail -n +2 meritve.csv |
  sort -t, -k3 -nr |
  head -n 3
```

   Izpis: Ljubljana $33{,}5$ (2. 7.), Maribor $32{,}0$ (1. 7.), Maribor $31{,}4$ (4. 7.).

3. (c) Vroč dan je vrstica, kjer se tretje polje začne s `3` in ima dve števki pred piko. Ker so vse vrednosti pod $40$, zadošča vzorec `,3[0-9]\.[0-9],`:

```
grep -E ',3[0-9]\.[0-9],' \
  meritve.csv | cut -d, -f2 |
  sort | uniq -c | sort -nr
```

   Izpis: `3 Ljubljana`, `2 Maribor`, `2 Koper`; skupaj $3 + 2 + 2 = 7$ vročih dni. Glave ni treba odstraniti, ker se z vzorcem ne ujema.
4. Zakaj ne `uniq -c` brez `sort`: vrstice so urejene po datumu, zato bi se ista postaja pojavila večkrat ločeno.
5. Odgovor: Maribor in Ljubljana imata po $4$ meritve, Koper $3$; najtoplejša je Ljubljana 2. 7. s $33{,}5\,^\circ\mathrm C$; vročih dni je imela Ljubljana $3$, Maribor in Koper po $2$. Vzorec bi za vrednosti od $40$ naprej moral zajeti tudi `4[0-9]`.

### Primer 4 – zdaj ti: urejanje na mestu

Sodelavec je želel datoteko `kopija.csv` (kopija `meritve.csv`, $12$ vrstic) urediti z ukazom `sort kopija.csv > kopija.csv`. Po ukazu ima datoteka $0$ bajtov. Pojasni in popravi.

**Podatki:** `kopija.csv` z $12$ vrsticami, ukaz `sort kopija.csv > kopija.csv`, rezultat $0$ bajtov
**Iščemo:** vzrok in pravilen ukaz

:::formula
vrstni red obdelave: razčlenitev → razširitve → preusmeritve → zagon programa
:::

**Rešitev:**

1. Lupina pred zagonom `sort` obdela preusmeritev `> kopija.csv`.
2. `>` datoteko odpre za pisanje in jo izprazni.
3. Dokončaj: kaj prebere `sort` in kateri ukaz naredi, kar je sodelavec želel?

:::premisli
Kaj prebere `sort` in kako je prav?
---
`sort` prebere že prazno datoteko in ne izpiše ničesar, zato ostane $0$ bajtov. Pravilno: `sort -o kopija.csv kopija.csv` (`sort` najprej prebere vse in šele nato piše) ali `sort kopija.csv > tmp && mv tmp kopija.csv`. Po popravku ima datoteka spet $12$ vrstic; glava se pri tem uredi med podatke, zato jo je bolje prej odstraniti s `tail -n +2`.
:::

## Pogoste napake

- **»Zvezdico razume ukaz.«** Nadomestne znake razširi lupina, preden zažene program. Zato `'*.csv'` v narekovajih ostane zvezdica, `rm *` pa izbriše vse, kar lupina našteje.
- **`>` namesto `>>`.** Enojni `>` datoteko vedno najprej izprazni. Dnevnik meritev, ki ga skripta piše z `>`, ima vedno le zadnjo vrstico.
- **Vrstni red `2>&1`.** `ukaz 2>&1 > f` pošlje napake na zaslon; za oboje v datoteko piši `ukaz > f 2>&1`.
- **`uniq` brez `sort`.** `uniq` združi le zaporedne enake vrstice.
- **Pravice samo na datoteki.** Za dostop do datoteke potrebuješ `x` na vsakem imeniku poti; brisanje je odvisno od pravic imenika.

## Povzetek

- Lupina vrstico razčleni na besede, naredi razširitve (`~`, <code>&#36;IME</code>, <code>&#36;(…)</code>, `*`, `?`, `[…]`), uredi preusmeritve in zažene program.
- Pravice `rwx` za lastnika, skupino in ostale; osmiško $r = 4$, $w = 2$, $x = 1$; `x` na imeniku pomeni vstop; umask odvzame bite od `666` oziroma `777`.
- Opisniki: $0$ stdin, $1$ stdout, $2$ stderr. `>` izprazni, `>>` doda, `2>` napake, `> f 2>&1` oboje; preusmeritve od leve proti desni.
- Cev `a | b` poveže stdout z stdin, procesa tečeta hkrati; filtri `grep`, `cut`, `sort`, `uniq -c`, `wc`, `head`, `tail`.
- Izhodni status v <code>&#36;?</code>, $0$ je uspeh; `&&` in `||`; status cevi je status zadnjega ukaza.

## Za izpit

Znati moraš povedati:

- vrstni red, v katerem lupina obdela ukazno vrstico, in posledice (narekovaji, `sort f > f`);
- pomen `r`, `w`, `x` za datoteko in za imenik, osmiški zapis in umask;
- tri standardne opisnike in vse oblike preusmeritev, vključno z razliko `> f 2>&1` in `2>&1 > f`;
- kaj je cev, zakaj procesa tečeta hkrati in kaj je filter;
- izhodni status, `&&`, `||` in status cevi.

### Naloga 1

V imeniku so `meritve.csv` (kot zgoraj) in nobena datoteka `manjka.csv`. Datoteka `porocilo.txt` na začetku ne obstaja. Izvedemo:

```
grep -q Kredarica meritve.csv &&
  echo "ok" || echo "manjka" \
  >> porocilo.txt 2>&1
cut -d, -f2 manjka.csv |
  sort -u > postaje.txt \
  2>> porocilo.txt
```

Na koncu izpišemo izhodni status zadnje cevi (<code>echo &#36;?</code>).

(a) Kaj je v `porocilo.txt` in v `postaje.txt`? (b) Kaj izpiše zadnji ukaz in zakaj? (c) Kako bi dosegel, da je status cevi neničeln, če katerikoli ukaz v njej ne uspe? (d) Z eno cevjo izračunaj, koliko različnih dni brez padavin je v `meritve.csv`, in navedi število vrstic po vsakem koraku.

**Rešitev:**

1. (a) `grep -q` ne najde Kredarice in vrne $1$, zato se `echo "ok"` ne izvede, izvede pa se `echo "manjka"`. Preusmeritev `>>` velja le za ta zadnji `echo`, zato `porocilo.txt` dobi vrstico `manjka`.
2. V drugi cevi `2>> porocilo.txt` stoji ob `sort`, ne ob `cut`. Napaka `cut` (datoteka ne obstaja) gre zato na zaslon, ne v poročilo. `sort` dobi prazen vhod, zato je `postaje.txt` prazna ($0$ bajtov).
3. (b) Izpiše $0$: status cevi je status zadnjega ukaza `sort`, ki je uspel, čeprav `cut` ni.
4. (c) Pred cevjo `set -o pipefail`; tedaj je status cevi status zadnjega neuspelega ukaza. Napako `cut` v poročilo ujamemo z `cut … 2>> porocilo.txt`.
5. (d) Cev in število vrstic:

<pre><code>tail -n +2 meritve.csv |
  grep ',0\.0&#36;' |
  cut -d, -f1 | sort -u | wc -l
</code></pre>

   `tail` da $11$ vrstic, `grep` obdrži $8$ suhih meritev ($11 - 3 = 8$), `cut` jih obdrži $8$ (samo datumi), `sort -u` pusti $4$ različne datume, `wc -l` izpiše $4$.
6. Odgovor: (a) `porocilo.txt` vsebuje `manjka`, `postaje.txt` je prazna; (b) $0$; (c) `set -o pipefail`; (d) $4$ dnevi (vsak dan je bila vsaj ena postaja brez padavin).

### Naloga 2

Natančno opiši, kako bash obdela vrstico `ls -l ~/podatki/*.csv > seznam.txt 2>&1`. Utemelji, zakaj `ls -l ~/podatki/*.csv 2>&1 > seznam.txt` da drugačen rezultat. Pojasni, katere pravice potrebuje uporabnik, da sme izbrisati datoteko `~/podatki/a.csv`.

**Rešitev:**

1. Razčlenitev na besede: `ls`, `-l`, `~/podatki/*.csv`, `>`, `seznam.txt`, `2>&1`.
2. Razširitve: `~` postane domači imenik, npr. `/home/ana`; vzorec `*.csv` postane seznam vseh datotek s končnico `.csv` v tem imeniku (ali ostane nespremenjen, če jih ni).
3. Preusmeritve od leve proti desni: opisnik $1$ se odpre na `seznam.txt` (datoteka se izprazni); `2>&1` naredi opisnik $2$ kopijo opisnika $1$, torej tudi `seznam.txt`.
4. Lupina zažene `ls` z argumenti `-l` in razširjenimi imeni. `ls` sam ne vidi ne `~`, ne `*`, ne preusmeritev.
5. Pri `2>&1 > seznam.txt` se najprej $2$ kopira na trenutni cilj $1$, to je zaslon; šele nato $1$ kaže na datoteko. Napake gredo na zaslon, seznam v datoteko.
6. Brisanje: `rm` spremeni imenik `podatki` (odstrani vnos), zato je potreben `w` in `x` na `~/podatki` ter `x` na vseh imenikih nad njim. Pravice datoteke same niso pomembne (`rm` le vpraša, če datoteka nima `w`). Izjema je imenik z lepljivim bitom (`t`, npr. `/tmp`): tam sme datoteko izbrisati le njen lastnik ali lastnik imenika.

## Drugače: Na sliki

Cev si predstavljaj kot tekoči trak v sortirnici.

```
datoteka -> [tail] -> [grep]
  12          11        8
  -> [cut] -> [sort -u] -> [wc]
       8          4         "4"
```

Pod vsako postajo traku je število vrstic, ki jo zapustijo (podatki iz Naloge 1). Vsi delavci delajo hkrati: `grep` ne čaka, da `tail` konča, temveč pobira vrstice, takoj ko prispejo. Izjema je `sort`: urediti ne more, dokler ne vidi zadnje vrstice, zato vse zbere in šele nato pošlje naprej. Stderr je stranski izhod ob vsakem delavcu, ki se ne priključi na trak.

## Drugače: Korak za korakom s številkami

Osmiški zapis pravic je trimestno število v osnovi $8$, vsaka števka so trije biti.

1. `rwxr-x---` razdelimo na `rwx`, `r-x`, `---`.
2. Bite zapišemo kot $1$ ali $0$: $111$, $101$, $000$.
3. Vsako trojko pretvorimo: $1 \cdot 4 + 1 \cdot 2 + 1 = 7$, $1 \cdot 4 + 0 \cdot 2 + 1 = 5$, $0$.
4. Rezultat `750`.
5. Umask `022` v bitih je $000\,010\,010$. Privzete pravice `666` so $110\,110\,110$. Kjer ima umask $1$, postavimo $0$: $110\,100\,100$, to je `644`.

Opazi, da umask ni odštevanje: `666` z umaskom `027` da `640`. Osmiško odštevanje $666 - 027$ bi dalo `637`, kjer bi ostali dobili `rwx`, čeprav jim umask vse odvzame. Odstranijo se le biti, ki so bili prižgani.

## Drugače: Uporaba v stroki

- **Podnebne in okoljske podatkovne zbirke.** Meritve postaj, satelitski podatki in rezultati modelov so pogosto v tisočih besedilnih datotekah. Prvi pregled (koliko datotek, katere postaje, manjkajoče vrednosti) naredimo s cevmi `find`, `grep`, `cut`, `sort`, `uniq`, preden podatke naložimo v Python ali R.
- **Strežniki in računski grozdi.** Na strežnikih in superračunalnikih ni grafičnega vmesnika. Naloge za računski grozd so skripte bash, dnevniki pa se pregledujejo z `tail -f dnevnik | grep NAPAKA`.
- **Varnost.** Pravice in umask določajo, kdo vidi osebne podatke na skupnem strežniku. Napaka `chmod 777` je pogost vzrok za uhajanje podatkov.
- **Razvoj programske opreme.** Prevajanje in preizkušanje programov v C teče iz lupine; samodejni preizkusi preverjajo izhodni status (`make && ./test || echo napaka`).

## Preveri se

? Kateri od teh programov ne spada med filtre?
- `grep`
~ `grep` bere stdin ali datoteko in na stdout piše izbrane vrstice: filter.
- `sort`
~ `sort` bere vrstice in piše urejene: filter.
+ `cd`
- `wc`
~ `wc` bere vhod in piše število vrstic, besed in znakov: filter.
> `cd` ni program, ki bi bral in pisal tokove, temveč vgrajen ukaz lupine, ki spremeni njen trenutni imenik.

? Kolikšen je osmiški zapis pravic `rwxr-xr--`?
- `751`
~ Zadnja trojka `r--` je $4$, ne $1$: $r$ ima vrednost $4$.
+ `754`
- `764`
~ Srednja trojka `r-x` je $4 + 1 = 5$, ne $6$.
- `732`
~ Zamenjal si vrednosti `r` in `w` ($r = 2$, $w = 4$): tako bi bil `r-x` $3$ in `r--` $2$; prav je $r = 4$, $w = 2$.
> `rwx` $= 7$, `r-x` $= 5$, `r--` $= 4$.

? Skripta vsak dan zapiše povzetek meritev z <code>echo "&#36;povzetek" &gt; dnevnik.txt</code>. Kaj je posledica?
- Dnevnik raste z vsakim dnem.
~ To bi veljalo za `>>`; enojni `>` datoteko vsakič izprazni.
- Lupina javi napako, ker datoteka že obstaja.
~ Bash privzeto obstoječe datoteke prepiše brez vprašanja (razen z `set -o noclobber`).
+ V dnevniku je vedno le zadnji povzetek.
- Povzetki se zapišejo na zaslon in v datoteko.
~ Preusmeritev pošlje stdout samo v datoteko; za oboje bi rabil `tee`.
> `>` izprazni datoteko pred vsakim pisanjem; za dodajanje uporabi `>>`.

? Študent šteje meritve po postajah: (1) `tail -n +2 meritve.csv` odstrani glavo; (2) `cut -d, -f2` izbere postajo; (3) `uniq -c` prešteje; (4) `sort -nr` uredi po številu. Kateri korak je napačen?
- korak 1
~ `tail -n +2` res izpiše od druge vrstice naprej.
- korak 2
~ Postaja je drugo polje, ločilo je vejica: pravilno.
+ korak 3, ker pred `uniq -c` manjka `sort`
- korak 4
~ `sort -nr` številsko padajoče uredi vrstice s števci: pravilno.
> `uniq` združi le sosednje enake vrstice; vrstice so urejene po datumu, zato je treba pred `uniq -c` urediti.

? Raziskovalka shrani rezultate podnebnega modela v `~/projekt/rezultati.nc` s pravicami `644`. Sodelavec iz iste skupine javi »Permission denied«, ko jo želi prebrati. Imenik `~/projekt` ima `700`. Kaj je vzrok?
+ Skupina nima pravice `x` na imeniku `~/projekt`, zato do datoteke ne more priti.
- Datoteka nima pravice `x` za skupino.
~ Za branje datoteke `x` na datoteki ni potreben; potreben je `r`, ki ga skupina ima.
- Datoteka ima končnico `.nc`, ki je Linux ne pozna.
~ Linux pravic ne določa po končnici.
- Sodelavec bi moral uporabiti `cat` namesto drugega programa.
~ Program ni pomemben; jedro preveri pravice na vsakem imeniku poti.
> Imenik `700` dovoli vstop samo lastniku. Rešitev je `chmod 750 ~/projekt` (in `x` na imenikih nad njim).

:::simboli
r | pravica branja | | | $4$ v osmiškem zapisu
w | pravica pisanja | | | $2$ v osmiškem zapisu
x | pravica izvajanja ali vstopa v imenik | | | $1$ v osmiškem zapisu
:::
