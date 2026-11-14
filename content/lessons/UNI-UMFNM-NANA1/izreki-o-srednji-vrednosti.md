---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Sošolec Miha trdi: »Vesoljska sonda je v dveh urah preletela $36\,000\,\mathrm{km}$. Povprečna hitrost je bila $5\,\mathrm{km/s}$, a to še ne pomeni, da je kdaj letela *natanko* $5\,\mathrm{km/s}$. Morda je bila ves čas malo hitrejša ali malo počasnejša.«

Zveni smiselno, a ni res. Če se lega sonde spreminja gladko (je odvedljiva funkcija časa), je v vsaj enem trenutku trenutna hitrost točno enaka povprečni. To zagotavlja **Lagrangeov izrek o srednji vrednosti**. Z njim iz podatkov na krajiščih intervala sklepamo o odvodu nekje vmes.

Iz Lagrangeovega izreka sledi, da je funkcija z odvodom $0$ konstantna, da pozitiven odvod pomeni naraščanje, in iz njega dobimo ocene napak pri meritvah. Na koncu dodamo še dve orodji, ki ju potrebuješ v nadaljevanju: **diferencial** in **višje odvode**.

## Razlaga

Gradimo po kosih. Za vsakim kosom je kratko vprašanje v eni vrstici; odgovori nanj, preden bereš naprej.

**Kos 1: v vrhu je tangenta vodoravna.** Funkcija $f$ ima v notranji točki $c$ **lokalni maksimum**, če je $f(x) \le f(c)$ za vse $x$ blizu $c$. Če je $f$ v $c$ odvedljiva, je $f'(c) = 0$. Razlog: levo od $c$ je diferenčni količnik $\frac{f(x)-f(c)}{x-c} \ge 0$, desno $\le 0$; limita obeh je ista številka $f'(c)$, torej $0$. Enako velja za lokalni minimum (Fermatov izrek).

*Preveri:* ali iz $f'(c) = 0$ sledi, da je v $c$ ekstrem? *Ne: $f(x) = x^3$ ima $f'(0) = 0$, a v $0$ samo naraste skozi vodoravno tangento.*

**Kos 2: Rollov izrek.** Naj bo $f$ zvezna na zaprtem intervalu $[a,b]$, odvedljiva na odprtem $(a,b)$ in naj velja $f(a) = f(b)$. Potem obstaja $\xi \in (a,b)$, da je $f'(\xi) = 0$.

Slika v besedah: kamen, vržen navpično navzgor na Luni, pristane na isti višini, s katere je odletel. Nekje vmes je moral za trenutek mirovati, v najvišji točki. Tam je hitrost (odvod višine) enaka $0$.

*Preveri:* $f(x) = |x|$ na $[-1,1]$ ima $f(-1) = f(1)$. Zakaj Rolle tu ne velja? *Ker $f$ v $0$ ni odvedljiva; odvod je le $\pm 1$.*

:::premisli
Ali Rollov izrek pove, *koliko* je točk $\xi$ in kje ležijo? Napovej za $f(x) = \sin x$ na $[0, 4\pi]$.
---
Ne. Izrek zagotavlja vsaj eno točko, lahko jih je več. Za $\sin x$ na $[0,4\pi]$ so štiri: $\frac{\pi}{2}, \frac{3\pi}{2}, \frac{5\pi}{2}, \frac{7\pi}{2}$. Kje ležijo, moramo izračunati sami iz $f'(\xi) = 0$.
:::

**Kos 3: Lagrangeov izrek.** Odpravimo pogoj $f(a) = f(b)$. Naj bo $f$ zvezna na $[a,b]$ in odvedljiva na $(a,b)$. Potem obstaja $\xi \in (a,b)$, da je

$$\frac{f(b)-f(a)}{b-a} = f'(\xi).$$

Levo je naklon **sekante** skozi točki $(a, f(a))$ in $(b, f(b))$, desno naklon **tangente** v $\xi$. Izrek torej pravi: nekje vmes je tangenta vzporedna sekanti. Rollov izrek je poseben primer, ko je sekanta vodoravna.

Za Mihovo sondo: $s(t)$ je prepotovana pot v km, $t$ čas v s. Povprečna hitrost je $\frac{36\,000}{7200} = 5\,\mathrm{km/s}$, zato obstaja trenutek $\xi$ z $s'(\xi) = 5\,\mathrm{km/s}$. Miha nima prav.

