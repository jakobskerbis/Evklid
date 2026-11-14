---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Dve sceni iz trgovine.

**Pri delikatesi.** Prodajalka stehta kos sira: tehtnica kaže $0{,}436\,\text{kg}$, cena je $13{,}90\,\text{€/kg}$. Kalkulator bi izpisal $6{,}0604\,\text{€}$, na računu pa piše $6{,}06\,\text{€}$. Nihče ne pričakuje, da bo plačal desetinke centa.

**Pri skupnem računu.** Prijatelj reče: »Kosilo je stalo približno $12\,\text{€}$, kava $1{,}80\,\text{€}$, skupaj torej $13{,}80\,\text{€}$.« Zveni natančno, a ni. Ker kosila ne poznaš na cent, tudi vsote ne poznaš na cent. Pošten odgovor je »okoli $14\,\text{€}$«.

Prizora sta različna, ideja pa ista: **rezultat ne more biti natančnejši od najmanj natančnega podatka.**

V laboratoriju se to zgodi vsak dan. Tehtnica, bireta in termometer dajo števila z omejeno natančnostjo, kalkulator pa izpiše deset decimalk. Poročilo, v katerem piše »izkoristek $93{,}756457\,\%$«, bralcu pove, da pisec ne ve, kaj je izmeril. Zato se naučimo, kako zapisati meritev, kako jo urediti v tabelo in graf in kako zgraditi poročilo, ki ga drug kemik lahko ponovi.

## Razlaga

**Branje skale.** Predstavljaj si bireto pri koncu titracije. Spodnji rob meniskusa je med črticama za $24{,}3$ in $24{,}4\,\text{mL}$, približno na sredini:

```
24,3 mL ──────────────
           ‿  ← spodnji rob meniskusa
24,4 mL ──────────────
```

Zapišeš $24{,}35\,\text{mL}$. Prve tri števke ($2$, $4$, $3$) si prebral s skale, zadnjo ($5$) si **ocenil**. Vse skupaj so **značilne števke**: vse zanesljive števke in še ena ocenjena. Zapis $24{,}35\,\text{mL}$ ima štiri značilne števke. Zapis $24{,}3500\,\text{mL}$ bi lagal, saj trdi, da poznaš desettisočinke mililitra.

**Katere števke štejemo.** Pravila najlažje vidiš v tabeli:

| zapis | značilne števke | zakaj |
|---|---|---|
| $24{,}35\,\text{mL}$ | 4 | vse neničelne štejejo |
| $0{,}0450\,\text{g}$ | 3 | ničle spredaj le kažejo mesto vejice; zadnja ničla je izmerjena |
| $10{,}05\,\text{g}$ | 4 | ničle med neničelnimi štejejo |
| $1200\,\text{mL}$ | 2, 3 ali 4? | nejasno; zapiši $1{,}20 \cdot 10^3\,\text{mL}$ (3) |

Ničle na začetku nikoli ne štejejo, ničle za decimalno vejico na koncu pa vedno. Kadar ničle na koncu celega števila povzročajo dvom, uporabi **znanstveni zapis** $a \cdot 10^n$: vse števke v $a$ so značilne.

:::premisli
Maso $2{,}50\,\text{g}$ pretvoriš v miligrame. Ali je $2500\,\text{mg}$ dober zapis? Napovej, preden pogledaš.
---
Ni. Iz $2500\,\text{mg}$ se ne vidi, ali sta ničli izmerjeni. Pretvorba enote ne spremeni natančnosti, zato zapišeš $2{,}50 \cdot 10^3\,\text{mg}$, s tremi značilnimi števkami kot prej.
:::

