---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

*(višja raven) Matematično indukcijo matura preverja samo na višji ravni.*

V 16. stoletju je sicilijanski matematik Francesco Maurolico dokazoval lastnosti naravnih števil, med njimi to, da je vsota prvih lihih števil vedno popoln kvadrat. Ni se zadovoljil s tem, da je pravilo preveril za nekaj primerov. Pokazal je, da iz veljavnosti za eno število sledi veljavnost za naslednje. Stoletje kasneje je Blaise Pascal na enak način dokazoval lastnosti svojega trikotnika, ime **matematična indukcija** pa se je uveljavilo šele v 19. stoletju.

Isto vprašanje dobi trener, ki pred treningom postavlja stožce v kvadrat. En stožec, nato okoli njega še $3$, da nastane kvadrat $2 \times 2$, nato še $5$ za kvadrat $3 \times 3$. Ali to deluje za vsak kvadrat, tudi $100 \times 100$? Preverjanje stotih primerov ni dokaz za vsa naravna števila. Indukcija je orodje, s katerim z dvema korakoma pokrijemo neskončno mnogo primerov.

## Razlaga

**En primer do konca.** Trditev za vsa naravna števila $n$ zapišemo kot $P(n)$. Tu je

$$P(n):\quad 1 + 3 + 5 + \dots + (2n - 1) = n^2$$

Leva stran je vsota prvih $n$ lihih števil, $2n - 1$ je $n$-to liho število.

Za $n = 1$: leva stran je $1$, desna $1^2 = 1$. Za $n = 4$: $1 + 3 + 5 + 7 = 16 = 4^2$. Trditev velja za začetne primere.

Zdaj recimo, da za neko število $n$ trditev že velja, torej da je vsota prvih $n$ lihih števil $n^2$. Naslednje liho število je $2(n + 1) - 1 = 2n + 1$. Če ga prištejemo:

$$1 + 3 + \dots + (2n - 1) + (2n + 1) = n^2 + 2n + 1$$

Desna stran je $(n + 1)^2$. Torej trditev velja tudi za $n + 1$. S stožci: kvadrat $n \times n$ dopolniš s pasom $2n + 1$ stožcev (vrstica in stolpec po $n$ ter vogal) in dobiš kvadrat $(n + 1) \times (n + 1)$.

**Zakaj to zadošča.** Velja za $1$. Ker velja za $1$, velja za $2$. Ker velja za $2$, velja za $3$. In tako naprej brez konca: vsako naravno število dosežemo v končno mnogo korakih.

**Splošni postopek.** Dokaz z **matematično indukcijo** (rečemo ji tudi **popolna indukcija**) ima dva dela:

1. **Baza indukcije:** preverimo, da $P(1)$ drži.
2. **Indukcijski korak:** predpostavimo, da $P(n)$ drži za neko naravno število $n$ (to je **indukcijska predpostavka**), in iz tega izpeljemo $P(n + 1)$.

Če sta oba dela dokazana, $P(n)$ velja za vsa naravna števila. Simulacija spodaj »Domine: baza in indukcijski korak« to pokaže z vrsto domin: baza je udarec prve domine, korak pa pove, da vsaka padajoča domina podre naslednjo. Izberi lažno formulo, preveri korak in bazo ter opazuj, katere domine padejo.

:::premisli
Kaj se zgodi, če dokažemo le indukcijski korak, baze pa ne preverimo? Napovej na dominah.
---
Ne vemo, ali katera domina sploh pade. Korak pove le, da padec ene povzroči padec naslednje. Trditev »$2n + 1$ je deljivo z $2$« ima pravilen korak ($2(n + 1) + 1$ je za $2$ večje od $2n + 1$), baza pa ne drži: $3$ ni sodo. Trditev ne velja za noben $n$.
:::

**Ko trditev velja šele pozneje.** Nekatere trditve veljajo šele od nekega $n_0$ naprej. Takrat baza preveri $P(n_0)$, korak pa dokažemo za vse $n \ge n_0$.

**Kakšen je korak v praksi.** Napišemo, kaj predpostavimo ($P(n)$), in kaj želimo dobiti ($P(n + 1)$). Nato izraz za $n + 1$ preoblikujemo tako, da se v njem pojavi izraz iz predpostavke, in ga zamenjamo. To je edino mesto, kjer predpostavko uporabimo.

