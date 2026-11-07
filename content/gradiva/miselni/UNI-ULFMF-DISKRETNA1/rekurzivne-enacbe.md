---
avtor: AI
stanje: osnutek
---

- Linearna rekurzija
  - $a_n = c_1a_{n-1} + \cdots + c_ka_{n-k} + f(n)$
  - $k$ začetnih vrednosti določi zaporedje
- Karakteristični polinom
  - $r^n$ je rešitev, če $p(r) = 0$
  - rešitve tvorijo prostor dimenzije $k$
- Različni koreni
  - $a_n = C_1r_1^n + C_2r_2^n$
  - tlakovanje: $t_n = t_{n-1} + t_{n-2}$
- Večkratni koren
  - dvojni koren da $r^n$ in $nr^n$
  - napaka: dvakrat isti $r^n$
- Nehomogena rekurzija
  - homogeni plus partikularni del
  - pri resonanci nastavek krat $n^m$
  - prvi red: negibna točka $b/(1-q)$
- Rodovne funkcije
  - $A(x) = \sum a_nx^n$
  - $\frac{1}{1-rx} = \sum r^nx^n$
  - parcialni ulomki, nato koeficienti
