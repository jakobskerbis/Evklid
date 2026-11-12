---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V drogeriji vzameš v roke dva izdelka. Prvi je razkužilo za roke, na etiketi piše *etanol*. Drugi je pršilo za lase, kjer kot potisni plin piše *dimetil eter* (po IUPAC metoksimetan). Razkužilo je tekoče in ga natočiš na dlan. Plin iz pršila pa šumi iz pločevinke in v trenutku izgine.

Če pogledaš molekulski formuli, se začudiš: obe snovi imata formulo $\mathrm{C_2H_6O}$. Enaki atomi, enako število, enaka molska masa. In vendar ena snov vre pri $78\,^\circ\mathrm{C}$, druga pri $-24\,^\circ\mathrm{C}$.

Na bencinski črpalki izbiraš med $95$- in $100$-oktanskim bencinom in za boljšega plačaš več. Merilo za oktansko število $100$ je razvejen oktan (2,2,4-trimetilpentan). Nerazvejen oktan ima isto formulo $\mathrm{C_8H_{18}}$, a v motorju zgoreva sunkovito in ima oktansko število pod nič.

Obe zgodbi skrivata isto idejo. V organski kemiji **zgradba določa lastnosti**. To je rdeča nit vse snovi za maturo: imena, funkcionalne skupine, izomerija in reakcije.

## Razlaga

**1. Mamljiva napaka: »formula pove vse«.** Pri anorganskih snoveh se navadiš, da formula $\mathrm{NaCl}$ ali $\mathrm{CO_2}$ pomeni eno snov. Ogljik pa tvori **štiri kovalentne vezi** in se veže sam s seboj v verige, razvejitve in obroče. Zato isti nabor atomov lahko sestavimo na več načinov.

Snovi z enako molekulsko formulo in različno zgradbo so **izomeri**. Pri $\mathrm{C_2H_6O}$:

- **etanol** $\mathrm{CH_3CH_2OH}$: kisik je na koncu verige in nosi vodik (skupina $-\mathrm{OH}$);
- **metoksimetan** $\mathrm{CH_3OCH_3}$: kisik je med dvema ogljikoma in vodika nima.

Popravek napake: molekulska formula pove le *kaj* je v molekuli. Za lastnosti potrebuješ **strukturno** (ali racionalno) formulo, ki pove tudi *kako* je povezano.

**2. Ogljikovodiki.** Najpreprostejše organske spojine so iz ogljika in vodika. Če so med ogljiki le enojne vezi, so **alkani** ($\mathrm{C_nH_{2n+2}}$), **nasičeni**, ker ne morejo sprejeti več vodika. Z eno dvojno vezjo so **alkeni** ($\mathrm{C_nH_{2n}}$), s trojno **alkini** ($\mathrm{C_nH_{2n-2}}$). Ti dve skupini sta **nenasičeni**.

Alkani tvorijo **homologno vrsto**: vsak naslednji člen ima eno skupino $\mathrm{CH_2}$ več. Lastnosti se spreminjajo postopno:

| Alkan | Formula | Vrelišče | Kje ga kupiš |
|---|---|---|---|
| metan | $\mathrm{CH_4}$ | $-162\,^\circ\mathrm{C}$ | zemeljski plin |
| propan | $\mathrm{C_3H_8}$ | $-42\,^\circ\mathrm{C}$ | jeklenka za žar |
| butan | $\mathrm{C_4H_{10}}$ | $-1\,^\circ\mathrm{C}$ | vžigalnik, kartuša |
| oktan | $\mathrm{C_8H_{18}}$ | $126\,^\circ\mathrm{C}$ | bencin |

:::premisli
Pentan $\mathrm{C_5H_{12}}$ manjka v tabeli. Napovej: je pri sobni temperaturi plin ali tekočina?
---
Tekočina. Vrelišče raste z dolžino verige, ker so med večjimi molekulami močnejše disperzijske sile. Butan vre pri $-1\,^\circ\mathrm{C}$, oktan pri $126\,^\circ\mathrm{C}$; pentan je vmes, pri $36\,^\circ\mathrm{C}$, torej nad sobno temperaturo.
:::

