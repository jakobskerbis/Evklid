---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na začetku 17. stoletja je Johannes Kepler hotel razumeti, kako daljnogled iz dveh steklenih leč približa Luno. Za to je moral vedeti, za koliko se svetloba odkloni s poti, ko preide iz zraka v steklo. Že Ptolemaj je v antiki meril kote svetlobe ob prehodu v vodo in jih zapisal v tabele, preprostega pravila pa ni našel. Tudi Kepler ga ni: za majhne kote je vzel, da je lomni kot kar stalen del vpadnega. Pravo pravilo je kmalu zatem odkril nizozemski matematik Willebrord Snellius.

Isto vprašanje si postavi vsak, ki se ukvarja s športom v vodi. Podvodni ribič ve, da riba ni tam, kjer jo vidi. Vaterpolist v bazenu vidi dno bližje, kot je v resnici. Fotograf ob atletski stezi z objektivom ujame tekača na tipalo, veliko kot znamka. Vse to razloži **geometrijska optika**: svetlobo opišemo z **žarki**, ravnimi črtami, ki kažejo smer širjenja svetlobe.

## Razlaga

**1. Mamljiva napačna ideja.** Ko žarek preide iz zraka v vodo, se odkloni proti **vpadni pravokotnici**, to je proti premici, ki je pravokotna na mejo. Kot med vpadnim žarkom in pravokotnico je **vpadni kot** $\alpha$, kot med lomljenim žarkom in pravokotnico pa **lomni kot** $\beta$. Ta pojav je **lom svetlobe**.

Pri $\alpha = 10^\circ$ izmerimo $\beta = 7{,}5^\circ$, torej je lomni kot $0{,}75$ vpadnega. Mamljivo je sklepati, da velja to pri vseh kotih. Preverimo z meritvami za prehod iz zraka v vodo:

| $\alpha$ | $\beta$ po ugibanju $0{,}75\,\alpha$ | izmerjeni $\beta$ |
|---|---|---|
| $10^\circ$ | $7{,}5^\circ$ | $7{,}5^\circ$ |
| $30^\circ$ | $22{,}5^\circ$ | $22{,}1^\circ$ |
| $60^\circ$ | $45{,}0^\circ$ | $40{,}6^\circ$ |
| $80^\circ$ | $60{,}0^\circ$ | $47{,}8^\circ$ |

Pri majhnih kotih se ugibanje ujema, pri velikih zgreši za več kot $10^\circ$. Keplerjevo približno pravilo torej velja le za majhne kote.

**2. Pravo pravilo: lomni zakon.** Stalno razmerje nimata kota, ampak njuna sinusa. To razmerje je določeno s tem, kako hitro potuje svetloba v obeh snoveh. Svetloba je v snovi počasnejša kot v vakuumu. **Lomni količnik** snovi pove, kolikokrat:

$$n = \frac{c_0}{c}$$

Tu je $c_0 = 3{,}00\cdot10^{8}\,\mathrm{m/s}$ hitrost svetlobe v vakuumu, $c$ pa hitrost v snovi. Za zrak je $n \approx 1{,}00$, za vodo $1{,}33$, za steklo okoli $1{,}5$. Lomni zakon (Snellov zakon) je enačba:

$$n_1 \sin\alpha = n_2 \sin\beta$$

Indeks $1$ pomeni snov, iz katere svetloba prihaja, indeks $2$ snov, v katero gre. Če je $n_2 > n_1$, je $\beta < \alpha$: žarek se lomi **k pravokotnici**. V obratni smeri se lomi **od pravokotnice**. Snovi z večjim lomnim količnikom rečemo **optično gostejša**.

:::premisli
Kepler je za steklo uporabljal pravilo »lomni kot je stalen del vpadnega«. Zakaj je s tem pravilom kljub temu dobro opisal daljnogled?
---
V daljnogledu vpadajo žarki na leče skoraj pravokotno, torej pod majhnimi koti. Tam je $\sin\alpha$ skoraj sorazmeren z $\alpha$, zato se približek in lomni zakon skoraj ujemata.
:::

