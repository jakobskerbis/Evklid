---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Starejši pacient vstaja s stola. Če sedi povsem pokončno, ne more vstati, dokler se ne nagne močno naprej. Medicinska sestra, ki v eni roki nese težko torbo z instrumenti, se nehote nagne na drugo stran.

**Težišče** je točka, v kateri si lahko mislimo, da prijemlje celotna teža telesa. Telo ga v obeh primerih brez razmisleka premakne nad podporno ploskev, torej nad stopala. Sicer teža telo zavrti in človek pade. V mehaniki ga potrebuješ povsod, kjer nadomeščaš razporejeno težo ali ploskev z eno samo silo ali eno točko: pri reakcijah nosilcev, pri prevrnitvi, pri upogibu prerezov in pri računanju prostornin vrtenin.

## Razlaga

**1. Mamljiva bližnjica.** Ortopedska opornica za zapestje ima v prerezu obliko črke L. Široka je $60\,\text{mm}$, visoka $50\,\text{mm}$, debelina obeh krakov pa je $10\,\text{mm}$. Kje je težišče tega lika? Hiter odgovor bi bil: na sredini, med skrajnimi točkami, torej pri $x = 30\,\text{mm}$, $y = 25\,\text{mm}$.

Ta točka leži globoko v praznem kotu, $20\,\text{mm}$ desno od navpičnega in $15\,\text{mm}$ nad vodoravnim krakom. Bližnjica ne upošteva, **koliko** snovi je na kateri strani.

:::premisli
Kam se bo težišče L-lika premaknilo glede na sredino obrisa: proti dolgemu vodoravnemu kraku ali stran od njega? Zakaj?
---
Proti vodoravnemu kraku in proti vogalu, kjer se kraka stikata. Tam je največ ploščine, težišče pa je »uteženo« s ploščino.
:::

**2. Popravek: utežena sredina.** Težišče je povprečje leg, v katerem vsak del šteje toliko, kolikor ga je. L razdelimo na dva pravokotnika:

| del | $A_i$ [mm²] | $x_i$ [mm] | $y_i$ [mm] |
|---|---|---|---|
| spodnji krak $60 \times 10$ | 600 | 30 | 5 |
| navpični krak $10 \times 40$ | 400 | 5 | 30 |

Težišče vsakega pravokotnika je v njegovem središču. Nato vsako lego pomnožimo s ploščino, seštejemo in delimo s skupno ploščino:

$$x_T = \frac{\sum A_i x_i}{\sum A_i}$$

$$y_T = \frac{\sum A_i y_i}{\sum A_i}$$

$$x_T = \frac{600 \cdot 30 + 400 \cdot 5}{1000} = 20\,\text{mm}$$

$$y_T = \frac{600 \cdot 5 + 400 \cdot 30}{1000} = 15\,\text{mm}$$

Težišče je pri $(20, 15)\,\text{mm}$: bliže vogalu, kot je kazala bližnjica, in tik nad snovjo. Produkt $A_i x_i$ se imenuje **statični moment ploskve** glede na os $y$. Isto pravilo poznaš iz momentov sil: rezultanta mora imeti enak moment kot vsi deli skupaj.

**3. Telesa.** Za telo namesto ploščin utežimo prostornine $V_i$ ali mase $m_i$. Pri telesu iz ene snovi geometrijsko težišče (težišče prostornine) sovpada s središčem mase. Za sestavljene oblike uporabljamo znana težišča osnovnih likov in teles:

| oblika | težišče, merjeno od osnovnice |
|---|---|
| pravokotnik, valj | $h/2$ |
| trikotnik | $h/3$ |
| polkrog (polmer $r$) | $\dfrac{4r}{3\pi}$ |
| polkrogla | $\dfrac{3r}{8}$ |
| stožec | $h/4$ |

Kadar ima lik **simetrijsko os**, težišče leži na njej. Kapsula zdravila je valj z dvema polkroglama; njeno težišče je v središču, brez računanja.

**4. Luknje.** Lik z luknjo obravnavamo kot poln lik, od katerega *odštejemo* luknjo. Ploščina luknje vstopi v vsoto z negativnim predznakom. Luknja potisne težišče stran od sebe.

**5. Pappus-Guldinovi pravili.** Ko ravninsko krivuljo ali lik zavrtimo okoli osi v isti ravnini, nastane vrtenina. Težišče pove njeno površino ali prostornino brez integriranja.

- **Prvo pravilo (površina).** Krivulja dolžine $s$, katere težišče je na razdalji $r_T$ od osi, opiše ploskev s površino $A = 2\pi r_T \, s$.
- **Drugo pravilo (prostornina).** Lik s ploščino $A$, katerega težišče je na razdalji $r_T$ od osi, opiše telo s prostornino $V = 2\pi r_T \, A$.

