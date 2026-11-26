/-
vir: content/lessons/MAT-SS-1/potence-z-naravnimi-in-celimi-eksponenti.md
sha256: 70460afa36d5744ca30514e3c4f48b3dbb5d020c3aa3eaf2b893377ad90cc8aa
Ni v Leanu: poimenovanja (osnova, eksponent, vrednost potence, branje »a na n«), vrstni red računskih operacij in
postopek poenostavljanja kot navodila (dokazani so računi, npr. 3 + 2·4² = 35); »0⁰ ni definiran« in »0⁻ⁿ ni
definiran«: v Leanu je 0⁰ = 1 in 0⁻ⁿ = 0, zato vsa pravila s celimi eksponenti nosijo lekcijin pogoj a ≠ 0
(b ≠ 0), dokazano pa je, da a⁰ = 1 sledi iz pravila za deljenje oz. množenje le pri a ≠ 0; »ničta potenca in
negativni eksponent sta dogovor« (dokazano: dogovor je edini, ki ohrani pravila); »aᵐ + aⁿ v splošnem ne moremo
zapisati kot eno potenco« (dokazano za primer 10² + 10³ = 1100, ki ni potenca števila 10 s celim eksponentom);
definicija znanstvenega zapisa (dokazani so vsi zapisi iz lekcije, npr. 3 500 000 = 3,5·10⁶ z 1 ≤ 3,5 < 10);
podatki iz besedila (razdalja do Sonca, premer atoma, število žogic, količina krvi, obseg Zemlje) kot podatki;
»podatki imajo dve veljavni mesti« kot pravilo zaokroževanja (dokazane so napake zaokrožitve, npr.
|3190 − 3,2·10³| ≤ 0,05·10³); analogija s stolpnico in simulacija (dokazani so ustrezni računi in da je
2ⁿ > 0 za vsak celi n); točkovanje maturitetnih nalog; besedila napačnih odgovorov v Preveri se (dokazano je, da so
napačne vrednosti res napačne). Decimalna števila so točna racionalna števila v ℝ; cela eksponenta sta v ℤ (zpow).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.PotenceZNaravnimiInCelimiEksponenti

open Finset

/-! ## Zakaj se tega učimo in Razlaga 1 -/

/-- Zakaj se tega učimo: 128 = 2·2·2·2·2·2·2 = 2⁷ (po sedmih krogih ostane 128/2⁷ = 1 igralec, prej 64, 32, …, 2);
6·6·6 = 216 = 6³. -/
theorem turnir : (128 : ℝ) = 2 * 2 * 2 * 2 * 2 * 2 * 2 ∧ (2 : ℝ) ^ 7 = 128 ∧ (128 : ℝ) / 2 ^ 7 = 1 ∧
    (128 : ℝ) / 2 = 64 ∧ (64 : ℝ) / 2 = 32 ∧ (128 : ℝ) / 2 ^ 6 = 2 ∧ (6 * 6 * 6 : ℝ) = 216 ∧
    (6 : ℝ) ^ 3 = 216 := by norm_num

/-- Razlaga 1: aⁿ je zmnožek n enakih faktorjev a (∏_{i<n} a = aⁿ); a¹ = a. -/
theorem potenca_zmnozek (a : ℝ) (n : ℕ) : ∏ _i ∈ range n, a = a ^ n ∧ a ^ 1 = a :=
  ⟨by rw [prod_const, card_range], pow_one a⟩

/-- Razlaga 1: 2⁵ = 2·2·2·2·2 = 32, (2/3)³ = 2/3·2/3·2/3 = 8/27, 0,1² = 0,1·0,1 = 0,01. -/
theorem razlaga1 : (2 : ℝ) ^ 5 = 2 * 2 * 2 * 2 * 2 ∧ (2 * 2 * 2 * 2 * 2 : ℝ) = 32 ∧
    ((2 : ℝ) / 3) ^ 3 = 2 / 3 * (2 / 3) * (2 / 3) ∧ (2 / 3 * (2 / 3) * (2 / 3) : ℝ) = 8 / 27 ∧
    (0.1 : ℝ) ^ 2 = 0.1 * 0.1 ∧ (0.1 * 0.1 : ℝ) = 0.01 := by norm_num

/-- Bolj natančno: rekurzivna definicija a¹ = a, aⁿ⁺¹ = aⁿ·a. -/
theorem rekurzija (a : ℝ) (n : ℕ) : a ^ 1 = a ∧ a ^ (n + 1) = a ^ n * a := ⟨pow_one a, pow_succ a n⟩

/-! ## Razlaga 2: predznak -/

/-- Razlaga 2, Povzetek, Ustno vprašanje 3: pozitivna osnova da pozitivno potenco; negativna osnova s sodim
eksponentom pozitivno, z lihim negativno. -/
theorem predznak (a : ℝ) (n : ℕ) : (0 < a → 0 < a ^ n) ∧ (a < 0 → Even n → 0 < a ^ n) ∧
    (a < 0 → Odd n → a ^ n < 0) := by
  refine ⟨fun h => pow_pos h n, fun h hn => ?_, fun h hn => hn.pow_neg h⟩
  rw [← hn.neg_pow]; exact pow_pos (neg_pos.mpr h) n

/-- Predpostavke `predznak` se dajo izpolniti (a = 2 in a = −2). -/
example : (0 : ℝ) < 2 ∧ (-2 : ℝ) < 0 ∧ Even 4 ∧ Odd 3 := ⟨by norm_num, by norm_num, by decide, by decide⟩

/-- Razlaga 2: 2³ = 8, (−2)⁴ = 16, (−2)³ = −8, −2⁴ = −(2⁴) = −16, 3 + 2·4² = 3 + 2·16 = 35. -/
theorem razlaga2 : (2 : ℝ) ^ 3 = 8 ∧ (-2 : ℝ) ^ 4 = 16 ∧ (-2 : ℝ) ^ 3 = -8 ∧ -(2 : ℝ) ^ 4 = -(2 ^ 4) ∧
    -(2 : ℝ) ^ 4 = -16 ∧ (3 : ℝ) + 2 * 4 ^ 2 = 3 + 2 * 16 ∧ (3 + 2 * 16 : ℝ) = 35 := by norm_num

/-- Razlaga 2, Premisli: (−1)²⁰²⁵ = −1 in −1²⁰²⁶ = −1. -/
theorem premisli_predznak : (-1 : ℝ) ^ 2025 = -1 ∧ -(1 : ℝ) ^ 2026 = -1 := by norm_num

