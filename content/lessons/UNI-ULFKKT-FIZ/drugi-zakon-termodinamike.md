---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Telefon je med igranjem igrice segret na okoli $35\,^\circ\mathrm{C}$ ($308\,\mathrm{K}$), zrak v sobi ima $20\,^\circ\mathrm{C}$ ($293\,\mathrm{K}$). Bi lahko to odpadno toploto spet spremenil v elektriko za baterijo? Prvi zakon termodinamike temu ne nasprotuje, saj zahteva le ohranitev energije; ne pove pa, **v katero smer** procesi tečejo sami od sebe. Drugi zakon pove, da noben **toplotni stroj** ne pretvori vse prejete toplote v delo: tudi idealen bi med tema temperaturama dal največ $1 - 293/308 \approx 5\,\%$, in ta meja, **Carnotov izkoristek**, je odvisna le od temperatur obeh rezervoarjev. Isti zakon pojasni, zakaj se topla kava v sobi ohladi in se črnilo v vodi razleze, nikoli pa obratno, to **nepovratnost** pa izmeri z novo funkcijo stanja, **entropijo**. Meja velja za elektrarne, motorje z notranjim zgorevanjem, hladilnike in toplotne črpalke, entropija pa v kemiji skupaj z entalpijo odloča, ali reakcija poteče sama od sebe.

## Razlaga

Drugi zakon je najlaže razumeti ob prvem, ki ga že poznaš. Oba govorita o istih toplotah in delih, odgovarjata pa na različni vprašanji:

| | Prvi zakon | Drugi zakon |
|---|---|---|
| Vprašanje | Ali se energija ohrani? | V katero smer proces teče sam od sebe? |
| Topla kava se v sobi ohladi | dovoljeno | dovoljeno |
| Kava se sama segreje na račun hladnejšega zraka | dovoljeno (energija je ohranjena) | prepovedano |
| Toplotni stroj | delo je prejeta toplota minus oddana | del toplote mora vedno oditi v hladni rezervoar, zato izkoristek ni nikoli $100\,\%$ in ne preseže Carnotovega |
| Ključna funkcija stanja | notranja energija | entropija $S$ |

Spodnji razdelki desni stolpec razložijo korak za korakom.

### Smer procesov

**1. Povratne in nepovratne spremembe.** Sprememba je **povratna (reverzibilna)**, če jo lahko z neskončno majhno spremembo pogojev obrnemo tako, da se v začetno stanje vrneta sistem **in** okolica. Takšne spremembe so idealizacija: potekajo neskončno počasi, prek samih ravnovesnih stanj, brez trenja in brez prenosa toplote ob končni temperaturni razliki. Vsi resnični procesi (trenje, mešanje, prevajanje toplote, kemijske reakcije, prosta ekspanzija plina) so **nepovratni**.

**2. Dve klasični obliki drugega zakona.**

- **Clausiusova:** toplota sama od sebe ne prehaja s hladnejšega telesa na toplejše. (Hladilnik to zmore le, če mu dovajamo delo.)
- **Kelvin-Planckova:** ni mogoče sestaviti stroja, ki bi pri krožni spremembi prejemal toploto iz enega samega rezervoarja in jo v celoti pretvarjal v delo.

Obe obliki sta enakovredni: iz kršitve ene bi lahko sestavili napravo, ki krši drugo. *Dokaz ene smeri.* Denimo, da stroj K krši Kelvin-Planckovo obliko: iz toplega rezervoarja prejme toploto $Q$ in jo v celoti spremeni v delo $A' = Q$. S tem delom poganjamo hladilnik, ki iz hladnega rezervoarja odvzame $Q_2$ in toplemu odda $Q_2 + Q$. Topli rezervoar skupno prejme $Q_2 + Q - Q = Q_2$, zato skupna naprava brez dovedenega dela prenese toploto $Q_2$ s hladnega na topli rezervoar, kar krši Clausiusovo obliko. Drugo smer dokažeš v Nalogi 2.

### Stroji med dvema rezervoarjema

**3. Toplotni stroj.** Toplotni stroj deluje v ciklu. V vsakem ciklu iz toplega rezervoarja pri temperaturi $T_1$ prejme toploto $Q_1$, hladnemu rezervoarju pri $T_2$ odda toploto $Q_2$ (tu sta $Q_1$ in $Q_2$ pozitivni velikosti), opravi pa delo $A' = Q_1 - Q_2$ (prvi zakon za cikel). **Izkoristek** je

