---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi suh špaget, primi ga za oba konca in ga zvijaj, dokler ne poči. Poglej lom: ni raven prečni prerez, ampak poševna vijačnica, približno pod $45^\circ$ na os. Nato drug špaget samo upogni. Ta poči skoraj naravnost.

Pri zvijanju v prerezu deluje le strižna napetost $\tau$, špaget pa je počil po ploskvi, kjer strižna napetost ni največja. Gred kuhinjskega robota hkrati upogibamo in zvijamo, stena sifona za smetano je napeta v dveh smereh. Iz nateznega preizkusa pa poznamo le eno število, mejo tečenja. Kako primerjati tako zapleteno stanje z enim številom? Odgovor dajo **hipoteze o porušitvi** in **primerjalne napetosti**.

## Razlaga

**Korak 1 – eno število iz preizkusa.** Pri nateznem preizkusu deluje ena sama napetost $\sigma$. Duktilno jeklo začne trajno teči pri **meji tečenja** $R_e$, krhka snov (steklo, lito železo, keramika, suha testenina) poči pri **natezni trdnosti** $R_m$. Dopustna napetost je $\sigma_{\mathrm{dop}} = \dfrac{R_e}{\nu}$, kjer je $\nu$ varnostni faktor.

*Preveri:* $R_e = 240\,\mathrm{MPa}$ in $\nu = 2$. Koliko je $\sigma_{\mathrm{dop}}$? (Odgovor: $120\,\mathrm{MPa}$.)

**Korak 2 – zamisel primerjalne napetosti.** V stroju je napetostno stanje večosno. **Primerjalna napetost** $\sigma_{\mathrm{pr}}$ je tista enoosna napetost, ki je za material *enako nevarna* kot dano večosno stanje. Pogoj trdnosti je potem preprost:

$$\sigma_{\mathrm{pr}} \le \sigma_{\mathrm{dop}}$$

Kako iz stanja izračunati $\sigma_{\mathrm{pr}}$, pove hipoteza o porušitvi. Vsaka hipoteza izbere eno količino, ki naj bi odločala o porušitvi.

*Preveri:* kolikšna je $\sigma_{\mathrm{pr}}$ pri čistem nategu z $\sigma = 90\,\mathrm{MPa}$? (Odgovor: $90\,\mathrm{MPa}$, saj je to že enoosno stanje.)

**Korak 3 – glavne napetosti po vrsti.** Iz lekcije o ravninskem napetostnem stanju znaš izračunati glavni napetosti v ravnini, $\sigma'$ in $\sigma''$. Tretja glavna napetost, pravokotno na ravnino, je $0$. Vse tri razvrstimo po velikosti: $\sigma_1 \ge \sigma_2 \ge \sigma_3$. Ničla dobi svoje mesto v vrsti kot vsaka druga vrednost.

*Preveri:* $\sigma' = 80\,\mathrm{MPa}$, $\sigma'' = -20\,\mathrm{MPa}$. Kaj so $\sigma_1$, $\sigma_2$, $\sigma_3$? (Odgovor: $80$, $0$ in $-20\,\mathrm{MPa}$.)

**Korak 4 – krhke snovi: največja normalna napetost.** Krhka snov poči, ko največja natezna napetost doseže $R_m$. Ta hipoteza (Rankine) je najpreprostejša:

$$\sigma_{\mathrm{pr}} = \sigma_1$$

Pri čistem zvijanju sta glavni napetosti $\sigma_1 = \tau$ in $\sigma_3 = -\tau$.

:::premisli
Na kateri ploskvi deluje $\sigma_1 = \tau$ pri čistem zvijanju (spomni se Mohrovega kroga)? Zakaj je zato špaget počil po vijačnici pod $45^\circ$ in ne po prečnem prerezu, kjer je strižna napetost največja?
---
Ker je krhek. Ne zanima ga strig, ampak natezna napetost. Največja natezna napetost $\sigma_1 = \tau$ pri čistem zvijanju deluje pravokotno na ploskve pod $45^\circ$, zato razpoka sledi njim in se ovije v vijačnico.
:::

