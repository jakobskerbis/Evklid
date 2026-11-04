---
naslov: Prištevamo ali množimo
simulacija: zaporedje
moznosti: {"mode": "ag"}
trajanje: 1:15
avtor: AI
stanje: pregledano
---

## 0:00

Aritmetično zaporedje z $a_1 = 1$ in $d = 2$: vsakemu členu prištejemo $2$. Opazuj, da točke ležijo na premici.

- klikni: aritmetično
- nastavi: a₁ = 1
- nastavi: d (razlika) = 2
- nastavi: n (členov) = 8

## 0:12

Zadnja točka je na višini $15$: od prvega do osmega člena je $7$ korakov, zato je $a_8 = 1 + 7 \cdot 2 = 15$. Vsota prvih osmih členov je $S_8 = 64$.

## 0:24

Zdaj vsak člen pomnožimo s $q = 2$. Točke ne ležijo več na premici: členi rastejo vse hitreje.

- klikni: geometrijsko
- nastavi: q (količnik) = 2

## 0:36

Zadnji dve točki sta že nad robom grafa. Spet je $7$ korakov: $a_8 = 1 \cdot 2^7 = 128$ namesto $15$, vsota pa je $S_8 = 255$.

## 0:50

Pri $a_1 = 4$ in $q = 0{,}5$ vsak člen razpolovimo. Ker je $|q| < 1$, se členi bližajo $0$: osmi člen je $a_8 = 4 \cdot 0{,}5^7 \approx 0{,}03$.

- nastavi: a₁ = 4
- nastavi: q (količnik) = 0.5

## 1:04

Pravilo: aritmetično $a_n = a_1 + (n-1)\,d$ (prištevamo), geometrijsko $a_n = a_1 \cdot q^{\,n-1}$ (množimo). Od $a_1$ do $a_n$ je vedno $n - 1$ korakov.
