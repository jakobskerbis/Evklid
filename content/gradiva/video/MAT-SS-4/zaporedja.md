---
naslov: Kaj pomeni limita zaporedja
simulacija: zaporedje
moznosti: {"mode": "splosno"}
trajanje: 1:30
avtor: AI
stanje: pregledano
---

## 0:00

Členi zaporedja $a_n = \frac{1}{n}$ padajo proti $0$. Senčeni pas je okolica števila $0$ s polmerom $\varepsilon = 0{,}2$. Opazuj, od katerega člena naprej so vse pike v pasu.

- nastavi: zaporedje = inv
- nastavi: ε (pas) = 0.2

## 0:14

Vijolične pike so členi od $n = 6$ naprej: vsi ležijo v pasu. Oranžnih je le prvih pet členov: $a_5 = 0{,}2$ leži ravno na robu pasu, zato ni v njem.

## 0:26

Zožimo pas na $\varepsilon = 0{,}1$. Oranžnih pik je več: vsi členi so v pasu šele od $n = 11$ naprej.

- nastavi: ε (pas) = 0.1

## 0:38

Pri $\varepsilon = 0{,}05$ je ta meja $n = 21$. Ožji pas zahteva kasnejši indeks, a tak indeks vedno obstaja.

- nastavi: ε (pas) = 0.05

## 0:50

Zaporedje $a_n = \frac{(-1)^n}{n}$ ni monotono, členi skačejo nad in pod $0$. Pri $\varepsilon = 0{,}1$ so vsi v pasu od $n = 11$ naprej, zato je tudi njegova limita $0$.

- nastavi: zaporedje = alt
- nastavi: ε (pas) = 0.1

## 1:04

Pri $a_n = (-1)^n$ členi ves čas skačejo med $-1$ in $1$. Ozek pas okoli kateregakoli števila ne zajame vseh členov od nekega indeksa naprej, zato to zaporedje limite nima in simulacija pasu ne nariše.

- nastavi: zaporedje = osc

## 1:18

Pravilo: $L$ je limita zaporedja, če v vsaki okolici $(L - \varepsilon, L + \varepsilon)$ ležijo vsi členi od nekega indeksa naprej. Manjši $\varepsilon$ pomeni kasnejši indeks.
