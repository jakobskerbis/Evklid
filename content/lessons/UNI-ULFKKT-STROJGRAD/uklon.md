---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Leonhard Euler je pisal tudi o glasbi: v knjigi o teoriji glasbe je s številkami opisal, zakaj nekateri toni zvenijo skladno. Ko ga je Daniel Bernoulli spodbudil, naj razišče upogibanje elastičnih trakov, je naletel na vprašanje, ki ga graditelji takrat še niso postavljali: pri kateri sili se tanka stisnjena palica nenadoma izboči vstran?

Odgovor je objavil leta 1744, v dodatku o elastičnih krivuljah. Dolgo je ostal bolj matematična zanimivost. Kamniti stebri in debela lesena bruna so se zdrobili, preden bi se izbočili. Ko so v 19. stoletju začeli graditi vitke konstrukcije iz železa in jekla, je Eulerjeva sila postala vprašanje varnosti. Most čez reko St. Lawrence pri Quebecu se je leta 1907 med gradnjo zrušil, ker se je izbočil stisnjen spodnji pas paličja.

Isto vprašanje si postaviš pri vsaki stisnjeni palici: pri opori pokrova klavirja, stojalu za zvočnik na odru, nogi orkestrskega podesta.

## Razlaga

**Mamljiva, a napačna misel.** Iz osne obremenitve znaš izračunati napetost $\sigma = F/A$. Zato se zdi logično: stisnjena palica zdrži, dokler $\sigma$ ne doseže meje tečenja $\sigma_T$.

Preizkusimo to na jekleni palici s premerom $10\,\mathrm{mm}$ in dolžino $1\,\mathrm{m}$. Presek je $A = 78{,}54\,\mathrm{mm^2}$, pri $\sigma_T = 235\,\mathrm{MPa}$ bi palica nosila približno $18{,}5\,\mathrm{kN}$. V resnici se izboči že pri slabem kilonewtonu, skoraj dvajsetkrat manj. Ko jo pritisneš z dlanjo na tla, se ukrivi v lok. Material pri tem še ni niti blizu tečenja.

**Kaj se zares zgodi.** Nobena palica ni popolnoma ravna in nobena sila ne deluje točno v osi. Ko se palica malo ukrivi za odmik $w$, ima osna sila $F$ ročico $w$ in povzroči upogibni moment $F \cdot w$. Ta moment ukrivlja palico naprej. Upogibna togost $EI$ se upira in jo vrača nazaj.

- Pri majhni sili zmaga togost: palica se zravna.
- Pri veliki sili zmaga moment: odmik raste, palica se izboči.

Mejo med obema primeroma imenujemo **kritična (uklonska) sila** $F_{kr}$. Pojav, ko se stisnjena palica izboči vstran, je **uklon**. O njem odloča togost, ne trdnost.

**Definicija.** Ravna lega stisnjene palice je ravnovesna pri vsaki sili. **Kritična sila** $F_{kr}$ je najmanjša osna tlačna sila, pri kateri ima palica poleg ravne lege še sosednjo ukrivljeno ravnovesno lego (indiferentno ravnovesje, razcepišče ravnovesnih leg). Pri $F < F_{kr}$ je ravna lega stabilna, pri $F > F_{kr}$ labilna.

**Eulerjev izrek.** Naj bo palica idealno ravna, iz homogenega linearno elastičnega materiala z modulom $E$, s stalnim presekom z najmanjšim vztrajnostnim momentom $I$ in dolžino $L$. Naj bo na obeh koncih členkasto podprta (konca se lahko vrtita, ne moreta pa se premakniti vstran), sila $F$ naj deluje točno v osi, odmiki naj bodo majhni. Potem ima palica ukrivljeno ravnovesno lego natanko pri silah $F_n = n^2 \pi^2 E I/L^2$, $n = 1, 2, \dots$, in kritična sila je

$$F_{kr} = \frac{\pi^2 E I}{L^2}.$$

*Izpeljava.* V ukrivljeni legi z majhnim odmikom $w(x)$ ima sila $F$ v prerezu $x$ ročico $w$, zato je upogibni moment $M = -F w$. Enačba upogibnice $EI\,w'' = M$ da $w'' + k^2 w = 0$ s $k^2 = F/(EI)$ in splošno rešitvijo $w = A \sin kx + B \cos kx$. Iz $w(0) = 0$ sledi $B = 0$, iz $w(L) = 0$ pa $A \sin kL = 0$. Ukrivljena lega pomeni $A \neq 0$, torej $\sin kL = 0$ in $kL = n\pi$. Iz $k^2 = F/(EI)$ dobimo $F_n = n^2\pi^2 EI/L^2$; najmanjša je pri $n = 1$. Amplituda $A$ ostane nedoločena: linearna teorija pove, pri kateri sili se palica izboči, ne pa, za koliko.

Tu je $E$ modul elastičnosti, $I$ najmanjši vztrajnostni moment preseka (iz upogiba nosilcev: za poln krog $I = \pi d^4/64$) in $L$ dolžina palice.

