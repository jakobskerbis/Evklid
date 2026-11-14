---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Naredi kratek poskus s svinčnikom. Iz vremenske napovedi prepiši tri najvišje dnevne temperature, na primer $31$, $27$ in $42$ (vroč dan v puščavi). Pri vsaki zamenjaj števki in manjše število odštej od večjega:

- $31 - 13 = 18$,
- $72 - 27 = 45$,
- $42 - 24 = 18$.

Vse razlike so deljive z $9$. Poskusi še s svojimi števili. Ali je to naključje? Ni. Razlog se skriva v tem, da števka $3$ v številu $31$ ne pomeni tri, ampak trideset.

Na tekmovanjih je veliko nalog, ki na videz zahtevajo ugibanje: črke namesto števk, skrivnostna števila z obrnjenimi števkami, dolga zaporedja, kjer vprašajo po stotem členu. Vse se rešijo z nekaj orodji: **mestno vrednostjo števk**, **sklepanjem po stolpcih** in **iskanjem vzorca**. Ko jih obvladaš, ugibanje zamenja kratek, zanesljiv račun.

## Razlaga

**1. Števka in njena vrednost.** Število $\overline{ab}$ je zapis z dvema števkama: $a$ je števka desetic, $b$ števka enic. Črta nad črkama pove, da to ni zmnožek $a \cdot b$, ampak zapis števila. Vrednost je

$$\overline{ab} = 10a + b, \qquad \overline{abc} = 100a + 10b + c.$$

Tako je $\overline{47} = 40 + 7$, ne $4 \cdot 7$ in ne $4 + 7$.

*Hitri preizkus:* zapiši $\overline{x5}$ z mestnimi vrednostmi. *(Odgovor: $10x + 5$.)*

**2. Obrnjene števke.** Zdaj lahko razložiš poskus iz uvoda. Če števki zamenjaš, dobiš $\overline{ba} = 10b + a$. Razlika je

$$\overline{ab} - \overline{ba} = (10a + b) - (10b + a) = 9a - 9b = 9(a - b).$$

Razlika je torej vedno devetkratnik razlike števk. Iz nje lahko celo razbereš, za koliko se števki razlikujeta: pri $45$ je $a - b = 5$.

*Hitri preizkus:* razlika števila in obrnjenega števila je $63$. Za koliko se števki razlikujeta? *(Odgovor: za $7$.)*

:::premisli
Kaj napoveš za trimestna števila: čemu je vedno deljiva razlika $\overline{abc} - \overline{cba}$? Preizkusi na $852$.
---
Deljiva je z $99$. Velja $\overline{abc} - \overline{cba} = 99a - 99c = 99(a - c)$, ker se srednja števka odšteje. Primer: $852 - 258 = 594$, kar je $99 \cdot 6$.
:::

**3. Kriptogrami.** **Kriptogram** je račun, v katerem so števke zamenjane s črkami. Pravila so vedno enaka: ista črka pomeni isto števko, različni črki različni števki, prva števka večmestnega števila ni $0$. Rešuješ ga po stolpcih, kot pri pisnem seštevanju, z dvema opažanjema:

- Pri seštevanju dveh števil je **prenos** v naslednji stolpec največ $1$, saj je $9 + 9 + 1 = 19$.
- Če ima vsota eno mesto več kot seštevanca, je njena prva števka $1$.

Pomaga tudi zapis z mestnimi vrednostmi: celoten kriptogram postane ena enačba s števkami.

*Hitri preizkus:* v $\mathrm{A} + \mathrm{A} = \mathrm{BC}$ je $\mathrm{BC}$ dvomestno. Kateri števki je $\mathrm{B}$? *(Odgovor: $1$, ker je $\mathrm{A} + \mathrm{A}$ največ $18$.)*

**4. Zaporedja s stalno razliko.** Na planinski postaji izmerijo zjutraj prvega dne $12\,\mathrm{cm}$ snega, nato vsak dan zapade še $3\,\mathrm{cm}$ in nič se ne stali.

| dan $n$ | sneg [cm] | dodajanj |
|---|---|---|
| $1$ | $12$ | $0$ |
| $2$ | $15$ | $1$ |
| $3$ | $18$ | $2$ |
| $4$ | $21$ | $3$ |

