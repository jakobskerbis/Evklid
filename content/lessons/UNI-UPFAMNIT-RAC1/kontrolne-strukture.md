---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Mobilni paket stane $10$ € na mesec in vključuje $10\,\text{GB}$ prenosa. Vsak dodatni gigabajt stane $2$ €, operater pa obljublja, da račun nikoli ne preseže $25$ €. Koliko plačaš, če porabiš $7\,\text{GB}$? Koliko pri $12\,\text{GB}$ in koliko pri $25\,\text{GB}$?

Odgovore izračunaš v pol minute. Operater pa to dela za milijon uporabnikov, zato potrebuje program, ki pri vsakem **izbere** pravi račun. Podobno mora telefon vsako minuto znova preveriti baterijo, torej mora znati nekaj **ponavljati**.

Ukazom, ki odločajo, kateri del programa se izvede in kolikokrat, rečemo **kontrolne strukture**.

## Razlaga

**1. Trije računi.** Izračunajmo vse tri primere iz uvoda in zapišimo, kaj smo pri tem naredili:

| Poraba | Kaj preverimo | Račun | Cena |
|---|---|---|---|
| $7\,\text{GB}$ | $7 \le 10$? da | osnovna cena | $10$ € |
| $12\,\text{GB}$ | $12 \le 10$? ne | $10 + 2 \cdot 2 = 14$ | $14$ € |
| $25\,\text{GB}$ | $25 \le 10$? ne | $10 + 2 \cdot 15 = 40$, več kot $25$ | $25$ € |

Opaziš vzorec? Preden smo kaj računali, smo odgovorili na vprašanje z odgovorom *da* ali *ne*. Šele odgovor je povedal, kateri račun sledi.

Takemu vprašanju v programu rečemo **pogoj**. To je logični izraz, katerega vrednost je `true` ali `false`, na primer `gb <= 10`. Ukaz, ki glede na pogoj izbere eno od dveh poti, je **pogojni stavek** `if`:

```java
int cena;
if (gb <= 10) {
    cena = 10;
} else {
    cena = 10 + 2 * (gb - 10);
    if (cena > 25) {
        cena = 25;
    }
}
```

Ob resničnem pogoju se izvede prvi **blok** (v zavitih oklepajih), sicer blok za `else`. Del `else` lahko izpustiš; takrat se ob neresničnem pogoju ne zgodi nič. Znotraj bloka je lahko nov `if`. Temu rečemo **gnezdenje**.

Kadar je možnosti več kot dve, pogoje verižimo z `else if`. Program jih preverja od zgoraj navzdol in izvede le prvo vejo z resničnim pogojem.

:::premisli
Pri kateri najmanjši celi porabi v GB začne veljati omejitev, da je račun natanko $25$ €? Napovej, preden računaš.
---
Pri $18\,\text{GB}$. Pri $17\,\text{GB}$ je račun $10 + 2 \cdot 7 = 24$ €, kar je še pod mejo. Pri $18\,\text{GB}$ bi bil $10 + 2 \cdot 8 = 26$ €, zato notranji `if` ceno zniža na $25$ €.
:::

**2. Isti korak, znova in znova.** Telefon ima polno baterijo ($100$ odstotkov). Med gledanjem videa izgubi $10$ odstotnih točk na uro. Koliko ur zdrži? Na roke pišeš $100$, $90$, $80$, … in vsakič narediš isto: odšteješ $10$, prišteješ eno uro in pogledaš, ali je baterija še nad nič.

Spet vzorec: isti korak se ponavlja, **dokler** velja pogoj. Taki strukturi rečemo **zanka**. Najsplošnejša je `while`:

```java
int b = 100;
int ure = 0;
while (b > 0) {
    b = b - 10;
    ure = ure + 1;
}
```

Zanka najprej preveri pogoj. Če je resničen, izvede telo (blok), nato pogoj preveri znova. Ko je pogoj neresničen, program nadaljuje za zanko. Eni izvedbi telesa rečemo **obhod**. Tu je obhodov $10$, na koncu je `b` enak $0$ in `ure` enak $10$.