Za našo jekleno palico ($E = 200\,\mathrm{GPa}$): $I = 490{,}87\,\mathrm{mm^4}$ in $F_{kr} \approx 969\,\mathrm{N}$. To je tisti »slabi kilonewton«.

:::premisli
Palico podaljšaš na dvojno dolžino, vse drugo ostane enako. Kolikšna je nova kritična sila? Napovej, preden računaš.
---
Četrtina prejšnje. $L$ je v formuli na kvadrat v imenovalcu, zato dvakrat daljša palica nosi $2^2 = 4$-krat manj, ne dvakrat manj.
:::

**Podpore spremenijo dolžino.** Pri drugih podporah se palica izboči v drugačno obliko. Namesto $L$ vstavimo **uklonsko dolžino** $L_u = \beta L$. To je dolžina enega »loka« izbočene oblike med prevojnima točkama (tam, kjer se ukrivljenost obrne).

| Podpiranje | Oblika izbočenja | $\beta$ | $F_{kr}$ glede na členkasto |
|---|---|---|---|
| konzola: spodaj vpeta, zgoraj prosta | četrt sinusa, vrh se odmakne vstran | $2$ | $\tfrac14$ |
| oba konca členkasta | en lok | $1$ | $1$ |
| spodaj vpeta, zgoraj členek | lok, ki ob vpetju začne ravno | $\approx 0{,}7$ | $\approx 2$ |
| oba konca vpeta | lok s prevojema v četrtinah | $0{,}5$ | $4$ |

Splošna oblika je

$$F_{kr} = \frac{\pi^2 E I}{L_u^2}, \qquad L_u = \beta L.$$

*Izpeljava za konzolo.* Os $x$ naj gre od vpetja navzgor, vrh se odmakne za $\delta$. V prerezu $x$ ima sila ročico $\delta - w$, zato $EI\,w'' = F(\delta - w)$ oziroma $w'' + k^2 w = k^2 \delta$. Rešitev, ki izpolni pogoja vpetja $w(0) = 0$ in $w'(0) = 0$, je $w = \delta(1 - \cos kx)$. Pogoj $w(L) = \delta$ da $\cos kL = 0$, najmanjša rešitev je $kL = \pi/2$. Zato $F_{kr} = \pi^2 EI/(4L^2) = \pi^2 EI/(2L)^2$ in $\beta = 2$.

**Katera os.** Palica se vedno izboči tja, kjer je najšibkejša. Pri pravokotnem preseku $b \times h$ z $h < b$ je odločilen $I = b h^3/12$, z manjšo stranico na tretjo potenco. Če so podpore v obeh ravninah različne (npr. prečka prepreči izbočenje le v eni smeri), izračunamo $F_{kr}$ za vsako smer posebej, s pripadajočima $I$ in $L_u$; odloča manjša.

:::premisli
Ravnilo iz pleksi stekla, $30 \times 3\,\mathrm{mm}$, stisneš med dlanema. Zakaj se vedno izboči čez ploščato stran in kolikokrat manjša je kritična sila v tej smeri kot čez rob? Oceni, preden bereš naprej.
---
Ker je vztrajnostni moment okoli osi, vzporedne s široko stranjo, mnogo manjši: debelina nastopa na tretjo potenco. Pri ravnilu $30 \times 3\,\mathrm{mm}$ je razmerje $(30/3)^2 = 100$. Izbočenje izbere manjši $I$ in s tem manjšo kritično silo.
:::

**Kdaj Euler velja.** Formula predpostavlja, da je material ves čas elastičen. Kritična napetost je $\sigma_{kr} = F_{kr}/A = \pi^2 E/\lambda^2$, kjer je $\lambda = L_u/i$ **vitkost** in $i = \sqrt{I/A}$ vztrajnostni polmer (za poln krog $i = d/4$).

*Izpeljava.* $\sigma_{kr} = \dfrac{\pi^2 E I}{A L_u^2} = \dfrac{\pi^2 E\, i^2}{L_u^2} = \dfrac{\pi^2 E}{\lambda^2}$. Euler velja, če je $\sigma_{kr} \le \sigma_P$ (meja proporcionalnosti), torej za $\lambda \ge \lambda_P = \pi\sqrt{E/\sigma_P}$ (**mejna vitkost**).

Pri jeklu ($E = 200\,\mathrm{GPa}$, meja proporcionalnosti okoli $200\,\mathrm{MPa}$) je $\lambda_P = \pi\sqrt{1000} \approx 99{,}3$, Euler je torej zanesljiv za približno $\lambda \gtrsim 100$. Naša palica ima $\lambda = 1000/2{,}5 = 400$, je torej zelo vitka. Pri kratkih, debelih palicah odloča tlačna trdnost, Euler pa bi napovedal previsoko silo; tam uporabimo Tetmajerjevo enačbo ali uklonske krivulje po Evrokodu 3.

## Rešeni primeri

### Primer 1: opora pokrova klavirja