**Absolutna in relativna negotovost.** Meritev zapišemo kot $x \pm \Delta x$. **Absolutna negotovost** $\Delta x > 0$ ima enoto meritve. **Relativna negotovost** je $\dfrac{\Delta x}{|x|}$ in je brez enote, pogosto v odstotkih. Če negotovost ni navedena, velja dogovor, da je zadnja zapisana števka negotova za največ eno enoto. Negotovost zaokrožimo na eno (največ dve) značilni števki, rezultat pa na isto decimalno mesto: $(2{,}5408 \pm 0{,}0002)\,\text{g}$, ne $(2{,}54 \pm 0{,}0002)\,\text{g}$.

**Računanje z meritvami.** Dve pravili, ki ju pozna že blagajna:

- **Množenje in deljenje:** rezultat ima toliko *značilnih števk* kot podatek z najmanj značilnimi števkami. Sir: $0{,}436$ (3) krat $13{,}90$ (4) da $6{,}06$ (3).
- **Seštevanje in odštevanje:** rezultat ima toliko *decimalnih mest* kot podatek z najmanj decimalnimi mesti. Kosilo $12$ (0 decimalk) plus kava $1{,}80$ (2 decimalki) da $14$ (0 decimalk).

Pri računu v več korakih vmesne rezultate obdrži z eno ali dvema števkama več in **zaokroži šele na koncu**. Sicer se napake zaokroževanja seštevajo.

:::premisli
Zakaj pri seštevanju štejemo decimalna mesta, pri množenju pa značilne števke?
---
Pri seštevanju se seštevajo absolutne negotovosti (npr. $\pm 0{,}5\,\text{€}$), te pa so vezane na mesto zadnje števke. Pri množenju se seštevajo relativne negotovosti (v odstotkih), te pa so odvisne od tega, koliko števk ima podatek.
:::

**Izpeljava pravil.** Naj bosta $x \pm \Delta x$ in $y \pm \Delta y$ meritvi s pozitivnima vrednostma in majhnima negotovostma.

- *Vsota in razlika.* Prava vrednost $x + y$ leži med $(x - \Delta x) + (y - \Delta y)$ in $(x + \Delta x) + (y + \Delta y)$. Prava vrednost $x - y$ leži med $(x - \Delta x) - (y + \Delta y)$ in $(x + \Delta x) - (y - \Delta y)$. V obeh primerih je $\Delta(x \pm y) = \Delta x + \Delta y$. Seštevajo se absolutne negotovosti, ki so vezane na decimalno mesto; zato odloča podatek z najmanj decimalkami.
- *Produkt.* $(x + \Delta x)(y + \Delta y) = xy + x\Delta y + y\Delta x + \Delta x\Delta y$. Člen $\Delta x\Delta y$ je zanemarljivo majhen, zato $\Delta(xy) \approx x\Delta y + y\Delta x$ oziroma $\dfrac{\Delta(xy)}{xy} \approx \dfrac{\Delta x}{x} + \dfrac{\Delta y}{y}$.
- *Količnik.* Največji je $\dfrac{x + \Delta x}{y - \Delta y} = \dfrac{x}{y}\Big(1 + \dfrac{\Delta x}{x}\Big)\dfrac{1}{1 - \Delta y/y}$. Ker je $\dfrac{1}{1 - u} \approx 1 + u$ za majhen $u$ in zmnožek $\dfrac{\Delta x}{x} \cdot \dfrac{\Delta y}{y}$ zanemarimo, je to $\approx \dfrac{x}{y}\Big(1 + \dfrac{\Delta x}{x} + \dfrac{\Delta y}{y}\Big)$. Tudi tu se seštejejo relativne negotovosti.

Relativno negotovost določa število značilnih števk, zato pri množenju in deljenju odloča podatek z najmanj značilnimi števkami. Pri naključnih neodvisnih napakah je verjetna negotovost manjša: namesto vsote vzamemo $\sqrt{\Delta x^2 + \Delta y^2}$ (pri produktu enako za relativne). Pravili o števkah sta hitra ocena; natančen zapis da račun negotovosti.

**Tabela.** Meritve najprej zbereš v tabelo. Primer iz vaje o topnosti:

| $t$ / °C | $m(\text{KNO}_3)$ / g na $100\,\text{g}$ vode |
|---|---|
| 20 | 31,6 |
| 30 | 45,8 |
| 40 | 63,9 |
| 50 | 85,5 |

Pravila: tabela ima številko in naslov **nad** tabelo (»Tabela 1: Topnost KNO$_3$ v vodi«). V glavi stolpca je količina z enoto, ločena s poševnico ($t$ / °C), da so v celicah samo števila. Vsako število ima toliko števk, kot jih je dala meritev.

**Graf.** Iz tabele narišeš graf: na vodoravno os neodvisno spremenljivko (temperaturo, ki si jo nastavil), na navpično odvisno (maso, ki si jo izmeril). Dober graf ima osi z oznako in enoto ($t$ / °C, $m$ / g) ter merilo, ki zapolni večino površine. Meritve so ločene točke (križci ali krožci). Skoznje potegneš **gladko krivuljo ali premico najboljšega ujemanja**, ne lomljene črte od točke do točke. Številka in naslov slike sta **pod** sliko.

**Zgradba poročila.** Poročilo mora drugemu kemiku omogočiti, da poskus ponovi in preveri tvoje sklepe. Običajni razdelki:

1. **Naslov, avtor, datum.**
2. **Namen:** en ali dva stavka, kaj si želel ugotoviti ali pripraviti.
3. **Teoretične osnove:** kratko, le reakcije in enačbe, ki jih potrebuješ.
4. **Kemikalije in pribor:** s koncentracijami in razredom natančnosti.
5. **Postopek:** v pretekliku, kaj se je dejansko zgodilo (»Raztopino smo segrevali do vrenja«), ne navodila iz skripte.
6. **Rezultati:** tabele, grafi, en zgled vsakega izračuna, končni rezultati z enotami in pravim številom števk.
7. **Razprava:** razlaga rezultatov, primerjava s pričakovanim, viri napak.
8. **Zaključek** in **viri.**

Rezultati povedo, *kaj* si dobil; razprava pove, *zakaj* je tako.

## Rešeni primeri

### Primer 1: štetje značilnih števk

V laboratorijskem dnevniku so zapisani: $0{,}0450\,\text{g}$ (analitska tehtnica), $25{,}00\,\text{mL}$ (polnilna pipeta), $1{,}020 \cdot 10^3\,\text{g}$ (tehtnica za grobo tehtanje) in $0{,}005\,\text{mol}$. Koliko značilnih števk ima vsak zapis?

**Podatki:** $0{,}0450\,\text{g}$; $25{,}00\,\text{mL}$; $1{,}020 \cdot 10^3\,\text{g}$; $0{,}005\,\text{mol}$
**Iščemo:** število značilnih števk v vsakem zapisu

:::formula
Ničle spredaj ne štejejo; ničle med števkami in ničle na koncu za vejico štejejo; v $a \cdot 10^n$ štejejo vse števke $a$.
:::

**Rešitev:**

1. $0{,}0450$: ničli spredaj ne štejeta, ostanejo $4$, $5$, $0$, torej 3 značilne števke.
2. $25{,}00$: ničli za vejico sta izmerjeni (pipeta je natančna na $0{,}01\,\text{mL}$), torej 4.
3. $1{,}020 \cdot 10^3$: štejemo $1$, $0$, $2$, $0$, torej 4.
4. $0{,}005$: samo $5$, torej 1 značilna števka.
5. Odgovor: zapisi imajo po vrsti 3, 4, 4 in 1 značilno števko.

### Primer 2: orehi na tehtnici

V trgovini stehtaš orehe. Tehtnica kaže $0{,}38\,\text{kg}$ (prikazuje na $10\,\text{g}$ natančno), cena je $24{,}90\,\text{€/kg}$. Koliko stanejo orehi, zapisano s pravim številom značilnih števk? Kolikšna je negotovost zneska, če tehtnica lahko zgreši za $5\,\text{g}$?