:::premisli
Kaj pa, če bi baterija padala po $30$ točk na uro? Koliko obhodov naredi zanka in kolikšen je `b` po njej?
---
Štiri obhode: $100 \to 70 \to 40 \to 10 \to -20$. Pogoj `b > 0` se preveri šele na začetku obhoda, zato zanka »preskoči« ničlo in konča pri $-20$. Zanka se ne ustavi točno na meji, ampak takrat, ko pogoj prvič ni izpolnjen.
:::

Kadar vnaprej veš, kolikokrat ponavljaš, je krajša zanka `for`. V glavi ima tri dele: začetno vrednost števca, pogoj in spremembo števca po vsakem obhodu:

```java
for (int i = 1; i <= 5; i++) {
    System.out.println("Opomnik " + i);
}
```

Ta zanka izpiše pet opomnikov. Zapis `i++` pomeni `i = i + 1`. Vsako zanko `for` lahko prepišeš v `while` in obratno.

**3. Trije gradniki.** Poglej vse programe zgoraj. Sestavljeni so le iz treh vrst gradnikov:

- **zaporedje**: ukazi se izvedejo eden za drugim,
- **izbira**: `if` izbere eno od poti,
- **ponavljanje**: `while` ali `for` ponavlja blok.

Izrek Böhma in Jacopinija pove: **vsak algoritem lahko zapišemo samo z zaporedjem, izbiro in ponavljanjem**, ki jih poljubno gnezdimo.

Iz tega izhaja način dela, ki mu rečemo **strukturna dekompozicija** (razčlenitev od zgoraj navzdol). Nalogo najprej razdeliš na nekaj velikih korakov. Vsak korak nato razčleniš naprej, dokler vsak del ni en sam gradnik. Primer za »koliko ur zdrži telefon z varčevalnim načinom« (primer 3 spodaj):

```
izračunaj čas delovanja
├─ nastavi b = 100, ure = 0   (zaporedje)
├─ dokler je b > 0            (ponavljanje)
│  ├─ izberi porabo           (izbira)
│  └─ povečaj ure
└─ izpiši ure
```

## Rešeni primeri

### Primer 1: veriga pogojev

Telefon izbere način delovanja z verigo pogojev:

```java
if (b <= 5) {
    nacin = "izklop";
} else if (b <= 20) {
    nacin = "varčevanje";
} else {
    nacin = "normalno";
}
```

Kateri način izbere pri bateriji $20$ odstotkov in kateri pri $3$ odstotkih?

**Podatki:** koda zgoraj, $b_1 = 20$, $b_2 = 3$
**Iščemo:** vrednost `nacin` za vsako baterijo

:::formula
Veriga `if – else if – else`: pogoje preveri od zgoraj navzdol, izvede prvo vejo z resničnim pogojem, ostale preskoči.
:::

**Rešitev:**

1. Pri $b = 20$: pogoj $20 \le 5$ je neresničen, zato program gre na naslednji pogoj.
2. Pogoj $20 \le 20$ je resničen (enakost je vključena), zato `nacin = "varčevanje"`; veja `else` se preskoči.
3. Pri $b = 3$: že prvi pogoj $3 \le 5$ je resničen, zato `nacin = "izklop"`. Drugi pogoj bi bil tudi resničen, a ga program sploh ne preveri.
4. Odgovor: pri $20$ odstotkih telefon izbere varčevanje, pri $3$ odstotkih izklop.

### Primer 2: koliko obhodov

Aplikacija za učenje pošilja obvestilo vsakih $15$ minut od 8.00 do vključno 10.00. Čas `t` šteje minute od 8.00:

```java
for (int t = 0; t <= 120; t += 15) {
    posljiObvestilo();
}
```

Zapis `t += 15` pomeni `t = t + 15`. Koliko obvestil pošlje? Koliko bi jih, če bi namesto `<=` pisalo `<`?

**Podatki:** začetek $t = 0$, korak $15\,\text{min}$, pogoj $t \le 120$
**Iščemo:** število obhodov zanke

