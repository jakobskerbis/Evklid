---
stanje: osnutek
demo: telesa
avtor: AI
---

## Zakaj se tega učimo

Tilen odpre škatlo novega telefona in reče: »Če bi bili vsi robovi te škatle dvakrat daljši, bi tovarna porabila dvakrat več kartona, vanjo pa bi šlo dvakrat več stvari.« Sliši se logično. Ima prav?

Da to presodimo, moramo ločiti dve vprašanji, ki si ju zastavimo pri vsaki škatli, ohišju računalnika ali polnilni postaji:

- Koliko **kartona** potrebujem, da škatlo izdelam ali zavijem? To je vprašanje o **površini**.
- Koliko **prostora** je v njej? To je vprašanje o **prostornini**.

Škatla za telefon ima obliko **kvadra**, igralna kocka pa obliko **kocke**. Nista ravna lika kot pravokotnik in kvadrat, ampak **telesi**: imata dolžino, širino in višino. Ploščino pravokotnika in kvadrata že znaš izračunati, zato boš površino hitro obvladal. Na koncu razlage se vrnemo k Tilnu.

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

- Mreža kocke je sestavljena iz $6$ skladnih kvadratov. Obstaja kar $11$ različnih mrež kocke. Znana je mreža v obliki križa: štirje kvadrati v vrsti, nad drugim kvadratom v vrsti in pod njim pa še po en kvadrat.
- Mreža kvadra je sestavljena iz $6$ pravokotnikov. Pari nasprotnih ploskev so skladni, zato so v mreži trije različni pari pravokotnikov.

Tako je videti mreža kocke v obliki križa, kot bi škatlico razrezal po robovih in jo razgrnil na mizo:

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

Pri risanju mreže pazi, da se robovi, ki jih pri sestavljanju staknemo, ujemajo po dolžini. Mreža kocke nikoli ne vsebuje štirih kvadratov, zloženih v kvadrat $2 \times 2$: ti štirje bi se stikali v enem oglišču, v oglišču kocke pa se stikajo le tri ploskve.

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

**4. Prostornina.** **Prostornina telesa** pove, koliko prostora telo zavzema. Merimo jo z **enotnimi kockami**: kocka z robom $1\,\text{cm}$ ima prostornino $1\,\text{cm}^3$ (en kubični centimeter). Zlagajmo takšne kocke v kvader, kot zlagaš kocke lego. Dno naj bo dolgo $3$ kocke in široko $2$ kocki, plasti pa dodajamo.

| Kock v dnu | Plasti | Vseh kock |
|---|---|---|
| $3 \cdot 2 = 6$ | $1$ | $6$ |
| $3 \cdot 2 = 6$ | $2$ | $12$ |
| $3 \cdot 2 = 6$ | $3$ | $18$ |

Opaziš vzorec? Primerjaj zadnji stolpec s prvima dvema: kako iz kock v dnu in števila plasti dobiš vse kocke?

:::premisli
Koliko enotnih kock gre v kvader z dolžino $5$, širino $4$ in višino $3$? Napovej po vzorcu iz preglednice.
---
$60$ kock. V eno plast gre $5 \cdot 4 = 20$ kock, plasti so $3$, zato je kock $20 \cdot 3 = 60$.
:::

Vzorec zapišemo kot pravilo. V eni plasti je toliko kock, kolikšna je ploščina dna $a \cdot b$, plasti pa je toliko, kolikšna je višina $c$. Kvader z dolžino $a$, širino $b$ in višino $c$ ima prostornino

$$V = a \cdot b \cdot c$$

Pri kocki so vsi trije robovi enaki, zato velja:

$$V = a \cdot a \cdot a = a^3$$

**5. Enote za prostornino.** Enote so kubične: $\text{mm}^3$, $\text{cm}^3$, $\text{dm}^3$, $\text{m}^3$. Pretvorba je tokrat po $1000$, ne po $10$ ali $100$, ker pretvorimo vse tri mere: kocka z robom $1\,\text{dm} = 10\,\text{cm}$ vsebuje $10 \cdot 10 \cdot 10 = 1000$ enotnih kock po $1\,\text{cm}^3$.

$$1\,\text{dm}^3 = 1000\,\text{cm}^3 \qquad 1\,\text{m}^3 = 1000\,\text{dm}^3$$

