---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na cesti čez gorski prelaz te prometni znak in zemljevid opozorita: »klanec 14 %«. Ob robu stoji parkiran avto z zategnjeno ročno zavoro. Pozimi, na poledeneli cesti, bi tak avto lahko počasi odpolzel navzdol.

Nekaj ur pozneje si na trajektu. Po nagnjeni rampi za vozila prinašaš kovček in ga za trenutek odložiš na tla. Ali obstane ali odpolzi?

Situaciji sta videti različni: tona pločevine na asfaltu in petnajst kilogramov plastike na jeklu. V resnici o obeh odloča isto pravilo, v katerem mase sploh ni. Odločata le naklon in hrapavost stika. Na tekmovanjih skoraj vsaka naloga iz dinamike sestavi prav te kose: klanec, trenje, vrv in škripec. Kdor jih zna razstaviti, reši tudi zapletene sisteme.

## Razlaga

**Mamljiva bližnjica.** Mnogi si zapomnijo »sila trenja je koeficient krat teža«. Preizkusimo jo. Kovček z maso $15\,\mathrm{kg}$ miruje na rampi z naklonom $20^\circ$. Koeficient lepenja med kovčkom in rampo je $0{,}50$.

:::premisli
Kolikšna sila lepenja drži kovček? Po bližnjici bi bila $0{,}50 \cdot 15\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} \approx 74\,\mathrm{N}$. Napovej, ali je res tolikšna.
---
Ni. Kovček miruje, zato je vsota sil nič. Lepenje mora uravnovesiti le del teže vzdolž rampe: $15 \cdot 9{,}81 \cdot \sin 20^\circ \approx 50\,\mathrm{N}$. Če bi bilo lepenje $74\,\mathrm{N}$, bi kovček pospeševal navzgor po rampi.
:::

Bližnjica ima dve napaki. Popravimo ju po vrsti.

**Prvi popravek: normalna sila ni vedno teža.** **Normalna sila** $F_\mathrm{N}$ je sila podlage pravokotno na stično ploskev. Na klancu jo dobimo tako, da težo $F_\mathrm{g} = mg$ razstavimo na dve komponenti: vzdolž klanca in pravokotno nanj.

:::risba skica
opis: Kvader na klancu z naklonom 25 stopinj. Teža F g kaže navpično navzdol. Razstavljena je na komponento F g sin α vzdolž klanca navzdol in komponento F g cos α pravokotno v klanec. Normalna sila F N kaže pravokotno iz klanca, sila trenja F tr vzdolž klanca navzgor, ker kvader drsi navzdol.
območje: -0,5; -0,8 .. 8,5; 4,6
enota: 32
lik: 0; 0 -> 8; 0 -> 8; 3,73 | siva | ozadje
lik: 2,90; 1,35 -> 4,35; 2,03 -> 3,97; 2,84 -> 2,52; 2,17 | modra | polno
napis: 1,1; 0,25 | α | desno
puščica: 3,44; 2,10 -> 3,44; -0,30 | F_g | desno | debelo
puščica: 3,44; 2,10 -> 2,52; 4,07 | F_N | levo | zelena
puščica: 3,44; 2,10 -> 4,26; 2,48 | F_{tr} | nad | rdeča
puščica: 3,44; 2,10 -> 2,52; 1,67 | F_g sin α | levo | črtkano
puščica: 3,44; 2,10 -> 4,35; 0,13 | F_g cos α | desno | črtkano
:::

Kot med težo in pravokotnico na klanec je enak naklonu $\alpha$. Zato je komponenta vzdolž klanca $mg\sin\alpha$, pravokotna pa $mg\cos\alpha$. Pravokotno na klanec se kvader ne giblje, zato je

$$F_\mathrm{N} = mg\cos\alpha$$

To velja le, če pravokotno na klanec ne deluje nobena druga sila. Če kvader še pritiskaš ob klanec ali ga vleče poševna vrv, normalno silo izračunaš iz ravnovesja vseh pravokotnih sil.