:::formula
Obhod se izvede za vsako vrednost števca, pri kateri je pogoj resničen. Velja $\text{število~obhodov} = \dfrac{\text{zadnja} - \text{prva}}{\text{korak}} + 1$, kjer sta prva in zadnja vrednost števca, pri katerih je pogoj še resničen.
:::

**Rešitev:**

1. Števec zavzame vrednosti $0, 15, 30, 45, 60, 75, 90, 105, 120$. Pri $135$ je pogoj neresničen in zanka se konča.
2. Preštejemo: $\dfrac{120 - 0}{15} + 1 = 9$ obhodov. Enica na koncu šteje tudi prvi obhod pri $t = 0$.
3. S pogojem `t < 120` zadnja vrednost $120$ ne izpolni pogoja, zato je obhodov $9 - 1 = 8$.
4. Odgovor: aplikacija pošlje $9$ obvestil; z `<` bi jih $8$ (brez tistega ob 10.00).

### Primer 3: zanka z odločitvijo v telesu

Telefon pri bateriji nad $20$ odstotki porabi $10$ točk na uro. Ko baterija pade na $20$ ali manj, vklopi varčevanje in porabi le $5$ točk na uro. Koliko ur zdrži od polne baterije do nič? Napiši program in ga izračunaj.

**Podatki:** začetna baterija $100$, poraba $10$ na uro pri $b > 20$, poraba $5$ na uro pri $b \le 20$, konec pri $b \le 0$
**Iščemo:** število ur `ure`

:::formula
Ponavljanje, v katerem je izbira: `while (b > 0) { if (b > 20) … else … }`
:::

**Rešitev:**

1. Dekompozicija (drevo v razlagi): začetne vrednosti, nato zanka, v njej izbira porabe, na koncu izpis.

```java
int b = 100, ure = 0;
while (b > 0) {
    if (b > 20) {
        b = b - 10;
    } else {
        b = b - 5;
    }
    ure++;
}
```

2. Prva faza: dokler je $b > 20$, se baterija zmanjšuje po $10$. Od $100$ do $20$ je to $\dfrac{100 - 20}{10} = 8$ obhodov.
3. Pri $b = 20$ pogoj `b > 20` ni več resničen, zato velja veja `else`. Od $20$ do $0$ je $\dfrac{20}{5} = 4$ obhodov.
4. Skupaj $8 + 4 = 12$ obhodov. Po zadnjem je $b = 0$, pogoj `b > 0` je neresničen in zanka se konča.
5. Odgovor: telefon zdrži $12$ ur, od tega zadnje $4$ ure v varčevalnem načinu.

### Primer 4: zdaj ti

Telefon prenaša datoteko velikosti $50\,\text{MB}$ s hitrostjo $8\,\text{MB}$ na sekundo:

```java
int preneseno = 0, s = 0;
while (preneseno < 50) {
    preneseno += 8;
    s++;
}
```

Koliko je `s` po zanki in koliko `preneseno`?

**Podatki:** velikost $50\,\text{MB}$, korak $8\,\text{MB}$ na obhod, začetno `preneseno = 0`
**Iščemo:** `s` in `preneseno` po zanki

:::formula
Zanka teče, dokler je `preneseno < 50`; vsak obhod doda $8$ in eno sekundo.
:::

**Rešitev:**

1. Vrednosti `preneseno` po obhodih: $8, 16, 24, 32, 40, 48, \ldots$
2. Pri $48$ je pogoj $48 < 50$ še resničen, zato sledi še en obhod.
3. Dokončaj sam, nato preveri:

:::premisli
Koliko je `s` in koliko `preneseno`, ko se zanka konča? Zakaj `preneseno` ni natanko $50$?
---
`s` je $7$, `preneseno` pa $56$. Sedmi obhod prinese $48 + 8 = 56$, pogoj $56 < 50$ je neresničen in zanka se ustavi. Zanka prišteje celih $8$, čeprav je manjkalo le $2$.
:::

## Pogoste napake

