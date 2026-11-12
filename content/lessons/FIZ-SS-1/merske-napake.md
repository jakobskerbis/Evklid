---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Recimo, da dojenčka stehtamo na preprosti tehtnici, ki kaže na $50\,\text{g}$ natančno. Mama stopi na staro analogno osebno tehtnico z razdelki po pol kilograma. Katera meritev je natančnejša?

Na prvi pogled se zdi natančnejše tehtanje dojenčka, saj je $50\,\text{g}$ desetkrat manj kot $500\,\text{g}$. Pa vendar je pri tehtanju mame napaka **v deležu** dvakrat manjša. Dojenček ima $4\,\text{kg}$, zato je $50\,\text{g}$ kar približno $1{,}3\,\%$ njegove mase. Mama ima $80\,\text{kg}$, pol kilograma je le približno $0{,}6\,\%$ njene mase.

Nobena meritev ni popolnoma točna. Zdravnik, ki izmeri telesno temperaturo, mora vedeti, ali je razlika med $37{,}2\,^\circ\text{C}$ in $37{,}4\,^\circ\text{C}$ resnična ali le posledica termometra. Zato se naučimo dveh mer za napako in tega, kako rezultat zapišemo pošteno.

## Razlaga

**Od kod napake.** Medicinska sestra petkrat izmeri višino istega fanta. Vsakič dobi malo drugačno število. Pogled na skalo ni čisto pravokoten, fant se enkrat malo bolj zravna, lasje se stisnejo. Telo se spreminja tudi samo: zjutraj smo višji kot zvečer, odrasli povprečno za približno $1\,\text{cm}$. Taki napaki rečemo **merska napaka**. Ne gre za zmoto, ampak za neizogibno negotovost vsake meritve.

**Meritve na številski premici.** Pet izmerjenih višin narišemo kot pike na številsko premico:

:::risba premica
opis: Številska premica višine v centimetrih od 172,0 do 173,0. Pike so pet meritev: 172,1; 172,3; 172,5; 172,6 in 172,8 cm. Povprečje 172,46 cm je označeno s praznim krožcem. Odebeljeni pas sega od 172,10 do 172,82 cm in zajame vse pike.
od: 172
do: 173
korak: 0,1
oznake: ne
oznaka: 172 | 172,0
oznaka: 173 | 173,0
oznaka: 172,46 | x̄ = 172,46
točka: 172,46 | | oranžna prazna
interval: 172,1 .. 172,82 | | siva
točka: 172,1
točka: 172,3
točka: 172,5
točka: 172,6
točka: 172,8
podnapis: Višina v centimetrih.
:::

Pike stojijo pri $172{,}1$; $172{,}3$; $172{,}5$; $172{,}6$ in $172{,}8\,\text{cm}$.

Pike so razsute okrog sredine. Sredino označuje prazen krožec z napisom »x̄ = 172,46«, tik levo od pike $172{,}5$: to je **povprečje** $\bar{x}$, vsota vseh meritev, deljena z njihovim številom $n$. Povprečje je naša najboljša ocena prave vrednosti.

**Širina pasu.** Odebeljeni sivi pas zajame vse pike. Od povprečja sega na vsako stran toliko, kolikor znaša največje odstopanje kake meritve od povprečja. To odstopanje je **absolutna napaka** $\Delta x$. Ima isto enoto kot merjena količina, tu centimetre. Prava višina leži najverjetneje znotraj tega pasu. Največje odstopanje vzamemo zato, da pas zajame vse meritve in smo na varni strani. Nekateri učbeniki vzamejo povprečno odstopanje; pas je ožji (tu $0{,}2\,\text{cm}$ namesto $0{,}4\,\text{cm}$), oblika zapisa pa ostane enaka.

Spodnja slika kaže istih pet meritev po vrsti. Vodoravna črtkana črta je povprečje $172{,}46\,\text{cm}$, sivi pas sega $0{,}36\,\text{cm}$ nad in pod njo. V aplikaciji premikaj drsnik za peto meritev. Opazi dvoje. Če jo premakneš za $0{,}5\,\text{cm}$ (na $173{,}1\,\text{cm}$), se povprečje premakne le za petino tega, za $0{,}1\,\text{cm}$. Pas se najprej širi počasi, ko pa postane peta meritev najbolj oddaljena (nad približno $173{,}0\,\text{cm}$), hitro: pri $173{,}4\,\text{cm}$ je napaka $0{,}78\,\text{cm}$, več kot dvakrat večja. Ena sama slaba meritev torej močno poveča napako.

