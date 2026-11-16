---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vremenska aplikacija na telefonu kaže napoved za sedem dni, potem se dnevi v tednu ponovijo. Danes je sobota. Kateri dan v tednu bo čez $3^{100}$ dni?

Število $3^{100}$ ima $48$ števk. Nobenega kalkulatorja ne potrebuješ, ker te zanima le ostanek pri deljenju s $7$. Na tekmovanjih je takih vprašanj veliko: zadnja števka ogromne potence, ostanek $2^{2026}$ pri deljenju z $11$, dokaz, da je vsako število oblike $n^{13} - n$ deljivo z $2730$. Vse rešiš z dvema izrekoma o potencah in s pojmom reda.

## Razlaga

**Opazuj vzorec.** Izračunajmo ostanke prvih šestih potenc števil $2$, $3$ in $6$ pri deljenju s $7$. V tabeli so zapisani ostanki, ne potence same. Vsak naslednji ostanek dobiš tako, da prejšnjega pomnožiš z osnovo in znova vzameš ostanek.

| $k$ | $2^k$ | $3^k$ | $6^k$ |
|---|---|---|---|
| 1 | 2 | 3 | 6 |
| 2 | 4 | 2 | 1 |
| 3 | 1 | 6 | 6 |
| 4 | 2 | 4 | 1 |
| 5 | 4 | 5 | 6 |
| 6 | 1 | 1 | 1 |

V zadnji vrstici so same enice. Ko ostanek doseže $1$, se zaporedje začne znova. Pri $3$ pridejo pred tem na vrsto vsi ostanki od $1$ do $6$.

:::premisli
Kateri dan bo torej čez $3^{100}$ dni? Napovej, nato preveri.
---
Ker je $3^6 \equiv 1 \pmod 7$, se ostanki ponavljajo s periodo $6$. Velja $100 = 16 \cdot 6 + 4$, zato je $3^{100} \equiv 3^4 \equiv 4 \pmod 7$. Od sobote naprej štirje dnevi: bo sreda.
:::

V simulaciji spodaj (»Ostanki potenc: mali Fermatov izrek«) nastavi modul na $11$ in preizkusi več osnov od $2$ do $10$. Opazuj, da se vsako zaporedje vrne na $1$ najpozneje pri desetem koraku.

**Mali Fermatov izrek.** Naj bo $p$ praštevilo in $a$ celo število, ki ni deljivo s $p$. Potem velja

$$a^{p-1} \equiv 1 \pmod{p}$$

Če obe strani pomnožimo z $a$, dobimo različico, ki velja za vsako celo število $a$, tudi za večkratnike $p$:

$$a^{p} \equiv a \pmod{p}$$

**Zakaj izrek velja.** Pomnoži ostanke $1, 2, 3, 4, 5, 6$ s $3$ in vzemi ostanke pri deljenju s $7$. Dobiš $3, 6, 2, 5, 1, 4$: isti ostanki v drugem vrstnem redu. Zato sta produkta enaka po modulu $7$: $3^6 \cdot 6! \equiv 6! \pmod 7$. Število $6!$ je tuje s $7$, zato smemo z njim krajšati in ostane $3^6 \equiv 1$. Enak premislek deluje za vsako praštevilo $p$ in vsak $a$, ki ga $p$ ne deli.

**Red števila.** V tabeli se $2$ vrne na $1$ že pri $k = 3$, število $6$ pa pri $k = 2$. Najmanjši naravni $k$, za katerega je $a^k \equiv 1 \pmod n$, imenujemo **red** števila $a$ po modulu $n$. Pišemo $\mathrm{ord}_n(a)$. Po modulu $7$ je red števila $2$ enak $3$, red števila $3$ je $6$, red števila $6$ je $2$.

Red je dolžina cikla ostankov. Zato je $a^m \equiv 1 \pmod n$ natanko takrat, ko red deli $m$. Iz malega Fermatovega izreka sledi: če je $p$ praštevilo in $p \nmid a$, red števila $a$ po modulu $p$ deli $p - 1$.

:::premisli
Ali ima lahko neko število po modulu $11$ red $4$? Utemelji brez računanja.
---
Ne. Red deli $11 - 1 = 10$, delitelji števila $10$ pa so $1$, $2$, $5$ in $10$. Število $4$ ni med njimi.
:::

