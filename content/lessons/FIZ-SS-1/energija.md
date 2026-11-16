---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na izletu v Vrata stojiš pod slapom Peričnik. Spodnji slap pade približno $49\,\mathrm{m}$ globoko, zgornji le približno $15\,\mathrm{m}$ (geodetska izmera 2018–19; starejši vodniki navajajo $52\,\mathrm{m}$ in $16\,\mathrm{m}$). Sošolka Nika pogleda oba slapova in je prepričana: »Spodnji je več kot trikrat višji, zato voda na njegovem dnu drvi trikrat hitreje.« Zveni logično. Pa je res? Do konca lekcije boš to preveril s svinčnikom, brez merjenja.

Sila, ki deluje na telo med premikom, opravi delo $A = F s \cos\alpha$ ($\alpha$ je kot med silo in premikom). Na telesa blizu Zemlje deluje teža $F_g = mg$.

Z energijo lahko veliko problemov rešiš **brez podrobnega spremljanja gibanja**. Če poznaš višino, s katere se spustijo sani, lahko izračunaš njihovo hitrost na dnu, ne da bi poznal obliko pobočja.

## Razlaga

**1. Kaj je energija.** Energija je merilo za to, koliko dela lahko telo opravi oziroma koliko dela je bilo nad njim opravljenega. Označimo jo z $W$, enota je **joule**:

$$1\,\mathrm{J} = 1\,\mathrm{N\,m} = 1\,\mathrm{kg\,m^2/s^2}$$

Delo in energija sta povezana: **ko sila opravi delo, se energija telesa spremeni**. Kako natanko, pokažeta točki 6 in 7.

**2. Kinetična energija** je energija gibanja. Telo z maso $m$ in hitrostjo $v$ ima:

$$W_k = \frac{mv^2}{2}$$

Od kod ta izraz? Mirujoče telo pospešujemo s stalno silo $F = ma$ po poti $s$. Iz enakomerno pospešenega gibanja poznaš $v^2 = 2as$, torej $s = \dfrac{v^2}{2a}$. Sila opravi delo $A = Fs = ma \cdot \dfrac{v^2}{2a} = \dfrac{mv^2}{2}$, in to delo telo nosi s seboj kot kinetično energijo. Če se telo že giblje s hitrostjo $v_1$, enak račun z $v_2^2 - v_1^2 = 2as$ da $A = W_{k2} - W_{k1}$: delo rezultante je enako spremembi kinetične energije.

Hitrost nastopa v *kvadratu*. Pri dvakrat večji hitrosti je kinetična energija štirikrat večja.

**3. Potencialna (težna) energija** je energija zaradi lege telesa v težnostnem polju. Telo z maso $m$ na višini $h$ nad izbrano ničelno ravnjo ima:

$$W_p = mgh$$

Pri tem je $g = 9{,}8\,\mathrm{m/s^2}$. Izraz je spet delo: ko telo enakomerno dvignemo za $h$, ga vlečemo s silo, enako teži $mg$, in opravimo delo $mgh$. To delo je shranjeno v legi. Ničelno raven si izbereš sam (tla, miza, dno doline). Ker štejejo le **spremembe** potencialne energije, je vseeno, kje je ničla; v eni nalogi pa je ne menjaj.

:::premisli
Kamen pade s pečine na tla. Ali bi dobil drugačno hitrost ob tleh, če bi ničelno raven postavil na vrh pečine namesto na tla? Zakaj?
---
Ne. Z ničlo na vrhu ima kamen na začetku $W_p = 0$, na tleh pa negativno $W_p = -mgh$. V obeh primerih se potencialna energija zmanjša za $mgh$, in ravno ta se pretvori v kinetično.
:::

**4. Prožnostna energija** je energija raztegnjene ali stisnjene vzmeti. Če ima vzmet prožnostni koeficient $k$ in je raztegnjena ali stisnjena za $x$ glede na ravnovesno lego, velja:

$$W_{pr} = \frac{kx^2}{2}$$

Enota za $k$ je $\mathrm{N/m}$, za $x$ pa $\mathrm{m}$. Od kod polovica? Sila vzmeti ni stalna: iz lekcije o prožnosti veš, da raste z raztezkom, $F = kx$. Delo je zato ploščina pod grafom sile, to pa je trikotnik z osnovnico $x$ in višino $kx$.

:::risba graf
opis: Graf sile vzmeti F v newtonih v odvisnosti od raztezka x v metrih za vzmet s k = 200 N/m. Premica gre skozi izhodišče in doseže 20 N pri 0,10 m. Pobarvan trikotnik pod premico med 0 in 0,10 m ima ploščino ½ · 0,10 m · 20 N = 1,0 J; to je prožnostna energija vzmeti.
x: 0 .. 0,12 | 0,02 | x (m)
y: 0 .. 25 | 5 | F (N)
lik: 0; 0 -> 0,1; 0 -> 0,1; 20 | oranžna
f: 200*x | modra | 0 .. 0,12
točka: 0,1; 20 | (0,10 m; 20 N) | nad levo
napis: 0,075; 5 | W_{pr} = 1,0 J | sredina
podnapis: Ploščina trikotnika pod grafom F = kx je delo pri raztezanju ali stiskanju.
:::

