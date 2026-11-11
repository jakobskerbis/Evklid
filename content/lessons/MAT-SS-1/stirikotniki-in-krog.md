---
stanje: osnutek
demo: stirikotnik
avtor: AI
---

## Zakaj se tega učimo

Mizar je zbil okvir za vrata. Oba para nasprotnih letev sta enako dolga, a ali so vogali res pravi? Kotomer je premajhen. Mizar zato z metrom izmeri obe diagonali okvirja: če sta enako dolgi, je okvir pravokoten. Zakaj ta trik deluje?

Poskusi še sam. Na list nariši poljuben štirikotnik in ga izreži. Odtrgaj vse štiri vogale in jih zloži skupaj, da se oglišča stikajo v eni točki. Vogali skupaj zapolnijo polni kot okoli točke, ne glede na to, kakšen štirikotnik si narisal.

Pri gradnji in obrti takšna pravila uporabljajo vsak dan. Koliko ploščic gre na tla, koliko desk na trapezno steno, koliko stekla v okroglo okno? Za odgovor potrebuješ **lastnosti** štirikotnikov in kroga ter njihove **ploščine**. Pri tem ti pomaga trikotnik: diagonala vsak štirikotnik razreže na dva trikotnika.

## Razlaga

**1. Vsota kotov.** Trije učenci so s kotomerom izmerili kote svojih štirikotnikov:

| Štirikotnik | Izmerjeni koti | Vsota |
|---|---|---|
| poljuben | $88^\circ$, $97^\circ$, $104^\circ$, $70^\circ$ | $359^\circ$ |
| paralelogram | $120^\circ$, $60^\circ$, $119^\circ$, $62^\circ$ | $361^\circ$ |
| kvadrat | $90^\circ$, $90^\circ$, $90^\circ$, $90^\circ$ | $360^\circ$ |

Vsote se razlikujejo le za stopinjo, kar je napaka merjenja. Vzorec je jasen. Štirikotnik $ABCD$ ima štiri oglišča, štiri stranice in dve **diagonali** ($e = AC$, $f = BD$). Diagonala $AC$ ga razreže na dva trikotnika, vsak ima vsoto kotov $180^\circ$, zato velja za vsak štirikotnik:

$$\alpha + \beta + \gamma + \delta = 360^\circ$$

**2. Vrste štirikotnikov in njihove lastnosti.** Lik prepoznaš po stranicah, še bolj zanesljivo pa po diagonalah. V simulaciji spodaj »Štirikotniki« po vrsti izberi paralelogram, pravokotnik in romb ter opazuj diagonali. Pri vseh treh se razpolavljata. Pri pravokotniku sta poleg tega enako dolgi, pri rombu pa se sekata pod pravim kotom.

| Lik | Definicija | Lastnosti |
|---|---|---|
| **paralelogram** | oba para nasprotnih stranic vzporedna | nasprotni stranici sta enaki, nasprotna kota enaka, sosednja kota se dopolnjujeta do $180^\circ$, diagonali se razpolavljata |
| **pravokotnik** | paralelogram s pravimi koti | diagonali sta enako dolgi |
| **romb** | paralelogram z enakimi stranicami | diagonali sta pravokotni in razpolavljata kote |
| **kvadrat** | pravokotnik z enakimi stranicami (hkrati romb) | ima vse lastnosti pravokotnika in romba |
| **trapez** | vsaj en par vzporednih stranic (osnovnici $a$, $c$, kraka $b$, $d$) | srednjica (daljica med središčema krakov) je vzporedna osnovnicama; enakokraki trapez ima enaka kraka in enako dolgi diagonali |
| **deltoid** | dva para sosednjih enakih stranic | diagonali sta pravokotni, ena diagonala je simetrala druge |

Lastnosti so »podedovane«: vsak kvadrat je romb, vsak romb je paralelogram, paralelogram pa ni nujno pravokotnik. Kar velja za vsak paralelogram, zato velja tudi za pravokotnik, romb in kvadrat, ne da bi to dokazoval znova.

