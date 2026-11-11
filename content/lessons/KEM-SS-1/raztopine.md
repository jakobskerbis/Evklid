---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Pri kemiji so snovi pogosto raztopljene v vodi: fiziološka raztopina, kis, razkužilo, sok, krvna plazma. Iz prejšnjih ur že znaš izračunati množino snovi ($n = \dfrac{m}{M}$) in veš, da je molska masa $M$ v $\text{g/mol}$.

Pri raztopinah pa nas običajno ne zanima samo, *koliko* snovi imamo, ampak *kako koncentrirana* je raztopina, torej koliko topljenca je v določeni količini raztopine. Za to uporabljamo **masni delež** in **množinsko koncentracijo**. Kadar iz bolj koncentrirane raztopine (z več topljenca v isti prostornini) pripravimo bolj razredčeno, temu postopku rečemo **redčenje**. To počnejo v laboratoriju, v lekarni in doma, ko razredčiš sirup.

## Razlaga

**1. Osnovni pojmi.**

- **Topljenec** je snov, ki se raztaplja (npr. sol).
- **Topilo** je snov, v kateri se raztaplja (npr. voda).
- **Raztopina** je zmes topljenca in topila.

Masa raztopine je vsota mas topljenca in topila:

$$m(\text{raztopina}) = m(\text{topljenec}) + m(\text{topilo})$$

**2. Masni delež.** Pove, kolikšen del mase raztopine je topljenec:

$$w = \frac{m(\text{topljenec})}{m(\text{raztopina})}$$

Masni delež nima enote. Lahko ga zapišemo kot decimalno število ($0{,}10$) ali v odstotkih ($10\,\%$). Za pretvorbo v odstotke ga pomnožimo s $100$.

:::premisli
V $100\,\text{g}$ vode raztopiš $10\,\text{g}$ soli. Ali je raztopina $10$-odstotna?
---
Ne. Masa raztopine je $110\,\text{g}$, zato je $w = \dfrac{10\,\text{g}}{110\,\text{g}} \approx 0{,}091 = 9{,}1\,\%$. Deliš z maso cele raztopine, ne z maso vode.
:::

**3. Množinska koncentracija.** Pove, koliko molov topljenca je v enem litru *raztopine*:

$$c = \frac{n}{V}$$

Enota je $\text{mol/L}$. Prostornina $V$ je prostornina **cele raztopine** in mora biti v litrih. Ker je $n = \dfrac{m}{M}$, lahko zapišemo tudi:

$$c = \frac{m}{M \cdot V}$$

**4. Redčenje.** Ko raztopini dodamo vodo, se količina topljenca ne spremeni, spremeni se le prostornina raztopine. Množina topljenca pred redčenjem in po njem je enaka:

$$n_1 = n_2 \quad\Rightarrow\quad c_1 \cdot V_1 = c_2 \cdot V_2$$

Oznaka $1$ pomeni začetno (bolj koncentrirano) raztopino, oznaka $2$ končno (bolj razredčeno). Enota za $V$ je na obeh straneh enaka, zato lahko tu uporabiš tudi $\text{mL}$, če sta obe prostornini v istih enotah.

:::premisli
$100\,\text{mL}$ raztopine dopolniš z vodo do $400\,\text{mL}$. Kaj se zgodi z množino topljenca in kaj s koncentracijo?
---
Množina topljenca ostane enaka, ker smo dodali samo vodo. Koncentracija se zmanjša na četrtino, ker je prostornina štirikrat večja: $c_2 = c_1 \cdot \dfrac{100}{400}$.
:::

**5. Simulacija.** V simulaciji spodaj (»Koncentracija raztopine«) nastavi množino topljenca $0{,}050\,\text{mol}$ in prostornino $250\,\text{mL}$. Napovej koncentracijo, nato preveri ($0{,}20\,\text{mol/L}$). Potem prostornino povečaj na $500\,\text{mL}$ in opazuj: množina ostane enaka, koncentracija se prepolovi, barva raztopine pa postane svetlejša.

## Rešeni primeri

### Primer 1: masni delež

V $180\,\text{g}$ vode raztopimo $20\,\text{g}$ kuhinjske soli. Kolikšen je masni delež soli v raztopini?

**Podatki:** $m(\text{topljenec}) = 20\,\text{g}$ soli, $m(\text{topilo}) = 180\,\text{g}$ vode
**Iščemo:** masni delež soli $w$

:::formula
$m(\text{raztopina}) = m(\text{topljenec}) + m(\text{topilo})$

$w = \dfrac{m(\text{topljenec})}{m(\text{raztopina})}$
:::

**Rešitev:**

