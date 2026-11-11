---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec Tim trdi: »Sonda Voyager 1 leti že od leta 1977 in je zdaj daleč za Plutonom. Motorji ji morajo ves čas delovati, sicer bi se ustavila. Brez potiskanja se nič ne giblje.« Zveni logično: kolo se ustavi, če nehaš poganjati, in žoga na travi obstane.

Pa vendar se Tim moti. Sondini glavni motorji so ugasnjeni že desetletja, ona pa še vedno leti s hitrostjo okoli $17\,\mathrm{km/s}$. Kinematika ti pove, *kako* se telo giblje. Ne pove pa, *zakaj* se kolo ustavi, sonda pa ne.

Odgovor dajo **Newtonovi zakoni**. Povezujejo silo, maso in pospešek, zato lahko vnaprej izračunaš, kako se bo telo gibalo. Z njimi inženirji načrtujejo vozila, dvigala in rakete, ti pa jih boš potreboval v vseh nadaljnjih poglavjih fizike.

## Razlaga

**1. Sila.** Sila $F$ je merilo za medsebojno delovanje teles. Je **vektor**: ima velikost in smer. Enota je newton: $1\,\mathrm{N} = 1\,\mathrm{kg\,m/s^2}$.

**2. Rezultanta sil.** Če na telo deluje več sil, jih seštejemo kot vektorje. Vsoti rečemo **rezultanta** (skupna sila) $F_\mathrm{r}$. Pri gibanju po premici sile v eni smeri seštevamo, sile v nasprotni smeri odštevamo.

:::risba skica
opis: Škatla na vodoravni podlagi in štiri sile nanjo. Teža 98 N kaže navzdol, sila podlage 98 N navzgor, vlečna sila 50 N v desno, trenje 20 N v levo. Dolžine puščic so sorazmerne s silami: navpični sta enako dolgi, desna je dva in pol krat daljša od leve. Rezultanta je 30 N v desno.
območje: -4; -5,5 .. 4; 5,5
enota: 28
pravokotnik: -0,4; -0,4 .. 0,4; 0,4 | siva
puščica: 0; 0 -> 0; -4,9 | F_g = 98 N | desno | modra
puščica: 0; 0 -> 0; 4,9 | F_p = 98 N | desno | zelena
puščica: 0; 0 -> 2,5; 0 | F_v = 50 N | nad | oranžna
puščica: 0; 0 -> -1; 0 | F_{tr} = 20 N | pod levo | rdeča
:::

*Hiter preizkus:* kolikšna je rezultanta na sliki? (Navpični sili se izničita, vodoravno ostane $50\,\mathrm{N} - 20\,\mathrm{N} = 30\,\mathrm{N}$ v desno.)

**3. Prvi Newtonov zakon (zakon o vztrajnosti).** Telo miruje ali se enakomerno giblje po premici, dokler je rezultanta sil nanj enaka nič:

$$F_\mathrm{r} = 0 \;\Rightarrow\; \vec v = \text{konstantna}$$

Lastnosti telesa, da se upira spremembi gibanja, pravimo **vztrajnost**. Večja ko je masa, večja je vztrajnost.

Kolo se torej ne ustavi zato, ker »zmanjka sile«, ampak ker nanj delujeta trenje in zračni upor. Če ju ni, se hitrost ne spremeni.

:::premisli
Voyager je daleč od Sonca in planetov, njihove sile nanj so skoraj nič, motorji so ugasnjeni. Kaj se dogaja z njegovo hitrostjo? Kdo je imel prav, Tim ali Newton?
---
Hitrost ostaja skoraj enaka, ker je rezultanta sil skoraj nič. Za gibanje sila ni potrebna; potrebna je le za spremembo hitrosti. Tim se moti.
:::

**4. Drugi Newtonov zakon (osnovni zakon dinamike).** Rezultanta sil na telo je enaka produktu mase in pospeška:

$$F_\mathrm{r} = m\,a$$

Pospešek ima enako smer kot rezultanta. Večja kot je rezultanta, večji je pospešek; večja kot je masa, manjši je pospešek pri isti sili.

V simulaciji spodaj »Sila, masa in pospešek« pri isti masi podvoji silo, nato pri isti sili podvoji maso. Opazuj, kolikokrat se pospešek poveča in kolikokrat zmanjša.

*Hiter preizkus:* sila $10\,\mathrm{N}$ deluje na telo z maso $2\,\mathrm{kg}$. Kolikšen je pospešek? ($5\,\mathrm{m/s^2}$, ker je $a = \dfrac{F_\mathrm{r}}{m}$.)

