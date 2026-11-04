---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Skoraj vsak zakon v naravoslovju govori o **spreminjanju**: hitrost je sprememba lege s časom, pospešek sprememba hitrosti, hitrost reakcije sprememba koncentracije, tok sprememba naboja, hitrost rasti populacije sprememba števila osebkov. Vse to opiše isti matematični pojem, **odvod**.

Povprečno hitrost spreminjanja na intervalu izračunamo kot kvocient »sprememba količine / sprememba časa«. Odvod je limita tega kvocienta, ko interval krčimo proti nič: dobimo **trenutno** hitrost spreminjanja. Geometrijsko je odvod **naklon tangente** na graf.

Ko boš lekcijo predelal, boš znal uporabiti:

- definicijo odvoda in odvod v točki,
- tabelo odvodov elementarnih funkcij in **pravila odvajanja** (vsota, produkt, kvocient),
- **verižno pravilo** za odvod sestavljene funkcije,
- enačbi **tangente** in normale.

Pojem odvoda sta v 17. stoletju neodvisno razvila Isaac Newton, ki ga je potreboval za mehaniko gibanja planetov, in Gottfried Wilhelm Leibniz, ki je vpeljal zapis $\frac{dy}{dx}$, ki ga uporabljamo še danes. Odvajanje je osnova za iskanje ekstremov, risanje grafov, Taylorjeve približke in integriranje, ki pridejo na vrsto v naslednjih lekcijah.

## Razlaga

**1. Diferenčni kvocient.** Naj bo $f$ definirana na okolici točke $x_0$. Ko se $x$ spremeni iz $x_0$ v $x_0 + h$, se vrednost spremeni za $\Delta f = f(x_0 + h) - f(x_0)$. **Diferenčni kvocient**

$$\frac{f(x_0 + h) - f(x_0)}{h}$$

je povprečna hitrost spreminjanja na intervalu med $x_0$ in $x_0 + h$. Geometrijsko je to smerni koeficient **sekante** skozi točki $(x_0, f(x_0))$ in $(x_0 + h, f(x_0 + h))$.

**2. Odvod v točki.** **Definicija.** Naj bo $f$ definirana na neki okolici točke $x_0$. Če obstaja končna limita

$$f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h},$$

pravimo, da je $f$ **odvedljiva** v $x_0$, in število $f'(x_0)$ imenujemo **odvod** funkcije $f$ v točki $x_0$. Končni limiti istega kvocienta za $h \to 0^-$ in $h \to 0^+$, če obstajata, imenujemo **levi** in **desni odvod**; $f$ je odvedljiva v $x_0$ natanko tedaj, ko oba obstajata in sta enaka. Funkcija je odvedljiva na odprtem intervalu, če je odvedljiva v vsaki njegovi točki. Uporabljamo tudi oznake $\frac{df}{dx}(x_0)$, $\frac{dy}{dx}$, pri odvajanju po času pa $\dot{x}$. Ko se $h$ manjša, se sekanta suče okoli točke $(x_0, f(x_0))$ in se približa **tangenti**; odvod je njen smerni koeficient.

Funkcija $f'$, ki vsakemu $x$ priredi $f'(x)$, je **odvod funkcije** $f$. Odvod odvoda je **drugi odvod** $f''$ in tako naprej.

**3. Odvedljivost in zveznost.** **Izrek.** Če je $f$ odvedljiva v $x_0$, je v $x_0$ tudi zvezna.

*Dokaz.* Za $x \neq x_0$ je $f(x) - f(x_0) = \frac{f(x) - f(x_0)}{x - x_0} \cdot (x - x_0)$. Ko gre $x \to x_0$, gre prvi faktor proti $f'(x_0)$, drugi proti $0$, zato $f(x) - f(x_0) \to f'(x_0) \cdot 0 = 0$, torej $\lim_{x \to x_0} f(x) = f(x_0)$. $\square$

Obratno ne velja: $f(x) = |x|$ je zvezna v $0$, a leva limita diferenčnega kvocienta je $-1$, desna $1$, zato odvod ne obstaja. Graf ima v $0$ »špico«. Podobno $\sqrt[3]{x}$ v $0$ nima odvoda, ker je tangenta navpična.

**4. Tabela odvodov.**

| $f(x)$ | $f'(x)$ |
|---|---|
| $c$ (konstanta) | $0$ |
| $x^r$ ($r \in \mathbb{R}$) | $r x^{r-1}$ |
| $e^x$ | $e^x$ |
| $a^x$ | $a^x \ln a$ |
| $\ln x$ | $\frac{1}{x}$ |
| $\log_a x$ | $\frac{1}{x \ln a}$ |
| $\sin x$ | $\cos x$ |
| $\cos x$ | $-\sin x$ |
| $\tan x$ | $\frac{1}{\cos^2 x}$ |
| $\arcsin x$ | $\frac{1}{\sqrt{1 - x^2}}$ |
| $\arccos x$ | $-\frac{1}{\sqrt{1 - x^2}}$ |
| $\arctan x$ | $\frac{1}{1 + x^2}$ |

Posebej: $(\sqrt{x})' = \frac{1}{2\sqrt{x}}$ in $\left(\frac{1}{x}\right)' = -\frac{1}{x^2}$. Odvodi veljajo na definicijskih območjih ($\ln x$ za $x > 0$, $\arcsin x$ in $\arccos x$ za $|x| < 1$, $\tan x$ za $\cos x \neq 0$).

**Izpeljave iz definicije** (pogosto na izpitu):

