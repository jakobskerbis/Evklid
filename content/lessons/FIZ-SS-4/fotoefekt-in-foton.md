---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Najprej uganka iz kuhinje. Mikrovalovna pečica z močjo $800\,\mathrm{W}$ v približno dveh minutah segreje skodelico vode do vrenja. Majhna UV-svetilka za razkuževanje deske za rezanje ima moč okoli $5\,\mathrm{W}$. Pa vendar UV-svetilka poškoduje DNK bakterij na deski, mikrovalovka pa DNK ne razbije, le segreva.

Kako zmore $160$-krat šibkejši izvor nekaj, česar močnejši ne? Preden bereš naprej, zapiši svojo razlago v en stavek.

Še druga uganka. Na pocinkan pladenj posvetiš z močnim rdečim reflektorjem: iz kovine ne izleti noben elektron, tudi po eni uri ne. Posvetiš s šibko UV-svetilko in elektroni začnejo izletavati takoj.

Obe uganki imata isti odgovor. Ko ga razumeš, razumeš tudi svetlobna tipala, sončne celice in to, zakaj je UV-svetloba nevarna za kožo, toplota iz pečice pa ne na isti način.

## Razlaga

Razlago gradimo po delih. Vsak del se konča s kratkim preizkusom; odgovor je na začetku naslednjega dela.

**1. Svetloba prinaša energijo v obrokih.** Ko svetloba snovi preda energijo, je ne preda zvezno, kot teče voda iz pipe. Preda jo v obrokih, kot sladkor v kockah. En obrok imenujemo **foton**. Energija enega fotona je odvisna samo od frekvence $\nu$ svetlobe:

$$W_f = h\nu$$

Pri tem je $h = 6{,}63\cdot10^{-34}\,\mathrm{J\,s}$ **Planckova konstanta**.

*Preizkus:* kaj se zgodi z energijo fotona, če frekvenco potrojimo?

**2. Energija in valovna dolžina.** Odgovor: energija fotona se potroji. Za svetlobo velja še $c = \lambda\nu$, kjer je $c = 3{,}00\cdot10^{8}\,\mathrm{m/s}$. Ko v $W_f = h\nu$ vstavimo $\nu = \dfrac{c}{\lambda}$, dobimo

$$W_f = \frac{hc}{\lambda}$$

Daljša valovna dolžina pomeni manjšo energijo fotona.

Energije fotonov so drobne, zato jih pogosto pišemo v **elektronvoltih**. En elektronvolt je energija, ki jo dobi elektron, ko ga pospeši napetost $1\,\mathrm{V}$:

$$1\,\mathrm{eV} = 1{,}60\cdot10^{-19}\,\mathrm{J}$$

| Svetloba v kuhinji | $\lambda$ | $W_f$ [eV] |
|---|---|---|
| mikrovalovi v pečici | $12\,\mathrm{cm}$ | $0{,}00001$ |
| infrardeča svetloba | $1000\,\mathrm{nm}$ | $\approx 1{,}2$ |
| rdeča lučka na štedilniku | $650\,\mathrm{nm}$ | $\approx 1{,}9$ |
| modra lučka na kuhalniku vode | $450\,\mathrm{nm}$ | $\approx 2{,}8$ |
| UV-svetilka za razkuževanje | $254\,\mathrm{nm}$ | $\approx 4{,}9$ |

*Preizkus:* ima foton zelene svetlobe ($530\,\mathrm{nm}$) več ali manj energije kot foton modre lučke?

**3. Izstopno delo.** Odgovor: manj, ker ima daljšo valovno dolžino. Zdaj pogled na kovino. V kovini so prosti elektroni, ki se gibljejo po vsej kovini; zato kovina prevaja tok. Kovine pa ne morejo kar zapustiti. Površina jih zadržuje, podobno kot rob sklede zadržuje frnikolo na dnu.

Najmanjšo energijo, ki jo mora elektron dobiti, da zapusti kovino, imenujemo **izstopno delo** $A_i$. Za vsako kovino je drugačno: natrij $2{,}28\,\mathrm{eV}$, cink $4{,}3\,\mathrm{eV}$, baker $4{,}7\,\mathrm{eV}$.

