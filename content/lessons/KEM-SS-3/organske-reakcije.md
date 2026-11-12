---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na gramofonu se vrti vinilna plošča. Glasbeni navdušenci najbolj cenijo debele, »180-gramske« plošče iz PVC, polivinil klorida. Njegove verige nastanejo iz molekul kloroetena (vinil klorida), $\mathrm{CH_2{=}CHCl}$.

Kloroeten se od etena razlikuje le po enem atomu: namesto enega vodika ima klor. Najkrajša pot bi bila, da v etenu en vodik zamenjaš s klorom. Tovarne pa gredo po ovinku. Na vsako molekulo etena najprej vežejo **dva** atoma klora, potem pa enega spet odtrgajo.

Zakaj bi dodal klor, ki ga potem odvzameš? Ker klor pri navadnih pogojih na etenu ne zamenja vodika, ampak se veže na dvojno vez. Katera reakcija poteče, je odvisno od zgradbe molekul in od pogojev. Organske reakcije razvrščamo v nekaj vrst; ko vrsto prepoznaš, znaš napovedati produkt, preden reakcijo izvedeš.

## Razlaga

**1. Najprej en primer do konca: pot do vinila.** V prvem koraku eten reagira s klorom pri sobni temperaturi:

$$\mathrm{CH_2{=}CH_2 + Cl_2 \to CH_2Cl{-}CH_2Cl}$$

Preštej molekule: iz dveh je nastala ena. Dvojna vez med ogljikoma je izginila, na vsak ogljik se je vezal po en atom klora. Noben atom ni ostal odveč. Nastal je 1,2-dikloroetan.

V drugem koraku 1,2-dikloroetan segrejejo na približno $500\,^\circ\mathrm{C}$:

$$\mathrm{CH_2Cl{-}CH_2Cl \to CH_2{=}CHCl + HCl}$$

Zdaj sta iz ene molekule nastali dve. S sosednjih ogljikov sta se odcepila atom klora in atom vodika, skupaj kot majhna molekula $\mathrm{HCl}$. Med ogljikoma je spet nastala dvojna vez.

Za primerjavo vzemi reakcijo, ki jo že poznaš: bromoetan z vodno raztopino $\mathrm{NaOH}$.

$$\mathrm{C_2H_5Br + NaOH \to C_2H_5OH + NaBr}$$

Iz dveh molekul sta nastali dve. Dvojna vez se ni ne pojavila ne izginila. Brom je le zamenjala skupina $\mathrm{{-}OH}$.

| Reakcija | Molekul | Dvojna vez | Vrsta |
|---|---|---|---|
| eten + klor | $2 \to 1$ | izgine | adicija |
| dikloroetan | $1 \to 2$ | nastane | eliminacija |
| bromoetan + $\mathrm{NaOH}$ | $2 \to 2$ | je ni | substitucija |

**2. Posplošitev: tri vrste.** Iz treh primerov dobimo tri pravila.

- **Adicija** (dodajanje): dve molekuli se združita v eno, dvojna ali trojna vez se odpre v enojno (ali dvojno). Je značilna za **nenasičene** spojine, alkene in alkine. Primeri: eten z bromom (rjava bromova voda, raztopina broma v vodi, se pri tem razbarva), vodikom ali vodikovim halogenidom.
- **Eliminacija** (odcepljanje): iz ene molekule se odcepi majhna molekula, na primer $\mathrm{H_2O}$ ali $\mathrm{HX}$, in nastane dvojna vez. Je obratna adiciji. Primera: alkohol s konc. $\mathrm{H_2SO_4}$ da alken, halogenoalkan s $\mathrm{KOH}$ v etanolu tudi.
- **Substitucija** (zamenjava): atom ali skupina v molekuli se zamenja z drugim atomom ali skupino; iz dveh molekul nastaneta dve. Je značilna za **nasičene** spojine: alkane s halogeni ob svetlobi, halogenoalkane z ioni $\mathrm{OH^-}$.

Hiter preizkus: preštej molekule na obeh straneh in poglej, ali dvojna vez nastane, izgine ali ostane, kakor je.

