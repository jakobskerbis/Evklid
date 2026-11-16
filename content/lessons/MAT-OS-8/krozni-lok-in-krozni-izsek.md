---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na telefonu imaš aplikacijo, ki pokaže, kje je Mednarodna vesoljska postaja (ISS). Postaja kroži okoli Zemlje približno $400\,\text{km}$ nad površjem in en obhod naredi v $90$ minutah. Zvečer jo v aplikaciji $15$ minut spremljaš, kako drsi nad Zemljo. Koliko kilometrov je v tem času preletela?

Cel krog bi znal izračunati: to je obseg. Postaja pa je v četrt ure preletela le **del** kroga. Tak del krožnice se imenuje **krožni lok**. Ko boš znal izračunati lok, boš vprašanje rešil v Primeru 3. Po isti poti izračunaš tudi ploščino dela kroga: kos torte, pahljačo ali ploskev, ki jo prebriše kazalec na uri.

## Razlaga

**Najprej nekaj primerov.** Vzemimo krog s polmerom $r = 6\,\text{cm}$. Njegov obseg je $o = 2\pi \cdot 6\,\text{cm} = 12\pi\,\text{cm}$, ploščina pa $p = \pi \cdot 6^2\,\text{cm}^2 = 36\pi\,\text{cm}^2$. Krog razrežemo kot torto, z ravnimi rezi iz središča. Vsak kos ima ukrivljen rob in ploskev.

| kot kosa | del kroga | dolžina roba | ploščina kosa |
|---|---|---|---|
| $180^\circ$ | $\frac{1}{2}$ | $6\pi\,\text{cm}$ | $18\pi\,\text{cm}^2$ |
| $90^\circ$ | $\frac{1}{4}$ | $3\pi\,\text{cm}$ | $9\pi\,\text{cm}^2$ |
| $60^\circ$ | $\frac{1}{6}$ | $2\pi\,\text{cm}$ | $6\pi\,\text{cm}^2$ |
| $30^\circ$ | $\frac{1}{12}$ | $\pi\,\text{cm}$ | $3\pi\,\text{cm}^2$ |

Opazuj drugi stolpec. Kot $90^\circ$ je četrtina polnega kota $360^\circ$, in kos je četrtina torte. Njegov rob je četrtina obsega, njegova ploščina četrtina ploščine kroga. Enako velja v vsaki vrstici: kolikšen del polnega kota zajame kos, tolikšen del obsega in ploščine dobi.

:::premisli
Kako dolg bi bil rob in kolikšna ploščina kosa s kotom $120^\circ$ iz iste torte? Napovej iz tabele.
---
Kot $120^\circ$ je tretjina od $360^\circ$. Rob je tretjina obsega, $\dfrac{12\pi}{3} = 4\pi\,\text{cm}$, ploščina pa $\dfrac{36\pi}{3} = 12\pi\,\text{cm}^2$. To je natanko dvakrat toliko kot pri $60^\circ$, ker je kot dvakrat večji.
:::

**Imena.** Točki $A$ in $B$ na krožnici jo razdelita na dva **krožna loka**. Kot $\alpha$ med polmeroma $SA$ in $SB$, ki ima vrh v središču $S$, je **središčni kot** loka. Del kroga, ki ga omejujeta polmera in lok med njima, je **krožni izsek**. Pri torti je rob kosa lok, kos sam pa izsek.

**Pravilo.** Kar smo opazili v tabeli, zapišemo s simboli. Delež kroga je $\dfrac{\alpha}{360^\circ}$. Dolžina loka $l$ je ta delež obsega:

$$l = \frac{\alpha}{360^\circ} \cdot 2\pi r$$

Ploščina izseka $p_i$ je ta delež ploščine kroga:

$$p_i = \frac{\alpha}{360^\circ} \cdot \pi r^2$$

Lok merimo v dolžinskih enotah ($\text{cm}$, $\text{km}$), izsek v kvadratnih ($\text{cm}^2$, $\text{m}^2$).