:::risba graf
opis: Pet meritev višine kot točke po vrsti: 172,3 cm, 172,8 cm, 172,5 cm, 172,1 cm in peta meritev, ki je zdaj {p:.1} cm (v aplikaciji jo spreminjaš z drsnikom). Vodoravna črtkana črta je povprečje {13794/100+p/5:.2} cm. Sivi pas sega od povprečja za absolutno napako {(7/20+abs(6902-40*p)/200+abs(80*p-13794)/100+abs(7/20+abs(6902-40*p)/200-abs(80*p-13794)/100))/2:.2} cm navzgor in navzdol in zajame vse točke.
x: 0 .. 6 | 1 | meritev
y: 171 .. 174 | 0,5 | h (cm)
drsnik: p | 171,6 .. 173,4 | 0,1 | 172,6 | peta meritev v centimetrih
pravokotnik: 0,5; 13794/100+p/5-(7/20+abs(6902-40*p)/200+abs(80*p-13794)/100+abs(7/20+abs(6902-40*p)/200-abs(80*p-13794)/100))/2 .. 5,5; 13794/100+p/5+(7/20+abs(6902-40*p)/200+abs(80*p-13794)/100+abs(7/20+abs(6902-40*p)/200-abs(80*p-13794)/100))/2 | siva
črta: 0,5; 13794/100+p/5 -> 5,5; 13794/100+p/5 | oranžna črtkano
točka: 1; 172,3
točka: 2; 172,8
točka: 3; 172,5
točka: 4; 172,1
točka: 5; p | 5. | levo
podnapis: Peta meritev {p:.1} cm: povprečje {13794/100+p/5:.2} cm, absolutna napaka {(7/20+abs(6902-40*p)/200+abs(80*p-13794)/100+abs(7/20+abs(6902-40*p)/200-abs(80*p-13794)/100))/2:.2} cm.
:::

Kaj pa, če dobimo petkrat isto število ali merimo samo enkrat? Potem pasu ne moremo izmeriti iz razsutosti pik. Za absolutno napako vzamemo **najmanjši razdelek merila**: pri termometru z razdelki po $0{,}1\,^\circ\text{C}$ je to $0{,}1\,^\circ\text{C}$. Splošno pravilo: absolutna napaka je največje odstopanje od povprečja, a **nikoli manjša od najmanjšega razdelka** merila. Nekateri učbeniki pri merilih s skalo vzamejo pol razdelka; v šoli boš srečal obe pravili.

**Slučajne in sistematične napake.** Do zdaj so bile napake slučajne: enkrat preveč, drugič premalo, zato se v povprečju deloma izničijo. Drugačna je tehtnica, ki vedno kaže $0{,}3\,\text{kg}$ preveč. Taka **sistematična napaka** premakne vse meritve v isto smer, zato je povprečje ne odpravi. Odkrijemo jo le s primerjavo z drugim merilom ali z utežjo znane mase. Povprečje je najboljša ocena le za slučajne napake.

:::premisli
Sestra bi izmerila višino še desetkrat z istim merilom. Bi bil pas okrog povprečja ožji, širši ali približno enak?
---
Približno enak, kvečjemu malo širši. Pas kaže, kako zelo se posamezne meritve razlikujejo, to pa je odvisno od merila in od načina merjenja, ne od števila meritev. Ker je napaka največji odmik od povprečja, ga nove meritve pogosto malo razširijo, bistveno ožji pa ne postane. Več meritev naredi zanesljivejše **povprečje**, ožji pas pa da šele natančnejše merilo.
:::

**Zapis rezultata.** Rezultat zapišemo kot povprečje in absolutno napako v oklepaju, enota je zunaj:

$$h = (172{,}5 \pm 0{,}4)\,\text{cm}$$

Pravila zapisa:

- Absolutno napako zaokrožimo na **eno veljavno mesto**, torej obdržimo le prvo neničelno števko (npr. $0{,}36 \to 0{,}4$). Zakaj le eno? Napaka je sama le ocena, morda zgrešena za tretjino, zato njena druga števka ni zanesljiva. Nekateri učbeniki obdržijo dve mesti, kadar je prva števka $1$ ($0{,}14$ ostane $0{,}14$), ker bi zaokrožitev na $0{,}1$ napako zmanjšala skoraj za tretjino.
- Povprečje zaokrožimo na **isto decimalno mesto** kot napako ($172{,}46 \to 172{,}5$).
- Več decimalk od tega nima pomena: če napaka sega že v desetinke, so stotinke zgolj naključne.

**Primerjava v deležih.** Pri dojenčku in mami nismo primerjali gramov, ampak deleže. Absolutno napako delimo z izmerjeno vrednostjo in dobimo **relativno napako** $\delta$:

