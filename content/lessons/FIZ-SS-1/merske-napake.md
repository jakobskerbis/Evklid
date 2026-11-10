---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V porodnišnici tehtajo dojenčka na tehtnici, ki kaže na $50\,\text{g}$ natančno. Mama stopi na navadno osebno tehtnico, ki kaže le na pol kilograma natančno. Katera tehtnica meri bolje?

Na prvi pogled dojenčkova: $50\,\text{g}$ je desetkrat manj kot $500\,\text{g}$. Pa vendar je pri tehtanju mame napaka **v deležu** dvakrat manjša. Dojenček ima $4\,\text{kg}$, zato je $50\,\text{g}$ kar $1{,}25\,\%$ njegove mase. Mama ima $80\,\text{kg}$, pol kilograma je le $0{,}625\,\%$ njene mase.

Nobena meritev ni popolnoma točna. Zdravnik, ki izmeri vročino, mora vedeti, ali je razlika med $37{,}2\,^\circ\text{C}$ in $37{,}4\,^\circ\text{C}$ resnična ali le posledica termometra. Zato se naučimo dveh mer za napako in tega, kako rezultat zapišemo pošteno.

## Razlaga

**Od kod napake.** Medicinska sestra petkrat izmeri višino istega fanta. Vsakič dobi malo drugačno število. Pogled na skalo ni čisto pravokoten, fant se enkrat malo bolj zravna, lasje se stisnejo. Telo se spreminja tudi samo: zjutraj smo približno centimeter višji kot zvečer. Taki napaki rečemo **merska napaka**. Ne gre za zmoto, ampak za neizogibno negotovost vsake meritve.

**Meritve na številski premici.** Pet izmerjenih višin narišemo kot pike na številsko premico:

:::risba premica
opis: Številska premica višine v centimetrih od 172,0 do 173,0. Pike so pet meritev: 172,1; 172,3; 172,5; 172,6 in 172,8 cm. Povprečje 172,46 cm je označeno s praznim krožcem. Odebeljeni pas sega od 172,10 do 172,82 cm in zajame vse pike.
od: 172
do: 173
korak: 0,1
oznake: ne
oznaka: 172 | 172,0
oznaka: 173 | 173,0
oznaka: 172,46 | povprečje 172,46
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

Pike so razsute okrog sredine. Sredino označuje prazen krožec z napisom »povprečje«: to je **povprečje** $\bar{x}$, vsota vseh meritev, deljena z njihovim številom. Povprečje je naša najboljša ocena prave vrednosti.

**Širina pasu.** Odebeljeni sivi pas zajame vse pike. Od povprečja sega na vsako stran toliko, kolikor znaša največje odstopanje kake meritve od povprečja. To odstopanje je **absolutna napaka** $\Delta x$. Ima isto enoto kot merjena količina, tu centimetre. Prava višina leži najverjetneje znotraj tega pasu.

Kaj pa, če dobimo petkrat isto število ali merimo samo enkrat? Potem pasu ne moremo izmeriti iz razsutosti pik. Za absolutno napako vzamemo **najmanjši razdelek merila**: pri termometru z razdelki po $0{,}1\,^\circ\text{C}$ je to $0{,}1\,^\circ\text{C}$.

:::premisli
Sestra bi izmerila višino še desetkrat z istim merilom. Bi bil pas okrog povprečja ožji, širši ali približno enak?
---
Približno enak, kvečjemu malo širši. Pas kaže, kako zelo se posamezne meritve razlikujejo, to pa je odvisno od merila in od načina merjenja, ne od števila meritev. Ker je napaka največji odmik od povprečja, ga nove meritve pogosto malo razširijo, bistveno ožji pa ne postane. Več meritev naredi zanesljivejše **povprečje**, ožji pas pa da šele natančnejše merilo.
:::

**Zapis rezultata.** Rezultat zapišemo kot povprečje in absolutno napako v oklepaju, enota je zunaj:

$$h = (172{,}5 \pm 0{,}4)\,\text{cm}$$

Pravila zapisa:

