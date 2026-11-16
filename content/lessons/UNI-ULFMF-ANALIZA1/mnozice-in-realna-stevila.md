---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolka Nika trdi: »Vsaka navzgor omejena množica ima največji element.« Preizkusi trditev na vrstici napredka v telefonu, ki med prenosom kaže deleže $\tfrac12, \tfrac23, \tfrac34, \tfrac45, \dots$, torej $1 - \tfrac1n$ za $n = 2, 3, 4, \dots$. Največjega deleža ni: za vsakim pride večji. Vsi pa ostanejo pod $1$, in $1$ je med vsemi takimi mejami najmanjša. Takemu številu rečemo **supremum**; Nikino trditev bomo popravili: neprazna navzgor omejena množica realnih števil ima vedno supremum, maksimuma pa ne nujno.

Ulomki imajo pri tem težavo. Števila $1$; $1{,}4$; $1{,}41$; $1{,}414$; ... rastejo in imajo kvadrate pod $2$, a med ulomki ni najmanjše meje nad njimi, ker $\sqrt2$ ni ulomek: na premici ulomkov je tu »luknja«. Realna števila lukenj nimajo, kar zapiše **aksiom o polnosti**, temelj limit, zveznosti, odvodov in integralov. Za trditve »za vsak $n$« dodamo še **matematično indukcijo**.

## Razlaga

**1. Množice.** **Množica** je skupina objektov, ki jim rečemo **elementi**. Pišemo $a \in A$ (a je element A) in $a \notin A$. Množico podamo z naštevanjem, $A = \{1, 2, 3\}$, ali s pogojem, $B = \{x \in \mathbb{R} : x^2 < 2\}$. $A$ je **podmnožica** $B$, $A \subseteq B$, če je vsak element $A$ tudi v $B$. Osnovne operacije:

- unija $A \cup B$: elementi, ki so v $A$ ali v $B$,
- presek $A \cap B$: elementi, ki so v obeh,
- razlika $A \setminus B$: elementi $A$, ki niso v $B$.

Številske množice: $\mathbb{N} = \{1, 2, 3, \dots\}$, $\mathbb{Z}$ (cela), $\mathbb{Q}$ (racionalna) in $\mathbb{R}$ (realna). Velja $\mathbb{N} \subseteq \mathbb{Z} \subseteq \mathbb{Q} \subseteq \mathbb{R}$. Intervali: $[a, b] = \{x : a \le x \le b\}$, $(a, b) = \{x : a < x < b\}$, podobno $[a, b)$ in $(a, b]$.

**2. Zgornja meja.** Naj bo $A \subseteq \mathbb{R}$. Število $M$ je **zgornja meja** množice $A$, če je $a \le M$ za vsak $a \in A$. Če zgornja meja obstaja, je $A$ **navzgor omejena**. Enako definiramo **spodnjo mejo** ($m \le a$ za vse $a$) in **navzdol omejeno** množico. Omejena množica je omejena v obe smeri.

Zgornjih mej je veliko. Za $A = [0, 1)$ so zgornje meje $1$, $2$, $\pi$, $100$ in vsako število $\ge 1$. Najmanjša med njimi je $1$.

**3. Supremum in infimum.** Preden pojem poimenujemo, primerjaj tri množice. Pri $[0, 1)$ je najmanjša zgornja meja $1$, v množici pa je ni. Pri $[0, 1]$ je najmanjša zgornja meja spet $1$, tokrat leži v množici. Pri $\{\tfrac1n : n \in \mathbb{N}\}$ je največja spodnja meja $0$, a noben $\tfrac1n$ ni enak $0$. Vzorec: najmanjša zgornja (ali največja spodnja) meja je v množici le včasih. Zato potrebujemo dve imeni.

**Supremum** $\sup A$ je **najmanjša zgornja meja** množice $A$. **Infimum** $\inf A$ je **največja spodnja meja**. Če $\sup A$ leži v $A$, mu rečemo **maksimum**, $\max A$; podobno je **minimum** infimum, ki leži v $A$.

Iste množice in še $\mathbb{N}$, zdaj z novimi imeni:

| množica | $\sup$ | $\max$ | $\inf$ |
|---|---|---|---|
| $[0, 1]$ | $1$ | $1$ | $0$ (je min) |
| $[0, 1)$ | $1$ | ne obstaja | $0$ (je min) |
| $\{\tfrac1n : n \in \mathbb{N}\}$ | $1$ | $1$ | $0$ (ni min) |
| $\mathbb{N}$ | ne obstaja | ne obstaja | $1$ (je min) |

Na številski premici je $[0, 1)$ daljica s polnim krožcem pri $0$ in praznim pri $1$. Supremum je desni konec, čeprav ga množica ne vsebuje.

:::premisli
Ima lahko množica dva različna supremuma? Utemelji, preden pogledaš.
---
Ne. Če sta $M_1$ in $M_2$ oba supremuma, je vsak zgornja meja, drugi pa najmanjša zgornja meja. Zato $M_1 \le M_2$ in $M_2 \le M_1$, torej $M_1 = M_2$.
:::

**4. Kako preverimo, da je $M$ supremum.** Število $M$ je $\sup A$ natanko tedaj, ko veljata dva pogoja:

1. $a \le M$ za vsak $a \in A$ ($M$ je zgornja meja),
2. za vsak $\varepsilon > 0$ obstaja $a \in A$, da je $a > M - \varepsilon$ (nič manjšega od $M$ ni zgornja meja).

Drugi pogoj pove: kakorkoli malo se spustiš pod $M$, tam že najdeš element množice. Za infimum je pogoj zrcalen: $a \ge m$ za vse $a$ in za vsak $\varepsilon > 0$ obstaja $a < m + \varepsilon$.

**5. Aksiom o polnosti.** *Vsaka neprazna navzgor omejena podmnožica $\mathbb{R}$ ima supremum v $\mathbb{R}$.*

Tega ne dokazujemo; to je ena od lastnosti, s katerimi realna števila opišemo (poleg računskih pravil in urejenosti). Ulomki te lastnosti nimajo. Množica $\{x \in \mathbb{Q} : x^2 < 2\}$ je navzgor omejena (z $2$), v $\mathbb{Q}$ pa nima supremuma. V $\mathbb{R}$ ga ima, in to je $\sqrt2$. Iz aksioma sledi tudi, da ima vsaka neprazna navzdol omejena množica infimum: $\inf A = -\sup(-A)$, kjer je $-A = \{-a : a \in A\}$.

Pomembna posledica je **arhimedska lastnost**: množica $\mathbb{N}$ ni navzgor omejena. Za vsako realno število $x$ torej obstaja naravno število $n > x$. Dokaz je v razdelku »Bolj natančno«.

:::premisli
Zakaj iz arhimedske lastnosti sledi $\inf\{\tfrac1n : n \in \mathbb{N}\} = 0$?
---
$0$ je spodnja meja, ker je $\tfrac1n > 0$. Za dani $\varepsilon > 0$ po arhimedski lastnosti obstaja $n > \tfrac1\varepsilon$, torej $\tfrac1n < \varepsilon = 0 + \varepsilon$. Nobeno število nad $0$ zato ni spodnja meja.
:::

**6. Matematična indukcija.** Seštej prvih nekaj naravnih števil: $1 = 1$, $1 + 2 = 3$, $1 + 2 + 3 = 6$, $1 + 2 + 3 + 4 = 10$. Vsakič dobiš $\tfrac{n(n+1)}{2}$: $\tfrac{1 \cdot 2}{2} = 1$, $\tfrac{2 \cdot 3}{2} = 3$, $\tfrac{3 \cdot 4}{2} = 6$, $\tfrac{4 \cdot 5}{2} = 10$. Štirje primeri pa še niso dokaz za vsak $n$. Za trditev $T(n)$ pri vseh $n \in \mathbb{N}$ je dovolj dvoje:

1. **baza**: velja $T(1)$,
2. **indukcijski korak**: za vsak $n$ iz $T(n)$ sledi $T(n+1)$.

Predstavljaj si vrsto domin. Prva pade (baza). Vsaka padajoča podre naslednjo (korak). Zato padejo vse. Predpostavki $T(n)$ v koraku rečemo **indukcijska predpostavka**. Če začnemo pri $n_0$ namesto pri $1$, dobimo trditev za vse $n \ge n_0$.