**3. Druga mamljiva napaka: »težja molekula vedno vre višje«.** Propan ($M = 44\,\mathrm{g/mol}$) je skoraj enako težak kot etanol ($46\,\mathrm{g/mol}$), pa vre $120$ stopinj nižje. Razlika ni v masi, ampak v skupini $-\mathrm{OH}$. Med molekulami alkoholov nastanejo **vodikove vezi**, ki jih je treba pri vrenju pretrgati. Masa šteje le med podobnimi molekulami, na primer znotraj ene homologne vrste.

:::premisli
Tudi metoksimetan ima kisik, pa vre pri $-24\,^\circ\mathrm{C}$. Kaj torej molekula potrebuje za vodikove vezi s sosedi: zadošča kisik ali mora imeti še kaj?
---
Kisik ne zadošča: potreben je vodik, vezan neposredno na kisik, kot v skupini $-\mathrm{OH}$. V metoksimetanu je kisik vezan na dva ogljika in nima vodika, zato med njegovimi molekulami ni vodikovih vezi. Ostanejo le šibkejše privlačne sile, zato je pri sobni temperaturi plin.
:::

**4. Funkcionalne skupine.** Del molekule, ki določa njene značilne reakcije, je **funkcionalna skupina**. Ogljikovodični »rep« je pri vseh podoben, skupina pa naredi razliko:

| Skupina | Vrsta spojin | Izdelek v trgovini |
|---|---|---|
| $-\mathrm{OH}$ | alkoholi | razkužilo (etanol) |
| $\mathrm{C{=}O}$ v verigi | ketoni | odstranjevalec laka (propanon, aceton) |
| $-\mathrm{COOH}$ | karboksilne kisline | kis (etanojska kislina) |
| $-\mathrm{COO}-$ | estri | sadne arome, odstranjevalec laka (etil etanoat) |

Pri poimenovanju poiščeš **najdaljšo verigo** ogljikovih atomov, jo oštevilčiš tako, da ima funkcionalna skupina ali razvejitev čim manjšo številko, in dodaš končnico skupine (-ol, -on, -ojska kislina, -oat).

V simulaciji spodaj (Zbirka simulacij: organska kemija, zavihek Izomerija) sestavi vse izomere $\mathrm{C_4H_{10}}$. Opazi, da sta le dva: nerazvejeni butan in 2-metilpropan. Če verigo samo upogneš, nove snovi ne dobiš.

**5. Tretja mamljiva napaka: »vsi ogljikovodiki reagirajo enako«.** Vrsta reakcije je odvisna od vezi:

- **Adicija**: na dvojno vez nenasičene spojine se veže molekula, dvojna vez se razpre. Alken razbarva oranžno bromovico že v temi. Z adicijo vodika (hidrogenacijo) na dvojne vezi iz tekočega olja nastane trdna margarina.
- **Substitucija**: atom vodika zamenja drug atom. Alkan z bromom reagira šele na svetlobi, počasi.
- **Eliminacija**: iz molekule se odcepi manjša molekula, nastane dvojna vez (alkohol $\rightarrow$ alken $+$ voda).
- **Estrenje**: kislina in alkohol dasta ester in vodo. Reakcija je povratna in vodi v ravnotežje.
- **Gorenje**: popolno gorenje ogljikovodika da $\mathrm{CO_2}$ in $\mathrm{H_2O}$.

## Rešeni primeri

### Primer 1: koliko butana je v kartuši

Kartuša za kampinški kuhalnik vsebuje $290\,\mathrm{g}$ butana in stane $2{,}90\,€$. Napiši formulo butana in izračunaj, koliko molov butana kupiš.

**Podatki:** $m = 290\,\mathrm{g}$, cena $2{,}90\,€$, butan je alkan s $4$ atomi C, $M(\mathrm{C}) = 12\,\mathrm{g/mol}$, $M(\mathrm{H}) = 1\,\mathrm{g/mol}$
**Iščemo:** formulo butana in množino $n$

:::formula
Alkan: $\mathrm{C_nH_{2n+2}}$; $n = \dfrac{m}{M}$
:::

