---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Prvi prizor: kitarist kupuje nove strune. Na spletni strani piše, da je nihajoči del strune dolg $650\,\text{mm}$. Prodajalec ga izmeri in reče: »$65\,\text{cm}$.« Se je kdo zmotil?

Drugi prizor: tvoja najljubša pesem traja $210$ sekund, predvajalnik na telefonu pa kaže $3{:}30$.

Na videz prizora nimata nič skupnega. V enem merimo dolžino, v drugem čas. Skrivata pa isto misel: **ista količina je zapisana z različnima enotama.** Struna je ena sama, pesem traja enako dolgo. Spremenila sta se le število in enota ob njem. Pri večji enoti (centimeter, minuta) je število manjše, pri manjši enoti (milimeter, sekunda) večje.

Prehodu iz ene enote v drugo rečemo **pretvarjanje enot**. Potrebuješ ga vsakič, ko podatki pridejo v različnih enotah: ko sestavljaš seznam pesmi za zabavo, preverjaš, ali bo kabel za zvočnik dovolj dolg, ali odmerjaš vodo v kozarce.

## Razlaga

**Lestev dolžinskih enot.** Predstavljaj si stopnice. Na vrhu je največja enota, vsaka stopnica niže je manjša enota. Ob puščici piše, na koliko kosov razrežeš eno enoto, ko stopiš navzdol:

```
km
  ↓ ·1000
m
  ↓ ·10
dm
  ↓ ·10
cm
  ↓ ·10
mm
```

En meter razrežeš na $10$ decimetrov, en decimeter na $10$ centimetrov. Na vsaki stopnici navzdol je kosov več, vsak kos pa manjši.

Struno iz prvega prizora lahko zapišeš na tri načine:

| | v $\text{m}$ | v $\text{cm}$ | v $\text{mm}$ |
|---|---|---|---|
| struna | $0{,}65$ | $65$ | $650$ |

Vsi trije zapisi opisujejo isto struno. Ko greš v tabeli desno (v manjšo enoto), število raste.

:::premisli
Od $\text{m}$ do $\text{mm}$ so tri stopnice, vsaka s faktorjem $10$. Napovej: s katerim številom pomnožiš metre, da dobiš milimetre?
---
S $1000$, ker je $10 \cdot 10 \cdot 10 = 1000$. Zato je $0{,}65\,\text{m} = 650\,\text{mm}$. Faktorje stopnic med seboj množiš; če bi jih seštel ($10 + 10 + 10 = 30$), bi dobil napačen rezultat.
:::

**Masa in prostornina.** Za maso in za prostornino tekočin so stopnice podobne, le faktorji med njimi so ponekod večji:

| masa: korak navzdol | faktor |
|---|---|
| $\text{t} \to \text{kg}$ | $1000$ |
| $\text{kg} \to \text{dag}$ | $100$ |
| $\text{dag} \to \text{g}$ | $10$ |

| prostornina: korak navzdol | faktor |
|---|---|
| $\text{hl} \to \text{l}$ | $100$ |
| $\text{l} \to \text{dl}$ | $10$ |
| $\text{dl} \to \text{cl}$ | $10$ |
| $\text{cl} \to \text{ml}$ | $10$ |

Iz tabel razbereš, da je $1\,\text{kg} = 100\,\text{dag} = 1000\,\text{g}$ in $1\,\text{l} = 10\,\text{dl} = 1000\,\text{ml}$. Dekagram je torej $10$ gramov, kilogram pa je $100$ dekagramov. Liter je toliko kot kubični decimeter ($1\,\text{l} = 1\,\text{dm}^3$), mililiter toliko kot kubični centimeter ($1\,\text{ml} = 1\,\text{cm}^3$).

**Čas ima drugačne stopnice.**

```
dan
  ↓ ·24
h
  ↓ ·60
min
  ↓ ·60
s
```

