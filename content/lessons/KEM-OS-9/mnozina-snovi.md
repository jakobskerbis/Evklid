---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

V začetku 19. stoletja je angleški kemik John Dalton trdil, da je vsaka snov zgrajena iz atomov in da se atomi pri reakcijah spajajo v preprostih številskih razmerjih. V ogljikovem dioksidu je na primer en atom ogljika vezan na dva atoma kisika. Kemiki tistega časa so imeli tehtnice, naprave za štetje atomov pa ne. Kako naj odmeriš »en atom ogljika na dva atoma kisika«, če lahko snov samo tehtaš?

Rešitev spominja na zemljevid. Na pohodniškem zemljevidu v merilu $1 : 25\,000$ izmeriš z ravnilom $4\,\mathrm{cm}$ in veš, da te čaka $1\,\mathrm{km}$ poti. Razdalje ne meriš na terenu, ampak jo preračunaš z merilom. Kemiki so potrebovali podobno »merilo« med grami na tehtnici in številom delcev. Ime zanj, **mol**, je ob koncu 19. stoletja uvedel nemški kemik Wilhelm Ostwald (iz besede molekula).

Še danes je to osnova vsakega kemijskega računa: koliko gramov soli odtehtati, koliko kisika porabi gorilnik na kampiranju, koliko zdravilne učinkovine je v tableti.

## Razlaga

**1. En račun za začetek.** Oglje za žar na izletu je skoraj čisti ogljik. Vzemimo $12\,\mathrm{g}$ ogljika. En atom ogljika ima maso približno $1{,}993 \cdot 10^{-23}\,\mathrm{g}$. Koliko atomov je v vzorcu? Maso vzorca delimo z maso enega atoma:

$$N = \frac{12\,\mathrm{g}}{1{,}993 \cdot 10^{-23}\,\mathrm{g}} \approx 6{,}02 \cdot 10^{23}$$

To je $602\,000$ milijard milijard atomov. Prešteti jih ne more nihče, stehtati $12\,\mathrm{g}$ pa zna vsak.

**2. Isti račun za kisik.** V periodnem sistemu ima ogljik relativno atomsko maso $12$, kisik pa $16$. Relativna atomska masa pove, kolikokrat je atom težji od dvanajstine mase atoma ogljika-12. Atom kisika je torej $\tfrac{16}{12}$-krat težji od atoma ogljika. Če vzamemo $16\,\mathrm{g}$ kisika, je tudi vzorec $\tfrac{16}{12}$-krat težji. Zato je v $16\,\mathrm{g}$ kisika natanko toliko atomov kot v $12\,\mathrm{g}$ ogljika.

:::premisli
Žveplo (S) ima relativno atomsko maso $32$. Koliko gramov žvepla moraš odtehtati, da dobiš enako število atomov kot v $12\,\mathrm{g}$ ogljika? Napovej, preden pogledaš.
---
$32\,\mathrm{g}$. Atom žvepla je $\tfrac{32}{12}$-krat težji od atoma ogljika, zato mora biti v tem razmerju težji tudi vzorec.
:::

**3. Mol.** Če od katerega koli elementa odtehtaš toliko gramov, kolikor kaže njegova relativna atomska masa, dobiš vedno $6{,}02 \cdot 10^{23}$ atomov. Zato so temu številu dali ime.

**Množina snovi** $n$ je veličina, ki pove, koliko delcev (atomov, molekul ali ionov) je v vzorcu. Njena enota je **mol**. En mol je množina snovi, ki vsebuje $6{,}02 \cdot 10^{23}$ delcev. To število imenujemo **Avogadrovo število**, po italijanskem znanstveniku Amedeu Avogadru; sam ga ni izmeril, poimenovali so ga v njegovo čast. Zapisano kot število delcev na mol je to **Avogadrova konstanta**: $N_A = 6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$.

Podobno kot je ducat $12$ kosov, je mol zelo velik »ducat«. Zato vedno povej, katere delce šteješ: $1\,\mathrm{mol}$ atomov vsebuje $6{,}02 \cdot 10^{23}$ atomov, $1\,\mathrm{mol}$ molekul pa $6{,}02 \cdot 10^{23}$ molekul.