Do $n$-tega dne se je zgodilo $n - 1$ dodajanj po $3\,\mathrm{cm}$, zato je $n$-ti člen $12 + 3(n - 1)$. Pozor: dodajanj je $n - 1$, ne $n$, saj prvi dan še ni bilo nobenega.

*Hitri preizkus:* koliko snega je $10$. dan? *(Odgovor: $12 + 27 = 39\,\mathrm{cm}$.)*

:::premisli
Ali bo po tem pravilu kdaj točno $100\,\mathrm{cm}$ snega? Odgovori brez računanja dan za dnem: kaj imajo vsi členi skupnega?
---
Ne bo. Vsi členi so $12$ plus večkratnik $3$, torej dajo pri deljenju s $3$ ostanek $0$. Ker je $100 - 12 = 88$ in $88$ ni deljivo s $3$, tudi $100$ ni člen zaporedja. $30$. dan je $99\,\mathrm{cm}$, naslednji dan že $102\,\mathrm{cm}$.
:::

**5. Vzorci, ki se ponavljajo.** Lunine mene, plimovanje in letni časi se ponavljajo v krogu. Če ima vzorec dolžino $k$, je $n$-ti člen enak členu na mestu, ki ga pove ostanek $n$ pri deljenju s $k$. Pozor: ostanek $0$ pomeni **zadnje** mesto v krogu, ne prvega, saj ga da že $k$-ti člen.

*Hitri preizkus:* vzorec je rdeč, moder, zelen, rdeč, moder, zelen … Kakšne barve je $30$. člen? *(Odgovor: $30$ je deljivo s $3$, ostanek $0$, zato je zelen.)*

## Rešeni primeri

### Primer 1 (lažji): vreme na otoku

Na otoku se vreme ponavlja v krogu štirih dni: sonce, sonce, oblačno, dež. 1. maj je prvi dan kroga (sonce). Kakšno vreme bo 31. maja in koliko deževnih dni bo maja?

**Podatki:** krog dolžine $4$: sonce, sonce, oblačno, dež; 1. maj je na 1. mestu kroga; maj ima $31$ dni
**Iščemo:** vreme 31. maja in število deževnih dni v maju

:::formula
Mesto dneva $n$ v krogu je ostanek $n$ pri deljenju s $4$ (ostanek $0$ pomeni 4. mesto).
:::

**Rešitev:**

1. 1. maj je na 1. mestu, 2. maj na 2. mestu …, zato je dan $n$ na mestu, ki ga da ostanek $n$ pri deljenju s $4$.
2. $31 = 7 \cdot 4 + 3$, ostanek je $3$, torej 3. mesto: oblačno.
3. Dež je na 4. mestu, to je pri ostanku $0$. Deževni dnevi so večkratniki $4$: $4, 8, \dots, 28$.
4. Takih dni je $28 : 4 = 7$; naslednji večkratnik $32$ je večji od $31$, torej že v juniju.
5. Odgovor: 31. maja bo oblačno; maja bo $7$ deževnih dni.

### Primer 2: jata s skrivnostnim številom

Ornitolog je v jati preštel dvomestno število ptic. Ko je števki zapisal v obratnem vrstnem redu, je dobil število, ki je za $27$ večje. Vsota števk je $11$. Koliko ptic je v jati?

**Podatki:** število $\overline{ab}$; $\overline{ba} - \overline{ab} = 27$; $a + b = 11$
**Iščemo:** število $\overline{ab}$

:::formula
$\overline{ba} - \overline{ab} = 9(b - a)$
:::

**Rešitev:**

1. Z mestnimi vrednostmi: $\overline{ba} - \overline{ab} = 9(b - a) = 27$, zato je $b - a = 3$.
2. Iz $a + b = 11$ in $b - a = 3$: če obe enačbi seštejemo, dobimo $2b = 14$, torej $b = 7$.
3. Potem je $a = 11 - 7 = 4$.
4. Preverimo: $74 - 47 = 27$, vsota števk $4 + 7 = 11$.
5. Odgovor: v jati je $47$ ptic.

### Primer 3 (težji): kriptogram o ledu