**3. Odboj.** Na vsaki meji se del svetlobe tudi odbije. Pri odboju velja **odbojni zakon**: odbojni kot $\alpha'$ je enak vpadnemu, $\alpha' = \alpha$, in oba žarka ležita v isti ravnini s pravokotnico. Tako se odbije tudi biljardna krogla od roba mize, če nima vrtenja. Gladka voda v bazenu zato zrcali tribune.

**4. Popolni odboj.** Pojdimo zdaj iz vode v zrak. Žarek se lomi od pravokotnice, zato je $\beta$ večji od $\alpha$. Ko vpadni kot raste, doseže lomni kot $90^\circ$ in lomljeni žarek drsi po gladini. Vpadni kot, pri katerem se to zgodi, je **mejni kot** $\alpha_m$. Iz lomnega zakona z $\sin 90^\circ = 1$ dobimo enačbo:

$$\sin\alpha_m = \frac{n_2}{n_1}$$

Pri vpadnem kotu, večjem od mejnega, lomljenega žarka ni: vsa svetloba se odbije nazaj. To je **popolni odboj**. Zgodi se le, ko svetloba prehaja v snov z **manjšim** lomnim količnikom. Po njem svetloba potuje po **optičnih vlaknih** in daje lesk briljantom.

V simulaciji spodaj »Lom in popolni odboj« postavi žarek v vodo in počasi večaj vpadni kot. Opazuj, kako lomljeni žarek slabi in kako pri okoli $49^\circ$ izgine.

**5. Leče.** **Zbiralna leča** je na sredini debelejša kot na robu. Žarke, vzporedne z **optično osjo** (premico skozi središče leče, pravokotno na lečo), zbere v **gorišču** $F$, ki je za **goriščno razdaljo** $f$ oddaljeno od leče. **Razpršilna leča** je na robu debelejša; vzporedne žarke razprši, kot da bi prihajali iz gorišča pred lečo, zato ji pripišemo negativen $f$.

Druga mamljiva ideja: »zbiralna leča vedno poveča«. Ni res. Sliko dobimo s tremi značilnimi žarki iz vrha predmeta: vzporedni žarek gre po leči skozi gorišče za lečo, žarek skozi središče leče gre naravnost, žarek skozi gorišče pred lečo gre po leči vzporedno z osjo.

:::risba skica
opis: Zbiralna leča z goriščno razdaljo 2 enoti. Predmet, visok 1,5 enote, stoji 3 enote pred lečo. Trije značilni žarki iz vrha predmeta se za lečo sekajo 6 enot za lečo, kjer nastane obrnjena slika, visoka 3 enote.
območje: -4; -3,5 .. 7; 2,5
enota: 28
črta: -4; 0 -> 7; 0 | siva
črta: 0; -3,3 -> 0; 2,3 | modra debelo
točka: -2; 0 | F | pod
točka: 2; 0 | F | nad
puščica: -3; 0 -> -3; 1,5 | P | levo | zelena debelo
puščica: 6; 0 -> 6; -3 | S | desno | rdeča debelo
črta: -3; 1,5 -> 0; 1,5 -> 6; -3 | oranžna
črta: -3; 1,5 -> 6; -3 | oranžna črtkano
črta: -3; 1,5 -> 0; -3 -> 6; -3 | oranžna
:::

Razdaljo predmeta od leče označimo z $a$, razdaljo slike z $b$, višino predmeta s $P$, višino slike s $S$. Zvezo med njimi da **enačba leče**:

$$\frac{1}{f} = \frac{1}{a} + \frac{1}{b}$$

**Povečava** pove, kolikokrat je slika večja od predmeta:

$$\frac{S}{P} = \frac{b}{a}$$

Na risbi je $a = 3$, $b = 6$, zato je slika dvakrat večja. Če pa je predmet dlje od $2f$, je slika manjša od predmeta. Slika z $b > 0$ je **realna**: nastane za lečo in jo ujameš na zaslon. Če je predmet bližje od $f$, izide $b < 0$: slika je **navidezna**, pokončna in na isti strani kot predmet. Tako deluje lupa.

