---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Med malico Žan vrže dve žlički sladkorja v čaj, malo počaka in reče: »Glej, sladkor je izginil. Ni ga več.« Nina pokusi čaj in se namršči: »Kako ga ni, če je čaj sladek?«

Kdo ima prav? Na videz Žan: kristalčkov res ne vidiš več. Okus pa pravi drugače. Ta spor bomo razrešili do konca lekcije.

Odgovor ni pomemben samo za čaj. Z njim razložiš, zakaj vonj pečenega peciva pride do tvoje sobe, zakaj se voda okoli vrečke čaja obarva, čeprav je nihče ne meša, in zakaj odprta čebula v hladilniku »odišavi« maslo.

## Razlaga

**Štirje pojavi iz kuhinje.** Najprej samo opazujmo. Razlago iščemo šele potem.

| Pojav | Kaj opazimo |
|---|---|
| Kuhaš juho v kuhinji. | Čez nekaj minut jo vohaš v dnevni sobi, čeprav nihče ne maha z zrakom. |
| Vrečko čaja potopiš v vodo in je ne premikaš. | Rjava barva se počasi razleze po vsem kozarcu. |
| Zmešaš $50\,\mathrm{mL}$ vode in $50\,\mathrm{mL}$ alkohola. | V menzuri je manj kot $100\,\mathrm{mL}$ tekočine. |
| Sladkor raztopiš v čaju. | Kristalov ne vidiš, čaj pa je sladek povsod in tehta toliko več, kolikor je tehtal sladkor. |

Kaj imajo ti pojavi skupnega? Nekaj potuje, čeprav tega ne vidimo. Pri vodi in alkoholu pa se zdi, kot da bi del tekočine kar izginil, čeprav nič ni izteklo.

:::premisli
Napovej: dve enaki vrečki čaja daš hkrati v kozarec vroče in v kozarec hladne vode. V katerem kozarcu bo voda prej enakomerno rjava? Zakaj misliš tako?
---
V vroči vodi. Delci se pri višji temperaturi gibljejo hitreje, zato se barvilo iz vrečke hitreje razleze med delce vode.
:::

**Pravilo, ki razloži vse štiri pojave.** Znanstveniki so iz takih opazovanj sestavili **delčni model snovi**. Ima tri dele:

1. Vsaka snov je zgrajena iz zelo majhnih **delcev**. So tako majhni, da jih ne vidimo niti z navadnim mikroskopom. V eni sami kapljici vode jih je več kot tisoč milijard milijard.
2. Med delci je **prazen prostor**. V njem ni zraka, ni ničesar.
3. Delci se **ves čas gibljejo**. Čim višja je temperatura, tem hitreje se gibljejo.

Zdaj preberi tabelo še enkrat. Sladkor ni izginil: njegovi delci so se le razpršili med delce vode. Zato ga ne vidiš, okusiš pa ga. Pri vodi in alkoholu so se manjši delci ene snovi umestili v prazen prostor med delci druge. Zato je skupna prostornina manjša, čeprav nobena snov ni izginila.

**Difuzija.** Vonj juhe in barva čaja potujeta sama od sebe. Temu pravimo **difuzija**: samodejno mešanje snovi zaradi gibanja njihovih delcev. Delci se pri tem razširijo iz kraja, kjer jih je veliko, tja, kjer jih je malo. Nihče jih ne potiska. Mešanje z žlico ali prepih širjenje snovi le pospešita.

**Delci v treh stanjih.** Kako hitro poteka difuzija, je odvisno tudi od tega, ali je snov trdna, tekoča ali plinasta. V simulaciji spodaj »Delci v trdnem, tekočem in plinastem stanju« preklapljaj med stanji in opazuj, kako daleč narazen so delci in kako se gibljejo. Opis v besedah:

```
trdno:    ●●●●   delci tesno skupaj, nihajo na mestu
          ●●●●
tekoče:   ●● ●●  delci blizu, drsijo drug mimo drugega
          ● ●●●
plinasto: ●    ●   delci daleč narazen, hitro letijo
            ●      na vse strani
```

Opazi: tudi v trdni snovi delci ne mirujejo. Nihajo okoli svojega mesta, a ga ne zapustijo. Zato je difuzija v trdnih snoveh zelo počasna.

