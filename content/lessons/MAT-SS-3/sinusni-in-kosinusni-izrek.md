---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nika igra golf. Od mesta udarca do zastavice je $150\,\mathrm{m}$. Udari močno, žoga preleti $120\,\mathrm{m}$, a jo bočni veter odnese: smer leta se od smeri proti zastavici razlikuje za $20^\circ$. Žoga obleži v travi. Kako daleč je zdaj od zastavice? Od tega je odvisno, katero palico Nika vzame za naslednji udarec.

Mesto udarca, žoga in zastavica tvorijo trikotnik. Nika pozna dve stranici in kot med njima. Pravega kota v tem trikotniku ni, zato Pitagorov izrek ne pomaga.

Za take trikotnike imamo dva izreka: **sinusni** in **kosinusni**. Z njima iz treh primernih podatkov izračunaš vse ostale stranice in kote. Temu pravimo **reševanje trikotnika**. Tako so geodeti izmerili višine gora, tako sodniki na regati določijo lego jadrnice. Nikino razdaljo dobimo v primeru 1.

## Razlaga

**Slika in oznake.** Nariši poljuben trikotnik z oglišči $A$, $B$ in $C$. Kot pri $A$ je $\alpha$, pri $B$ je $\beta$, pri $C$ je $\gamma$. Stranica nasproti oglišča $A$ je $a$, nasproti $B$ je $b$, nasproti $C$ je $c$.

Vsaka stranica ima tako »svoj« kot: tistega na drugi strani trikotnika. Stranico skupaj z njej nasprotnim kotom, na primer $a$ in $\alpha$, imenujemo **par**. Na parih stojita oba izreka.

**Višina razdeli trikotnik.** Iz oglišča $C$ spusti višino $v_c$ pravokotno na stranico $c$. Trikotnik razpade na dva pravokotna trikotnika. V obeh je višina kateta, ki leži nasproti kota ob stranici $c$. V levem je hipotenuza $b$, zato je $v_c = b\sin\alpha$. V desnem je hipotenuza $a$, zato je $v_c = a\sin\beta$.

Ista višina ima dva zapisa: $b\sin\alpha = a\sin\beta$. Ko obe strani deliš s $\sin\alpha\sin\beta$, dobiš $\dfrac{a}{\sin\alpha} = \dfrac{b}{\sin\beta}$. Z višino iz drugega oglišča isto pokažeš še za par $c$ in $\gamma$. Če je kateri kot top, pade višina zunaj trikotnika, sklep pa ostane enak, ker je $\sin(180^\circ - \alpha) = \sin\alpha$.

To je **sinusni izrek**:

$$\frac{a}{\sin\alpha} = \frac{b}{\sin\beta} = \frac{c}{\sin\gamma} = 2R$$

Razmerje med stranico in sinusom nasprotnega kota je v vsem trikotniku isto število. To število je enako premeru $2R$ trikotniku **očrtane krožnice** (krožnice skozi vsa tri oglišča). Ker sta dva kota trikotnika skupaj manj kot $180^\circ$, ima večji kot tudi večji sinus. Zato večjemu kotu leži nasproti daljša stranica.

**Kadar para ni.** Nika pozna $a$, $b$ in kot $\gamma$ med njima. Nobena znana stranica nima znanega nasprotnega kota, zato sinusni izrek nima kje začeti. Tu pomaga **kosinusni izrek**:

$$c^2 = a^2 + b^2 - 2ab\cos\gamma$$

Predstavljaj si šestilo s krakoma dolžin $a$ in $b$. Kot $\gamma$ je odprtost šestila, $c$ je razdalja med konicama. Pri pravem kotu je $c^2 = a^2 + b^2$, kar je Pitagorov izrek. Člen $-2ab\cos\gamma$ je popravek, ko kot ni pravi.

:::premisli
Napovej, preden računaš: kraka sta $a = 3$ in $b = 4$. Pri $\gamma = 90^\circ$ je $c = 5$. Bo pri $\gamma = 120^\circ$ stranica $c$ daljša ali krajša od $5$? Zakaj?
---
Daljša. Ker je $\cos 120^\circ = -0{,}5$, je popravek $-2 \cdot 3 \cdot 4 \cdot (-0{,}5) = +12$. Zato je $c^2 = 25 + 12 = 37$ in $c \approx 6{,}1$. Bolj odprto šestilo, bolj oddaljeni konici.
:::

