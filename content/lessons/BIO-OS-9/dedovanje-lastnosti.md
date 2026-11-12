---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Iz kuhinjske omare vzemi pest zrn leče ali mungo fižola in jih čez noč namoči v vodi. Zjutraj jih razdeli na dva krožnika z mokro vato. En krožnik postavi na okensko polico, drugega v temno omaro.

Po petih dneh kalčke primerjaj. Tisti z okna so zeleni in čvrsti. Tisti iz omare so bledo rumeni, tanki in celo daljši. Vsa zrna so iz iste vrečke in iste sorte, zato imajo enaka navodila za barvo listov. Razliko je naredila svetloba.

Uganka iz zgodovine je stara $160$ let. Menih Gregor Mendel je na samostanskem vrtu križal grah z rumenimi in grah z zelenimi semeni. Vsi potomci so imeli rumena semena. Ko pa je te potomce križal med seboj, so se med njihovimi semeni spet pojavila zelena. Kje so se zelena semena skrivala celo generacijo?

Kalčki in grah skupaj pokažejo, kaj o rastlini, živali ali človeku odločijo geni in kaj okolje. Po istih pravilih žlahtnitelji vzgajajo nove sorte koruze in paradižnika.

## Razlaga

**Gen in alel.** Iz prejšnje lekcije veš, da je gen odsek DNA z navodilom za eno beljakovino. Veš tudi, da so kromosomi v telesnih celicah v parih: en kromosom vsakega para je od matere, drugi od očeta. Zato je vsak gen v celici dvakrat, na istem mestu obeh kromosomov para.

Ti dve kopiji nista nujno enaki. Različici istega gena imenujemo **alela**. Razlika: gen pove, *o kateri lastnosti* govori navodilo (barva semena graha), alel pove, *kakšno* je navodilo (rumena ali zelena barva).

**Homozigot in heterozigot.** Alele označimo s črkami, na primer $A$ in $a$. Osebek z dvema enakima aleloma ($AA$ ali $aa$) je **homozigot**. Osebek z dvema različnima aleloma ($Aa$) je **heterozigot**.

**Dominantni in recesivni alel.** Kakšna semena ima heterozigot $Aa$? Pri grahu rumena. Alel, ki se pokaže že, če je prisoten enkrat, je **dominanten** (prevladujoč). Pišemo ga z veliko črko. Alel, ki se pokaže le, če ga ima osebek dvakrat, je **recesiven** (prikrit), pišemo ga z malo črko. Pri grahu je alel za rumeno seme $A$ dominanten, alel za zeleno seme $a$ recesiven.

Pomembna razlika: pri heterozigotu recesivni alel ne izgine. Je v vsaki celici, le njegov učinek se ne vidi.

:::premisli
Na krožniku je rumeno seme graha. Ali lahko samo s pogledom ugotoviš, katera alela ima? Kaj pa pri zelenem semenu?
---
Pri rumenem ne: lahko je $AA$ ali $Aa$, saj dominantni alel prekrije recesivnega. Zeleno seme pa je zagotovo $aa$, ker se recesivna lastnost pokaže le pri dveh recesivnih alelih.
:::

**Genotip in fenotip.** **Genotip** je zapis alelov, ki jih ima osebek (na primer $Aa$). **Fenotip** je lastnost, ki jo vidimo ali izmerimo (rumeno seme). Dva različna genotipa imata lahko enak fenotip:

| Genotip | Vrsta | Fenotip |
|---|---|---|
| $AA$ | homozigot | rumeno seme |
| $Aa$ | heterozigot | rumeno seme |
| $aa$ | homozigot | zeleno seme |

**Spolne celice nosijo en alel.** Spomni se razlike med delitvama. Pri mitozi dobi nova celica oba kromosoma vsakega para, torej oba alela. Pri mejozi gre v spolno celico le en kromosom vsakega para, zato tudi le **en** alel. Rastlina $AA$ naredi samo spolne celice z $A$. Rastlina $Aa$ naredi polovico celic z $A$ in polovico z $a$. Ob oploditvi se alela iz dveh spolnih celic znova združita v par.

