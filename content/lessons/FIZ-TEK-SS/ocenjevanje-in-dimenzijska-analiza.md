---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Neža je med počitnicami en teden spremljala zdravnico na kardiološkem oddelku. Pri jutranji viziti jo je zdravnica presenetila: »Brez telefona, v pol minute: koliko litrov krvi prečrpa srce v enem dnevu? Sto, tisoč ali deset tisoč?«

Neža ni poznala nobenega natančnega podatka. Vedela je le, da srce v mirovanju utripne nekako $70$-krat na minuto in da en utrip potisne v aorto približno pol kozarca krvi. Je to dovolj za odgovor?

Na tekmovanju si pogosto v enakem položaju. Formule se ne spomniš natanko, podatkov je premalo ali pa dobiš rezultat in ne veš, ali je smiseln. Trije pripomočki ti pomagajo: **red velikosti** (koliko je približno), **dimenzijska analiza** (kakšna mora biti formula, da se enote ujemajo) in **preverjanje rezultata** (ali odgovor zdrži preprost preizkus).

## Razlaga

**1. Mamljiva napačna ideja: brez natančnih podatkov ni odgovora.** Neža je najprej pomislila, da mora poznati utripni volumen (koliko krvi potisne en utrip) na mililiter natančno. Ni res. Zdravnica ne sprašuje po številu, ampak po **redu velikosti**: po potenci števila $10$, ki je odgovoru najbližja.

Ocena gre takole. Vprašanje razbiješ na faktorje, ki jih znaš oceniti, in jih zmnožiš:

- utripni volumen: približno $70\,\mathrm{mL}$,
- srčni utrip: približno $70$ na minuto,
- en dan: $1440$ minut.

Na minuto srce prečrpa $70 \cdot 70 = 4900\,\mathrm{mL}$, kar je približno $5\,\mathrm{L}$. Toliko krvi ima odrasel v telesu, torej srce vso kri prečrpa približno enkrat na minuto. Ta znani podatek potrdi oceno. V dnevu je to $4{,}9 \cdot 1440 \approx 7 \cdot 10^3\,\mathrm{L}$. Odgovor je »deset tisoč«, ne »sto«.

Zakaj ocena deluje? Vsak faktor zgrešiš kvečjemu za dvakrat ali trikrat. Napake so naključne: nekatere navzgor, druge navzdol, zato se delno izničijo. Produkt je skoraj vedno pravi na red velikosti.

**2. Kako določiš red velikosti.** Število zapišeš kot $a \cdot 10^n$ z $1 \le a < 10$. Če je $a < \sqrt{10} \approx 3{,}16$, je red velikosti $10^n$, sicer $10^{n+1}$. Meja ni $5$, ker so redi velikosti enakomerno razporejeni na logaritemski lestvici: $\sqrt{10}$ leži natanko na sredini med $1$ in $10$. Zato je $7 \cdot 10^3$ bližje $10^4$ kot $10^3$.

Trik za tekmovanje: če veš le, da je količina nekje med spodnjo in zgornjo mejo, vzemi **geometrijsko sredino** mej, $\sqrt{\text{spodnja} \cdot \text{zgornja}}$. Med $10$ in $1000$ je dobra ocena $100$, ne $500$.

Spodnja premica kaže eksponente $n$ dolžin v telesu, merjenih v metrih.

:::risba premica
opis: Premica eksponentov n od minus 9 do 1. Vsaka točka pomeni dolžino približno 10 na n metrov. Molekula hemoglobina je pri minus 8, rdeča krvnička pri minus 5, premer aorte pri minus 2, višina človeka pri 0.
od: -9
do: 1
korak: 1
točka: -8 | molekula | modra
točka: -5 | krvnička | oranžna
točka: -2 | aorta | zelena
točka: 0 | človek | modra
:::

Med dvema točkama, ki sta tri enote narazen, je razmerje dolžin $10^3 = 1000$. Premer aorte je po redu velikosti tisočkrat večji od krvničke.

