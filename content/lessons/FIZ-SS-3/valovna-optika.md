---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec drži telefon z vklopljeno lučko in trdi: »Svetloba je žarek in gre naravnost. Če posvetim skozi ozko režo, dobim na steni ozko svetlo črto. Ožja kot je reža, ožja je črta. Pri geometrijski optiki smo vendar risali same ravne črte.«

Zveni logično, a poskus z laserskim kazalnikom pokaže nekaj drugega. Ko režo ožimo, se svetla lisa na steni **širi**, ob njej pa se pojavijo temni in svetli pasovi. Žarki tega ne znajo razložiti. Razloži pa valovanje, ki ga že poznaš pri zvoku in na vodi.

Ista ideja je skrita v tehniki okoli tebe: v mavričnih barvah na zgoščenki, v zaslonu telefona, ki skozi polarizacijska sončna očala ob zasuku potemni, in v tem, kako drobne podrobnosti še loči kamera telefona. Ta lekcija razsodi, kdo ima prav.

## Razlaga

**1. Žarki ali valovi?** Svetloba je elektromagnetno valovanje z valovno dolžino od $380$ do $750\,\mathrm{nm}$. Geometrijska optika z žarki dobro deluje, kadar so ovire in odprtine **veliko večje** od valovne dolžine: okno, leča, bazen. Čim bližje je širina odprtine valovni dolžini, tem bolj se pokaže valovna narava; pri laserju jo opaziš že na reži, ožji od milimetra. Primerjaj napovedi:

| poskus | napoved žarkov | kaj res vidimo |
|---|---|---|
| svetloba skozi okno | ostra senca okvirja | ostra senca okvirja |
| laser skozi ozko režo | ozka črta | širok pas, ožja reža da širšega |
| laser skozi dve ozki reži | dve svetli črti | vrsta enako razmaknjenih pasov |
| dva polarizatorja, zasukana za $90^\circ$ | nič se ne spremeni | skoraj temno |

V prvi vrstici se napovedi ujemata, v ostalih ne. To so trije pojavi valovne optike: **uklon**, **interferenca** in **polarizacija**.

**2. Uklon.** Zvok slišiš izza odprtih vrat, čeprav govorca ne vidiš. Zvok ima valovno dolžino okoli metra, podobno širini vrat, zato se za vrati razširi na vse strani. Temu rečemo **uklon**: valovanje se za robom ali odprtino širi tudi v območje, ki bi bilo po ravnih črtah v senci. Svetloba ima okoli milijonkrat krajšo valovno dolžino, zato se opazno ukloni šele na reži, široki manj kot milimeter.

Kot $\varphi$ merimo od prvotne smeri svetlobe. Pri reži s širino $b$ je v smeri $\varphi_1$ prvi temni pas ob osrednjem svetlem pasu. Velja enačba:

$$\sin\varphi_1 = \frac{\lambda}{b}$$

Preverimo sošolčevo trditev z rdečim laserjem, $\lambda = 650\,\mathrm{nm}$, in režo $b = 0{,}1\,\mathrm{mm}$:

$$\sin\varphi_1 = \frac{650\cdot10^{-9}\,\mathrm{m}}{0{,}1\cdot10^{-3}\,\mathrm{m}} = 0{,}0065$$

Na steni $L = 2\,\mathrm{m}$ daleč je prvi temni pas od sredine oddaljen za $x_1 \approx L \sin\varphi_1 = 13\,\mathrm{mm}$. Osrednji svetli pas je torej širok okoli $26\,\mathrm{mm}$, kar je $260$-krat več od reže.

:::premisli
Režo zožimo na polovico, na $0{,}05\,\mathrm{mm}$. Kako širok bo zdaj osrednji svetli pas? Napovej, preden pogledaš.
---
Pas se razširi na dvakratno širino, okoli $52\,\mathrm{mm}$, ker je $\sin\varphi_1$ obratno sorazmeren z $b$. Sošolec je imel ravno narobe: ožja reža da širši pas.
:::

**3. Interferenca na dveh režah.** Pri valovanju na vodi si spoznal: ko se srečata dva vala, se njuna odmika seštejeta. To je **interferenca**. Pri svetlobi je enako, le da potrebujemo dva izvira, ki nihata usklajeno. Dobimo ju, če en laserski snop posvetimo na dve ozki reži v razmiku $d$. Vsaka reža zaradi uklona razširi svetlobo, za režama se oba vala prekrivata.

