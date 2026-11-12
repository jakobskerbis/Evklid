---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V trgovini stojita na polici dve žarnici, ki svetita enako močno. Na klasični piše $60\,\mathrm{W}$, na LED le $9\,\mathrm{W}$. LED je dražja, pa se vseeno splača. Zakaj?

Ker nobena naprava ne izkoristi vse energije, ki jo plačaš. Naprava vzame energijo v eni obliki in jo pretvori v druge. Le del je **koristen**, ostalo se večinoma spremeni v toploto, ki je nismo želeli. Avto za samo vožnjo porabi le okoli četrtino energije goriva: od $100$ evrov, ki jih pustiš na bencinski črpalki, jih okoli $75$ odide v toploto. Ko znaš ta del izračunati, veš, koliko plačaš za nič, in rešiš večino tekmovalnih nalog o energiji.

## Razlaga

**Slika najprej.** Kaj se z energijo zgodi v eni sekundi pri vsaki od žarnic s police?

:::risba stolpci
opis: Stolpčni prikaz energije v eni sekundi. Klasična žarnica prejme 60 J in odda 3 J svetlobe. LED prejme 9 J in odda prav tako 3 J svetlobe.
os: energija v 1 s (J)
stolpec: klasična prejme | 60
stolpec: klasična svetloba | 3
stolpec: LED prejme | 9
stolpec: LED svetloba | 3
korak: 10
:::

Obe dasta enako svetlobe, a klasična za to prejme skoraj sedemkrat več energije iz omrežja. Kam gre razlika, pokaže tabela:

| žarnica | prejme v 1 s | svetloba | toplota |
|---|---|---|---|
| klasična | $60\,\mathrm{J}$ | $3\,\mathrm{J}$ | $57\,\mathrm{J}$ |
| LED | $9\,\mathrm{J}$ | $3\,\mathrm{J}$ | $6\,\mathrm{J}$ |

Energija, ki jo naprava prejme, je **vložena energija**. Del, ki naredi tisto, zaradi česar napravo kupimo, je **koristna energija** (tu svetloba). Ostalo so **izgube**. Energija se pri tem ne uniči: v vsaki vrstici je vsota svetlobe in toplote enaka prejeti energiji. Pretvori se le v obliko, ki je nismo želeli.

**Izkoristek** pove, kolikšen delež vložene energije je koristen. Pri klasični žarnici je to $3$ od $60$, torej $5\,\%$. Pri LED $3$ od $9$, približno $33\,\%$.

:::premisli
Prodajalec trdi, da ima nova svetilka izkoristek $120\,\%$. Zakaj to ne more biti res?
---
Izkoristek nad $100\,\%$ bi pomenil, da naprava odda več energije, kot je prejme. Energija pa ne nastane iz nič, lahko se le pretvori. Koristna energija je vedno le del vložene, zato je izkoristek vedno manjši od $100\,\%$.
:::

**Moč: energija na sekundo.** Napis $60\,\mathrm{W}$ ne pove, koliko energije žarnica porabi, ampak kako hitro jo jemlje. En vat pomeni en joule v vsaki sekundi. Koliko energije gre skozi žarnico, je odvisno od tega, kako dolgo sveti:

| čas | energija pri $60\,\mathrm{W}$ |
|---|---|
| $1\,\mathrm{s}$ | $60\,\mathrm{J}$ |
| $1\,\mathrm{min}$ | $3600\,\mathrm{J}$ |
| $1\,\mathrm{h}$ | $216\,000\,\mathrm{J}$ |

Joulov je hitro veliko, zato elektro podjetje računa v **kilovatnih urah**. Kilovatna ura je energija, ki jo naprava z močjo $1000\,\mathrm{W}$ porabi v eni uri: $1\,\mathrm{kWh} = 1000\,\mathrm{W} \cdot 3600\,\mathrm{s} = 3\,600\,000\,\mathrm{J}$. Na računu je cena za kilovatno uro, na škatli naprave pa moč.

