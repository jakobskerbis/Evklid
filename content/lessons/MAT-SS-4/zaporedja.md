---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Prva zgodba: na pohodu si zjutraj $8\,\text{km}$ od koče. Vsako uro prehodiš le polovico poti, ki ti je še ostala. Oddaljenosti od koče ob polnih urah so $8$, $4$, $2$, $1$, $0{,}5$ … kilometra.

Druga zgodba: z avtom greš na morje. Prve pol ure stojiš v koloni, nato ves čas voziš s hitrostjo $100\,\text{km/h}$. Navigacija po vsaki uri vožnje izpiše povprečno hitrost celotne poti: približno $67$, $80$, $86$, $89$ … $\text{km/h}$.

Na videz zgodbi nimata nič skupnega: prva števila padajo, druga rastejo. Obe pa sta seznama števil, urejenih po vrsti (prvo, drugo, tretje …), in oba se ustalita. Oddaljenost se bliža $0$, povprečna hitrost pa $100\,\text{km/h}$, ki je nikoli ne preseže. Taki seznami so **zaporedja**.

Kaj natančno pomeni »ustali se« in kako to dokažemo z računom? Odgovor je **limita**. Pred njo spoznaš še **monotonost** (ali števila samo rastejo ali samo padajo) in **omejenost** (ali ostanejo v nekem pasu). Na limiti stojita tudi limita funkcije in odvod.

## Razlaga

**1. Kaj je zaporedje.** Oddaljenosti s pohoda nariši kot pike na številski premici: $8$, $4$, $2$, $1$, $0{,}5$ … Vsaka pika ima svojo zaporedno številko. Prav to je zaporedje: vsakemu naravnemu številu $n = 1, 2, 3, \ldots$ priredimo realno število $a_n$. Natančneje je **zaporedje** funkcija iz naravnih v realna števila. Številu $a_n$ rečemo **$n$-ti člen**, številu $n$ pa **indeks** (mesto člena). Zaporedje zapišemo kot $a_1, a_2, a_3, \ldots$ ali na kratko $(a_n)$.

**2. Kako podamo zaporedje.** Pri pohodu povemo prvi člen in pravilo, kako iz člena dobimo naslednjega: $a_1 = 8$ in $a_{n+1} = \dfrac{a_n}{2}$. Tak zapis je **rekurziven**. Pogosteje zaporedje podamo s **splošnim členom**, to je s formulo za $a_n$, na primer $a_n = 2 - \dfrac{1}{n}$. Člen izračunaš tako, da vstaviš indeks: $a_1 = 1$, $a_2 = 1{,}5$, $a_3 \approx 1{,}667$.

**3. Tabela in graf.** Zaporedje $a_n = 2 - \dfrac{1}{n}$ prikažemo s tabelo:

| $n$ | $a_n$ | razdalja do $2$ |
|---|---|---|
| 1 | $1$ | $1$ |
| 2 | $1{,}5$ | $0{,}5$ |
| 5 | $1{,}8$ | $0{,}2$ |
| 10 | $1{,}9$ | $0{,}1$ |
| 100 | $1{,}99$ | $0{,}01$ |

**Graf zaporedja** so posamezne točke $(n, a_n)$, ne neprekinjena črta, saj $n$ zavzame le naravne vrednosti. Pri našem zaporedju točke od leve proti desni rastejo in se stiskajo k vodoravni premici $y = 2$, ki je nikoli ne dosežejo.

**4. Monotonost.** Na grafu zaporedja $2 - \dfrac{1}{n}$ je vsaka pika višje od prejšnje, kot cesta, ki gre ves čas navkreber. Pike s pohoda se ves čas spuščajo. Zaporedje je **naraščajoče**, če nobena pika ni nižja od prejšnje: $a_{n+1} \ge a_n$ za vsak $n$. Če je vsaka pika strogo višja, $a_{n+1} > a_n$, je **strogo naraščajoče**. Podobno je **padajoče**, če je $a_{n+1} \le a_n$, in **strogo padajoče**, če je $a_{n+1} < a_n$. Zaporedje, ki je naraščajoče ali padajoče, je **monotono**.

Monotonost dokažemo z razliko zaporednih členov: če je pozitivna za vsak $n$, zaporedje strogo narašča. Za $a_n = 2 - \dfrac{1}{n}$:

$$a_{n+1} - a_n = \frac{1}{n} - \frac{1}{n+1} = \frac{1}{n(n+1)} > 0,$$