/-- Bolj natančno: (−a)ⁿ = (−1)ⁿaⁿ, (−1)ⁿ = 1 pri sodem in −1 pri lihem n; Ustno vprašanje 3: pri sodem n je
(−a)ⁿ = aⁿ, pri lihem (−a)ⁿ = −aⁿ. -/
theorem minus_osnova (a : ℝ) (n : ℕ) : (-a) ^ n = (-1) ^ n * a ^ n ∧ (Even n → (-1 : ℝ) ^ n = 1) ∧
    (Odd n → (-1 : ℝ) ^ n = -1) ∧ (Even n → (-a) ^ n = a ^ n) ∧ (Odd n → (-a) ^ n = -a ^ n) :=
  ⟨neg_pow a n, fun h => h.neg_one_pow, fun h => h.neg_one_pow, fun h => h.neg_pow a,
    fun h => h.neg_pow a⟩

/-- Ustno vprašanje 3, Povzetek: (−2)⁴ = 16 ≠ −2⁴ = −16; pri lihem eksponentu (−2)³ = −2³ = −8. -/
theorem ustno3 : (-2 : ℝ) ^ 4 = 16 ∧ -(2 : ℝ) ^ 4 = -16 ∧ (-2 : ℝ) ^ 4 ≠ -2 ^ 4 ∧ (-2 : ℝ) ^ 3 = -2 ^ 3 ∧
    -(2 : ℝ) ^ 3 = -8 := by norm_num

/-! ## Razlaga 3: pravila za naravne eksponente -/

/-- Razlaga 3: (2·2·2)·(2·2) = 2⁵ = 2³·2². -/
theorem razlaga3_uvod : (2 : ℝ) ^ 3 * 2 ^ 2 = (2 * 2 * 2) * (2 * 2) ∧ ((2 * 2 * 2) * (2 * 2) : ℝ) = 2 ^ 5 := by
  norm_num

/-- Razlaga 3, Ustno vprašanje 2, Povzetek: za a, b ≠ 0 in naravna m, n: aᵐaⁿ = aᵐ⁺ⁿ; aᵐ : aⁿ = aᵐ⁻ⁿ (m > n);
(aᵐ)ⁿ = aᵐⁿ; (ab)ⁿ = aⁿbⁿ; (a/b)ⁿ = aⁿ/bⁿ. -/
theorem pravila_naravni (a b : ℝ) (ha : a ≠ 0) (_hb : b ≠ 0) (m n : ℕ) :
    a ^ m * a ^ n = a ^ (m + n) ∧ (n < m → a ^ m / a ^ n = a ^ (m - n)) ∧ (a ^ m) ^ n = a ^ (m * n) ∧
    (a * b) ^ n = a ^ n * b ^ n ∧ (a / b) ^ n = a ^ n / b ^ n :=
  ⟨(pow_add a m n).symm, fun h => (pow_sub₀ a ha h.le).symm, (pow_mul a m n).symm, mul_pow a b n,
    div_pow a b n⟩

/-- Predpostavke `pravila_naravni` se dajo izpolniti (a = 2, b = 5). -/
example : (2 : ℝ) ^ 3 * 2 ^ 2 = 2 ^ (3 + 2) := (pravila_naravni 2 5 two_ne_zero (by norm_num) 3 2).1

/-- Razlaga 3, primeri: 3⁴·3² = 3⁶, 5⁷ : 5⁴ = 5³, (2³)² = 2⁶, (2·5)³ = 2³·5³, (3/2)² = 9/4. -/
theorem razlaga3_primeri : (3 : ℝ) ^ 4 * 3 ^ 2 = 3 ^ 6 ∧ (5 : ℝ) ^ 7 / 5 ^ 4 = 5 ^ 3 ∧ ((2 : ℝ) ^ 3) ^ 2 = 2 ^ 6 ∧
    ((2 : ℝ) * 5) ^ 3 = 2 ^ 3 * 5 ^ 3 ∧ ((3 : ℝ) / 2) ^ 2 = 9 / 4 := by norm_num

/-- Razlaga 3: 4 = 2², 8 = 2³, 9 = 3², 27 = 3³. -/
theorem iste_osnove : (4 : ℝ) = 2 ^ 2 ∧ (8 : ℝ) = 2 ^ 3 ∧ (9 : ℝ) = 3 ^ 2 ∧ (27 : ℝ) = 3 ^ 3 := by norm_num

/-- Razlaga 3, Pogoste napake 3, Ustno vprašanje 2, Povzetek: (a + b)ⁿ ni aⁿ + bⁿ: (2 + 3)² = 25, 2² + 3² = 13;
(1 + 1)² = 4, 1² + 1² = 2. -/
theorem potenca_vsote : (2 + 3 : ℝ) ^ 2 = 25 ∧ (2 : ℝ) ^ 2 + 3 ^ 2 = 13 ∧ (1 + 1 : ℝ) ^ 2 = 4 ∧
    (1 : ℝ) ^ 2 + 1 ^ 2 = 2 ∧ ¬ ∀ a b : ℝ, (a + b) ^ 2 = a ^ 2 + b ^ 2 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, fun h => ?_⟩
  have := h 1 1; norm_num at this

/-- Razlaga 3 in Analogija: 10² + 10³ = 1100 ni potenca števila 10 s celim eksponentom. -/
theorem vsota_ni_potenca : (10 : ℝ) ^ 2 + 10 ^ 3 = 1100 ∧ ¬ ∃ k : ℤ, (10 : ℝ) ^ k = 1100 := by
  refine ⟨by norm_num, ?_⟩
  rintro ⟨k, hk⟩
  rcases le_or_gt k 3 with h | h
  · have := zpow_le_zpow_right₀ (show (1 : ℝ) ≤ 10 by norm_num) h
    rw [hk] at this; norm_num at this
  · have := zpow_le_zpow_right₀ (show (1 : ℝ) ≤ 10 by norm_num) (show (4 : ℤ) ≤ k by omega)
    rw [hk] at this; norm_num at this

/-! ## Razlaga 4–6: ničta in negativna potenca -/

/-- Razlaga 4, Ustno vprašanje 1: za a ≠ 0 je a³ : a³ = a³⁻³ = a⁰ in a³ : a³ = 1, zato a⁰ = 1. -/
theorem nicta (a : ℝ) (ha : a ≠ 0) : a ^ (3 : ℤ) / a ^ (3 : ℤ) = a ^ ((3 : ℤ) - 3) ∧
    a ^ (3 : ℤ) / a ^ (3 : ℤ) = 1 ∧ a ^ (0 : ℤ) = 1 :=
  ⟨(zpow_sub₀ ha 3 3).symm, div_self (zpow_ne_zero 3 ha), zpow_zero a⟩

/-- Predpostavka `nicta` se da izpolniti (a = 7). -/
example : (7 : ℝ) ^ (0 : ℤ) = 1 := (nicta 7 (by norm_num)).2.2