Za vzmet s $k = 200\,\mathrm{N/m}$, raztegnjeno (ali stisnjeno) za $0{,}10\,\mathrm{m}$, je sila na koncu $20\,\mathrm{N}$ in ploščina $\dfrac{0{,}10 \cdot 20}{2} = 1{,}0\,\mathrm{J}$. Spet nastopa kvadrat: pri dvakrat večjem raztezku sta dvakrat daljša osnovnica in dvakrat višja višina, energija je štirikrat večja.

**5. Kaj se dogaja med padcem?** Veter s smreke, visoke $20\,\mathrm{m}$, odlomi suho vejo z maso $0{,}10\,\mathrm{kg}$. Upor zraka zanemarimo. Tabela kaže hitrost veje na štirih višinah. Za vsako višino izračunamo $W_p = mgh$ in $W_k = \dfrac{mv^2}{2}$:

| $h$ | $v$ | $W_p$ | $W_k$ |
|---|---|---|---|
| $20\,\mathrm{m}$ | $0$ | $19{,}6\,\mathrm{J}$ | $0$ |
| $15\,\mathrm{m}$ | $9{,}9\,\mathrm{m/s}$ | $14{,}7\,\mathrm{J}$ | $4{,}9\,\mathrm{J}$ |
| $5\,\mathrm{m}$ | $17{,}1\,\mathrm{m/s}$ | $4{,}9\,\mathrm{J}$ | $14{,}7\,\mathrm{J}$ |
| $0$ | $19{,}8\,\mathrm{m/s}$ | $0$ | $19{,}6\,\mathrm{J}$ |

Seštej $W_p$ in $W_k$ v vsaki vrstici. Vsota je vedno $19{,}6\,\mathrm{J}$. Kolikor potencialne energije veja izgubi, toliko kinetične pridobi.

:::premisli
Na kateri višini ima veja enako kinetične in potencialne energije? Napovej brez računanja.
---
Na $10\,\mathrm{m}$, na polovici višine. Tam mora imeti vsaka polovico vsote, $9{,}8\,\mathrm{J}$. Ker je $W_p = mgh$ sorazmerna z višino, ima polovico začetne vrednosti na polovici začetne višine. Preveri na grafu spodaj: premici se sekata pri $h = 10\,\mathrm{m}$.
:::

Graf pokaže isto za vse višine hkrati. Slika kaže vejo na $15\,\mathrm{m}$: $14{,}7\,\mathrm{J}$ potencialne in $4{,}9\,\mathrm{J}$ kinetične energije. V aplikaciji premikaj drsnik višine od $20\,\mathrm{m}$ proti tlom. Opazi, da se točka $W_k$ dvigne natanko toliko, kolikor se točka $W_p$ spusti, vsota pa ostane na črtkani črti pri $19{,}6\,\mathrm{J}$.

:::risba graf
opis: Graf energije veje z maso 0,10 kg v joulih v odvisnosti od višine h v metrih. Premica Wₚ = 0,98 · h narašča od 0 pri tleh do 19,6 J pri 20 m. Premica Wₖ pada od 19,6 J pri tleh do 0 pri 20 m. Vodoravna črtkana črta pri 19,6 J je njuna vsota. V aplikaciji drsnik premika vejo; točki na premicah sta označeni z Wₚ in Wₖ; izbrano je h = {h} m: Wₚ = {0,98*h:.1} J, Wₖ = {19,6-0,98*h:.1} J, skupaj 19,6 J.
x: 0 .. 27 | 5 | h (m)
y: 0 .. 24 | 4 | W (J)
drsnik: h | 0 .. 20 | 1 | 15 | višina veje h v metrih
f: 19,6 | siva črtkano | 0 .. 20
f: 0,98*x | modra | 0 .. 20
f: 19,6 - 0,98*x | oranžna | 0 .. 20
napis: 10; 19,6 | vsota 19,6 J | nad
črta: h; 0 -> h; 19,6 | siva črtkano
točka: h; 0,98*h | W_p | pod desno
točka: h; 19,6 - 0,98*h | W_k | nad desno
podnapis: h = {h} m: Wₚ = {0,98*h:.1} J, Wₖ = {19,6-0,98*h:.1} J
:::

**6. Ohranitev energije.** Zakaj je vsota stalna? Ko telo pade z višine $h_1$ na $h_2$, teža opravi delo $mg(h_1 - h_2)$, saj kaže v smeri premika. Po točki 2 se za toliko poveča kinetična energija: $W_{k2} - W_{k1} = mgh_1 - mgh_2 = W_{p1} - W_{p2}$. Kolikor $W_k$ pridobi, toliko $W_p$ izgubi; preuredimo in dobimo $W_{k1} + W_{p1} = W_{k2} + W_{p2}$.

Vzorec iz tabele torej velja splošno. Energije ni mogoče ustvariti ali uničiti, mogoče jo je le pretvarjati iz ene oblike v drugo ali prenašati med telesi. V sistemu, kjer ni trenja in upora, se **mehanska energija** ohranja:

$$W_k + W_p + W_{pr} = \text{konst.}$$

Za začetno (1) in končno stanje (2):

$$W_{k1} + W_{p1} + W_{pr1} = W_{k2} + W_{p2} + W_{pr2}$$

**7. Kaj pa trenje?** Če deluje trenje ali zračni upor, se mehanska energija zmanjšuje. Delo teže in sile vzmeti je že zajeto v $W_p$ in $W_{pr}$. Delo vseh drugih sil, na primer trenja, je enako spremembi mehanske energije $W = W_k + W_p + W_{pr}$:

$$A_{tr} = W_2 - W_1$$

Sani z otrokom (skupaj $40\,\mathrm{kg}$) se spustijo z griča, $10\,\mathrm{m}$ nad dnom, in imajo na dnu $8{,}0\,\mathrm{m/s}$. Na vrhu mirujejo, $W_1 = 40 \cdot 9{,}8 \cdot 10 = 3920\,\mathrm{J}$, na dnu $W_2 = \dfrac{40 \cdot 8{,}0^2}{2} = 1280\,\mathrm{J}$. Trenje je opravilo delo $A_{tr} = 1280\,\mathrm{J} - 3920\,\mathrm{J} = -2640\,\mathrm{J}$; negativno je, ker sila trenja nasprotuje gibanju. Brez trenja bi sani imele $14\,\mathrm{m/s}$.

Teh $2640\,\mathrm{J}$ **ni izginilo**: pretvorilo se je v notranjo energijo (sneg in drsnice se nekoliko segrejejo). Skupna energija se še vedno ohranja.

**8. Kako rešuješ naloge z energijo.**

1. Določi začetno in končno stanje.
2. Izberi ničelno raven za potencialno energijo.
3. Za vsako stanje zapiši, katere oblike energije so prisotne.
4. Izenači skupni energiji in izrazi neznanko.

V simulaciji spodaj (»Ohranitev mehanske energije«) spusti skejterja z roba rampe brez trenja in opazuj stolpce (simulacija energijo označi z $E$: $E_p$ je naša $W_p$, $E_k$ naša $W_k$). Kinetični stolpec raste toliko, kolikor potencialni pada. Nato povečaj trenje: skejter se ne vrne več do začetne višine, stolpec »skupaj« pa ostane enak, ker raste notranja energija (stolpec $Q$).

## Rešeni primeri

### Primer 1: kinetična energija avtomobila

Avto z maso $1000\,\mathrm{kg}$ vozi s hitrostjo $72\,\mathrm{km/h}$. Kolikšna je njegova kinetična energija? Kolikšna bi bila pri dvakrat večji hitrosti?

**Podatki:** $m = 1000\,\mathrm{kg}$, $v = 72\,\mathrm{km/h}$; v drugem delu dvakrat večja hitrost $2v$
**Iščemo:** kinetično energijo $W_k$ pri hitrosti $v$ in pri hitrosti $2v$

:::formula
$W_k = \dfrac{mv^2}{2}$ (hitrost mora biti v $\mathrm{m/s}$: $\mathrm{km/h}$ delimo s $3{,}6$)
:::

**Rešitev:**

1. **Pretvorba enot.** Formula zahteva $\mathrm{m/s}$: $72\,\mathrm{km/h} = 72 : 3{,}6 = 20\,\mathrm{m/s}$.
2. **Vstavimo:** $W_k = \dfrac{mv^2}{2} = \dfrac{1000 \cdot 20^2}{2} = \dfrac{1000 \cdot 400}{2} = 200\,000\,\mathrm{J} = 200\,\mathrm{kJ}$.
3. **Dvojna hitrost:** $v = 40\,\mathrm{m/s}$, $W_k = \dfrac{1000 \cdot 1600}{2} = 800\,000\,\mathrm{J} = 800\,\mathrm{kJ}$.
4. **Preverimo:** $800 : 200 = 4$, torej je energija res štirikrat večja. Zato je zaviranje pri veliki hitrosti tako dolgo: zavore morajo odvzeti štirikrat več energije.

### Primer 2: padec kamna

Po nočni zmrzali se s skalne stene odkruši kamen in pade z višine $5{,}0\,\mathrm{m}$ (začetna hitrost je $0$). S kolikšno hitrostjo zadene tla? Zanemari upor zraka.

**Podatki:** $h = 5{,}0\,\mathrm{m}$, $v_0 = 0$, $g = 9{,}8\,\mathrm{m/s^2}$, upor zraka zanemarimo
**Iščemo:** hitrost $v$ tik nad tlemi

:::formula
Ohranitev mehanske energije: $W_{p1} = W_{k2}$, torej $mgh = \dfrac{mv^2}{2}$
:::

**Rešitev:**

