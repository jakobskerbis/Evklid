---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na počitnicah se potopiš $15\,\mathrm{m}$ globoko: kolikokrat večji tlak pritiska na bobniče kot na plaži? Skoraj dvainpolkrat, kot pokaže Primer 1. Ko na vrtni cevi s palcem pokriješ del odprtine, curek brizgne dlje. Tekočino opišemo s **tlakom**, **gostoto** in **hitrostjo toka** v vsaki točki.

Najprej mirujoča tekočina (**hidrostatika**), nato tok **idealne tekočine**: **kontinuitetna enačba** izraža ohranitev mase, **Bernoullijeva enačba** ohranitev energije. Z njima izračunaš tlak v vodovodu, pretok v cevi kemijskega obrata in čas iztekanja iz rezervoarja.

## Razlaga

### Tekočina v mirovanju

**1. Tlak in gostota.** Tlak je sila na enoto ploščine, ki deluje pravokotno na ploskev: $p = F/S$. Enota je pascal, $1\,\mathrm{Pa} = 1\,\mathrm{N/m^2}$; pogosto uporabljamo tudi $1\,\mathrm{bar} = 10^5\,\mathrm{Pa}$, normalni zračni tlak je $p_0 \approx 1{,}013 \cdot 10^5\,\mathrm{Pa}$. Gostota je $\rho = m/V$, za vodo $\rho \approx 1000\,\mathrm{kg/m^3}$, za zrak pri sobnih pogojih okoli $1{,}2\,\mathrm{kg/m^3}$. Kapljevine so skoraj nestisljive, zato je njihova gostota praktično stalna.

**2. Hidrostatski tlak.** V mirujoči tekočini tlak z globino narašča, ker mora vsaka plast nositi težo tekočine nad seboj.

**Izrek.** Naj bo tekočina nestisljiva (gostota $\rho$ povsod enaka) in naj miruje v homogenem težnem polju $g$. Potem je tlak na globini $h$ pod gladino, na kateri je tlak $p_0$,

$$p(h) = p_0 + \rho g h.$$

*Izpeljava:* tanek vodoraven sloj s ploščino $S$ in debelino $\mathrm{d}z$ ($z$ narašča navzgor) miruje, zato je vsota navpičnih sil nič: $p(z)S - p(z + \mathrm{d}z)S - \rho g S\,\mathrm{d}z = 0$, torej $\mathrm{d}p/\mathrm{d}z = -\rho g$. Ker je $\rho$ stalna, integracija od gladine do globine $h$ da $p - p_0 = \rho g h$. Tlak je odvisen le od globine, ne od oblike posode (hidrostatski paradoks). Razliko $p - p_0$ imenujemo nadtlak; manometri običajno kažejo nadtlak, barometri pa absolutni tlak.

*Hiter preizkus:* je tlak na dnu ozke, $10\,\mathrm{m}$ visoke cevi z vodo manjši kot na dnu $10\,\mathrm{m}$ globokega jezera? *(Ne, enak je: šteje le globina.)*

**3. Pascalov zakon.** Naj nestisljiva tekočina v zaprti posodi miruje. Če tlak na enem mestu povečamo za $\Delta p$, se za enak $\Delta p$ poveča tlak v vsaki točki tekočine in na stenah posode. To sledi iz izreka 2: razlika tlakov med točkama je $\rho g$ krat višinska razlika in se ne spremeni, ko spremenimo $p_0$. Na tem temeljijo hidravlične stiskalnice in zavore: pri ploščinah batov $S_1$ in $S_2$ je $F_2 = F_1 S_2/S_1$.

*Hiter preizkus:* veliki bat ima $50$-krat večjo ploščino od malega, na mali pritisneš s $100\,\mathrm{N}$. Kolikšna je sila velikega bata? *($5000\,\mathrm{N}$.)*

**4. Vzgon (Arhimedov zakon).** Naj bo telo v celoti ali delno potopljeno v mirujočo tekočino. Potem je rezultanta tlačnih sil tekočine na telo navpična, usmerjena navzgor in enaka teži izpodrinjene tekočine:

$$F_{vz} = \rho_{\text{tek}}\,g\,V_{\text{pot}}.$$

*Dokaz:* telo v mislih nadomestimo s tekočino enake oblike. Ta tekočina miruje, zato tlačne sile okolice nanjo natanko uravnotežijo njeno težo $\rho_{\text{tek}} g V_{\text{pot}}$. Tlačne sile so odvisne le od tlaka okolice in oblike ploskve, ne od snovi znotraj, zato enako rezultanto čuti telo. Za navpičen valj s presekom $S$ in višino $a$: $F_{vz} = (p_{\text{spodaj}} - p_{\text{zgoraj}})S = \rho_{\text{tek}} g a S$. Telo plava, če je njegova povprečna gostota manjša od gostote tekočine; takrat je potopljeni delež prostornine enak $\rho_{\text{telo}}/\rho_{\text{tek}}$.

:::premisli
Železna in lesena kocka enake prostornine sta v vodi popolnoma potopljeni (leseno držiš pod gladino). Ko ju spustiš, železna potone, lesena pa splava navzgor. Ali to pomeni, da na leseno deluje večji vzgon?
---
Na obe enak. Vzgon je teža izpodrinjene vode, ta pa je odvisna le od potopljene prostornine in gostote vode, ne od snovi kocke. Železna potone, ker je njena teža večja od vzgona.
:::

