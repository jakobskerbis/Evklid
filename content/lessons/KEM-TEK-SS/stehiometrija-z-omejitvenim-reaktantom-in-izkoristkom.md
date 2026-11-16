---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Luka trenira mlade plezalce. Za klub je pri spletnem prodajalcu kupil vrečo poceni magnezije, belega prahu, s katerim si plezalci sušijo dlani. Na vreči piše »čisti $\mathrm{MgCO_3}$«. Prah pa je na otip nenavadno mastan, zato Luka sumi, da so mu primešali smukec. Smukec s kislino ne reagira, magnezijev karbonat pa:

$$\mathrm{MgCO_3} + 2\,\mathrm{HCl} \rightarrow \mathrm{MgCl_2} + \mathrm{H_2O} + \mathrm{CO_2}$$

Ogljikov dioksid uide iz čaše, zato se masa zmesi zmanjša. Luka si zapiše tri vprašanja:

1. Koliko kisline moram dodati, da se kislina ne porabi prej kot karbonat?
2. Koliko $\mathrm{CO_2}$ bi oddal vzorec, če bi bil res čist?
3. Kaj mi pove, če ga odda manj?

To so tri ideje te lekcije: **omejitveni reaktant**, **teoretična masa produkta** in **čistost vzorca**. Četrta, **izkoristek**, pride na vrsto, ko reakcija v praksi ne da vsega, kar obljublja enačba. Na tekmovanjih se vse štiri pogosto skrivajo v isti nalogi. Lukovo vprašanje rešiš sam v Primeru 4.

## Razlaga

**1. Štafete brez kemije.** Za štafeto $4 \times 100\,\mathrm{m}$ potrebuješ štiri tekače in eno palico. Recept je torej »4 tekači + 1 palica → 1 štafeta«. Trener ima 18 tekačev in 6 palic. Koliko štafet sestavi?

| | tekači | palice |
|---|---|---|
| na voljo | 18 | 6 |
| potrebno za 1 štafeto | 4 | 1 |
| zadošča za štafet | $4{,}5$ | 6 |

Tekačev je trikrat več kot palic, a zmanjka prav njih: sestavi le 4 štafete. Ostaneta 2 tekača in 2 palici. Ne odloča, česa je več, ampak **za koliko izdelkov zadošča posamezna sestavina**. To dobiš, če količino deliš s tem, koliko je recept zahteva.

**2. Isto z molekulami.** Recept v kemiji je urejena enačba. Število pred formulo je **stehiometrijski koeficient** $\nu$ (grška črka »ni«). Pri sintezi amonijaka

$$\mathrm{N_2} + 3\,\mathrm{H_2} \rightarrow 2\,\mathrm{NH_3}$$

vzemimo $0{,}30\,\mathrm{mol}$ dušika in $0{,}60\,\mathrm{mol}$ vodika. Vodika je dvakrat več, a vsaka molekula dušika jih potrebuje tri. Množino vsakega reaktanta delimo z njegovim koeficientom. Dobljeni **količnik** $\frac{n}{\nu}$ pove, za koliko »receptov« zadošča reaktant, tako kot zgornja vrstica pri štafetah:

:::risba stolpci
opis: Stolpca kažeta množino, deljeno s koeficientom. Dušik 0,30 mol, vodik 0,60 mol deljeno s 3, torej 0,20 mol. Nižji je stolpec vodika.
stolpec: N_2 | 0,30
stolpec: H_2 | 0,20
os: n/ν v mol
korak: 0,1
:::

Nižji stolpec pripada **omejitvenemu reaktantu**: porabi se prvi in ustavi reakcijo. Drugi reaktant je **v prebitku**. Kaj se med reakcijo zgodi, je najlažje videti v tabeli *začetek – sprememba – konec*:

| (mol) | $\mathrm{N_2}$ | $\mathrm{H_2}$ | $\mathrm{NH_3}$ |
|---|---|---|---|
| začetek | $0{,}30$ | $0{,}60$ | $0$ |
| sprememba | $-0{,}20$ | $-0{,}60$ | $+0{,}40$ |
| konec | $0{,}10$ | $0$ | $0{,}40$ |

Vse spremembe so v razmerju koeficientov $1 : 3 : 2$. Ta tabela je na tekmovanju najzanesljivejša pot: v njej hkrati vidiš, kaj ostane in kaj nastane.