Uganjeni vzorec zdaj dokažimo: $1 + 2 + \dots + n = \dfrac{n(n+1)}{2}$. Baza: $1 = \dfrac{1 \cdot 2}{2}$. Korak: če formula velja za $n$, je

$$1 + \dots + n + (n+1) = \frac{n(n+1)}{2} + (n + 1) = \frac{(n+1)(n+2)}{2},$$

kar je formula za $n + 1$.

## Rešeni primeri

### Primer 1 (lažji): interval

Določi $\sup$, $\inf$, $\max$ in $\min$ množice $A = (-2, 3]$.

**Podatki:** $A = (-2, 3] = \{x \in \mathbb{R} : -2 < x \le 3\}$
**Iščemo:** $\sup A$, $\inf A$ ter ali obstajata $\max A$ in $\min A$

:::formula
$\sup A$ je najmanjša zgornja meja; če $\sup A \in A$, je $\sup A = \max A$. Zrcalno za $\inf$ in $\min$.
:::

**Rešitev:**

1. Zgornje meje so vsa števila $\ge 3$, najmanjša je $3$. Torej $\sup A = 3$.
2. $3 \in A$, zato je $\max A = 3$.
3. Spodnje meje so vsa števila $\le -2$, največja je $-2$. Torej $\inf A = -2$.
4. $-2 \notin A$, zato minimum ne obstaja: za vsak $a \in A$ je $\tfrac{a - 2}{2}$ še manjši element $A$.
5. Odgovor: $\sup A = \max A = 3$, $\inf A = -2$, minimuma ni.

### Primer 2: supremum z $\varepsilon$

Vrstica napredka iz uvoda kaže deleže iz množice $A = \{1 - \tfrac1n : n \in \mathbb{N}\}$. Dokaži, da je $\sup A = 1$. Za $\varepsilon = 0{,}01$ poišči element $A$, ki je večji od $1 - \varepsilon$, torej trenutek, ko vrstica preseže $99\,\%$.

**Podatki:** $A = \{1 - \tfrac1n : n \in \mathbb{N}\}$, $\varepsilon = 0{,}01$
**Iščemo:** dokaz $\sup A = 1$ in element $a > 0{,}99$

:::formula
$M = \sup A \iff$ (1) $a \le M$ za vse $a \in A$ in (2) za vsak $\varepsilon > 0$ obstaja $a \in A$ z $a > M - \varepsilon$.
:::

**Rešitev:**

1. Pogoj 1: $\tfrac1n > 0$, zato $1 - \tfrac1n < 1$. Število $1$ je zgornja meja.
2. Pogoj 2: želimo $1 - \tfrac1n > 1 - \varepsilon$, kar je enako $\tfrac1n < \varepsilon$ oziroma $n > \tfrac1\varepsilon$.
3. Tak $n$ obstaja po arhimedski lastnosti. Zato je $\sup A = 1$.
4. Za $\varepsilon = 0{,}01$ je $\tfrac1\varepsilon = 100$, vzamemo $n = 101$: $1 - \tfrac{1}{101} = \tfrac{100}{101} \approx 0{,}9901 > 0{,}99$.
5. Ker je $1 - \tfrac1n < 1$ za vsak $n$, $1 \notin A$, in maksimum ne obstaja.
6. Odgovor: $\sup A = 1$ (ni maksimum); za $\varepsilon = 0{,}01$ ustreza na primer $1 - \tfrac{1}{101}$.

### Primer 3 (težji): od katerega $n$ naprej?

Programer primerja dva algoritma: prvi pri vhodu velikosti $n$ naredi $2^n$ korakov, drugi $n^2$. Od katerega naravnega števila naprej je prvi počasnejši, torej velja $2^n > n^2$? Ugotovi z računom in dokaži z indukcijo.

**Podatki:** neenakost $2^n > n^2$, $n \in \mathbb{N}$
**Iščemo:** najmanjši $n_0$, da neenakost velja za vse $n \ge n_0$, in dokaz

:::formula
Indukcija z začetkom $n_0$: baza $T(n_0)$ in korak $T(n) \Rightarrow T(n+1)$ za $n \ge n_0$.
:::

**Rešitev:**

