---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V začetku 17. stoletja je zdravnik Santorio Santorio v Padovi iskal način, kako bi vročino bolnika izmeril, namesto da bi jo le otipal z dlanjo. Uporabil je termoskop: stekleno bučko z zrakom in dolgo cevko, v kateri je stala tekočina. Ko je bolnik bučko grel z rokami ali usti, se je zrak v njej razširil in gladina v cevki se je premaknila. Toplejši bolnik je pomenil večji premik.

Kasneje so zrak zamenjali z živim srebrom ali alkoholom, cevko pa so opremili z lestvico. Ideja je ostala ista: **temperaturo preberemo kot dolžino**, ker se snov pri segrevanju razširi. Zato je prav, da znamo izračunati, za koliko.

Isti pojav zdravnike in inženirje skrbi tudi drugje. Zobna zalivka se ob vročem čaju razširi drugače kot zob. Kovinski vsadek v kosti je v telesu toplejši kot v operacijski dvorani. Kako velike so te spremembe in od česa so odvisne?

## Razlaga

**Temperatura v kelvinih.** V fiziki temperaturo pogosto pišemo v kelvinih: $T = t + 273\,\mathrm{K}$, kjer je $t$ temperatura v stopinjah Celzija. Razlika temperatur je v obeh lestvicah enaka: segrevanje z $20\,^\circ\mathrm{C}$ na $37\,^\circ\mathrm{C}$ je sprememba $\Delta T = 17\,\mathrm{K}$. Pri raztezanju šteje le ta sprememba, ne sama temperatura.

**Najprej en primer.** Kirurg zlomljeno kost pritrdi z jekleno ploščico, dolgo $12\,\mathrm{cm}$. Pred posegom je ploščica v dvorani pri $20\,^\circ\mathrm{C}$, v telesu pa se segreje na $37\,^\circ\mathrm{C}$. Iz laboratorija vemo: palica iz enakega jekla, dolga $1\,\mathrm{m}$, se pri segrevanju za $1\,\mathrm{K}$ podaljša za $0{,}012\,\mathrm{mm}$.

Sklepamo v dveh korakih. Če se en meter pri $1\,\mathrm{K}$ podaljša za $0{,}012\,\mathrm{mm}$, se pri $17\,\mathrm{K}$ podaljša $17$-krat več. Ploščica pa je dolga le $0{,}12$ metra, zato je njen podaljšek le $0{,}12$-krat tolikšen:

| dolžina | segrevanje | podaljšek |
|---|---|---|
| $1\,\mathrm{m}$ | $1\,\mathrm{K}$ | $0{,}012\,\mathrm{mm}$ |
| $1\,\mathrm{m}$ | $17\,\mathrm{K}$ | $0{,}204\,\mathrm{mm}$ |
| $0{,}12\,\mathrm{m}$ | $17\,\mathrm{K}$ | $0{,}024\,\mathrm{mm}$ |

Ploščica se v telesu podaljša za približno $0{,}024\,\mathrm{mm}$, kar je manj od debeline lasu.

**Splošno pravilo.** Primer pokaže tri stvari. Podaljšek je sorazmeren z začetno dolžino $L_0$ in s spremembo temperature $\Delta T$. Odvisen je tudi od snovi. Snov opiše **linearni razteznostni koeficient** $\alpha$: relativni podaljšek (podaljšek, deljen z začetno dolžino) pri segrevanju za $1\,\mathrm{K}$. Za naše jeklo je $\alpha = 12 \cdot 10^{-6}\,\mathrm{K^{-1}}$, ker je $0{,}012\,\mathrm{mm}$ dvanajst milijonink metra. Podaljšek $\Delta L$ je potem

$$\Delta L = \alpha L_0 \Delta T$$

Nova dolžina je začetna dolžina skupaj s podaljškom:

$$L = L_0 (1 + \alpha \Delta T)$$

Enota $\mathrm{K^{-1}}$ (»na kelvin«) pove, da se $\alpha$ nanaša na en kelvin spremembe. Pri ohlajanju je $\Delta T$ negativna in telo se skrči.

| snov | $\alpha$ [$10^{-6}\,\mathrm{K^{-1}}$] | kje |
|---|---|---|
| titan | $8{,}6$ | vsadki v kosteh |
| steklo | $9$ | termometri, ampule |
| zobna sklenina | $11$ | zob |
| jeklo | $12$ | kirurški instrumenti |
| aluminij | $23$ | bergle, vozički |
| amalgam | $25$ | zalivke |

