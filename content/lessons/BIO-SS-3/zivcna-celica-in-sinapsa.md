---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Med zabijanjem žeblja se s kladivom udariš po palcu. Najprej v trenutku začutiš udarec. Šele kakšno sekundo pozneje pride topa, pekoča bolečina. Zakaj dvakrat?

Od palca do hrbtenjače je okoli $1\,\mathrm{m}$. Debela živčna vlakna za dotik prevajajo s hitrostjo okoli $50\,\mathrm{m/s}$, tanka vlakna za topo bolečino le okoli $1\,\mathrm{m/s}$. Prvi signal prispe po $0{,}02\,\mathrm{s}$, drugi po približno $1\,\mathrm{s}$. Razlika ni v dražljaju, ampak v zgradbi vlaken.

V prejšnji lekciji so sporočila potovala s hormoni po krvi, v sekundah do minutah. Živčni sistem je hitrejši in natančnejši: signal gre po »žici« do točno določene celice. Ko razumeš, kako, razumeš tudi, kako delujejo kava, alkohol, nikotin in nekatera zdravila.

## Razlaga

**1. Zgradba nevrona.** Živčna celica ali **nevron** ima tri dele:

- **telo** z jedrom, kjer nastaja večina beljakovin;
- **dendrite**, kratke razvejane izrastke, ki sprejemajo signale od drugih celic;
- **akson** (nevrit), en dolg izrastek, ki signal odvaja stran od telesa. Na koncu se razveji v **aksonske končiče**.

Pot signala: dendrit → telo → akson → končič → naslednja celica. Akson v nogi je lahko dolg skoraj meter. Akson skupaj z ovojnico okoli njega imenujemo **živčno vlakno**.

*Preveri:* kateri del nevrona signal oddaja naprej? *(Aksonski končič.)*

**2. Mirovni potencial.** Membrana nevrona loči dve raztopini z različno koncentracijo ionov. Zunaj je več natrijevih ionov ($\mathrm{Na^+}$), znotraj več kalijevih ($\mathrm{K^+}$). To razliko vzdržuje **natrijevo-kalijeva črpalka**: z energijo iz ATP izčrpa $3$ $\mathrm{Na^+}$ ven in $2$ $\mathrm{K^+}$ noter. V membrani so tudi **kanali**, beljakovinske pore za posamezne ione. Skozi odprte kanale $\mathrm{K^+}$ uhaja ven in odnaša pozitivni naboj, zato ostane notranjost negativna.

Napetost med notranjostjo in zunanjostjo mirujoče celice je **mirovni potencial**, okoli $-70\,\mathrm{mV}$. Celica je kot napeta vzmet v mizarski spenjalki: miruje, a je pripravljena sprožiti.

*Preveri:* ali mirujoči nevron porablja energijo? *(Da. Črpalka ves čas porablja ATP.)*

**3. Akcijski potencial.** Ko dražljaj dvigne potencial do **praga** (okoli $-55\,\mathrm{mV}$), se zgodi hitro zaporedje, ki traja okoli $1$ do $2\,\mathrm{ms}$:

:::risba graf
opis: Shema akcijskega potenciala: napetost membrane v milivoltih v odvisnosti od časa. Iz mirovanja pri −70 mV se potencial dvigne do praga −55 mV, nato strmo do vrha pri +30 mV, pade pod mirovni potencial do okoli −80 mV in se vrne na −70 mV. Od praga do vrnitve mine okoli 2 ms.
x: 0 .. 3 | 1 | t [ms]
y: -90 .. 40 | 10 | U [mV]
višina: 240
oznake: ne
mreža: ne
oznakax: 1 | 1
oznakax: 2 | 2
oznakax: 3 | 3
oznakay: 30 | +30
oznakay: 0 | 0
oznakay: -55 | −55
oznakay: -70 | −70
oznakay: -80 | −80
črta: 0; -55 -> 3; -55 | siva črtkano
napis: 3; -55 | prag | nad levo | siva
črta: 0; -70 -> 0,5; -55 -> 1; 30 -> 1,6; -80 -> 2,4; -70 -> 3; -70 | modra debelo
točka: 1; 30 | vrh | desno
točka: 0,5; -55 | | | siva
točka: 1,6; -80 | | | oranžna
točka: 2,4; -70 | mir | nad desno
podnapis: Čas t v milisekundah, napetost U v milivoltih.
:::