$$\eta = \frac{A'}{Q_1} = 1 - \frac{Q_2}{Q_1}.$$

Po Kelvin-Planckovi obliki je $Q_2 > 0$ in zato vedno $\eta < 1$.

**4. Carnotov cikel in Carnotov izkoristek.** Carnotov cikel je povratni cikel idealnega plina iz dveh izoterm in dveh adiabat: izotermno razširjanje pri $T_1$ (plin prejme $Q_1$), adiabatno razširjanje do $T_2$, izotermno stiskanje pri $T_2$ (plin odda $Q_2$) in adiabatno stiskanje nazaj do $T_1$. *Izpeljava.* Prostornine v ogliščih cikla so po vrsti $V_1, V_2, V_3, V_4$. Na izotermah se notranja energija idealnega plina ne spremeni, zato $Q_1 = nRT_1\ln(V_2/V_1)$ in $Q_2 = nRT_2\ln(V_3/V_4)$. Na adiabatah velja $TV^{\kappa-1} = \text{konst.}$: $T_1V_2^{\kappa-1} = T_2V_3^{\kappa-1}$ in $T_1V_1^{\kappa-1} = T_2V_4^{\kappa-1}$. Deljenje enačb da $V_2/V_1 = V_3/V_4$, zato $Q_2/Q_1 = T_2/T_1$ in

$$\eta_C = 1 - \frac{T_2}{T_1}.$$

**Carnotov izrek:** naj stroja X in C delujeta med istima rezervoarjema s temperaturama $T_1 > T_2$. Če je C povraten, potem je $\eta_X \le \eta_C$; če sta povratna oba, je $\eta_X = \eta_C = 1 - T_2/T_1$, ne glede na delovno snov.

*Dokaz.* Denimo, da je $\eta_X > \eta_C$. Stroja naj v ciklu opravita enako delo $A'$; X prejme toploto $Q_{1X} = A'/\eta_X$, C pa $Q_{1C} = A'/\eta_C > Q_{1X}$. Z delom stroja X poganjamo C obratno, kot hladilnik. Skupna naprava ne prejme dela, toplemu rezervoarju pa odda toploto $Q_{1C} - Q_{1X} > 0$, ki jo po prvem zakonu vzame hladnemu. To krši Clausiusovo obliko, zato $\eta_X \le \eta_C$. Če je povraten tudi X, vlogi zamenjamo in dobimo še $\eta_C \le \eta_X$. Ker so vsi povratni stroji enako dobri, velja $\eta_C$, izračunan za idealni plin, za vsako delovno snov.

Izkoristek je tem večji, čim manjše je razmerje $T_2/T_1$. Temperature morajo biti v kelvinih.

:::premisli
Stroj deluje med $600\,\mathrm{K}$ in $300\,\mathrm{K}$. Kaj bolj poveča Carnotov izkoristek: topli rezervoar segreti za $100\,\mathrm{K}$ ali hladnega ohladiti za $100\,\mathrm{K}$?
---
Ohladiti hladnega: $1 - 200/600 \approx 67\,\%$, segreti toplega pa le $1 - 300/700 \approx 57\,\%$. Izkoristek je odvisen od razmerja $T_2/T_1$, ki se bolj spremeni, če spremenimo manjšo temperaturo. V praksi je hladni rezervoar okolica (reka, zrak), ki je ne moremo ohladiti, zato elektrarne višajo $T_1$.
:::

**5. Hladilnik in toplotna črpalka.** Če cikel obrnemo, stroj z dovedenim delom $A$ črpa toploto $Q_2$ iz hladnega in odda $Q_1 = Q_2 + A$ toplemu rezervoarju.

- **Hladilno število** hladilnika: $\varepsilon_h = Q_2/A$, največ $\dfrac{T_2}{T_1 - T_2}$.
- **Grelno število** toplotne črpalke: $\varepsilon_g = Q_1/A$, največ $\dfrac{T_1}{T_1 - T_2}$.

Najvišji vrednosti (po razmisleku kot pri Carnotovem izreku) da povratni (obrnjeni Carnotov) cikel, za katerega velja $Q_2/Q_1 = T_2/T_1$: $\varepsilon_h = \dfrac{Q_2}{Q_1 - Q_2} = \dfrac{T_2}{T_1 - T_2}$ in $\varepsilon_g = \dfrac{Q_1}{A} = \varepsilon_h + 1$. Obe števili sta lahko večji od $1$: z $1\,\mathrm{kJ}$ dela lahko v hišo prečrpamo več kot $1\,\mathrm{kJ}$ toplote.

### Entropija in njen pomen

**6. Entropija.** Pri Carnotovem ciklu iz $Q_2/Q_1 = T_2/T_1$ sledi $Q_1/T_1 - Q_2/T_2 = 0$. Količina »prejeta toplota, deljena s temperaturo« se v povratnem ciklu sešteje v nič. To je znak, da obstaja funkcija stanja. **Definicija:** naj sistem preide iz ravnovesnega stanja 1 v ravnovesno stanje 2 po povratni poti, na kateri pri temperaturi $T$ prejme toploto $\delta Q_{\text{rev}}$. Sprememba **entropije** $S$ (enota $\mathrm{J/K}$) je

$$\Delta S = \int_1^2\frac{\delta Q_{\text{rev}}}{T}.$$

Da je integral za vse povratne poti enak, sledi iz Clausiusove neenakosti (»Bolj natančno«). Ker je entropija funkcija stanja, je $\Delta S$ odvisna le od začetnega in končnega stanja. Pri nepovratni spremembi jo izračunamo tako, da si zamislimo **katero koli** povratno pot med istima stanjema. Pogosti primeri:

- **izotermna sprememba** (taljenje, izparevanje, izotermno razširjanje): $\Delta S = Q/T$,
- **segrevanje** s stalno specifično toploto: $\delta Q_{\text{rev}} = mc\,\mathrm{d}T$, zato $\Delta S = \int_{T_1}^{T_2}\dfrac{mc\,\mathrm{d}T}{T} = mc\ln\dfrac{T_2}{T_1}$ (oziroma $nC\ln\frac{T_2}{T_1}$),
- **idealni plin**: po prvem zakonu je $\delta Q_{\text{rev}} = nC_V\,\mathrm{d}T + p\,\mathrm{d}V$ s $p = nRT/V$; deljenje s $T$ in integriranje da $\Delta S = nC_V\ln\dfrac{T_2}{T_1} + nR\ln\dfrac{V_2}{V_1}$.

**7. Drugi zakon z entropijo (načelo naraščanja entropije).** Če je sistem toplotno izoliran, potem pri vsaki spremembi velja

$$\Delta S_{\text{izol}} \ge 0,$$

enačaj pa natanko pri povratnih spremembah. *Dokaz (skica).* Iz Carnotovega izreka sledi Clausiusova neenakost $\Delta S \ge \int_1^2\delta Q/T$; v izoliranem sistemu je $\delta Q = 0$. Entropija sistema se lahko tudi zmanjša, a le, če se entropija okolice poveča vsaj za toliko. Skupna entropija sistema in okolice se pri vsakem resničnem procesu poveča. Pri prehodu toplote $Q$ s telesa pri $T_1$ na telo pri $T_2 < T_1$ je $\Delta S = Q/T_2 - Q/T_1 > 0$, kar je Clausiusova oblika v jeziku entropije.

:::premisli
Voda v zamrzovalniku zmrzne in njena entropija se zmanjša. Ali to krši drugi zakon?
---
Ne. Voda ni izoliran sistem: toploto, ki jo odda pri zmrzovanju, zamrzovalnik z dovedenim delom prečrpa v kuhinjo, kjer je temperatura višja. Entropija kuhinje se poveča bolj, kot se zmanjša entropija vode, zato skupna entropija naraste.
:::

**8. Mikroskopski pomen.** Boltzmann je entropijo povezal s številom mikrostanj $\Omega$, ki dajo isto makroskopsko stanje: $S = k_B\ln\Omega$. Neurejeno stanje (plin, razporejen po vsej posodi) je mogoče doseči na neprimerno več načinov kot urejeno (ves plin v enem kotu), zato je veliko verjetnejše. Drugi zakon je v tem smislu statističen zakon.

## Rešeni primeri

### Primer 1 (lažji)

Inženirka Maja na preizkuševališču meri prototip toplotnega stroja. V vsakem ciklu iz toplega rezervoarja s temperaturo $600\,\mathrm{K}$ prejme $2{,}0\,\mathrm{kJ}$ toplote in hladnemu rezervoarju s temperaturo $300\,\mathrm{K}$ odda $1{,}4\,\mathrm{kJ}$ toplote. Koliko dela opravi v enem ciklu, kolikšen je njegov izkoristek in kako se primerja s Carnotovim? Za koliko se v enem ciklu spremeni entropija obeh rezervoarjev skupaj?

**Podatki:** $T_1 = 600\,\mathrm{K}$, $T_2 = 300\,\mathrm{K}$, $Q_1 = 2{,}0\,\mathrm{kJ}$, $Q_2 = 1{,}4\,\mathrm{kJ}$
**Iščemo:** delo $A'$, izkoristek $\eta$, Carnotov izkoristek $\eta_C$, spremembo entropije rezervoarjev $\Delta S$

:::formula
$A' = Q_1 - Q_2$, $\eta = \dfrac{A'}{Q_1}$, $\eta_C = 1 - \dfrac{T_2}{T_1}$, $\Delta S = -\dfrac{Q_1}{T_1} + \dfrac{Q_2}{T_2}$
:::

