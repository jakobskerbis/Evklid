---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Uganka, preden prebereš karkoli drugega. Po poletni toči je v dolini polovica streh poškodovanih. Cena strešnikov zraste za tretjino, prodajo pa se jih več kot kdajkoli. Dve leti pozneje začne obratovati nova opekarna. Cena strešnikov pade, prodaja pa spet zraste.

Enkrat višja cena in večja prodaja, drugič nižja cena in večja prodaja. Ali kupci strešnikov ne kupijo manj, ko so dražji? Poskusi razložiti oba dogodka z enim pravilom.

Če ti ne uspe, nisi edini. Rešitev zahteva dve krivulji in razliko med premikom *po* krivulji in premikom *cele* krivulje. To je osnovni model mikroekonomije. Z njim boš kasneje gradil elastičnost in teorijo potrošnika.

## Razlaga

Model postavimo na trgu hrastovih talnih desk v enem mestu. Cena $P$ je v evrih za kvadratni meter, količina $Q$ v kvadratnih metrih na teden.

**Kupci: povpraševanje.** Funkcija povpraševanja $Q_D(P)$ pove, koliko desk bi kupci kupili pri vsaki ceni, če vse drugo ostane enako. Ko so deske dražje, kdo izbere laminat, kdo prenovo odloži. Zato je $Q_D$ padajoča funkcija cene. To je **zakon povpraševanja**.

**Prodajalci: ponudba.** Funkcija ponudbe $Q_S(P)$ pove, koliko desk bi mizarji in žage ponudili pri vsaki ceni. Ima isto obliko kot povpraševanje (cena noter, količina ven), razlike pa so tri:

| | Povpraševanje | Ponudba |
|---|---|---|
| kdo odloča | kupci | proizvajalci |
| smer | padajoča | naraščajoča |
| zakaj taka smer | dražje → raje nadomestek | dražje → splača se proizvesti več |

Ponujena količina naraste, ker se pri višji ceni splača tudi dražja proizvodnja: nadure, slabše izkoriščen les, manj učinkovita delavnica.

**Ravnovesje.** Obe krivulji narišemo v isti graf. Po ekonomski navadi je cena na navpični osi, količina na vodoravni. Povpraševanje se spušča, ponudba se dviga. Sekata se v točki **tržnega ravnovesja** $(Q^*, P^*)$, kjer velja

$$Q_D(P^*) = Q_S(P^*).$$

Pri ravnovesni ceni vsak kupec, ki je pripravljen plačati to ceno, dobi blago. Vsak prodajalec, ki je pripravljen prodati po tej ceni, ga proda. Nihče nima razloga ceno spremeniti.

**Zunaj ravnovesja.** Za naš trg velja $Q_D = 1200 - 20P$ in $Q_S = -300 + 30P$:

| $P$ [€/m²] | $Q_D$ [m²] | $Q_S$ [m²] | $Q_D - Q_S$ |
|---|---|---|---|
| 20 | 800 | 300 | 500 (primanjkljaj) |
| 25 | 700 | 450 | 250 (primanjkljaj) |
| 30 | 600 | 600 | 0 |
| 35 | 500 | 750 | −250 (presežek) |

Pri ceni nad ravnovesjem ostanejo deske v skladišču. Pojavi se **presežek ponudbe** in prodajalci znižujejo cene. Pod ravnovesjem ostanejo kupci praznih rok. Nastane **presežno povpraševanje** in cena raste.

:::premisli
Država zakonsko omeji ceno desk na $25$ €/m². Napovej, kaj se bo dogajalo v trgovinah in koliko desk se bo dejansko prodalo.
---
Pri $25$ €/m² kupci želijo $700$ m², mizarji pa ponudijo le $450$ m². Prodalo se bo $450$ m², manj kot v ravnovesju. Nastanejo čakalne vrste in primanjkljaj $250$ m², ker cena ne sme zrasti.
:::

**Dve vrsti »spremembe«: kontrast, ki reši uganko.** Na eni krivulji se spreminja samo cena tega blaga. Vse drugo je zamrznjeno.

- **Premik po krivulji.** Spremeni se cena desk. Spremeni se *povpraševana* (ali *ponujena*) količina. Krivulja ostane na mestu.
- **Premik krivulje.** Spremeni se nekaj, kar ni cena desk. Pri vsaki ceni kupci želijo (ali prodajalci ponujajo) drugo količino. Cela krivulja se premakne levo ali desno.

