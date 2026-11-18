---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Pred več kot osemsto leti so italijanski trgovci kupovali in prodajali blago po vsem Sredozemlju. Sukno so merili v laktih, poper v funtih, plačevali pa z različnimi kovanci. Ves čas so morali odgovarjati na isto vrsto vprašanja: če toliko blaga stane toliko, koliko stane drugačna količina?

Leonardo iz Pise, ki ga danes poznamo kot Fibonaccija, je kot mladenič pomagal očetu pri trgovanju v severni Afriki. Leta 1202 je napisal knjigo *Liber Abaci* (Knjiga o računanju). V njej je trgovcem razložil, kako iz treh znanih števil izračunajo četrto. Temu so kasneje rekli **pravilo treh**, pri nas pa mu rečemo **sklepni račun**.

Danes ga uporabljaš v trgovini, ko primerjaš cene, pri receptu za več oseb in pri deljenju računa s prijatelji.

## Razlaga

**Mamljiva bližnjica.** Trije enaki zvezki stanejo $4{,}50$ €. Mojca bi kupila pet zvezkov in hitro sklepa: »Dva zvezka več, torej dva evra več. Plačam $6{,}50$ €.« Sliši se smiselno, saj se cena res poveča. Toda pravilo »vsak dodatni zvezek doda en evro« si je izmislila sama. Nikjer ne piše, da zvezek stane en evro.

:::premisli
Uporabi Mojčino pravilo za šest zvezkov. Najprej: tri zvezke in še tri zraven. Nato: dvakrat kupiš paket treh zvezkov. Kaj opaziš?
---
Po Mojčinem pravilu bi šest zvezkov stalo $4{,}50 + 3 = 7{,}50$ €. Dva paketa po tri zvezke pa stanejo $2 \cdot 4{,}50 = 9$ €. Isti nakup ne more imeti dveh cen, zato je pravilo napačno. Pravilna cena je $9$ €.
:::

**Popravek: sklep na enoto.** Namesto ugibanja se vprašamo, koliko stane **en** zvezek. Tri zvezke plačamo $4{,}50$ €, zato en stane $4{,}50 : 3 = 1{,}5$ €. Pet zvezkov stane petkrat toliko: $5 \cdot 1{,}5 = 7{,}5$ €. Mojca bi torej plačala premalo.

**Tabela.** Podatke uredimo v tabelo. V levi stolpec pišemo eno količino, v desnega drugo. Prva vrstica je znani podatek, nato vrstica za eno enoto, zadnja vrstica je iskani podatek.

| število zvezkov | cena (€) | kako pridemo do vrstice |
|---|---|---|
| 3 | 4,50 | znano |
| 1 | 1,50 | obe strani delimo s 3 |
| 5 | 7,50 | obe strani pomnožimo s 5 |

Kar narediš na levi strani, narediš tudi na desni. Ko število zvezkov delimo s $3$, delimo s $3$ tudi ceno.

**Bližnjica, ki deluje.** Za šest zvezkov ne potrebuješ vrstice z enim zvezkom. Šest je dvakrat tri, zato je cena dvakrat $4{,}50$ €, torej $9$ €. Sklep na enoto pa deluje vedno, tudi ko števila niso tako lepa.

V simulaciji spodaj (Sklepni račun) je izbrana cena za 1 kg jabolk. Z drsnikom »kg« podvoji število kilogramov, na primer z $2$ na $4$. Opazuj tabelo pod grafom: cena se podvoji, cena za 1 kg pa ostane enaka.

**Druga past: več ne pomeni vedno več.** Štirje prijatelji kupijo darilo za $36$ €. Vsak plača $9$ €. Kaj, če se jim pridružita še dva? Mamljivo je računati kot pri zvezkih: več ljudi, več denarja. Toda darilo stane še vedno $36$ €. Zdaj ga deli šest ljudi, zato vsak plača $36 : 6 = 6$ €. Več ljudi pomeni manjši delež za vsakega.

Pri takih nalogah je »sklep na enoto« drugačen: ugotovimo, koliko bi plačal **en sam** človek. To je cela cena darila, $4 \cdot 9 = 36$ €.

:::premisli
Darilo za $36$ € bi kupilo $12$ prijateljev. Ali bo vsak plačal več ali manj kot $6$ €? Napovej, nato izračunaj.
---
Manj, ker je ljudi več kot šest, darilo pa stane enako. Vsak plača $36 : 12 = 3$ €.
:::

