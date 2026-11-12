---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Najprej uganka, brez računanja. Na kuhinjski mizi, visoki $0{,}80\,\mathrm{m}$, ležita dve zrni graha. Prvo s prstom sunkovito odriveš čez rob, da odleti vodoravno. V istem trenutku drugo zrno le spustiš z roba. Katero prej udari ob tla?

A) Spuščeno, ker ima krajšo pot.
B) Odrinjeno, ker je hitrejše.
C) Obe hkrati.

Odloči se, preden bereš naprej.

Pravilen je odgovor C: obe padeta po približno $0{,}40\,\mathrm{s}$. Odrinjeno zrno sicer prepotuje daljšo pot, a navzdol pada natanko tako kot spuščeno. Vodoravno gibanje ne vpliva na padanje. To je ključ do vseh nalog o poševnem metu: gibanje v ravnini razstaviš na dve preprosti gibanji, ki ju že poznaš, in ju na koncu spet sestaviš. Na tekmovanjih je ta zamisel podlaga za naloge o dometu, višini, zadevanju cilja in metih z višine.

## Razlaga

**1. Kar že znaš: navpični met.** Telo vržeš naravnost navzgor z začetno hitrostjo $v_0$. Ker nanj deluje le teža (zračni upor zanemarimo), ima ves čas pospešek $g = 9{,}81\,\mathrm{m/s^2}$ navzdol. Hitrost se enakomerno manjša:

$$v_y = v_0 - g t$$

V najvišji točki se telo za hip ustavi, zato tja pride po času $\dfrac{v_0}{g}$ in se dvigne do višine $\dfrac{v_0^2}{2g}$.

**2. Kaj je novo: še vodoravna smer.** Pri poševnem metu ima telo poleg navpične še vodoravno hitrost. V vodoravni smeri ni nobene sile, zato vodoravna hitrost ostane ves čas enaka. Obe smeri obravnavaš ločeno, povezuje ju le skupni čas $t$:

| | vodoravno ($x$) | navpično ($y$) |
|---|---|---|
| pospešek | $0$ | $g$ navzdol |
| hitrost | $v_{0x}$, stalna | $v_{0y} - g t$ |
| lega | $v_{0x} t$ | $v_{0y} t - \frac{g t^2}{2}$ |

Stolpec $y$ je navpični met, ki ga že poznaš. Stolpec $x$ je enakomerno gibanje. Nova je samo tabela, ki ju postavi drugo ob drugo.

$$x = v_{0x} t$$

$$y = v_{0y} t - \frac{g t^2}{2}$$

**3. Razstavljanje začetne hitrosti.** Začetno hitrost $v_0$ pod kotom $\alpha$ nad vodoravnico razstaviš na komponenti:

$$v_{0x} = v_0 \cos\alpha$$

$$v_{0y} = v_0 \sin\alpha$$

:::risba skica
opis: Vektor začetne hitrosti v₀ kaže poševno navzgor pod kotom α nad vodoravnico. Razstavljen je na vodoravno komponento v₀ₓ = v₀ cos α, ki kaže v desno, in navpično komponento v₀ᵧ = v₀ sin α, ki kaže navzgor. Komponenti sta kateti pravokotnega trikotnika, v₀ je njegova hipotenuza.
območje: 0; 0 .. 9; 4,5
enota: 34
puščica: 1; 0,6 -> 5; 3,6 | v_0 | nad levo | modra debelo
puščica: 1; 0,6 -> 5; 0,6 | v_{0x} = v_0 cos α | pod | oranžna
puščica: 5; 0,6 -> 5; 3,6 | v_{0y} = v_0 sin α | desno | zelena
pravikot: 5; 0,6 | 1; 0,6 | 5; 3,6
napis: 1,9; 0,9 | α | desno
:::

Kosinus spada k vodoravni komponenti, ker je ta priležna kotu $\alpha$.