### Tekočina v toku

**5. Opis toka.** Pri **stacionarnem toku** se hitrost v vsaki točki s časom ne spreminja. Črte, ki so v vsaki točki tangentne na hitrost, so **tokovnice**; snop tokovnic tvori **tokovno cev**. **Idealna tekočina** je nestisljiva in brez notranjega trenja (neviskozna). Ta model dobro opiše vodo in zrak pri zmernih hitrostih, kadar nas ne zanimajo izgube ob stenah.

**6. Kontinuitetna enačba.** **Prostorninski pretok** je prostornina, ki v enoti časa steče skozi presek: $\Phi_V = \mathrm{d}V/\mathrm{d}t = Sv$ (enota $\mathrm{m^3/s}$), masni pretok pa $\Phi_m = \rho S v$ (hitrost je pravokotna na presek in po njem enaka).

**Izrek.** Naj bo tok stacionaren. Potem je masni pretok skozi vsak presek tokovne cevi enak:

$$\rho_1 S_1 v_1 = \rho_2 S_2 v_2, \qquad \text{za nestisljivo tekočino } S_1v_1 = S_2v_2.$$

*Dokaz:* skozi plašč tokovne cevi tekočina ne teče, ker je hitrost na njem tangentna. Pri stacionarnem toku se masa med presekoma 1 in 2 s časom ne spreminja, masa pa se ne izgublja in ne nastaja. Zato mora v času $\mathrm{d}t$ skozi presek 1 vstopiti enaka masa $\rho_1 S_1 v_1\,\mathrm{d}t$, kot jo skozi presek 2 izstopi, $\rho_2 S_2 v_2\,\mathrm{d}t$.

Kjer se cev zoži, se tok pospeši. Pri okroglem preseku je $S = \pi d^2/4$, zato je hitrost obratno sorazmerna s **kvadratom** premera. Če se cev razveja, je pretok v glavni cevi enak vsoti pretokov v vejah.

:::premisli
V ožjem delu vodoravne cevi voda teče hitreje. Napovej: je tlak tam večji ali manjši kot v širšem delu? Zakaj?
---
Manjši. Voda se pri vstopu v zožitev pospeši, za pospešek pa mora nanjo delovati rezultanta tlačnih sil v smeri toka. Tlak za njo (v širšem delu) mora biti torej večji od tlaka pred njo (v ožjem delu). Bernoullijeva enačba to pove kvantitativno.
:::

**7. Bernoullijeva enačba.**

**Izrek.** Naj bo tok stacionaren, tekočina idealna (nestisljiva in neviskozna), edina prostorninska sila (sila na vso prostornino tekočine, ne le na njeno mejo) pa teža. Potem je vzdolž vsake tokovnice

$$p + \tfrac{1}{2}\rho v^2 + \rho g z = \text{konst.},$$

kjer je $z$ višina nad izbrano ravnino.

*Izpeljava:* opazujmo tekočino v tanki tokovni cevi med presekoma 1 in 2. V času $\mathrm{d}t$ se zadnja meja premakne za $v_1\,\mathrm{d}t$, prednja za $v_2\,\mathrm{d}t$; zaradi kontinuitete je premaknjena prostornina na obeh koncih enaka, $\mathrm{d}V = S_1v_1\,\mathrm{d}t = S_2v_2\,\mathrm{d}t$. Tlačne sile na presekih opravijo delo $p_1S_1v_1\,\mathrm{d}t - p_2S_2v_2\,\mathrm{d}t = (p_1 - p_2)\,\mathrm{d}V$; na plašču so pravokotne na hitrost, trenja ni. Teža opravi delo $-\rho\,\mathrm{d}V\,g(z_2 - z_1)$. Ker je tok stacionaren, je, kot da bi se $\mathrm{d}V$ prenesla s preseka 1 na presek 2, zato je sprememba kinetične energije $\tfrac{1}{2}\rho\,\mathrm{d}V(v_2^2 - v_1^2)$. Izrek o kinetični energiji (delo vseh sil je enako spremembi kinetične energije) po deljenju z $\mathrm{d}V$ da $p_1 + \tfrac{1}{2}\rho v_1^2 + \rho g z_1 = p_2 + \tfrac{1}{2}\rho v_2^2 + \rho g z_2$.

Členi imajo enoto tlaka in pomenijo energijo na enoto prostornine: $p$ je »tlačna« energija (delo tlačnih sil), $\tfrac{1}{2}\rho v^2$ kinetična in $\rho g z$ potencialna energija na enoto prostornine. Kjer je hitrost večja, je tlak manjši (na isti višini). Pri $v = 0$ se enačba prevede na hidrostatsko $p + \rho g z = \text{konst.}$

**8. Posledice Bernoullijeve enačbe.**

- **Torricellijev izrek:** voda izteka iz odprtine na globini $h$ pod gladino velikega odprtega rezervoarja s hitrostjo $v = \sqrt{2gh}$, enako kot pri prostem padu z višine $h$. Pogoja: tlak je na gladini in ob curku enak $p_0$, odprtina pa je majhna glede na gladino, zato je po kontinuiteti hitrost gladine zanemarljiva. *Izpeljava:* Bernoulli med gladino ($p_0$, $v \approx 0$, $z = h$) in curkom tik za odprtino ($p_0$, $v$, $z = 0$) da $p_0 + \rho g h = p_0 + \tfrac{1}{2}\rho v^2$.
- **Venturijev merilnik:** v vodoravni zoženi cevi izmerimo razliko tlakov $\Delta p = p_1 - p_2 = \tfrac{1}{2}\rho(v_2^2 - v_1^2)$ in s kontinuitetno enačbo izračunamo pretok.
- **Dinamični vzgon:** nad ukrivljenim krilom se zrak giblje hitreje kot pod njim, zato je tlak zgoraj manjši.

