---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leta 1869 je ruski kemik Dmitrij Mendelejev pisal učbenik kemije za svoje študente. Takrat so poznali okoli $63$ elementov, od mehkih kovin do strupenih plinov. Kako naj jih predstavi, da ne bodo le dolg seznam brez reda?

Elemente je razvrstil po naraščajoči masi atomov in opazil, da se podobne lastnosti ponavljajo v rednih presledkih. Podobne elemente je zato postavil drugega pod drugega. Kjer ni ustrezal noben znan element, je pustil prazno mesto, ker je sklepal, da tak element še ni odkrit. Leta 1875 so odkrili galij, ki je imel prav take lastnosti, kot jih je napovedal za eno od praznih mest.

Danes poznamo $118$ elementov, urejenih kot karte v roki dobrega igralca. Iz mesta elementa v periodnem sistemu veš, koliko lupin ima atom, koliko elektronov je v zunanji lupini in ali je element kovina.

## Razlaga

**1. Mamljiva, a napačna misel.** V isti vrstici tabele sedijo sosedje: natrij, magnezij, aluminij ... Imajo zaporedna vrstna števila, zato bi pričakoval, da so si najbolj podobni. Niso. Natrij je mehka kovina, ki burno reagira z vodo, klor na koncu iste vrstice pa strupen rumenozelen plin. Natriju je najbolj podoben kalij, ki ne stoji ob njem, ampak *pod* njim.

**2. Vrstice in stolpci.** Elementi si sledijo po naraščajočem vrstnem številu $Z$. Vodoravne vrstice so **periode**; teh je $7$. Navpični stolpci so **skupine**; teh je $18$. Lego elementa povemo s periodo in skupino: klor je v 3. periodi in 17. skupini. Spodaj je prvih $18$ elementov. Skupin od $3$ do $12$ tu ni, ker se začnejo šele v 4. periodi:

```
perioda | 1   2   13  14  15  16  17  18
   1    | H                           He
   2    | Li  Be  B   C   N   O   F   Ne
   3    | Na  Mg  Al  Si  P   S   Cl  Ar
```

**3. Lupine.** Elektroni so v ovojnici razporejeni v lupinah. Pri prvih $20$ elementih gresta v 1. lupino največ $2$ elektrona, v 2. največ $8$, v 3. prav tako $8$, ostali v naslednjo lupino. Natrij z $11$ elektroni ima tako razporeditev 2, 8, 1. Podrobneje to spoznaš v lekciji Razporeditev elektronov.

**4. Perioda pove število lupin.** Številka periode je enaka številu lupin, v katerih so elektroni. Natrij (2, 8, 1) ima tri lupine in je v 3. periodi. Litij (2, 1) ima dve lupini in je v 2. periodi. Prva perioda ima le dva elementa (H, He), ker gresta v 1. lupino samo dva elektrona; druga in tretja imata po osem.

**5. Skupina pove število valenčnih elektronov.** Elektrone v zunanji lupini imenujemo **valenčni elektroni**. V skupinah $1$ in $2$ je njihovo število enako številki skupine. V skupinah od $13$ do $18$ je enako številki skupine, zmanjšani za $10$: v 17. skupini je $17 - 10 = 7$ valenčnih elektronov. Izjema je helij v 18. skupini, ki ima samo $2$ elektrona.

Valenčni elektroni prvi pridejo v stik z drugimi atomi, zato imajo elementi iste skupine **podobne kemijske lastnosti**. Natrij (2, 8, 1) in kalij (2, 8, 8, 1) imata oba po $1$ valenčni elektron. To popravi misel iz točke 1: podobni so si elementi v istem stolpcu, ne v isti vrstici.

:::premisli
Litij ima razporeditev 2, 1. Ne da bi pogledal tabelo, napovej, koliko valenčnih elektronov ima, v kateri skupini je in ali z vodo reagira podobno kot natrij.
---
En valenčni elektron (2, 1). Ker je v isti skupini kot natrij, reagira z vodo podobno, le mirneje.
:::

**6. Imena nekaterih skupin.**

- 1. skupina (brez vodika): **alkalijske kovine** (litij, natrij, kalij ...).
- 2. skupina: **zemeljskoalkalijske kovine** (magnezij, kalcij ...).
- 17. skupina: **halogeni** (fluor, klor, brom, jod ...).
- 18. skupina: **žlahtni plini** (helij, neon, argon ...). Zunanjo lupino imajo zapolnjeno, zato zelo malo reagirajo.
- Skupine od 3 do 12: **prehodne kovine** (npr. železo, baker, cink).