:::premisli
Odrasel ima približno $5\,\mathrm{L}$ krvi, kapljica pa ima okoli $0{,}05\,\mathrm{mL}$. Napovej red velikosti števila kapljic krvi v telesu, preden računaš.
---
$\dfrac{5000\,\mathrm{mL}}{0{,}05\,\mathrm{mL}} = 10^5$. Red velikosti je sto tisoč. Najprej obe količini zapišeš v isti enoti, nato deliš potence.
:::

**3. Dimenzija.** Vsako fizikalno količino lahko zapišemo z osnovnimi količinami: dolžino L, maso M in časom T (pri elektriki še tok I, pri toploti temperaturo Θ). Zapis z njimi je **dimenzija** količine, označimo jo z oglatim oklepajem. Hitrost ima dimenzijo $[v] = \mathrm{L\,T^{-1}}$, ker je pot deljena s časom.

| količina | enota | dimenzija |
|---|---|---|
| sila $F$ | $\mathrm{N} = \mathrm{kg\,m\,s^{-2}}$ | $\mathrm{M\,L\,T^{-2}}$ |
| tlak $p$ | $\mathrm{Pa} = \mathrm{N/m^2}$ | $\mathrm{M\,L^{-1}\,T^{-2}}$ |
| energija $W$ | $\mathrm{J} = \mathrm{N\,m}$ | $\mathrm{M\,L^2\,T^{-2}}$ |
| gostota $\rho$ | $\mathrm{kg/m^3}$ | $\mathrm{M\,L^{-3}}$ |

Pravilo je eno samo: **seštevaš, odštevaš in enačiš lahko le količine z enako dimenzijo.** Tudi argument funkcij $\sin$, $\exp$ in $\log$ mora biti brez dimenzije. Zato pri nihanju pišemo $\sin(\omega t)$, nikoli $\sin t$: krožna frekvenca $\omega$ ima enoto $\mathrm{s^{-1}}$, zato je $\omega t$ brez dimenzije.

**4. Druga napačna ideja: »Dimenzije se ujemajo, torej je formula pravilna.«** Formuli $s = a t^2$ in $s = \frac{1}{2} a t^2$ imata obe na desni dimenzijo L. Le druga je pravilna. Dimenzijska analiza ne vidi brezdimenzijskih števil, kot so $\frac{1}{2}$, $2\pi$ ali $\sqrt{2}$. Pove, **kako** je količina odvisna od drugih, ne pove pa konstante.

Prav to je njena moč. Recimo, da se ne spomniš nihajnega časa nihala. Nihajni čas $t_0$ je lahko odvisen od dolžine $l$, mase $m$ in težnega pospeška $g$:

$$t_0 = C\,l^a m^b g^c$$

Dimenzije: $\mathrm{T} = \mathrm{L}^a\,\mathrm{M}^b\,(\mathrm{L\,T^{-2}})^c$. Eksponenti morajo biti na obeh straneh enaki. Pri M: $b = 0$. Pri T: $-2c = 1$, torej $c = -\frac{1}{2}$. Pri L: $a + c = 0$, torej $a = \frac{1}{2}$. Dobiš $t_0 = C\sqrt{l/g}$, kjer je $C$ brezdimenzijska konstanta. Masa ne vpliva. Konstanto $C = 2\pi$ da šele teorija ali meritev.

V simulaciji spodaj (»Dimenzijska analiza«) izberi nihajni čas nihala in premikaj eksponente, dokler se enote ne ujemajo. Opazi, da se ujemanje pokvari pri vsakem eksponentu mase razen $0$.

:::premisli
Hitrost valov na globoki vodi je lahko odvisna le od valovne dolžine $\lambda$ in od $g$. Napovej: ali se hitrost podvoji, če valovno dolžino podvojimo?
---
Ne. Iz $v = C\,\lambda^a g^b$ dobiš pri T $b = \frac{1}{2}$, pri L $a = \frac{1}{2}$. Hitrost je sorazmerna s $\sqrt{\lambda}$, zato se pri dvakrat daljših valovih poveča le za faktor $\sqrt{2} \approx 1{,}4$.
:::

