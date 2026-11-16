---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Avto stoji parkiran na strmem odseku ceste proti prelazu. Enkrat je asfalt suh, drugič moker. Na kateri cesti deluje na gume večja sila lepenja?

Večina odgovori: na suhi, saj guma tam bolje »prime«. Pravilni odgovor se zdi napačen: **dokler avto miruje, je sila na obeh cestah enaka.** Tla vrnejo natanko toliko, kolikor je treba za ravnovesje. Suha cesta ponuja le večjo **rezervo**, preden avto zdrsne.

Še en paradoks. Kovček, ki leži na široki strani, in isti kovček, postavljen pokonci, začneta drseti pri skoraj enaki sili. Velikost stične ploskve v preprostem modelu ne šteje.

Obe trditvi izhajata iz Coulombovega zakona trenja. Z njim v statiki odločiš, ali bo telo obstalo ali zdrsnilo: avto na klancu, kovček na tekočem traku, lestev ob steni, zavorna čeljust, klin.

## Razlaga

**Najprej en konkreten primer.** Na letališču potiskaš kovček s težo $G = 200\,\mathrm{N}$ po vodoravnih tleh. Potisna sila $P$ je vodoravna in jo počasi povečuješ. Za ta par snovi veljata števili $\mu_\mathrm{l} = 0{,}4$ in $\mu_\mathrm{t} = 0{,}3$; kaj pomenita, pove posplošitev spodaj.

Prosto telo: navzdol teža $G$, navzgor normalna sila tal $N$, vodoravno potisk $P$ in vzdolž tal sila trenja $F$, nasproti potisku. Navpično ravnotežje da $N = G = 200\,\mathrm{N}$. Vodoravno velja $F = P$, dokler kovček miruje.

| $P$ [N] | stanje kovčka | $F$ [N] |
|---|---|---|
| 0 | miruje | 0 |
| 40 | miruje | 40 |
| 80 | na meji zdrsa | 80 |
| 100 | drsi | 60 |

Do $80\,\mathrm{N}$ tla vračajo natanko toliko, kolikor potiskaš. Pri $80\,\mathrm{N}$ je meja dosežena. Ko kovček zdrsne, sila trenja pade na stalnih $60\,\mathrm{N}$, ne glede na to, kako močno potiskaš.

Graf $F(P)$ si predstavljaj takole: premica pod kotom $45^\circ$ od izhodišča do točke $(80, 80)$, nato skok navzdol na vodoravno črto pri $60\,\mathrm{N}$.

:::premisli
Potiskaš s $P = 90\,\mathrm{N}$. Kolikšna je sila trenja in ali kovček miruje, drsi enakomerno ali pospešuje? Napovej, preden pogledaš.
---
$60\,\mathrm{N}$. Potisk presega mejo $80\,\mathrm{N}$, zato kovček drsi in velja $\mu_\mathrm{t} N = 0{,}3 \cdot 200\,\mathrm{N}$. Preostalih $30\,\mathrm{N}$ ni uravnoteženih, zato kovček pospešuje.
:::

**Posplošitev 1: lepenje.** Dokler ploskvi ne drsita druga ob drugi, govorimo o **lepenju** (statičnem trenju). Sila lepenja ni podana vnaprej. Je neznanka, ki jo dobiš iz ravnotežnih enačb. Navzgor je omejena:

$$|F| \le \mu_\mathrm{l} N$$

Število $\mu_\mathrm{l}$ je **koeficient lepenja**. Je brez enote in odvisen od para snovi ter stanja površin: suho, mokro, zaledenelo. $N$ je normalna sila v stiku, ki ni nujno enaka teži.

**Posplošitev 2: drsno trenje.** Ko ploskvi drsita, je sila trenja

$$F = \mu_\mathrm{t} N$$

in kaže nasproti **relativni hitrosti** drsenja. $\mu_\mathrm{t}$ je **koeficient trenja**; običajno je $\mu_\mathrm{t} < \mu_\mathrm{l}$. Oba zakona skupaj imenujemo **Coulombovo trenje**. V literaturi srečaš tudi oznake $\mu_0$ in $\mu$ ali $k_\mathrm{l}$ in $k_\mathrm{t}$.

**Posplošitev 3: smer.** Lepenje nasprotuje *težnji* po drsenju, torej smeri, v katero bi telo zdrsnilo brez trenja. Pri kovčku na klančini kaže navzgor po klancu. Če smeri ne poznaš, jo predpostaviš. Negativen rezultat pomeni, da kaže nasprotno.

**Posplošitev 4: klanec in mejni kot.** Telo s težo $G$ miruje na klancu z naklonom $\alpha$. Ravnotežje vzdolž klanca in pravokotno nanj da

