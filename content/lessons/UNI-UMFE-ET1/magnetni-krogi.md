---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Uganka za začetek. V kavnem aparatu vodo spusti elektromagnetni ventil: tuljava je navita na železno jedro, v katerem je majhna zračna reža. Ko steče tok, polje v reži pritegne železno kotvico in ventil se odpre. Silnice tečejo $100\,\mathrm{mm}$ po železu in le $1\,\mathrm{mm}$ po zraku. Relativna permeabilnost železa je $2000$.

Ugani, preden bereš naprej: kateri del poti »porabi« večino amperskih ovojev tuljave? Sto milimetrov železa ali en milimeter zraka? Oceni tudi delež.

Podobna uganka visi na kuhinjski steni. Magnetni nosilec trdno drži nož, ki se ga dotika. Če vmes zatakneš zloženo kuhinjsko krpo, nož zdrsne.

Obe uganki razreši **magnetni krog**: pot magnetnega pretoka skozi jedra in reže. Računaš ga skoraj tako kot enosmerno vezje. Z istim orodjem inženirji načrtujejo elektromagnete, releje, dušilke, transformatorje in motorje.

## Razlaga

Model sestavimo iz majhnih kosov. Za vsakim je kratko vprašanje. Odgovori nanj, preden greš naprej.

**1. Vzbujanje.** Iz Amperovega zakona veš, da je $\oint \vec H \cdot \mathrm d\vec l$ po sklenjeni poti enak toku, ki ga pot objame. Tuljava z $N$ ovoji in tokom $I$ prebode pot silnic $N$-krat. Ta vsota tokov je **magnetna napetost** (tudi magnetomotorna sila):

$$\Theta = N I$$

Enota je amper; v praksi rečemo »amperski ovoji«. Tuljava ima v magnetnem krogu vlogo vira napetosti.

*Preveri:* tuljava s $400$ ovoji, po kateri teče $0{,}5\,\mathrm A$, ima $\Theta = {?}$ *(Odgovor: $200\,\mathrm A$.)*

**2. Pretok.** Gostota magnetnega pretoka $B$ se meri v teslah. Kadar je $B$ po preseku $A$ enakomerna, je **magnetni pretok** $\Phi = B A$. Enota je weber, $1\,\mathrm{Wb} = 1\,\mathrm{T\,m^2}$.

Silnice polja $B$ so sklenjene. Zato je pretok vzdolž nerazvejanega jedra povsod enak, tudi kjer se presek spremeni. Takrat se spremeni gostota $B$, pretok ne. Pretok ima v magnetnem krogu vlogo toka.

*Preveri:* jedro se zoži s $4\,\mathrm{cm^2}$ na $2\,\mathrm{cm^2}$. Kaj se zgodi z $B$? *(Odgovor: podvoji se, $\Phi$ ostane enak.)*

**3. Magnetni upor.** Vzemimo obroč s srednjo dolžino silnice $l$, presekom $A$ in permeabilnostjo $\mu = \mu_0 \mu_{\mathrm{r}}$. Amperov zakon da $H l = N I$. Ker je $B = \mu H$ in $\Phi = B A$, sledi $\Phi = \dfrac{\mu A}{l} \cdot N I$. Ulomek obrnemo in dobimo **magnetni upor** (reluktanco):

$$R_{\mathrm{m}} = \frac{l}{\mu_0 \mu_{\mathrm{r}} A}$$

Enota je $\mathrm{A/Wb}$, kar je isto kot $\mathrm H^{-1}$. Primerjaj z uporom žice $R = \dfrac{l}{\gamma A}$: dolžina je v števcu, presek in snovna lastnost v imenovalcu. Vlogo specifične prevodnosti $\gamma$ ima permeabilnost $\mu$.

*Preveri:* presek jedra prepoloviš. Kaj se zgodi z $R_{\mathrm{m}}$? *(Odgovor: podvoji se.)*

**4. Ohmov zakon magnetnega kroga.** Iz izpeljave v točki 3 neposredno sledi:

$$\Theta = R_{\mathrm{m}} \Phi$$

Na odseku jedra je **magnetni padec napetosti** $V_{\mathrm{m}} = R_{\mathrm{m}} \Phi = H l$. Analogija z električnim krogom:

| Električni krog | Magnetni krog | Enota |
|---|---|---|
| napetost vira $U$ | $\Theta = N I$ | A |
| tok $I$ | pretok $\Phi$ | Wb |
| upor $R$ | magnetni upor $R_{\mathrm{m}}$ | A/Wb |
| padec $R I$ | $V_{\mathrm{m}} = H l$ | A |

*Preveri:* $\Theta = 300\,\mathrm A$, $R_{\mathrm{m}} = 10^6\,\mathrm{A/Wb}$. Kolikšen je $\Phi$? *(Odgovor: $0{,}3\,\mathrm{mWb}$.)*

**5. Zaporedni odseki.** Jedro z režo je zaporedna vezava dveh magnetnih uporov, železa in zraka. Skozi oba teče isti pretok, upora se seštejeta:

$$\Theta = (R_{\mathrm{Fe}} + R_\delta)\,\Phi$$

To je drugi Kirchhoffov zakon v magnetni obliki: vsota magnetnih padcev po zanki je enaka vzbujanju.

Zdaj nazaj k uganki. Pri enakem preseku sta upora v razmerju dolžin, deljenih z $\mu_{\mathrm{r}}$. Železo z dolžino $100\,\mathrm{mm}$ in $\mu_{\mathrm{r}} = 2000$ ima enak magnetni upor kot $0{,}05\,\mathrm{mm}$ zraka. Reža $1\,\mathrm{mm}$ je torej »dvajsetkrat daljša« od vsega železa.

:::premisli
Kolikšen delež amperskih ovojev porabi reža iz uganke? Napovej, nato preveri z razmerjem uporov.
---
Približno $95\,\%$, ker je $\dfrac{1}{1 + 0{,}05} \approx 0{,}952$. Magnetna napetost se razdeli v razmerju uporov, kot pri delilniku napetosti. Železo vzame le slabih $5\,\%$.
:::

*Preveri:* reža se zaradi obrabe poveča na $2\,\mathrm{mm}$, $\Theta$ ostane enak. Kako se spremeni pretok? *(Odgovor: skoraj se razpolovi, upor zraste z $1{,}05$ na $2{,}05\,\mathrm{mm}$ enakovrednega zraka.)*

**6. Razvejani krog.** Pogosto je jedro sestavljeno iz pločevin oblike E in I. Tako ima tri stebre. Tuljava je na srednjem stebru, pretok se v jarmu razdeli v levi in desni steber. Mesto, kjer se pretok razdeli, je **razcepišče** (kot vozlišče v vezju). Kolikor pretoka priteče v razcepišče, toliko ga odteče. To je prvi Kirchhoffov zakon za pretok:

$$\Phi_{\mathrm{s}} = \Phi_1 + \Phi_2$$

Stranska stebra imata med istima razcepiščema enak magnetni padec, zato sta vezana vzporedno. Nadomestni upor je $R_{\mathrm{p}} = \dfrac{R_1 R_2}{R_1 + R_2}$. Krog rešiš kot vezje: nadomestni upor, skupni pretok, padec na vzporedni veji, nazadnje pretok v vsaki veji.

:::premisli
Stranska stebra sta enaka, le desni ima režo. Zakaj ne dobi vsak polovice pretoka? Kateri dobi več?
---
Pretok se razdeli obratno sorazmerno z magnetnima uporoma, kot tok med vzporednima upornikoma. Reža močno poveča upor desnega stebra, zato gre večina pretoka skozi levi steber brez reže.
:::

*Preveri:* $R_1 = R_2$. Kolikšen je $R_{\mathrm{p}}$? *(Odgovor: $R_1/2$.)*

**7. Meja modela.** Relativna permeabilnost železa ni stalna. Ko $B$ preseže približno $1{,}5\,\mathrm T$, se železo nasiči in $\mu_{\mathrm{r}}$ močno pade. Linearni zakon zato velja, dokler je železo daleč od nasičenja. Vedno preveri $B$ v vsakem odseku.

## Rešeni primeri

### Primer 1: obročasto jedro

Kuhinjski robot ima v napajalniku dušilko, navito na železni obroč. Srednja dolžina silnice je $30\,\mathrm{cm}$, presek $4\,\mathrm{cm^2}$, $\mu_{\mathrm{r}} = 1500$. Tuljava ima $200$ ovojev, teče enosmerni tok $0{,}5\,\mathrm A$. Kolikšna sta magnetni upor jedra in pretok?

