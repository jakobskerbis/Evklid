---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Fizioterapevtka meri kot v komolcu očetu in njegovi šestletni hčerki. Oba držita kozarec vode z enako pokrčeno roko. Kateri kot je večji? Skoraj vsak bi rekel: očetov, saj je njegova roka mnogo daljša. Kotomer pa pri obeh pokaže $90^\circ$.

Še ena nenavadna reč. Zdravnica pogleda dlan skozi povečevalno steklo, ki vse poveča trikrat. Črti na dlani sta videti trikrat daljši. Kot, pod katerim se sekata, pa ostane popolnoma enak.

Kako je to mogoče? Odgovor se skriva v tem, kaj kot sploh je. Ko to razumeš, znaš kot izmeriti, narisati in poimenovati. Fizioterapevti s koti spremljajo, kako se koleno po poškodbi spet upogiba. Ti jih boš potreboval pri krogu, konstrukcijah in simetriji.

## Razlaga

**1. Mamljiva, a napačna ideja.** Oglej si kota na sliki.

:::risba skica
opis: Dva kota drug ob drugem. Levi kot α ima dolga kraka, dolga 4 enote, in meri 40 stopinj. Desni kot β ima kratka kraka, dolga 1,5 enote, in meri 70 stopinj. Pri obeh vrhih je narisan majhen lok.
območje: 0; 0 .. 9; 3,5
črta: 0,5; 0,5 -> 4,5; 0,5 | modra
črta: 0,5; 0,5 -> 3,56; 3,07 | modra
črta: 1,4; 0,5 -> 1,39; 0,66 -> 1,35; 0,81 -> 1,28; 0,95 -> 1,19; 1,08
napis: 1,82; 0,98 | α | desno
črta: 6,5; 0,5 -> 8; 0,5 | oranžna
črta: 6,5; 0,5 -> 7,01; 1,91 | oranžna
črta: 7,1; 0,5 -> 7,08; 0,65 -> 7,03; 0,78 -> 6,95; 0,9 -> 6,84; 1 -> 6,71; 1,06
napis: 7,32; 1,07 | β | desno
:::

Črti, ki sestavljata kot, imenujemo **kraka**. Oko najprej reče: levi kot je večji, saj sta njegova kraka dolga in zavzameta več papirja. Ali ima oko prav?

:::premisli
Kateri kot je večji, $\alpha$ ali $\beta$? Napovej, nato pomisli, kaj pravzaprav primerjaš: dolžino krakov ali razprtost.
---
Večji je $\beta$: meri $70^\circ$, $\alpha$ pa le $40^\circ$. Kraka kota $\beta$ sta bolj razprta, čeprav sta krajša. Dolžina krakov pri velikosti kota ne šteje.
:::

**2. Kaj je kot.** Dva poltraka, ki imata isto krajišče, delita ravnino na dva dela. Vsak od obeh delov je **kot**. Skupno krajišče poltrakov imenujemo **vrh** kota, poltraka pa sta **kraka** kota.

Poltrak je neomejen. Na papirju narišemo le njegov začetni del, zato narisana dolžina kraka ni lastnost kota. **Velikost kota** pove samo, kako močno sta kraka razprta.

Kot zapišemo s tremi točkami: $\angle AVB$. Črka v sredini je vedno vrh $V$, črki $A$ in $B$ sta točki na krakih. Pogosto ga označimo kar z grško črko: $\alpha$ (alfa), $\beta$ (beta), $\gamma$ (gama). Na sliki ga pokažemo z majhnim lokom med krakoma.

**3. Enota stopinja.** Velikost kota merimo v **stopinjah**, znak je $^\circ$. Če poltrak zavrtimo okoli krajišča za cel krog nazaj v začetno lego, opiše **polni kot**, ki meri $360^\circ$. Ena stopinja je torej tristošestdesetinka polnega kota:

$$1^\circ = \frac{1}{360} \text{ polnega kota}$$

:::premisli
Zakaj lupa, ki sliko poveča trikrat, ne poveča tudi kota med črtama na dlani?
---
Lupa vsako črto podaljša, ne zasuka pa je. Kraka ostaneta enako razprta, zato kot ostane enak. Trikrat daljša sta le narisana dela krakov.
:::

**4. Vrste kotov.** Kote razvrščamo po velikosti:

| Vrsta | Velikost | Primer |
|---|---|---|
| ničelni | $0^\circ$ | zaprte škarje |
| ostri | med $0^\circ$ in $90^\circ$ | prsti v znaku V |
| pravi | $90^\circ$ | komolec, ko nosiš pladenj |
| topi | med $90^\circ$ in $180^\circ$ | rahlo pokrčeno koleno |
| iztegnjeni | $180^\circ$ | iztegnjena roka v komolcu |
| udrti | med $180^\circ$ in $360^\circ$ | zunanja stran komolca |
| polni | $360^\circ$ | cel obrat na stolu |

Pravi kot je meja med ostrimi in topimi koti, zato ni ne ostri ne topi. Označimo ga z lokom in piko v njem.

Kraka vedno določata dva kota, ki skupaj merita $360^\circ$; če je eden ostri, pravi ali topi, je drugi udrti. Če ni drugače rečeno, z zapisom $\angle AVB$ mislimo kot, ki ni večji od iztegnjenega.

**5. Merjenje s kotomerom.** Kotomer je polkrožno merilo z lestvico od $0^\circ$ do $180^\circ$ (ima ga tudi geotrikotnik). Ima dve lestvici, ki tečeta v nasprotnih smereh. Postopek:

1. Središče kotomera (majhna zareza ali križec) položi na vrh kota.
2. Ničelno črto kotomera položi na en krak kota.
3. Preberi številko tam, kjer drugi krak seka lestvico. Uporabi lestvico, ki se na prvem kraku začne z $0$.
4. Če je krak prekratek, ga podaljšaj z ravnilom. Kot se pri tem ne spremeni.

Pred merjenjem vedno oceni: je kot ožji ali širši od vogala lista, ki je pravi kot? Če je širši, je topi in kotomer mora pokazati več kot $90^\circ$. To je najboljši preizkus, da si bral pravo lestvico.

Udrti kot izmeriš posredno: izmeri drugi kot pri istih krakih in ga odštej od $360^\circ$.

V simulaciji spodaj (»Kot in kotomer«) povleci krak tako, da bo kot topi, nato ga zavrti še čez $180^\circ$. Opazuj, pri kateri velikosti se spremeni ime kota in kako simulacija izmeri udrti kot.

**6. Risanje kota.** Kot $\alpha = 70^\circ$ narišeš takole: nariši poltrak z vrhom $V$ in nanj položi kotomer kot pri merjenju. Na lestvici, ki se na poltraku začne z $0$, poišči $70$ in tam nariši piko. Nato nariši drugi poltrak od $V$ skozi piko.

**7. Računanje s koti.** Dva kota sta **sosednja**, če imata skupen vrh in en skupen krak, ne prekrivata pa se. Njuna vsota je kot, ki ga skupaj zajemata: $\angle AVC = \angle AVB + \angle BVC$.

Kar kotu $\alpha$ manjka do iztegnjenega kota, meri $180^\circ - \alpha$. Kraka kota $\alpha$ (kjer je $0^\circ < \alpha < 180^\circ$) določata še udrti kot, ki meri $360^\circ - \alpha$.

Fizioterapevti pogosto ne zapišejo kota v kolenu, ampak **upogib** $u$: za koliko je koleno upognjeno iz iztegnjene lege. Kot med stegnom in golenjo je takrat

$$\alpha = 180^\circ - u$$

Večji upogib pomeni manjši kot.

## Rešeni primeri

### Primer 1 (lažji)

Fizioterapevtka je v kartoteko zapisala pet kotov: $35^\circ$, $90^\circ$, $128^\circ$, $180^\circ$ in $250^\circ$ (zadnji je na zunanji strani pokrčenega komolca). Razvrsti vsakega med ostre, prave, tope, iztegnjene ali udrte kote.

**Podatki:** koti $35^\circ$, $90^\circ$, $128^\circ$, $180^\circ$, $250^\circ$ (računanja ni, dane so samo velikosti)
**Iščemo:** vrsto vsakega kota

:::formula
ostri: $0^\circ < \alpha < 90^\circ$; pravi: $\alpha = 90^\circ$; topi: $90^\circ < \alpha < 180^\circ$; iztegnjeni: $\alpha = 180^\circ$; udrti: $180^\circ < \alpha < 360^\circ$
:::

**Rešitev:**

1. $35^\circ$: velja $0^\circ < 35^\circ < 90^\circ$, kot je ostri.
2. $90^\circ$: natanko toliko meri vogal lista, kot je pravi.
3. $128^\circ$: velja $90^\circ < 128^\circ < 180^\circ$, kot je topi.
4. $180^\circ$: kraka sestavljata premico, kot je iztegnjeni.
5. $250^\circ$: velja $180^\circ < 250^\circ < 360^\circ$, kot je udrti.
6. Odgovor: po vrsti so koti ostri, pravi, topi, iztegnjeni in udrti.