- $x^n$, $n \in \mathbb{N}$: po binomski formuli je $(x + h)^n - x^n = n x^{n-1} h + \binom{n}{2} x^{n-2} h^2 + \dots + h^n$; po deljenju s $h$ ostanejo poleg $n x^{n-1}$ le členi s faktorjem $h$, ki gredo proti $0$.
- $\sin x$: po adicijskem izreku je $\frac{\sin(x + h) - \sin x}{h} = \sin x \cdot \frac{\cos h - 1}{h} + \cos x \cdot \frac{\sin h}{h} \to \sin x \cdot 0 + \cos x \cdot 1$, kjer smo uporabili $\lim_{h \to 0}\frac{\sin h}{h} = 1$ in $\lim_{h \to 0}\frac{\cos h - 1}{h} = 0$.
- $e^x$: $\frac{e^{x + h} - e^x}{h} = e^x \cdot \frac{e^h - 1}{h} \to e^x$, ker je $\lim_{h \to 0}\frac{e^h - 1}{h} = 1$.

**5. Pravila odvajanja.** **Izrek.** Naj bosta $f$ in $g$ odvedljivi v točki $x$ in $c \in \mathbb{R}$. Potem so v $x$ odvedljive tudi $cf$, $f \pm g$, $fg$ in, če je $g(x) \neq 0$, $\frac{f}{g}$, in velja:

- $(c f)' = c f'$ in $(f \pm g)' = f' \pm g'$,
- **produkt:** $(f g)' = f' g + f g'$,
- **kvocient:** $\left(\dfrac{f}{g}\right)' = \dfrac{f' g - f g'}{g^2}$.

*Dokaz pravila za produkt.* Prištejemo in odštejemo $f(x + h)g(x)$:

$$\frac{f(x+h)g(x+h) - f(x)g(x)}{h} = f(x + h)\frac{g(x + h) - g(x)}{h} + g(x)\frac{f(x + h) - f(x)}{h}.$$

Ker je $f$ odvedljiva v $x$, je tam zvezna (izrek 3), zato $f(x + h) \to f(x)$; kvocienta gresta proti $g'(x)$ in $f'(x)$. Dobimo $f g' + f' g$. $\square$

*Pravilo za kvocient* sledi iz produkta: najprej je $\frac{1}{h}\left(\frac{1}{g(x + h)} - \frac{1}{g(x)}\right) = -\frac{g(x + h) - g(x)}{h} \cdot \frac{1}{g(x + h)g(x)} \to -\frac{g'(x)}{g(x)^2}$ (zveznost $g$ zagotovi $g(x + h) \neq 0$ za majhne $h$), nato $\left(f \cdot \frac{1}{g}\right)' = \frac{f'}{g} - \frac{f g'}{g^2} = \frac{f'g - fg'}{g^2}$.

:::premisli
Ali bi lahko veljalo kar $(fg)' = f'g'$? Preizkusi na $f(x) = g(x) = x$.
---
Ne. $(x \cdot x)' = (x^2)' = 2x$, produkt odvodov pa je $1 \cdot 1 = 1$. Spreminjata se oba faktorja, zato ima odvod dva člena: $1 \cdot x + x \cdot 1 = 2x$.
:::

**6. Verižno pravilo.** **Izrek.** Naj bo $g$ odvedljiva v točki $x$ in $f$ odvedljiva v točki $g(x)$. Potem je sestavljena funkcija $h = f \circ g$, $h(x) = f(g(x))$, odvedljiva v $x$ in

$$h'(x) = f'(g(x)) \cdot g'(x).$$

*Zamisel dokaza.* Za $k = g(x + h) - g(x) \neq 0$ zapišemo $\frac{f(g(x + h)) - f(g(x))}{h} = \frac{f(g(x) + k) - f(g(x))}{k} \cdot \frac{k}{h}$. Ko gre $h \to 0$, gre $k \to 0$ (ker je $g$ zvezna), prvi faktor proti $f'(g(x))$, drugi proti $g'(x)$. Primer $k = 0$ obravnava natančni dokaz v razdelku »Bolj natančno«.

Odvajamo »od zunaj navznoter«: odvod zunanje funkcije, izračunan pri notranji, pomnožimo z odvodom notranje. V Leibnizovem zapisu z $u = g(x)$: $\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}$. Primeri:

- $\left((3x^2 + 1)^4\right)' = 4(3x^2 + 1)^3 \cdot 6x = 24x(3x^2 + 1)^3$,
- $\left(e^{-x^2}\right)' = e^{-x^2} \cdot (-2x)$,
- $\left(\sin(\omega t)\right)' = \omega \cos(\omega t)$, kjer odvajamo po $t$.

Pri več gnezdenih funkcijah verigo podaljšamo: $\left(\ln(\cos 2x)\right)' = \frac{1}{\cos 2x} \cdot (-\sin 2x) \cdot 2 = -2\tan 2x$.

:::premisli
Odvajaj $\sin^2 x$ in $\sin(x^2)$. Katera funkcija je v vsakem primeru zunanja?
---
Pri $\sin^2 x = (\sin x)^2$ je zunanja kvadriranje: $2\sin x \cdot \cos x$. Pri $\sin(x^2)$ je zunanji sinus: $\cos(x^2) \cdot 2x$.
:::

**7. Odvod inverzne funkcije.** **Izrek.** Naj bo $f$ zvezna in strogo monotona na odprtem intervalu $I$ ter odvedljiva v točki $x \in I$ z $f'(x) \neq 0$. Potem je inverzna funkcija $f^{-1}$ odvedljiva v točki $y = f(x)$ in