1. Najprej izračunamo maso raztopine, ker v imenovalcu ni mase vode, ampak masa *cele raztopine*: $m(\text{raztopina}) = 20\,\text{g} + 180\,\text{g} = 200\,\text{g}$.
2. Vstavimo v enačbo: $w = \dfrac{20\,\text{g}}{200\,\text{g}} = 0{,}10$.
3. V odstotke pretvorimo z množenjem s $100$: $w = 10\,\%$.
4. Preverimo smiselnost: masni delež mora biti med $0$ in $1$, ker topljenec ne more biti težji od cele raztopine. ✓
5. Odgovor: masni delež soli je $0{,}10$ oziroma $10\,\%$.

### Primer 2: množinska koncentracija

V merilni bučki raztopimo $11{,}7\,\text{g}$ NaCl in dopolnimo z vodo do $500\,\text{mL}$ raztopine. Kolikšna je množinska koncentracija?

**Podatki:** $m(\mathrm{NaCl}) = 11{,}7\,\text{g}$, $V = 500\,\text{mL}$ raztopine; $A_\mathrm{r}(\mathrm{Na}) = 23$, $A_\mathrm{r}(\mathrm{Cl}) = 35{,}5$
**Iščemo:** množinsko koncentracijo $c$

:::formula
$n = \dfrac{m}{M}$

$c = \dfrac{n}{V}$
:::

**Rešitev:**

1. Molska masa je vsota relativnih atomskih mas: $M(\mathrm{NaCl}) = 23 + 35{,}5 = 58{,}5\,\text{g/mol}$.
2. Maso pretvorimo v množino, ker koncentracija šteje mole: $n = \dfrac{11{,}7\,\text{g}}{58{,}5\,\text{g/mol}} = 0{,}20\,\text{mol}$.
3. Prostornino pretvorimo v litre, ker je koncentracija v $\text{mol/L}$: $V = 500\,\text{mL} = 0{,}500\,\text{L}$.
4. Koncentracija: $c = \dfrac{0{,}20\,\text{mol}}{0{,}500\,\text{L}} = 0{,}40\,\text{mol/L}$.
5. Preverimo: v $1\,\text{L}$ bi bilo $0{,}40\,\text{mol}$ NaCl, v pol litra pa polovica, $0{,}20\,\text{mol}$. ✓
6. Odgovor: množinska koncentracija NaCl je $0{,}40\,\text{mol/L}$.

### Primer 3: redčenje

Na voljo imamo raztopino s koncentracijo $2{,}0\,\text{mol/L}$. Pripraviti moramo $250\,\text{mL}$ raztopine s koncentracijo $0{,}50\,\text{mol/L}$. Koliko začetne raztopine potrebujemo in kako jo pripravimo?

**Podatki:** $c_1 = 2{,}0\,\text{mol/L}$, $c_2 = 0{,}50\,\text{mol/L}$, $V_2 = 250\,\text{mL}$
**Iščemo:** prostornino začetne raztopine $V_1$

:::formula
$c_1 \cdot V_1 = c_2 \cdot V_2$
:::

**Rešitev:**

1. Pri redčenju se množina topljenca ne spremeni, zato velja $c_1 V_1 = c_2 V_2$. Izrazimo neznanko: $V_1 = \dfrac{c_2 \cdot V_2}{c_1}$.
2. Vstavimo (obe prostornini sta v mL, zato pretvorba ni potrebna): $V_1 = \dfrac{0{,}50\,\text{mol/L} \cdot 250\,\text{mL}}{2{,}0\,\text{mol/L}} = 62{,}5\,\text{mL}$.
3. **Postopek.** Odmerimo $62{,}5\,\text{mL}$ začetne raztopine v bučko in dolijemo vodo do oznake $250\,\text{mL}$. Ne dodamo $250\,\text{mL}$ vode, ker koncentracija velja za skupno prostornino raztopine.
4. Preverimo: začetna raztopina je $4$-krat bolj koncentrirana kot končna ($2{,}0 : 0{,}50 = 4$), zato moramo vzeti $\dfrac{1}{4}$ končne prostornine: $\dfrac{250\,\text{mL}}{4} = 62{,}5\,\text{mL}$. ✓
5. Odgovor: potrebujemo $62{,}5\,\text{mL}$ začetne raztopine, ki jo z vodo dopolnimo do $250\,\text{mL}$.

### Primer 4: zdaj ti

Pripraviti moraš $200\,\text{g}$ raztopine sladkorja z masnim deležem $8\,\%$. Koliko sladkorja in koliko vode potrebuješ?