:::premisli
Zakaj zobozdravnik ne bi smel izbrati zalivke, ki ima $\alpha$ mnogo večji od sklenine, čeprav je sicer trdna in obstojna?
---
Ob vročem čaju bi se zalivka razširila bolj kot zob in pritiskala na steno. Ob sladoledu bi se skrčila bolj kot zob, zato bi ob robu nastala reža. Ponavljanje teh sprememb zalivko zrahlja, v režo pa zaidejo bakterije.
:::

**Zakaj se snov razširi.** Delci v trdnini nihajo okoli svojih leg. Pri višji temperaturi nihajo močneje in so v povprečju malo bolj narazen. Vsak razmik med sosednjima delcema se poveča le za droben del, a palica ima ogromno delcev v vrsti. Zato daljša palica pridobi več.

V simulaciji spodaj (»Temperaturno raztezanje«) nastavi $L_0 = 1\,\mathrm{m}$ in $\Delta T = 100\,\mathrm{K}$, nato zamenjaj aluminij z invarjem (zlitino železa in niklja). Opazuj, da se invar skoraj ne podaljša. Zato iz njega delajo natančna merila.

**Prostorninsko raztezanje.** Telo se razširi v vse smeri, ne le v dolžino. Vzemimo jekleno kocko in jo segrejmo za $100\,\mathrm{K}$. Vsak rob se poveča za faktor $1 + \alpha \Delta T = 1{,}0012$. Prostornina kocke je rob na tretjo, zato se poveča za faktor $1{,}0012^3 \approx 1{,}0036$. To je skoraj natanko $1 + 3 \cdot 0{,}0012$: prostornina zraste trikrat toliko kot posamezni rob. Za spremembo prostornine $\Delta V$ zapišemo

$$\Delta V = \beta V_0 \Delta T$$

Tu je $V_0$ začetna prostornina, $\beta$ pa **prostorninski razteznostni koeficient**. Za trdnine velja $\beta \approx 3\alpha$. Votel prostor v telesu (luknja v plošči, notranjost steklene bučke) se pri segrevanju poveča, kot da bi bil napolnjen z isto snovjo.

Kapljevine nimajo lastne oblike, zato zanje navajamo le $\beta$. Za vodo pri sobni temperaturi je $\beta \approx 2{,}1 \cdot 10^{-4}\,\mathrm{K^{-1}}$, za živo srebro $1{,}8 \cdot 10^{-4}\,\mathrm{K^{-1}}$, za alkohol $1{,}1 \cdot 10^{-3}\,\mathrm{K^{-1}}$. Kapljevine se torej raztezajo precej bolj kot trdnine.

:::premisli
V termometru se ob segrevanju razširi tudi steklena bučka, v kateri je alkohol. Oceni, kolikokrat bolj se razteza alkohol kot steklo. Ali bo stolpec alkohola v cevki zato vseeno zrasel?
---
Bo. Za steklo je $\beta \approx 3 \cdot 9 \cdot 10^{-6}\,\mathrm{K^{-1}} = 2{,}7 \cdot 10^{-5}\,\mathrm{K^{-1}}$, za alkohol $1{,}1 \cdot 10^{-3}\,\mathrm{K^{-1}}$, kar je približno $40$-krat več. Bučka pridobi malo prostora, alkohol pa mnogo več prostornine, zato višek potisne v cevko.
:::

## Rešeni primeri

### Primer 1: titanov vsadek

Del kolčne proteze iz titana je pri $20\,^\circ\mathrm{C}$ dolg $15\,\mathrm{cm}$. Za koliko se podaljša, ko se v telesu segreje na $37\,^\circ\mathrm{C}$?

**Podatki:** $L_0 = 15\,\mathrm{cm} = 0{,}15\,\mathrm{m}$, $t_1 = 20\,^\circ\mathrm{C}$, $t_2 = 37\,^\circ\mathrm{C}$, $\alpha = 8{,}6 \cdot 10^{-6}\,\mathrm{K^{-1}}$
**Iščemo:** podaljšek $\Delta L$

:::formula
$\Delta L = \alpha L_0 \Delta T$
:::

**Rešitev:**

