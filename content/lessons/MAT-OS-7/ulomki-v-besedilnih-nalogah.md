---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ornitologi (raziskovalci ptic) so jeseni v parku obročkali ptice. Sinic je bilo $18$, kar je $\dfrac{3}{8}$ vseh obročkanih ptic. Gal iz tvojega razreda hitro izračuna: »Vseh ptic je $\dfrac{3}{8}$ od $18$, to je $6{,}75$.«

Že brez računanja vidiš, da nekaj ni v redu: ptic ne more biti $6{,}75$. Gal je **del** zamenjal s **celoto**.

V besedilnih nalogah ulomek vedno pove, **kolikšen del neke celote** mislimo. Naloge so v glavnem dveh vrst:

- poznaš celoto in iščeš njen **del** (koliko dni v juniju je deževalo, če je deževalo $\dfrac{2}{5}$ dni),
- poznaš del in iščeš **celoto** (koliko je vseh ptic, če $\dfrac{3}{8}$ vseh pomeni $18$ sinic).

Obe vrsti sta si podobni, a se ju lotiš drugače. Ko razliko vidiš, Galove napake ne ponoviš.

## Razlaga

**1. Celota in del.** V vsaki nalogi najprej poišči **celoto**: to je količina, ki ji ustreza število $1$. Narišemo jo kot cel trak, pravokotnik, ki ga delimo na enake dele. Ulomek $\dfrac{a}{b}$ pove, da celoto razdelimo na $b$ enakih delov in vzamemo $a$ takih delov.

- Imenovalec $b$ pove, na koliko enakih delov razdelimo celoto.
- Števec $a$ pove, koliko teh delov vzamemo.

**2. Del celote (to že znaš).** Ko iščeš $\dfrac{a}{b}$ od celote $c$, celoto razdeliš na $b$ enakih delov in vzameš $a$ delov:

$$\frac{a}{b} \text{ od } c = c : b \cdot a = \frac{a}{b} \cdot c$$

Beseda »od« pri ulomkih pomeni **množenje**. Na primer $\dfrac{3}{4}$ od $28$ je $28 : 4 \cdot 3 = 7 \cdot 3 = 21$.

**3. Celota iz dela (novo).** Pri Galovi nalogi je drugače: celote ne poznamo, poznamo pa del. Trak vseh ptic razdelimo na $8$ enakih delov. Sinice so $3$ deli in skupaj merijo $18$:

:::risba skica
opis: Trak iz 8 enakih delov predstavlja vse obročkane ptice. Prvi 3 deli so modri, nad njimi piše »sinice: 18«, v vsakem od njih piše 6. Ostalih 5 delov je praznih. Pod trakom piše »vse ptice: 8 delov = ?«.
območje: 0; 0 .. 8; 3
pravokotnik: 0; 1 .. 1; 2 | modra
pravokotnik: 1; 1 .. 2; 2 | modra
pravokotnik: 2; 1 .. 3; 2 | modra
pravokotnik: 3; 1 .. 4; 2
pravokotnik: 4; 1 .. 5; 2
pravokotnik: 5; 1 .. 6; 2
pravokotnik: 6; 1 .. 7; 2
pravokotnik: 7; 1 .. 8; 2
napis: 0,5; 1,5 | 6 | sredina
napis: 1,5; 1,5 | 6 | sredina
napis: 2,5; 1,5 | 6 | sredina
napis: 1,5; 2,5 | sinice: 18 | sredina
napis: 4; 0,4 | vse ptice: 8 delov = ? | sredina
:::

:::premisli
Preden računaš: bo vseh ptic več ali manj kot $18$? Zakaj?
---
Več. Sinice so le $3$ deli od $8$, celota pa ima vseh $8$ delov. Ker je $\dfrac{3}{8}$ manj kot $1$, je del manjši od celote. Galov rezultat $6{,}75$ je manjši od $18$, zato je gotovo napačen.
:::

En del je $18 : 3 = 6$ ptic, celota ($8$ delov) pa $6 \cdot 8 = 48$ ptic. Na splošno: če je $\dfrac{a}{b}$ celote enako $d$, potem $a$ delov skupaj meri $d$. En del meri $d : a$, celota ($b$ delov) pa

$$\text{celota} = d : a \cdot b = d : \frac{a}{b}$$

