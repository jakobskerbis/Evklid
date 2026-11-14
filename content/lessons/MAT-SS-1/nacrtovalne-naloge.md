---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nika načrtuje pohod. Na zemljevidu v merilu $1 : 100\,000$ (1 cm na zemljevidu je 1 km v naravi) sta vas $A$ in razgledna točka $B$, oddaljeni 6 km. Iz vasi vodi ravna gozdna pot, ki z zveznico $AB$ oklepa kot $30^\circ$. Ob poti stoji koča $C$. Smerokaz pri $B$ pravi, da je do koče 4 km zračne črte, na zemljevidu pa koče ni.

»Tri podatke imam, torej je koča na enem samem mestu,« si reče Nika. Nariše $AB = 6\,\mathrm{cm}$, v $A$ kot $30^\circ$ in iz $B$ krožnico s polmerom 4 cm. Ta pa pot preseka **dvakrat**! Koča je lahko približno 2,6 km ali 7,8 km od vasi.

Pri načrtovalni nalogi iz danih podatkov z ravnilom in šestilom načrtaš lik in premisliš, koliko takih likov obstaja. Na maturi jo rešuješ na papirju z geometrijskim orodjem.

## Razlaga

**1. Trije podatki, en trikotnik?** Mamljivo je misliti, da trije podatki vedno določijo natanko en trikotnik. Izreki o skladnosti (SSS, SKS, KSK, SsK) pa veljajo le za določene nabore. Nika je imela dve stranici in kot nasproti *krajše* od njiju ($4 < 6$). SsK zahteva kot nasproti daljše, zato sta lahko dve rešitvi, ena ali nobena. Zato vsako načrtovalno nalogo končaš z **diskusijo**.

**2. Štirje koraki.** Popolna rešitev ima štiri dele. Na maturi jih pričakujejo vse štiri.

1. **Skica z danimi podatki (analiza).** Prostoročno nariši lik, kot da je že narejen. Dane podatke označi (z oznako ali krepko, ne samo z barvo). Poišči del, ki ga lahko narišeš takoj, in premisli, kje leži manjkajoče oglišče.
2. **Opis načrtovanja.** Kratki koraki s simboli, na primer: »$AB = c$; kot $\alpha$ v $A$; $k(B, a)$ seka krak v $C$.« $k(B, a)$ je krožnica s središčem $B$ in polmerom $a$.
3. **Načrtovanje.** Natančen načrt z ravnilom in šestilom. Konstrukcijskih črt in lokov ne brišeš.
4. **Diskusija.** Koliko rešitev ima naloga in pri katerih podatkih rešitve ni.

**3. Osnovne konstrukcije.** Iz osnovne šole znaš načrtati simetralo daljice in kota, pravokotnico in vzporednico. Kot $60^\circ$ je kot enakostraničnega trikotnika: iz vrha $V$ zariši lok, ki seka krak v $P$, in z istim polmerom lok iz $P$, ki prvega seka v $Q$; $VQ$ je drugi krak. Simetrala kota ga razpolovi: iz $60^\circ$ dobiš $30^\circ$, iz $30^\circ$ pa $15^\circ$. Pravokotnica da $90^\circ$, njena simetrala $45^\circ$, dva kota po $60^\circ$ pa $120^\circ$.

:::premisli
Kako bi z ravnilom in šestilom načrtal kot $75^\circ$? Najprej poišči dva kota, ki ju že znaš.
---
Na primer $75^\circ = 60^\circ + 15^\circ$: načrtaj $60^\circ$, ob njegovem kraku pa še $15^\circ$ (polovica od $30^\circ$). Gre tudi $45^\circ + 30^\circ$ ali $90^\circ - 15^\circ$.
:::

**4. Kje leži manjkajoče oglišče?** Pri trikotniku pogosto najprej narišeš $AB = c$. Oglišče $C$ je nato presečišče dveh množic točk, ki ustrezata danima podatkoma:

| Dani podatek | Točka $C$ leži na |
|---|---|
| stranica $a = \lvert BC \rvert$ | krožnici $k(B, a)$ |
| stranica $b = \lvert AC \rvert$ | krožnici $k(A, b)$ |
| kot $\alpha$ | kraku kota $\alpha$ z vrhom $A$ |
| višina $v_c$ | vzporednici z $AB$ na razdalji $v_c$ |
| težiščnica $t_c$ | krožnici s središčem v razpolovišču $AB$ in polmerom $t_c$ |
| polmer $R$ očrtanega kroga | krožnici s polmerom $R$, ki ima središče na simetrali $AB$ in gre skozi $A$ |

**5. Diskusija.** Vrnimo se k Niki: $c = 6\,\mathrm{cm}$, $\alpha = 30^\circ$, $a$ spreminjamo. Naj bo $D$ nožišče pravokotnice iz $B$ na krak. Trikotnik $ABD$ (kota $30^\circ$ in $90^\circ$) je polovica enakostraničnega trikotnika s stranico $c$, zato je razdalja $d = |BD| = \frac{c}{2} = 3\,\mathrm{cm}$.

:::risba graf
opis: Daljica AB dolžine 6 cm leži na osi x, A je v izhodišču, B v točki (6, 0). Iz A gre krak kota 30 stopinj. Črtkana krožnica ima središče B in polmer a = {a} cm. Njena presečišča s krakom sta možni legi oglišča C, označeni s C₁ in C₂. V aplikaciji a spreminjaš z drsnikom od 1 do 7.
x: -2 .. 14
y: -7 .. 8
enako: da
drsnik: a | 1 .. 7 | 0,5 | 4 | dolžina a v cm
f: x/sqrt(3) | modra | 0 .. 13
črta: 0; 0 -> 6; 0 | debelo
krog: 6; 0 | a | oranžna črtkano
točka: 0; 0 | A | pod levo
točka: 6; 0 | B | pod
točka: (3*sqrt(3) - sqrt(a^2 - 9))*sqrt(3)/2 + 0*sqrt(3*sqrt(3) - sqrt(a^2 - 9) - 0.001); (3*sqrt(3) - sqrt(a^2 - 9))/2 | C_1 | nad levo
točka: (3*sqrt(3) + sqrt(a^2 - 9))*sqrt(3)/2 + 0*sqrt(sqrt(a^2 - 9) - 0.001); (3*sqrt(3) + sqrt(a^2 - 9))/2 | C_2 | nad levo
podnapis: Krožnica k(B, a) in krak kota 30° pri a = {a} cm
:::

Štej presečišča krožnice s krakom:

- $a < 3\,\mathrm{cm}$: krožnica kraka ne doseže, rešitve ni;
- $a = 3\,\mathrm{cm}$: ena rešitev;
- $3\,\mathrm{cm} < a < 6\,\mathrm{cm}$: dve rešitvi (Nikin primer);
- $a \ge 6\,\mathrm{cm}$: ena rešitev, saj drugo presečišče ni več na kraku (pri $a = 6\,\mathrm{cm}$ je to točka $A$).

Drugi nabori imajo svoje pogoje. Pri SSS mora veljati trikotniška neenakost $|a - b| < c < a + b$. Pri KSK mora biti $\alpha + \beta < 180^\circ$. SKS ima pri vsakem kotu med $0^\circ$ in $180^\circ$ natanko eno rešitev.

:::premisli
Kakšen trikotnik dobiš pri $a = 3\,\mathrm{cm}$? Zakaj je rešitev samo ena?
---
Krožnica $k(B, 3\,\mathrm{cm})$ se kraka le dotakne, in to v nožišču $D$. Zato je $C = D$ in kot pri $C$ je pravi: presečišči sta se zlili v eno.
:::

V simulaciji spodaj (»Načrtovanje trikotnikov in štirikotnikov«) izberi trikotnik iz treh stranic. Nastavi $a = 3$, $b = 3$ in $c = 7$ (cm) in pojdi do zadnjega koraka. Opazi, da se loka ne sekata, ker je $3 + 3 < 7$.