V simulaciji spodaj (»Omejitveni reaktant«) izberi $\mathrm{N_2} + 3\,\mathrm{H_2} \rightarrow 2\,\mathrm{NH_3}$ in nastavi 3 molekule dušika ter 6 molekul vodika. Pred pritiskom na gumb Reagiraj napovej, katere molekule ostanejo. Opazi, da zmanjka vodika, čeprav je bilo njegovih molekul več.

:::premisli
Zmešamo $2\,\mathrm{mol}$ vodika in $2\,\mathrm{mol}$ kisika za reakcijo $2\,\mathrm{H_2} + \mathrm{O_2} \rightarrow 2\,\mathrm{H_2O}$. Množini sta enaki. Ali to pomeni, da se porabita oba?
---
Ne. Količnika sta $\frac{2}{2} = 1$ za vodik in $\frac{2}{1} = 2$ za kisik. Omejitveni je vodik: $2\,\mathrm{mol}$ vodika porabita le $1\,\mathrm{mol}$ kisika, $1\,\mathrm{mol}$ kisika ostane. Enake množine pomenijo »brez prebitka« samo, kadar sta enaka tudi koeficienta.
:::

**3. Iz mas v množine.** Tehtnica meri maso v gramih, enačba pa govori v molih. Zato vsako maso najprej pretvori v množino z molsko maso $M$:

$$n = \frac{m}{M}$$

Šele količnike $\frac{n}{\nu}$ smeš primerjati. Primerjanje mas je past: reaktant z večjo maso nima nujno več delcev.

**4. Izkoristek.** Masa produkta, ki jo izračunaš iz omejitvenega reaktanta, je **teoretična masa** $m_\mathrm{teor}$. V laboratoriju dobiš manj: reakcija ne steče do konca, potekajo stranske reakcije, nekaj snovi ostane na filtrirnem papirju. Kar res stehtaš, je **dejanska masa** $m_\mathrm{dej}$. Njuno razmerje je **izkoristek**:

$$\eta = \frac{m_\mathrm{dej}}{m_\mathrm{teor}} \cdot 100\,\%$$

Enako razmerje velja za množine. Če snov nastaja v dveh zaporednih stopnjah, se izkoristka zmnožita: pri $80\,\%$ in $90\,\%$ je skupni izkoristek $0{,}80 \cdot 0{,}90 = 0{,}72$, torej $72\,\%$.

:::premisli
Dijak izračuna izkoristek $105\,\%$. Kaj je najverjetneje šlo narobe?
---
Več snovi, kot jo dovoljuje omejitveni reaktant, ne more nastati. Najpogosteje produkt ni bil dobro posušen (vsebuje vodo ali topilo) ali je onesnažen. Druga možnost je računska napaka: teoretično maso je izračunal iz reaktanta v prebitku namesto iz omejitvenega.
:::

**5. Čistost vzorca.** Tehnične snovi niso čiste. Kalcijev karbid za jamarske svetilke vsebuje tudi kalcijev oksid, Lukova magnezija morda smukec. Delež reaktivne snovi v vzorcu je **čistost** oziroma masni delež $w$:

$$w = \frac{m_\mathrm{snovi}}{m_\mathrm{vzorca}}$$

V reakcijo gre samo čisti del. Smer računa si zapomni po smislu:

- iz vzorca proti čisti snovi **množiš** z $w$ (čiste snovi je manj kot vzorca);
- od potrebne čiste snovi proti vzorcu **deliš** z $w$ (vzorca rabiš več).

Enako velja za izkoristek: ko iz želene dejanske mase računaš nazaj k reaktantom, deliš z $\eta$, ker moraš zaradi izgub vzeti več.

**6. Strategija za tekmovalno nalogo.** Uredi enačbo. Vse mase pretvori v množine (pri vzorcih upoštevaj čistost). Poišči najmanjši količnik $\frac{n}{\nu}$. Iz omejitvenega reaktanta izračunaj produkt, šele na koncu upoštevaj izkoristek. Za preverbo seštej mase: skupna masa pred reakcijo je enaka skupni masi po njej.

## Rešeni primeri

### Primer 1: samogrelni obrok za alpiniste

