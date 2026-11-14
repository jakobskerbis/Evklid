---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Šolski astronomski krožek si želi teleskop z računalniško vodeno montažo. Stane $4000$ €. Banka ponudi posojilo: krožek ga vrne v štirih enakih zneskih, vsakega ob koncu leta. Letna obrestna mera je $5\,\%$, obresti se pripisujejo enkrat na leto.

Koliko je en obrok? Prva misel je $4000 : 4 = 1000$ € in »še nekaj za obresti«. Ampak koliko? Obresti se vsako leto računajo od dolga, ki ga je vedno manj. Če obrok ugibamo, po štirih letih ostane dolg ali pa preplačamo.

Z enakimi obroki se odplačujejo stanovanjski krediti, nakup avtomobila in tudi telefon na obroke. Banka mora vnaprej povedati, koliko bo kdo plačal in kako se bo dolg zmanjševal. Oboje izračunaš sam, ko poznaš eno pravilo: kdaj sta dva zneska, plačana ob različnih trenutkih, vredna enako.

## Razlaga

**1. Poskus z ugibanjem.** Ob koncu vsakega leta banka dolgu najprej pripiše obresti (pomnoži ga z $r = 1{,}05$: ves dolg in še $5\,\%$ zraven), nato krožek plača obrok. Pri obroku $1100$ € je dolg po prvem letu

$$D_1 = 4000 \cdot 1{,}05 - 1100 = 3100$$

in po drugem letu

$$D_2 = 3100 \cdot 1{,}05 - 1100 = 2155$$

Tako nadaljujemo do konca četrtega leta. Za tri različne obroke dobimo (zneski v evrih):

| obrok | dolg po 4 letih |
|---|---|
| $1000$ | $551{,}90$ |
| $1100$ | $120{,}89$ |
| $1150$ | $-94{,}62$ (preplačilo) |

Obrok $1000$ € je premajhen, $1150$ € prevelik. Pravi je nekje vmes.

:::premisli
Je pravi obrok bližje $1100$ € ali $1150$ €? Oceni ga iz tabele.
---
Bližje $1100$ €. Ko obrok povečamo za $50$ €, ostanek pade za $120{,}89 + 94{,}62 = 215{,}51$ €. Do ničle manjka $120{,}89$ €, kar je dobra polovica od $215{,}51$, zato je obrok približno $1100 + 28 = 1128$ €.
:::

**2. Vzorec.** Namesto števil zapišimo črke: posojilo $G_0$, obrestovalni faktor $r = 1 + \frac{p}{100}$, obrok $a$, ostanek dolga po $k$ letih $D_k$.

$$D_1 = G_0 r - a$$

$$D_2 = (G_0 r - a)\,r - a = G_0 r^2 - a r - a$$

$$D_3 = (G_0 r^2 - a r - a)\,r - a = G_0 r^3 - a r^2 - a r - a$$

Posojilo se je obrestovalo vsa tri leta. Prvi obrok je plačan po enem letu, zato »dela« še dve leti ($a r^2$). Zadnji obrok je plačan na koncu in se ne obrestuje več ($a$). Po $n$ letih je $D_n = G_0 r^n - a\,(r^{n-1} + \dots + r + 1)$. V oklepaju je vsota prvih $n$ členov geometrijskega zaporedja s prvim členom $1$ in količnikom $r$:

$$D_n = G_0 r^n - a \cdot \frac{r^n - 1}{r - 1}$$

**3. Načelo ekvivalence glavnic.** Znesek ob izbranem trenutku imenujemo **glavnica** tega trenutka. Dveh zneskov iz različnih let ne smemo kar sešteti ali primerjati, ker denar medtem nosi obresti. **Načelo ekvivalence glavnic:** plačila so enakovredna, če so njihove vrednosti, preračunane na *isti* trenutek, enake. Za $k$ let naprej v času preračunamo z množenjem z $r^k$, za $k$ let nazaj z deljenjem z $r^k$.

Posojilo je odplačano, ko je $D_n = 0$. Takrat je vrednost posojila ob koncu $n$-tega leta enaka vrednosti vseh obrokov ob istem trenutku:

$$G_0 \cdot r^n = a \cdot \frac{r^n - 1}{r - 1} \qquad \text{(enačba)}$$

