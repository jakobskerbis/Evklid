---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na telefonu imaš seznam $1000$ skladb, od tega $300$ rockovskih. Vklopiš naključno predvajanje in ga poslušaš ves dan. Vrstni red se nenehno spreminja, delež rocka na seznamu pa ostane $30\,\%$. Na kratki vožnji z avtobusom slišiš le $10$ skladb. Med njimi so lahko tudi samo ena ali kar šest rockovskih.

Zdaj vzemi kup kart in ga premešaj. Kart s srci je po mešanju še vedno $13$ od $52$. Ko pa razdeliš pet kart, ima igralec lahko nič src ali štiri.

Oba primera skrivata isto misel. Mešanje spremeni kombinacije, deležev v celotnem kupu pa ne. Majhen vzorec pa lahko od celote močno odstopa. Natanko to se dogaja z aleli v populaciji: mejoza in oploditev jih premešata v nove genotipe, njihov delež pa ostane, dokler ga kaj ne spremeni. S tem znanjem zdravnik oceni, koliko ljudi je prenašalcev bolezni, naravovarstvenik pa, ali je majhna populacija ogrožena.

## Razlaga

**Vreča alelov.** Populacija so osebki iste vrste na istem območju, ki se med seboj razmnožujejo. Opazujmo en gen z aleloma $A$ (dominanten) in $a$ (recesiven). Vsak osebek ima dva alela. Če bi vse alele vseh osebkov stresli v eno vrečo, bi dobili **genski sklad** populacije.

Vzemimo deset osebkov:

| Genotip | Osebkov | Alelov $A$ | Alelov $a$ |
|---|---|---|---|
| $AA$ | $5$ | $10$ | $0$ |
| $Aa$ | $4$ | $4$ | $4$ |
| $aa$ | $1$ | $0$ | $2$ |
| skupaj | $10$ | $14$ | $6$ |

V vreči je $20$ alelov, od tega $14$ alelov $A$. Delež alela $A$ je $\frac{14}{20} = 0{,}7$, delež alela $a$ pa $\frac{6}{20} = 0{,}3$. Tem deležem rečemo **pogostost alelov**. Pogostost genotipov pa je delež osebkov z določenim genotipom; za $AA$ je tu $\frac{5}{10} = 0{,}5$.

**Kvadrat naključnega parjenja.** Naključno parjenje je, kot bi iz vreče jajčec in iz vreče semenčic na slepo izvlekli po en alel. Nariši kvadrat s stranico $1$. Zgornjo stranico razdeli v razmerju $0{,}7 : 0{,}3$ za jajčeca, levo enako za semenčice. Ploščina vsakega polja je verjetnost tega genotipa pri potomcih.

:::risba skica
opis: Kvadrat s stranico 1. Zgoraj sta jajčeci A z deležem 0,7 in a z deležem 0,3, levo semenčici A in a z enakima deležema. Polja: AA 0,49 zgoraj levo, Aa 0,21 zgoraj desno, Aa 0,21 spodaj levo, aa 0,09 spodaj desno.
območje: -2; -1 .. 11; 12
enota: 22
pravokotnik: 0; 3 .. 7; 10 | modra | ozadje
pravokotnik: 7; 3 .. 10; 10 | zelena | ozadje
pravokotnik: 0; 0 .. 7; 3 | zelena | ozadje
pravokotnik: 7; 0 .. 10; 3 | oranžna | ozadje
napis: 3,5; 11 | A (0,7) | sredina
napis: 8,5; 11 | a (0,3) | sredina
napis: -1; 6,5 | A | sredina
napis: -1; 1,5 | a | sredina
napis: 3,5; 6,5 | AA 0,49 | sredina | debelo
napis: 8,5; 6,5 | Aa 0,21 | sredina
napis: 3,5; 1,5 | Aa 0,21 | sredina
napis: 8,5; 1,5 | aa 0,09 | sredina
podnapis: Zgoraj jajčeca, levo semenčice; ploščina polja je delež genotipa.
:::

Na sliki preberemo: $49\,\%$ potomcev je $AA$, $Aa$ je dvakrat po $21\,\%$, skupaj $42\,\%$, $aa$ pa $9\,\%$. V naši deseterici je bilo $AA$ $50\,\%$, $Aa$ $40\,\%$ in $aa$ $10\,\%$, torej skoraj tako.

