---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Zobni mostiček nadomesti manjkajoči zob. Na obeh koncih sloni na sosednjih zobeh, pri grizenju pa nanj pritisne hrana nekje vmes. Ko mostiček poči, se razpoka praviloma začne na spodnji strani, ki se pri grizenju razteza.

Druga slika: reševalca neseta pacienta na nosilih. Vsak drži en konec droga, teža pacienta pa pritiska na sredino. Če je drog prešibak, se upogne in zlomi na sredini, ne pri rokah reševalcev.

Mostiček in nosila so si na pogled zelo različni, skrivajo pa isto vprašanje. **Kaj se dogaja v notranjosti nosilca** med podporama in kje je najbolj obremenjen? Ravnotežje celega telesa pove le reakcije v podporah. Za dimenzioniranje kosti, vsadka ali droga pa moraš vedeti, kakšne sile in momenti delujejo v vsakem prerezu. To so **notranje sile**.

## Razlaga

**1. Miselni rez.** Nosilec v mislih prerežemo na mestu $x$. Levi del sam zase ne bi bil v ravnotežju: nanj delujeta reakcija in morda del bremena. Desni del ga drži preko prereza. Vpliv desnega dela nadomestimo s tremi notranjimi veličinami:

- **osna sila** $N$ deluje vzdolž osi nosilca; pozitivna je, ko prerez *vleče* (nateg), negativna, ko ga tlači;
- **prečna sila** $T$ deluje pravokotno na os, v ravnini prereza (ponekod jo označijo s $Q$);
- **upogibni moment** $M$ skuša nosilec v prerezu upogniti.

Ker sta oba dela v ravnotežju, jih lahko izračunamo iz katerega koli dela. Izberemo tistega, na katerega deluje manj sil.

**2. Dogovor o predznaku.** Gledamo levi del. $T$ je pozitivna, kadar je vsota navpičnih zunanjih sil na levem delu usmerjena **navzgor**. $M$ je pozitiven, kadar se nosilec usloči navzdol kot nasmeh: spodnja vlakna so raztegnjena, zgornja stisnjena. Pri nosilih s pacientom je tako, zato je tam $M > 0$.

**3. Slika ene obremenitve.** Fizioterapevtska bradlja je drog dolžine $2\,\text{m}$, podprt na obeh koncih (levo $A$, desno $B$). Pacient se nanjo opre s silo $600\,\text{N}$ na razdalji $0{,}5\,\text{m}$ od $A$. Iz ravnotežja celega droga dobimo reakciji $450\,\text{N}$ v $A$ in $150\,\text{N}$ v $B$ (momenti okoli $B$: $A \cdot 2 = 600 \cdot 1{,}5$). Zdaj režemo na več mestih in vsakič seštejemo le sile levo od reza:

| $x$ [m] | $T$ [N] | $M$ [N·m] |
|---|---|---|
| 0 | 450 | 0 |
| 0,5 | 450 / −150 | 225 |
| 1,0 | −150 | 150 |
| 1,5 | −150 | 75 |
| 2,0 | −150 | 0 |

Pri $x = 0{,}5\,\text{m}$ sta zapisani vrednosti tik levo in tik desno od sile. Iz tabele narišemo **diagrama notranjih sil**. Pod drogom nariši vodoravno os in nad njo vrednosti:

- **Diagram $T$** je stopnica: od $A$ do bremena je ravna črta na višini $+450$, pod silo pade za točno $600$ na $-150$ in tako ostane do $B$.
- **Diagram $M$** sestavljata dve daljici: od $0$ v $A$ se dvigne do vrha $225\,\text{N·m}$ pod silo, nato enakomerno pade na $0$ v $B$. Pod silo ima oster vrh, ne skoka.