Spomni se številčnice ure: kazalec za minute obkroži $60$ razdelkov, preden mine ena ura. Pol ure je $30$ minut, četrt ure $15$ minut. Pri času torej ne štejemo po deset, kot pri metrih in gramih.

:::premisli
Pesem traja $1{,}5$ minute. Ali je to $1\,\text{min}\,50\,\text{s}$? Zakaj?
---
Ne. $1{,}5$ minute je ena minuta in še pol minute. Minuta ima $60$ sekund, ne $100$, zato je pol minute $30\,\text{s}$. Torej $1{,}5\,\text{min} = 1\,\text{min}\,30\,\text{s} = 90\,\text{s}$.
:::

V simulaciji spodaj izberi količino čas, vrednost $1{,}5$ in pretvori iz $\text{h}$ v $\text{min}$. Opazuj, da dobiš $90\,\text{min}$ in ne $150$. Nato zamenjaj količino na dolžino in pretvori $0{,}65\,\text{m}$ v $\text{mm}$; štej stopnice, ki se obarvajo.

**Pravilo, zapisano na kratko.** Šele zdaj zapišimo, kar kaže lestev:

- **navzdol**, v manjšo enoto: število **pomnožiš** s faktorji stopnic, zato je večje;
- **navzgor**, v večjo enoto: število **deliš** s faktorji stopnic, zato je manjše.

Pri dolžini, masi in prostornini so faktorji $10$, $100$ ali $1000$. Takrat se premakne le decimalna vejica: za eno, dve ali tri mesta. Pri času so faktorji $60$ in $24$, zato res množiš ali deliš.

Po vsakem računu se vprašaj, ali je rezultat smiseln: manjša enota, večje število.

## Rešeni primeri

### Primer 1: dolžina strune

Nihajoči del strune na kitari je dolg $65\,\text{cm}$. Koliko je to v metrih in koliko v milimetrih?

**Podatki:** dolžina strune $l = 65\,\text{cm}$
**Iščemo:** dolžino $l$ v $\text{m}$ in v $\text{mm}$

:::formula
Navzgor delimo, navzdol množimo: $1\,\text{m} = 100\,\text{cm}$, $1\,\text{cm} = 10\,\text{mm}$.
:::

**Rešitev:**

1. Iz $\text{cm}$ v $\text{m}$ gremo dve stopnici navzgor, v večjo enoto, zato delimo s $100$: $65 : 100 = 0{,}65$. Vejica se premakne za dve mesti levo.
2. Iz $\text{cm}$ v $\text{mm}$ gremo eno stopnico navzdol, zato množimo z $10$: $65 \cdot 10 = 650$.
3. Preverimo smiselnost: največja enota ($\text{m}$) ima najmanjše število. ✓
4. Odgovor: struna je dolga $0{,}65\,\text{m}$ oziroma $650\,\text{mm}$.

### Primer 2: masa kitare

Akustična kitara ima maso $2{,}4\,\text{kg}$. Zapiši jo v dekagramih in v gramih.

**Podatki:** masa kitare $m = 2{,}4\,\text{kg}$
**Iščemo:** maso $m$ v $\text{dag}$ in v $\text{g}$

:::formula
$1\,\text{kg} = 100\,\text{dag} = 1000\,\text{g}$
:::

**Rešitev:**

1. Iz $\text{kg}$ v $\text{dag}$ gremo navzdol s faktorjem $100$, zato množimo: $2{,}4 \cdot 100 = 240$. Vejica gre dve mesti desno; prazno mesto zapolnimo z ničlo.
2. Iz $\text{kg}$ v $\text{g}$ je faktor $100 \cdot 10 = 1000$: $2{,}4 \cdot 1000 = 2400$.
3. Odgovor: kitara ima maso $240\,\text{dag}$ oziroma $2400\,\text{g}$.

### Primer 3: koliko pesmi za koncert

