/-
vir: content/lessons/MAT-OS-7/vrste-stirikotnikov.md
sha256: 69186efd4c16cf212ee0c30db6351a3e3cd3a267b3e1e4dd5edd85acf0047aea
Model: oglišča A, B, C, D so točke realnega prostora s skalarnim produktom V (ravnina je poseben primer; primeri,
ki pokažejo, da se predpostavke dajo izpolniti, so v ravnini ℂ). Notranji koti so neorientirani koti Mathliba v
radianih: α = ∠DAB, β = ∠ABC, γ = ∠BCD, δ = ∠CDA; θ° je θ · π/180. Liki so definirani z vektorji (stranice
a = |AB|, …, diagonali e = |AC|, f = |BD|):
paralelogram: B − A = C − D; trapez z osnovnicama AB in CD: C − D = k · (B − A) za neki k > 0 (paralelogram je
k = 1); enakokraki trapez: še |AD| = |BC| in k ≠ 1 (kraka nista vzporedna; pri k = 1 bi bil lik paralelogram);
pravokotni trapez: krak AD je pravokoten na osnovnico; romb: paralelogram z |AB| = |AD|; pravokotnik: paralelogram
s pravim kotom α; kvadrat: pravokotnik in romb; deltoid: |AB| = |AD| in |CB| = |CD|.
Lean: kot pri izrojenem oglišču (ničelni vektor) je v Mathlibu π/2; zato imajo trditve, ki to potrebujejo, pogoja
B ≠ A, C ≠ A. Računi s stopinjami v primerih, kjer lekcija uporabi vsoto kotov 360° (Primer 2, Preveri se 2), so
dokazani s to vsoto kot predpostavko.
Ni v Leanu: zgodovina (Herodot, Evklid, beseda trapez), risbe, simulacija, analogiji (rodbina, naslovi) in zgodbe
(trg, regata, parcela, kolesarska pot) kot besedilo; oznake in »oglišča v nasprotni smeri urnega kazalca«
(dogovor); vsota notranjih kotov 360° v SPLOŠNEM štirikotniku z razrezom po diagonali (zahtevno, še ni dokazano;
dokazana je za vsak trapez in zato vsak paralelogram); da deltoidova os simetrije AC razpolavlja diagonalo BD
in prezrcali B v D (zahtevno, še ni dokazano; dokazani so pravokotnost diagonal, β = δ in razpolavljanje kotov
pri A in C); »deltoid v splošnem nima vzporednih stranic« je dokazan s primerom deltoida brez vzporednih stranic;
v Pogostih napakah 3 in 4 »kota ob isti osnovnici v splošnem trapezu nista enaka« in »v deltoidu v splošnem
α ≠ γ« (ni dokazano s primerom; dokazana so pravila α + δ = β + γ = 180°, α = β v enakokrakem trapezu in β = δ);
Pogoste napake 5 je dokazana z ekvivalencama (paralelogram ima enaki diagonali natanko kot pravokotnik in
pravokotni natanko kot romb), ne s posebnim primerom; »okvir
vrat«: da je lik z enakimi nasprotnimi stranicami paralelogram (zahtevno, še ni dokazano; dokazano je, da je
paralelogram z enakima diagonalama pravokotnik in obratno); škarjasto dvigalo, zmaj, znak, nasip, parkirna mesta
kot opisi (dokazane so ustrezne lastnosti likov); vrstni red korakov v Preveri se 5 (dokazani so koraki in
rezultat); besedilo napačnih odgovorov v Preveri se (dokazane so napačne vrednosti, ki jih razlaga navaja).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.VrsteStirikotnikov

open InnerProductGeometry Real
open scoped EuclideanGeometry

variable {V : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V]

/-! ## Definicije likov -/

/-- Paralelogram ABCD: AB⃗ = DC⃗ (dva para vzporednih stranic). -/
def paralelogram (A B C D : V) : Prop := B - A = C - D

/-- Trapez z osnovnicama AB in CD: DC⃗ je pozitiven večkratnik AB⃗. -/
def trapez (A B C D : V) : Prop := ∃ k : ℝ, 0 < k ∧ C - D = k • (B - A)

/-- Romb: paralelogram s štirimi enako dolgimi stranicami (|AB| = |AD|). -/
def romb (A B C D : V) : Prop := paralelogram A B C D ∧ dist A B = dist A D

/-- Pravokotnik: paralelogram s pravim kotom pri A. -/
def pravokotnik (A B C D : V) : Prop := paralelogram A B C D ∧ ∠ D A B = π / 2

/-- Kvadrat: hkrati pravokotnik in romb. -/
def kvadrat (A B C D : V) : Prop := pravokotnik A B C D ∧ romb A B C D

/-- Deltoid: dva para enako dolgih sosednjih stranic, |AB| = |AD| in |CB| = |CD|. -/
def deltoid (A B C D : V) : Prop := dist A B = dist A D ∧ dist C B = dist C D

/-! ## Pomožne trditve -/

/-- Pomožno: kot ∠ABC je kot med vektorjema A − B in C − B. -/
theorem kot (A B C : V) : ∠ A B C = angle (A - B) (C - B) := rfl

/-- Pomožno (izrek sss za kote): če se ujemajo dolžine x, y in x − y, se ujema kot med x in y. -/
theorem sss (x y x' y' : V) (hx : ‖x‖ = ‖x'‖) (hy : ‖y‖ = ‖y'‖) (hxy : ‖x - y‖ = ‖x' - y'‖) :
    angle x y = angle x' y' := by
  have h1 := norm_sub_sq_real x y
  have h2 := norm_sub_sq_real x' y'
  have hi : inner ℝ x y = inner ℝ x' y' := by rw [hxy, hx, hy] at h1; linarith
  unfold InnerProductGeometry.angle; rw [hi, hx, hy]

/-- Predpostavke `sss` se dajo izpolniti (x = x', y = y'). -/
example : ‖(1:ℂ)‖ = ‖(1:ℂ)‖ ∧ ‖Complex.I‖ = ‖Complex.I‖ ∧ ‖(1:ℂ) - Complex.I‖ = ‖(1:ℂ) - Complex.I‖ :=
  ⟨rfl, rfl, rfl⟩

/-- Pomožno: ‖a + c·b‖² = ‖a‖² + 2c⟨a, b⟩ + c²‖b‖². -/
theorem norma_sq (a b : V) (c : ℝ) :
    ‖a + c • b‖ ^ 2 = ‖a‖ ^ 2 + 2 * c * inner ℝ a b + c ^ 2 * ‖b‖ ^ 2 := by
  rw [norm_add_sq_real, real_inner_smul_right, norm_smul, mul_pow, Real.norm_eq_abs, sq_abs]; ring

