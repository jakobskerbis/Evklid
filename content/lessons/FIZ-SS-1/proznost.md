---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V šolski kuhinji visi na kljuki stara tehtnica z vzmetjo in kavljem. Na kavelj obesiš vrečko krompirja, vzmet se raztegne, kazalec pokaže maso. Sošolec Jan je prepričan: »Če obesim dve enaki vzmeti eno pod drugo, bo tehtnica dvakrat trša. Vzmeti je pač dvakrat več.«

Ima prav? Odgovor ni očiten, a ga boš do konca lekcije znal izračunati. Vzmeti so v kuhinji povsod: v tehtnici, v zapiralu predala, v gumbu opekača kruha, v sponki za vrečke. Vsaka deluje po istem preprostem pravilu. Ko ga poznaš, iz enega merjenja napoveš, kako se vzmet obnaša pri vsaki drugi obremenitvi, in znaš sestaviti vzmet, ki je mehkejša ali trša od tiste, ki jo imaš.

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

Zakaj tako? Pri raztezanju se žica v vsakem ovoju malo zvije. Dokler so zasuki majhni, dvakratna sila zvije vsak ovoj dvakrat bolj, vsi ovoji pa prispevajo enak delež k raztezku.

$$F = k\,x$$

Stalni količnik $k$ je **prožnostni koeficient** vzmeti (pravimo tudi koeficient vzmeti). Pove, koliko newtonov je potrebnih za vsak meter raztezka. Enota je $\mathrm{N/m}$. Naša vzmet ima $k = 0{,}8\,\mathrm{N/cm} = 80\,\mathrm{N/m}$. Enako velja, ko vzmet stisnemo: $x$ je takrat skrček, za kolikor se vzmet skrajša.

Graf $F(x)$ je zato premica skozi izhodišče. Štiri točke iz tabele ležijo natanko na njej.
:::risba graf
opis: Graf sile F v newtonih (0 do 8) v odvisnosti od raztezka x v centimetrih (0 do 10). Štiri izmerjene točke iz tabele: (1,25; 1), (2,5; 2), (3,75; 3) in (5; 4). Premica F = kx gre skozi izhodišče. V aplikaciji se k spreminja z drsnikom; izbrano je k = {k} N/m. Črtkani črti kažeta, da sila 4 N raztegne vzmet za {400/k:.1} cm.
x: 0 .. 10 | 1 | x (cm)
y: 0 .. 8 | 1 | F (N)
drsnik: k | 50 .. 200 | 10 | 80 | prožnostni koeficient k v N/m
f: k*x/100 | modra
točka: 1,25; 1
točka: 2,5; 2
točka: 3,75; 3
točka: 5; 4
črta: 0; 4 -> 400/k; 4 -> 400/k; 0 | oranžna črtkano
napis: 400/k; 4,6 | {400/k:.1} cm | levo | oranžna
podnapis: F = kx pri k = {k} N/m: sila 4 N da raztezek {400/k:.1} cm
:::

V aplikaciji premikaj drsnik $k$. Opazi dvoje: premica se vrti, a vedno ostane pritrjena v izhodišču, in pri večjem $k$ je bolj strma. Pri trši vzmeti ista sila $4\,\mathrm{N}$ da manjši raztezek: pri $k = 160\,\mathrm{N/m}$ le $2{,}5\,\mathrm{cm}$, pri $80\,\mathrm{N/m}$ pa $5\,\mathrm{cm}$. Izmerjene točke ležijo na premici le pri $k = 80\,\mathrm{N/m}$, ker je to koeficient naše vzmeti.

V simulaciji spodaj (Hookov zakon) vleci vzmet z vedno večjo silo in opazuj raztezek. Opazi, da dvakratna sila vedno da dvakratni raztezek.

Kuhinjske vzmeti so mehke. Vzmet športnega avtomobilskega vzmetenja je veliko trša, ima npr. $70\,\mathrm{N/mm}$, kar je $70\,000\,\mathrm{N/m}$. Serijski avtomobili imajo navadno mehkejše vzmeti. Odrasel človek s težo okoli $800\,\mathrm{N}$ bi jo stisnil le za približno $1{,}1\,\mathrm{cm}$.