/-- Bolj natančno, Ustno vprašanje 1: dogovor a⁰ = 1 je edini, ki ohrani pravilo aⁿ·a⁰ = aⁿ (a ≠ 0), in
a⁻ⁿ = 1/aⁿ je edini, ki ohrani aⁿ·a⁻ⁿ = 1. -/
theorem dogovor (a y : ℝ) (ha : a ≠ 0) (n : ℕ) : (a ^ n * y = a ^ n ↔ y = 1) ∧ (a ^ n * y = 1 ↔ y = 1 / a ^ n) := by
  have h : a ^ n ≠ 0 := pow_ne_zero n ha
  constructor
  · constructor
    · intro e; exact mul_left_cancel₀ h (by rw [e, mul_one])
    · rintro rfl; rw [mul_one]
  · rw [eq_div_iff h, mul_comm]

/-- Predpostavka `dogovor` se da izpolniti (a = 2). -/
example : ((2 : ℝ) ^ 3 * 1 = 2 ^ 3 ↔ (1 : ℝ) = 1) ∧ ((2 : ℝ) ^ 3 * (1 / 8) = 1 ↔ (1 / 8 : ℝ) = 1 / 2 ^ 3) :=
  dogovor 2 (1 / 8) two_ne_zero 3 |> fun h => ⟨(dogovor 2 1 two_ne_zero 3).1, h.2⟩

/-- Razlaga 4: 2⁷ : 2⁷ = 2⁰ = 1; 7⁰ = 1, (−4)⁰ = 1, (2/3)⁰ = 1. -/
theorem razlaga4 : (2 : ℝ) ^ (7 : ℤ) / 2 ^ (7 : ℤ) = 2 ^ (0 : ℤ) ∧ (2 : ℝ) ^ (0 : ℤ) = 1 ∧ (7 : ℝ) ^ (0 : ℤ) = 1 ∧
    (-4 : ℝ) ^ (0 : ℤ) = 1 ∧ ((2 : ℝ) / 3) ^ (0 : ℤ) = 1 := by norm_num

/-- Razlaga 5, Povzetek: a⁻ⁿ = 1/aⁿ, posebej a⁻¹ = 1/a (a ≠ 0). -/
theorem negativni (a : ℝ) (_ha : a ≠ 0) (n : ℕ) : a ^ (-(n : ℤ)) = 1 / a ^ n ∧ a ^ (-1 : ℤ) = 1 / a := by
  constructor
  · rw [zpow_neg, zpow_natCast, one_div]
  · rw [zpow_neg, zpow_one, one_div]

/-- Predpostavka `negativni` se da izpolniti (a = 2, n = 3: 2⁻³ = 1/8). -/
example : (2 : ℝ) ^ (-((3 : ℕ) : ℤ)) = 1 / 2 ^ 3 := (negativni 2 two_ne_zero 3).1

/-- Razlaga 5: a²/a⁵ = a²⁻⁵ = a⁻³ in (a·a)/(a·a·a·a·a) = 1/a³ (a ≠ 0). -/
theorem razlaga5_izpeljava (a : ℝ) (ha : a ≠ 0) : a ^ (2 : ℤ) / a ^ (5 : ℤ) = a ^ ((2 : ℤ) - 5) ∧
    a ^ ((2 : ℤ) - 5) = a ^ (-3 : ℤ) ∧ (a * a) / (a * a * a * a * a) = 1 / a ^ 3 ∧
    a ^ (-3 : ℤ) = 1 / a ^ 3 := by
  refine ⟨(zpow_sub₀ ha 2 5).symm, by norm_num, by field_simp, ?_⟩
  rw [zpow_neg, one_div]; norm_cast

/-- Predpostavka `razlaga5_izpeljava` se da izpolniti (a = 2). -/
example : (2 : ℝ) ^ (-3 : ℤ) = 1 / 2 ^ 3 := (razlaga5_izpeljava 2 two_ne_zero).2.2.2

/-- Razlaga 5: 2⁻³ = 1/8, 10⁻² = 1/100 = 0,01, (−2)⁻³ = 1/(−2)³ = −1/8; tabela 2³ … 2⁻³. -/
theorem razlaga5_primeri : (2 : ℝ) ^ (-3 : ℤ) = 1 / 8 ∧ (10 : ℝ) ^ (-2 : ℤ) = 1 / 100 ∧ (1 / 100 : ℝ) = 0.01 ∧
    (-2 : ℝ) ^ (-3 : ℤ) = 1 / (-2) ^ 3 ∧ (1 / (-2) ^ 3 : ℝ) = -1 / 8 ∧
    (2 : ℝ) ^ (3 : ℤ) = 8 ∧ (2 : ℝ) ^ (2 : ℤ) = 4 ∧ (2 : ℝ) ^ (1 : ℤ) = 2 ∧ (2 : ℝ) ^ (0 : ℤ) = 1 ∧
    (2 : ℝ) ^ (-1 : ℤ) = 1 / 2 ∧ (2 : ℝ) ^ (-2 : ℤ) = 1 / 4 := by norm_num

/-- Razlaga 5 (tabela, simulacija): vsak korak navzdol po eksponentu razpolovi vrednost, 2ⁿ⁻¹ = 2ⁿ/2, in 2ⁿ je za
vsak celi n pozitiven (nikoli 0 ali negativen). -/
theorem razpolovi (n : ℤ) : (2 : ℝ) ^ (n - 1) = 2 ^ n / 2 ∧ 0 < (2 : ℝ) ^ n := by
  refine ⟨by rw [zpow_sub₀ two_ne_zero, zpow_one], zpow_pos two_pos n⟩

/-- Razlaga 5, Premisli: 10⁻³ = 1/1000 = 0,001 > 10⁻⁶ = 1/1000000. -/
theorem premisli_10 : (10 : ℝ) ^ (-3 : ℤ) = 1 / 1000 ∧ (1 / 1000 : ℝ) = 0.001 ∧
    (10 : ℝ) ^ (-6 : ℤ) = 1 / 1000000 ∧ (10 : ℝ) ^ (-6 : ℤ) < 10 ^ (-3 : ℤ) := by norm_num

/-- Razlaga 5, Povzetek, Primer 1: (a/b)⁻ⁿ = (b/a)ⁿ; 1/a⁻ⁿ = aⁿ; a⁻ⁿ/b⁻ᵐ = bᵐ/aⁿ (a, b ≠ 0, n, m celi). -/
theorem obrni (a b : ℝ) (_ha : a ≠ 0) (_hb : b ≠ 0) (m n : ℤ) : (a / b) ^ (-n) = (b / a) ^ n ∧
    1 / a ^ (-n) = a ^ n ∧ a ^ (-n) / b ^ (-m) = b ^ m / a ^ n := by
  refine ⟨by rw [zpow_neg, ← inv_zpow, inv_div], by rw [zpow_neg, one_div, inv_inv], ?_⟩
  rw [zpow_neg, zpow_neg, div_eq_mul_inv, inv_inv, mul_comm, div_eq_mul_inv]

