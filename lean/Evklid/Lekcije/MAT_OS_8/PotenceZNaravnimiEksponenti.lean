/-
vir: content/lessons/MAT-OS-8/potence-z-naravnimi-eksponenti.md
sha256: 0ea4ad5f1799ae0c1f86dedbe73f13f6dd4e86c9e1c066680ca08b54603af773
Ni v Leanu: zgodbe (papir do Lune, sonda, verižno sporočilo, zvezde) kot modeli: dokazani so računi in
enoličnost števila plasti oz. prejemnikov iz začetnega pogoja in podvajanja (potrojevanja); da papirja
v resnici ne moreš prepogniti več kot nekajkrat, je fizika; »približno« (220 000 km, 440 000 km, 17 min,
10 cm) je dokazano kot natančna vrednost in odmik (< 1000 km, 1024 s = 17 min 4 s, 102,4 mm = 10,24 cm);
imena (osnova, eksponent, vrednost potence, »na kvadrat«, »na kub«), branje, »stopnjo nižje« in navodila
(»razpiši«, »oklepaj«) kot besedilo; simulacija in risbe kot slike (dokazano: 2ⁿ⁺¹ = 2 · 2ⁿ, ploščice in
kockice kot število elementov Fin 5 × Fin 5 in Fin 3 × Fin 3 × Fin 3, kroglice 3 + 2 = 5 in 5 − 2 = 3);
»2³ · 3⁴ ne moremo zapisati kot eno potenco z isto osnovo« je dokazano za osnovi 2 in 3 ter za 6
(2³ · 3⁴ = 648 ni enako 2ᵏ, 3ᵏ ali 6ᵏ za noben k); napačni zapis 2³ · 3² = 6⁵ ne velja (Pogoste
napake 4); besedilo napačnih odgovorov kviza (dokazano je, da napačne vrednosti niso
pravilne). Potenca aⁿ je v Leanu `a ^ n` z n : ℕ (produkt n faktorjev a je `List.prod_replicate`). Pri
deljenju je eksponent m − n odštevanje v ℕ; ker pravilo zahteva m > n, je to pravo odštevanje. `-2 ^ 4`
se v Leanu bere kot −(2⁴), kakor v lekciji. Vse trditve so v ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.PotenceZNaravnimiEksponenti

/-! ## Zakaj se tega učimo: papir do Lune -/

/-- Zakaj se tega učimo: list 0,1 mm, en pregib 0,2 mm, še en 0,4 mm (vsak pregib podvoji debelino).
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#papir-prvi-pregibi
besedilo: »Kup je zdaj debel $0{,}2\,\text{mm}$. Še en pregib: $0{,}4\,\text{mm}$.« -/
theorem papir_prvi_pregibi : (1 / 10 : ℝ) * 2 = 2 / 10 ∧ (2 / 10 : ℝ) * 2 = 4 / 10 := by norm_num

/-- Zakaj se tega učimo: število plasti po 42 pregibih je produkt dvainštiridesetih dvojk, 2⁴².
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#dvainstirideset-dvojk
besedilo: »Število plasti po $42$ pregibih je produkt dvainštiridesetih dvojk.« -/
theorem dvainstirideset_dvojk : (List.replicate 42 (2 : ℝ)).prod = 2 ^ 42 := List.prod_replicate 42 2

/-- Zakaj se tega učimo: po n pregibih je kup debel 0,1 · 2ⁿ mm = 0,1 · 2ⁿ / 10⁶ km; do Lune (384 400 km)
seže natanko tedaj, ko je n ≥ 42 (42 pregibov je dovolj, 41 ne).
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#do-lune
besedilo: »Dovolj je $42$ pregibov!« -/
theorem do_lune (n : ℕ) : (1 / 10 : ℝ) * 2 ^ n / 10 ^ 6 ≥ 384400 ↔ 42 ≤ n := by
  constructor
  · intro h
    by_contra hn
    have h41 : (2 : ℝ) ^ n ≤ 2 ^ 41 := pow_le_pow_right₀ (by norm_num) (by omega)
    norm_num at h41
    linarith
  · intro hn
    have h42 : (2 : ℝ) ^ 42 ≤ 2 ^ n := pow_le_pow_right₀ (by norm_num) hn
    norm_num at h42 ⊢
    linarith

/-- Zakaj se tega učimo: po 41 pregibih je kup visok približno 220 000 km, po 42 približno 440 000 km
(odmik manj kot 1000 km), kar je dlje od Lune.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#lune-41-42
besedilo: »Po $41$ pregibih bi bil kup visok približno $220\,000\,\text{km}$, po $42$ pa približno $440\,000\,\text{km}$, kar je že dlje od Lune.« -/
theorem lune_41_42 :
    |(1 / 10 : ℝ) * 2 ^ 41 / 10 ^ 6 - 220000| < 1000 ∧ |(1 / 10 : ℝ) * 2 ^ 42 / 10 ^ 6 - 440000| < 1000 ∧
      (1 / 10 : ℝ) * 2 ^ 42 / 10 ^ 6 > 384400 := by
  refine ⟨?_, ?_, by norm_num⟩ <;> rw [abs_lt] <;> constructor <;> norm_num