**Podatki:** $m(\text{raztopina}) = 200\,\text{g}$, $w = 8\,\% = 0{,}08$
**Iščemo:** $m(\text{sladkor})$ in $m(\text{voda})$

:::formula
$m(\text{topljenec}) = w \cdot m(\text{raztopina})$

$m(\text{topilo}) = m(\text{raztopina}) - m(\text{topljenec})$
:::

**Rešitev:**

1. Odstotek pretvorimo v decimalno število, ker formula dela z deleži: $w = 0{,}08$.
2. Iz $w = \dfrac{m(\text{topljenec})}{m(\text{raztopina})}$ izrazimo maso topljenca (pomnožimo obe strani z $m(\text{raztopina})$).
3. Izračunaj sam, nato preveri:

:::premisli
Koliko sladkorja in koliko vode potrebuješ?
---
$m(\text{sladkor}) = 0{,}08 \cdot 200\,\text{g} = 16\,\text{g}$, $m(\text{voda}) = 200\,\text{g} - 16\,\text{g} = 184\,\text{g}$. Vode ni $200\,\text{g}$, ker je $200\,\text{g}$ masa cele raztopine.
:::

## Pogoste napake

- **Masa vode namesto mase raztopine.** »$30\,\text{g}$ soli v $120\,\text{g}$ vode: $w = \dfrac{30}{120} = 25\,\%$.« To je narobe, ker masni delež primerja topljenec s *celo* raztopino. Pravilno: $m(\text{raztopina}) = 150\,\text{g}$, $w = 20\,\%$.
- **Mililitri namesto litrov.** »$c = \dfrac{0{,}5\,\text{mol}}{250} = 0{,}002\,\text{mol/L}$.« Enota $\text{mol/L}$ zahteva litre, zato je rezultat tisočkrat premajhen. Pravilno: $V = 0{,}250\,\text{L}$, $c = 2\,\text{mol/L}$. Podobno je narobe množiti $0{,}5 \cdot 250$.
- **Dodana voda namesto končne prostornine.** »Za $250\,\text{mL}$ raztopine dodam $250\,\text{mL}$ vode.« Koncentracija se nanaša na prostornino *cele raztopine*, zato bi bila raztopina preveč razredčena. Pravilno: raztopino v bučki dopolniš do oznake.
- **Obrnjeno razmerje pri redčenju.** »$100\,\text{mL}$ raztopine s koncentracijo $1{,}0\,\text{mol/L}$ razredčim do $500\,\text{mL}$. Prostornina se poveča petkrat, zato se poveča tudi koncentracija: $c_2 = 5{,}0\,\text{mol/L}$.« Z dodajanjem vode topljenca ne dodaš, zato se koncentracija *zmanjša*. Pravilno: $c_2 = \dfrac{c_1 V_1}{V_2} = \dfrac{1{,}0\,\text{mol/L} \cdot 100\,\text{mL}}{500\,\text{mL}} = 0{,}20\,\text{mol/L}$.
- **Pozabljen odstotek.** Masni delež $0{,}10$ in $10\,\%$ sta isto. Če v račun $m = w \cdot m(\text{raztopina})$ vstaviš $10$ namesto $0{,}10$, dobiš maso, ki je večja od mase raztopine. Pred računom odstotek deli s $100$.

## Povzetek

- Raztopina = topljenec + topilo; $m(\text{raztopina}) = m(\text{topljenec}) + m(\text{topilo})$.
- Masni delež: $w = \dfrac{m(\text{topljenec})}{m(\text{raztopina})}$, brez enote, v odstotkih pomnožimo s $100$.
- Množinska koncentracija: $c = \dfrac{n}{V}$ v $\text{mol/L}$, pri čemer je $V$ prostornina raztopine v litrih.
- Pri redčenju se množina topljenca ne spremeni: $c_1 V_1 = c_2 V_2$.
- Pri nalogah najprej izpiši znane podatke, preveri enote in šele nato računaj.

## Drugače: Na sliki

Predstavljaj si bučko z vodo, v kateri plavajo modre pikice. Vsaka pikica je delec topljenca.

- Če v isto prostornino dodaš več pikic, je raztopina **bolj koncentrirana** (koncentracija se poveča).
- Če pikice pustiš in dodaš vodo, se razporedijo po večji prostornini. Pikic je enako veliko kot prej, vendar so bolj narazen (koncentracija se zmanjša).

V simulaciji spodaj (»Koncentracija raztopine«) lahko to opaziš: spreminjaj množino topljenca in prostornino raztopine ter opazuj prikazano koncentracijo. Ko prostornino podvojiš, se koncentracija prepolovi. Ko podvojiš količino topljenca pri isti prostornini, se podvoji tudi koncentracija.

