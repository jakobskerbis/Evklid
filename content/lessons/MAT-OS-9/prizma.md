---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na pultu turističnega urada stoji lep, raven kup zloženih zemljevidov. Vsak zložen zemljevid meri $20\,\text{cm} \times 10\,\text{cm}$, kup je visok $15\,\text{cm}$. Mimoidoči se ob kup zaleti in ga nagne: vsak zemljevid zdrsne malo dlje od tistega pod njim. Kup je zdaj poševen, njegovi stranski robovi so dolgi $18\,\text{cm}$.

Ali nagnjeni kup zavzame več prostora? Na prvi pogled da, saj je »daljši«. Pa vendar ne. Zemljevidov je toliko kot prej in nobeden se ni povečal. Oba kupa imata prostornino $200\,\text{cm}^2 \cdot 15\,\text{cm} = 3000\,\text{cm}^3$.

Raven in nagnjen kup sta **prizmi**. Prizme so tudi kovček, škatla za čevlje, šotor in kartonski tulec za zemljevid. Iz površine prizme izveš, koliko blaga, kartona ali pločevine potrebuješ. Iz prostornine izveš, koliko gre vanjo. Vse, kar že znaš o kvadru, bomo razširili na poljubno prizmo.

## Razlaga

**1. Prva skušnjava: »daljši rob, več prostora«.** Zakaj je zgornji račun pravilen? Kup si predstavljaj kot plasti. Vsaka plast (zemljevid) ima ploščino $200\,\text{cm}^2$, plasti pa je toliko, kolikor jih gre do višine $15\,\text{cm}$. Ko kup nagnemo, se plasti le premaknejo vstran. Nobena ne izgine in nobena ne zraste. Odločilna je torej **višina** kupa, ne dolžina poševnega roba. Kdor množi z $18\,\text{cm}$, dobi napačnih $3600\,\text{cm}^3$.

**2. Kaj je prizma.** Prizma je geometrijsko telo z dvema **osnovnima ploskvama**. To sta skladna mnogokotnika v vzporednih ravninah. Ostale ploskve so **stranske ploskve**; to so paralelogrami. Vse stranske ploskve skupaj imenujemo **plašč**. Robove osnovnih ploskev imenujemo **osnovni robovi**, robove med dvema stranskima ploskvama pa **stranski robovi**. **Višina prizme** $v$ je razdalja med ravninama obeh osnovnih ploskev.

Prizmo poimenujemo po osnovni ploskvi: tristrana (trikotna), štiristrana, petstrana, šeststrana in tako naprej. Kvader je štiristrana prizma.

**3. Pokončna prizma.** Nagnjen kup je **poševna** prizma. Pri **pokončni prizmi** so stranski robovi pravokotni na osnovni ploskvi. Stranske ploskve so zato pravokotniki, vsak stranski rob pa je dolg toliko kot višina $v$. Pokončna prizma, ki ima za osnovno ploskev pravilni mnogokotnik (vse stranice in vsi koti enaki), je **pravilna prizma**. V nadaljevanju računamo s pokončnimi prizmami.

**4. Oznake.**

- $O$ je ploščina osnovne ploskve,
- $o$ je obseg osnovne ploskve,
- $v$ je višina prizme,
- $\mathrm{pl}$ je ploščina plašča,
- $P$ je površina,
- $V$ je prostornina.

**5. Prostornina.** Plasti iz točke 1 dajo pravilo za vsako prizmo, pokončno ali poševno: prostornina je ploščina osnovne ploskve, pomnožena z višino.

$$V = O \cdot v$$

Pri kvadru je $O = a \cdot b$ in $v = c$, zato dobimo že znani $V = a \cdot b \cdot c$.

:::premisli
Kovček z dnom $5\,\text{dm} \times 3\,\text{dm}$ in višino $4\,\text{dm}$ postaviš pokonci, na ploskev $3\,\text{dm} \times 4\,\text{dm}$. Spremenita se $O$ in $v$. Najprej napovej, ali se spremeni tudi prostornina, nato izračunaj $V$ v obeh legah.
---
Ne. Prej je bilo $V = 15 \cdot 4 = 60\,\text{dm}^3$, zdaj je $O = 3 \cdot 4 = 12\,\text{dm}^2$ in $v = 5\,\text{dm}$, torej spet $V = 12 \cdot 5 = 60\,\text{dm}^3$. Kovček je isto telo. Pri kvadru lahko za osnovno ploskev vzameš katerikoli par nasprotnih ploskev, višina je razdalja med njima.
:::