Do točke na zaslonu v smeri $\varphi$ prepotuje val iz ene reže daljšo pot. Razlika poti je $d\sin\varphi$. Če je ta razlika cel večkratnik valovne dolžine, prideta vala z vrhom ob vrhu in se ojačita. Svetel pas (ojačitev) dobimo, kadar velja enačba:

$$d \sin\varphi = N\lambda$$

Tu je $N = 0, 1, 2, \ldots$ red ojačitve. Vmes, kjer se razlikujeta poti za pol valovne dolžine več, se vala izničita in je temno. Za majhne kote so pasovi na zaslonu na razdalji $L$ enakomerno razmaknjeni. Razmik pasov je:

$$\Delta x = \frac{\lambda L}{d}$$

Thomas Young je na začetku 19. stoletja s takim poskusom prvi izmeril valovno dolžino svetlobe. V simulaciji spodaj »Interferenca na dveh režah« povečaj razmik med režama. Opazuj, kako se pasovi zgostijo; potem zamenjaj rdečo svetlobo z modro in primerjaj.

**4. Uklonska mrežica.** Če je rež na stotine, dobimo **uklonsko mrežico**. Za smeri ojačitev velja ista enačba $d \sin\varphi = N\lambda$, le da so svetli pasovi zdaj ozki in zelo svetli, vmes pa je skoraj povsem temno. Mrežica različne barve pošlje v različne smeri, zato bela svetloba razpade v mavrico. Sinus ne more biti večji od $1$, zato je število redov omejeno.

**5. Polarizacija.** Tu se svetloba loči od zvoka. Zvok je vzdolžno valovanje, svetloba je prečno: električno polje $\vec E$ niha pravokotno na smer širjenja. Navadna svetloba žarnice ali Sonca je **nepolarizirana**: $\vec E$ niha v vseh smereh, pravokotnih na smer širjenja. **Polarizator** prepusti le nihanje v eni smeri in prepuščena svetloba je **polarizirana**. Iz nepolarizirane svetlobe prepusti polovico jakosti, ne glede na to, kako ga zasučemo.

Če na polarizirano svetlobo z jakostjo $j_0$ postavimo drugi polarizator, zasukan za kot $\theta$ glede na smer polarizacije svetlobe, prepusti jakost $j$ (Malusov zakon):

$$j = j_0 \cos^2\theta$$

Pri $\theta = 90^\circ$ je $\cos\theta = 0$ in svetloba ne pride skozi. Zvoka ne moreš polarizirati: vzdolžno nihanje nima smeri, ki bi jo polarizator lahko izbral. Prav polarizacija dokazuje, da je svetloba prečno valovanje.

:::premisli
Zaslon telefona sveti že polarizirano svetlobo. Zakaj ga skozi polarizacijska sončna očala vidiš normalno, ko telefon držiš navpično, ob zasuku telefona za $90^\circ$ pa skoraj temnega?
---
Smer polarizacije zaslona se zasuče skupaj s telefonom. Pri enem položaju je vzporedna s prepustno smerjo očal ($\cos^2 0^\circ = 1$), po zasuku za $90^\circ$ pa pravokotna ($\cos^2 90^\circ = 0$).
:::

## Rešeni primeri

### Primer 1 (lažji): razmik pasov

Rdeč laserski kazalnik z valovno dolžino $650\,\mathrm{nm}$ posveti na dve reži z razmikom $0{,}25\,\mathrm{mm}$. Zaslon je $2{,}0\,\mathrm{m}$ za režama. Kolikšen je razmik med sosednjima svetlima pasovoma?

**Podatki:** $\lambda = 650\,\mathrm{nm} = 650\cdot10^{-9}\,\mathrm{m}$, $d = 0{,}25\,\mathrm{mm} = 0{,}25\cdot10^{-3}\,\mathrm{m}$, $L = 2{,}0\,\mathrm{m}$
**Iščemo:** razmik pasov $\Delta x$

:::formula
$\Delta x = \dfrac{\lambda L}{d}$
:::

**Rešitev:**

1. Vse dolžine pretvorimo v metre, ker se sicer enote ne pokrajšajo.
2. $\Delta x = \dfrac{650\cdot10^{-9}\,\mathrm{m} \cdot 2{,}0\,\mathrm{m}}{0{,}25\cdot10^{-3}\,\mathrm{m}} = 0{,}0052\,\mathrm{m}$.
3. Odgovor: svetli pasovi so razmaknjeni za $5{,}2\,\mathrm{mm}$, kar na zaslonu brez težav izmerimo z ravnilom.

### Primer 2: zgoščenka kot mrežica

