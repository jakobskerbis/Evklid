---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Pianistka dviga pokrov koncertnega klavirja. Če ga prime na skrajnem robu, se dvigne skoraj sam. Če poskusi s prsti tik ob tečajih, se komaj premakne. Pokrov je isti, njegova teža tudi.

Kitarist uglašuje struno. Ključ na glavi kitare ima ploščato krilce, ki ga z dvema prstoma lahko zavrti. Brez krilca bi moral vrteti golo kovinsko os in strune skoraj ne bi napel.

Prizora sta si na videz daleč narazen, a skrivata isto idejo. Za vrtenje ni pomembna samo velikost sile, ampak tudi to, **kako daleč od osi** in v kateri smeri deluje. Na tekmovanjih se ta ideja skriva v nalogah o vzvodih, lestvah, drogovih in kolesih. Kdor jo obvlada, jih reši z eno enačbo, zapisano okoli pametno izbrane točke.

## Razlaga

**1. Mamljiva ideja: »odloča samo sila«.** Glasbeni mobil je lahka palica, ki visi na vrvici. Na levi strani visi velik zvonec, na desni majhen. Po tej ideji bi se palica nagnila na levo. Pa se ne, če majhen zvonec visi dovolj daleč od vrvice. Na vrtenje vplivata sila in njena oddaljenost od osi **skupaj**.

To skupno mero imenujemo **navor** $M$. Če sila deluje pravokotno na palico na razdalji $d$ od osi, je

$$M = d \cdot F$$

Enota je newton meter, $\mathrm{N\,m}$. Ni ga pametno pisati kot joule, saj navor ni delo. Navor ima tudi smer vrtenja. Dogovorimo se, da je navor, ki vrti v nasprotni smeri urnega kazalca, pozitiven, navor v smeri urnega kazalca pa negativen.

**2. Kaj, če sila ni pravokotna?** Pri ključu za uglaševanje prst pogosto ne potiska naravnost pravokotno na krilce. Ključ zavrti samo tisti del sile, ki je pravokoten na krilce. Preprosteje je razmišljati s premico, po kateri sila deluje. Tej premici rečemo **nosilka sile**. **Ročica** $d$ je pravokotna razdalja od osi do nosilke.

:::risba skica
opis: Krilce ključa je vodoravna daljica od osi O do prijemališča na razdalji r. V prijemališču deluje sila F pod kotom fi 30 stopinj glede na krilce. Nosilka sile je črtkana premica. Od osi do nosilke vodi črtkana pravokotna daljica: to je ročica d = r · sin fi, polovica dolžine r.
območje: 0; 0 .. 8; 5
enota: 38
črta: 1; 3 -> 6; 3 | debelo
točka: 1; 3 | O | nad
napis: 3,5; 3 | r | nad
črta: 2,25; 0,835 -> 6; 3 | črtkano
puščica: 6; 3 -> 7,73; 4 | F | nad | oranžna
črta: 1; 3 -> 2,25; 0,835 | črtkano modra
pravikot: 2,25; 0,835 | 1; 3 | 6; 3
napis: 1,5; 1,9 | d | levo | modra
napis: 4,6; 2,62 | φ | sredina
:::

Iz pravokotnega trikotnika na risbi odčitaš $d = r \sin\varphi$. Tu je $r$ razdalja od osi do prijemališča, $\varphi$ pa kot med krilcem in silo. Zato

$$M = r F \sin\varphi$$

Pri $\varphi = 90^\circ$ je ročica kar $r$. Pri $\varphi = 30^\circ$ je ročica pol manjša in navor tudi.

:::premisli
Na krilce ključa pritisneš s silo, ki kaže naravnost proti osi. Kolikšen je navor? Napovej, preden pogledaš.
---
Nič. Nosilka sile gre skozi os, zato je ročica $d = 0$ (tudi $\sin 0^\circ = 0$). Ključ samo potiskaš ob os, zavrtiš ga ne.
:::

**3. Druga mamljiva ideja: »če je vsota sil nič, telo miruje«.** Timpane uglašujemo s ključem v obliki črke T. Z eno roko potisneš en krak naprej, z drugo drugi krak nazaj, z enako veliko silo. Vsota sil je nič, ključ se pa vseeno zavrti. Dve enako veliki nasprotni sili na različnih nosilkah imenujemo **par sil**. Par sil telesa ne premakne, a ga zavrti.

