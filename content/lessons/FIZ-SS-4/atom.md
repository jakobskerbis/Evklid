---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Telefon določi tvoj položaj iz signalov satelitov GPS. Signal potuje s hitrostjo svetlobe, $3{,}00\cdot10^{8}\,\mathrm{m/s}$. Če ura na satelitu zgreši za eno milijoninko sekunde, je položaj napačen za $3{,}00\cdot10^{8}\,\mathrm{m/s} \cdot 10^{-6}\,\mathrm{s} = 300\,\mathrm{m}$. Zemljevid bi te postavil nekaj ulic stran.

Zato sateliti nosijo **atomske ure**. Sekunda je danes definirana z atomom cezija. Sevanje, ki ga oddaja cezij, v eni sekundi naredi natanko $9\,192\,631\,770$ nihajev. Vsak atom cezija na svetu seva s točno to frekvenco.

Zakaj so vsi atomi enaki do zadnje števke? In zakaj ulična svetilka z natrijem skozi spektroskop, pripet na kamero telefona, pokaže skoraj samo eno rumeno črto pri $589\,\mathrm{nm}$, svetilka telefona pa neprekinjeno mavrico? Spektroskop je priprava, ki svetlobo razkloni po valovnih dolžinah. Odgovor je v zgradbi atoma.

## Razlaga

Začnimo s poskusom. Cev z redkim vodikom priključimo na visoko napetost in zažari. Skozi spektroskop ne vidimo mavrice, ampak le štiri barvne črte. Energijo fotonov izračunamo kot pri fotoefektu, $W_f = \dfrac{hc}{\lambda}$, kjer je $hc \approx 1240\,\mathrm{eV\,nm}$.

| Barva črte | $\lambda$ [nm] | $W_f$ [eV] |
|---|---|---|
| rdeča | $656$ | $1{,}89$ |
| modrozelena | $486$ | $2{,}55$ |
| modra | $434$ | $2{,}86$ |
| vijolična | $410$ | $3{,}02$ |

Vodik torej seva samo fotone teh energij, drugih ne. Spekter iz posameznih črt imenujemo **črtasti spekter**.

Zdaj pa seznam števil, ki ga je predlagal Niels Bohr. Po njegovem modelu ima elektron v vodikovem atomu lahko le energije

$$E_n = -\frac{13{,}6\,\mathrm{eV}}{n^2}, \quad n = 1, 2, 3, \ldots$$

To so $E_1 = -13{,}6\,\mathrm{eV}$, $E_2 = -3{,}40\,\mathrm{eV}$, $E_3 = -1{,}51\,\mathrm{eV}$, $E_4 = -0{,}85\,\mathrm{eV}$, $E_5 = -0{,}54\,\mathrm{eV}$ in $E_6 = -0{,}38\,\mathrm{eV}$. Zakaj so negativne, pojasnimo malo niže.

Poišči vzorec sam: izračunaj $E_3 - E_2$ in $E_4 - E_2$. Dobiš $1{,}89\,\mathrm{eV}$ in $2{,}55\,\mathrm{eV}$, točno energiji prvih dveh črt. Tudi $E_5 - E_2 = 2{,}86\,\mathrm{eV}$ in $E_6 - E_2 = 3{,}02\,\mathrm{eV}$ se ujemata. Vse štiri vidne črte so razlike med nekim višjim nivojem in nivojem $n = 2$.

Zdaj lahko pravilo poimenujemo. Dovoljene energije elektrona v atomu so **energijski nivoji**. Elektron ne more imeti energije med njimi. Ko **preskoči** z višjega nivoja $E_z$ na nižji $E_k$, atom izseva en foton z energijo, ki je enaka razliki:

$$h\nu = E_z - E_k$$

Ker so nivoji za vse atome istega elementa enaki, so enake tudi črte. Zato vsi atomi cezija sevajo z isto frekvenco.

:::premisli
Napovej: ali ima lahko kakšna črta vodika, ki konča na $n = 2$, energijo večjo od $3{,}40\,\mathrm{eV}$?
---
Ne. Najvišji nivo je blizu $0$, zato je največja možna razlika do $n = 2$ ravno $0 - (-3{,}40\,\mathrm{eV}) = 3{,}40\,\mathrm{eV}$. Črte se proti tej meji zgoščujejo, mejna valovna dolžina je približno $365\,\mathrm{nm}$.
:::