**6. Mreža.** Pokončno prizmo razrežemo po nekaterih robovih in jo razgrnemo v ravnino. Dobimo **mrežo**: dve osnovni ploskvi in plašč, ki je vrsta pravokotnikov drug ob drugem. Pravokotnikov je toliko, kolikor stranic ima osnovna ploskev: tristrana prizma jih ima 3, petstrana 5.

:::risba skica
opis: Mreža pokončne tristrane prizme. V sredini so trije pravokotniki drug ob drugem, široki 3, 4 in 5 enot, vsi visoki 6 enot; to je plašč. Nad in pod srednjim pravokotnikom je po en pravokotni trikotnik s katetama 3 in 4 ter hipotenuzo 5; to sta osnovni ploskvi.
območje: -3; -4 .. 13; 10
enota: 19
pravokotnik: 0; 0 .. 3; 6 | modra
pravokotnik: 3; 0 .. 7; 6 | modra
pravokotnik: 7; 0 .. 12; 6 | modra
lik: 3; 6 -> 7; 6 -> 3; 9 | oranžna
lik: 3; 0 -> 7; 0 -> 3; -3 | oranžna
napis: 1,5; 3 | 3 · 6 | sredina
napis: 5; 3 | 4 · 6 | sredina
napis: 9,5; 3 | 5 · 6 | sredina
napis: 0; 3 | v = 6 | levo
napis: 4; 7 | O | sredina
napis: 4; -1 | O | sredina
napis: 6; -1,8 | o = 3 + 4 + 5 = 12 | desno
:::

**7. Druga skušnjava: »plašč je $O \cdot v$«.** Ker je prostornina $O \cdot v$, se zdi, da je plašč nekaj podobnega. Mreža pokaže, da ni tako. Vsi pravokotniki plašča imajo isto višino $v$, njihove širine pa so stranice osnovne ploskve. Če jih postavimo drugega ob drugega, dobimo en velik pravokotnik s širino $o$ (obseg osnovne ploskve) in višino $v$:

$$\mathrm{pl} = o \cdot v$$

Na risbi je $\mathrm{pl} = 12 \cdot 6 = 72$, kar je res $18 + 24 + 30$. Osnovna ploskev je trikotnik s ploščino $O = \dfrac{3 \cdot 4}{2} = 6$. Produkt $O \cdot v = 6 \cdot 6 = 36$ pa je prostornina te prizme, ne plašč.

**8. Površina.** Površina je ploščina vseh ploskev, torej ploščina mreže:

$$P = 2O + \mathrm{pl}$$

Na risbi je $P = 2 \cdot 6 + 72 = 84$.

:::premisli
Zakaj je v formuli za površino $2O$, v formuli za prostornino pa $O$ samo enkrat?
---
Površina šteje vsako ploskev, ki jo moramo pokriti, osnovni ploskvi pa sta dve (spodnja in zgornja). Pri prostornini $O$ ni ploskev za pokrivanje, ampak ena plast. Plasti zlagamo do višine $v$, zato $O \cdot v$.
:::

**9. Enote.** Plašč in površina sta v kvadratnih enotah ($\text{cm}^2$, $\text{m}^2$), prostornina v kubičnih ($\text{cm}^3$, $\text{m}^3$; $1\,\text{dm}^3 = 1\,\text{l}$). Vse dolžine pred računom izrazi v isti enoti.

## Rešeni primeri

### Primer 1: kovček (lažji)

Kovček ima obliko kvadra. Dno meri $5\,\text{dm} \times 3\,\text{dm}$, kovček je visok $4\,\text{dm}$. Koliko blaga je v njegovi prevleki (površina) in koliko litrov gre vanj?

**Podatki:** $a = 5\,\text{dm}$, $b = 3\,\text{dm}$ (stranici osnovne ploskve), $v = 4\,\text{dm}$
**Iščemo:** površino $P$ in prostornino $V$

:::formula
$O = a \cdot b$, $o = 2(a + b)$, $\mathrm{pl} = o \cdot v$, $P = 2O + \mathrm{pl}$, $V = O \cdot v$
:::

**Rešitev:**