**7. Kovine in nekovine.** Večina elementov so **kovine**. Ležijo na levi in v sredini tabele. **Nekovine** ležijo na desni, zgoraj. Mejo med njimi kaže stopničasta črta od bora (B) do astata (At). Elementi ob njej, npr. silicij (Si), imajo nekaj lastnosti kovin in nekaj nekovin; imenujemo jih **polkovine**.

| Lastnost | Kovine | Nekovine |
|---|---|---|
| Videz | kovinski sijaj | večinoma brez sijaja |
| Prevajanje toplote in električnega toka | dobro | slabo (izjema je grafit) |
| Pri kovanju (trdne snovi) | kovne: lahko jih preoblikujemo, ne da bi se zdrobile | krhke: se razbijejo |
| Agregatno stanje pri sobni temperaturi | skoraj vse trdne (živo srebro je tekoče) | trdne, tekoče (brom) ali plinaste (kisik) |

:::premisli
Vodik je nekovina, pa vendar stoji v 1. skupini, med kovinami. Zakaj?
---
Mesto določa zgradba atoma, ne to, ali je element kovina. Vodik ima en elektron, torej $1$ valenčni elektron kot alkalijske kovine. Je pa plin brez kovinskih lastnosti, zato ni alkalijska kovina.
:::

V simulaciji spodaj (»3D: Periodni sistem«) tapni natrij, nato kalij in primerjaj njuni zunanji lupini.

## Rešeni primeri

### Primer 1 (lažji): magnezija na rokah plezalca

Plezalci in telovadci si roke posujejo z »magnezijo« (magnezijevim karbonatom), da ostanejo suhe. Atom magnezija ima $12$ elektronov, razporejenih 2, 8, 2. V kateri periodi in skupini je magnezij?

**Podatki:** element magnezij ($\mathrm{Mg}$), število elektronov $12$, razporeditev po lupinah 2, 8, 2
**Iščemo:** periodo in skupino magnezija

:::formula
številka periode = število lupin z elektroni

številka skupine = število valenčnih elektronov (skupini 1 in 2)
:::

**Rešitev:**

1. Preštejemo lupine: 2, 8 in 2 so **tri lupine**, zato je magnezij v **3. periodi**.
2. Zunanja lupina ima **2 elektrona**. Pri skupinah 1 in 2 je to kar številka skupine, zato je magnezij v **2. skupini**.
3. Preverimo: $2 + 8 + 2 = 12$, kar ustreza vrstnemu številu magnezija.

Odgovor: magnezij je v 3. periodi in 2. skupini; je zemeljskoalkalijska kovina.

### Primer 2: klor v bazenu

Vodo v bazenih razkužujejo s spojinami klora. Klor je v 3. periodi in 17. skupini. Koliko elektronov ima njegov nevtralni atom in kako so razporejeni po lupinah?

**Podatki:** element klor, 3. perioda, 17. skupina, atom je nevtralen
**Iščemo:** število elektronov in njihovo razporeditev po lupinah

:::formula
število lupin = številka periode

število valenčnih elektronov = številka skupine $-\ 10$ (skupine 13 do 18)

notranje lupine so polne: v 1. lupini $2$, v 2. lupini $8$ elektronov
:::

**Rešitev:**

1. 3. perioda pomeni **tri lupine** z elektroni.
2. 17. skupina pomeni $17 - 10 = 7$ **valenčnih elektronov**, ki so v tretji, zunanji lupini.
3. Notranji lupini sta polni: v prvi sta $2$ elektrona, v drugi $8$.
4. Skupaj: $2 + 8 + 7 = 17$ elektronov.
5. Preverimo: klor ima vrstno število $17$, torej $17$ elektronov.

Odgovor: klorov atom ima $17$ elektronov, razporejenih 2, 8, 7. Klor je halogen in nekovina.

### Primer 3 (težji): napitek za športnike

Športni napitki vsebujejo natrij in kalij. Natrij ($\mathrm{Na}$) ima $11$ elektronov (2, 8, 1). Kateri od elementov $\mathrm{K}$ ($19$ elektronov), $\mathrm{Mg}$ ($12$ elektronov) in $\mathrm{Cl}$ ($17$ elektronov) ima natriju najbolj podobne kemijske lastnosti? Določi lego tega elementa.

**Podatki:** $\mathrm{Na}$: $11$ elektronov (2, 8, 1); $\mathrm{K}$: $19$ elektronov; $\mathrm{Mg}$: $12$ elektronov; $\mathrm{Cl}$: $17$ elektronov
**Iščemo:** element z natriju najbolj podobnimi kemijskimi lastnostmi in njegovo lego (perioda, skupina)

:::formula
Podobne kemijske lastnosti imajo elementi z enakim številom valenčnih elektronov (ista skupina).

lupine se polnijo po $2$, $8$, $8$ elektronov (prvih 20 elementov)