### Primer 2 (srednji)

Roka visi ob telesu. Vrh kota $V$ je v rami, krak $VA$ kaže ob trupu navzdol. Pri vaji bolnik roko dvigne vstran za $\angle AVB = 38^\circ$, nato še za $\angle BVC = 52^\circ$. Kolikšen je kot $\angle AVC$ med roko in trupom in kakšne vrste je? Koliko manjka, da bi bila roka navpično nad glavo (iztegnjeni kot)?

**Podatki:** $\angle AVB = 38^\circ$, $\angle BVC = 52^\circ$, kota sta sosednja (skupni krak $VB$), roka nad glavo pomeni $180^\circ$
**Iščemo:** $\angle AVC$, njegovo vrsto in kot, ki manjka do $180^\circ$

:::formula
vsota sosednjih kotov: $\angle AVC = \angle AVB + \angle BVC$; do iztegnjenega manjka $180^\circ - \angle AVC$
:::

**Rešitev:**

1. Sosednja kota seštejemo: $\angle AVC = 38^\circ + 52^\circ = 90^\circ$.
2. Kot meri natanko $90^\circ$, zato je pravi: roka je vodoravna.
3. Do iztegnjenega kota manjka $180^\circ - 90^\circ = 90^\circ$.
4. Preizkus: $90^\circ + 90^\circ = 180^\circ$.
5. Odgovor: roka in trup oklepata pravi kot $90^\circ$; do roke nad glavo manjka še $90^\circ$.

### Primer 3 (težji): zdaj ti

Po operaciji kolena fizioterapevtka zapiše: »upogib $65^\circ$«. Kolikšen je kot med stegnom in golenjo in kakšne vrste je? Po dveh tednih vaj je upogib za $30^\circ$ večji. Kolikšen je kot zdaj in kakšne vrste je?

**Podatki:** prvi upogib $u_1 = 65^\circ$, drugi upogib je za $30^\circ$ večji, iztegnjena noga $= 180^\circ$
**Iščemo:** kota $\alpha_1$ in $\alpha_2$ med stegnom in golenjo ter njuni vrsti

:::formula
$\alpha = 180^\circ - u$
:::

**Rešitev:**

1. Iztegnjena noga je iztegnjeni kot, $180^\circ$. Upogib pove, koliko od tega manjka.
2. $\alpha_1 = 180^\circ - 65^\circ = 115^\circ$. Ker je $90^\circ < 115^\circ < 180^\circ$, je kot topi.
3. Nov upogib: $u_2 = 65^\circ + 30^\circ = 95^\circ$.
4. Izračunaj $\alpha_2$ sam in ugotovi, kakšne vrste je. Nato preveri:

:::premisli
Koliko meri $\alpha_2$ in kakšne vrste je?
---
$\alpha_2 = 180^\circ - 95^\circ = 85^\circ$. Ker je $85^\circ < 90^\circ$, je kot ostri. Upogib se je povečal, kot se je zmanjšal za $30^\circ$: $115^\circ - 30^\circ = 85^\circ$.
:::

## Pogoste napake

- **»Daljša kraka, večji kot.«** Razlog: večja slika je videti »več«. Zakaj ne drži: kraka sta poltraka in nimata dolžine, narišemo le njun začetek. Pravilno: velikost kota je odvisna samo od razprtosti krakov. Daljša roka, povečana slika ali podaljšan krak kota ne spremenijo.
- **Branje napačne lestvice.** Razlog: kotomer ima dve vrsti številk, ki sta videti podobni, zato topi kot $110^\circ$ prebereš kot $70^\circ$. Pravilno: središče na vrh, ničla na krak, beri lestvico, ki se na tem kraku začne z $0$. Pred tem oceni, ali je kot ostri ali topi.
- **Pravi kot med ostrimi, iztegnjeni med topimi.** Razlog: meje si zapomniš kot »do $90^\circ$« in »do $180^\circ$«. Pravilno: ostri je strogo manjši od $90^\circ$, topi strogo med $90^\circ$ in $180^\circ$. Kot $90^\circ$ je pravi, $180^\circ$ iztegnjeni.
- **Upogib zamenjaš s kotom.** Razlog: obe števili sta v stopinjah. Pri upogibu $40^\circ$ nekdo reče, da je kot v kolenu $40^\circ$ (ostri). Pravilno: kot je $180^\circ - 40^\circ = 140^\circ$, torej topi. Večji upogib pomeni manjši kot.
- **Napačen zapis vrha.** Razlog: ni jasno, katera točka je vrh. Pravilno: pri $\angle AVB$ je vrh vedno srednja črka. Zapisa $\angle AVB$ in $\angle VAB$ ne pomenita istega kota.