/-! ## Razlaga 1: staro in novo drugo ob drugem -/

/-- Razlaga 1: 4 + 4 + 4 = 3 · 4 = 12 in 4 · 4 · 4 = 4³ = 64; 3 · 4 = 4 · 3, a 4³ ≠ 3⁴ (4³ = 64, 3⁴ = 81).
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#mnozenje-proti-potenci
besedilo: »| primer | $4 + 4 + 4 = 12$ | $4 \cdot 4 \cdot 4 = 64$ | | število $3$ pove | koliko je seštevancev | koliko je faktorjev | | zamenjava števil | $3 \cdot 4 = 4 \cdot 3$ | $4^3 \ne 3^4$ |« -/
theorem mnozenje_proti_potenci :
    (4 : ℝ) + 4 + 4 = 3 * 4 ∧ (3 : ℝ) * 4 = 12 ∧ (4 : ℝ) * 4 * 4 = 4 ^ 3 ∧ (4 : ℝ) ^ 3 = 64 ∧
      (3 : ℝ) * 4 = 4 * 3 ∧ (4 : ℝ) ^ 3 ≠ 3 ^ 4 ∧ (3 : ℝ) ^ 4 = 81 := by
  norm_num

/-! ## Razlaga 2: imena -/

/-- Razlaga 2 in Povzetek: aⁿ je produkt n enakih faktorjev a.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#potenca-je-produkt
besedilo: »Potenca $a^n$ je produkt $n$ enakih faktorjev $a$« -/
theorem potenca_je_produkt (a : ℝ) (n : ℕ) : (List.replicate n a).prod = a ^ n := List.prod_replicate n a

/-- Razlaga 2 in Povzetek: potenca z eksponentom 1 je osnova: a¹ = a.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#na-prvo
besedilo: »Potenca z eksponentom $1$ je kar osnova: $a^1 = a$.« -/
theorem na_prvo (a : ℝ) : a ^ 1 = a := pow_one a

/-- Razlaga 2 in Preveri se 1: 5³ = 5 · 5 · 5 = 125.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#pet-na-tretjo
besedilo: »$5^3 = 5 \cdot 5 \cdot 5 = 125$« -/
theorem pet_na_tretjo : (5 : ℝ) ^ 3 = 125 := by
  calc (5 : ℝ) ^ 3 = 5 * 5 * 5 := by ring
    _ = 125 := by norm_num

/-- Razlaga 2, Povzetek in Pogoste napake 1: eksponent ni faktor: 2⁴ = 2 · 2 · 2 · 2 = 16, ne 2 · 4 = 8.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#eksponent-ni-faktor
besedilo: »$2^4$ ni $2 \cdot 4 = 8$, ampak $2 \cdot 2 \cdot 2 \cdot 2 = 16$.« -/
theorem eksponent_ni_faktor : (2 : ℝ) ^ 4 = 2 * 2 * 2 * 2 ∧ (2 : ℝ) * 2 * 2 * 2 = 16 ∧ (2 : ℝ) * 4 = 8 ∧
    (2 : ℝ) ^ 4 ≠ 2 * 4 := by
  norm_num

/-- Razlaga 2 (premisli): 2⁵ = 2 · 2 · 2 · 2 · 2 = 32 > 25 = 5 · 5 = 5², čeprav je 2 · 5 = 5 · 2.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#premisli-2-5
besedilo: »$2^5 = 2 \cdot 2 \cdot 2 \cdot 2 \cdot 2 = 32$ in $5^2 = 5 \cdot 5 = 25$, zato je $2^5$ večje.« -/
theorem premisli_2_5 : (2 : ℝ) ^ 5 = 32 ∧ (5 : ℝ) ^ 2 = 25 ∧ (2 : ℝ) ^ 5 > 5 ^ 2 ∧ (2 : ℝ) * 5 = 5 * 2 := by
  refine ⟨?_, ?_, by norm_num, by norm_num⟩
  · calc (2 : ℝ) ^ 5 = 2 * 2 * 2 * 2 * 2 := by ring
      _ = 32 := by norm_num
  · calc (5 : ℝ) ^ 2 = 5 * 5 := by ring
      _ = 25 := by norm_num

/-- Razlaga 2 (simulacija): vsak naslednji stolpec je dvakrat višji (2ⁿ⁺¹ = 2 · 2ⁿ); večkratniki 2, 4, 6, 8
rastejo s prištevanjem 2, potence 2, 4, 8, 16 z množenjem z 2.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#simulacija
besedilo: »vsak naslednji stolpec je **dvakrat** višji, ne za $2$ višji. Večkratniki števila $2$ rastejo s prištevanjem ($2, 4, 6, 8$), potence števila $2$ pa z množenjem ($2, 4, 8, 16$).« -/
theorem simulacija (n : ℕ) :
    (2 : ℝ) ^ (n + 1) = 2 * 2 ^ n ∧ ((2 : ℝ) * 1, (2 : ℝ) * 2, (2 : ℝ) * 3, (2 : ℝ) * 4) = (2, 4, 6, 8) ∧
      ((2 : ℝ) ^ 1, (2 : ℝ) ^ 2, (2 : ℝ) ^ 3, (2 : ℝ) ^ 4) = (2, 4, 8, 16) := by
  refine ⟨pow_succ' 2 n, by norm_num, by norm_num⟩

