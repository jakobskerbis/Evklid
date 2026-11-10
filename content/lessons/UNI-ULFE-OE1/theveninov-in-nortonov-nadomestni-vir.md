---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Začnimo z nalogo, kakršna se pojavi na izpitu. Grelec bioreaktorja je priključen na vezje spodaj: vir $U_0 = 12\,\mathrm{V}$, upor $R_1 = 4\,\Omega$ do vozlišča A, iz A upor $R_2 = 12\,\Omega$ proti masi in upor $R_3 = 2\,\Omega$ do sponk, kjer je grelec $R_\mathrm{L}$.

```
  R1=4Ω   A  R3=2Ω
 +--[==]--+--[==]--+
 |        |        |
U0=12V  [==]R2   [==]RL
 |        |12Ω     |
 +--------+--------+
```

*Kolikšen naj bo upor grelca, da se v njem sprosti največja moč, in kolikšna je ta moč?*

S Kirchhoffovimi zakoni bi za vsak $R_\mathrm{L}$ znova reševal sistem enačb, nato pa iskal maksimum funkcije, ki jo komaj zapišeš. Na koncu lekcije boš nalogo rešil v treh vrsticah. Ključ je spoznanje, da se *vsak* linearen del vezja, gledan z dveh sponk, obnaša kot en sam vir in en sam upor.

## Razlaga

**1. Staro in novo.** Pri metodah analize vezij (zančni tokovi, vozliščni potenciali) izračunamo *vse* tokove in napetosti naenkrat. To je pravo orodje, ko nas zanima celo vezje. Pogosto pa nas zanima le en element, breme, ki ga menjamo ali nastavljamo. Takrat je ceneje ostali del vezja enkrat poenostaviti.

- **Metode analize:** ena velika rešitev; ob vsaki menjavi bremena znova.
- **Nadomestni vir:** enkrat izračunamo dva parametra; vsako breme nato v eni vrstici.

**2. Linearnost in superpozicija.** Vezje je **linearno**, če vsebuje samo upore (in druge linearne elemente), neodvisne vire in linearno krmiljene vire. V takem vezju so vsi tokovi in napetosti linearne funkcije gonilnih napetosti in tokov virov.

**Izrek (superpozicija).** V linearnem vezju z več neodvisnimi viri je vsak tok (napetost) vsota prispevkov posameznih virov. Prispevek vira izračunamo tako, da so vsi drugi neodvisni viri izklopljeni: napetostni vir nadomestimo s kratkim stikom ($U = 0$), tokovni vir z odprtimi sponkami ($I = 0$).

