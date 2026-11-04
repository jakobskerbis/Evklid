---
naslov: Ko je vrstni red pomemben
simulacija: kombinatorika
moznosti: {"mode": "izbor"}
trajanje: 1:35
avtor: AI
stanje: pregledano
---

## 0:00

Iz črk A, B, C, D izberemo $2$ in pomembno je, katera je prva. Na prvo mesto damo eno od $4$ črk, na drugo eno od preostalih $3$: izidov je $4 \cdot 3 = 12$.

- nastavi: n (vseh) = 4
- nastavi: k (izberemo) = 2

## 0:14

Poišči AB in BA v prvi vrsti: ker je obkljukano »vrstni red je pomemben«, sta to dva različna izida. To so variacije brez ponavljanja, $V_4^2 = 12$.

## 0:26

Izberimo $3$ črke. Za tretje mesto ostaneta le še $2$ črki, zato je izidov $4 \cdot 3 \cdot 2 = 24$.

- nastavi: k (izberemo) = 3

## 0:38

Ko razvrstimo vse $4$ črke, dobimo permutacije: $P_4 = 4! = 24$. Za zadnje mesto ostane ena sama črka, zato se število ne spremeni.

- nastavi: k (izberemo) = 4

## 0:52

Vzemimo $5$ črk in izberimo $3$: variacij je $5 \cdot 4 \cdot 3 = 60$. Poišči na seznamu vse razporeditve črk A, B in C: našel jih boš $3! = 6$.

- nastavi: n (vseh) = 5
- nastavi: k (izberemo) = 3

## 1:06

Odkljukajmo »vrstni red je pomemben«. Šest razporeditev črk A, B, C je zdaj en sam izbor ABC. Tako je z vsakim izborom, zato ostane le $\frac{60}{3!} = 10$ kombinacij.

- klikni: vrstni red je pomemben

## 1:20

Pravilo: $V_n^k = \frac{n!}{(n-k)!}$, za $k = n$ pa $P_n = n!$. Če vrstni red ni pomemben, vsak izbor štejemo $k!$-krat, zato je $C_n^k = \frac{V_n^k}{k!}$.