**Rešitev:**

1. S $4$ ogljiki: $2 \cdot 4 + 2 = 10$ vodikov, formula je $\mathrm{C_4H_{10}}$.
2. Molska masa: $M = 4 \cdot 12 + 10 \cdot 1 = 58\,\mathrm{g/mol}$.
3. Množina: $n = \dfrac{290\,\mathrm{g}}{58\,\mathrm{g/mol}} = 5{,}0\,\mathrm{mol}$.
4. Odgovor: butan je $\mathrm{C_4H_{10}}$; v kartuši je $5{,}0\,\mathrm{mol}$ butana, en mol butana te torej stane $0{,}58\,€$.

### Primer 2: rezervoar bencina in ogljikov dioksid

Natočiš $40\,\mathrm{L}$ bencina po $1{,}50\,€$ za liter. Bencin obravnavaj kot čisti oktan z gostoto $0{,}70\,\mathrm{kg/L}$. Koliko kilogramov $\mathrm{CO_2}$ nastane, ko vse zgori?

**Podatki:** $V = 40\,\mathrm{L}$, $\rho = 0{,}70\,\mathrm{kg/L}$, cena $1{,}50\,€/\mathrm{L}$, $M(\mathrm{C_8H_{18}}) = 114\,\mathrm{g/mol}$, $M(\mathrm{CO_2}) = 44\,\mathrm{g/mol}$
**Iščemo:** maso $m(\mathrm{CO_2})$

:::formula
$\mathrm{2\,C_8H_{18} + 25\,O_2 \rightarrow 16\,CO_2 + 18\,H_2O}$, torej $n(\mathrm{CO_2}) = 8 \cdot n(\mathrm{C_8H_{18}})$
:::

**Rešitev:**

1. Masa oktana: $m = \rho \cdot V = 0{,}70\,\mathrm{kg/L} \cdot 40\,\mathrm{L} = 28\,\mathrm{kg} = 28\,000\,\mathrm{g}$.
2. Množina oktana: $n = \dfrac{28\,000\,\mathrm{g}}{114\,\mathrm{g/mol}} \approx 245{,}6\,\mathrm{mol}$.
3. Vsak oktan ima $8$ ogljikov, vsak postane ena molekula $\mathrm{CO_2}$: $n(\mathrm{CO_2}) = 8 \cdot 245{,}6 \approx 1965\,\mathrm{mol}$.
4. Masa: $m(\mathrm{CO_2}) = 1965\,\mathrm{mol} \cdot 44\,\mathrm{g/mol} = 86\,460\,\mathrm{g} \approx 86{,}5\,\mathrm{kg}$.
5. Odgovor: nastane okoli $86\,\mathrm{kg}$ $\mathrm{CO_2}$, več kot trikrat več od mase bencina, ker se vsak ogljik veže z dvema kisikoma iz zraka. Za $60\,€$ goriva je to skoraj $1{,}5\,\mathrm{kg}$ $\mathrm{CO_2}$ na evro.

### Primer 3: katera snov je v steklenički?

V laboratoriju analizirajo brezbarvno snov iz trgovine. Vsebuje $52{,}2\,\%$ ogljika, $13{,}0\,\%$ vodika in $34{,}8\,\%$ kisika (masni deleži), njena molska masa je $46\,\mathrm{g/mol}$. Pri sobni temperaturi je tekoča. Določi molekulsko formulo in snov.

**Podatki:** $w(\mathrm{C}) = 52{,}2\,\%$, $w(\mathrm{H}) = 13{,}0\,\%$, $w(\mathrm{O}) = 34{,}8\,\%$, $M = 46\,\mathrm{g/mol}$, snov je tekoča; $M(\mathrm{C}) = 12\,\mathrm{g/mol}$, $M(\mathrm{H}) = 1\,\mathrm{g/mol}$, $M(\mathrm{O}) = 16\,\mathrm{g/mol}$
**Iščemo:** molekulsko formulo in ime snovi

:::formula
V $100\,\mathrm{g}$ snovi: $n = \dfrac{m}{M}$ za vsak element, nato razmerje deliš z najmanjšo množino.
:::

