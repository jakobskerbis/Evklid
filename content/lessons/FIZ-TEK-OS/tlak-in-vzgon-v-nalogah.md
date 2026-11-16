---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Prvi prizor: na dnu skakalnega bazena, $4\,\mathrm{m}$ pod gladino, te zabolijo ušesa. Pri $1\,\mathrm{m}$ jih skoraj ne čutiš. Bazen je lahko dolg $50\,\mathrm{m}$ ali le $5\,\mathrm{m}$, bolečina je enaka.

Drugi prizor: pri vaterpolu žogo potisneš pod vodo. Roka mora ves čas pritiskati, sicer žoga skoči nazaj na gladino.

Na videz dve različni stvari: ušesa in žoga. V resnici gre za isto. Voda pritiska na vse, kar je v njej, in globlje kot greš, močneje pritiska. Na spodnjo stran žoge zato pritiska bolj kot na zgornjo, razlika pa jo potiska navzgor. Tekmovalne naloge o tlaku, plavanju in veznih posodah se skoraj vse rešijo s tem enim spoznanjem.

## Razlaga

**Najprej en primer do konca.** V bazen spustimo kocko za igro potapljanja s stranico $10\,\mathrm{cm}$. Njena zgornja ploskev je $20\,\mathrm{cm}$ pod gladino, spodnja $30\,\mathrm{cm}$. Ploščina vsake ploskve je $S = 0{,}1\,\mathrm{m} \cdot 0{,}1\,\mathrm{m} = 0{,}01\,\mathrm{m^2}$. Računamo z $g = 10\,\mathrm{N/kg}$, kot je na tekmovanjih običajno.

Nad vsakim kvadratnim metrom ploskve stoji steber vode. Njegova teža, deljena s ploščino, je **hidrostatični tlak**: tlak, ki ga povzroča tekočina zaradi svoje teže. Steber s ploščino $S$, višino $h$ in gostoto $\rho$ ima maso $\rho S h$ in težo $\rho g S h$. Ko težo delimo s $S$, ostane tlak $\rho g h$.

| ploskev | globina | tlak | sila na ploskev |
|---|---|---|---|
| zgornja | $0{,}2\,\mathrm{m}$ | $2000\,\mathrm{Pa}$ | $20\,\mathrm{N}$ navzdol |
| spodnja | $0{,}3\,\mathrm{m}$ | $3000\,\mathrm{Pa}$ | $30\,\mathrm{N}$ navzgor |
| stranske | od $0{,}2$ do $0{,}3\,\mathrm{m}$ | enako na nasprotnih | se izničijo |

Sila na ploskev je tlak krat ploščina. Na stranske ploskve voda pritiska enako z leve in z desne, zato se te sile izničijo. Ostane razlika navpičnih: $30\,\mathrm{N} - 20\,\mathrm{N} = 10\,\mathrm{N}$ navzgor. Tej sili rečemo **vzgon**.

Prostornina kocke je $0{,}001\,\mathrm{m^3}$. Toliko vode kocka **izpodrine** (odrine s svojega mesta). Ta voda bi imela maso $1\,\mathrm{kg}$ in težo natanko $10\,\mathrm{N}$. To ni naključje.

:::premisli
Kocko spustimo še $1\,\mathrm{m}$ globlje. Se vzgon poveča, zmanjša ali ostane enak? Napovej, nato preveri z globinama $1{,}2\,\mathrm{m}$ in $1{,}3\,\mathrm{m}$.
---
Ostane enak. Sila na zgornjo ploskev je zdaj $120\,\mathrm{N}$, na spodnjo $130\,\mathrm{N}$. Obe sta zrasli za enako, razlika je še vedno $10\,\mathrm{N}$. Vzgon je odvisen od razlike globin med ploskvama, ne od tega, kako globoko je telo.
:::

**Posplošitev 1: tlak.** Iz tabele vidiš, da tlak raste premo sorazmerno z globino. Za vsako tekočino velja

$$p = \rho g h$$

Oblika posode ne igra vloge: v ozki cevi in v širokem bazenu je na isti globini tlak enak. Zato ušesa bolijo enako v majhnem in v olimpijskem bazenu.

**Posplošitev 2: vzgon.** Za poljubno telo razmislek s kocko pove **Arhimedov zakon**: vzgon je enak teži tekočine, ki jo telo izpodrine.

$$F_\mathrm{vz} = \rho_\mathrm{t} g V_\mathrm{p}$$