**Postopek.** Zapiši delež in ga okrajšaj. Izračunaj obseg ali ploščino celega kroga. Pomnoži. Če iščeš kot, zapiši enačbo in jo reši kot vsako linearno enačbo.

**Polmer in kot.** V simulaciji spodaj (Krožni lok in izsek) nastavi središčni kot na $90^\circ$ in polmer na $5\,\text{cm}$. Nato polmer povečaj na $10\,\text{cm}$. Opazuj, kolikokrat se podaljša lok in kolikokrat zraste ploščina izseka.

:::premisli
Kot ostane enak, polmer podvojimo. Zakaj se lok podaljša le dvakrat, ploščina izseka pa zraste štirikrat?
---
Lok je del obsega $2\pi r$, kjer je $r$ en sam faktor: dvakrat večji $r$ da dvakrat daljši lok. Ploščina je del $\pi r^2 = \pi \cdot r \cdot r$, kjer se podvojita oba faktorja: $2 \cdot 2 = 4$. Pri $90^\circ$ in $r = 5\,\text{cm}$ je izsek $\dfrac{25\pi}{4}\,\text{cm}^2 \approx 19{,}6\,\text{cm}^2$, pri $r = 10\,\text{cm}$ pa $25\pi\,\text{cm}^2 \approx 78{,}5\,\text{cm}^2$.
:::

## Rešeni primeri

### Primer 1 (lažji): lok na plakatu

Na plakatu astronomskega krožka je tirnica planeta narisana kot krog s polmerom $6\,\text{cm}$. Planet je na sliki prepotoval središčni kot $60^\circ$. Kako dolg je narisani lok? Rezultat zapiši s $\pi$ in ga nato zaokroži na eno decimalko.

**Podatki:** $r = 6\,\text{cm}$, $\alpha = 60^\circ$, $\pi \approx 3{,}14$
**Iščemo:** dolžino loka $l$

:::formula
$l = \dfrac{\alpha}{360^\circ} \cdot 2\pi r$
:::

**Rešitev:**

1. Delež kroga: $\dfrac{60^\circ}{360^\circ} = \dfrac{1}{6}$, ker gre $60^\circ$ v polni kot šestkrat.
2. Obseg celega kroga: $o = 2\pi \cdot 6\,\text{cm} = 12\pi\,\text{cm}$.
3. Dolžina loka: $l = \dfrac{1}{6} \cdot 12\pi\,\text{cm} = 2\pi\,\text{cm}$.
4. Približek: $2 \cdot 3{,}14 = 6{,}28$, torej $l \approx 6{,}3\,\text{cm}$.
5. Smiselnost: lok je krajši od celega obsega, $12\pi\,\text{cm} \approx 37{,}7\,\text{cm}$, kot mora biti.
6. Odgovor: narisani lok je dolg $2\pi\,\text{cm}$, približno $6{,}3\,\text{cm}$.

### Primer 2: sončni panel kot pahljača

Pristajalni modul na Marsu razpre sončni panel kot pahljačo. Razprt panel je krožni izsek s polmerom $1{,}2\,\text{m}$ in središčnim kotom $150^\circ$. Kolikšna je njegova ploščina?

**Podatki:** $r = 1{,}2\,\text{m}$, $\alpha = 150^\circ$, $\pi \approx 3{,}14$
**Iščemo:** ploščino izseka $p_i$

:::formula
$p_i = \dfrac{\alpha}{360^\circ} \cdot \pi r^2$
:::

**Rešitev:**