**5. Preverjanje rezultata.** Preden oddaš odgovor, ga preizkusi s štirimi vprašanji:

1. **Dimenzija.** Ali ima rezultat pravo enoto? Sešteva kje dve količini različnih dimenzij?
2. **Red velikosti.** Bi bil tlak v žili res $10^9\,\mathrm{Pa}$? Primerjaj z nečim, kar poznaš.
3. **Mejni primeri.** Vir z gonilno napetostjo $U_g$ in notranjim uporom $R_i$ poganja tok skozi porabnik z uporom $R$. Moč na porabniku $P = \frac{U_g^2 R}{(R + R_i)^2}$ mora iti proti $0$ pri $R \to 0$ (kratek stik, na porabniku ni napetosti) in pri $R \to \infty$ (ni toka). Formula oboje izpolni.
4. **Smer odvisnosti.** Daljše nihalo mora nihati počasneje. Če ti iz rezultata sledi obratno, si se zmotil.

## Rešeni primeri

### Primer 1: srce v enem življenju

Oceni, kolikokrat utripne srce v $80$ letih življenja, če v povprečju utripne $70$-krat na minuto. Rezultat zapiši kot red velikosti.

**Podatki:** $f = 70\,\mathrm{min^{-1}}$, $t = 80$ let
**Iščemo:** število utripov $N$ in njegov red velikosti

:::formula
$N = f \cdot t$
:::

**Rešitev:**

1. Čas pretvorimo v minute, ker je frekvenca na minuto: $1$ leto ima $60 \cdot 24 \cdot 365 = 525\,600$ minut.
2. Vmesne vrednosti so uporabne za preizkus: v eni uri je $70 \cdot 60 = 4200$ utripov, v enem dnevu $4200 \cdot 24 = 100\,800 \approx 10^5$.
3. V enem letu: $100\,800 \cdot 365 \approx 3{,}7 \cdot 10^7$.
4. V $80$ letih je $80 \cdot 525\,600$ minut, zato $N = 70 \cdot 60 \cdot 24 \cdot 365 \cdot 80$, kar je $2\,943\,360\,000 \approx 2{,}9 \cdot 10^9$.
5. Ker je $2{,}9 < 3{,}16$, je red velikosti $10^9$.
6. Odgovor: srce v življenju utripne približno tri milijarde krat, red velikosti je $10^9$.

### Primer 2: tlak v nogah

Ko stojiš, je kri v stopalih približno $1{,}3\,\mathrm{m}$ pod srcem. Sošolec trdi, da je razlika tlakov $\Delta p = \frac{\rho h}{g}$, sošolka pa $\Delta p = \rho g h$. Kdo ima prav? Izračunaj razliko tlakov in jo primerjaj s krvnim tlakom (okoli $120\,\mathrm{mmHg}$; $1\,\mathrm{mmHg} = 133{,}3\,\mathrm{Pa}$). Gostota krvi je $1060\,\mathrm{kg/m^3}$.

**Podatki:** $h = 1{,}3\,\mathrm{m}$; $\rho = 1060\,\mathrm{kg/m^3}$; $g = 9{,}81\,\mathrm{m/s^2}$; $1\,\mathrm{mmHg} = 133{,}3\,\mathrm{Pa}$; krvni tlak približno $120\,\mathrm{mmHg}$
**Iščemo:** pravilno formulo in $\Delta p$

:::formula
Tlak ima dimenzijo $\mathrm{M\,L^{-1}\,T^{-2}}$; kandidata: $\Delta p = \rho g h$ ali $\Delta p = \dfrac{\rho h}{g}$
:::

**Rešitev:**