**Podatki:** $l = 0{,}30\,\mathrm m$, $A = 4\,\mathrm{cm^2}$, $\mu_{\mathrm{r}} = 1500$, $N = 200$, $I = 0{,}5\,\mathrm A$, $\mu_0 = 4\pi \cdot 10^{-7}\,\mathrm{Vs/(Am)}$
**Iščemo:** magnetni upor $R_{\mathrm{m}}$ in pretok $\Phi$

:::formula
$R_{\mathrm{m}} = \dfrac{l}{\mu_0 \mu_{\mathrm{r}} A}$, $\Phi = \dfrac{N I}{R_{\mathrm{m}}}$
:::

**Rešitev:**

1. Presek pretvorimo v osnovno enoto, ker je $1\,\mathrm{cm^2} = 10^{-4}\,\mathrm{m^2}$: $A = 4 \cdot 10^{-4}\,\mathrm{m^2}$.
2. Magnetni upor: $R_{\mathrm{m}} = \dfrac{0{,}30}{4\pi \cdot 10^{-7} \cdot 1500 \cdot 4 \cdot 10^{-4}}\,\mathrm{A/Wb} \approx 3{,}98 \cdot 10^{5}\,\mathrm{A/Wb}$.
3. Vzbujanje: $\Theta = 200 \cdot 0{,}5\,\mathrm A = 100\,\mathrm A$.
4. Ohmov zakon: $\Phi = \dfrac{100\,\mathrm A}{3{,}98 \cdot 10^{5}\,\mathrm{A/Wb}} \approx 2{,}51 \cdot 10^{-4}\,\mathrm{Wb}$.
5. Kontrola: $B = \dfrac{2{,}51 \cdot 10^{-4}\,\mathrm{Wb}}{4 \cdot 10^{-4}\,\mathrm{m^2}} \approx 0{,}63\,\mathrm T$. To je daleč pod nasičenjem, zato je stalni $\mu_{\mathrm{r}}$ upravičen.
6. Odgovor: magnetni upor jedra je približno $3{,}98 \cdot 10^{5}\,\mathrm{A/Wb}$, pretok pa približno $0{,}25\,\mathrm{mWb}$.

### Primer 2: ventil kavnega aparata

Uganko zdaj rešimo s številkami. Jedro ventila ima $l_{\mathrm{Fe}} = 100\,\mathrm{mm}$, $\mu_{\mathrm{r}} = 2000$ in režo $\delta = 1\,\mathrm{mm}$. Presek je povsod $1\,\mathrm{cm^2}$. Da kotvica zanesljivo pritegne, potrebujemo v reži $B = 0{,}5\,\mathrm T$. Koliko amperskih ovojev je potrebnih? Koliko ovojev mora imeti tuljava, če sme voditi največ $0{,}25\,\mathrm A$? Raztros silnic ob reži zanemari.

**Podatki:** $l_{\mathrm{Fe}} = 0{,}1\,\mathrm m$, $\mu_{\mathrm{r}} = 2000$, $\delta = 10^{-3}\,\mathrm m$, $A = 10^{-4}\,\mathrm{m^2}$, $B = 0{,}5\,\mathrm T$, $I = 0{,}25\,\mathrm A$
**Iščemo:** magnetno napetost $\Theta$ in število ovojev $N$

:::formula
$\Phi = B A$, $R_{\mathrm{Fe}} = \dfrac{l_{\mathrm{Fe}}}{\mu_0 \mu_{\mathrm{r}} A}$, $R_\delta = \dfrac{\delta}{\mu_0 A}$, $\Theta = (R_{\mathrm{Fe}} + R_\delta)\,\Phi$, $N = \dfrac{\Theta}{I}$
:::

**Rešitev:**