V besedah: dolžino ali ploščino pomnožimo s potjo, ki jo pri enem obratu prepotuje težišče. Os ne sme sekati lika.

:::premisli
Pravokotnik zavrtimo okoli osi, ki je od njegovega težišča oddaljena $2\,\text{cm}$, nato pa ga premaknemo, da je razdalja $4\,\text{cm}$. Sošolec napove, da se prostornina cevi početveri, ker se je polmer podvojil. Kolikokrat se poveča v resnici?
---
Podvoji se. Ploščina lika je ista, težišče pa pri enem obratu prepotuje dvakrat daljšo krožnico, $V = 2\pi r_T A$.
:::

## Rešeni primeri

### Primer 1 (lažji): težišče noge

Pri analizi hoje obravnavamo nogo kot tri dele na premici od kolka navzdol. Stegno ima maso $7{,}0\,\text{kg}$ in težišče $0{,}19\,\text{m}$ od kolka, golen $3{,}2\,\text{kg}$ in $0{,}62\,\text{m}$, stopalo $1{,}0\,\text{kg}$ in $0{,}90\,\text{m}$. Kje je težišče cele iztegnjene noge?

**Podatki:** $m_1 = 7{,}0\,\text{kg}$, $x_1 = 0{,}19\,\text{m}$; $m_2 = 3{,}2\,\text{kg}$, $x_2 = 0{,}62\,\text{m}$; $m_3 = 1{,}0\,\text{kg}$, $x_3 = 0{,}90\,\text{m}$
**Iščemo:** lego težišča $x_T$, merjeno od kolka

:::formula
$x_T = \dfrac{m_1 x_1 + m_2 x_2 + m_3 x_3}{m_1 + m_2 + m_3}$
:::

**Rešitev:**

1. Skupna masa: $7{,}0 + 3{,}2 + 1{,}0 = 11{,}2\,\text{kg}$.
2. Statični momenti: $7{,}0 \cdot 0{,}19 = 1{,}33$; $3{,}2 \cdot 0{,}62 = 1{,}984$ in $1{,}0 \cdot 0{,}90 = 0{,}9$ (v kg·m).
3. Vsota: $1{,}33 + 1{,}984 + 0{,}9 = 4{,}214\,\text{kg·m}$.
4. $x_T = 4{,}214 / 11{,}2 \approx 0{,}376\,\text{m}$.
5. Odgovor: težišče noge je približno $0{,}38\,\text{m}$ pod kolkom, v spodnjem delu stegna. Ni na polovici dolžine noge, ker je stegno precej težje od stopala.

### Primer 2: ploščica z luknjo za vijak

Ploščica za osteosintezo je pravokotnik $80\,\text{mm} \times 40\,\text{mm}$. Vanjo je izvrtana krožna luknja s polmerom $10\,\text{mm}$, njeno središče je pri $x = 60\,\text{mm}$, $y = 20\,\text{mm}$ (izhodišče v levem spodnjem vogalu). Kje je težišče ploščice?

**Podatki:** $b = 80\,\text{mm}$, $h = 40\,\text{mm}$, $r = 10\,\text{mm}$, središče luknje $(60, 20)\,\text{mm}$
**Iščemo:** težišče $(x_T, y_T)$

:::formula
$x_T = \dfrac{A_1 x_1 - A_2 x_2}{A_1 - A_2}$, kjer je $A_1$ poln pravokotnik in $A_2$ luknja
:::

**Rešitev:**

1. Luknja leži na vodoravni simetrijski osi pravokotnika, zato je $y_T = 20\,\text{mm}$.
2. Ploščini: $A_1 = 80 \cdot 40 = 3200\,\text{mm}^2$, $A_2 = \pi \cdot 10^2 \approx 314{,}16\,\text{mm}^2$.
3. Statična momenta: $A_1 x_1 = 3200 \cdot 40 = 128000\,\text{mm}^3$, $A_2 x_2 \approx 314{,}16 \cdot 60 \approx 18850\,\text{mm}^3$.
4. Luknjo odštejemo: $x_T \approx \dfrac{128000 - 18850}{3200 - 314{,}16} \approx \dfrac{109150}{2885{,}8} \approx 37{,}8\,\text{mm}$.
5. Odgovor: težišče je pri $(37{,}8;\ 20)\,\text{mm}$, za $2{,}2\,\text{mm}$ levo od sredine pravokotnika, torej stran od luknje.

### Primer 3 (težji): silikonski obroček