$$\delta = \frac{\Delta x}{\bar{x}}$$

Relativna napaka nima enote, ker se enoti pokrajšata. Navadno jo zapišemo v odstotkih, zaokroženo na eno ali dve veljavni mesti. Pove, kako natančna je meritev: manjša kot je, boljša je meritev.

| meritev | $\Delta x$ | $\bar{x}$ | $\delta$ |
|---|---|---|---|
| dojenček na tehtnici | $0{,}05\,\text{kg}$ | $4\,\text{kg}$ | $1{,}3\,\%$ |
| mama na tehtnici | $0{,}5\,\text{kg}$ | $80\,\text{kg}$ | $0{,}6\,\%$ |
| obseg glave dojenčka | $0{,}1\,\text{cm}$ | $35\,\text{cm}$ | $0{,}3\,\%$ |

Relativna napaka opisuje meritev, ne merila: ista tehtnica da pri večji masi manjšo relativno napako. Merilni trak meri dolžino, tehtnici pa maso, a meritve vseeno lahko primerjamo: najmanjšo relativno napako ima merjenje obsega glave. Prav zato je relativna napaka uporabna: z njo primerjamo natančnost različnih količin.

**Kdaj relativna napaka nima smisla.** Delež je smiseln le pri količini s pravo ničlo: $0\,\text{kg}$ pomeni, da mase ni. Pri temperaturi v stopinjah Celzija je ničla izbrana poljubno (zmrzišče vode). Napaka $0{,}1\,^\circ\text{C}$ bi bila pri $37\,^\circ\text{C}$ »$0{,}3\,\%$«, pri $0{,}5\,^\circ\text{C}$ pa kar »$20\,\%$«, čeprav termometer meri enako dobro. Pri telesni temperaturi zato primerjamo absolutne napake. Termometer na desetinko da $(37{,}2 \pm 0{,}1)\,^\circ\text{C}$ in $(37{,}4 \pm 0{,}1)\,^\circ\text{C}$: pasova od $37{,}1$ do $37{,}3$ in od $37{,}3$ do $37{,}5$ se le dotakneta. Razlika je torej komaj zaznavna; zanesljivo bi ju ločil šele natančnejši termometer.

:::premisli
Z istim ravnilom (razdelki po $1\,\text{mm}$) izmerimo dolžino prsta in dolžino stegnenice. Pri kateri meritvi je relativna napaka manjša? Zakaj?
---
Pri stegnenici. Absolutna napaka je pri obeh $1\,\text{mm}$, stegnenica pa je mnogo daljša. Isti milimeter je pri dolgi kosti manjši delež.
:::

V simulaciji spodaj »Merska napaka in povprečje« izmeri isti predmet desetkrat z ravnilom s centimetri, nato desetkrat z ravnilom z milimetri. Primerjaj relativni napaki in opazuj, kako se zoži pas okrog povprečja.

## Rešeni primeri

### Primer 1: ena meritev telesne mase

V ambulanti fanta stehtajo na digitalni tehtnici, ki kaže na $0{,}1\,\text{kg}$ natančno. Pokaže $63{,}8\,\text{kg}$. Zapiši rezultat in izračunaj relativno napako.

**Podatki:** $m = 63{,}8\,\text{kg}$ (ena meritev), najmanjši razdelek $0{,}1\,\text{kg}$
**Iščemo:** zapis rezultata in relativno napako $\delta$

:::formula
Pri eni meritvi je $\Delta m$ najmanjši razdelek; $\delta = \dfrac{\Delta m}{m}$
:::

**Rešitev:**

1. Meritev je ena sama, zato je absolutna napaka kar razdelek: $\Delta m = 0{,}1\,\text{kg}$.
2. Zapis: $m = (63{,}8 \pm 0{,}1)\,\text{kg}$. Masa ima pravo ničlo, zato je delež smiseln.
3. Relativna napaka: $\delta = \dfrac{0{,}1\,\text{kg}}{63{,}8\,\text{kg}} \approx 0{,}0016 \approx 0{,}16\,\%$.
4. Odgovor: $m = (63{,}8 \pm 0{,}1)\,\text{kg}$, relativna napaka je približno $0{,}16\,\%$.

### Primer 2: pet meritev višine

Sestra izmeri višino fanta petkrat: $172{,}3\,\text{cm}$; $172{,}8\,\text{cm}$; $172{,}5\,\text{cm}$; $172{,}1\,\text{cm}$ in $172{,}6\,\text{cm}$. Zapiši rezultat in izračunaj relativno napako.