:::premisli
Eten in voda ob katalizatorju in tlaku dasta etanol. Uporabi hiter preizkus: katera vrsta reakcije je to? S katero vrsto reakcije in s čim bi iz etanola spet dobil eten?
---
Adicija: dve molekuli dasta eno, dvojna vez izgine. Obratno, iz etanola eten, je eliminacija vode, ki poteče s konc. $\mathrm{H_2SO_4}$ ob segrevanju.
:::

V simulaciji spodaj »Vrste organskih reakcij« izberi »Adicija vode (hidratacija)«, nato »Eliminacija vode (dehidracija)«. Opazi, da so reaktanti prve reakcije produkti druge in da vsakič izgine ali nastane ista dvojna vez.

**3. Koliko mase ostane v produktu.** Ovinek pa ima ceno. Ko pri adiciji iz dveh molekul nastane ena, je vsak atom reaktantov v produktu. Pri eliminaciji in substituciji pa nastane še stranski produkt, ki ga ne potrebuješ.

To meri **atomska ekonomičnost** $E_{\mathrm{at}}$: delež mase reaktantov, ki konča v želenem produktu.

$$E_{\mathrm{at}} = \frac{m_{\mathrm{p}}}{m_{\mathrm{r}}}$$

Tu je $m_{\mathrm{p}}$ masa želenega produkta, $m_{\mathrm{r}}$ pa skupna masa reaktantov (vzameš lahko kar molske mase iz enačbe). Pri adiciji je $E_{\mathrm{at}} = 100\,\%$. Pri drugem koraku poti do vinila deliš molsko maso kloroetena z molsko maso dikloroetana: $E_{\mathrm{at}} = \dfrac{62{,}49}{98{,}95} = 0{,}632$, torej $63\,\%$; ostalo odnese $\mathrm{HCl}$.

Atomska ekonomičnost ni izkoristek. Izkoristek pove, koliko produkta res dobiš glede na teoretično. Atomska ekonomičnost pove, koliko bi dobil v najboljšem primeru, ker del atomov po enačbi vedno odide v stranski produkt.

**4. Pogoji odločijo.** Isti halogenoalkan lahko z bazo da različna produkta. Bromoetan z $\mathrm{NaOH}$ v vodi da etanol (substitucija). Bromoetan s $\mathrm{KOH}$ v etanolu ob segrevanju pa da eten (eliminacija):

$$\mathrm{C_2H_5Br + KOH \to CH_2{=}CH_2 + KBr + H_2O}$$

Zato pri reakciji vedno zapiši tudi pogoje: topilo, temperaturo, svetlobo ali katalizator.

:::premisli
Napovej produkt: 2-bromopropan $\mathrm{CH_3CHBrCH_3}$ segrevaš s $\mathrm{KOH}$ v etanolu. Katera vrsta reakcije poteče?
---
Eliminacija: odcepi se $\mathrm{HBr}$ (brom s srednjega ogljika, vodik s sosednjega) in nastane propen $\mathrm{CH_2{=}CHCH_3}$. Z vodno raztopino $\mathrm{NaOH}$ bi namesto tega nastal propan-2-ol.
:::

## Rešeni primeri

### Primer 1: razvrsti tri reakcije

Določi vrsto vsake reakcije:
(a) $\mathrm{CH_4 + Cl_2 \to CH_3Cl + HCl}$ (svetloba);
(b) $\mathrm{CH_3CH{=}CH_2 + H_2 \to CH_3CH_2CH_3}$ (nikljev katalizator);
(c) $\mathrm{CH_3CH(OH)CH_3 \to CH_3CH{=}CH_2 + H_2O}$ (konc. $\mathrm{H_2SO_4}$, segrevanje).

**Podatki:** enačbe (a), (b) in (c) s pogoji
**Iščemo:** vrsto reakcije za vsako enačbo

:::formula
adicija: $2 \to 1$, dvojna vez izgine; eliminacija: $1 \to 2$, dvojna vez nastane; substitucija: $2 \to 2$, zamenjava atoma ali skupine
:::

**Rešitev:**

1. (a) Dve molekuli dasta dve, klor zamenja vodik, dvojne vezi ni: **substitucija**.
2. (b) Dve molekuli dasta eno, dvojna vez propena izgine: **adicija** (hidrogeniranje).
3. (c) Iz ene molekule propan-2-ola nastaneta dve, odcepi se voda in nastane dvojna vez: **eliminacija** (dehidracija).
4. Odgovor: (a) substitucija, (b) adicija, (c) eliminacija.