Togo telo zato miruje le, če veljata **oba** pogoja ravnovesja:

- vsota vseh sil je nič (telo se ne premika),
- vsota vseh navorov okoli katerekoli osi je nič (telo se ne zavrti).

Os pri drugem pogoju si izbereš sam. Izberi jo skozi prijemališče sile, ki je ne poznaš in je tudi ne iščeš: ta sila potem nima navora in izpade iz enačbe. Teža celega telesa deluje v **težišču**, pri homogenem drogu na sredini.

V simulaciji spodaj »Navor in ravnovesje« postavi utež $4\,\mathrm{kg}$ na razdaljo $2$ in poišči, kam moraš dati utež $2\,\mathrm{kg}$, da se vzvod umiri. Opazuj zapis navorov: v ravnovesju sta produkta $F_1 r_1$ in $F_2 r_2$ enaka.

**4. Tretja mamljiva ideja: »enako težko telo se enako lahko zavrti«.** Vzemi tamburin (obroč z zvončki na robu) in enako težak lesen disk enakega polmera. Tamburin je teže zavrteti in teže ustaviti. Pri vrtenju ni pomembna samo masa, ampak tudi, kako daleč od osi je razporejena.

To meri **vztrajnostni moment** $J$. Za majhne koščke z masami $m_i$ na razdaljah $r_i$ od osi je

$$J = \sum m_i r_i^2$$

Enota je $\mathrm{kg\,m^2}$. Razdalja je v kvadratu, zato masa daleč od osi šteje veliko več kot masa blizu nje. Za preprosta homogena telesa z maso $m$ in polmerom $r$ (os skozi središče) velja:

| Telo | $J$ |
|---|---|
| tanek obroč | $m r^2$ |
| poln valj ali disk | $\frac{1}{2} m r^2$ |
| polna krogla | $\frac{2}{5} m r^2$ |
| tanka palica dolžine $L$ | $\frac{1}{12} m L^2$ |

Vrtenje opišemo podobno kot premo gibanje. **Kotna hitrost** $\omega$ pove, za koliko radianov se telo zavrti v sekundi. **Kotni pospešek** $\alpha$ pove, kako hitro se spreminja $\omega$.

| Premo gibanje | Vrtenje |
|---|---|
| sila $F$ | navor $M$ |
| masa $m$ | vztrajnostni moment $J$ |
| pospešek $a$ | kotni pospešek $\alpha$ |
| $F = m a$ | $M = J \alpha$ |

Drugi Newtonov zakon za vrtenje je torej

$$M = J \alpha$$

Telo, ki se vrti, ima tudi kinetično energijo vrtenja

$$W_{vrt} = \frac{1}{2} J \omega^2$$

Telo, ki se kotali brez spodrsavanja, se hkrati premika in vrti. Pri tem sta hitrost njegovega središča in kotna hitrost povezani: $v = \omega r$.

V simulaciji spodaj »Kotaljenje po klancu« spusti hkrati kroglo, valj in obroč. Opazuj, kdo pride prvi na dno in ali se vrstni red spremeni, ko spremeniš naklon.

:::premisli
Zakaj obroč pride na dno zadnji, čeprav ga teža vleče enako kot kroglo z isto maso?
---
Pri kotaljenju se potencialna energija razdeli na energijo premega gibanja in energijo vrtenja. Obroč ima vso maso na robu, zato je njegov $J$ glede na $m r^2$ največji ($1$ proti $\frac{2}{5}$ pri krogli). Večji del energije gre v vrtenje, za premo gibanje ostane manj in obroč je počasnejši. Masa in polmer se pri tem pokrajšata.
:::

## Rešeni primeri

### Primer 1: ključ za uglaševanje

Kitarist potiska krilce ključa s silo $12\,\mathrm{N}$ na razdalji $3{,}0\,\mathrm{cm}$ od osi. Kolikšen je navor, če potiska pravokotno na krilce? Kolikšen je, če sila s krilcem oklepa kot $30^\circ$?