Obe vrsti nalog postavimo drugo ob drugo:

| | Del celote | Celota iz dela |
|---|---|---|
| Poznaš | celoto $c$ | del $d$ |
| En del | $c : b$ | $d : a$ |
| Rezultat | en del $\cdot\, a$ | en del $\cdot\, b$ |
| Ulomek | $\cdot \dfrac{a}{b}$ | $: \dfrac{a}{b}$ |

Pri obeh najprej izračunaš en del. Razlika je v tem, s katerim številom deliš in s katerim množiš. Ko iščeš del, deliš z imenovalcem, ko iščeš celoto, pa s števcem. Pri ulomku, manjšem od $1$, je del manjši od celote. Po tem hitro preveriš rezultat.

**4. Ostanek.** Če od celote vzameš $\dfrac{a}{b}$, ostane

$$1 - \frac{a}{b} = \frac{b - a}{b}$$

celote. Če se je $\dfrac{1}{3}$ snega že stopilo, je še $\dfrac{2}{3}$ snega.

**5. Del ostanka ali del celote?** Spet dve podobni besedni zvezi z različnim pomenom. »$\dfrac{1}{4}$ celote« se nanaša na prvotno celoto. Pri »$\dfrac{1}{4}$ **ostanka**« (ali **preostanka**) pa postane ostanek nova celota.

:::premisli
Kaj je več: $\dfrac{1}{4}$ celote ali $\dfrac{1}{4}$ ostanka (ko je ostanek $\dfrac{2}{3}$ celote)? Napovej, nato preveri z ulomkoma.
---
Več je $\dfrac{1}{4}$ celote. Ostanek je manjši od celote, zato je tudi njegova četrtina manjša: $\dfrac{1}{4} = \dfrac{3}{12}$, $\dfrac{1}{6} = \dfrac{2}{12}$.
:::

Izračunajmo. Če je ostanek $\dfrac{2}{3}$ celote, je $\dfrac{1}{4}$ ostanka

$$\frac{1}{4} \cdot \frac{2}{3} = \frac{2}{12} = \frac{1}{6} \text{ prvotne celote.}$$

**6. Kako se lotiš naloge.** Pomagaj si s temi koraki:

1. Preberi nalogo in ugotovi, kaj je celota.
2. Izpiši podatke: ulomke in znane količine z enotami.
3. Ugotovi, ali iščeš del ali celoto.
4. Nariši trak in ga razdeli na toliko delov, kolikor kaže imenovalec.
5. Izračunaj vrednost enega dela, nato iskano količino.
6. Preveri rezultat v besedilu in zapiši odgovor v stavku.

V simulaciji spodaj (»Trakovni prikaz za besedilne naloge«) nastavi imenovalec $8$, števec $3$ in znani del $18$. Opazuj, kako trak pokaže en del $6$ in celoto $48$. Nato povečaj števec na $6$: celota se zmanjša, ker isti znani del zdaj pomeni več delov.

## Rešeni primeri

### Primer 1 (lažji)

Junij ima $30$ dni. Deževalo je $\dfrac{2}{5}$ junijskih dni. Koliko dni je deževalo?

**Podatki:** celota: $30$ dni; deževnih je $\dfrac{2}{5}$ dni
**Iščemo:** število deževnih dni

:::formula
Del celote: $\dfrac{a}{b}$ od $c$ $= c : b \cdot a$
:::

**Rešitev:**

1. Celota je $30$ dni. Razdelimo jo na $5$ enakih delov: $30 : 5 = 6$. En del je $6$ dni.
2. Vzamemo $2$ dela: $6 \cdot 2 = 12$.
3. Preverimo z množenjem ulomka: $\dfrac{2}{5} \cdot 30 = \dfrac{60}{5} = 12$.
4. Odgovor: v juniju je deževalo $12$ dni.

### Primer 2 (srednji)

Marko je prebral $\dfrac{2}{5}$ knjige, kar je $96$ strani. Koliko strani ima knjiga? Koliko strani mora še prebrati?

**Podatki:** prebrani del: $\dfrac{2}{5}$ knjige; to je $96$ strani
**Iščemo:** število vseh strani knjige in število strani, ki jih mora še prebrati

:::formula
Celota iz dela: če je $\dfrac{a}{b}$ celote enako $d$, je celota $d : a \cdot b$. Ostanek je $1 - \dfrac{a}{b}$ celote.
:::