**Križanje.** Pri **križanju** načrtno oprašimo ali parimo dva starša z znanima lastnostma in opazujemo potomce. Starše označimo s $\mathrm{P}$, njihove potomce s $\mathrm{F_1}$, potomce $\mathrm{F_1}$ pa s $\mathrm{F_2}$. Vse možnosti zapišemo v **Punnettov kvadrat**: spolne celice enega starša v vrstico, drugega v stolpec, v polja pa njihove pare. Za dva heterozigota $Aa \times Aa$:

|  | $A$ | $a$ |
|---|---|---|
| $A$ | $AA$ | $Aa$ |
| $a$ | $Aa$ | $aa$ |

Vsako polje predstavlja četrtino potomcev. Genotipi so v razmerju $AA : Aa : aa = 1 : 2 : 1$, fenotipi pa v razmerju rumena : zelena $= 3 : 1$. Mendel je v $\mathrm{F_2}$ preštel $6022$ rumenih in $2001$ zelenih semen, kar je $\dfrac{6022}{2001} \approx 3{,}01$ rumenega na eno zeleno.

V simulaciji spodaj (»Križanje: Punnettov kvadrat«) nastavi oba starša na $Aa$ in opazuj, koliko od štirih polj kaže recesivni fenotip. Nato enega starša zamenjaj z $aa$: delež recesivnih potomcev naraste na polovico.

:::premisli
Vse rastline $\mathrm{F_1}$ so imele rumena semena. Zakaj so se v $\mathrm{F_2}$ zelena semena vrnila?
---
Rastline $\mathrm{F_1}$ so bile heterozigoti $Aa$. Alel $a$ je bil v njih prikrit, ne izgubljen. Polovica njihovih spolnih celic ga nosi; ko se srečata dve taki celici, nastane $aa$ in seme je zeleno.
:::

**Vmesno dedovanje.** Pri nekaterih lastnostih noben alel ni dominanten. Če križamo nočno lepotico z rdečimi in z belimi cvetovi, so vsi potomci rožnati. V $\mathrm{F_2}$ dobimo rdeče, rožnate in bele cvetove v razmerju $1 : 2 : 1$. Tu fenotip izda genotip: rožnate cvetove ima le heterozigot. Preizkusi v simulaciji »Vmesno dedovanje«.

**Vpliv okolja.** Spomni se kalčkov z okna in iz omare: genotip enak, fenotip različen. Fenotip nastane iz genotipa *in* okolja (svetloba, hrana, temperatura, voda). Spremembe, ki jih povzroči okolje, se ne dedujejo. Bledi kalček, ki ga iz omare prestaviš na okno, v nekaj dneh ozeleni. Ko zraste in naredi semena, iz njih na svetlobi zrastejo zelene rastline.

## Rešeni primeri

### Primer 1: prva generacija

Mendel je križal homozigotno rastlino graha z rumenimi semeni ($AA$) in rastlino z zelenimi semeni ($aa$). Kakšni so potomci $\mathrm{F_1}$?

**Podatki:** starš 1: $AA$ (rumena semena), starš 2: $aa$ (zelena semena); $A$ dominanten nad $a$
**Iščemo:** genotip in fenotip potomcev $\mathrm{F_1}$

:::formula
Vsak potomec dobi en alel od vsakega starša: $AA \times aa$
:::

**Rešitev:**

1. Starš $AA$ naredi samo spolne celice z $A$, starš $aa$ samo z $a$, ker gre v spolno celico po en alel.
2. Vsak potomec torej dobi $A$ in $a$: genotip $Aa$.
3. Ker je $A$ dominanten, so semena rumena.
4. Odgovor: vsi potomci $\mathrm{F_1}$ so heterozigoti $Aa$ z rumenimi semeni.

### Primer 2: druga generacija

Rastline $\mathrm{F_1}$ ($Aa$) oprašimo med seboj in dobimo $400$ semen. Koliko semen posameznega genotipa in fenotipa pričakujemo?

