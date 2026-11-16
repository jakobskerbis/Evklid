---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na dnu kuhalnika vode piše $230\,\mathrm{V}$. V kuhinjski tehtnici je gumbasta baterija $3\,\mathrm{V}$. Na polnilniku telefona, ki leži ob opekaču, piše $5\,\mathrm{V}$ in $2\,\mathrm{A}$.

Kuhalnik zavre liter vode v treh minutah. Tehtnica z eno samo gumbasto baterijo dela več mesecev. Česa teče po kablu kuhalnika toliko več kot skozi tehtnico? In kaj pomenita črki V in A?

Ko boš znal izmeriti tok in napetost, boš razumel nalepke na napravah, izbral pravo baterijo in varno sestavil krog pri poskusih.

## Razlaga

**Prvi vzorec: koliko elektrine v sekundi.** Iz prejšnje lekcije veš, da je elektrina $e$ količina naboja in da jo merimo v $\mathrm{As}$. Ko je krog sklenjen, se nabiti delci po njem premikajo. V kovinskih žicah so to elektroni. Recimo, da bi lahko prešteli, koliko elektrine steče skozi kabel treh naprav v kuhinji:

| Naprava | elektrina | čas |
|---|---|---|
| kuhalnik vode | $90\,\mathrm{As}$ | $10\,\mathrm{s}$ |
| mikrovalovna pečica | $50\,\mathrm{As}$ | $10\,\mathrm{s}$ |
| LED lučka pod omarico | $3\,\mathrm{As}$ | $20\,\mathrm{s}$ |

Skozi katero napravo »teče več«? Same elektrine ne moreš primerjati, ker so časi različni. Deli elektrino s časom: kuhalnik $9\,\mathrm{As}$ v vsaki sekundi, pečica $5\,\mathrm{As}$, lučka le $0{,}15\,\mathrm{As}$.

To razmerje se imenuje **električni tok** $I$. Pove, koliko elektrine preteče skozi presek vodnika (namišljen prerez žice) v eni sekundi:

$$I = \frac{e}{t}$$

Enota je **amper** ($\mathrm{A}$): $1\,\mathrm{A} = 1\,\mathrm{As/s}$. Od tod ime enote elektrine: $1\,\mathrm{As}$ je elektrina, ki preteče v $1\,\mathrm{s}$ pri toku $1\,\mathrm{A}$. Manjše tokove pišemo v miliamperih: $1\,\mathrm{A} = 1000\,\mathrm{mA}$.

Elektroni tečejo od negativnega pola vira k pozitivnemu. Smer toka so dogovorili, preden so poznali elektrone, zato na shemah puščica kaže od $+$ proti $-$.

**Drugi vzorec: kje meriti tok.** Tok merimo z **ampermetrom**. Sestavimo krog iz baterije, stikala in žarnice. Ampermeter vstavimo enkrat pred žarnico, enkrat za njo:

| Kje je ampermeter | kaže |
|---|---|
| med baterijo in žarnico | $0{,}30\,\mathrm{A}$ |
| med žarnico in stikalom | $0{,}30\,\mathrm{A}$ |

:::premisli
Ampermeter prestaviš še med stikalo in baterijo. Kaj pokaže: več, manj ali enako kot na drugih dveh mestih?
---
Enako, $0{,}30\,\mathrm{A}$. Elektroni se v žarnici ne porabijo, ampak krožijo. Kolikor jih vstopi v žarnico, toliko jih izstopi.
:::

Pravilo, ki sledi iz tega: v krogu z eno potjo je tok povsod enak. Vseeno je torej, kam v krog postaviš ampermeter, le ves tok mora teči skozenj. Zato krog prekinemo in ampermeter vstavimo v vrzel. Pravimo, da ga vežemo **zaporedno**.

Ampermeter toku skoraj ne nasprotuje, za tok je kot kos žice. Če bi ga priključil naravnost na konca baterije ali vzporedno z žarnico, bi skozenj stekel zelo velik tok. Pregorela bi varovalka v njem ali pa bi se merilnik uničil. Na ampermetru najprej izberi največje **merilno območje** (na primer $10\,\mathrm{A}$) in ga zmanjšaj šele, ko vidiš, da je tok majhen.

**Tretji vzorec: kaj kaže voltmeter.** **Voltmeter** ima dve žici. Z njima se dotakneš dveh točk kroga, ne da bi krog prekinil. V istem krogu z baterijo $4{,}5\,\mathrm{V}$ dobimo:

| Kje sta žici voltmetra | stikalo | kaže |
|---|---|---|
| na polih baterije | sklenjeno | $4{,}5\,\mathrm{V}$ |
| na koncih žarnice | sklenjeno | $4{,}5\,\mathrm{V}$ |
| na koncih kosa žice | sklenjeno | $0\,\mathrm{V}$ |
| na koncih žarnice | odprto | $0\,\mathrm{V}$ |

Voltmeter torej ne meri nečesa, kar teče skozi eno točko, ampak razliko med dvema točkama. Ta razlika se imenuje **električna napetost** $U$, enota je **volt** ($\mathrm{V}$). Vir s svojo napetostjo poganja elektrino po krogu, kot črpalka poganja vodo. Večja napetost pomeni, da vsaka $\mathrm{As}$ elektrine prenese več energije: pri $1\,\mathrm{V}$ je to $1\,\mathrm{J}$.

:::premisli
Skozi žarnico in skozi kos žice teče enak tok. Zakaj voltmeter na žarnici kaže $4{,}5\,\mathrm{V}$, na žici pa $0\,\mathrm{V}$?
---
V žarnici elektrina odda energijo, ki se pretvori v svetlobo in toploto. V kratki bakreni žici skoraj nič ne odda. Voltmeter meri, koliko energije na $1\,\mathrm{As}$ se izgubi med njegovima točkama.
:::

Voltmeter priključimo na konca porabnika, ob njem. Pravimo, da ga vežemo **vzporedno**. Sam skoraj ne prepušča toka. Če bi ga vstavil zaporedno v krog, bi se tok skoraj ustavil in žarnica ne bi svetila.

V simulaciji spodaj »Laboratorij: izmeri tok in napetost« priključi ampermeter zaporedno in voltmeter vzporedno ter zapiši meritev. Nato nastavi ampermeter na »vzporedno«. Opazuj, kaj se zgodi z varovalko v ampermetru.

**Tipične vrednosti v kuhinji.** Z njimi preveriš, ali je rezultat smiseln:

| Naprava | napetost | tok |
|---|---|---|
| kuhinjska tehtnica | $3\,\mathrm{V}$ | $4\,\mathrm{mA}$ |
| LED lučka | $4{,}5\,\mathrm{V}$ | $150\,\mathrm{mA}$ |
| polnilnik telefona | $5\,\mathrm{V}$ | $2\,\mathrm{A}$ |
| kuhalnik vode | $230\,\mathrm{V}$ | $9\,\mathrm{A}$ |

Pri vtičnici v kuhinji nikoli ne meri sam. Napetost $230\,\mathrm{V}$ je smrtno nevarna. V šoli meriš le na baterijah in šolskih napajalnikih.

## Rešeni primeri

### Primer 1: kuhalnik vode

Skozi grelec kuhalnika vode v $60\,\mathrm{s}$ preteče elektrina $540\,\mathrm{As}$. Kolikšen tok teče skozi grelec?

**Podatki:** $e = 540\,\mathrm{As}$, $t = 60\,\mathrm{s}$
**Iščemo:** tok $I$

:::formula
$I = \dfrac{e}{t}$
:::

**Rešitev:**

1. Enote so že osnovne ($\mathrm{As}$ in $\mathrm{s}$), zato lahko takoj vstavimo.
2. $I = \dfrac{540\,\mathrm{As}}{60\,\mathrm{s}} = 9\,\mathrm{A}$.
3. Odgovor: skozi grelec teče tok $9\,\mathrm{A}$, kar se ujema s tabelo kuhinjskih naprav.

### Primer 2: meritev na paličnem mešalniku

Palični mešalnik ima baterijo $7{,}2\,\mathrm{V}$. Pričakuješ tok okoli $0{,}8\,\mathrm{A}$. Ampermeter ima območji $200\,\mathrm{mA}$ in $10\,\mathrm{A}$. Kako priključiš ampermeter in voltmeter in katero območje ampermetra izbereš? Ampermeter nato pokaže $0{,}75\,\mathrm{A}$. Koliko elektrine preteče skozi motor v $1\,\mathrm{min}$?