*Hiter preizkus:* s kolikšno hitrostjo izteka voda iz odprtine $20\,\mathrm{m}$ pod gladino? *(Okoli $19{,}8\,\mathrm{m/s}$, kot kamen po padcu z $20\,\mathrm{m}$.)*

**9. Postopek reševanja.** (1) Izberi dve točki na isti tokovnici, kjer poznaš čim več količin. (2) Iz kontinuitetne enačbe poveži hitrosti. (3) Zapiši Bernoullijevo enačbo med točkama. (4) Reši za neznanko in preveri, ali je tlak smiseln (absolutni tlak ne more biti negativen).

## Rešeni primeri

### Primer 1 (lažji)

Potapljač se potopi $15\,\mathrm{m}$ globoko v morje z gostoto $1025\,\mathrm{kg/m^3}$. Zračni tlak nad gladino je $1{,}013 \cdot 10^5\,\mathrm{Pa}$. Kolikšna sta nadtlak in absolutni tlak na tej globini? Vzemi $g = 9{,}81\,\mathrm{m/s^2}$.

**Podatki:** $h = 15\,\mathrm{m}$, $\rho = 1025\,\mathrm{kg/m^3}$, $p_0 = 1{,}013 \cdot 10^5\,\mathrm{Pa}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** nadtlak $p - p_0$ in absolutni tlak $p$

:::formula
$p = p_0 + \rho g h$
:::

**Rešitev:**

1. Nadtlak nastane zaradi teže vode nad potapljačem: $\rho g h = 1025\,\mathrm{kg/m^3} \cdot 9{,}81\,\mathrm{m/s^2} \cdot 15\,\mathrm{m} \approx 1{,}508 \cdot 10^5\,\mathrm{Pa}$.
2. Na gladino pritiska še zrak, zato mu nadtlak prištejemo: $p = 1{,}013 \cdot 10^5\,\mathrm{Pa} + 1{,}508 \cdot 10^5\,\mathrm{Pa} \approx 2{,}52 \cdot 10^5\,\mathrm{Pa}$.
3. Odgovor: nadtlak je približno $1{,}51 \cdot 10^5\,\mathrm{Pa}$ (okoli $1{,}5\,\mathrm{bar}$), absolutni tlak pa približno $2{,}52 \cdot 10^5\,\mathrm{Pa}$, kar je dva in pol krat več kot na gladini.

### Primer 2

Voda teče po cevi z notranjim premerom $2{,}0\,\mathrm{cm}$ s hitrostjo $1{,}5\,\mathrm{m/s}$. Na koncu je šoba z notranjim premerom $1{,}0\,\mathrm{cm}$. Kolikšen je prostorninski pretok in s kolikšno hitrostjo voda izteka iz šobe?

**Podatki:** $d_1 = 2{,}0\,\mathrm{cm} = 0{,}020\,\mathrm{m}$, $v_1 = 1{,}5\,\mathrm{m/s}$, $d_2 = 1{,}0\,\mathrm{cm} = 0{,}010\,\mathrm{m}$, voda je nestisljiva
**Iščemo:** prostorninski pretok $\Phi_V$ in hitrost $v_2$

:::formula
$\Phi_V = S_1v_1$, $S = \dfrac{\pi d^2}{4}$, $S_1v_1 = S_2v_2 \Rightarrow v_2 = v_1\left(\dfrac{d_1}{d_2}\right)^2$
:::

**Rešitev:**

1. Presek cevi (premer v metrih, da dobimo $\mathrm{m^2}$): $S_1 = \pi (0{,}020\,\mathrm{m})^2/4 \approx 3{,}14 \cdot 10^{-4}\,\mathrm{m^2}$.
2. Pretok: $\Phi_V = 3{,}14 \cdot 10^{-4}\,\mathrm{m^2} \cdot 1{,}5\,\mathrm{m/s} \approx 4{,}71 \cdot 10^{-4}\,\mathrm{m^3/s} = 0{,}471\,\mathrm{L/s}$.
3. Razmerje premerov je $2$, razmerje presekov $4$, zato $v_2 = 4 \cdot 1{,}5\,\mathrm{m/s} = 6{,}0\,\mathrm{m/s}$.
4. Odgovor: pretok je približno $0{,}47\,\mathrm{L/s}$, voda pa iz šobe izteka s hitrostjo $6{,}0\,\mathrm{m/s}$.

### Primer 3 (težji)

Vodovodna cev v pritličju ima notranji premer $3{,}0\,\mathrm{cm}$, voda v njej teče s hitrostjo $0{,}80\,\mathrm{m/s}$ pri absolutnem tlaku $3{,}0 \cdot 10^5\,\mathrm{Pa}$. Cev se vzpne v drugo nadstropje, $6{,}0\,\mathrm{m}$ višje, kjer se zoži na premer $1{,}5\,\mathrm{cm}$. Kolikšna sta hitrost in tlak vode v zgornji cevi? Bojler v drugem nadstropju potrebuje vsaj $2{,}0 \cdot 10^5\,\mathrm{Pa}$: kolikšen je najmanjši premer zgornje cevi, pri katerem tlak ne pade pod to mejo (podatki v pritličju ostanejo enaki)? Vodo obravnavaj kot idealno tekočino z gostoto $1000\,\mathrm{kg/m^3}$, $g = 9{,}81\,\mathrm{m/s^2}$.