**Podatki:** starša $Aa \times Aa$, število semen $N = 400$
**Iščemo:** pričakovano število semen $AA$, $Aa$, $aa$ ter rumenih in zelenih

:::formula
Pričakovano število: $N_g = \dfrac{k}{4} \cdot N$, kjer je $k$ število polj Punnettovega kvadrata z izbranim genotipom
:::

**Rešitev:**

1. Vsak starš naredi spolne celice $A$ in $a$. Punnettov kvadrat (zgoraj v razlagi) da polja $AA$, $Aa$, $Aa$, $aa$.
2. Genotip $AA$ ima eno polje: $\dfrac{1}{4} \cdot 400 = 100$.
3. Genotip $Aa$ ima dve polji: $\dfrac{2}{4} \cdot 400 = 200$.
4. Genotip $aa$ ima eno polje: $\dfrac{1}{4} \cdot 400 = 100$.
5. Rumena so semena $AA$ in $Aa$: $100 + 200 = 300$. Zelena so le semena $aa$: $100$.
6. Odgovor: pričakujemo $100$ semen $AA$, $200$ semen $Aa$ in $100$ semen $aa$, torej $300$ rumenih in $100$ zelenih.

### Primer 3: štetje zrn na storžu koruze

Pri koruzi je alel za gladko, škrobno zrno ($S$) dominanten nad alelom za nagubano, sladko zrno ($s$). Vsako zrno na storžu je svoj potomec. Na enem storžu preštejemo $412$ gladkih in $136$ nagubanih zrn. Kakšna sta bila genotipa staršev? Koliko gladkih zrn je predvidoma heterozigotnih?

**Podatki:** $412$ gladkih zrn, $136$ nagubanih zrn; $S$ dominanten nad $s$
**Iščemo:** genotipa staršev in pričakovano število heterozigotov med gladkimi zrni

:::formula
Razmerje fenotipov $3 : 1$ da le križanje $Ss \times Ss$; med potomci z dominantnim fenotipom je $\dfrac{2}{3}$ heterozigotov.
:::

**Rešitev:**

1. Razmerje fenotipov: $\dfrac{412}{136} \approx 3{,}03$, torej približno $3 : 1$.
2. Preverimo druge možnosti. Pri $SS \times$ karkoli bi bila vsa zrna gladka. Pri $Ss \times ss$ bi bilo razmerje $1 : 1$. Pri $ss \times ss$ bi bila vsa nagubana. Ostane $Ss \times Ss$.
3. Preizkus: zrn je $412 + 136 = 548$; pri $Ss \times Ss$ bi pričakovali $\dfrac{1}{4} \cdot 548 = 137$ nagubanih, prešteli smo $136$.
4. Med gladkimi zrni so polja $SS$, $Ss$, $Ss$: dve od treh sta heterozigotni.
5. $\dfrac{2}{3} \cdot 412 \approx 275$.
6. Odgovor: oba starša sta bila heterozigota $Ss$; med gladkimi zrni je predvidoma približno $275$ heterozigotov.

### Primer 4 – zdaj ti: paradižnik iz domačega vrta

Pri paradižniku je alel za rdeč plod ($R$) dominanten nad alelom za rumen plod ($r$). Vrtnarka ima rastlino z rdečimi plodovi in ne ve, ali je $RR$ ali $Rr$. Oplodi jo s pelodom rastline z rumenimi plodovi. Iz semen zraste $24$ rastlin: $12$ z rdečimi in $12$ z rumenimi plodovi. Kakšen je genotip rdeče rastline?

**Podatki:** rdeča rastlina $R\_$ (neznan drugi alel), rumena rastlina $rr$; $24$ potomcev: $12$ rdečih, $12$ rumenih
**Iščemo:** genotip rdeče rastline

:::formula
Križanje z recesivnim homozigotom $rr$: potomci pokažejo, katere spolne celice naredi neznani starš.
:::

**Rešitev:**