Reši kriptogram $\overline{\mathrm{LE}} + \overline{\mathrm{EL}} = \overline{\mathrm{DLD}}$. Različne črke pomenijo različne števke, prva števka ni $0$.

**Podatki:** $\overline{\mathrm{LE}} + \overline{\mathrm{EL}} = \overline{\mathrm{DLD}}$; različne črke, različne števke; $\mathrm{L}, \mathrm{E}, \mathrm{D} \neq 0$ (vse so prve števke)
**Iščemo:** števke $\mathrm{L}$, $\mathrm{E}$, $\mathrm{D}$

:::formula
$\overline{xy} = 10x + y$, $\overline{xyz} = 100x + 10y + z$; vsota dveh dvomestnih števil je največ $99 + 98$.
:::

**Rešitev:**

1. Vsota dveh dvomestnih števil je največ $99 + 98 = 197$. Trimestna vsota se zato začne z $1$: $\mathrm{D} = 1$.
2. Leva stran z mestnimi vrednostmi: $(10\mathrm{L} + \mathrm{E}) + (10\mathrm{E} + \mathrm{L}) = 11\mathrm{L} + 11\mathrm{E}$.
3. Desna stran: $\overline{1\mathrm{L}1} = 100 + 10\mathrm{L} + 1 = 101 + 10\mathrm{L}$.
4. Izenačimo obe strani in odštejemo $10\mathrm{L}$. Ostane: vsota $\mathrm{L} + 11\mathrm{E}$ mora biti $101$.
5. Ker je $\mathrm{L}$ števka (največ $9$), mora biti $11\mathrm{E}$ vsaj $92$. Edina možnost je $\mathrm{E} = 9$, saj je $11 \cdot 9 = 99$, $11 \cdot 8 = 88$ pa premalo.
6. Torej $\mathrm{L} = 101 - 99 = 2$.
7. Preverimo: $29 + 92 = 121$, števke $2$, $9$, $1$ so različne.
8. Odgovor: $\mathrm{L} = 2$, $\mathrm{E} = 9$, $\mathrm{D} = 1$; račun je $29 + 92 = 121$.

### Primer 4 – zdaj ti: vremenski dnevnik

Vremenar je oštevilčil strani svojega dnevnika od $1$ naprej in pri tem napisal natanko $270$ števk. Koliko strani ima dnevnik?

**Podatki:** strani so oštevilčene $1, 2, 3, \dots$; skupaj $270$ napisanih števk
**Iščemo:** število strani

:::formula
Enomestnih strani je $9$, dvomestnih $90$ (od $10$ do $99$); vsaka trimestna stran porabi $3$ števke.
:::

**Rešitev:**

1. Strani od $1$ do $9$ porabijo $9$ števk.
2. Strani od $10$ do $99$ so $90$, porabijo $90 \cdot 2 = 180$ števk. Do strani $99$ je skupaj $9 + 180 = 189$ števk.
3. Ostane $270 - 189 = 81$ števk za trimestne strani.
4. Izračunaj sam: koliko je trimestnih strani in katera je zadnja?

:::premisli
Koliko trimestnih strani porabi $81$ števk in katera številka je zadnja?
---
$81 : 3 = 27$ trimestnih strani. Prva je $100$, zato je zadnja $99 + 27 = 126$ (ne $100 + 27$). Dnevnik ima $126$ strani.
:::

## Pogoste napake

- **Zapis števk kot zmnožek ali vsota.** »$\overline{ab}$ je $a \cdot b$« ali »$a + b$« pozabi na mesta. Števka desetic je vredna desetkrat več: $\overline{ab} = 10a + b$. Zapis z mestnimi vrednostmi naredi vsako uganko z obrnjenimi števkami v enačbo.
- **Ostanek $0$ kot prvo mesto.** Kdor misli, da ostanek $0$ pomeni začetek kroga, se zmoti za eno mesto. Ostanek $0$ dobiš pri $4$, $8$, $12$ …, ti dnevi pa so zadnji v krogu dolžine $4$.
- **Pozabljen prenos.** V kriptogramu kdo zapiše $\mathrm{A} + \mathrm{B} = \mathrm{C}$ v stolpcu, čeprav je iz desnega stolpca prišla $1$. Vsak stolpec ima lahko prenos $0$ ali $1$; obe možnosti preveri.
- **Pozabljeni pogoji.** Rešitev, kjer imata dve črki isto števko ali se število začne z $0$, ni rešitev. Na koncu vedno preveri vsa pravila in cel račun, ne le en stolpec.
- **Za eno premalo pri štetju.** Od $100$ do $126$ ni $26$ števil, ampak $126 - 100 + 1 = 27$. Krajišči štejeta obe.

