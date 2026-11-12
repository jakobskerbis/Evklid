---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Maja je biomedicinska inženirka in pripravlja preskus za napravo CT. Rentgenska cev kroži po krožnem tiru s središčem $O$. Ploščat detektor je pritrjen tako, da njegova robova $A$ in $B$ ležita na istem tiru, središčni kot $\angle AOB$ pa meri $80^\circ$. Cev oddaja pahljačo žarkov. Maja mora izbrati, kako široka naj bo pahljača, da detektor natanko zapolni. Boji se, da bo morala kot pahljače nastavljati za vsako lego cevi posebej.

Ni ji treba. Iz vsake točke na večjem loku tira se detektor vidi pod istim kotom, $40^\circ$. Zakaj je tako, in kaj iz tega sledi za štirikotnike z oglišči na krožnici, je najpogostejše orodje tekmovalne geometrije: lovljenje kotov.

## Razlaga

**Najprej en sam primer.** Postavimo cev v točko $P$, ki leži nasproti $A$, tako da je $PA$ premer tira. Narišemo še polmer $OB$.

Ker sta $OP$ in $OB$ polmera, je trikotnik $OPB$ enakokrak. Kota ob osnovnici sta enaka: $\angle OPB = \angle OBP$. Točke $P$, $O$, $A$ ležijo na premici, zato je $\angle AOB$ zunanji kot trikotnika $OPB$. Zunanji kot je enak vsoti notranjih nesosednjih kotov, torej je dvakrat večji od $\angle OPB$. Ker je $\angle AOB = 80^\circ$, je $\angle OPB = 40^\circ$. Točka $O$ leži na kraku $PA$, zato je tudi $\angle APB = 40^\circ$.

**Imena.** **Središčni kot** nad tetivo $AB$ ima vrh v središču krožnice, oznaka $\omega$. **Obodni kot** ima vrh $P$ na krožnici, kraka pa gresta skozi $A$ in $B$, oznaka $\varphi$. Kot $\varphi$ stoji nad tistim lokom $AB$, ki ne vsebuje $P$.

**Posplošitev: izrek o obodnem kotu.** Obodni kot je polovica središčnega kota nad istim lokom:

$$\varphi = \frac{\omega}{2}$$

Če $P$ ni nasproti $A$, narišemo premer $PP'$. Kadar leži središče $O$ znotraj kota $APB$, premer kot razdeli na dva dela. Za vsak del velja zgornji primer, ker ima en krak skozi središče: vsak del je polovica svojega središčnega kota ($\angle AOP'$ oziroma $\angle P'OB$). Ta dva središčna kota se seštejeta v $\angle AOB$, zato se dela seštejeta v $\frac{\omega}{2}$. Kadar leži $O$ zunaj kota, ista dva kota odštejemo.

:::risba skica
opis: Krožnica s središčem O. Točki A in B sta spodaj, črtkana polmera OA in OB oklepata kot 80°. Na zgornjem, večjem loku sta točki P in Q. Obe sta povezani z A in B, oba obodna kota merita 40°.
območje: -2,8; -2,6 .. 2,8; 2,6
enota: 50
krog: 0; 0 | 2 | siva
črta: -1,29; -1,53 -> 0; 0 -> 1,29; -1,53 | modra črtkano
črta: -1,29; -1,53 -> -1; 1,73 -> 1,29; -1,53 | oranžna
črta: -1,29; -1,53 -> 1,73; 1 -> 1,29; -1,53 | zelena
točka: 0; 0 | O | nad
točka: -1,29; -1,53 | A | pod levo
točka: 1,29; -1,53 | B | pod desno
točka: -1; 1,73 | P | nad levo
točka: 1,73; 1 | Q | desno
napis: 0; -0,55 | 80° | sredina
napis: -0,85; 1,2 | 40° | sredina
napis: 1,3; 0,55 | 40° | sredina
:::

