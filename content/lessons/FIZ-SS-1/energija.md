---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na izletu stojite ob slapu, visokem $40\,\mathrm{m}$. Sošolec Jan pokaže na nižji, $20$-metrski slap v isti dolini in reče: »Tukaj voda pade z dvakrat večje višine, zato je spodaj dvakrat hitrejša.« Zveni logično. Pa je res? Do konca lekcije boš to preveril s svinčnikom, brez merjenja.

Za to potrebuješ, kar že znaš. Sila, ki deluje vzdolž poti, opravi delo: $A = F s \cos\alpha$. Na telesa blizu Zemlje deluje teža $F_g = mg$.

Energija je eden najpomembnejših pojmov v fiziki. Z njo lahko veliko problemov rešiš **brez podrobnega spremljanja gibanja**. Če poznaš višino, s katere se spustijo sani, lahko izračunaš njihovo hitrost na dnu, ne da bi poznal obliko pobočja. Enako razmišlja konstruktor toboganov.

## Razlaga

**1. Kaj je energija.** Energija je merilo za to, koliko dela lahko telo opravi oziroma koliko dela je bilo nad njim opravljenega. Označimo jo z $W$, enota je **joule**:

$$1\,\mathrm{J} = 1\,\mathrm{N\,m} = 1\,\mathrm{kg\,m^2/s^2}$$

Delo in energija sta povezana: **opravljeno delo je enako spremembi energije**, $A = \Delta W$.

**2. Kinetična energija** je energija gibanja. Telo z maso $m$ in hitrostjo $v$ ima:

$$W_k = \frac{mv^2}{2}$$

Hitrost nastopa v *kvadratu*. Pri dvakrat večji hitrosti je kinetična energija štirikrat večja.

**3. Potencialna (težna) energija** je energija zaradi lege telesa v težnostnem polju. Telo z maso $m$ na višini $h$ nad izbrano ničelno ravnjo ima:

$$W_p = mgh$$

Pri tem je $g = 9{,}8\,\mathrm{m/s^2}$. Ničelno raven si izbereš sam (tla, miza, dno doline). Pomembne so le **spremembe** potencialne energije, zato ni treba, da je izbira ničle vedno enaka, v isti nalogi pa jo uporabljaj dosledno.

:::premisli
Kamen pade s pečine na tla. Ali bi dobil drugačno hitrost ob tleh, če bi ničelno raven postavil na vrh pečine namesto na tla? Zakaj?
---
Ne. Z ničlo na vrhu ima kamen na začetku $W_p = 0$, na tleh pa negativno $W_p = -mgh$. Sprememba potencialne energije je v obeh primerih enaka, $mgh$, in ravno ta se pretvori v kinetično.
:::

**4. Prožnostna energija** je energija raztegnjene ali stisnjene vzmeti. Če ima vzmet prožnostni koeficient $k$ in je raztegnjena ali stisnjena za $x$ glede na ravnovesno lego, velja:

$$W_{pr} = \frac{kx^2}{2}$$

Enota za $k$ je $\mathrm{N/m}$, za $x$ pa $\mathrm{m}$. Spet nastopa kvadrat: pri dvakrat večjem raztezku je energija štirikrat večja.

**5. Kaj se dogaja med padcem?** S smreke, visoke $20\,\mathrm{m}$, odpade storž z maso $0{,}10\,\mathrm{kg}$. Upor zraka zanemarimo. Tabela kaže hitrost storža na štirih višinah. Za vsako višino izračunamo $W_p = mgh$ in $W_k = \dfrac{mv^2}{2}$:

| $h$ | $v$ | $W_p$ | $W_k$ |
|---|---|---|---|
| $20\,\mathrm{m}$ | $0$ | $19{,}6\,\mathrm{J}$ | $0$ |
| $15\,\mathrm{m}$ | $9{,}9\,\mathrm{m/s}$ | $14{,}7\,\mathrm{J}$ | $4{,}9\,\mathrm{J}$ |
| $10\,\mathrm{m}$ | $14{,}0\,\mathrm{m/s}$ | $9{,}8\,\mathrm{J}$ | $9{,}8\,\mathrm{J}$ |
| $0$ | $19{,}8\,\mathrm{m/s}$ | $0$ | $19{,}6\,\mathrm{J}$ |

