---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na koncertu te optika obdaja z vseh strani. Zvok iz predvajalnika potuje do ojačevalnika po optičnem kablu kot svetlobni utrinki, ki ne uidejo iz vlakna. Fotograf v zadnji vrsti s teleobjektivom ujame obraz pevke. Projektor na platno vrže besedilo pesmi, da lahko vsa dvorana poje zraven. Vse to načrtuješ z risbo žarkov in nekaj koti.

Ta način risanja je star štiri stoletja. Na začetku 17. stoletja so nizozemski izdelovalci očal sestavili dve leči v cev in dobili daljnogled. Galileo Galilei je za napravo slišal, izdelal svojo in z njo opazoval Luno in Jupitrove lune. Takrat se je pojavilo resno vprašanje: ali slika v daljnogledu kaže resnico ali jo steklo popači? Johannes Kepler je zato z žarki razložil, kako leča naredi sliko. Pri tem je uporabljal le ravne črte in kote. Tej fiziki rečemo geometrijska optika.

## Razlaga

**1. Kaj žarek naredi na meji.** Na risbi spodaj pada žarek iz zraka na steklo. Črtkana črta je **vpadna pravokotnica**: pravokotna je na mejo v točki, kjer žarek zadene steklo. Kote vedno merimo od nje, ne od površine.

:::risba skica
opis: Meja med zrakom (zgoraj) in steklom (spodaj) je vodoravna. Navpična črtkana črta je vpadna pravokotnica. Žarek pride iz zraka zgoraj levo pod kotom α = 50° in v steklu nadaljuje spodaj desno pod manjšim kotom β = 30,7°, bližje pravokotnici.
območje: -4; -3 .. 4; 3
enota: 38
pravokotnik: -4; -3 .. 4; 0 | siva ozadje
črta: 0; 3 -> 0; -3 | siva črtkano
črta: -1,92; 1,61 -> 0; 0 -> 1,28; -2,15 | modra debelo
napis: -0,6; 1,7 | α | sredina
napis: 0,5; -1,5 | β | sredina
napis: -3,8; 2,5 | zrak | desno
napis: -3,8; -2,5 | steklo | desno
:::

Žarek v steklu zavije **proti** pravokotnici. Če kot v zraku spreminjamo, izmerimo:

| Kot v zraku $\alpha$ | Kot v steklu $\beta$ | $\sin\alpha : \sin\beta$ |
|---|---|---|
| $0^\circ$ | $0^\circ$ | – |
| $30^\circ$ | $19{,}5^\circ$ | $1{,}50$ |
| $50^\circ$ | $30{,}7^\circ$ | $1{,}50$ |
| $80^\circ$ | $41{,}0^\circ$ | $1{,}50$ |

Kota nista sorazmerna, razmerje njunih sinusov pa je stalno. To število je **lomni količnik** stekla, $n = 1{,}50$. Pove, kolikokrat počasnejša je svetloba v snovi kot v vakuumu: $n = \frac{c_0}{c}$. Zrak ima $n \approx 1{,}00$, voda $1{,}33$. Za mejo med poljubnima snovema velja lomni zakon, enačba $n_1 \sin\alpha = n_2 \sin\beta$. Pri tem je $n_1$ lomni količnik snovi, iz katere svetloba prihaja, $n_2$ pa snovi, v katero gre.

:::premisli
Iz tabele razberi: kolikšen največji kot v steklu lahko sploh dosežeš, če svetloba prihaja iz zraka? Kaj se potem zgodi z žarkom, ki v steklu potuje proti meji pod še večjim kotom?
---
Približno $41{,}8^\circ$, ko $\alpha$ gre proti $90^\circ$. Pot svetlobe je obrnljiva, zato žarek iz stekla pod $41{,}8^\circ$ izstopi ravno vzdolž meje. Pod večjim kotom v zraku ni več smeri zanj: ves se odbije nazaj v steklo.
:::

**2. Pot nazaj: popolni odboj.** Obrnimo tabelo in pošljimo žarek iz stekla proti zraku:

| Kot v steklu | Kot v zraku | Kaj se zgodi |
|---|---|---|
| $20^\circ$ | $30{,}9^\circ$ | lom |
| $40^\circ$ | $74{,}6^\circ$ | lom, skoraj ob meji |
| $41{,}8^\circ$ | $90^\circ$ | žarek drsi po meji |
| $50^\circ$ | – | popolni odboj |