Za tekočine pa že poznaš $1\,\text{l} = 1\,\text{dm}^3$ in $1\,\text{ml} = 1\,\text{cm}^3$.

Pri pretvarjanju površin pa velja po $100$: $1\,\text{dm}^2 = 100\,\text{cm}^2$ in $1\,\text{m}^2 = 100\,\text{dm}^2$.

**6. Ima Tilen prav?** Primerjajmo kocki z robom $2\,\text{cm}$ in $4\,\text{cm}$:

| Rob | Površina | Prostornina |
|---|---|---|
| $2\,\text{cm}$ | $24\,\text{cm}^2$ | $8\,\text{cm}^3$ |
| $4\,\text{cm}$ | $96\,\text{cm}^2$ | $64\,\text{cm}^3$ |

:::premisli
Rob se je podvojil. Kolikokrat se je povečala površina in kolikokrat prostornina? Zakaj ne obakrat dvakrat?
---
Površina se je povečala $4$-krat ($96 : 24 = 4$), prostornina $8$-krat ($64 : 8 = 8$). Vsaka ploskev je dvakrat daljša in dvakrat širša, zato ima $2 \cdot 2 = 4$-krat večjo ploščino. Pri prostornini se podvojijo vse tri mere: $2 \cdot 2 \cdot 2 = 8$.
:::

Enako velja za vsak kvader, tudi za škatlo telefona: dvakrat daljši robovi pomenijo $4$-krat več kartona in $8$-krat več prostora. Tilen torej nima prav.

V simulaciji spodaj (**Kocka in kvader: mreža, površina, prostornina**) izberi kocko in vklopi »enotske kocke«. Rob $a$ nastavi najprej na $2$, nato na $4$. Opazuj, kolikokrat več enotnih kock je v večji kocki.

**7. Postopek reševanja.**

1. Izpiši podatke in jih zapiši z enotami.
2. Poskrbi, da so vse dolžine v isti enoti.
3. Prepoznaj, ali iščeš površino ali prostornino.
4. Vstavi v ustrezno formulo in izračunaj.
5. Odgovori v stavku in napiši pravo enoto: kvadratno za površino, kubično za prostornino.

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

Škatla za brezžične slušalke ima obliko kvadra z dolžino $8\,\text{cm}$, širino $5\,\text{cm}$ in višino $3\,\text{cm}$. Koliko kartona potrebujemo zanjo (brez zavihkov) in kolikšna je njena prostornina?

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
5. Odgovor: za škatlo potrebujemo $158\,\text{cm}^2$ kartona, njena prostornina je $120\,\text{cm}^3$.

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

### Primer 4 – zdaj ti

Škatla za telefon ima dno dolgo $16\,\text{cm}$ in široko $9\,\text{cm}$, njena prostornina je $720\,\text{cm}^3$. Kako visoka je škatla? Koliko kartona potrebujemo zanjo (brez zavihkov)?

**Podatki:** $a = 16\,\text{cm}$, $b = 9\,\text{cm}$, $V = 720\,\text{cm}^3$
**Iščemo:** višino $c$ in površino $P$

:::formula
$V = a \cdot b \cdot c$, zato $c = V : (a \cdot b)$; $P = 2 \cdot (a \cdot b + a \cdot c + b \cdot c)$
:::

**Rešitev:**

1. Ploščina dna: $a \cdot b = 16 \cdot 9 = 144\,\text{cm}^2$. Toliko enotnih kock gre v eno plast.
2. Višina pove, koliko je plasti: $c = 720 : 144$. Izračunaj jo sam.
3. Z višino izračunaj še površino škatle, nato preveri:

:::premisli
Koliko je $c$ in koliko $P$?
---
$c = 720 : 144 = 5\,\text{cm}$. Površina: $P = 2 \cdot (144 + 16 \cdot 5 + 9 \cdot 5) = 2 \cdot (144 + 80 + 45) = 2 \cdot 269 = 538\,\text{cm}^2$.
:::

## Pogoste napake