**Podatki:** $U = 7{,}2\,\mathrm{V}$, pričakovani tok $0{,}8\,\mathrm{A}$, območji $200\,\mathrm{mA}$ in $10\,\mathrm{A}$, izmerjeni tok $I = 0{,}75\,\mathrm{A}$, $t = 1\,\mathrm{min}$
**Iščemo:** vezavo merilnikov, območje ampermetra, elektrino $e$

:::formula
Ampermeter zaporedno, voltmeter vzporedno; $e = I \cdot t$
:::

**Rešitev:**

1. Ampermeter vstavimo v krog zaporedno z motorjem, voltmeter priključimo na konca motorja.
2. $0{,}8\,\mathrm{A} = 800\,\mathrm{mA}$, kar je več kot $200\,\mathrm{mA}$. Zato izberemo območje $10\,\mathrm{A}$, sicer bi varovalka pregorela.
3. Čas pretvorimo v sekunde: $1\,\mathrm{min} = 60\,\mathrm{s}$.
4. $e = 0{,}75\,\mathrm{A} \cdot 60\,\mathrm{s} = 45\,\mathrm{As}$.
5. Odgovor: ampermeter zaporedno na območju $10\,\mathrm{A}$, voltmeter vzporedno; v eni minuti skozi motor preteče $45\,\mathrm{As}$.

### Primer 3: koliko časa zdrži baterija tehtnice

Na bateriji kuhinjske tehtnice piše $220\,\mathrm{mAh}$. To je elektrina, ki jo baterija lahko požene skozi krog: tok v miliamperih, pomnožen s časom v urah. Tehtnica med delovanjem jemlje tok $4\,\mathrm{mA}$. Koliko ur lahko tehta? Koliko $\mathrm{As}$ je to?

**Podatki:** $e = 220\,\mathrm{mAh}$, $I = 4\,\mathrm{mA}$, $1\,\mathrm{h} = 3600\,\mathrm{s}$
**Iščemo:** čas $t$ in elektrino $e$ v $\mathrm{As}$

:::formula
$t = \dfrac{e}{I}$, nato $e = I \cdot t$ v osnovnih enotah
:::

**Rešitev:**

1. Iz $I = \dfrac{e}{t}$ izrazimo čas: $t = \dfrac{e}{I}$, ker iščemo čas, ne toka.
2. Enoti se ujemata ($\mathrm{mAh}$ in $\mathrm{mA}$), zato: $t = \dfrac{220\,\mathrm{mAh}}{4\,\mathrm{mA}} = 55\,\mathrm{h}$.
3. Za $\mathrm{As}$ pretvorimo: $220\,\mathrm{mA} = 0{,}22\,\mathrm{A}$ in $1\,\mathrm{h} = 3600\,\mathrm{s}$.
4. $e = 0{,}22\,\mathrm{A} \cdot 3600\,\mathrm{s} = 792\,\mathrm{As}$.
5. Odgovor: tehtnica lahko tehta $55\,\mathrm{h}$; baterija pri tem požene $792\,\mathrm{As}$ elektrine. Če tehtaš nekaj minut na dan, zdrži več mesecev.

### Primer 4: zdaj ti

LED lučka pod kuhinjsko omarico je priključena na baterijo $4{,}5\,\mathrm{V}$. Ampermeter v krogu kaže $150\,\mathrm{mA}$. Kaj pokaže voltmeter na koncih lučke? Koliko elektrine preteče skozi lučko v $10\,\mathrm{min}$?

**Podatki:** $U = 4{,}5\,\mathrm{V}$ (baterija), $I = 150\,\mathrm{mA}$, $t = 10\,\mathrm{min}$
**Iščemo:** napetost na lučki in elektrino $e$

:::formula
$e = I \cdot t$
:::

**Rešitev:**

1. Lučka je edini porabnik, zato voltmeter na njej kaže enako kot na bateriji: $4{,}5\,\mathrm{V}$.
2. Pretvori: $150\,\mathrm{mA} = 0{,}15\,\mathrm{A}$ in $10\,\mathrm{min} = 600\,\mathrm{s}$.
3. Izračunaj elektrino sam, nato preveri:

:::premisli
Koliko je $e = 0{,}15\,\mathrm{A} \cdot 600\,\mathrm{s}$?
---
$e = 90\,\mathrm{As}$. Če bi pozabil pretvoriti, bi dobil $1500$, kar je napačno.
:::

## Pogoste napake

