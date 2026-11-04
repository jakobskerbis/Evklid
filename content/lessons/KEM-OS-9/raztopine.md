---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Timu je zamašen nos. Zdravnica njegovi mami Maji svetuje, naj mu nos spira s slano vodo, ki je enako slana kot telesne tekočine: na $100\,\text{g}$ raztopine naj pride $0{,}9\,\text{g}$ soli. Pršila iz lekarne doma nimata. Imata pa kuhinjsko tehtnico, sol in prekuhano vodo.

Maja obstane že pri prvem koraku. Koliko soli naj natehta za $500\,\text{g}$ raztopine? Čista voda v nosu peče, presoljena tudi. »Ščepec soli« torej ni dovolj natančen podatek.

Sestavo raztopine zato povemo s številom. Kemiki uporabljajo dve: **masni delež** in **masno koncentracijo**. Z obema se srečaš tudi v lekarni in bolnišnici. Majino nalogo boš rešil v primeru 3.

## Razlaga

**1. Raztopina kot trak.** Predstavljaj si $100\,\text{g}$ slane vode, razdeljene na $100$ enakih kvadratkov po $1\,\text{g}$. Postavi jih v trak. Prvih $10$ kvadratkov pobarvaj, to je sol. Ostalih $90$ pusti belih, to je voda. Sol predstavlja desetino traku.

Sol je **topljenec**: snov, ki se raztaplja. Voda je **topilo**: snov, v kateri se topljenec raztaplja. Skupaj tvorita **raztopino**. Masi se seštejeta: $10\,\text{g} + 90\,\text{g} = 100\,\text{g}$.

**2. Dolivanje vode.** Soli ostane $10\,\text{g}$, vode dolivamo. Trak se daljša, pobarvanih kvadratkov pa je še vedno $10$:

| sol | voda | raztopina | delež soli |
|---|---|---|---|
| $10\,\text{g}$ | $90\,\text{g}$ | $100\,\text{g}$ | $0{,}10 = 10\,\%$ |
| $10\,\text{g}$ | $190\,\text{g}$ | $200\,\text{g}$ | $0{,}05 = 5\,\%$ |
| $10\,\text{g}$ | $390\,\text{g}$ | $400\,\text{g}$ | $0{,}025 = 2{,}5\,\%$ |

Ko se masa raztopine podvoji, se delež soli razpolovi. Soli ni nič manj, le porazdeljena je po večji masi. Temu rečemo **razredčenje**.

:::premisli
Iz kozarca s $100\,\text{g}$ raztopine iz prve vrstice odliješ polovico. Koliko soli ostane v kozarcu in kolikšen je njen delež? Zakaj?
---
Ostane $5\,\text{g}$ soli v $50\,\text{g}$ raztopine, delež je še vedno $10\,\%$. Raztopina je homogena (povsod enako sestavljena), zato z odlivanjem odvzameš sol in vodo v enakem razmerju.
:::

**3. Masni delež.** Število iz zadnjega stolpca tabele je **masni delež** $w$. Pove, kolikšen del mase raztopine je topljenec:

$$w = \frac{m(\text{topljenca})}{m(\text{raztopine})}$$

$$m(\text{raztopine}) = m(\text{topljenca}) + m(\text{topila})$$

Obe masi v ulomku sta v istih enotah, zato se enota okrajša. Masni delež je **brez enote** in vedno med $0$ in $1$. V odstotke ga pretvoriš z množenjem s $100$: $w = 0{,}025$ je $2{,}5\,\%$. Če iščeš maso topljenca, formulo obrneš: $m(\text{topljenca}) = w \cdot m(\text{raztopine})$.

**4. Masna koncentracija.** V bolnišnici tekočin ne tehtajo, ampak merijo njihovo prostornino. Na vrečkah za infuzijo zato pogosto piše, koliko gramov snovi je v enem litru raztopine. To je **masna koncentracija** $\gamma$ (grška črka gama):

$$\gamma = \frac{m(\text{topljenca})}{V(\text{raztopine})}$$

Enota je $\text{g/L}$. Prostornino v mililitrih najprej pretvori v litre: $250\,\text{mL} = 0{,}250\,\text{L}$. Obrnjena oblika je $m(\text{topljenca}) = \gamma \cdot V(\text{raztopine})$.