Šolski bend ima za koncert na voljo $1\,\text{h}\,45\,\text{min}$. Vsaka pesem s kratkim premorom vred traja $3\,\text{min}\,30\,\text{s}$. Koliko pesmi lahko zaigra?

**Podatki:** čas koncerta $1\,\text{h}\,45\,\text{min}$, ena pesem $3\,\text{min}\,30\,\text{s}$
**Iščemo:** število pesmi $n$

:::formula
Oba časa v isto enoto (sekunde), nato $n = t_{\text{koncert}} : t_{\text{pesem}}$.
:::

**Rešitev:**

1. Koncert v minutah: $1\,\text{h} = 60\,\text{min}$, zato $60 + 45 = 105$ minut.
2. Koncert v sekundah: minuta ima $60\,\text{s}$, zato $105 \cdot 60 = 6300$ sekund.
3. Pesem v sekundah: $3 \cdot 60 + 30 = 210$ sekund.
4. Časa sta v isti enoti, zato ju delimo: $6300 : 210 = 30$.
5. Preverimo: $30$ pesmi po $3{,}5$ minute je $30 \cdot 3{,}5 = 105$ minut. ✓
6. Odgovor: bend lahko zaigra $30$ pesmi.

### Primer 4: zdaj ti

Za glasbene kozarce natočiš v $8$ kozarcev po $150\,\text{ml}$ vode. Koliko litrov vode porabiš?

**Podatki:** $8$ kozarcev, v vsakem $150\,\text{ml}$ vode
**Iščemo:** skupno prostornino $V$ v litrih

:::formula
$V = 8 \cdot 150\,\text{ml}$, nato $1\,\text{l} = 1000\,\text{ml}$.
:::

**Rešitev:**

1. Skupaj: $8 \cdot 150 = 1200$, torej $1200\,\text{ml}$.
2. Iz $\text{ml}$ v $\text{l}$ gremo navzgor, v večjo enoto, zato bomo delili s $1000$.
3. Izračunaj sam, nato preveri:

:::premisli
Napovej najprej: bo število litrov večje ali manjše od $1200$ in zakaj? Nato izračunaj, koliko litrov je $1200\,\text{ml}$.
---
$1200 : 1000 = 1{,}2$, torej porabiš $1{,}2\,\text{l}$ vode. Vejica se premakne za tri mesta levo. Število je manjše od $1200$, ker je liter večja enota od mililitra.
:::

## Pogoste napake

- **Množenje namesto deljenja.** Učenec $65\,\text{cm}$ zapiše kot $6500\,\text{m}$, ker »pri metrih in centimetrih je faktor $100$«. Struna bi bila dolga več kilometrov. Faktor je pravi, smer pa ne. Popravek: najprej se vprašaj, ali greš v večjo enoto (število bo manjše, deliš) ali v manjšo (število bo večje, množiš).
- **Napačen faktor čez več stopnic.** Med $\text{m}$ in $\text{mm}$ vzame $100$, ker si je zapomnil $1\,\text{m} = 100\,\text{cm}$. Do milimetrov so tri stopnice po $10$, kar da $1000$.
- **Dekagram s faktorjem $10$.** Ker je $1\,\text{dag} = 10\,\text{g}$, učenec misli, da je $2{,}4\,\text{kg} = 24\,\text{dag}$. Iz tabele pa razbereš, da je korak $\text{kg} \to \text{dag}$ s faktorjem $100$ ($1\,\text{kg} = 1000\,\text{g}$, en dekagram pa je $10\,\text{g}$), zato je $2{,}4\,\text{kg} = 240\,\text{dag}$.
- **Čas kot decimalno število.** $1\,\text{h}\,30\,\text{min}$ zapiše kot $1{,}30\,\text{h}$; $3\,\text{min}\,45\,\text{s}$ pa kot $345\,\text{s}$. Ura ima $60$ minut in minuta $60$ sekund, ne $100$. Pravilno: $1\,\text{h}\,30\,\text{min} = 1{,}5\,\text{h}$ in $3 \cdot 60 + 45 = 225$ sekund.
- **Seštevanje različnih enot.** $2\,\text{m} + 50\,\text{cm}$ zapiše kot $52$. Metrov in centimetrov ne moreš kar sešteti. Najprej obe količini v isto enoto: $200\,\text{cm} + 50\,\text{cm} = 250\,\text{cm}$.