**6. Programi za dinamično geometrijo (višja raven).** V brezplačnem programu GeoGebra načrtuješ z orodji, ki posnemajo ravnilo in šestilo: daljica z dano dolžino, krožnica s središčem in polmerom, kot z dano velikostjo, vzporednica, pravokotnica, presečišče. Program si zapomni, kako je vsaka točka nastala: ko povlečeš prosto točko, se vse, kar je iz nje načrtano, premakne z njo in lastnosti ostanejo. To je **test vlečenja**: dobro načrtan kvadrat ostane kvadrat, kvadrat, narisan na oko, razpade. Število rešitev preveriš z drsnikom za dolžino $a$: opazuj, kdaj presečišča izginejo ali se zlijejo, kot na risbi zgoraj.

## Rešeni primeri

### Primer 1 (lažji): dve cesti na zemljevidu

Iz križišča $C$ vodita dve ravni cesti, ki oklepata kot $60^\circ$. Ob eni je 5 km od križišča mesto $B$, ob drugi 4 km od križišča vas $A$. Načrtaj trikotnik $ABC$ na zemljevidu v merilu $1 : 100\,000$ in ugotovi, kako daleč sta $A$ in $B$ narazen.

**Podatki:** $a = |BC| = 5\,\mathrm{km}$, $b = |AC| = 4\,\mathrm{km}$, $\gamma = 60^\circ$, merilo $1 : 100\,000$ (1 cm ustreza 1 km)
**Iščemo:** načrt trikotnika $ABC$ in razdaljo $c = |AB|$

:::formula
SKS: kot $\gamma$ z vrhom $C$, na kraka naneseš $a$ in $b$. Preizkus s Pitagorovim izrekom.
:::

**Rešitev:**

1. Skica: kot $\gamma$ leži med danima stranicama, torej gre za SKS. Na zemljevidu je $a = 5\,\mathrm{cm}$, $b = 4\,\mathrm{cm}$.
2. Opis: kot $\gamma = 60^\circ$ z vrhom $C$; $k(C, 5\,\mathrm{cm})$ seka prvi krak v $B$; $k(C, 4\,\mathrm{cm})$ seka drugi krak v $A$; nariši $AB$.
3. Načrt je na risbi spodaj. Izmeriš $|AB| \approx 4{,}6\,\mathrm{cm}$.
4. Diskusija: pri SKS je rešitev vedno natanko ena.
5. Preizkus z računom: pravokotnica iz $A$ na $CB$ odreže polovico enakostraničnega trikotnika s stranico 4 cm. Nožišče je 2 cm od $C$, višina je $\frac{4\sqrt{3}}{2} = 2\sqrt{3} \approx 3{,}46\,\mathrm{cm}$. Do $B$ ostane $5 - 2 = 3\,\mathrm{cm}$, zato je $c = \sqrt{3^2 + (2\sqrt{3})^2} = \sqrt{21} \approx 4{,}58\,\mathrm{cm}$.
6. Odgovor: mesto in vas sta narazen približno 4,6 km.

:::risba skica
opis: Kot 60 stopinj z vrhom C, načrtan z lokom iz C, ki seka prvi krak v P, in enakim lokom iz P, ki ga seka v Q; drugi krak gre skozi Q. Na prvem kraku je B 5 cm od C, na drugem A 4 cm od C.
območje: -0,6; -1 .. 5,8; 4,4
enota: 45
črta: 0; 0 -> 5,6; 0 | siva
črta: 0; 0 -> 2,3; 3,98 | siva
črta: 1,49; -0,13 -> 1,49; 0,13 -> 1,45; 0,39 -> 1,36; 0,63 -> 1,23; 0,86 -> 1,06; 1,06 -> 0,86; 1,23 -> 0,63; 1,36 -> 0,39; 1,45 | siva črtkano
črta: 1,11; 1,45 -> 0,93; 1,39 -> 0,75; 1,3 -> 0,59; 1,19 -> 0,44; 1,06 | siva črtkano
črta: 4,95; -0,7 -> 4,99; -0,35 -> 5; 0 -> 4,99; 0,35 -> 4,95; 0,7 | oranžna črtkano
črta: 2,46; 3,15 -> 2,24; 3,32 -> 2; 3,46 -> 1,75; 3,6 -> 1,5; 3,71 | oranžna črtkano
lik: 0; 0 -> 5; 0 -> 2; 3,46 | modra
točka: 0; 0 | C | pod levo
točka: 5; 0 | B | pod desno
točka: 2; 3,46 | A | levo
točka: 1,5; 0 | P | pod
točka: 0,75; 1,3 | Q | levo
napis: 2,3; 0,5 | 60° | sredina
:::