:::premisli
Zdaj razloži mizarjev trik iz uvoda. Zakaj enako dolgi diagonali pomenita, da je okvir pravokoten?
---
Ker sta oba para nasprotnih letev enako dolga, je okvir paralelogram (štirikotnik, ki ima oba para nasprotnih stranic enako dolga, je vedno paralelogram). Med paralelogrami imajo enako dolgi diagonali le pravokotniki, zato so vsi vogali pravi.
:::

**3. Ploščine in obsegi štirikotnikov.** Višina $v_a$ je pravokotna razdalja med osnovnico $a$ in nasprotno stranico. Iz papirnatega paralelograma ob eni poševni stranici odreži pravokotni trikotnik, ki ga odseče višina, in ga prilepi na drugo stran. Dobiš pravokotnik z enako osnovnico $a$ in s stranico $v_a$, zato je ploščina paralelograma $a \cdot v_a$. Dva enaka trapeza, enega obrnjenega, sestavita paralelogram z osnovnico $a + c$, zato ima trapez polovico njegove ploščine. Ker sta diagonali pravokotni, romb in deltoid zapolnita natanko polovico pravokotnika s stranicama $e$ in $f$, ki ju oklepa.

| Lik | Ploščina | Obseg |
|---|---|---|
| pravokotnik | $S = a \cdot b$ | $o = 2(a + b)$ |
| kvadrat | $S = a^2$ | $o = 4a$ |
| paralelogram | $S = a \cdot v_a$ | $o = 2(a + b)$ |
| romb | $S = \dfrac{e \cdot f}{2}$ ali $a \cdot v$ | $o = 4a$ |
| trapez | $S = \dfrac{(a + c)\, v}{2}$ | $o = a + b + c + d$ |
| deltoid | $S = \dfrac{e \cdot f}{2}$ | $o = 2(a + b)$ |

Višina $v$ je pravokotna razdalja med nasprotnima stranicama (osnovnicama), ne dolžina kraka. Srednjica trapeza je $m = \dfrac{a + c}{2}$, zato je $S = m \cdot v$. Diagonala kvadrata je $d = a\sqrt{2}$, diagonala pravokotnika $d = \sqrt{a^2 + b^2}$ (Pitagorov izrek). V rombu se diagonali sekata pod pravim kotom in razpolavljata, zato s Pitagorovim izrekom iz $\dfrac{e}{2}$ in $\dfrac{f}{2}$ izračunaš stranico: $a^2 = \left(\dfrac{e}{2}\right)^2 + \left(\dfrac{f}{2}\right)^2$.

**4. Krog in krožnica.** Krožnica je množica točk v ravnini, ki so od središča $S$ oddaljene za polmer $r$; krog je del ravnine, ki ga krožnica omejuje. Tetiva je daljica med dvema točkama krožnice, premer je najdaljša tetiva ($d = 2r$). Za krog velja:

$$o = 2\pi r, \qquad S = \pi r^2$$

Tangenta se krožnice dotika v eni točki in je pravokotna na polmer, ki gre v dotikališče.

**5. Krožni lok in izsek.** Središčni kot $\alpha$ (kot z ogliščem v središču) določa krožni lok in izsek. Lok je delež $\dfrac{\alpha}{360^\circ}$ krožnice, izsek pa enak delež kroga. Pri loku se $2$ iz $2\pi r$ pokrajša s $360^\circ$ v $180^\circ$:

$$l = \frac{\pi r \alpha}{180^\circ}, \qquad S_{\text{izs}} = \frac{\pi r^2 \alpha}{360^\circ}$$

**6. Središčni in obodni kot.** Središčni kot ima oglišče v središču krožnice, obodni kot pa na krožnici, kraka obeh gresta skozi krajišči istega loka. V simulaciji spodaj »Obodni in središčni kot« izberi lok in premikaj točko po drugem delu krožnice. Zapiši nekaj parov kotov:

| Središčni kot $\alpha$ | Obodni kot $\varphi$ |
|---|---|
| $60^\circ$ | $30^\circ$ |
| $100^\circ$ | $50^\circ$ |
| $180^\circ$ | $90^\circ$ |

Obodni kot se pri premikanju točke ne spremeni in je vsakič natanko polovica središčnega. Za kota nad istim lokom torej velja:

- **obodni kot je polovica središčnega:** $\varphi = \dfrac{\alpha}{2}$,
- vsi obodni koti nad istim lokom so enaki,
- **Talesov izrek:** obodni kot nad premerom je pravi ($\alpha = 180^\circ$, zato $\varphi = 90^\circ$).

:::premisli
Središčni kot nad lokom meri $140^\circ$. Napovej obodni kot, če je točka na drugem delu krožnice, in kot, ki ga dobiš, ko točko preneseš na isti lok, nad katerim stoji središčni kot.
---
Prvi je $70^\circ$, polovica od $140^\circ$. Drugi stoji nad preostalim lokom, ki mu pripada središčni kot $360^\circ - 140^\circ = 220^\circ$, zato meri $110^\circ$. Skupaj imata $180^\circ$.
:::

**7. Tetivni štirikotnik.** Štirikotnik, ki mu lahko očrtamo krožnico (vsa štiri oglišča ležijo na eni krožnici), je **tetivni**, ker so vse njegove stranice tetive. Nasprotna kota imata vsoto $180^\circ$:

$$\alpha + \gamma = 180^\circ, \qquad \beta + \delta = 180^\circ$$

Pravokotnik in enakokraki trapez sta tetivna, romb (razen kvadrata) in neenakokraki trapez nista. **Tangentni** štirikotnik ima včrtano krožnico, ki se dotika vseh štirih stranic; v njem velja $a + c = b + d$ (vsota nasprotnih stranic je enaka).

## Rešeni primeri

### Primer 1 (lažji)

Keramik polaga ploščice v obliki romba z diagonalama $e = 12\,\text{cm}$ in $f = 16\,\text{cm}$. Izračunaj stranico, obseg in ploščino ene ploščice.

**Podatki:** romb, $e = 12\,\text{cm}$, $f = 16\,\text{cm}$
**Iščemo:** stranico $a$, obseg $o$, ploščino $S$

:::formula
$a^2 = \left(\dfrac{e}{2}\right)^2 + \left(\dfrac{f}{2}\right)^2$, $\;o = 4a$, $\;S = \dfrac{e \cdot f}{2}$
:::

**Rešitev:**

1. Diagonali se v rombu razpolavljata in sta pravokotni, zato nastane pravokotni trikotnik s katetama $\dfrac{e}{2} = 6\,\text{cm}$ in $\dfrac{f}{2} = 8\,\text{cm}$, njegova hipotenuza je stranica romba.
2. $a = \sqrt{6^2 + 8^2} = \sqrt{100} = 10\,\text{cm}$.
3. Obseg: $o = 4 \cdot 10\,\text{cm} = 40\,\text{cm}$.
4. Ploščina: $S = \dfrac{12\,\text{cm} \cdot 16\,\text{cm}}{2} = 96\,\text{cm}^2$.
5. Odgovor: stranica ploščice je $10\,\text{cm}$, obseg $40\,\text{cm}$, ploščina $96\,\text{cm}^2$.

### Primer 2 (srednji)

Stranska deska kotne police je enakokraki trapez z osnovnicama $a = 14\,\text{cm}$ in $c = 8\,\text{cm}$ ter krakoma $b = d = 5\,\text{cm}$. Izračunaj višino, ploščino in obseg deske.

**Podatki:** enakokraki trapez, $a = 14\,\text{cm}$, $c = 8\,\text{cm}$, $b = d = 5\,\text{cm}$
**Iščemo:** višino $v$, ploščino $S$, obseg $o$

:::formula
$S = \dfrac{(a + c)\, v}{2}$, $\;o = a + b + c + d$, višina iz Pitagorovega izreka: $v^2 = b^2 - \left(\dfrac{a - c}{2}\right)^2$
:::

**Rešitev:**