**4. Molska masa.** **Molska masa** $M$ je masa enega mola snovi. Enota je $\mathrm{g/mol}$. Pri elementih je njena številska vrednost enaka relativni atomski masi iz periodnega sistema. Pri spojinah je enaka relativni molekulski masi: seštejemo molske mase vseh atomov v formuli in upoštevamo indekse. Za vodo $\mathrm{H_2O}$:

$$M(\mathrm{H_2O}) = 2 \cdot 1 + 16 = 18\,\mathrm{g/mol}$$

Tabela kaže vzorce, ki vsebujejo po $1\,\mathrm{mol}$ delcev:

| Snov | Formula | Masa $1\,\mathrm{mol}$ |
|---|---|---|
| vodik (atomi) | $\mathrm{H}$ | $1\,\mathrm{g}$ |
| ogljik | $\mathrm{C}$ | $12\,\mathrm{g}$ |
| kisik (atomi) | $\mathrm{O}$ | $16\,\mathrm{g}$ |
| voda | $\mathrm{H_2O}$ | $18\,\mathrm{g}$ |
| natrij | $\mathrm{Na}$ | $23\,\mathrm{g}$ |
| klor (atomi) | $\mathrm{Cl}$ | $35{,}5\,\mathrm{g}$ |
| ogljikov dioksid | $\mathrm{CO_2}$ | $44\,\mathrm{g}$ |
| natrijev klorid | $\mathrm{NaCl}$ | $58{,}5\,\mathrm{g}$ |

Število delcev je v vsaki vrstici enako. Mase so različne, ker so delci različno težki. Pri ionskih spojinah, kot je $\mathrm{NaCl}$, ne govorimo o molekulah, ampak o **formulskih enotah** (en $\mathrm{Na^+}$ in en $\mathrm{Cl^-}$).

V simulaciji spodaj »Množina snovi in molska masa« izberi vodo in pritisni »1 mol«. Nato izberi saharozo in znova pritisni »1 mol«. Opazuj: število delcev je obakrat $6{,}02 \cdot 10^{23}$, mol saharoze pa tehta skoraj dvajsetkrat več (približno $342\,\mathrm{g}$).

**5. Od mase do množine.** Koliko molov je v $24\,\mathrm{g}$ ogljika? En mol ogljika tehta $12\,\mathrm{g}$, $24\,\mathrm{g}$ je dvakrat toliko, torej $2\,\mathrm{mol}$. Računali smo: masa vzorca deljeno z maso enega mola. Splošno:

$$n = \frac{m}{M}$$

kjer je $n$ množina snovi v $\mathrm{mol}$, $m$ masa vzorca v $\mathrm{g}$ in $M$ molska masa v $\mathrm{g/mol}$. Enote se izidejo: deliti z $\mathrm{g/mol}$ pomeni množiti z $\mathrm{mol/g}$, zato $\mathrm{g} : \mathrm{g/mol} = \mathrm{mol}$. Iz te enačbe dobimo še:

$$m = n \cdot M \qquad M = \frac{m}{n}$$

:::premisli
Kje je več atomov: v $1\,\mathrm{mol}$ vode $\mathrm{H_2O}$ ali v $1\,\mathrm{mol}$ kisika $\mathrm{O_2}$? Mol kisika je težji ($32\,\mathrm{g}$ proti $18\,\mathrm{g}$).
---
V molu vode. Molekul je v obeh enako, a vsaka molekula vode ima $3$ atome, molekula kisika pa $2$. V molu vode so torej $3\,\mathrm{mol}$ atomov, v molu kisika $2\,\mathrm{mol}$. Večja masa ne pomeni več delcev, ker so atomi kisika težji od atomov vodika.
:::

**6. Število delcev.** Če poznaš množino, je število delcev $N = n \cdot N_A$. Več o tem v naslednji lekciji.

## Rešeni primeri

### Primer 1: molska masa spojine

Izračunaj molsko maso ogljikovega dioksida $\mathrm{CO_2}$. Uporabi $M(\mathrm{C}) = 12\,\mathrm{g/mol}$ in $M(\mathrm{O}) = 16\,\mathrm{g/mol}$.