### Primer 2: trikotnik z višino

Načrtaj trikotnik $ABC$, za katerega je $c = 7\,\mathrm{cm}$, $v_c = 4\,\mathrm{cm}$ in $\alpha = 45^\circ$.

**Podatki:** $c = 7\,\mathrm{cm}$, $v_c = 4\,\mathrm{cm}$, $\alpha = 45^\circ$
**Iščemo:** načrt trikotnika $ABC$ in število rešitev

:::formula
$C$ je presečišče kraka kota $\alpha$ in vzporednice $p$ z $AB$ na razdalji $v_c$.
:::

**Rešitev:**

1. Skica: $v_c$ ni stranica, ampak razdalja točke $C$ od nosilke $AB$. Zato $C$ leži na vzporednici $p$ z $AB$, ki je od nje oddaljena 4 cm.
2. Opis: $AB = 7\,\mathrm{cm}$; v $A$ pravokotnica na $AB$, simetrala tega pravega kota je krak kota $45^\circ$; na pravokotnico od $A$ naneseš 4 cm in skozi to točko narišeš $p \parallel AB$; $C$ je presečišče kraka in $p$; nariši $BC$.
3. Načrt je na risbi. Pri $\alpha = 45^\circ$ sta kateti enaki, zato je nožišče višine 4 cm od $A$.
4. Diskusija: krak kota $45^\circ$ ni vzporeden s $p$, zato ga seka v eni točki. Rešitev je ena (trikotnik na drugi strani $AB$ je z njim skladen).

:::risba skica
opis: Daljica AB dolžine 7 cm. Iz A gre krak kota 45 stopinj. Črtkana premica p je vzporedna z AB na razdalji 4 cm. Krak seka p v točki C(4, 4). Črtkana višina iz C pade pravokotno na AB, 4 cm od A.
območje: -0,8; -0,8 .. 8; 5,8
enota: 35
črta: -0,5; 4 -> 8; 4 | siva črtkano
črta: 0; 0 -> 5,3; 5,3 | siva
lik: 0; 0 -> 7; 0 -> 4; 4 | modra
črta: 4; 4 -> 4; 0 | oranžna črtkano
pravikot: 4; 0 | 7; 0 | 4; 4
točka: 0; 0 | A | pod levo
točka: 7; 0 | B | pod
točka: 4; 4 | C | nad levo
napis: 7,8; 4 | p | nad
napis: 4,1; 2 | v_c = 4 | desno
napis: 1,3; 0,5 | 45° | sredina
:::

### Primer 3 (težji): ladja in svetilnik

Ladja pluje iz pristanišča $A$ naravnost v smeri, ki z obalo oklepa kot $30^\circ$. Na obali je 10 km od pristanišča svetilnik $B$, katerega luč se vidi 8 km daleč. Kje ladja pripluje v doseg luči in kje iz njega izpluje? Koliko kilometrov poti je v dosegu? Pri kolikšnem dosegu bi se ga ladja le dotaknila?

**Podatki:** $c = |AB| = 10\,\mathrm{km}$, $\alpha = 30^\circ$, doseg $a = 8\,\mathrm{km}$, načrt v merilu 1 cm za 1 km
**Iščemo:** točki $C_1$ in $C_2$ na poti z $|BC| = a$, dolžino $|C_1C_2|$ in mejni doseg $d$

:::formula
$C = $ presečišče kraka in $k(B, a)$; $d = \dfrac{c}{2}$; Pitagorov izrek v trikotnikih $ABD$ in $BDC$
:::

**Rešitev:**