**Korak 5 – duktilne snovi: Tresca.** Jeklo teče, ker kristalne ravnine zdrsnejo druga po drugi. Zdrs povzroča strig. Tresca zato trdi: tečenje se začne, ko največja strižna napetost doseže vrednost iz nateznega preizkusa. V vsakem stanju je $\tau_{\max} = \dfrac{\sigma_1 - \sigma_3}{2}$, pri preizkusu pa $\tau_{\max} = \dfrac{R_e}{2}$. Ko polovici izenačimo:

$$\sigma_{\mathrm{pr}} = \sigma_1 - \sigma_3$$

*Preveri:* stanje $80$, $0$, $-20\,\mathrm{MPa}$. (Odgovor: $\sigma_{\mathrm{pr}} = 100\,\mathrm{MPa}$.)

**Korak 6 – duktilne snovi: von Mises.** Tresca upošteva le največjo in najmanjšo napetost, srednje $\sigma_2$ pa ne. Von Misesova hipoteza (tudi hipoteza energije spremembe oblike) upošteva vse tri razlike:

$$\sigma_{\mathrm{pr}} = \sqrt{\tfrac{1}{2}\left[(\sigma_1 - \sigma_2)^2 + (\sigma_2 - \sigma_3)^2 + (\sigma_3 - \sigma_1)^2\right]}$$

Z meritvami na duktilnih kovinah se ujema bolje kot Tresca. Hidrostatični tlak (vse tri napetosti enake) da $\sigma_{\mathrm{pr}} = 0$: enakomeren stisk z vseh strani oblike ne spremeni in kovina ne teče.

*Preveri:* enoosni nateg $\sigma_1 = \sigma$, $\sigma_2 = \sigma_3 = 0$. Kaj da formula? (Odgovor: $\sqrt{\tfrac12 (\sigma^2 + \sigma^2)} = \sigma$, kot mora.)

**Korak 7 – upogib in torzija skupaj.** V gredi deluje v istem vlaknu normalna napetost $\sigma$ (upogib) in strižna $\tau$ (torzija), druga normalna napetost je $0$. Glavnih napetosti ni treba računati posebej, ker se splošni formuli poenostavita (izpeljava je v razdelku »Bolj natančno«):

$$\sigma_{\mathrm{pr,M}} = \sqrt{\sigma^2 + 3\tau^2}$$

$$\sigma_{\mathrm{pr,T}} = \sqrt{\sigma^2 + 4\tau^2}$$

:::premisli
Pri čistem strigu ($\sigma = 0$) napovej: kolikšna je $\sigma_{\mathrm{pr}}$ po vsaki hipotezi in katera je strožja?
---
Tresca da $2\tau$, von Mises $\sqrt{3}\,\tau \approx 1{,}73\,\tau$. Tresca je strožja, za $\dfrac{2}{\sqrt3} \approx 1{,}155$, torej za $15{,}5\,\%$. To je največja razlika med hipotezama v katerem koli stanju.
:::

**Korak 8 – primerjava v tabeli.** Za nekaj značilnih stanj ($\sigma_3 = 0$, razen pri strigu):

| stanje | Tresca | von Mises |
|---|---|---|
| nateg $\sigma$ | $\sigma$ | $\sigma$ |
| dvoosno $\sigma,\ \sigma$ | $\sigma$ | $\sigma$ |
| dvoosno $\sigma,\ \sigma/2$ | $\sigma$ | $0{,}866\,\sigma$ |
| strig $\tau$ ($\tau,\ 0,\ -\tau$) | $2\tau$ | $1{,}73\,\tau$ |

Tresca je vedno enaka ali večja od von Misesa, zato je na varni strani. Za duktilne kovine projektanti večinoma uporabljajo von Misesa, Tresco pa za hitro, konservativno oceno. Za krhke snovi velja hipoteza največje normalne napetosti.

## Rešeni primeri

### Primer 1 (lažji): gred stoječega mešalnika