Pokrov koncertnega klavirja drži lesena palica okroglega preseka. Na obeh koncih je členkasto oprta (v vdolbinici). Premer je $15\,\mathrm{mm}$, dolžina $700\,\mathrm{mm}$, modul lesa vzdolž vlaken $11\,\mathrm{GPa}$. Pokrov palico stiska s silo $180\,\mathrm{N}$. Kolikšna je kritična sila in kolikšna varnost proti uklonu?

**Podatki:** $d = 15\,\mathrm{mm}$, $L = 700\,\mathrm{mm}$, $E = 11\,000\,\mathrm{MPa}$, oba konca členkasta ($\beta = 1$), $F = 180\,\mathrm{N}$
**Iščemo:** $F_{kr}$ in varnost $n = F_{kr}/F$

:::formula
$I = \dfrac{\pi d^4}{64}$, $\quad F_{kr} = \dfrac{\pi^2 E I}{L^2}$, $\quad n = \dfrac{F_{kr}}{F}$
:::

**Rešitev:**

1. Vztrajnostni moment: $I = \dfrac{\pi \cdot 15^4}{64}\,\mathrm{mm^4} \approx 2485\,\mathrm{mm^4}$.
2. Členkasta konca pomenita $L_u = L = 700\,\mathrm{mm}$, zato $L^2 = 490\,000\,\mathrm{mm^2}$.
3. Števec: $\pi^2 \cdot 11\,000\,\mathrm{MPa} \cdot 2485\,\mathrm{mm^4} \approx 2{,}698 \cdot 10^8\,\mathrm{N\,mm^2}$ (MPa krat mm² je N).
4. $F_{kr} \approx \dfrac{2{,}698 \cdot 10^8}{490\,000}\,\mathrm{N} \approx 551\,\mathrm{N}$.
5. Varnost: $n \approx 551/180 \approx 3{,}1$.
6. Odgovor: palica se izboči pri približno $551\,\mathrm{N}$; varnost proti uklonu je okoli $3$.

### Primer 2: stojalo za zvočnik

Zvočnik z maso $25\,\mathrm{kg}$ stoji na aluminijasti cevi, ki je spodaj trdno vpeta v stojalo, zgoraj pa prosta (zvočnik se lahko odmakne vstran). Cev ima zunanji premer $35\,\mathrm{mm}$, notranji $29\,\mathrm{mm}$ in dolžino $1{,}5\,\mathrm{m}$, $E = 70\,\mathrm{GPa}$. Ali je cev varna?

**Podatki:** $D = 35\,\mathrm{mm}$, $d = 29\,\mathrm{mm}$, $L = 1500\,\mathrm{mm}$, $E = 70\,000\,\mathrm{MPa}$, konzola ($\beta = 2$), $m = 25\,\mathrm{kg}$, $g = 9{,}81\,\mathrm{m/s^2}$
**Iščemo:** $F_{kr}$ in primerjavo s težo zvočnika

:::formula
$I = \dfrac{\pi (D^4 - d^4)}{64}$, $\quad L_u = 2L$, $\quad F_{kr} = \dfrac{\pi^2 E I}{L_u^2}$
:::

**Rešitev:**

1. $D^4 - d^4 = 1\,500\,625 - 707\,281 = 793\,344\,\mathrm{mm^4}$.
2. $I = \pi \cdot 793\,344/64\,\mathrm{mm^4} \approx 38\,943\,\mathrm{mm^4}$.
3. Konzola se izboči kot polovica členkaste palice dvojne dolžine, zato $L_u = 2 \cdot 1500 = 3000\,\mathrm{mm}$.
4. $F_{kr} = \dfrac{\pi^2 \cdot 70\,000 \cdot 38\,943}{3000^2}\,\mathrm{N} \approx 2989\,\mathrm{N}$.
5. Teža zvočnika: $25 \cdot 9{,}81 = 245{,}25\,\mathrm{N}$, varnost $n \approx 2989/245 \approx 12$.
6. Odgovor: cev je varna proti uklonu (kritična sila okoli $3\,\mathrm{kN}$). Če bi pozabili na $\beta = 2$, bi dobili štirikrat preveč, približno $12\,\mathrm{kN}$.

### Primer 3 (težji): noga orkestrskega podesta

Jeklena noga podesta za orkester je na obeh koncih členkasto pritrjena, dolga $800\,\mathrm{mm}$ in nosi $12\,\mathrm{kN}$. Zahtevamo varnost $3$ proti uklonu. (a) Kolikšen premer polne okrogle palice potrebujemo? (b) Nogo želimo narediti iz cevi z razmerjem premerov $d/D = 0{,}75$. Kolikšen je najmanjši zunanji premer in koliko materiala prihranimo? (c) Ali Euler v obeh primerih velja, če je meja proporcionalnosti $200\,\mathrm{MPa}$?

**Podatki:** $L = 800\,\mathrm{mm}$, $\beta = 1$, $F = 12\,000\,\mathrm{N}$, $n = 3$, $E = 200\,000\,\mathrm{MPa}$, $d/D = 0{,}75$, $\sigma_P = 200\,\mathrm{MPa}$
**Iščemo:** najmanjši premer polne palice $d_p$, najmanjši $D$ cevi, razmerje ploščin, vitkosti $\lambda$