1. Delež: $\dfrac{150}{360} = \dfrac{5}{12}$, ker števec in imenovalec delimo s $30$.
2. Ploščina celega kroga: $p = \pi \cdot (1{,}2\,\text{m})^2 = 1{,}44\pi\,\text{m}^2$. Kvadriramo le polmer, ne $\pi$.
3. Ploščina izseka: $p_i = \dfrac{5}{12} \cdot 1{,}44\pi\,\text{m}^2 = 0{,}6\pi\,\text{m}^2$, ker je $1{,}44 : 12 = 0{,}12$ in $5 \cdot 0{,}12 = 0{,}6$.
4. Približek: $0{,}6 \cdot 3{,}14 = 1{,}884$, torej $p_i \approx 1{,}88\,\text{m}^2$.
5. Odgovor: razprt panel ima ploščino približno $1{,}88\,\text{m}^2$.

### Primer 3 (težji): pot vesoljske postaje

Vrnimo se k vprašanju z začetka. Postaja ISS kroži $400\,\text{km}$ nad površjem Zemlje, polmer Zemlje je približno $6400\,\text{km}$. En obhod traja $90$ minut. Kolikšno pot naredi postaja v $15$ minutah?

**Podatki:** višina $h = 400\,\text{km}$, polmer Zemlje $R = 6400\,\text{km}$, čas obhoda $90\,\text{min}$, čas opazovanja $15\,\text{min}$, $\pi \approx 3{,}14$
**Iščemo:** dolžino loka $l$, ki ga postaja preleti

:::formula
$r = R + h$

$\alpha = \dfrac{15\,\text{min}}{90\,\text{min}} \cdot 360^\circ$

$l = \dfrac{\alpha}{360^\circ} \cdot 2\pi r$
:::

**Rešitev:**

1. Polmer tirnice merimo od središča Zemlje, ne od površja: $r = 6400\,\text{km} + 400\,\text{km} = 6800\,\text{km}$.
2. V $15$ minutah postaja naredi $\dfrac{15}{90} = \dfrac{1}{6}$ obhoda, zato je središčni kot $\dfrac{1}{6} \cdot 360^\circ = 60^\circ$.
3. Obseg tirnice: $o = 2 \cdot 3{,}14 \cdot 6800\,\text{km} = 42\,704\,\text{km}$.
4. Lok je šestina obsega: $l = 42\,704\,\text{km} : 6 \approx 7117\,\text{km}$.
5. Odgovor: v $15$ minutah postaja preleti približno $7100\,\text{km}$. To je skoraj $8\,\text{km}$ v vsaki sekundi.

### Primer 4 – zdaj ti: kot iz dolžine loka

Lok dolžine $15{,}7\,\text{cm}$ pripada krogu s polmerom $10\,\text{cm}$. Izračunaj središčni kot in ploščino izseka.

**Podatki:** $l = 15{,}7\,\text{cm}$, $r = 10\,\text{cm}$, $\pi \approx 3{,}14$
**Iščemo:** središčni kot $\alpha$ in ploščino izseka $p_i$

:::formula
$l = \dfrac{\alpha}{360^\circ} \cdot 2\pi r$

$p_i = \dfrac{\alpha}{360^\circ} \cdot \pi r^2$
:::

**Rešitev:**

1. Obseg kroga: $o = 2 \cdot 3{,}14 \cdot 10\,\text{cm} = 62{,}8\,\text{cm}$.
2. Delež: lok je del obsega, $\dfrac{15{,}7}{62{,}8} = \dfrac{1}{4}$, saj je $4 \cdot 15{,}7 = 62{,}8$.
3. Zdaj ti: iz deleža izračunaj kot $\alpha$, nato še ploščino izseka.

:::premisli
Kolikšna sta $\alpha$ in $p_i$?
---
$\alpha = \dfrac{1}{4} \cdot 360^\circ = 90^\circ$. Ploščina kroga je $3{,}14 \cdot 10^2\,\text{cm}^2 = 314\,\text{cm}^2$, izsek je njena četrtina: $p_i = 314\,\text{cm}^2 : 4 = 78{,}5\,\text{cm}^2$.
:::

## Pogoste napake