1. Iz oglišč krajše osnovnice spustimo višini na daljšo. Nastane pravokotnik s stranico $c = 8\,\text{cm}$ in dva skladna pravokotna trikotnika. Vsak ima vodoravno kateto $x = \dfrac{a - c}{2} = \dfrac{14 - 8}{2} = 3\,\text{cm}$ in hipotenuzo $b = 5\,\text{cm}$.
2. Višina: $v = \sqrt{5^2 - 3^2} = \sqrt{16} = 4\,\text{cm}$.
3. Ploščina: $S = \dfrac{(14 + 8)\,\text{cm} \cdot 4\,\text{cm}}{2} = 44\,\text{cm}^2$.
4. Obseg: $o = 14 + 5 + 8 + 5 = 32\,\text{cm}$.
5. Odgovor: višina je $4\,\text{cm}$, ploščina $44\,\text{cm}^2$, obseg $32\,\text{cm}$.

### Primer 3 (težji)

Steklar izdeluje okroglo okno s polmerom $r = 9\,\text{cm}$. Iz središča vodita do točk $A$ in $B$ na robu letvici, ki oklepata središčni kot $80^\circ$. Točka $C$ leži na večjem loku $AB$, točka $D$ pa na manjšem loku $AB$. Izračunaj obodni kot $\varphi$ pri $C$, kot pri $D$, dolžino manjšega loka $AB$ (svinčeni rob) in ploščino pripadajočega izseka (barvno steklo).

**Podatki:** $r = 9\,\text{cm}$, središčni kot $\alpha = 80^\circ$ nad lokom $AB$, $C$ na večjem loku $AB$, $D$ na manjšem loku $AB$
**Iščemo:** obodni kot $\varphi$ pri $C$, kot $\angle ADB$, dolžino loka $l$, ploščino izseka $S_{\text{izs}}$

:::formula
$\varphi = \dfrac{\alpha}{2}$, $\;\varphi + \angle ADB = 180^\circ$, $\;l = \dfrac{\pi r \alpha}{180^\circ}$, $\;S_{\text{izs}} = \dfrac{\pi r^2 \alpha}{360^\circ}$
:::

**Rešitev:**

1. Obodni kot nad manjšim lokom je polovica središčnega: $\varphi = \dfrac{80^\circ}{2} = 40^\circ$.
2. Štirikotnik $ACBD$ je tetivni, zato sta nasprotna kota pri $C$ in $D$ suplementarna (vsota $180^\circ$): $\angle ADB = 180^\circ - 40^\circ = 140^\circ$.
3. Dolžina loka: $l = \dfrac{\pi \cdot 9\,\text{cm} \cdot 80^\circ}{180^\circ} = 4\pi\,\text{cm} \approx 12{,}57\,\text{cm}$.
4. Ploščina izseka: $S_{\text{izs}} = \dfrac{\pi \cdot (9\,\text{cm})^2 \cdot 80^\circ}{360^\circ} = 18\pi\,\text{cm}^2 \approx 56{,}55\,\text{cm}^2$.
5. Odgovor: $\varphi = 40^\circ$, $\angle ADB = 140^\circ$, svinčeni rob je dolg $4\pi\,\text{cm} \approx 12{,}57\,\text{cm}$, barvno steklo ima ploščino $18\pi\,\text{cm}^2 \approx 56{,}55\,\text{cm}^2$.

### Primer 4 – zdaj ti

Mizar izdela okvir za vrata s pravimi koti, širok $90\,\text{cm}$ in visok $200\,\text{cm}$. Kako dolgi morata biti diagonali, ko ju preveri z metrom?

**Podatki:** pravokotnik, $a = 90\,\text{cm}$, $b = 200\,\text{cm}$
**Iščemo:** dolžino diagonale $d$

:::formula
$d^2 = a^2 + b^2$ (Pitagorov izrek v polovici pravokotnika)
:::

**Rešitev:**

1. Diagonala razreže pravokotnik na dva pravokotna trikotnika s katetama $a$ in $b$, diagonala je hipotenuza.
2. $d^2 = 90^2 + 200^2 = 8100 + 40000 = 48100$.
3. Izračunaj $d$ in zapiši odgovor.

:::premisli
Kolikšna je diagonala?
---
$d = \sqrt{48100} \approx 219{,}3\,\text{cm}$. Obe diagonali morata meriti približno $219\,\text{cm}$; če se razlikujeta, okvir ni pravokoten.
:::

## Pogoste napake