:::premisli
Populacija ima samo osebke $AA$ in $aa$, vsakih polovico, heterozigotov ni. Kakšni bodo genotipi po eni generaciji naključnega parjenja? Napovej s kvadratom.
---
Alelov $A$ je polovica, zato kvadrat razdelimo na pol: $25\,\%$ $AA$, $50\,\%$ $Aa$, $25\,\%$ $aa$. Genotipi so se v eni generaciji močno spremenili, pogostost alelov pa je ostala $0{,}5$.
:::

**Pravilo.** Pri potomcih iz kvadrata spet preštejmo alele: v $49\,\%$ $AA$ in polovici od $42\,\%$ $Aa$ je $0{,}49 + 0{,}21 = 0{,}7$ alelov $A$. Pogostost se ni spremenila in se ne bo spremenila tudi v naslednjih generacijah. Zdaj sliko zapišemo s simboli. Pogostost alela $A$ označimo s $p$, alela $a$ s $q$:

$$p + q = 1$$

Pogostost genotipov $AA$, $Aa$ in $aa$ je $p^2$, $2pq$ in $q^2$, njihova vsota pa je $p^2 + 2pq + q^2 = (p + q)^2 = 1$, ker je $p + q = 1$.

To je **Hardy-Weinbergovo ravnovesje**: v idealni populaciji se pogostost alelov iz roda v rod ne spreminja, pogostost genotipov pa je po eni generaciji naključnega parjenja $p^2$, $2pq$, $q^2$. Ravnovesje velja pri vsakem $p$, ne le pri $0{,}5$.

**Pet pogojev in pet dejavnikov.** Idealna populacija je zelo velika, parjenje je naključno, ni mutacij, ni selitev in ni naravnega izbora. Vsak kršen pogoj je **evolucijski dejavnik**: spremeni genski sklad. Evolucija je namreč sprememba pogostosti alelov v populaciji skozi generacije.

| Dejavnik | Kaj naredi | Primer |
|---|---|---|
| mutacije | prinesejo nove alele, zelo počasi | nov alel za barvo |
| naravni izbor | poveča delež alelov, ki izboljšajo preživetje in razmnoževanje | odpornost bakterij na antibiotik |
| genski zdrs | naključno spreminja $p$ v majhni populaciji | otok z $20$ osebki |
| pretok genov | selitve prinesejo ali odnesejo alele | priseljeni volkovi |
| nenaključno parjenje | več homozigotov; izbirno parjenje spreminja tudi pogostost alelov | parjenje v sorodstvu, samice izbirajo pevce |

Genski zdrs je kot avtobusna vožnja z desetimi skladbami: v majhnem vzorcu je odstopanje veliko. Posebna primera sta **učinek ustanovitelja** (populacijo osnuje nekaj osebkov) in **ozko grlo** (populacija se zaradi nesreče skrči).

V simulaciji spodaj »Hardy-Weinbergovo ravnovesje« izberi $N = 20$ in nekajkrat klikni »10 generacij«. Nato izberi $N = 1000$. Opazi, da $p$ v majhni populaciji divje niha in se alel lahko izgubi, v veliki pa ostane skoraj stalen. Vklopi še izbor proti $aa$ in opazuj, kako počasi pada $q$, ko je alel redek.

:::premisli
Zakaj škodljivi recesivni alel ne izgine, četudi osebki $aa$ nimajo potomcev? Pomagaj si s $q = 0{,}1$.
---
Pri $q = 0{,}1$ je $aa$ le $q^2 = 0{,}01$, heterozigotov pa $2pq = 0{,}18$. Na $100$ osebkov je torej $18$ heterozigotov z $18$ aleli $a$ in en osebek $aa$ z $2$ aleloma $a$. Kar $\frac{18}{20} = 0{,}9$ alelov $a$ je skritih v heterozigotih, na katere izbor ne deluje.
:::

**Akomodacija in adaptacija.** Planinec po treh tednih na $4000\,\mathrm{m}$ izdela več eritrocitov. To je **akomodacija**: prilagajanje posameznika med življenjem, brez spremembe genov. Ni dedna in izgine, ko se vrne v dolino. Tibetanci pa že rojeni nosijo alel gena EPAS1, ki jim pomaga živeti na višini brez pretiranega zgoščevanja krvi. To je **adaptacija**: dedna lastnost populacije, ki se je razširila z naravnim izborom skozi mnogo generacij. Adaptacija spremeni pogostost alelov, akomodacija ne.

