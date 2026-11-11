---
stanje: osnutek
demo: telesa
avtor: AI
---

## Zakaj se tega učimo

Kocke in kvadre srečaš na vsakem koraku. Škatla za čevlje, kos mila, opeka, kartonska embalaža za mleko, igralna kocka, omara, učilnica in bazen so vse kvadri ali kocke. Doslej si meril obseg in ploščino ravnih likov, na primer pravokotnika in kvadrata. Kocka in kvader pa nista ravna lika, ampak **telesi**: imata dolžino, širino in višino.

Pri telesih se vedno vprašamo dvoje:

- Koliko **papirja** potrebujem, da škatlo zavijem? To je vprašanje o **površini**.
- Koliko **vode ali peska** gre vanjo? To je vprašanje o **prostornini**.

V tej lekciji se boš naučil, kako kocko in kvader opišemo, kako ju razgrnemo v **mrežo** ter kako izračunamo njuno površino in prostornino. Pomagalo ti bo znanje o ploščini pravokotnika in kvadrata ter o pretvarjanju merskih enot.

## Razlaga

**1. Kaj sta kocka in kvader.** Obe telesi omejuje šest ravnih ploskev. Poznamo tri vrste delov:

| Del telesa | Kaj je | Koliko jih je |
|---|---|---|
| **ploskev** | ravna površina, ki telo omejuje | $6$ |
| **rob** | daljica, v kateri se stikata dve ploskvi | $12$ |
| **oglišče** | točka, v kateri se stikajo trije robovi | $8$ |

Pri **kvadru** so vse ploskve pravokotniki. Nasprotni ploskvi sta skladni, to pomeni, da sta povsem enaki. Robovi se delijo v tri skupine po štiri vzporedne in enako dolge robove. Njihove dolžine imenujemo **dolžina** $a$, **širina** $b$ in **višina** $c$.

Pri **kocki** so vse ploskve skladni kvadrati, vseh $12$ robov je enako dolgih. Dolžino roba označimo z $a$. Kocka je poseben kvader, pri katerem velja $a = b = c$.

**2. Mreža.** Če telo vzdolž nekaterih robov razrežemo in ga razgrnemo v ravnino, dobimo **mrežo** telesa. Iz mreže lahko telo spet sestavimo, ko jo prepogibamo po robovih.

- Mreža kocke je sestavljena iz $6$ skladnih kvadratov. Obstaja kar $11$ različnih mrež kocke. Znana je mreža v obliki križa: štirje kvadrati v vrsti, nad enim in pod enim izmed njih pa še po en kvadrat.
- Mreža kvadra je sestavljena iz $6$ pravokotnikov. Pari nasprotnih ploskev so skladni, zato so v mreži trije različni pari pravokotnikov.

Pri risanju mreže pazi, da se robovi, ki jih pri sestavljanju staknemo, ujemajo po dolžini. Pri izbiri mreže kocke ne smeš dati štirih kvadratov v kvadrat $2 \times 2$, saj se ob prepogibanju prekrivajo.

**3. Površina.** **Površina telesa** je vsota ploščin vseh njegovih mejnih ploskev. To je ravno ploščina mreže. Izražamo jo v kvadratnih enotah: $\text{mm}^2$, $\text{cm}^2$, $\text{dm}^2$, $\text{m}^2$.

Pri kocki je $6$ enakih kvadratov s ploščino $a \cdot a = a^2$:

$$P = 6 \cdot a^2$$

Pri kvadru so tri vrste ploskev, vsaka se pojavi dvakrat:

| Ploskev | Ploščina | Koliko jih je |
|---|---|---|
| spodnja in zgornja | $a \cdot b$ | $2$ |
| sprednja in zadnja | $a \cdot c$ | $2$ |
| leva in desna | $b \cdot c$ | $2$ |

Zato velja:

$$P = 2 \cdot (a \cdot b + a \cdot c + b \cdot c)$$