:::formula
$F_{kr} = n F$, $\quad I_{\text{potr}} = \dfrac{F_{kr} L^2}{\pi^2 E}$, $\quad d_p = \sqrt[4]{\dfrac{64\, I_{\text{potr}}}{\pi}}$

cev: $I = \dfrac{\pi D^4 (1 - 0{,}75^4)}{64}$, $\quad i = \dfrac{\sqrt{D^2 + d^2}}{4}$, $\quad \lambda = \dfrac{L_u}{i}$, $\quad \lambda_P = \pi\sqrt{\dfrac{E}{\sigma_P}}$
:::

**Rešitev:**

1. Potrebna kritična sila: $F_{kr} = 3 \cdot 12\,000 = 36\,000\,\mathrm{N}$.
2. Eulerjevo formulo obrnemo na $I$: $I_{\text{potr}} = \dfrac{36\,000 \cdot 800^2}{\pi^2 \cdot 200\,000}\,\mathrm{mm^4} \approx 11\,672\,\mathrm{mm^4}$. Ta zahteva velja za oba preseka, ker sta $L_u$ in $E$ enaka.
3. Polna palica, iz $I = \pi d^4/64$: $d_p = \sqrt[4]{64 \cdot 11\,672/\pi}\,\mathrm{mm} \approx 22{,}1\,\mathrm{mm}$. (Standardna palica $24\,\mathrm{mm}$ bi imela $I \approx 16\,286\,\mathrm{mm^4}$ in $F_{kr} \approx 50{,}2\,\mathrm{kN}$.)
4. Cev potrebuje isti $I$: $D^4 (1 - 0{,}75^4) = d_p^4$. Ker je $1 - 0{,}75^4 \approx 0{,}6836$, je $D = d_p/\sqrt[4]{0{,}6836} \approx 22{,}08/0{,}9093\,\mathrm{mm} \approx 24{,}3\,\mathrm{mm}$ in $d \approx 18{,}2\,\mathrm{mm}$. Isti $I$ dobimo z malo večjim zunanjim premerom, ker je material daleč od osi.
5. Ploščini: polna $A = \pi \cdot 22{,}08^2/4\,\mathrm{mm^2} \approx 383\,\mathrm{mm^2}$, cev $A = \pi \cdot 24{,}29^2 \cdot (1 - 0{,}75^2)/4\,\mathrm{mm^2} \approx 203\,\mathrm{mm^2}$. Razmerje $\approx 0{,}53$: cev porabi okoli $47\,\%$ manj jekla.
6. Mejna vitkost: $\lambda_P = \pi\sqrt{200\,000/200} \approx 99{,}3$.
7. Polna palica: $i = 22{,}08/4 \approx 5{,}52\,\mathrm{mm}$, $\lambda \approx 800/5{,}52 \approx 145 > 99{,}3$. Cev: $i = 24{,}29 \cdot \sqrt{1 + 0{,}75^2}/4 \approx 7{,}59\,\mathrm{mm}$, $\lambda \approx 105 > 99{,}3$. Euler velja v obeh primerih, pri cevi že blizu meje.
8. Odgovor: polna palica potrebuje premer vsaj $22{,}1\,\mathrm{mm}$, cev zunanji premer vsaj $24{,}3\,\mathrm{mm}$ (notranji $18{,}2\,\mathrm{mm}$) in prihrani skoraj polovico materiala; Eulerjeva formula je v obeh primerih upravičena.

### Primer 4: zdaj ti (ost violončela)

Jeklena ost violončela je vpeta v instrument, na tleh pa se opira v podložko, kjer se lahko vrti. Premer je $8\,\mathrm{mm}$, izvlečena dolžina $350\,\mathrm{mm}$. Instrument in igralec jo stiskata s silo okoli $150\,\mathrm{N}$.

**Podatki:** $d = 8\,\mathrm{mm}$, $L = 350\,\mathrm{mm}$, vpeta in členkasta ($\beta \approx 0{,}7$), $E = 200\,000\,\mathrm{MPa}$, $F = 150\,\mathrm{N}$
**Iščemo:** $F_{kr}$ in varnost

:::formula
$I = \dfrac{\pi d^4}{64}$, $\quad L_u = \beta L$, $\quad F_{kr} = \dfrac{\pi^2 E I}{L_u^2}$
:::

**Rešitev:**

1. $I = \pi \cdot 8^4/64\,\mathrm{mm^4} \approx 201{,}06\,\mathrm{mm^4}$.
2. $L_u = 0{,}7 \cdot 350 = 245\,\mathrm{mm}$.
3. Izračunaj $F_{kr}$ in varnost sam, nato preveri:

:::premisli
Koliko je $F_{kr}$ in kolikšna je varnost?
---
$F_{kr} = \dfrac{\pi^2 \cdot 200\,000 \cdot 201{,}06}{245^2}\,\mathrm{N} \approx 6612\,\mathrm{N}$, varnost $\approx 6612/150 \approx 44$. Ost je kratka, zato je uklon daleč. Vitkost je $\lambda = 245/2 \approx 123$, Euler torej velja.
:::

## Pogoste napake

- **Računaš samo $\sigma = F/A$.** Misel »dokler je napetost pod mejo tečenja, je vse v redu« pri vitki palici odpove: izboči se pri dvajsetkrat manjši sili. Pri vsaki stisnjeni palici preveri tudi uklon.
- **$L$ namesto $L_u$.** Pri konzoli je $L_u = 2L$, kritična sila je štirikrat manjša od členkaste. Najprej določi podpore, potem $\beta$.
- **Polarni $J$ namesto $I$.** Iz torzije si zapomniš $J = \pi d^4/32$ in ga vstaviš. Ker je $J = 2I$, dobiš dvakrat preveliko kritično silo. Uklon je upogib, zato $I = \pi d^4/64$.
- **Večji $I$ pri pravokotniku.** Palica izbere šibkejšo os. Vedno vzemi manjši vztrajnostni moment.
- **»Močnejše jeklo pomaga.«** Vsa jekla imajo $E \approx 200\,\mathrm{GPa}$. Pri vitki palici dražje jeklo z višjo mejo tečenja ne poveča $F_{kr}$. Pomaga večji $I$ (debelejša ali votla palica) ali krajša $L_u$.

## Povzetek

- Uklon: vitka stisnjena palica se izboči vstran pri sili, ki je lahko mnogo manjša od sile tečenja. Odloča upogibna togost $EI$, ne trdnost.
- Eulerjeva kritična sila: $F_{kr} = \pi^2 E I / L_u^2$, $L_u = \beta L$.
- $\beta$: konzola $2$, členkasto–členkasto $1$, vpeto–členkasto $\approx 0{,}7$, vpeto–vpeto $0{,}5$.
- $I$ je najmanjši upogibni vztrajnostni moment ($\pi d^4/64$, ne polarni $J$).
- $F_{kr} \propto 1/L_u^2$ in $\propto d^4$: dvojna dolžina da četrtino, dvojni premer $16$-kratno silo.
- Euler velja v elastičnem območju; pri jeklu za vitkost $\lambda = L_u/i \gtrsim 100$, $i = \sqrt{I/A}$.
- Računaj v $\mathrm{N}$, $\mathrm{mm}$, $\mathrm{MPa}$.

## Za izpit

Znati moraš povedati:

- definicijo kritične sile kot najmanjše sile, pri kateri obstaja sosednja ukrivljena ravnovesna lega, in razliko med uklonom in porušitvijo zaradi tlačne trdnosti;
- Eulerjev izrek z vsemi predpostavkami (ravna palica, linearno elastičen homogen material, stalen presek, sila v osi, majhni odmiki, podpore) in izpeljavo za členkasto palico iz $EI\,w'' = -Fw$;
- uklonsko dolžino za štiri Eulerjeve primere in izpeljavo $\beta = 2$ za konzolo;
- zakaj šteje najmanjši vztrajnostni moment preseka in kako pri različnih podporah v dveh ravninah preveriš obe smeri;
- vitkost, vztrajnostni polmer, izpeljavo $\sigma_{kr} = \pi^2 E/\lambda^2$ in mejne vitkosti $\lambda_P = \pi\sqrt{E/\sigma_P}$ ter kdaj Euler ne velja.

### Naloga 1

Navpična lesena opornica odrske konstrukcije je dolga $3\,\mathrm{m}$, ima pravokoten presek $b \times h$ in je na obeh koncih členkasto podprta. Upogib okoli šibke osi (izbočenje v smeri stranice $b$) dodatno preprečuje vodoravna prečka na polovici višine, upogiba okoli močne osi pa ne. Opornica nosi $10\,\mathrm{kN}$, zahtevana varnost proti uklonu je $3$, modul lesa je $E = 11\,000\,\mathrm{MPa}$. (a) Pri katerem razmerju $h/b$ je presek enako varen v obeh smereh? (b) Kolikšna sta najmanjša $b$ in $h$ pri tem razmerju? (c) Ali Euler velja, če je za les mejna vitkost okoli $100$? (d) Kolikšna je varnost, če vzamemo letev $45 \times 90\,\mathrm{mm}$?

**Rešitev:**