1. Analiza: iščemo točke na kraku, 8 km od $B$. Kot ne leži med stranicama in $a < c$: morda sta rešitvi dve.
2. Opis: $AB = 10\,\mathrm{cm}$; kot $30^\circ$ v $A$ (simetrala kota $60^\circ$); $k(B, 8\,\mathrm{cm})$ seka krak v $C_1$ in $C_2$.
3. Diskusija: $D$ je nožišče pravokotnice iz $B$ na pot. Trikotnik $ABD$ je polovica enakostraničnega s stranico 10 km, zato $d = |BD| = 5\,\mathrm{km}$. Ker je $5 < 8 < 10$, sta rešitvi dve.
4. Račun za preizkus: $|AD| = \sqrt{10^2 - 5^2} = \sqrt{75} \approx 8{,}66\,\mathrm{km}$ in $|DC_1| = |DC_2| = \sqrt{8^2 - 5^2} = \sqrt{39} \approx 6{,}24\,\mathrm{km}$.
5. Od pristanišča: $|AC_1| = \sqrt{75} - \sqrt{39} \approx 2{,}42\,\mathrm{km}$ in $|AC_2| = \sqrt{75} + \sqrt{39} \approx 14{,}91\,\mathrm{km}$. V dosegu je pot $|C_1C_2| = 2\sqrt{39} \approx 12{,}49\,\mathrm{km}$.
6. Dotik: krožnica se kraka le dotakne, ko je $a = d = 5\,\mathrm{km}$.
7. Odgovor: ladja je v dosegu luči od približno 2,4 km do 14,9 km poti, torej 12,5 km. Pri dosegu 5 km bi se ga le dotaknila.

### Primer 4: zdaj ti

Načrtaj paralelogram $ABCD$ s stranicama $a = 5\,\mathrm{cm}$, $b = 3\,\mathrm{cm}$ in diagonalo $e = |AC| = 7\,\mathrm{cm}$.

**Podatki:** $a = 5\,\mathrm{cm}$, $b = 3\,\mathrm{cm}$, $e = 7\,\mathrm{cm}$
**Iščemo:** načrt paralelograma in število rešitev

:::formula
Diagonala $AC$ razdeli paralelogram na skladna trikotnika $ABC$ in $CDA$ (SSS).
:::

**Rešitev:**

1. Skica: trikotnik $ABC$ ima stranice $a$, $b$ in $e$, zato ga načrtaš takoj.
2. Opis: $AB = 5\,\mathrm{cm}$; $k(A, 7\,\mathrm{cm})$ in $k(B, 3\,\mathrm{cm})$ se sekata v $C$.
3. Dokončaj sam, nato preveri:

:::premisli
Kako dobiš $D$ in koliko rešitev ima naloga?
---
$D$ je presečišče krožnic $k(A, 3\,\mathrm{cm})$ in $k(C, 5\,\mathrm{cm})$ na drugi strani diagonale kot $B$ (ali: $C$ premakneš za usmerjeno daljico $\overrightarrow{BA}$). Trikotnik $ABC$ obstaja, ker je $5 - 3 < 7 < 5 + 3$, zato je rešitev ena. Če izmeriš, dobiš $\alpha = 60^\circ$ in $\beta = 120^\circ$.
:::

## Pogoste napake

- **»Trije podatki, torej en lik.«** Pri dveh stranicah in kotu nasproti krajše sta lahko dve rešitvi ali nobena. Brez diskusije rešitev ni popolna.
- **Trikotniška neenakost z enačajem.** Pri $a + b = c$ se loka dotakneta na daljici $AB$ in »trikotnik« je ravna črta. Neenakost $|a - b| < c < a + b$ je stroga.
- **Višina kot stranica.** Kdor $v_c$ nanese na krak kota $\alpha$, dobi točko, ki ni 4 cm od $AB$. Višina je razdalja, zato $C$ leži na vzporednici.
- **Samo načrt.** Na maturi brez skice, opisa in diskusije izgubiš točke, četudi je risba natančna.
- (višja raven) **Lik na oko v programu.** Točka, postavljena tako, da je »videti prav«, ni povezana z ostalimi, zato lik pri vlečenju razpade.

## Povzetek