**Podatki:** $m = 0{,}38\,\text{kg}$ (2 značilni števki), cena $p = 24{,}90\,\text{€/kg}$ (4), negotovost mase $\pm 0{,}005\,\text{kg}$
**Iščemo:** znesek $Z$ in njegovo negotovost

:::formula
$Z = m \cdot p$; pri množenju toliko značilnih števk kot najmanj natančen podatek.
:::

**Rešitev:**

1. Kalkulator: $0{,}38 \cdot 24{,}90 = 9{,}462$.
2. Najmanj značilnih števk ima masa (2), zato zaokrožimo na 2: $Z \approx 9{,}5\,\text{€}$.
3. Negotovost: $0{,}005 \cdot 24{,}90 = 0{,}1245$, torej približno $\pm 0{,}12\,\text{€}$. To potrdi, da so stotinke evra res negotove.
4. Odgovor: orehi stanejo približno $9{,}5\,\text{€}$. Blagajna sicer zaračuna $9{,}46\,\text{€}$, ker preprosto računa s prikazano maso; znanstveno pošten zapis pa je $9{,}5\,\text{€}$.

### Primer 3: izkoristek sinteze

Pri sintezi soli stehtaš prazno čašo na analitski tehtnici: $52{,}3418\,\text{g}$. Čaša s suhimi kristali tehta $54{,}8826\,\text{g}$. Teoretični izkoristek, izračunan iz mase reaktanta, je $(2{,}71 \pm 0{,}01)\,\text{g}$, vsak odčitek tehtnice pa ima negotovost $0{,}0001\,\text{g}$. Kolikšen je izkoristek v odstotkih, kolikšna je njegova negotovost in kako ga zapišeš v poročilo?

**Podatki:** $m_\text{čaše} = 52{,}3418\,\text{g}$, $m_\text{čaše + kristalov} = 54{,}8826\,\text{g}$, $m_\text{teor} = (2{,}71 \pm 0{,}01)\,\text{g}$, negotovost odčitka $0{,}0001\,\text{g}$
**Iščemo:** izkoristek $\eta$ in njegovo negotovost $\Delta\eta$

:::formula
$m = m_\text{čaše + kristalov} - m_\text{čaše}$, nato $\eta = \dfrac{m}{m_\text{teor}} \cdot 100\,\%$; $\dfrac{\Delta\eta}{\eta} \approx \dfrac{\Delta m}{m} + \dfrac{\Delta m_\text{teor}}{m_\text{teor}}$
:::

**Rešitev:**

1. Odštevanje (štejemo decimalke, obe imata 4): $54{,}8826 - 52{,}3418 = 2{,}5408$, torej $m = 2{,}5408\,\text{g}$ s petimi značilnimi števkami.
2. Deljenje (štejemo značilne števke): $\eta = \dfrac{2{,}5408\,\text{g}}{2{,}71\,\text{g}} \cdot 100\,\% \approx 93{,}756\,\%$.
3. Najmanj značilnih števk ima $2{,}71$ (3), zato zaokrožimo na 3: $\eta \approx 93{,}8\,\%$.
4. Negotovost mase: razlika dveh odčitkov, zato $\Delta m = 2 \cdot 0{,}0001 = 0{,}0002\,\text{g}$; relativno $\dfrac{0{,}0002}{2{,}5408} \approx 0{,}008\,\%$.
5. Relativna negotovost teoretične mase: $\dfrac{0{,}01}{2{,}71} \approx 0{,}37\,\%$. Pri količniku se relativni negotovosti seštejeta: $0{,}008\,\% + 0{,}37\,\% \approx 0{,}38\,\%$.
6. $\Delta\eta \approx 0{,}0038 \cdot 93{,}76\,\% \approx 0{,}4\,\%$. Prevladuje negotovost teoretične mase; natančnejše tehtanje rezultata ne bi izboljšalo.
7. Odgovor: v rezultate zapišeš $\eta = (93{,}8 \pm 0{,}4)\,\%$, kar potrdi zapis s tremi značilnimi števkami. Zakaj ni $100\,\%$, pojasniš v razpravi (npr. del soli je ostal v matičnici).