:::premisli
Ko se $P$ po večjem loku približuje točki $A$, je krak $PA$ vse krajši. Kaj se dogaja s kotom $\angle APB$, kaj postane krak $PA$, ko $P$ doseže $A$, in koliko tedaj meri kot med njim in tetivo $AB$? Napovej, nato preveri z izrekom.
---
Kot ostane $40^\circ$. Krak $PA$ je vse krajši, njegova smer pa se približuje tangenti v točki $A$. Velikost kota je ves čas polovica istega središčnega kota $80^\circ$. Ko $P$ doseže $A$, kot med tangento in tetivo $AB$ meri prav tako $40^\circ$.
:::

**Tri posledice.**

1. Vsi obodni koti nad istim lokom so enaki. Maja nastavi pahljačo enkrat za vse lege cevi.
2. **Talesov izrek:** če je $AB$ premer, je $\omega = 180^\circ$, zato je obodni kot $90^\circ$.
3. Točka $R$ na manjšem loku vidi tetivo pod kotom $180^\circ - \varphi$. Ta kot stoji namreč nad večjim lokom, katerega središčni kot je $360^\circ - \omega$, polovica tega pa je $180^\circ - \varphi$. Za Majin tir: $180^\circ - 40^\circ = 140^\circ$.

V simulaciji spodaj, »Obodni in središčni kot«, premikaj vrh obodnega kota po krožnici. Opazuj, da se kot ne spremeni, dokler vrh ne preide na drugi lok; takrat skoči na $180^\circ - \varphi$.

**Tetivni štirikotnik.** Štirikotnik $ABCD$, ki ima vsa štiri oglišča na isti krožnici, je **tetiven**. Notranji kot $\alpha$ pri $A$ in $\gamma$ pri $C$ sta obodna kota nad dvema različnima lokoma $BD$: vsak stoji nad lokom, ki ne vsebuje njegovega vrha. Loka skupaj tvorita vso krožnico. Njuna središčna kota se seštejeta v $360^\circ$, zato v tetivnem štirikotniku velja

$$\alpha + \gamma = 180^\circ$$

in enako $\beta + \delta = 180^\circ$.

**Pogoji tetivnosti.** Na tekmovanjih je pomembnejši obrat: kdaj smemo sklepati, da štiri točke ležijo na krožnici. Konveksen štirikotnik $ABCD$ je tetiven natanko tedaj, ko velja katerikoli od teh pogojev (v tetivnem štirikotniku zato veljajo vsi trije):

1. Nasprotna kota se seštejeta v $180^\circ$.
2. Zunanji kot pri enem oglišču je enak notranjemu kotu pri nasprotnem oglišču.
3. Stranica se iz drugih dveh oglišč vidi pod enakim kotom, na primer $\angle ACB = \angle ADB$, pri čemer $C$ in $D$ ležita na isti strani premice $AB$.

Pogoj 2 je le drugače zapisan pogoj 1. Pogoj 3 je obrat prve posledice. Pri pogoju 3 je posebej uporaben Talesov primer: dva prava kota nad isto daljico pomenita krožnico s to daljico kot premerom.

:::premisli
Zakaj je vsak pravokotnik tetiven, romb, ki ni kvadrat, pa ne?
---
Pri pravokotniku je $\alpha + \gamma = 90^\circ + 90^\circ = 180^\circ$. Pri rombu sta nasprotna kota enaka, $\alpha = \gamma$. Vsota $180^\circ$ bi pomenila $\alpha = 90^\circ$, torej kvadrat.
:::

**Strategija lovljenja kotov.** En neznan kot označi s črko. Poišči četverice točk na krožnici in kote prenašaj prek tetiv: koti nad isto tetivo z iste strani so enaki, z nasprotnih strani se seštejejo v $180^\circ$. Kadar vidiš dva prava kota nad isto daljico, nariši krožnico, čeprav je naloga ne omenja.

## Rešeni primeri

### Primer 1 (lažji): pahljača žarkov

Na drugi napravi CT ležita robova detektorja $A$ in $B$ na tiru tako, da središčni kot $\angle AOB$ meri $110^\circ$. Pod kolikšnim kotom se detektor vidi iz lege cevi $P$ na večjem loku? In iz točke $R$ na manjšem loku?

