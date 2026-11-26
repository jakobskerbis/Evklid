/-
vir: content/lessons/MAT-OS-8/realna-stevila.md
sha256: dcccfff93de75b3345ab3e5c17951907ac6e9721e3126e8d1fa189edb9a631f1
Ni v Leanu: splošna trditev »racionalno ⇔ decimalni zapis je končen ali periodičen« (in »iracionalno ⇔
neskončen neperiodičen«) – zahtevno, še ni dokazano; dokazano je, da so periodični zapisi 0,333…, 0,121212…
in 0,142857142857… (1/7) racionalni (zapis kot vrsta Σ p/(10ᴸ)ᵏ⁺¹ = p/(10ᴸ − 1)) in da so √2, √3, √7, π
iracionalni (`Irrational`); da končni približek √2 ne da kvadrata 2, je dokazano za vsa decimalna števila
m/10ⁿ. Številska premica in povečevalno steklo kot sliki: »natanko ena točka za vsako realno število« in
»iracionalna števila zapolnijo luknje« sta geometrija premice (dokazane so lege kot neenakosti); risba in
simulacija kot sliki; zgodbe (kalkulator, nalepka, ura, pametna ura, fotografije, ikona) kot modeli:
dokazani so računi in da je stranica kvadrata s ploščino S edino pozitivno število a z a² = S, a = √S;
»približno« (≈) je dokazano kot ocena med dvema decimalnima številoma, iz katere sledi zaokrožitev; da
kalkulator kaže deset mest, je opis naprave. Besedilo napačnih odgovorov kviza (dokazano je, da napačne
vrednosti niso pravilne). Naravna števila lekcije so 1, 2, 3, … (v Leanu ℕ vsebuje 0, zato je množica ℕ
lekcije zapisana kot {n : n ≥ 1}); racionalno število je `Set.range (Rat.cast)`, `Irrational x` pomeni
x ∉ ℚ. √ je `Real.sqrt` (za negativne vrednosti v Leanu 0; vsi koreni v lekciji so od pozitivnih števil).
Decimalna števila so točni racionalni zapisi v ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.RealnaStevila

open Real

/-! ## Pomožne trditve -/

/-- Pomožno: če je y > 0 in y² = x, je √x = y. -/
theorem koren (x y : ℝ) (hy : 0 < y) (h : y ^ 2 = x) : √x = y := by
  rw [← h]; exact Real.sqrt_sq hy.le

/-- Predpostavki `koren` se dasta izpolniti (y = 3, x = 9). -/
example : (0 : ℝ) < 3 ∧ (3 : ℝ) ^ 2 = 9 := by norm_num