1. **Stanji.** (1) Kamen miruje na višini $h$. (2) Kamen je tik nad tlemi. Ničelno raven izberemo pri tleh.
2. **Energija v stanju 1:** $W_{k1} = 0$ (miruje), $W_{p1} = mgh$.
3. **Energija v stanju 2:** $W_{p2} = 0$ (višina je $0$), $W_{k2} = \dfrac{mv^2}{2}$.
4. **Ohranitev:** $mgh = \dfrac{mv^2}{2}$. Maso lahko krajšamo, zato hitrost ni odvisna od mase kamna.
5. **Izrazimo hitrost:** $v^2 = 2gh = 2 \cdot 9{,}8 \cdot 5{,}0 = 98\,\mathrm{m^2/s^2}$, torej $v = \sqrt{98} \approx 9{,}9\,\mathrm{m/s}$.
6. **Preverimo s tabelo veje:** tudi veja je od $20$ do $15\,\mathrm{m}$ padla $5\,\mathrm{m}$ in imela $9{,}9\,\mathrm{m/s}$. Mase kamna ne poznamo in je ne potrebujemo; hitrost je enaka kot pri veji z maso $0{,}10\,\mathrm{kg}$: masa res ne vpliva.

### Primer 3: vzmet izstreli telo

Vzmet s prožnostnim koeficientom $k = 200\,\mathrm{N/m}$ stisnemo za $x = 0{,}10\,\mathrm{m}$. Pred njo leži telo z maso $m = 0{,}050\,\mathrm{kg}$ na gladki vodoravni podlagi (brez trenja). Ko vzmet spustimo, izstreli telo.
a) S kolikšno hitrostjo telo zapusti vzmet?
b) Telo nato zdrsi po gladkem klancu navzgor. Do katere višine se dvigne?

:::risba skica
opis: Skica naloge. Levo je stena, nanjo pritrjena stisnjena vzmet s k = 200 N/m. Pod podlago je kotiran stisk x = 0,10 m: od stisnjenega konca vzmeti do lege, kjer bi bil konec nestisnjene vzmeti. Ob vzmeti je telo z maso 0,050 kg na vodoravni gladki podlagi. Puščica v kaže, da telo po izstrelitvi drsi v desno. Podlaga preide v gladek klanec; na klancu je označena točka, kjer se telo ustavi, na višini h nad podlago.
območje: 0; -1 .. 13; 5
pravokotnik: 0; 0,5 .. 0,4; 2,4 | siva
črta: 0,4; 0,5 -> 6; 0,5 -> 11; 4,5 | debelo
črta: 0,4; 1 -> 0,6; 1,3 -> 0,8; 0,7 -> 1; 1,3 -> 1,2; 0,7 -> 1,4; 1,3 -> 1,6; 0,7 -> 1,8; 1 | modra
pravokotnik: 1,8; 0,5 .. 2,8; 1,5 | oranžna
napis: 1,1; 1,6 | k | nad
napis: 2,3; 1,5 | m | nad
puščica: 3,2; 1 -> 4,8; 1 | v | nad
črta: 1,8; 0,5 -> 1,8; -0,5 | siva črtkano
črta: 2,8; 0,5 -> 2,8; -0,5 | siva črtkano
puščica: 1,8; -0,3 -> 2,8; -0,3 | x | pod
točka: 9,125; 3 | ustavi se | nad levo
črta: 9,125; 3 -> 12; 3 | siva črtkano
črta: 11; 0,5 -> 12; 0,5 | siva črtkano
puščica: 12; 0,5 -> 12; 3 | h | desno
:::

**Podatki:** $k = 200\,\mathrm{N/m}$, $x = 0{,}10\,\mathrm{m}$, $m = 0{,}050\,\mathrm{kg}$, $g = 9{,}8\,\mathrm{m/s^2}$, podlaga in klanec sta brez trenja
**Iščemo:** a) hitrost $v$, s katero telo zapusti vzmet; b) višino $h$, do katere se dvigne

:::formula
Ohranitev mehanske energije: $W_{pr} = \dfrac{kx^2}{2}$, $\dfrac{kx^2}{2} = \dfrac{mv^2}{2}$ (a) in $\dfrac{mv^2}{2} = mgh$ (b)
:::

**Rešitev:**

1. **Začetna energija (stisnjena vzmet):** $W_{pr} = \dfrac{kx^2}{2} = \dfrac{200 \cdot 0{,}10^2}{2} = \dfrac{200 \cdot 0{,}01}{2} = 1{,}0\,\mathrm{J}$.
2. **a) Vsa prožnostna energija se pretvori v kinetično:** $\dfrac{mv^2}{2} = 1{,}0\,\mathrm{J}$.
3. $v^2 = \dfrac{2 \cdot 1{,}0}{0{,}050} = 40\,\mathrm{m^2/s^2}$, zato $v = \sqrt{40} \approx 6{,}3\,\mathrm{m/s}$.
4. **b) Na vrhu se telo za trenutek ustavi,** vsa kinetična energija je postala potencialna: $mgh = 1{,}0\,\mathrm{J}$.
5. $h = \dfrac{1{,}0}{0{,}050 \cdot 9{,}8} = \dfrac{1{,}0}{0{,}49} \approx 2{,}0\,\mathrm{m}$.
6. **Preverimo:** pri obeh delih je skupna energija ves čas $1{,}0\,\mathrm{J}$, spremenila se je le njena oblika: prožnostna, kinetična, potencialna.