*Preizkus:* iz katere od teh kovin najlaže izbijemo elektron?

**4. En foton, en elektron.** Odgovor: iz natrija, ker ima najmanjše izstopno delo. Ko svetloba pade na kovino, vsak foton vso svojo energijo naenkrat preda **enemu** elektronu. Dva fotona se ne združita, da bi skupaj izbila en elektron.

Če je $W_f < A_i$, elektron ne izleti, pa naj bo fotonov še toliko. Če je $W_f > A_i$, elektron izleti. Kar ostane od energije fotona, odnese kot kinetično energijo:

$$W_k = h\nu - A_i$$

Izbijanje elektronov iz kovine s svetlobo imenujemo **fotoefekt**, enačbo pa **Einsteinova enačba**. $W_k$ je *največja* kinetična energija izbitih elektronov; elektroni iz globljih plasti kovine del energije izgubijo že na poti do površine.

Frekvenco, pri kateri je $W_k = 0$, imenujemo **mejna frekvenca** $\nu_m = \dfrac{A_i}{h}$. Pod njo fotoefekta ni.

:::premisli
Na natrij posvetimo z rdečo svetlobo ($1{,}9\,\mathrm{eV}$), nato z modro ($2{,}8\,\mathrm{eV}$). Napovej, kaj se zgodi v vsakem primeru.
---
Rdeča elektronov ne izbije, ker je $1{,}9\,\mathrm{eV}$ manj od izstopnega dela $2{,}28\,\mathrm{eV}$. Modra jih izbije; največja kinetična energija je približno $2{,}8\,\mathrm{eV} - 2{,}28\,\mathrm{eV} \approx 0{,}5\,\mathrm{eV}$.
:::

*Preizkus:* kaj se zgodi z $W_k$, če kovino zamenjamo s takšno z večjim izstopnim delom?

**5. Jakost svetlobe.** Odgovor: $W_k$ se zmanjša, ker za izstop porabimo več energije. Kaj pa pomeni močnejša svetloba? Več fotonov v sekundi, vsak z enako energijo kot prej. Zato močnejša svetloba izbije **več** elektronov, ne pa hitrejših. Pod mejno frekvenco tudi najmočnejša svetloba ne izbije nobenega.

V simulaciji spodaj »Fotoefekt« izberi natrij, nastavi $650\,\mathrm{nm}$ in jakost $100\,\%$. Nato zmanjšaj valovno dolžino na $450\,\mathrm{nm}$ in spreminjaj jakost. Opazuj: število elektronov se spreminja, točka na grafu $W_k(\nu)$, ki kaže največjo kinetično energijo v odvisnosti od frekvence, pa ostane na mestu.

:::premisli
Zdaj reši uvodno uganko: zakaj UV-svetilka s $5\,\mathrm{W}$ poškoduje DNK, mikrovalovka z $800\,\mathrm{W}$ pa ne?
---
Za pretrganje vezi v molekuli je potrebnih nekaj eV, in to mora prinesti **en** foton. Foton UV-svetilke ima okoli $4{,}9\,\mathrm{eV}$, mikrovalovni le okoli $0{,}00001\,\mathrm{eV}$. Mikrovalovnih fotonov je ogromno, zato molekule močno stresajo in hrano segrejejo, posamezne vezi pa ne pretrgajo. Isto velja za rdeči reflektor in cinkov pladenj.
:::

## Rešeni primeri

### Primer 1: foton UV-svetilke

UV-svetilka za razkuževanje kuhinjske deske seva svetlobo z valovno dolžino $254\,\mathrm{nm}$. Kolikšna je energija enega fotona v joulih in v elektronvoltih?

**Podatki:** $\lambda = 254\,\mathrm{nm}$, $h = 6{,}63\cdot10^{-34}\,\mathrm{J\,s}$, $c = 3{,}00\cdot10^{8}\,\mathrm{m/s}$, $1\,\mathrm{eV} = 1{,}60\cdot10^{-19}\,\mathrm{J}$
**Iščemo:** energijo fotona $W_f$

:::formula
$W_f = \dfrac{hc}{\lambda}$
:::

**Rešitev:**

