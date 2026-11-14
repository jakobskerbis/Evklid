---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V začetku 20. stoletja je v pivovarni Guinness v Dublinu delal kemik William Sealy Gosset. Pivovarna je preizkušala sorte ječmena in hmelja, a vsak poskus je bil drag, zato je imel Gosset pogosto le nekaj meritev. Takratne statistične metode so predpostavljale velike vzorce, pri katerih je vzorčni standardni odklon praktično enak pravemu. Pri štirih ali petih meritvah to ni res, in sklepi so bili preveč samozavestni. Gosset je izračunal, kako se obnaša povprečje majhnega vzorca, ko standardni odklon le ocenimo. Ker pivovarna ni želela, da bi konkurenca izvedela za njene metode, je rezultat objavil pod psevdonimom »Student«. Porazdelitev, ki jo je našel, še danes imenujemo Studentova porazdelitev $t$.

Isto vprašanje si postaviš v vsakem fizikalnem praktikumu. Z nihalom dvanajstkrat izmeriš težni pospešek in dobiš povprečje $9{,}787\,\mathrm{m/s^2}$. Tabela pravi $9{,}81\,\mathrm{m/s^2}$. Je razlika le naključje meritev ali ima tvoj poskus sistematično napako? Odgovor dasta orodji statističnega sklepanja: **interval zaupanja**, ki pove, kje je prava vrednost verjetno, in **preizkus domneve**, ki pove, ali podatki nasprotujejo trditvi. V varnosti z istima orodjema odločamo, ali je novi postopek res zmanjšal pogostost nezgod ali je razlika naključna.

## Razlaga

### Slika: kako niha vzorčno povprečje

Predstavljaj si, da isti poskus (25 meritev nihala) ponoviš velikokrat in vsakič izračunaš povprečje $\bar x$. Povprečja ne bodo enaka; razporedijo se okoli prave vrednosti $\mu$ v zvonasti obliki. Iz lekcije o pričakovani vrednosti in disperziji veš, da je za neodvisne meritve $E(\bar X) = \mu$ in $D(\bar X) = \sigma^2/n$, zato je standardni odklon povprečja

$$\sigma_{\bar X} = \frac{\sigma}{\sqrt n},$$

čemur pravimo **standardna napaka**. Na številski premici:

```
2,5 %   95 % povprečij   2,5 %
----|---------|---------|----
    L         μ         U

L = μ − 1,96·σ/√n
U = μ + 1,96·σ/√n
```

Če so meritve normalno porazdeljene, je $\bar X$ normalen; po centralnem limitnem izreku je približno normalen tudi pri drugih porazdelitvah, če je $n$ dovolj velik (praktično $n \gtrsim 30$). Med mejama $L$ in $U$ na skici, $\mu - 1{,}96\,\sigma/\sqrt n$ in $\mu + 1{,}96\,\sigma/\sqrt n$, pade $95\,\%$ povprečij.

Zdaj obrnemo pogled. Če je $\bar x$ manj kot $1{,}96\,\sigma/\sqrt n$ od $\mu$, je tudi $\mu$ manj kot $1{,}96\,\sigma/\sqrt n$ od $\bar x$. Interval okoli **izmerjenega** povprečja zato v $95\,\%$ ponovitev zajame pravo vrednost. To je interval zaupanja.

Druga slika: dvajset študentov vsak izmeri svojih 25 nihajev in nariše svoj interval. Intervali so različni, pravi $\mu$ je ena sama navpična črta. Pričakujemo, da jo bo sekalo okoli $19$ intervalov, okoli $1$ pa jo bo zgrešil – in nihče od študentov ne ve, ali je prav njegov tisti.

### Intervali zaupanja

**Definicija.** Naj bo $0 < \alpha < 1$. Slučajni interval $[L, U]$, izračunan iz vzorca, je **interval zaupanja** za parameter $\theta$ s **stopnjo zaupanja** $1 - \alpha$, če je

$$P(L \leq \theta \leq U) = 1 - \alpha$$

za vsako možno vrednost $\theta$. Verjetnost se nanaša na **postopek** (meji $L$, $U$ sta slučajni), ne na $\theta$, ki je neznana konstanta. Ko enkrat izračunamo številki, interval $\theta$ vsebuje ali ne; rečemo, da smo $95\,\%$ »prepričani«, ne da je verjetnost $95\,\%$.

**Konstrukcija s pivotom.** Iščemo funkcijo vzorca in parametra, katere porazdelitev ne vsebuje neznank. Pri normalnih meritvah z znanim $\sigma$ je to

$$Z = \frac{\bar X - \mu}{\sigma/\sqrt n} \sim N(0, 1).$$

Naj bo $z_{1-\alpha/2}$ kvantil standardne normalne porazdelitve ($\Phi(z_{1-\alpha/2}) = 1 - \alpha/2$; pri $\alpha = 0{,}05$ je $z_{0{,}975} = 1{,}960$). Potem $P(-z_{1-\alpha/2} \leq Z \leq z_{1-\alpha/2}) = 1 - \alpha$. Neenakosti razrešimo na $\mu$:

$$\bar X - z_{1-\alpha/2}\frac{\sigma}{\sqrt n} \leq \mu \leq \bar X + z_{1-\alpha/2}\frac{\sigma}{\sqrt n}.$$