### Primer 4: zdaj ti – standardna raztopina NaCl

Za standardno raztopino zatehtaš $0{,}5843\,\text{g}$ NaCl ($M = 58{,}44\,\text{g/mol}$) in jo razredčiš v merilni bučki do $100{,}0\,\text{mL}$. Kolikšna je množinska koncentracija?

**Podatki:** $m = 0{,}5843\,\text{g}$, $M = 58{,}44\,\text{g/mol}$, $V = 100{,}0\,\text{mL} = 0{,}1000\,\text{L}$
**Iščemo:** koncentracijo $c$ s pravim številom značilnih števk

:::formula
$n = \dfrac{m}{M}$, $c = \dfrac{n}{V}$
:::

**Rešitev:**

1. Vsi trije podatki imajo po 4 značilne števke, zato bo tudi rezultat imel 4.
2. Vmesni rezultat: $n = \dfrac{0{,}5843\,\text{g}}{58{,}44\,\text{g/mol}} \approx 0{,}0099983\,\text{mol}$ (nezaokrožen, z rezervno števko).
3. Izračunaj $c$ in zaokroži sam, nato preveri:

:::premisli
Koliko je $c = \dfrac{0{,}0099983\,\text{mol}}{0{,}1000\,\text{L}}$ s štirimi značilnimi števkami?
---
$c \approx 0{,}09998\,\text{mol/L}$ oziroma $9{,}998 \cdot 10^{-2}\,\text{mol/L}$. Zapis $0{,}1\,\text{mol/L}$ bi zavrgel tri izmerjene števke.
:::

## Pogoste napake

- **Prepisan kalkulator.** »$c = 0{,}0999828884\,\text{mol/L}$« je napačno, ker trdi natančnost, ki je ne dasta ne tehtnica ne merilna bučka. Zaokroži po pravilih in obdrži eno ocenjeno števko.
- **Pri seštevanju štejejo značilne števke.** Kdor $12{,}0 + 0{,}346$ zaokroži na 3 značilne števke, dobi $12{,}3$ in ima srečo; pri $102{,}0 + 0{,}346$ pa dobi $102$ in zavrže izmerjeno desetinko. Pri seštevanju odloča mesto zadnje zanesljive decimalke: $102{,}0 + 0{,}346 \approx 102{,}3$.
- **Ničle spredaj štejejo.** $0{,}0215\,\text{L}$ nima 5 značilnih števk, ampak 3. Ničle spredaj le premaknejo vejico, kar se vidi iz $21{,}5\,\text{mL}$.
- **Pretvorba enote spremeni natančnost.** $2{,}50\,\text{g} = 2500\,\text{mg}$ izgubi podatek, da je ničla izmerjena. Uporabi $2{,}50 \cdot 10^3\,\text{mg}$.
- **Razlaga med rezultati.** Stavek »izkoristek je nizek, ker smo izgubili produkt pri filtraciji« ne sodi med rezultate, ampak v razpravo. Rezultati so števila; razprava je razlaga.

## Povzetek

- Značilne števke so vse zanesljive števke in ena ocenjena. Ničle spredaj ne štejejo, ničle na koncu za vejico štejejo; v dvomu uporabi znanstveni zapis.
- Množenje in deljenje: toliko značilnih števk kot najmanj natančen podatek. Seštevanje in odštevanje: toliko decimalnih mest kot najmanj natančen podatek.
- Zaokrožuj šele na koncu; vmesne rezultate obdrži z rezervno števko.
- Tabela: številka in naslov nad njo, v glavi količina / enota. Graf: osi z oznako in enoto, točke in gladka krivulja najboljšega ujemanja, naslov pod sliko.
- Poročilo: namen, teorija, kemikalije in pribor, postopek v pretekliku, rezultati, razprava, zaključek, viri.