**Drugi popravek: lepenje je toliko, kolikor je treba.** **Sila lepenja** $F_\mathrm{l}$ deluje med telesoma, ki se dotikata in ne drsita drugo ob drugem. Prilagodi se razmeram, navzgor pa je omejena: $F_\mathrm{l} \le k_\mathrm{l} F_\mathrm{N}$, kjer je $k_\mathrm{l}$ **koeficient lepenja**. Ko telo drsi, deluje **sila trenja** z velikostjo

$$F_\mathrm{tr} = k_\mathrm{tr} F_\mathrm{N}$$

Tu je $k_\mathrm{tr}$ **koeficient trenja**, običajno nekoliko manjši od $k_\mathrm{l}$. Trenje vedno nasprotuje *relativnemu* gibanju stičnih ploskev. Kvadru, ki drsi navzgor, kaže navzdol.

**Kdaj telo na klancu obmiruje.** Lepenje zmore uravnovesiti $mg\sin\alpha$, če je $mg\sin\alpha \le k_\mathrm{l}\,mg\cos\alpha$. Masa se pokrajša, ostane pogoj

$$\tan\alpha \le k_\mathrm{l}$$

To je skrivnost obeh situacij iz uvoda. Naklon »14 %« na znaku pomeni $\tan\alpha = 0{,}14$: na $100\,\mathrm{m}$ vodoravno se cesta dvigne za $14\,\mathrm{m}$, torej $\alpha \approx 8{,}0^\circ$. Za gumo na suhem asfaltu je $k_\mathrm{l}$ okoli $0{,}8$, na ledu le okoli $0{,}1$. Na ledu je $0{,}14 > 0{,}1$, zato avto z blokiranimi kolesi zdrsne, pa naj bo lahek ali težak.

**Ko telo drsi.** Os $x$ položimo vzdolž klanca navzdol. Vzdolž nje vlečeta komponenta teže $mg\sin\alpha$ navzdol in trenje $k_\mathrm{tr}\,mg\cos\alpha$ navzgor. Drugi Newtonov zakon, deljen z $m$, da

$$a = g\,(\sin\alpha - k_\mathrm{tr}\cos\alpha)$$

Če telo drsi *navzgor* (na primer ga sunemo), trenje kaže navzdol in pojemek je $g\,(\sin\alpha + k_\mathrm{tr}\cos\alpha)$. Isti klanec ima torej dve različni velikosti pospeška, odvisno od smeri drsenja.

V simulaciji spodaj »Klanec s trenjem« nastavi koeficient lepenja na $0{,}5$ in po stopinjah večaj naklon. Pri $26^\circ$ kvader še miruje, pri $27^\circ$ zdrsne, ker je $\tan 26{,}6^\circ \approx 0{,}5$. Nato spremeni maso: mejni kot ostane enak.

**Vrvi in škripci.** **Idealna vrv** nima mase in se ne razteza. Vzdolž vse vrvi zato deluje ista **sila vrvi** $F_\mathrm{v}$, telesi na njenih koncih pa imata enako velik pospešek. **Idealni škripec** (brez mase in trenja) silo vrvi le preusmeri, njene velikosti ne spremeni.

:::premisli
Utež visi na vrvi, ki gre čez škripec do kvadra na mizi. Sistem se giblje, utež pospešeno pada. Ali je sila vrvi večja, enaka ali manjša od teže uteži? Zakaj?
---
Manjša. Utež pospešuje navzdol, zato mora biti rezultanta nanjo usmerjena navzdol: $m g - F_\mathrm{v} = m a > 0$. Sila vrvi bi bila enaka teži le, če bi utež mirovala ali se gibala enakomerno.
:::

**Gibljivi škripec** visi v zanki vrvi. Nanj vlečeta oba dela vrvi, skupaj s silo $2F_\mathrm{v}$. Ko prosti konec vrvi potegneš za $x$, se škripec dvigne le za $x/2$. Zato je tudi njegov pospešek polovica pospeška prostega konca. Za breme z maso $m$, ki se dviga na gibljivem škripcu, torej velja $2F_\mathrm{v} - mg = m \cdot \tfrac{a}{2}$, kjer je $a$ pospešek prostega konca. Takšni zvezi med pospeški rečemo **vez**. Na tekmovanjih je pogosto ključ naloge.