/-! ## Razlaga 3: negativna osnova -/

/-- Razlaga 3: (−2)³ = (−2) · (−2) · (−2) = −8 in (−2)⁴ = (−2) · (−2) · (−2) · (−2) = 16.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#negativna-osnova
besedilo: »$(-2)^3 = (-2) \cdot (-2) \cdot (-2) = -8$: lih eksponent, vrednost je negativna; - $(-2)^4 = (-2) \cdot (-2) \cdot (-2) \cdot (-2) = 16$« -/
theorem negativna_osnova :
    (-2 : ℝ) ^ 3 = (-2) * (-2) * (-2) ∧ (-2 : ℝ) * (-2) * (-2) = -8 ∧
      (-2 : ℝ) ^ 4 = (-2) * (-2) * (-2) * (-2) ∧ (-2 : ℝ) * (-2) * (-2) * (-2) = 16 := by
  norm_num

/-- Razlaga 3 in Povzetek: pri negativni osnovi a < 0 sod eksponent da pozitivno vrednost.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#sod-eksponent
besedilo: »Negativna osnova: sod eksponent da pozitivno vrednost« -/
theorem sod_eksponent (a : ℝ) (n : ℕ) (ha : a < 0) (hn : Even n) : 0 < a ^ n :=
  hn.pow_pos ha.ne

/-- Razlaga 3 in Povzetek: pri negativni osnovi a < 0 lih eksponent da negativno vrednost.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#lih-eksponent
besedilo: »pri negativni osnovi lih eksponent da negativno vrednost.« -/
theorem lih_eksponent (a : ℝ) (n : ℕ) (ha : a < 0) (hn : Odd n) : a ^ n < 0 :=
  hn.pow_neg ha

/-- Predpostavke `sod_eksponent` in `lih_eksponent` se dajo izpolniti (a = −2, n = 4 oz. n = 3). -/
example : (-2 : ℝ) < 0 ∧ Even 4 ∧ Odd 3 := ⟨by norm_num, by decide, by decide⟩

/-- Razlaga 3 in Povzetek (in Preveri se 4): −2⁴ = −(2⁴) = −16, (−2)⁴ = 16, zato −2⁴ < (−2)⁴.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#minus-brez-oklepaja
besedilo: »$-2^4 = -16$, $(-2)^4 = 16$« -/
theorem minus_brez_oklepaja : -2 ^ 4 = -((2 : ℝ) ^ 4) ∧ -(2 : ℝ) ^ 4 = -16 ∧ (-2 : ℝ) ^ 4 = 16 ∧
    -(2 : ℝ) ^ 4 < (-2) ^ 4 := by
  norm_num

/-! ## Razlaga 4: množenje potenc z enako osnovo -/

/-- Razlaga 4: 2³ · 2² = (2 · 2 · 2) · (2 · 2) = 2⁵ (faktorjev je 3 + 2 = 5).
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#razpis-mnozenja
besedilo: »$$2^3 \cdot 2^2 = (2 \cdot 2 \cdot 2) \cdot (2 \cdot 2) = 2^5$$« -/
theorem razpis_mnozenja : (2 : ℝ) ^ 3 * 2 ^ 2 = 2 ^ 5 := by
  calc (2 : ℝ) ^ 3 * 2 ^ 2 = (2 * 2 * 2) * (2 * 2) := by ring
    _ = 2 ^ 5 := by ring

/-- Razlaga 4 in Povzetek: aᵐ · aⁿ = aᵐ⁺ⁿ.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#mnozenje-potenc
besedilo: »Množenje potenc z enako osnovo: $a^m \cdot a^n = a^{m+n}$.« -/
theorem mnozenje_potenc (a : ℝ) (m n : ℕ) : a ^ m * a ^ n = a ^ (m + n) := (pow_add a m n).symm

/-- Razlaga 4: 3² · 3⁴ = 3⁶ = 729.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#primer-3-2-3-4
besedilo: »Primer: $3^2 \cdot 3^4 = 3^6 = 729$.« -/
theorem primer_3_2_3_4 : (3 : ℝ) ^ 2 * 3 ^ 4 = 3 ^ 6 ∧ (3 : ℝ) ^ 6 = 729 := by
  refine ⟨mnozenje_potenc 3 2 4, by norm_num⟩

/-- Razlaga 4 (premisli): 2³ · 2⁴ = 2⁷ = 128, ne 2¹².
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#premisli-2-12
besedilo: »$2^3 \cdot 2^4 = 2^7 = 128$. Eksponent $12$ bi štel faktorje, ki jih ni.« -/
theorem premisli_2_12 : (2 : ℝ) ^ 3 * 2 ^ 4 = 2 ^ 7 ∧ (2 : ℝ) ^ 7 = 128 ∧ (2 : ℝ) ^ 3 * 2 ^ 4 ≠ 2 ^ 12 := by
  refine ⟨mnozenje_potenc 2 3 4, by norm_num, by norm_num⟩

