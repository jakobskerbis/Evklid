---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi leseno desko za rezanje in nanjo postavi solničko. Desko počasi dviguj na enem koncu. Solnička nekaj časa stoji, nato pa naenkrat zdrsne. Z ravnilom izmeri, kako visoko je bil dvignjen konec deske ($h$) in kolikšna je vodoravna razdalja od spodnjega konca deske do točke tik pod dvignjenim koncem ($d$).

Zdaj poskus ponovi s polno in s skoraj prazno solničko. Kaj pričakuješ: zdrsne težja prej, kasneje ali pri enakem naklonu?

Odgovor te bo morda presenetil. Do konca lekcije boš znal iz $h$ in $d$ izračunati, kako »oprijemljiva« je deska, in razložiti, zakaj lonec na pultu najprej trmasto stoji, nato pa drsi lažje, kot si pričakoval. Ista pravila povedo, zakaj avto na ledu ne ustavi in kako strm sme biti klanec, da parkiran avto ne zdrsne.

## Razlaga

**Prvi poskus: lonec na pultu.** Lonec postavimo na kuhinjski pult in ga vlečemo z dinamometrom vodoravno. Vanj postopoma nalivamo vodo, da ima z vsebino maso $1$, $2$ in $3\,\mathrm{kg}$. Pult pritiska na lonec navzgor s silo podlage, ki je enaka teži. Pri trenju ji rečemo **pritisna sila** $F_\mathrm{p}$: s to silo sta podlaga in telo stisnjena drug ob drugega. Za vsak lonec zapišemo dve sili: največjo, pri kateri lonec še stoji, in silo, ko že enakomerno drsi.

| $F_\mathrm{p}$ [N] | lonec še stoji do [N] | med drsenjem [N] |
|---|---|---|
| $9{,}8$ | $3{,}9$ | $2{,}9$ |
| $19{,}6$ | $7{,}8$ | $5{,}9$ |
| $29{,}4$ | $11{,}8$ | $8{,}8$ |

Preden bereš naprej, poišči v tabeli dva vzorca.

**Kaj opazimo.** Ko se pritisna sila podvoji, se podvojita tudi obe sili. Razmerje je stalno: v srednjem stolpcu $\dfrac{3{,}9}{9{,}8} \approx 0{,}40$ v vsaki vrstici, v desnem okoli $0{,}30$. Drugi vzorec: za premik potrebujemo vedno več sile kot za drsenje.

Še en poskus: poln tetrapak mleka vlečemo enkrat pokončno, enkrat položenega na bok. Ploskev, ki se dotika pulta, je zdaj veliko večja, sila pa ostane enaka. **Velikost stične ploskve ne vpliva.**

:::premisli
Lonec z maso $3\,\mathrm{kg}$ vlečeš s silo $6\,\mathrm{N}$ in še stoji. S kolikšno silo ga pult takrat zadržuje? Napovej, preden pogledaš.
---
Prav s $6\,\mathrm{N}$, ne z $11{,}8\,\mathrm{N}$. Lonec miruje, zato mora biti rezultanta nič: pult vrača natanko toliko, kolikor vlečeš. $11{,}8\,\mathrm{N}$ je le meja, do katere zmore.
:::

**Ime za opažanje.** Sila, ki telo zadržuje, dokler miruje, je **sila lepenja** $F_\mathrm{l}$. Prilagodi se tvoji sili, a le do največje vrednosti:

$$F_\mathrm{l,max} = k_\mathrm{l}\,F_\mathrm{p}$$

Število $k_\mathrm{l}$ je **koeficient lepenja**. Nima enote in je odvisen od obeh snovi in hrapavosti površin. Za lonec na pultu je $0{,}40$.

Ko telo drsi, deluje **sila trenja** (drsno trenje). Ta je stalna, ne glede na to, kako močno vlečeš ali kako hitro telo drsi:

$$F_\mathrm{tr} = k_\mathrm{tr}\,F_\mathrm{p}$$

Število $k_\mathrm{tr}$ je **koeficient trenja**. Skoraj vedno je $k_\mathrm{tr} < k_\mathrm{l}$, zato »premakniti« zahteva več kot »vleči naprej«. Obe sili delujeta vzdolž podlage in nasprotujeta (možnemu) drsenju.

