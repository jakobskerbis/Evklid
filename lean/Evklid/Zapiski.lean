/-
Testni zapiski priprave na test (test/fixtures/priprava/, pricakovano.json → »resitve«).
Vsaka trditev je zapisana tako kot v zapiskih; kjer zapiski računajo v več korakih, je vsak vmesni korak
svoja enakost v verigi `calc`, da Lean preveri tudi korake, ne samo končni rezultat.
-/
module

public import Mathlib

namespace Evklid.Zapiski

open intervalIntegral

/-- mat-integrali.md: ∫₀³ x² dx = 9 (pravilo za potenco, nato Newton-Leibniz). -/
theorem ploscina_x2 : ∫ x in (0:ℝ)..3, x ^ 2 = 9 := by
  calc ∫ x in (0:ℝ)..3, x ^ 2 = (3 ^ (2 + 1) - 0 ^ (2 + 1)) / (2 + 1) := integral_pow 2
    _ = 9 := by norm_num

/-- mat-integrali.md: ∫₀² (3x² − 2x) dx = [x³ − x²]₀² = 8 − 4 = 4, po korakih. -/
theorem primer_doloceni : ∫ x in (0:ℝ)..2, (3 * x ^ 2 - 2 * x) = 4 := by
  have h1 : IntervalIntegrable (fun x : ℝ => 3 * x ^ 2) MeasureTheory.volume 0 2 :=
    (continuous_const.mul (continuous_pow 2)).intervalIntegrable 0 2
  have h2 : IntervalIntegrable (fun x : ℝ => 2 * x) MeasureTheory.volume 0 2 :=
    (continuous_const.mul continuous_id).intervalIntegrable 0 2
  calc ∫ x in (0:ℝ)..2, (3 * x ^ 2 - 2 * x)
      = (∫ x in (0:ℝ)..2, 3 * x ^ 2) - ∫ x in (0:ℝ)..2, 2 * x := integral_sub h1 h2
    _ = 3 * (∫ x in (0:ℝ)..2, x ^ 2) - 2 * ∫ x in (0:ℝ)..2, x := by
        rw [integral_const_mul, integral_const_mul]
    _ = 3 * ((2 ^ 3 - 0 ^ 3) / 3) - 2 * ((2 ^ 2 - 0 ^ 2) / 2) := by
        rw [integral_pow, integral_id]; norm_num
    _ = 8 - 4 := by norm_num
    _ = 4 := by norm_num

/-- mat-integrali.md: det A za A = [[1, 2], [3, 4]] je 1·4 − 2·3 = −2. -/
theorem determinanta : Matrix.det !![(1:ℤ), 2; 3, 4] = -2 := by
  calc Matrix.det !![(1:ℤ), 2; 3, 4] = 1 * 4 - 2 * 3 := Matrix.det_fin_two_of 1 2 3 4
    _ = -2 := by norm_num

/-- mat-integrali.md: sistem 2x + y = 5, x − y = 1 ima natanko rešitev x = 2, y = 1. -/
theorem sistem (x y : ℝ) : (2 * x + y = 5 ∧ x - y = 1) ↔ (x = 2 ∧ y = 1) := by
  constructor
  · rintro ⟨h1, h2⟩
    -- korak: seštejemo enačbi → 3x = 6
    have h3 : 3 * x = 6 := by linarith
    have hx : x = 2 := by linarith
    exact ⟨hx, by linarith⟩
  · rintro ⟨rfl, rfl⟩
    norm_num

/-- mat-integrali.md: a₁ = 3, aₙ₊₁ = 2aₙ ⇒ a₄ = 24 (vsak člen posebej). -/
theorem zaporedje (a : ℕ → ℤ) (h1 : a 1 = 3) (h : ∀ n, a (n + 1) = 2 * a n) : a 4 = 24 := by
  have a2 : a 2 = 6 := by rw [h 1, h1]; norm_num
  have a3 : a 3 = 12 := by rw [h 2, a2]; norm_num
  rw [h 3, a3]; norm_num

/-- star-test.md, naloga 1: ∫₁² 2x dx = 3. -/
theorem test_naloga1 : ∫ x in (1:ℝ)..2, 2 * x = 3 := by
  calc ∫ x in (1:ℝ)..2, 2 * x = 2 * ((2 ^ 2 - 1 ^ 2) / 2) := by
        rw [integral_const_mul, integral_id]
    _ = 3 := by norm_num

/-- star-test.md, naloga 2: x + y = 4, x − y = 2 ⇒ x = 3, y = 1. -/
theorem test_naloga2 (x y : ℝ) (h1 : x + y = 4) (h2 : x - y = 2) : x = 3 ∧ y = 1 := by
  constructor <;> linarith

/-- napad.md: kateti 3 cm in 4 cm ⇒ hipotenuza 5 cm (c² = a² + b², c > 0). -/
theorem hipotenuza (c : ℝ) (hc : 0 < c) (h : c ^ 2 = 3 ^ 2 + 4 ^ 2) : c = 5 := by
  nlinarith [sq_nonneg (c - 5), sq_nonneg (c + 5)]

/-- fiz-elektricno-polje.md: E = F/q = 0,01 N / (2·10⁻⁶ C) = 5000 N/C. -/
theorem jakost_polja : (0.01 : ℝ) / (2 * 10 ^ (-6 : ℤ)) = 5000 := by
  norm_num

/-- nasprotje-a.md proti nasprotje-b.md: ½mv² in mv² sta za m, v ≠ 0 različna, zato je neskladje pravo. -/
theorem neskladje_kineticna (m v : ℝ) (hm : m ≠ 0) (hv : v ≠ 0) : (1 / 2) * m * v ^ 2 ≠ m * v ^ 2 := by
  intro h
  have : m * v ^ 2 = 0 := by linarith
  rcases mul_eq_zero.mp this with h0 | h0
  · exact hm h0
  · exact hv (pow_eq_zero_iff (by norm_num) |>.mp h0)

end Evklid.Zapiski