Alpinisti si hrano grejejo v vrečki, v kateri magnezij reagira z vodo in sprošča toploto:
$\mathrm{Mg} + 2\,\mathrm{H_2O} \rightarrow \mathrm{Mg(OH)_2} + \mathrm{H_2}$.
V vrečki je $2{,}43\,\mathrm{g}$ magnezija, alpinist doda $3{,}00\,\mathrm{g}$ vode. Kateri reaktant je omejitveni, koliko vodika nastane in koliko magnezija ostane?

**Podatki:** $m(\mathrm{Mg}) = 2{,}43\,\mathrm{g}$; $m(\mathrm{H_2O}) = 3{,}00\,\mathrm{g}$; $M(\mathrm{Mg}) = 24{,}31\,\mathrm{g/mol}$; $M(\mathrm{H_2O}) = 18{,}02\,\mathrm{g/mol}$; $M(\mathrm{H_2}) = 2{,}016\,\mathrm{g/mol}$; urejena enačba zgoraj
**Iščemo:** omejitveni reaktant, maso vodika $m(\mathrm{H_2})$, maso preostalega magnezija

:::formula
$n = \dfrac{m}{M}$, nato primerjaj količnika $\dfrac{n}{\nu}$
:::

**Rešitev:**

1. Množina magnezija: $\dfrac{2{,}43}{24{,}31} = 0{,}1000$, torej $n(\mathrm{Mg}) = 0{,}1000\,\mathrm{mol}$.
2. Množina vode: $\dfrac{3{,}00}{18{,}02} = 0{,}1665$, torej $n(\mathrm{H_2O}) = 0{,}1665\,\mathrm{mol}$.
3. Količnika: pri magneziju $0{,}1000\,\mathrm{mol}$ (koeficient 1), pri vodi polovica množine, $0{,}0832\,\mathrm{mol}$ (koeficient 2). Manjši je pri vodi, zato je **voda omejitveni reaktant**, čeprav ima večjo maso.
4. Vodika nastane pol toliko molov kot zreagira vode: $n(\mathrm{H_2}) = 0{,}0832\,\mathrm{mol}$. Masa: $0{,}0832 \cdot 2{,}016 = 0{,}168$, torej $0{,}168\,\mathrm{g}$.
5. Zreagira $0{,}0832\,\mathrm{mol}$ magnezija, to je $0{,}0832 \cdot 24{,}31 = 2{,}02$ grama. Ostane $2{,}43 - 2{,}02 = 0{,}41$ grama magnezija.
6. Odgovor: omejitveni reaktant je voda; nastane $0{,}168\,\mathrm{g}$ vodika, ostane $0{,}41\,\mathrm{g}$ magnezija.

### Primer 2: hladilni sprej za poškodbe

Hladilni sprej, s katerim zdravnik na igrišču ohladi udarnino, je včasih vseboval kloroetan. Pripravimo ga z adicijo:
$\mathrm{C_2H_4} + \mathrm{HCl} \rightarrow \mathrm{C_2H_5Cl}$.
Iz $14{,}0\,\mathrm{g}$ etena in $20{,}0\,\mathrm{g}$ vodikovega klorida dobimo $25{,}8\,\mathrm{g}$ kloroetana. Kolikšen je izkoristek?

**Podatki:** $m(\mathrm{C_2H_4}) = 14{,}0\,\mathrm{g}$; $m(\mathrm{HCl}) = 20{,}0\,\mathrm{g}$; $m_\mathrm{dej} = 25{,}8\,\mathrm{g}$; $M(\mathrm{C_2H_4}) = 28{,}05\,\mathrm{g/mol}$; $M(\mathrm{HCl}) = 36{,}46\,\mathrm{g/mol}$; $M(\mathrm{C_2H_5Cl}) = 64{,}51\,\mathrm{g/mol}$
**Iščemo:** izkoristek $\eta$

:::formula
$\eta = \dfrac{m_\mathrm{dej}}{m_\mathrm{teor}} \cdot 100\,\%$, kjer $m_\mathrm{teor}$ izračunaš iz omejitvenega reaktanta
:::

**Rešitev:**