Pazi pri vrečkah: »NaCl $0{,}9\,\%$« (NaCl je kuhinjska sol) pomeni $0{,}9\,\text{g}$ soli v $100\,\text{mL}$ raztopine, torej $\gamma = 9\,\text{g/L}$. Ker ima $1\,\text{mL}$ te raztopine maso skoraj natanko $1\,\text{g}$, je tudi njen masni delež približno $0{,}9\,\%$. Takšni raztopini rečemo **fiziološka raztopina**.

:::premisli
Farmacevt raztopi $9\,\text{g}$ soli v $1000\,\text{mL}$ vode. Ali je masna koncentracija natanko $9\,\text{g/L}$? Zakaj?
---
Ne povsem. V $\gamma$ gre prostornina *raztopine*, ta pa je po raztapljanju malo večja od $1000\,\text{mL}$ (približno $1003\,\text{mL}$). Zato je $\gamma$ malo manjša od $9\,\text{g/L}$. Natančno raztopino pripraviš v merilni bučki: sol raztopiš v delu vode in doliješ vodo do oznake $1\,\text{L}$.
:::

**5. Katero izbrati.** Če naloga govori o *masi* raztopine, računaš $w$. Če govori o *prostornini* raztopine, računaš $\gamma$. Rezultat to potrdi: $w$ nima enote, $\gamma$ jo ima ($\text{g/L}$).

V simulaciji spodaj (»Masni delež raztopine«) izberi bakrov(II) sulfat, nastavi $20\,\text{g}$ topljenca in $100\,\text{g}$ vode, nato vodo povečaj na $150\,\text{g}$. Opazuj: modra barva posvetli, masni delež pade s $16{,}7\,\%$ na $11{,}8\,\%$, topljenca pa je še vedno $20\,\text{g}$.

## Rešeni primeri

### Primer 1: voda za grgranje

Pri vnetem grlu Luka grgra slano vodo. V $245\,\text{g}$ vode raztopi $5\,\text{g}$ soli. Kolikšen je masni delež soli?

**Podatki:** $m(\text{topljenca}) = 5\,\text{g}$, $m(\text{topila}) = 245\,\text{g}$
**Iščemo:** masni delež soli $w$

:::formula
$m(\text{raztopine}) = m(\text{topljenca}) + m(\text{topila})$, nato $w = \dfrac{m(\text{topljenca})}{m(\text{raztopine})}$
:::

**Rešitev:**

1. Masa raztopine, ker delež primerjamo z *vso* raztopino: $m(\text{raztopine}) = 5\,\text{g} + 245\,\text{g} = 250\,\text{g}$.
2. Masni delež: $w = \dfrac{5\,\text{g}}{250\,\text{g}} = 0{,}02$.
3. V odstotkih: $0{,}02 \cdot 100 = 2\,\%$.
4. Odgovor: masni delež soli v vodi za grgranje je $0{,}02$ oziroma $2\,\%$.

### Primer 2: infuzija z glukozo

V vrečki je $250\,\text{mL}$ infuzijske raztopine, v kateri je raztopljenih $12{,}5\,\text{g}$ glukoze. Kolikšna je masna koncentracija glukoze?

**Podatki:** $m(\text{topljenca}) = 12{,}5\,\text{g}$, $V(\text{raztopine}) = 250\,\text{mL}$
**Iščemo:** masno koncentracijo glukoze $\gamma$

:::formula
$\gamma = \dfrac{m(\text{topljenca})}{V(\text{raztopine})}$
:::

**Rešitev:**

1. Prostornino pretvorimo v litre, ker želimo enoto $\text{g/L}$: $250\,\text{mL} = 0{,}250\,\text{L}$.
2. Vstavimo: $\gamma = \dfrac{12{,}5\,\text{g}}{0{,}250\,\text{L}} = 50\,\text{g/L}$.
3. Preverimo: litra je štirikrat več kot $250\,\text{mL}$, v njem bi bilo $4 \cdot 12{,}5 = 50$ gramov glukoze.
4. Odgovor: masna koncentracija glukoze je $50\,\text{g/L}$.

### Primer 3: Majina raztopina za nos