1. Prvi kandidat: $\left[\frac{\rho h}{g}\right] = \frac{\mathrm{M\,L^{-3}} \cdot \mathrm{L}}{\mathrm{L\,T^{-2}}} = \mathrm{M\,L^{-3}\,T^{2}}$. To ni tlak, zato sošolec nima prav.
2. Drugi kandidat: $[\rho g h] = \mathrm{M\,L^{-3}} \cdot \mathrm{L\,T^{-2}} \cdot \mathrm{L} = \mathrm{M\,L^{-1}\,T^{-2}}$. Dimenzija je prava.
3. Vrednost: $\Delta p = 1060 \cdot 9{,}81 \cdot 1{,}3\,\mathrm{Pa} \approx 1{,}35 \cdot 10^4\,\mathrm{Pa}$.
4. V milimetrih živega srebra: $\frac{13\,518}{133{,}3} \approx 101\,\mathrm{mmHg}$.
5. Red velikosti je smiseln: razlika je primerljiva s krvnim tlakom, zato zdravnik meri tlak na nadlakti, ki je v višini srca.
6. Odgovor: prav ima sošolka. V stopalih je tlak za približno $1{,}4 \cdot 10^4\,\mathrm{Pa}$ oziroma $100\,\mathrm{mmHg}$ večji kot v višini srca.

### Primer 3: zožena žila

Pretok krvi $Q$ (prostornina na časovno enoto) skozi žilo je odvisen od padca tlaka na enoto dolžine $\frac{\Delta p}{l}$, od viskoznosti krvi $\eta$ in od polmera žile $r$. **Viskoznost** pove, kako »gosta« in težko tekoča je tekočina (med ima veliko, voda majhno); njena enota je $\mathrm{Pa\,s}$, dimenzija $\mathrm{M\,L^{-1}\,T^{-1}}$. Z dimenzijsko analizo poišči, kako je $Q$ odvisen od $r$. Za koliko odstotkov se pretok zmanjša, če se polmer zaradi obloge zmanjša za $20\,\%$ in je padec tlaka enak?

**Podatki:** $[Q] = \mathrm{L^3\,T^{-1}}$; $\left[\frac{\Delta p}{l}\right] = \mathrm{M\,L^{-2}\,T^{-2}}$; $[\eta] = \mathrm{M\,L^{-1}\,T^{-1}}$; $[r] = \mathrm{L}$; $r_2 = 0{,}8\,r_1$
**Iščemo:** eksponent $c$ pri $r$ in relativno spremembo pretoka

:::formula
$Q = C\left(\dfrac{\Delta p}{l}\right)^{a} \eta^{b} r^{c}$
:::

**Rešitev:**

1. Primerjamo eksponente pri M: $a + b = 0$, ker $Q$ mase ne vsebuje.
2. Pri T: $-2a - b = -1$. Iz prve enačbe je $b = -a$, torej $-a = -1$ in $a = 1$, $b = -1$.
3. Pri L: $-2a - b + c = 3$, torej $-2 + 1 + c = 3$ in $c = 4$.
4. Dobili smo $Q = C\,\frac{\Delta p\, r^4}{\eta\, l}$. To je znani Poiseuillov zakon, teorija da $C = \frac{\pi}{8}$.
5. Razmerje pretokov: $\frac{Q_2}{Q_1} = 0{,}8^4 \approx 0{,}41$.
6. Preverimo smer: ožja žila mora prepuščati manj krvi. Ustreza.
7. Odgovor: pretok je sorazmeren z $r^4$. Pri $20\,\%$ ožji žili pade na $41\,\%$, torej se zmanjša za približno $59\,\%$. Če hoče telo pretok ohraniti, mora padec tlaka narasti za faktor $\frac{1}{0{,}4096} \approx 2{,}4$.

### Primer 4 – zdaj ti: zrak v enem dnevu

V mirovanju vdihnemo približno $15$-krat na minuto, vsakič okoli $0{,}5\,\mathrm{L}$ zraka. Oceni, koliko litrov zraka vdihneš v enem dnevu, in določi red velikosti.