Zakaj so energije negativne? Ničlo izberemo tam, kjer je elektron prost, daleč od jedra. Vezan elektron ima manj energije, zato je ta negativna, kot pri izstopnem delu iz kovine. Nivo $n = 1$ je **osnovno stanje**, višji nivoji so **vzbujena stanja**. Da elektron iz osnovnega stanja odtrgamo, potrebujemo $13{,}6\,\mathrm{eV}$; to je **ionizacijska energija** vodika.

Pozor pri primerjanju: $-0{,}85\,\mathrm{eV}$ je *več* kot $-3{,}40\,\mathrm{eV}$. Večji $n$ pomeni višji nivo.

Velja tudi obratno. Bela svetloba vsebuje fotone vseh energij. Ko gre skozi hladnejši plin, atomi **absorbirajo** samo fotone, katerih energija je točno enaka razliki dveh nivojev; elektron pri tem skoči navzgor. V spektru ostanejo temne črte na mavričnem ozadju. Pri vodiku je treba paziti: hladen vodik je skoraj ves v osnovnem stanju $n = 1$, zato vpija le ultravijolične fotone. Temne *vidne* črte vodika nastanejo tam, kjer je veliko atomov na nivoju $n = 2$, na primer v ozračju vroče zvezde. To je **absorpcijski spekter**. Svetle črte žarečega plina so **emisijski spekter**. Žareča nitka ali Sonce pa dasta **zvezni spekter**, mavrico brez vrzeli.

:::premisli
Zakaj so temne črte v absorpcijskem spektru vodika točno na istih mestih kot svetle črte v emisijskem?
---
Ker gre v obeh primerih za iste nivoje. Pri emisiji elektron pade z $E_z$ na $E_k$ in odda foton $E_z - E_k$, pri absorpciji isti foton dvigne elektron z $E_k$ na $E_z$. Razlika energij je ista, zato tudi valovna dolžina.
:::

V simulaciji spodaj »Bohrov model in spekter vodika« nastavi začetni nivo 3 in končnega 2 (v simulaciji se nivoji imenujejo lupine) ter izsevaj foton. Ponovi za začetne nivoje 4, 5 in 6. Opazuj, kako se črte proti vijoličnemu koncu zgoščujejo. Nato poskusi prehod z 2 na 1: črte v vidnem delu ni, ker je foton ultravijoličen.

## Rešeni primeri

### Primer 1: modrozelena črta

S spektroskopom na telefonu opazujemo vodikovo cev. Elektron preskoči z nivoja $n = 4$ na $n = 2$. Kolikšna je energija izsevanega fotona in kolikšna valovna dolžina?

**Podatki:** $E_4 = -0{,}85\,\mathrm{eV}$, $E_2 = -3{,}40\,\mathrm{eV}$, $hc = 1240\,\mathrm{eV\,nm}$
**Iščemo:** energijo fotona $W_f$ in valovno dolžino $\lambda$

:::formula
$W_f = E_z - E_k$, $\quad \lambda = \dfrac{hc}{W_f}$
:::

**Rešitev:**

1. Energija fotona je razlika nivojev, ker foton odnese vso energijo, ki jo elektron izgubi: $W_f = -0{,}85\,\mathrm{eV} - (-3{,}40\,\mathrm{eV}) = 2{,}55\,\mathrm{eV}$.
2. Valovna dolžina: $\lambda = \dfrac{1240}{2{,}55} = 486$, torej $486\,\mathrm{nm}$.
3. Odgovor: foton ima $2{,}55\,\mathrm{eV}$ in valovno dolžino $486\,\mathrm{nm}$, to je modrozelena črta.

### Primer 2: natrijeva svetilka

Spektroskop na telefonu pokaže, da natrijeva ulična svetilka sveti pri $589\,\mathrm{nm}$. Za koliko se razlikujeta nivoja natrija, med katerima elektron preskakuje? Rezultat podaj v eV in J.

**Podatki:** $\lambda = 589\,\mathrm{nm}$, $hc = 1240\,\mathrm{eV\,nm}$, $1\,\mathrm{eV} = 1{,}60\cdot10^{-19}\,\mathrm{J}$
**Iščemo:** razliko nivojev $\Delta E$

:::formula
$\Delta E = W_f = \dfrac{hc}{\lambda}$
:::

**Rešitev:**

1. Razlika nivojev je enaka energiji izsevanega fotona: $\Delta E = \dfrac{1240}{589} = 2{,}11$, torej $2{,}11\,\mathrm{eV}$.
2. V joulih: $2{,}11 \cdot 1{,}60\cdot10^{-19} = 3{,}38\cdot10^{-19}$, torej $3{,}38\cdot10^{-19}\,\mathrm{J}$.
3. Odgovor: nivoja se razlikujeta za $2{,}11\,\mathrm{eV}$ ($3{,}38\cdot10^{-19}\,\mathrm{J}$). Hladni natrijevi hlapi bi iz bele svetlobe absorbirali prav to rumeno barvo.