## Povzetek

- $\overline{ab} = 10a + b$, $\overline{abc} = 100a + 10b + c$; črta pomeni zapis, ne zmnožek.
- $\overline{ab} - \overline{ba} = 9(a - b)$ in $\overline{abc} - \overline{cba} = 99(a - c)$.
- Kriptogram: ista črka, ista števka; različne črke, različne števke; prva števka ni $0$. Prenos pri vsoti dveh števil je največ $1$; daljša vsota se začne z $1$.
- Zaporedje s stalno razliko $d$: $n$-ti člen je prvi člen $+ (n - 1)d$.
- Ponavljajoči vzorec dolžine $k$: mesto dobiš z ostankom pri deljenju s $k$; ostanek $0$ je zadnje mesto.
- Števila od $m$ do $n$: teh je $n - m + 1$.

## Drugače: Na sliki

Mestne vrednosti si predstavljaj kot predalčke: v levem so desetice, v desnem enice.

```
 desetice | enice           desetice | enice
    4     |   7    = 47        7     |   4    = 74
 4 · 10   | 7 · 1              7 · 10 | 4 · 1
```

Ko števki zamenjaš, je v predalčku desetic $7$ namesto $4$, torej $3$ enote več, v predalčku enic pa $3$ enote manj. Vsaka taka enota se preseli iz enic v desetice in zraste z $1$ na $10$, torej pridobi $9$. Zato je $74 - 47 = 3 \cdot 9 = 27$.

Kriptogram $\overline{\mathrm{LE}} + \overline{\mathrm{EL}}$ pa nariši kot pisno seštevanje s prenosom nad stolpci:

```
   prenos:  1  1
               L  E          2  9
            +  E  L       +  9  2
            -------       -------
            D  L  D       1  2  1
```

Najprej se vprašaj, kaj je v skrajnem levem stolpcu: tja pade le prenos, zato je $\mathrm{D} = 1$.

## Drugače: Bolj natančno

Vsako naravno število lahko zapišemo z mestnimi vrednostmi:
$$\overline{a_k \dots a_1 a_0} = a_k \cdot 10^k + \dots + a_1 \cdot 10 + a_0.$$

Ker je $10 = 9 + 1$, da vsaka potenca $10$ pri deljenju z $9$ ostanek $1$. Število in njegova vsota števk dasta zato pri deljenju z $9$ enak ostanek. Iz tega sledi:

- vsako premešanje števk ohrani ostanek pri $9$, zato je razlika števila in premešanega števila vedno deljiva z $9$ (ne le pri obrnjenih števkah);
- pri obratu trimestnega števila se srednja števka ne premakne, zato dobimo celo deljivost z $99$.

Zaporedje s stalno razliko $d$ in prvim členom $a_1$ ima $n$-ti člen $a_n = a_1 + (n - 1)d$. Število $m$ je člen takega zaporedja natanko tedaj, ko je $m - a_1$ nenegativen večkratnik $d$. Pri vzorcu dolžine $k$ je $n$-ti člen enak $r$-temu, kjer je $r$ ostanek $n$ pri deljenju s $k$ (in $r = k$, če je ostanek $0$).

## Preveri se

? Kateri zapis ima vrednost trimestnega števila $\overline{abc}$?
- $a \cdot b \cdot c$
~ Črta nad črkami pomeni zapis s števkami, ne zmnožek. Števke stojijo na različnih mestih.
- $a + b + c$
~ To je vsota števk. Števka stotic je vredna sto, ne ena.
+ $100a + 10b + c$
- $10a + 10b + c$
~ Prva števka stoji na mestu stotic, zato jo pomnožiš s $100$, ne z $10$.
> Vsako mesto je desetkrat vrednejše od tistega desno od njega: stotice, desetice, enice.