/-- Pomožno: ⟨x + y, x − y⟩ = ‖x‖² − ‖y‖². -/
theorem inner_vsota_razlika (x y : V) : inner ℝ (x + y) (x - y) = ‖x‖ ^ 2 - ‖y‖ ^ 2 := by
  rw [inner_add_left, inner_sub_right, inner_sub_right, real_inner_self_eq_norm_sq, real_inner_self_eq_norm_sq,
    real_inner_comm x y]
  ring

/-! ## Paralelogram -/

omit [InnerProductSpace ℝ V] in
/-- Razlaga, Povzetek, tabela: v paralelogramu sta nasprotni stranici enako dolgi (|AB| = |DC|, |BC| = |AD|). -/
theorem par_stranice (A B C D : V) (h : paralelogram A B C D) : dist A B = dist D C ∧ dist B C = dist A D := by
  unfold paralelogram at h
  have hC : C = B - A + D := by rw [h]; abel
  subst hC
  rw [dist_eq_norm, dist_eq_norm, dist_eq_norm, dist_eq_norm]
  constructor
  · rw [show D - (B - A + D) = -(B - A) by abel, norm_neg, norm_sub_rev]
  · rw [show B - (B - A + D) = -(D - A) by abel, norm_neg, norm_sub_rev]

/-- Predpostavka paralelograma se da izpolniti (A = 0, B = 1, C = 3 + i, D = 2 + i v ℂ). -/
example : paralelogram (0:ℂ) 1 (3 + Complex.I) (2 + Complex.I) := by unfold paralelogram; ring

/-- Razlaga, Povzetek, tabela: diagonali paralelograma se razpolavljata (sredina AC je sredina BD). -/
theorem par_diagonali (A B C D : V) (h : paralelogram A B C D) : midpoint ℝ A C = midpoint ℝ B D := by
  unfold paralelogram at h
  have hC : C = B - A + D := by rw [h]; abel
  subst hC
  rw [midpoint_eq_smul_add, midpoint_eq_smul_add]
  congr 1; abel

/-- Razlaga, Povzetek, tabela: v paralelogramu sta nasprotna kota enaka (α = γ, β = δ), sosednja kota skupaj
merita 180° (α + β = π). -/
theorem par_koti (A B C D : V) (h : paralelogram A B C D) :
    ∠ D A B = ∠ B C D ∧ ∠ A B C = ∠ C D A ∧ ∠ D A B + ∠ A B C = π := by
  unfold paralelogram at h
  have hC : C = B - A + D := by rw [h]; abel
  subst hC
  simp only [kot]
  rw [show B - (B - A + D) = -(D - A) by abel, show D - (B - A + D) = -(B - A) by abel,
    show A - B = -(B - A) by abel, show B - A + D - B = D - A by abel,
    show B - A + D - D = B - A by abel, show A - D = -(D - A) by abel,
    angle_neg_neg, angle_neg_left, angle_neg_right, angle_comm (D - A) (B - A)]
  exact ⟨rfl, rfl, by ring⟩

/-- Razlaga (oznake), Povzetek: v paralelogramu je α + β + γ + δ = 360° (2π). -/
theorem par_vsota (A B C D : V) (h : paralelogram A B C D) : ∠ D A B + ∠ A B C + ∠ B C D + ∠ C D A = 2 * π := by
  obtain ⟨h1, h2, h3⟩ := par_koti A B C D h
  linarith

/-- Razlaga, premisli: v paralelogramu s kotom 70° merijo drugi trije koti 110°, 70° in 110°. -/
theorem premisli_70 (A B C D : V) (h : paralelogram A B C D) (hα : ∠ D A B = 70 * π / 180) :
    ∠ A B C = 110 * π / 180 ∧ ∠ B C D = 70 * π / 180 ∧ ∠ C D A = 110 * π / 180 ∧ (180:ℝ) - 70 = 110 := by
  obtain ⟨h1, h2, h3⟩ := par_koti A B C D h
  refine ⟨by linarith, by linarith, by linarith, by norm_num⟩

/-- Pomožno: v ℂ je kot med e^{it} in pozitivnim realnim b natanko t (0 ≤ t ≤ π). -/
theorem kot_exp (t b : ℝ) (hb : 0 < b) (h0 : 0 ≤ t) (hπ : t ≤ π) :
    ∠ (Complex.exp (t * Complex.I)) (0:ℂ) (b:ℂ) = t := by
  rw [kot, sub_zero, sub_zero, show (b:ℂ) = b • (1:ℂ) by rw [Complex.real_smul, mul_one],
    angle_smul_right_of_pos _ _ hb]
  unfold InnerProductGeometry.angle
  rw [Complex.norm_exp_ofReal_mul_I, norm_one, mul_one, div_one, Complex.inner, one_mul, Complex.conj_re,
    Complex.exp_ofReal_mul_I_re]
  exact Real.arccos_cos h0 hπ

/-- Predpostavke `kot_exp` se dajo izpolniti (b = 1, t = π/2). -/
example : (0:ℝ) < 1 ∧ (0:ℝ) ≤ π / 2 ∧ π / 2 ≤ π := ⟨one_pos, by positivity, by linarith [Real.pi_pos]⟩

/-- Pomožno: za vsak kot t ∈ [0, π] obstaja paralelogram (v ℂ: A = 0, B = 1, D = e^{it}, C = 1 + e^{it}) s kotom
t pri A. -/
theorem par_obstaja (t : ℝ) (h0 : 0 ≤ t) (hπ : t ≤ π) :
    paralelogram (0:ℂ) 1 (1 + Complex.exp (t * Complex.I)) (Complex.exp (t * Complex.I)) ∧
    ∠ (Complex.exp (t * Complex.I)) (0:ℂ) 1 = t := by
  refine ⟨by unfold paralelogram; ring, ?_⟩
  have := kot_exp t 1 one_pos h0 hπ
  rwa [Complex.ofReal_one] at this

/-- Predpostavke `par_obstaja` se dajo izpolniti (t = π/2). -/
example : (0:ℝ) ≤ π / 2 ∧ π / 2 ≤ π := ⟨by positivity, by linarith [Real.pi_pos]⟩

