---
avtor: AI
stanje: osnutek
---
- Poteki
  - $ZZN$, $ZNZ$, $NZZ$: vsak $0{,}8^2 \cdot 0{,}2$
  - znotraj poteka množimo, poteke seštejemo
- Pogoji
  - isti poskus $n$-krat, $p$ vsakič enaka
  - poskusi neodvisni; brez vračanja ne velja
- Bernoullijeva formula
  - $P_n(k) = \binom{n}{k}p^k q^{n-k}$, $q = 1 - p$
  - napaka: pozabljen $\binom{n}{k}$
- Vsaj en uspeh
  - $1 - q^n$, ne $n \cdot p$
- Vsaj in največ
  - nasprotje »vsaj $2$« je »največ $1$«
  - izberi krajšo vsoto
- Povezava z binomskim izrekom
  - $P_n(0) + \dots + P_n(n) = (q+p)^n = 1$