1. $\dfrac{14{,}0}{28{,}05} = 0{,}4991$, torej $n(\mathrm{C_2H_4}) = 0{,}4991\,\mathrm{mol}$.
2. $\dfrac{20{,}0}{36{,}46} = 0{,}5485$, torej $n(\mathrm{HCl}) = 0{,}5485\,\mathrm{mol}$.
3. Vsi koeficienti so 1, zato primerjamo kar množini. Etena je manj: **eten je omejitveni reaktant**.
4. Teoretično nastane $0{,}4991\,\mathrm{mol}$ kloroetana: $0{,}4991 \cdot 64{,}51 = 32{,}20$, torej $m_\mathrm{teor} = 32{,}20\,\mathrm{g}$.
5. Izkoristek: $\dfrac{25{,}8}{32{,}20} \cdot 100 = 80{,}1$, torej $\eta = 80{,}1\,\%$.
6. Odgovor: izkoristek je $80{,}1\,\%$.

### Primer 3: karbid za jamarje (obratna naloga)

Jamarji so svetili s karbidovkami. V njih kalcijev karbid reagira z vodo in nastaja gorljivi etin:
$\mathrm{CaC_2} + 2\,\mathrm{H_2O} \rightarrow \mathrm{C_2H_2} + \mathrm{Ca(OH)_2}$.
Za en dan v jami potrebuje svetilka $13{,}0\,\mathrm{g}$ etina. Tehnični karbid vsebuje $80{,}0\,\%$ $\mathrm{CaC_2}$, del plina se izgubi, zato je izkoristek $95{,}0\,\%$. Vode je v prebitku. Koliko tehničnega karbida mora jamar vzeti s seboj?

**Podatki:** $m_\mathrm{dej}(\mathrm{C_2H_2}) = 13{,}0\,\mathrm{g}$; $w = 0{,}800$; $\eta = 95{,}0\,\%$; $M(\mathrm{C_2H_2}) = 26{,}04\,\mathrm{g/mol}$; $M(\mathrm{CaC_2}) = 64{,}10\,\mathrm{g/mol}$; voda v prebitku
**Iščemo:** maso tehničnega karbida $m_\mathrm{vzorca}$

:::formula
$n = \dfrac{m}{M}$; nazaj k reaktantu deliš z $\eta$, od čiste snovi k vzorcu deliš z $w$
:::

**Rešitev:**

1. Želena množina etina: $\dfrac{13{,}0}{26{,}04} = 0{,}4992$, torej $0{,}4992\,\mathrm{mol}$.
2. Zaradi izgub mora teoretično nastati več. Ker je razmerje karbid : etin enako $1 : 1$, potrebujemo $\dfrac{0{,}4992}{0{,}950} = 0{,}5255$ mola $\mathrm{CaC_2}$.
3. Masa čistega karbida: $0{,}5255 \cdot 64{,}10 = 33{,}68$, torej $33{,}68\,\mathrm{g}$.
4. Čisti karbid je le del vzorca, zato vzorca potrebujemo več: $\dfrac{33{,}68}{0{,}800} = 42{,}1$, torej $m_\mathrm{vzorca} = 42{,}1\,\mathrm{g}$.
5. Odgovor: jamar potrebuje $42{,}1\,\mathrm{g}$ tehničnega karbida. Preverba smisla: rezultat je večji od mase čistega karbida, kot mora biti.

### Primer 4: zdaj ti – Lukova magnezija

Luka v čašo strese $5{,}00\,\mathrm{g}$ magnezije in prilije raztopino, ki vsebuje $6{,}0\,\mathrm{g}$ $\mathrm{HCl}$. Ko mehurčkanje preneha, se masa vsebine čaše zmanjša za $2{,}30\,\mathrm{g}$. Smukec ne reagira. Kolikšen je masni delež $\mathrm{MgCO_3}$ v magneziji?

**Podatki:** $m_\mathrm{vzorca} = 5{,}00\,\mathrm{g}$; $m(\mathrm{HCl}) = 6{,}0\,\mathrm{g}$; zmanjšanje mase $2{,}30\,\mathrm{g}$; $M(\mathrm{MgCO_3}) = 84{,}32\,\mathrm{g/mol}$; $M(\mathrm{HCl}) = 36{,}46\,\mathrm{g/mol}$; $M(\mathrm{CO_2}) = 44{,}01\,\mathrm{g/mol}$
**Iščemo:** čistost $w$

:::formula
$w = \dfrac{m_\mathrm{snovi}}{m_\mathrm{vzorca}}$
:::

**Rešitev:**