Kaj premakne katero krivuljo:

| Dejavnik | Krivulja | Primer na trgu desk |
|---|---|---|
| dohodek kupcev | povpraševanje | višje plače → več prenov |
| cena nadomestka ali dopolnila | povpraševanje | laminat dražji → desno |
| cena vložkov | ponudba | hlodovina dražja → levo |
| tehnologija, število ponudnikov | ponudba | nova žaga → desno |

Premik **desno** pomeni več pri vsaki ceni (povečanje), premik **levo** manj (zmanjšanje). Pri ponudbi se premik levo na grafu vidi tudi kot premik **navzgor**: za isto količino prodajalci zahtevajo višjo ceno.

Zdaj uganka. Toča premakne *povpraševanje* po strešnikih desno. Novo ravnovesje drsi navzgor po isti krivulji ponudbe: cena in količina zrasteta. Nova opekarna premakne *ponudbo* desno. Novo ravnovesje drsi navzdol po krivulji povpraševanja: cena pade, količina zraste. Zakon povpraševanja ni bil nikoli kršen.

:::premisli
Hkrati zrastejo dohodki kupcev in odpre se nova žaga. Kaj zagotovo veš o ravnovesni količini desk in kaj o ceni?
---
Količina zagotovo zraste, ker oba premika vlečeta desno. O ceni ne veš ničesar: povpraševanje jo dviga, ponudba spušča. Smer je odvisna od tega, kateri premik je večji.
:::

## Rešeni primeri

### Primer 1 (lažji): ravnovesje na trgu desk

Povpraševanje po hrastovih deskah je $Q_D = 1200 - 20P$, ponudba $Q_S = -300 + 30P$. Poišči ravnovesno ceno in količino.

**Podatki:** $Q_D = 1200 - 20P$, $Q_S = -300 + 30P$, $P$ v €/m², $Q$ v m² na teden
**Iščemo:** ravnovesno ceno $P^*$ in količino $Q^*$

:::formula
$Q_D(P^*) = Q_S(P^*)$
:::

**Rešitev:**

1. Izenačimo: $1200 - 20P = -300 + 30P$.
2. Člene s $P$ zberemo na eni strani: $1500 = 50P$, torej $P^* = 30$ €/m².
3. Vstavimo v povpraševanje: $Q^* = 1200 - 20 \cdot 30 = 600$ m².
4. Preverimo s ponudbo: $-300 + 30 \cdot 30 = 600$. Ujema se.
5. Odgovor: trg je v ravnovesju pri $30$ €/m², prodajo pa $600$ m² desk na teden.

### Primer 2: povpraševanje se premakne

Občina uvede subvencijo za energetsko prenovo stanovanj. Pri vsaki ceni kupci zdaj želijo $250$ m² desk več kot prej. Ponudba se ne spremeni. Kakšno je novo ravnovesje in kolikšen primanjkljaj bi nastal, če bi cena ostala na stari ravni?

**Podatki:** novo povpraševanje $Q_D = 1450 - 20P$, ponudba $Q_S = -300 + 30P$, stara cena $30$ €/m², stara količina $600$ m²
**Iščemo:** novo ravnovesje $(Q^*, P^*)$ in primanjkljaj pri $30$ €/m²

:::formula
$Q_D(P^*) = Q_S(P^*)$; primanjkljaj $= Q_D - Q_S$ pri stari ceni
:::

**Rešitev:**

1. Pri stari ceni: $Q_D = 1450 - 20 \cdot 30 = 850$, $Q_S = 600$. Primanjkljaj je $850 - 600 = 250$ m². Zato cena začne rasti.
2. Novo ravnovesje: $1450 - 20P = -300 + 30P$, torej $1750 = 50P$ in $P^* = 35$ €/m².
3. $Q^* = 1450 - 20 \cdot 35 = 750$ m².
4. Odgovor: cena zraste na $35$ €/m², količina na $750$ m². Povpraševanje se je premaknilo, ponudba ne: rast količine je premik *po* krivulji ponudbe.

### Primer 3 (težji): dražji les

Cena hlodovine zraste. Mizarji zato za vsako količino desk zahtevajo $5$ €/m² več kot prej. Povpraševanje je kot v primeru 1. Za koliko se zviša cena, ki jo plačajo kupci? Je to $5$ €?