**Podatki:** $\omega = 110^\circ$, $P$ na večjem loku, $R$ na manjšem loku
**Iščemo:** $\angle APB$ in $\angle ARB$

:::formula
$\varphi = \dfrac{\omega}{2}$; na drugem loku $180^\circ - \varphi$
:::

**Rešitev:**

1. Iz lege $P$ je to obodni kot nad manjšim lokom: $\varphi = \frac{110^\circ}{2} = 55^\circ$.
2. Štirikotnik $APBR$ je tetiven, $P$ in $R$ sta nasprotni oglišči, zato $\angle ARB = 180^\circ - 55^\circ = 125^\circ$.
3. Odgovor: pahljača naj bo široka $55^\circ$, iz točke na manjšem loku pa bi se detektor videl pod kotom $125^\circ$.

### Primer 2: koti potujejo po tetivah

Štirikotnik $ABCD$ je tetiven. Znano je $\angle BAC = 35^\circ$, $\angle CAD = 40^\circ$ in $\angle ACD = 55^\circ$. Izračunaj $\angle ABC$ in $\angle BCD$.

**Podatki:** $ABCD$ tetiven, $\angle BAC = 35^\circ$, $\angle CAD = 40^\circ$, $\angle ACD = 55^\circ$
**Iščemo:** $\angle ABC$ in $\angle BCD$

:::formula
Obodni koti nad isto tetivo z iste strani so enaki; $\alpha + \gamma = 180^\circ$
:::

**Rešitev:**

1. Diagonala $AC$ razdeli kot pri $A$: $\angle BAD = 35^\circ + 40^\circ = 75^\circ$.
2. Kot pri $C$ je nasproten kotu pri $A$: $\angle BCD = 180^\circ - 75^\circ = 105^\circ$.
3. Kota $\angle ABD$ in $\angle ACD$ sta obodna nad tetivo $AD$, $B$ in $C$ sta na isti strani, zato $\angle ABD = 55^\circ$.
4. Kota $\angle DBC$ in $\angle DAC$ sta obodna nad tetivo $DC$, $A$ in $B$ sta na isti strani, zato $\angle DBC = 40^\circ$.
5. Seštejemo: $\angle ABC = 55^\circ + 40^\circ = 95^\circ$.
6. Preizkus: $\angle ADC = 180^\circ - 95^\circ = 85^\circ$, v trikotniku $ACD$ pa $40^\circ + 55^\circ + 85^\circ = 180^\circ$.
7. Odgovor: $\angle ABC = 95^\circ$ in $\angle BCD = 105^\circ$.

### Primer 3 (težji): višine trikotnika

V ostrokotnem trikotniku $ABC$ je $\angle BAC = 58^\circ$ in $\angle ABC = 70^\circ$. Točka $D$ je nožišče višine iz $A$, točka $E$ nožišče višine iz $B$, $H$ pa višinska točka. Izračunaj $\angle CDE$, $\angle AHB$ in $\angle CED$.

**Podatki:** ostrokoten trikotnik $ABC$, $\angle BAC = 58^\circ$, $\angle ABC = 70^\circ$, $AD \perp BC$, $BE \perp AC$, $H$ presečišče višin
**Iščemo:** $\angle CDE$, $\angle AHB$, $\angle CED$

:::formula
Talesov izrek (pravi kot nad $AB$ pomeni krožnico s premerom $AB$); pogoja tetivnosti 1 in 2
:::

**Rešitev:**

