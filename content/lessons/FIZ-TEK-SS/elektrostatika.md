---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Pozimi prehodiš sobo v nogavicah po preprogi, primeš kljuko in te strese drobna iskra. V istem trenutku v tvojih živcih teče nekaj na videz povsem drugega: na notranji strani membrane živčne celice je malo več negativnega naboja kot zunaj, med obema stranema je napetost okoli $70\,\mathrm{mV}$. Ko se v membrani odprejo kanali, natrijevi ioni planejo v celico in po živcu steče signal.

Iskra je dolga milimeter, membrana je debela nekaj nanometrov. Obe pa skrivata isto idejo: **ločen naboj ustvari električno polje, polje deluje na naboje s silo, v polju je shranjena energija.** Iskra je trenutek, ko se polje v zraku sprazni. Membrana je drobcen kondenzator, ki ga celica ves čas polni. Na isti ideji delujeta defibrilator, ki srce požene z energijo iz kondenzatorja, in EKG, ki meri potencial na koži.

Tekmovalne naloge iz elektrostatike se skoraj vedno rešijo s tremi orodji: z vektorskim seštevanjem polj, s simetrijo in z ohranitvijo energije. Vsa tri spoznaš tukaj.

## Razlaga

**Najprej en račun.** Dve majhni kroglici nosita vsaka naboj $q = 50\,\mathrm{nC}$, njuni središči sta $r = 3\,\mathrm{cm}$ narazen. Meritve pokažejo, da je sila med njima sorazmerna z obema nabojema in obratno sorazmerna s kvadratom razdalje, tako kot gravitacija. Sorazmernostni koeficient je $k = 9{,}0 \cdot 10^9\,\mathrm{N\,m^2/C^2}$:

$$F = 9{,}0 \cdot 10^{9} \cdot \frac{(50 \cdot 10^{-9})^2}{0{,}03^2}\,\mathrm{N} = 0{,}025\,\mathrm{N}$$

Kroglica z maso $2\,\mathrm{g}$ ima težo le $0{,}020\,\mathrm{N}$. Električna sila med dvema drobcema naboja je torej večja od teže. Zato se lasje po česanju dvignejo.

**Coulombov zakon.** Za točkasta naboja $q_1$ in $q_2$ na razdalji $r$ velja:

$$F = k\,\frac{q_1 q_2}{r^2}$$

Enota naboja je coulomb ($\mathrm{C}$). Konstanto pišemo tudi kot $k = \frac{1}{4\pi\varepsilon_0}$, kjer je $\varepsilon_0 = 8{,}85 \cdot 10^{-12}\,\mathrm{A\,s/(V\,m)}$ influenčna konstanta. Istoimenska naboja se odbijata, raznoimenska privlačita. Sila leži na zveznici nabojev.

:::premisli
Naboja $+q$ in $+4q$ sta pritrjena na razdalji $d$. Kam med njiju postaviš tretji naboj, da nanj ne deluje nobena sila? Bliže kateremu in zakaj?
---
Bliže manjšemu. Sili sta enako veliki, ko velja enačba $\frac{kq}{x^2} = \frac{4kq}{(d-x)^2}$, kjer je $x$ razdalja od $+q$. Iz nje sledi enačba $d - x = 2x$, torej $x = \frac{d}{3}$. Štirikrat večji naboj mora biti dvakrat dlje, ker sila pada s kvadratom razdalje. Predznak tretjega naboja ni pomemben.
:::

**Električno polje.** Vrni se h kroglicama in deli silo na drugo kroglico z njenim nabojem: $\frac{0{,}025\,\mathrm{N}}{50 \cdot 10^{-9}\,\mathrm{C}} = 5{,}0 \cdot 10^{5}\,\mathrm{N/C}$. Ta količnik ni odvisen od druge kroglice. Pove, s kolikšno silo prva kroglica deluje na vsak coulomb naboja na tej razdalji. Imenujemo ga **jakost električnega polja**:

$$E = \frac{F}{q}$$

Za točkasti naboj $Q$ na razdalji $r$ je

$$E = k\,\frac{Q}{r^2}$$

Polje je vektor. Kaže v smeri sile na pozitiven naboj: stran od pozitivnega in proti negativnemu naboju. Če je nabojev več, njihova polja seštejemo kot vektorje; temu rečemo **superpozicija**. Polje rišemo s **silnicami**, črtami od pozitivnega k negativnemu naboju. Kjer so gostejše, je polje močnejše. Na sliki spodaj so silnice med dvema nabitima ploščama vzporedne in enako goste, zato je polje povsod enako; takemu polju rečemo **homogeno**. Črtkane črte in oznake $V$ razložimo v naslednjem odstavku.

:::risba skica
opis: Ploščati kondenzator. Leva plošča ima naboj +Q, desna −Q, razmik med njima je d. Med ploščama so štiri vzporedne vodoravne silnice s puščicami od leve proti desni, zato je polje E homogeno. Tri navpične črtkane črte so ekvipotencialne ploskve, pravokotne na silnice. Potencial pada od leve proti desni.
območje: 0; -0,8 .. 8; 5,4
enota: 36
črta: 2; 0,5 -> 2; 4,5 | debelo
črta: 6; 0,5 -> 6; 4,5 | debelo
puščica: 2; 1 -> 6; 1 | | | modra
puščica: 2; 2 -> 6; 2 | | | modra
puščica: 2; 3 -> 6; 3 | | | modra
puščica: 2; 4 -> 6; 4 | | | modra
črta: 3; 0,5 -> 3; 4,5 | siva črtkano
črta: 4; 0,5 -> 4; 4,5 | siva črtkano
črta: 5; 0,5 -> 5; 4,5 | siva črtkano
napis: 1,7; 2,5 | +Q | levo
napis: 6,3; 2,5 | −Q | desno
napis: 4,5; 3,5 | E | sredina
napis: 3; 4,6 | višji V | nad
napis: 5; 4,6 | nižji V | nad
črta: 2; -0,2 -> 6; -0,2 | siva
napis: 4; -0,2 | d | pod
:::

**Potencial in napetost.** Ko polje premakne naboj, opravi delo, tako kot teža pri padanju kamna. Delo polja na enoto naboja med točkama A in B je **napetost** $U$. Vsaki točki lahko pripišemo **potencial** $V$: delo na enoto naboja, ko polje naboj odnese iz te točke daleč stran, kjer je potencial nič. Napetost je razlika potencialov, $U = V_A - V_B$. Za točkasti naboj velja

$$V = k\,\frac{Q}{r}$$

Potencial ni vektor, temveč število s predznakom. Potenciale več nabojev zato samo seštejemo, kar je pogosto hitrejše od seštevanja polj.

Točke z enakim potencialom tvorijo **ekvipotencialne ploskve**. Te so povsod pravokotne na silnice, polje pa kaže proti nižjemu potencialu. Med ploščama na sliki je polje homogeno in velja

$$U = E\,d$$

Zato je enota $\mathrm{V/m}$ enaka $\mathrm{N/C}$. Ko naboj $q$ preleti napetost $U$, polje opravi delo $qU$, ki se pretvori v kinetično energijo. To je ohranitev energije, ki jo že poznaš iz mehanike.

V simulaciji spodaj »3D: Silnice in ekvipotencialne ploskve« pri dipolu opazuj ekvipotencialne ploskve: silnice jih povsod sekajo pod pravim kotom. Nato izberi dva enaka naboja in poišči točko, kjer polja ni: leži na sredini, čeprav potencial tam ni nič.

**Kondenzator.** Dve vzporedni plošči z nabojema $+Q$ in $-Q$ tvorita kondenzator. Napetost med ploščama je sorazmerna z nabojem, razmerje imenujemo **kapaciteta**:

$$C = \frac{Q}{U}$$

Enota je farad, $1\,\mathrm{F} = 1\,\mathrm{C/V}$. Za ploščati kondenzator s ploščino $S$ in razmikom $d$ velja

$$C = \frac{\varepsilon_r \varepsilon_0 S}{d}$$

kjer je $\varepsilon_r$ relativna dielektričnost snovi med ploščama (za zrak $1$). Celična membrana s ploščino $1\,\mathrm{cm^2}$, debelino $7\,\mathrm{nm}$ in $\varepsilon_r \approx 8$ ima kapaciteto okoli $1\,\mu\mathrm{F}$.

Energija v kondenzatorju je

$$W = \frac{1}{2}\,Q U$$

Polovica pride od tod, ker napetost med polnjenjem raste od $0$ do $U$: povprečno nosimo naboj čez napetost $\frac{U}{2}$. Ker je $Q = CU$, lahko pišemo tudi $W = \frac{1}{2} C U^2$.

:::premisli
Baterija z napetostjo $U$ napolni kondenzator do naboja $Q$. Pri tem odda energijo $QU$, kondenzator pa shrani le $\frac{1}{2}QU$. Kam gre druga polovica?
---
V toploto v žicah (in nekaj v sevanje). Baterija ves čas potiska naboj z napetostjo $U$, na kondenzatorju pa je napetost sprva manjša. Razlika se sprosti na uporu žic. Zanimivo: delež je vedno polovica, ne glede na upor žic.
:::

## Rešeni primeri

### Primer 1: polje v celični membrani

Membranski potencial živčne celice v mirovanju je $70\,\mathrm{mV}$, notranjost je negativna. Membrana je debela $7\,\mathrm{nm}$. Kolikšna je jakost polja v membrani, kolikšna sila deluje na ion $\mathrm{Na^+}$ v njej in koliko dela opravi polje, ko ion preide membrano od zunaj navznoter?

**Podatki:** $U = 70\,\mathrm{mV} = 0{,}070\,\mathrm{V}$, $d = 7\,\mathrm{nm} = 7 \cdot 10^{-9}\,\mathrm{m}$, naboj iona $e = 1{,}6 \cdot 10^{-19}\,\mathrm{C}$
**Iščemo:** jakost polja $E$, silo $F$, delo $W$

:::formula
$E = \dfrac{U}{d}$, $F = e E$, $W = e U$
:::

**Rešitev:**

1. Membrana je zelo tanka v primerjavi s celico, zato jo obravnavamo kot ploščati kondenzator s homogenim poljem: $E = \dfrac{0{,}070\,\mathrm{V}}{7 \cdot 10^{-9}\,\mathrm{m}} = 1{,}0 \cdot 10^{7}\,\mathrm{V/m}$.
2. Sila na ion: $F = 1{,}6 \cdot 10^{-19}\,\mathrm{C} \cdot 1{,}0 \cdot 10^{7}\,\mathrm{V/m} = 1{,}6 \cdot 10^{-12}\,\mathrm{N}$. Teža iona je okoli $4 \cdot 10^{12}$-krat manjša, zato jo zanemarimo.
3. Zunaj je potencial višji, polje kaže navznoter in pozitiven ion vleče v celico. Polje opravi pozitivno delo: $W = 1{,}6 \cdot 10^{-19}\,\mathrm{C} \cdot 0{,}070\,\mathrm{V} = 1{,}12 \cdot 10^{-20}\,\mathrm{J}$.
4. Odgovor: polje v membrani je $1{,}0 \cdot 10^{7}\,\mathrm{V/m}$, več kot trikrat močnejše od polja, pri katerem v suhem zraku preskoči iskra. Na ion deluje sila $1{,}6 \cdot 10^{-12}\,\mathrm{N}$, polje opravi delo $1{,}1 \cdot 10^{-20}\,\mathrm{J}$.

