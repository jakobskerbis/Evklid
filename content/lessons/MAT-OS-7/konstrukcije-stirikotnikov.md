---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi štiri enako dolge slamice in jih na koncih poveži z vrvico, da dobiš okvir. Okvir lahko oblikuješ v kvadrat, ko pa ga rahlo pritisneš ob strani, se zamaje v sploščen romb. Stranice so ostale enake, oblika pa ne. Trikotnik iz treh slamic se ne zamaje: je **tog**.

Zato pri štirikotnikih ne zadošča, da poznaš stranice. Ko znaš izbrati prave podatke in štirikotnik razdeliti na trikotnike, ga lahko natančno načrtaš. To potrebujejo mizarji pri izdelavi polic in okvirjev, krovci pri strehah in vrtnarji pri gredicah. Pri tem uporabiš vse, kar že znaš o konstrukcijah trikotnikov in o vrstah štirikotnikov.

## Razlaga

**1. Oznake.** Oglišča štirikotnika označimo v nasprotni smeri urnega kazalca: $A$, $B$, $C$, $D$. Stranice so $a = |AB|$, $b = |BC|$, $c = |CD|$, $d = |DA|$. Notranji koti $\alpha$, $\beta$, $\gamma$, $\delta$ so pri ogliščih $A$, $B$, $C$, $D$. Diagonala $e$ povezuje $A$ in $C$, diagonala $f$ pa $B$ in $D$.

**2. Štirikotnik razdelimo na trikotnike.** Vsaka diagonala razdeli štirikotnik na dva trikotnika. Diagonala $e$ ga na primer razdeli na trikotnika $ABC$ in $ACD$. Ker trikotnike že znaš načrtati po izrekih sss, sks, ksk in ssk, je pot vedno podobna: **najprej načrtaš en trikotnik, nato dopolniš četrto oglišče.** Trikotniku, ki ga načrtamo kot vmesni korak, rečemo **pomožni trikotnik**.

**3. Koliko podatkov potrebujemo.** Štirikotnik je **določen**, kadar so vsi štirikotniki, ki jih načrtaš iz danih podatkov, skladni. Za splošni štirikotnik potrebuješ $5$ podatkov: $3$ za prvi trikotnik in še $2$ za četrto oglišče. Posebni štirikotniki imajo lastnosti, ki nekaj podatkov »podarijo«:

| Lik | Lastnost, ki pomaga | Podatkov | Primer |
|---|---|---|---|
| kvadrat | vse stranice enake, koti $90^\circ$ | $1$ | $a$ |
| pravokotnik | koti $90^\circ$, $c = a$, $d = b$ | $2$ | $a$, $b$ |
| romb | vse stranice enake | $2$ | $a$, $\alpha$ |
| paralelogram | $c = a$, $d = b$ | $3$ | $a$, $b$, $\alpha$ |
| deltoid | $\lvert AD \rvert = \lvert AB \rvert$, $\lvert CD \rvert = \lvert CB \rvert$ | $3$ | $a$, $b$, $e$ |
| trapez | $AB \parallel CD$ | $4$ | $a$, $c$, $d$, $\alpha$ |

:::premisli
Zakaj za romb zadostujeta dva podatka, za paralelogram pa potrebuješ tri?
---
V paralelogramu sta lahko sosednji stranici različni, zato moraš poznati $a$ in $b$ ter še en podatek o obliki (kot ali diagonalo). V rombu je $b = a$, zato je ena dolžina že znana in ostane le še podatek o obliki.
:::

**4. Postopek načrtovanja.** Načrtovalno nalogo rešuješ v istih korakih kot pri trikotnikih:

1. **Skica.** Prostoročno nariši lik, označi oglišča in poudari dane podatke.
2. **Analiza.** Poišči pomožni trikotnik, ki ga lahko načrtaš iz danih podatkov. Ugotovi, po katerem izreku.
3. **Preverjanje obstoja.** Za pomožni trikotnik preveri trikotniško neenakost (krajši stranici skupaj sta daljši od najdaljše) ali vsoto kotov.
4. **Konstrukcija.** Načrtaj pomožni trikotnik, nato četrto oglišče s pomočjo lastnosti lika: vzporednic, enakih stranic, pravih kotov ali simetrije.
5. **Diskusija.** Koliko rešitev ima naloga?