- **Brez deljenja s $360^\circ$.** Učenec računa $l = 60 \cdot 2\pi r$, ker misli, da kot pove, »kolikokrat« vzamemo obseg. Tako dobi lok, daljši od cele krožnice, kar ni mogoče. Kot pove le, kolikšen del polnega kota zajame izsek: najprej vedno delež $\dfrac{\alpha}{360^\circ}$.
- **Zamenjana obseg in ploščina.** Za lok vzame $\pi r^2$, za izsek $2\pi r$. Lok je črta, izsek ploskev, zato lok pripada obsegu, izsek ploščini. Preveri enoto: lok v $\text{cm}$, izsek v $\text{cm}^2$.
- **Premer namesto polmera.** Če naloga da premer $d$ in ga učenec vstavi kot $r$, dobi dvakrat daljši lok in štirikrat večji izsek. Najprej izračunaj $r = d : 2$.
- **»Dvakrat večji polmer, dvakrat večji izsek.«** V ploščini je polmer kvadriran, zato pri istem kotu dvakrat večji polmer da štirikrat večji izsek. Le lok se podaljša dvakrat.
- **Polni kot $180^\circ$.** Kdor deli s $180^\circ$, dobi dvakrat predolg lok, pri iskanju kota pa polovico pravilnega kota. $180^\circ$ je iztegnjeni kot, pol kroga; polni kot meri $360^\circ$.

## Povzetek

- Krožni lok je del krožnice; krožni izsek je del kroga med dvema polmeroma in lokom.
- Središčni kot $\alpha$ ima vrh v središču kroga; delež kroga je $\dfrac{\alpha}{360^\circ}$.
- Dolžina loka: $l = \dfrac{\alpha}{360^\circ} \cdot 2\pi r$, v dolžinskih enotah.
- Ploščina izseka: $p_i = \dfrac{\alpha}{360^\circ} \cdot \pi r^2$, v kvadratnih enotah.
- Pri istem kotu da dvakrat večji polmer dvakrat daljši lok in štirikrat večji izsek.
- Če poznaš lok ali izsek, dobiš kot iz deleža ali z enačbo.

## Drugače: Korak za korakom s številkami

Naloga: $r = 12\,\text{cm}$, $\alpha = 150^\circ$. Izračunaj dolžino loka in ploščino izseka.

| Korak | Kaj naredimo | Rezultat |
|---|---|---|
| 1 | Zapišemo delež | $\frac{150}{360}$ |
| 2 | Okrajšamo (delimo s $30$) | $\frac{5}{12}$ |
| 3 | Obseg kroga | $2\pi \cdot 12 = 24\pi$ |
| 4 | Dolžina loka | $\frac{5}{12} \cdot 24\pi = 10\pi\,\text{cm}$ |
| 5 | Ploščina kroga | $\pi \cdot 12^2 = 144\pi$ |
| 6 | Ploščina izseka | $\frac{5}{12} \cdot 144\pi = 60\pi\,\text{cm}^2$ |
| 7 | Približek ($\pi \approx 3{,}14$) | $l \approx 31{,}4\,\text{cm}$, $p_i \approx 188{,}4\,\text{cm}^2$ |

Nasvet: delež okrajšaj, preden množiš. Račun je krajši in manj je možnosti za napako. Pri koraku 4 na primer najprej deliš $24 : 12 = 2$ in šele nato množiš $2 \cdot 5 = 10$.

## Drugače: Kot zgodba

Nika vsak večer ob isti uri poišče Luno. Luna kroži okoli Zemlje po skoraj krožni tirnici s polmerom približno $384\,000\,\text{km}$ in en obhod naredi v približno $27$ dneh. Nika si tirnico predstavlja kot ogromno uro z enim samim kazalcem, ki sega od Zemlje do Lune.

Prvi večer si zapomni, kam kaže kazalec. Po $9$ dneh se je zavrtel za $\dfrac{9}{27} = \dfrac{1}{3}$ kroga, torej za $120^\circ$. »Luna je opravila tretjino poti okoli Zemlje,« pomisli Nika. »Njen lok je torej tretjina obsega tirnice.«

