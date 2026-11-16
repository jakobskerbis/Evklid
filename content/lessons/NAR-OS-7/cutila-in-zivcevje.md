---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na sistematskem pregledu ti zdravnica z gumijastim kladivcem potrka tik pod koleno. Noga sama od sebe sune naprej, čeprav tega nisi hotel. Zjutraj zazvoni budilka in jo z roko utišaš, tokrat povsem namerno.

Ena stvar se zgodi brez tvoje volje, druga z njo. Pa vendar sta si podobni: v okolici se nekaj spremeni, telo to zazna in odgovori z gibom. Isto se dogaja ves dan, ko se umakneš kolesu, zavohaš zažgan toast ali pripreš oči na soncu.

Za vse to skrbita **čutila**, ki spremembo zaznajo, in **živčevje**, ki sporočilo prenese in odloči, kaj naj telo naredi. S tem dobiš odgovor na tri vsakdanja vprašanja: kaj zdravnica preverja s kladivcem, zakaj hrana ob prehladu nima okusa in zakaj zaspan voznik zavira prepozno.

## Razlaga

Začnimo s sliko. Z roko se dotakneš vročega lonca in jo bliskovito umakneš. Pot sporočila je narisana od zgoraj navzdol:

:::risba skica
opis: Šest okvirjev, povezanih s puščicami od zgoraj navzdol: dražljaj vroč lonec, čutnice v koži, čutilni živec, hrbtenjača, gibalni živec, mišica umakne roko.
območje: 0; 0 .. 8; 12
enota: 30
pravokotnik: 1; 10,4 .. 7; 11,6 | oranžna
pravokotnik: 1; 8,4 .. 7; 9,6 | modra
pravokotnik: 1; 6,4 .. 7; 7,6 | modra
pravokotnik: 1; 4,4 .. 7; 5,6 | zelena
pravokotnik: 1; 2,4 .. 7; 3,6 | modra
pravokotnik: 1; 0,4 .. 7; 1,6 | oranžna
napis: 4; 11 | dražljaj: vroč lonec | sredina
napis: 4; 9 | čutnice v koži | sredina
napis: 4; 7 | čutilni živec | sredina
napis: 4; 5 | hrbtenjača | sredina
napis: 4; 3 | gibalni živec | sredina
napis: 4; 1 | mišica umakne roko | sredina
puščica: 4; 10,4 -> 4; 9,6
puščica: 4; 8,4 -> 4; 7,6
puščica: 4; 6,4 -> 4; 5,6
puščica: 4; 4,4 -> 4; 3,6
puščica: 4; 2,4 -> 4; 1,6
podnapis: Pot sporočila pri umiku roke od vročega lonca.
:::

Pojdimo po sliki okvir za okvirjem.

**Dražljaj** (zgornji okvir) je sprememba, ki jo telo zazna: svetloba, zvok, vonj, dotik, vročina. Tu je to vročina lonca.

**Čutnice** (drugi okvir) so posebne celice, ki zaznajo eno vrsto dražljaja. V koži so čutnice za toploto, mraz, dotik, pritisk in bolečino. Kjer so čutnice zbrane v organu, temu rečemo **čutilo**: oko, uho, nos, jezik, koža.

**Živec** (tretji in peti okvir) je snop dolgih podaljškov **živčnih celic** ali **nevronov**. Nevron si predstavljaj kot drevo z dolgim deblom: krajši razvejani podaljški sprejmejo sporočilo, telo celice z jedrom ga obdela, dolg podaljšek pa ga nese naprej, lahko tudi več kot meter daleč.

Sporočilo potuje kot drobni električni signal. **Čutilni živec** ga nese od čutila k **osrednjemu živčevju** (možgani in hrbtenjača), **gibalni živec** od tam k mišici.

**Hrbtenjača** (četrti, zeleni okvir) je debel snop živčevja v hrbtenici. Pri vročem loncu se odloči kar sama in takoj pošlje ukaz. Tak hiter, samodejen odziv brez razmišljanja imenujemo **refleks**. Možgani dobijo sporočilo malo kasneje, zato bolečino začutiš šele, ko je roka že umaknjena.

