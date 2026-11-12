---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Medicinska sestra Tina gospodu Kosu, ki težko diha, dvigne vzglavje bolniške postelje. Čez pol ure ga najde zdrsnjenega proti vznožju. Sodelavec Rok skomigne: »Gospod Kos je pač težak. Težki pacienti zdrsnejo prej, lahki ostanejo.« Tina mora odločiti, za koliko sme dvigniti vzglavje in ali mora težje pacientke in paciente nameščati drugače.

V negi se pogosto priporoča »pravilo 30«: vzglavje dvignemo recimo največ za približno $30^\circ$, razen če stanje pacienta (na primer težko dihanje) zahteva več. Taka meja zmanjša drsenje in strig, pri katerem se koža premika drugače kot tkiva pod njo.

Ali ima Rok prav? Preizkusi doma. Na leseno desko za rezanje postavi solničko in desko počasi dviguj na enem koncu. Solnička nekaj časa stoji, nato naenkrat zdrsne. Z ravnilom izmeri višino dvignjenega konca ($h$) in vodoravno razdaljo od spodnjega konca do točke tik pod dvignjenim koncem ($d$). Ponovi s polno in s skoraj prazno solničko: zdrsne težja prej, kasneje ali pri enakem naklonu?

Do konca lekcije boš znal iz $h$ in $d$ izračunati, kako »oprijemljiva« je deska, in Roku pojasniti, kje se moti.

## Razlaga

**Mamljiva misel.** Rok sklepa tako: težji pacient ima večjo težo, zato ga močneje vleče navzdol po postelji, zato zdrsne prej. Prvi del drži. A pozabil je, da težji pacient tudi močneje pritiska na posteljo. Da ugotovimo, kaj to pomeni za trenje, najprej merimo na vodoravni podlagi.

**Prvi poskus: lonec na pultu.** Lonec postavimo na kuhinjski pult in ga vlečemo z dinamometrom vodoravno. Vanj postopoma nalivamo vodo, da ima z vsebino maso $1$, $2$ in $3\,\mathrm{kg}$. Pult pritiska na lonec navzgor s silo podlage, ki je enaka teži. Pri trenju ji rečemo **pritisna sila** $F_\mathrm{p}$: s to silo sta podlaga in telo stisnjena drug ob drugega. Za vsak lonec zapišemo dve sili: največjo, pri kateri lonec še stoji, in silo, ko že enakomerno drsi. V tem poskusu računamo z zaokroženim $g \approx 9{,}8\,\mathrm{m/s^2}$.

| $F_\mathrm{p}$ [N] | lonec še stoji do [N] | med drsenjem [N] |
|---|---|---|
| $9{,}8$ | $3{,}9$ | $2{,}9$ |
| $19{,}6$ | $7{,}8$ | $5{,}9$ |
| $29{,}4$ | $11{,}8$ | $8{,}8$ |

Preden bereš naprej, poišči v tabeli dva vzorca.

**Kaj opazimo.** Ko se pritisna sila podvoji, se podvojita tudi obe sili. Razmerje je stalno: v srednjem stolpcu $\dfrac{3{,}9}{9{,}8} \approx 0{,}40$ v vsaki vrstici, v desnem okoli $0{,}30$. Drugi vzorec: za premik potrebujemo vedno več sile kot za drsenje.

Graf spodaj pokaže, kako pult odgovarja, ko vlečno silo $F$ počasi večamo. Na sliki je lonec z maso $2\,\mathrm{kg}$: do $7{,}84\,\mathrm{N}$ (v tabeli zaokroženo na $7{,}8\,\mathrm{N}$) je vodoravna sila pulta enaka tvoji, nato pade na $5{,}88\,\mathrm{N}$ (v tabeli $5{,}9\,\mathrm{N}$) in ostane tam. V aplikaciji premakni drsnik mase in opazuj, da se oba odseka sorazmerno raztegneta, oblika »rampa, padec, ravnina« pa ostane.