*Preveri:* za $f(x) = x^3$ na $[0,3]$ je naklon sekante $9$. Kje je $\xi$? *Iz $3\xi^2 = 9$ sledi $\xi = \sqrt 3 \approx 1{,}73$, ne sredina $1{,}5$.*

**Kos 4: kaj iz tega sledi.** Lagrangeov izrek zapišemo kot $f(y) - f(x) = f'(\xi)(y - x)$ za neki $\xi$ med $x$ in $y$. Od tod takoj sledi tabela spodaj. Na primer pri $f' > 0$ in $y > x$ sta oba faktorja $f'(\xi)$ in $y - x$ pozitivna, zato je $f(y) > f(x)$.

| Kaj vemo o $f'$ na intervalu | Kaj sledi za $f$ |
|---|---|
| $f'(x) = 0$ povsod | $f$ je konstantna |
| $f'(x) > 0$ povsod | $f$ strogo narašča |
| $f'(x) < 0$ povsod | $f$ strogo pada |
| $\lvert f'(x)\rvert \le M$ povsod | $\lvert f(y) - f(x)\rvert \le M\lvert y - x\rvert$ |

Zadnja vrstica je **ocena z odvodom**. Primer: ker je $|\cos x| \le 1$, velja $|\sin y - \sin x| \le |y - x|$ za vse $x, y$.

*Preveri:* če je $f' = g'$ na intervalu, kaj velja za $f$ in $g$? *Razlikujeta se za konstanto, ker je $(f-g)' = 0$.*

**Kos 5: diferencial.** Ko se $x$ spremeni za majhen $\Delta x$, se $f$ spremeni za $\Delta f = f(x+\Delta x) - f(x)$. Tangenta to spremembo napove kot

$$\mathrm{d}f = f'(x)\,\mathrm{d}x, \qquad \mathrm{d}x = \Delta x.$$

Izrazu $\mathrm{d}f$ pravimo **diferencial** funkcije $f$ v točki $x$. To je sprememba, ki bi jo dobili, če bi se gibali po tangenti namesto po grafu. Za majhne $\Delta x$ velja $\Delta f \approx \mathrm{d}f$, napaka pa gre proti $0$ hitreje kot $\Delta x$.

*Preveri:* oceni $\sqrt{4{,}1}$ z diferencialom $\sqrt x$ v $x = 4$. *$\mathrm{d}f = \frac{1}{2\sqrt 4}\cdot 0{,}1 = 0{,}025$, torej $\sqrt{4{,}1} \approx 2{,}025$; točno je $2{,}0248\ldots$*

**Kos 6: višji odvodi.** Če je odvod $f'$ spet odvedljiva funkcija, je njen odvod **drugi odvod** $f'' = (f')'$. Naprej $f''' = (f'')'$, splošno $f^{(n)} = \big(f^{(n-1)}\big)'$. Pri gibanju je $s'$ hitrost, $s''$ pa pospešek. Predznak $f''$ pove, ali $f'$ narašča ali pada, torej kako se graf ukrivlja.

:::premisli
Za $f(x) = x^4$ izračunaj $f^{(4)}$ in $f^{(5)}$. Kaj velja za odvode polinoma stopnje $n$ od reda $n+1$ naprej, in zakaj?
---
$f' = 4x^3$, $f'' = 12x^2$, $f''' = 24x$, $f^{(4)} = 24$, $f^{(5)} = 0$. Vsak odvod zniža stopnjo za $1$. Po $n$ odvodih ostane konstanta $n!\cdot a_n$, naslednji odvod je $0$, in vsi nadaljnji tudi.
:::

## Rešeni primeri

### Primer 1 (lažji): kamen na Luni

Astronavt na Luni vrže kamen navpično navzgor z začetno hitrostjo $8{,}1\,\mathrm{m/s}$. Težni pospešek na Luni je $1{,}62\,\mathrm{m/s^2}$, zato je višina $h(t) = 8{,}1\,t - 0{,}81\,t^2$ (v m, $t$ v s). Kamen pade nazaj na začetno višino ob $t = 10\,\mathrm{s}$. Poišči trenutek, ki ga zagotavlja Rollov izrek, in višino kamna v tem trenutku.