**Podatki:** $F = 12\,\mathrm{N}$, $r = 3{,}0\,\mathrm{cm}$, $\varphi_1 = 90^\circ$, $\varphi_2 = 30^\circ$
**Iščemo:** navora $M_1$ in $M_2$

:::formula
$M = r F \sin\varphi$
:::

**Rešitev:**

1. Pretvorimo v metre: $r = 0{,}030\,\mathrm{m}$.
2. Pri pravem kotu je $\sin 90^\circ = 1$, ročica je cel $r$: $M_1 = 0{,}030\,\mathrm{m} \cdot 12\,\mathrm{N} = 0{,}36\,\mathrm{N\,m}$.
3. Pri $30^\circ$ je $\sin 30^\circ = 0{,}5$, zato se ročica prepolovi: $M_2 = 0{,}36\,\mathrm{N\,m} \cdot 0{,}5 = 0{,}18\,\mathrm{N\,m}$.
4. Odgovor: pravokotni potisk da navor $0{,}36\,\mathrm{N\,m}$, poševni pod $30^\circ$ le $0{,}18\,\mathrm{N\,m}$.

### Primer 2: gong na drogu

Homogen drog z dolžino $1{,}20\,\mathrm{m}$ in maso $3{,}0\,\mathrm{kg}$ leži vodoravno na dveh stojalih na svojih krajiščih. Na drogu visi gong z maso $9{,}0\,\mathrm{kg}$. Od levega krajišča je oddaljen $0{,}30\,\mathrm{m}$. S kolikšno silo drog pritiska na vsako stojalo? Vzemi $g = 9{,}81\,\mathrm{m/s^2}$.

**Podatki:** $L = 1{,}20\,\mathrm{m}$, $m_2 = 3{,}0\,\mathrm{kg}$ (drog), $m_1 = 9{,}0\,\mathrm{kg}$ (gong), $x_1 = 0{,}30\,\mathrm{m}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** sili stojal $F_L$ in $F_D$

:::formula
Navori okoli levega krajišča: $F_D L = m_1 g\,x_1 + m_2 g\,\dfrac{L}{2}$

Sile: $F_L = (m_1 + m_2) g - F_D$
:::

**Rešitev:**

1. Teži: gong $m_1 g = 9{,}0 \cdot 9{,}81 = 88{,}29\,\mathrm{N}$, drog $m_2 g = 3{,}0 \cdot 9{,}81 = 29{,}43\,\mathrm{N}$ v težišču na sredini, $0{,}60\,\mathrm{m}$ od levega krajišča.
2. Os postavimo v levo krajišče, ker tam deluje neznana $F_L$ in tako izpade iz enačbe.
3. Navora tež: $88{,}29 \cdot 0{,}30 \approx 26{,}49\,\mathrm{N\,m}$ in $29{,}43 \cdot 0{,}60 \approx 17{,}66\,\mathrm{N\,m}$, skupaj $26{,}49 + 17{,}66 = 44{,}15\,\mathrm{N\,m}$.
4. Navor $F_D$ mora biti enako velik: $F_D = \dfrac{44{,}15\,\mathrm{N\,m}}{1{,}20\,\mathrm{m}} \approx 36{,}8\,\mathrm{N}$.
5. Vsota sil je nič: $F_L = 117{,}72\,\mathrm{N} - 36{,}79\,\mathrm{N} \approx 80{,}9\,\mathrm{N}$.
6. Preverba z osjo v desnem krajišču: $F_L = \dfrac{88{,}29 \cdot 0{,}90 + 29{,}43 \cdot 0{,}60}{1{,}20} \approx 80{,}9\,\mathrm{N}$. Se ujema.
7. Odgovor: levo stojalo nosi $80{,}9\,\mathrm{N}$, desno $36{,}8\,\mathrm{N}$. Levo nosi več, ker je gong bližje njemu.

### Primer 3: kontrabas ob steni

Glasbenik med odmorom nasloni kontrabas ob gladko steno (trenja s steno ni). Kontrabas obravnavaj kot homogeno palico z maso $10\,\mathrm{kg}$ in dolžino $1{,}8\,\mathrm{m}$, ki s tlemi oklepa kot $70^\circ$. Kolikšen mora biti najmanj koeficient lepenja med tlemi in kontrabasom, da ne zdrsne?