Četrto oglišče pogosto dobiš kot **presečišče dveh krožnih lokov**: ko veš, kako daleč je točka od dveh že narisanih oglišč, okoli vsakega zarišeš lok s tem polmerom.

:::premisli
Paralelogram naj ima $a = 5\,\text{cm}$, $b = 3\,\text{cm}$ in diagonalo $e = 9\,\text{cm}$. Napovej, kaj se zgodi, ko poskusiš načrtati pomožni trikotnik $ABC$.
---
Ne uspe. Loka okoli $A$ s polmerom $9\,\text{cm}$ in okoli $B$ s polmerom $3\,\text{cm}$ se ne sekata, ker $5 + 3 = 8 < 9$. Trikotnik $ABC$ ne obstaja, zato tak paralelogram ne obstaja.
:::

**5. Simulacija.** V simulaciji spodaj (»Konstrukcije štirikotnikov«) nastavi paralelogram z $a = 5\,\text{cm}$, $b = 3\,\text{cm}$ in $\alpha = 60^\circ$ (kot v Primeru 1) ter si oglej konstrukcijo po korakih, nato še konstrukcijo trapeza. Pri vsakem koraku se vprašaj, katera lastnost lika ga upraviči. Opazi, da v obeh konstrukcijah najprej nastane trikotnik in šele nato četrto oglišče.

## Rešeni primeri

### Primer 1 (lažji)

Načrtaj paralelogram $ABCD$ s stranicama $a = 5\,\text{cm}$, $b = 3\,\text{cm}$ in kotom $\alpha = 60^\circ$.

**Podatki:** paralelogram $ABCD$, $a = 5\,\text{cm}$, $b = 3\,\text{cm}$, $\alpha = 60^\circ$
**Iščemo:** konstrukcijo paralelograma $ABCD$

:::formula
V paralelogramu sta nasprotni stranici enaki: $|CD| = a$, $|DA| = b$. Pomožni trikotnik $ABD$ je določen po izreku sks.
:::

**Rešitev:**

1. Analiza: ker je $|DA| = b = 3\,\text{cm}$, poznamo dve stranici trikotnika $ABD$ in kot $\alpha$ med njima, zato ga načrtamo po izreku sks.
2. Načrtamo daljico $AB$ dolžine $5\,\text{cm}$, ker z dano stranico začnemo.
3. V oglišču $A$ načrtamo kot $60^\circ$ (s kotomerom ali s šestilom, kot pri enakostraničnem trikotniku), ker je to kot $\alpha$.
4. Na novi krak od $A$ nanesemo $3\,\text{cm}$ in dobimo oglišče $D$, ker je $|AD| = b$.
5. Okoli $D$ zarišemo lok s polmerom $5\,\text{cm}$, okoli $B$ pa lok s polmerom $3\,\text{cm}$. Presečišče na isti strani premice $AB$ kot $D$ je oglišče $C$, ker mora veljati $|CD| = a$ in $|BC| = b$.
6. Preverimo: kot $\beta$ mora meriti $180^\circ - 60^\circ = 120^\circ$, ker je vsota sosednjih kotov paralelograma $180^\circ$.
7. Odgovor: paralelogram $ABCD$ je določen in ima eno rešitev; oglišče $C$ smo dobili kot presečišče dveh lokov.

### Primer 2 (srednji)

Načrtaj romb $ABCD$ z diagonalama $e = 6\,\text{cm}$ in $f = 4\,\text{cm}$.

**Podatki:** romb $ABCD$, $e = |AC| = 6\,\text{cm}$, $f = |BD| = 4\,\text{cm}$
**Iščemo:** konstrukcijo romba $ABCD$

:::formula
Diagonali romba sta pravokotni in se razpolavljata v točki $S$:
$|AS| = |SC| = \dfrac{e}{2}$, $|BS| = |SD| = \dfrac{f}{2}$
:::

**Rešitev:**