**Odziv** (spodnji okvir) je to, kar telo naredi: mišica se skrči ali **žleza** (organ, ki izdeluje in izloča snov) izloči solze ali slino.

Pri budilki je pot daljša: čutnice v ušesu, slušni živec, **možgani**, ki se odločijo, nato prek hrbtenjače gibalni živec in mišice roke. Ta odziv je **hoten** (odločiš se zanj): sporočilo potuje dlje in možgani se morajo odločiti, zato je počasnejši od refleksa.

:::premisli
Človek ima povsem zdrave oči, a mu je pri nesreči poškodovan vidni živec, ki povezuje oko z možgani. Ali vidi? Zakaj?
---
Ne vidi. Oko svetlobo le zazna, sliko ustvarijo možgani. Če sporočilo do njih ne pride, slike ni, čeprav je oko zdravo.
:::

**Kolenski refleks** pri zdravniku deluje po isti poti. Pod kolenom je kita, čvrst trak, ki stegensko mišico pripenja na golen. Udarec kito potisne in s tem raztegne mišico. Čutnice v mišici to zaznajo, sporočilo gre v hrbtenjačo in takoj nazaj v isto mišico. Ta se skrči in potegne golen naprej.

:::premisli
Zakaj zdravnik sploh preverja kolenski refleks? Kaj bi pomenilo, če noga ne bi sunila?
---
Z refleksom preveri, ali je cela pot (čutnice, živca, hrbtenjača, mišica) nepoškodovana. Če noga ne sune, je nekje na tej poti motnja, ki jo je treba poiskati.
:::

**Čutila človeka.** Vsako čutilo ima čutnice za svoj dražljaj:

| Čutilo | Dražljaj | Kje so čutnice |
|---|---|---|
| oko | svetloba | v mrežnici: paličice (svetlo, temno), čepki (barve) |
| uho | zvok; lega in gibanje glave | polž (zavita cevka) in ravnotežni organ v notranjem ušesu |
| nos | vonj (snovi v zraku) | zgoraj v nosni votlini |
| jezik | okus (snovi, raztopljene v slini) | brbončice: sladko, slano, kislo, grenko, umami (okus mesne juhe) |
| koža | dotik, pritisk, toplota, mraz, bolečina | po vsej koži, najgosteje v blazinicah prstov |

V simulaciji spodaj (»Čutila in dražljaji«) razvrsti dražljaje k čutilom. Bodi pozoren na ravnotežje: ne spada k očem, ampak k ušesu.

**Živčevje živali.** Trdoživnjak nima možganov, njegove živčne celice tvorijo **živčno mrežo** po vsem telesu, zato se ob dotiku skrči celo telo. Deževnik in žuželke imajo preproste možgane in **trebušnjačo**, verigo živčnih vozlov ob trebuhu. Vretenčarji imajo možgane v lobanji in hrbtenjačo v hrbtenici, tako da ju okostje varuje.

Živali imajo tudi čutila, ki jih mi nimamo. Netopir oddaja ultrazvok in posluša odmev. Riba ima ob boku **pobočnico**, s katero čuti tok in tresljaje vode. Nekatere kače zaznajo toploto plena v temi. Pes ima v nosu veliko več vohalnih čutnic kot človek.

**Šele zdaj številke: kako hiter je odziv?** Sošolec drži ravnilo navpično, ti imaš prste odprte pri ničli. Ko ga spusti, ga ujameš. Dlje kot ravnilo pade, daljši je tvoj **reakcijski čas** (čas od dražljaja do odziva). Razdaljo prevedeš v čas s tabelo ali grafom:

| Razdalja padca (cm) | Reakcijski čas (s) |
|---|---|
| 5 | 0,10 |
| 10 | 0,14 |
| 15 | 0,17 |
| 20 | 0,20 |
| 25 | 0,23 |
| 30 | 0,25 |