**Podatki:** $Q_D = 1200 - 20P$, stara ponudba $Q_S = -300 + 30P$, ponudba se dvigne za $5$ €/m², staro ravnovesje $P^* = 30$ €/m², $Q^* = 600$ m²
**Iščemo:** novo ravnovesje in spremembo cene

:::formula
Dvig ponudbe za $5$: v $Q_S$ zamenjamo $P$ s $P - 5$. Nato $Q_D(P^*) = Q_S(P^*)$
:::

**Rešitev:**

1. Prodajalec, ki prejme $P$, se odloča tako, kot bi se prej pri ceni $P - 5$. Zato je $Q_S = -300 + 30(P - 5) = -450 + 30P$.
2. Izenačimo: $1200 - 20P = -450 + 30P$, torej $1650 = 50P$ in $P^* = 33$ €/m².
3. $Q^* = 1200 - 20 \cdot 33 = 540$ m².
4. Sprememba cene: $33 - 30 = 3$ €/m².
5. Odgovor: cena zraste le za $3$ €/m², ne za $5$. Preostala $2$ € nosijo mizarji, ker bi pri višji ceni izgubili preveč kupcev. Prodaja pade s $600$ na $540$ m².

### Primer 4: zdaj ti

Zgodi se oboje hkrati: subvencija iz primera 2 ($Q_D = 1450 - 20P$) in dražji les iz primera 3 ($Q_S = -450 + 30P$). Poišči novo ravnovesje.

**Podatki:** $Q_D = 1450 - 20P$, $Q_S = -450 + 30P$
**Iščemo:** $P^*$ in $Q^*$

:::formula
$Q_D(P^*) = Q_S(P^*)$
:::

**Rešitev:**

1. Izenačimo: $1450 - 20P = -450 + 30P$, torej $1900 = 50P$.
2. Izračunaj $P^*$ in $Q^*$ sam, nato preveri:

:::premisli
Koliko sta $P^*$ in $Q^*$? Primerjaj s prvotnim ravnovesjem $(600, 30)$.
---
$P^* = 38$ €/m² in $Q^* = 1450 - 20 \cdot 38 = 690$ m². Oba premika dvigujeta ceno, zato je ta zrasla izrazito. Količina je zrasla, ker je bil premik povpraševanja večji od premika ponudbe.
:::

## Pogoste napake

**Zamenjava povpraševanja in povpraševane količine.** »Cena desk je zrasla, zato se je povpraševanje zmanjšalo.« Napačno: sprememba cene tega blaga je premik po krivulji, ne premik krivulje. Pravilno: »povpraševana količina se je zmanjšala«, povpraševanje (cela krivulja) je ostalo enako.

**Krožno sklepanje.** »Povpraševanje zraste, cena zraste, zato povpraševanje pade in cena spet pade.« Tu je višja cena dvakrat štela kot vzrok. Pravilno: dogodek premakne eno krivuljo, nato poiščeš novo presečišče. Gibanje po drugi krivulji je že všteto.

**»Premik navzgor je povečanje ponudbe.«** Ko se ponudba na grafu dvigne, je pri vsaki ceni ponujeno *manj*. Pravilno: povečanje pomeni premik desno, zmanjšanje premik levo (pri ponudbi navzgor).

**»Davek ali strošek se v celoti prenese na kupca.«** Primer 3 pokaže, da se cena dvigne le za del stroška. Pravilno: delitev je odvisna od naklonov obeh krivulj.

**Sklep o obeh spremenljivkah pri dveh premikih.** Ko se premakneta obe krivulji, je ena od $P$ in $Q$ vedno nedoločena brez številk. Pravilno: določi smer vsakega premika posebej in povej, kaj je dvoumno.

## Povzetek

- Povpraševanje $Q_D(P)$ pada s ceno, ponudba $Q_S(P)$ z njo raste; obe veljata ob nespremenjenih drugih dejavnikih.
- Tržno ravnovesje je cena $P^*$, pri kateri je $Q_D(P^*) = Q_S(P^*)$. Nad njo je presežek ponudbe, pod njo presežno povpraševanje.
- Sprememba cene tega blaga je premik po krivulji; sprememba drugega dejavnika premakne krivuljo.
- Povpraševanje desno: $P$ in $Q$ zrasteta. Ponudba desno: $P$ pade, $Q$ zraste. Pri premiku obeh je ena spremenljivka nedoločena.
- Pri linearnih krivuljah ravnovesje dobiš z izenačenjem; dvig ponudbe za $t$ pomeni zamenjavo $P \to P - t$ v $Q_S$.