:::premisli
Zakaj v koraku ne smemo začeti z zapisom $P(n + 1)$ in ga preoblikovati, dokler ne dobimo nečesa resničnega, na primer $0 = 0$?
---
Ker bi tako dokazali, da iz $P(n + 1)$ sledi nekaj resničnega, ne pa, da $P(n + 1)$ drži. Iz napačne trditve lahko izpeljemo tudi resnično: iz $1 = -1$ s kvadriranjem dobimo $1 = 1$. Pot mora iti od predpostavke $P(n)$ do $P(n + 1)$.
:::

## Rešeni primeri

### Primer 1: tekme na turnirju

Na turnirju v odbojki igra vsaka ekipa z vsako natanko enkrat. Ko se prijavi nova ekipa, odigra tekmo z vsako prej prijavljeno: druga ekipa prinese $1$ tekmo, tretja $2$, $(n + 1)$-ta pa $n$ tekem. Pri $n + 1$ ekipah je zato tekem $1 + 2 + \dots + n$. Dokaži, da je ta vsota enaka $\frac{n(n + 1)}{2}$, in izračunaj število tekem pri $11$ ekipah.

**Podatki:** vsaka ekipa igra z vsako enkrat; število ekip $n + 1 = 11$, torej $n = 10$
**Iščemo:** dokaz trditve $P(n)$ za vse $n \in \mathbb{N}$ in število tekem pri $n = 10$

:::formula
$P(n)$: $1 + 2 + \dots + n = \dfrac{n(n + 1)}{2}$
:::

**Rešitev:**

1. Baza, $n = 1$: leva stran je $1$, desna $\frac{1 \cdot 2}{2} = 1$. Drži.
2. Predpostavka: za neki $n$ velja $1 + 2 + \dots + n = \frac{n(n + 1)}{2}$.
3. Cilj: $1 + 2 + \dots + n + (n + 1) = \frac{(n + 1)(n + 2)}{2}$.
4. Prvih $n$ členov zamenjamo po predpostavki: vsota je $\frac{n(n + 1)}{2} + (n + 1)$.
5. Izpostavimo $n + 1$: $\frac{n(n + 1)}{2} + (n + 1) = (n + 1)\left(\frac{n}{2} + 1\right) = \frac{(n + 1)(n + 2)}{2}$, kar je cilj.
6. Po indukciji trditev velja za vsa naravna števila.
7. Za $11$ ekip: $\frac{10 \cdot 11}{2} = 55$.
8. Odgovor: vsota je vedno $\frac{n(n + 1)}{2}$; turnir z $11$ ekipami ima $55$ tekem.

### Primer 2: deljivost

Dokaži, da je $n^3 + 2n$ deljivo s $3$ za vsako naravno število $n$.

**Podatki:** izraz $n^3 + 2n$, $n \in \mathbb{N}$, delitelj $3$
**Iščemo:** dokaz, da $3 \mid n^3 + 2n$ za vse $n$

:::formula
$(n + 1)^3 = n^3 + 3n^2 + 3n + 1$; vsota večkratnikov $3$ je večkratnik $3$.
:::

**Rešitev:**

1. Baza, $n = 1$: $1^3 + 2 \cdot 1 = 3$, deljivo s $3$.
2. Predpostavka: $n^3 + 2n = 3k$ za neko celo število $k$.
3. Izraz za $n + 1$ razvijemo: $(n + 1)^3 + 2(n + 1) = n^3 + 3n^2 + 5n + 3$.
4. Preuredimo, da se pojavi izraz iz predpostavke: $n^3 + 3n^2 + 5n + 3 = (n^3 + 2n) + 3(n^2 + n + 1)$.
5. Prvi oklepaj je po predpostavki $3k$, drugi člen je očitno večkratnik $3$: skupaj $3(k + n^2 + n + 1)$.
6. Odgovor: $n^3 + 2n$ je deljivo s $3$ za vsako naravno število (preizkus: $n = 4$ da $72 = 3 \cdot 24$).

### Primer 3: dva točkovna sistema

V računalniški igri lahko izbereš točkovanje »podvajanje«, ki ti v $n$-tem krogu prinese $2^n$ točk, ali »kvadrat«, ki prinese $n^2$ točk. Od katerega kroga naprej je podvajanje vedno boljše?

**Podatki:** točke v krogu $n$: $2^n$ ali $n^2$, $n \in \mathbb{N}$
**Iščemo:** najmanjši $n_0$, da velja $2^n > n^2$ za vse $n \ge n_0$, in dokaz