Kako predznak kosinusa spremeni popravek:

| kot $\gamma$ | $\cos\gamma$ | primerjava |
|---|---|---|
| oster | pozitiven | $c^2 < a^2 + b^2$ |
| pravi | $0$ | $c^2 = a^2 + b^2$ |
| top | negativen | $c^2 > a^2 + b^2$ |

Izrek velja za vsako stranico; črke le zamenjaš: $a^2 = b^2 + c^2 - 2bc\cos\alpha$. Če poznaš vse tri stranice, ga preoblikuješ za kot: $\cos\gamma = \dfrac{a^2 + b^2 - c^2}{2ab}$.

**Kateri izrek izbrati.** Odloči se po tem, kaj poznaš:

| poznaš | začni s | opomba |
|---|---|---|
| tri stranice | kosinusnim | kot iz $\cos$ |
| dve stranici in kot med njima | kosinusnim | najprej tretja stranica |
| stranico in dva kota | sinusnim | tretji kot iz $180^\circ$ |
| dve stranici in kot nasproti ene | sinusnim | lahko sta dve rešitvi |

**Past pri sinusu.** Kadar s sinusnim izrekom iščeš kot, dobiš njegov sinus. Iz lekcije o trigonometrijskih enačbah veš, da ima $\sin x = 0{,}9$ med $0^\circ$ in $180^\circ$ dve rešitvi: $x \approx 64{,}2^\circ$ in $x \approx 115{,}8^\circ$. Kalkulator pokaže le prvo. Trikotnik lahko obstaja z obema kotoma, le z enim ali z nobenim. Zato za vsakega kandidata preveri, ali je njegova vsota z znanim kotom manjša od $180^\circ$.

Varna bližnjica: top kot leži lahko le nasproti najdaljše stranice. Kot nasproti krajše stranice je zagotovo oster, zato ga s sinusom izračunaš brez skrbi.

:::premisli
Zakaj kosinusni izrek te pasti nima, ko z njim iščeš kot?
---
Med $0^\circ$ in $180^\circ$ ima vsak kot drugačen kosinus. Topi koti imajo negativen kosinus, ostri pozitiven. Iz $\cos\gamma$ zato dobiš natanko en kot.
:::

V simulaciji spodaj »Sinusni in kosinusni izrek« vleci oglišče $C$, dokler kot $\gamma$ ne postane pravi. Opazuj, kako člen s kosinusom izgine in ostane Pitagorov izrek. Nato naredi $\gamma$ top in poglej, ali je $c^2$ večji ali manjši od $a^2 + b^2$. Ves čas preverjaj tudi, da so vsa tri razmerja sinusnega izreka enaka.

## Rešeni primeri

### Primer 1: Nikina žoga

Od mesta udarca do zastavice je $150\,\mathrm{m}$. Žoga preleti $120\,\mathrm{m}$, smer leta pa od smeri proti zastavici odstopa za $20^\circ$. Kako daleč je žoga od zastavice?

**Podatki:** $b = 150\,\mathrm{m}$ (do zastavice), $a = 120\,\mathrm{m}$ (let žoge), $\gamma = 20^\circ$ (kot med smerema)
**Iščemo:** razdaljo $c$ med žogo in zastavico

:::formula
$c^2 = a^2 + b^2 - 2ab\cos\gamma$
:::

**Rešitev:**

1. Znani sta dve stranici in kot med njima, zato izberemo kosinusni izrek.
2. Kvadrata: $a^2 = 14400\,\mathrm{m^2}$, $b^2 = 22500\,\mathrm{m^2}$. Še $2ab = 36000\,\mathrm{m^2}$.
3. Ker je $\cos 20^\circ \approx 0{,}9397$, je popravek $2ab\cos\gamma \approx 33829\,\mathrm{m^2}$.
4. $c^2 \approx 14400 + 22500 - 33829 = 3071$, torej $c^2 \approx 3071\,\mathrm{m^2}$.
5. Korenimo: $c \approx 55{,}4\,\mathrm{m}$.
6. Odgovor: žoga je približno $55\,\mathrm{m}$ od zastavice. Brez odstopanja bi ji ostalo le $30\,\mathrm{m}$.

### Primer 2: Jadrnica med bojama