**5. Tretji Newtonov zakon (zakon o vzajemnem delovanju).** Če prvo telo deluje na drugo s silo $\vec F_{12}$, drugo deluje na prvo z enako veliko, nasprotno usmerjeno silo:

$$\vec F_{21} = -\vec F_{12}$$

Pomembno: sili delujeta na **različni telesi**, zato se med seboj ne izničita.

:::premisli
Astronavt v vesoljski postaji se odrine od stene. Je sila stene nanj večja, manjša ali enaka sili, s katero on potiska steno? Zakaj se potem premakne skoraj samo on?
---
Sili sta enako veliki. Postaja pa ima ogromno maso, zato je njen pospešek $a = \dfrac{F}{m}$ zelo majhen, astronavtov pa velik.
:::

**6. Teža in podlaga.** Teža telesa je sila Zemlje na telo: $F_\mathrm{g} = m\,g$, kjer je $g \approx 9{,}8\,\mathrm{m/s^2}$. Če telo leži na vodoravni podlagi in miruje, podlaga deluje nanj s silo podlage (pravokotno na podlago), ki je po velikosti enaka teži.

**7. Trenje.** Sila trenja nasprotuje gibanju (ali poskusu gibanja) in leži vzporedno s podlago. Kako je njena velikost odvisna od podlage, boš izračunal v lekciji o trenju; tukaj je sila trenja v nalogah vedno podana.

**8. Postopek reševanja nalog.**

1. Nariši skico in vsa telesa, ki delujejo na obravnavano telo.
2. Vriši vse sile na telo (teža, sila podlage, vlečna sila, trenje).
3. Izberi pozitivno smer (običajno smer gibanja).
4. Zapiši $F_\mathrm{r} = m\,a$ s predznaki.
5. Izračunaj neznanko in preveri enote ter smiselnost.

## Rešeni primeri

### Primer 1 (lažji): pospeševanje vozička

Voziček z maso $20\,\mathrm{kg}$ potiskamo po vodoravnih tleh s silo $60\,\mathrm{N}$. Trenje zanemarimo. Kolikšen je pospešek?

**Podatki:** $m = 20\,\mathrm{kg}$, $F = 60\,\mathrm{N}$ (vodoravna potisna sila), trenje zanemarimo ($F_\mathrm{tr} = 0$)
**Iščemo:** pospešek $a$

:::formula
Drugi Newtonov zakon: $F_\mathrm{r} = m\,a$, torej $a = \dfrac{F_\mathrm{r}}{m}$
:::

**Rešitev:**

1. V vodoravni smeri deluje samo potisna sila. Navpični sili (teža in sila podlage) se izničita, zato ne vplivata na gibanje v vodoravni smeri.
2. Zapišemo drugi zakon: $F_\mathrm{r} = m\,a$, torej $a = \dfrac{F_\mathrm{r}}{m}$.
3. Vstavimo: $a = \dfrac{60\,\mathrm{N}}{20\,\mathrm{kg}} = 3\,\mathrm{m/s^2}$.
4. Smiselnost: enota $\mathrm{N/kg} = \mathrm{m/s^2}$ je enota pospeška, vrednost pa ni nenavadno velika.
5. Odgovor: voziček pospešuje s pospeškom $3\,\mathrm{m/s^2}$.

### Primer 2: trenje in pot

Škatla z maso $10\,\mathrm{kg}$ se giblje po vodoravni podlagi. Vlečemo jo z vodoravno silo $50\,\mathrm{N}$, sila trenja je $20\,\mathrm{N}$. Škatla na začetku miruje. Kolikšen je pospešek in kolikšno pot prepotuje v $4\,\mathrm{s}$?

**Podatki:** $m = 10\,\mathrm{kg}$, $F = 50\,\mathrm{N}$ (vodoravna vlečna sila), $F_\mathrm{tr} = 20\,\mathrm{N}$, $v_0 = 0$, $t = 4\,\mathrm{s}$
**Iščemo:** pospešek $a$ in pot $s$

:::formula
$F_\mathrm{r} = F - F_\mathrm{tr} = m\,a$, nato pot pri $v_0 = 0$: $s = \dfrac{1}{2}a t^2$
:::

**Rešitev:**

