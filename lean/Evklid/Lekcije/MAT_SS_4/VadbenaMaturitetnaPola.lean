/-
vir: content/lessons/MAT-SS-4/vadbena-maturitetna-pola.md
sha256: 112d369ecf5696dbf79f4fc14d2c2416ba66f88bd2e24f79256ea787a493d70f
Ni v Leanu: zgradba mature, delež ocene, priloga, vrstni red reševanja, pravilo preskoka, točkovanje in
pravila za zapis (organizacija izpita, ne matematične trditve; dokazani so le računi minut in točk);
risbe in simulacija razen ničel in temena; zgodba o Neži; ključne besede razen izreka o ostanku in
vrednosti `sin 60°`. Numerične vrednosti kotov in kotnih funkcij (zahtevno, še ni dokazano; ocene bi
šle prek `Real.sin_bound`/`Real.cos_bound`, mej za `π` in adicijskih formul): kot `71,9°` (naloga 17),
kot `74,7°` (naloga 23; dokazan je `cos φ = 5/19`), števila naloge 25 (`74,1 m`, `0,71003`, `45,2°`,
`2234,6 m²`, `60,4 m`; dokazani so kosinusni in sinusni izrek s simboloma `cos 58°`, `sin 58°`, ostrost
`β`, `S = 2635·sin 58°`, pretvorba v are in `v_a = 2S/a`), kot `38,7°` (naloga 27; dokazan je
`tan φ = 0,8`), kot `109,5°` (naloga 29; dokazan je `tan(φ/2) = √2`), koti `143,13°`, `71,57°`, radiani
`2,49809…` in ploščina odseka `23,73` (naloga 31; dokazani so `cos φ = −0,8`, `sin φ = 0,6`, `tan δ = 3`
in `δ = φ/2`). Števila naloge 21 (`3,42`, `72,31`, `92,07 %`) so dokazana.
Odklon pri deljenju z `N − 1` (`2,82`) in »5 podatkov« pri njem sta dokazana kot pripadnost `12, …, 16`
intervalu in nepripadnost ostalih treh; »4 podatki« pri
`σ` so dokazani kot pripadnost `13, 14, 15, 16` intervalu in nepripadnost ostalih štirih. Pri
nalogi 28 so verjetnosti dokazane kot ulomki iz binomskih koeficientov (ne kot dogodki v verjetnostnem
prostoru). Približki »≈« so dokazani kot |vrednost − približek| ≤ pol enote zadnjega mesta, zapisi
»4,2766…« kot spodnja in zgornja meja na zapisano število decimalk.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.VadbenaMaturitetnaPola

open Set Filter Topology Real intervalIntegral

/-! ## Pomožne trditve -/

/-- Pomožna trditev: približek »≈ v« dokažemo z mejama `v − e ≤ x ≤ v + e`. -/
theorem blizu {x v e : ℝ} (h1 : v - e ≤ x) (h2 : x ≤ v + e) : |x - v| ≤ e :=
  abs_le.mpr ⟨by linarith, by linarith⟩

/-- Pomožna trditev: iz `xᵠ = A` in `loᵠ < A < hiᵠ` (vse nenegativno) sledi `lo < x < hi`. -/
theorem koren_meje (x A lo hi : ℝ) (q : ℕ) (hx : 0 ≤ x) (hhi : 0 ≤ hi) (hxA : x ^ q = A)
    (h1 : lo ^ q < A) (h2 : A < hi ^ q) : lo < x ∧ x < hi :=
  ⟨lt_of_pow_lt_pow_left₀ q hx (hxA ▸ h1), lt_of_pow_lt_pow_left₀ q hhi (hxA ▸ h2)⟩

/-- Pomožna trditev: meje za `√A` iz `lo² < A < hi²`. -/
theorem koren2 (A lo hi : ℝ) (hA : 0 ≤ A) (hhi : 0 ≤ hi) (h1 : lo ^ 2 < A) (h2 : A < hi ^ 2) :
    lo < Real.sqrt A ∧ Real.sqrt A < hi :=
  koren_meje _ A lo hi 2 (Real.sqrt_nonneg A) hhi (Real.sq_sqrt hA) h1 h2

/-- Pomožna trditev: meje za `eʳ` pri `r·q = m` iz mej za `e` (`2,7182818283 < e < 2,7182818286`). -/
theorem ocena_exp (r : ℝ) (q m : ℕ) (hm : m ≠ 0) (hr : (q:ℝ) * r = m) (lo hi : ℝ) (hhi : 0 ≤ hi)
    (h1 : lo ^ q ≤ (2.7182818283:ℝ) ^ m) (h2 : (2.7182818286:ℝ) ^ m ≤ hi ^ q) :
    lo < Real.exp r ∧ Real.exp r < hi := by
  have e : Real.exp r ^ q = Real.exp 1 ^ m := by
    rw [← Real.exp_nat_mul, ← Real.exp_nat_mul, hr, mul_one]
  have a := pow_lt_pow_left₀ Real.exp_one_gt_d9 (by norm_num) hm
  have b := pow_lt_pow_left₀ Real.exp_one_lt_d9 (Real.exp_pos 1).le hm
  exact koren_meje _ _ lo hi q (Real.exp_pos r).le hhi e (by linarith) (by linarith)

/-- Pomožna trditev: meje za `ln(1 − x)` iz vrste `−(x + x²/2 + … + xⁿ/n)` z oceno ostanka. -/
theorem log_meje (x : ℝ) (n : ℕ) (hx : |x| < 1) (lo hi : ℝ)
    (h1 : lo ≤ -(∑ i ∈ Finset.range n, x ^ (i + 1) / (i + 1)) - |x| ^ (n + 1) / (1 - |x|))
    (h2 : -(∑ i ∈ Finset.range n, x ^ (i + 1) / (i + 1)) + |x| ^ (n + 1) / (1 - |x|) ≤ hi) :
    lo ≤ Real.log (1 - x) ∧ Real.log (1 - x) ≤ hi := by
  have := Real.abs_log_sub_add_sum_range_le hx n
  rw [abs_le] at this
  constructor <;> linarith [this.1, this.2]

/-- Pomožna trditev (Newton-Leibnizova formula). -/
theorem newton_leibniz (F f : ℝ → ℝ) (a b : ℝ) (hF : ∀ x, HasDerivAt F (f x) x) (hf : Continuous f) :
    ∫ x in a..b, f x = F b - F a :=
  integral_eq_sub_of_hasDerivAt (fun x _ => hF x) (hf.intervalIntegrable a b)

/-- Pomožna trditev: `bʳ` z naravnim eksponentom. -/
theorem rp (b : ℝ) (n : ℕ) : b ^ (n:ℝ) = b ^ n := Real.rpow_natCast b n

/-- Predpostavke trditve `blizu` se dajo izpolniti. -/
example : (1:ℝ) - 0.5 ≤ 1 ∧ (1:ℝ) ≤ 1 + 0.5 := by norm_num

/-- Predpostavke trditve `newton_leibniz` se dajo izpolniti (`F(x) = x`, `f = 1`). -/
example : (∀ x : ℝ, HasDerivAt (fun x : ℝ => x) 1 x) ∧ Continuous (fun _ : ℝ => (1:ℝ)) :=
  ⟨fun x => hasDerivAt_id' x, continuous_const⟩

/-- Predpostavke trditve `log_meje` se dajo izpolniti (`x = 0`, `n = 1`, `lo = hi = 0`). -/
example : |(0:ℝ)| < 1 ∧
    (0:ℝ) ≤ -(∑ i ∈ Finset.range 1, (0:ℝ) ^ (i + 1) / (i + 1)) - |(0:ℝ)| ^ (1 + 1) / (1 - |(0:ℝ)|) ∧
    -(∑ i ∈ Finset.range 1, (0:ℝ) ^ (i + 1) / (i + 1)) + |(0:ℝ)| ^ (1 + 1) / (1 - |(0:ℝ)|) ≤ 0 := by
  norm_num

/-- Predpostavke trditev `koren_meje` (`x = 2`, `A = 4`, `q = 2`, `lo = 1`, `hi = 3`) in `koren2` se dajo
izpolniti. -/
example : (0:ℝ) ≤ 2 ∧ (0:ℝ) ≤ 3 ∧ (2:ℝ) ^ 2 = 4 ∧ (1:ℝ) ^ 2 < 4 ∧ (4:ℝ) < 3 ^ 2 := by norm_num

/-- Predpostavke trditve `ocena_exp` se dajo izpolniti (`r = 1`, `q = m = 1`, `lo = 2`, `hi = 3`). -/
example : (1:ℕ) ≠ 0 ∧ ((1:ℕ):ℝ) * 1 = ((1:ℕ):ℝ) ∧ (0:ℝ) ≤ 3 ∧ (2:ℝ) ^ 1 ≤ (2.7182818283:ℝ) ^ 1 ∧
    (2.7182818286:ℝ) ^ 1 ≤ (3:ℝ) ^ 1 := by norm_num

/-! ## Uganka: štiri naloge v 20 minutah -/

/-- Točke nalog A, B, C, D. -/
def tocke : Fin 4 → ℕ := ![2, 6, 8, 3]

/-- Čas nalog A, B, C, D v minutah. -/
def cas : Fin 4 → ℕ := ![3, 10, 18, 4]

/-- Uganka: A, B in D vzamejo `3 + 10 + 4 = 17` minut in prinesejo `2 + 6 + 3 = 11` točk; ob C ne gre
nobena druga naloga (`18 + 3 > 20`); nobena izbira nalog v `20` minutah ne prinese več kot `11` točk. -/
theorem uganka :
    (∑ i ∈ ({0, 1, 3} : Finset (Fin 4)), cas i = 3 + 10 + 4) ∧ 3 + 10 + 4 = 17 ∧
      (∑ i ∈ ({0, 1, 3} : Finset (Fin 4)), tocke i = 2 + 6 + 3) ∧ 2 + 6 + 3 = 11 ∧
      (∀ i : Fin 4, i ≠ 2 → cas 2 + cas i > 20) ∧
      ∀ s : Finset (Fin 4), ∑ i ∈ s, cas i ≤ 20 → ∑ i ∈ s, tocke i ≤ 11 := by
  refine ⟨by decide, by norm_num, by decide, by norm_num, by decide, ?_⟩
  decide

/-! ## Razlaga: zgradba pole in čas za točko -/

/-- Razlaga 1 in 2: osnovna raven `20 + 40 = 60` točk (`8` kratkih po največ `3`, `6` krajših po `5` do `8`),
višja `40 + 20 = 60` (`2` nalogi po `9` do `11`); minut na točko `30 : 20 = 60 : 40 = 90 : 60 = 1,5`;
`1,5·3 = 4,5`, `1,5·7 = 10,5`; `90 − 15 = 75`, `75 : 60 = 1,25`; stolpci `5 + 25 + 50 + 10 = 90`. -/
theorem cas_za_tocko :
    20 + 40 = 60 ∧ 20 ≤ 8 * 3 ∧ 6 * 5 ≤ 40 ∧ 40 ≤ 6 * 8 ∧ 2 * 9 ≤ 20 ∧ 20 ≤ 2 * 11 ∧
      (30:ℝ) / 20 = 1.5 ∧ (60:ℝ) / 40 = 1.5 ∧ (90:ℝ) / 60 = 1.5 ∧ (1.5:ℝ) * 3 = 4.5 ∧
      (1.5:ℝ) * 7 = 10.5 ∧ 90 - 15 = 75 ∧ (75:ℝ) / 60 = 1.25 ∧ 5 + 25 + 50 + 10 = 90 := by
  norm_num

/-- Razlaga 4: `log₃(x − 1) = 2` (pogoj `x > 1`) ⇔ `x − 1 = 3² = 9` ⇔ `x = 10`; Cenetov `x = 11` ni rešitev. -/
theorem razlaga_log (x : ℝ) (hx : 1 < x) :
    (Real.logb 3 (x - 1) = 2 ↔ x - 1 = 3 ^ 2) ∧ (Real.logb 3 (x - 1) = 2 ↔ x = 10) ∧
      Real.logb 3 (11 - 1) ≠ 2 := by
  have key : ∀ y : ℝ, 1 < y → (Real.logb 3 (y - 1) = 2 ↔ y - 1 = 3 ^ 2) := by
    intro y hy
    rw [Real.logb_eq_iff_rpow_eq (by norm_num) (by norm_num) (by linarith),
      show (2:ℝ) = ((2:ℕ):ℝ) by norm_num, rp]
    exact eq_comm
  refine ⟨key x hx, ?_, ?_⟩
  · rw [key x hx]; constructor <;> intro h <;> linarith
  · rw [Ne, key 11 (by norm_num)]; norm_num

/-- Predpostavka trditve `razlaga_log` se da izpolniti (`x = 10`). -/
example : (1:ℝ) < 10 := by norm_num

/-- Razlaga 5 (ključna beseda »deljiv«, izrek o ostanku): polinom `p` je deljiv z `x − a` natanko tedaj,
ko je `p(a) = 0`. -/
theorem izrek_o_ostanku (p : Polynomial ℝ) (a : ℝ) :
    Polynomial.X - Polynomial.C a ∣ p ↔ p.eval a = 0 :=
  Polynomial.dvd_iff_isRoot

/-- Razlaga 5 (ključna beseda »natančno«): `sin 60° = √3/2`. -/
theorem sin60 : Real.sin (60 * (π / 180)) = Real.sqrt 3 / 2 := by
  rw [show 60 * (π / 180) = π / 3 by ring, Real.sin_pi_div_three]

/-- Razlaga 6 (simulacija): kvadratna funkcija `(x − 2)² − 1` ima ničli `1` in `3` ter teme `(2, −1)`. -/
theorem simulacija :
    (∀ x : ℝ, (x - 2) ^ 2 - 1 = 0 ↔ x = 1 ∨ x = 3) ∧ (∀ x : ℝ, -1 ≤ (x - 2) ^ 2 - 1) ∧
      ((2:ℝ) - 2) ^ 2 - 1 = -1 := by
  refine ⟨fun x => ⟨fun h => ?_, ?_⟩, fun x => by nlinarith [sq_nonneg (x - 2)], by norm_num⟩
  · have : (x - 1) * (x - 3) = 0 := by linear_combination h
    rcases mul_eq_zero.mp this with h1 | h1
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-! ## Primer 1: lokvanji -/

/-- Primer 1: `3·3ⁿ = 243` ⇔ `3ⁿ = 81 = 3⁴` ⇔ `n = 4` (za realni `n`); preverba `3·3⁴ = 3·81 = 243`;
zaporedje `3, 9, 27, 81, 243`. -/
theorem primer1 :
    (∀ n : ℝ, 3 * (3:ℝ) ^ n = 243 ↔ (3:ℝ) ^ n = 81) ∧ (81:ℝ) = 3 ^ 4 ∧
      (∀ n : ℝ, 3 * (3:ℝ) ^ n = 243 ↔ n = 4) ∧ 3 * (3:ℝ) ^ 4 = 3 * 81 ∧ (3:ℝ) * 81 = 243 ∧
      (List.range 5).map (fun k => 3 * 3 ^ k) = [3, 9, 27, 81, 243] := by
  have h1 : ∀ n : ℝ, 3 * (3:ℝ) ^ n = 243 ↔ (3:ℝ) ^ n = 81 := fun n => by
    constructor <;> intro h <;> linarith
  refine ⟨h1, by norm_num, fun n => ?_, by norm_num, by norm_num, by decide⟩
  rw [h1, show (81:ℝ) = 3 ^ ((4:ℕ):ℝ) by rw [rp]; norm_num]
  constructor
  · intro h
    have := (Real.rpow_right_inj (by norm_num : (0:ℝ) < 3) (by norm_num)).mp h
    exact_mod_cast this
  · rintro rfl; norm_num

/-! ## Primer 2: jesenski dan -/

/-- Temperatura iz primera 2: `T(t) = −t²/4 + 3t + 2`. -/
noncomputable def T₂ (t : ℝ) : ℝ := -(1 / 4) * t ^ 2 + 3 * t + 2

/-- Primer 2 a): `T(0) = 2` in `T(12) = −36 + 36 + 2 = 2`. -/
theorem primer2_a : T₂ 0 = 2 ∧ T₂ 12 = -36 + 36 + 2 ∧ (-36:ℝ) + 36 + 2 = 2 := by
  norm_num [T₂]