### Primer 4 – zdaj ti: Nikina trditev

Zdaj lahko presodiš, kar je Nika trdila pod Peričnikom. Vzemi novejši izmeri. Voda na robu skoraj miruje. Kolikšna je hitrost vode na dnu spodnjega slapa ($49\,\mathrm{m}$) in kolikšna na dnu zgornjega ($15\,\mathrm{m}$)? Je prva res trikrat večja? Upor zraka zanemari.

**Podatki:** $h_1 = 49\,\mathrm{m}$ (spodnji slap), $h_2 = 15\,\mathrm{m}$ (zgornji slap), začetna hitrost $0$, $g = 9{,}8\,\mathrm{m/s^2}$, upor zraka zanemarimo
**Iščemo:** hitrosti $v_1$ in $v_2$ na dnu slapov in njuno razmerje

:::formula
$mgh = \dfrac{mv^2}{2}$, torej $v = \sqrt{2gh}$
:::

**Rešitev:**

1. **Ohranitev:** potencialna energija vode na vrhu se do dna pretvori v kinetično; masa se pokrajša, zato velja za vsako kapljo enako.
2. **Zgornji slap:** $v_2^2 = 2gh_2 = 2 \cdot 9{,}8 \cdot 15 = 294\,\mathrm{m^2/s^2}$, zato $v_2 = \sqrt{294} \approx 17{,}1\,\mathrm{m/s}$.
3. **Spodnji slap:** $v_1^2 = 2gh_1 = 2 \cdot 9{,}8 \cdot 49 = 960{,}4\,\mathrm{m^2/s^2}$.
4. Izračunaj $v_1$ in obe hitrosti primerjaj.

:::premisli
Koliko je $v_1$ in kaj to pomeni za Nikino trditev?
---
$v_1 = \sqrt{960{,}4} \approx 31{,}0\,\mathrm{m/s}$. Razmerje $31{,}0 : 17{,}1 \approx 1{,}8$: voda ni trikrat hitrejša, ampak le približno $1{,}8$-krat. Približno $3{,}3$-krat večja sta višina in **energija** vsakega kilograma vode, hitrost pa raste s korenom višine ($\sqrt{3{,}3} \approx 1{,}8$). Nika se moti. Voda se v padcu razprši v kaplje, zato jo zrak opazno zavre; prava hitrost je manjša, razmerje pa ostane pod $3$.
:::

## Pogoste napake

- **»Trikrat višje, trikrat hitreje.«** Tako je sklepala Nika. Z višino sorazmerno raste energija, hitrost pa le s korenom višine: $v = \sqrt{2gh}$. Pri dvakrat večji višini je hitrost le $\sqrt{2} \approx 1{,}41$-krat večja. Na grafu spodaj je točka A na višini $15\,\mathrm{m}$ ($17{,}1\,\mathrm{m/s}$), točka B na dvakrat večji višini $30\,\mathrm{m}$ ($24{,}2\,\mathrm{m/s}$). V aplikaciji premikaj drsnik višine: B je vedno dvakrat višje od A, razmerje hitrosti pa ostane $1{,}41$. Popravek: najprej primerjaj energije, šele nato iz njih izračunaj hitrosti.
- **Pozabljen kvadrat ali faktor $\tfrac12$.** Za $m = 2\,\mathrm{kg}$ in $v = 3\,\mathrm{m/s}$ je $W_k = 9\,\mathrm{J}$. Kdor računa $mv$, dobi $6\,\mathrm{kg\,m/s}$: to je gibalna količina, ne energija. Kdor pozabi na $2$ in računa $mv^2$, dobi $18\,\mathrm{J}$. Pri $W_k$ in $W_{pr}$ je kvadrat samo na $v$ oziroma $x$, cel izraz pa delimo z $2$. Popravek: formulo napiši, preden vstaviš števila. Pazi tudi na enote: $\mathrm{km/h}$ najprej deli s $3{,}6$.
- **Raztezek $x$ zamenjaš z dolžino vzmeti.** Vzmet je dolga $15\,\mathrm{cm}$ in jo stisneš na $10\,\mathrm{cm}$; v formulo spada $x = 0{,}05\,\mathrm{m}$, ne $0{,}15\,\mathrm{m}$ ali $0{,}10\,\mathrm{m}$. Energija je odvisna od spremembe dolžine glede na ravnovesno lego.
- **»Energija se izgubi.«** Sani po mehkem snegu pridejo na dno počasneje, zato se zdi, da je energija izginila. V resnici se je del mehanske energije pretvoril v notranjo: sneg in drsnice se rahlo segrejejo. Popravek: reci »mehanska energija se zmanjša«, skupna se ohranja.
- **»Težji kamen pade hitreje.«** Težji kamen ima res več potencialne energije, a tudi več mase, ki jo mora pospešiti. V $mgh = \dfrac{mv^2}{2}$ se masa pokrajša. Brez upora zraka težji in lažji kamen padeta z enako hitrostjo.