## Za izpit

Znati moraš povedati:
- definiciji funkcije povpraševanja $Q_D(P)$ in funkcije ponudbe $Q_S(P)$ s pogojem »ob nespremenjenih drugih dejavnikih« ter zakon povpraševanja;
- definicijo tržnega ravnovesja $Q_D(P^*) = Q_S(P^*)$ ter kaj sta presežek ponudbe in presežno povpraševanje in v katero smer potisneta ceno;
- razliko med premikom po krivulji in premikom krivulje ter dejavnike, ki premaknejo povpraševanje oziroma ponudbo;
- smer spremembe $P^*$ in $Q^*$ pri premiku ene krivulje in kaj je nedoločeno pri premiku obeh;
- izpeljavo $P^* = \dfrac{a - c}{b + d}$ in $Q^* = \dfrac{ad + bc}{b + d}$ za linearni krivulji ter delitev stroška $t$ med kupce in prodajalce.

### Naloga 1

Na trgu lesnih peletov je povpraševanje $Q_D = 2400 - 8P$ in ponudba $Q_S = -600 + 12P$, kjer je $P$ cena v €/t in $Q$ količina v tonah na teden. (a) Poišči ravnovesje. (b) Država proizvajalcem naloži okoljsko dajatev $25$ €/t. Poišči novo ravnovesje, ceno, ki jo po plačilu dajatve obdržijo proizvajalci, delitev dajatve med kupce in proizvajalce ter tedenski prihodek države. (c) Ob dajatvi nastopi še huda zima: pri vsaki ceni kupci želijo $\Delta a$ ton več. Kolikšen mora biti $\Delta a$, da se prodana količina vrne na vrednost iz (a), in kolikšna je takrat cena? (d) V položaju iz (c) država omeji ceno na ravnovesno ceno iz (a). Koliko peletov se proda in kolikšen je primanjkljaj?

**Rešitev:**

1. Izenačimo: $2400 - 8P = -600 + 12P$, torej $3000 = 20P$ in $P^* = 150$ €/t.
2. Količina: $Q^* = 2400 - 8 \cdot 150 = 1200$ t.
3. Dajatev dvigne ponudbo za $25$: $Q_S = -600 + 12(P - 25) = -900 + 12P$.
4. Za novo ravnovesje izenačimo: $2400 - 8P = -900 + 12P$, torej $3300 = 20P$ in $P^* = 165$ €/t.
5. Količina: $Q^* = 2400 - 8 \cdot 165 = 1080$ t.
6. Proizvajalci obdržijo $165 - 25 = 140$ €/t. Kupci plačajo $165 - 150 = 15$ €/t več, proizvajalci dobijo $150 - 140 = 10$ €/t manj. Kupci nosijo $\frac{15}{25} = 0{,}6$ dajatve, kar je ravno $\frac{d}{b + d} = \frac{12}{20}$.
7. Prihodek države: $25 \cdot 1080 = 27000$ € na teden.
8. Za (c) mora ponudba dati $1200$ t: $-900 + 12P = 1200$, torej $12P = 2100$ in $P = 175$ €/t.
9. Pri tej ceni mora biti tudi povpraševana količina $1200$: $2400 + \Delta a - 8 \cdot 175 = 1200$, torej $\Delta a = 1200 - 2400 + 1400 = 200$ t.
10. Za (d) je povpraševanje $Q_D = 2600 - 8P$. Pri $P = 150$: $Q_D = 2600 - 8 \cdot 150 = 1400$ t, $Q_S = -900 + 12 \cdot 150 = 900$ t.
11. Proda se manjša izmed obeh količin, torej $900$ t. Primanjkljaj je $1400 - 900 = 500$ t.
12. Odgovor: (a) $150$ €/t in $1200$ t; (b) $165$ €/t in $1080$ t, proizvajalci obdržijo $140$ €/t, kupci nosijo $15$ € in proizvajalci $10$ € dajatve, država dobi $27000$ € na teden; (c) $\Delta a = 200$ t, cena je $175$ €/t; (d) proda se $900$ t, primanjkljaj je $500$ t.