1. Sprememba temperature: $\Delta T = 37\,^\circ\mathrm{C} - 20\,^\circ\mathrm{C} = 17\,\mathrm{K}$, ker je razlika v kelvinih enaka kot v stopinjah.
2. Vstavimo: $\Delta L = 8{,}6 \cdot 10^{-6}\,\mathrm{K^{-1}} \cdot 0{,}15\,\mathrm{m} \cdot 17\,\mathrm{K} \approx 2{,}2 \cdot 10^{-5}\,\mathrm{m}$.
3. V milimetrih: $2{,}2 \cdot 10^{-5}\,\mathrm{m} = 0{,}022\,\mathrm{mm}$.
4. Odgovor: vsadek se podaljša za približno $0{,}022\,\mathrm{mm}$, kar kost brez težav prenese.

### Primer 2: zalivka in vroč čaj

Zalivka iz amalgama ima prostornino $20\,\mathrm{mm^3}$. Ko piješ vroč čaj, se zob segreje s $37\,^\circ\mathrm{C}$ na $57\,^\circ\mathrm{C}$. Za koliko se poveča prostornina zalivke in za koliko enaka prostornina sklenine? Za amalgam je $\alpha = 25 \cdot 10^{-6}\,\mathrm{K^{-1}}$, za sklenino $\alpha = 11 \cdot 10^{-6}\,\mathrm{K^{-1}}$.

**Podatki:** $V_0 = 20\,\mathrm{mm^3}$, $t_1 = 37\,^\circ\mathrm{C}$, $t_2 = 57\,^\circ\mathrm{C}$, amalgam $\alpha = 25 \cdot 10^{-6}\,\mathrm{K^{-1}}$, sklenina $\alpha = 11 \cdot 10^{-6}\,\mathrm{K^{-1}}$
**Iščemo:** povečanje prostornine $\Delta V$ za obe snovi in razliko

:::formula
$\Delta V = \beta V_0 \Delta T$, za trdnine $\beta \approx 3\alpha$
:::

**Rešitev:**

1. $\Delta T = 57\,^\circ\mathrm{C} - 37\,^\circ\mathrm{C} = 20\,\mathrm{K}$.
2. Obe snovi sta trdnini, zato $\beta \approx 3\alpha$: amalgam $\beta = 75 \cdot 10^{-6}\,\mathrm{K^{-1}}$, sklenina $\beta = 33 \cdot 10^{-6}\,\mathrm{K^{-1}}$.
3. Amalgam: $\Delta V = 75 \cdot 10^{-6}\,\mathrm{K^{-1}} \cdot 20\,\mathrm{mm^3} \cdot 20\,\mathrm{K} = 0{,}03\,\mathrm{mm^3}$.
4. Sklenina: $\Delta V = 33 \cdot 10^{-6}\,\mathrm{K^{-1}} \cdot 20\,\mathrm{mm^3} \cdot 20\,\mathrm{K} = 0{,}0132\,\mathrm{mm^3}$.
5. Razlika: $0{,}03\,\mathrm{mm^3} - 0{,}0132\,\mathrm{mm^3} = 0{,}0168\,\mathrm{mm^3}$.
6. Odgovor: zalivka se poveča za $0{,}03\,\mathrm{mm^3}$, sklenina le za $0{,}013\,\mathrm{mm^3}$. Zalivka ima ob vsakem vročem požirku okoli $0{,}017\,\mathrm{mm^3}$ »preveč« prostornine in pritiska na zob.

### Primer 3: kako velika naj bo bučka termometra

Alkoholni termometer za merjenje telesne temperature ima kapilaro (tanko cevko) s presekom $0{,}02\,\mathrm{mm^2}$. Stolpec naj se pri segrevanju za $1\,\mathrm{K}$ dvigne za $15\,\mathrm{mm}$, da je lestvica dobro berljiva. Kolikšna mora biti prostornina alkohola v bučki? Raztezanje stekla zanemari.

**Podatki:** $S = 0{,}02\,\mathrm{mm^2}$, $\Delta h = 15\,\mathrm{mm}$, $\Delta T = 1\,\mathrm{K}$, $\beta = 1{,}1 \cdot 10^{-3}\,\mathrm{K^{-1}}$ (alkohol)
**Iščemo:** začetno prostornino alkohola $V_0$

:::formula
$\Delta V = S \, \Delta h$, nato iz $\Delta V = \beta V_0 \Delta T$ izrazimo $V_0 = \dfrac{\Delta V}{\beta \, \Delta T}$
:::

**Rešitev:**