/-- Pomožno: če je 0 ≤ a, a² < x < b² in b > 0, je a < √x < b. -/
theorem med (x a b : ℝ) (ha : 0 ≤ a) (hb : 0 < b) (h1 : a ^ 2 < x) (h2 : x < b ^ 2) : a < √x ∧ √x < b :=
  ⟨(Real.lt_sqrt ha).mpr h1, (Real.sqrt_lt' hb).mpr h2⟩

/-- Predpostavke `med` se dajo izpolniti (x = 2, a = 1, b = 2). -/
example : (0 : ℝ) ≤ 1 ∧ (0 : ℝ) < 2 ∧ (1 : ℝ) ^ 2 < 2 ∧ (2 : ℝ) < 2 ^ 2 := by norm_num

/-- Pomožno: naravno število n med zaporednima kvadratoma k² < n < (k + 1)² ni popolni kvadrat. -/
theorem ni_popolni_kvadrat (n k : ℕ) (h1 : k ^ 2 < n) (h2 : n < (k + 1) ^ 2) : ¬ IsSquare n := by
  rintro ⟨r, rfl⟩
  rcases Nat.lt_or_ge k r with h | h
  · have := Nat.mul_le_mul h h
    nlinarith
  · have := Nat.mul_le_mul h h
    nlinarith

/-- Predpostavki `ni_popolni_kvadrat` se dasta izpolniti (n = 7, k = 2). -/
example : (2 : ℕ) ^ 2 < 7 ∧ 7 < (2 + 1) ^ 2 := by norm_num

/-- Pomožno: periodični decimalni zapis z dobo p dolžine L (0,ppp…) je vrsta Σ p/(10ᴸ)ᵏ⁺¹ in je enak
ulomku p/(10ᴸ − 1). -/
theorem periodicni (p : ℝ) (L : ℕ) (hL : 0 < L) :
    ∑' k : ℕ, p / (10 ^ L) ^ (k + 1) = p / (10 ^ L - 1) := by
  have h1 : (1 : ℝ) < 10 ^ L := one_lt_pow₀ (by norm_num) hL.ne'
  have hpos : (0 : ℝ) < 10 ^ L := by positivity
  have hr0 : (0 : ℝ) ≤ 1 / 10 ^ L := by positivity
  have hr1 : (1 : ℝ) / 10 ^ L < 1 := by rw [div_lt_one hpos]; exact h1
  have hf : (fun k : ℕ => p / (10 ^ L) ^ (k + 1)) = fun k => (p / 10 ^ L) * (1 / 10 ^ L) ^ k := by
    funext k
    rw [pow_succ, one_div_pow]
    field_simp
  rw [hf, tsum_mul_left, tsum_geometric_of_lt_one hr0 hr1]
  have : (10 : ℝ) ^ L - 1 ≠ 0 := by linarith
  field_simp

/-- Predpostavka `periodicni` se da izpolniti (L = 1). -/
example : 0 < 1 := Nat.one_pos

/-! ## Zakaj se tega učimo -/

/-- Zakaj se tega učimo: kalkulator pokaže √2 ≈ 1,414213562 (1,414213562 < √2 < 1,414213563); kvadrat
prikazanega števila je 1,99999999894…, ne natanko 2. -/
theorem kalkulator :
    (1.414213562 : ℝ) < √2 ∧ √2 < 1.414213563 ∧ (1.99999999894 : ℝ) < 1.414213562 ^ 2 ∧
      (1.414213562 : ℝ) ^ 2 < 1.99999999895 ∧ (1.414213562 : ℝ) ^ 2 ≠ 2 := by
  obtain ⟨h1, h2⟩ := med 2 1.414213562 1.414213563 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  exact ⟨h1, h2, by norm_num, by norm_num, by norm_num⟩

/-- Zakaj se tega učimo: kvadratna nalepka s ploščino 2 cm² ima stranico √2 cm: √2 je edino pozitivno
število a z a² = 2; √2 je iracionalen. -/
theorem nalepka (a : ℝ) (ha : 0 < a) : (a ^ 2 = 2 ↔ a = √2) ∧ Irrational √2 := by
  refine ⟨⟨fun h => (koren 2 a ha h).symm, fun h => by rw [h]; exact Real.sq_sqrt (by norm_num)⟩,
    irrational_sqrt_two⟩

/-- Predpostavka `nalepka` se da izpolniti (a = 1). -/
example : (0 : ℝ) < 1 := one_pos

/-! ## Razlaga 1: racionalna števila -/

/-- Razlaga 1: število je racionalno (x ∈ ℚ) natanko tedaj, ko ga zapišemo kot m/n z m celim in n
naravnim (n ≥ 1). -/
theorem racionalno_iff (x : ℝ) : (∃ q : ℚ, (q : ℝ) = x) ↔ ∃ m : ℤ, ∃ n : ℕ, 0 < n ∧ x = m / n := by
  constructor
  · rintro ⟨q, rfl⟩
    exact ⟨q.num, q.den, q.pos, Rat.cast_def q⟩
  · rintro ⟨m, n, -, rfl⟩
    exact ⟨m / n, by push_cast; ring⟩

/-- Razlaga 1: 5 = 5/1, −3 = −3/1, 0,75 = 3/4; hitra preizkušnja: −1,5 = −3/2. -/
theorem racionalni_primeri :
    (5 : ℝ) = (5 : ℤ) / (1 : ℕ) ∧ (-3 : ℝ) = (-3 : ℤ) / (1 : ℕ) ∧ (0.75 : ℝ) = (3 : ℤ) / (4 : ℕ) ∧
      (-1.5 : ℝ) = (-3 : ℤ) / (2 : ℕ) := by
  norm_num

/-- Razlaga 1 in Pogoste napake 2: periodično število 0,333… = 3/10 + 3/100 + … = 1/3 je racionalno. -/
theorem nic_cela_tri : ∑' k : ℕ, (3 : ℝ) / (10 ^ 1) ^ (k + 1) = 1 / 3 := by
  rw [periodicni 3 1 (by norm_num)]; norm_num

/-! ## Razlaga 2: iracionalna števila -/

/-- Razlaga 2: število je iracionalno natanko tedaj, ko ga ni mogoče zapisati kot ulomek m/n. -/
theorem iracionalno_iff (x : ℝ) : Irrational x ↔ ¬ ∃ m : ℤ, ∃ n : ℕ, 0 < n ∧ x = m / n := by
  rw [← racionalno_iff]; rfl

/-- Razlaga 2 in Povzetek: √2, √3 in π so iracionalni; √2 = 1,41421356…, √3 = 1,7320508…,
π = 3,14159265… -/
theorem iracionalni_primeri :
    Irrational √2 ∧ Irrational √3 ∧ Irrational π ∧
      ((1.41421356 : ℝ) < √2 ∧ √2 < 1.41421357) ∧ ((1.7320508 : ℝ) < √3 ∧ √3 < 1.7320509) ∧
      ((3.14159265 : ℝ) < π ∧ π < 3.14159266) := by
  refine ⟨irrational_sqrt_two, irrational_sqrt_ofNat_iff.mpr (ni_popolni_kvadrat 3 1 (by norm_num)
    (by norm_num)), irrational_pi, med 2 _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    med 3 _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num), ?_, ?_⟩
  · have := Real.pi_gt_d20; linarith
  · have := Real.pi_lt_d20; linarith