Seštej $W_p$ in $W_k$ v vsaki vrstici. Vsota je vedno $19{,}6\,\mathrm{J}$. Kolikor potencialne energije storž izgubi, toliko kinetične pridobi.

:::premisli
Koliko kinetične energije ima storž $2\,\mathrm{m}$ nad tlemi? Napovej brez računanja hitrosti.
---
$17{,}64\,\mathrm{J}$. Na višini $2\,\mathrm{m}$ je $W_p = 0{,}10 \cdot 9{,}8 \cdot 2 = 1{,}96\,\mathrm{J}$. Vsota mora ostati $19{,}6\,\mathrm{J}$, zato je $W_k = 19{,}6\,\mathrm{J} - 1{,}96\,\mathrm{J} = 17{,}64\,\mathrm{J}$.
:::

**6. Ohranitev energije.** Vzorec iz tabele velja splošno. Energije ni mogoče ustvariti ali uničiti, mogoče jo je le pretvarjati iz ene oblike v drugo ali prenašati med telesi. V sistemu, kjer ni trenja in upora, se **mehanska energija** ohranja:

$$W_k + W_p + W_{pr} = \text{konst.}$$

Če so v začetnem stanju (1) in končnem stanju (2) prisotni vsi trije členi:

$$W_{k1} + W_{p1} + W_{pr1} = W_{k2} + W_{p2} + W_{pr2}$$

**7. Kaj pa trenje?** Če deluje trenje ali zračni upor, se mehanska energija zmanjšuje. Ta energija pa **ni izginila**: pretvori se v notranjo energijo (telesa in okolica se nekoliko segrejejo). Skupna energija se še vedno ohranja.

**8. Kako rešuješ naloge z energijo.**

1. Določi začetno in končno stanje.
2. Izberi ničelno raven za potencialno energijo.
3. Za vsako stanje zapiši, katere oblike energije so prisotne.
4. Izenači skupni energiji in izrazi neznanko.

V simulaciji spodaj (»Ohranitev mehanske energije«) spusti drsalca z vrha klanca brez trenja in opazuj stolpce energij: kinetični raste natanko toliko, kolikor potencialni pada. Nato vklopi trenje. Opazi, da se drsalec ne vrne več do začetne višine, skupna energija pa ostane enaka, ker raste notranja energija.

## Rešeni primeri

### Primer 1: kinetična energija avtomobila

Avto z maso $1000\,\mathrm{kg}$ vozi s hitrostjo $72\,\mathrm{km/h}$. Kolikšna je njegova kinetična energija? Kolikšna bi bila pri dvakrat večji hitrosti?

**Podatki:** $m = 1000\,\mathrm{kg}$, $v = 72\,\mathrm{km/h}$; v drugem delu dvakrat večja hitrost $2v$
**Iščemo:** kinetično energijo $W_k$ pri hitrosti $v$ in pri hitrosti $2v$

:::formula
$W_k = \dfrac{mv^2}{2}$ (hitrost mora biti v $\mathrm{m/s}$: $\mathrm{km/h}$ delimo s $3{,}6$)
:::

**Rešitev:**

1. **Pretvorba enot.** Formula zahteva $\mathrm{m/s}$: $72\,\mathrm{km/h} = 72 : 3{,}6 = 20\,\mathrm{m/s}$.
2. **Vstavimo:** $W_k = \dfrac{mv^2}{2} = \dfrac{1000 \cdot 20^2}{2} = \dfrac{1000 \cdot 400}{2} = 200\,000\,\mathrm{J} = 200\,\mathrm{kJ}$.
3. **Dvojna hitrost:** $v = 40\,\mathrm{m/s}$, $W_k = \dfrac{1000 \cdot 1600}{2} = 800\,000\,\mathrm{J} = 800\,\mathrm{kJ}$.
4. **Preverimo:** $800 : 200 = 4$, torej je energija res štirikrat večja. Zato je zaviranje pri veliki hitrosti tako dolgo: zavore morajo odvzeti štirikrat več energije.