1. Poskusimo nekaj vrednosti: $n = 1$: $2 > 1$; $n = 2$: $4 = 4$; $n = 3$: $8 < 9$; $n = 4$: $16 = 16$; $n = 5$: $32 > 25$; $n = 6$: $64 > 36$.
2. Domneva: $n_0 = 5$ (pri $n = 2, 3, 4$ neenakost ne velja).
3. Baza: $2^5 = 32 > 25 = 5^2$.
4. Korak: naj bo $n \ge 5$ in $2^n > n^2$. Potem $2^{n+1} = 2 \cdot 2^n > 2n^2$.
5. Pokazati moramo še $2n^2 \ge (n+1)^2$, kar je enako $n^2 - 2n - 1 \ge 0$ oziroma $(n-1)^2 \ge 2$. Za $n \ge 5$ je $(n-1)^2 \ge 16$, zato drži.
6. Torej $2^{n+1} > 2n^2 \ge (n+1)^2$.
7. Odgovor: $2^n > n^2$ velja za vse $n \ge 5$ (in še za $n = 1$).

### Primer 4 – zdaj ti: vsota lihih števil

Dokaži z indukcijo, da je $1 + 3 + 5 + \dots + (2n - 1) = n^2$ za vsak $n \in \mathbb{N}$.

**Podatki:** trditev $T(n)$: $1 + 3 + \dots + (2n-1) = n^2$
**Iščemo:** dokaz za vse $n \in \mathbb{N}$

:::formula
Baza $T(1)$; korak: iz $T(n)$ izpelji $T(n+1)$.
:::

**Rešitev:**

1. Baza: za $n = 1$ je leva stran $1$, desna $1^2 = 1$.
2. Korak: privzemimo $1 + 3 + \dots + (2n-1) = n^2$. Naslednje liho število je $2(n+1) - 1 = 2n + 1$.
3. Dokončaj korak sam, nato preveri:

:::premisli
Kako iz indukcijske predpostavke dobiš $1 + 3 + \dots + (2n+1) = (n+1)^2$?
---
Prištej $2n + 1$ obema stranema predpostavke: $1 + 3 + \dots + (2n-1) + (2n+1) = n^2 + 2n + 1 = (n+1)^2$. To je $T(n+1)$. Po načelu indukcije trditev velja za vse $n$.
:::

## Pogoste napake

- **Supremum je vedno element množice.** Napačno sklepanje: »$\sup [0, 1)$ ne obstaja, ker $1$ ni v množici.« Supremum je najmanjša zgornja meja in je lahko zunaj množice. V množici mora ležati le *maksimum*. Popravek: ločuj $\sup$ in $\max$.
- **Katerakoli zgornja meja je supremum.** »$\sup [0, 1) = 2$, ker je $2$ zgornja meja.« Res je meja, ni pa najmanjša: tudi $1{,}5$ je meja. Popravek: preveri še pogoj z $\varepsilon$.
- **Pogoj z $\varepsilon$ za en sam $\varepsilon$.** Kdor pokaže, da obstaja element nad $0{,}99$, še ni dokazal, da je $1$ supremum. Pogoj mora veljati za **vsak** $\varepsilon > 0$, zato $n$ izrazimo z $\varepsilon$.
- **Indukcija brez baze.** »Če $n > n + 1$, potem $n + 1 > n + 2$« je pravilen korak, trditev pa je za vsak $n$ napačna. Korak sam ničesar ne dokaže. Popravek: vedno preveri bazo.
- **Uporaba tega, kar dokazujemo.** V koraku smeš privzeti $T(n)$, ne pa $T(n+1)$. Kdor začne s $T(n+1)$ in pride do resnične enakosti, ni dokazal ničesar, če sklepi niso obrnljivi.

## Povzetek

- $M$ je zgornja meja $A$, če je $a \le M$ za vse $a \in A$. $\sup A$ je najmanjša zgornja meja, $\inf A$ največja spodnja.
- $\max A$ obstaja le, če $\sup A \in A$; supremum je lahko zunaj množice.
- $M = \sup A \iff$ $M$ je zgornja meja in za vsak $\varepsilon > 0$ obstaja $a \in A$ z $a > M - \varepsilon$.
- Aksiom o polnosti: vsaka neprazna navzgor omejena $A \subseteq \mathbb{R}$ ima supremum. V $\mathbb{Q}$ to ne velja. Posledica: arhimedska lastnost.
- Indukcija: baza $T(n_0)$ in korak $T(n) \Rightarrow T(n+1)$ dasta $T(n)$ za vse $n \ge n_0$.