Sledi na zgoščenki so razmaknjene za $1{,}6\,\mathrm{\mu m}$ in delujejo kot uklonska mrežica. Nanjo posvetimo z rdečim laserjem ($650\,\mathrm{nm}$). Pod katerimi koti vidimo ojačitve in koliko jih je na vsako stran od osrednje?

**Podatki:** $d = 1{,}6\,\mathrm{\mu m} = 1{,}6\cdot10^{-6}\,\mathrm{m}$, $\lambda = 650\cdot10^{-9}\,\mathrm{m}$
**Iščemo:** kote $\varphi_N$ in največji red $N$

:::formula
$d \sin\varphi = N\lambda$, torej $\sin\varphi_N = \dfrac{N\lambda}{d}$
:::

**Rešitev:**

1. Za $N = 1$: $\sin\varphi_1 = \dfrac{0{,}65\,\mathrm{\mu m}}{1{,}6\,\mathrm{\mu m}} = 0{,}406$, torej $\varphi_1 = 24{,}0^\circ$.
2. Za $N = 2$: $\sin\varphi_2 = \dfrac{1{,}30\,\mathrm{\mu m}}{1{,}6\,\mathrm{\mu m}} = 0{,}8125$, torej $\varphi_2 = 54{,}3^\circ$.
3. Za $N = 3$ bi bil $\sin\varphi_3 = 1{,}22$. Sinus ne more biti večji od $1$, zato tretjega reda ni.
4. Odgovor: ojačitve so pri $24{,}0^\circ$ in $54{,}3^\circ$; na vsako stran od osrednje vidimo po dve.

### Primer 3 (težji): telefon in sončna očala

Zaslon telefona oddaja polarizirano svetlobo. Skozi polarizacijska sončna očala je najsvetlejši, ko je telefon pokončen. Za kolikšen kot moraš telefon zasukati, da skozi očala vidiš le četrtino te jakosti?

**Podatki:** $\dfrac{j}{j_0} = 0{,}25$, pri $\theta = 0^\circ$ je jakost največja
**Iščemo:** kot zasuka $\theta$

:::formula
$j = j_0 \cos^2\theta$, torej $\cos^2\theta = \dfrac{j}{j_0}$
:::

**Rešitev:**

1. Svetloba zaslona je že polarizirana, zato polovice ne izgubimo: velja kar Malusov zakon z jakostjo $j_0$ pri pokončnem telefonu.
2. Delimo z $j_0$: $\cos^2\theta = 0{,}25$.
3. Zadnja dva koraka naredi sam: najprej koreni, nato poišči kot.

:::premisli
Kolikšen je $\cos\theta$ in kolikšen kot $\theta$?
---
$\cos\theta = \sqrt{0{,}25} = 0{,}5$, zato je $\theta = 60^\circ$. Pri zasuku za $60^\circ$ vidiš četrtino jakosti, pri $90^\circ$ skoraj nič.
:::

## Pogoste napake

- **»Ožja reža, ožja slika.«** To velja za žarke, za valove ravno obratno: $\sin\varphi_1 = \dfrac{\lambda}{b}$, zato manjši $b$ pomeni širši osrednji pas.
- **»V temnih pasovih se svetloba uniči.«** Energija se ne izgubi, le prerazporedi: kolikor je manjka v temnih pasovih, je je več v svetlih.
- **Razmik rež in razmik pasov rasteta skupaj.** Napačno: $\Delta x = \dfrac{\lambda L}{d}$, zato bližji reži dasta **bolj razmaknjene** pasove.
- **Red, za katerega je $\sin\varphi > 1$.** Kdor kar računa naprej, »najde« ojačitve, ki jih ni. Vsak red preveri: $\dfrac{N\lambda}{d}$ mora biti največ $1$.
- **»Zasuk polarizatorja pred žarnico spremeni svetlost.«** Nepolarizirana svetloba nima izbrane smeri, zato en polarizator v vsakem položaju prepusti polovico. Kot $\theta$ v $j = j_0 \cos^2\theta$ šteje šele pri drugem polarizatorju.

## Povzetek

- Žarki zadoščajo, ko so odprtine veliko večje od $\lambda$; pri ozkih režah (pod milimetrom) se pokaže valovna narava svetlobe.
- Uklon: valovanje se za odprtino razširi. Prvi temni pas reže: $\sin\varphi_1 = \dfrac{\lambda}{b}$; ožja reža da širši pas.
- Interferenca na dveh režah ali mrežici: ojačitve pri $d\sin\varphi = N\lambda$; razmik pasov $\Delta x = \dfrac{\lambda L}{d}$. Rdeča svetloba da bolj razmaknjene pasove kot modra.
- Število redov omejuje pogoj $\dfrac{N\lambda}{d} \le 1$.
- Polarizacija dokazuje, da je svetloba prečno valovanje. Polarizator prepusti polovico nepolarizirane svetlobe; za polarizirano velja $j = j_0 \cos^2\theta$. Zaslon telefona sveti polarizirano svetlobo.

