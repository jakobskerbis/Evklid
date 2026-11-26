/-
vir: content/lessons/MAT-SS-2/potence-z-racionalnimi-eksponenti.md
sha256: 521e001abcbe9fdace1747aa13fad20145c7af77530537f68362d4218b3ed3e7
Ni v Leanu: zgodovina (Wallis, Newton) in uvodne zgodbe; besedne utemeljitve (»obe obliki dasta isto
število« je dokazano kot enakost, ne pa razlaga, zakaj je računanje na pamet lažje); dokaz iz ustnega
vprašanja 3 in razdelka »Bolj natančno« po korakih s skupnim imenovalcem (dokazano je pravilo samo,
`Real.rpow_add`); trditev »zapis (−27)^(1/3) ni definiran«: v Leanu je potenca z negativno osnovo
definirana drugače (x^y = exp(log|x|·y)·cos(yπ)), zato je dokazano le, da bi zapisa 1/3 in 2/6 dala
različna korena (−2 in 2); »potence 2^1,4, 2^1,41, 2^1,414, … vedno bolj natančno približujejo
2^√2« kot konvergenca (zahtevno, še ni dokazano; dokazano je, da potence naraščajo in da je
2^1,414 < 2^√2 < 2^1,415); trditev »za vsoto √a + ∛a ni pravila« je dokazana kot: noben eksponent c ne
da a^(1/2) + a^(1/3) = a^c za vse a > 0; opis grafov (»upogiba navzdol«, »raste vedno hitreje« je dokazano kot
stroga konkavnost/konveksnost), simulacija; analogija s klikom (dokazan je le račun); točkovanje;
veterinarski/medicinski modeli kot modeli (dokazani so le računi).
Dogovori Leana: x^y je `Real.rpow`; ⁿ√a je zapisan kot a^(1/n) in dokazano je, da je to edino
nenegativno število z n-to potenco a (`koren_enolicen`). Pravila za racionalne r, s so dokazana kar za
vse realne r, s (močnejša trditev). »≈ v« pomeni, da število leži v intervalu pol enote zadnjega mesta
okoli v (dokazani sta obe meji).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.PotenceZRacionalnimiEksponenti

/-! ## Pomožne trditve -/

/-- Pomožno (za vse približke): če je e·q = p in aᵠ < yᵖ < bᵠ (y > 0, a, b ≥ 0), potem leži y^e
med a in b, ker je (y^e)^q = y^p (a < 0 je trivialno). -/
theorem koren_med {y a b e : ℝ} {p : ℤ} {q : ℕ} (hy : 0 < y)
    (hb : 0 ≤ b) (he : e * q = p) (h1 : a ^ q < y ^ p) (h2 : y ^ p < b ^ q) :
    a < y ^ e ∧ y ^ e < b := by
  have hz0 : 0 ≤ y ^ e := Real.rpow_nonneg hy.le e
  have hz : (y ^ e) ^ q = y ^ p := by
    rw [← Real.rpow_natCast, ← Real.rpow_mul hy.le, he, Real.rpow_intCast]
  constructor
  · by_contra h
    have := pow_le_pow_left₀ hz0 (not_lt.mp h) q
    linarith
  · by_contra h
    have := pow_le_pow_left₀ hb (not_lt.mp h) q
    linarith

/-- Predpostavke trditve `koren_med` se dajo izpolniti (y = 4, e = 1/2, p = 1, q = 2, a = 1, b = 3; a ≥ 0 ni pogoj). -/
example : (0 : ℝ) < 4 ∧ (0 : ℝ) ≤ 3 ∧ (1 / 2 : ℝ) * ((2 : ℕ) : ℝ) = ((1 : ℤ) : ℝ)
    ∧ (1 : ℝ) ^ 2 < (4 : ℝ) ^ (1 : ℤ) ∧ (4 : ℝ) ^ (1 : ℤ) < 3 ^ 2 := by norm_num

/-- Razlaga 3 in 4: n-ti koren. Za a ≥ 0, b ≥ 0 in n ≥ 1 je bⁿ = a natanko tedaj, ko je b = a^(1/n);
a^(1/n) je torej edino nenegativno število, katerega n-ta potenca je a, to je ⁿ√a. -/
theorem koren_enolicen {a b : ℝ} {n : ℕ} (ha : 0 ≤ a) (hb : 0 ≤ b) (hn : n ≠ 0) :
    b ^ n = a ↔ b = a ^ ((1 : ℝ) / n) := by
  constructor
  · intro h
    rw [← h, one_div, Real.pow_rpow_inv_natCast hb hn]
  · intro h
    rw [h, one_div, Real.rpow_inv_natCast_pow ha hn]

/-- Predpostavke trditve `koren_enolicen` se dajo izpolniti (a = 16, b = 2, n = 4). -/
example : (0 : ℝ) ≤ 16 ∧ (0 : ℝ) ≤ 2 ∧ (4 : ℕ) ≠ 0 := by norm_num

/-! ## Razlaga 1: lestev potenc -/