**Podatki:** $h(t) = 8{,}1\,t - 0{,}81\,t^2$, $v_0 = 8{,}1\,\mathrm{m/s}$, $g = 1{,}62\,\mathrm{m/s^2}$, interval $[0, 10]\,\mathrm{s}$, $h(0) = h(10) = 0$
**Iščemo:** $\xi \in (0,10)$ z $h'(\xi) = 0$ in višino $h(\xi)$

:::formula
Rollov izrek: $f$ zvezna na $[a,b]$, odvedljiva na $(a,b)$, $f(a) = f(b)$ $\Rightarrow$ obstaja $\xi \in (a,b)$, $f'(\xi) = 0$.
:::

**Rešitev:**

1. Pogoji: $h$ je polinom, torej zvezen in odvedljiv povsod; $h(10) = 81 - 81 = 0 = h(0)$.
2. Odvod: $h'(t) = 8{,}1 - 1{,}62\,t$.
3. Iz $h'(\xi) = 0$ dobimo $\xi = \dfrac{8{,}1}{1{,}62} = 5\,\mathrm{s}$, kar leži v $(0,10)$.
4. Višina: $h(5) = 40{,}5 - 20{,}25 = 20{,}25\,\mathrm{m}$.
5. Odgovor: ob $t = 5\,\mathrm{s}$ kamen miruje v najvišji točki, $20{,}25\,\mathrm{m}$ nad točko meta.

### Primer 2: napaka prostornine Lune

Polmer Lune izmerimo kot $r = 1737\,\mathrm{km}$ z negotovostjo $\pm 2\,\mathrm{km}$. Z diferencialom oceni, za koliko se lahko zmoti izračunana prostornina, in relativno napako.

**Podatki:** $r = 1737\,\mathrm{km}$, $\mathrm{d}r = 2\,\mathrm{km}$, $V(r) = \frac{4}{3}\pi r^3$
**Iščemo:** $\mathrm{d}V$ in $\dfrac{\mathrm{d}V}{V}$

:::formula
$\mathrm{d}V = V'(r)\,\mathrm{d}r = 4\pi r^2\,\mathrm{d}r$, $\quad \dfrac{\mathrm{d}V}{V} = \dfrac{3\,\mathrm{d}r}{r}$
:::

**Rešitev:**

1. Odvod: $V'(r) = 4\pi r^2$, to je površina krogle.
2. Diferencial: $\mathrm{d}V = 4\pi \cdot 1737^2 \cdot 2 \approx 7{,}58\cdot 10^{7}\,\mathrm{km^3}$.
3. Prostornina: $V \approx 2{,}20 \cdot 10^{10}\,\mathrm{km^3}$.
4. Relativno: $\dfrac{\mathrm{d}V}{V} = \dfrac{3 \cdot 2}{1737} \approx 0{,}0035$, ker se $\pi$ in $r^2$ okrajšata.
5. Odgovor: prostornina je negotova za približno $7{,}6\cdot 10^7\,\mathrm{km^3}$, kar je $0{,}35\,\%$; relativna napaka prostornine je trikrat večja od relativne napake polmera.

### Primer 3 (težji): najkrajši čas do ubežne hitrosti

Sonda ima hitrost $3\,\mathrm{km/s}$. Motor ji lahko da pospešek največ $40\,\mathrm{m/s^2}$. Koliko časa najmanj potrebuje, da doseže ubežno hitrost Zemlje $11{,}2\,\mathrm{km/s}$? Hitrost $v(t)$ je odvedljiva.

**Podatki:** $v(0) = 3000\,\mathrm{m/s}$, $v(T) = 11\,200\,\mathrm{m/s}$, $|v'(t)| \le 40\,\mathrm{m/s^2}$
**Iščemo:** najmanjši možni $T$

:::formula
Lagrange za $v$ na $[0,T]$: $v(T) - v(0) = v'(\xi)\,T$, in $v' = s''$ je pospešek.
:::

**Rešitev:**