/-- Predpostavke `obrni` se dajo izpolniti (a = 2, b = 3). -/
example : ((2 : ℝ) / 3) ^ (-(2 : ℤ)) = (3 / 2) ^ (2 : ℤ) := (obrni 2 3 two_ne_zero (by norm_num) 0 2).1

/-- Razlaga 5: (2/3)⁻² = (3/2)² = 9/4. -/
theorem dve_tretjini : ((2 : ℝ) / 3) ^ (-2 : ℤ) = (3 / 2) ^ (2 : ℤ) ∧ ((3 : ℝ) / 2) ^ (2 : ℤ) = 9 / 4 := by
  norm_num

/-- Razlaga 6, Povzetek: za a, b ≠ 0 in cela m, n veljajo vsa pravila: aᵐaⁿ = aᵐ⁺ⁿ, aᵐ : aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐⁿ,
(ab)ⁿ = aⁿbⁿ, (a/b)ⁿ = aⁿ/bⁿ. -/
theorem pravila_cela (a b : ℝ) (ha : a ≠ 0) (_hb : b ≠ 0) (m n : ℤ) :
    a ^ m * a ^ n = a ^ (m + n) ∧ a ^ m / a ^ n = a ^ (m - n) ∧ (a ^ m) ^ n = a ^ (m * n) ∧
    (a * b) ^ n = a ^ n * b ^ n ∧ (a / b) ^ n = a ^ n / b ^ n :=
  ⟨(zpow_add₀ ha m n).symm, (zpow_sub₀ ha m n).symm, (zpow_mul a m n).symm, mul_zpow a b n, div_zpow a b n⟩

/-- Predpostavke `pravila_cela` se dajo izpolniti (a = 5, b = 1). -/
example : (5 : ℝ) ^ (4 : ℤ) / 5 ^ (7 : ℤ) = 5 ^ ((4 : ℤ) - 7) :=
  (pravila_cela 5 1 (by norm_num) one_ne_zero 4 7).2.1

/-- Razlaga 6: 5⁴ : 5⁷ = 5⁻³ = 1/125; 3⁵·3⁻⁷ = 3⁵⁻⁷ = 3⁻² = 1/9. -/
theorem razlaga6 : (5 : ℝ) ^ (4 : ℤ) / 5 ^ (7 : ℤ) = 5 ^ (-3 : ℤ) ∧ (5 : ℝ) ^ (-3 : ℤ) = 1 / 125 ∧
    (3 : ℝ) ^ (5 : ℤ) * 3 ^ (-7 : ℤ) = 3 ^ ((5 : ℤ) - 7) ∧ (3 : ℝ) ^ ((5 : ℤ) - 7) = 3 ^ (-2 : ℤ) ∧
    (3 : ℝ) ^ (-2 : ℤ) = 1 / 9 := by norm_num

/-! ## Razlaga 7: potence števila 10 in znanstveni zapis -/

/-- Razlaga 7: 10³ = 1000, 10⁻³ = 1/1000 = 0,001; 3500000 = 3,5·10⁶, 0,00042 = 4,2·10⁻⁴ (1 ≤ 3,5 < 10,
1 ≤ 4,2 < 10); (3·10⁵)(2·10⁻²) = 6·10³; 12·10³ = 1,2·10⁴. -/
theorem razlaga7 : (10 : ℝ) ^ 3 = 1000 ∧ (10 : ℝ) ^ (-3 : ℤ) = 1 / 1000 ∧ (1 / 1000 : ℝ) = 0.001 ∧
    (3500000 : ℝ) = 3.5 * 10 ^ (6 : ℤ) ∧ (1 : ℝ) ≤ 3.5 ∧ (3.5 : ℝ) < 10 ∧
    (0.00042 : ℝ) = 4.2 * 10 ^ (-4 : ℤ) ∧ (1 : ℝ) ≤ 4.2 ∧ (4.2 : ℝ) < 10 ∧
    (3 * 10 ^ (5 : ℤ)) * (2 * 10 ^ (-2 : ℤ)) = (6 : ℝ) * 10 ^ (3 : ℤ) ∧
    (12 : ℝ) * 10 ^ (3 : ℤ) = 1.2 * 10 ^ (4 : ℤ) := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: (−2)³ = (−2)(−2)(−2) = 4·(−2) = −8; −2⁴ = −(2·2·2·2) = −16; 4⁻² = 1/4² = 1/16;
(2/3)⁻² = (3/2)² = 3²/2² = 9/4. -/
theorem primer1 : (-2 : ℝ) ^ 3 = (-2) * (-2) * (-2) ∧ ((-2) * (-2) * (-2) : ℝ) = 4 * (-2) ∧ (4 * (-2) : ℝ) = -8 ∧
    -(2 : ℝ) ^ 4 = -(2 * 2 * 2 * 2) ∧ (-(2 * 2 * 2 * 2) : ℝ) = -16 ∧ (4 : ℝ) ^ (-2 : ℤ) = 1 / 4 ^ 2 ∧
    (1 / 4 ^ 2 : ℝ) = 1 / 16 ∧ ((2 : ℝ) / 3) ^ (-2 : ℤ) = (3 / 2) ^ 2 ∧ ((3 : ℝ) / 2) ^ 2 = 3 ^ 2 / 2 ^ 2 ∧
    ((3 : ℝ) ^ 2 / 2 ^ 2) = 9 / 4 := by norm_num

/-- Primer 2: 9 = 3², 27 = 3³; 9²·3⁻³/27⁻¹ = (3²)²·3⁻³/(3³)⁻¹ = 3⁴·3⁻³/3⁻³ = 3¹/3⁻³ = 3⁴ = 81. -/
theorem primer2 : (9 : ℝ) ^ (2 : ℤ) * 3 ^ (-3 : ℤ) / 27 ^ (-1 : ℤ) = 81 := by
  calc (9 : ℝ) ^ (2 : ℤ) * 3 ^ (-3 : ℤ) / 27 ^ (-1 : ℤ)
      = ((3 : ℝ) ^ (2 : ℤ)) ^ (2 : ℤ) * 3 ^ (-3 : ℤ) / ((3 : ℝ) ^ (3 : ℤ)) ^ (-1 : ℤ) := by norm_num
    _ = (3 : ℝ) ^ (4 : ℤ) * 3 ^ (-3 : ℤ) / 3 ^ (-3 : ℤ) := by rw [← zpow_mul, ← zpow_mul]; norm_num
    _ = (3 : ℝ) ^ ((4 : ℤ) + -3) / 3 ^ (-3 : ℤ) := by rw [zpow_add₀ (by norm_num : (3 : ℝ) ≠ 0)]
    _ = (3 : ℝ) ^ (1 : ℤ) / 3 ^ (-3 : ℤ) := by norm_num
    _ = (3 : ℝ) ^ ((1 : ℤ) - -3) := by rw [zpow_sub₀ (by norm_num : (3 : ℝ) ≠ 0)]
    _ = (3 : ℝ) ^ (4 : ℤ) := by norm_num
    _ = 81 := by norm_num