**Rešitev:**

1. Vzamemo $100\,\mathrm{g}$, da so odstotki kar grami: $n(\mathrm{C}) = \dfrac{52{,}2}{12} = 4{,}35\,\mathrm{mol}$, $n(\mathrm{H}) = \dfrac{13{,}0}{1} = 13{,}0\,\mathrm{mol}$, $n(\mathrm{O}) = \dfrac{34{,}8}{16} = 2{,}175\,\mathrm{mol}$.
2. Delimo z najmanjšo, $2{,}175$: $\mathrm{C}$: $2{,}00$, $\mathrm{H}$: $5{,}98 \approx 6$, $\mathrm{O}$: $1$. Empirična formula je $\mathrm{C_2H_6O}$.
3. Njena molska masa: $2 \cdot 12 + 6 \cdot 1 + 16 = 46\,\mathrm{g/mol}$, kar je enako izmerjeni, zato je molekulska formula $\mathrm{C_2H_6O}$.
4. Formula ustreza etanolu in metoksimetanu. Metoksimetan je pri sobni temperaturi plin, snov pa je tekoča.
5. Odgovor: snov je etanol, $\mathrm{CH_3CH_2OH}$. Formula sama ni zadoščala; odločila je lastnost, ki izhaja iz zgradbe.

### Primer 4: zdaj ti

Aroma v sadnih bombonih je pogosto ester. Iz $6{,}0\,\mathrm{g}$ etanojske kisline in dovolj etanola pripravimo etil etanoat. Kolikšna je največja masa estra, ki lahko nastane?

**Podatki:** $m(\mathrm{CH_3COOH}) = 6{,}0\,\mathrm{g}$, etanol v prebitku, $M(\mathrm{CH_3COOH}) = 60\,\mathrm{g/mol}$, ester $\mathrm{CH_3COOCH_2CH_3}$ ($\mathrm{C_4H_8O_2}$), $M(\mathrm{C}) = 12\,\mathrm{g/mol}$, $M(\mathrm{H}) = 1\,\mathrm{g/mol}$, $M(\mathrm{O}) = 16\,\mathrm{g/mol}$
**Iščemo:** največjo maso estra

:::formula
$\mathrm{CH_3COOH + CH_3CH_2OH} \rightleftharpoons \mathrm{CH_3COOCH_2CH_3 + H_2O}$, $n(\text{ester}) = n(\text{kislina})$, $m = n \cdot M$
:::

**Rešitev:**

1. $n(\mathrm{CH_3COOH}) = \dfrac{6{,}0\,\mathrm{g}}{60\,\mathrm{g/mol}} = 0{,}10\,\mathrm{mol}$.
2. Razmerje v enačbi je $1 : 1$, zato največ $0{,}10\,\mathrm{mol}$ estra.
3. Izračunaj sam molsko maso $\mathrm{C_4H_8O_2}$ in iz nje maso estra.

:::premisli
Koliko gramov estra lahko največ nastane? Zakaj jih v resnici nastane manj?
---
$M = 4 \cdot 12 + 8 \cdot 1 + 2 \cdot 16 = 88\,\mathrm{g/mol}$, $m = 0{,}10\,\mathrm{mol} \cdot 88\,\mathrm{g/mol} = 8{,}8\,\mathrm{g}$. V resnici manj, ker je estrenje povratna reakcija in se ustavi v ravnotežju, preden vsa kislina zreagira.
:::

## Pogoste napake

- **»Enaka molekulska formula, enaka snov.«** Izomeri imajo enako formulo, a različno zgradbo in lastnosti. Vedno nariši strukturo, preden sklepaš o vrelišču ali reakcijah.
- **»Vrelišče je odvisno le od mase molekule.«** Velja le znotraj homologne vrste. Skupina $-\mathrm{OH}$ prinese vodikove vezi in močno dvigne vrelišče.
- **Napačna glavna veriga.** Ime »2-etilpropan« je napačno: najdaljša veriga ima tam štiri ogljike, pravilno ime je 2-metilbutan. Najprej vedno poišči najdaljšo verigo.
- **Adicija in substitucija zamenjani.** Alkeni s halogeni hitro reagirajo z adicijo (bromovica se razbarva takoj), alkani le s substitucijo na svetlobi.
- **Pozabljen koeficient pri gorenju.** Iz enega mola oktana ne nastane en mol $\mathrm{CO_2}$, ampak osem. Število molov $\mathrm{CO_2}$ je število ogljikov krat množina goriva.