**Podatki:** $h_1 = 172{,}3\,\text{cm}$, $h_2 = 172{,}8\,\text{cm}$, $h_3 = 172{,}5\,\text{cm}$, $h_4 = 172{,}1\,\text{cm}$, $h_5 = 172{,}6\,\text{cm}$
**Iščemo:** zapis $h = (\bar{h} \pm \Delta h)$ in relativno napako $\delta$

:::formula
$\bar{h} = \dfrac{h_1 + h_2 + \dots + h_5}{5}$, $\Delta h$ = največje odstopanje od $\bar{h}$, $\delta = \dfrac{\Delta h}{\bar{h}}$
:::

**Rešitev:**

1. Vsota meritev je $862{,}3\,\text{cm}$, zato je $\bar{h} = \dfrac{862{,}3\,\text{cm}}{5} = 172{,}46\,\text{cm}$.
2. Najbolj odstopata skrajni meritvi: $172{,}46 - 172{,}1 = 0{,}36$ in $172{,}8 - 172{,}46 = 0{,}34$. Večje odstopanje je $0{,}36\,\text{cm}$.
3. Napako zaokrožimo na eno veljavno mesto: $\Delta h = 0{,}4\,\text{cm}$. Povprečje zato zaokrožimo na desetinke: $\bar{h} = 172{,}5\,\text{cm}$.
4. Relativna napaka: $\delta = \dfrac{0{,}4\,\text{cm}}{172{,}5\,\text{cm}} \approx 0{,}0023 \approx 0{,}2\,\%$.
5. Odgovor: fant je visok $h = (172{,}5 \pm 0{,}4)\,\text{cm}$, relativna napaka je okrog $0{,}2\,\%$.

### Primer 3: kateri odmerek je za brizgo premajhen

Navadna $5$-mililitrska injekcijska brizga ima razdelke po $0{,}2\,\text{ml}$. Zdravnik zahteva, da je relativna napaka odmerka največ $5\,\%$. Kolikšen je najmanjši odmerek, ki ga s to brizgo še smemo odmeriti? Je primerna za odmerek $0{,}5\,\text{ml}$? Kaj pa $1$-mililitrska brizga z razdelki po $0{,}01\,\text{ml}$?

**Podatki:** $\Delta V = 0{,}2\,\text{ml}$ ($5$-ml brizga), razdelek $1$-ml brizge $0{,}01\,\text{ml}$, največja dovoljena $\delta = 5\,\% = 0{,}05$, odmerek $V_2 = 0{,}5\,\text{ml}$
**Iščemo:** najmanjši odmerek $V_\text{min}$ in relativno napako pri $V_2$ za obe brizgi

:::formula
$\delta = \dfrac{\Delta V}{V}$, preoblikovano $V_\text{min} = \dfrac{\Delta V}{\delta}$
:::

**Rešitev:**

1. Iščemo prostornino, pri kateri je relativna napaka točno $5\,\%$, zato enačbo obrnemo: $V_\text{min} = \dfrac{\Delta V}{\delta}$.
2. $V_\text{min} = \dfrac{0{,}2\,\text{ml}}{0{,}05} = 4\,\text{ml}$. Pri večjih odmerkih je delež napake še manjši.
3. Za $V_2 = 0{,}5\,\text{ml}$ s $5$-ml brizgo: $\delta = \dfrac{\Delta V}{V_2} = \dfrac{0{,}2\,\text{ml}}{0{,}5\,\text{ml}} = 0{,}4 = 40\,\%$, kar je osemkrat preveč.
4. Z $1$-ml brizgo: $\delta = \dfrac{0{,}01\,\text{ml}}{0{,}5\,\text{ml}} = 0{,}02 = 2\,\%$, kar je pod mejo, ker je razdelek dvajsetkrat manjši.
5. Odgovor: s $5$-ml brizgo smemo odmeriti najmanj $4\,\text{ml}$. Za $0{,}5\,\text{ml}$ ni primerna, $1$-ml brizga pa je.

Graf kaže relativno napako v odvisnosti od odmerka za $5$-ml brizgo. Krivulja pada, ker isti razdelek delimo z vedno večjim odmerkom. Črtkano mejo $5\,\%$ seka pri $4\,\text{ml}$; pri $0{,}5\,\text{ml}$ je točka visoko, pri $40\,\%$. V aplikaciji premikaj drsnik za razdelek brizge proti $0{,}01\,\text{ml}$ in opazuj, kako presečišče z mejo drsi v levo.