/-- Primer 2 b): `T'(t) = −t/2 + 3`, ničla `t = 6`; pred njo je odvod pozitiven, za njo negativen;
`T(6) = −9 + 18 + 2 = 11` je največja temperatura; `6 + 6 = 12` (ob 12. uri). -/
theorem primer2_b :
    (∀ t, HasDerivAt T₂ (-(1 / 2) * t + 3) t) ∧ (∀ t : ℝ, -(1 / 2) * t + 3 = 0 ↔ t = 6) ∧
      (∀ t : ℝ, t < 6 → 0 < -(1 / 2) * t + 3) ∧ (∀ t : ℝ, 6 < t → -(1 / 2) * t + 3 < 0) ∧
      T₂ 6 = -9 + 18 + 2 ∧ (-9:ℝ) + 18 + 2 = 11 ∧ (∀ t, T₂ t ≤ 11) ∧ 6 + 6 = 12 := by
  refine ⟨fun t => ?_, fun t => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    fun t h => by linarith, fun t h => by linarith, by norm_num [T₂], by norm_num,
    fun t => by unfold T₂; nlinarith [sq_nonneg (t - 6)], by norm_num⟩
  unfold T₂
  exact ((((hasDerivAt_pow 2 t).const_mul (-(1 / 4))).add ((hasDerivAt_id' t).const_mul 3)).add_const 2)
    |>.congr_deriv (by norm_num; ring)

/-- Primer 2 c): `T(t) > 10` ⇔ `t² − 12t + 32 < 0` ⇔ `(t − 4)(t − 8) < 0` ⇔ `4 < t < 8`, torej med
`6 + 4 = 10.` in `6 + 8 = 14.` uro; Rok dobi `1 + 2 + 2 = 5` točk. -/
theorem primer2_c (t : ℝ) :
    (T₂ t > 10 ↔ t ^ 2 - 12 * t + 32 < 0) ∧ t ^ 2 - 12 * t + 32 = (t - 4) * (t - 8) ∧
      (T₂ t > 10 ↔ 4 < t ∧ t < 8) ∧ 6 + 4 = 10 ∧ 6 + 8 = 14 ∧ 1 + 2 + 2 = 5 := by
  have h1 : T₂ t > 10 ↔ t ^ 2 - 12 * t + 32 < 0 := by
    unfold T₂; constructor <;> intro h <;> linarith
  refine ⟨h1, by ring, ?_, by norm_num, by norm_num, by norm_num⟩
  rw [h1]
  constructor
  · intro h
    constructor <;> nlinarith
  · rintro ⟨h4, h8⟩
    nlinarith

/-! ## Primer 3: vodostaj po nalivu -/

/-- Primer 3, korak 1: `v(t) = 6t − t² = t(6 − t)` je pozitivna natanko za `0 < t < 6`. -/
theorem primer3_narasca (t : ℝ) : 6 * t - t ^ 2 = t * (6 - t) ∧ (0 < 6 * t - t ^ 2 ↔ 0 < t ∧ t < 6) := by
  refine ⟨by ring, ⟨fun h => ?_, fun ⟨h0, h6⟩ => by nlinarith⟩⟩
  by_contra hn
  rw [not_and_or, not_lt, not_lt] at hn
  rcases hn with hn | hn <;> nlinarith

/-- Primer 3, koraki 2–4 in premisli: `Δh = ∫₀⁶ (6t − t²) dt = [3t² − t³/3]₀⁶ = 3·36 − 216/3 = 108 − 72 = 36`;
največja hitrost `v(3) = 9`, zato je dvig manjši od `6·9 = 54`. -/
theorem primer3_dvig :
    ∫ t in (0:ℝ)..6, (6 * t - t ^ 2) = 36 ∧ (∀ t : ℝ, 6 * t - t ^ 2 ≤ 9) ∧ 6 * (3:ℝ) - 3 ^ 2 = 9 ∧
      (6:ℝ) * 9 = 54 ∧ (36:ℝ) < 54 := by
  have hF : ∀ t, HasDerivAt (fun t : ℝ => 3 * t ^ 2 - t ^ 3 / 3) (6 * t - t ^ 2) t := by
    intro t
    exact (((hasDerivAt_pow 2 t).const_mul 3).sub ((hasDerivAt_pow 3 t).div_const 3)).congr_deriv
      (by norm_num; ring)
  refine ⟨?_, fun t => by nlinarith [sq_nonneg (t - 3)], by norm_num, by norm_num, by norm_num⟩
  calc ∫ t in (0:ℝ)..6, (6 * t - t ^ 2)
      = (3 * 6 ^ 2 - 6 ^ 3 / 3) - (3 * 0 ^ 2 - 0 ^ 3 / 3) := newton_leibniz _ _ 0 6 hF (by fun_prop)
    _ = 3 * 36 - 216 / 3 := by norm_num
    _ = 108 - 72 := by norm_num
    _ = 36 := by norm_num

/-! ## Pola 1, naloge 1–8 -/

/-- Naloga 1: `4ˣ⁺¹ = (2²)ˣ⁺¹ = 2²ˣ⁺²`; `2³ˣ⁻¹ = 2²ˣ⁺²` ⇔ `3x − 1 = 2x + 2` ⇔ `x = 3`; preverba
`2⁸ = 256 = 4⁴`. -/
theorem naloga1 :
    (∀ x : ℝ, (4:ℝ) ^ (x + 1) = (2:ℝ) ^ (2 * x + 2)) ∧
      (∀ x : ℝ, (2:ℝ) ^ (3 * x - 1) = (4:ℝ) ^ (x + 1) ↔ x = 3) ∧ (2:ℝ) ^ 8 = 256 ∧ (4:ℝ) ^ 4 = 256 := by
  have h4 : ∀ x : ℝ, (4:ℝ) ^ (x + 1) = (2:ℝ) ^ (2 * x + 2) := by
    intro x
    rw [show (4:ℝ) = 2 ^ (2:ℝ) by rw [show (2:ℝ) = ((2:ℕ):ℝ) by norm_num, rp]; norm_num,
      ← Real.rpow_mul (by norm_num)]
    ring_nf
  refine ⟨h4, fun x => ?_, by norm_num, by norm_num⟩
  rw [h4]
  constructor
  · intro h
    have := (Real.rpow_right_inj (by norm_num : (0:ℝ) < 2) (by norm_num)).mp h
    linarith
  · rintro rfl; norm_num

/-- Naloga 2: `x² − 2x − 3 = x + 1` ⇔ `x² − 3x − 4 = (x − 4)(x + 1) = 0` ⇔ `x = 4` ali `x = −1`;
`g(4) = 5`, `g(−1) = 0`: presečišči `A(4, 5)` in `B(−1, 0)`. -/
theorem naloga2 (x : ℝ) :
    (x ^ 2 - 2 * x - 3 = x + 1 ↔ x ^ 2 - 3 * x - 4 = 0) ∧ x ^ 2 - 3 * x - 4 = (x - 4) * (x + 1) ∧
      (x ^ 2 - 2 * x - 3 = x + 1 ↔ x = 4 ∨ x = -1) ∧ (4:ℝ) + 1 = 5 ∧ (-1:ℝ) + 1 = 0 := by
  refine ⟨by constructor <;> intro h <;> linarith, by ring, ⟨fun h => ?_, ?_⟩, by norm_num, by norm_num⟩
  · have : (x - 4) * (x + 1) = 0 := by linear_combination h
    rcases mul_eq_zero.mp this with h1 | h1
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Naloga 3: `sin 120° = sin 60° = √3/2`, `cos 150° = −cos 30° = −√3/2`; izraz je
`(√3/2)/(1 + √3/2) = √3/(2 + √3) = √3(2 − √3)/(4 − 3) = 2√3 − 3`. -/
theorem naloga3 :
    Real.sin (120 * (π / 180)) = Real.sin (60 * (π / 180)) ∧
      Real.sin (60 * (π / 180)) = Real.sqrt 3 / 2 ∧
      Real.cos (150 * (π / 180)) = -Real.cos (30 * (π / 180)) ∧
      Real.cos (30 * (π / 180)) = Real.sqrt 3 / 2 ∧
      Real.sin (120 * (π / 180)) / (1 - Real.cos (150 * (π / 180))) =
        (Real.sqrt 3 / 2) / (1 + Real.sqrt 3 / 2) ∧
      (Real.sqrt 3 / 2) / (1 + Real.sqrt 3 / 2) = Real.sqrt 3 / (2 + Real.sqrt 3) ∧
      Real.sqrt 3 / (2 + Real.sqrt 3) = Real.sqrt 3 * (2 - Real.sqrt 3) / (4 - 3) ∧
      Real.sqrt 3 * (2 - Real.sqrt 3) / (4 - 3) = 2 * Real.sqrt 3 - 3 := by
  have h3 : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have s120 : Real.sin (120 * (π / 180)) = Real.sin (60 * (π / 180)) := by
    rw [show 120 * (π / 180) = π - 60 * (π / 180) by ring, Real.sin_pi_sub]
  have s60 := sin60
  have c150 : Real.cos (150 * (π / 180)) = -Real.cos (30 * (π / 180)) := by
    rw [show 150 * (π / 180) = π - 30 * (π / 180) by ring, Real.cos_pi_sub]
  have c30 : Real.cos (30 * (π / 180)) = Real.sqrt 3 / 2 := by
    rw [show 30 * (π / 180) = π / 6 by ring, Real.cos_pi_div_six]
  have hp : 0 < 2 + Real.sqrt 3 := by positivity
  refine ⟨s120, s60, c150, c30, by rw [s120, s60, c150, c30, sub_neg_eq_add], ?_, ?_, ?_⟩
  · rw [div_eq_div_iff (by positivity) hp.ne']; ring
  · rw [div_eq_div_iff hp.ne' (by norm_num)]; linear_combination Real.sqrt 3 * h3
  · rw [show (4:ℝ) - 3 = 1 by norm_num, div_one]; linear_combination -h3

/-- Naloga 4: `p(2) = 8 + 4a − 8 − 4 = 0` ⇔ `a = 1`; tedaj
`p(x) = x²(x + 1) − 4(x + 1) = (x + 1)(x² − 4) = (x + 1)(x − 2)(x + 2)`, ničle `−2`, `−1`, `2`. -/
theorem naloga4 :
    (∀ a : ℝ, (2:ℝ) ^ 3 + a * 2 ^ 2 - 4 * 2 - 4 = 8 + 4 * a - 8 - 4) ∧
      (∀ a : ℝ, 8 + 4 * a - 8 - 4 = 0 ↔ a = 1) ∧
      (∀ x : ℝ, x ^ 3 + x ^ 2 - 4 * x - 4 = x ^ 2 * (x + 1) - 4 * (x + 1) ∧
        x ^ 2 * (x + 1) - 4 * (x + 1) = (x + 1) * (x ^ 2 - 4) ∧
        (x + 1) * (x ^ 2 - 4) = (x + 1) * (x - 2) * (x + 2)) ∧
      ∀ x : ℝ, x ^ 3 + x ^ 2 - 4 * x - 4 = 0 ↔ x = -2 ∨ x = -1 ∨ x = 2 := by
  refine ⟨fun a => by ring, fun a => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    fun x => ⟨by ring, by ring, by ring⟩, fun x => ⟨fun h => ?_, ?_⟩⟩
  · have : (x + 1) * (x - 2) * (x + 2) = 0 := by linear_combination h
    rcases mul_eq_zero.mp this with h1 | h1
    · rcases mul_eq_zero.mp h1 with h2 | h2
      · right; left; linarith
      · right; right; linarith
    · left; linarith
  · rintro (rfl | rfl | rfl) <;> norm_num

/-- Naloga 5: `a₁ + 2d = 7`, `a₁ + 7d = 22` ⇔ `a₁ = 1`, `d = 3` (`5d = 15`, `a₁ = 7 − 6`). -/
theorem naloga5 (a₁ d : ℝ) :
    ((a₁ + 2 * d = 7 ∧ a₁ + 7 * d = 22) → 5 * d = 15) ∧
      ((a₁ + 2 * d = 7 ∧ a₁ + 7 * d = 22) ↔ (a₁ = 1 ∧ d = 3)) ∧ (7:ℝ) - 6 = 1 := by
  refine ⟨fun ⟨h1, h2⟩ => by linarith, ⟨fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩, ?_⟩, by norm_num⟩
  rintro ⟨rfl, rfl⟩; norm_num

/-- Naloga 6: `a⃗·b⃗ = m·m + 2·m + (−1)·8 = m² + 2m − 8 = (m + 4)(m − 2)`; vektorja sta pravokotna
natanko za `m = −4` ali `m = 2`; preverba `4 + 4 − 8 = 0`. -/
theorem naloga6 (m : ℝ) :
    m * m + 2 * m + (-1) * 8 = m ^ 2 + 2 * m - 8 ∧ m ^ 2 + 2 * m - 8 = (m + 4) * (m - 2) ∧
      (m * m + 2 * m + (-1) * 8 = 0 ↔ m = -4 ∨ m = 2) ∧ (4:ℝ) + 4 - 8 = 0 := by
  refine ⟨by ring, by ring, ⟨fun h => ?_, ?_⟩, by norm_num⟩
  · have : (m + 4) * (m - 2) = 0 := by linear_combination h
    rcases mul_eq_zero.mp this with h1 | h1
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Naloga 7: za `x ≠ 3`, `x ≠ 0` je `(x² − 9)/(x² − 3x) = (x + 3)/x`, zato je
`lim_{x→3} (x² − 9)/(x² − 3x) = 6/3 = 2`. -/
theorem naloga7 :
    (∀ x : ℝ, x ≠ 3 → x ≠ 0 → (x ^ 2 - 9) / (x ^ 2 - 3 * x) = (x + 3) / x) ∧ (3 + 3 : ℝ) / 3 = 2 ∧
      Tendsto (fun x : ℝ => (x ^ 2 - 9) / (x ^ 2 - 3 * x)) (𝓝[≠] 3) (𝓝 2) := by
  have kr : ∀ x : ℝ, x ≠ 3 → x ≠ 0 → (x ^ 2 - 9) / (x ^ 2 - 3 * x) = (x + 3) / x := by
    intro x h3 h0
    have h3' : x - 3 ≠ 0 := sub_ne_zero.mpr h3
    have : x ^ 2 - 3 * x ≠ 0 := by
      rw [show x ^ 2 - 3 * x = x * (x - 3) by ring]; exact mul_ne_zero h0 h3'
    rw [div_eq_div_iff this h0]; ring
  refine ⟨kr, by norm_num, ?_⟩
  have hc : ContinuousAt (fun x : ℝ => (x + 3) / x) 3 :=
    ContinuousAt.div (by fun_prop) continuousAt_id (by norm_num)
  have h2 : Tendsto (fun x : ℝ => (x + 3) / x) (𝓝[≠] 3) (𝓝 2) := by
    have := hc.tendsto.mono_left (nhdsWithin_le_nhds (s := {3}ᶜ))
    norm_num at this
    exact this
  apply h2.congr'
  filter_upwards [self_mem_nhdsWithin,
    nhdsWithin_le_nhds (eventually_ne_nhds (show (3:ℝ) ≠ 0 by norm_num))] with x hx hx0
  exact (kr x hx hx0).symm

/-- Štirimestna števila iz različnih števk `1, …, 5` (števka `i + 1` za `i : Fin 5`). -/
def stevila : Finset (Fin 5 × Fin 5 × Fin 5 × Fin 5) :=
  Finset.univ.filter fun t => t.1 ≠ t.2.1 ∧ t.1 ≠ t.2.2.1 ∧ t.1 ≠ t.2.2.2 ∧ t.2.1 ≠ t.2.2.1 ∧
    t.2.1 ≠ t.2.2.2 ∧ t.2.2.1 ≠ t.2.2.2

/-- Vrednost štirimestnega števila. -/
def vrednost (t : Fin 5 × Fin 5 × Fin 5 × Fin 5) : ℕ :=
  1000 * (t.1.val + 1) + 100 * (t.2.1.val + 1) + 10 * (t.2.2.1.val + 1) + (t.2.2.2.val + 1)

set_option maxRecDepth 100000 in
/-- Naloga 8: vseh števil je `5·4·3·2 = 120`; število je deljivo s `4` natanko tedaj, ko je deljivo
zadnje dvomestno; končnice so `12`, `24`, `32`, `52`; deljivih je `4·(3·2) = 24`. -/
theorem naloga8 :
    stevila.card = 5 * 4 * 3 * 2 ∧ 5 * 4 * 3 * 2 = 120 ∧ (∀ n : ℕ, 4 ∣ n ↔ 4 ∣ n % 100) ∧
      ((Finset.univ.filter fun p : Fin 5 × Fin 5 =>
        p.1 ≠ p.2 ∧ 4 ∣ 10 * (p.1.val + 1) + (p.2.val + 1)).image
          fun p => 10 * (p.1.val + 1) + (p.2.val + 1)) = {12, 24, 32, 52} ∧
      (stevila.filter fun t => 4 ∣ vrednost t).card = 4 * (3 * 2) ∧ 4 * (3 * 2) = 24 := by
  refine ⟨by decide, by norm_num, fun n => by omega, by decide, by decide, by norm_num⟩

/-! ## Pola 1, naloge 9–16 -/

/-- Naloga 9 a): definicijsko območje `x + 2 > 0`, tj. `x > −2`; ničla `log₂(x + 2) = 0` ⇔ `x + 2 = 1` ⇔
`x = −1`. -/
theorem naloga9_a :
    (∀ x : ℝ, 0 < x + 2 ↔ -2 < x) ∧ {x : ℝ | 0 < x + 2} = Set.Ioi (-2) ∧
      ∀ x : ℝ, -2 < x →
        (Real.logb 2 (x + 2) = 0 ↔ x + 2 = 1) ∧ (Real.logb 2 (x + 2) = 0 ↔ x = -1) := by
  have hd : ∀ x : ℝ, 0 < x + 2 ↔ -2 < x := fun x => by constructor <;> intro h <;> linarith
  refine ⟨hd, Set.ext fun x => hd x, fun x hx => ?_⟩
  have h : Real.logb 2 (x + 2) = 0 ↔ x + 2 = 1 := by
    rw [Real.logb_eq_iff_rpow_eq (by norm_num) (by norm_num) (by linarith), Real.rpow_zero]
    exact eq_comm
  refine ⟨h, ?_⟩
  rw [h]; constructor <;> intro h <;> linarith

/-- Predpostavka trditve `naloga9_a` se da izpolniti. -/
example : (-2:ℝ) < -1 := by norm_num

/-- Naloga 9 b): pri pogoju `x > 2` je `log₂(x + 2) + log₂(x − 2) = log₂((x + 2)(x − 2))`, enačba je
`x² − 4 = 32`, `x² = 36`; rešitev je le `x = 6` (`−6` ne izpolni pogoja); preverba
`log₂ 8 + log₂ 4 = 3 + 2 = 5`. -/
theorem naloga9_b :
    (∀ x : ℝ, 2 < x → Real.logb 2 (x + 2) + Real.logb 2 (x - 2) = Real.logb 2 ((x + 2) * (x - 2))) ∧
      (∀ x : ℝ, 2 < x → (Real.logb 2 ((x + 2) * (x - 2)) = 5 ↔ x ^ 2 - 4 = 32)) ∧
      (∀ x : ℝ, x ^ 2 - 4 = 32 ↔ x = 6 ∨ x = -6) ∧ ¬ (2 < (-6:ℝ)) ∧
      (∀ x : ℝ, (2 < x ∧ Real.logb 2 (x + 2) + Real.logb 2 (x - 2) = 5) ↔ x = 6) ∧
      Real.logb 2 8 = 3 ∧ Real.logb 2 4 = 2 ∧ (3:ℝ) + 2 = 5 := by
  have hsum : ∀ x : ℝ, 2 < x →
      Real.logb 2 (x + 2) + Real.logb 2 (x - 2) = Real.logb 2 ((x + 2) * (x - 2)) := by
    intro x hx
    rw [Real.logb_mul (by linarith) (by linarith)]
  have heq : ∀ x : ℝ, 2 < x → (Real.logb 2 ((x + 2) * (x - 2)) = 5 ↔ x ^ 2 - 4 = 32) := by
    intro x hx
    rw [Real.logb_eq_iff_rpow_eq (by norm_num) (by norm_num) (by nlinarith),
      show (5:ℝ) = ((5:ℕ):ℝ) by norm_num, rp]
    constructor <;> intro h <;> nlinarith
  have hkv : ∀ x : ℝ, x ^ 2 - 4 = 32 ↔ x = 6 ∨ x = -6 := by
    intro x
    constructor
    · intro h
      have : (x - 6) * (x + 6) = 0 := by linear_combination h
      rcases mul_eq_zero.mp this with h1 | h1
      · left; linarith
      · right; linarith
    · rintro (rfl | rfl) <;> norm_num
  have l8 : Real.logb 2 8 = 3 := by
    rw [Real.logb_eq_iff_rpow_eq (by norm_num) (by norm_num) (by norm_num),
      show (3:ℝ) = ((3:ℕ):ℝ) by norm_num, rp]; norm_num
  have l4 : Real.logb 2 4 = 2 := by
    rw [Real.logb_eq_iff_rpow_eq (by norm_num) (by norm_num) (by norm_num),
      show (2:ℝ) = ((2:ℕ):ℝ) by norm_num, rp]; norm_num
  refine ⟨hsum, heq, hkv, by norm_num, fun x => ⟨fun ⟨hx, h⟩ => ?_, ?_⟩, l8, l4, by norm_num⟩
  · rw [hsum x hx, heq x hx, hkv] at h
    rcases h with h | h
    · exact h
    · linarith
  · rintro rfl
    refine ⟨by norm_num, ?_⟩
    norm_num [l8, l4]

/-- Naloga 9 c): pri `x > −2` je `log₂(x + 2) < 3` ⇔ `x + 2 < 8` ⇔ `x < 6`; rešitev `(−2, 6)`. -/
theorem naloga9_c : {x : ℝ | -2 < x ∧ Real.logb 2 (x + 2) < 3} = Ioo (-2) 6 := by
  ext x
  simp only [Set.mem_ofPred_eq, mem_Ioo]
  constructor
  · rintro ⟨hx, h⟩
    rw [Real.logb_lt_iff_lt_rpow (by norm_num) (by linarith), show (3:ℝ) = ((3:ℕ):ℝ) by norm_num,
      rp] at h
    exact ⟨hx, by norm_num at h; linarith⟩
  · rintro ⟨hx, h6⟩
    refine ⟨hx, ?_⟩
    rw [Real.logb_lt_iff_lt_rpow (by norm_num) (by linarith), show (3:ℝ) = ((3:ℕ):ℝ) by norm_num, rp]
    norm_num; linarith

/-- Funkcija iz naloge 10: `f(x) = (2x² − 2)/(x² − 4)`. -/
noncomputable def f₁₀ (x : ℝ) : ℝ := (2 * x ^ 2 - 2) / (x ^ 2 - 4)

/-- Naloga 10 a): `f(x) = 2(x − 1)(x + 1)/((x − 2)(x + 2))`; ničli `±1`, pola `±2` (imenovalec 0, števec
`6 ≠ 0`), `f(0) = −2/−4 = 1/2`. -/
theorem naloga10_a :
    (∀ x : ℝ, f₁₀ x = 2 * (x - 1) * (x + 1) / ((x - 2) * (x + 2))) ∧
      (∀ x : ℝ, x ^ 2 ≠ 4 → (f₁₀ x = 0 ↔ x = 1 ∨ x = -1)) ∧
      (∀ x : ℝ, x ^ 2 - 4 = 0 ↔ x = 2 ∨ x = -2) ∧ 2 * (2:ℝ) ^ 2 - 2 ≠ 0 ∧ 2 * (-2:ℝ) ^ 2 - 2 ≠ 0 ∧
      f₁₀ 0 = -2 / -4 ∧ (-2:ℝ) / -4 = 1 / 2 := by
  refine ⟨fun x => by unfold f₁₀; congr 1 <;> ring, fun x hx => ?_, fun x => ⟨fun h => ?_, ?_⟩,
    by norm_num, by norm_num, by norm_num [f₁₀], by norm_num⟩
  · have hd : x ^ 2 - 4 ≠ 0 := sub_ne_zero.mpr hx
    unfold f₁₀
    rw [div_eq_zero_iff, or_iff_left hd]
    constructor
    · intro h
      have : (x - 1) * (x + 1) = 0 := by linear_combination h / 2
      rcases mul_eq_zero.mp this with h1 | h1
      · left; linarith
      · right; linarith
    · rintro (rfl | rfl) <;> norm_num
  · have : (x - 2) * (x + 2) = 0 := by linear_combination h
    rcases mul_eq_zero.mp this with h1 | h1
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Naloga 10 b): vodoravna asimptota je `y = 2` (`f(x) → 2` za `x → ±∞`); enačba
`2x² − 2 = 2(x² − 4)` vodi v `−2 = −8`, zato graf asimptote ne seka. -/
theorem naloga10_b :
    Tendsto f₁₀ atTop (𝓝 2) ∧ Tendsto f₁₀ atBot (𝓝 2) ∧
      ∀ x : ℝ, x ^ 2 ≠ 4 → f₁₀ x ≠ 2 := by
  have key : ∀ x : ℝ, x ^ 2 - 4 ≠ 0 → 2 + 6 / (x ^ 2 - 4) = f₁₀ x := by
    intro x hx
    unfold f₁₀
    field_simp
    ring
  have hT : Tendsto (fun x : ℝ => x ^ 2 - 4) atTop atTop := by
    simpa [sub_eq_add_neg] using tendsto_atTop_add_const_right atTop (-4) (tendsto_pow_atTop two_ne_zero)
  have hB : Tendsto (fun x : ℝ => x ^ 2 - 4) atBot atTop := by
    have := hT.comp tendsto_neg_atBot_atTop
    convert this using 1
    funext x
    simp [Function.comp]
  have lim : ∀ l : Filter ℝ, Tendsto (fun x : ℝ => x ^ 2 - 4) l atTop → Tendsto f₁₀ l (𝓝 2) := by
    intro l hl
    have h2 : Tendsto (fun x : ℝ => 2 + 6 / (x ^ 2 - 4)) l (𝓝 2) := by
      simpa using tendsto_const_nhds.add (tendsto_const_nhds.div_atTop hl)
    apply h2.congr'
    filter_upwards [hl.eventually_gt_atTop 0] with x hx
    exact key x hx.ne'
  refine ⟨lim _ hT, lim _ hB, fun x hx h => ?_⟩
  have hd : x ^ 2 - 4 ≠ 0 := sub_ne_zero.mpr hx
  rw [← key x hd] at h
  have : 6 / (x ^ 2 - 4) = 0 := by linarith
  rw [div_eq_zero_iff] at this
  rcases this with h6 | h6
  · norm_num at h6
  · exact hd h6