**Rešitev:**

1. Delovna snov se po ciklu vrne v začetno stanje, zato je po prvem zakonu delo razlika toplot: $A' = 2{,}0\,\mathrm{kJ} - 1{,}4\,\mathrm{kJ} = 0{,}60\,\mathrm{kJ}$.
2. Izkoristek je delež prejete toplote, ki postane delo: $\eta = 0{,}60/2{,}0 = 0{,}30 = 30\,\%$.
3. $\eta_C = 1 - 300/600 = 0{,}50 = 50\,\%$. Stroj torej ne krši drugega zakona, je pa nepovraten.
4. Topli rezervoar izgubi entropijo $2000\,\mathrm{J}/600\,\mathrm{K} \approx 3{,}33\,\mathrm{J/K}$, hladni jo pridobi $1400\,\mathrm{J}/300\,\mathrm{K} \approx 4{,}67\,\mathrm{J/K}$. Delovna snov je po ciklu v začetnem stanju ($\Delta S = 0$).
5. $\Delta S = -3{,}33\,\mathrm{J/K} + 4{,}67\,\mathrm{J/K} \approx +1{,}33\,\mathrm{J/K}$.
6. Odgovor: stroj v enem ciklu opravi $0{,}60\,\mathrm{kJ}$ dela z izkoristkom $30\,\%$, kar je manj od Carnotovega izkoristka $50\,\%$; entropija rezervoarjev se v vsakem ciklu poveča za približno $1{,}33\,\mathrm{J/K}$.

### Primer 2

$0{,}50\,\mathrm{kg}$ ledu pri $0\,^\circ\mathrm{C}$ se stali, nastala voda pa se segreje na $20\,^\circ\mathrm{C}$. Kolikšna je sprememba entropije vode? Talilna toplota ledu je $334\,\mathrm{kJ/kg}$, specifična toplota vode $4186\,\mathrm{J/(kg\,K)}$.