1. Močna os: $I = b h^3/12$, $L_u = L = 3000\,\mathrm{mm}$. Šibka os: $I = h b^3/12$, prečka razpolovi uklonsko dolžino, $L_u = L/2 = 1500\,\mathrm{mm}$.
2. Enaka varnost pomeni enaki kritični sili, kar da enačbo $\dfrac{b h^3}{12 L^2} = \dfrac{h b^3}{12 (L/2)^2}$, torej $h^2 = 4 b^2$ in $h = 2b$.
3. Potrebna kritična sila: $F_{kr} = 3 \cdot 10\,000 = 30\,000\,\mathrm{N}$.
4. Pri $h = 2b$ je $I = b (2b)^3/12 = 2b^4/3$. Iz $F_{kr} = \pi^2 E I/L^2$: $b^4 = \dfrac{3 F_{kr} L^2}{2 \pi^2 E} = \dfrac{3 \cdot 30\,000 \cdot 3000^2}{2 \pi^2 \cdot 11\,000}\,\mathrm{mm^4} \approx 3{,}73 \cdot 10^6\,\mathrm{mm^4}$.
5. $b \approx 43{,}9\,\mathrm{mm}$ in $h \approx 87{,}9\,\mathrm{mm}$.
6. Vitkost okoli močne osi: $i = h/\sqrt{12} \approx 25{,}4\,\mathrm{mm}$, $\lambda = 3000/25{,}4 \approx 118$. Okoli šibke osi: $i = b/\sqrt{12}$, $L_u = 1500\,\mathrm{mm}$, kar da isto vitkost $\approx 118$. Ker je $118 > 100$, Euler velja.
7. Letev $45 \times 90\,\mathrm{mm}$: v obeh smereh je $F_{kr} = \dfrac{\pi^2 \cdot 11\,000 \cdot 45 \cdot 90^3}{12 \cdot 3000^2}\,\mathrm{N} \approx 32{,}98\,\mathrm{kN}$, varnost $\approx 32{,}98/10 \approx 3{,}3$.
8. Odgovor: optimalno razmerje je $h/b = 2$; potrebujemo vsaj $b \approx 44\,\mathrm{mm}$ in $h \approx 88\,\mathrm{mm}$; vitkost $118$ dovoljuje Eulerja; letev $45 \times 90\,\mathrm{mm}$ ima varnost okoli $3{,}3$.

### Naloga 2

Natančno navedi predpostavke Eulerjevega izreka. Izpelji kritično silo konzole (spodaj vpeta, zgoraj prosta palica) in utemelji, zakaj je $\beta = 2$. Izpelji mejno vitkost $\lambda_P$. Utemelji, ali Euler velja za jekleno konzolo s premerom $30\,\mathrm{mm}$ in dolžino $600\,\mathrm{mm}$ ($E = 200\,\mathrm{GPa}$, $\sigma_P = 200\,\mathrm{MPa}$), in izračunaj njeno kritično silo.

**Rešitev:**

1. Predpostavke: idealno ravna palica s stalnim presekom, homogen linearno elastičen material, tlačna sila točno v osi, majhni odmiki (velja $EI\,w'' = M$), napetost do izbočenja pod mejo proporcionalnosti.
2. Konzola: os $x$ od vpetja, vrh se odmakne za $\delta$. Moment v prerezu $x$ je $F(\delta - w)$, zato $w'' + k^2 w = k^2\delta$, $k^2 = F/(EI)$.
3. Splošna rešitev je $w = A \sin kx + B \cos kx + \delta$. Iz $w'(0) = 0$ sledi $A = 0$, iz $w(0) = 0$ pa $B = -\delta$, torej $w = \delta(1 - \cos kx)$.
4. Na vrhu $w(L) = \delta$ da $\delta \cos kL = 0$. Za $\delta \neq 0$ je $\cos kL = 0$, najmanjša rešitev $kL = \pi/2$.
5. $F_{kr} = k^2 EI = \dfrac{\pi^2 EI}{4L^2} = \dfrac{\pi^2 EI}{(2L)^2}$, zato $L_u = 2L$ in $\beta = 2$. Oblika je četrt sinusnega vala, polovica loka členkaste palice dolžine $2L$.
6. Mejna vitkost: $\sigma_{kr} = F_{kr}/A = \pi^2 E i^2/L_u^2 = \pi^2 E/\lambda^2$. Pogoj $\sigma_{kr} \le \sigma_P$ da $\lambda \ge \lambda_P = \pi\sqrt{E/\sigma_P} = \pi\sqrt{1000} \approx 99{,}3$.
7. Konzola: $L_u = 1200\,\mathrm{mm}$, $i = 30/4 = 7{,}5\,\mathrm{mm}$, $\lambda = 1200/7{,}5 = 160 > 99{,}3$, zato Euler velja.
8. $I = \pi \cdot 30^4/64\,\mathrm{mm^4} \approx 39\,761\,\mathrm{mm^4}$, $F_{kr} = \dfrac{\pi^2 \cdot 200\,000 \cdot 39\,761}{1200^2}\,\mathrm{N} \approx 54{,}5\,\mathrm{kN}$.
9. Odgovor: konzola ima $\beta = 2$; Euler zanjo velja ($\lambda = 160$), kritična sila je približno $54{,}5\,\mathrm{kN}$.

## Drugače: Kot zgodba

Bobnar čaka na začetek koncerta in se z eno palico opre ob tla. Palica je kratka in debela, ne zgane se. Potem vzame dolgo tanko paličico za triangel in se nanjo opre enako. Paličica se ukloni v lok, čeprav je iz jekla.