/-- Naloga 10 c): pri `x ≠ ±2` je `f(x) = 5/2` ⇔ `4x² − 4 = 5x² − 20` ⇔ `x² = 16` ⇔ `x = ±4`;
preverba `f(4) = 30/12 = 5/2`. -/
theorem naloga10_c :
    (∀ x : ℝ, x ^ 2 ≠ 4 → (f₁₀ x = 5 / 2 ↔ 4 * x ^ 2 - 4 = 5 * x ^ 2 - 20)) ∧
      (∀ x : ℝ, 4 * x ^ 2 - 4 = 5 * x ^ 2 - 20 ↔ x = 4 ∨ x = -4) ∧
      f₁₀ 4 = 30 / 12 ∧ (30:ℝ) / 12 = 5 / 2 := by
  refine ⟨fun x hx => ?_, fun x => ⟨fun h => ?_, ?_⟩, by norm_num [f₁₀], by norm_num⟩
  · have hd : x ^ 2 - 4 ≠ 0 := sub_ne_zero.mpr hx
    unfold f₁₀
    rw [div_eq_div_iff hd (by norm_num)]
    constructor <;> intro h <;> linarith
  · have : (x - 4) * (x + 4) = 0 := by linear_combination -h
    rcases mul_eq_zero.mp this with h1 | h1
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Funkcija iz naloge 11: `f(x) = x³ − 3x² − 9x + 5`. -/
noncomputable def f₁₁ (x : ℝ) : ℝ := x ^ 3 - 3 * x ^ 2 - 9 * x + 5

/-- Naloga 11 a): `f'(x) = 3x² − 6x − 9 = 3(x² − 2x − 3) = 3(x − 3)(x + 1)`, ničli `−1` in `3`;
`f(−1) = −1 − 3 + 9 + 5 = 10`, `f(3) = 27 − 27 − 27 + 5 = −22`. -/
theorem naloga11_odvod :
    (∀ x, HasDerivAt f₁₁ (3 * x ^ 2 - 6 * x - 9) x) ∧
      (∀ x : ℝ, 3 * x ^ 2 - 6 * x - 9 = 3 * (x ^ 2 - 2 * x - 3) ∧ 3 * (x ^ 2 - 2 * x - 3) = 3 * (x - 3) * (x + 1)) ∧
      (∀ x : ℝ, 3 * x ^ 2 - 6 * x - 9 = 0 ↔ x = -1 ∨ x = 3) ∧
      f₁₁ (-1) = -1 - 3 + 9 + 5 ∧ (-1:ℝ) - 3 + 9 + 5 = 10 ∧ f₁₁ 3 = 27 - 27 - 27 + 5 ∧
      (27:ℝ) - 27 - 27 + 5 = -22 := by
  refine ⟨fun x => ?_, fun x => ⟨by ring, by ring⟩, fun x => ⟨fun h => ?_, ?_⟩, by norm_num [f₁₁],
    by norm_num, by norm_num [f₁₁], by norm_num⟩
  · unfold f₁₁
    exact (((((hasDerivAt_pow 3 x).sub ((hasDerivAt_pow 2 x).const_mul 3)).sub
      ((hasDerivAt_id' x).const_mul 9)).add_const 5)).congr_deriv (by norm_num; ring)
  · have : (x + 1) * (x - 3) = 0 := by linear_combination h / 3
    rcases mul_eq_zero.mp this with h1 | h1
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Naloga 11 a), b): odvod je pozitiven za `x < −1` in `x > 3`, negativen med `−1` in `3`; `(−1, 10)` je
lokalni maksimum, `(3, −22)` lokalni minimum; `f` narašča na `(−∞, −1)` in na `(3, ∞)`. -/
theorem naloga11_vrsta :
    (∀ x : ℝ, x < -1 → 0 < 3 * x ^ 2 - 6 * x - 9) ∧ (∀ x : ℝ, -1 < x → x < 3 → 3 * x ^ 2 - 6 * x - 9 < 0) ∧
      (∀ x : ℝ, 3 < x → 0 < 3 * x ^ 2 - 6 * x - 9) ∧ IsLocalMax f₁₁ (-1) ∧ IsLocalMin f₁₁ 3 ∧
      StrictMonoOn f₁₁ (Iio (-1)) ∧ StrictMonoOn f₁₁ (Ioi 3) := by
  refine ⟨fun x h => by nlinarith, fun x h1 h2 => by nlinarith, fun x h => by nlinarith, ?_, ?_, ?_, ?_⟩
  · filter_upwards [Iio_mem_nhds (show (-1:ℝ) < 5 by norm_num)] with x hx
    have e : f₁₁ x - f₁₁ (-1) = (x + 1) ^ 2 * (x - 5) := by unfold f₁₁; ring
    have : (x + 1) ^ 2 * (x - 5) ≤ 0 :=
      mul_nonpos_of_nonneg_of_nonpos (sq_nonneg _) (by linarith [mem_Iio.mp hx])
    linarith
  · filter_upwards [Ioi_mem_nhds (show (-3:ℝ) < 3 by norm_num)] with x hx
    have e : f₁₁ x - f₁₁ 3 = (x - 3) ^ 2 * (x + 3) := by unfold f₁₁; ring
    have : 0 ≤ (x - 3) ^ 2 * (x + 3) := mul_nonneg (sq_nonneg _) (by linarith [mem_Ioi.mp hx])
    linarith
  · intro x hx y hy hxy
    have hx' : x < -1 := hx
    have hy' : y < -1 := hy
    have e : f₁₁ y - f₁₁ x = (y - x) * (y ^ 2 + x * y + x ^ 2 - 3 * (x + y) - 9) := by unfold f₁₁; ring
    have : 0 < y ^ 2 + x * y + x ^ 2 - 3 * (x + y) - 9 := by nlinarith
    nlinarith [mul_pos (sub_pos.mpr hxy) this]
  · intro x hx y hy hxy
    have hx' : 3 < x := hx
    have hy' : 3 < y := hy
    have e : f₁₁ y - f₁₁ x = (y - x) * (y ^ 2 + x * y + x ^ 2 - 3 * (x + y) - 9) := by unfold f₁₁; ring
    have : 0 < y ^ 2 + x * y + x ^ 2 - 3 * (x + y) - 9 := by nlinarith
    nlinarith [mul_pos (sub_pos.mpr hxy) this]

/-- Naloga 11 c): `f(0) = 5`, `f'(0) = −9`, tangenta `y = −9x + 5`. -/
theorem naloga11_tangenta : f₁₁ 0 = 5 ∧ 3 * (0:ℝ) ^ 2 - 6 * 0 - 9 = -9 ∧ ∀ x : ℝ, 5 + -9 * (x - 0) = -9 * x + 5 :=
  ⟨by norm_num [f₁₁], by norm_num, fun x => by ring⟩

/-- Naloga 12 a), b): `a₁₀ = 2 + 9·3 = 29`; vsota prvih `n` vrst je
`Sₙ = n/2·(2a₁ + (n − 1)d) = n/2·(4 + 3n − 3) = n(3n + 1)/2`. -/
theorem naloga12_ab (n : ℕ) :
    (2:ℝ) + 9 * 3 = 29 ∧ ∑ i ∈ Finset.range n, ((2:ℝ) + i * 3) = n / 2 * (2 * 2 + (n - 1) * 3) ∧
      (n:ℝ) / 2 * (2 * 2 + (n - 1) * 3) = n / 2 * (4 + 3 * n - 3) ∧
      (n:ℝ) / 2 * (4 + 3 * n - 3) = n * (3 * n + 1) / 2 := by
  refine ⟨by norm_num, ?_, by ring, by ring⟩
  induction n with
  | zero => simp
  | succ n ih => rw [Finset.sum_range_succ, ih]; push_cast; ring

/-- Naloga 12 c): `n(3n + 1)/2 = 155` ⇔ `3n² + n − 310 = 0`; `D = 1 + 12·310 = 3721 = 61²`;
`n = (−1 ± 61)/6`, torej `n = 10` ali `n = −31/3`; med naravnimi števili le `n = 10` (`10·31/2 = 155`). -/
theorem naloga12_c :
    (∀ n : ℝ, n * (3 * n + 1) / 2 = 155 ↔ 3 * n ^ 2 + n - 310 = 0) ∧ (1:ℝ) + 12 * 310 = 3721 ∧
      (3721:ℝ) = 61 ^ 2 ∧ (∀ n : ℝ, 3 * n ^ 2 + n - 310 = 0 ↔ n = 10 ∨ n = -31 / 3) ∧
      (-1 + 61 : ℝ) / 6 = 10 ∧ (-1 - 61 : ℝ) / 6 = -31 / 3 ∧ (10:ℝ) * 31 / 2 = 155 ∧
      ∀ n : ℕ, (n:ℝ) * (3 * n + 1) / 2 = 155 ↔ n = 10 := by
  have kv : ∀ n : ℝ, 3 * n ^ 2 + n - 310 = 0 ↔ n = 10 ∨ n = -31 / 3 := by
    intro n
    constructor
    · intro h
      have : (n - 10) * (3 * n + 31) = 0 := by linear_combination h
      rcases mul_eq_zero.mp this with h1 | h1
      · left; linarith
      · right; linarith
    · rintro (rfl | rfl) <;> norm_num
  have e1 : ∀ n : ℝ, n * (3 * n + 1) / 2 = 155 ↔ 3 * n ^ 2 + n - 310 = 0 := fun n => by
    constructor <;> intro h <;> linarith
  refine ⟨e1, by norm_num, by norm_num, kv, by norm_num, by norm_num, by norm_num, fun n => ?_⟩
  rw [e1, kv]
  constructor
  · rintro (h | h)
    · exact_mod_cast h
    · have : (0:ℝ) ≤ n := Nat.cast_nonneg n
      linarith
  · rintro rfl; left; norm_num

/-- Naloga 13 a)–c): `AB⃗ = (1, 1, 0)`, `AC⃗ = (0, 1, 1)`, `BC⃗ = (−1, 0, 1)`, vse dolžine `√2`;
`cos α = 1/(√2·√2) = 1/2`, `α = 60°`. -/
theorem naloga13_abc :
    ((2:ℝ) - 1, (3:ℝ) - 2, (0:ℝ) - 0) = (1, 1, 0) ∧ ((1:ℝ) - 1, (3:ℝ) - 2, (1:ℝ) - 0) = (0, 1, 1) ∧
      ((1:ℝ) - 2, (3:ℝ) - 3, (1:ℝ) - 0) = (-1, 0, 1) ∧
      Real.sqrt (1 ^ 2 + 1 ^ 2 + 0 ^ 2) = Real.sqrt 2 ∧ Real.sqrt (0 ^ 2 + 1 ^ 2 + 1 ^ 2) = Real.sqrt 2 ∧
      Real.sqrt ((-1) ^ 2 + 0 ^ 2 + 1 ^ 2) = Real.sqrt 2 ∧
      ((1:ℝ) * 0 + 1 * 1 + 0 * 1) / (Real.sqrt 2 * Real.sqrt 2) = 1 / 2 ∧
      Real.arccos (1 / 2) = 60 * (π / 180) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_, ?_⟩
  · rw [Real.mul_self_sqrt (by norm_num)]; norm_num
  · rw [show 60 * (π / 180) = π / 3 by ring, ← Real.cos_pi_div_three,
      Real.arccos_cos (by positivity) (by linarith [Real.pi_pos])]

/-- Naloga 13 d): v paralelogramu `ABDC` je `CD⃗ = AB⃗`, zato `D = C + AB⃗ = (2, 4, 1)`. -/
theorem naloga13_d : ((1:ℝ) + 1, (3:ℝ) + 1, (1:ℝ) + 0) = (2, 4, 1) ∧
    ((2:ℝ) - 1, (4:ℝ) - 3, (1:ℝ) - 1) = ((2:ℝ) - 1, (3:ℝ) - 2, (0:ℝ) - 0) := by norm_num

/-- Točke naloge 13 kot vektorji v `ℝ³`. -/
def A₁₃ : Fin 3 → ℝ := ![1, 2, 0]
/-- Točka `B` naloge 13. -/
def B₁₃ : Fin 3 → ℝ := ![2, 3, 0]
/-- Točka `C` naloge 13. -/
def C₁₃ : Fin 3 → ℝ := ![1, 3, 1]
/-- Točka `D = C + AB⃗` naloge 13. -/
def D₁₃ : Fin 3 → ℝ := C₁₃ + (B₁₃ - A₁₃)

/-- Skalarni produkt v `ℝ³`. -/
def skal (u v : Fin 3 → ℝ) : ℝ := ∑ i, u i * v i

/-- Dolžina vektorja v `ℝ³`. -/
noncomputable def dolz (u : Fin 3 → ℝ) : ℝ := Real.sqrt (skal u u)

/-- Naloga 13 s točkami `A(1, 2, 0)`, `B(2, 3, 0)`, `C(1, 3, 1)`: `AB⃗ = (1, 1, 0)`, `AC⃗ = (0, 1, 1)`,
`BC⃗ = (−1, 0, 1)`; `|AB⃗| = |AC⃗| = |BC⃗| = √2` (trikotnik je enakostraničen);
`cos α = AB⃗·AC⃗/(|AB⃗||AC⃗|) = 1/2`, `α = 60°`; `D = C + AB⃗ = (2, 4, 1)` in `CD⃗ = AB⃗`. -/
theorem naloga13_tocke :
    B₁₃ - A₁₃ = ![1, 1, 0] ∧ C₁₃ - A₁₃ = ![0, 1, 1] ∧ C₁₃ - B₁₃ = ![-1, 0, 1] ∧
      dolz (B₁₃ - A₁₃) = Real.sqrt 2 ∧ dolz (C₁₃ - A₁₃) = Real.sqrt 2 ∧
      dolz (C₁₃ - B₁₃) = Real.sqrt 2 ∧
      skal (B₁₃ - A₁₃) (C₁₃ - A₁₃) / (dolz (B₁₃ - A₁₃) * dolz (C₁₃ - A₁₃)) = 1 / 2 ∧
      Real.arccos (skal (B₁₃ - A₁₃) (C₁₃ - A₁₃) / (dolz (B₁₃ - A₁₃) * dolz (C₁₃ - A₁₃))) =
        60 * (π / 180) ∧
      D₁₃ = ![2, 4, 1] ∧ D₁₃ - C₁₃ = B₁₃ - A₁₃ := by
  have e1 : B₁₃ - A₁₃ = ![1, 1, 0] := by
    funext i; fin_cases i <;> norm_num [A₁₃, B₁₃]
  have e2 : C₁₃ - A₁₃ = ![0, 1, 1] := by
    funext i; fin_cases i <;> norm_num [A₁₃, C₁₃]
  have e3 : C₁₃ - B₁₃ = ![-1, 0, 1] := by
    funext i; fin_cases i <;> norm_num [B₁₃, C₁₃]
  have d1 : dolz (B₁₃ - A₁₃) = Real.sqrt 2 := by
    rw [e1, dolz, skal]; simp [Fin.sum_univ_three]; norm_num
  have d2 : dolz (C₁₃ - A₁₃) = Real.sqrt 2 := by
    rw [e2, dolz, skal]; simp [Fin.sum_univ_three]; norm_num
  have d3 : dolz (C₁₃ - B₁₃) = Real.sqrt 2 := by
    rw [e3, dolz, skal]; simp [Fin.sum_univ_three]; norm_num
  have c : skal (B₁₃ - A₁₃) (C₁₃ - A₁₃) / (dolz (B₁₃ - A₁₃) * dolz (C₁₃ - A₁₃)) = 1 / 2 := by
    rw [d1, d2, Real.mul_self_sqrt (by norm_num), e1, e2, skal]; simp [Fin.sum_univ_three]
  have dD : D₁₃ = ![2, 4, 1] := by
    rw [D₁₃, e1]; funext i; fin_cases i <;> simp [C₁₃] <;> norm_num
  refine ⟨e1, e2, e3, d1, d2, d3, c, ?_, dD, by rw [D₁₃]; abel⟩
  rw [c, show 60 * (π / 180) = π / 3 by ring, ← Real.cos_pi_div_three,
    Real.arccos_cos (by positivity) (by linarith [Real.pi_pos])]

/-- Naloga 14 a): splošni člen `C(6, k)·(x²)⁶⁻ᵏ·(−2/x)ᵏ = C(6, k)·(−2)ᵏ·x¹²⁻³ᵏ` za `k = 0, …, 6`
(`x ≠ 0`) in razvoj `(x² − 2/x)⁶ = Σₖ C(6, k)(−2)ᵏ x¹²⁻³ᵏ`. -/
theorem naloga14_a (x : ℝ) (hx : x ≠ 0) :
    (∀ k : ℕ, k ≤ 6 → (Nat.choose 6 k : ℝ) * (x ^ 2) ^ (6 - k) * (-2 / x) ^ k =
      Nat.choose 6 k * (-2) ^ k * x ^ ((12:ℤ) - 3 * k)) ∧
    (x ^ 2 - 2 / x) ^ 6 = ∑ k ∈ Finset.range 7, (Nat.choose 6 k : ℝ) * (-2) ^ k * x ^ ((12:ℤ) - 3 * k) := by
  constructor
  · intro k hk
    interval_cases k <;> norm_num [zpow_neg, div_pow] <;> field_simp <;> ring
  · simp only [Finset.sum_range_succ, Finset.sum_range_zero]
    norm_num [zpow_neg, Nat.choose]
    field_simp
    ring

/-- Predpostavka trditve `naloga14_a` se da izpolniti. -/
example : (1:ℝ) ≠ 0 := one_ne_zero