:::risba graf
opis: Graf vodoravne sile, s katero pult zadržuje lonec, v odvisnosti od vlečne sile F. Masa lonca je {m} kg. Od nič do {3.92*m:.2} N graf narašča kot premica y = F: lonec miruje. Pri {3.92*m:.2} N pade na {2.94*m:.2} N in ostane vodoraven: lonec drsi.
x: 0 .. 15 | 3 | F (N)
y: 0 .. 15 | 3 | vodoravna sila pulta (N)
drsnik: m | 1 .. 3 | 0,5 | 2 | masa lonca m v kilogramih
črta: 0; 0 -> 3.92*m; 3.92*m | modra debelo
črta: 3.92*m; 3.92*m -> 3.92*m; 2.94*m | siva črtkano
črta: 3.92*m; 2.94*m -> 15; 2.94*m | rdeča debelo
napis: 0,3; 8 | lepenje | desno | modra
puščica: 1,2; 7,2 -> 1,6; 1,6 | | | siva
napis: 12; 2.94*m | trenje | pod | rdeča
točka: 3.92*m; 3.92*m | {3.92*m:.2} N | nad
podnapis: Masa m = {m} kg: lepenje do {3.92*m:.2} N, drsno trenje {2.94*m:.2} N
:::

Še en poskus: poln tetrapak mleka vlečemo enkrat pokončno, enkrat položenega na bok. Ploskev, ki se dotika pulta, je zdaj veliko večja, a dinamometer obakrat pokaže okoli $2{,}1\,\mathrm{N}$. **Velikost stične ploskve ne vpliva.**

Zakaj? Nobena površina ni čisto gladka. Pod mikroskopom ima drobne vrhove, in telesi se v resnici dotikata le v teh vrhovih. Na večji ploskvi se teža razdeli na več vrhov, zato je vsak manj stisnjen in se manj splošči. Skupna površina dejanskega stika je zato skoraj enaka: odvisna je od pritisne sile, ne od velikosti ploskve.

:::premisli
Lonec z maso $3\,\mathrm{kg}$ vlečeš s silo $6\,\mathrm{N}$ in še stoji. S kolikšno silo ga pult takrat zadržuje? Napovej, preden pogledaš.
---
Prav s $6\,\mathrm{N}$, ne z $11{,}8\,\mathrm{N}$. Lonec miruje, zato mora biti rezultanta nič: pult vrača natanko toliko, kolikor vlečeš. $11{,}8\,\mathrm{N}$ je le meja, do katere zmore.
:::

**Ime za opažanje.** Sila, ki telo zadržuje, dokler miruje, je **sila lepenja** $F_\mathrm{l}$. Prilagodi se tvoji sili, a le do največje vrednosti:

$$F_\mathrm{l,max} = k_\mathrm{l}\,F_\mathrm{p}$$

Število $k_\mathrm{l}$ je **koeficient lepenja**. Nima enote in je odvisen od obeh snovi in hrapavosti površin. Za lonec na pultu je $0{,}40$.

Ko telo drsi, deluje **sila trenja** (drsno trenje). Ta je približno stalna, ne glede na to, kako močno vlečeš ali kako hitro telo drsi:

$$F_\mathrm{tr} = k_\mathrm{tr}\,F_\mathrm{p}$$

Število $k_\mathrm{tr}$ je **koeficient trenja**. Skoraj vedno je $k_\mathrm{tr} < k_\mathrm{l}$, zato »premakniti« zahteva več kot »vleči naprej«. Obe sili delujeta vzdolž podlage in nasprotujeta (možnemu) drsenju.

Koeficienti se zelo razlikujejo. Zdrav sklep v telesu ima koeficient trenja okoli $0{,}005$, približno tako malo kot drsalka na ledu. Sklepna površina skoraj ne drgne, zato se zelo počasi obrablja.

**Drugi poskus: deska za rezanje.** Vrnimo se k solnički. Na nagnjeni deski z naklonom $\alpha$ razstavimo težo $F_\mathrm{g} = m\,g$ na dve komponenti, kot pri razstavljanju sil. Kot med težo in pravokotnico na desko je prav naklon $\alpha$, zato ob kotu leži pravokotna komponenta (kosinus):

- **dinamična komponenta** vzdolž deske navzdol, $F_\parallel = F_\mathrm{g}\sin\alpha$, ki solničko vleče po deski;
- **statična komponenta** pravokotno na desko, $F_\perp = F_\mathrm{g}\cos\alpha$, ki jo pritiska ob desko. Zato je na klancu $F_\mathrm{p} = F_\mathrm{g}\cos\alpha$, manj kot na vodoravni podlagi.

