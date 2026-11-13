---
stanje: osnutek
demo: diagram
avtor: AI
---

## Zakaj se tega učimo

Najprej uganka. Vremenar je dvajset dni zapored vsako jutro zapisal, kakšno je vreme. S pomeni sončno, O oblačno, D deževno:

S, D, S, O, S, S, D, O, S, D, O, S, S, O, D, S, O, D, S, O

Kakšnega vremena je bilo največ in koliko dni? Poskusi odgovoriti v desetih sekundah, preden bereš naprej.

Verjetno si začel šteti s prstom in se vmes zmedel. Podatki so pravilni, a na kupu. Ko jih uredimo, je odgovor viden takoj. Prav to delajo vremenarji, biologi, ki štejejo ptice, in vsak, ki želi iz številk hitro nekaj izvedeti.

## Razlaga

**1. Od kupa do štetja.** **Podatek** je zapisana informacija, na primer vreme enega dne. Podatke dobimo s štetjem, merjenjem ali anketo. Ko jih štejemo, za vsak podatek potegnemo eno črtico. Peto črtico potegnemo poševno čez prve štiri, da nastane **peterček**. Peterčke štejemo po pet, zato se ne zmotimo. Spodaj je tako preštet seznam iz uganke.

:::risba skica
opis: Štetje s črticami. Sončno: en peterček (štiri navpične črtice, prečrtane s poševno) in še štiri črtice, skupaj 9. Oblačno: en peterček in ena črtica, skupaj 6. Deževno: en peterček, skupaj 5.
območje: 0; 0,4 .. 7; 3,6
enota: 40
napis: 0,2; 3 | sončno | desno
črta: 2,2; 2,7 -> 2,2; 3,3 | modra
črta: 2,45; 2,7 -> 2,45; 3,3 | modra
črta: 2,7; 2,7 -> 2,7; 3,3 | modra
črta: 2,95; 2,7 -> 2,95; 3,3 | modra
črta: 2,1; 2,75 -> 3,05; 3,25 | modra debelo
črta: 3,5; 2,7 -> 3,5; 3,3 | modra
črta: 3,75; 2,7 -> 3,75; 3,3 | modra
črta: 4; 2,7 -> 4; 3,3 | modra
črta: 4,25; 2,7 -> 4,25; 3,3 | modra
napis: 6,2; 3 | 9 | desno
napis: 0,2; 2 | oblačno | desno
črta: 2,2; 1,7 -> 2,2; 2,3 | modra
črta: 2,45; 1,7 -> 2,45; 2,3 | modra
črta: 2,7; 1,7 -> 2,7; 2,3 | modra
črta: 2,95; 1,7 -> 2,95; 2,3 | modra
črta: 2,1; 1,75 -> 3,05; 2,25 | modra debelo
črta: 3,5; 1,7 -> 3,5; 2,3 | modra
napis: 6,2; 2 | 6 | desno
napis: 0,2; 1 | deževno | desno
črta: 2,2; 0,7 -> 2,2; 1,3 | modra
črta: 2,45; 0,7 -> 2,45; 1,3 | modra
črta: 2,7; 0,7 -> 2,7; 1,3 | modra
črta: 2,95; 0,7 -> 2,95; 1,3 | modra
črta: 2,1; 0,75 -> 3,05; 1,25 | modra debelo
napis: 6,2; 1 | 5 | desno
:::

Rešitev uganke: največ je bilo sončnih dni, $9$.

**2. Preglednica.** Carrollov diagram že poznaš: tabela, v katero vpišeš vsak element v pravo polje. **Preglednica** je tudi tabela, a z eno razliko. Vanjo ne pišemo posameznih elementov, ampak **koliko** jih je. V prvem stolpcu so **kategorije** (kaj štejemo), v drugem **števila** (kolikokrat se kategorija pojavi).

| Vreme | Število dni |
|---|---|
| sončno | $9$ |
| oblačno | $6$ |
| deževno | $5$ |
| **Skupaj** | $20$ |

Vrstica »Skupaj« je preizkus: $9 + 6 + 5 = 20$, toliko dni je vremenar opazoval.