1. Višek alkohola zapolni del kapilare, ki je valj z osnovno ploskvijo $S$ in višino $\Delta h$: $\Delta V = 0{,}02\,\mathrm{mm^2} \cdot 15\,\mathrm{mm} = 0{,}3\,\mathrm{mm^3}$.
2. Ta višek nastane z raztezanjem alkohola v bučki, zato $V_0 = \dfrac{0{,}3\,\mathrm{mm^3}}{1{,}1 \cdot 10^{-3}\,\mathrm{K^{-1}} \cdot 1\,\mathrm{K}} \approx 273\,\mathrm{mm^3}$.
3. Preverimo smiselnost: $273\,\mathrm{mm^3}$ je približno $0{,}27\,\mathrm{cm^3}$, kar je kapljica, ki gre v majhno bučko.
4. Odgovor: v bučki mora biti okoli $0{,}27\,\mathrm{cm^3}$ alkohola. Steklo smemo zanemariti, ker se razteza $40$-krat manj.

### Primer 4: zdaj ti

Aluminijasta bergla je dolga $1{,}2\,\mathrm{m}$. Čez noč je ostala v avtu pri $-10\,^\circ\mathrm{C}$, nato jo pacient prinese v bolnišnico, kjer je $22\,^\circ\mathrm{C}$. Za koliko se podaljša?

**Podatki:** $L_0 = 1{,}2\,\mathrm{m}$, $t_1 = -10\,^\circ\mathrm{C}$, $t_2 = 22\,^\circ\mathrm{C}$, $\alpha = 23 \cdot 10^{-6}\,\mathrm{K^{-1}}$
**Iščemo:** podaljšek $\Delta L$

:::formula
$\Delta L = \alpha L_0 \Delta T$
:::

**Rešitev:**

1. Sprememba temperature: $\Delta T = 22\,^\circ\mathrm{C} - (-10\,^\circ\mathrm{C}) = 32\,\mathrm{K}$. Pazi na minus: odštevanje negativne temperature je prištevanje.
2. Vstavi podatke v formulo in rezultat pretvori v milimetre.

:::premisli
Koliko je $\Delta L$?
---
$\Delta L = 23 \cdot 10^{-6}\,\mathrm{K^{-1}} \cdot 1{,}2\,\mathrm{m} \cdot 32\,\mathrm{K} \approx 8{,}8 \cdot 10^{-4}\,\mathrm{m}$, to je približno $0{,}88\,\mathrm{mm}$.
:::

## Pogoste napake

- **K spremembi temperature prišteješ $273$.** Učenec pomisli »v fiziki vedno kelvini« in namesto $\Delta T = 17\,\mathrm{K}$ vstavi $290\,\mathrm{K}$. Napačno je, ker se $273$ pri odštevanju temperatur odšteje: razlika je v obeh lestvicah enaka. Pri raztezanju vstavi razliko, ne temperature same.
- **Za prostornino vzameš $\alpha$.** Ker je v tabeli le $\alpha$, ga učenec vstavi v $\Delta V = \beta V_0 \Delta T$. Telo pa raste v treh smereh, zato je za trdnine $\beta \approx 3\alpha$. Brez faktorja $3$ dobiš trikrat premajhno spremembo prostornine.
- **Luknja se pri segrevanju zoži.** Zdi se, da snov, ki se razteza, »zalije« luknjo. V resnici se razmiki med vsemi delci povečajo, tudi okoli luknje, zato se luknja poveča, kot da bi bila iz iste snovi. Zato se kovinski pokrov stekleničke lažje odvije pod toplo vodo.
- **$\Delta L$ zamenjaš z novo dolžino $L$.** Učenec izračuna $\alpha L_0 \Delta T$ in to zapiše kot dolžino palice. To je le podaljšek, ki je v primerjavi z $L_0$ drobcen. Nova dolžina je $L = L_0 + \Delta L$.
- **Pozabiš na $10^{-6}$.** Če vstaviš $\alpha = 12$ namesto $12 \cdot 10^{-6}\,\mathrm{K^{-1}}$, dobiš podaljšek, daljši od same palice. Rezultat vedno primerjaj z $L_0$: podaljšek trdnine je skoraj vedno pod odstotkom.

## Povzetek