**Neznan $\sigma$: Studentova porazdelitev.** Navadno $\sigma$ ne poznamo in ga nadomestimo z vzorčnim standardnim odklonom $s$ (z delitvijo z $n - 1$; zakaj ravno z $n - 1$, pokaže lekcija o cenilkah).

**Izrek (Gosset).** Naj bodo $X_1, \dots, X_n$ neodvisne in porazdeljene po $N(\mu, \sigma)$. Potem ima

$$T = \frac{\bar X - \mu}{S/\sqrt n}$$

Studentovo porazdelitev $t$ z $n - 1$ prostostnimi stopnjami.

Porazdelitev $t$ je simetrična in zvonasta kot normalna, a ima debelejše repe: zaradi negotovosti v $S$ so velika odstopanja pogostejša. Ko $n$ raste, gre proti $N(0, 1)$. Interval zaupanja za $\mu$ je

$$\bar x \pm t_{n-1,\,1-\alpha/2}\,\frac{s}{\sqrt n}.$$

Nekaj kvantilov za $95\,\%$ zaupanje:

| $n - 1$ | $t_{n-1;\,0{,}975}$ |
|---|---|
| $5$ | $2{,}571$ |
| $7$ | $2{,}365$ |
| $11$ | $2{,}201$ |
| $\infty$ | $1{,}960$ |

Pri šestih meritvah ($n - 1 = 5$) je interval zaradi $t$ za okoli $31\,\%$ širši, kot bi bil z $z$. To je Gossetov popravek.

**Delež.** Za delež $p$ (izkoristek detektorja, delež okvarjenih kosov) iz $k$ uspehov v $n$ poskusih je $\hat p = k/n$ in pri velikem $n$ (praktično $n\hat p \geq 10$ in $n(1 - \hat p) \geq 10$) približno

$$\hat p \pm z_{1-\alpha/2}\sqrt{\frac{\hat p(1 - \hat p)}{n}}.$$

**Velikost vzorca.** Če želimo, da je polovična širina intervala za $\mu$ največ $E$, mora biti $z_{1-\alpha/2}\sigma/\sqrt n \leq E$, torej $n \geq \left(z_{1-\alpha/2}\,\sigma/E\right)^2$. Natančnost raste le s korenom: za dvakrat ožji interval potrebujemo štirikrat več meritev.

:::premisli
Študentka izračuna $95\,\%$ interval zaupanja $[9{,}771; 9{,}803]\,\mathrm{m/s^2}$ in zapiše: »Z verjetnostjo $95\,\%$ je pravi $g$ v tem intervalu.« Kaj je narobe in kako bi rekla pravilno?
---
Pravi $g$ ni slučajen, zato ni verjetnosti, da »pade« v ta interval: je v njem ali ni. Slučajen je postopek. Pravilno: »Interval je izračunan s postopkom, ki v $95\,\%$ ponovitev zajame pravo vrednost.« Krajše: »$95\,\%$ interval zaupanja za $g$ je $[9{,}771; 9{,}803]\,\mathrm{m/s^2}$.«
:::

### Preizkušanje domnev

Pri preizkusu domneve ne ocenjujemo, ampak odločamo. Postopek je kot sodni proces: obtoženec je nedolžen, dokler dokazi ne kažejo prepričljivo drugače.

**Definicije.**

- **Ničelna domneva** $H_0$ je trditev, ki jo preverjamo, navadno »ni učinka« ali »parameter ima vrednost $\theta_0$«, npr. $H_0\colon \mu = 9{,}81\,\mathrm{m/s^2}$.
- **Alternativna domneva** $H_1$ je tisto, kar sprejmemo, če $H_0$ zavrnemo: dvostranska $\mu \neq \mu_0$ ali enostranska $\mu > \mu_0$ (oz. $\mu < \mu_0$).
- **Testna statistika** je funkcija vzorca s porazdelitvijo, znano ob predpostavki $H_0$, npr. $t = (\bar x - \mu_0)/(s/\sqrt n)$.
- **Kritično območje** so vrednosti statistike, pri katerih $H_0$ zavrnemo; **stopnja značilnosti** $\alpha$ je verjetnost, da statistika pade vanj, ko $H_0$ velja.
- **$p$-vrednost** je verjetnost, da bi ob veljavni $H_0$ dobili statistiko, ki je vsaj tako skrajna kot opažena. $H_0$ zavrnemo, če je $p \leq \alpha$.

Izid je lahko napačen na dva načina:

| odločitev | $H_0$ velja | $H_0$ ne velja |
|---|---|---|
| zavrnemo | napaka 1 | prav |
| ne zavrnemo | prav | napaka 2 |

Napaka 1. vrste (zavrnemo resnično $H_0$) ima verjetnost $\alpha$, napaka 2. vrste (ne zavrnemo napačne $H_0$) verjetnost $\beta$; verjetnost pravilne zavrnitve, $1 - \beta$, je **moč** testa.

$\alpha$ izberemo vnaprej (navadno $0{,}05$). $\beta$ je odvisna od tega, kako daleč je resnica od $H_0$, od $\sigma$ in od $n$. Manjši $\alpha$ pri istem $n$ poveča $\beta$; zmanjšati obe hkrati je mogoče le z večjim vzorcem.

**Postopek ($t$-test za povprečje).**