1. Pretok: $\Phi = 0{,}5\,\mathrm T \cdot 10^{-4}\,\mathrm{m^2} = 5 \cdot 10^{-5}\,\mathrm{Wb}$. Odseka sta zaporedna, zato je pretok v železu enak.
2. Upor reže ($\mu_{\mathrm{r}} = 1$): $R_\delta = \dfrac{10^{-3}}{4\pi \cdot 10^{-7} \cdot 10^{-4}}\,\mathrm{A/Wb} \approx 7{,}958 \cdot 10^{6}\,\mathrm{A/Wb}$.
3. Upor železa: $R_{\mathrm{Fe}} = \dfrac{0{,}1}{4\pi \cdot 10^{-7} \cdot 2000 \cdot 10^{-4}}\,\mathrm{A/Wb} \approx 3{,}979 \cdot 10^{5}\,\mathrm{A/Wb}$, kar je dvajsetina upora reže.
4. Vzbujanje: $\Theta = (3{,}979 \cdot 10^{5} + 7{,}958 \cdot 10^{6}) \cdot 5 \cdot 10^{-5}\,\mathrm A \approx 417{,}8\,\mathrm A$. Od tega reža porabi $397{,}9\,\mathrm A$, železo le $19{,}9\,\mathrm A$.
5. Ovoji: $N = \dfrac{417{,}8\,\mathrm A}{0{,}25\,\mathrm A} \approx 1671{,}1$. Navzgor zaokrožimo, da gostota v reži ne pade pod zahtevano.
6. Odgovor: potrebujemo približno $418\,\mathrm A$ amperskih ovojev, torej tuljavo z vsaj $1672$ ovoji. Skoraj vse ovoje »porabi« milimetrska reža.

### Primer 3: jedro oblike E (razvejani krog)

Dušilka v indukcijski kuhalni plošči ima jedro oblike E. Za preizkus skozi tuljavo na srednjem stebru spustimo enosmerni tok. Magnetni upori stebrov (z ustreznimi deli jarma) so: srednji $2 \cdot 10^{5}\,\mathrm{A/Wb}$, levi $4 \cdot 10^{5}\,\mathrm{A/Wb}$, desni z režo $1{,}2 \cdot 10^{6}\,\mathrm{A/Wb}$. Tuljava ima $300$ ovojev, tok je $2\,\mathrm A$. Kolikšni so pretoki v vseh treh stebrih?

**Podatki:** $N = 300$, $I = 2\,\mathrm A$, $R_{\mathrm{s}} = 2 \cdot 10^{5}\,\mathrm{A/Wb}$, $R_1 = 4 \cdot 10^{5}\,\mathrm{A/Wb}$, $R_2 = 1{,}2 \cdot 10^{6}\,\mathrm{A/Wb}$
**Iščemo:** pretoke $\Phi_{\mathrm{s}}$, $\Phi_1$ in $\Phi_2$

:::formula
$R_{\mathrm{p}} = \dfrac{R_1 R_2}{R_1 + R_2}$, $\Phi_{\mathrm{s}} = \dfrac{N I}{R_{\mathrm{s}} + R_{\mathrm{p}}}$, $V_{\mathrm{p}} = R_{\mathrm{p}} \Phi_{\mathrm{s}}$, $\Phi_1 = \dfrac{V_{\mathrm{p}}}{R_1}$, $\Phi_2 = \dfrac{V_{\mathrm{p}}}{R_2}$
:::

**Rešitev:**

1. Vzbujanje: $\Theta = 300 \cdot 2\,\mathrm A = 600\,\mathrm A$.
2. Stranska stebra vežeta isti razcepišči, zato sta vzporedna: $R_{\mathrm{p}} = \dfrac{4 \cdot 10^{5} \cdot 1{,}2 \cdot 10^{6}}{4 \cdot 10^{5} + 1{,}2 \cdot 10^{6}}\,\mathrm{A/Wb} = 3 \cdot 10^{5}\,\mathrm{A/Wb}$.
3. Srednji steber je z njima v zaporedju: skupni upor je $2 \cdot 10^{5} + 3 \cdot 10^{5} = 5 \cdot 10^{5}\,\mathrm{A/Wb}$.
4. Pretok v srednjem stebru: $\Phi_{\mathrm{s}} = \dfrac{600\,\mathrm A}{5 \cdot 10^{5}\,\mathrm{A/Wb}} = 1{,}2 \cdot 10^{-3}\,\mathrm{Wb}$.
5. Magnetni padec na stranskih stebrih: $V_{\mathrm{p}} = 3 \cdot 10^{5} \cdot 1{,}2 \cdot 10^{-3}\,\mathrm A = 360\,\mathrm A$. Preostalih $240\,\mathrm A$ porabi srednji steber.
6. Pretoka v stranskih stebrih: $\Phi_1 = \dfrac{360\,\mathrm A}{4 \cdot 10^{5}\,\mathrm{A/Wb}} = 9 \cdot 10^{-4}\,\mathrm{Wb}$ in $\Phi_2 = \dfrac{360\,\mathrm A}{1{,}2 \cdot 10^{6}\,\mathrm{A/Wb}} = 3 \cdot 10^{-4}\,\mathrm{Wb}$.
7. Kontrola s prvim Kirchhoffovim zakonom: $0{,}9 + 0{,}3 = 1{,}2\,\mathrm{mWb}$, kar se ujema s $\Phi_{\mathrm{s}}$.
8. Odgovor: v srednjem stebru je $1{,}2\,\mathrm{mWb}$, v levem $0{,}9\,\mathrm{mWb}$, v desnem z režo le $0{,}3\,\mathrm{mWb}$.