1. Valovno dolžino pretvorimo v metre, da se enote ujemajo: $254\,\mathrm{nm} = 2{,}54\cdot10^{-7}\,\mathrm{m}$.
2. Zmnožek $hc = 6{,}63\cdot10^{-34} \cdot 3{,}00\cdot10^{8} = 1{,}99\cdot10^{-25}$, v enotah $\mathrm{J\,m}$.
3. Delimo z valovno dolžino: $W_f = \dfrac{1{,}99\cdot10^{-25}\,\mathrm{J\,m}}{2{,}54\cdot10^{-7}\,\mathrm{m}} = 7{,}83\cdot10^{-19}\,\mathrm{J}$.
4. V elektronvoltih, ker so ti priročnejši: $\dfrac{7{,}83\cdot10^{-19}\,\mathrm{J}}{1{,}60\cdot10^{-19}\,\mathrm{J/eV}} = 4{,}89\,\mathrm{eV}$.
5. Odgovor: en foton ima energijo $7{,}83\cdot10^{-19}\,\mathrm{J}$ oziroma $4{,}89\,\mathrm{eV}$.

### Primer 2: fotoni iz mikrovalovke

Mikrovalovna pečica seva mikrovalove s frekvenco $2{,}45\,\mathrm{GHz}$ in močjo $800\,\mathrm{W}$. Kolikšna je energija enega fotona in koliko fotonov pečica izseva v sekundi? Ali lahko izbijejo elektrone iz kovinske stene pečice z izstopnim delom okoli $4{,}5\,\mathrm{eV}$?

**Podatki:** $\nu = 2{,}45\,\mathrm{GHz}$, $P = 800\,\mathrm{W}$, $t = 1\,\mathrm{s}$, $A_i \approx 4{,}5\,\mathrm{eV}$, $h = 6{,}63\cdot10^{-34}\,\mathrm{J\,s}$, $1\,\mathrm{eV} = 1{,}60\cdot10^{-19}\,\mathrm{J}$
**Iščemo:** energijo fotona $W_f$, število fotonov $N$ v eni sekundi

:::formula
$W_f = h\nu$, $\quad N = \dfrac{P\,t}{W_f}$
:::

**Rešitev:**

1. Pretvorimo frekvenco: $2{,}45\,\mathrm{GHz} = 2{,}45\cdot10^{9}\,\mathrm{Hz}$.
2. Energija fotona: $W_f = 6{,}63\cdot10^{-34} \cdot 2{,}45\cdot10^{9} = 1{,}62\cdot10^{-24}$, torej $1{,}62\cdot10^{-24}\,\mathrm{J}$.
3. V elektronvoltih: $\dfrac{1{,}62\cdot10^{-24}}{1{,}60\cdot10^{-19}} = 1{,}01\cdot10^{-5}$, torej okoli $0{,}00001\,\mathrm{eV}$.
4. V eni sekundi pečica izseva $800\,\mathrm{J}$ energije, zato je fotonov $N = \dfrac{800}{1{,}62\cdot10^{-24}} = 4{,}94\cdot10^{26}$.
5. Primerjamo z izstopnim delom: $0{,}00001\,\mathrm{eV}$ je več kot $400\,000$-krat premalo. Ker vsak foton deluje sam, se energije ne seštejejo.
6. Odgovor: foton ima $1{,}62\cdot10^{-24}\,\mathrm{J}$, pečica jih izseva okoli $4{,}9\cdot10^{26}$ v sekundi, a nobeden ne izbije elektrona iz stene.

### Primer 3: cinkov pladenj

Pladenj je prevlečen s cinkom z izstopnim delom $4{,}3\,\mathrm{eV}$. Kolikšna je največja valovna dolžina svetlobe, ki še izbije elektrone? Kolikšna je največja kinetična energija elektronov, ki jih izbije UV-svetilka iz primera 1?

**Podatki:** $A_i = 4{,}3\,\mathrm{eV}$, $\lambda = 254\,\mathrm{nm}$ in $W_f = 4{,}89\,\mathrm{eV}$ (iz primera 1), $hc = 1{,}99\cdot10^{-25}\,\mathrm{J\,m}$, $1\,\mathrm{eV} = 1{,}60\cdot10^{-19}\,\mathrm{J}$
**Iščemo:** mejno valovno dolžino $\lambda_m$ in največjo kinetično energijo $W_k$