**Podatki:** $m = 0{,}50\,\mathrm{kg}$, $T_0 = 273{,}15\,\mathrm{K}$, $T_2 = 293{,}15\,\mathrm{K}$, $q_t = 334\,\mathrm{kJ/kg}$, $c = 4186\,\mathrm{J/(kg\,K)}$
**Iščemo:** spremembo entropije $\Delta S = \Delta S_1 + \Delta S_2$

:::formula
Taljenje (izotermno): $\Delta S_1 = \dfrac{mq_t}{T_0}$. Segrevanje: $\Delta S_2 = mc\ln\dfrac{T_2}{T_0}$.
:::

**Rešitev:**

1. Toplota za taljenje: $Q_1 = 0{,}50\,\mathrm{kg} \cdot 334\,\mathrm{kJ/kg} = 167\,\mathrm{kJ}$.
2. Taljenje poteka pri stalni temperaturi, zato toploto le delimo s $T_0$: $\Delta S_1 = 167\,000\,\mathrm{J}/273{,}15\,\mathrm{K} \approx 611\,\mathrm{J/K}$.
3. Pri segrevanju se temperatura spreminja, zato integriramo: $\Delta S_2 = 0{,}50 \cdot 4186 \cdot \ln(293{,}15/273{,}15)\,\mathrm{J/K} = 2093 \cdot 0{,}0707\,\mathrm{J/K} \approx 148\,\mathrm{J/K}$.
4. $\Delta S = 611\,\mathrm{J/K} + 148\,\mathrm{J/K} \approx 759\,\mathrm{J/K}$.
5. Odgovor: entropija vode se poveča za približno $759\,\mathrm{J/K}$, večino pri taljenju, ko se urejena kristalna mreža poruši.

### Primer 3 (težji)

V toplotno izolirani posodi zmešamo $1{,}0\,\mathrm{kg}$ vode pri $80\,^\circ\mathrm{C}$ in $0{,}20\,\mathrm{kg}$ ledu pri $0\,^\circ\mathrm{C}$. Kolikšna je končna temperatura in za koliko se spremeni skupna entropija? Toplotno kapaciteto posode zanemari, $c = 4186\,\mathrm{J/(kg\,K)}$, talilna toplota ledu je $334\,\mathrm{kJ/kg}$.

**Podatki:** $m_1 = 1{,}0\,\mathrm{kg}$ vode, $T_1 = 353{,}15\,\mathrm{K}$, $m_2 = 0{,}20\,\mathrm{kg}$ ledu, $T_0 = 273{,}15\,\mathrm{K}$, $c = 4186\,\mathrm{J/(kg\,K)}$, $q_t = 334\,\mathrm{kJ/kg}$, sistem je izoliran
**Iščemo:** končno temperaturo $T_k$ in spremembo entropije $\Delta S$

:::formula
$m_1c(T_1 - T_k) = m_2q_t + m_2c(T_k - T_0)$; $\Delta S = m_1c\ln\dfrac{T_k}{T_1} + \dfrac{m_2q_t}{T_0} + m_2c\ln\dfrac{T_k}{T_0}$
:::

**Rešitev:**

1. Ali se ves led stali? Za taljenje je treba $m_2q_t = 0{,}20 \cdot 334\,\mathrm{kJ} = 66{,}8\,\mathrm{kJ}$, topla voda pa bi pri ohladitvi na $0\,^\circ\mathrm{C}$ oddala $1{,}0 \cdot 4186 \cdot 80\,\mathrm{J} \approx 335\,\mathrm{kJ}$. Led se stali ves in $T_k > T_0$.
2. Posoda je izolirana, zato oddana toplota tople vode gre za taljenje in segrevanje staljene vode. Iz enačbe toplotnega ravnovesja izrazimo $T_k = \dfrac{m_1cT_1 - m_2q_t + m_2cT_0}{(m_1 + m_2)c}$ in vstavimo: $T_k = \dfrac{4186 \cdot 353{,}15 - 66\,800 + 837{,}2 \cdot 273{,}15}{1{,}20 \cdot 4186}\,\mathrm{K} \approx 326{,}5\,\mathrm{K}$ ($53{,}4\,^\circ\mathrm{C}$).
3. Proces je nepovraten, entropija pa je funkcija stanja, zato vsak del računamo po zamišljeni povratni poti. Topla voda se ohladi: $\Delta S_1 = 4186 \cdot \ln(326{,}52/353{,}15)\,\mathrm{J/K} \approx -328{,}2\,\mathrm{J/K}$.
4. Taljenje poteka pri stalni $T_0$: $\Delta S_2 = 66\,800\,\mathrm{J}/273{,}15\,\mathrm{K} \approx 244{,}6\,\mathrm{J/K}$.
5. Staljena voda se segreje: $\Delta S_3 = 0{,}20 \cdot 4186 \cdot \ln(326{,}52/273{,}15)\,\mathrm{J/K} \approx 149{,}4\,\mathrm{J/K}$.
6. Skupaj: $\Delta S = -328{,}2 + 244{,}6 + 149{,}4 \approx +65{,}8\,\mathrm{J/K}$. Led prejema toploto pri nižji temperaturi, kot jo topla voda oddaja, zato njegova entropija naraste bolj, kot entropija vode pade.
7. Odgovor: končna temperatura je približno $53\,^\circ\mathrm{C}$, skupna entropija pa se poveča za približno $66\,\mathrm{J/K}$. Ker je $\Delta S > 0$ v izoliranem sistemu, je proces nepovraten.