## Rešeni primeri

### Primer 1: pogostost alelov pri kanarčkih

V gojilnici kanarčkov pevcev je $500$ ptic. Gen za barvo perja ima alela $A$ in $a$. Genotipov $AA$ je $180$, $Aa$ $240$ in $aa$ $80$. Kolikšni sta $p$ in $q$?

**Podatki:** $N = 500$, $N_{AA} = 180$, $N_{Aa} = 240$, $N_{aa} = 80$
**Iščemo:** pogostost alelov $p$ in $q$

:::formula
$p = \dfrac{2N_{AA} + N_{Aa}}{2N}$, $q = 1 - p$
:::

**Rešitev:**

1. Vseh alelov je $2N = 2 \cdot 500 = 1000$, ker ima vsaka ptica dva.
2. Alelov $A$: homozigot ima dva, heterozigot enega, torej $2 \cdot 180 + 240 = 600$.
3. $p = \dfrac{600}{1000} = 0{,}6$.
4. $q = 1 - 0{,}6 = 0{,}4$.
5. Odgovor: $p = 0{,}6$ in $q = 0{,}4$.

### Primer 2: koliko je prenašalcev gluhosti

Predpostavimo, da se v populaciji v ravnovesju en otrok od $2500$ rodi gluh zaradi recesivnega alela $a$ gena za beljakovino v notranjem ušesu. Kolikšen delež ljudi je prenašalcev ($Aa$)? Koliko prenašalcev je med $1000$ obiskovalci koncerta?

**Podatki:** $q^2 = \frac{1}{2500}$, populacija v ravnovesju, obiskovalcev $1000$
**Iščemo:** delež prenašalcev $2pq$ in njihovo število

:::formula
$q = \sqrt{q^2}$, $p = 1 - q$, delež heterozigotov $2pq$
:::

**Rešitev:**

1. Gluhi so $aa$, njihov delež je $q^2$, zato $q = \sqrt{\dfrac{1}{2500}} = 0{,}02$.
2. $p = 1 - 0{,}02 = 0{,}98$.
3. $2pq = 2 \cdot 0{,}98 \cdot 0{,}02 = 0{,}0392$, to je približno $3{,}9\,\%$.
4. Med $1000$ obiskovalci: $0{,}0392 \cdot 1000 = 39{,}2$, okoli $39$ prenašalcev.
5. Odgovor: prenašalec je približno vsak 25. človek. Prenašalci dobro slišijo, a jih je $\dfrac{0{,}0392}{0{,}0004} = 98$-krat več kot gluhih zaradi tega alela (gluhih je $q^2 = \frac{1}{2500} = 0{,}0004$).

### Primer 3: otok z malo heterozigoti

Na otoku živi $100$ ščinkavcev, ki pojejo enako narečje pesmi. Gen za barvo kljuna: $AA$ $70$, $Aa$ $20$, $aa$ $10$. Ali je populacija v Hardy-Weinbergovem ravnovesju? Kateri dejavnik bi lahko pojasnil razliko?

**Podatki:** $N = 100$, $N_{AA} = 70$, $N_{Aa} = 20$, $N_{aa} = 10$
**Iščemo:** pričakovano število genotipov ob ravnovesju in primerjavo z opaženim

:::formula
$p = \dfrac{2N_{AA} + N_{Aa}}{2N}$, pričakovano: $p^2 N$, $2pq N$, $q^2 N$
:::

**Rešitev:**

1. Alelov $A$: $2 \cdot 70 + 20 = 160$ od $200$, torej $p = \dfrac{160}{200} = 0{,}8$ in $q = 0{,}2$.
2. Pričakovano $AA$: $0{,}8^2 \cdot 100 = 64$.
3. Izračunaj še pričakovano $Aa$ in $aa$, primerjaj z opaženim in sklepaj.

:::premisli
Koliko je pričakovano $Aa$ in $aa$ in kaj pove primerjava?
---
$Aa$: $2 \cdot 0{,}8 \cdot 0{,}2 \cdot 100 = 32$, $aa$: $0{,}2^2 \cdot 100 = 4$. Opaženih heterozigotov je le $20$, homozigotov pa več od pričakovanih. Populacija ni v ravnovesju. Tak vzorec da parjenje v sorodstvu, ki je na majhnem otoku pogosto; zaradi majhnosti deluje še genski zdrs.
:::