**3. Meja prožnosti.** Telo je **prožno**, če se po razbremenitvi vrne v prvotno obliko. Vzmet je prožna le do neke sile. Če jo preobremeniš, ostane trajno podaljšana; med preobremenjevanjem sila ni več sorazmerna z raztezkom, napovedi s prvotno dolžino in $k$ ne veljajo več. Tej meji pravimo **meja prožnosti**. Natančneje premo sorazmerje preneha že malo prej, pri meji sorazmernosti; pri vzmeti se obe meji skoraj ujemata.

V simulaciji spodaj (Laboratorij: Hookov zakon in meja prožnosti) obešaj uteži eno za drugo in beri raztezek. Opazuj, pri kateri obremenitvi točke na grafu prenehajo ležati na premici in kaj se zgodi, ko uteži snameš.

**4. Dve vzmeti.** Vzmeti lahko povežemo na dva načina:

- **Zaporedno**: ena visi pod drugo, breme na spodnji. Če sta vzmeti lahki (njuna teža je zanemarljiva), obe nosita **celotno** težo bremena, zato se raztegne vsaka zase. Skupni raztezek je vsota obeh: $x = x_1 + x_2$.
- **Vzporedno**: vzmeti visita druga ob drugi, breme pa na prečki, ki ju povezuje. Obe se raztegneta **enako**, teža pa se razdeli: $F = F_1 + F_2$. Trša vzmet nosi več, zato breme za vodoravno prečko obesimo bližje njej.

:::risba skica
opis: Tri postavitve enakih vzmeti s k = 200 N/m in bremenom 6 N, narisane v merilu, en kvadratek je 1 cm. Neobremenjena vzmet je dolga 5 cm; črtkane vodoravne črte kažejo, kje bi bil konec brez bremena. Levo ena vzmet: raztezek 3 cm. V sredini dve vzmeti zaporedno, ena pod drugo: vsaka se raztegne za 3 cm, skupaj 6 cm. Desno dve vzmeti vzporedno s prečko: vsaka nosi 3 N in se raztegne za 1,5 cm.
območje: 0; -21 .. 31; 1
enota: 9
mreža: da
črta: 0; 0 -> 31; 0 | debelo
črta: 4; 0 -> 4; -0,6 -> 4,8; -1,17 -> 3,2; -2,3 -> 4,8; -3,43 -> 3,2; -4,57 -> 4,8; -5,7 -> 3,2; -6,83 -> 4; -7,4 -> 4; -8
pravokotnik: 2,5; -8 .. 5,5; -10 | ozadje
napis: 4; -9 | 6 N | sredina
črta: 1; -5 -> 7; -5 | siva črtkano
puščica: 6,5; -5 -> 6,5; -8 | 3 cm | desno | oranžna
črta: 13; 0 -> 13; -0,6 -> 13,8; -1,17 -> 12,2; -2,3 -> 13,8; -3,43 -> 12,2; -4,57 -> 13,8; -5,7 -> 12,2; -6,83 -> 13; -7,4 -> 13; -8
črta: 13; -8 -> 13; -8,6 -> 13,8; -9,17 -> 12,2; -10,3 -> 13,8; -11,43 -> 12,2; -12,57 -> 13,8; -13,7 -> 12,2; -14,83 -> 13; -15,4 -> 13; -16
pravokotnik: 11,5; -16 .. 14,5; -18 | ozadje
napis: 13; -17 | 6 N | sredina
črta: 10; -10 -> 16; -10 | siva črtkano
puščica: 15,5; -10 -> 15,5; -16 | 6 cm | desno | oranžna
črta: 22; 0 -> 22; -0,6 -> 22,8; -1,04 -> 21,2; -1,92 -> 22,8; -2,81 -> 21,2; -3,69 -> 22,8; -4,57 -> 21,2; -5,46 -> 22; -5,9 -> 22; -6,5
črta: 26; 0 -> 26; -0,6 -> 26,8; -1,04 -> 25,2; -1,92 -> 26,8; -2,81 -> 25,2; -3,69 -> 26,8; -4,57 -> 25,2; -5,46 -> 26; -5,9 -> 26; -6,5
črta: 21; -6,5 -> 27; -6,5 | debelo
pravokotnik: 22,5; -6,5 .. 25,5; -8,5 | ozadje
napis: 24; -7,5 | 6 N | sredina
črta: 20,5; -5 -> 28; -5 | siva črtkano
puščica: 20; -5 -> 20; -6,5 | 1,5 cm | levo | oranžna
napis: 4; -20 | ena | sredina
napis: 13; -20 | zaporedno | sredina
napis: 24; -20 | vzporedno | sredina
:::