**Postopek za vsako nalogo.**

| Korak | Kaj narediš |
|---|---|
| 1 | Nariši sile na vsako telo posebej. |
| 2 | Osi postavi vzdolž klanca in pravokotno nanj. |
| 3 | Preveri, ali in v katero smer se sistem premakne. |
| 4 | Zapiši $\sum F = ma$ za vsako telo in vez. |
| 5 | Preveri mejne primere, npr. $k_\mathrm{tr} = 0$. |

Korak 3 izpustijo skoraj vsi. Smer trenja je namreč odvisna od smeri gibanja, zato je pred računanjem ne smeš ugibati.

## Rešeni primeri

### Primer 1: kovček na rampi

Na letališču postavijo kovček z maso $18\,\mathrm{kg}$ na kovinsko rampo z naklonom $25^\circ$. Koeficient lepenja je $0{,}40$, koeficient trenja $0{,}30$. Ali kovček zdrsne? Če zdrsne, s kolikšnim pospeškom?

**Podatki:** $m = 18\,\mathrm{kg}$, $\alpha = 25^\circ$, $k_\mathrm{l} = 0{,}40$, $k_\mathrm{tr} = 0{,}30$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** ali zdrsne, pospešek $a$

:::formula
Pogoj mirovanja $\tan\alpha \le k_\mathrm{l}$; pri drsenju $a = g\,(\sin\alpha - k_\mathrm{tr}\cos\alpha)$
:::

**Rešitev:**

1. Primerjamo: $\tan 25^\circ \approx 0{,}466$, kar je več od $k_\mathrm{l} = 0{,}40$. Lepenje kovčka ne zadrži, zato zdrsne.
2. Komponenti: $\sin 25^\circ \approx 0{,}4226$ in $\cos 25^\circ \approx 0{,}9063$.
3. Pospešek: $a = 9{,}81 \cdot (0{,}4226 - 0{,}30 \cdot 0{,}9063) = 1{,}48\,\mathrm{m/s^2}$. Masa se ne pojavi, ker sta obe sili sorazmerni z njo.
4. Odgovor: kovček zdrsne s pospeškom približno $1{,}5\,\mathrm{m/s^2}$.

### Primer 2: tovorna žičnica do planinske koče

Na planinski karti je ob koči označena tovorna žičnica. Na pobočju z naklonom $30^\circ$ leži zaboj z maso $4{,}0\,\mathrm{kg}$. Vrv gre od zaboja vzporedno s pobočjem čez škripec na vrhu, na drugem koncu pa visi utež z maso $3{,}0\,\mathrm{kg}$. Koeficient trenja med zabojem in pobočjem je $0{,}20$. Kolikšna sta pospešek in sila vrvi?

**Podatki:** $m_1 = 4{,}0\,\mathrm{kg}$, $m_2 = 3{,}0\,\mathrm{kg}$, $\alpha = 30^\circ$, $k_\mathrm{tr} = 0{,}20$, $g = 9{,}81\,\mathrm{m/s^2}$; vrv in škripec sta idealna
**Iščemo:** pospešek $a$, sila vrvi $F_\mathrm{v}$

:::formula
$m_2 g - F_\mathrm{v} = m_2 a$ in $F_\mathrm{v} - m_1 g\sin\alpha - k_\mathrm{tr} m_1 g\cos\alpha = m_1 a$
:::

**Rešitev:**

