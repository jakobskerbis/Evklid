---
stanje: osnutek
demo: prosti-pad
avtor: AI
---

## Zakaj se tega učimo

Primi ravnilo za zgornji konec. Prijatelj naj drži palec in kazalec odprta ob oznaki $0$, ne da bi se ravnila dotikal. Brez opozorila ga spusti. Prijatelj ga ujame šele, ko opazi gibanje, in ravnilo do takrat pade približno $20\,\text{cm}$. Iz te ene dolžine boš izračunal njegov reakcijski čas, brez štoparice.

Natančneje izmeriš padanje s telefonom. Postavi ga ob meter, posnemi padec žoge v počasnem posnetku in preštej sličice. Oba poskusa pokažeta isto: spuščeno telo ne pada s stalno hitrostjo, ampak vedno hitreje. Gre za enakomerno pospešeno gibanje, ki ga že poznaš ($v = v_0 + at$, $s = v_0 t + \dfrac{at^2}{2}$). Novo je le to, da ima pospešek tu posebno ime in znano vrednost.

S temi enačbami izračunaš, kako hitro prileti v vodo skakalka z $10$-metrskega stolpa, kako visoko poleti žoga in celo težni pospešek iz posnetka s telefonom.

## Razlaga

**1. Prosti pad.** Prosti pad je gibanje telesa, ki ga spustimo (začetna hitrost je $0$) in nanj deluje samo teža. Zračni upor zanemarimo.

*Hiter preizkus:* ali je žoga, ki jo vržeš navzdol, v prostem padu? (Po naši ožji definiciji ne, ker začetna hitrost ni $0$. Pospešek pa je enak, $g$.)

**2. Težni pospešek.** Kako spuščeno telo pada, pokaže počasni posnetek z $240$ sličicami na sekundo. Na sliki je lega spuščene žogice na vsaki $24.$ sličici, torej vsako desetinko sekunde (lege so zaokrožene; pravi posnetek odstopa za kak milimeter):

:::risba skica
opis: Pet zaporednih leg spuščene žogice, narisanih navpično od zgoraj navzdol, v razmikih 0,1 s, kot jih pokaže počasni posnetek. Ob 0 s je žogica na 0 cm, ob 0,1 s na 4,9 cm, ob 0,2 s na 19,6 cm, ob 0,3 s na 44,1 cm in ob 0,4 s na 78,4 cm pod mestom spusta. Levo so zapisani razmiki med sosednjimi legami: 4,9 cm, 14,7 cm, 24,5 cm in 34,3 cm.
območje: 0; 0 .. 7,4; 9,4
enota: 40
črta: 2,4; 8,5 -> 4; 8,5 | siva
črta: 3,2; 8,5 -> 3,2; 0,66 | siva črtkano
krog: 3,2; 8,5 | 0,15 | modra polno
krog: 3,2; 8,01 | 0,15 | modra polno
krog: 3,2; 6,54 | 0,15 | modra polno
krog: 3,2; 4,09 | 0,15 | modra polno
krog: 3,2; 0,66 | 0,15 | modra polno
napis: 3,7; 8,8 | 0 s: 0 cm | desno
napis: 3,7; 8,01 | 0,1 s: 4,9 cm | desno
napis: 3,7; 6,54 | 0,2 s: 19,6 cm | desno
napis: 3,7; 4,09 | 0,3 s: 44,1 cm | desno
napis: 3,7; 0,66 | 0,4 s: 78,4 cm | desno
napis: 2,8; 8,25 | 4,9 cm | levo | oranžna
napis: 2,8; 7,27 | 14,7 cm | levo | oranžna
napis: 2,8; 5,31 | 24,5 cm | levo | oranžna
napis: 2,8; 2,37 | 34,3 cm | levo | oranžna
podnapis: Desno: čas in globina pod mestom spusta. Levo: razmik med sosednjima legama.
:::

Razmiki med legami so $4{,}9$; $14{,}7$; $24{,}5$ in $34{,}3\,\text{cm}$, v razmerju $1 : 3 : 5 : 7$. Vsak je za $9{,}8\,\text{cm}$ daljši od prejšnjega. Povprečne hitrosti v zaporednih desetinkah so zato $0{,}49$; $1{,}47$; $2{,}45$ in $3{,}43\,\mathrm{m/s}$: vsaka je za $0{,}98\,\mathrm{m/s}$ večja od prejšnje. Hitrost raste enakomerno, pospešek je stalen:

$$a = \frac{0{,}98\,\mathrm{m/s}}{0{,}1\,\text{s}} = 9{,}8\,\mathrm{\frac{m}{s^2}}$$

Imenujemo ga **težni pospešek** $g$. Natančnejše meritve dajo

$$g \approx 9{,}81\,\mathrm{\frac{m}{s^2}}.$$

Hitrost padajočega telesa se torej vsako sekundo poveča za $9{,}81\,\mathrm{m/s}$: po $1\,\text{s}$ je $9{,}81\,\mathrm{m/s}$, po $2\,\text{s}$ $19{,}62\,\mathrm{m/s}$, po $3\,\text{s}$ $29{,}43\,\mathrm{m/s}$. Po Zemlji se $g$ malo spreminja: od $9{,}78\,\mathrm{m/s^2}$ na ekvatorju do $9{,}83\,\mathrm{m/s^2}$ na polih.