**Pred vsakim računom vprašanje.** Ko se ena količina poveča, ali se druga poveča ali zmanjša? Odgovor izbere pot: pri zvezkih najprej delimo in nato množimo, pri deljenju darila najprej množimo (cela cena) in nato delimo. Na koncu preveri, ali je rezultat smiseln.

## Rešeni primeri

### Primer 1 (lažji): čokolade

Štiri enake čokolade stanejo $6$ €. Koliko stane deset takih čokolad?

**Podatki:** $4$ čokolade stanejo $6$ €, kupimo $10$ čokolad
**Iščemo:** ceno $10$ čokolad

:::formula
cena 1 kosa = skupna cena : število kosov

cena več kosov = število kosov · cena 1 kosa
:::

**Rešitev:**

| število čokolad | cena (€) |
|---|---|
| 4 | 6 |
| 1 | ? |
| 10 | ? |

1. Več čokolad stane več, zato najprej poiščemo ceno ene čokolade.
2. Ena čokolada: $6 : 4 = 1{,}5$ €, ker ceno razdelimo na štiri enake dele.
3. Deset čokolad: $10 \cdot 1{,}5 = 15$ €, ker kupimo desetkrat po eno.
4. Preizkus: deset je več kot štiri, zato mora biti cena večja od $6$ €. Res je.

Deset čokolad stane $15$ €.

### Primer 2: jabolka po teži

Za $3$ kg jabolk plačaš $4{,}20$ €. Koliko plačaš za $2{,}5$ kg istih jabolk?

**Podatki:** $3$ kg stanejo $4{,}20$ €, kupimo $2{,}5$ kg
**Iščemo:** ceno $2{,}5$ kg

:::formula
cena 1 kg = skupna cena : število kilogramov

cena = število kilogramov · cena 1 kg
:::

**Rešitev:**

| masa (kg) | cena (€) |
|---|---|
| 3 | 4,20 |
| 1 | ? |
| 2,5 | ? |

1. Cena za 1 kg: $4{,}2 : 3 = 1{,}4$ €. Delimo, ker trije kilogrami stanejo trikrat toliko kot eden.
2. Cena za $2{,}5$ kg: $2{,}5 \cdot 1{,}4 = 3{,}5$ €. Množimo z decimalnim številom tako kot z naravnim.
3. Preizkus: $2{,}5$ kg je manj kot $3$ kg, zato mora biti cena manjša od $4{,}20$ €. Res je.

Za $2{,}5$ kg jabolk plačaš $3{,}50$ €.

### Primer 3 (težji): avtobus za izlet

Najem avtobusa za razredni izlet si učenci delijo enakomerno. Ko je bilo prijavljenih $24$ učencev, je vsak plačal $15$ €. Na dan izleta so štirje zboleli in denar dobili vrnjen. Koliko mora zdaj plačati vsak od preostalih učencev, če se cena avtobusa ni spremenila?

**Podatki:** $24$ učencev po $15$ €, zboleli $4$ učenci, cena avtobusa je enaka
**Iščemo:** koliko plača vsak od preostalih učencev

:::formula
cena avtobusa = število učencev · delež enega

delež enega = cena avtobusa : število učencev
:::

**Rešitev:**

| število učencev | plača vsak (€) |
|---|---|
| 24 | 15 |
| 1 (plača vse) | ? |
| 20 | ? |

1. Preostalih učencev je $24 - 4 = 20$.
2. Manj učencev, večji delež, zato ne delimo $15$ €. Najprej izračunamo celo ceno avtobusa: $24 \cdot 15 = 360$ €.
3. Ceno razdelimo med $20$ učencev: $360 : 20 = 18$ €.
4. Preizkus: $20 \cdot 18 = 360$ €, kar je cena avtobusa. Delež je večji od $15$ €, kot smo pričakovali.

Vsak od dvajsetih učencev plača $18$ €.

### Primer 4: zdaj ti

Za $1{,}5$ kg banan plačaš $2{,}70$ €. Koliko kilogramov banan dobiš za $4{,}50$ €?

**Podatki:** $1{,}5$ kg stane $2{,}70$ €, na voljo imaš $4{,}50$ €
**Iščemo:** maso banan za $4{,}50$ €

:::formula
cena 1 kg = skupna cena : število kilogramov

masa = denar : cena 1 kg
:::