Isto enačbo lahko preračunamo na dan najema: vsak obrok delimo z $r$ tolikokrat, kolikor let je oddaljen od najema, in vsota je $G_0$.

**4. Anuiteta.** Enak obrok, ki ga plačujemo ob koncu vsakega obdobja in pokrije obresti ter del dolga, se imenuje **anuiteta**. Iz enačbe izrazimo $a$:

$$a = G_0 \cdot \frac{r^n (r - 1)}{r^n - 1}$$

Za teleskop je $r^4 = 1{,}05^4 = 1{,}21550625$ in

$$a = 4000 \cdot \frac{1{,}21550625 \cdot 0{,}05}{0{,}21550625} \approx 1128{,}05$$

Krožek plača $4 \cdot 1128{,}05 = 4512{,}20$ €, od tega $512{,}20$ € obresti. Če obroke plačujemo mesečno, je obdobje mesec: $n$ je število mesecev, obrestna mera pa mora veljati za en mesec.

:::premisli
Zakaj obresti niso $4000 \cdot 0{,}05 \cdot 4 = 800$ €?
---
Ker $5\,\%$ obresti velja le za prvo leto od celih $4000$ €. Vsaka anuiteta zmanjša dolg, zato so obresti v naslednjih letih računane od manjšega zneska. Skupaj jih je le $512{,}20$ €.
:::

**5. Amortizacijski načrt.** Tabela, ki za vsako leto pokaže, kako se anuiteta razdeli in koliko dolga ostane, je **amortizacijski načrt**. V vsaki vrstici:

- obresti od dolga na začetku leta: $o_k = D_{k-1} \cdot \frac{p}{100}$,
- **razdolžnina** (del anuitete, ki zmanjša dolg): $R_k = a - o_k$,
- nov ostanek dolga: $D_k = D_{k-1} - R_k$.

Za teleskop ($a = 1128{,}05$ € v vsakem letu, zneski v evrih):

| leto $k$ | obresti $o_k$ | razdolžnina $R_k$ | ostanek $D_k$ |
|---|---|---|---|
| 0 | – | – | 4000,00 |
| 1 | 200,00 | 928,05 | 3071,95 |
| 2 | 153,60 | 974,45 | 2097,50 |
| 3 | 104,88 | 1023,17 | 1074,33 |
| 4 | 53,72 | 1074,33 | 0,00 |

Obresti padajo, razdolžnine rastejo. Vsaka razdolžnina je za faktor $r$ večja od prejšnje: $928{,}05 \cdot 1{,}05 = 974{,}4525$. Vsota razdolžnin je ravno posojilo: $928{,}05 + 974{,}45 + 1023{,}17 + 1074{,}33 = 4000$. Zadnja razdolžnina je enaka ostanku pred zadnjim letom, zato se načrt zapre z $0$.

Ker zneske zaokrožujemo na cente, se zadnja anuiteta včasih razlikuje za cent ali dva; takrat zadnjo vrstico popravimo tako, da je $D_n = 0$.

Isto načelo velja pri varčevanju: kdor ob koncu vsakega leta vplača $a$, ima po $n$ letih $a \cdot \frac{r^n - 1}{r - 1}$, kar je desna stran enačbe zgoraj.

## Rešeni primeri

### Primer 1 (lažji): anuiteta za ogled mrka

Družina vzame posojilo $2700$ € za potovanje na ogled popolnega Sončevega mrka. Vrne ga v treh enakih letnih anuitetah; prvo plača leto po najemu. Letna obrestna mera je $4\,\%$, obrestovanje je letno. Kolikšna je anuiteta?

**Podatki:** $G_0 = 2700$ €, $p = 4\,\%$, $n = 3$ let, anuitete ob koncu leta
**Iščemo:** anuiteto $a$

:::formula
$a = G_0 \cdot \dfrac{r^n (r - 1)}{r^n - 1}$, kjer je $r = 1 + \dfrac{p}{100}$
:::

**Rešitev:**

1. Obrestovalni faktor: $r = 1 + \dfrac{4}{100} = 1{,}04$.
2. Potenca: $1{,}04^3 = 1{,}124864$. Ne zaokrožujemo, ker bi se napaka v naslednjem koraku povečala.
3. Vstavimo: $a = 2700 \cdot \dfrac{1{,}124864 \cdot 0{,}04}{0{,}124864} \approx 972{,}94$.
4. Smiselnost: vse tri anuitete skupaj so $3 \cdot 972{,}94 = 2918{,}82$ €, malo več od posojila, razlika so obresti.
5. Odgovor: anuiteta je $972{,}94$ €.

