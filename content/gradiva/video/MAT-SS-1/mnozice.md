---
naslov: Operacije z množicami v Vennovem diagramu
simulacija: venn
trajanje: 1:44
avtor: AI
stanje: osnutek
---

## 0:00

Univerzalna množica je $\mathcal{U} = \{1, 2, \dots, 20\}$. Naj bo $A$ množica sodih števil, $B$ pa množica števil, deljivih s $3$. Presek $A \cap B = \{6, 12, 18\}$ je skupni del obeh krogov.

- nastavi: A = sodo
- nastavi: B = tri
- klikni: ∩

## 0:14

Unija $A \cup B$ zajame oba kroga: števila, ki so v $A$ ali v $B$. Ima $13$ elementov, saj presek šteješ le enkrat: $|A \cup B| = 10 + 6 - 3 = 13$.

- klikni: ∪

## 0:27

Razlika $A \setminus B = \{2, 4, 8, 10, 14, 16, 20\}$ je del kroga $A$ zunaj kroga $B$: soda števila, ki niso deljiva s $3$.

- klikni: A∖B

## 0:39

Zamenjaj vrstni red: $B \setminus A = \{3, 9, 15\}$. Opazuj, da je to drug del diagrama, zato razlika ni zamenljiva.

- klikni: B∖A

## 0:51

Komplement $A^c$ (gumb A') so vsa števila iz $\mathcal{U}$, ki niso v $A$. To so liha števila od $1$ do $19$, teh je $10$.

- klikni: A'

## 1:03

Za $B$ izberi liha števila. Krogov nič ne povezuje, presek je prazen: $A \cap B = \emptyset$. Množici sta disjunktni.

- nastavi: B = liho
- klikni: ∩

## 1:16

Unija sodih in lihih števil je cela $\mathcal{U}$: $|A \cup B| = 10 + 10 - 0 = 20$. Pri disjunktnih množicah se moči preprosto seštejeta.

- klikni: ∪

## 1:29

Pravilo: presek je v obeh množicah, unija v vsaj eni, razlika $A \setminus B$ v $A$ in ne v $B$, komplement v $\mathcal{U}$ in ne v $A$. Moč unije je $|A| + |B| - |A \cap B|$.
