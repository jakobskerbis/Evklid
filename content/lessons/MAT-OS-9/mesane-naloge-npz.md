---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Telefon, ki si ga želiš, stane $300\,€$. Januarja ga trgovina poceni za $20\,\%$, marca pa podraži za $20\,\%$. Ali spet stane $300\,€$?

Večina ljudi brez računanja reče »da«. Pravilno je »ne«: po pocenitvi stane $240\,€$, po podražitvi pa $288\,€$. Drugič smo $20\,\%$ računali od manjše osnove: od $240\,€$, ne od $300\,€$.

Na nacionalnem preverjanju znanja (NPZ) so naloge prav takšne. Vsaka vzame nekaj iz več let matematike: odstotke iz sedmega razreda, enačbe iz osmega, telesa iz devetega. Pasti so drobne: napačna osnova, premer namesto polmera, pozabljena pretvorba enot. Spodaj gremo skozi vse sklope po vrsti, na nalogah iz gradbeništva in domače delavnice.

## Razlaga

Najprej zemljevid. V nalogi poišči znak, ki pove, kateri sklop potrebuješ:

| sklop | znak v nalogi | orodje |
|---|---|---|
| odstotki | popust, podražitev, delež | $\text{del} = p \cdot \text{osnova}$ |
| enačbe, funkcija | »koliko dni«, cena na enoto | $y = kx + n$ |
| Pitagorov izrek | pravi kot, diagonala, lestev | $c^2 = a^2 + b^2$ |
| telesa | beton, voda, barva, škatla | $V$, $P$, pretvorba enot |
| podatki, verjetnost | meritve, naključno | $\bar{x}$, $P(A)$ |

Pred vsakim računom naredi tri stvari: izpiši podatke z enotami, nariši skico in zapiši, kaj iščeš. Sledi pet kratkih blokov. Vsak se konča z enim hitrim vprašanjem.

**Blok 1: odstotki.** Del izračunaš tako, da odstotek zapišeš kot decimalno število in pomnožiš z osnovo. Pocenitev za $20\,\%$ pomeni, da ostane $80\,\%$, torej pomnožiš z $0{,}8$. Podražitev za $20\,\%$ pomeni množenje z $1{,}2$. Zato je telefon na koncu vreden $300 \cdot 0{,}8 \cdot 1{,}2 = 288\,€$.

*Hitro vprašanje:* koliko je $15\,\%$ od $60\,€$? *($0{,}15 \cdot 60 = 9\,€$.)*

:::premisli
Kaj če bi trgovina telefon najprej podražila za $20\,\%$ in ga šele nato pocenila za $20\,\%$? Bi bil na koncu dražji, cenejši ali enako drag kot $288\,€$? Odloči se brez računanja, nato preveri.
---
Enak: $300 \cdot 1{,}2 = 360$ in $360 \cdot 0{,}8 = 288$, torej $288\,€$. Pri množenju vrstni red faktorjev ne vpliva na rezultat.
:::

**Blok 2: enačbe in linearna funkcija.** Najem betonskega mešalnika stane $15\,€$ na dan, dostava pa enkrat $20\,€$. Cena za $x$ dni je $c = 15x + 20$. To je linearna funkcija: $15$ je cena na dan (smerni koeficient), $20$ je začetna vrednost. Ko poznaš ceno in iščeš dneve, rešiš enačbo.

*Hitro vprašanje:* koliko stane najem za $3$ dni? *($15 \cdot 3 + 20 = 65\,€$.)*

**Blok 3: Pitagorov izrek.** Zidar preveri, ali je vogal temeljev pravi, tako: na eni vrvici odmeri $60\,\mathrm{cm}$, na drugi $80\,\mathrm{cm}$. Razdalja med oznakama mora biti točno $100\,\mathrm{cm}$, saj je $60^2 + 80^2 = 100^2$. Skica v besedah: dve kateti ob vogalu, hipotenuza pa poševno čeznju. Hipotenuza leži nasproti pravega kota in je vedno najdaljša stranica.

*Hitro vprašanje:* kateti merita $6\,\mathrm{dm}$ in $8\,\mathrm{dm}$. Koliko meri hipotenuza? *($\sqrt{36 + 64} = 10\,\mathrm{dm}$.)*