- **Za ena preveč ali premalo.** »Od 8.00 do 10.00 vsakih 15 minut je $120 : 15 = 8$ obvestil.« Pozabiš prvo vrednost ali zamešaš `<` in `<=`. Popravek: izpiši prve in zadnje vrednosti števca in preveri pogoj na meji.
- **Zanka, ki se ne konča.** `while (b > 0) { ure++; }` se vrti v nedogled, ker se `b` v telesu ne spremeni. Pogoj se ne preverja »sam od sebe«: nekaj v telesu ga mora premakniti proti `false`. Popravek: pri vsaki zanki poišči vrstico, ki spremeni spremenljivko iz pogoja.
- **Napačen vrstni red v verigi.** Če zapišeš najprej `if (b <= 20)` in šele nato `else if (b <= 5)`, pri $3$ odstotkih dobiš »varčevanje«, ker se izvede le prva resnična veja. Popravek: v verigi postavi ožje pogoje pred širše.
- **Prirejanje namesto primerjave.** `if (b = 20)` ne vpraša, ali je `b` enak $20$, ampak mu prireja $20$; v Javi to ni pogoj (rezultat ni tipa `boolean`), zato prevajalnik javi napako. Popravek: primerjava je `==`.

## Povzetek

- Pogoj je logični izraz z vrednostjo `true` ali `false`.
- `if` izbere blok glede na pogoj; `else` je neobvezen; `else if` veriži več možnosti in izvede le prvo resnično vejo.
- `while` ponavlja telo, dokler je pogoj resničen; pogoj preveri pred vsakim obhodom.
- `for` je zanka s števcem: začetek, pogoj, sprememba. Število obhodov $= \frac{\text{zadnja} - \text{prva}}{\text{korak}} + 1$; mejo (`<` ali `<=`) vedno preveri.
- Vsak algoritem je sestavljen iz zaporedja, izbire in ponavljanja; strukturna dekompozicija nalogo razčleni od zgoraj navzdol do teh gradnikov.

## Drugače: Korak za korakom s številkami

Sledenje programu je najzanesljivejši način, da vidiš, kaj zanka naredi. Za primer 3 zapišemo vrstico za vsak obhod:

| Obhod | `b` na začetku | `b > 20`? | `b` na koncu |
|---|---|---|---|
| 1 | $100$ | da | $90$ |
| 2 | $90$ | da | $80$ |
| 3 | $80$ | da | $70$ |
| 4 | $70$ | da | $60$ |
| 5 | $60$ | da | $50$ |
| 6 | $50$ | da | $40$ |
| 7 | $40$ | da | $30$ |
| 8 | $30$ | da | $20$ |
| 9 | $20$ | ne | $15$ |
| 10 | $15$ | ne | $10$ |
| 11 | $10$ | ne | $5$ |
| 12 | $5$ | ne | $0$ |

Po 12. obhodu je $b = 0$ in zanka se konča. Obhod 9 je prvi v varčevalnem načinu, ker je `b > 20` pri natanko $20$ neresničen. Tako tabelo naredi vedno, ko nisi prepričan o meji.

## Drugače: Kot zgodba

Dostavljavec Jure zjutraj dobi listek z navodili. Najprej naloži paket, nato se odpelje, nato pozvoni. To je **zaporedje**: koraki eden za drugim.

Pri vratih se mora odločiti. Če kdo odpre, izroči paket. Sicer ga pusti pri sosedu. To je **izbira**: vprašanje z odgovorom *da* ali *ne* in dve poti.

Paketov je veliko, a Jure nima stotih enakih listkov, le enega: »Dokler je v kombiju še kak paket, ponovi dostavo.« To je **ponavljanje**. Če Jure pozabi paket po dostavi vzeti iz kombija, bo vozil v nedogled: zanka, ki ne spremeni pogoja.

Šef je dan načrtoval od zgoraj navzdol: »dostavi vse pakete« je razdelil na »vzemi, odpelji, izroči«, »izroči« pa na izbiro pri vratih. To je strukturna dekompozicija.

## Preveri se