Na sliki je merilo: en kvadratek je $1\,\mathrm{cm}$. Vse tri vzmeti so enake ($k = 200\,\mathrm{N/m}$, brez bremena dolge $5\,\mathrm{cm}$) in nosijo isto breme $6\,\mathrm{N}$. Zaporedna postavitev se raztegne za $6\,\mathrm{cm}$, dvakrat bolj kot ena vzmet. Vzporedna le za $1{,}5\,\mathrm{cm}$, pol manj.

Iz teh dveh opažanj sledi koeficient sestavljene vzmeti. Pri vzporedni vezavi je $F = k_1 x + k_2 x$, zato se koeficienta seštejeta:

$$k_\mathrm{v} = k_1 + k_2$$

Pri zaporedni je $x = \dfrac{F}{k_1} + \dfrac{F}{k_2}$ in hkrati $x = \dfrac{F}{k_\mathrm{z}}$. Ko obe strani delimo s $F$, se seštejeta obratni vrednosti:

$$\frac{1}{k_\mathrm{z}} = \frac{1}{k_1} + \frac{1}{k_2}$$

Pri treh ali več vzmeteh zaporedno se doda še en člen za vsako vzmet. Za dve vzmeti lahko to zapišemo tudi kot $k_\mathrm{z} = \dfrac{k_1 k_2}{k_1 + k_2}$.

:::premisli
Vrnimo se k Janu. Dve enaki vzmeti s koeficientom $k$ obesiš eno pod drugo. Ali je sestavljena vzmet trša ali mehkejša od ene same, in zakaj?
---
Mehkejša, s koeficientom $\dfrac{k}{2}$. Vsaka vzmet nosi celo breme in se raztegne toliko kot sama, skupni raztezek je torej dvakraten. Ista sila, dvakratni raztezek: koeficient je pol manjši. Jan bi imel prav pri vzporedni vezavi.
:::

Isti razmislek deluje tudi v obratni smeri. Vzmet si predstavljaj kot dve polovici, vezani zaporedno: vsaka nosi celo silo in da pol raztezka. Če vzmet prerežeš na pol, ima polovica zato pri isti sili pol manjši raztezek in koeficient $2k$.

Kako se oba sestava obnašata pri različnih vzmeteh, pokaže graf. Začetni vzmeti imata $k_1 = 400\,\mathrm{N/m}$ in $k_2 = 600\,\mathrm{N/m}$.