1. Izberemo pozitivno smer v smeri vlečne sile. Trenje kaže nasprotno, zato je negativno.
2. Rezultanta: $F_\mathrm{r} = 50\,\mathrm{N} - 20\,\mathrm{N} = 30\,\mathrm{N}$.
3. Pospešek: $a = \dfrac{30\,\mathrm{N}}{10\,\mathrm{kg}} = 3\,\mathrm{m/s^2}$.
4. Ker je pospešek stalen in je začetna hitrost nič, uporabimo znano formulo iz kinematike: $s = \dfrac{1}{2}a t^2$.
5. Vstavimo: $s = \dfrac{1}{2}\cdot 3\,\mathrm{m/s^2}\cdot (4\,\mathrm{s})^2 = \dfrac{1}{2}\cdot 3 \cdot 16\,\mathrm{m} = 24\,\mathrm{m}$.
6. Odgovor: pospešek je $3\,\mathrm{m/s^2}$, pot pa $24\,\mathrm{m}$.

### Primer 3 (težji): dvigalo

Oseba z maso $70\,\mathrm{kg}$ stoji v dvigalu na tehtnici. Dvigalo se začne gibati navzgor s pospeškom $1{,}2\,\mathrm{m/s^2}$. Kolikšno silo kaže tehtnica? Vzemi $g = 9{,}8\,\mathrm{m/s^2}$.

**Podatki:** $m = 70\,\mathrm{kg}$, $a = 1{,}2\,\mathrm{m/s^2}$ (navzgor), $g = 9{,}8\,\mathrm{m/s^2}$
**Iščemo:** silo podlage $F_\mathrm{p}$, ki jo kaže tehtnica

:::formula
Drugi Newtonov zakon s pozitivno smerjo navzgor: $F_\mathrm{p} - F_\mathrm{g} = m\,a$, kjer je $F_\mathrm{g} = m\,g$
:::

**Rešitev:**

1. Na osebo delujeta dve sili: teža $F_\mathrm{g}$ navzdol in sila podlage $F_\mathrm{p}$ navzgor. Tehtnica kaže prav silo podlage (po tretjem zakonu je enaka sili, s katero oseba pritiska na tehtnico).
2. Pozitivna smer naj bo navzgor, saj v to smer pospešujemo.
3. Zapišemo drugi zakon: $F_\mathrm{p} - F_\mathrm{g} = m\,a$.
4. Izrazimo: $F_\mathrm{p} = m\,g + m\,a = m\,(g + a)$.
5. Vstavimo: $F_\mathrm{p} = 70\,\mathrm{kg}\cdot(9{,}8 + 1{,}2)\,\mathrm{m/s^2} = 70\cdot 11\,\mathrm{N} = 770\,\mathrm{N}$.
6. Primerjava: teža je $70\cdot 9{,}8 = 686\,\mathrm{N}$. Tehtnica kaže več, ker moramo osebo ne le držati, ampak tudi pospeševati navzgor. To se ujema z občutkom, da te ob speljevanju dvigala pritisne k tlom.
7. Odgovor: tehtnica kaže silo $770\,\mathrm{N}$.

### Primer 4 – zdaj ti: izstrelitev rakete

Raketa z maso $550\,\mathrm{t}$ stoji na izstrelišču. Ob vžigu jo motorji potiskajo navpično navzgor s silo $7{,}6\,\mathrm{MN}$. Kolikšen je njen pospešek v prvem trenutku? Zračni upor zanemari, $g = 9{,}8\,\mathrm{m/s^2}$.

**Podatki:** $m = 550\,\mathrm{t} = 550\,000\,\mathrm{kg}$, $F = 7{,}6\,\mathrm{MN} = 7\,600\,000\,\mathrm{N}$ (navzgor), $g = 9{,}8\,\mathrm{m/s^2}$
**Iščemo:** pospešek $a$

:::formula
Pozitivna smer navzgor: $F - F_\mathrm{g} = m\,a$, kjer je $F_\mathrm{g} = m\,g$
:::

**Rešitev:**

1. Na raketo delujeta potisna sila navzgor in teža navzdol, zato rezultanta ni kar potisna sila.
2. Teža: $F_\mathrm{g} = 550\,000\,\mathrm{kg} \cdot 9{,}8\,\mathrm{m/s^2} = 5\,390\,000\,\mathrm{N}$.
3. Izračunaj rezultanto in pospešek sam, nato preveri:

:::premisli
Kolikšna sta $F_\mathrm{r}$ in $a$?
---
$F_\mathrm{r} = 7\,600\,000\,\mathrm{N} - 5\,390\,000\,\mathrm{N} = 2\,210\,000\,\mathrm{N}$, $a = \dfrac{2\,210\,000\,\mathrm{N}}{550\,000\,\mathrm{kg}} \approx 4{,}0\,\mathrm{m/s^2}$. Brez teže bi dobil napačnih $13{,}8\,\mathrm{m/s^2}$.
:::