:::premisli
Vonj sveže kave napolni kuhinjo v nekaj minutah. Kapljica barvila v mirnem kozarcu vode pa potrebuje več kot pol ure, da se razširi. Zakaj je difuzija v zraku hitrejša?
---
V plinu so delci daleč narazen in hitro letijo, zato preletijo veliko poti, preden zadenejo drug delec. V tekočini so delci tesno skupaj in nenehno trkajo, zato se vsak premika počasi in cikcakasto.
:::

## Rešeni primeri

### Primer 1: kam je šlo nekaj mililitrov?

Za čistilo zmešamo $50\,\mathrm{mL}$ vode in $50\,\mathrm{mL}$ alkohola. Menzura po mešanju kaže $96\,\mathrm{mL}$. Za koliko je prostornina zmesi manjša od vsote prostornin? Kaj to pove o delcih?

**Podatki:** $V_1 = 50\,\mathrm{mL}$ (voda), $V_2 = 50\,\mathrm{mL}$ (alkohol), $V_\text{zmes} = 96\,\mathrm{mL}$
**Iščemo:** razliko $\Delta V$ in razlago z delci

:::formula
$\Delta V = V_1 + V_2 - V_\text{zmes}$
:::

**Rešitev:**

1. Vsota prostornin: $50 + 50 = 100$, torej $100\,\mathrm{mL}$, če bi se prostornini preprosto sešteli.
2. Razlika: $\Delta V = 50 + 50 - 96 = 4$, torej $4\,\mathrm{mL}$.
3. V nekaj sekundah mešanja ne more izhlapeti $4\,\mathrm{mL}$ tekočine, izginiti pa snov ne more. Torej so se delci ene snovi umestili v prazen prostor med delci druge.
4. Odgovor: zmes ima $4\,\mathrm{mL}$ manjšo prostornino, kar pomeni, da je med delci prazen prostor.

### Primer 2: čaj v hladni in vroči vodi

Nina da vrečko čaja v kozarec hladne vode in enako vrečko v kozarec vroče vode. Nobenega ne meša. Hladna voda je enakomerno obarvana po $24$ minutah, vroča po $8$ minutah. Kolikokrat hitreje je difuzija potekla v vroči vodi? Zakaj?

**Podatki:** $t_\text{hladna} = 24\,\mathrm{min}$, $t_\text{vroča} = 8\,\mathrm{min}$, vode nihče ne meša
**Iščemo:** kolikokrat je difuzija v vroči vodi hitrejša, in razlago

:::formula
$\text{kolikokrat hitreje} = \dfrac{t_\text{hladna}}{t_\text{vroča}}$
:::

**Rešitev:**

1. Primerjamo čase, ker je hitrejša tista difuzija, ki se konča prej: $\dfrac{24}{8} = 3$.
2. Vode nihče ni mešal, torej je barvilo potovalo samo zaradi gibanja delcev. To je difuzija.
3. V vroči vodi se delci gibljejo hitreje, zato se delci barvila hitreje razširijo.
4. Odgovor: v vroči vodi je difuzija potekla $3$-krat hitreje, ker se delci pri višji temperaturi hitreje gibljejo.

### Primer 3: ali je sladkor izginil?

Vrnimo se k Žanu. Skodelica čaja tehta $250\,\mathrm{g}$. Žan doda $8\,\mathrm{g}$ sladkorja in počaka, da se raztopi. Ne meša. Koliko pokaže tehtnica? Ali je sladkor izginil? Bo čaj čez nekaj časa sladek tudi na vrhu, čeprav je sladkor padel na dno?

**Podatki:** $m_\text{čaj} = 250\,\mathrm{g}$, $m_\text{sladkor} = 8\,\mathrm{g}$, čaja ne mešamo
**Iščemo:** maso $m$ po raztapljanju in razlago z delci

:::formula
Delci ne izginejo, zato: $m = m_\text{čaj} + m_\text{sladkor}$
:::

**Rešitev:**

1. Sladkor se raztopi: njegovi delci se ločijo od kristala in se razpršijo med delce vode. Noben delec ne izgine.
2. Zato se mase seštejejo: $m = 250 + 8 = 258$, torej $258\,\mathrm{g}$.
3. Kristalčkov ne vidimo, ker so delci sladkorja premajhni, da bi jih videli.
4. Dokončaj sam: ali bo čaj na vrhu sladek, če ga nihče ne meša? Kdo ima prav, Žan ali Nina?

:::premisli
Bo čaj na vrhu sčasoma sladek? Kdo ima prav?
---
Da. Delci sladkorja se zaradi difuzije sami razširijo od dna proti vrhu, le da brez mešanja to traja dlje. Prav ima Nina: sladkor ni izginil. Tehtnica kaže $258\,\mathrm{g}$, čaj pa je sladek, ker so delci sladkorja še vedno v njem.
:::