Silikonski obroček (pesar) ima obliko svitka: krog s premerom $8\,\text{mm}$ se vrti okoli osi, od katere je njegovo središče oddaljeno $30\,\text{mm}$. Kolikšni sta površina in masa obročka, če je gostota silikona $1{,}1\,\text{g/cm}^3$?

**Podatki:** $r = 4\,\text{mm}$ (polmer prereza), $R = 30\,\text{mm}$ (razdalja težišča prereza od osi), $\rho = 1{,}1\,\text{g/cm}^3$
**Iščemo:** površino $A$ in maso $m$

:::formula
$A = 2\pi R \cdot 2\pi r$, $\quad V = 2\pi R \cdot \pi r^2$, $\quad m = \rho V$
:::

**Rešitev:**

1. Težišče krožnice in kroga je v središču, zato je pri obeh pravilih $r_T = R = 30\,\text{mm}$.
2. Pot težišča pri enem obratu: $2\pi \cdot 30 \approx 188{,}5\,\text{mm}$.
3. Prvo pravilo: obseg prereza je $2\pi \cdot 4 \approx 25{,}13\,\text{mm}$, zato $A \approx 188{,}5 \cdot 25{,}13 \approx 4737\,\text{mm}^2$.
4. Drugo pravilo: ploščina prereza je $\pi \cdot 4^2 \approx 50{,}27\,\text{mm}^2$, zato $V \approx 188{,}5 \cdot 50{,}27 \approx 9475\,\text{mm}^3 = 9{,}475\,\text{cm}^3$.
5. Masa: $m = 1{,}1 \cdot 9{,}475 \approx 10{,}4\,\text{g}$.
6. Odgovor: obroček ima površino približno $47{,}4\,\text{cm}^2$ in maso približno $10{,}4\,\text{g}$.

### Primer 4 – zdaj ti: težišče polkroga iz krogle

Drugo Pappus-Guldinovo pravilo lahko uporabimo tudi obratno. Model očesnega zrkla je krogla s polmerom $12\,\text{mm}$. Nastane z vrtenjem polkroga okoli premera. Iz znane prostornine krogle določi, kako daleč od premera je težišče polkroga.

**Podatki:** $r = 12\,\text{mm}$, $V = \dfrac{4}{3}\pi r^3$ (krogla), lik je polkrog s ploščino $A = \dfrac{\pi r^2}{2}$
**Iščemo:** razdaljo težišča polkroga od premera $r_T$

:::formula
$V = 2\pi r_T A \;\Rightarrow\; r_T = \dfrac{V}{2\pi A}$
:::

**Rešitev:**

1. Prostornina krogle: $V = \dfrac{4}{3}\pi \cdot 12^3 \approx 7238\,\text{mm}^3$.
2. Ploščina polkroga: $A = \dfrac{\pi \cdot 12^2}{2} \approx 226{,}2\,\text{mm}^2$.
3. Izračunaj $r_T$ sam in rezultat primerjaj s tabelo v razlagi.

:::premisli
Koliko je $r_T$?
---
$r_T = \dfrac{7238}{2\pi \cdot 226{,}2} \approx 5{,}09\,\text{mm}$. Splošno $r_T = \dfrac{4r}{3\pi} = \dfrac{4 \cdot 12}{3\pi} \approx 5{,}09\,\text{mm}$, kar se ujema s tabelo.
:::

## Pogoste napake

- **Težišče na sredini obrisa.** Sredina med skrajnimi točkami je pravo težišče le pri simetričnih likih. Pri L-liku je zgrešena za $10\,\text{mm}$ v obeh smereh. Vedno uteži s ploščino ali maso.
- **Navadno povprečje namesto uteženega.** Kdor povpreči le središča delov, $\frac{x_1 + x_2}{2}$, predpostavi, da sta dela enako velika. Vsako lego pomnoži z njeno ploščino.
- **Luknja prišteta.** Ploščina luknje gre v števec *in* imenovalec z minusom. Če jo prišteješ, se težišče premakne proti luknji namesto stran od nje.
- **Težišče je vedno v snovi.** Pri obroču je v praznem središču; pri skakalcu v višino, ki se ukrivi čez letvico, je lahko pod letvico, zunaj telesa. Težišče je izračunana točka, ne košček snovi.
- **Napačna razdalja pri Pappus-Guldinu.** V pravilo spada razdalja *težišča* lika od osi, ne razdalja njegovega roba. Prav tako ne pozabi faktorja $2\pi$: pot težišča je cela krožnica.
- **Trikotnik na polovici višine.** Težišče trikotnika je na $h/3$ od osnovnice (ali $2h/3$ od vrha), ker je spodaj več ploščine.