### Naloga 2

Za linearni krivulji $Q_D = a - bP$ in $Q_S = c + dP$ ($b, d > 0$) izpelji ravnovesno ceno in količino ter navedi pogoja, da sta obe pozitivni. Nato izpelji, za koliko se pri dvigu ponudbe za $t$ spremenijo cena, ki jo plačajo kupci, cena, ki jo obdržijo prodajalci, in količina. Utemelji, v katerih mejnih primerih ves strošek nosijo kupci in v katerem prodajalci.

**Rešitev:**

1. Ravnovesni pogoj: $a - bP^* = c + dP^*$. Člene s $P^*$ zberemo: $a - c = (b + d)P^*$, torej $P^* = \dfrac{a - c}{b + d}$.
2. Vstavimo v povpraševanje: $Q^* = a - b\,\dfrac{a - c}{b + d} = \dfrac{a(b + d) - b(a - c)}{b + d} = \dfrac{ad + bc}{b + d}$.
3. Ker je $b + d > 0$, je $P^* > 0$ natanko tedaj, ko je $a > c$, in $Q^* > 0$ natanko tedaj, ko je $ad + bc > 0$. Drugi pogoj je pomemben, kadar je $c < 0$.
4. Dvig ponudbe za $t$: prodajalec se pri ceni $P$ odloča kot prej pri $P - t$, zato $Q_S = c + d(P - t)$, kar pomeni $c \to c - dt$.
5. Nova cena: $P_1 = \dfrac{a - c + dt}{b + d}$. Kupci plačajo za $\Delta P = P_1 - P^* = \dfrac{d}{b + d}\,t$ več.
6. Prodajalci obdržijo $P_1 - t$. Sprememba je $\Delta P - t = \dfrac{d - (b + d)}{b + d}\,t = -\dfrac{b}{b + d}\,t$.
7. Količina se giblje po krivulji povpraševanja: $\Delta Q = -b\,\Delta P = -\dfrac{bd}{b + d}\,t$.
8. Deleža $\dfrac{d}{b + d}$ in $\dfrac{b}{b + d}$ sta med $0$ in $1$ in se seštejeta v $1$. Kupci nosijo ves strošek, ko gre $b \to 0$ (povpraševana količina se na ceno ne odziva) ali ko gre $d \to \infty$ (prodajalci pri isti ceni ponudijo poljubno količino). Prodajalci nosijo ves strošek, ko gre $b \to \infty$ ali $d \to 0$.
9. Preizkus s primerom 3 ($b = 20$, $d = 30$, $t = 5$): $\Delta P = \frac{30}{50} \cdot 5 = 3$ in $\Delta Q = -\frac{20 \cdot 30}{50} \cdot 5 = -60$, kar se ujema s $33$ €/m² in $540$ m².

### Naloga 3

Analitik zbere podatke o trgu kave: v petih zaporednih letih sta ravnovesna cena in prodana količina vsako leto zrasli. Sklene: »Krivulja povpraševanja po kavi je naraščajoča, zakon povpraševanja tu ne velja.« Utemelji, ali sklep drži. Nato natančno navedi, katere kombinacije premikov krivulj dajo (a) višjo ceno in večjo količino, (b) višjo ceno in manjšo količino, (c) nespremenjeno ceno in večjo količino.

**Rešitev:**

1. Sklep ne drži. Krivulja povpraševanja povezuje ceno in količino ob nespremenjenih drugih dejavnikih. Opazovane točke so ravnovesja iz različnih let, v katerih so se drugi dejavniki (dohodek, okus, število kupcev) spreminjali.
2. Vsaka opazovana točka je presečišče tistega leta. Če se povpraševanje premika desno, ponudba pa miruje, točke ležijo na naraščajoči krivulji *ponudbe*. Analitik je torej izrisal ponudbo, ne povpraševanja.
3. Zakon povpraševanja bi preveril le s spremembo cene pri mirujočem povpraševanju, torej s premiki ponudbe (letina, cena vložkov).
4. (a) Višja cena in večja količina: povpraševanje desno pri mirujoči ponudbi; ali oba premika hkrati, če premik povpraševanja desno prevlada nad premikom ponudbe (desno ali levo).
5. (b) Višja cena in manjša količina: ponudba levo pri mirujočem povpraševanju; ali ponudba levo in dovolj majhen premik povpraševanja v katerokoli smer.
6. (c) Nespremenjena cena in večja količina: obe krivulji desno, in to za enako količino pri stari ceni. Pri linearnih krivuljah to pomeni $\Delta a = \Delta c$, saj je $P^* = \dfrac{a - c}{b + d}$ odvisna le od razlike $a - c$.
7. Sklep: iz samih ravnovesnih točk ne moreš prebrati nobene krivulje, dokler ne veš, katera se je premikala.