številka periode = število lupin; številka skupine = število valenčnih elektronov (skupini 1 in 2)
:::

**Rešitev:**

1. Natrij ima $1$ valenčni elektron (**1. skupina**). Iščemo element s prav tako $1$ zunanjim elektronom.
2. Razporedimo elektrone drugih elementov:
   - $\mathrm{K}$: $19$ elektronov, razporeditev 2, 8, 8, 1; **1 zunanji elektron**.
   - $\mathrm{Mg}$: 2, 8, 2; zunanja lupina ima $2$ elektrona.
   - $\mathrm{Cl}$: 2, 8, 7; zunanja lupina ima $7$ elektronov.
3. Natriju je najbolj podoben **kalij**, ker ima prav tako $1$ valenčni elektron. Magnezij je le sosed v 3. periodi.
4. Določi sam še lego kalija iz njegove razporeditve 2, 8, 8, 1. Nato preveri:

:::premisli
V kateri periodi in skupini je kalij?
---
Štiri lupine pomenijo **4. periodo**, $1$ valenčni elektron pa **1. skupino**. Kalij stoji v tabeli neposredno pod natrijem; oba sta alkalijski kovini.
:::

## Pogoste napake

- **Zamenjava skupine in periode.** Učenec postavi magnezij (2, 8, 2) v 2. periodo, ker ima $2$ zunanja elektrona. Popravek: perioda (vrstica) = lupine, skupina (stolpec) = zunanji elektroni.
- **»Prištejem 10 vedno.«** Učenec atom z 2 zunanjima elektronoma postavi v 12. skupino. Desetico prištejemo le pri skupinah od $13$ do $18$, ker so pred njimi skupine prehodnih kovin. Popravek: pri $1$ ali $2$ zunanjih elektronih je skupina $1$ ali $2$.
- **Štetje vseh elektronov namesto valenčnih.** Klor ima $17$ elektronov in je v 17. skupini, a to je naključje: brom ima $35$ elektronov in je prav tako v 17. skupini. Popravek: za skupino štej le zunanje elektrone.
- **»Sosedje v vrstici so si podobni.«** Natrij in magnezij sta soseda, a imata različno število valenčnih elektronov. Popravek: podobni so si elementi v istem *stolpcu*.
- **»Vodik je kovina, ker je v 1. skupini«** in **»vse nekovine so plini«.** Vodik je nekovina. Žveplo, ogljik in jod so trdne nekovine, brom je tekoč. Popravek: kovine prepoznaš po lastnostih in po legi levo od stopničaste črte; vodik je edina nekovina na levi strani.

## Povzetek

- Periodni sistem razvršča elemente po naraščajočem vrstnem številu.
- **Perioda** (vodoravna vrstica, 1 do 7) = število lupin z elektroni.
- **Skupina** (navpični stolpec, 1 do 18) = elementi s podobnimi lastnostmi in enakim številom valenčnih elektronov. Za 1. in 2. skupino je to številka skupine, za skupine 13 do 18 številka skupine minus 10 (izjema helij: 2).
- Imena skupin: alkalijske kovine (1.), zemeljskoalkalijske kovine (2.), halogeni (17.), žlahtni plini (18.), prehodne kovine (3. do 12.).
- Kovine so levo in v sredini, nekovine desno zgoraj, polkovine ob stopničasti meji. Kovine dobro prevajajo toploto in tok ter so kovne; nekovine slabo prevajajo in so krhke, če so trdne.

## Drugače: Kot zgodba

Ema in Luka igrata igro s kartami. Na vsaki je element z razporeditvijo elektronov. Luka zloži karte po številu elektronov v eno dolgo vrsto, od vodika do kalcija, in iz nje ne razbere ničesar.

Ema opazi, da se karta z enim zunanjim elektronom ponavlja: litij ($3$), natrij ($11$), kalij ($19$). Vsakič je osem kart naprej: $3 + 8 = 11$, $11 + 8 = 19$. Zato vsakič, ko pride taka karta, začne novo vrsto. Karte z enakim številom zunanjih elektronov se same postavijo druga pod drugo.

Pred njo je tabela. Vsaka nova vrsta pomeni novo lupino: to so periode. V stolpcih so karte z enakim številom zunanjih elektronov: to so skupine. Luka pokaže stolpec z litijem, natrijem in kalijem: same mehke kovine, ki reagirajo z vodo. Ema je ponovila, kar je Mendelejev naredil z elementi.

## Drugače: Korak za korakom s številkami

Recept: **kje je element, če poznaš razporeditev elektronov?**

Primer: atom ima elektrone razporejene 2, 8, 6.