**Rešitev:**

| masa (kg) | cena (€) |
|---|---|
| 1,5 | 2,70 |
| 1 | ? |
| ? | 4,50 |

1. Cena za 1 kg: $2{,}7 : 1{,}5 = 1{,}8$ €.
2. Zdaj ugotovi, kolikokrat gre $1{,}80$ € v $4{,}50$ €, in preveri, ali je odgovor večji od $1{,}5$ kg.

:::premisli
Koliko kilogramov banan dobiš?
---
$4{,}5 : 1{,}8 = 2{,}5$, torej $2{,}5$ kg. Imaš več denarja kot $2{,}70$ €, zato dobiš več kot $1{,}5$ kg.
:::

## Pogoste napake

- **Prištevanje razlike.** »Trije zvezki stanejo $4{,}50$ €, pet zvezkov dva evra več.« Tako sklepaš, kot da vsak kos stane natanko en evro. Cena se poveča *tolikokrat*, kolikokrat se poveča število kosov, ne *za toliko*. Popravek: najprej izračunaj ceno enega kosa.
- **»Več je vedno več.«** Pri deljenju računa učenec računa, da šest prijateljev plača več kot štirje. Spregleda, da je cena darila stalna. Popravek: pred računom se vprašaj, ali se druga količina ob večji prvi poveča ali zmanjša.
- **Deljenje v napačni smeri.** $3$ kg stanejo $2{,}40$ €, učenec pa računa $3 : 2{,}40 = 1{,}25$. To ni cena enega kilograma, ampak koliko kilogramov dobiš za en evro. Popravek: cena 1 kg je *cena : kilogrami*, v tabeli deliš obe strani z istim številom.
- **Mešane enote.** V eni vrstici so kilogrami, v drugi grami ($500$ g namesto $0{,}5$ kg). Popravek: pred računanjem vse zapiši v isti enoti.

## Povzetek

- Sklepni račun rešuje naloge, v katerih sta povezani dve količini, na primer število kosov in cena.
- Podatke zapišemo v tabelo: znana vrstica, vrstica za eno enoto, iskana vrstica.
- Kar naredimo z eno stranjo vrstice, naredimo tudi z drugo.
- Če se z več kosi poveča tudi cena: najprej delimo (cena enega kosa), nato množimo.
- Če si stalni znesek deli več ljudi: najprej množimo (cel znesek), nato delimo.
- Napačna bližnjica je prištevanje razlike. Vedno preveri, ali je rezultat smiselno večji ali manjši.

## Drugače: Kot zgodba

Benetke, tržni dan. Trgovec Marco proda sedem laktov modrega sukna za $21$ zlatnikov. Popoldne pride kupec in želi deset laktov.

Marcov vajenec takoj zakliče: »Tri lakte več, torej tri zlatnike več, $24$ zlatnikov!« Marco odkima. »Če bi tako računal, bi blago podaril. Povej mi najprej, koliko stane en sam laket.«

Vajenec razdeli $21$ zlatnikov na sedem enakih kupčkov: v vsakem so trije zlatniki. »En laket, trije zlatniki.« Nato postavi deset kupčkov po tri: $10 \cdot 3 = 30$ zlatnikov.

Kupec plača $30$ zlatnikov. Vajenec si zapiše v zvezek: najprej ena enota, nato koliko enot hočem. Prav to je pravilo treh iz Fibonaccijeve knjige: tri števila poznaš ($7$, $21$ in $10$), četrto ($30$) izračunaš.

## Drugače: Korak za korakom s številkami

Naloga: pet enakih svinčnikov stane $4$ €. Koliko stane osem svinčnikov?

1. Izpiši podatke: $5$ svinčnikov, $4$ €, iščemo ceno $8$ svinčnikov.
2. Odloči: več svinčnikov, višja cena. Najprej delimo, nato množimo.
3. Tabela:

| svinčniki | cena (€) |
|---|---|
| 5 | 4 |
| 1 | ? |
| 8 | ? |

4. En svinčnik: $4 : 5 = 0{,}8$ €.
5. Osem svinčnikov: $8 \cdot 0{,}8 = 6{,}4$ €.
6. Preizkus z ocenjevanjem: osem je malo manj kot dvakrat pet, zato je cena malo manj kot $2 \cdot 4 = 8$ €. $6{,}40$ € se ujema.
7. Odgovor: osem svinčnikov stane $6{,}40$ €.