## Drugače: Na sliki

Nariši graf: navpična os je cena, vodoravna količina.

:::risba graf
opis: Graf ponudbe in povpraševanja na trgu desk. Na vodoravni osi je količina Q od 0 do 1200 kvadratnih metrov, na navpični cena P od 0 do 60 evrov. Premica povpraševanja D se spušča od točke (0, 60) do (1200, 0). Premica ponudbe S se dviga od točke (0, 10) do (1200, 50). Sekata se v točki X, v ravnovesju pri količini 600 in ceni 30.
x: 0 .. 1200 | 200 | Q
y: 0 .. 60 | 10 | P
f: 60 - x/20 | modra
f: 10 + x/30 | oranžna
črta: 600; 0 -> 600; 30 -> 0; 30 | črtkano siva
točka: 600; 30
napis: 600; 32 | X | nad
napis: 1050; 10 | D | nad | modra
napis: 1050; 47 | S | nad | oranžna
podnapis: Povpraševanje D pada, ponudba S raste; presečišče X je ravnovesje (600, 30).
:::

- Črta **D** se spušča (kupci), črta **S** se dviga (prodajalci). Presečišče **X** je ravnovesje.
- Pri subvenciji iz primera 2 premakneš D vzporedno v desno. Novo presečišče leži više in bolj desno: $(750, 35)$.
- Pri dražjem lesu iz primera 3 premakneš S navzgor za $5$. Novo presečišče leži više in bolj levo: $(540, 33)$. Pri stari količini $600$ bi prodajalci zdaj zahtevali $35$ €/m², a nova cena te višine ne doseže, zato je dvig manjši od $5$.

Pravilo za branje: premakni *eno* črto, ostane druga. Novo ravnovesje drsi po tisti, ki je ostala.

## Drugače: Uporaba v stroki

Pomisli na borzo električne energije, kjer analitik trgovalca vsak dan napoveduje ceno za naslednji dan.

- Za vsako uro elektrarne oddajo ponudbe: koliko megavatov in po kateri najnižji ceni. Borza jih razvrsti od najcenejše navzgor. To je krivulja ponudbe.
- Vzemi uro, v kateri odjemalci potrebujejo $1500$ MW. Hidroelektrarne in jedrska ponudijo $900$ MW po $10$ €/MWh, premog $400$ MW po $70$ €/MWh, plin $500$ MW po $110$ €/MWh. Prvi dve skupini dasta le $1300$ MW, zato je potreben še plin. Ravnovesna cena je $110$ €/MWh in velja za vse.
- Pri ceni $70$ €/MWh bi manjkalo $200$ MW. To je presežno povpraševanje, zato algoritem ceno dvigne.

Zdaj zapiha in vetrnice ponudijo še $300$ MW skoraj zastonj. Ponudba se premakne desno. Brez plina je na voljo $1600$ MW, kar zadošča. Cena pade na $70$ €/MWh. Premogovna elektrarna ni spremenila ničesar, spremenil se je trg okoli nje.

Enak izračun presečišča naredi borza vrednostnih papirjev v otvoritveni avkciji in zakladnica pri prodaji zakladnih menic.

## Drugače: Bolj natančno

Splošni linearni krivulji: $Q_D = a - bP$, $Q_S = c + dP$, kjer so $b, d > 0$. Ravnovesje je

$$P^* = \frac{a - c}{b + d}, \qquad Q^* = \frac{ad + bc}{b + d}.$$