/-- Razlaga 2 (hitra preizkušnja): 0,121212… = 12/100 + 12/10000 + … = 12/99 = 4/33 je periodično in
racionalno, ne iracionalno. -/
theorem nic_cela_dvanajst : ∑' k : ℕ, (12 : ℝ) / (10 ^ 2) ^ (k + 1) = 4 / 33 ∧
    ¬ Irrational (∑' k : ℕ, (12 : ℝ) / (10 ^ 2) ^ (k + 1)) := by
  have h : ∑' k : ℕ, (12 : ℝ) / (10 ^ 2) ^ (k + 1) = 4 / 33 := by
    rw [periodicni 12 2 (by norm_num)]; norm_num
  refine ⟨h, ?_⟩
  rw [h]
  exact fun hi => hi ⟨4 / 33, by push_cast; ring⟩

/-- Razlaga 2 (premisli): pri 1/7 se skupina 142857 ponavlja v nedogled (1/7 = 0,142857142857…), zaslon
pa zapis le odreže (|1/7 − 0,1428571429| < 10⁻¹⁰); √2 je iracionalen. -/
theorem ena_sedmina :
    ∑' k : ℕ, (142857 : ℝ) / (10 ^ 6) ^ (k + 1) = 1 / 7 ∧ |(1 / 7 : ℝ) - 0.1428571429| < 1 / 10 ^ 10 ∧
      Irrational √2 := by
  refine ⟨?_, ?_, irrational_sqrt_two⟩
  · rw [periodicni 142857 6 (by norm_num)]; norm_num
  · rw [abs_lt]; constructor <;> norm_num

/-! ## Razlaga 3: kdaj je koren iracionalen -/

/-- Razlaga 3 in Povzetek: za naravni n je √n naravno število, če je n popolni kvadrat, sicer je √n
iracionalno; Primer 1 (formula): √n je racionalen natanko tedaj, ko je n popolni kvadrat. -/
theorem koren_naravnega (n : ℕ) :
    (IsSquare n → ∃ k : ℕ, √(n : ℝ) = k) ∧ (¬ IsSquare n → Irrational √(n : ℝ)) ∧
      (¬ Irrational √(n : ℝ) ↔ IsSquare n) := by
  refine ⟨?_, irrational_sqrt_natCast_iff.mpr, by rw [irrational_sqrt_natCast_iff, not_not]⟩
  rintro ⟨k, rfl⟩
  exact ⟨k, by push_cast; exact Real.sqrt_mul_self (Nat.cast_nonneg k)⟩

/-- Razlaga 3: popolni kvadrati 1, 4, 9, 16, 25 so 1², 2², 3², 4², 5²; √16 = 4; hitra preizkušnja:
√36 = 6 ni iracionalno. -/
theorem popolni_kvadrati :
    ((1 : ℕ) = 1 ^ 2 ∧ (4 : ℕ) = 2 ^ 2 ∧ (9 : ℕ) = 3 ^ 2 ∧ (16 : ℕ) = 4 ^ 2 ∧ (25 : ℕ) = 5 ^ 2) ∧
      √(16 : ℝ) = 4 ∧ √(36 : ℝ) = 6 ∧ ¬ Irrational √(36 : ℝ) := by
  have h36 : √(36 : ℝ) = 6 := koren 36 6 (by norm_num) (by norm_num)
  refine ⟨by norm_num, koren 16 4 (by norm_num) (by norm_num), h36, ?_⟩
  rw [h36]; exact fun hi => hi ⟨6, by norm_num⟩

/-- Razlaga 3: √2, √7 in √10 so iracionalni (2, 7, 10 niso popolni kvadrati). -/
theorem iracionalni_koreni : Irrational √(2 : ℝ) ∧ Irrational √(7 : ℝ) ∧ Irrational √(10 : ℝ) :=
  ⟨irrational_sqrt_two,
    irrational_sqrt_ofNat_iff.mpr (ni_popolni_kvadrat 7 2 (by norm_num) (by norm_num)),
    irrational_sqrt_ofNat_iff.mpr (ni_popolni_kvadrat 10 3 (by norm_num) (by norm_num))⟩

/-! ## Razlaga 4: realna števila -/

/-- Razlaga 4 in Povzetek: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ (vsaka množica je strogo vsebovana v naslednji; primeri, ki
jih ni v manjši: −3, 2/3, √2); iracionalna števila so v ℝ, niso pa v ℚ. Hitra preizkušnja: vsako celo
število je realno. -/
theorem N_Z_Q_R :
    {x : ℝ | ∃ n : ℕ, 1 ≤ n ∧ (n : ℝ) = x} ⊂ Set.range (Int.cast : ℤ → ℝ) ∧
      Set.range (Int.cast : ℤ → ℝ) ⊂ Set.range (Rat.cast : ℚ → ℝ) ∧
      Set.range (Rat.cast : ℚ → ℝ) ⊂ (Set.univ : Set ℝ) ∧
      (∀ x : ℝ, Irrational x ↔ x ∉ Set.range (Rat.cast : ℚ → ℝ)) := by
  have h1 : {x : ℝ | ∃ n : ℕ, 1 ≤ n ∧ (n : ℝ) = x} ⊆ Set.range (Int.cast : ℤ → ℝ) := by
    rintro x ⟨n, -, rfl⟩; exact ⟨n, by simp⟩
  have h2 : Set.range (Int.cast : ℤ → ℝ) ⊆ Set.range (Rat.cast : ℚ → ℝ) := by
    rintro x ⟨z, rfl⟩; exact ⟨z, by simp⟩
  refine ⟨(Set.ssubset_iff_of_subset h1).mpr ⟨-3, ⟨-3, by simp⟩, ?_⟩,
    (Set.ssubset_iff_of_subset h2).mpr ⟨2 / 3, ⟨2 / 3, by push_cast; ring⟩, ?_⟩,
    (Set.ssubset_iff_of_subset (Set.subset_univ _)).mpr ⟨√2, trivial, irrational_sqrt_two⟩,
    fun x => Iff.rfl⟩
  · rintro ⟨n, -, hn⟩
    have : (0 : ℝ) ≤ n := Nat.cast_nonneg n
    linarith
  · rintro ⟨z, hz⟩
    have a : (0 : ℝ) < z := by rw [hz]; norm_num
    have b : (z : ℝ) < 1 := by rw [hz]; norm_num
    have a' : (0 : ℤ) < z := by exact_mod_cast a
    have b' : z < (1 : ℤ) := by exact_mod_cast b
    omega

/-- Razlaga 4, tabela: 1, 7 in √9 = 3 so naravna; −3, 0, 7 cela; 2/3, −1,5 in 0,333… = 1/3 racionalna;
√2, π in −√5 so realna, a iracionalna. -/
theorem tabela :
    √(9 : ℝ) = 3 ∧ (2 / 3 : ℝ) = (2 : ℤ) / (3 : ℕ) ∧ (-1.5 : ℝ) = (-3 : ℤ) / (2 : ℕ) ∧
      Irrational √2 ∧ Irrational π ∧ Irrational (-√5) := by
  refine ⟨koren 9 3 (by norm_num) (by norm_num), by norm_num, by norm_num, irrational_sqrt_two,
    irrational_pi, ?_⟩
  exact (irrational_sqrt_ofNat_iff.mpr (ni_popolni_kvadrat 5 2 (by norm_num) (by norm_num))).neg

/-! ## Razlaga 5: številska premica -/

/-- Razlaga 5: 1² = 1 < 2 < 4 = 2², zato je 1 < √2 < 2 (tudi Na sliki, brez povečave). -/
theorem koren2_med_1_2 : (1 : ℝ) ^ 2 = 1 ∧ (2 : ℝ) ^ 2 = 4 ∧ (1 : ℝ) < √2 ∧ √2 < 2 := by
  obtain ⟨h1, h2⟩ := med 2 1 2 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  exact ⟨by norm_num, by norm_num, h1, h2⟩

/-- Razlaga 5 (premisli) in Pogoste napake 4: 4 < 5 < 9, zato 2 < √5 < 3, √5 ≈ 2,24
(2,235 < √5 < 2,245); −√5 ≈ −2,24 leži levo od −2, med −3 in −2, in ne med 2 in 3. -/
theorem minus_koren5 :
    ((2 : ℝ) < √5 ∧ √5 < 3) ∧ ((2.235 : ℝ) < √5 ∧ √5 < 2.245) ∧ -√5 < -2 ∧ (-3 : ℝ) < -√5 ∧
      ¬ ((2 : ℝ) < -√5) := by
  obtain ⟨a, b⟩ := med 5 2 3 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨c, d⟩ := med 5 2.235 2.245 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  exact ⟨⟨a, b⟩, ⟨c, d⟩, by linarith, by linarith, by linarith⟩

/-! ## Razlaga 6: približki -/

/-- Razlaga 6, tabela: 1,4² = 1,96 < 2, 1,5² = 2,25 > 2, 1,41² = 1,9881 < 2, 1,42² = 2,0164 > 2; torej
1,41 < √2 < 1,42 (in √2 ≈ 1,41, ne √2 = 1,41). -/
theorem priblizki_koren2 :
    (1.4 : ℝ) ^ 2 = 1.96 ∧ (1.5 : ℝ) ^ 2 = 2.25 ∧ (1.41 : ℝ) ^ 2 = 1.9881 ∧ (1.42 : ℝ) ^ 2 = 2.0164 ∧
      ((1.41 : ℝ) < √2 ∧ √2 < 1.42) ∧ √2 ≠ 1.41 := by
  obtain ⟨a, b⟩ := med 2 1.41 1.42 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  exact ⟨by norm_num, by norm_num, by norm_num, by norm_num, ⟨a, b⟩, by linarith⟩

/-- Razlaga 6 in Na sliki: postopek se nikoli ne konča s kvadratom natanko 2: noben končni decimalni
približek m/10ⁿ ni √2 (točka √2 nikoli ne pade natanko na oznako). -/
theorem nikoli_natanko (m : ℤ) (n : ℕ) : √2 ≠ (m : ℝ) / 10 ^ n ∧ ((m : ℝ) / 10 ^ n) ^ 2 ≠ 2 := by
  have hq : ¬ Irrational ((m : ℝ) / 10 ^ n) := fun hi => hi ⟨m / 10 ^ n, by push_cast; ring⟩
  refine ⟨fun h => hq (h ▸ irrational_sqrt_two), fun h => ?_⟩
  have hx : 0 ≤ (m : ℝ) / 10 ^ n ∨ (m : ℝ) / 10 ^ n < 0 := le_or_gt 0 _
  rcases hx with hx | hx
  · have : √2 = (m : ℝ) / 10 ^ n := by rw [← h]; exact Real.sqrt_sq hx
    exact hq (this ▸ irrational_sqrt_two)
  · have : √2 = -((m : ℝ) / 10 ^ n) := by rw [← h, ← neg_sq]; exact Real.sqrt_sq (by linarith)
    have h3 : Irrational (-((m : ℝ) / 10 ^ n)) := this ▸ irrational_sqrt_two
    exact hq h3.of_neg

/-! ## Primer 1: razvrščanje števil -/

/-- Primer 1, koraki 1–3 in 6: 7 = 7/1, −3 = −3/1, 0,5 = 1/2 so racionalni; √9 = 3 (3² = 9);
√(16/25) = 4/5 ((4/5)² = 16/25). -/
theorem primer1_racionalni :
    (7 : ℝ) = (7 : ℤ) / (1 : ℕ) ∧ (-3 : ℝ) = (-3 : ℤ) / (1 : ℕ) ∧ (0.5 : ℝ) = (1 : ℤ) / (2 : ℕ) ∧
      (3 : ℝ) ^ 2 = 9 ∧ √(9 : ℝ) = 3 ∧ (4 / 5 : ℝ) ^ 2 = 16 / 25 ∧ √(16 / 25 : ℝ) = 4 / 5 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, koren 9 3 (by norm_num) (by norm_num),
    by norm_num, koren _ _ (by norm_num) (by norm_num)⟩

/-- Primer 1, korak 4: 2² = 4 < 7 < 9 = 3², 7 ni popolni kvadrat, √7 je iracionalen. -/
theorem primer1_koren7 : (2 : ℕ) ^ 2 = 4 ∧ (3 : ℕ) ^ 2 = 9 ∧ ¬ IsSquare 7 ∧ Irrational √(7 : ℝ) :=
  ⟨by norm_num, by norm_num, ni_popolni_kvadrat 7 2 (by norm_num) (by norm_num), iracionalni_koreni.2.1⟩

/-- Primer 1, odgovor: od 7, −3, 0,5, √9, √7, π, √(16/25) sta iracionalni natanko √7 in π, vsa druga so
racionalna (vsa so realna). -/
theorem primer1_odgovor :
    ¬ Irrational 7 ∧ ¬ Irrational (-3) ∧ ¬ Irrational 0.5 ∧ ¬ Irrational √(9 : ℝ) ∧ Irrational √(7 : ℝ) ∧
      Irrational π ∧ ¬ Irrational √(16 / 25 : ℝ) := by
  rw [koren 9 3 (by norm_num) (by norm_num), koren (16 / 25) (4 / 5) (by norm_num) (by norm_num)]
  refine ⟨fun h => h ⟨7, by norm_num⟩, fun h => h ⟨-3, by norm_num⟩, fun h => h ⟨1 / 2, by norm_num⟩,
    fun h => h ⟨3, by norm_num⟩, iracionalni_koreni.2.1, irrational_pi, fun h => h ⟨4 / 5, by norm_num⟩⟩

/-! ## Primer 2: položaj na številski premici -/

/-- Primer 2, formula: če je k celo število in k² < x < (k + 1)², je k < √x < k + 1. -/
theorem med_kvadratoma (k : ℤ) (x : ℝ) (h1 : (k : ℝ) ^ 2 < x) (h2 : x < ((k : ℝ) + 1) ^ 2) :
    (k : ℝ) < √x ∧ √x < k + 1 := by
  have hk : (0 : ℤ) ≤ k := by
    by_contra hneg
    have : (k : ℝ) ≤ -1 := by exact_mod_cast (by omega : k ≤ -1)
    nlinarith
  have hk' : (0 : ℝ) ≤ k := by exact_mod_cast hk
  exact med x k (k + 1) hk' (by linarith) h1 h2

/-- Predpostavki `med_kvadratoma` se dasta izpolniti (k = 7, x = 50). -/
example : ((7 : ℤ) : ℝ) ^ 2 < 50 ∧ (50 : ℝ) < (((7 : ℤ) : ℝ) + 1) ^ 2 := by norm_num

/-- Primer 2, koraka 1–2: 7² = 49 < 50 < 64 = 8², zato 7 < √50 < 8; 7,07² = 49,9849, 7,08² = 50,1264, zato
7,07 < √50 < 7,08 in √50 ≈ 7,07 (7,065 < √50 < 7,075); √50 je bližje 7 kot 8. -/
theorem primer2_koren50 :
    (7 : ℝ) ^ 2 = 49 ∧ (8 : ℝ) ^ 2 = 64 ∧ ((7 : ℝ) < √50 ∧ √50 < 8) ∧ (7.07 : ℝ) ^ 2 = 49.9849 ∧
      (7.08 : ℝ) ^ 2 = 50.1264 ∧ ((7.07 : ℝ) < √50 ∧ √50 < 7.08) ∧ ((7.065 : ℝ) < √50 ∧ √50 < 7.075) ∧
      |√50 - 7| < |√50 - 8| := by
  obtain ⟨a, b⟩ := med_kvadratoma 7 50 (by norm_num) (by norm_num)
  obtain ⟨c, d⟩ := med 50 7.07 7.08 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨e, f⟩ := med 50 7.065 7.075 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  push_cast at a b
  refine ⟨by norm_num, by norm_num, ⟨a, by linarith⟩, by norm_num, by norm_num, ⟨c, d⟩, ⟨e, f⟩, ?_⟩
  rw [abs_of_pos (by linarith), abs_of_neg (by linarith)]
  linarith

/-- Primer 2, koraki 3–5: 4² = 16 < 20 < 25 = 5², zato 4 < √20 < 5; 4,47² = 19,9809, 4,48² = 20,0704,
√20 ≈ 4,47 (4,465 < √20 < 4,475); −5 < −√20 < −4, približno −4,47, bližje −4 kot −5. -/
theorem primer2_koren20 :
    ((4 : ℝ) < √20 ∧ √20 < 5) ∧ (4.47 : ℝ) ^ 2 = 19.9809 ∧ (4.48 : ℝ) ^ 2 = 20.0704 ∧
      ((4.47 : ℝ) < √20 ∧ √20 < 4.48) ∧ ((4.465 : ℝ) < √20 ∧ √20 < 4.475) ∧
      ((-5 : ℝ) < -√20 ∧ -√20 < -4) ∧ |-√20 - (-4)| < |-√20 - (-5)| := by
  obtain ⟨a, b⟩ := med_kvadratoma 4 20 (by norm_num) (by norm_num)
  obtain ⟨c, d⟩ := med 20 4.47 4.48 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨e, f⟩ := med 20 4.465 4.475 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  push_cast at a b
  refine ⟨⟨a, by linarith⟩, by norm_num, by norm_num, ⟨c, d⟩, ⟨e, f⟩, ⟨by linarith, by linarith⟩, ?_⟩
  rw [abs_of_neg (by linarith), abs_of_pos (by linarith)]
  linarith

/-! ## Primer 3: zaslon pametne ure -/

/-- Primer 3, formula: stranica kvadrata s ploščino S je a = √S (edino pozitivno a z a² = S). -/
theorem stranica (a S : ℝ) (ha : 0 < a) : a ^ 2 = S ↔ a = √S := by
  constructor
  · intro h; exact (koren S a ha h).symm
  · intro h
    have hS : 0 < S := Real.sqrt_pos.mp (h ▸ ha)
    rw [h]; exact Real.sq_sqrt hS.le

/-- Predpostavka `stranica` se da izpolniti (a = 1). -/
example : (0 : ℝ) < 1 := one_pos

/-- Primer 3, koraki 1–3: √10 je iracionalen; 3,16² = 9,9856, 3,17² = 10,0489, √10 ≈ 3,162 (3,1615 <
√10 < 3,1625); π ≈ 3,1416 (3,14155 < π < 3,14165); 22/7 = 3,142857… (3,142857 < 22/7 < 3,142858). -/
theorem primer3_priblizki :
    Irrational √(10 : ℝ) ∧ (3.16 : ℝ) ^ 2 = 9.9856 ∧ (3.17 : ℝ) ^ 2 = 10.0489 ∧
      ((3.16 : ℝ) < √10 ∧ √10 < 3.17) ∧ ((3.1615 : ℝ) < √10 ∧ √10 < 3.1625) ∧
      ((3.14155 : ℝ) < π ∧ π < 3.14165) ∧ ((3.142857 : ℝ) < 22 / 7 ∧ (22 / 7 : ℝ) < 3.142858) := by
  have p1 := Real.pi_gt_d6
  have p2 := Real.pi_lt_d6
  refine ⟨iracionalni_koreni.2.2, by norm_num, by norm_num,
    med 10 _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    med 10 _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    ⟨by linarith, by linarith⟩, by norm_num, by norm_num⟩

/-- Primer 3, koraki 4–6: 3,1 < π < 22/7 < √10; najbližje √10 je 22/7 (razlika približno 0,02:
0,015 < √10 − 22/7 < 0,025); 22/7 ni π. -/
theorem primer3_vrstni_red :
    (3.1 : ℝ) < π ∧ π < 22 / 7 ∧ (22 / 7 : ℝ) < √10 ∧
      |√10 - 22 / 7| < |√10 - π| ∧ |√10 - π| < |√10 - 3.1| ∧
      ((0.015 : ℝ) < √10 - 22 / 7 ∧ √10 - 22 / 7 < 0.025) ∧ (22 / 7 : ℝ) ≠ π := by
  have p1 := Real.pi_gt_d6
  have p2 := Real.pi_lt_d6
  obtain ⟨a, b⟩ := med 10 3.1615 3.1625 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have c : (22 / 7 : ℝ) < √10 := (Real.lt_sqrt (by norm_num)).mpr (by norm_num)
  refine ⟨by linarith, by linarith, c, ?_, ?_, ⟨by linarith, by linarith⟩, ?_⟩
  · rw [abs_of_pos (by linarith), abs_of_pos (by linarith)]; linarith
  · rw [abs_of_pos (by linarith), abs_of_pos (by linarith)]; linarith
  · intro h
    exact irrational_pi (h ▸ ⟨22 / 7, by push_cast; ring⟩)

/-! ## Primer 4: fotografije -/

/-- Primer 4: 1500² = 2 250 000, zato je slika 1500 × 1500 mogoča (√2 250 000 = 1500); 1414² = 1 999 396
in 1415² = 2 002 225, zato 1414 < √2 000 000 < 1415; 2 000 000 ni popolni kvadrat (ni naravnega a z
a² = 2 000 000), √2 000 000 ≈ 1414,2 (1414,15 < √2 000 000 < 1414,25) je iracionalen. -/
theorem primer4 :
    (1500 : ℕ) ^ 2 = 2250000 ∧ √(2250000 : ℝ) = 1500 ∧ (1414 : ℕ) ^ 2 = 1999396 ∧
      (1415 : ℕ) ^ 2 = 2002225 ∧ ((1414 : ℝ) < √2000000 ∧ √2000000 < 1415) ∧
      ¬ (∃ a : ℕ, a ^ 2 = 2000000) ∧ ((1414.15 : ℝ) < √2000000 ∧ √2000000 < 1414.25) ∧
      Irrational √(2000000 : ℝ) := by
  have hns : ¬ IsSquare 2000000 := ni_popolni_kvadrat 2000000 1414 (by norm_num) (by norm_num)
  refine ⟨by norm_num, koren _ _ (by norm_num) (by norm_num), by norm_num, by norm_num,
    med _ _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num), ?_,
    med _ _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    irrational_sqrt_ofNat_iff.mpr hns⟩
  rintro ⟨a, ha⟩
  exact hns ⟨a, by rw [← ha, sq]⟩

