---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Zaslon telefona obrišeš z mikrovlakensko krpo. Minuto pozneje se nanj spet prilepi prah. Pri brisanju je z zaslona na krpo preskočilo približno $6 \cdot 10^{10}$ elektronov, torej šestdeset milijard. Skupaj tehtajo manj kot $10^{-19}\,\mathrm{kg}$.

Kako lahko nekaj tako lahkega pritegne prašni delec? In zakaj delavci v tovarni telefonov nosijo okoli zapestja trak, ki je s kablom povezan z zemljo?

Odgovor na obe vprašanji je **električni naboj**. Z njim razložiš iskro pri kljuki, lase, ki stojijo pokonci po slačenju puloverja, in vse, kar boš v naslednjih lekcijah izvedel o toku in napetosti.

## Razlaga

**1. Delci z nabojem.** Snov je iz atomov. V sredini atoma je jedro s **protoni** in **nevtroni**, okoli jedra so **elektroni**. Protoni imajo **pozitiven** naboj ($+$), elektroni **negativen** ($-$), nevtroni naboja nimajo. Naboj protona in naboj elektrona sta enako velika, le predznak je drugačen.

Atom ima enako protonov kot elektronov, zato je navzven **nevtralen**: pozitivni in negativni naboji se izničijo. Enako velja za zaslon, krpo ali balon, dokler jih ne podrgneš.

**Preveri:** Telo ima $40$ protonov in $40$ elektronov. Je nabito? *(Ne, je nevtralno.)*

**2. Elektrenje z drgnjenjem.** Ko dve različni snovi podrgneš eno ob drugo, preidejo nekateri elektroni z ene na drugo. Protoni ostanejo na mestu, saj so trdno vezani v jedrih. Temu pravimo **elektrenje** (telo naelektrimo).

- Telo, ki je elektrone **prejelo**, ima presežek elektronov: je **negativno** nabito.
- Telo, ki je elektrone **oddalo**, ima primanjkljaj elektronov: je **pozitivno** nabito.

| Kaj podrgneš | Kdo prejme elektrone | Naboj |
|---|---|---|
| balon ob lase | balon | balon $-$, lasje $+$ |
| PVC-palico ob volno | palica | palica $-$, volna $+$ |
| stekleno palico ob svilo | svila | steklo $+$, svila $-$ |
| zaslon telefona s krpo | krpa | zaslon $+$, krpa $-$ |

Naboj se pri drgnjenju ne ustvari, ampak se le **prerazporedi**. Kolikor elektronov eno telo izgubi, toliko jih drugo dobi. Zato sta telesi po drgnjenju nabiti **nasprotno in enako močno**.

**Preveri:** Volnena krpa po drgnjenju PVC-palice manjka $10^{9}$ elektronov. Koliko elektronov ima palica preveč? *(Natanko $10^{9}$.)*

**3. Koliko naboja.** Količini naboja pravimo **elektrina** in jo označimo z $e$. Enota je **amperska sekunda** ($\mathrm{As}$), drugo ime zanjo je coulomb ($\mathrm{C}$). Zakaj ima tako ime, boš videl v lekciji o toku.

Najmanjši naboj, ki ga ima en elektron ali en proton, je **osnovni naboj** $e_0 = 1{,}6 \cdot 10^{-19}\,\mathrm{As}$. Naboj telesa je vedno celo število osnovnih nabojev. Če telo prejme ali odda $N$ elektronov, je velikost njegove elektrine

$$e = N \cdot e_0$$

Predznak dodaš posebej: $-$, če je elektrone prejelo, $+$, če jih je oddalo. Za $1\,\mathrm{As}$ bi moral premakniti več kot šest milijard milijard elektronov. Pri drgnjenju jih premakneš veliko manj, zato so elektrine nabitih teles majhne, nekaj milijardink $\mathrm{As}$.

**Preveri:** Ali ima kapljica lahko elektrino $0{,}5 \cdot e_0$? *(Ne, elektrona ne moreš razdeliti.)*

**4. Sile med naboji.** Nabiti telesi delujeta druga na drugo s silo, tudi ko se ne dotikata.