/-! ## Razlaga 5: deljenje potenc z enako osnovo -/

/-- Razlaga 5: 5⁵ : 5² = (5 · 5 · 5 · 5 · 5)/(5 · 5) = 5 · 5 · 5 = 5³.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#razpis-deljenja
besedilo: »$$\frac{5 \cdot 5 \cdot 5 \cdot 5 \cdot 5}{5 \cdot 5} = 5 \cdot 5 \cdot 5 = 5^3$$« -/
theorem razpis_deljenja : (5 : ℝ) ^ 5 / 5 ^ 2 = 5 ^ 3 := by
  calc (5 : ℝ) ^ 5 / 5 ^ 2 = (5 * 5 * 5 * 5 * 5) / (5 * 5) := by ring
    _ = 5 * 5 * 5 := by norm_num
    _ = 5 ^ 3 := by ring

/-- Razlaga 5 in Povzetek: za m > n in a ≠ 0 je aᵐ : aⁿ = aᵐ⁻ⁿ.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#deljenje-potenc
besedilo: »Deljenje potenc z enako osnovo: $a^m : a^n = a^{m-n}$ (za $m > n$, $a \ne 0$).« -/
theorem deljenje_potenc (a : ℝ) (m n : ℕ) (ha : a ≠ 0) (hmn : m > n) : a ^ m / a ^ n = a ^ (m - n) :=
  (pow_sub₀ a ha hmn.le).symm

/-- Predpostavke `deljenje_potenc` se dajo izpolniti (a = 5, m = 7, n = 3). -/
example : (5 : ℝ) ≠ 0 ∧ 7 > 3 := by norm_num

/-- Razlaga 5: 5⁷ : 5³ = 5⁴ = 625.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#primer-5-7-5-3
besedilo: »Primer: $5^7 : 5^3 = 5^4 = 625$.« -/
theorem primer_5_7_5_3 : (5 : ℝ) ^ 7 / 5 ^ 3 = 5 ^ 4 ∧ (5 : ℝ) ^ 4 = 625 := by
  refine ⟨deljenje_potenc 5 7 3 (by norm_num) (by norm_num), by norm_num⟩

/-- Razlaga 5: pogoj a ≠ 0 je potreben, ker z 0 ne delimo: pri a = 0 in n ≥ 1 je imenovalec 0ⁿ = 0.
Dokazano je le, da je imenovalec 0; da deljenje z 0 ni definirano, je besedilo (v Leanu je x / 0 = 0).
pomozno – dokazano le 0ⁿ = 0; lekcija trdi, da z 0 ne delimo, česar Lean ne izrazi -/
theorem nic_v_imenovalcu (n : ℕ) (hn : 1 ≤ n) : (0 : ℝ) ^ n = 0 := zero_pow (by omega)

/-- Predpostavka `nic_v_imenovalcu` se da izpolniti (n = 2). -/
example : 1 ≤ 2 := by norm_num

/-! ## Razlaga 6 in Pogoste napake: kje pravili ne veljata -/

/-- Razlaga 6 in Pogoste napake 4: pravilo ne velja za seštevanje: 2³ + 2² = 8 + 4 = 12, 2⁵ pa je 32.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#ne-za-vsoto
besedilo: »$2^3 + 2^2 = 8 + 4 = 12$, $2^5$ pa je $32$« -/
theorem ne_za_vsoto : (2 : ℝ) ^ 3 + 2 ^ 2 = 12 ∧ (2 : ℝ) ^ 5 = 32 ∧ (2 : ℝ) ^ 3 + 2 ^ 2 ≠ 2 ^ (3 + 2) := by
  refine ⟨?_, by norm_num, by norm_num⟩
  calc (2 : ℝ) ^ 3 + 2 ^ 2 = 8 + 4 := by norm_num
    _ = 12 := by norm_num

/-- Razlaga 6: 2³ · 3⁴ = 8 · 81 = 648 ni ena potenca z osnovo 2, 3 ali 6 (za noben eksponent k).
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#ni-ena-potenca
besedilo: »Izraza $2^3 \cdot 3^4$ ne moremo zapisati kot eno potenco z isto osnovo.« -/
theorem ni_ena_potenca (k : ℕ) :
    (2 : ℝ) ^ 3 * 3 ^ 4 = 648 ∧ (2 : ℝ) ^ 3 * 3 ^ 4 ≠ 2 ^ k ∧ (2 : ℝ) ^ 3 * 3 ^ 4 ≠ 3 ^ k ∧
      (2 : ℝ) ^ 3 * 3 ^ 4 ≠ 6 ^ k := by
  have h : (2 : ℕ) ^ 3 * 3 ^ 4 ≠ 2 ^ k ∧ (2 : ℕ) ^ 3 * 3 ^ 4 ≠ 3 ^ k ∧ (2 : ℕ) ^ 3 * 3 ^ 4 ≠ 6 ^ k := by
    rcases lt_or_ge k 11 with hk | hk
    · interval_cases k <;> norm_num
    · have h2 : 2 ^ 11 ≤ 2 ^ k := Nat.pow_le_pow_right (by norm_num) hk
      have h3 : 3 ^ 11 ≤ 3 ^ k := Nat.pow_le_pow_right (by norm_num) hk
      have h6 : 6 ^ 11 ≤ 6 ^ k := Nat.pow_le_pow_right (by norm_num) hk
      refine ⟨?_, ?_, ?_⟩ <;> omega
  refine ⟨by norm_num, ?_, ?_, ?_⟩
  · exact_mod_cast h.1
  · exact_mod_cast h.2.1
  · exact_mod_cast h.2.2