:::risba graf
opis: Graf sile F v newtonih (0 do 20) v odvisnosti od raztezka x v centimetrih (0 do 14) za štiri premice skozi izhodišče: vzmet 1 (siva, napis k₁), vzmet 2 (siva črtkana, napis k₂), zaporedno vezavo (oranžna črtkana) in vzporedno vezavo (debelo). V aplikaciji se k₁ in k₂ spreminjata z drsnikoma; izbrano je k₁ = {a} N/m in k₂ = {b} N/m, zaporedno {a*b/(a+b):.0} N/m, vzporedno {a+b} N/m. Vodoravna črta pri 12 N seka premice pri raztezkih: vzporedno {1200/(a+b):.1} cm, vzmet 1 {1200/a:.1} cm, vzmet 2 {1200/b:.1} cm, zaporedno {1200*(a+b)/(a*b):.1} cm.
x: 0 .. 14 | 2 | x (cm)
y: 0 .. 20 | 4 | F (N)
drsnik: a | 200 .. 900 | 50 | 400 | koeficient prve vzmeti k₁ v N/m
drsnik: b | 200 .. 900 | 50 | 600 | koeficient druge vzmeti k₂ v N/m
f: a*x/100 | siva
f: b*x/100 | siva črtkano
f: a*b/(a+b)*x/100 | oranžna črtkano
f: (a+b)*x/100 | modra debelo
črta: 0; 12 -> 14; 12 | siva črtkano
napis: 1800/a; 18 | k_1 | desno
napis: 1400/b; 14 | k_2 | desno
napis: 1900/(a+b); 19 | k_v | levo | modra
točka: 1200/(a+b); 12 | | | modra
točka: 1200/b; 12
točka: 1200/a; 12
točka: 1200*(a+b)/(a*b); 12 | k_z | pod | oranžna
podnapis: k₁ = {a} N/m, k₂ = {b} N/m: zaporedno {a*b/(a+b):.0} N/m, vzporedno {a+b} N/m
:::

V tisku vidiš začetno stanje: pri $12\,\mathrm{N}$ se vzporedni sestav ($1000\,\mathrm{N/m}$) raztegne za $1{,}2\,\mathrm{cm}$, zaporedni ($240\,\mathrm{N/m}$) za $5\,\mathrm{cm}$. V aplikaciji najprej nastavi $k_1 = k_2$: zaporedna premica je natanko pol tako strma kot ena vzmet, vzporedna dvakrat bolj. Nato pusti $k_1 = 400\,\mathrm{N/m}$ in $k_2$ povečuj do $900\,\mathrm{N/m}$. Opazi, da zaporedna premica ostane pod premico mehkejše vzmeti: zaporedni sestav je vedno mehkejši od najmehkejše vzmeti, vzporedni vedno trši od najtrše.

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

### Primer 2: vzmet športnega avtomobila

Športni avto z maso $1200\,\mathrm{kg}$ stoji na štirih enakih vzmeteh, teža se razdeli nanje približno enakomerno. Pod težo avta se vsaka vzmet stisne za $4{,}2\,\mathrm{cm}$. Kolikšen je prožnostni koeficient ene vzmeti? Primerjaj ga s podatkom $70\,\mathrm{N/mm}$ iz razlage.

**Podatki:** $m = 1200\,\mathrm{kg}$, štiri vzmeti, $x = 4{,}2\,\mathrm{cm}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** prožnostni koeficient $k$ ene vzmeti

:::formula
Teža avta $F_\mathrm{g} = m\,g$, na eno vzmet $F = \dfrac{F_\mathrm{g}}{4}$; nato $k = \dfrac{F}{x}$
:::

**Rešitev:**

1. Avto miruje, zato vzmeti skupaj držijo njegovo težo: $F_\mathrm{g} = 1200\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} = 11\,772\,\mathrm{N}$.
2. Vsaka vzmet nosi četrtino: $F = \dfrac{11\,772\,\mathrm{N}}{4} = 2943\,\mathrm{N}$.
3. Skrček v metrih: $x = 0{,}042\,\mathrm{m}$. Hookov zakon velja tudi za stiskanje.
4. $k = \dfrac{2943\,\mathrm{N}}{0{,}042\,\mathrm{m}} \approx 70\,071\,\mathrm{N/m}$.
5. Odgovor: koeficient ene vzmeti je približno $70\,000\,\mathrm{N/m} = 70\,\mathrm{N/mm}$ (na dve mesti, kot je podan skrček). Ujema se s podatkom iz razlage.

Račun je poenostavljen: vzmeti ne nosijo koles in osi, pogosto so nagnjene, teža pa ni povsem enakomerno razdeljena. Zato se izid z resničnim podatkom ujema le približno.

### Primer 3: košarica na dveh vzmeteh

