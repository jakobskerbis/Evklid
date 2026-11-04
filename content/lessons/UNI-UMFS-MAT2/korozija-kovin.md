---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

»Bakreni žleb kar pritrdi s pocinkanimi jeklenimi vijaki,« svetuje sošolec, ki med počitnicami pomaga kleparju. »Baker je obstojen, cink tudi, skupaj bosta zdržala še bolj. Rja je navadna kemija s kisikom, kovine se med seboj nič ne brigajo.«

Po dveh deževnih zimah so glave vijakov razjedene in žleb se povesi. Sošolec se je zmotil v dveh točkah. Korozija v vlagi ni le reakcija s kisikom, ampak **elektrokemijski proces** s tokom elektronov. Dve različni kovini v stiku pa se zelo »brigata« druga za drugo: ena začne žrtvovati sebe.

Ko razumeš, kako deluje ta drobna »baterija« iz dveh kovin in vode, znaš povedati, katera kovina v paru korodira, koliko kovine odnese tok in katera **vrsta korozije** grozi spoju. Škoda zaradi korozije po ocenah dosega nekaj odstotkov bruto domačega proizvoda. Velik del bi preprečila prava izbira materiala in spoja.

## Razlaga

Korozijo sestavimo po gradnikih. Vsakega preveri z enim vprašanjem.

**Gradnik 1: kovina oddaja elektrone.** Atom železa na površini preide v vodo kot ion in v kovini pusti dva elektrona:

$$\mathrm{Fe} \rightarrow \mathrm{Fe^{2+}} + 2e^-$$

To je **oksidacija**. Mesto, kjer poteka, se imenuje **anoda**. Kovina na anodi se raztaplja, to je korozija.

*Preveri:* Kako se zapiše oksidacija aluminija? (Odgovor: $\mathrm{Al} \rightarrow \mathrm{Al^{3+}} + 3e^-$.)

**Gradnik 2: elektroni morajo nekam.** Kovina ne more kopičiti elektronov, zato jih porabi druga reakcija. To je **redukcija** na **katodi**. V nevtralni ali bazični vodi z raztopljenim kisikom poteka

$$\mathrm{O_2} + 2\mathrm{H_2O} + 4e^- \rightarrow 4\,\mathrm{OH^-}$$

v kislini pa $2\mathrm{H^+} + 2e^- \rightarrow \mathrm{H_2}$. Ioni $\mathrm{Fe^{2+}}$ in $\mathrm{OH^-}$ se srečajo v vodi, nastane $\mathrm{Fe(OH)_2}$, ta se s kisikom oksidira naprej v rjo, hidratiziran železov oksid.

*Preveri:* Koliko elektronov porabi ena molekula $\mathrm{O_2}$? (Odgovor: štiri.)

**Gradnik 3: korozijski člen.** Anoda in katoda tvorita **korozijski člen**, majhno kratko sklenjeno baterijo. Deluje le, če so izpolnjeni štirje pogoji:

1. anoda, kjer kovina oddaja elektrone;
2. katoda, kjer se elektroni porabijo;
3. **elektrolit** (voda z ioni), ki med njima prevaja ione;
4. električni stik skozi kovino, po katerem tečejo elektroni.

Odstrani enega in korozija skoraj obstane. Anoda in katoda sta lahko na istem kosu jekla, na primer pod kapljico vode, v katero se skozi površino raztaplja kisik.

:::premisli
Napovej, preden bereš naprej: kje pod kapljico se bo jeklo raztapljalo, ob robu kapljice ali v njeni sredini?
---
V sredini. Ob robu je plast vode tanka in kisik hitro pride do kovine, zato je tam katoda. V sredini kisika primanjkuje, tam je anoda. Rja se izloči v obroču med njima, kjer se $\mathrm{Fe^{2+}}$ sreča z $\mathrm{OH^-}$.
:::

*Preveri:* Zakaj jeklena ograja v suhi puščavi komaj kaj rjavi? (Odgovor: ni elektrolita, pogoj 3 manjka.)

**Gradnik 4: katera kovina je anoda.** Pri dveh kovinah v stiku odloča **elektrodni potencial** $E$, napetost kovine v elektrolitu, merjena proti standardni vodikovi elektrodi. Kovina z bolj negativnim potencialom je manj plemenita, postane anoda in korodira. Plemenitejša postane katoda in je zaščitena. Gonilna napetost je **razlika potencialov** $\Delta E$:

$$\Delta E = E_k - E_a$$

Pri tem je $E_k$ standardni potencial katode, $E_a$ pa anode.

| kovina | $E^\circ$ [V] | v morski vodi |
|---|---|---|
| zlato | $+1{,}50$ | najbolj plemenito |
| baker | $+0{,}34$ | plemenit |
| železo | $-0{,}44$ | neplemenito |
| cink | $-0{,}76$ | zelo neplemenit |
| aluminij | $-1{,}66$ | med cinkom in železom (pasiven) |

Standardni potenciali veljajo za čiste kovine v raztopini lastnih ionov s koncentracijo $1\,\mathrm{mol/L}$. V resničnem okolju je zanesljivejša **galvanska vrsta**, izmerjena na primer v morski vodi. Aluminij, titan in nerjavno jeklo tam prekrije tanka oksidna **pasivna plast**, zato se obnašajo plemeniteje, kot kaže tabela.

*Preveri:* Bakrena cev in jeklena objemka sta v stiku. Kaj korodira? (Odgovor: jeklo, ker ima bolj negativen potencial.)

**Gradnik 5: koliko kovine odnese tok.** Vsak ion, ki zapusti anodo, odnese $z$ elektronov. Po **Faradayevem zakonu** je masa raztopljene kovine

$$m = \frac{I\,t\,M}{z\,F}$$

kjer je $I$ korozijski tok, $t$ čas, $M$ molska masa, $z$ število oddanih elektronov na atom in $F = 96\,485\,\mathrm{C/mol}$ Faradayeva konstanta. Konstrukterja bolj zanima stanjšanje stene $h$. To je prostornina raztopljene kovine na enoto ploščine anode, $h = m/(\rho A)$. Tok na enoto ploščine je **gostota toka** $i = I/A$, zato:

$$h = \frac{i\,t\,M}{z\,F\,\rho}$$

*Preveri:* Tok se podvoji, kaj se zgodi z maso raztopljene kovine? (Odgovor: podvoji se.)

**Gradnik 6: razmerje ploščin.** Katoda določa, koliko elektronov se lahko porabi, anoda pa, na kolikšni površini se tok razdeli. Hitrosti stanjšanja zato ne določa tok sam, ampak gostota toka $i = I/A$ na anodi.

:::premisli
Kaj je slabše: jeklena pločevina z bakrenimi zakovicami ali bakrena pločevina z jeklenimi zakovicami? Zakaj?
---
Bakrena pločevina z jeklenimi zakovicami. Jeklo je anoda, a tu ima majhno ploščino ob veliki bakreni katodi. Gostota toka na zakovicah je velika, zato hitro razpadejo. V obratnem primeru se majhen tok razporedi po veliki jekleni pločevini. Pravilo: majhna anoda ob veliki katodi je najslabša kombinacija.
:::

**Gradnik 7: vrste korozije.** Isti člen se glede na obliko spoja, napetosti in mikrostrukturo pokaže na več načinov:

| vrsta | kaj se zgodi | primer |
|---|---|---|
| enakomerna | površina se tanjša povsod | nezaščiteni jekleni odri |
| galvanska | manj plemenita kovina v stiku s plemenitejšo | jekleni vijak v bakrenem žlebu |
| jamičasta | kloridi lokalno prebijejo pasivno plast | nerjavna ograja ob soljeni cesti |
| špranjska | v ozki reži zmanjka kisika, reža postane anoda | pod podložko, v prekrivnem spoju |
| interkristalna | napad ob mejah zrn | nerjavna cev ob zvaru |
| selektivna | iz zlitine se raztaplja ena komponenta | decinkacija medeninastih ventilov |
| napetostna | natezna napetost in okolje dajo razpoke | nerjavna sidra stropa v pokritem bazenu |
| erozijska | tok tekočine odnaša zaščitno plast | bakrena cev za kolenom |

Interkristalna korozija nerjavnih jekel je posledica **senzibilizacije**. Med varjenjem ali napačno toplotno obdelavo med približno $450\,^\circ\mathrm{C}$ in $850\,^\circ\mathrm{C}$ se ob mejah zrn izločijo kromovi karbidi. Pas ob meji osiromaši s kromom in izgubi pasivnost.

*Preveri:* Katera vrsta grozi zvarjenemu rezervoarju iz navadnega avstenitnega nerjavnega jekla? (Odgovor: interkristalna, ob zvaru.)