$$F = G \sin\alpha, \qquad N = G \cos\alpha$$

Pogoj $F \le \mu_\mathrm{l} N$ postane $G\sin\alpha \le \mu_\mathrm{l} G \cos\alpha$, torej

$$\tan\alpha \le \mu_\mathrm{l}$$

Kotu $\varphi_\mathrm{l} = \arctan \mu_\mathrm{l}$ rečemo **mejni kot lepenja**. Naklon resnične ceste razbereš z znaka ali karte. Prometni znak »$12\,\%$« pomeni $\tan\alpha = 0{,}12$, torej $\alpha \approx 6{,}8^\circ$. Na topografski karti dobiš $\tan\alpha$ kot razliko višin dveh plastnic, deljeno z vodoravno razdaljo med njima.

:::premisli
Natovorjen avto bolj pritiska na cesto, a ga tudi bolj vleče navzdol. Ali zdrsne pri manjšem naklonu kot prazen?
---
Ne. Potrebna sila $G\sin\alpha$ in meja $\mu_\mathrm{l} G\cos\alpha$ sta obe sorazmerni z $G$. Če avto obtežiš, narasteta v enakem razmerju in teža se pokrajša. Natovorjen in prazen avto zdrsneta pri istem naklonu.
:::

**Zakaj ploščina ne šteje.** V Coulombovem modelu je meja odvisna le od $\mu_\mathrm{l}$ in $N$. Ležeč in pokončen kovček imata enako $N$, zato enako mejo. Mikroskopski razlog je v razdelku »Bolj natančno«.

**Postopek za naloge s trenjem.**

1. Nariši prosto telo. Trenje vriši nasproti težnji drsenja.
2. Predpostavi mirovanje in iz ravnotežja izračunaj potrebno $F$ in $N$.
3. Preveri $|F| \le \mu_\mathrm{l} N$. Če velja, telo miruje. Če ne velja, drsi in $F = \mu_\mathrm{t} N$.
4. Pri vprašanju »pri kateri sili ali kotu se začne gibati« dodaj enačbo $F = \mu_\mathrm{l} N$.

## Rešeni primeri

### Primer 1 (lažji): ali se kovček premakne?

Kovček s težo $200\,\mathrm{N}$ stoji na vodoravnih tleh, koeficient lepenja je $0{,}4$. Potiskaš ga vodoravno s silo $60\,\mathrm{N}$. Ali se premakne? Kolikšna je sila lepenja?

**Podatki:** $G = 200\,\mathrm{N}$, $\mu_\mathrm{l} = 0{,}4$, $P = 60\,\mathrm{N}$ (vodoravno)
**Iščemo:** ali kovček miruje in silo lepenja $F$

:::formula
Ravnotežje: $N = G$ in $F = P$; pogoj mirovanja: $F \le \mu_\mathrm{l} N$
:::

**Rešitev:**

1. Potisk je vodoraven, zato navpično velja $N = G = 200\,\mathrm{N}$.
2. Meja lepenja: $\mu_\mathrm{l} N = 0{,}4 \cdot 200\,\mathrm{N} = 80\,\mathrm{N}$.
3. Predpostavimo mirovanje: $F = P = 60\,\mathrm{N}$.
4. Ker je $60\,\mathrm{N} \le 80\,\mathrm{N}$, predpostavka drži.
5. Odgovor: kovček se ne premakne. Sila lepenja je $60\,\mathrm{N}$, ne $80\,\mathrm{N}$.

### Primer 2: vlečenje za pas pod kotom

Isti kovček vlečeš za pas, ki z vodoravnico oklepa kot $30^\circ$ navzgor. Kolikšna je najmanjša sila v pasu, pri kateri kovček ravno zdrsne?

**Podatki:** $G = 200\,\mathrm{N}$, $\mu_\mathrm{l} = 0{,}4$, kot pasu $\beta = 30^\circ$
**Iščemo:** mejno silo $P$

:::formula
Navpično: $N + P\sin\beta = G$

Vodoravno na meji: $P\cos\beta = \mu_\mathrm{l} N$
:::

**Rešitev:**

1. Pas kovček delno dviguje, zato $N = G - P\sin\beta$. Normalna sila je manjša od teže.
2. Na meji zdrsa: $P\cos\beta = \mu_\mathrm{l}(G - P\sin\beta)$.
3. Izrazimo $P$: $P = \dfrac{\mu_\mathrm{l} G}{\cos\beta + \mu_\mathrm{l}\sin\beta}$.
4. Vstavimo $\cos 30^\circ \approx 0{,}866$ in $\mu_\mathrm{l}\sin 30^\circ = 0{,}2$: $P = \dfrac{80\,\mathrm{N}}{1{,}066} \approx 75{,}0\,\mathrm{N}$.
5. Kontrola: $N = 200\,\mathrm{N} - 37{,}5\,\mathrm{N} = 162{,}5\,\mathrm{N}$, $\mu_\mathrm{l} N = 65{,}0\,\mathrm{N}$, $P\cos\beta \approx 65{,}0\,\mathrm{N}$. Ujema se.
6. Odgovor: kovček zdrsne pri sili v pasu približno $75\,\mathrm{N}$. To je manj kot $80\,\mathrm{N}$ pri vodoravnem potisku, ker vlečenje navzgor zmanjša $N$.

