---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nina je fizioterapevtka v nogometnem klubu. Novembra imajo trije igralci gnojne rane na kolenih po padcih na umetni travi. Zdravnik predpiše antibiotik, ki je pri takih okužbah lani deloval v nekaj dneh. Tokrat ne zaleže. Brisi pokažejo bakterijo *Staphylococcus aureus*, odporno proti meticilinu (MRSA).

Kapetan ekipe je prepričan: »Bakterije so se na antibiotik navadile, tako kot se mi navadimo na napor.« Nina mora odločiti, kaj storiti z brisačami, kadmi za ledeno kopel in skupnimi mazili. Če ima kapetan prav, bi bilo dovolj zamenjati antibiotik. Če nima, je težava v tem, *katere* bakterije so v slačilnici preživele.

Odgovor da evolucija z naravnim izborom. Ista razlaga pojasni tudi, kako nastanejo nove vrste in kako iz zaporedij DNA narišemo sorodstvena drevesa. Na tem stoji vsa nadaljnja biologija raznolikosti.

## Razlaga

**Kapetanova razlaga.** Zveni smiselno. Mišice športnika se ob treningu okrepijo, torej se je morda vsaka bakterija ob antibiotiku »okrepila«. Takemu pogledu rečemo dedovanje pridobljenih lastnosti (po Lamarcku). Težava je v dedovanju. Sin maratonca se ne rodi z boljšo kondicijo, ker je oče treniral. Iz poglavja o Mendlu veš, da se dedujejo aleli v DNA, ne pa spremembe, ki jih telo pridobi med življenjem.

**Kaj se je res zgodilo.** Že pred zdravljenjem je bila v populaciji bakterij peščica celic z dedno različico, zaradi katere antibiotik nanje ne deluje. Nastala je naključno: z mutacijo ob podvojevanju DNA ali s prevzemom gena od druge bakterije. Nastala bi tudi brez antibiotika. Antibiotik je občutljive celice pobil, odporne pa so se delile naprej. Nobena bakterija se ni spremenila. Spremenil se je **delež** odpornih v populaciji.

**Naravni izbor.** Opisani proces je **naravni izbor** (selekcija). Deluje, kadar hkrati veljajo tri stvari:

1. **Variabilnost.** Osebki v populaciji se razlikujejo.
2. **Dednost.** Del razlik je zapisan v genih in preide na potomce.
3. **Različen razmnoževalni uspeh.** Nekatere različice imajo v danem okolju več plodnih potomcev kot druge.

Če velja vse troje, se pogostost ugodnih alelov iz generacije v generacijo veča. **Evolucija** je prav to: sprememba pogostosti alelov v populaciji skozi generacije. Evolvira populacija, ne posameznik. Pogostost alelov spreminjajo naravni izbor, genski zdrs (naključje v majhnih populacijah), mutacije in pretok genov.

**Hardy–Weinbergov zakon.** Da vemo, kdaj se populacija spreminja, potrebujemo primerjavo. Naj ima avtosomni gen v diploidni populaciji alela $A$ in $a$ s frekvencama $p$ in $q = 1 - p$ (frekvenca je delež alela med vsemi kopijami gena v populaciji), enakima pri obeh spolih. Naj bo populacija zelo velika, generacije ločene, parjenje naključno, brez mutacij, pretoka genov in izbora. Potem se $p$ in $q$ iz generacije v generacijo ne spreminjata, frekvence genotipov pa so že po eni generaciji $AA : Aa : aa = p^2 : 2pq : q^2$.

Dokaz: pri naključnem parjenju se gamete združujejo naključno. Ker izbora ni in vsak alel starša preide v gameto z enako verjetnostjo (mejoza), gameta nosi $A$ z verjetnostjo $p$. Potomec je $AA$ z verjetnostjo $p \cdot p = p^2$, $aa$ s $q^2$, $Aa$ pa z $2pq$ ($A$ od matere in $a$ od očeta ali obratno). Frekvenca $A$ med potomci je $p^2 + \tfrac12 \cdot 2pq = p(p + q) = p$. Če genotipi v naravi odstopajo od teh razmerij, eden od pogojev ne velja.