**Veriga pretvorb.** Energija pogosto gre skozi več naprav zapored. Elektrarna na premog pretvori v električno energijo okoli $40\,\%$ energije goriva, daljnovod od tega do hiše dostavi $90\,\%$, motor sesalnika pa od tega $80\,\%$ pretvori v gibanje. Sledimo $100\,\mathrm{J}$ energije premoga:

| korak | izkoristek | ostane od $100\,\mathrm{J}$ |
|---|---|---|
| elektrarna | $40\,\%$ | $40\,\mathrm{J}$ |
| daljnovod | $90\,\%$ | $36\,\mathrm{J}$ |
| motor | $80\,\%$ | ? |

:::premisli
Preden izračunaš zadnjo vrstico: bo skupni izkoristek blizu povprečja izkoristkov ($70\,\%$) ali celo pod izkoristkom najslabšega člena ($40\,\%$)? Koliko joulov pride do gibanja?
---
Pod najslabšim členom. Vsak naslednji člen vzame del tistega, kar je ostalo, zato se izkoristki množijo: $0{,}4 \cdot 0{,}9 \cdot 0{,}8 = 0{,}288$, kar je $28{,}8\,\%$. Od $100\,\mathrm{J}$ premoga pride do gibanja $28{,}8\,\mathrm{J}$.
:::

**Delo: kako energija pride v telo.** Ko sila premakne telo v svoji smeri, opravi **delo**. Ko potisneš nakupovalni voziček s silo $20\,\mathrm{N}$ po poti $10\,\mathrm{m}$, opraviš delo $200\,\mathrm{J}$.

Opravljeno delo telesu spremeni energijo. Ko dvigneš vrečko z nakupom na višjo polico, opraviš delo proti teži in vrečka dobi **potencialno energijo**. Ko se telo giblje, ima **kinetično energijo**, ki raste s kvadratom hitrosti. Na rampi za skiro se potencialna energija na vrhu pretvarja v kinetično spodaj, del pa zaradi trenja v toploto.

V simulaciji spodaj (Izkoristek naprave) nastavi breme $500\,\mathrm{kg}$, višino $12\,\mathrm{m}$ in moč motorja $5000\,\mathrm{W}$. Izkoristek najprej postavi na $80\,\%$, nato na $40\,\%$. Opazuj, da dvig pri polovičnem izkoristku traja dvakrat dlje: motor jemlje enako moč, koristno pa je je le pol.

**Šele zdaj simboli.** Vse, kar smo opisali, zapišemo s formulami. Delo je sila krat pot, potencialna in kinetična energija pa:

$$A = F \cdot s$$

$$W_p = m g h$$

$$W_k = \frac{m v^2}{2}$$

Moč je energija ali delo v času $t$; pri enakomernem gibanju je tudi sila krat hitrost, ker je $\dfrac{F \cdot s}{t} = F \cdot v$:

$$P = \frac{W}{t}$$

$$P = F \cdot v$$

Izkoristek $\eta$ (grška črka eta) je razmerje koristne in vložene energije ali moči:

$$\eta = \frac{W_\mathrm{kor}}{W_\mathrm{vl}} = \frac{P_\mathrm{kor}}{P_\mathrm{vl}}$$

Pri verigi naprav: $\eta = \eta_1 \cdot \eta_2 \cdot \eta_3$.

## Rešeni primeri

### Primer 1: koliko stane skodelica čaja

Električni kuhalnik z močjo $2000\,\mathrm{W}$ greje vodo $3$ minute. Koliko energije prejme iz omrežja in koliko to stane pri ceni $0{,}20$ evra za kilovatno uro?

**Podatki:** $P = 2000\,\mathrm{W}$, $t = 3\,\mathrm{min} = 180\,\mathrm{s}$, cena $0{,}20\,\text{€/kWh}$
**Iščemo:** energijo $W$ in ceno