## Za izpit

Znati moraš povedati:

- definicije zgornje in spodnje meje, omejene množice, supremuma, infimuma, maksimuma in minimuma ter razliko med $\sup$ in $\max$;
- karakterizacijo supremuma z $\varepsilon$ (oba pogoja) in zrcalno karakterizacijo infimuma;
- aksiom o polnosti z obema predpostavkama (neprazna, navzgor omejena) in primer, da v $\mathbb{Q}$ ne velja;
- arhimedsko lastnost in njen dokaz iz aksioma o polnosti;
- načelo matematične indukcije (baza, korak, indukcijska predpostavka, začetek pri $n_0$);
- dokaz enoličnosti supremuma in dokaz, da $\sqrt2$ ni racionalno število.

### Naloga 1

Dana je množica $A = \left\{\dfrac{m}{m+n} : m, n \in \mathbb{N}\right\}$. (a) Določi $\sup A$ in $\inf A$ ter oboje dokaži s pogojem z $\varepsilon$. (b) Ali obstajata $\max A$ in $\min A$? (c) Za $\varepsilon = 0{,}001$ zapiši element $A$, ki je večji od $\sup A - \varepsilon$, in element, ki je manjši od $\inf A + \varepsilon$.

**Rešitev:**

1. Za vse $m, n \in \mathbb{N}$ je $0 < m < m + n$, zato $0 < \dfrac{m}{m+n} < 1$. Število $1$ je zgornja meja, število $0$ spodnja meja.
2. Supremum: izberemo $n = 1$. Pogoj $\dfrac{m}{m+1} > 1 - \varepsilon$ je enak $\dfrac{1}{m+1} < \varepsilon$ oziroma $m > \dfrac1\varepsilon - 1$. Tak $m \in \mathbb{N}$ obstaja po arhimedski lastnosti. Oba pogoja veljata, zato $\sup A = 1$.
3. Infimum: izberemo $m = 1$. Pogoj $\dfrac{1}{1+n} < 0 + \varepsilon$ je enak $n > \dfrac1\varepsilon - 1$. Tak $n \in \mathbb{N}$ spet obstaja po arhimedski lastnosti, zato $\inf A = 0$.
4. Po koraku 1 so vse neenakosti stroge, torej $1 \notin A$ in $0 \notin A$. Maksimum in minimum ne obstajata.
5. Za $\varepsilon = 0{,}001$ je $\dfrac1\varepsilon - 1 = 999$. Vzamemo $m = 1000$, $n = 1$: $\dfrac{1000}{1001} \approx 0{,}999001 > 0{,}999$. Vzamemo $m = 1$, $n = 1000$: $\dfrac{1}{1001} \approx 0{,}000999 < 0{,}001$.
6. Odgovor: $\sup A = 1$, $\inf A = 0$, maksimuma in minimuma ni; ustrezata na primer elementa $\dfrac{1000}{1001}$ in $\dfrac{1}{1001}$.

### Naloga 2

Naj bo $s_n = 1 + \dfrac{1}{2^2} + \dfrac{1}{3^2} + \dots + \dfrac{1}{n^2}$. (a) Z indukcijo dokaži, da je $s_n \le 2 - \dfrac1n$ za vsak $n \in \mathbb{N}$. (b) Utemelji, da ima množica $S = \{s_n : n \in \mathbb{N}\}$ supremum, in pokaži, da je $\dfrac{49}{36} < \sup S \le 2$. (c) Ali ima $S$ maksimum?

**Rešitev:**