Košarico za sadje s težo $24\,\mathrm{N}$ obesiš na dve zaporedno vezani vzmeti. Zgornja ima koeficient $300\,\mathrm{N/m}$, spodnja $600\,\mathrm{N/m}$. Za koliko se raztegne vsaka vzmet in za koliko se košarica spusti? Preveri rezultat s formulo za zaporedno vezavo. Nato še obrat: kakšno spodnjo vzmet bi potreboval namesto vzmeti s $600\,\mathrm{N/m}$, da bi imel sestav koeficient $150\,\mathrm{N/m}$?

**Podatki:** $F = 24\,\mathrm{N}$, $k_1 = 300\,\mathrm{N/m}$, $k_2 = 600\,\mathrm{N/m}$, vezava zaporedna, za obrat $k_\mathrm{z}' = 150\,\mathrm{N/m}$
**Iščemo:** raztezka $x_1$, $x_2$, skupni raztezek $x$ in novo spodnjo vzmet $k_2'$

:::formula
Vsaka vzmet nosi celo težo: $x_1 = \dfrac{F}{k_1}$, $x_2 = \dfrac{F}{k_2}$, $x = x_1 + x_2$; preizkus z $k_\mathrm{z} = \dfrac{k_1 k_2}{k_1 + k_2}$; za obrat $\dfrac{1}{k_2'} = \dfrac{1}{k_\mathrm{z}'} - \dfrac{1}{k_1}$
:::

**Rešitev:**