**Podatki:** $d_1 = 3{,}0\,\mathrm{cm}$, $v_1 = 0{,}80\,\mathrm{m/s}$, $p_1 = 3{,}0 \cdot 10^5\,\mathrm{Pa}$, $z_2 - z_1 = 6{,}0\,\mathrm{m}$, $d_2 = 1{,}5\,\mathrm{cm}$, $p_{\min} = 2{,}0 \cdot 10^5\,\mathrm{Pa}$, $\rho = 1000\,\mathrm{kg/m^3}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** hitrost $v_2$ in tlak $p_2$; najmanjši premer $d_{\min}$

:::formula
$v_2 = v_1\left(\dfrac{d_1}{d_2}\right)^2$; $p_1 + \tfrac{1}{2}\rho v_1^2 + \rho g z_1 = p_2 + \tfrac{1}{2}\rho v_2^2 + \rho g z_2$; $d = d_1\sqrt{v_1/v_2}$
:::

**Rešitev:**

1. Kontinuiteta (presek je štirikrat manjši, pretok pa enak): $v_2 = 0{,}80\,\mathrm{m/s} \cdot (3{,}0/1{,}5)^2 = 3{,}2\,\mathrm{m/s}$.
2. Iz Bernoullijeve enačbe: $p_2 = p_1 + \tfrac{1}{2}\rho(v_1^2 - v_2^2) - \rho g(z_2 - z_1)$.
3. Kinetični člen je negativen, ker voda zgoraj teče hitreje: $\tfrac{1}{2} \cdot 1000 \cdot (0{,}64 - 10{,}24)\,\mathrm{Pa} = -4800\,\mathrm{Pa}$.
4. Višinski člen (delo za dvig vode za $6{,}0\,\mathrm{m}$ na enoto prostornine): $1000 \cdot 9{,}81 \cdot 6{,}0\,\mathrm{Pa} = 58\,860\,\mathrm{Pa}$.
5. $p_2 = 300\,000\,\mathrm{Pa} - 4800\,\mathrm{Pa} - 58\,860\,\mathrm{Pa} \approx 2{,}36 \cdot 10^5\,\mathrm{Pa}$.
6. Obratno vprašanje: ožja cev pomeni večjo $v_2$ in zato nižji $p_2$. Mejni primer je $p_2 = p_{\min}$; Bernoullijevo enačbo rešimo za kinetični člen (pri tem je $\tfrac{1}{2}\rho v_1^2 = 320\,\mathrm{Pa}$): $\tfrac{1}{2}\rho v_2^2 = p_1 - p_{\min} + \tfrac{1}{2}\rho v_1^2 - \rho g(z_2 - z_1) = (300\,000 - 200\,000 + 320 - 58\,860)\,\mathrm{Pa} = 41\,460\,\mathrm{Pa}$.
7. Največja dopustna hitrost: $v_{2,\max} = \sqrt{2 \cdot 41\,460/1000}\,\mathrm{m/s} \approx 9{,}11\,\mathrm{m/s}$.
8. Iz kontinuitete $d_1^2v_1 = d^2v_2$: $d_{\min} = 3{,}0\,\mathrm{cm} \cdot \sqrt{0{,}80/9{,}11} \approx 0{,}89\,\mathrm{cm}$.
9. Odgovor: v zgornji cevi voda teče s hitrostjo $3{,}2\,\mathrm{m/s}$ pri tlaku približno $2{,}36 \cdot 10^5\,\mathrm{Pa}$; tlak se zmanjša predvsem zaradi višinske razlike, manj zaradi večje hitrosti. Zgornjo cev smemo zožiti največ na premer okoli $0{,}89\,\mathrm{cm}$, sicer tlak pade pod $2{,}0 \cdot 10^5\,\mathrm{Pa}$.

### Primer 4 – zdaj ti

V rastlinjaku marsovske baze stoji velik odprt rezervoar za zalivanje. Na dnu, $1{,}8\,\mathrm{m}$ pod gladino, je majhna odprtina s premerom $1{,}0\,\mathrm{cm}$. Težni pospešek na Marsu je $3{,}71\,\mathrm{m/s^2}$, zrak v bazi ima povsod enak tlak. S kolikšno hitrostjo in s kolikšnim pretokom izteka voda?

**Podatki:** $h = 1{,}8\,\mathrm{m}$, $d = 1{,}0\,\mathrm{cm} = 0{,}010\,\mathrm{m}$, $g_M = 3{,}71\,\mathrm{m/s^2}$, rezervoar je velik in odprt, tlak zraka nad gladino in ob curku je enak
**Iščemo:** hitrost iztekanja $v$ in prostorninski pretok $\Phi_V$

:::formula
$v = \sqrt{2g_Mh}$, $S = \dfrac{\pi d^2}{4}$, $\Phi_V = Sv$
:::

**Rešitev:**