:::formula
$W = P \cdot t$; $1\,\mathrm{kWh} = 3\,600\,000\,\mathrm{J}$
:::

**Rešitev:**

1. Energija: $W = 2000 \cdot 180 = 360\,000\,\mathrm{J}$.
2. V kilovatnih urah, ker je cena na kWh: $\dfrac{360\,000}{3\,600\,000} = 0{,}1\,\mathrm{kWh}$.
3. Cena: $0{,}1 \cdot 0{,}20 = 0{,}02$ evra.
4. Odgovor: kuhalnik prejme $360\,\mathrm{kJ}$ oziroma $0{,}1\,\mathrm{kWh}$, kar stane $2$ centa.

### Primer 2: dvigalo v nakupovalnem središču

Tovorno dvigalo dvigne $500\,\mathrm{kg}$ blaga za $12\,\mathrm{m}$ v $20\,\mathrm{s}$. Motor ves čas prejema iz omrežja moč $5\,\mathrm{kW}$. Kolikšen je izkoristek dvigala ($g = 10\,\mathrm{N/kg}$)?

**Podatki:** $m = 500\,\mathrm{kg}$, $h = 12\,\mathrm{m}$, $t = 20\,\mathrm{s}$, $P_\mathrm{vl} = 5\,\mathrm{kW} = 5000\,\mathrm{W}$, $g = 10\,\mathrm{N/kg}$
**Iščemo:** izkoristek $\eta$

:::formula
$P_\mathrm{kor} = \dfrac{m g h}{t}$, nato $\eta = \dfrac{P_\mathrm{kor}}{P_\mathrm{vl}}$
:::

**Rešitev:**

1. Koristno delo je dvig blaga: $A = 500 \cdot 10 \cdot 12 = 60\,000\,\mathrm{J}$.
2. Koristna moč, ker je delo opravljeno v $20\,\mathrm{s}$: $P_\mathrm{kor} = \dfrac{60\,000}{20} = 3000\,\mathrm{W}$.
3. Izkoristek: $\eta = \dfrac{3000}{5000} = 0{,}6$.
4. Odgovor: izkoristek dvigala je $60\,\%$; $2000\,\mathrm{W}$ se izgublja kot toplota v motorju, jeklenicah in vodilih.

### Primer 3: se LED splača?

Klasična žarnica z močjo $60\,\mathrm{W}$ ima izkoristek $5\,\%$. LED z izkoristkom $30\,\%$ da enako svetlobe. Kolikšna je moč LED? Koliko evrov na leto prihraniš z zamenjavo, če sveti $4$ ure na dan, kilovatna ura pa stane $0{,}20$ evra?

**Podatki:** $P_1 = 60\,\mathrm{W}$; $\eta_1 = 0{,}05$; $\eta_2 = 0{,}30$; $4\,\mathrm{h}$ na dan; $365$ dni; cena $0{,}20\,\text{€/kWh}$
**Iščemo:** moč LED $P_2$ in letni prihranek

:::formula
Enaka svetloba: $\eta_1 P_1 = \eta_2 P_2$; energija $W = P \cdot t$
:::

**Rešitev:**

1. Moč svetlobe klasične žarnice: $0{,}05 \cdot 60 = 3\,\mathrm{W}$.
2. LED mora dati enako svetlobe, zato $P_2 = \dfrac{3}{0{,}30} = 10\,\mathrm{W}$.
3. Razlika moči je $60 - 10 = 50\,\mathrm{W}$. Na leto žarnica sveti $4 \cdot 365 = 1460\,\mathrm{h}$.
4. Prihranjena energija: $50 \cdot 1460 = 73\,000\,\mathrm{Wh}$, kar je $73\,\mathrm{kWh}$.
5. Prihranek: $73 \cdot 0{,}20 = 14{,}6$ evra.
6. Odgovor: LED ima moč $10\,\mathrm{W}$; z zamenjavo prihraniš $14{,}60$ evra na leto.