:::risba skica
opis: Klanec z naklonom 30 stopinj, ki se dviga v levo, na njem kvadratna klada. Iz središča klade kaže navpično navzdol teža Fg, dolga 2 enoti. Razstavljena je na komponento vzdolž klanca navzdol, dolgo 1 enoto, in komponento pravokotno v klanec, dolgo 1,73 enote; črtkani črti dopolnita paralelogram. Pritisna sila Fp kaže pravokotno iz klanca in je enako dolga kot pravokotna komponenta. Sila lepenja Fl kaže ob stiku navzgor po klancu in je enako dolga kot komponenta vzdolž klanca.
območje: -6,5; -0,5 .. 1; 5
enota: 36
črta: -6; 3,464 -> 0; 0 -> -6; 0 | siva
lik: -3,933; 2,271 -> -3,067; 1,771 -> -2,567; 2,637 -> -3,433; 3,137 | siva zaprto
črta: -2,384; 1,954 -> -3,25; 0,454 -> -4,116; 0,954 | siva črtkano
puščica: -3,25; 2,454 -> -3,25; 0,454 | | | modra
napis: -3,15; 0,5 | F_g | desno | modra
puščica: -3,25; 2,454 -> -2,384; 1,954 | | | oranžna
napis: -2,25; 2,2 | F_∥ | desno | oranžna
puščica: -3,25; 2,454 -> -4,116; 0,954 | | | oranžna
napis: -4,2; 0,95 | F_⊥ | levo | oranžna
puščica: -3,25; 2,454 -> -2,384; 3,954 | | | zelena
napis: -2,3; 3,95 | F_p | desno | zelena
puščica: -3,45; 2,13 -> -4,316; 2,63 | | | rdeča
napis: -4,4; 2,75 | F_l | nad levo | rdeča
napis: -1,25; 0,32 | α | sredina
napis: -3,48; 1,5 | α | sredina
podnapis: Naklon 30°: komponenta vzdolž klanca je polovica teže, pravokotna komponenta 0,87 teže.
:::

Na sliki je naklon $30^\circ$. Ker je $\sin 30^\circ = 0{,}5$, je puščica $F_\parallel$ pol tako dolga kot $F_\mathrm{g}$; $F_\perp$ je $\cos 30^\circ \approx 0{,}87$ teže. Klada miruje, zato pritisna sila uravnoteži $F_\perp$, lepenje pa $F_\parallel$. To zmore le, če je $k_\mathrm{l} \ge \tan 30^\circ \approx 0{,}58$; zakaj prav tangens, pokaže račun spodaj.

Preizkusi to v simulaciji »Trenje na klancu« spodaj: koeficient lepenja postavi na $0{,}5$ in počasi večaj naklon. Zapiši kot, pri katerem klada zdrsne. Nato spremeni maso in ponovi. Opazuj, ali se kot spremeni.

Solnička še stoji, dokler zmore lepenje: $F_\parallel \le k_\mathrm{l}\,F_\mathrm{p}$. Na meji velja $m\,g\sin\alpha = k_\mathrm{l}\,m\,g\cos\alpha$. Masa in $g$ sta na obeh straneh, zato se pokrajšata. Enačbo delimo s $\cos\alpha$ in upoštevamo $\dfrac{\sin\alpha}{\cos\alpha} = \tan\alpha$. Ostane **mejni kot** $\alpha_\mathrm{m}$:

$$\tan\alpha_\mathrm{m} = k_\mathrm{l}$$

Na deski je $\tan\alpha = \dfrac{h}{d}$, zato iz tvoje meritve dobiš kar koeficient lepenja: $k_\mathrm{l} = \dfrac{h}{d}$.

Graf spodaj prikaže obe sili v odvisnosti od naklona. Polna modra krivulja je $F_\parallel = m\,g\sin\alpha$, ki z naklonom raste. Črtkana oranžna je največje lepenje $k_\mathrm{l}\,m\,g\cos\alpha$, ki z naklonom pada. Kjer se sekata, je mejni kot: levo od njega telo miruje, desno zdrsne. Na sliki je $m = 1\,\mathrm{kg}$ in $k_\mathrm{l} = 0{,}5$, presečišče je pri $26{,}6^\circ$. V aplikaciji najprej premikaj drsnik mase: obe krivulji se raztegneta, presečišče pa ostane na istem kotu. Nato premakni $k_\mathrm{l}$: šele to premakne mejni kot.