Kot, pri katerem lomljeni žarek leži na meji, je **mejni kot** $\alpha_m$. Iz lomnega zakona z $\beta = 90^\circ$:

$$\sin\alpha_m = \frac{n_2}{n_1}$$

Popolni odboj je mogoč samo pri prehodu v snov z **manjšim** lomnim količnikom ($n_2 < n_1$). Odbije se vsa svetloba, zato optična vlakna prenašajo signal več kilometrov.

**3. Leča na risbi.** Zbiralna leča vzporedne žarke zbere v **gorišču** $F$; razdalja od leče do gorišča je **goriščna razdalja** $f$. Leča ima dve gorišči, na vsaki strani eno: $F$ na strani predmeta in $F'$ na drugi strani. Sliko vrha predmeta najdeš z dvema od treh posebnih žarkov:

:::risba skica
opis: Zbiralna leča z goriščema F in F' dve enoti levo in desno od leče. Predmet P (puščica navzgor, visok 1,5 enote) stoji 3 enote levo od leče. Žarek 1 gre vzporedno z osjo in za lečo skozi F'. Žarek 2 gre skozi središče leče brez loma. Žarek 3 gre skozi F in za lečo vzporedno z osjo. Vsi trije se sekajo 6 enot desno od leče, kjer je obrnjena slika S, visoka 3 enote.
območje: -4; -3,5 .. 8; 2,5
enota: 25
črta: -4; 0 -> 8; 0 | siva
črta: 0; -3,3 -> 0; 2,3 | modra debelo
točka: -2; 0 | F | pod
točka: 2; 0 | F' | nad
puščica: -3; 0 -> -3; 1,5 | P | levo | zelena debelo
puščica: 6; 0 -> 6; -3 | S | desno | zelena debelo
črta: -3; 1,5 -> 0; 1,5 -> 6; -3 | oranžna
črta: -3; 1,5 -> 6; -3 | modra
črta: -3; 1,5 -> 0; -3 -> 6; -3 | rdeča črtkano
napis: -1; 1,5 | 1 | nad
napis: -1; 0,5 | 2 | nad
napis: -1; -1,5 | 3 | levo
:::

1. Žarek vzporedno z osjo gre za lečo skozi gorišče $F'$.
2. Žarek skozi središče leče gre naravnost.
3. Žarek skozi gorišče $F$ gre za lečo vzporedno z osjo.

Kjer se žarki sekajo, je vrh slike. Če se žarki za lečo res sekajo, sliko ujameš na zaslon; taka slika je **realna**. Če se žarki za lečo razhajajo, se sekajo le njihova podaljška nazaj; slika je **navidezna** in jo vidiš le skozi lečo. Razdalja $a$ od predmeta do leče odloči, kakšna je slika:

| Predmet | Slika | Uporaba |
|---|---|---|
| $a > 2f$ | realna, obrnjena, pomanjšana | fotoaparat |
| $a = 2f$ | realna, obrnjena, enako velika | kopiranje |
| $f < a < 2f$ | realna, obrnjena, povečana | projektor |
| $a < f$ | navidezna, pokončna, povečana | lupa |

V simulaciji spodaj »Leče« počasi zmanjšuj razdaljo predmeta $a$ od največje vrednosti proti $f$. Opazuj, kako slika raste in beži od leče. Ko $a$ pade pod $f$, slika preskoči na stran predmeta.

Zdaj še račun. Predmetna razdalja $a$, slikovna razdalja $b$ (od leče do slike) in goriščna razdalja $f$ so povezane z enačbo leče

$$\frac{1}{f} = \frac{1}{a} + \frac{1}{b}$$

Povečava je razmerje velikosti slike $S$ in predmeta $P$: $M = \frac{S}{P} = \frac{b}{a}$. Navidezna slika ima $b < 0$. **Razpršilna leča** vzporedne žarke razprši, kot da bi prihajali iz gorišča pred njo, in ima $f < 0$.

:::premisli
Na risbi leče prekrij spodnjo polovico leče s papirjem. Napovej: kaj ostane od slike na zaslonu?
---
Ostane cela slika, le temnejša. Vsaka točka predmeta pošilja žarke skozi vso lečo. Žarek 3 res zadene spodnjo polovico, a žarek 1 gre skozi zgornjo in še vedno pride do vrha slike. Zgubi se le del svetlobe.
:::