1. Kota $\angle ADB$ in $\angle AEB$ sta prava. Točki $D$ in $E$ vidita daljico $AB$ pod pravim kotom, zato ležita na krožnici s premerom $AB$. Štirikotnik $ABDE$ je tetiven.
2. $\angle CDE$ je zunanji kot štirikotnika $ABDE$ pri $D$. Nasprotno oglišče je $A$, zato po pogoju 2 velja $\angle CDE = \angle BAC = 58^\circ$.
3. Tretji kot trikotnika: $\angle ACB = 180^\circ - 58^\circ - 70^\circ = 52^\circ$.
4. Štirikotnik $CDHE$ ima prava kota pri $D$ in $E$, ki se seštejeta v $180^\circ$, zato je tetiven. Kot pri $H$ je nasproten kotu pri $C$: $\angle DHE = 180^\circ - 52^\circ = 128^\circ$.
5. $\angle AHB$ in $\angle DHE$ sta sovršna kota, zato $\angle AHB = 128^\circ$.
6. Kot $\angle CED$ izračunaj sam.

:::premisli
Kolikšen je $\angle CED$ in zakaj? Uporabi isti štirikotnik kot v koraku 2.
---
$\angle CED$ je zunanji kot štirikotnika $ABDE$ pri $E$. Nasprotno oglišče je $B$, zato $\angle CED = \angle ABC = 70^\circ$. Preizkus v trikotniku $CDE$: $58^\circ + 70^\circ + 52^\circ = 180^\circ$. Trikotnik $CDE$ ima iste kote kot $ABC$, le pri zamenjanih ogliščih.
:::

## Pogoste napake

- **Obodni kot enak središčnemu.** Pri $\omega = 140^\circ$ nekateri napišejo tudi $\varphi = 140^\circ$ ali ga podvojijo. Obodni kot je *polovica*: $70^\circ$. Pomaga skica: središče je bližje tetivi kot vrh na krožnici, zato vidi tetivo pod večjim kotom.
- **Napačen lok.** Vrh na manjšem loku ne vidi tetive pod $\frac{\omega}{2}$, ampak pod $180^\circ - \frac{\omega}{2}$. Pred računom preveri, ali sta vrh in središče na isti strani tetive.
- **Sosednja kota namesto nasprotnih.** V tetivnem štirikotniku z $\alpha = 80^\circ$ ni nujno $\beta = 100^\circ$; to bi veljalo za paralelogram ali ob kraku trapeza. Gotovo je le $\gamma = 100^\circ$.
- **Enaka kota z različnih strani.** Pogoj 3 zahteva, da $C$ in $D$ ležita na isti strani premice $AB$. Če ležita na različnih straneh, se kota $\angle ACB$ in $\angle ADB$ seštejeta v $180^\circ$.
- **Tetivnost s slike.** »Na sliki je videti, da ležijo na krožnici« ni dokaz. Preden uporabiš lastnosti tetivnega štirikotnika, tetivnost dokaži z enim od pogojev.

## Povzetek

- Središčni kot $\omega$ ima vrh v središču, obodni kot $\varphi$ na krožnici; nad istim lokom velja $\varphi = \frac{\omega}{2}$.
- Vsi obodni koti nad istim lokom so enaki; vrh na drugem loku vidi tetivo pod $180^\circ - \varphi$.
- Talesov izrek: obodni kot nad premerom je $90^\circ$.
- Tetivni štirikotnik ima vsa oglišča na krožnici; nasprotna kota se seštejeta v $180^\circ$.
- Pogoji tetivnosti: vsota nasprotnih kotov $180^\circ$; zunanji kot enak nasprotnemu notranjemu; stranica vidna iz drugih dveh oglišč pod enakim kotom (z iste strani).
- Dva prava kota nad isto daljico dasta krožnico, ki ima to daljico za premer, npr. pri nožiščih višin.

## Drugače: Z analogijo

Pomisli na nogometaša, ki strelja proti golu. Vratnici sta $A$ in $B$, **strelni kot** je kot, pod katerim igralec vidi odprtino gola.

- Vse točke na loku krožnice skozi obe vratnici imajo enak strelni kot. Igralec lahko teče po tem loku in vrata »ostanejo enako velika«.
- Kdor stopi znotraj tega kroga, vidi vrata pod večjim kotom; kdor stopi ven, pod manjšim.