- **Istoimenska** naboja ($+$ in $+$ ali $-$ in $-$) se **odbijata**.
- **Raznoimenska** naboja ($+$ in $-$) se **privlačita**.

Sila je večja, če sta naboja večja, in hitro slabi, ko se telesi oddaljujeta. To vidiš pri **elektroskopu**: na kovinski palici visita dva tanka kovinska lističa. Ko se palice dotakneš z nabitim ravnilom, del naboja preide na palico in se po kovini razporedi do obeh lističev. Lističa dobita istoimenski naboj in se razmakneta. Večji naboj pomeni večji razmik.

:::premisli
Dva balona podrgneš ob iste lase in ju obesiš na vrvici drugega ob drugem. Bosta visela navpično, se razmaknila ali zlepila?
---
Razmaknila se bosta. Oba sta prejela elektrone, zato sta oba negativna. Istoimenska naboja se odbijata.
:::

**Preveri:** Nabito ravnilo odbija nabit balon. Kaj veš o njunih nabojih? *(Imata enak predznak.)*

**5. Privlak nevtralnih teles.** Prah na zaslonu ni nabit, pa ga zaslon vseeno pritegne. Zakaj? V nevtralnem telesu so elektroni in jedra. Ko se mu približa nabito telo, se elektroni v njem malo premaknejo: proti pozitivnemu telesu ali stran od negativnega. Bližnja stran postane nasprotno nabita kot nabito telo, oddaljena pa istoimensko. Temu pravimo **influenca**.

Bližnja stran je bliže, zato je privlak nanjo močnejši od odboja na oddaljeno stran. Nevtralno telo je zato vedno **privlačeno**, nikoli odbijano.

V simulaciji spodaj »Električni naboj z drgnjenjem« nekajkrat klikni »Podrgni balon ob pulover«. Nato povleci balon počasi proti steni. Opazuj, kateri znaki se pojavijo na delu stene ob balonu in kako se sila spreminja z razdaljo.

:::premisli
Nabit balon se prime stene, a čez nekaj ur pade. Zakaj se ne drži večno?
---
Balon počasi izgublja naboj: elektroni odtekajo v vlažen zrak in v steno. Ko je naboja malo, je privlak prešibak, da bi balon zdržal svojo težo.
:::

**6. Prevodniki, izolatorji in ozemljitev.** V kovinah se elektroni prosto premikajo, zato naboj takoj steče po vsem telesu. Kovine so **električni prevodniki**. V plastiki, steklu in gumi se elektroni ne morejo premikati po telesu (le malo znotraj svojih atomov, kar zadošča za influenco), zato ostane naboj tam, kjer je nastal. To so **izolatorji**. Zato naelektriš plastično ravnilo, kovinske žlice v roki pa ne: naboj po žlici steče v tvojo roko in naprej v tla.

Če nabito telo povežeš z zemljo, naboj odteče in telo se **razelektri**. Zemlja je tako velika, da sprejme ali odda poljubno veliko elektronov. Delavec s trakom na zapestju je ves čas ozemljen. Naboj, ki ga dobi pri hoji ali drgnjenju oblačil, sproti odteče. Iskra, ki bi lahko uničila drobne dele čipa, zato ne preskoči.

## Rešeni primeri

### Primer 1: zaslon po brisanju

Pri brisanju zaslon telefona izgubi $2 \cdot 10^{10}$ elektronov. Kolikšna je elektrina zaslona in kakšen je njen predznak?

**Podatki:** $N = 2 \cdot 10^{10}$ oddanih elektronov, $e_0 = 1{,}6 \cdot 10^{-19}\,\mathrm{As}$, zaslon je bil prej nevtralen
**Iščemo:** elektrino $e$ zaslona in njen predznak

:::formula
$e = N \cdot e_0$
:::

**Rešitev:**

1. Velikost: $e = 2 \cdot 10^{10} \cdot 1{,}6 \cdot 10^{-19}\,\mathrm{As} = 3{,}2 \cdot 10^{-9}\,\mathrm{As}$, ker vsak elektron odnese en osnovni naboj.
2. Predznak: zaslon je elektrone oddal, zato mu jih manjka in je pozitiven.
3. Odgovor: elektrina zaslona je $+3{,}2 \cdot 10^{-9}\,\mathrm{As}$.