:::risba graf
opis: Graf reakcijskega časa v odvisnosti od razdalje padca ravnila. Krivulja gre od 0 skozi približno 0,10 s pri 5 cm, 0,14 s pri 10 cm, 0,20 s pri 20 cm in 0,25 s pri 30 cm. Raste vse počasneje.
x: 0 .. 30 | 5 | razdalja (cm)
y: 0 .. 0,3 | 0,05 | čas (s)
f: sqrt(2*x/981) | modra
podnapis: Ravnilo pada vse hitreje, zato krivulja raste vse počasneje.
:::

Kako hitro potuje sam signal po živcu? Za dotik okoli $60\,\mathrm{m}$ v sekundi, za topo bolečino le okoli $1\,\mathrm{m}$ v sekundi. Čas potovanja dobimo tako, da pot delimo s hitrostjo:

$$t = \frac{s}{v}$$

## Rešeni primeri

### Primer 1: reakcijski čas z ravnilom

Ana v treh poskusih ujame ravnilo pri $14\,\mathrm{cm}$, $16\,\mathrm{cm}$ in $15\,\mathrm{cm}$. Kolikšen je njen povprečni reakcijski čas?

**Podatki:** $d_1 = 14\,\mathrm{cm}$, $d_2 = 16\,\mathrm{cm}$, $d_3 = 15\,\mathrm{cm}$, tabela razdalja–čas iz razlage
**Iščemo:** povprečno razdaljo $\bar d$ in reakcijski čas $t$

:::formula
$\bar d = \dfrac{d_1 + d_2 + d_3}{3}$, nato $t$ odčitaš v tabeli
:::

**Rešitev:**

1. Povprečje izračunamo, ker se posamezni poskusi malo razlikujejo: $\bar d = \dfrac{14\,\mathrm{cm} + 16\,\mathrm{cm} + 15\,\mathrm{cm}}{3} = 15\,\mathrm{cm}$.
2. V tabeli pri $15\,\mathrm{cm}$ preberemo $0{,}17\,\mathrm{s}$.
3. Odgovor: Anin povprečni reakcijski čas je približno $0{,}17\,\mathrm{s}$.

### Primer 2: dotik potuje do možganov

Z bosim prstom na nogi stopiš na kamenček. Sporočilo o dotiku potuje po živcu $1{,}5\,\mathrm{m}$ daleč do možganov s hitrostjo $60\,\mathrm{m/s}$. Koliko časa potrebuje?

**Podatki:** pot $s = 1{,}5\,\mathrm{m}$, hitrost $v = 60\,\mathrm{m/s}$
**Iščemo:** čas $t$

:::formula
$t = \dfrac{s}{v}$
:::

**Rešitev:**

1. V $1\,\mathrm{s}$ signal prepotuje $60\,\mathrm{m}$, mi pa potrebujemo le del te poti, zato delimo: $t = \dfrac{1{,}5\,\mathrm{m}}{60\,\mathrm{m/s}} = 0{,}025\,\mathrm{s}$.
2. V milisekundah ($1\,\mathrm{s} = 1000\,\mathrm{ms}$): $0{,}025\,\mathrm{s} = 25\,\mathrm{ms}$.
3. Odgovor: sporočilo pride do možganov v $0{,}025\,\mathrm{s}$, to je $25\,\mathrm{ms}$.

### Primer 3: zaspan kolesar

Na škatlici zdravila proti alergiji piše: »Lahko povzroči zaspanost.« Kolesar pelje s hitrostjo $6\,\mathrm{m/s}$. Spočit ima reakcijski čas $0{,}5\,\mathrm{s}$, zaspan $0{,}9\,\mathrm{s}$. Koliko metrov prevozi, preden sploh začne zavirati, v vsakem primeru? Za koliko je pot daljša, ko je zaspan?

**Podatki:** $v = 6\,\mathrm{m/s}$, $t_1 = 0{,}5\,\mathrm{s}$ (spočit), $t_2 = 0{,}9\,\mathrm{s}$ (zaspan)
**Iščemo:** poti $s_1$ in $s_2$ ter razliko $\Delta s$