### Primer 4: zdaj ti (skiro na rampi)

Otrok s skirojem, skupaj $50\,\mathrm{kg}$, se z vrha rampe, visoke $2\,\mathrm{m}$, spusti iz mirovanja. Zaradi trenja se $20\,\%$ energije pretvori v toploto. Kolikšna je hitrost na dnu ($g = 10\,\mathrm{N/kg}$)?

**Podatki:** $m = 50\,\mathrm{kg}$, $h = 2\,\mathrm{m}$, izgube $20\,\%$, $g = 10\,\mathrm{N/kg}$
**Iščemo:** hitrost $v$ na dnu

:::formula
$W_k = 0{,}8 \cdot m g h$ in $W_k = \dfrac{m v^2}{2}$
:::

**Rešitev:**

1. Potencialna energija na vrhu: $W_p = 50 \cdot 10 \cdot 2 = 1000\,\mathrm{J}$.
2. V kinetično se pretvori $80\,\%$: $W_k = 0{,}8 \cdot 1000 = 800\,\mathrm{J}$.
3. Iz $W_k = \dfrac{m v^2}{2}$ izračunaj hitrost sam.

:::premisli
Kolikšna je hitrost na dnu?
---
$v^2 = \dfrac{2 \cdot 800}{50} = 32\,\mathrm{m^2/s^2}$, zato $v \approx 5{,}7\,\mathrm{m/s}$. Brez trenja bi bila $v = \sqrt{40} \approx 6{,}3\,\mathrm{m/s}$.
:::

## Pogoste napake

- **»Kuhalnik porabi $2000\,\mathrm{W}$.«** Vat je enota za moč, ne za energijo. Kdor zamenja moč in energijo, misli, da močnejša naprava vedno stane več. Račun je odvisen od moči in časa: $W = P \cdot t$. Popravek: energijo vedno izračunaj s časom.
- **Izkoristek obrnjen.** Kdor deli vloženo s koristno, dobi število nad $1$, na primer $133\,\%$. Izkoristek je vedno koristno deljeno z vloženim in je manjši od $100\,\%$; večji rezultat je opozorilo, da je deljenje obrnjeno.
- **Izkoristki se seštevajo ali povprečijo.** Pri verigi $40\,\%$, $90\,\%$, $80\,\%$ povprečje $70\,\%$ ni pravilno. Vsak člen dobi le tisto, kar je ostalo od prejšnjega, zato se izkoristki množijo.
- **»Močnejši motor porabi več energije za isti dvig.«** Pri enakem izkoristku opravita šibkejši in močnejši motor enako delo in prejmeta enako energije; močnejši je le hitrejši. Moč pove hitrost, delo pa količino.
- **$1\,\mathrm{kWh} = 1000\,\mathrm{J}$.** Kilo pomeni $1000$ vatov, ura pa še $3600$ sekund. Popravek: $1\,\mathrm{kWh} = 3\,600\,000\,\mathrm{J}$.

## Povzetek

- Naprava prejme vloženo energijo; koristna je le del, ostalo so izgube, večinoma toplota. Energija se ne uniči.
- Izkoristek: $\eta = \dfrac{W_\mathrm{kor}}{W_\mathrm{vl}} = \dfrac{P_\mathrm{kor}}{P_\mathrm{vl}}$, vedno pod $100\,\%$.
- Moč je energija na sekundo: $P = \dfrac{W}{t}$, pri enakomernem gibanju $P = F \cdot v$; vat je joule na sekundo.
- Delo $A = F \cdot s$; dvig da potencialno energijo $m g h$, gibanje kinetično $\dfrac{m v^2}{2}$.
- $1\,\mathrm{kWh} = 3{,}6\,\mathrm{MJ}$; cena = energija v kWh krat cena za kWh.
- Pri verigi naprav se izkoristki množijo.
- Strategija: najprej zapiši, kaj je vloženo in kaj koristno, oboje v istih enotah, šele nato deli.