Izračuna: $\dfrac{1}{3} \cdot 2 \cdot 3{,}14 \cdot 384\,000\,\text{km} = 803\,840\,\text{km}$, okroglo $800\,000\,\text{km}$.

Potem opazi še nekaj. Kazalec je med potjo prebrisal kos ravnine med Zemljo in Luno, podoben kosu torte. Tudi ta izsek je tretjina celega kroga, ker ima isti središčni kot. Isti delež velja za lok in za izsek. To je vsa skrivnost obeh formul.

## Drugače: Bolj natančno

Zakaj je delež $\dfrac{\alpha}{360^\circ}$ pravi? Dolžina loka je **premo sorazmerna** s središčnim kotom: če kot podvojimo, se podvoji tudi lok, če ga potrojimo, se potroji. Za polni kot $360^\circ$ je lok cela krožnica z dolžino $2\pi r$. Zato velja sorazmerje

$$l : 2\pi r = \alpha : 360^\circ$$

in od tod $l = \dfrac{\alpha}{360^\circ} \cdot 2\pi r$.

Enako velja za ploščino izseka, ki je prav tako premo sorazmerna s kotom; polni kot da cel krog:

$$p_i : \pi r^2 = \alpha : 360^\circ$$

Od tod $p_i = \dfrac{\alpha}{360^\circ} \cdot \pi r^2$.

Obe formuli povezuje zveza $p_i = \dfrac{l \cdot r}{2}$:

$$p_i = \frac{\alpha}{360^\circ} \cdot \pi r^2 = \left(\frac{\alpha}{360^\circ} \cdot 2\pi r\right) \cdot \frac{r}{2} = l \cdot \frac{r}{2}$$

Spominja na ploščino trikotnika »osnovnica krat višina, deljeno z $2$«: lok je osnovnica, polmer višina. Zveza je uporabna, kadar poznaš $l$ in $r$, kota pa ne.

## Preveri se

? Katera vrstica velja za izsek s kotom $90^\circ$ v krogu s polmerom $6\,\text{cm}$?
- lok $9\pi\,\text{cm}$, izsek $3\pi\,\text{cm}^2$
~ Števili sta zamenjani: $9\pi$ je četrtina ploščine $36\pi$, $3\pi$ pa četrtina obsega $12\pi$. Lok pripada obsegu.
+ lok $3\pi\,\text{cm}$, izsek $9\pi\,\text{cm}^2$
- lok $12\pi\,\text{cm}$, izsek $36\pi\,\text{cm}^2$
~ To sta obseg in ploščina celega kroga. Manjka množenje z deležem $\dfrac{90}{360} = \dfrac{1}{4}$.
- lok $6\pi\,\text{cm}$, izsek $18\pi\,\text{cm}^2$
~ To je polovica kroga. Kot $90^\circ$ je četrtina polnega kota, ne polovica.
> Delež je $\dfrac{1}{4}$. Lok: $\dfrac{1}{4} \cdot 12\pi = 3\pi\,\text{cm}$, izsek: $\dfrac{1}{4} \cdot 36\pi = 9\pi\,\text{cm}^2$.

? Krog ima ploščino $200\,\text{cm}^2$. Oceni ploščino izseka s kotom $89^\circ$.
+ približno $50\,\text{cm}^2$
- približno $89\,\text{cm}^2$
~ Število stopinj ni število kvadratnih centimetrov. Kot pove le, kolikšen del kroga je izsek.
- približno $100\,\text{cm}^2$
~ Polovico kroga zajame kot $180^\circ$. Kot $89^\circ$ je skoraj pravi kot, torej skoraj četrtina.
- približno $25\,\text{cm}^2$
~ To bi bila osmina kroga, kot $45^\circ$. Kot $89^\circ$ je skoraj dvakrat večji.
> $89^\circ$ je skoraj $90^\circ$, torej skoraj četrtina polnega kota. Četrtina od $200\,\text{cm}^2$ je $50\,\text{cm}^2$; izsek je malo manjši, približno $49{,}4\,\text{cm}^2$.

