---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Uganka za začetek. Oblikovalec dodatkov za telefone ti pošlje dve skici majhnega stojala. Ko stojalo gledaš od spredaj, vidiš kvadrat s stranico $40\,\mathrm{mm}$. Ko ga gledaš od zgoraj, vidiš spet kvadrat s stranico $40\,\mathrm{mm}$. Kakšno je stojalo? Preden bereš naprej, poišči vsaj tri različna telesa, ki se ujemajo z obema skicama.

Kocka je prva, ki pride na misel. Ustreza pa tudi klin: trikotna prizma, ki ima spredaj in zgoraj kvadraten obris, ob strani pa pravokoten trikotnik. Ustreza četrtina valja in še marsikaj. Vse te oblike se razlikujejo šele, ko pogledaš od strani.

Uganka pokaže bistvo teme. Ena slika, ki jo »sploščimo« na papir, izgubi eno razsežnost. Tehnična risba mora telo opisati tako, da ga delavec ali CNC-stroj izdela brez ugibanja. Zato rišemo več pogledov po strogih pravilih, za hiter vtis o obliki pa dodamo aksonometrijo.

## Razlaga

**1. Fotografija in pravokotna projekcija.** Telefon v žepu že zna narediti sliko telesa. Pri fotografiji gredo vsi svetlobni žarki skozi eno točko, objektiv. Taki preslikavi rečemo **središčna projekcija**: bližnji rob je na sliki daljši od enako dolgega oddaljenega, vzporedni robovi se stekajo.

Pri **pravokotni projekciji** si zamislimo, da so **projekcijski žarki** vzporedni med seboj in pravokotni na **projekcijsko ravnino** (ravnino risbe). Vsaka točka telesa se preslika naravnost na ravnino. Razlike so zbrane v tabeli:

| Lastnost | Fotografija | Pravokotna projekcija |
|---|---|---|
| žarki | skozi eno točko | vzporedni |
| vzporedni robovi | se stekajo | ostanejo vzporedni |
| mere | odvisne od oddaljenosti | prave za ploskve, vzporedne ravnini |
| globina | se vidi | se izgubi |

Zadnja vrstica je cena za prave mere. Iz enega pogleda ne razbereš globine, kar je natanko težava iz uganke.

**2. Trije glavni pogledi.** Telo postavimo tako, da so njegove glavne ploskve vzporedne s tremi med seboj pravokotnimi ravninami. Nato ga projiciramo na vsako posebej:

- **naris** (pogled od spredaj) pokaže širino in višino; izberemo ga tako, da pove o obliki največ;
- **tloris** (pogled od zgoraj) pokaže širino in globino;
- **stranski ris** (pogled z leve) pokaže globino in višino.

Vsaka mera se torej pojavi v dveh pogledih. Naris in tloris imata skupno širino, naris in stranski ris skupno višino. Robove, ki jih v pogledu zakriva telo, narišemo s črtkano črto, kot določa standard za vrste črt.

:::premisli
Stojalo iz uganke je lahko tudi četrtina valja. Kakšen bo njen stranski ris in katero mero bo imel skupno s tlorisom?
---
Četrtina kroga s polmerom $40\,\mathrm{mm}$; v narisu in tlorisu se ukrivljenost ne vidi. Skupna mera s tlorisom je globina, $40\,\mathrm{mm}$: tloris in stranski ris oba kažeta, kako globoko je telo.
:::

Vseh mogočih smeri pogleda pravokotno na ploskve kvadra je šest: od spredaj, zgoraj, leve, desne, spodaj in zadaj. Na risbo damo le toliko pogledov, kot jih potrebujemo, da je oblika nedvoumna. Za ploščat telefon pogosto zadoščata dva, za stojalo iz uganke potrebujemo tri.

**3. Razporeditev pogledov.** Pogledov ne rišemo kamorkoli. Navpična in vodoravna projekcijska ravnina razdelita prostor na štiri dele, **kvadrante**. Standard pozna dve postavitvi, ki se razlikujeta po tem, v katerem kvadrantu stoji telo:

- **Evropska postavitev** (metoda E, prvi kvadrant). Telo je med opazovalcem in ravnino, slika pade na ravnino *za* telesom, kot senca. Tloris zato leži *pod* narisom, pogled z leve *desno* od narisa.
- **Ameriška postavitev** (metoda A, tretji kvadrant). Ravnina je med opazovalcem in telesom, kot steklo izložbe. Tloris leži *nad* narisom, pogled z leve *levo* od narisa.