## Drugače: Z analogijo

Misli na menjalnico denarja. Daš $100$ evrov (vložena energija), dobiš tujo valuto v vrednosti $95$ evrov (koristna energija), $5$ evrov obdrži menjalnica kot provizijo (izgube). »Izkoristek« menjalnice je $95\,\%$. Denar ni izginil, le ti ga nimaš več.

Če denar zamenjaš večkrat zapored, vsaka menjalnica vzame provizijo od tistega, kar ti je ostalo. Zato se deleži množijo, natanko kot pri verigi naprav.

Moč je v tej sliki hitrost zapravljanja: koliko evrov na uro odteka. Kdor zapravlja počasi, a dolgo, lahko porabi več od nekoga, ki zapravi hitro, a le za kratek čas.

## Drugače: Iz vsakdanjega življenja

- **Energijska nalepka** na hladilniku navaja porabo v kWh na leto. Tako lahko primerjaš stroške, ne samo moč.
- **Polnilnik telefona** je med polnjenjem topel: ta toplota so izgube, ki jih plačaš, a jih telefon ne dobi.
- **Kolesar** v pedale pretvori okoli četrtino energije hrane, ostalo telo odda kot toploto. Zato se pri vožnji v hrib zelo segreje.
- **Avto na bencin** ima izkoristek okoli $25\,\%$, električni motor pa več kot $80\,\%$. Zato je pri električnem avtu energija za kilometer cenejša, čeprav elektriko plačuješ.

## Preveri se

? Na škatli sesalnika piše $1500\,\mathrm{W}$. Kaj ta podatek pove?
- Sesalnik v eni uri porabi $1500\,\mathrm{J}$.
~ Vat ni energija na uro. $1500\,\mathrm{W}$ pomeni $1500\,\mathrm{J}$ v vsaki sekundi, v uri torej $1{,}5\,\mathrm{kWh}$.
+ Sesalnik vsako sekundo prejme iz omrežja $1500\,\mathrm{J}$ energije.
- Sesalnik vsako sekundo opravi $1500\,\mathrm{J}$ koristnega dela.
~ Napis na škatli je vložena moč. Koristna je manjša, ker ima tudi sesalnik izgube.
> Moč je energija na sekundo; napisana moč je tista, ki jo naprava prejme iz omrežja.

? Stolpčni prikaz kaže energijo e-skiroja v eni minuti. Kolikšen je njegov izkoristek v odstotkih?
:::risba stolpci
opis: Stolpčni prikaz energije e-skiroja v eni minuti: prejeta električna energija 18 kJ, koristno delo 13,5 kJ, toplota 4,5 kJ.
os: energija v 1 min (kJ)
stolpec: prejeta | 18
stolpec: koristno delo | 13,5
stolpec: toplota | 4,5
korak: 2
:::
= 75 % | 0,5
~ 133 | Deljenje je obrnjeno: delil si prejeto s koristnim. Izkoristek ne more biti nad $100\,\%$.
~ 25 | To je delež izgub (toplote), ne koristnega dela.
> $\eta = \dfrac{13{,}5\,\mathrm{kJ}}{18\,\mathrm{kJ}} = 0{,}75 = 75\,\%$.

? Razvrsti naprave od najmanjše do največje porabljene električne energije.
1. polnilnik telefona, $10\,\mathrm{W}$, $2$ uri
2. LED svetilka, $9\,\mathrm{W}$, $5$ ur
3. kuhalnik, $2000\,\mathrm{W}$, $3$ minute
4. sesalnik, $1500\,\mathrm{W}$, $6$ minut
> Energije so $20$, $45$, $100$ in $150\,\mathrm{Wh}$. Po moči bi bil vrstni red drugačen: energija je moč krat čas.