- Pri segrevanju se delci bolj oddaljijo, zato se telo razširi; pri ohlajanju se skrči.
- Linearno raztezanje: $\Delta L = \alpha L_0 \Delta T$, nova dolžina $L = L_0 (1 + \alpha \Delta T)$; $\alpha$ v $\mathrm{K^{-1}}$, za trdnine reda $10^{-5}\,\mathrm{K^{-1}}$.
- Prostorninsko raztezanje: $\Delta V = \beta V_0 \Delta T$; za trdnine $\beta \approx 3\alpha$, kapljevine imajo le $\beta$ in se raztezajo bolj.
- $\Delta T$ je razlika temperatur; v kelvinih in stopinjah Celzija je enaka ($T = t + 273\,\mathrm{K}$).
- Luknje in votline se pri segrevanju povečajo. Snovi z različnima $\alpha$ (zalivka in zob) se raztezata različno.

## Drugače: Z analogijo

Predstavljaj si vrsto ljudi, ki stojijo z rameni skupaj. Na znak vsak začne zibati z rokami levo in desno. Da se ne zadevajo, se vsak odmakne za nekaj centimetrov od soseda.

- Bolj ko zibajo (višja temperatura), bolj se razmaknejo. To je $\Delta T$.
- Daljša vrsta se podaljša bolj, ker vsak človek doda svoj delček. To je $L_0$.
- Nekateri potrebujejo več prostora kot drugi (različna snov). To je $\alpha$.

Če ljudje stojijo v gneči na trgu, se razmaknejo v vse smeri, ne le v eno. Trg postane tesen hitreje kot vrsta: to je prostorninsko raztezanje s približno trikrat večjim koeficientom. Primerjava ima mejo: delci v trdnini se ne premikajo prosto, ampak nihajo okoli stalnih leg.

## Drugače: Bolj natančno

Iz $L = L_0 (1 + \alpha \Delta T)$ za vsak rob kocke dobimo $V = V_0 (1 + \alpha \Delta T)^3$. Ko potenco razvijemo:

$$V = V_0 \left(1 + 3\alpha \Delta T + 3\alpha^2 \Delta T^2 + \alpha^3 \Delta T^3\right)$$

Ker je $\alpha \Delta T$ tipično okoli $10^{-3}$, je $\alpha^2 \Delta T^2$ reda $10^{-6}$ in ga zanemarimo. Ostane $\beta \approx 3\alpha$.

Koeficienta nista povsem stalna: z naraščanjem temperature se malo spreminjata, zato so vrednosti v tabelah podane za sobno temperaturo. Najbolj izstopa voda: med $0\,^\circ\mathrm{C}$ in $4\,^\circ\mathrm{C}$ se pri segrevanju skrči ($\beta$ je tam negativen) in ima pri $4\,^\circ\mathrm{C}$ največjo gostoto. Zato jezera zmrzujejo od zgoraj navzdol.

Če telesu raztezanje preprečimo (vpeta tirnica, zalivka v trdni steni zoba), se pojavi velika sila. Zato imajo mostovi dilatacijske reže, zobozdravniki pa iščejo materiale z $\alpha$, čim bližjim sklenini. Natančneje je $T = t + 273{,}15\,\mathrm{K}$, za račune pa zadošča $273$.

## Preveri se

? Trije pojavi so posledica temperaturnega raztezanja, eden ne. Kateri ne sodi zraven?
- Med betonskimi deli mostu so ozke reže.
~ Reže so tam prav zaradi raztezanja: poleti se deli mostu podaljšajo in brez rež bi se zvili.
- Stolpec alkohola v termometru se pri vročini dvigne.
~ Termometer deluje na raztezanju: alkohol se razširi bolj kot steklena bučka.
+ Kocka ledu v kozarcu soka se stopi.
- Zalivka lahko po letih vročih in mrzlih napitkov odstopi od zoba.
~ Odstop je posledica različnega raztezanja zalivke in sklenine, torej sodi zraven.
> Taljenje je sprememba agregatnega stanja, ne raztezanje. Druge tri pojave povzroči sprememba dolžine ali prostornine pri spremembi temperature.

? Jeklena palica ($\alpha = 12 \cdot 10^{-6}\,\mathrm{K^{-1}}$) je dolga $2\,\mathrm{m}$. Za koliko se podaljša pri segrevanju z $20\,^\circ\mathrm{C}$ na $70\,^\circ\mathrm{C}$?
- $7{,}8\,\mathrm{mm}$
~ Tu je k spremembi temperature prišteto $273$. Razlika je v kelvinih enaka kot v stopinjah: $\Delta T = 50\,\mathrm{K}$.
+ $1{,}2\,\mathrm{mm}$
- $1200\,\mathrm{m}$
~ Pozabljen je faktor $10^{-6}$. Podaljšek, daljši od palice, je očitno nemogoč.
> $\Delta L = 12 \cdot 10^{-6}\,\mathrm{K^{-1}} \cdot 2\,\mathrm{m} \cdot 50\,\mathrm{K} = 1{,}2 \cdot 10^{-3}\,\mathrm{m} = 1{,}2\,\mathrm{mm}$.