:::formula
Indukcija z bazo pri $n_0$: preveri $P(n_0)$, nato korak $P(n) \Rightarrow P(n + 1)$ za $n \ge n_0$.
:::

**Rešitev:**

1. Tabela: $n = 1, 2, 3, 4, 5$ da $2^n = 2, 4, 8, 16, 32$ in $n^2 = 1, 4, 9, 16, 25$. Pri $n = 3$ je kvadrat večji, pri $2$ in $4$ sta enaka, od $5$ naprej vodi podvajanje. Domneva: $n_0 = 5$.
2. Baza, $n = 5$: $32 > 25$. Drži.
3. Predpostavka: $2^n > n^2$ za neki $n \ge 5$.
4. Korak: $2^{n + 1} = 2 \cdot 2^n > 2n^2$ po predpostavki.
5. Pokazati moramo še $2n^2 \ge (n + 1)^2$. Razlika je $2n^2 - (n + 1)^2 = (n - 1)^2 - 2$.
6. Za $n \ge 5$ je $(n - 1)^2 \ge 16$, zato je razlika pozitivna in $2^{n + 1} > (n + 1)^2$. (Razlika je pozitivna že od $n = 3$ naprej, saj je $2^2 - 2 > 0$; korak torej velja za $n \ge 3$.)
7. Odgovor: od $5.$ kroga naprej podvajanje vedno prinese več točk. Pri $n = 3$ trditev ne drži, zato baze ne smemo postaviti v $n = 1$.

### Primer 4: zdaj ti

Pri Hanojskih stolpih prestaviš stolp iz $n$ ploščic na drug kol; večja ploščica nikoli ne sme ležati na manjši. Najmanjše število potez $H_n$ zadošča zvezi $H_1 = 1$ in $H_{n + 1} = 2H_n + 1$: prestaviš zgornjih $n$ ploščic, nato največjo, nato spet $n$ ploščic. Dokaži, da je $H_n = 2^n - 1$, in izračunaj $H_6$.

**Podatki:** $H_1 = 1$, $H_{n + 1} = 2H_n + 1$, $n = 6$
**Iščemo:** dokaz $H_n = 2^n - 1$ in število potez $H_6$

:::formula
$P(n)$: $H_n = 2^n - 1$
:::

**Rešitev:**

1. Baza: $H_1 = 1$ in $2^1 - 1 = 1$. Drži.
2. Predpostavka: $H_n = 2^n - 1$ za neki $n$.
3. V zvezo vstavi predpostavko in poenostavi $2(2^n - 1) + 1$. Izračunaj še $H_6$, nato preveri. V simulaciji spodaj »Hanojski stolpi: 2ⁿ − 1 potez« lahko število potez za majhne $n$ preštej sam.

:::premisli
Kaj dobiš v koraku in koliko je $H_6$?
---
$H_{n + 1} = 2(2^n - 1) + 1 = 2^{n + 1} - 2 + 1 = 2^{n + 1} - 1$, kar je $P(n + 1)$. Za šest ploščic potrebuješ $H_6 = 2^6 - 1 = 63$ potez.
:::

## Pogoste napake

- **»Preveril sem dovolj primerov.«** Izraz $n^2 + n + 41$ da praštevilo za vse $n$ od $1$ do $39$, pri $n = 40$ pa $1681 = 41^2$. Primeri lahko vodijo do domneve, dokaz pa da šele indukcija.
- **Brez baze.** Korak za trditev »$2n + 1$ je sodo« je pravilen, a baza ne drži in trditev je napačna za vse $n$. Vedno preveri bazo, tudi če se zdi očitna.
- **Baza na napačnem mestu.** Pri $2^n > n^2$ je baza $n = 1$ resnična ($2 > 1$), vendar korak iz $1$ v $2$ odpove ($4 > 4$ ne drži), dokazali pa smo ga le za $n \ge 3$. Tudi $n = 3$ ni baza, ker je $8 < 9$. Baza mora biti tam, od koder korak deluje brez prekinitve.
- **»Predpostavimo, kar dokazujemo.«** Indukcijska predpostavka ni trditev za vse $n$, ampak le za eno, poljubno izbrano število. Krožen je dokaz, ki začne s $P(n + 1)$ in pride do $0 = 0$. Korak mora iti od $P(n)$ k $P(n + 1)$.
- **Predpostavka ni uporabljena.** Kdor v koraku le razvije izraz za $n + 1$ in ne vstavi $P(n)$, ničesar ne dokaže. Poišči v izrazu za $n + 1$ del, ki je enak izrazu iz predpostavke.