**Drugi poskus: deska za rezanje.** Vrnimo se k solnički. Na nagnjeni deski z naklonom $\alpha$ razstavimo težo $F_\mathrm{g} = m\,g$ na dve komponenti, kot pri razstavljanju sil. Kot med težo in pravokotnico na desko je prav naklon $\alpha$, zato ob kotu leži pravokotna komponenta (kosinus):

- **dinamična komponenta** vzdolž deske navzdol, $F_\parallel = F_\mathrm{g}\sin\alpha$, ki solničko vleče po deski;
- **statična komponenta** pravokotno na desko, $F_\perp = F_\mathrm{g}\cos\alpha$, ki jo pritiska ob desko. Zato je na klancu $F_\mathrm{p} = F_\mathrm{g}\cos\alpha$, manj kot na vodoravni podlagi.

Preizkusi to v simulaciji »Trenje na klancu« spodaj: koeficient lepenja postavi na $0{,}5$ in počasi večaj naklon. Zapiši kot, pri katerem klada zdrsne. Nato spremeni maso in ponovi. Opazuj, ali se kot spremeni.

Solnička še stoji, dokler zmore lepenje: $F_\parallel \le k_\mathrm{l}\,F_\mathrm{p}$. Na meji velja $m\,g\sin\alpha = k_\mathrm{l}\,m\,g\cos\alpha$. Masa in $g$ sta na obeh straneh, zato se pokrajšata. Enačbo delimo s $\cos\alpha$ in upoštevamo $\dfrac{\sin\alpha}{\cos\alpha} = \tan\alpha$. Ostane **mejni kot** $\alpha_\mathrm{m}$:

$$\tan\alpha_\mathrm{m} = k_\mathrm{l}$$

Na deski je $\tan\alpha = \dfrac{h}{d}$, zato iz tvoje meritve dobiš kar koeficient lepenja: $k_\mathrm{l} = \dfrac{h}{d}$.

:::premisli
Polna solnička je trikrat težja od prazne. Kolikokrat večja je pri njej komponenta $F_\parallel$ in kolikokrat večje največje lepenje? Zdrsne torej pri manjšem, večjem ali enakem naklonu kot prazna?
---
Pri enakem. Polna je težja, zato jo močneje vleče navzdol, a tudi močneje pritiska ob desko in lepenje je enako večje. Masa se v pogoju pokrajša, ostane le $\tan\alpha_\mathrm{m} = k_\mathrm{l}$.
:::

**Ko že drsi.** Če je klanec strmejši od mejnega kota, telo drsi navzdol. Rezultanta vzdolž klanca je $F_\mathrm{r} = F_\parallel - F_\mathrm{tr}$, pospešek pa po 2. Newtonovem zakonu $a = \dfrac{F_\mathrm{r}}{m}$.

## Rešeni primeri

### Primer 1: deska drsi po pultu

Leseno desko z maso $1{,}2\,\mathrm{kg}$ potiskaš po kamnitem pultu, da drsi. Koeficient trenja je $0{,}25$. Kolikšna je sila trenja?

**Podatki:** $m = 1{,}2\,\mathrm{kg}$, $k_\mathrm{tr} = 0{,}25$, $g = 9{,}81\,\mathrm{m/s^2}$, podlaga vodoravna
**Iščemo:** sila trenja $F_\mathrm{tr}$

:::formula
$F_\mathrm{p} = m\,g$ (vodoravna podlaga), $F_\mathrm{tr} = k_\mathrm{tr}\,F_\mathrm{p}$
:::

**Rešitev:**

1. Na vodoravnem pultu je pritisna sila enaka teži: $F_\mathrm{p} = 1{,}2\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} \approx 11{,}8\,\mathrm{N}$.
2. Deska drsi, zato računamo s koeficientom trenja: $F_\mathrm{tr} = 0{,}25 \cdot 11{,}772\,\mathrm{N} \approx 2{,}9\,\mathrm{N}$.
3. Odgovor: sila trenja je okoli $2{,}9\,\mathrm{N}$ in kaže nasprotno smeri drsenja.

### Primer 2: ali se kuhinjski robot premakne?

Kuhinjski robot z maso $5{,}0\,\mathrm{kg}$ stoji na pultu. Koeficient lepenja je $0{,}50$. Potisneš ga vodoravno s silo $15\,\mathrm{N}$. Se premakne? Kolikšna je sila lepenja? Kolikšna sila bi ga premaknila?