## Za izpit

Znati moraš povedati:

- definicijo značilnih števk in pravila za ničle ter zakaj znanstveni zapis odpravi dvom;
- definicijo absolutne in relativne negotovosti ter pravilo za zapis $x \pm \Delta x$;
- izpeljavo $\Delta(x \pm y) = \Delta x + \Delta y$ in $\dfrac{\Delta(xy)}{xy} \approx \dfrac{\Delta x}{x} + \dfrac{\Delta y}{y}$ (enako za količnik) ter zakaj iz njiju sledita pravili za števke;
- pravila za tabelo in graf ter zgradbo poročila; kaj sodi v rezultate in kaj v razpravo.

### Naloga 1

Raztopino NaOH standardiziraš s kalijevim hidrogenftalatom (KHP, $M = 204{,}22\,\text{g/mol}$), ki z NaOH reagira v razmerju $1 : 1$. KHP zatehtaš z razliko: tehtič pred stresanjem $15{,}4382\,\text{g}$, po stresanju $14{,}9278\,\text{g}$ (vsak odčitek $\pm 0{,}0001\,\text{g}$). Bireta pokaže na začetku $0{,}20\,\text{mL}$, ob preskoku barve indikatorja $24{,}55\,\text{mL}$ (vsak odčitek $\pm 0{,}02\,\text{mL}$). Izračunaj koncentracijo NaOH in jo zapiši z negotovostjo; negotovost molske mase zanemari.

**Rešitev:**

1. Masa KHP: $15{,}4382 - 14{,}9278 = 0{,}5104\,\text{g}$, negotovost $2 \cdot 0{,}0001 = 0{,}0002\,\text{g}$.
2. Prostornina: $24{,}55 - 0{,}20 = 24{,}35\,\text{mL}$, negotovost $2 \cdot 0{,}02 = 0{,}04\,\text{mL}$.
3. Množina: $n = \dfrac{0{,}5104\,\text{g}}{204{,}22\,\text{g/mol}} \approx 2{,}4993 \cdot 10^{-3}\,\text{mol}$ (z rezervno števko); enaka je množina NaOH.
4. Koncentracija: $c = \dfrac{2{,}4993 \cdot 10^{-3}\,\text{mol}}{0{,}02435\,\text{L}} \approx 0{,}10264\,\text{mol/L}$.
5. Relativni negotovosti: $\dfrac{0{,}0002}{0{,}5104} \approx 0{,}039\,\%$ in $\dfrac{0{,}04}{24{,}35} \approx 0{,}164\,\%$; vsota $\approx 0{,}20\,\%$.
6. $\Delta c \approx 0{,}0020 \cdot 0{,}10264 \approx 0{,}0002\,\text{mol/L}$; rezultat zaokrožimo na isto decimalno mesto.
7. Odgovor: $c(\text{NaOH}) = (0{,}1026 \pm 0{,}0002)\,\text{mol/L}$. Negotovost določa predvsem bireta.

### Naloga 2

Naj bosta $x \pm \Delta x$ in $y \pm \Delta y$ meritvi s pozitivnima vrednostma in majhnima negotovostma. (a) Izpelji največjo absolutno negotovost razlike $x - y$ in relativno negotovost količnika $x/y$. (b) Prazna čaša ima $52{,}31\,\text{g}$, s kristali $52{,}36\,\text{g}$ (vsak odčitek $\pm 0{,}01\,\text{g}$). Utemelji, ali ima masa kristalov štiri značilne števke kot meritvi, in izračunaj njeno relativno negotovost.

**Rešitev:**