Sodnika na regati stojita na bojah $A$ in $B$, ki sta $400\,\mathrm{m}$ narazen. Sodnik na $A$ vidi jadrnico $C$ pod kotom $52^\circ$ glede na daljico $AB$, sodnik na $B$ pod kotom $71^\circ$. Kako daleč je jadrnica od vsake boje?

**Podatki:** $c = 400\,\mathrm{m}$, $\alpha = 52^\circ$, $\beta = 71^\circ$
**Iščemo:** razdalji $b = AC$ in $a = BC$

:::formula
$\gamma = 180^\circ - \alpha - \beta$, nato $\dfrac{a}{\sin\alpha} = \dfrac{b}{\sin\beta} = \dfrac{c}{\sin\gamma}$
:::

**Rešitev:**

1. Tretji kot: $\gamma = 180^\circ - 52^\circ - 71^\circ = 57^\circ$. Zdaj imamo cel par $c$ in $\gamma$.
2. Skupno razmerje: $\dfrac{c}{\sin\gamma} = \dfrac{400\,\mathrm{m}}{\sin 57^\circ} \approx 476{,}9\,\mathrm{m}$.
3. Stranica $b$ leži nasproti $\beta$, zato $b = \dfrac{c}{\sin\gamma} \cdot \sin\beta \approx 476{,}9\,\mathrm{m} \cdot \sin 71^\circ \approx 451{,}0\,\mathrm{m}$.
4. Stranica $a$ leži nasproti $\alpha$: $a \approx 476{,}9\,\mathrm{m} \cdot \sin 52^\circ \approx 375{,}8\,\mathrm{m}$.
5. Kontrola: največji kot $\beta$ ima nasproti najdaljšo stranico $b$. Ujema se.
6. Odgovor: jadrnica je približno $451\,\mathrm{m}$ od boje $A$ in $376\,\mathrm{m}$ od boje $B$.

### Primer 3: Strelni kot (dva koraka)

Nogometaš $P$ stoji malo zunaj kazenskega prostora. Do bližje vratnice $L$ ima $18\,\mathrm{m}$, do daljne vratnice $D$ pa $20\,\mathrm{m}$. Vrata so široka $7{,}32\,\mathrm{m}$. Pod kolikšnim kotom $\varphi$ vidi vrata? Kolikšna sta kota $\delta$ in $\lambda$ trikotnika pri vratnicah $D$ in $L$?

**Podatki:** $d = PL = 18\,\mathrm{m}$ (nasproti $D$), $l = PD = 20\,\mathrm{m}$ (nasproti $L$), $p = LD = 7{,}32\,\mathrm{m}$ (nasproti $P$)
**Iščemo:** kote $\varphi$, $\delta$ in $\lambda$

:::formula
$\cos\varphi = \dfrac{l^2 + d^2 - p^2}{2ld}$
nato $\sin\delta = \dfrac{d\sin\varphi}{p}$ in $\lambda = 180^\circ - \varphi - \delta$
:::

**Rešitev:**

1. Znane so tri stranice, zato kot $\varphi$ dobimo s kosinusnim izrekom.
2. $l^2 = 400\,\mathrm{m^2}$; $d^2 = 324\,\mathrm{m^2}$; $p^2 \approx 53{,}58\,\mathrm{m^2}$; $2ld = 720\,\mathrm{m^2}$.
3. $\cos\varphi \approx \dfrac{400 + 324 - 53{,}58}{720} \approx 0{,}9311$, zato je $\varphi \approx 21{,}4^\circ$.
4. Drugi kot izberemo premišljeno. Kot $\delta$ leži nasproti $d = 18\,\mathrm{m}$, ki ni najdaljša stranica, zato je $\delta$ zagotovo oster.
5. Iz sinusnega izreka (z nezaokroženim $\varphi$): $\sin\delta = \dfrac{18\,\mathrm{m} \cdot \sin\varphi}{7{,}32\,\mathrm{m}} \approx 0{,}8967$, zato je $\delta \approx 63{,}7^\circ$.
6. Tretji kot: $\lambda \approx 180^\circ - 21{,}4^\circ - 63{,}7^\circ = 94{,}9^\circ$. Je top in leži nasproti najdaljše stranice $l$, kot mora.
7. Odgovor: strelni kot je približno $21{,}4^\circ$, kota pri vratnicah pa sta približno $63{,}7^\circ$ (pri $D$) in $94{,}9^\circ$ (pri $L$).