1. Rumena rastlina $rr$ da vsem potomcem alel $r$.
2. Če bi bila rdeča rastlina $RR$, bi bili vsi potomci $Rr$, torej rdeči. Rumenih potomcev ne bi bilo.
3. Sklepaj sam: kateri genotip ima rdeča rastlina in kakšno razmerje bi napovedal Punnettov kvadrat?

:::premisli
Kakšen je genotip rdeče rastline in ali se $12 : 12$ ujema z napovedjo?
---
Rdeča rastlina je $Rr$. Punnettov kvadrat $Rr \times rr$ ima dve polji $Rr$ (rdeč plod) in dve polji $rr$ (rumen plod), razmerje $1 : 1$. Pričakovano $\dfrac{24}{2} = 12$ rdečih in $12$ rumenih, kar se natanko ujema.
:::

## Pogoste napake

- **»Dominantni alel je boljši ali pogostejši.«** Dominanten pomeni le, da se pokaže že v eni kopiji. Ne pove, ali je lastnost koristna ali pogosta.
- **»Recesivni alel se pri heterozigotu izgubi.«** Ostane v vsaki celici in polovica spolnih celic ga nosi. Zato se recesivna lastnost lahko pojavi pri vnukih, kot zelena semena v $\mathrm{F_2}$.
- **»Razmerje 3 : 1 pomeni, da so od štirih potomcev natanko trije rumeni.«** Razmerje je napoved za veliko potomcev; pri štirih semenih so lahko vsa rumena.
- **»Iz fenotipa vedno razberem genotip.«** Le pri recesivni lastnosti (in pri vmesnem dedovanju). Dominantni fenotip ima lahko homozigot ali heterozigot; razliko pokaže šele križanje z recesivnim homozigotom.
- **»Kar rastlina pridobi v življenju, podeduje njen potomec.«** Okolje spremeni fenotip, ne alelov v spolnih celicah. Seme drobne rastline iz sence na sončnem mestu zraste v normalno veliko rastlino.

## Povzetek

- Gen je navodilo za lastnost, alel je ena različica tega navodila. Telesna celica ima vsak gen dvakrat, po en alel od vsakega starša.
- Homozigot ima enaka alela ($AA$, $aa$), heterozigot različna ($Aa$).
- Dominantni alel se pokaže že enkrat, recesivni le v paru $aa$; pri heterozigotu je recesivni prikrit, ne izgubljen.
- Genotip je zapis alelov, fenotip vidna lastnost. Fenotip je odvisen od genotipa in okolja; spremembe zaradi okolja se ne dedujejo.
- Spolna celica nosi en alel vsakega gena. Punnettov kvadrat pokaže potomce križanja: $AA \times aa$ da same $Aa$, $Aa \times Aa$ da $1 : 2 : 1$ po genotipu in $3 : 1$ po fenotipu, $Aa \times aa$ da $1 : 1$.
- Pri vmesnem dedovanju noben alel ni dominanten (rdeča × bela = rožnata).

## Drugače: Na sliki