Maja želi pripraviti $500\,\text{g}$ raztopine soli z masnim deležem $0{,}9\,\%$. Koliko soli in koliko vode natehta?

**Podatki:** $m(\text{raztopine}) = 500\,\text{g}$, $w = 0{,}9\,\%$
**Iščemo:** maso soli $m(\text{topljenca})$ in maso vode $m(\text{topila})$

:::formula
$m(\text{topljenca}) = w \cdot m(\text{raztopine})$, nato $m(\text{topila}) = m(\text{raztopine}) - m(\text{topljenca})$
:::

**Rešitev:**

1. Odstotek zapišemo kot decimalno število, ker formula ne pozna znaka $\%$: $0{,}9 : 100 = 0{,}009$.
2. Masa soli: $m(\text{topljenca}) = 0{,}009 \cdot 500\,\text{g} = 4{,}5\,\text{g}$.
3. Masa vode je razlika, ker je raztopina vsota obeh: $m(\text{topila}) = 500\,\text{g} - 4{,}5\,\text{g} = 495{,}5\,\text{g}$.
4. Preverimo: $4{,}5 : 500 = 0{,}009$, to je $0{,}9\,\%$.
5. Odgovor: Maja natehta $4{,}5\,\text{g}$ soli in $495{,}5\,\text{g}$ vode.

### Primer 4: zdaj ti

Farmacevtka ima $100\,\text{g}$ raztopine soli z masnim deležem $10\,\%$. Za pršilo za nos potrebuje raztopino z $2\,\%$ soli. Koliko vode mora doliti?

**Podatki:** $m_1(\text{raztopine}) = 100\,\text{g}$, $w_1 = 10\,\%$, $w_2 = 2\,\%$
**Iščemo:** maso vode, ki jo doda

:::formula
$m(\text{topljenca}) = w \cdot m(\text{raztopine})$, nato $m(\text{raztopine}) = \dfrac{m(\text{topljenca})}{w}$
:::

**Rešitev:**

1. Sol v začetni raztopini: $m(\text{topljenca}) = 0{,}10 \cdot 100\,\text{g} = 10\,\text{g}$.
2. Pri dolivanju vode soli ne dodajamo in ne odvzamemo, zato je je tudi v novi raztopini $10\,\text{g}$.
3. Izračunaj sam maso nove raztopine in maso vode, nato preveri:

:::premisli
Kolikšna mora biti masa nove raztopine in koliko vode dolije farmacevtka?
---
$m_2(\text{raztopine}) = \dfrac{10\,\text{g}}{0{,}02} = 500\,\text{g}$. Raztopine je bilo $100\,\text{g}$, zato dolije $500\,\text{g} - 100\,\text{g} = 400\,\text{g}$ vode.
:::

## Pogoste napake

- **Deljenje z maso topila.** »Sol delim z vodo.« Masni delež pa primerja topljenec z vso raztopino. Pri $15\,\text{g}$ soli v $135\,\text{g}$ vode dobiš napačnih $11{,}1\,\%$ namesto $10\,\%$. Najprej seštej maso topljenca in topila.
- **Mililitri v formuli za $\gamma$.** Če vstaviš $250$ namesto $0{,}250\,\text{L}$, je rezultat tisočkrat premajhen. Pred deljenjem pretvori v litre.
- **Odstotek kot celo število.** Pri $m(\text{topljenca}) = w \cdot m(\text{raztopine})$ vstaviš $8$ namesto $0{,}08$ in dobiš stokrat preveč. Odstotek najprej deli s $100$.
- **»Voda razredči sol, zato je soli manj.«** Pri dolivanju vode se masa topljenca ne spremeni. Zmanjša se le delež, ker se masa raztopine poveča.
- **Prostornina topila namesto prostornine raztopine.** V $\gamma$ gre prostornina cele raztopine. Prostornine se pri mešanju ne seštevajo vedno natančno, zato jo vzemi iz podatkov ali izmeri v merilni bučki.

## Povzetek