## Povzetek

- Matematična indukcija dokaže trditev $P(n)$ za vsa naravna števila $n \ge n_0$.
- Baza: preverimo $P(n_0)$, običajno $n_0 = 1$.
- Korak: iz predpostavke $P(n)$ izpeljemo $P(n + 1)$; predpostavko res uporabimo.
- Vsote: prvih $n$ členov zamenjamo po predpostavki, prištejemo $(n + 1)$-ti člen.
- Deljivost: izraz za $n + 1$ zapišemo kot izraz za $n$ plus očiten večkratnik delitelja.
- Neenakosti: uporabimo predpostavko, nato pokažemo še pomožno neenakost; baza je tam, kjer korak začne veljati.
- Nekaj preverjenih primerov ni dokaz.

## Za maturo

### Naloga 1 (višja raven): krajša strukturirana naloga, 7 točk, pola 1 (brez računala)

Zaporedje je podano rekurzivno: $a_1 = 2$ in $a_{n+1} = 3a_n - 2$ za vsako naravno število $n$.

a) Izračunaj člene $a_2$, $a_3$, $a_4$ in $a_5$ ter postavi domnevo o splošnem členu $a_n$. (2 točki)
b) Domnevo dokaži z matematično indukcijo. (3 točke)
c) Kateri člen zaporedja je enak $730$? (2 točki)

**Rešitev:**

1. a) $a_2 = 3 \cdot 2 - 2 = 4$, $a_3 = 3 \cdot 4 - 2 = 10$, $a_4 = 3 \cdot 10 - 2 = 28$, $a_5 = 3 \cdot 28 - 2 = 82$.
2. a) Če od členov odštejemo $1$, dobimo $1, 3, 9, 27, 81$, to so potence števila $3$. Domneva: $a_n = 3^{n-1} + 1$.
3. b) Baza, $n = 1$: $3^0 + 1 = 2 = a_1$. Drži.
4. b) Predpostavka: za neko naravno število $n$ velja $a_n = 3^{n-1} + 1$. Cilj: $a_{n+1} = 3^n + 1$.
5. b) Po rekurzivnem pravilu in predpostavki je $a_{n+1} = 3a_n - 2 = 3\left(3^{n-1} + 1\right) - 2 = 3^n + 1$, kar je cilj. Po načelu matematične indukcije domneva velja za vsa naravna števila.
6. c) Rešimo enačbo $3^{n-1} + 1 = 730$: $3^{n-1} = 729 = 3^6$, torej $n - 1 = 6$ in $n = 7$.
7. Odgovor: a) $a_2 = 4$, $a_3 = 10$, $a_4 = 28$, $a_5 = 82$, domneva $a_n = 3^{n-1} + 1$; b) domneva je dokazana; c) $730$ je sedmi člen.

**Točkovanje:** a) 1 točka za člene $4, 10, 28, 82$, 1 točka za domnevo $a_n = 3^{n-1} + 1$; b) 1 točka za bazo, 1 točka za zapis predpostavke in cilja, 1 točka za korak z uporabo predpostavke in sklep; c) 1 točka za enačbo $3^{n-1} = 729$, 1 točka za odgovor $n = 7$.

### Naloga 2 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Za vsako naravno število $n$ je $S_n = \dfrac{1}{1 \cdot 2} + \dfrac{1}{2 \cdot 3} + \ldots + \dfrac{1}{n(n + 1)}$.

a) Izračunaj $S_1$, $S_2$ in $S_3$ ter postavi domnevo o vrednosti $S_n$. (2 točki)
b) Domnevo iz a) dokaži z matematično indukcijo. (3 točke)
c) Izračunaj vsoto vrste $\dfrac{1}{1 \cdot 2} + \dfrac{1}{2 \cdot 3} + \dfrac{1}{3 \cdot 4} + \ldots$ in določi najmanjši $n$, pri katerem se $S_n$ od vsote vrste razlikuje za manj kot $0{,}01$. (3 točke)
d) Za vsoto $T_n = \dfrac{1}{1 \cdot 3} + \dfrac{1}{2 \cdot 4} + \ldots + \dfrac{1}{n(n + 2)}$ velja $T_1 = \dfrac{1}{3} = \dfrac{1}{1 + 2}$. Dijak zato po zgledu domneve iz a) sklepa, da je $T_n = \dfrac{n}{n + 2}$ za vsak $n$. Ovrzi to domnevo. (2 točki)