1. Razlika je največja pri $(x + \Delta x) - (y - \Delta y)$ in najmanjša pri $(x - \Delta x) - (y + \Delta y)$, zato $\Delta(x - y) = \Delta x + \Delta y$.
2. Količnik je največji pri $\dfrac{x + \Delta x}{y - \Delta y} = \dfrac{x}{y}\Big(1 + \dfrac{\Delta x}{x}\Big)\dfrac{1}{1 - \Delta y/y}$.
3. Za majhen $u$ je $\dfrac{1}{1 - u} \approx 1 + u$; zmnožek $\dfrac{\Delta x}{x} \cdot \dfrac{\Delta y}{y}$ zanemarimo. Torej $\dfrac{\Delta(x/y)}{x/y} \approx \dfrac{\Delta x}{x} + \dfrac{\Delta y}{y}$.
4. (b) $m = 52{,}36 - 52{,}31 = 0{,}05\,\text{g}$, $\Delta m = 0{,}01 + 0{,}01 = 0{,}02\,\text{g}$.
5. Relativna negotovost: $\dfrac{0{,}02}{0{,}05} = 0{,}4 = 40\,\%$.
6. Odgovor: ne. Odštevanje ohrani decimalna mesta, ne značilnih števk, zato ima $m = (0{,}05 \pm 0{,}02)\,\text{g}$ le eno značilno števko in $40\,\%$ negotovosti. Tako majhno razliko moraš tehtati na analitski tehtnici.

## Drugače: Z analogijo

Rezultat računa je kot veriga: močna je le toliko kot njen **najšibkejši člen**. Če pri množenju povežeš podatek s štirimi zanesljivimi števkami in podatek z dvema, veriga zdrži le dve. Dodatne števke na kalkulatorju so kot zlati členi, pripeti na zarjavelega: verige ne okrepijo, le videti je dražja.

Pri seštevanju je bolj podobno merjenju dolžine z dvema ravniloma. Če eno ravnilo kaže milimetre, drugo pa samo centimetre, skupna dolžina ni znana na milimeter. Odloča najbolj groba skala.

## Drugače: Uporaba v stroki

- **Laboratorijski dnevnik.** Po dobri laboratorijski praksi (GLP) vsak podatek takoj zapišeš z datumom in podpisom. Napako prečrtaš z eno črto, da ostane berljiva, in je nikoli ne zbrišeš; poročilo mora biti sledljivo do surovih podatkov.
- **Merilna negotovost.** Laboratoriji, akreditirani po standardu ISO/IEC 17025, morajo oceniti merilno negotovost in jo navesti, kadar vpliva na veljavnost rezultata ali jo zahteva naročnik, na primer $c = (0{,}1026 \pm 0{,}0002)\,\text{mol/L}$ kot v nalogi 1.
- **Primerjava s specifikacijo.** V farmacevtski kontroli kakovosti rezultat najprej zaokrožiš na toliko mest, kot jih ima meja, in ga šele nato primerjaš z mejo. Vsebnost $98{,}46\,\%$ pri meji »najmanj $98{,}5\,\%$« zaokrožiš na $98{,}5\,\%$, zato serija ustreza; zapis z več števkami bi dal napačno odločitev.
- **Objava.** Znanstvene revije zahtevajo grafe z oznako in enoto na oseh ter s prikazano negotovostjo točk (črtice napak).

## Preveri se

? Kolega v poročilo zapiše: »Nižji izkoristek pripisujemo izgubi kristalov pri prenosu na filtrirni papir.« V kateri razdelek sodi ta stavek?
- Rezultati
~ Rezultati so izmerjene in izračunane vrednosti; razlaga vzrokov sodi drugam.
- Postopek
~ Postopek opisuje, kaj si naredil, ne zakaj je rezultat tak.
+ Razprava
- Namen
~ Namen pove, kaj si želel ugotoviti pred poskusom, ne razlage po njem.
> Razprava pojasni rezultate in navede vire napak.

