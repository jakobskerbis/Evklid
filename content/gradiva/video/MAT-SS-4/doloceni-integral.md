---
naslov: Ploščina iz pravokotnikov
simulacija: integral
moznosti: {"mode": "doloceni"}
trajanje: 1:36
avtor: AI
stanje: pregledano
---

## 0:00

Ploščino pod grafom $f(x) = x^2$ med $a = 0$ in $b = 2$ ocenimo s $4$ pravokotniki. Višina vsakega je vrednost $f$ na levem robu, zato so pod grafom. Vsota je $1{,}75$.

- nastavi: funkcija = x2
- nastavi: a = 0
- nastavi: b = 2
- klikni: levo
- nastavi: število delov = 4

## 0:14

Razdelimo interval na $10$ delov. Vsota naraste na $2{,}28$. Opazuj, da so vrzeli med pravokotniki in grafom manjše.

- nastavi: število delov = 10

## 0:26

Pri $60$ delih je vsota $2{,}6004$, napaka le še $0{,}0663$. Pravokotniki skoraj povsem zapolnijo ploščino pod grafom.

- nastavi: število delov = 60

## 0:38

Zdaj vzemimo višino na desnem robu. Pravokotniki segajo malo nad graf, zato je vsota $2{,}7337$ malo prevelika. Prava ploščina je med $2{,}6004$ in $2{,}7337$.

- klikni: desno

## 0:52

Ko število delov narašča, se obe vsoti bližata isti limiti. To je določeni integral, izračunamo ga z Newton-Leibnizovo formulo: $\int_0^2 x^2\,dx = \left[\dfrac{x^3}{3}\right]_0^2 = \dfrac{8}{3} \approx 2{,}6667$.

## 1:06

Premaknimo zgornjo mejo na $b = 3$. Zdaj je $\int_0^3 x^2\,dx = \dfrac{27}{3} - 0 = 9$, vsota $60$ pravokotnikov na desnem robu pa je $9{,}2263$, spet malo prevelika.

- nastavi: b = 3

## 1:20

Pravilo: določeni integral $\int_a^b f(x)\,dx$ je limita vsot ploščin pravokotnikov pod grafom. Izračunamo ga kot $F(b) - F(a)$, kjer je $F$ primitivna funkcija za $f$.