1. Načrtamo diagonalo $AC$ dolžine $6\,\text{cm}$, ker z njo dobimo dve oglišči hkrati.
2. Načrtamo simetralo daljice $AC$. Ta poteka skozi razpolovišče $S$ in je pravokotna na $AC$, kar sta natanko lastnosti druge diagonale.
3. Izračunamo $\dfrac{f}{2} = \dfrac{4\,\text{cm}}{2} = 2\,\text{cm}$, ker $S$ razpolavlja tudi diagonalo $f$.
4. Na simetralo od $S$ nanesemo $2\,\text{cm}$ na vsako stran in dobimo $B$ in $D$.
5. Povežemo $A$, $B$, $C$, $D$. Preverimo z merjenjem: vse štiri stranice so enako dolge, približno $3{,}6\,\text{cm}$.
6. Odgovor: romb smo načrtali iz diagonal, ne da bi poznali stranico; naloga ima eno rešitev.

### Primer 3 (težji)

Mizar izdeluje stransko steno police v obliki trapeza. Spodnji rob (osnovnica $a$) meri $70\,\text{cm}$, zgornji rob (osnovnica $c$) $30\,\text{cm}$, kraka pa merita $b = 40\,\text{cm}$ in $d = 50\,\text{cm}$. Načrtaj steno tako, da $1\,\text{cm}$ na papirju pomeni $10\,\text{cm}$ v resnici.

**Podatki:** trapez $ABCD$, $AB \parallel CD$, $a = 70\,\text{cm}$, $c = 30\,\text{cm}$, $b = 40\,\text{cm}$, $d = 50\,\text{cm}$; $1\,\text{cm}$ na papirju je $10\,\text{cm}$ v resnici
**Iščemo:** konstrukcijo trapeza na papirju

:::formula
Skozi oglišče $D$ potegnemo vzporednico s krakom $BC$; ta seka $AB$ v točki $E$. Pomožni trikotnik $AED$ ima stranice $|AE| = a - c$, $|ED| = b$, $|AD| = d$.
:::

**Rešitev:**

1. Pretvorimo na papir (delimo z $10$): $a = 7\,\text{cm}$, $c = 3\,\text{cm}$, $b = 4\,\text{cm}$, $d = 5\,\text{cm}$.
2. Analiza: štirikotnik $EBCD$ je paralelogram, ker sta $EB \parallel DC$ in $ED \parallel BC$. Zato je $|EB| = c$ in $|ED| = b$.
3. Stranice pomožnega trikotnika: $|AE| = a - c = 7\,\text{cm} - 3\,\text{cm} = 4\,\text{cm}$, $|ED| = 4\,\text{cm}$, $|AD| = 5\,\text{cm}$.
4. Preverimo obstoj: $4 + 4 = 8 > 5$, zato trikotnik $AED$ obstaja.
5. Načrtamo $AB = 7\,\text{cm}$ in na njej točko $E$ tako, da je $|AE| = 4\,\text{cm}$. Okoli $A$ zarišemo lok s polmerom $5\,\text{cm}$, okoli $E$ lok s polmerom $4\,\text{cm}$. Presečišče je $D$.
6. Skozi $D$ načrtamo vzporednico z $AB$, ker morata biti osnovnici vzporedni. Na njej od $D$ proti strani, kjer je $B$, nanesemo $3\,\text{cm}$ in dobimo $C$.
7. Preverimo z merjenjem: $|BC|$ mora biti $4\,\text{cm}$.
8. Odgovor: steno načrtamo kot trapez s stranicami $7$, $4$, $3$ in $5\,\text{cm}$; ključ je pomožni trikotnik s stranicami $4$, $4$ in $5\,\text{cm}$.

### Primer 4: zdaj ti

Načrtaj deltoid $ABCD$ z $|AB| = |AD| = a = 5\,\text{cm}$, $|CB| = |CD| = b = 3\,\text{cm}$ in simetrijsko diagonalo $e = |AC| = 6\,\text{cm}$.

**Podatki:** deltoid $ABCD$, $a = 5\,\text{cm}$, $b = 3\,\text{cm}$, $e = 6\,\text{cm}$
**Iščemo:** konstrukcijo deltoida $ABCD$

:::formula
Pomožni trikotnik $ABC$ po izreku sss ($a$, $b$, $e$). Diagonala $e$ je os simetrije deltoida.
:::

**Rešitev:**