### Primer 2: snovi za eno vinilno ploščo

Plošča ima maso $180\,\mathrm{g}$. Privzemi, da je iz čistega PVC in da se masa kloroetena pri nastanku verig ohrani. Koliko 1,2-dikloroetana mora tovarna razgraditi in koliko vodikovega klorida pri tem nastane?

**Podatki:** $m(\text{kloroeten}) = 180\,\mathrm{g}$, $M(\mathrm{C_2H_3Cl}) = 62{,}49\,\mathrm{g/mol}$, $M(\mathrm{C_2H_4Cl_2}) = 98{,}95\,\mathrm{g/mol}$, $M(\mathrm{HCl}) = 36{,}46\,\mathrm{g/mol}$
**Iščemo:** maso 1,2-dikloroetana in maso $\mathrm{HCl}$

:::formula
$\mathrm{CH_2Cl{-}CH_2Cl \to CH_2{=}CHCl + HCl}$, $\quad n = \dfrac{m}{M}$, $\quad m = n \cdot M$
:::

**Rešitev:**

1. Množina kloroetena: $n = \dfrac{180\,\mathrm{g}}{62{,}49\,\mathrm{g/mol}} = 2{,}880\,\mathrm{mol}$.
2. Enačba ima vse koeficiente $1$, zato je množina dikloroetana in $\mathrm{HCl}$ prav tako $2{,}880\,\mathrm{mol}$.
3. Masa dikloroetana: $m = 2{,}880 \cdot 98{,}95 = 285{,}0\,\mathrm{g}$.
4. Masa vodikovega klorida: $m = 2{,}880 \cdot 36{,}46 = 105{,}0\,\mathrm{g}$.
5. Preverba z ohranitvijo mase: $285{,}0 - 105{,}0 = 180{,}0$, se ujema.
6. Odgovor: tovarna razgradi $285\,\mathrm{g}$ 1,2-dikloroetana, pri tem nastane $105\,\mathrm{g}$ $\mathrm{HCl}$.

### Primer 3: ovinek v številkah

Za isto ploščo ($2{,}880\,\mathrm{mol}$ kloroetena) izračunaj, koliko etena in klora potrebuje tovarna v prvem koraku in kolikšna je atomska ekonomičnost cele poti od etena do kloroetena.

**Podatki:** $n = 2{,}880\,\mathrm{mol}$, $M(\mathrm{C_2H_4}) = 28{,}05\,\mathrm{g/mol}$, $M(\mathrm{Cl_2}) = 70{,}90\,\mathrm{g/mol}$, $m(\text{kloroeten}) = 180\,\mathrm{g}$
**Iščemo:** maso etena, maso klora in atomsko ekonomičnost $E_{\mathrm{at}}$

:::formula
$m = n \cdot M$, $\quad E_{\mathrm{at}} = \dfrac{m_{\mathrm{p}}}{m_{\mathrm{r}}}$
:::

**Rešitev:**

1. Prvi korak je adicija $1 : 1$, zato potrebujemo $2{,}880\,\mathrm{mol}$ etena in $2{,}880\,\mathrm{mol}$ klora.
2. Masa etena: $m = 2{,}880 \cdot 28{,}05 = 80{,}8\,\mathrm{g}$.
3. Masa klora: $m = 2{,}880 \cdot 70{,}90 = 204{,}2\,\mathrm{g}$.
4. Skupna masa reaktantov: $m_{\mathrm{r}} = 80{,}8 + 204{,}2 = 285{,}0\,\mathrm{g}$; enako kot masa dikloroetana, ker adicija nič ne izgubi.
5. Atomska ekonomičnost: $E_{\mathrm{at}} = \dfrac{180}{285{,}0} = 0{,}632$, torej $63{,}2\,\%$.
6. Odgovor: potrebujemo $80{,}8\,\mathrm{g}$ etena in $204{,}2\,\mathrm{g}$ klora; v plošči konča $63\,\%$ mase reaktantov, ostalo odide kot $\mathrm{HCl}$. Zato tovarne $\mathrm{HCl}$ ne zavržejo, ampak ga porabijo za nov dikloroetan.

