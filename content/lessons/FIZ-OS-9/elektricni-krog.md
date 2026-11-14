---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi baterijo in dve enaki žarnici. Poveži ju na en način in vsaka sveti tako močno, kot bi svetila sama. Poveži ju drugače in obe le medlo svetita. Baterija in žarnici sta isti. Drugačna je samo pot žic.

Še bolj nenavadno: pri svetlejši povezavi iz baterije teče **dvakrat več** toka kot pri eni sami žarnici. Porabnikov je več, pa tok ni manjši, ampak večji.

V bolnišnici to ni igra. Nad operacijsko mizo sveti svetilka z več žarnicami. Če ena pregori, kirurg ne sme ostati v temi. Monitor, ki ob postelji riše utrip srca, mora delovati tudi takrat, ko medicinska sestra ugasne bralno lučko. Zato je pomembna **vezava**: način, kako so porabniki povezani med seboj in z virom. Spoznal boš dve, zaporedno in vzporedno.

## Razlaga

**1. Najprej poskus.** Imamo baterijo z napetostjo $6\,\text{V}$ in dve enaki žarnici. Ena sama žarnica na tej bateriji ima napetost $6\,\text{V}$, ampermeter pa pokaže $0{,}4\,\text{A}$.

*Žarnici eno za drugo.* Žico od baterije pripeljemo do prve žarnice, od nje do druge in od druge nazaj do baterije. Ampermeter postavimo pred prvo žarnico, nato med žarnici in nato za drugo. Vsakič kaže isto vrednost, a manj kot $0{,}4\,\text{A}$. Voltmeter na vsaki žarnici kaže $3\,\text{V}$. Obe svetita šibkeje kot ena sama.

*Vsaka žarnica s svojo žico do baterije.* Zdaj vsako žarnico priključimo neposredno na oba pola baterije. Voltmeter na vsaki kaže $6\,\text{V}$. Skozi vsako žarnico teče $0{,}4\,\text{A}$, skozi baterijo pa $0{,}8\,\text{A}$. Obe svetita tako kot ena sama.

| Vezava | Napetost na žarnici | Tok skozi baterijo | Svetlost |
|---|---|---|---|
| ena žarnica | $6\,\text{V}$ | $0{,}4\,\text{A}$ | normalna |
| eno za drugo | $3\,\text{V}$ | manj kot $0{,}4\,\text{A}$ | šibkejša |
| vsaka s svojo žico | $6\,\text{V}$ | $0{,}8\,\text{A}$ | normalna |

Točne vrednosti toka pri prvi povezavi tu še ne računamo. Potrebovali bi Ohmov zakon, ki ga spoznaš v naslednji lekciji.

:::premisli
V obeh povezavah odvijemo eno žarnico. Napovej, kaj stori druga žarnica v prvi in kaj v drugi povezavi.
---
Pri povezavi eno za drugo druga žarnica ugasne: tok ima samo eno pot, ta pa je zdaj prekinjena. Pri povezavi s svojo žico druga sveti naprej, ker njena pot ostane sklenjena.
:::

**2. Električni krog.** Električni krog je sklenjena pot, po kateri lahko teče električni tok. Sestavljajo ga:

- vir napetosti (baterija, akumulator),
- porabniki (žarnica, upornik, motorček),
- stikalo,
- vodniki, ki vse povežejo.

Tok teče samo, če je krog **sklenjen**. Če ga kjer koli prekinemo (odpremo stikalo, pregori žarnica), tok v tem delu kroga preneha.

**3. Električni načrt.** Krog narišemo s simboli: baterija, žarnica, stikalo, upornik in črte za vodnike. Pri risanju vodnike rišemo kot ravne črte s pravimi koti.

**4. Zaporedna vezava.** Povezava »eno za drugo« iz poskusa je **zaporedna vezava**. Porabniki so vezani **eden za drugim**, tako da ima tok samo eno pot. Z $I$ označimo tok skozi vir, z $I_1$ in $I_2$ tok skozi prvi in drugi porabnik. $U$ je napetost vira, $U_1$ in $U_2$ sta napetosti na porabnikih.