Katero postavitev risba uporablja, pove simbol prisekanega stožca v naslovnem polju. V Evropi je običajna metoda E.

Ravnini si zamisli kot dve steni škatle. Po projiciranju ju **razgrnemo** v ravnino risbe: vodoravna se zavrti okoli roba, ki ga ima skupnega z navpično.

:::premisli
V evropski postavitvi je v tlorisu sprednja stran telesa obrnjena *stran* od narisa, torej navzdol. Zakaj?
---
Vodoravna ravnina se pri razgrnitvi zavrti okoli roba, kjer se stika z navpično ravnino, ta pa je *za* telesom. Zadnja stran telesa je ob tem robu, torej ob narisu, sprednja pa najdlje od njega.
:::

Med pogledi pustimo enak razmik. Skupne mere morajo biti poravnane: tloris je navpično pod narisom, stranski ris je v isti višini.

**4. Aksonometrija.** Trije pogledi so natančni, a jih moraš v glavi sestaviti. Aksonometrija naredi nasprotno: telo zavrtimo glede na ravnino, da v *eni* pravokotni projekciji vidimo tri ploskve hkrati. Robove, vzporedne s tremi osmi telesa, nanašamo vzdolž treh **aksonometričnih osi**.

- **Izometrija**: vse tri osi oklepajo $120^\circ$; os višine je navpična, osi širine in globine sta $30^\circ$ nad vodoravnico. Vse tri smeri se skrajšajo enako, s faktorjem $k \approx 0{,}82$. V praksi rišemo **poenostavljeno izometrijo** z $k = 1$: mere nanašamo nespremenjene, slika je zato malo povečana.
- **Dimetrija**: ena os je $7^\circ$ nad vodoravnico z merilom $1$, druga, os globine, $42^\circ$ nad vodoravnico z merilom $\tfrac{1}{2}$. Globino zato nanesemo na polovico.

Prave mere veljajo le vzdolž osi. Poševnega roba ali diagonale na aksonometrični sliki ne meriš z ravnilom.

## Rešeni primeri

### Primer 1: pogledi telefona

Pametni telefon je kvader: širina $71\,\mathrm{mm}$, višina $147\,\mathrm{mm}$, globina $8\,\mathrm{mm}$. Narišemo ga v merilu $1 : 1$, za naris izberemo pogled na zaslon. Kakšne mere imajo naris, tloris in stranski ris?

**Podatki:** širina $a = 71\,\mathrm{mm}$, višina $h = 147\,\mathrm{mm}$, globina $c = 8\,\mathrm{mm}$, merilo $1 : 1$
**Iščemo:** mere pravokotnikov v treh pogledih

:::formula
Naris: $a \times h$; tloris: $a \times c$; stranski ris: $c \times h$
:::

**Rešitev:**

1. Naris kaže zaslon, torej širino in višino: pravokotnik $71\,\mathrm{mm} \times 147\,\mathrm{mm}$.
2. Tloris gleda na zgornji rob telefona, vidimo širino in globino: $71\,\mathrm{mm} \times 8\,\mathrm{mm}$.
3. Stranski ris gleda na levi rob, vidimo globino in višino: $8\,\mathrm{mm} \times 147\,\mathrm{mm}$.
4. Preverimo skupne mere: $71\,\mathrm{mm}$ je v narisu in tlorisu, $147\,\mathrm{mm}$ v narisu in stranskem risu, $8\,\mathrm{mm}$ v tlorisu in stranskem risu.
5. Odgovor: pogledi so pravokotniki $71 \times 147$, $71 \times 8$ in $8 \times 147$ (v mm).

### Primer 2: prostor na listu

Stojalo za telefon je široko $80\,\mathrm{mm}$, visoko $60\,\mathrm{mm}$ in globoko $50\,\mathrm{mm}$. Narišemo naris, tloris in pogled z leve v merilu $1 : 1$ v evropski postavitvi, z razmikom $20\,\mathrm{mm}$ med pogledi. Kje leži kateri pogled in kolikšen pravokotnik na listu zavzame skupina pogledov?

**Podatki:** $a = 80\,\mathrm{mm}$, $h = 60\,\mathrm{mm}$, $c = 50\,\mathrm{mm}$, razmik $d = 20\,\mathrm{mm}$, metoda E
**Iščemo:** postavitev pogledov, skupno širino $B$ in višino $H$