Pospešek je enak za vsa telesa, težka in lahka, če zanemarimo zračni upor. Brez zraka bi kamen in pero padla enako hitro.

:::premisli
Telefon in pero spustiš hkrati z iste višine v sobi. Kaj pade prej? In kaj bi se zgodilo v cevi, iz katere smo izčrpali zrak?
---
V sobi telefon, ker pero močno zavira zrak. V cevi brez zraka padeta hkrati: oba imata pospešek $g$, masa pri tem ne igra vloge.
:::

Poskus so naredili tudi na Luni, kjer ni zraka: leta 1971 je astronavt David Scott hkrati spustil kladivo in pero. Na tla sta padla hkrati.

**3. Enačbe prostega pada.** Globino pod mestom spusta označimo s $h$ (os kaže navzdol). Iz enačb za enakomerno pospešeno gibanje z $v_0 = 0$ in $a = g$ dobimo:

$$v = g\,t \qquad h = \frac{g\,t^2}{2}$$

$$v^2 = 2\,g\,h$$

Od kod polovica v drugi enačbi? Hitrost raste od $0$ do $g\,t$, zato telo ne pade $g\,t \cdot t$, ampak manj. Pot je ploščina pod grafom $v(t)$, kot pri vsakem pospešenem gibanju. Tu je to trikotnik z osnovnico $t$ in višino $g\,t$:

$$h = \frac{1}{2} \cdot t \cdot g\,t = \frac{g\,t^2}{2}$$

:::risba graf
opis: Graf hitrosti v odvisnosti od časa pri prostem padu: premica v = g t skozi izhodišče. Pobarvan je trikotnik pod premico od časa 0 do izbranega časa t; njegova ploščina je pot. V aplikaciji se t spreminja z drsnikom od 1 s do 3 s. Izbrano je t = {t} s: hitrost je {9.81*t:.2} m/s, ploščina trikotnika (pot) pa {4.905*t*t:.2} m.
x: 0 .. 3,5 | 0,5 | t [s]
y: 0 .. 35 | 5 | v [m/s]
drsnik: t | 1 .. 3 | 0,5 | 3 | čas padanja t v sekundah
lik: 0; 0 -> t; 0 -> t; 9.81*t | oranžna
f: 9.81*x | modra
točka: t; 9.81*t | {9.81*t:.2} m/s | nad levo
napis: 2*t/3; 9.81*t/4 | pot
podnapis: t = {t} s: hitrost {9.81*t:.2} m/s, pot {4.905*t*t:.2} m
:::

Slika kaže $t = 3\,\text{s}$: hitrost je $29{,}43\,\mathrm{m/s}$, ploščina trikotnika pa $\dfrac{1}{2} \cdot 3 \cdot 29{,}43 \approx 44{,}15\,\text{m}$. V aplikaciji premakni drsnik s $3\,\text{s}$ na $1{,}5\,\text{s}$. Opazi: hitrost se razpolovi (na $14{,}72\,\mathrm{m/s}$), pot pa pade na četrtino (na $11{,}04\,\text{m}$), ker se trikotniku skrajšata osnovnica in višina.

Tretja enačba nastane z izločitvijo časa. Uporabimo jo, kadar čas ni znan.

:::premisli
Ravnilo iz uvoda pade $20\,\text{cm}$, preden ga prijatelj ujame. Je njegov reakcijski čas bližje $0{,}02\,\text{s}$; $0{,}2\,\text{s}$ ali $2\,\text{s}$? Napovej, nato izračunaj.
---
Bližje $0{,}2\,\text{s}$. Iz $h = \dfrac{g t^2}{2}$ sledi $t = \sqrt{\dfrac{2h}{g}} = \sqrt{\dfrac{0{,}40}{9{,}81}} \approx 0{,}20\,\text{s}$. Višino smo prej pretvorili v metre. Na sliki leg žogice to vidiš: po $0{,}2\,\text{s}$ je žogica $19{,}6\,\text{cm}$ niže.
:::

**4. Navpični met navzgor.** Telo vržemo navzgor z začetno hitrostjo $v_0$. Os $y$ zdaj usmerimo **navzgor**. Pospešek kaže navzdol, zato je $a = -g$:

$$v = v_0 - g\,t$$

$$y = v_0\,t - \frac{g\,t^2}{2}$$

Hitrost se najprej zmanjšuje, v vrhu postane $0$, nato pa telo pada nazaj (hitrost je negativna). Graf kaže met z $v_0 = 14\,\mathrm{m/s}$ iz Primera 2:

:::risba graf
opis: Graf hitrosti v odvisnosti od časa za žogo, vrženo navzgor z začetno hitrostjo 14 m/s. Premica pada od 14 m/s pri času 0 do 0 pri 1,43 s (vrh) in naprej do približno −14 m/s pri 2,85 s, ko je žoga spet v roki; točki sta označeni »vrh 1,43 s« in »2,85 s«. Pobarvana sta dva enako velika trikotnika med premico in osjo t: nad osjo od časa 0 do vrha (napis »gor 10 m«) in pod osjo od vrha do vrnitve (napis »dol 10 m«).
x: 0 .. 3,5 | 0,5 | t [s]
y: -15 .. 15 | 5 | v [m/s]
lik: 0; 0 -> 1,43; 0 -> 0; 14 | oranžna
lik: 1,43; 0 -> 2,85; 0 -> 2,85; -13,96 | zelena
f: 14-9.81*x | modra | 0 .. 2,85
napis: 0,5; 3 | gor 10 m
napis: 2,3; -3 | dol 10 m
točka: 1,43; 0 | vrh 1,43 s | nad desno
točka: 2,85; -13,96 | 2,85 s | desno
napis: 2,75; -14 | −14 m/s | levo
:::

Naklon premice je povsod enak, $-g$: hitrost se vsako sekundo zmanjša za $9{,}81\,\mathrm{m/s}$, tudi ko je že negativna.

*Hiter preizkus:* kaj pomeni točka, kjer premica seka os $t$? (Hitrost je nič, žoga je v vrhu.)

**5. Najvišja točka.** V vrhu je $v = 0$. Iz $0 = v_0 - g\,t$ dobimo čas vzpona:

$$t_\text{vrh} = \frac{v_0}{g}$$

Ta čas vstavimo v enačbo za $y$:

$$h_\text{max} = v_0 \cdot \frac{v_0}{g} - \frac{g}{2} \cdot \frac{v_0^2}{g^2}$$

V drugem členu okrajšamo $g$ in dobimo največjo višino:

$$h_\text{max} = \frac{v_0^2}{g} - \frac{v_0^2}{2g} = \frac{v_0^2}{2g}$$

Isto pove graf $v(t)$ zgoraj: višina je ploščina trikotnika nad osjo $t$, $\dfrac{1}{2} \cdot 1{,}43 \cdot 14 \approx 10\,\text{m}$. Trikotnik pod osjo je enako velik: žoga se za $10\,\text{m}$ spusti. Premik je zato $0$, prepotovana pot pa $20\,\text{m}$.

Spodnji graf kaže višino žoge med letom, $y(t)$. Pri $v_0 = 14\,\mathrm{m/s}$ je vrh po $1{,}43\,\text{s}$ na višini $9{,}99\,\text{m}$:

:::risba graf
opis: Graf višine v odvisnosti od časa za navpični met navzgor: parabola, ki se začne v izhodišču, doseže vrh in se vrne na višino 0. V aplikaciji se začetna hitrost spreminja z drsnikom od 8 m/s do 20 m/s. Izbrano je {v} m/s: vrh je po {v/9.81:.2} s na višini {v*v/19.62:.2} m, žoga se vrne po {v/4.905:.2} s.
x: 0 .. 5 | 0,5 | t [s]
y: 0 .. 25 | 5 | y [m]
drsnik: v | 8 .. 20 | 1 | 14 | začetna hitrost v m/s
f: v*x - 4.905*x*x | modra
črta: v/9.81; 0 -> v/9.81; v*v/19.62 | siva črtkano
točka: v/9.81; v*v/19.62 | vrh | nad
točka: v/4.905; 0
podnapis: Začetna hitrost {v} m/s: vrh po {v/9.81:.2} s na višini {v*v/19.62:.2} m, vrnitev po {v/4.905:.2} s
:::

V aplikaciji nastavi drsnik na $10\,\mathrm{m/s}$ in nato na $20\,\mathrm{m/s}$. Opazi: pri dvakratni začetni hitrosti pride vrh dvakrat pozneje (po $1{,}02\,\text{s}$ in po $2{,}04\,\text{s}$), višina pa je štirikrat večja ($5{,}10\,\text{m}$ in $20{,}39\,\text{m}$), ker je v enačbi $v_0^2$.

Parabola je simetrična. Čas vzpona je enak času padanja nazaj na isto višino. Celoten let do vrnitve na izhodišče traja $\dfrac{2v_0}{g}$. Ob vrnitvi je hitrost po velikosti enaka $v_0$, usmerjena navzdol.

**6. Pospešek v vrhu ni nič.** Na poti navzgor, v vrhu in na poti navzdol je pospešek ves čas enak: $g$, usmerjen navzdol. V vrhu ima telo hitrost nič, pospešek pa ne.

V aplikaciji v simulaciji spodaj »Navpični met« nastavi začetno hitrost na $14\,\mathrm{m/s}$ kot v Primeru 2 (višina je tam označena s $h$), pritisni »Vrzi« in tik pred vrhom »Ustavi«. Napovej: bo puščica hitrosti v vrhu skočila ali gladko prešla skozi nič? Nato spet »Vrzi«: puščica se krajša, izgine in zraste navzdol. Preklopi še na graf $v(t)$: premica gre skozi ničlo brez preloma.