1. Ploščina osnovne ploskve: $O = 5 \cdot 3 = 15\,\text{dm}^2$.
2. Obseg osnovne ploskve: $o = 2 \cdot (5 + 3) = 16\,\text{dm}$, ker ga potrebujemo za plašč.
3. Plašč je pravokotnik z osnovnico $o$ in višino $v$: $\mathrm{pl} = 16 \cdot 4 = 64\,\text{dm}^2$.
4. Površina sta dve osnovni ploskvi in plašč: $P = 2 \cdot 15 + 64 = 94\,\text{dm}^2$.
5. Prostornina: $V = O \cdot v = 15 \cdot 4 = 60\,\text{dm}^3$, kar je $60\,\text{l}$.
6. Preverimo s formulo za površino kvadra: $P = 2(5 \cdot 3 + 5 \cdot 4 + 3 \cdot 4) = 2 \cdot 47 = 94\,\text{dm}^2$. ✓
7. Odgovor: prevleka ima $94\,\text{dm}^2$ blaga, v kovček gre $60\,\text{l}$.

### Primer 2: tristrana prizma

Osnovna ploskev pokončne prizme je pravokotni trikotnik s katetama $6\,\text{cm}$ in $8\,\text{cm}$. Višina prizme je $12\,\text{cm}$. Izračunaj površino in prostornino.

**Podatki:** kateti $a = 6\,\text{cm}$, $b = 8\,\text{cm}$, višina prizme $v = 12\,\text{cm}$
**Iščemo:** površino $P$ in prostornino $V$

:::formula
$c = \sqrt{a^2 + b^2}$, $O = \dfrac{a \cdot b}{2}$, $\mathrm{pl} = o \cdot v$, $P = 2O + \mathrm{pl}$, $V = O \cdot v$
:::

**Rešitev:**

1. Za obseg potrebujemo vse tri stranice, zato s Pitagorovim izrekom izračunamo hipotenuzo: $c = \sqrt{6^2 + 8^2} = \sqrt{100} = 10\,\text{cm}$.
2. Obseg: $o = 6 + 8 + 10 = 24\,\text{cm}$.
3. Ploščina osnovne ploskve (kateti sta pravokotni, zato je ena višina na drugo): $O = \dfrac{6 \cdot 8}{2} = 24\,\text{cm}^2$.
4. Plašč: $\mathrm{pl} = o \cdot v = 24 \cdot 12 = 288\,\text{cm}^2$. To so trije pravokotniki $6 \times 12$, $8 \times 12$ in $10 \times 12$; preverimo: $72 + 96 + 120 = 288$. ✓
5. Površina: $P = 2 \cdot 24 + 288 = 336\,\text{cm}^2$.
6. Prostornina: $V = 24 \cdot 12 = 288\,\text{cm}^3$.
7. Odgovor: površina prizme je $336\,\text{cm}^2$, prostornina $288\,\text{cm}^3$. Da sta števili plašča in prostornine enaki, je naključje; enoti sta različni.

### Primer 3: lopa (težji, zadnji korak naredi sam)

Lopa ima obliko pokončne tristrane prizme, ki leži na eni od stranskih ploskev (tleh). Zatrep (osnovna ploskev) je enakokrak trikotnik z osnovnico $6\,\text{m}$ in krakoma $5\,\text{m}$. Lopa je dolga $8\,\text{m}$. Koliko $\text{m}^3$ zraka je v lopi in koliko $\text{m}^2$ pločevine potrebujemo za streho in oba zatrepa (brez tal)?

**Podatki:** osnovnica zatrepa $a = 6\,\text{m}$, kraka $b = 5\,\text{m}$, dolžina lope $v = 8\,\text{m}$
**Iščemo:** prostornino $V$ in ploščino strehe in zatrepov skupaj

:::formula
$h = \sqrt{b^2 - \left(\dfrac{a}{2}\right)^2}$, $O = \dfrac{a \cdot h}{2}$, $V = O \cdot v$
:::

**Rešitev:**