**Podatki:** $m = 5{,}0\,\mathrm{kg}$, $k_\mathrm{l} = 0{,}50$, $F = 15\,\mathrm{N}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** ali se premakne, $F_\mathrm{l}$, najmanjša sila za premik

:::formula
$F_\mathrm{l,max} = k_\mathrm{l}\,F_\mathrm{p}$; telo miruje, če je $F \le F_\mathrm{l,max}$, takrat $F_\mathrm{l} = F$
:::

**Rešitev:**

1. Pritisna sila: $F_\mathrm{p} = 5{,}0\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} \approx 49\,\mathrm{N}$.
2. Meja lepenja: $F_\mathrm{l,max} = 0{,}50 \cdot 49{,}05\,\mathrm{N} \approx 24{,}5\,\mathrm{N}$.
3. Potisk $15\,\mathrm{N}$ je manjši od meje, zato robot ostane na mestu.
4. Robot miruje, zato je rezultanta nič: sila lepenja je $15\,\mathrm{N}$, ne $24{,}5\,\mathrm{N}$.
5. Odgovor: ne premakne se; pult ga zadržuje s $15\,\mathrm{N}$. Premaknila bi ga šele sila, večja od okoli $24{,}5\,\mathrm{N}$.

### Primer 3: koeficient iz domačega poskusa

Pri poskusu z začetka je solnička zdrsnila, ko je bil konec deske dvignjen $h = 18\,\mathrm{cm}$, vodoravna razdalja do spodnjega konca pa je bila $d = 36\,\mathrm{cm}$. Kolikšen je koeficient lepenja med solničko in desko? Pri kolikšnem kotu bi zdrsnila dvakrat težja solnička?

**Podatki:** $h = 18\,\mathrm{cm}$, $d = 36\,\mathrm{cm}$, solnička zdrsne na meji lepenja
**Iščemo:** $k_\mathrm{l}$ in mejni kot $\alpha_\mathrm{m}$ za težjo solničko

:::formula
$\tan\alpha_\mathrm{m} = k_\mathrm{l}$, na deski $\tan\alpha = \dfrac{h}{d}$
:::

**Rešitev:**

1. Naloga sprašuje obratno: iz kota iščemo koeficient. Na meji velja $k_\mathrm{l} = \tan\alpha_\mathrm{m}$.
2. Tangens odčitamo iz deske, enote se pokrajšajo: $\tan\alpha_\mathrm{m} = \dfrac{18}{36} = 0{,}5$, torej $k_\mathrm{l} = 0{,}50$.
3. Kot: $\alpha_\mathrm{m} \approx 26{,}6^\circ$ (tipka $\tan^{-1}$ na računalu).
4. Masa se v pogoju pokrajša, zato težja solnička zdrsne pri enakem kotu.
5. Odgovor: $k_\mathrm{l} = 0{,}50$; obe solnički zdrsneta pri naklonu okoli $27^\circ$.

### Primer 4: zdaj ti

Skodelica z maso $0{,}25\,\mathrm{kg}$ drsi po pladnju, nagnjenem za $35^\circ$. Koeficient trenja je $0{,}40$. Kolikšen je pospešek skodelice?

**Podatki:** $m = 0{,}25\,\mathrm{kg}$, $\alpha = 35^\circ$, $k_\mathrm{tr} = 0{,}40$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** pospešek $a$

:::formula
$F_\parallel = m\,g\sin\alpha$, $F_\mathrm{p} = m\,g\cos\alpha$, $F_\mathrm{tr} = k_\mathrm{tr}\,F_\mathrm{p}$, $a = \dfrac{F_\parallel - F_\mathrm{tr}}{m}$
:::

**Rešitev:**

1. Teža: $F_\mathrm{g} = 0{,}25\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} \approx 2{,}45\,\mathrm{N}$.
2. Dinamična komponenta: $F_\parallel = 2{,}4525\,\mathrm{N} \cdot \sin 35^\circ \approx 1{,}41\,\mathrm{N}$.
3. Pritisna sila je statična komponenta: $F_\mathrm{p} = 2{,}4525\,\mathrm{N} \cdot \cos 35^\circ \approx 2{,}01\,\mathrm{N}$.
4. Trenje: $F_\mathrm{tr} = 0{,}40 \cdot 2{,}009\,\mathrm{N} \approx 0{,}80\,\mathrm{N}$.
5. Zadnja dva koraka, rezultanta in pospešek, sta tvoja:

:::premisli
Koliko sta $F_\mathrm{r} = F_\parallel - F_\mathrm{tr}$ in $a = \dfrac{F_\mathrm{r}}{m}$?
---
$F_\mathrm{r} \approx 1{,}41\,\mathrm{N} - 0{,}80\,\mathrm{N} \approx 0{,}60\,\mathrm{N}$ in $a \approx \dfrac{0{,}60\,\mathrm{N}}{0{,}25\,\mathrm{kg}} \approx 2{,}4\,\mathrm{m/s^2}$ navzdol po pladnju.
:::

## Pogoste napake

- **»Sila lepenja je vedno $k_\mathrm{l}F_\mathrm{p}$.«** To je le največja vrednost. Ko robot potiskaš s $15\,\mathrm{N}$ in miruje, je lepenje $15\,\mathrm{N}$. Formulo $k_\mathrm{l}F_\mathrm{p}$ uporabi samo za vprašanje »ali se premakne«.
- **Večja ploskev, večje trenje.** Tetrapak na boku drsi enako kot pokončen. Trenje je odvisno od pritisne sile in vrste površin, ne od velikosti stične ploskve.
- **Na klancu je pritisna sila enaka teži.** Na nagnjeni deski je $F_\mathrm{p} = m\,g\cos\alpha$, kar je manj od $m\,g$. Kdor vzame $m\,g$, dobi preveliko trenje.
- **Težje telo zdrsne prej (ali kasneje).** Mejni kot je odvisen samo od $k_\mathrm{l}$, saj se masa pokrajša. Težja in lažja solnička zdrsneta pri istem naklonu.
- **Koeficient je kar sila.** $k_\mathrm{tr} = 0{,}3$ ni $0{,}3\,\mathrm{N}$. Koeficient nima enote; silo dobiš šele, ko ga pomnožiš s pritisno silo v newtonih.

## Povzetek

- Pritisna sila $F_\mathrm{p}$ stiska telo in podlago; na vodoravni podlagi je $F_\mathrm{p} = m\,g$, na klancu $F_\mathrm{p} = m\,g\cos\alpha$.
- Lepenje: dokler telo miruje, je sila lepenja enaka sili, ki ga hoče premakniti, največ $F_\mathrm{l,max} = k_\mathrm{l}\,F_\mathrm{p}$.
- Drsenje: $F_\mathrm{tr} = k_\mathrm{tr}\,F_\mathrm{p}$, neodvisno od hitrosti in velikosti stične ploskve; običajno $k_\mathrm{tr} < k_\mathrm{l}$.
- Koeficienta nimata enote; odvisna sta od para snovi.
- Na klancu: dinamična komponenta $F_\parallel = m\,g\sin\alpha$, statična $F_\perp = m\,g\cos\alpha$.
- Telo na klancu zdrsne, ko je $\tan\alpha > k_\mathrm{l}$; mejni kot $\tan\alpha_\mathrm{m} = k_\mathrm{l}$ ni odvisen od mase.
- Pri drsenju po klancu: $F_\mathrm{r} = F_\parallel - F_\mathrm{tr}$, $a = \dfrac{F_\mathrm{r}}{m}$.

## Drugače: Korak za korakom s številkami

Vprašanje »ali telo zdrsne in kako hitro pospešuje« vedno rešiš po istem vrstnem redu. Primer: sklednica z maso $2{,}0\,\mathrm{kg}$ na deski z naklonom $30^\circ$, $k_\mathrm{l} = 0{,}50$, $k_\mathrm{tr} = 0{,}40$.

1. Teža: $F_\mathrm{g} = 2{,}0\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} \approx 19{,}6\,\mathrm{N}$.
2. Razstavi jo. Vzdolž deske: $F_\parallel = 19{,}62\,\mathrm{N} \cdot \sin 30^\circ \approx 9{,}8\,\mathrm{N}$. Pravokotno: $F_\mathrm{p} = 19{,}62\,\mathrm{N} \cdot \cos 30^\circ \approx 17{,}0\,\mathrm{N}$.
3. Meja lepenja: $F_\mathrm{l,max} = 0{,}50 \cdot 16{,}99\,\mathrm{N} \approx 8{,}5\,\mathrm{N}$.
4. Primerjaj: $9{,}8\,\mathrm{N} > 8{,}5\,\mathrm{N}$, zato sklednica zdrsne. (Hitra kontrola: $\tan 30^\circ \approx 0{,}58 > 0{,}50$.)
5. Ko drsi, velja drsno trenje: $F_\mathrm{tr} = 0{,}40 \cdot 16{,}99\,\mathrm{N} \approx 6{,}8\,\mathrm{N}$.
6. Rezultanta: $F_\mathrm{r} \approx 9{,}8\,\mathrm{N} - 6{,}8\,\mathrm{N} = 3{,}0\,\mathrm{N}$.
7. Pospešek: $a \approx \dfrac{3{,}0\,\mathrm{N}}{2{,}0\,\mathrm{kg}} = 1{,}5\,\mathrm{m/s^2}$.

