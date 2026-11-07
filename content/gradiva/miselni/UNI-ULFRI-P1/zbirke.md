---
avtor: AI
stanje: osnutek
---

- Tri vrste zbirk
  - seznam: po vrsti, s ponovitvami
  - množica: brez ponovitev
  - slovar: ključ → vrednost
- Vmesnik in izvedba
  - `List<String> s = new ArrayList<>();`
  - `Map` ne deduje od `Collection`
- Seznami
  - `ArrayList`: hiter `get(i)`
  - `remove(1)` briše indeks, ne vrednost
- Množice
  - `HashSet` hiter, `TreeSet` urejen
  - `addAll`, `retainAll`, `removeAll`
- Slovarji
  - `put` prepiše, `get` vrne `null`
  - `getOrDefault`, `merge` za štetje
- Iteratorji
  - `hasNext`, `next`, `remove`
  - brisanje v `for`-each: izjema
- Enakost objektov
  - `equals` in `hashCode` skupaj
  - `TreeSet`: `compareTo` ali `Comparator`
