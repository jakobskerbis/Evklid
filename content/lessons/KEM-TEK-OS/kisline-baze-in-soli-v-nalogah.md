---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Ana trenira plavanje. Teden pred državnim prvenstvom se plavalci pritožujejo, da jih v bazenu pečejo oči. Trener ve, da Ana hodi na kemijsko tekmovanje, zato ji da škatlico indikatorskih lističev. Ana pomoči listič v vodo in ga primerja z barvno lestvico na škatlici: pH je $8$. Na navodilih piše, naj bo voda v bazenu med $7{,}2$ in $7{,}6$.

Ana mora zdaj ugotoviti dve stvari. Ali je voda preveč kisla ali preveč bazična? In kaj je treba dodati, da se pH vrne v pravo območje? Za odgovor potrebuje tri stvari: lestvico pH, indikatorje, ki jo pokažejo, in reakcijo, v kateri kislina in baza druga drugo »izničita«. Prav te tri stvari na tekmovanju nastopajo v ugankah z neoznačenimi epruvetami in v računih.

## Razlaga

**Lestvica pH.** Najprej slika. Kislost in bazičnost raztopine merimo z vrednostjo **pH** na lestvici od $0$ do $14$:

:::risba premica
opis: Lestvica pH od 0 do 14. Levo od 7 so kisle raztopine, desno od 7 bazične, točno pri 7 je nevtralna voda. Označeni so limonin sok pri 2, voda v bazenu pri 7,4 in milnica pri 10.
od: 0
do: 14
korak: 1
interval: 0 .. 7 | kislo
interval: 7 .. 14 | bazično
točka: 2 | limonin sok
točka: 7,4 | bazen
točka: 10 | milnica
:::

- Pod $7$ je raztopina **kisla**. Manjši kot je pH, bolj je kisla.
- Točno $7$ ima **nevtralna** raztopina, na primer čista voda.
- Nad $7$ je raztopina **bazična**. Večji kot je pH, bolj je bazična.

Točka »bazen« pri $7{,}4$ kaže želeno vrednost. Anin bazen s pH $8$ leži desno od nje: voda je rahlo preveč bazična.

**Indikatorji.** Indikatorski listič pokaže prav to: kje na premici je raztopina. **Indikator** je snov, ki v kislem in bazičnem okolju pokaže različno barvo. Najpomembnejši so v tabeli:

| indikator | kislo | nevtralno | bazično |
|---|---|---|---|
| lakmus | rdeč | vijoličast | moder |
| fenolftalein | brezbarven | brezbarven | rožnat |
| univerzalni | rdeč do rumen | zelen | moder do vijoličen |
| rdeče zelje | rdeč | vijoličen | zelen do rumen |

Poglej vrstico fenolftaleina. Brezbarven je v kisli **in** v nevtralni raztopini. Rožnat postane šele v bazični.

:::premisli
V epruveti s fenolftaleinom je brezbarvna raztopina. Ali lahko zanesljivo rečeš, da je kislina? Zakaj?
---
Ne. Fenolftalein je brezbarven tudi v nevtralni raztopini, na primer v vodi ali v raztopini kuhinjske soli. Pove samo, ali je raztopina bazična ali ne.
:::

**Kaj se zgodi, ko se srečata.** Kisline v vodi oddajo vodikove ione $\mathrm{H^+}$ (ti se vežejo na vodo v oksonijeve ione $\mathrm{H_3O^+}$, a v enačbah jih pogosto pišemo kar $\mathrm{H^+}$). Baze, kot je natrijev hidroksid, dajo v vodi hidroksidne ione $\mathrm{OH^-}$. Ko kislino in bazo zmešamo, se ta dva iona povežeta v vodo:

$$\mathrm{H^+ + OH^- \rightarrow H_2O}$$

Tej reakciji rečemo **nevtralizacija**. Ioni, ki se pri tem niso povezali v vodo, ostanejo v raztopini: kation baze in anion kisline. Ko vodo izparimo, se povežejo v kristal **soli**. »Sol« v kemiji torej ne pomeni le kuhinjske soli, ampak vsako ionsko spojino iz kationa kovine in aniona kisline.

**Tabela parov.** Sol sestaviš kot pri formulah ionskih spojin: kation iz baze, anion iz kisline, vsota nabojev je $0$.