:::premisli
Predmet približuješ zbiralni leči od daleč proti gorišču. Kaj se dogaja s sliko?
---
Slika se oddaljuje od leče in raste. Ko je predmet pri $2f$, je slika enako velika; bližje gorišču je vedno večja in bolj oddaljena. Ko predmet doseže gorišče, gredo žarki za lečo vzporedno in slike ni.
:::

## Rešeni primeri

### Primer 1 (lažji): laser v bazenu

Na treningu podvodnega hokeja trener posveti z laserskim kazalnikom v vodo pod vpadnim kotom $50^\circ$. Pod kolikšnim kotom glede na pravokotnico potuje žarek v vodi?

**Podatki:** $\alpha = 50^\circ$, $n_1 = 1{,}00$ (zrak), $n_2 = 1{,}33$ (voda)
**Iščemo:** lomni kot $\beta$

:::formula
$n_1 \sin\alpha = n_2 \sin\beta$, torej $\sin\beta = \dfrac{n_1 \sin\alpha}{n_2}$
:::

**Rešitev:**

1. Sinus vpadnega kota: $\sin 50^\circ = 0{,}766$.
2. Izrazimo sinus lomnega kota: $\sin\beta = \dfrac{1{,}00 \cdot 0{,}766}{1{,}33} = 0{,}576$.
3. Kot poiščemo z obratno funkcijo: $\beta = 35{,}2^\circ$.
4. Odgovor: žarek potuje v vodi pod kotom $35{,}2^\circ$ glede na pravokotnico, torej bližje pravokotnici, ker je voda optično gostejša.

### Primer 2: potapljačevo okno

Potapljač je $2{,}0\,\mathrm{m}$ pod mirno gladino in gleda navpično navzgor. Nebo vidi le v svetlem krogu nad seboj, zunaj kroga vidi odsev dna. Kolikšen je mejni kot za mejo voda–zrak in kolikšen je polmer svetlega kroga na gladini?

**Podatki:** $n_1 = 1{,}33$ (voda), $n_2 = 1{,}00$ (zrak), globina $h = 2{,}0\,\mathrm{m}$
**Iščemo:** mejni kot $\alpha_m$ in polmer kroga $r$

:::formula
$\sin\alpha_m = \dfrac{n_2}{n_1}$, nato $r = h \tan\alpha_m$
:::

**Rešitev:**

1. Svetloba z neba se ob vstopu v vodo lomi k pravokotnici. Celo žarek, ki vpada tik ob gladini ($90^\circ$), ima v vodi lomni kot le $\alpha_m$, saj je to obrnjena pot mejnega žarka. Zato je rob kroga tam, kjer žarek do potapljača oklepa s pravokotnico ravno $\alpha_m$.
2. $\sin\alpha_m = \dfrac{1{,}00}{1{,}33} = 0{,}752$, torej $\alpha_m = 48{,}8^\circ$.
3. Rob kroga, potapljač in točka nad njim tvorijo pravokotni trikotnik s kotom $\alpha_m$ ob potapljaču: $\tan 48{,}8^\circ = 1{,}14$.
4. $r = 2{,}0\,\mathrm{m} \cdot 1{,}14 = 2{,}3\,\mathrm{m}$.
5. Odgovor: mejni kot je $48{,}8^\circ$; potapljač vidi nebo v krogu s polmerom okoli $2{,}3\,\mathrm{m}$.

### Primer 3 (težji): fotografija s tekme

Fotograf na atletskem mitingu fotografira tekača, visokega $1{,}80\,\mathrm{m}$, ki je $25\,\mathrm{m}$ od objektiva. Objektiv deluje kot zbiralna leča z goriščno razdaljo $200\,\mathrm{mm}$. Kako daleč za objektivom mora biti tipalo in kako visoka je slika tekača na njem?

**Podatki:** $P = 1{,}80\,\mathrm{m}$, $a = 25\,\mathrm{m}$, $f = 200\,\mathrm{mm} = 0{,}200\,\mathrm{m}$
**Iščemo:** razdaljo slike $b$ in višino slike $S$

:::formula
$\dfrac{1}{b} = \dfrac{1}{f} - \dfrac{1}{a}$, nato $S = P \cdot \dfrac{b}{a}$
:::