### Primer 4 – zdaj ti

Pozimi skozi steno hiše preide $1{,}0\,\mathrm{kJ}$ toplote iz sobe pri $20\,^\circ\mathrm{C}$ na zunanji zrak pri $-5\,^\circ\mathrm{C}$. Za koliko se pri tem spremeni skupna entropija sobe in zunanjega zraka? Soba in zunanji zrak sta tako velika, da se njuni temperaturi ne spremenita.

**Podatki:** $Q = 1{,}0\,\mathrm{kJ} = 1000\,\mathrm{J}$, $T_1 = 293{,}15\,\mathrm{K}$, $T_2 = 268{,}15\,\mathrm{K}$, temperaturi rezervoarjev sta stalni
**Iščemo:** spremembo skupne entropije $\Delta S$

:::formula
$\Delta S = -\dfrac{Q}{T_1} + \dfrac{Q}{T_2}$
:::

**Rešitev:**

1. Temperature pretvorimo v kelvine, ker $\Delta S = Q/T$ velja le z absolutno temperaturo.
2. Soba toploto odda pri stalni temperaturi, zato se njena entropija zmanjša za $Q/T_1$: $\Delta S_1 = -1000\,\mathrm{J}/293{,}15\,\mathrm{K} \approx -3{,}41\,\mathrm{J/K}$.
3. Zdaj ti: izračunaj spremembo entropije zunanjega zraka, ki isto toploto prejme pri $T_2$, in obe spremembi seštej.

:::premisli
Kolikšna je sprememba skupne entropije in kaj pove njen predznak?
---
$\Delta S_2 = 1000\,\mathrm{J}/268{,}15\,\mathrm{K} \approx 3{,}73\,\mathrm{J/K}$, skupaj $\Delta S \approx -3{,}41 + 3{,}73 = +0{,}32\,\mathrm{J/K}$. Skupna entropija naraste, ker zunanji zrak toploto prejme pri nižji temperaturi; prehod toplote s toplejšega na hladnejše je nepovraten.
:::

## Pogoste napake

- **Temperature v $^\circ\mathrm{C}$ v Carnotovem izkoristku.** $\eta_C = 1 - T_2/T_1$ velja le s temperaturami v kelvinih. Med $100\,^\circ\mathrm{C}$ in $20\,^\circ\mathrm{C}$ je $\eta_C = 1 - 293/373 \approx 21\,\%$, ne $80\,\%$.
- **Izkoristek $100\,\%$.** Tudi idealen stroj mora del toplote oddati hladnemu rezervoarju; $\eta = 1$ bi zahteval $T_2 = 0\,\mathrm{K}$.
- **$\Delta S = Q/T$ pri spreminjajoči se temperaturi.** Pri segrevanju je treba integrirati: $\Delta S = mc\ln(T_2/T_1)$.
- **Entropija se nikoli ne zmanjša.** Zmanjša se lahko entropija sistema (voda, ki zmrzne, hladilnik, rastoča celica); poveča se skupna entropija sistema in okolice.
- **Hladilno število ne more biti večje od 1.** Hladilnik prečrpa več toplote, kot porabi dela; to ni v nasprotju s prvim zakonom.
- **Entropija pri nepovratni spremembi z dejansko toploto.** Pri prosti ekspanziji plina je $Q = 0$, entropija pa vseeno naraste; $\Delta S$ izračunaš po zamišljeni povratni poti (izotermno razširjanje).

## Povzetek

- Drugi zakon: toplota sama od sebe teče le s toplejšega na hladnejše; noben ciklični stroj ne pretvori vse toplote iz enega rezervoarja v delo.
- Toplotni stroj: $A' = Q_1 - Q_2$, $\eta = 1 - Q_2/Q_1 \le \eta_C = 1 - T_2/T_1$.
- Hladilnik $\varepsilon_h = Q_2/A \le T_2/(T_1 - T_2)$; toplotna črpalka $\varepsilon_g = Q_1/A \le T_1/(T_1 - T_2)$.
- Entropija: $\Delta S = \int\delta Q_{\text{rev}}/T$; izotermno $Q/T$, segrevanje $mc\ln(T_2/T_1)$; funkcija stanja.
- V izoliranem sistemu $\Delta S \ge 0$; $S = k_B\ln\Omega$.

## Za izpit

Znati moraš povedati:

- definicijo povratne spremembe ter Clausiusovo in Kelvin-Planckovo obliko drugega zakona z dokazom njune enakovrednosti;
- izkoristek toplotnega stroja in izpeljavo Carnotovega izkoristka za idealni plin;
- Carnotov izrek s pogoji in dokazom;
- najvišje hladilno in grelno število ter njuno izpeljavo;
- definicijo entropije, izpeljavo $\Delta S$ pri segrevanju in za idealni plin, načelo naraščanja entropije s pogojem (izoliran sistem).

### Naloga 1

Med dvema telesoma, $1{,}0\,\mathrm{kg}$ vode pri $80\,^\circ\mathrm{C}$ in $1{,}0\,\mathrm{kg}$ vode pri $20\,^\circ\mathrm{C}$, deluje povratni toplotni stroj, dokler se temperaturi ne izenačita. Izračunaj končno temperaturo in največje delo, ki ga stroj lahko opravi. Primerjaj z neposrednim mešanjem obeh količin vode v izolirani posodi. $c = 4186\,\mathrm{J/(kg\,K)}$, toplotno kapaciteto stroja zanemari.