**4. Zrcala.** Vbočeno zrcalo zbira svetlobo kot zbiralna leča, le da se žarki odbijejo nazaj. Gorišče je na polovici krivinskega polmera, $f = \frac{r}{2}$, enačba $\frac{1}{f} = \frac{1}{a} + \frac{1}{b}$ pa ostane enaka. Izbočeno zrcalo ima $f < 0$ in vedno da pomanjšano navidezno sliko, zato so taka zrcala v trgovinah in na ovinkih.

**5. Optične naprave.** Vsaka je ena od vrstic zgornje tabele ali kombinacija dveh.

- **Fotoaparat:** $a \gg f$, zato je $b$ le malo večji od $f$.
- **Projektor:** $a$ malo večji od $f$, slika je daleč in močno povečana.
- **Lupa:** predmet tik znotraj gorišča. Povečava je približno $\frac{25\,\mathrm{cm}}{f}$, kjer je $25\,\mathrm{cm}$ razločna razdalja: najmanjša razdalja, na kateri oko še brez napora izostri.
- **Keplerjev daljnogled:** objektiv z veliko $f_\mathrm{ob}$ naredi realno sliko oddaljenega predmeta, okular z majhno $f_\mathrm{ok}$ jo opazuje kot lupa. Leči sta narazen $f_\mathrm{ob} + f_\mathrm{ok}$. **Kotna povečava** pove, kolikokrat večji je kot, pod katerim vidiš predmet skozi daljnogled, kot brez njega:

$$M = \frac{f_\mathrm{ob}}{f_\mathrm{ok}}$$

**Strategija za tekmovalne naloge.** Najprej nariši skico žarkov, šele potem računaj. Skica pokaže, ali je slika realna ali navidezna, in ujame napačen predznak. Pri dveh lečah je slika prve leče predmet druge. Pot svetlobe je obrnljiva: če je slika ostra pri razdaljah $a$ in $b$, je ostra tudi, ko ju zamenjaš.

## Rešeni primeri

### Primer 1: optični kabel za zvok

Optični kabel med predvajalnikom in ojačevalnikom ima jedro iz plastike z lomnim količnikom $1{,}49$, obdano s plaščem z lomnim količnikom $1{,}40$. Kolikšen je mejni kot na meji jedro–plašč? Ali svetloba uide v plašč, če zadene mejo pod kotom $75^\circ$ glede na pravokotnico?

**Podatki:** $n_1 = 1{,}49$ (jedro), $n_2 = 1{,}40$ (plašč), vpadni kot $75^\circ$
**Iščemo:** mejni kot $\alpha_m$ in ali pride do popolnega odboja

:::formula
$\sin\alpha_m = \frac{n_2}{n_1}$
:::

**Rešitev:**

1. Svetloba gre v snov z manjšim lomnim količnikom, zato je popolni odboj mogoč.
2. $\sin\alpha_m = \frac{1{,}40}{1{,}49} = 0{,}940$, torej $\alpha_m = 70{,}0^\circ$.
3. Ker je $75^\circ > 70{,}0^\circ$, se svetloba popolnoma odbije.
4. Odgovor: mejni kot je $70{,}0^\circ$; žarek pod $75^\circ$ ostane v jedru. Če kabel preveč upogneš, zadene mejo pod manjšim kotom in del svetlobe uide.

### Primer 2: fotograf na koncertu

Fotograf fotografira pevko, visoko $1{,}8\,\mathrm{m}$, ki stoji $20\,\mathrm{m}$ stran. Objektiv ima goriščno razdaljo $200\,\mathrm{mm}$. Kako daleč za objektivom nastane slika in kako je visoka? Ali pevka cela pride na tipalo, visoko $24\,\mathrm{mm}$?

**Podatki:** $P = 1{,}8\,\mathrm{m}$, $a = 20\,\mathrm{m}$, $f = 200\,\mathrm{mm} = 0{,}200\,\mathrm{m}$, višina tipala $24\,\mathrm{mm}$
**Iščemo:** slikovno razdaljo $b$ in velikost slike $S$

:::formula
$\frac{1}{b} = \frac{1}{f} - \frac{1}{a}$, $S = P\,\frac{b}{a}$
:::

**Rešitev:**