1. **Depolarizacija:** odprejo se kanali za $\mathrm{Na^+}$. Natrij vdre v celico, notranjost postane pozitivna, do okoli $+30\,\mathrm{mV}$.
2. **Repolarizacija:** kanali za $\mathrm{Na^+}$ se zaprejo, odprejo se kanali za $\mathrm{K^+}$. Kalij izstopi, potencial pade.
3. Potencial za hip pade pod mirovnega (okoli $-80\,\mathrm{mV}$), nato se vrne na $-70\,\mathrm{mV}$.

Akcijski potencial deluje po načelu **vse ali nič**. Če dražljaj ne doseže praga, ga ni. Če ga doseže, je vedno enako velik.

:::premisli
Žebelj zabiješ enkrat rahlo in enkrat močno, vsakič po isti točki. Napovej: je akcijski potencial v vlaknu za dotik pri močnem udarcu višji? Kako potem možgani vedo, da je bil udarec močnejši?
---
Ni višji, ker velja »vse ali nič«. Pri močnejšem dražljaju nevron proži več akcijskih potencialov v sekundi (večja frekvenca), vzburijo pa se tudi sosednji nevroni. Moč je zapisana v pogostosti signalov, ne v njihovi velikosti.
:::

**4. Širjenje in mielin.** Akcijski potencial na enem mestu depolarizira sosednji del membrane, ta naslednjega in tako naprej. Ioni ne potujejo po aksonu od začetka do konca; potuje *val odpiranja kanalov*. Nazaj se val ne vrne, ker so kanali za sabo za trenutek neodzivni.

Mnoge aksone ovija **mielinska ovojnica**. Zunaj možganov in hrbtenjače jo tvorijo **Schwannove celice**, ki se večkrat ovijejo okoli aksona, kot izolacijski trak okoli žice. Med njimi so kratke gole vrzeli, **Ranvierjevi zažemki**. Signal skače od zažemka do zažemka (**skokovito prevajanje**), zato je mielinizirano vlakno do stokrat hitrejše:

| Vlakno | Hitrost | Primer |
|---|---|---|
| tanko, brez mielina | $0{,}5$ do $2\,\mathrm{m/s}$ | topa bolečina |
| debelo, z mielinom | $50$ do $120\,\mathrm{m/s}$ | dotik, ukaz mišici |

:::premisli
Pri multipli sklerozi imunski sistem napada mielinsko ovojnico. Napovej, kaj se zgodi s signali do mišic in zakaj.
---
Signali postanejo počasnejši ali se na poškodovanih mestih izgubijo, ker brez izolacije ne morejo več skakati od zažemka do zažemka. Bolnik ima zato težave s premikanjem, ravnotežjem in vidom.
:::

*Preveri:* kje na mieliniziranem aksonu sploh nastane akcijski potencial? *(Le na Ranvierjevih zažemkih, kjer je membrana gola.)*

**5. Kemična sinapsa.** Med aksonskim končičem in naslednjo celico je ozka **sinaptična špranja**, široka okoli $20\,\mathrm{nm}$. Električni signal je ne preskoči. Prenos poteka kemično:

1. Akcijski potencial pride do končiča. Odprejo se kanali za kalcijeve ione ($\mathrm{Ca^{2+}}$), ki vstopijo.
2. Mešički (vezikli) z **živčnim prenašalcem** (npr. acetilholin, dopamin, serotonin) se zlijejo z membrano in ga izlijejo v špranjo.
3. Prenašalec difundira čez špranjo in se veže na **receptorje** na membrani naslednje celice (**postsinaptična membrana**).
4. Odprejo se kanali; v naslednji celici nastane nov potencial. Če doseže prag, se sproži akcijski potencial.
5. Encim prenašalec razgradi (acetilholin razgradi acetilholinesteraza) ali ga končič privzame nazaj. Sinapsa je spet pripravljena.