**4. Najvišja točka.** Tu je navpična hitrost nič, ravno kot pri navpičnem metu. Zato vse iz prvega koraka velja, le da namesto $v_0$ pišeš $v_{0y}$:

$$t_v = \frac{v_0 \sin\alpha}{g}$$

$$H = \frac{v_0^2 \sin^2\alpha}{2g}$$

:::premisli
Pri navpičnem metu ima telo v najvišji točki hitrost nič. Kolikšna je hitrost pri poševnem metu v najvišji točki? Kje na tiru je telo najpočasnejše? Napovej, nato preberi.
---
Ni nič. Nič je samo navpična komponenta; vodoravna je še vedno $v_0 \cos\alpha$, saj se med letom ne spreminja. To je tudi najmanjša hitrost na vsem tiru.
:::

**5. Čas leta in domet.** Če telo pristane na isti višini, kot je bilo vrženo, je tir simetričen: pot navzdol traja toliko kot pot navzgor. Čas leta je zato

$$t_l = \frac{2 v_0 \sin\alpha}{g}$$

V tem času se telo vodoravno premakne za **domet** $D = v_{0x} t_l$. Ko vstaviš obe komponenti, dobiš $D = \dfrac{2 v_0^2 \sin\alpha \cos\alpha}{g}$, kar s pravilom $2 \sin\alpha \cos\alpha = \sin 2\alpha$ krajše zapišeš:

$$D = \frac{v_0^2 \sin 2\alpha}{g}$$

Največji je pri $\sin 2\alpha = 1$, torej pri $\alpha = 45^\circ$, in tedaj je $D = \dfrac{v_0^2}{g}$.

Najprej odgovori na spodnje vprašanje, nato ga preveri v simulaciji »Poševni met«: pri isti hitrosti nastavi kot najprej na $30^\circ$, nato na $60^\circ$. Opazuj, kje telo pade in kako visoko se dvigne.

:::premisli
Kuhar vrže dva cmoka z enako hitrostjo, enega pod $30^\circ$, drugega pod $60^\circ$. Kateri pade dlje? Kateri je dlje v zraku?
---
Padeta enako daleč, ker je $\sin(2 \cdot 30^\circ) = \sin 60^\circ$ enako kot $\sin(2 \cdot 60^\circ) = \sin 120^\circ$. Kota, ki se seštejeta v $90^\circ$, dasta enak domet. Cmok pod $60^\circ$ pa leti višje (trikrat višje, ker je $\sin^2 60^\circ = 3 \sin^2 30^\circ$) in dlje časa, kar opaziš tudi v simulaciji.
:::

**6. Ko pristane drugje.** Formula za $D$ velja samo za pristanek na višini meta. Če vržeš s pulta višine $h$ na tla, zapišeš višino nad tlemi, $h + v_{0y} t - \dfrac{g t^2}{2}$, jo izenačiš z nič in iz te enačbe dobiš čas leta; šele nato izračunaš $x = v_{0x} t$. Tak je tudi vodoravni met z višine $h$: tam je $v_{0y} = 0$ in čas padca je enak kot pri prostem padu.

**7. Tir.** Če iz $x = v_{0x} t$ izraziš $t$ in ga vstaviš v $y$, dobiš enačbo tira:

$$y = x \tan\alpha - \frac{g x^2}{2 v_0^2 \cos^2\alpha}$$

To je parabola, odprta navzdol. Na tekmovanju jo uporabiš, kadar naloga podaja točko, skozi katero mora telo leteti (rob lonca, okno), in ne časa.

## Rešeni primeri

### Primer 1 (lažji): grah z mize

Zrno graha zdrsne vodoravno z roba mize s hitrostjo $1{,}5\,\mathrm{m/s}$. Miza je visoka $0{,}80\,\mathrm{m}$. Koliko časa pada in kako daleč od roba mize pade na tla?