### Primer 4 – zdaj ti: eten iz etanola

Iz $23{,}0\,\mathrm{g}$ etanola s konc. $\mathrm{H_2SO_4}$ pri $170\,^\circ\mathrm{C}$ nastaja eten. Koliko gramov etena nastane, če se ves etanol pretvori?

**Podatki:** $m(\text{etanol}) = 23{,}0\,\mathrm{g}$, $M(\mathrm{C_2H_5OH}) = 46{,}07\,\mathrm{g/mol}$, $M(\mathrm{C_2H_4}) = 28{,}05\,\mathrm{g/mol}$
**Iščemo:** maso etena $m$

:::formula
$\mathrm{C_2H_5OH \to CH_2{=}CH_2 + H_2O}$, $\quad n = \dfrac{m}{M}$
:::

**Rešitev:**

1. Vrsta reakcije: iz ene molekule nastaneta dve, nastane dvojna vez, torej eliminacija vode.
2. Množina etanola: $n = \dfrac{23{,}0\,\mathrm{g}}{46{,}07\,\mathrm{g/mol}} = 0{,}499\,\mathrm{mol}$.
3. Razmerje etanol : eten je $1 : 1$. Izračunaj maso etena sam, nato preveri:

:::premisli
Koliko gramov etena nastane?
---
$m = 0{,}499\,\mathrm{mol} \cdot 28{,}05\,\mathrm{g/mol} = 14{,}0\,\mathrm{g}$. Ostalih $9{,}0\,\mathrm{g}$ je voda, ki se odcepi.
:::

## Pogoste napake

Pri razvrščanju reakcij se učenci najpogosteje zmotijo, ker gledajo le en znak, ne celotne slike.

- **Halogen pomeni substitucijo.** Ker metan s klorom da substitucijo, mnogi mislijo, da vsak halogen nekaj zamenja. Eten z bromom pa da adicijo: brom se veže na dvojno vez, nič ne odide. Najprej poglej, ali ima reaktant dvojno vez.
- **Šteti le reaktante.** »Dva reaktanta, torej adicija« ne velja: tudi substitucija ima dva reaktanta. Odloči šele število produktov: pri adiciji je eden, pri substituciji dva.
- **Eliminacija kot razpad na pol.** Pri eliminaciji se molekula ne razpolovi. Odcepi se *majhna* molekula ($\mathrm{H_2O}$, $\mathrm{HX}$), atoma prideta s *sosednjih* ogljikov, med njima pa nastane dvojna vez.
- **»Pogoji niso pomembni.«** $\mathrm{NaOH}$ v vodi in $\mathrm{KOH}$ v etanolu sta obe bazi, a prva z bromoetanom da etanol, druga ob segrevanju eten. Topilo in temperatura odločita med substitucijo in eliminacijo.
- **Atomska ekonomičnost je isto kot izkoristek ali ohranitev mase.** Masa se ohrani pri vsaki reakciji, a stranski produkt ($\mathrm{HCl}$, $\mathrm{NaBr}$, voda) ni želeni produkt. Atomska ekonomičnost šteje le maso želenega produkta.

## Povzetek

- Vrsto reakcije določiš s štetjem molekul in z dvojno vezjo.
- Adicija: $2 \to 1$, dvojna (trojna) vez se odpre; značilna za alkene in alkine (bromova voda se razbarva).
- Eliminacija: $1 \to 2$, odcepi se majhna molekula ($\mathrm{H_2O}$, $\mathrm{HX}$) s sosednjih ogljikov, nastane dvojna vez; obratna adiciji.
- Substitucija: $2 \to 2$, atom ali skupina se zamenja; značilna za alkane (halogen, svetloba) in halogenoalkane ($\mathrm{OH^-}$).
- Pogoji odločijo: halogenoalkan + $\mathrm{NaOH}$ v vodi → alkohol, + $\mathrm{KOH}$ v etanolu s segrevanjem → alken.
- Atomska ekonomičnost $E_{\mathrm{at}} = \dfrac{m_{\mathrm{p}}}{m_{\mathrm{r}}}$: pri adiciji $100\,\%$, pri eliminaciji in substituciji manj.
- Pot do PVC: eten + $\mathrm{Cl_2}$ (adicija) → 1,2-dikloroetan → kloroeten + $\mathrm{HCl}$ (eliminacija).