1. Baza: $s_1 = 1$ in $2 - \dfrac11 = 1$, torej $s_1 \le 2 - \dfrac11$.
2. Indukcijska predpostavka: $s_n \le 2 - \dfrac1n$. Potem je $s_{n+1} = s_n + \dfrac{1}{(n+1)^2} \le 2 - \dfrac1n + \dfrac{1}{(n+1)^2}$.
3. Pokazati moramo $2 - \dfrac1n + \dfrac{1}{(n+1)^2} \le 2 - \dfrac{1}{n+1}$, kar je enako $\dfrac{1}{(n+1)^2} \le \dfrac1n - \dfrac{1}{n+1} = \dfrac{1}{n(n+1)}$.
4. Zadnja neenakost je enaka $n \le n + 1$ (obe strani pomnožimo z $n(n+1)^2 > 0$) in zato drži. Torej $s_{n+1} \le 2 - \dfrac{1}{n+1}$; po načelu indukcije trditev velja za vse $n$.
5. Množica $S$ je neprazna ($s_1 = 1 \in S$) in navzgor omejena: $s_n \le 2 - \dfrac1n < 2$. Po aksiomu o polnosti obstaja $\sup S$. Ker je $2$ zgornja meja, supremum pa najmanjša zgornja meja, je $\sup S \le 2$.
6. Spodnja ocena: $s_3 = 1 + \dfrac14 + \dfrac19 = \dfrac{49}{36}$ in $s_4 = s_3 + \dfrac1{16} > s_3$. Ker je $\sup S \ge s_4$, je $\sup S > \dfrac{49}{36} \approx 1{,}361$.
7. Maksimuma ni: za vsak $n$ je $s_{n+1} = s_n + \dfrac{1}{(n+1)^2} > s_n$, zato noben element $S$ ni največji.
8. Odgovor: $s_n \le 2 - \dfrac1n$ za vse $n$; $\sup S$ obstaja, velja $\dfrac{49}{36} < \sup S \le 2$, maksimuma ni.

### Naloga 3

Natančno navedi aksiom o polnosti in arhimedsko lastnost. Arhimedsko lastnost dokaži. Nato utemelji, zakaj v aksiomu ne smemo izpustiti nobene od predpostavk »neprazna« in »navzgor omejena« in zakaj trditev aksioma v $\mathbb{Q}$ ne velja.

**Rešitev:**

1. Aksiom o polnosti: vsaka neprazna navzgor omejena podmnožica $\mathbb{R}$ ima supremum v $\mathbb{R}$.
2. Arhimedska lastnost: množica $\mathbb{N}$ ni navzgor omejena; za vsak $x \in \mathbb{R}$ obstaja $n \in \mathbb{N}$ z $n > x$.
3. Dokaz s protislovjem: denimo, da je $\mathbb{N}$ navzgor omejena. Ker je neprazna, po aksiomu obstaja $s = \sup \mathbb{N}$.
4. Število $s - 1$ je manjše od $s$, zato ni zgornja meja: obstaja $n \in \mathbb{N}$ z $n > s - 1$. Potem je $n + 1 \in \mathbb{N}$ in $n + 1 > s$, kar nasprotuje temu, da je $s$ zgornja meja. Torej $\mathbb{N}$ ni navzgor omejena.
5. »Neprazna«: za prazno množico je vsako realno število zgornja meja (pogoj $a \le M$ za vse $a \in \emptyset$ je izpolnjen na prazno). Najmanjše zgornje meje ni, ker najmanjšega realnega števila ni.
6. »Navzgor omejena«: množica brez zgornje meje, na primer $\mathbb{N}$, nima niti ene zgornje meje, torej tudi najmanjše ne.
7. V $\mathbb{Q}$: množica $B = \{x \in \mathbb{Q} : x^2 < 2\}$ je neprazna ($1 \in B$) in navzgor omejena z $2$. V $\mathbb{R}$ je $\sup B = \sqrt2$. Če bi imela $B$ najmanjšo zgornjo mejo $q \in \mathbb{Q}$, je $q \ge 1$ (ker $1 \in B$) in $q \ne \sqrt2$, ker $\sqrt2$ ni racionalno. Če je $q < \sqrt2$, zaradi gostosti $\mathbb{Q}$ obstaja ulomek $r$ s $q < r < \sqrt2$; ta je v $B$ (ker $0 < r < \sqrt2$, je $r^2 < 2$), zato $q$ ni zgornja meja. Če je $q > \sqrt2$, obstaja ulomek $r$ s $\sqrt2 < r < q$; ta je manjša zgornja meja. V obeh primerih dobimo protislovje.
8. Sklep: polnost je lastnost, ki $\mathbb{R}$ loči od $\mathbb{Q}$; obe predpostavki sta potrebni, iz aksioma pa sledi arhimedska lastnost.

## Drugače: Na sliki

