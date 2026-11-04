---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

**Uganka.** Telefon leži na armaturni plošči avtomobila. Avto naglo spelje in telefon zdrsne nazaj, proti tebi. Kaj je potisnilo telefon nazaj?

Preden bereš naprej, zapiši svoj odgovor. Rešitev je v prvem delu razlage.

Uganko, varnostni pas, let drona in odrin rakete razložijo **trije Newtonovi zakoni**. Povedo, kaj sila naredi s telesom: kdaj se hitrost ne spremeni, za koliko se spremeni in zakaj sile vedno nastopajo v parih. Uporabljajo jih inženirji, ki načrtujejo varnostne pasove, drone in tudi pospeškomer v tvojem telefonu.

## Razlaga

Vsak zakon postavimo ob nekaj, kar že poznaš, in pogledamo, v čem se razlikujeta.

**1. Od ravnovesja do prvega zakona.** Iz 8. razreda veš: če na telo delujeta dve enako veliki, nasprotni sili na isti premici, je **rezultanta** (ena sila z enakim učinkom kot vse sile skupaj) enaka nič. Telo, ki miruje, ostane v miru.

Novo je to, da enako velja za telo, ki se že giblje. **Prvi Newtonov zakon (zakon o ravnovesju ali vztrajnostni zakon):** če je rezultanta sil na telo nič, telo miruje ali se giblje enakomerno po premici.

Za sile sta torej mirovanje in enakomerno premo gibanje *enaka* stanja. Za gibanje s stalno hitrostjo rezultanta ni potrebna. Potrebna je šele za **spremembo** velikosti ali smeri hitrosti.

Lastnost telesa, da ohranja svoje gibanje, imenujemo **vztrajnost**. Večja ko je masa, večja je vztrajnost.

*Rešitev uganke:* nazaj telefona ni potisnilo nič. Telefon je zaradi vztrajnosti ostal skoraj na mestu, avto pa je pospešil naprej pod njim. Trenje med telefonom in ploščo je bilo premajhno, da bi telefon pospešilo skupaj z avtom.

:::premisli
Vesoljska sonda daleč od planetov in zvezd ugasne motor. Napovej: kaj se zgodi z njeno hitrostjo?
---
Ostane enaka po velikosti in smeri. Tam ni zraka ne trenja, rezultanta je skoraj nič, zato sonda leti naprej enakomerno premo, tudi več let.
:::

**2. Od rezultante nič do rezultante, ki ni nič.** Kaj pa, če sile niso v ravnovesju? Takrat se hitrost telesa spreminja, telo **pospešuje**. **Pospešek** $a$ pove, za koliko se hitrost spremeni v vsaki sekundi; enota je $\mathrm{m/s^2}$. Pospešek $2\,\mathrm{m/s^2}$ pomeni, da hitrost vsako sekundo naraste za $2\,\mathrm{m/s}$.

**Drugi Newtonov zakon:** pospešek je premo sorazmeren z rezultanto in obratno sorazmeren z maso:

$$a = \frac{F}{m}$$

$$F = m \cdot a$$

Tu je $F$ rezultanta v newtonih, $m$ masa v kilogramih in $a$ pospešek. Pospešek ima **smer rezultante**. Od tod izhaja enota sile: $1\,\mathrm{N} = 1\,\mathrm{kg \cdot m/s^2}$. Sila $1\,\mathrm{N}$ da telesu z maso $1\,\mathrm{kg}$ pospešek $1\,\mathrm{m/s^2}$.

| Masa $m$ | Rezultanta $F$ | Pospešek $a$ |
|---|---|---|
| $2\,\mathrm{kg}$ | $10\,\mathrm{N}$ | $5\,\mathrm{m/s^2}$ |
| $2\,\mathrm{kg}$ | $20\,\mathrm{N}$ | $10\,\mathrm{m/s^2}$ |
| $4\,\mathrm{kg}$ | $20\,\mathrm{N}$ | $5\,\mathrm{m/s^2}$ |
| $4\,\mathrm{kg}$ | $0\,\mathrm{N}$ | $0\,\mathrm{m/s^2}$ |

Iz prve v drugo vrstico se sila podvoji in pospešek tudi. Iz druge v tretjo se podvoji masa, pospešek se prepolovi. Zadnja vrstica je spet prvi zakon.