**Podatki:** $v_{0x} = 1{,}5\,\mathrm{m/s}$, $v_{0y} = 0$, $h = 0{,}80\,\mathrm{m}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** čas padanja $t$ in vodoravno razdaljo $x$

:::formula
Navpično prosti pad: $t = \sqrt{\dfrac{2h}{g}}$; vodoravno enakomerno: $x = v_{0x} t$
:::

**Rešitev:**

1. Navpično zrno začne brez hitrosti, zato pada kot spuščeno: $t = \sqrt{\dfrac{2 \cdot 0{,}80}{9{,}81}} = 0{,}404$, torej $0{,}404\,\mathrm{s}$.
2. V tem času se vodoravno giblje enakomerno: $x = 1{,}5 \cdot 0{,}404 = 0{,}606$, torej približno $0{,}61\,\mathrm{m}$.
3. Odgovor: grah pada $0{,}40\,\mathrm{s}$ in pade $0{,}61\,\mathrm{m}$ od roba mize.

### Primer 2: korenje v lonec

Kuhar vrže kocko korenja s hitrostjo $3{,}0\,\mathrm{m/s}$ pod kotom $60^\circ$ nad vodoravnico. Kocka pade na rob lonca, ki je na višini njegove roke. Kako visoko nad roko se dvigne, kako daleč je lonec in kako hitra je kocka v najvišji točki?

**Podatki:** $v_0 = 3{,}0\,\mathrm{m/s}$, $\alpha = 60^\circ$, pristanek na višini meta, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** višino $H$, domet $D$, hitrost v najvišji točki

:::formula
$v_{0x} = v_0 \cos\alpha$, $v_{0y} = v_0 \sin\alpha$, $H = \dfrac{v_{0y}^2}{2g}$, $D = \dfrac{v_0^2 \sin 2\alpha}{g}$
:::

**Rešitev:**

1. Razstavimo hitrost, ker vsako smer računamo posebej. Ker je $\cos 60^\circ = 0{,}5$ in $\sin 60^\circ = 0{,}866$: $v_{0x} = 3{,}0 \cdot 0{,}5 = 1{,}5$ in $v_{0y} = 3{,}0 \cdot 0{,}866 = 2{,}60$ (v $\mathrm{m/s}$).
2. Navpično je to navpični met z $v_{0y}$: $t_v = \dfrac{2{,}60}{9{,}81} = 0{,}265$, torej $0{,}265\,\mathrm{s}$ do vrha.
3. Višina: $H = \dfrac{2{,}60^2}{2 \cdot 9{,}81} = 0{,}34$, torej $0{,}34\,\mathrm{m}$ nad roko.
4. Pristanek je na višini meta, zato smemo uporabiti formulo za domet, v kateri je $\sin 2\alpha = \sin 120^\circ = 0{,}866$: $D = \dfrac{3{,}0^2 \cdot 0{,}866}{9{,}81} = 0{,}79$, torej $0{,}79\,\mathrm{m}$.
5. V najvišji točki ostane le vodoravna komponenta, $1{,}5\,\mathrm{m/s}$.
6. Odgovor: kocka se dvigne $0{,}34\,\mathrm{m}$ nad roko, lonec je $0{,}79\,\mathrm{m}$ stran, na vrhu je hitra $1{,}5\,\mathrm{m/s}$.

### Primer 3 (težji): pod katerim kotom?

Kuhar želi cmok vreči v lonec, ki je $2{,}0\,\mathrm{m}$ stran na višini njegove roke. Cmok vrže s hitrostjo $5{,}0\,\mathrm{m/s}$. Pod katerim kotom naj ga vrže? Kateri met je hitrejši in zakaj je to v kuhinji z napo nad štedilnikom pomembno?

**Podatki:** $D = 2{,}0\,\mathrm{m}$, $v_0 = 5{,}0\,\mathrm{m/s}$, pristanek na višini meta, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** kot $\alpha$ (lahko jih je več) in čas leta $t_l$