**4. Prostornina.** **Prostornina telesa** pove, koliko prostora telo zavzema. Merimo jo tako, da štejemo, koliko enotnih kock z robom $1$ enote gre vanj. Kocka z robom $1\,\text{cm}$ ima prostornino $1\,\text{cm}^3$ (en kubični centimeter).

Za kvader z dolžino $a$, širino $b$ in višino $c$ v dno položimo $a \cdot b$ enotnih kock, to je ena plast. Plasti je toliko, kot je višina, torej $c$. Skupaj imamo:

$$V = a \cdot b \cdot c$$

Za kocko, kjer so vsi trije robovi enaki, velja:

$$V = a \cdot a \cdot a = a^3$$

**5. Enote za prostornino.** Enote so kubične: $\text{mm}^3$, $\text{cm}^3$, $\text{dm}^3$, $\text{m}^3$. Pretvorba je tokrat po $1000$, ne po $10$ ali $100$:

$$1\,\text{dm}^3 = 1000\,\text{cm}^3 \qquad 1\,\text{m}^3 = 1000\,\text{dm}^3$$

Za tekočine pa že poznaš $1\,\text{l} = 1\,\text{dm}^3$ in $1\,\text{ml} = 1\,\text{cm}^3$.

Pri pretvarjanju površin pa velja po $100$: $1\,\text{dm}^2 = 100\,\text{cm}^2$ in $1\,\text{m}^2 = 100\,\text{dm}^2$.

**6. Postopek reševanja.**

1. Izpiši podatke in jih zapiši z enotami.
2. Poskrbi, da so vse dolžine v isti enoti.
3. Prepoznaj, ali iščeš površino ali prostornino.
4. Vstavi v ustrezno formulo in izračunaj.
5. Odgovori v stavku in napiši pravo enoto: kvadratno za površino, kubično za prostornino.

Interaktivna simulacija spodaj (**Kocka in kvader: mreža, površina, prostornina**) ti omogoča, da kocko in kvader razgrneš v mrežo, spreminjaš robove in opazuješ, kako se spreminjata površina in prostornina.

## Rešeni primeri

### Primer 1 (lažji)

Kocka ima rob dolg $5\,\text{cm}$. Izračunaj njeno površino in prostornino.

**Podatki:** $a = 5\,\text{cm}$ (rob kocke)
**Iščemo:** površino $P$ in prostornino $V$ kocke

:::formula
$P = 6 \cdot a^2$ in $V = a^3$
:::

**Rešitev:**

1. Površina: $P = 6 \cdot (5\,\text{cm})^2 = 6 \cdot 25\,\text{cm}^2 = 150\,\text{cm}^2$.
2. Prostornina: $V = (5\,\text{cm})^3 = 5 \cdot 5 \cdot 5\,\text{cm}^3 = 125\,\text{cm}^3$.
3. Odgovor: površina kocke je $150\,\text{cm}^2$, prostornina pa $125\,\text{cm}^3$.

### Primer 2 (srednji)

Kvader ima dolžino $8\,\text{cm}$, širino $5\,\text{cm}$ in višino $3\,\text{cm}$. Izračunaj njegovo površino in prostornino.

**Podatki:** $a = 8\,\text{cm}$, $b = 5\,\text{cm}$, $c = 3\,\text{cm}$
**Iščemo:** površino $P$ in prostornino $V$ kvadra

:::formula
$P = 2 \cdot (a \cdot b + a \cdot c + b \cdot c)$ in $V = a \cdot b \cdot c$
:::

**Rešitev:**

1. Ploščine treh vrst ploskev: $a \cdot b = 8 \cdot 5 = 40\,\text{cm}^2$, $a \cdot c = 8 \cdot 3 = 24\,\text{cm}^2$, $b \cdot c = 5 \cdot 3 = 15\,\text{cm}^2$.
2. Njihova vsota je $40 + 24 + 15 = 79\,\text{cm}^2$ (to je polovica površine).
3. Površina: $P = 2 \cdot 79\,\text{cm}^2 = 158\,\text{cm}^2$.
4. Prostornina: $V = 8 \cdot 5 \cdot 3\,\text{cm}^3 = 40 \cdot 3\,\text{cm}^3 = 120\,\text{cm}^3$.
5. Odgovor: površina kvadra je $158\,\text{cm}^2$, prostornina pa $120\,\text{cm}^3$.