### Primer 2: padec kamna

Po nočni zmrzali se s skalne stene odkruši kamen in pade z višine $5{,}0\,\mathrm{m}$ (začetna hitrost je $0$). S kolikšno hitrostjo zadene tla? Zanemari upor zraka.

**Podatki:** $h = 5{,}0\,\mathrm{m}$, $v_0 = 0$, $g = 9{,}8\,\mathrm{m/s^2}$, upor zraka zanemarimo
**Iščemo:** hitrost $v$ tik nad tlemi

:::formula
Ohranitev mehanske energije: $W_{p1} = W_{k2}$, torej $mgh = \dfrac{mv^2}{2}$
:::

**Rešitev:**

1. **Stanji.** (1) Kamen miruje na višini $h$. (2) Kamen je tik nad tlemi. Ničelno raven izberemo pri tleh.
2. **Energija v stanju 1:** $W_{k1} = 0$ (miruje), $W_{p1} = mgh$.
3. **Energija v stanju 2:** $W_{p2} = 0$ (višina je $0$), $W_{k2} = \dfrac{mv^2}{2}$.
4. **Ohranitev:** $mgh = \dfrac{mv^2}{2}$. Maso lahko krajšamo, zato hitrost ni odvisna od mase kamna.
5. **Izrazimo hitrost:** $v^2 = 2gh = 2 \cdot 9{,}8 \cdot 5{,}0 = 98\,\mathrm{m^2/s^2}$, torej $v = \sqrt{98} \approx 9{,}9\,\mathrm{m/s}$.
6. **Preverimo:** $9{,}9\,\mathrm{m/s}$ je približno $36\,\mathrm{km/h}$, kar je smiselno za padec s približno petih metrov.

### Primer 3: vzmet izstreli telo

Vzmet s prožnostnim koeficientom $k = 200\,\mathrm{N/m}$ stisnemo za $x = 0{,}10\,\mathrm{m}$. Pred njo leži telo z maso $m = 0{,}050\,\mathrm{kg}$ na gladki vodoravni podlagi (brez trenja). Ko vzmet spustimo, izstreli telo.
a) S kolikšno hitrostjo telo zapusti vzmet?
b) Telo nato zdrsi po gladkem klancu navzgor. Do katere višine se dvigne?

**Podatki:** $k = 200\,\mathrm{N/m}$, $x = 0{,}10\,\mathrm{m}$, $m = 0{,}050\,\mathrm{kg}$, $g = 9{,}8\,\mathrm{m/s^2}$, podlaga in klanec sta brez trenja
**Iščemo:** a) hitrost $v$, s katero telo zapusti vzmet; b) višino $h$, do katere se dvigne

:::formula
Ohranitev mehanske energije: $W_{pr} = \dfrac{kx^2}{2}$, $\dfrac{kx^2}{2} = \dfrac{mv^2}{2}$ (a) in $\dfrac{mv^2}{2} = mgh$ (b)
:::

**Rešitev:**