1. Velja Torricellijev izrek, ker se zračni tlak na gladini in v curku pokrajša, gladina velikega rezervoarja pa se skoraj ne premika.
2. Hitrost: $v = \sqrt{2 \cdot 3{,}71\,\mathrm{m/s^2} \cdot 1{,}8\,\mathrm{m}} \approx 3{,}65\,\mathrm{m/s}$.
3. Presek odprtine (premer v metrih): $S = \pi(0{,}010\,\mathrm{m})^2/4 \approx 7{,}85 \cdot 10^{-5}\,\mathrm{m^2}$.
4. Pretok izračunaj sam, nato preveri:

:::premisli
Kolikšen je pretok v litrih na sekundo? Kolikokrat hitreje bi ista voda iztekala na Zemlji?
---
$\Phi_V = 7{,}85 \cdot 10^{-5}\,\mathrm{m^2} \cdot 3{,}65\,\mathrm{m/s} \approx 2{,}87 \cdot 10^{-4}\,\mathrm{m^3/s} \approx 0{,}29\,\mathrm{L/s}$. Ker je $v \propto \sqrt{g}$, bi bila hitrost na Zemlji $\sqrt{9{,}81/3{,}71} \approx 1{,}63$-krat večja, okoli $5{,}9\,\mathrm{m/s}$.
:::

## Pogoste napake

- **Hitrost sorazmerna s premerom.** Pri zožitvi na polovico premera se presek zmanjša na četrtino, hitrost pa se **početveri**, ne podvoji. Premere pred računanjem ploščin pretvori v metre ($1\,\mathrm{cm^2} = 10^{-4}\,\mathrm{m^2}$).
- **Mešanje absolutnega tlaka in nadtlaka.** V Bernoullijevi enačbi sme biti na obeh straneh le ena vrsta tlaka. Pri odprtih posodah in curkih v zrak je tlak na prostih površinah $p_0$ in se pokrajša.
- **Večja hitrost, večji tlak.** Pogosta intuicija je napačna: v ožjem delu vodoravne cevi je hitrost večja, tlak pa **manjši**. Curek iz šobe je hiter, ker ga poganja razlika tlakov.
- **Bernoulli za viskozen tok v dolgi cevi.** V tankih ceveh (kapilare, injekcijske igle) in pri zelo viskoznih tekočinah prevladajo izgube zaradi notranjega trenja; idealni model tam ne zadošča.

## Povzetek

- Hidrostatika: $p = p_0 + \rho g h$; Pascalov zakon; vzgon $F_{vz} = \rho_{\text{tek}} g V_{\text{pot}}$.
- Pretok: $\Phi_V = Sv$, $\Phi_m = \rho S v$.
- Kontinuitetna enačba (ohranitev mase): $S_1v_1 = S_2v_2$ za nestisljivo tekočino; $v \propto 1/d^2$.
- Bernoullijeva enačba (ohranitev energije, idealna tekočina, stacionaren tok, vzdolž tokovnice): $p + \tfrac{1}{2}\rho v^2 + \rho g z = \text{konst.}$
- Posledice: Torricelli $v = \sqrt{2gh}$; v zožitvi večja hitrost in manjši tlak (Venturi).

## Za izpit

Znati moraš povedati:

- izrek o hidrostatskem tlaku $p = p_0 + \rho g h$ s pogoji (nestisljiva tekočina miruje v homogenem težnem polju) in izpeljavo iz ravnovesja tankega sloja;
- Arhimedov zakon in dokaz z nadomestno tekočino;
- definicije stacionarnega toka, tokovnice, tokovne cevi, idealne tekočine ter prostorninskega in masnega pretoka;
- kontinuitetno enačbo s pogojem (stacionaren tok) in dokaz iz ohranitve mase;
- Bernoullijevo enačbo z vsemi pogoji, izpeljavo z izrekom o kinetični energiji in iz nje Torricellijev izrek.

### Naloga 1

Valjast odprt rezervoar s premerom $1{,}20\,\mathrm{m}$ je napolnjen z vodo do višine $2{,}00\,\mathrm{m}$. Na dnu odpremo okroglo odprtino s premerom $2{,}0\,\mathrm{cm}$. Vodo obravnavaj kot idealno tekočino, $g = 9{,}81\,\mathrm{m/s^2}$. (a) S kolikšno hitrostjo in s kolikšnim pretokom voda začne iztekati? (b) Utemelji, zakaj smeš Torricellijev izrek uporabiti v vsakem trenutku, in izračunaj, v kolikšnem času gladina pade na polovico začetne višine ter v kolikšnem času se rezervoar izprazni.

**Rešitev:**

