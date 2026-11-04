---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V šolski kuhinji visi na kljuki stara tehtnica z vzmetjo in kavljem. Na kavelj obesiš vrečko krompirja, vzmet se raztegne, kazalec pokaže maso. Sošolec Jan je prepričan: »Če obesim dve enaki vzmeti eno pod drugo, bo tehtnica dvakrat trša. Vzmeti je pač dvakrat več.«

Ima prav? Odgovor ni očiten, a ga boš do konca lekcije znal izračunati. Vzmeti so v kuhinji povsod: v tehtnici, v zapiralu predala, v gumbu toasterja, v sponki za vrečke. Vsaka deluje po istem preprostem pravilu. Ko ga poznaš, iz enega merjenja napoveš, kako se vzmet obnaša pri vsaki drugi obremenitvi, in znaš sestaviti vzmet, ki je mehkejša ali trša od tiste, ki jo imaš.

## Razlaga

**1. Merimo.** Na vzmet obešamo kozarce z začimbami, katerih teža je znana. **Raztezek** $x$ je to, za kolikor se vzmet podaljša glede na dolžino, ko ne visi nič na njej. Ni celotna dolžina vzmeti.

| $F$ [N] | $x$ [cm] | $F/x$ [N/cm] |
|---|---|---|
| 1 | 1,25 | 0,8 |
| 2 | 2,5 | 0,8 |
| 3 | 3,75 | 0,8 |
| 4 | 5 | 0,8 |

Poglej drugi stolpec. Ko sila naraste na dvakratno, se tudi raztezek podvoji. Pri trikratni sili je raztezek trikraten. Količnik v tretjem stolpcu je ves čas enak.

:::premisli
Na isto vzmet obesimo lonček s težo $6\,\mathrm{N}$. Kolikšen bo raztezek? Napovej iz tabele.
---
$7{,}5\,\mathrm{cm}$. Vsak newton raztegne vzmet za $1{,}25\,\mathrm{cm}$, šest newtonov torej šestkrat toliko. Do istega pridemo s $6\,\mathrm{N} : 0{,}8\,\mathrm{N/cm}$.
:::

**2. Pravilo.** Opažanje velja za vsako vzmet, dokler je ne raztegnemo preveč. Imenujemo ga **Hookov zakon**: sila, s katero raztezamo vzmet, je premo sorazmerna z raztezkom.

$$F = k\,x$$

Stalni količnik $k$ je **prožnostni koeficient** vzmeti (pravimo tudi koeficient vzmeti). Pove, kolikšna sila je potrebna za raztezek ene enote. Enota je $\mathrm{N/m}$. Naša vzmet ima $k = 0{,}8\,\mathrm{N/cm} = 80\,\mathrm{N/m}$.

Graf $F(x)$ je premica skozi izhodišče. Pri trši vzmeti je premica bolj strma: za enak raztezek potrebuješ večjo silo. Mehka vzmet iz kemičnega svinčnika ima $k$ nekaj sto $\mathrm{N/m}$, vzmet v avtomobilskem blažilniku pa več deset tisoč.

**3. Meja prožnosti.** Telo je **prožno**, če se po razbremenitvi vrne v prvotno obliko. Vzmet je prožna le do neke sile. Če jo preobremeniš, ostane trajno podaljšana in Hookov zakon zanjo ne velja več. Tej meji pravimo **meja prožnosti**.

V simulaciji spodaj (Laboratorij: Hookov zakon in meja prožnosti) obešaj uteži eno za drugo in beri raztezek. Opazuj, pri kateri obremenitvi točke na grafu prenehajo ležati na premici in kaj se zgodi, ko uteži snameš.

**4. Dve vzmeti.** Vzmeti lahko povežemo na dva načina:

- **Zaporedno**: ena visi pod drugo, breme na spodnji. Obe vzmeti nosita **celotno** težo bremena, zato se raztegne vsaka zase. Skupni raztezek je vsota obeh: $x = x_1 + x_2$.
- **Vzporedno**: vzmeti visita druga ob drugi, breme pa na prečki, ki ju povezuje. Obe se raztegneta **enako**, teža pa se razdeli: $F = F_1 + F_2$.

Iz teh dveh opažanj sledi koeficient sestavljene vzmeti. Pri vzporedni vezavi je $F = k_1 x + k_2 x$, zato se koeficienta seštejeta:

$$k_\mathrm{v} = k_1 + k_2$$

Pri zaporedni je $x = \dfrac{F}{k_1} + \dfrac{F}{k_2}$ in hkrati $x = \dfrac{F}{k_\mathrm{z}}$. Ko obe strani delimo s $F$, se seštejeta obratni vrednosti:

$$\frac{1}{k_\mathrm{z}} = \frac{1}{k_1} + \frac{1}{k_2}$$

Za dve vzmeti lahko to zapišemo tudi kot $k_\mathrm{z} = \dfrac{k_1 k_2}{k_1 + k_2}$.

:::premisli
Vrnimo se k Janu. Dve enaki vzmeti s koeficientom $k$ obesiš eno pod drugo. Ali je sestavljena vzmet trša ali mehkejša od ene same, in zakaj?
---
Mehkejša, s koeficientom $\dfrac{k}{2}$. Vsaka vzmet nosi celo breme in se raztegne toliko kot sama, skupni raztezek je torej dvakraten. Ista sila, dvakratni raztezek: koeficient je pol manjši. Jan bi imel prav pri vzporedni vezavi.
:::

V simulaciji spodaj (Zaporedna in vzporedna vezava vzmeti) obesi isto utež najprej na eno vzmet, nato na dve zaporedni in na dve vzporedni. Primerjaj raztezke.

## Rešeni primeri

### Primer 1: koliko tehta čebula

Vzmet kuhinjske tehtnice ima prožnostni koeficient $400\,\mathrm{N/m}$. Ko na kavelj obesiš mrežo čebule, se vzmet raztegne za $3\,\mathrm{cm}$. S kolikšno silo čebula vleče vzmet?

**Podatki:** $k = 400\,\mathrm{N/m}$, $x = 3\,\mathrm{cm}$
**Iščemo:** silo $F$

:::formula
Hookov zakon: $F = k\,x$
:::

**Rešitev:**

1. Raztezek pretvorimo v metre, ker je $k$ podan v $\mathrm{N/m}$: $x = 3\,\mathrm{cm} = 0{,}03\,\mathrm{m}$.
2. Vstavimo: $F = 400\,\mathrm{N/m} \cdot 0{,}03\,\mathrm{m} = 12\,\mathrm{N}$.
3. Odgovor: čebula vleče vzmet s silo $12\,\mathrm{N}$, kar ustreza masi približno $1{,}2\,\mathrm{kg}$.

### Primer 2: koeficient iz enega merjenja

Na vzmet obesiš lonec z maso $1{,}2\,\mathrm{kg}$. Vzmet se raztegne za $4{,}0\,\mathrm{cm}$. Kolikšen je njen prožnostni koeficient?

**Podatki:** $m = 1{,}2\,\mathrm{kg}$, $x = 4{,}0\,\mathrm{cm}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** prožnostni koeficient $k$

:::formula
Sila na vzmet je teža lonca, $F_\mathrm{g} = m\,g$; nato $k = \dfrac{F}{x}$
:::

**Rešitev:**

1. Lonec miruje, zato vzmet vleče s silo, enako njegovi teži: $F_\mathrm{g} = 1{,}2\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} = 11{,}772\,\mathrm{N}$.
2. Raztezek v metrih: $x = 0{,}040\,\mathrm{m}$.
3. $k = \dfrac{11{,}772\,\mathrm{N}}{0{,}040\,\mathrm{m}} = 294{,}3\,\mathrm{N/m}$.
4. Odgovor: koeficient vzmeti je približno $290\,\mathrm{N/m}$ (na dve mesti, kot sta podana podatka).

### Primer 3: košarica na dveh vzmeteh

Košarico za sadje s težo $24\,\mathrm{N}$ obesiš na dve zaporedno vezani vzmeti. Zgornja ima koeficient $300\,\mathrm{N/m}$, spodnja $600\,\mathrm{N/m}$. Za koliko se raztegne vsaka vzmet in za koliko se košarica spusti? Preveri rezultat s formulo za zaporedno vezavo.

**Podatki:** $F = 24\,\mathrm{N}$, $k_1 = 300\,\mathrm{N/m}$, $k_2 = 600\,\mathrm{N/m}$, vezava zaporedna
**Iščemo:** raztezka $x_1$, $x_2$ in skupni raztezek $x$

:::formula
Vsaka vzmet nosi celo težo: $x_1 = \dfrac{F}{k_1}$, $x_2 = \dfrac{F}{k_2}$, $x = x_1 + x_2$; preizkus z $k_\mathrm{z} = \dfrac{k_1 k_2}{k_1 + k_2}$
:::

**Rešitev:**