/-- Pomožno: ∜16 = 2. -/
theorem k16_4 : (16 : ℝ) ^ (1 / 4 : ℝ) = 2 := by
  rw [show (16 : ℝ) = 2 ^ (4 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num

/-- Razlaga 1, tabela: 16⁰ = 1, 16^(1/4) = 2, 16^(1/2) = 4, 16^(3/4) = 8, 16¹ = 16; na sredini je
4 = √16. -/
theorem lestev :
    (16 : ℝ) ^ (0 : ℝ) = 1 ∧ (16 : ℝ) ^ (1 / 4 : ℝ) = 2 ∧ (16 : ℝ) ^ (1 / 2 : ℝ) = 4 ∧
    (16 : ℝ) ^ (3 / 4 : ℝ) = 8 ∧ (16 : ℝ) ^ (1 : ℝ) = 16 ∧ Real.sqrt 16 = 4 := by
  refine ⟨by norm_num, k16_4, ?_, ?_, by norm_num, ?_⟩
  · rw [show (16 : ℝ) = 2 ^ (4 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num
  · rw [show (16 : ℝ) = 2 ^ (4 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num
  · rw [show (16 : ℝ) = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Razlaga 1: eksponent zraste za 1/4, vrednost se podvoji: 16^(r + 1/4) = 16^r · 2 za vsak r. -/
theorem lestev_korak (r : ℝ) : (16 : ℝ) ^ (r + 1 / 4) = (16 : ℝ) ^ r * 2 := by
  rw [Real.rpow_add (by norm_num), k16_4]

/-- Razlaga 1, premisli: 16^(5/4) = 16 · 2 = 32 in 16^(−1/4) = 1/2. -/
theorem lestev_naprej : (16 : ℝ) ^ (5 / 4 : ℝ) = 16 * 2 ∧ (16 : ℝ) * 2 = 32 ∧
    (16 : ℝ) ^ (-1 / 4 : ℝ) = 1 / 2 := by
  refine ⟨?_, by norm_num, ?_⟩
  · rw [show (5 / 4 : ℝ) = 1 + 1 / 4 by norm_num, Real.rpow_add (by norm_num), k16_4,
      Real.rpow_one]
  · rw [show (16 : ℝ) = 2 ^ (4 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]
    norm_num [Real.rpow_neg]

/-! ## Razlaga 2: pravila za cele eksponente -/

/-- Razlaga 2: za a ≠ 0 in cela m, n velja aᵐ·aⁿ = aᵐ⁺ⁿ, aᵐ : aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐⁿ,
(a·b)ⁿ = aⁿ·bⁿ, a⁰ = 1 in a⁻ⁿ = 1/aⁿ (pravila brez a ≠ 0 veljajo za vsak a, b). -/
theorem pravila_cela (a b : ℝ) (ha : a ≠ 0) (m n : ℤ) :
    a ^ m * a ^ n = a ^ (m + n) ∧ a ^ m / a ^ n = a ^ (m - n) ∧ (a ^ m) ^ n = a ^ (m * n) ∧
    (a * b) ^ n = a ^ n * b ^ n ∧ a ^ (0 : ℤ) = 1 ∧ a ^ (-n) = 1 / a ^ n :=
  ⟨(zpow_add₀ ha m n).symm, (zpow_sub₀ ha m n).symm, (zpow_mul a m n).symm, mul_zpow a b n,
    zpow_zero a, by rw [zpow_neg, one_div]⟩

/-- Predpostavke trditve `pravila_cela` se dajo izpolniti (a = 2). -/
example : (2 : ℝ) ≠ 0 := by norm_num

/-! ## Razlaga 3: a^(1/2) = √a -/

/-- Razlaga 3: (a^(1/2))² = a^(1/2·2) = a¹ = a, zato je a^(1/2) = √a (a ≥ 0). -/
theorem polovica (a : ℝ) (ha : 0 ≤ a) :
    (a ^ (1 / 2 : ℝ)) ^ 2 = a ^ ((1 / 2 : ℝ) * 2) ∧ a ^ ((1 / 2 : ℝ) * 2) = a ^ (1 : ℝ) ∧
    a ^ (1 : ℝ) = a ∧ a ^ (1 / 2 : ℝ) = Real.sqrt a := by
  refine ⟨?_, by norm_num, Real.rpow_one a, (Real.sqrt_eq_rpow a).symm⟩
  rw [← Real.rpow_natCast, ← Real.rpow_mul ha]; norm_num

/-- Predpostavke trditve `polovica` se dajo izpolniti (a = 9). -/
example : (0 : ℝ) ≤ 9 := by norm_num

/-- Razlaga 3: (a^(1/n))ⁿ = a za a ≥ 0, n ≥ 1. -/
theorem n_ti_koren (a : ℝ) (ha : 0 ≤ a) (n : ℕ) (hn : n ≠ 0) : (a ^ ((1 : ℝ) / n)) ^ n = a := by
  rw [one_div, Real.rpow_inv_natCast_pow ha hn]

/-- Predpostavke trditve `n_ti_koren` se dajo izpolniti (a = 8, n = 3). -/
example : (0 : ℝ) ≤ 8 ∧ (3 : ℕ) ≠ 0 := by norm_num

/-! ## Razlaga 4: definicija -/

/-- Razlaga 4 (definicija): za a > 0, celo m in naravno n je a^(m/n) = ⁿ√(aᵐ) = (ⁿ√a)ᵐ
(ⁿ√ zapisan kot ^(1/n)); velja za vsak n ≥ 1, ne le n ≥ 2. -/
theorem definicija (a : ℝ) (ha : 0 < a) (m : ℤ) (n : ℕ) (hn : n ≠ 0) :
    a ^ ((m : ℝ) / n) = (a ^ m) ^ ((1 : ℝ) / n) ∧ a ^ ((m : ℝ) / n) = (a ^ ((1 : ℝ) / n)) ^ m := by
  have _hn := hn
  constructor
  · rw [← Real.rpow_intCast, ← Real.rpow_mul ha.le]; congr 1; ring
  · rw [← Real.rpow_intCast, ← Real.rpow_mul ha.le]; congr 1; ring

/-- Predpostavke trditve `definicija` se dajo izpolniti (a = 8, n = 3). -/
example : (0 : ℝ) < 8 ∧ (3 : ℕ) ≠ 0 := by norm_num

/-- Pomožno: ∛8 = 2. -/
theorem k8_3 : (8 : ℝ) ^ (1 / 3 : ℝ) = 2 := by
  rw [show (8 : ℝ) = 2 ^ (3 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num

/-- Razlaga 4: 8^(2/3) = (∛8)² = 2² = 4. -/
theorem osem_dve_tretjini : (8 : ℝ) ^ (2 / 3 : ℝ) = 4 := by
  calc (8 : ℝ) ^ (2 / 3 : ℝ) = ((8 : ℝ) ^ (1 / 3 : ℝ)) ^ 2 := by
        rw [← Real.rpow_natCast, ← Real.rpow_mul (by norm_num)]; norm_num
    _ = 2 ^ 2 := by rw [k8_3]
    _ = 4 := by norm_num

/-- Razlaga 4: za osnovo 0 in pozitiven eksponent je 0^(m/n) = 0. -/
theorem nic_osnova (r : ℝ) (hr : 0 < r) : (0 : ℝ) ^ r = 0 := Real.zero_rpow hr.ne'

/-- Predpostavke trditve `nic_osnova` se dajo izpolniti (r = 2/3). -/
example : (0 : ℝ) < 2 / 3 := by norm_num

/-- Razlaga 4, premisli: 0,25^(1/2) = √0,25 = 0,5, kar je več od 0,25 (0,5·0,5 = 0,25 < 0,5). -/
theorem cetrtina : (0.25 : ℝ) ^ (1 / 2 : ℝ) = Real.sqrt 0.25 ∧ Real.sqrt 0.25 = 0.5 ∧
    (0.25 : ℝ) < 0.5 ∧ (0.5 : ℝ) * 0.5 = 0.25 := by
  refine ⟨(Real.sqrt_eq_rpow _).symm, ?_, by norm_num, by norm_num⟩
  rw [show (0.25 : ℝ) = 0.5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-! ## Razlaga 5: negativni eksponent -/

/-- Razlaga 5: a^(−r) = 1/a^r (a > 0), torej tudi a^(−m/n) = 1/a^(m/n). -/
theorem negativni (a : ℝ) (ha : 0 < a) (r : ℝ) : a ^ (-r) = 1 / a ^ r := by
  rw [Real.rpow_neg ha.le, inv_eq_one_div]

/-- Predpostavke trditve `negativni` se dajo izpolniti (a = 25). -/
example : (0 : ℝ) < 25 := by norm_num

/-- Razlaga 5: 25^(−1/2) = 1/√25 = 1/5. -/
theorem petindvajset : (25 : ℝ) ^ (-1 / 2 : ℝ) = 1 / 5 := by
  calc (25 : ℝ) ^ (-1 / 2 : ℝ) = 1 / (25 : ℝ) ^ (1 / 2 : ℝ) := by
        rw [show (-1 / 2 : ℝ) = -(1 / 2) by norm_num, Real.rpow_neg (by norm_num), inv_eq_one_div]
    _ = 1 / Real.sqrt 25 := by rw [Real.sqrt_eq_rpow]
    _ = 1 / 5 := by rw [show (25 : ℝ) = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-! ## Razlaga 6: zakaj a > 0 -/

/-- Razlaga 6 in ustno vprašanje 2: 1/3 = 2/6, a edini realni kubični koren števila −8 je −2, edini
nenegativni šesti koren števila (−8)² = 64 pa je 2; zapisa bi torej dala različni vrednosti. -/
theorem negativna_osnova : (1 / 3 : ℝ) = 2 / 6 ∧ (∀ x : ℝ, x ^ 3 = -8 ↔ x = -2) ∧
    (-8 : ℝ) ^ 2 = 64 ∧ (∀ x : ℝ, 0 ≤ x → (x ^ 6 = (-8) ^ 2 ↔ x = 2)) := by
  refine ⟨by norm_num, fun x => ⟨fun h => ?_, fun h => by rw [h]; norm_num⟩, by norm_num,
    fun x hx => ?_⟩
  · have e : (x + 2) * ((x - 1) ^ 2 + 3) = x ^ 3 + 8 := by ring
    have h0 : (x + 2) * ((x - 1) ^ 2 + 3) = 0 := by rw [e, h]; norm_num
    rcases mul_eq_zero.mp h0 with h1 | h1
    · linarith
    · have := sq_nonneg (x - 1); linarith
  · rw [show ((-8 : ℝ)) ^ 2 = 2 ^ 6 by norm_num]
    exact pow_left_inj₀ hx (by norm_num) (by norm_num)

/-- Pogoste napake (negativna osnova) in Ponovitev: ∛(−27) = −3, tj. −3 je edino realno število,
katerega kub je −27. -/
theorem kubicni_koren_m27 (x : ℝ) : x ^ 3 = -27 ↔ x = -3 := by
  constructor
  · intro h
    have e : (x + 3) * ((x - 3 / 2) ^ 2 + 27 / 4) = x ^ 3 + 27 := by ring
    have h0 : (x + 3) * ((x - 3 / 2) ^ 2 + 27 / 4) = 0 := by rw [e, h]; norm_num
    rcases mul_eq_zero.mp h0 with h1 | h1
    · linarith
    · have := sq_nonneg (x - 3 / 2); linarith
  · intro h; rw [h]; norm_num

/-! ## Razlaga 7: pravila za racionalne eksponente -/

/-- Razlaga 7 (in Povzetek): za a, b > 0 velja a^r·a^s = a^(r+s), a^r : a^s = a^(r−s),
(a^r)^s = a^(r·s), (a·b)^r = a^r·b^r in (a/b)^r = a^r/b^r (dokazano za vse realne r, s). -/
theorem pravila (a b r s : ℝ) (ha : 0 < a) (hb : 0 < b) :
    a ^ r * a ^ s = a ^ (r + s) ∧ a ^ r / a ^ s = a ^ (r - s) ∧ (a ^ r) ^ s = a ^ (r * s) ∧
    (a * b) ^ r = a ^ r * b ^ r ∧ (a / b) ^ r = a ^ r / b ^ r :=
  ⟨(Real.rpow_add ha r s).symm, (Real.rpow_sub ha r s).symm, (Real.rpow_mul ha.le r s).symm,
    Real.mul_rpow ha.le hb.le, Real.div_rpow ha.le hb.le r⟩

/-- Predpostavke trditve `pravila` se dajo izpolniti (a = 8, b = 27). -/
example : (0 : ℝ) < 8 ∧ (0 : ℝ) < 27 := by norm_num

/-- Pomožno: ∛27 = 3. -/
theorem k27_3 : (27 : ℝ) ^ (1 / 3 : ℝ) = 3 := by
  rw [show (27 : ℝ) = 3 ^ (3 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num

/-- Pomožno: √4 = 4^(1/2) = 2. -/
theorem k4_2 : (4 : ℝ) ^ (1 / 2 : ℝ) = 2 := by
  rw [show (4 : ℝ) = 2 ^ (2 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num

/-- Razlaga 7, primeri v tabeli (a > 0, x ≥ 0): a^(1/2)·a^(1/3) = a^(5/6), a^(3/4) : a^(1/4) = a^(1/2),
(a^(2/3))^(3/4) = a^(1/2), (4x)^(1/2) = 2x^(1/2), (8/27)^(1/3) = 2/3. -/
theorem pravila_primeri (a x : ℝ) (ha : 0 < a) (hx : 0 ≤ x) :
    a ^ (1 / 2 : ℝ) * a ^ (1 / 3 : ℝ) = a ^ (5 / 6 : ℝ) ∧
    a ^ (3 / 4 : ℝ) / a ^ (1 / 4 : ℝ) = a ^ (1 / 2 : ℝ) ∧
    (a ^ (2 / 3 : ℝ)) ^ (3 / 4 : ℝ) = a ^ (1 / 2 : ℝ) ∧
    (4 * x) ^ (1 / 2 : ℝ) = 2 * x ^ (1 / 2 : ℝ) ∧
    ((8 : ℝ) / 27) ^ (1 / 3 : ℝ) = 2 / 3 := by
  refine ⟨?_, ?_, ?_, ?_, ?_⟩
  · rw [← Real.rpow_add ha]; norm_num
  · rw [← Real.rpow_sub ha]; norm_num
  · rw [← Real.rpow_mul ha.le]; norm_num
  · rw [Real.mul_rpow (by norm_num) hx, k4_2]
  · rw [Real.div_rpow (by norm_num) (by norm_num), k8_3, k27_3]

/-- Predpostavke trditve `pravila_primeri` se dajo izpolniti (a = 2, x = 9). -/
example : (0 : ℝ) < 2 ∧ (0 : ℝ) ≤ 9 := by norm_num

/-! ## Razlaga 8: koreni kot potence -/

/-- Razlaga 8: ᵐ√(ⁿ√a) = (a^(1/n))^(1/m) = a^(1/(mn)) = ᵐⁿ√a (a ≥ 0, m, n ≥ 1). -/
theorem koren_korena (a : ℝ) (ha : 0 ≤ a) (m n : ℕ) (hm : m ≠ 0) (hn : n ≠ 0) :
    (a ^ ((1 : ℝ) / n)) ^ ((1 : ℝ) / m) = a ^ ((1 : ℝ) / (m * n)) := by
  have _h := And.intro hm hn
  rw [← Real.rpow_mul ha]; congr 1; ring

/-- Predpostavke trditve `koren_korena` se dajo izpolniti (a = 64, m = 2, n = 3). -/
example : (0 : ℝ) ≤ 64 ∧ (2 : ℕ) ≠ 0 ∧ (3 : ℕ) ≠ 0 := by norm_num

/-- Razlaga 8: √a·∛a = a^(1/2 + 1/3) = a^(5/6) = ⁶√(a⁵) (a > 0). -/
theorem razlicne_stopnje (a : ℝ) (ha : 0 < a) :
    Real.sqrt a * a ^ (1 / 3 : ℝ) = (a ^ 5) ^ (1 / 6 : ℝ) := by
  calc Real.sqrt a * a ^ (1 / 3 : ℝ) = a ^ (1 / 2 : ℝ) * a ^ (1 / 3 : ℝ) := by
        rw [Real.sqrt_eq_rpow]
    _ = a ^ ((1 / 2 : ℝ) + 1 / 3) := by rw [Real.rpow_add ha]
    _ = a ^ (5 / 6 : ℝ) := by norm_num
    _ = (a ^ 5) ^ (1 / 6 : ℝ) := by
        rw [← Real.rpow_natCast, ← Real.rpow_mul ha.le]; norm_num

/-- Predpostavke trditve `razlicne_stopnje` se dajo izpolniti (a = 2). -/
example : (0 : ℝ) < 2 := by norm_num

/-! ## Primer 1 -/

/-- Primer 1 a): 27^(2/3) = (∛27)² = 3² = 9. -/
theorem primer1a : (27 : ℝ) ^ (2 / 3 : ℝ) = 9 := by
  calc (27 : ℝ) ^ (2 / 3 : ℝ) = ((27 : ℝ) ^ (1 / 3 : ℝ)) ^ 2 := by
        rw [← Real.rpow_natCast, ← Real.rpow_mul (by norm_num)]; norm_num
    _ = 3 ^ 2 := by rw [k27_3]
    _ = 9 := by norm_num

/-- Primer 1 b): 16^(−3/4) = 1/16^(3/4), 16^(3/4) = (∜16)³ = 2³ = 8, torej 16^(−3/4) = 1/8. -/
theorem primer1b : (16 : ℝ) ^ (-3 / 4 : ℝ) = 1 / (16 : ℝ) ^ (3 / 4 : ℝ) ∧
    (16 : ℝ) ^ (3 / 4 : ℝ) = 8 ∧ (16 : ℝ) ^ (-3 / 4 : ℝ) = 1 / 8 := by
  have h1 : (16 : ℝ) ^ (-3 / 4 : ℝ) = 1 / (16 : ℝ) ^ (3 / 4 : ℝ) := by
    rw [show (-3 / 4 : ℝ) = -(3 / 4) by norm_num, Real.rpow_neg (by norm_num), inv_eq_one_div]
  have h2 : (16 : ℝ) ^ (3 / 4 : ℝ) = 8 := by
    calc (16 : ℝ) ^ (3 / 4 : ℝ) = ((16 : ℝ) ^ (1 / 4 : ℝ)) ^ 3 := by
          rw [← Real.rpow_natCast, ← Real.rpow_mul (by norm_num)]; norm_num
      _ = 2 ^ 3 := by rw [k16_4]
      _ = 8 := by norm_num
  exact ⟨h1, h2, by rw [h1, h2]⟩

/-- Primer 1 c): (4/9)^(3/2) = (√4)³/(√9)³ = 2³/3³ = 8/27. -/
theorem primer1c : ((4 : ℝ) / 9) ^ (3 / 2 : ℝ) = 8 / 27 := by
  calc ((4 : ℝ) / 9) ^ (3 / 2 : ℝ) = (Real.sqrt 4) ^ 3 / (Real.sqrt 9) ^ 3 := by
        rw [Real.div_rpow (by norm_num) (by norm_num), Real.sqrt_eq_rpow, Real.sqrt_eq_rpow,
          ← Real.rpow_natCast, ← Real.rpow_natCast, ← Real.rpow_mul (by norm_num),
          ← Real.rpow_mul (by norm_num)]
        norm_num
    _ = 2 ^ 3 / 3 ^ 3 := by
        rw [show (4 : ℝ) = 2 ^ 2 by norm_num, show (9 : ℝ) = 3 ^ 2 by norm_num,
          Real.sqrt_sq (by norm_num), Real.sqrt_sq (by norm_num)]
    _ = 8 / 27 := by norm_num

/-! ## Primer 2 -/

/-- Primer 2: za a > 0 je √a·∛(a²)/∜(a³) = a^(1/2)·a^(2/3)/a^(3/4) = a^(1/2 + 2/3 − 3/4)
= a^(6/12 + 8/12 − 9/12) = a^(5/12) = ¹²√(a⁵). -/
theorem primer2 (a : ℝ) (ha : 0 < a) :
    Real.sqrt a * (a ^ 2) ^ (1 / 3 : ℝ) / (a ^ 3) ^ (1 / 4 : ℝ) = (a ^ 5) ^ (1 / 12 : ℝ) := by
  calc Real.sqrt a * (a ^ 2) ^ (1 / 3 : ℝ) / (a ^ 3) ^ (1 / 4 : ℝ)
      = a ^ (1 / 2 : ℝ) * a ^ (2 / 3 : ℝ) / a ^ (3 / 4 : ℝ) := by
        rw [Real.sqrt_eq_rpow, ← Real.rpow_natCast a 2, ← Real.rpow_natCast a 3,
          ← Real.rpow_mul ha.le, ← Real.rpow_mul ha.le]
        norm_num
    _ = a ^ ((1 / 2 : ℝ) + 2 / 3 - 3 / 4) := by rw [Real.rpow_sub ha, Real.rpow_add ha]
    _ = a ^ ((6 / 12 : ℝ) + 8 / 12 - 9 / 12) := by norm_num
    _ = a ^ (5 / 12 : ℝ) := by norm_num
    _ = (a ^ 5) ^ (1 / 12 : ℝ) := by
        rw [← Real.rpow_natCast, ← Real.rpow_mul ha.le]; norm_num

/-- Predpostavke trditve `primer2` se dajo izpolniti (a = 2). -/
example : (0 : ℝ) < 2 := by norm_num

/-- Primer 2, preverjanje za a = 2: √2 ≈ 1,4142, ∛4 = 2^(2/3) ≈ 1,5874, ∜8 = 2^(3/4) ≈ 1,6818,
1,4142·1,5874/1,6818 ≈ 1,3348 in 2^(5/12) ≈ 1,3348. -/
theorem primer2_preizkus :
    (1.41415 < Real.sqrt 2 ∧ Real.sqrt 2 < 1.41425) ∧
    (1.58735 < (2 : ℝ) ^ (2 / 3 : ℝ) ∧ (2 : ℝ) ^ (2 / 3 : ℝ) < 1.58745) ∧
    (1.68175 < (2 : ℝ) ^ (3 / 4 : ℝ) ∧ (2 : ℝ) ^ (3 / 4 : ℝ) < 1.68185) ∧
    (1.33475 < (1.4142 : ℝ) * 1.5874 / 1.6818 ∧ (1.4142 : ℝ) * 1.5874 / 1.6818 < 1.33485) ∧
    (1.33475 < (2 : ℝ) ^ (5 / 12 : ℝ) ∧ (2 : ℝ) ^ (5 / 12 : ℝ) < 1.33485) := by
  refine ⟨?_, ?_, ?_, by norm_num, ?_⟩
  · rw [Real.sqrt_eq_rpow]
    exact koren_med (p := 1) (q := 2) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  · exact koren_med (p := 2) (q := 3) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  · exact koren_med (p := 3) (q := 4) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  · exact koren_med (p := 5) (q := 12) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)

/-! ## Primer 3: energija v mirovanju -/

/-- Pomožno: ∜81 = 3. -/
theorem k81_4 : (81 : ℝ) ^ (1 / 4 : ℝ) = 3 := by
  rw [show (81 : ℝ) = 3 ^ (4 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num

/-- Primer 3: ∜16 = 2, 16^(3/4) = 2³ = 8, P₁ = 70·8 = 560; ∜81 = 3, 81^(3/4) = 3³ = 27,
P₂ = 70·27 = 1890; 1890/560 = 3,375 ≈ 3,4 in 81/16 = 5,0625 ≈ 5. -/
theorem primer3 :
    (70 : ℝ) * (16 : ℝ) ^ (3 / 4 : ℝ) = 560 ∧ (70 : ℝ) * (81 : ℝ) ^ (3 / 4 : ℝ) = 1890 ∧
    (1890 : ℝ) / 560 = 3.375 ∧ (81 : ℝ) / 16 = 5.0625 ∧
    (3.35 : ℝ) < 3.375 ∧ (3.375 : ℝ) < 3.45 ∧ (4.5 : ℝ) < 5.0625 ∧ (5.0625 : ℝ) < 5.5 := by
  refine ⟨?_, ?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  · calc (70 : ℝ) * (16 : ℝ) ^ (3 / 4 : ℝ) = 70 * ((16 : ℝ) ^ (1 / 4 : ℝ)) ^ 3 := by
          rw [← Real.rpow_natCast ((16 : ℝ) ^ (1 / 4 : ℝ)), ← Real.rpow_mul (by norm_num)]
          norm_num
      _ = 70 * 2 ^ 3 := by rw [k16_4]
      _ = 70 * 8 := by norm_num
      _ = 560 := by norm_num
  · calc (70 : ℝ) * (81 : ℝ) ^ (3 / 4 : ℝ) = 70 * ((81 : ℝ) ^ (1 / 4 : ℝ)) ^ 3 := by
          rw [← Real.rpow_natCast ((81 : ℝ) ^ (1 / 4 : ℝ)), ← Real.rpow_mul (by norm_num)]
          norm_num
      _ = 70 * 3 ^ 3 := by rw [k81_4]
      _ = 70 * 27 := by norm_num
      _ = 1890 := by norm_num

/-! ## Primer 4 -/

/-- Primer 4: za x, y > 0 je (x^(3/4)·y^(−1/2) / (x^(−1/4)·y^(1/6)))^(3/2)
= (x^(3/4 − (−1/4))·y^(−1/2 − 1/6))^(3/2) = (x^(4/4)·y^(−3/6 − 1/6))^(3/2) = (x¹·y^(−2/3))^(3/2)
= x^(1·3/2)·y^(−2/3·3/2) = x^(3/2)·y⁻¹ = x^(3/2)/y = x√x/y. -/
theorem primer4 (x y : ℝ) (hx : 0 < x) (hy : 0 < y) :
    ((x ^ (3 / 4 : ℝ) * y ^ (-1 / 2 : ℝ)) / (x ^ (-1 / 4 : ℝ) * y ^ (1 / 6 : ℝ))) ^ (3 / 2 : ℝ)
      = x * Real.sqrt x / y := by
  calc ((x ^ (3 / 4 : ℝ) * y ^ (-1 / 2 : ℝ)) / (x ^ (-1 / 4 : ℝ) * y ^ (1 / 6 : ℝ))) ^ (3 / 2 : ℝ)
      = (x ^ ((3 / 4 : ℝ) - (-1 / 4)) * y ^ ((-1 / 2 : ℝ) - 1 / 6)) ^ (3 / 2 : ℝ) := by
        rw [mul_div_mul_comm, ← Real.rpow_sub hx, ← Real.rpow_sub hy]
    _ = (x ^ (4 / 4 : ℝ) * y ^ ((-3 / 6 : ℝ) - 1 / 6)) ^ (3 / 2 : ℝ) := by norm_num
    _ = (x ^ (1 : ℝ) * y ^ (-2 / 3 : ℝ)) ^ (3 / 2 : ℝ) := by norm_num
    _ = x ^ ((1 : ℝ) * (3 / 2)) * y ^ ((-2 / 3 : ℝ) * (3 / 2)) := by
        rw [Real.mul_rpow (Real.rpow_nonneg hx.le _) (Real.rpow_nonneg hy.le _),
          ← Real.rpow_mul hx.le, ← Real.rpow_mul hy.le]
    _ = x ^ (3 / 2 : ℝ) * y ^ (-1 : ℝ) := by norm_num
    _ = x ^ (3 / 2 : ℝ) / y := by rw [Real.rpow_neg_one, ← div_eq_mul_inv]
    _ = x * Real.sqrt x / y := by
        rw [show (3 / 2 : ℝ) = 1 + 1 / 2 by norm_num, Real.rpow_add hx, Real.rpow_one,
          Real.sqrt_eq_rpow]

/-- Predpostavke trditve `primer4` se dajo izpolniti (x = 4, y = 8). -/
example : (0 : ℝ) < 4 ∧ (0 : ℝ) < 8 := by norm_num

/-- Primer 4, premisli: pri x = 4, y = 8 je 4·√4/8 = 4·2/8 = 1, zato ima prvotni izraz vrednost 1. -/
theorem primer4_vrednost :
    (4 : ℝ) * Real.sqrt 4 / 8 = 4 * 2 / 8 ∧ (4 : ℝ) * 2 / 8 = 1 ∧
    (((4 : ℝ) ^ (3 / 4 : ℝ) * (8 : ℝ) ^ (-1 / 2 : ℝ)) / ((4 : ℝ) ^ (-1 / 4 : ℝ) * (8 : ℝ) ^ (1 / 6 : ℝ)))
      ^ (3 / 2 : ℝ) = 1 := by
  have hs : Real.sqrt 4 = 2 := by
    rw [show (4 : ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨by rw [hs], by norm_num, ?_⟩
  rw [primer4 4 8 (by norm_num) (by norm_num), hs]; norm_num

/-- Primer 4, premisli (preverjanje): 4^(3/4) ≈ 2,8284, 8^(−1/2) ≈ 0,3536, 4^(−1/4) ≈ 0,7071,
8^(1/6) ≈ 1,4142 ter 2,8284·0,3536 ≈ 1,000 in 0,7071·1,4142 ≈ 1,000. -/
theorem primer4_preizkus :
    (2.82835 < (4 : ℝ) ^ (3 / 4 : ℝ) ∧ (4 : ℝ) ^ (3 / 4 : ℝ) < 2.82845) ∧
    (0.35355 < (8 : ℝ) ^ (-1 / 2 : ℝ) ∧ (8 : ℝ) ^ (-1 / 2 : ℝ) < 0.35365) ∧
    (0.70705 < (4 : ℝ) ^ (-1 / 4 : ℝ) ∧ (4 : ℝ) ^ (-1 / 4 : ℝ) < 0.70715) ∧
    (1.41415 < (8 : ℝ) ^ (1 / 6 : ℝ) ∧ (8 : ℝ) ^ (1 / 6 : ℝ) < 1.41425) ∧
    (0.9995 < (2.8284 : ℝ) * 0.3536 ∧ (2.8284 : ℝ) * 0.3536 < 1.0005) ∧
    (0.9995 < (0.7071 : ℝ) * 1.4142 ∧ (0.7071 : ℝ) * 1.4142 < 1.0005) := by
  refine ⟨?_, ?_, ?_, ?_, by norm_num, by norm_num⟩
  · exact koren_med (p := 3) (q := 4) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  · exact koren_med (p := -1) (q := 2) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  · exact koren_med (p := -1) (q := 4) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  · exact koren_med (p := 1) (q := 6) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)

/-! ## Pogoste napake -/

/-- Pogoste napake 1: 8^(1/3) = ∛8 = 2, ne 8/3. -/
theorem napaka_deljenje : (8 : ℝ) ^ (1 / 3 : ℝ) = 2 ∧ (2 : ℝ) ≠ 8 / 3 := ⟨k8_3, by norm_num⟩

/-- Pogoste napake 2: 25^(−1/2) = 1/25^(1/2) = 1/5 ≠ −5; potenca s pozitivno osnovo je vedno
pozitivna. -/
theorem napaka_negativni : (25 : ℝ) ^ (-1 / 2 : ℝ) = 1 / (25 : ℝ) ^ (1 / 2 : ℝ) ∧
    (25 : ℝ) ^ (-1 / 2 : ℝ) = 1 / 5 ∧ (1 / 5 : ℝ) ≠ -5 ∧
    ∀ a r : ℝ, 0 < a → 0 < a ^ r := by
  refine ⟨?_, petindvajset, by norm_num, fun a r ha => Real.rpow_pos_of_pos ha r⟩
  rw [show (-1 / 2 : ℝ) = -(1 / 2) by norm_num, Real.rpow_neg (by norm_num), inv_eq_one_div]

/-- Pogoste napake 3: a^(2/3) = ∛(a²) (a ≥ 0); za a = 8 je ∛64 = 4, √512 ≈ 22,6 pa ni 4. -/
theorem napaka_zamenjava (a : ℝ) (ha : 0 ≤ a) :
    a ^ (2 / 3 : ℝ) = (a ^ 2) ^ (1 / 3 : ℝ) ∧ ((8 : ℝ) ^ 2) ^ (1 / 3 : ℝ) = 4 ∧
    (22.55 < Real.sqrt (8 ^ 3) ∧ Real.sqrt (8 ^ 3) < 22.65) := by
  refine ⟨?_, ?_, ?_⟩
  · rw [← Real.rpow_natCast, ← Real.rpow_mul ha]; norm_num
  · rw [show ((8 : ℝ) ^ 2) = 2 ^ (6 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num
  · rw [Real.sqrt_eq_rpow, show ((8 : ℝ) ^ 3) = 512 by norm_num]
    exact koren_med (p := 1) (q := 2) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)

/-- Predpostavke trditve `napaka_zamenjava` se dajo izpolniti (a = 8). -/
example : (0 : ℝ) ≤ 8 := by norm_num

/-- Pogoste napake 4: a^(1/2) + a^(1/3) = a^(5/6) ne velja: za a = 64 je 8 + 4 = 12, 64^(5/6) pa 32. -/
theorem napaka_vsota : (64 : ℝ) ^ (1 / 2 : ℝ) = 8 ∧ (64 : ℝ) ^ (1 / 3 : ℝ) = 4 ∧
    (64 : ℝ) ^ (5 / 6 : ℝ) = 32 ∧
    (64 : ℝ) ^ (1 / 2 : ℝ) + (64 : ℝ) ^ (1 / 3 : ℝ) ≠ (64 : ℝ) ^ (5 / 6 : ℝ) := by
  have h1 : (64 : ℝ) ^ (1 / 2 : ℝ) = 8 := by
    rw [show (64 : ℝ) = 2 ^ (6 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num
  have h2 : (64 : ℝ) ^ (1 / 3 : ℝ) = 4 := by
    rw [show (64 : ℝ) = 2 ^ (6 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num
  have h3 : (64 : ℝ) ^ (5 / 6 : ℝ) = 32 := by
    rw [show (64 : ℝ) = 2 ^ (6 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num
  exact ⟨h1, h2, h3, by rw [h1, h2, h3]; norm_num⟩

/-- Pogoste napake 4 (»za vsoto √a + ∛a ni pravila, ki bi jo zapisalo kot eno potenco z osnovo a«):
noben eksponent c ne da a^(1/2) + a^(1/3) = a^c za vse a > 0 (že pri a = 1 je levo 2, desno 1). -/
theorem vsota_ni_potenca : ¬ ∃ c : ℝ, ∀ a : ℝ, 0 < a → a ^ (1 / 2 : ℝ) + a ^ (1 / 3 : ℝ) = a ^ c := by
  rintro ⟨c, h⟩
  have := h 1 one_pos
  simp only [Real.one_rpow] at this
  norm_num at this

/-! ## Za maturo -/

/-- Za maturo, naloga 1: ∛2·∜8 = 2^(1/3)·(2³)^(1/4) = 2^(1/3)·2^(3/4) = 2^(1/3 + 3/4)
= 2^(4/12 + 9/12) = 2^(13/12) = 2^(1 + 1/12) = 2¹·2^(1/12) = 2·¹²√2. -/
theorem matura1 : (2 : ℝ) ^ (1 / 3 : ℝ) * (8 : ℝ) ^ (1 / 4 : ℝ) = 2 * (2 : ℝ) ^ (1 / 12 : ℝ) := by
  calc (2 : ℝ) ^ (1 / 3 : ℝ) * (8 : ℝ) ^ (1 / 4 : ℝ)
      = (2 : ℝ) ^ (1 / 3 : ℝ) * ((2 : ℝ) ^ 3) ^ (1 / 4 : ℝ) := by norm_num
    _ = (2 : ℝ) ^ (1 / 3 : ℝ) * (2 : ℝ) ^ (3 / 4 : ℝ) := by
        rw [← Real.rpow_natCast (2 : ℝ) 3, ← Real.rpow_mul (by norm_num)]; norm_num
    _ = (2 : ℝ) ^ ((1 / 3 : ℝ) + 3 / 4) := by rw [Real.rpow_add (by norm_num)]
    _ = (2 : ℝ) ^ ((4 / 12 : ℝ) + 9 / 12) := by norm_num
    _ = (2 : ℝ) ^ (13 / 12 : ℝ) := by norm_num
    _ = (2 : ℝ) ^ ((1 : ℝ) + 1 / 12) := by norm_num
    _ = (2 : ℝ) ^ (1 : ℝ) * (2 : ℝ) ^ (1 / 12 : ℝ) := by rw [Real.rpow_add (by norm_num)]
    _ = 2 * (2 : ℝ) ^ (1 / 12 : ℝ) := by rw [Real.rpow_one]

/-- RAČUN: 2^(1/3)·8^(1/4) = 2^(13/12) in 2^(13/12) = 2·2^(1/12). -/
theorem racun_matura1 : (2 : ℝ) ^ (1 / 3 : ℝ) * (8 : ℝ) ^ (1 / 4 : ℝ) = (2 : ℝ) ^ (13 / 12 : ℝ) ∧
    (2 : ℝ) ^ (13 / 12 : ℝ) = 2 * (2 : ℝ) ^ (1 / 12 : ℝ) := by
  have h : (2 : ℝ) ^ (13 / 12 : ℝ) = 2 * (2 : ℝ) ^ (1 / 12 : ℝ) := by
    rw [show (13 / 12 : ℝ) = 1 + 1 / 12 by norm_num, Real.rpow_add (by norm_num), Real.rpow_one]
  exact ⟨by rw [matura1, h], h⟩

/-- Za maturo, naloga 2 a): 4^(−1/4) = 1/∜4 = 1/√2 ≈ 0,70711, f = 240·4^(−1/4) ≈ 169,706, torej
približno 170 udarcev na minuto. -/
theorem matura2a : (4 : ℝ) ^ (-1 / 4 : ℝ) = 1 / (4 : ℝ) ^ (1 / 4 : ℝ) ∧
    (4 : ℝ) ^ (1 / 4 : ℝ) = Real.sqrt 2 ∧
    (0.707105 < (4 : ℝ) ^ (-1 / 4 : ℝ) ∧ (4 : ℝ) ^ (-1 / 4 : ℝ) < 0.707115) ∧
    (169.7055 < 240 * (4 : ℝ) ^ (-1 / 4 : ℝ) ∧ 240 * (4 : ℝ) ^ (-1 / 4 : ℝ) < 169.7065) ∧
    (169.5 < 240 * (4 : ℝ) ^ (-1 / 4 : ℝ) ∧ 240 * (4 : ℝ) ^ (-1 / 4 : ℝ) < 170.5) := by
  have hb : 169.7055 / 240 < (4 : ℝ) ^ (-1 / 4 : ℝ) ∧ (4 : ℝ) ^ (-1 / 4 : ℝ) < 169.7065 / 240 :=
    koren_med (p := -1) (q := 4) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  refine ⟨?_, ?_, ⟨by linarith [hb.1], by linarith [hb.2]⟩, ⟨by linarith [hb.1], by linarith [hb.2]⟩,
    ⟨by linarith [hb.1], by linarith [hb.2]⟩⟩
  · rw [show (-1 / 4 : ℝ) = -(1 / 4) by norm_num, Real.rpow_neg (by norm_num), inv_eq_one_div]
  · rw [Real.sqrt_eq_rpow, show (4 : ℝ) ^ (1 / 4 : ℝ) = ((2 : ℝ) ^ (2 : ℝ)) ^ (1 / 4 : ℝ) by norm_num,
      ← Real.rpow_mul (by norm_num)]
    norm_num

/-- RAČUN: 240·4^(−1/4) ≈ 169,706. -/
theorem racun_utrip : 169.7055 < 240 * (4 : ℝ) ^ (-1 / 4 : ℝ) ∧ 240 * (4 : ℝ) ^ (-1 / 4 : ℝ) < 169.7065 :=
  matura2a.2.2.2.1

/-- Pomožno: za M, c ≥ 0 je M^(1/4) = c natanko tedaj, ko je M = c⁴. -/
theorem cetrti_koren {M c : ℝ} (hM : 0 ≤ M) (hc : 0 ≤ c) : M ^ (1 / 4 : ℝ) = c ↔ M = c ^ 4 := by
  constructor
  · intro h
    rw [← h, ← Real.rpow_natCast, ← Real.rpow_mul hM]; norm_num
  · intro h
    rw [h, ← Real.rpow_natCast, ← Real.rpow_mul hc]; norm_num

/-- Predpostavke trditve `cetrti_koren` se dajo izpolniti (M = 16, c = 2). -/
example : (0 : ℝ) ≤ 16 ∧ (0 : ℝ) ≤ 2 := by norm_num

/-- Za maturo, naloga 2 b): za M > 0 je 240·M^(−1/4) = 50 ⟺ M^(−1/4) = 50/240 ⟺ M^(1/4) = 240/50
⟺ M = 4,8⁴ = 530,8416 (edina rešitev, ≈ 531 kg). -/
theorem matura2b (M : ℝ) (hM : 0 < M) : 240 * M ^ (-1 / 4 : ℝ) = 50 ↔ M = 530.8416 := by
  calc 240 * M ^ (-1 / 4 : ℝ) = 50 ↔ M ^ (-1 / 4 : ℝ) = 50 / 240 := by
        constructor
        · intro h; linarith
        · intro h; rw [h]; norm_num
    _ ↔ M ^ (1 / 4 : ℝ) = 240 / 50 := by
        rw [show (-1 / 4 : ℝ) = -(1 / 4) by norm_num, Real.rpow_neg hM.le, inv_eq_iff_eq_inv]
        norm_num
    _ ↔ M = (240 / 50) ^ 4 := cetrti_koren hM.le (by norm_num)
    _ ↔ M = 4.8 ^ 4 := by norm_num
    _ ↔ M = 530.8416 := by norm_num

/-- Predpostavke trditve `matura2b` se dajo izpolniti (M = 530,8416). -/
example : (0 : ℝ) < 530.8416 := by norm_num

/-- Za maturo, naloga 2 b) in RAČUN: (240/50)⁴ = 530,8416, kar je zaokroženo 531. -/
theorem racun_masa : ((240 : ℝ) / 50) ^ 4 = 530.8416 ∧ (530.5 : ℝ) < 530.8416 ∧
    (530.8416 : ℝ) < 531.5 := by norm_num

/-- Za maturo, naloga 2 c): za M > 0 je 240·(10M)^(−1/4) / (240·M^(−1/4)) = 10^(−1/4) ≈ 0,56234,
zmanjšanje 1 − 10^(−1/4) ≈ 0,43766, to je približno 43,8 %. -/
theorem matura2c (M : ℝ) (hM : 0 < M) :
    240 * (10 * M) ^ (-1 / 4 : ℝ) / (240 * M ^ (-1 / 4 : ℝ)) = (10 : ℝ) ^ (-1 / 4 : ℝ) := by
  have h0 : M ^ (-1 / 4 : ℝ) ≠ 0 := (Real.rpow_pos_of_pos hM _).ne'
  rw [Real.mul_rpow (by norm_num) hM.le, mul_div_mul_left _ _ (by norm_num : (240 : ℝ) ≠ 0),
    mul_div_assoc, div_self h0, mul_one]

/-- Predpostavke trditve `matura2c` se dajo izpolniti (M = 4). -/
example : (0 : ℝ) < 4 := by norm_num

/-- Za maturo, naloga 2 c) in RAČUN: 10^(−1/4) ≈ 0,56234, 1 − 10^(−1/4) ≈ 0,43766 ≈ 43,8 %. -/
theorem racun_razmerje :
    (0.562335 < (10 : ℝ) ^ (-1 / 4 : ℝ) ∧ (10 : ℝ) ^ (-1 / 4 : ℝ) < 0.562345) ∧
    (0.437655 < 1 - (10 : ℝ) ^ (-1 / 4 : ℝ) ∧ 1 - (10 : ℝ) ^ (-1 / 4 : ℝ) < 0.437665) ∧
    (0.4375 < 1 - (10 : ℝ) ^ (-1 / 4 : ℝ) ∧ 1 - (10 : ℝ) ^ (-1 / 4 : ℝ) < 0.4385) := by
  have hb : 0.562335 < (10 : ℝ) ^ (-1 / 4 : ℝ) ∧ (10 : ℝ) ^ (-1 / 4 : ℝ) < 0.562345 :=
    koren_med (p := -1) (q := 4) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  exact ⟨hb, ⟨by linarith [hb.2], by linarith [hb.1]⟩, ⟨by linarith [hb.2], by linarith [hb.1]⟩⟩

/-! ## Drugače -/

/-- Drugače, z analogijo: q³ = 8 ⟺ q = 2 = 8^(1/3); dve tretjini: 2·2 = 4 = 8^(2/3);
8^(−1/3) = 1/2. -/
theorem analogija : (∀ q : ℝ, q ^ 3 = 8 ↔ q = 2) ∧ (8 : ℝ) ^ (1 / 3 : ℝ) = 2 ∧
    (2 : ℝ) * 2 = (8 : ℝ) ^ (2 / 3 : ℝ) ∧ (8 : ℝ) ^ (-1 / 3 : ℝ) = 1 / 2 := by
  refine ⟨fun q => ⟨fun h => ?_, fun h => by rw [h]; norm_num⟩, k8_3, ?_, ?_⟩
  · have e : (q - 2) * ((q + 1) ^ 2 + 3) = q ^ 3 - 8 := by ring
    have h0 : (q - 2) * ((q + 1) ^ 2 + 3) = 0 := by rw [e, h]; norm_num
    rcases mul_eq_zero.mp h0 with h1 | h1
    · linarith
    · have := sq_nonneg (q + 1); linarith
  · rw [osem_dve_tretjini]; norm_num
  · rw [show (8 : ℝ) = 2 ^ (3 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]
    norm_num [Real.rpow_neg]

/-- Drugače, na sliki (tabela): √0 = 0, √1 = 1, √4 = 2, √9 = 3 ter 0·√0 = 0, 1·√1 = 1, 4·√4 = 8,
9·√9 = 27; vsi grafi gredo skozi (1, 1) (1^r = 1) in pri r > 0 skozi (0, 0). -/
theorem slika_tabela :
    Real.sqrt 0 = 0 ∧ Real.sqrt 1 = 1 ∧ Real.sqrt 4 = 2 ∧ Real.sqrt 9 = 3 ∧
    (0 : ℝ) * Real.sqrt 0 = 0 ∧ (1 : ℝ) * Real.sqrt 1 = 1 ∧ (4 : ℝ) * Real.sqrt 4 = 8 ∧
    (9 : ℝ) * Real.sqrt 9 = 27 ∧ (∀ r : ℝ, (1 : ℝ) ^ r = 1) ∧ (∀ r : ℝ, 0 < r → (0 : ℝ) ^ r = 0) := by
  have h4 : Real.sqrt 4 = 2 := by
    rw [show (4 : ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have h9 : Real.sqrt 9 = 3 := by
    rw [show (9 : ℝ) = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨Real.sqrt_zero, Real.sqrt_one, h4, h9, by simp, by simp, by rw [h4]; norm_num,
    by rw [h9]; norm_num, fun r => Real.one_rpow r, fun r hr => Real.zero_rpow hr.ne'⟩

/-- Drugače, na sliki: za x > 1 je graf višje, čim večji je eksponent (r < s ⟹ x^r < x^s); med 0 in 1
je obratno (r < s ⟹ x^s < x^r); posebej je za 0 < x < 1 √x nad premico y = x, x√x pa pod njo. -/
theorem slika_primerjava (x r s : ℝ) (hrs : r < s) :
    (1 < x → x ^ r < x ^ s) ∧ (0 < x → x < 1 → x ^ s < x ^ r) ∧
    (0 < x → x < 1 → x < Real.sqrt x ∧ x * Real.sqrt x < x) := by
  refine ⟨fun hx => (Real.rpow_lt_rpow_left_iff hx).mpr hrs,
    fun hx0 hx1 => (Real.rpow_lt_rpow_left_iff_of_base_lt_one hx0 hx1).mpr hrs,
    fun hx0 hx1 => ?_⟩
  have hs : Real.sqrt x < 1 := by
    rw [show (1 : ℝ) = Real.sqrt 1 from Real.sqrt_one.symm]
    exact Real.sqrt_lt_sqrt hx0.le hx1
  have hsx : x = Real.sqrt x * Real.sqrt x := (Real.mul_self_sqrt hx0.le).symm
  have hs0 : 0 < Real.sqrt x := Real.sqrt_pos.mpr hx0
  constructor
  · nlinarith
  · nlinarith

/-- Predpostavke trditve `slika_primerjava` se dajo izpolniti (x = 1/4 ali x = 4, r = 1/2, s = 3/2). -/
example : (1 / 2 : ℝ) < 3 / 2 ∧ (1 : ℝ) < 4 ∧ (0 : ℝ) < 1 / 4 ∧ (1 / 4 : ℝ) < 1 := by norm_num

/-- Drugače, na sliki: pri eksponentu med 0 in 1 graf raste vedno počasneje (strogo konkavna funkcija
na [0, ∞)), pri eksponentu nad 1 pa vedno hitreje (strogo konveksna). -/
theorem slika_ukrivljenost (p : ℝ) :
    (0 < p → p < 1 → StrictConcaveOn ℝ (Set.Ici 0) fun x : ℝ => x ^ p) ∧
    (1 < p → StrictConvexOn ℝ (Set.Ici 0) fun x : ℝ => x ^ p) :=
  ⟨fun h0 h1 => Real.strictConcaveOn_rpow h0 h1, fun h => strictConvexOn_rpow h⟩

/-- Predpostavke trditve `slika_ukrivljenost` se dajo izpolniti (p = 1/2 in p = 3/2). -/
example : (0 : ℝ) < 1 / 2 ∧ (1 / 2 : ℝ) < 1 ∧ (1 : ℝ) < 3 / 2 := by norm_num

/-- Drugače, glasba: za q > 0 je q¹² = 2 ⟺ q = 2^(1/12); 2^(1/12) ≈ 1,0595; 440·1,0595 ≈ 466,2;
kvinta 2^(7/12) ≈ 1,498, kar je za manj kot 0,002 oddaljeno od 3/2. -/
theorem glasba :
    (∀ q : ℝ, 0 < q → (q ^ 12 = 2 ↔ q = (2 : ℝ) ^ (1 / 12 : ℝ))) ∧
    (1.05945 < (2 : ℝ) ^ (1 / 12 : ℝ) ∧ (2 : ℝ) ^ (1 / 12 : ℝ) < 1.05955) ∧
    (466.15 < (440 : ℝ) * 1.0595 ∧ (440 : ℝ) * 1.0595 < 466.25) ∧
    (1.4975 < (2 : ℝ) ^ (7 / 12 : ℝ) ∧ (2 : ℝ) ^ (7 / 12 : ℝ) < 1.4985) ∧
    |(2 : ℝ) ^ (7 / 12 : ℝ) - 3 / 2| < 0.002 := by
  have h7 : 1.4975 < (2 : ℝ) ^ (7 / 12 : ℝ) ∧ (2 : ℝ) ^ (7 / 12 : ℝ) < 1.4985 :=
    koren_med (p := 7) (q := 12) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  have h7' : 1.4983 < (2 : ℝ) ^ (7 / 12 : ℝ) ∧ (2 : ℝ) ^ (7 / 12 : ℝ) < 1.4984 :=
    koren_med (p := 7) (q := 12) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  refine ⟨fun q hq => ⟨fun h => ?_, fun h => ?_⟩, ?_, by norm_num, h7, ?_⟩
  · rw [← h, ← Real.rpow_natCast, ← Real.rpow_mul hq.le]; norm_num
  · rw [h, ← Real.rpow_natCast, ← Real.rpow_mul (by norm_num)]; norm_num
  · exact koren_med (p := 1) (q := 12) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  · rw [abs_lt]; constructor <;> linarith [h7'.1, h7'.2]

/-- Drugače, planeti: za T, a > 0 je T² = a³ ⟺ a = T^(2/3); za Mars 1,88^(2/3) ≈ 1,52. -/
theorem kepler :
    (∀ T a : ℝ, 0 < T → 0 < a → (T ^ 2 = a ^ 3 ↔ a = T ^ (2 / 3 : ℝ))) ∧
    (1.515 < (1.88 : ℝ) ^ (2 / 3 : ℝ) ∧ (1.88 : ℝ) ^ (2 / 3 : ℝ) < 1.525) := by
  refine ⟨fun T a hT ha => ⟨fun h => ?_, fun h => ?_⟩, ?_⟩
  · have e : a = (a ^ 3) ^ (1 / 3 : ℝ) := by
      rw [← Real.rpow_natCast, ← Real.rpow_mul ha.le]; norm_num
    rw [e, ← h, ← Real.rpow_natCast, ← Real.rpow_mul hT.le]; norm_num
  · rw [h, ← Real.rpow_natCast, ← Real.rpow_natCast, ← Real.rpow_mul hT.le]; norm_num
  · exact koren_med (p := 2) (q := 3) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)

/-- Drugače, korak za korakom: 32^(−3/5) = 1/32^(3/5), ⁵√32 = 2, 32^(3/5) = 2³ = 8,
32^(−3/5) = 1/8 = 0,125. -/
theorem korak32 : (32 : ℝ) ^ (-3 / 5 : ℝ) = 0.125 := by
  have k : (32 : ℝ) ^ (1 / 5 : ℝ) = 2 := by
    rw [show (32 : ℝ) = 2 ^ (5 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num
  calc (32 : ℝ) ^ (-3 / 5 : ℝ) = 1 / (32 : ℝ) ^ (3 / 5 : ℝ) := by
        rw [show (-3 / 5 : ℝ) = -(3 / 5) by norm_num, Real.rpow_neg (by norm_num), inv_eq_one_div]
    _ = 1 / ((32 : ℝ) ^ (1 / 5 : ℝ)) ^ 3 := by
        rw [← Real.rpow_natCast ((32 : ℝ) ^ (1 / 5 : ℝ)), ← Real.rpow_mul (by norm_num)]; norm_num
    _ = 1 / 2 ^ 3 := by rw [k]
    _ = 1 / 8 := by norm_num
    _ = 0.125 := by norm_num

/-- Drugače, korak za korakom: ∛x·⁶√x = x^(1/3)·x^(1/6) = x^(2/6 + 1/6) = x^(3/6) = x^(1/2) = √x
(x > 0); preverjanje za x = 64: 4·2 = 8 = √64. -/
theorem korak_koreni (x : ℝ) (hx : 0 < x) :
    x ^ (1 / 3 : ℝ) * x ^ (1 / 6 : ℝ) = Real.sqrt x := by
  calc x ^ (1 / 3 : ℝ) * x ^ (1 / 6 : ℝ) = x ^ ((2 / 6 : ℝ) + 1 / 6) := by
        rw [← Real.rpow_add hx]; norm_num
    _ = x ^ (3 / 6 : ℝ) := by norm_num
    _ = x ^ (1 / 2 : ℝ) := by norm_num
    _ = Real.sqrt x := (Real.sqrt_eq_rpow x).symm

/-- Predpostavke trditve `korak_koreni` se dajo izpolniti (x = 64). -/
example : (0 : ℝ) < 64 := by norm_num

/-- Drugače, korak za korakom (preverjanje za x = 64): ∛64 = 4, ⁶√64 = 2, 4·2 = 8 in √64 = 8. -/
theorem korak64 : (64 : ℝ) ^ (1 / 3 : ℝ) = 4 ∧ (64 : ℝ) ^ (1 / 6 : ℝ) = 2 ∧ (4 : ℝ) * 2 = 8 ∧
    Real.sqrt 64 = 8 := by
  refine ⟨?_, ?_, by norm_num, ?_⟩
  · rw [show (64 : ℝ) = 2 ^ (6 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num
  · rw [show (64 : ℝ) = 2 ^ (6 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num
  · rw [show (64 : ℝ) = 8 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Drugače, bolj natančno (definicija je dobra): če je b ≥ 0 in bⁿ = aᵐ (n, k ≥ 1), je tudi
b^(nk) = a^(mk); po `koren_enolicen` je b torej n-ti koren števila aᵐ in hkrati nk-ti koren števila
a^(mk). Eksponenta m/n in mk/(nk) sta enaka. -/
theorem dobra_definicija (a b : ℝ) (m : ℤ) (n k : ℕ) (hb : 0 ≤ b) (hn : n ≠ 0)
    (h : b ^ n = a ^ m) (hk : k ≠ 0) :
    b ^ (n * k) = a ^ (m * k) ∧ b = (a ^ m) ^ ((1 : ℝ) / n) ∧
      b = (a ^ (m * k)) ^ ((1 : ℝ) / ((n * k : ℕ) : ℝ)) ∧
      ((m : ℝ) * k) / ((n : ℝ) * k) = (m : ℝ) / n := by
  have h1 : b ^ (n * k) = a ^ (m * k) := by rw [pow_mul, h, zpow_mul, zpow_natCast]
  have hnk : n * k ≠ 0 := Nat.mul_ne_zero hn hk
  refine ⟨h1, ?_, ?_, ?_⟩
  · exact (koren_enolicen (h ▸ pow_nonneg hb n) hb hn).mp h
  · exact (koren_enolicen (h1 ▸ pow_nonneg hb (n * k)) hb hnk).mp h1
  · have hk' : (k : ℝ) ≠ 0 := Nat.cast_ne_zero.mpr hk
    rw [mul_div_mul_right _ _ hk']

/-- Predpostavke trditve `dobra_definicija` se dajo izpolniti (a = 8, b = 4, m = 2, n = 3, k = 2). -/
example : (0 : ℝ) ≤ 4 ∧ (3 : ℕ) ≠ 0 ∧ (4 : ℝ) ^ 3 = (8 : ℝ) ^ (2 : ℤ) ∧ (2 : ℕ) ≠ 0 := by norm_num

/-- Drugače, bolj natančno (iracionalni eksponenti): 2^1,4 < 2^1,41 < 2^1,414 < 2^1,5 (potence
naraščajo in so manjše od 2^1,5). -/
theorem iracionalni : (2 : ℝ) ^ (1.4 : ℝ) < (2 : ℝ) ^ (1.41 : ℝ) ∧
    (2 : ℝ) ^ (1.41 : ℝ) < (2 : ℝ) ^ (1.414 : ℝ) ∧ (2 : ℝ) ^ (1.414 : ℝ) < (2 : ℝ) ^ (1.5 : ℝ) := by
  refine ⟨?_, ?_, ?_⟩ <;> exact (Real.rpow_lt_rpow_left_iff (by norm_num)).mpr (by norm_num)

/-- Drugače, bolj natančno: 2^√2 leži med 2^1,414 in 2^1,415 (1,414 < √2 < 1,415, potenca z osnovo
2 narašča). -/
theorem iracionalni_meje : (2 : ℝ) ^ (1.414 : ℝ) < (2 : ℝ) ^ Real.sqrt 2 ∧
    (2 : ℝ) ^ Real.sqrt 2 < (2 : ℝ) ^ (1.415 : ℝ) := by
  have h1 : (1.414 : ℝ) < Real.sqrt 2 := by
    rw [Real.lt_sqrt (by norm_num)]; norm_num
  have h2 : Real.sqrt 2 < 1.415 := by
    rw [Real.sqrt_lt' (by norm_num)]; norm_num
  exact ⟨(Real.rpow_lt_rpow_left_iff (by norm_num)).mpr h1,
    (Real.rpow_lt_rpow_left_iff (by norm_num)).mpr h2⟩

/-! ## Preveri se -/

/-- Preveri se 1: ∜(a³) = a^(3/4) = (∜a)³ = a^(6/8) (a > 0), a^(4/3) = ∛(a⁴) pa ni enako
(npr. za a = 2 je 2^(3/4) < 2^(4/3)). -/
theorem kviz1 (a : ℝ) (ha : 0 < a) :
    (a ^ 3) ^ (1 / 4 : ℝ) = a ^ (3 / 4 : ℝ) ∧ a ^ (3 / 4 : ℝ) = (a ^ (1 / 4 : ℝ)) ^ 3 ∧
    a ^ (3 / 4 : ℝ) = a ^ (6 / 8 : ℝ) ∧ a ^ (4 / 3 : ℝ) = (a ^ 4) ^ (1 / 3 : ℝ) ∧
    (2 : ℝ) ^ (3 / 4 : ℝ) < (2 : ℝ) ^ (4 / 3 : ℝ) := by
  refine ⟨?_, ?_, by norm_num, ?_, (Real.rpow_lt_rpow_left_iff (by norm_num)).mpr (by norm_num)⟩
  · rw [← Real.rpow_natCast, ← Real.rpow_mul ha.le]; norm_num
  · rw [← Real.rpow_natCast, ← Real.rpow_mul ha.le]; norm_num
  · rw [← Real.rpow_natCast, ← Real.rpow_mul ha.le]; norm_num

/-- Predpostavke trditve `kviz1` se dajo izpolniti (a = 2). -/
example : (0 : ℝ) < 2 := by norm_num

/-- Preveri se 2: 64^(2/3) = (∛64)² = 4² = 16; napačni odgovori: 64·2/3 ≈ 42,7, √64 = 8,
64^(3/2) = 512. -/
theorem kviz2 : (64 : ℝ) ^ (2 / 3 : ℝ) = 16 ∧ (42.65 : ℝ) < 64 * (2 / 3) ∧ (64 : ℝ) * (2 / 3) < 42.75 ∧
    Real.sqrt 64 = 8 ∧ (64 : ℝ) ^ (3 / 2 : ℝ) = 512 := by
  refine ⟨?_, by norm_num, by norm_num, ?_, ?_⟩
  · calc (64 : ℝ) ^ (2 / 3 : ℝ) = ((64 : ℝ) ^ (1 / 3 : ℝ)) ^ 2 := by
          rw [← Real.rpow_natCast ((64 : ℝ) ^ (1 / 3 : ℝ)), ← Real.rpow_mul (by norm_num)]
          norm_num
      _ = 4 ^ 2 := by rw [korak64.1]
      _ = 16 := by norm_num
  · exact korak64.2.2.2
  · rw [show (64 : ℝ) = 2 ^ (6 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num

/-- Preveri se 3: a^(−r) = 1/a^r (a > 0); 49^(−1/2) = 1/√49 = 1/7; 4^(1/2) = 2, 4^(−1/2) = 1/2;
vrednost se ne spremeni (a^(−r) = a^r) natanko pri a = 1 ali r = 0 (`kviz3_enako`). -/
theorem kviz3 : (∀ a r : ℝ, 0 < a → a ^ (-r) = 1 / a ^ r) ∧
    (49 : ℝ) ^ (-1 / 2 : ℝ) = 1 / Real.sqrt 49 ∧ Real.sqrt 49 = 7 ∧
    (4 : ℝ) ^ (1 / 2 : ℝ) = 2 ∧ (4 : ℝ) ^ (-1 / 2 : ℝ) = 1 / 2 := by
  refine ⟨fun a r ha => negativni a ha r, ?_, ?_, k4_2, ?_⟩
  · rw [show (-1 / 2 : ℝ) = -(1 / 2) by norm_num, Real.rpow_neg (by norm_num), inv_eq_one_div,
      Real.sqrt_eq_rpow]
  · rw [show (49 : ℝ) = 7 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (-1 / 2 : ℝ) = -(1 / 2) by norm_num, Real.rpow_neg (by norm_num), k4_2]; norm_num

/-- Preveri se 3: za a > 0 je a^(−r) = a^r natanko tedaj, ko je a = 1 ali r = 0. -/
theorem kviz3_enako (a r : ℝ) (ha : 0 < a) : a ^ (-r) = a ^ r ↔ a = 1 ∨ r = 0 := by
  rw [Real.rpow_def_of_pos ha, Real.rpow_def_of_pos ha, Real.exp_eq_exp]
  constructor
  · intro h
    have h2 : Real.log a * r = 0 := by linarith
    rcases mul_eq_zero.mp h2 with h3 | h3
    · left
      rcases Real.log_eq_zero.mp h3 with h4 | h4 | h4 <;> [linarith; exact h4; linarith]
    · exact Or.inr h3
  · rintro (h | h)
    · simp [h]
    · simp [h]

/-- Predpostavke trditve `kviz3_enako` se dajo izpolniti (a = 4). -/
example : (0 : ℝ) < 4 := by norm_num

/-- Preveri se 4: √a·∜a = a^(1/2 + 1/4) = a^(3/4) (a > 0), ne a^(1/8); za a = 16 je √16·∜16 = 4·2 = 8,
16^(1/8) = √2 pa ni 8. -/
theorem kviz4 (a : ℝ) (ha : 0 < a) :
    Real.sqrt a * a ^ (1 / 4 : ℝ) = a ^ (3 / 4 : ℝ) ∧ (16 : ℝ) ^ (1 / 8 : ℝ) = Real.sqrt 2 ∧
    Real.sqrt 16 * (16 : ℝ) ^ (1 / 4 : ℝ) = 8 ∧ Real.sqrt 2 ≠ 8 := by
  refine ⟨?_, ?_, ?_, ?_⟩
  · rw [Real.sqrt_eq_rpow, ← Real.rpow_add ha]; norm_num
  · rw [Real.sqrt_eq_rpow, show (16 : ℝ) = 2 ^ (4 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]
    norm_num
  · rw [lestev.2.2.2.2.2, k16_4]; norm_num
  · intro h
    have h2 := Real.sq_sqrt (show (0 : ℝ) ≤ 2 by norm_num)
    rw [h] at h2; norm_num at h2

/-- Predpostavke trditve `kviz4` se dajo izpolniti (a = 16). -/
example : (0 : ℝ) < 16 := by norm_num

/-- Preveri se 5: 162·50/3600 = 8100/3600 = 2,25 in 2,25^(1/2) = √2,25 = 1,5 m²; napačni odgovori:
2,25/2 ≈ 1,1 in 2,25² ≈ 5,1. -/
theorem kviz5 : (162 : ℝ) * 50 / 3600 = 8100 / 3600 ∧ (8100 : ℝ) / 3600 = 2.25 ∧
    (2.25 : ℝ) ^ (1 / 2 : ℝ) = Real.sqrt 2.25 ∧ Real.sqrt 2.25 = 1.5 ∧
    (1.05 : ℝ) < 2.25 / 2 ∧ (2.25 : ℝ) / 2 < 1.15 ∧ (5.05 : ℝ) < 2.25 ^ 2 ∧ (2.25 : ℝ) ^ 2 < 5.15 := by
  refine ⟨by norm_num, by norm_num, (Real.sqrt_eq_rpow _).symm, ?_, by norm_num, by norm_num,
    by norm_num, by norm_num⟩
  rw [show (2.25 : ℝ) = 1.5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

end Evklid.Lekcije.MAT_SS_2.PotenceZRacionalnimiEksponenti