## Pogoste napake

- **»Sila je potrebna za gibanje.«** Tako je mislil Tim: kolo se brez poganjanja ustavi, torej gibanje potrebuje silo. Kolo pa ustavita trenje in upor. Po prvem zakonu telo brez rezultante sil nadaljuje enakomerno gibanje. Sila je potrebna za *spremembo* gibanja (pospešek), ne za enakomerno gibanje.
- **Ena sila namesto rezultante.** Učenec v $F = m\,a$ vstavi samo vlečno ali potisno silo (pri raketi $7{,}6\,\mathrm{MN}$) ali pa vse sile sešteje brez predznakov. V $F_\mathrm{r} = m\,a$ nastopa rezultanta: sile v nasprotnih smereh odštevamo, tudi trenje in težo.
- **Sili akcije in reakcije se »izničita«.** Ker sta enako veliki in nasprotni, ju učenec sešteje in dobi nič. Delujeta na različni telesi, zato ju ne seštevamo pri istem telesu. Zato se npr. voziček, ki ga potiskaš, lahko giblje, čeprav on tebe potiska nazaj z enako veliko silo.
- **Mešanje mase in teže.** »Astronavt na Luni ima manjšo maso.« Ne: manjša je njegova teža, ker je $g$ tam manjši; masa (v $\mathrm{kg}$) je povsod enaka. Teža je sila v $\mathrm{N}$, $F_\mathrm{g} = m\,g$. Pred računom pretvori tudi enote, npr. $500\,\mathrm{g} = 0{,}5\,\mathrm{kg}$; $550\,\mathrm{t} = 550\,000\,\mathrm{kg}$.
- **»Večja sila, večji pospešek, ne glede na maso.«** Kdor primerja le sile, pričakuje enak pospešek pri enaki sili. Pospešek je obratno sorazmeren z maso: ista sila da dvakrat težjemu telesu pol manjši pospešek.

## Povzetek

- Sila je vektor, enota je $1\,\mathrm{N} = 1\,\mathrm{kg\,m/s^2}$. Več sil seštejemo v rezultanto.
- **1. zakon:** če je $F_\mathrm{r} = 0$, telo miruje ali se enakomerno giblje po premici.
- **2. zakon:** $F_\mathrm{r} = m\,a$; pospešek ima smer rezultante.
- **3. zakon:** sili vzajemnega delovanja sta enako veliki, nasprotno usmerjeni in delujeta na različni telesi.
- Teža: $F_\mathrm{g} = m\,g$; trenje kaže nasprotno od gibanja.
- Pri nalogah: skica, vse sile, izbira smeri, $F_\mathrm{r} = m\,a$ s predznaki.

## Drugače: Na sliki

Nariši škatlo kot kvadrat in iz njenega središča puščice za sile:

- navzdol puščica za težo $F_\mathrm{g}$,
- navzgor puščica za silo podlage $F_\mathrm{p}$,
- desno puščica za vlečno silo $F_\mathrm{v}$,
- levo puščica za trenje $F_\mathrm{tr}$.

Dolžina puščice kaže velikost sile. Če sta navpični puščici enako dolgi, se izničita in škatla se ne giblje navpično. Če je desna puščica daljša od leve, je rezultanta usmerjena desno in škatla pospešuje v desno. Če sta enako dolgi, je rezultanta nič in škatla miruje ali drsi enakomerno.

V simulaciji spodaj »Sila, masa in pospešek« izberi podlago brez trenja, spusti klado in med gibanjem nastavi vlečno silo na $0$. Opazuj: klada se ne ustavi, ampak drsi naprej s stalno hitrostjo, tako kot Voyager. Nato izberi podlago »les na lesu« in poglej, kako jo trenje ustavi.

## Drugače: Iz vsakdanjega življenja

**Avtobus.** Ko avtobus nenadoma spelje, se ti zdi, da te potegne nazaj. V resnici se sedež pospeši naprej, tvoje telo pa zaradi vztrajnosti (1. zakon) skuša ostati pri miru. Ko avtobus zavira, te "vrže" naprej, ker telo nadaljuje prvotno gibanje.

**Prazen in poln nakupovalni voziček.** Z isto silo prazen voziček pospešiš bolj kot poln. Po $a = F/m$ je pri enaki sili pospešek obratno sorazmeren z maso.