- **Mešanje površine in prostornine.** Učenec za škatlo izračuna $P = 120\,\text{cm}^3$ ali $V = 158\,\text{cm}^2$. Razlog: ne loči med vprašanjema »koliko papirja« in »koliko vode«. Pravilno: površina je vsota ploščin ploskev, enota je kvadratna ($\text{cm}^2$); prostornina je $a \cdot b \cdot c$, enota je kubična ($\text{cm}^3$).
- **Prostornina kocke kot $3 \cdot a$.** Za $a = 4\,\text{cm}$ nekdo zapiše $V = 12\,\text{cm}^3$. Razlog: poenostavi potenco z množenjem. Pravilno: $a^3 = a \cdot a \cdot a$, torej $4 \cdot 4 \cdot 4 = 64\,\text{cm}^3$.
- **Pozabljene ploskve pri površini kvadra.** Učenec sešteje samo tri ploščine ($ab + ac + bc$) in pozabi na nasprotne ploskve. Razlog: vidimo le tri ploskve hkrati. Pravilno: kvader ima $6$ ploskev, zato vsoto treh ploščin pomnožimo z $2$. Če kakšna ploskev manjka (akvarij brez pokrova), premisli, katere so res tam, in seštej le njih.
- **Napačna pretvorba prostorninskih enot.** Zapiše $1\,\text{dm}^3 = 10\,\text{cm}^3$. Razlog: ponovi pravilo za dolžine. Pravilno: kocka z robom $1\,\text{dm} = 10\,\text{cm}$ ima prostornino $10 \cdot 10 \cdot 10 = 1000\,\text{cm}^3$. Sorodna napaka je množenje različnih enot, na primer $2\,\text{m} \cdot 50\,\text{cm} \cdot 40\,\text{cm}$: najprej pretvori ($2\,\text{m} = 200\,\text{cm}$), šele nato računaj.
- **»Dvakrat daljši robovi, dvakrat več.«** Kot Tilen učenec misli, da se površina in prostornina podvojita, ko podvojimo robove. Razlog: podvojitev ene mere prenese na vse količine. Pravilno: ploščina vsake ploskve se poveča $2 \cdot 2 = 4$-krat, prostornina $2 \cdot 2 \cdot 2 = 8$-krat.

## Povzetek

- Kocka in kvader imata $6$ ploskev, $12$ robov in $8$ oglišč. Mreža kocke je iz $6$ skladnih kvadratov, mreža kvadra iz $6$ pravokotnikov.
- Kocka: $P = 6 \cdot a^2$, $V = a^3$.
- Kvader: $P = 2 \cdot (a \cdot b + a \cdot c + b \cdot c)$, $V = a \cdot b \cdot c$.
- Površina je vsota ploščin ploskev (enote $\text{cm}^2$, $\text{dm}^2$, $\text{m}^2$), prostornina pa pove, koliko prostora telo zavzema (enote $\text{cm}^3$, $\text{dm}^3$, $\text{m}^3$).
- Pretvorba prostornin je po $1000$: $1\,\text{dm}^3 = 1000\,\text{cm}^3$, $1\,\text{m}^3 = 1000\,\text{dm}^3$; velja $1\,\text{l} = 1\,\text{dm}^3$.
- Pred računanjem pretvori vse mere v isto enoto.
- Če vse robove podvojimo, se površina poveča $4$-krat, prostornina pa $8$-krat.

## Drugače: Iz vsakdanjega življenja

**Zavijanje darila.** Darilo je v škatli z merami $30\,\text{cm} \times 20\,\text{cm} \times 10\,\text{cm}$. Papirja potrebuješ vsaj toliko, kot je površina škatle. Izračunaš: $30 \cdot 20 = 600$, $30 \cdot 10 = 300$, $20 \cdot 10 = 200$, skupaj $1100$, krat $2$ je $2200\,\text{cm}^2$. V resnici vzameš malo več, ker se papir ob robovih prekriva.

**Liter mleka.** V embalažo mleka gre $1\,\text{l} = 1\,\text{dm}^3$. Če bi bila embalaža kocka, bi bil njen rob $1\,\text{dm} = 10\,\text{cm}$, saj je $10 \cdot 10 \cdot 10 = 1000\,\text{cm}^3$.

**Učilnica.** Učilnica je dolga $8\,\text{m}$, široka $6\,\text{m}$ in visoka $3\,\text{m}$. Njena prostornina je $8 \cdot 6 \cdot 3 = 144\,\text{m}^3$. Ta podatek je pomemben za prezračevanje: več učencev potrebuje več zraka.