:::formula
$B = a + d + c$, $H = h + d + c$
:::

**Rešitev:**

1. Metoda E: tloris pod narisom, pogled z leve desno od narisa.
2. V vodoravni vrsti sta naris (širok $a$) in stranski ris (širok $c$, ker kaže globino): $B = 80 + 20 + 50 = 150\,\mathrm{mm}$.
3. V navpičnem stolpcu sta naris (visok $h$) in tloris (visok $c$, ker kaže globino): $H = 60 + 20 + 50 = 130\,\mathrm{mm}$.
4. Odgovor: naris je levo zgoraj, tloris pod njim, stranski ris desno od narisa. Skupina zavzame $150\,\mathrm{mm} \times 130\,\mathrm{mm}$ in brez težav pride na list A4.

### Primer 3: škatla slušalk v aksonometriji

Škatla brezžičnih slušalk je široka $60\,\mathrm{mm}$, visoka $30\,\mathrm{mm}$ in globoka $50\,\mathrm{mm}$. Za navodila jo narišemo v poenostavljeni izometriji, za primerjavo še v dimetriji z globino na osi $42^\circ$. (a) Kako dolge so narisane stranice v obeh slikah? (b) Kolikšna sta širina in višina izometrične slike na papirju?

**Podatki:** $a = 60\,\mathrm{mm}$, $h = 30\,\mathrm{mm}$, $c = 50\,\mathrm{mm}$; izometrija $k = 1$, osi $30^\circ$; dimetrija: merilo $1$ na osi $7^\circ$, $\tfrac{1}{2}$ na osi $42^\circ$
**Iščemo:** narisane dolžine robov, širino $B$ in višino $H$ izometrične slike

:::formula
Dimetrija: $c' = \tfrac{1}{2} c$; izometrija: $B = (a + c)\cos 30^\circ$, $H = h + (a + c)\sin 30^\circ$
:::

**Rešitev:**

1. Poenostavljena izometrija: vse mere nanesemo nespremenjene, robovi so $60$, $30$ in $50\,\mathrm{mm}$.
2. Dimetrija: širina na osi $7^\circ$ ostane $60\,\mathrm{mm}$, višina navpično $30\,\mathrm{mm}$, globina na osi $42^\circ$ se razpolovi: $c' = 0{,}5 \cdot 50 = 25\,\mathrm{mm}$.
3. Izometrija, širina slike: širina in globina gresta poševno pod $30^\circ$, vsaka v svojo stran, zato se njuni vodoravni deli seštejejo. $B = 110 \cdot \cos 30^\circ \approx 95{,}3\,\mathrm{mm}$.
4. Višina slike: navpični rob plus dva navpična dela poševnih robov, $H = 30 + 110 \cdot \sin 30^\circ = 30 + 55 = 85\,\mathrm{mm}$.
5. Odgovor: v izometriji so robovi $60$, $30$, $50\,\mathrm{mm}$, v dimetriji $60$, $30$ in $25\,\mathrm{mm}$. Izometrična slika zasede približno $95\,\mathrm{mm} \times 85\,\mathrm{mm}$.

### Primer 4: zdaj ti

Powerbank ima naris v obliki pravokotnika $90\,\mathrm{mm} \times 20\,\mathrm{mm}$ (širina × višina), tloris pa $90\,\mathrm{mm} \times 60\,\mathrm{mm}$ (širina × globina). Kakšen je pogled z leve in kam ga postaviš v evropski postavitvi?

**Podatki:** naris $90 \times 20\,\mathrm{mm}$, tloris $90 \times 60\,\mathrm{mm}$, metoda E
**Iščemo:** mere in lego stranskega risa

:::formula
Stranski ris: globina × višina
:::

**Rešitev:**

1. Višino vzamemo iz narisa: $20\,\mathrm{mm}$.
2. Globino vzamemo iz tlorisa: $60\,\mathrm{mm}$.
3. Sestavi mere in določi lego, nato preveri:

:::premisli
Kakšen je stranski ris in kje leži?
---
Pravokotnik $60\,\mathrm{mm} \times 20\,\mathrm{mm}$ (globina × višina). V metodi E leži desno od narisa, v isti višini kot naris.
:::

## Pogoste napake