1. **Začetna energija (stisnjena vzmet):** $W_{pr} = \dfrac{kx^2}{2} = \dfrac{200 \cdot 0{,}10^2}{2} = \dfrac{200 \cdot 0{,}01}{2} = 1{,}0\,\mathrm{J}$.
2. **a) Vsa prožnostna energija se pretvori v kinetično:** $\dfrac{mv^2}{2} = 1{,}0\,\mathrm{J}$.
3. $v^2 = \dfrac{2 \cdot 1{,}0}{0{,}050} = 40\,\mathrm{m^2/s^2}$, zato $v = \sqrt{40} \approx 6{,}3\,\mathrm{m/s}$.
4. **b) Na vrhu se telo za trenutek ustavi,** vsa kinetična energija je postala potencialna: $mgh = 1{,}0\,\mathrm{J}$.
5. $h = \dfrac{1{,}0}{0{,}050 \cdot 9{,}8} = \dfrac{1{,}0}{0{,}49} \approx 2{,}0\,\mathrm{m}$.
6. **Preverimo:** pri obeh delih je skupna energija ves čas $1{,}0\,\mathrm{J}$, spremenila se je le njena oblika: prožnostna, kinetična, potencialna.

### Primer 4 – zdaj ti: Janova trditev

Vrnimo se k slapovoma iz uvoda. Voda pri vrhu skoraj miruje. Kolikšna je hitrost vode na dnu $40$-metrskega slapa? Ali je res dvakrat večja kot na dnu $20$-metrskega? Upor zraka zanemari.

**Podatki:** $h_1 = 40\,\mathrm{m}$, $h_2 = 20\,\mathrm{m}$, začetna hitrost $0$, $g = 9{,}8\,\mathrm{m/s^2}$, upor zraka zanemarimo
**Iščemo:** hitrost $v$ na dnu višjega slapa in razmerje hitrosti

:::formula
$mgh = \dfrac{mv^2}{2}$, torej $v = \sqrt{2gh}$
:::

**Rešitev:**

1. **Ohranitev:** potencialna energija vode na vrhu se do dna pretvori v kinetično; masa se pokrajša, zato velja za vsako kapljo enako.
2. **Višji slap:** $v^2 = 2gh_1 = 2 \cdot 9{,}8 \cdot 40 = 784\,\mathrm{m^2/s^2}$.
3. **Nižji slap:** enako kot pri storžu iz Razlage, $v \approx 19{,}8\,\mathrm{m/s}$.
4. Izračunaj $v$ za višji slap in obe hitrosti primerjaj.

:::premisli
Koliko je $v$ na dnu višjega slapa in kaj to pomeni za Janovo trditev?
---
$v = \sqrt{784} = 28\,\mathrm{m/s}$. Razmerje $28 : 19{,}8 \approx 1{,}41$, torej voda ni dvakrat hitrejša, ampak le približno $1{,}4$-krat. Dvakrat večja je **energija** (višina), hitrost pa raste s korenom višine. Jan se moti.
:::

## Pogoste napake

- **»Dvakrat višje, dvakrat hitreje.«** Tako je sklepal Jan. Z višino sorazmerno raste energija, hitrost pa le s korenom višine: $v = \sqrt{2gh}$. Pri dvakrat večji višini je hitrost le $\sqrt{2} \approx 1{,}4$-krat večja. Popravek: najprej primerjaj energije, šele nato iz njih izračunaj hitrosti.
- **Pozabljen kvadrat ali faktor $\tfrac12$.** Kdor računa $W_k = mv$ ali $W_k = mv^2$ (napačno), dobi $6\,\mathrm{J}$ ali $18\,\mathrm{J}$ namesto $9\,\mathrm{J}$ za $m = 2\,\mathrm{kg}$ in $v = 3\,\mathrm{m/s}$. Pri $W_k$ in $W_{pr}$ je kvadrat samo na $v$ oziroma $x$, cel izraz pa delimo z $2$. Popravek: formulo napiši, preden vstaviš števila. Pazi tudi na enote: $\mathrm{km/h}$ najprej deli s $3{,}6$.
- **Raztezek $x$ zamenjaš z dolžino vzmeti.** Vzmet je dolga $15\,\mathrm{cm}$ in jo stisneš na $10\,\mathrm{cm}$; v formulo spada $x = 0{,}05\,\mathrm{m}$, ne $0{,}15\,\mathrm{m}$ ali $0{,}10\,\mathrm{m}$. Energija je odvisna od spremembe dolžine glede na ravnovesno lego.
- **»Energija se izgubi.«** Sani po mehkem snegu pridejo na dno počasneje, zato se zdi, da je energija izginila. V resnici se je del mehanske energije pretvoril v notranjo: sneg in drsnice se rahlo segrejejo. Popravek: reci »mehanska energija se zmanjša«, skupna se ohranja.
- **»Težji kamen pade hitreje.«** Težji kamen ima res več potencialne energije, a tudi več mase, ki jo mora pospešiti. V $mgh = \dfrac{mv^2}{2}$ se masa pokrajša. Brez upora zraka težji in lažji kamen padeta z enako hitrostjo.