1. Iz enačbe leče: $\frac{1}{b} = \frac{1}{0{,}200\,\mathrm{m}} - \frac{1}{20\,\mathrm{m}} = 4{,}95\,\mathrm{m^{-1}}$.
2. $b = 0{,}2020\,\mathrm{m} = 202{,}0\,\mathrm{mm}$. Predmet je daleč, zato je slika tik za goriščem.
3. $S = 1{,}8\,\mathrm{m} \cdot \frac{0{,}2020\,\mathrm{m}}{20\,\mathrm{m}} = 0{,}0182\,\mathrm{m} = 18{,}2\,\mathrm{mm}$.
4. Odgovor: slika nastane $202\,\mathrm{mm}$ za objektivom, visoka je $18{,}2\,\mathrm{mm}$ in zato cela pride na tipalo.

### Primer 3 (težji): projektor za besedilo pesmi

Na koncertu projektor vrže besedilo pesmi na platno $6{,}0\,\mathrm{m}$ od objektiva. Slika na zaslonu projektorja je široka $4{,}0\,\mathrm{cm}$, na platnu pa mora biti široka $2{,}0\,\mathrm{m}$. Kolikšna mora biti goriščna razdalja objektiva? Tehnik nato objektiv premika med zaslonom projektorja in platnom, ki ostaneta na mestu. Pri kateri drugi legi objektiva je slika na platnu spet ostra in kako široka je tedaj?

**Podatki:** $P = 4{,}0\,\mathrm{cm} = 0{,}040\,\mathrm{m}$, $S = 2{,}0\,\mathrm{m}$, $b = 6{,}0\,\mathrm{m}$
**Iščemo:** goriščno razdaljo $f$; drugo lego objektiva z ostro sliko in širino slike v tej legi

:::formula
$M = \frac{S}{P} = \frac{b}{a}$, nato $\frac{1}{f} = \frac{1}{a} + \frac{1}{b}$
:::

**Rešitev:**

1. Povečava: $M = \frac{2{,}0}{0{,}040} = 50$.
2. Predmetna razdalja: $a = \frac{b}{M} = \frac{6{,}0\,\mathrm{m}}{50} = 0{,}12\,\mathrm{m}$. Zaslon projektorja je blizu objektiva, ker mora biti slika zelo povečana.
3. $\frac{1}{f} = \frac{1}{0{,}12\,\mathrm{m}} + \frac{1}{6{,}0\,\mathrm{m}} = 8{,}5\,\mathrm{m^{-1}}$.
4. $f = \frac{1}{8{,}5}\,\mathrm{m} = 0{,}118\,\mathrm{m}$.
5. Druga lega: enačba leče ostane izpolnjena, če razdalji $a$ in $b$ zamenjaš, ker je pot svetlobe obrnljiva. Zaslon in platno sta $0{,}12\,\mathrm{m} + 6{,}0\,\mathrm{m} = 6{,}12\,\mathrm{m}$ narazen. Slika je zato ostra tudi, ko je objektiv $6{,}0\,\mathrm{m}$ od zaslona in $0{,}12\,\mathrm{m}$ pred platnom.
6. V tej legi je povečava obrnjena, $\frac{0{,}12\,\mathrm{m}}{6{,}0\,\mathrm{m}} = \frac{1}{50}$. Slika je široka $\frac{4{,}0\,\mathrm{cm}}{50} = 0{,}080\,\mathrm{cm}$.
7. Odgovor: objektiv mora imeti goriščno razdaljo približno $11{,}8\,\mathrm{cm}$ (lomnost $8{,}5$ dioptrije). Druga ostra lega je $12\,\mathrm{cm}$ pred platnom, slika je tam široka le $0{,}80\,\mathrm{mm}$.

### Primer 4 – zdaj ti: daljnogled v operi

Z zadnjega balkona opere opazuješ violinista $50\,\mathrm{m}$ stran. Violina je dolga $0{,}60\,\mathrm{m}$. Tvoj Keplerjev daljnogled ima objektiv z goriščno razdaljo $60\,\mathrm{cm}$ in okular z $2{,}0\,\mathrm{cm}$. Pod kolikšnim kotom vidiš violino skozi daljnogled in kako dolga je cev?

**Podatki:** razdalja $50\,\mathrm{m}$, dolžina violine $0{,}60\,\mathrm{m}$, $f_\mathrm{ob} = 60\,\mathrm{cm}$, $f_\mathrm{ok} = 2{,}0\,\mathrm{cm}$
**Iščemo:** kot $\varepsilon$ skozi daljnogled, dolžino cevi $L$