### Primer 2: amortizacijski načrt

Za posojilo iz primera 1 sestavi amortizacijski načrt. Zneske zaokroži na cente.

**Podatki:** $G_0 = 2700$ €, $p = 4\,\%$, $n = 3$, $a = 972{,}94$ €
**Iščemo:** obresti $o_k$, razdolžnine $R_k$ in ostanke $D_k$ za $k = 1, 2, 3$

:::formula
$o_k = D_{k-1} \cdot \dfrac{p}{100}$, $R_k = a - o_k$, $D_k = D_{k-1} - R_k$
:::

**Rešitev:**

1. Prvo leto: $o_1 = 2700 \cdot 0{,}04 = 108$, $R_1 = 972{,}94 - 108 = 864{,}94$, $D_1 = 2700 - 864{,}94 = 1835{,}06$.
2. Drugo leto: $o_2 = 1835{,}06 \cdot 0{,}04 \approx 73{,}40$, $R_2 = 972{,}94 - 73{,}40 = 899{,}54$, $D_2 = 1835{,}06 - 899{,}54 = 935{,}52$.
3. Tretje leto: $o_3 = 935{,}52 \cdot 0{,}04 \approx 37{,}42$, $R_3 = 972{,}94 - 37{,}42 = 935{,}52$. To je ravno $D_2$, zato je $D_3 = 0$.
4. Preizkus: razdolžnine skupaj dajo posojilo, $864{,}94 + 899{,}54 + 935{,}52 = 2700$; obresti $108 + 73{,}40 + 37{,}42 = 218{,}82$ se ujemajo s primerom 1, kjer je $2918{,}82 - 2700 = 218{,}82$.

| leto $k$ | $o_k$ | $R_k$ | $D_k$ |
|---|---|---|---|
| 1 | 108,00 | 864,94 | 1835,06 |
| 2 | 73,40 | 899,54 | 935,52 |
| 3 | 37,42 | 935,52 | 0,00 |

5. Odgovor: načrt je v tabeli; dolg se po treh letih zapre natanko z $0$.

### Primer 3 (težji): koliko si društvo lahko izposodi

Astronomsko društvo lahko za odplačevanje nameni največ $1500$ € na leto, pet let zapored, vsakič ob koncu leta. Banka računa $6\,\%$ letnih obresti. Teleskop s kupolo stane $6500$ €. Kolikšno posojilo lahko društvo največ najame in koliko mora primakniti iz svojega?

**Podatki:** $a = 1500$ €, $n = 5$, $p = 6\,\%$, cena $C = 6500$ €
**Iščemo:** največje posojilo $G_0$ in lastni delež $C - G_0$

:::formula
Ekvivalenca glavnic na dan najema: $G_0 = a \cdot \dfrac{r^n - 1}{r^n (r - 1)}$
:::

**Rešitev:**

1. Obrestovalni faktor je $r = 1{,}06$; njegova peta potenca je $1{,}06^5 = 1{,}3382255776$.
2. Anuitete preračunamo na dan najema, ker tam stoji posojilo: $G_0 = 1500 \cdot \dfrac{0{,}3382255776}{1{,}3382255776 \cdot 0{,}06} \approx 6318{,}55$.
3. Lastni delež: $6500 - 6318{,}55 = 181{,}45$.
4. Smiselnost: anuitete skupaj dajo $5 \cdot 1500 = 7500$ €, kar je več od $6318{,}55$ €; razlika so obresti.
5. Odgovor: društvo lahko najame največ $6318{,}55$ € in mora iz svojega dodati $181{,}45$ €.

### Primer 4 – zdaj ti: preostanek naenkrat

Mladinski center je za prenosni planetarij najel posojilo $3200$ € za pet let pri $6\,\%$ letnih obresti; anuiteta je $759{,}67$ €. Po treh plačanih anuitetah želi preostali dolg vrniti naenkrat. Koliko mora plačati?