- Skozi vse porabnike teče **enak tok**: $I = I_1 = I_2$.
- Napetost vira se **porazdeli** med porabnike: $U = U_1 + U_2$. V poskusu: $3\,\text{V} + 3\,\text{V} = 6\,\text{V}$.
- Če en porabnik izpade (pregori, odklopimo ga), se prekine **celoten** krog in vsi porabniki ugasnejo.
- Več ko je porabnikov, manjši je tok, zato žarnice svetijo šibkeje.

**5. Vzporedna vezava.** Povezava »vsaka s svojo žico« je **vzporedna vezava**. Točki, kjer se žica razcepi ali spet združi, rečemo **vozlišče**. Del kroga med dvema vozliščema je **veja**. Pri vzporedni vezavi je vsak porabnik v svoji veji, zato ima tok več poti.

- Na vsakem porabniku je **enaka napetost**, enaka napetosti vira: $U = U_1 = U_2$.
- Skupni tok se **razdeli** po vejah: $I = I_1 + I_2$. V poskusu: $0{,}4\,\text{A} + 0{,}4\,\text{A} = 0{,}8\,\text{A}$.
- Če en porabnik izpade, drugi **še naprej delujejo**, ker imajo svojo vejo.
- Vsak porabnik dobi napetost vira, zato sveti tako kot sam. Pri močno obremenjeni bateriji je napetost lahko malo nižja.

Zato so naprave v stanovanju in v bolnišnici vezane vzporedno: vsaka ima polno napetost in deluje ne glede na to, ali so druge vklopljene.

:::premisli
Sošolec trdi: »Druga vzporedna žarnica vzame del toka prvi, zato baterija daje enako toka kot prej.« Kje se moti?
---
Vsaka veja ima polno napetost vira, zato skozi vsako žarnico teče enak tok kot skozi žarnico, ki je sama. V vozlišču se tokova obeh vej združita, zato mora baterija dati njuno vsoto. Druga žarnica toka ne odvzame prvi, ampak doda svojo pot.
:::

**6. Primerjava.**

| | Zaporedna vezava | Vzporedna vezava |
|---|---|---|
| Tok | enak povsod | se razdeli po vejah |
| Napetost | se porazdeli | enaka na vsaki veji |
| Če en porabnik izpade | vsi ugasnejo | drugi delujejo |

**7. Merilnika.** Z ampermetrom merimo tok; vežemo ga **zaporedno** s porabnikom (tok mora teči skozi njega). Z voltmetrom merimo napetost; vežemo ga **vzporedno** s porabnikom (meri napetost med dvema točkama).

**8. Preizkusi sam.** V simulaciji spodaj, »Zaporedna in vzporedna vezava žarnic«, najprej izberi zaporedno vezavo in odvij eno žarnico. Nato isto naredi pri vzporedni vezavi. Opazuj: pri zaporedni ugasneta obe in ampermeter pokaže $0\,\text{A}$. Pri vzporedni druga žarnica sveti enako kot prej, ampermeter ob bateriji pa pokaže manjši tok.

## Rešeni primeri

### Primer 1 (lažji): zaporedna vezava

Zdravnik pri pregledu nosi naglavno svetilko. V njej sta dve različni žarnici, zaporedno vezani na baterijo z napetostjo $6\,\text{V}$. Ampermeter pokaže $0{,}2\,\text{A}$. Na prvi žarnici izmerimo $2\,\text{V}$. Kolikšen je tok skozi drugo žarnico in kolikšna je napetost na njej?

**Podatki:** zaporedna vezava dveh žarnic, $U = 6\,\text{V}$, $I = 0{,}2\,\text{A}$ (kaže ampermeter), $U_1 = 2\,\text{V}$
**Iščemo:** tok $I_2$ skozi drugo žarnico in napetost $U_2$ na njej

:::formula
Zaporedna vezava: $I = I_1 = I_2$, $U = U_1 + U_2$
:::

**Rešitev:**

1. Vezava je zaporedna, zato je tok povsod enak: $I_2 = I = 0{,}2\,\text{A}$.
2. Napetosti se seštevajo: $U = U_1 + U_2$.
3. Izrazimo: $U_2 = U - U_1 = 6\,\text{V} - 2\,\text{V} = 4\,\text{V}$.
4. Preverimo: $2\,\text{V} + 4\,\text{V} = 6\,\text{V}$, kar je enako napetosti baterije.