:::risba graf
opis: Graf hitrosti v v metrih na sekundo, ki jo telo doseže pri padcu z višine h v metrih brez upora zraka: krivulja v = √(2gh) narašča vse počasneje. Točka A je na višini {h} m s hitrostjo {sqrt(196*h/10):.1} m/s, točka B na dvakrat večji višini {2*h} m s hitrostjo {sqrt(392*h/10):.1} m/s. V aplikaciji se višina A spreminja z drsnikom; razmerje hitrosti je vedno 1,41.
x: 0 .. 120 | 20 | h (m)
y: 0 .. 50 | 10 | v (m/s)
drsnik: h | 10 .. 50 | 5 | 15 | višina točke A v metrih
f: sqrt(196*x/10) | modra | 0 .. 120
črta: h; 0 -> h; sqrt(196*h/10) | siva črtkano
črta: 2*h; 0 -> 2*h; sqrt(392*h/10) | siva črtkano
točka: h; sqrt(196*h/10) | A | nad levo
točka: 2*h; sqrt(392*h/10) | B | nad levo
podnapis: A: {h} m, {sqrt(196*h/10):.1} m/s; B: {2*h} m, {sqrt(392*h/10):.1} m/s; razmerje {sqrt(392*h/10)/sqrt(196*h/10):.2}
:::

## Povzetek

- Energija ima enoto joule ($\mathrm{J}$). Delo rezultante je enako spremembi kinetične energije.
- Kinetična energija: $W_k = \dfrac{mv^2}{2}$.
- Potencialna (težna) energija: $W_p = mgh$, višino merimo od izbrane ničelne ravni.
- Prožnostna energija: $W_{pr} = \dfrac{kx^2}{2}$.
- Brez trenja in upora se mehanska energija ohranja: $W_k + W_p + W_{pr} = \text{konst.}$ Delo trenja je enako spremembi mehanske energije, $A_{tr} = W_2 - W_1 < 0$; ta del postane notranja energija, skupna se ohranja.
- Pri nalogah: določi stanji, izberi ničelno raven, zapiši energije in jih izenači.

## Drugače: Korak za korakom s številkami

Sledimo telesu iz Primera 3 ($m = 0{,}050\,\mathrm{kg}$, $k = 200\,\mathrm{N/m}$) od stisnjene vzmeti do vrha klanca. V vsaki vrstici je vsota vseh treh energij $1{,}0\,\mathrm{J}$.

| Stanje | $W_{pr}$ | $W_k$ | $W_p$ |
|---|---|---|---|
| stisk $0{,}10\,\mathrm{m}$, miruje | $1{,}0\,\mathrm{J}$ | $0$ | $0$ |
| stisk še $0{,}05\,\mathrm{m}$ | $0{,}25\,\mathrm{J}$ | $0{,}75\,\mathrm{J}$ | $0$ |
| zapusti vzmet | $0$ | $1{,}0\,\mathrm{J}$ | $0$ |
| na klancu, $h = 1{,}0\,\mathrm{m}$ | $0$ | $0{,}51\,\mathrm{J}$ | $0{,}49\,\mathrm{J}$ |
| vrh, $h = 2{,}0\,\mathrm{m}$ | $0$ | $0$ | $1{,}0\,\mathrm{J}$ |

Kaj povedo števila:

- Ko se vzmet sprosti do polovice, ima le še četrtino energije, $\dfrac{200 \cdot 0{,}05^2}{2} = 0{,}25\,\mathrm{J}$. Kvadrat deluje tudi navzdol.
- Zato ima telo že takrat $0{,}75\,\mathrm{J}$ kinetične energije in hitrost $v = \sqrt{\dfrac{2 \cdot 0{,}75}{0{,}050}} \approx 5{,}5\,\mathrm{m/s}$, skoraj toliko kot končnih $6{,}3\,\mathrm{m/s}$.
- Na polovici višine klanca je hitrost $v = \sqrt{\dfrac{2 \cdot 0{,}51}{0{,}050}} \approx 4{,}5\,\mathrm{m/s}$, ne polovica od $6{,}3\,\mathrm{m/s}$.

## Drugače: Kot zgodba

Kapljica vode leži v mlaki ob morju. Sonce jo segreje, izhlapi in z vlažnim zrakom se dvigne v oblak. Energijo za dvig je dalo Sonce; v oblaku ima zdaj veliko potencialne energije.

Nad gorami pade kot dež. Zrak jo močno zavira: del njene energije postane notranja energija zraka, zato pade razmeroma počasi.

Po potoku priteče do slapa. Na robu ima še $W_p$ glede na tolmun spodaj, v padcu se ta spremeni v $W_k$. Brez upora bi imela na dnu $20$-metrskega slapa skoraj $20\,\mathrm{m/s}$, a curek se razprši in spet ga zavira zrak.

V tolmunu se pljusk umiri. Kinetična energija ni izginila: voda in kamni so za malenkost toplejši. Energija ni nastala iz nič in ni izginila, le spreminjala je obliko.

## Preveri se