## Rešeni primeri

### Primer 1: žleb in vijak

Bakren žleb je pritrjen s pocinkanim jeklenim vijakom. Katera kovina je anoda in kolikšna je razlika standardnih potencialov? Kaj se spremeni, ko se cink porabi?

**Podatki:** $E^\circ(\mathrm{Cu}) = +0{,}34\,\mathrm{V}$, $E^\circ(\mathrm{Zn}) = -0{,}76\,\mathrm{V}$, $E^\circ(\mathrm{Fe}) = -0{,}44\,\mathrm{V}$
**Iščemo:** anodo in $\Delta E$ pred in po porabi cinka

:::formula
$\Delta E = E_k - E_a$; anoda je kovina z bolj negativnim standardnim potencialom.
:::

**Rešitev:**

1. Najprej se stika cink na vijaku in baker. Cink ima bolj negativen potencial, zato je anoda.
2. $\Delta E_1 = 0{,}34 - (-0{,}76) = 1{,}10$, torej $1{,}10\,\mathrm{V}$.
3. Ko se cink ob bakru porabi, se bakra dotika jeklo. Železo je bolj negativno od bakra, zato postane anoda.
4. $\Delta E_2 = 0{,}34 - (-0{,}44) = 0{,}78$, torej $0{,}78\,\mathrm{V}$.
5. Odgovor: najprej korodira cinkova prevleka ($1{,}10\,\mathrm{V}$), nato jeklo vijaka ($0{,}78\,\mathrm{V}$). Baker kot katoda ostane cel.

### Primer 2: sidro v vlažnem zidu

Jekleno sidro v vlažnem zidu korodira s stalnim tokom $2\,\mathrm{mA}$. Koliko železa izgubi v enem letu (365 dni)? Železo se oksidira v $\mathrm{Fe^{2+}}$.

**Podatki:** $I = 2\,\mathrm{mA}$, $t = 365\,\mathrm{d}$, $M = 55{,}85\,\mathrm{g/mol}$, $z = 2$, $F = 96\,485\,\mathrm{C/mol}$
**Iščemo:** masa $m$

:::formula
$m = \dfrac{I\,t\,M}{z\,F}$
:::

**Rešitev:**

1. Čas v sekundah: $t = 365 \cdot 24 \cdot 3600 = 31536000$, torej $3{,}15 \cdot 10^{7}\,\mathrm{s}$.
2. Tok v amperih: $I = 0{,}002\,\mathrm{A}$.
3. Naboj: $Q = I\,t = 0{,}002 \cdot 31536000 = 63072$, torej $63\,072\,\mathrm{C}$.
4. Masa: $m = \dfrac{63072 \cdot 55{,}85}{2 \cdot 96485} \approx 18{,}3$, torej $18{,}3\,\mathrm{g}$.
5. Odgovor: sidro v enem letu izgubi približno $18\,\mathrm{g}$ železa.

### Primer 3: aluminij in nerjavno jeklo na fasadi

Možnost A: aluminijaste plošče s skupno ploščino $0{,}5\,\mathrm{m^2}$, pritrjene z nerjavnimi vijaki. Možnost B: nerjavne plošče, pritrjene z aluminijastimi zakovicami s skupno ploščino $4\,\mathrm{cm^2}$. Predpostavi, da je galvanski tok v obeh primerih $0{,}4\,\mathrm{mA}$. Za koliko se aluminij stanjša v enem letu?

**Podatki:** $I = 0{,}4\,\mathrm{mA}$, $A_A = 0{,}5\,\mathrm{m^2}$, $A_B = 4\,\mathrm{cm^2}$, $t = 3{,}1536 \cdot 10^{7}\,\mathrm{s}$, $M = 26{,}98\,\mathrm{g/mol}$, $z = 3$, $\rho = 2700\,\mathrm{kg/m^3}$
**Iščemo:** stanjšanje $h_A$ in $h_B$

:::formula
$i = \dfrac{I}{A}$, nato $h = \dfrac{i\,t\,M}{z\,F\,\rho}$
:::

**Rešitev:**