:::formula
Na meji je $W_f = A_i$, zato $\lambda_m = \dfrac{hc}{A_i}$; nad mejo $W_k = W_f - A_i$
:::

**Rešitev:**

1. Izstopno delo v joulih: $A_i = 4{,}3 \cdot 1{,}60\cdot10^{-19} = 6{,}88\cdot10^{-19}$, torej $6{,}88\cdot10^{-19}\,\mathrm{J}$.
2. Mejna valovna dolžina: $\lambda_m = \dfrac{1{,}99\cdot10^{-25}}{6{,}88\cdot10^{-19}} = 2{,}89\cdot10^{-7}$, torej $289\,\mathrm{nm}$.
3. Vsa vidna svetloba ($400$ do $700\,\mathrm{nm}$) ima daljšo valovno dolžino, zato na cinku fotoefekta ne povzroči. Potrebna je UV-svetloba.
4. Zdaj ti: svetilka ima $254\,\mathrm{nm}$, kar je manj od $289\,\mathrm{nm}$, torej elektrone izbija. Izračunaj njihovo največjo kinetično energijo v eV in v J.

:::premisli
Kolikšna je $W_k$?
---
$W_k = 4{,}89\,\mathrm{eV} - 4{,}3\,\mathrm{eV} = 0{,}59\,\mathrm{eV}$, kar je $0{,}59 \cdot 1{,}60\cdot10^{-19}\,\mathrm{J} = 9{,}4\cdot10^{-20}\,\mathrm{J}$. Odgovor: mejna valovna dolžina je $289\,\mathrm{nm}$, izbiti elektroni imajo največ $0{,}59\,\mathrm{eV}$ kinetične energije.
:::

## Pogoste napake

- **»Močnejša svetloba izbije hitrejše elektrone.«** Tako bi sklepal, če bi si svetlobo predstavljal kot curek, ki z večjo močjo udari močneje. Večja jakost pomeni le več fotonov, vsak ima enako energijo. Več fotonov izbije več elektronov, $W_k$ pa ostane enaka.
- **»Če svetim dovolj dolgo, se energija nabere.«** Elektron dobi energijo samo od enega fotona. Če je $h\nu < A_i$, ne pomaga ne čas ne jakost.
- **»Daljša valovna dolžina, več energije.«** Velja obratno: $W_f = \dfrac{hc}{\lambda}$, zato ima rdeča svetloba šibkejše fotone kot modra, mikrovalovi pa še veliko šibkejše.
- **Napačen predznak ali enote.** Kdor zapiše $W_k = h\nu + A_i$, pozabi, da elektron izstopno delo *porabi*. Pred odštevanjem morata biti obe energiji v istih enotah, obe v eV ali obe v J.
- **»Vsi elektroni imajo energijo $h\nu - A_i$.«** To je *največja* kinetična energija. Mnogi elektroni izletijo počasneje.

## Povzetek

- Svetloba prinaša energijo v fotonih: $W_f = h\nu = \dfrac{hc}{\lambda}$, $h = 6{,}63\cdot10^{-34}\,\mathrm{J\,s}$.
- $1\,\mathrm{eV} = 1{,}60\cdot10^{-19}\,\mathrm{J}$; vidni fotoni imajo od približno $1{,}8$ do $3{,}1\,\mathrm{eV}$.
- Izstopno delo $A_i$ je najmanjša energija za izstop elektrona iz kovine; odvisno je od kovine.
- En foton izbije največ en elektron: $W_k = h\nu - A_i$ je največja kinetična energija.
- Mejna frekvenca $\nu_m = A_i/h$, mejna valovna dolžina $\lambda_m = hc/A_i$; pod mejo ni fotoefekta.
- Jakost svetlobe določa število izbitih elektronov, frekvenca pa njihovo energijo.

## Drugače: Na sliki

Nariši energijsko lestev. Spodaj je elektron v kovini, kot frnikola na dnu sklede. Rob sklede je za $A_i$ višje. Nad robom je elektron prost.