1. **Skica.** Trikotnik stoji na osnovnici. Prizma leži na boku, zato je dolžina lope $8\,\text{m}$ višina prizme $v$.
2. **Višina trikotnika.** Višina na osnovnico razpolovi osnovnico. Nastane pravokotni trikotnik s hipotenuzo $5\,\text{m}$ in katetama $3\,\text{m}$ ter $h$: $h = \sqrt{5^2 - 3^2} = \sqrt{16} = 4\,\text{m}$.
3. **Ploščina zatrepa:** $O = \dfrac{6 \cdot 4}{2} = 12\,\text{m}^2$.
4. **Prostornina:** $V = O \cdot v = 12 \cdot 8 = 96\,\text{m}^3$.
5. **Pločevina.** Streha sta dva pravokotnika $5\,\text{m} \times 8\,\text{m}$. Tretji pravokotnik plašča ($6\,\text{m} \times 8\,\text{m}$) so tla, ki jih ne štejemo. Zatrepa sta dva trikotnika s ploščino $O$. Izračunaj sam:

:::premisli
Koliko $\text{m}^2$ pločevine potrebujemo za streho in oba zatrepa?
---
Streha: $2 \cdot 5 \cdot 8 = 80\,\text{m}^2$. Zatrepa: $2 \cdot 12 = 24\,\text{m}^2$. Skupaj $80 + 24 = 104\,\text{m}^2$. V lopi je $96\,\text{m}^3$ zraka.
:::

## Pogoste napake

- **Poševni rob namesto višine.** »Nagnjen kup zemljevidov ima daljše robove, torej več prostornine.« Plasti se pri nagibu le premaknejo, zato prostornina ostane enaka. V $V = O \cdot v$ vedno vstavi višino, to je razdaljo med osnovnima ploskvama, ne dolžine poševnega roba.
- **Ena osnovna ploskev premalo.** »Površina je osnovna ploskev in plašč.« Prizma ima spodnjo *in* zgornjo osnovno ploskev. Pravilno je $P = 2O + \mathrm{pl}$.
- **Ploščina namesto obsega pri plašču.** »Plašč je $O \cdot v$, kot prostornina.« Širine pravokotnikov plašča so stranice osnovne ploskve, zato je plašč $o \cdot v$. Ploščino $O$ potrebuješ pri prostornini, obseg $o$ pri plašču.
- **Vedno štirje pravokotniki v plašču.** Kdor je navajen kvadra, nariše štiri stranske ploskve tudi pri tristrani prizmi. Pravokotnikov je toliko, kolikor stranic ima osnovna ploskev.
- **Površina in prostornina zamešani.** Obe izračunaš iz istih podatkov, zato ju je lahko zamenjati. Preveri enoto: površina je v kvadratnih enotah ($\text{cm}^2$), prostornina v kubičnih ($\text{cm}^3$). Pri trikotni osnovni ploskvi ne pozabi deliti z $2$: $O = \dfrac{a \cdot h}{2}$.

## Povzetek

- Prizma ima dve skladni, vzporedni osnovni ploskvi; stranske ploskve skupaj tvorijo plašč. Pri pokončni prizmi so stranske ploskve pravokotniki.
- Višina prizme $v$ je razdalja med osnovnima ploskvama, ne dolžina poševnega roba.
- Mreža pokončne prizme: dve osnovni ploskvi in plašč (toliko pravokotnikov, kolikor stranic ima osnovna ploskev).
- Plašč: $\mathrm{pl} = o \cdot v$. Površina: $P = 2O + \mathrm{pl}$.
- Prostornina: $V = O \cdot v$ (velja tudi za poševno prizmo).
- Pri nalogah najprej izračunaj $O$ in $o$ osnovne ploskve, nato plašč, površino in prostornino.

## Drugače: Kot zgodba

Nika pred potovanjem izdeluje kartonsko škatlo za zemljevide v obliki tristrane prizme. Zatrep je pravokotni trikotnik s katetama $3\,\text{dm}$ in $4\,\text{dm}$ ter hipotenuzo $5\,\text{dm}$, škatla je dolga $10\,\text{dm}$.

»Kartona potrebujem $O \cdot v$,« si reče. Trikotnik ima ploščino $\dfrac{3 \cdot 4}{2} = 6\,\text{dm}^2$, torej $6 \cdot 10 = 60$. Ko pa izreže trakove za stranice, vidi, da so trije: $3 \times 10$, $4 \times 10$ in $5 \times 10$. Skupaj imajo $30 + 40 + 50 = 120\,\text{dm}^2$, dvakrat toliko, kot je mislila. Trakovi so široki toliko kot stranice trikotnika, ne toliko kot njegova ploščina. Zato je plašč obseg krat dolžina: $12 \cdot 10 = 120\,\text{dm}^2$.