**Bazen.** Bazen je dolg $10\,\text{m}$, širok $5\,\text{m}$ in globok $2\,\text{m}$, torej je poln $100\,\text{m}^3$ vode. Ker je $1\,\text{m}^3 = 1000\,\text{l}$, je to $100\,000$ litrov.

**Čarobna kocka.** Čarobna kocka $3 \times 3 \times 3$ je na pogled sestavljena iz $3 \cdot 3 \cdot 3 = 27$ majhnih kock. Na vsaki od šestih strani vidiš $3 \cdot 3 = 9$ barvnih kvadratkov, skupaj $54$.

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

## Drugače: Kot zgodba

Maja pomaga stricu, ki prodaja telefone. Na pult postavi prazno transportno škatlo, dolgo $40\,\text{cm}$, široko $30\,\text{cm}$ in visoko $20\,\text{cm}$. Ob njej je kup škatel za telefone, vsaka meri $20\,\text{cm}$, $10\,\text{cm}$ in $5\,\text{cm}$.

»Koliko jih gre noter?« vpraša stric. Maja jih začne zlagati na dno. Po dolžini gresta $40 : 20 = 2$, po širini $30 : 10 = 3$, zato je v eni plasti $2 \cdot 3 = 6$ škatel. Po višini zloži $20 : 5 = 4$ plasti. Skupaj $6 \cdot 4 = 24$ škatel.

Nato preveri še s prostornino. Velika škatla ima $40 \cdot 30 \cdot 20 = 24\,000\,\text{cm}^3$, mala $20 \cdot 10 \cdot 5 = 1000\,\text{cm}^3$. Ker je $24\,000 : 1000 = 24$, se štetje ujema.

Stric bi rad veliko škatlo še zavil v papir z logotipom trgovine. Maja sešteje ploskve: $40 \cdot 30 = 1200$, $40 \cdot 20 = 800$, $30 \cdot 20 = 600$, skupaj $2600$, ploskev pa je dvakrat toliko. Potrebujeta vsaj $5200\,\text{cm}^2$, to je $52\,\text{dm}^2$ papirja. Za kartonaste stene šteje površina, za telefone v njej pa prostornina.

## Preveri se

? Katera trditev drži?
- Kvader ima $8$ robov in $12$ oglišč.
~ Zamenjal si števili: robov je $12$, oglišč $8$.
+ Kocka ima $6$ ploskev, $12$ robov in $8$ oglišč.
- Pri vsakem kvadru so vse ploskve skladne.
~ Skladni sta le nasprotni ploskvi. Vse so skladne samo pri kocki.
- Šest kvadratov, med katerimi štirje tvorijo kvadrat $2 \times 2$, je lahko mreža kocke.
~ V oglišču kocke se stikajo le tri ploskve, zato se štirje kvadrati $2 \times 2$ ne zložijo v kocko.
> Kocka in kvader imata $6$ ploskev, $12$ robov in $8$ oglišč. Pri kocki so vse ploskve skladni kvadrati.

? Jure je izračunal površino škatle z merami $5\,\text{cm}$, $4\,\text{cm}$ in $2\,\text{cm}$. Kateri korak je napačen?
**Korak 1:** $5 \cdot 4 = 20$, $5 \cdot 2 = 10$, $4 \cdot 2 = 8$. **Korak 2:** $20 + 10 + 8 = 38$. **Korak 3:** površina je $38\,\text{cm}^2$.
- korak 1
~ Ploščine treh različnih ploskev so pravilne.
- korak 2
~ Vsota $20 + 10 + 8 = 38$ je pravilna.
+ korak 3
- Nobeden, rešitev je pravilna.
~ Jure je seštel le tri ploskve, škatla pa jih ima šest.
> Vsaka ploskev se pojavi dvakrat, zato je $P = 2 \cdot 38 = 76\,\text{cm}^2$. Jure je pozabil na nasprotne ploskve.