/-- Pogoste napake 4: pravilo ne velja za različni osnovi: 2³ · 3² = 8 · 9 = 72 ≠ 6⁵.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#ne-za-razlicni-osnovi
besedilo: »$8 \cdot 9 = 72$« -/
theorem ne_za_razlicni_osnovi : (2 : ℝ) ^ 3 * 3 ^ 2 = 72 ∧ (2 : ℝ) ^ 3 * 3 ^ 2 ≠ 6 ^ 5 := by
  refine ⟨?_, by norm_num⟩
  calc (2 : ℝ) ^ 3 * 3 ^ 2 = 8 * 9 := by norm_num
    _ = 72 := by norm_num

/-- Pogoste napake 2: a³ · a² = a⁵ in a⁶ : a² = a⁴ (a ≠ 0); eksponentov ne množimo in ne delimo
(pri a = 2: 2³ · 2² ≠ 2⁶, 2⁶ : 2² ≠ 2³).
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#napaka-eksponenti
besedilo: »Pravilno: $a^5$ in $a^4$.« -/
theorem napaka_eksponenti (a : ℝ) (ha : a ≠ 0) :
    a ^ 3 * a ^ 2 = a ^ 5 ∧ a ^ 6 / a ^ 2 = a ^ 4 ∧ (2 : ℝ) ^ 3 * 2 ^ 2 ≠ 2 ^ 6 ∧ (2 : ℝ) ^ 6 / 2 ^ 2 ≠ 2 ^ 3 :=
  ⟨mnozenje_potenc a 3 2, deljenje_potenc a 6 2 ha (by norm_num), by norm_num, by norm_num⟩

/-- Predpostavka `napaka_eksponenti` se da izpolniti (a = 2). -/
example : (2 : ℝ) ≠ 0 := by norm_num

/-- Pogoste napake 3: 2³ · 2⁴ = 2⁷, ne 4⁷ (osnova ostane 2).
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#napaka-osnovi
besedilo: »Osnova pove, kateri faktor se ponavlja, in ta ostane $2$: $2^7$.« -/
theorem napaka_osnovi : (2 : ℝ) ^ 3 * 2 ^ 4 = 2 ^ 7 ∧ (2 : ℝ) ^ 3 * 2 ^ 4 ≠ 4 ^ 7 :=
  ⟨mnozenje_potenc 2 3 4, by norm_num⟩

/-- Pogoste napake 5: −3² = −9 in (−3)² = 9.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#napaka-minus
besedilo: »$-3^2 = -9$, $(-3)^2 = 9$« -/
theorem napaka_minus : -(3 : ℝ) ^ 2 = -9 ∧ (-3 : ℝ) ^ 2 = 9 ∧ -(3 : ℝ) ^ 2 ≠ 9 := by norm_num

/-! ## Primer 1: zapis in vrednost potence -/

/-- Primer 1 a: 7 · 7 · 7 · 7 = 7⁴.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#primer1a
besedilo: »Odgovor: $7 \cdot 7 \cdot 7 \cdot 7 = 7^4$« -/
theorem primer1a : (7 : ℝ) * 7 * 7 * 7 = 7 ^ 4 := by ring

/-- Primer 1 b: 3⁴ = 3 · 3 · 3 · 3, po korakih 3 · 3 = 9, 9 · 3 = 27, 27 · 3 = 81.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#primer1b
besedilo: »$3 \cdot 3 = 9$, $9 \cdot 3 = 27$, $27 \cdot 3 = 81$« -/
theorem primer1b : (3 : ℝ) ^ 4 = 81 := by
  calc (3 : ℝ) ^ 4 = 3 * 3 * 3 * 3 := by ring
    _ = 9 * 3 * 3 := by norm_num
    _ = 27 * 3 := by norm_num
    _ = 81 := by norm_num

/-- Primer 1 c: osnova −2 je negativna, eksponent 5 lih, zato je vrednost negativna; absolutna vrednost je
2⁵ = 32, torej (−2)⁵ = −32.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#primer1c
besedilo: »$(-2)^5 = -32$«
besedilo-kratko: odgovor c) je le ta enakost; daljši izsek bi zajel še odgovora a) in b) -/
theorem primer1c : (-2 : ℝ) ^ 5 < 0 ∧ |(-2 : ℝ) ^ 5| = 2 ^ 5 ∧ (2 : ℝ) ^ 5 = 32 ∧ (-2 : ℝ) ^ 5 = -32 := by
  refine ⟨lih_eksponent (-2) 5 (by norm_num) (by decide), by norm_num, by norm_num, by norm_num⟩