## Povzetek

- Ogljik tvori štiri kovalentne vezi in verige; zgradba določa lastnosti.
- Izomeri: enaka molekulska formula, različna zgradba (etanol in metoksimetan, $\mathrm{C_2H_6O}$).
- Alkani $\mathrm{C_nH_{2n+2}}$ (nasičeni), alkeni $\mathrm{C_nH_{2n}}$, alkini $\mathrm{C_nH_{2n-2}}$ (nenasičeni). V homologni vrsti vrelišče raste z dolžino verige.
- Funkcionalne skupine: $-\mathrm{OH}$ alkoholi, $\mathrm{C{=}O}$ ketoni, $-\mathrm{COOH}$ karboksilne kisline, $-\mathrm{COO}-$ estri. Vodikove vezi dvignejo vrelišče.
- Reakcije: adicija (alkeni, bromovica), substitucija (alkani, svetloba), eliminacija, estrenje (ravnotežje), gorenje do $\mathrm{CO_2}$ in $\mathrm{H_2O}$.
- Iz masnih deležev in molske mase določiš molekulsko formulo; pri gorenju $n(\mathrm{CO_2})$ = število C krat $n(\text{gorivo})$.

## Drugače: Kot zgodba

Ana in Bor sta dvojčka z enakim »potnim listom«: oba sta $\mathrm{C_2H_6O}$. Ana (etanol) drži v roki skupino $-\mathrm{OH}$, zato se rada drži za roke s sosedi: med molekulami nastanejo vodikove vezi. Ker se sosedov težko izpusti, ostane doma v steklenici kot tekočina in odpotuje šele pri $78\,^\circ\mathrm{C}$.

Bor (metoksimetan) ima kisik skrit v sredini, brez vodika. Nima se za koga prijeti, zato pri sobni temperaturi pobegne iz pločevinke kot plin. Zato ga proizvajalci uporabljajo za potisni plin, Ano pa za razkužilo.

Ko Ana sreča etanojsko kislino, se poročita: nastane ester z vonjem po sadju, voda pa odide kot priča. Toda poroka ni nujno trajna. Če je vode v loncu veliko, se par spet razide, zato estrenje ne pride do konca.

## Drugače: Korak za korakom s številkami

Postopek za molekulsko formulo na drugi snovi iz kuhinje, ki ima oster kisel vonj: $40{,}0\,\%$ C, $6{,}7\,\%$ H, $53{,}3\,\%$ O, $M = 60\,\mathrm{g/mol}$.

1. Odstotke beri kot grame v $100\,\mathrm{g}$: $40{,}0\,\mathrm{g}$ C, $6{,}7\,\mathrm{g}$ H, $53{,}3\,\mathrm{g}$ O.
2. Pretvori v mole: $\dfrac{40{,}0}{12} \approx 3{,}33$, $\dfrac{6{,}7}{1} = 6{,}7$, $\dfrac{53{,}3}{16} \approx 3{,}33$.
3. Deli z najmanjšo ($3{,}33$): $1 : 2{,}0 : 1$. Empirična formula je $\mathrm{CH_2O}$ z $M = 30\,\mathrm{g/mol}$.
4. Primerjaj z molsko maso: $\dfrac{60}{30} = 2$, zato vse indekse pomnoži z $2$: $\mathrm{C_2H_4O_2}$.
5. Kisel vonj in formula $\mathrm{C_2H_4O_2}$ kažeta na etanojsko kislino $\mathrm{CH_3COOH}$, snov iz kisa.

## Preveri se

