# Lean: dokazano preverjanje vsebine

j, 25. 11. 2026: »Povsod, kjer bi pomagalo pri natančnosti, dodaj programsko preverjanje z Lean, tudi vmesni
koraki.« Lean je dokazovalnik: trditev velja šele, ko jo Lean dokaže. Dopolnjuje SymPy (`server/cas.js`), ki
računa; Lean dokazuje, tudi vsak vmesni korak (veriga `calc`).

## Načrt (odločitve j, 25. 11. 2026)

| PR | Kaj | Kje teče |
|---|---|---|
| L1 | projekt `lean/` (Lean 4.36.0, Mathlib v4.36.0), preverjanje v GitHubu, prvi primeri iz testnih zapiskov | GitHub |
| L2 | lekcije matematike: pravila, identitete, neenačbe, koraki rešenih primerov | GitHub |
| L3 | naše pole in tekmovalne rešitve, vsak korak; dokazne naloge v celoti | GitHub |
| L4 | generatorji Vadnice: vzorec nalog iz vsake vrste | GitHub |
| L5 | delavec na j-jevem prenosniku (Windows, prižgan 24/7): sam pobira dokaze z evklid.app (samo izhodna povezava), dobi samo matematično trditev, brez podatkov učenca | prenosnik |
| L6 | dokazi med učenjem (tekmovanja, matura, faks): AI prevede korak v Lean, drug model preveri prevod, delavec dokaže; prenosnik ugasnjen → »ni preverjeno z Lean« | prenosnik |

Integrali, limite in enote ostanejo pri SymPy, kjer jih ta računa zanesljivo; Lean jih dokaže tam, kjer je
v Mathlibu pravilo (npr. `integral_pow`), sicer ne.

## Pravila

- Ena datoteka na vir (`lean/Evklid/<Vir>.lean`), uvožena v `lean/Evklid.lean`. Docstring vsake trditve pove
  vir (datoteka, primer) in trditev v besedah.
- Večkoračen račun je veriga `calc`: vsak korak iz vira je svoja vrstica, da Lean preveri tudi korake.
- Trditev s predpostavkami ima ob sebi `example`, ki pokaže, da se predpostavke dajo izpolniti. Sicer bi
  nasprotujoče si predpostavke »dokazale« karkoli (pregled L1: `∀ n, aₙ₊₁ = 2aₙ` velja tudi za n = 0).
- Prepovedano: `sorry`, `admit`, `axiom`, `native_decide`; `lake build --wfail` (vsako opozorilo je napaka) in
  vsaka datoteka v `Evklid/` mora biti uvožena v `Evklid.lean` (preveri `.github/workflows/lean.yml`).
- Trditev je zapisana tako, kot je v viru (ista števila, isti vrstni red). Lean dokaže samo to, kar je zapisano:
  napačen prevod je napačna trditev, zato pregledovalec primerja trditev z virom.

## Pregled (j, 25. 11. 2026: »Vse za Lean 4× preveri«)

Vsaka sprememba v `lean/` ima pred združitvijo štiri neodvisne preglede (več kot `docs/pregled.md`):

1. **Zvestoba viru A** – vsaka trditev pove natanko to, kar vir (ista števila, pogoji, obe smeri rešitev).
2. **Zvestoba viru B** – drug pregledovalec isto, neodvisno, brez branja poročila A.
3. **Napad** – poskusi iz predpostavk dokazati `False`, poišči oslabljene trditve, manjkajoče korake, prazne
   `example`, prevelike `maxHeartbeats`.
4. **Gradnja** – `lake build --wfail` od začetka, varovala v `lean.yml`, `scripts/lean-lekcije.mjs`, CI zelen.

## Lokalno

```
cd lean
lake exe cache get   # prevedeni Mathlib (~7 GB)
lake build           # preveri vse
```

Brez Leana na stroju preverjanje teče samo v GitHubu (`lean.yml`, ob spremembi `lean/`; L2 in L3 dodata lekcije
in pole). elan je zaklenjen na v4.4.0 s preverjenim sha256.
Ne zadrži objave na evklid.app.

## Lekcije (L2)

Ena datoteka na lekcijo: `lean/Evklid/Lekcije/<PODROCJE>/<ImeVCamelCase>.lean` (npr. `MAT-SS-4/binomski-izrek.md`
→ `Lekcije/MAT_SS_4/BinomskiIzrek.lean`, modul `Evklid.Lekcije.MAT_SS_4.BinomskiIzrek`), uvožena v
`lean/Evklid.lean`. Glava:

```
/-
vir: content/lessons/MAT-SS-4/binomski-izrek.md
sha256: <sha256sum lekcije>
Ni v Leanu: <kaj iz lekcije ni dokazano in zakaj, npr. »risba«, »simulacija«, »statistični podatki iz ankete«>
-/
module

public import Mathlib
```

Kaj se dokaže (vse, kar je v Mathlibu dokazljivo):

1. vsako pravilo ali identiteto iz `:::formula`, `$$…$$` in razlage, v splošni obliki (s pogoji, ki jih navaja
   lekcija, npr. `n ≠ -1`);
2. vsak rešen primer (`### Primer`) kot verigo `calc` z vmesnimi koraki natanko tako, kot so zapisani; rešitev
   enačbe ali neenačbe kot `↔` (množica rešitev, ne samo ena smer);
3. vsako vrstico bloka `<<RACUN`, ki jo Mathlib zna (resi, neenacba, enako, vrednost, odvod, integral, kjer gre);
4. pravilni odgovor vsakega `:::kviz` / »Preveri se«, kjer je matematičen.

`scripts/lean-lekcije.mjs` (in `.github/workflows/lean-lekcije.yml`) javi, ko se lekcija spremeni po dokazu.
Napake v lekciji, ki jih Lean najde, se ne popravljajo v Leanu: popravi se lekcija (po `content/lessons/README.md`
in pregledu Opus), dokaz ostane za pravilno trditev.