## Povzetek

- **Kot** sestavljata dva poltraka s skupnim krajiščem (vrh), poltraka sta kraka. Zapis: $\angle AVB$ (vrh je srednja črka) ali $\alpha$.
- Velikost kota merimo v **stopinjah** s kotomerom; $1^\circ = \dfrac{1}{360}$ polnega kota. Ni odvisna od dolžine krakov.
- Ničelni $0^\circ$; ostri med $0^\circ$ in $90^\circ$; pravi $90^\circ$; topi med $90^\circ$ in $180^\circ$; iztegnjeni $180^\circ$; udrti med $180^\circ$ in $360^\circ$; polni $360^\circ$.
- Merjenje: središče na vrh, ničla na krak, beri lestvico, ki se na kraku začne z $0$; prej oceni vrsto kota. Udrti kot: $360^\circ$ minus drugi kot.
- Sosednja kota seštejemo: $\angle AVC = \angle AVB + \angle BVC$. Do iztegnjenega manjka $180^\circ - \alpha$, udrti kot pri istih krakih meri $360^\circ - \alpha$.
- Upogib kolena $u$ in kot v kolenu: $\alpha = 180^\circ - u$.

## Drugače: Kot zgodba

Maja si je pri košarki poškodovala koleno. Prvi dan po operaciji je fizioterapevtka na stegno in golen položila velik kotomer z dolgima krakoma (goniometer). Središče je bilo na kolenu, en krak ob stegnu, drugi ob goleni. Kot je meril $160^\circ$, upogib je bil torej $180^\circ - 160^\circ = 20^\circ$.

Majin brat, ki je visok skoraj dva metra, se je pošalil: »Če bi meril meni, bi bil kot večji, ker imam daljše noge.« Fizioterapevtka se je nasmehnila: »Daljše noge so kot daljša kraka. Koleno upogneš enako, kot ostane enak.«

Po dveh tednih je Maja koleno upognila bolj. Pripravnik je odčital $70^\circ$. Fizioterapevtka je samo pogledala nogo: »Koleno ni pokrčeno ožje od pravega kota, torej je kot topi. Bral si napačno lestvico.« Na drugi lestvici je pisalo $110^\circ$; upogib je bil $180^\circ - 110^\circ = 70^\circ$.

Majin cilj je bil sesti na stol, za kar potrebuje koleno upognjeno vsaj približno do pravega kota, $90^\circ$. Ko je kotomer pokazal $90^\circ$, je bil upogib tudi $180^\circ - 90^\circ = 90^\circ$, in Maja je prvič udobno sedla.

## Drugače: Korak za korakom s številkami

**Izmeri kot $\angle AVB$, ki je videti nekoliko ožji od vogala lista.**

1. Oceni: kot je ožji od pravega, torej je ostri, med $0^\circ$ in $90^\circ$.
2. Središče kotomera položi na vrh $V$, ničelno črto na krak $VA$.
3. Beri lestvico, ki se pri kraku $VA$ začne z $0$. Krak $VB$ jo seka pri $63$.
4. Rezultat: $\angle AVB = 63^\circ$. Ocena se ujema ($63^\circ < 90^\circ$).

**Nariši kot $125^\circ$.**

1. Oceni: $125^\circ > 90^\circ$, kot bo topi.
2. Nariši poltrak $VA$, nanj položi kotomer (središče na $V$, ničla na $VA$).
3. Na lestvici, ki se na $VA$ začne z $0$, poišči $125$ in nariši piko $B$.
4. Iz $V$ skozi $B$ potegni poltrak $VB$.
5. Preveri: kot je širši od vogala lista in ožji od ravne črte. Res je topi.
6. Do iztegnjenega kota manjka $180^\circ - 125^\circ = 55^\circ$. Preizkus: $125^\circ + 55^\circ = 180^\circ$.

**Izmeri udrti kot.** Kotomer ga ne zajame, zato izmeriš drugi kot pri istih krakih, na primer $110^\circ$. Udrti kot meri $360^\circ - 110^\circ = 250^\circ$.

## Preveri se