**Rešitev:**

1. a) $S_1 = \dfrac{1}{2}$, $S_2 = \dfrac{1}{2} + \dfrac{1}{6} = \dfrac{2}{3}$, $S_3 = \dfrac{2}{3} + \dfrac{1}{12} = \dfrac{3}{4}$. Domneva: $S_n = \dfrac{n}{n + 1}$.
2. b) Baza, $n = 1$: $S_1 = \dfrac{1}{2} = \dfrac{1}{1 + 1}$. Drži.
3. b) Predpostavka: za neki $n$ velja $S_n = \dfrac{n}{n + 1}$. Cilj: $S_{n+1} = \dfrac{n + 1}{n + 2}$.
4. b) Vsoti prištejemo naslednji člen in uporabimo predpostavko: $S_{n+1} = S_n + \dfrac{1}{(n + 1)(n + 2)} = \dfrac{n}{n + 1} + \dfrac{1}{(n + 1)(n + 2)} = \dfrac{n^2 + 2n + 1}{(n + 1)(n + 2)} = \dfrac{(n + 1)^2}{(n + 1)(n + 2)} = \dfrac{n + 1}{n + 2}$. To je cilj, zato domneva po indukciji velja za vsak $n$.
5. c) Vsota vrste je limita zaporedja delnih vsot: $S = \lim\limits_{n \to \infty} \dfrac{n}{n + 1} = \lim\limits_{n \to \infty} \dfrac{1}{1 + \frac{1}{n}} = 1$.
6. c) Razlika do vsote je $1 - S_n = 1 - \dfrac{n}{n + 1} = \dfrac{1}{n + 1}$. Pogoj $\dfrac{1}{n + 1} < 0{,}01$ da $n + 1 > 100$, torej $n > 99$.
7. c) Najmanjši tak $n$ je $100$. Pri $n = 99$ je razlika natanko $0{,}01$, kar ni manj kot $0{,}01$.
8. d) $T_2 = \dfrac{1}{3} + \dfrac{1}{8} = \dfrac{11}{24}$, domneva pa napove $T_2 = \dfrac{2}{2 + 2} = \dfrac{1}{2} = \dfrac{12}{24}$.
9. d) Ker je $\dfrac{11}{24} \ne \dfrac{1}{2}$, je $n = 2$ protiprimer in domneva ne drži. Veljavnost pri $n = 1$ je le baza, brez koraka pa ni dokaza.
10. Odgovor: a) $S_n = \dfrac{n}{n + 1}$; b) domneva je dokazana; c) vsota vrste je $1$, najmanjši $n$ je $100$; d) domneva ne drži, protiprimer je $n = 2$.

**Točkovanje:** a) 1 točka za vsote $\dfrac{1}{2}$, $\dfrac{2}{3}$ in $\dfrac{3}{4}$, 1 točka za domnevo $S_n = \dfrac{n}{n + 1}$; b) 1 točka za bazo, 1 točka za prištevanje člena $\dfrac{1}{(n + 1)(n + 2)}$ z uporabo predpostavke, 1 točka za preoblikovanje do $\dfrac{n + 1}{n + 2}$ in sklep; c) 1 točka za vsoto vrste $1$ kot limito delnih vsot, 1 točka za neenačbo $\dfrac{1}{n + 1} < \dfrac{1}{100}$, 1 točka za odgovor $n = 100$; d) 1 točka za $T_2 = \dfrac{11}{24}$, 1 točka za primerjavo z $\dfrac{1}{2}$ in sklep, da domneva ne drži.

### Ustno vprašanje 1

:::premisli
(višja raven) Opiši načelo matematične indukcije in pojasni, zakaj potrebujemo bazo in indukcijski korak.
---
Z matematično indukcijo dokazujemo trditve $P(n)$, ki naj veljajo za vsa naravna števila $n \ge n_0$. V bazi preverimo, da drži $P(n_0)$, običajno $P(1)$. V indukcijskem koraku predpostavimo, da $P(n)$ drži za neko naravno število $n$, in iz tega izpeljemo $P(n + 1)$. Baza zagotovi začetek, korak pa prenos na naslednje število, zato trditev velja za $n_0$, $n_0 + 1$, $n_0 + 2$ in tako naprej. Brez baze korak ne dokaže ničesar, brez koraka pa trditev velja le za preverjene primere.
:::