## Drugače: Iz vsakdanjega življenja

Razmisli o sadnem sirupu. Na embalaži piše: *1 del sirupa in 4 deli vode*.

- Skupaj dobiš $1 + 4 = 5$ delov pijače.
- Sirup, ki je bil prej v steklenici sam, je zdaj le še en del od petih. Koncentracija sirupa v pijači je torej petkrat manjša kot v steklenici.
- Če bi vzel samo $1$ del sirupa in $2$ dela vode, bi bila pijača slajša, ker je sirup en del od treh.

Količina sladkorja iz sirupa se pri redčenju ni spremenila, le porazdelila se je po večji prostornini. Enako velja v laboratoriju: $n_1 = n_2$.

## Drugače: Korak za korakom s številkami

Primer: pripraviti moramo $250\,\text{mL}$ raztopine NaOH s koncentracijo $0{,}10\,\text{mol/L}$. Koliko trdnega NaOH moramo natehtati?

| Korak | Kaj naredimo | Račun |
|---|---|---|
| 1 | Prostornina v litre | $250\,\text{mL} = 0{,}250\,\text{L}$ |
| 2 | Množina iz koncentracije | $n = c \cdot V = 0{,}10\,\text{mol/L} \cdot 0{,}250\,\text{L} = 0{,}025\,\text{mol}$ |
| 3 | Molska masa | $M(\mathrm{NaOH}) = 23 + 16 + 1 = 40\,\text{g/mol}$ |
| 4 | Masa iz množine | $m = n \cdot M = 0{,}025\,\text{mol} \cdot 40\,\text{g/mol} = 1{,}0\,\text{g}$ |
| 5 | Preverjanje | $\dfrac{1{,}0\,\text{g}}{40\,\text{g/mol} \cdot 0{,}250\,\text{L}} = 0{,}10\,\text{mol/L}$ ✓ |

Natehtamo torej $1{,}0\,\text{g}$ NaOH, ga raztopimo in dopolnimo z vodo do $250\,\text{mL}$.

Še primer za masni delež: kolikšna je masa soli v $250\,\text{g}$ raztopine z masnim deležem $5\,\%$?

$$m(\text{topljenec}) = w \cdot m(\text{raztopina}) = 0{,}05 \cdot 250\,\text{g} = 12{,}5\,\text{g}$$

## Drugače: Bolj natančno

**Izpeljava enačbe za redčenje.** Množina topljenca v raztopini je $n = c \cdot V$. Pred redčenjem velja $n_1 = c_1 V_1$. Pri redčenju dodamo samo topilo (vodo), topljenca ne dodamo in ga tudi ne odvzamemo, zato je po redčenju množina topljenca enaka: $n_2 = n_1$. Po redčenju je $n_2 = c_2 V_2$. Iz $n_1 = n_2$ sledi:

$$c_1 V_1 = c_2 V_2$$

**Prostornine se ne seštevajo vedno natančno.** Pri redčenju razredčenih vodnih raztopin je $V_2 \approx V_1 + V(\text{dodana voda})$. Pri močno koncentriranih raztopinah ali mešanju različnih tekočin ta približek ni dober. Zato v laboratoriju končno prostornino vedno nastavimo z oznako na merilni bučki, ne z računanjem.

**Masni delež in masa.** Masa je vedno aditivna (seštevajo se mase), zato pri masnem deležu velja $m(\text{raztopina}) = m(\text{topljenec}) + m(\text{topilo})$. Pri prostornini temu ni vedno tako, zato so naloge z masnim deležem in koncentracijo različne vrste računov.

## Preveri se

? Kaj pomeni $V$ v enačbi $c = \dfrac{n}{V}$?
- Prostornino dodane vode (topila).
~ Koncentracija se nanaša na celo raztopino. Zato raztopino dopolnimo do oznake in ne dodamo določene prostornine vode.
+ Prostornino cele raztopine, izraženo v litrih.
- Prostornino topljenca pred raztapljanjem.
~ Prostornina trdnega topljenca ni pomembna. Šteje, po kolikšni prostornini raztopine so delci topljenca porazdeljeni.
> $c$ pove, koliko molov topljenca je v $1\,\text{L}$ raztopine, zato je $V$ prostornina cele raztopine v litrih.