? Po zimski nevihti se s strehe odlomi ledena sveča. Brez upora zraka bi ob tleh imela hitrost $36\,\mathrm{km/h}$. S kolikšne višine je padla?
= 5,1 m | 0,1
~ 66 | Hitrosti nisi pretvoril v $\mathrm{m/s}$: $36\,\mathrm{km/h} = 10\,\mathrm{m/s}$.
~ 10,2 | Pozabil si na $2$: iz $mgh = \dfrac{mv^2}{2}$ sledi $h = \dfrac{v^2}{2g}$, ne $\dfrac{v^2}{g}$.
~ 0,51 | Hitrosti nisi kvadriral: $h = \dfrac{v^2}{2g}$.
> $36\,\mathrm{km/h} = 36 : 3{,}6 = 10\,\mathrm{m/s}$. Iz $mgh = \dfrac{mv^2}{2}$ je $h = \dfrac{v^2}{2g} = \dfrac{100}{19{,}6} \approx 5{,}1\,\mathrm{m}$. Masa se pokrajša, zato je ne potrebujemo.

? Maja je izračunala prožnostno energijo vzmeti s $k = 100\,\mathrm{N/m}$, stisnjene za $0{,}20\,\mathrm{m}$: »$W_{pr} = k x^2 = 100 \cdot 0{,}04 = 4\,\mathrm{J}$.« Kje je napaka?
- Napake ni, rezultat je pravilen.
~ Račun $100 \cdot 0{,}04$ je res $4$, a formula je napačna: manjka deljenje z $2$.
+ Pozabila je deliti z $2$; prav je $2\,\mathrm{J}$.
- Raztezek bi morala vstaviti v centimetrih, torej $x = 20$.
~ V formuli so osnovne enote: $k$ v $\mathrm{N/m}$, zato $x$ v metrih. S centimetri bi po svoji formuli dobila $100 \cdot 20^2 = 40\,000\,\mathrm{J}$.
- Kvadrirati bi morala $k$, ne $x$.
~ Kvadrat je na raztezku: energija narašča s kvadratom stiska, s $k$ pa sorazmerno.
> $W_{pr} = \dfrac{kx^2}{2} = \dfrac{100 \cdot 0{,}04}{2} = 2\,\mathrm{J}$. Polovica izhaja iz tega, da sila vzmeti med stiskanjem narašča od $0$ do $kx$: delo je ploščina trikotnika.

? Kamen vržeš poševno navzgor po pobočju. Stolpci kažejo njegovo potencialno in kinetično energijo v točki A ter potencialno energijo v višji točki B. Upor zraka zanemari. Koliko kinetične energije ima kamen v točki B?
:::risba stolpci
opis: Stolpčni diagram z vrednostmi v joulih. Potencialna energija v točki A je 30 J, kinetična energija v točki A 50 J, potencialna energija v točki B 60 J.
stolpec: W_p (A) | 30
stolpec: W_k (A) | 50
stolpec: W_p (B) | 60
os: W (J)
korak: 10
:::
= 20 J | 0,5
~ 50 | Kinetična energija se ni ohranila sama: kamen se je dvignil, zato je del kinetične postal potencialna.
~ 30 | To je le sprememba potencialne energije, $60 - 30$. Kinetična energija v B je vsota v A minus potencialna v B.
~ 140 | Energij ne seštevaš iz obeh točk. Skupna energija je v vsaki točki enaka, $80\,\mathrm{J}$.
> Skupna energija v A je $30\,\mathrm{J} + 50\,\mathrm{J} = 80\,\mathrm{J}$ in se ohranja. V B je $W_k = 80\,\mathrm{J} - 60\,\mathrm{J} = 20\,\mathrm{J}$.

? Razvrsti telesa od najmanjše do največje kinetične energije.
1. skala: $4\,\mathrm{kg}$; $1\,\mathrm{m/s}$
2. kepa snega: $1\,\mathrm{kg}$; $3\,\mathrm{m/s}$
3. kamen: $2\,\mathrm{kg}$; $3\,\mathrm{m/s}$
4. kamenček: $0{,}5\,\mathrm{kg}$; $8\,\mathrm{m/s}$
> Energije so $2\,\mathrm{J}$; $4{,}5\,\mathrm{J}$; $9\,\mathrm{J}$ in $16\,\mathrm{J}$. Najlažji kamenček ima največ energije, ker hitrost nastopa v kvadratu, masa pa le linearno.

? Sani se spustijo po zasneženem pobočju in na dnu so počasnejše, kot bi bile brez trenja. Katera trditev drži?
+ Mehanska energija se je zmanjšala, skupna energija pa se je ohranila.
- Del energije je med vožnjo izginil.
~ Energija ne izgine. Manjka le mehanska energija; ta se je pretvorila v notranjo.
- Mehanska energija se je ohranila, sani so le težje.
~ Masa sani se ni spremenila. Mehanska energija se pri trenju zmanjša.
- Brez trenja bi bile težje sani na dnu hitrejše od lažjih.
~ Brez trenja se masa v $mgh = \dfrac{mv^2}{2}$ pokrajša: vse sani bi imele enako hitrost.
> Trenje pretvarja del mehanske energije v notranjo energijo snega in drsnic, zato sani na dnu nimajo vse začetne potencialne energije v obliki kinetične. Skupna energija se ohranja.