- **Ploščina romba oziroma paralelograma s stranico namesto višine.** Če za paralelogram s stranicama $10\,\text{cm}$ in $6\,\text{cm}$ izračunaš $S = 10 \cdot 6$, dobiš ploščino pravokotnika. Razlog: pri pravokotniku sta stranici hkrati višina in osnovnica, pri poševnem liku pa ne. Pravilno: $S = a \cdot v_a$, kjer je $v_a$ pravokotna razdalja med stranico $a$ in njej vzporedno stranico, zato ni nikoli večja od stranice $b$.
- **Za višino trapeza vzameš krak ali računaš z eno samo osnovnico.** Razlog: krak je pri poševnem trapezu na sliki »videti« kot višina, formula $S = a \cdot v$ pa je znana od paralelograma. Pravilno: višina je pravokotna na osnovnici, v formulo gresta obe osnovnici, $S = \dfrac{(a + c)\, v}{2}$. Če poznaš kraka in osnovnici, višino dobiš s Pitagorovim izrekom, kot v primeru 2.
- **Pozabiš deliti z $2$ pri ploščini romba ali deltoida.** $S = e \cdot f$ je ploščina pravokotnika, ki lik oklepa. Razlog: lik zavzame natanko polovico tega pravokotnika. Pravilno: $S = \dfrac{e \cdot f}{2}$.
- **Zamenjava $2\pi r$ in $\pi r^2$ ali premera in polmera.** Razlog: obe formuli vsebujeta $\pi$ in $r$, v besedilu pa je pogosto podan premer. Pravilno: najprej izračunaj $r = \dfrac{d}{2}$. Nato: obseg je dolžina in ima enoto $\text{cm}$ ($o = 2\pi r$), ploščina ima enoto $\text{cm}^2$ ($S = \pi r^2$). Preveri enoto rezultata.
- **Obodni kot enak središčnemu.** Razlog: oba stojita nad istim lokom. Pravilno: središčni kot je dvakrat večji od obodnega. Za lok, ki ustreza kotu $100^\circ$ v središču, je obodni kot $50^\circ$.

## Povzetek

- Vsota kotov v štirikotniku: $360^\circ$. Paralelogram: $S = a \cdot v_a$; diagonali se razpolavljata.
- Romb in deltoid: $S = \dfrac{e \cdot f}{2}$, diagonali sta pravokotni. Trapez: $S = \dfrac{(a + c)\, v}{2}$.
- Diagonala kvadrata $a\sqrt{2}$, pravokotnika $\sqrt{a^2 + b^2}$.
- Krog: $o = 2\pi r$, $S = \pi r^2$. Lok $l = \dfrac{\pi r \alpha}{180^\circ}$, izsek $S = \dfrac{\pi r^2 \alpha}{360^\circ}$.
- Obodni kot je polovica središčnega; obodni kot nad premerom je pravi (Talesov izrek).
- Tetivni štirikotnik: vsota nasprotnih kotov je $180^\circ$. Tangentni: $a + c = b + d$.

## Drugače: Korak za korakom s številkami

Vzemimo pravokotnik s stranicama $a = 9\,\text{cm}$ in $b = 12\,\text{cm}$ ter mu očrtajmo krožnico.

1. **Ploščina in obseg pravokotnika:** $S = 9 \cdot 12 = 108\,\text{cm}^2$, $o = 2 \cdot (9 + 12) = 42\,\text{cm}$.
2. **Diagonala:** $d = \sqrt{9^2 + 12^2} = \sqrt{225} = 15\,\text{cm}$.
3. **Zakaj je pravokotnik tetiven:** vsi štirje koti so pravi, zato so nasprotni koti suplementarni ($90^\circ + 90^\circ = 180^\circ$). Obe diagonali sta premera očrtane krožnice (obrat Talesovega izreka: pravi kot stoji nad diagonalo).
4. **Polmer očrtane krožnice:** $R = \dfrac{d}{2} = 7{,}5\,\text{cm}$.
5. **Ploščina kroga:** $S_k = \pi \cdot 7{,}5^2 = 56{,}25\pi \approx 176{,}71\,\text{cm}^2$.
6. **Delež pravokotnika v krogu:** $\dfrac{108}{176{,}71} \approx 0{,}611$, torej približno $61\,\%$.
7. **Obseg kroga:** $o = 2\pi \cdot 7{,}5 = 15\pi \approx 47{,}12\,\text{cm}$, kar je več kot obseg pravokotnika ($42\,\text{cm}$).