### Primer 2: defibrilator

Kondenzator defibrilatorja ima kapaciteto $150\,\mu\mathrm{F}$. Za šok potrebujemo $300\,\mathrm{J}$ energije. Na kolikšno napetost ga moramo napolniti in kolikšen naboj steče skozi prsni koš? Koliko energije bi shranil pri polovični napetosti?

**Podatki:** $C = 150\,\mu\mathrm{F} = 1{,}5 \cdot 10^{-4}\,\mathrm{F}$, $W = 300\,\mathrm{J}$
**Iščemo:** napetost $U$, naboj $Q$, energijo $W'$ pri napetosti $\frac{U}{2}$

:::formula
$W = \dfrac{1}{2} C U^2$, $Q = C U$
:::

**Rešitev:**

1. Iz formule za energijo izrazimo napetost: $U = \sqrt{\dfrac{2W}{C}}$.
2. Vstavimo: $$U = \sqrt{\frac{2 \cdot 300}{1{,}5 \cdot 10^{-4}}}\,\mathrm{V} = 2000\,\mathrm{V}$$
3. Naboj: $Q = 1{,}5 \cdot 10^{-4}\,\mathrm{F} \cdot 2000\,\mathrm{V} = 0{,}30\,\mathrm{C}$.
4. Energija je sorazmerna s kvadratom napetosti, zato je pri polovični napetosti štirikrat manjša: $W' = \frac{1}{2} \cdot 1{,}5 \cdot 10^{-4} \cdot 1000^2\,\mathrm{J} = 75\,\mathrm{J}$.
5. Odgovor: kondenzator napolnimo na $2000\,\mathrm{V}$, skozi prsni koš steče $0{,}30\,\mathrm{C}$. Pri $1000\,\mathrm{V}$ bi shranil le $75\,\mathrm{J}$.

### Primer 3: dva naboja in proton

Naboja po $+2\,\mathrm{nC}$ sta pritrjena v točkah $A$ in $B$, ki sta $8\,\mathrm{cm}$ narazen. Točka $P$ leži na simetrali daljice $AB$, $3\,\mathrm{cm}$ od njenega središča. Določi polje in potencial v točki $P$. Nato v $P$ iz mirovanja spustimo proton. Kolikšno hitrost ima, ko je daleč od nabojev?

:::risba skica
opis: Naboja +q v točkah A (levo) in B (desno), 8 cm narazen. Točka P je 3 cm nad sredino daljice AB. Od P sta do A in B črtkani daljici dolžine 5 cm. V P se začneta puščici polj obeh nabojev, ena kaže desno navzgor, druga levo navzgor, njuna vsota E kaže navpično navzgor.
območje: -5; -1 .. 5; 6
enota: 30
črta: -4; 0 -> 4; 0 | siva
črta: -4; 0 -> 0; 3 | siva črtkano
črta: 4; 0 -> 0; 3 | siva črtkano
črta: 0; 0 -> 0; 3 | siva
točka: -4; 0 | A (+q) | pod
točka: 4; 0 | B (+q) | pod
točka: 0; 3 | P | levo
puščica: 0; 3 -> 1,6; 4,2 | E_A | desno | oranžna
puščica: 0; 3 -> -1,6; 4,2 | E_B | levo | oranžna
puščica: 0; 3 -> 0; 5,4 | E | nad | modra debelo
napis: -2; 0 | 4 cm | pod
napis: 0; 1,5 | 3 cm | desno
:::

**Podatki:** $q = 2\,\mathrm{nC} = 2 \cdot 10^{-9}\,\mathrm{C}$, $AB = 8\,\mathrm{cm}$, $h = 3\,\mathrm{cm}$, $e = 1{,}6 \cdot 10^{-19}\,\mathrm{C}$, $m_p = 1{,}67 \cdot 10^{-27}\,\mathrm{kg}$, $k = 9{,}0 \cdot 10^9\,\mathrm{N\,m^2/C^2}$
**Iščemo:** polje $E$ in potencial $V$ v točki $P$, končno hitrost protona $v$