- Načrtovalna naloga ima štiri dele: skica s podatki (analiza), opis načrtovanja, načrtovanje z ravnilom in šestilom, diskusija.
- Osnovne konstrukcije: simetrala daljice in kota, pravokotnica, vzporednica, kot $60^\circ$ in njegove polovice ($30^\circ$, $15^\circ$), $90^\circ$, $45^\circ$, $120^\circ$.
- Manjkajoče oglišče je presečišče dveh množic točk: krožnice $k(B, a)$, kraka kota, vzporednice na razdalji $v_c$, krožnice s polmerom $t_c$ ali $R$.
- Diskusija: SSS zahteva $|a - b| < c < a + b$, KSK pa $\alpha + \beta < 180^\circ$; dve stranici in kot nasproti krajše dasta 0, 1 ali 2 rešitvi.
- (višja raven) V programu za dinamično geometrijo dober načrt prestane test vlečenja; z drsnikom preveriš število rešitev.

## Drugače: Kot zgodba

Tine je na podstrešju našel star zemljevid z navodilom: »Zaklad je 50 korakov od starega hrasta in 40 korakov od velike skale.«

Točke, 50 korakov od hrasta, ležijo na krožnici okoli hrasta, točke 40 korakov od skale pa na krožnici okoli skale. Zaklad je v presečišču.

Hrast in skala sta 70 korakov narazen. Ker je $50 - 40 < 70 < 50 + 40$, se krožnici sekata v dveh točkah. Kopati bo moral na dveh mestih! Ko bi bila razdalja 90 korakov, bi se krožnici le dotaknili in mesto bi bilo eno. Pri 100 korakih pa krožnici ne bi imeli skupne točke. To je ista diskusija kot pri trikotniku SSS.

## Drugače: Korak za korakom s številkami

Trapez z osnovnicama $a = 9\,\mathrm{cm}$, $c = 4\,\mathrm{cm}$ in krakoma $b = 4\,\mathrm{cm}$, $d = 3\,\mathrm{cm}$. Ključ je vzporedni premik.

1. Krak $BC$ vzporedno premakni za usmerjeno daljico $\overrightarrow{CD}$. Točka $B$ pride v $E$ na $AB$, kjer je $|EB| = c = 4\,\mathrm{cm}$.
2. Nastane trikotnik $AED$ s stranicami $|AE| = 9 - 4 = 5\,\mathrm{cm}$, $|ED| = b = 4\,\mathrm{cm}$ in $|AD| = d = 3\,\mathrm{cm}$.
3. Diskusija: trikotnik obstaja, ker je $4 - 3 < 5 < 4 + 3$. Ker je $3^2 + 4^2 = 25 = 5^2$, je pri $D$ celo pravi kot.
4. Načrt: $AE = 5\,\mathrm{cm}$, $D$ iz $k(A, 3\,\mathrm{cm})$ in $k(E, 4\,\mathrm{cm})$; podaljšaj $AE$ do $B$ ($|AB| = 9\,\mathrm{cm}$); skozi $D$ vzporednica z $AB$ in na njej $|DC| = 4\,\mathrm{cm}$.
5. Višina trapeza je višina trikotnika $AED$ na stranico $AE$. Iz ploščine: $\frac{3 \cdot 4}{2} = 6$ in $v = \frac{2 \cdot 6}{5} = 2{,}4\,\mathrm{cm}$.

:::risba skica
opis: Trapez ABCD z osnovnico AB = 9 cm in osnovnico DC = 4 cm na višini 2,4 cm. Točka E je na AB, 5 cm od A. Črtkana daljica ED je vzporedna s krakom BC in dolga 4 cm. Trikotnik AED ima stranice 5 cm, 4 cm in 3 cm in pravi kot pri D.
območje: -0,6; -0,8 .. 9,6; 3,2
enota: 30
lik: 0; 0 -> 9; 0 -> 5,8; 2,4 -> 1,8; 2,4 | modra
črta: 5; 0 -> 1,8; 2,4 | oranžna črtkano
pravikot: 1,8; 2,4 | 0; 0 | 5; 0
točka: 0; 0 | A | pod levo
točka: 9; 0 | B | pod desno
točka: 5,8; 2,4 | C | nad desno
točka: 1,8; 2,4 | D | nad levo
točka: 5; 0 | E | pod
napis: 2,5; 0 | 5 | pod
napis: 0,9; 1,2 | 3 | levo
napis: 3,4; 1,2 | 4 | desno
napis: 7,4; 1,2 | 4 | desno
:::