/-- Naloga 14 b)–d): `12 − 3k = 0` ⇔ `k = 4`, člen `C(6, 4)·16 = 15·16 = 240`; `12 − 3k = 3` ⇔ `k = 3`,
koeficient `C(6, 3)·(−8) = 20·(−8) = −160`; vsota koeficientov `(1 − 2)⁶ = 1`. -/
theorem naloga14_bcd :
    (∀ k : ℕ, (12:ℤ) - 3 * k = 0 ↔ k = 4) ∧ (Nat.choose 6 4 : ℤ) * (-2) ^ 4 = 15 * 16 ∧
      (15:ℤ) * 16 = 240 ∧ (∀ k : ℕ, (12:ℤ) - 3 * k = 3 ↔ k = 3) ∧
      (Nat.choose 6 3 : ℤ) * (-2) ^ 3 = 20 * (-8) ∧ (20:ℤ) * (-8) = -160 ∧
      ((1:ℝ) ^ 2 - 2 / 1) ^ 6 = (1 - 2) ^ 6 ∧ ((1:ℝ) - 2) ^ 6 = 1 ∧
      ∑ k ∈ Finset.range 7, (Nat.choose 6 k : ℤ) * (-2) ^ k = 1 := by
  refine ⟨fun k => by omega, by decide, by norm_num, fun k => by omega, by decide, by norm_num,
    by norm_num, by norm_num, by decide⟩

/-- Naloga 15 a): `sin 2x = sin x` ⇔ `sin x(2 cos x − 1) = 0`; na `[0, π]` so rešitve `0`, `π/3`, `π`. -/
theorem naloga15_a :
    (∀ x : ℝ, Real.sin (2 * x) - Real.sin x = Real.sin x * (2 * Real.cos x - 1)) ∧
      ∀ x ∈ Icc 0 π, Real.sin (2 * x) = Real.sin x ↔ x = 0 ∨ x = π / 3 ∨ x = π := by
  have raz : ∀ x : ℝ, Real.sin (2 * x) - Real.sin x = Real.sin x * (2 * Real.cos x - 1) := by
    intro x; rw [Real.sin_two_mul]; ring
  refine ⟨raz, fun x hx => ⟨fun h => ?_, ?_⟩⟩
  · have : Real.sin x * (2 * Real.cos x - 1) = 0 := by rw [← raz]; linarith
    rcases mul_eq_zero.mp this with h1 | h1
    · rcases hx.1.eq_or_lt with h0 | h0
      · left; exact h0.symm
      · rcases hx.2.eq_or_lt with hp | hp
        · right; right; exact hp
        · exact absurd h1 (Real.sin_pos_of_pos_of_lt_pi h0 hp).ne'
    · right; left
      have hc : Real.cos x = Real.cos (π / 3) := by rw [Real.cos_pi_div_three]; linarith
      exact Real.injOn_cos hx ⟨by positivity, by linarith [Real.pi_pos]⟩ hc
  · rintro (rfl | rfl | rfl)
    · simp
    · rw [show 2 * (π / 3) = π - π / 3 by ring, Real.sin_pi_sub]
    · rw [Real.sin_two_pi, Real.sin_pi]

/-- Naloga 15 b): na `[0, π]` leži graf `g(x) = sin 2x` nad grafom `f(x) = sin x` natanko na `(0, π/3)`
(na `(0, π)` je `sin x > 0`, zato ima razlika predznak `2 cos x − 1`). -/
theorem naloga15_b : {x ∈ Icc 0 π | Real.sin x < Real.sin (2 * x)} = Ioo 0 (π / 3) := by
  have raz := naloga15_a.1
  have hpi := Real.pi_pos
  ext x
  simp only [Set.mem_ofPred_eq, mem_Icc, mem_Ioo]
  constructor
  · rintro ⟨⟨h0, hp⟩, h⟩
    have hd : 0 < Real.sin x * (2 * Real.cos x - 1) := by rw [← raz]; linarith
    rcases h0.eq_or_lt with h0' | h0'
    · subst h0'; simp at hd
    · have hs : 0 < Real.sin x := by
        rcases hp.eq_or_lt with hp' | hp'
        · subst hp'; simp at hd
        · exact Real.sin_pos_of_pos_of_lt_pi h0' hp'
      have hc : 1 / 2 < Real.cos x := by
        have := (pos_iff_pos_of_mul_pos hd).mp hs
        linarith
      refine ⟨h0', ?_⟩
      by_contra hx
      push Not at hx
      have : Real.cos x ≤ Real.cos (π / 3) :=
        Real.cos_le_cos_of_nonneg_of_le_pi (by positivity) hp hx
      rw [Real.cos_pi_div_three] at this
      linarith
  · rintro ⟨h0, h3⟩
    have hs : 0 < Real.sin x := Real.sin_pos_of_pos_of_lt_pi h0 (by linarith)
    have hc : Real.cos (π / 3) < Real.cos x :=
      Real.cos_lt_cos_of_nonneg_of_le_pi h0.le (by linarith) h3
    rw [Real.cos_pi_div_three] at hc
    refine ⟨⟨h0.le, by linarith⟩, ?_⟩
    have : 0 < Real.sin x * (2 * Real.cos x - 1) := mul_pos hs (by linarith)
    linarith [raz x]

/-- Naloga 15 c): `F(x) = −½ cos 2x + cos x` je primitivna funkcija za `sin 2x − sin x`;
`F(π/3) = 1/4 + 1/2 = 3/4`, `F(0) = −1/2 + 1 = 1/2`, `F(π) = −1/2 − 1 = −3/2`;
`S₁ = 3/4 − 1/2 = 1/4`, `S₂ = 3/4 + 3/2 = 9/4`, `S = 1/4 + 9/4 = 5/2`. -/
theorem naloga15_c :
    let F : ℝ → ℝ := fun x => -(1 / 2) * Real.cos (2 * x) + Real.cos x
    (∀ x, HasDerivAt F (Real.sin (2 * x) - Real.sin x) x) ∧
      F (π / 3) = 1 / 4 + 1 / 2 ∧ F 0 = -(1 / 2) + 1 ∧ F π = -(1 / 2) - 1 ∧
      ∫ x in (0:ℝ)..(π / 3), (Real.sin (2 * x) - Real.sin x) = 3 / 4 - 1 / 2 ∧ (3 / 4 - 1 / 2 : ℝ) = 1 / 4 ∧
      ∫ x in (π / 3)..π, (Real.sin x - Real.sin (2 * x)) = 3 / 4 + 3 / 2 ∧ (3 / 4 + 3 / 2 : ℝ) = 9 / 4 ∧
      (1 / 4 + 9 / 4 : ℝ) = 5 / 2 := by
  intro F
  have hF : ∀ x, HasDerivAt F (Real.sin (2 * x) - Real.sin x) x := by
    intro x
    have h1 := (((hasDerivAt_id' x).const_mul 2).cos).const_mul (-(1 / 2))
    exact (h1.add (Real.hasDerivAt_cos x)).congr_deriv (by ring)
  have hG : ∀ x, HasDerivAt (fun x => -F x) (Real.sin x - Real.sin (2 * x)) x := by
    intro x; exact (hF x).neg.congr_deriv (by ring)
  have c23 : Real.cos (2 * (π / 3)) = -(1 / 2) := by
    rw [show 2 * (π / 3) = π - π / 3 by ring, Real.cos_pi_sub, Real.cos_pi_div_three]
  have F3 : F (π / 3) = 3 / 4 := by
    show -(1 / 2) * Real.cos (2 * (π / 3)) + Real.cos (π / 3) = 3 / 4
    rw [c23, Real.cos_pi_div_three]; norm_num
  have F0 : F 0 = 1 / 2 := by
    show -(1 / 2) * Real.cos (2 * 0) + Real.cos 0 = 1 / 2
    simp; norm_num
  have Fp : F π = -(3 / 2) := by
    show -(1 / 2) * Real.cos (2 * π) + Real.cos π = -(3 / 2)
    rw [Real.cos_two_pi, Real.cos_pi]; norm_num
  refine ⟨hF, by rw [F3]; norm_num, by rw [F0]; norm_num, by rw [Fp]; norm_num, ?_, by norm_num, ?_,
    by norm_num, by norm_num⟩
  · rw [newton_leibniz F _ 0 (π / 3) hF (by fun_prop), F3, F0]
  · rw [newton_leibniz (fun x => -F x) _ (π / 3) π hG (by fun_prop), F3, Fp]; norm_num

/-- Zaporedje iz naloge 16: `aₙ = (2n + 1)/(n + 3)`. -/
noncomputable def a₁₆ (n : ℕ) : ℝ := (2 * n + 1) / (n + 3)

/-- Naloga 16 a), c): `aₙ = (2 + 1/n)/(1 + 3/n) = 2 − 5/(n + 3)`, limita je `2`, `aₙ < 2`. -/
theorem naloga16_limita :
    (∀ n : ℕ, 1 ≤ n → a₁₆ n = (2 + 1 / n) / (1 + 3 / n)) ∧ (∀ n : ℕ, a₁₆ n = 2 - 5 / (n + 3)) ∧
      Tendsto a₁₆ atTop (𝓝 2) ∧ ∀ n, a₁₆ n < 2 := by
  have e : ∀ n : ℕ, a₁₆ n = 2 - 5 / (n + 3) := by
    intro n
    have : (n:ℝ) + 3 ≠ 0 := by positivity
    unfold a₁₆; field_simp; ring
  refine ⟨fun n hn => ?_, e, ?_, fun n => ?_⟩
  · have : (n:ℝ) ≠ 0 := by positivity
    have : (n:ℝ) + 3 ≠ 0 := by positivity
    unfold a₁₆
    field_simp
  · have h3 : Tendsto (fun n : ℕ => (n:ℝ) + 3) atTop atTop :=
      tendsto_atTop_add_const_right _ _ tendsto_natCast_atTop_atTop
    have := tendsto_const_nhds (x := (2:ℝ)).sub (tendsto_const_nhds (x := (5:ℝ)).div_atTop h3)
    rw [sub_zero] at this
    exact this.congr (fun n => (e n).symm)
  · rw [e]
    have : 0 < 5 / ((n:ℝ) + 3) := by positivity
    linarith

/-- Naloga 16 b): `aₙ₊₁ − aₙ = ((2n + 3)(n + 3) − (2n + 1)(n + 4))/((n + 3)(n + 4))`, števec
`(2n² + 9n + 9) − (2n² + 9n + 4) = 5`, zato `aₙ₊₁ − aₙ = 5/((n + 3)(n + 4)) > 0`. -/
theorem naloga16_narasca (n : ℕ) :
    a₁₆ (n + 1) - a₁₆ n = ((2 * n + 3) * (n + 3) - (2 * n + 1) * (n + 4)) / ((n + 3) * (n + 4)) ∧
      ((2 * n + 3) * (n + 3) - (2 * n + 1) * (n + 4) : ℝ) = (2 * n ^ 2 + 9 * n + 9) - (2 * n ^ 2 + 9 * n + 4) ∧
      ((2 * n ^ 2 + 9 * n + 9) - (2 * n ^ 2 + 9 * n + 4) : ℝ) = 5 ∧
      a₁₆ (n + 1) - a₁₆ n = 5 / ((n + 3) * (n + 4)) ∧ a₁₆ n < a₁₆ (n + 1) := by
  have h1 : a₁₆ (n + 1) - a₁₆ n =
      ((2 * n + 3) * (n + 3) - (2 * n + 1) * (n + 4)) / ((n + 3) * (n + 4)) := by
    have : (n:ℝ) + 3 ≠ 0 := by positivity
    have : (n:ℝ) + 4 ≠ 0 := by positivity
    unfold a₁₆; push_cast; field_simp; ring
  have h2 : a₁₆ (n + 1) - a₁₆ n = 5 / ((n + 3) * (n + 4)) := by rw [h1]; congr 1; ring
  refine ⟨h1, by ring, by ring, h2, ?_⟩
  have : 0 < 5 / (((n:ℝ) + 3) * (n + 4)) := by positivity
  linarith

/-- Naloga 16 c): zaporedje narašča, zato je natančna spodnja meja `a₁ = 3/4`: `3/4 ≤ aₙ < 2` za `n ≥ 1`. -/
theorem naloga16_meje :
    a₁₆ 1 = 3 / 4 ∧ IsLeast {y | ∃ n : ℕ, 1 ≤ n ∧ a₁₆ n = y} (3 / 4) ∧ ∀ n : ℕ, 1 ≤ n → 3 / 4 ≤ a₁₆ n ∧ a₁₆ n < 2 := by
  have mono : Monotone a₁₆ := monotone_nat_of_le_succ fun n => (naloga16_narasca n).2.2.2.2.le
  have a1 : a₁₆ 1 = 3 / 4 := by norm_num [a₁₆]
  have low : ∀ n : ℕ, 1 ≤ n → 3 / 4 ≤ a₁₆ n := fun n hn => a1 ▸ mono hn
  refine ⟨a1, ⟨⟨1, le_rfl, a1⟩, ?_⟩, fun n hn => ⟨low n hn, naloga16_limita.2.2.2 n⟩⟩
  rintro y ⟨n, hn, rfl⟩
  exact low n hn

/-- Naloga 16 d): `|aₙ − 2| = 5/(n + 3)`; `5/(n + 3) < 1/100` ⇔ `n + 3 > 500` ⇔ `n > 497`; pri `n = 497`
je razlika natanko `5/500 = 0,01`; od `498.` člena naprej je razlika manjša od `0,01`. -/
theorem naloga16_d :
    (∀ n : ℕ, |a₁₆ n - 2| = 5 / (n + 3)) ∧ (∀ n : ℕ, (5:ℝ) / (n + 3) < 1 / 100 ↔ 497 < n) ∧
      |a₁₆ 497 - 2| = 5 / 500 ∧ (5:ℝ) / 500 = 0.01 ∧ ∀ n : ℕ, |a₁₆ n - 2| < 0.01 ↔ 498 ≤ n := by
  have habs : ∀ n : ℕ, |a₁₆ n - 2| = 5 / (n + 3) := by
    intro n
    rw [(naloga16_limita.2.1 n), show (2:ℝ) - 5 / (n + 3) - 2 = -(5 / (n + 3)) by ring, abs_neg,
      abs_of_pos (by positivity)]
  have hlt : ∀ n : ℕ, (5:ℝ) / (n + 3) < 1 / 100 ↔ 497 < n := by
    intro n
    rw [div_lt_div_iff₀ (by positivity) (by norm_num)]
    constructor
    · intro h
      have : (497:ℝ) < n := by linarith
      exact_mod_cast this
    · intro h
      have : (498:ℝ) ≤ n := by exact_mod_cast h
      linarith
  refine ⟨habs, hlt, by rw [habs]; norm_num, by norm_num, fun n => ?_⟩
  rw [habs, show (0.01:ℝ) = 1 / 100 by norm_num, hlt]
  omega

/-! ## Pola 2, naloge 17–24 -/

/-- Naloga 17: `cos α = 1,4/4,5 = 0,3111…`; višina `h = √(4,5² − 1,4²) = √18,29 = 4,2766… ≈ 4,28 m`. -/
theorem naloga17 :
    (0.3111:ℝ) ≤ 1.4 / 4.5 ∧ (1.4:ℝ) / 4.5 < 0.3112 ∧ (4.5:ℝ) ^ 2 - 1.4 ^ 2 = 18.29 ∧
      (4.2766:ℝ) < Real.sqrt 18.29 ∧ Real.sqrt 18.29 < 4.2767 ∧ |Real.sqrt 18.29 - 4.28| ≤ 0.005 := by
  obtain ⟨h1, h2⟩ := koren2 18.29 4.2766 4.2767 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  exact ⟨by norm_num, by norm_num, by norm_num, h1, h2, blizu (by linarith) (by linarith)⟩

/-- Naloga 18: `12 400·a⁵ = 13 900` ⇔ `a⁵ = 13 900/12 400 = 1,12096…`; `a = ⁵√1,12096… = 1,023101… ≈ 1,02310`;
`N(15) = 12 400·a¹⁵ = 17 466,3… ≈ 17 466`. -/
theorem naloga18 :
    let a : ℝ := (13900 / 12400 : ℝ) ^ (1 / 5 : ℝ)
    (∀ b : ℝ, 0 < b → (12400 * b ^ 5 = 13900 ↔ b = a)) ∧ (1.12096:ℝ) ≤ 13900 / 12400 ∧
      (13900 / 12400 : ℝ) < 1.12097 ∧ (1.023101:ℝ) < a ∧ a < 1.023102 ∧ |a - 1.02310| ≤ 0.000005 ∧
      (17466.3:ℝ) ≤ 12400 * a ^ 15 ∧ 12400 * a ^ 15 < 17466.4 ∧ |12400 * a ^ 15 - 17466| ≤ 0.5 := by
  intro a
  have ha0 : 0 < a := Real.rpow_pos_of_pos (by norm_num) _
  have ha5 : a ^ 5 = 13900 / 12400 := by
    show ((13900 / 12400 : ℝ) ^ (1 / 5 : ℝ)) ^ 5 = _
    rw [← Real.rpow_natCast, ← Real.rpow_mul (by norm_num)]; norm_num
  have ha15 : a ^ 15 = (13900 / 12400) ^ 3 := by rw [show 15 = 5 * 3 by rfl, pow_mul, ha5]
  obtain ⟨b1, b2⟩ := koren_meje a (13900 / 12400) 1.023101 1.023102 5 ha0.le (by norm_num) ha5
    (by norm_num) (by norm_num)
  refine ⟨fun b hb => ⟨fun h => ?_, fun h => ?_⟩, by norm_num, by norm_num, b1, b2,
    blizu (by linarith) (by linarith), by rw [ha15]; norm_num, by rw [ha15]; norm_num,
    blizu (by rw [ha15]; norm_num) (by rw [ha15]; norm_num)⟩
  · have : b ^ 5 = a ^ 5 := by rw [ha5]; linarith
    exact (pow_left_inj₀ hb.le ha0.le (by norm_num)).mp this
  · rw [h, ha5]; norm_num

/-- Naloga 19 a): `pH = −log(3,2·10⁻⁵) = 6 − 5·log 2 / log 10 = 4,4948… ≈ 4,49`. -/
theorem naloga19_a :
    -Real.logb 10 (3.2 * 10 ^ (-5:ℤ)) = 6 - 5 * Real.log 2 / Real.log 10 ∧
      (4.4948:ℝ) ≤ -Real.logb 10 (3.2 * 10 ^ (-5:ℤ)) ∧ -Real.logb 10 (3.2 * 10 ^ (-5:ℤ)) < 4.4949 ∧
      |-Real.logb 10 (3.2 * 10 ^ (-5:ℤ)) - 4.49| ≤ 0.005 := by
  have hl10 : Real.log 10 = 3 * Real.log 2 - Real.log (1 - 0.2) := by
    rw [show (10:ℝ) = 2 ^ 3 / (1 - 0.2) by norm_num, Real.log_div (by norm_num) (by norm_num),
      Real.log_pow]; norm_num
  have e : -Real.logb 10 (3.2 * 10 ^ (-5:ℤ)) = 6 - 5 * Real.log 2 / Real.log 10 := by
    have hpos : 0 < Real.log 10 := Real.log_pos (by norm_num)
    rw [show (3.2:ℝ) * 10 ^ (-5:ℤ) = 2 ^ 5 / 10 ^ 6 by norm_num, Real.logb,
      Real.log_div (by norm_num) (by norm_num), Real.log_pow, Real.log_pow]
    field_simp
    push_cast
    ring
  obtain ⟨l1, l2⟩ := log_meje 0.2 20 (by norm_num [abs_of_pos]) (-0.2231435514) (-0.2231435512)
    (by norm_num [Finset.sum_range_succ, abs_of_pos]) (by norm_num [Finset.sum_range_succ, abs_of_pos])
  have t1 := Real.log_two_gt_d9
  have t2 := Real.log_two_lt_d9
  have hpos : 0 < Real.log 10 := Real.log_pos (by norm_num)
  have q1 : 5 * Real.log 2 / Real.log 10 ≤ 1.5052 := by
    rw [div_le_iff₀ hpos]; rw [hl10]; nlinarith
  have q2 : 1.5051 < 5 * Real.log 2 / Real.log 10 := by
    rw [lt_div_iff₀ hpos]; rw [hl10]; nlinarith
  rw [e]
  exact ⟨rfl, by linarith, by linarith, blizu (by linarith) (by linarith)⟩