Superpozicija velja za tokove in napetosti, *ne pa za moč*, ker je moč kvadratna: $(I' + I'')^2 R \neq I'^2 R + I''^2 R$.

**3. Theveninov izrek.**

**Izrek (Thevenin).** Linearno vezje, gledano s sponk A in B, lahko nadomestimo z idealnim napetostnim virom $U_\mathrm{Th}$ in zaporednim uporom $R_\mathrm{Th}$, tako da sta za vsako breme tok in napetost na bremenu enaka kot v prvotnem vezju. Pri tem je:
- $U_\mathrm{Th}$ napetost odprtih sponk (brez bremena);
- $R_\mathrm{Th}$ upornost med sponkama, ko so vsi neodvisni viri izklopljeni.

**Izpeljava.** Breme nadomestimo s tokovnim virom $I$, ki vleče isti tok iz sponk. Vezje je zdaj linearno z viri vezja in virom $I$. Po superpoziciji je napetost sponk $U = U' + U''$. Del $U'$ prispevajo notranji viri pri $I = 0$; to je napetost odprtih sponk, $U' = U_\mathrm{Th}$. Del $U''$ prispeva le $I$ pri izklopljenih notranjih virih; takrat je vezje pasivno (upori in morebitni krmiljeni viri) in se s sponk vidi kot upornost $R_\mathrm{Th}$, zato $U'' = -R_\mathrm{Th} I$. Skupaj:

$$U = U_\mathrm{Th} - R_\mathrm{Th} I.$$

To je ravno napetost na sponkah vira $U_\mathrm{Th}$ z notranjim uporom $R_\mathrm{Th}$. $\blacksquare$

:::premisli
Vezje vsebuje tudi tokovni vir. Zakaj ga pri računanju $R_\mathrm{Th}$ nadomestimo z odprtimi sponkami in ne s kratkim stikom?
---
Izklopljen vir mora dajati nič svoje količine. Tokovni vir daje tok, zato izklopljen pomeni $I = 0$, kar so odprte sponke. Kratek stik bi pomenil $U = 0$, to je izklopljen *napetostni* vir.
:::

**4. Nortonov izrek.** Isto vezje lahko nadomestimo tudi z idealnim tokovnim virom $I_\mathrm{N}$ in vzporednim uporom $R_\mathrm{N} = R_\mathrm{Th}$. Tok $I_\mathrm{N}$ je tok kratkega stika med sponkama. Obe nadomestitvi povezuje

$$U_\mathrm{Th} = R_\mathrm{Th} \cdot I_\mathrm{N}.$$

Zato zadostujeta katerikoli dve od treh meritev: napetost odprtih sponk, tok kratkega stika, upornost izklopljenega vezja. V laboratoriju $R_\mathrm{Th}$ pogosto dobimo kot $\frac{U_\mathrm{Th}}{I_\mathrm{N}}$, ker virov iz naprave ne moremo »izklopiti«.

**Krmiljeni viri.** Krmiljen vir ni vir energije, temveč del vezja: njegova vrednost je odvisna od toka ali napetosti drugje v vezju. Zato ga pri računanju $R_\mathrm{Th}$ *ne izklopimo*. Upornosti tedaj ne moremo sešteti kot zaporedne in vzporedne vezave. Uporabimo eno od dveh poti: $R_\mathrm{Th} = \frac{U_\mathrm{Th}}{I_\mathrm{N}}$, ali pa izklopimo le neodvisne vire, na sponke priključimo testni vir $U_\mathrm{t}$ in izračunamo tok $I_\mathrm{t}$, ki ga ta požene v vezje; tedaj je $R_\mathrm{Th} = \frac{U_\mathrm{t}}{I_\mathrm{t}}$.

Primer: vir $12\,\mathrm{V}$ z uporom $4\,\Omega$ do sponke A, od A proti masi upor $4\,\Omega$ in napetostno krmiljen tokovni vir, ki iz A odvaja tok $g U_\mathrm{A}$ z $g = 0{,}25\,\mathrm{S}$. Odprte sponke: $\frac{12 - U_\mathrm{A}}{4} = \frac{U_\mathrm{A}}{4} + 0{,}25\,U_\mathrm{A}$ da $U_\mathrm{Th} = 4\,\mathrm{V}$. Kratek stik: $U_\mathrm{A} = 0$, krmiljeni vir ne vodi, $I_\mathrm{N} = \frac{12}{4} = 3\,\mathrm{A}$. Torej $R_\mathrm{Th} = \frac{4}{3}\,\Omega$. Testni vir da isto: $I_\mathrm{t} = \frac{U_\mathrm{t}}{4} + \frac{U_\mathrm{t}}{4} + 0{,}25\,U_\mathrm{t} = 0{,}75\,U_\mathrm{t}$. Kdor bi krmiljeni vir »izklopil«, bi dobil napačnih $2\,\Omega$.

**5. Prilagoditev bremena.** Breme $R_\mathrm{L}$ na viru $U_\mathrm{Th}$, $R_\mathrm{Th}$ prejme tok $I = \frac{U_\mathrm{Th}}{R_\mathrm{Th} + R_\mathrm{L}}$ in moč

$$P = \frac{U_\mathrm{Th}^2 R_\mathrm{L}}{(R_\mathrm{Th} + R_\mathrm{L})^2}.$$

**Izrek (največja moč).** Moč na bremenu je največja pri $R_\mathrm{L} = R_\mathrm{Th}$ in je tedaj

$$P_\mathrm{max} = \frac{U_\mathrm{Th}^2}{4R_\mathrm{Th}}.$$

Dokaz z odvodom je Naloga 2 v razdelku »Za izpit«. Pri $R_\mathrm{L} \to 0$ je napetost nič, pri $R_\mathrm{L} \to \infty$ tok nič; moč je nič na obeh koncih in ima vmes en sam vrh.

:::premisli
Pri prilagojenem bremenu je izkoristek nadomestnega vira $50\,\%$. Ali to pomeni, da je izkoristek prvotnega vezja tudi $50\,\%$?
---
Ne. Nadomestni vir je enak prvotnemu vezju le *navzven*, na sponkah. Moč, ki se troši v notranjih uporih, je lahko čisto drugačna kot v $R_\mathrm{Th}$. Primer 3 pokaže vezje z izkoristkom pod $25\,\%$.
:::

## Rešeni primeri

### Primer 1 (lažji): delilnik za merilnik prevodnosti

Merilnik prevodnosti v bioreaktorju napaja delilnik napetosti: vir $24\,\mathrm{V}$, zgoraj $R_1 = 6\,\mathrm{k\Omega}$, spodaj $R_2 = 3\,\mathrm{k\Omega}$. Na $R_2$ priključimo merilno elektrodo z upornostjo $R_\mathrm{L} = 6\,\mathrm{k\Omega}$. Določi nadomestni vir in napetost na elektrodi.

**Podatki:** $U_0 = 24\,\mathrm{V}$, $R_1 = 6\,\mathrm{k\Omega}$, $R_2 = 3\,\mathrm{k\Omega}$, $R_\mathrm{L} = 6\,\mathrm{k\Omega}$
**Iščemo:** $U_\mathrm{Th}$, $R_\mathrm{Th}$, $U_\mathrm{L}$

:::formula
$U_\mathrm{Th} = U_0 \dfrac{R_2}{R_1 + R_2}$, $R_\mathrm{Th} = \dfrac{R_1 R_2}{R_1 + R_2}$, $U_\mathrm{L} = U_\mathrm{Th}\dfrac{R_\mathrm{L}}{R_\mathrm{Th} + R_\mathrm{L}}$
:::

**Rešitev:**

1. Brez elektrode je to navaden delilnik: $U_\mathrm{Th} = 24 \cdot \frac{3}{6 + 3} = 8\,\mathrm{V}$.
2. Vir kratko sklenemo; s sponk vidimo $R_1$ in $R_2$ vzporedno: $R_\mathrm{Th} = \frac{6 \cdot 3}{6 + 3} = 2\,\mathrm{k\Omega}$.
3. Z elektrodo: $U_\mathrm{L} = 8 \cdot \frac{6}{2 + 6} = 6\,\mathrm{V}$.
4. Odgovor: nadomestni vir je $8\,\mathrm{V}$ z $2\,\mathrm{k\Omega}$; elektroda dobi $6\,\mathrm{V}$, ne $8\,\mathrm{V}$, ker obremeni delilnik.

### Primer 2: superpozicija dveh virov

Mikrobno gorivno celico modeliramo z virom $U_1 = 12\,\mathrm{V}$ in notranjim uporom $R_1 = 4\,\Omega$ do vozlišča A. Iz A gre upor $R_2 = 6\,\Omega$ proti masi, v A pa dodatni pretvornik vbrizga tok $I_0 = 2\,\mathrm{A}$. Izračunaj potencial $U_\mathrm{A}$ s superpozicijo.

**Podatki:** $U_1 = 12\,\mathrm{V}$, $R_1 = 4\,\Omega$, $R_2 = 6\,\Omega$, $I_0 = 2\,\mathrm{A}$
**Iščemo:** $U_\mathrm{A}$

:::formula
$U_\mathrm{A} = U_\mathrm{A}' + U_\mathrm{A}''$; $U_\mathrm{A}' = U_1\dfrac{R_2}{R_1 + R_2}$ (tokovni vir odprt), $U_\mathrm{A}'' = I_0 \dfrac{R_1 R_2}{R_1 + R_2}$ (napetostni vir kratko sklenjen)
:::

**Rešitev:**

1. Samo $U_1$, tokovni vir odprt: delilnik, $U_\mathrm{A}' = 12 \cdot \frac{6}{10} = 7{,}2\,\mathrm{V}$.
2. Samo $I_0$, napetostni vir kratko sklenjen: $R_1$ in $R_2$ sta vzporedna, $\frac{4 \cdot 6}{4 + 6} = 2{,}4\,\Omega$, zato $U_\mathrm{A}'' = 2 \cdot 2{,}4 = 4{,}8\,\mathrm{V}$.
3. Vsota: $U_\mathrm{A} = 7{,}2 + 4{,}8 = 12\,\mathrm{V}$.
4. Preizkus s Kirchhoffovim tokovnim zakonom v A: iz $R_1$ priteče $\frac{12 - 12}{4} = 0\,\mathrm{A}$, iz vira $2\,\mathrm{A}$, skozi $R_2$ odteče $\frac{12}{6} = 2\,\mathrm{A}$. Drži.
5. Odgovor: $U_\mathrm{A} = 12\,\mathrm{V}$. Zanimivo: tok skozi gorivno celico je ravno nič, ker pretvornik sam pokrije porabo upora $R_2$.

### Primer 3 (težji, izpitna raven): prilagoditev in izkoristek

Vezju iz Primera 2 dodamo upor $R_3 = 3{,}6\,\Omega$ od A do sponk, na katere priključimo črpalko z uporom $R_\mathrm{L}$. (a) Določi Theveninov in Nortonov nadomestni vir. (b) Pri katerem $R_\mathrm{L}$ je moč na črpalki največja in koliko je? (c) Kolikšen je takrat izkoristek prvotnega vezja?

**Podatki:** $U_1 = 12\,\mathrm{V}$, $R_1 = 4\,\Omega$, $R_2 = 6\,\Omega$, $I_0 = 2\,\mathrm{A}$, $R_3 = 3{,}6\,\Omega$
**Iščemo:** $U_\mathrm{Th}$, $R_\mathrm{Th}$, $I_\mathrm{N}$, $R_\mathrm{L}$ za največjo moč, $P_\mathrm{max}$, izkoristek $\eta$

:::formula
$R_\mathrm{L} = R_\mathrm{Th}$, $P_\mathrm{max} = \dfrac{U_\mathrm{Th}^2}{4R_\mathrm{Th}}$, $I_\mathrm{N} = \dfrac{U_\mathrm{Th}}{R_\mathrm{Th}}$, $\eta = \dfrac{P_\mathrm{L}}{P_\mathrm{viri}}$
:::

**Rešitev:**

1. Odprte sponke: skozi $R_3$ ne teče tok, zato je $U_\mathrm{Th} = U_\mathrm{A} = 12\,\mathrm{V}$ iz Primera 2.
2. Izklopimo vira ($U_1$ kratek stik, $I_0$ odprt). S sponk vidimo $R_3$ zaporedno z $R_1 \parallel R_2$: $R_\mathrm{Th} = 2{,}4 + 3{,}6 = 6\,\Omega$.
3. Nortonov tok: $I_\mathrm{N} = \frac{12}{6} = 2\,\mathrm{A}$.
4. Največja moč pri $R_\mathrm{L} = 6\,\Omega$: $P_\mathrm{max} = \frac{12^2}{4 \cdot 6} = 6\,\mathrm{W}$.
5. Za izkoristek se vrnemo v prvotno vezje. Tok bremena je $I_\mathrm{L} = \frac{12}{12} = 1\,\mathrm{A}$, napetost na bremenu $6\,\mathrm{V}$, zato $U_\mathrm{A} = 6 + 3{,}6 \cdot 1 = 9{,}6\,\mathrm{V}$.
6. Gorivna celica daje tok $\frac{12 - 9{,}6}{4} = 0{,}6\,\mathrm{A}$ in moč $12 \cdot 0{,}6 = 7{,}2\,\mathrm{W}$. Tokovni vir daje $2 \cdot 9{,}6 = 19{,}2\,\mathrm{W}$. Skupaj $26{,}4\,\mathrm{W}$.
7. Preizkus v A: priteče $0{,}6 + 2 = 2{,}6\,\mathrm{A}$, odteče $\frac{9{,}6}{6} + 1 = 2{,}6\,\mathrm{A}$. Drži.
8. Izkoristek: $\eta = \frac{6}{26{,}4} \approx 0{,}227$.
9. Odgovor: $U_\mathrm{Th} = 12\,\mathrm{V}$, $R_\mathrm{Th} = 6\,\Omega$, $I_\mathrm{N} = 2\,\mathrm{A}$; največja moč $6\,\mathrm{W}$ pri $R_\mathrm{L} = 6\,\Omega$; izkoristek prvotnega vezja je le okoli $23\,\%$, ne $50\,\%$.

### Primer 4 – zdaj ti: grelec iz uvoda

Vrnimo se k izpitni nalogi iz uvoda.

**Podatki:** $U_0 = 12\,\mathrm{V}$, $R_1 = 4\,\Omega$, $R_2 = 12\,\Omega$, $R_3 = 2\,\Omega$
**Iščemo:** $R_\mathrm{L}$ za največjo moč in $P_\mathrm{max}$

:::formula
$R_\mathrm{L} = R_\mathrm{Th}$, $P_\mathrm{max} = \dfrac{U_\mathrm{Th}^2}{4R_\mathrm{Th}}$
:::

**Rešitev:**

1. Odprte sponke: $U_\mathrm{Th} = 12 \cdot \frac{12}{4 + 12} = 9\,\mathrm{V}$, ker skozi $R_3$ ne teče tok.
2. Vir kratko sklenjen: $R_\mathrm{Th} = \frac{4 \cdot 12}{4 + 12} + 2 = 5\,\Omega$.
3. Zdaj izberi $R_\mathrm{L}$ in izračunaj največjo moč sam.

:::premisli
Koliko sta $R_\mathrm{L}$ in $P_\mathrm{max}$? Preveri še, da je pri $R_\mathrm{L} = 2\,\Omega$ in $R_\mathrm{L} = 10\,\Omega$ moč res manjša.
---
$R_\mathrm{L} = 5\,\Omega$ in $P_\mathrm{max} = \frac{9^2}{4 \cdot 5} = 4{,}05\,\mathrm{W}$. Pri $2\,\Omega$ je $P = \left(\frac{9}{7}\right)^2 \cdot 2 \approx 3{,}31\,\mathrm{W}$, pri $10\,\Omega$ je $P = \left(\frac{9}{15}\right)^2 \cdot 10 = 3{,}6\,\mathrm{W}$. Oboje manj, kot napove izrek.
:::

## Pogoste napake

- **Viri ostanejo vklopljeni pri $R_\mathrm{Th}$.** Kdor pri računanju upornosti pusti vir v vezju, ne dobi upornosti, temveč razmerje, ki je odvisno od vira. Izklopi vse neodvisne vire: napetostne kratko skleni, tokovne odpri.
- **Izklopljen krmiljen vir.** Krmiljen vir ostane v vezju; $R_\mathrm{Th}$ dobiš s testnim virom ali kot $\frac{U_\mathrm{Th}}{I_\mathrm{N}}$, sicer upornost pride napačna (v primeru iz razlage $2\,\Omega$ namesto $\frac{4}{3}\,\Omega$).
- **Tokovni vir kratko sklenjen.** To je obratno pravilo. Izklopljen tokovni vir daje tok nič, to so odprte sponke.
- **Superpozicija moči.** Moč ni linearna v toku. Najprej seštej tokove ali napetosti, šele nato izračunaj moč.
- **»Prilagojeno breme pomeni $50\,\%$ izkoristek naprave.«** Izkoristek $50\,\%$ velja le za nadomestni vir. Prvotno vezje ima lahko kakršenkoli izkoristek, kot v Primeru 3. V elektroenergetiki se bremena zato *ne* prilagajajo: želimo velik izkoristek, ne največje moči.
- **Breme ostane priključeno pri $U_\mathrm{Th}$.** Napetost Theveninovega vira je napetost *odprtih* sponk. Z bremenom bi izmeril $U_\mathrm{L}$, ki je manjša.

## Povzetek

- Superpozicija: v linearnem vezju je odziv vsota prispevkov posameznih virov; drugi viri izklopljeni (napetostni = kratek stik, tokovni = odprte sponke). Ne velja za moč.
- Thevenin: linearno vezje s sponk A, B je vir $U_\mathrm{Th}$ (napetost odprtih sponk) z zaporednim $R_\mathrm{Th}$ (upornost pri izklopljenih virih).
- Norton: tokovni vir $I_\mathrm{N}$ (tok kratkega stika) z vzporednim $R_\mathrm{Th}$; $U_\mathrm{Th} = R_\mathrm{Th} I_\mathrm{N}$.
- Največja moč na bremenu pri $R_\mathrm{L} = R_\mathrm{Th}$, $P_\mathrm{max} = \frac{U_\mathrm{Th}^2}{4R_\mathrm{Th}}$; izkoristek $50\,\%$ velja samo za nadomestni vir.

## Za izpit

Znati moraš povedati:
- kdaj je vezje linearno in kako se glasi izrek o superpoziciji (s pravilom za izklop virov);
- Theveninov in Nortonov izrek z natančnim pomenom $U_\mathrm{Th}$, $I_\mathrm{N}$ in $R_\mathrm{Th}$;
- izpeljavo $U = U_\mathrm{Th} - R_\mathrm{Th} I$ iz superpozicije;
- kako dobiš $R_\mathrm{Th}$, če vezje vsebuje krmiljene vire (testni vir ali $\frac{U_\mathrm{Th}}{I_\mathrm{N}}$);
- pogoj za največjo moč z dokazom in zakaj izkoristek $50\,\%$ ne velja za prvotno vezje.

### Naloga 1

Senzor v hranilni raztopini je v mostičnem vezju. Vir $U_0 = 10\,\mathrm{V}$ napaja dva vzporedna delilnika. Levi: $R_1 = 1\,\mathrm{k\Omega}$ zgoraj, $R_2 = 1\,\mathrm{k\Omega}$ spodaj, srednja točka C. Desni: $R_3 = 1\,\mathrm{k\Omega}$ zgoraj, senzor $R_4 = 1{,}5\,\mathrm{k\Omega}$ spodaj, srednja točka D. (a) Določi Theveninov in Nortonov nadomestni vir med D in C. (b) Kolikšno napetost pokaže ojačevalnik z vhodno upornostjo $10\,\mathrm{k\Omega}$? (c) Kolikšna je največja moč, ki jo most lahko odda bremenu med D in C?

**Rešitev:**

1. Odprte sponke: $U_\mathrm{D} = 10 \cdot \frac{1{,}5}{2{,}5} = 6\,\mathrm{V}$ in $U_\mathrm{C} = 10 \cdot \frac{1}{2} = 5\,\mathrm{V}$, zato $U_\mathrm{Th} = 6 - 5 = 1\,\mathrm{V}$.
2. Vir kratko sklenemo: zgornje in spodnje vozlišče postaneta eno. Od C do tega vozlišča sta $R_1$ in $R_2$ vzporedna ($500\,\Omega$), od D sta $R_3$ in $R_4$ vzporedna ($\frac{1000 \cdot 1500}{2500} = 600\,\Omega$).
3. Ti dve upornosti sta zaporedni: $R_\mathrm{Th} = 500 + 600 = 1100\,\Omega$.
4. Nortonov tok: $I_\mathrm{N} = \frac{1}{1100}\,\mathrm{A} \approx 0{,}909\,\mathrm{mA}$.
5. Ojačevalnik: $U_\mathrm{L} = 1 \cdot \frac{10000}{1100 + 10000} \approx 0{,}901\,\mathrm{V}$, torej okoli $10\,\%$ manj od napetosti odprtih sponk.
6. Največja moč pri $R_\mathrm{L} = 1100\,\Omega$: $P_\mathrm{max} = \frac{1}{4 \cdot 1100}\,\mathrm{W} \approx 0{,}227\,\mathrm{mW}$.
7. Odgovor: $U_\mathrm{Th} = 1\,\mathrm{V}$ (D pozitivnejša od C), $R_\mathrm{Th} = 1{,}1\,\mathrm{k\Omega}$, $I_\mathrm{N} \approx 0{,}91\,\mathrm{mA}$; ojačevalnik pokaže okoli $0{,}90\,\mathrm{V}$; največja moč je okoli $0{,}23\,\mathrm{mW}$.

### Naloga 2

Izpelji, pri katerem uporu bremena $R_\mathrm{L} > 0$ prejme breme na viru $U_\mathrm{Th}$, $R_\mathrm{Th} > 0$ največjo moč. Utemelji, da gre za maksimum, in dokaži, da je izkoristek nadomestnega vira tedaj $50\,\%$.

**Rešitev:**

1. Moč na bremenu: $P(R_\mathrm{L}) = \dfrac{U_\mathrm{Th}^2 R_\mathrm{L}}{(R_\mathrm{Th} + R_\mathrm{L})^2}$.
2. Odvod po pravilu za kvocient: $P'(R_\mathrm{L}) = U_\mathrm{Th}^2 \dfrac{(R_\mathrm{Th} + R_\mathrm{L}) - 2R_\mathrm{L}}{(R_\mathrm{Th} + R_\mathrm{L})^3} = U_\mathrm{Th}^2 \dfrac{R_\mathrm{Th} - R_\mathrm{L}}{(R_\mathrm{Th} + R_\mathrm{L})^3}$.
3. Odvod je nič samo pri $R_\mathrm{L} = R_\mathrm{Th}$. Za $R_\mathrm{L} < R_\mathrm{Th}$ je pozitiven (moč raste), za $R_\mathrm{L} > R_\mathrm{Th}$ negativen (moč pada). Zato je tam globalni maksimum na $(0, \infty)$.
4. Vstavimo: $P_\mathrm{max} = \dfrac{U_\mathrm{Th}^2 R_\mathrm{Th}}{4R_\mathrm{Th}^2} = \dfrac{U_\mathrm{Th}^2}{4R_\mathrm{Th}}$.
5. Skozi $R_\mathrm{Th}$ in $R_\mathrm{L}$ teče isti tok, zato se moči delita kot upornosti. Pri $R_\mathrm{L} = R_\mathrm{Th}$ sta enaki, vir odda $2P_\mathrm{max}$ in izkoristek je $\frac{1}{2}$.
6. Sklep velja samo za nadomestni vir; za prvotno vezje glej Primer 3.

## Drugače: Na sliki

Vsak linearen vir na sponkah opiše ena premica v ravnini $(I, U)$:

:::risba graf
opis: Premica vira v ravnini (I, U). Os U seka pri napetosti odprtih sponk U_Th, os I pri toku kratkega stika I_N; njena enačba je U = U_Th − R_Th·I. Črtkana premica bremena U = R_L·I gre skozi izhodišče. Narisana je za R_L = R_Th: delovna točka je na sredini premice vira, pri I_N/2 in U_Th/2, pravokotnik pod njo pa predstavlja moč.
x: 0 .. 1,25 | 0,5 | I
y: 0 .. 1,25 | 0,5 | U
enako: da
oznake: ne
oznakax: 0,5 | I_N/2
oznakax: 1 | I_N
oznakay: 0,5 | U_{Th}/2
oznakay: 1 | U_{Th}
pravokotnik: 0; 0 .. 0,5; 0,5 | oranžna
črta: 0; 1 -> 1; 0 | debelo modra
črta: 0; 0 -> 1,15; 1,15 | črtkano zelena
točka: 0,5; 0,5 | delovna točka | desno | oranžna
napis: 0,3; 0,85 | U = U_{Th} − R_{Th}·I | desno | modra
napis: 0,95; 1,05 | U = R_L·I | levo | zelena
napis: 0,25; 0,25 | P | sredina | oranžna debelo
:::

Premica seka os $U$ pri $U_\mathrm{Th}$ (odprte sponke, $I = 0$) in os $I$ pri $I_\mathrm{N}$ (kratek stik, $U = 0$). Njen naklon je $-R_\mathrm{Th}$. Breme je premica $U = R_\mathrm{L} I$ skozi izhodišče; delovna točka je presečišče. Moč je ploščina pravokotnika pod delovno točko. Ta je največja, ko je delovna točka na sredini premice vira: tam je $U = \frac{U_\mathrm{Th}}{2}$ in $I = \frac{I_\mathrm{N}}{2}$.

Theveninova in Nortonova shema sta torej dva načina, kako narisati isto premico: z odsekom na osi $U$ ali z odsekom na osi $I$.

## Drugače: Uporaba v stroki

**Elektrofiziologija.** Celična membrana se na elektrodi obnaša kot Theveninov vir: mirovni potencial (okoli $-70\,\mathrm{mV}$) z notranjo upornostjo, ki je pri stekleni mikroelektrodi lahko več deset megaohmov. Ojačevalnik mora imeti vhodno upornost veliko večjo od te, sicer meri premalo. To je isti račun kot v Nalogi 1, le pri drugih številih.

**Biosenzorji.** Termistorji, merilni lističi in elektrokemijski senzorji so pogosto v mostičnem vezju. Inženir most nadomesti s Theveninovim virom, da izbere ojačevalnik in oceni šum, ki je sorazmeren z $\sqrt{R_\mathrm{Th}}$.

**Pridobivanje energije.** Pri mikrobnih gorivnih celicah in vsadkih, ki se napajajo iz telesne toplote, je vir šibek in moč dragocena. Tu breme *namerno* prilagodijo: elektronika sproti išče $R_\mathrm{L} = R_\mathrm{Th}$ (sledenje točki največje moči). V elektrarni je ravno obratno: generator ima majhno notranjo upornost, ker želimo velik izkoristek.

## Drugače: Bolj natančno

**Izmenični tok.** Za vezja z upori, tuljavami in kondenzatorji pri eni frekvenci velja Theveninov izrek s kompleksnimi kazalci: vir $\underline{U}_\mathrm{Th}$ in impedanca $\underline{Z}_\mathrm{Th} = R_\mathrm{Th} + \mathrm{j}X_\mathrm{Th}$. Največjo delovno moč dobi breme s konjugirano impedanco, $\underline{Z}_\mathrm{L} = R_\mathrm{Th} - \mathrm{j}X_\mathrm{Th}$: jalovi del se izniči, ostane pogoj za upornost iz te lekcije.

**Meje izreka.** Izrek zahteva linearnost. Dioda, sončna celica ali akumulator pri velikih tokovih nimajo ravne karakteristike $U(I)$. Okoli izbrane delovne točke jih lahko nadomestimo s Theveninovim virom le za majhne spremembe (linearizacija). Tako v elektroniki obravnavamo tranzistorje pri malih signalih.

## Preveri se

? Katera tabela meritev na sponkah ustreza viru $U_\mathrm{Th} = 6\,\mathrm{V}$, $R_\mathrm{Th} = 2\,\Omega$?
- $(0\,\mathrm{A}; 6\,\mathrm{V})$, $(1\,\mathrm{A}; 8\,\mathrm{V})$, $(3\,\mathrm{A}; 12\,\mathrm{V})$
~ Napetost na sponkah z rastočim tokom pada, ker na $R_\mathrm{Th}$ nastaja padec napetosti.
+ $(0\,\mathrm{A}; 6\,\mathrm{V})$, $(1\,\mathrm{A}; 4\,\mathrm{V})$, $(3\,\mathrm{A}; 0\,\mathrm{V})$
- $(0\,\mathrm{A}; 0\,\mathrm{V})$, $(1\,\mathrm{A}; 2\,\mathrm{V})$, $(3\,\mathrm{A}; 6\,\mathrm{V})$
~ To je karakteristika upora $2\,\Omega$, ne vira: pri odprtih sponkah vir da $6\,\mathrm{V}$.
- $(0\,\mathrm{A}; 6\,\mathrm{V})$, $(1\,\mathrm{A}; 6\,\mathrm{V})$, $(3\,\mathrm{A}; 6\,\mathrm{V})$
~ Tako se obnaša idealen vir brez notranjega upora.
> $U = 6 - 2I$: pri $1\,\mathrm{A}$ je $4\,\mathrm{V}$, pri $3\,\mathrm{A}$ (kratek stik) $0\,\mathrm{V}$.

? Steklena mikroelektroda ima $R_\mathrm{Th} = 1\,\mathrm{M\Omega}$, voltmeter vhodno upornost $10\,\mathrm{M\Omega}$. Približno kolikšen del prave napetosti izmeri?
- okoli $10\,\%$
~ To je razmerje $\frac{1}{10}$; delilnik pa da $\frac{R_\mathrm{L}}{R_\mathrm{Th} + R_\mathrm{L}}$.
+ okoli $91\,\%$
- okoli $50\,\%$
~ Polovico bi izmeril le pri enakih upornostih.
- natanko $100\,\%$
~ Vsak končen vhodni upor obremeni vir.
> $\frac{10}{1 + 10} \approx 0{,}91$.

? Zakaj superpozicija ne velja za moč?
- Ker v vezju z več viri moč ni definirana.
~ Moč je definirana; le ne sešteva se po virih.
- Ker superpozicija velja samo za tokovne vire.
~ Velja za vse neodvisne vire v linearnem vezju.
+ Ker je moč sorazmerna s kvadratom toka in je $(I' + I'')^2 \neq I'^2 + I''^2$.
> Mešani člen $2I'I''R$ manjka, če seštevaš moči. Najprej seštej tokove.

? Nortonov vir ima $I_\mathrm{N} = 0{,}5\,\mathrm{A}$ in $R_\mathrm{Th} = 20\,\Omega$. Kateri Theveninov vir mu ustreza?
- $40\,\mathrm{V}$ in $20\,\Omega$
~ To je $\frac{R_\mathrm{Th}}{I_\mathrm{N}}$. Velja $U_\mathrm{Th} = R_\mathrm{Th} I_\mathrm{N}$.
+ $10\,\mathrm{V}$ in $20\,\Omega$
- $10\,\mathrm{V}$ in $0\,\Omega$
~ Upornost ostane ista, le iz vzporedne postane zaporedna.
- $0{,}5\,\mathrm{V}$ in $20\,\Omega$
~ Tok in napetost nista isto število; pomnoži z $R_\mathrm{Th}$.
> $U_\mathrm{Th} = 20 \cdot 0{,}5 = 10\,\mathrm{V}$.

? Mikrobna gorivna celica ima pri odprtih sponkah $0{,}8\,\mathrm{V}$, tok kratkega stika pa je $4\,\mathrm{mA}$. Pri katerem bremenu odda največjo moč?
- $100\,\Omega$
~ To je $\frac{0{,}4}{0{,}004}$: pri prilagojenem bremenu je napetost res polovica $U_\mathrm{Th}$, a tudi tok je le polovica $I_\mathrm{N}$, zato $R_\mathrm{L} = \frac{0{,}4}{0{,}002} = 200\,\Omega$.
- $0{,}2\,\Omega$
~ Tok si vstavil v miliamperih: $\frac{0{,}8}{4} = 0{,}2$. V amperih je $\frac{0{,}8}{0{,}004} = 200\,\Omega$.
+ $200\,\Omega$, moč je tedaj $0{,}8\,\mathrm{mW}$
- pri čim manjšem bremenu, ker je tok največji
~ Pri kratkem stiku je napetost nič in je moč tudi nič.
> $R_\mathrm{Th} = \frac{0{,}8}{0{,}004} = 200\,\Omega$ in $P_\mathrm{max} = \frac{0{,}8^2}{4 \cdot 200} = 0{,}8\,\mathrm{mW}$.

:::simboli
U_\mathrm{Th} | napetost Theveninovega vira (napetost odprtih sponk) | U_\mathrm{Th} = R_\mathrm{Th} \cdot I_\mathrm{N} | V
R_\mathrm{Th} | notranja upornost nadomestnega vira | | \Omega | viri izklopljeni
I_\mathrm{N} | tok Nortonovega vira (tok kratkega stika) | I_\mathrm{N} = \frac{U_\mathrm{Th}}{R_\mathrm{Th}} | A
R_\mathrm{L} | upornost bremena | | \Omega
U_\mathrm{L} | napetost na bremenu | U_\mathrm{L} = U_\mathrm{Th}\frac{R_\mathrm{L}}{R_\mathrm{Th} + R_\mathrm{L}} | V
P | moč na bremenu | P = \frac{U_\mathrm{Th}^2 R_\mathrm{L}}{(R_\mathrm{Th} + R_\mathrm{L})^2} | W
P_\mathrm{max} | največja moč na bremenu | P_\mathrm{max} = \frac{U_\mathrm{Th}^2}{4R_\mathrm{Th}} | W | pri $R_\mathrm{L} = R_\mathrm{Th}$
P_\mathrm{L} | moč na bremenu | | W
P_\mathrm{viri} | moč vseh virov | | W
\eta | izkoristek | \eta = \frac{P_\mathrm{L}}{P_\mathrm{viri}} | –
U | napetost na sponkah | U = U_\mathrm{Th} - R_\mathrm{Th} I | V
I | tok skozi sponke | | A
U_0, U_1 | gonilna napetost vira | | V
I_0 | tok tokovnega vira | | A
R_1, R_2, R_3 | upori vezja | | \Omega
U_\mathrm{A} | potencial vozlišča A | U_\mathrm{A} = U_\mathrm{A}' + U_\mathrm{A}'' | V
U_\mathrm{A}', U_\mathrm{A}'' | prispevka posameznih virov k potencialu A | | V
U_\mathrm{t} | napetost testnega vira | | V
I_\mathrm{t} | tok testnega vira v vezje | | A
g | prevodnost krmiljenega vira | | S | krmiljeni tok je $g U_\mathrm{A}$
:::