:::premisli
Na diagramu $M$ je levi krak strm, desni položen. Iz katerega stolpca tabele razbereš, za koliko se $M$ spremeni na vsak meter?
---
Iz stolpca $T$. Levo od sile je $T = 450\,\text{N}$ in $M$ zraste za $450\,\text{N·m}$ na meter ($225$ na $0{,}5\,\text{m}$). Desno je $T = -150\,\text{N}$ in $M$ pada za $150\,\text{N·m}$ na meter. Naklon diagrama $M$ je kar prečna sila.
:::

**4. Porazdeljena obremenitev.** Pacient, ki leži na nosilih, ne pritiska v eni točki, ampak po dolžini. Opišemo ga z **zvezno obremenitvijo** $q$ v $\text{N/m}$. Zdaj se $T$ spreminja zvezno: vsak meter v desno odšteje $q$. Diagram $T$ je poševna premica, diagram $M$ pa parabola z vrhom tam, kjer $T$ seka ničlo.

**5. Konzola.** Nosilec, ki je na enem koncu vpet in na drugem prost (ročica na steni, iztegnjen prst), se imenuje **konzola**. Vse reakcije, sila in moment, so v vpetju. Pod bremenom se konzola usloči kot žalosten obraz: zgornja vlakna so raztegnjena, zato je $M$ negativen.

:::premisli
Konzolo obremenimo s silo na prostem koncu. Kje bi pričakoval, da se zlomi, in zakaj ne pod silo?
---
V vpetju. Moment v prerezu je sila krat ročica do prereza. Pod silo je ročica nič, v vpetju pa je najdaljša, enaka dolžini konzole. Zato je v vpetju $|M|$ največji; $|T|$ je vzdolž vse konzole enaka sili.
:::

**6. Osna sila.** Če ima breme vodoravno komponento, jo mora prenesti nepomična podpora. Del nosilca med to podporo in bremenom je tedaj nategnjen ali stisnjen. Diagram $N$ je pogosto le pravokotnik na delu nosilca.

**7. Simboli.** Šele zdaj zapišimo, kar smo brali iz slik. Če seštevamo sile levo od reza:

$$T(x) = \sum F_{\uparrow} - \sum F_{\downarrow}$$

$$M(x) = \sum F_i \, (x - x_i)$$

Pri tem $F_i$ šteje pozitivno navzgor in $x_i$ je njeno prijemališče. Za vsak kratek kos nosilca veljata zvezi (drugo smo že razbrali iz tabele):

$$\frac{\mathrm{d}T}{\mathrm{d}x} = -q, \qquad \frac{\mathrm{d}M}{\mathrm{d}x} = T$$

Posledice za risanje: kjer je $q = 0$, je $T$ stalna in $M$ linearen; točkovna sila naredi skok v $T$ in prelom v $M$; največji $M$ je tam, kjer $T$ zamenja predznak.

## Rešeni primeri

### Primer 1 (lažji): nosila s točkovnim bremenom

Drog nosil dolžine $2\,\text{m}$ je podprt na obeh koncih. Na sredini nanj pritiska sila $800\,\text{N}$. Kolikšni sta prečna sila in največji upogibni moment?

**Podatki:** $L = 2\,\text{m}$, $F = 800\,\text{N}$ na $x = 1\,\text{m}$, podpori na koncih
**Iščemo:** $T(x)$ in $M_{\max}$

:::formula
$A_y = B_y = \dfrac{F}{2}$, $\quad M_{\max} = A_y \cdot \dfrac{L}{2} = \dfrac{F L}{4}$
:::

**Rešitev:**

1. Breme je na sredini, zato je zaradi simetrije $A_y = B_y = \dfrac{800\,\text{N}}{2} = 400\,\text{N}$.
2. Levo od sredine je na levem delu le $A_y$, torej $T = 400\,\text{N}$; desno se doda sila navzdol: $T = 400 - 800 = -400\,\text{N}$.
3. $T$ zamenja predznak pod silo, zato je tam največji moment.
4. $M_{\max} = 400\,\text{N} \cdot 1\,\text{m} = 400\,\text{N·m}$.
5. Odgovor: prečna sila je $\pm 400\,\text{N}$, največji upogibni moment $400\,\text{N·m}$ deluje na sredini droga.