**Podatki:** $n = 15\,\mathrm{min^{-1}}$; $V_1 = 0{,}5\,\mathrm{L}$; $t = 1\,\mathrm{dan} = 1440\,\mathrm{min}$
**Iščemo:** prostornino $V$ in njen red velikosti

:::formula
$V = n \cdot V_1 \cdot t$
:::

**Rešitev:**

1. V minuti vdihneš $15 \cdot 0{,}5 = 7{,}5\,\mathrm{L}$.
2. Pomnoži z minutami v dnevu in določi red velikosti sam, nato preveri:

:::premisli
Koliko je $V$ in kakšen je red velikosti?
---
$V = 7{,}5 \cdot 1440 = 10\,800\,\mathrm{L} \approx 1{,}1 \cdot 10^4\,\mathrm{L}$, red velikosti $10^4$. To je okoli $11\,\mathrm{m^3}$; pri gostoti zraka $1{,}2\,\mathrm{kg/m^3}$ približno $13\,\mathrm{kg}$ zraka na dan, več kot pojemo in popijemo.
:::

## Pogoste napake

- **»Enote se ujemajo, torej je prav.«** Dimenzijska analiza spregleda konstante, kot so $\frac{1}{2}$ in $2\pi$, in ne loči $\sin$ od $\cos$. Ujemanje enot je nujen, ne zadosten pogoj. Formulo preveri še z mejnim primerom.
- **Red velikosti iz eksponenta.** Kdor $7 \cdot 10^3$ zaokroži na $10^3$, pogleda le eksponent. Pravilo: pri $a \ge 3{,}16$ se red poveča za ena, torej $10^4$. Pazi tudi: »dva reda velikosti« pomeni stokrat, ne dvakrat.
- **Linearno namesto potence.** »Žila je za $20\,\%$ ožja, torej je pretok za $20\,\%$ manjši.« Narobe: $Q \propto r^4$, zato pade na $41\,\%$. Ko eksponent dobiš, ga vedno uporabi na razmerju.
- **Napačen predznak eksponenta.** Pri izenačevanju eksponentov hitro zapišeš $a - b$ namesto $a + b$. Rezultat potem pokaže napačno smer (padec z večje višine bi trajal manj časa). Preizkus smeri odkrije napako.
- **Lažna natančnost.** Oceni z $7056\,\mathrm{L}$ ne verjameš na štiri mesta, saj so podatki znani le na eno ali dve. Zapiši $7 \cdot 10^3\,\mathrm{L}$.

## Povzetek

- Red velikosti: število $a \cdot 10^n$ ima red $10^n$, če je $a < \sqrt{10} \approx 3{,}16$, sicer $10^{n+1}$.
- Ocena: razbij vprašanje na faktorje, oceni vsakega, zmnoži. Napake se delno izničijo. Med mejama vzemi geometrijsko sredino.
- Dimenzije: L, M, T (I, Θ). Seštevaš in enačiš le enake dimenzije; argument $\sin$, $\exp$, $\log$ je brez dimenzije.
- Dimenzijska analiza: nastavek $C\,x^a y^b z^c$, izenači eksponente pri M, L, T. Konstante $C$ ne da.
- Preverjanje: dimenzija, red velikosti, mejni primeri, smer odvisnosti.
- Zgled: nihalo $t_0 \propto \sqrt{l/g}$; pretok skozi žilo $Q \propto r^4$.

## Drugače: Kot zgodba

Neža je zdravnici odgovorila »deset tisoč litrov« in zadela. Popoldne jo je zdravnica preizkusila še enkrat. »Zakaj se pri zoženju koronarne arterije bolnik tako hitro utrudi, čeprav je žila ožja le za petino?«

Neža se ni spomnila nobene formule. Pomislila pa je, od česa je pretok sploh lahko odvisen: od tega, kako močno tlak potiska kri, od tega, kako lepljiva je kri, in od polmera. Na listek je zapisala enote in jih uskladila kot sestavljanko. Za polmer ji je ostal eksponent $4$.