## Drugače: Na sliki

:::risba skica
opis: Dve reži v pregradi sta razmaknjeni za d. Iz vsake reže gre črta do iste točke na zaslonu, poti sta r₁ in r₂. Na zaslonu so svetli pasovi pri redu N = 0 na sredini, N = 1 nad in pod njim ter N = 2 še dlje. Slika ni v merilu.
območje: -1; -4,5 .. 10; 4,5
enota: 28
črta: 0; -4 -> 0; -1 | siva debelo
črta: 0; -0,6 -> 0; 0,6 | siva debelo
črta: 0; 1 -> 0; 4 | siva debelo
črta: 8; -4,2 -> 8; 4,2 | modra debelo
črta: 0; 0,8 -> 8; 2 | oranžna
črta: 0; -0,8 -> 8; 2 | oranžna črtkano
napis: 0,3; 0 | d | desno
napis: 4; 1,6 | r_1 | nad
napis: 4; 0,4 | r_2 | pod
točka: 8; 0 | N = 0 | desno
točka: 8; 2 | N = 1 | desno
točka: 8; -2 | N = 1 | desno
točka: 8; 4 | N = 2 | desno
točka: 8; -4 | N = 2 | desno
:::

Polna in črtkana črta vodita od vsake reže do istega svetlega pasu. Črtkana pot je daljša natanko za eno valovno dolžino, zato tja vala prideta z vrhom ob vrhu. Na sredini sta poti enaki ($N = 0$), pri pasu $N = 2$ pa se razlikujeta za dve valovni dolžini. Kjer bi se razlikovali za pol valovne dolžine, se vrh in dolina izničita in je temno.

## Drugače: Iz vsakdanjega življenja

- **Zgoščenka in DVD.** Mavrične barve na zadnji strani ne nastanejo z lomom kot v prizmi, ampak z uklonom na gostih sledeh. DVD ima sledi bližje skupaj, zato barve razprši pod večjimi koti.
- **Zaslon telefona in avtomobila.** Zasloni LCD svetijo polarizirano svetlobo. Skozi polarizacijska očala jih ob zasuku vidiš temne. Zato navigacija v avtu včasih »izgine«, ko si nadeneš očala.
- **Sončna očala na vodi.** Odbita svetloba z vode je delno polarizirana. Polarizacijska očala prepuščajo drugo smer, zato zadušijo blesk, ribiči pa vidijo pod gladino.
- **Milni mehurček in oljni madež.** Barve nastanejo z interferenco svetlobe, odbite na zgornji in spodnji ploskvi tanke plasti.
- **Kamera telefona.** Odprtina objektiva je majhna, zato uklon omejuje, kako drobne podrobnosti še loči. Več milijonov pik na tipalu tega ne odpravi.

## Preveri se

? Katera trditev o svetlobi in zvoku je pravilna?
- Ožja kot je reža, ožji je svetli pas na zaslonu.
~ To bi veljalo za žarke. Pri valovanju je $\sin\varphi_1 = \dfrac{\lambda}{b}$, zato ožja reža da širši pas.
+ Zvoka ne moremo polarizirati, ker je vzdolžno valovanje.
- V temnih pasovih interference se svetlobna energija uniči.
~ Energija se le prerazporedi: v svetlih pasovih je je več, v temnih manj.
> Polarizator izbere eno smer prečnega nihanja. Vzdolžno valovanje take smeri nima, zato je polarizacija dokaz, da je svetloba prečno valovanje.

? Zelena svetloba ($520\,\mathrm{nm}$) pade na dve reži z razmikom $0{,}20\,\mathrm{mm}$, zaslon je $1{,}5\,\mathrm{m}$ daleč. Kolikšen je razmik svetlih pasov?
- $3{,}9\,\mathrm{\mu m}$
~ Tak rezultat dobiš, če razmik rež vstaviš v milimetrih, valovno dolžino pa v metrih. Vse dolžine pretvori v metre.
- $1{,}95\,\mathrm{mm}$
~ To je razdalja od svetlega do sosednjega temnega pasu. Med svetlima pasovoma je dvakrat toliko.
+ $3{,}9\,\mathrm{mm}$
> $\Delta x = \dfrac{\lambda L}{d} = \dfrac{520\cdot10^{-9}\,\mathrm{m} \cdot 1{,}5\,\mathrm{m}}{0{,}20\cdot10^{-3}\,\mathrm{m}} = 3{,}9\,\mathrm{mm}$.