### Primer 4 – zdaj ti

Ista dušilka kot v primeru 3. Kolikšen tok potrebujemo, da bo pretok v desnem stebru (z režo) $0{,}5\,\mathrm{mWb}$? Tokrat je vprašanje obrnjeno: začneš pri veji in greš proti tuljavi.

**Podatki:** $N = 300$, $R_{\mathrm{s}} = 2 \cdot 10^{5}\,\mathrm{A/Wb}$, $R_1 = 4 \cdot 10^{5}\,\mathrm{A/Wb}$, $R_2 = 1{,}2 \cdot 10^{6}\,\mathrm{A/Wb}$, $\Phi_2 = 5 \cdot 10^{-4}\,\mathrm{Wb}$
**Iščemo:** tok $I$

:::formula
$V_{\mathrm{p}} = R_2 \Phi_2$, $\Phi_1 = \dfrac{V_{\mathrm{p}}}{R_1}$, $\Phi_{\mathrm{s}} = \Phi_1 + \Phi_2$, $\Theta = R_{\mathrm{s}} \Phi_{\mathrm{s}} + V_{\mathrm{p}}$, $I = \dfrac{\Theta}{N}$
:::

**Rešitev:**

1. Padec na desnem stebru: $V_{\mathrm{p}} = 1{,}2 \cdot 10^{6} \cdot 5 \cdot 10^{-4}\,\mathrm A = 600\,\mathrm A$. Enak padec je na levem stebru, ker sta vzporedna.
2. Levi steber: $\Phi_1 = \dfrac{600\,\mathrm A}{4 \cdot 10^{5}\,\mathrm{A/Wb}} = 1{,}5 \cdot 10^{-3}\,\mathrm{Wb}$.
3. Srednji steber: $\Phi_{\mathrm{s}} = 1{,}5 \cdot 10^{-3} + 5 \cdot 10^{-4} = 2 \cdot 10^{-3}\,\mathrm{Wb}$.
4. Izračunaj sam še $\Theta$ in $I$, nato preveri:

:::premisli
Kolikšna sta $\Theta$ in tok $I$?
---
Na srednjem stebru je padec $2 \cdot 10^{5} \cdot 2 \cdot 10^{-3}\,\mathrm A = 400\,\mathrm A$, zato je $\Theta = 400\,\mathrm A + 600\,\mathrm A = 1000\,\mathrm A$. Tok je $I = \dfrac{1000\,\mathrm A}{300} \approx 3{,}33\,\mathrm A$.
:::

## Pogoste napake

- **»Železa je največ, torej prevlada.«** Študent primerja geometrijski dolžini $100\,\mathrm{mm}$ in $1\,\mathrm{mm}$. Ker je $\mu_{\mathrm{r}}$ železa nekaj tisoč, je magnetni upor železa velikokrat manjši. Popravek: železo pretvori v enakovredno dolžino zraka $l_{\mathrm{Fe}}/\mu_{\mathrm{r}}$ in šele nato primerjaj.
- **V razcepišču sešteva gostote $B$.** Če imajo stebri različne preseke, so tudi gostote različne. Ohranja se pretok, ne gostota. Popravek: Kirchhoffov zakon zapiši za $\Phi$, gostoto v vsakem stebru izračunaj posebej z $B = \Phi/A$.
- **Celo vzbujanje na stranski steber.** Študent deli $\Theta$ kar z $R_1$ in pozabi, da del magnetne napetosti porabi srednji steber. Tako dobi v veji več pretoka, kot ga je v celem krogu. Popravek: najprej skupni upor in skupni pretok, nato padec $V_{\mathrm{p}}$ na vzporedni veji.
- **Brez ovojev ali brez pretvorbe enot.** Kdor vzame $\Theta = I$, dobi $N$-krat premajhen pretok. Kdor vstavi presek v $\mathrm{cm^2}$, se zmoti za faktor $10^{4}$. Popravek: $\Theta = N I$ ter $1\,\mathrm{cm^2} = 10^{-4}\,\mathrm{m^2}$, $1\,\mathrm{mm} = 10^{-3}\,\mathrm m$.
- **Stalni $\mu_{\mathrm{r}}$ pri vsaki gostoti.** Rezultat $B = 2{,}5\,\mathrm T$ v železu ni mogoč, ker je železo že nasičeno. Popravek: preveri $B$; nad približno $1{,}5\,\mathrm T$ vzemi krivuljo magnetenja.