### Primer 2: trije ovitki za telefon

Tri plastične ovitke za telefon, A, B in C, podrgnemo z različnimi krpami. Vsi trije so nabiti. A odbija B, B privlači C. Za C vemo, da je negativen. Kakšna sta naboja A in B?

**Podatki:** A, B, C so nabiti; A in B se odbijata; B in C se privlačita; C je negativen
**Iščemo:** predznak naboja A in B

:::formula
Istoimenska naboja se odbijata, raznoimenska se privlačita.
:::

**Rešitev:**

1. B privlači C. Ker sta oba nabita, imata različna predznaka, zato je B pozitiven.
2. A odbija B, zato ima enak predznak kot B: A je pozitiven.
3. Odgovor: A in B sta pozitivna.

Pogoj »vsi trije so nabiti« je pomemben. Brez njega bi bil lahko B tudi nevtralen, saj nabito telo privlači tudi nevtralna telesa.

### Primer 3: od krpe nazaj do elektronov

Po brisanju zaslona izmerimo, da ima krpa elektrino $-4{,}8 \cdot 10^{-9}\,\mathrm{As}$. Koliko elektronov je preskočilo? Kolikšna je elektrina zaslona?

**Podatki:** elektrina krpe $-4{,}8 \cdot 10^{-9}\,\mathrm{As}$, $e_0 = 1{,}6 \cdot 10^{-19}\,\mathrm{As}$, pred brisanjem sta bila krpa in zaslon nevtralna
**Iščemo:** število elektronov $N$ in elektrino zaslona

:::formula
$N = \dfrac{e}{e_0}$; naboj se ohranja: zaslon ima nasprotno enak naboj kot krpa.
:::

**Rešitev:**

1. Krpa je negativna, torej je elektrone prejela. Za štetje vzamemo le velikost: $e = 4{,}8 \cdot 10^{-9}\,\mathrm{As}$.
2. $N = \dfrac{4{,}8 \cdot 10^{-9}\,\mathrm{As}}{1{,}6 \cdot 10^{-19}\,\mathrm{As}} = 3 \cdot 10^{10}$, saj vsak elektron prinese en osnovni naboj.
3. Te elektrone je izgubil zaslon. Kolikor jih krpa dobi, toliko jih zaslon izgubi, zato je zaslon pozitiven.
4. Odgovor: preskočilo je $3 \cdot 10^{10}$ elektronov, zaslon ima elektrino $+4{,}8 \cdot 10^{-9}\,\mathrm{As}$.

### Primer 4: zdaj ti

Balon A podrgneš ob lase in prejme $2 \cdot 10^{11}$ elektronov. Balon B podrgneš ob iste lase in prejme $1 \cdot 10^{11}$ elektronov. Ali se balona odbijata ali privlačita? Kolikšna je elektrina balona A?

**Podatki:** $N_A = 2 \cdot 10^{11}$ prejetih elektronov, $N_B = 1 \cdot 10^{11}$ prejetih elektronov, $e_0 = 1{,}6 \cdot 10^{-19}\,\mathrm{As}$
**Iščemo:** ali se odbijata ali privlačita in elektrino $e_A$

:::formula
$e_A = N_A \cdot e_0$; istoimenska naboja se odbijata.
:::

**Rešitev:**

1. Oba balona sta elektrone prejela, zato sta oba negativna.
2. Odloči, kaj to pomeni za silo, in izračunaj $e_A$. Nato preveri:

:::premisli
Kaj velja za balona in kolikšna je $e_A$?
---
Balona se odbijata, ker sta oba negativna. Da ima A večji naboj kot B, ni pomembno. $e_A = 2 \cdot 10^{11} \cdot 1{,}6 \cdot 10^{-19}\,\mathrm{As} = 3{,}2 \cdot 10^{-8}\,\mathrm{As}$, s predznakom $-3{,}2 \cdot 10^{-8}\,\mathrm{As}$.
:::

## Pogoste napake