**Podatki:** $G_0 = 3200$ €, $p = 6\,\%$, $n = 5$, $a = 759{,}67$ €, plačane so $3$ anuitete
**Iščemo:** ostanek dolga $D_3$

:::formula
$D_k = G_0 r^k - a \cdot \dfrac{r^k - 1}{r - 1}$
:::

**Rešitev:**

1. Obrestovalni faktor je $r = 1{,}06$; tri leta obrestovanja dajo $1{,}06^3 = 1{,}191016$.
2. Posojilo, preračunano na konec 3. leta: $3200 \cdot 1{,}191016 = 3811{,}2512$.
3. Tri plačane anuitete ob istem trenutku: $759{,}67 \cdot \dfrac{0{,}191016}{0{,}06} \approx 2418{,}4854$.
4. Izračunaj $D_3$ sam. Nato ga preveri še drugače: preostali dve anuiteti preračunaj na konec 3. leta.

:::premisli
Koliko je $D_3$ in kaj da preizkus?
---
$D_3 = 3811{,}2512 - 2418{,}4854 \approx 1392{,}77$ €. Preizkus: $\dfrac{759{,}67}{1{,}06} + \dfrac{759{,}67}{1{,}06^2} \approx 716{,}67 + 676{,}10 = 1392{,}77$ €. Oba načina dasta isto, kot zahteva načelo ekvivalence glavnic.
:::

## Pogoste napake

- **Obresti vsa leta od celega posojila.** Kdor računa $4000 \cdot 0{,}05 \cdot 4 = 800$ €, misli na navadno obrestovanje in pozabi, da se dolg vsako leto zmanjša. Obresti računaj vsako leto od ostanka $D_{k-1}$.
- **Anuiteta kot četrtina posojila plus obresti.** $\frac{4000}{4} + 200 = 1200$ € je prvi obrok pri enakih *razdolžninah* (vsako leto vrneš enak del dolga, tu $1000$ €, in zraven obresti), kjer obroki iz leta v leto padajo. Pri anuitetah so obroki enaki, razdolžnine pa rastejo; anuiteto dobiš iz enačbe ekvivalence.
- **Seštevanje zneskov iz različnih let.** Treh obrokov po $1100$ € ni prav primerjati s $3000$ € takoj, ker so plačani pozneje. Najprej vse preračunaj na isti trenutek, šele nato seštevaj in primerjaj.
- **Prezgodnje zaokroževanje.** Z $1{,}05^4 \approx 1{,}22$ dobiš $a \approx 1109{,}09$ € namesto $1128{,}05$ €. Potence in vmesne rezultate obdrži nezaokrožene, na cente zaokroži šele zneske v načrtu.

## Povzetek

- Glavnica je znesek ob izbranem trenutku; naprej jo preračunamo z $\cdot r^k$, nazaj z $: r^k$, $r = 1 + \frac{p}{100}$.
- Načelo ekvivalence glavnic: plačila so enakovredna, če so njihove vrednosti na isti trenutek enake.
- Anuiteta $a$ je enak obrok ob koncu vsakega obdobja: $G_0 r^n = a \cdot \frac{r^n - 1}{r - 1}$, torej $a = G_0 \cdot \frac{r^n (r - 1)}{r^n - 1}$.
- Ostanek dolga po $k$ obdobjih: $D_k = G_0 r^k - a \cdot \frac{r^k - 1}{r - 1}$.
- Amortizacijski načrt: $o_k = D_{k-1} \cdot \frac{p}{100}$, $R_k = a - o_k$, $D_k = D_{k-1} - R_k$; zadnja vrstica se zapre z $D_n = 0$.
- Obresti padajo, razdolžnine rastejo s faktorjem $r$; vsota razdolžnin je posojilo.

## Drugače: Korak za korakom s številkami

Recept za vsako nalogo z anuitetami, na posojilu za teleskop ($4000$ €, $5\,\%$, $4$ leta):