$$(f^{-1})'(y) = \frac{1}{f'(x)} = \frac{1}{f'(f^{-1}(y))}.$$

*Dokaz.* Inverz zvezne strogo monotone funkcije je zvezen. Za $k \neq 0$ naj bo $h = f^{-1}(y + k) - f^{-1}(y)$; tedaj je $h \neq 0$ (injektivnost), $f(x + h) = y + k$ in $h \to 0$, ko gre $k \to 0$ (zveznost $f^{-1}$). Zato $\frac{f^{-1}(y + k) - f^{-1}(y)}{k} = \frac{h}{f(x + h) - f(x)} \to \frac{1}{f'(x)}$. $\square$ Ko odvedljivost $f^{-1}$ poznamo, formulo hitro dobimo tudi z odvajanjem identitete $f(f^{-1}(y)) = y$ po verižnem pravilu: $f'(f^{-1}(y)) \cdot (f^{-1})'(y) = 1$. Pogoj $f'(x) \neq 0$ je nujen: $f(x) = x^3$ ima $f'(0) = 0$ in inverzna funkcija $\sqrt[3]{y}$ v $0$ ni odvedljiva (navpična tangenta).

Uporaba: iz $(e^x)' = e^x$ dobimo $(\ln y)' = \frac{1}{e^x} = \frac{1}{y}$. Za $y = \sin x$, $x \in \left(-\frac{\pi}{2}, \frac{\pi}{2}\right)$, je $\cos x > 0$, zato $(\arcsin y)' = \frac{1}{\cos x} = \frac{1}{\sqrt{1 - \sin^2 x}} = \frac{1}{\sqrt{1 - y^2}}$ za $|y| < 1$.

**Logaritemsko odvajanje.** Pri funkcijah oblike $u(x)^{v(x)}$ najprej logaritmiramo: za $y = x^x$ je $\ln y = x \ln x$, odvajamo $\frac{y'}{y} = \ln x + 1$, torej $(x^x)' = x^x(\ln x + 1)$.

**Enote odvoda.** Odvod ima enoto »enota funkcije na enoto spremenljivke«. Če je $c(t)$ koncentracija v $\mathrm{mol/L}$ in $t$ čas v $\mathrm{s}$, ima $\frac{dc}{dt}$ enoto $\mathrm{mol/(L\,s)}$. Če je $V(T)$ prostornina plina v $\mathrm{m^3}$ v odvisnosti od temperature v $\mathrm{K}$, ima $\frac{dV}{dT}$ enoto $\mathrm{m^3/K}$. Preverjanje enot je dober preizkus pravilnosti modela.

**Implicitno odvajanje.** Včasih je zveza med $x$ in $y$ podana z enačbo, iz katere $y$ ne izrazimo zlahka, na primer krožnica $x^2 + y^2 = 25$. Obe strani odvajamo po $x$, pri čemer je $y$ funkcija $x$ in uporabimo verižno pravilo: $2x + 2y\, y' = 0$, torej $y' = -\frac{x}{y}$. V točki $(3, 4)$ je naklon tangente $-\frac{3}{4}$.

**Višji odvodi.** Drugi odvod $f''$ pove, kako se spreminja naklon. Če je $f'' > 0$, naklon tangente narašča in graf je **konveksen** (zavija navzgor); če je $f'' < 0$, je **konkaven**. V mehaniki je drugi odvod lege pospešek. Primer: za $f(x) = x^4$ je $f'(x) = 4x^3$, $f''(x) = 12x^2$, $f'''(x) = 24x$, $f^{(4)}(x) = 24$, vsi nadaljnji odvodi pa so $0$. Pri $e^x$ so vsi odvodi enaki $e^x$, pri $\sin x$ pa se ponavljajo s periodo $4$: $\cos x$, $-\sin x$, $-\cos x$, $\sin x$.

**8. Tangenta in normala.** Naj bo $f$ odvedljiva v $x_0$. Tangenta na graf $f$ v točki $(x_0, f(x_0))$ ima enačbo

$$y = f(x_0) + f'(x_0)(x - x_0).$$

**Normala** je pravokotna na tangento; za $f'(x_0) \neq 0$ ima smerni koeficient $-\frac{1}{f'(x_0)}$. Kot $\alpha$ med tangento in osjo $x$ dobimo iz $\tan\alpha = f'(x_0)$.

**9. Diferencial in linearni približek.** Blizu $x_0$ je graf skoraj enak tangenti, zato je

$$f(x_0 + h) \approx f(x_0) + f'(x_0)\, h.$$

Izraz $df = f'(x_0)\, dx$ je **diferencial**. Z njim ocenjujemo majhne spremembe in širjenje merskih napak.

## Rešeni primeri

### Primer 1 (lažji)

Po definiciji izračunaj odvod funkcije $f(x) = 2x^2 - x$ v točki $x_0 = 1$. Rezultat preveri s pravili.

**Podatki:** $f(x) = 2x^2 - x$, $x_0 = 1$
**Iščemo:** $f'(1)$

:::formula
$f'(x_0) = \lim_{h \to 0} \dfrac{f(x_0 + h) - f(x_0)}{h}$
:::

**Rešitev:**

1. $f(1) = 2 - 1 = 1$.
2. $f(1 + h) = 2(1 + h)^2 - (1 + h) = 2 + 4h + 2h^2 - 1 - h = 1 + 3h + 2h^2$.
3. Diferenčni kvocient: $\dfrac{(1 + 3h + 2h^2) - 1}{h} = \dfrac{3h + 2h^2}{h} = 3 + 2h$ za $h \neq 0$.
4. Limita: $\lim_{h \to 0} (3 + 2h) = 3$.
5. Preizkus s pravili: $f'(x) = 4x - 1$, $f'(1) = 3$.
6. Odgovor: $f'(1) = 3$; tangenta na graf v točki $(1, 1)$ ima smerni koeficient $3$.

### Primer 2

Odvajaj funkciji $f(x) = x^2 \sin(3x)$ in $g(x) = \dfrac{\ln x}{x}$ ter izračunaj $g'(1)$.

**Podatki:** $f(x) = x^2 \sin(3x)$, $g(x) = \dfrac{\ln x}{x}$ za $x > 0$, točka $x = 1$
**Iščemo:** $f'(x)$, $g'(x)$ in $g'(1)$

:::formula
$(uv)' = u'v + uv'$, $\left(\dfrac{u}{v}\right)' = \dfrac{u'v - uv'}{v^2}$, verižno pravilo $(\sin(3x))' = 3\cos(3x)$.
:::

**Rešitev:**

1. Za $f$: $u = x^2$, $u' = 2x$; $v = \sin(3x)$, $v' = 3\cos(3x)$ (verižno pravilo).
2. $f'(x) = 2x\sin(3x) + 3x^2\cos(3x)$.
3. Za $g$: $u = \ln x$, $u' = \frac{1}{x}$; $v = x$, $v' = 1$.
4. $g'(x) = \dfrac{\frac{1}{x} \cdot x - \ln x \cdot 1}{x^2} = \dfrac{1 - \ln x}{x^2}$.
5. $g'(1) = \dfrac{1 - 0}{1} = 1$.
6. Odgovor: $f'(x) = 2x\sin 3x + 3x^2\cos 3x$, $g'(x) = \frac{1 - \ln x}{x^2}$ in $g'(1) = 1$.

### Primer 3 (težji)

Dana je funkcija $f(x) = \sqrt{x^2 + 9}$. Zapiši enačbi tangente in normale na njen graf v točki z absciso $x_0 = 4$, izračunaj kot med tangento in osjo $x$ ter z linearnim približkom oceni $f(4{,}1)$. Nato poišči točko na grafu, v kateri je tangenta vzporedna s premico $3x - 5y = 0$, in utemelji, ali obstaja tangenta, vzporedna s premico $y = x$.

**Podatki:** $f(x) = \sqrt{x^2 + 9}$, $x_0 = 4$, točka za oceno $x = 4{,}1$, premici $3x - 5y = 0$ in $y = x$
**Iščemo:** enačbi tangente in normale, kot $\alpha$, približek $f(4{,}1)$, točko s tangento, vzporedno s $3x - 5y = 0$, obstoj tangente, vzporedne z $y = x$

:::formula
Tangenta: $y = f(x_0) + f'(x_0)(x - x_0)$. Normala: $y = f(x_0) - \dfrac{1}{f'(x_0)}(x - x_0)$. Kot: $\tan\alpha = f'(x_0)$. Verižno pravilo: $\left(\sqrt{u}\right)' = \dfrac{u'}{2\sqrt{u}}$.
:::

**Rešitev:**

1. $f(4) = \sqrt{16 + 9} = 5$; točka je $(4, 5)$.
2. Odvod po verižnem pravilu: $f'(x) = \dfrac{2x}{2\sqrt{x^2 + 9}} = \dfrac{x}{\sqrt{x^2 + 9}}$, torej $f'(4) = \frac{4}{5} = 0{,}8$.
3. Tangenta: $y = 5 + 0{,}8(x - 4) = 0{,}8x + 1{,}8$.
4. Normala: smerni koeficient $-\frac{1}{0{,}8} = -1{,}25$, torej $y = 5 - 1{,}25(x - 4) = -1{,}25x + 10$.
5. Kot: $\alpha = \arctan 0{,}8 \approx 38{,}7^\circ$.
6. Približek: $f(4{,}1) \approx 5 + 0{,}8 \cdot 0{,}1 = 5{,}08$. Natančna vrednost je $\sqrt{25{,}81} \approx 5{,}0804$.
7. Vzporedna tangenta: premica $3x - 5y = 0$ je $y = 0{,}6x$, zato iščemo $x$ z $f'(x) = 0{,}6$ (vzporedni premici imata enak smerni koeficient).
8. Iz $\dfrac{x}{\sqrt{x^2 + 9}} = 0{,}6$ sledi $x > 0$ in po kvadriranju $x^2 = 0{,}36(x^2 + 9)$, torej $0{,}64x^2 = 3{,}24$, $x^2 = 5{,}0625$ in $x = 2{,}25$ (rešitev $x = -2{,}25$ zavržemo, ker je za $x < 0$ leva stran negativna).
9. $f(2{,}25) = \sqrt{5{,}0625 + 9} = \sqrt{14{,}0625} = 3{,}75$; točka je $(2{,}25;\ 3{,}75)$.
10. Tangenta, vzporedna z $y = x$, bi zahtevala $f'(x) = 1$. Ker je $\sqrt{x^2 + 9} > \sqrt{x^2} = |x|$, je $|f'(x)| = \frac{|x|}{\sqrt{x^2 + 9}} < 1$ za vsak $x$, zato take tangente ni.
11. Odgovor: tangenta $y = 0{,}8x + 1{,}8$, normala $y = -1{,}25x + 10$, kot z osjo $x$ je približno $38{,}7^\circ$, $f(4{,}1) \approx 5{,}08$; tangenta je vzporedna s $3x - 5y = 0$ v točki $(2{,}25;\ 3{,}75)$, tangente, vzporedne z $y = x$, pa ni, ker je naklon vedno manjši od $1$.

## Pogoste napake

- **Odvod produkta kot produkt odvodov.** $(x^2 \sin x)' \neq 2x \cos x$. Pravilo za produkt ima dva člena: $2x\sin x + x^2\cos x$.
- **Pozabljen odvod notranje funkcije.** $(\sin 3x)' \neq \cos 3x$; pravilno je $3\cos 3x$. Prav tako $(e^{-2x})' = -2e^{-2x}$.
- **Napačen vrstni red pri kvocientu.** V števcu je $f'g - fg'$, ne $fg' - f'g$; zamenjava spremeni predznak.
- **$(a^x)' = x a^{x-1}$.** Pravilo za potence velja, ko je spremenljivka v osnovi. Pri eksponentni funkciji je $(a^x)' = a^x \ln a$.
- **Odvod v točki pred odvajanjem.** Študent najprej vstavi $x_0$ in nato odvaja konstanto, kar da $0$. Najprej odvajaj, nato vstavi.
- **Tangenta z napačno točko.** V enačbo tangente vstavi $f(x_0)$, ne $f'(x_0)$, kot ordinato točke.
- **Koti v stopinjah.** $(\sin x)' = \cos x$ velja samo, če je $x$ v radianih.
- **Odvod konstante z $\pi$ ali $e$.** Študent napiše $(e^2)' = 2e$ ali $(\pi^3)' = 3\pi^2$. Števili $e^2$ in $\pi^3$ sta konstanti, zato je njun odvod $0$.
- **Napačna spremenljivka.** Pri $f(t) = e^{-kt}$ odvajamo po $t$, $k$ je konstanta: $f'(t) = -k e^{-kt}$. Vedno preveri, po kateri spremenljivki odvajaš.

## Povzetek

- $f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}$ je trenutna hitrost spreminjanja in naklon tangente.
- Odvedljiva funkcija je zvezna; obratno ne velja ($|x|$ v $0$).
- $(x^r)' = r x^{r-1}$, $(e^x)' = e^x$, $(\ln x)' = \frac{1}{x}$, $(\sin x)' = \cos x$, $(\cos x)' = -\sin x$, $(\arctan x)' = \frac{1}{1 + x^2}$.
- $(fg)' = f'g + fg'$, $\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}$.
- Verižno pravilo: $(f(g(x)))' = f'(g(x))\, g'(x)$.
- Tangenta: $y = f(x_0) + f'(x_0)(x - x_0)$; normala ima smerni koeficient $-\frac{1}{f'(x_0)}$.
- Linearni približek: $f(x_0 + h) \approx f(x_0) + f'(x_0) h$.