:::formula
$D = \dfrac{v_0^2 \sin 2\alpha}{g}$, od koder $\sin 2\alpha = \dfrac{D g}{v_0^2}$; $t_l = \dfrac{2 v_0 \sin\alpha}{g}$
:::

**Rešitev:**

1. Tokrat je neznanka kot, zato formulo za domet obrnemo: $\sin 2\alpha = \dfrac{2{,}0 \cdot 9{,}81}{5{,}0^2} = 0{,}785$.
2. Ker je $0{,}785 < 1$, je met mogoč. Kalkulator (nastavljen na stopinje) da $2\alpha_1 = 51{,}7^\circ$, torej $\alpha_1 = 25{,}9^\circ$.
3. Čas leta pri tem kotu: $\sin 25{,}9^\circ = 0{,}437$, zato $t_1 = \dfrac{2 \cdot 5{,}0 \cdot 0{,}437}{9{,}81} = 0{,}445$, torej $0{,}445\,\mathrm{s}$.
4. Sinus pa ima vrednost $0{,}785$ še pri enem kotu med $90^\circ$ in $180^\circ$. Drugi kot meta in njegov čas leta poišči sam.

:::premisli
Kolikšen je drugi kot $\alpha_2$ in koliko časa leti cmok pri njem? Kateri met izbereš pod napo?
---
$2\alpha_2 = 180^\circ - 51{,}7^\circ = 128{,}3^\circ$, torej $\alpha_2 = 64{,}1^\circ$; kota se res seštejeta v $90^\circ$. Ker je $\sin 64{,}1^\circ = 0{,}900$, je $t_2 = \dfrac{2 \cdot 5{,}0 \cdot 0{,}900}{9{,}81} = 0{,}917$, torej $0{,}917\,\mathrm{s}$, dvakrat dlje. Visok met bi se dvignil za $H = \dfrac{5{,}0^2 \cdot 0{,}900^2}{2 \cdot 9{,}81} = 1{,}03$, torej dober meter, in zadel napo, zato izbereš nizkega pod $25{,}9^\circ$.
:::

## Pogoste napake

- **»V najvišji točki telo miruje.«** To velja le pri navpičnem metu. Pri poševnem je nič samo navpična komponenta; telo se še giblje z $v_0 \cos\alpha$.
- **»Vodoravna hitrost med letom pojenja.«** Občutek pravi, da se »zagon meta« izčrpa. A vodoravno ne deluje nobena sila (brez zračnega upora), zato $v_{0x}$ ostane enaka. Teža spreminja le navpično komponento.
- **Formula za domet pri metu z višine.** $D = \dfrac{v_0^2 \sin 2\alpha}{g}$ velja samo, kadar telo pristane na višini meta. Pri metu s pulta na tla moraš najprej iz navpične enačbe izračunati čas leta.
- **Zamenjana sinus in kosinus.** Kot $\alpha$ merimo od vodoravnice, zato je $v_{0x} = v_0 \cos\alpha$. Ob tem preveri, ali računalo računa v stopinjah: $\sin 30$ v radianih je $-0{,}99$, ne $0{,}5$.
- **»Dvakrat hitreje, dvakrat dlje.«** Domet in višina sta sorazmerna s kvadratom hitrosti. Dvakrat večja hitrost pri istem kotu da štirikrat večji domet in štirikrat večjo višino.

## Povzetek

- Poševni met = enakomerno gibanje vodoravno + navpični met navpično; povezuje ju skupni čas.
- Komponenti: $v_{0x} = v_0 \cos\alpha$ (ves čas stalna), $v_{0y} = v_0 \sin\alpha$ (spreminja se kot pri navpičnem metu).
- Najvišja točka: navpična hitrost je nič, $t_v = \dfrac{v_0 \sin\alpha}{g}$, $H = \dfrac{v_0^2 \sin^2\alpha}{2g}$; hitrost tam je $v_0 \cos\alpha$.
- Pristanek na višini meta: $t_l = 2 t_v$, $D = \dfrac{v_0^2 \sin 2\alpha}{g}$; največji domet pri $45^\circ$, kota z vsoto $90^\circ$ dasta enak domet.
- Pristanek drugje: čas iz navpične enačbe, nato $x = v_{0x} t$.
- Tir je parabola $y = x \tan\alpha - \dfrac{g x^2}{2 v_0^2 \cos^2\alpha}$.