V površinskem vlaknu gredi stoječega mešalnika za testo deluje upogibna napetost $60\,\mathrm{MPa}$ in strižna napetost zaradi torzije $40\,\mathrm{MPa}$. Dopustna napetost je $120\,\mathrm{MPa}$. Izračunaj primerjalno napetost po obeh hipotezah za duktilne snovi in ugotovi, ali gred zdrži.

**Podatki:** $\sigma = 60\,\mathrm{MPa}$, $\tau = 40\,\mathrm{MPa}$, $\sigma_{\mathrm{dop}} = 120\,\mathrm{MPa}$
**Iščemo:** $\sigma_{\mathrm{pr,M}}$, $\sigma_{\mathrm{pr,T}}$ in ali velja $\sigma_{\mathrm{pr}} \le \sigma_{\mathrm{dop}}$

:::formula
$\sigma_{\mathrm{pr,M}} = \sqrt{\sigma^2 + 3\tau^2}$, $\quad \sigma_{\mathrm{pr,T}} = \sqrt{\sigma^2 + 4\tau^2}$
:::

**Rešitev:**

1. Von Mises: $\sigma_{\mathrm{pr,M}} = \sqrt{60^2 + 3 \cdot 40^2} = 91{,}65\,\mathrm{MPa}$.
2. Tresca: $\sigma_{\mathrm{pr,T}} = \sqrt{60^2 + 4 \cdot 40^2} = 100\,\mathrm{MPa}$.
3. Obe vrednosti sta pod $120\,\mathrm{MPa}$. Tresca je večja, kot vedno.
4. Odgovor: $\sigma_{\mathrm{pr,M}} \approx 91{,}7\,\mathrm{MPa}$, $\sigma_{\mathrm{pr,T}} = 100\,\mathrm{MPa}$; gred zdrži po obeh hipotezah.

### Primer 2: stena sifona za smetano

Sifon za stepeno smetano je jeklena posoda pod tlakom. V njegovi steni sta glavni napetosti v ravnini $\sigma_t = 45\,\mathrm{MPa}$ (obodna) in $\sigma_a = 22{,}5\,\mathrm{MPa}$ (osna), napetost pravokotno na steno je zanemarljiva. Meja tečenja jekla je $R_e = 300\,\mathrm{MPa}$. Kolikšen je varnostni faktor po Tresci in po von Misesu?

**Podatki:** $\sigma_t = 45\,\mathrm{MPa}$, $\sigma_a = 22{,}5\,\mathrm{MPa}$, $\sigma_r \approx 0$, $R_e = 300\,\mathrm{MPa}$
**Iščemo:** $\nu_{\mathrm{T}}$ in $\nu_{\mathrm{M}}$

:::formula
$\sigma_{\mathrm{pr,T}} = \sigma_1 - \sigma_3$, $\quad \sigma_{\mathrm{pr,M}} = \sqrt{\tfrac{1}{2}\left[(\sigma_1 - \sigma_2)^2 + (\sigma_2 - \sigma_3)^2 + (\sigma_3 - \sigma_1)^2\right]}$, $\quad \nu = \dfrac{R_e}{\sigma_{\mathrm{pr}}}$
:::

**Rešitev:**

1. Razvrstitev: $\sigma_1 = 45$, $\sigma_2 = 22{,}5$, $\sigma_3 = 0\,\mathrm{MPa}$. Ničla je tu najmanjša, zato je $\sigma_3$.
2. Tresca: $\sigma_{\mathrm{pr,T}} = 45 - 0 = 45\,\mathrm{MPa}$. Razlika $45 - 22{,}5$ bi bila napačna, ker izpusti tretjo smer.
3. Von Mises: $\sigma_{\mathrm{pr,M}} = \sqrt{\tfrac{1}{2}\left[22{,}5^2 + 22{,}5^2 + 45^2\right]} = 38{,}97\,\mathrm{MPa}$.
4. Varnost po Tresci: $\nu_{\mathrm{T}} = \dfrac{300}{45} = 6{,}67$.
5. Varnost po von Misesu: $\nu_{\mathrm{M}} = \dfrac{300}{38{,}97} = 7{,}70$.
6. Odgovor: $\nu_{\mathrm{T}} \approx 6{,}7$ in $\nu_{\mathrm{M}} \approx 7{,}7$. Sifon je z veliko rezervo varen. Kdor bi pri Tresci vzel $\sigma_1 - \sigma_2$, bi dobil dvakrat preveliko varnost.