:::risba graf
opis: Graf dveh sil v odvisnosti od naklona α od 0 do 60 stopinj, za maso {m} kg in koeficient lepenja {k}. Naraščajoča modra krivulja je komponenta teže vzdolž klanca, padajoča oranžna črtkana krivulja je največje lepenje. Sekata se pri mejnem kotu {arctan(k)*180/π:.1} stopinje; levo od njega telo miruje, desno zdrsne.
x: 0 .. 60 | 10 | α (°)
y: 0 .. 24 | 4 | sila (N)
drsnik: m | 1 .. 2 | 0,25 | 1 | masa m v kilogramih
drsnik: k | 0,2 .. 1 | 0,05 | 0,5 | koeficient lepenja
f: 9.81*m*sin(x°) | modra
f: k*9.81*m*cos(x°) | oranžna črtkano
napis: 57; 9.81*m*sin(57°) | F_∥ | nad | modra
napis: 2; k*9.81*m + 0.8 | F_{l,max} | nad desno | oranžna
napis: arctan(k)*108/π; 22 | miruje | sredina
napis: arctan(k)*180/π + 1; 22 | zdrsne | desno
črta: arctan(k)*180/π; 0 -> arctan(k)*180/π; 9.81*m*sin(arctan(k)) | siva črtkano
točka: arctan(k)*180/π; 9.81*m*sin(arctan(k)) | | nad
podnapis: m = {m} kg, koeficient lepenja {k}: mejni kot {arctan(k)*180/π:.1}°
:::

:::premisli
Polna solnička je trikrat težja od prazne. Kolikokrat večja je pri njej komponenta $F_\parallel$ in kolikokrat večje največje lepenje? Zdrsne torej pri manjšem, večjem ali enakem naklonu kot prazna?
---
Pri enakem. Polna je težja, zato jo močneje vleče navzdol, a tudi močneje pritiska ob desko in lepenje je enako večje. Masa se v pogoju pokrajša, ostane le $\tan\alpha_\mathrm{m} = k_\mathrm{l}$.
:::

Rok se je torej zmotil. V preprostem modelu, kjer je trup klada na nagnjenem vzglavju, sta vlečenje navzdol in največje lepenje oba sorazmerna z maso. O zdrsu odločata le naklon in koeficient lepenja med perilom in rjuho. Pravilo $30^\circ$ zato velja za lahke in težke paciente enako. Tina zdaj ve tudi, zakaj meja pomaga: pri $30^\circ$ je $\tan 30^\circ \approx 0{,}58$, zato v tem modelu ne zdrsne nihče, pri komer je $k_\mathrm{l}$ med perilom in rjuho vsaj $0{,}58$. Pri strmejšem vzglavju mora biti oprijem večji.

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

### Primer 2: negovalni voziček z zaklenjenimi kolesi

Negovalni voziček z maso $40\,\mathrm{kg}$ ima zaklenjena kolesa, zato bi po tleh lahko le drsel. Privzemi, da je koeficient lepenja med gumo koles in tlemi $0{,}60$. Tina ga potisne vodoravno s silo $150\,\mathrm{N}$. Se premakne? Kolikšna je sila lepenja? Kolikšna sila bi ga premaknila?

**Podatki:** $m = 40\,\mathrm{kg}$, $k_\mathrm{l} = 0{,}60$, $F = 150\,\mathrm{N}$, $g = 9{,}81\,\mathrm{m/s^2}$, tla vodoravna
**Iščemo:** ali se premakne, $F_\mathrm{l}$, najmanjša sila za premik

:::formula
$F_\mathrm{l,max} = k_\mathrm{l}\,F_\mathrm{p}$; telo miruje, če je $F \le F_\mathrm{l,max}$, takrat $F_\mathrm{l} = F$
:::

**Rešitev:**