### Primer 3 (težji): parkiranje na ledu, naklon z zemljevida

Na planinski karti v merilu $1 : 25\,000$ cesta med plastnicama $1200\,\mathrm{m}$ in $1250\,\mathrm{m}$ meri $1{,}0\,\mathrm{cm}$ (karta kaže vodoravno projekcijo). Avto z maso $1200\,\mathrm{kg}$ parkira na tem odseku; predpostavimo, da so zavrta vsa štiri kolesa. Koeficient lepenja med gumo in ledom je $0{,}15$, med gumo in suhim asfaltom $0{,}8$. Ali avto obstane?

**Podatki:** merilo $1 : 25\,000$, razdalja na karti $1{,}0\,\mathrm{cm}$, $\Delta h = 1250\,\mathrm{m} - 1200\,\mathrm{m} = 50\,\mathrm{m}$, $m = 1200\,\mathrm{kg}$, $g = 9{,}81\,\mathrm{m/s^2}$, $\mu_\mathrm{l,led} = 0{,}15$, $\mu_\mathrm{l,suho} = 0{,}8$
**Iščemo:** ali avto miruje na ledu in na suhem asfaltu

:::formula
$\tan\alpha = \dfrac{\Delta h}{d}$

$F = G\sin\alpha$, $N = G\cos\alpha$, pogoj: $F \le \mu_\mathrm{l} N$
:::

**Rešitev:**

1. Vodoravna razdalja: $d = 1{,}0\,\mathrm{cm} \cdot 25\,000 = 25\,000\,\mathrm{cm} = 250\,\mathrm{m}$.
2. Naklon: $\tan\alpha = \dfrac{50\,\mathrm{m}}{250\,\mathrm{m}} = 0{,}2$. To je $20\,\%$ oziroma $\alpha \approx 11{,}3^\circ$.
3. Teža: $G = 1200\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} = 11\,772\,\mathrm{N}$.
4. Ravnotežje zahteva $F = G\sin\alpha \approx 2309\,\mathrm{N}$; normalna sila je $N = G\cos\alpha \approx 11\,543\,\mathrm{N}$.
5. Led: $\mu_\mathrm{l} N = 0{,}15 \cdot 11\,543\,\mathrm{N} \approx 1731\,\mathrm{N}$. To je manj od potrebnih $2309\,\mathrm{N}$, zato lepenje ne zadošča.
6. Suho: $\mu_\mathrm{l} N = 0{,}8 \cdot 11\,543\,\mathrm{N} \approx 9234\,\mathrm{N}$. Meja je dovolj velika; dejanska sila lepenja ostane $2309\,\mathrm{N}$.
7. Hitra kontrola brez sil: $\tan\alpha = 0{,}2$ je večji od $0{,}15$ in manjši od $0{,}8$.
8. Odgovor: na suhem asfaltu avto obstane, na ledu zdrsne. Masa avta na odločitev ne vpliva.

### Primer 4 – zdaj ti: trak za prtljago

Trak, ki prtljago dviga v letalo, je nagnjen. Med gumijastim trakom in trdim kovčkom je koeficient lepenja $0{,}35$. Pri kolikšnem največjem naklonu traka kovček še ne zdrsne, ko trak stoji?

**Podatki:** $\mu_\mathrm{l} = 0{,}35$, trak miruje
**Iščemo:** največji kot $\alpha_\mathrm{max}$

:::formula
$\tan\alpha_\mathrm{max} = \mu_\mathrm{l}$
:::

**Rešitev:**

1. Kovček glede na trak miruje, zato gre za lepenje. Teža se pokrajša kot pri avtu na klancu.
2. Mejni pogoj: $\tan\alpha_\mathrm{max} = 0{,}35$.
3. Izračunaj kot sam, nato preveri:

:::premisli
Koliko je $\alpha_\mathrm{max} = \arctan 0{,}35$? Kaj se zgodi s kovčkom na traku z naklonom $35\,\%$?
---
$\alpha_\mathrm{max} \approx 19{,}3^\circ$. Naklon $35\,\%$ pomeni ravno $\tan\alpha = 0{,}35$, zato je kovček točno na meji; na vsakem strmejšem traku zdrsne.
:::