:::formula
$M = \frac{f_\mathrm{ob}}{f_\mathrm{ok}}$, $\varepsilon = M \varepsilon_0$, $L = f_\mathrm{ob} + f_\mathrm{ok}$
:::

**Rešitev:**

1. Kotna povečava: $M = \frac{60\,\mathrm{cm}}{2{,}0\,\mathrm{cm}} = 30$.
2. Brez daljnogleda vidiš violino pod kotom $\varepsilon_0 = \frac{0{,}60\,\mathrm{m}}{50\,\mathrm{m}} = 0{,}012$ (v radianih), to je $0{,}69^\circ$.
3. Izračunaj sam kot $\varepsilon$ in dolžino cevi $L$, nato preveri:

:::premisli
Koliko sta $\varepsilon$ in $L$?
---
$\varepsilon = 30 \cdot 0{,}012 = 0{,}36$ radiana, kar je približno $20{,}6^\circ$. Cev je dolga $L = 60\,\mathrm{cm} + 2{,}0\,\mathrm{cm} = 62\,\mathrm{cm}$.
:::

## Pogoste napake

- **Žarek v gostejši snovi zavije stran od pravokotnice.** Narobe: v snovi z večjim $n$ je svetloba počasnejša in zavije **proti** pravokotnici. Pomagaj si s skico: večji $n$, manjši kot.
- **Popolni odboj pri prehodu iz zraka v steklo.** Iz lomnega zakona bi dobil $\sin\alpha_m > 1$, kar nima rešitve. Popolni odboj nastane le iz snovi z večjim $n$ v snov z manjšim, in to pri kotih, **večjih** od mejnega.
- **Slika je vedno v gorišču.** To velja le za zelo oddaljen predmet. Za bližnji predmet je $b > f$, kar vedno izračunaj iz enačbe leče.
- **Prekrita polovica leče odreže pol slike.** Vsak del leče naredi celo sliko. Prekrivanje zmanjša le svetlost.
- **Recipročne vrednosti seštete napačno.** Iz $\frac{1}{f} = \frac{1}{a} + \frac{1}{b}$ ne sledi $f = a + b$ in tudi ne $b = a - f$. Najprej izračunaj $\frac{1}{b}$, nato obrni.

## Povzetek

- Kote merimo od vpadne pravokotnice. Lomni zakon: $n_1\sin\alpha = n_2\sin\beta$; v snovi z večjim $n$ žarek zavije proti pravokotnici.
- Popolni odboj: iz snovi z večjim $n$ v snov z manjšim, pri kotu nad mejnim, $\sin\alpha_m = \frac{n_2}{n_1}$.
- Sliko konstruiraš z vzporednim žarkom, žarkom skozi središče in žarkom skozi gorišče.
- Enačba leče in zrcala: $\frac{1}{f} = \frac{1}{a} + \frac{1}{b}$; povečava $\frac{S}{P} = \frac{b}{a}$; za zrcalo $f = \frac{r}{2}$.
- $a > 2f$: pomanjšana realna slika; $f < a < 2f$: povečana realna; $a < f$: navidezna pokončna.
- Keplerjev daljnogled: $M = \frac{f_\mathrm{ob}}{f_\mathrm{ok}}$, dolžina $f_\mathrm{ob} + f_\mathrm{ok}$.

## Drugače: Z analogijo

Predstavljaj si godbo na pihala, ki koraka po asfaltu v ravnih vrstah. Vrste prečkajo rob travnika poševno. Glasbenik, ki prvi stopi na mehko travo, upočasni korak, njegovi sosedje na asfaltu pa še gredo hitro. Vrsta se zato zasuče in godba nadaljuje pot v novi smeri, **bližje** pravokotnici na rob travnika. Svetloba se v steklu obnaša enako: počasnejša snov pomeni zasuk proti pravokotnici.

Zdaj godba koraka nazaj s travnika na asfalt, zelo poševno. Glasbenik, ki prvi pride na asfalt, bi moral pospešiti tako močno, da bi vrsta zavila vzporedno z robom ali še čez. Tedaj vrsta ne more preiti na asfalt in se obrne nazaj na travnik. To je popolni odboj.

## Drugače: Iz vsakdanjega življenja