V simulaciji spodaj (»Sila, masa in pospešek«, podlaga brez trenja) nastavi vlečno silo $10\,\mathrm{N}$ in maso $5\,\mathrm{kg}$ ter klikni Spusti. Nato podvoji oboje. Opazi: premica na grafu hitrosti je obakrat enako strma, pospešek je $2\,\mathrm{m/s^2}$. Če med gibanjem vlečno silo postaviš na nič, se klada giblje naprej s stalno hitrostjo.

**Teža.** Teža je sila, s katero Zemlja privlači telo:

$$F_g = m \cdot g$$

Tu je $g \approx 10\,\mathrm{N/kg} = 10\,\mathrm{m/s^2}$ težni pospešek. Masa ($\mathrm{kg}$) pove, koliko snovi je v telesu, teža ($\mathrm{N}$) je sila. Telefon z maso $0{,}2\,\mathrm{kg}$ ima težo $2\,\mathrm{N}$.

**3. Od ravnovesja dveh sil do vzajemnega učinka.** **Tretji Newtonov zakon (zakon o vzajemnem učinku):** če prvo telo deluje na drugo s silo, deluje drugo telo na prvo z enako veliko, nasprotno usmerjeno silo:

$$\vec F_{1\to 2} = -\vec F_{2\to 1}$$

Ta par je na prvi pogled podoben ravnovesju dveh sil. Razlika je v tem, na katero telo sili delujeta:

| | Ravnovesje dveh sil | Par po 3. zakonu |
|---|---|---|
| Na katero telo | obe na isto telo | vsaka na drugo telo |
| Velikost, smer | enaki, nasprotni | enaki, nasprotni |
| Se izničita? | da, rezultanta je nič | ne |
| Telefon na mizi | teža in sila mize na telefon | telefon na mizo, miza na telefon |

Sili para nastaneta in izgineta hkrati. Velja vedno: ko telesi mirujeta, pospešujeta ali trčita.

:::premisli
Zakaj dron s propelerji ne bi mogel leteti v prostoru brez zraka, na primer na Luni?
---
Propelerji potiskajo zrak navzdol, zrak pa po 3. zakonu potiska dron navzgor. Brez zraka propelerji nimajo česa odriniti, zato ni sile navzgor.
:::

## Rešeni primeri

### Primer 1: avtek na daljinsko upravljanje

Na avtek z maso $0{,}5\,\mathrm{kg}$ deluje vodoravna rezultanta $2\,\mathrm{N}$. Kolikšen je njegov pospešek?

**Podatki:** $m = 0{,}5\,\mathrm{kg}$, $F = 2\,\mathrm{N}$
**Iščemo:** pospešek $a$

:::formula
Drugi Newtonov zakon: $a = \dfrac{F}{m}$
:::

**Rešitev:**

1. Rezultanta je že dana, zato takoj uporabimo drugi zakon.
2. $a = \dfrac{2\,\mathrm{N}}{0{,}5\,\mathrm{kg}} = 4\,\mathrm{m/s^2}$.
3. Odgovor: avtek pospešuje s $4\,\mathrm{m/s^2}$ v smeri rezultante; vsako sekundo je za $4\,\mathrm{m/s}$ hitrejši.

### Primer 2: dron se dviga

Dron z maso $1{,}5\,\mathrm{kg}$ se dviga navpično. Propelerji ga potiskajo navzgor s silo $24\,\mathrm{N}$, upor zraka zanemarimo. Kolikšen je pospešek drona?

**Podatki:** $m = 1{,}5\,\mathrm{kg}$, sila propelerjev $F_p = 24\,\mathrm{N}$ navzgor, $g = 10\,\mathrm{N/kg}$
**Iščemo:** pospešek $a$

:::formula
$F_g = m \cdot g$, rezultanta $F = F_p - F_g$, nato $a = \dfrac{F}{m}$
:::

**Rešitev:**

1. Teža kaže navzdol, zato jo moramo upoštevati: $F_g = 1{,}5 \cdot 10 = 15\,\mathrm{N}$.
2. Sili sta nasprotni, zato ju odštejemo: $F = 24\,\mathrm{N} - 15\,\mathrm{N} = 9\,\mathrm{N}$ navzgor.
3. $a = \dfrac{9\,\mathrm{N}}{1{,}5\,\mathrm{kg}} = 6\,\mathrm{m/s^2}$.
4. Odgovor: dron pospešuje navzgor s $6\,\mathrm{m/s^2}$. Če bi propelerji dajali natanko $15\,\mathrm{N}$, bi dron lebdel ali se dvigal s stalno hitrostjo.