**Podatki:** $m = 10\,\mathrm{kg}$, $L = 1{,}8\,\mathrm{m}$, $\beta = 70^\circ$, $g = 9{,}81\,\mathrm{m/s^2}$, stena brez trenja
**Iščemo:** najmanjši koeficient lepenja $k_l$

:::formula
Navori okoli stika s tlemi: $N_s L \sin\beta = m g\,\dfrac{L}{2} \cos\beta$

Sile: $F_l = N_s$, $N_t = m g$, pogoj $k_l \ge \dfrac{F_l}{N_t}$
:::

**Rešitev:**

1. Sile: teža $m g = 98{,}1\,\mathrm{N}$ v težišču, sila stene $N_s$ pravokotno na steno (vodoravno), tla navzgor ($N_t$) in sila lepenja $F_l$ vodoravno proti steni.
2. Os postavimo v stik s tlemi. Tam delujeta dve neznani sili, $N_t$ in $F_l$, in obe izpadeta.
3. Ročica sile stene je navpična razdalja $L \sin\beta$, ročica teže pa vodoravna razdalja $\frac{L}{2}\cos\beta$. Iz navorov sledi $N_s = \dfrac{m g}{2\tan\beta}$; dolžina $L$ se pokrajša.
4. S $\tan 70^\circ \approx 2{,}747$: $N_s = \dfrac{98{,}1\,\mathrm{N}}{5{,}494} \approx 17{,}9\,\mathrm{N}$.
5. Vodoravno: $F_l = N_s \approx 17{,}9\,\mathrm{N}$. Navpično: $N_t = m g = 98{,}1\,\mathrm{N}$.
6. Pogoj lepenja: $k_l \ge \dfrac{17{,}85}{98{,}1} \approx 0{,}18$.
7. Odgovor: koeficient lepenja mora biti vsaj $0{,}18$. Dolžina kontrabasa ne vpliva. Bolj pokončen kontrabas (večji $\beta$) potrebuje še manj lepenja.

### Primer 4: zdaj ti – gramofon

Krožnik gramofona je homogen disk z maso $1{,}5\,\mathrm{kg}$ in polmerom $15\,\mathrm{cm}$. Motor nanj deluje s stalnim navorom $0{,}050\,\mathrm{N\,m}$. V kolikšnem času se krožnik iz mirovanja zavrti na $33\tfrac{1}{3}$ obratov na minuto? Trenje zanemari.

**Podatki:** $m = 1{,}5\,\mathrm{kg}$, $r = 0{,}15\,\mathrm{m}$, $M = 0{,}050\,\mathrm{N\,m}$, $n = 33\tfrac{1}{3}\,\mathrm{min^{-1}}$
**Iščemo:** čas $t$

:::formula
$J = \dfrac{1}{2} m r^2$, $\omega = 2\pi n$, $\alpha = \dfrac{M}{J}$, $t = \dfrac{\omega}{\alpha}$
:::

**Rešitev:**

1. Vztrajnostni moment diska: $J = 0{,}5 \cdot 1{,}5 \cdot 0{,}0225 = 0{,}016875\,\mathrm{kg\,m^2}$.
2. Končna kotna hitrost: $n = \frac{100}{3}\,\mathrm{min^{-1}}$, kar je $0{,}5556$ obrata na sekundo, zato $\omega = 2\pi \cdot 0{,}5556\,\mathrm{s^{-1}} \approx 3{,}49\,\mathrm{rad/s}$.
3. Izračunaj sam kotni pospešek in čas, nato preveri:

:::premisli
Koliko sta $\alpha = \dfrac{M}{J}$ in $t = \dfrac{\omega}{\alpha}$?
---
$\alpha = \dfrac{0{,}050}{0{,}016875} \approx 2{,}96\,\mathrm{rad/s^2}$, nato $t = \dfrac{3{,}49}{2{,}96} \approx 1{,}18\,\mathrm{s}$. Krožnik doseže pravo hitrost v dobri sekundi.
:::

## Pogoste napake