- Raztopina je topljenec in topilo skupaj; njuni masi se seštejeta.
- Masni delež: $w = \dfrac{m(\text{topljenca})}{m(\text{raztopine})}$, brez enote, med $0$ in $1$, pogosto v $\%$.
- Masna koncentracija: $\gamma = \dfrac{m(\text{topljenca})}{V(\text{raztopine})}$, enota $\text{g/L}$; prostornino pretvori v litre.
- Maso topljenca dobiš kot $w \cdot m(\text{raztopine})$ ali $\gamma \cdot V(\text{raztopine})$.
- Pri razredčenju ostane masa topljenca enaka, masni delež in koncentracija pa se zmanjšata.
- Fiziološka raztopina: $\gamma = 9\,\text{g/L}$, masni delež približno $0{,}9\,\%$.

## Drugače: Z analogijo

Masni delež je kot delež čokoladnih koščkov v testu za piškote.

- Če zamešaš $100\,\text{g}$ testa, v katerem je $10\,\text{g}$ koščkov, je koščkov desetina mase.
- Če testo razdeliš na piškote, ima vsak piškot enak delež koščkov, čeprav je koščkov v enem piškotu malo. Tako je z odlito raztopino.
- Če testu primešaš še $100\,\text{g}$ testa brez koščkov, je koščkov še vedno $10\,\text{g}$, njihov delež pa pade na polovico. Tako je z dolivanjem vode.

Primerjava ima mejo: koščki so v testu vidni, topljenec pa je v raztopini razpršen na posamezne delce in ga ne vidiš.

## Drugače: Iz vsakdanjega življenja

Pripravljaš sirup za pijačo. V posodo daš $100\,\text{g}$ sladkorja in dolivaš vodo, da je skupna masa $500\,\text{g}$. Masni delež sladkorja je $\dfrac{100}{500} = 0{,}20$, torej $20\,\%$.

Sirup nato razredčiš s še $500\,\text{g}$ vode. Skupna masa je $1000\,\text{g}$, sladkorja je še vedno $100\,\text{g}$. Masni delež je zdaj $\dfrac{100}{1000} = 0{,}10$, torej $10\,\%$. Raztopine je dvakrat več, sladkorja enako, zato se je delež razpolovil.

Podobne podatke najdeš na embalaži: na mleku, sokovih, čistilih in kremah piše, koliko neke snovi je v $100\,\text{g}$ ali $100\,\text{mL}$ izdelka.

## Drugače: Bolj natančno

Masni delež in masno koncentracijo povezuje gostota raztopine $\rho = \dfrac{m(\text{raztopine})}{V(\text{raztopine})}$. Ulomek za $\gamma$ razširimo z $m(\text{raztopine})$:

$$\gamma = \frac{m(\text{topljenca})}{m(\text{raztopine})} \cdot \frac{m(\text{raztopine})}{V(\text{raztopine})}$$

$$\gamma = w \cdot \rho$$

Primer: fiziološka raztopina ima $\gamma = 9\,\text{g/L}$ in gostoto približno $1005\,\text{g/L}$. Njen masni delež je $w = \dfrac{9}{1005} \approx 0{,}009$, torej približno $0{,}9\,\%$.

Iz enega podatka torej drugega ne moreš izračunati, če ne poznaš gostote. Pri razredčenih vodnih raztopinah je gostota blizu $1000\,\text{g/L}$, zato je masni delež v odstotkih skoraj enak številu gramov topljenca v $100\,\text{mL}$ raztopine.

## Preveri se

? Tri trditve o masnem deležu držijo, ena ne drži. Katera?
- Masni delež nima enote.
~ Ta trditev drži: masa topljenca in masa raztopine sta obe v gramih, zato se enota okrajša.
- Masni delež primerja maso topljenca z maso cele raztopine.
~ Ta trditev drži, to je definicija. Če si mislil, da delimo z maso topila, preveri imenovalec.
+ Masni delež je lahko večji od $1$ (več kot $100\,\%$).
- Masni delež lahko zapišemo v odstotkih.
~ Ta trditev drži: $w$ pomnožimo s $100$ in dobimo odstotke.
> Topljenec je le del raztopine, zato je njegova masa manjša od mase raztopine in $w$ ne more biti večji od $1$.