1. Pospešek je drugi odvod lege, torej prvi odvod hitrosti, zato Lagrangeov izrek uporabimo za $v$.
2. Obstaja $\xi \in (0,T)$: $11\,200 - 3000 = v'(\xi)\,T$, torej $8200 = v'(\xi)\,T$.
3. Ker je $v'(\xi) \le 40$, je $8200 \le 40\,T$.
4. Od tod $T \ge \dfrac{8200}{40} = 205\,\mathrm{s}$.
5. Odgovor: potrebuje vsaj $205\,\mathrm{s}$, malo manj kot $3{,}5$ minute; manj ne gre pri nobenem načinu pospeševanja.

### Primer 4 – zdaj ti: višji odvodi

Za $f(x) = x\,e^{x}$ poišči $f^{(5)}(0)$.

**Podatki:** $f(x) = x\,e^{x}$, red odvoda $5$, točka $x = 0$
**Iščemo:** $f^{(5)}(0)$

:::formula
Pravilo za produkt: $(uv)' = u'v + uv'$; $(e^x)' = e^x$
:::

**Rešitev:**

1. $f'(x) = e^x + x e^x = (x+1)\,e^x$.
2. $f''(x) = e^x + (x+1)\,e^x = (x+2)\,e^x$.
3. Vsak odvod prišteje $1$ v oklepaju. Zapiši $f^{(5)}$ in vstavi $x = 0$:

:::premisli
Koliko je $f^{(5)}(0)$?
---
$f^{(5)}(x) = (x+5)\,e^x$, zato $f^{(5)}(0) = 5 \cdot e^0 = 5$. Formulo $f^{(n)}(x) = (x+n)\,e^x$ dokažeš z indukcijo.
:::

## Pogoste napake

- **Izrek brez preverjenih pogojev.** »$|x|$ ima v krajiščih intervala $[-1,1]$ enaki vrednosti, torej je nekje $f' = 0$.« Napačno, ker $|x|$ v $0$ ni odvedljiva. Pred uporabo vedno preveri zveznost na $[a,b]$ in odvedljivost na $(a,b)$.
- **$\xi$ je sredina intervala.** Izrek pove le, da $\xi$ obstaja. Za $x^3$ na $[0,3]$ je $\xi = \sqrt 3$, ne $1{,}5$. Točko izračunaš iz enačbe $f'(\xi) = \frac{f(b)-f(a)}{b-a}$.
- **$f'(c) = 0$ pomeni ekstrem.** Velja le obrat. Pri $x^3$ v $0$ je odvod $0$, ekstrema ni. Ničla odvoda je le kandidat.
- **Diferencial je točna sprememba.** $\mathrm{d}f$ je sprememba po tangenti, $\Delta f$ po grafu. Za $x^2$ v $3$ pri $\mathrm{d}x = 0{,}1$ je $\mathrm{d}f = 0{,}6$, $\Delta f = 0{,}61$. Pri majhnih $\mathrm{d}x$ sta blizu, enaka pa nista.
- **$f''$ zamenjaš s $(f')^2$.** Drugi odvod je odvod odvoda, ne kvadrat. Za $f = x^3$ je $f'' = 6x$, $(f')^2 = 9x^4$.

## Povzetek

- Fermat: v notranjem lokalnem ekstremu odvedljive funkcije je $f'(c) = 0$.
- Rolle: $f$ zvezna na $[a,b]$, odvedljiva na $(a,b)$, $f(a) = f(b)$ $\Rightarrow$ $f'(\xi) = 0$ za neki $\xi \in (a,b)$.
- Lagrange: pri istih pogojih brez $f(a) = f(b)$ obstaja $\xi$ z $f'(\xi) = \frac{f(b)-f(a)}{b-a}$ (tangenta vzporedna sekanti).
- Posledice: $f' = 0 \Rightarrow$ konstanta; $f' > 0 \Rightarrow$ narašča; $|f'| \le M \Rightarrow |f(y)-f(x)| \le M|y-x|$.
- Diferencial $\mathrm{d}f = f'(x)\,\mathrm{d}x$ je linearni približek spremembe $\Delta f$.
- Višji odvodi: $f^{(n)} = (f^{(n-1)})'$; $s''$ je pospešek.

## Drugače: Na sliki