**Fitnes ni kondicija.** Mera, ki odloča, je **biološki fitnes**: koliko plodnih potomcev pusti nosilec neke različice v primerjavi z drugimi. Natančneje: **absolutni fitnes** $W$ je povprečno število plodnih potomcev na osebek z dano različico v eni generaciji, **relativni fitnes** pa $w = W/W_\mathrm{max}$, tako da ima najuspešnejša različica $w = 1$. Šibka, a hitro deleča se bakterija ima lahko večji fitnes od močne, ki se deli počasi. Fitnes je vedno vezan na okolje. Brez antibiotika odpornost pogosto nič ne prinese, celo stane.

**Enačba izbora.** Naj bosta v populaciji haploidnih organizmov (bakterij) z ločenimi generacijami dve različici: odporna z deležem $p$ in stalnim relativnim fitnesom $w_R$ ter občutljiva z deležem $q = 1 - p$ in stalnim fitnesom $w_S$; novih mutacij ni. Potem je

$$p' = \frac{p\,w_R}{\bar w}, \qquad \bar w = p\,w_R + q\,w_S,$$

$$\frac{p_t}{q_t} = \frac{p_0}{q_0}\left(\frac{w_R}{w_S}\right)^t.$$

Izpeljava: od $N$ celic jih je $pN$ odpornih in pustijo $pN\,W_R$ potomcev, občutljive pa $qN\,W_S$. Delež odpornih med potomci je $\dfrac{pW_R}{pW_R + qW_S}$; števec in imenovalec delimo z $W_\mathrm{max}$. Enako je $q' = q\,w_S/\bar w$, zato $\dfrac{p'}{q'} = \dfrac{p}{q} \cdot \dfrac{w_R}{w_S}$: vsaka generacija pomnoži razmerje z $w_R/w_S$, po $t$ generacijah $t$-krat. Če je $w_R > w_S$, razmerje raste geometrijsko, sicer pada.

:::premisli
Kapetan napove: »Ko antibiotika ne bo več, se ga bodo bakterije odvadile.« Klub preneha uporabljati antibiotik, odporni sevi pa se delijo malo počasneje kot občutljivi. Kaj se bo res zgodilo z deležem odpornih čez nekaj mesecev in zakaj?
---
Delež bo počasi padal. Brez antibiotika imajo občutljive celice večji fitnes, ker se hitreje delijo. Izbor ni usmerjen »naprej«, ampak vedno k temu, kar v trenutnem okolju pusti več potomcev.
:::

**Od populacije do vrste.** Biološka **vrsta** je skupina populacij, katerih osebki se lahko med seboj križajo in imajo plodne potomce. Od drugih vrst jih loči **razmnoževalna izolacija**. Pojem velja le za organizme s spolnim razmnoževanjem; bakterije in fosile razvrščamo po zaporedjih ali zgradbi. Pregrade so dveh vrst:

| Pregrada | Kdaj deluje | Primer |
|---|---|---|
| prezigotna | pred oploditvijo | drugačen čas parjenja, drugačno dvorjenje |
| postzigotna | po oploditvi | potomec propade ali je neploden (mula) |

Proces nastajanja novih vrst je **speciacija**. Najpogostejša je **alopatrična**: fizična ovira (gorovje, morje, reka) razdeli populacijo. Med delama ni več pretoka genov. Mutacije, izbor in naključje (genski zdrs) ju vodijo vsakega po svoje. Po dovolj generacijah se osebki obeh delov ob ponovnem srečanju ne morejo več uspešno križati.

Pri **simpatrični** speciaciji ovire ni. Pri rastlinah je pogosta pot **poliploidija**. Napaka pri mejozi da diploidno gameto ($2n$). Iz dveh takih gamet nastane tetraploidna rastlina ($4n$). Ta je plodna s sabo, s starševsko vrsto pa da triploidne ($3n$) potomce.

:::premisli
Zakaj so triploidni potomci skoraj vedno neplodni? Pomagaj si z mejozo.
---
V mejozi I se homologni kromosomi združijo v pare. Pri treh kopijah vsakega kromosoma ostane eden brez para in naključno odide na eno stran. Gamete dobijo neuravnoteženo število kromosomov in večinoma niso sposobne za oploditev. Tetraploid in diploid sta zato v eni generaciji ločeni vrsti.
:::

**Filogenija.** Ker vse vrste izvirajo iz skupnih prednikov, njihovo sorodnost narišemo kot **filogenetsko drevo**. Vrhovi vej so današnje vrste. Vsako **vozlišče** je skupni prednik vrst nad njim. Koren je najstarejši skupni prednik vseh vrst na drevesu.

```
        ┌──── zebra
     ┌──┤
  ┌──┤  └──── osel
  │  └─────── konj
──┤
  └────────── nosorog
```

Sorodnost bereš po vozliščih, ne po vrstnem redu vrhov. Zebra in osel imata najmlajšega skupnega prednika, zato sta si najbližja. Vejo pri vozlišču lahko zasukaš (osla narišeš nad zebro) in drevo ostane isto. Skupina, ki obsega prednika in *vse* njegove potomce, je **klad** (monofiletska skupina). Skupina s prednikom in le delom potomcev je **parafiletska** (plazilci brez ptic).

Drevesa danes rišemo predvsem iz zaporedij DNA. Več razlik pomeni daljši čas od razcepa. Če se razlike nabirajo približno enakomerno, govorimo o **molekulski uri**: razdalja je sorazmerna s časom od skupnega prednika. Natančneje: naj se v obeh linijah nabirajo spremembe s stalno hitrostjo $r$ na mesto na leto. Potem je pričakovano število razlik na odseku z $L$ mesti $d = 2rLt$, kjer je $t$ čas od razcepa. Faktor $2$ je zato, ker se razlike od skupnega prednika nabirajo v obeh linijah. Zveza velja, dokler je razlik malo v primerjavi z $L$ (na istem mestu ni več zaporednih sprememb). Iz para z znanim časom $t_\text{ref}$ (fosil) sledi $t = t_\text{ref} \cdot \dfrac{d}{d_\text{ref}}$, saj se $2rL$ okrajša.

Iz tabele razdalj drevo pod predpostavko molekulske ure zgradimo z metodo **UPGMA**: (1) združi par z najmanjšo razdaljo $d$ in vozlišče postavi na višino $d/2$; (2) razdalja nove skupine do vsake druge je povprečje razdalj vseh njenih članov; (3) ponavljaj, dokler ne ostane ena skupina.

## Rešeni primeri

### Primer 1 (lažji): brisače v slačilnici

Na brisači v slačilnici je $1\,000\,000$ celic stafilokoka. Med njimi je $0{,}1\,\%$ odpornih proti antibiotiku. Antibiotik pobije $99{,}9\,\%$ občutljivih celic, odpornih pa ne. Kolikšen delež preživelih celic je odporen?

**Podatki:** $N = 1\,000\,000$ celic, delež odpornih pred zdravljenjem $0{,}1\,\%$, antibiotik pobije $99{,}9\,\%$ občutljivih in $0\,\%$ odpornih
**Iščemo:** delež odpornih med preživelimi

:::formula
$\text{delež odpornih} = \dfrac{N_\text{odp}}{N_\text{odp} + N_\text{obč}}$, štejemo le preživele
:::

**Rešitev:**

1. Odpornih je $0{,}1\,\%$ od $1\,000\,000$, torej $1000$ celic. Vse preživijo, ker antibiotik nanje ne deluje.
2. Občutljivih je $1\,000\,000 - 1000 = 999\,000$.
3. Preživi jih $0{,}1\,\%$: $999\,000 \cdot 0{,}001 = 999$.
4. Preživelih je skupaj $1000 + 999 = 1999$.
5. Delež odpornih: $\dfrac{1000}{1999} \approx 0{,}500$.
6. Odgovor: delež odpornih je po enem zdravljenju zrasel z $0{,}1\,\%$ na približno $50\,\%$, čeprav se ni spremenila nobena celica.

### Primer 2: izbor skozi generacije

Pri nizki koncentraciji antibiotika preživi in se razmnoži vsaka odporna celica, od občutljivih pa le polovica. Relativni fitnes odpornih je zato $w_R = 1$, občutljivih $w_S = 0{,}5$. Na začetku je delež odpornih $p_0 = 0{,}1$. Kolikšen je po dveh generacijah?

**Podatki:** $w_R = 1$, $w_S = 0{,}5$, $p_0 = 0{,}1$, število generacij $2$
**Iščemo:** delež odpornih $p_2$

:::formula
$p' = \dfrac{p \cdot w_R}{p \cdot w_R + (1 - p) \cdot w_S}$
:::

**Rešitev:**

1. Števec je delež odpornih, utežen s fitnesom. Imenovalec je povprečni fitnes populacije, da se deleži seštejejo v $1$.
2. Prva generacija: $p_1 = \dfrac{0{,}1}{0{,}1 + 0{,}9 \cdot 0{,}5} = \dfrac{0{,}1}{0{,}55} \approx 0{,}182$.
3. Druga generacija: $p_2 = \dfrac{0{,}182}{0{,}182 + 0{,}818 \cdot 0{,}5} = \dfrac{0{,}182}{0{,}591} \approx 0{,}308$.
4. Odgovor: po dveh generacijah je odpornih približno $31\,\%$ celic. Delež se je v samo dveh generacijah približno potrojil.

### Primer 3 (težji): drevo iz razlik in molekulska ura

V odseku DNA z $L = 1200$ mesti so našteli razlike med štirimi vrstami (zaokroženi podatki za vajo): zebra–osel $4$, konj–zebra $8$, konj–osel $10$, nosorog–zebra $110$, nosorog–osel $112$, nosorog–konj $114$. Razcep med nosorogovo in konjevo linijo je po fosilih star $56$ milijonov let. Z metodo UPGMA nariši drevo, oceni čas razcepa zebra–osel in razcepa konja od njiju ter izračunaj hitrost sprememb $r$ na mesto na leto.

**Podatki:** $d(\text{Z}, \text{O}) = 4$, $d(\text{K}, \text{Z}) = 8$, $d(\text{K}, \text{O}) = 10$, $d(\text{N}, \text{Z}) = 110$, $d(\text{N}, \text{O}) = 112$, $d(\text{N}, \text{K}) = 114$; $L = 1200$; $t_\text{ref} = 56$ milijonov let za razcep med nosorogovo in konjevo linijo
**Iščemo:** obliko drevesa, čase razcepov in hitrost $r$

:::formula
UPGMA: združi najbližji par, nove razdalje so povprečja. Molekulska ura: $t = t_\text{ref} \cdot \dfrac{d}{d_\text{ref}}$, $\quad r = \dfrac{d}{2Lt}$
:::

**Rešitev:**

1. Najmanjša razdalja je $4$, zato zebro in osla združimo v prvem vozlišču. Imata najmlajšega skupnega prednika.
2. Nove razdalje do skupine {Z, O}: konj $\dfrac{8 + 10}{2} = 9$, nosorog $\dfrac{110 + 112}{2} = 111$.
3. Najmanjša je zdaj $9$, zato se konj pridruži paru. Razdalja nosoroga do {Z, O, K} je povprečje vseh treh: $\dfrac{110 + 112 + 114}{3} = 112$.
4. Nosorog je zunanja skupina in se veže pri korenu. Drevo je ((zebra, osel), konj), nosorog, kot v razlagi.
5. Umeritev: $112$ razlik ustreza $56$ milijonom let, torej $0{,}5$ milijona let na razliko.
6. Zebra–osel: $t = 56 \cdot \dfrac{4}{112} = 2$ milijona let; konj od njiju: $t = 56 \cdot \dfrac{9}{112} = 4{,}5$ milijona let.
7. Hitrost: $r = \dfrac{112}{2 \cdot 1200 \cdot 56 \cdot 10^6} \approx 8{,}3 \cdot 10^{-10}$ na mesto na leto; faktor $2$, ker se razlike nabirajo v obeh linijah.
8. Odgovor: drevo ima obliko ((zebra, osel), konj), nosorog. Zebra in osel sta se ločila pred približno $2$ milijonoma let, konj pred približno $4{,}5$ milijona let; hitrost sprememb je okoli $8 \cdot 10^{-10}$ na mesto na leto.

### Primer 4: zdaj ti

Po zdravljenju je v slačilnici delež odpornih $p = 0{,}5$. Klub antibiotik ukine. Brez njega imajo odporne celice fitnes $w_R = 0{,}8$, občutljive pa $w_S = 1$. Kolikšen bo delež odpornih v naslednji generaciji?

**Podatki:** $p = 0{,}5$, $w_R = 0{,}8$, $w_S = 1$
**Iščemo:** delež odpornih $p'$

:::formula
$p' = \dfrac{p \cdot w_R}{p \cdot w_R + (1 - p) \cdot w_S}$
:::

**Rešitev:**

1. Števec: $0{,}5 \cdot 0{,}8 = 0{,}4$.
2. Imenovalec in količnik izračunaj sam, nato preveri:

:::premisli
Koliko je $p'$? Ali delež raste ali pada?
---
Imenovalec je $0{,}4 + 0{,}5 \cdot 1 = 0{,}9$, zato $p' = \dfrac{0{,}4}{0{,}9} \approx 0{,}444$. Delež pada, ker je v okolju brez antibiotika fitnes odpornih manjši.
:::

## Pogoste napake

- **»Organizem se spremeni, ker mora.«** Študent misli, da antibiotik v bakteriji sproži odpornost. Mutacije nastajajo naključno, ne glede na potrebe organizma. Okolje jih ne naroči, le izbere med obstoječimi. Pravilno: različica je obstajala že prej, izbor je povečal njen delež.
- **»Posameznik evolvira.«** Bakterija, ki je preživela, je ista kot prej. Spreminja se sestava populacije. Pravilno: evolucija je sprememba pogostosti alelov v populaciji skozi generacije.
- **»Preživi najmočnejši.«** Fitnes ni moč ali vzdržljivost, ampak število plodnih potomcev v danem okolju. Pravilno: vprašaj, kdo pusti več potomcev, ne kdo je močnejši.
- **Branje drevesa po vrstnem redu vrhov.** Dve vrsti, narisani druga ob drugi, nista nujno najbližji sorodnici. Pravilno: poišči najmlajše skupno vozlišče.
- **»Človek izvira iz šimpanza.«** Današnje vrste so na vrhovih vej, ne na deblu. Pravilno: človek in šimpanz imata skupnega prednika, ki ni bil ne eno ne drugo.

## Povzetek

- Naravni izbor deluje, če obstajajo variabilnost, dednost in različen razmnoževalni uspeh.
- Evolucija je sprememba pogostosti alelov v populaciji; posameznik ne evolvira, pridobljene lastnosti se ne dedujejo.
- Biološki fitnes je relativno število plodnih potomcev in je odvisen od okolja.
- Vrsta je skupina populacij, ki se plodno križajo; ločuje jo razmnoževalna izolacija (prezigotne in postzigotne pregrade).
- Speciacija je alopatrična (ločitev z oviro) ali simpatrična (npr. poliploidija pri rastlinah).
- Filogenetsko drevo beremo po vozliščih (skupni predniki); klad je prednik z vsemi potomci; molekulska ura pretvori število razlik v čas.

## Za izpit

Znati moraš povedati:

- definicijo evolucije, tri pogoje naravnega izbora ter absolutni in relativni fitnes;
- Hardy–Weinbergov zakon z vsemi pogoji in njegov dokaz;
- izpeljavo $p' = p\,w_R/\bar w$ in zakona $\dfrac{p_t}{q_t} = \dfrac{p_0}{q_0}\left(\dfrac{w_R}{w_S}\right)^t$ s predpostavkami;
- definicijo biološke vrste, prezigotne in postzigotne pregrade, alopatrično in simpatrično speciacijo ter zakaj je triploid neploden;
- branje drevesa, klad, metodo UPGMA in molekulsko uro $d = 2rLt$.

### Naloga 1

Ob začetku zdravljenja je delež odpornih bakterij $p_0 = 0{,}001$. Ob antibiotiku je $w_R = 1$ in $w_S = 0{,}5$. (a) Po koliko generacijah delež odpornih prvič preseže $0{,}99$? (b) Ko je delež $0{,}99$, antibiotik ukinejo; brez njega je $w_R = 0{,}8$ in $w_S = 1$. Po koliko generacijah delež pade pod $0{,}10$? (c) Utemelji, zakaj odpornost nastane hitreje, kot izgine.

**Rešitev:**

1. Delamo z razmerjem $R = p/q$, ki se vsako generacijo pomnoži z $w_R/w_S$. Začetek: $R_0 = \dfrac{0{,}001}{0{,}999} \approx 1{,}001 \cdot 10^{-3}$; cilj: $\dfrac{0{,}99}{0{,}01} = 99$.
2. (a) Pogoj $R_0 \cdot 2^t > 99$ da $2^t > \dfrac{99}{1{,}001 \cdot 10^{-3}} \approx 98\,900$, torej $t > \log_2 98\,900 \approx 16{,}6$.
3. Preverimo: po $16$ generacijah je $R \approx 65{,}6$ in $p \approx 0{,}985$, po $17$ pa $R \approx 131$ in $p \approx 0{,}992$. Prvič preseže $0{,}99$ po $17$ generacijah.
4. (b) Začetek $R = 99$, cilj $\dfrac{0{,}10}{0{,}90} \approx 0{,}111$, faktor na generacijo $\dfrac{0{,}8}{1} = 0{,}8$.
5. Pogoj $99 \cdot 0{,}8^t < 0{,}111$ da $0{,}8^t < \dfrac{1}{891}$, torej $t > \dfrac{\ln 891}{-\ln 0{,}8} = \dfrac{6{,}792}{0{,}2231} \approx 30{,}4$.
6. Preverimo: po $30$ generacijah je $p \approx 0{,}109$, po $31$ pa $p \approx 0{,}089$. Pod $0{,}10$ pade po $31$ generacijah.
7. (c) Hitrost določa logaritem faktorja: $\ln 2 \approx 0{,}69$ proti $|\ln 0{,}8| \approx 0{,}22$. Antibiotik je močan dejavnik izbora, cena odpornosti pa majhna.
8. Odgovor: odporni prevladajo v $17$ generacijah, za upad pod $10\,\%$ pa je potrebnih $31$ generacij, ker je izbor proti odpornosti približno trikrat šibkejši od izbora zanjo.

### Naloga 2

Natančno navedi Hardy–Weinbergov zakon z vsemi pogoji in ga dokaži. V veliki populaciji ima $16\,\%$ osebkov recesivni fenotip $aa$. Utemelji, pod katero predpostavko lahko izračunaš delež heterozigotov, in ga izračunaj.

**Rešitev:**

1. Naj ima avtosomni gen v diploidni populaciji alela $A$ in $a$ s frekvencama $p$ in $q = 1 - p$, enakima pri obeh spolih. Naj bo populacija zelo velika, generacije ločene, parjenje naključno, brez mutacij, pretoka genov in izbora. Potem sta $p$ in $q$ stalni, genotipi pa so v razmerju $p^2 : 2pq : q^2$.
2. Dokaz: gamete se združujejo naključno; ker izbora ni in vsak alel starša preide v gameto z enako verjetnostjo, gameta nosi $A$ z verjetnostjo $p$. Zato je $P(AA) = p^2$, $P(aa) = q^2$, $P(Aa) = 2pq$ (dve poti).
3. Frekvenca $A$ pri potomcih: $p^2 + \tfrac12 \cdot 2pq = p(p + q) = p$, torej se ne spremeni.
4. Fenotipa $AA$ in $Aa$ ne ločimo, zato heterozigotov ne moremo prešteti. Predpostavimo, da populacija izpolnjuje pogoje zakona; potem je $q^2 = 0{,}16$.
5. $q = \sqrt{0{,}16} = 0{,}4$, $p = 1 - 0{,}4 = 0{,}6$.
6. Heterozigoti: $2pq = 2 \cdot 0{,}6 \cdot 0{,}4 = 0{,}48$.
7. Odgovor: ob Hardy–Weinbergovem ravnovesju je heterozigotov $48\,\%$; brez te predpostavke iz samega deleža $aa$ ne moremo sklepati.

## Drugače: Kot zgodba

Predstavljaj si ligo s $100$ ekipami, ki ne trenirajo. Ob koncu sezone vsaka ekipa iz boljše polovice ustanovi dve novi z enako taktiko in redkimi naključnimi spremembami; slabša polovica razpade. Po nekaj sezonah prevladajo taktike, uspešne pri teh pravilih. Nobena ekipa se ni spremenila, spremenila se je sestava lige.

Če liga razpade na dve regiji z različnimi pravili, se ekipe čez dolgo časa ne morejo več pomeriti: to je speciacija. Rodovnik, katera ekipa je ustanovila katero, je filogenetsko drevo.

## Drugače: Uporaba v stroki

- **Medicina.** Bolnišnice vodijo programe smotrne rabe antibiotikov: ciljano in čim krajše zdravljenje zmanjša izbor odpornih sevov.
- **Biotehnologija.** Pri usmerjeni evoluciji encim naključno mutirajo in v več krogih izberejo najboljše različice (Nobelova nagrada za kemijo 2018).
- **Epidemiologija.** Iz zaporedij virusnih genomov rišejo filogenetska drevesa in z molekulsko uro ocenijo, kdaj se je nova različica pojavila.

## Drugače: Korak za korakom s številkami

Primer 2 z razmerjem $\dfrac{p}{1-p}$ namesto po generacijah:

1. Na začetku: $\dfrac{0{,}1}{0{,}9} \approx 0{,}111$.
2. Vsaka generacija ga pomnoži z $\dfrac{w_R}{w_S} = 2$; po dveh: $0{,}111 \cdot 4 \approx 0{,}444$.
3. Nazaj v delež: $p = \dfrac{0{,}444}{1 + 0{,}444} \approx 0{,}308$, enako kot v primeru 2.

## Drugače: Bolj natančno

Zakon $\dfrac{p_t}{q_t} = \dfrac{p_0}{q_0}\left(\dfrac{w_R}{w_S}\right)^t$ iz razlage velja za haploidne organizme. Pri diploidnih je fitnes vezan na genotip ($AA$, $Aa$, $aa$), zato je izbor proti recesivnemu alelu zelo počasen, ko je ta redek: večinoma se skriva v heterozigotih. Če je $aa$ smrten, ostali pa enako uspešni, ob naključnem parjenju velja $q' = \dfrac{q}{1 + q}$ in po $t$ generacijah $q_t = \dfrac{q_0}{1 + t\,q_0}$: frekvenco $0{,}01$ izbor prepolovi šele v $100$ generacijah.

## Preveri se

? Kateri od naštetih pogojev **ni** potreben za delovanje naravnega izbora?
- Osebki se med seboj razlikujejo.
~ Brez variabilnosti izbor nima med čim izbirati, zato je ta pogoj nujen.
- Razlike se vsaj delno dedujejo.
~ Če se razlike ne dedujejo, se uspeh staršev ne prenese na potomce in pogostost alelov se ne spremeni.
+ Organizem potrebuje spremembo, da preživi.
- Nekatere različice imajo več plodnih potomcev.
~ Prav različen razmnoževalni uspeh je jedro izbora.
> Potreba organizma ne povzroči mutacij. Izbor deluje na variabilnost, ki že obstaja.

? Delež odpornih bakterij je $p = 0{,}2$. Fitnes odpornih je $w_R = 1$, občutljivih $w_S = 0{,}6$. Kolikšen je delež odpornih v naslednji generaciji?
- $0{,}2$
~ Delež se spremeni, ker imata skupini različen fitnes.
- $0{,}333$
~ To je $0{,}2 / 0{,}6$. Imenovalec mora biti povprečni fitnes $0{,}2 \cdot 1 + 0{,}8 \cdot 0{,}6$.
+ $0{,}294$
- $0{,}385$
~ Tu je za občutljive uporabljen delež, ki umre ($0{,}4$), namesto deleža, ki preživi ($0{,}6$).
> $p' = \dfrac{0{,}2}{0{,}2 + 0{,}8 \cdot 0{,}6} = \dfrac{0{,}2}{0{,}68} \approx 0{,}294$.

? Reka spremeni strugo in razdeli populacijo hroščev na dva dela. Zakaj lahko čez dolgo časa nastaneta dve vrsti?
- Ker voda neposredno spremeni gene hroščev.
~ Okolje ne piše mutacij. Vpliva le na to, katere različice se uspešneje razmnožujejo.
+ Ker med deloma ni pretoka genov, zato mutacije, izbor in naključje vsak del spreminjajo po svoje.
- Ker se hrošči na vsakem bregu prilagodijo med svojim življenjem in to prenesejo na potomce.
~ Pridobljene lastnosti se ne dedujejo; spreminja se pogostost alelov v populaciji.
> To je alopatrična speciacija: ločeni populaciji kopičita razlike, dokler ne nastane razmnoževalna izolacija.

? Na drevesu se A in B združita v vozlišču X, C in D v vozlišču Y, X in Y pa v korenu. Vrhovi so narisani v vrstnem redu A, B, C, D. Študent sklepa: (1) B in C sta narisana drug ob drugem; (2) zato sta B in C najbližja sorodnika; (3) A in D imata skupnega prednika le v korenu. Kateri korak je napačen?
- Korak (1)
~ To je le opis slike in je točen.
+ Korak (2)
- Korak (3)
~ A je pod X, D pod Y, zato je njun najmlajši skupni prednik res koren.
> Sorodnost beremo po najmlajšem skupnem vozlišču. B in C se srečata šele v korenu, B in A pa že v X.

? Na golf igrišču so deset let škropili travo z istim herbicidom proti plevelu. Zdaj se enoletna latovka po škropljenju ne posuši več. Katera razlaga je najboljša?
- Latovka se je herbicida postopoma navadila, kot se športnik navadi na napor.
~ To je dedovanje pridobljenih lastnosti. Odporne rastline so obstajale že prej in jih je herbicid izbral.
+ Herbicid je vsako leto pobil občutljive rastline, odporne so se razmnožile in njihov delež je narasel.
- Herbicid je v rastlinah povzročil mutacije za odpornost.
~ Mutacije nastajajo naključno, ne zato, ker bi jih rastlina potrebovala.
> Isti mehanizem kot pri MRSA v slačilnici: isti dejavnik izbora vsako leto poveča delež odpornih.

:::simboli
p_t | delež odpornih po t generacijah | | – |
q_t | delež občutljivih po t generacijah | q_t = 1 - p_t | – |
p_0 | začetni delež odpornih | | – |
q | delež občutljivih ali frekvenca alela a | q = 1 - p | – |
\bar w | povprečni fitnes populacije | \bar w = p\,w_R + q\,w_S | – |
r | hitrost sprememb na mesto na leto | r = \dfrac{d}{2Lt} | 1/leto |
L | število mest v primerjanem odseku DNA | | – |
q_0 | začetni delež občutljivih | q_0 = 1 - p_0 | – |
w_R | relativni fitnes odpornih | | – | najbolj uspešni imajo 1
w_S | relativni fitnes občutljivih | | – |
t | število generacij | | – | pri molekulski uri čas razcepa v milijonih let
N_\text{odp} | število preživelih odpornih celic | | – |
N_\text{obč} | število preživelih občutljivih celic | | – |
p | delež odpornih v tej generaciji | | – |
p' | delež odpornih v naslednji generaciji | p' = \dfrac{p \cdot w_R}{p \cdot w_R + (1 - p) \cdot w_S} | – |
t_\text{ref} | znani čas razcepa za referenčni par | | milijon let |
d | genetska razdalja med vrstama | | – | število razlik v zaporedju
d_\text{ref} | genetska razdalja referenčnega para | | – |
:::