- **Tloris nad narisom.** Kdor je videl ameriške risbe, tloris postavi nad naris in pogled z leve levo. Ob metodi E je to napačno, ker v prvem kvadrantu slika pade za telo. Popravek: najprej poglej simbol v naslovnem polju, nato razporedi.
- **Globina obrnjena proti narisu.** V metodi E je sprednja stran telesa v tlorisu spodaj, v pogledu z leve pa desno, torej stran od narisa. Kdor jo obrne proti narisu, nariše zrcalno telo. Popravek: zamisli si, da se ravnini razgrneta okoli roba za telesom.
- **Dva pogleda sta vedno dovolj.** Uganka s kocko in klinom pokaže, da ne. Popravek: preveri, ali bi lahko dve različni telesi dali enaka pogleda; če da, dodaj tretjega.
- **Perspektiva v pogledu.** Kdor riše po fotografiji, nariše oddaljeni rob krajši. V pravokotni projekciji imata enako dolga robova, vzporedna z ravnino, enako dolgo sliko.
- **Merjenje vzdolž poljubne smeri v aksonometriji.** Prave mere (ali v dimetriji polovične) veljajo le vzdolž osi. Diagonala ploskve ali poševni rob na sliki nima prave dolžine. Popravek: točke konstruiraj s premiki vzdolž osi. V dimetriji ne pozabi razpoloviti globine.

## Povzetek

- Pravokotna projekcija: vzporedni žarki, pravokotni na ravnino. Ploskve, vzporedne z ravnino, imajo pravo velikost; globina se izgubi.
- Glavni pogledi: naris (širina, višina), tloris (širina, globina), stranski ris (globina, višina). Vsaka mera je v dveh pogledih.
- Rišemo toliko pogledov, da je oblika nedvoumna; nevidne robove rišemo črtkano.
- Metoda E: tloris pod narisom, pogled z leve desno. Metoda A: tloris nad narisom, pogled z leve levo. Simbol je v naslovnem polju.
- Aksonometrija pokaže tri ploskve na eni sliki. Izometrija: osi $120^\circ$, poenostavljeno $k = 1$. Dimetrija: osi $7^\circ$ in $42^\circ$, globina na polovico.
- Mere nanašamo samo vzdolž osi.

## Drugače: Na sliki

Zamisli si prozorno škatlo, v kateri lebdi telo. Na vsako steno škatle pade pravokotna slika telesa. Nato škatlo razpreš okoli robov zadnje stene z narisom in jo položiš v ravnino. V metodi E dobiš tak križ:

```
            [od spodaj]
[z desne]   [ NARIS  ]   [z leve]   [zadaj]
            [ TLORIS ]
```

Opazi tri stvari. Pogled leži na *nasprotni* strani od smeri, iz katere gledamo: pogled od zgoraj je spodaj. Pogledi v isti vrsti imajo isto višino, v istem stolpcu isto širino. Pogled od zadaj je lahko tudi skrajno levo. V metodi A stene razgrneš proti sebi, zato križ zrcališ: pogled od zgoraj je zgoraj, pogled z leve levo.

## Drugače: Iz vsakdanjega življenja

Opoldne poleti sije sonce visoko. Njegovi žarki so praktično vzporedni, zato je senca vodoravnega telefona nad mizo skoraj njegov tloris, enako velika kot telefon. Če telefon dvigneš za nekaj centimetrov, senca ostane enako velika.

Zdaj sveti z lučko drugega telefona od blizu. Žarki gredo iz ene točke in senca je večja od telefona. Bolj ko ga približaš lučki, večja je. To je središčna projekcija, kot pri fotografiji.

Aksonometrijo vidiš povsod, kjer mora ena slika pokazati obliko: na škatli sestavljivega pohištva, v navodilih za menjavo baterije, na ikonah aplikacij v izometričnem slogu. Ko pa izdelek gre v izdelavo, proizvajalec potrebuje poglede z merami.

## Drugače: Bolj natančno

Zakaj je v izometriji $k \approx 0{,}82$? Kocko gledamo v smeri njene prostorske diagonale, ki z vsemi tremi robovi oklepa enak kot. Enotski smerni vektor diagonale je $\tfrac{1}{\sqrt{3}}(1, 1, 1)$. Rob $(1, 0, 0)$ ima v smeri pogleda komponento $\tfrac{1}{\sqrt{3}}$, zato je dolžina njegove projekcije

