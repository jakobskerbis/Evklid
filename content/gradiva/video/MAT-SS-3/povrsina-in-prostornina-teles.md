---
naslov: Piramida je tretjina prizme
simulacija: telesa
moznosti: {"bodies": ["prizma", "valj", "piramida", "stozec", "krogla"]}
trajanje: 1:40
avtor: AI
stanje: osnutek
---

## 0:00

Pravilna štiristrana prizma ima osnovni rob $a = 3$ in višino $v = 4$. Osnovna ploskev je kvadrat s ploščino $9$, zato je prostornina $V = 9 \cdot 4 = 36$.

- nastavi: telo = prizma
- nastavi: n (oglišča osnove) = 4
- nastavi: a = 3
- nastavi: v = 4

## 0:14

Zamenjajmo jo s pravilno piramido z enako osnovo in višino. Opazuj prostornino: $V = \dfrac{9 \cdot 4}{3} = 12$, natanko tretjina prostornine prizme.

- nastavi: telo = piramida

## 0:28

Enako velja za okrogla telesa. Valj s polmerom $r = 2$ in višino $v = 4$ ima prostornino $V = \pi r^2 v \approx 50{,}27$.

- nastavi: telo = valj
- nastavi: r = 2
- nastavi: v = 4

## 0:40

Stožec z enakim $r$ in $v$ ima prostornino $V = \dfrac{\pi r^2 v}{3} \approx 16{,}76$, spet tretjino prostornine valja.

- nastavi: telo = stozec
- nastavi: r = 2
- nastavi: v = 4

## 0:52

Prikažimo mrežo stožca: osnovna ploskev je krog, plašč krožni izsek s polmerom $s = \sqrt{r^2 + v^2} \approx 4{,}47$. Ploščina mreže je površina, $P = \pi r(r + s) \approx 40{,}67$.

- klikni: pokaži mrežo

## 1:06

Krogla s polmerom $r = 2$ nima mreže. Njena površina je $P = 4\pi r^2 \approx 50{,}27$, prostornina pa $V = \dfrac{4\pi r^3}{3} \approx 33{,}51$.

- klikni: pokaži mrežo
- nastavi: telo = krogla
- nastavi: r = 2

## 1:20

Pravilo: prizma in valj imata $V = S\,v$, piramida in stožec z enako osnovo in višino pa tretjino tega, $V = \dfrac{S\,v}{3}$. Površina je vsota ploščin vseh mejnih ploskev.