### Primer 3 (težji)

Pravokotni akvarij brez pokrova ima notranje mere dna $80\,\text{cm}$ in $40\,\text{cm}$ ter je visok $50\,\text{cm}$. Steklar potrebuje steklo za dno in štiri stranske stene (debelino stekla zanemarimo). Koliko stekla potrebuje v $\text{cm}^2$ in v $\text{dm}^2$? Koliko litrov vode je v akvariju, če voda sega do višine $35\,\text{cm}$?

**Podatki:** $a = 80\,\text{cm}$, $b = 40\,\text{cm}$, $c = 50\,\text{cm}$ (višina akvarija), višina vode $h = 35\,\text{cm}$, akvarij nima zgornje ploskve
**Iščemo:** površino stekla (brez zgornje ploskve) v $\text{cm}^2$ in $\text{dm}^2$ ter prostornino vode v litrih

:::formula
$P = a \cdot b + 2 \cdot a \cdot c + 2 \cdot b \cdot c$, $V = a \cdot b \cdot h$, $1\,\text{dm}^2 = 100\,\text{cm}^2$, $1\,\text{l} = 1\,\text{dm}^3 = 1000\,\text{cm}^3$
:::

**Rešitev:**

1. Dno: $a \cdot b = 80 \cdot 40 = 3200\,\text{cm}^2$.
2. Dve večji stranski steni: $2 \cdot a \cdot c = 2 \cdot 80 \cdot 50 = 8000\,\text{cm}^2$.
3. Dve manjši stranski steni: $2 \cdot b \cdot c = 2 \cdot 40 \cdot 50 = 4000\,\text{cm}^2$.
4. Skupaj: $3200 + 8000 + 4000 = 15\,200\,\text{cm}^2$.
5. Pretvorba: $15\,200\,\text{cm}^2 : 100 = 152\,\text{dm}^2$.
6. Voda tvori kvader z enakim dnom, a visok je le $35\,\text{cm}$: $V = 80 \cdot 40 \cdot 35 = 112\,000\,\text{cm}^3$.
7. Pretvorba: $112\,000\,\text{cm}^3 : 1000 = 112\,\text{dm}^3 = 112\,\text{l}$.
8. Odgovor: steklar potrebuje $15\,200\,\text{cm}^2$ ($152\,\text{dm}^2$) stekla, v akvariju pa je $112$ litrov vode.

## Pogoste napake

- **Mešanje površine in prostornine.** Učenec za škatlo izračuna $P = 120\,\text{cm}^3$ ali $V = 158\,\text{cm}^2$. Razlog: ne loči med vprašanjema »koliko papirja« in »koliko vode«. Pravilno: površina je vsota ploščin ploskev, enota je kvadratna ($\text{cm}^2$); prostornina je $a \cdot b \cdot c$, enota je kubična ($\text{cm}^3$).
- **Prostornina kocke kot $3 \cdot a$.** Za $a = 4\,\text{cm}$ nekdo zapiše $V = 12\,\text{cm}^3$. Razlog: poenostavi potenco z množenjem. Pravilno: $a^3 = a \cdot a \cdot a$, torej $4 \cdot 4 \cdot 4 = 64\,\text{cm}^3$.
- **Pozabljene ploskve pri površini kvadra.** Učenec sešteje samo tri ploščine ($ab + ac + bc$) in pozabi na nasprotne ploskve. Razlog: vidimo le tri ploskve hkrati. Pravilno: kvader ima $6$ ploskev, zato vsoto treh ploščin pomnožimo z $2$. Če ploskve manjkajo (akvarij brez pokrova), jih odštejemo posebej in premislimo, katere so res tam.
- **Napačna pretvorba prostorninskih enot.** Zapiše $1\,\text{dm}^3 = 10\,\text{cm}^3$. Razlog: ponovi pravilo za dolžine. Pravilno: kocka z robom $1\,\text{dm} = 10\,\text{cm}$ ima prostornino $10 \cdot 10 \cdot 10 = 1000\,\text{cm}^3$.
- **Različne enote v istem računu.** Množi $2\,\text{m} \cdot 50\,\text{cm} \cdot 40\,\text{cm}$ in dobi nesmiselni rezultat. Razlog: pozabi, da morajo biti vse dolžine v isti enoti. Pravilno: najprej pretvori vse mere, na primer $2\,\text{m} = 200\,\text{cm}$, šele nato računaj.