**Odgovor:** skozi drugo žarnico teče $0{,}2\,\text{A}$, napetost na njej je $4\,\text{V}$.

### Primer 2: vzporedna vezava

Dve žarnici sta vzporedno vezani na baterijo z napetostjo $4{,}5\,\text{V}$. Skozi prvo teče $0{,}3\,\text{A}$, skozi drugo $0{,}2\,\text{A}$. Kolikšna je napetost na vsaki žarnici in kolikšen tok teče skozi baterijo?

**Podatki:** vzporedna vezava dveh žarnic, $U = 4{,}5\,\text{V}$, $I_1 = 0{,}3\,\text{A}$, $I_2 = 0{,}2\,\text{A}$
**Iščemo:** napetosti $U_1$ in $U_2$ na žarnicah ter tok $I$ skozi baterijo

:::formula
Vzporedna vezava: $U = U_1 = U_2$, $I = I_1 + I_2$
:::

**Rešitev:**

1. Vezava je vzporedna, zato je na vsaki veji enaka napetost kot na viru: $U_1 = U_2 = 4{,}5\,\text{V}$.
2. Tok se v vozlišču razdeli, skozi baterijo pa teče vsota tokov po vejah: $I = I_1 + I_2$.
3. Vstavimo: $I = 0{,}3\,\text{A} + 0{,}2\,\text{A} = 0{,}5\,\text{A}$.

**Odgovor:** na vsaki žarnici je $4{,}5\,\text{V}$, skozi baterijo teče $0{,}5\,\text{A}$.

### Primer 3 (težji): naprave v reševalnem vozilu

V reševalnem vozilu so na akumulator z napetostjo $12\,\text{V}$ vzporedno priključeni luč nad nosili ($3\,\text{A}$), monitor za srčni utrip ($1{,}5\,\text{A}$) in aspirator, ki iz dihalnih poti posesa sluz ($4\,\text{A}$). V glavni žici je varovalka, ki prenese največ $10\,\text{A}$. Kolikšna je napetost na aspiratorju? Ali smejo vklopiti še grelno blazino, ki potrebuje $2{,}5\,\text{A}$?

**Podatki:** vzporedna vezava, $U = 12\,\text{V}$, $I_1 = 3\,\text{A}$, $I_2 = 1{,}5\,\text{A}$, $I_3 = 4\,\text{A}$, varovalka največ $10\,\text{A}$, grelna blazina $2{,}5\,\text{A}$
**Iščemo:** napetost $U_3$ na aspiratorju, tok $I$ skozi varovalko in ali je dovolj prostora za blazino

:::formula
Vzporedna vezava: $U = U_1 = U_2 = U_3$, $I = I_1 + I_2 + I_3$
:::

**Rešitev:**

1. Vsaka naprava je v svoji veji, zato ima polno napetost: $U_3 = U = 12\,\text{V}$.
2. Varovalka je v glavni žici, skozi katero teče vsota tokov vseh vej: $I = 3\,\text{A} + 1{,}5\,\text{A} + 4\,\text{A} = 8{,}5\,\text{A}$.
3. Do meje varovalke ostane še: $10\,\text{A} - 8{,}5\,\text{A} = 1{,}5\,\text{A}$.
4. Blazina bi bila nova veja z $2{,}5\,\text{A}$. Zdaj sam presodi, ali jo varovalka še prenese.

:::premisli
Ali smejo vklopiti blazino? Kaj bi se zgodilo z drugimi napravami?
---
Ne smejo: $2{,}5\,\text{A}$ je več kot preostalih $1{,}5\,\text{A}$. Skupni tok bi bil $8{,}5\,\text{A} + 2{,}5\,\text{A} = 11\,\text{A}$, varovalka bi pregorela in ugasnile bi **vse** naprave, tudi monitor.
:::

**Odgovor:** na aspiratorju je $12\,\text{V}$, skozi varovalko teče $8{,}5\,\text{A}$, do meje ostane le $1{,}5\,\text{A}$, zato blazine ne smejo vklopiti.

## Pogoste napake