/-- Naloga 19 b): iz `pH₂ = pH₁ + 1,5` (`c₁, c₂ > 0`) sledi `log(c₁/c₂) = 1,5` in `c₁/c₂ = 10^1,5`;
`10^1,5 = 10√10 = 31,62… ≈ 31,6`; `c₂ = 3,2·10⁻⁵/10^1,5 = 1,0119…·10⁻⁶ ≈ 1,01·10⁻⁶`. -/
theorem naloga19_b :
    (∀ c₁ c₂ : ℝ, 0 < c₁ → 0 < c₂ → (-Real.logb 10 c₂ = -Real.logb 10 c₁ + 1.5 ↔
      Real.logb 10 (c₁ / c₂) = 1.5) ∧ (Real.logb 10 (c₁ / c₂) = 1.5 ↔ c₁ / c₂ = 10 ^ (1.5:ℝ))) ∧
      (10:ℝ) ^ (1.5:ℝ) = 10 * Real.sqrt 10 ∧ (31.62:ℝ) ≤ 10 ^ (1.5:ℝ) ∧ (10:ℝ) ^ (1.5:ℝ) < 31.63 ∧
      |(10:ℝ) ^ (1.5:ℝ) - 31.6| ≤ 0.05 ∧
      (1.0119:ℝ) ≤ 3.2 * 10 ^ (-5:ℤ) / 10 ^ (1.5:ℝ) * 10 ^ 6 ∧
      3.2 * 10 ^ (-5:ℤ) / (10:ℝ) ^ (1.5:ℝ) * 10 ^ 6 < 1.0120 ∧
      |3.2 * 10 ^ (-5:ℤ) / (10:ℝ) ^ (1.5:ℝ) * 10 ^ 6 - 1.01| ≤ 0.005 := by
  have h15 : (10:ℝ) ^ (1.5:ℝ) = 10 * Real.sqrt 10 := by
    rw [show (1.5:ℝ) = 1 + 1 / 2 by norm_num, Real.rpow_add (by norm_num), Real.rpow_one,
      Real.sqrt_eq_rpow]
  obtain ⟨s1, s2⟩ := koren2 10 3.16227 3.16228 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have hs : 0 < Real.sqrt 10 := by positivity
  have c2 : 3.2 * 10 ^ (-5:ℤ) / (10:ℝ) ^ (1.5:ℝ) * 10 ^ 6 = 3.2 / Real.sqrt 10 := by
    rw [h15]; field_simp
  refine ⟨fun c₁ c₂ h1 h2 => ⟨?_, ?_⟩, h15, by rw [h15]; linarith, by rw [h15]; linarith,
    blizu (by rw [h15]; linarith) (by rw [h15]; linarith), ?_, ?_, ?_⟩
  · rw [Real.logb_div h1.ne' h2.ne']; constructor <;> intro h <;> linarith
  · exact Real.logb_eq_iff_rpow_eq (by norm_num) (by norm_num) (div_pos h1 h2) |>.trans eq_comm
  · rw [c2, le_div_iff₀ hs]; nlinarith
  · rw [c2, div_lt_iff₀ hs]; nlinarith
  · rw [c2]
    have a1 : (1.0119:ℝ) ≤ 3.2 / Real.sqrt 10 := by rw [le_div_iff₀ hs]; nlinarith
    have a2 : 3.2 / Real.sqrt 10 < (1.0120:ℝ) := by rw [div_lt_iff₀ hs]; nlinarith
    exact blizu (by linarith) (by linarith)

/-- Podatki iz naloge 20. -/
def sklece : List ℝ := [12, 15, 11, 18, 14, 16, 13, 19]

/-- Naloga 20: vsota `118`, `x̄ = 118/8 = 14,75`; kvadrati odklonov `7,5625 + 0,0625 + 14,0625 + 10,5625 +
0,5625 + 1,5625 + 3,0625 + 18,0625 = 55,5`; `σ = √(55,5/8) = √6,9375 = 2,6339… ≈ 2,63`; pri deljenju
s `7` je odklon `≈ 2,82`; na `(x̄ − σ, x̄ + σ)` (zaokroženo `(12,12; 17,38)`) ležijo `13`, `14`, `15`, `16`,
ne pa `11`, `12`, `18`, `19`. -/
theorem naloga20 :
    sklece.sum = 118 ∧ (118:ℝ) / 8 = 14.75 ∧
      (sklece.map fun v => (v - 14.75) ^ 2) =
        [7.5625, 0.0625, 14.0625, 10.5625, 0.5625, 1.5625, 3.0625, 18.0625] ∧
      (sklece.map fun v => (v - 14.75) ^ 2).sum = 55.5 ∧ (55.5:ℝ) / 8 = 6.9375 ∧
      (2.6339:ℝ) < Real.sqrt 6.9375 ∧ Real.sqrt 6.9375 < 2.6340 ∧ |Real.sqrt 6.9375 - 2.63| ≤ 0.005 ∧
      |Real.sqrt (55.5 / 7) - 2.82| ≤ 0.005 ∧
      |14.75 - Real.sqrt 6.9375 - 12.12| ≤ 0.005 ∧ |14.75 + Real.sqrt 6.9375 - 17.38| ≤ 0.005 ∧
      (∀ v ∈ ({13, 14, 15, 16} : Set ℝ), 14.75 - Real.sqrt 6.9375 < v ∧ v < 14.75 + Real.sqrt 6.9375) ∧
      (∀ v ∈ ({11, 12, 18, 19} : Set ℝ), ¬ (14.75 - Real.sqrt 6.9375 < v ∧ v < 14.75 + Real.sqrt 6.9375)) := by
  obtain ⟨s1, s2⟩ := koren2 6.9375 2.6339 2.6340 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨t1, t2⟩ := koren2 (55.5 / 7) 2.8157 2.8158 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  refine ⟨by norm_num [sklece], by norm_num, by norm_num [sklece], by norm_num [sklece], by norm_num,
    s1, s2, blizu (by linarith) (by linarith), blizu (by linarith) (by linarith),
    blizu (by linarith) (by linarith), blizu (by linarith) (by linarith), ?_, ?_⟩
  · intro v hv
    simp only [mem_insert_iff, mem_singleton_iff] at hv
    rcases hv with rfl | rfl | rfl | rfl <;> constructor <;> linarith
  · intro v hv h
    simp only [mem_insert_iff, mem_singleton_iff] at hv
    rcases hv with rfl | rfl | rfl | rfl <;> linarith [h.1, h.2]

/-- Naloga 20, točkovanje: z `s = √(55,5/7) ≈ 2,82` je interval `(x̄ − s, x̄ + s)` zaokroženo
`(11,93; 17,57)`; v njem leži natanko `5` podatkov (`12`, `13`, `14`, `15`, `16`), ne pa `11`, `18`, `19`
(podatki so prav teh osem števil). -/
theorem naloga20_s :
    |14.75 - Real.sqrt (55.5 / 7) - 11.93| ≤ 0.005 ∧ |14.75 + Real.sqrt (55.5 / 7) - 17.57| ≤ 0.005 ∧
      (∀ v ∈ ({12, 13, 14, 15, 16} : Set ℝ),
        14.75 - Real.sqrt (55.5 / 7) < v ∧ v < 14.75 + Real.sqrt (55.5 / 7)) ∧
      (∀ v ∈ ({11, 18, 19} : Set ℝ),
        ¬ (14.75 - Real.sqrt (55.5 / 7) < v ∧ v < 14.75 + Real.sqrt (55.5 / 7))) ∧
      sklece.length = 8 ∧ sklece.Nodup ∧
      ∀ v : ℝ, v ∈ sklece ↔ v ∈ ({12, 13, 14, 15, 16, 11, 18, 19} : Set ℝ) := by
  obtain ⟨t1, t2⟩ := koren2 (55.5 / 7) 2.8157 2.8158 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  refine ⟨blizu (by linarith) (by linarith), blizu (by linarith) (by linarith), ?_, ?_, rfl, ?_, ?_⟩
  · intro v hv
    simp only [mem_insert_iff, mem_singleton_iff] at hv
    rcases hv with rfl | rfl | rfl | rfl | rfl <;> constructor <;> linarith
  · intro v hv h
    simp only [mem_insert_iff, mem_singleton_iff] at hv
    rcases hv with rfl | rfl | rfl <;> linarith [h.1, h.2]
  · simp [sklece]
  · intro v
    simp only [sklece, List.mem_cons, List.not_mem_nil, mem_insert_iff, mem_singleton_iff, or_false]
    tauto

/-- Naloga 21: kot ob središču `360°/9 = 40°`; iz `a/2 = r sin 20°` sledi `a = 10 sin 20°`;
`S = 9·r² sin 40°/2 = 225 sin 40°/2`; delež je `S/(πr²)`. -/
theorem naloga21 (a S : ℝ) :
    (360:ℝ) / 9 = 40 ∧ (a / 2 = 5 * Real.sin (20 * (π / 180)) → a = 10 * Real.sin (20 * (π / 180))) ∧
      9 * (5 ^ 2 * Real.sin (40 * (π / 180)) / 2) = 225 * Real.sin (40 * (π / 180)) / 2 ∧
      (S = 225 * Real.sin (40 * (π / 180)) / 2 →
        S / (π * 5 ^ 2) = 9 * Real.sin (40 * (π / 180)) / (2 * π)) := by
  refine ⟨by norm_num, fun h => by linarith, by ring, fun h => ?_⟩
  rw [h]; field_simp; ring

/-- Naloga 21, števila: `a = 10 sin 20° = 3,4202… ≈ 3,42`, `S = 225 sin 40°/2 = 72,3136… ≈ 72,31`,
delež `S/(πr²) = 9 sin 40°/(2π) = 0,920725… ≈ 92,07 %`. Meje za `s = sin 20°` dobimo iz
`3s − 4s³ = sin 60° = √3/2` (funkcija `3s − 4s³` narašča na `[0, 1/2]`, `0 < s < sin 30° = 1/2`),
nato `sin² 40° = 4s²(1 − s²)`. -/
theorem naloga21_stevila :
    (3.4202:ℝ) ≤ 10 * Real.sin (20 * (π / 180)) ∧ 10 * Real.sin (20 * (π / 180)) < 3.4203 ∧
      |10 * Real.sin (20 * (π / 180)) - 3.42| ≤ 0.005 ∧
      (72.3136:ℝ) ≤ 225 * Real.sin (40 * (π / 180)) / 2 ∧
      225 * Real.sin (40 * (π / 180)) / 2 < 72.3137 ∧
      |225 * Real.sin (40 * (π / 180)) / 2 - 72.31| ≤ 0.005 ∧
      (0.920725:ℝ) ≤ 9 * Real.sin (40 * (π / 180)) / (2 * π) ∧
      9 * Real.sin (40 * (π / 180)) / (2 * π) < 0.920726 ∧
      |100 * (9 * Real.sin (40 * (π / 180)) / (2 * π)) - 92.07| ≤ 0.005 := by
  rw [show 20 * (π / 180) = π / 9 by ring, show 40 * (π / 180) = 2 * (π / 9) by ring]
  have hp := Real.pi_pos
  have p1 := Real.pi_gt_d6
  have p2 := Real.pi_lt_d6
  set s := Real.sin (π / 9) with hs
  have s0 : 0 < s := Real.sin_pos_of_pos_of_lt_pi (by positivity) (by linarith)
  have s12 : s < 1 / 2 := by
    rw [← Real.sin_pi_div_six]
    exact Real.sin_lt_sin_of_lt_of_le_pi_div_two (by linarith) (by linarith) (by linarith)
  have h3 : 3 * s - 4 * s ^ 3 = Real.sqrt 3 / 2 := by
    rw [hs, ← Real.sin_three_mul, ← Real.sin_pi_div_three]; congr 1; ring
  obtain ⟨r1, r2⟩ := koren2 3 1.7320508075 1.7320508076 (by norm_num) (by norm_num) (by norm_num)
    (by norm_num)
  have sl : (0.34202014:ℝ) < s := by
    by_contra h
    replace h := not_lt.mp h
    have m : 0 ≤ ((0.34202014:ℝ) - s) * (3 - 4 * ((0.34202014:ℝ) ^ 2 + 0.34202014 * s + s ^ 2)) :=
      mul_nonneg (by linarith) (by nlinarith)
    have key : 3 * s - 4 * s ^ 3 ≤ 3 * 0.34202014 - 4 * (0.34202014:ℝ) ^ 3 := by nlinarith [m]
    norm_num at key
    linarith
  have su : s < (0.34202015:ℝ) := by
    by_contra h
    replace h := not_lt.mp h
    have m : 0 ≤ (s - (0.34202015:ℝ)) * (3 - 4 * (s ^ 2 + s * 0.34202015 + (0.34202015:ℝ) ^ 2)) :=
      mul_nonneg (by linarith) (by nlinarith)
    have key : 3 * 0.34202015 - 4 * (0.34202015:ℝ) ^ 3 ≤ 3 * s - 4 * s ^ 3 := by nlinarith [m]
    norm_num at key
    linarith
  set t := Real.sin (2 * (π / 9)) with ht
  have t2 : t ^ 2 = 4 * s ^ 2 * (1 - s ^ 2) := by
    rw [ht, Real.sin_two_mul, mul_pow, mul_pow, Real.cos_sq']; ring
  have t0 : 0 < t := Real.sin_pos_of_pos_of_lt_pi (by positivity) (by linarith)
  have a1 : (0.34202014:ℝ) ^ 2 < s ^ 2 := by nlinarith
  have a2 : s ^ 2 < (0.34202015:ℝ) ^ 2 := by nlinarith
  obtain ⟨tl, tu⟩ := koren_meje t (4 * s ^ 2 * (1 - s ^ 2)) 0.6427876 0.6427877 2 t0.le (by norm_num) t2
    (by nlinarith [mul_pos (sub_pos.2 a1) (show 0 < 1 - s ^ 2 - (0.34202014:ℝ) ^ 2 by nlinarith)])
    (by nlinarith [mul_pos (sub_pos.2 a2) (show 0 < 1 - s ^ 2 - (0.34202015:ℝ) ^ 2 by nlinarith)])
  have q1 : (0.920725:ℝ) ≤ 9 * t / (2 * π) := by rw [le_div_iff₀ (by positivity)]; nlinarith
  have q2 : 9 * t / (2 * π) < 0.920726 := by rw [div_lt_iff₀ (by positivity)]; nlinarith
  refine ⟨by linarith, by linarith, blizu (by linarith) (by linarith), by linarith, by linarith,
    blizu (by linarith) (by linarith), q1, q2, blizu (by linarith) (by linarith)⟩

/-- Naloga 22: diagonala `√89 ≈ 9,43 > 3 + 3`, zato se četrtini ne prekrivata; ugodna ploščina
`2·π·3²/4 = 9π/2 = 14,137…`; `P = (9π/2)/(8·5) = 9π/80 = 0,353429… ≈ 0,3534`.
Ni v Leanu: model geometrijske verjetnosti (enakomerna porazdelitev na pravokotniku, ugodna množica kot
unija četrtin kroga in njena mera); dokazan je le račun ploščin in količnika. -/
theorem naloga22 :
    (8:ℝ) ^ 2 + 5 ^ 2 = 89 ∧ |Real.sqrt 89 - 9.43| ≤ 0.005 ∧ (3 + 3 : ℝ) < Real.sqrt 89 ∧
      2 * (π * 3 ^ 2 / 4) = 9 * π / 2 ∧ (14.137:ℝ) ≤ 9 * π / 2 ∧ 9 * π / 2 < 14.138 ∧
      (9 * π / 2) / (8 * 5) = 9 * π / 80 ∧ (0.353429:ℝ) ≤ 9 * π / 80 ∧ 9 * π / 80 < 0.353430 ∧
      |9 * π / 80 - 0.3534| ≤ 0.00005 := by
  obtain ⟨s1, s2⟩ := koren2 89 9.433 9.434 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have p1 := Real.pi_gt_d6
  have p2 := Real.pi_lt_d6
  refine ⟨by norm_num, blizu (by linarith) (by linarith), by linarith, by ring, by linarith, by linarith,
    by ring, by linarith, by linarith, blizu (by linarith) (by linarith)⟩

/-- Naloga 23: `a = 4`, `b = 3`, `e = √(16 − 9) = √7`; `T(2, y)`: `4/16 + y²/9 = 1` ⇔ `y² = 27/4`, v prvem
kvadrantu `y = 3√3/2 ≈ 2,598`; `|F₁T| = √((2 + √7)² + 27/4) = 4 + √7/2 = 5,3228… ≈ 5,32`,
`|F₂T| = 4 − √7/2 = 2,6771… ≈ 2,68`, vsota `8 = 2a`; `|F₁T|² + |F₂T|² = 35,5`, `|F₁T|·|F₂T| = 14,25`,
`cos φ = (35,5 − 28)/28,5 = 5/19`. -/
theorem naloga23 :
    Real.sqrt (4 ^ 2 - 3 ^ 2) = Real.sqrt 7 ∧
      (∀ y : ℝ, (2:ℝ) ^ 2 / 16 + y ^ 2 / 9 = 1 ↔ y ^ 2 = 27 / 4) ∧
      (3 * Real.sqrt 3 / 2) ^ 2 = 27 / 4 ∧ 0 < 3 * Real.sqrt 3 / 2 ∧ |3 * Real.sqrt 3 / 2 - 2.598| ≤ 0.0005 ∧
      Real.sqrt ((2 + Real.sqrt 7) ^ 2 + 27 / 4) = 4 + Real.sqrt 7 / 2 ∧
      Real.sqrt ((2 - Real.sqrt 7) ^ 2 + 27 / 4) = 4 - Real.sqrt 7 / 2 ∧
      (5.3228:ℝ) ≤ 4 + Real.sqrt 7 / 2 ∧ 4 + Real.sqrt 7 / 2 < (5.3229:ℝ) ∧
      (2.6771:ℝ) ≤ 4 - Real.sqrt 7 / 2 ∧ 4 - Real.sqrt 7 / 2 < (2.6772:ℝ) ∧
      |4 + Real.sqrt 7 / 2 - 5.32| ≤ 0.005 ∧ |4 - Real.sqrt 7 / 2 - 2.68| ≤ 0.005 ∧
      (4 + Real.sqrt 7 / 2) + (4 - Real.sqrt 7 / 2) = 2 * 4 ∧
      ((2 + Real.sqrt 7) ^ 2 + 27 / 4) + ((2 - Real.sqrt 7) ^ 2 + 27 / 4) = 2 * (4 + 7) + 27 / 2 ∧
      (2 * (4 + 7) + 27 / 2 : ℝ) = 35.5 ∧ (4 + Real.sqrt 7 / 2) * (4 - Real.sqrt 7 / 2) = 14.25 ∧
      (2 * Real.sqrt 7) ^ 2 = 28 ∧ ((35.5:ℝ) - 28) / (2 * 14.25) = 5 / 19 := by
  have h7 : Real.sqrt 7 ^ 2 = 7 := Real.sq_sqrt (by norm_num)
  have h3 : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  obtain ⟨a1, a2⟩ := koren2 7 2.645751 2.645752 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨b1, b2⟩ := koren2 3 1.73205 1.73206 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have r1 : Real.sqrt ((2 + Real.sqrt 7) ^ 2 + 27 / 4) = 4 + Real.sqrt 7 / 2 := by
    rw [Real.sqrt_eq_iff_mul_self_eq (by positivity) (by linarith)]; linear_combination (3 / 4) * h7
  have r2 : Real.sqrt ((2 - Real.sqrt 7) ^ 2 + 27 / 4) = 4 - Real.sqrt 7 / 2 := by
    rw [Real.sqrt_eq_iff_mul_self_eq (by positivity) (by linarith)]; linear_combination (3 / 4) * h7
  refine ⟨by norm_num, fun y => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    by linear_combination (9 / 4) * h3, by positivity, blizu (by linarith) (by linarith), r1, r2,
    by linarith, by linarith, by linarith, by linarith, blizu (by linarith) (by linarith),
    blizu (by linarith) (by linarith), by ring, by linear_combination 2 * h7, by norm_num,
    by linear_combination (-1 / 4) * h7, by linear_combination 4 * h7, by norm_num⟩

/-- Naloga 24: `0,5 l = 500 cm³`; iz `500 = π r²·11` je `r = √(500/(11π)) = 3,8037… ≈ 3,8 cm`;
`P = 2πr² + 2πr·11 = 1000/11 + √(22 000 π) = 90,90… + 262,89… = 353,80… ≈ 354 cm²`. -/
theorem naloga24 :
    let r : ℝ := Real.sqrt (500 / (11 * π))
    (0.5:ℝ) * 1000 = 500 ∧ π * r ^ 2 * 11 = 500 ∧ (3.8037:ℝ) ≤ r ∧ r < 3.8038 ∧ |r - 3.8| ≤ 0.05 ∧
      2 * π * r ^ 2 = 1000 / 11 ∧ (90.90:ℝ) ≤ 1000 / 11 ∧ (1000:ℝ) / 11 < 90.91 ∧
      2 * π * r * 11 = Real.sqrt (22000 * π) ∧ (262.89:ℝ) ≤ Real.sqrt (22000 * π) ∧
      Real.sqrt (22000 * π) < 262.90 ∧ (353.80:ℝ) ≤ 2 * π * r ^ 2 + 2 * π * r * 11 ∧
      2 * π * r ^ 2 + 2 * π * r * 11 < 353.81 ∧ |2 * π * r ^ 2 + 2 * π * r * 11 - 354| ≤ 0.5 := by
  intro r
  have p1 := Real.pi_gt_d6
  have p2 := Real.pi_lt_d6
  have hp : 0 < π := Real.pi_pos
  have hr2 : r ^ 2 = 500 / (11 * π) := Real.sq_sqrt (by positivity)
  have hr0 : 0 ≤ r := Real.sqrt_nonneg _
  have e1 : π * r ^ 2 * 11 = 500 := by rw [hr2]; field_simp
  have e2 : 2 * π * r ^ 2 = 1000 / 11 := by rw [hr2]; field_simp; ring
  have e3 : 2 * π * r * 11 = Real.sqrt (22000 * π) := by
    rw [eq_comm, Real.sqrt_eq_iff_mul_self_eq (by positivity) (by positivity)]
    have : (2 * π * r * 11) * (2 * π * r * 11) = 484 * π ^ 2 * r ^ 2 := by ring
    rw [this, hr2]; field_simp; ring
  have rb : (3.8037:ℝ) ≤ r ∧ r < 3.8038 := by
    have hA : 0 < 500 / (11 * π) := by positivity
    have l : (3.8037:ℝ) ^ 2 < 500 / (11 * π) := by rw [lt_div_iff₀ (by positivity)]; nlinarith
    have u : 500 / (11 * π) < (3.8038:ℝ) ^ 2 := by rw [div_lt_iff₀ (by positivity)]; nlinarith
    obtain ⟨x1, x2⟩ := koren2 _ 3.8037 3.8038 hA.le (by norm_num) l u
    exact ⟨x1.le, x2⟩
  have sb : (262.897:ℝ) < Real.sqrt (22000 * π) ∧ Real.sqrt (22000 * π) < 262.898 :=
    koren2 _ 262.897 262.898 (by positivity) (by norm_num) (by nlinarith) (by nlinarith)
  have t1 : (353.80:ℝ) ≤ 2 * π * r ^ 2 + 2 * π * r * 11 := by rw [e2, e3]; linarith [sb.1]
  have t2 : 2 * π * r ^ 2 + 2 * π * r * 11 < 353.81 := by rw [e2, e3]; linarith [sb.2]
  refine ⟨by norm_num, e1, rb.1, rb.2, blizu (by linarith) (by linarith), e2, by norm_num, by norm_num,
    e3, by linarith [sb.1], by linarith [sb.2], t1, t2, blizu (by linarith) (by linarith)⟩

/-! ## Pola 2, naloge 25–32 -/

/-- Naloga 25 c), d) (le računi, ki ne potrebujejo `sin 58°`): `S` v arih je `S/100`, višina je
`v_a = 2S/a` (ploščina `S = a·v_a/2`). -/
theorem naloga25 (S a v : ℝ) (ha : a ≠ 0) : (2234.606:ℝ) / 100 = 22.34606 ∧
    (v = 2 * S / a ↔ S = a * v / 2) := by
  refine ⟨by norm_num, ?_⟩
  constructor
  · rintro rfl; field_simp
  · intro h; rw [h]; field_simp