1. Zgornja vzmet drži košarico in spodnjo vzmet. Spodnja vzmet je zelo lahka, zato tudi zgornjo vleče $24\,\mathrm{N}$: $x_1 = \dfrac{24\,\mathrm{N}}{300\,\mathrm{N/m}} = 0{,}08\,\mathrm{m}$.
2. Spodnja vzmet: $x_2 = \dfrac{24\,\mathrm{N}}{600\,\mathrm{N/m}} = 0{,}04\,\mathrm{m}$. Trša vzmet se raztegne manj.
3. Skupaj: $x = 0{,}08\,\mathrm{m} + 0{,}04\,\mathrm{m} = 0{,}12\,\mathrm{m}$.
4. Preizkus: $k_\mathrm{z} = \dfrac{300 \cdot 600}{300 + 600} = 200$, torej $200\,\mathrm{N/m}$, in $\dfrac{24\,\mathrm{N}}{200\,\mathrm{N/m}} = 0{,}12\,\mathrm{m}$. Ujema se.
5. Odgovor: zgornja vzmet se raztegne za $8\,\mathrm{cm}$, spodnja za $4\,\mathrm{cm}$, košarica se spusti za $12\,\mathrm{cm}$. Sestavljena vzmet je mehkejša od vsake posebej.

### Primer 4: zdaj ti

Isto košarico ($24\,\mathrm{N}$) zdaj obesiš na prečko, ki visi na istih dveh vzmeteh vzporedno. Prečka ostane vodoravna. Za koliko se košarica spusti?

**Podatki:** $F = 24\,\mathrm{N}$, $k_1 = 300\,\mathrm{N/m}$, $k_2 = 600\,\mathrm{N/m}$, vezava vzporedna
**Iščemo:** raztezek $x$

:::formula
$k_\mathrm{v} = k_1 + k_2$, nato $x = \dfrac{F}{k_\mathrm{v}}$
:::

**Rešitev:**

1. Vzmeti se raztegneta enako, sila se razdeli, zato koeficienta seštejemo: $k_\mathrm{v} = 300\,\mathrm{N/m} + 600\,\mathrm{N/m} = 900\,\mathrm{N/m}$.
2. Izračunaj raztezek sam, nato preveri:

:::premisli
Koliko je $x = \dfrac{24\,\mathrm{N}}{900\,\mathrm{N/m}}$ v centimetrih?
---
$x \approx 0{,}027\,\mathrm{m} \approx 2{,}7\,\mathrm{cm}$. To je več kot štirikrat manj kot pri zaporedni vezavi ($12\,\mathrm{cm}$).
:::

## Pogoste napake

- **Dolžina namesto raztezka.** Vzmet je brez bremena dolga $10\,\mathrm{cm}$, z bremenom $14\,\mathrm{cm}$. Kdor v $F = k\,x$ vstavi $14\,\mathrm{cm}$, misli, da je $x$ dolžina vzmeti. Sila pa je sorazmerna s **podaljšanjem**: $x = 4\,\mathrm{cm}$.
- **Masa namesto sile.** Pri loncu z $1{,}2\,\mathrm{kg}$ in raztezku $0{,}04\,\mathrm{m}$ nekdo izračuna $\dfrac{1{,}2}{0{,}04} = 30$ in zapiše $30\,\mathrm{N/m}$. Masa ni sila. Vzmet vleče teža $m\,g$, zato je pravilno približno $290\,\mathrm{N/m}$.
- **Centimetri v formuli z N/m.** Kdor $3\,\mathrm{cm}$ vstavi kot $3$, dobi stokrat preveliko silo. Pred računanjem pretvori v metre.
- **»Več vzmeti, vedno trše.«** To je Janova zmota. Res je le pri vzporedni vezavi. Pri zaporedni vsaka vzmet nosi celotno breme in raztezka se seštejeta, zato je sestav mehkejši.
- **Hookov zakon brez meje.** Premo sorazmerje velja le do meje prožnosti. Preobremenjena vzmet ostane podaljšana in napovedi iz $k$ ne veljajo več.

## Povzetek

- Raztezek $x$ je podaljšanje vzmeti glede na dolžino brez bremena.
- Hookov zakon: $F = k\,x$; sila in raztezek sta premo sorazmerna, graf $F(x)$ je premica skozi izhodišče.
- Prožnostni koeficient $k$ v $\mathrm{N/m}$ pove, kako trda je vzmet.
- Zakon velja do meje prožnosti; čez njo ostane vzmet trajno deformirana.
- Vzporedna vezava: enak raztezek, sili se seštejeta, $k_\mathrm{v} = k_1 + k_2$ (trše).
- Zaporedna vezava: enaka sila, raztezka se seštejeta, $\dfrac{1}{k_\mathrm{z}} = \dfrac{1}{k_1} + \dfrac{1}{k_2}$ (mehkejše).
- Pred računanjem: maso pretvori v težo $m\,g$, centimetre v metre.