| kislina | baza | sol | ime soli |
|---|---|---|---|
| $\mathrm{HCl}$ | $\mathrm{NaOH}$ | $\mathrm{NaCl}$ | natrijev klorid |
| $\mathrm{H_2SO_4}$ | $\mathrm{KOH}$ | $\mathrm{K_2SO_4}$ | kalijev sulfat |
| $\mathrm{HNO_3}$ | $\mathrm{Ca(OH)_2}$ | $\mathrm{Ca(NO_3)_2}$ | kalcijev nitrat |
| $\mathrm{H_3PO_4}$ | $\mathrm{NaOH}$ | $\mathrm{Na_3PO_4}$ | natrijev fosfat |

Za vsak $\mathrm{H^+}$ kisline potrebuješ en $\mathrm{OH^-}$ baze. Zato $\mathrm{H_2SO_4}$ potrebuje dva $\mathrm{KOH}$:

$$\mathrm{H_2SO_4 + 2\,KOH \rightarrow K_2SO_4 + 2\,H_2O}$$

:::premisli
Koliko $\mathrm{NaOH}$ potrebuje ena $\mathrm{H_3PO_4}$ in koliko molekul vode pri tem nastane? Napovej iz števila vodikovih atomov.
---
Tri $\mathrm{NaOH}$ in tri molekule vode. Kislina ima tri vodike, ki se oddajo kot $\mathrm{H^+}$; vsak se z enim $\mathrm{OH^-}$ poveže v molekulo vode. Isto pove formula soli $\mathrm{Na_3PO_4}$: trije $\mathrm{Na}$ pridejo iz treh $\mathrm{NaOH}$.
:::

**Splošno pravilo.** Šele zdaj ga zapišimo z besedami:

$$\text{kislina} + \text{baza} \rightarrow \text{sol} + \text{voda}$$

Sol nastane še na dva načina, ki ju naloge rade kombinirajo. Kovina, kot je magnezij, s kislino da sol in vodik ($\mathrm{Mg + 2\,HCl \rightarrow MgCl_2 + H_2}$). Karbonat s kislino da sol, vodo in ogljikov dioksid, ki uhaja v mehurčkih ($\mathrm{CaCO_3 + 2\,HCl \rightarrow CaCl_2 + H_2O + CO_2}$).

Ana zdaj ve, kaj storiti: v bazen je treba dodati malo kisline, da nevtralizira odvečne ione $\mathrm{OH^-}$. V simulaciji spodaj (»Nevtralizacija in indikatorji«) po kapljicah dodajaj bazo h kislini z indikatorjem. Opazuj, pri kateri kapljici se barva nenadoma spremeni in kje je takrat pH.

## Rešeni primeri

### Primer 1 (lažji): tableta proti zgagi

Tekačica Eva ima pred maratonom zgago: v želodcu je preveč klorovodikove kisline $\mathrm{HCl}$. Vzame tableto z magnezijevim hidroksidom $\mathrm{Mg(OH)_2}$. Zapiši urejeno enačbo nevtralizacije in poimenuj nastalo sol.

**Podatki:** kislina $\mathrm{HCl}$, baza $\mathrm{Mg(OH)_2}$
**Iščemo:** urejeno enačbo in ime soli

:::formula
kislina + baza → sol + voda; za vsak $\mathrm{OH^-}$ en $\mathrm{H^+}$
:::

**Rešitev:**

1. Ioni: baza da $\mathrm{Mg^{2+}}$ in dva $\mathrm{OH^-}$, kislina da $\mathrm{H^+}$ in $\mathrm{Cl^-}$.
2. Sol: $\mathrm{Mg^{2+}}$ potrebuje dva $\mathrm{Cl^-}$, da je vsota nabojev $0$, torej $\mathrm{MgCl_2}$.
3. Dva $\mathrm{OH^-}$ potrebujeta dva $\mathrm{H^+}$, zato pred $\mathrm{HCl}$ in $\mathrm{H_2O}$ pišemo $2$.
4. Enačba: $\mathrm{Mg(OH)_2 + 2\,HCl \rightarrow MgCl_2 + 2\,H_2O}$.
5. Odgovor: nastane magnezijev klorid, odvečna kislina se porabi in zgaga popusti.

### Primer 2: uganka s tremi epruvetami

Na tekmovanju dobiš tri neoznačene epruvete A, B in C. V eni je razredčena klorovodikova kislina, v drugi raztopina natrijevega hidroksida, v tretji raztopina natrijevega klorida. Na voljo imaš samo fenolftalein in kapalke. Kako ugotoviš, kaj je v kateri?