### Primer 3 (težji): koliko navora prenese gred kuhinjskega robota

Gred kuhinjskega robota ima premer $d = 10\,\mathrm{mm}$ in jo upogiba moment $M = 5\,\mathrm{N\,m}$. Jeklo ima $R_e = 300\,\mathrm{MPa}$, zahtevani varnostni faktor je $\nu = 2$. Kolikšen največji torzijski moment $T$ sme prenašati gred po von Misesu? Nato isto oceni po Tresci.

**Podatki:** $d = 10\,\mathrm{mm}$, $M = 5\,\mathrm{N\,m} = 5000\,\mathrm{N\,mm}$, $R_e = 300\,\mathrm{MPa}$, $\nu = 2$
**Iščemo:** največji $T$ po von Misesu in po Tresci

:::formula
$\sigma = \dfrac{M}{W}$, $W = \dfrac{\pi d^3}{32}$; $\quad \tau = \dfrac{T}{W_p}$, $W_p = \dfrac{\pi d^3}{16}$; $\quad \sqrt{\sigma^2 + 3\tau^2} \le \sigma_{\mathrm{dop}}$
:::

**Rešitev:**

1. Dopustna napetost: $\sigma_{\mathrm{dop}} = \dfrac{300}{2} = 150\,\mathrm{MPa}$.
2. Odpornostna momenta: $W = 98{,}17\,\mathrm{mm^3}$ in $W_p = 196{,}35\,\mathrm{mm^3}$ (polarni je dvakrat večji).
3. Upogibna napetost: $\sigma = \dfrac{5000}{98{,}17} = 50{,}93\,\mathrm{MPa}$.
4. Iz pogoja izrazimo $\tau$: $\tau_{\max} = \sqrt{\dfrac{150^2 - 50{,}93^2}{3}} = 81{,}46\,\mathrm{MPa}$. Upogib že porabi del dopustne napetosti, za torzijo ostane le preostali del.
5. Navor: $T = 81{,}46 \cdot 196{,}35 = 15994\,\mathrm{N\,mm}$, torej $T \approx 16{,}0\,\mathrm{N\,m}$.
6. Po Tresci se spremeni le faktor pred $\tau^2$. Izračunaj sam.

:::premisli
Kolikšen je največji $T$ po Tresci?
---
$\tau_{\max} = \sqrt{\dfrac{150^2 - 50{,}93^2}{4}} \approx 70{,}5\,\mathrm{MPa}$, nato $T = 70{,}5 \cdot 196{,}35 \approx 13850\,\mathrm{N\,mm} \approx 13{,}9\,\mathrm{N\,m}$. Tresca dopusti manj, ker je strožja.
:::

## Pogoste napake

- **Pozabljena ničla pri Tresci.** Ko sta obe glavni napetosti v ravnini pozitivni, je najmanjša $\sigma_3 = 0$. Kdor vzame $\sigma' - \sigma''$, upošteva le strig v ravnini, ne največjega, ki deluje na ploskvah zunaj nje. Pri sifonu bi to dalo $22{,}5$ namesto $45\,\mathrm{MPa}$.
- **$\sqrt{\sigma^2 + 3\tau^2}$ za vsako stanje.** Ta oblika velja le, ko je ena normalna napetost $0$ (upogib s torzijo). Za stanje $\sigma_x$, $\sigma_y$, $\tau_{xy}$ najprej izračunaj glavne napetosti in uporabi splošno formulo.
- **»Von Mises je bolj varen, ker je novejši.«** Ravno obratno: von Mises da manjšo ali enako $\sigma_{\mathrm{pr}}$. Tresca je konservativnejša, von Mises natančnejši za duktilne kovine.
- **Duktilna hipoteza za krhko snov.** Za steklen pokrov ali keramično posodo von Mises precenjuje nosilnost. Krhke snovi popustijo zaradi natega, zato uporabi $\sigma_{\mathrm{pr}} = \sigma_1$ in primerjaj z $R_m$.
- **Primerjava s $\tau_{\mathrm{dop}}$.** $\sigma_{\mathrm{pr}}$ je normalna napetost in jo primerjaš z $\sigma_{\mathrm{dop}}$ iz nateznega preizkusa, ne s strižno dopustno napetostjo.