```
  energija
     ^      prost elektron
     |      .....  W_k
     |  ---------------- rob kovine
     |        ^
     |        |  A_i
     |  ---------------- elektron v kovini
```

Foton je ena puščica navzgor, njena dolžina je $h\nu$. Če puščica ne seže do roba, frnikola pade nazaj in energija se spremeni v toploto. Če seže čez rob, je del nad robom $W_k$. Več fotonov pomeni več puščic, vsaka pa je enako dolga; puščic ne moreš zložiti eno na drugo.

## Drugače: Bolj natančno

Pred letom 1905 so svetlobo opisovali samo kot valovanje. Po tem opisu bi morala močnejša svetloba vedno izbijati elektrone, le dovolj dolgo bi morali čakati, da se energija nabere. Poskusi so pokazali drugače: pod mejno frekvenco elektronov ni, nad njo izletijo takoj. Einstein je to pojasnil s fotoni in leta 1921 za to dobil Nobelovo nagrado.

Največjo kinetično energijo izmerimo z **zaporno napetostjo** $U_z$: med kovino in zbiralno elektrodo priključimo nasprotno napetost in jo večamo, dokler tok ne pade na nič. Takrat velja $e_0 U_z = W_k$, kjer je $e_0 = 1{,}60\cdot10^{-19}\,\mathrm{As}$ osnovni naboj. Zaporna napetost $0{,}59\,\mathrm{V}$ torej pomeni $W_k = 0{,}59\,\mathrm{eV}$.

Graf $W_k(\nu)$ je premica. Njen naklon je $h$ za vse kovine enak, presečišče z osjo $\nu$ pa je mejna frekvenca $\nu_m$ posamezne kovine. Tak graf je desno v simulaciji. Z njim je Millikan leta 1916 izmeril Planckovo konstanto.

Za hitro računanje v eV si zapomni $hc \approx 1240\,\mathrm{eV\,nm}$. Tako je $W_f \approx \dfrac{1240\,\mathrm{eV\,nm}}{\lambda}$, če je $\lambda$ v nanometrih.

## Preveri se

? Katera trditev o fotonih je pravilna?
- Močnejša svetloba ima fotone z večjo energijo.
~ Jakost pove, koliko fotonov pride v sekundi. Energija posameznega fotona je odvisna le od frekvence.
+ Foton modre svetlobe ima več energije kot foton rdeče.
- Foton z daljšo valovno dolžino ima več energije.
~ Velja obratno: $W_f = \dfrac{hc}{\lambda}$, daljša valovna dolžina pomeni manjšo energijo.
- Energija fotona je odvisna od kovine, na katero pade.
~ Od kovine je odvisno izstopno delo $A_i$, ne energija fotona.
> Modra svetloba ima krajšo valovno dolžino in večjo frekvenco kot rdeča, zato je $W_f = h\nu$ večja.

? Modra lučka na kuhalniku vode sveti z valovno dolžino $450\,\mathrm{nm}$. Kolikšna je energija enega fotona?
- $0{,}36\,\mathrm{eV}$
~ To dobiš, če ulomek obrneš in računaš $\dfrac{\lambda}{hc}$. Valovna dolžina je v imenovalcu.
+ $2{,}76\,\mathrm{eV}$
- $4{,}42\cdot10^{-19}\,\mathrm{eV}$
~ To je energija v joulih, ne v eV. Deli še z $1{,}60\cdot10^{-19}\,\mathrm{J/eV}$.
> $W_f = \dfrac{hc}{\lambda} = \dfrac{1{,}99\cdot10^{-25}\,\mathrm{J\,m}}{4{,}50\cdot10^{-7}\,\mathrm{m}} = 4{,}42\cdot10^{-19}\,\mathrm{J} = 2{,}76\,\mathrm{eV}$.