:::risba graf
opis: Graf relativne napake δ v odstotkih v odvisnosti od odmerka V v mililitrih za brizgo z razdelki po {d} ml. Krivulja z večanjem odmerka pada. Vodoravna črtkana črta je dovoljena meja 5 %. Krivulja jo seka pri {20*d:.2} ml. Točka pri odmerku 0,5 ml ima relativno napako {200*d:.1} %.
x: 0 .. 6 | 1 | V (ml)
y: 0 .. 45 | 10 | δ (%)
drsnik: d | 0,01 .. 0,2 | 0,005 | 0,2 | razdelek brizge v mililitrih
f: 100*d/x | modra | 0,1 .. 5,2
črta: 0; 5 -> 6; 5 | oranžna črtkano
napis: 6; 5 | meja 5 % | nad levo | oranžna
točka: 20*d; 5 | | | oranžna
točka: 0,5; 200*d | {200*d:.1} % | nad desno
podnapis: Razdelek {d} ml: meja 5 % pri {20*d:.2} ml, pri 0,5 ml je napaka {200*d:.1} %.
:::

:::premisli
Kolikšen je največji razdelek, pri katerem točka pri $0{,}5\,\text{ml}$ pade ravno na mejo $5\,\%$? Napovej, nato preveri z drsnikom.
---
$\Delta V = 0{,}05 \cdot 0{,}5\,\text{ml} = 0{,}025\,\text{ml}$. Vsaka brizga z razdelki po $0{,}025\,\text{ml}$ ali manj je dovolj fina, zato $1$-ml brizga z $0{,}01\,\text{ml}$ ustreza.
:::

### Primer 4: zdaj ti

Utrip pogosto štejemo le $15\,\text{s}$ in število pomnožimo s $4$. Naštejemo $18$ udarcev. Pri štetju se lahko zmotimo za en udarec, ker ne vemo, ali smo začeli ob udarcu ali tik za njim. Zapiši utrip na minuto z absolutno napako in izračunaj relativno napako.

**Podatki:** $N = 18$ udarcev v $15\,\text{s}$, $\Delta N = 1$ udarec
**Iščemo:** utrip $f$ na minuto, njegovo absolutno napako $\Delta f$ in relativno napako $\delta$

:::formula
Minuta ima štiri četrtine: $f = 4N$ in $\Delta f = 4\,\Delta N$; $\delta = \dfrac{\Delta f}{f}$
:::

**Rešitev:**

1. Utrip na minuto: $f = 4 \cdot 18 = 72$ udarcev na minuto.
2. Izmerjeno število pomnožimo s $4$, zato se s $4$ pomnoži tudi njegova negotovost: od $17$ do $19$ udarcev postane od $68$ do $76$ na minuto, torej $\Delta f = 4 \cdot 1 = 4$ udarci na minuto.
3. Zapiši rezultat in izračunaj relativno napako sam, nato preveri:

:::premisli
Kako se glasi rezultat in kolikšna je relativna napaka?
---
$f = (72 \pm 4)$ udarcev na minuto, $\delta = \dfrac{4}{72} \approx 0{,}056 \approx 6\,\%$. Enako dobiš iz $\dfrac{1}{18}$: z množenjem s $4$ se relativna napaka ne spremeni. Če bi šteli celo minuto, bi bila napaka le en udarec od $72$, približno $1{,}4\,\%$.
:::

## Pogoste napake

- **»Več decimalk je bolj natančno.«** Kalkulator izpiše $172{,}46$, zato kdo zapiše $(172{,}46 \pm 0{,}36)\,\text{cm}$. Stotinke tu nimajo pomena, saj napaka sega že v desetinke. Napako zaokroži na eno veljavno mesto, povprečje pa na isto decimalno mesto.
- **Primerjanje absolutnih napak.** »$50\,\text{g}$ je manj kot $0{,}5\,\text{kg}$, torej je dojenček stehtan natančneje.« Absolutna napaka sama ne pove, kako dobra je meritev, ker je ne primerja z velikostjo količine. Za primerjavo uporabi relativno napako.
- **Obrnjen ulomek ali pozabljeni odstotki.** Pri $\Delta V = 5\,\text{ml}$ in $V = 250\,\text{ml}$ kdo izračuna $\dfrac{250}{5} = 50$ ali zapiše $0{,}02\,\%$. Pravilno je $\dfrac{5}{250} = 0{,}02 = 2\,\%$: napaka je zgoraj, za odstotke množimo s $100$.
- **Razpon namesto odstopanja.** Kdo za absolutno napako vzame razliko med največjo in najmanjšo meritvijo. To je širina celega pasu, napaka pa sega od povprečja le do enega roba, torej približno polovico razpona.
- **»Pazljiv merilec nima napake.«** Tudi ko dobiš večkrat isto število, je napaka vsaj en razdelek merila. Natančnost omejuje že merilo samo.