### Primer 2: ročica za infuzijo

Vodoravna ročica dolžine $0{,}5\,\text{m}$ je vpeta v steno. Na prostem koncu visi infuzijska vreča s težo $15\,\text{N}$. Lastna teža ročice je enakomerno porazdeljena, $q = 20\,\text{N/m}$. Kolikšni sta $T$ in $M$ v vpetju in na sredini ročice?

**Podatki:** $L = 0{,}5\,\text{m}$, $F = 15\,\text{N}$ na prostem koncu, $q = 20\,\text{N/m}$
**Iščemo:** $T$ in $M$ v vpetju ($x = 0{,}5\,\text{m}$) in na sredini ($x = 0{,}25\,\text{m}$)

:::formula
Os $x$ teče od prostega konca: $T(x) = -F - q x$, $\quad M(x) = -F x - \dfrac{q x^2}{2}$
:::

**Rešitev:**

1. Izberemo del med prostim koncem in rezom, ker na njem ni reakcij. Na njem delujeta $F$ in del zvezne teže $q x$ s prijemališčem na $x/2$.
2. V vpetju: $T = -15 - 20 \cdot 0{,}5 = -25\,\text{N}$.
3. V vpetju: $M = -15 \cdot 0{,}5 - 20 \cdot 0{,}5^2 / 2 = -10\,\text{N·m}$.
4. Na sredini: $T = -15 - 20 \cdot 0{,}25 = -20\,\text{N}$ in $M = -15 \cdot 0{,}25 - 20 \cdot 0{,}25^2 / 2 = -4{,}375\,\text{N·m}$.
5. Predznak minus pomeni, da so raztegnjena zgornja vlakna.
6. Odgovor: v vpetju je $|T| = 25\,\text{N}$ in $|M| = 10\,\text{N·m}$; na sredini $|T| = 20\,\text{N}$ in $|M| \approx 4{,}4\,\text{N·m}$. Moment na sredini je manj kot polovica momenta v vpetju, ker je diagram parabola.

### Primer 3 (težji): koliko prenese drog

Drog nosil dolžine $2{,}0\,\text{m}$ je podprt na koncih. Pacient leži po vsej dolžini, zato je obremenitev enakomerna. Drog prenese upogibni moment največ $300\,\text{N·m}$. Kolikšna je največja dovoljena obremenitev $q$ in kolikšna je tedaj skupna sila na drog?

**Podatki:** $L = 2{,}0\,\text{m}$, $M_{\mathrm{dop}} = 300\,\text{N·m}$, enakomerna obremenitev po vsej dolžini
**Iščemo:** $q_{\max}$ in skupno silo $F = q_{\max} L$

:::formula
$M_{\max} = \dfrac{q L^2}{8}$, torej $q_{\max} = \dfrac{8 M_{\mathrm{dop}}}{L^2}$
:::

**Rešitev:**

1. Reakciji sta $\dfrac{qL}{2}$. Na sredini je $T = \dfrac{qL}{2} - q\dfrac{L}{2} = 0$, zato je tam vrh parabole.
2. Moment na sredini: reakcija krat $\dfrac{L}{2}$ minus polovica bremena krat $\dfrac{L}{4}$, kar da $\dfrac{qL^2}{4} - \dfrac{qL^2}{8} = \dfrac{qL^2}{8}$.
3. Obrnemo zvezo: $q_{\max} = \dfrac{8 \cdot 300}{2^2} = 600\,\text{N/m}$.
4. Skupna sila: $F = 600 \cdot 2 = 1200\,\text{N}$.
5. Odgovor: drog sme nositi največ $600\,\text{N/m}$, skupaj $1200\,\text{N}$, kar je približno teža $120\,\text{kg}$.

### Primer 4 – zdaj ti: poševni vlek pri trakciji