- **Žlica v kozarcu vode** je videti prelomljena, ker se žarki iz vode na meji z zrakom lomijo stran od pravokotnice.
- **Lesk diamanta**: diamant ima $n = 2{,}42$ in mejni kot le okoli $24^\circ$. Svetloba se v njem večkrat popolnoma odbije, preden izstopi.
- **Kamera v telefonu** ima objektiv z goriščno razdaljo nekaj milimetrov. Vse, kar je dlje od pol metra, je zanjo »zelo daleč«, zato je slika skoraj v gorišču.
- **Ogledalo na ovinku** je izbočeno: pokaže pomanjšano sliko, a širši pogled.
- **Žaromet na odru** ima žarnico v gorišču vbočenega zrcala, zato odbita svetloba potuje v vzporednem snopu proti glasbeniku.

## Preveri se

? Tri od naštetih naprav delujejo s popolnim odbojem. Katera ne sodi zraven?
- optični kabel za zvok
~ Kabel deluje ravno s popolnim odbojem: svetloba se odbija od plašča z manjšim lomnim količnikom.
- prizma v prizmatičnem daljnogledu
~ Prizma obrne sliko s popolnim odbojem na svojih ploskvah, kot je večji od mejnega $41{,}8^\circ$.
+ lupa za branje not
- lesk brušenega diamanta
~ Diamant ima zelo majhen mejni kot, zato se svetloba v njem večkrat popolnoma odbije.
> Lupa je zbiralna leča: svetloba se na njenih ploskvah samo lomi in naredi navidezno povečano sliko.

? Predmet pred zbiralno lečo premaknemo iz lege A v lego B. Z risbe odčitaj, kje sta legi glede na gorišče F in točko 2F. Kaj se zgodi s sliko?
:::risba skica
opis: Optična os z zbiralno lečo na sredini. Gorišči F sta 2 enoti levo in desno od leče, točki 2F 4 enote levo in desno. Predmet A stoji 6 enot levo od leče, predmet B 3 enote levo od leče, torej med 2F in F.
območje: -7; -1 .. 7; 2,5
enota: 21
črta: -7; 0 -> 7; 0 | siva
črta: 0; -0,8 -> 0; 2,3 | modra debelo
točka: -2; 0 | F | pod
točka: 2; 0 | F | pod
točka: -4; 0 | 2F | pod
točka: 4; 0 | 2F | pod
puščica: -6; 0 -> -6; 1,5 | A | nad | zelena debelo
puščica: -3; 0 -> -3; 1,5 | B | nad | zelena debelo
:::
+ Slika se oddalji od leče in postane večja.
- Slika se približa leči in postane večja.
~ Ko se predmet približa gorišču, se žarki za lečo sekajo dlje. Slika gre stran od leče, ne proti njej.
- Slika postane navidezna in pokončna.
~ To se zgodi šele, ko je predmet bližje od gorišča. Lega B je še vedno za F, med F in 2F.
- Slika ostane enako velika, ker se leča ni spremenila.
~ Goriščna razdalja je res enaka, a velikost slike je odvisna od lege predmeta: $\frac{S}{P} = \frac{b}{a}$.
> Pri A je $a = 3f$, slika je pomanjšana na $b = 1{,}5f$. Pri B je $a = 1{,}5f$, slika je povečana na $b = 3f$. Slika se je oddaljila in povečala.

? Razvrsti snovi od najmanjšega do največjega mejnega kota na meji z zrakom.
1. diamant, $n = 2{,}42$
2. safir, $n = 1{,}77$
3. steklo, $n = 1{,}50$
4. voda, $n = 1{,}33$
> Iz $\sin\alpha_m = \frac{1}{n}$ sledi: večji lomni količnik, manjši mejni kot. Mejni koti so po vrsti $24{,}4^\circ$; $34{,}4^\circ$; $41{,}8^\circ$ in $48{,}8^\circ$.

? Bobnar sedi $2{,}5\,\mathrm{m}$ pred fotografom, ki ima objektiv z goriščno razdaljo $50\,\mathrm{mm}$. Koliko milimetrov za objektivom nastane ostra slika?
= 51,02 mm | 0,05
~ 49,02 | Recipročni vrednosti si seštel. Velja $\frac{1}{b} = \frac{1}{f} - \frac{1}{a}$.
~ 50 | V gorišču je slika le za zelo oddaljen predmet. Pri $2{,}5\,\mathrm{m}$ je malo dlje.
~ 2450 | Odštel si razdalji, $b = a - f$. Enačba leče povezuje recipročne vrednosti.
> $\frac{1}{b} = \frac{1}{50\,\mathrm{mm}} - \frac{1}{2500\,\mathrm{mm}}$, zato $b = 51{,}02\,\mathrm{mm}$.