1. Zapiši $r$ in $n$: $r = 1{,}05$, $n = 4$.
2. Izračunaj $r^n$ in ga ne zaokroži: $1{,}21550625$.
3. Izberi trenutek primerjave. Konec zadnjega leta: posojilo je vredno $4000 \cdot 1{,}21550625 = 4862{,}025$ €.
4. Vrednost obrokov ob istem trenutku: $a \cdot \frac{0{,}21550625}{0{,}05} = 4{,}310125\,a$.
5. Izenači in deli: $a = \frac{4862{,}025}{4{,}310125} \approx 1128{,}05$ €.
6. Načrt vrstico za vrstico: obresti od dolga, razdolžnina je anuiteta minus obresti, dolg zmanjšaj za razdolžnino.
7. Preizkus: vsota razdolžnin mora dati $4000$ €, zadnji ostanek $0$.

## Drugače: Kot zgodba

Maja je blagajničarka astronomskega krožka. Vsak december gre v banko. Uslužbenec najprej vzame dolg in ga »napihne« za $5\,\%$: to so obresti za iztekajoče se leto. Šele nato Maja položi $1128{,}05$ €.

Prvi december napihne $4000$ € za $200$ €. Od Majinega denarja jih $200$ gre za obresti, ostalih $928{,}05$ € pa res zmanjša dolg. Naslednje leto je dolg manjši, napihne se manj, in od istega Majinega zneska gre več za dolg. Tako se dolg tali vse hitreje, dokler po četrtem decembru ne izgine.

Ko jo predsednik krožka vpraša, zakaj ne morejo kar seštevati vseh plačil, Maja odgovori kot astronomka: »Svetlobo zvezd primerjamo šele, ko jih preračunamo na isto razdaljo. Denar primerjamo šele, ko ga preračunamo na isti dan.«

## Preveri se

? Kaj pove načelo ekvivalence glavnic?
- Plačila so enakovredna, če je vsota njihovih zneskov enaka.
~ Tako bi bilo le brez obresti. Znesek, plačan pozneje, je danes vreden manj, zato zneske najprej preračunamo na isti trenutek.
+ Plačila so enakovredna, če so njihove vrednosti, preračunane na isti trenutek, enake.
- Anuiteta je enaka posojilu, deljenemu s številom let.
~ To je le razdolžnina pri enakih razdolžninah. Anuiteta vsebuje še obresti in jo dobimo iz enačbe ekvivalence.
> Zneske iz različnih let primerjamo šele, ko jih z $r^k$ preračunamo na isti trenutek.

? Zakaj se pri enakih anuitetah razdolžnina iz leta v leto veča?
- Ker banka vsako leto zviša obrestno mero.
~ Obrestna mera je ves čas enaka ($p$ se ne spreminja). Spreminja se dolg, od katerega računamo obresti.
+ Ker se dolg zmanjšuje, so obresti vsako leto manjše, zato od enake anuitete več ostane za razdolžnino.
- Ker se anuiteta vsako leto poveča za obresti.
~ Anuiteta je v vseh letih enaka; to je njena definicija. Spreminja se samo razdelitev na obresti in razdolžnino.
> $R_k = a - o_k$: $a$ je stalna, $o_k$ pada skupaj z dolgom, zato $R_k$ raste (za faktor $r$).

? Posojilo $6000$ € odplačujemo s petimi enakimi letnimi anuitetami pri $6\,\%$ letnih obresti. Stolpci kažejo ostanek dolga ob koncu vsakega leta; leto 0 je dan najema. Odčitaj ostanek po 2. letu na $100$ € natančno in oceni obresti, ki jih plačamo v 3. letu.
:::risba stolpci
opis: Stolpčni prikaz »Ostanek dolga ob koncu leta«. Navpična os od 0 do 6000 evrov po 1000. Leto 0: 6000, leto 1: 4936, leto 2: 3807, leto 3: 2611, leto 4: 1344, leto 5: 0. Stolpci padajo vse hitreje.
podnapis: Ostanek dolga ob koncu leta
os: ostanek dolga (€)
korak: 1000
stolpec: 0 | 6000
stolpec: 1 | 4936
stolpec: 2 | 3807
stolpec: 3 | 2611
stolpec: 4 | 1344
stolpec: 5 | 0
:::
= 228 € | 8
~ 360 | To so obresti 1. leta, od celih $6000$ €. V 3. letu so obresti od dolga po 2. letu.
~ 296 | To so obresti 2. leta, od dolga po 1. letu. V 3. letu vzemi stolpec »2«.
> Po 2. letu ostane približno $3800$ € (natančno $3807{,}38$ €), obresti 3. leta so $3800 \cdot 0{,}06 = 228$ € (natančno $228{,}44$ €).

