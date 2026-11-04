---
naslov: Presek in unija intervalov
simulacija: neenacba
moznosti: {"mode": "intervali"}
trajanje: 1:32
avtor: AI
stanje: pregledano
---

## 0:00

Interval $A = [-2, 3)$ vsebuje $-2$, števila $3$ pa ne. Interval $B = [1, 5]$ vsebuje obe krajišči. Presek $A \cap B = [1, 3)$ so števila, ki so v obeh intervalih hkrati.

- nastavi: A od = -2
- nastavi: A do = 3
- nastavi: B od = 1
- nastavi: B do = 5
- klikni: ∩

## 0:14

Unija so števila, ki so v vsaj enem intervalu: $A \cup B = [-2, 5]$. Krajišče $5$ je vključeno, ker ga vsebuje $B$.

- klikni: ∪

## 0:26

Premakni začetek $B$ na $4$: $B = [4, 5]$. Intervala se ne prekrivata, zato unija razpade na dva dela, $[-2, 3) \cup [4, 5]$.

- nastavi: B od = 4

## 0:39

Presek je zdaj prazna množica, $A \cap B = \emptyset$: intervala nimata nobenega skupnega števila.

- klikni: ∩

## 0:50

Premakni začetek $B$ na $3$. Intervala se dotikata v točki $3$, a presek je še vedno $\emptyset$: število $3$ je v $B$, v $A$ pa ne (okrogel oklepaj).

- nastavi: B od = 3

## 1:03

Unija pa je spet en sam interval, $A \cup B = [-2, 5]$, ker vrzel pri $3$ zapolni interval $B$.

- klikni: ∪

## 1:15

Pravilo: oba intervala nariši na isto premico. Presek je del, ki ga pokrijeta oba, unija vse, kar pokrije vsaj eden. Pri vsakem krajišču preveri, ali ga vsebuje interval, iz katerega izvira.