Nariši graf $f$ na $[a,b]$ in poveži krajišča z ravnilom; to je sekanta. Zdaj ravnilo vzporedno premikaj navzgor ali navzdol, ne da bi ga zasukal. Ko se ga graf zadnjič še dotika, se ga dotakne v točki $\xi$: tam je ravnilo tangenta.

```
          tangenta v ξ (ravnilo, premaknjeno)
        ______•______
       /      ξ      \__
      •- - - - - - - - - -•
      a    sekanta        b
```

Zgoraj: črtkana sekanta in nad njo ista smer, ki se grafa dotakne v $\xi$.

Pri Rollovem izreku je ravnilo vodoravno, zato je tudi tangenta v $\xi$ vodoravna: to je vrh ali dno grafa.

Diferencial na isti sliki: od točke $x$ se po tangenti premakneš za $\mathrm{d}x$ v desno; dvig po tangenti je $\mathrm{d}f$, dvig po grafu je $\Delta f$. Razlika med njima je majhna reža med tangento in grafom.

## Drugače: Bolj natančno

**Dokaz Rollovega izreka.** Zvezna funkcija na zaprtem intervalu doseže maksimum $M$ in minimum $m$. Če je $M = m$, je $f$ konstantna in $f' = 0$ povsod. Sicer se vsaj ena od vrednosti $M, m$ razlikuje od $f(a) = f(b)$, zato je dosežena v notranji točki $\xi$. Po Fermatovem izreku je $f'(\xi) = 0$.

**Dokaz Lagrangeovega izreka.** Naj bo $k = \frac{f(b)-f(a)}{b-a}$ in

$$g(x) = f(x) - f(a) - k\,(x-a).$$

Funkcija $g$ je zvezna na $[a,b]$, odvedljiva na $(a,b)$, $g(a) = g(b) = 0$. Po Rollu obstaja $\xi$ z $g'(\xi) = f'(\xi) - k = 0$.

**Cauchyjev izrek.** Za $f, g$ zvezni na $[a,b]$, odvedljivi na $(a,b)$, obstaja $\xi \in (a,b)$, da je

$$\big(f(b)-f(a)\big)\,g'(\xi) = \big(g(b)-g(a)\big)\,f'(\xi).$$

Dokaz: Rolle za $h = \big(f(b)-f(a)\big)g - \big(g(b)-g(a)\big)f$. Lagrange je primer $g(x) = x$.

**Diferenciabilnost.** $f$ je odvedljiva v $x$ natanko tedaj, ko obstaja število $A$, da je $f(x+h) = f(x) + A h + o(h)$, kjer $\frac{o(h)}{h} \to 0$. Takrat je $A = f'(x)$, linearna preslikava $h \mapsto f'(x)h$ pa je diferencial $\mathrm{d}f$.

**Leibnizova formula** za višje odvode produkta:

$$(fg)^{(n)} = \sum_{k=0}^{n} \binom{n}{k} f^{(k)} g^{(n-k)}.$$

Za $x\,e^x$ sta neničelna le člena s $k = 0, 1$: $(x e^x)^{(n)} = x e^x + n e^x$.

## Preveri se

? Katera trditev je pravilna?
- Če je $f(a) = f(b)$, ima $f$ na $(a,b)$ točko z $f'(\xi) = 0$.
~ Manjka pogoj odvedljivosti (in zveznosti). Protiprimer: $|x|$ na $[-1,1]$.
+ Če je $f$ zvezna na $[a,b]$, odvedljiva na $(a,b)$ in $f(a) = f(b)$, obstaja $\xi \in (a,b)$ z $f'(\xi) = 0$.
- Če je $f'(c) = 0$, ima $f$ v $c$ lokalni ekstrem.
~ To je obrat Fermatovega izreka, ki ne velja: $x^3$ v $0$.
- Točka $\xi$ iz Rollovega izreka je vedno sredina intervala.
~ Izrek zagotavlja obstoj, ne lege. Lego dobiš iz enačbe $f'(\xi) = 0$.
> To je Rollov izrek s popolnimi pogoji.

? Za $f(x) = x^2$ na $[1,5]$ poišči točko $\xi$ iz Lagrangeovega izreka.
- $\xi = 6$
~ $6$ je naklon sekante, torej vrednost $f'(\xi)$, ne $\xi$. Reši še $2\xi = 6$.
+ $\xi = 3$
- $\xi = 12$
~ Pozabil si deliti z dolžino intervala $b - a = 4$: naklon je $\frac{24}{4} = 6$, ne $24$.
> Naklon sekante je $\frac{25 - 1}{5 - 1} = 6$, iz $f'(\xi) = 2\xi = 6$ sledi $\xi = 3$.