Ta pot traja okoli $0{,}5\,\mathrm{ms}$ in gre le v eno smer: mešički so samo v končiču, receptorji samo na drugi strani.

*Preveri:* kaj sproži izlitje prenašalca? *(Vstop $\mathrm{Ca^{2+}}$ v končič.)*

**6. Psihoaktivne snovi.** Snovi, ki spremenijo delovanje možganov, skoraj vedno delujejo na sinapse. Posnemajo prenašalec, zasedejo receptor ali preprečijo, da bi prenašalec odstranili:

- **kofein** zasede receptorje za adenozin, ki sicer povzroča zaspanost, zato smo bolj budni;
- **nikotin** se veže na nekatere receptorje za acetilholin in jih vzburi;
- **alkohol** med drugim okrepi zaviralni prenašalec GABA, zato se odzivi upočasnijo;
- **kokain** prepreči privzem dopamina nazaj, zato ga je v špranji preveč.

Pri ponavljanju se možgani prilagodijo, npr. z manj receptorji. Za enak učinek je potrebno več snovi (**toleranca**), brez nje pa se pojavijo neprijetni odtegnitveni znaki, ki kažejo na **odvisnost**.

Simulacija »Akcijski potencial in sinapsa« spodaj ti dogodke pomeša. Postavi jih v pravo zaporedje in ob vsakem koraku ugotovi, kateri ioni gredo v celico in kateri iz nje.

## Rešeni primeri

### Primer 1 (lažji): kako hitro do hrbtenjače

Tesar se s prstom dotakne ostrega žeblja. Signal za dotik potuje $0{,}9\,\mathrm{m}$ do hrbtenjače po mieliniziranem vlaknu s hitrostjo $60\,\mathrm{m/s}$. Koliko časa potrebuje?

**Podatki:** $s = 0{,}9\,\mathrm{m}$, $v = 60\,\mathrm{m/s}$
**Iščemo:** čas $t$

:::formula
$t = \dfrac{s}{v}$
:::

**Rešitev:**

1. Signal potuje s stalno hitrostjo, zato delimo pot s hitrostjo: $t = \dfrac{0{,}9\,\mathrm{m}}{60\,\mathrm{m/s}} = 0{,}015\,\mathrm{s}$.
2. V milisekundah: $0{,}015\,\mathrm{s} = 15\,\mathrm{ms}$.
3. Odgovor: signal pride do hrbtenjače v $15\,\mathrm{ms}$, hitreje kot en mežik.

### Primer 2: spremembe potenciala

Med akcijskim potencialom se potencial nevrona dvigne z $-70\,\mathrm{mV}$ na $+30\,\mathrm{mV}$, nato pade na $-80\,\mathrm{mV}$. Za koliko se dvigne? Za koliko je najnižja vrednost pod mirovnim potencialom? Kateri ioni povzročijo dvig?

**Podatki:** $U_{\mathrm{mir}} = -70\,\mathrm{mV}$, $U_{\mathrm{vrh}} = +30\,\mathrm{mV}$, $U_{\mathrm{min}} = -80\,\mathrm{mV}$
**Iščemo:** dvig $\Delta U_1$, razliko $\Delta U_2$ in ione

:::formula
$\Delta U = U_{\mathrm{končna}} - U_{\mathrm{začetna}}$
:::

**Rešitev:**

1. Dvig: $30 - (-70) = 100$, torej $\Delta U_1 = 100\,\mathrm{mV}$. Pri odštevanju negativnega števila prištejemo.
2. Najnižja točka glede na mir: $-80 - (-70) = -10$, torej $\Delta U_2 = -10\,\mathrm{mV}$.
3. Dvig povzroči vdor $\mathrm{Na^+}$ v celico, ker je zunaj natrija več.
4. Odgovor: potencial se dvigne za $100\,\mathrm{mV}$ zaradi vstopa $\mathrm{Na^+}$; najnižja vrednost je $10\,\mathrm{mV}$ pod mirovnim potencialom.

### Primer 3 (težji): katero vlakno je to?