:::premisli
Sošolec je preštel isti seznam in v vrstico »Skupaj« dobil $19$. Kaj mu ta vsota pove, čeprav ne vidiš njegovih črtic?
---
Da je en dan izpustil. Vsak dan ima natanko eno vreme, zato mora biti vsota enaka številu dni, $20$. Ponovno mora prešteti.
:::

**3. Stolpčni prikaz.** Preglednica pove natančna števila, a primerjati jih moraš sam. **Stolpčni prikaz** pokaže ista števila kot sliko: vsaka kategorija dobi **stolpec**, njegova višina je enaka številu. Kar si v preglednici bral, zdaj vidiš.

:::risba stolpci
opis: Stolpčni prikaz »Vreme v 20 dneh«. Na navpični osi je število dni od 0 do 9. Stolpci: sončno 9, oblačno 6, deževno 5.
podnapis: Vreme v 20 dneh
os: število dni
korak: 1
stolpec: sončno | 9
stolpec: oblačno | 6
stolpec: deževno | 5
:::

Dober stolpčni prikaz ima naslov, kategorije na **vodoravni osi**, števila na **navpični osi**, oznako osi (»število dni«), enako široke stolpce in navpično os, ki se začne pri $0$. Samo če se os začne pri $0$, je dvakrat višji stolpec res dvakrat večje število.

**4. Merilo.** Na kvadratkastem papirju en kvadratek ne pomeni vedno enega dneva. Pri večjih številih izberemo **merilo**, na primer $1$ kvadratek pomeni $2$ dneva. Višino stolpca v kvadratkih dobimo z deljenjem, vrednost iz višine pa z množenjem:

$$\text{višina} = \text{vrednost} : \text{merilo}$$

$$\text{vrednost} = \text{višina} \cdot \text{merilo}$$

**5. Črtični prikaz.** Primerjajmo ga s stolpčnim prikazom. Podobnost: vsaka kategorija ima svoje mesto na vodoravni osi, višina pove število. Razlika: namesto debelega stolpca narišemo tanko navpično **črtico** in na njen vrh piko. Bere se enako kot stolpčni prikaz. Ker so črtice tanke, gre na os veliko kategorij, na primer vsi dnevi v tednu.

:::risba graf
opis: Črtični prikaz »Temperatura opoldne«. Na vodoravni osi so dnevi od ponedeljka do petka, na navpični stopinje Celzija od 0 do 20. Črtice so visoke: ponedeljek 12, torek 15, sreda 15, četrtek 18, petek 14. Vrhovi so povezani s črtkano črto.
x: 0 .. 6 | 1 | dan
y: 0 .. 20 | 2 | °C
oznake: ne
oznakax: 1 | pon
oznakax: 2 | tor
oznakax: 3 | sre
oznakax: 4 | čet
oznakax: 5 | pet
oznakay: 0 | 0
oznakay: 4 | 4
oznakay: 8 | 8
oznakay: 12 | 12
oznakay: 16 | 16
oznakay: 20 | 20
črta: 1; 0 -> 1; 12 | modra debelo
črta: 2; 0 -> 2; 15 | modra debelo
črta: 3; 0 -> 3; 15 | modra debelo
črta: 4; 0 -> 4; 18 | modra debelo
črta: 5; 0 -> 5; 14 | modra debelo
črta: 1; 12 -> 2; 15 -> 3; 15 -> 4; 18 -> 5; 14 | siva črtkano
točka: 1; 12 | 12 | nad | modra
točka: 2; 15 | 15 | nad | modra
točka: 3; 15 | 15 | nad | modra
točka: 4; 18 | 18 | nad | modra
točka: 5; 14 | 14 | nad | modra
:::

Ko si kategorije sledijo **po času**, lahko vrhove po vrsti povežemo (na sliki črtkano). Povezava pokaže potek: kjer se dviga, vrednosti **naraščajo**, kjer se spušča, **padajo**, vodoravna pomeni, da so **enake**. Med torkom in sredo je vodoravna, ker je bilo oba dneva $15\,^\circ\text{C}$.

:::premisli
Na prikaz z vrstami ptic na krmilnici (sinice, vrabci, kosi) bi nekdo rad dodal črto, ki povezuje vrhove črtic. Ali ima ta črta smisel? Zakaj?
---
Nima. Med sinicami in vrabci ni nobene »vmesne« vrste in vrstni red vrst je izbran poljubno. Če ga zamenjaš, se črta spremeni, podatki pa ne. Vrhove povezujemo samo, kadar si kategorije sledijo po času.
:::