1. Postavi $H_0\colon \mu = \mu_0$ in $H_1$; izberi $\alpha$.
2. Izračunaj $t = \dfrac{\bar x - \mu_0}{s/\sqrt n}$.
3. Dvostransko zavrni $H_0$, če je $|t| > t_{n-1,\,1-\alpha/2}$ (enostransko pri $H_1\colon \mu > \mu_0$: če je $t > t_{n-1,\,1-\alpha}$).
4. Odločitev zapiši v jeziku naloge, ne le »zavrnemo $H_0$«.

»Ne zavrnemo $H_0$« ne pomeni »$H_0$ je dokazana«. Pomeni le, da podatki ne zadoščajo za zavrnitev – morda je vzorec premajhen.

**Izrek (dualnost).** Dvostranski test stopnje značilnosti $\alpha$ zavrne $H_0\colon \mu = \mu_0$ natanko tedaj, ko $\mu_0$ ne leži v intervalu zaupanja s stopnjo $1 - \alpha$.

**Dokaz.** Test ne zavrne $H_0$, kadar je $|\bar x - \mu_0| \leq t_{n-1,\,1-\alpha/2}\,s/\sqrt n$. To je natanko pogoj $\bar x - t_{n-1,\,1-\alpha/2}\,s/\sqrt n \leq \mu_0 \leq \bar x + t_{n-1,\,1-\alpha/2}\,s/\sqrt n$, torej $\mu_0$ leži v intervalu. $\square$

:::premisli
Pri $\alpha = 0{,}05$ dobiš $p = 0{,}03$ in zavrneš $H_0$. Kolega bi uporabil $\alpha = 0{,}01$. Kaj bi odločil on, in ali bi bil njegov $95\,\%$ interval zaupanja drugačen od tvojega?
---
Pri $\alpha = 0{,}01$ je $p = 0{,}03 > 0{,}01$, zato $H_0$ ne bi zavrnil. $95\,\%$ interval je enak za oba (odvisen je le od podatkov in stopnje zaupanja); kolega bi namesto njega uporabil širši $99\,\%$ interval, ki $\mu_0$ še vsebuje. Odločitev je odvisna od $\alpha$, $p$-vrednost pa ne.
:::

## Rešeni primeri

### Primer 1 (lažji)

Z nihalom petindvajsetkrat izmeriš težni pospešek. Povprečje je $\bar x = 9{,}790\,\mathrm{m/s^2}$. Iz specifikacij merilne opreme veš, da je standardni odklon posamezne meritve $\sigma = 0{,}050\,\mathrm{m/s^2}$. Določi $95\,\%$ interval zaupanja za pravo vrednost.

**Podatki:** $n = 25$, $\bar x = 9{,}790\,\mathrm{m/s^2}$, $\sigma = 0{,}050\,\mathrm{m/s^2}$ (znan), $1 - \alpha = 0{,}95$, $z_{0{,}975} = 1{,}960$
**Iščemo:** interval zaupanja za $\mu$

:::formula
$\bar x \pm z_{1-\alpha/2}\,\dfrac{\sigma}{\sqrt n}$
:::

**Rešitev:**

1. Standardna napaka: $\sigma/\sqrt n = 0{,}050/5\,\mathrm{m/s^2} = 0{,}010\,\mathrm{m/s^2}$.
2. Polovična širina: $1{,}960 \cdot 0{,}010\,\mathrm{m/s^2} \approx 0{,}020\,\mathrm{m/s^2}$.
3. Interval: $9{,}790 \pm 0{,}020$, torej $[9{,}770; 9{,}810]\,\mathrm{m/s^2}$.
4. Odgovor: $95\,\%$ interval zaupanja za $g$ je $[9{,}770; 9{,}810]\,\mathrm{m/s^2}$. Tabelna vrednost $9{,}81\,\mathrm{m/s^2}$ je tik nad zgornjo mejo (nezaokroženo $9{,}8096\,\mathrm{m/s^2}$), zato bi jo dvostranski test pri $\alpha = 0{,}05$ ravno še zavrnil ($z = -2{,}0$).

### Primer 2

Konstanto vzmeti osemkrat izmeriš s statično metodo: $24{,}8$; $25{,}3$; $25{,}1$; $24{,}6$; $25{,}4$; $25{,}0$; $24{,}9$ in $25{,}2\,\mathrm{N/m}$. Standardnega odklona metode ne poznaš. Določi $95\,\%$ interval zaupanja za pravo konstanto. Meritve so približno normalne.

**Podatki:** $n = 8$, meritve zgoraj, $\sigma$ neznan, $1 - \alpha = 0{,}95$, $t_{7;\,0{,}975} = 2{,}365$
**Iščemo:** $\bar x$, $s$, interval zaupanja za $\mu$

:::formula
$\bar x = \dfrac{1}{n}\sum x_i$, $s^2 = \dfrac{1}{n-1}\sum(x_i - \bar x)^2$, interval $\bar x \pm t_{n-1,\,1-\alpha/2}\,\dfrac{s}{\sqrt n}$
:::

**Rešitev:**