? Kocka $A$ ima rob $3\,\text{cm}$, kocka $B$ pa $6\,\text{cm}$. Kaj velja?
- Kocka $B$ ima dvakrat večjo površino in dvakrat večjo prostornino.
~ To je Tilnova napaka: ploščina in prostornina ne rasteta tako kot rob.
+ Kocka $B$ ima $4$-krat večjo površino in $8$-krat večjo prostornino.
- Kocka $B$ ima $8$-krat večjo površino in $4$-krat večjo prostornino.
~ Zamenjal si: ploskev ima dve meri ($2 \cdot 2 = 4$), prostornina tri ($2 \cdot 2 \cdot 2 = 8$).
> Kocka $A$: $P = 54\,\text{cm}^2$, $V = 27\,\text{cm}^3$. Kocka $B$: $P = 216\,\text{cm}^2$, $V = 216\,\text{cm}^3$. Res $216 : 54 = 4$ in $216 : 27 = 8$.

? Na sliki je mreža kvadra. Stranica kvadratka mreže meri $1\,\text{cm}$. Kolikšna je prostornina kvadra v $\text{cm}^3$?
:::risba skica
opis: Mreža kvadra na kvadratni mreži s kvadratki po en centimeter. Na sredini je pravokotnik 3 krat 2 (spodaj). Pod njim je pravokotnik 3 krat 1 (spredaj), nad njim pravokotnik 3 krat 1 (zadaj), nad tem pravokotnik 3 krat 2 (zgoraj). Levo in desno od srednjega pravokotnika sta pravokotnika 1 krat 2.
območje: 0; 0 .. 5; 6
mreža: da
pravokotnik: 1; 0 .. 4; 1
pravokotnik: 1; 1 .. 4; 3
pravokotnik: 1; 3 .. 4; 4
pravokotnik: 1; 4 .. 4; 6
pravokotnik: 0; 1 .. 1; 3
pravokotnik: 4; 1 .. 5; 3
napis: 2,5; 2 | spodaj
napis: 2,5; 5 | zgoraj
:::
= 6 cm³
~ 22 | To je površina: ploščina vseh šestih pravokotnikov. Prostornina je dolžina krat širina krat višina.
~ 12 | Za višino si vzel $2$. Višina je krajša stranica ozkega pravokotnika tik pod dnom, to je $1\,\text{cm}$.
> Dno meri $3\,\text{cm}$ krat $2\,\text{cm}$, višina je $1\,\text{cm}$ (ozka pravokotnika tik pod dnom in tik nad njim, sprednja in zadnja ploskev, sta visoka en kvadratek). $V = 3 \cdot 2 \cdot 1 = 6\,\text{cm}^3$.

? V posodo gre $2500\,\text{cm}^3$ vode. Koliko litrov je to?
- $2500\,\text{l}$
~ Pozabil si pretvoriti: $\text{cm}^3$ niso litri.
- $25\,\text{l}$
~ Delil si s $100$ kot pri ploščinah. Pri prostornini delimo s $1000$.
+ $2{,}5\,\text{l}$
- $250\,\text{l}$
~ Delil si z $10$ kot pri dolžinah. Pri prostornini delimo s $1000$.
> $1\,\text{l} = 1\,\text{dm}^3 = 1000\,\text{cm}^3$, zato je $2500\,\text{cm}^3 = 2{,}5\,\text{dm}^3 = 2{,}5\,\text{l}$.

<<RACUN
vrednost: 6*5^2 | 150
vrednost: 5^3 | 125
vrednost: 2*(8*5+8*3+5*3) | 158
vrednost: 8*5*3 | 120
vrednost: 80*40+2*80*50+2*40*50 | 15200
vrednost: 80*40*35/1000 | 112
vrednost: 720/(16*9) | 5
vrednost: 2*(16*9+16*5+9*5) | 538
vrednost: 5*4*3 | 60
vrednost: 6*4^2/(6*2^2) | 4
vrednost: 4^3/2^3 | 8
vrednost: 2*(40*30+40*20+30*20) | 5200
vrednost: 2*(5*4+5*2+4*2) | 76
vrednost: 3*2*1 | 6
vrednost: 2500/1000 | 2.5
>>

:::simboli
a | dolžina kvadra (rob kocke) | | | pri kocki so vsi robovi enaki: $a = b = c$
b | širina kvadra | |
c | višina kvadra | | | v primeru 4: $c = V : (a \cdot b)$
h | višina vode v akvariju | | | manjša od višine akvarija $c$
P | površina telesa | P = 2 \cdot (a \cdot b + a \cdot c + b \cdot c) | | kocka: $P = 6 \cdot a^2$
V | prostornina telesa | V = a \cdot b \cdot c | | kocka: $V = a^3$
:::