1. Na vodoravnih tleh je pritisna sila enaka teži: $F_\mathrm{p} = 40\,\mathrm{kg} \cdot 9{,}81\,\mathrm{m/s^2} = 392{,}4\,\mathrm{N}$.
2. Meja lepenja: $F_\mathrm{l,max} = 0{,}60 \cdot 392{,}4\,\mathrm{N} \approx 235\,\mathrm{N}$.
3. Potisk $150\,\mathrm{N}$ je manjši od meje, zato voziček ostane na mestu.
4. Voziček miruje, zato je rezultanta nič: sila lepenja je $150\,\mathrm{N}$, ne $235\,\mathrm{N}$.
5. Odgovor: ne premakne se; tla ga zadržujejo s $150\,\mathrm{N}$. Premaknila bi ga šele sila, večja od okoli $235\,\mathrm{N}$.

### Primer 3: koeficient iz domačega poskusa

Pri domačem poskusu z začetka je solnička zdrsnila, ko je bil konec deske dvignjen $h = 18\,\mathrm{cm}$, vodoravna razdalja do spodnjega konca pa je bila $d = 36\,\mathrm{cm}$. Kolikšen je koeficient lepenja med solničko in desko? Nato desko prekriješ s kuhinjsko krpo, s katero je koeficient lepenja $0{,}70$. Pri kolikšni višini $h$ zdrsne solnička zdaj, če je $d$ spet $36\,\mathrm{cm}$?

**Podatki:** $h = 18\,\mathrm{cm}$, $d = 36\,\mathrm{cm}$, solnička zdrsne na meji lepenja; s krpo $k_\mathrm{l}' = 0{,}70$
**Iščemo:** $k_\mathrm{l}$, mejni kot $\alpha_\mathrm{m}$ in nova višina $h'$

:::formula
$\tan\alpha_\mathrm{m} = k_\mathrm{l}$, na deski $\tan\alpha = \dfrac{h}{d}$
:::

**Rešitev:**

1. Naloga sprašuje obratno: iz kota iščemo koeficient. Na meji velja $k_\mathrm{l} = \tan\alpha_\mathrm{m}$.
2. Tangens odčitamo iz deske, enote se pokrajšajo: $\tan\alpha_\mathrm{m} = \dfrac{18}{36} = 0{,}5$, torej $k_\mathrm{l} = 0{,}50$.
3. Kot: $\alpha_\mathrm{m} \approx 26{,}6^\circ$ (tipka $\tan^{-1}$ na računalu).
4. S krpo je meja pri $\tan\alpha_\mathrm{m}' = 0{,}70$. Ker je $d$ enak, iz $\dfrac{h'}{d} = 0{,}70$ sledi $h' = 0{,}70 \cdot 36\,\mathrm{cm} \approx 25\,\mathrm{cm}$ (kot okoli $35^\circ$).
5. Odgovor: $k_\mathrm{l} = 0{,}50$ (zdrs pri okoli $27^\circ$); s krpo mora biti konec dvignjen okoli $25\,\mathrm{cm}$, preden solnička zdrsne.

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
3. Pritisna sila je po velikosti enaka statični komponenti: $F_\mathrm{p} = 2{,}4525\,\mathrm{N} \cdot \cos 35^\circ \approx 2{,}01\,\mathrm{N}$.
4. Trenje: $F_\mathrm{tr} = 0{,}40 \cdot 2{,}009\,\mathrm{N} \approx 0{,}80\,\mathrm{N}$.
5. Zadnja dva koraka, rezultanta in pospešek, sta tvoja:

:::premisli
Koliko sta $F_\mathrm{r} = F_\parallel - F_\mathrm{tr}$ in $a = \dfrac{F_\mathrm{r}}{m}$?
---
$F_\mathrm{r} \approx 1{,}407\,\mathrm{N} - 0{,}804\,\mathrm{N} \approx 0{,}60\,\mathrm{N}$ in $a \approx \dfrac{0{,}60\,\mathrm{N}}{0{,}25\,\mathrm{kg}} \approx 2{,}4\,\mathrm{m/s^2}$ navzdol po pladnju.
:::

## Pogoste napake