»Petino ožja žila prepusti le dobri dve petini krvi,« je rekla. »Mišica srca pa potrebuje vso.« Zdravnica je pokimala in dodala, da prav zato že majhna obloga povzroči bolečine v prsih ob naporu. Neža si je zapomnila: enote ne povedo vsega, a povedo dovolj, da veš, kje iskati.

## Drugače: Korak za korakom s številkami

Postopek dimenzijske analize na primeru časa prostega pada $t$ z višine $h$:

1. Naštej, od česa je $t$ lahko odvisen: $h$, $g$ in morda masa $m$.
2. Nastavek: $t = C\,h^a g^b m^d$.
3. Dimenzije: $\mathrm{T} = \mathrm{L}^a\,(\mathrm{L\,T^{-2}})^b\,\mathrm{M}^d$.
4. Pri M: $d = 0$. Pri T: $-2b = 1$, $b = -\frac{1}{2}$. Pri L: $a + b = 0$, $a = \frac{1}{2}$.
5. Rezultat: $t = C\sqrt{h/g}$. Teorija da $C = \sqrt{2}$.
6. Preveri smer: večja višina, daljši padec. Večji $g$, krajši padec. Oboje drži.
7. Preveri red velikosti: pri $h = 5\,\mathrm{m}$ je $\sqrt{h/g} \approx 0{,}7\,\mathrm{s}$, kar je za padec z drugega nadstropja smiselno.

## Preveri se

? Katera količina se po dimenziji razlikuje od ostalih treh?
- navor
~ Navor merimo v $\mathrm{N\,m}$, kar je dimenzijsko isto kot joule: $\mathrm{M\,L^2\,T^{-2}}$. Ime enote je drugačno, dimenzija ne.
- kinetična energija
~ Kinetična energija ima dimenzijo $\mathrm{M\,L^2\,T^{-2}}$, enako kot delo in navor.
+ moč
- delo
~ Delo je energija, $\mathrm{M\,L^2\,T^{-2}}$. Z navorom in kinetično energijo se ujema.
> Moč je energija na čas: $\mathrm{M\,L^2\,T^{-3}}$. Ostale tri imajo $\mathrm{M\,L^2\,T^{-2}}$.

? Na premici so eksponenti $n$ dolžin v telesu (dolžina je približno $10^n\,\mathrm{m}$). Po redu velikosti: koliko rdečih krvničk, postavljenih v vrsto, bi segalo od pete do temena? Vpiši število (na primer $1000$).
:::risba premica
opis: Premica eksponentov n od minus 6 do 1. Rdeča krvnička je pri minus 5, višina človeka pri 0.
od: -6
do: 1
korak: 1
točka: -5 | krvnička | oranžna
točka: 0 | človek | modra
:::
= 100000
~ 5 | To je razlika eksponentov. Število krvničk je $10^5$, torej sto tisoč.
~ 1·10^-5 | Razmerje si obrnil: deliti moraš višino človeka s premerom krvničke, ne obratno.
> Razlika eksponentov je $0 - (-5) = 5$, zato je razmerje $10^5 = 100\,000$.

? Polmer žile se zmanjša na polovico, padec tlaka ostane enak. Kaj se zgodi s pretokom krvi?
- Pade na polovico, ker je žila pol ožja.
~ To bi veljalo, če bi bil pretok sorazmeren z $r$. Dimenzijska analiza da $Q \propto r^4$.
- Pade na četrtino, ker se presek zmanjša na četrtino.
~ Presek res pade na četrtino, a hkrati se ob steni zaradi viskoznosti kri bolj zavira. Zakon je $Q \propto r^4$, ne $r^2$.
+ Pade na šestnajstino, ker je pretok sorazmeren z $r^4$.
> $\left(\frac{1}{2}\right)^4 = \frac{1}{16}$. Zato že majhno zoženje žile močno zmanjša pretok.