## Povzetek

- Tuljava vzbuja magnetni krog z magnetno napetostjo $\Theta = N I$ (enota A).
- Magnetni upor odseka je $R_{\mathrm{m}} = \dfrac{l}{\mu_0 \mu_{\mathrm{r}} A}$ (enota A/Wb).
- Ohmov zakon magnetnega kroga: $\Theta = R_{\mathrm{m}} \Phi$; padec na odseku je $V_{\mathrm{m}} = H l$.
- Zaporedni odseki: upori se seštejejo, pretok je povsod enak. Zračna reža ima navadno največji upor.
- Razvejani krog: v razcepišču velja $\sum \Phi = 0$, vzporedne veje računaš kot vzporedne upore.
- Model je linearen le, dokler železo ni nasičeno.

## Drugače: Na sliki

Jedro oblike E prerišemo v nadomestno vezje. Vsak odsek iz iste snovi in z istim presekom je en upor. Vsaka reža je svoj upor. Tuljava je vir.

```
        Rs
  +---[====]---+--------+
  |            |        |
 (Θ)         [R1]     [R2]
  |            |      (reža)
  +------------+--------+
```

- Levo je vir $\Theta = N I$ z uporom srednjega stebra $R_{\mathrm{s}}$.
- Desno sta vzporedno vezana upora stranskih stebrov $R_1$ in $R_2$.
- Pretok $\Phi_{\mathrm{s}}$ teče iz vira in se v zgornjem razcepišču razdeli.

Če narišeš silnice v samem jedru, so to sklenjene zanke okrog obeh oken. Gostejše so v levem stebru, redkejše v desnem z režo. Ob reži se silnice nekoliko razširijo navzven. Tega raztrosa nadomestno vezje ne pokaže.

## Drugače: Bolj natančno

**Izvor obeh Kirchhoffovih zakonov.** Amperov zakon po sklenjeni zanki skozi odseke da $\sum_k H_k l_k = N I$. Ker je $H_k l_k = V_{\mathrm m,k}$, je to drugi Kirchhoffov zakon. Polje $B$ nima izvorov: $\oint \vec B \cdot \mathrm d\vec A = 0$. Za ploskev okrog razcepišča zato velja $\sum \Phi = 0$, kar je prvi Kirchhoffov zakon.

**Predpostavke.** Gostota je po preseku enakomerna, ves pretok ostane v jedru in ob reži ni raztrosa. Prvo velja za tanka jedra. Drugo velja približno, ker je $\mu_{\mathrm{Fe}} \gg \mu_0$, a nikoli povsem: del pretoka se sklene skozi zrak (stresani pretok). Raztros ob reži približno upoštevaš s povečanim presekom reže: pri pravokotnem preseku $a \times b$ vzameš $(a + \delta)(b + \delta)$.

**Nelinearnost.** Pravo železo opisuje krivulja magnetenja $B(H)$. Če je dan pretok, je račun premočrten: v vsakem odseku izračunaš $B = \Phi/A$, s krivulje odčitaš $H$ in sešteješ $\sum H_k l_k = \Theta$. Če je dan $\Theta$, pretok ni znan vnaprej. Za jedro z režo velja $\Theta = H_{\mathrm{Fe}} l_{\mathrm{Fe}} + \dfrac{B}{\mu_0}\,\delta$. To je premica v ravnini $(H, B)$; njeno presečišče s krivuljo magnetenja je delovna točka. Pri razvejanih krogih rešuješ iterativno.

**Pogled naprej.** Ko spoznaš induktivnost, boš videl, da je induktivnost tuljave na jedru $L = N^2/R_{\mathrm{m}}$. Reža zato zmanjša induktivnost, a jo hkrati naredi stabilnejšo, ker je upor zraka neodvisen od toka.