## Drugače: Korak za korakom s številkami

Vzemimo vzmet s $k = 200\,\mathrm{N/m}$ in breme $6\,\mathrm{N}$.

1. Ena vzmet: $x = \dfrac{6\,\mathrm{N}}{200\,\mathrm{N/m}} = 0{,}03\,\mathrm{m}$, torej $3\,\mathrm{cm}$.
2. Dve taki vzmeti zaporedno: vsaka nosi $6\,\mathrm{N}$ in se raztegne za $3\,\mathrm{cm}$. Skupaj $6\,\mathrm{cm}$. Sila $6\,\mathrm{N}$ in raztezek $0{,}06\,\mathrm{m}$ dasta $k_\mathrm{z} = 100\,\mathrm{N/m}$, pol manj.
3. Dve taki vzmeti vzporedno: vsaka nosi polovico, $3\,\mathrm{N}$, in se raztegne za $1{,}5\,\mathrm{cm}$. Sila $6\,\mathrm{N}$ in raztezek $0{,}015\,\mathrm{m}$ dasta $k_\mathrm{v} = 400\,\mathrm{N/m}$, dvakrat več.

| vezava | sila na vzmet | raztezek | $k$ [N/m] |
|---|---|---|---|
| ena | 6 N | 3 cm | 200 |
| zaporedno | 6 N | 6 cm | 100 |
| vzporedno | 3 N | 1,5 cm | 400 |

Pravila ni treba na pamet: vprašaj se, kaj je pri vezavi enako (sila ali raztezek), in ostalo sledi.

## Drugače: Kot zgodba

Kuharica Meta je v shrambi nad pultom napela vzmet s kavljem, da bi lahko hitro stehtala, koliko česna in zelenjave ima. Najprej je obesila pleten venec česna z maso pol kilograma. Vzmet se je raztegnila za dva centimetra. »Dobro,« si je rekla, »pol kilograma, dva centimetra.«

Naslednji dan je obesila vrečko korenja z maso $2\,\mathrm{kg}$, štirikrat več kot česen. Vzmet se je raztegnila za osem centimetrov, štirikrat več. Meta je na steno ob vzmet narisala lestvico: vsak centimeter pomeni četrt kilograma. Brez računanja je odkrila Hookov zakon.

Potem je vajenec na kavelj obesil vrečo krompirja z $20\,\mathrm{kg}$. Vzmet se je raztegnila skoraj do tal. Ko so vrečo sneli, se ni več skrčila do začetne dolžine. Lestvica na steni je bila odtlej napačna: vajenec je vzmet raztegnil čez mejo prožnosti.

Meta je kupila novo vzmet. Ker se ji je zdela premehka, je ob njo obesila še eno enako in breme obešala na prečko med njima. Zdaj je vsaka nosila polovico in vzmet je bila dvakrat trša, natanko kot je hotela.

## Preveri se

? Katera trditev o Hookovem zakonu je pravilna?
- Sila je premo sorazmerna s celotno dolžino vzmeti.
~ Sorazmerje velja za raztezek, ne za dolžino. Neobremenjena vzmet ima dolžino, sila nanjo pa je nič.
+ Sila je premo sorazmerna z raztezkom, dokler ne presežemo meje prožnosti.
- Zakon velja pri vsaki sili, tudi če vzmet ostane trajno podaljšana.
~ Ko vzmet ostane podaljšana, je meja prožnosti presežena in premo sorazmerje ne velja več.
- Večji prožnostni koeficient pomeni, da se vzmet pri isti sili raztegne bolj.
~ Ravno obratno: velik $k$ pomeni trdo vzmet, ki se pri isti sili raztegne manj.
> $F = k\,x$ velja v območju prožnosti; $x$ je podaljšanje glede na dolžino brez bremena.

? Vzmet se pri sili $5\,\mathrm{N}$ raztegne za $2\,\mathrm{cm}$. Kolikšen je njen prožnostni koeficient?
- $2{,}5\,\mathrm{N/m}$
~ To je $5 : 2$ s centimetri. Rezultat je v $\mathrm{N/cm}$; v metrih je $x = 0{,}02\,\mathrm{m}$.
- $10\,\mathrm{N/m}$
~ To je produkt $5 \cdot 2$. Koeficient je količnik sile in raztezka.
+ $250\,\mathrm{N/m}$
- $0{,}004\,\mathrm{N/m}$
~ To je $\dfrac{x}{F}$, deljenje v obratni smeri. Sila je v števcu: $k = \dfrac{F}{x}$.
> $k = \dfrac{F}{x} = \dfrac{5\,\mathrm{N}}{0{,}02\,\mathrm{m}} = 250\,\mathrm{N/m}$.