## Drugače: Na sliki

Predstavljaj si fotografijo z bliskavico, ki se sproži vsakih $0{,}1\,\mathrm{s}$. Kroglico vržemo s hitrostjo $4{,}0\,\mathrm{m/s}$ pod $45^\circ$.

:::risba graf
opis: Tir kroglice, vržene s hitrostjo 4,0 m/s pod kotom 45°. Točke kažejo lego vsakih 0,1 s: (0; 0), (0,28; 0,23), (0,57; 0,37), (0,85; 0,41), (1,13; 0,35) in (1,41; 0,19). Iz vsake točke gre črtkana navpičnica do tal. Navpičnice so enako razmaknjene, za 0,28 m.
x: 0 .. 1,8 | 0,2 | x [m]
y: 0 .. 0,5 | 0,1 | y [m]
f: x - 0.613125*x^2 | modra | 0 .. 1,63
točka: 0; 0
točka: 0,28; 0,23
točka: 0,57; 0,37
točka: 0,85; 0,41
točka: 1,13; 0,35
točka: 1,41; 0,19
črta: 0,28; 0,23 -> 0,28; 0 | črtkano siva
črta: 0,57; 0,37 -> 0,57; 0 | črtkano siva
črta: 0,85; 0,41 -> 0,85; 0 | črtkano siva
črta: 1,13; 0,35 -> 1,13; 0 | črtkano siva
črta: 1,41; 0,19 -> 1,41; 0 | črtkano siva
:::

Poglej najprej sence na tleh (črtkane navpičnice): vsakih $0{,}1\,\mathrm{s}$ se premaknejo za enakih $0{,}28\,\mathrm{m}$. To je enakomerno gibanje. Nato poglej višine: v zaporednih presledkih se kroglica dvigne za $0{,}23$; $0{,}14$; $0{,}04\,\mathrm{m}$, nato spusti za $0{,}06$ in $0{,}16\,\mathrm{m}$. Če spust šteješ kot negativen premik ($-0{,}06$ in $-0{,}16$), je vsak premik za približno $0{,}1\,\mathrm{m}$ manjši od prejšnjega, kar je značilno za enakomerno pojemajoče in nato pospešeno gibanje. Parabola je torej le obe gibanji hkrati: enakomerno vodoravno in navpični met.

## Drugače: Iz vsakdanjega življenja

- **Žoga na vlaku.** Na vlaku, ki enakomerno pelje, vržeš žogo navpično navzgor in jo spet ujameš v roko. Zate leti gor in dol. Za opazovalca na peronu leti po paraboli, ker ima še vodoravno hitrost vlaka, ki je ves čas enaka tvoji. Isto gibanje, le opisano iz dveh zornih kotov.
- **Vrtna cev.** Ko zalivaš, curek najdlje seže, če cev nagneš približno za $45^\circ$. Če jo nagneš bolj ali manj, curek pade bliže; pri dveh nagibih, ki se seštejeta v $90^\circ$, pa približno na isto mesto.
- **Košarka.** Visok, »mehak« met in nizek, »trd« met lahko zadeneta isti koš. Visok leti dlje in pade bolj navpično v obroč, kar je pri košu prednost, pri kuhinjski napi pa ovira.

## Preveri se