## Preveri se

? Katera trditev o magnetnem uporu je pravilna?
- Magnetni upor je večji, če je presek jedra večji.
~ Tu je zamenjana vloga preseka. Širše jedro ponudi pretoku več prostora, zato je upor manjši, kot pri debelejši žici.
+ Magnetni upor je sorazmeren z dolžino poti in obratno sorazmeren s permeabilnostjo in presekom.
- V nerazvejanem jedru je pretok največji tam, kjer je presek najmanjši.
~ Tam je največja gostota $B$, ne pretok. Pretok je v nerazvejanem jedru povsod enak.
- Enota magnetnega upora je weber.
~ Weber je enota pretoka. Magnetni upor je količnik $\Theta/\Phi$, zato ima enoto $\mathrm{A/Wb}$.
> $R_{\mathrm{m}} = \dfrac{l}{\mu_0 \mu_{\mathrm{r}} A}$: daljša pot ga poveča, večji presek in večja permeabilnost ga zmanjšata.

? Jedri A in B sta enaki: $l_{\mathrm{Fe}} = 0{,}2\,\mathrm m$, $\mu_{\mathrm{r}} = 1000$, enak presek in enaka tuljava z enakim tokom. Jedro B ima še režo $0{,}8\,\mathrm{mm}$. Kolikokrat manjši je pretok v jedru B?
- Skoraj enak, saj je reža le $0{,}4\,\%$ dolžine.
~ Tako bi bilo, če bi imel zrak enako permeabilnost kot železo. Zrak ima $\mu_{\mathrm{r}} \approx 1$, zato kratka reža pomeni velik upor.
- Približno $4$-krat.
~ Razmerje reže in enakovrednega zraka železa je res $4$, a jedro B ima oba upora zaporedno: železo in režo.
+ Približno $5$-krat.
- Približno $1000$-krat.
~ Faktor $\mu_{\mathrm{r}}$ velja za primerjavo enako dolgih odsekov, tu pa sta dolžini različni.
> Železo ustreza $0{,}2\,\mathrm m / 1000 = 0{,}2\,\mathrm{mm}$ zraka. Jedro B ima enakovredno $0{,}2 + 0{,}8 = 1{,}0\,\mathrm{mm}$ zraka, torej $5$-krat večji upor in $5$-krat manjši pretok.

? Jedro iz primera 3 ($\Theta = 600\,\mathrm A$, $R_{\mathrm{s}} = 2 \cdot 10^{5}$, $R_1 = 4 \cdot 10^{5}$, $R_2 = 1{,}2 \cdot 10^{6}\,\mathrm{A/Wb}$). Sošolka je zapisala: »$\Phi_1 = \dfrac{\Theta}{R_1} = \dfrac{600}{4 \cdot 10^{5}} = 1{,}5\,\mathrm{mWb}$.« Kje je napaka?
- Ulomek je obrnjen, pravilno je $\Phi_1 = R_1 \Theta$.
~ Ohmov zakon je $\Phi = \Theta/R_{\mathrm{m}}$; deljenje je pravilno. Napaka je v tem, katero napetost je vstavila.
- Levi in desni steber bi morala sešteti zaporedno.
~ Stranska stebra vežeta isti razcepišči, zato sta vzporedna, ne zaporedna.
+ Na levi steber ne deluje cela $\Theta$: del je porabi srednji steber, na levem je le $360\,\mathrm A$.
- Napake ni, račun je pravilen.
~ Pretok $1{,}5\,\mathrm{mWb}$ v eni veji bi bil večji od vsega pretoka $1{,}2\,\mathrm{mWb}$, kar krši prvi Kirchhoffov zakon.
> Pravilno: $\Phi_{\mathrm{s}} = 1{,}2\,\mathrm{mWb}$, $V_{\mathrm{p}} = 360\,\mathrm A$, $\Phi_1 = 360/(4 \cdot 10^{5}) = 0{,}9\,\mathrm{mWb}$.