? Kot izseka ostane enak, polmer pa podvojimo. Zakaj se ploščina izseka poveča štirikrat?
- Ker se podvojita kot in polmer.
~ Kot ostane enak, spremeni se le polmer. Delež kroga je zato enak kot prej.
+ Ker je v ploščini $r^2 = r \cdot r$: podvojita se oba faktorja, $2 \cdot 2 = 4$.
- Ker se podvoji lok, ploščina pa je vedno dvakratnik loka.
~ Lok in ploščina imata različni enoti, zato ploščina ni »dvakratnik loka«. Štirikratnik pride iz kvadrata polmera.
- Ne poveča se štirikrat, ampak dvakrat, tako kot lok.
~ Dvakrat se podaljša le lok, ker je $r$ v $2\pi r$ en sam faktor. V $\pi r^2$ sta faktorja dva.
> $p_i = \dfrac{\alpha}{360^\circ} \cdot \pi r^2$. Delež ostane enak, namesto $r \cdot r$ pa dobimo $2r \cdot 2r = 4 \cdot r \cdot r$.

? Lok kroga s polmerom $9\,\text{cm}$ je dolg $6\pi\,\text{cm}$. Kolikšen je središčni kot?
+ $120^\circ$
- $60^\circ$
~ Tako dobiš, če za polni kot vzameš $180^\circ$. Polni kot meri $360^\circ$.
- $240^\circ$
~ Tako dobiš z obsegom $9\pi\,\text{cm}$, kot da bi bil $9\,\text{cm}$ premer. To je polmer, obseg je $18\pi\,\text{cm}$.
- $40^\circ$
~ To je $360^\circ : 9$. Polmer ne pove, na koliko delov je krog razrezan; delež dobiš iz loka in obsega.
> Obseg je $2\pi \cdot 9 = 18\pi\,\text{cm}$. Delež: $\dfrac{6\pi}{18\pi} = \dfrac{1}{3}$, zato je $\alpha = \dfrac{1}{3} \cdot 360^\circ = 120^\circ$.

? Minutni kazalec stenske ure je dolg $12\,\text{cm}$. Kolikšno pot naredi njegova konica v $20$ minutah? ($\pi \approx 3{,}14$)
- približno $4{,}2\,\text{cm}$
~ $20$ minut ni $20^\circ$. V $60$ minutah kazalec opravi $360^\circ$, v $20$ minutah tretjino, $120^\circ$.
+ približno $25{,}1\,\text{cm}$
- približno $75{,}4\,\text{cm}$
~ To je cel obseg $24\pi\,\text{cm}$. Konica v $20$ minutah opravi le tretjino kroga.
- približno $150{,}7\,\text{cm}$
~ To je $\dfrac{1}{3} \cdot \pi \cdot 12^2 = 48\pi$, ploščina izseka v $\text{cm}^2$. Pot konice je lok.
> $20$ minut je tretjina ure, kot je $120^\circ$. $l = \dfrac{1}{3} \cdot 2\pi \cdot 12\,\text{cm} = 8\pi\,\text{cm} \approx 25{,}1\,\text{cm}$.

:::simboli
l | dolžina krožnega loka | l = \frac{\alpha}{360^\circ} \cdot 2\pi r |
\alpha | središčni kot | | ° | vrh ima v središču kroga
r | polmer kroga | | | pri postaji ISS r = R + h
p_i | ploščina krožnega izseka | p_i = \frac{\alpha}{360^\circ} \cdot \pi r^2 |
R | polmer Zemlje | | km | približno 6400 km
h | višina postaje nad površjem Zemlje | | km
:::