:::risba skica
opis: Trije pari kromosomov. Na istem mestu obeh kromosomov je pas z alelom. Levi par ima na obeh kromosomih alel A in je označen AA, homozigot. Srednji par ima na enem kromosomu A, na drugem a in je označen Aa, heterozigot. Desni par ima na obeh a in je označen aa, homozigot.
območje: 0; 0 .. 12; 7
enota: 25
pravokotnik: 1,3; 2 .. 1,9; 6 | siva
pravokotnik: 2,5; 2 .. 3,1; 6 | siva
pravokotnik: 1,3; 3,8 .. 1,9; 4,3 | oranžna polno
pravokotnik: 2,5; 3,8 .. 3,1; 4,3 | oranžna polno
napis: 1,1; 4,05 | A | levo | debelo
napis: 3,3; 4,05 | A | desno | debelo
napis: 2,2; 1,3 | AA | sredina | debelo
napis: 2,2; 0,5 | homozigot | sredina
pravokotnik: 5,3; 2 .. 5,9; 6 | siva
pravokotnik: 6,5; 2 .. 7,1; 6 | siva
pravokotnik: 5,3; 3,8 .. 5,9; 4,3 | oranžna polno
pravokotnik: 6,5; 3,8 .. 7,1; 4,3 | modra polno
napis: 5,1; 4,05 | A | levo | debelo
napis: 7,3; 4,05 | a | desno | debelo
napis: 6,2; 1,3 | Aa | sredina | debelo
napis: 6,2; 0,5 | heterozigot | sredina
pravokotnik: 9,3; 2 .. 9,9; 6 | siva
pravokotnik: 10,5; 2 .. 11,1; 6 | siva
pravokotnik: 9,3; 3,8 .. 9,9; 4,3 | modra polno
pravokotnik: 10,5; 3,8 .. 11,1; 4,3 | modra polno
napis: 9,1; 4,05 | a | levo | debelo
napis: 11,3; 4,05 | a | desno | debelo
napis: 10,2; 1,3 | aa | sredina | debelo
napis: 10,2; 0,5 | homozigot | sredina
podnapis: Alela sta na istem mestu obeh kromosomov para: en kromosom je od matere, drugi od očeta.
:::

Par kromosomov je kot dva izvoda iste knjige, od mame in od očeta. Na isti strani obeh je navodilo za barvo semena. Enaki strani pomenita homozigota, različni heterozigota. Srednja rastlina ima rumeno seme, ker se pokaže dominantni $A$.

Ob mejozi gre v spolno celico samo en kromosom iz vsakega para. Levi par lahko odda samo $A$, desni samo $a$, srednji pa enkrat $A$, drugič $a$. Od tod pride polovica v Punnettovem kvadratu.

## Drugače: Iz vsakdanjega življenja

Predstavljaj si, da dobi vsak kuhar dve kartici z receptom za isto omako, eno od mame in eno od očeta. Recept za omako je **gen**, različica na kartici je **alel**.

- Ena kartica pravi »dodaj čili«, druga »brez čilija«. Omaka je pekoča: alel »s čilijem« je **dominanten**.
- Blaga omaka nastane le, če obe kartici pravita »brez čilija«. Ta alel je **recesiven**.
- Kuhar s karticama »s čilijem« in »brez« (heterozigot) kuha pekoče, a otroku lahko preda kartico »brez«. Če jo otrok dobi še od drugega starša, kuha blago.

Kombinacija kartic je **genotip**, okus omake na krožniku je **fenotip**. Še nekaj ve vsak kuhar: po enakem receptu se omaka zažge, če je štedilnik premočan. To je **vpliv okolja**. Zažgana omaka pa ne spremeni kartic, ki jih kuhar preda naprej.

## Preveri se

? Katera polja ima Punnettov kvadrat za križanje $Aa \times aa$?
- eno $AA$, dve $Aa$, eno $aa$
~ To je križanje $Aa \times Aa$. Starš $aa$ naredi samo spolne celice z $a$, zato $AA$ ne more nastati.
+ dve $Aa$ in dve $aa$
- vsa štiri polja $Aa$
~ To je križanje $AA \times aa$. Heterozigot $Aa$ odda tudi alel $a$, zato nastane tudi $aa$.
- samo $aa$ v vseh štirih poljih
~ Heterozigot ni enak recesivnemu homozigotu: polovica njegovih spolnih celic nosi $A$.
> Starš $Aa$ odda $A$ ali $a$, starš $aa$ samo $a$. Dve polji sta $Aa$, dve $aa$: razmerje $1 : 1$.

? Rastline $\mathrm{F_1}$ graha ($Aa$) oprašimo med seboj in dobimo $200$ semen. Koliko zelenih semen pričakuješ? Vpiši število.
= 50
~ 0 | Alel $a$ se v $\mathrm{F_1}$ ni izgubil, le prikrit je bil. Ko se srečata dve spolni celici z $a$, nastane zeleno seme.
~ 100 | Polovica ($\dfrac{2}{4}$) so heterozigoti $Aa$, ki imajo rumena semena. Zelena so le semena $aa$, ena četrtina.
~ 150 | To je število rumenih semen ($AA$ in $Aa$, tri četrtine). Zelena so recesivna, ena četrtina.
> Zelena so le semena $aa$: $\dfrac{1}{4} \cdot 200 = 50$.