/-- Predpostavka trditve `naloga25` se da izpolniti. -/
example : (74.05:ℝ) ≠ 0 := by norm_num

/-- Naloga 25 simbolno (z `cos 58°`, `sin 58°`): a) kosinusni izrek `a² = 62² + 85² − 2·62·85·cos 58°` za
`a = √(…)`, izraz pod korenom je pozitiven; b) `b = 62 < a` (ker je `cos 58° = sin 32° < 32° < 85/124`), zato je
`cos β = (a² + 85² − 62²)/(2·a·85) > 0` in kot `β ∈ (0, π)` je oster, torej `β = arcsin(sin β)`; sinusni izrek
`a/sin 58° = 62/sin β` ⇔ `sin β = 62·sin 58°/a`; c) `S = b·c·sin α/2 = 62·85·sin 58°/2 = 2635·sin 58°`. -/
theorem naloga25_simbolno :
    let α : ℝ := 58 * (π / 180)
    let a : ℝ := Real.sqrt (62 ^ 2 + 85 ^ 2 - 2 * 62 * 85 * Real.cos α)
    0 < 62 ^ 2 + 85 ^ 2 - 2 * 62 * 85 * Real.cos α ∧
      a ^ 2 = 62 ^ 2 + 85 ^ 2 - 2 * 62 * 85 * Real.cos α ∧ (62:ℝ) < a ∧
      (∀ β : ℝ, 0 < β → β < π → Real.cos β = (a ^ 2 + 85 ^ 2 - 62 ^ 2) / (2 * a * 85) →
        0 < Real.cos β ∧ β < π / 2 ∧ β = Real.arcsin (Real.sin β)) ∧
      (∀ β : ℝ, 0 < β → β < π →
        (a / Real.sin α = 62 / Real.sin β ↔ Real.sin β = 62 * Real.sin α / a)) ∧
      (62:ℝ) * 85 * Real.sin α / 2 = 2635 * Real.sin α := by
  intro α a
  have hp := Real.pi_pos
  have p2 := Real.pi_lt_d6
  have hc : Real.cos α < 85 / 124 := by
    have : Real.cos α = Real.sin (32 * (π / 180)) := by
      rw [← Real.sin_pi_div_two_sub]; congr 1; ring
    rw [this]
    have := Real.sin_lt (show 0 < 32 * (π / 180) by positivity)
    linarith
  have hc1 := Real.neg_one_le_cos α
  have hpos : 0 < 62 ^ 2 + 85 ^ 2 - 2 * 62 * 85 * Real.cos α := by nlinarith
  have ha2 : a ^ 2 = 62 ^ 2 + 85 ^ 2 - 2 * 62 * 85 * Real.cos α := Real.sq_sqrt hpos.le
  have ha0 : 0 < a := Real.sqrt_pos.mpr hpos
  have hba : (62:ℝ) < a := by nlinarith
  have hsa : 0 < Real.sin α := Real.sin_pos_of_pos_of_lt_pi (show (0:ℝ) < 58 * (π / 180) by positivity)
    (show 58 * (π / 180) < π by linarith)
  refine ⟨hpos, ha2, hba, fun β h0 hπ hcos => ?_, fun β h0 hπ => ?_, by ring⟩
  · have hc0 : 0 < Real.cos β := by
      rw [hcos]; apply div_pos _ (by positivity); nlinarith
    have hlt : β < π / 2 := by
      by_contra h
      replace h := not_lt.mp h
      have := Real.cos_nonpos_of_pi_div_two_le_of_le h (by linarith)
      linarith
    exact ⟨hc0, hlt, (Real.arcsin_sin (by linarith) hlt.le).symm⟩
  · have hsb : 0 < Real.sin β := Real.sin_pos_of_pos_of_lt_pi h0 hπ
    rw [div_eq_div_iff hsa.ne' hsb.ne', eq_div_iff ha0.ne']
    constructor <;> intro h <;> linarith

/-- Konstanta ohlajanja iz naloge 26: `k = ln(68/38)/10`. -/
noncomputable def k₂₆ : ℝ := Real.log (68 / 38) / 10

/-- Naloga 26 a), b): `T(0) = 22 + 68e⁰ = 90`; `22 + 68e^(−10k) = 60` ⇔ `e^(−10k) = 38/68` ⇔
`k = ln(68/38)/10 = 0,058192… ≈ 0,0582`. -/
theorem naloga26_ab :
    (22:ℝ) + 68 * Real.exp 0 = 90 ∧
      (∀ k : ℝ, 22 + 68 * Real.exp (-k * 10) = 60 ↔ Real.exp (-k * 10) = 38 / 68) ∧
      (∀ k : ℝ, Real.exp (-k * 10) = 38 / 68 ↔ k = k₂₆) ∧
      (0.058192:ℝ) ≤ k₂₆ ∧ k₂₆ < 0.058193 ∧ |k₂₆ - 0.0582| ≤ 0.00005 := by
  have hl : Real.log (68 / 38) = -Real.log (1 - 15 / 34) := by
    rw [show (1:ℝ) - 15 / 34 = (68 / 38)⁻¹ by norm_num, Real.log_inv, neg_neg]
  obtain ⟨l1, l2⟩ := log_meje (15 / 34) 40 (by norm_num [abs_of_pos]) (-0.5819216) (-0.5819214)
    (by norm_num [Finset.sum_range_succ, abs_of_pos]) (by norm_num [Finset.sum_range_succ, abs_of_pos])
  have kb1 : (0.058192:ℝ) ≤ k₂₆ := by unfold k₂₆; rw [hl]; linarith
  have kb2 : k₂₆ < 0.058193 := by unfold k₂₆; rw [hl]; linarith
  refine ⟨by norm_num, fun k => by constructor <;> intro h <;> linarith, fun k => ?_, kb1, kb2,
    blizu (by linarith) (by linarith)⟩
  have hinv : Real.log (68 / 38) = -Real.log (38 / 68) := by rw [← Real.log_inv]; norm_num
  constructor
  · intro h
    have := congrArg Real.log h
    rw [Real.log_exp] at this
    unfold k₂₆; rw [hinv]; linarith
  · intro h
    rw [h, show -k₂₆ * 10 = Real.log (38 / 68) by unfold k₂₆; rw [hinv]; ring]
    exact Real.exp_log (by norm_num)