**Blok 4: telesa in enote.** Prostornina prizme in valja je ploščina osnovne ploskve krat višina: $V = O \cdot v$, pri valju $V = \pi r^2 v$. Piramida in stožec imata tretjino tega. V formulo vedno vstaviš **polmer**, ne premera. Pri enotah pazi: med sosednjimi enotami (mm, cm, dm, m) dolžine pretvarjaš z $10$, ploščine s $100$, prostornine s $1000$. Velja $1\,\mathrm{m^2} = 10\,000\,\mathrm{cm^2}$ in $1\,\mathrm{dm^3} = 1\,\mathrm{L}$, zato $1\,\mathrm{m^3} = 1000\,\mathrm{L}$.

*Hitro vprašanje:* koliko litrov drži kockasta posoda z robom $0{,}5\,\mathrm{m}$? *($0{,}5^3 = 0{,}125\,\mathrm{m^3} = 125\,\mathrm{L}$.)*

:::premisli
Mizar za vrtno klop izdeluje valjasto korito za rože. Kaj se zgodi s prostornino, če polmer podvoji in višino pusti enako?
---
Prostornina se početveri. V formuli $V = \pi r^2 v$ je polmer na kvadrat: $(2r)^2 = 4r^2$.
:::

**Blok 5: podatki in verjetnost.** Mizar ima v škatli $40$ vijakov, $6$ je zvitih. Če naključno vzame enega, je verjetnost, da je dober, $P = \dfrac{34}{40} = 0{,}85$, saj je dobrih $40 - 6 = 34$. Ugodne izide (dobre vijake) deliš z *vsemi* izidi ($40$), ne le z neugodnimi ($6$). Pri meritvah se spomni srednjih vrednosti: povprečje, mediana (srednji urejeni podatek), modus (najpogostejši).

*Hitro vprašanje:* kolikšna je verjetnost, da je izvlečeni vijak zvit? *($1 - 0{,}85 = 0{,}15$.)*

Spodnja »Zbirka simulacij za ponavljanje« ima za vsak sklop svojo simulacijo. Izberi »Geometrijska telesa« in kocki podvoji rob s $3$ na $6$. Napovej, kolikokrat večja bo prostornina, nato preveri: ker se podaljšajo vsi trije robovi, se poveča $2^3 = 8$-krat. Pri valju se podvoji le polmer, zato le $2^2 = 4$-krat.

## Rešeni primeri

### Primer 1: lestev ob zidu

Lestev je dolga $5\,\mathrm{m}$. Njen spodnji konec stoji $1{,}4\,\mathrm{m}$ od zidu. Kako visoko na zidu sega lestev?

**Podatki:** dolžina lestve $c = 5\,\mathrm{m}$, razdalja od zidu $a = 1{,}4\,\mathrm{m}$, zid je pravokoten na tla
**Iščemo:** višino $b$, do katere sega lestev

:::formula
Pitagorov izrek, iščemo kateto: $b = \sqrt{c^2 - a^2}$
:::

**Rešitev:**

1. Lestev je hipotenuza, ker leži nasproti pravega kota med zidom in tlemi.
2. $c^2 - a^2 = 25 - 1{,}96 = 23{,}04$, v $\mathrm{m^2}$. Odštevamo, ker iščemo kateto.
3. $b = \sqrt{23{,}04} = 4{,}8$, torej $4{,}8\,\mathrm{m}$.
4. Preverimo: $4{,}8\,\mathrm{m}$ je manj kot $5\,\mathrm{m}$, kateta je krajša od hipotenuze.
5. Odgovor: lestev sega $4{,}8\,\mathrm{m}$ visoko.

### Primer 2: ploščice za kopalnico

Tla kopalnice merijo $3{,}2\,\mathrm{m} \times 2{,}5\,\mathrm{m}$. Keramik kupi $10\,\%$ več ploščic, ker jih nekaj odreže. Ena škatla pokrije $1{,}5\,\mathrm{m^2}$ in stane $24\,€$. Koliko škatel kupi in koliko plača?

**Podatki:** $a = 3{,}2\,\mathrm{m}$, $b = 2{,}5\,\mathrm{m}$, dodatek $10\,\%$, ena škatla $1{,}5\,\mathrm{m^2}$, cena škatle $24\,€$
**Iščemo:** število škatel in ceno