? (brez računala) Posojilo vrnemo z dvema letnima anuitetama po $1210$ €; prvo plačamo leto po najemu. Letna obrestna mera je $10\,\%$. Kolikšno je bilo posojilo v evrih?
= 2100 € | 1
~ 2420 | Obroka si samo seštel. Plačana sta pozneje, zato ju preračunaj nazaj na dan najema.
~ 2200 | Oba obroka si delil z $1{,}1$. Drugi je plačan dve leti po najemu, zato ga deli z $1{,}1^2 = 1{,}21$.
~ 2000 | Oba obroka si delil z $1{,}21$. Prvi je plačan po enem letu, zato ga deli le z $1{,}1$.
> $\frac{1210}{1{,}1} + \frac{1210}{1{,}21} = 1100 + 1000 = 2100$ €.

? V trgovini je teleskop mogoče plačati na dva načina: A) $3000$ € takoj ali B) tri obroke po $1100$ €, vsakega ob koncu leta. Prihranke bi lahko vezal pri $5\,\%$ letnih obresti. Kateri način je ugodnejši?
- A, ker je $3000$ € manj kot $3 \cdot 1100 = 3300$ €.
~ Seštel si zneske iz različnih let. Obroki se plačajo pozneje in medtem denar na banki nosi obresti; primerjaj vrednosti na isti dan.
+ B, ker so obroki na dan nakupa vredni približno $2995{,}57$ €, kar je manj od $3000$ €.
- Oba sta enaka, ker $300$ € razlike ravno pokrije obresti.
~ To je ugibanje. Obroki na dan nakupa so vredni $2995{,}57$ €, kar ni natanko $3000$ €.
> $\frac{1100}{1{,}05} + \frac{1100}{1{,}05^2} + \frac{1100}{1{,}05^3} \approx 2995{,}57$ € $< 3000$ €; razlika je majhna, a B je ugodnejši.

<<RACUN
vrednost: 4000*1.05^4-1100*(1.05^4-1)/0.05 | 120.89
vrednost: 4000*1.05^4-1150*(1.05^4-1)/0.05 | -94.62
vrednost: 4000*1.05^4*0.05/(1.05^4-1) | 1128.05
vrednost: 4*1128.05-4000 | 512.2
vrednost: 928.05+974.45+1023.17+1074.33 | 4000
vrednost: 2700*1.04^3*0.04/(1.04^3-1) | 972.94
vrednost: 1835.06*0.04 | 73.40
vrednost: 935.52*0.04 | 37.42
vrednost: 864.94+899.54+935.52 | 2700
vrednost: 1500*(1.06^5-1)/(1.06^5*0.06) | 6318.55
vrednost: 6500-6318.55 | 181.45
vrednost: 3200*1.06^3-759.67*(1.06^3-1)/0.06 | 1392.77
vrednost: 759.67/1.06+759.67/1.06^2 | 1392.77
vrednost: 3807.38*0.06 | 228.44
vrednost: 1210/1.1+1210/1.21 | 2100
vrednost: 1100/1.05+1100/1.05^2+1100/1.05^3 | 2995.57
vrednost: 4000*1.22*0.05/0.22 | 1109.09
>>

:::simboli
G_0 | posojilo (glavnica na dan najema) | | €
r | obrestovalni faktor | r = 1 + \frac{p}{100} | –
p | letna obrestna mera | | \% | v odstotkih
n | število obdobij (let) | | –
a | anuiteta | a = G_0 \cdot \frac{r^n (r - 1)}{r^n - 1} | € | enak obrok ob koncu obdobja
D_k, D_n | ostanek dolga po $k$ oziroma $n$ obdobjih | D_k = G_0 r^k - a \cdot \frac{r^k - 1}{r - 1} | €
D_1, D_2, D_3 | ostanek dolga po 1., 2. in 3. letu | | €
D_{k-1} | ostanek dolga na začetku $k$-tega leta | | €
o_k | obresti v $k$-tem letu | o_k = D_{k-1} \cdot \frac{p}{100} | €
R_k | razdolžnina v $k$-tem letu | R_k = a - o_k | € | del anuitete, ki zmanjša dolg
k | zaporedna številka leta | | –
C | cena teleskopa | | €
:::