? Luka je rešil nalogo: »Dve enaki vzmeti s $k = 200\,\mathrm{N/m}$ sta vezani zaporedno. Skupni koeficient je $200 + 200 = 400\,\mathrm{N/m}$, breme $6\,\mathrm{N}$ ju raztegne za $1{,}5\,\mathrm{cm}$.« Kje je napaka?
- Napake ni, koeficienta se pri vsaki vezavi seštejeta.
~ Seštejeta se le pri vzporedni vezavi. Pri zaporedni nosi vsaka vzmet celo breme.
- Napačno je pretvoril enote, pravilno je $0{,}15\,\mathrm{cm}$.
~ Pretvorba je pravilna: $\dfrac{6}{400}\,\mathrm{m} = 1{,}5\,\mathrm{cm}$. Napaka je že pri koeficientu.
+ Pri zaporedni vezavi je $k_\mathrm{z} = 100\,\mathrm{N/m}$, zato je raztezek $6\,\mathrm{cm}$.
- Pravilno bi bilo $k_\mathrm{z} = 200\,\mathrm{N/m}$, ker sta vzmeti enaki.
~ Enaki vzmeti skupaj nista enaki eni: raztezka se seštejeta, koeficient se razpolovi.
> $\dfrac{1}{k_\mathrm{z}} = \dfrac{1}{200} + \dfrac{1}{200}$, torej $k_\mathrm{z} = 100\,\mathrm{N/m}$ in $x = \dfrac{6\,\mathrm{N}}{100\,\mathrm{N/m}} = 0{,}06\,\mathrm{m}$.

? Vzmet A ima $k = 100\,\mathrm{N/m}$, vzmet B $k = 300\,\mathrm{N/m}$. Na vsako obesiš enako breme. Kako se primerjata raztezka?
- Raztezka sta enaka, ker je breme enako.
~ Enaka je sila, raztezek pa je odvisen tudi od trdote vzmeti: $x = \dfrac{F}{k}$.
- Vzmet B se raztegne trikrat bolj.
~ B je trša, zato se raztegne manj, ne bolj.
+ Vzmet A se raztegne trikrat bolj.
> Pri isti sili je raztezek obratno sorazmeren s $k$: $\dfrac{x_A}{x_B} = \dfrac{300}{100} = 3$.

? Na staro kuhinjsko tehtnico z vzmetjo nekdo obesi pretežko vrečo. Ko jo sname, kazalec ne pokaže več ničle, ampak nekaj gramov. Kaj se je zgodilo?
- Vzmet ima zdaj večji prožnostni koeficient, zato kaže več.
~ Večji $k$ bi pomenil manjši raztezek in s tem manjši prikaz. Tu je težava v trajni deformaciji.
- Vzmet se je ohladila in skrčila.
~ Temperatura tu ne igra vloge. Vzmet je daljša, ne krajša, kot je bila.
+ Vzmet je bila raztegnjena čez mejo prožnosti in je ostala trajno podaljšana.
> Čez mejo prožnosti se vzmet ne vrne v prvotno obliko. Tehtnica je odslej napačna, ker Hookov zakon s starim $k$ ne velja več.

:::simboli
F | sila na vzmet | F = k\,x | N | pri visečem bremenu enaka teži
k | prožnostni koeficient (koeficient vzmeti) | k = \frac{F}{x} | N/m | večji $k$ pomeni tršo vzmet
x | raztezek | x = \frac{F}{k} | m | podaljšanje, ne dolžina vzmeti
F_\mathrm{g} | teža | F_\mathrm{g} = m\,g | N
m | masa | | kg
g | težni pospešek | | m/s^2 | $9{,}81\,\mathrm{m/s^2}$
k_1, k_2 | koeficienta posameznih vzmeti | | N/m
x_1, x_2 | raztezka posameznih vzmeti | x_1 = \frac{F}{k_1} | m | pri zaporedni vezavi
k_\mathrm{v} | koeficient vzporedne vezave | k_\mathrm{v} = k_1 + k_2 | N/m
k_\mathrm{z} | koeficient zaporedne vezave | k_\mathrm{z} = \frac{k_1 k_2}{k_1 + k_2} | N/m
:::