## Pogoste napake

- **»Raztopljena snov izgine.«** Ko sladkor ali sol ni več vidna, se zdi, da je ni. Napačno: delci so se le razpršili med delce vode. Preveri s tehtnico: masa raztopine je vsota mas.
- **»Pri segrevanju se delci povečajo.«** Snov se pri segrevanju res raztegne, zato se zdi, da so zrasli delci. Delci ostanejo enako veliki. Gibljejo se hitreje in se zato malo razmaknejo.
- **»Med delci vode je zrak.«** Med delci ni nobene snovi, tudi zraka ne. Tam je prazen prostor. Tudi zrak je iz delcev, med katerimi je prazen prostor.
- **»Difuzija je samo, če mešamo ali piha.«** Mešanje in veter pospešita širjenje, nista pa vzrok zanj. Delci se gibljejo sami, zato se snovi pomešajo tudi v mirnem zraku ali v mirni vodi.
- **»V trdni snovi delci mirujejo.«** Delci v trdni snovi nihajo na svojem mestu. Ne mirujejo nikoli, le ne potujejo naokoli.

## Povzetek

- Vsaka snov je iz zelo majhnih delcev; med njimi je prazen prostor.
- Delci se ves čas gibljejo; pri višji temperaturi hitreje.
- Difuzija je samodejno mešanje snovi zaradi gibanja delcev, iz kraja z več delci tja, kjer jih je manj.
- Difuzija je najhitrejša v plinih, počasnejša v tekočinah in zelo počasna v trdnih snoveh; toplota jo pospeši.
- V trdni snovi delci nihajo na mestu, v tekočini drsijo drug mimo drugega, v plinu letijo daleč narazen.
- Pri raztapljanju snov ne izgine: masa raztopine je vsota mas.

## Drugače: Korak za korakom s številkami

Vzemimo poskus z vodo in alkoholom in ga razstavimo na majhne korake.

1. Napoved brez delcev: $50\,\mathrm{mL} + 50\,\mathrm{mL}$ bi moralo dati $100\,\mathrm{mL}$.
2. Meritev: menzura kaže $96\,\mathrm{mL}$.
3. Razlika: $100 - 96 = 4$, torej manjkajo $4\,\mathrm{mL}$.
4. Masa pa se ne spremeni, torej nobena snov ni ušla.
5. Edina razlaga: snovi sta se »vgnezdili« druga v drugo. To je možno samo, če je med delci prazen prostor.

Model iz kuhinje: v merilni vrč stresi pol litra fižola in nato še skodelico maka. Mak zdrsne v luknje med fižolom, zato gladina naraste manj, kot bi pričakoval. Fižol in mak tu nista pravi delci, sta le slika zanje: pravi delci so neprimerno manjši.

Še ena številka za občutek, kako majhni so delci: ena kapljica vode ima več kot tisoč milijard milijard delcev. Če bi vsak delec povečali na velikost zrna maka, bi bila ta kapljica večja od Blejskega jezera.

## Drugače: Kot zgodba

Bila je nedelja in v pečici se je peklo cimetovo pecivo. Iz vroče skorje se je odtrgal majhen delec cimetovega vonja.

Ker je bilo v pečici vroče, je delec švignil v zrak z veliko hitrostjo. Ni vedel, kam gre. Letel je naravnost, dokler se ni zaletel v delec zraka. Odbil se je v drugo smer, nato spet v tretjo. Vsakič naključno.

Za njim so iz peciva prihajali še milijoni drugih. Ob pečici jih je bilo veliko, v hodniku skoraj nič. Ker so leteli na vse strani, jih je vedno več prišlo tja, kjer jih prej ni bilo. Nihče jih ni pošiljal v hodnik: tja so zašli sami, ker so naključno leteli na vse strani.

Čez nekaj minut je delec priletel v sobo, kjer je brat pisal domačo nalogo. Brat je dvignil glavo in rekel: »Mmm, cimet!«

Tako deluje difuzija. Vsak delec se giblje naključno, a skupaj se razširijo od tam, kjer jih je veliko, tja, kjer jih je malo.

## Preveri se