1. Preverimo obstoj trikotnika $ABC$: $5 + 3 = 8 > 6$, zato obstaja.
2. Načrtamo $AC = 6\,\text{cm}$. Okoli $A$ zarišemo lok s polmerom $5\,\text{cm}$, okoli $C$ lok s polmerom $3\,\text{cm}$; presečišče je $B$, ker mora veljati $|AB| = a$ in $|CB| = b$.
3. Kako dobiš oglišče $D$? Premisli sam, nato preveri:

:::premisli
Kje leži oglišče $D$ in kako ga načrtaš?
---
$D$ je zrcalna slika $B$ čez diagonalo $AC$, ker je $e$ os simetrije. Na drugi strani $AC$ ponovno zarišeš lok okoli $A$ s polmerom $5\,\text{cm}$ in okoli $C$ s polmerom $3\,\text{cm}$; presečišče je $D$. Nato povežeš $A$, $B$, $C$, $D$.
:::

## Pogoste napake

- **»Štiri stranice določajo štirikotnik, kot tri določajo trikotnik.«** Štirikotnik ni tog: s stranicami $4$, $4$, $4$, $4\,\text{cm}$ lahko dobiš kvadrat ali poljubno sploščen romb. Popravek: poleg stranic potrebuješ še podatek o obliki, kot ali diagonalo.
- **Diagonala zamenjana s stranico.** Pri pravokotniku z $a = 4\,\text{cm}$ in $e = 5\,\text{cm}$ učenec nanese $5\,\text{cm}$ na pravokotnico v $B$, kot da bi bil to $b$. Diagonala pa povezuje $A$ in $C$. Popravek: v $B$ postavi pravi kot, $C$ pa dobiš z lokom okoli $A$ s polmerom $e$.
- **Pozabljeno preverjanje obstoja.** Paralelogram z $a = 6\,\text{cm}$, $b = 2\,\text{cm}$ in $e = 9\,\text{cm}$ ne obstaja, ker $6 + 2 < 9$. Popravek: pred konstrukcijo preveri trikotniško neenakost za pomožni trikotnik.
- **Pri trapezu iz štirih stranic pomožni trikotnik s stranico $a$.** Učenec vzame stranice $a$, $b$, $d$. Pravilna stranica pa je razlika osnovnic $a - c$, ker smo krak $b$ premaknili za dolžino $c$. Popravek: najprej izračunaj $a - c$.
- **Napačno označevanje.** Stranica $b$ med $A$ in $B$ ali diagonala $e$ med $B$ in $D$ dasta drugačen lik, kot ga zahteva naloga. Popravek: oglišča označi v nasprotni smeri urnega kazalca, $b = |BC|$, $e = |AC|$.

## Povzetek

- Oglišča $A$, $B$, $C$, $D$ v nasprotni smeri urnega kazalca; $a = |AB|$, $b = |BC|$, $c = |CD|$, $d = |DA|$, $e = |AC|$, $f = |BD|$.
- Štirikotnik načrtaš tako, da najprej načrtaš **pomožni trikotnik** (sss, sks, ksk, ssk), nato četrto oglišče z lastnostmi lika.
- Potrebno število podatkov: kvadrat $1$, pravokotnik in romb $2$, paralelogram in deltoid $3$, trapez $4$, splošni štirikotnik $5$.
- Štiri stranice ne določajo štirikotnika; potreben je še kot ali diagonala.
- Četrto oglišče je pogosto presečišče dveh lokov ali presečišče vzporednice in loka.
- Trapez iz štirih stranic: pomožni trikotnik ima stranice $a - c$, $b$, $d$.
- Vedno preveri obstoj pomožnega trikotnika in naredi diskusijo.

## Drugače: Na sliki

Predstavljaj si paralelogram $ABCD$ in v njem narisano diagonalo $BD$. Lik je zdaj sestavljen iz dveh trikotnikov, $ABD$ spodaj levo in $BCD$ zgoraj desno. Če zgornji trikotnik obrneš za pol kroga okoli razpolovišča diagonale $BD$, natanko pokrije spodnjega. Paralelogram sta torej dva skladna trikotnika, zlepljena ob diagonali.