:::formula
$E_1 = k\dfrac{q}{r^2}$, $V = k\dfrac{q}{r_A} + k\dfrac{q}{r_B}$, $e V = \dfrac{1}{2} m_p v^2$
:::

**Rešitev:**

1. Razdalja od vsakega naboja do $P$ (Pitagorov izrek): $r = \sqrt{4^2 + 3^2}\,\mathrm{cm} = 5\,\mathrm{cm}$.
2. Polje enega naboja: $$E_1 = 9{,}0 \cdot 10^{9} \cdot \frac{2 \cdot 10^{-9}}{0{,}05^2}\,\mathrm{V/m} = 7{,}2 \cdot 10^{3}\,\mathrm{V/m}$$
3. Zaradi simetrije se vodoravni komponenti odštejeta, navpični se seštejeta. Navpični delež je $\frac{h}{r} = \frac{3}{5}$: $$E = 2 \cdot 7{,}2 \cdot 10^{3} \cdot \frac{3}{5}\,\mathrm{V/m} = 8{,}64 \cdot 10^{3}\,\mathrm{V/m}$$ Polje kaže po simetrali stran od daljice $AB$.
4. Potencial je število, zato ga seštejemo brez kotov: $$V = 2 \cdot 9{,}0 \cdot 10^{9} \cdot \frac{2 \cdot 10^{-9}}{0{,}05}\,\mathrm{V} = 720\,\mathrm{V}$$
5. Daleč stran je potencial nič, zato se vsa električna potencialna energija protona pretvori v kinetično: $W = 1{,}6 \cdot 10^{-19} \cdot 720\,\mathrm{J} = 1{,}15 \cdot 10^{-16}\,\mathrm{J}$.
6. Zdaj ti: iz $\frac{1}{2} m_p v^2 = W$ izračunaj hitrost.

:::premisli
Kolikšna je hitrost protona daleč od nabojev?
---
$v = \sqrt{\dfrac{2W}{m_p}} = \sqrt{\dfrac{2 \cdot 1{,}15 \cdot 10^{-16}}{1{,}67 \cdot 10^{-27}}}\,\mathrm{m/s} \approx 3{,}7 \cdot 10^{5}\,\mathrm{m/s}$. Pot protona ni pomembna: energija je odvisna le od začetnega in končnega potenciala.
:::

## Pogoste napake

- **Polja seštevaš kot števila.** V Primeru 3 bi tako dobil $1{,}44 \cdot 10^{4}\,\mathrm{V/m}$ namesto $8{,}64 \cdot 10^{3}\,\mathrm{V/m}$. Polje je vektor: razstavi ga na komponente in uporabi simetrijo. Potencial pa je število in ga seštevaš s predznaki.
- **»Kjer je potencial nič, ni polja.«** Na sredini med $+q$ in $-q$ je $V = 0$, polje pa je usmerjeno proti $-q$ in ni nič. Na sredini med dvema enakima nabojema je obratno: $E = 0$, $V \neq 0$. Polje pove, kako hitro se potencial spreminja, ne koliko znaša.
- **Energija kondenzatorja je $QU$.** Ne: kondenzator shrani $\frac{1}{2}QU$, ker je napetost med polnjenjem rasla od nič. Naboj, ki preleti stalno napetost $U$, pa dobi celo energijo $qU$, brez polovice.
- **Napetost kondenzatorja je vedno stalna.** Velja le, dokler je priklopljen na vir. Odklopljen kondenzator ohrani naboj: če plošči razmakneš, se $C$ zmanjša in $U$ poveča.
- **Delitev naboja brez predznakov.** Enaki kovinski kroglici si ob dotiku razdelita **vsoto** nabojev s predznaki: $+6\,\mathrm{nC}$ in $-2\,\mathrm{nC}$ dasta vsaki $+2\,\mathrm{nC}$, ne $+4\,\mathrm{nC}$.