## Povzetek

- Primerjalna napetost $\sigma_{\mathrm{pr}}$ je enoosna napetost, enako nevarna kot dano stanje; pogoj je $\sigma_{\mathrm{pr}} \le \sigma_{\mathrm{dop}}$.
- Glavne napetosti vedno razvrsti $\sigma_1 \ge \sigma_2 \ge \sigma_3$, z ničlo iz tretje smeri vred.
- Krhke snovi: $\sigma_{\mathrm{pr}} = \sigma_1$ (primerjaj z $R_m$).
- Tresca: $\sigma_{\mathrm{pr}} = \sigma_1 - \sigma_3$; von Mises: koren iz polovice vsote kvadratov razlik.
- Upogib s torzijo: $\sqrt{\sigma^2 + 4\tau^2}$ (Tresca), $\sqrt{\sigma^2 + 3\tau^2}$ (von Mises).
- Tresca $\ge$ von Mises, največ za $15{,}5\,\%$ (čisti strig).

## Drugače: Na sliki

Nariši ravnino z osema $\sigma'$ (vodoravno) in $\sigma''$ (navpično), tretja napetost naj bo $0$. Vsako ravninsko stanje je ena točka. Meja tečenja je sklenjena krivulja okrog izhodišča: znotraj je varno, zunaj material teče.

- **Von Mises** je **elipsa**, nagnjena za $45^\circ$, z daljšo osjo vzdolž premice $\sigma' = \sigma''$.
- **Tresca** je **šestkotnik**, vrisan v elipso.
- Skupnih imata šest točk: $(\pm R_e;\ 0)$, $(0;\ \pm R_e)$ in $(R_e;\ R_e)$, $(-R_e;\ -R_e)$. To so enoosna stanja ter enakomerni dvoosni nateg in tlak, kjer hipotezi dasta isto.
- Največja vrzel je na premici $\sigma'' = -\sigma'$, to je čisti strig. Tam šestkotnik seka pri $\sigma' = 0{,}5\,R_e$, elipsa šele pri $0{,}577\,R_e$.

| točka | stanje | Tresca | von Mises |
|---|---|---|---|
| $(R_e;\ 0)$ | nateg | meja | meja |
| $(R_e;\ R_e)$ | dvoosni nateg | meja | meja |
| $(0{,}55\,R_e;\ -0{,}55\,R_e)$ | strig | zunaj | znotraj |

Šestkotnik je povsod znotraj elipse, zato je Tresca na varni strani.

## Drugače: Bolj natančno

**Od kod $\sqrt{\sigma^2 + 4\tau^2}$ in $\sqrt{\sigma^2 + 3\tau^2}$.** Pri $\sigma_x = \sigma$, $\sigma_y = 0$, $\tau_{xy} = \tau$ sta glavni napetosti v ravnini $\dfrac{\sigma}{2} \pm \sqrt{\dfrac{\sigma^2}{4} + \tau^2}$. Prva je pozitivna, druga negativna, zato je $\sigma_2 = 0$. Tresca: $\sigma_1 - \sigma_3 = 2\sqrt{\dfrac{\sigma^2}{4} + \tau^2} = \sqrt{\sigma^2 + 4\tau^2}$. Pri von Misesu z $\sigma_2 = 0$ dobimo $\sigma_{\mathrm{pr}}^2 = \sigma_1^2 - \sigma_1\sigma_3 + \sigma_3^2$. Ker je $\sigma_1 + \sigma_3 = \sigma$ in $\sigma_1\sigma_3 = -\tau^2$, sledi $\sigma_{\mathrm{pr}}^2 = \sigma^2 - 3\sigma_1\sigma_3 = \sigma^2 + 3\tau^2$.