/-- Predpostavke `premisli_70` se dajo izpolniti (paralelogram v ℂ s kotom 70° pri A). -/
example : ∃ A B C D : ℂ, paralelogram A B C D ∧ ∠ D A B = 70 * π / 180 :=
  ⟨_, _, _, _, par_obstaja (70 * π / 180) (by positivity) (by linarith [Real.pi_pos])⟩

/-! ## Trapez -/

/-- Paralelogram je poseben trapez (k = 1). -/
theorem par_je_trapez (A B C D : V) (h : paralelogram A B C D) : trapez A B C D :=
  ⟨1, one_pos, by rw [one_smul]; exact h.symm⟩

/-- Razlaga (trapez), Povzetek, tabela, Pogoste napake 3: kota ob istem kraku se dopolnjujeta do 180°:
α + δ = π in β + γ = π; zato je vsota vseh štirih 2π. -/
theorem trapez_koti (A B C D : V) (h : trapez A B C D) :
    ∠ D A B + ∠ C D A = π ∧ ∠ A B C + ∠ B C D = π ∧
    ∠ D A B + ∠ A B C + ∠ B C D + ∠ C D A = 2 * π := by
  obtain ⟨k, hk, h⟩ := h
  have e1 : ∠ D A B + ∠ C D A = π := by
    rw [kot, kot, h, show A - D = -(D - A) by abel, angle_smul_left_of_pos _ _ hk, angle_neg_right,
      angle_comm]
    ring
  have e2 : ∠ A B C + ∠ B C D = π := by
    rw [kot, kot, show A - B = -(B - A) by abel, show B - C = -(C - B) by abel,
      show D - C = -(C - D) by abel, h, angle_neg_neg, angle_smul_right_of_pos _ _ hk, angle_neg_left,
      angle_comm (C - B)]
    ring
  exact ⟨e1, e2, by linarith⟩

/-- Predpostavka trapeza se da izpolniti (A = 0, B = 4, C = 3 + i, D = 1 + i, k = 1/2). -/
example : trapez (0:ℂ) 4 (3 + Complex.I) (1 + Complex.I) :=
  ⟨1 / 2, by norm_num, by rw [Complex.real_smul]; push_cast; ring⟩

/-- Razlaga (pravokotni trapez): če je krak AD pravokoten na osnovnico AB, ima trapez dva prava kota (α = δ = π/2). -/
theorem pravokotni_trapez (A B C D : V) (h : trapez A B C D) (hp : inner ℝ (B - A) (D - A) = 0) :
    ∠ D A B = π / 2 ∧ ∠ C D A = π / 2 := by
  have hα : ∠ D A B = π / 2 := by
    rw [kot, angle_comm]; exact (inner_eq_zero_iff_angle_eq_pi_div_two _ _).mp hp
  exact ⟨hα, by linarith [(trapez_koti A B C D h).1]⟩

/-- Predpostavki `pravokotni_trapez` se dajo izpolniti (A = 0, B = 2, C = 1 + i, D = i). -/
example : trapez (0:ℂ) 2 (1 + Complex.I) Complex.I ∧ inner ℝ ((2:ℂ) - 0) (Complex.I - 0) = 0 := by
  refine ⟨⟨1 / 2, by norm_num, by rw [Complex.real_smul]; push_cast; ring⟩, ?_⟩
  rw [Complex.inner]; simp