## Drugače: Bolj natančno

**Dokaz, da je obodni kot polovica središčnega.** Naj bo $S$ središče krožnice, $A$ in $B$ krajišči loka in $C$ točka na krožnici, tako da središče leži znotraj kota $ACB$. Premica $CS$ naj krožnico seka še v točki $D$. Trikotnika $SAC$ in $SBC$ sta enakokraka (dva polmera), zato sta kota ob osnovnici enaka: $\angle SAC = \angle SCA = \varphi_1$ in $\angle SBC = \angle SCB = \varphi_2$. Kot $\angle ASD$ je zunanji kot trikotnika $SAC$, zato je enak vsoti nenaležnih kotov, $2\varphi_1$. Podobno je $\angle BSD = 2\varphi_2$. Središčni kot je torej $\alpha = 2(\varphi_1 + \varphi_2) = 2\varphi$. Za druge lege točke $C$ je utemeljitev podobna, a daljša.

**Tetivni štirikotnik iz obodnih kotov.** V tetivnem štirikotniku $ACBD$ iz primera 3 kota pri $C$ in $D$ stojita nad lokoma, ki skupaj sestavljata celo krožnico. Središčna kota teh lokov imata vsoto $360^\circ$, torej imata obodna kota vsoto $180^\circ$. Obratno: če imata nasprotna kota štirikotnika vsoto $180^\circ$, mu lahko očrtamo krožnico.

## Drugače: Kot zgodba

Ana z dedkom gradi vrtno uto. Najprej zakoličita temelj. Dedek napne vrvico in odmeri $3\,\text{m}$ ob eni stranici, $4\,\text{m}$ ob drugi, nato premakne drugo stranico, da je razdalja med oznakama natanko $5\,\text{m}$. »Zdaj je vogal pravi,« reče. Ana pomisli in prikima: $3^2 + 4^2 = 25 = 5^2$, trikotnik iz vrvice je torej pravokoten (obrat Pitagorovega izreka).

Stranska stena ima obliko trapeza: spodaj meri $180\,\text{cm}$, pod streho $120\,\text{cm}$, visoka je $80\,\text{cm}$ nad zidcem. Ana izračuna, koliko desk potrebujeta: $S = \dfrac{(180 + 120) \cdot 80}{2} = 12000\,\text{cm}^2$, torej $1{,}2\,\text{m}^2$. »Kraka ne smeš vzeti za višino,« jo opomni dedek, »ker sta poševna.«

V vrata želita okroglo okence s polmerom $30\,\text{cm}$. Za tesnilo okoli stekla potrebujeta obseg, $2\pi \cdot 30 \approx 188{,}5\,\text{cm}$, za steklo ploščino, $\pi \cdot 30^2 \approx 2827\,\text{cm}^2$. Ana opazi, da sta enoti različni: centimetri za tesnilo, kvadratni centimetri za steklo.

Na koncu dedek iz okrogle deske izreže mizico in išče njeno središče. Kotnik položi z ogliščem na rob deske in na robu označi, kje ga sekata kraka. Po Talesovem izreku je daljica med oznakama premer. Ko to ponovi na drugem mestu, se premera sekata v središču.

## Preveri se

? Na karirast papir narišeš **romb** in mu potegneš diagonali. Kaj opaziš?
- Diagonali sta enako dolgi in se razpolavljata.
~ To velja za pravokotnik. Romb ima enako dolgi diagonali le, če je kvadrat.
+ Diagonali sta pravokotni in se razpolavljata.
- Diagonali sta pravokotni, razpolovi pa se le ena od njiju.
~ To je deltoid: razpolovljena je le diagonala, ki ni simetrala lika.
> Romb je paralelogram, zato se diagonali razpolavljata; ker so stranice enake, se sekata pod pravim kotom.