**6. Branje prikaza.** Kadar prikaz bereš, pojdi vedno po istem vrstnem redu:

1. Preberi **naslov**: o čem govori prikaz?
2. Preberi oznaki osi in **enoto**.
3. Poišči **merilo**: koliko pomeni en kvadratek ali ena oznaka?
4. Od vrha stolpca ali pike pojdi vodoravno do navpične osi in odčitaj vrednost.
5. Odgovori s stavkom in enoto. »Za koliko več« pomeni odštevanje, »skupaj« seštevanje.

V simulaciji spodaj (**Prikazi podatkov**) povečaj eno od števil za $1$. Opazuj, da zraste samo stolpec te kategorije, za natanko eno oznako na osi, ostali stolpci pa ostanejo enaki.

## Rešeni primeri

### Primer 1: ptice na krmilnici

Učenci so deset minut opazovali krmilnico in prešteli ptice. Preglednica: sinice $12$, vrabci $9$, ščinkavci $6$, kosi $3$. Koliko ptic so videli skupaj? Za koliko več je bilo sinic kot kosov in kolikokrat več?

**Podatki:** sinice $12$, vrabci $9$, ščinkavci $6$, kosi $3$ (število ptic v $10$ minutah)
**Iščemo:** skupno število ptic, razliko in količnik med sinicami in kosi

:::formula
Skupaj: vsota vseh števil. Za koliko več: $\text{večje} - \text{manjše}$. Kolikokrat več: $\text{večje} : \text{manjše}$.
:::

**Rešitev:**

1. Skupaj seštejemo vse vrstice: $12 + 9 + 6 + 3 = 30$ ptic.
2. Razlika pove »za koliko«: $12 - 3 = 9$.
3. Količnik pove »kolikokrat«: $12 : 3 = 4$.
4. Odgovor: videli so $30$ ptic; sinic je bilo za $9$ več kot kosov, to je $4$-krat toliko.

### Primer 2: deževni dnevi na kvadratkastem papirju

Vremenska postaja je naštela deževne dni: marec $8$, april $12$, maj $14$, junij $10$. Narisati želimo stolpčni prikaz, v katerem $1$ kvadratek pomeni $2$ dneva. Kako visoki so stolpci? Koliko deževnih dni je bilo v štirih mesecih?

**Podatki:** marec $8$, april $12$, maj $14$, junij $10$ (deževnih dni); merilo: $1$ kvadratek $= 2$ dneva
**Iščemo:** višino vsakega stolpca v kvadratkih in skupno število deževnih dni

:::formula
$\text{višina} = \text{vrednost} : \text{merilo}$
:::

**Rešitev:**

1. Marec: $8 : 2 = 4$ kvadratki.
2. April: $12 : 2 = 6$ kvadratkov.
3. Maj: $14 : 2 = 7$ kvadratkov.
4. Junij: $10 : 2 = 5$ kvadratkov.
5. Preizkus: najvišji stolpec je majski, kar ustreza največjemu številu dni. Skupaj: $8 + 12 + 14 + 10 = 44$ dni.
6. Odgovor: stolpci so visoki $4$, $6$, $7$ in $5$ kvadratkov; deževnih dni je bilo $44$.

### Primer 3: jutranje temperature

Gregor je vsak dan ob osmih zjutraj izmeril temperaturo zraka: ponedeljek $4\,^\circ\text{C}$, torek $7\,^\circ\text{C}$, sreda $9\,^\circ\text{C}$, četrtek $9\,^\circ\text{C}$, petek $6\,^\circ\text{C}$, sobota $2\,^\circ\text{C}$. Narisal je črtični prikaz in vrhove povezal. Za koliko stopinj se razlikujeta najtoplejše in najhladnejše jutro? Med katerima zaporednima dnevoma je temperatura najbolj padla?

**Podatki:** pon $4\,^\circ\text{C}$, tor $7\,^\circ\text{C}$, sre $9\,^\circ\text{C}$, čet $9\,^\circ\text{C}$, pet $6\,^\circ\text{C}$, sob $2\,^\circ\text{C}$ (ob osmih zjutraj)
**Iščemo:** razliko med največjo in najmanjšo temperaturo ter največji padec med zaporednima dnevoma