/-- Razlaga (enakokraki trapez), Povzetek, tabela: v enakokrakem trapezu (|AD| = |BC|, kraka nevzporedna, k ≠ 1)
sta kota ob isti osnovnici enaka (α = β, γ = δ) in diagonali sta enako dolgi (e = f). -/
theorem enakokraki_trapez (A B C D : V) (k : ℝ) (hk : 0 < k) (hk1 : k ≠ 1) (h : C - D = k • (B - A))
    (hkr : dist A D = dist B C) :
    ∠ D A B = ∠ A B C ∧ ∠ B C D = ∠ C D A ∧ dist A C = dist B D := by
  have hsum := trapez_koti A B C D ⟨k, hk, h⟩
  have hC : C = k • (B - A) + D := by rw [← h]; abel
  subst hC
  set u := B - A with hu
  set v := D - A with hv
  have ew : k • u + D - B = v + (k - 1) • u := by rw [sub_smul, one_smul, hu, hv]; abel
  have hkr' : ‖v‖ = ‖v + (k - 1) • u‖ := by
    rw [dist_eq_norm, dist_eq_norm, norm_sub_rev, norm_sub_rev B, ew] at hkr; exact hkr
  have hsq : ‖v + (k - 1) • u‖ ^ 2 = ‖v‖ ^ 2 + 2 * (k - 1) * inner ℝ v u + (k - 1) ^ 2 * ‖u‖ ^ 2 :=
    norma_sq v u (k - 1)
  have key : 2 * inner ℝ v u + (k - 1) * ‖u‖ ^ 2 = 0 := by
    have h0 : (k - 1) * (2 * inner ℝ v u + (k - 1) * ‖u‖ ^ 2) = 0 := by
      rw [← hkr'] at hsq; linarith
    rcases mul_eq_zero.mp h0 with h0 | h0
    · exact absurd (by linarith : k = 1) hk1
    · exact h0
  have hαβ : ∠ D A B = ∠ A B (k • u + D) := by
    rw [kot, kot, show A - B = -u by rw [hu]; abel, ew]
    unfold InnerProductGeometry.angle
    rw [← hkr', norm_neg, inner_neg_left, inner_add_right, real_inner_smul_right,
      real_inner_self_eq_norm_sq, real_inner_comm u v]
    congr 1
    rw [mul_comm ‖u‖ ‖v‖]
    congr 1
    linarith [real_inner_comm u v]
  refine ⟨hαβ, by linarith [hsum.1, hsum.2.1], ?_⟩
  rw [dist_eq_norm, dist_eq_norm, norm_sub_rev, show k • u + D - A = v + k • u by rw [hv]; abel,
    norm_sub_rev, show D - B = v + (-1:ℝ) • u by rw [neg_one_smul, hu, hv]; abel]
  rw [← sq_eq_sq₀ (norm_nonneg _) (norm_nonneg _), norma_sq, norma_sq]
  nlinarith [key]

/-- Predpostavke `enakokraki_trapez` se dajo izpolniti (A = 0, B = 4, C = 3 + i, D = 1 + i, k = 1/2). -/
example : (0:ℝ) < 1 / 2 ∧ (1 / 2 : ℝ) ≠ 1 ∧ (3 + Complex.I) - (1 + Complex.I) = (1 / 2 : ℝ) • ((4:ℂ) - 0) ∧
    dist (0:ℂ) (1 + Complex.I) = dist (4:ℂ) (3 + Complex.I) := by
  refine ⟨by norm_num, by norm_num, by rw [Complex.real_smul]; push_cast; ring, ?_⟩
  rw [Complex.dist_eq, Complex.dist_eq,
    show (0:ℂ) - (1 + Complex.I) = ((-1:ℝ):ℂ) + ((-1:ℝ):ℂ) * Complex.I by push_cast; ring,
    show (4:ℂ) - (3 + Complex.I) = ((1:ℝ):ℂ) + ((-1:ℝ):ℂ) * Complex.I by push_cast; ring,
    Complex.norm_add_mul_I, Complex.norm_add_mul_I]
  norm_num

/-- Pomožno: za vsak kot t, 0 < t < π/2, obstaja enakokraki trapez (v ℂ: A = 0, B = 4, D = e^{it},
C = 4 − cos t + i·sin t) s kotom t pri A. -/
theorem enakokraki_obstaja (t : ℝ) (h0 : 0 < t) (h1 : t < π / 2) :
    ∃ C D : ℂ, ∃ k : ℝ, 0 < k ∧ k ≠ 1 ∧ C - D = k • ((4:ℂ) - 0) ∧ dist (0:ℂ) D = dist (4:ℂ) C ∧
      ∠ D (0:ℂ) 4 = t := by
  have hc : 0 < Real.cos t := Real.cos_pos_of_mem_Ioo ⟨by linarith [Real.pi_pos], h1⟩
  refine ⟨((4 - Real.cos t : ℝ) : ℂ) + (Real.sin t : ℂ) * Complex.I, Complex.exp (t * Complex.I),
    (4 - 2 * Real.cos t) / 4, div_pos (by linarith [Real.cos_le_one t]) (by norm_num), ?_, ?_, ?_, ?_⟩
  · intro e; linarith
  · rw [Complex.exp_mul_I, ← Complex.ofReal_cos, ← Complex.ofReal_sin, Complex.real_smul]; push_cast; ring
  · rw [Complex.dist_eq, Complex.dist_eq, zero_sub, norm_neg, Complex.norm_exp_ofReal_mul_I,
      show (4:ℂ) - (((4 - Real.cos t : ℝ) : ℂ) + (Real.sin t : ℂ) * Complex.I) =
        ((Real.cos t : ℝ) : ℂ) + ((-Real.sin t : ℝ) : ℂ) * Complex.I by push_cast; ring,
      Complex.norm_add_mul_I, neg_sq, Real.cos_sq_add_sin_sq, Real.sqrt_one]
  · have := kot_exp t 4 (by norm_num) h0.le (by linarith [Real.pi_pos])
    rwa [show ((4:ℝ):ℂ) = 4 by norm_num] at this

/-- Predpostavki `enakokraki_obstaja` se dajo izpolniti (t = π/4). -/
example : (0:ℝ) < π / 4 ∧ π / 4 < π / 2 := ⟨by positivity, by linarith [Real.pi_pos]⟩

/-! ## Pravokotnik, romb, kvadrat -/

/-- Razlaga, Povzetek, tabela, Iz vsakdanjega življenja (okvir vrat): paralelogram ima pravi kot natanko tedaj,
ko sta diagonali enako dolgi (e = f); takrat so vsi štirje koti pravi. -/
theorem pravokotnik_diagonali (A B C D : V) (h : paralelogram A B C D) :
    (∠ D A B = π / 2 ↔ dist A C = dist B D) ∧
    (∠ D A B = π / 2 → ∠ A B C = π / 2 ∧ ∠ B C D = π / 2 ∧ ∠ C D A = π / 2) := by
  have hk := par_koti A B C D h
  unfold paralelogram at h
  have hC : C = B - A + D := by rw [h]; abel
  refine ⟨?_, fun hα => ⟨by linarith [hk.2.2], by linarith [hk.1], by linarith [hk.2.1, hk.2.2]⟩⟩
  rw [kot, dist_eq_norm, dist_eq_norm, norm_sub_rev A, norm_sub_rev B, hC,
    show B - A + D - A = (D - A) + (B - A) by abel, show D - B = (D - A) - (B - A) by abel,
    norm_add_eq_norm_sub_iff_angle_eq_pi_div_two]

/-- Razlaga (romb), Povzetek, tabela, Preveri se 3: v rombu so vse štiri stranice enako dolge; paralelogram ima
pravokotni diagonali natanko tedaj, ko je romb. -/
theorem romb_diagonali (A B C D : V) (h : paralelogram A B C D) :
    (dist A B = dist A D ↔ inner ℝ (C - A) (D - B) = 0) ∧
    (dist A B = dist A D → dist A B = dist B C ∧ dist B C = dist C D ∧ dist C D = dist D A) := by
  have hs := par_stranice A B C D h
  unfold paralelogram at h
  have hC : C = B - A + D := by rw [h]; abel
  refine ⟨?_, fun hr => ⟨by rw [hr, hs.2], by rw [hs.2, ← hr, hs.1, dist_comm], by
    rw [dist_comm C D, ← hs.1, hr, dist_comm]⟩⟩
  rw [hC, show B - A + D - A = (D - A) + (B - A) by abel, show D - B = (D - A) - (B - A) by abel,
    inner_vsota_razlika, dist_eq_norm, dist_eq_norm, norm_sub_rev A, norm_sub_rev A]
  constructor
  · intro e; rw [e]; ring
  · intro e
    have : ‖B - A‖ ^ 2 = ‖D - A‖ ^ 2 := by linarith
    exact (sq_eq_sq₀ (norm_nonneg _) (norm_nonneg _)).mp this

/-! ## Deltoid -/

/-- Razlaga (deltoid), premisli, Povzetek, tabela, Primer 2, Pogoste napake 4: v deltoidu z |AB| = |AD|,
|CB| = |CD| je β = δ (trikotnika ABC in ADC sta skladna po sss), diagonala AC razpolavlja kota pri A in C, in
diagonali sta pravokotni. -/
theorem deltoid_lastnosti (A B C D : V) (h : deltoid A B C D) :
    ∠ A B C = ∠ C D A ∧ ∠ B A C = ∠ D A C ∧ ∠ B C A = ∠ D C A ∧ inner ℝ (C - A) (D - B) = 0 := by
  obtain ⟨h1, h2⟩ := h
  rw [dist_eq_norm, dist_eq_norm] at h1 h2
  refine ⟨?_, ?_, ?_, ?_⟩
  · rw [kot, kot, angle_comm (C - D)]
    exact sss _ _ _ _ h1 h2 (by rw [show A - B - (C - B) = A - C by abel, show A - D - (C - D) = A - C by abel])
  · rw [kot, kot]
    refine sss _ _ _ _ (by rw [norm_sub_rev, h1, norm_sub_rev]) rfl ?_
    rw [show B - A - (C - A) = -(C - B) by abel, show D - A - (C - A) = -(C - D) by abel, norm_neg, norm_neg, h2]
  · rw [kot, kot]
    refine sss _ _ _ _ (by rw [norm_sub_rev, h2, norm_sub_rev]) rfl ?_
    rw [show B - C - (A - C) = -(A - B) by abel, show D - C - (A - C) = -(A - D) by abel, norm_neg, norm_neg, h1]
  · have e1 : C - B = (C - A) + (A - B) := by abel
    have e2 : C - D = (C - A) + (A - D) := by abel
    rw [e1, e2] at h2
    have s1 := norm_add_sq_real (C - A) (A - B)
    have s2 := norm_add_sq_real (C - A) (A - D)
    rw [h2, h1] at s1
    rw [show D - B = (A - B) - (A - D) by abel, inner_sub_right]
    linarith

/-- Predpostavka deltoida se da izpolniti (A = −2, B = −i, C = 1, D = i). -/
example : deltoid (-2:ℂ) (-Complex.I) 1 Complex.I := by
  unfold deltoid
  rw [Complex.dist_eq, Complex.dist_eq, Complex.dist_eq, Complex.dist_eq,
    show (-2:ℂ) - -Complex.I = ((-2:ℝ):ℂ) + ((1:ℝ):ℂ) * Complex.I by push_cast; ring,
    show (-2:ℂ) - Complex.I = ((-2:ℝ):ℂ) + ((-1:ℝ):ℂ) * Complex.I by push_cast; ring,
    show (1:ℂ) - -Complex.I = ((1:ℝ):ℂ) + ((1:ℝ):ℂ) * Complex.I by push_cast; ring,
    show (1:ℂ) - Complex.I = ((1:ℝ):ℂ) + ((-1:ℝ):ℂ) * Complex.I by push_cast; ring]
  simp only [Complex.norm_add_mul_I]
  norm_num

/-- Preveri se 1: deltoid v splošnem nima vzporednih stranic: deltoid A = −2, B = −i, C = 1, D = i nima ne
AB ∥ CD ne AD ∥ BC (zato ni paralelogram). -/
theorem deltoid_brez_vzporednih :
    (¬ ∃ k : ℝ, (1:ℂ) - Complex.I = k • (-Complex.I - (-2))) ∧
    (¬ ∃ k : ℝ, Complex.I - (-2:ℂ) = k • ((1:ℂ) - (-Complex.I))) := by
  constructor
  · rintro ⟨k, hk⟩
    rw [Complex.real_smul, Complex.ext_iff] at hk
    simp at hk
    obtain ⟨h1, h2⟩ := hk
    linarith
  · rintro ⟨k, hk⟩
    rw [Complex.real_smul, Complex.ext_iff] at hk
    simp at hk
    obtain ⟨h1, h2⟩ := hk
    linarith

/-! ## Družina likov -/

/-- Razlaga (družina), Povzetek, Z analogijo, Pogoste napake 2, Iz vsakdanjega življenja: kvadrat je pravokotnik
in romb; romb je paralelogram in deltoid; paralelogram je trapez; paralelogram, ki je deltoid, je romb. -/
theorem druzina (A B C D : V) :
    (kvadrat A B C D → pravokotnik A B C D ∧ romb A B C D) ∧
    (romb A B C D → paralelogram A B C D ∧ deltoid A B C D) ∧
    (paralelogram A B C D → trapez A B C D) ∧
    (paralelogram A B C D → deltoid A B C D → romb A B C D) := by
  refine ⟨id, fun ⟨hp, hr⟩ => ⟨hp, hr, ?_⟩, par_je_trapez A B C D, fun hp hd => ⟨hp, hd.1⟩⟩
  have hs := par_stranice A B C D hp
  rw [dist_comm C B, hs.2, dist_comm C D, ← hs.1, hr]

/-- Razlaga (družina), Z analogijo: »vsak romb je kvadrat« ne velja: romb A = 0, B = 5, C = 8 + 4i, D = 3 + 4i
nima pravega kota. -/
theorem romb_ni_kvadrat : romb (0:ℂ) 5 (8 + 4 * Complex.I) (3 + 4 * Complex.I) ∧
    ¬ kvadrat (0:ℂ) 5 (8 + 4 * Complex.I) (3 + 4 * Complex.I) := by
  have hr : romb (0:ℂ) 5 (8 + 4 * Complex.I) (3 + 4 * Complex.I) := by
    refine ⟨by unfold paralelogram; ring, ?_⟩
    rw [Complex.dist_eq, Complex.dist_eq,
      show (0:ℂ) - 5 = ((-5:ℝ):ℂ) + ((0:ℝ):ℂ) * Complex.I by push_cast; ring,
      show (0:ℂ) - (3 + 4 * Complex.I) = ((-3:ℝ):ℂ) + ((-4:ℝ):ℂ) * Complex.I by push_cast; ring,
      Complex.norm_add_mul_I, Complex.norm_add_mul_I]
    norm_num
  refine ⟨hr, fun ⟨⟨_, hα⟩, _⟩ => ?_⟩
  rw [kot, ← inner_eq_zero_iff_angle_eq_pi_div_two, Complex.inner] at hα
  simp at hα

/-- Razlaga (romb), Povzetek: diagonali romba razpolavljata vse štiri notranje kote (AC kota pri A in C, BD kota
pri B in D), ker je romb deltoid glede na obe diagonali. -/
theorem romb_razpolavlja (A B C D : V) (h : romb A B C D) :
    ∠ B A C = ∠ D A C ∧ ∠ B C A = ∠ D C A ∧ ∠ C B D = ∠ A B D ∧ ∠ C D B = ∠ A D B := by
  obtain ⟨hp, hr⟩ := h
  have hs := (romb_diagonali A B C D hp).2 hr
  have hd1 := (druzina A B C D).2.1 ⟨hp, hr⟩
  have hd2 : deltoid B C D A :=
    ⟨by rw [← hs.1, dist_comm], by rw [dist_comm D C, hs.2.2]⟩
  have k1 := deltoid_lastnosti A B C D hd1.2
  have k2 := deltoid_lastnosti B C D A hd2
  exact ⟨k1.2.1, k1.2.2.1, k2.2.1, k2.2.2.1⟩

/-- Predpostavka `romb_razpolavlja` se da izpolniti (`romb_ni_kvadrat`: romb A = 0, B = 5, C = 8 + 4i,
D = 3 + 4i). -/
example : romb (0:ℂ) 5 (8 + 4 * Complex.I) (3 + 4 * Complex.I) := romb_ni_kvadrat.1

/-- Razlaga (romb), Povzetek, Primer 4: diagonala AC romba razpolavlja kot α in α = 2 · ∠BAC (B ≠ A, C ≠ A). -/
theorem romb_kot (A B C D : V) (h : romb A B C D) (hB : B ≠ A) (hCA : C ≠ A) :
    ∠ B A C = ∠ C A D ∧ ∠ D A B = 2 * ∠ B A C := by
  obtain ⟨hp, hr⟩ := h
  have hd := (druzina A B C D).2.1 ⟨hp, hr⟩
  refine ⟨by rw [(deltoid_lastnosti A B C D hd.2).2.1, EuclideanGeometry.angle_comm], ?_⟩
  unfold paralelogram at hp
  have hC : C = B - A + D := by rw [hp]; abel
  subst hC
  set u := B - A with hu
  set v := D - A with hv
  have hn : ‖u‖ = ‖v‖ := by rw [dist_eq_norm, dist_eq_norm, norm_sub_rev, norm_sub_rev A] at hr; exact hr
  have hu0 : u ≠ 0 := sub_ne_zero.mpr hB
  have hs0 : u + v ≠ 0 := by
    rw [hu, hv, show B - A + (D - A) = B - A + D - A by abel]; exact sub_ne_zero.mpr hCA
  have hr0 : 0 < ‖u‖ := norm_pos_iff.mpr hu0
  have hsn : 0 < ‖u + v‖ := norm_pos_iff.mpr hs0
  rw [kot, kot, show B - A + D - A = u + v by rw [hu, hv]; abel, angle_comm]
  have hs2 : ‖u + v‖ ^ 2 = 2 * ‖u‖ ^ 2 + 2 * inner ℝ u v := by rw [norm_add_sq_real, ← hn]; ring
  have hi : inner ℝ u (u + v) = ‖u‖ ^ 2 + inner ℝ u v := by rw [inner_add_right, real_inner_self_eq_norm_sq]
  have hcs : |inner ℝ u v| ≤ ‖u‖ * ‖v‖ := abs_real_inner_le_norm u v
  rw [← hn] at hcs
  have hθ : Real.cos (angle u (u + v)) = (‖u‖ ^ 2 + inner ℝ u v) / (‖u‖ * ‖u + v‖) := by rw [cos_angle, hi]
  have hα : Real.cos (angle u v) = inner ℝ u v / (‖u‖ * ‖u‖) := by rw [cos_angle, ← hn]
  have h2 : Real.cos (2 * angle u (u + v)) = Real.cos (angle u v) := by
    rw [Real.cos_two_mul, hθ, hα, div_pow, mul_pow, hs2]
    have hpos : 0 < 2 * ‖u‖ ^ 2 + 2 * inner ℝ u v := by rw [← hs2]; positivity
    field_simp
    ring
  have hθle : angle u (u + v) ≤ π / 2 := by
    unfold InnerProductGeometry.angle
    rw [Real.arccos_le_pi_div_two, hi]
    have := (abs_le.mp hcs).1
    exact div_nonneg (by nlinarith) (by positivity)
  exact Real.injOn_cos ⟨angle_nonneg _ _, angle_le_pi _ _⟩
    ⟨by linarith [angle_nonneg u (u + v)], by linarith⟩ h2.symm

/-- Predpostavke `romb_kot` se dajo izpolniti (romb A = 0, B = 5, C = 8 + 4i, D = 3 + 4i). -/
example : romb (0:ℂ) 5 (8 + 4 * Complex.I) (3 + 4 * Complex.I) ∧ (5:ℂ) ≠ 0 ∧ (8 + 4 * Complex.I : ℂ) ≠ 0 := by
  refine ⟨romb_ni_kvadrat.1, by norm_num, fun h => ?_⟩
  have := congrArg Complex.re h
  simp at this

/-- Razlaga (kvadrat), Povzetek, tabela: kvadrat ima vse kote prave, enako dolgi in pravokotni diagonali. -/
theorem kvadrat_lastnosti (A B C D : V) (h : kvadrat A B C D) :
    (∠ A B C = π / 2 ∧ ∠ B C D = π / 2 ∧ ∠ C D A = π / 2) ∧ dist A C = dist B D ∧
    inner ℝ (C - A) (D - B) = 0 := by
  obtain ⟨⟨hp, hα⟩, ⟨_, hr⟩⟩ := h
  exact ⟨(pravokotnik_diagonali A B C D hp).2 hα, (pravokotnik_diagonali A B C D hp).1.mp hα,
    (romb_diagonali A B C D hp).1.mp hr⟩

/-- Predpostavka kvadrata se da izpolniti (A = 0, B = 1, C = 1 + i, D = i). -/
example : kvadrat (0:ℂ) 1 (1 + Complex.I) Complex.I := by
  refine ⟨⟨by unfold paralelogram; ring, ?_⟩, ⟨by unfold paralelogram; ring, ?_⟩⟩
  · rw [kot, ← inner_eq_zero_iff_angle_eq_pi_div_two, Complex.inner]; simp
  · rw [Complex.dist_eq, Complex.dist_eq]; simp

/-! ## Rešeni primeri -/

/-- Primer 1: paralelogram z α = 65°: β = 180° − 65° = 115°, γ = 65°, δ = 115°; preizkus vsote
65 + 115 + 65 + 115 = 360. -/
theorem primer1 (A B C D : V) (h : paralelogram A B C D) (hα : ∠ D A B = 65 * π / 180) :
    ∠ A B C = 115 * π / 180 ∧ ∠ B C D = 65 * π / 180 ∧ ∠ C D A = 115 * π / 180 ∧ (180:ℝ) - 65 = 115 ∧
    (65:ℝ) + 115 + 65 + 115 = 360 := by
  obtain ⟨h1, h2, h3⟩ := par_koti A B C D h
  refine ⟨by linarith, by linarith, by linarith, by norm_num, by norm_num⟩

/-- Predpostavke `primer1` se dajo izpolniti (paralelogram v ℂ s kotom 65° pri A). -/
example : ∃ A B C D : ℂ, paralelogram A B C D ∧ ∠ D A B = 65 * π / 180 :=
  ⟨_, _, _, _, par_obstaja (65 * π / 180) (by positivity) (by linarith [Real.pi_pos])⟩

/-- Primer 2: v deltoidu je β = δ (`deltoid_lastnosti`); z vsoto kotov 360° in α = 80°, γ = 40° je
β = δ natanko 120° (360 − 80 − 40 = 240, 240 : 2 = 120; preizkus 80 + 120 + 40 + 120 = 360). -/
theorem primer2 (β δ : ℝ) (hbd : β = δ) : 80 + β + 40 + δ = 360 ↔ β = 120 ∧ δ = 120 := by
  constructor
  · intro h; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Primer 2, koraki 3–5 (in `<<RACUN`). -/
theorem primer2_koraki : (360:ℝ) - 80 - 40 = 240 ∧ (240:ℝ) / 2 = 120 ∧ (80:ℝ) + 120 + 40 + 120 = 360 := by
  norm_num

/-- Predpostavka `primer2` se da izpolniti (β = δ = 120). -/
example : (120:ℝ) = 120 ∧ (80:ℝ) + 120 + 40 + 120 = 360 := by norm_num

/-- Primer 3: enakokraki trapez z δ = 3α: α = 45°, δ = 3 · 45° = 135°, β = α = 45°, γ = δ = 135°
(α + 3α = 180°, 4α = 180°). -/
theorem primer3 (A B C D : V) (k : ℝ) (hk : 0 < k) (hk1 : k ≠ 1) (h : C - D = k • (B - A))
    (hkr : dist A D = dist B C) (h3 : ∠ C D A = 3 * ∠ D A B) :
    ∠ D A B = 45 * π / 180 ∧ ∠ C D A = 135 * π / 180 ∧ ∠ A B C = 45 * π / 180 ∧ ∠ B C D = 135 * π / 180 := by
  have hs := (trapez_koti A B C D ⟨k, hk, h⟩).1
  obtain ⟨e1, e2, _⟩ := enakokraki_trapez A B C D k hk hk1 h hkr
  have hα : ∠ D A B = 45 * π / 180 := by linarith
  refine ⟨hα, by linarith, by linarith, by linarith⟩

/-- Primer 3 in `<<RACUN`: α + 3α = 180 natanko pri α = 45; 3 · 45 = 135; vsota 45 + 45 + 135 + 135 = 360. -/
theorem primer3_racun (x : ℝ) : (x + 3 * x = 180 ↔ x = 45) ∧ (3:ℝ) * 45 = 135 ∧ (45:ℝ) + 45 + 135 + 135 = 360 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num⟩

/-- Predpostavke `primer3` se dajo izpolniti: enakokraki trapez s kotom α = 45° (`enakokraki_obstaja`) ima
δ = 180° − 45° = 135° = 3α. -/
example : ∃ A B C D : ℂ, ∃ k : ℝ, 0 < k ∧ k ≠ 1 ∧ C - D = k • (B - A) ∧ dist A D = dist B C ∧
    ∠ C D A = 3 * ∠ D A B := by
  obtain ⟨C, D, k, hk, hk1, h, hkr, hα⟩ := enakokraki_obstaja (π / 4) (by positivity) (by linarith [Real.pi_pos])
  have hs := (trapez_koti (0:ℂ) 4 C D ⟨k, hk, h⟩).1
  exact ⟨0, 4, C, D, k, hk, hk1, h, hkr, by linarith⟩

/-- Primer 4 (romb, kot med AC in AB 35°): α = 2 · 35° = 70°, γ = α = 70°, β = δ = 180° − 70° = 110°
(B ≠ A, C ≠ A); preizkus 70 + 110 + 70 + 110 = 360. -/
theorem primer4 (A B C D : V) (h : romb A B C D) (hB : B ≠ A) (hCA : C ≠ A) (h35 : ∠ B A C = 35 * π / 180) :
    ∠ D A B = 70 * π / 180 ∧ ∠ B C D = 70 * π / 180 ∧ ∠ A B C = 110 * π / 180 ∧ ∠ C D A = 110 * π / 180 ∧
    (2:ℝ) * 35 = 70 ∧ (180:ℝ) - 70 = 110 ∧ (70:ℝ) + 110 + 70 + 110 = 360 := by
  have hk := par_koti A B C D h.1
  have hα : ∠ D A B = 70 * π / 180 := by rw [(romb_kot A B C D h hB hCA).2, h35]; ring
  refine ⟨hα, by linarith [hk.1], by linarith [hk.2.2], by linarith [hk.2.1, hk.2.2], by norm_num, by norm_num,
    by norm_num⟩

/-- Predpostavke `primer4` se dajo izpolniti: romb A = 0, B = 1, D = e^{i·70°}, C = 1 + D ima ∠BAC = 35°. -/
example : ∃ A B C D : ℂ, romb A B C D ∧ B ≠ A ∧ C ≠ A ∧ ∠ B A C = 35 * π / 180 := by
  set t : ℝ := 70 * π / 180 with ht
  have h0 : 0 ≤ t := by rw [ht]; positivity
  have hπ : t ≤ π := by rw [ht]; linarith [Real.pi_pos]
  obtain ⟨hp, hα⟩ := par_obstaja t h0 hπ
  have hr : romb (0:ℂ) 1 (1 + Complex.exp (t * Complex.I)) (Complex.exp (t * Complex.I)) :=
    ⟨hp, by rw [Complex.dist_eq, Complex.dist_eq, zero_sub, zero_sub, norm_neg, norm_neg, norm_one,
      Complex.norm_exp_ofReal_mul_I]⟩
  have hc : 0 < Real.cos t := Real.cos_pos_of_mem_Ioo ⟨by linarith [Real.pi_pos], by rw [ht]; linarith [Real.pi_pos]⟩
  have hC : (1 + Complex.exp (t * Complex.I)) ≠ 0 := by
    intro e
    have := congrArg Complex.re e
    rw [Complex.add_re, Complex.one_re, Complex.exp_ofReal_mul_I_re, Complex.zero_re] at this
    linarith
  refine ⟨0, 1, _, _, hr, one_ne_zero, hC, ?_⟩
  have := (romb_kot _ _ _ _ hr one_ne_zero hC).2
  rw [hα] at this
  linarith

/-! ## Pogoste napake in Preveri se -/

/-- Pogoste napake 1: vsota kotov štirikotnika ni 180°, ampak 2 · 180° = 360° (dokazano za trapez in paralelogram,
`trapez_koti`, `par_vsota`). -/
theorem dva_trikotnika : (2:ℝ) * 180 = 360 := by norm_num

/-- Preveri se 2: z vsoto kotov 360° in α = 90°, β = 75°, γ = 110° je δ natanko 85°; napačni odgovori
275 (vsota danih), 75 in 70 ne ustrezajo. -/
theorem preveri2 (δ : ℝ) : (90 + 75 + 110 + δ = 360 ↔ δ = 85) ∧ (360:ℝ) - 90 - 75 - 110 = 85 ∧
    (90:ℝ) + 75 + 110 = 275 ∧ (90:ℝ) + 75 + 110 + 75 ≠ 360 ∧ (90:ℝ) + 75 + 110 + 70 ≠ 360 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 3: paralelogram z enakimi stranicami je romb: diagonali sta pravokotni, se še vedno razpolavljata,
enako dolgi pa sta le, če je kot pravi (kvadrat). -/
theorem preveri3 (A B C D : V) (h : romb A B C D) :
    inner ℝ (C - A) (D - B) = 0 ∧ midpoint ℝ A C = midpoint ℝ B D ∧ (dist A C = dist B D ↔ ∠ D A B = π / 2) :=
  ⟨(romb_diagonali A B C D h.1).1.mp h.2, par_diagonali A B C D h.1, (pravokotnik_diagonali A B C D h.1).1.symm⟩

/-- Preveri se 4: v enakokrakem trapezu z α = 50° je β = 50°, γ = δ = 180° − 50° = 130° (vsota 360°); Nikini koti
dajo 50 · 4 = 200 ≠ 360, napaka je v 2. koraku (γ ≠ α). -/
theorem preveri4 (A B C D : V) (k : ℝ) (hk : 0 < k) (hk1 : k ≠ 1) (h : C - D = k • (B - A))
    (hkr : dist A D = dist B C) (h50 : ∠ D A B = 50 * π / 180) :
    ∠ A B C = 50 * π / 180 ∧ ∠ B C D = 130 * π / 180 ∧ ∠ C D A = 130 * π / 180 ∧ ∠ B C D ≠ ∠ D A B ∧
    (180:ℝ) - 50 = 130 ∧ (50:ℝ) + 50 + 130 + 130 = 360 ∧ (50:ℝ) * 4 = 200 := by
  have hs := trapez_koti A B C D ⟨k, hk, h⟩
  obtain ⟨e1, e2, _⟩ := enakokraki_trapez A B C D k hk hk1 h hkr
  have hγ : ∠ B C D = 130 * π / 180 := by linarith [hs.2.1]
  refine ⟨by linarith, hγ, by linarith [hs.1], ?_, by norm_num, by norm_num, by norm_num⟩
  rw [hγ, h50]; intro e; have := Real.pi_pos; nlinarith

/-- Predpostavke `preveri4` se dajo izpolniti (enakokraki trapez s kotom 50° pri A, `enakokraki_obstaja`). -/
example : ∃ A B C D : ℂ, ∃ k : ℝ, 0 < k ∧ k ≠ 1 ∧ C - D = k • (B - A) ∧ dist A D = dist B C ∧
    ∠ D A B = 50 * π / 180 := by
  obtain ⟨C, D, k, hk, hk1, h, hkr, hα⟩ :=
    enakokraki_obstaja (50 * π / 180) (by positivity) (by linarith [Real.pi_pos])
  exact ⟨0, 4, C, D, k, hk, hk1, h, hkr, hα⟩

/-- Preveri se 5 in `<<RACUN`: enakokraki trapez z δ = 2α: α + 2α = 180° da α = 60°, δ = 2 · 60° = 120°,
β = α = 60°, γ = δ = 120°. -/
theorem preveri5 (A B C D : V) (k : ℝ) (hk : 0 < k) (hk1 : k ≠ 1) (h : C - D = k • (B - A))
    (hkr : dist A D = dist B C) (h2 : ∠ C D A = 2 * ∠ D A B) :
    ∠ D A B = 60 * π / 180 ∧ ∠ C D A = 120 * π / 180 ∧ ∠ A B C = 60 * π / 180 ∧ ∠ B C D = 120 * π / 180 := by
  have hs := (trapez_koti A B C D ⟨k, hk, h⟩).1
  obtain ⟨e1, e2, _⟩ := enakokraki_trapez A B C D k hk hk1 h hkr
  have hα : ∠ D A B = 60 * π / 180 := by linarith
  refine ⟨hα, by linarith, by linarith, by linarith⟩

/-- Predpostavke `preveri5` se dajo izpolniti: enakokraki trapez s kotom α = 60° ima δ = 120° = 2α. -/
example : ∃ A B C D : ℂ, ∃ k : ℝ, 0 < k ∧ k ≠ 1 ∧ C - D = k • (B - A) ∧ dist A D = dist B C ∧
    ∠ C D A = 2 * ∠ D A B := by
  obtain ⟨C, D, k, hk, hk1, h, hkr, hα⟩ := enakokraki_obstaja (π / 3) (by positivity) (by linarith [Real.pi_pos])
  have hs := (trapez_koti (0:ℂ) 4 C D ⟨k, hk, h⟩).1
  exact ⟨0, 4, C, D, k, hk, hk1, h, hkr, by linarith⟩

/-- Preveri se 5 in `<<RACUN`: x + 2x = 180 natanko pri x = 60; 2 · 60 = 120. Ostale vrstice `<<RACUN`. -/
theorem racun (x : ℝ) : (x + 2 * x = 180 ↔ x = 60) ∧ (2:ℝ) * 60 = 120 ∧ (180:ℝ) - 65 = 115 ∧
    (65:ℝ) + 115 + 65 + 115 = 360 ∧ (360:ℝ) - 80 - 40 = 240 ∧ (240:ℝ) / 2 = 120 ∧ (3:ℝ) * 45 = 135 ∧
    (2:ℝ) * 35 = 70 ∧ (180:ℝ) - 70 = 110 ∧ (360:ℝ) - 90 - 75 - 110 = 85 ∧ (180:ℝ) - 50 = 130 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

end Evklid.Lekcije.MAT_OS_7.VrsteStirikotnikov