**Rešitev:**

1. Knjigo (celoto) narišemo kot trak s $5$ enakimi deli. Dva dela skupaj merita $96$ strani.
2. En del: $96 : 2 = 48$ strani.
3. Celota ima $5$ delov: $48 \cdot 5 = 240$ strani.
4. Ostanejo mu $1 - \dfrac{2}{5} = \dfrac{3}{5}$ knjige, to so $3$ deli: $48 \cdot 3 = 144$ strani.
5. Preverimo: $96 + 144 = 240$.
6. Odgovor: knjiga ima $240$ strani, Marko mora prebrati še $144$ strani.

### Primer 3 (težji)

Ana je $\dfrac{1}{3}$ žepnine porabila za kino, nato $\dfrac{1}{4}$ ostanka za knjigo. Ostalo ji je še $18$ €. Koliko žepnine je imela na začetku?

**Podatki:** za kino: $\dfrac{1}{3}$ žepnine; za knjigo: $\dfrac{1}{4}$ ostanka; na koncu ostane $18$ €
**Iščemo:** začetno žepnino

:::formula
Ostanek: $1 - \dfrac{a}{b}$; del ostanka: $\dfrac{1}{4} \cdot \text{ostanek}$; celota iz dela: $d : \dfrac{a}{b}$
:::

**Rešitev:**

1. Po kinu ostane $1 - \dfrac{1}{3} = \dfrac{2}{3}$ žepnine.
2. Za knjigo porabi $\dfrac{1}{4}$ ostanka: $\dfrac{1}{4} \cdot \dfrac{2}{3} = \dfrac{2}{12} = \dfrac{1}{6}$ žepnine.
3. Na koncu ostane $\dfrac{2}{3} - \dfrac{1}{6} = \dfrac{4}{6} - \dfrac{1}{6} = \dfrac{3}{6} = \dfrac{1}{2}$ žepnine.
4. Polovica žepnine je $18$ €, zato je cela žepnina $18 : \dfrac{1}{2} = 18 \cdot 2 = 36$, torej $36$ €.
5. Preverimo: kino $36 : 3 = 12$ €, ostane $24$ €; knjiga $24 : 4 = 6$ €, ostane $24 - 6 = 18$ €. Drži.
6. Odgovor: Ana je imela na začetku $36$ € žepnine.

### Primer 4 – zdaj ti

V gozdu raste bukev na $\dfrac{3}{5}$ površine, smreka pa na $\dfrac{1}{2}$ ostanka. Smreka pokriva $40\,\text{ha}$. Kolikšna je površina gozda?

**Podatki:** bukev: $\dfrac{3}{5}$ površine; smreka: $\dfrac{1}{2}$ ostanka; smreka pokriva $40\,\text{ha}$
**Iščemo:** površino celega gozda

:::formula
Ostanek: $1 - \dfrac{a}{b}$; del ostanka: $\dfrac{1}{2} \cdot \text{ostanek}$; celota iz dela: $d : \dfrac{a}{b}$
:::

**Rešitev:**

1. Po bukvi ostane $1 - \dfrac{3}{5} = \dfrac{2}{5}$ površine.
2. Smreka pokriva polovico ostanka: $\dfrac{1}{2} \cdot \dfrac{2}{5} = \dfrac{1}{5}$ površine gozda.
3. Izračunaj sam celoto, nato preveri:

:::premisli
Kolikšna je površina gozda, če je $\dfrac{1}{5}$ površine $40\,\text{ha}$?
---
En del od petih je $40\,\text{ha}$, zato je celota $40 \cdot 5 = 200$, torej $200\,\text{ha}$. Preverba: bukev $\dfrac{3}{5} \cdot 200 = 120\,\text{ha}$, ostane $80\,\text{ha}$, polovica tega je $40\,\text{ha}$.
:::

## Pogoste napake