**Rakete.** Raketa izpihuje plin nazaj, plin pa po 3. zakonu potiska raketo naprej. Zato raketa deluje tudi v praznem prostoru, kjer ni zraka, na katerega bi se "naslonila".

## Drugače: Korak za korakom s številkami

Naloga: Avto z maso $1000\,\mathrm{kg}$ se ob zaviranju ustavlja z zaviralno silo (trenje) $4000\,\mathrm{N}$. Kolikšen je pojemek in kolikšna zavorna pot, če je začetna hitrost $20\,\mathrm{m/s}$?

| Korak | Kaj naredimo | Račun |
|---|---|---|
| 1 | Izberemo pozitivno smer v smeri gibanja | zaviralna sila je negativna: $F_\mathrm{r} = -4000\,\mathrm{N}$ |
| 2 | Drugi zakon | $a = \dfrac{F_\mathrm{r}}{m} = \dfrac{-4000\,\mathrm{N}}{1000\,\mathrm{kg}} = -4\,\mathrm{m/s^2}$ |
| 3 | Čas ustavljanja iz $v = v_0 + a t$, $v = 0$ | $t = \dfrac{20\,\mathrm{m/s}}{4\,\mathrm{m/s^2}} = 5\,\mathrm{s}$ |
| 4 | Pot: $s = v_0 t + \dfrac{1}{2} a t^2$ | $s = 20\cdot 5 - \dfrac{1}{2}\cdot 4\cdot 25 = 100 - 50 = 50\,\mathrm{m}$ |
| 5 | Preverimo | povprečna hitrost $10\,\mathrm{m/s}$ krat $5\,\mathrm{s}$ je $50\,\mathrm{m}$ |

Pojemek je $4\,\mathrm{m/s^2}$ (negativen pospešek pomeni zaviranje), zavorna pot je $50\,\mathrm{m}$.

## Drugače: Bolj natančno

**Drugi zakon in enota.** Iz $F = m\,a$ sledi enota: $1\,\mathrm{N}$ je sila, ki telesu z maso $1\,\mathrm{kg}$ da pospešek $1\,\mathrm{m/s^2}$.

**Prvi zakon kot poseben primer drugega.** Če je $F_\mathrm{r} = 0$, je $a = 0$, torej se hitrost ne spreminja. Prvi zakon hkrati določa, kdaj zakoni sploh veljajo: v **inercialnih opazovalnih sistemih**, to so sistemi, ki mirujejo ali se enakomerno gibljejo po premici. V pospešenem sistemu (npr. v zavijajočem avtobusu) se zdi, da na telesa delujejo dodatne sile, ki jih v inercialnem sistemu ni.

**Zakaj sta akcija in reakcija različna telesa.** Če bi imeli samo eno telo, bi bila vsota sil $\vec F + (-\vec F) = 0$ in telo se nikoli ne bi pospešilo. V resnici sili delujeta na različni telesi: sila $\vec F_{12}$ povzroči pospešek telesa 2, sila $\vec F_{21}$ pa pospešek telesa 1. Pospeška sta po velikosti $a_1 = F/m_1$ in $a_2 = F/m_2$, zato manjše telo pospeši bolj.

## Preveri se

? Škatla z maso $5\,\mathrm{kg}$ drsi po vodoravni podlagi. Vlečemo jo s silo $30\,\mathrm{N}$, trenje je $10\,\mathrm{N}$. Kolikšen je pospešek?
- $6\,\mathrm{m/s^2}$
~ Tu je vstavljena samo vlečna sila. V $F_\mathrm{r} = m\,a$ spada rezultanta, trenje je treba odšteti.
+ $4\,\mathrm{m/s^2}$
- $8\,\mathrm{m/s^2}$
~ Trenje je prišteto. Kaže nasprotno od vlečne sile, zato ga odštejemo.
- $2\,\mathrm{m/s^2}$
~ To je pospešek samo zaradi trenja ($10/5$). Na škatlo delujeta obe sili.
> Rezultanta je $30\,\mathrm{N} - 10\,\mathrm{N} = 20\,\mathrm{N}$, torej $a = 20/5 = 4\,\mathrm{m/s^2}$. Odgovor $6\,\mathrm{m/s^2}$ pozabi trenje, $8\,\mathrm{m/s^2}$ pa trenje prišteje.