1. Razmerje presekov rezervoarja in odprtine: $S/s = (D/d)^2 = (1{,}20/0{,}020)^2 = 3600$.
2. Po kontinuiteti je hitrost gladine $3600$-krat manjša od hitrosti curka, zato je njen kinetični člen zanemarljiv, tok pa se spreminja zelo počasi (skoraj stacionarno). Torricellijev izrek zato velja v vsakem trenutku z trenutno višino $h$: $v = \sqrt{2gh}$.
3. Začetna hitrost: $v_0 = \sqrt{2 \cdot 9{,}81 \cdot 2{,}00}\,\mathrm{m/s} \approx 6{,}26\,\mathrm{m/s}$.
4. Presek odprtine $s = \pi(0{,}020\,\mathrm{m})^2/4 \approx 3{,}14 \cdot 10^{-4}\,\mathrm{m^2}$, začetni pretok $\Phi_V = s v_0 \approx 3{,}14 \cdot 10^{-4} \cdot 6{,}26\,\mathrm{m^3/s} \approx 1{,}97 \cdot 10^{-3}\,\mathrm{m^3/s} = 1{,}97\,\mathrm{L/s}$.
5. Prostornina v rezervoarju se zmanjšuje za iztekajoči pretok: $S\,\dfrac{\mathrm{d}h}{\mathrm{d}t} = -s\sqrt{2gh}$.
6. Ločimo spremenljivki, $\dfrac{\mathrm{d}h}{\sqrt{h}} = -\dfrac{s}{S}\sqrt{2g}\,\mathrm{d}t$, in integriramo od $H$ do $h$: $2(\sqrt{H} - \sqrt{h}) = \dfrac{s}{S}\sqrt{2g}\,t$, torej $t = \dfrac{S}{s}\sqrt{\dfrac{2}{g}}\,(\sqrt{H} - \sqrt{h})$.
7. $\sqrt{2/g} = \sqrt{2/9{,}81}\,\mathrm{s/\sqrt{m}} \approx 0{,}4515\,\mathrm{s/\sqrt{m}}$. Do polovice višine: $t_{1/2} = 3600 \cdot 0{,}4515 \cdot (\sqrt{2{,}00} - \sqrt{1{,}00})\,\mathrm{s} \approx 673\,\mathrm{s} \approx 11{,}2\,\mathrm{min}$.
8. Do izpraznitve ($h = 0$): $t = 3600 \cdot 0{,}4515 \cdot \sqrt{2{,}00}\,\mathrm{s} \approx 2299\,\mathrm{s} \approx 38{,}3\,\mathrm{min}$.
9. Odgovor: voda začne iztekati s hitrostjo $6{,}26\,\mathrm{m/s}$ in pretokom $1{,}97\,\mathrm{L/s}$; gladina pade na polovico v okoli $11\,\mathrm{min}$, rezervoar se izprazni v okoli $38\,\mathrm{min}$. Prva polovica višine izteče v manj kot tretjini celotnega časa, ker je pri višji gladini hitrost iztekanja večja.

### Naloga 2

Natančno navedi Bernoullijevo enačbo z vsemi pogoji in jo izpelji. Nato izpelji hitrost iztekanja iz majhne odprtine na globini $h$ pod gladino velikega **zaprtega** rezervoarja, v katerem je nad gladino plin z nadtlakom $\Delta p$ (zunaj je tlak $p_0$). Utemelji, ali Torricellijev izrek velja tudi tu, in izračunaj hitrost za $h = 1{,}0\,\mathrm{m}$, $\Delta p = 0{,}50\,\mathrm{bar}$, $\rho = 1000\,\mathrm{kg/m^3}$, $g = 9{,}81\,\mathrm{m/s^2}$.

**Rešitev:**

1. Izrek: naj bo tok stacionaren, tekočina nestisljiva in neviskozna, edina prostorninska sila pa teža. Potem je vzdolž tokovnice $p + \tfrac{1}{2}\rho v^2 + \rho g z = \text{konst.}$
2. Opazujemo tekočino v tokovni cevi med presekoma 1 in 2. V času $\mathrm{d}t$ se na obeh koncih premakne prostornina $\mathrm{d}V = S_1v_1\,\mathrm{d}t = S_2v_2\,\mathrm{d}t$ (nestisljivost in kontinuiteta).
3. Delo tlačnih sil je $p_1S_1v_1\,\mathrm{d}t - p_2S_2v_2\,\mathrm{d}t = (p_1 - p_2)\,\mathrm{d}V$; sile na plašču so pravokotne na hitrost, viskoznih sil ni. Delo teže je $-\rho\,\mathrm{d}V\,g(z_2 - z_1)$.
4. Zaradi stacionarnosti se stanje med presekoma ne spremeni, zato je sprememba kinetične energije enaka, kot da bi $\mathrm{d}V$ prešla s preseka 1 na presek 2: $\tfrac{1}{2}\rho\,\mathrm{d}V(v_2^2 - v_1^2)$.
5. Izrek o kinetični energiji: $(p_1 - p_2)\,\mathrm{d}V - \rho\,\mathrm{d}V\,g(z_2 - z_1) = \tfrac{1}{2}\rho\,\mathrm{d}V(v_2^2 - v_1^2)$. Delimo z $\mathrm{d}V$ in preuredimo, pa dobimo Bernoullijevo enačbo.
6. Zaprt rezervoar: točka 1 na gladini ($p_0 + \Delta p$, $v_1 \approx 0$, ker je rezervoar velik, $z_1 = h$), točka 2 v curku ($p_0$, $v$, $z_2 = 0$): $p_0 + \Delta p + \rho g h = p_0 + \tfrac{1}{2}\rho v^2$, torej $v = \sqrt{2gh + 2\Delta p/\rho}$.
7. Torricellijev izrek $v = \sqrt{2gh}$ je poseben primer za $\Delta p = 0$, ko je tlak na gladini enak tlaku ob curku. Tu ne velja: nadtlak hitrost poveča, podtlak jo zmanjša (pri $\Delta p < -\rho g h$ voda sploh ne izteka).
8. Številke: $2gh = 2 \cdot 9{,}81 \cdot 1{,}0\,\mathrm{m^2/s^2} = 19{,}62\,\mathrm{m^2/s^2}$; $2\Delta p/\rho = 2 \cdot 0{,}50 \cdot 10^5/1000\,\mathrm{m^2/s^2} = 100\,\mathrm{m^2/s^2}$; $v = \sqrt{119{,}62}\,\mathrm{m/s} \approx 10{,}9\,\mathrm{m/s}$.
9. Odgovor: $v = \sqrt{2gh + 2\Delta p/\rho} \approx 10{,}9\,\mathrm{m/s}$, skoraj $2{,}5$-krat več kot po Torricelliju ($\sqrt{19{,}62} \approx 4{,}43\,\mathrm{m/s}$); Torricellijev izrek velja le, če je tlak nad gladino enak zunanjemu.