1. Povprečje: vsota je $200{,}3\,\mathrm{N/m}$, zato $\bar x = 200{,}3/8 \approx 25{,}04\,\mathrm{N/m}$.
2. Vsota kvadratov odmikov je približno $0{,}499\,\mathrm{(N/m)^2}$, zato $s^2 \approx 0{,}499/7 \approx 0{,}0713$ in $s \approx 0{,}267\,\mathrm{N/m}$.
3. Ker $\sigma$ ocenimo, uporabimo $t$ s $7$ prostostnimi stopnjami. Standardna napaka: $s/\sqrt 8 \approx 0{,}0944\,\mathrm{N/m}$.
4. Polovična širina: $2{,}365 \cdot 0{,}0944 \approx 0{,}223\,\mathrm{N/m}$.
5. Interval: $25{,}04 \pm 0{,}22$, torej $[24{,}81; 25{,}26]\,\mathrm{N/m}$.
6. Odgovor: $95\,\%$ interval zaupanja za konstanto vzmeti je približno $[24{,}81; 25{,}26]\,\mathrm{N/m}$. Z $z = 1{,}96$ namesto $t$ bi bil interval preozek za okoli $17\,\%$.

### Primer 3 (težji)

Dvanajst meritev težnega pospeška z nihalom da (v $\mathrm{m/s^2}$): $9{,}78$; $9{,}83$; $9{,}76$; $9{,}80$; $9{,}79$; $9{,}75$; $9{,}82$; $9{,}77$; $9{,}78$; $9{,}81$; $9{,}76$ in $9{,}79$. Na stopnji značilnosti $0{,}05$ preizkusi, ali se prava vrednost poskusa razlikuje od $9{,}81\,\mathrm{m/s^2}$. Oceni $p$-vrednost, določi $95\,\%$ interval zaupanja in preveri dualnost. Kaj sklepaš o poskusu?

**Podatki:** $n = 12$, meritve zgoraj, $\mu_0 = 9{,}81\,\mathrm{m/s^2}$, $\alpha = 0{,}05$, $t_{11;\,0{,}975} = 2{,}201$, $t_{11;\,0{,}995} = 3{,}106$
**Iščemo:** odločitev o $H_0$, oceno $p$, interval zaupanja

:::formula
$H_0\colon \mu = \mu_0$, $H_1\colon \mu \neq \mu_0$; $t = \dfrac{\bar x - \mu_0}{s/\sqrt n}$; zavrni, če $|t| > t_{n-1,\,1-\alpha/2}$; interval $\bar x \pm t_{n-1,\,1-\alpha/2}\,s/\sqrt n$
:::

**Rešitev:**

1. Domnevi: $H_0\colon \mu = 9{,}81\,\mathrm{m/s^2}$ (poskus nima sistematične napake), $H_1\colon \mu \neq 9{,}81\,\mathrm{m/s^2}$. Dvostransko, ker napaka lahko gre v obe smeri.
2. Povprečje: vsota je $117{,}44$, zato $\bar x = 117{,}44/12 \approx 9{,}7867\,\mathrm{m/s^2}$.
3. Vsota kvadratov odmikov je približno $0{,}006867$, zato $s = \sqrt{0{,}006867/11} \approx 0{,}0250\,\mathrm{m/s^2}$.
4. Standardna napaka: $s/\sqrt{12} \approx 0{,}0250/3{,}464 \approx 0{,}00721\,\mathrm{m/s^2}$.
5. Testna statistika: $t \approx (9{,}7867 - 9{,}81)/0{,}00721 \approx -3{,}24$.
6. Ker je $|t| = 3{,}24 > 2{,}201$, $H_0$ zavrnemo. Ker je celo $3{,}24 > 3{,}106$, je dvostranska $p$-vrednost manjša od $0{,}01$.
7. Interval zaupanja: $9{,}7867 \pm 2{,}201 \cdot 0{,}00721$, torej $9{,}7867 \pm 0{,}0159$ ali $[9{,}771; 9{,}803]\,\mathrm{m/s^2}$.
8. Dualnost: $9{,}81$ leži zunaj intervala, kar se ujema z zavrnitvijo. ✓
9. Odgovor: razlika od $9{,}81\,\mathrm{m/s^2}$ je statistično značilna ($t \approx -3{,}24$, $p < 0{,}01$); poskus ima verjetno sistematično napako, ki da prenizko vrednost (npr. prevelika amplituda, napačno izmerjena dolžina do masnega središča). Več meritev te napake ne odpravi – le zoži interval okoli napačne vrednosti.

### Primer 4 – zdaj ti

Proizvajalec trdi, da detektor zazna $90\,\%$ delcev. V kalibracijskem poskusu z znanim izvorom skozi detektor preleti $500$ delcev, zazna jih $435$. Na stopnji značilnosti $0{,}05$ (dvostransko) preizkusi trditev.

**Podatki:** $n = 500$, $k = 435$, $p_0 = 0{,}90$, $\alpha = 0{,}05$, $z_{0{,}975} = 1{,}960$
**Iščemo:** testno statistiko $z$ in odločitev

:::formula
$\hat p = \dfrac{k}{n}$; $z = \dfrac{\hat p - p_0}{\sqrt{p_0(1 - p_0)/n}}$; zavrni, če $|z| > z_{1-\alpha/2}$
:::

**Rešitev:**

1. Ocena: $\hat p = 435/500 = 0{,}87$.
2. Standardna napaka ob $H_0$: $\sqrt{0{,}90 \cdot 0{,}10/500} \approx 0{,}0134$. (Pri testu vzamemo $p_0$, ker računamo porazdelitev ob predpostavki, da $H_0$ velja.)
3. Zdaj ti: izračunaj $z$, odloči in povej, kaj to pomeni za trditev proizvajalca.