**7. Predznaki.** Pred računom izberi smer osi in je sredi naloge ne spreminjaj. Kar kaže v smeri osi, je pozitivno, kar kaže nasproti, negativno:

| Količina | Os navzgor | Os navzdol |
|---|---|---|
| pospešek | $-g$ | $+g$ |
| hitrost pri dviganju | pozitivna | negativna |
| hitrost pri padanju | negativna | pozitivna |
| lega pod izhodiščem | negativna | pozitivna |

Pri prostem padu smo os usmerili navzdol, pri metu navzgor pa navzgor; od tod minus pred $g$. Če telo vržemo navzdol z začetno hitrostjo $v_0$ (navpični met navzdol), os usmerimo navzdol in oba člena seštevamo: $v = v_0 + g\,t$, $h = v_0\,t + \dfrac{g\,t^2}{2}$.

Preveri na kamnu: vržeš ga z mostu navzdol s $5\,\mathrm{m/s}$. Kako hiter in kako globoko je po $2\,\text{s}$? ($v = 5 + 9{,}81 \cdot 2 = 24{,}62\,\mathrm{m/s}$, $h = 5 \cdot 2 + 4{,}905 \cdot 2^2 = 29{,}62\,\text{m}$. Kdor pozabi $v_0$, dobi le $19{,}62\,\text{m}$.)

## Rešeni primeri

### Primer 1: skok s stolpa (višina → čas in hitrost)

Olimpijski skakalni stolp je $10\,\text{m}$ nad vodo. Skakalka stopi z roba, njena začetna hitrost v navpični smeri je približno $0$ (v resnici se malo odrine navzgor, zato je let nekoliko daljši). Koliko časa pada in s kolikšno hitrostjo prileti v vodo? Zračni upor zanemari.

**Podatki:** $h = 10\,\text{m}$, $v_0 = 0$, $g = 9{,}81\,\mathrm{m/s^2}$, zračni upor zanemarimo
**Iščemo:** čas padanja $t$ in hitrost $v$ ob vodi

:::formula
Prosti pad: iz $h = \dfrac{g t^2}{2}$ sledi $t = \sqrt{\dfrac{2h}{g}}$; nato $v = g\,t$ (preverjanje: $v^2 = 2\,g\,h$)
:::

**Rešitev:**

1. Začetna hitrost je $0$, torej gre za prosti pad. Znana je višina, zato iz $h = \dfrac{g t^2}{2}$ izrazimo čas.
2. Vstavimo: $t = \sqrt{\dfrac{2 \cdot 10}{9{,}81}} = \sqrt{2{,}039} \approx 1{,}43\,\text{s}$.
3. Hitrost raste enakomerno, zato $v = g\,t = 9{,}81 \cdot 1{,}43 \approx 14{,}0\,\mathrm{m/s}$.
4. Preverimo brez časa: $v^2 = 2 \cdot 9{,}81 \cdot 10 = 196{,}2$, $\sqrt{196{,}2} \approx 14{,}0\,\mathrm{m/s}$. ✓

**Odgovor:** skakalka pada približno $1{,}4\,\text{s}$ in prileti v vodo s hitrostjo približno $14\,\mathrm{m/s}$, to je okoli $50\,\mathrm{km/h}$.

### Primer 2: žoga navzgor

Žogo vržemo navpično navzgor s hitrostjo $14{,}0\,\mathrm{m/s}$. Kako visoko poleti, kdaj doseže vrh in kdaj pade nazaj v roko?

**Podatki:** $v_0 = 14{,}0\,\mathrm{m/s}$ (navzgor), $g = 9{,}81\,\mathrm{m/s^2}$, v vrhu je $v = 0$
**Iščemo:** največjo višino $h_\text{max}$, čas vzpona $t_\text{vrh}$ in čas vrnitve v roko

:::formula
$t_\text{vrh} = \dfrac{v_0}{g}$, $h_\text{max} = \dfrac{v_0^2}{2g}$, celoten let traja $2\,t_\text{vrh}$ (preverjanje: $y = v_0\,t - \dfrac{g t^2}{2}$)
:::

**Rešitev:**

1. V vrhu je $v = 0$. Čas vzpona: $t_\text{vrh} = \dfrac{v_0}{g} = \dfrac{14{,}0}{9{,}81} \approx 1{,}43\,\text{s}$.
2. Višina: $h_\text{max} = \dfrac{v_0^2}{2g} = \dfrac{14{,}0^2}{2 \cdot 9{,}81} = \dfrac{196}{19{,}62} \approx 9{,}99\,\text{m}$.
3. Čas padanja nazaj je enak času vzpona, zato je skupni čas $\dfrac{2 v_0}{g} = \dfrac{28{,}0}{9{,}81} \approx 2{,}85\,\text{s}$ (računamo z nezaokroženim časom vzpona).
4. Preverimo z enačbo za višino ob $t = 2{,}85\,\text{s}$: $14{,}0 \cdot 2{,}85 - 4{,}905 \cdot 2{,}85^2 = 39{,}90 - 39{,}84 = 0{,}06\,\text{m} \approx 0$. ✓ (odstopanje, ker je $2{,}85\,\text{s}$ zaokrožen)