### Primer 3: ali zaslon telefona vzbudi vodik?

Zaslon telefona sveti z valovnimi dolžinami od $400$ do $700\,\mathrm{nm}$. Ali lahko ta svetloba vzbudi vodikov atom, ki je v osnovnem stanju?

**Podatki:** $\lambda_{\min} = 400\,\mathrm{nm}$, $\lambda_{\max} = 700\,\mathrm{nm}$, $E_1 = -13{,}6\,\mathrm{eV}$, $E_2 = -3{,}40\,\mathrm{eV}$, $hc = 1240\,\mathrm{eV\,nm}$
**Iščemo:** ali ima kateri foton zaslona dovolj energije za prehod z $n = 1$ na $n = 2$

:::formula
$W_f = E_2 - E_1$ (najmanjši možni skok navzgor), $\quad W_f = \dfrac{hc}{\lambda}$
:::

**Rešitev:**

1. Najmanjša energija, ki vzbudi atom, je skok na najbližji nivo: $E_2 - E_1 = -3{,}40\,\mathrm{eV} - (-13{,}6\,\mathrm{eV}) = 10{,}2\,\mathrm{eV}$.
2. Največjo energijo ima foton z najkrajšo valovno dolžino: $W_f = \dfrac{1240}{400} = 3{,}10$, torej $3{,}10\,\mathrm{eV}$.
3. Zdaj ti: primerjaj obe energiji in odgovori na vprašanje. Nato izračunaj, kolikšno valovno dolžino bi moral imeti foton, ki atom vzbudi na $n = 2$.

:::premisli
Kakšen je odgovor?
---
$3{,}10\,\mathrm{eV} < 10{,}2\,\mathrm{eV}$, zato svetloba zaslona vodika v osnovnem stanju ne vzbudi; fotoni s še daljšo valovno dolžino imajo še manj energije. Potreben foton ima $\lambda = \dfrac{1240\,\mathrm{eV\,nm}}{10{,}2\,\mathrm{eV}} = 122\,\mathrm{nm}$, to je ultravijolična svetloba.
:::

## Pogoste napake

- **»Atom absorbira vsak foton, ki ima dovolj energije.«** Tako sklepaš, če prenašaš pravilo iz fotoefekta. Pri prehodu med nivoji mora biti energija fotona *točno* enaka razliki nivojev; foton z $2{,}00\,\mathrm{eV}$ gre skozi vodik neovirano. Izjema je ionizacija: foton z več kot $13{,}6\,\mathrm{eV}$ elektron odtrga, presežek pa elektron odnese kot kinetično energijo.
- **Valovna dolžina iz energije enega nivoja.** Kdor računa $\lambda = \dfrac{1240}{3{,}40}$ za prehod $3 \to 2$, pozabi, da foton odnese *razliko*. Pravilno je $\dfrac{1240}{1{,}89} = 656\,\mathrm{nm}$.
- **»$-0{,}85$ je manj kot $-3{,}40$.«** Ker sta števili negativni, je $-0{,}85\,\mathrm{eV}$ večja energija. Višji $n$ pomeni višji nivo, bližje ničli.
- **»Večji skok da daljšo valovno dolžino.«** Večji skok da več energije in zato *krajšo* valovno dolžino. Skok $2 \to 1$ ($10{,}2\,\mathrm{eV}$) je ultravijoličen, $3 \to 2$ ($1{,}89\,\mathrm{eV}$) pa rdeč.
- **»Absorpcijske črte so na drugih mestih kot emisijske.«** So na istih, ker gre za iste pare nivojev, le smer skoka je obrnjena.

## Povzetek

- Elektron v atomu ima lahko le določene energije, energijske nivoje; za vodik $E_n = -\dfrac{13{,}6\,\mathrm{eV}}{n^2}$.
- Pri skoku navzdol atom izseva foton, pri skoku navzgor ga absorbira: $h\nu = E_z - E_k$.
- $n = 1$ je osnovno stanje, višji nivoji so vzbujena stanja; ionizacijska energija vodika je $13{,}6\,\mathrm{eV}$.
- Plin seva črtasti emisijski spekter; bela svetloba skozi hladen plin da absorpcijski spekter s temnimi črtami na istih mestih.
- Vsak element ima svoje nivoje, zato svoj spekter; po njem elemente prepoznamo.
- Vidne črte vodika (Balmerjeva serija) končajo na $n = 2$: $656$, $486$, $434$ in $410\,\mathrm{nm}$.