### Ustno vprašanje 2

:::premisli
(višja raven) Z matematično indukcijo dokaži, da za vsako naravno število $n$ velja $1 + 2 + 2^2 + \ldots + 2^{n-1} = 2^n - 1$.
---
Baza: za $n = 1$ je leva stran $1$ in desna $2^1 - 1 = 1$, zato trditev drži. Predpostavimo, da za neko naravno število $n$ velja $1 + 2 + \ldots + 2^{n-1} = 2^n - 1$. Vsoti za $n + 1$ prištejemo naslednji člen $2^n$ in po predpostavki dobimo $2^n - 1 + 2^n = 2 \cdot 2^n - 1 = 2^{n+1} - 1$. To je trditev za $n + 1$, zato po načelu matematične indukcije velja za vsa naravna števila.
:::

### Ustno vprašanje 3

:::premisli
(višja raven) Navedi primer trditve, ki velja šele od nekega naravnega števila naprej, in pojasni, kako jo dokažemo z indukcijo.
---
Primer je neenakost $n! > 2^n$, ki velja za vse $n \ge 4$, za $n = 3$ pa ne, saj je $3! = 6 < 8$. Bazo preverimo pri $n = 4$, kjer je $4! = 24 > 16 = 2^4$. V koraku predpostavimo $n! > 2^n$ za neki $n \ge 4$ in dobimo $(n + 1)! = (n + 1) \cdot n! > (n + 1) \cdot 2^n > 2 \cdot 2^n = 2^{n+1}$. Pri tem smo uporabili $n + 1 > 2$, kar za $n \ge 4$ drži, zato iz baze in koraka sledi, da neenakost velja za vse $n \ge 4$.
:::

## Drugače: Z analogijo

Predstavljaj si plezalno steno z oprimki v enakih razmikih. Plezalec doseže vsak oprimek, če veljata dve stvari: doseže prvega s tal in iz vsakega lahko doseže naslednjega. Prvo je baza, drugo indukcijski korak.

Če manjka prvo (prvi oprimek je previsoko), plezalec ne začne, čeprav bi nadaljevanje bilo lahko. Če med oprimkoma $7$ in $8$ manjka eden, pride le do sedmega. Plezalec ni nikoli preizkusil celotne stene; dovolj je vedeti, da je vsak prehod izvedljiv.

## Drugače: Bolj natančno

**Načelo matematične indukcije.** Naj bo $P(n)$ izjava za vsako naravno število $n$. Če je $P(1)$ resnična in za vsak $n \in \mathbb{N}$ velja $P(n) \Rightarrow P(n + 1)$, je $P(n)$ resnična za vsa $n \in \mathbb{N}$.

**Zakaj načelo drži.** Predpostavimo, da bi bila množica števil, za katera $P(n)$ ne velja, neprazna. Vsaka neprazna množica naravnih števil ima najmanjši element; označimo ga z $m$. Ker $P(1)$ velja, je $m > 1$, zato je $m - 1$ naravno število in $P(m - 1)$ velja, ker je $m$ najmanjši protiprimer. Po koraku potem velja tudi $P(m)$, kar je protislovje.

**Različice.** Baza je lahko pri $n_0$ namesto pri $1$; dokaz velja za $n \ge n_0$. Pri **krepki indukciji** v koraku predpostavimo, da $P(k)$ velja za vse $k$ od $n_0$ do $n$, ne le za $n$; to je priročno, ko je izraz za $n + 1$ odvisen od več prejšnjih.

## Preveri se

? Kateri del NE spada v dokaz z matematično indukcijo?
- Preverjanje trditve za najmanjše število $n_0$.
~ To je baza indukcije, brez nje dokaz ne velja.
- Predpostavka, da trditev velja za neki $n$.
~ To je indukcijska predpostavka, iz katere izpeljemo korak.
+ Preverjanje trditve za sto naključno izbranih števil.
- Izpeljava trditve za $n + 1$ iz trditve za $n$.
~ To je indukcijski korak, osrednji del dokaza.
> Preverjanje primerov je koristno za domnevo, ni pa del dokaza: tudi sto pravilnih primerov ne zagotovi sto prvega.