zato je zaporedje strogo naraščajoče. Pri zaporedju s samimi pozitivnimi členi lahko namesto razlike pogledamo količnik $\dfrac{a_{n+1}}{a_n}$ in ga primerjamo z $1$.

**5. Omejenost.** Vse pike zaporedja $2 - \dfrac{1}{n}$ ležijo v vodoravnem pasu: nobena ni pod premico $y = 1$ in nobena ne seže do premice $y = 2$. Ko tak pas obstaja, je zaporedje **omejeno**. Z znaki: zaporedje je **navzgor omejeno**, če obstaja število $M$, da je $a_n \le M$ za vsak $n$. Takemu $M$ rečemo **zgornja meja**. Zaporedje je **navzdol omejeno**, če obstaja **spodnja meja** $m$, da je $a_n \ge m$ za vsak $n$. Omejeno je, če je omejeno navzgor in navzdol. Pri našem zaporedju velja $1 \le a_n < 2$.

:::premisli
Na grafu se pike premici $y = 2$ tako približajo, da jih ne ločiš od nje. Ali je kak zelo oddaljen člen, recimo $a_{1000000}$, morda enak $2$? Odgovori z računom, ne z grafom.
---
Ne. Ulomek $\dfrac{1}{n}$ je vedno pozitiven, zato je $a_n < 2$. Število $2$ je zgornja meja, a ga noben člen ne doseže.
:::

**6. Okolica.** Okoli premice $y = L$ nariši ozek vodoraven pas, ki sega za $\varepsilon$ nad in pod njo. Na navpični osi pas zajame odprti interval $(L - \varepsilon, L + \varepsilon)$: vsa števila, ki so od $L$ oddaljena manj kot $\varepsilon$. Temu intervalu rečemo **okolica** števila $L$ s polmerom $\varepsilon > 0$. Grška črka $\varepsilon$ (epsilon) pomeni majhno pozitivno število.

**7. Limita.** Pri zaporedju $2 - \dfrac{1}{n}$ vzemi pas okoli $y = 2$ s polmerom $\varepsilon = 0{,}1$. Razdalja pike do $2$ je $\dfrac{1}{n}$, zato so pike $a_1$ do $a_{10}$ zunaj pasu ($a_{10} = 1{,}9$ leži ravno na robu), vse od $a_{11}$ naprej pa v njem. Pri ožjem pasu vstopijo kasneje, a vedno.

Prav to opisuje limita. Število $L$ je **limita** zaporedja $(a_n)$, če v *vsaki* okolici števila $L$ ležijo vsi členi od nekega indeksa naprej. Drugače povedano: zunaj poljubne okolice števila $L$ je le končno mnogo členov. Pišemo

$$\lim_{n \to \infty} a_n = L.$$

Zaporedje, ki ima limito, je **konvergentno**; zaporedje brez limite je **divergentno**. Zaporedje $a_n = (-1)^n$ skače med $-1$ in $1$, zato je divergentno: nobenega ozkega pasu ne moreš postaviti tako, da bi bile v njem vse pike od nekod naprej.

:::premisli
Koliko členov zaporedja $a_n = 2 - \dfrac{1}{n}$ leži zunaj okolice števila $2$ s polmerom $\varepsilon = 0{,}01$? Napovej, preden pogledaš.
---
Natanko $100$. Razdalja do $2$ je $\dfrac{1}{n}$, ta je manjša od $0{,}01$ šele pri $n > 100$. Členi $a_1, \ldots, a_{100}$ so zunaj okolice (člen $a_{100} = 1{,}99$ je ravno na robu, ki ne spada v odprti interval), vsi od $a_{101}$ naprej pa znotraj.
:::

V simulaciji spodaj (»Zaporedja: monotonost, omejenost, limita«) si oglej graf zaporedja, ki ima limito. Naloga: poišči indeks, od katerega naprej vse točke ostanejo v ozkem pasu okrog premice $y = L$, nato pas zoži. Opazi: indeks pride kasneje, a vedno obstaja.

**8. Dve pomembni zvezi.**

- Vsako konvergentno zaporedje je omejeno. Obratno ne velja: $(-1)^n$ je omejeno, pa ni konvergentno.
- Vsako **monotono in omejeno** zaporedje je konvergentno. Oddaljenosti s pohoda padajo in so navzdol omejene z $0$, zato imajo limito. Enako velja za naraščajoče povprečne hitrosti, omejene s $100$.