/-- Primer 2, preizkus: 9² = 81, 3⁻³ = 1/27, 81·1/27 = 3, 27⁻¹ = 1/27, 3 : 1/27 = 3·27 = 81. -/
theorem primer2_preizkus : (9 : ℝ) ^ 2 = 81 ∧ (3 : ℝ) ^ (-3 : ℤ) = 1 / 27 ∧ (81 * (1 / 27) : ℝ) = 3 ∧
    (27 : ℝ) ^ (-1 : ℤ) = 1 / 27 ∧ (3 / (1 / 27) : ℝ) = 3 * 27 ∧ (3 * 27 : ℝ) = 81 := by norm_num

/-- Primer 3: M = 5,5·10⁴·5,8·10⁻² = 31,9·10² = 3,19·10³ kg = 3,19 t (10³ kg = 1 t); zaokroženo na dve mesti
3,2·10³ kg z napako največ pol enote zadnjega mesta. -/
theorem primer3 : (5.5 : ℝ) * 5.8 = 31.9 ∧ (10 : ℝ) ^ (4 : ℤ) * 10 ^ (-2 : ℤ) = 10 ^ ((4 : ℤ) + -2) ∧
    (5.5 : ℝ) * 10 ^ (4 : ℤ) * (5.8 * 10 ^ (-2 : ℤ)) = 31.9 * 10 ^ (2 : ℤ) ∧
    (31.9 : ℝ) * 10 ^ (2 : ℤ) = 3.19 * 10 ^ (3 : ℤ) ∧ (3.19 : ℝ) * 10 ^ (3 : ℤ) / 10 ^ 3 = 3.19 ∧
    |(3.19 : ℝ) * 10 ^ (3 : ℤ) - 3.2 * 10 ^ (3 : ℤ)| ≤ 0.05 * 10 ^ (3 : ℤ) := by
  refine ⟨by norm_num, (zpow_add₀ (by norm_num) 4 (-2)).symm, by norm_num, by norm_num, by norm_num, ?_⟩
  rw [abs_le]; constructor <;> norm_num

/-- Primer 4: za a, b ≠ 0: a³ : a⁻¹ = a⁴, b⁻² : b¹ = b⁻³, (2a³b⁻²/(a⁻¹b))⁻² = (2a⁴b⁻³)⁻² = 2⁻²(a⁴)⁻²(b⁻³)⁻²
= 1/4 · a⁻⁸ · b⁶ = b⁶/(4a⁸). -/
theorem primer4 (a b : ℝ) (ha : a ≠ 0) (hb : b ≠ 0) :
    a ^ (3 : ℤ) / a ^ (-1 : ℤ) = a ^ (4 : ℤ) ∧ b ^ (-2 : ℤ) / b ^ (1 : ℤ) = b ^ (-3 : ℤ) ∧
    (2 * a ^ (3 : ℤ) * b ^ (-2 : ℤ) / (a ^ (-1 : ℤ) * b)) ^ (-2 : ℤ) = b ^ 6 / (4 * a ^ 8) := by
  have h1 : a ^ (3 : ℤ) / a ^ (-1 : ℤ) = a ^ (4 : ℤ) := by rw [← zpow_sub₀ ha]; norm_num
  have h2 : b ^ (-2 : ℤ) / b ^ (1 : ℤ) = b ^ (-3 : ℤ) := by rw [← zpow_sub₀ hb]; norm_num
  refine ⟨h1, h2, ?_⟩
  calc (2 * a ^ (3 : ℤ) * b ^ (-2 : ℤ) / (a ^ (-1 : ℤ) * b)) ^ (-2 : ℤ)
      = (2 * (a ^ (3 : ℤ) / a ^ (-1 : ℤ)) * (b ^ (-2 : ℤ) / b ^ (1 : ℤ))) ^ (-2 : ℤ) := by
        rw [zpow_one]; ring_nf
    _ = (2 * a ^ (4 : ℤ) * b ^ (-3 : ℤ)) ^ (-2 : ℤ) := by rw [h1, h2]
    _ = 2 ^ (-2 : ℤ) * (a ^ (4 : ℤ)) ^ (-2 : ℤ) * (b ^ (-3 : ℤ)) ^ (-2 : ℤ) := by rw [mul_zpow, mul_zpow]
    _ = 1 / 4 * a ^ (-8 : ℤ) * b ^ (6 : ℤ) := by rw [← zpow_mul, ← zpow_mul]; norm_num
    _ = b ^ 6 / (4 * a ^ 8) := by
      rw [zpow_neg, zpow_ofNat, zpow_ofNat]; field_simp

/-- Predpostavki `primer4` se dajo izpolniti (a = 1, b = 2). -/
example : (2 * (1 : ℝ) ^ (3 : ℤ) * 2 ^ (-2 : ℤ) / (1 ^ (-1 : ℤ) * 2)) ^ (-2 : ℤ) = 2 ^ 6 / (4 * 1 ^ 8) :=
  (primer4 1 2 one_ne_zero two_ne_zero).2.2

/-- Primer 4, Premisli: 2⁻² = 1/4; preizkus pri a = 1, b = 2: oklepaj 2·2⁻²/2 = 1/4, (1/4)⁻² = 16 in
2⁶/4 = 64/4 = 16. -/
theorem primer4_preizkus : (2 : ℝ) ^ (-2 : ℤ) = 1 / 4 ∧ (2 * 2 ^ (-2 : ℤ) / 2 : ℝ) = 1 / 4 ∧
    ((1 : ℝ) / 4) ^ (-2 : ℤ) = 16 ∧ ((2 : ℝ) ^ 6 / 4) = 64 / 4 ∧ (64 / 4 : ℝ) = 16 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1, Ponovitev: −3² = −(3·3) = −9 ≠ 9, (−3)² = (−3)(−3) = 9. -/
theorem napaka_minus : -(3 : ℝ) ^ 2 = -(3 * 3) ∧ (-(3 * 3) : ℝ) = -9 ∧ (-9 : ℝ) ≠ 9 ∧
    (-3 : ℝ) ^ 2 = (-3) * (-3) ∧ ((-3) * (-3) : ℝ) = 9 := by norm_num

/-- Pogoste napake 2, Ponovitev, Analogija: 2³·2⁴ = 2⁷ = 128, ne 2¹² ne 4⁷; (2³)⁴ = 2¹²; 3 + 4 = 7 faktorjev. -/
theorem napaka_eksponenti : (2 : ℝ) ^ 3 * 2 ^ 4 = 2 ^ 7 ∧ (2 : ℝ) ^ 7 = 128 ∧ (2 : ℝ) ^ 3 * 2 ^ 4 ≠ 2 ^ 12 ∧
    (2 : ℝ) ^ 3 * 2 ^ 4 ≠ 4 ^ 7 ∧ ((2 : ℝ) ^ 3) ^ 4 = 2 ^ 12 := by norm_num