## Pogoste napake

- **»Sila lepenja je vedno $\mu_\mathrm{l} N$.«** V primeru 1 bi tako dobil $80\,\mathrm{N}$, čeprav potiskaš le s $60\,\mathrm{N}$. Kovček bi moral zdrsniti proti tebi, kar je nesmisel. $\mu_\mathrm{l} N$ je samo zgornja meja. Popravek: silo lepenja dobiš iz ravnotežja, šele nato jo primerjaš z mejo.
- **»Normalna sila je enaka teži.«** Na vodoravnih tleh brez poševnih sil res, drugod ne. Na klancu je $N = G\cos\alpha$, pri vlečenju pod kotom $N = G - P\sin\beta$. Popravek: $N$ vedno izračunaj iz ravnotežja pravokotno na stik.
- **»Večja stična ploskev pomeni večje trenje.«** Zdi se logično, a v Coulombovem modelu ploščina ne nastopa. Popravek: v enačbe ne vstavljaj ploščine; pri isti $N$ je meja enaka.
- **»Trenje vedno kaže nasproti sili, s katero vlečem.«** Kaže nasproti relativnemu drsenju ali njegovi težnji. Pri avtu, ki spelje, deluje cesta na pogonsko kolo **naprej**, ker bi stična točka brez trenja zdrsnila nazaj. Popravek: vprašaj se, kam bi zdrsnila stična točka.
- **»Ko telo zdrsne, velja še vedno $\mu_\mathrm{l}$.«** Pri drsenju velja manjši $\mu_\mathrm{t}$. Zato drseči avto na klancu z $\mu_\mathrm{t} < \tan\alpha < \mu_\mathrm{l}$ ne obstane sam od sebe, čeprav bi mirujoč ostal na mestu.

## Povzetek

- Lepenje: telo miruje, $|F| \le \mu_\mathrm{l} N$; velikost $F$ sledi iz ravnotežnih enačb.
- Drsno trenje: $F = \mu_\mathrm{t} N$, nasproti relativni hitrosti; običajno $\mu_\mathrm{t} < \mu_\mathrm{l}$.
- Normalno silo $N$ vedno izračunaj iz ravnotežja; ni nujno enaka teži.
- Na klancu telo miruje, dokler je $\tan\alpha \le \mu_\mathrm{l}$; teža se pokrajša. Naklon v odstotkih je $100 \cdot \tan\alpha$.
- V Coulombovem modelu velikost stične ploskve ne vpliva na trenje.
- Postopek: predpostavi mirovanje, izračunaj potrebno $F$, preveri mejo.

## Za izpit

Znati moraš povedati:

- definicijo lepenja in Coulombov pogoj $|F| \le \mu_\mathrm{l} N$ ter zakaj je sila lepenja neznanka iz ravnotežnih enačb, ne $\mu_\mathrm{l} N$;
- zakon drsnega trenja $F = \mu_\mathrm{t} N$, smer sile (nasproti relativni hitrosti oziroma težnji drsenja) in razmerje $\mu_\mathrm{t} < \mu_\mathrm{l}$;
- izpeljavo pogoja $\tan\alpha \le \mu_\mathrm{l}$ za mirovanje na klancu, definicijo mejnega kota lepenja $\varphi_\mathrm{l} = \arctan\mu_\mathrm{l}$ in zakaj se teža pokrajša;
- postopek: predpostavi mirovanje, izračunaj potrebna $F$ in $N$, preveri mejo; na meji zdrsa dodaj $F = \mu_\mathrm{l} N$;
- stožec trenja, zakaj je naloga z več stiki določena šele v mejnem stanju in kdaj se telo prej prevrne, kot zdrsne.

### Naloga 1

Zaboj s težo $600\,\mathrm{N}$ leži na klancu z naklonom $25^\circ$; koeficient lepenja je $0{,}3$. Ob klanec ga pritiskaš z vodoravno silo $P$, ki kaže proti klancu. (a) Pokaži, da zaboj brez sile $P$ zdrsne. (b) Določi najmanjšo in največjo silo $P$, pri kateri zaboj še miruje. (c) Kolikšna je sila lepenja in kam kaže pri $P = 400\,\mathrm{N}$? (d) Pri kateri sili $P$ lepenje sploh ni potrebno?

**Rešitev:**