1. Zgornja vzmet drži košarico in spodnjo vzmet. Spodnja vzmet je zelo lahka, zato tudi zgornjo vleče $24\,\mathrm{N}$: $x_1 = \dfrac{24\,\mathrm{N}}{300\,\mathrm{N/m}} = 0{,}08\,\mathrm{m}$.
2. Spodnja vzmet: $x_2 = \dfrac{24\,\mathrm{N}}{600\,\mathrm{N/m}} = 0{,}04\,\mathrm{m}$. Trša vzmet se raztegne manj.
3. Skupaj: $x = 0{,}08\,\mathrm{m} + 0{,}04\,\mathrm{m} = 0{,}12\,\mathrm{m}$.
4. Preizkus: $k_\mathrm{z} = \dfrac{300 \cdot 600}{300 + 600} = 200$, torej $200\,\mathrm{N/m}$, in $\dfrac{24\,\mathrm{N}}{200\,\mathrm{N/m}} = 0{,}12\,\mathrm{m}$. Ujema se.
5. Obrat: iz $\dfrac{1}{k_\mathrm{z}'} = \dfrac{1}{k_1} + \dfrac{1}{k_2'}$ izrazimo $\dfrac{1}{k_2'} = \dfrac{1}{150} - \dfrac{1}{300} = \dfrac{1}{300}$, torej $k_2' = 300\,\mathrm{N/m}$. Mehkejši sestav zahteva mehkejšo spodnjo vzmet.
6. Odgovor: zgornja vzmet se raztegne za $8\,\mathrm{cm}$, spodnja za $4\,\mathrm{cm}$, košarica se spusti za $12\,\mathrm{cm}$. Sestavljena vzmet je mehkejša od vsake posebej. Za $150\,\mathrm{N/m}$ potrebuješ spodnjo vzmet s $300\,\mathrm{N/m}$, enako zgornji: dve enaki vzmeti zaporedno dasta pol koeficienta.

### Primer 4: zdaj ti

Isto košarico ($24\,\mathrm{N}$) zdaj obesiš na prečko, ki visi na istih dveh vzmeteh vzporedno. Košarico obesiš bližje trši vzmeti, da prečka ostane vodoravna. Za koliko se košarica spusti?

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
$x \approx 0{,}027\,\mathrm{m} \approx 2{,}7\,\mathrm{cm}$. To je več kot štirikrat manj kot pri zaporedni vezavi ($12\,\mathrm{cm}$). Sila se razdeli v razmerju koeficientov: trša vzmet nosi $600 \cdot 0{,}0267 \approx 16\,\mathrm{N}$, mehkejša $8\,\mathrm{N}$.
:::

## Pogoste napake

- **Dolžina namesto raztezka.** Vzmet je brez bremena dolga $10\,\mathrm{cm}$, z bremenom $14\,\mathrm{cm}$. Kdor v $F = k\,x$ vstavi $14\,\mathrm{cm}$, misli, da je $x$ dolžina vzmeti. Sila pa je sorazmerna s **podaljšanjem**: $x = 4\,\mathrm{cm}$.
- **Masa namesto sile.** Pri loncu z $1{,}2\,\mathrm{kg}$ in raztezku $0{,}04\,\mathrm{m}$ nekdo izračuna $\dfrac{1{,}2}{0{,}04} = 30$ in zapiše $30\,\mathrm{N/m}$. Masa ni sila. Vzmet vleče teža $m\,g$, zato je pravilno približno $290\,\mathrm{N/m}$.
- **Centimetri v formuli z N/m.** Kdor $3\,\mathrm{cm}$ vstavi kot $3$, dobi stokrat preveliko silo. Pred računanjem pretvori v metre.
- **»Več vzmeti, vedno trše.«** To je Janova zmota. Res je le pri vzporedni vezavi. Pri zaporedni vsaka vzmet nosi celotno breme in raztezka se seštejeta, zato je sestav mehkejši.
- **Hookov zakon brez meje.** Premo sorazmerje velja le do meje prožnosti. Preobremenjena vzmet ostane trajno podaljšana; med preobremenjevanjem sila ni več sorazmerna z raztezkom, napovedi s prvotno dolžino in $k$ ne veljajo več.

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

Naslednji dan je obesila vrečko korenja z maso $2\,\mathrm{kg}$, štirikrat več kot česen. Vzmet se je raztegnila za osem centimetrov, štirikrat več. Dve meritvi ji nista bili dovolj, zato je obesila še kilogram moke: štirje centimetri, spet ista povezava. Meta je na steno ob vzmet narisala lestvico: vsak centimeter pomeni četrt kilograma. Brez računanja je odkrila Hookov zakon.

Potem je vajenec na kavelj obesil vrečo krompirja z $20\,\mathrm{kg}$. Vzmet se je raztegnila skoraj do tal. Ko so vrečo sneli, se ni več skrčila do začetne dolžine. Lestvica na steni je bila odtlej napačna: vajenec je vzmet raztegnil čez mejo prožnosti.

Meta je kupila novo vzmet. Ker se ji je zdela premehka, je ob njo obesila še eno enako in breme obešala na prečko med njima. Zdaj je vsaka nosila polovico in sestav je bil dvakrat trši od ene vzmeti, natanko kot je hotela.

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

? Graf kaže, kako sila $F$ raztegne vzmeti A in B. Z grafa odčitaj prožnostni koeficient vzmeti A in ga vpiši v $\mathrm{N/m}$.
:::risba graf
opis: Graf sile F v newtonih (0 do 12) v odvisnosti od raztezka x v centimetrih (0 do 10). Premica A gre skozi izhodišče in skozi označeno točko pri raztezku 4 cm in sili 10 N. Premica B gre skozi izhodišče in točko pri 10 cm in 10 N.
x: 0 .. 10 | 1 | x (cm)
y: 0 .. 12 | 2 | F (N)
f: 2,5*x | modra | 0 .. 4,8
f: x | oranžna črtkano
črta: 0; 10 -> 4; 10 -> 4; 0 | siva črtkano
točka: 4; 10
napis: 4,8; 12 | A | levo | modra
napis: 10; 8,6 | B | levo | oranžna
:::
= 250 N/m | 5
~ 2,5 | To je $\dfrac{10}{4}$ v $\mathrm{N/cm}$. Raztezek pretvori v metre: $4\,\mathrm{cm} = 0{,}04\,\mathrm{m}$.
~ 0,004 | To je $\dfrac{x}{F}$, deljenje v obratni smeri. Sila je v števcu: $k = \dfrac{F}{x}$.
~ 40 | To je $10 \cdot 4$. Koeficient je količnik sile in raztezka, ne produkt.
~ 100 | To je vzmet B, ne A: pri $10\,\mathrm{N}$ se raztegne za $10\,\mathrm{cm}$.
> Z grafa: pri $x = 4\,\mathrm{cm} = 0{,}04\,\mathrm{m}$ je $F = 10\,\mathrm{N}$, zato $k = \dfrac{10\,\mathrm{N}}{0{,}04\,\mathrm{m}} = 250\,\mathrm{N/m}$.

? Luka je rešil nalogo: »Dve enaki vzmeti s $k = 200\,\mathrm{N/m}$ sta vezani zaporedno. Skupni koeficient je $200 + 200 = 400\,\mathrm{N/m}$, breme $6\,\mathrm{N}$ ju raztegne za $1{,}5\,\mathrm{cm}$.« Kje je napaka?
- Napake ni, koeficienta se pri vsaki vezavi seštejeta.
~ Seštejeta se le pri vzporedni vezavi. Pri zaporedni nosi vsaka vzmet celo breme.
- Napačno je pretvoril enote, pravilno je $0{,}15\,\mathrm{cm}$.
~ Pretvorba je pravilna: $\dfrac{6}{400}\,\mathrm{m} = 1{,}5\,\mathrm{cm}$. Napaka je že pri koeficientu.
+ Pri zaporedni vezavi je $k_\mathrm{z} = 100\,\mathrm{N/m}$, zato je raztezek $6\,\mathrm{cm}$.
- Pravilno bi bilo $k_\mathrm{z} = 200\,\mathrm{N/m}$, ker sta vzmeti enaki.
~ Enaki vzmeti skupaj nista enaki eni: raztezka se seštejeta, koeficient se razpolovi.
> $\dfrac{1}{k_\mathrm{z}} = \dfrac{1}{200} + \dfrac{1}{200}$, torej $k_\mathrm{z} = 100\,\mathrm{N/m}$ in $x = \dfrac{6\,\mathrm{N}}{100\,\mathrm{N/m}} = 0{,}06\,\mathrm{m}$.

? Na vsak sestav enakih vzmeti s $k = 200\,\mathrm{N/m}$ obesiš isto breme. Razvrsti sestave od najmanjšega do največjega raztezka.
1. dve vzmeti vzporedno
2. ena vzmet
3. dve vzmeti zaporedno
4. tri vzmeti zaporedno
> Manjši raztezek pomeni tršo vzmet. Vzporedno: $k = 400\,\mathrm{N/m}$; ena: $200\,\mathrm{N/m}$; dve zaporedno: $100\,\mathrm{N/m}$; tri zaporedno: $\dfrac{1}{k} = \dfrac{3}{200}$, torej $k \approx 67\,\mathrm{N/m}$. Pri zaporedni vezavi se vsaka dodana vzmet raztegne za enako, zato raztezek raste.

? Na staro kuhinjsko tehtnico z vzmetjo nekdo obesi pretežko vrečo. Ko jo sname, kazalec ne pokaže več ničle, ampak nekaj gramov. Kaj se je zgodilo?
+ Vzmet je bila raztegnjena čez mejo prožnosti in je ostala trajno podaljšana.
- Vzmet ima zdaj večji prožnostni koeficient, zato kaže več.
~ Brez bremena je raztezek nič pri vsakem $k$, zato drugačen $k$ ne premakne ničle. Premik ničle pomeni, da je vzmet trajno daljša.
- Vzmet je postala mehkejša, zato se raztegne že sama od sebe.
~ Brez sile ni raztezka, ne glede na to, kako mehka je vzmet. Kazalec je premaknjen, ker je vzmet trajno podaljšana.
> Čez mejo prožnosti se vzmet ne vrne v prvotno obliko: ostane trajno daljša, zato se je ničla premaknila in tehtnica odslej kaže napačno.

? Vrečko moke z maso $1{,}5\,\mathrm{kg}$ obesiš na prečko, ki visi na dveh vzporednih vzmeteh s $300\,\mathrm{N/m}$ in $600\,\mathrm{N/m}$. Prečka ostane vodoravna. Za koliko centimetrov se vrečka spusti? Uporabi $g = 9{,}81\,\mathrm{m/s^2}$.
= 1,6 cm | 0,05
~ 7,4 | Uporabil si zaporedno formulo, $k_\mathrm{z} = 200\,\mathrm{N/m}$. Vzmeti sta vzporedni: $k_\mathrm{v} = 300 + 600 = 900\,\mathrm{N/m}$.
~ 0,17 | Delil si maso namesto teže: $\dfrac{1{,}5}{900}\,\mathrm{m}$. Na vzmeti deluje teža $m\,g = 14{,}715\,\mathrm{N}$.
~ 0,016 | To je rezultat v metrih. Vprašanje sprašuje po centimetrih: pomnoži s $100$.
> $F = m\,g = 1{,}5\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} = 14{,}715\,\mathrm{N}$; $k_\mathrm{v} = 900\,\mathrm{N/m}$; $x = \dfrac{14{,}715\,\mathrm{N}}{900\,\mathrm{N/m}} \approx 0{,}016\,\mathrm{m} \approx 1{,}6\,\mathrm{cm}$ (na dve mesti, kot je podana masa).