- **»Pri drgnjenju se premaknejo protoni.«** Učenec misli, da je pozitivno telo dobilo pozitivne delce. Protoni so trdno vezani v jedrih in se ne premikajo. Premikajo se le elektroni: pozitivno telo jih je **izgubilo**.
- **»Drgnjenje ustvari naboj.«** Zdi se, da se je naboj pojavil iz nič. Naboj se le prerazporedi. Če je eno telo negativno, je drugo enako močno pozitivno. Seštevek je še vedno nič.
- **»Če se privlačita, sta nasprotno nabita.«** Ne nujno: nabito telo privlači tudi nevtralno telo (influenca). Zanesljiv dokaz, da je telo nabito, je le **odboj**.
- **»Več delcev pomeni negativno.«** Predznak ni odvisen od tega, koliko delcev je v telesu, ampak od razlike med protoni in elektroni. Več elektronov kot protonov: $-$. Manj elektronov kot protonov: $+$.
- **»Sila deluje le ob dotiku.«** Električna sila deluje na daljavo, a z razdaljo hitro slabi. Zato mora balon steni priti blizu.

## Povzetek

- Proton ima pozitiven, elektron negativen naboj; telo z enakim številom obeh je nevtralno.
- Pri drgnjenju se premikajo le elektroni. Telo, ki jih prejme, je negativno, telo, ki jih odda, pozitivno. Naboj se ohranja.
- Elektrina $e$ se meri v $\mathrm{As}$ (coulomb, $\mathrm{C}$). Osnovni naboj $e_0 = 1{,}6 \cdot 10^{-19}\,\mathrm{As}$; $e = N \cdot e_0$.
- Istoimenska naboja se odbijata, raznoimenska privlačita; sila je večja pri večjem naboju in manjši razdalji.
- Nabito telo privlači tudi nevtralna telesa (influenca).
- Kovine so prevodniki, plastika, steklo in guma izolatorji. Ozemljeno telo se razelektri.

## Drugače: Na sliki

Nariši ali si predstavljaj tri stanja balona. Znak v oklepaju pove, kaj prevladuje.

```
pred drgnjenjem     po drgnjenju           ob steni

 balon   lasje      balon    lasje       balon | stena
 +-+-    +-+-       -+-+-    +-+         - - - |+ -
 -+-+    -+-+       +-+-     -+-+        - - - |+ -
 (0)     (0)        (−)      (+)         (−)   |(+ ob balonu)
```

- Levo: vsak plus ima svoj minus, oba sta nevtralna.
- Sredina: nekaj minusov je z las preskočilo na balon. Balon ima zdaj več minusov kot plusov, lasje manj.
- Desno: stena je še vedno nevtralna, a elektroni v njej so se malo umaknili od balona. Plusi so bliže balonu kot minusi, zato privlak prevlada.

Pri elektroskopu si predstavljaj črko Λ: več kot je istoimenskega naboja na lističih, bolj se kraka razpreta.

## Drugače: Bolj natančno

Kako močna je sila, je izmeril Charles Coulomb. Za dva majhna nabita delca velja **Coulombov zakon**:

$$F = k \cdot \frac{e_1 \cdot e_2}{r^2}$$

Tu sta $e_1$ in $e_2$ elektrini, $r$ razdalja med njima, $k \approx 9 \cdot 10^{9}\,\mathrm{N\,m^2/(A^2\,s^2)}$ pa stalnica. Iz zakona razbereš dve stvari:

- Če podvojiš en naboj, se sila podvoji.
- Če podvojiš razdaljo, se sila zmanjša na četrtino, ker je $2^2 = 4$.

Snovi lahko razvrstiš po tem, kako rade oddajajo elektrone (**triboelektrična vrsta**). Od tistih, ki postanejo pozitivne, do tistih, ki postanejo negativne: steklo, lasje, volna, svila, papir, guma, poliester, PVC. Ko podrgneš dve snovi, postane pozitivna tista, ki je v vrsti bolj levo.

Vrsta pojasni tudi tvoj telefon: steklo zaslona je skoraj na začetku vrste, zato pri brisanju rado odda elektrone krpi.

## Preveri se