? Rešitev: »$f(x) = \frac{1}{x}$ na $[-1,1]$: naklon sekante je $\frac{1-(-1)}{2} = 1$, a $f'(x) = -\frac{1}{x^2} < 0$ nikoli ni $1$. Lagrangeov izrek torej ne drži.« Kje je napaka?
- Naklon sekante je napačno izračunan.
~ Naklon je pravilen: $\frac{f(1)-f(-1)}{1-(-1)} = \frac{2}{2} = 1$.
- Odvod $\frac{1}{x}$ je napačen.
~ Odvod je pravilen, $-\frac{1}{x^2}$.
+ Funkcija v $0$ ni definirana, zato ni zvezna na $[-1,1]$ in izreka ne smemo uporabiti.
> Izrek drži; tu ni izpolnjen pogoj zveznosti na zaprtem intervalu, zato o $\xi$ ne pove ničesar.

? Za $f(x) = x^2$ v $x = 3$ pri $\mathrm{d}x = 0{,}1$ primerjaj $\Delta f$ in $\mathrm{d}f$.
- $\Delta f = \mathrm{d}f$
~ Diferencial je sprememba po tangenti, ne po grafu; enaka sta le pri linearnih funkcijah.
- $\Delta f < \mathrm{d}f$
~ Graf $x^2$ leži nad tangento, zato po grafu narasteš več kot po tangenti.
+ $\Delta f > \mathrm{d}f$
> $\mathrm{d}f = 2\cdot 3\cdot 0{,}1 = 0{,}6$, $\Delta f = 3{,}1^2 - 9 = 0{,}61$. Razlika je $(\mathrm{d}x)^2 = 0{,}01$.

? Kamera za sekcijsko merjenje hitrosti zabeleži, da je avto $30\,\mathrm{km}$ prevozil v $15$ minutah. Kaj lahko sklepamo?
- Nič, ker kamera ne meri trenutne hitrosti.
~ Lagrangeov izrek iz povprečja sklepa o trenutni hitrosti: vsaj enkrat je bila enaka povprečni.
- Avto je ves čas vozil $120\,\mathrm{km/h}$.
~ Povprečje ne pomeni stalne hitrosti; vmes je lahko vozil hitreje in počasneje.
+ V vsaj enem trenutku je vozil natanko $120\,\mathrm{km/h}$.
> Povprečna hitrost je $\frac{30\,\mathrm{km}}{0{,}25\,\mathrm{h}} = 120\,\mathrm{km/h}$; ker je lega odvedljiva funkcija časa, po Lagrangeu obstaja trenutek s to hitrostjo.

:::simboli
f | funkcija, zvezna na [a, b], odvedljiva na (a, b)
f' | odvod funkcije f
a, b | krajišči intervala
\xi | vmesna točka na (a, b) | | | točk ξ je lahko več
x | neodvisna spremenljivka | | | dx = Δx je njen prirastek
g | pomožna funkcija v dokazu | g(x) = f(x) - f(a) - k\,(x-a) | | pri Cauchyjevem izreku druga funkcija; v Primeru 1 težni pospešek na Luni
g' | odvod funkcije g
k | naklon sekante skozi krajišči | k = \frac{f(b)-f(a)}{b-a} | | v Leibnizovi formuli indeks vsote
n | red odvoda
V | prostornina krogle | V(r) = \frac{4}{3}\pi r^3 | km^3
V' | odvod prostornine po polmeru | V'(r) = 4\pi r^2 | km^2 | enak površini krogle
r | polmer Lune | | km | dr = 2 km je negotovost
v | hitrost sonde | | m/s | v (uv)' = u'v + uv' druga funkcija
v' | pospešek sonde | v' = s'' | m/s^2
s'' | drugi odvod poti (pospešek) | | m/s^2
T | čas pospeševanja | | s
u | funkcija v pravilu za odvod produkta
u' | odvod funkcije u
e | Eulerjevo število | | | e ≈ 2,718
:::