## Drugače: Na sliki

Vodoravna cev z zožitvijo in tremi manometrskimi cevkami:

```
   |#|          |#|          |#|      <- višina vode v cevkah = tlak
   |#|          | |          |#|
   |#|          | |          |#|
 ==|#|==========| |==========|#|==
   ->  v1      ---> v2       ->  v1
 ==================================
   široko       ozko         široko
```

V ozkem delu so tokovnice gostejše (hitrost večja), voda v cevki pa je nižja (tlak manjši). Za zožitvijo se oba idealno vrneta na začetno vrednost.

## Drugače: Uporaba v stroki

**Merjenje pretoka.** V procesni industriji pretok merijo z Venturijevimi cevmi in zaslonkami (ISO 5167): iz izmerjene razlike tlakov ga izračunajo z Bernoullijevo in kontinuitetno enačbo ter popravijo s pretočnim koeficientom, ki je za Venturijevo cev okoli $0{,}98$, za ostrorobo zaslonko le okoli $0{,}6$ (curek se za njo zoži, del energije se izgubi v vrtincih).

**Pitotova cev** meri hitrost plina v kanalih in na letalih: razlika zastojnega in statičnega tlaka je $\tfrac{1}{2}\rho v^2$, zato $240\,\mathrm{Pa}$ v zraku ($1{,}2\,\mathrm{kg/m^3}$) pomeni $20\,\mathrm{m/s}$.

**Nivo in gostota.** Iz hidrostatskega nadtlaka na dnu rezervoarja krmilje izračuna višino gladine $h = \Delta p/(\rho g)$: $14{,}7\,\mathrm{kPa}$ nad vodo pomeni $1{,}50\,\mathrm{m}$. S hidrostatsko tehtnico iz vzgona dobimo prostornino vzorca: $50{,}0\,\mathrm{g}$ na zraku in $31{,}5\,\mathrm{g}$ v vodi da $18{,}5\,\mathrm{cm^3}$ in gostoto $2{,}70\,\mathrm{g/cm^3}$ (aluminij).

**Vodna črpalka.** Pri vakuumski filtraciji hiter curek vode v zožitvi zniža tlak in sesa zrak iz nuče; najnižji tlak omejuje parni tlak vode, okoli $3\,\mathrm{kPa}$.

## Drugače: Bolj natančno

**Stisljiva tekočina.** Enačba $\mathrm{d}p/\mathrm{d}z = -\rho g$ iz Razlage velja tudi, ko $\rho$ ni stalna. Za idealni plin pri stalni temperaturi je $\rho = pM/(RT)$ in rešitev je barometrska enačba $p(z) = p_0\,e^{-Mgz/(RT)}$.

**Kontinuitetna enačba v diferencialni obliki.** Splošno za stisljivo tekočino velja $\frac{\partial\rho}{\partial t} + \nabla\cdot(\rho\vec{v}) = 0$; za nestisljivo $\nabla\cdot\vec{v} = 0$. Bernoullijeva enačba sledi iz Eulerjeve enačbe $\rho\left(\frac{\partial\vec{v}}{\partial t} + (\vec{v}\cdot\nabla)\vec{v}\right) = -\nabla p + \rho\vec{g}$ za stacionaren tok, integrirane vzdolž tokovnice.

**Meje modela.** Realne tekočine so viskozne. V tanki cevi s polmerom $r$ in dolžino $l$ je pri laminarnem toku pretok $\Phi_V = \frac{\pi r^4\Delta p}{8\eta l}$ (Poiseuillov zakon), kjer je $\eta$ viskoznost. Vrsto toka pove Reynoldsovo število $Re = \rho v d/\eta$; v okroglih ceveh je tok običajno laminaren pri $Re \lesssim 2000$.

## Preveri se

? Kolikšen je nadtlak v vodi ($\rho = 1000\,\mathrm{kg/m^3}$) na globini $10\,\mathrm{m}$ ($g = 9{,}81\,\mathrm{m/s^2}$)?
- $9{,}81\,\mathrm{kPa}$
~ Za faktor $10$ premalo: to je nadtlak na globini $1\,\mathrm{m}$. Preveri, ali si globino res vstavil v metrih.
+ $98{,}1\,\mathrm{kPa}$
- $199\,\mathrm{kPa}$
~ To je absolutni tlak: nadtlaku si prištel še zračni tlak $p_0$, vprašanje pa sprašuje le po $\rho g h$.
> $\rho g h = 1000 \cdot 9{,}81 \cdot 10\,\mathrm{Pa} = 98{,}1\,\mathrm{kPa}$.