Tu je $\rho_\mathrm{t}$ gostota tekočine (ne telesa), $V_\mathrm{p}$ pa potopljena prostornina telesa. Vzgon raste, dokler telo potapljaš; ko je pod gladino v celoti, se ne spreminja več.

V simulaciji spodaj (Vzgon) premikaj drsnik »spusti telo« od $0$ do $100\,\%$. Opazuj, da vzgon raste le, dokler se telo potaplja. Nato zamenjaj tekočino in poglej, kako se vzgon spremeni pri isti prostornini.

**Posplošitev 3: plavanje.** Na telo delujeta teža $F_g = mg$ navzdol in vzgon navzgor. V celoti potopljeno telo potone, če je teža večja od vzgona. Ker v obeh silah nastopa ista prostornina, to pomeni: če je gostota telesa večja od gostote tekočine. Redkejše telo se dvigne na gladino in pogleda iz nje toliko, da je vzgon enak teži ($\rho$ je tu gostota telesa):

$$\rho_\mathrm{t} g V_\mathrm{p} = \rho g V$$

Od tod sledi pravilo, ki na tekmovanju prihrani veliko računanja: delež potopljene prostornine je razmerje gostot.

$$\frac{V_\mathrm{p}}{V} = \frac{\rho}{\rho_\mathrm{t}}$$

Led z gostoto $920\,\mathrm{kg/m^3}$ v morju z gostoto $1030\,\mathrm{kg/m^3}$: $\dfrac{920}{1030} \approx 0{,}89$. Ledena gora ima skoraj devet desetin pod gladino.

:::premisli
Kocko ledu ($920\,\mathrm{kg/m^3}$) vržeš v kozarec alkohola z gostoto $790\,\mathrm{kg/m^3}$. Kaj naredi? Nato počasi dolivaš vodo in mešaš. Kdaj se kaj spremeni?
---
Najprej potone. Tudi ko je led v celoti potopljen, izpodrine alkohol z manjšo težo, kot je teža ledu, ker je gostota alkohola manjša od gostote ledu. Z dolivanjem vode gostota mešanice raste; ko preseže $920\,\mathrm{kg/m^3}$, je vzgon večji od teže in led splava.
:::

**Posplošitev 4: vezne posode.** Vezne posode so posode, ki so spodaj povezane, na primer cev v obliki črke U. V mirujoči tekočini je tlak na isti višini povsod enak, če točke povezuje ista tekočina brez prekinitve. Če je v vseh krakih ena tekočina, so gladine na isti višini, ne glede na obliko krakov.

Če v en krak nalijemo drugo tekočino, ki se z vodo ne meša, izberemo ravnino, kjer je meja med tekočinama. Pod njo je v obeh krakih voda, zato je tlak na tej ravnini v obeh krakih enak. Iz $\rho_1 g h_1 = \rho_2 g h_2$ se $g$ krajša:

$$\rho_1 h_1 = \rho_2 h_2$$

Višini $h_1$ in $h_2$ merimo od meje navzgor. Redkejša tekočina stoji višje.

:::risba skica
opis: U-cev. V levem kraku je voda do višine 18 cm. V desnem kraku je spodaj voda do meje na višini 10 cm, nad njo olje do višine 20 cm. Črtkana vodoravna črta na višini meje kaže, da je voda nad mejo v levem kraku visoka 8 cm, olje v desnem 10 cm.
območje: -6; 0 .. 28; 26
enota: 9
pravokotnik: 3; 2 .. 19; 5 | modra
pravokotnik: 3; 5 .. 7; 18 | modra
pravokotnik: 15; 5 .. 19; 10 | modra
pravokotnik: 15; 10 .. 19; 20 | oranžna
črta: 3; 24 -> 3; 2 -> 19; 2 -> 19; 24 | debelo
črta: 7; 24 -> 7; 5 -> 15; 5 -> 15; 24 | debelo
črta: -1; 10 -> 23; 10 | siva črtkano
napis: 11; 11 | meja | nad | siva
puščica: 1; 10 -> 1; 18 | 8 cm | levo
puščica: 21; 10 -> 21; 20 | 10 cm | desno
napis: 5; 21 | voda | nad
napis: 17; 22 | olje | nad
:::

## Rešeni primeri

### Primer 1: ušesa na dnu bazena

Skakalni bazen je globok $4\,\mathrm{m}$. Kolikšen je hidrostatični tlak na dnu? S kolikšno silo voda tam pritiska na bobnič s ploščino $0{,}5\,\mathrm{cm^2}$?