Zato je risanje paralelograma kot risanje enega trikotnika in njegove »obrnjene kopije«. Pri deltoidu je slika podobna, le da je drugi trikotnik **zrcalna** kopija prvega čez diagonalo $AC$. Pri trapezu pa si od lika odrežeš paralelogram $EBCD$ in ostane trikotnik $AED$. Ko v liku vidiš te trikotnike, veš, kateri podatki manjkajo in katere dobiš zastonj.

## Drugače: Iz vsakdanjega življenja

Pomisli na zložljivo vrtno ograjo iz letvic, ki tvorijo rombe. Ko jo raztegneš, se rombi sploščijo, ko jo stisneš, se zožijo. Stranice letvic se ne spreminjajo, oblika rombov pa se. Zato štiri dolžine ne povedo, kakšen bo lik.

Mizar, ki izdeluje okvir za sliko ali vrata omare, pozna ta problem. Da se pravokotni okvir ne zamaje v paralelogram, mu na vogal pritrdi poševno letvico. Ta letvica je pravzaprav **diagonala**, ki razdeli okvir na dva toga trikotnika. Enako delaš pri konstrukciji: diagonala ali kot sta tisti dodatni podatek, ki »zaklene« obliko. Na mostovih in daljnovodih zato vidiš toliko trikotnikov.

## Drugače: Korak za korakom s številkami

Načrtajmo pravokotnik z $a = 4\,\text{cm}$ in diagonalo $e = 5\,\text{cm}$.

1. **Skica:** pravokotnik $ABCD$, diagonala $AC$ poudarjena. Pomožni trikotnik $ABC$ ima pravi kot pri $B$.
2. **Podatki za trikotnik:** $|AB| = 4\,\text{cm}$, $\beta = 90^\circ$, $|AC| = 5\,\text{cm}$. Dani kot $\beta$ leži nasproti daljše stranice $e$, zato gre za izrek ssk.
3. **Obstoj:** $e = 5\,\text{cm} > a = 4\,\text{cm}$, ker je diagonala kot hipotenuza daljša od stranice. Trikotnik obstaja.
4. **Načrtaj:** $AB = 4\,\text{cm}$, v $B$ pravokotnica, lok okoli $A$ s polmerom $5\,\text{cm}$ seka pravokotnico v $C$.
5. **Četrto oglišče:** izmeriš $|BC| = 3\,\text{cm}$. V $A$ pravokotnica na $AB$, lok okoli $A$ s polmerom $3\,\text{cm}$ da $D$, ker je $|AD| = |BC|$.
6. **Preveri:** izmeri $|BD|$; v pravokotniku mora biti $f = e = 5\,\text{cm}$.

## Drugače: Bolj natančno

Zakaj splošni štirikotnik potrebuje ravno $5$ podatkov? Diagonala $e$ ga razdeli na trikotnika $ABC$ in $ACD$. Za prvega potrebuješ $3$ podatke. Drugi trikotnik ima stranico $AC$ že narisano, zato zanj potrebuješ le še $2$ podatka, npr. $c$ in $d$. Skupaj $3 + 2 = 5$.

Vsaka lastnost posebnega štirikotnika je ena »podarjena« enačba. Pri paralelogramu sta to $c = a$ in $d = b$, zato $5 - 2 = 3$. Pri rombu dodatno velja $b = a$, zato ostaneta $2$. Pri pravokotniku sta $c = a$, $d = b$ in pravi kot, zato $5 - 3 = 2$. Pri kvadratu je še $b = a$, zato zadošča $1$ podatek.

Diskusija ni formalnost. Pri ssk lahko lok seka krak kota v dveh točkah in dobiš dva različna lika. Takrat preveri, ali obe rešitvi izpolnjujeta pogoje naloge, na primer, ali so oglišča v pravem vrstnem redu in se stranice ne križajo.

## Preveri se

? Koliko podatkov potrebuješ, da je paralelogram določen?
- $2$
~ Dva podatka zadoščata za pravokotnik ali romb, kjer lastnost lika poda obliko ali dolžino. Pri paralelogramu sta znani le zvezi $c = a$ in $d = b$.
+ $3$
- $4$
~ Štiri stranice niso potrebne, ker sta nasprotni stranici enaki; poleg tega brez kota ali diagonale oblika še vedno ne bi bila določena.
- $5$
~ Pet podatkov potrebuje splošni štirikotnik. Paralelogram ima lastnosti, ki dva podatka podarijo.
> Npr. $a$, $b$ in $\alpha$: pomožni trikotnik $ABD$ po sks, nato $C$ iz lokov $|CD| = a$, $|BC| = b$.