**Rešitev:**

1. Carnotovega izkoristka ne smemo uporabiti naravnost, ker se temperaturi teles med delovanjem spreminjata (na začetku je $\eta_C = 1 - 293{,}15/353{,}15 \approx 17\,\%$, na koncu nič).
2. Stroj je povraten in deluje v ciklih, zato se skupna entropija obeh teles ne spremeni: $mc\ln\dfrac{T_k}{T_1} + mc\ln\dfrac{T_k}{T_2} = 0$, torej $T_k^2 = T_1T_2$.
3. $T_k = \sqrt{353{,}15 \cdot 293{,}15}\,\mathrm{K} \approx 321{,}75\,\mathrm{K}$ ($48{,}6\,^\circ\mathrm{C}$).
4. Toplo telo odda $Q_1 = mc(T_1 - T_k) = 4186 \cdot 31{,}40\,\mathrm{J} \approx 131{,}4\,\mathrm{kJ}$, hladno prejme $Q_2 = mc(T_k - T_2) = 4186 \cdot 28{,}60\,\mathrm{J} \approx 119{,}7\,\mathrm{kJ}$.
5. Po prvem zakonu je delo $A' = Q_1 - Q_2 \approx 11{,}7\,\mathrm{kJ}$, skupni izkoristek pa $11{,}7/131{,}4 \approx 8{,}9\,\%$.
6. Pri neposrednem mešanju ni dela, končna temperatura je $50\,^\circ\mathrm{C}$, entropija pa naraste za $4186 \cdot \ln(323{,}15/353{,}15) + 4186 \cdot \ln(323{,}15/293{,}15) \approx 36{,}2\,\mathrm{J/K}$. Neizkoriščenih $11{,}7\,\mathrm{kJ}$ ostane v vodi kot notranja energija: $2 \cdot 4186 \cdot (323{,}15 - 321{,}75)\,\mathrm{J} \approx 11{,}7\,\mathrm{kJ}$.
7. Odgovor: s povratnim strojem je končna temperatura $48{,}6\,^\circ\mathrm{C}$ in največje delo okoli $11{,}7\,\mathrm{kJ}$; pri mešanju je končna temperatura $50\,^\circ\mathrm{C}$, dela ni, entropija pa naraste za $36\,\mathrm{J/K}$.

### Naloga 2

Natančno navedi Clausiusovo in Kelvin-Planckovo obliko drugega zakona in dokaži, da iz kršitve Clausiusove oblike sledi kršitev Kelvin-Planckove. Nato natančno navedi Carnotov izrek in utemelji, zakaj Carnotov izkoristek, izpeljan za idealni plin, velja za vsako delovno snov.

**Rešitev:**

1. Clausiusova oblika: toplota sama od sebe, brez dovedenega dela, ne prehaja s hladnejšega telesa na toplejše. Kelvin-Planckova: ni stroja, ki bi pri krožni spremembi prejemal toploto iz enega samega rezervoarja in jo v celoti pretvarjal v delo.
2. Denimo, da naprava D brez dela prenaša toploto $Q_2$ s hladnega rezervoarja na toplega.
3. Ob njej deluje navaden toplotni stroj, ki iz toplega rezervoarja prejme $Q_1$, hladnemu odda ravno $Q_2$ in opravi delo $A' = Q_1 - Q_2$.
4. Hladni rezervoar skupno ne izgubi ne pridobi ničesar, topli izgubi $Q_1 - Q_2$, ta toplota pa se v celoti pretvori v delo. Skupna naprava jemlje toploto enemu rezervoarju in jo v celoti pretvarja v delo, kar krši Kelvin-Planckovo obliko.
5. Carnotov izrek: med istima rezervoarjema s temperaturama $T_1 > T_2$ noben stroj nima večjega izkoristka od povratnega, vsi povratni stroji pa imajo enak izkoristek. Dokaz je v točki 4 razlage: stroj z večjim izkoristkom bi skupaj z obrnjenim povratnim strojem brez dela prenašal toploto s hladnega na topli rezervoar.
6. Ker imajo vsi povratni stroji med istima rezervoarjema enak izkoristek, je ta enak izkoristku Carnotovega cikla z idealnim plinom, $1 - T_2/T_1$, ne glede na snov.
7. Odgovor: obliki sta enakovredni (iz kršitve vsake sledi kršitev druge), $\eta_C = 1 - T_2/T_1$ pa je univerzalna zgornja meja za vse stroje med danima rezervoarjema.

## Drugače: Na sliki

Toplotni stroj je kot slap: toplota »pade« s toplega rezervoarja $T_1$ na hladnega $T_2$ in spotoma da delo $A' = Q_1 - Q_2$, del $Q_2$ pa mora vedno priteči na spodnji nivo. Pri hladilniku puščice obrnemo: delo $A$ vstopi, $Q_2$ teče iz hladnega rezervoarja, $Q_1 = Q_2 + A$ pa v toplega.

V diagramu $T(S)$ je Carnotov cikel pravokotnik: izotermi sta vodoravni, adiabati (entropija se ne spremeni) navpični. Ploščina pravokotnika je delo cikla, ploščina pod zgornjo stranico pa $Q_1$.