- **»Sila lepenja je vedno $k_\mathrm{l}F_\mathrm{p}$.«** To je le največja vrednost. Ko voziček potiskaš s $150\,\mathrm{N}$ in miruje, je lepenje $150\,\mathrm{N}$. Formulo $k_\mathrm{l}F_\mathrm{p}$ uporabi samo za vprašanje »ali se premakne«.
- **Večja ploskev, večje trenje.** Tetrapak na boku drsi enako kot pokončen. Trenje je odvisno od pritisne sile in vrste površin, ne od velikosti stične ploskve.
- **Na klancu je pritisna sila enaka teži.** Na nagnjeni deski je $F_\mathrm{p} = m\,g\cos\alpha$, kar je manj od $m\,g$. Kdor vzame $m\,g$, dobi preveliko trenje.
- **Težje telo zdrsne prej ali kasneje.** Tako je mislil Rok. Mejni kot je odvisen samo od $k_\mathrm{l}$, saj se masa pokrajša. Težja in lažja solnička zdrsneta pri istem naklonu.
- **Koeficient je kar sila.** $k_\mathrm{tr} = 0{,}3$ ni $0{,}3\,\mathrm{N}$. Koeficient nima enote; silo dobiš šele, ko ga pomnožiš s pritisno silo v newtonih.

## Povzetek

- Pritisna sila $F_\mathrm{p}$ stiska telo in podlago; na vodoravni podlagi je $F_\mathrm{p} = m\,g$, na klancu $F_\mathrm{p} = m\,g\cos\alpha$.
- Lepenje: dokler telo miruje, je sila lepenja enaka sili, ki ga hoče premakniti, največ $F_\mathrm{l,max} = k_\mathrm{l}\,F_\mathrm{p}$.
- Drsenje: $F_\mathrm{tr} = k_\mathrm{tr}\,F_\mathrm{p}$, skoraj neodvisno od hitrosti in velikosti stične ploskve; običajno $k_\mathrm{tr} < k_\mathrm{l}$.
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

Kaj pa pri naklonu $20^\circ$? Tedaj je $F_\parallel = 19{,}62\,\mathrm{N} \cdot \sin 20^\circ \approx 6{,}7\,\mathrm{N}$, meja lepenja pa $0{,}50 \cdot 19{,}62\,\mathrm{N} \cdot \cos 20^\circ \approx 9{,}2\,\mathrm{N}$. Ker je $6{,}7\,\mathrm{N} < 9{,}2\,\mathrm{N}$, sklednica miruje. Sila lepenja je takrat $6{,}7\,\mathrm{N}$, ne $9{,}2\,\mathrm{N}$, pospeška ni, koraki 5 do 7 pa odpadejo.

## Drugače: Kot zgodba

Nika pospravlja kuhinjo in hoče omaro z lonci premakniti za pol metra. Upre se vanjo. Nič. Upre se močneje. Še vedno nič, a omara »vrača« vsak njen potisk natanko toliko, kolikor ga da. To je lepenje: tiho se prilagaja.

Potem Nika pritisne še malo bolj in omara naenkrat popusti. Presenečena skoraj pade naprej, ker zdaj potrebuje opazno manj sile, da omara drsi naprej. Lepenje je popustilo, nadomestilo ga je šibkejše drsno trenje.

Brat ji svetuje: »Najprej pospravi lonce ven.« Nika jih zloži na mizo in omara se premakne pri opazno manjšem potisku. Manjša teža pomeni manjšo pritisno silo, zato sta manjša tudi največje lepenje in trenje.

Na koncu jo zanima, ali bi pomagalo, če omaro prevrne na hrbet, da se tal dotika večja ploskev. Ne bi: trenje se ne meni za velikost ploskve, le za pritisno silo in to, iz česa so tla in omara.

## Preveri se

? Tri od naštetih reči vplivajo na silo drsnega trenja med klado in podlago, ena pa ne. Katera ne sodi zraven?
- pritisna sila
~ Pritisna sila vpliva: pri loncu se je ob dvojni pritisni sili podvojilo tudi trenje.
- vrsta snovi obeh površin
~ Vrsta snovi vpliva: zato ima sklep koeficient $0{,}005$, lonec na pultu pa $0{,}30$.
- hrapavost površin
~ Hrapavost vpliva prek koeficienta trenja; bolj hrapavi površini se bolj zatikata.
+ velikost stične ploskve
> $F_\mathrm{tr} = k_\mathrm{tr}\,F_\mathrm{p}$: koeficient je odvisen od para snovi in hrapavosti, $F_\mathrm{p}$ od tega, kako močno sta telesi stisnjeni. Ploskve v enačbi ni: tetrapak na boku drsi enako kot pokončen.