| Korak | Dejanje | Rezultat |
|---|---|---|
| 1 | Seštej vse elektrone | $2 + 8 + 6 = 16$ (vrstno število je 16) |
| 2 | Preštej lupine | 3 lupine, torej 3. perioda |
| 3 | Zadnja lupina | 6 valenčnih elektronov |
| 4 | Skupina | $10 + 6 = 16$, torej 16. skupina |
| 5 | Poišči v tabeli | 3. perioda, 16. skupina: žveplo ($\mathrm{S}$) |
| 6 | Kovina ali nekovina? | desno zgoraj: nekovina |

Obratno (iz lege v elektrone): perioda da število lupin, skupina valenčne elektrone, notranje lupine so polne.

## Drugače: Bolj natančno

Mendelejev je elemente razvrščal po masi atomov, danes jih po vrstnem številu, ker element določa število protonov. Vrstni red je večinoma enak, ne pa povsod: argon ima večjo maso atoma kot kalij, a manjše vrstno število, zato stoji pred njim.

Atomi kovin imajo običajno malo valenčnih elektronov (1 do 3), atomi nekovin več (4 do 7, žlahtni plini 8).

## Preveri se

? Kateri element ne sodi v isto skupino kot ostali trije?
- litij ($\mathrm{Li}$)
~ Litij je v 1. skupini nad natrijem in ima $1$ valenčni elektron, tako kot natrij in kalij.
- kalij ($\mathrm{K}$)
~ Kalij je v 1. skupini pod natrijem, z enim valenčnim elektronom.
+ magnezij ($\mathrm{Mg}$)
- natrij ($\mathrm{Na}$)
~ Natrij je v 1. skupini, kot litij in kalij.
> Litij, natrij in kalij imajo po $1$ valenčni elektron (1. skupina). Magnezij ima $2$ (2. skupina), čeprav je natrijev sosed.

? Kalij stoji v periodnem sistemu neposredno pod natrijem. Kaj iz tega sledi?
- Ima enako število lupin kot natrij.
~ Enako število lupin imajo elementi v isti vrstici (periodi), ne v istem stolpcu.
- Ima en valenčni elektron več kot natrij.
~ Navzdol po stolpcu se število valenčnih elektronov ne spremeni; doda se ena lupina.
+ Ima eno lupino več in enako število valenčnih elektronov, zato ima podobne lastnosti.
> Pod natrijem pomeni isto skupino in naslednjo periodo.

? Maja določa lego atoma z razporeditvijo 2, 8, 8, 2. (1) Atom ima štiri lupine. (2) Torej je v 4. periodi. (3) V zunanji lupini sta $2$ elektrona. (4) Torej je v 12. skupini. Kateri korak je napačen?
- korak 1
~ Štiri števila v razporeditvi so res štiri lupine.
- korak 2
~ Perioda je enaka številu lupin, zato 4. perioda drži.
- korak 3
~ Zadnje število je $2$, zato ta korak drži.
+ korak 4
> Pri $1$ ali $2$ valenčnih elektronih je številka skupine enaka njihovemu številu. Desetico prištejemo le pri skupinah od $13$ do $18$. Atom je kalcij v 4. periodi in 2. skupini.

? Element je v 3. periodi in 14. skupini. Koliko elektronov ima njegov nevtralni atom?
- $17$
~ Seštel si periodo in skupino. Perioda pove lupine, ne elektronov.
- $4$
~ To so samo valenčni elektroni. Prišteti moraš še elektrone v obeh notranjih lupinah.
+ $14$
- $24$
~ Številko skupine si vzel za število zunanjih elektronov. V skupinah od 13 do 18 najprej odštej $10$.
> Lupine: $2$, $8$ in $14 - 10 = 4$, skupaj $2 + 8 + 4 = 14$ (silicij).

? Balone za okrasitev štadiona napolnijo s helijem, ne z vodikom, čeprav je vodik še lažji. Zakaj je helij varnejši?
- Ker je kovina, kovine pa ne gorijo.
~ Helij je žlahtni plin v 18. skupini, nekovina. Tudi nekatere kovine gorijo, npr. magnezij.
+ Ker je žlahtni plin z zapolnjeno zunanjo lupino in skoraj ne reagira, zato ne gori.
- Ker ima več lupin kot vodik.
~ Oba sta v 1. periodi in imata le eno lupino. Razlika je v zapolnjenosti lupine.
> Helijeva edina lupina je z $2$ elektronoma zapolnjena, zato helij skoraj ne reagira. Vodik pa gori in lahko eksplodira.

:::simboli
\mathrm{Na} | natrij | | | 11 elektronov
\mathrm{K} | kalij | | | 19 elektronov
\mathrm{Mg} | magnezij | | | 12 elektronov
\mathrm{Cl} | klor | | | 17 elektronov
:::