Doda še oba trikotnika in ima $P = 2 \cdot 6 + 120 = 132\,\text{dm}^2$ kartona. Njen prvi račun pa ni bil zaman: $6 \cdot 10 = 60\,\text{dm}^3$ je prostornina škatle, torej $60\,\text{l}$ prostora za zemljevide.

## Drugače: Korak za korakom s številkami

Recept za vsako pokončno prizmo. Primer: osnovna ploskev je enakokraki trapez z vzporednima stranicama $10\,\text{cm}$ in $4\,\text{cm}$ ter krakoma $5\,\text{cm}$, višina prizme je $10\,\text{cm}$. Višina trapeza je $4\,\text{cm}$, ker je $\dfrac{10 - 4}{2} = 3$ in $\sqrt{5^2 - 3^2} = 4$.

| Korak | Kaj računam | Račun | Rezultat |
|---|---|---|---|
| 1 | Ploščina trapeza | $O = \dfrac{(10 + 4) \cdot 4}{2}$ | $28\,\text{cm}^2$ |
| 2 | Obseg trapeza | $o = 10 + 4 + 5 + 5$ | $24\,\text{cm}$ |
| 3 | Plašč | $\mathrm{pl} = 24 \cdot 10$ | $240\,\text{cm}^2$ |
| 4 | Površina | $P = 2 \cdot 28 + 240$ | $296\,\text{cm}^2$ |
| 5 | Prostornina | $V = 28 \cdot 10$ | $280\,\text{cm}^3$ |

Na koncu preveri enote in smiselnost: površina je v $\text{cm}^2$, prostornina v $\text{cm}^3$.

## Drugače: Na sliki

Predstavljaj si škatlo v obliki tristrane prizme, ki jo razrežeš po robovih in razgrneš na mizo. Dobiš:

- v sredini vrsto treh pravokotnikov drug ob drugem (plašč); skupaj so široki toliko, kolikor je obseg osnovne ploskve, visoki pa toliko, kolikor je višina prizme,
- zgoraj in spodaj po en trikotnik (osnovni ploskvi).

Površina je ploščina vseh teh likov skupaj. Če pravokotnike plašča združiš v en velik pravokotnik, ima ta osnovnico $o$ in višino $v$. Zato je plašč natanko $o \cdot v$.

Prostornino si predstavljaj kot **kupček plasti**. Osnovna ploskev je ena zelo tanka plast. Prizma je kupček takih plasti do višine $v$. Večja ko je osnovna ploskev in višji ko je kupček, več prostora zavzame telo.

## Drugače: Bolj natančno

**Zakaj je plašč $o \cdot v$?** Plašč pokončne prizme sestavljajo pravokotniki z isto višino $v$ in širinami $a_1, a_2, \dots, a_n$, ki so stranice osnovne ploskve. Njihova skupna ploščina je

$$a_1 v + a_2 v + \dots + a_n v = (a_1 + a_2 + \dots + a_n)\, v = o \cdot v.$$

**Zakaj je prostornina $O \cdot v$?** Pri kvadru z osnovno ploskvijo $a \times b$ in višino $c$ že veš, da je $V = (a \cdot b) \cdot c = O \cdot v$. Vsako prizmo lahko razrežemo na zelo tanke plasti, vzporedne z osnovno ploskvijo. Vsaka plast je skladna z osnovno ploskvijo, zato ima ploščino $O$. Kvader z isto ploščino osnovne ploskve in isto višino ima na vsaki višini plast z enako ploščino, zato imata obe telesi enako prostornino. To je **Cavalierijevo načelo**: telesi z enako višino, ki imata na vsaki višini preseka z enako ploščino, imata enako prostornino. Isto načelo pove, zakaj ima nagnjeni kup zemljevidov enako prostornino kot raven.

## Preveri se

? Kartonski tulec za zemljevid ima obliko tristrane prizme. Kaj je njegov **plašč**?
- Oba trikotnika na koncih tulca.
~ Trikotnika sta osnovni ploskvi. Plašč so stranske ploskve.
+ Tri pravokotne stranske ploskve skupaj.
- Vseh pet ploskev skupaj.
~ Vse ploskve skupaj so površina. Plašč je površina brez obeh osnovnih ploskev.
> Plašč so vse stranske ploskve skupaj. Pri pokončni tristrani prizmi so to trije pravokotniki.