**Energija spremembe oblike.** Specifično deformacijsko energijo lahko razdelimo na del, ki spremeni prostornino, in del, ki spremeni obliko. Za linearno elastično izotropno snov je drugi del

$$u_d = \frac{(\sigma_1 - \sigma_2)^2 + (\sigma_2 - \sigma_3)^2 + (\sigma_3 - \sigma_1)^2}{12\,G}$$

kjer je $G$ strižni modul. Pri enoosnem nategu je $u_d = \dfrac{\sigma^2}{6G}$. Von Mises trdi, da tečenje nastopi, ko $u_d$ doseže vrednost iz preizkusa. Izenačitev da natanko formulo za $\sigma_{\mathrm{pr,M}}$. Enak rezultat dobiš iz strižne napetosti na oktaedrski ploskvi, ki je enako nagnjena na vse tri glavne smeri.

**Meje hipotez.** Obe duktilni hipotezi predpostavljata, da hidrostatični del ($\sigma_1 = \sigma_2 = \sigma_3$) ne povzroči tečenja, in da je material enak v nategu in tlaku. Za krhke snovi, ki so v tlaku mnogo močnejše, se uporabljajo še Mohrova in Coulomb-Mohrova hipoteza.

## Preveri se

? Katera trojica pravilno pove, kaj računamo pri posamezni hipotezi?
- krhke: $\sigma_1 - \sigma_3$; Tresca: $\sigma_1$; von Mises: $\sqrt{\sigma^2 + 3\tau^2}$
~ Zamenjal si krhke snovi in Tresco. Krhke snovi popustijo zaradi največjega natega $\sigma_1$, Tresca meri strig $\sigma_1 - \sigma_3$.
+ krhke: $\sigma_1$; Tresca: $\sigma_1 - \sigma_3$; von Mises: $\sqrt{\sigma^2 + 3\tau^2}$
- krhke: $\sigma_1$; Tresca: $\sqrt{\sigma^2 + 3\tau^2}$; von Mises: $\sqrt{\sigma^2 + 4\tau^2}$
~ Faktorja sta zamenjana. Večji faktor $4$ pripada strožji hipotezi, to je Tresci.
> Rankine: $\sigma_1$; Tresca: $\sigma_1 - \sigma_3$ oz. $\sqrt{\sigma^2 + 4\tau^2}$; von Mises: $\sqrt{\sigma^2 + 3\tau^2}$ pri upogibu s torzijo.

? Gred je obremenjena le s torzijo, $\tau = 50\,\mathrm{MPa}$. Približno kolikšna je primerjalna napetost po von Misesu?
- $50\,\mathrm{MPa}$
~ To je strižna napetost sama. Primerjalna napetost je enoosna normalna napetost, ki je enako nevarna, in je večja.
- $71\,\mathrm{MPa}$
~ To je $\sqrt{2}\,\tau$. Pri von Misesu je faktor pred $\tau^2$ enak $3$, ne $2$.
+ $87\,\mathrm{MPa}$
- $100\,\mathrm{MPa}$
~ To je rezultat po Tresci, $2\tau$. Von Mises da manj.
> $\sigma_{\mathrm{pr,M}} = \sqrt{3}\,\tau \approx 1{,}73 \cdot 50 \approx 87\,\mathrm{MPa}$.

? Zakaj se suh špaget pri zvijanju zlomi po vijačnici pod $45^\circ$?
- Ker je strižna napetost pri torziji največja na ploskvah pod $45^\circ$.
~ Pri čisti torziji je strig največji v prečnem in vzdolžnem prerezu. Pod $45^\circ$ je največja normalna napetost.
+ Ker je krhka in poči po ploskvi, na katero deluje največja natezna napetost $\sigma_1 = \tau$.
- Ker po Tresci duktilne snovi tečejo pod $45^\circ$.
~ Špaget ni duktilen: ne teče, ampak takoj poči. Tresca opisuje tečenje duktilnih kovin.
> Pri čisti torziji je $\sigma_1 = \tau$ na ploskvi pod $45^\circ$. Krhka snov sledi največjemu nategu, zato razpoka zavije v vijačnico.