Premik povpraševanja za $\Delta a$ spremeni ceno za $\dfrac{\Delta a}{b + d}$. Dvig ponudbe za $t$ (torej $c \to c - dt$) spremeni ceno za $\dfrac{d}{b + d}\,t$. Pri $b = 20$ in $d = 30$ je to $\dfrac{30}{50} \cdot 5 = 3$, kot v primeru 3. Kupci nosijo delež $\dfrac{d}{b+d}$ stroška. Ta je večji, kadar je povpraševanje manj občutljivo na ceno (majhen $b$). To je uvod v elastičnost.

## Preveri se

? Katera trditev o tržnem ravnovesju je pravilna?
- V ravnovesju je cena najnižja možna.
~ Ravnovesje ni najnižja cena, ampak tista, pri kateri se količini ujemata.
+ V ravnovesju je količina, ki jo kupci želijo kupiti, enaka količini, ki jo prodajalci želijo prodati.
- V ravnovesju se krivulji ne premikata več.
~ Krivulji se premikata ob vsaki spremembi dohodkov, stroškov ali tehnologije. Ravnovesje je le presečišče trenutnih krivulj.
> Ravnovesje je definirano z $Q_D(P^*) = Q_S(P^*)$; pri tej ceni ni ne presežka ne primanjkljaja.

? Na trgu ročno izdelanih stolov velja $Q_D = 500 - 10P$ in $Q_S = 100 + 10P$. Kolikšna je ravnovesna cena?
- $25$
~ To je $500 / 20$: pozabljeno je, da je treba $100$ prenesti na levo stran.
+ $20$
- $30$
~ To je $600 / 20$: člen $100$ je bil prištet namesto odštet.
> $500 - 10P = 100 + 10P$ da $400 = 20P$, torej $P^* = 20$ in $Q^* = 300$.

? Študent reši nalogo: »Cena lesa pade. (1) Les je vložek za izdelavo omar. (2) Zato se krivulja povpraševanja po omarah premakne desno. (3) Cena omar zraste.« Kje je napaka?
- V koraku (1)
~ Les res je vložek, ta korak drži.
+ V koraku (2)
- Napake ni.
~ Cenejši vložek vpliva na proizvajalce, ne na kupce, zato je napaka že pred sklepom o ceni.
> Cenejši vložek premakne *ponudbo* omar desno. Posledica: cena omar pade, količina zraste.

? Primerjaj dva dogodka na trgu opeke: (I) zviša se cena opeke; (II) zviša se cena cementa, ki ga pri zidavi uporabljamo skupaj z opeko. Kaj velja za krivuljo povpraševanja po opeki?
- Pri (I) in (II) se premakne levo.
~ Pri (I) se spremeni cena opeke same, kar je premik po krivulji, ne premik krivulje.
+ Pri (I) je premik po krivulji, pri (II) se krivulja premakne levo.
- Pri (I) se premakne levo, pri (II) ostane na mestu.
~ Prav obratno: lastna cena ne premakne krivulje, cena dopolnila pa jo.
> Cement in opeka sta dopolnili. Dražji cement pomeni manj zidave in manj opeke pri vsaki ceni.

? Mizarske delavnice množično kupijo računalniško vodene rezkarje, ki pocenijo izdelavo kuhinj. Kaj se zgodi na trgu kuhinj, če se nič drugega ne spremeni?
- Cena in količina zrasteta.
~ To bi se zgodilo pri povečanju povpraševanja. Tehnologija vpliva na ponudbo.
- Cena pade, količina tudi pade.
~ Premik ponudbe desno pri nespremenjenem povpraševanju poveča prodano količino.
+ Cena pade, prodana količina zraste.
> Boljša tehnologija premakne ponudbo desno. Ravnovesje drsi navzdol po krivulji povpraševanja: nižja cena, večja količina.

:::simboli
Q_D | povpraševana količina (funkcija povpraševanja) | Q_D = a - bP | m^2/teden | padajoča funkcija cene
Q_S | ponujena količina (funkcija ponudbe) | Q_S = c + dP | m^2/teden | naraščajoča funkcija cene
Q | količina | | m^2/teden | Q* ravnovesna količina
P | cena | | €/m^2 | P* ravnovesna cena
a | povpraševana količina pri ceni 0 | | m^2/teden
b | naklon povpraševanja (padec količine na 1 € cene) | | | b > 0
c | ponujena količina pri ceni 0 | | m^2/teden | lahko je negativna
d | naklon ponudbe (porast količine na 1 € cene) | | | d > 0
:::