? Fizioterapevtka zapiše: »Kot v komolcu meri $180^\circ$.« Kakšna je roka?
- Pokrčena pod pravim kotom.
~ Pravi kot meri $90^\circ$, ne $180^\circ$. Pri $180^\circ$ kraka ležita na isti premici.
+ Popolnoma iztegnjena: nadlaket in podlaket ležita na isti premici.
- Povsem pokrčena, dlan se dotika rame.
~ Takrat je kot v komolcu zelo majhen (ostri). Velik upogib pomeni majhen kot.
> Kot $180^\circ$ je iztegnjeni kot: kraka sta nasprotna poltraka na isti premici, kot pri iztegnjeni roki.

? Razvrsti vrste kotov od najmanjšega do največjega.
1. ostri kot
2. pravi kot
3. topi kot
4. iztegnjeni kot
5. udrti kot
> Ostri je pod $90^\circ$, pravi $90^\circ$, topi med $90^\circ$ in $180^\circ$, iztegnjeni $180^\circ$, udrti nad $180^\circ$.

? Na rentgenski sliki zdravnica izmeri kot $40^\circ$ med kostema. Kaj se zgodi s tem kotom, če sliko natisne dvakrat večjo?
- Podvoji se na $80^\circ$.
~ Podvojita se narisana dela krakov, razprtost ostane enaka. Velikost kota ni odvisna od dolžine krakov.
+ Ostane $40^\circ$.
- Razpolovi se na $20^\circ$.
~ Povečava kota ne zmanjša. Kraka sta le daljša, zasukana pa nista nič drugače.
> Povečava podaljša kraka, ne spremeni pa njune razprtosti, zato kot ostane $40^\circ$.

? Na sliki poltrak $VB$ razdeli iztegnjeni kot na kota $\alpha$ in $\beta$. Kot $\alpha$ meri $125^\circ$. Koliko stopinj meri $\beta$?
:::risba skica
opis: Vodoravna premica z vrhom V na sredini. Iz V gre poltrak VB poševno levo navzgor. Kot α je med desnim delom premice in poltrakom, kot β med poltrakom in levim delom premice.
območje: 0; 0 .. 10; 3,5
črta: 0,5; 0,5 -> 9,5; 0,5 | modra
črta: 5; 0,5 -> 3,28; 2,96 | modra
črta: 5,6; 0,5 -> 5,56; 0,71 -> 5,45; 0,9 -> 5,28; 1,03 -> 5,07; 1,1 -> 4,85; 1,08 -> 4,66; 0,99
točka: 5; 0,5 | V | pod
točka: 3,28; 2,96 | B | levo
napis: 5,51; 1,48 | α | desno
napis: 4,02; 1,01 | β | levo
:::
= 55 °
~ 235 | Odštel si od polnega kota ($360^\circ$). Kota skupaj sestavljata iztegnjeni kot, $180^\circ$.
~ 125 | To je kot $\alpha$. Kota $\alpha$ in $\beta$ skupaj merita $180^\circ$.
> $\alpha + \beta = 180^\circ$, zato je $\beta = 180^\circ - 125^\circ = 55^\circ$.

? Fizioterapevt izmeri upogib kolena $40^\circ$. Koliko stopinj meri kot med stegnom in golenjo?
= 140 °
~ 40 | To je upogib, ne kot v kolenu. Kot dobiš tako, da upogib odšteješ od $180^\circ$.
~ 50 | Odštel si od pravega kota. Iztegnjena noga meri $180^\circ$, ne $90^\circ$.
~ 320 | Odštel si od polnega kota. Upogib se meri od iztegnjene noge, $180^\circ$.
> $\alpha = 180^\circ - u = 180^\circ - 40^\circ = 140^\circ$; kot je topi.

<<RACUN
vrednost: 38+52 | 90
vrednost: 180-90 | 90
vrednost: 180-65 | 115
vrednost: 65+30 | 95
vrednost: 180-95 | 85
vrednost: 115-30 | 85
vrednost: 180-160 | 20
vrednost: 180-110 | 70
vrednost: 180-125 | 55
vrednost: 360-110 | 250
vrednost: 180-40 | 140
>>

:::simboli
\alpha | kot (velikost kota) | | ^\circ | ostri pod $90^\circ$, topi med $90^\circ$ in $180^\circ$
\alpha_1, \alpha_2 | kot med stegnom in golenjo (prej, potem) | \alpha = 180^\circ - u | ^\circ
u | upogib kolena iz iztegnjene lege | | ^\circ | $u = 0^\circ$: noga iztegnjena
u_1, u_2 | upogib kolena (prej, potem) | | ^\circ
V | vrh kota | | | v zapisu $\angle AVB$ je vrh srednja črka
A, B, C | točke na krakih kotov | | | $\angle AVB$ in $\angle BVC$ imata skupni krak $VB$
:::