/-! ## Primer 2: pravili za množenje in deljenje -/

/-- Primer 2 a: 2³ · 2⁴ = 2³⁺⁴ = 2⁷ = 128; preizkus 2³ = 8, 2⁴ = 16, 8 · 16 = 128.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#primer2a
besedilo: »$2^3 \cdot 2^4 = 2^{3+4} = 2^7 = 128$« -/
theorem primer2a : (2 : ℝ) ^ 3 * 2 ^ 4 = 128 ∧ (2 : ℝ) ^ 3 = 8 ∧ (2 : ℝ) ^ 4 = 16 ∧ (8 : ℝ) * 16 = 128 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  calc (2 : ℝ) ^ 3 * 2 ^ 4 = 2 ^ (3 + 4) := mnozenje_potenc 2 3 4
    _ = 2 ^ 7 := by norm_num
    _ = 128 := by norm_num

/-- Primer 2 b: 5⁶ : 5⁴ = 5⁶⁻⁴ = 5² = 25; preizkus 5⁶ = 15 625, 5⁴ = 625, 15 625 : 625 = 25.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#primer2b
besedilo: »$5^6 : 5^4 = 5^{6-4} = 5^2 = 25$« -/
theorem primer2b : (5 : ℝ) ^ 6 / 5 ^ 4 = 25 ∧ (5 : ℝ) ^ 6 = 15625 ∧ (5 : ℝ) ^ 4 = 625 ∧
    (15625 : ℝ) / 625 = 25 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  calc (5 : ℝ) ^ 6 / 5 ^ 4 = 5 ^ (6 - 4) := deljenje_potenc 5 6 4 (by norm_num) (by norm_num)
    _ = 5 ^ 2 := by norm_num
    _ = 25 := by norm_num

/-- Primer 2 c: a⁵ · a² = a⁵⁺² = a⁷.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#primer2c
besedilo: »$a^5 \cdot a^2 = a^{5+2} = a^7$« -/
theorem primer2c (a : ℝ) : a ^ 5 * a ^ 2 = a ^ 7 := by
  calc a ^ 5 * a ^ 2 = a ^ (5 + 2) := mnozenje_potenc a 5 2
    _ = a ^ 7 := by norm_num

/-! ## Primer 3: podatki iz vesoljske sonde -/

/-- Primer 3: vseh bajtov je 2⁵ · 2²⁰ = 2²⁵ = 33 554 432; čas 2²⁵ : 2¹⁵ = 2¹⁰ = 1024 s; ker je
17 · 60 = 1020, je to 17 min in 4 s.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#primer3
besedilo: »Odgovor: sonda pošlje $2^{25}$ bajtov (to je $33\,554\,432$ bajtov), prenos traja $1024\,\text{s}$, približno $17$ minut.« -/
theorem primer3 :
    (2 : ℝ) ^ 5 * 2 ^ 20 = 2 ^ 25 ∧ (2 : ℝ) ^ 25 = 33554432 ∧ (2 : ℝ) ^ 25 / 2 ^ 15 = 2 ^ 10 ∧
      (2 : ℝ) ^ 10 = 1024 ∧ (17 : ℝ) * 60 = 1020 ∧ (1024 : ℝ) = 17 * 60 + 4 := by
  refine ⟨mnozenje_potenc 2 5 20, by norm_num, deljenje_potenc 2 25 15 (by norm_num) (by norm_num),
    by norm_num, by norm_num, by norm_num⟩

/-! ## Primer 4: papir, prepognjen 10-krat -/

/-- Primer 4, korak 1: če ima list na začetku 1 plast in vsak pregib podvoji število plasti, je po n
pregibih plasti natanko 2ⁿ (enolično določeno).
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#plasti
besedilo: »Po $n$ pregibih je plasti $2^n$.« -/
theorem plasti (L : ℕ → ℕ) (h0 : L 0 = 1) (h : ∀ n, L (n + 1) = 2 * L n) (n : ℕ) : L n = 2 ^ n := by
  induction n with
  | zero => simp [h0]
  | succ k ih => rw [h k, ih, pow_succ]; ring

/-- Predpostavke `plasti` se dajo izpolniti (L n = 2ⁿ). -/
example : ∃ L : ℕ → ℕ, L 0 = 1 ∧ ∀ n, L (n + 1) = 2 * L n :=
  ⟨fun n => 2 ^ n, by simp, fun n => by ring⟩

/-- Primer 4, korak 1: po 1 pregibu 2 plasti, po 2 pregibih 2 · 2 = 2² = 4, po 3 pregibih 2³ = 8.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#plasti-prvi
besedilo: »Po $1$ pregibu sta $2$ plasti, po $2$ pregibih $2 \cdot 2 = 2^2 = 4$, po $3$ pregibih $2^3 = 8$.« -/
theorem plasti_prvi : (2 : ℕ) ^ 1 = 2 ∧ (2 : ℕ) * 2 = 2 ^ 2 ∧ (2 : ℕ) ^ 2 = 4 ∧ (2 : ℕ) ^ 3 = 8 := by norm_num