? Klado na vodoravni mizi vlečemo z vedno večjo silo $F$. Graf kaže, s kolikšno silo jo miza zadržuje. Pritisna sila je $30\,\mathrm{N}$. Z grafa odčitaj potrebno silo in izračunaj koeficient lepenja.
:::risba graf
opis: Graf sile mize v odvisnosti od vlečne sile F. Od nič do 12 N je graf premica, kjer je sila mize enaka vlečni sili. Pri 12 N črtkana navpična črta pade na 9 N, nato je graf vodoraven pri 9 N do 18 N.
x: 0 .. 18 | 3 | F (N)
y: 0 .. 15 | 3 | sila mize (N)
črta: 0; 0 -> 12; 12 | modra debelo
črta: 12; 12 -> 12; 9 | siva črtkano
črta: 12; 9 -> 18; 9 | rdeča debelo
točka: 12; 12 | | nad
:::
= 0,40 | 0,01
~ 0,30 | Vzel si silo z vodoravnega dela, to je drsno trenje. Lepenje je vrh grafa, $12\,\mathrm{N}$.
~ 2,5 | Deliti moraš silo s pritisno silo, ne obratno; koeficient je navadno manjši od $1$.
> Klada se premakne pri vrhu grafa, $F_\mathrm{l,max} = 12\,\mathrm{N}$, zato $k_\mathrm{l} = \dfrac{12\,\mathrm{N}}{30\,\mathrm{N}} = 0{,}40$. Vodoravni del pri $9\,\mathrm{N}$ da $k_\mathrm{tr} = 0{,}30$.

? Tina dvigne vzglavje s $25^\circ$ na $40^\circ$ in gospod Kos začne drseti proti vznožju. Kaj je vzrok?
+ Komponenta teže vzdolž postelje se je povečala, pritisna sila pa zmanjšala, zato največje lepenje ne zadošča več.
- Pri večjem naklonu je gospod Kos težji.
~ Teža $m\,g$ ni odvisna od naklona; spremeni se le, kako se razdeli na komponenti.
- Pri večjem naklonu se postelje dotika z manjšo ploskvijo.
~ Velikost ploskve na trenje ne vpliva.
- Koeficient lepenja se pri večjem naklonu zmanjša.
~ Koeficient je lastnost para snovi (perilo in rjuha) in ostane enak. Spremenita se sili.
> $F_\parallel = m\,g\sin\alpha$ z naklonom raste, $F_\mathrm{l,max} = k_\mathrm{l}\,m\,g\cos\alpha$ pada. Ko je $\tan\alpha > k_\mathrm{l}$, telo zdrsne. Torej je $k_\mathrm{l}$ med $\tan 25^\circ \approx 0{,}47$ in $\tan 40^\circ \approx 0{,}84$.

? Tina preizkusi novo protizdrsno podlogo. Nanjo položi zložen kos pižame in podlogo počasi dviguje na enem koncu. Pižama zdrsne, ko je konec dvignjen $h = 15\,\mathrm{cm}$, vodoravna razdalja pa je $d = 25\,\mathrm{cm}$. Izračunaj koeficient lepenja med pižamo in podlogo.
= 0,60 | 0,01
~ 1,67 | Delil si $d$ s $h$. Tangens naklona je nasprotna kateta ($h$) skozi priležno ($d$).
~ 0,51 | Izračunal si sinus, $h$ deljeno z dolžino deske. Na meji je $k_\mathrm{l} = \tan\alpha$, ne $\sin\alpha$.
~ 31,0 | To je mejni kot v stopinjah. Koeficient je njegov tangens in nima enote.
> Na meji velja $k_\mathrm{l} = \tan\alpha_\mathrm{m} = \dfrac{h}{d} = \dfrac{15\,\mathrm{cm}}{25\,\mathrm{cm}} = 0{,}60$. Ker je $0{,}60 > \tan 30^\circ \approx 0{,}58$, pižama na tej podlogi pri vzglavju $30^\circ$ še ne zdrsne.