**9. Računanje limit.** Uporabljamo znane limite, na primer $\lim\limits_{n \to \infty} \dfrac{1}{n} = 0$ in $\lim\limits_{n \to \infty} c = c$ za konstanto $c$. Za konvergentni zaporedji velja: limita vsote je vsota limit, limita produkta je produkt limit, limita količnika je količnik limit (če limita imenovalca ni $0$).

Pri ulomku, v katerem števec in imenovalec rasteta čez vse meje, oba delimo z najvišjo potenco $n$ v imenovalcu. Tako nastanejo ulomki s konstanto v števcu in potenco $n$ v imenovalcu, ki gredo proti $0$.

## Rešeni primeri

### Primer 1 (lažji)

Dano je zaporedje s splošnim členom $a_n = \dfrac{n+2}{2n}$. Zapiši prve štiri člene in ugotovi, ali je zaporedje monotono.

**Podatki:** $a_n = \dfrac{n+2}{2n}$, zanimajo nas členi $a_1$ do $a_4$
**Iščemo:** $a_1, a_2, a_3, a_4$ in monotonost

:::formula
Zaporedje je strogo padajoče, če je $a_{n+1} - a_n < 0$ za vsak $n$.
:::

**Rešitev:**

1. Vstavimo indekse: $a_1 = \dfrac{3}{2}$, $a_2 = 1$, $a_3 = \dfrac{5}{6}$, $a_4 = \dfrac{3}{4}$. Členi se manjšajo, a štirje členi še niso dokaz.
2. Člen preoblikujemo: $a_n = \dfrac{n}{2n} + \dfrac{2}{2n} = \dfrac{1}{2} + \dfrac{1}{n}$.
3. Razlika zaporednih členov: $a_{n+1} - a_n = \dfrac{1}{n+1} - \dfrac{1}{n} = -\dfrac{1}{n(n+1)}$.
4. Imenovalec $n(n+1)$ je pozitiven, zato je razlika za vsak $n$ negativna.
5. Odgovor: prvi štirje členi so $\dfrac{3}{2}$, $1$, $\dfrac{5}{6}$ in $\dfrac{3}{4}$; zaporedje je strogo padajoče.

### Primer 2 (srednji)

Avto pol ure stoji v koloni, nato ves čas vozi s hitrostjo $100\,\text{km/h}$. Po $n$ urah vožnje je prevozil $100n$ kilometrov, od začetka poti pa je minilo $n + \frac{1}{2}$ ure, zato je povprečna hitrost $v_n = \dfrac{100n}{n + \frac{1}{2}} = \dfrac{200n}{2n+1}$ (v km/h). Izračunaj limito zaporedja $(v_n)$. Po koliko urah vožnje se povprečna hitrost od limite razlikuje za manj kot $1\,\text{km/h}$?

**Podatki:** postanek $0{,}5\,\text{h}$, hitrost vožnje $100\,\text{km/h}$, $v_n = \dfrac{200n}{2n+1}\,\text{km/h}$, $\varepsilon = 1\,\text{km/h}$
**Iščemo:** limito $L$ in najmanjši $n$, od katerega naprej je $|v_n - L| < \varepsilon$

:::formula
$\lim\limits_{n \to \infty} \dfrac{1}{n} = 0$; člen je v okolici, če je $|v_n - L| < \varepsilon$.
:::

**Rešitev:**

1. Števec in imenovalec delimo z $n$, ker je to najvišja potenca v imenovalcu: $v_n = \dfrac{200}{2 + \frac{1}{n}}$.
2. Ker gre $\dfrac{1}{n}$ proti $0$, je $L = \dfrac{200}{2 + 0} = 100$.
3. Razdalja do limite: $100 - v_n = \dfrac{100(2n+1) - 200n}{2n+1} = \dfrac{100}{2n+1}$. Ta je pozitivna, zato je povprečna hitrost vedno pod $100\,\text{km/h}$.
4. Pogoj $\dfrac{100}{2n+1} < 1$ pomeni $2n + 1 > 100$, torej $n > 49{,}5$. Imenovalec je pozitiven, zato smemo množiti brez obračanja neenačaja.
5. Preverimo mejo: $v_{49} = \dfrac{9800}{99} \approx 98{,}99$ je še zunaj (do $100$ manjka približno $1{,}01$), $v_{50} = \dfrac{10000}{101} \approx 99{,}01$ pa je že znotraj.
6. Odgovor: limita je $100\,\text{km/h}$; od $50$. ure vožnje naprej se povprečna hitrost od nje razlikuje za manj kot $1\,\text{km/h}$.