$$k = \sqrt{1 - \tfrac{1}{3}} = \sqrt{\tfrac{2}{3}} \approx 0{,}82$$

Enako velja za vse tri robove. Poenostavljena izometrija z $k = 1$ je zato povečana za faktor $\tfrac{1}{k} \approx 1{,}22$. Oblika je enaka, le mere slike niso prave.

## Preveri se

? Katera trditev o glavnih pogledih je pravilna?
- Tloris pokaže širino in višino telesa.
~ Širino in višino pokaže naris. Tloris gleda od zgoraj, zato vidi širino in globino.
+ Naris in tloris imata skupno širino.
- Stranski ris in naris imata skupno globino.
~ Naris globine sploh ne pokaže. Naris in stranski ris imata skupno višino.
> Naris kaže širino in višino, tloris širino in globino, zato je širina skupna obema. Zato je tloris navpično poravnan z narisom.

? Kocka z robom $40\,\mathrm{mm}$ je narisana v dimetriji. Kako dolg je narisani rob na osi $42^\circ$?
- $40\,\mathrm{mm}$
~ To velja za os $7^\circ$ ali za izometrijo. V dimetriji na osi $42^\circ$ globino razpolovimo.
- $42\,\mathrm{mm}$
~ $42$ je kot osi v stopinjah, ne merilo. Merilo na tej osi je $\tfrac{1}{2}$.
+ $20\,\mathrm{mm}$
- $80\,\mathrm{mm}$
~ Merilo $1 : 2$ pomeni deljenje z $2$, ne množenje.
> Merilo na osi $42^\circ$ je $\tfrac{1}{2}$: $0{,}5 \cdot 40\,\mathrm{mm} = 20\,\mathrm{mm}$.

? Študent riše ohišje polnilnika v metodi E. (1) Za naris izbere pogled, ki pokaže vtičnico. (2) Tloris postavi pod naris, poravnan po širini. (3) Pogled z leve postavi levo od narisa, v isti višini. (4) Nevidni rob notranje odprtine nariše črtkano. Kateri korak je napačen?
- Korak 1
~ Naris naj pokaže čim več o obliki, vtičnica je dobra izbira.
- Korak 2
~ V metodi E tloris res leži pod narisom in ima z njim skupno širino.
+ Korak 3
- Korak 4
~ Nevidne robove po standardu res rišemo s črtkano črto.
> V metodi E pogled z leve leži desno od narisa, ker slika pade na ravnino za telesom. Levo bi stal v metodi A.

? Kaj ima pravokotna projekcija, česar fotografija s telefonom nima?
- Pokaže globino telesa na eni sliki.
~ Ravno nasprotno: ena pravokotna projekcija globino izgubi, zato rišemo več pogledov.
+ Enako dolga robova, vzporedna z ravnino, imata enako dolgo sliko, ne glede na oddaljenost.
- Žarki se stekajo v eno točko, zato je slika bolj naravna.
~ To opisuje fotografijo (središčno projekcijo), ne pravokotne.
> V pravokotni projekciji so žarki vzporedni, zato oddaljenost ne vpliva na velikost slike. Iz pogleda lahko odčitamo prave mere.

? Dobavitelj ohišij iz ZDA pošlje risbo, na kateri je pogled od zgoraj *nad* narisom. Kaj narediš?
- Risbo zavrnem, ker je tloris na napačnem mestu.
~ Mesto ni napačno, le druga postavitev. Risba je lahko povsem pravilna.
- Pogled nad narisom razumem kot pogled od spodaj, kot v metodi E.
~ To velja le, če risba uporablja metodo E. Zaradi takega ugibanja nastanejo zrcalni izdelki.
+ V naslovnem polju preverim simbol; verjetno je to metoda A, kjer tloris leži nad narisom.
> Ameriška metoda A postavi tloris nad naris. Katero metodo risba uporablja, pove simbol prisekanega stožca v naslovnem polju.

:::simboli
a | širina telesa | | mm
h | višina telesa | | mm
c | globina telesa | | mm
c' | narisana globina v dimetriji | c' = \tfrac{1}{2} c | mm
d | razmik med pogledi | | mm
B | širina skupine pogledov ali slike | | mm
H | višina skupine pogledov ali slike | | mm
k | faktor skrajšanja v izometriji | k = \sqrt{\tfrac{2}{3}} | – | poenostavljeno $k = 1$
:::