## Drugače: Uporaba v stroki

**Termoelektrarna.** Para v turbini ima okoli $550\,^\circ\mathrm{C}$ ($823\,\mathrm{K}$), kondenzator okoli $30\,^\circ\mathrm{C}$ ($303\,\mathrm{K}$). Carnotov izkoristek je $1 - 303/823 \approx 63\,\%$, resnične elektrarne dosežejo okoli $40\,\%$. Ostanek gre v reko, hladilni stolp ali daljinsko ogrevanje.

**Spontanost kemijskih reakcij.** Pri stalnih $p$ in $T$ je porast skupne entropije enakovreden pogoju, da se Gibbsova prosta entalpija zmanjša, $\Delta G = \Delta H - T\Delta S < 0$, zato endotermne reakcije z velikim porastom entropije potečejo pri višjih temperaturah.

**Ločevanje zraka.** Za popolno ločitev $1\,\mathrm{mol}$ zraka ($21\,\%$ $\mathrm{O_2}$, $79\,\%$ $\mathrm{N_2}$) pri $298\,\mathrm{K}$ je potrebno najmanj toliko dela, kolikor entropije pri mešanju nastane, pomnoženo s $T$. Ker se vsak plin pri mešanju izotermno razširi z $x_iV$ na $V$, je to $-RT\sum x_i\ln x_i \approx 1{,}27\,\mathrm{kJ}$ dela ($x_i$ so molski deleži, plina obravnavamo kot idealna).

## Drugače: Korak za korakom s številkami

Hladilnik pri $5\,^\circ\mathrm{C}$ v kuhinji s $25\,^\circ\mathrm{C}$ odvaja $150\,\mathrm{W}$ toplote, hladilno število je $3{,}0$. Kolikšno moč porabi, koliko toplote odda in kolikšna bi bila najmanjša možna moč?

1. **Kelvini:** $T_2 = 278{,}15\,\mathrm{K}$, $T_1 = 298{,}15\,\mathrm{K}$.
2. **Porabljena moč:** $P = \dot{Q}_2/\varepsilon_h = 150\,\mathrm{W}/3{,}0 = 50\,\mathrm{W}$.
3. **Toplota v kuhinjo:** $\dot{Q}_1 = \dot{Q}_2 + P = 150\,\mathrm{W} + 50\,\mathrm{W} = 200\,\mathrm{W}$. Hladilnik kuhinjo segreva.
4. **Idealno hladilno število:** $\varepsilon_{h,C} = 278{,}15/(298{,}15 - 278{,}15) \approx 13{,}9$.
5. **Najmanjša moč:** $P_{\min} = 150\,\mathrm{W}/13{,}9 \approx 10{,}8\,\mathrm{W}$.
6. **Pomen:** resnični hladilnik porabi skoraj petkrat več moči od idealnega zaradi nepovratnih procesov.

## Drugače: Bolj natančno

**Clausiusova neenakost.** Za vsak cikel velja $\oint\frac{\delta Q}{T} \le 0$, kjer je $T$ temperatura rezervoarja, s katerim sistem izmenjuje toploto; enačaj velja za povratne cikle. Iz enačaja sledi, da je $S$ funkcija stanja, iz neenačaja za cikel, sestavljen iz nepovratne poti $1 \to 2$ in povratne $2 \to 1$, sledi

$$\Delta S = S_2 - S_1 \ge \int_1^2\frac{\delta Q}{T},$$

za izoliran sistem ($\delta Q = 0$) pa $\Delta S \ge 0$.

**Entropija idealnega plina.** Pri prosti ekspanziji na dvakratno prostornino je $\Delta S = nR\ln 2$, čeprav je $Q = 0$. Statistično ima vsaka od $N$ molekul dvakrat več prostora, $\Omega$ se poveča za faktor $2^N$ in $\Delta S = Nk_B\ln 2 = nR\ln 2$.

## Preveri se

? Kolikšen je Carnotov izkoristek stroja, ki deluje med $400\,\mathrm{K}$ in $300\,\mathrm{K}$?
- $75\,\%$
~ To je razmerje $T_2/T_1$; izkoristek je $1 - T_2/T_1$.
+ $25\,\%$
- $33\,\%$
~ Razliko temperatur si delil z nižjo temperaturo $T_2$; deliti jo moraš z višjo, $T_1$.
> $\eta_C = 1 - 300/400 = 0{,}25$. $75\,\%$ je razmerje $T_2/T_1$, $33\,\%$ pa dobiš, če deliš razliko temperatur z nižjo temperaturo.

? Kolikšno je največje možno grelno število toplotne črpalke, ki greje na $35\,^\circ\mathrm{C}$ in jemlje toploto okolici pri $0\,^\circ\mathrm{C}$?
- $1{,}0$
~ Toliko ima električni grelnik, ki delo le pretvori v toploto; toplotna črpalka doda še toploto, prečrpano iz okolice.
- $7{,}8$
~ To je idealno hladilno število $T_2/(T_1 - T_2)$; grelno število ima v števcu višjo temperaturo $T_1$.
+ $8{,}8$
> $\varepsilon_g = T_1/(T_1 - T_2) = 308{,}15/35 \approx 8{,}8$. $7{,}8$ je idealno hladilno število $T_2/(T_1 - T_2)$ za isti temperaturi.