:::formula
Porast: $\text{novejša} - \text{starejša}$. Padec: $\text{starejša} - \text{novejša}$. Razpon: $\text{največja} - \text{najmanjša}$.
:::

**Rešitev:**

1. Najvišji piki sta pri $9\,^\circ\text{C}$ (sreda in četrtek), najnižja pri $2\,^\circ\text{C}$ (sobota).
2. Razpon: $9 - 2 = 7\,^\circ\text{C}$.
3. Spremembe po dnevih: od ponedeljka do srede temperatura narašča ($7 - 4 = 3$, $9 - 7 = 2$), od srede do četrtka je enaka, nato pada: od četrtka do petka za $9 - 6 = 3$, od petka do sobote za $6 - 2 = 4$.
4. Največji padec je za $4\,^\circ\text{C}$, od petka do sobote. Tam se povezava spušča najbolj strmo.
5. Odgovor: najtoplejše in najhladnejše jutro se razlikujeta za $7\,^\circ\text{C}$; najbolj je temperatura padla od petka do sobote, za $4\,^\circ\text{C}$.

### Primer 4: zdaj ti

Na stolpčnem prikazu ptic na krmilnici $1$ kvadratek pomeni $5$ ptic. Stolpec za sinice je visok $7$ kvadratkov, stolpec za kose je za $3$ kvadratke nižji. Za koliko več sinic kot kosov je bilo?

**Podatki:** merilo $1$ kvadratek $= 5$ ptic; sinice $7$ kvadratkov; kosi $3$ kvadratke manj
**Iščemo:** razliko v številu ptic

:::formula
$\text{vrednost} = \text{višina} \cdot \text{merilo}$
:::

**Rešitev:**

1. Sinice: $7 \cdot 5 = 35$ ptic.
2. Stolpec za kose je visok $7 - 3 = 4$ kvadratke.
3. Izračunaj sam število kosov in razliko, nato preveri:

:::premisli
Koliko je kosov in za koliko več je sinic?
---
Kosov je $4 \cdot 5 = 20$, sinic je za $35 - 20 = 15$ več. Krajše: razlika $3$ kvadratkov pomeni $3 \cdot 5 = 15$ ptic. Odgovor $3$ dobiš, če pozabiš na merilo.
:::

## Pogoste napake

- **Odčitek brez merila.** Učenec prešteje $6$ kvadratkov in reče »$6$ ptic«, čeprav en kvadratek pomeni $5$ ptic. Kvadratki niso ptice, so le višina. Pravilno: višino pomnožimo z merilom, $6 \cdot 5 = 30$ ptic.
- **Navpična os se ne začne pri $0$.** Učenec pri številih $48$ in $50$ začne os pri $46$, da bi se razlika bolje videla. Takrat višina stolpca ni več sorazmerna z vrednostjo in majhna razlika je videti ogromna. Pravilno: pri stolpčnem in črtičnem prikazu os začnemo pri $0$.
- **Neenakomerne oznake na osi.** Ob osi piše $0, 5, 10, 20, 25$. Enak razmik pa mora pomeniti enako število, sicer višine lažejo. Pravilno: $0, 5, 10, 15, 20, 25$.
- **Povezovanje kategorij, ki si ne sledijo po času.** Učenec poveže vrhove za vrste ptic, ker se mu črta zdi lepša. Črta bi kazala »naraščanje« med vrstami, ki ga ni. Pravilno: povezujemo le vrednosti, ki si sledijo v času.
- **Prikaz brez naslova in oznak.** Narisani so le stolpci s številkami. Bralec ne ve, ali gre za dneve, ptice ali stopinje. Pravilno: naslov, oznaki osi in enota.

## Povzetek

- Podatke preštejemo s črticami (peterčki) in zapišemo v **preglednico**: kategorija in število; vrstica »Skupaj« je preizkus.
- **Stolpčni prikaz**: vsaka kategorija ima stolpec, višina je enaka številu; os se začne pri $0$.
- **Črtični prikaz**: namesto stolpcev tanke črtice s piko na vrhu; bere se enako.
- Kadar si kategorije sledijo po času, vrhove povežemo in vidimo naraščanje, padanje ali enake vrednosti.
- Merilo: $\text{višina} = \text{vrednost} : \text{merilo}$ in $\text{vrednost} = \text{višina} \cdot \text{merilo}$.
- Pri branju: naslov, osi, enota, merilo, odčitek, odgovor s stavkom.