Kaj se je spremenilo? Ne material. Paličica je daljša in tanjša. Pri vsakem majhnem odmiku vstran dobi sila njegove roke ročico in paličico upogiba naprej. Kratka palica se temu upre, tanka ne.

Bobnar paličico prime še na sredini z drugo roko, da se ne more odmakniti. Zdaj se mora izbočiti v dva krajša loka. Vsak lok je pol tako dolg, zato zdrži štirikrat več. Tako delujejo prečne opore v visokih odrskih stolpih.

## Drugače: Korak za korakom s številkami

Postopek pri vsaki stisnjeni palici:

1. **Podpore → $\beta$.** Vpeto spodaj in prosto zgoraj: $2$. Oba členka: $1$. Vpeto in členek: $0{,}7$. Obe vpeti: $0{,}5$.
2. **$L_u = \beta L$** v milimetrih.
3. **$I$ za šibkejšo os** v $\mathrm{mm^4}$: krog $\pi d^4/64$, cev $\pi(D^4-d^4)/64$, pravokotnik $b h^3/12$ z manjšo stranico $h$.
4. **$F_{kr} = \pi^2 E I/L_u^2$**: z $E$ v MPa dobiš njutone.
5. **Varnost** $n = F_{kr}/F$, običajno zahtevamo $n = 2$ do $5$.
6. **Kontrola vitkosti** $\lambda = L_u/i$. Če je pri jeklu pod približno $100$, Euler precenjuje nosilnost.

Primer s številkami: jeklena palica $d = 20\,\mathrm{mm}$, $L = 2\,\mathrm{m}$, oba členka. $I \approx 7854\,\mathrm{mm^4}$, $L_u = 2000\,\mathrm{mm}$, $F_{kr} \approx 3876\,\mathrm{N}$, $\lambda = 2000/5 = 400$.

## Drugače: Uporaba v stroki

- **Hidravlični in pnevmatski valji.** Batnica je pri polnem izvleku vitka stisnjena palica; glede na pritrditev valja (vpeto, členkasto) izberemo $\beta$ in preverimo uklon. Proizvajalci zato za vsak premer batnice podajo največji hod pri dani sili.
- **Jeklene konstrukcije.** Stebre ploščadi in cevnih mostov ter tlačne palice paličij dimenzioniramo po SIST EN 1993-1-1 (Evrokod 3) z uklonskimi krivuljami, ki upoštevajo začetne nepopolnosti in zaostale napetosti.
- **Noge posod in rezervoarjev.** Pokončna posoda na nogah obremeni vsako nogo z delom teže polne posode; nogo preverimo na uklon kot palico z ustreznimi podporami, pogosto s prečnimi povezji, ki skrajšajo uklonsko dolžino.
- **Vretena.** Navojna vretena stiskalnic in dvigal preverimo na uklon pri največjem izvleku, ko je prosti del najdaljši.

## Drugače: Bolj natančno

**Višje oblike.** Rešitve $kL = n\pi$ iz Razlage z $n \ge 2$ dajo sile $F_n = n^2 F_{kr}$ in oblike z $n$ loki. Palica jih doseže le, če nižje oblike preprečimo: prečka na sredini prepove obliko $n = 1$, zato je nosilnost $F_2 = 4F_{kr}$.

**Nepopolna palica.** Resnična palica ima začetno ukrivljenost. Če ima začetno obliko $w_0 \sin(\pi x/L)$, ima rešitev enačbe $EI\,\bigl(w - w_0 \sin(\pi x/L)\bigr)'' = -Fw$ obliko $w = \dfrac{w_0}{1 - F/F_{kr}} \sin(\pi x/L)$. Odmik raste že pod kritično silo in pri $F \to F_{kr}$ narašča čez vse meje. Zato standardi zahtevajo varnost in upoštevajo nepopolnosti z uklonskimi krivuljami.

Povezava z zvokom: za členkasto palico pod tlačno silo $F$ velja za osnovno lastno frekvenco upogibnega nihanja $f^2 = f_0^2 (1 - F/F_{kr})$. Ko se sila približuje kritični, ton palice pada proti nič. Na tem temelji preizkus, ki kritično silo oceni iz meritve frekvence brez porušitve.

## Preveri se

? Katera sprememba **ne** poveča kritične sile vitke jeklene palice?
- Krajša palica.
~ Krajša $L_u$ močno poveča $F_{kr}$, saj je $L_u$ na kvadrat v imenovalcu.
- Debelejša palica.
~ Večji premer poveča $I \propto d^4$, zato tudi $F_{kr}$.
+ Jeklo z višjo mejo tečenja.
- Vpetje obeh koncev namesto členkov.
~ Vpetje zmanjša $\beta$ z $1$ na $0{,}5$ in poveča $F_{kr}$ štirikrat.
> V Eulerjevi formuli je samo $E$, ki je za vsa jekla približno enak. Meja tečenja vitke palice ne reši.