**Podatki:** $h = 4\,\mathrm{m}$, $\rho = 1000\,\mathrm{kg/m^3}$, $g = 10\,\mathrm{N/kg}$, $S = 0{,}5\,\mathrm{cm^2}$
**Iščemo:** tlak $p$ in silo $F$

:::formula
$p = \rho g h$, nato $F = p \cdot S$
:::

**Rešitev:**

1. Tlak na dnu: $p = 1000 \cdot 10 \cdot 4 = 40\,000\,\mathrm{Pa}$, kar je $40\,\mathrm{kPa}$.
2. Ploščino pretvorimo v kvadratne metre, ker je paskal newton na kvadratni meter: $0{,}5\,\mathrm{cm^2} = 0{,}00005\,\mathrm{m^2}$.
3. Sila: $F = 40\,000 \cdot 0{,}00005 = 2\,\mathrm{N}$.
4. Odgovor: tlak na dnu je $40\,\mathrm{kPa}$; na bobnič voda pritiska s silo $2\,\mathrm{N}$, kot bi nanj položil $200\,\mathrm{g}$.

### Primer 2: plavalna deska

Plavalna deska iz pene ima prostornino $3\,\mathrm{dm^3}$ in maso $0{,}3\,\mathrm{kg}$. Kolikšen del deske je pod vodo, ko prosto plava? S kolikšno silo jo moraš potiskati, da je v celoti pod vodo?

**Podatki:** $V = 3\,\mathrm{dm^3} = 0{,}003\,\mathrm{m^3}$, $m = 0{,}3\,\mathrm{kg}$, $\rho_\mathrm{t} = 1000\,\mathrm{kg/m^3}$, $g = 10\,\mathrm{N/kg}$
**Iščemo:** delež $\dfrac{V_\mathrm{p}}{V}$ in silo roke $F$

:::formula
$\dfrac{V_\mathrm{p}}{V} = \dfrac{\rho}{\rho_\mathrm{t}}$; ko je deska vsa pod vodo: $F = \rho_\mathrm{t} g V - mg$
:::

**Rešitev:**

1. Gostota deske: $\rho = \dfrac{0{,}3}{0{,}003} = 100\,\mathrm{kg/m^3}$.
2. Delež pod vodo: $\dfrac{100}{1000} = 0{,}1$, torej desetina deske ($0{,}3\,\mathrm{dm^3}$).
3. Ko je deska vsa pod vodo, je vzgon $F_\mathrm{vz} = 1000 \cdot 10 \cdot 0{,}003 = 30\,\mathrm{N}$.
4. Teža deske je $F_g = 0{,}3 \cdot 10 = 3\,\mathrm{N}$. Roka mora dodati razliko, ker morata teža in sila roke skupaj uravnovesiti vzgon: $F = 30 - 3 = 27\,\mathrm{N}$.
5. Odgovor: prosto plavajoča deska ima pod vodo desetino prostornine; v celoti jo potopiš s silo $27\,\mathrm{N}$.

### Primer 3: olje v U-cevi

V U-cevi z enako širokima krakoma je voda. V desni krak nalijemo olje z gostoto $800\,\mathrm{kg/m^3}$, da je stolpec olja visok $10\,\mathrm{cm}$. Za koliko se dvigne gladina vode v levem kraku? Za koliko je gladina olja višja od gladine vode? (Stanje po nalivanju kaže risba v razlagi.)

**Podatki:** $h_1 = 10\,\mathrm{cm}$ (olje), $\rho_1 = 800\,\mathrm{kg/m^3}$, $\rho_2 = 1000\,\mathrm{kg/m^3}$ (voda), kraka enako široka
**Iščemo:** dvig vode $x$ v levem kraku in razliko gladin $\Delta h$

:::formula
Na višini meje: $\rho_1 h_1 = \rho_2 h_2$
:::

**Rešitev:**

1. Pod mejo olje–voda je v obeh krakih voda, zato je tlak na višini meje v obeh krakih enak.
2. Višina vode nad mejo v levem kraku: $h_2 = \dfrac{800 \cdot 10}{1000} = 8\,\mathrm{cm}$.
3. Meja v desnem kraku se spusti za $x$, gladina v levem se dvigne za enako $x$, ker je presek enak in se voda samo preseli. Gladina vode levo je zato $2x$ nad mejo, to pa je ravno $h_2$: $2x = 8\,\mathrm{cm}$, od koder $x = 4\,\mathrm{cm}$.
4. Razlika gladin: $\Delta h = h_1 - h_2 = 10 - 8 = 2\,\mathrm{cm}$.
5. Odgovor: voda v levem kraku se dvigne za $4\,\mathrm{cm}$; gladina olja je $2\,\mathrm{cm}$ višje od gladine vode.