? Tri telesa razvrsti od najmanjše do največje prostornine. A: kvader $4\,\text{cm} \times 3\,\text{cm} \times 10\,\text{cm}$. B: poševna prizma z osnovno ploskvijo $4\,\text{cm} \times 3\,\text{cm}$, višino $8\,\text{cm}$ in stranskimi robovi $13\,\text{cm}$. C: pokončna prizma, katere osnovna ploskev je pravokotni trikotnik s katetama $6\,\text{cm}$ in $5\,\text{cm}$, z višino $7\,\text{cm}$.
- C, A, B
~ Pri B si množil s stranskim robom $13\,\text{cm}$ ($12 \cdot 13 = 156$). Prostornina je odvisna od višine, ne od poševnega roba.
+ B, C, A
- B, A, C
~ Pri C si pozabil deliti z $2$ ($6 \cdot 5 \cdot 7 = 210$). Ploščina trikotnika je polovica produkta katet.
> $V_A = 12 \cdot 10 = 120\,\text{cm}^3$, $V_B = 12 \cdot 8 = 96\,\text{cm}^3$, $V_C = 15 \cdot 7 = 105\,\text{cm}^3$. Torej B, C, A.

? Pri pokončni prizmi se višina podvoji, osnovna ploskev pa ostane enaka. Kaj se zgodi s prostornino?
- Ostane enaka.
~ Ostane osnovna ploskev, višina pa ne. Dvakrat več plasti pomeni dvakrat več prostora.
+ Podvoji se.
- Poveča se na štirikratnik.
~ Štirikratnik bi dobil, če bi se podvojili obe stranici osnovne ploskve. Tu se podvoji samo en faktor, $v$.
> Prostornina je $V = O \cdot v$. Če se $v$ podvoji, $O$ pa ostane, se podvoji tudi $V$.

? Osnovna ploskev pokončne prizme je pravokotnik $4\,\text{cm} \times 3\,\text{cm}$, višina prizme je $5\,\text{cm}$. Kolikšna je prostornina?
- $12\,\text{cm}^3$
~ $12\,\text{cm}^2$ je le ploščina osnovne ploskve. Pomnožiti jo moraš še z višino.
- $94\,\text{cm}^3$
~ $94$ je površina v $\text{cm}^2$, ne prostornina. Površina pokrije ploskve, prostornina meri prostor.
+ $60\,\text{cm}^3$
- $47\,\text{cm}^3$
~ $47 = 12 + 20 + 15$ je vsota ploščin treh različnih ploskev, torej polovica površine. Prostornina ni vsota ploščin.
> $V = O \cdot v = (4 \cdot 3) \cdot 5 = 60\,\text{cm}^3$.

? Osnovna ploskev pokončne prizme je enakostranični trikotnik s stranico $5\,\text{cm}$, višina prizme je $10\,\text{cm}$. Kolikšna je ploščina plašča?
- $50\,\text{cm}^2$
~ To je ploščina ene same stranske ploskve. Plašč ima tri.
- $200\,\text{cm}^2$
~ Računal si s štirimi stranskimi ploskvami, kot pri kvadru. Trikotnik ima tri stranice, zato ima plašč tri pravokotnike.
+ $150\,\text{cm}^2$
> Obseg osnovne ploskve je $3 \cdot 5 = 15\,\text{cm}$, zato $\mathrm{pl} = o \cdot v = 15 \cdot 10 = 150\,\text{cm}^2$.

:::simboli
P | površina prizme | P = 2O + \mathrm{pl} | |
O | ploščina osnovne ploskve | | |
\mathrm{pl} | ploščina plašča | \mathrm{pl} = o \cdot v | | velja za pokončno prizmo
o | obseg osnovne ploskve | | |
v | višina prizme | | | razdalja med osnovnima ploskvama
V | prostornina prizme | V = O \cdot v | |
a, b | stranici osnovne ploskve | | | pravokotnik, kateti ali osnovnica in krak trikotnika
c | hipotenuza osnovne ploskve | c = \sqrt{a^2 + b^2} | | pravokotni trikotnik v Primeru 2; pri kvadru v razlagi tretji rob (višina)
h | višina trikotnika (zatrepa) | h = \sqrt{b^2 - \left(\frac{a}{2}\right)^2} | | enakokraki trikotnik v Primeru 3
a_1, a_2, a_n | stranice osnovne ploskve | | | širine pravokotnikov, ki sestavljajo plašč
:::
