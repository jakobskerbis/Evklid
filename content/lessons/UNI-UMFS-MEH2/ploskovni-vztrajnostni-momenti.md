---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Iz iste aluminijaste letvice lahko narediš stojalo za telefon, ki se upogiba, ali takšno, ki komaj popusti. Odloča le, kako letvico obrneš. Enako vidiš z ravnilom na mizi: ležeče ga upogneš s prstom, pokončnega skoraj ne moreš.

Ploščina prereza je v obeh primerih enaka. Razlika je v tem, **kako daleč od osi upogiba leži material**. To razdaljo zajame ploskovni vztrajnostni moment. Z njim izračunaš upogibne napetosti v ohišju telefona, v nosilcu za monitor ali v ogrodju strežniške omare in izbereš profil, ki z malo materiala nosi veliko. Na koncu lekcije boš izračunal, kolikokrat bolj tog je telefon čez rob kot čez ploščato stran.

## Razlaga

**1. Izhodišče: statični moment.** Prerez leži v ravnini $y$–$z$, os $x$ teče vzdolž nosilca. Iz lekcije o težišču poznaš **statični moment** ploskve glede na os $y$:

$$S_y = \int_A z \, \mathrm{d}A$$

Vsak delček ploskve $\mathrm{d}A$ pomnožimo z oddaljenostjo $z$ od osi. Delčki nad osjo štejejo pozitivno, pod njo negativno. Glede na težiščno os se izničijo, zato je tam $S_y = 0$.

**2. Nova količina: kvadrat razdalje.** **Ploskovni vztrajnostni moment** (tudi osni vztrajnostni moment) glede na os $y$ dobimo, če razdaljo kvadriramo:

$$I_y = \int_A z^2 \, \mathrm{d}A$$

Kvadrat je vedno pozitiven. Delčki pod osjo zato ne odštevajo, ampak prištevajo, in $I_y$ ni nikoli nič. Enota je $\mathrm{mm^4}$ ali $\mathrm{cm^4}$. Enako je $I_z = \int_A y^2 \, \mathrm{d}A$ glede na navpično os $z$.

Za pravokotnik s širino $b$ (vzdolž osi) in višino $h$ (pravokotno na os), glede na težiščno os:

$$I_y = \frac{b h^3}{12}$$

Višina nastopa s tretjo potenco, širina le s prvo. Ta asimetrija je vsa skrivnost ravnila.

:::premisli
Ravnilo ima prerez $30\,\mathrm{mm} \times 3\,\mathrm{mm}$. Kolikokrat večji je $I$, ko ga postaviš pokonci? Napovej, preden računaš.
---
$100$-krat. Ležeče: $b = 30$, $h = 3$, pokonci: $b = 3$, $h = 30$. Razmerje je $\dfrac{3 \cdot 30^3}{30 \cdot 3^3} = \left(\dfrac{30}{3}\right)^2 = 100$. Ploščina je obakrat $90\,\mathrm{mm^2}$.
:::

**3. Kontrast v tabeli.** Obe količini sta »momenta ploskve«, a se vedeta različno:

| lastnost | statični moment $S_y$ | vztrajnostni moment $I_y$ |
|---|---|---|
| razdalja | $z$ (1. potenca) | $z^2$ (2. potenca) |
| predznak | $+$, $-$ ali $0$ | vedno $> 0$ |
| težiščna os | $S_y = 0$ | $I_y$ najmanjši (korak 4) |
| enota | $\mathrm{mm^3}$ | $\mathrm{mm^4}$ |

**4. Steinerjev izrek.** Pri statičnem momentu premik osi za $a$ prinese člen $a \cdot A$. Pri vztrajnostnem momentu se razdalja kvadrira, zato premik prinese $a^2 A$:

$$I_y = I_{y_T} + a^2 A$$

Tu je $I_{y_T}$ vztrajnostni moment glede na vzporedno os skozi težišče ploskve, $a$ razdalja med osema in $A$ ploščina. Člen $a^2 A$ je vedno pozitiven, zato je med vsemi vzporednimi osmi težiščna os tista, glede na katero je $I$ najmanjši.