**Podatki:** epruvete A, B, C; snovi $\mathrm{HCl}$, $\mathrm{NaOH}$, $\mathrm{NaCl}$ (vse raztopine brezbarvne); indikator fenolftalein
**Iščemo:** postopek, ki loči vse tri

:::formula
Fenolftalein je rožnat le v bazični raztopini. Kislina nevtralizira ione $\mathrm{OH^-}$.
:::

**Rešitev:**

1. V vsako epruveto kani fenolftalein. Recimo, da se B obarva rožnato: le $\mathrm{NaOH}$ je bazičen, zato je v B baza.
2. A in C ostaneta brezbarvni. To sta kislina in nevtralna sol, fenolftalein ju ne loči.
3. V A dodajaj po kapljicah raztopino iz B. Če se A obarva rožnato že ob prvi kapljici, v A ni ničesar, kar bi porabilo $\mathrm{OH^-}$: to je $\mathrm{NaCl}$.
4. Če A ostane brezbarvna več kapljic, kislina sproti nevtralizira dodane $\mathrm{OH^-}$: to je $\mathrm{HCl}$.
5. Odgovor: baza se pokaže sama, kislino pa razkrije baza, ki v njej šele po več kapljicah obarva fenolftalein. Tretja epruveta je sol.

### Primer 3 (težji): nevtralizacija z raztopinama

Koliko gramov raztopine natrijevega hidroksida z $4\,\%$ $\mathrm{NaOH}$ potrebuješ za nevtralizacijo $50\,\mathrm{g}$ klorovodikove kisline s $3{,}65\,\%$ $\mathrm{HCl}$? Kolikšen je masni delež soli v nastali raztopini? $M(\mathrm{HCl}) = 36{,}5\,\mathrm{g/mol}$, $M(\mathrm{NaOH}) = 40\,\mathrm{g/mol}$, $M(\mathrm{NaCl}) = 58{,}5\,\mathrm{g/mol}$.

**Podatki:** $m_{\mathrm{r}}(\text{kisline}) = 50\,\mathrm{g}$, $w(\mathrm{HCl}) = 3{,}65\,\%$, $w(\mathrm{NaOH}) = 4\,\%$, molske mase zgoraj
**Iščemo:** maso raztopine baze in $w(\mathrm{NaCl})$

:::formula
$\mathrm{HCl + NaOH \rightarrow NaCl + H_2O}$; $n = \dfrac{m}{M}$; $m_{\mathrm{t}} = w \cdot m_{\mathrm{r}}$
:::

**Rešitev:**

1. Masa kisline v raztopini: $0{,}0365 \cdot 50\,\mathrm{g} = 1{,}825\,\mathrm{g}$.
2. Množina: $n(\mathrm{HCl}) = \dfrac{1{,}825\,\mathrm{g}}{36{,}5\,\mathrm{g/mol}} = 0{,}05\,\mathrm{mol}$.
3. Razmerje koeficientov je $1 : 1$, zato je $n(\mathrm{NaOH}) = 0{,}05\,\mathrm{mol}$ in $m(\mathrm{NaOH}) = 0{,}05\,\mathrm{mol} \cdot 40\,\mathrm{g/mol} = 2\,\mathrm{g}$.
4. Ta baza je $4\,\%$ raztopine: $m_{\mathrm{r}} = \dfrac{2\,\mathrm{g}}{0{,}04} = 50\,\mathrm{g}$.
5. Soli nastane $0{,}05\,\mathrm{mol}$: $m(\mathrm{NaCl}) = 0{,}05\,\mathrm{mol} \cdot 58{,}5\,\mathrm{g/mol} = 2{,}925\,\mathrm{g}$.
6. Pri tej reakciji ne nastane plin, zato nič ne uide in je vsa raztopina $50\,\mathrm{g} + 50\,\mathrm{g} = 100\,\mathrm{g}$ in $w(\mathrm{NaCl}) = \dfrac{2{,}925\,\mathrm{g}}{100\,\mathrm{g}} \approx 2{,}9\,\%$.
7. Odgovor: potrebuješ $50\,\mathrm{g}$ raztopine baze; nastala raztopina ima približno $2{,}9\,\%$ natrijevega klorida.

### Primer 4 – zdaj ti: razlita akumulatorska kislina