## Povzetek

- Težišče je točka, v kateri si mislimo celotno težo; telo je podprto stabilno, če je težišče nad podporno ploskvijo.
- Sestavljen lik: $x_T = \dfrac{\sum A_i x_i}{\sum A_i}$ (pri telesih $V_i$ ali $m_i$); luknje imajo negativno ploščino.
- Simetrijska os vsebuje težišče. Znana težišča: trikotnik $h/3$, polkrog $4r/(3\pi)$, polkrogla $3r/8$, stožec $h/4$.
- Sredina obrisa in navadno povprečje središč delov sta napačni bližnjici.
- Pappus-Guldin: površina vrtenine $A = 2\pi r_T s$, prostornina $V = 2\pi r_T A$; $r_T$ je razdalja težišča krivulje oz. lika od osi.

## Drugače: Kot zgodba

Inženirka v podjetju za medicinske pripomočke dobi reklamacijo: nova bergla se na stojalu ob postelji prevrača. Bergla je iz treh delov: lahke aluminijaste cevi, težkega gumijastega čepa spodaj in plastičnega ročaja. Konstruktor je stojalo postavil na polovico dolžine bergle, »na sredino«.

Inženirka razdeli berglo na dele, vsakemu zapiše maso in lego njegovega lastnega težišča, zmnoži in sešteje. Izkaže se, da je težišče precej nižje od sredine, ker je gumijasti čep težak. Stojalo je berglo podprlo daleč od težišča, zato jo teža zavrti in težji konec s čepom se prevesi navzdol.

Potem pomisli še na lakirnico: koliko laka bo šlo za ročaj, ki je vrtenina? Namesto integrala pomnoži dolžino obrisa ročaja s potjo težišča tega obrisa okoli osi in dobi površino. Ista ideja, utežena sredina, ji reši obe težavi.

## Drugače: Korak za korakom s številkami

Postopek za sestavljen lik, na primeru T-profila: zgornja pasnica $60 \times 10\,\text{mm}$ na stojini $10 \times 40\,\text{mm}$.

1. Postavi koordinatni sistem; os $y$ naj bo simetrijska os, $y$ merimo od spodnjega roba. Zaradi simetrije je $x_T = 0$.
2. Razdeli na osnovne like in zapiši ploščine: pasnica $600\,\text{mm}^2$, stojina $400\,\text{mm}^2$.
3. Zapiši težišči delov: pasnica $y_1 = 45\,\text{mm}$, stojina $y_2 = 20\,\text{mm}$.
4. Statična momenta: $600 \cdot 45 = 27000$ in $400 \cdot 20 = 8000$ (v mm³).
5. Deli s skupno ploščino: $y_T = 35000 / 1000 = 35\,\text{mm}$.
6. Preveri smiselnost: rezultat mora biti med $y_2$ in $y_1$ in bliže večjemu delu. Res, $35$ je bliže $45$ kot $20$.

## Drugače: Bolj natančno

Za zvezno ploskev vsota preide v integral: $x_T = \dfrac{1}{A}\int_A x\,\mathrm{d}A$, $y_T = \dfrac{1}{A}\int_A y\,\mathrm{d}A$; za telo $\mathrm{d}A$ zamenjamo z $\mathrm{d}V$ ali $\rho\,\mathrm{d}V$.

Dokaz drugega pravila: majhen košček $\mathrm{d}A$ na razdalji $y$ od osi pri vrtenju opiše obroč s prostornino $2\pi y\,\mathrm{d}A$. Seštejemo: $V = 2\pi \int_A y\,\mathrm{d}A = 2\pi y_T A$. Prvo pravilo dokažemo enako z elementom krivulje $\mathrm{d}s$, ki opiše trak s površino $2\pi y\,\mathrm{d}s$. Pogoj je, da os ne seka lika, sicer bi se prispevki z obeh strani osi odšteli.

## Preveri se

? T-profil: pasnica $90 \times 10\,\text{mm}$ leži na stojini $10 \times 30\,\text{mm}$. Kako visoko nad spodnjim robom je težišče?
- $20\,\text{mm}$
~ To je sredina skupne višine $40\,\text{mm}$, ki bi veljala le, če bi bila snov enakomerno razporejena po višini.
- $25\,\text{mm}$
~ To je navadno povprečje $\frac{35 + 15}{2}$. Pasnica ima večjo ploščino in mora šteti več.
+ $30\,\text{mm}$
- $35\,\text{mm}$
~ To je težišče same pasnice. Stojina potegne skupno težišče navzdol.
> $y_T = \dfrac{900 \cdot 35 + 300 \cdot 15}{1200} = 30\,\text{mm}$.