## Drugače: Z analogijo

Molekulo si predstavljaj kot glasbeno zasedbo, atome kot glasbenike, vezi kot to, kdo s kom igra.

- **Adicija:** duo (eten) in drug duo (molekula broma) se združita v en kvartet. Nihče ne ostane na hodniku. Eno od dveh rokovanj dvojne vezi se sprosti: vsak novinec se poveže z enim od starih članov.
- **Eliminacija:** iz kvarteta odideta dva člana skupaj, kot svoj duo ($\mathrm{HCl}$ ali voda). Preostala člana zdaj igrata tesneje: med njima je dvojna vez.
- **Substitucija:** kitarist zapusti skupino in na njegovo mesto pride nov. Skupin je pred menjavo in po njej enako, dve; stari kitarist igra naprej v drugi (na primer brom v $\mathrm{NaBr}$).

Analogija ima meje. Atomi nimajo izbire: kaj se zgodi, določijo zgradba molekule, topilo, temperatura in katalizator.

## Drugače: Bolj natančno

Vsaka vrsta reakcije poteka po korakih, ki jim pravimo **mehanizem**.

- **Radikalska substitucija** (alkan + halogen): svetloba razcepi $\mathrm{Cl_2}$ na dva atoma z nesparjenim elektronom (radikala). Radikal odtrga vodik z alkana, nastali alkilni radikal pa vzame klor naslednji molekuli $\mathrm{Cl_2}$. Klorov radikal napade tudi že klorirano molekulo, zato nastanejo tudi $\mathrm{CH_2Cl_2}$, $\mathrm{CHCl_3}$ in $\mathrm{CCl_4}$.
- **Elektrofilna adicija** (alken + $\mathrm{Br_2}$ ali $\mathrm{HBr}$): elektroni dvojne vezi privlačijo delec s pozitivnim nabojem (elektrofil). Pri nesimetričnem alkenu velja **Markovnikovo pravilo**: vodik iz $\mathrm{HBr}$ se veže na ogljik, ki že ima več vodikov. Iz propena zato nastane predvsem 2-bromopropan.
- **Nukleofilna substitucija** (halogenoalkan + $\mathrm{OH^-}$): ion $\mathrm{OH^-}$ z neveznim parom napade ogljik, ki nosi halogen; ta ogljik je delno pozitiven, ker halogen privlači elektrone. Halogenidni ion odide.
- **Eliminacija** (halogenoalkan + močna baza v etanolu): baza odtrga vodik s sosednjega ogljika, halogenid odide, med ogljikoma nastane dvojna vez. Višja temperatura in manj vode dajeta prednost eliminaciji pred substitucijo.

Tudi esterifikacija in hidroliza estra sta po zgradbi substituciji: na ogljiku skupine $\mathrm{C{=}O}$ se zamenja skupina $\mathrm{{-}OH}$ s skupino $\mathrm{{-}OR}$ ali obratno. Ker se pri tem odcepi voda, esterifikaciji pravimo tudi **kondenzacija**.

Industrija dviga atomsko ekonomičnost poti do PVC tako, da $\mathrm{HCl}$ iz eliminacije s kisikom in etenom spet pretvori v dikloroetan:

$$\mathrm{2\,CH_2{=}CH_2 + 4\,HCl + O_2 \to 2\,CH_2Cl{-}CH_2Cl + 2\,H_2O}$$

## Preveri se

? V tovarni vinilnih plošč 1,2-dikloroetan pri $500\,^\circ\mathrm{C}$ razpade na kloroeten in vodikov klorid. Katera vrsta reakcije je to?
- Substitucija, ker nastaneta dva produkta.
~ Pri substituciji sta tudi dva reaktanta. Tu je reaktant ena sama molekula, iz katere se nekaj odcepi.
+ Eliminacija.
- Adicija, ker je v produktu dvojna vez.
~ Pri adiciji dvojna vez izgine in dve molekuli dasta eno. Tu je obratno: dvojna vez nastane.
> Iz ene molekule se s sosednjih ogljikov odcepi $\mathrm{HCl}$ in nastane dvojna vez: to je eliminacija.