- **»Žarnica porabi tok.«** Učenec pričakuje, da ampermeter za žarnico kaže manj kot pred njo. Elektroni se ne porabijo, le odložijo energijo. V krogu z eno potjo je tok povsod enak.
- **Ampermeter vzporedno.** Zdi se, da je vseeno, kako ga priključiš, saj voltmeter priključiš vzporedno. Ampermeter skoraj ne nasprotuje toku, zato bi vzporedno skozenj stekel prevelik tok. Vedno ga vstavi zaporedno.
- **»Napetost teče skozi žico.«** Tok in napetost zamenjaš. Tok teče skozi točko, napetost je med dvema točkama. Zato voltmeter vežeš vzporedno, na dve točki.
- **Elektrina namesto toka.** Kdor reče, da je pri $30\,\mathrm{As}$ tok $30\,\mathrm{A}$, pozabi na čas. Tok je elektrina **v eni sekundi**: deli s časom.
- **Minute in miliampere v formulo.** $150\,\mathrm{mA}$ pomnoženo z $10\,\mathrm{min}$ ne da $\mathrm{As}$. Najprej pretvori v $\mathrm{A}$ in $\mathrm{s}$ (razen pri $\mathrm{mAh}$, kjer se enoti ujemata).

## Povzetek

- Električni tok $I$ pove, koliko elektrine preteče skozi presek vodnika v eni sekundi: $I = \dfrac{e}{t}$, enota amper ($\mathrm{A}$), $1\,\mathrm{A} = 1000\,\mathrm{mA}$.
- Iz tega: $e = I \cdot t$ in $t = \dfrac{e}{I}$; $\mathrm{As}$ je enota elektrine.
- V krogu z eno potjo je tok povsod enak; tok se ne porabi.
- Ampermeter vežemo zaporedno (krog prekinemo), začnemo z največjim območjem.
- Napetost $U$ je med dvema točkama, enota volt ($\mathrm{V}$); vir s svojo napetostjo poganja elektrino. Voltmeter vežemo vzporedno.
- Na porabniku, ki je edini v krogu, je napetost enaka napetosti vira; na kosu žice je skoraj $0\,\mathrm{V}$.

## Drugače: Korak za korakom s številkami

Recept za vsako meritev in račun s tokom:

1. **Nariši krog** in označi, kje je porabnik.
2. **Ampermeter:** krog odpri in ga vstavi v vrzel. Začni na območju $10\,\mathrm{A}$.
3. **Voltmeter:** njegovi žici položi na konca porabnika.
4. **Zapiši** odčitek z enoto, na primer $I = 150\,\mathrm{mA}$, $U = 4{,}5\,\mathrm{V}$.
5. **Pretvori** v osnovne enote: $150\,\mathrm{mA} = 0{,}15\,\mathrm{A}$; $2\,\mathrm{min} = 120\,\mathrm{s}$.
6. **Izberi obliko:** iščeš tok, deli elektrino s časom; iščeš elektrino, pomnoži tok s časom; iščeš čas, deli elektrino s tokom.
7. **Izračunaj:** $e = 0{,}15\,\mathrm{A} \cdot 120\,\mathrm{s} = 18\,\mathrm{As}$.
8. **Preveri smiselnost** s tabelo kuhinjskih naprav: lučka s tokom $9\,\mathrm{A}$ ali kuhalnik s tokom $9\,\mathrm{mA}$ pomenita, da si se zmotil pri enotah.

## Drugače: Kot zgodba

Elektron Eli živi v bakreni žici LED lučke pod kuhinjsko omarico. Dokler je stikalo odprto, se z milijardami sosedov le naključno premetava sem in tja.

Ko nekdo pritisne stikalo, baterija začne potiskati. Potisk se po žici razširi skoraj v trenutku, zato se cela vrsta elektronov naenkrat počasi premakne proti pozitivnemu polu. Lučka zasveti v trenutku, čeprav Eli sam leze manj kot milimeter v sekundi.

Na poti gre Eli skozi ampermeter. Ta ne šteje posameznih elektronov, kaže pa, koliko elektrine gre mimo v vsaki sekundi: $0{,}15\,\mathrm{As}$. Za njim pride lučka. Tam Eli odda energijo, ki mu jo je dala baterija, in lučka sveti. Iz lučke pride enako število elektronov, kot jih je vstopilo, le z manj energije.