? Torba z opremo z maso $10\,\mathrm{kg}$ drsi po plošči z naklonom $20^\circ$, $k_\mathrm{tr} = 0{,}30$. Maja izračuna pospešek takole:
1) $F_\mathrm{g} = 10 \cdot 9{,}81 = 98{,}1\,\mathrm{N}$;
2) $F_\parallel = 98{,}1\,\mathrm{N} \cdot \sin 20^\circ \approx 33{,}6\,\mathrm{N}$;
3) $F_\mathrm{tr} = 0{,}30 \cdot 98{,}1\,\mathrm{N} \approx 29{,}4\,\mathrm{N}$;
4) $a = \dfrac{33{,}6\,\mathrm{N} - 29{,}4\,\mathrm{N}}{10\,\mathrm{kg}} \approx 0{,}42\,\mathrm{m/s^2}$.
Kateri korak je napačen?
- korak 1
~ Teža je res $m\,g$, ne glede na naklon.
- korak 2
~ Vzdolž klanca res deluje $F_\mathrm{g}\sin\alpha$: pri naklonu $0^\circ$ bi bila nič, kot mora biti.
+ korak 3
- korak 4
~ Postopek v koraku 4 je pravilen, le da uporabi napačno število iz enega prejšnjih korakov.
> Na klancu pritisna sila ni teža: $F_\mathrm{p} = 98{,}1\,\mathrm{N} \cdot \cos 20^\circ \approx 92{,}2\,\mathrm{N}$, zato $F_\mathrm{tr} \approx 27{,}7\,\mathrm{N}$ in $a \approx 0{,}59\,\mathrm{m/s^2}$.

? Razvrsti korake pri nalogi »ali telo na klancu zdrsne in s kolikšnim pospeškom«.
1. Nariši skico z vsemi silami na telo.
2. Težo razstavi na komponento vzdolž klanca in komponento pravokotno na klanec.
3. Izračunaj največjo silo lepenja $k_\mathrm{l}\,F_\mathrm{p}$.
4. Primerjaj $F_\parallel$ z največjim lepenjem in odloči, ali telo zdrsne.
5. Če drsi, izračunaj trenje s $k_\mathrm{tr}$ in rezultanto.
6. Iz rezultante izračunaj pospešek $a = \dfrac{F_\mathrm{r}}{m}$.
> Brez razstavljanja ne poznaš $F_\mathrm{p}$, brez primerjave pa ne veš, ali uporabiti lepenje ali trenje. Pospešek pride na konec, ker potrebuje rezultanto.

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
h | višina dvignjenega konca deske | | m | v poskusu v cm; v $h/d$ se enote pokrajšajo
d | vodoravna razdalja pod desko | | m | v poskusu v cm; v $h/d$ se enote pokrajšajo
F | sila, s katero vlečeš ali potiskaš | | N
F_\mathrm{r} | rezultanta vzdolž klanca | F_\mathrm{r} = F_\parallel - F_\mathrm{tr} | N
a | pospešek | a = \frac{F_\mathrm{r}}{m} | m/s^2
:::

<<RACUN
vrednost: 0.25*1.2*9.81 | 2.943
vrednost: 0.6*40*9.81 | 235.44
vrednost: 18/36 | 0.5
vrednost: atan(0.5)*180/pi | 26.565
vrednost: 0.25*9.81*sin(35°) | 1.4067
vrednost: 0.25*9.81*cos(35°) | 2.0090
vrednost: (0.25*9.81*sin(35°)-0.4*0.25*9.81*cos(35°))/0.25 | 2.4124
vrednost: 2*9.81*sin(30°) | 9.81
vrednost: 2*9.81*cos(30°) | 16.9914
vrednost: 0.5*2*9.81*cos(30°) | 8.4957
vrednost: (2*9.81*sin(30°)-0.4*2*9.81*cos(30°))/2 | 1.5067
vrednost: 12/30 | 0.4
vrednost: tan(40°) | 0.8391
vrednost: 15/25 | 0.6
vrednost: 0.7*36 | 25.2
vrednost: atan(0.7)*180/pi | 34.992
vrednost: 2*9.81*sin(20°) | 6.7104
vrednost: 0.5*2*9.81*cos(20°) | 9.2184
vrednost: 98.1*cos(20°) | 92.184
vrednost: (98.1*sin(20°)-0.3*98.1*cos(20°))/10 | 0.5897
>>