? Knjiga leži na mizi. Katera sila je po tretjem Newtonovem zakonu par sile podlage, s katero miza deluje na knjigo?
- teža knjige
~ Teža je enako velika in nasprotna, a deluje na isto telo (knjigo). Par po tretjem zakonu deluje na drugo telo.
+ sila knjige na mizo
- sila Zemlje na mizo
~ Ta sila je med Zemljo in mizo, knjiga v njej ne nastopa. Par mora biti med istima telesoma.
> Par sil po tretjem zakonu sta sili med istima telesoma: miza deluje na knjigo, knjiga pa na mizo. Teža knjige (sila Zemlje na knjigo) ni njen par, čeprav sta pri mirujoči knjigi enako veliki, ker delujeta na isto telo.

? Telo se giblje po vodoravni gladki ledeni ploskvi s stalno hitrostjo $3\,\mathrm{m/s}$, trenje je zanemarljivo. Kaj od naštetega je res za rezultanto sil na telo?
- Kaže v smeri gibanja in je večja od nič.
~ To je Timova zmota: »brez sile se nič ne giblje«. Sila v smeri gibanja bi telo pospeševala.
- Kaže nasprotno od gibanja.
~ Taka rezultanta bi telo zavirala in hitrost bi se manjšala. Tu je stalna.
+ Enaka je nič.
> Hitrost je stalna, zato je pospešek nič. Po drugem zakonu je tudi rezultanta nič. Za enakomerno gibanje sila ni potrebna.

? Nika rešuje nalogo: »Astronavt z maso $80\,\mathrm{kg}$ se v vesoljski postaji odrine od stene s silo $160\,\mathrm{N}$.« Piše: »Stena potiska astronavta s $160\,\mathrm{N}$, on steno s $160\,\mathrm{N}$ nazaj. Sili se izničita, zato je med odrivom $a = 0$.« Kje je napaka?
- Napake ni, astronavt res ne pospeši.
~ Astronavt se od stene odmakne, torej je pospešil. Sklep »$a = 0$« nasprotuje temu, kar vidimo.
- Sila stene na astronavta je manjša, ker je stena težja.
~ Po tretjem zakonu sta sili vedno enako veliki, ne glede na maso teles.
+ Sili delujeta na različni telesi, zato ju ne smemo seštevati; na astronavta deluje $160\,\mathrm{N}$ in $a = 2\,\mathrm{m/s^2}$.
- Namesto mase bi morala vzeti težo astronavta.
~ V $F_\mathrm{r} = m\,a$ nastopa masa v $\mathrm{kg}$, ne teža. Napaka je drugje.
> Na astronavta deluje le sila stene, $a = \dfrac{160\,\mathrm{N}}{80\,\mathrm{kg}} = 2\,\mathrm{m/s^2}$. Sila astronavta deluje na steno (postajo) in pospeši njo.

? Daleč od planetov enak motor deluje z enako silo najprej na sondo z maso $500\,\mathrm{kg}$, nato na sondo z maso $1000\,\mathrm{kg}$. Kako se pospeška primerjata?
- Pospeška sta enaka, ker je sila enaka.
~ Enaka sila ne pomeni enakega pospeška: $a = \dfrac{F}{m}$ je odvisen tudi od mase.
- Težja sonda ima večji pospešek.
~ Večja masa pomeni večjo vztrajnost, torej manjši pospešek pri isti sili.
+ Lažja sonda ima dvakrat večji pospešek.
> Pri isti sili je pospešek obratno sorazmeren z maso: pol manjša masa, dvakrat večji pospešek.

:::simboli
F_{\mathrm{r}} | rezultanta sil | F_\mathrm{r} = m\,a | N | F_r = 0: telo miruje ali se giblje premo enakomerno
m | masa | | kg
a | pospešek | a = \dfrac{F_\mathrm{r}}{m} | m/s^2
v | hitrost | | m/s
v_0 | začetna hitrost | | m/s
F | sila (potisna ali vlečna) | | N
F_{\mathrm{tr}} | sila trenja | | N | v tej lekciji vedno podana
\vec F_{12} | sila prvega telesa na drugo | \vec F_{21} = -\vec F_{12} | N | tretji Newtonov zakon
\vec F_{21} | sila drugega telesa na prvo | | N
F_{\mathrm{p}} | sila podlage | | N | to kaže tehtnica
F_{\mathrm{g}} | teža | F_\mathrm{g} = m\,g | N
g | težni pospešek | | m/s^2 | približno 9,8 m/s²
s | pot | s = \dfrac{1}{2}a t^2 | m | velja pri v₀ = 0
t | čas | | s
:::