Če bi bil v koraku 4 znak obrnjen, bi sklednica ostala na mestu: telo miruje, lepenje je enako $F_\parallel$, pospeška ni.

## Drugače: Kot zgodba

Nika pospravlja kuhinjo in hoče omaro z lonci premakniti za pol metra. Upre se vanjo. Nič. Upre se močneje. Še vedno nič, a omara »vrača« vsak njen potisk natanko toliko, kolikor ga da. To je lepenje: tiho se prilagaja.

Potem Nika pritisne še malo bolj in omara naenkrat popusti. Presenečena skoraj pade naprej, ker zdaj potrebuje opazno manj sile, da omara drsi naprej. Lepenje je popustilo, nadomestilo ga je šibkejše drsno trenje.

Brat ji svetuje: »Najprej pospravi lonce ven.« Nika jih zloži na mizo in omara se premakne že pri polovičnem potisku. Manjša teža pomeni manjšo pritisno silo, zato sta manjša tudi lepenje in trenje.

Na koncu jo zanima, ali bi pomagalo, če omaro prevrne na hrbet, da se tal dotika večja ploskev. Ne bi: trenje se ne meni za velikost ploskve, le za pritisno silo in to, iz česa so tla in omara.

## Preveri se

? Isti lonec vlečemo enakomerno po pultu in vanj nalivamo vodo. Katera tabela ustreza drsnemu trenju? (zapis: $F_\mathrm{p} \to F_\mathrm{tr}$)
- $10\,\mathrm{N} \to 3\,\mathrm{N}$, $20\,\mathrm{N} \to 3\,\mathrm{N}$, $30\,\mathrm{N} \to 3\,\mathrm{N}$
~ Trenje ni stalna lastnost lonca. Ko je lonec težji, ga pult močneje pritiska in trenje je večje.
+ $10\,\mathrm{N} \to 3\,\mathrm{N}$, $20\,\mathrm{N} \to 6\,\mathrm{N}$, $30\,\mathrm{N} \to 9\,\mathrm{N}$
- $10\,\mathrm{N} \to 9\,\mathrm{N}$, $20\,\mathrm{N} \to 6\,\mathrm{N}$, $30\,\mathrm{N} \to 3\,\mathrm{N}$
~ Trenje s pritisno silo ne pada, ampak raste.
- $10\,\mathrm{N} \to 3\,\mathrm{N}$, $20\,\mathrm{N} \to 4\,\mathrm{N}$, $30\,\mathrm{N} \to 5\,\mathrm{N}$
~ Trenje sicer raste, a ni premo sorazmerno; razmerje $F_\mathrm{tr}/F_\mathrm{p}$ bi se spreminjalo.
> $F_\mathrm{tr} = k_\mathrm{tr}\,F_\mathrm{p}$: dvakratna pritisna sila da dvakratno trenje, razmerje je stalno $0{,}3$.

? Po pultu potiskaš poln lonec z maso okoli $3\,\mathrm{kg}$, $k_\mathrm{tr} \approx 0{,}3$. Približno kolikšno silo potrebuješ, da enakomerno drsi?
- okoli $1\,\mathrm{N}$
~ Koeficient si pomnožil z maso, ne s pritisno silo. Najprej izračunaj težo, okoli $30\,\mathrm{N}$.
+ okoli $9\,\mathrm{N}$
- okoli $30\,\mathrm{N}$
~ To je teža lonca. Potrebna je le sila trenja, ki je del pritisne sile.
- okoli $90\,\mathrm{N}$
~ Težo si pomnožil še z maso, namesto s koeficientom. Trenje je le del teže, ker je koeficient manjši od $1$.
> Pritisna sila je okoli $3 \cdot 10\,\mathrm{N} = 30\,\mathrm{N}$, trenje $0{,}3 \cdot 30\,\mathrm{N} \approx 9\,\mathrm{N}$. Pri enakomernem drsenju mora tvoja sila uravnovesiti trenje.