### Primer 3: kaj pokaže telefon v avtu

Telefon, pritrjen v nosilcu, z aplikacijo za pospeškomer izmeri, da avto pospešuje s $2\,\mathrm{m/s^2}$. Avto ima maso $1200\,\mathrm{kg}$, upor zraka in kotalno trenje ga skupaj zavirata s $400\,\mathrm{N}$. S kolikšno silo ga poganja motor?

**Podatki:** $a = 2\,\mathrm{m/s^2}$, $m = 1200\,\mathrm{kg}$, zaviralna sila $F_u = 400\,\mathrm{N}$
**Iščemo:** silo motorja $F_m$

:::formula
Rezultanta iz drugega zakona: $F = m \cdot a$; ker je $F = F_m - F_u$, je $F_m = F + F_u$
:::

**Rešitev:**

1. Najprej rezultanta, ker jo določa pospešek: $F = 1200 \cdot 2 = 2400\,\mathrm{N}$.
2. Motor mora dati rezultanto in še premagati zaviranje: $F_m = 2400\,\mathrm{N} + 400\,\mathrm{N} = 2800\,\mathrm{N}$.
3. Odgovor: motor poganja avto s silo $2800\,\mathrm{N}$.
4. Za povrh: telefonu z maso $0{,}2\,\mathrm{kg}$ mora nosilec dati silo $0{,}2 \cdot 2 = 0{,}4\,\mathrm{N}$ naprej. Na armaturni plošči mora to silo dati trenje. Ko avto spelje naglo, je potrebna sila večja, kot jo trenje zmore, zato je telefon v uganki zdrsnil.

### Primer 4 – zdaj ti: odrin robotkov

Dva robotka na kolescih stojita drug ob drugem. Prvi ima maso $0{,}4\,\mathrm{kg}$, drugi $0{,}8\,\mathrm{kg}$. Vzmet med njima ju odrine: na prvega deluje s silo $2{,}4\,\mathrm{N}$. Trenje zanemarimo. Kolikšna sta pospeška robotkov?

**Podatki:** $m_1 = 0{,}4\,\mathrm{kg}$, $m_2 = 0{,}8\,\mathrm{kg}$, $F = 2{,}4\,\mathrm{N}$
**Iščemo:** pospeška $a_1$ in $a_2$

:::formula
3. zakon: na drugega deluje enako velika sila; nato $a_1 = \dfrac{F}{m_1}$ in $a_2 = \dfrac{F}{m_2}$
:::

**Rešitev:**

1. Po 3. zakonu je tudi sila na drugega robotka $2{,}4\,\mathrm{N}$, le v nasprotno smer.
2. Na vsakega uporabi drugi zakon z njegovo maso.
3. Izračunaj sam, nato preveri:

:::premisli
Koliko sta $a_1 = \dfrac{2{,}4\,\mathrm{N}}{0{,}4\,\mathrm{kg}}$ in $a_2 = \dfrac{2{,}4\,\mathrm{N}}{0{,}8\,\mathrm{kg}}$?
---
$a_1 = 6\,\mathrm{m/s^2}$ in $a_2 = 3\,\mathrm{m/s^2}$, v nasprotnih smereh. Sili sta enaki, lažji robotek pa dobi dvakrat večji pospešek.
:::

## Pogoste napake

- **»Brez sile ni gibanja.«** Za stalno hitrost rezultanta ni potrebna. Če se škatla giblje enakomerno, sta vlečna sila in trenje enako veliki.
- **Ena sila namesto rezultante.** V $F = m \cdot a$ gre rezultanta: od vlečne sile odštej trenje, od sile propelerjev težo.
- **»Večje telo deluje z večjo silo.«** Po 3. zakonu sta sili para vedno enako veliki. Različna sta le pospeška, ker imata telesi različni masi.
- **»Sili para se izničita.«** Ne, ker delujeta na različni telesi. Izničita se le sili na isto telo.
- **Masa in teža.** »Tehtam $50\,\mathrm{kg}$« govori o masi. Teža je sila: $F_g = m \cdot g = 500\,\mathrm{N}$. V formulo za težo vstaviš maso v kilogramih, ne newtonov.