1. Anoda je v obeh primerih aluminij, ker je manj plemenit od pasivnega nerjavnega jekla.
2. Gostota toka A: $i_A = \dfrac{0{,}0004\,\mathrm{A}}{0{,}5\,\mathrm{m^2}} = 0{,}0008\,\mathrm{A/m^2}$.
3. Gostota toka B: $4\,\mathrm{cm^2} = 0{,}0004\,\mathrm{m^2}$, zato $i_B = \dfrac{0{,}0004\,\mathrm{A}}{0{,}0004\,\mathrm{m^2}} = 1\,\mathrm{A/m^2}$.
4. Stanjšanje B (molsko maso pretvorimo v $\mathrm{kg/mol}$): $h_B = \dfrac{1 \cdot 3{,}1536 \cdot 10^{7} \cdot 0{,}02698}{3 \cdot 96485 \cdot 2700} \approx 1{,}09 \cdot 10^{-3}\,\mathrm{m}$.
5. Stanjšanje A: gostota toka je $1250$-krat manjša, zato $h_A \approx 8{,}7 \cdot 10^{-7}\,\mathrm{m}$.
6. Odgovor: pri možnosti A se aluminij stanjša za manj kot $1\,\mu\mathrm{m}$ na leto, pri B pa zakovice izgubijo približno $1{,}1\,\mathrm{mm}$ na leto in v nekaj letih razpadejo. V resnici je A še ugodnejša, ker majhna katoda (vijaki) da manjši tok.

### Primer 4: zdaj ti

Vroče pocinkan jekleni steber ima cinkovo prevleko debeline $85\,\mu\mathrm{m}$. Ob morju, kjer ga škropi slana voda, je povprečna gostota korozijskega toka cinka $0{,}01\,\mathrm{A/m^2}$. Približno koliko let zdrži prevleka?

**Podatki:** $d_{Zn} = 85\,\mu\mathrm{m}$, $i = 0{,}01\,\mathrm{A/m^2}$, $t = 3{,}1536 \cdot 10^{7}\,\mathrm{s}$ (eno leto), $M = 65{,}38\,\mathrm{g/mol}$, $z = 2$, $\rho = 7140\,\mathrm{kg/m^3}$
**Iščemo:** letno stanjšanje $h$ in življenjsko dobo prevleke

:::formula
$h = \dfrac{i\,t\,M}{z\,F\,\rho}$, nato število let $= \dfrac{d_{Zn}}{h}$
:::

**Rešitev:**

1. Naboj na kvadratni meter v enem letu: $0{,}01 \cdot 3{,}1536 \cdot 10^{7} = 315360$, torej $315\,360\,\mathrm{C/m^2}$.
2. Molska masa v osnovnih enotah: $M = 0{,}06538\,\mathrm{kg/mol}$.
3. Izračunaj $h$ in življenjsko dobo sam, nato preveri:

:::premisli
Koliko je $h$ in koliko let zdrži prevleka?
---
$h = \dfrac{315360 \cdot 0{,}06538}{2 \cdot 96485 \cdot 7140} \approx 1{,}50 \cdot 10^{-5}\,\mathrm{m} = 15\,\mu\mathrm{m}$ na leto. Prevleka zdrži približno $\dfrac{85}{15} \approx 5{,}7$ leta, nato začne rjaveti jeklo.
:::

## Pogoste napake

- **»Rja je navadna kemija s kisikom.«** V vlagi korozija teče kot člen: elektroni potujejo skozi kovino od anode do katode, ioni skozi elektrolit. Zato štejejo stiki kovin, reže in razlike v dostopu kisika.
- **»Korodira kovina z višjim potencialom.«** Obratno: kovina z bolj negativnim potencialom oddaja elektrone in je anoda. Plemenitejša kovina je katoda in je zaščitena.
- **»Velika anoda je nevarnejša, ker je več kovine izpostavljene.«** Hitrost prodiranja določa gostota toka $i = I/A$. Majhna anoda ob veliki katodi dobi veliko gostoto toka in hitro razpade.
- **»Nerjavno jeklo ne korodira.«** Ščiti ga le cela pasivna plast. Kloridi povzročijo jamičasto in špranjsko korozijo, senzibilizacija ob zvarih interkristalno.
- **»Tabela standardnih potencialov pove vse.«** Pasivni aluminij, titan in nerjavno jeklo se v okolju obnašajo plemeniteje, kot kaže $E^\circ$. Za izbiro para uporabi galvansko vrsto za tisto okolje.

## Povzetek