**Podatki:** formula $\mathrm{CO_2}$, $M(\mathrm{C}) = 12\,\mathrm{g/mol}$, $M(\mathrm{O}) = 16\,\mathrm{g/mol}$
**Iščemo:** molsko maso $M(\mathrm{CO_2})$

:::formula
Molska masa spojine je vsota molskih mas vseh atomov v formuli (z upoštevanjem indeksov): $M(\mathrm{CO_2}) = M(\mathrm{C}) + 2 \cdot M(\mathrm{O})$
:::

**Rešitev:**

1. Formula pove, da je v eni molekuli $1$ atom ogljika in $2$ atoma kisika.
2. Seštejemo molske mase atomov, pri čemer upoštevamo indekse: $M(\mathrm{CO_2}) = 12 + 2 \cdot 16$.
3. Izračunamo: $12 + 32 = 44$.
4. Odgovor: $M(\mathrm{CO_2}) = 44\,\mathrm{g/mol}$.

### Primer 2: voda v bidonu

Kolesar ima na izletu v bidonu $540\,\mathrm{g}$ vode $\mathrm{H_2O}$. Koliko molov vode je to? Uporabi $M(\mathrm{H}) = 1\,\mathrm{g/mol}$ in $M(\mathrm{O}) = 16\,\mathrm{g/mol}$.

**Podatki:** $m = 540\,\mathrm{g}$, formula $\mathrm{H_2O}$, $M(\mathrm{H}) = 1\,\mathrm{g/mol}$, $M(\mathrm{O}) = 16\,\mathrm{g/mol}$
**Iščemo:** množino snovi $n$

:::formula
$n = \dfrac{m}{M}$
:::

**Rešitev:**

1. Iščemo množino $n$, poznamo maso $m = 540\,\mathrm{g}$. Potrebujemo še molsko maso.
2. Vodik štejemo dvakrat, ker ima indeks $2$: $M(\mathrm{H_2O}) = 2 \cdot 1 + 16 = 18\,\mathrm{g/mol}$.
3. Uporabimo $n = \dfrac{m}{M}$:
$$n = \frac{540\,\mathrm{g}}{18\,\mathrm{g/mol}} = 30\,\mathrm{mol}$$
4. Smiselnost: en mol vode tehta $18\,\mathrm{g}$, in $30 \cdot 18 = 540$. ✓
5. Odgovor: v bidonu je $30\,\mathrm{mol}$ vode.

### Primer 3: glukoza za vzpon

Pohodnik pred vzponom na vrh poje $6$ tablet glukoze. Na škatlici piše, da ena tableta vsebuje $3\,\mathrm{g}$ glukoze $\mathrm{C_6H_{12}O_6}$. Koliko molov glukoze je pojedel? Uporabi $M(\mathrm{C}) = 12\,\mathrm{g/mol}$, $M(\mathrm{H}) = 1\,\mathrm{g/mol}$ in $M(\mathrm{O}) = 16\,\mathrm{g/mol}$.

**Podatki:** $6$ tablet, $3\,\mathrm{g}$ glukoze na tableto, formula $\mathrm{C_6H_{12}O_6}$, $M(\mathrm{C}) = 12\,\mathrm{g/mol}$, $M(\mathrm{H}) = 1\,\mathrm{g/mol}$, $M(\mathrm{O}) = 16\,\mathrm{g/mol}$
**Iščemo:** množino glukoze $n$

:::formula
Skupna masa, nato $M(\mathrm{C_6H_{12}O_6}) = 6 \cdot M(\mathrm{C}) + 12 \cdot M(\mathrm{H}) + 6 \cdot M(\mathrm{O})$ in $n = \dfrac{m}{M}$
:::

**Rešitev:**

1. **Skupna masa.** V formulo gre masa vsega, kar je pojedel: $m = 6 \cdot 3\,\mathrm{g} = 18\,\mathrm{g}$.
2. **Molska masa.** Upoštevamo vse tri indekse: $M = 6 \cdot 12 + 12 \cdot 1 + 6 \cdot 16 = 180\,\mathrm{g/mol}$.
3. **Množina.**
$$n = \frac{18\,\mathrm{g}}{180\,\mathrm{g/mol}} = 0{,}1\,\mathrm{mol}$$
4. Smiselnost: masa je desetina molske mase, zato je množina desetina mola. ✓
5. Odgovor: pohodnik je pojedel $0{,}1\,\mathrm{mol}$ glukoze.