? Približno koliko števk napišeš, ko zapišeš vsa števila od $1$ do $1000$?
- Približno $1000$
~ To je število števil, ne števk. Večina števil je trimestnih in porabi po $3$ števke.
+ Približno $3000$
- Približno $4000$
~ Štirimestno je le število $1000$. Večina števil ima $3$ števke, ne $4$.
> Natančno: $9 + 180 + 2700 + 4 = 2893$. Ker je $900$ od $1000$ števil trimestnih, je rezultat blizu $3 \cdot 1000$.

? Zakaj je razlika $\overline{ab} - \overline{ba}$ vedno deljiva z $9$?
- Ker je tudi vsota $\overline{ab} + \overline{ba}$ vedno deljiva z $9$.
~ Ne drži: $31 + 13 = 44$ ni deljivo z $9$. Vsota je $11(a + b)$, deljiva z $11$; z $9$ je deljiva razlika.
+ Ker je $(10a + b) - (10b + a) = 9a - 9b = 9(a - b)$.
- Ker sta obe števili deljivi z $9$.
~ Število $31$ ni deljivo z $9$, pa je $31 - 13 = 18$ vseeno deljivo. Deljiva je le razlika.
> Z mestnimi vrednostmi se enice odštejejo od desetic: vsaka števka prispeva $9$-kratnik.

? Na gredici rastejo tulipani v vrsti: rdeč, rumen, bel, rdeč, rumen, bel … Kateri po vrsti je bel?
- $100.$
~ $100 = 33 \cdot 3 + 1$, ostanek $1$ je prvo mesto, rdeč tulipan.
- $101.$
~ Ostanek $2$ je drugo mesto, rumen. Ostanek $0$ pomeni zadnje mesto v krogu, ne prvega.
+ $102.$
- $103.$
~ $103 = 34 \cdot 3 + 1$, ostanek $1$, rdeč tulipan.
> Bel je na 3. mestu kroga, torej pri ostanku $0$: $102 = 34 \cdot 3$.

? V kriptogramu $\mathrm{A} + \mathrm{A} + \mathrm{A} = \overline{\mathrm{BA}}$ sta $\mathrm{A}$ in $\mathrm{B}$ različni števki. Kaj velja?
- $\mathrm{A} = 0$, $\mathrm{B} = 0$
~ Različni črki morata biti različni števki, $\overline{\mathrm{BA}}$ pa se ne sme začeti z $0$.
- $\mathrm{A} = 6$, $\mathrm{B} = 1$
~ $6 + 6 + 6 = 18$: prva števka se ujema, zadnja pa je $8$, ne $6$. Preveri cel račun, ne le en stolpec.
+ $\mathrm{A} = 5$, $\mathrm{B} = 1$
- $\mathrm{A} = 3$, $\mathrm{B} = 9$
~ $3 + 3 + 3 = 9$ je enomestno, $\overline{\mathrm{BA}}$ pa je dvomestno število.
> Z mestnimi vrednostmi: $3\mathrm{A} = 10\mathrm{B} + \mathrm{A}$, torej $2\mathrm{A} = 10\mathrm{B}$ in $\mathrm{A} = 5\mathrm{B}$. Edina števka je $\mathrm{A} = 5$ pri $\mathrm{B} = 1$: $5 + 5 + 5 = 15$.

:::simboli
a | števka desetic (v trimestnem številu stotic) | | | od 1 do 9
b | števka enic (v trimestnem številu desetic) | | | od 0 do 9
c | števka enic trimestnega števila | | | od 0 do 9
a_0 | števka enic | | |
a_1 | števka desetic | | | drugje: prvi člen zaporedja s stalno razliko
a_k | števka na najvišjem mestu | | | njeno mesto ima vrednost 10ᵏ
k | mesto najvišje števke | | | drugje: dolžina ponavljajočega se vzorca
n | zaporedna številka člena (dneva) | | |
x | števka desetic (v trimestnem številu stotic) | | |
y | števka enic (v trimestnem številu desetic) | | |
z | števka enic trimestnega števila | | |
:::