## Povzetek

- Vsaka meritev ima mersko napako: zaradi merila, odčitavanja in spreminjanja merjenega telesa.
- Pri več meritvah je najboljša ocena povprečje $\bar{x}$; absolutna napaka $\Delta x$ je največje odstopanje meritve od povprečja.
- Pri eni meritvi (ali enakih meritvah) je $\Delta x$ najmanjši razdelek merila.
- Zapis: $x = (\bar{x} \pm \Delta x)$ enota; $\Delta x$ na eno veljavno mesto, $\bar{x}$ na isto decimalno mesto.
- Relativna napaka $\delta = \dfrac{\Delta x}{\bar{x}}$ je brez enote, navadno v odstotkih; z njo primerjamo natančnost različnih meritev.
- Absolutna napaka ima enoto količine; enaka absolutna napaka pri večji količini pomeni manjšo relativno napako.

## Drugače: Z analogijo

Meritve si predstavljaj kot puščice v tarčo. Vsak met zadene malo drugje, puščice pa se zberejo okrog neke točke.

- Sredina skupine puščic je **povprečje**.
- Krog, ki zajame vse puščice, ima polmer, enak **absolutni napaki**.
- Velikost tarče je velikost merjene količine $\bar{x}$: majhna tarča je majhna količina.
- Razmerje med polmerom kroga in polmerom tarče je **relativna napaka**.

Pozor: v fiziki tarča pogosto ponazarja tudi razliko med točnostjo in natančnostjo. Tu nas zanima le, kolikšen je polmer kroga zadetkov v primerjavi s polmerom tarče.

:::risba skica
opis: Dve tarči z enako skupino petih zadetkov. Leva tarča ima polmer 4 cm, desna 10 cm. Okrog zadetkov je na obeh oranžen krog s polmerom 2 cm, označen z Δx. Na levi tarči krog sega do polovice polmera tarče, na desni le do petine.
območje: -1; -2 .. 29; 21
enota: 10
krog: 4; 10,5 | 4 | siva
krog: 18,5; 10,5 | 10 | siva
krog: 4,5; 10,2 | 2 | oranžna
krog: 19; 10,2 | 2 | oranžna
napis: 4,5; 12,6 | Δx | nad
napis: 19; 12,6 | Δx | nad
točka: 5,1; 11
točka: 3,5; 11,6
točka: 5,9; 9,6
točka: 4,9; 9
točka: 3,3; 9,6
točka: 19,6; 11
točka: 18; 11,6
točka: 20,4; 9,6
točka: 19,4; 9
točka: 17,8; 9,6
napis: 4; -1 | polmer 4 cm | sredina
napis: 18,5; -1 | polmer 10 cm | sredina
podnapis: Krog zadetkov ima na obeh tarčah polmer 2 cm: levo je to polovica polmera tarče, desno petina.
:::

Krog s polmerom $2\,\text{cm}$ je na tarči s polmerom $4\,\text{cm}$ ogromen (polovica polmera), na tarči s polmerom $10\,\text{cm}$ pa majhen (petina polmera). Tako je bilo pri dojenčku in mami: pri mami je bila napaka v gramih večja, tarča (njena masa) pa še veliko večja.

Boljši metalec (natančnejše merilo) nariše manjši krog. Daljši niz metov ne zmanjša kroga, le sredino skupine določi zanesljiveje.

## Drugače: Iz vsakdanjega življenja

Ko na telefonu odpreš zemljevid, okrog tvoje pike nariše bled krog. Ta krog je absolutna napaka položaja, na primer $\pm 10\,\text{m}$.

- Če iščeš vhod v zdravstveni dom, je $10\,\text{m}$ veliko: lahko si na napačni strani stavbe.
- Če voziš $100\,\text{km}$ na morje, je $10\,\text{m}$ zanemarljivo: to je le $0{,}01\,\%$ poti.

Absolutna napaka je v obeh primerih enaka, relativna pa zelo različna. Zato je pomembno, kaj merimo in kako velika je količina.

## Preveri se

? Na kartonu piše: »telesna višina $(158 \pm 1)\,\text{cm}$«. Kaj pomeni $1\,\text{cm}$?
- Relativno napako, ki znaša $1\,\%$.
~ Relativna napaka nima enote in bi bila tu $\dfrac{1}{158} \approx 0{,}6\,\%$. Številka z enoto cm je absolutna napaka.
+ Absolutno napako: prava višina je najverjetneje med $157\,\text{cm}$ in $159\,\text{cm}$.
- Da se je sestra pri merjenju zmotila za $1\,\text{cm}$.
~ Merska napaka ni zmota. Je neizogibna negotovost meritve, ki jo poštena oznaka vedno navede.
> Število za $\pm$ z enoto je absolutna napaka. Pove, kako daleč od zapisane vrednosti je lahko prava vrednost.