## Povzetek

- Kocka in kvader imata $6$ ploskev, $12$ robov in $8$ oglišč. Mreža kocke je iz $6$ skladnih kvadratov, mreža kvadra iz $6$ pravokotnikov.
- Kocka: $P = 6 \cdot a^2$, $V = a^3$.
- Kvader: $P = 2 \cdot (a \cdot b + a \cdot c + b \cdot c)$, $V = a \cdot b \cdot c$.
- Površina je vsota ploščin ploskev (enote $\text{cm}^2$, $\text{dm}^2$, $\text{m}^2$), prostornina pa pove, koliko prostora telo zavzema (enote $\text{cm}^3$, $\text{dm}^3$, $\text{m}^3$).
- Pretvorba prostornin je po $1000$: $1\,\text{dm}^3 = 1000\,\text{cm}^3$, $1\,\text{m}^3 = 1000\,\text{dm}^3$; velja $1\,\text{l} = 1\,\text{dm}^3$.
- Pred računanjem pretvori vse mere v isto enoto.

## Drugače: Na sliki

Predstavljaj si škatlo za čevlje, ki jo previdno razrežeš po robovih in razgrneš na mizo. Dobiš mrežo. Tako izgleda mreža kocke v obliki križa (vsak kvadratek je ena ploskev):

:::risba skica
opis: Mreža kocke v obliki križa iz šestih enakih kvadratov. V srednji vrsti so levo, spredaj, desno in zadaj; nad kvadratom spredaj je zgoraj, pod njim spodaj.
območje: 0; 0 .. 4; 3
pravokotnik: 1; 2 .. 2; 3
pravokotnik: 0; 1 .. 1; 2
pravokotnik: 1; 1 .. 2; 2
pravokotnik: 2; 1 .. 3; 2
pravokotnik: 3; 1 .. 4; 2
pravokotnik: 1; 0 .. 2; 1
napis: 1,5; 2,5 | zgoraj
napis: 0,5; 1,5 | levo
napis: 1,5; 1,5 | spredaj
napis: 2,5; 1,5 | desno
napis: 3,5; 1,5 | zadaj
napis: 1,5; 0,5 | spodaj
:::

Vsak od šestih kvadratov ima ploščino $a^2$. Ker mrežo sestavlja šest takih kvadratov, je njena celotna ploščina $6a^2$. Ploščina mreže je torej površina telesa.

Pri kvadru dobiš po istem postopku šest pravokotnikov, ki so v parih enaki:

| Par ploskev | Mere pravokotnika | Ploščina |
|---|---|---|
| spodaj in zgoraj | $a$ krat $b$ | $ab$ |
| spredaj in zadaj | $a$ krat $c$ | $ac$ |
| levo in desno | $b$ krat $c$ | $bc$ |

Prostornino pa si lahko predstavljaš kot plasti enotnih kock. Kvader z dolžino $4$, širino $3$ in višino $2$ ima na dnu 4 vrste po 3 kocke, to je 12 kock v eni plasti. Ker sta plasti dve, je kock skupaj $12 \cdot 2 = 24$. V simulaciji spodaj to opazuj tako, da spreminjaš robove in gledaš, kako se spremeni število kock.