### Primer 3 (težji)

Bolnik vsak dan zjutraj vzame $100\,\text{mg}$ zdravila. Do naslednjega jutra telo izloči polovico zdravila, ki je v telesu. Naj bo $a_n$ količina zdravila v telesu takoj po $n$-tem odmerku. Pokaži, da se količina ustali, in izračunaj, pri kateri vrednosti.

**Podatki:** odmerek $100\,\text{mg}$ na dan, čez dan se izloči polovica, $a_1 = 100\,\text{mg}$
**Iščemo:** rekurzivno pravilo, monotonost, omejenost in limito $L$

:::formula
$a_{n+1} = \dfrac{a_n}{2} + 100$; monotono in omejeno zaporedje je konvergentno; za limito velja $L = \dfrac{L}{2} + 100$.
:::

**Rešitev:**

1. Pravilo: do jutra ostane $\dfrac{a_n}{2}$, nato bolnik doda $100\,\text{mg}$, zato $a_{n+1} = \dfrac{a_n}{2} + 100$.
2. Prvi členi: $100$, $150$, $175$, $187{,}5$, $193{,}75$ (v mg). Rastejo vedno počasneje.
3. Omejenost: če je $a_n < 200$, je $a_{n+1} < \dfrac{200}{2} + 100 = 200$. Ker je $a_1 = 100 < 200$, so po matematični indukciji vsi členi manjši od $200$.
4. Monotonost: $a_{n+1} - a_n = 100 - \dfrac{a_n}{2}$, kar je pozitivno, ker je $a_n < 200$. Zaporedje strogo narašča.
5. Zaporedje je naraščajoče in navzgor omejeno, zato je konvergentno. Ker gresta $a_n$ in $a_{n+1}$ proti isti limiti $L$, iz pravila dobimo $L = \dfrac{L}{2} + 100$.
6. Rešimo: $\dfrac{L}{2} = 100$, torej $L = 200$.
7. Odgovor: količina zdravila po odmerku narašča in se ustali pri $200\,\text{mg}$, ki jih nikoli ne preseže.

### Primer 4: zdaj ti

Izračunaj limito zaporedja $a_n = \dfrac{2n^2 - n}{n^2 + 3}$.

**Podatki:** $a_n = \dfrac{2n^2 - n}{n^2 + 3}$
**Iščemo:** $\lim\limits_{n \to \infty} a_n$

:::formula
Števec in imenovalec deli z najvišjo potenco $n$ v imenovalcu; $\lim\limits_{n \to \infty} \dfrac{1}{n} = 0$.
:::

**Rešitev:**

1. Najvišja potenca v imenovalcu je $n^2$, zato z njo delimo števec in imenovalec.
2. Dobimo $a_n = \dfrac{2 - \frac{1}{n}}{1 + \frac{3}{n^2}}$.
3. Zdaj izračunaj limito sam, nato preveri:

:::premisli
Proti čemu gredo $\dfrac{1}{n}$, $\dfrac{3}{n^2}$ in kolikšna je limita?
---
Oba ulomka gresta proti $0$, zato je $\lim\limits_{n \to \infty} a_n = \dfrac{2 - 0}{1 + 0} = 2$.
:::

## Pogoste napake

- **»Limita je število, ki se mu členi približujejo.«** Členi $\dfrac{1}{n}$ so z vsakim korakom bližje tudi številu $-1$, pa $-1$ ni limita. Členi morajo priti *poljubno blizu* in tam ostati: v vsaki okolici morajo biti vsi od nekega indeksa naprej.
- **»Zaporedje limite nikoli ne doseže« ali »limita mora biti člen«.** Obe trditvi sta napačni. Zaporedje $\dfrac{1}{n}$ ima limito $0$, ki ni noben člen; konstantno zaporedje $5, 5, 5, \ldots$ pa ima limito $5$, ki je vsak člen. Limita opisuje člene daleč v zaporedju, ne glede na to, ali je dosežena.
- **»Omejeno zaporedje ima limito.«** Zaporedje $(-1)^n$ je omejeno, a skače med $-1$ in $1$, zato limite nima. Obstoj limite zagotovita šele omejenost *in* monotonost skupaj.
- **Monotonost iz prvih nekaj členov.** Pri $a_n = (n-3)^2$ so prvi členi $4, 1, 0$, kar je videti padajoče, nato pa $1, 4, 9$ rastejo. Monotonost dokažeš z razliko $a_{n+1} - a_n$ za *vsak* $n$.
- **»Neskončno deljeno z neskončno je $1$.«** Pri $\dfrac{2n+1}{n+3}$ rasteta števec in imenovalec, a limita je $2$, ne $1$. Najprej deli z najvišjo potenco $n$ v imenovalcu.