/-- Naloga 26 c), d): `22 + 68e^(−kt) = 40` ⇔ `e^(−kt) = 18/68` ⇔ `t = ln(68/18)/k`;
`ln(68/18) = 1,32913…`, `t = 22,84… ≈ 22,8` minute; `T'(t) = −68k e^(−kt)`, `T'(0) = −68k = −3,957… ≈ −3,96`. -/
theorem naloga26_cd :
    (∀ t : ℝ, 22 + 68 * Real.exp (-k₂₆ * t) = 40 ↔ t = Real.log (68 / 18) / k₂₆) ∧
      (1.32913:ℝ) ≤ Real.log (68 / 18) ∧ Real.log (68 / 18) < 1.32914 ∧
      (22.84:ℝ) ≤ Real.log (68 / 18) / k₂₆ ∧ Real.log (68 / 18) / k₂₆ < 22.85 ∧
      |Real.log (68 / 18) / k₂₆ - 22.8| ≤ 0.05 ∧
      (∀ t, HasDerivAt (fun t => 22 + 68 * Real.exp (-k₂₆ * t)) (-68 * k₂₆ * Real.exp (-k₂₆ * t)) t) ∧
      -68 * k₂₆ * Real.exp (-k₂₆ * 0) = -68 * k₂₆ ∧ (-3.958:ℝ) < -68 * k₂₆ ∧ -68 * k₂₆ ≤ -3.957 ∧
      |-68 * k₂₆ - (-3.96)| ≤ 0.005 := by
  obtain ⟨-, -, -, kb1, kb2, -⟩ := naloga26_ab
  have hk : 0 < k₂₆ := by linarith
  have hL : Real.log (68 / 18) = 2 * Real.log 2 + Real.log (1 - 1 / 18) := by
    rw [show (68 / 18 : ℝ) = 2 ^ 2 * (1 - 1 / 18) by norm_num, Real.log_mul (by norm_num) (by norm_num),
      Real.log_pow]; norm_num
  obtain ⟨l1, l2⟩ := log_meje (1 / 18) 15 (by norm_num [abs_of_pos]) (-0.0571584139) (-0.0571584137)
    (by norm_num [Finset.sum_range_succ, abs_of_pos]) (by norm_num [Finset.sum_range_succ, abs_of_pos])
  have t1 := Real.log_two_gt_d9
  have t2 := Real.log_two_lt_d9
  have L1 : (1.32913:ℝ) ≤ Real.log (68 / 18) := by rw [hL]; linarith
  have L2 : Real.log (68 / 18) < 1.32914 := by rw [hL]; linarith
  have hinv : Real.log (68 / 18) = -Real.log (18 / 68) := by rw [← Real.log_inv]; norm_num
  refine ⟨fun t => ⟨fun h => ?_, fun h => ?_⟩, L1, L2, ?_, ?_, ?_, fun t => ?_, by simp, by linarith,
    by linarith, blizu (by linarith) (by linarith)⟩
  · have h2 : Real.exp (-k₂₆ * t) = 18 / 68 := by linarith
    have := congrArg Real.log h2
    rw [Real.log_exp] at this
    rw [eq_div_iff hk.ne', hinv]; linarith
  · rw [h, show -k₂₆ * (Real.log (68 / 18) / k₂₆) = Real.log (18 / 68) by
      rw [hinv]; field_simp, Real.exp_log (by norm_num)]
    norm_num
  · rw [le_div_iff₀ hk]; nlinarith
  · rw [div_lt_iff₀ hk]; nlinarith
  · have a1 : (22.84:ℝ) ≤ Real.log (68 / 18) / k₂₆ := by rw [le_div_iff₀ hk]; nlinarith
    have a2 : Real.log (68 / 18) / k₂₆ < 22.85 := by rw [div_lt_iff₀ hk]; nlinarith
    exact blizu (by linarith) (by linarith)
  · have := ((((hasDerivAt_id' t).const_mul (-k₂₆)).exp).const_mul 68).const_add 22
    exact this.congr_deriv (by ring)

/-- Naloga 27: `0,08x² − 2 = 0` ⇔ `x² = 25` ⇔ `x = ±5`; širina `10 m`, globina `|y(0)| = 2 m`; med ničlama
je parabola pod osjo; `S = ∫₋₅⁵ (2 − 0,08x²) dx = [2x − 0,08x³/3]₋₅⁵ = 2(10 − 10/3) = 40/3 = 13,333… ≈ 13,33`;
`V = 250·S = 3333,3… ≈ 3333 m³`; `y' = 0,16x`, `y'(5) = 0,8` (`tan φ = 0,8`), `y'(−5) = −0,8`. -/
theorem naloga27 :
    (∀ x : ℝ, 0.08 * x ^ 2 - 2 = 0 ↔ x = 5 ∨ x = -5) ∧ (5:ℝ) - (-5) = 10 ∧ |0.08 * (0:ℝ) ^ 2 - 2| = 2 ∧
      (∀ x : ℝ, -2 ≤ 0.08 * x ^ 2 - 2) ∧ (∀ x ∈ Ioo (-5:ℝ) 5, 0.08 * x ^ 2 - 2 < 0) ∧
      ∫ x in (-5:ℝ)..5, (2 - 0.08 * x ^ 2) = 2 * (10 - 10 / 3) ∧ (2 * (10 - 10 / 3) : ℝ) = 40 / 3 ∧
      |(40 / 3 : ℝ) - 13.33| ≤ 0.005 ∧ (40 / 3 : ℝ) * 250 = 10000 / 3 ∧ |(10000 / 3 : ℝ) - 3333| ≤ 0.5 ∧
      (∀ x, HasDerivAt (fun x : ℝ => 0.08 * x ^ 2 - 2) (0.16 * x) x) ∧ (0.16:ℝ) * 5 = 0.8 ∧
      (0.16:ℝ) * (-5) = -0.8 := by
  have hF : ∀ x, HasDerivAt (fun x : ℝ => 2 * x - 0.08 * x ^ 3 / 3) (2 - 0.08 * x ^ 2) x := by
    intro x
    exact (((hasDerivAt_id' x).const_mul 2).sub (((hasDerivAt_pow 3 x).const_mul 0.08).div_const 3))
      |>.congr_deriv (by norm_num; ring)
  refine ⟨fun x => ⟨fun h => ?_, ?_⟩, by norm_num, by norm_num, fun x => by nlinarith [sq_nonneg x],
    fun x hx => by nlinarith [hx.1, hx.2], ?_, by norm_num, blizu (by norm_num) (by norm_num),
    by norm_num, blizu (by norm_num) (by norm_num), fun x => ?_, by norm_num, by norm_num⟩
  · have : (x - 5) * (x + 5) = 0 := by linear_combination h / 0.08
    rcases mul_eq_zero.mp this with h1 | h1
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num
  · rw [newton_leibniz _ _ (-5) 5 hF (by fun_prop)]; norm_num
  · exact (((hasDerivAt_pow 2 x).const_mul 0.08).sub_const 2).congr_deriv (by norm_num; ring)

/-- Naloga 28: `C(20, 4) = 4845`, `C(14, 4) = 1001`, `C(14, 3) = 364`, `6·364 = 2184`;
`P(A) = 1001/4845 = 0,20660… ≈ 0,2066`, `P(B) = 2184/4845 = 0,45077… ≈ 0,4508`,
`P(C) = 1 − (1001 + 2184)/4845 = 1660/4845 = 0,34262… ≈ 0,3426` (kar je tudi
`C(6,2)C(14,2) + C(6,3)C(14,1) + C(6,4)` ugodnih izbir). -/
theorem naloga28 :
    Nat.choose 20 4 = 4845 ∧ Nat.choose 14 4 = 1001 ∧ Nat.choose 14 3 = 364 ∧ 6 * 364 = 2184 ∧
      (0.20660:ℝ) ≤ 1001 / 4845 ∧ (1001:ℝ) / 4845 < 0.20661 ∧ |(1001:ℝ) / 4845 - 0.2066| ≤ 0.00005 ∧
      (0.45077:ℝ) ≤ 2184 / 4845 ∧ (2184:ℝ) / 4845 < 0.45078 ∧ |(2184:ℝ) / 4845 - 0.4508| ≤ 0.00005 ∧
      1 - ((1001:ℝ) + 2184) / 4845 = 1660 / 4845 ∧ (0.34262:ℝ) ≤ 1660 / 4845 ∧ (1660:ℝ) / 4845 < 0.34263 ∧
      |(1660:ℝ) / 4845 - 0.3426| ≤ 0.00005 ∧
      Nat.choose 6 2 * Nat.choose 14 2 + Nat.choose 6 3 * Nat.choose 14 1 + Nat.choose 6 4 = 1660 := by
  refine ⟨by decide, by decide, by decide, by norm_num, by norm_num, by norm_num,
    blizu (by norm_num) (by norm_num), by norm_num, by norm_num, blizu (by norm_num) (by norm_num),
    by norm_num, by norm_num, by norm_num, blizu (by norm_num) (by norm_num), by decide⟩

/-- Prostornina stožca s stranico `20 cm` v odvisnosti od višine `h`. -/
noncomputable def V₂₉ (h : ℝ) : ℝ := π / 3 * (400 * h - h ^ 3)

/-- Naloga 29 a), b): iz `h² + r² = 400` je `r² = 400 − h²` in `V = πr²h/3 = π/3·(400h − h³)`;
`V'(h) = π/3·(400 − 3h²)`, za `h > 0` je `V' = 0` natanko pri `h = 20/√3 = 11,547… ≈ 11,55`; pred tem
`V' > 0`, za tem `V' < 0`; pri `h₀ = 20/√3` je prostornina največja (`V(h) ≤ V(h₀)` za vsak `h ≥ 0`). -/
theorem naloga29_ab :
    (∀ h : ℝ, (0 < h ∧ 0 < 400 - h ^ 2) ↔ (0 < h ∧ h < 20)) ∧
    (∀ h r : ℝ, h ^ 2 + r ^ 2 = 400 → r ^ 2 = 400 - h ^ 2 ∧ π * r ^ 2 * h / 3 = V₂₉ h) ∧
      (∀ h, HasDerivAt V₂₉ (π / 3 * (400 - 3 * h ^ 2)) h) ∧
      (∀ h : ℝ, 0 < h → (π / 3 * (400 - 3 * h ^ 2) = 0 ↔ h = 20 / Real.sqrt 3)) ∧
      (∀ h : ℝ, 0 ≤ h → h < 20 / Real.sqrt 3 → 0 < π / 3 * (400 - 3 * h ^ 2)) ∧
      (∀ h : ℝ, 20 / Real.sqrt 3 < h → π / 3 * (400 - 3 * h ^ 2) < 0) ∧
      (∀ h : ℝ, 0 ≤ h → V₂₉ h ≤ V₂₉ (20 / Real.sqrt 3)) ∧
      (11.547:ℝ) ≤ 20 / Real.sqrt 3 ∧ 20 / Real.sqrt 3 < 11.548 ∧ |20 / Real.sqrt 3 - 11.55| ≤ 0.005 := by
  have hp : 0 < π := Real.pi_pos
  have s3 : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have s0 : 0 < Real.sqrt 3 := by positivity
  set h₀ := 20 / Real.sqrt 3 with hh₀
  have h0sq : h₀ ^ 2 = 400 / 3 := by rw [hh₀, div_pow, s3]; norm_num
  have h0pos : 0 < h₀ := by positivity
  obtain ⟨b1, b2⟩ := koren2 3 1.7320508 1.7320509 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have hb1 : (11.547:ℝ) ≤ h₀ := by rw [hh₀, le_div_iff₀ s0]; nlinarith
  have hb2 : h₀ < 11.548 := by rw [hh₀, div_lt_iff₀ s0]; nlinarith
  have hv : ∀ h r : ℝ, h ^ 2 + r ^ 2 = 400 → r ^ 2 = 400 - h ^ 2 ∧ π * r ^ 2 * h / 3 = V₂₉ h := by
    intro h r hr
    have e : r ^ 2 = 400 - h ^ 2 := by linarith
    refine ⟨e, ?_⟩
    unfold V₂₉; rw [e]; ring
  have hdom : ∀ h : ℝ, (0 < h ∧ 0 < 400 - h ^ 2) ↔ (0 < h ∧ h < 20) := fun h =>
    ⟨fun ⟨a, b⟩ => ⟨a, by nlinarith⟩, fun ⟨a, b⟩ => ⟨a, by nlinarith⟩⟩
  refine ⟨hdom, hv, fun h => ?_, fun h hh => ⟨fun e => ?_, fun e => ?_⟩, fun h hh hl => ?_, fun h hl => ?_,
    fun h hh => ?_, hb1, hb2, blizu (by linarith) (by linarith)⟩
  · unfold V₂₉
    exact ((((hasDerivAt_id' h).const_mul 400).sub (hasDerivAt_pow 3 h)).const_mul (π / 3)).congr_deriv
      (by norm_num)
  · have : 400 - 3 * h ^ 2 = 0 := by
      rcases mul_eq_zero.mp e with e1 | e1
      · exact absurd e1 (by positivity)
      · exact e1
    have : h ^ 2 = h₀ ^ 2 := by rw [h0sq]; linarith
    exact (pow_left_inj₀ hh.le h0pos.le (by norm_num)).mp this
  · rw [e, h0sq]; ring
  · have : h ^ 2 < h₀ ^ 2 := pow_lt_pow_left₀ hl hh (by norm_num)
    rw [h0sq] at this
    exact mul_pos (by positivity) (by linarith)
  · have : h₀ ^ 2 < h ^ 2 := pow_lt_pow_left₀ hl h0pos.le (by norm_num)
    rw [h0sq] at this
    exact mul_neg_of_pos_of_neg (by positivity) (by linarith)
  · unfold V₂₉
    have e : 400 * h₀ - h₀ ^ 3 - (400 * h - h ^ 3) = (h - h₀) ^ 2 * (h + 2 * h₀) := by
      have : h₀ ^ 3 = h₀ * h₀ ^ 2 := by ring
      rw [this, h0sq]; nlinarith [h0sq]
    have : 0 ≤ (h - h₀) ^ 2 * (h + 2 * h₀) := mul_nonneg (sq_nonneg _) (by linarith)
    have : 400 * h - h ^ 3 ≤ 400 * h₀ - h₀ ^ 3 := by linarith
    exact mul_le_mul_of_nonneg_left this (by positivity)

/-- Naloga 29 c): `r² = 400 − 400/3 = 800/3`, `r = 16,329…`; `V = π/3·800/3·20/√3 = 3224,53… ≈ 3225 cm³`;
`tan(φ/2) = r/h = √2`. -/
theorem naloga29_c :
    (400:ℝ) - 400 / 3 = 800 / 3 ∧ (16.329:ℝ) ≤ Real.sqrt (800 / 3) ∧ Real.sqrt (800 / 3) < 16.330 ∧
      V₂₉ (20 / Real.sqrt 3) = π / 3 * (800 / 3) * (20 / Real.sqrt 3) ∧
      (3224.53:ℝ) ≤ π / 3 * (800 / 3) * (20 / Real.sqrt 3) ∧
      π / 3 * (800 / 3) * (20 / Real.sqrt 3) < 3224.54 ∧
      |π / 3 * (800 / 3) * (20 / Real.sqrt 3) - 3225| ≤ 0.5 ∧
      Real.sqrt (800 / 3) / (20 / Real.sqrt 3) = Real.sqrt 2 := by
  have s3 : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have s0 : 0 < Real.sqrt 3 := by positivity
  obtain ⟨b1, b2⟩ := koren2 3 1.7320508 1.7320509 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  obtain ⟨r1, r2⟩ := koren2 (800 / 3) 16.329 16.330 (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  have p1 := Real.pi_gt_d6
  have p2 := Real.pi_lt_d6
  have hV : V₂₉ (20 / Real.sqrt 3) = π / 3 * (800 / 3) * (20 / Real.sqrt 3) := by
    unfold V₂₉
    have : (20 / Real.sqrt 3) ^ 2 = 400 / 3 := by rw [div_pow, s3]; norm_num
    rw [show (20 / Real.sqrt 3) ^ 3 = (20 / Real.sqrt 3) * (20 / Real.sqrt 3) ^ 2 by ring, this]; ring
  have e : π / 3 * (800 / 3) * (20 / Real.sqrt 3) = 16000 * π / 9 / Real.sqrt 3 := by
    field_simp; ring
  have v1 : (3224.53:ℝ) ≤ 16000 * π / 9 / Real.sqrt 3 := by rw [le_div_iff₀ s0]; nlinarith
  have v2 : 16000 * π / 9 / Real.sqrt 3 < 3224.54 := by rw [div_lt_iff₀ s0]; nlinarith
  refine ⟨by norm_num, r1.le, r2, hV, by rw [e]; exact v1, by rw [e]; exact v2,
    blizu (by rw [e]; linarith) (by rw [e]; linarith), ?_⟩
  rw [div_div_eq_mul_div, ← Real.sqrt_mul (by norm_num), show (800 / 3 : ℝ) * 3 = 2 * 20 ^ 2 by norm_num,
    Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  field_simp

/-- Mesečni obrestovalni faktor iz naloge 30: `r₁₂ = ¹²√1,032`. -/
noncomputable def r₃₀ : ℝ := (1.032:ℝ) ^ (1 / 12 : ℝ)

/-- Pomožna trditev: `r₁₂¹² = 1,032`. -/
theorem r₃₀_pow : r₃₀ ^ 12 = 1.032 := by
  unfold r₃₀; rw [← Real.rpow_natCast, ← Real.rpow_mul (by norm_num)]; norm_num

/-- Pomožna trditev: `1,00262833695 < r₁₂ < 1,00262833697`. -/
theorem r₃₀_meje : (1.00262833695:ℝ) < r₃₀ ∧ r₃₀ < 1.00262833697 :=
  koren_meje _ _ _ _ 12 (Real.rpow_nonneg (by norm_num) _) (by norm_num) r₃₀_pow (by norm_num) (by norm_num)

/-- Naloga 30 a), b): `K₆ = 8000·1,032⁶ = 9664,2503… ≈ 9664,25 €`; `r₁₂¹² = 1,032`,
`r₁₂ = 1,0026283…`, `p_k = (r₁₂ − 1)·100 % ≈ 0,2628 %`. -/
theorem naloga30_ab :
    (9664.2503:ℝ) ≤ 8000 * 1.032 ^ 6 ∧ 8000 * (1.032:ℝ) ^ 6 < 9664.2504 ∧
      |8000 * (1.032:ℝ) ^ 6 - 9664.25| ≤ 0.005 ∧ r₃₀ ^ 12 = 1.032 ∧ (1.0026283:ℝ) ≤ r₃₀ ∧
      r₃₀ < 1.0026284 ∧ |(r₃₀ - 1) * 100 - 0.2628| ≤ 0.00005 := by
  obtain ⟨a, b⟩ := r₃₀_meje
  exact ⟨by norm_num, by norm_num, blizu (by norm_num) (by norm_num), r₃₀_pow, by linarith, by linarith,
    blizu (by linarith) (by linarith)⟩

/-- Naloga 30 c): `1,032ⁿ ≥ 2` ⇔ `n ≥ ln 2 / ln 1,032 = 22,0056…`; med celimi števili natanko `n ≥ 23`;
preverba `1,032²² ≈ 1,9996 < 2`, `1,032²³ ≈ 2,0636 ≥ 2`. -/
theorem naloga30_c :
    (∀ n : ℝ, (1.032:ℝ) ^ n ≥ 2 ↔ n ≥ Real.log 2 / Real.log 1.032) ∧
      (22.0056:ℝ) ≤ Real.log 2 / Real.log 1.032 ∧ Real.log 2 / Real.log 1.032 < 22.0057 ∧
      (∀ n : ℕ, (1.032:ℝ) ^ n ≥ 2 ↔ 23 ≤ n) ∧ |(1.032:ℝ) ^ 22 - 1.9996| ≤ 0.00005 ∧
      (1.032:ℝ) ^ 22 < 2 ∧ |(1.032:ℝ) ^ 23 - 2.0636| ≤ 0.00005 ∧ (1.032:ℝ) ^ 23 ≥ 2 := by
  have hl : 0 < Real.log 1.032 := Real.log_pos (by norm_num)
  have hL : Real.log 1.032 = -Real.log (1 - 4 / 129) := by
    rw [show (1:ℝ) - 4 / 129 = (1.032)⁻¹ by norm_num, Real.log_inv, neg_neg]
  obtain ⟨l1, l2⟩ := log_meje (4 / 129) 10 (by norm_num [abs_of_pos]) (-0.0314986671) (-0.0314986670)
    (by norm_num [Finset.sum_range_succ, abs_of_pos]) (by norm_num [Finset.sum_range_succ, abs_of_pos])
  have t1 := Real.log_two_gt_d9
  have t2 := Real.log_two_lt_d9
  refine ⟨fun n => ?_, ?_, ?_, fun n => ⟨fun h => ?_, fun h => ?_⟩, blizu (by norm_num) (by norm_num),
    by norm_num, blizu (by norm_num) (by norm_num), by norm_num⟩
  · rw [ge_iff_le, ge_iff_le, ← Real.log_le_log_iff (by norm_num) (Real.rpow_pos_of_pos (by norm_num) n),
      Real.log_rpow (by norm_num), div_le_iff₀ hl]
  · rw [le_div_iff₀ hl, hL]; nlinarith
  · rw [div_lt_iff₀ hl, hL]; nlinarith
  · by_contra hn
    push Not at hn
    have : (1.032:ℝ) ^ n ≤ 1.032 ^ 22 := pow_le_pow_right₀ (by norm_num) (by omega)
    have : (1.032:ℝ) ^ 22 < 2 := by norm_num
    linarith
  · have : (1.032:ℝ) ^ 23 ≤ 1.032 ^ n := pow_le_pow_right₀ (by norm_num) h
    have : (2:ℝ) ≤ 1.032 ^ 23 := by norm_num
    exact le_trans this (by assumption)

/-- Naloga 30 d): stanje po `72.` vlogi je vsota geometrijskega zaporedja
`S₇₂ = Σ 100·r₁₂ⁱ = 100·(r₁₂⁷² − 1)/(r₁₂ − 1)`; `r₁₂⁷² = 1,032⁶ = 1,20803…`; `S₇₂ = 7914,939… ≈ 7914,94 €`. -/
theorem naloga30_d :
    ∑ i ∈ Finset.range 72, 100 * r₃₀ ^ i = 100 * (r₃₀ ^ 72 - 1) / (r₃₀ - 1) ∧ r₃₀ ^ 72 = 1.032 ^ 6 ∧
      (1.20803:ℝ) ≤ 1.032 ^ 6 ∧ (1.032:ℝ) ^ 6 < 1.20804 ∧
      (7914.939:ℝ) ≤ 100 * (r₃₀ ^ 72 - 1) / (r₃₀ - 1) ∧ 100 * (r₃₀ ^ 72 - 1) / (r₃₀ - 1) < 7914.940 ∧
      |100 * (r₃₀ ^ 72 - 1) / (r₃₀ - 1) - 7914.94| ≤ 0.005 := by
  obtain ⟨a, b⟩ := r₃₀_meje
  have h72 : r₃₀ ^ 72 = 1.032 ^ 6 := by rw [show 72 = 12 * 6 by rfl, pow_mul, r₃₀_pow]
  have hr : r₃₀ - 1 ≠ 0 := by intro h; linarith
  have hr0 : 0 < r₃₀ - 1 := by linarith
  have hsum : ∑ i ∈ Finset.range 72, 100 * r₃₀ ^ i = 100 * (r₃₀ ^ 72 - 1) / (r₃₀ - 1) := by
    rw [← Finset.mul_sum, geom_sum_eq (by intro h; linarith) 72]; ring
  have s1 : (7914.939:ℝ) ≤ 100 * (r₃₀ ^ 72 - 1) / (r₃₀ - 1) := by
    rw [le_div_iff₀ hr0, h72]; norm_num; linarith
  have s2 : 100 * (r₃₀ ^ 72 - 1) / (r₃₀ - 1) < 7914.940 := by
    rw [div_lt_iff₀ hr0, h72]; norm_num; linarith
  exact ⟨hsum, h72, by norm_num, by norm_num, s1, s2, blizu (by linarith) (by linarith)⟩

/-- Naloga 31 a), b): `x² + y² − 6x − 4y − 12 = 0` ⇔ `(x − 3)² + (y − 2)² = 25` (`S(3, 2)`, `r = 5`);
z `x = 3y − 8`: `(3y − 11)² + (y − 2)² = 25` ⇔ `10y² − 70y + 100 = 0` ⇔ `y² − 7y + 10 = 0`; presečišči
`A(7, 5)` in `B(−2, 2)`. -/
theorem naloga31_ab :
    (∀ x y : ℝ, x ^ 2 + y ^ 2 - 6 * x - 4 * y - 12 = 0 ↔ (x - 3) ^ 2 + (y - 2) ^ 2 = 25) ∧
      (∀ y : ℝ, (3 * y - 8 - 3) ^ 2 + (y - 2) ^ 2 = 25 ↔ 10 * y ^ 2 - 70 * y + 100 = 0) ∧
      (∀ y : ℝ, 10 * y ^ 2 - 70 * y + 100 = 0 ↔ y ^ 2 - 7 * y + 10 = 0) ∧
      ∀ x y : ℝ, (x ^ 2 + y ^ 2 - 6 * x - 4 * y - 12 = 0 ∧ x - 3 * y + 8 = 0) ↔
        (x = 7 ∧ y = 5) ∨ (x = -2 ∧ y = 2) := by
  refine ⟨fun x y => by constructor <;> intro h <;> linarith, fun y => by constructor <;> intro h <;> linarith,
    fun y => by constructor <;> intro h <;> linarith, fun x y => ⟨fun ⟨h1, h2⟩ => ?_, ?_⟩⟩
  · have hx : x = 3 * y - 8 := by linarith
    subst hx
    have : (y - 5) * (y - 2) = 0 := by linear_combination h1 / 10
    rcases mul_eq_zero.mp this with h | h
    · left; constructor <;> linarith
    · right; constructor <;> linarith
  · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩) <;> norm_num

/-- Naloga 31 c), d): `SA⃗ = (4, 3)`, `SB⃗ = (−5, 0)`, `cos φ = −20/25 = −0,8`, `sin φ = 0,6` za
`φ = arccos(−0,8)`; tangenta `4(x − 7) + 3(y − 5) = 0`, tj. `4x + 3y − 43 = 0`, je pravokotna na `SA⃗`;
`k_t = −4/3`, `k_p = 1/3`, `tan δ = |(5/3)/(5/9)| = 3`; kot med tangento in tetivo je polovica središčnega
kota: `2·arctan 3 = arccos(−0,8)`. -/
theorem naloga31_cd :
    ((7:ℝ) - 3, (5:ℝ) - 2) = (4, 3) ∧ ((-2:ℝ) - 3, (2:ℝ) - 2) = (-5, 0) ∧
      (4:ℝ) * (-5) + 3 * 0 = -20 ∧ Real.sqrt (4 ^ 2 + 3 ^ 2) = 5 ∧ Real.sqrt ((-5) ^ 2 + 0 ^ 2) = 5 ∧
      (-20:ℝ) / (5 * 5) = -0.8 ∧ Real.sin (Real.arccos (-0.8)) = 0.6 ∧
      (∀ x y : ℝ, 4 * (x - 7) + 3 * (y - 5) = 0 ↔ 4 * x + 3 * y - 43 = 0) ∧ (3:ℝ) * 4 + (-4) * 3 = 0 ∧
      (∀ x y : ℝ, 4 * x + 3 * y - 43 = 0 ↔ y = -4 / 3 * x + 43 / 3) ∧
      (∀ x y : ℝ, x - 3 * y + 8 = 0 ↔ y = 1 / 3 * x + 8 / 3) ∧
      |((1:ℝ) / 3 - (-4 / 3)) / (1 + 1 / 3 * (-4 / 3))| = 3 ∧
      2 * Real.arctan 3 = Real.arccos (-0.8) := by
  have a0 : 0 < Real.arctan 3 := by
    have := Real.arctan_strictMono (show (0:ℝ) < 3 by norm_num); rwa [Real.arctan_zero] at this
  have a1 := Real.arctan_lt_pi_div_two 3
  have c10 : Real.cos (Real.arctan 3) ^ 2 = 1 / 10 := by
    rw [Real.cos_arctan, div_pow, Real.sq_sqrt (by norm_num)]; norm_num
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, ?_, by norm_num, ?_,
    fun x y => by constructor <;> intro h <;> linarith, by norm_num,
    fun x y => by constructor <;> intro h <;> linarith, fun x y => by constructor <;> intro h <;> linarith,
    by norm_num [abs_of_pos], ?_⟩
  · rw [show (4:ℝ) ^ 2 + 3 ^ 2 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (-5:ℝ) ^ 2 + 0 ^ 2 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [Real.sin_arccos, show (1:ℝ) - (-0.8) ^ 2 = 0.6 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (-0.8:ℝ) = Real.cos (2 * Real.arctan 3) by rw [Real.cos_two_mul, c10]; norm_num,
      Real.arccos_cos (by linarith) (by linarith)]

/-- Koncentracija zdravila iz naloge 32: `c(t) = 10t·e^(−0,5t)`. -/
noncomputable def c₃₂ (t : ℝ) : ℝ := 10 * t * Real.exp (-0.5 * t)

/-- Pomožna trditev: odvod `c'(t) = 10e^(−0,5t) + 10t·(−0,5)e^(−0,5t) = 10e^(−0,5t)(1 − 0,5t)`. -/
theorem c₃₂_odvod (t : ℝ) : HasDerivAt c₃₂ (10 * Real.exp (-0.5 * t) * (1 - 0.5 * t)) t := by
  unfold c₃₂
  exact (((hasDerivAt_id' t).const_mul 10).mul (((hasDerivAt_id' t).const_mul (-0.5)).exp)).congr_deriv
    (by ring)

/-- Naloga 32 a): `c'(t) = 10e^(−0,5t) + 10t·(−0,5)e^(−0,5t) = 10e^(−0,5t)(1 − 0,5t)`; `c'(t) = 0` natanko
pri `t = 2`, pred tem `c' > 0`, za tem `c' < 0`; maksimum `c(2) = 20e^(−1) = 7,3575… ≈ 7,36 mg/l`
(`c(t) ≤ c(2)` za vsak `t`). -/
theorem naloga32_a :
    (∀ t : ℝ, 10 * Real.exp (-0.5 * t) + 10 * t * (-0.5) * Real.exp (-0.5 * t) =
      10 * Real.exp (-0.5 * t) * (1 - 0.5 * t)) ∧
      (∀ t : ℝ, 10 * Real.exp (-0.5 * t) * (1 - 0.5 * t) = 0 ↔ t = 2) ∧
      (∀ t : ℝ, t < 2 → 0 < 10 * Real.exp (-0.5 * t) * (1 - 0.5 * t)) ∧
      (∀ t : ℝ, 2 < t → 10 * Real.exp (-0.5 * t) * (1 - 0.5 * t) < 0) ∧
      (∀ t, c₃₂ t ≤ c₃₂ 2) ∧ c₃₂ 2 = 20 * Real.exp (-1) ∧ (7.3575:ℝ) ≤ 20 * Real.exp (-1) ∧
      20 * Real.exp (-1) < 7.3576 ∧ |20 * Real.exp (-1) - 7.36| ≤ 0.005 := by
  have e1 := Real.exp_one_gt_d9
  have e2 := Real.exp_one_lt_d9
  have em : Real.exp (-1) = 1 / Real.exp 1 := by rw [Real.exp_neg, one_div]
  have epos : 0 < Real.exp 1 := Real.exp_pos 1
  have v1 : (7.3575:ℝ) ≤ 20 * Real.exp (-1) := by
    rw [em, mul_one_div, le_div_iff₀ epos]; nlinarith
  have v2 : 20 * Real.exp (-1) < 7.3576 := by
    rw [em, mul_one_div, div_lt_iff₀ epos]; nlinarith
  refine ⟨fun t => by ring, fun t => ⟨fun h => ?_, fun h => by rw [h]; norm_num⟩,
    fun t h => mul_pos (by positivity) (by linarith), fun t h => mul_neg_of_pos_of_neg (by positivity)
      (by linarith), fun t => ?_, by unfold c₃₂; norm_num, v1, v2, blizu (by linarith) (by linarith)⟩
  · rcases mul_eq_zero.mp h with h1 | h1
    · exact absurd h1 (by positivity)
    · linarith
  · unfold c₃₂
    have h := Real.add_one_le_exp (t / 2 - 1)
    have hE : Real.exp (t / 2 - 1) * Real.exp (-0.5 * t) = Real.exp (-1) := by
      rw [← Real.exp_add]; congr 1; ring
    have := mul_le_mul_of_nonneg_right h (Real.exp_pos (-0.5 * t)).le
    rw [hE] at this
    rw [show (-0.5:ℝ) * 2 = -1 by norm_num]
    nlinarith

/-- Naloga 32 b): `c(7) = 70e^(−3,5) ≈ 2,114 > 2`, `c(8) = 80e^(−4) ≈ 1,465 < 2`; za `t > 2` funkcija pada;
`c(7,5) ≈ 1,764 < 2`, `c(7,25) ≈ 1,932 < 2`; koncentracija pade pod `2 mg/l` natanko enkrat za `t ≥ 2`,
in sicer med `7` in `7,25` ure. -/
theorem naloga32_b :
    |c₃₂ 7 - 2.114| ≤ 0.0005 ∧ |c₃₂ 8 - 1.465| ≤ 0.0005 ∧ |c₃₂ 7.5 - 1.764| ≤ 0.0005 ∧
      |c₃₂ 7.25 - 1.932| ≤ 0.0005 ∧ 2 < c₃₂ 7 ∧ c₃₂ 8 < 2 ∧ c₃₂ 7.5 < 2 ∧ c₃₂ 7.25 < 2 ∧
      StrictAntiOn c₃₂ (Ici 2) ∧ ∃ t ∈ Ioo (7:ℝ) 7.25, c₃₂ t = 2 ∧ ∀ s ∈ Ici (2:ℝ), c₃₂ s = 2 → s = t := by
  obtain ⟨x1, x2⟩ := ocena_exp 3.5 2 7 (by norm_num) (by norm_num) 33.115 33.116 (by norm_num)
    (by norm_num) (by norm_num)
  obtain ⟨y1, y2⟩ := ocena_exp 4 1 4 (by norm_num) (by norm_num) 54.598 54.599 (by norm_num)
    (by norm_num) (by norm_num)
  obtain ⟨z1, z2⟩ := ocena_exp 3.75 4 15 (by norm_num) (by norm_num) 42.52 42.522 (by norm_num)
    (by norm_num) (by norm_num)
  obtain ⟨w1, w2⟩ := ocena_exp 3.625 8 29 (by norm_num) (by norm_num) 37.524 37.526 (by norm_num)
    (by norm_num) (by norm_num)
  have ev : ∀ t r : ℝ, -0.5 * t = -r → c₃₂ t = 10 * t / Real.exp r := by
    intro t r h; unfold c₃₂; rw [h, Real.exp_neg]; field_simp
  have c7 : c₃₂ 7 = 70 / Real.exp 3.5 := by rw [ev 7 3.5 (by norm_num)]; norm_num
  have c8 : c₃₂ 8 = 80 / Real.exp 4 := by rw [ev 8 4 (by norm_num)]; norm_num
  have c75 : c₃₂ 7.5 = 75 / Real.exp 3.75 := by rw [ev 7.5 3.75 (by norm_num)]; norm_num
  have c725 : c₃₂ 7.25 = 72.5 / Real.exp 3.625 := by rw [ev 7.25 3.625 (by norm_num)]; norm_num
  have p1 := Real.exp_pos 3.5
  have p2 := Real.exp_pos 4
  have p3 := Real.exp_pos 3.75
  have p4 := Real.exp_pos 3.625
  have b7 : (2.1135:ℝ) ≤ c₃₂ 7 ∧ c₃₂ 7 ≤ 2.1145 := by
    rw [c7, le_div_iff₀ p1, div_le_iff₀ p1]; constructor <;> nlinarith
  have b8 : (1.4645:ℝ) ≤ c₃₂ 8 ∧ c₃₂ 8 ≤ 1.4655 := by
    rw [c8, le_div_iff₀ p2, div_le_iff₀ p2]; constructor <;> nlinarith
  have b75 : (1.7635:ℝ) ≤ c₃₂ 7.5 ∧ c₃₂ 7.5 ≤ 1.7645 := by
    rw [c75, le_div_iff₀ p3, div_le_iff₀ p3]; constructor <;> nlinarith
  have b725 : (1.9315:ℝ) ≤ c₃₂ 7.25 ∧ c₃₂ 7.25 ≤ 1.9325 := by
    rw [c725, le_div_iff₀ p4, div_le_iff₀ p4]; constructor <;> nlinarith
  have hc : Continuous c₃₂ := by unfold c₃₂; fun_prop
  have anti : StrictAntiOn c₃₂ (Ici 2) := by
    apply strictAntiOn_of_deriv_neg (convex_Ici 2) hc.continuousOn
    intro x hx
    rw [interior_Ici] at hx
    rw [(c₃₂_odvod x).deriv]
    exact mul_neg_of_pos_of_neg (by positivity) (by linarith [mem_Ioi.mp hx])
  obtain ⟨t, ht, hct⟩ := intermediate_value_Ioo' (show (7:ℝ) ≤ 7.25 by norm_num) hc.continuousOn
    (show (2:ℝ) ∈ Ioo (c₃₂ 7.25) (c₃₂ 7) from ⟨by linarith [b725.2], by linarith [b7.1]⟩)
  refine ⟨blizu (by linarith) (by linarith), blizu (by linarith) (by linarith),
    blizu (by linarith) (by linarith), blizu (by linarith) (by linarith), by linarith, by linarith,
    by linarith, by linarith, anti, t, ht, hct, fun s hs hcs => ?_⟩
  have ht2 : t ∈ Ici (2:ℝ) := by simp only [mem_Ici]; linarith [ht.1]
  exact anti.injOn hs ht2 (hcs.trans hct.symm)

