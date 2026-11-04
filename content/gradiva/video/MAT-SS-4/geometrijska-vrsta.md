---
naslov: Neskončno kosov, končna vsota
simulacija: vrsta
trajanje: 1:20
avtor: AI
stanje: pregledano
---

## 0:00

Vrsta $1 + 0{,}5 + 0{,}25 + \dots$ ima $a_1 = 1$ in $q = 0{,}5$: vsak kos traku je pol prejšnjega. Prvi trije kosi dajo delno vsoto $S_3 = 1{,}75$, to je višina tretjega stolpca.

- nastavi: a₁ = 1
- nastavi: q = 0.5
- nastavi: n (členov) = 3

## 0:14

Pri šestih členih je $S_6 \approx 1{,}97$. Opazuj trak: vsak nov kos pokrije polovico dela, ki do $2$ še manjka.

- nastavi: n (členov) = 6

## 0:26

Pri $20$ členih stolpci skoraj sežejo do rdeče črtkane črte, zaokroženo je $S_{20} = 2$. Nobena delna vsota števila $2$ ne doseže, a zaporedje delnih vsot ima limito $S = \frac{a_1}{1 - q} = 2$.

- nastavi: n (členov) = 20

## 0:40

Pri $q = -0{,}5$ se predznaki členov izmenjujejo. Stolpci delnih vsot skačejo nad in pod rdečo črto, vsoto $S = \frac{1}{1 + 0{,}5} = \frac{2}{3}$.

- nastavi: q = -0.5
- nastavi: n (členov) = 6

## 0:54

Pri $q = 1{,}1$ je $|q| > 1$: členi rastejo, $S_{20} \approx 57{,}3$. Stolpci delnih vsot rastejo čez vse meje, zato vrsta divergira in vsote nima.

- nastavi: q = 1.1
- nastavi: n (členov) = 20

## 1:08

Pravilo: geometrijska vrsta konvergira natanko tedaj, ko je $|q| < 1$, in takrat je $S = \frac{a_1}{1 - q}$. Pri $|q| \ge 1$ te formule ne smemo uporabiti.