? Zalivka ima večji $\alpha$ kot sklenina. Kaj se zgodi, ko poješ sladoled?
- Zalivka in zob se skrčita enako, saj imata enako temperaturo.
~ Enaka sprememba temperature še ne pomeni enakega skrčka: ta je odvisen tudi od $\alpha$.
+ Zalivka se skrči bolj kot zob, zato ob robu nastane drobna reža.
- Zalivka se razširi, ker hlad stisne zob okoli nje.
~ Pri ohlajanju se obe snovi skrčita, nobena se ne razširi. Razlika je le v tem, koliko.
> Pri ohlajanju je $\Delta T$ negativen. Večji $\alpha$ pomeni večji skrček, zato zalivka odstopi od stene zoba.

? Učenec računa, za koliko se poveča prostornina jeklene krogle ($V_0 = 10\,\mathrm{cm^3}$, $\alpha = 12 \cdot 10^{-6}\,\mathrm{K^{-1}}$) pri segrevanju za $100\,\mathrm{K}$. (1) Iz tabele vzame $\alpha$. (2) Zapiše $\beta = \alpha = 12 \cdot 10^{-6}\,\mathrm{K^{-1}}$. (3) Izračuna $\Delta V = \beta V_0 \Delta T$. Kateri korak je napačen?
- korak (1)
~ Vrednost $\alpha$ za jeklo je pravilna; težava je v tem, kaj z njo naredi.
+ korak (2)
- korak (3)
~ Formula $\Delta V = \beta V_0 \Delta T$ je pravilna, le vanjo vstavi napačen $\beta$.
- Noben, račun je pravilen.
~ Krogla se razširi v vse tri smeri, zato prostorninski koeficient ni enak linearnemu.
> Za trdnine je $\beta \approx 3\alpha = 36 \cdot 10^{-6}\,\mathrm{K^{-1}}$. Pravilno je $\Delta V = 36 \cdot 10^{-6}\,\mathrm{K^{-1}} \cdot 10\,\mathrm{cm^3} \cdot 100\,\mathrm{K} = 0{,}036\,\mathrm{cm^3}$.

? Kovinskega pokrovčka steklenice z zdravilom ne moreš odviti. Kaj ti najbolj pomaga?
- Steklenico za nekaj minut postaviš v hladilnik.
~ Pri ohlajanju se kovina skrči bolj kot steklo, zato pokrovček oprime grlo še močneje.
- Le pokrovček za hip ohladiš z ledeno kocko, ker se njegova odprtina pri ohlajanju razširi.
~ Odprtina se obnaša, kot da bi bila iz iste kovine: pri ohlajanju se skrči, pri segrevanju poveča.
+ Pokrovček za kratek čas držiš pod toplo vodo.
> Kovina ima večji $\alpha$ kot steklo. Pokrovček se segreje prvi in razširi bolj, njegova odprtina se poveča, zato se ohlapneje prilega grlu.

:::simboli
\Delta L | podaljšek | \Delta L = \alpha L_0 \Delta T | m
\alpha | linearni razteznostni koeficient | \alpha = \frac{\Delta L}{L_0 \Delta T} | K^{-1} | za trdnine reda $10^{-5}\,\mathrm{K^{-1}}$
L_0 | začetna dolžina | | m
\Delta T | sprememba temperature | | K | enaka v K in °C
L | nova dolžina | L = L_0 (1 + \alpha \Delta T) | m
\Delta V | sprememba prostornine | \Delta V = \beta V_0 \Delta T | m^3
\beta | prostorninski razteznostni koeficient | \beta = \frac{\Delta V}{V_0 \Delta T} | K^{-1} | za trdnine $\beta \approx 3\alpha$
V_0 | začetna prostornina | | m^3
V | nova prostornina | V = V_0 + \Delta V | m^3
S | presek kapilare | | m^2
\Delta h | dvig stolpca v kapilari | \Delta h = \frac{\Delta V}{S} | m
:::