## Drugače: Iz vsakdanjega življenja

**Zavijanje darila.** Darilo je v škatli z merami $30\,\text{cm} \times 20\,\text{cm} \times 10\,\text{cm}$. Papirja potrebuješ vsaj toliko, kot je površina škatle. Izračunaš: $30 \cdot 20 = 600$, $30 \cdot 10 = 300$, $20 \cdot 10 = 200$, skupaj $1100$, krat $2$ je $2200\,\text{cm}^2$. V resnici vzameš malo več, ker se papir ob robovih prekriva.

**Liter mleka.** Embalaža mleka ima prostornino $1\,\text{l} = 1\,\text{dm}^3$. Če bi bila kocka, bi bil njen rob $1\,\text{dm} = 10\,\text{cm}$, saj je $10 \cdot 10 \cdot 10 = 1000\,\text{cm}^3$.

**Učilnica.** Učilnica je dolga $8\,\text{m}$, široka $6\,\text{m}$ in visoka $3\,\text{m}$. Njena prostornina je $8 \cdot 6 \cdot 3 = 144\,\text{m}^3$. Ta podatek je pomemben za prezračevanje: več učencev potrebuje več zraka.

**Bazen.** Bazen je dolg $10\,\text{m}$, širok $5\,\text{m}$ in globok $2\,\text{m}$, torej je poln $100\,\text{m}^3$ vode. Ker je $1\,\text{m}^3 = 1000\,\text{l}$, je to $100\,000$ litrov.

**Čarobna kocka.** Čarobna kocka $3 \times 3 \times 3$ je sestavljena iz $3 \cdot 3 \cdot 3 = 27$ majhnih kock, na vsaki od šestih strani vidiš $3 \cdot 3 = 9$ barvnih kvadratkov, skupaj $54$.

## Drugače: Korak za korakom s številkami

Vzemimo kvader z dolžino $a = 9\,\text{cm}$, širino $b = 4\,\text{cm}$ in višino $c = 5\,\text{cm}$.

**A. Prostornina.**

1. Izberi formulo: $V = a \cdot b \cdot c$.
2. Vstavi: $V = 9 \cdot 4 \cdot 5\,\text{cm}^3$.
3. Najprej $9 \cdot 4 = 36$ (to je ploščina dna v $\text{cm}^2$), nato $36 \cdot 5 = 180$.
4. Odgovor: $V = 180\,\text{cm}^3$.

**B. Površina.**

1. Izberi formulo: $P = 2 \cdot (ab + ac + bc)$.
2. Izračunaj: $ab = 36$, $ac = 9 \cdot 5 = 45$, $bc = 4 \cdot 5 = 20$.
3. Vsota: $36 + 45 + 20 = 101$.
4. Podvoji: $2 \cdot 101 = 202$.
5. Odgovor: $P = 202\,\text{cm}^2$.

**C. Obratna naloga (iščemo manjkajoči rob).** Kvader ima prostornino $360\,\text{cm}^3$, dolžino $10\,\text{cm}$ in širino $6\,\text{cm}$. Kolikšna je višina?

1. Zapis: $360 = 10 \cdot 6 \cdot c$, torej $360 = 60 \cdot c$.
2. Delimo: $c = 360 : 60 = 6\,\text{cm}$.
3. Preizkus: $10 \cdot 6 \cdot 6 = 360$, kar se ujema.
4. Robovi so $10\,\text{cm}$, $6\,\text{cm}$ in $6\,\text{cm}$, torej to še ni kocka, je pa kvader z dvema enakima robovoma.
5. Odgovor: višina kvadra je $6\,\text{cm}$.

Za konec preveri smiselnost: prostornina ima vedno kubično enoto, površina pa kvadratno.

## Drugače: Bolj natančno

**Prostornina kot ploščina osnovne ploskve krat višina.** Pri kvadru je $a \cdot b$ ploščina dna $S$, zato lahko zapišemo $V = S \cdot c$. Tako razmišljamo tudi pri drugih ravnih telesih, ki jih boš spoznal pozneje.