? Koliko potez najmanj potrebuješ za Hanojski stolp s $7$ ploščicami?
- $128$
~ To je $2^7$; pozabil si odšteti $1$. Za eno ploščico je $2^1 = 2$, potrebuješ pa le $1$ potezo.
+ $127$
- $49$
~ To je $7^2$. Število potez se z vsako ploščico približno podvoji, ne raste kot kvadrat.
- $14$
~ To je $2 \cdot 7$. Velja $H_{n + 1} = 2H_n + 1$, zato se število potez podvaja, ne prišteva.
> $H_7 = 2^7 - 1 = 127$.

? Za trditev $2^n > n^2$ velja baza pri $n = 5$, korak pa je dokazan za vse $n \ge 3$. Kaj sledi?
- Trditev velja za vse $n \ge 3$.
~ Korak brez baze pri $3$ ne pove ničesar: za $n = 3$ je $8 < 9$. Veriga začne pri bazi.
- Trditev velja za vsa naravna števila.
~ Baza je šele pri $5$; za $n = 3$ trditev očitno ne drži.
+ Trditev velja za vse $n \ge 5$.
> Domine padajo od prve, ki jo podremo: baza pri $5$ in korak za $n \ge 3$ (torej tudi za $n \ge 5$) dasta veljavnost za vse $n \ge 5$.

? »Dokaz« trditve $1 + 2 + \dots + n = \frac{n^2 + n + 2}{2}$ (napačna trditev): korak $\frac{n^2 + n + 2}{2} + (n + 1) = \frac{(n + 1)^2 + (n + 1) + 2}{2}$ je račun brez napake. Kje je napaka?
+ V bazi: za $n = 1$ je leva stran $1$, desna pa $2$.
- V koraku, ker računa ni mogoče preveriti.
~ Korak je pravilen: obe strani sta $\frac{n^2 + 3n + 4}{2}$. Težava je drugje.
- Nikjer, ker korak drži, je trditev dokazana.
~ Korak sam pove le, da bi padec ene domine podrl naslednjo; prva ne pade.
- V predpostavki, ker ne smemo predpostaviti, da trditev velja.
~ Predpostavka za en $n$ je del vsake indukcije; napačna je šele, če z njo začnemo pri $n + 1$.
> Brez baze korak ne dokaže ničesar. Pravilna formula je $\frac{n(n + 1)}{2}$.

? Na tekmovanju v podiranju domin postavijo $500$ domin. Vsaka padajoča podre naslednjo, le med $120.$ in $121.$ je razmik prevelik. Podrejo prvo. Katere padejo?
- Vse, ker padec vsake podre naslednjo.
~ Korak ne velja pri $120 \to 121$, zato se veriga tam pretrga.
+ Domine od $1.$ do $120.$
- Nobena, ker korak ne velja povsod.
~ Prva pade, korak pa velja pri vseh prehodih do $120.$ domine, zato padejo vse do te vrzeli.
> Indukcija potrebuje korak za vsak $n$; kjer manjka, se veriga ustavi.

<<RACUN
vrednost: 3*2-2 | 4
vrednost: 3*4-2 | 10
vrednost: 3*10-2 | 28
vrednost: 3*28-2 | 82
enako: 3*(3^(n-1)+1)-2 | 3^n+1
resi: 3^(n-1)+1=730 | n | 7
vrednost: 1/2+1/6 | 2/3
vrednost: 1/2+1/6+1/12 | 3/4
enako: n/(n+1)+1/((n+1)*(n+2)) | (n+1)/(n+2)
limita: n/(n+1) | n | oo | 1
enako: 1-n/(n+1) | 1/(n+1)
resi: 1/(n+1)=1/100 | n | 99
vrednost: 1/3+1/8 | 11/24
vrednost: 2/(2+2) | 1/2
enako: 2^n-1+2^n | 2^(n+1)-1
vrednost: factorial(4) | 24
>>

:::simboli
n | naravno število | | | $n \in \mathbb{N}$
n_0 | začetno število (baza) | | | število, od katerega naprej trditev dokazujemo
P | trditev $P(n)$ za število $n$ | | | izjava, ki je resnična ali neresnična
H_n | najmanjše število potez za $n$ ploščic | H_n = 2^n - 1 | – | Hanojski stolpi
H_1 | število potez za eno ploščico | H_1 = 1 | –
H_{n + 1} | število potez za $n + 1$ ploščic | H_{n + 1} = 2H_n + 1 | –
k | celo število (količnik) | n^3 + 2n = 3k |
:::