? Maks išče čas prostega pada kot $t = C\,h^a g^b$. Korak 1: $[h^a g^b] = \mathrm{L}^a\,\mathrm{L}^b\,\mathrm{T}^{-2b}$. Korak 2: pri T je $-2b = 1$, torej $b = -\frac{1}{2}$. Korak 3: pri L je $a - b = 0$, torej $a = -\frac{1}{2}$. Kateri korak je napačen?
- 1. korak
~ Dimenzija $g$ je $\mathrm{L\,T^{-2}}$, zato je zapis $\mathrm{L}^b\,\mathrm{T}^{-2b}$ pravilen.
- 2. korak
~ Na levi je čas na prvo potenco, zato je $-2b = 1$ in $b = -\frac{1}{2}$ pravilno.
+ 3. korak
- Nobeden, rezultat je pravilen.
~ Iz $a = -\frac{1}{2}$ bi sledilo, da z večje višine padaš krajši čas. Preizkus smeri razkrije napako.
> Eksponenta pri L se seštejeta: $a + b = 0$, torej $a = \frac{1}{2}$ in $t \propto \sqrt{h/g}$.

? Razvrsti korake dimenzijske analize po vrsti.
1. Naštej količine, od katerih je iskana količina lahko odvisna.
2. Zapiši nastavek kot produkt potenc z neznanimi eksponenti.
3. Vsako količino zapiši z dimenzijami M, L in T.
4. Izenači eksponente pri M, L in T ter reši sistem.
5. Rezultat preveri z mejnim primerom; konstanto določi meritev ali teorija.
> Najprej izbereš količine, nato nastavek, dimenzije, sistem enačb in na koncu preizkus.

:::simboli
t_0 | nihajni čas nihala | t_0 = 2\pi\sqrt{l/g} | s
C | brezdimenzijska konstanta | | – | dimenzijska analiza je ne določi
l | dolžina nihala oziroma dolžina žile | | m
m | masa | | kg
g | težni pospešek | | m/s^2
a, b, c, d | eksponenti v nastavku | | – | dobimo jih iz izenačenja dimenzij; v $s = \frac{1}{2} a t^2$ je $a$ pospešek
N | število utripov | N = f \cdot t | –
f | srčni utrip (frekvenca) | | min^{-1}
t | čas | | s | v Primerih 1 in 4 v minutah
\Delta p | razlika (padec) tlaka | \Delta p = \rho g h | Pa
\rho | gostota krvi | | kg/m^3
h | višinska razlika | | m
Q | pretok krvi (prostornina na čas) | Q = \frac{\pi}{8}\frac{\Delta p\, r^4}{\eta\, l} | m^3/s
\eta | viskoznost | | Pa\,s
r | polmer žile | | m
V | vdihnjena prostornina v dnevu | V = n \cdot V_1 \cdot t | L
V_1 | prostornina enega vdiha | | L
n | število vdihov na minuto | | min^{-1}
:::

<<RACUN
vrednost: 70*70 | 4900
vrednost: 4.9*1440 | 7056
vrednost: 60*24*365 | 525600
vrednost: 70*60*24 | 100800
vrednost: 100800*365 | 36792000
vrednost: 70*60*24*365*80 | 2943360000
vrednost: sqrt(10) | 3.16
vrednost: 5000/0.05 | 100000
resi: b=0, -2*c=1, a+c=0 | a, b, c | a=1/2, b=0, c=-1/2
vrednost: 1060*9.81*1.3 | 13518.18
vrednost: 13518/133.3 | 101.4
resi: a+b=0, -2*a-b=-1, -2*a-b+c=3 | a, b, c | a=1, b=-1, c=4
vrednost: 0.8^4 | 0.4096
vrednost: 1/0.4096 | 2.44
vrednost: 15*0.5*1440 | 10800
vrednost: 10.8*1.2 | 12.96
vrednost: sqrt(5/9.81) | 0.71
vrednost: 0.5^4 | 0.0625
resi: -2*b=1, a+b=0 | a, b | a=1/2, b=-1/2
>>