## Za izpit

Znati moraš povedati:

- definicijo odvoda v točki (limita diferenčnega kvocienta, levi in desni odvod) in njegov geometrijski pomen;
- izrek »odvedljiva funkcija je zvezna« z dokazom in protiprimer za obrat ($|x|$ v $0$);
- pravila za vsoto, produkt in kvocient s pogoji in dokaz pravila za produkt;
- verižno pravilo in izrek o odvodu inverzne funkcije z vsemi pogoji ter izpeljave odvodov $\ln x$, $\arcsin x$ in $\arctan x$;
- izpeljave odvodov $x^n$, $\sin x$ in $e^x$ iz definicije;
- enačbi tangente in normale ter linearni približek.

### Naloga 1

Dana je funkcija $f(x) = ax^2 + b$ za $x \le 1$ in $f(x) = \dfrac{\ln x}{x}$ za $x > 1$. Določi realna parametra $a$ in $b$, da bo $f$ odvedljiva na vsem $\mathbb{R}$. Za te vrednosti poišči vse točke grafa z vodoravno tangento, zapiši enačbo tangente v točki z absciso $x_0 = e^2$ in izračunaj, kje ta tangenta seka os $x$.

**Rešitev:**

1. Na $(-\infty, 1)$ in $(1, \infty)$ je $f$ odvedljiva kot polinom oziroma kvocient odvedljivih funkcij z neničelnim imenovalcem. Preveriti moramo le $x = 1$.
2. Odvedljiva funkcija je zvezna, zato mora veljati $\lim_{x \to 1^+} \frac{\ln x}{x} = f(1)$: $0 = a + b$.
3. Levi odvod v $1$ je $2a \cdot 1 = 2a$. Desni odvod po definiciji, s $f(1) = a + b = 0$: $\frac{f(1 + h) - f(1)}{h} = \frac{\ln(1 + h)}{h} \cdot \frac{1}{1 + h} \to 1 \cdot 1 = 1$ za $h \to 0^+$ (znana limita $\lim_{h \to 0}\frac{\ln(1 + h)}{h} = 1$). Pogoj $2a = 1$ da $a = \frac{1}{2}$, $b = -\frac{1}{2}$.
4. Za $x > 1$ je $f'(x) = \left(\frac{\ln x}{x}\right)' = \frac{1 - \ln x}{x^2}$ (pravilo za kvocient), za $x < 1$ pa $f'(x) = 2ax = x$.
5. Vodoravne tangente ($f' = 0$): za $x < 1$ pri $x = 0$, $f(0) = -\frac{1}{2}$. Za $x > 1$ pri $\ln x = 1$, torej $x = e$, $f(e) = \frac{1}{e} \approx 0{,}368$. V $x = 1$ je $f'(1) = 1 \neq 0$.
6. Tangenta v $x_0 = e^2$: $f(e^2) = \frac{2}{e^2}$, $f'(e^2) = \frac{1 - 2}{e^4} = -\frac{1}{e^4}$, zato $y = \frac{2}{e^2} - \frac{1}{e^4}(x - e^2)$.
7. Presečišče z osjo $x$: iz $y = 0$ sledi $\frac{x - e^2}{e^4} = \frac{2}{e^2}$, torej $x - e^2 = 2e^2$ in $x = 3e^2 \approx 22{,}17$.
8. Odgovor: $a = \frac{1}{2}$, $b = -\frac{1}{2}$; vodoravni tangenti sta v točkah $\left(0, -\frac{1}{2}\right)$ in $\left(e, \frac{1}{e}\right)$; tangenta v $x_0 = e^2$ je $y = \frac{2}{e^2} - \frac{x - e^2}{e^4}$ in seka os $x$ v $x = 3e^2 \approx 22{,}17$.

### Naloga 2

Natančno navedi in dokaži izrek o odvodu inverzne funkcije. Pokaži, kako formulo dobiš iz verižnega pravila, in povej, kaj pri tem predpostaviš. Z njim izpelji $(\arctan x)' = \frac{1}{1 + x^2}$. Utemelji, ali je funkcija $g(x) = \sqrt[3]{x}$ odvedljiva v $0$.

**Rešitev:**

1. Izrek: naj bo $f$ zvezna in strogo monotona na odprtem intervalu $I$ ter odvedljiva v $x \in I$ z $f'(x) \neq 0$. Potem je $f^{-1}$ odvedljiva v $y = f(x)$ in $(f^{-1})'(y) = \frac{1}{f'(x)}$.
2. Dokaz: $f^{-1}$ je zvezna (inverz zvezne strogo monotone funkcije). Za $k \neq 0$ je $h = f^{-1}(y + k) - f^{-1}(y) \neq 0$, $f(x + h) = y + k$ in $h \to 0$, ko $k \to 0$, zato $\frac{f^{-1}(y + k) - f^{-1}(y)}{k} = \frac{h}{f(x + h) - f(x)} \to \frac{1}{f'(x)}$. Z verižnim pravilom iz $f(f^{-1}(y)) = y$ dobimo $f'(f^{-1}(y)) \cdot (f^{-1})'(y) = 1$ le, če odvedljivost $f^{-1}$ že vemo; zato ta račun sam ni dokaz, je pa hiter način, da si formulo zapomnimo.
3. Za $\arctan$: $f(x) = \tan x$ je na $I = \left(-\frac{\pi}{2}, \frac{\pi}{2}\right)$ zvezna, strogo naraščajoča in $f'(x) = \frac{1}{\cos^2 x} > 0$, pogoji so torej izpolnjeni.
4. Za $y = \tan x$ je $(\arctan y)' = \cos^2 x = \frac{1}{1 + \tan^2 x} = \frac{1}{1 + y^2}$, kjer smo uporabili $1 + \tan^2 x = \frac{1}{\cos^2 x}$. Z oznako $x$ namesto $y$: $(\arctan x)' = \frac{1}{1 + x^2}$.
5. Za $g(x) = \sqrt[3]{x}$, inverz funkcije $x^3$, izrek v $0$ ne velja, ker je $(x^3)' = 0$ pri $x = 0$. Odločimo z definicijo: $\frac{g(h) - g(0)}{h} = \frac{\sqrt[3]{h}}{h} = \frac{1}{\sqrt[3]{h^2}} \to \infty$, ko gre $h \to 0$.
6. Odgovor: $(\arctan x)' = \frac{1}{1 + x^2}$; $\sqrt[3]{x}$ v $0$ ni odvedljiva, ker limita diferenčnega kvocienta ni končna (tangenta je navpična), čeprav je tam zvezna.

### Naloga 3

Natančno navedi in dokaži izrek o odvodu produkta. Kje v dokazu uporabiš, da je odvedljiva funkcija zvezna? Utemelji, ali je produkt $p(x) = x\,|x|$ odvedljiv v $0$, čeprav $|x|$ tam ni odvedljiva.

**Rešitev:**

1. Izrek: če sta $f$ in $g$ odvedljivi v $x$, je $fg$ odvedljiva v $x$ in $(fg)'(x) = f'(x)g(x) + f(x)g'(x)$.
2. Dokaz: $\frac{f(x+h)g(x+h) - f(x)g(x)}{h} = f(x + h)\frac{g(x + h) - g(x)}{h} + g(x)\frac{f(x + h) - f(x)}{h}$ (prišteli in odšteli smo $f(x + h)g(x)$).
3. Ko gre $h \to 0$, gresta kvocienta proti $g'(x)$ in $f'(x)$. Za $f(x + h) \to f(x)$ potrebujemo zveznost $f$ v $x$, ki sledi iz odvedljivosti. Limita je $f(x)g'(x) + g(x)f'(x)$.
4. Pravila za produkt na $p$ ne moremo uporabiti, ker $|x|$ v $0$ ni odvedljiva. Uporabimo definicijo: $\frac{p(h) - p(0)}{h} = \frac{h|h|}{h} = |h| \to 0$.
5. Odgovor: $p$ je odvedljiva v $0$ in $p'(0) = 0$; pogoji izreka so zadostni, niso pa potrebni.

## Drugače: Na sliki

Nariši parabolo $y = x^2$ in točko $T(3, 9)$. Skozi $T$ in točko $(4, 16)$ potegni sekanto; njen naklon je $\frac{16 - 9}{1} = 7$. Nato izberi točko bližje, $(3{,}5;\ 12{,}25)$: naklon sekante je $\frac{12{,}25 - 9}{0{,}5} = 6{,}5$. Ko drugo točko pomikaš proti $T$, se sekanta vrti in se ustali v tangenti z naklonom $6$.

Predstavljaj si tudi, da z zelo močno lupo gledaš graf odvedljive funkcije okoli točke $T$. Bolj ko povečuješ, bolj je kos grafa podoben ravni črti: to je tangenta. Odvedljiva funkcija je »lokalno linearna«. Pri $|x|$ pa ostane v izhodišču špica, ne glede na povečavo, zato tam odvoda ni.

Kjer graf strmo narašča, je odvod velik in pozitiven. Kjer je graf vodoraven (vrh ali dno), je odvod $0$. Kjer pada, je odvod negativen. Iz grafa $f$ lahko zato grobo skiciraš graf $f'$: nad intervali naraščanja leži nad osjo $x$, nad intervali padanja pod njo.

## Drugače: Uporaba v stroki

**Kinetika v laboratoriju.** Pri reakciji prvega reda je $c(t) = c_0 e^{-kt}$. Hitrost porabe reaktanta je $-\frac{dc}{dt} = k c_0 e^{-kt} = k\, c(t)$; to je diferencialni zakon hitrosti. Za $c_0 = 0{,}80\,\mathrm{mol/L}$ in $k = 0{,}046\,\mathrm{min^{-1}}$ je začetna hitrost $0{,}046 \cdot 0{,}80 \approx 0{,}037\,\mathrm{mol/(L\,min)}$, po $10\,\mathrm{min}$ pa le še približno $0{,}023\,\mathrm{mol/(L\,min)}$. Pri metodi začetnih hitrosti iz izmerjenih koncentracij v prvih minutah izračunamo diferenčni kvocient $\frac{\Delta c}{\Delta t}$ kot približek odvoda pri $t = 0$; s primerjavo začetnih hitrosti pri različnih $c_0$ določimo red reakcije.

**Potenciometrična titracija.** Titrator zapisuje pH v odvisnosti od dodane prostornine titranta $V$. Ekvivalentna točka je prevoj titracijske krivulje: tam ima $\frac{d\,\mathrm{pH}}{dV}$ maksimum, drugi odvod pa ničlo. Programska oprema jo določi iz diferenčnih kvocientov $\frac{\Delta\mathrm{pH}}{\Delta V}$ zaporednih meritev (metoda prvega odvoda).

**Bioprocesi.** Če je $X(t)$ koncentracija biomase v fermentorju, je $\mu = \frac{1}{X}\frac{dX}{dt}$ **specifična hitrost rasti**. Pri $X(t) = X_0 e^{rt}$ je $\mu = r$ konstantna, po tem iz meritev prepoznamo eksponentno fazo in jo uporabimo za načrtovanje dovajanja hranil.

**Elektrokemija in nihanje vezi.** Električni tok je odvod naboja po času, $I = \frac{dQ}{dt}$, zato je po Faradayevem zakonu hitrost nastajanja produkta pri elektrolizi $\frac{dn}{dt} = \frac{I}{zF}$. Pri harmonskem modelu nihanja vezi (IR-spektroskopija) je odmik $x(t) = A\sin(\omega t)$, po verižnem pravilu hitrost $v = A\omega\cos(\omega t)$ in pospešek $a = -A\omega^2\sin(\omega t) = -\omega^2 x$.

**Termodinamične tabele.** Toplotna kapaciteta pri stalnem tlaku je odvod entalpije po temperaturi, $C_p = \left(\frac{\partial H}{\partial T}\right)_p$; temperaturni koeficient prostorninskega raztezka je $\frac{1}{V}\frac{dV}{dT}$. Ko v tabelah vidiš take količine, gre vedno za hitrost spreminjanja ene količine glede na drugo.

**Širjenje merske napake.** Polmer krogle izmerimo kot $r = 2{,}00\,\mathrm{cm}$ z napako $\Delta r = 0{,}02\,\mathrm{cm}$. Prostornina $V = \frac{4}{3}\pi r^3$ ima odvod $4\pi r^2$, zato je $\Delta V \approx 4\pi r^2 \Delta r = 4\pi \cdot 4 \cdot 0{,}02\,\mathrm{cm^3} \approx 1{,}0\,\mathrm{cm^3}$. Relativna napaka prostornine je trikratnik relativne napake polmera.

## Drugače: Korak za korakom s številkami

Izračunajmo diferenčne kvociente funkcije $f(x) = x^2$ v točki $x_0 = 3$ za vse manjše $h$.

1. $f(3) = 9$.
2. $h = 0{,}1$: $\frac{3{,}1^2 - 9}{0{,}1} = \frac{9{,}61 - 9}{0{,}1} = 6{,}1$.
3. $h = 0{,}01$: $\frac{3{,}01^2 - 9}{0{,}01} = \frac{9{,}0601 - 9}{0{,}01} = 6{,}01$.
4. $h = 0{,}001$: $\frac{3{,}001^2 - 9}{0{,}001} = \frac{9{,}006001 - 9}{0{,}001} = 6{,}001$.
5. **Vzorec.** Kvocient je $6 + h$. Splošno: $\frac{(3 + h)^2 - 9}{h} = \frac{6h + h^2}{h} = 6 + h \to 6$.
6. **S pravilom:** $f'(x) = 2x$, $f'(3) = 6$.

Enako za verižno pravilo: odvajajmo $h(x) = \sqrt{1 + x^2}$ v $x = 1$.

1. Notranja funkcija $u = 1 + x^2$, $u' = 2x$; pri $x = 1$ je $u = 2$, $u' = 2$.
2. Zunanja $\sqrt{u}$ ima odvod $\frac{1}{2\sqrt{u}}$; pri $u = 2$ je to $\frac{1}{2\sqrt{2}} \approx 0{,}354$.
3. Produkt: $h'(1) = \frac{1}{2\sqrt{2}} \cdot 2 = \frac{1}{\sqrt{2}} \approx 0{,}707$.

## Drugače: Bolj natančno

**Natančen dokaz verižnega pravila.** Z $o(h)$ označimo izraz, za katerega $\frac{o(h)}{h} \to 0$, ko $h \to 0$. Odvedljivost $g$ v $x$ pomeni $g(x + h) = g(x) + g'(x)h + o(h)$, odvedljivost $f$ v $u = g(x)$ pa $f(u + k) = f(u) + f'(u)k + o(k)$. Vstavimo $k = g(x + h) - g(x) = g'(x)h + o(h)$ in dobimo $f(g(x + h)) = f(g(x)) + f'(g(x))g'(x)h + o(h)$. Natančna izpeljava s pomožno funkcijo $\varphi(k) = \frac{f(u + k) - f(u)}{k}$ za $k \neq 0$ in $\varphi(0) = f'(u)$ se izogne deljenju z ničlo, kadar je $g(x + h) = g(x)$.

**Odvod ni nujno zvezen.** Funkcija $f(x) = x^2\sin\frac{1}{x}$ za $x \neq 0$ in $f(0) = 0$ je odvedljiva povsod: v $0$ je $\left|\frac{f(h)}{h}\right| = \left|h\sin\frac{1}{h}\right| \le |h| \to 0$, torej $f'(0) = 0$. Za $x \neq 0$ pa je $f'(x) = 2x\sin\frac{1}{x} - \cos\frac{1}{x}$, ki za $x \to 0$ nima limite. Odvedljiva funkcija ima torej lahko nezvezen odvod.

**Diferenciabilnost.** Ekvivalentno: $f$ je odvedljiva v $x_0$, če obstaja število $A$, da je $f(x_0 + h) = f(x_0) + Ah + o(h)$, kjer $\frac{o(h)}{h} \to 0$. Ta zapis (najboljši linearni približek) se posploši na funkcije več spremenljivk.

## Preveri se

? Koliko je odvod funkcije $f(x) = (x^3 + 2)^4$?
- $4(x^3 + 2)^3$
~ Manjka odvod notranje funkcije $3x^2$.
+ $12x^2(x^3 + 2)^3$
- $3x^2(x^3 + 2)^4$
~ Eksponent se pri odvajanju zmanjša na $3$, faktor $4$ pa preide pred oklepaj.
> Verižno pravilo: $4(x^3 + 2)^3 \cdot 3x^2 = 12x^2(x^3 + 2)^3$. Prvi odgovor pozabi na odvod notranje funkcije.

? Kolikšen je smerni koeficient tangente na graf $f(x) = e^{2x}$ v točki $x_0 = 0$?
+ $2$
- $1$
~ To je vrednost $f(0) = e^0$, ne naklon.
- $e^2$
~ To je $f(1)$; v odvod $2e^{2x}$ vstavi $x_0 = 0$.
> $f'(x) = 2e^{2x}$, zato je $f'(0) = 2 \cdot 1 = 2$.

? Katera funkcija je v $x = 0$ zvezna, a ni odvedljiva?
+ $f(x) = |x|$
- $f(x) = x^2$
~ Odvedljiva je povsod, $f'(0) = 0$.
- $f(x) = \sin x$
~ Odvedljiva je povsod, $f'(0) = \cos 0 = 1$.
> Pri $|x|$ sta leva in desna limita diferenčnega kvocienta $-1$ in $1$, zato odvod v $0$ ne obstaja. Drugi dve funkciji sta odvedljivi povsod.

? Koliko je odvod funkcije $f(x) = \ln(x^2 + 1)$ v točki $x = 1$?
+ $1$
- $\frac{1}{2}$
~ Pozabljen je odvod notranje funkcije $2x$.
- $\ln 2$
~ To je vrednost $f(1)$, ne odvod.
> $f'(x) = \frac{2x}{x^2 + 1}$, zato je $f'(1) = \frac{2}{2} = 1$. Odgovor $\frac{1}{2}$ dobiš, če pozabiš na odvod notranje funkcije $2x$.

:::simboli
f | odvedljiva funkcija | | |
f' | odvod funkcije f | f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h} | | smerni koeficient tangente v x₀
h' | odvod sestavljene funkcije h(x) = f(g(x)) | h'(x) = f'(g(x)) \cdot g'(x) | | verižno pravilo
x_0 | točka, v kateri odvajamo (dotikališče) | | |
h | prirastek neodvisne spremenljivke | | | h → 0; v verižnem pravilu h(x) = f(g(x))
x | neodvisna spremenljivka | | |
g | druga (notranja) funkcija | | | pri verižnem pravilu notranja funkcija
y | ordinata točke na tangenti oziroma normali | | |
u, v | odvedljivi funkciji v pravilu za produkt in kvocient | | | pri kvocientu v ≠ 0
\alpha | kot med tangento in osjo x | \tan\alpha = f'(x_0) | |
:::