- **Del ostanka računaš od celote.** Pri Ani bi napačno računal $\dfrac{1}{4}$ od cele žepnine. Beseda »ostanka« pove, da je nova celota tisto, kar je ostalo. Najprej izračunaj ostanek (tu $\dfrac{2}{3}$), nato vzemi njegov del: $\dfrac{1}{4} \cdot \dfrac{2}{3}$. Zato tudi $\dfrac{1}{3}$ žepnine in $\dfrac{1}{4}$ ostanka nista skupaj $\dfrac{7}{12}$ žepnine: oba dela najprej izrazi kot del iste celote ($\dfrac{1}{3}$ in $\dfrac{1}{6}$), šele nato seštevaj.
- **Pri iskanju celote množiš z ulomkom.** Če je $\dfrac{2}{5}$ knjige $96$ strani, račun $\dfrac{2}{5} \cdot 96$ ni pravilen, ker bi dobil manj kot $96$, celota pa mora biti večja od svojega dela. Pravilno je $96 : \dfrac{2}{5} = 96 : 2 \cdot 5 = 240$.
- **Primerjaš le ulomka.** $\dfrac{3}{4}$ je več kot $\dfrac{2}{3}$, a $\dfrac{3}{4}$ od $20\,\text{l}$ je $15\,\text{l}$, $\dfrac{2}{3}$ od $24\,\text{l}$ pa $16\,\text{l}$. Večji ulomek pomeni večji del le pri isti celoti. Pri različnih celotah izračunaj oba dela in primerjaj količini.
- **Odgovoriš na napačno vprašanje.** Naloga vpraša, koliko ostane, ti pa izračunaš, koliko je porabljeno. Na koncu še enkrat preberi vprašanje in preveri, ali tvoj rezultat odgovarja nanj.
- **Zamenjaš števec in imenovalec.** Ko iščeš celoto, znani del deliš s števcem in množiš z imenovalcem. Ko iščeš del, celoto deliš z imenovalcem in množiš s števcem. Pomagaj si s trakom: imenovalec je vedno število vseh delov traku.

## Povzetek

- Celota je količina, ki ji ustreza število $1$ (cel trak).
- Del celote: $\dfrac{a}{b}$ od $c$ je $c : b \cdot a = \dfrac{a}{b} \cdot c$.
- Celota iz dela: če je $\dfrac{a}{b}$ celote enako $d$, je celota $d : a \cdot b = d : \dfrac{a}{b}$.
- Ostanek po odvzemu $\dfrac{a}{b}$ je $1 - \dfrac{a}{b}$ celote.
- Del ostanka je nova celota: $\dfrac{p}{q}$ ostanka je $\dfrac{p}{q} \cdot \text{ostanek}$.
- Vedno najprej izračunaj vrednost enega dela, rezultat preveri in odgovori v stavku.

## Drugače: Na sliki

Celoto nariši kot dolg pravokotnik, **trak**. Recimo, da je trak dolg $12$ kvadratkov v zvezku, ker se $12$ da razdeliti na $2$, $3$, $4$ in $6$ enakih delov.

Za Anino žepnino trak najprej razdeli na $3$ enake dele po $4$ kvadratke in prvi del pobarvaj z rdečo (kino). Ostanejo $8$ kvadratki. Ta ostanek razdeli na $4$ enake dele po $2$ kvadratka in en del pobarvaj z modro (knjiga). Nepobarvanih ostane $6$ kvadratkov od $12$, torej polovica traku.

Pod nepobarvani del napiši $18$ €. Ker je to $6$ kvadratkov, je en kvadratek vreden $3$ €, cel trak pa $12 \cdot 3 = 36$ €. Slika ti pokaže, kaj je celota in kaj ostanek, še preden začneš računati.

## Drugače: Iz vsakdanjega življenja

Predstavljaj si pico, razrezano na $8$ enakih kosov. Če poješ $\dfrac{3}{8}$ pice, poješ $3$ kose. Če je pica tehtala $800$ g, je en kos $800 : 8 = 100$ g, tri kose pa $300$ g. To je **del celote**.

Zdaj obrni zgodbo. Prijatelj ti pove, da je pojedel $\dfrac{3}{8}$ pice in da je to bilo $360$ g. Koliko je tehtala cela pica? Trije kosi so $360$ g, en kos $120$ g, osem kosov pa $960$ g. To je **celota iz dela**.

Podobno je pri receptu: če recept za torto zahteva $\dfrac{3}{4}$ vrečke sladkorja in ima vrečka $1000$ g, potrebuješ $750$ g. Ulomek ima smisel šele, ko veš, od katere celote ga vzameš.

## Drugače: Korak za korakom s številkami