## Preveri se

? Pri treh primerih se druga količina podvoji, ko podvojiš prvo. Kateri primer ne spada zraven?
- število kilogramov jabolk in cena jabolk
~ Dva kilograma staneta dvakrat toliko kot en kilogram, zato ta par spada zraven.
- število kupljenih vstopnic in skupna cena
~ Dve vstopnici staneta dvakrat toliko kot ena, zato ta par spada zraven.
+ število prijateljev, ki si delijo račun, in znesek, ki ga plača vsak
- število litrov goriva in cena goriva
~ Pri stalni ceni za liter je dvakrat več litrov dvakrat dražje, zato par spada zraven.
> Račun je stalen. Če ga deli dvakrat več prijateljev, plača vsak polovico, ne dvakrat več.

? Pet enakih zvezkov stane $7$ €. Koliko stane osem takih zvezkov?
- $10$ €
~ To je $7 + 3$: prišteta razlika v številu zvezkov. Cena se ne poveča za tri evre, ampak tolikokrat, kolikokrat več zvezkov kupiš.
- $4{,}38$ €
~ Tako računaš, kot da bi več zvezkov stalo manj. Več zvezkov pa stane več.
+ $11{,}20$ €
- $56$ €
~ To je $7 \cdot 8$. Pozabil si, da $7$ € ni cena enega zvezka, ampak petih.
> En zvezek stane $7 : 5 = 1{,}40$ €, osem zvezkov pa $8 \cdot 1{,}40 = 11{,}20$ €.

? Število kupljenih vstopnic za kino se potroji, cena ene vstopnice ostane enaka. Kaj se zgodi s skupno ceno?
- Poveča se za $3$ €.
~ Potrojiti pomeni pomnožiti s $3$, ne prišteti $3$.
+ Potroji se.
- Ostane enaka.
~ Enaka ostane cena ene vstopnice, skupna cena pa je odvisna od števila vstopnic.
- Zmanjša se na tretjino.
~ Tako bi bilo, če bi si stalen znesek delilo trikrat več ljudi. Tu pa trikrat več vstopnic plačaš trikrat več.
> Vsaka vstopnica stane enako, zato trikrat več vstopnic stane trikrat več.

? Luka rešuje nalogo »$3$ kg moke stanejo $2{,}40$ €. Koliko stane $5$ kg?« takole. 1. korak: v tabelo zapiše $3$ kg in $2{,}40$ €. 2. korak: cena 1 kg je $3 : 2{,}40 = 1{,}25$ €. 3. korak: $5$ kg stane $5 \cdot 1{,}25 = 6{,}25$ €. Kateri korak je napačen?
- 1. korak
~ Tabela je pravilna: znani podatek je v prvi vrstici.
+ 2. korak
- 3. korak
~ Množenje je pravilno izračunano, a uporablja napačen rezultat iz prejšnjega koraka.
- Noben, rešitev je pravilna.
~ Če $3$ kg stanejo $2{,}40$ €, stane $6$ kg $4{,}80$ €. Manj kilogramov ne more stati več, zato je $6{,}25$ € za $5$ kg preveč.
> Luka je delil v napačni smeri. Cena 1 kg je $2{,}40 : 3 = 0{,}80$ €, torej $5$ kg stane $5 \cdot 0{,}80 = 4$ €.

? Razred plača najem dvorane $120$ €; strošek si učenci delijo enakomerno. Najprej je bilo prijavljenih $20$ učencev, nato se jih prijavi še $4$. Koliko plača zdaj vsak?
- $6$ €
~ To je delež, ko je bilo učencev $20$. Novi učenci niso upoštevani.
- $7{,}20$ €
~ Tako računaš, kot da več učencev plača več. Dvorana stane enako, zato se delež zmanjša.
+ $5$ €
- $10$ €
~ To je $6 + 4$: prišteto število novih učencev. Učenci in evri se ne seštevajo.
> Vseh učencev je $24$, zato vsak plača $120 : 24 = 5$ €.

:::simboli
\text{cena 1 kosa} | cena enega kosa (enote) | \text{cena 1 kosa} = \text{skupna cena} : \text{število kosov} | | najprej izračunamo ceno za eno enoto
\text{skupna cena} | cena vseh kosov skupaj | | | v evrih
\text{število kosov} | koliko kosov kupimo | | | pri jabolkih število kilogramov
:::