? Zakaj ima heterozigot $Aa$ rumena semena, čeprav ima alel za zeleno barvo?
- Ker se je alel $a$ pri oploditvi izgubil.
~ Alel $a$ je v vsaki celici heterozigota in ga ta preda polovici svojih spolnih celic.
- Ker je rumena barva v naravi pogostejša.
~ Dominanten ne pomeni pogost. Pove le, katera lastnost se pokaže pri heterozigotu.
+ Ker dominantni alel $A$ prekrije učinek recesivnega alela $a$.
- Ker semena porumenijo zaradi sonca.
~ Barvo semena graha tu določa genotip, ne sonce.
> Pri heterozigotu se pokaže dominantni alel. Recesivni ostane, a se pokaže le v paru $aa$.

? Pri paradižniku je rdeč plod ($R$) dominanten nad rumenim ($r$). Polovica potomcev dveh rastlin ima rdeče, polovica rumene plodove. Kakšna sta bila genotipa staršev?
- oba heterozigota, $Rr \times Rr$
~ Dva heterozigota dasta razmerje $3 : 1$, ne $1 : 1$.
- rdeč homozigot in rumen, $RR \times rr$
~ Starš $RR$ da vsem potomcem $R$, zato bi bili vsi plodovi rdeči.
+ heterozigot in rumen, $Rr \times rr$
- oba z rumenimi plodovi, $rr \times rr$
~ Starša $rr$ imata le alel $r$, zato bi bili vsi plodovi rumeni.
> Heterozigot odda $R$ ali $r$, recesivni homozigot samo $r$: polovica potomcev je $Rr$ (rdeč plod), polovica $rr$ (rumen plod).

? Gomolji krompirja ene sorte imajo enake gene, ker zrastejo iz delov iste rastline. Na senčni njivi so zrasli drobni gomolji, na sončni debeli. Drobne gomolje iz sence naslednje leto posadimo na sončno njivo. Kaj pričakujemo?
- Spet drobne gomolje, ker so drobnost podedovali.
~ Drobnost je povzročilo okolje (senca). Spremembe zaradi okolja se ne dedujejo.
- Četrtino drobnih in tri četrtine debelih.
~ Razmerje $3 : 1$ velja pri križanju heterozigotov. Tu ni križanja, vsi gomolji imajo enak genotip.
+ Debele gomolje, kot na sončni njivi.
- Gomolje vmesne velikosti, ker se lastnosti obeh njiv pomešajo.
~ Tu ni križanja dveh staršev. Odloča njiva, na kateri gomolji rastejo.
> Genotip je enak, spremenilo se je le okolje, zato bodo gomolji debeli.

:::simboli
A | dominantni alel za rumeno seme graha | | –
a | recesivni alel za zeleno seme graha | | –
N | število vseh potomcev | | –
N_g | pričakovano število potomcev z izbranim genotipom | N_g = \dfrac{k}{4} \cdot N | –
k | število polj Punnettovega kvadrata z izbranim genotipom | | – | od $0$ do $4$
S | dominantni alel za gladko, škrobno zrno koruze | | –
s | recesivni alel za nagubano, sladko zrno koruze | | –
R | dominantni alel za rdeč plod paradižnika | | –
r | recesivni alel za rumen plod paradižnika | | –
:::

<<RACUN
vrednost: 6022/2001 | 3.01
vrednost: 400/4 | 100
vrednost: 2*400/4 | 200
vrednost: 100+200 | 300
vrednost: 412/136 | 3.03
vrednost: 412+136 | 548
vrednost: 548/4 | 137
vrednost: 2/3*412 | 274.67
vrednost: 24/2 | 12
vrednost: 200/4 | 50
vrednost: 2*200/4 | 100
vrednost: 3*200/4 | 150
>>