- **»Težja stran vedno prevesi.«** Kdor gleda samo sile, pri mobilu ali vzvodu napove napačno smer. Šteje produkt sile in ročice. Majhna sila na dolgi ročici lahko uravnovesi veliko silo na kratki.
- **Ročica je kar razdalja do prijemališča.** To velja samo, če je sila pravokotna. Pri poševni sili je ročica $d = r \sin\varphi$, pravokotna razdalja do nosilke. Pri sili, usmerjeni proti osi, je navor nič.
- **Za ravnovesje je dovolj vsota sil nič.** Par sil ima vsoto nič, pa telo vseeno zavrti. Vedno zapiši oba pogoja: vsota sil in vsota navorov.
- **Vztrajnostni moment je kar masa.** Enako težka obroč in krogla se ne kotalita enako hitro. Šteje, kako daleč od osi je masa: $J = \sum m_i r_i^2$.
- **V $J = m r^2$ vstaviš dolžino telesa.** Vstaviti moraš razdaljo od osi in jo kvadrirati. Pri palici, ki se vrti okoli sredine, je to polovica njene dolžine.

## Povzetek

- Navor: $M = r F \sin\varphi = d \cdot F$, ročica $d$ je pravokotna razdalja od osi do nosilke sile. Enota $\mathrm{N\,m}$.
- Togo telo miruje, če je vsota sil nič in vsota navorov okoli katerekoli osi nič. Os izberi skozi neznano silo, ki je ne iščeš.
- Teža deluje v težišču; pri homogenem drogu na sredini.
- Vztrajnostni moment $J = \sum m_i r_i^2$ (obroč $m r^2$, valj $\frac{1}{2} m r^2$, krogla $\frac{2}{5} m r^2$).
- Za vrtenje velja $M = J \alpha$ in $W_{vrt} = \frac{1}{2} J \omega^2$. Pri kotaljenju prej pride na dno telo z manjšim $J/(m r^2)$.

## Drugače: Kot zgodba

Tina izdeluje glasbeni mobil za mlajšo sestro. Na lahko palico obesi dva zvončka: težji ima maso $60\,\mathrm{g}$, lažji $20\,\mathrm{g}$. Vrvico privije točno na sredino palice in mobil se takoj nagne na stran težjega zvončka.

»Težji zvonček je pač težji,« pomisli Tina in hoče kupiti dva enaka. Brat ji predlaga drugo rešitev: »Premakni vrvico.« Tina jo pomika proti težjemu zvončku. Ko je težji zvonček $10\,\mathrm{cm}$ od vrvice, lažji pa $30\,\mathrm{cm}$, palica obvisi vodoravno.

Zakaj ravno tam? Težji zvonček je trikrat težji, a ima trikrat krajšo ročico. Produkta sta enaka: $60 \cdot 10 = 20 \cdot 30$. Navora na obeh straneh sta enako velika in nasprotna, zato se palica ne zavrti.

Ko mobil zapiha veter, se zavrti okoli vrvice. Tina opazi, da se mobil z zvončki na koncih dolge palice vrti počasi in lenobno, enak mobil s krajšo palico pa živahno. To je vztrajnostni moment: masa daleč od osi se upira vrtenju.

## Drugače: Korak za korakom s številkami

Recept za vsako nalogo z ravnovesjem, na drogu iz primera 2, a z gongom $0{,}80\,\mathrm{m}$ od levega krajišča:

1. **Nariši vse sile** s prijemališči: $F_L$ in $F_D$ navzgor na krajiščih, $88{,}29\,\mathrm{N}$ pri $0{,}80\,\mathrm{m}$; $29{,}43\,\mathrm{N}$ pri $0{,}60\,\mathrm{m}$.
2. **Izberi os** tam, kjer je neznanka, ki je ne iščeš (levo krajišče).
3. **Zapiši navore** s predznaki: $F_D$ vrti v nasprotni smeri urnega kazalca ($+$), teži v smeri urnega kazalca ($-$).
4. **Vsota navorov je nič:** $F_D \cdot 1{,}20 = 88{,}29 \cdot 0{,}80 + 29{,}43 \cdot 0{,}60 = 70{,}63 + 17{,}66 = 88{,}29$, torej $F_D = \dfrac{88{,}29}{1{,}20} \approx 73{,}6\,\mathrm{N}$.
5. **Vsota sil je nič:** $F_L = 117{,}72 - 73{,}58 \approx 44{,}1\,\mathrm{N}$.
6. **Preveri smiselnost:** gong je zdaj bližje desnemu stojalu, zato desno nosi več. Vsota $73{,}6 + 44{,}1 \approx 117{,}7\,\mathrm{N}$ je enaka skupni teži.