## Povzetek

- Zaporedje priredi vsakemu naravnemu $n$ člen $a_n$; podamo ga s splošnim členom ali rekurzivno.
- Strogo naraščajoče: $a_{n+1} > a_n$; strogo padajoče: $a_{n+1} < a_n$ za vsak $n$. Preverimo z razliko $a_{n+1} - a_n$.
- Omejeno: obstajata $m$ in $M$, da je $m \le a_n \le M$ za vsak $n$.
- $\lim\limits_{n \to \infty} a_n = L$: v vsaki okolici $(L - \varepsilon, L + \varepsilon)$ so vsi členi od nekega indeksa naprej.
- Konvergentno zaporedje je omejeno; monotono in omejeno zaporedje je konvergentno.
- $\lim\limits_{n \to \infty} \dfrac{1}{n} = 0$; pri ulomkih deli z najvišjo potenco $n$ v imenovalcu.

## Drugače: Z analogijo

Graf zaporedja si predstavljaj kot cesto, ob kateri stojijo oštevilčeni kilometrski kamni $1, 2, 3, \ldots$; ob $n$-tem kamnu je cesta na višini $a_n$. **Naraščajoče** zaporedje je cesta, ki gre samo navkreber ali po ravnem. **Omejeno** je cesta med dvema ograjama: vijuga lahko, čez ograjo ne more.

Limito si predstavljaj kot igro s strogim sodnikom.

1. Sodnik izbere toleranco $\varepsilon$, na primer »največ $0{,}1$ od $L$«. Na grafu je to vodoraven pas okoli premice $y = L$.
2. Ti pokažeš kamen $n_0$, za katerim je *vsa* cesta v tem pasu.
3. Sodnik sme pas zožiti, kolikor hoče. Če ti vsakič uspe najti nov kamen, je $L$ limita. Če obstaja pas, pri katerem ti ne uspe, $L$ ni limita.

Pri $\dfrac{1}{n}$ in $L = 0$ vedno zmagaš: za $\varepsilon = 0{,}1$ pokažeš $n_0 = 10$, za $\varepsilon = 0{,}001$ pa $n_0 = 1000$. Pri $(-1)^n$ izgubiš že pri $\varepsilon = \dfrac{1}{2}$, ne glede na to, kateri $L$ izbereš: višini $-1$ in $1$ sta $2$ narazen, pas pa je širok le $1$.

## Drugače: Iz vsakdanjega življenja

Predstavljaj si, da s kalkulatorjem iščeš $\sqrt{2}$ po korakih: $1{,}4$, nato $1{,}41$, $1{,}414$, $1{,}4142$ … To je zaporedje približkov. Je naraščajoče, saj vsakič dodaš števko. Je navzgor omejeno, saj noben približek ne preseže $1{,}5$. Zato ima limito, in ta limita je natanko $\sqrt{2}$, ki ga z nobenim končnim decimalnim zapisom ne zapišeš.

## Drugače: Bolj natančno

Definicija limite s simboli: $\lim\limits_{n \to \infty} a_n = L$ natanko tedaj, ko za vsak $\varepsilon > 0$ obstaja tak $n_0 \in \mathbb{N}$, da za vse $n > n_0$ velja $|a_n - L| < \varepsilon$. Indeks $n_0$ je odvisen od $\varepsilon$: ožja okolica običajno zahteva večji $n_0$.

Limita je ena sama: če bi imelo zaporedje limiti $L_1 \ne L_2$, bi izbrali $\varepsilon$ manjši od polovice njune razdalje. Okolici se ne bi prekrivali, členi od nekod naprej pa bi morali biti v obeh hkrati, kar ni mogoče.

## Preveri se