Če bi s sinusom računal kot $\lambda$, bi kalkulator vrnil $85{,}1^\circ$. Enačba za sinus ima dve rešitvi in kalkulator vrne napačno: pravi kot je $180^\circ - 85{,}1^\circ = 94{,}9^\circ$.

### Primer 4 – zdaj ti

Orientacijska proga ima start $S$ in kontrolni točki $K_1$ in $K_2$. Velja $SK_1 = 2{,}4\,\mathrm{km}$, $K_1K_2 = 3{,}1\,\mathrm{km}$ in $K_2S = 3{,}5\,\mathrm{km}$. Kolikšen je največji kot trikotnika?

**Podatki:** $x = SK_1 = 2{,}4\,\mathrm{km}$, $y = K_1K_2 = 3{,}1\,\mathrm{km}$, $z = K_2S = 3{,}5\,\mathrm{km}$
**Iščemo:** največji kot $\kappa$

:::formula
$\cos\kappa = \dfrac{x^2 + y^2 - z^2}{2xy}$
:::

**Rešitev:**

1. Največji kot leži nasproti najdaljše stranice $z = 3{,}5\,\mathrm{km}$, torej pri točki $K_1$, med stranicama $x$ in $y$.
2. Kvadrati: $2{,}4^2 = 5{,}76$; $3{,}1^2 = 9{,}61$; $3{,}5^2 = 12{,}25$. Imenovalec: $2 \cdot 2{,}4 \cdot 3{,}1 = 14{,}88$.
3. Izračunaj $\cos\kappa$ in nato $\kappa$, potem preveri:

:::premisli
Koliko sta $\cos\kappa$ in $\kappa$?
---
$\cos\kappa = \dfrac{5{,}76 + 9{,}61 - 12{,}25}{14{,}88} = \dfrac{3{,}12}{14{,}88} \approx 0{,}2097$, zato je $\kappa \approx 77{,}9^\circ$. Kosinus je pozitiven, zato je tudi največji kot oster.
:::

## Pogoste napake

- **Stranica z napačnim kotom.** V sinusnem izreku nekdo zapiše $\dfrac{a}{\sin\beta}$, ker sta $a$ in $\beta$ »blizu« na sliki. Izrek velja le za pare: stranica in kot, ki ji leži *nasproti*. Pred računanjem na sliki poveži vsako stranico z nasprotnim ogliščem.
- **Ena rešitev iz arkus sinusa.** Kalkulator za $\sin\alpha = 0{,}9$ vrne $64{,}2^\circ$, top kot $115{,}8^\circ$ pa izpustiš. Sinus je za kota $x$ in $180^\circ - x$ enak. Preveri oba kandidata ali pa računaj kot nasproti krajše stranice.
- **Napačen vrstni red računanja.** Računaš $(a^2 + b^2 - 2ab) \cdot \cos\gamma$. Kosinus pripada le popravku: najprej izračunaj $2ab\cos\gamma$, nato ga odštej od $a^2 + b^2$.
- **Kot zavoja namesto notranjega kota.** Tekač se obrne za $50^\circ$, a notranji kot trikotnika je $180^\circ - 50^\circ = 130^\circ$. V izrek gre kot *med stranicama*, zato si pot vedno nariši.
- **Pozabljen koren.** Kosinusni izrek da $c^2$, ne $c$. Rezultat $c^2 = 39$ pomeni $c \approx 6{,}24$.

## Povzetek

- Stranico in nasprotni kot imenujemo par; oznake $a$–$\alpha$, $b$–$\beta$, $c$–$\gamma$.
- Sinusni izrek: $\dfrac{a}{\sin\alpha} = \dfrac{b}{\sin\beta} = \dfrac{c}{\sin\gamma} = 2R$. Uporabiš ga, ko poznaš vsaj en cel par.
- Kosinusni izrek: $c^2 = a^2 + b^2 - 2ab\cos\gamma$. Uporabiš ga pri treh stranicah ali dveh stranicah z vmesnim kotom.
- Pri $\gamma = 90^\circ$ preide v Pitagorov izrek; pri topem $\gamma$ je $c^2 > a^2 + b^2$.
- Kot iz sinusa ima lahko dve vrednosti, $x$ in $180^\circ - x$. Kot iz kosinusa je en sam.
- Nasproti največjega kota leži najdaljša stranica; top kot je lahko le tam.