:::formula
$S = a \cdot b$; z $10\,\%$ dodatka: $1{,}1 \cdot S$; število škatel $= \dfrac{\text{potrebna ploščina}}{\text{ploščina ene škatle}}$, zaokroženo navzgor
:::

**Rešitev:**

1. Ploščina tal: $3{,}2 \cdot 2{,}5 = 8$, torej $8\,\mathrm{m^2}$.
2. Z dodatkom: $1{,}1 \cdot 8 = 8{,}8$, torej $8{,}8\,\mathrm{m^2}$.
3. Škatle: $8{,}8 : 1{,}5 \approx 5{,}87$. Zaokrožimo **navzgor** na $6$, ker s petimi škatlami ploščic zmanjka.
4. Cena: $6 \cdot 24 = 144$, torej $144\,€$.
5. Odgovor: keramik kupi $6$ škatel in plača $144\,€$.

### Primer 3: betonski steber

Za nadstrešek vlijejo valjast betonski steber s premerom $40\,\mathrm{cm}$ in višino $2{,}5\,\mathrm{m}$. Iz ene vreče suhe mešanice dobijo $0{,}012\,\mathrm{m^3}$ betona. Koliko vreč potrebujejo?

**Podatki:** premer $d = 40\,\mathrm{cm}$, višina $v = 2{,}5\,\mathrm{m}$, ena vreča da $0{,}012\,\mathrm{m^3}$
**Iščemo:** prostornino stebra $V$ in število vreč

:::formula
$r = \dfrac{d}{2}$, $V = \pi r^2 v$, število vreč $= \dfrac{V}{0{,}012\,\mathrm{m^3}}$, zaokroženo navzgor
:::

**Rešitev:**

1. Polmer: $r = 40\,\mathrm{cm} : 2 = 20\,\mathrm{cm} = 0{,}2\,\mathrm{m}$. Vse enote spravimo v metre, ker je tudi vreča podana v $\mathrm{m^3}$.
2. Prostornina: $V = \pi \cdot 0{,}2^2 \cdot 2{,}5 = \pi \cdot 0{,}1 \approx 0{,}314\,\mathrm{m^3}$.
3. Vreče: $0{,}314 : 0{,}012 \approx 26{,}2$.
4. Zaokrožimo navzgor na $27$, saj bi s $26$ vrečami betona zmanjkalo.
5. Odgovor: steber ima okoli $0{,}314\,\mathrm{m^3}$ ($314\,\mathrm{L}$) betona; potrebujejo $27$ vreč.

### Primer 4: zdaj ti

Za steber so najeli mešalnik. Plačali so $95\,€$: $15\,€$ na dan in $20\,€$ za dostavo. Koliko dni so imeli mešalnik?

**Podatki:** cena na dan $15\,€$, dostava $20\,€$, skupaj $c = 95\,€$
**Iščemo:** število dni $x$

:::formula
$15x + 20 = 95$
:::

**Rešitev:**

1. Iz besedila zapišemo enačbo: $15x + 20 = 95$.
2. Na obeh straneh odštejemo $20$: $15x = 75$.
3. Dokončaj sam: izračunaj $x$ in preveri rezultat z vstavljanjem.

:::premisli
Koliko dni so imeli mešalnik?
---
$x = 75 : 15 = 5$ dni. Preizkus: $15 \cdot 5 + 20 = 95\,€$.
:::

## Pogoste napake

- **Odstotki od napačne osnove.** »$-20\,\%$ in $+20\,\%$ se izničita« ne velja, ker se osnova vmes spremeni. Enako pri obratni nalogi: če po $25\,\%$ popusta vrtalnik stane $60\,€$, prvotna cena ni $60 + 15 = 75\,€$. Velja $0{,}75 \cdot x = 60$, zato $x = 80\,€$.
- **Premer namesto polmera.** V $V = \pi r^2 v$ vstaviš $40\,\mathrm{cm}$ namesto $20\,\mathrm{cm}$ in dobiš štirikrat preveč betona. Najprej zapiši $r = d : 2$.
- **Ploščine in prostornine kot dolžine.** »$1\,\mathrm{m^2} = 100\,\mathrm{cm^2}$« je napačno. Kvadrat s stranico $1\,\mathrm{m}$ ima $100 \cdot 100 = 10\,000$ kvadratkov s stranico $1\,\mathrm{cm}$.
- **Zaokroževanje navzdol pri kosih.** $5{,}87$ škatle ni $5$ škatel. Pri vrečah, škatlah, deskah in avtobusih zaokrožiš navzgor, sicer zmanjka.
- **Seštevanje pri kateti.** Pri lestvi učenec računa $\sqrt{25 + 1{,}96}$ in dobi več kot $5\,\mathrm{m}$. Kateta je krajša od hipotenuze, zato odštevaš.