:::premisli
Kolikšen je $z$ in kakšna je odločitev?
---
$z = (0{,}87 - 0{,}90)/0{,}0134 \approx -2{,}24$. Ker je $|z| > 1{,}960$, $H_0$ zavrnemo; $p \approx 2(1 - \Phi(2{,}24)) \approx 0{,}025$. Podatki kažejo, da je izkoristek nižji od $90\,\%$. Pri $\alpha = 0{,}01$ bi $H_0$ ne zavrnili.
:::

## Pogoste napake

- **»$p$ je verjetnost, da $H_0$ velja.«** $p$-vrednost je verjetnost tako skrajnih podatkov ob predpostavki, da $H_0$ velja, ne verjetnost $H_0$ glede na podatke.
- **»Ne zavrnemo, torej $H_0$ drži.«** Majhen vzorec pogosto ne zazna niti velikih učinkov (velika $\beta$). Pravilno: podatki ne kažejo razlike.
- **$z$ namesto $t$ pri majhnem vzorcu.** Ko $\sigma$ ocenimo s $s$ iz nekaj meritev, je interval s kvantilom $z$ preozek; uporabi $t_{n-1}$.
- **Standardni odklon namesto standardne napake.** V intervalu za $\mu$ nastopa $s/\sqrt n$, ne $s$. Interval $\bar x \pm 1{,}96\,s$ opisuje razpršenost posameznih meritev, ne natančnost povprečja.
- **Statistična značilnost je velikost učinka.** Pri ogromnem $n$ je značilna tudi zanemarljiva razlika. Vedno navedi še interval zaupanja, ki pove, kako velika je razlika.

## Povzetek

- Standardna napaka povprečja je $\sigma/\sqrt n$; povprečje je (približno) normalno.
- Interval zaupanja s stopnjo $1 - \alpha$: postopek, ki v deležu $1 - \alpha$ ponovitev zajame parameter.
- Za $\mu$: $\bar x \pm z_{1-\alpha/2}\,\sigma/\sqrt n$ (znan $\sigma$) ali $\bar x \pm t_{n-1,\,1-\alpha/2}\,s/\sqrt n$ (neznan $\sigma$, normalne meritve).
- Za delež: $\hat p \pm z_{1-\alpha/2}\sqrt{\hat p(1-\hat p)/n}$; velikost vzorca $n \geq (z\sigma/E)^2$.
- Preizkus: $H_0$, $H_1$, testna statistika, $\alpha$, kritično območje ali $p$-vrednost; napaka 1. vrste $\alpha$, 2. vrste $\beta$, moč $1 - \beta$.
- Dualnost: dvostranski test zavrne $\mu_0$ natanko tedaj, ko je $\mu_0$ zunaj intervala zaupanja.

## Za izpit

Znati moraš povedati:

- definicijo intervala zaupanja in pravilno razlago stopnje zaupanja;
- konstrukcijo intervala za $\mu$ s pivotom pri znanem in neznanem $\sigma$ ter pogoje (normalnost, neodvisnost, velik $n$);
- definicije ničelne in alternativne domneve, stopnje značilnosti, $p$-vrednosti, napak 1. in 2. vrste ter moči;
- izrek o dualnosti med testom in intervalom z dokazom;
- kako velikost vzorca vpliva na širino intervala in na moč testa.

### Naloga 1

Pri meritvah težnega pospeška je standardni odklon posamezne meritve znan, $\sigma = 0{,}050\,\mathrm{m/s^2}$. Preizkušamo $H_0\colon \mu = 9{,}81\,\mathrm{m/s^2}$ proti dvostranski alternativi pri $\alpha = 0{,}05$. (a) Kolikšna je moč testa pri $n = 25$, če je prava vrednost $9{,}79\,\mathrm{m/s^2}$? (b) Koliko meritev potrebujemo, da bi tako odstopanje ($\delta = 0{,}020\,\mathrm{m/s^2}$) zaznali z močjo $0{,}90$? Uporabi $z_{0{,}975} = 1{,}960$, $z_{0{,}90} = 1{,}2816$, $\Phi(0{,}04) \approx 0{,}516$.

**Rešitev:**

1. Test zavrne $H_0$, če je $|Z| > 1{,}960$, kjer je $Z = (\bar X - 9{,}81)/(\sigma/\sqrt n)$.
2. Če je prava vrednost $\mu = 9{,}79$, ima $Z$ porazdelitev $N(-\Delta, 1)$ z $\Delta = \delta\sqrt n/\sigma$.
3. (a) Pri $n = 25$: $\Delta = 0{,}020 \cdot 5/0{,}050 = 2{,}0$.
4. Moč: $P(Z < -1{,}960) + P(Z > 1{,}960) = \Phi(-1{,}960 + 2{,}0) + \Phi(-1{,}960 - 2{,}0) \approx \Phi(0{,}04) + \Phi(-3{,}96) \approx 0{,}516 + 0{,}00004 \approx 0{,}516$.
5. Pri $25$ meritvah tako odstopanje zaznamo le v okoli polovici poskusov.
6. (b) Moč $0{,}90$ (zanemarimo drugi rep): $\Phi(\Delta - 1{,}960) = 0{,}90$, torej $\Delta - 1{,}960 = 1{,}2816$ in $\Delta = 3{,}2416$.
7. Iz $\Delta = \delta\sqrt n/\sigma$: $n = (\Delta\sigma/\delta)^2 = (3{,}2416 \cdot 0{,}050/0{,}020)^2 \approx 8{,}104^2 \approx 65{,}7$.
8. Odgovor: (a) moč je okoli $0{,}52$; (b) potrebujemo vsaj $66$ meritev. Formula $n = \left((z_{1-\alpha/2} + z_{1-\beta})\,\sigma/\delta\right)^2$ velja splošno.