V garaži kluba je iz akumulatorja kombija, s katerim se ekipa vozi na tekme, iztekla žveplova kislina. V lužici je $4{,}9\,\mathrm{g}$ $\mathrm{H_2SO_4}$. Hišnik jo potrese s sodo bikarbono $\mathrm{NaHCO_3}$. Koliko sode bikarbone najmanj potrebuje? $M(\mathrm{H_2SO_4}) = 98\,\mathrm{g/mol}$, $M(\mathrm{NaHCO_3}) = 84\,\mathrm{g/mol}$.

**Podatki:** $m(\mathrm{H_2SO_4}) = 4{,}9\,\mathrm{g}$, molski masi zgoraj
**Iščemo:** $m(\mathrm{NaHCO_3})$

:::formula
$\mathrm{2\,NaHCO_3 + H_2SO_4 \rightarrow Na_2SO_4 + 2\,H_2O + 2\,CO_2}$; $n = \dfrac{m}{M}$
:::

**Rešitev:**

1. Soda bikarbona je natrijev hidrogenkarbonat. S kislino reagira kot karbonat: da sol (natrijev sulfat), vodo in ogljikov dioksid; enačba je zgoraj.
2. $n(\mathrm{H_2SO_4}) = \dfrac{4{,}9\,\mathrm{g}}{98\,\mathrm{g/mol}} = 0{,}05\,\mathrm{mol}$.
3. Razmerje koeficientov je $2 : 1$, zato $n(\mathrm{NaHCO_3}) = 2 \cdot 0{,}05\,\mathrm{mol} = 0{,}1\,\mathrm{mol}$.
4. Izračunaj maso sam, nato preveri:

:::premisli
Koliko gramov sode bikarbone potrebuje hišnik?
---
$m = 0{,}1\,\mathrm{mol} \cdot 84\,\mathrm{g/mol} = 8{,}4\,\mathrm{g}$. Če pozabiš na koeficient $2$, dobiš napačnih $4{,}2\,\mathrm{g}$.
:::

## Pogoste napake

- *»Brezbarvni fenolftalein pomeni kislino.«* Fenolftalein je brezbarven tudi v nevtralni raztopini. Brezbarvnost pove le, da raztopina ni bazična. Kislino od soli ločiš z dodajanjem baze, kot v Primeru 2.
- *Formula soli brez nabojev.* Iz $\mathrm{Ca(OH)_2}$ in $\mathrm{HNO_3}$ nastane $\mathrm{Ca(NO_3)_2}$, ne $\mathrm{CaNO_3}$. Kalcij ima naboj $2+$, nitrat $1-$, zato potrebuješ dva nitrata.
- *Enake mase kisline in baze.* Za nevtralizacijo $1{,}825\,\mathrm{g}$ $\mathrm{HCl}$ ne rabiš $1{,}825\,\mathrm{g}$ $\mathrm{NaOH}$, ampak $2\,\mathrm{g}$. Enaki morata biti množini $\mathrm{H^+}$ in $\mathrm{OH^-}$, ne masi.
- *Pozabljeni koeficient.* $\mathrm{H_2SO_4}$ odda dva $\mathrm{H^+}$, zato potrebuje dvakrat večjo množino $\mathrm{NaOH}$. Brez koeficienta $2$ je rezultat polovičen.
- *»Sol je kuhinjska sol.«* V kemiji je sol vsaka ionska spojina iz kationa kovine (ali $\mathrm{NH_4^+}$) in aniona kisline: $\mathrm{K_2SO_4}$, $\mathrm{CaCl_2}$, $\mathrm{Na_3PO_4}$.

## Povzetek

- pH pod $7$: kislo, $7$: nevtralno, nad $7$: bazično.
- Indikatorji: lakmus rdeč/moder; fenolftalein brezbarven v kislem in nevtralnem, rožnat v bazičnem; univerzalni od rdeče prek zelene do vijolične.
- Nevtralizacija: $\mathrm{H^+ + OH^- \rightarrow H_2O}$; kislina + baza → sol + voda.
- Sol: kation baze + anion kisline, vsota nabojev $0$. Za vsak $\mathrm{H^+}$ en $\mathrm{OH^-}$, iz tega koeficienti.
- Sol nastane tudi iz kovine in kisline (+ vodik) ter iz karbonata in kisline (+ voda + $\mathrm{CO_2}$).
- Račun: masa kisline, množina kisline, razmerje koeficientov, množina baze, masa baze; pri raztopinah še $m_{\mathrm{t}} = w \cdot m_{\mathrm{r}}$.

## Drugače: Z analogijo