:::formula
Med reakcijskim časom kolo pelje enako hitro: $s = v \cdot t$, $\quad \Delta s = s_2 - s_1$
:::

**Rešitev:**

1. Spočit: $s_1 = 6\,\mathrm{m/s} \cdot 0{,}5\,\mathrm{s} = 3\,\mathrm{m}$.
2. Zaspan: $s_2 = 6\,\mathrm{m/s} \cdot 0{,}9\,\mathrm{s} = 5{,}4\,\mathrm{m}$.
3. Razlika: $\Delta s = 5{,}4\,\mathrm{m} - 3\,\mathrm{m} = 2{,}4\,\mathrm{m}$.
4. Odgovor: spočit prevozi $3\,\mathrm{m}$, zaspan $5{,}4\,\mathrm{m}$, preden začne zavirati. Zaspanost doda $2{,}4\,\mathrm{m}$, kar je več kot dolžina kolesa. Zato zdravniki pri takih zdravilih odsvetujejo vožnjo.

### Primer 4: zdaj ti

Z nogo se udariš ob rob postelje. Najprej začutiš udarec, topa bolečina pride za njim. Sporočilo o topi bolečini potuje po isti poti $1{,}5\,\mathrm{m}$, a s hitrostjo le $1\,\mathrm{m/s}$. Koliko časa potrebuje? Za koliko zamudi za dotikom iz primera 2?

**Podatki:** $s = 1{,}5\,\mathrm{m}$, $v_\text{b} = 1\,\mathrm{m/s}$, čas dotika $t = 0{,}025\,\mathrm{s}$
**Iščemo:** čas bolečine $t_\text{b}$ in zamudo

:::formula
$t_\text{b} = \dfrac{s}{v_\text{b}}$, zamuda je $t_\text{b} - t$
:::

**Rešitev:**

1. Pot je enaka kot pri dotiku, hitrost $60$-krat manjša, zato bo čas $60$-krat daljši.
2. Izračunaj sam, nato preveri:

:::premisli
Koliko je $t_\text{b}$ in kolikšna je zamuda?
---
$t_\text{b} = \dfrac{1{,}5\,\mathrm{m}}{1\,\mathrm{m/s}} = 1{,}5\,\mathrm{s}$. Zamuda: $1{,}5\,\mathrm{s} - 0{,}025\,\mathrm{s} = 1{,}475\,\mathrm{s} \approx 1{,}5\,\mathrm{s}$. Zato najprej začutiš udarec, bolečina pa »prileze« za njim.
:::

## Pogoste napake

- **»Vidimo z očmi.«** Oko res sprejme svetlobo, zato se zdi, da vidi. A oko le zazna svetlobo, sliko sestavijo možgani. Brez vidnega živca ali vidnega dela možganov človek ne vidi.
- **»Pri refleksu najprej pomislimo.«** Ker se umaknemo »pravilno«, se zdi, da smo se odločili. Pri refleksu ukaz pošlje hrbtenjača, preden možgani sploh zaznajo bolečino. Zato je refleks hitrejši od hotenega giba.
- **»Na konici jezika je sladko, zadaj grenko.«** Ta »zemljevid jezika« je star mit. Brbončice za vse osnovne okuse so po vsem jeziku.
- **»Okus jagode zazna jezik.«** Jezik loči le sladko, slano, kislo, grenko in umami. Kar imenujemo okus jagode, večinoma zazna nos. Zato ob prehladu hrana nima okusa.
- **»Sporočilo po živcu pride v hipu.«** Potuje hitro, a ne neskončno hitro: od $1$ do okoli $100\,\mathrm{m/s}$. Ves odziv traja okoli $0{,}2\,\mathrm{s}$ ali več, kar pri vožnji pomeni nekaj metrov.

## Povzetek