? Cev se zoži na polovico premera. Kako se spremeni hitrost idealne tekočine?
- Podvoji se.
~ Hitrost si povezal s premerom namesto s ploščino preseka; ta pade na četrtino, ker je $S \propto d^2$.
+ Poveča se za faktor $4$.
- Zmanjša se na polovico.
~ Ožja cev toka ne zavira: skozi manjši presek mora v sekundi steči enaka prostornina, zato se tok pospeši.
> Iz $S_1v_1 = S_2v_2$ in $S \propto d^2$ sledi $v_2/v_1 = (d_1/d_2)^2 = 4$.

? Lesena kocka z gostoto $600\,\mathrm{kg/m^3}$ plava na vodi ($1000\,\mathrm{kg/m^3}$). Kolikšen delež njene prostornine je pod gladino?
- $40\,\%$
~ To je delež nad gladino, $1 - 0{,}60$; vprašanje sprašuje po potopljenem delu.
- $100\,\%$
~ Popolnoma potopljena bi bila le kocka, gostejša od vode; les je redkejši, zato plava in del gleda iz vode.
+ $60\,\%$
> V ravnovesju je vzgon enak teži: $\rho_v g V_{\text{pot}} = \rho_l g V$, torej $V_{\text{pot}}/V = 600/1000 = 0{,}60$.

? S kolikšno hitrostjo izteka voda iz majhne odprtine $5{,}0\,\mathrm{m}$ pod gladino velikega odprtega rezervoarja ($g = 9{,}81\,\mathrm{m/s^2}$)?
- $49\,\mathrm{m/s}$
~ Izračunal si $gh \approx 49\,\mathrm{m^2/s^2}$ in pozabil faktor $2$ ter koren; enota tega rezultata ni $\mathrm{m/s}$.
+ $9{,}9\,\mathrm{m/s}$
- $7{,}0\,\mathrm{m/s}$
~ Izpustil si faktor $2$ pod korenom: $\sqrt{gh} \approx 7{,}0\,\mathrm{m/s}$. Hitrost je enaka kot pri prostem padu, $v^2 = 2gh$.
> Po Torricelliju je $v = \sqrt{2gh} = \sqrt{2 \cdot 9{,}81 \cdot 5{,}0}\,\mathrm{m/s} \approx 9{,}9\,\mathrm{m/s}$.

? Vodoravna cev je široka, nato ozka, nato spet enako široka. Kateri opis se ujema s tokom idealne tekočine (široko – ozko – široko)?
- Hitrost: majhna – velika – majhna; tlak: majhen – velik – majhen.
~ To je intuicija »hitreje pomeni večji tlak«. Tekočino v zožitev pospeši prav razlika tlakov, zato je tlak tam manjši.
- Hitrost: velika – majhna – velika; tlak: velik – majhen – velik.
~ Ožji del ni »zamašek«, ki tok upočasni: po kontinuitetni enačbi je hitrost tam večja, ker je presek manjši.
+ Hitrost: majhna – velika – majhna; tlak: velik – majhen – velik.
> Iz $S_1v_1 = S_2v_2$ je hitrost v ozkem delu največja, iz Bernoullijeve enačbe na isti višini pa je tam tlak najmanjši.

:::simboli
p | tlak | p = \frac{F}{S} | Pa | v mirujoči tekočini p = p₀ + ρgh
F | sila, pravokotna na ploskev | | N
p_0 | tlak na gladini (zračni tlak) | | Pa | normalni zračni tlak 1,013 · 10⁵ Pa
p_1, p_2 | tlak v prerezih 1 in 2 | | Pa
h | globina pod gladino | | m
\rho | gostota tekočine | \rho = \frac{m}{V} | kg/m^3 | voda: 1000 kg/m³
\rho_1, \rho_2 | gostota tekočine v prerezih 1 in 2 | | kg/m^3 | pri nestisljivi tekočini enaki
\rho_{\text{tek}} | gostota tekočine | | kg/m^3
g | težni pospešek | | m/s^2 | 9,81 m/s²
g_M | težni pospešek na Marsu | | m/s^2 | 3,71 m/s²
F_{vz} | sila vzgona | F_{vz} = \rho_{\text{tek}}\,g\,V_{\text{pot}} | N
V_{\text{pot}} | prostornina potopljenega dela telesa | | m^3
S | ploščina preseka cevi | | m^2 | okrogla cev: S = πd²/4
S_1, S_2 | ploščini presekov 1 in 2 | | m^2
v | hitrost tekočine | | m/s
v_1, v_2 | hitrost tekočine v prerezih 1 in 2 | S_1v_1 = S_2v_2 | m/s
z | višina nad izbrano ravnino | | m
z_1, z_2 | višina prerezov 1 in 2 | | m
\Phi_V | prostorninski pretok | \Phi_V = Sv | m^3/s
d | notranji premer cevi | | m
d_1, d_2 | premera cevi v prerezih 1 in 2 | | m
d_{\min} | najmanjši dopustni premer cevi | d_{\min} = d_1\sqrt{v_1/v_{2,\max}} | m
p_{\min} | najmanjši zahtevani tlak | | Pa
\Delta p | razlika tlakov ali nadtlak | | Pa
\Phi_m | masni pretok | \Phi_m = \rho S v | kg/s
D | premer rezervoarja | | m
H | začetna višina gladine | | m
s | presek odprtine | | m^2
t | čas | | s
:::