? Žan je o delcih zapisal štiri trditve. Katera drži?
- Med delci vode je zrak.
~ Med delci ni nobene snovi, tudi zraka ne. Tam je prazen prostor.
+ Delci se ves čas gibljejo, tudi v trdni snovi.
- Ko snov segrejemo, se njeni delci povečajo.
~ Delci ostanejo enako veliki. Pri segrevanju se gibljejo hitreje in se malo razmaknejo, zato se snov raztegne.
- V trdni snovi delci mirujejo, zato ima trdna snov stalno obliko.
~ Delci v trdni snovi nihajo na mestu. Stalno obliko ima, ker delci ne zapustijo svojega mesta, ne zato, ker bi mirovali.
> Delci se gibljejo vedno. V trdni snovi le nihajo na mestu, v tekočini in plinu pa se premikajo naokoli.

? V $300\,\mathrm{g}$ vode raztopimo $15\,\mathrm{g}$ soli. Koliko tehta raztopina?
- $300\,\mathrm{g}$
~ To bi veljalo, če bi sol izginila. Delci soli so še v vodi, le razpršeni so.
+ $315\,\mathrm{g}$
- $285\,\mathrm{g}$
~ Pri raztapljanju se nič ne porabi in nič ne izgine. Mase se seštejejo, ne odštejejo.
> Delci soli se razpršijo med delce vode, a ostanejo v posodi: $300\,\mathrm{g} + 15\,\mathrm{g} = 315\,\mathrm{g}$.

? Nina je zapisala rešitev: »(1) $50\,\mathrm{mL}$ vode in $50\,\mathrm{mL}$ alkohola dasta $96\,\mathrm{mL}$. (2) Prostornina se zmanjša, ker se delci pri mešanju stisnejo in postanejo manjši.« Kje je napaka?
- V koraku 1: zmes mora imeti točno $100\,\mathrm{mL}$, meritev je napačna.
~ Meritev je pravilna. Prostornini se ne seštejeta, ker je med delci prazen prostor.
+ V koraku 2: delci ostanejo enako veliki, le umestijo se v prazen prostor med delci druge snovi.
- Napake ni, rešitev je pravilna.
~ Delci se pri mešanju ne zmanjšajo. Manjša je le skupna prostornina, ker se delci prerazporedijo.
> Velikost delcev se ne spremeni. Delci ene snovi zapolnijo del praznega prostora med delci druge, zato je skupna prostornina manjša.

? Odpreš steklenico kisa in hkrati kaneš kapljico kisa v kozarec mirne vode. Kje se kis prej razširi?
+ Vonj kisa v zraku.
- Kis v vodi, ker so delci vode bližje in si ga hitreje podajo.
~ Tesno skupaj ležeči delci v tekočini so ovira: nenehno trkajo, zato se vsak premika počasi. V plinu letijo daleč brez trkov.
- Nikjer, ker nihče ne meša in ne piha.
~ Mešanje in veter difuzijo le pospešita. Delci se gibljejo sami, zato se kis razširi tudi v mirnem zraku in mirni vodi.
> V plinu so delci daleč narazen in hitro letijo, zato je difuzija v zraku veliko hitrejša kot v vodi.

? V hladilniku stoji odprta polovica čebule. Čez dan ima nepokrito maslo na drugi polici vonj po čebuli. Zakaj?
- Ker hladilnik z ventilatorjem prenese vonj, sicer bi ostal pri čebuli.
~ Kroženje zraka širjenje le pospeši. Tudi brez njega bi delci vonja sami prišli do masla, ker se ves čas gibljejo.
+ Delci vonja iz čebule se gibljejo po zraku in pridejo tudi do masla.
- V mrazu delci mirujejo, zato vonj potuje le, ko odpremo vrata.
~ Delci se gibljejo pri vsaki temperaturi. V mrazu so počasnejši, zato difuzija traja dlje, a ne preneha.
> To je difuzija: delci vonja se razširijo od čebule po vsem hladilniku. Pokrita posoda to prepreči.

:::simboli
\Delta V | zmanjšanje prostornine ob mešanju | \Delta V = V_1 + V_2 - V_\text{zmes} | mL | delci ene snovi zapolnijo prostore med drugimi
V_1 | prostornina vode | | mL
V_2 | prostornina alkohola | | mL
V_\text{zmes} | prostornina zmesi | | mL
t_\text{hladna} | čas difuzije v hladni vodi | | min
t_\text{vroča} | čas difuzije v vroči vodi | | min
m | masa čaja s sladkorjem | m = m_\text{čaj} + m_\text{sladkor} | g | masa se pri raztapljanju ohrani
m_\text{čaj} | masa čaja | | g
m_\text{sladkor} | masa sladkorja | | g
:::