- **»Tok se po žarnicah porabi.«** Učenec misli, da skozi drugo zaporedno vezano žarnico teče manj toka, ker ga je prva »vzela«, ali da se tok deli na pol. Tok se ne porabi: pri zaporedni vezavi ima eno samo pot, zato je povsod enak. Ampermeter pred prvo in za drugo žarnico kaže isto.
- **»Pri vzporedni vezavi se napetost deli.«** Učenec prenese pravilo zaporedne vezave in na vsako od dveh vej pripiše polovico napetosti. Vsaka veja pa je priključena na ista dva pola vira, zato ima vsaka polno napetost. Deli se tok, ne napetost.
- **»Več porabnikov, manj toka iz vira.«** Učenec misli, da dodana vzporedna luč tok »ovira«, zato iz vira teče manj, ali pa da ostane enak. Pri vzporedni vezavi vsaka nova veja doda svoj tok, zato tok iz vira **naraste**. Zato preveč vzporedno priključenih naprav sproži varovalko.
- **Napačna vezava merilnikov.** Ampermeter vežemo zaporedno, voltmeter vzporedno. Vzporedno vezan ampermeter ustvari skoraj neovirano pot mimo porabnika, zato steče zelo velik tok, ki lahko poškoduje merilnik.

## Povzetek

- Električni krog je sklenjena pot za tok: vir, porabniki, stikalo, vodniki.
- **Zaporedna vezava:** ena pot za tok, $I = I_1 = I_2$, $U = U_1 + U_2$. Če en porabnik izpade, ugasnejo vsi.
- **Vzporedna vezava:** več vej, $U = U_1 = U_2$, $I = I_1 + I_2$. Če en porabnik izpade, drugi delujejo naprej.
- Ampermeter vežemo zaporedno, voltmeter vzporedno.
- Pri vzporedni vezavi vsak dodani porabnik poveča tok skozi vir.
- Gospodinjske porabnike vežemo vzporedno.

## Drugače: Z analogijo

Predstavljaj si krog kot zaprto krožno cesto.

**Zaporedna vezava** je ena sama cesta, na kateri je zapored več cestninskih postaj (porabnikov). Vsi avtomobili (naboji) morajo skozi vse postaje, zato v vsakem trenutku skozi vsako postajo pelje enako število avtomobilov na sekundo. To je enak tok. Če je ena postaja zaprta, se promet ustavi povsod.

**Vzporedna vezava** je cesta, ki se razcepi na dva pasova in se kasneje spet združi. Avtomobili se razdelijo po pasovih, skupno število avtomobilov pa je vsota po obeh pasovih. Če je en pas zaprt, promet po drugem teče naprej.

Mesti, kjer se cesta razcepi in spet združi, sta vozlišči: v prvem se tok razcepi, v drugem se združi. Med njima je na obeh vejah enaka napetost.

Tudi paradoks z začetka postane jasen: ko odpreš drugi pas, po cesti pred razcepom pelje več avtomobilov, ne manj. Tako nova vzporedna veja poveča tok skozi baterijo.

## Drugače: Bolj natančno

Zakaj se v vzporedni vezavi tokovi seštevajo, v zaporedni pa napetosti?

**Ohranitev naboja.** Naboj se v krogu ne izgublja in ne nastaja. V vozlišče mora v vsaki sekundi priteči toliko naboja, kolikor ga odteče:

$$I = I_1 + I_2$$

V zaporedni vezavi ni razcepa, zato je tok povsod enak.

**Ohranitev energije.** Napetost pove, koliko energije na enoto naboja prejme naboj pri prehodu skozi vir oziroma odda pri prehodu skozi porabnik. Pri zaporedni vezavi mora naboj prepotovati vse porabnike, zato se energija, ki jo je dobil na viru, porazdeli med njih:

$$U = U_1 + U_2$$

Pri vzporedni vezavi gre naboj samo skozi eno vejo. Vsaka veja povezuje isti dve točki kroga, zato je napetost med njima za vse veje enaka:

$$U = U_1 = U_2$$

## Preveri se

? Medicinska sestra pove, da so luči v bolniški sobi vezane **vzporedno**. Kaj to pomeni?
- Luči so v isti veji, ena za drugo, zato je skozi vse enak tok.
~ To opisuje zaporedno vezavo. Pri vzporedni ima vsaka luč svojo vejo.
+ Vsaka luč je v svoji veji in ima napetost vira; če eno ugasnemo, druge svetijo naprej.
- Napetost vira se razdeli med luči, zato vsaka dobi le del napetosti.
~ Napetost se deli pri zaporedni vezavi. Pri vzporedni so vse veje na istih dveh polih vira.
> Vzporedna vezava pomeni ločene veje med dvema vozliščema. Vsaka luč ima napetost vira in deluje neodvisno od drugih.