## Povzetek

- Energija ima enoto joule ($\mathrm{J}$). Opravljeno delo je enako spremembi energije: $A = \Delta W$.
- Kinetična energija: $W_k = \dfrac{mv^2}{2}$.
- Potencialna (težna) energija: $W_p = mgh$, višino merimo od izbrane ničelne ravni.
- Prožnostna energija: $W_{pr} = \dfrac{kx^2}{2}$.
- Brez trenja in upora se mehanska energija ohranja: $W_k + W_p + W_{pr} = \text{konst.}$ Pri trenju se del energije spremeni v notranjo, skupna energija se ohranja.
- Pri nalogah: določi stanji, izberi ničelno raven, zapiši energije in jih izenači.

## Drugače: Korak za korakom s številkami

Telo z maso $m = 1{,}0\,\mathrm{kg}$ spustimo z višine $10\,\mathrm{m}$. Ničelna raven je pri tleh. Računamo $W_p = mgh$ in kinetično energijo iz ohranitve: $W_k = W_{\text{skupna}} - W_p$.

Skupna energija je na začetku: $W = 1{,}0 \cdot 9{,}8 \cdot 10 = 98\,\mathrm{J}$.

| Višina $h$ | $W_p = mgh$ | $W_k = 98\,\mathrm{J} - W_p$ | Skupaj |
|---|---|---|---|
| $10\,\mathrm{m}$ | $98\,\mathrm{J}$ | $0\,\mathrm{J}$ | $98\,\mathrm{J}$ |
| $7{,}5\,\mathrm{m}$ | $73{,}5\,\mathrm{J}$ | $24{,}5\,\mathrm{J}$ | $98\,\mathrm{J}$ |
| $5\,\mathrm{m}$ | $49\,\mathrm{J}$ | $49\,\mathrm{J}$ | $98\,\mathrm{J}$ |
| $2{,}5\,\mathrm{m}$ | $24{,}5\,\mathrm{J}$ | $73{,}5\,\mathrm{J}$ | $98\,\mathrm{J}$ |
| $0\,\mathrm{m}$ | $0\,\mathrm{J}$ | $98\,\mathrm{J}$ | $98\,\mathrm{J}$ |

Opaziš lahko:

- Skupna energija je v vsaki vrstici enaka.
- Na polovični višini ($5\,\mathrm{m}$) sta kinetična in potencialna energija enaki.
- Hitrost na tleh dobiš iz $\dfrac{mv^2}{2} = 98\,\mathrm{J}$: $v^2 = 196$, $v = 14\,\mathrm{m/s}$.

## Drugače: Kot zgodba

Kapljica vode leži v mlaki na morski obali. Sonce jo segreje, izhlapi in z vlažnim zrakom se dvigne visoko v oblak. Tja je ni nesel nihče z roko: energijo za dvig je dalo Sonce. V oblaku ima zdaj veliko potencialne energije.

Nad gorami se oblak ohladi in kapljica pade kot dež na pobočje. Med padcem bi morala postati zelo hitra, a jo zavira zrak. Del njene energije se pretvori v notranjo energijo zraka, zato pade na tla razmeroma počasi.

Z drugimi kapljicami steče v potok. Spet izgublja višino in pridobiva hitrost. Na robu slapa ima še vedno $W_p$ glede na tolmun spodaj. V padcu se ta spremeni v $W_k$: na dnu $20$-metrskega slapa ima hitrost blizu $20\,\mathrm{m/s}$.