? Razvrsti meritve od najnatančnejše (najmanjša relativna napaka) do najmanj natančne.
1. višina odraslega $(180 \pm 1)\,\text{cm}$
2. dolžina novorojenčka $(50{,}0 \pm 0{,}5)\,\text{cm}$
3. masa tablete $(500 \pm 10)\,\text{mg}$
4. odmerek sirupa $(5{,}0 \pm 0{,}2)\,\text{ml}$
> Relativne napake: odrasli približno $0{,}6\,\%$, novorojenček $1\,\%$, tableta $2\,\%$, sirup $4\,\%$. Po absolutni napaki ($1\,\text{cm}$; $0{,}5\,\text{cm}$; $10\,\text{mg}$; $0{,}2\,\text{ml}$) ne smemo razvrščati: enote so različne in velikost količine šteje.

? Sestra višino fanta $(172{,}5 \pm 0{,}4)\,\text{cm}$ prepiše v metre. Kaj se zgodi z relativno napako?
- Zmanjša se stokrat, ker je število za $\pm$ zdaj $0{,}004$.
~ Absolutna napaka se v metrih res zapiše s stokrat manjšim številom, a tudi povprečje. Količnik ostane enak.
- Absolutna napaka ostane $0{,}4$, relativna pa se poveča.
~ Absolutna napaka ima enoto: $0{,}4\,\text{cm} = 0{,}004\,\text{m}$. Pri pretvorbi se spremeni tudi njeno število.
+ Ostane enaka, približno $0{,}2\,\%$.
> $\delta = \dfrac{0{,}004\,\text{m}}{1{,}725\,\text{m}} = \dfrac{0{,}4\,\text{cm}}{172{,}5\,\text{cm}} \approx 0{,}2\,\%$. Relativna napaka nima enote, zato je pretvorba ne spremeni.

? Na premici so tri meritve dolžine roke v centimetrih. Odčitaj jih in vpiši absolutno napako.
:::risba premica
opis: Številska premica od 61,0 do 62,0 cm z razdelki po 0,1 cm. Označeni sta samo krajišči. Tri pike stojijo pri 61,2; 61,4 in 61,9 cm.
od: 61
do: 62
korak: 0,1
oznake: ne
oznaka: 61 | 61,0
oznaka: 62 | 62,0
točka: 61,2
točka: 61,4
točka: 61,9
podnapis: Dolžina roke v centimetrih.
:::
= 0,4 cm | 0,02
~ 0,7 | To je razpon med skrajnima meritvama. Napaka sega od povprečja $61{,}5\,\text{cm}$ le do najbolj oddaljene meritve.
~ 0,3 | To je odstopanje meritve $61{,}2\,\text{cm}$. Meritev $61{,}9\,\text{cm}$ odstopa od povprečja bolj, za $0{,}4\,\text{cm}$.
~ 0,1 | To je razdelek merila, ki je le spodnja meja napake. Tu meritve odstopajo od povprečja bolj, zato je napaka večja.
> Povprečje je $\dfrac{61{,}2 + 61{,}4 + 61{,}9}{3}\,\text{cm} = 61{,}5\,\text{cm}$. Največje odstopanje ima $61{,}9\,\text{cm}$: $\Delta x = 0{,}4\,\text{cm}$, rezultat $(61{,}5 \pm 0{,}4)\,\text{cm}$.

? Graf kaže relativno napako $5$-ml brizge z razdelki po $0{,}2\,\text{ml}$. Pri kolikšnem odmerku je relativna napaka $10\,\%$? Odčitaj z grafa in preveri z računom.
:::risba graf
opis: Graf relativne napake δ v odstotkih v odvisnosti od odmerka V v mililitrih za brizgo z razdelki po 0,2 ml. Krivulja z večanjem odmerka pada. Vodoravna črtkana črta označuje 10 %. Krivulja jo seka pri 2 ml.
x: 0 .. 6 | 1 | V (ml)
y: 0 .. 45 | 10 | δ (%)
f: 20/x | modra | 0,45 .. 5,2
črta: 0; 10 -> 6; 10 | oranžna črtkano
napis: 6; 10 | 10 % | nad levo | oranžna
podnapis: Razdelek 0,2 ml.
:::
= 2 ml | 0,1
~ 0,02 | Odstotkov nisi pretvoril: $\dfrac{0{,}2}{10} = 0{,}02$. Pravilno je $10\,\% = 0{,}1$.
~ 0,5 | To je obrnjen ulomek $\dfrac{0{,}1}{0{,}2}$. Odmerek je $\dfrac{\Delta V}{\delta}$.
~ 10 | To je relativna napaka v odstotkih, ki jo odčitaš na navpični osi. Odmerek odčitaš na vodoravni osi.
> Krivulja seka črto $10\,\%$ pri $2\,\text{ml}$. Račun: $V = \dfrac{\Delta V}{\delta} = \dfrac{0{,}2\,\text{ml}}{0{,}1} = 2\,\text{ml}$.