1. Je kislina res v prebitku? Tudi če bi bil vzorec čist, bi bilo karbonata $\dfrac{5{,}00}{84{,}32} = 0{,}05930$ mola in bi potreboval dvakrat toliko, $0{,}1186\,\mathrm{mol}$ $\mathrm{HCl}$. Na voljo je $\dfrac{6{,}0}{36{,}46} = 0{,}1646$ mola. Kislina je v prebitku, omejitveni je karbonat.
2. Zmanjšanje mase je ušli $\mathrm{CO_2}$: $\dfrac{2{,}30}{44{,}01} = 0{,}05226$, torej $n(\mathrm{CO_2}) = 0{,}05226\,\mathrm{mol}$.
3. Razmerje $\mathrm{MgCO_3} : \mathrm{CO_2} = 1 : 1$, zato je zreagiralo $0{,}05226\,\mathrm{mol}$ karbonata.
4. Izračunaj sam maso karbonata in čistost, nato preveri:

:::premisli
Kolikšna je masa $\mathrm{MgCO_3}$ v vzorcu in kolikšen je njegov masni delež?
---
$m(\mathrm{MgCO_3}) = 0{,}05226 \cdot 84{,}32 = 4{,}407$, torej $4{,}407\,\mathrm{g}$. Čistost: $\dfrac{4{,}407}{5{,}00} = 0{,}881$, torej $w = 88{,}1\,\%$. Luka je imel prav: skoraj osmina vreče je smukec.
:::

## Pogoste napake

- **Primerjanje mas.** »Vode je $3{,}00\,\mathrm{g}$, magnezija le $2{,}43\,\mathrm{g}$, torej je omejitveni magnezij.« Masa ne pove števila delcev, ker imajo snovi različne molske mase. Pravilno: pretvori v mole in primerjaj $\frac{n}{\nu}$ (Primer 1: omejitvena je voda).
- **Pozabljen koeficient.** »Vodika in kisika je po $2\,\mathrm{mol}$, porabita se oba.« Recept zahteva dva vodika na en kisik. Pravilno: vsako množino deli s svojim koeficientom.
- **Teoretična masa iz napačnega reaktanta.** Kdor računa iz reaktanta v prebitku, dobi preveliko teoretično maso in premajhen izkoristek. Kdor dejansko maso deli s skupno maso reaktantov, prav tako ne dobi izkoristka. Pravilno: $m_\mathrm{teor}$ vedno iz omejitvenega reaktanta.
- **Čistost ali izkoristek v napačni smeri.** Pri obratni nalogi dijak zmnoži: $33{,}68 \cdot 0{,}800 = 26{,}9$ grama karbida. To je manj od čistega karbida, ki ga potrebujemo, kar ne more biti. Pravilno: k vzorcu in k reaktantom računaš z deljenjem, ker potrebuješ več.
- **Nečisti vzorec kot čist.** Kdor vseh $5{,}00\,\mathrm{g}$ magnezije šteje za $\mathrm{MgCO_3}$, pričakuje $2{,}61\,\mathrm{g}$ $\mathrm{CO_2}$ in se čudi, da ga je manj. Pravilno: v reakcijo gre samo $w \cdot m_\mathrm{vzorca}$.

## Povzetek

- Omejitveni reaktant ima najmanjši količnik $\frac{n}{\nu}$; porabi se v celoti in določa, koliko produkta nastane. Mas ne primerjamo.
- Tabela začetek – sprememba – konec pokaže hkrati produkt in prebitek; spremembe so v razmerju koeficientov.
- Teoretična masa produkta sledi iz omejitvenega reaktanta; izkoristek $\eta = \frac{m_\mathrm{dej}}{m_\mathrm{teor}} \cdot 100\,\%$. Izkoristki zaporednih stopenj se zmnožijo.
- Čistost $w = \frac{m_\mathrm{snovi}}{m_\mathrm{vzorca}}$; v reakcijo gre samo čisti del.
- Od vzorca k produktu množiš z $w$ in $\eta$; v obratni smeri deliš z njima.

## Drugače: Z analogijo

Predstavljaj si kolesarsko delavnico. Recept je »2 platišči + 1 okvir → 1 kolo«.

- **Omejitveni reaktant.** V skladišču je 50 platišč in 30 okvirjev. Platišča zadoščajo za 25 koles, okvirji za 30. Platišča so omejitvena, 5 okvirjev ostane.
- **Izkoristek.** Pri kontroli dve kolesi ne prestaneta preizkusa. Namesto 25 jih prodajo 23, izkoristek je $\frac{23}{25} = 92\,\%$.
- **Čistost.** Zaboj z napisom »60 platišč« vsebuje le 50 platišč, ostalo so zračnice. »Čistost« zaboja je $\frac{50}{60}$, približno $83\,\%$. Kdor bi računal s 60 platišči, bi napovedal preveč koles.