## Povzetek

- Najprej preberi: podatki z enotami, skica, kaj iščemo, kateri sklop.
- Odstotki: pocenitev za $20\,\%$ pomeni množenje z $0{,}8$, podražitev za $20\,\%$ množenje z $1{,}2$; zaporedne spremembe množiš.
- Linearna funkcija $y = kx + n$: $k$ je sprememba na enoto, $n$ začetna vrednost; pri znani vrednosti rešiš enačbo.
- Pitagorov izrek: $c^2 = a^2 + b^2$; za kateto odštevaš.
- Telesa: $V = O \cdot v$ (prizma, valj), tretjina tega (piramida, stožec); v formulo polmer.
- Enote: $1\,\mathrm{m^2} = 10\,000\,\mathrm{cm^2}$, $1\,\mathrm{m^3} = 1000\,\mathrm{L}$.
- Kose (škatle, vreče) zaokrožiš navzgor.
- Verjetnost: ugodni izidi deljeno z vsemi izidi.

## Drugače: Na sliki

Predstavljaj si nalogo kot gradbišče v petih fazah:

1. **Načrt:** preberi nalogo do konca.
2. **Temelji:** izpiši podatke z enotami in nariši skico.
3. **Ogrodje:** izberi sklop in zapiši formulo.
4. **Zidava:** računaj korak za korakom.
5. **Prevzem:** preveri smisel in enote.

Skica je načrt. Pri betonskem stebru nariši pravokotnik (prerez valja) in nanj napiši $d = 40\,\mathrm{cm}$ in $v = 2{,}5\,\mathrm{m}$. Takoj vidiš, da sta enoti različni in da je podan premer. Pri lestvi nariši pravokotni trikotnik: navpična stranica je zid, vodoravna tla, poševna lestev. Poševna stranica je hipotenuza.

Pri prevzemu primerjaj rezultat s skico: lestev ne more segati višje, kot je dolga, in steber ne more imeti več kot nekaj kubičnih metrov betona.

## Drugače: Bolj natančno

**Zakaj se odstotki ne izničijo.** Pocenitev in podražitev za isti delež $p$ dasta faktor $(1 - p)(1 + p) = 1 - p^2$. Za $p = 0{,}2$ je to $1 - 0{,}04 = 0{,}96$. Cena pade za $4\,\%$: $300 \cdot 0{,}96 = 288\,€$. Ker je $p^2$ vedno pozitiven, je končna cena vedno nižja od začetne, ne glede na vrstni red.

**Zakaj zaokrožiš šele na koncu.** Pri stebru je $V = 0{,}1\pi\,\mathrm{m^3}$. Če bi $\pi$ zaokrožil na $3$, bi dobil $0{,}3\,\mathrm{m^3}$ in le $25$ vreč, betona pa bi zmanjkalo. Vmesne rezultate zato piši na več decimalk ali pusti $\pi$ v zapisu, zaokrožiš šele odgovor.

**Zakaj se ploščina pretvarja s $100$.** Če dolžino povečaš $k$-krat, se ploščina poveča $k^2$-krat, prostornina pa $k^3$-krat. Ker je $1\,\mathrm{m} = 10\,\mathrm{dm}$, je $1\,\mathrm{m^2} = 10^2\,\mathrm{dm^2}$ in $1\,\mathrm{m^3} = 10^3\,\mathrm{dm^3}$. Isti razlog pojasni, zakaj se prostornina valja početveri, ko podvojiš polmer.

## Preveri se