## Povzetek

- Coulombov zakon: $F = k\frac{q_1 q_2}{r^2}$, $k = 9{,}0 \cdot 10^9\,\mathrm{N\,m^2/C^2}$; istoimenska naboja se odbijata.
- Jakost polja $E = \frac{F}{q}$, za točkasti naboj $E = k\frac{Q}{r^2}$. Polja seštevamo kot vektorje; pomagaj si s simetrijo.
- Potencial točkastega naboja $V = k\frac{Q}{r}$ je število s predznakom; napetost je razlika potencialov. V homogenem polju $U = Ed$.
- Ekvipotencialne ploskve so pravokotne na silnice; polje kaže proti nižjemu potencialu.
- Naboj, ki preleti napetost $U$, pridobi energijo $qU$ (ohranitev energije, pot ni pomembna).
- Kondenzator: $C = \frac{Q}{U}$, ploščati $C = \frac{\varepsilon_r \varepsilon_0 S}{d}$, energija $W = \frac{1}{2} Q U = \frac{1}{2} C U^2$.
- Odklopljen kondenzator ohrani naboj, priklopljen na vir ohrani napetost.

## Drugače: Z analogijo

Elektrostatika je skoraj prepis gravitacije, ki jo že znaš. Gravitacijskemu pospešku $g$ ustreza jakost polja $E$:

| gravitacija | elektrostatika |
|---|---|
| $F = G\frac{m_1 m_2}{r^2}$ | $F = k\frac{q_1 q_2}{r^2}$ |
| $g = \frac{F}{m}$ | $E = \frac{F}{q}$ |
| energija $mgh$ | energija $qV$ |
| homogeno ob tleh | homogeno v kondenzatorju |

Kamen, ki pade z višine, pridobi kinetično energijo ne glede na pot. Enako proton, ki »pade« z višjega na nižji potencial. Ekvipotencialne ploskve so kot plastnice na zemljevidu, silnice kot smer najbolj strmega spusta.

Analogija ima dve meji. Masa je vedno pozitivna, naboj ima dva predznaka, zato se naboji tudi odbijajo. In električna sila je ogromno močnejša: med dvema protonoma je okoli $10^{36}$-krat večja od gravitacijske.

## Drugače: Bolj natančno

Na tekmovanjih pogosto pomagajo trije natančnejši rezultati.

- **Polje velike plošče.** Plošča z nabojem $Q$ na ploščini $S$ ustvari na vsaki strani polje $\frac{Q}{2\varepsilon_0 S}$. Med ploščama kondenzatorja se polji obeh plošč seštejeta v $\frac{Q}{\varepsilon_0 S}$, zunaj se odštejeta v nič. Iz $U = Ed$ potem sledi $C = \frac{\varepsilon_0 S}{d}$.
- **Prevodnik v ravnovesju.** V notranjosti kovine je polje nič, sicer bi se elektroni še premikali. Ves presežni naboj je na površini, celoten prevodnik ima isti potencial. Kovinska krogla s polmerom $R$ ima potencial $k\frac{Q}{R}$, kot da bi bil ves naboj v središču.
- **Vezave kondenzatorjev.** Pri vzporedni vezavi imajo kondenzatorji isto napetost, zato je skupna kapaciteta vsota $C_1 + C_2$. Pri zaporedni vezavi imajo isti naboj, napetosti se seštejejo, zato se seštejejo obratne vrednosti: $\frac{1}{C} = \frac{1}{C_1} + \frac{1}{C_2}$.

## Preveri se