? Učenka računa ojačitve za mrežico s $500$ režami na milimeter in svetlobo $600\,\mathrm{nm}$. (1) $d = \dfrac{1\,\mathrm{mm}}{500} = 2{,}0\,\mathrm{\mu m}$. (2) $\sin\varphi_1 = \dfrac{\lambda}{d} = 0{,}30$. (3) $\varphi_1 = 17{,}5^\circ$. (4) Za $N = 4$ je $\sin\varphi_4 = 1{,}2$, zato vidimo po štiri ojačitve na vsako stran. Kje je napaka?
- v koraku (1)
~ Pri $500$ režah na milimeter je razmik res $\dfrac{1}{500}\,\mathrm{mm} = 2{,}0\,\mathrm{\mu m}$.
- v koraku (2)
~ $\dfrac{0{,}6\,\mathrm{\mu m}}{2{,}0\,\mathrm{\mu m}} = 0{,}30$ je pravilno.
+ v koraku (4)
- nikjer, rešitev je pravilna
~ Sinus kota ne more biti $1{,}2$; red, ki da $\sin\varphi > 1$, ne obstaja.
> Ker je $\sin\varphi_4 = 1{,}2 > 1$, četrtega reda ni. Pri $N = 3$ je $\sin\varphi_3 = 0{,}90$, zato vidimo po tri ojačitve na vsako stran.

? Isti dve reži osvetlimo najprej z rdečim, nato z modrim laserjem. Kako se razlikujeta vzorca?
+ Pri rdeči svetlobi so pasovi bolj razmaknjeni.
- Pri modri svetlobi so pasovi bolj razmaknjeni, ker ima modra več energije.
~ Energija fotona ne določa razmika. Razmik je sorazmeren z valovno dolžino, modra pa ima krajšo.
- Razmik je enak, ker sta reži enaki.
~ Reži sta enaki, valovna dolžina pa ne. V $\Delta x = \dfrac{\lambda L}{d}$ nastopa tudi $\lambda$.
> Rdeča svetloba ima daljšo valovno dolžino, zato je $\Delta x = \dfrac{\lambda L}{d}$ večji.

? Na zaslon telefona gledaš skozi polarizacijska sončna očala. Ko telefon zasučeš za $90^\circ$, zaslon skoraj potemni. Zakaj?
- Očala absorbirajo modro svetlobo zaslona.
~ Očala ne izbirajo barve, ampak smer nihanja. Barva se ob zasuku ne spremeni.
- Senzor telefona zazna zasuk in zatemni zaslon.
~ Zaslon sveti enako; brez očal vidiš, da ni temnejši.
+ Svetloba zaslona je polarizirana, po zasuku pa je njena smer pravokotna na prepustno smer očal.
- Vsak polarizator prepusti polovico svetlobe, dva skupaj nič.
~ Polovico prepusti le iz nepolarizirane svetlobe. Kaj pride skozi drugi polarizator, je odvisno od kota: $j = j_0 \cos^2\theta$.
> Pri $\theta = 90^\circ$ je $\cos^2\theta = 0$, zato skozi očala pride skoraj nič svetlobe.

:::simboli
\lambda | valovna dolžina svetlobe | | m | vidna: $380$–$750\,\mathrm{nm}$
b | širina reže | | m
\varphi_1 | smer prvega temnega pasu pri reži | \sin\varphi_1 = \frac{\lambda}{b} | ° | pri mrežici (Primer 2) smer ojačitve 1. reda
\varphi | smer od reže do točke na zaslonu | | °
x_1 | oddaljenost prvega temnega pasu od sredine | x_1 \approx L \sin\varphi_1 | m
L | razdalja od rež do zaslona | | m
d | razmik med režama (konstanta mrežice) | | m
N | red ojačitve | d \sin\varphi = N\lambda | – | $0, 1, 2, \ldots$
\Delta x | razmik sosednjih svetlih pasov | \Delta x = \frac{\lambda L}{d} | m | velja za majhne kote
\varphi_N | smer ojačitve reda $N$ | \sin\varphi_N = \frac{N\lambda}{d} | °
j_0 | jakost polarizirane svetlobe pred polarizatorjem | | W/m^2
j | prepuščena jakost | j = j_0 \cos^2\theta | W/m^2
\theta | kot med smerjo polarizacije in prepustno smerjo polarizatorja | | °
\vec E | električno polje | | V/m
:::