**Kaj pa, če modul ni praštevilo?** Zadnja števka je ostanek pri deljenju z $10$. Velja $3^4 = 81 \equiv 1 \pmod{10}$, eksponent $9 = 10 - 1$ pa ne deluje: $3^9 \equiv 3 \pmod{10}$. Pravi eksponent je število ostankov, ki so tuji z modulom. Pri $10$ so to $1, 3, 7, 9$, torej štirje.

**Eulerjeva funkcija** $\varphi(n)$ pove, koliko števil med $1$ in $n$ je tujih z $n$. Za praštevilo je $\varphi(p) = p - 1$. Za potenco praštevila velja $\varphi(p^k) = p^k - p^{k-1}$, za tuji števili $m$ in $n$ pa $\varphi(mn) = \varphi(m)\,\varphi(n)$. Od tod splošno pravilo, kjer produkt teče po vseh različnih praštevilih $q$, ki delijo $n$:

$$\varphi(n) = n \prod_{q \mid n} \left(1 - \frac{1}{q}\right)$$

Na primer $100 = 2^2 \cdot 5^2$, zato je $\varphi(100) = 100 \cdot \frac{1}{2} \cdot \frac{4}{5} = 40$.

**Eulerjev izrek.** Če sta $a$ in $n$ tuji, torej $D(a, n) = 1$, potem je

$$a^{\varphi(n)} \equiv 1 \pmod{n}$$

Dokaz je enak kot zgoraj, le da množiš samo ostanke, tuje z $n$. Mali Fermatov izrek je poseben primer za $n = p$.

**Uporaba.** Pri $D(a, n) = 1$ smeš eksponentu odšteti poljuben večkratnik $\varphi(n)$, še bolje reda. Ogromen eksponent tako zamenjaš z njegovim majhnim ostankom pri deljenju s $\varphi(n)$ ali z redom.

## Rešeni primeri

### Primer 1 (lažji)

Kolikšen je ostanek števila $2^{2025}$ pri deljenju z $11$?

**Podatki:** osnova $a = 2$, eksponent $2025$, modul $p = 11$ (praštevilo)
**Iščemo:** ostanek $2^{2025} \bmod 11$

:::formula
Mali Fermatov izrek: $a^{p-1} \equiv 1 \pmod p$, če $p \nmid a$
:::

**Rešitev:**

1. Število $11$ je praštevilo in ne deli $2$, zato velja $2^{10} \equiv 1 \pmod{11}$.
2. Eksponent delimo z $10$: $2025 = 202 \cdot 10 + 5$.
3. Zato je $2^{2025} = (2^{10})^{202} \cdot 2^5 \equiv 1 \cdot 32 \pmod{11}$.
4. $32 = 2 \cdot 11 + 10$, ostanek je $10$.
5. Odgovor: $2^{2025}$ da pri deljenju z $11$ ostanek $10$.

### Primer 2

V hranljivi raztopini se bakterije vsako uro potrojijo. Začnemo z eno bakterijo. Kateri sta zadnji dve števki števila bakterij po $2026$ urah (če bi rast trajala tako dolgo)?

**Podatki:** število bakterij po $2026$ urah je $3^{2026}$, zadnji dve števki sta ostanek pri deljenju s $100$
**Iščemo:** $3^{2026} \bmod 100$

:::formula
Eulerjev izrek: $a^{\varphi(n)} \equiv 1 \pmod n$, če $D(a, n) = 1$; $\varphi(100) = 40$
:::

**Rešitev:**

1. $D(3, 100) = 1$, zato smemo uporabiti Eulerjev izrek. Ker je $\varphi(100) = 40$, je $3^{40} \equiv 1 \pmod{100}$.
2. $2026 = 50 \cdot 40 + 26$, torej $3^{2026} \equiv 3^{26} \pmod{100}$.
3. $3^{10} = 59049 \equiv 49 \pmod{100}$.
4. $3^{20} \equiv 49^2 = 2401 \equiv 1 \pmod{100}$. Red števila $3$ torej deli $20$. Vsak manjši delitelj števila $20$ deli $4$ ali $10$, a $3^4 = 81$ in $3^{10}$ ne dasta ostanka $1$. Zato je red enak $20$, torej manjši od $\varphi(100) = 40$.
5. $3^{26} = 3^{20} \cdot 3^6 \equiv 3^6 = 729 \equiv 29 \pmod{100}$.
6. Odgovor: število bakterij bi se končalo na $29$.

### Primer 3 (težji)

Dokaži, da je število $n^{13} - n$ deljivo z $2730$ za vsako celo število $n$.