- Dražljaj je sprememba, ki jo telo zazna; odziv je to, kar telo naredi (gib mišice, izločanje žleze).
- Pot: dražljaj → čutnice v čutilu → čutilni živec → osrednje živčevje (možgani, hrbtenjača) → gibalni živec → mišica ali žleza → odziv.
- Živec je snop podaljškov živčnih celic (nevronov); sporočilo potuje kot električni signal, od okoli $1$ do $100\,\mathrm{m/s}$.
- Refleks je hiter, samodejen odziv prek hrbtenjače (umik od vročega, kolenski refleks); hoteni odzivi gredo prek možganov.
- Čutila: oko (svetloba; paličice, čepki), uho (zvok, ravnotežje), nos (vonj), jezik (5 osnovnih okusov), koža (dotik, pritisk, toplota, mraz, bolečina). Vidimo, slišimo in okušamo z možgani.
- Živali: živčna mreža (trdoživnjak), trebušnjača (deževnik, žuželke), možgani in hrbtenjača (vretenčarji); posebna čutila: pobočnica, ultrazvok, zaznava toplote.
- Reakcijski čas z ravnilom (okoli $0{,}2\,\mathrm{s}$); čas potovanja signala $t = \dfrac{s}{v}$; pot med reakcijo $s = v \cdot t$.

## Drugače: Z analogijo

Telo si predstavljaj kot hišo s protipožarnim sistemom.

- **Dimni senzor** v kuhinji je **čutnica**: zazna samo dim, nič drugega. Kot čutnice v očesu, ki zaznajo samo svetlobo.
- **Žica** od senzorja do centrale v kleti je **čutilni živec**.
- **Centrala** sama, brez vprašanja, vklopi škropilnik. To je **hrbtenjača** pri refleksu: hitro, a vedno enako.
- Hkrati centrala pošlje sporočilo na telefon lastnika. **Lastnik** so **možgani**: dobi novico malo pozneje, premisli in se odloči, ali bo poklical gasilce.
- **Škropilnik** je **mišica**, ki izvede odziv.

Če žico pregrizne miš, senzor lahko piska, centrala pa ne ve ničesar. Tako je pri poškodovanem živcu: čutilo je zdravo, odziva pa ni.

## Drugače: Iz vsakdanjega življenja

- **Zjutraj:** zvonjenje budilke (dražljaj) zaznajo čutnice v polžu, možgani se odločijo, roka jo utiša.
- **Pri zajtrku:** vonj toasta zaznaš z nosom, še preden ga ugrizneš. Ko te opeče vroč čaj, odmakneš skodelico z refleksom.
- **Na soncu:** zenica se sama zoži, veke se priprejo. Tudi to je refleks, ki varuje mrežnico.
- **Pri zdravniku:** kladivce pod kolenom, lučka v oko, test sluha s slušalkami. Vse to preverja, ali dražljaj pride do živčevja in odziv nazaj.
- **Skrb za čutila:** zelo glasna glasba v slušalkah poškoduje čutnice v polžu, ki se ne obnovijo. Nikoli ne glej naravnost v sonce. Čelada pri kolesarjenju varuje možgane.

## Preveri se

? Na pregledu ti zdravnica posveti z lučko v oko in zenica se zoži. Kaj je v tem primeru **dražljaj**?
- zoženje zenice
~ Zoženje zenice je odziv, to je tisto, kar telo naredi kot odgovor.
+ svetloba lučke
- oko
~ Oko je čutilo, ki dražljaj sprejme; dražljaj pa je sprememba v okolici.
- vidni živec
~ Vidni živec le prenese sporočilo od očesa do možganov.
> Dražljaj je sprememba, ki jo telo zazna: svetloba. Oko jo zazna, zenica se odzove.