? Program `int x = 1; while (x < 20) { x = x * 3; }` sledimo tako, da zapišemo vse vrednosti `x`, od začetne do končne. Katero zaporedje je pravilno?
- $1, 3, 9$
~ Zanka se ne ustavi, preden `x` preseže $20$: pri $x = 9$ je pogoj $9 < 20$ resničen, zato sledi še en obhod.
+ $1, 3, 9, 27$
- $1, 3, 9, 27, 81$
~ Pri $x = 27$ je pogoj $27 < 20$ neresničen, zato se telo ne izvede več.
- $3, 9, 27, 81$
~ Začetna vrednost je $1$, pri $27$ pa se zanka že konča.
> Pogoj se preveri pred vsakim obhodom: $1 < 20$, $3 < 20$, $9 < 20$ so resnični, $27 < 20$ ni. Končna vrednost je $27$.

? Koliko obhodov približno naredi zanka `int n = 1000; while (n > 1) { n = n / 2; }`? Oceni brez natančnega sledenja.
- približno $500$
~ To bi veljalo, če bi `n` vsakič zmanjšali za $2$. Deljenje z $2$ ga zmanjšuje veliko hitreje.
+ približno $10$
- približno $1000$
~ Tako bi bilo, če bi `n` zmanjševali za $1$. Pri razpolavljanju se število hitro skrči.
- približno $3$
~ Po treh razpolovitvah je `n` še $125$, kar je precej več od $1$.
> Vsak obhod razpolovi `n`, $2^{10} = 1024$, zato je obhodov okoli $10$ (natančno $9$ pri celoštevilskem deljenju).

? Zakaj se zanka `int b = 50; while (b > 0) { ure++; }` nikoli ne konča?
- Ker je začetna vrednost $50$ prevelika.
~ Velikost ni pomembna: tudi pri $b = 1$ se zanka ne bi končala.
- Ker program pogoj preveri samo enkrat, na začetku.
~ Pogoj se preveri pred vsakim obhodom, a je vsakič resničen.
+ Ker telo ne spremeni `b`, zato pogoj `b > 0` ostane resničen.
> Da se zanka konča, mora telo spreminjati spremenljivko iz pogoja tako, da pogoj sčasoma postane `false`.

? Telefon pri bateriji $15$ odstotkov izpiše »varčevanje«, pri $50$ odstotkih »normalno«. Kateri pogoj stoji v `if (…) { "varčevanje" } else { "normalno" }`?
- `b > 20`
~ Ta pogoj je resničen pri $50$, zato bi tam izpisal »varčevanje«: veji sta obrnjeni.
- `b < 10`
~ Pri $15$ je ta pogoj neresničen, zato bi izpisal »normalno«.
+ `b < 20`
- `b == 20`
~ Ta pogoj je resničen le pri natanko $20$; pri $15$ bi izpisal »normalno«.
> Pogoj mora biti resničen pri $15$ in neresničen pri $50$. Od ponujenih to velja le za `b < 20`.

? Paket iz uvoda: $10$ € vključuje $10\,\text{GB}$, vsak dodatni GB stane $2$ €, največ $25$ €. Koliko plačaš za $15\,\text{GB}$?
- $25$ €
~ Omejitev velja le, če račun preseže $25$ €. Tu je račun nižji, zato ga notranji `if` ne spremeni.
- $30$ €
~ To je $2 \cdot 15$: dodatne GB šteješ šele nad $10$, osnovno ceno pa prišteješ.
+ $20$ €
- $10$ €
~ $15 \le 10$ ni res, zato se izvede veja `else` z doplačilom.
> $15 > 10$, zato $10 + 2 \cdot (15 - 10) = 20$ €. Ker $20$ ni več kot $25$, cena ostane $20$ €.

:::simboli
\text{prva} | prva vrednost števca, pri kateri je pogoj resničen | | |
\text{zadnja} | zadnja vrednost števca, pri kateri je pogoj še resničen | | | odvisna od meje < ali <=
\text{korak} | sprememba števca v enem obhodu | | |
\text{število~obhodov} | število obhodov zanke for | \text{število~obhodov} = \dfrac{\text{zadnja} - \text{prva}}{\text{korak}} + 1 | – |
t | čas (števec zanke) | | min |
b | stanje baterije | | \% |
b_1, b_2 | stanji baterije v primeru | | \% | v primeru $20\,\%$ in $3\,\%$
x | spremenljivka v zanki while | | | vsak obhod se pomnoži s 3
:::