Pri sestavljenem prerezu (T, I, L, U) izrek uporabimo za vsak del posebej. Najprej določimo skupno težišče, nato vsak del prenesemo nanj in seštejemo.

:::premisli
**Pasnica** je vodoravni del I-profila, **stojina** navpični del, ki ju povezuje. Pasnica je tanka ($h$ majhen), zato je njen lastni $I_{y_T}$ zanemarljiv. Zakaj inženirji kljub temu dajo večino materiala ravno v pasnici?
---
Ker je pasnica daleč od težiščne osi. Njen prispevek $a^2 A$ raste s kvadratom razdalje in daleč presega lastni člen. Stojina le drži pasnici narazen.
:::

**5. Deviacijski moment in glavne osi.** Tretja količina meša obe koordinati:

$$I_{yz} = \int_A y z \, \mathrm{d}A$$

To je **deviacijski** (centrifugalni) moment. Lahko je pozitiven, negativen ali nič. Če je ena od osi simetrijska os prereza, je $I_{yz} = 0$, saj se delčka na obeh straneh simetrale izničita. Tudi zanj velja Steinerjev izrek, $I_{yz} = I_{y_T z_T} + y_a z_a A$, kjer sta $y_a$ in $z_a$ predznačena odmika težišča dela od skupnega težišča.

Če osi zavrtimo okrog težišča, se $I_y$, $I_z$ in $I_{yz}$ spreminjajo, vsota $I_y + I_z$ pa ostane enaka (to je polarni moment $I_p$ iz torzije). Pri nekem kotu $\varphi_0$ postane $I_{yz} = 0$. Tisti osi sta **glavni težiščni osi**, vztrajnostna momenta okrog njiju pa **glavna vztrajnostna momenta** $I_1$ (največji) in $I_2$ (najmanjši):

$$I_s = \frac{I_y + I_z}{2}$$

$$R = \sqrt{\left(\frac{I_y - I_z}{2}\right)^2 + I_{yz}^2}$$

$$I_{1,2} = I_s \pm R$$

Kot merimo od osi $y$ proti osi $z$:

$$\tan 2\varphi_0 = \frac{2 I_{yz}}{I_z - I_y}$$

Ta enačba ima dve rešitvi, ki se razlikujeta za $90^\circ$. Katera os nosi $I_1$, ugotoviš, ko $\varphi_0$ vstaviš v