**Podatki:** $2730 = 2 \cdot 3 \cdot 5 \cdot 7 \cdot 13$, $n$ je poljubno celo število
**Iščemo:** dokaz, da $2730 \mid n^{13} - n$

:::formula
$a^{p-1} \equiv 1 \pmod p$, če $p \nmid a$; iz $(p-1) \mid 12$ sledi $n^{12} \equiv 1 \pmod p$
:::

**Rešitev:**

1. Razcep: $2730 = 2 \cdot 3 \cdot 5 \cdot 7 \cdot 13$. Ta praštevila so različna, zato je dovolj pokazati, da vsako od njih deli $n^{13} - n$.
2. Za ta praštevila je $p - 1$ po vrsti $1, 2, 4, 6, 12$. Vsa ta števila delijo $12$.
3. Če $p \nmid n$, je $n^{p-1} \equiv 1 \pmod p$. Ker $(p - 1) \mid 12$, sledi $n^{12} \equiv 1$ in zato $n^{13} \equiv n \pmod p$.
4. Če $p \mid n$, sta $n^{13}$ in $n$ oba deljiva s $p$, zato $p \mid n^{13} - n$.
5. Vseh pet praštevil deli $n^{13} - n$. Ker so različna, deli tudi njihov produkt $2730$. Preizkus pri $n = 2$: $2^{13} - 2 = 8190 = 3 \cdot 2730$.
6. Odgovor: $2730 \mid n^{13} - n$ za vsako celo število $n$.

### Primer 4 – zdaj ti

Za katera naravna števila $n$ je $2^n - 1$ deljivo s $7$? Ali je kdaj $2^n + 1$ deljivo s $7$?

**Podatki:** modul $7$, osnova $2$
**Iščemo:** vse $n$ z $7 \mid 2^n - 1$ in odgovor za $2^n + 1$

:::formula
$a^m \equiv 1 \pmod p$ natanko takrat, ko $\mathrm{ord}_p(a) \mid m$
:::

**Rešitev:**

1. Ostanki potenc števila $2$ pri deljenju s $7$ so $2, 4, 1, 2, 4, 1, \ldots$, zato je $\mathrm{ord}_7(2) = 3$.
2. $7 \mid 2^n - 1$ pomeni $2^n \equiv 1 \pmod 7$. Dokončaj sam.

:::premisli
Kateri $n$ ustrezajo prvemu pogoju in kaj velja za $2^n + 1$?
---
Prvi pogoj velja natanko takrat, ko $3 \mid n$. Za $7 \mid 2^n + 1$ bi potrebovali $2^n \equiv 6 \pmod 7$, a ostanki so le $1$, $2$ in $4$. Zato $2^n + 1$ nikoli ni deljivo s $7$.
:::

## Pogoste napake

- **Mali Fermatov izrek pri sestavljenem modulu.** »$2^8 \equiv 1 \pmod 9$, ker je $9 - 1 = 8$.« V resnici je $2^8 = 256 \equiv 4 \pmod 9$. Eksponent $p - 1$ velja samo za praštevilo. Pri modulu $9$ uporabi $\varphi(9) = 6$: $2^6 = 64 \equiv 1 \pmod 9$.
- **Eksponent zmanjšan po napačnem modulu.** Pri $3^{100} \bmod 7$ nekdo vzame $100 \bmod 7 = 2$ in dobi $3^2 \equiv 2$. Eksponent se ponavlja s periodo $p - 1 = 6$ (oziroma redom), ne s periodo $7$. Pravilno: $100 \bmod 6 = 4$, rezultat $4$.
- **Pozabljen pogoj o tujosti.** Za $a = 14$ in $p = 7$ je vsaka potenca $14$ deljiva s $7$, ostanek je $0$, nikoli $1$. Izrek zahteva $p \nmid a$ oziroma $D(a, n) = 1$.
- **»Red je vedno $p - 1$.«** Red le deli $p - 1$. Po modulu $7$ ima $2$ red $3$, število $6$ pa red $2$.
- **Napačna $\varphi$.** $\varphi(n) = n - 1$ velja samo za praštevila. Tudi $\varphi(4) \neq \varphi(2) \cdot \varphi(2)$, ker $2$ in $2$ nista tuji: pravilno je $\varphi(4) = 2$.

## Povzetek