Vodoraven drog nad posteljo ima dolžino $1{,}2\,\text{m}$. V $A$ je nepomično členkasto podprt, v $B$ drsno (le navpična reakcija). Na sredini ga vrv za raztezanje noge vleče s silo $500\,\text{N}$ pod kotom $30°$ glede na vodoravnico, poševno navzdol proti $B$. Določi $N$ in $M_{\max}$.

**Podatki:** $L = 1{,}2\,\text{m}$, $F = 500\,\text{N}$, $\alpha = 30°$, prijemališče na $x = 0{,}6\,\text{m}$
**Iščemo:** osno silo $N$ na obeh polovicah in $M_{\max}$

:::formula
$F_x = F\cos\alpha$, $\quad F_y = F\sin\alpha$, $\quad M_{\max} = \dfrac{F_y L}{4}$
:::

**Rešitev:**

1. Komponenti: $F_x = 500 \cdot \cos 30° \approx 433\,\text{N}$ proti $B$, $F_y = 500 \cdot \sin 30° = 250\,\text{N}$ navzdol.
2. Vodoravno komponento lahko prevzame le $A$: $A_x = 433\,\text{N}$ v smeri stran od $B$.
3. Na levi polovici rez »vleče« levi kos proti desni: $N = 433\,\text{N}$ (nateg). Desno od sile ni vodoravnih sil, zato $N = 0$.
4. Navpično: $A_y = B_y = 125\,\text{N}$. Zdaj izračunaj največji moment sam.

:::premisli
Koliko je $M_{\max}$ in kje deluje?
---
Na sredini, kjer $T$ skoči s $+125$ na $-125\,\text{N}$: $M_{\max} = 125\,\text{N} \cdot 0{,}6\,\text{m} = 75\,\text{N·m}$. Vodoravna komponenta na $M$ ne vpliva, ker deluje vzdolž osi.
:::

## Pogoste napake

- **»Konzola je najbolj obremenjena pod bremenom.«** Pod silo je ročica do prereza nič, zato je tam $M = 0$. Največji $|M|$ je v vpetju. Vedno vprašaj: kako dolga je ročica od sile do *tega* prereza?
- **Skok v diagramu $M$ pod točkovno silo.** Točkovna sila naredi skok v $T$, v $M$ pa le prelom (oster vrh). Skok v $M$ povzroči šele zunanji točkovni moment (par sil).
- **Celotna zvezna obremenitev v vsakem rezu.** Kdor vzame $qL$ z ročico $L/2$ ne glede na lego reza, dobi pri prostoležečem nosilcu $qL^2/2$ ali $qL^2/4$ namesto $qL^2/8$. V rez šteje le del $q$ na izbrani strani, z ročico do središča tega dela.
- **Sile z obeh strani reza hkrati.** Če pri $T$ seštevaš sile levo in desno od reza, dobiš vedno nič, ker je cel nosilec v ravnotežju. Izberi *en* del in ne pozabi reakcij na njem.
- **Pozabljena osna sila.** Pri poševnem bremenu vodoravna komponenta ne vpliva na $M$, napne pa del nosilca do nepomične podpore. Diagram $N$ je del rešitve.

## Povzetek

- Notranje sile v prerezu: osna sila $N$ (vzdolž osi, nateg pozitiven), prečna sila $T$, upogibni moment $M$.
- Dobimo jih z miselnim rezom in ravnotežjem enega dela nosilca.
- Dogovor: $T > 0$, ko je vsota sil na levem delu navzgor; $M > 0$, ko so spodnja vlakna raztegnjena.
- $\dfrac{\mathrm{d}T}{\mathrm{d}x} = -q$, $\dfrac{\mathrm{d}M}{\mathrm{d}x} = T$: točkovna sila naredi skok v $T$ in prelom v $M$; zvezna obremenitev da linearen $T$ in paraboličen $M$.
- $M$ je največji, kjer $T$ zamenja predznak; pri konzoli v vpetju.
- Prostoležeči nosilec: sila na sredini $M_{\max} = FL/4$, enakomerna obremenitev $M_{\max} = qL^2/8$; konzola s silo na koncu $|M_{\max}| = FL$.