**Površina kot dve osnovni ploskvi in plašč.** Površino kvadra lahko razdelimo na dve osnovni ploskvi (dno in vrh) ter **plašč**, to so štiri stranske ploskve. Plašč je pravokotnik, ko ga razgrnemo, z osnovnico, ki je enaka obsegu dna $o = 2 \cdot (a + b)$, in višino $c$. Za kvader iz prejšnjega razdelka: $S = 36\,\text{cm}^2$, $o = 2 \cdot (9 + 4) = 26\,\text{cm}$, plašč $= 26 \cdot 5 = 130\,\text{cm}^2$, torej $P = 2 \cdot 36 + 130 = 202\,\text{cm}^2$. Rezultat se ujema z zgornjim.

**Zakaj po $1000$?** Rob kocke, dolg $1\,\text{dm}$, meri $10\,\text{cm}$. Vanjo gre $10$ kock v vrsti, $10$ vrst v plasti in $10$ plasti: $10 \cdot 10 \cdot 10 = 1000$. Zato je pri prostornini faktor $10^3 = 1000$, pri ploščini $10^2 = 100$ in pri dolžini $10$.

**Kaj se zgodi, če rob podvojimo?** Kocka z robom $2\,\text{cm}$ ima $P = 24\,\text{cm}^2$ in $V = 8\,\text{cm}^3$. Kocka z robom $4\,\text{cm}$ ima $P = 96\,\text{cm}^2$ in $V = 64\,\text{cm}^3$. Ko rob podvojimo, se površina poveča $4$-krat, prostornina pa kar $8$-krat. Večja kot so telesa, hitreje raste njihova prostornina v primerjavi s površino.

## Preveri se

? Kocka ima rob $4\,\text{cm}$. Kolikšna je njena prostornina?
- $12\,\text{cm}^3$
+ $64\,\text{cm}^3$
- $96\,\text{cm}^3$
> $V = a^3 = 4 \cdot 4 \cdot 4 = 64\,\text{cm}^3$. Odgovor $96$ je površina kocke ($6 \cdot 16$), odgovor $12$ dobiš, če rob pomnožiš s $3$.

? Kvader ima mere $5\,\text{cm}$, $4\,\text{cm}$ in $2\,\text{cm}$. Kolikšna je njegova površina?
- $40\,\text{cm}^2$
+ $76\,\text{cm}^2$
- $38\,\text{cm}^2$
> $P = 2 \cdot (5 \cdot 4 + 5 \cdot 2 + 4 \cdot 2) = 2 \cdot (20 + 10 + 8) = 76\,\text{cm}^2$. Število $40$ je prostornina, $38$ pa polovica površine.

? Koliko robov in koliko oglišč ima kvader?
- $8$ robov in $12$ oglišč
- $6$ robov in $8$ oglišč
+ $12$ robov in $8$ oglišč
> Kvader ima $12$ robov, $8$ oglišč in $6$ ploskev.

? Posoda ima prostornino $2500\,\text{cm}^3$. Koliko litrov vode gre vanjo?
- $2500\,\text{l}$
- $25\,\text{l}$
+ $2{,}5\,\text{l}$
> $1\,\text{l} = 1\,\text{dm}^3 = 1000\,\text{cm}^3$, zato je $2500\,\text{cm}^3 = 2{,}5\,\text{dm}^3 = 2{,}5\,\text{l}$.

:::simboli
a | dolžina kvadra (rob kocke) | | | pri kocki so vsi robovi enaki: a = b = c
b | širina kvadra | |
c | višina kvadra | |
h | višina vode v akvariju | | | manjša od višine akvarija c
P | površina telesa | P = 2 \cdot (a \cdot b + a \cdot c + b \cdot c) | | kocka: P = 6 · a²
V | prostornina telesa | V = a \cdot b \cdot c | | kocka: V = a³
:::