Nariši številsko premico in na njej množico $A = \{1 - \tfrac1n\}$: točke $0$; $0{,}5$; $0{,}67$; $0{,}75$; $0{,}8$; ... Točke se zgoščujejo proti $1$, a je ne dosežejo.

Zdaj si predstavljaj steno, ki jo potiskaš z desne proti levi. Stena je zgornja meja, dokler so vse točke levo od nje. Pri $2$ stena še ničesar ne doseže. Pri $1$ se točke stene skoraj dotikajo. Če jo potisneš le malo naprej, na $1 - \varepsilon$, so desno od nje že neke točke. Supremum je zadnje mesto, kjer stena še stoji.

Aksiom o polnosti pravi: tako zadnje mesto na realni premici vedno obstaja. Na premici samih ulomkov bi stena lahko obstala v »luknji« pri $\sqrt2$, kjer ni nobenega števila.

## Drugače: Korak za korakom s številkami

Recept za določanje $\sup A$:

1. Izpiši nekaj elementov in jih uredi. Za $A = \{1 - \tfrac1n\}$: $0$; $0{,}5$; $0{,}667$; $0{,}75$ in tako naprej.
2. Ugani kandidata $M$ (kam se elementi bližajo ali kateri je največji): $M = 1$.
3. Preveri, da je $M$ zgornja meja: $1 - \tfrac1n \le 1$.
4. Za splošen $\varepsilon > 0$ poišči element nad $M - \varepsilon$: $n > \tfrac1\varepsilon$. Številsko: $\varepsilon = 0{,}1$ da $n = 11$, $\varepsilon = 0{,}01$ da $n = 101$.
5. Odloči, ali je $M \in A$: tu ni, zato maksimuma ni.

Recept za indukcijo:

1. Zapiši $T(n)$ in $T(n+1)$ eno pod drugo, da vidiš razliko.
2. Preveri bazo s števili.
3. V koraku začni pri levi strani $T(n+1)$, vanjo vstavi predpostavko $T(n)$ in preoblikuj do desne strani.

## Drugače: Bolj natančno

**Arhimedska lastnost.** Denimo, da je $\mathbb{N}$ navzgor omejena. Po aksiomu o polnosti obstaja $s = \sup \mathbb{N}$. Število $s - 1$ ni zgornja meja, zato obstaja $n \in \mathbb{N}$ z $n > s - 1$. Potem je $n + 1 > s$ in $n + 1 \in \mathbb{N}$, kar nasprotuje temu, da je $s$ zgornja meja.

**Obstoj $\sqrt2$.** Naj bo $A = \{x \ge 0 : x^2 < 2\}$ in $s = \sup A$ (obstaja, ker je $1 \in A$ in je $2$ zgornja meja). Če bi bilo $s^2 < 2$, bi za dovolj majhen $h \in (0, 1)$ veljalo $(s + h)^2 \le s^2 + h(2s + 1) < 2$, torej $s + h \in A$, protislovje. Če bi bilo $s^2 > 2$, bi bil $s - h$ za majhen $h > 0$ še vedno zgornja meja, protislovje. Torej $s^2 = 2$.

**$\sqrt2$ ni racionalno.** Če $\sqrt2 = \tfrac{p}{q}$ s tujima $p, q$, je $p^2 = 2q^2$, zato je $p$ sod, $p = 2k$, in $q^2 = 2k^2$, torej je tudi $q$ sod. Protislovje.

**Gostost $\mathbb{Q}$.** Med poljubnima $a < b$ leži ulomek: izberi $n > \tfrac{1}{b - a}$ in najmanjše celo $m > na$; potem $a < \tfrac{m}{n} < b$.

**Indukcija in dobra urejenost.** Načelo indukcije je enakovredno trditvi, da ima vsaka neprazna podmnožica $\mathbb{N}$ najmanjši element. Če $T(n)$ ne bi veljala za vse $n$, vzemi najmanjši $n$, za katerega ne velja. Ni $1$ (baza), torej velja $T(n-1)$, po koraku pa $T(n)$. Protislovje. **Krepka indukcija**: v koraku smemo privzeti $T(1), \dots, T(n)$ hkrati.

## Preveri se