? Sestra trikrat izmeri obseg glave dojenčka. Kalkulator da povprečje $35{,}733\,\text{cm}$, največje odstopanje je $0{,}27\,\text{cm}$. Kateri zapis je pravilen?
+ $(35{,}7 \pm 0{,}3)\,\text{cm}$
- $(35{,}733 \pm 0{,}27)\,\text{cm}$
~ Več decimalk ni bolj natančno. Napako zaokrožimo na eno veljavno mesto ($0{,}3$), povprečje na desetinke.
- $(35{,}73 \pm 0{,}3)\,\text{cm}$
~ Napaka sega v desetinke, zato so stotinke povprečja brez pomena. Povprečje zaokroži na isto decimalno mesto kot napako.
- $(36 \pm 0{,}3)\,\text{cm}$
~ Preveč zaokroženo: napaka je v desetinkah, zato tudi povprečje zapišemo na desetinke.
> Napaka $0{,}27 \to 0{,}3$ (eno veljavno mesto), povprečje $35{,}733 \to 35{,}7$ (isto decimalno mesto).

<<RACUN
vrednost: 0.05/4 | 0.0125
vrednost: 0.5/80 | 0.00625
vrednost: 0.1/35 | 0.0029
vrednost: 0.1/0.5 | 0.2
vrednost: 0.1/63.8 | 0.0016
vrednost: 0.2/0.1 | 2
vrednost: (172.3+172.8+172.5+172.1+172.6)/5 | 172.46
vrednost: 172.46-172.1 | 0.36
vrednost: 172.8-172.46 | 0.34
vrednost: 0.4/172.5 | 0.0023
vrednost: (689.7+173.4)/5 | 172.62
vrednost: 173.4-172.62 | 0.78
vrednost: 0.2/0.05 | 4
vrednost: 0.2/0.5 | 0.4
vrednost: 0.01/0.5 | 0.02
vrednost: 0.05*0.5 | 0.025
vrednost: 1/180 | 0.0056
vrednost: 0.5/50 | 0.01
vrednost: 10/500 | 0.02
vrednost: 0.2/5 | 0.04
vrednost: 0.004/1.725 | 0.0023
vrednost: 4*18 | 72
vrednost: 4/72 | 0.056
vrednost: 1/72 | 0.014
vrednost: 1/158 | 0.006
vrednost: (61.2+61.4+61.9)/3 | 61.5
vrednost: 61.9-61.5 | 0.4
vrednost: 5/250 | 0.02
>>

:::simboli
\delta | relativna napaka | \delta = \frac{\Delta x}{\bar{x}} | – | pogosto v odstotkih
x | izmerjena količina
\bar{x} | povprečje meritev | \bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n}
n | število meritev | | –
\Delta x | absolutna napaka | | | največje odstopanje od povprečja, vsaj najmanjši razdelek merila
m | izmerjena telesna masa | | kg
\Delta m | absolutna napaka mase | | kg | pri eni meritvi najmanjši razdelek
h | telesna višina | | cm | rezultat zapišemo kot $h = (\bar{h} \pm \Delta h)$
\bar{h} | povprečje meritev višine | \bar{h} = \dfrac{h_1 + h_2 + \dots + h_5}{5} | cm
h_1, h_2, h_3, h_4, h_5 | posamezne meritve višine | | cm
\Delta h | absolutna napaka višine | | cm | največje odstopanje od $\bar{h}$
V | odmerjena prostornina | | ml
V_\text{min} | najmanjši dovoljeni odmerek | V_\text{min} = \dfrac{\Delta V}{\delta} | ml
V_2 | odmerek $0{,}5\,\text{ml}$ | | ml
\Delta V | absolutna napaka prostornine | | ml | najmanjši razdelek brizge
f | srčni utrip na minuto | f = 4N | /min
\Delta f | absolutna napaka utripa | \Delta f = 4\,\Delta N | /min
N | število udarcev v 15 s | | –
\Delta N | absolutna napaka štetja | | – | en udarec
:::