## Drugače: Iz vsakdanjega življenja

Recept za palačinke: 2 jajci, $250\,\mathrm{g}$ moke in pol litra mleka dajo 10 palačink. Doma imaš 3 jajca, kilogram moke in dva litra mleka. Moke in mleka je za štiri recepte, jajc le za poldrugega. Jajca so omejitvena: spečeš 15 palačink, moka in mleko ostaneta.

Prva palačinka se skoraj vedno prime ponve. Od 15 jih na krožnik pride 14, izkoristek je $\frac{14}{15}$, približno $93\,\%$.

Čistost poznaš iz trgovine: »pomarančni napitek« vsebuje morda le polovico soka. Če potrebuješ liter pravega soka, kupiš dva litra napitka. Tudi tu od čiste snovi k »vzorcu« deliš z deležem.

## Preveri se

? Tri trditve o omejitvenem reaktantu držijo, ena ne sodi zraven. Katera?
- Porabi se v celoti.
~ Ta trditev drži: reakcija se ustavi prav zato, ker omejitvenega reaktanta zmanjka.
- Iz njegove množine izračunamo teoretično maso produkta.
~ Ta trditev drži: produkta ne more nastati več, kot ga dovoli reaktant, ki se porabi prvi.
+ Vedno je to reaktant z manjšo maso.
- Drugi reaktant po reakciji deloma ostane, razen če sta reaktanta v točnem razmerju.
~ Ta trditev drži: reaktant v prebitku se ne porabi do konca.
> Odločata množina in koeficient, ne masa. V Primeru 1 je voda omejitvena, čeprav ima večjo maso kot magnezij.

? Stolpca kažeta količnik $\frac{n}{\nu}$ za reaktanta reakcije $2\,\mathrm{H_2} + \mathrm{O_2} \rightarrow 2\,\mathrm{H_2O}$. Kaj se zgodi z množino nastale vode, če podvojimo množino vodika?
:::risba stolpci
opis: Stolpca kažeta množino, deljeno s koeficientom. Vodik 0,30 mol, kisik 0,50 mol.
stolpec: H_2 | 0,30
stolpec: O_2 | 0,50
os: n/ν v mol
korak: 0,1
:::
- Podvoji se, z $0{,}60\,\mathrm{mol}$ na $1{,}20\,\mathrm{mol}$.
~ Po podvojitvi je količnik vodika $0{,}60$, kar je več kot $0{,}50$ pri kisiku. Vodik ni več omejitveni, zdaj zmanjka kisika.
+ Zraste z $0{,}60\,\mathrm{mol}$ na $1{,}00\,\mathrm{mol}$, ker postane omejitveni kisik.
- Ostane enaka, ker je vodik v prebitku.
~ Nižji stolpec ima vodik, zato je on omejitveni. Več omejitvenega reaktanta da več produkta.
> Pred podvojitvijo je omejitveni vodik: nastane $2 \cdot 0{,}30 = 0{,}60\,\mathrm{mol}$ vode. Po njej je nižji količnik pri kisiku, $0{,}50$, zato nastane $2 \cdot 0{,}50 = 1{,}00\,\mathrm{mol}$ vode.

? Koliko tehničnega karbida s čistostjo $80\,\%$ potrebuješ za $0{,}50\,\mathrm{mol}$ etina, če je izkoristek $100\,\%$? Rešitev ima napako. V katerem koraku?
**1.** $n(\mathrm{CaC_2}) = n(\mathrm{C_2H_2}) = 0{,}50\,\mathrm{mol}$
**2.** $m(\mathrm{CaC_2}) = 0{,}50 \cdot 64{,}10 = 32{,}05\,\mathrm{g}$
**3.** $m_\mathrm{vzorca} = 32{,}05 \cdot 0{,}80 = 25{,}6\,\mathrm{g}$
- V koraku 1.
~ Razmerje karbid : etin je $1 : 1$. Koeficient 2 pri vodi na to ne vpliva.
- V koraku 2.
~ Tu računamo maso čistega $\mathrm{CaC_2}$, zato je prava molska masa $64{,}10\,\mathrm{g/mol}$.
+ V koraku 3.
- Rešitev je pravilna.
~ Vzorca bi bilo manj kot čistega karbida v njem, kar je nemogoče.
> Od čiste snovi k vzorcu deliš s čistostjo: $\frac{32{,}05}{0{,}80} = 40{,}1\,\mathrm{g}$.