## Drugače: Z analogijo

**Kosinusni izrek je šestilo.** Kraka šestila imata stalni dolžini $a$ in $b$. Ko šestilo zapiraš, se konici bližata; ko ga odpiraš, se oddaljujeta. Pri pravem kotu je razdalja točno takšna, kot jo da Pitagorov izrek. Člen $-2ab\cos\gamma$ pove, koliko »zapiranje« pod $90^\circ$ odvzame ali »odpiranje« čez $90^\circ$ doda.

**Sinusni izrek je menjalni tečaj.** Predstavljaj si, da vsak kot »plača« za svojo nasprotno stranico. Cena je v vsem trikotniku ista: za vsako enoto sinusa dobiš $2R$ dolžine. Ko poznaš tečaj iz enega para, preračunaš vse druge: stranica je sinus kota, pomnožen s tečajem. Zato potrebuješ vsaj en par: brez njega tečaja ne poznaš.

## Drugače: Iz vsakdanjega življenja

**Sistem Hawk-Eye** pri tenisu ugotavlja, ali je žoga padla v polje. Žogo hkrati snema več kamer na znanih mestih. Razdalja med dvema kamerama je znana, kota, pod katerima vsaka vidi žogo, pa izmerita kameri. To je natanko primer 2: stranica in dva kota, nato sinusni izrek. Takemu merjenju pravimo **triangulacija**.

**Prečkanje reke.** Širine reke ne moreš izmeriti s trakom. Ob bregu odmeriš daljico, na primer $50\,\mathrm{m}$, in z obeh koncev izmeriš kot proti drevesu na drugem bregu. Sinusni izrek da razdaljo do drevesa.

**Ko je znan vmesni kot,** na primer pri jadranju: jadrnica pluje $2\,\mathrm{km}$ v eno smer, nato zavije in pluje še $3\,\mathrm{km}$. Iz kota zavoja dobiš notranji kot, kosinusni izrek pa razdaljo od starta.

## Preveri se

? Pri treh od teh naborov podatkov lahko reševanje trikotnika začneš s sinusnim izrekom. Kateri nabor ne spada zraven?
- $a$, $\alpha$, $\beta$
~ Tu imaš cel par $a$ in $\alpha$, zato sinusni izrek takoj da $b$.
- $b$, $c$, $\beta$
~ Tudi tu je cel par, $b$ in $\beta$. Rešitvi sta lahko dve, a začneš s sinusnim izrekom.
+ $a$, $b$, $\gamma$
- $c$, $\alpha$, $\gamma$
~ Par $c$ in $\gamma$ je znan, zato sinusni izrek deluje.
> Kot $\gamma$ leži med stranicama $a$ in $b$, nobena znana stranica pa nima znanega nasprotnega kota. Tu začneš s kosinusnim izrekom.

? Stranici $a$ in $b$ ostaneta enaki, kot $\gamma$ med njima pa povečamo s $60^\circ$ na $120^\circ$. Kaj se zgodi s stranico $c$?
- Ostane enaka, ker je $\sin 60^\circ = \sin 120^\circ$.
~ Enaka sta sinusa, a v kosinusnem izreku nastopa kosinus. $\cos 60^\circ = 0{,}5$, $\cos 120^\circ = -0{,}5$.
- Skrajša se, ker je kosinus negativen in zato odštejemo manj.
~ Ko je kosinus negativen, je $-2ab\cos\gamma$ pozitiven. Ne odštejemo manj, ampak prištejemo.
+ Podaljša se, ker postane $\cos\gamma$ negativen in se popravek prišteje.
- Podvoji se, ker se je kot podvojil.
~ Stranica ni sorazmerna s kotom. Spreminja se po kosinusnem izreku, ne linearno.
> Pri $\gamma = 120^\circ$ je $\cos\gamma < 0$, zato je $c^2 = a^2 + b^2 + 2ab \cdot 0{,}5$, kar je več kot pri $60^\circ$. Šestilo je bolj odprto, konici sta dlje.