### Primer 4: zdaj ti

Za poskus moramo odtehtati $0{,}20\,\mathrm{mol}$ natrijevega klorida $\mathrm{NaCl}$. Koliko gramov soli damo na tehtnico? Uporabi $M(\mathrm{Na}) = 23\,\mathrm{g/mol}$ in $M(\mathrm{Cl}) = 35{,}5\,\mathrm{g/mol}$.

**Podatki:** $n = 0{,}20\,\mathrm{mol}$, formula $\mathrm{NaCl}$, $M(\mathrm{Na}) = 23\,\mathrm{g/mol}$, $M(\mathrm{Cl}) = 35{,}5\,\mathrm{g/mol}$
**Iščemo:** maso $m$

:::formula
$m = n \cdot M$
:::

**Rešitev:**

1. **Molska masa.** $M(\mathrm{NaCl}) = 23 + 35{,}5 = 58{,}5\,\mathrm{g/mol}$.
2. Iščemo maso, zato vzamemo obliko $m = n \cdot M$.
3. Vstavi in izračunaj sam, nato preveri:

:::premisli
Koliko je $m = 0{,}20\,\mathrm{mol} \cdot 58{,}5\,\mathrm{g/mol}$?
---
$m = 11{,}7\,\mathrm{g}$. Preverba: $0{,}20\,\mathrm{mol}$ je petina mola, petina od $58{,}5\,\mathrm{g}$ pa je $11{,}7\,\mathrm{g}$.
:::

## Pogoste napake

- **Pozabljeni indeksi.** Učenec pri $\mathrm{H_2O}$ sešteje $1 + 16 = 17$, ker vidi en H. Indeks $2$ pomeni dva atoma vodika v vsaki molekuli. Pravilno: $2 \cdot 1 + 16 = 18\,\mathrm{g/mol}$.
- **Obrnjena enačba.** Učenec računa $n = \dfrac{M}{m}$ ali $n = m \cdot M$, ker si zapomni le, da »nastopata $m$ in $M$«. Takrat se enote ne izidejo: $\mathrm{g/mol} : \mathrm{g}$ ni $\mathrm{mol}$. Popravek: preveri enote, $\mathrm{g} : \mathrm{g/mol} = \mathrm{mol}$.
- **Mešanje mase in molske mase.** Učenec kot $m$ vstavi molsko maso, ker sta obe »masi«. Masa $m$ je podatek o vzorcu (v $\mathrm{g}$, s tehtnice), molska masa $M$ je lastnost snovi (v $\mathrm{g/mol}$, iz formule).
- **Mol kot masa.** Učenec misli, da ima $1\,\mathrm{mol}$ vsake snovi enako maso ali da težji vzorec vsebuje več delcev. En mol vsebuje vedno enako število delcev, masa pa je odvisna od tega, kako težki so delci: $1\,\mathrm{mol}$ vode tehta $18\,\mathrm{g}$, $1\,\mathrm{mol}$ $\mathrm{NaCl}$ pa $58{,}5\,\mathrm{g}$.

## Povzetek

- Množina snovi $n$ pove, koliko delcev je v vzorcu. Enota je $\mathrm{mol}$.
- $1\,\mathrm{mol}$ vsebuje $6{,}02 \cdot 10^{23}$ delcev (Avogadrovo število).
- Molska masa $M$ je masa $1\,\mathrm{mol}$ snovi, enota $\mathrm{g/mol}$. Številčno je enaka relativni atomski oziroma molekulski masi.
- Molsko maso spojine dobimo s seštevanjem molskih mas atomov z upoštevanjem indeksov.
- $n = \dfrac{m}{M}$, $m = n \cdot M$, $M = \dfrac{m}{n}$.
- Število delcev: $N = n \cdot N_A$, kjer je $N_A = 6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$.

## Drugače: Z analogijo