/-- Primer 4, korak 2 in premisli: 2¹⁰ = 2⁵ · 2⁵ = 32 · 32 = 1024 plasti; debelina 1024 · 0,1 mm = 102,4 mm
= 10,24 cm, debelejši od 1 cm (10 mm).
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#primer4
besedilo: »$2^5 = 32$, zato je $2^{10} = 32 \cdot 32 = 1024$ plasti. Debelina: $1024 \cdot 0{,}1\,\text{mm} = 102{,}4\,\text{mm}$, približno $10\,\text{cm}$, torej precej debelejši od $1\,\text{cm}$.« -/
theorem primer4 :
    (2 : ℝ) ^ 10 = 1024 ∧ (1024 : ℝ) * (1 / 10) = 1024 / 10 ∧ (1024 / 10 : ℝ) / 10 = 1024 / 100 ∧
      (1024 / 10 : ℝ) > 10 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  calc (2 : ℝ) ^ 10 = 2 ^ 5 * 2 ^ 5 := by rw [mnozenje_potenc]
    _ = 32 * 32 := by norm_num
    _ = 1024 := by norm_num

/-! ## Drugače: Na sliki -/

/-- Na sliki: kvadrat 5 × 5 ima 5 vrstic po 5 ploščic, 5² = 25; kocka z robom 3 ima 3 plasti po 3 · 3 = 9
kockic, 3³ = 27.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#na-sliki
besedilo: »kocka z robom $3$ ima $3$ plasti, v vsaki je $3 \cdot 3 = 9$ kockic, skupaj $27$ kockic« -/
theorem na_sliki :
    Fintype.card (Fin 5 × Fin 5) = 5 ^ 2 ∧ (5 : ℕ) ^ 2 = 25 ∧
      Fintype.card (Fin 3 × Fin 3 × Fin 3) = 3 ^ 3 ∧ (3 : ℕ) * 3 = 9 ∧ (3 : ℕ) * 9 = 27 ∧ (3 : ℕ) ^ 3 = 27 := by
  refine ⟨by simp, by norm_num, by simp, by norm_num, by norm_num, by norm_num⟩

/-- Na sliki (kroglice): 2 · 2 · 2 · (2 · 2) = 2 · 2 · 2 · 2 · 2, kroglic je 3 + 2 = 5; pri deljenju od petih
snamemo dve in ostanejo 5 − 2 = 3.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#kroglice
besedilo: »Dve vrvici zvežeš v eno. Kroglic je $3 + 2 = 5$, zato je eksponent vsota. Pri deljenju z ene vrvice kroglice snameš: od petih jih vzameš dve in ostanejo tri.« -/
theorem kroglice : (2 : ℝ) * 2 * 2 * (2 * 2) = 2 * 2 * 2 * 2 * 2 ∧ 3 + 2 = 5 ∧ 5 - 2 = 3 := by
  refine ⟨by ring, rfl, rfl⟩

/-! ## Drugače: Iz vsakdanjega življenja -/

/-- Verižno sporočilo: če ga v 1. krogu prejmejo 3 osebe in se v vsakem krogu število pomnoži s 3, ga v
k-tem krogu (k ≥ 1) prejme natanko 3ᵏ oseb.
pomozno – splošni zapis 3ᵏ v lekciji ni izrečen (le krogi 1–4, trditev verizno-krogi) -/
theorem verizno (R : ℕ → ℕ) (h1 : R 1 = 3) (h : ∀ k, 1 ≤ k → R (k + 1) = 3 * R k) (k : ℕ) (hk : 1 ≤ k) :
    R k = 3 ^ k := by
  induction k, hk using Nat.le_induction with
  | base => simp [h1]
  | succ k hk ih => rw [h k hk, ih, pow_succ]; ring

/-- Predpostavke `verizno` se dajo izpolniti (R k = 3ᵏ). -/
example : ∃ R : ℕ → ℕ, R 1 = 3 ∧ ∀ k, 1 ≤ k → R (k + 1) = 3 * R k :=
  ⟨fun k => 3 ^ k, by simp, fun k _ => by ring⟩

/-- Verižno sporočilo: 3¹ = 3, 3 · 3 = 3² = 9, 3³ = 27, 3⁴ = 81.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#verizno-krogi
besedilo: »V 1. krogu ga prejmejo $3$ osebe: $3^1 = 3$. - V 2. krogu ga prejme $3 \cdot 3 = 3^2 = 9$ oseb. - V 3. krogu ga prejme $3^3 = 27$ oseb. - V 4. krogu ga prejme $3^4 = 81$ oseb.« -/
theorem verizno_krogi : (3 : ℕ) ^ 1 = 3 ∧ (3 : ℕ) * 3 = 3 ^ 2 ∧ (3 : ℕ) ^ 2 = 9 ∧ (3 : ℕ) ^ 3 = 27 ∧
    (3 : ℕ) ^ 4 = 81 := by norm_num