/-- Pogoste napake 4, Ponovitev: 2⁻³ = 1/2³ = 1/8, ni −8 ne −1/8; 5⁰ = 1 ≠ 0. -/
theorem napaka_negativni : (2 : ℝ) ^ (-3 : ℤ) = 1 / 2 ^ 3 ∧ (1 / 2 ^ 3 : ℝ) = 1 / 8 ∧ (2 : ℝ) ^ (-3 : ℤ) ≠ -8 ∧
    (2 : ℝ) ^ (-3 : ℤ) ≠ -1 / 8 ∧ (5 : ℝ) ^ (0 : ℤ) = 1 ∧ (5 : ℝ) ^ (0 : ℤ) ≠ 0 := by norm_num

/-- Pogoste napake 5: 3·2² = 3·4 = 12 ≠ 6² = 36; 2a⁻³ = 2·1/a³ = 2/a³ (a ≠ 0), ni 1/(2a³) (pri a = 1). -/
theorem napaka_obseg : (3 : ℝ) * 2 ^ 2 = 3 * 4 ∧ (3 * 4 : ℝ) = 12 ∧ (6 : ℝ) ^ 2 = 36 ∧ (12 : ℝ) ≠ 36 ∧
    (∀ a : ℝ, a ≠ 0 → 2 * a ^ (-3 : ℤ) = 2 * (1 / a ^ 3) ∧ 2 * (1 / a ^ 3) = 2 / a ^ 3) ∧
    2 * (1 : ℝ) ^ (-3 : ℤ) ≠ 1 / (2 * 1 ^ 3) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, fun a _ => ⟨?_, by ring⟩, by norm_num⟩
  rw [zpow_neg, one_div]; norm_cast

/-! ## Za maturo -/

/-- Naloga 1: za x, y ≠ 0 je (x⁻²y³)² = x⁻⁴y⁶, števec x⁻⁴y⁶·x⁵ = x⁻⁴⁺⁵y⁶ = xy⁶, imenovalec (xy⁻¹)³ = x³y⁻³,
količnik x¹⁻³y⁶⁻⁽⁻³⁾ = x⁻²y⁹ = y⁹/x². -/
theorem naloga1 (x y : ℝ) (hx : x ≠ 0) (hy : y ≠ 0) :
    (x ^ (-2 : ℤ) * y ^ (3 : ℤ)) ^ (2 : ℤ) = x ^ (-4 : ℤ) * y ^ (6 : ℤ) ∧
    x ^ (-4 : ℤ) * y ^ (6 : ℤ) * x ^ (5 : ℤ) = x * y ^ (6 : ℤ) ∧
    (x * y ^ (-1 : ℤ)) ^ (3 : ℤ) = x ^ (3 : ℤ) * y ^ (-3 : ℤ) ∧
    (x * y ^ (6 : ℤ)) / (x ^ (3 : ℤ) * y ^ (-3 : ℤ)) = x ^ (-2 : ℤ) * y ^ (9 : ℤ) ∧
    x ^ (-2 : ℤ) * y ^ (9 : ℤ) = y ^ 9 / x ^ 2 ∧
    (x ^ (-2 : ℤ) * y ^ (3 : ℤ)) ^ (2 : ℤ) * x ^ (5 : ℤ) / (x * y ^ (-1 : ℤ)) ^ (3 : ℤ) = y ^ 9 / x ^ 2 := by
  have e1 : (x ^ (-2 : ℤ) * y ^ (3 : ℤ)) ^ (2 : ℤ) = x ^ (-4 : ℤ) * y ^ (6 : ℤ) := by
    rw [mul_zpow, ← zpow_mul, ← zpow_mul]; norm_num
  have e2 : x ^ (-4 : ℤ) * y ^ (6 : ℤ) * x ^ (5 : ℤ) = x * y ^ (6 : ℤ) := by
    rw [mul_right_comm, ← zpow_add₀ hx]; norm_num
  have e3 : (x * y ^ (-1 : ℤ)) ^ (3 : ℤ) = x ^ (3 : ℤ) * y ^ (-3 : ℤ) := by
    rw [mul_zpow, ← zpow_mul]; norm_num
  have e4 : (x * y ^ (6 : ℤ)) / (x ^ (3 : ℤ) * y ^ (-3 : ℤ)) = x ^ (-2 : ℤ) * y ^ (9 : ℤ) := by
    rw [mul_div_mul_comm, ← zpow_sub₀ hy,
      show x / x ^ (3 : ℤ) = x ^ ((1 : ℤ) - 3) by rw [zpow_sub₀ hx, zpow_one]]
    norm_num
  have e5 : x ^ (-2 : ℤ) * y ^ (9 : ℤ) = y ^ 9 / x ^ 2 := by
    rw [zpow_neg, zpow_ofNat, zpow_ofNat]; field_simp
  refine ⟨e1, e2, e3, e4, e5, ?_⟩
  rw [e1, e2, e3, e4, e5]

/-- Predpostavki `naloga1` se dajo izpolniti (x = 1, y = 2). -/
example : ((1 : ℝ) ^ (-2 : ℤ) * 2 ^ (3 : ℤ)) ^ (2 : ℤ) * 1 ^ (5 : ℤ) / (1 * 2 ^ (-1 : ℤ)) ^ (3 : ℤ) = 2 ^ 9 / 1 ^ 2 :=
  (naloga1 1 2 one_ne_zero two_ne_zero).2.2.2.2.2

/-- Naloga 1, preizkus pri x = 1, y = 2: 8²·1/(1/2)³ = 64·8 = 512 = 2⁹. -/
theorem naloga1_preizkus : ((8 : ℝ) ^ 2 * 1) / (1 / 2) ^ 3 = 64 * 8 ∧ (64 * 8 : ℝ) = 512 ∧ (2 : ℝ) ^ 9 = 512 := by
  norm_num

/-- Naloga 2 a): 1 dm³ = (10²)³ mm³ = 10⁶ mm³, V = 5,2·10⁶ mm³. -/
theorem naloga2a : ((10 : ℝ) ^ 2) ^ 3 = 10 ^ 6 ∧ (5.2 : ℝ) * 10 ^ 6 = 5200000 := by norm_num

/-- Naloga 2 b): K = 5,2·10⁶·4,8·10⁶ = 24,96·10¹² = 2,496·10¹³ ≈ 2,5·10¹³ (napaka pod pol enote zadnjega mesta). -/
theorem naloga2b : (5.2 : ℝ) * 4.8 = 24.96 ∧ (5.2 : ℝ) * 10 ^ 6 * (4.8 * 10 ^ 6) = 24.96 * 10 ^ 12 ∧
    (24.96 : ℝ) * 10 ^ 12 = 2.496 * 10 ^ 13 ∧ |(2.496 : ℝ) - 2.5| < 0.05 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  rw [abs_lt]; constructor <;> norm_num