### Naloga 2

Natančno definiraj interval zaupanja s stopnjo $1 - \alpha$ in z uporabo pivota izpelji interval za povprečje normalne porazdelitve pri neznanem $\sigma$. Navedi vse predpostavke. Nato dokaži, da dvostranski $t$-test pri stopnji značilnosti $\alpha$ zavrne $H_0\colon \mu = \mu_0$ natanko tedaj, ko $\mu_0$ ni v tem intervalu. Utemelji, ali je pri istih podatkih $99\,\%$ interval širši ali ožji od $95\,\%$.

**Rešitev:**

1. Definicija: $[L, U]$, funkciji vzorca, z $P(L \leq \theta \leq U) = 1 - \alpha$ za vse $\theta$.
2. Predpostavke: $X_1, \dots, X_n$ neodvisne, $N(\mu, \sigma)$; $\mu$ in $\sigma$ neznana; $n \geq 2$.
3. Pivot: $T = (\bar X - \mu)/(S/\sqrt n)$ ima po Gossetovem izreku porazdelitev $t_{n-1}$, ki ne vsebuje $\mu$ ali $\sigma$.
4. Zaradi simetrije $P(-t_{n-1,\,1-\alpha/2} \leq T \leq t_{n-1,\,1-\alpha/2}) = 1 - \alpha$.
5. Razrešimo na $\mu$: z verjetnostjo $1 - \alpha$ veljata hkrati $\bar X - t_{n-1,\,1-\alpha/2}\,S/\sqrt n \leq \mu$ in $\mu \leq \bar X + t_{n-1,\,1-\alpha/2}\,S/\sqrt n$.
6. Dualnost: $H_0$ ne zavrnemo, ko $|\bar x - \mu_0|/(s/\sqrt n) \leq t_{n-1,\,1-\alpha/2}$; to je enakovredno $\mu_0 \in [\bar x - t\,s/\sqrt n,\ \bar x + t\,s/\sqrt n]$.
7. $99\,\%$ interval uporablja $t_{n-1;\,0{,}995} > t_{n-1;\,0{,}975}$, zato je širši: za večjo gotovost plačamo z manj natančno izjavo.

### Naloga 3

Dva termometra primerjamo na šestih vzorcih; razlike (termometer A minus termometer B) so $0{,}3$; $0{,}1$; $0{,}4$; $0{,}2$; $0{,}5$ in $0{,}3\,\mathrm{K}$. Ali termometra merita različno? Uporabi $\alpha = 0{,}05$ in $t_{5;\,0{,}975} = 2{,}571$. Utemelji, zakaj je ta test boljši, kot če bi primerjali povprečji obeh termometrov kot neodvisna vzorca.

**Rešitev:**

1. Meritve so v parih (isti vzorec), zato analiziramo razlike $d_i$: $H_0\colon \mu_d = 0$, $H_1\colon \mu_d \neq 0$.
2. $\bar d = 1{,}8/6 = 0{,}30\,\mathrm{K}$.
3. Kvadrati odmikov: $0$; $0{,}04$; $0{,}01$; $0{,}01$; $0{,}04$; $0$, vsota $0{,}10$; $s_d = \sqrt{0{,}10/5} \approx 0{,}141\,\mathrm{K}$.
4. $t = 0{,}30/(0{,}141/\sqrt 6) \approx 0{,}30/0{,}0577 \approx 5{,}20$.
5. $|t| = 5{,}20 > 2{,}571$: $H_0$ zavrnemo. $95\,\%$ interval za $\mu_d$ je $0{,}30 \pm 2{,}571 \cdot 0{,}0577 \approx 0{,}30 \pm 0{,}15$, torej $[0{,}15; 0{,}45]\,\mathrm{K}$.
6. Parni test odstrani razlike med vzorci (eden je toplejši, drugi hladnejši), ki bi pri primerjavi neodvisnih vzorcev povečale razpršenost in skrile majhen sistematični odmik.
7. Odgovor: termometer A kaže sistematično višje, za okoli $0{,}3\,\mathrm{K}$ (med $0{,}15$ in $0{,}45\,\mathrm{K}$).

## Drugače: Z analogijo

**Interval zaupanja kot met obroča.** Pravi parameter je kol, zabit v tla, ki ga ne vidiš. Vsak vzorec je met obroča. Ne moreš reči, da je kol »z verjetnostjo $95\,\%$« v obroču, ki že leži – kol je ali ni notri. Lahko pa rečeš, da tvoj način metanja zadene v $95\,\%$ metov. Večji obroč (višja stopnja zaupanja) zadene pogosteje, a pove manj natančno, kje je kol. Boljši metalec (več meritev) zadene enako pogosto z manjšim obročem.