## Povzetek

- Pretvarjanje spremeni zapis (število in enoto), količina ostane enaka.
- V manjšo enoto **množimo**, v večjo **delimo**. Manjša enota pomeni večje število.
- Dolžina: $1\,\text{km} = 1000\,\text{m}$, $1\,\text{m} = 10\,\text{dm} = 100\,\text{cm} = 1000\,\text{mm}$.
- Masa: $1\,\text{t} = 1000\,\text{kg}$, $1\,\text{kg} = 100\,\text{dag} = 1000\,\text{g}$.
- Prostornina: $1\,\text{hl} = 100\,\text{l}$, $1\,\text{l} = 10\,\text{dl} = 1000\,\text{ml}$; $1\,\text{l} = 1\,\text{dm}^3$.
- Čas: $1\,\text{dan} = 24\,\text{h}$, $1\,\text{h} = 60\,\text{min}$, $1\,\text{min} = 60\,\text{s}$. Tu vejica ne pomaga: $1{,}5\,\text{h} = 90\,\text{min}$.
- Preden računaš s količinami, jih zapiši v isti enoti.

## Drugače: Z analogijo

Pomisli na note pri glasbi. Celinka traja toliko kot dve polovinki, polovinka toliko kot dve četrtinki, četrtinka toliko kot dve osminki.

Takt, ki traja eno celinko, lahko zapolniš s $4$ četrtinkami ali z $8$ osminkami. Krajše note pomenijo več not, takt pa je še vedno enako dolg.

Z enotami je natanko tako. Manjša enota je kot krajša nota: potrebuješ jih več, da napolniš isto količino. Razlika je le v faktorju. Pri notah je med sosednjima vrednostma faktor $2$, pri dolžini $10$, pri času $60$.

Še ena primerjava: $1\,\text{€}$ je $100$ centov. Če ceno zapišeš v centih, je število stokrat večje, denarja pa ni nič več.

## Drugače: Iz vsakdanjega življenja

**Kuhinja.** Recept zahteva $0{,}5\,\text{kg}$ moke, tehtnica pa kaže grame. Ker je $1\,\text{kg} = 1000\,\text{g}$, je $0{,}5\,\text{kg} = 500\,\text{g}$, pol od tisoč gramov.

**Pijača.** V steklenici je $1{,}5\,\text{l}$ soka. Ker je $1\,\text{l} = 10\,\text{dl}$, je v njej $15\,\text{dl}$. Ko natočiš kozarec z $2\,\text{dl}$, ostane $13\,\text{dl}$.

**Pot v šolo.** Do šole je $1{,}2\,\text{km}$. Ker je $1\,\text{km} = 1000\,\text{m}$, je to $1200\,\text{m}$, natanko trije krogi na atletski stezi s $400\,\text{m}$.

**Tekma.** Nogometna tekma brez odmora traja $90$ minut. Ker je $90\,\text{min} = 60\,\text{min} + 30\,\text{min} = 1\,\text{h}\,30\,\text{min}$, se tekma, ki se začne ob $16{:}00$, brez odmora konča ob $17{:}30$.

## Preveri se