## Drugače: Na sliki

Dve vremenski postaji sta v enem letu našteli $48$ in $50$ deževnih dni. Ista števila sta spodaj narisana dvakrat. Levo se navpična os začne pri $0$, desno pri $46$.

:::risba skica
opis: Dva stolpčna prikaza istih števil 48 in 50. Levi ima os od 0: stolpca sta skoraj enako visoka. Desni ima os od 46: stolpec za 48 je visok 2 enoti, stolpec za 50 pa 4 enote, torej je videti dvakrat višji.
območje: 0; 0 .. 11; 6,6
enota: 25
črta: 1; 0,9 -> 1; 6,2 | siva
črta: 1; 0,9 -> 4,5; 0,9 | siva
pravokotnik: 1,5; 0,9 .. 2,5; 5,7 | modra
pravokotnik: 3; 0,9 .. 4; 5,9 | oranžna
napis: 2; 5,7 | 48 | nad
napis: 3,5; 5,9 | 50 | nad
napis: 1; 0,9 | 0 | levo
napis: 2,75; 0,9 | os od 0 | pod
črta: 7; 0,9 -> 7; 6,2 | siva
črta: 7; 0,9 -> 10,5; 0,9 | siva
pravokotnik: 7,5; 0,9 .. 8,5; 2,9 | modra
pravokotnik: 9; 0,9 .. 10; 4,9 | oranžna
napis: 8; 2,9 | 48 | nad
napis: 9,5; 4,9 | 50 | nad
napis: 7; 0,9 | 46 | levo
napis: 8,75; 0,9 | os od 46 | pod
:::

Levo vidiš resnico: stolpca sta skoraj enaka, saj se števili razlikujeta le za $2$. Desno je stolpec za $50$ visok $50 - 46 = 4$ enote, stolpec za $48$ pa $48 - 46 = 2$ enoti. Desni stolpec je videti dvakrat višji, čeprav je deževnih dni le malo več. Zato stolpčni prikaz vedno začnemo pri $0$.

## Drugače: Iz vsakdanjega življenja

**Vremenska napoved v telefonu.** Za naslednje dni pokaže temperature s pikami, povezanimi s črto. Če se dviga, bo topleje; če pada, bo hladneje. Dnevi si sledijo po času, zato ima povezava smisel.

**Vodostaj reke.** Hidrologi vsak dan zapišejo, kako visoko je reka. Ko po nalivu povezava strmo zraste, vedo, da prihaja visoka voda.

**Rast fižola.** Fižolček v lončku meriš vsak teden: $2\,\text{cm}$, $5\,\text{cm}$, $9\,\text{cm}$, $14\,\text{cm}$. Tedenski prirastki so $3$, $4$ in $5$ centimetrov, zato se povezava vsak teden dviga bolj strmo: rastlina raste vedno hitreje.

**Ptice na krmilnici.** Število sinic, vrabcev in kosov primerjaš s stolpci ali črticami, vrhov pa ne povežeš. Med vrstami ni časa, ki bi tekel.

## Preveri se

? Katera trditev o prikazih podatkov je pravilna?
- Vrhove črtic v črtičnem prikazu vedno povežemo s črto.
~ Povezujemo samo vrednosti, ki si sledijo po času. Med vrstami ptic ali vrstami vremena ni »vmesnih« vrednosti.
+ V stolpčnem prikazu se navpična os začne pri $0$.
- Širši stolpec pomeni večje število.
~ Vsi stolpci so enako široki. Število pove samo višina.
- Merilo pove, koliko podatkov smo zbrali skupaj.
~ Merilo pove, koliko pomeni en kvadratek. Vse podatke skupaj dobiš z vsoto v preglednici.
> Samo če se os začne pri $0$, je dvakrat višji stolpec res dvakrat večje število.

