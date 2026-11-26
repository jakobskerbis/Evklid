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

## Pregled (j, 26. 11. 2026)

Navadni PR za Lean (dokazi lekcij in nalog, PV-09, PV-12) ima pred združitvijo **dva** neodvisna pregleda in
samodejna varovala CI:

1. **Zvestoba viru** – vsaka trditev pove natanko to, kar vir (ista števila, pogoji, obe smeri rešitev), in
   `besedilo:` je res vidna trditev, ki jo izrek dokaže.
2. **Napad** – poskusi iz predpostavk dokazati `False`, poišči oslabljene trditve, manjkajoče korake, prazne
   `example`, prevelike `maxHeartbeats`.

Samodejna varovala: `lake build --wfail` od začetka, aksiomi (`scripts/lean-aksiomi.mjs`), prepovedane besede in
uvoz vsake datoteke (`lean.yml`), sha256 lekcije, id in citat vsake trditve ter primer izpolnljivosti predpostavk
(`scripts/lean-lekcije.mjs`, `lean-lekcije.yml`).

**Štirje** neodvisni pregledi (zvestoba viru A, zvestoba viru B brez branja poročila A, napad, gradnja) ostanejo za
spremembe `lean.yml`, `lean-toolchain`, samih varoval (`scripts/lean-lekcije.mjs`, `scripts/lean-aksiomi.mjs`,
`.github/workflows/lean-lekcije.yml`), poti, ki učencu pokaže »Formalno dokazano« (`server/oznake-vsebine.js`,
`public/oznake-vsebine.js`), ter za PV-15 in PV-16. PV-15: inštruktor odda strukturirane korake (RACUN po korakih s
`prejsnji` in `besedilo`), vidni odgovor se izriše iz njih; PV-16: samodejni popravek prvega napačnega koraka in
ponovno preverjanje celote (načrt na [#539](https://github.com/jakobskerbis/Evklid/issues/539)).

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

### Trditev, citat in izpolnljivost (PV-09, j 26. 11. 2026)

Docstring vsakega izreka ima na koncu vrstici, ki ga povežeta z vidno trditvijo lekcije (zapis trditve
`public/preverjanje/trditev.js`, polje `dokaz: { izrek, sha256 }`):

```
/-- Razlaga 2 in 5, simetrija: `C(n,k) = C(n,n-k)` za `k ≤ n`.
trditev: MAT-SS-4/binomski-izrek#simetrija
besedilo: »simetrija pa $\binom{n}{k} = \binom{n}{n-k}$.« -/
theorem simetrija (n k : ℕ) (hk : k ≤ n) : Nat.choose n k = Nat.choose n (n - k) := …
```

- `trditev:` id oblike `<pot lekcije brez .md>#<kratko-ime>` (male črke, številke, `-`), enoličen v lekciji. Id se
  ne spreminja, ko se izrek preimenuje.
- `besedilo: »…«` je dobesedni izsek iz besedila, ki ga učenec vidi (brez glave, `:::risba`, `:::simboli` in
  `<<RACUN`), v eni vrstici; presledki, prelomi in LaTeX `\,` `\;` `\!` se pri primerjavi štejejo kot en presledek.
  Brez `-/` in `/-` (zaprla bi docstring). Citat je trditev, ki jo izrek dokaže (sklep, odgovor, pravilo), ne besedilo
  naloge, »Podatki:«, »Točkovanje:«, vprašanje ali glava tabele; pri tabeli citiraj vrstico izreka. Iz »Preveri se«
  (j, 26. 11. 2026) sme citat priti le iz razlage odgovora (vrstica `>`) ali povratne informacije (`~`, pri vpiši
  število brez napačne vrednosti pred `|`), nikoli iz vprašanja ali ponujenih odgovorov (`+`, `-`, `=`, `1.`);
  `citljivoBesedilo` te vrstice zamenja z zaporo, zato citat ne more segati čeznje. Krajši od 15 znakov
  je dovoljen le z vrstico `besedilo-kratko: <razlog>`; isti citat pri več kot dveh izrekih lekcije je opozorilo.
- Pomožna trditev, ki ni trditev lekcije (orodje, meje za √2, Taylorjeve ocene), ima namesto tega vrstico `pomozno`.
  `pomozno` z docstringom, ki omenja primer ali nalogo, je opozorilo (morda je to trditev lekcije).
- Izrek s predpostavkami ima primer izpolnljivosti. Predpostavka je binder (npr. `(hk : k ≤ n)`,
  `(hf : HasDerivAt f f' x)`; ne spremenljivke in razredi, kot `(n : ℕ)` ali `[CommRing R]`) ali »→« v sklepu (v enem
  od veznikov »∧« na vrhu, za začetnimi »∀ …,«, npr. `… ∧ ∀ x, 0 < x → …`; »¬ …«, »∃ …« in »let …« ne štejejo).
  Šteje tudi »→« v oklepaju (`(1 < a → …) ∧ …`), ASCII `->`, omejeni `∀ x > 0,` / `∀ x ∈ S,` in binder s strukturo, ki
  nosi dokaz (`Affine.Triangle`, `Affine.Simplex`, podtip `{x // p x}`).
  Primer je `example` (ali izrek `<izrek>_izpolnljivo`) brez lastnih predpostavk, ki izrek **uporabi** na konkretnih
  vrednostih (z argumenti: golo ime `example := izrek`, `@izrek` brez argumentov ali `#check` za primerom ne štejejo;
  `<izrek>_izpolnljivo` je priča le za `<izrek>` in ga mora uporabiti, sicer je navaden izrek z obveznimi oznakami), npr. `example := koren_pot (n := 2) (a := 4) (by norm_num) (by norm_num)` ali
  `example := preizkus2.2.2 0 (by norm_num) (by norm_num)`. Lean tako preveri, da iste vrednosti izpolnijo vse
  predpostavke hkrati. Kjer primer ni preprost, docstring izreka pove `izpolnljivo: ročno – <razlog>`. Pomožne
  trditve primera ne potrebujejo.

Izreki, ki so bili brez primera že, preden je PV-09 začel šteti »→« v oklepaju, `->` in omejeni `∀`, so v
`lean/izpolnljivo-dolg.json` (`{ izrek, podpis }`; v kazalu `izpolnljivo: "dolg"`). Vnos velja le, dokler se podpis
izreka ne spremeni, seznam se sme le krčiti (`lean-lekcije.yml` ga primerja z osnovno vejo), nov izrek potrebuje
primer. `private` je dovoljen le pri `pomozno` (kazalo in `lean-aksiomi.mjs` privatnega imena ne vidita);
`lean-aksiomi.mjs` uporablja isti razčlenjevalnik (zamaknjeni izreki, atributi, `noncomputable section`, znakovni
literali in surovi nizi) in v `#print axioms` vzame tudi vsak `izrek` iz `lean/trditve.json`, zato Lean zavrne kazalo z
neobstoječim imenom. Besedilno ni mogoče preveriti, da primer poda **vse** predpostavke in tudi predpostavke v sklepu
(primer `have w : … := by norm_num; izrek (hx := w.1)` pusti »→« v sklepu nedokazan; dolg zgoraj): to preveri Lean
sam (tip primera brez preostalih `∀`/`→`), PV-13.

`scripts/lean-lekcije.mjs` (in `.github/workflows/lean-lekcije.yml`) javi, ko se lekcija spremeni po dokazu, ko
izreku manjka `trditev:`/`besedilo:` (ali `pomozno`), ko je id podvojen ali citata ni v lekciji in ko predpostavke
nimajo primera. Kazalo `lean/trditve.json` (`{ id, izrek, sha256, vir, besedilo }`, pri predpostavkah še
`izpolnljivo`) napiše `node scripts/lean-lekcije.mjs --zapisi`; preverjanje javi, če ni posodobljeno.
Napake v lekciji, ki jih Lean najde, se ne popravljajo v Leanu: popravi se lekcija (po `content/lessons/README.md`
in pregledu Opus), dokaz ostane za pravilno trditev.