/-! ## Pogoste napake -/

/-- Pogoste napake 1: ni vsak koren iracionalen: √16 = 4 in √0,49 = 0,7 sta racionalna. -/
theorem napaka_koren : √(16 : ℝ) = 4 ∧ √(0.49 : ℝ) = 0.7 ∧ ¬ Irrational √(0.49 : ℝ) := by
  have h : √(0.49 : ℝ) = 0.7 := koren _ _ (by norm_num) (by norm_num)
  refine ⟨koren _ _ (by norm_num) (by norm_num), h, ?_⟩
  rw [h]; exact fun hi => hi ⟨7 / 10, by norm_num⟩

/-- Pogoste napake 3: π ≠ 3,14, √2 ≠ 1,41 in 22/7 ≠ π (to so le približki). -/
theorem napaka_priblizek : π ≠ 3.14 ∧ √2 ≠ 1.41 ∧ (22 / 7 : ℝ) ≠ π :=
  ⟨by have := Real.pi_gt_d6; intro h; rw [h] at this; norm_num at this,
    priblizki_koren2.2.2.2.2.2, primer3_vrstni_red.2.2.2.2.2.2⟩

/-- Pogoste napake 5 in Preveri se 2: √70 ni okrog 35 (70 : 2), ampak 8² = 64 < 70 < 81 = 9², zato
8 < √70 < 9, približno 8,37 (8,365 < √70 < 8,375); ni med 7 in 8. -/
theorem koren70 :
    ((8 : ℝ) < √70 ∧ √70 < 9) ∧ ((8.365 : ℝ) < √70 ∧ √70 < 8.375) ∧ (70 : ℝ) / 2 = 35 ∧ √70 ≠ 35 ∧
      ¬ (√70 < 8) := by
  obtain ⟨a, b⟩ := med 70 8 9 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  refine ⟨⟨a, b⟩, med 70 _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num), by norm_num,
    by intro h; linarith, by intro h; linarith⟩