**Preizkus domneve kot sodni proces.** $H_0$ je »obtoženi je nedolžen«. Podatki so dokazi. Obsodimo le, če so dokazi tako močni, da bi bili ob nedolžnosti zelo malo verjetni ($p \leq \alpha$). Napaka 1. vrste je obsodba nedolžnega, napaka 2. vrste oprostitev krivega. Oprostitev ne pomeni dokazane nedolžnosti, le premalo dokazov. Strožji sodnik (manjši $\alpha$) redkeje obsodi nedolžnega, a pogosteje oprosti krivega.

## Drugače: Uporaba v stroki

**Varnost in tveganje.** Ko podjetje uvede nov varnostni postopek, z enostranskim testom preveri, ali se je pogostost nezgod zmanjšala; pri redkih dogodkih uporabimo Poissonov model in interval zaupanja za pogostost. Pri oceni tveganja projektant poda zgornjo mejo intervala zaupanja za verjetnost okvare, ne le točkovne ocene.

**Fizikalni eksperimenti.** V fiziki osnovnih delcev je prag za »odkritje« zelo strog, pet standardnih odklonov ($p \approx 3 \cdot 10^{-7}$), ker v velikih podatkih iščemo na mnogih mestih hkrati in bi pri $\alpha = 0{,}05$ dobili veliko lažnih odkritij. Rezultat meritve se v praksi navede kot vrednost s standardno negotovostjo; interval s faktorjem pokritja $2$ ustreza približno $95\,\%$.

**Kakovost in laboratorij.** Kontrolne karte v proizvodnji so zaporedni preizkusi domnev: meji karte sta $\mu_0 \pm 3\sigma/\sqrt n$. Pri validaciji analizne metode s $t$-testom preverimo, ali se rezultat referenčnega materiala razlikuje od certificirane vrednosti.

## Drugače: Korak za korakom s številkami

Pet meritev upora: $99{,}6$; $100{,}4$; $100{,}1$; $99{,}8$ in $100{,}6\,\Omega$. Ali se prava vrednost razlikuje od nazivnih $100{,}0\,\Omega$? ($\alpha = 0{,}05$, $t_{4;\,0{,}975} = 2{,}776$.)

1. **Domnevi:** $H_0\colon \mu = 100{,}0\,\Omega$, $H_1\colon \mu \neq 100{,}0\,\Omega$.
2. **Povprečje:** vsota je $500{,}5\,\Omega$, $\bar x = 500{,}5/5 = 100{,}1\,\Omega$.
3. **Odmiki od povprečja:** $-0{,}5$; $0{,}3$; $0$; $-0{,}3$; $0{,}5$; kvadrati $0{,}25$; $0{,}09$; $0$; $0{,}09$; $0{,}25$, vsota $0{,}68$.
4. **Standardni odklon:** $s = \sqrt{0{,}68/4} = \sqrt{0{,}17} \approx 0{,}412\,\Omega$.
5. **Standardna napaka:** $s/\sqrt 5 \approx 0{,}412/2{,}236 \approx 0{,}184\,\Omega$.
6. **Testna statistika:** $t = (100{,}1 - 100{,}0)/0{,}184 \approx 0{,}54$.
7. **Odločitev:** $|t| = 0{,}54 < 2{,}776$, $H_0$ ne zavrnemo.
8. **Interval:** $100{,}1 \pm 2{,}776 \cdot 0{,}184 \approx 100{,}1 \pm 0{,}51$, torej $[99{,}59; 100{,}61]\,\Omega$; vsebuje $100{,}0$, kar se ujema z odločitvijo.
9. **Pomen:** podatki ne kažejo odstopanja, a interval je širok – z le petimi meritvami bi zlahka spregledali tudi odstopanje $0{,}4\,\Omega$ (to je le okoli $2{,}2$ standardne napake, manj od kritične vrednosti $2{,}776$).

## Preveri se

? Katera količina ne sodi v isto skupino kot ostale tri?
- stopnja značilnosti $\alpha$
~ $\alpha$ je verjetnost napake 1. vrste – verjetnost, ki opisuje postopek odločanja, kot ostale.
- moč testa $1 - \beta$
~ Moč je verjetnost, da test zavrne napačno $H_0$; je verjetnost postopka, tako kot $\alpha$ in $\beta$.
+ povprečje vzorca $\bar x$
- verjetnost napake 2. vrste $\beta$
~ $\beta$ opisuje postopek: kako pogosto test spregleda resničen učinek.
> $\alpha$, $\beta$ in $1 - \beta$ so verjetnosti, ki opisujejo test. $\bar x$ je izračunana vrednost iz podatkov.

? Iz $n = 16$ meritev je $\bar x = 50{,}0$, znan $\sigma = 4{,}0$. Kolikšen je $95\,\%$ interval zaupanja za $\mu$?
- $[42{,}2; 57{,}8]$
~ Uporabil si $\sigma$ namesto standardne napake $\sigma/\sqrt n$; to je razpon posameznih meritev.
+ $[48{,}04; 51{,}96]$
- $[49{,}51; 50{,}49]$
~ Delil si s $n$ namesto s $\sqrt n$; standardna napaka je $4{,}0/4 = 1{,}0$, ne $0{,}25$.
> $\sigma/\sqrt n = 4{,}0/4 = 1{,}0$; $1{,}96 \cdot 1{,}0 = 1{,}96$; interval $50{,}0 \pm 1{,}96$.