? Ana je računala, kaj se zgodi, ko na natrij ($A_i = 2{,}28\,\mathrm{eV}$) posveti z dvakrat močnejšo UV-svetlobo $254\,\mathrm{nm}$. Korak 1: $W_f = 4{,}89\,\mathrm{eV}$. Korak 2: svetloba je dvakrat močnejša, zato $W_f = 9{,}78\,\mathrm{eV}$. Korak 3: $W_k = 9{,}78\,\mathrm{eV} - 2{,}28\,\mathrm{eV} = 7{,}50\,\mathrm{eV}$. Kje je napaka?
- V koraku 1.
~ Korak 1 je pravilen: to je energija fotona s $254\,\mathrm{nm}$ iz primera 1.
+ V koraku 2.
- V koraku 3.
~ Odštevanje je pravilno zapisano, a uporablja napačno vrednost iz koraka 2.
- Napake ni.
~ Napaka je: jakost ne spremeni energije enega fotona.
> Dvakrat močnejša svetloba ima dvakrat več fotonov, vsak še vedno $4{,}89\,\mathrm{eV}$. Pravilno je $W_k = 4{,}89\,\mathrm{eV} - 2{,}28\,\mathrm{eV} = 2{,}61\,\mathrm{eV}$; izbitih elektronov je le dvakrat več.

? Isto UV-svetilko ($254\,\mathrm{nm}$) usmerimo na cinkov pladenj ($A_i = 4{,}3\,\mathrm{eV}$) in na bakren lonec ($A_i = 4{,}7\,\mathrm{eV}$). Kje imajo izbiti elektroni večjo največjo kinetično energijo?
+ Pri cinku.
- Pri bakru.
~ Večje izstopno delo pomeni, da elektron za izstop porabi več energije, zato mu je ostane manj.
- Pri obeh enako, ker je svetloba ista.
~ Energija fotona je res enaka, a $W_k = W_f - A_i$ je odvisna tudi od kovine.
- Pri nobenem, UV-svetloba ne izbija elektronov iz kovin.
~ Izbija, kadar je $W_f > A_i$; tu je $4{,}89\,\mathrm{eV}$ več od obeh izstopnih del.
> Cink: $4{,}89 - 4{,}3 = 0{,}59\,\mathrm{eV}$; baker: $4{,}89 - 4{,}7 = 0{,}19\,\mathrm{eV}$. Manjše izstopno delo pusti več energije.

? Samodejna luč nad kuhinjskim pultom ima svetlobno tipalo, ki deluje na fotoefekt in ima izstopno delo $2{,}0\,\mathrm{eV}$. Ali ga sproži infrardeča svetloba daljinca z valovno dolžino $940\,\mathrm{nm}$, če je zelo močna?
- Da, če je svetloba dovolj močna.
~ Jakost doda le fotone. Vsak foton ima samo okoli $1{,}3\,\mathrm{eV}$, kar je premalo.
- Da, ker infrardeča svetloba prenaša toploto.
~ Segrevanje ni fotoefekt. Za izbitje elektrona mora en foton imeti vsaj $2{,}0\,\mathrm{eV}$.
+ Ne, ker ima en foton premalo energije.
> $W_f \approx \dfrac{1240\,\mathrm{eV\,nm}}{940\,\mathrm{nm}} \approx 1{,}3\,\mathrm{eV} < 2{,}0\,\mathrm{eV}$. Fotoefekta ni pri nobeni jakosti.

:::simboli
W_f | energija fotona | W_f = h\nu = \frac{hc}{\lambda} | J | pogosto v eV; 1 eV = 1,60 · 10⁻¹⁹ J
h | Planckova konstanta | | J\,s | h = 6,63 · 10⁻³⁴ J s
\nu | frekvenca svetlobe | \nu = \frac{c}{\lambda} | Hz
\nu_m | mejna frekvenca | \nu_m = \frac{A_i}{h} | Hz | pod njo elektroni ne izletijo
c | hitrost svetlobe | c = \lambda\nu | m/s | c = 3,00 · 10⁸ m/s
\lambda | valovna dolžina svetlobe | \lambda = \frac{c}{\nu} | m
\lambda_m | mejna valovna dolžina | \lambda_m = \frac{hc}{A_i} | m | pri daljših valovnih dolžinah fotoefekta ni
W_k | največja kinetična energija izbitih elektronov | W_k = h\nu - A_i | J | pogosto v eV
A_i | izstopno delo kovine | | J | lastnost kovine; pogosto v eV
N | število fotonov | N = \frac{P\,t}{W_f} | – |
P | moč vira sevanja | | W |
t | čas | | s
:::