? Razvrsti zapise po številu značilnih števk od najmanj do največ: A $0{,}050\,\text{g}$, B $5{,}00 \cdot 10^2\,\text{g}$, C $50{,}05\,\text{g}$.
+ A, B, C
- C, B, A
~ To je obraten vrstni red, od največ do najmanj: C ima 4, B 3, A le 2.
- A, C, B
~ C ima 4 značilne števke (ničla med petkama šteje), B pa 3.
- B, A, C
~ B ima 3 značilne števke (vse v $5{,}00$), A pa samo 2.
> A ima 2 ($5$ in zadnja $0$), B ima 3, C ima 4.

? Kaj se zgodi, če pri računu v treh korakih vsak vmesni rezultat sproti zaokrožiš na značilne števke?
- Nič, rezultat je vedno enak.
~ Ni nujno: vsako zaokroževanje doda majhno napako, te pa se lahko seštejejo.
+ Končni rezultat se lahko v zadnji števki razlikuje od pravilnega, ker se napake zaokroževanja seštejejo.
- Rezultat je natančnejši, ker računaš z manj števkami.
~ Manj števk ne pomeni večje natančnosti; zavržeš podatek, ki si ga imel.
> Vmesne rezultate obdrži z rezervno števko in zaokroži šele končni rezultat.

? V bučko z $25{,}0\,\text{mL}$ vode dodaš $0{,}346\,\text{mL}$ raztopine (mikropipeta). Kako zapišeš skupno prostornino?
- $25{,}346\,\text{mL}$
~ To je prepis kalkulatorja; prva prostornina je znana le na desetinko mililitra.
+ $25{,}3\,\text{mL}$
- $25\,\text{mL}$
~ Zaokrožil si preveč: $25{,}0$ ima eno decimalko, zato jo obdrži tudi vsota.
> Seštevanje: odloča najmanj decimalnih mest. $25{,}0 + 0{,}346 = 25{,}346 \approx 25{,}3\,\text{mL}$.

? Pri titraciji porabiš $21{,}5\,\text{mL}$ raztopine NaOH s $c = 0{,}1000\,\text{mol/L}$. Kolikšna je množina NaOH?
- $2{,}150 \cdot 10^{-3}\,\text{mol}$
~ Štiri značilne števke ima samo koncentracija; prostornina jih ima tri, zato tudi rezultat le tri.
- $2{,}15\,\text{mol}$
~ Mililitrov nisi pretvoril v litre: $21{,}5\,\text{mL} = 0{,}0215\,\text{L}$.
+ $2{,}15 \cdot 10^{-3}\,\text{mol}$
- $2 \cdot 10^{-3}\,\text{mol}$
~ Ničle spredaj ne štejejo; $0{,}0215$ ima 3 značilne števke, ne ene.
> $n = c \cdot V = 0{,}1000\,\text{mol/L} \cdot 0{,}0215\,\text{L} = 2{,}15 \cdot 10^{-3}\,\text{mol}$, s tremi značilnimi števkami kot prostornina.

:::simboli
a | število pred potenco v znanstvenem zapisu | | – | 1 ≤ a < 10; vse števke so značilne
n | množina snovi | n = \dfrac{m}{M} | mol | v zapisu a · 10ⁿ celoštevilski eksponent
Z | znesek | Z = m \cdot p | € |
m | masa | | g | v primeru z zneskom v kg
p | cena na kilogram | | €/kg |
m_\text{čaše + kristalov} | masa čaše s kristali | | g |
m_\text{čaše} | masa prazne čaše | | g |
\eta | izkoristek | \eta = \dfrac{m}{m_\text{teor}} \cdot 100\,\% | \% |
m_\text{teor} | teoretična masa produkta | | g |
x | izmerjena vrednost | | enota meritve | tudi y
\Delta x | absolutna negotovost meritve x | | enota meritve | relativna negotovost je Δx/x
\Delta\eta | negotovost izkoristka | | \% |
M | molska masa | | g/mol |
c | množinska koncentracija | c = \dfrac{n}{V} | mol/L |
V | prostornina raztopine | | L |
:::