? Najem lestve stane $8\,€$ na dan in enkrat $12\,€$ za dostavo. Katera tabela (dnevi: cena) ustreza?
- $1$: $8\,€$, $2$: $16\,€$, $3$: $24\,€$
~ Tu manjka dostava. To bi bilo premo sorazmerje, cena pa ima še začetni znesek $12\,€$.
+ $1$: $20\,€$, $2$: $28\,€$, $3$: $36\,€$
- $1$: $20\,€$, $2$: $40\,€$, $3$: $60\,€$
~ Tu je dostava plačana vsak dan. Dostavo plačaš enkrat, vsak dan se doda le $8\,€$.
> Cena je $c = 8x + 12$: vsak dan doda $8\,€$, dostava $12\,€$ je vedno zraven.

? Valjast sod za deževnico ima premer $60\,\mathrm{cm}$ in višino $90\,\mathrm{cm}$. Približno koliko vode drži?
- približno $25\,\mathrm{L}$
~ Napaka pri pretvorbi: $1\,\mathrm{m^3}$ je $1000\,\mathrm{L}$, ne $100\,\mathrm{L}$.
+ približno $250\,\mathrm{L}$
- približno $1000\,\mathrm{L}$
~ Za polmer si vzel premer $0{,}6\,\mathrm{m}$. Polmer je $0{,}3\,\mathrm{m}$, zato je prostornina štirikrat manjša.
> $V = \pi \cdot 0{,}3^2 \cdot 0{,}9 \approx 0{,}25\,\mathrm{m^3}$, kar je približno $250\,\mathrm{L}$.

? Zakaj je $1\,\mathrm{m^3} = 1000\,\mathrm{L}$?
- Ker je $1\,\mathrm{m} = 1000\,\mathrm{mm}$.
~ Liter ni milimeter. Liter je kubični decimeter, $1\,\mathrm{L} = 1\,\mathrm{dm^3}$.
+ Ker je $1\,\mathrm{L} = 1\,\mathrm{dm^3}$, v kocko z robom $1\,\mathrm{m}$ pa gre $10 \cdot 10 \cdot 10 = 1000$ kock z robom $1\,\mathrm{dm}$.
- Ker ima meter $10$ decimetrov, ima kubični meter $10$ litrov.
~ Pri prostornini pretvarjaš v treh smereh: dolžina, širina in višina, zato je faktor $10^3$.
> V vsaki od treh smeri je $10$ decimetrov, skupaj $1000$ kubičnih decimetrov, to je $1000$ litrov.

? Po $25\,\%$ popusta vrtalnik stane $60\,€$. Koliko je stal prej?
- $75\,€$
~ Prišteti $25\,\%$ od $60\,€$ ne gre, ker je popust izračunan od prvotne, višje cene.
+ $80\,€$
- $85\,€$
~ $25$ je odstotek, ne evri. Prišteti moraš znesek popusta, ki ga še ne poznaš.
> Po popustu ostane $75\,\%$ cene: $0{,}75 \cdot x = 60$, zato $x = 80\,€$. Preizkus: $25\,\%$ od $80\,€$ je $20\,€$, $80 - 20 = 60$.

? Mizar je v petih škatlah po $50$ vijakov preštel zvite vijake: $2$, $0$, $3$, $1$, $4$. Oceni verjetnost, da je naključno izbran vijak zvit.
- $0{,}2$
~ Zvite vijake si delil s $50$, kot da je škatla ena. Vseh vijakov je $5 \cdot 50 = 250$.
- $2$
~ To je povprečno število zvitih vijakov v škatli. Verjetnost ne more biti večja od $1$.
+ $0{,}04$
- $0{,}96$
~ To je verjetnost, da je vijak dober, torej nasprotni dogodek.
> Zvitih je $2 + 0 + 3 + 1 + 4 = 10$ od $250$ vijakov. Relativna frekvenca $\dfrac{10}{250} = 0{,}04$ je ocena za verjetnost.

:::simboli
c | hipotenuza (dolžina lestve) | | | drugje c = 15x + 20 cena najema v €
a | kateta (razdalja lestve od zidu) | | | pri S = a · b dolžina pravokotnika
b | kateta (višina, do katere sega lestev) | b = \sqrt{c^2 - a^2} | | pri S = a · b širina pravokotnika
S | ploščina pravokotne ploskve | S = a \cdot b | |
r | polmer stebra | r = \frac{d}{2} | |
d | premer stebra | | |
V | prostornina valja (stebra) | V = \pi r^2 v | | enoti obeh dolžin najprej poenoti
v | višina stebra | | |
x | število dni najema | | |
:::