**Odgovor:** žoga poleti približno $10{,}0\,\text{m}$ visoko, vrh doseže po $1{,}43\,\text{s}$ in se vrne po $2{,}85\,\text{s}$.

Ista števila kot pri stolpu niso naključje. Žoga, vržena s $14\,\mathrm{m/s}$, se dvigne $10\,\text{m}$; telo, ki pade $10\,\text{m}$, doseže $14\,\mathrm{m/s}$. Vzpon je padanje, gledano nazaj v času.

### Primer 3: met z roba stavbe (dva dela gibanja)

Z roba stavbe, ki je $25\,\text{m}$ visoka, vržemo kamen navpično navzgor s hitrostjo $10\,\mathrm{m/s}$. Po kolikšnem času pade na tla in s kolikšno hitrostjo?

**Podatki:** $y_0 = 25\,\text{m}$ (višina stavbe), $v_0 = 10\,\mathrm{m/s}$ (navzgor), $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** čas $t$ do padca na tla in hitrost $v$ ob padcu

:::formula
Vzpon: $t_1 = \dfrac{v_0}{g}$, dvig $\dfrac{v_0^2}{2g}$. Prosti pad z vrha: $t_2 = \sqrt{\dfrac{2h}{g}}$, $v = g\,t_2$. Skupaj: $t = t_1 + t_2$ (preverjanje: $v^2 = v_0^2 + 2as$)
:::

**Rešitev:**

1. **Razdelimo gibanje.** Kamen se najprej dviga do vrha, nato z vrha prosto pada do tal. Oba dela že znamo izračunati.
2. **Vzpon.** Čas: $t_1 = \dfrac{10}{9{,}81} \approx 1{,}02\,\text{s}$. Dvig nad rob: $\dfrac{10^2}{2 \cdot 9{,}81} \approx 5{,}10\,\text{m}$.
3. **Višina vrha nad tlemi.** $h = 25 + 5{,}10 = 30{,}10\,\text{m}$. Toliko kamen pade z vrha do tal.
4. **Prosti pad z vrha.** V vrhu je hitrost $0$, zato $t_2 = \sqrt{\dfrac{2 \cdot 30{,}1}{9{,}81}} = \sqrt{6{,}137} \approx 2{,}48\,\text{s}$.
5. **Skupni čas.** $t = 1{,}02 + 2{,}48 = 3{,}50\,\text{s}$.
6. **Hitrost ob tleh.** $v = g\,t_2 = 9{,}81 \cdot 2{,}48 \approx 24{,}3\,\mathrm{m/s}$, usmerjena navzdol.
7. **Preverimo brez časa** z enačbo $v^2 = v_0^2 + 2as$ od roba do tal. Os ostane usmerjena navzgor: $v_0 = +10\,\mathrm{m/s}$, $a = -g$, premik $s = -25\,\text{m}$ (ne prepotovana pot: kamen gre najprej gor). Dobimo $10^2 + 2 \cdot (-9{,}81) \cdot (-25) = 590{,}5$, $\sqrt{590{,}5} \approx 24{,}3\,\mathrm{m/s}$. ✓

**Odgovor:** kamen pade na tla po približno $3{,}5\,\text{s}$ s hitrostjo približno $24\,\mathrm{m/s}$.

**Druga pot (ko boš poznal kvadratno enačbo).** Z osjo navzgor in izhodiščem na tleh velja enačba $y = 25 + 10\,t - 4{,}905\,t^2$. Ob tleh je $y = 0$. Pozitivna rešitev te kvadratne enačbe je $t \approx 3{,}50\,\text{s}$; negativna, $-1{,}46\,\text{s}$, pove, kdaj bi bil kamen na tleh, če bi po isti paraboli letel že pred metom (kot da bi ga vrgli s tal). Za našo nalogo nima pomena.

Kamen se najprej dvigne do $30{,}1\,\text{m}$, po $2{,}04\,\text{s}$ je spet ob robu strehe in šele nato pada proti tlom:

:::risba graf
opis: Graf višine kamna nad tlemi v odvisnosti od časa. Parabola se začne pri 25 m (rob stavbe), doseže vrh 30,1 m po 1,02 s, se po 2,04 s vrne na 25 m in doseže tla (višina 0) po 3,50 s. Črtkana vodoravna črta označuje višino stavbe 25 m.
x: 0 .. 4 | 0,5 | t [s]
y: 0 .. 35 | 5 | y [m]
črta: 0; 25 -> 4; 25 | siva črtkano
f: 25 + 10*x - 4.905*x*x | modra | 0 .. 3,5
točka: 0; 25 | met | pod desno
točka: 1,02; 30,1 | vrh 30,1 m | nad
točka: 2,04; 25 | spet 25 m | nad desno
točka: 3,5; 0
napis: 2,3; 3 | tla po 3,50 s
:::

### Primer 4 – zdaj ti: težni pospešek iz počasnega posnetka

Telefon snema z $240$ sličicami na sekundo. Žogo spustimo ob metru z višine $1{,}00\,\text{m}$. Od spusta do tal mine $108$ sličic. Kolikšen težni pospešek sledi iz te meritve?