## Pogoste napake

- **Dominanten alel naj bi bil pogostejši.** Dominantnost pove le, kateri alel se izrazi v heterozigotu. Pogostost določajo evolucijski dejavniki. Alel za polidaktilijo (šest prstov) je dominanten, a redek.
- **Delež fenotipa vzameš za $q$.** Delež recesivnih fenotipov je $q^2$, ne $q$. Pri $q^2 = 0{,}09$ je $q = 0{,}3$, ne $0{,}09$.
- **Pozabljen faktor $2$ pri heterozigotih.** Heterozigot nastane na dva načina ($A$ od matere ali od očeta), zato je $2pq$, ne $pq$.
- **Aleli se štejejo kot osebki.** Vsak osebek ima dva alela, zato deliš z $2N$, heterozigot pa prispeva le en alel $A$.
- **Akomodacija se deduje.** Planinčevi otroci ne dobijo več eritrocitov, ker je oče plezal. Pridobljene lastnosti se ne dedujejo; adaptacija nastane le z izborom med dednimi različicami.

## Povzetek

- Genski sklad so vsi aleli populacije; $p$ in $q$ sta pogostosti alelov, $p + q = 1$.
- Pogostost alelov iz števila osebkov: $p = \dfrac{2N_{AA} + N_{Aa}}{2N}$.
- Hardy-Weinbergovo ravnovesje: v idealni populaciji se $p$ in $q$ ne spreminjata; genotipi so $p^2$, $2pq$, $q^2$.
- Pogoji: velika populacija, naključno parjenje, brez mutacij, selitev in izbora.
- Evolucijski dejavniki (kršitve pogojev): mutacije, naravni izbor, genski zdrs (učinek ustanovitelja, ozko grlo), pretok genov, nenaključno parjenje.
- Iz deleža recesivnega fenotipa: $q = \sqrt{q^2}$; prenašalcev $2pq$ je veliko več kot bolnih, zato izbor redek recesivni alel odstranja počasi.
- Akomodacija: nededno prilagajanje posameznika. Adaptacija: dedna prilagoditev populacije z naravnim izborom.

## Drugače: Z analogijo

Predstavljaj si radijsko postajo, ki vsak teden zavrti skladbe, izbrane z žrebom izmed skladb prejšnjega tedna. Seznam skladb je genski sklad, skladba je alel.

- **Velika postaja** zavrti $1000$ skladb na teden. Delež žanrov ostaja skoraj enak: to je ravnovesje.
- **Mala postaja** zavrti $10$ skladb. Po nekaj tednih kakšen žanr po naključju povsem izgine: genski zdrs.
- **Urednik**, ki raje vrti pop, je naravni izbor: delež popa raste iz tedna v teden.
- **Skladbe, ki jih prinese gostujoči DJ**, so pretok genov.
- **Nova predelava** stare skladbe je mutacija: redka, a prinese nekaj novega.
- **Če skladbe vrtiš vedno v paru z isto skladbo**, se spremenijo kombinacije, ne pa nujno delež žanrov: nenaključno parjenje.

Analogija ima mejo: skladba nima dveh kopij, osebek pa ima dva alela.

## Drugače: Iz vsakdanjega življenja

- **Porjavelost** po poletju je akomodacija; zgine pozimi. Temnejša koža populacij v tropih je adaptacija, ki ščiti pred UV-svetlobo.
- **Žulji na prstih kitarista** so akomodacija. Njegov otrok jih ob rojstvu nima.
- **Mleko pri odraslih:** večina odraslih po svetu laktoze slabo prebavlja. V Evropi pa se je razširil alel, ki ohrani encim laktazo. To je adaptacija na rejo živine.
- **Prenašalci:** cistična fibroza se v Evropi pojavi pri približno enem od $2500$ novorojenčkov, prenašalec pa je približno vsak 25. Evropejec. Račun je enak kot v primeru 2.

## Preveri se