1. Smer: utež vleče s silo $m_2 g = 29{,}43\,\mathrm{N}$. Zaboju vzdolž pobočja nasprotujeta $m_1 g\sin\alpha = 19{,}62\,\mathrm{N}$ in trenje $k_\mathrm{tr} m_1 g\cos\alpha = 6{,}80\,\mathrm{N}$, skupaj $26{,}42\,\mathrm{N}$. Utež je močnejša, zato gre zaboj navzgor in trenje nanj kaže navzdol.
2. Enačbi seštejemo, sila vrvi se odšteje: $(m_1 + m_2)\,a = 29{,}43\,\mathrm{N} - 26{,}42\,\mathrm{N} = 3{,}01\,\mathrm{N}$.
3. $a = \dfrac{3{,}01\,\mathrm{N}}{7{,}0\,\mathrm{kg}} = 0{,}43\,\mathrm{m/s^2}$.
4. Sila vrvi iz enačbe za utež: $F_\mathrm{v} = m_2\,(g - a) = 3{,}0 \cdot (9{,}81 - 0{,}43) = 28{,}14\,\mathrm{N}$.
5. Kontrola: sila vrvi je manjša od teže uteži, kot mora biti pri uteži, ki pospešeno pada.
6. Odgovor: sistem pospešuje z $0{,}43\,\mathrm{m/s^2}$, sila vrvi je približno $28\,\mathrm{N}$.

**Tekmovalna razširitev.** Pri katerih masah uteži bi zaboj miroval, če je koeficient lepenja $k_\mathrm{l} = 0{,}25$? Lepenje lahko kaže po pobočju navzgor (lahka utež, zaboj bi zdrsnil navzdol) ali navzdol (težka utež, zaboj bi speljal navzgor), zato dobiš dve meji: $m_1(\sin\alpha - k_\mathrm{l}\cos\alpha) \le m_2 \le m_1(\sin\alpha + k_\mathrm{l}\cos\alpha)$, torej od $1{,}13\,\mathrm{kg}$ do $2{,}87\,\mathrm{kg}$. Utež s $3{,}0\,\mathrm{kg}$ je nad zgornjo mejo, zato zaboj res spelje navzgor.

### Primer 3: zavorna sled na gorski cesti

Na cesti, ki je na zemljevidu označena z naklonom $12\,\%$, je avto zaviral navzdol z blokiranimi kolesi. Policist izmeri zavorno sled, dolgo $40\,\mathrm{m}$. Koeficient trenja med gumo in suhim asfaltom je $0{,}70$. S kolikšno hitrostjo je avto začel zavirati?

**Podatki:** $\tan\alpha = 0{,}12$, $s = 40\,\mathrm{m}$, $k_\mathrm{tr} = 0{,}70$, $g = 9{,}81\,\mathrm{m/s^2}$, končna hitrost $0$
**Iščemo:** začetna hitrost $v_0$

:::formula
Pojemek $a = g\,(k_\mathrm{tr}\cos\alpha - \sin\alpha)$, nato $v_0^2 = 2as$
:::

**Rešitev:**

1. Kot iz naklona: $\alpha = \arctan 0{,}12 \approx 6{,}84^\circ$, zato $\sin\alpha \approx 0{,}1191$ in $\cos\alpha \approx 0{,}9929$.
2. Trenje kaže navzgor in avto ustavlja, komponenta teže vzdolž ceste pa ga žene naprej. Pojemek je razlika: $a = 9{,}81 \cdot (0{,}70 \cdot 0{,}9929 - 0{,}1191) = 5{,}65\,\mathrm{m/s^2}$.
3. Gibanje je enakomerno pojemajoče do mirovanja, zato velja $v_0^2 = 2as$.
4. Izračunaj sam $v_0$ in ga pretvori v km/h.

:::premisli
Kolikšna je bila začetna hitrost?
---
$v_0 = \sqrt{2 \cdot 5{,}65\,\mathrm{m/s^2} \cdot 40\,\mathrm{m}} \approx 21{,}3\,\mathrm{m/s} \approx 77\,\mathrm{km/h}$. Na ravni cesti bi enaka sled pomenila $\sqrt{2 \cdot 0{,}70 \cdot 9{,}81 \cdot 40} \approx 23{,}4\,\mathrm{m/s}$: navzdol se avto ustavlja počasneje.
:::

## Pogoste napake