? Raziskovalec poveča število meritev s $25$ na $100$, vse drugo ostane enako. Kaj se zgodi?
+ Interval zaupanja se zoži na polovico, moč testa se poveča.
- Interval zaupanja se zoži na četrtino.
~ Širina je sorazmerna z $1/\sqrt n$; štirikrat več meritev da dvakrat ožji interval.
- Stopnja značilnosti $\alpha$ se zmanjša.
~ $\alpha$ izberemo sami in je od $n$ neodvisna. Pri večjem $n$ se zmanjša $\beta$.
> Standardna napaka $\sigma/\sqrt n$ se razpolovi, zato je interval pol ožji, test pa pri istem $\alpha$ pogosteje zazna resnično razliko.

? Kateri korak rešitve je napačen? Naloga: $8$ meritev, $\bar x = 25{,}04$, $s = 0{,}267$; $95\,\%$ interval za $\mu$. (1) Standardna napaka $0{,}267/\sqrt 8 \approx 0{,}0944$. (2) Ker je $\sigma$ neznan, vzamem kvantil $z_{0{,}975} = 1{,}96$. (3) Interval $25{,}04 \pm 0{,}185$.
- korak 1
~ $s/\sqrt n = 0{,}267/2{,}828 \approx 0{,}0944$ je pravilno.
+ korak 2
- korak 3
~ Korak 3 le dosledno uporabi kvantil iz koraka 2; napaka je v izbiri kvantila.
> Pri neznanem $\sigma$ in majhnem vzorcu je treba vzeti $t_{7;\,0{,}975} = 2{,}365$. Pravilni interval je $25{,}04 \pm 0{,}223$; z $z$ je preozek.

? Na gradbišču so po uvedbi nove zaščitne opreme pol leta beležili poškodbe rok. Test primerjave z obdobjem prej da $p = 0{,}21$. Vodja sklene: »Oprema ne deluje.« Kaj je pravilno?
- Vodja ima prav: $p > 0{,}05$ dokazuje, da učinka ni.
~ Nezavrnitev $H_0$ ni dokaz $H_0$. Pri malo poškodbah ima test majhno moč.
- Oprema deluje z verjetnostjo $79\,\%$.
~ $1 - p$ ni verjetnost, da učinek obstaja; $p$ ni verjetnost domneve.
+ Podatki ne zadoščajo za sklep o učinku; potrebno je daljše opazovanje ali interval zaupanja za zmanjšanje.
> $p = 0{,}21$ pomeni le, da bi tako razliko pogosto dobili tudi brez učinka. Interval zaupanja za spremembo pogostosti pove, ali so verjetni tako koristni kot zanemarljivi učinki.

:::simboli
\mu | pričakovana (prava) vrednost | | – | parameter populacije
\mu_0 | vrednost iz ničelne domneve | | –
\mu_d | pričakovana vrednost razlike | | K
\sigma | standardni odklon posamezne meritve | | –
\sigma_{\bar X} | standardna napaka povprečja | \sigma_{\bar X} = \frac{\sigma}{\sqrt n} | –
n | velikost vzorca | | –
\bar X | vzorčno povprečje (slučajna spremenljivka) | \bar X = \frac{1}{n}\sum X_i | –
\bar x | izračunano povprečje | \bar x = \frac{1}{n}\sum x_i | –
\bar d | povprečje razlik | | K
x_i | i-ta meritev | | –
s | vzorčni standardni odklon | s^2 = \frac{1}{n-1}\sum(x_i - \bar x)^2 | –
s_d | standardni odklon razlik | | K
S | vzorčni standardni odklon (slučajna spremenljivka) | | –
\alpha | stopnja značilnosti | | – | verjetnost napake 1. vrste
\beta | verjetnost napake 2. vrste | | –
\theta | parameter | | –
L, U | spodnja in zgornja meja intervala | | –
Z | standardizirano povprečje | Z = \frac{\bar X - \mu}{\sigma/\sqrt n} | – | $N(0, 1)$
z | testna statistika za delež | z = \frac{\hat p - p_0}{\sqrt{p_0(1 - p_0)/n}} | –
z_{1-\alpha/2} | kvantil standardne normalne porazdelitve | | – | $\Phi(z) = 1 - \alpha/2$
T | Studentova statistika | T = \frac{\bar X - \mu}{S/\sqrt n} | – | $t$ z $n-1$ prostostnimi stopnjami
t | izračunana testna statistika | t = \frac{\bar x - \mu_0}{s/\sqrt n} | –
t_{n-1,\,1-\alpha/2} | kvantil Studentove porazdelitve | | –
t_{n-1,\,1-\alpha} | enostranski kvantil Studentove porazdelitve | | –
\Phi | porazdelitvena funkcija $N(0, 1)$ | | –
\hat p | ocena deleža | \hat p = \frac{k}{n} | –
p_0 | delež iz ničelne domneve | | –
p | delež (parameter) | | –
k | število uspehov | | –
E | dovoljena polovična širina intervala | | –
\delta | odstopanje prave vrednosti od $\mu_0$ | | m/s^2
H_0 | ničelna domneva | | –
H_1 | alternativna domneva | | –
P | verjetnost | | –
N | normalna porazdelitev | | – | $N(\mu, \sigma)$
:::