? Katera trditev o poševnem metu brez zračnega upora je pravilna?
- V najvišji točki je hitrost telesa nič.
~ Nič je le navpična komponenta. Vodoravna, $v_0 \cos\alpha$, ostane.
+ Vodoravna komponenta hitrosti je ves čas leta enaka.
- Pospešek ves čas kaže v smeri gibanja.
~ Pospešek je ves čas $g$ navpično navzdol, smer gibanja pa se spreminja.
- Največji domet je vedno pri $45^\circ$, tudi pri metu s pulta na tla.
~ $45^\circ$ je najboljši le pri pristanku na višini meta. Pri metu z višine je najugodnejši kot manjši.
> V vodoravni smeri ni sile, zato se $v_{0x}$ ne spreminja.

? Oliva poleti v skledo na isti višini, kot je bila vržena. Z grafa odčitaj, kako visoko se dvigne, in izračunaj, koliko časa je v zraku ($g = 9{,}81\,\mathrm{m/s^2}$).
:::risba graf
opis: Tir olive: parabola, ki se začne v točki (0; 0), doseže najvišjo točko (0,9; 0,45) in pristane v točki (1,8; 0). Od najvišje točke gre črtkana navpičnica do vodoravne osi.
x: 0 .. 2 | 0,2 | x [m]
y: 0 .. 0,6 | 0,1 | y [m]
f: x - x^2/1.8 | modra | 0 .. 1,8
točka: 0,9; 0,45 | vrh | nad
črta: 0,9; 0,45 -> 0,9; 0 | črtkano siva
:::
= 0,61 s | 0,02
~ 0,30 | To je le čas do vrha. Pot navzdol traja enako dolgo, zato čas podvoji.
~ 0,09 | Pozabil si koren: čas do vrha je $\sqrt{\dfrac{2H}{g}}$.
> $H = 0{,}45\,\mathrm{m}$. Čas do vrha je $\sqrt{\dfrac{2 \cdot 0{,}45}{9{,}81}} = 0{,}303$, torej $0{,}30\,\mathrm{s}$, ves let pa dvakrat toliko, $0{,}61\,\mathrm{s}$.

? Kuhar vrže kocko sladkorja s pulta, ki je $0{,}90\,\mathrm{m}$ nad tlemi, s hitrostjo $2{,}0\,\mathrm{m/s}$ pod kotom $30^\circ$ navzgor. Dijak računa, kako daleč od pulta pade na tla: 1) $v_{0x} = 2{,}0 \cdot \cos 30^\circ = 1{,}73\,\mathrm{m/s}$; 2) $v_{0y} = 2{,}0 \cdot \sin 30^\circ = 1{,}0\,\mathrm{m/s}$; 3) $D = \dfrac{v_0^2 \sin 60^\circ}{g} = 0{,}35\,\mathrm{m}$. Kje je napaka?
- V koraku 1: vodoravna komponenta zahteva sinus.
~ Kot merimo od vodoravnice, zato je vodoravna komponenta res s kosinusom. Korak 1 je pravilen.
- V koraku 2: $\sin 30^\circ$ ni $0{,}5$.
~ $\sin 30^\circ = 0{,}5$, zato je $v_{0y} = 1{,}0\,\mathrm{m/s}$ pravilno.
+ V koraku 3: formula za domet velja le za pristanek na višini meta.
- Napake ni.
~ Kocka pade $0{,}90\,\mathrm{m}$ niže, kot je bila vržena, zato leti dlje, kot pove formula za domet.
> Čas leta dobiš iz $0 = 0{,}90 + 1{,}0\,t - 4{,}905\,t^2$: $t = 0{,}542\,\mathrm{s}$. Nato $x = 1{,}73 \cdot 0{,}542 = 0{,}94$, torej kocka pade $0{,}94\,\mathrm{m}$ od pulta, ne $0{,}35\,\mathrm{m}$.

? Štiri kroglice vržemo z enako hitrostjo pod različnimi koti in vse pristanejo na višini meta. Razvrsti jih od najkrajšega do najdaljšega časa leta.
1. $15^\circ$
2. $30^\circ$
3. $45^\circ$
4. $75^\circ$
> Čas leta je $t_l = \dfrac{2 v_0 \sin\alpha}{g}$ in raste s $\sin\alpha$, torej s kotom. Kroglici pod $15^\circ$ in $75^\circ$ padeta enako daleč, a druga je v zraku skoraj štirikrat dlje.