## Preveri se

? Kateri nabor podatkov ne sodi zraven, ker ne določa enega samega trikotnika?
- $a = 3\,\mathrm{cm}$, $b = 4\,\mathrm{cm}$, $c = 5\,\mathrm{cm}$
~ To je SSS in velja $4 - 3 < 5 < 4 + 3$: krožnici se sekata, trikotnik je en sam.
- $c = 6\,\mathrm{cm}$, $v_c = 2\,\mathrm{cm}$, $\alpha = 60^\circ$
~ Višina ni stranica, a vseeno zadošča: $C$ je presečišče kraka in vzporednice na razdalji $v_c$, torej ena točka.
- $c = 5\,\mathrm{cm}$, $\alpha = 40^\circ$, $\beta = 70^\circ$
~ To je KSK in $40^\circ + 70^\circ < 180^\circ$: kraka se sekata v eni točki.
+ $c = 8\,\mathrm{cm}$, $a = 6\,\mathrm{cm}$, $\alpha = 30^\circ$
> Kot ne leži med stranicama in je nasproti krajše. Razdalja $B$ od kraka je $4\,\mathrm{cm}$; ker je $4 < 6 < 8$, sta rešitvi dve.

? (brez računala) Dve stranici trikotnika merita $4\,\mathrm{cm}$ in $9\,\mathrm{cm}$. Največ koliko centimetrov sme meriti tretja stranica, če je njena dolžina celo število?
= 12 cm
~ 13 | Pri $c = 4 + 9 = 13$ se loka dotakneta na daljici: to ni trikotnik. Neenakost je stroga.
~ 6 | To je najmanjša možna celoštevilska dolžina ($c > 9 - 4 = 5$), vprašanje pa sprašuje po največji.
~ 5 | To je razlika stranic, spodnja meja, ki je tretja stranica ne sme doseči.
> Veljati mora $9 - 4 < c < 9 + 4$, torej $5 < c < 13$. Največje celo število je $12$.

? (višja raven) Ana in Bor v programu za dinamično geometrijo narišeta kvadrat $ABCD$. Ana točki $C$ in $D$ postavi tako, da je videti prav. Bor ju načrta s pravokotnicama in krožnicama. Oba nato povlečeta točko $B$. Kaj se zgodi in zakaj?
+ Borov lik ostane kvadrat, ker sta $C$ in $D$ načrtani iz $A$ in $B$; Anin ni več kvadrat, ker $C$ in $D$ ostaneta na mestu.
- Oba ostaneta kvadrata, ker program sam ohranja lastnosti lika.
~ Program ohrani le zveze, ki si jih načrtal; točke na oko niso povezane z $B$.
- Oba se pokvarita, ker vlečenje vedno spremeni lik.
~ Vlečenje premakne lik, a dobro načrtan lik ohrani lastnosti. To je smisel testa vlečenja.
- Anin ostane kvadrat, Borov ne, ker se njegove pomožne črte zamaknejo.
~ Pomožne črte se premaknejo skupaj s $B$ in iz njih spet nastaneta pravilni točki $C$ in $D$.
> Program si zapomni, kako je točka nastala. Načrtane točke sledijo prosti točki, točke na oko pa ne.