### Primer 4: zdaj ti (kajak v reki in na morju)

Kajakaš z maso $70\,\mathrm{kg}$ sedi v kajaku z maso $20\,\mathrm{kg}$. Koliko litrov kajaka je pod gladino v reki ($1000\,\mathrm{kg/m^3}$) in koliko na morju ($1030\,\mathrm{kg/m^3}$)?

**Podatki:** $m = 70\,\mathrm{kg} + 20\,\mathrm{kg} = 90\,\mathrm{kg}$, $\rho_\mathrm{r} = 1000\,\mathrm{kg/m^3}$, $\rho_\mathrm{m} = 1030\,\mathrm{kg/m^3}$, $g = 10\,\mathrm{N/kg}$
**Iščemo:** potopljeno prostornino $V_\mathrm{p}$ v reki in na morju

:::formula
Plavanje: $\rho_\mathrm{t} g V_\mathrm{p} = mg$, torej $V_\mathrm{p} = \dfrac{m}{\rho_\mathrm{t}}$
:::

**Rešitev:**

1. Kajak plava, zato je vzgon enak skupni teži; $g$ se na obeh straneh krajša.
2. V reki: $V_\mathrm{p} = \dfrac{90}{1000} = 0{,}09\,\mathrm{m^3} = 90\,\mathrm{L}$.
3. Na morju izračunaj sam in povej, ali kajak sede globlje ali plitveje.

:::premisli
Koliko je $V_\mathrm{p}$ na morju?
---
$V_\mathrm{p} = \dfrac{90}{1030} \approx 0{,}087\,\mathrm{m^3}$, približno $87\,\mathrm{L}$. Kajak je na morju za okoli $3\,\mathrm{L}$ manj potopljen, ker gostejša voda da enak vzgon z manjšo izpodrinjeno prostornino.
:::

## Pogoste napake

- **»Več vode, večji tlak.«** Kdor misli, da je na dnu velikega jezera tlak večji kot na enaki globini v ozki cevi, upošteva količino vode. Tlak je odvisen le od globine in gostote: $p = \rho g h$. Popravek: v nalogi poišči globino, širino posode prezri.
- **»Globlje, večji vzgon.«** Tlak z globino res raste, a na zgornjo in spodnjo ploskev enako. Ko je telo v celoti pod vodo, je vzgon na vsaki globini enak. Popravek: vzgon se spreminja le s potopljeno prostornino.
- **»Težje telo dobi večji vzgon.«** Vzgon ne pozna mase telesa, odvisen je od gostote tekočine in izpodrinjene prostornine. Svinčena in lesena kocka enake velikosti, obe v celoti pod vodo, dobita enak vzgon. Teža le odloči, ali telo potone.
- **Cela prostornina pri plavajočem telesu.** Kdor pri plavajoči deski vstavi celo $V$ v $\rho_\mathrm{t} g V$, dobi vzgon, ki je večji od teže, in telo, ki ne bi smelo mirovati. Popravek: pri plavanju vstavi $V_\mathrm{p}$ in izenači vzgon s težo.
- **Enaki gladini pri dveh tekočinah.** Gladini sta enaki le, če je v krakih ista tekočina. Z oljem in vodo izenačiš $\rho_1 h_1 = \rho_2 h_2$ na višini meje; redkejša tekočina stoji višje.

## Povzetek

- Hidrostatični tlak: $p = \rho g h$; odvisen le od gostote tekočine in globine, ne od oblike posode.
- Vzgon (Arhimedov zakon): $F_\mathrm{vz} = \rho_\mathrm{t} g V_\mathrm{p}$, teža izpodrinjene tekočine; pri v celoti potopljenem telesu neodvisen od globine.
- Telo plava, če je njegova gostota manjša od gostote tekočine; delež pod gladino je $\dfrac{\rho}{\rho_\mathrm{t}}$.
- Sila, s katero v celoti potopiš plavajoče telo, je vzgon minus teža.
- Vezne posode: ena tekočina, enake gladine; dve tekočini, $\rho_1 h_1 = \rho_2 h_2$ od meje navzgor.
- Strategija: izberi vodoravno ravnino, pod katero je ista tekočina, in izenači tlaka.

## Drugače: Z analogijo