? V $135\,\text{g}$ vode raztopimo $15\,\text{g}$ soli. Kolikšen je masni delež soli?
- $11{,}1\,\%$
~ Delil si z maso vode ($\frac{15}{135}$). Masni delež se računa z maso cele raztopine.
- $15\,\%$
~ $15\,\text{g}$ ni $15\,\%$. Maso soli moraš deliti z maso raztopine.
+ $10\,\%$
- $90\,\%$
~ To je delež vode, ne soli: $\frac{135}{150} = 0{,}90$.
> Masa raztopine je $15\,\text{g} + 135\,\text{g} = 150\,\text{g}$, zato je $w = \dfrac{15}{150} = 0{,}10 = 10\,\%$.

? Maja v $200\,\text{g}$ raztopine z $2\,\%$ soli doda še $200\,\text{g}$ vode. Kaj se zgodi?
- Masa soli se zmanjša, ker jo je voda razredčila.
~ Dolita voda soli ne odnese. Soli je še vedno $4\,\text{g}$, porazdeljena je le po večji masi.
- Masni delež ostane $2\,\%$, ker je bila dodana le voda.
~ Masa raztopine se je podvojila, masa soli ne, zato se delež spremeni.
+ Soli ostane $4\,\text{g}$, masni delež pade na $1\,\%$.
- Masni delež naraste na $4\,\%$.
~ Zamenjal si maso soli ($4\,\text{g}$) z deležem. Več vode pomeni manjši delež, ne večjega.
> Soli je $0{,}02 \cdot 200\,\text{g} = 4\,\text{g}$. Nova raztopina ima $400\,\text{g}$, zato je $w = \dfrac{4}{400} = 0{,}01 = 1\,\%$.

? Tim računa masno koncentracijo: v $400\,\text{mL}$ raztopine je $12\,\text{g}$ topljenca. Korak 1: $\gamma = \dfrac{m(\text{topljenca})}{V(\text{raztopine})}$. Korak 2: $400\,\text{mL} = 4\,\text{L}$. Korak 3: $\gamma = \dfrac{12\,\text{g}}{4\,\text{L}} = 3\,\text{g/L}$. Kateri korak je napačen?
- Korak 1
~ Formula je prava: masa topljenca deljena s prostornino raztopine.
+ Korak 2
- Korak 3
~ Deljenje je pravilno izvedeno, vendar z napačno prostornino iz koraka 2.
- Noben korak ni napačen.
~ Rezultat $3\,\text{g/L}$ je desetkrat premajhen, ker je pretvorba enot napačna.
> $1\,\text{L} = 1000\,\text{mL}$, zato je $400\,\text{mL} = 0{,}4\,\text{L}$ in $\gamma = \dfrac{12\,\text{g}}{0{,}4\,\text{L}} = 30\,\text{g/L}$.

? Na vrečki za infuzijo piše: glukoza $50\,\text{g/L}$, $500\,\text{mL}$. Koliko glukoze prejme bolnik, ko steče vsa vrečka?
- $100\,\text{g}$
~ Delil si $50 : 0{,}5$. Maso dobiš z množenjem: $m = \gamma \cdot V$.
+ $25\,\text{g}$
- $25\,000\,\text{g}$
~ Pozabil si pretvoriti mililitre v litre. $500\,\text{mL} = 0{,}5\,\text{L}$.
- $50\,\text{g}$
~ $50\,\text{g}$ je v enem litru, vrečka pa ima le pol litra.
> $m(\text{topljenca}) = \gamma \cdot V(\text{raztopine}) = 50\,\text{g/L} \cdot 0{,}5\,\text{L} = 25\,\text{g}$.

:::simboli
m | masa (topljenca, topila ali raztopine) | | g | masa raztopine je vsota mas topljenca in topila
m_1, m_2 | masa raztopine pred razredčenjem in po njem | | g
w | masni delež topljenca | w = \frac{m(\text{topljenca})}{m(\text{raztopine})} | – | v odstotkih: pomnožimo s $100$
w_1, w_2 | masni delež pred razredčenjem in po njem | | –
\gamma | masna koncentracija | \gamma = \frac{m(\text{topljenca})}{V(\text{raztopine})} | g/L | $\gamma = w \cdot \rho$
V | prostornina raztopine | | L
\rho | gostota raztopine | \rho = \frac{m(\text{raztopine})}{V(\text{raztopine})} | g/L | v istih enotah kot $\gamma$
:::