/-- Naloga 2 c): s = 2,496·10¹³·7,6·10⁻⁶ m = 18,9696·10⁷ m = 1,89696·10⁸ m = 1,89696·10⁵ km ≈ 1,9·10⁵ km;
razmerje 1,89696·10⁵/(4,0·10⁴) = 4,7424 ≈ 5. -/
theorem naloga2c : (2.496 : ℝ) * 10 ^ (13 : ℤ) * (7.6 * 10 ^ (-6 : ℤ)) = 18.9696 * 10 ^ (7 : ℤ) ∧
    (18.9696 : ℝ) * 10 ^ (7 : ℤ) = 1.89696 * 10 ^ (8 : ℤ) ∧
    (1.89696 : ℝ) * 10 ^ (8 : ℤ) / 10 ^ (3 : ℤ) = 1.89696 * 10 ^ (5 : ℤ) ∧ |(1.89696 : ℝ) - 1.9| < 0.05 ∧
    (1.89696 : ℝ) * 10 ^ (5 : ℤ) / (4.0 * 10 ^ (4 : ℤ)) = 4.7424 ∧ |(4.7424 : ℝ) - 5| < 0.5 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, by norm_num, ?_⟩
  · rw [abs_lt]; constructor <;> norm_num
  · rw [abs_lt]; constructor <;> norm_num

/-! ## Drugače -/

/-- Analogija (stolpnica): 10⁰ = 1, 10³ = 1000, 10⁻² = 0,01; 10³·10² = 10⁵; 10⁵ : 10⁷ = 10⁻²; (10²)³ = 10⁶;
tudi v kleti je 10ⁿ pozitivno in manj kot 1 (n < 0). -/
theorem stolpnica : (10 : ℝ) ^ (0 : ℤ) = 1 ∧ (10 : ℝ) ^ (3 : ℤ) = 1000 ∧ (10 : ℝ) ^ (-2 : ℤ) = 0.01 ∧
    (10 : ℝ) ^ (3 : ℤ) * 10 ^ (2 : ℤ) = 10 ^ (5 : ℤ) ∧ (10 : ℝ) ^ (5 : ℤ) / 10 ^ (7 : ℤ) = 10 ^ (-2 : ℤ) ∧
    ((10 : ℝ) ^ (2 : ℤ)) ^ (3 : ℤ) = 10 ^ (6 : ℤ) ∧ (∀ n : ℤ, n < 0 → 0 < (10 : ℝ) ^ n ∧ (10 : ℝ) ^ n < 1) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, fun n hn => ?_⟩
  refine ⟨zpow_pos (by norm_num) n, ?_⟩
  have := zpow_lt_zpow_right₀ (show (1 : ℝ) < 10 by norm_num) hn
  simpa using this

/-- Korak za korakom: (2⁻¹)³·4²/2⁻⁵ = (2⁻¹)³·(2²)²/2⁻⁵ = 2⁻³·2⁴/2⁻⁵ = 2¹/2⁻⁵ = 2⁶ = 64; −3 + 4 = 1,
1 − (−5) = 6 ≠ −4. -/
theorem korak : ((2 : ℝ) ^ (-1 : ℤ)) ^ (3 : ℤ) * 4 ^ (2 : ℤ) / 2 ^ (-5 : ℤ) = 64 ∧ (-3 + 4 : ℤ) = 1 ∧
    (1 - (-5) : ℤ) = 6 ∧ (6 : ℤ) ≠ -4 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  have h2 : (2 : ℝ) ≠ 0 := two_ne_zero
  calc ((2 : ℝ) ^ (-1 : ℤ)) ^ (3 : ℤ) * 4 ^ (2 : ℤ) / 2 ^ (-5 : ℤ)
      = ((2 : ℝ) ^ (-1 : ℤ)) ^ (3 : ℤ) * ((2 : ℝ) ^ (2 : ℤ)) ^ (2 : ℤ) / 2 ^ (-5 : ℤ) := by norm_num
    _ = (2 : ℝ) ^ (-3 : ℤ) * 2 ^ (4 : ℤ) / 2 ^ (-5 : ℤ) := by rw [← zpow_mul, ← zpow_mul]; norm_num
    _ = (2 : ℝ) ^ (1 : ℤ) / 2 ^ (-5 : ℤ) := by rw [← zpow_add₀ h2]; norm_num
    _ = (2 : ℝ) ^ (6 : ℤ) := by rw [← zpow_sub₀ h2]; norm_num
    _ = 64 := by norm_num

/-- Korak za korakom, preizkus: (1/2)³ = 1/8, 4² = 16, 16/8 = 2, 2⁻⁵ = 1/32, 2 : 1/32 = 2·32 = 64. -/
theorem korak_preizkus : ((1 : ℝ) / 2) ^ 3 = 1 / 8 ∧ (4 : ℝ) ^ 2 = 16 ∧ (16 / 8 : ℝ) = 2 ∧
    (2 : ℝ) ^ (-5 : ℤ) = 1 / 32 ∧ (2 / (1 / 32) : ℝ) = 2 * 32 ∧ (2 * 32 : ℝ) = 64 := by norm_num

/-- Bolj natančno: pri a > 1 večji celi eksponent da večjo potenco, pri 0 < a < 1 manjšo; 2⁻³ = 1/8 < 4 = 2²;
(1/2)⁻³ = 8 > 1/4 = (1/2)². -/
theorem rast (a : ℝ) (m n : ℤ) (hmn : m < n) : (1 < a → a ^ m < a ^ n) ∧ (0 < a → a < 1 → a ^ n < a ^ m) :=
  ⟨fun h => zpow_lt_zpow_right₀ h hmn, fun h0 h1 => zpow_lt_zpow_right_of_lt_one₀ h0 h1 hmn⟩

/-- Predpostavke `rast` se dajo izpolniti (a = 2 in a = 1/2, m = −3, n = 2). -/
example : (2 : ℝ) ^ (-3 : ℤ) < 2 ^ (2 : ℤ) ∧ ((1 : ℝ) / 2) ^ (2 : ℤ) < (1 / 2) ^ (-3 : ℤ) :=
  ⟨(rast 2 (-3) 2 (by norm_num)).1 (by norm_num), (rast (1 / 2) (-3) 2 (by norm_num)).2 (by norm_num) (by norm_num)⟩

/-- Bolj natančno: 2⁻³ = 1/8 < 4 = 2²; (1/2)⁻³ = 8, (1/2)² = 1/4. -/
theorem rast_primeri : (2 : ℝ) ^ (-3 : ℤ) = 1 / 8 ∧ (1 / 8 : ℝ) < 4 ∧ (2 : ℝ) ^ 2 = 4 ∧ ((1 : ℝ) / 2) ^ (-3 : ℤ) = 8 ∧
    ((1 : ℝ) / 2) ^ 2 = 1 / 4 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1: 10⁴ = 10·10·10·10 = 10000, ne 10·4 = 40. -/