? Pri pregledu ravnotežja fizioterapevt reče, da je pacientovo težišče »izven podporne ploskve«. Kaj to pomeni?
- Pacientova stopala so preveč narazen.
~ Podporna ploskev je med stopali; širša stopala jo povečajo, kar ravnotežje izboljša, ne poslabša.
+ Navpičnica skozi točko, v kateri si mislimo celotno težo, ne seka ploskve med stopali, zato ga teža zavrti.
- Pacientovo težišče je zunaj telesa.
~ Težišče je lahko zunaj telesa (pri sklonjenem telesu), a to ni isto kot zunaj podporne ploskve. Pomembna je lega glede na stopala.
> Telo je stabilno, ko je težišče nad podporno ploskvijo. Če ni, teža ustvari moment okoli roba podpore.

? Trikotnik, pravokotnik in polkrog imajo enako višino $h$ (polkrog ima polmer $h$ in leži na premeru). Razvrsti jih po višini težišča nad osnovnico od najnižje do najvišje.
- polkrog, pravokotnik, trikotnik
~ Tako dobiš, če trikotniku pripišeš $2h/3$, merjeno od vrha namesto od osnovnice. Od osnovnice je $h/3$.
+ trikotnik, polkrog, pravokotnik
- vsi enako, na $h/2$
~ $h/2$ velja le za pravokotnik. Pri trikotniku in polkrogu je spodaj več ploščine, zato je težišče nižje.
> Trikotnik $h/3 \approx 0{,}33h$, polkrog $\dfrac{4h}{3\pi} \approx 0{,}42h$, pravokotnik $0{,}5h$.

? V pravokotno ploščico izvrtamo luknjo desno od njenega središča. Kaj se zgodi s težiščem?
- Ostane v središču, ker je pravokotnik simetričen.
~ Z luknjo lik ni več simetričen glede na navpično os, zato se težišče premakne.
- Premakne se desno, proti luknji.
~ Tako dobiš, če ploščino luknje prišteješ. Luknja je odvzeta snov, zato ima negativno ploščino.
+ Premakne se levo, stran od luknje.
> Na desni manjka snov, zato na levi prevlada. Težišče se pomakne stran od luknje.

? Pravokotnik s stranicama $2\,\text{cm}$ (vodoravno) in $10\,\text{cm}$ (vzporedno z osjo) zavrtimo okoli navpične osi. Bližja stranica je $3\,\text{cm}$ od osi. Kolikšna je prostornina nastale cevi?
- približno $377\,\text{cm}^3$
~ Vzel si razdaljo bližjega roba ($3\,\text{cm}$), v pravilo pa spada razdalja težišča lika.
- približno $251\,\text{cm}^3$
~ Pozabil si faktor $2$: pot težišča je cela krožnica $2\pi r_T$, ne $\pi r_T$.
+ približno $503\,\text{cm}^3$
- približno $628\,\text{cm}^3$
~ Vzel si razdaljo bolj oddaljenega roba ($5\,\text{cm}$). Težišče lika je na sredini, pri $4\,\text{cm}$.
> $r_T = 4\,\text{cm}$, $A = 20\,\text{cm}^2$, $V = 2\pi \cdot 4 \cdot 20 = 160\pi \approx 503\,\text{cm}^3$. Preveritev: $\pi(5^2 - 3^2)\cdot 10 = 160\pi$.

:::simboli
x_T, y_T | koordinati težišča | x_T = \frac{\sum A_i x_i}{\sum A_i} | mm | pri nogi v m
x_i, y_i | koordinati težišča $i$-tega dela | | mm
A_i | ploščina $i$-tega dela | | mm^2 | luknja šteje negativno
A_1 | ploščina polnega pravokotnika | | mm^2
A_2 | ploščina luknje | A_2 = \pi r^2 | mm^2
x_1, x_2, x_3 | lega težišča posameznega dela (noge, pravokotnika, luknje) | | m | pri ploščici v mm
m_1, m_2, m_3 | masa dela noge | | kg
A | ploščina lika ali površina vrtenine | A = 2\pi r_T s | mm^2 | pomen je razviden iz pravila
V | prostornina vrtenine | V = 2\pi r_T A | mm^3
r_T | razdalja težišča lika ali krivulje od osi | | mm
s | dolžina krivulje, ki jo vrtimo | | mm
R | razdalja središča prereza obročka od osi | | mm
r | polmer kroga oz. prereza | | mm
m | masa | m = \rho V | g
\rho | gostota | | g/cm^3
:::