Druga alineja je jedro pogoja 3. Če se stranica $AB$ iz $C$ in $D$ vidi pod enakim kotom, $D$ ne more biti ne znotraj ne zunaj krožnice skozi $A$, $B$, $C$: biti mora na njej. Primerjava ima mejo: igrišče je ravnina z eno stranjo gola, krožnica pa ima tudi drugi lok, kjer je kot $180^\circ - \varphi$.

## Drugače: Bolj natančno

**Dokaz pogoja 1.** Naj bo $\beta + \delta = 180^\circ$. Nariši krožnico skozi $A$, $B$, $C$. Premica $AD$ jo seka še v točki $D'$ na loku, ki ne vsebuje $B$. Štirikotnik $ABCD'$ je tetiven, zato $\angle AD'C = 180^\circ - \beta = \delta$. Če bi bila $D \ne D'$, bi bil eden od kotov $\angle ADC$ in $\angle AD'C$ zunanji kot trikotnika $CDD'$ in zato strogo večji od drugega. To nasprotuje enakosti, zato je $D = D'$.

**Kot med tetivo in tangento.** Ko vrh obodnega kota zdrsne v krajišče $A$, krak $PA$ postane tangenta. Kot med tangento v $A$ in tetivo $AB$ je zato enak obodnemu kotu nad tetivo $AB$ z druge strani. Na tekmovanjih ga uporabljaš kot »obodni kot z vrhom v krajišču tetive«.

**Konveksnost.** Pogoji so zapisani za konveksen štirikotnik z oglišči v vrstnem redu $A$, $B$, $C$, $D$. Pri točkah v drugem vrstnem redu najprej ugotovi, ali sta točki na isti ali na različnih straneh premice; od tega je odvisno, ali iščeš enaka kota ali kota z vsoto $180^\circ$.

## Preveri se

? Kateri štirikotnik izstopa, ker **ni nujno** tetiven?
- kvadrat
~ Kvadrat ima vse kote prave, nasprotna se seštejeta v $180^\circ$.
- enakokraki trapez
~ Kota ob isti osnovnici sta enaka, kota ob kraku pa se seštejeta v $180^\circ$. Zato je tudi vsota nasprotnih kotov $180^\circ$: trapez je tetiven.
+ romb
- pravokotnik
~ Vsi koti so pravi, $90^\circ + 90^\circ = 180^\circ$.
> Romb s kotom $60^\circ$ ima nasprotna kota $60^\circ$ in $60^\circ$, vsota je $120^\circ$, zato ni tetiven. Tetiven je le romb, ki je kvadrat.

? Na risbi je $O$ središče krožnice in $\angle AOB = 140^\circ$. Točka $P$ leži na večjem loku. Koliko stopinj meri $\angle APB$?
:::risba skica
opis: Krožnica s središčem O. Točki A in B sta nekoliko pod središčem, črtkana polmera OA in OB oklepata kot 140°. Točka P je zgoraj na večjem loku in je povezana z A in B; kot pri P je označen z vprašajem.
območje: -2,8; -2,6 .. 2,8; 2,6
enota: 50
krog: 0; 0 | 2 | siva
črta: -1,88; -0,68 -> 0; 0 -> 1,88; -0,68 | modra črtkano
črta: -1,88; -0,68 -> -0,35; 1,97 -> 1,88; -0,68 | oranžna
točka: 0; 0 | O | nad
točka: -1,88; -0,68 | A | levo
točka: 1,88; -0,68 | B | desno
točka: -0,35; 1,97 | P | nad
napis: 0; -0,5 | 140° | sredina
napis: -0,28; 1,45 | ? | sredina
:::
= 70
~ 140 | To je središčni kot. Obodni kot je njegova polovica.
~ 110 | Tako vidi tetivo točka na manjšem loku, $180^\circ - 70^\circ$. Točka $P$ pa je na večjem loku.
~ 35 | Polovico si vzel dvakrat. Obodni kot je polovica središčnega, ne četrtina.
> $\varphi = \frac{140^\circ}{2} = 70^\circ$.