? Ana pravi: »Štirikotnik s stranicami $4$, $4$, $4$ in $4\,\text{cm}$ je kvadrat.« Ali ima prav?
- Da, ker enake stranice pomenijo kvadrat.
~ Enake stranice ima vsak romb. Kvadrat je le tisti romb, ki ima prave kote.
- Da, ker štiri stranice določajo štirikotnik.
~ To velja za tri stranice trikotnika, ne za štirikotnik. Štirikotnik ni tog in se lahko zamaje.
+ Ne, lahko je tudi romb, ki ni kvadrat.
> Z istimi stranicami dobiš kvadrat ali poljubno sploščen romb. Potreben je še kot ali diagonala.

? Paralelogram naj ima $a = 6\,\text{cm}$, $b = 2\,\text{cm}$ in $e = 9\,\text{cm}$. Kaj velja?
- Obstaja natanko en tak paralelogram.
~ Število rešitev ima smisel šteti šele, ko preveriš obstoj pomožnega trikotnika $ABC$.
+ Ne obstaja, ker $6 + 2 < 9$.
- Obstajata dva, eden na vsaki strani $AB$.
~ Lik na drugi strani $AB$ je le zrcalna slika in skladen s prvim. Tu pa trikotnik $ABC$ sploh ne obstaja.
> Pomožni trikotnik $ABC$ ima stranice $6$, $2$ in $9\,\text{cm}$, kar krši trikotniško neenakost.

? Trapez ima $a = 8\,\text{cm}$, $c = 5\,\text{cm}$, $b = 4\,\text{cm}$, $d = 3\,\text{cm}$. Katere stranice ima pomožni trikotnik?
- $8$, $4$ in $3\,\text{cm}$
~ Vzel si celo osnovnico $a$. Krak $b$ smo premaknili za $c$, zato je tretja stranica $a - c$.
+ $3$, $4$ in $3\,\text{cm}$
- $13$, $4$ in $3\,\text{cm}$
~ Osnovnici si seštel. Pomožni trikotnik ima razliko osnovnic, $a - c$.
> $a - c = 8\,\text{cm} - 5\,\text{cm} = 3\,\text{cm}$, ostali stranici sta kraka $b = 4\,\text{cm}$ in $d = 3\,\text{cm}$.

? Načrtaj pravokotnik z $a = 4\,\text{cm}$ in diagonalo $e = 5\,\text{cm}$. Kako dobiš oglišče $C$?
- Na pravokotnico v $B$ naneseš $5\,\text{cm}$.
~ Tako si diagonalo zamenjal s stranico $b$. Diagonala povezuje $A$ in $C$, ne $B$ in $C$.
- Na pravokotnico v $A$ naneseš $5\,\text{cm}$.
~ Tako dobiš točko na premici $AD$, ki je od $A$ oddaljena $5\,\text{cm}$, ne oglišča $C$. Oglišče $C$ leži nad $B$, ne nad $A$.
+ Lok okoli $A$ s polmerom $5\,\text{cm}$ seka pravokotnico na $AB$, postavljeno v točki $B$.
> $C$ leži na pravokotnici v $B$ (pravi kot) in je od $A$ oddaljen $e = 5\,\text{cm}$, zato je presečišče loka in pravokotnice.

:::simboli
A, B, C, D | oglišča štirikotnika | | | po vrsti okoli lika
a | stranica AB | | | pri trapezu osnovnica
b | stranica BC | | | pri trapezu krak
c | stranica CD | | | pri trapezu druga, krajša osnovnica
d | stranica DA | | | pri trapezu drugi krak
e | diagonala AC | |
f | diagonala BD | |
S | presečišče diagonal | | | pri rombu diagonali razpolavlja
E | presečišče AB in vzporednice s krakom BC skozi D | | | pomožni trikotnik AED ima stranico AE = a − c
:::