**Podatki:** $240$ sličic v $1\,\text{s}$, padec traja $108$ sličic, $h = 1{,}00\,\text{m}$, $v_0 = 0$
**Iščemo:** težni pospešek $g$

:::formula
Čas iz sličic: $t = \dfrac{\text{število sličic}}{240\,\text{sličic/s}}$; iz $h = \dfrac{g t^2}{2}$ sledi $g = \dfrac{2h}{t^2}$
:::

**Rešitev:**

1. Najprej čas, ker ga enačba potrebuje v sekundah: $t = \dfrac{108}{240}\,\text{s} = 0{,}45\,\text{s}$.
2. Žogo smo spustili, zato velja $h = \dfrac{g t^2}{2}$. Neznanka je tokrat $g$: enačbo pomnožimo z $2$ in delimo s $t^2$.
3. Vstavi $h$ in $t$ v $g = \dfrac{2h}{t^2}$ in izračunaj sam, nato preveri:

:::premisli
Kolikšen $g$ dobiš? Je blizu znane vrednosti?
---
$g = \dfrac{2 \cdot 1{,}00}{0{,}45^2} = \dfrac{2{,}00}{0{,}2025} \approx 9{,}88\,\mathrm{m/s^2}$. Od $9{,}81\,\mathrm{m/s^2}$ se razlikuje za manj kot $1\,\%$. Ena sličica več ($109$) bi dala $9{,}70\,\mathrm{m/s^2}$, ena manj ($107$) pa $10{,}06\,\mathrm{m/s^2}$. Meritev torej zapišemo kot $g = (9{,}9 \pm 0{,}2)\,\mathrm{m/s^2}$; znana vrednost leži znotraj merske napake.
:::

## Pogoste napake

- **Pospešek v vrhu je nič ali tam zamenja smer.** Žoga za trenutek obstane, zato se zdi, da nanjo nič ne deluje; ali pa, da pospešek kaže tja, kamor se žoga giblje. Ni res. Smer zamenja hitrost, pospešek je ves čas $g$ navzdol. Če bi bil v vrhu nič, bi telo obvisilo v zraku.
- **Mešanje predznakov.** Dijak piše $v = v_0 + g t$ tudi pri metu navzgor in dobi hitrost, ki ves čas raste. Če os usmeriš navzgor, mora imeti $g$ v enačbah nasprotno smer od $v_0$.
- **Pozabljen faktor $\tfrac{1}{2}$ ali kvadrat časa.** Kdor si zapomni le »hitrost krat čas«, računa $h = g t$ ali $h = g t^2$. Hitrost pa med padanjem raste od $0$, zato je povprečna le polovica končne. Pravilno je $h = \dfrac{g t^2}{2}$ in $h_\text{max} = \dfrac{v_0^2}{2g}$.
- **»Težja telesa padajo hitreje.«** Izkušnja s peresom in kamnom to navidez potrjuje. Brez zračnega upora vsa telesa padajo z istim pospeškom; razliko povzroča le zrak.
- **»Dvakrat višje, dvakrat dlje.«** Čas ni sorazmeren z višino, ker je $h$ sorazmerna s $t^2$. Pri dvakratni višini je čas $\sqrt{2} \approx 1{,}41$-krat daljši. Pravilno: $t = \sqrt{\dfrac{2h}{g}}$.

## Povzetek

- Prosti pad: začetna hitrost $0$, pospešek $g \approx 9{,}81\,\mathrm{m/s^2}$ navzdol.
- Enačbe: $v = g t$, $h = \dfrac{g t^2}{2}$, $v^2 = 2 g h$.
- Navpični met navzgor (os navzgor): $v = v_0 - g t$, $y = v_0 t - \dfrac{g t^2}{2}$.
- Navpični met navzdol (os navzdol): $v = v_0 + g t$, $h = v_0 t + \dfrac{g t^2}{2}$.
- Vrh: $v = 0$, $t_\text{vrh} = \dfrac{v_0}{g}$, $h_\text{max} = \dfrac{v_0^2}{2g}$.
- Čas vzpona je enak času padanja nazaj na isto višino, hitrost ob vrnitvi pa je po velikosti enaka začetni.
- Pospešek je ves čas $g$ navzdol, tudi v vrhu.
- Na drugih nebesnih telesih je $g$ drugačen, enačbe pa ostanejo enake.

## Drugače: Na sliki

V demonstraciji »Prosti pad na Zemlji, Luni in Marsu« spustiš telo na Zemlji, Luni ali Marsu (na izbiro je še Jupiter) in opazuješ, kako se razmiki med zaporednimi položaji večajo.

Med Zemljo ($g \approx 9{,}81\,\mathrm{m/s^2}$), Marsom ($3{,}71\,\mathrm{m/s^2}$) in Luno ($1{,}62\,\mathrm{m/s^2}$) telo najhitreje pade na Zemlji, najpočasneje na Luni. Na Jupitru ($24{,}8\,\mathrm{m/s^2}$) bi padlo še hitreje.