? Dve žarnici sta vezani zaporedno. Skozi prvo teče $0{,}5\,\text{A}$. Kolikšen je tok skozi drugo?
- $0{,}25\,\text{A}$
~ Tok se ne deli med zaporedno vezane žarnice. Deli se napetost.
- $1\,\text{A}$
~ Tokov v zaporedni vezavi ne seštevamo: obstaja ena sama pot in en sam tok.
+ $0{,}5\,\text{A}$
- Ne moremo ugotoviti, ker ne poznamo napetosti.
~ Napetosti ne potrebujemo. Pri zaporedni vezavi je tok povsod enak, ne glede na napetost.
> Pri zaporedni vezavi imajo naboji samo eno pot, zato je tok skozi vse porabnike enak: $0{,}5\,\text{A}$.

? Na isto baterijo priključimo enake žarnice na tri načine: A) ena sama žarnica, B) dve zaporedno, C) dve vzporedno. Razvrsti jih po toku skozi baterijo od najmanjšega do največjega.
- A, B, C
~ Pri dveh zaporednih žarnicah tok ni večji kot pri eni: vsaka dobi le del napetosti, zato je tok manjši.
+ B, A, C
- C, A, B
~ To je obratno. Pri vzporedni vezavi se tokova vej seštejeta, zato je tok skozi baterijo največji.
- A, C, B
~ Pri vzporedni vezavi teče skozi baterijo vsota tokov obeh vej, torej več kot pri eni žarnici.
> Zaporedno vezani žarnici dobita vsaka le del napetosti, zato je tok manjši kot pri eni. Pri vzporedni ima vsaka žarnica polno napetost in svoj tok, skozi baterijo pa teče njuna vsota, torej dvakrat več kot pri eni.

? V bolniški sobi so luči vezane vzporedno. Kaj se zgodi, če prižgemo še eno luč?
- Tok skozi glavno varovalko se zmanjša, ker se mora razdeliti na več luči.
~ Nova veja ne vzame toka drugim vejam, ampak doda svojega. Tok iz vira se poveča.
- Druge luči svetijo šibkeje, ker se napetost razdeli.
~ Pri vzporedni vezavi se napetost ne deli: vsaka veja ima napetost vira.
+ Tok skozi glavno varovalko se poveča, druge luči svetijo enako.
- Nič se ne spremeni, ker se tok ne porabi.
~ Res je, da se tok ne porabi, a nova veja je nova pot. Po glavni žici teče vsota tokov vseh vej, zato je tok večji.
> Vsaka veja ima napetost vira in svoj tok. V glavni žici se tokovi vseh vej seštejejo, zato nova luč tok skozi varovalko poveča, druge luči pa ostanejo enake.

? Na vir sta vzporedno vezana dva porabnika. Ampermeter ob viru kaže $1{,}2\,\text{A}$, skozi prvi porabnik teče $0{,}5\,\text{A}$. Kolikšen tok teče skozi drugega?
- $1{,}7\,\text{A}$
~ Tu si seštel skupni tok in tok veje. Skupni tok je že vsota, zato tok druge veje dobiš z odštevanjem.
- $0{,}6\,\text{A}$
~ To je polovica skupnega toka. Tok se razdeli na pol le pri enakih porabnikih, tu pa je v prvi veji $0{,}5\,\text{A}$.
+ $0{,}7\,\text{A}$
- $1{,}2\,\text{A}$
~ Enak tok povsod velja za zaporedno vezavo. Pri vzporedni se tok razdeli po vejah.
> Velja $I = I_1 + I_2$, zato je $I_2 = I - I_1 = 1{,}2\,\text{A} - 0{,}5\,\text{A} = 0{,}7\,\text{A}$.

:::simboli
I | skupni električni tok (skozi vir) | | A | zaporedno enak povsod, vzporedno vsota tokov vej
I_1, I_2, I_3 | tok skozi posamezni porabnik | | A
U | napetost vira | | V
U_1, U_2, U_3 | napetost na posameznem porabniku | | V
:::