? Kuhar vrže palačinko iz ponve, da se dvigne $10\,\mathrm{cm}$ nad ponev. Naslednjič jo vrže pod enakim kotom, a z dvakrat večjo hitrostjo. Kako visoko se dvigne zdaj?
- $20\,\mathrm{cm}$
~ Višina ni sorazmerna s hitrostjo, ampak s kvadratom hitrosti: $H = \dfrac{v_0^2 \sin^2\alpha}{2g}$.
- $14\,\mathrm{cm}$
~ Tako bi bilo, če bi bila višina sorazmerna s korenom hitrosti. Je pa s kvadratom.
+ $40\,\mathrm{cm}$
- $10\,\mathrm{cm}$
~ Višina je odvisna od hitrosti; neodvisna je le od mase palačinke.
> Dvakrat večja hitrost pomeni $2^2 = 4$-krat večjo višino: $4 \cdot 10\,\mathrm{cm} = 40\,\mathrm{cm}$. Zato pri kuhinjskih metih zadošča že majhen popravek moči.

<<RACUN
vrednost: sqrt(2*0.80/9.81) | 0.404
vrednost: 1.5*0.404 | 0.606
vrednost: 3.0*cos(60°) | 1.5
vrednost: 3.0*sin(60°) | 2.60
vrednost: 2.60/9.81 | 0.265
vrednost: 2.60^2/(2*9.81) | 0.34
vrednost: 3.0^2*sin(120°)/9.81 | 0.79
vrednost: 2.0*9.81/5.0^2 | 0.785
vrednost: asin(0.785)*180/pi | 51.7
vrednost: 2*5.0*sin(25.9°)/9.81 | 0.445
vrednost: 180-51.7 | 128.3
vrednost: 2*5.0*sin(64.1°)/9.81 | 0.917
vrednost: 5.0^2*0.900^2/(2*9.81) | 1.03
vrednost: 2*sqrt(2*0.45/9.81) | 0.61
vrednost: 2.0^2*sin(60°)/9.81 | 0.35
vrednost: (1.0+sqrt(1.0^2+2*9.81*0.90))/9.81 | 0.542
vrednost: 1.73*0.542 | 0.94
enako: v^2*sin(2*a)/g | 2*v^2*sin(a)*cos(a)/g
enako: sin(2*(pi/2-a)) | sin(2*a)
vrednost: 2^2*10 | 40
>>

:::simboli
v_y | navpična komponenta hitrosti | | m/s |
v_0 | začetna hitrost | | m/s |
g | težni pospešek | | m/s^2 | $9{,}81\,\mathrm{m/s^2}$, navzdol
t | čas od meta | | s |
x | vodoravna lega | x = v_{0x} t | m |
y | višina nad mestom meta | y = v_{0y} t - \frac{g t^2}{2} | m |
v_{0x} | vodoravna komponenta začetne hitrosti | v_{0x} = v_0 \cos\alpha | m/s | med letom stalna
v_{0y} | navpična komponenta začetne hitrosti | v_{0y} = v_0 \sin\alpha | m/s |
\alpha | kot meta nad vodoravnico | | ° |
t_v | čas do najvišje točke | t_v = \frac{v_0 \sin\alpha}{g} | s |
H | najvišja višina nad mestom meta | H = \frac{v_0^2 \sin^2\alpha}{2g} | m |
t_l | čas leta | t_l = \frac{2 v_0 \sin\alpha}{g} | s | pristanek na višini meta
D | domet | D = \frac{v_0^2 \sin 2\alpha}{g} | m | pristanek na višini meta
h | višina mesta meta nad tlemi (miza) | | m |
:::
