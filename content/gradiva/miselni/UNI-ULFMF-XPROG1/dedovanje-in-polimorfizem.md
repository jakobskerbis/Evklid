---
avtor: AI
stanje: osnutek
---

- Podrazred
  - `class B extends A`, razmerje »je«
  - en nadrazred, privzeto `Object`
  - konstruktor najprej kliče `super(...)`
- Prekrivanje
  - enak podpis, `@Override`
  - dostop ne sme biti ožji
- Preobteževanje
  - drugačni parametri, izbere prevajalnik
  - napaka: misliš, da prekrivaš
- Statični in dinamični tip
  - `Izdelek i = new Akcijski(100)`
  - podpis po statičnem, različica po dinamičnem
- Pretvorbe
  - navzgor samodejno
  - navzdol z `(Tip)`, sicer `ClassCastException`
  - preveri z `instanceof`
- Abstraktni razred
  - `abstract` metoda brez telesa
  - ni `new`, lahko ima stanje
- Vmesnik
  - `implements`, več vmesnikov hkrati
  - metode javne, `default` ima telo