Predstavljaj si človeško piramido navijačev. Kdor stoji na vrhu, ne nosi nikogar. Vsaka vrsta niže nosi vse, ki so nad njo. Spodnja vrsta je najbolj obremenjena. Širša piramida ima več ljudi, a tudi več nosačev, zato vsak spodaj nosi enako. Tako je z vodo: vsaka plast nosi težo stebra nad seboj, zato tlak raste z globino.

Vzgon je kot vlečenje vrvi med dvema ekipama. Spodnja ekipa (voda pod telesom) je vedno nekoliko močnejša od zgornje, ker stoji globlje. Če obe ekipi dobita enako okrepitev (telo spustiš globlje), zmaga spodnja z isto prednostjo kot prej. Prednost je točno teža izpodrinjene vode.

## Drugače: Bolj natančno

Nad gladino je še zrak z zračnim tlakom $p_0$, približno $100\,\mathrm{kPa}$. Skupni tlak na globini $h$ je zato $p_0 + \rho g h$. Na globini $10\,\mathrm{m}$ v vodi je hidrostatični tlak $1000 \cdot 10 \cdot 10 = 100\,000\,\mathrm{Pa}$, torej je skupni tlak tam dvakrat večji kot na gladini. V nalogah z veznimi posodami se $p_0$ krajša, ker deluje na obe odprti gladini enako.

Vzgon deluje tudi v zraku, le da je gostota zraka (okoli $1{,}2\,\mathrm{kg/m^3}$) majhna. Zato ga pri tehtanju trdnih teles navadno zanemarimo, pri balonu pa ravno on dviguje.

Pravilo $\rho_1 h_1 = \rho_2 h_2$ velja le, ko tekočini mirujeta in se ne mešata. Plini so stisljivi, zato pri njih gostota z višino ni stalna in formula $p = \rho g h$ velja le za majhne višinske razlike.

## Preveri se

? Vaterpolist drži žogo v celoti pod vodo. Kateri stavek pravilno opiše vzgon na žogo?
- Vzgon je enak teži žoge.
~ To velja le, ko žoga prosto plava. Pod vodo je vzgon večji od teže, zato jo moraš držati.
+ Vzgon je enak teži vode, ki jo žoga izpodrine.
- Vzgon je tem večji, čim globlje je žoga.
~ Ko je žoga v celoti pod vodo, z globino zrastejo sile na zgornjo in spodnjo stran enako, razlika ostane enaka.
> Arhimedov zakon: $F_\mathrm{vz} = \rho_\mathrm{t} g V_\mathrm{p}$, teža izpodrinjene vode.

? Razvrsti mesta od najmanjšega do največjega hidrostatičnega tlaka ($g = 10\,\mathrm{N/kg}$).
1. $1\,\mathrm{m}$ globoko v vodi ($1000\,\mathrm{kg/m^3}$)
2. $2{,}5\,\mathrm{m}$ globoko v olju ($800\,\mathrm{kg/m^3}$)
3. $2\,\mathrm{m}$ globoko v morju ($1030\,\mathrm{kg/m^3}$)
4. $0{,}2\,\mathrm{m}$ globoko v živem srebru ($13\,600\,\mathrm{kg/m^3}$)
> Tlaki so $10\,000$, $20\,000$, $20\,600$ in $27\,200\,\mathrm{Pa}$. Šteje produkt $\rho h$, ne samo globina.

? Kocka ledu plava v kozarcu, ki je napolnjen z vodo do roba. Kaj se zgodi, ko se led stopi?
- Voda steče čez rob.
~ Del ledu res gleda iz vode, a stopljen led zavzame manj prostora kot led.
- Gladina se zniža.
~ Plavajoči led izpodrine točno toliko vode, kolikor sam tehta, ne manj.
+ Gladina ostane enaka.
> Plavajoči led izpodrine vodo z enako maso, kot jo ima sam. Ko se stopi, nastane natanko toliko vode, kolikor je je prej izpodrinil, zato zapolni prav to prostornino.