Napovej: bo padec na Luni šestkrat daljši? Graf kaže globino padca $h = \dfrac{g\,t^2}{2}$ na vseh treh telesih; krivulje si od leve proti desni sledijo Zemlja, Mars, Luna. Črtkana črta je pri $10\,\text{m}$: Zemljina krivulja jo doseže po $1{,}43\,\text{s}$, Marsova po $2{,}32\,\text{s}$, Lunina po $3{,}51\,\text{s}$.

:::risba graf
opis: Graf globine padca v odvisnosti od časa za Zemljo, Mars in Luno. Vse tri krivulje so parabole iz izhodišča; Zemljina je najstrmejša, Lunina najbolj položna. Črtkana vodoravna črta pri 10 m jih seka pri 1,43 s (Zemlja), 2,32 s (Mars) in 3,51 s (Luna).
x: 0 .. 4 | 0,5 | t [s]
y: 0 .. 14 | 2 | h [m]
črta: 0; 10 -> 4; 10 | siva črtkano
f: 4.905*x*x | modra | 0 .. 1,65
f: 1.855*x*x | oranžna | 0 .. 2,7
f: 0.81*x*x | zelena | 0 .. 4
točka: 1,43; 10 | Zemlja | nad levo | modra
točka: 2,32; 10 | Mars | nad levo | oranžna
točka: 3,51; 10 | Luna | nad levo | zelena
:::

Na Luni je $g$ približno šestkrat manjši kot na Zemlji, čas padanja pa je le približno $2{,}5$-krat daljši ($3{,}51 : 1{,}43 \approx 2{,}45$). Razlog je koren v $t = \sqrt{\dfrac{2h}{g}}$.

## Drugače: Bolj natančno

**Izpeljava enačbe brez časa.** Če iz $v = g t$ izraziš $t = v/g$ in vstaviš v izraz za $h$, dobiš

$$h = \frac{g}{2}\cdot\frac{v^2}{g^2} = \frac{v^2}{2g} \quad\Rightarrow\quad v^2 = 2 g h.$$

**Zakaj je čas vzpona enak času padanja.** Pri metu navzgor je $v = v_0 - g t$. V vrhu je $v = 0$, zato je $t_\text{vrh} = v_0/g$. Pri padanju iz vrha pa velja $h_\text{max} = \dfrac{g t^2}{2}$, torej $t = \sqrt{\dfrac{2 h_\text{max}}{g}}$. Vstavimo $h_\text{max} = \dfrac{v_0^2}{2g}$ in dobimo $t = \dfrac{v_0}{g}$. Časa sta enaka, gibanje je simetrično.

**Zakaj padajo vsa telesa enako.** (Pogled naprej v poglavje o silah.) Po drugem Newtonovem zakonu je $F = m a$. Sila teže je $F_g = m g$, zato je $a = \dfrac{m g}{m} = g$. Masa se pokrajša. Do enakega sklepa je s poskusi na klancu in razmislekom prišel že Galilei, dolgo pred Newtonom.

**Omejitve modela.** Enačbe veljajo, če je zračni upor zanemarljiv in če je višina majhna v primerjavi s polmerom planeta (tako je $g$ približno stalen). Pri velikih hitrostih ali lahkih telesih z veliko površino (list, padalo) je zračni upor bistven. Padalec v legi na trebuhu z razširjenimi rokami doseže le približno $54\,\mathrm{m/s}$ (okoli $195\,\mathrm{km/h}$) in nato ne pospešuje več. Skakalka iz Primera 1 doseže $14\,\mathrm{m/s}$, zato je tam model dober.

## Preveri se

? Z iste višine hkrati spustimo jekleni kroglici z masama $100\,\text{g}$ in $1\,\text{kg}$. Zračni upor je zanemarljiv. Katera prej pade na tla?
- Težja, ker jo Zemlja privlači močneje.
~ Teža je res večja, a večjo maso je tudi težje pospešiti. Pospešek je za obe enak, $g$.
+ Padeta hkrati.
- Lažja, ker jo je laže pospešiti.
~ Na lažjo deluje tudi manjša teža. Oboje se izniči, pospešek je za obe $g$.
> Brez zračnega upora imajo vsa telesa enak pospešek $g$, zato z iste višine padajo enako dolgo. Razlike pri peresu ali listu povzroča zrak.

? Graf kaže hitrost žoge, vržene navpično navzgor (os navzgor). Z grafa odčitaj začetno hitrost in čas vrha (na cela števila). Kako visoko poleti žoga?
:::risba graf
opis: Graf hitrosti v odvisnosti od časa: padajoča premica od približno 20 m/s pri času 0 skozi vrednost 0 pri času 2 s do približno −20 m/s pri času 4 s.
x: 0 .. 4,5 | 0,5 | t [s]
y: -25 .. 25 | 5 | v [m/s]
f: 19.62 - 9.81*x | modra | 0 .. 4
:::
= 20 m | 1
~ 40 | To je ploščina pravokotnika $20 \cdot 2$. Hitrost med vzponom pada proti $0$, zato je višina ploščina trikotnika, polovica tega.
> Začetna hitrost je približno $20\,\mathrm{m/s}$, premica seka os $t$ pri $2\,\text{s}$ (vrh). Višina je ploščina trikotnika nad osjo: $\dfrac{1}{2} \cdot 2 \cdot 20 = 20\,\text{m}$.