- **»Trenje je vedno $k \cdot mg$.«** Na klancu je $F_\mathrm{N} = mg\cos\alpha$, ne $mg$. Normalno silo vedno izračunaj iz ravnovesja pravokotno na podlago.
- **»Lepenje je enako $k_\mathrm{l} F_\mathrm{N}$.«** To je le največja možna vrednost. Mirujoče telo dobi natanko toliko lepenja, da je vsota sil nič.
- **»Sila vrvi je enaka teži viseče uteži.«** Velja samo v ravnovesju. Ko utež pospešuje navzdol, je $F_\mathrm{v} = m(g - a)$, torej manj.
- **»Trenje vedno kaže navzgor po klancu.«** Trenje nasprotuje relativnemu gibanju. Pri telesu, ki drsi navzgor, kaže navzdol. Zato najprej določi smer gibanja.
- **»Težje telo prej zdrsne in hitreje drsi.«** Pri klancu se masa pokrajša: mejni kot in pospešek sta za vsa telesa z istim koeficientom enaka.

## Povzetek

- Na klancu: $F_\mathrm{N} = mg\cos\alpha$, komponenta teže vzdolž klanca $mg\sin\alpha$ (če ni drugih pravokotnih sil).
- Lepenje: $F_\mathrm{l} \le k_\mathrm{l} F_\mathrm{N}$, velikost določi ravnovesje. Trenje: $F_\mathrm{tr} = k_\mathrm{tr} F_\mathrm{N}$, nasprotno relativnemu gibanju.
- Telo na klancu miruje, če je $\tan\alpha \le k_\mathrm{l}$; masa ni pomembna. Naklon v odstotkih je $100 \tan\alpha$.
- Drsenje navzdol: $a = g\,(\sin\alpha - k_\mathrm{tr}\cos\alpha)$; navzgor je pojemek $g\,(\sin\alpha + k_\mathrm{tr}\cos\alpha)$.
- Idealna vrv: povsod ista sila, enaki pospeški na koncih. Gibljivi škripec: sila $2F_\mathrm{v}$, polovični pomik in pospešek.
- Postopek: sile na vsako telo, osi vzdolž klanca, najprej smer gibanja, nato enačbe in vez.

## Drugače: Kot zgodba

Popotnica Ana se ustavi na prelazu. Na zemljevidu piše »12 %«, v nahrbtniku ima debelo knjigo vodnika in tanek zvezek, oba v enakem plastičnem ovitku. Oba položi na isto poševno kamnito ploščo.

»Knjiga je težja, ta bo prej zdrsnila,« pomisli. Pa ne zdrsne nobeden. Ana dviguje en rob plošče. Pri določenem naklonu se premakneta oba hkrati.

Zakaj? Težja knjiga bolj vleče navzdol, a tudi močneje pritiska na ploščo, zato jo lepenje močneje drži. Oboje raste z maso enako hitro. Odloča le razmerje: kdaj $\tan\alpha$ preseže $k_\mathrm{l}$.

Zvečer Ana z vrvjo čez vejo dviguje nahrbtnik. Ko ga potegne sunkovito, vrv zaškripa: sila vrvi je takrat večja od teže nahrbtnika, ker ga mora tudi pospešiti.

## Drugače: Korak za korakom s številkami

Kvader z maso $2{,}0\,\mathrm{kg}$ leži na klancu z $\alpha = 30^\circ$, $k_\mathrm{l} = 0{,}5$, $k_\mathrm{tr} = 0{,}4$.

1. Teža: $F_\mathrm{g} = 2{,}0 \cdot 9{,}81 = 19{,}62\,\mathrm{N}$.
2. Vzdolž klanca: $19{,}62 \cdot \sin 30^\circ = 19{,}62 \cdot 0{,}5 = 9{,}81\,\mathrm{N}$.
3. Pravokotno: $F_\mathrm{N} = 19{,}62 \cdot \cos 30^\circ = 19{,}62 \cdot 0{,}866 = 16{,}99\,\mathrm{N}$.
4. Največje lepenje: $0{,}5 \cdot 16{,}99 = 8{,}50\,\mathrm{N}$. To je manj kot $9{,}81\,\mathrm{N}$, zato kvader zdrsne.
5. Trenje med drsenjem: $0{,}4 \cdot 16{,}99 = 6{,}80\,\mathrm{N}$.
6. Rezultanta: $9{,}81 - 6{,}80 = 3{,}01\,\mathrm{N}$, pospešek $3{,}01 / 2{,}0 = 1{,}51\,\mathrm{m/s^2}$.