Zdravnica z elektrodama izmeri, da signal v živcu noge prepotuje $1{,}2\,\mathrm{m}$ v $24\,\mathrm{ms}$. Ali je vlakno mielinizirano?

**Podatki:** $s = 1{,}2\,\mathrm{m}$, $t = 24\,\mathrm{ms}$; vlakna brez mielina: do okoli $2\,\mathrm{m/s}$, z mielinom: $50$ do $120\,\mathrm{m/s}$
**Iščemo:** hitrost $v$ in vrsto vlakna

:::formula
$v = \dfrac{s}{t}$
:::

**Rešitev:**

1. Pretvorimo čas, ker je hitrost v $\mathrm{m/s}$: $24\,\mathrm{ms} = 0{,}024\,\mathrm{s}$.
2. Hitrost: $v = \dfrac{1{,}2\,\mathrm{m}}{0{,}024\,\mathrm{s}} = 50\,\mathrm{m/s}$.
3. Primerjamo s tabelo: $50\,\mathrm{m/s}$ je daleč nad $2\,\mathrm{m/s}$.
4. Odgovor: signal potuje s $50\,\mathrm{m/s}$, zato je vlakno mielinizirano.

### Primer 4: zdaj ti

Rokodelka se s prstom dotakne vročega spajkalnika in roko refleksno umakne. Signal gre $0{,}7\,\mathrm{m}$ do hrbtenjače in $0{,}7\,\mathrm{m}$ nazaj do mišic, obakrat s hitrostjo $70\,\mathrm{m/s}$. Na poti prečka $2$ sinapsi, vsaka zadrži signal za $0{,}5\,\mathrm{ms}$. Koliko časa mine od dotika do ukaza mišici?

**Podatki:** $s = 0{,}7\,\mathrm{m} + 0{,}7\,\mathrm{m}$, $v = 70\,\mathrm{m/s}$, $2$ sinapsi po $0{,}5\,\mathrm{ms}$
**Iščemo:** skupni čas $t$

:::formula
$t = \dfrac{s}{v} + 2 \cdot t_{\mathrm{sinapsa}}$
:::

**Rešitev:**

1. Skupna pot: $0{,}7 + 0{,}7 = 1{,}4$, torej $1{,}4\,\mathrm{m}$.
2. Prevajanje: $\dfrac{1{,}4\,\mathrm{m}}{70\,\mathrm{m/s}} = 0{,}02\,\mathrm{s} = 20\,\mathrm{ms}$.
3. Dodaj sinapse sam, nato preveri:

:::premisli
Koliko časa zadržita sinapsi in koliko je skupni čas?
---
Sinapsi: $2 \cdot 0{,}5\,\mathrm{ms} = 1\,\mathrm{ms}$. Skupaj: $20\,\mathrm{ms} + 1\,\mathrm{ms} = 21\,\mathrm{ms}$. Refleks je tako hiter, ker gre le skozi hrbtenjačo, ne skozi možgane.
:::

## Pogoste napake

Te zamenjave se pojavijo skoraj v vsakem razredu:

- **»Močnejši dražljaj da večji akcijski potencial.«** Velja vse ali nič: vrh je vedno okoli $+30\,\mathrm{mV}$. Moč dražljaja nevron zapiše s pogostostjo akcijskih potencialov.
- **»Ioni tečejo po aksonu kot elektroni po žici.«** Ioni se premikajo le skozi membrano, na mestu. Po aksonu potuje val odpiranja kanalov, ki vsak naslednji del membrane depolarizira.
- **»Mirujoči nevron ne dela ničesar.«** Natrijevo-kalijeva črpalka ves čas porablja ATP. Možgani zato porabijo okoli petino energije telesa, tudi med spanjem.
- **»Na sinapsi signal preskoči kot iskra.«** Na kemični sinapsi prenašalec difundira čez špranjo. Zato je tu zamuda in zato gre signal le v eno smer.
- **»Droge v možgane prinesejo nekaj čisto novega.«** Večina psihoaktivnih snovi posnema ali blokira snovi, ki jih telo že ima, ali spremeni njihovo odstranjevanje.