## Drugače: Z analogijo

Predstavljaj si, da nosilec v resnici prerežeš, nato pa oba kosa spet držita dve osebi, vsaka svojega, tako da se nič ne premakne. Kaj morata narediti z rokami na mestu reza?

- Če se kosa hočeta razmakniti, se morata **vleči**. To je osna sila $N$.
- Če hoče en kos zdrsniti navzdol mimo drugega, ga mora druga oseba **podpirati** navzgor. To je prečna sila $T$.
- Če se hočeta kosa zlomiti v kolenu, morata zapestji **zasukati** proti upogibu. To je upogibni moment $M$.

Diagram ni nič drugega kot zapis, kako močno morata vleči, podpirati in sukati, če se z rezom premikata od enega konca do drugega. Kjer bi bilo sukanje najtežje, tam bi se pravi nosilec zlomil.

## Drugače: Iz vsakdanjega življenja

- **Ravnilo med prsti.** Ravnilo položi na dva prsta in s tretjim pritisni na sredino. Najbolj se ukrivi na sredini, pri prstih pa ostane skoraj ravno. Tam je $M$ največji, pri podporah nič.
- **Iztegnjena roka z vrečko.** Ko držiš vrečko v iztegnjeni roki, te boli rama, ne zapestje. Roka deluje kot konzola: ročica do ramena je najdaljša, zato mora rama prenesti največji moment.
- **Lomljenje paličke.** Suho paličko zlomiš najlaže, če jo primeš na koncih in pritisneš s palcema na sredino. Na sredini z najmanj sile dosežeš največji moment.

## Drugače: Bolj natančno

Izrežimo kratek kos nosilca dolžine $\mathrm{d}x$ brez točkovnih sil. Levo deluje $T$ in $M$, desno $T + \mathrm{d}T$ in $M + \mathrm{d}M$, vmes obremenitev $q\,\mathrm{d}x$ navzdol. Navpično ravnotežje da $T - q\,\mathrm{d}x - (T + \mathrm{d}T) = 0$, torej $\mathrm{d}T/\mathrm{d}x = -q$. Momentno ravnotežje okoli desnega konca da $M + T\,\mathrm{d}x - q\,\mathrm{d}x \cdot \mathrm{d}x/2 - (M + \mathrm{d}M) = 0$. Člen z $(\mathrm{d}x)^2$ zanemarimo in dobimo $\mathrm{d}M/\mathrm{d}x = T$. Od tod $\mathrm{d}^2 M/\mathrm{d}x^2 = -q$: pri stalni $q$ je $M$ kvadratna funkcija, ekstrem pa je tam, kjer je $T = 0$.

## Preveri se

? V prerezu stegnenice, ki jo med hojo upogiba teža telesa, deluje upogibni moment $M$. Kaj ta veličina opisuje?
- Silo, ki stiska kost vzdolž njene osi.
~ To je osna sila $N$. Moment ni sila vzdolž osi, ampak težnja k upogibu.
+ Težnjo, da se kost v tem prerezu upogne, pri čemer je ena stran raztegnjena, druga stisnjena.
- Silo, s katero bi en del kosti zdrsnil mimo drugega pravokotno na os.
~ To je prečna sila $T$. Moment se meri v N·m, ne v N.
> Upogibni moment v prerezu opisuje upogibanje: vlakna na eni strani so natezno, na drugi tlačno obremenjena.

? Trije nosilci imajo enako dolžino $L$ in skupno breme $F$: (a) konzola s silo na koncu, (b) prostoležeči nosilec s silo na sredini, (c) prostoležeči nosilec z enakomerno obremenitvijo. Razvrsti jih po največjem $|M|$ od največjega do najmanjšega.
- b > a > c
~ Tako misliš, če je prostoležeči nosilec bolj obremenjen kot konzola. Konzola ima ročico $L$, prostoležeči le $L/2$ in še reakcijo na vsaki strani.
+ a > b > c
- a > c > b
~ Porazdelitev bremena moment zmanjša, ne poveča: del bremena je bliže podporam. $qL^2/8 = FL/8$ je manj kot $FL/4$.
> (a) $FL$, (b) $FL/4$, (c) $FL/8$. Razporeditev bremena po dolžini prepolovi moment glede na silo na sredini.