Vzemimo nalogo: »$\dfrac{5}{6}$ poti je $45$ km. Kolikšna je cela pot in koliko je še ostane?«

1. Celota je cela pot. Ne poznamo je.
2. Imenovalec $6$: pot razdelimo na $6$ enakih delov.
3. Števec $5$: $5$ delov skupaj meri $45$ km.
4. En del: $45 : 5 = 9$ km.
5. Cela pot: $6 \cdot 9 = 54$ km.
6. Ostanek: $1 - \dfrac{5}{6} = \dfrac{1}{6}$ poti, to je en del, torej $9$ km.
7. Preverba: $45 + 9 = 54$ km. Drži.

Pri iskanju dela je vrstni red podoben, le da celoto poznaš: celoto deliš z imenovalcem, da dobiš en del, in ga pomnožiš s števcem. Na primer $\dfrac{2}{9}$ od $63$: $63 : 9 = 7$, $7 \cdot 2 = 14$.

## Drugače: Bolj natančno

Ulomek v besedilni nalogi deluje kot **operator**: količino pomnoži. Zapis »$\dfrac{a}{b}$ od $c$« pomeni zmnožek $\dfrac{a}{b} \cdot c$. Ker je množenje zamenljivo, je vseeno, ali najprej deliš z $b$ in nato množiš z $a$ ali obratno. Najprej deli, ker so tako števila manjša.

Iskanje celote je obratna naloga. Če neznano celoto označimo s $c$, velja $\dfrac{a}{b} \cdot c = d$. Množenje z ulomkom razveljavimo z deljenjem z istim ulomkom, deljenje z ulomkom pa je množenje z obratno vrednostjo:

$$c = d : \frac{a}{b} = d \cdot \frac{b}{a}$$

Če je ulomek manjši od $1$, je del manjši od celote. Če je ulomek večji od $1$, na primer $\dfrac{5}{4}$, je »del« večji od celote: $\dfrac{5}{4}$ od $40$ je $50$. Del dela izračunaš z zmnožkom ulomkov: $\dfrac{1}{4}$ od $\dfrac{2}{3}$ celote je $\dfrac{1}{6}$ celote.

## Preveri se

? Katera trditev je pravilna?
- Ko iščeš celoto, znani del pomnožiš z ulomkom.
~ Tako dobiš manj od znanega dela, celota pa mora biti večja od svojega dela (pri ulomku, manjšem od $1$).
- Imenovalec pove, koliko delov celote vzamemo.
~ Zamenjal si vlogi: imenovalec pove, na koliko enakih delov razdelimo celoto, števec pa, koliko jih vzamemo.
+ Ko iščeš celoto, znani del deliš s števcem in rezultat pomnožiš z imenovalcem.
- $\dfrac{1}{4}$ ostanka je enako kot $\dfrac{1}{4}$ celote.
~ Ostanek je manjši od celote, zato je tudi njegova četrtina manjša.
> Znani del deliš s števcem, da dobiš en del, nato množiš z imenovalcem, ker ima celota toliko delov.

? Na travniku so našteli $14$ citrončkov. To je $\dfrac{2}{7}$ vseh metuljev na travniku. Koliko metuljev je bilo na travniku?
= 49
~ 4 | Izračunal si $\dfrac{2}{7}$ od $14$, a $14$ je del, ne celota.
~ 28 | Pomnožil si $14 \cdot 2$. Deliti moraš s števcem in množiti z imenovalcem.
~ 7 | To je en del. Celota ima $7$ takih delov.
> En del je $14 : 2 = 7$ metuljev, celota ima $7$ delov: $7 \cdot 7 = 49$ metuljev.

? Naloga: »$\dfrac{3}{5}$ poti do planinske koče je $12\,\text{km}$. Kako dolga je pot?« Tilen je rešil takole: 1. en del: $12 : 5 = 2{,}4$; 2. pot: $2{,}4 \cdot 3 = 7{,}2$, torej $7{,}2\,\text{km}$. Kje je napaka?
- Le v 2. koraku: množiti bi moral s $5$.
~ Potem bi dobil $2{,}4 \cdot 5 = 12\,\text{km}$, celota pa bi bila enaka delu. Napaka je že v 1. koraku.
- Rešitev je pravilna.
~ Pot $7{,}2\,\text{km}$ je krajša od $12\,\text{km}$, ki so le del poti. Celota ne more biti manjša od svojega dela.
+ Zamenjal je števec in imenovalec: deliti bi moral s $3$, množiti s $5$.
- Deliti bi moral s $15$, ker je $3 \cdot 5 = 15$.
~ Imenovalec in števec ne zmnožiš. Trije deli so $12\,\text{km}$, zato en del dobiš z deljenjem s $3$.
> En del je $12 : 3 = 4\,\text{km}$, pot ima $5$ delov: $4 \cdot 5 = 20\,\text{km}$.