1. Brez $P$ velja pogoj $\tan\alpha \le \mu_\mathrm{l}$. Ker je $\tan 25^\circ \approx 0{,}466 > 0{,}3$, zaboj zdrsne navzdol.
2. Prosto telo s silo $P$; silo lepenja $F$ štejemo pozitivno navzgor po klancu. Vzdolž klanca: $F + P\cos\alpha - G\sin\alpha = 0$. Pravokotno na klanec: $N = G\cos\alpha + P\sin\alpha$. Vodoravna sila poveča normalno silo.
3. Najmanjša sila: zaboj teži navzdol, lepenje kaže navzgor in je na meji, $F = \mu_\mathrm{l} N$. Iz $G\sin\alpha - P\cos\alpha = \mu_\mathrm{l}(G\cos\alpha + P\sin\alpha)$ sledi $P_\mathrm{min} = G\,\dfrac{\sin\alpha - \mu_\mathrm{l}\cos\alpha}{\cos\alpha + \mu_\mathrm{l}\sin\alpha}$.
4. Vstavimo $\sin 25^\circ \approx 0{,}4226$ in $\cos 25^\circ \approx 0{,}9063$: $P_\mathrm{min} = 600\,\mathrm{N} \cdot \dfrac{0{,}1507}{1{,}0331} \approx 87{,}5\,\mathrm{N}$.
5. Največja sila: zaboj teži navzgor, lepenje kaže navzdol, $F = -\mu_\mathrm{l} N$. Dobimo $P_\mathrm{max} = G\,\dfrac{\sin\alpha + \mu_\mathrm{l}\cos\alpha}{\cos\alpha - \mu_\mathrm{l}\sin\alpha} = 600\,\mathrm{N} \cdot \dfrac{0{,}6945}{0{,}7795} \approx 534{,}6\,\mathrm{N}$.
6. Kontrola z mejnim kotom lepenja $\varphi_\mathrm{l} = \arctan 0{,}3 \approx 16{,}7^\circ$: izraza sta enaka $G\tan(\alpha - \varphi_\mathrm{l}) = 600\,\mathrm{N} \cdot \tan 8{,}3^\circ \approx 87{,}5\,\mathrm{N}$ in $G\tan(\alpha + \varphi_\mathrm{l}) = 600\,\mathrm{N} \cdot \tan 41{,}7^\circ \approx 534{,}6\,\mathrm{N}$. Ujema se.
7. Pri $P = 400\,\mathrm{N}$: $F = G\sin\alpha - P\cos\alpha \approx 253{,}6\,\mathrm{N} - 362{,}5\,\mathrm{N} = -108{,}9\,\mathrm{N}$. Negativni predznak pomeni, da lepenje kaže navzdol po klancu. $N \approx 543{,}8\,\mathrm{N} + 169{,}0\,\mathrm{N} = 712{,}8\,\mathrm{N}$, meja $\mu_\mathrm{l} N \approx 213{,}8\,\mathrm{N}$. Ker je $108{,}9\,\mathrm{N} < 213{,}8\,\mathrm{N}$, zaboj miruje.
8. Lepenje ni potrebno, ko je $F = 0$: $P = G\tan\alpha = 600\,\mathrm{N} \cdot 0{,}4663 \approx 279{,}8\,\mathrm{N}$.
9. Odgovor: zaboj miruje za $87{,}5\,\mathrm{N} \le P \le 534{,}6\,\mathrm{N}$. Pri $400\,\mathrm{N}$ je sila lepenja približno $109\,\mathrm{N}$ navzdol po klancu, pri $279{,}8\,\mathrm{N}$ je nič. Smer lepenja se torej znotraj območja mirovanja obrne.

### Naloga 2

Lestev z dolžino $4{,}0\,\mathrm{m}$ in težo $120\,\mathrm{N}$ (težišče na sredini) je prislonjena ob gladko navpično steno in s tlemi oklepa kot $60^\circ$. Koeficient lepenja med lestvijo in tlemi je $0{,}4$. Po lestvi se vzpenja človek s težo $700\,\mathrm{N}$. (a) Kako daleč vzdolž lestve lahko pride, preden lestev zdrsne? (b) Kolikšen mora biti koeficient lepenja, da varno pride do vrha?

**Rešitev:**