? Iz $4{,}00\,\mathrm{g}$ vodika in $16{,}0\,\mathrm{g}$ kisika nastane $16{,}2\,\mathrm{g}$ vode. Kolikšen je izkoristek v odstotkih? ($M(\mathrm{H_2}) = 2{,}016\,\mathrm{g/mol}$, $M(\mathrm{O_2}) = 32{,}00\,\mathrm{g/mol}$, $M(\mathrm{H_2O}) = 18{,}02\,\mathrm{g/mol}$)
= 89,9 % | 0,2
~ 45,3 | Teoretično maso si izračunal iz vodika, ki je v prebitku. Količnik kisika ($0{,}500$) je manjši od vodikovega ($0{,}992$).
~ 81 | Dejansko maso si delil s skupno maso reaktantov ($20{,}0\,\mathrm{g}$). Vsa ta masa ne more postati voda, ker del vodika ostane v prebitku.
> Kisik je omejitveni: $0{,}500\,\mathrm{mol}$ $\mathrm{O_2}$ da $1{,}000\,\mathrm{mol}$ vode, to je $18{,}02\,\mathrm{g}$. Izkoristek: $\frac{16{,}2}{18{,}02} \cdot 100\,\% = 89{,}9\,\%$.

? Razvrsti korake reševanja naloge z omejitvenim reaktantom in izkoristkom.
1. Uredi enačbo reakcije.
2. Mase reaktantov pretvori v množine.
3. Vsako množino deli s koeficientom in poišči najmanjši količnik.
4. Iz omejitvenega reaktanta izračunaj teoretično maso produkta.
5. Dejansko maso deli s teoretično.
> Brez urejene enačbe ne poznaš koeficientov, brez množin jih ne moreš uporabiti. Izkoristek je zadnji korak, ker potrebuje teoretično maso.

<<RACUN
kemija: MgCO3 + 2 HCl -> MgCl2 + H2O + CO2
kemija: N2 + 3 H2 -> 2 NH3
kemija: Mg + 2 H2O -> Mg(OH)2 + H2
kemija: C2H4 + HCl -> C2H5Cl
kemija: CaC2 + 2 H2O -> C2H2 + Ca(OH)2
kemija: 2 H2 + O2 -> 2 H2O
molska: MgCO3 | 84.32
molska: C2H5Cl | 64.51
molska: CaC2 | 64.10
molska: C2H2 | 26.04
vrednost: 3.00/18.02/2 | 0.0832
vrednost: 3.00/18.02/2*2.016 | 0.168
vrednost: 2.43-3.00/18.02/2*24.31 | 0.41
vrednost: 14.0/28.05*64.51 | 32.20
vrednost: 25.8/(14.0/28.05*64.51)*100 | 80.1
vrednost: 13.0/26.04/0.950*64.10/0.800 | 42.1
vrednost: 2.30/44.01*84.32/5.00*100 | 88.1
vrednost: 16.2/(16.0/32.00*2*18.02)*100 | 89.9
vrednost: 0.50*64.10/0.80 | 40.1
vrednost: 5.00/84.32*44.01 | 2.61
>>

:::simboli
n | množina snovi | n = \dfrac{m}{M} | mol
m | masa | | g
M | molska masa | | g/mol
\nu | stehiometrijski koeficient | | – | število pred formulo v enačbi
\eta | izkoristek | \eta = \dfrac{m_\mathrm{dej}}{m_\mathrm{teor}} \cdot 100\,\% | \% | največ $100\,\%$
m_\mathrm{dej} | dejanska masa produkta | | g | kar res stehtaš
m_\mathrm{teor} | teoretična masa produkta | | g | iz omejitvenega reaktanta
w | čistost (masni delež snovi v vzorcu) | w = \dfrac{m_\mathrm{snovi}}{m_\mathrm{vzorca}} | – | med 0 in 1
m_\mathrm{snovi} | masa čiste snovi v vzorcu | | g
m_\mathrm{vzorca} | masa celotnega vzorca | | g
:::