- Absolutno napako zaokrožimo na **eno veljavno mesto**, torej obdržimo le prvo neničelno števko (npr. $0{,}36 \to 0{,}4$).
- Povprečje zaokrožimo na **isto decimalno mesto** kot napako ($172{,}46 \to 172{,}5$).
- Več decimalk od tega nima pomena: če napaka sega že v desetinke, so stotinke zgolj naključne.

**Primerjava v deležih.** Pri dojenčku in mami nismo primerjali gramov, ampak deleže. Absolutno napako delimo z izmerjeno vrednostjo in dobimo **relativno napako** $\delta$:

$$\delta = \frac{\Delta x}{\bar{x}}$$

Relativna napaka nima enote, ker se enoti pokrajšata. Navadno jo zapišemo v odstotkih. Pove, kako natančna je meritev: manjša kot je, boljša je meritev.

| meritev | $\Delta x$ | $\bar{x}$ | $\delta$ |
|---|---|---|---|
| dojenček na tehtnici | $0{,}05\,\text{kg}$ | $4\,\text{kg}$ | $1{,}25\,\%$ |
| mama na tehtnici | $0{,}5\,\text{kg}$ | $80\,\text{kg}$ | $0{,}625\,\%$ |
| vročina s termometrom | $0{,}1\,^\circ\text{C}$ | $37\,^\circ\text{C}$ | $0{,}27\,\%$ |

Termometer meri temperaturo, tehtnici pa maso, a jih vseeno lahko primerjamo: najmanjšo relativno napako ima termometer. Prav zato je relativna napaka uporabna: z njo primerjamo karkoli s čimerkoli.

:::premisli
Z istim ravnilom (razdelki po $1\,\text{mm}$) izmerimo dolžino prsta in dolžino stegnenice. Pri kateri meritvi je relativna napaka manjša? Zakaj?
---
Pri stegnenici. Absolutna napaka je pri obeh $1\,\text{mm}$, stegnenica pa je mnogo daljša. Isti milimeter je pri dolgi kosti manjši delež.
:::

V simulaciji spodaj »Merska napaka in povprečje« izmeri isti predmet desetkrat z ravnilom s centimetri, nato desetkrat z ravnilom z milimetri. Primerjaj relativni napaki in opazuj, kako se zoži pas okrog povprečja.

## Rešeni primeri

### Primer 1: ena meritev vročine

Digitalni termometer kaže na desetinko stopinje natančno. Ob merjenju pokaže $37{,}4\,^\circ\text{C}$. Zapiši rezultat in izračunaj relativno napako.

**Podatki:** $T = 37{,}4\,^\circ\text{C}$ (ena meritev), najmanjši razdelek $0{,}1\,^\circ\text{C}$
**Iščemo:** zapis rezultata in relativno napako $\delta$

:::formula
Pri eni meritvi je $\Delta T$ najmanjši razdelek; $\delta = \dfrac{\Delta T}{T}$
:::

**Rešitev:**

1. Meritev je ena sama, zato je absolutna napaka kar razdelek: $\Delta T = 0{,}1\,^\circ\text{C}$.
2. Zapis: $T = (37{,}4 \pm 0{,}1)\,^\circ\text{C}$.
3. Relativna napaka: $\delta = \dfrac{0{,}1\,^\circ\text{C}}{37{,}4\,^\circ\text{C}} \approx 0{,}0027 \approx 0{,}3\,\%$.
4. Odgovor: $T = (37{,}4 \pm 0{,}1)\,^\circ\text{C}$, relativna napaka je približno $0{,}3\,\%$.

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

### Primer 3: katera doza je premajhna za brizgo

Injekcijska brizga ima razdelke po $0{,}1\,\text{ml}$. Pri zdravilu sme biti relativna napaka odmerka največ $5\,\%$. Kolikšen je najmanjši odmerek, ki ga s to brizgo še smemo odmeriti? Ali je brizga primerna za odmerek $0{,}5\,\text{ml}$?

**Podatki:** $\Delta V = 0{,}1\,\text{ml}$, največja dovoljena $\delta = 5\,\% = 0{,}05$, odmerek $V_2 = 0{,}5\,\text{ml}$
**Iščemo:** najmanjši odmerek $V_\text{min}$ in relativno napako pri $V_2$