? Za koliko se poveča entropija $1{,}0\,\mathrm{mol}$ idealnega plina, ki se pri stalni temperaturi razširi na dvakratno prostornino?
- $0$
~ Temperatura je res stalna, a plin pri izotermnem razširjanju prejme toploto $Q = nRT\ln 2$, zato je $\Delta S = Q/T > 0$.
+ $5{,}76\,\mathrm{J/K}$
- $8{,}31\,\mathrm{J/K}$
~ To je le $nR$; pozabil si na faktor $\ln(V_2/V_1) = \ln 2 \approx 0{,}693$.
> $\Delta S = nR\ln(V_2/V_1) = 8{,}314 \cdot \ln 2\,\mathrm{J/K} \approx 5{,}76\,\mathrm{J/K}$. Enako velja za prosto ekspanzijo, saj je entropija funkcija stanja.

? Katera naprava bi kršila drugi zakon termodinamike?
- Hladilnik, ki z $1\,\mathrm{kJ}$ dela iz notranjosti odvede $4\,\mathrm{kJ}$ toplote.
~ Hladilno število $4$ je dovoljeno: drugi zakon zahteva le, da hladilniku dovajamo delo, prečrpana toplota pa je lahko večja od dela (za običajen hladilnik je idealno hladilno število okoli $14$).
+ Ladijski motor, ki toploto jemlje le morju in jo v celoti pretvarja v delo.
- Toplotni stroj z izkoristkom $30\,\%$ med $600\,\mathrm{K}$ in $300\,\mathrm{K}$.
~ Carnotov izkoristek med tema temperaturama je $50\,\%$; stroj s $30\,\%$ je pod to mejo, torej mogoč.
> Stroj, ki toploto iz enega samega rezervoarja v celoti pretvarja v delo, krši Kelvin-Planckovo obliko. Hladilno število $4$ in izkoristek $30\,\% < 50\,\%$ sta dovoljena.

? Stroj deluje med $400\,\mathrm{K}$ in $300\,\mathrm{K}$. Kako se spremeni njegov Carnotov izkoristek, če obe temperaturi podvojimo ($800\,\mathrm{K}$ in $600\,\mathrm{K}$)?
- Podvoji se.
~ Izkoristek ni sorazmeren s temperaturo (in ne more preseči $1$); odvisen je le od razmerja $T_2/T_1$.
- Poveča se, ker se razlika temperatur poveča s $100\,\mathrm{K}$ na $200\,\mathrm{K}$.
~ Večja razlika pomaga le pri isti $T_1$; tu se podvoji tudi $T_1$, zato je $(T_1 - T_2)/T_1 = 200/800 = 100/400$.
+ Ostane enak.
> $\eta_C = 1 - 600/800 = 1 - 300/400 = 25\,\%$: razmerje $T_2/T_1$ se ne spremeni, zato se ne spremeni niti izkoristek.

:::simboli
\eta | izkoristek toplotnega stroja | \eta = \frac{A'}{Q_1} = 1 - \frac{Q_2}{Q_1} | – | vedno manjši od 1
\eta_C | Carnotov izkoristek | \eta_C = 1 - \frac{T_2}{T_1} | – | največji možni izkoristek med rezervoarjema
A' | delo, ki ga stroj odda v enem ciklu | A' = Q_1 - Q_2 | J
A | delo, dovedeno hladilniku v enem ciklu | A = Q_1 - Q_2 | J | pri hladilniku in toplotni črpalki
Q_1 | toplota, prejeta iz toplega rezervoarja | | J | v enem ciklu
Q_2 | toplota, oddana hladnemu rezervoarju | | J | v enem ciklu
Q_{\text{rev}} | toplota, izmenjana pri povratni spremembi | | J
Q | izmenjana toplota | | J
T_1 | temperatura toplega rezervoarja | | K | v primerih tudi začetna temperatura toplejšega telesa
T_2 | temperatura hladnega rezervoarja | | K | v primerih tudi začetna oziroma končna temperatura vode
T | absolutna temperatura | | K | pri Clausiusovi neenakosti temperatura rezervoarja
T_0 | temperatura tališča ledu | | K | 273,15 K
T_k | končna (skupna) temperatura po mešanju | | K
S | entropija | | J/K | funkcija stanja
\Delta S | sprememba entropije | \Delta S = \int_1^2\frac{\delta Q_{\text{rev}}}{T} | J/K | ΔS = S₂ − S₁
\Delta S_{\text{izol}} | sprememba entropije izoliranega sistema | | J/K | nikoli negativna
\Delta S_1 | sprememba entropije pri taljenju ledu | \Delta S_1 = \frac{m q_t}{T_0} | J/K | v Primeru 2; v drugih primerih prvi del procesa
\Delta S_2 | sprememba entropije pri segrevanju vode | \Delta S_2 = m c \ln\frac{T_2}{T_0} | J/K | v Primeru 2; v drugih primerih drugi del procesa
\delta | neskončno majhna količina (nepopolni diferencial) | | | δQ ni sprememba funkcije stanja
m | masa | | kg
m_1, m_2 | masi tople vode in ledu | | kg | v Primeru 3
q_t | specifična talilna toplota | | J/kg | led: 334 kJ/kg
c | specifična toplota | | J/(kg K) | voda: 4186 J/(kg K)
:::