V tolmunu se pljusk umiri. Kinetična energija ni izginila: voda in kamni so za malenkost toplejši. Nobena energija v tej zgodbi ni nastala iz nič in nobena ni izginila. Le spreminjala je obliko.

## Drugače: Bolj natančno

Zakaj imata kinetična in potencialna energija ravno takšni obliki? Izpeljemo ju iz dela.

**Kinetična energija.** Telo z maso $m$, ki miruje, pospešujemo s stalno silo $F$ vzdolž poti $s$. Po drugem Newtonovem zakonu je pospešek $a = F/m$. Pri enakomerno pospešenem gibanju iz mirovanja velja $v^2 = 2as$, torej $s = \dfrac{v^2}{2a}$. Opravljeno delo je:

$$A = F s = m a \cdot \frac{v^2}{2a} = \frac{mv^2}{2}$$

To delo se je shranilo kot kinetična energija telesa.

**Potencialna energija.** Telo z maso $m$ dvigamo enakomerno (brez pospeševanja), zato je sila dvigovanja enaka teži: $F = mg$. Če ga dvignemo za višino $h$, je opravljeno delo $A = F h = mgh$. Shranilo se je kot potencialna energija.

**Prožnostna energija.** Sila vzmeti je sorazmerna z raztezkom: $F = kx$. Ker sila narašča od $0$ do $kx$, je njena povprečna vrednost $\dfrac{kx}{2}$. Delo pri raztegu za $x$ je zato $\dfrac{kx}{2} \cdot x = \dfrac{kx^2}{2}$. To je ploščina trikotnika pod grafom $F(x)$.

## Preveri se

? Telo z maso $2\,\mathrm{kg}$ se giblje s hitrostjo $3\,\mathrm{m/s}$. Kolikšna je njegova kinetična energija?
- $18\,\mathrm{J}$
~ To je $mv^2$ brez deljenja z $2$. Kinetična energija je polovica tega produkta.
- $6\,\mathrm{J}$
~ To je $mv$: hitrost ni kvadrirana. V $W_k$ nastopa $v^2$.
+ $9\,\mathrm{J}$
> $W_k = \dfrac{mv^2}{2} = \dfrac{2 \cdot 3^2}{2} = \dfrac{18}{2} = 9\,\mathrm{J}$.

? Maja je izračunala prožnostno energijo vzmeti s $k = 100\,\mathrm{N/m}$, stisnjene za $0{,}20\,\mathrm{m}$: »$W_{pr} = k x^2 = 100 \cdot 0{,}04 = 4\,\mathrm{J}$.« Kje je napaka?
- Napake ni, rezultat je pravilen.
~ Račun $100 \cdot 0{,}04$ je res $4$, a formula je napačna: manjka deljenje z $2$.
- Raztezek bi morala vstaviti v centimetrih, torej $x = 20$.
~ V formuli so osnovne enote: $k$ v $\mathrm{N/m}$, zato $x$ v metrih. S centimetri bi dobila $40\,000\,\mathrm{J}$.
+ Pozabila je deliti z $2$; prav je $2\,\mathrm{J}$.
- Kvadrirati bi morala $k$, ne $x$.
~ Kvadrat je na raztezku: energija narašča s kvadratom stiska, s $k$ pa sorazmerno.
> $W_{pr} = \dfrac{kx^2}{2} = \dfrac{100 \cdot 0{,}04}{2} = 2\,\mathrm{J}$. Faktor $\tfrac12$ izhaja iz tega, da sila vzmeti med stiskanjem narašča od $0$ do $kx$.