? Kaj pravi aksiom o polnosti?
- Vsaka neprazna navzgor omejena podmnožica $\mathbb{R}$ ima maksimum.
~ Maksimum ni zagotovljen: $[0, 1)$ je omejena, a nima največjega elementa. Zagotovljen je supremum.
+ Vsaka neprazna navzgor omejena podmnožica $\mathbb{R}$ ima supremum v $\mathbb{R}$.
- Vsaka podmnožica $\mathbb{R}$ ima supremum v $\mathbb{R}$.
~ Brez omejenosti ne gre: $\mathbb{N}$ ni navzgor omejena in nima realnega supremuma.
> Polnost zagotavlja najmanjšo zgornjo mejo za vsako neprazno navzgor omejeno množico; v $\mathbb{Q}$ to ne velja.

? Kaj velja za $A = (0, 1)$?
- $\sup A = 1$ in $\max A = 1$.
~ $1 \notin A$, zato $1$ ni maksimum. Supremum ni nujno element množice.
- Supremum ne obstaja, ker $1$ ni v množici.
~ Supremum je lahko zunaj množice; tu je $1$ najmanjša zgornja meja.
+ $\sup A = 1$, maksimum ne obstaja.
> $1$ je zgornja meja in za vsak $\varepsilon > 0$ je kak element nad $1 - \varepsilon$; ker $1 \notin A$, maksimuma ni.

? »Dokaz«: če $n > n + 1$, je $n + 1 > n + 2$, zato $n > n + 1$ velja za vse $n$. Kaj je narobe?
- Indukcijski korak je napačen.
~ Korak je pravilen: neenakosti prišteješ $1$. Napaka je drugje.
+ Manjka baza: $1 > 2$ ne velja.
- Nič, indukcija je pravilno izpeljana.
~ Trditev je očitno napačna, zato dokaz ne more biti v redu. Brez baze domine nikoli ne začnejo padati.
> Korak je veljaven, a brez resnične baze iz njega ne sledi nič.

? Za $A = \{1 - \tfrac1n : n \in \mathbb{N}\}$ in $\varepsilon = 0{,}05$: kateri $n$ zagotovo da $1 - \tfrac1n > 1 - \varepsilon$?
- $n = 20$
~ $1 - \tfrac{1}{20} = 0{,}95$ je enako $1 - \varepsilon$, ne večje. Potrebna je stroga neenakost $n > \tfrac1\varepsilon$.
+ $n = 21$
- $n = 5$
~ Tu je $\tfrac1n = 0{,}2 > 0{,}05$, element $0{,}8$ je pod $0{,}95$. Pogoj je $n > \tfrac1\varepsilon = 20$.
> $1 - \tfrac1n > 1 - \varepsilon \iff n > \tfrac1\varepsilon = 20$, torej $n = 21$: $1 - \tfrac{1}{21} \approx 0{,}952 > 0{,}95$.

? Določi $\sup$ in $\inf$ množice $B = \{(-1)^n + \tfrac1n : n \in \mathbb{N}\}$.
- $\sup B = 2$, $\inf B = -1$
~ $2$ bi dobil pri $1 + 1$, a pri $n = 1$ je $(-1)^1 = -1$. Pri sodih $n$ je največji element $1 + \tfrac12$.
- $\sup B = \tfrac32$, $\inf B = 0$
~ $0$ je le prvi element ($n = 1$). Lihi $n \ge 3$ dajo $-\tfrac23$, $-\tfrac45$, ..., ki so manjši od $0$.
+ $\sup B = \tfrac32$, $\inf B = -1$
> Sodi $n$: $1 + \tfrac1n$, največji pri $n = 2$, torej $\sup B = \max B = \tfrac32$. Lihi $n$: $-1 + \tfrac1n > -1$ in se poljubno približajo $-1$, zato $\inf B = -1$, minimuma ni.

:::simboli
n | naravno število
n_0 | začetna vrednost indukcije | | | trditev velja za vse n ≥ n₀
T | trditev, odvisna od n | | | T(n) ⇒ T(n+1) je indukcijski korak
A | množica realnih števil
a | element množice A
M | zgornja meja množice A; najmanjša zgornja meja je supremum | a \le M | | M = sup A, če je M najmanjša zgornja meja
\varepsilon | poljubno majhno pozitivno število | | | ε > 0
:::