- Mali Fermatov izrek: če je $p$ praštevilo in $p \nmid a$, je $a^{p-1} \equiv 1 \pmod p$; za vsak $a$ velja $a^p \equiv a \pmod p$.
- Eulerjeva funkcija $\varphi(n)$ šteje števila od $1$ do $n$, tuja z $n$; $\varphi(n) = n \prod (1 - 1/q)$ po praštevilih $q \mid n$.
- Eulerjev izrek: pri $D(a, n) = 1$ je $a^{\varphi(n)} \equiv 1 \pmod n$.
- Red $\mathrm{ord}_n(a)$ je najmanjši $k > 0$ z $a^k \equiv 1$. Velja $a^m \equiv 1$ natanko tedaj, ko red deli $m$; red deli $\varphi(n)$.
- Velik eksponent zamenjaj z njegovim ostankom pri deljenju z redom ali s $\varphi(n)$, nikoli z modulom.

## Drugače: Korak za korakom s številkami

Recept na nalogi »ostanek $7^{2026}$ pri deljenju z $12$«:

1. Preveri tujost: $D(7, 12) = 1$, izrek smemo uporabiti.
2. Izračunaj $\varphi(12) = 12 \cdot \frac{1}{2} \cdot \frac{2}{3} = 4$. Tuji ostanki so $1, 5, 7, 11$.
3. Poišči red, ker je lahko manjši: $7^2 = 49 = 4 \cdot 12 + 1$, torej $\mathrm{ord}_{12}(7) = 2$.
4. Zmanjšaj eksponent: $2026$ je sod, zato $7^{2026} = (7^2)^{1013} \equiv 1$.
5. Ostanek je $1$. Preizkus z manjšim sodim eksponentom: $7^4 = 2401 = 200 \cdot 12 + 1$.

## Drugače: Kot zgodba

Ob ribniku leži v krogu šest lokvanjev, označenih s $1, 2, 3, 4, 5, 6$. Žaba ima pravilo: številko svojega lokvanja pomnoži s $3$ in skoči na lokvanj, katerega številka je ostanek tega produkta pri deljenju s $7$.

Začne na $1$ in skače: $1 \to 3 \to 2 \to 6 \to 4 \to 5 \to 1$. Po šestih skokih je doma in je obiskala vse lokvanje. Druga žaba množi z $2$: $1 \to 2 \to 4 \to 1$. Domov pride že po treh skokih, lokvanjev $3$, $5$ in $6$ pa ne obišče nikoli.

Število skokov do doma je red. Ne glede na pravilo (pomnoži z $a$, kjer $7 \nmid a$) pride vsaka žaba domov po številu skokov, ki deli $6$. Po šestih skokih so zato vse doma: to je mali Fermatov izrek.

## Preveri se

? Zakaj za $a = 14$ in $p = 7$ ne velja $a^{6} \equiv 1 \pmod 7$?
- Ker $14$ ni praštevilo.
~ Praštevilo mora biti modul $p$, osnova $a$ je lahko katerokoli celo število, ki ga $p$ ne deli.
+ Ker $7$ deli $14$, zato je vsaka potenca $14$ deljiva s $7$ in ostanek je $0$.
- Ker je $14$ večje od $7$.
~ Velikost osnove ne igra vloge: $15^6 \equiv 1 \pmod 7$, ker je $15 \equiv 1$.
> Izrek zahteva $p \nmid a$. Pri $14 \equiv 0 \pmod 7$ je $14^6 \equiv 0$.

? Risba kaže cikel ostankov potenc števila $5$ pri deljenju s $13$: vsaka puščica pomeni »pomnoži s $5$ in vzemi ostanek«. Z risbe odčitaj red in izračunaj ostanek $5^{2027}$ pri deljenju s $13$.
:::risba skica
opis: Štirje ostanki v krogu, povezani s puščicami v smeri urinega kazalca. Zgoraj 5, desno 12, spodaj 8, levo 1. Puščice: od 5 do 12, od 12 do 8, od 8 do 1 in od 1 nazaj do 5. Ob vsaki puščici piše krat 5.
območje: 0; 0 .. 6; 6
enota: 40
točka: 3; 5 | 5 | nad | modra
točka: 5; 3 | 12 | desno | modra
točka: 3; 1 | 8 | pod | modra
točka: 1; 3 | 1 | levo | modra
puščica: 3,4; 4,6 -> 4,6; 3,4 | · 5 | desno | puščica
puščica: 4,6; 2,6 -> 3,4; 1,4 | · 5 | desno | puščica
puščica: 2,6; 1,4 -> 1,4; 2,6 | · 5 | levo | puščica
puščica: 1,4; 3,4 -> 2,6; 4,6 | · 5 | levo | puščica
:::
= 8
~ 1 | Eksponent si zmanjšal po modulu $13$ ($2027 \equiv 12$). Cikel ima dolžino $4$, zato vzemi $2027 \bmod 4$.
~ 12 | Zamaknil si štetje: $5^1 = 5$ je prvi korak, $5^3$ je tretji ostanek v ciklu.
> Cikel $5 \to 12 \to 8 \to 1$ ima dolžino $4$, torej $\mathrm{ord}_{13}(5) = 4$. Ker je $2027 = 506 \cdot 4 + 3$, je $5^{2027} \equiv 5^3 \equiv 8 \pmod{13}$.