- Elektrokemijska korozija je korozijski člen: anoda (oksidacija kovine), katoda (redukcija kisika ali vodikovih ionov), elektrolit in električni stik.
- Anoda je kovina ali mesto z bolj negativnim potencialom; gonilna napetost je $\Delta E = E_k - E_a$.
- Faradayev zakon: $m = \dfrac{I\,t\,M}{z\,F}$; stanjšanje $h = \dfrac{i\,t\,M}{z\,F\,\rho}$ z gostoto toka $i = I/A$.
- Majhna anoda ob veliki katodi je najnevarnejša kombinacija.
- Vrste: enakomerna, galvanska, jamičasta, špranjska, interkristalna, selektivna, napetostna, erozijska.
- V resničnem okolju odloča galvanska vrsta; pasivne kovine so plemenitejše, kot kaže $E^\circ$.

## Drugače: Na sliki

Prerez kapljice vode na jekleni pločevini:

```
        zrak (O2)
   _________________
  /  K      A      K \     <- kapljica vode
 /  OH-   Fe2+   OH-  \
=====+======-======+=====  jeklo
     |<-- e- --|-- e- -->|
   katoda   anoda   katoda
```

- **A (sredina):** kisika je malo, železo oddaja elektrone in prehaja v vodo kot $\mathrm{Fe^{2+}}$. Tu nastane jamica.
- **K (rob):** kisik zlahka pride do kovine in porabi elektrone, nastajajo ioni $\mathrm{OH^-}$.
- Elektroni tečejo skozi jeklo od sredine proti robu, ioni pa skozi vodo v nasprotnih smereh.
- Kjer se $\mathrm{Fe^{2+}}$ in $\mathrm{OH^-}$ srečata, se izloči obroč rje. Rja zato ni na mestu, kjer je kovina izginila.

Ista slika velja za špranjo pod podložko: v reži je kisika malo (anoda), zunaj veliko (katoda).

## Drugače: Bolj natančno

**Odvisnost potenciala od koncentracije.** Potencial elektrode $\mathrm{M^{z+}/M}$ podaja Nernstova enačba $E = E^\circ + \dfrac{RT}{zF}\ln c(\mathrm{M^{z+}})$. Ker je ionov v okolju malo, so dejanski potenciali bolj negativni od standardnih. Razlike v koncentraciji kisika ali ionov tako naredijo člen iz enega kosa kovine.

**Mešani potencial.** Na korodirajoči kovini sta anodni in katodni tok enako velika pri **korozijskem potencialu** $E_{kor}$; takrat teče korozijski tok $I_{kor}$. Evansov diagram riše oba toka v odvisnosti od potenciala, presečišče krivulj da $E_{kor}$ in $I_{kor}$. Pogosto katodna reakcija omejuje hitrost, ker kisik do površine prihaja le z difuzijo. Zato večja katodna ploščina pomeni večji tok in pojasni učinek razmerja ploščin.

**Pasivnost.** Nad določenim potencialom se na Fe, Cr, Ni, Al ali Ti tvori nekaj nanometrov debela oksidna plast, in tok pade za več velikostnih razredov. Kromov oksid v nerjavnem jeklu (vsaj okoli $12\,\%$ Cr) se ob poškodbi sam obnovi. Kloridi lokalno prebijejo plast nad **potencialom jamičenja**. V jamici nastane kislo okolje, ki napad pospešuje.

**Termodinamika ni kinetika.** Pozitivna $\Delta E$ pove le, da reakcija lahko poteče. Hitrost določa $I_{kor}$, zato aluminij kljub zelo negativnemu $E^\circ$ v vodi korodira počasi.

## Preveri se

? Katera trditev o elektrokemijski koroziji je pravilna?
- Na katodi se kovina raztaplja, na anodi nastaja rja.
~ Zamenjani vlogi: kovina se raztaplja na anodi. Rja se izloči tam, kjer se ioni srečajo.
+ Brez elektrolita, ki med anodo in katodo prevaja ione, se korozija skoraj ustavi.
- Korozija poteka samo, kadar se stikata dve različni kovini.
~ Anoda in katoda sta lahko na istem kosu kovine, npr. pod kapljico vode zaradi razlike v kisiku.
> Korozijski člen potrebuje anodo, katodo, elektrolit in električni stik. Brez elektrolita ioni ne morejo potovati.