## Povzetek

- Nevron: dendriti sprejemajo, telo obdela, akson odvaja signal do aksonskih končičev.
- Mirovni potencial okoli $-70\,\mathrm{mV}$ vzdržuje natrijevo-kalijeva črpalka (porablja ATP); zunaj več $\mathrm{Na^+}$, znotraj več $\mathrm{K^+}$.
- Akcijski potencial: prag okoli $-55\,\mathrm{mV}$, vdor $\mathrm{Na^+}$ (depolarizacija do $+30\,\mathrm{mV}$), izstop $\mathrm{K^+}$ (repolarizacija). Vse ali nič.
- Mielin (Schwannove celice) izolira akson; signal skače med Ranvierjevimi zažemki, do stokrat hitreje.
- Kemična sinapsa: $\mathrm{Ca^{2+}}$ sproži izlitje prenašalca, ta se veže na receptorje naslednje celice; prenos v eno smer, z zamudo.
- Psihoaktivne snovi delujejo na sinapse: posnemajo prenašalce, zasedejo receptorje ali zavirajo njihovo odstranjevanje.

## Drugače: Na sliki

Mieliniziran akson si predstavljaj kot podaljšek, ovit z izolirnim trakom, ki ima vsakih nekaj centimetrov goli košček žice:

```
telo ──[▓▓▓▓]─│─[▓▓▓▓]─│─[▓▓▓▓]─│─ končič
          ↑   ↑
     Schwannova  Ranvierjev zažemek
       celica    (gol del)

signal:  ●──────▶●──────▶●──────▶●
         skače od zažemka do zažemka
```

Pod trakom se kanali ne odpirajo. Akcijski potencial nastane le na golih koščkih, zato jih signal preskakuje.

Sinapsa pa je kot dva gradbena odra z režo vmes. Delavec na prvem odru ne more čez, zato čez režo vrže listke z naročilom (prenašalec). Na drugem odru jih ujamejo le delavci z rokavicami (receptorji) in začnejo delati. Listke nato nekdo pospravi (encim), da naročilo ne velja v nedogled.

## Drugače: Bolj natančno

Zakaj ravno $-70\,\mathrm{mV}$? Vsak ion »teži« k svojemu ravnovesnemu potencialu, pri katerem se difuzija in električna sila izravnata. Za $\mathrm{K^+}$ je to okoli $-90\,\mathrm{mV}$, za $\mathrm{Na^+}$ okoli $+60\,\mathrm{mV}$. Mirujoča membrana prepušča veliko več $\mathrm{K^+}$ kot $\mathrm{Na^+}$, zato je mirovni potencial blizu kalijevega, a ne čisto na njem.

V možganih in hrbtenjači mielin namesto Schwannovih celic tvorijo **oligodendrociti**; prav te ovojnice napada multipla skleroza.

Kanali za akcijski potencial so **napetostno odvisni**: odprejo se, ko se spremeni napetost. Kanali na postsinaptični membrani so **ligandno odvisni**: odpre jih vezava prenašalca.

Po akcijskem potencialu je del membrane kratek čas **refraktaren**: kanali za $\mathrm{Na^+}$ so inaktivirani in se ne morejo takoj znova odpreti. Zato signal ne gre nazaj in nevron ne more prožiti neskončno pogosto.

Sinapse so lahko **vzburjevalne** (potencial premaknejo proti pragu) ali **zaviralne** (npr. GABA ga premakne stran od praga). Nevron sešteva vse signale, ki pridejo hkrati od tisočih sinaps. Akcijski potencial sproži le, če vsota doseže prag.

## Preveri se

? Katero zaporedje vrednosti membranskega potenciala ustreza enemu akcijskemu potencialu?
- $-70\,\mathrm{mV} \to -120\,\mathrm{mV} \to -70\,\mathrm{mV}$
~ Akcijski potencial je dvig potenciala, ker $\mathrm{Na^+}$ vdre v celico, ne padec.
+ $-70\,\mathrm{mV} \to +30\,\mathrm{mV} \to -80\,\mathrm{mV} \to -70\,\mathrm{mV}$
- $+70\,\mathrm{mV} \to -30\,\mathrm{mV} \to +70\,\mathrm{mV}$
~ Notranjost mirujoče celice je negativna, ne pozitivna. Predznaki so obrnjeni.
> Iz mirovnega potenciala se ob vdoru $\mathrm{Na^+}$ dvigne do $+30\,\mathrm{mV}$, ob izstopu $\mathrm{K^+}$ pade malo pod mirovni potencial in se nato vrne.