:::formula
$\delta = \dfrac{\Delta V}{V}$, preoblikovano $V = \dfrac{\Delta V}{\delta}$
:::

**Rešitev:**

1. Iščemo prostornino, pri kateri je relativna napaka točno $5\,\%$, zato enačbo obrnemo: $V_\text{min} = \dfrac{\Delta V}{\delta}$.
2. $V_\text{min} = \dfrac{0{,}1\,\text{ml}}{0{,}05} = 2\,\text{ml}$. Pri večjih odmerkih je delež napake še manjši.
3. Za $0{,}5\,\text{ml}$: $\delta = \dfrac{0{,}1\,\text{ml}}{0{,}5\,\text{ml}} = 0{,}2 = 20\,\%$, kar je štirikrat preveč.
4. Odgovor: s to brizgo smemo odmeriti najmanj $2\,\text{ml}$. Za $0{,}5\,\text{ml}$ ni primerna; potrebna je brizga z drobnejšimi razdelki.

### Primer 4: zdaj ti

Utrip štejemo $15\,\text{s}$ in naštejemo $18$ udarcev. Pri štetju se lahko zmotimo za en udarec, ker ne vemo, ali smo začeli ob udarcu ali tik za njim. Zapiši utrip na minuto z absolutno napako in izračunaj relativno napako.

**Podatki:** $N = 18$ udarcev v $15\,\text{s}$, $\Delta N = 1$ udarec
**Iščemo:** utrip $f$ na minuto, njegovo absolutno napako $\Delta f$ in relativno napako $\delta$

:::formula
Minuta ima štiri četrtine: $f = 4N$ in $\Delta f = 4\,\Delta N$; $\delta = \dfrac{\Delta f}{f}$
:::

**Rešitev:**

1. Utrip na minuto: $f = 4 \cdot 18 = 72$ udarcev na minuto.
2. Tudi napaka se pomnoži s $4$: $\Delta f = 4 \cdot 1 = 4$ udarci na minuto.
3. Zapiši rezultat in izračunaj relativno napako sam, nato preveri:

:::premisli
Kako se glasi rezultat in kolikšna je relativna napaka?
---
$f = (72 \pm 4)$ udarcev na minuto, $\delta = \dfrac{4}{72} \approx 0{,}056 \approx 6\,\%$. Enako dobiš iz $\dfrac{1}{18}$: z množenjem s $4$ se relativna napaka ne spremeni. Če bi šteli celo minuto, bi bila napaka le en udarec od $72$, približno $1{,}4\,\%$.
:::

## Pogoste napake

- **»Več decimalk je bolj natančno.«** Kalkulator izpiše $172{,}46$, zato kdo zapiše $(172{,}46 \pm 0{,}36)\,\text{cm}$. Stotinke tu nimajo pomena, saj napaka sega že v desetinke. Napako zaokroži na eno veljavno mesto, povprečje pa na isto decimalno mesto.
- **Primerjanje absolutnih napak.** »$50\,\text{g}$ je manj kot $0{,}5\,\text{kg}$, torej je dojenčkova tehtnica boljša.« Absolutna napaka sama ne pove, kako dobra je meritev, ker je ne primerja z velikostjo količine. Za primerjavo uporabi relativno napako.
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
- Isti krog s polmerom $2\,\text{cm}$ je na majhni tarči ogromen, na veliki pa skoraj neopazen. Razmerje med polmerom kroga in velikostjo tarče je **relativna napaka**.

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

? Razvrsti meritve od najnatančnejše do najmanj natančne. A: dojenček $(4{,}00 \pm 0{,}05)\,\text{kg}$. B: odrasli $(80{,}0 \pm 0{,}5)\,\text{kg}$. C: vročina $(37{,}0 \pm 0{,}1)\,^\circ\text{C}$.
- A, C, B
~ To je razvrstitev po absolutni napaki ($0{,}05$; $0{,}1$; $0{,}5$). Ta ne upošteva velikosti količine in različnih enot.
+ C, B, A
- B, C, A
~ To je razvrstitev po velikosti izmerjene vrednosti ($80$, $37$, $4$). Večja vrednost sama še ne pomeni natančnejše meritve. Izračunaj deleže: A $1{,}25\,\%$, B $0{,}625\,\%$, C $0{,}27\,\%$.
> Relativne napake so C $0{,}27\,\%$, B $0{,}625\,\%$, A $1{,}25\,\%$. Najnatančnejša je meritev z najmanjšo relativno napako.