? Sončna celica pretvori v električno energijo $20\,\%$ energije svetlobe, baterija vrne $90\,\%$ shranjene energije, motor igrače pa $75\,\%$ električne energije pretvori v gibanje. Kolikšen je skupni izkoristek v odstotkih?
= 13,5 % | 0,1
~ 61,7 | To je povprečje izkoristkov. Vsak člen dobi le ostanek prejšnjega, zato jih zmnožiš.
~ 185 | Izkoristkov ne seštevamo; vsota nad $100\,\%$ je nemogoča.
> $\eta = 0{,}2 \cdot 0{,}9 \cdot 0{,}75 = 0{,}135 = 13{,}5\,\%$.

? Motor dvigala zamenjamo z dvakrat močnejšim z enakim izkoristkom. Kaj se zgodi, ko dvigne isti tovor na isto višino?
- Prejme dvakrat več energije.
~ Delo za dvig je enako, izkoristek tudi, zato je tudi vložena energija enaka. Močnejši motor jo le hitreje prejme.
+ Dvig traja pol manj časa, prejeta energija je enaka.
- Opravi dvakrat več dela.
~ Delo je $m g h$ in je odvisno le od tovora in višine, ne od motorja.
> Pri enakem delu in izkoristku je vložena energija enaka; dvakrat večja moč pomeni pol krajši čas.

:::simboli
A | delo | A = F \cdot s | J
F | sila | | N
s | pot v smeri sile | | m
W_p | potencialna energija | W_p = m g h | J
W_k | kinetična energija | W_k = \frac{m v^2}{2} | J
m | masa | | kg
g | težni pospešek | | N/kg | na tekmovanjih $10\,\mathrm{N/kg}$
h | višina | | m
v | hitrost | | m/s
P | moč | P = \frac{W}{t} | W | $1\,\mathrm{W} = 1\,\mathrm{J/s}$
W | energija | W = P \cdot t | J | tudi v kWh
t | čas | | s
\eta | izkoristek | \eta = \frac{W_\mathrm{kor}}{W_\mathrm{vl}} | – | manj kot $1$ oziroma $100\,\%$
W_\mathrm{kor} | koristna energija | | J
W_\mathrm{vl} | vložena energija | | J
P_\mathrm{kor} | koristna moč | P_\mathrm{kor} = \eta P_\mathrm{vl} | W
P_\mathrm{vl} | vložena (prejeta) moč | | W
\eta_1, \eta_2, \eta_3 | izkoristki zaporednih naprav ali žarnic | | –
P_1, P_2 | moč klasične žarnice in LED | | W
:::

<<RACUN
vrednost: 0.05*60 | 3
vrednost: 60-3 | 57
vrednost: 3/9 | 0.33
vrednost: 60*3600 | 216000
vrednost: 1000*3600 | 3600000
vrednost: 0.4*0.9*0.8 | 0.288
vrednost: 20*10 | 200
vrednost: 500*10*12/(0.8*5000) | 15
vrednost: 500*10*12/(0.4*5000) | 30
vrednost: 2000*180 | 360000
vrednost: 360000/3600000 | 0.1
vrednost: 0.1*0.2 | 0.02
vrednost: 500*10*12 | 60000
vrednost: 60000/20 | 3000
vrednost: 3000/5000 | 0.6
vrednost: 3/0.3 | 10
vrednost: (60-10)*4*365 | 73000
vrednost: 73*0.2 | 14.6
vrednost: 50*10*2 | 1000
vrednost: sqrt(2*800/50) | 5.7
vrednost: sqrt(2*10*2) | 6.3
vrednost: 10*2+0 | 20
vrednost: 2000*3/60 | 100
vrednost: 1500*6/60 | 150
vrednost: 13.5/18 | 0.75
vrednost: 0.2*0.9*0.75 | 0.135
vrednost: 0.8*1000 | 800
vrednost: 4*365 | 1460
vrednost: 5000-3000 | 2000
vrednost: 9*5 | 45
vrednost: 0.9*40 | 36
>>