? Železo korodira s tokom $1\,\mathrm{A}$ eno uro ($\mathrm{Fe} \rightarrow \mathrm{Fe^{2+}}$). Koliko železa se raztopi? ($M = 55{,}85\,\mathrm{g/mol}$, $F = 96\,485\,\mathrm{C/mol}$)
- $2{,}08\,\mathrm{g}$
~ To dobiš z $z = 1$. Atom železa odda dva elektrona, zato je $z = 2$.
+ $1{,}04\,\mathrm{g}$
- $0{,}0174\,\mathrm{g}$
~ Tako dobiš, če čas vstaviš v minutah ($60$) namesto v sekundah ($3600$).
> $m = \dfrac{1 \cdot 3600 \cdot 55{,}85}{2 \cdot 96485}\,\mathrm{g} \approx 1{,}04\,\mathrm{g}$.

? Najdi napako v rešitvi. Naloga: bakren žleb leži na aluminijastem nosilcu. (1) $E^\circ(\mathrm{Cu}) = +0{,}34\,\mathrm{V}$, $E^\circ(\mathrm{Al}) = -1{,}66\,\mathrm{V}$. (2) Anoda je kovina z višjim potencialom, zato korodira baker. (3) $\Delta E = 0{,}34 + 1{,}66 = 2{,}00\,\mathrm{V}$.
- Korak (1): potenciala sta napačna.
~ Vrednosti sta pravilni standardni potenciali obeh kovin.
+ Korak (2): anoda je kovina z nižjim, bolj negativnim potencialom, torej aluminij.
- Korak (3): razlika mora biti $0{,}34 - 1{,}66 = -1{,}32\,\mathrm{V}$.
~ Od potenciala katode odštejemo $-1{,}66$, minus in minus data plus: $2{,}00\,\mathrm{V}$ je pravilno.
> Manj plemenita kovina odda elektrone. Korodira aluminijast nosilec, baker je katoda.

? Isti galvanski tok teče enkrat skozi anodo s ploščino $1\,\mathrm{cm^2}$, drugič skozi anodo s ploščino $100\,\mathrm{cm^2}$. Kako se primerjata hitrosti stanjšanja?
- Enaki sta, ker je tok enak.
~ Enaka je raztopljena masa, ne globina. Ta se razdeli po različno veliki površini.
- Večja anoda se stanjša $100$-krat hitreje, ker ima več kovine.
~ Več kovine pomeni, da se tok razporedi na večjo površino, zato je gostota toka manjša.
+ Manjša anoda se stanjša $100$-krat hitreje.
> $h \propto i = I/A$: pri istem $I$ je gostota toka na $1\,\mathrm{cm^2}$ stokrat večja.

? Rezervoar iz avstenitnega nerjavnega jekla po nekaj letih pušča v ozkem pasu tik ob zvarih, drugje je površina sijoča. Za katero vrsto korozije gre najverjetneje?
- Enakomerna korozija.
~ Enakomerna korozija bi stanjšala ves rezervoar, ne le pas ob zvaru.
- Galvanska korozija med zvarom in pločevino.
~ Zvar je iz enakega jekla, zato ni para različnih kovin. Odloča mikrostruktura ob zvaru.
+ Interkristalna korozija zaradi senzibilizacije.
> Jeklo ob zvaru je bilo med $450$ in $850\,^\circ\mathrm{C}$, ob mejah zrn so se izločili kromovi karbidi, pas ob mejah je izgubil krom in pasivnost.

:::simboli
\Delta E | razlika potencialov (gonilna napetost člena) | \Delta E = E_k - E_a | V
E_k | standardni potencial katode | | V | plemenitejša kovina
E_a | standardni potencial anode | | V | manj plemenita kovina
m | masa raztopljene kovine | m = \dfrac{I\,t\,M}{z\,F} | g
I | korozijski (galvanski) tok | | A
t | čas | | s
M | molska masa kovine | | g/mol | v $h$ v kg/mol
z | število oddanih elektronov na atom | | – | Fe → Fe²⁺: $z = 2$
F | Faradayeva konstanta | | C/mol | $96\,485$
h | stanjšanje stene v času $t$ | h = \dfrac{i\,t\,M}{z\,F\,\rho} | m
i | gostota korozijskega toka | i = \dfrac{I}{A} | A/m^2
A | ploščina anode | | m^2
\rho | gostota kovine | | kg/m^3
d_{Zn} | debelina cinkove prevleke | | \mu m
e | elektron | | |
\mathrm{Fe} | železo | | |
:::