:::simboli
F | sila na vzmet | F = k\,x | N | pri visečem bremenu enaka teži
k | prožnostni koeficient (koeficient vzmeti) | k = \frac{F}{x} | N/m | večji $k$ pomeni tršo vzmet
x | raztezek | x = \frac{F}{k} | m | podaljšanje (pri stiskanju skrček), ne dolžina vzmeti
F_\mathrm{g} | teža | F_\mathrm{g} = m\,g | N
m | masa | | kg
g | težni pospešek | | m/s^2 | $9{,}81\,\mathrm{m/s^2}$
k_1, k_2 | koeficienta posameznih vzmeti | | N/m
F_1, F_2 | sili na posamezni vzmeti | F_1 = k_1\,x | N | pri vzporedni vezavi
x_1, x_2 | raztezka posameznih vzmeti | x_1 = \frac{F}{k_1} | m | pri zaporedni vezavi
k_\mathrm{v} | koeficient vzporedne vezave | k_\mathrm{v} = k_1 + k_2 | N/m
k_\mathrm{z} | koeficient zaporedne vezave | k_\mathrm{z} = \frac{k_1 k_2}{k_1 + k_2} | N/m | za dve vzmeti; splošno $\frac{1}{k_\mathrm{z}} = \frac{1}{k_1} + \frac{1}{k_2} + \dots$
k_\mathrm{z}' | želeni koeficient sestava | | N/m | obrat v Primeru 3
k_2' | koeficient nove spodnje vzmeti | \frac{1}{k_2'} = \frac{1}{k_\mathrm{z}'} - \frac{1}{k_1} | N/m | obrat v Primeru 3
:::

<<RACUN
vrednost: 0.8*100 | 80
vrednost: 6/0.8 | 7.5
vrednost: 400/80 | 5
vrednost: 800/70000*100 | 1.14
vrednost: 400*0.03 | 12
vrednost: 1.2*9.81/0.040 | 294.3
vrednost: 1200*9.81 | 11772
vrednost: 1200*9.81/4 | 2943
vrednost: 2943/0.042 | 70071.43
vrednost: 1/(1/150-1/300) | 300
vrednost: 1200/1000 | 1.2
vrednost: 1200*(400+600)/(400*600) | 5
vrednost: 400*600/(400+600) | 240
vrednost: 400*900/(400+900) | 276.92
vrednost: 24/300 | 0.08
vrednost: 24/600 | 0.04
vrednost: 300*600/(300+600) | 200
vrednost: 24/200 | 0.12
vrednost: 24/(300+600)*100 | 2.67
vrednost: 10/0.04 | 250
vrednost: 1/(3/200) | 66.67
vrednost: 1.5*9.81 | 14.715
vrednost: 1.5*9.81/900*100 | 1.635
vrednost: 1.5*9.81/200*100 | 7.36
vrednost: 24*600/900 | 16
vrednost: 24*300/900 | 8
vrednost: 6/(200+200) | 0.015
enote: 70*N/mm | 70000*N/m
>>