Molska masa je kot merilo zemljevida.

- Na zemljevidu z ravnilom izmeriš centimetre, zanima pa te pot v kilometrih. Merilo $1 : 25\,000$ pove, da je $4\,\mathrm{cm}$ na karti $1\,\mathrm{km}$ v naravi.
- V kemiji s tehtnico izmeriš grame, zanima pa te število delcev. Molska masa pove, koliko gramov je en »paket« $6{,}02 \cdot 10^{23}$ delcev.

Vsaka karta ima svoje merilo in vsaka snov svojo molsko maso. Za vodo je »$18\,\mathrm{g}$ na mol«, za sol »$58{,}5\,\mathrm{g}$ na mol«. Če zamenjaš merilo dveh kart, zgrešiš pot. Če zamenjaš molsko maso dveh snovi, zgrešiš množino.

Pomaga še ducat jajc. Ducat je vedno $12$ kosov, ne glede na to, ali so jajca majhna ali velika; masa ducata pa je odvisna od jajc. Mol je vedno $6{,}02 \cdot 10^{23}$ delcev, masa mola pa je odvisna od tega, kako težki so delci.

## Drugače: Bolj natančno

Molska masa je definirana kot razmerje med maso vzorca in množino snovi:

$$M = \frac{m}{n}$$

Iz tega neposredno sledi $n = \dfrac{m}{M}$.

Zakaj je številska vrednost molske mase enaka relativni atomski masi? Relativna atomska masa pove, kolikokrat je atom težji od dvanajstine mase atoma ogljika-12. Mol je izbran tako, da ima $6{,}02 \cdot 10^{23}$ atomov ogljika-12 maso $12\,\mathrm{g}$. Zato ima vsak element, katerega atom je $k$-krat težji od te dvanajstine, molsko maso $k\,\mathrm{g/mol}$.

Od leta 2019 mol ni več vezan na ogljik, ampak je določen neposredno s številom: en mol vsebuje natanko $6{,}02214076 \cdot 10^{23}$ delcev. Masa mola ogljika-12 je zato le še zelo natančno, ne pa več točno, $12\,\mathrm{g}$. Pri šolskih računih to ne spremeni ničesar.

Relativne atomske mase v periodnem sistemu so povprečja, ker ima večina elementov več izotopov. Klor je mešanica atomov z masnim številom $35$ (približno tri četrtine) in $37$ (približno četrtina), zato je $M(\mathrm{Cl}) = 35{,}5\,\mathrm{g/mol}$ in ne celo število.

Pri spojinah je masa $1\,\mathrm{mol}$ molekul vsota mas atomov v molekuli. $1\,\mathrm{mol}$ molekul $\mathrm{H_2O}$ vsebuje $2\,\mathrm{mol}$ atomov vodika in $1\,\mathrm{mol}$ atomov kisika, zato je $M = 2 \cdot 1 + 16 = 18\,\mathrm{g/mol}$.

## Preveri se

? Kateri vzorec **ne** vsebuje $1\,\mathrm{mol}$ delcev? ($M(\mathrm{C}) = 12$, $M(\mathrm{H}) = 1$, $M(\mathrm{O}) = 16$, $M(\mathrm{Na}) = 23$, vse v $\mathrm{g/mol}$)
- $12\,\mathrm{g}$ ogljika $\mathrm{C}$
~ Masa je enaka molski masi ogljika, zato je to natanko $1\,\mathrm{mol}$ atomov.
- $18\,\mathrm{g}$ vode $\mathrm{H_2O}$
~ Kdor pozabi indeks, dobi $M = 17$ in misli, da to ni mol. Pravilno je $M = 18\,\mathrm{g/mol}$, torej $1\,\mathrm{mol}$.
+ $16\,\mathrm{g}$ kisika $\mathrm{O_2}$
- $23\,\mathrm{g}$ natrija $\mathrm{Na}$
~ Masa je enaka molski masi natrija, zato je to $1\,\mathrm{mol}$ atomov.
> Kisik je zgrajen iz molekul $\mathrm{O_2}$ z dvema atomoma, zato je $M(\mathrm{O_2}) = 32\,\mathrm{g/mol}$ in $16\,\mathrm{g}$ je le $0{,}5\,\mathrm{mol}$ molekul. Atomov kisika je v tem vzorcu sicer $1\,\mathrm{mol}$, zato vedno povej, katere delce šteješ.