## Preveri se

? Kitarist zavrti ključ na glavi kitare. Kaj je pri tem **ročica** njegove sile?
- Dolžina celega ključa.
~ Dolžina telesa ni ročica. Šteje razdalja od osi vrtenja do nosilke sile.
+ Pravokotna razdalja od osi ključa do premice, po kateri deluje sila prsta.
- Razdalja od prsta do strune.
~ Struna ni os vrtenja. Ročico vedno merimo od osi, okoli katere se telo vrti.
- Razdalja od osi do prsta, ne glede na smer sile.
~ To velja le pri pravokotni sili. Pri poševni je ročica $r \sin\varphi$, krajša od razdalje do prsta.
> Ročica je pravokotna razdalja od osi do nosilke sile, $d = r \sin\varphi$. Navor je $M = d \cdot F$.

? Štiri telesa z enako maso in polmerom spustimo hkrati z vrha istega klanca. Razvrsti jih od prvega do zadnjega na dnu.
1. kocka, ki drsi brez trenja
2. polna krogla, ki se kotali
3. poln valj, ki se kotali
4. tanek obroč, ki se kotali
> Kocka se ne vrti, zato gre vsa energija v premo gibanje. Pri kotaljenju gre del v vrtenje, tem večji, čim večji je $J/(m r^2)$: krogla $\frac{2}{5}$, valj $\frac{1}{2}$, obroč $1$.

? Gong iz primera 2 premaknemo bližje desnemu stojalu. Kaj se zgodi s silo levega stojala?
- Ostane enaka, saj se gong ni spremenil.
~ Teža gonga je enaka, spremenila pa se je njegova ročica glede na desno stojalo, zato se spremenita obe sili stojal.
+ Zmanjša se, desno stojalo prevzame večji del teže.
- Poveča se, ker je zdaj gong dlje od levega stojala.
~ Daljša ročica glede na levo stojalo poveča navor gonga okoli levega krajišča, ki ga mora uravnovesiti **desno** stojalo. Levo zato nosi manj.
> Z osjo v desnem krajišču: $F_L L = m_1 g\,(L - x_1) + m_2 g\,\frac{L}{2}$. Ko $x_1$ raste, se $F_L$ zmanjša.

? Na lahki palici glasbenega mobila visita dva zvonca, kot kaže risba. Vrvica je v osi O. Kolikšna mora biti masa $m$, da palica visi vodoravno?
:::risba skica
opis: Vodoravna lahka palica visi na vrvici v osi O. Levo, 0,40 m od osi, visi zvonec z maso 3,0 kg. Desno, 0,60 m od osi, visi zvonec z neznano maso m.
območje: 0; 0 .. 12; 5
enota: 25
črta: 1; 3,5 -> 11; 3,5 | debelo
črta: 5; 3,5 -> 5; 4,8
točka: 5; 3,5 | O | pod
črta: 1; 3,5 -> 1; 2
pravokotnik: 0,4; 1 .. 1,6; 2 | oranžna
napis: 1; 0,5 | 3,0 kg | pod
črta: 11; 3,5 -> 11; 2
pravokotnik: 10,4; 1 .. 11,6; 2 | modra
napis: 11; 0,5 | m | pod
napis: 3; 3,5 | 0,40 m | nad
napis: 8; 3,5 | 0,60 m | nad
:::
= 2,0 kg | 0,05
~ 4,5 | Obrnil si razmerje ročic. Zvonec na daljši ročici mora biti lažji, ne težji.
~ 3 | Enaki masi bi bili v ravnovesju le pri enakih ročicah.
> $3{,}0\,\mathrm{kg} \cdot g \cdot 0{,}40\,\mathrm{m} = m \cdot g \cdot 0{,}60\,\mathrm{m}$, zato $m = \dfrac{3{,}0 \cdot 0{,}40}{0{,}60} = 2{,}0\,\mathrm{kg}$.