? Točko $P$ premikamo po večjem loku $AB$, točki $A$ in $B$ mirujeta. Kaj se zgodi s kotom $\angle APB$?
- Narašča, ko se $P$ bliža točki $A$.
~ Krak $PA$ se krajša, a velikost kota ni odvisna od dolžine krakov. Kot je ves čas polovica istega središčnega kota.
- Največji je, ko leži $P$ na simetrali tetive $AB$.
~ Občutek »od spredaj vidim največ« tu ne drži. Vse točke loka vidijo tetivo enako; večji kot imajo šele točke znotraj kroga.
+ Ostane enak, ker je vedno polovica istega središčnega kota $\angle AOB$.
> Vzrok: obodni kot je odvisen le od loka, nad katerim stoji, ne od lege vrha na drugem loku. Posledica: Maja nastavi pahljačo enkrat za vse lege cevi.

? Luka rešuje nalogo: »$ABCD$ je tetiven, $\angle A = 80^\circ$, $\angle B = 70^\circ$. Izračunaj $\angle C$ in $\angle D$.« Kateri korak je napačen?
Korak 1: $A$ in $C$ sta nasprotna, zato $\angle C = 180^\circ - 80^\circ = 100^\circ$.
Korak 2: $A$ in $D$ se seštejeta v $180^\circ$, zato $\angle D = 100^\circ$.
Korak 3: vsota kotov štirikotnika je $360^\circ$.
- Korak 1
~ $A$ in $C$ sta res nasprotna, vsota $180^\circ$ je pravilna.
+ Korak 2
- Korak 3
~ Vsota notranjih kotov je $360^\circ$ v vsakem konveksnem štirikotniku.
- Noben korak ni napačen.
~ Preizkus pokaže napako: $80^\circ + 70^\circ + 100^\circ + 100^\circ = 350^\circ$, ne $360^\circ$.
> $A$ in $D$ sta sosednja kota. Nasproten kotu $D$ je kot $B$, zato $\angle D = 180^\circ - 70^\circ = 110^\circ$.

? Razvrsti korake dokaza, da je $\angle APB$ polovica $\angle AOB$, kadar je $PA$ premer.
1. Narišemo polmer $OB$, ki je enako dolg kot $OP$.
2. Trikotnik $OPB$ je enakokrak, zato $\angle OPB = \angle OBP$.
3. $\angle AOB$ je zunanji kot trikotnika $OPB$, torej vsota teh dveh enakih kotov.
4. Zato je $\angle AOB$ dvakrat večji od $\angle OPB$, ki je isti kot $\angle APB$.
> Brez enakih polmerov ni enakokrakega trikotnika, brez njega ne vemo, da sta nesosednja kota enaka; zunanji kot ju šele nato sešteje.

<<RACUN
vrednost: 80/2 | 40
vrednost: 180-40 | 140
vrednost: 110/2 | 55
vrednost: 180-55 | 125
vrednost: 35+40 | 75
vrednost: 180-75 | 105
vrednost: 55+40 | 95
vrednost: 180-95 | 85
vrednost: 40+55+85 | 180
vrednost: 180-58-70 | 52
vrednost: 180-52 | 128
vrednost: 58+70+52 | 180
vrednost: 140/2 | 70
vrednost: 180-70 | 110
vrednost: 80+70+100+100 | 350
>>

:::simboli
\varphi | obodni kot | \varphi = \frac{\omega}{2} | ^\circ | vrh na krožnici
\omega | središčni kot | | ^\circ | vrh v središču $O$
\alpha | notranji kot pri oglišču $A$ | | ^\circ |
\beta | notranji kot pri oglišču $B$ | | ^\circ |
\gamma | notranji kot pri oglišču $C$ | | ^\circ | v tetivnem štirikotniku $\gamma = 180^\circ - \alpha$
\delta | notranji kot pri oglišču $D$ | | ^\circ |
A, B | krajišči tetive $AB$ (oglišči štirikotnika ali trikotnika) | | |
:::