? Uredi reakcije po atomski ekonomičnosti za etanol oziroma eten, od največje do najmanjše. A: eten + voda → etanol; B: bromoetan + $\mathrm{NaOH}$ → etanol + $\mathrm{NaBr}$; C: etanol → eten + voda.
- A = B = C, vse imajo $100\,\%$.
~ Masa se ohrani pri vsaki reakciji, a $\mathrm{NaBr}$ in voda nista želeni produkt. Atomska ekonomičnost šteje le želeni produkt.
- B > C > A
~ Obrnil si vrstni red. Adicija ne izgubi nobenega atoma, zato je na vrhu; pri B odide težki $\mathrm{NaBr}$.
+ A > C > B
> A (adicija) ima $100\,\%$. C: $\dfrac{28{,}05}{46{,}07} = 0{,}609$, torej $61\,\%$. B: $\dfrac{46{,}07}{108{,}96 + 40{,}00} = 0{,}309$, torej $31\,\%$, ker večina mase odide v $\mathrm{NaBr}$.

? Iz bromoetana želiš dobiti eten. Katere pogoje izbereš?
- Vodno raztopino $\mathrm{NaOH}$, ker je za odcep $\mathrm{HBr}$ dovolj katera koli baza.
~ Pogoji niso nepomembni: v vodi ion $\mathrm{OH^-}$ zamenja brom in nastane etanol (substitucija).
+ $\mathrm{KOH}$ v etanolu ob segrevanju.
- Klor ob svetlobi.
~ Tako poteče substitucija: klor zamenja vodik, dvojna vez pa ne nastane.
> $\mathrm{C_2H_5Br + KOH \to CH_2{=}CH_2 + KBr + H_2O}$: v etanolu in ob segrevanju prevlada eliminacija $\mathrm{HBr}$.

? Koliko broma ($M(\mathrm{Br_2}) = 159{,}80\,\mathrm{g/mol}$) se lahko adira na $5{,}6\,\mathrm{g}$ etena ($28{,}05\,\mathrm{g/mol}$)?
- $16\,\mathrm{g}$
~ Računal si z enim atomom broma ($79{,}90\,\mathrm{g/mol}$). Na dvojno vez se veže cela molekula $\mathrm{Br_2}$, po en atom na vsak ogljik.
+ $32\,\mathrm{g}$
- $64\,\mathrm{g}$
~ Vzel si dve molekuli $\mathrm{Br_2}$, eno za vsak ogljik. Ena molekula $\mathrm{Br_2}$ že da po en atom obema ogljikoma.
- $5{,}6\,\mathrm{g}$
~ Ujemata se množini, ne masi. Molekula broma je veliko težja od molekule etena.
> $n = \dfrac{5{,}6}{28{,}05} = 0{,}200\,\mathrm{mol}$; razmerje $1 : 1$; $m = 0{,}200 \cdot 159{,}80 = 32\,\mathrm{g}$.

? Kolikšna je atomska ekonomičnost reakcije $\mathrm{CH_4 + Cl_2 \to CH_3Cl + HCl}$ za klorometan? ($M$: $\mathrm{CH_4}$ $16{,}04$; $\mathrm{Cl_2}$ $70{,}90$; $\mathrm{CH_3Cl}$ $50{,}48\,\mathrm{g/mol}$)
- $100\,\%$
~ Masa se ohrani, a $\mathrm{HCl}$ ni želeni produkt. $100\,\%$ ima le adicija.
- $42\,\%$
~ To je delež mase, ki odide v $\mathrm{HCl}$, torej odpadek, ne produkt.
+ $58\,\%$
> $E_{\mathrm{at}} = \dfrac{50{,}48}{16{,}04 + 70{,}90} = 0{,}581$, torej $58\,\%$. Pri substituciji del mase vedno odide v stranski produkt.

:::simboli
E_{\mathrm{at}} | atomska ekonomičnost | E_{\mathrm{at}} = \dfrac{m_{\mathrm{p}}}{m_{\mathrm{r}}} | – | pri adiciji $100\,\%$
m_{\mathrm{p}} | masa želenega produkta | | g
m_{\mathrm{r}} | skupna masa reaktantov | | g
n | množina snovi | n = \dfrac{m}{M} | mol
m | masa | m = n \cdot M | g
M | molska masa | | g/mol
:::