? Z istim ravnilom (razdelki po $1\,\text{mm}$) izmerimo kost, ki je dvakrat daljša od prejšnje. Kaj se zgodi z relativno napako?
- Podvoji se, ker je kost daljša.
~ Daljša kost ne pomeni večje absolutne napake: ta je določena z ravnilom in ostane $1\,\text{mm}$.
- Ostane enaka, ker merimo z istim ravnilom.
~ Isto ravnilo da isto **absolutno** napako. Relativna se spremeni, ker delimo z večjo dolžino.
+ Razpolovi se.
> $\Delta x$ ostane $1\,\text{mm}$, $\bar{x}$ se podvoji, zato se količnik $\dfrac{\Delta x}{\bar{x}}$ razpolovi.

? Dolžino roke izmerimo trikrat: $61{,}2\,\text{cm}$; $61{,}8\,\text{cm}$ in $61{,}5\,\text{cm}$. Kako zapišemo rezultat?
- $(61{,}5 \pm 0{,}6)\,\text{cm}$
~ $0{,}6\,\text{cm}$ je razpon med skrajnima meritvama. Napaka je odstopanje od povprečja, torej $0{,}3\,\text{cm}$.
+ $(61{,}5 \pm 0{,}3)\,\text{cm}$
- $(61{,}5 \pm 0{,}1)\,\text{cm}$
~ Razdelek merila vzamemo le, ko so meritve enake. Tu se razlikujejo za več, zato je napaka večja.
> Povprečje je $61{,}5\,\text{cm}$, največje odstopanje je $0{,}3\,\text{cm}$ (pri $61{,}2$ in $61{,}8$).

? Infuzijska vrečka vsebuje $(250 \pm 5)\,\text{ml}$ raztopine. Kolikšna je relativna napaka?
- $50\,\%$
~ To je obrnjen ulomek $\dfrac{250}{5}$. Absolutna napaka pride v števec.
- $5\,\%$
~ $5$ je absolutna napaka v mililitrih, ne odstotek. Deliti jo moraš s $250\,\text{ml}$.
+ $2\,\%$
- $0{,}02\,\%$
~ $\dfrac{5}{250} = 0{,}02$ je delež. V odstotkih je to $2\,\%$.
> $\delta = \dfrac{5\,\text{ml}}{250\,\text{ml}} = 0{,}02 = 2\,\%$.

:::simboli
\delta | relativna napaka | \delta = \frac{\Delta x}{\bar{x}} | – | pogosto v odstotkih
x | izmerjena količina
\bar{x} | povprečje meritev | \bar{x} = \frac{\sum x_i}{n}
\Delta x | absolutna napaka | | | največje odstopanje od povprečja
T | izmerjena telesna temperatura | | ^\circ C
\Delta T | absolutna napaka temperature | | ^\circ C | pri eni meritvi najmanjši razdelek
h | telesna višina | | cm | rezultat zapišemo kot h = (h̄ ± Δh)
\bar{h} | povprečje meritev višine | \bar{h} = \dfrac{h_1 + h_2 + \dots + h_5}{5} | cm
h_1, h_2, h_5 | posamezne meritve višine | | cm
\Delta h | absolutna napaka višine | | cm | največje odstopanje od $\bar{h}$
V | odmerjena prostornina | V = \dfrac{\Delta V}{\delta} | ml
\Delta V | absolutna napaka prostornine | | ml | najmanjši razdelek brizge
f | srčni utrip na minuto | f = 4N | /min
\Delta f | absolutna napaka utripa | \Delta f = 4\,\Delta N | /min
N | število udarcev v 15 s | | –
\Delta N | absolutna napaka štetja | | – | en udarec
:::