/-- Naloga 32 c): per partes `∫ t e^(−0,5t) dt = −2t e^(−0,5t) − 4e^(−0,5t) + C`;
`∫₀⁶ t e^(−0,5t) dt = −16e^(−3) + 4 = 3,2034…`; `c̄ = (1/6)·10·3,2034… = 5,3390… ≈ 5,34 mg/l`. -/
theorem naloga32_c :
    (∀ t, HasDerivAt (fun t => -2 * t * Real.exp (-0.5 * t) - 4 * Real.exp (-0.5 * t))
      (t * Real.exp (-0.5 * t)) t) ∧
      ∫ t in (0:ℝ)..6, t * Real.exp (-0.5 * t) = -16 * Real.exp (-3) + 4 ∧
      (3.2034:ℝ) ≤ -16 * Real.exp (-3) + 4 ∧ -16 * Real.exp (-3) + 4 < 3.2035 ∧
      1 / 6 * ∫ t in (0:ℝ)..6, c₃₂ t = 1 / 6 * 10 * (-16 * Real.exp (-3) + 4) ∧
      (5.3390:ℝ) ≤ 1 / 6 * 10 * (-16 * Real.exp (-3) + 4) ∧ 1 / 6 * 10 * (-16 * Real.exp (-3) + 4) < 5.3391 ∧
      |1 / 6 * 10 * (-16 * Real.exp (-3) + 4) - 5.34| ≤ 0.005 := by
  have hF : ∀ t, HasDerivAt (fun t => -2 * t * Real.exp (-0.5 * t) - 4 * Real.exp (-0.5 * t))
      (t * Real.exp (-0.5 * t)) t := by
    intro t
    have hE := ((hasDerivAt_id' t).const_mul (-0.5)).exp
    exact ((((hasDerivAt_id' t).const_mul (-2)).mul hE).sub (hE.const_mul 4)).congr_deriv (by ring)
  have hI : ∫ t in (0:ℝ)..6, t * Real.exp (-0.5 * t) = -16 * Real.exp (-3) + 4 := by
    rw [newton_leibniz _ _ 0 6 hF (by fun_prop)]
    norm_num
    ring
  have e1 := Real.exp_one_gt_d9
  have e2 := Real.exp_one_lt_d9
  have e3 : Real.exp (-3) = 1 / Real.exp 1 ^ 3 := by
    rw [Real.exp_neg, show (3:ℝ) = (3:ℕ) * 1 by norm_num, Real.exp_nat_mul, one_div]
  have ep : 0 < Real.exp 1 ^ 3 := by positivity
  have q1 : (20.0855369:ℝ) < Real.exp 1 ^ 3 := by nlinarith [pow_lt_pow_left₀ e1 (by norm_num) (show 3 ≠ 0 by norm_num)]
  have q2 : Real.exp 1 ^ 3 < 20.0855370 := by
    nlinarith [pow_lt_pow_left₀ e2 (Real.exp_pos 1).le (show 3 ≠ 0 by norm_num)]
  have m1 : 16 * Real.exp (-3) < 16 / 20.0855369 := by
    rw [e3]; rw [mul_one_div]; exact div_lt_div_of_pos_left (by norm_num) (by norm_num) q1
  have m2 : 16 / 20.0855370 < 16 * Real.exp (-3) := by
    rw [e3]; rw [mul_one_div]; exact div_lt_div_of_pos_left (by norm_num) ep q2
  have hc : ∫ t in (0:ℝ)..6, c₃₂ t = 10 * ∫ t in (0:ℝ)..6, t * Real.exp (-0.5 * t) := by
    rw [← intervalIntegral.integral_const_mul]
    congr 1; ext t; unfold c₃₂; ring
  refine ⟨hF, hI, by norm_num at m1 m2 ⊢; linarith, by norm_num at m1 m2 ⊢; linarith,
    by rw [hc, hI]; ring, by norm_num at m1 m2 ⊢; linarith, by norm_num at m1 m2 ⊢; linarith,
    blizu (by norm_num at m1 m2 ⊢; linarith) (by norm_num at m1 m2 ⊢; linarith)⟩

/-! ## Ustna vprašanja -/

/-- Ustno vprašanje 1: za `a > 0`, `a ≠ 1`, `x > 0` je `log_a x = y` ⇔ `aʸ = x`; potenca s pozitivno osnovo
je pozitivna, zato nobena potenca ni enaka `x ≤ 0`. -/
theorem ustno1 (a : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) :
    (∀ x y : ℝ, 0 < x → (Real.logb a x = y ↔ a ^ y = x)) ∧ (∀ y : ℝ, 0 < a ^ y) ∧
      ∀ x : ℝ, x ≤ 0 → ¬ ∃ y : ℝ, a ^ y = x :=
  ⟨fun x y hx => Real.logb_eq_iff_rpow_eq ha ha1 hx, fun y => Real.rpow_pos_of_pos ha y,
    fun x hx ⟨y, hy⟩ => by have := Real.rpow_pos_of_pos ha y; linarith⟩

/-- Predpostavke trditve `ustno1` se dajo izpolniti (`a = 2`). -/
example : (0:ℝ) < 2 ∧ (2:ℝ) ≠ 1 := by norm_num

/-- Ustno vprašanje 2 v splošni obliki: za polinoma `P`, `Q` je pri manjši stopnji števca
`P(x)/Q(x) → 0` (asimptota `y = 0`), pri enakih stopnjah `P(x)/Q(x) → a/b` (vodilna koeficienta), pri večji
stopnji števca pa `|P(x)/Q(x)| → ∞` (vodoravne asimptote ni); vse za `x → ∞` in `x → −∞`. -/
theorem ustno2 (P Q : Polynomial ℝ) :
    (P.degree < Q.degree → Tendsto (fun x => P.eval x / Q.eval x) atTop (𝓝 0) ∧
      Tendsto (fun x => P.eval x / Q.eval x) atBot (𝓝 0)) ∧
    (P.degree = Q.degree →
      Tendsto (fun x => P.eval x / Q.eval x) atTop (𝓝 (P.leadingCoeff / Q.leadingCoeff)) ∧
      Tendsto (fun x => P.eval x / Q.eval x) atBot (𝓝 (P.leadingCoeff / Q.leadingCoeff))) ∧
    (Q.degree < P.degree → Q ≠ 0 → Tendsto (fun x => |P.eval x / Q.eval x|) atTop atTop ∧
      Tendsto (fun x => |P.eval x / Q.eval x|) atBot atTop) :=
  ⟨fun h => ⟨Polynomial.div_tendsto_atTop_zero_of_degree_lt h,
      Polynomial.div_tendsto_atBot_zero_of_degree_lt h⟩,
    fun h => ⟨Polynomial.div_tendsto_atTop_leadingCoeff_div_of_degree_eq h,
      Polynomial.div_tendsto_atBot_leadingCoeff_div_of_degree_eq h⟩,
    fun h hQ => ⟨Polynomial.abs_div_tendsto_atTop_atTop_of_degree_gt h hQ,
      Polynomial.abs_div_tendsto_atBot_atTop_of_degree_gt h hQ⟩⟩

/-- Predpostavke trditve `ustno2` se dajo izpolniti: `P = 1`, `Q = X` (manjša stopnja), `P = Q = X`
(enaki stopnji), `P = X`, `Q = 1` (večja stopnja). -/
example : (1 : Polynomial ℝ).degree < (Polynomial.X : Polynomial ℝ).degree ∧
    (Polynomial.X : Polynomial ℝ).degree = (Polynomial.X : Polynomial ℝ).degree ∧
    (1 : Polynomial ℝ).degree < (Polynomial.X : Polynomial ℝ).degree ∧ (1 : Polynomial ℝ) ≠ 0 := by
  refine ⟨?_, rfl, ?_, one_ne_zero⟩ <;> simp [Polynomial.degree_X]

/-- Ustno vprašanje 3: istoležna člena `aᵢ + aₙ₋₁₋ᵢ = a₁ + aₙ`, zato `2Sₙ = n(a₁ + aₙ)`,
`Sₙ = n/2·(a₁ + aₙ) = n/2·(2a₁ + (n − 1)d)`. -/
theorem ustno3 (a₁ d : ℝ) (n : ℕ) :
    (∀ i : ℕ, i < n → (a₁ + i * d) + (a₁ + ((n - 1 - i : ℕ) : ℝ) * d) = a₁ + (a₁ + ((n:ℝ) - 1) * d)) ∧
      2 * ∑ i ∈ Finset.range n, (a₁ + i * d) = n * (a₁ + (a₁ + ((n:ℝ) - 1) * d)) ∧
      ∑ i ∈ Finset.range n, (a₁ + i * d) = n / 2 * (2 * a₁ + ((n:ℝ) - 1) * d) := by
  have hs : ∑ i ∈ Finset.range n, (a₁ + i * d) = n / 2 * (2 * a₁ + ((n:ℝ) - 1) * d) := by
    induction n with
    | zero => simp
    | succ n ih => rw [Finset.sum_range_succ, ih]; push_cast; ring
  refine ⟨fun i hi => ?_, by rw [hs]; ring, hs⟩
  rw [Nat.cast_sub (by omega), Nat.cast_sub (by omega)]
  push_cast; ring

/-! ## Drugače in Preveri se -/

/-- Drugače, korak za korakom: `40 + 20 = 60`; `90 − 5 − 10 = 75`; `75 : 60 = 1,25`; `40·1,25 = 50`,
`20·1,25 = 25`, `10·1,25 = 12,5`, dvojni čas `2·12,5 = 25`; Preveri se 2: `60 : 75 = 0,8` (točke na minuto). -/
theorem nacrt :
    40 + 20 = 60 ∧ 90 - 5 - 10 = 75 ∧ (75:ℝ) / 60 = 1.25 ∧ (40:ℝ) * 1.25 = 50 ∧ (20:ℝ) * 1.25 = 25 ∧
      (10:ℝ) * 1.25 = 12.5 ∧ (2:ℝ) * 12.5 = 25 ∧ (60:ℝ) / 75 = 0.8 := by norm_num

/-- Preveri se 3: pri `x ≠ 1` velja `(x² + 2x)/(x − 1) = 3/(x − 1)` natanko za `x = −3`
(`x² + 2x − 3 = (x − 1)(x + 3)`); pri `x = −3` sta obe strani `−3/4`. -/
theorem kviz3 :
    (∀ x : ℝ, x ^ 2 + 2 * x - 3 = (x - 1) * (x + 3)) ∧
      (∀ x : ℝ, (x ≠ 1 ∧ (x ^ 2 + 2 * x) / (x - 1) = 3 / (x - 1)) ↔ x = -3) ∧
      ((-3:ℝ) ^ 2 + 2 * (-3)) / (-3 - 1) = -3 / 4 ∧ (3:ℝ) / (-3 - 1) = -3 / 4 := by
  refine ⟨fun x => by ring, fun x => ⟨fun ⟨h1, h⟩ => ?_, ?_⟩, by norm_num, by norm_num⟩
  · have hd : x - 1 ≠ 0 := sub_ne_zero.mpr h1
    rw [div_eq_div_iff hd hd] at h
    have : (x - 1) * ((x - 1) * (x + 3)) = 0 := by linear_combination h
    rcases mul_eq_zero.mp this with h2 | h2
    · exact absurd h2 hd
    · rcases mul_eq_zero.mp h2 with h3 | h3
      · exact absurd h3 hd
      · linarith
  · rintro rfl; norm_num

/-- Preveri se 4: po pravilu minute in pol imata nalogi z `2` točkama `1,5·2 = 3` minute, nalogi s `3`
točkami `1,5·3 = 4,5`; prekoračitve so `0`, `9,5`, `−0,5`, `2` minute, največja pri nalogi 2; `14 > 3·4,5`,
dvojni čas `2·4,5 = 9`. -/
theorem kviz4 :
    (1.5:ℝ) * 2 = 3 ∧ (1.5:ℝ) * 3 = 4.5 ∧ (3:ℝ) - 3 = 0 ∧ (14:ℝ) - 4.5 = 9.5 ∧ (4:ℝ) - 4.5 = -0.5 ∧
      (5:ℝ) - 3 = 2 ∧ (14:ℝ) > 3 * 4.5 ∧ (2:ℝ) * 4.5 = 9 := by norm_num

/-- Preveri se 5: `3·2^(t/5) = 48` ⇔ `2^(t/5) = 16 = 2⁴` ⇔ `t/5 = 4` ⇔ `t = 20` dni. -/
theorem kviz5 :
    (∀ t : ℝ, 3 * (2:ℝ) ^ (t / 5) = 48 ↔ (2:ℝ) ^ (t / 5) = 16) ∧ (16:ℝ) = 2 ^ 4 ∧
      ∀ t : ℝ, 3 * (2:ℝ) ^ (t / 5) = 48 ↔ t = 20 := by
  have h1 : ∀ t : ℝ, 3 * (2:ℝ) ^ (t / 5) = 48 ↔ (2:ℝ) ^ (t / 5) = 16 := fun t => by
    constructor <;> intro h <;> linarith
  refine ⟨h1, by norm_num, fun t => ?_⟩
  rw [h1, show (16:ℝ) = 2 ^ ((4:ℕ):ℝ) by rw [rp]; norm_num]
  constructor
  · intro h
    have := (Real.rpow_right_inj (by norm_num : (0:ℝ) < 2) (by norm_num)).mp h
    push_cast at this
    linarith
  · rintro rfl; norm_num

end Evklid.Lekcije.MAT_SS_4.VadbenaMaturitetnaPola