1. Prosto telo lestve: v spodnjem koncu $A$ normalna sila tal $N_A$ navzgor in sila lepenja $F$ proti steni; v zgornjem koncu $B$ le normalna sila stene $N_B$ (stena je gladka); teža lestve $G_\mathrm{l}$ na sredini in teža človeka $G_\mathrm{č}$ na razdalji $s$ od $A$, merjeno vzdolž lestve.
2. Navpično: $N_A = G_\mathrm{l} + G_\mathrm{č} = 120\,\mathrm{N} + 700\,\mathrm{N} = 820\,\mathrm{N}$. Vodoravno: $F = N_B$.
3. Momenti glede na $A$ ($\theta = 60^\circ$): $N_B L\sin\theta = G_\mathrm{l}\,\dfrac{L}{2}\cos\theta + G_\mathrm{č}\,s\cos\theta$. Čim više je človek, tem večja sta $N_B$ in potrebno lepenje.
4. Meja zdrsa: $F = \mu_\mathrm{l} N_A = 0{,}4 \cdot 820\,\mathrm{N} = 328\,\mathrm{N}$, torej $N_B = 328\,\mathrm{N}$.
5. Ročice: $L\sin\theta = 4{,}0\,\mathrm{m} \cdot 0{,}866 \approx 3{,}464\,\mathrm{m}$, $\dfrac{L}{2}\cos\theta = 2{,}0\,\mathrm{m} \cdot 0{,}5 = 1{,}0\,\mathrm{m}$. Momentna enačba: $328\,\mathrm{N} \cdot 3{,}464\,\mathrm{m} = 120\,\mathrm{N\,m} + 350\,\mathrm{N} \cdot s$.
6. $s = \dfrac{1136{,}2\,\mathrm{N\,m} - 120\,\mathrm{N\,m}}{350\,\mathrm{N}} \approx 2{,}90\,\mathrm{m}$.
7. Človek na vrhu ($s = L$): $N_B = \dfrac{120\,\mathrm{N\,m} + 700\,\mathrm{N} \cdot 2{,}0\,\mathrm{m}}{3{,}464\,\mathrm{m}} \approx 438{,}8\,\mathrm{N}$. Potrebni koeficient: $\mu_\mathrm{l} \ge \dfrac{438{,}8\,\mathrm{N}}{820\,\mathrm{N}} \approx 0{,}535$.
8. Odgovor: lestev zdrsne, ko je človek približno $2{,}90\,\mathrm{m}$ od spodnjega konca (na slabih treh četrtinah lestve). Za vzpon do vrha bi moral biti koeficient lepenja vsaj $0{,}54$. Prazna lestev potrebuje le $F \approx 34{,}6\,\mathrm{N}$, zato miruje; nevarnost naraste šele z višino človeka.

### Naloga 3

Natančno navedi Coulombov zakon za lepenje in za drsno trenje. Izpelji pogoj, pri katerem telo miruje na klancu z naklonom $\alpha$, in utemelji, zakaj ni odvisen od teže telesa. Utemelji, ali se telo, ki po klancu že drsi, samo ustavi, če velja $\mu_\mathrm{t} < \tan\alpha < \mu_\mathrm{l}$.

**Rešitev:**

1. Lepenje: dokler stični ploskvi ne drsita druga ob drugi, je sila lepenja tolikšna, kot zahteva ravnotežje, in omejena z $|F| \le \mu_\mathrm{l} N$. Kaže nasproti težnji drsenja. $N$ je normalna sila v stiku, $\mu_\mathrm{l}$ koeficient lepenja (brez enote, odvisen od para snovi in stanja površin).
2. Drsno trenje: ko ploskvi drsita, je $F = \mu_\mathrm{t} N$ in kaže nasproti relativni hitrosti; običajno je $\mu_\mathrm{t} < \mu_\mathrm{l}$.
3. Klanec, prosto telo: teža $G$, normalna sila $N$ pravokotno na klanec, lepenje $F$ navzgor po klancu. Ravnotežje vzdolž klanca da $F = G\sin\alpha$, pravokotno nanj $N = G\cos\alpha$.
4. Pogoj $F \le \mu_\mathrm{l} N$ postane $G\sin\alpha \le \mu_\mathrm{l} G\cos\alpha$. Delimo z $G\cos\alpha > 0$: $\tan\alpha \le \mu_\mathrm{l}$ oziroma $\alpha \le \varphi_\mathrm{l} = \arctan\mu_\mathrm{l}$.
5. Neodvisnost od teže: potrebna sila $G\sin\alpha$ in meja $\mu_\mathrm{l} G\cos\alpha$ sta obe sorazmerni z $G$, zato se $G$ pokrajša. Težje telo potrebuje večje lepenje, a ima v enakem razmerju večjo mejo.
6. Drseče telo: zdaj velja $F = \mu_\mathrm{t} N = \mu_\mathrm{t} G\cos\alpha$. Rezultanta vzdolž klanca navzdol je $G\sin\alpha - \mu_\mathrm{t} G\cos\alpha = G\cos\alpha\,(\tan\alpha - \mu_\mathrm{t}) > 0$, ker je $\tan\alpha > \mu_\mathrm{t}$.
7. Odgovor: telo miruje, če je $\tan\alpha \le \mu_\mathrm{l}$, ne glede na težo. Telo, ki že drsi, se pri $\mu_\mathrm{t} < \tan\alpha < \mu_\mathrm{l}$ ne ustavi, ampak pospešuje navzdol, čeprav bi isto telo na istem klancu mirovalo, če bi ga tja položili brez hitrosti.