? Na prostoležečem nosilcu premaknemo točkovno silo s sredine bliže levi podpori. Kaj se zgodi z največjim upogibnim momentom?
- Ostane enak, ker se sila ni spremenila.
~ Moment ni odvisen le od sile, ampak tudi od ročic. Ko sila potuje proti podpori, se ročica reakcije skrajša.
- Se poveča, ker je reakcija v levi podpori večja.
~ Reakcija se res poveča, a ročica do sile se skrajša hitreje. Največji moment je $F a b / L$, kar je največ pri $a = b$.
+ Se zmanjša.
> Pri sili na razdalji $a$ od leve in $b$ od desne podpore je $M_{\max} = \dfrac{F a b}{L}$. Produkt $a b$ je največji pri $a = b = L/2$, zato premik proti podpori moment zmanjša.

? Konzola dolžine $0{,}6\,\text{m}$ ima na prostem koncu silo $50\,\text{N}$. Kolikšen je $|M|$ v vpetju?
- $15\,\text{N·m}$
~ To je $F L/2$, kot da bi bila ročica pol konzole. Pri točkovni sili na koncu je ročica do vpetja cela dolžina.
- $7{,}5\,\text{N·m}$
~ To je $FL/4$, formula za prostoležeči nosilec s silo na sredini, ne za konzolo.
+ $30\,\text{N·m}$
- $83{,}3\,\text{N·m}$
~ To je $F/L$. Moment je sila *krat* ročica.
> $|M| = F L = 50\,\text{N} \cdot 0{,}6\,\text{m} = 30\,\text{N·m}$.

? Prostoležeči nosilec dolžine $3\,\text{m}$ nosi enakomerno obremenitev $q = 400\,\text{N/m}$. Kolikšen je največji upogibni moment?
- $1800\,\text{N·m}$
~ To je $qL^2/2$: vzel si celo breme $qL$ z ročico $L/2$ in pozabil na reakcijo.
- $900\,\text{N·m}$
~ To je $qL^2/4$: upošteval si le reakcijo $qL/2$ z ročico $L/2$ in pozabil odšteti moment bremena levo od sredine.
+ $450\,\text{N·m}$
- $600\,\text{N·m}$
~ To je reakcija $qL/2$ v newtonih, ne moment.
> $M_{\max} = \dfrac{qL^2}{8} = \dfrac{400 \cdot 3^2}{8} = 450\,\text{N·m}$, na sredini, kjer je $T = 0$.

:::simboli
N | osna sila | | N | nateg pozitiven
T | prečna sila | \frac{\mathrm{d}M}{\mathrm{d}x} = T | N | ponekod $Q$
M | upogibni moment | M(x) = \sum F_i (x - x_i) | N\,m | pozitiven, ko so spodnja vlakna raztegnjena
M_{\max} | največji upogibni moment | | N\,m
M_{\mathrm{dop}} | dopustni upogibni moment | | N\,m
q | zvezna obremenitev | | N/m
q_{\max} | največja dovoljena zvezna obremenitev | q_{\max} = \frac{8 M_{\mathrm{dop}}}{L^2} | N/m
x | lega prereza | | m | merjena od levega ali prostega konca
x_i | prijemališče sile $F_i$ | | m
F, F_i | zunanja sila | | N
F_{\uparrow}, F_{\downarrow} | sile navzgor oz. navzdol levo od reza | | N
F_x | vodoravna komponenta sile | F_x = F\cos\alpha | N
F_y | navpična komponenta sile | F_y = F\sin\alpha | N
A_y, B_y | navpični reakciji v podporah | | N
L | dolžina nosilca | | m
\alpha | kot sile glede na vodoravnico | | °
:::