$$I_{y'} = I_s + \frac{I_y - I_z}{2}\cos 2\varphi_0 - I_{yz}\sin 2\varphi_0$$

Učbeniki se razlikujejo v predznaku $I_{yz}$ in smeri kota, zato ta preizkus vedno naredi. Pri simetričnih prerezih (pravokotnik, T, I) sta glavni osi kar simetrijska os in os pravokotno nanjo.

**6. Odpornostni moment.** Pri upogibu je napetost največja v vlaknu, ki je najbolj oddaljeno od nevtralne osi. Razdaljo do njega označimo $e_{\max}$. **Odpornostni moment** je

$$W_y = \frac{I_y}{e_{\max}}$$

in največja upogibna napetost je kar

$$\sigma_{\max} = \frac{M}{W_y}$$

Za pravokotnik je $e_{\max} = \dfrac{h}{2}$, zato $W_y = \dfrac{b h^2}{6}$. Enota je $\mathrm{mm^3}$. Pri prerezu, ki ni simetričen glede na nevtralno os (npr. T), imata zgornji in spodnji rob različno $e$, zato dobiš dva odpornostna momenta. Za največjo napetost je merodajen manjši.

## Rešeni primeri

### Primer 1 (lažji): letvica stojala za telefon

Aluminijasta letvica stojala za telefon ima pravokoten prerez $30\,\mathrm{mm} \times 6\,\mathrm{mm}$. Izračunaj vztrajnostni in odpornostni moment, ko je letvica ležeča ($h = 6\,\mathrm{mm}$) in ko je pokončna ($h = 30\,\mathrm{mm}$).

**Podatki:** stranici prereza $30\,\mathrm{mm}$ in $6\,\mathrm{mm}$; ležeče $b = 30\,\mathrm{mm}$, $h = 6\,\mathrm{mm}$; pokonci $b = 6\,\mathrm{mm}$, $h = 30\,\mathrm{mm}$
**Iščemo:** $I$ in $W$ v obeh legah

:::formula
$I = \dfrac{b h^3}{12}$, $\quad W = \dfrac{b h^2}{6}$
:::

**Rešitev:**

1. Ležeče: $I = \dfrac{30 \cdot 6^3}{12} = 540\,\mathrm{mm^4}$, ker višina $6\,\mathrm{mm}$ nastopa s tretjo potenco.
2. Ležeče: $W = \dfrac{30 \cdot 6^2}{6} = 180\,\mathrm{mm^3}$.
3. Pokonci: $I = \dfrac{6 \cdot 30^3}{12} = 13500\,\mathrm{mm^4}$.
4. Pokonci: $W = \dfrac{6 \cdot 30^2}{6} = 900\,\mathrm{mm^3}$.
5. Razmerji: $I$ je $25$-krat večji, $W$ pa $5$-krat večji, ker ima $W$ višino le na kvadrat.
6. Odgovor: ležeča letvica ima $I = 540\,\mathrm{mm^4}$ in $W = 180\,\mathrm{mm^3}$, pokončna $I = 13500\,\mathrm{mm^4}$ in $W = 900\,\mathrm{mm^3}$. Pri istem momentu ima pokončna letvica petkrat manjšo največjo napetost.

### Primer 2: T-nosilec za monitor (Steinerjev izrek)

Nosilec za monitor ima T-prerez: zgoraj vodoravna pasnica $8\,\mathrm{cm} \times 1\,\mathrm{cm}$, pod njo navpična stojina $1\,\mathrm{cm} \times 6\,\mathrm{cm}$. Skupna višina je $7\,\mathrm{cm}$. Določi težišče, $I_y$ glede na vodoravno težiščno os in manjši odpornostni moment.

**Podatki:** pasnica $b_2 = 8\,\mathrm{cm}$, $h_2 = 1\,\mathrm{cm}$; stojina $b_1 = 1\,\mathrm{cm}$, $h_1 = 6\,\mathrm{cm}$; skupna višina $7\,\mathrm{cm}$
**Iščemo:** lega težišča $z_T$ (od spodnjega roba), $I_y$, $W_{\min}$

:::formula
$z_T = \dfrac{\sum A_i z_i}{\sum A_i}$, $\quad I_y = \sum \left(I_{y_T,i} + a_i^2 A_i\right)$, $\quad W = \dfrac{I_y}{e_{\max}}$
:::

**Rešitev:**

1. Ploščini in težišči delov (od spodnjega roba): stojina $A_1 = 6\,\mathrm{cm^2}$, $z_1 = 3\,\mathrm{cm}$; pasnica $A_2 = 8\,\mathrm{cm^2}$, $z_2 = 6{,}5\,\mathrm{cm}$.
2. Skupno težišče: $z_T = \dfrac{6 \cdot 3 + 8 \cdot 6{,}5}{14} = 5\,\mathrm{cm}$ od spodnjega roba.
3. Stojina, lastni del: $\dfrac{1 \cdot 6^3}{12} = 18\,\mathrm{cm^4}$; Steiner z $a_1 = 2\,\mathrm{cm}$: $2^2 \cdot 6 = 24\,\mathrm{cm^4}$.
4. Pasnica, lastni del: $\dfrac{8 \cdot 1^3}{12} = 0{,}67\,\mathrm{cm^4}$; Steiner z $a_2 = 1{,}5\,\mathrm{cm}$: $1{,}5^2 \cdot 8 = 18\,\mathrm{cm^4}$.
5. Vsota: $I_y = 18 + 24 + 0{,}67 + 18 = 60{,}67\,\mathrm{cm^4}$. Brez Steinerjevih členov bi dobili le $18{,}67\,\mathrm{cm^4}$, torej več kot trikrat premalo.
6. Spodnji rob je $5\,\mathrm{cm}$ od težišča, zgornji $2\,\mathrm{cm}$, zato $e_{\max} = 5\,\mathrm{cm}$.
7. $W_{\min} = \dfrac{60{,}67}{5} = 12{,}13\,\mathrm{cm^3}$.
8. Odgovor: težišče je $5\,\mathrm{cm}$ nad spodnjim robom, $I_y \approx 60{,}7\,\mathrm{cm^4}$, merodajni odpornostni moment $W_{\min} \approx 12{,}1\,\mathrm{cm^3}$ (spodnji rob).

### Primer 3 (težji): kotnik za stenski usmerjevalnik (glavne osi)

Usmerjevalnik visi na steni na kotniku L. Navpični krak je pravokotnik $1\,\mathrm{cm} \times 6\,\mathrm{cm}$ ($0 \le y \le 1$, $0 \le z \le 6$), vodoravni krak $4\,\mathrm{cm} \times 1\,\mathrm{cm}$ ($1 \le y \le 5$, $0 \le z \le 1$). Prerez nima simetrijske osi. Določi glavna vztrajnostna momenta in kot glavne osi.

**Podatki:** krak 1: $A_1 = 6\,\mathrm{cm^2}$, težišče $(0{,}5;\ 3)\,\mathrm{cm}$; krak 2: $A_2 = 4\,\mathrm{cm^2}$, težišče $(3;\ 0{,}5)\,\mathrm{cm}$; lastni deviacijski momenti pravokotnikov so $0$
**Iščemo:** $I_1$, $I_2$, $\varphi_0$

:::formula
Steiner za $I_y$, $I_z$, $I_{yz}$, nato $I_{1,2} = I_s \pm R$ in $\tan 2\varphi_0 = \dfrac{2 I_{yz}}{I_z - I_y}$
:::

**Rešitev:**

1. Težišče: $y_T = \dfrac{6 \cdot 0{,}5 + 4 \cdot 3}{10} = 1{,}5\,\mathrm{cm}$ in $z_T = \dfrac{6 \cdot 3 + 4 \cdot 0{,}5}{10} = 2\,\mathrm{cm}$.
2. Odmiki težišč krakov od skupnega težišča: krak 1 $(-1;\ 1)\,\mathrm{cm}$, krak 2 $(1{,}5;\ -1{,}5)\,\mathrm{cm}$. Lastni momenti krakov po $\dfrac{b h^3}{12}$: za $I_y$ sta $18$ in $0{,}33\,\mathrm{cm^4}$, za $I_z$ pa $0{,}5$ in $5{,}33\,\mathrm{cm^4}$.
3. $I_y = 18 + 1^2 \cdot 6 + 0{,}33 + 1{,}5^2 \cdot 4 = 33{,}33\,\mathrm{cm^4}$.
4. $I_z = 0{,}5 + 1^2 \cdot 6 + 5{,}33 + 1{,}5^2 \cdot 4 = 20{,}83\,\mathrm{cm^4}$.
5. $I_{yz} = (-1) \cdot 1 \cdot 6 + 1{,}5 \cdot (-1{,}5) \cdot 4 = -15\,\mathrm{cm^4}$. Krakova ležita v »drugem« in »četrtem« kvadrantu okrog težišča, zato je predznak negativen.
6. $I_s = \dfrac{33{,}33 + 20{,}83}{2} = 27{,}08\,\mathrm{cm^4}$ in $R = \sqrt{6{,}25^2 + 15^2} = 16{,}25\,\mathrm{cm^4}$.
7. $I_1 = 27{,}08 + 16{,}25 = 43{,}33\,\mathrm{cm^4}$, $I_2 = 27{,}08 - 16{,}25 = 10{,}83\,\mathrm{cm^4}$.
8. $\tan 2\varphi_0 = \dfrac{2 \cdot (-15)}{20{,}83 - 33{,}33} = 2{,}4$, torej $2\varphi_0 = 67{,}4^\circ$ in $\varphi_0 = 33{,}7^\circ$.
9. Preizkus: $I_{y'} = 27{,}08 + 6{,}25 \cdot 0{,}385 + 15 \cdot 0{,}923 = 43{,}33\,\mathrm{cm^4}$. Os, zavrtena za $33{,}7^\circ$ od $y$ proti $z$, nosi $I_1$.
10. Odgovor: $I_1 \approx 43{,}3\,\mathrm{cm^4}$ okrog osi pod $33{,}7^\circ$, $I_2 \approx 10{,}8\,\mathrm{cm^4}$ okrog osi pravokotno nanjo. Vsota $I_1 + I_2 = I_y + I_z = 54{,}17\,\mathrm{cm^4}$ ostane enaka.

### Primer 4 – zdaj ti: kako debela letvica?

Letvica stojala za telefon je široka $b = 20\,\mathrm{mm}$ in jo upogiba moment $M = 2\,\mathrm{N\,m}$. Dopustna napetost je $\sigma_{\mathrm{dop}} = 100\,\mathrm{MPa}$. Kolikšna mora biti najmanj višina $h$? Zaokroži navzgor na $0{,}5\,\mathrm{mm}$.

**Podatki:** $b = 20\,\mathrm{mm}$, $M = 2\,\mathrm{N\,m} = 2000\,\mathrm{N\,mm}$, $\sigma_{\mathrm{dop}} = 100\,\mathrm{MPa} = 100\,\mathrm{N/mm^2}$
**Iščemo:** najmanjšo višino $h$

:::formula
$W \ge \dfrac{M}{\sigma_{\mathrm{dop}}}$, $\quad W = \dfrac{b h^2}{6}$
:::

**Rešitev:**

1. Potrebni odpornostni moment: $W = \dfrac{2000}{100} = 20\,\mathrm{mm^3}$.
2. Iz $\dfrac{b h^2}{6} = 20$ izrazi $h$ in izračunaj sam.

:::premisli
Kolikšen je $h$ in katero debelino izbereš?
---
$h^2 = \dfrac{6 \cdot 20}{20} = 6\,\mathrm{mm^2}$, $h \approx 2{,}45\,\mathrm{mm}$. Izberemo $h = 2{,}5\,\mathrm{mm}$. Preizkus: $W = \dfrac{20 \cdot 2{,}5^2}{6} \approx 20{,}8\,\mathrm{mm^3}$, napetost $\approx 96\,\mathrm{MPa}$, kar je pod dopustno.
:::

## Pogoste napake

- **Seštevanje brez Steinerja.** »Vztrajnostni moment T-prereza je vsota $\dfrac{b h^3}{12}$ obeh delov.« To velja le, če vsi deli ležijo na isti težiščni osi. Pri T-prerezu iz primera 2 bi dobil $18{,}67$ namesto $60{,}67\,\mathrm{cm^4}$. Vsak del prenesi na *skupno* težišče s členom $a^2 A$.
- **Steiner med dvema netežiščnima osema.** Izrek povezuje os skozi težišče in vzporedno os. Če imaš $I$ glede na rob in želiš $I$ glede na drugo os, najprej odštej $a^2 A$ do težišča, šele nato prištej novi člen.
- **Napačna razdalja pri $W$.** $W = \dfrac{I}{h}$ ali $W = \dfrac{I}{z_T}$ od napačnega roba. Prav je $e_{\max}$, razdalja od *nevtralne osi* do najbolj oddaljenega vlakna. Pri T-prerezu je to daljša od obeh razdalj.
- **Zamenjava $I_y$ in $I_z$.** $I_y$ vsebuje $z^2$, ne $y^2$: šteje razdaljo *od* osi $y$. Za pravokotnik je v $b h^3$ s tretjo potenco vedno mera pravokotno na os.
- **Predznak $I_{yz}$ in kot.** »$I_{yz}$ je kot $I_y$ vedno pozitiven« ne drži. Pri kotniku je bil $-15\,\mathrm{cm^4}$. Ker učbeniki uporabljajo različne predznake, vstavi $\varphi_0$ v $I_{y'}$ in preveri, ali dobiš $I_1$ ali $I_2$.

## Povzetek

- $I_y = \int_A z^2\,\mathrm{d}A$: razdalja na kvadrat, vedno pozitiven, enota $\mathrm{mm^4}$. Pravokotnik: $\dfrac{b h^3}{12}$.
- Steinerjev izrek: $I_y = I_{y_T} + a^2 A$. Težiščna os da najmanjši $I$. Pri sestavljenih prerezih najprej skupno težišče, nato vsak del s svojim $a^2 A$.
- Deviacijski moment $I_{yz} = \int_A y z\,\mathrm{d}A$ je lahko negativen; pri simetrijski osi je $0$.
- Glavni osi: $I_{yz} = 0$; $I_{1,2} = I_s \pm R$, kot iz $\tan 2\varphi_0 = \dfrac{2 I_{yz}}{I_z - I_y}$, s preizkusom, katera os nosi $I_1$.
- Odpornostni moment $W = \dfrac{I}{e_{\max}}$, $\sigma_{\max} = \dfrac{M}{W}$. Pravokotnik: $\dfrac{b h^2}{6}$; če prerez ni simetričen glede na nevtralno os, je merodajen manjši $W$.

## Drugače: Na sliki

Prerez si predstavljaj kot kup vodoravnih trakov. Vsak trak dobi »glas« sorazmeren s ploščino, pomnoženo s kvadratom oddaljenosti od osi:

```
 razdalja z    trak     prispevek z²·dA
   +3 ──────  █████   █████████
   +2 ──────  █████   ████
   +1 ──────  █████   █
    0 ══════  █████   (nič)
   −1 ──────  █████   █
   −2 ──────  █████   ████
   −3 ──────  █████   █████████
```

Zunanja trakova prispevata devetkrat toliko kot trakova ob osi, čeprav so vsi enako široki. Zato I-profil »odreže« sredino in jo prestavi na rob.

Glavne osi si predstavljaj kot kazalec, ki ga vrtiš okrog težišča. Ko ga obrneš za $\varphi$, se $I_{y'}$ spreminja kot točka na krogu s središčem $I_s$ in polmerom $R$. Skrajna desna točka kroga je $I_1$, skrajna leva $I_2$. Enak krog boš srečal pri napetostih (Mohrov krog).

## Drugače: Uporaba v stroki

- **Ravnilo in telefon.** Telefon s prerezom $75\,\mathrm{mm} \times 8\,\mathrm{mm}$ ima pri upogibu čez ploščato stran $I = 3200\,\mathrm{mm^4}$, čez rob pa $2{,}81 \cdot 10^5\,\mathrm{mm^4}$, skoraj $88$-krat več. Zato se telefoni v zadnjem žepu upognejo »ploščato«, nikoli čez rob.
- **Rebra na ohišju.** Plastično ohišje polnilnika ali usmerjevalnika ima na notranji strani tanka rebra. Odmaknejo material od osi in povečajo $I$ z malo dodane mase.
- **Zapognjena pločevina.** Polica v strežniški omari ima zapognjene robove. Ravna pločevina debeline $1\,\mathrm{mm}$ je mehka; z robovi, visokimi $15\,\mathrm{mm}$, je toga kot debela plošča.
- **Kartonska škatla.** List kartona se upogne sam od sebe, valovita lepenka z dvema plastema na razmiku pa ne. Isti princip kot pasnici I-nosilca.

## Drugače: Bolj natančno

**Dokaz Steinerjevega izreka.** Naj bo $\zeta$ oddaljenost delčka od težiščne osi $y_T$, os $y$ pa vzporedna in za $a$ odmaknjena, tako da je $z = \zeta + a$. Potem je

$$I_y = \int_A (\zeta + a)^2\,\mathrm{d}A = \int_A \zeta^2\,\mathrm{d}A + 2a\int_A \zeta\,\mathrm{d}A + a^2\int_A \mathrm{d}A = I_{y_T} + 0 + a^2 A$$

Srednji člen je $2a$-kratni statični moment glede na težiščno os, ki je $0$. Zato izrek velja samo, če je ena od osi težiščna: pri dveh netežiščnih oseh srednji člen ne izgine.

**Zasuk osi.** Osi zavrtimo za kot $\varphi$ od $y$ proti $z$. Nove koordinate delčka so $y' = y\cos\varphi + z\sin\varphi$ in $z' = -y\sin\varphi + z\cos\varphi$. Iz $I_{y'} = \int_A z'^2\,\mathrm{d}A$ dobimo $I_y\cos^2\varphi + I_z\sin^2\varphi - 2I_{yz}\sin\varphi\cos\varphi$, kar je z dvojnimi koti formula iz razlage. Enako iz $\int_A y' z'\,\mathrm{d}A$:

$$I_{y'z'} = \frac{I_y - I_z}{2}\sin 2\varphi + I_{yz}\cos 2\varphi$$

Pogoj $I_{y'z'} = 0$ da $\tan 2\varphi_0 = \dfrac{2 I_{yz}}{I_z - I_y}$. Isti pogoj dobimo iz $\dfrac{\mathrm{d}I_{y'}}{\mathrm{d}\varphi} = 0$, zato sta glavna momenta hkrati ekstremna. Ker je $I_{y'} - I_s$ vsota kosinusa in sinusa kota $2\varphi$ z amplitudama $\dfrac{I_y - I_z}{2}$ in $I_{yz}$, je njen največji odmik $\sqrt{\left(\dfrac{I_y - I_z}{2}\right)^2 + I_{yz}^2} = R$. Od tod $I_{1,2} = I_s \pm R$.

## Preveri se

? Katera trditev o deviacijskem momentu $I_{yz}$ je pravilna?
- Kot $I_y$ in $I_z$ je vedno pozitiven.
~ Pod integralom je produkt $y z$, ki je negativen, kadar ima delček koordinati nasprotnih predznakov.
+ Glede na glavni osi je enak nič.
- Steinerjev izrek zanj ne velja.
~ Velja, s produktom predznačenih odmikov $y_a z_a A$, kot pri kotniku v primeru 3.
> Glavni osi sta definirani prav s pogojem $I_{yz} = 0$. Pri simetričnem prerezu je simetrijska os ena od njiju.

? Pravokoten prerez $b = 40\,\mathrm{mm}$, $h = 10\,\mathrm{mm}$ upogibamo okrog vodoravne težiščne osi. Kolikšen je odpornostni moment $W$?
- $3333\,\mathrm{mm^3}$
~ To je $I = \dfrac{b h^3}{12}$ (v $\mathrm{mm^4}$). $W$ dobiš šele z deljenjem z $e_{\max} = 5\,\mathrm{mm}$.
- $2667\,\mathrm{mm^3}$
~ Zamenjal si $b$ in $h$: $\dfrac{10 \cdot 40^2}{6}$ velja za pokončno lego.
+ $667\,\mathrm{mm^3}$
- $333\,\mathrm{mm^3}$
~ Deliš z višino $h$ namesto z $e_{\max} = \dfrac{h}{2}$.
> $W = \dfrac{b h^2}{6} = \dfrac{40 \cdot 10^2}{6} \approx 667\,\mathrm{mm^3}$, ali $\dfrac{I}{h/2} = \dfrac{3333}{5}$.

? Študent je za T-prerez zapisal: »$I_y = \dfrac{1 \cdot 6^3}{12} + \dfrac{8 \cdot 1^3}{12} = 18{,}67\,\mathrm{cm^4}$.« Kje je napaka?
- Pri pasnici bi moral vzeti $\dfrac{1 \cdot 8^3}{12}$.
~ Pasnica je vodoravna; s tretjo potenco nastopa njena višina $1\,\mathrm{cm}$ pravokotno na os, torej je $\dfrac{8 \cdot 1^3}{12}$ pravilno.
+ Manjkata Steinerjeva člena $a^2 A$, ker težišči delov nista na skupni težiščni osi.
- Lastna momenta bi moral odšteti, ne sešteti.
~ Vztrajnostni momenti so vedno pozitivni in se pri sestavljanju seštevajo.
> Prava vrednost je $60{,}67\,\mathrm{cm^4}$: k lastnima momentoma prištejemo $2^2 \cdot 6 = 24$ in $1{,}5^2 \cdot 8 = 18\,\mathrm{cm^4}$.

? Pravokotnik $20\,\mathrm{mm} \times 60\,\mathrm{mm}$ enkrat postavimo pokonci, drugič ležeče. Kolikokrat večji je $I$ v pokončni legi?
- Enak je, ker je ploščina enaka.
~ $I$ ni odvisen le od ploščine, ampak od razdalje materiala od osi na kvadrat.
- $3$-krat.
~ Toliko je razmerje odpornostnih momentov $W$, ki vsebujeta $h^2$, ne $h^3$.
+ $9$-krat.
- $27$-krat.
~ Upošteval si le $h^3$; širina $b$ se pri obrnitvi tudi spremeni in vzame en faktor $3$.
> $\dfrac{20 \cdot 60^3}{12} = 360000$ proti $\dfrac{60 \cdot 20^3}{12} = 40000\,\mathrm{mm^4}$. Razmerje je $\left(\dfrac{60}{20}\right)^2 = 9$.

? Polica v strežniški omari iz pločevine debeline $1\,\mathrm{mm}$ se je preveč povešala. Proizvajalec je robova zapognil navzdol. Zakaj je polica zdaj veliko bolj toga, čeprav ima skoraj enako maso?
- Ker zapognjena pločevina utrdi material in poveča elastični modul.
~ Elastični modul je lastnost materiala in se z oblikovanjem praktično ne spremeni.
- Ker se je povečala ploščina prereza.
~ Ploščina se skoraj ne spremeni, saj je pločevina ista. Spremeni se razporeditev.
+ Ker je del materiala zdaj daleč od nevtralne osi in ta del prispeva s kvadratom razdalje.
> Zapognjena robova delujeta kot stojini: po Steinerju prispevata $a^2 A$, njuna lastna višina pa nastopa s tretjo potenco. $I$ in $W$ zato zrasteta za velik faktor.

:::simboli
S_y | statični moment glede na os $y$ | S_y = \int_A z\,\mathrm{d}A | mm^3
I_y | ploskovni vztrajnostni moment glede na os $y$ | I_y = \int_A z^2\,\mathrm{d}A | mm^4
I_z | ploskovni vztrajnostni moment glede na os $z$ | I_z = \int_A y^2\,\mathrm{d}A | mm^4
I_{yz} | deviacijski (centrifugalni) moment | I_{yz} = \int_A y z\,\mathrm{d}A | mm^4 | lahko je negativen
I_{y_T} | vztrajnostni moment glede na vzporedno težiščno os | | mm^4
I_{y_T,i} | lastni vztrajnostni moment $i$-tega dela | | mm^4 | glede na težišče dela
I_{y'} | vztrajnostni moment glede na zavrteno os $y'$ | | mm^4
A | ploščina prereza | | mm^2
A_i | ploščina $i$-tega dela | | mm^2
\mathrm{d}A | delček ploskve | | mm^2
y | vodoravna koordinata v prerezu | | mm
z | navpična koordinata v prerezu | | mm
z_i | lega težišča $i$-tega dela | | mm
z_T | lega skupnega težišča | z_T = \frac{\sum A_i z_i}{\sum A_i} | mm
a | razdalja med vzporednima osema | | mm
a_i | razdalja težišča dela do skupnega težišča | | mm
b | širina prereza vzdolž osi | | mm
h | višina prereza pravokotno na os | | mm
I_s | srednja vrednost vztrajnostnih momentov | I_s = \frac{I_y + I_z}{2} | mm^4
R | polmer kroga vztrajnostnih momentov | | mm^4 | pomožna količina
I_1, I_2, I_{1,2} | glavna vztrajnostna momenta | I_{1,2} = I_s \pm R | mm^4 | $I_1$ največji, $I_2$ najmanjši
I | vztrajnostni moment pravokotnika glede na težiščno os | I = \frac{b h^3}{12} | mm^4
\varphi_0 | kot glavne osi od osi $y$ | | ° | merjen od $y$ proti $z$
\varphi | kot zasuka osi | | ° | merjen od $y$ proti $z$
y', z' | koordinati v zavrtenem sistemu | | mm
I_{y'z'} | deviacijski moment glede na zavrteni osi | | mm^4
\zeta | oddaljenost od težiščne osi | | mm
W, W_y | odpornostni moment | W_y = \frac{I_y}{e_{\max}} | mm^3
e_{\max} | razdalja do najbolj oddaljenega vlakna | | mm | od nevtralne osi
\sigma_{\max} | največja upogibna napetost | \sigma_{\max} = \frac{M}{W_y} | MPa
\sigma_{\mathrm{dop}} | dopustna napetost | | MPa
M | upogibni moment | | N\,mm
:::