## Drugače: Z analogijo

Lepenje si predstavljaj kot plačilno kartico z limitom na potovanju.

- Račun v restavraciji je **sila, ki jo mora lepenje uravnotežiti**. Kartica plača natanko znesek računa, ne več in ne manj. Pri računu $60\,€$ odide $60\,€$, ne celoten limit.
- **Limit** je $\mu_\mathrm{l} N$. Dokler je račun pod limitom, plačilo vedno uspe.
- Ko račun preseže limit, plačilo »zdrsne«. Pri trenju se nato zgodi nekaj posebnega: telo dobi le še manjši, stalen znesek $\mu_\mathrm{t} N$, ne glede na velikost računa.
- Težji avto je kot popotnik z višjo plačo: dobi večji limit, a tudi dražje račune. Na klancu se oboje poveča v istem razmerju.

Analogija ima mejo: denar nima smeri, sila lepenja pa vedno kaže nasproti težnji drsenja.

## Drugače: Bolj natančno

**Stožec trenja.** Normalna sila in sila trenja sta komponenti ene same reakcije podlage $\vec R$. Pri lepenju je kot med $\vec R$ in normalo največ $\varphi_\mathrm{l} = \arctan\mu_\mathrm{l}$. Vse dovoljene reakcije ležijo v stožcu z vrhom v stični točki in polovičnim kotom $\varphi_\mathrm{l}$. Telo miruje, če lahko ravnotežje dosežemo z reakcijami znotraj stožcev vseh stikov.

**Neenačba namesto enačbe.** Coulombov zakon je pogoj tipa $|F| \le \mu_\mathrm{l} N$. Pri telesu z več stiki (lestev na tleh in ob steni) imaš zato pogosto več neznank kot ravnotežnih enačb. Naloga postane določena šele, ko predpostaviš mejno stanje v enem ali več stikih.

**Zdrs ali prevrnitev.** Visok kovček, ki ga potiskaš visoko, se lahko prevrne, preden zdrsne. Preveri oba pogoja: zdrs pri $F = \mu_\mathrm{l} N$ in prevrnitev, ko se prijemališče $N$ premakne na rob podporne ploskve. Zgodi se tisto, kar zahteva manjšo silo.

**Zakaj ploščina ne šteje.** Površini se dotikata le v vrhovih mikroskopskih neravnin. Prava stična ploščina je približno sorazmerna z $N$ in obratno sorazmerna s trdoto materiala. Strižna trdnost teh mikrostikov da $F \propto N$, navidezna ploščina pa izpade.

**Meje modela.** $\mu$ je odvisen od hitrosti, temperature, vlage in časa mirovanja. Pri gumi in mazanih ležajih Coulombov model velja le približno. Za statiko togih teles je kljub temu dober in standarden.

## Preveri se

? Avtobus stoji na postaji na klancu z zategnjeno zavoro. Kako imenujemo silo ceste na gume vzdolž ceste in kaj zanjo velja?
- Drsno trenje, $F = \mu_\mathrm{t} N$
~ Gume ne drsijo po cesti. Drsno trenje nastopi šele pri relativnem drsenju.
+ Sila lepenja, $F \le \mu_\mathrm{l} N$; velikost sledi iz ravnotežja
- Sila lepenja, vedno enaka $\mu_\mathrm{l} N$
~ $\mu_\mathrm{l} N$ je le zgornja meja. Dejanska sila je toliko, kolikor zahteva ravnotežje.
- Normalna sila, $N = G$
~ Normalna sila je pravokotna na cesto, na klancu pa je $N = G\cos\alpha$, ne $G$.
> Avtobus miruje, zato gre za lepenje. Sila lepenja je $G\sin\alpha$, pogoj mirovanja pa $G\sin\alpha \le \mu_\mathrm{l} N$.

? Trije enaki kovčki ($G = 200\,\mathrm{N}$, $\mu_\mathrm{l} = 0{,}4$, $\mu_\mathrm{t} = 0{,}3$) so na vodoravnih tleh. A ni potiskan, B potiskaš vodoravno s $30\,\mathrm{N}$, C s $100\,\mathrm{N}$. Katera razvrstitev sil trenja je pravilna?
- C ($100\,\mathrm{N}$) > B ($30\,\mathrm{N}$) > A ($0$)
~ Pri drsenju sila trenja ni enaka potisku, ampak $\mu_\mathrm{t} N = 60\,\mathrm{N}$.
- A = B = C, vsi $80\,\mathrm{N}$
~ To je zmota, da je lepenje vedno $\mu_\mathrm{l} N$. Mirujoč kovček A sploh nima trenja.
+ C ($60\,\mathrm{N}$) > B ($30\,\mathrm{N}$) > A ($0$)
- C ($80\,\mathrm{N}$) > B ($30\,\mathrm{N}$) > A ($0$)
~ Kovček C drsi, zato velja manjši koeficient $\mu_\mathrm{t}$, ne $\mu_\mathrm{l}$.
> A: ni sile, ki bi jo bilo treba uravnotežiti. B: miruje, $F = 30\,\mathrm{N} < 80\,\mathrm{N}$. C: $100\,\mathrm{N} > 80\,\mathrm{N}$, drsi, $F = 0{,}3 \cdot 200\,\mathrm{N} = 60\,\mathrm{N}$.