Predstavljaj si šolski ples, na katerega pridejo dve ekipi. Ekipa kisline pripelje plesalce $\mathrm{H^+}$ in svoje navijače, na primer $\mathrm{Cl^-}$. Ekipa baze pripelje plesalce $\mathrm{OH^-}$ in navijače $\mathrm{Na^+}$.

Plesalca $\mathrm{H^+}$ in $\mathrm{OH^-}$ se takoj primeta v par, ki odide s plesišča kot molekula vode. Navijači ostanejo v dvorani. Ko se dvorana izprazni (voda izpari), se navijači obeh ekip usedejo skupaj na tribuno: to je kristal soli $\mathrm{NaCl}$.

Če ena ekipa pripelje več plesalcev, jih nekaj ostane brez para. Takrat raztopina ni nevtralna: odvečni $\mathrm{H^+}$ jo naredijo kislo, odvečni $\mathrm{OH^-}$ bazično. Ekipa $\mathrm{H_2SO_4}$ pripelje dva plesalca na enega navijača $\mathrm{SO_4^{2-}}$, zato potrebuje dvakrat več plesalcev $\mathrm{OH^-}$.

## Drugače: Iz vsakdanjega življenja

- **Indikator iz kuhinje.** Sok kuhanega rdečega zelja je vijoličast. S kisom postane rdeč, z raztopino pralnega praška zelenkast. Tako doma preveriš, ali je čistilo kislo ali bazično.
- **Zgaga.** Tablete proti zgagi vsebujejo bazo, na primer magnezijev hidroksid ali kalcijev karbonat. Nevtralizirajo del želodčne kisline.
- **Vodni kamen.** Kalcijev karbonat v grelniku vode odstraniš s kisom ali citronsko kislino. Mehurčki so ogljikov dioksid, nastane topna sol.
- **Bazen.** Vzdrževalci vsak dan merijo pH. Če je previsok, dodajo kislino, če je prenizek, bazično snov, kot je soda.

## Preveri se

? Na lestvici pH so označene štiri snovi: A kola, B kis, C paradižnikov sok, D milnica. Katera ne sodi v skupino?
:::risba premica
opis: Lestvica pH od 0 do 14. Točka A kola je pri 2,5, točka B kis pri 3, točka C paradižnikov sok pri 4, točka D milnica pri 10.
od: 0
do: 14
korak: 1
točka: 2,5 | A
točka: 3 | B
točka: 4 | C
točka: 10 | D
:::
- kola, ker je edina gazirana
~ Mehurčki niso merilo kislosti. Na lestvici je kola pri $2{,}5$, torej kisla kot B in C.
- paradižnikov sok, ker ima najvišji pH med prvimi tremi
~ Res ima višji pH kot A in B, a $4$ je še vedno pod $7$, torej je kisel.
+ milnica, ker je edina bazična
- kis, ker je edini, ki ga uporabljamo pri kuhanju
~ Vprašanje je o kislosti. Kis je pri $3$, kisel kot A in C.
> A, B in C ležijo pod $7$ in so kisli. Milnica je pri $10$, nad $7$, zato je edina bazična.

? Koliko gramov $\mathrm{NaOH}$ potrebuješ za popolno nevtralizacijo $9{,}8\,\mathrm{g}$ $\mathrm{H_2SO_4}$? $M(\mathrm{H_2SO_4}) = 98\,\mathrm{g/mol}$, $M(\mathrm{NaOH}) = 40\,\mathrm{g/mol}$.
= 8 g | 0,1
~ 4 | Pozabil si, da $\mathrm{H_2SO_4}$ odda dva $\mathrm{H^+}$. Na $1\,\mathrm{mol}$ kisline rabiš $2\,\mathrm{mol}$ $\mathrm{NaOH}$.
~ 9,8 | Vzel si enako maso baze kot kisline. Enaki morata biti množini $\mathrm{H^+}$ in $\mathrm{OH^-}$, ne masi.
> $\mathrm{H_2SO_4 + 2\,NaOH \rightarrow Na_2SO_4 + 2\,H_2O}$. $n(\mathrm{H_2SO_4}) = 0{,}1\,\mathrm{mol}$, $n(\mathrm{NaOH}) = 0{,}2\,\mathrm{mol}$, $m = 0{,}2 \cdot 40 = 8\,\mathrm{g}$.