## Drugače: Korak za korakom s številkami

Koliko različnih črt lahko izseva vodik, ko je elektron na $n = 4$?

1. Izpiši nivoje: $E_4 = -0{,}85\,\mathrm{eV}$, $E_3 = -1{,}51\,\mathrm{eV}$, $E_2 = -3{,}40\,\mathrm{eV}$, $E_1 = -13{,}6\,\mathrm{eV}$.
2. Naštej vse skoke navzdol. Elektron lahko skoči naravnost ali po stopnicah: $4 \to 3$, $4 \to 2$, $4 \to 1$, $3 \to 2$, $3 \to 1$, $2 \to 1$. To je šest črt.
3. Izračunaj razlike: $0{,}66$; $2{,}55$; $12{,}75$; $1{,}89$; $12{,}09$ in $10{,}2\,\mathrm{eV}$.
4. Vsako deli v $1240\,\mathrm{eV\,nm}$: približno $1880$, $486$, $97$, $656$, $103$ in $122\,\mathrm{nm}$.
5. Razvrsti: vidni sta le $486\,\mathrm{nm}$ in $656\,\mathrm{nm}$. Črta pri $1880\,\mathrm{nm}$ je infrardeča, preostale tri so ultravijolične.

Pravilo: največji skok da najkrajšo valovno dolžino.

## Drugače: Kot zgodba

Leta 1885 je švicarski učitelj Johann Balmer gledal štiri izmerjene valovne dolžine vodika: $656$, $486$, $434$ in $410\,\mathrm{nm}$. Fizike ni znal razložiti, a je iskal vzorec, kot ga ti iščeš v nizu števil. Našel ga je:

$$\lambda = 364{,}6\,\mathrm{nm} \cdot \frac{n^2}{n^2 - 4}$$

Za $n = 3$ da $656\,\mathrm{nm}$, za $n = 4$ pa $486\,\mathrm{nm}$. Zakaj ravno to, ni vedel nihče.

Skoraj trideset let pozneje, leta 1913, je Niels Bohr predlagal drzno idejo: elektron v atomu ne more imeti katerekoli energije, ampak le nekatere, kot da bi stal na stopnicah, ne na klančini. Ko skoči z višje stopnice na nižjo, odda foton, ki odnese razliko. Iz te ideje je dobil $E_n = -\dfrac{13{,}6\,\mathrm{eV}}{n^2}$, in Balmerjeva formula je iz nje sledila sama. Število $364{,}6\,\mathrm{nm}$ je ravno valovna dolžina fotona s $3{,}40\,\mathrm{eV}$, ko elektron pade iz neskončnosti na $n = 2$.

Danes ista ideja teče v tvojem telefonu: atomske ure v satelitih štejejo nihaje sevanja, ki ga cezij odda pri skoku med dvema svojima nivojema.

## Preveri se

? Bela svetloba gre skozi razredčen vodik v ozračju vroče zvezde, kjer je veliko atomov na nivoju $n = 2$, in nato skozi spektroskop. Kateri opis slike spektra ustreza?
+ Mavrica s temnimi črtami pri $656$, $486$, $434$ in $410\,\mathrm{nm}$.
- Temno ozadje s svetlimi barvnimi črtami pri $656$, $486$, $434$ in $410\,\mathrm{nm}$.
~ To je emisijski spekter žarečega plina. Pri beli svetlobi skozi plin ostane mavrica, iz nje pa manjkajo absorbirane barve.
- Neprekinjena mavrica brez črt.
~ Atomi vodika absorbirajo fotone z energijami, ki ustrezajo razlikam nivojev, zato te barve manjkajo.
- Mavrica s temnimi črtami na drugih mestih kot emisijske črte vodika.
~ Absorpcija in emisija gresta med istimi pari nivojev, zato so črte na istih mestih.
> Absorpcijski spekter: atomi vzamejo iz bele svetlobe le fotone z energijo, ki je točno razlika nivojev, zato nastanejo temne črte na mestih emisijskih črt.