? Tim rešuje nalogo s podatki $c = 8\,\mathrm{cm}$, $\alpha = 30^\circ$, $a = 3\,\mathrm{cm}$. Na risbi je njegov načrt, spodaj pa njegova diskusija.
:::risba skica
opis: Daljica AB dolžine 8 cm in krak kota 30 stopinj z vrhom A. Pravokotnica iz B na krak ima nožišče D in dolžino 4 cm. Krožnica s središčem B in polmerom 3 cm kraka ne doseže.
območje: -0,6; -3,4 .. 11,4; 6,5
enota: 25
črta: 0; 0 -> 8; 0 | debelo
črta: 0; 0 -> 10,5; 6,06 | modra
krog: 8; 0 | 3 | oranžna črtkano
črta: 8; 0 -> 6; 3,46 | siva črtkano
pravikot: 6; 3,46 | 8; 0 | 0; 0
točka: 0; 0 | A | pod levo
točka: 8; 0 | B | pod levo
točka: 6; 3,46 | D | nad levo
napis: 7,2; 1,9 | d | desno
napis: 1,6; 0,45 | 30° | sredina
:::
| Korak | Timov zapis |
|---|---|
| 1 | $d = \lvert BD \rvert = \frac{c}{2} = 4\,\mathrm{cm}$ (polovica enakostraničnega trikotnika) |
| 2 | $k(B, a)$ seka krak le, če je $a \ge d$. |
| 3 | Ker je $a < c$, ima naloga dve rešitvi. |
V katerem koraku je napaka? Vpiši, koliko rešitev ima naloga v resnici.
= 0
~ 2 | To je Timov sklep iz 3. koraka. Pogoj $a < c$ ni dovolj: krožnica mora kraka sploh doseči, $a \ge d$.
~ 1 | Ena rešitev bi bila pri $a = d = 4\,\mathrm{cm}$ (dotik) ali pri $a \ge c$. Tu je $a = 3\,\mathrm{cm} < 4\,\mathrm{cm}$.
> Napačen je 3. korak: zaradi 2. koraka bi moral najprej preveriti $a \ge d$. Ker je $3 < 4$, krožnica kraka ne doseže, kot kaže risba. Rešitve ni.

? Razvrsti korake, s katerimi z ravnilom in šestilom načrtaš kot $30^\circ$.
1. Nariši poltrak z vrhom $V$.
2. Iz $V$ zariši lok, ki seka poltrak v točki $P$.
3. Z istim polmerom zariši lok iz $P$; loka se sekata v točki $Q$, kot $PVQ$ meri $60^\circ$.
4. Iz $P$ in $Q$ zariši enako velika loka, ki se sekata v točki $T$.
5. Poltrak $VT$ razpolovi kot $PVQ$: kot $PVT$ meri $30^\circ$.
> Najprej potrebuješ kot $60^\circ$ (enakostranični trikotnik $VPQ$), nato njegovo simetralo.

<<RACUN
vrednost: 4*sqrt(3)/2 | 3.46
vrednost: 5-2 | 3
vrednost: sqrt(3^2+(2*sqrt(3))^2) | 4.58
vrednost: sqrt(27)-sqrt(7) | 2.55
vrednost: sqrt(27)+sqrt(7) | 7.84
vrednost: sqrt(10^2-5^2) | 8.66
vrednost: sqrt(8^2-5^2) | 6.24
vrednost: sqrt(75)-sqrt(39) | 2.42
vrednost: sqrt(75)+sqrt(39) | 14.91
vrednost: 2*sqrt(39) | 12.49
vrednost: 10/2 | 5
vrednost: (5^2+3^2-7^2)/(2*5*3) | -0.5
vrednost: 9-4 | 5
vrednost: 3^2+4^2 | 25
vrednost: 2*(3*4/2)/5 | 2.4
vrednost: 9+4-1 | 12
vrednost: 8/2 | 4
>>

:::simboli
a, b, c | stranice trikotnika ($a = \lvert BC \rvert$, $b = \lvert AC \rvert$, $c = \lvert AB \rvert$) | | cm
\alpha, \beta, \gamma | notranji koti trikotnika pri $A$, $B$, $C$ | | °
v_c | višina na stranico $c$ | | cm
t_c | težiščnica na stranico $c$ | | cm
R | polmer očrtanega kroga | | cm
k | krožnica; $k(B, a)$ ima središče $B$ in polmer $a$ | | 
A, B, C | oglišča trikotnika | | 
D | nožišče pravokotnice iz $B$ na krak; pri štirikotniku oglišče | | 
d | razdalja točke $B$ od kraka kota | d = \dfrac{c}{2} | cm | pri $\alpha = 30^\circ$; pri trapezu je $d$ krak $AD$
e | diagonala $AC$ paralelograma | | cm
v | višina trapeza | | cm
C_1, C_2 | presečišči kraka in krožnice $k(B, a)$ | | 
p | vzporednica z $AB$ na razdalji $v_c$ | | 
:::