? V $120\,\text{g}$ vode raztopimo $30\,\text{g}$ soli. Kolikšen je masni delež soli v raztopini?
- $25\,\%$
~ To je $\dfrac{30}{120}$: delil si z maso vode. V imenovalec sodi masa cele raztopine, $150\,\text{g}$.
+ $20\,\%$
- $30\,\%$
~ To je masa soli v gramih, zapisana kot odstotek. Odstotek dobiš šele, ko maso soli deliš z maso raztopine.
> Masa raztopine je $30\,\text{g} + 120\,\text{g} = 150\,\text{g}$, zato je $w = \dfrac{30}{150} = 0{,}20 = 20\,\%$. Odgovor $25\,\%$ dobiš, če deliš z maso vode ($\dfrac{30}{120}$).

? Raztopini sladkorja doliješ vodo. Kaj velja?
- Množina in koncentracija sladkorja ostaneta enaki.
~ Množina res ostane enaka, a se porazdeli po večji prostornini, zato je $c = \dfrac{n}{V}$ manjša.
- Koncentracija se poveča, ker je tekočine več.
~ Več tekočine ne pomeni več topljenca. Dodal si samo vodo, zato je sladkorja v vsakem litru manj.
+ Množina sladkorja ostane enaka, koncentracija se zmanjša.
- Množina sladkorja se zmanjša.
~ Sladkorja nisi odvzel, dodal si samo vodo. Spremeni se prostornina, ne množina topljenca.
> Pri redčenju ostane $n$ enaka, $V$ se poveča, zato se $c = \dfrac{n}{V}$ zmanjša. Zato velja $c_1 V_1 = c_2 V_2$.

? V $250\,\text{mL}$ raztopine je raztopljeno $0{,}5\,\text{mol}$ topljenca. Kolikšna je množinska koncentracija?
- $125\,\text{mol/L}$
~ To je $0{,}5 \cdot 250$. Koncentracijo dobiš z deljenjem, $c = \dfrac{n}{V}$, prostornina pa mora biti v litrih.
- $0{,}002\,\text{mol/L}$
~ To je $\dfrac{0{,}5}{250}$: delil si z mililitri. Pretvori v litre: $250\,\text{mL} = 0{,}25\,\text{L}$.
+ $2\,\text{mol/L}$
> Prostornino moramo pretvoriti v litre: $250\,\text{mL} = 0{,}25\,\text{L}$. Nato je $c = \dfrac{0{,}5\,\text{mol}}{0{,}25\,\text{L}} = 2\,\text{mol/L}$. Odgovora $125$ in $0{,}002$ sta posledica napačnega množenja ali deljenja z $250$ namesto z $0{,}25$.

? $100\,\text{mL}$ raztopine s koncentracijo $1{,}0\,\text{mol/L}$ razredčimo z vodo do skupne prostornine $500\,\text{mL}$. Kolikšna je nova koncentracija?
- $5{,}0\,\text{mol/L}$
~ Razmerje si obrnil ($\dfrac{1{,}0 \cdot 500}{100}$). Z dodajanjem vode se koncentracija zmanjša, ne poveča.
- $0{,}17\,\text{mol/L}$
~ Tako dobiš, če $500\,\text{mL}$ vode *dodaš* ($V_2 = 600\,\text{mL}$). Naloga pa pravi, da je *končna* prostornina $500\,\text{mL}$.
+ $0{,}20\,\text{mol/L}$
> Iz $c_1 V_1 = c_2 V_2$ sledi $c_2 = \dfrac{1{,}0 \cdot 100}{500} = 0{,}20\,\text{mol/L}$. Odgovor $0{,}17\,\text{mol/L}$ bi dobil, če bi $500\,\text{mL}$ vode *dodal* ($V_2 = 600\,\text{mL}$), naloga pa pravi, da je končna prostornina $500\,\text{mL}$.

:::simboli
m | masa (topljenca, topila ali raztopine) | | g | m(raztopina) = m(topljenec) + m(topilo)
w | masni delež topljenca | w = \frac{m(\text{topljenec})}{m(\text{raztopina})} | – | v odstotkih: pomnožimo s 100
c | množinska koncentracija | c = \frac{n}{V} | mol/L | tudi c = m : (M · V)
n | množina topljenca | n = \dfrac{m}{M} | mol
V | prostornina cele raztopine | | L
M | molska masa topljenca | | g/mol
n_1, n_2 | množina topljenca pred in po redčenju | | mol | pri redčenju je n₁ = n₂
c_1 | koncentracija pred redčenjem | | mol/L
c_2 | koncentracija po redčenju | c_2 = c_1 \cdot \dfrac{V_1}{V_2} | mol/L
V_1 | prostornina raztopine pred redčenjem | V_1 = \dfrac{c_2 \cdot V_2}{c_1} | L | V₁ in V₂ sta lahko oba v mL
V_2 | prostornina raztopine po redčenju | | L
:::