? Bobnar vrti palico, na katere krajiščih sta kroglici z maso po $0{,}10\,\mathrm{kg}$. Palica je lahka, dolga $0{,}40\,\mathrm{m}$ in se vrti okoli svoje sredine. Kolikšen je vztrajnostni moment?
+ $0{,}008\,\mathrm{kg\,m^2}$
- $0{,}032\,\mathrm{kg\,m^2}$
~ Vstavil si dolžino palice $0{,}40\,\mathrm{m}$. Razdalja kroglice od osi je pol manjša, $0{,}20\,\mathrm{m}$.
- $0{,}04\,\mathrm{kg\,m^2}$
~ Pozabil si kvadrirati razdaljo: $J = \sum m_i r_i^2$, ne $\sum m_i r_i$.
- $0{,}004\,\mathrm{kg\,m^2}$
~ Upošteval si le eno kroglico. Vsaka prispeva svoj $m r^2$.
> $J = 2 \cdot 0{,}10\,\mathrm{kg} \cdot (0{,}20\,\mathrm{m})^2 = 0{,}008\,\mathrm{kg\,m^2}$.

<<RACUN
vrednost: 0.030*12 | 0.36
vrednost: 0.030*12*sin(30°) | 0.18
vrednost: 9.0*9.81 | 88.29
vrednost: 3.0*9.81 | 29.43
vrednost: (88.29*0.30+29.43*0.60)/1.20 | 36.79
vrednost: 9.0*9.81+3.0*9.81-36.79 | 80.93
vrednost: 10*9.81/(2*tan(70°)) | 17.85
vrednost: 1/(2*tan(70°)) | 0.182
vrednost: 0.5*1.5*0.15^2 | 0.016875
vrednost: 2*pi*(100/3)/60 | 3.491
vrednost: 0.050/0.016875 | 2.963
vrednost: 3.491/2.963 | 1.178
vrednost: (88.29*0.80+29.43*0.60)/1.20 | 73.575
vrednost: 117.72-73.575 | 44.145
vrednost: 3.0*0.40/0.60 | 2.0
vrednost: 2*0.10*0.20^2 | 0.008
>>

:::simboli
M | navor | M = r F \sin\varphi | N\,m | pozitiven v nasprotni smeri urnega kazalca
d | ročica | d = r \sin\varphi | m | pravokotna razdalja od osi do nosilke
F | sila | | N
r | razdalja od osi do prijemališča (pri telesih polmer) | | m
\varphi | kot med krilcem in silo | | °
J | vztrajnostni moment | J = \sum m_i r_i^2 | kg\,m^2
m_i | masa $i$-tega koščka telesa | | kg
r_i | razdalja $i$-tega koščka od osi | | m
\alpha | kotni pospešek | \alpha = \frac{M}{J} | rad/s^2
\omega | kotna hitrost | \omega = 2\pi n | rad/s
v | hitrost središča pri kotaljenju | v = \omega r | m/s
W_{vrt} | kinetična energija vrtenja | W_{vrt} = \frac{1}{2} J \omega^2 | J
F_L | sila levega stojala | F_L = (m_1 + m_2) g - F_D | N
F_D | sila desnega stojala | | N
m_1 | masa gonga | | kg
m_2 | masa droga | | kg
x_1 | razdalja gonga od levega krajišča | | m
L | dolžina droga oziroma kontrabasa | | m
g | težni pospešek | | m/s^2 | $9{,}81\,\mathrm{m/s^2}$
m | masa telesa | | kg
N_s | sila stene | N_s = \frac{m g}{2\tan\beta} | N | vodoravna, stena je gladka
N_t | sila tal (pravokotna) | N_t = m g | N
F_l | sila lepenja | F_l = N_s | N
k_l | koeficient lepenja | | –
\beta | kot kontrabasa s tlemi | | °
n | vrtilna frekvenca | | min^{-1} | obratov na minuto; za $\omega = 2\pi n$ jo pretvori v $\mathrm{s^{-1}}$
t | čas | t = \frac{\omega}{\alpha} | s
:::