theorem preveri1 : (10 : ℝ) ^ 4 = 10 * 10 * 10 * 10 ∧ (10 * 10 * 10 * 10 : ℝ) = 10000 ∧ (10 : ℝ) ^ 4 ≠ 10 * 4 := by
  norm_num

/-- Preveri se 2: (−2)³ = −8 < −2² = −4 < 2⁻³ = 1/8 < 2⁰ = 1. -/
theorem preveri2 : (-2 : ℝ) ^ 3 = -8 ∧ -(2 : ℝ) ^ 2 = -4 ∧ (2 : ℝ) ^ (-3 : ℤ) = 1 / 8 ∧ (2 : ℝ) ^ (0 : ℤ) = 1 ∧
    (-2 : ℝ) ^ 3 < -2 ^ 2 ∧ -(2 : ℝ) ^ 2 < 2 ^ (-3 : ℤ) ∧ (2 : ℝ) ^ (-3 : ℤ) < 2 ^ (0 : ℤ) := by norm_num

/-- Preveri se 3: 2ⁿ⁺¹ = 2ⁿ·2 (število igralcev se podvoji), ni 2ⁿ + 1 (za n ≥ 1) ne 2ⁿ + 2 (za n ≥ 2);
(2ⁿ)² = 2²ⁿ; 2⁷ = 2·2⁶ = 128 namesto 64. -/
theorem preveri3 (n : ℕ) : (2 : ℝ) ^ (n + 1) = 2 ^ n * 2 ∧ (1 ≤ n → (2 : ℝ) ^ (n + 1) ≠ 2 ^ n + 1) ∧
    (2 ≤ n → (2 : ℝ) ^ (n + 1) ≠ 2 ^ n + 2) ∧ ((2 : ℝ) ^ n) ^ 2 = 2 ^ (2 * n) ∧ (2 : ℝ) ^ 6 = 64 ∧
    (2 : ℝ) ^ 7 = 128 := by
  refine ⟨pow_succ 2 n, fun h => ?_, fun h => ?_, by rw [← pow_mul, mul_comm], by norm_num, by norm_num⟩
  · have : (2 : ℝ) ^ 1 ≤ 2 ^ n := pow_le_pow_right₀ (by norm_num) h
    rw [pow_succ]; intro e; linarith
  · have : (2 : ℝ) ^ 2 ≤ 2 ^ n := pow_le_pow_right₀ (by norm_num) h
    rw [pow_succ]; intro e; nlinarith

/-- Predpostavki `preveri3` se dajo izpolniti (n = 6). -/
example : (2 : ℝ) ^ (6 + 1) ≠ 2 ^ 6 + 1 ∧ (2 : ℝ) ^ (6 + 1) ≠ 2 ^ 6 + 2 :=
  ⟨(preveri3 6).2.1 (by norm_num), (preveri3 6).2.2.1 (by norm_num)⟩

/-- Preveri se 4: (2/5)⁻² = (5/2)² = 25/4 = 6,25; ni 0,16, −0,16 ne 2,5. -/
theorem preveri4 : ((2 : ℝ) / 5) ^ (-2 : ℤ) = (5 / 2) ^ 2 ∧ ((5 : ℝ) / 2) ^ 2 = 25 / 4 ∧ (25 / 4 : ℝ) = 6.25 ∧
    ((2 : ℝ) / 5) ^ (-2 : ℤ) ≠ 0.16 ∧ ((2 : ℝ) / 5) ^ (-2 : ℤ) ≠ -0.16 ∧ ((2 : ℝ) / 5) ^ (-2 : ℤ) ≠ 2.5 := by
  norm_num

/-- Preveri se 5: 2³·2⁻⁵/2⁻⁴ = 2³⁺⁽⁻⁵⁾/2⁻⁴ = 2⁻²/2⁻⁴ = 2⁻²⁻⁽⁻⁴⁾ = 2² = 4; ni 2⁻⁶ = 1/64 ne −4. -/
theorem preveri5 : (2 : ℝ) ^ (3 : ℤ) * 2 ^ (-5 : ℤ) / 2 ^ (-4 : ℤ) = 4 ∧ (2 : ℝ) ^ (-6 : ℤ) = 1 / 64 ∧
    (4 : ℝ) ≠ 1 / 64 ∧ (4 : ℝ) ≠ -4 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  have h2 : (2 : ℝ) ≠ 0 := two_ne_zero
  calc (2 : ℝ) ^ (3 : ℤ) * 2 ^ (-5 : ℤ) / 2 ^ (-4 : ℤ) = 2 ^ ((3 : ℤ) + -5) / 2 ^ (-4 : ℤ) := by
        rw [zpow_add₀ h2]
    _ = 2 ^ (-2 : ℤ) / 2 ^ (-4 : ℤ) := by norm_num
    _ = 2 ^ ((-2 : ℤ) - -4) := by rw [zpow_sub₀ h2]
    _ = 4 := by norm_num

/-! ## RACUN -/

/-- Blok RACUN: vrstice z x, y so v `naloga1` (pogoj x, y ≠ 0; (xy⁻¹)³ = x³/y³ je `racun_xy`), vrednosti tu. -/
theorem racun : ((8 : ℝ) ^ 2 * 1) / (1 / 2) ^ 3 = 512 ∧ (5.2 : ℝ) * 4.8 = 24.96 ∧
    (5.2 : ℝ) * 10 ^ 6 * 4.8 * 10 ^ 6 = 2.496 * 10 ^ 13 ∧
    (2.496 : ℝ) * 10 ^ 13 * 7.6 * 10 ^ (-6 : ℤ) = 1.89696 * 10 ^ 8 ∧
    (1.89696 : ℝ) * 10 ^ 5 / (4.0 * 10 ^ 4) = 4.7424 := by norm_num

/-- Blok RACUN: (x·y⁻¹)³ = x³/y³ za x, y ≠ 0. -/
theorem racun_xy (x y : ℝ) (_hx : x ≠ 0) (_hy : y ≠ 0) : (x * y ^ (-1 : ℤ)) ^ (3 : ℤ) = x ^ 3 / y ^ 3 := by
  rw [zpow_neg, zpow_one, zpow_ofNat, mul_pow, inv_pow, div_eq_mul_inv]

/-- Predpostavki `racun_xy` se dajo izpolniti (x = 1, y = 2). -/
example : ((1 : ℝ) * 2 ^ (-1 : ℤ)) ^ (3 : ℤ) = 1 ^ 3 / 2 ^ 3 := racun_xy 1 2 one_ne_zero two_ne_zero

end Evklid.Lekcije.MAT_SS_1.PotenceZNaravnimiInCelimiEksponenti