? Zrno toče s premerom $1\,\mathrm{cm}$ pade iz oblaka, ki je $1\,\mathrm{km}$ nad tlemi. Brez upora zraka bi priletelo s hitrostjo $v = \sqrt{2gh} = 140\,\mathrm{m/s}$. Po eni od meteoroloških ocen tako zrno v resnici pade s približno $9\,\mathrm{m/s}$. Zakaj?
- Ker energija toče med padcem izgine.
~ Energija ne izgine; pretvori se v drugo obliko.
- Ker je bila potencialna energija na začetku manjša od $mgh$.
~ Na višini $1\,\mathrm{km}$ je $W_p = mgh$, to se ne spremeni. Razlika nastane med padcem.
- Ker hitrost raste sorazmerno z višino, ne s korenom višine.
~ Z višino sorazmerno raste energija; hitrost brez upora bi rasla s korenom višine. Ta zveza razlike ne pojasni.
+ Ker zračni upor skoraj vso potencialno energijo pretvori v notranjo energijo zraka in toče.
> Pri dolgem padcu zračni upor ni zanemarljiv. Pri $9\,\mathrm{m/s}$ ima toča le $(9/140)^2 \approx 0{,}004$, torej okoli $0{,}4\,\%$ kinetične energije, ki bi jo imela brez upora. Ostalo je postalo notranja energija; skupna energija ostane enaka, ker se zrak in toča malo segrejeta.

<<RACUN
vrednost: 72/3.6 | 20
vrednost: 1000*20^2/2 | 200000
vrednost: 1000*40^2/2 | 800000
vrednost: sqrt(2*9.8*5.0) | 9.9
vrednost: 200*0.10^2/2 | 1.0
vrednost: sqrt(2*1.0/0.050) | 6.3
vrednost: 1.0/(0.050*9.8) | 2.0
vrednost: sqrt(2*9.8*15) | 17.1
vrednost: sqrt(2*9.8*49) | 31.0
vrednost: 0.10*9.8*20 | 19.6
vrednost: 0.10*9.8*10 | 9.8
vrednost: 0.10*9.8*5 | 4.9
vrednost: 0.10*9.8*15 | 14.7
vrednost: (9/140)^2 | 0.004
vrednost: 36/3.6 | 10
vrednost: 10^2/(2*9.8) | 5.1
vrednost: 40*9.8*10 | 3920
vrednost: 40*8.0^2/2 | 1280
vrednost: 1280-3920 | -2640
vrednost: sqrt(2*9.8*10) | 14
vrednost: 200*0.05^2/2 | 0.25
vrednost: sqrt(2*0.75/0.050) | 5.5
vrednost: 0.050*9.8*1.0 | 0.49
vrednost: sqrt(2*0.51/0.050) | 4.5
vrednost: 30+50-60 | 20
vrednost: 0.5*8^2/2 | 16
vrednost: sqrt(2*9.8*1000) | 140
vrednost: 100*0.20^2/2 | 2
>>

:::simboli
W_k | kinetična energija | W_k = \dfrac{mv^2}{2} | J | hitrost vstavimo v m/s
W_p | potencialna energija | W_p = mgh | J | višino merimo od izbrane ničelne ravni
W_{pr} | prožnostna energija | W_{pr} = \dfrac{kx^2}{2} | J
W_{k1}, W_{p1}, W_{pr1} | kinetična, potencialna, prožnostna energija v stanju 1 | | J
W_{k2}, W_{p2}, W_{pr2} | kinetična, potencialna, prožnostna energija v stanju 2 | | J
m | masa | | kg
v | hitrost | | m/s
g | težni pospešek | | m/s^2 | 9,8 m/s²
h | višina nad ničelno ravnjo | | m
h_1, h_2 | višina v stanju 1 in 2; pri slapovih $49\,\mathrm{m}$ in $15\,\mathrm{m}$ | | m
v_1, v_2 | hitrost v stanju 1 in 2; pri slapovih hitrost vode na dnu | | m/s
v_0 | začetna hitrost | | m/s
W | mehanska energija | W = W_k + W_p + W_{pr} | J
W_1, W_2 | mehanska energija v stanju 1 in 2 | | J
A_{tr} | delo trenja | A_{tr} = W_2 - W_1 | J | negativno, ker trenje nasprotuje gibanju
F_g | teža | F_g = mg | N
k | prožnostni koeficient vzmeti | | N/m
x | raztezek ali skrček vzmeti | | m | glede na ravnovesno lego
E_p, E_k | potencialna in kinetična energija v simulaciji (pri nas W_p, W_k) | | J
Q | notranja energija (toplota), ki nastane zaradi trenja | | J
\alpha | kot med silo in premikom | | °
A | delo | A = F s \cos\alpha | J | delo rezultante je enako spremembi $W_k$
F | sila | | N
s | pot | | m
a | pospešek | a = F/m | m/s^2
:::