/-! ## Drugače: Na sliki -/

/-- Na sliki (povečevalno steklo): √2 je med 1 in 2, nato med 1,4 in 1,5, nato med 1,41 in 1,42. -/
theorem povecava : ((1 : ℝ) < √2 ∧ √2 < 2) ∧ ((1.4 : ℝ) < √2 ∧ √2 < 1.5) ∧ ((1.41 : ℝ) < √2 ∧ √2 < 1.42) :=
  ⟨med 2 _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    med 2 _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    med 2 _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num)⟩

/-! ## Drugače: Bolj natančno: zakaj √2 ni ulomek -/

/-- Bolj natančno, korak 2: kvadrat lihega števila je lih, zato je m sod, če je m² sod. -/
theorem sod_kvadrat (m : ℤ) : (Odd m → Odd (m ^ 2)) ∧ (Even (m ^ 2) → Even m) := by
  refine ⟨fun h => h.pow, fun h => ?_⟩
  by_contra hm
  rw [Int.not_even_iff_odd] at hm
  exact (Int.not_even_iff_odd.mpr hm.pow) h

/-- Bolj natančno, koraki 1–4: če bi bil √2 = m/n z okrajšanim ulomkom (m celo, n ≥ 1, brez skupnega
delitelja, večjega od 1), bi bilo m² = 2n², m = 2k, n² = 2k², zato m in n soda – protislovje. -/
theorem koren2_ni_ulomek (m : ℤ) (n : ℕ) (hn : 0 < n)
    (hokr : ∀ d : ℕ, 1 < d → ¬ ((d : ℤ) ∣ m ∧ (d : ℤ) ∣ (n : ℤ))) : √2 ≠ (m : ℝ) / n := by
  intro h
  have hn' : (n : ℝ) ≠ 0 := by positivity
  -- korak 1: kvadriramo, m² = 2n², m² je sod
  have h1 : (m : ℝ) ^ 2 = 2 * (n : ℝ) ^ 2 := by
    have h2 := Real.sq_sqrt (show (0 : ℝ) ≤ 2 by norm_num)
    rw [h, div_pow] at h2
    field_simp at h2
    linarith
  have h1z : m ^ 2 = 2 * (n : ℤ) ^ 2 := by exact_mod_cast h1
  have hm2 : Even (m ^ 2) := ⟨(n : ℤ) ^ 2, by rw [h1z]; ring⟩
  -- korak 2: m je sod, m = 2k
  obtain ⟨k, hk⟩ := (sod_kvadrat m).2 hm2
  -- korak 3: 4k² = 2n², n² = 2k², n je sod
  have h4 : 4 * k ^ 2 = 2 * (n : ℤ) ^ 2 := by rw [← h1z, hk]; ring
  have h3 : (n : ℤ) ^ 2 = 2 * k ^ 2 := by linarith
  have hn2 : Even ((n : ℤ) ^ 2) := ⟨k ^ 2, by rw [h3]; ring⟩
  obtain ⟨j, hj⟩ := (sod_kvadrat (n : ℤ)).2 hn2
  -- korak 4: skupni delitelj 2
  exact hokr 2 (by norm_num) ⟨⟨k, by rw [hk]; push_cast; ring⟩, ⟨j, by rw [hj]; push_cast; ring⟩⟩