? V gredi je upogibna napetost $\sigma = 120\,\mathrm{MPa}$, dopustna napetost je $150\,\mathrm{MPa}$. Kolikšna je največja dopustna strižna napetost $\tau$ po Tresci?
- $30\,\mathrm{MPa}$
~ Napetosti si odštel neposredno. Pod korenom se seštevajo kvadrati: $\sigma^2 + 4\tau^2 \le \sigma_{\mathrm{dop}}^2$.
+ $45\,\mathrm{MPa}$
- $52\,\mathrm{MPa}$
~ Uporabil si von Misesa (faktor $3$). Tresca ima faktor $4$ in dopušča manj.
- $15\,\mathrm{MPa}$
~ To je $\dfrac{150 - 120}{2}$, linearno odštevanje namesto kvadratov.
> $\tau = \sqrt{\dfrac{150^2 - 120^2}{4}} = \sqrt{\dfrac{8100}{4}} = 45\,\mathrm{MPa}$.

? Steklen pokrov lonca je v sredini obremenjen dvoosno: $\sigma' = 30\,\mathrm{MPa}$, $\sigma'' = 20\,\mathrm{MPa}$. S čim primerjaš, ali bo počil?
- Z von Misesovo $\sigma_{\mathrm{pr}} \approx 26\,\mathrm{MPa}$ in mejo tečenja.
~ Steklo nima meje tečenja in ne teče. Von Mises opisuje duktilne kovine.
- S Trescovo $\sigma_{\mathrm{pr}} = 10\,\mathrm{MPa}$, razliko obeh napetosti.
~ Tresca ne velja za krhke snovi, poleg tega je $\sigma_3 = 0$, zato bi bila $30\,\mathrm{MPa}$, ne $10$.
+ Z največjo natezno napetostjo $\sigma_1 = 30\,\mathrm{MPa}$ in natezno trdnostjo stekla $R_m$.
> Steklo je krhko: poči, ko $\sigma_1$ doseže $R_m$. Zato $\sigma_{\mathrm{pr}} = \sigma_1 = 30\,\mathrm{MPa}$.

:::simboli
\sigma_{\mathrm{pr}} | primerjalna napetost | | MPa | enoosna, enako nevarna napetost
\sigma_{\mathrm{pr,M}} | primerjalna napetost po von Misesu | \sigma_{\mathrm{pr,M}} = \sqrt{\sigma^2 + 3\tau^2} | MPa | oblika za upogib s torzijo
\sigma_{\mathrm{pr,T}} | primerjalna napetost po Tresci | \sigma_{\mathrm{pr,T}} = \sigma_1 - \sigma_3 | MPa
\sigma_{\mathrm{dop}} | dopustna napetost | \sigma_{\mathrm{dop}} = \frac{R_e}{\nu} | MPa
\sigma_1, \sigma_2, \sigma_3 | glavne napetosti po velikosti | | MPa | $\sigma_1 \ge \sigma_2 \ge \sigma_3$
\sigma | normalna (upogibna) napetost | \sigma = \frac{M}{W} | MPa
\tau | strižna (torzijska) napetost | \tau = \frac{T}{W_p} | MPa
R_e | meja tečenja | | MPa
R_m | natezna trdnost | | MPa | za krhke snovi
\nu | varnostni faktor | \nu = \frac{R_e}{\sigma_{\mathrm{pr}}} | –
M | upogibni moment | | N\,mm
T | torzijski moment | | N\,mm
W | odpornostni moment pri upogibu | W = \frac{\pi d^3}{32} | mm^3 | za krožni prerez
W_p | polarni odpornostni moment | W_p = \frac{\pi d^3}{16} | mm^3 | za krožni prerez
d | premer gredi | | mm
u_d | specifična energija spremembe oblike | | J/m^3
G | strižni modul | | MPa
\pi | število pi | | 
:::