? Zdravnik pove, da je med notranjostjo in zunanjostjo živčne celice $70\,\mathrm{mV}$. Kaj pove ta podatek?
- Kolikšna sila deluje na ion v membrani.
~ Sila je odvisna še od debeline membrane in naboja iona ($F = eU/d$). Napetost sama ni sila.
+ Koliko dela opravi polje na vsak coulomb naboja, ki preide membrano.
- Koliko naboja je nakopičenega na membrani.
~ Naboj meriš v coulombih. Naboj in napetost povezuje kapaciteta: $Q = CU$.
> Napetost je razlika potencialov, torej delo električne sile na enoto naboja: $U = \frac{W}{q}$.

? Na sliki je točkasti naboj $+Q$ v izhodišču, stranica kvadratka je $1\,\mathrm{cm}$. Razvrsti točke od največje do najmanjše jakosti polja.
:::risba skica
opis: Kvadratna mreža s stranico kvadratka 1 cm. Naboj +Q je v izhodišču. Točka C je 1 cm levo od naboja, točka A 2 cm desno, točka B 3 cm nad nabojem, točka D 3 cm desno in 3 cm nad nabojem.
območje: -2; -1 .. 4; 4
enota: 36
mreža: da
točka: 0; 0 | +Q | pod | rdeča
točka: -1; 0 | C | nad
točka: 2; 0 | A | nad
točka: 0; 3 | B | desno
točka: 3; 3 | D | desno
:::
1. točka C
2. točka A
3. točka B
4. točka D
> Polje pada s kvadratom razdalje, $E = k\frac{Q}{r^2}$. Razdalje so $1\,\mathrm{cm}$ (C), $2\,\mathrm{cm}$ (A), $3\,\mathrm{cm}$ (B) in $\sqrt{3^2 + 3^2} \approx 4{,}2\,\mathrm{cm}$ (D). Smer od naboja ni pomembna.

? Ploščati kondenzator napolnimo in ga odklopimo od vira. Kaj se zgodi z napetostjo med ploščama, če razmik plošč podvojimo?
- Ostane enaka.
~ Napetost ostane stalna le, dokler je kondenzator priklopljen na vir. Odklopljen ohrani naboj.
- Se razpolovi.
~ Razpolovi se kapaciteta, ne napetost. Ker je $U = \frac{Q}{C}$, manjša kapaciteta pomeni večjo napetost.
+ Se podvoji.
> Naboj ostane enak, $C = \frac{\varepsilon_0 S}{d}$ se razpolovi, zato se $U = \frac{Q}{C}$ podvoji. Polje $E = \frac{U}{d}$ ostane enako.

? Enaki kovinski kroglici z nabojema $+6\,\mathrm{nC}$ in $-2\,\mathrm{nC}$ sta $3\,\mathrm{cm}$ narazen. Dotaknemo ju in vrnemo na isto razdaljo. Kolikšna je zdaj sila med njima v mikronewtonih?
= 40 µN | 1
~ 120 | To je sila pred dotikom: $k \cdot 6 \cdot 2 \cdot 10^{-18}/0{,}03^2$. Po dotiku sta naboja drugačna.
~ 160 | Naboj si razdelita s predznaki: $(+6 - 2)/2 = +2\,\mathrm{nC}$, ne $(6 + 2)/2 = 4\,\mathrm{nC}$.
> Vsaka ima $+2\,\mathrm{nC}$, zato se odbijata: $F = 9{,}0 \cdot 10^9 \cdot \frac{(2 \cdot 10^{-9})^2}{0{,}03^2}\,\mathrm{N} = 4{,}0 \cdot 10^{-5}\,\mathrm{N} = 40\,\mu\mathrm{N}$. Prej sta se privlačili s $120\,\mu\mathrm{N}$.