/-- Predpostavke `koren2_ni_ulomek` se dajo izpolniti (m = 1, n = 1: okrajšan ulomek). -/
example : 0 < 1 ∧ ∀ d : ℕ, 1 < d → ¬ ((d : ℤ) ∣ 1 ∧ (d : ℤ) ∣ ((1 : ℕ) : ℤ)) := by
  refine ⟨one_pos, fun d hd ⟨h, _⟩ => ?_⟩
  have := Int.le_of_dvd one_pos h
  omega

/-- Bolj natančno, sklep: √2 ni racionalno število; podobno za koren vsakega naravnega števila, ki ni
popolni kvadrat (`koren_naravnega`). -/
theorem koren2_iracionalen : Irrational √2 := irrational_sqrt_two

/-! ## Preveri se -/

/-- Preveri se 1: √16 = 4 in 0,333… = 1/3 sta racionalna; √15 (15 ni popolni kvadrat) in π sta
iracionalna. -/
theorem preveri1 :
    ¬ Irrational √(16 : ℝ) ∧ ¬ Irrational (∑' k : ℕ, (3 : ℝ) / (10 ^ 1) ^ (k + 1)) ∧
      Irrational √(15 : ℝ) ∧ Irrational π := by
  rw [koren 16 4 (by norm_num) (by norm_num), nic_cela_tri]
  exact ⟨fun h => h ⟨4, by norm_num⟩, fun h => h ⟨1 / 3, by norm_num⟩,
    irrational_sqrt_ofNat_iff.mpr (ni_popolni_kvadrat 15 3 (by norm_num) (by norm_num)), irrational_pi⟩

/-- Preveri se 3: 0,333… = 1/3 je racionalno, √2 ne; velikost ne odloča: 5,5 = 11/2 je racionalno,
√0,5 pa iracionalno. -/
theorem preveri3 :
    ¬ Irrational (∑' k : ℕ, (3 : ℝ) / (10 ^ 1) ^ (k + 1)) ∧ Irrational √2 ∧ ¬ Irrational 5.5 ∧
      Irrational √(0.5 : ℝ) := by
  have h : √(0.5 : ℝ) = √2 / ((2 : ℕ) : ℝ) := by
    apply koren _ _ (by positivity)
    rw [div_pow, Real.sq_sqrt (by norm_num)]; norm_num
  rw [nic_cela_tri, h]
  exact ⟨fun h => h ⟨1 / 3, by norm_num⟩, irrational_sqrt_two, fun h => h ⟨11 / 2, by norm_num⟩,
    irrational_sqrt_two.div_natCast (by norm_num)⟩

/-- Preveri se 4: 36 < 40 < 49, zato 6 < √40 < 7 in √40 je iracionalen; √50 je med 7 in 8 (ne med 6 in 7);
√49 = 7 ni iracionalen; 6,5 = 13/2 leži med 6 in 7, a je racionalen. -/
theorem preveri4 :
    ((6 : ℝ) < √40 ∧ √40 < 7) ∧ Irrational √(40 : ℝ) ∧ (7 : ℝ) < √50 ∧ √(49 : ℝ) = 7 ∧
      ¬ Irrational √(49 : ℝ) ∧ (6 : ℝ) < 6.5 ∧ (6.5 : ℝ) < 7 ∧ ¬ Irrational 6.5 := by
  have h49 : √(49 : ℝ) = 7 := koren _ _ (by norm_num) (by norm_num)
  refine ⟨med 40 _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    irrational_sqrt_ofNat_iff.mpr (ni_popolni_kvadrat 40 6 (by norm_num) (by norm_num)),
    primer2_koren50.2.2.1.1, h49, ?_, by norm_num, by norm_num, fun h => h ⟨13 / 2, by norm_num⟩⟩
  rw [h49]; exact fun h => h ⟨7, by norm_num⟩

/-- Preveri se 5: ikona s ploščino 8 cm² ima stranico √8 cm (edino pozitivno a z a² = 8), ki je
iracionalna, približno 2,83 (2,825 < √8 < 2,835); 4² = 16 ≠ 8 in 2,83² = 8,0089 ≠ 8. -/
theorem preveri5 (a : ℝ) (ha : 0 < a) :
    (a ^ 2 = 8 ↔ a = √8) ∧ Irrational √(8 : ℝ) ∧ ((2.825 : ℝ) < √8 ∧ √8 < 2.835) ∧ (4 : ℝ) ^ 2 = 16 ∧
      (2.83 : ℝ) ^ 2 = 8.0089 ∧ √(8 : ℝ) ≠ 2.83 := by
  refine ⟨stranica a 8 ha, irrational_sqrt_ofNat_iff.mpr (ni_popolni_kvadrat 8 2 (by norm_num) (by norm_num)),
    med 8 _ _ (by norm_num) (by norm_num) (by norm_num) (by norm_num), by norm_num, by norm_num, ?_⟩
  intro h
  have := Real.sq_sqrt (show (0 : ℝ) ≤ 8 by norm_num)
  rw [h] at this; norm_num at this

/-- Predpostavka `preveri5` se da izpolniti (a = √8 > 0). -/
example : (0 : ℝ) < √8 := by positivity

end Evklid.Lekcije.MAT_OS_8.RealnaStevila