? Zaslon telefona sveti zeleno pri $530\,\mathrm{nm}$. Približno za koliko se razlikujeta nivoja, med katerima elektron preskoči, ko izseva tak foton?
- Približno $0{,}2\,\mathrm{eV}$.
~ Za desetkrat premalo: $\dfrac{1240}{530}$ je malo več kot $2$, ne $0{,}2$.
+ Približno $2\,\mathrm{eV}$.
- Približno $20\,\mathrm{eV}$.
~ Za desetkrat preveč. Taki fotoni bi bili že daleč v ultravijoličnem delu.
- Približno $530\,\mathrm{eV}$.
~ Valovna dolžina v nm ni energija v eV. Energijo dobiš z deljenjem $hc$ z $\lambda$.
> $W_f \approx \dfrac{1240\,\mathrm{eV\,nm}}{530\,\mathrm{nm}} \approx 2{,}3\,\mathrm{eV}$, torej približno $2\,\mathrm{eV}$, kot vsi vidni fotoni.

? Zakaj ima vsak element svoj značilen črtasti spekter?
- Ker ima vsak element atome drugačne barve.
~ Atomi nimajo barve. Barva svetlobe je določena z energijo fotona, ta pa z razliko nivojev.
+ Ker ima vsak element svoje energijske nivoje, fotoni pa nosijo razlike med njimi.
- Ker vsak element seva svetlobo samo ene valovne dolžine.
~ Večina elementov ima veliko črt; vodik jih ima v vidnem delu štiri. Značilen je cel nabor črt.
> Nivoji so odvisni od zgradbe atoma (naboja jedra in števila elektronov). Drugi nivoji pomenijo druge razlike in s tem drugačne črte, zato po spektru prepoznamo element, na primer v zvezdah.

? Vodik izseva foton z energijo $12{,}09\,\mathrm{eV}$. Med katerima nivojema je elektron preskočil?
- Z $n = 2$ na $n = 1$.
~ Ta skok da $-3{,}40 - (-13{,}6) = 10{,}2\,\mathrm{eV}$.
+ Z $n = 3$ na $n = 1$.
- Z $n = 3$ na $n = 2$.
~ Ta skok da le $1{,}89\,\mathrm{eV}$, rdečo črto.
- Z $n = 1$ na $n = 3$.
~ Skok navzgor foton absorbira, ne izseva. Izsevan foton pomeni skok navzdol.
> $E_3 - E_1 = -1{,}51\,\mathrm{eV} - (-13{,}6\,\mathrm{eV}) = 12{,}09\,\mathrm{eV}$.

? Namišljen atom ima le tri nivoje: $-10\,\mathrm{eV}$, $-4\,\mathrm{eV}$ in $-1\,\mathrm{eV}$. Elektron je na najvišjem. Fotone katerih energij lahko atom izseva, ko se elektron vrača v osnovno stanje?
- Samo $9\,\mathrm{eV}$.
~ Elektron lahko skoči tudi po stopnicah, najprej na $-4\,\mathrm{eV}$ in nato na $-10\,\mathrm{eV}$.
- $1\,\mathrm{eV}$, $4\,\mathrm{eV}$ in $10\,\mathrm{eV}$.
~ To so velikosti nivojev. Foton odnese razliko med nivojema, ne energije enega nivoja.
+ $3\,\mathrm{eV}$, $6\,\mathrm{eV}$ in $9\,\mathrm{eV}$.
- Samo $3\,\mathrm{eV}$ in $6\,\mathrm{eV}$.
~ Pozabil si neposredni skok z $-1\,\mathrm{eV}$ na $-10\,\mathrm{eV}$, ki da $9\,\mathrm{eV}$.
> Razlike: $-1 - (-4) = 3\,\mathrm{eV}$, $-4 - (-10) = 6\,\mathrm{eV}$, $-1 - (-10) = 9\,\mathrm{eV}$. Vsak par nivojev da svojo črto.

:::simboli
E_n | energija n-tega nivoja vodika | E_n = -\frac{13{,}6\,\mathrm{eV}}{n^2} | eV
n | zaporedna številka energijskega nivoja | | – | n = 1, 2, 3, …
h | Planckova konstanta | | J\,s | v računih hc ≈ 1240 eV nm
\nu | frekvenca izsevanega fotona | | Hz
E_z | začetni (višji) energijski nivo | | eV | pri absorpciji je to končni nivo
E_k | končni (nižji) energijski nivo | | eV | ne kinetična energija
W_f | energija fotona | W_f = \dfrac{hc}{\lambda} | eV
\lambda | valovna dolžina svetlobe | \lambda = \dfrac{hc}{W_f} | nm
c | hitrost svetlobe | | m/s | 3,00 · 10⁸ m/s
\Delta E | razlika energijskih nivojev | \Delta E = W_f = \dfrac{hc}{\lambda} | eV
E_1, E_2 | energiji prvega in drugega nivoja | | eV | E₁ = −13,6 eV, E₂ = −3,40 eV
:::