? Koliko molov je v $22\,\mathrm{g}$ ogljikovega dioksida $\mathrm{CO_2}$ ($M = 44\,\mathrm{g/mol}$)?
- $2\,\mathrm{mol}$
~ To je $\dfrac{M}{m}$, obrnjena enačba. Enote: $\mathrm{g/mol} : \mathrm{g}$ ni $\mathrm{mol}$.
- $968\,\mathrm{mol}$
~ To je $m \cdot M$. Množino dobiš z deljenjem mase z molsko maso.
+ $0{,}5\,\mathrm{mol}$
> $n = \dfrac{m}{M} = \dfrac{22\,\mathrm{g}}{44\,\mathrm{g/mol}} = 0{,}5\,\mathrm{mol}$.

? Zakaj ima $1\,\mathrm{mol}$ natrijevega klorida večjo maso kot $1\,\mathrm{mol}$ vode?
- Ker je v molu $\mathrm{NaCl}$ več delcev.
~ V vsakem molu je enako število delcev, $6{,}02 \cdot 10^{23}$.
+ Ker je vsaka formulska enota $\mathrm{NaCl}$ težja od molekule vode.
- Ker je sol trdna, voda pa tekoča.
~ Agregatno stanje ne vpliva na maso delcev. Molska masa je odvisna le od atomov v formuli.
> Število delcev je enako, zato o masi mola odloča masa enega delca: $58{,}5\,\mathrm{g/mol}$ proti $18\,\mathrm{g/mol}$.

? Ana računa množino $36\,\mathrm{g}$ vode. 1. korak: $M(\mathrm{H_2O}) = 1 + 16 = 17\,\mathrm{g/mol}$. 2. korak: izbere $n = \dfrac{m}{M}$. 3. korak: $n = \dfrac{36}{17} \approx 2{,}1\,\mathrm{mol}$. Kateri korak je napačen?
+ 1. korak
- 2. korak
~ Enačba $n = \dfrac{m}{M}$ je prava, enote se izidejo v $\mathrm{mol}$.
- 3. korak
~ Deljenje je pravilno izvedeno; napačen je podatek, ki ga je prinesla iz 1. koraka.
- Noben, rezultat je pravilen.
~ Pravi rezultat je $2\,\mathrm{mol}$, ker je $M(\mathrm{H_2O}) = 18\,\mathrm{g/mol}$.
> Pozabila je indeks $2$ pri vodiku. Pravilno: $M = 2 \cdot 1 + 16 = 18\,\mathrm{g/mol}$ in $n = \dfrac{36}{18} = 2\,\mathrm{mol}$.

? Pohodnik ima v steklenici $500\,\mathrm{g}$ vode $\mathrm{H_2O}$ ($M = 18\,\mathrm{g/mol}$). Koliko molov vode nosi?
- $9000\,\mathrm{mol}$
~ To je $m \cdot M$. Masa gre v števec, molska masa v imenovalec.
- $0{,}036\,\mathrm{mol}$
~ To je $\dfrac{M}{m}$, obrnjena enačba.
+ približno $27{,}8\,\mathrm{mol}$
- približno $29{,}4\,\mathrm{mol}$
~ To dobiš z $M = 17\,\mathrm{g/mol}$, ko pozabiš indeks pri vodiku.
> $n = \dfrac{500\,\mathrm{g}}{18\,\mathrm{g/mol}} \approx 27{,}8\,\mathrm{mol}$.

:::simboli
n | množina snovi | n = \frac{m}{M} | mol
m | masa vzorca | m = n \cdot M | g
M | molska masa | M = \frac{m}{n} | g/mol | masa enega mola snovi
N | število delcev | N = n \cdot N_A | – | atomov, molekul ali formulskih enot
N_A | Avogadrova konstanta | | mol^{-1} | $N_A = 6{,}02 \cdot 10^{23}\,\mathrm{mol^{-1}}$
:::