? Raztopini $\mathrm{NaOH}$ s fenolftaleinom po kapljicah dodajamo $\mathrm{HCl}$. Pri neki kapljici rožnata barva izgine. Kaj je vzrok?
- Klorovodikova kislina razgradi fenolftalein.
~ Fenolftalein ostane cel. Ko dodaš bazo, je spet rožnat.
+ Zadnji ioni $\mathrm{OH^-}$ so se s $\mathrm{H^+}$ povezali v vodo, zato raztopina ni več bazična.
- Nastala sol $\mathrm{NaCl}$ je bela in prekrije rožnato barvo.
~ $\mathrm{NaCl}$ je v vodi raztopljen in brezbarven. Barve ne prekrije.
- Raztopina je postala močno kisla.
~ Barva izgine že, ko raztopina ni več bazična. Fenolftalein je brezbarven tudi v nevtralni raztopini.
> Fenolftalein je rožnat le, dokler so v raztopini odvečni $\mathrm{OH^-}$. Ko jih kislina nevtralizira, postane brezbarven.

? Učenec piše enačbo reakcije kalcijevega hidroksida z dušikovo(V) kislino. V katerem koraku je **prva** napaka?
Korak 1: ioni so $\mathrm{Ca^{2+}}$, $\mathrm{OH^-}$, $\mathrm{H^+}$ in $\mathrm{NO_3^-}$.
Korak 2: sol je $\mathrm{CaNO_3}$.
Korak 3: $\mathrm{Ca(OH)_2 + HNO_3 \rightarrow CaNO_3 + H_2O}$.
- Korak 1
~ Ioni so pravilni: kalcij ima naboj $2+$, nitrat $1-$.
+ Korak 2
- Korak 3
~ Korak 3 je res napačen, a napaka izvira iz koraka 2. Vprašanje sprašuje po prvi napaki.
- Vsi koraki so pravilni.
~ $\mathrm{CaNO_3}$ ima vsoto nabojev $2 - 1 = +1$, ne $0$.
> Sol je $\mathrm{Ca(NO_3)_2}$. Prava enačba: $\mathrm{Ca(OH)_2 + 2\,HNO_3 \rightarrow Ca(NO_3)_2 + 2\,H_2O}$.

? Razvrsti korake nevtralizacije kisline z bazo ob indikatorju.
1. V erlenmajerico odmeri znano maso raztopine kisline.
2. Dodaj dve kapljici fenolftaleina.
3. Po kapljicah dodajaj raztopino baze in mešaj.
4. Ustavi, ko rožnata barva ostane tudi po mešanju.
5. Iz mase porabljene baze izračunaj množino kisline.
> Indikator mora biti v kislini, preden začneš dodajati bazo. Konec nevtralizacije pokaže prva trajna rožnata barva; šele nato računaš.

<<RACUN
kemija: Mg(OH)2 + 2 HCl -> MgCl2 + 2 H2O
kemija: HCl + NaOH -> NaCl + H2O
kemija: H2SO4 + 2 KOH -> K2SO4 + 2 H2O
kemija: 2 HNO3 + Ca(OH)2 -> Ca(NO3)2 + 2 H2O
kemija: H3PO4 + 3 NaOH -> Na3PO4 + 3 H2O
kemija: Mg + 2 HCl -> MgCl2 + H2
kemija: CaCO3 + 2 HCl -> CaCl2 + H2O + CO2
kemija: 2 NaHCO3 + H2SO4 -> Na2SO4 + 2 H2O + 2 CO2
kemija: H2SO4 + 2 NaOH -> Na2SO4 + 2 H2O
molska: HCl | 36.5
molska: NaOH | 40
molska: NaCl | 58.5
molska: H2SO4 | 98
molska: NaHCO3 | 84
vrednost: 0.0365*50/36.5 | 0.05
vrednost: 0.05*40/0.04 | 50
vrednost: 0.05*58.5/(50+50) | 0.02925
vrednost: 4.9/98*2*84 | 8.4
vrednost: 9.8/98*2*40 | 8
>>

:::simboli
n | množina snovi | n = \frac{m}{M} | mol
m | masa snovi | m = n \cdot M | g
M | molska masa | | g/mol
m_{\mathrm{t}} | masa topljenca (kisline ali baze v raztopini) | m_{\mathrm{t}} = w \cdot m_{\mathrm{r}} | g
m_{\mathrm{r}} | masa raztopine | | g
w | masni delež | w = \frac{m_{\mathrm{t}}}{m_{\mathrm{r}}} | –
:::