? V rentgenski cevi elektron pospeši napetost $30\,\mathrm{kV}$. Koliko kinetične energije pridobi?
- $4{,}8 \cdot 10^{-18}\,\mathrm{J}$
~ Napetost si vstavil v kilovoltih. $30\,\mathrm{kV} = 30\,000\,\mathrm{V}$.
- $2{,}4 \cdot 10^{-15}\,\mathrm{J}$
~ Polovica velja za energijo kondenzatorja. Elektron preleti ves čas isto napetost, zato dobi celo $eU$.
+ $4{,}8 \cdot 10^{-15}\,\mathrm{J}$
> $W = eU = 1{,}6 \cdot 10^{-19}\,\mathrm{C} \cdot 30\,000\,\mathrm{V} = 4{,}8 \cdot 10^{-15}\,\mathrm{J}$.

<<RACUN
vrednost: 9*10^9*(50*10^-9)^2/0.03^2 | 0.025
vrednost: 9*10^9*50*10^-9/0.03^2 | 500000
resi: 1-x=2*x | x | 1/3
vrednost: 8*8.85*10^-12*10^-4/(7*10^-9) | 1.01*10^-6
vrednost: 70/7*10^6 | 1.0*10^7
vrednost: 1.6*10^-19*10^7 | 1.6*10^-12
vrednost: 1.6*10^-19*0.07 | 1.12*10^-20
vrednost: sqrt(2*300/(1.5*10^-4)) | 2000
vrednost: 1.5*10^-4*2000 | 0.3
vrednost: 0.5*1.5*10^-4*1000^2 | 75
vrednost: 9*10^9*2*10^-9/0.05^2 | 7200
vrednost: 2*7200*3/5 | 8640
vrednost: 2*9*10^9*2*10^-9/0.05 | 720
vrednost: 1.6*10^-19*720 | 1.152*10^-16
vrednost: sqrt(2*1.152*10^-16/(1.67*10^-27)) | 3.71*10^5
vrednost: 9*10^9*(2*10^-9)^2/0.03^2 | 4*10^-5
vrednost: 9*10^9*6*2*10^-18/0.03^2 | 1.2*10^-4
vrednost: 9*10^9*(4*10^-9)^2/0.03^2 | 1.6*10^-4
vrednost: 2*7200 | 14400
vrednost: 1.6*10^-19*30 | 4.8*10^-18
vrednost: 1.6*10^-19*30000 | 4.8*10^-15
>>

:::simboli
F | električna sila | F = k\frac{q_1 q_2}{r^2} | N
k | konstanta v Coulombovem zakonu | k = \frac{1}{4\pi\varepsilon_0} | N\,m^2/C^2 | $9{,}0 \cdot 10^9$
q_1, q_2 | naboja | | C
q | naboj (preizkusni naboj, naboj kroglice) | | C
r | razdalja med nabojema oziroma od naboja | | m
E | jakost električnega polja | E = \frac{F}{q} | V/m | enako N/C
E_1 | jakost polja enega naboja | E_1 = k\frac{q}{r^2} | V/m
Q | naboj (izvor polja, naboj na plošči) | Q = C U | C
V | električni potencial | V = k\frac{Q}{r} | V | nič daleč od nabojev
U | napetost (razlika potencialov) | U = E d | V | $U = Ed$ velja v homogenem polju
d | razmik plošč, debelina membrane; v prvem premisleku razdalja med pritrjenima nabojema | | m
W | energija kondenzatorja oziroma delo polja na naboj | W = \frac{1}{2} Q U | J | polovica velja le za kondenzator; naboj, ki preleti napetost $U$, dobi $qU$
C | kapaciteta | C = \frac{Q}{U} | F
\varepsilon_0 | influenčna konstanta | | A\,s/(V\,m) | $8{,}85 \cdot 10^{-12}$
\varepsilon_r | relativna dielektričnost | | – | za zrak 1
S | ploščina plošče | | m^2
e | osnovni naboj (naboj iona, protona) | | C | $1{,}6 \cdot 10^{-19}$
r_A, r_B | razdalji točke od nabojev v A in B | | m
m_p | masa protona | | kg | $1{,}67 \cdot 10^{-27}$
v | hitrost protona | v = \sqrt{\frac{2W}{m_p}} | m/s
:::