? Tuljava z $250$ ovoji in tokom $2\,\mathrm A$ je na jedru z magnetnim uporom $2{,}5 \cdot 10^{6}\,\mathrm{A/Wb}$. Kolikšen je pretok?
- $0{,}8\,\mu\mathrm{Wb}$
~ To je $I/R_{\mathrm{m}}$: manjka število ovojev. Vzbujanje je $\Theta = N I$.
+ $0{,}2\,\mathrm{mWb}$
- $1{,}25 \cdot 10^{9}\,\mathrm{Wb}$
~ To je produkt $\Theta \cdot R_{\mathrm{m}}$. Pretok dobiš z deljenjem, kot tok pri Ohmovem zakonu.
> $\Theta = 250 \cdot 2\,\mathrm A = 500\,\mathrm A$, $\Phi = \dfrac{500\,\mathrm A}{2{,}5 \cdot 10^{6}\,\mathrm{A/Wb}} = 2 \cdot 10^{-4}\,\mathrm{Wb}$.

? Nož na magnetnem nosilcu drži trdno. Ko med nož in nosilec vstaviš zloženo kuhinjsko krpo, nož zdrsne. Kaj je glavni razlog?
- Krpa je električni izolator, zato zaustavi magnetno polje.
~ Električna prevodnost s pretokom nima zveze. Pomembna je permeabilnost, ta pa je pri tekstilu enaka kot pri zraku.
- Magnet se ob dotiku s krpo razmagneti.
~ Ko krpo odstraniš, nož spet drži enako trdno. Magnet se ni spremenil, spremenil se je krog.
+ Krpa deluje kot zračna reža z $\mu_{\mathrm{r}} \approx 1$, magnetni upor kroga se večkrat poveča in pretok skozi nož pade.
- Pretok ne more skozi krpo, zato ga v nožu ni.
~ Pretok gre tudi skozi zrak in tkanino, le upor je večji. Nož ga še dobi, a premalo.
> Nosilec, nož in reža tvorijo zaporedni magnetni krog. Že nekaj milimetrov snovi z $\mu_{\mathrm{r}} \approx 1$ ima večji upor kot celotno železo, zato pretok in sila močno padeta.

:::simboli
\Theta | magnetna napetost (vzbujanje) | \Theta = N I | A | amperski ovoji
N | število ovojev tuljave | | –
I | tok skozi tuljavo | I = \frac{\Theta}{N} | A
\Phi | magnetni pretok | \Phi = B A | Wb
B | gostota magnetnega pretoka | B = \frac{\Phi}{A} | T
A | presek jedra | | m^2
R_{\mathrm{m}} | magnetni upor (reluktanca) | R_{\mathrm{m}} = \frac{l}{\mu_0 \mu_{\mathrm{r}} A} | A/Wb
l | srednja dolžina silnice | | m
\mu_0 | permeabilnost vakuuma | | V\,s/(A\,m) | $4\pi \cdot 10^{-7}$
\mu_{\mathrm{r}} | relativna permeabilnost | | – | za zrak približno 1
R_{\mathrm{Fe}} | magnetni upor železnega dela | R_{\mathrm{Fe}} = \frac{l_{\mathrm{Fe}}}{\mu_0 \mu_{\mathrm{r}} A} | A/Wb
R_\delta | magnetni upor zračne reže | R_\delta = \frac{\delta}{\mu_0 A} | A/Wb
l_{\mathrm{Fe}} | dolžina poti v železu | | m
\delta | dolžina zračne reže | | m
\Phi_{\mathrm{s}} | pretok v srednjem stebru | \Phi_{\mathrm{s}} = \Phi_1 + \Phi_2 | Wb
\Phi_1 | pretok v levem stebru | \Phi_1 = \frac{V_{\mathrm{p}}}{R_1} | Wb
\Phi_2 | pretok v desnem stebru (z režo) | \Phi_2 = \frac{V_{\mathrm{p}}}{R_2} | Wb
R_{\mathrm{s}} | magnetni upor srednjega stebra | | A/Wb
R_1 | magnetni upor levega stebra | | A/Wb
R_2 | magnetni upor desnega stebra | | A/Wb
R_{\mathrm{p}} | nadomestni upor stranskih stebrov | R_{\mathrm{p}} = \frac{R_1 R_2}{R_1 + R_2} | A/Wb
V_{\mathrm{p}} | magnetni padec na stranskih stebrih | V_{\mathrm{p}} = R_{\mathrm{p}} \Phi_{\mathrm{s}} | A
V_{\mathrm{m}} | magnetni padec na odseku | V_{\mathrm{m}} = H l | A
H | magnetna poljska jakost | H = \frac{B}{\mu_0 \mu_{\mathrm{r}}} | A/m
:::