? Ukaz za premik palca na nogi potuje po mieliniziranem vlaknu dolgem okoli $1\,\mathrm{m}$ s hitrostjo okoli $100\,\mathrm{m/s}$. Približno koliko časa potrebuje?
- Okoli $1\,\mathrm{ms}$
~ To bi veljalo za $10\,\mathrm{cm}$. Meter je desetkrat daljši.
+ Okoli $10\,\mathrm{ms}$
- Okoli $1\,\mathrm{s}$
~ Tako počasi prevajajo tanka vlakna brez mielina. Mielinizirano vlakno je okoli stokrat hitrejše.
> $t = \dfrac{1\,\mathrm{m}}{100\,\mathrm{m/s}} = 0{,}01\,\mathrm{s} = 10\,\mathrm{ms}$.

? Zakaj gre signal na kemični sinapsi le v eno smer?
- Ker je sinaptična špranja nagnjena v eno smer.
~ Špranja je le ozek prostor. Smer določa, kje so mešički in kje receptorji.
- Ker prenašalec potuje samo s tokom krvi.
~ Prenašalec ne potuje s krvjo, ampak difundira čez špranjo; tako potujejo hormoni.
+ Ker so mešički s prenašalcem le v aksonskem končiču, receptorji pa le na naslednji celici.
> Prenašalec se lahko sprosti samo na eni strani in veže samo na drugi, zato je pot enosmerna.

? Potencial v nevronu se je dvignil z $-70\,\mathrm{mV}$ na $+30\,\mathrm{mV}$. Kaj se je zgodilo?
- $\mathrm{K^+}$ je vstopil v celico.
~ Kalija je znotraj že več, zato ob odprtju kanalov izstopa. Izstop $\mathrm{K^+}$ potencial zniža.
+ $\mathrm{Na^+}$ je vdrl v celico.
- Natrijevo-kalijeva črpalka je izčrpala več $\mathrm{Na^+}$.
~ Črpalka $\mathrm{Na^+}$ izčrpava ven in tako vzdržuje negativni mirovni potencial; dviga ne povzroči.
> Ob pragu se odprejo kanali za $\mathrm{Na^+}$. Natrija je zunaj več, zato vdre v celico in notranjost postane pozitivna.

? Kokain prepreči, da bi aksonski končič dopamin privzel nazaj. Kaj sledi?
- V špranji je manj dopamina.
~ Kokain ne zmanjša sproščanja. Dopamin se sprosti normalno, le odstrani se ne.
- Dopamin se sploh ne sprosti iz mešičkov.
~ Sproščanje sproži $\mathrm{Ca^{2+}}$ in poteka normalno. Kokain deluje na korak po sproščanju.
+ Dopamin ostane dlje v špranji in naslednjo celico dlje vzburja.
> Ker se dopamin ne odstrani, se znova in znova veže na receptorje. Učinek je močnejši in daljši; možgani se sčasoma prilagodijo, kar vodi v toleranco in odvisnost.

:::simboli
t | čas prevajanja živčnega signala | t = \dfrac{s}{v} | s | s sinapsami še prištejemo zakasnitve
s | dolžina živčne poti | | m
v | hitrost prevajanja živčnega impulza | v = \dfrac{s}{t} | m/s | z mielinom 50 do 120 m/s
U | membranski potencial (napetost na membrani) | | mV | v mirovanju okoli −70 mV
U_{\mathrm{končna}} | končni membranski potencial | | mV
U_{\mathrm{začetna}} | začetni membranski potencial | | mV
t_{\mathrm{sinapsa}} | zakasnitev na eni sinapsi | | ms | okoli 0,5 ms
:::