**Rešitev:**

1. Enote poenotimo v metre, da se ulomki lahko odštejejo.
2. $\dfrac{1}{b} = \dfrac{1}{0{,}200\,\mathrm{m}} - \dfrac{1}{25\,\mathrm{m}} = 4{,}96\,\mathrm{m^{-1}}$.
3. $b = 0{,}2016\,\mathrm{m} \approx 202\,\mathrm{mm}$. Tipalo je le malo dlje od gorišča, ker je tekač zelo daleč.
4. Višino slike izračunaj sam s povečavo, nato preveri:

:::premisli
Kolikšna je višina slike $S$? Kolikokrat je slika manjša od tekača?
---
$S = 1{,}80\,\mathrm{m} \cdot \dfrac{0{,}2016\,\mathrm{m}}{25\,\mathrm{m}} = 0{,}0145\,\mathrm{m} \approx 14{,}5\,\mathrm{mm}$. Slika je realna, obrnjena in okoli $124$-krat manjša od tekača, zato se celoten tekač ujame na tipalo, visoko $24\,\mathrm{mm}$.
:::

## Pogoste napake

- **»Lomni kot je stalen del vpadnega.«** Pri majhnih kotih skoraj drži, pri velikih ne: pri $80^\circ$ ugibanje zgreši za $12^\circ$. Stalno je razmerje sinusov, zato vedno računaj z $n_1 \sin\alpha = n_2 \sin\beta$.
- **Kot od gladine.** Kdor meri kot od meje namesto od pravokotnice, dobi napačen sinus. Vpadni, odbojni in lomni kot vedno merimo od pravokotnice.
- **Popolni odboj v obe smeri.** Iz zraka v vodo popolnega odboja ni, ker se žarek lomi k pravokotnici in lomljeni žarek vedno obstaja. Popolni odboj je možen samo pri prehodu v snov z manjšim lomnim količnikom.
- **»Zbiralna leča vedno poveča.«** Če je predmet dlje od $2f$, je slika manjša; če je bližje od $f$, je navidezna. Odloča lega predmeta glede na $f$ in $2f$.
- **Obrnjena povečava.** $\dfrac{S}{P} = \dfrac{a}{b}$ je napačno. Slika je večja, kadar je dlje od leče kot predmet, zato je v števcu $b$.

## Povzetek

- Odbojni zakon: odbojni kot je enak vpadnemu, $\alpha' = \alpha$. Kote merimo od pravokotnice.
- Lomni količnik $n = \dfrac{c_0}{c}$: zrak $1{,}00$, voda $1{,}33$, steklo okoli $1{,}5$.
- Lomni zakon $n_1 \sin\alpha = n_2 \sin\beta$; ob prehodu v optično gostejšo snov (večji $n$) se žarek lomi k pravokotnici. Lomni kot ni sorazmeren vpadnemu.
- Popolni odboj nastane pri prehodu v snov z manjšim $n$, ko je vpadni kot večji od mejnega: $\sin\alpha_m = \dfrac{n_2}{n_1}$ (voda–zrak $48{,}8^\circ$). Uporaba: optična vlakna.
- Enačba leče $\dfrac{1}{f} = \dfrac{1}{a} + \dfrac{1}{b}$, povečava $\dfrac{S}{P} = \dfrac{b}{a}$. Predmet dlje od $2f$: manjša realna slika; med $f$ in $2f$: večja realna; bližje od $f$: navidezna, pokončna (lupa).

## Drugače: Kot zgodba

Potapljačica na dnu bazena prižge svetilko in jo usmeri navpično navzgor. Svetloba gre naravnost skozi gladino, saj pri vpadnem kotu $0^\circ$ ni loma, in obsije strop dvorane.

Nato svetilko počasi nagiba. Žarek v vodi oklepa s pravokotnico $20^\circ$, v zraku pa že okoli $27^\circ$: ob izhodu se odkloni od pravokotnice. Pri $40^\circ$ v vodi gre v zraku že pod skoraj $59^\circ$ in osvetli tribuno daleč stran.