? Okrogla miza ima premer $1{,}2\,\text{m}$. Približno kolikšna je ploščina mizne plošče?
- približno $4{,}5\,\text{m}^2$
~ Premer si vzel za polmer: $\pi \cdot 1{,}2^2 \approx 4{,}5$. Polmer je $0{,}6\,\text{m}$.
- približno $3{,}8\,\text{m}^2$
~ To je obseg, $2\pi \cdot 0{,}6 \approx 3{,}8$, in njegova enota je $\text{m}$, ne $\text{m}^2$.
+ približno $1{,}1\,\text{m}^2$
> $r = 0{,}6\,\text{m}$, $S = \pi r^2 \approx 3{,}14 \cdot 0{,}36 \approx 1{,}1\,\text{m}^2$.

? Zakaj sta dva obodna kota nad istim lokom enaka?
- Ker je vsak od njiju enak središčnemu kotu nad tem lokom.
~ Obodni kot ni enak središčnemu, temveč je njegova polovica.
- Ker je vsak obodni kot pravi.
~ Pravi je le obodni kot nad premerom (Talesov izrek).
+ Ker je vsak od njiju polovica istega središčnega kota.
> Oba stojita nad istim lokom, ki mu pripada en sam središčni kot $\alpha$, zato sta oba enaka $\dfrac{\alpha}{2}$.

? Trapez ima ploščino $60\,\text{cm}^2$ ter osnovnici $11\,\text{cm}$ in $9\,\text{cm}$. Kolikšna je njegova višina?
- $3\,\text{cm}$
~ Pozabil si, da je v formuli deljenje z $2$: $v = \dfrac{2S}{a + c}$, ne $\dfrac{S}{a + c}$.
- približno $5{,}45\,\text{cm}$
~ Računal si kot pri paralelogramu z eno osnovnico, $\dfrac{60}{11}$. Trapez ima dve različni osnovnici.
+ $6\,\text{cm}$
> Iz $S = \dfrac{(a + c)\, v}{2}$ sledi $v = \dfrac{2S}{a + c} = \dfrac{120}{20} = 6\,\text{cm}$.

? Tesar s kotnikom išče središče okrogle plošče. Oglišče pravega kota položi na rob, kraka sekata rob v točkah $P$ in $Q$. Kaj je daljica $PQ$?
- polmer plošče
~ Polmer ima krajišče v središču, točki $P$ in $Q$ pa sta obe na robu.
- poljubna tetiva, ki ne gre skozi središče
~ Tetiva bi bila, a pravi obodni kot stoji le nad premerom.
+ premer plošče
> Po Talesovem izreku stoji pravi obodni kot nad premerom, zato gre $PQ$ skozi središče. Dva taka premera se sekata v središču.

:::simboli
\alpha, \beta, \gamma, \delta | notranji koti štirikotnika | | | $\alpha$ je pri krogu središčni kot
o | obseg | | |
r | polmer kroga | | |
S | ploščina lika | | | krog: $S = \pi r^2$; $S$ je tudi središče krožnice
l | dolžina krožnega loka | l = \frac{\pi r \alpha}{180^\circ} | | $\alpha$ je središčni kot
S_{\text{izs}} | ploščina krožnega izseka | S_{\text{izs}} = \frac{\pi r^2 \alpha}{360^\circ} | |
a, c | osnovnici trapeza | | | $a$ je tudi stranica pravokotnika, paralelograma, kvadrata ali romba
b, d | kraka trapeza | | | $b$ je tudi druga stranica pravokotnika ali paralelograma; $d$ je tudi premer $d = 2r$ ali diagonala pravokotnika oziroma kvadrata
e, f | diagonali štirikotnika | | | $e = AC$, $f = BD$
v, v_a | višina trapeza, paralelograma ali romba | v^2 = b^2 - \left(\frac{a - c}{2}\right)^2 | | zveza velja za enakokraki trapez
m | srednjica trapeza | m = \frac{a + c}{2} | |
\varphi | obodni kot | \varphi = \frac{\alpha}{2} | | polovica središčnega kota nad istim lokom
A, B, C, D | oglišča štirikotnika ABCD | | | v nalogi s krogom točke na krožnici
:::