? Na potovanju vsak večer zapišeš, koliko kilometrov si oddaljen od doma. Zaporedje teh oddaljenosti je navzgor omejeno s $50$. Kaj to pomeni?
- Vsaj en večer si bil od doma oddaljen natanko $50\,\text{km}$.
~ Zgornje meje ni treba doseči; nobena oddaljenost le ni večja od nje.
+ Noben večer nisi bil od doma oddaljen več kot $50\,\text{km}$.
- Oddaljenost se iz večera v večer povečuje in se bliža $50\,\text{km}$.
~ To opisuje naraščanje in limito. Omejeno zaporedje lahko tudi skače gor in dol.
> Navzgor omejeno s $50$ pomeni $a_n \le 50$ za vsak $n$: vsi členi hkrati so pod mejo ali na njej.

? Zaporedje $a_n = \dfrac{1}{n}$ ima limito $0$. Kaj se zgodi z limito, če prvih $1000$ členov zamenjamo s številom $7$, ostale pa pustimo?
- Limita postane $7$, ker se zaporedje zdaj začne s samimi sedmicami.
~ Limito določajo členi daleč v zaporedju. Zunaj okolice sme biti končno mnogo členov.
- Limite ni več, ker zaporedje ni več monotono.
~ Monotonost ni pogoj za limito. Od $a_{1001}$ naprej so členi enaki kot prej in se bližajo $0$.
+ Limita ostane $0$.
> Spremenili smo le končno mnogo členov. V vsaki okolici števila $0$ so še vedno vsi členi od nekega indeksa naprej (zdaj vsaj od $1001$).

? Razvrsti zaporedja po limiti od najmanjše do največje: $a_n = \dfrac{3n - 1}{n + 4}$, $b_n = \dfrac{n + 1}{2n}$, $c_n = \dfrac{2n^2 + 6}{n^2 + 1}$.
- $a$, $b$, $c$
~ Tak vrstni red imajo prvi členi ($a_1 = 0{,}4$, $b_1 = 1$, $c_1 = 4$). Limita pa opisuje zelo velike $n$.
- Vse tri imajo isto limito $1$.
~ »Neskončno deljeno z neskončno« ni $1$. Deli z najvišjo potenco $n$ v imenovalcu.
+ $b$, $c$, $a$
> Po deljenju z najvišjo potenco dobiš $\lim b_n = \dfrac{1}{2}$, $\lim c_n = 2$ in $\lim a_n = 3$.

? Kolikšna je $\lim\limits_{n \to \infty} \dfrac{5n^2 - 2}{2n^2 + n}$?
- $1$
~ Toliko je člen $a_1$, »neskončno deljeno z neskončno« pa ni $1$. Deli z $n^2$.
+ $\dfrac{5}{2}$
- Limite ni, ker števec raste čez vse meje.
~ Enako hitro raste tudi imenovalec. Po deljenju z $n^2$ dobiš ulomek, ki ima limito.
> Delimo z $n^2$: $\dfrac{5 - \frac{2}{n^2}}{2 + \frac{1}{n}} \to \dfrac{5}{2}$.

? Prvo uro poti zaradi gneče prevoziš le $60\,\text{km}$, nato vsako uro $90\,\text{km}$. Povprečna hitrost po $n$ urah je $v_n = 90 - \dfrac{30}{n}$ (v km/h) in ima limito $90\,\text{km/h}$. Od katere ure naprej je za manj kot $2\,\text{km/h}$ pod limito?
- Od $15$. ure naprej.
~ Pri $n = 15$ je razlika $\dfrac{30}{15} = 2$, kar ni manj kot $2$. Rob okolice ne spada v okolico.
+ Od $16$. ure naprej.
- Od $60$. ure naprej.
~ To je $30 \cdot 2$. Iz $\dfrac{30}{n} < 2$ sledi $n > \dfrac{30}{2}$, ne $n > 30 \cdot 2$.
> $|v_n - 90| = \dfrac{30}{n} < 2$ velja za $n > 15$, torej od $n = 16$ naprej.

:::simboli
a_n | $n$-ti člen zaporedja | | |
a_{n+1} | člen, ki sledi členu $a_n$ | | | $a_{n+1} - a_n > 0$: zaporedje strogo narašča
n | indeks (mesto člena) | | | naravno število
L | limita zaporedja | \lim_{n \to \infty} a_n = L | |
\varepsilon | polmer okolice limite | | | $\varepsilon > 0$, poljubno majhen
v_n | povprečna hitrost po $n$ urah vožnje | v_n = \frac{200n}{2n+1} | km/h |
:::