Ko nagib v vodi doseže $48{,}8^\circ$, žarek v zraku zdrsi tik ob gladini. Potapljačica nagne še za las. Na stropu ni več nobene svetle pege. Ves snop se odbije od gladine nazaj v vodo, kot da bi bila gladina zrcalo, in posveti na drugi konec bazena. Svetloba je ujeta v vodi.

Prav tako je ujeta v optičnem vlaknu, ki prenaša posnetek tekme v tvoj dom: od stene do stene vlakna se popolnoma odbija, kilometre daleč.

## Drugače: Korak za korakom s številkami

Zbiralna leča ima $f = 10\,\mathrm{cm}$. Predmet postavljamo na različne razdalje. Vsakič izračunamo $\dfrac{1}{b} = \dfrac{1}{f} - \dfrac{1}{a}$ in povečavo $\dfrac{b}{a}$:

| $a$ | $b$ | povečava | slika |
|---|---|---|---|
| $30\,\mathrm{cm}$ | $15\,\mathrm{cm}$ | $0{,}5$ | realna, manjša |
| $20\,\mathrm{cm}$ | $20\,\mathrm{cm}$ | $1$ | realna, enaka |
| $15\,\mathrm{cm}$ | $30\,\mathrm{cm}$ | $2$ | realna, večja |
| $5\,\mathrm{cm}$ | $-10\,\mathrm{cm}$ | $2$ | navidezna, pokončna |

1. Pri $a = 30\,\mathrm{cm}$: $\dfrac{1}{b} = \dfrac{1}{10} - \dfrac{1}{30} = \dfrac{2}{30}$, zato $b = 15\,\mathrm{cm}$.
2. Pri $a = 20\,\mathrm{cm} = 2f$ sta predmet in slika enako oddaljena in enako velika.
3. Pri $a = 15\,\mathrm{cm}$ je $\dfrac{1}{b} = \dfrac{1}{10} - \dfrac{1}{15} = \dfrac{1}{30}$, zato $b = 30\,\mathrm{cm}$.
4. Pri $a = 5\,\mathrm{cm}$ je $\dfrac{1}{b} = \dfrac{1}{10} - \dfrac{1}{5} = -\dfrac{1}{10}$. Negativen $b$ pomeni navidezno sliko pred lečo; povečavo vzamemo kot $\dfrac{|b|}{a} = 2$.

Vidiš: ista leča da manjšo, enako, večjo ali navidezno sliko. Odloča samo, kje stoji predmet.

## Preveri se

? Trije od štirih pripomočkov delujejo zaradi popolnega odboja. Kateri ne spada zraven?
- optično vlakno, ki prenaša televizijski prenos tekme
~ Svetloba v vlaknu se od stene do stene popolnoma odbija, zato spada med primere popolnega odboja.
- briljant, ki se blešči na pokalu
~ Lesk briljanta nastane, ker se svetloba v njem večkrat popolnoma odbije; diamant ima velik $n$ in majhen mejni kot.
+ lupa, s katero sodnik pregleda fotofiniš
- prizma v daljnogledu, ki obrne sliko
~ Prizma v daljnogledu deluje kot zrcalo prav zaradi popolnega odboja na njeni ploskvi.
> Lupa je zbiralna leča: sliko ustvari z lomom svetlobe, ne s popolnim odbojem.

? Kolikšen je mejni kot za prehod svetlobe iz stekla ($n = 1{,}50$) v zrak?
- $48{,}2^\circ$
~ Ta kot dobiš, če kot meriš od meje namesto od pravokotnice (uporabiš kosinus). Kote merimo od pravokotnice.
+ $41{,}8^\circ$
- $33{,}7^\circ$
~ To je $\arctan\dfrac{1}{1{,}50}$. Mejni kot da sinus: $\sin\alpha_m = \dfrac{n_2}{n_1}$.
- Mejnega kota ni, popolni odboj je samo iz zraka v steklo.
~ Ravno obratno: popolni odboj je možen le pri prehodu v snov z manjšim lomnim količnikom, torej iz stekla v zrak.
> $\sin\alpha_m = \dfrac{1{,}00}{1{,}50} = 0{,}667$, torej $\alpha_m = 41{,}8^\circ$.