? Jeklena palica, $d = 20\,\mathrm{mm}$, $L = 2\,\mathrm{m}$, oba konca členkasta. Kolikšna je kritična sila?
- $73{,}8\,\mathrm{kN}$
~ To je sila tečenja $\sigma_T A$ pri $235\,\mathrm{MPa}$. Vitka palica se izboči prej.
- $7{,}75\,\mathrm{kN}$
~ Vstavil si polarni $J = \pi d^4/32$. Uklon je upogib, potreben je $I = \pi d^4/64$.
+ $3{,}88\,\mathrm{kN}$
- $0{,}97\,\mathrm{kN}$
~ Uporabil si $L_u = 2L$, ki velja za konzolo. Pri dveh členkih je $\beta = 1$.
> $I = \pi \cdot 20^4/64 \approx 7854\,\mathrm{mm^4}$, $F_{kr} = \pi^2 \cdot 200\,000 \cdot 7854/2000^2 \approx 3876\,\mathrm{N}$.

? Premer okrogle palice podvojiš, dolžino in podpore pustiš. Kaj se zgodi s kritično silo?
- Podvoji se.
~ Sila ni sorazmerna s premerom, ampak z $I \propto d^4$.
- Poveča se štirikrat.
~ Štirikrat se poveča presek $A \propto d^2$. Uklon pa določa $I$.
+ Poveča se šestnajstkrat.
> $I = \pi d^4/64$, zato $2^4 = 16$. Zato je pri uklonu debelina tako učinkovita.

? Sošolka preverja konzolno stojalo ($L = 1\,\mathrm{m}$, spodaj vpeto, zgoraj prosto) v štirih korakih. Kje se je zmotila? (1) $I = \pi d^4/64$; (2) $L_u = 0{,}5 \cdot 1000\,\mathrm{mm}$, ker je en konec vpet; (3) $F_{kr} = \pi^2 E I/L_u^2$; (4) $n = F_{kr}/F$.
- Korak (1)
~ Za poln krog je $I = \pi d^4/64$ pravilen.
+ Korak (2)
- Korak (3)
~ To je pravilna splošna Eulerjeva formula z uklonsko dolžino.
- Korak (4)
~ Varnost je res razmerje med kritično in dejansko silo.
> Konzola ima $\beta = 2$, torej $L_u = 2000\,\mathrm{mm}$. Z $0{,}5$ bi dobil $16$-krat preveliko silo, kar je zelo nevarno.

? Visok odrski stolp za luči ima tanke navpične cevi. Inženir doda vodoravne prečke na polovici višine. Zakaj?
- Da cevi prenesejo večjo natezno silo.
~ Navpične cevi so pri teži luči stisnjene, ne natezne. Prečke nateznosti ne spremenijo.
- Da se zmanjša napetost $F/A$ v ceveh.
~ Prečke ne spremenijo preseka cevi niti sile v njej, zato $F/A$ ostane enak.
+ Da se uklonska dolžina cevi razpolovi in kritična sila poveča približno štirikrat.
> Prečka prepreči odmik vstran na sredini, cev se lahko izboči le v dveh krajših lokih. $F_{kr} \propto 1/L_u^2$.

:::simboli
F_{kr} | kritična (uklonska) sila | F_{kr} = \frac{\pi^2 E I}{L_u^2} | N | za členkasto palico je uklonska dolžina enaka L
E | modul elastičnosti | | Pa | jeklo ≈ 200 GPa
I | najmanjši vztrajnostni moment preseka | | m^4 | poln krog πd⁴/64, cev π(D⁴ − d⁴)/64
L | dolžina palice | | m |
L_u | uklonska dolžina | L_u = \beta L | m |
\beta | koeficient uklonske dolžine | | – | členkasto 1, konzola 2
w | bočni odmik (izbočenje) palice | | m |
k | parameter enačbe izbočenja | k^2 = \frac{F}{EI} | 1/m |
F | osna tlačna sila | | N |
d | premer palice (pri cevi notranji premer) | | m |
n | varnost proti uklonu | n = \dfrac{F_{kr}}{F} | – |
D | zunanji premer cevi | | m |
I_{\text{potr}} | potrebni vztrajnostni moment | I_{\text{potr}} = \dfrac{F_{kr} L^2}{\pi^2 E} | m^4 |
\lambda | vitkost palice | \lambda = \dfrac{L_u}{i} | – | Euler velja pri jeklu za λ ≳ 100
i | vztrajnostni polmer preseka | i = \sqrt{\frac{I}{A}} | m | za poln krog i = d/4
A | ploščina prečnega prereza | | m^2 |
\sigma_{kr} | kritična napetost | \sigma_{kr} = \frac{\pi^2 E}{\lambda^2} | Pa |
\sigma_P | meja proporcionalnosti | | Pa | jeklo ≈ 200 MPa
\lambda_P | mejna vitkost | \lambda_P = \pi\sqrt{\frac{E}{\sigma_P}} | – | jeklo ≈ 99
\delta | odmik prostega konca konzole | | m |
w_0 | začetna ukrivljenost palice | | m |
:::