## Povzetek

- **1. zakon (zakon o ravnovesju):** če je rezultanta nič, telo miruje ali se giblje enakomerno premo. Vztrajnost: telo ohranja svoje gibanje.
- **2. zakon:** $F = m \cdot a$, pospešek ima smer rezultante; $1\,\mathrm{N} = 1\,\mathrm{kg \cdot m/s^2}$.
- **Teža:** $F_g = m \cdot g$, $g \approx 10\,\mathrm{N/kg}$; masa je v $\mathrm{kg}$, teža v $\mathrm{N}$.
- **3. zakon (zakon o vzajemnem učinku):** sili para sta enako veliki, nasprotni in delujeta na različni telesi, zato se ne izničita.
- Pri nalogi: vse sile na telo, nato rezultanta, nato $a = F/m$.

## Drugače: Na sliki

Telo nariši kot kvadrat, vsako silo nanj kot puščico iz njega. Dolžina puščice pove velikost.

- Škatla, ki jo vlečeš: teža navzdol, sila tal navzgor, vlečna sila desno, trenje levo.
- Navpični puščici sta enako dolgi, zato se škatla navpično ne premika.
- Če je desna puščica daljša od leve, kaže rezultanta desno in škatla pospešuje desno. Če sta enako dolgi, se škatla giblje s stalno hitrostjo ali miruje.

Za 3. zakon nariši **dve** telesi, na primer telefon in mizo. Puščica »telefon na mizo« izhaja iz mize in kaže navzdol, puščica »miza na telefon« izhaja iz telefona in kaže navzgor. Ker sta na različnih kvadratih, ju ne moreš sešteti.

V simulaciji spodaj so vse puščice v istem merilu. Izberi podlago »les na lesu« in počasi večaj vlečno silo. Dokler lepenje (trenje, ki drži klado pri miru) zdrži, sta puščici vlečne sile in lepenja enako dolgi, rezultanta je nič in klada miruje.

## Drugače: Iz vsakdanjega življenja

- **Varnostni pas:** ko avto naglo zavre, telo zaradi vztrajnosti nadaljuje naprej. Pas mu da silo nazaj in ga ustavi skupaj z avtom.
- **Telefon v torbi:** ko avtobus zavre, torba zdrsne naprej po sedežu. Ni je potisnilo nič, gibala se je naprej, sedež pa jo je premalo zaviral.
- **Nakupovalni voziček:** prazen pospešiš z majhno silo, poln potrebuje večjo za enak pospešek. To je $F = m \cdot a$.
- **Plavanje in čoln:** z rokami ali veslom potiskaš vodo nazaj, voda potiska tebe naprej.
- **Raketa:** iz šob izriva pline nazaj, plini potiskajo raketo naprej. Zato raketa leti tudi v vesolju, kjer zraka ni.
- **Poskok:** odrineš tla navzdol, tla odrinejo tebe navzgor.

## Preveri se

? Telefon leži na sedežu avta. Avto naglo zavre in telefon zdrsne naprej s sedeža. Zakaj?
- Zavore so ga potisnile naprej.
~ Zavore delujejo na kolesa avta, ne na telefon.
- Med zaviranjem nanj deluje sila naprej, sicer se ne bi gibal.
~ To je zmota »brez sile ni gibanja«. Telefon se je že gibal in je gibanje ohranil.
+ Zaradi vztrajnosti se je gibal naprej, trenje sedeža pa ga ni moglo ustaviti tako hitro kot avto.
> Po 1. zakonu telo ohranja hitrost, dokler je rezultanta ne spremeni. Avto je zavirala velika sila cestišča, telefon pa le šibko trenje, zato se je ustavljal počasneje.

? Samo ena od teh trditev drži. Katera?
- Za gibanje s stalno hitrostjo potrebuješ rezultanto v smeri gibanja.
~ To je zmota »brez sile ni gibanja«. Pri stalni hitrosti je rezultanta nič.
+ Pospešek telesa ima smer rezultante sil nanj.
- Sili vzajemnega učinka se izničita, ker sta nasprotni.
~ Delujeta na različni telesi, zato ju ne seštevamo.
- Maso merimo v newtonih.
~ V newtonih merimo silo, tudi težo. Masa je v kilogramih.
> Iz $F = m \cdot a$: pospešek je rezultanta, deljena z maso, in kaže v smer rezultante.