Voltmeter stoji ob lučki kot opazovalec na dveh koncih mostu. Ne gre čez most, le primerja: koliko energije ima vsaka $\mathrm{As}$ pred lučko in koliko za njo. Razlika je $4{,}5\,\mathrm{V}$. Ko Eli spet pride v baterijo, dobi novo energijo in pot se ponovi.

## Preveri se

? Skozi žico v $1\,\mathrm{min}$ preteče približno $30\,\mathrm{As}$. Približno kolikšen je tok?
- $30\,\mathrm{A}$
~ To je elektrina, ne tok. Tok je elektrina v eni sekundi, zato deli s časom.
+ $0{,}5\,\mathrm{A}$
- $1800\,\mathrm{A}$
~ To dobiš, če elektrino pomnožiš s časom. Pri toku elektrino delimo s časom.
> $1\,\mathrm{min} = 60\,\mathrm{s}$, $I = \dfrac{30\,\mathrm{As}}{60\,\mathrm{s}} = 0{,}5\,\mathrm{A}$.

? Zakaj ampermetra ne smeš priključiti vzporedno z žarnico?
- Ker bi pokazal napetost namesto toka.
~ Ampermeter vedno meri tok. Težava je, kolikšen tok bi stekel skozenj.
+ Ker ampermeter toku skoraj ne nasprotuje, zato bi skozenj stekel prevelik tok in bi pregorela varovalka.
- Ker bi žarnica porabila ves tok in ampermeter ne bi pokazal ničesar.
~ Tok se v žarnici ne porabi. Vzporedno priključen ampermeter je za tok skoraj kot kratka žica.
> Ampermeter je skoraj kot kos žice. Vzporedno z žarnico bi bil bližnjica, po kateri steče zelo velik tok.

? Katera vrstica tabele pove, kako pravilno priključiš merilnika na žarnico?

| Vrstica | ampermeter | voltmeter |
|---|---|---|
| A | zaporedno | vzporedno |
| B | vzporedno | zaporedno |
| C | zaporedno | zaporedno |

+ A
- B
~ Obrnjeno: ampermeter vzporedno požene velik tok skozi merilnik, voltmeter zaporedno pa skoraj ustavi tok.
- C
~ Voltmeter meri razliko med dvema točkama, zato mora biti priključen ob žarnici, ne v vrzeli kroga.
> Ampermeter mora meriti ves tok, zato je v krogu zaporedno. Voltmeter primerja dve točki, zato je vzporedno ob žarnici.

? Ampermeter kaže $0{,}4\,\mathrm{A}$. Koliko časa mora teči tok, da preteče $12\,\mathrm{As}$ elektrine?
- $4{,}8\,\mathrm{s}$
~ To je produkt $0{,}4 \cdot 12$. Čas dobiš z deljenjem elektrine s tokom.
+ $30\,\mathrm{s}$
- $0{,}03\,\mathrm{s}$
~ Tu je deljeno v napačni smeri ($\frac{0{,}4}{12}$). Elektrina je zgoraj: $t = \dfrac{e}{I}$.
> $t = \dfrac{e}{I} = \dfrac{12\,\mathrm{As}}{0{,}4\,\mathrm{A}} = 30\,\mathrm{s}$.

? V krogu z baterijo $4{,}5\,\mathrm{V}$ sveti žarnica. Voltmeter priključiš na konca kratke bakrene žice v tem krogu. Kaj pokaže?
- $4{,}5\,\mathrm{V}$, ker je napetost povsod v krogu enaka.
~ Enak je povsod tok, ne napetost. Napetost je odvisna od tega, med katerima točkama meriš.
- $2{,}25\,\mathrm{V}$, ker si žica in žarnica napetost razdelita na pol.
~ Žica skoraj nič energije ne odda, zato skoraj vsa napetost ostane žarnici.
+ Skoraj $0\,\mathrm{V}$.
> V bakreni žici elektrina skoraj ne izgubi energije, zato med koncema žice skoraj ni napetosti. Skoraj vseh $4{,}5\,\mathrm{V}$ je na žarnici.

:::simboli
I | električni tok | I = \dfrac{e}{t} | A | $1\,\mathrm{A} = 1000\,\mathrm{mA}$
e | elektrina | e = I \cdot t | As | na bateriji tudi v mAh
t | čas | t = \dfrac{e}{I} | s | pri mAh v urah
U | električna napetost | | V | merimo jo med dvema točkama
:::