? Na prikazu en kvadratek pomeni $5$ deževnih dni. Stolpec za leto 2025 je visok $6$ kvadratkov. Koliko deževnih dni prikazuje?
= 30
~ 6 | To je višina v kvadratkih. Pomnoži jo še z merilom.
~ 11 | Višino in merilo si seštel. Vsak kvadratek pomeni $5$ dni, zato množimo.
> $\text{vrednost} = \text{višina} \cdot \text{merilo} = 6 \cdot 5 = 30$ dni.

? Poišči napako. Naloga: na prikazu $1$ kvadratek pomeni $2$ ptici, stolpec za sinice je visok $8$ kvadratkov, za kose $3$ kvadratke. Za koliko več je sinic? Rešitev: (1) sinic je $8 \cdot 2 = 16$; (2) kosov je $3$; (3) razlika je $16 - 3 = 13$. Kateri korak je napačen?
- korak (1)
~ Korak (1) je pravilen: višino $8$ si pomnožil z merilom $2$.
+ korak (2)
- korak (3)
~ Odštevanje $16 - 3 = 13$ je izračunano prav, le da je $3$ napačno število iz koraka (2).
- nobeden
~ Rezultat $13$ ni pravilen: kosov ni $3$, ampak $6$.
> V koraku (2) je pozabljeno merilo: kosov je $3 \cdot 2 = 6$, razlika pa $16 - 6 = 10$.

? Z risbe odčitaj padavine in razvrsti mesece od najbolj do najmanj mokrega.
:::risba stolpci
opis: Stolpčni prikaz »Padavine v milimetrih«. Navpična os od 0 do 100 po 10. Januar 60, februar 45, marec 80, april 95.
podnapis: Padavine v milimetrih
os: padavine (mm)
korak: 10
stolpec: januar | 60
stolpec: februar | 45
stolpec: marec | 80
stolpec: april | 95
:::
1. april
2. marec
3. januar
4. februar
> Višine so april $95\,\text{mm}$, marec $80\,\text{mm}$, januar $60\,\text{mm}$, februar $45\,\text{mm}$. Vrstni red na osi (po koledarju) ni vrstni red po velikosti.

? V časopisu je stolpčni prikaz deževnih dni dveh mest: $48$ in $50$. Navpična os se začne pri $46$, zato je drugi stolpec videti dvakrat višji. Kaj je res?
- Mesto s $50$ dnevi ima dvakrat več deževnih dni.
~ Dvakrat višji je le stolpec, ker os ne začne pri $0$. Števili $48$ in $50$ se razlikujeta le za $2$.
+ Razlika je majhna, $2$ dneva; prikaz je zavajajoč.
- Prikaz je pravilen, ker sta števili zapisani nad stolpcema.
~ Zapisani števili sta prav, slika pa kaže napačno razmerje. Kdor gleda samo stolpce, se zmoti.
> $50 - 48 = 2$. Ker os začne pri $46$, sta stolpca visoka $2$ in $4$ enote, zato je drugi videti dvakrat višji.

<<RACUN
vrednost: 9+6+5 | 20
vrednost: 12+9+6+3 | 30
vrednost: 12-3 | 9
vrednost: 12/3 | 4
vrednost: 8/2 | 4
vrednost: 12/2 | 6
vrednost: 14/2 | 7
vrednost: 10/2 | 5
vrednost: 8+12+14+10 | 44
vrednost: 9-2 | 7
vrednost: 6-2 | 4
vrednost: 9-6 | 3
vrednost: 7*5 | 35
vrednost: 4*5 | 20
vrednost: 35-20 | 15
vrednost: 6*5 | 30
vrednost: 16-3*2 | 10
>>

:::simboli
\text{višina} | višina stolpca v kvadratkih | \text{višina} = \text{vrednost} : \text{merilo} | | 
\text{vrednost} | število, ki ga stolpec prikazuje | \text{vrednost} = \text{višina} \cdot \text{merilo} | | na primer število ptic
\text{merilo} | koliko pomeni en kvadratek | | | na primer 1 kvadratek = 2 dneva
\text{večje}, \text{manjše} | večje in manjše od primerjanih števil | | | 
\text{novejša}, \text{starejša} | kasnejša in prejšnja izmerjena vrednost | | | pri padcu je starejša večja
\text{največja}, \text{najmanjša} | največja in najmanjša vrednost | | | njuna razlika je razpon
:::