Kontrola s formulo: $9{,}81 \cdot (0{,}5 - 0{,}4 \cdot 0{,}866) = 1{,}51\,\mathrm{m/s^2}$.

## Preveri se

? Kovček miruje na rampi z naklonom $\alpha$. Koeficient lepenja je $k_\mathrm{l}$. Kolikšna je sila lepenja nanj?
- $k_\mathrm{l}\,mg\cos\alpha$
~ To je največja možna sila lepenja. Mirujoč kovček potrebuje le toliko, da uravnovesi komponento teže vzdolž rampe.
+ $mg\sin\alpha$
- $k_\mathrm{l}\,mg$
~ Normalna sila na rampi ni $mg$, pa še to bi bila le zgornja meja lepenja.
> Kovček miruje, zato je vsota sil vzdolž rampe nič: lepenje je enako $mg\sin\alpha$ in kaže navzgor po rampi.

? Telesa drsijo po klancih navzdol. Razvrsti jih od največjega do najmanjšega pospeška.
1. $\alpha = 30^\circ$, brez trenja
2. $\alpha = 45^\circ$, $k_\mathrm{tr} = 0{,}5$
3. $\alpha = 30^\circ$, $k_\mathrm{tr} = 0{,}2$
4. $\alpha = 20^\circ$, $k_\mathrm{tr} = 0{,}1$
> Po $a = g\,(\sin\alpha - k_\mathrm{tr}\cos\alpha)$ dobiš $4{,}91$; $3{,}47$; $3{,}21$ in $2{,}43\,\mathrm{m/s^2}$. Strm klanec z velikim trenjem je lahko hitrejši od položnega z majhnim.

? Zaboj na klancu je z vrvjo čez škripec povezan z visečo utežjo in sistem drsi. Kaj se zgodi s pospeškom, če obe masi podvojimo, koeficient trenja pa ostane enak?
- Pospešek se podvoji.
~ Podvojijo se sile, a tudi masa, ki jo morajo pospešiti. Razmerje ostane enako.
- Pospešek se razpolovi.
~ Večja masa sama po sebi ne zmanjša pospeška, če se sorazmerno povečajo tudi vse sile.
+ Pospešek ostane enak.
> Vse sile (teži, normalna sila, trenje) so sorazmerne z masami, zato se v $a = \dfrac{F}{m_1 + m_2}$ faktor 2 pokrajša.

? Kvader z maso $2{,}0\,\mathrm{kg}$ leži na vodoravni mizi, $k_\mathrm{tr} = 0{,}25$. Vrv gre čez škripec na robu mize do viseče uteži z maso $1{,}0\,\mathrm{kg}$. Kolikšen je pospešek sistema v $\mathrm{m/s^2}$? Vzemi $g = 9{,}81\,\mathrm{m/s^2}$.
= 1,64 m/s² | 0,02
~ 3,27 | Pozabil si na trenje: $9{,}81 / 3$. Trenje na kvadru je $0{,}25 \cdot 2{,}0 \cdot 9{,}81 = 4{,}91\,\mathrm{N}$.
~ 4,91 | Rezultanto si delil le z maso uteži. Pospešiti je treba obe telesi, skupaj $3{,}0\,\mathrm{kg}$.
> $a = \dfrac{m_2 g - k_\mathrm{tr} m_1 g}{m_1 + m_2} = \dfrac{9{,}81 - 4{,}905}{3{,}0} \approx 1{,}64\,\mathrm{m/s^2}$.