? Kitarist ima po pol leta vadbe na blazinicah prstov trdo kožo. Kako imenujemo tak odziv?
- adaptacija
~ Adaptacija je dedna in nastane z izborom v populaciji skozi generacije. Trda koža nastane v življenju enega človeka.
+ akomodacija
- mutacija
~ Mutacija je sprememba DNA. Trda koža nastane brez spremembe genov.
> Prilagajanje posameznika med življenjem brez spremembe genov je akomodacija; otroci je ne podedujejo.

? Razvrsti populacije od tiste, v kateri genski zdrs najmočneje spreminja $p$, do tiste, v kateri najšibkeje: $2000$, $20$ in $200$ osebkov.
+ $20$, $200$, $2000$
- $2000$, $200$, $20$
~ Več osebkov ne pomeni več naključja. V velikem vzorcu se odstopanja izravnajo.
- vse tri enako, ker je naključje povsod enako
~ Naključje je povsod, a njegov vpliv na delež je v majhnem vzorcu veliko večji, kot pri $10$ skladbah na avtobusu.
> Manjša kot je populacija, bolj se vzorec alelov za naslednjo generacijo razlikuje od celote.

? Kaj se zgodi s $q$, če v veliki populaciji s $q = 0{,}1$ osebki $aa$ več generacij nimajo potomcev?
- $q$ pade na $0$ že v naslednji generaciji.
~ Izbor odstrani le alele v $aa$. Večina alelov $a$ je v heterozigotih, ki imajo potomce.
- $q$ se ne spremeni, ker je populacija velika.
~ Velika populacija izključi genski zdrs, ne pa naravnega izbora.
+ $q$ se zmanjšuje, a počasi, ker je večina alelov $a$ v heterozigotih.
> Pri $q = 0{,}1$ je v heterozigotih $90\,\%$ alelov $a$, zato izbor proti $aa$ vsako generacijo odstrani le majhen del.

? V populaciji v ravnovesju ima $9\,\%$ osebkov recesivni fenotip. Kolikšen delež je heterozigotov?
- $0{,}21$
~ To je $pq$; pozabil si faktor $2$, ker heterozigot nastane na dva načina.
- $0{,}09$
~ To je $q^2$, delež recesivnih homozigotov, ne heterozigotov.
+ $0{,}42$
- $0{,}49$
~ To je $p^2$, delež dominantnih homozigotov.
> $q = \sqrt{0{,}09} = 0{,}3$ in $p = 0{,}7$, zato $2pq = 2 \cdot 0{,}7 \cdot 0{,}3 = 0{,}42$.

? V populaciji $100$ osebkov je $AA$ $50$, $Aa$ $30$ in $aa$ $20$. Kolikšna je pogostost alela $A$?
- $0{,}5$
~ To je delež osebkov $AA$, ne alelov. Upoštevaj še alele $A$ v heterozigotih.
- $0{,}8$
~ To je delež osebkov z vsaj enim $A$. Heterozigot ima le en alel $A$ od dveh.
+ $0{,}65$
- $0{,}35$
~ To je $q$, pogostost alela $a$.
> $p = \dfrac{2 \cdot 50 + 30}{200} = \dfrac{130}{200} = 0{,}65$.

<<RACUN
vrednost: 14/20 | 0.7
vrednost: 0.7^2 | 0.49
vrednost: 2*0.7*0.3 | 0.42
vrednost: 0.3^2 | 0.09
vrednost: (2*180+240)/1000 | 0.6
vrednost: sqrt(1/2500) | 0.02
vrednost: 2*0.98*0.02 | 0.0392
vrednost: 0.0392*1000 | 39.2
vrednost: 0.0392/0.0004 | 98
vrednost: (2*70+20)/200 | 0.8
vrednost: 0.8^2*100 | 64
vrednost: 2*0.8*0.2*100 | 32
vrednost: 0.2^2*100 | 4
vrednost: 2*0.9*0.1 | 0.18
vrednost: 18/(18+2) | 0.9
vrednost: sqrt(0.09) | 0.3
vrednost: (2*50+30)/200 | 0.65
>>

:::simboli
p | pogostost alela $A$ | p = 1 - q | – | število med 0 in 1
q | pogostost alela $a$ | q = 1 - p | – | število med 0 in 1
N | število osebkov v populaciji | | –
N_{AA} | število osebkov $AA$ | | –
N_{Aa} | število osebkov $Aa$ | | –
N_{aa} | število osebkov $aa$ | | –
:::