? Žarek v steklu ($n = 1{,}50$) zadene mejo z zrakom pod kotom $30^\circ$ glede na pravokotnico. Dijak sklepa takole. Kateri korak je napačen?

**Korak 1:** Popolni odboj je mogoč, ker gre svetloba iz stekla v zrak.
**Korak 2:** $\sin\alpha_m = \frac{1{,}00}{1{,}50}$, zato je $\alpha_m = 41{,}8^\circ$.
**Korak 3:** Ker je $30^\circ$ manj od mejnega kota, se žarek popolnoma odbije.
- Korak 1
~ Korak 1 drži: popolni odboj nastane le pri prehodu v snov z manjšim lomnim količnikom, kar zrak je.
- Korak 2
~ Korak 2 drži: v števcu je manjši lomni količnik, zato je sinus manjši od 1.
+ Korak 3
> Popolni odboj nastane pri kotih, **večjih** od mejnega. Pri $30^\circ$ se žarek lomi v zrak pod kotom $48{,}6^\circ$.

<<RACUN
vrednost: asin(1.40/1.49)*180/pi | 70.0
vrednost: 1/0.200-1/20 | 4.95
vrednost: 1/(1/0.200-1/20) | 0.2020
vrednost: 1.8*0.2020/20 | 0.0182
vrednost: 2.0/0.040 | 50
vrednost: 6.0/50 | 0.12
vrednost: 1/0.12+1/6.0 | 8.5
vrednost: 1/8.5 | 0.118
vrednost: 0.12+6.0 | 6.12
vrednost: 4.0/50 | 0.080
vrednost: 60/2.0 | 30
vrednost: 0.60/50 | 0.012
vrednost: 0.012*180/pi | 0.69
vrednost: 30*0.012 | 0.36
vrednost: 0.36*180/pi | 20.6
vrednost: 1/(1/50-1/2500) | 51.02
vrednost: asin(1/1.5)*180/pi | 41.8
vrednost: asin(1.5*sin(30*pi/180))*180/pi | 48.6
vrednost: asin(sin(50*pi/180)/1.5)*180/pi | 30.7
vrednost: asin(sin(30°)/1.5)*180/pi | 19.5
vrednost: asin(sin(80°)/1.5)*180/pi | 41.0
vrednost: asin(1.5*sin(20°))*180/pi | 30.9
vrednost: asin(1.5*sin(40°))*180/pi | 74.6
vrednost: asin(1/2.42)*180/pi | 24.4
vrednost: asin(1/1.77)*180/pi | 34.4
vrednost: asin(1/1.33)*180/pi | 48.8
>>

:::simboli
n | lomni količnik | n = \frac{c_0}{c} | – | zrak $1{,}00$, steklo $1{,}50$
c_0 | hitrost svetlobe v vakuumu | | m/s
c | hitrost svetlobe v snovi | | m/s
n_1 | lomni količnik snovi, iz katere svetloba prihaja | | –
n_2 | lomni količnik snovi, v katero svetloba gre | | –
\alpha | vpadni kot | | ° | merjen od pravokotnice
\beta | lomni kot | | ° | merjen od pravokotnice
\alpha_m | mejni kot | \sin\alpha_m = \frac{n_2}{n_1} | °
f | goriščna razdalja | | m | razpršilna leča: $f < 0$
a | predmetna razdalja | | m
b | slikovna razdalja | | m | navidezna slika: $b < 0$
P | velikost predmeta | | m
S | velikost slike | S = P\,\frac{b}{a} | m
M | povečava | | – | pri daljnogledu kotna povečava
r | krivinski polmer zrcala | r = 2f | m
f_\mathrm{ob} | goriščna razdalja objektiva | | m
f_\mathrm{ok} | goriščna razdalja okularja | | m
\varepsilon_0 | kot, pod katerim vidiš predmet brez daljnogleda | | rad
\varepsilon | kot, pod katerim vidiš predmet skozi daljnogled | \varepsilon = M\varepsilon_0 | rad
L | dolžina cevi daljnogleda | L = f_\mathrm{ob} + f_\mathrm{ok} | m
:::