? Kateri red ne more imeti nobeno število po modulu $13$?
- $3$
~ $3$ deli $12$; tak red ima na primer število $3$, saj je $3^3 = 27 \equiv 1 \pmod{13}$.
+ $5$
- $12$
~ $12 = p - 1$ je največji možni red; ima ga na primer število $2$.
- $6$
~ $6$ deli $12$; tak red ima na primer število $4$.
> Red deli $\varphi(13) = 12$. Delitelji števila $12$ so $1, 2, 3, 4, 6, 12$; števila $5$ ni med njimi.

? Kolikšen odstotek števil od $1$ do $3\,000\,000$ je tujih s $30$? Oceni z $\varphi$ na eno decimalko.
= 26,7 % | 0,1
~ 96,7 | Uporabil si $\varphi(30) = 29$, kot da bi bilo $30$ praštevilo.
~ 73,3 | To je delež števil, ki s $30$ niso tuja.
> $\varphi(30) = 30 \cdot \frac{1}{2} \cdot \frac{2}{3} \cdot \frac{4}{5} = 8$. V vsakem bloku $30$ zaporednih števil je $8$ tujih s $30$, delež je $\frac{8}{30} \approx 26{,}7\,\%$.

? Kolikšen je ostanek števila $3^{2^{100}}$ pri deljenju s $7$?
= 4
~ 2 | Eksponent $2^{100}$ si zmanjšal po modulu $7$. Zmanjšati ga moraš po redu $6$.
~ 3 | Uporabil si $2^{100} \equiv 1 \pmod 6$, kot da bi veljal Eulerjev izrek, a $2$ in $6$ nista tuji.
> $\mathrm{ord}_7(3) = 6$, zato potrebujemo $2^{100} \bmod 6$. Število $2^{100}$ je sodo in da pri deljenju s $3$ ostanek $1$ (sodi eksponent), zato je $2^{100} \equiv 4 \pmod 6$. Sledi $3^{2^{100}} \equiv 3^4 = 81 \equiv 4 \pmod 7$.

<<RACUN
vrednost: Mod(3^100, 7) | 4
vrednost: Mod(3^9, 10) | 3
vrednost: Mod(2^8, 9) | 4
vrednost: Mod(2^6, 9) | 1
vrednost: 100*(1/2)*(4/5) | 40
vrednost: Mod(2^2025, 11) | 10
vrednost: Mod(3^10, 100) | 49
vrednost: Mod(3^20, 100) | 1
vrednost: Mod(3^2026, 100) | 29
vrednost: Mod(2^13-2, 2730) | 0
vrednost: Mod(7^2026, 12) | 1
vrednost: Mod(5^2027, 13) | 8
vrednost: 30*(1/2)*(2/3)*(4/5) | 8
vrednost: 8/30*100 | 26.7
vrednost: Mod(2^100, 6) | 4
vrednost: Mod(3^4, 7) | 4
>>

:::simboli
a | osnova potence (celo število) | | | pri izrekih tuja z modulom
p | praštevilo (modul) | | |
n | modul (naravno število) | | | v Primerih 3 in 4 neznano število iz naloge
q | praštevilo, ki deli $n$ | | |
k | eksponent; najmanjši $k > 0$ z $a^k \equiv 1$ je red | | |
m | eksponent | | |
\varphi | Eulerjeva funkcija $\varphi(n)$: število ostankov, tujih z $n$ | \varphi(n) = n \prod_{q \mid n} \left(1 - \frac{1}{q}\right) | |
\mathrm{ord} | red števila $a$ po modulu $n$ | | | najmanjši $k > 0$ z $a^k \equiv 1$
D | največji skupni delitelj, $D(a, n)$ | | |
:::