? V eni trgovini je kabel za zvočnik dolg $1{,}5\,\text{m}$, v drugi $150\,\text{cm}$. Kaj velja?
- Daljši je kabel s $150\,\text{cm}$, ker je število večje.
~ Števili lahko primerjaš le pri isti enoti. Pretvori: $1{,}5\,\text{m} = 150\,\text{cm}$.
- Daljši je kabel z $1{,}5\,\text{m}$, ker je meter večja enota.
~ Večja enota pri isti dolžini pomeni manjše število. Pretvori in primerjaj.
+ Kabla sta enako dolga.
- Ne moremo ju primerjati, ker sta enoti različni.
~ Lahko, ko ju zapišeš v isti enoti. Prav za to pretvarjamo.
> $1{,}5\,\text{m} = 1{,}5 \cdot 100\,\text{cm} = 150\,\text{cm}$. Pretvarjanje spremeni zapis, dolžina pa ostane ista.

? Uredi posnetke od najkrajšega do najdaljšega: A traja $200\,\text{s}$, B $3\,\text{min}\,10\,\text{s}$, C $3{,}5\,\text{min}$.
- A, B, C
~ Tako dobiš, če minute pretvarjaš, kot da imajo $100$ sekund ($310\,\text{s}$ in $350\,\text{s}$). Minuta ima $60\,\text{s}$.
+ B, A, C
- C, B, A
~ $3{,}5$ je najmanjše število, a v minutah, ki so večja enota. Najprej vse zapiši v sekundah.
> B: $3 \cdot 60 + 10 = 190\,\text{s}$, A: $200\,\text{s}$, C: $3{,}5 \cdot 60 = 210\,\text{s}$. Torej B, A, C.

? Kaj se zgodi s številom, če dolžino strune namesto v metrih zapišeš v milimetrih?
- Postane $1000$-krat manjše.
~ Milimeter je manjša enota, zato jih potrebuješ več. Število se poveča.
- Postane $100$-krat večje.
~ To velja za centimetre. Do milimetrov so tri stopnice po $10$, torej $1000$.
+ Postane $1000$-krat večje.
- Ostane enako, ker je struna ista.
~ Struna ostane ista, število pa se spremeni, ker se je spremenila enota.
> $1\,\text{m} = 1000\,\text{mm}$, zato je število milimetrov $1000$-krat večje od števila metrov, na primer $0{,}65\,\text{m} = 650\,\text{mm}$.

? Bobnar nese boben z maso $3{,}2\,\text{kg}$. Koliko dekagramov je to?
- $32\,\text{dag}$
~ Pomnožil si z $10$, ker je $1\,\text{dag} = 10\,\text{g}$. Med $\text{kg}$ in $\text{dag}$ pa je faktor $100$.
+ $320\,\text{dag}$
- $3200\,\text{dag}$
~ To je število gramov. Dekagram je desetkrat večji od grama, zato je dekagramov manj.
- $0{,}032\,\text{dag}$
~ Delil si, čeprav greš v manjšo enoto. V manjšo enoto množimo.
> $1\,\text{kg} = 100\,\text{dag}$, zato $3{,}2 \cdot 100 = 320$; boben ima maso $320\,\text{dag}$.

? Album traja $2700\,\text{s}$. Koliko minut je to?
- $27\,\text{min}$
~ Delil si s $100$. Minuta ima $60$ sekund.
- $2{,}7\,\text{min}$
~ Delil si s $1000$, kot pri metrih. Pri času je faktor $60$.
+ $45\,\text{min}$
- $162\,000\,\text{min}$
~ Pomnožil si s $60$. Iz sekund v minute gremo v večjo enoto, zato delimo.
> Iz $\text{s}$ v $\text{min}$ gremo navzgor, zato delimo s $60$: $2700 : 60 = 45$. Album traja $45$ minut.

:::simboli
n | število pesmi | n = t_{\text{koncert}} : t_{\text{pesem}} | – | celo število; ostanek časa ne zadošča za pesem
t_{\text{koncert}} | čas koncerta | | s | oba časa najprej pretvorimo v sekunde
t_{\text{pesem}} | trajanje ene pesmi s premorom | | s
V | skupna prostornina | V = 8 \cdot 150\,\text{ml} | l | 1 l = 1000 ml
:::
