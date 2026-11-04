---
naslov: Kako A, b, c in d spremenijo sinusoido
simulacija: graf
moznosti: {"preset": "sinus"}
trajanje: 1:28
avtor: AI
stanje: pregledano
---

## 0:00

Modri graf $f(x) = \sin x$ prekriva zeleni osnovni graf $y = \sin x$. Amplituda je $1$, osnovna perioda $2\pi$, zaloga vrednosti $[-1, 1]$.

- nastavi: A = 1
- nastavi: b = 1
- nastavi: c = 0
- nastavi: d = 0

## 0:12

Nastavimo $A = 2$. Modri graf se raztegne v smeri osi $y$: amplituda je $2$, zaloga vrednosti $[-2, 2]$. Ničle ostanejo tam, kjer jih ima zeleni graf.

- nastavi: A = 2

## 0:24

Zdaj nastavimo $b = 2$. Graf se stisne proti osi $y$, perioda je $\dfrac{2\pi}{2} = \pi$. Na intervalu dolžine $2\pi$ sta zdaj dva vala namesto enega.

- nastavi: b = 2

## 0:38

S $c = \dfrac{\pi}{4}$ se graf premakne v desno za $\dfrac{\pi}{4}$: vrh, ki je bil pri $\dfrac{\pi}{4}$, je zdaj pri $\dfrac{\pi}{2}$. Pozor: zapis $2\sin\big(2x - \frac{\pi}{2}\big)$ je isti graf, zato pred branjem premika izpostavi $b$.

- nastavi: c = 0,7854

## 0:52

Z $d = 1$ se cel graf dvigne za $1$: vrhovi so pri $3$, dna pri $-1$. Amplituda ostane $2$, zaloga vrednosti je $[1 - 2,\ 1 + 2] = [-1, 3]$.

- nastavi: d = 1

## 1:04

Pravilo: pri $f(x) = A\sin\big(b(x - c)\big) + d$ je amplituda $|A|$, perioda $T = \dfrac{2\pi}{|b|}$, graf je premaknjen za $c$ v desno in za $d$ navzgor, zaloga vrednosti je $[d - |A|,\ d + |A|]$.