? Zakaj polna in prazna solnička zdrsneta z deske pri enakem naklonu?
- Ker imata enako veliko dno, trenje pa je odvisno od ploskve.
~ Ploskev na trenje ne vpliva. Razlog je v tem, kako se spremenita obe sili s težo.
+ Ker sta dinamična komponenta teže in največje lepenje obe sorazmerni z maso, zato se masa pokrajša.
- Ker imata enako težo.
~ Polna je težja. Ravno zato je zanimivo, da zdrsne pri istem kotu.
> Na meji velja $m\,g\sin\alpha = k_\mathrm{l}\,m\,g\cos\alpha$. Masa je na obeh straneh, ostane $\tan\alpha_\mathrm{m} = k_\mathrm{l}$.

? Skodelica na pladnju začne drseti, ko je pladenj nagnjen za $30^\circ$. Kolikšen je koeficient lepenja?
- $0{,}50$
~ To je $\sin 30^\circ$. Na meji lepenja je koeficient enak tangensu kota.
+ približno $0{,}58$
- približno $0{,}87$
~ To je $\cos 30^\circ$. Pravilno je razmerje $\dfrac{\sin\alpha}{\cos\alpha} = \tan\alpha$.
- $30$
~ Koeficient ni kot v stopinjah; je število brez enote, navadno manjše od $1$.
> Na meji velja $k_\mathrm{l} = \tan\alpha_\mathrm{m} = \tan 30^\circ \approx 0{,}58$.

? Pri silovitem zaviranju sistem ABS preprečuje, da bi se kolesa zablokirala in drsela po cesti. Zakaj se avto tako ustavi na krajši poti?
- Ker se kolesa vrtijo, je stična ploskev večja.
~ Velikost ploskve ne vpliva na trenje. Odloča, ali guma po cesti drsi ali ne.
- Ker je pri manjši hitrosti trenje večje.
~ Drsno trenje ni odvisno od hitrosti.
+ Guma, ki se kotali, po cesti ne drsi, zato deluje lepenje, ki je lahko večje od drsnega trenja.
> Ker je $k_\mathrm{l} > k_\mathrm{tr}$, je največja sila lepenja večja od sile trenja. Zablokirano kolo drsi in zavira samo s trenjem.

:::simboli
F_\mathrm{p} | pritisna sila | F_\mathrm{p} = m\,g\cos\alpha | N | na vodoravni podlagi $F_\mathrm{p} = m\,g$
F_\mathrm{l} | sila lepenja | | N | enaka sili, ki hoče telo premakniti
F_\mathrm{l,max} | največja sila lepenja | F_\mathrm{l,max} = k_\mathrm{l}\,F_\mathrm{p} | N
k_\mathrm{l} | koeficient lepenja | k_\mathrm{l} = \tan\alpha_\mathrm{m} | – | odvisen od para snovi
F_\mathrm{tr} | sila trenja (drsno trenje) | F_\mathrm{tr} = k_\mathrm{tr}\,F_\mathrm{p} | N
k_\mathrm{tr} | koeficient trenja | | – | običajno manjši od $k_\mathrm{l}$
F_\mathrm{g} | teža | F_\mathrm{g} = m\,g | N
m | masa | | kg
g | težni pospešek | | m/s^2 | približno $9{,}81\,\mathrm{m/s^2}$
\alpha | naklon klanca (deske) | | °
\alpha_\mathrm{m} | mejni kot, pri katerem telo zdrsne | \tan\alpha_\mathrm{m} = k_\mathrm{l} | °
F_\parallel | dinamična komponenta teže | F_\parallel = F_\mathrm{g}\sin\alpha | N | vzdolž klanca navzdol
F_\perp | statična komponenta teže | F_\perp = F_\mathrm{g}\cos\alpha | N | pravokotno na klanec
h | višina dvignjenega konca deske | | m
d | vodoravna razdalja pod desko | | m
F | sila, s katero potiskaš | | N
F_\mathrm{r} | rezultanta vzdolž klanca | F_\mathrm{r} = F_\parallel - F_\mathrm{tr} | N
a | pospešek | a = \frac{F_\mathrm{r}}{m} | m/s^2
:::