? V tabeli so števila protonov in elektronov v treh telesih. Katero je negativno nabito?

| Telo | protoni | elektroni |
|---|---|---|
| A | 50 | 50 |
| B | 50 | 53 |
| C | 53 | 50 |

- A
~ A ima enako protonov in elektronov, zato je nevtralno, ne negativno.
+ B
- C
~ C ima več delcev skupaj, a predznak določa razlika: elektronov je manj kot protonov, zato je C pozitiven.
> B ima tri elektrone več, kot je protonov, zato prevladuje negativni naboj.

? Balon ima elektrino približno $3{,}2 \cdot 10^{-8}\,\mathrm{As}$. Približno koliko elektronov je prejel?
- Okoli $200$.
~ Elektroni so zelo majhni naboji; za tako elektrino jih potrebuješ ogromno, ne nekaj sto.
+ Okoli $2 \cdot 10^{11}$.
- Okoli $5 \cdot 10^{-27}$.
~ To dobiš, če elektrino pomnožiš z $e_0$. Število elektronov je $N = \dfrac{e}{e_0}$, deliti moraš.
> $N = \dfrac{3{,}2 \cdot 10^{-8}\,\mathrm{As}}{1{,}6 \cdot 10^{-19}\,\mathrm{As}} = 2 \cdot 10^{11}$ elektronov.

? Zakaj nabit glavnik pritegne koščke papirja, čeprav papir ni nabit?
- Ker je papir v resnici pozitivno nabit.
~ Papir je nevtralen. Privlak ne dokazuje, da je drugo telo nabito.
+ Ker se elektroni v papirju malo premaknejo in je bližnja stran nasprotno nabita kot glavnik.
- Ker glavnik papirju že na daljavo preda svoje elektrone.
~ Brez dotika ali iskre elektroni ne preskočijo. V papirju se le prerazporedijo (influenca).
> Pri influenci je bližnja stran nasprotno nabita in bliže, zato je privlak močnejši od odboja na oddaljeni strani.

? Kroglica A odbija kroglico B. Kroglica B privlači negativno nabito palico. Kaj velja za A?
+ A je pozitivna.
- A je negativna.
~ B privlači negativno palico, zato ni negativna. A ima enak predznak kot B, torej ni negativna.
- A je lahko tudi nevtralna.
~ Nevtralno telo je vedno privlačeno, nikoli odbijano. Odboj pomeni, da sta obe kroglici nabiti.
> Odboj pove, da sta A in B nabiti z enakim predznakom. B je torej nabita in privlači negativno palico, zato je pozitivna, prav tako A.

? Delavci, ki sestavljajo telefone, nosijo na zapestju trak, povezan z zemljo. Zakaj?
- Da trak sproti ustvarja pozitiven naboj, ki izniči negativnega.
~ Naboja ni mogoče ustvariti; trak ga le odvaja.
- Da je delavec zaščiten pred tokom iz vtičnice.
~ Trak ni namenjen hišnemu omrežju. Rešuje majhne naboje, ki nastanejo pri drgnjenju.
+ Da naboj, ki ga delavec dobi pri drgnjenju oblačil, sproti odteče v zemljo in ne preskoči na čip.
> Ozemljeno telo se ne more naelektriti, zato ne nastane iskra, ki bi poškodovala drobne dele čipa.

:::simboli
e | elektrina (električni naboj) | e = N \cdot e_0 | As | tudi coulomb, C
N | število prejetih ali oddanih elektronov | N = \dfrac{e}{e_0} | – | vedno celo število
e_0 | osnovni naboj | | As | $1{,}6 \cdot 10^{-19}\,\mathrm{As}$, velikost naboja enega elektrona ali protona
e_A | elektrina balona A | e_A = N_A \cdot e_0 | As
N_A | število elektronov, ki jih prejme balon A | | –
F | električna sila med delcema | F = k \cdot \dfrac{e_1 \cdot e_2}{r^2} | N
k | stalnica v Coulombovem zakonu | | N\,m^2/(A^2\,s^2) | približno $9 \cdot 10^{9}$
e_1, e_2 | elektrini obeh delcev | | As
r | razdalja med delcema | | m
:::