? Z risbe odčitaj višino in vodoravno dolžino klanca. Kvader drsi po njem navzdol, $k_\mathrm{tr} = 0{,}25$. Kolikšen je pospešek v $\mathrm{m/s^2}$? Vzemi $g = 9{,}81\,\mathrm{m/s^2}$.
:::risba skica
opis: Pravokoten trikotnik, ki predstavlja klanec. Vodoravna stranica je dolga 4 m, navpična 3 m. Na poševni stranici leži kvader.
območje: 0; 0 .. 6; 4,5
enota: 45
lik: 0,5; 0,5 -> 4,5; 0,5 -> 4,5; 3,5 | siva | ozadje
pravikot: 4,5; 0,5 | 0,5; 0,5 | 4,5; 3,5
lik: 2,30; 1,85 -> 2,94; 2,33 -> 2,64; 2,73 -> 2,00; 2,25 | modra | polno
napis: 2,5; 0,5 | 4 m | pod
napis: 4,5; 2 | 3 m | desno
:::
= 3,92 m/s² | 0,03
~ 5,89 | To je $g\sin\alpha$ brez trenja. Trenje zmanjša pospešek za $k_\mathrm{tr}\,g\cos\alpha$.
~ 7,85 | Trenje si prištel. Pri drsenju navzdol kaže navzgor in pospešek zmanjša.
~ 6,38 | Zamenjal si sinus in kosinus. Nasprotna kateta naklonskega kota je višina $3\,\mathrm{m}$.
> Poševnica je $5\,\mathrm{m}$, zato $\sin\alpha = 0{,}6$ in $\cos\alpha = 0{,}8$. $a = 9{,}81 \cdot (0{,}6 - 0{,}25 \cdot 0{,}8) \approx 3{,}92\,\mathrm{m/s^2}$.

<<RACUN
vrednost: 15*9.81*sin(20°) | 50.33
vrednost: 0.5*15*9.81*cos(20°) | 69.14
vrednost: atan(0.14)*180/pi | 7.97
vrednost: tan(25°) | 0.466
vrednost: 9.81*(sin(25°)-0.3*cos(25°)) | 1.479
vrednost: 4*9.81*sin(30°)+0.2*4*9.81*cos(30°) | 26.42
vrednost: (3*9.81-4*9.81*sin(30°)-0.2*4*9.81*cos(30°))/7 | 0.4305
vrednost: 3*(9.81-0.4305) | 28.14
vrednost: 4*(sin(30°)-0.25*cos(30°)) | 1.134
vrednost: 4*(sin(30°)+0.25*cos(30°)) | 2.866
vrednost: 9.81*(0.7*cos(atan(0.12))-sin(atan(0.12))) | 5.649
vrednost: sqrt(2*5.649*40) | 21.26
vrednost: sqrt(2*0.7*9.81*40) | 23.44
vrednost: 9.81*(sin(30°)-0.4*cos(30°)) | 1.507
vrednost: 9.81*(sin(45°)-0.5*cos(45°)) | 3.468
vrednost: 9.81*(sin(20°)-0.1*cos(20°)) | 2.433
vrednost: (9.81-0.25*2*9.81)/3 | 1.635
vrednost: 9.81*(0.6-0.25*0.8) | 3.924
>>

:::simboli
F_\mathrm{g} | teža | F_\mathrm{g} = m g | N
F_\mathrm{N} | normalna sila | F_\mathrm{N} = m g \cos\alpha | N | na klancu brez drugih pravokotnih sil
F_\mathrm{l} | sila lepenja | F_\mathrm{l} \le k_\mathrm{l} F_\mathrm{N} | N
F_\mathrm{tr} | sila trenja | F_\mathrm{tr} = k_\mathrm{tr} F_\mathrm{N} | N
F_\mathrm{v} | sila vrvi | | N | enaka vzdolž idealne vrvi
k_\mathrm{l} | koeficient lepenja | | – | telo miruje, če je $\tan\alpha \le k_\mathrm{l}$
k_\mathrm{tr} | koeficient trenja | | – | pri drsenju
m | masa telesa | | kg
m_1 | masa zaboja na pobočju | | kg
m_2 | masa viseče uteži | | kg
g | težni pospešek | | m/s^2 | $9{,}81\,\mathrm{m/s^2}$
\alpha | naklon klanca | | ° | naklon v % je $100\tan\alpha$
a | pospešek (pojemek) | a = g(\sin\alpha - k_\mathrm{tr}\cos\alpha) | m/s^2 | pri drsenju navzdol
s | dolžina zavorne sledi | | m
v_0 | začetna hitrost | v_0^2 = 2 a s | m/s
:::