? Ravnilo ujameš pri $20\,\mathrm{cm}$. Z grafa odčitaj svoj reakcijski čas v sekundah.
:::risba graf
opis: Graf reakcijskega časa v odvisnosti od razdalje padca ravnila. Os x: razdalja od 0 do 30 cm. Os y: čas od 0 do 0,3 s. Krivulja raste vse počasneje.
x: 0 .. 30 | 5 | razdalja (cm)
y: 0 .. 0,3 | 0,05 | čas (s)
f: sqrt(2*x/981) | modra
:::
= 0,20 s | 0,01
~ 20 | To je razdalja z osi x. Čas preberi na navpični osi.
~ 0,14 | To je čas pri $10\,\mathrm{cm}$. Pojdi pri $20\,\mathrm{cm}$ navpično do krivulje.
~ 0,25 | To je čas pri $30\,\mathrm{cm}$, ne pri $20\,\mathrm{cm}$.
> Pri $20\,\mathrm{cm}$ krivulja doseže $0{,}20\,\mathrm{s}$.

? Dotakneš se vroče plošče štedilnika. Razvrsti dogodke po vrsti.
1. Čutnice v koži zaznajo vročino.
2. Čutilni živec ponese sporočilo v hrbtenjačo.
3. Hrbtenjača po gibalnem živcu pošlje ukaz mišici.
4. Mišica se skrči in roka se umakne.
5. Možgani zaznajo bolečino.
> Pri refleksu ukaz pošlje že hrbtenjača; bolečino začutiš šele, ko je roka že varna.

? Ob hudem prehladu imaš zamašen nos. Kaj se zgodi z okusom jabolka?
- Nič, okus zazna jezik.
~ Jezik zazna le sladko, kislo, slano, grenko in umami. Za okus »jabolko« potrebuješ nos.
+ Čutiš sladko in kislo, »jabolko« pa skoraj ne.
- Ne čutiš ničesar, niti sladkega.
~ Brbončice na jeziku delujejo naprej, zato sladko in kislo še zaznaš.
> Večino okusa hrane prispeva vonj, ki ga ob zamašenem nosu ne zaznaš.

? Signal o dotiku potuje po živcu od prsta na roki do hrbtenjače, $0{,}9\,\mathrm{m}$ daleč, s hitrostjo $60\,\mathrm{m/s}$. Koliko **milisekund** potrebuje?
= 15 ms | 0,5
~ 0,015 | To je čas v sekundah. V milisekundah je $1000$-krat večje število.
~ 54 | Pot in hitrost si pomnožil. Čas dobiš z deljenjem poti s hitrostjo.
~ 66,7 | Delil si v obratni smeri. Pot deli s hitrostjo: $\dfrac{s}{v}$.
> $t = \dfrac{0{,}9\,\mathrm{m}}{60\,\mathrm{m/s}} = 0{,}015\,\mathrm{s} = 15\,\mathrm{ms}$.

<<RACUN
vrednost: (14+16+15)/3 | 15
vrednost: sqrt(2*0.15/9.81) | 0.17
vrednost: sqrt(2*0.20/9.81) | 0.20
vrednost: 1.5/60 | 0.025
vrednost: 6*0.5 | 3
vrednost: 6*0.9 | 5.4
vrednost: 5.4-3 | 2.4
vrednost: 1.5/1 | 1.5
vrednost: 1.5-0.025 | 1.475
vrednost: 0.9/60*1000 | 15
>>

:::simboli
t | čas (potovanja signala ali reakcijski čas) | t = \dfrac{s}{v} | s |
s | pot (signala ali kolesa) | s = v \cdot t | m |
v | hitrost (signala ali kolesa) | | m/s | dotik okoli $60\,\mathrm{m/s}$
\bar d | povprečna razdalja padca ravnila | \bar d = \dfrac{d_1 + d_2 + d_3}{3} | cm |
d_1, d_2, d_3 | razdalja padca v posameznem poskusu | | cm |
t_1 | reakcijski čas spočitega kolesarja | | s |
t_2 | reakcijski čas zaspanega kolesarja | | s |
s_1, s_2 | pot med reakcijskim časom | s = v \cdot t | m |
\Delta s | razlika poti | \Delta s = s_2 - s_1 | m |
t_\text{b} | čas potovanja signala tope bolečine | t_\text{b} = \dfrac{s}{v_\text{b}} | s |
v_\text{b} | hitrost signala tope bolečine | | m/s | okoli $1\,\mathrm{m/s}$
:::