? Žarek preide iz zraka v vodo in se lomi k pravokotnici. Kaj je vzrok?
- Voda je gostejša od zraka in žarek potisne navzdol.
~ Masna gostota ne odloča: olje je redkejše od vode, pa ima večji lomni količnik. Odloča hitrost svetlobe.
+ Svetloba je v vodi počasnejša kot v zraku, zato ima voda večji lomni količnik.
- Lomni kot je vedno $0{,}75$ vpadnega, zato je manjši.
~ Stalno razmerje kotov velja le približno za majhne kote. Lomni zakon govori o sinusih.
> Večji $n$ pomeni manjšo hitrost svetlobe; iz $n_1 \sin\alpha = n_2 \sin\beta$ sledi pri $n_2 > n_1$ manjši $\beta$.

? Učenec računa sliko za zbiralno lečo z $f = 10\,\mathrm{cm}$ in predmet pri $a = 15\,\mathrm{cm}$. (1) $\dfrac{1}{b} = \dfrac{1}{f} - \dfrac{1}{a}$. (2) $\dfrac{1}{b} = \dfrac{1}{10} - \dfrac{1}{15} = \dfrac{1}{30}$. (3) $b = 30\,\mathrm{cm}$. (4) Povečava $\dfrac{a}{b} = 0{,}5$, slika je manjša. Kateri korak je napačen?
- korak (1)
~ Korak (1) je pravilen: iz enačbe leče izrazimo $\dfrac{1}{b}$.
- korak (2)
~ Odštevanje je pravilno: $\dfrac{3}{30} - \dfrac{2}{30} = \dfrac{1}{30}$.
- korak (3)
~ Iz $\dfrac{1}{b} = \dfrac{1}{30}$ res sledi $b = 30\,\mathrm{cm}$.
+ korak (4)
> Povečava je $\dfrac{b}{a} = \dfrac{30}{15} = 2$: slika je dvakrat večja. Ulomek je bil obrnjen.

? Podvodni ribič stoji na skali in s harpuno meri na ribo, ki jo vidi v vodi poševno pred seboj. Kam mora meriti?
- Natanko tja, kjer vidi ribo.
~ Žarek od ribe se na gladini lomi, zato oko ribo postavi drugam, kot v resnici je.
- Nad ribo, ker je riba v resnici bliže gladini.
~ Ravno obratno: plitveje je slika, ki jo vidimo; prava riba je globlje.
+ Pod ribo, ker je riba globlje, kot se zdi.
> Svetloba od ribe se ob izhodu iz vode lomi od pravokotnice. Oko podaljša žarek naravnost nazaj in vidi ribo više, kot je, zato mora ribič meriti pod njeno sliko.

:::simboli
\alpha | vpadni kot | | ° | merjen od pravokotnice
\alpha' | odbojni kot | \alpha' = \alpha | °
\beta | lomni kot | n_1 \sin\alpha = n_2 \sin\beta | °
n | lomni količnik | n = \frac{c_0}{c} | –
n_1 | lomni količnik snovi, iz katere svetloba prihaja | | –
n_2 | lomni količnik snovi, v katero svetloba gre | | –
c_0 | hitrost svetlobe v vakuumu | | m/s | $3{,}00\cdot10^{8}\,\mathrm{m/s}$
c | hitrost svetlobe v snovi | c = \frac{c_0}{n} | m/s
\alpha_m | mejni kot | \sin\alpha_m = \frac{n_2}{n_1} | ° | samo pri $n_2 < n_1$
h | globina potapljača | | m
r | polmer svetlega kroga | r = h \tan\alpha_m | m
f | goriščna razdalja | \frac{1}{f} = \frac{1}{a} + \frac{1}{b} | m | negativna pri razpršilni leči
a | razdalja predmeta od leče | | m
b | razdalja slike od leče | \frac{1}{b} = \frac{1}{f} - \frac{1}{a} | m | negativna pri navidezni sliki
P | višina predmeta | | m
S | višina slike | S = P \cdot \frac{b}{a} | m
:::