? V U-cevi sta voda in neznana tekočina, ki se z vodo ne meša. Z risbe odčitaj višini nad mejo in izračunaj gostoto neznane tekočine ($\rho_\mathrm{vode} = 1000\,\mathrm{kg/m^3}$).
:::risba skica
opis: U-cev. Levi krak: voda sega 9 cm nad črtkano mejo. Desni krak: nad mejo je neznana tekočina, visoka 12 cm. Pod mejo je v obeh krakih voda.
območje: -6; 0 .. 28; 26
enota: 9
pravokotnik: 3; 2 .. 19; 5 | modra
pravokotnik: 3; 5 .. 7; 17 | modra
pravokotnik: 15; 5 .. 19; 8 | modra
pravokotnik: 15; 8 .. 19; 20 | oranžna
črta: 3; 24 -> 3; 2 -> 19; 2 -> 19; 24 | debelo
črta: 7; 24 -> 7; 5 -> 15; 5 -> 15; 24 | debelo
črta: -1; 8 -> 23; 8 | siva črtkano
napis: 11; 9 | meja | nad | siva
puščica: 1; 8 -> 1; 17 | 9 cm | levo
puščica: 21; 8 -> 21; 20 | 12 cm | desno
napis: 5; 20 | voda | nad
napis: 17; 22 | tekočina | nad
:::
= 750 kg/m³ | 5
~ 1333 | Razmerje si obrnil. Redkejša tekočina stoji višje, zato mora biti njena gostota manjša od gostote vode.
> Na višini meje: $\rho \cdot 12 = 1000 \cdot 9$, torej $\rho = 750\,\mathrm{kg/m^3}$.

? Lesen plovec z gostoto $600\,\mathrm{kg/m^3}$ in prostornino $2\,\mathrm{dm^3}$ plava na vodi. Največ koliko kilogramov lahko naložiš nanj, da se ravno še ne potopi pod gladino?
= 0,8 kg | 0,01
~ 2 | To je masa vode, ki jo izpodrine cel plovec. Del vzgona porabi plovec za svojo težo.
~ 1,2 | To je masa plovca, ne tovora.
> Ko je plovec ravno ves pod vodo, je vzgon enak teži $2\,\mathrm{kg}$ vode. Plovec ima maso $1{,}2\,\mathrm{kg}$, za tovor ostane $2 - 1{,}2 = 0{,}8\,\mathrm{kg}$.

:::simboli
p | hidrostatični tlak | p = \rho g h | Pa
\rho | gostota (tekočine pri tlaku, telesa pri plavanju) | \rho = \frac{m}{V} | kg/m^3
g | težni pospešek | | N/kg | na tekmovanjih $10\,\mathrm{N/kg}$
h | globina pod gladino | | m
F | sila tekočine na ploskev | F = p \cdot S | N | v primeru 2 sila roke, ki desko drži pod vodo
S | ploščina ploskve | | m^2
F_\mathrm{vz} | vzgon | F_\mathrm{vz} = \rho_\mathrm{t} g V_\mathrm{p} | N
\rho_\mathrm{t} | gostota tekočine | | kg/m^3
V_\mathrm{p} | potopljena (izpodrinjena) prostornina | | m^3
V | prostornina telesa | | m^3
m | masa telesa | | kg
F_g | teža | F_g = m g | N
\rho_1, \rho_2 | gostoti tekočin v veznih posodah | | kg/m^3
h_1, h_2 | višini tekočin nad mejo | | m
x | dvig vode v levem kraku | | cm
\Delta h | razlika gladin | \Delta h = h_1 - h_2 | cm
\rho_\mathrm{r} | gostota rečne vode | | kg/m^3
\rho_\mathrm{m} | gostota morske vode | | kg/m^3
:::

<<RACUN
vrednost: 1000*10*0.2 | 2000
vrednost: 1000*10*0.3 | 3000
vrednost: 3000*0.01-2000*0.01 | 10
vrednost: 1000*10*0.001 | 10
vrednost: 1000*10*1.3*0.01-1000*10*1.2*0.01 | 10
vrednost: 920/1030 | 0.89
vrednost: 1000*10*4 | 40000
enote: 0.5*cm^2 | 0.00005*m^2
vrednost: 40000*0.00005 | 2
vrednost: 0.3/0.003 | 100
vrednost: 1000*10*0.003 | 30
vrednost: 1000*10*0.003-0.3*10 | 27
resi: 800*10=1000*h | h | 8
resi: 2*x=8 | x | 4
vrednost: 90/1000 | 0.09
vrednost: 90/1030 | 0.087
vrednost: 1030*10*2 | 20600
vrednost: 13600*10*0.2 | 27200
resi: r*12=1000*9 | r | 750
vrednost: (1000-600)*0.002 | 0.8
vrednost: 100/1000 | 0.1
vrednost: 0.3*10 | 3
vrednost: 10-8 | 2
vrednost: 800*10*2.5 | 20000
vrednost: 1000*10*10 | 100000
>>