? V trikotniku je $a = 5\,\mathrm{cm}$, $b = 7\,\mathrm{cm}$ in $\gamma = 60^\circ$. Koliko meri $c$?
- $8{,}60\,\mathrm{cm}$
~ To je $\sqrt{25 + 49}$, Pitagorov izrek. Trikotnik ni pravokoten, zato manjka popravek $-2ab\cos\gamma$.
+ $6{,}24\,\mathrm{cm}$
- $10{,}44\,\mathrm{cm}$
~ Tako dobiš, če popravek prišteješ: $\sqrt{74 + 35}$. Pri ostrem kotu se popravek odšteje.
- $39\,\mathrm{cm}$
~ To je $c^2$. Na koncu moraš še koreniti.
> $c^2 = 25 + 49 - 2 \cdot 5 \cdot 7 \cdot 0{,}5 = 39$, torej $c = \sqrt{39}\,\mathrm{cm} \approx 6{,}24\,\mathrm{cm}$.

? Luka išče kot $\alpha$ v trikotniku z $a = 9\,\mathrm{cm}$, $b = 5\,\mathrm{cm}$ in $\beta = 30^\circ$. Korak 1: $\dfrac{a}{\sin\alpha} = \dfrac{b}{\sin\beta}$. Korak 2: $\sin\alpha = \dfrac{9 \cdot 0{,}5}{5} = 0{,}9$. Korak 3: $\alpha \approx 64{,}2^\circ$, in to je edina rešitev. Kateri korak je napačen?
- Korak 1
~ Para $a$–$\alpha$ in $b$–$\beta$ sta pravilno sestavljena, izrek je zapisan prav.
- Korak 2
~ Račun je pravilen: $\sin 30^\circ = 0{,}5$ in $9 \cdot 0{,}5 : 5 = 0{,}9$.
+ Korak 3
- Vsi koraki so pravilni.
~ Kalkulator da le ostri kot. Preveriti je treba še $180^\circ - 64{,}2^\circ$.
> Tudi $\alpha \approx 115{,}8^\circ$ ima sinus $0{,}9$, s $\beta = 30^\circ$ pa je vsota še pod $180^\circ$ ($\gamma \approx 34{,}2^\circ$). Trikotnika sta dva.

? Smučarski tekač preteče $3\,\mathrm{km}$ proti vzhodu, nato zavije za $50^\circ$ v levo in preteče še $2\,\mathrm{km}$. Kako daleč je od starta?
- $2{,}30\,\mathrm{km}$
~ Tako dobiš, če v izrek vstaviš kot zavoja $50^\circ$. Notranji kot med odsekoma je $130^\circ$.
- $5\,\mathrm{km}$
~ To bi veljalo le, če bi tekel naravnost. Zaradi zavoja je razdalja krajša od vsote odsekov.
+ $4{,}55\,\mathrm{km}$
- $3{,}61\,\mathrm{km}$
~ To je $\sqrt{9 + 4}$, Pitagorov izrek. Velja le za zavoj za $90^\circ$.
> Notranji kot je $180^\circ - 50^\circ = 130^\circ$. Torej $d^2 = 9 + 4 - 12\cos 130^\circ \approx 20{,}71$ in $d \approx 4{,}55\,\mathrm{km}$.

:::simboli
a, b, c | stranice trikotnika | | | $a$ leži nasproti oglišča $A$ itd.
\alpha, \beta, \gamma | notranji koti trikotnika | | ° | kot pri ogliščih $A$, $B$, $C$
R | polmer očrtane krožnice | 2R = \frac{a}{\sin\alpha} | | krožnica gre skozi vsa tri oglišča
v_c | višina na stranico $c$ | v_c = b\sin\alpha = a\sin\beta | |
\varphi | strelni kot pri igralcu $P$ | \cos\varphi = \frac{l^2 + d^2 - p^2}{2ld} | ° |
\delta | kot pri daljni vratnici $D$ | \sin\delta = \frac{d\sin\varphi}{p} | ° |
\lambda | kot pri bližji vratnici $L$ | \lambda = 180^\circ - \varphi - \delta | ° |
d | razdalja igralca do bližje vratnice | | m | stranica nasproti $D$
l | razdalja igralca do daljne vratnice | | m | stranica nasproti $L$
p | širina vrat | | m | stranica nasproti $P$
\kappa | največji kot orientacijske proge | \cos\kappa = \frac{x^2 + y^2 - z^2}{2xy} | ° | pri točki $K_1$
x | odsek od starta $S$ do $K_1$ | | km |
y | odsek od $K_1$ do $K_2$ | | km |
z | odsek od $K_2$ nazaj do $S$ | | km | najdaljša stranica
:::