? Telo spustimo iz mirovanja z višine $h$ nad tlemi in zanemarimo upor zraka. Na kateri višini sta kinetična in potencialna energija telesa enaki?
- Tik pred trkom ob tla
~ Tik pred trkom je potencialna energija že skoraj $0$, vsa energija je kinetična.
- Na višini $\dfrac{h}{4}$
~ Tam je kinetična energija že trikrat večja od potencialne: telo je izgubilo $\tfrac34$ potencialne energije.
+ Na višini $\dfrac{h}{2}$
> Skupna energija je $mgh$. Na višini $\dfrac{h}{2}$ je $W_p = \dfrac{mgh}{2}$, zato je $W_k = mgh - \dfrac{mgh}{2} = \dfrac{mgh}{2}$, torej sta enaki. Tik pred trkom je potencialna energija že $0$, na višini $\dfrac{h}{4}$ pa je potencialna energija le $\dfrac{mgh}{4}$, kinetična pa $\dfrac{3mgh}{4}$.

? Sani se spustijo po zasneženem pobočju in na dnu so počasnejše, kot bi bile brez trenja. Katera trditev drži?
- Del energije je med vožnjo izginil.
~ Energija ne izgine. Manjka le mehanska energija; ta se je pretvorila v notranjo.
- Mehanska energija se je ohranila, sani so le težje.
~ Masa sani se ni spremenila. Mehanska energija se pri trenju zmanjša.
+ Mehanska energija se je zmanjšala, skupna energija pa se je ohranila.
- Brez trenja bi bile težje sani na dnu hitrejše od lažjih.
~ Brez trenja se masa v $mgh = \dfrac{mv^2}{2}$ pokrajša: vse sani bi imele enako hitrost.
> Trenje pretvarja del mehanske energije v notranjo energijo snega in drsnic, zato sani na dnu nimajo vse začetne potencialne energije v obliki kinetične. Skupna energija se ohranja.

? Zrno toče pade iz oblaka, ki je $1\,\mathrm{km}$ nad tlemi. Brez upora zraka bi priletelo s hitrostjo $v = \sqrt{2gh} = 140\,\mathrm{m/s}$, v resnici pa pade s hitrostjo nekaj deset metrov na sekundo. Zakaj?
- Ker energija toče med padcem izgine.
~ Energija ne izgine; pretvori se v drugo obliko.
- Ker je bila potencialna energija na začetku manjša od $mgh$.
~ Na višini $1\,\mathrm{km}$ je $W_p = mgh$, to se ne spremeni. Razlika nastane med padcem.
+ Ker zračni upor velik del potencialne energije pretvori v notranjo energijo zraka in toče.
- Ker hitrost raste sorazmerno z višino, ne s korenom višine.
~ Z višino sorazmerno raste energija; hitrost brez upora bi rasla s korenom višine. Ta zveza razlike ne pojasni.
> Pri dolgem padcu zračni upor ni zanemarljiv: mehanska energija toče se zmanjšuje, skupna energija pa ostane enaka, ker se zrak in toča malo segrejeta.

:::simboli
W_k | kinetična energija | W_k = \dfrac{mv^2}{2} | J | hitrost vstavimo v m/s
W_p | potencialna energija | W_p = mgh | J | višino merimo od izbrane ničelne ravni
W_{pr} | prožnostna energija | W_{pr} = \frac{kx^2}{2} | J
W_{k1}, W_{p1}, W_{pr1} | kinetična, potencialna, prožnostna energija v stanju 1 | | J
W_{k2}, W_{p2}, W_{pr2} | kinetična, potencialna, prožnostna energija v stanju 2 | | J
m | masa | | kg
v | hitrost | | m/s
g | težni pospešek | | m/s^2 | 9,8 m/s²
h | višina nad ničelno ravnjo | | m
h_1, h_2 | višina višjega in nižjega slapa | | m
k | prožnostni koeficient vzmeti | | N/m
x | raztezek ali skrček vzmeti | | m | glede na ravnovesno lego
A | delo | A = F s \cos\alpha | J | enako spremembi energije
F | sila | | N
s | pot | | m
a | pospešek | a = F/m | m/s^2
:::