? Na etiketi odstranjevalca laka piše »etil etanoat«. V katero skupino spojin spada?
- med alkohole, ker ime vsebuje »etil«
~ »Etil« pove le, iz katerega alkohola je skupina nastala. Končnica -oat označuje ester.
+ med estre
- med karboksilne kisline, ker ime vsebuje »etanoat«
~ Kislina bi se imenovala etanojska kislina. Končnica -oat pomeni, da je vodik skupine $-\mathrm{COOH}$ zamenjala alkilna skupina.
> Etil etanoat nastane iz etanojske kisline in etanola; skupina $-\mathrm{COO}-$ je značilna za estre.

? Razvrsti po naraščajočem vrelišču: propan ($44\,\mathrm{g/mol}$), metoksimetan in etanol (oba $46\,\mathrm{g/mol}$).
- etanol < metoksimetan < propan
~ Razvrstitev je obrnjena. Vodikove vezi etanol dvignejo najvišje, ne najnižje.
- propan < metoksimetan = etanol
~ Enaka formula ne pomeni enakega vrelišča. Le etanol ima skupino $-\mathrm{OH}$ in vodikove vezi.
+ propan < metoksimetan < etanol
> Propan $-42\,^\circ\mathrm{C}$, metoksimetan $-24\,^\circ\mathrm{C}$ (polarna molekula), etanol $78\,^\circ\mathrm{C}$ (vodikove vezi).

? Kaj se zgodi, če oranžno bromovico v temi stresemo s heksenom ($\mathrm{C_6H_{12}}$)?
- Nič, ker ogljikovodiki z bromom ne reagirajo.
~ Nenasičeni ogljikovodiki reagirajo hitro: brom se veže na dvojno vez.
- Razbarva se šele na svetlobi, ker poteče substitucija.
~ Tako se obnaša alkan. Heksen ima dvojno vez, zato reagira takoj z adicijo.
+ Bromovica se takoj razbarva, ker poteče adicija broma na dvojno vez.
> Pri adiciji se dvojna vez razpre in nastane brezbarven dibromoheksan (pri heks-1-enu 1,2-dibromoheksan). To je preskus za nenasičene spojine.

? Koliko molov $\mathrm{CO_2}$ nastane pri popolnem gorenju $2{,}0\,\mathrm{mol}$ propana? ($\mathrm{C_3H_8 + 5\,O_2 \rightarrow 3\,CO_2 + 4\,H_2O}$)
- $2{,}0\,\mathrm{mol}$
~ Iz ene molekule propana nastanejo tri molekule $\mathrm{CO_2}$, ne ena. Upoštevaj koeficient.
- $3{,}0\,\mathrm{mol}$
~ To velja za en mol propana. Tu ga je $2{,}0\,\mathrm{mol}$, zato pomnoži še z $2$.
+ $6{,}0\,\mathrm{mol}$
- $10\,\mathrm{mol}$
~ To je množina porabljenega kisika ($5 \cdot 2{,}0$), ne nastalega $\mathrm{CO_2}$.
> $n(\mathrm{CO_2}) = 3 \cdot n(\mathrm{C_3H_8}) = 3 \cdot 2{,}0\,\mathrm{mol} = 6{,}0\,\mathrm{mol}$.

? Steklenica kisa za $0{,}90\,€$ vsebuje $30\,\mathrm{g}$ etanojske kisline ($M = 60\,\mathrm{g/mol}$). Koliko molov kisline kupiš?
- $2{,}0\,\mathrm{mol}$
~ To je $\dfrac{M}{m}$, obrnjeno deljenje. Pravilno je $n = \dfrac{m}{M}$.
+ $0{,}50\,\mathrm{mol}$
- $1800\,\mathrm{mol}$
~ To je $m \cdot M$. Masa se z molsko maso deli, ne množi.
> $n = \dfrac{m}{M} = \dfrac{30\,\mathrm{g}}{60\,\mathrm{g/mol}} = 0{,}50\,\mathrm{mol}$; cena ne vpliva na račun.

:::simboli
n | množina snovi | n = \dfrac{m}{M} | mol | v CₙH₂ₙ₊₂ pa število atomov ogljika
m | masa snovi | m = n \cdot M | g
M | molska masa | | g/mol
:::