? Na grafu $v(t)$ navpičnega meta gre premica skozi vrednost $0$ brez preloma, z enakim naklonom kot prej. Kaj to pove o žogi v vrhu?
- Hitrost in pospešek sta enaka $0$.
~ Pri pospešku nič bi bila premica tam vodoravna in žoga bi obvisela. Naklon pa se ne spremeni.
- Pospešek v vrhu zamenja smer z navzgor na navzdol.
~ Pospešek je naklon premice; ta je pred vrhom in po njem enak, $-g$. Smer zamenja hitrost.
+ Hitrost je $0$, pospešek je $g$ navzdol.
> Vrednost na grafu je hitrost, v vrhu je nič. Naklon je pospešek in je povsod $-g$, tudi v vrhu, saj teža deluje ves čas.

? Poskus z ravnilom iz uvoda: ravnilo pade $11\,\text{cm}$, preden ga prijatelj ujame. Kolikšen je njegov reakcijski čas? ($g = 9{,}81\,\mathrm{m/s^2}$)
= 0,15 s | 0,01
~ 1,5 | Centimetrov nisi pretvoril v metre: $h = 0{,}11\,\text{m}$.
~ 0,022 | To je $\dfrac{2h}{g}$, torej $t^2$. Čas je koren tega števila.
> $t = \sqrt{\dfrac{2h}{g}} = \sqrt{\dfrac{2 \cdot 0{,}11}{9{,}81}} \approx 0{,}15\,\text{s}$.

? Telefon štirikrat zdrsne iz rok. Razvrsti padce po času padanja, od najkrajšega do najdaljšega. ($g$: Zemlja $9{,}81$; Mars $3{,}71$; Luna $1{,}62\,\mathrm{m/s^2}$)
1. z $0{,}8\,\text{m}$ na Zemlji
2. z $1{,}6\,\text{m}$ na Zemlji
3. z $0{,}8\,\text{m}$ na Marsu
4. z $0{,}8\,\text{m}$ na Luni
> Po $t = \sqrt{\dfrac{2h}{g}}$ so časi $0{,}40$; $0{,}57$; $0{,}66$ in $0{,}99\,\text{s}$. Dvakrat večja višina čas podaljša le $\sqrt{2} \approx 1{,}41$-krat, zato padec z $1{,}6\,\text{m}$ na Zemlji traja manj kot padec z $0{,}8\,\text{m}$ na Marsu.

? Z roba $25\,\text{m}$ visoke stavbe (kot v Primeru 3) vržemo kamen navpično navzgor s hitrostjo $10\,\mathrm{m/s}$. Os kaže navzgor, izhodišče je na robu. Kolikšna je lega $y$ kamna po $3\,\text{s}$? ($g = 9{,}81\,\mathrm{m/s^2}$)
= -14,1 m | 0,2
~ 14,1 | Velikost je prava, predznak ne. Os kaže navzgor, kamen pa je že pod robom, zato je lega negativna.
~ 74,1 | Člen z $g$ si prištel. Pri osi navzgor je $a = -g$: $y = v_0 t - \dfrac{g t^2}{2}$.
> $y = 10 \cdot 3 - 4{,}905 \cdot 3^2 = 30 - 44{,}1 = -14{,}1\,\text{m}$. Kamen je že $14{,}1\,\text{m}$ pod robom.

:::simboli
g | težni pospešek | | m/s^2 | približno 9,81 m/s²
v | hitrost | v = v_0 - g\,t | m/s | pri prostem padu $v = g\,t$
v_0 | začetna hitrost | | m/s | pri prostem padu v₀ = 0
t | čas | | s
a | pospešek | | m/s^2 | pri osi navzdol $a = g$, pri osi navzgor $a = -g$
s | premik (pri gibanju v eno smer enak poti) | | m | v Primeru 3 od roba stavbe do tal
h | višina padca (globina pod mestom spusta) | h = \dfrac{g t^2}{2} | m | velja pri $v_0 = 0$; v Primeru 3 padec z vrha do tal
y | višina (lega na navpični osi) | y = v_0\,t - \frac{g\,t^2}{2} | m | pri metu os y kaže navzgor
y_0 | začetna višina | | m
t_1 | čas vzpona do vrha (Primer 3) | t_1 = \dfrac{v_0}{g} | s
t_2 | čas padanja z vrha do tal (Primer 3) | t_2 = \sqrt{\dfrac{2h}{g}} | s
t_{\text{vrh}} | čas vzpona do vrha | t_\text{vrh} = \dfrac{v_0}{g} | s | celoten let traja $2\,t_\text{vrh}$
h_{\text{max}} | največja višina | h_\text{max} = \dfrac{v_0^2}{2g} | m
m | masa | | kg
F | sila | F = m\,a | N
F_g | sila teže | F_g = m\,g | N
:::