? Trakova kažeta porabo deževnice iz dveh sodov. Iz katerega soda so porabili več litrov vode?
:::risba skica
opis: Dva trakova enake dolžine. Zgornji trak je sod A z 20 litri deževnice, razdeljen na 4 enake dele; 3 deli so pobarvani in označeni »porabljeno«. Spodnji trak je sod B s 24 litri deževnice, razdeljen na 3 enake dele; 2 dela sta pobarvana in označena »porabljeno«.
območje: 0; 0 .. 12; 6
pravokotnik: 0; 3,5 .. 3; 4,5 | modra
pravokotnik: 3; 3,5 .. 6; 4,5 | modra
pravokotnik: 6; 3,5 .. 9; 4,5 | modra
pravokotnik: 9; 3,5 .. 12; 4,5
pravokotnik: 0; 1 .. 4; 2 | modra
pravokotnik: 4; 1 .. 8; 2 | modra
pravokotnik: 8; 1 .. 12; 2
napis: 4,5; 4 | porabljeno | sredina
napis: 4; 1,5 | porabljeno | sredina
napis: 6; 5,3 | sod A: 20 l | sredina
napis: 6; 2,8 | sod B: 24 l | sredina
:::
- Iz soda A, ker je $\dfrac{3}{4}$ več kot $\dfrac{2}{3}$.
~ Ulomek je res večji, a se nanaša na manjšo celoto. Primerjaš litre: $15\,\text{l}$ in $16\,\text{l}$.
- Iz obeh enako, ker v obeh sodih ostane en del.
~ En del ni v obeh sodih enak: v sodu A je $5\,\text{l}$, v sodu B $8\,\text{l}$.
+ Iz soda B.
> Iz soda A so porabili $\dfrac{3}{4} \cdot 20 = 15\,\text{l}$, iz soda B pa $\dfrac{2}{3} \cdot 24 = 16\,\text{l}$. Več so porabili iz soda B.

? V sodu je $120\,\text{l}$ deževnice. Za zalivanje vrta porabiš $\dfrac{2}{5}$ vode, nato $\dfrac{1}{2}$ ostanka za pranje kolesa. Koliko litrov vode ostane v sodu?
= 36 l
~ 12 | Polovico si vzel od vseh $120\,\text{l}$, ne od ostanka $72\,\text{l}$.
~ 72 | To ostane po zalivanju. Pozabil si še na pranje kolesa.
~ 48 | To je voda za zalivanje, vprašanje pa sprašuje, koliko ostane.
> Za zalivanje porabiš $120 : 5 \cdot 2 = 48\,\text{l}$, ostane $72\,\text{l}$. Polovica ostanka je $36\,\text{l}$, zato v sodu ostane $36\,\text{l}$.

:::simboli
a | števec | | | koliko delov vzamemo
b | imenovalec | | | na koliko enakih delov razdelimo celoto
c | celota | c = d : \frac{a}{b} = d \cdot \frac{b}{a} |
d | znani del (vrednost $\frac{a}{b}$ celote) | d = \frac{a}{b} \cdot c |
:::

<<RACUN
vrednost: 18/3*8 | 48
vrednost: 30/5*2 | 12
vrednost: 96/2*5 | 240
vrednost: 96/2*3 | 144
vrednost: (1-1/3)*(1-1/4) | 1/2
vrednost: 18/(1/2) | 36
vrednost: 1/2*(1-3/5) | 1/5
vrednost: 40/(1/5) | 200
vrednost: 14/2*7 | 49
vrednost: 12/3*5 | 20
vrednost: 3/4*20 | 15
vrednost: 2/3*24 | 16
vrednost: 120*(1-2/5)*(1-1/2) | 36
>>