? Dostavni robot z maso $20\,\mathrm{kg}$ poganja motor s silo $100\,\mathrm{N}$, trenje in upor ga zavirata s $40\,\mathrm{N}$. Kolikšen je pospešek robota?
- $5\,\mathrm{m/s^2}$
~ Pozabil si na zaviranje. V $a = F/m$ vstavimo rezultanto, ne le sile motorja.
- $7\,\mathrm{m/s^2}$
~ Sili si seštel. Zaviralna sila kaže nazaj, zato jo odštejemo.
+ $3\,\mathrm{m/s^2}$
- $1200\,\mathrm{m/s^2}$
~ Rezultanto si pomnožil z maso. Pospešek dobiš z deljenjem.
> $F = 100\,\mathrm{N} - 40\,\mathrm{N} = 60\,\mathrm{N}$, $a = \dfrac{60\,\mathrm{N}}{20\,\mathrm{kg}} = 3\,\mathrm{m/s^2}$.

? Nik je rešil nalogo: »Dron z maso $2\,\mathrm{kg}$ propelerji potiskajo navzgor s $30\,\mathrm{N}$. Pospešek je $a = \dfrac{30}{2} = 15\,\mathrm{m/s^2}$.« Ali ima prav?
- Ima prav.
~ Na dron deluje tudi teža navzdol. V drugi zakon gre rezultanta.
+ Nima prav, pozabil je na težo: rezultanta je $30\,\mathrm{N} - 20\,\mathrm{N} = 10\,\mathrm{N}$, zato je $a = 5\,\mathrm{m/s^2}$.
- Nima prav, moral bi množiti: $a = 30 \cdot 2 = 60\,\mathrm{m/s^2}$.
~ Iz $F = m \cdot a$ sledi $a = F/m$, torej delimo.
- Nima prav, maso bi moral zapisati v newtonih, $20\,\mathrm{N}$, in deliti s tem.
~ V $a = F/m$ je masa v kilogramih. V newtonih je teža, ki jo potrebuješ za rezultanto.
> $F_g = 2 \cdot 10 = 20\,\mathrm{N}$, $F = 30\,\mathrm{N} - 20\,\mathrm{N} = 10\,\mathrm{N}$, $a = \dfrac{10\,\mathrm{N}}{2\,\mathrm{kg}} = 5\,\mathrm{m/s^2}$ navzgor.

? Tovornjak in majhen avto trčita. Primerjaj sili, s katerima med trkom delujeta drug na drugega.
- Tovornjak deluje z večjo silo, ker ima večjo maso.
~ Masa vpliva na pospešek, ne na velikost sile para. Sili sta enaki.
+ Sili sta enako veliki in nasprotni; avto dobi večji pospešek, ker ima manjšo maso.
- Sili sta enaki, zato se izničita in se nobenemu nič ne zgodi.
~ Sili delujeta na različni vozili, zato se ne izničita: vsako vozilo dobi svoj pospešek.
> Po 3. zakonu sta sili enako veliki. Po $a = F/m$ ima lažji avto večji pospešek, zato je v njem trk hujši.

:::simboli
a | pospešek | a = \dfrac{F}{m} | m/s^2
F | rezultanta sil | F = m \cdot a | N | v Primeru 4 sila vzmeti
m | masa | | kg
F_g | teža | F_g = m \cdot g | N
g | težni pospešek | | N/kg | približno $10\,\mathrm{N/kg} = 10\,\mathrm{m/s^2}$
\vec F_{1\to 2} | sila prvega telesa na drugo | \vec F_{1\to 2} = -\vec F_{2\to 1} | N | tretji Newtonov zakon
\vec F_{2\to 1} | sila drugega telesa na prvo | | N
F_p | sila propelerjev | | N
F_m | sila motorja | F_m = F + F_u | N
F_u | zaviralna sila (upor in trenje) | | N
m_1 | masa prvega robotka | | kg
m_2 | masa drugega robotka | | kg
a_1 | pospešek prvega robotka | a_1 = \dfrac{F}{m_1} | m/s^2
a_2 | pospešek drugega robotka | a_2 = \dfrac{F}{m_2} | m/s^2
:::