? Avto miruje na suhem klancu z naklonom $10\,\%$. V prtljažnik naložiš $300\,\mathrm{kg}$ prtljage. Kaj se zgodi?
- Avto zdrsne, ker ga večja teža bolj vleče navzdol.
~ Večja teža poveča tudi normalno silo in s tem mejo lepenja, v istem razmerju.
- Avto miruje, sila lepenja ostane enaka kot prej.
~ Sila lepenja je $G\sin\alpha$, zato z večjo težo naraste.
+ Avto miruje; sila lepenja naraste, a enako naraste tudi njena meja.
- Avto zdaj miruje z večjo varnostjo, ker gume bolj pritiskajo na cesto.
~ Rezerva naraste, a tudi potrebna sila. Razmerje med njima ostane enako, pogoj $\tan\alpha \le \mu_\mathrm{l}$ se ne spremeni.
> Pogoj mirovanja $\tan\alpha \le \mu_\mathrm{l}$ ne vsebuje teže, zato dodatna prtljaga ne vpliva na to, ali avto obstane.

? Nahrbtnik s težo $150\,\mathrm{N}$ leži na vodoravni polici, $\mu_\mathrm{l} = 0{,}5$. Potisneš ga vodoravno s $50\,\mathrm{N}$ in se ne premakne. Kolikšna je sila lepenja?
- $75\,\mathrm{N}$
~ To je meja $\mu_\mathrm{l} N$. Dejanska sila je le toliko, kolikor potiskaš.
- $0\,\mathrm{N}$
~ Nahrbtnik miruje prav zato, ker lepenje uravnoteži potisk.
- $25\,\mathrm{N}$
~ To je $\mu_\mathrm{l} \cdot P$. Koeficient se množi z normalno silo, in še to le za mejo.
+ $50\,\mathrm{N}$
> Iz ravnotežja $F = P = 50\,\mathrm{N}$. Ker je $50\,\mathrm{N} \le 0{,}5 \cdot 150\,\mathrm{N} = 75\,\mathrm{N}$, nahrbtnik res miruje.

? Kolikšen je najmanjši koeficient lepenja, da kovček miruje na klančini z naklonom $20^\circ$?
- $0{,}34$
~ To je $\sin 20^\circ$. Pogoj je razmerje $\dfrac{\sin\alpha}{\cos\alpha} = \tan\alpha$.
+ $0{,}36$
- $0{,}94$
~ To je $\cos 20^\circ$, normalna komponenta na enoto teže, ne pogoj za lepenje.
- $0{,}20$
~ Zamenjava stopinj in odstotkov: $20^\circ$ ni $20\,\%$.
> $\mu_\mathrm{l} \ge \tan 20^\circ \approx 0{,}36$.

:::simboli
F | sila trenja (lepenja) med podlago in telesom | F = \mu_\mathrm{t} N | N | pri mirovanju F ≤ μ_l N
\mu_\mathrm{l} | koeficient lepenja | \mu_\mathrm{l} = \tan\alpha_\mathrm{max} | – | običajno večji od μ_t
\mu_\mathrm{t} | koeficient trenja (pri drsenju) | \mu_\mathrm{t} = \frac{F}{N} | – | običajno μ_t < μ_l
N | normalna sila podlage | | N | na klancu N = G cos α, na vodoravnih tleh N = G
G | teža telesa | | N
P | potisna (vlečna) sila | | N
\alpha | naklonski kot klanca | \tan\alpha = \frac{\Delta h}{d} | °
\alpha_\mathrm{max} | mejni kot klanca | \tan\alpha_\mathrm{max} = \mu_\mathrm{l} | ° | pri večjem naklonu telo zdrsne
\varphi_\mathrm{l} | mejni kot lepenja (torni kot) | \varphi_\mathrm{l} = \arctan\mu_\mathrm{l} | °
\beta | kot vlečne sile (pasu) glede na vodoravnico | | °
h | nadmorska višina | | m | Δh višinska razlika med plastnicama
d | vodoravna razdalja (projekcija na karti) | | m
:::