/-- Verižno sporočilo, deljenje: 3⁵ = 243, 3³ = 27, 3⁵ : 3³ = 3² = 9 in 243 : 27 = 9.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#verizno-deljenje
besedilo: »V 5. krogu sporočilo prejme $3^5 = 243$ oseb, v 3. krogu $3^3 = 27$ oseb. Peti krog je večji za faktor $3^5 : 3^3 = 3^2 = 9$. Res: $243 : 27 = 9$.« -/
theorem verizno_deljenje : (3 : ℝ) ^ 5 = 243 ∧ (3 : ℝ) ^ 3 = 27 ∧ (3 : ℝ) ^ 5 / 3 ^ 3 = 3 ^ 2 ∧
    (3 : ℝ) ^ 2 = 9 ∧ (243 : ℝ) / 27 = 9 := by
  refine ⟨by norm_num, by norm_num, deljenje_potenc 3 5 3 (by norm_num) (by norm_num), by norm_num,
    by norm_num⟩

/-! ## Preveri se -/

/-- Preveri se 1: 5³ = 5 · 5 · 5 = 125; 5³ ≠ 5 · 3 in 5³ ≠ 3⁵ = 243.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#preveri1
besedilo: »$5^3 = 5 \cdot 5 \cdot 5 = 125$: osnova $5$ se kot faktor pojavi trikrat.« -/
theorem preveri1 : (5 : ℝ) ^ 3 = 5 * 5 * 5 ∧ (5 : ℝ) ^ 3 = 125 ∧ (5 : ℝ) ^ 3 ≠ 5 * 3 ∧ (3 : ℝ) ^ 5 = 243 ∧
    (5 : ℝ) ^ 3 ≠ 3 ^ 5 := by
  norm_num

/-- Preveri se 2: 2³ · 2² = 2³⁺² = 2⁵ = 32 (preizkus 8 · 4 = 32); napačni 12 = 8 + 4, 64 = 2⁶,
1024 = 4⁵ niso pravilni.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#preveri2
besedilo: »$2^3 \cdot 2^2 = 2^{3+2} = 2^5 = 32$. Preizkus: $8 \cdot 4 = 32$.« -/
theorem preveri2 : (2 : ℝ) ^ 3 * 2 ^ 2 = 32 ∧ (8 : ℝ) * 4 = 32 ∧ (2 : ℝ) ^ 3 * 2 ^ 2 ≠ 8 + 4 ∧
    (2 : ℝ) ^ 3 * 2 ^ 2 ≠ 2 ^ 6 ∧ (2 : ℝ) ^ 3 * 2 ^ 2 ≠ 4 ^ 5 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  calc (2 : ℝ) ^ 3 * 2 ^ 2 = 2 ^ (3 + 2) := mnozenje_potenc 2 3 2
    _ = 2 ^ 5 := by norm_num
    _ = 32 := by norm_num

/-- Preveri se 3: Tim se je zmotil: 3⁸ : 3² = 3⁸⁻² = 3⁶ = 729, ne 3⁴ = 81.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#preveri3
besedilo: »$3^8 : 3^2 = 3^{8-2} = 3^6 = 729$. Eksponenta pri deljenju odštejemo.« -/
theorem preveri3 : (3 : ℝ) ^ 8 / 3 ^ 2 = 729 ∧ (3 : ℝ) ^ 4 = 81 ∧ (3 : ℝ) ^ 8 / 3 ^ 2 ≠ 3 ^ 4 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  calc (3 : ℝ) ^ 8 / 3 ^ 2 = 3 ^ (8 - 2) := deljenje_potenc 3 8 2 (by norm_num) (by norm_num)
    _ = 3 ^ 6 := by norm_num
    _ = 729 := by norm_num

/-- Preveri se 5: zvezd je 4³ · 4² = 4³⁺² = 4⁵ = 1024 (preizkus 64 · 16 = 1024); napačni 80 = 64 + 16,
4096 = 4⁶ in 16⁵ niso pravilni.
trditev: MAT-OS-8/potence-z-naravnimi-eksponenti#preveri5
besedilo: »$4^3 \cdot 4^2 = 4^{3+2} = 4^5 = 1024$. Preizkus: $64 \cdot 16 = 1024$.« -/
theorem preveri5 : (4 : ℝ) ^ 3 * 4 ^ 2 = 1024 ∧ (64 : ℝ) * 16 = 1024 ∧ (4 : ℝ) ^ 3 * 4 ^ 2 ≠ 64 + 16 ∧
    (4 : ℝ) ^ 6 = 4096 ∧ (4 : ℝ) ^ 3 * 4 ^ 2 ≠ 4 ^ 6 ∧ (4 : ℝ) ^ 3 * 4 ^ 2 ≠ 16 ^ 5 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  calc (4 : ℝ) ^ 3 * 4 ^ 2 = 4 ^ (3 + 2) := mnozenje_potenc 4 3 2
    _ = 4 ^ 5 := by norm_num
    _ = 1024 := by norm_num

end Evklid.Lekcije.MAT_OS_8.PotenceZNaravnimiEksponenti
