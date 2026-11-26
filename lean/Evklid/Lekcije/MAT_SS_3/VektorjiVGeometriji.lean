/-
vir: content/lessons/MAT-SS-3/vektorji-v-geometriji.md
sha256: 563b2f786cd218155d7981153df8138287f6d6cbd25e0257e47668d5d6359853
Model: točke in vektorji v ℝ² / ℝ³ (`EuclideanSpace`, `!₂[…]`) ali v poljubnem realnem vektorskem prostoru V
(točka = krajevni vektor); kolinearnost točk je Mathlibov `Collinear`; kolinearna/koplanarni vektorji =
linearno odvisni (enakovrednost z b⃗ = k a⃗ oziroma c⃗ = α a⃗ + β b⃗ je dokazana); »AD : DB = m : n« je
n·AD⃗ = m·DB⃗ (za m, n > 0 je to tudi razmerje dolžin, dokazano v normiranem prostoru).
Ni v Leanu: uvodni zgodbi (kanal, taksist) in analogije (sok, gugalnica, dron, prijatelji; »težišče ni nujno
najkrajša pot« ni dokazano); risbe (dokazane so koordinate točk) in simulacija (dokazani le prikazani
vektorji); pojasnilo s svinčniki na mizi; pri Primeru 3 in Nalogi 3 je nekolinearnost stranic (nedegeneriran
paralelogram/trikotnik) predpostavka, ne izpeljava iz slike; Preveri se 2 (vrstni red korakov, ni
matematična trditev); točkovanje.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.VektorjiVGeometriji

/-- Ravnina ℝ² (vektor `!₂[x, y]`). -/
abbrev R2 := EuclideanSpace ℝ (Fin 2)

/-- Prostor ℝ³ (vektor `!₂[x, y, z]`). -/
abbrev R3 := EuclideanSpace ℝ (Fin 3)

/-- Pomožno (Razlaga, AB⃗ = r⃗_B − r⃗_A in računi): vsota po komponentah v ravnini.
pomozno -/
theorem v2_add (a₁ a₂ b₁ b₂ : ℝ) : (!₂[a₁, a₂] : R2) + !₂[b₁, b₂] = !₂[a₁ + b₁, a₂ + b₂] := by
  ext i; fin_cases i <;> simp

/-- Pomožno: razlika po komponentah v ravnini (AB⃗ = r⃗_B − r⃗_A).
pomozno -/
theorem v2_sub (a₁ a₂ b₁ b₂ : ℝ) : (!₂[a₁, a₂] : R2) - !₂[b₁, b₂] = !₂[a₁ - b₁, a₂ - b₂] := by
  ext i; fin_cases i <;> simp

/-- Pomožno: večkratnik po komponentah v ravnini.
pomozno -/
theorem v2_smul (k a₁ a₂ : ℝ) : k • (!₂[a₁, a₂] : R2) = !₂[k * a₁, k * a₂] := by
  ext i; fin_cases i <;> simp

/-- Pomožno: vektorja v ravnini sta enaka natanko tedaj, ko se ujemata po komponentah.
pomozno -/
theorem v2_eq {a₁ a₂ b₁ b₂ : ℝ} : (!₂[a₁, a₂] : R2) = !₂[b₁, b₂] ↔ a₁ = b₁ ∧ a₂ = b₂ := by
  constructor
  · intro h
    exact ⟨by simpa using congrArg (fun v : R2 => v 0) h, by simpa using congrArg (fun v : R2 => v 1) h⟩
  · rintro ⟨rfl, rfl⟩; rfl

/-- Pomožno: vsota po komponentah v prostoru.
pomozno -/
theorem v3_add (a₁ a₂ a₃ b₁ b₂ b₃ : ℝ) :
    (!₂[a₁, a₂, a₃] : R3) + !₂[b₁, b₂, b₃] = !₂[a₁ + b₁, a₂ + b₂, a₃ + b₃] := by
  ext i; fin_cases i <;> simp

/-- Pomožno: razlika po komponentah v prostoru.
pomozno -/
theorem v3_sub (a₁ a₂ a₃ b₁ b₂ b₃ : ℝ) :
    (!₂[a₁, a₂, a₃] : R3) - !₂[b₁, b₂, b₃] = !₂[a₁ - b₁, a₂ - b₂, a₃ - b₃] := by
  ext i; fin_cases i <;> simp

/-- Pomožno: večkratnik po komponentah v prostoru.
pomozno -/
theorem v3_smul (k a₁ a₂ a₃ : ℝ) : k • (!₂[a₁, a₂, a₃] : R3) = !₂[k * a₁, k * a₂, k * a₃] := by
  ext i; fin_cases i <;> simp

/-- Pomožno: vektorja v prostoru sta enaka natanko tedaj, ko se ujemata po komponentah.
pomozno -/
theorem v3_eq {a₁ a₂ a₃ b₁ b₂ b₃ : ℝ} :
    (!₂[a₁, a₂, a₃] : R3) = !₂[b₁, b₂, b₃] ↔ a₁ = b₁ ∧ a₂ = b₂ ∧ a₃ = b₃ := by
  constructor
  · intro h
    exact ⟨by simpa using congrArg (fun v : R3 => v 0) h, by simpa using congrArg (fun v : R3 => v 1) h,
      by simpa using congrArg (fun v : R3 => v 2) h⟩
  · rintro ⟨rfl, rfl, rfl⟩; rfl

variable {V : Type*} [AddCommGroup V] [Module ℝ V]

/-! ## Splošna pravila (vektorski prostor V; točke so dane s krajevnimi vektorji) -/

/-- Razlaga 2: ničelni vektor je kolinearen z vsakim (0⃗ = 0·a⃗); AB⃗ = r⃗_B − r⃗_A je edini vektor, ki A premakne
v B.
trditev: MAT-SS-3/vektorji-v-geometriji#nicelni-in-ab
besedilo: »Ničelni vektor $\vec 0$ je kolinearen z vsakim vektorjem.« -/
theorem nicelni_in_AB (a A B v : V) : (0 : V) = (0:ℝ) • a ∧ (A + v = B ↔ v = B - A) :=
  ⟨(zero_smul ℝ a).symm, ⟨fun h => by rw [← h]; abel, fun h => by rw [h]; abel⟩⟩

/-- Razlaga 2 in Povzetek: za A ≠ B ležijo A, B, C na isti premici natanko tedaj, ko je AC⃗ = k·AB⃗.
trditev: MAT-SS-3/vektorji-v-geometriji#tocke-na-premici
besedilo: »Točke $A$, $B$ in $C$ ležijo na isti premici natanko tedaj, ko sta $\overrightarrow{AB}$ in $\overrightarrow{AC}$ kolinearna.« -/
theorem tocke_na_premici (A B C : V) (hAB : A ≠ B) :
    Collinear ℝ ({A, B, C} : Set V) ↔ ∃ k : ℝ, C - A = k • (B - A) := by
  rw [collinear_iff_of_mem (Set.mem_insert A _)]
  constructor
  · rintro ⟨v, hv⟩
    obtain ⟨rB, hB⟩ := hv B (by simp)
    obtain ⟨rC, hC⟩ := hv C (by simp)
    rw [vadd_eq_add] at hB hC
    have hr : rB ≠ 0 := by rintro rfl; simp at hB; exact hAB hB.symm
    refine ⟨rC / rB, ?_⟩
    rw [hB, hC, add_sub_cancel_right, add_sub_cancel_right, smul_smul, div_mul_cancel₀ _ hr]
  · rintro ⟨k, hk⟩
    refine ⟨B - A, fun p hp => ?_⟩
    simp only [Set.mem_insert_iff, Set.mem_singleton_iff] at hp
    rcases hp with rfl | rfl | rfl
    · exact ⟨0, by simp⟩
    · exact ⟨1, by simp⟩
    · exact ⟨k, by rw [vadd_eq_add, ← hk]; abel⟩

/-- Predpostavka `tocke_na_premici` se da izpolniti (A(1, 2) ≠ B(4, 4) iz Primera 1). -/
example : (!₂[1, 2] : R2) ≠ !₂[4, 4] := by rw [Ne, v2_eq]; norm_num

/-- Razlaga 4 in Povzetek (višja raven): n vektorjev je linearno odvisnih natanko tedaj, ko njihova
ogrinjača ni n-razsežna (dva sta odvisna ⇔ ležita na eni premici skozi O, razsežnost ≤ 1, torej sta
kolinearna; trije ⇔ ležijo v eni ravnini, razsežnost ≤ 2, torej so koplanarni).
trditev: MAT-SS-3/vektorji-v-geometriji#odvisni-iff-razseznost
besedilo: »Dva vektorja sta odvisna natanko tedaj, ko sta kolinearna. Trije so odvisni natanko tedaj, ko so koplanarni:« -/
theorem odvisni_iff_razseznost (n : ℕ) (v : Fin n → V) :
    ¬ LinearIndependent ℝ v ↔ Set.finrank ℝ (Set.range v) < n := by
  rw [linearIndependent_iff_card_eq_finrank_span, Fintype.card_fin]
  have := finrank_range_le_card (R := ℝ) v
  rw [Fintype.card_fin] at this
  omega

/-- Razlaga 2 in 4: dva vektorja sta linearno odvisna natanko tedaj, ko je eden večkratnik drugega
(b⃗ = k a⃗ ali a⃗ = k b⃗; za a⃗ ≠ 0⃗ je to b⃗ = k a⃗).
trditev: MAT-SS-3/vektorji-v-geometriji#dva-odvisna
besedilo: »2. Kolinearnost.** Vektorja sta **kolinearna**, če ju lahko s premikom postavimo na isto premico. Takrat je eden večkratnik drugega:« -/
theorem dva_odvisna (a b : V) :
    ¬ LinearIndependent ℝ ![a, b] ↔ (∃ k : ℝ, b = k • a) ∨ (∃ k : ℝ, a = k • b) := by
  rw [LinearIndependent.pair_iff]
  push Not
  constructor
  · rintro ⟨s, t, h, hst⟩
    by_cases ht : t = 0
    · subst ht
      have hs : s ≠ 0 := fun hs => hst hs rfl
      right; refine ⟨0, ?_⟩
      simp only [zero_smul, add_zero] at h
      rw [zero_smul]; exact (smul_eq_zero.1 h).resolve_left hs
    · left; refine ⟨-s / t, ?_⟩
      have : t • b = -(s • a) := by rw [eq_neg_iff_add_eq_zero, add_comm]; exact h
      calc b = t⁻¹ • (t • b) := by rw [smul_smul, inv_mul_cancel₀ ht, one_smul]
        _ = (-s / t) • a := by rw [this, smul_neg, smul_smul, ← neg_smul]; congr 1; field_simp
  · rintro (⟨k, rfl⟩ | ⟨k, rfl⟩)
    · exact ⟨k, -1, by rw [smul_smul, neg_one_mul, neg_smul, add_neg_cancel], fun _ => by norm_num⟩
    · exact ⟨-1, k, by rw [smul_smul, neg_one_mul, neg_smul, neg_add_cancel], fun h => by norm_num at h⟩

/-- Razlaga 3 in Ustno vprašanje 1: če a⃗, b⃗ nista kolinearna (sta neodvisna), so a⃗, b⃗, c⃗ koplanarni (odvisni)
natanko tedaj, ko je c⃗ = α a⃗ + β b⃗.
trditev: MAT-SS-3/vektorji-v-geometriji#koplanarni
besedilo: »b) Vektorja $\vec a$ in $\vec b$ nista kolinearna (druga komponenta $\vec a$ je $0$, druga komponenta $\vec b$ pa ne), zato določata ravnino. Vektor $\vec c$ leži v njej natanko tedaj, ko je $\vec c = \alpha\vec a + \beta\vec b$.« -/
theorem koplanarni (a b c : V) (hab : LinearIndependent ℝ ![a, b]) :
    ¬ LinearIndependent ℝ ![a, b, c] ↔ ∃ α β : ℝ, c = α • a + β • b := by
  rw [Fintype.not_linearIndependent_iff]
  constructor
  · rintro ⟨g, hg, i, hi⟩
    simp only [Fin.sum_univ_three, Matrix.cons_val_zero, Matrix.cons_val_one, Matrix.cons_val_two,
      Matrix.head_cons, Matrix.tail_cons] at hg
    have h2 : g 2 ≠ 0 := by
      intro h2
      rw [h2, zero_smul, add_zero] at hg
      have := LinearIndependent.pair_iff.1 hab (g 0) (g 1) hg
      fin_cases i <;> simp_all
    refine ⟨-g 0 / g 2, -g 1 / g 2, ?_⟩
    have : g 2 • c = -(g 0 • a + g 1 • b) := by
      rw [eq_neg_iff_add_eq_zero, add_comm]; exact hg
    calc c = (g 2)⁻¹ • (g 2 • c) := by rw [smul_smul, inv_mul_cancel₀ h2, one_smul]
      _ = (-g 0 / g 2) • a + (-g 1 / g 2) • b := by
        rw [this, smul_neg, smul_add, smul_smul, smul_smul, neg_add, ← neg_smul, ← neg_smul]
        congr 2 <;> field_simp
  · rintro ⟨k, m, rfl⟩
    refine ⟨![k, m, -1], ?_, 2, by simp⟩
    simp only [Fin.sum_univ_three, Matrix.cons_val_zero, Matrix.cons_val_one, Matrix.cons_val_two,
      Matrix.head_cons, Matrix.tail_cons]
    rw [neg_one_smul]; abel

/-- Predpostavka `koplanarni` se da izpolniti (a⃗ = (1, 0, 2), b⃗ = (2, 1, −1) iz Naloge 2). -/
example : LinearIndependent ℝ ![(!₂[1, 0, 2] : R3), !₂[2, 1, -1]] := by
  rw [LinearIndependent.pair_iff]
  intro s t h
  rw [v3_smul, v3_smul, v3_add] at h
  have h' : (!₂[s * 1 + t * 2, s * 0 + t * 1, s * 2 + t * -1] : R3) = !₂[0, 0, 0] := by
    rw [h]; ext i; fin_cases i <;> rfl
  rw [v3_eq] at h'; constructor <;> linarith [h'.1, h'.2.1]

/-- Razlaga 3 in 4: v ravnini so trije (in štirje) vektorji vedno odvisni (vsi so koplanarni), v prostoru so
štirje vedno odvisni.
trditev: MAT-SS-3/vektorji-v-geometriji#vedno-odvisni
besedilo: »V ravnini so vsi vektorji koplanarni, zato ima vprašanje smisel šele v prostoru.« -/
theorem vedno_odvisni (u : Fin 3 → R2) (w : Fin 4 → R2) (z : Fin 4 → R3) :
    ¬ LinearIndependent ℝ u ∧ ¬ LinearIndependent ℝ w ∧ ¬ LinearIndependent ℝ z := by
  refine ⟨fun h => ?_, fun h => ?_, fun h => ?_⟩ <;> have := h.fintype_card_le_finrank <;> simp at this

/-- Razlaga 4 in Ustno vprašanje 2 (primerjava koeficientov): če sta a⃗, b⃗ neodvisna in
α a⃗ + β b⃗ = γ a⃗ + δ b⃗, je (α − γ)a⃗ + (β − δ)b⃗ = 0⃗ in zato α = γ, β = δ.
trditev: MAT-SS-3/vektorji-v-geometriji#primerjava-koeficientov
besedilo: »Ključna posledica: če sta $\vec a$ in $\vec b$ neodvisna in je $\alpha\vec a + \beta\vec b = \gamma\vec a + \delta\vec b$, potem je $\alpha = \gamma$ in $\beta = \delta$.« -/
theorem primerjava_koeficientov (a b : V) (h : LinearIndependent ℝ ![a, b]) (α β γ δ : ℝ)
    (he : α • a + β • b = γ • a + δ • b) :
    (α - γ) • a + (β - δ) • b = 0 ∧ α = γ ∧ β = δ := by
  have h0 : (α - γ) • a + (β - δ) • b = 0 := by
    rw [sub_smul, sub_smul]; rw [← sub_eq_zero] at he; rw [← he]; abel
  have := LinearIndependent.pair_iff.1 h _ _ h0
  exact ⟨h0, by linarith [this.1], by linarith [this.2]⟩

/-- Predpostavke `primerjava_koeficientov` se dajo izpolniti ((1, 0) in (0, 1) sta neodvisna). -/
example : LinearIndependent ℝ ![(!₂[1, 0] : R2), !₂[0, 1]] := by
  rw [LinearIndependent.pair_iff]
  intro s t h
  rw [v2_smul, v2_smul, v2_add] at h
  have h' : (!₂[s * 1 + t * 0, s * 0 + t * 1] : R2) = !₂[0, 0] := by rw [h]; ext i; fin_cases i <;> rfl
  rw [v2_eq] at h'; constructor <;> linarith [h'.1, h'.2]

/-- Premisli 2: pri b⃗ = 2a⃗ je 3a⃗ + 1·b⃗ = 5a⃗ + 0·b⃗ = 5a⃗, koeficienta pa sta različna (3 ≠ 5): pri odvisnih
vektorjih primerjava koeficientov ni dovoljena.
trditev: MAT-SS-3/vektorji-v-geometriji#premisli-odvisna
besedilo: »Pri odvisnih vektorjih se isti vektor zapiše na več načinov. Pri $\vec b = 2\vec a$ sta $3\vec a + 1\vec b$ in $5\vec a + 0\vec b$ oba enaka $5\vec a$, koeficienti pa so različni. Primerjava bi dala nesmisel $3 = 5$.« -/
theorem premisli_odvisna (a : V) :
    (3:ℝ) • a + (1:ℝ) • ((2:ℝ) • a) = (5:ℝ) • a ∧ (5:ℝ) • a + (0:ℝ) • ((2:ℝ) • a) = (5:ℝ) • a ∧ (3:ℝ) ≠ 5 := by
  refine ⟨?_, by simp, by norm_num⟩
  rw [one_smul, ← add_smul]; norm_num

/-- Razlaga 5 (delilno razmerje, višja raven): za m + n ≠ 0 je n·AD⃗ = m·DB⃗ natanko tedaj, ko je
r⃗_D = r⃗_A + m/(m + n)·(r⃗_B − r⃗_A), in to je r⃗_D = (n r⃗_A + m r⃗_B)/(m + n).
trditev: MAT-SS-3/vektorji-v-geometriji#delilno-razmerje
besedilo: »$\vec r_D = \vec r_A + \frac{m}{m+n}(\vec r_B - \vec r_A)$« -/
theorem delilno_razmerje (A B D : V) (m n : ℝ) (hmn : m + n ≠ 0) :
    (n • (D - A) = m • (B - D) ↔ D = A + (m / (m + n)) • (B - A)) ∧
    A + (m / (m + n)) • (B - A) = (m + n)⁻¹ • (n • A + m • B) := by
  have key : A + (m / (m + n)) • (B - A) = (m + n)⁻¹ • (n • A + m • B) :=
    calc A + (m / (m + n)) • (B - A) = (m + n)⁻¹ • ((m + n) • A + m • (B - A)) := by
          rw [smul_add, smul_smul, inv_mul_cancel₀ hmn, one_smul, smul_smul, div_eq_inv_mul]
      _ = (m + n)⁻¹ • (n • A + m • B) := by congr 1; module
  refine ⟨⟨fun h => ?_, fun h => ?_⟩, key⟩
  · rw [key]
    have : (m + n) • D = n • A + m • B := by
      rw [add_smul]; rw [smul_sub, smul_sub] at h
      calc m • D + n • D = n • D - n • A + n • A + m • D := by abel
        _ = m • B - m • D + n • A + m • D := by rw [h]
        _ = n • A + m • B := by abel
    rw [← this, smul_smul, inv_mul_cancel₀ hmn, one_smul]
  · rw [key] at h
    have : (m + n) • D = n • A + m • B := by rw [h, smul_smul, mul_inv_cancel₀ hmn, one_smul]
    rw [smul_sub, smul_sub]
    rw [add_smul] at this
    calc n • D - n • A = (m • D + n • D) - m • D - n • A := by abel
      _ = (n • A + m • B) - m • D - n • A := by rw [this]
      _ = m • B - m • D := by abel

/-- Predpostavka `delilno_razmerje` se da izpolniti (m = 1, n = 2 iz Primera 2). -/
example : (1:ℝ) + 2 ≠ 0 := by norm_num

/-- Razlaga 5: razpolovišče (m = n) ima r⃗_S = (r⃗_A + r⃗_B)/2; razdalji v normiranem prostoru sta
|AD| = m/(m + n)|AB| in |DB| = n/(m + n)|AB|, zato je D bližje A (|AD| < |DB|) natanko pri m < n (r⃗_A ima
večjo utež n).
trditev: MAT-SS-3/vektorji-v-geometriji#razpolovisce-in-blizina
besedilo: »Pazi na vrstni red: če je $D$ bližje $A$, ima $\vec r_A$ večjo utež, torej večji koeficient v števcu. Razpolovišče $S$ dobiš pri $m = n$:« -/
theorem razpolovisce_in_blizina {W : Type*} [NormedAddCommGroup W] [NormedSpace ℝ W] (A B : W) (m n : ℝ)
    (hm : 0 < m) (hn : 0 < n) (hAB : A ≠ B) :
    A + (1 / (1 + 1) : ℝ) • (B - A) = (2:ℝ)⁻¹ • (A + B) ∧
    ‖(A + (m / (m + n)) • (B - A)) - A‖ = m / (m + n) * ‖B - A‖ ∧
    ‖B - (A + (m / (m + n)) • (B - A))‖ = n / (m + n) * ‖B - A‖ ∧
    (‖(A + (m / (m + n)) • (B - A)) - A‖ < ‖B - (A + (m / (m + n)) • (B - A))‖ ↔ m < n) := by
  have hBA : 0 < ‖B - A‖ := norm_pos_iff.2 (sub_ne_zero.2 hAB.symm)
  have h1 : ‖(A + (m / (m + n)) • (B - A)) - A‖ = m / (m + n) * ‖B - A‖ := by
    rw [add_sub_cancel_left, norm_smul, Real.norm_eq_abs, abs_of_pos (by positivity)]
  have h2 : ‖B - (A + (m / (m + n)) • (B - A))‖ = n / (m + n) * ‖B - A‖ := by
    have : B - (A + (m / (m + n)) • (B - A)) = (n / (m + n)) • (B - A) := by
      have e : (n / (m + n)) = 1 - m / (m + n) := by field_simp; ring
      rw [e, sub_smul, one_smul]; abel
    rw [this, norm_smul, Real.norm_eq_abs, abs_of_pos (by positivity)]
  refine ⟨?_, h1, h2, ?_⟩
  · norm_num; module
  · rw [h1, h2, mul_lt_mul_iff_left₀ hBA, div_lt_div_iff_of_pos_right (by positivity)]

/-- Predpostavke `razpolovisce_in_blizina` se dajo izpolniti (m = 1, n = 2, A(1, 1) ≠ B(7, 4)). -/
example : (0:ℝ) < 1 ∧ (0:ℝ) < 2 ∧ (!₂[1, 1] : R2) ≠ !₂[7, 4] := by
  refine ⟨by norm_num, by norm_num, ?_⟩; rw [Ne, v2_eq]; norm_num

/-- Razlaga 6 in Ustno vprašanje 3 (težišče, višja raven): s S = (A + B)/2 je T = (C + 2S)/3 = (A + B + C)/3;
T leži na vseh treh težiščnicah in vsako deli v razmerju 2 : 1 (1·(T − X) = 2·(S_X − T) za vsako oglišče X in
razpolovišče S_X nasprotne stranice).
trditev: MAT-SS-3/vektorji-v-geometriji#tezisce
besedilo: »Delilno razmerje da $\vec r_T = \frac{\vec r_C + 2\vec r_S}{3}$; vstavimo $2\vec r_S = \vec r_A + \vec r_B$:« -/
theorem tezisce (A B C : V) :
    (3:ℝ)⁻¹ • (C + (2:ℝ) • ((2:ℝ)⁻¹ • (A + B))) = (3:ℝ)⁻¹ • (A + B + C) ∧
    (1:ℝ) • ((3:ℝ)⁻¹ • (A + B + C) - C) = (2:ℝ) • ((2:ℝ)⁻¹ • (A + B) - (3:ℝ)⁻¹ • (A + B + C)) ∧
    (1:ℝ) • ((3:ℝ)⁻¹ • (A + B + C) - A) = (2:ℝ) • ((2:ℝ)⁻¹ • (B + C) - (3:ℝ)⁻¹ • (A + B + C)) ∧
    (1:ℝ) • ((3:ℝ)⁻¹ • (A + B + C) - B) = (2:ℝ) • ((2:ℝ)⁻¹ • (C + A) - (3:ℝ)⁻¹ • (A + B + C)) := by
  refine ⟨?_, ?_, ?_, ?_⟩ <;>
  · simp only [smul_add, smul_sub, smul_smul, one_smul]
    norm_num
    module

/-- Razlaga 7 (diagonali paralelograma, višja raven): pri neodvisnih a⃗ = AB⃗, b⃗ = AD⃗ je
s(a⃗ + b⃗) = (1 − t)a⃗ + t b⃗ natanko pri s = t = 1/2 (diagonali se razpolavljata; a⃗ + t(b⃗ − a⃗) = (1 − t)a⃗ + t b⃗).
trditev: MAT-SS-3/vektorji-v-geometriji#diagonali-paralelograma
besedilo: »Prek $B$ in po diagonali $BD$: $\overrightarrow{AS} = \vec a + t(\vec b - \vec a) = (1 - t)\vec a + t\,\vec b$.« -/
theorem diagonali_paralelograma (a b : V) (h : LinearIndependent ℝ ![a, b]) (s t : ℝ) :
    a + t • (b - a) = (1 - t) • a + t • b ∧
    (s • (a + b) = (1 - t) • a + t • b ↔ s = 1 / 2 ∧ t = 1 / 2) := by
  refine ⟨by rw [smul_sub, sub_smul, one_smul]; abel, ⟨fun he => ?_, fun ⟨hs, ht⟩ => ?_⟩⟩
  · rw [smul_add] at he
    obtain ⟨-, h1, h2⟩ := primerjava_koeficientov a b h s s (1 - t) t he
    constructor <;> linarith
  · subst hs ht; rw [smul_add]; norm_num

/-- Predpostavke `diagonali_paralelograma` se dajo izpolniti (a⃗ = (1, 0), b⃗ = (0, 1)). -/
example : LinearIndependent ℝ ![(!₂[1, 0] : R2), !₂[0, 1]] := by
  rw [LinearIndependent.pair_iff]
  intro s t h
  rw [v2_smul, v2_smul, v2_add] at h
  have h' : (!₂[s * 1 + t * 0, s * 0 + t * 1] : R2) = !₂[0, 0] := by rw [h]; ext i; fin_cases i <;> rfl
  rw [v2_eq] at h'; constructor <;> linarith [h'.1, h'.2]

/-! ## Razlaga: primeri na mreži -/

/-- Razlaga 1: OP⃗ = 2·(2, 1) + 1·(1, 2) = (5, 4) (pot čez (2, 1) in (4, 2)).
trditev: MAT-SS-3/vektorji-v-geometriji#linearna-kombinacija-mreza
besedilo: »1. Linearna kombinacija.** Na mreži narišemo vektorja $\vec a = (2, 1)$ in $\vec b = (1, 2)$ z začetkom v izhodišču $O$. Do točke $P(5, 4)$ prideš z dvema korakoma $\vec a$ in enim korakom $\vec b$:« -/
theorem linearna_kombinacija_mreza :
    (2:ℝ) • (!₂[2, 1] : R2) + (1:ℝ) • !₂[1, 2] = !₂[5, 4] ∧ (!₂[2, 1] : R2) + !₂[2, 1] = !₂[4, 2] ∧
    (!₂[4, 2] : R2) + !₂[1, 2] = !₂[5, 4] := by
  refine ⟨?_, ?_, ?_⟩ <;> simp only [v2_smul, v2_add] <;> norm_num

/-- Razlaga 1, simulacija: pri a⃗ = (2, 0), b⃗ = (4, 0) ostaneta a⃗ ± b⃗ na osi x; pri (3, 1), (1, 3) vsota (4, 4)
ni večkratnik (3, 1).
trditev: MAT-SS-3/vektorji-v-geometriji#simulacija
besedilo: »V simulaciji spodaj (»Linearna kombinacija vektorjev«) izberi par »a (2, 0), b (4, 0): vzporedna« in preklapljaj med $\vec a + \vec b$ in $\vec a - \vec b$.« -/
theorem simulacija :
    (!₂[2, 0] : R2) + !₂[4, 0] = !₂[6, 0] ∧ (!₂[2, 0] : R2) - !₂[4, 0] = !₂[-2, 0] ∧
    ¬ ∃ k : ℝ, (!₂[4, 4] : R2) = k • !₂[3, 1] := by
  refine ⟨by rw [v2_add]; norm_num, by rw [v2_sub]; norm_num, ?_⟩
  rintro ⟨k, hk⟩; rw [v2_smul, v2_eq] at hk; obtain ⟨h1, h2⟩ := hk; linarith

/-- Razlaga 2: (6, 3) = 3·(2, 1) (kolinearna, k = 3), (1, 2) ni večkratnik (2, 1); za a⃗ ≠ 0⃗ v ravnini je
b⃗ = k a⃗ natanko tedaj, ko sta razmerji komponent enaki (a_x b_y = a_y b_x).
trditev: MAT-SS-3/vektorji-v-geometriji#kolinearnost-ravnina
besedilo: »Po komponentah to pomeni, da sta razmerji istoležnih komponent enaki. Vektorja $(2, 1)$ in $(6, 3)$ sta kolinearna, saj je $k = 3$. Vektorja $(2, 1)$ in $(1, 2)$ nista. Ničelni vektor $\vec 0$ je kolinearen z vsakim vektorjem.« -/
theorem kolinearnost_ravnina :
    (!₂[6, 3] : R2) = (3:ℝ) • !₂[2, 1] ∧ (¬ ∃ k : ℝ, (!₂[1, 2] : R2) = k • !₂[2, 1]) ∧
    ∀ a₁ a₂ b₁ b₂ : ℝ, (a₁ ≠ 0 ∨ a₂ ≠ 0) →
      ((∃ k : ℝ, (!₂[b₁, b₂] : R2) = k • !₂[a₁, a₂]) ↔ a₁ * b₂ = a₂ * b₁) := by
  refine ⟨by rw [v2_smul]; norm_num, ?_, fun a₁ a₂ b₁ b₂ ha => ?_⟩
  · rintro ⟨k, hk⟩; rw [v2_smul, v2_eq] at hk; obtain ⟨h1, h2⟩ := hk; linarith
  · simp only [v2_smul, v2_eq]
    constructor
    · rintro ⟨k, rfl, rfl⟩; ring
    · intro h
      rcases ha with ha | ha
      · exact ⟨b₁ / a₁, by field_simp, by field_simp; linarith⟩
      · exact ⟨b₂ / a₂, by field_simp; linarith, by field_simp⟩

/-- Premisli 1 in Pogoste napake: AB⃗ in CD⃗ sta lahko kolinearna (pri pravokotniku A(0, 0), B(1, 0), C(0, 1),
D(1, 1) je CD⃗ = AB⃗), točke pa niso na isti premici (A, B, C niso kolinearne).
trditev: MAT-SS-3/vektorji-v-geometriji#vzporedni-ne-ista
besedilo: »Kolinearna vektorja, torej točke na eni premici.** Iz $\overrightarrow{AB} = k\,\overrightarrow{CD}$ sklepaš, da so $A$, $B$, $C$, $D$ na isti premici.« -/
theorem vzporedni_ne_ista (A B C D : R2) (hA : A = !₂[0, 0]) (hB : B = !₂[1, 0]) (hC : C = !₂[0, 1])
    (hD : D = !₂[1, 1]) : D - C = (1:ℝ) • (B - A) ∧ ¬ Collinear ℝ ({A, B, C} : Set R2) := by
  subst hA hB hC hD
  refine ⟨by rw [v2_sub, v2_sub, v2_smul]; norm_num, ?_⟩
  rw [tocke_na_premici _ _ _ (by rw [Ne, v2_eq]; norm_num)]
  rintro ⟨k, hk⟩; rw [v2_sub, v2_sub, v2_smul, v2_eq] at hk; norm_num at hk

/-- Predpostavke `vzporedni_ne_ista` se dajo izpolniti. -/
example : ∃ A B C D : R2, A = !₂[0, 0] ∧ B = !₂[1, 0] ∧ C = !₂[0, 1] ∧ D = !₂[1, 1] :=
  ⟨_, _, _, _, rfl, rfl, rfl, rfl⟩

/-- Razlaga 4: 2·(2, 1) + 1·(−4, −2) = (0, 0), zato sta (2, 1) in (−4, −2) linearno odvisna.
trditev: MAT-SS-3/vektorji-v-geometriji#primer-odvisna
besedilo: »Ničelni vektor dobiš samo tako, da oba vzameš ničkrat. Sicer sta **linearno odvisna**. Primer: $2 \cdot (2, 1) + 1 \cdot (-4, -2) = (0, 0)$, zato sta $(2, 1)$ in $(-4, -2)$ odvisna.« -/
theorem primer_odvisna :
    (2:ℝ) • (!₂[2, 1] : R2) + (1:ℝ) • !₂[-4, -2] = 0 ∧ ¬ LinearIndependent ℝ ![(!₂[2, 1] : R2), !₂[-4, -2]] := by
  have h : (2:ℝ) • (!₂[2, 1] : R2) + (1:ℝ) • !₂[-4, -2] = 0 := by
    rw [v2_smul, v2_smul, v2_add]; ext i; fin_cases i <;> simp; norm_num
  refine ⟨h, fun hli => ?_⟩
  have := LinearIndependent.pair_iff.1 hli 2 1 h
  norm_num at this

/-! ## Rešeni primeri -/

/-- Primer 1: AB⃗ = (4 − 1, 4 − 2) = (3, 2), AC⃗ = (9, 6) = 3·(3, 2), AD⃗ = (6, 5) ni večkratnik (3, 2)
(6/3 = 2 ≠ 5/2 = 2,5); cesta pelje skozi C, ne pa skozi D; C je 3-krat dlje od A kot B.
trditev: MAT-SS-3/vektorji-v-geometriji#primer1
besedilo: »$\overrightarrow{AD} = (7 - 1, 7 - 2) = (6, 5)$. Prva komponenta da $k = \frac{6}{3} = 2$, druga $k = \frac{5}{2} = 2{,}5$. Enega samega $k$ ni, vektorja nista kolinearna.« -/
theorem primer1 :
    (!₂[4, 4] : R2) - !₂[1, 2] = !₂[3, 2] ∧ (!₂[10, 8] : R2) - !₂[1, 2] = !₂[9, 6] ∧
    (!₂[9, 6] : R2) = (3:ℝ) • !₂[3, 2] ∧ (!₂[7, 7] : R2) - !₂[1, 2] = !₂[6, 5] ∧
    (6:ℝ) / 3 = 2 ∧ (5:ℝ) / 2 = 2.5 ∧ (2:ℝ) ≠ 2.5 ∧
    Collinear ℝ ({!₂[1, 2], !₂[4, 4], !₂[10, 8]} : Set R2) ∧
    ¬ Collinear ℝ ({!₂[1, 2], !₂[4, 4], !₂[7, 7]} : Set R2) ∧
    ‖(!₂[10, 8] : R2) - !₂[1, 2]‖ = 3 * ‖(!₂[4, 4] : R2) - !₂[1, 2]‖ := by
  have hAB : (!₂[1, 2] : R2) ≠ !₂[4, 4] := by rw [Ne, v2_eq]; norm_num
  refine ⟨by rw [v2_sub]; norm_num, by rw [v2_sub]; norm_num, by rw [v2_smul]; norm_num,
    by rw [v2_sub]; norm_num, by norm_num, by norm_num, by norm_num, ?_, ?_, ?_⟩
  · rw [tocke_na_premici _ _ _ hAB]; exact ⟨3, by rw [v2_sub, v2_sub, v2_smul]; norm_num⟩
  · rw [tocke_na_premici _ _ _ hAB]
    rintro ⟨k, hk⟩; rw [v2_sub, v2_sub, v2_smul, v2_eq] at hk; obtain ⟨h1, h2⟩ := hk; norm_num at h1 h2
    linarith
  · rw [show (!₂[10, 8] : R2) - !₂[1, 2] = (3:ℝ) • (!₂[4, 4] - !₂[1, 2]) by
      rw [v2_sub, v2_sub, v2_smul]; norm_num, norm_smul]; norm_num

/-- Primer 2: T = ((1 + 7 + 4)/3, (1 + 4 + 7)/3) = (4, 4); pri AD : DB = 1 : 2 je r⃗_D = (2r⃗_A + r⃗_B)/3 =
((2 + 7)/3, (2 + 4)/3) = (3, 2); S = ((1 + 7)/2, (1 + 4)/2) = (4; 2,5); CT⃗ = (0, −3) = 2·TS⃗ = 2·(0; −1,5).
trditev: MAT-SS-3/vektorji-v-geometriji#primer2
besedilo: »Črpališče: $m = 1$, $n = 2$, zato $\vec r_D = \frac{2\vec r_A + \vec r_B}{3}$. Točka $A$ dobi utež $2$, ker je $D$ bližje njej. $x_D = \frac{2 + 7}{3} = 3$ in $y_D = \frac{2 + 4}{3} = 2$, torej $D(3, 2)$.« -/
theorem primer2 :
    (3:ℝ)⁻¹ • ((!₂[1, 1] : R2) + !₂[7, 4] + !₂[4, 7]) = !₂[(1 + 7 + 4) / 3, (1 + 4 + 7) / 3] ∧
    (!₂[(1 + 7 + 4) / 3, (1 + 4 + 7) / 3] : R2) = !₂[4, 4] ∧
    ((1:ℝ) + 2)⁻¹ • ((2:ℝ) • (!₂[1, 1] : R2) + (1:ℝ) • !₂[7, 4]) = !₂[(2 + 7) / 3, (2 + 4) / 3] ∧
    (!₂[(2 + 7) / 3, (2 + 4) / 3] : R2) = !₂[3, 2] ∧
    (2:ℝ)⁻¹ • ((!₂[1, 1] : R2) + !₂[7, 4]) = !₂[(1 + 7) / 2, (1 + 4) / 2] ∧
    (!₂[(1 + 7) / 2, (1 + 4) / 2] : R2) = !₂[4, 2.5] ∧
    (!₂[4, 4] : R2) - !₂[4, 7] = !₂[0, -3] ∧ (!₂[4, 2.5] : R2) - !₂[4, 4] = !₂[0, -1.5] ∧
    (!₂[0, -3] : R2) = (2:ℝ) • !₂[0, -1.5] := by
  refine ⟨?_, by norm_num, ?_, by norm_num, ?_, by norm_num, ?_, ?_, ?_⟩ <;>
    simp only [v2_add, v2_sub, v2_smul] <;> norm_num

/-- Pogoste napake (zamenjani uteži, težišče kot razpolovišče): (1·r⃗_A + 2·r⃗_B)/3 = (5, 3), kar je bližje B;
(1 + 7 + 4)/2 = 6 ≠ 4.
trditev: MAT-SS-3/vektorji-v-geometriji#napake-utezi
besedilo: »(višja raven) **Zamenjani uteži pri delilnem razmerju.** Kdor pri $AD : DB = 1 : 2$ računa $\frac{1 \cdot \vec r_A + 2\,\vec r_B}{3}$, dobi v Primeru 2 točko $(5, 3)$, ki je bližje $B$.« -/
theorem napake_utezi :
    (3:ℝ)⁻¹ • ((1:ℝ) • (!₂[1, 1] : R2) + (2:ℝ) • !₂[7, 4]) = !₂[5, 3] ∧ ((1:ℝ) + 7 + 4) / 2 = 6 ∧
    ((1:ℝ) + 7 + 4) / 2 ≠ 4 ∧ ‖(!₂[5, 3] : R2) - !₂[7, 4]‖ < ‖(!₂[5, 3] : R2) - !₂[1, 1]‖ := by
  refine ⟨by simp only [v2_add, v2_smul]; norm_num, by norm_num, by norm_num, ?_⟩
  rw [v2_sub, v2_sub, EuclideanSpace.norm_eq, EuclideanSpace.norm_eq]
  simp [Fin.sum_univ_two]
  exact Real.sqrt_lt_sqrt (by norm_num) (by norm_num)

/-- Primer 3: v paralelogramu ABCD (C = B + AD⃗) z neodvisnima a⃗ = AB⃗, b⃗ = AD⃗ in E = B + BC⃗/3
(AE⃗ = a⃗ + b⃗/3) je s(a⃗ + b⃗/3) = (1 − t)a⃗ + t b⃗ natanko pri s = 3/4, t = 1/4 (s = 1 − t, s/3 = t, 4s/3 = 1).
trditev: MAT-SS-3/vektorji-v-geometriji#primer3-koeficienta
besedilo: »Primerjamo koeficiente: $s = 1 - t$ in $\frac{s}{3} = t$. Vstavimo drugo v prvo: $s = 1 - \frac{s}{3}$, torej $\frac{4s}{3} = 1$ in $s = \frac{3}{4}$, $t = \frac{1}{4}$.« -/
theorem primer3_koeficienta (a b : V) (h : LinearIndependent ℝ ![a, b]) (s t : ℝ) :
    s • (a + (1 / 3 : ℝ) • b) = s • a + (s / 3) • b ∧
    (s • a + (s / 3) • b = (1 - t) • a + t • b ↔ s = 1 - t ∧ s / 3 = t) ∧
    ((s = 1 - t ∧ s / 3 = t) ↔ (4 * s / 3 = 1 ∧ t = s / 3)) ∧
    ((4 * s / 3 = 1 ∧ t = s / 3) ↔ s = 3 / 4 ∧ t = 1 / 4) := by
  refine ⟨by rw [smul_add, smul_smul]; ring_nf, ⟨fun he => ?_, fun ⟨h1, h2⟩ => by subst h2; rw [← h1]⟩,
    ⟨fun ⟨h1, h2⟩ => ⟨by linarith, h2.symm⟩, fun ⟨h1, h2⟩ => ⟨by linarith, h2.symm⟩⟩,
    ⟨fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩, fun ⟨h1, h2⟩ => by subst h1 h2; norm_num⟩⟩
  obtain ⟨-, h1, h2⟩ := primerjava_koeficientov a b h _ _ _ _ he
  exact ⟨h1, h2⟩

/-- Predpostavke `primer3_koeficienta` se dajo izpolniti (a⃗ = (6, 0), b⃗ = (3, 3) s slike). -/
example : LinearIndependent ℝ ![(!₂[6, 0] : R2), !₂[3, 3]] := by
  rw [LinearIndependent.pair_iff]
  intro s t h
  rw [v2_smul, v2_smul, v2_add] at h
  have h' : (!₂[s * 6 + t * 3, s * 0 + t * 3] : R2) = !₂[0, 0] := by rw [h]; ext i; fin_cases i <;> rfl
  rw [v2_eq] at h'; constructor <;> linarith [h'.1, h'.2]

/-- Primer 3, odgovor: P = A + (3/4)AE⃗ = B + (1/4)BD⃗ je edina skupna točka premic AE in BD; BP : PD = 1 : 3
(3·BP⃗ = 1·PD⃗) in AP : PE = 3 : 1 (1·AP⃗ = 3·PE⃗).
trditev: MAT-SS-3/vektorji-v-geometriji#primer3
besedilo: »$t = \frac{1}{4}$ pomeni, da je $BP$ četrtina diagonale $BD$: $BP : PD = 1 : 3$. Iz $s = \frac{3}{4}$ sledi $AP : PE = 3 : 1$.« -/
theorem primer3 (A B D : V) (h : LinearIndependent ℝ ![B - A, D - A]) (P : V) :
    ((∃ s : ℝ, P = A + s • ((B - A) + (1 / 3 : ℝ) • (D - A))) ∧ (∃ t : ℝ, P = B + t • (D - B)) ↔
      P = A + (3 / 4 : ℝ) • ((B - A) + (1 / 3 : ℝ) • (D - A))) ∧
    A + (3 / 4 : ℝ) • ((B - A) + (1 / 3 : ℝ) • (D - A)) = B + (1 / 4 : ℝ) • (D - B) ∧
    (3:ℝ) • ((B + (1 / 4 : ℝ) • (D - B)) - B) = (1:ℝ) • (D - (B + (1 / 4 : ℝ) • (D - B))) ∧
    (1:ℝ) • ((A + (3 / 4 : ℝ) • ((B - A) + (1 / 3 : ℝ) • (D - A))) - A) =
      (3:ℝ) • ((A + ((B - A) + (1 / 3 : ℝ) • (D - A))) - (A + (3 / 4 : ℝ) • ((B - A) + (1 / 3 : ℝ) • (D - A)))) := by
  have hP : A + (3 / 4 : ℝ) • ((B - A) + (1 / 3 : ℝ) • (D - A)) = B + (1 / 4 : ℝ) • (D - B) := by module
  refine ⟨⟨fun ⟨⟨s, hs⟩, ⟨t, ht⟩⟩ => ?_, fun hp => ⟨⟨3 / 4, hp⟩, ⟨1 / 4, hp.trans hP⟩⟩⟩, hP, by module, by module⟩
  have he : s • (B - A) + (s / 3) • (D - A) = (1 - t) • (B - A) + t • (D - A) := by
    have : A + s • ((B - A) + (1 / 3 : ℝ) • (D - A)) = B + t • (D - B) := hs.symm.trans ht
    have e1 : s • (B - A) + (s / 3) • (D - A) = (A + s • ((B - A) + (1 / 3 : ℝ) • (D - A))) - A := by module
    have e2 : (1 - t) • (B - A) + t • (D - A) = (B + t • (D - B)) - A := by module
    rw [e1, e2, this]
  obtain ⟨-, h1, h2⟩ := primerjava_koeficientov _ _ h _ _ _ _ he
  have hs' : s = 3 / 4 := by linarith
  rw [hs, hs']

/-- Predpostavka `primer3` se da izpolniti (A(0, 0), B(6, 0), D(3, 3) s slike). -/
example : LinearIndependent ℝ ![(!₂[6, 0] : R2) - !₂[0, 0], !₂[3, 3] - !₂[0, 0]] := by
  rw [LinearIndependent.pair_iff]
  intro s t h
  rw [v2_sub, v2_sub, v2_smul, v2_smul, v2_add] at h
  have h' : (!₂[s * (6 - 0) + t * (3 - 0), s * (0 - 0) + t * (3 - 0)] : R2) = !₂[0, 0] := by
    rw [h]; ext i; fin_cases i <;> rfl
  rw [v2_eq] at h'; constructor <;> linarith [h'.1, h'.2]

/-- Primer 3, slika: A(0, 0), B(6, 0), D(3, 3) da E = (7, 1) in P = (5,25; 0,75).
trditev: MAT-SS-3/vektorji-v-geometriji#primer3-slika
besedilo: »Prva komponenta: $p - 1 = 3 \cdot 2 = 6$, torej $p = 7$. Tretja komponenta: $q - 3 = 3 \cdot (-1) = -3$, torej $q = 0$.« -/
theorem primer3_slika :
    (!₂[6, 0] : R2) + (1 / 3 : ℝ) • ((!₂[9, 3] : R2) - !₂[6, 0]) = !₂[7, 1] ∧
    (!₂[0, 0] : R2) + (3 / 4 : ℝ) • ((!₂[7, 1] : R2) - !₂[0, 0]) = !₂[5.25, 0.75] ∧
    (!₂[6, 0] : R2) + (1 / 4 : ℝ) • ((!₂[3, 3] : R2) - !₂[6, 0]) = !₂[5.25, 0.75] := by
  refine ⟨?_, ?_, ?_⟩ <;> simp only [v2_add, v2_sub, v2_smul] <;> norm_num

/-- Primer 4: c⃗ = α a⃗ + β b⃗ ↔ (2 = α ∧ 7 = 2α + β ∧ 9 = 3β) ↔ α = 2 ∧ β = 3 (β = 7 − 2·2 = 3, 3·3 = 9);
c⃗ = 2a⃗ + 3b⃗, vektorji so koplanarni in odvisni: 2a⃗ + 3b⃗ − c⃗ = 0⃗.
trditev: MAT-SS-3/vektorji-v-geometriji#primer4
besedilo: »Po komponentah: $2 = 1 \cdot \alpha + 0 \cdot \beta$, $7 = 2\alpha + \beta$ in $9 = 0 \cdot \alpha + 3\beta$.« -/
theorem primer4 (α β : ℝ) :
    ((!₂[2, 7, 9] : R3) = α • !₂[1, 2, 0] + β • !₂[0, 1, 3] ↔ (2 = 1 * α + 0 * β ∧ 7 = 2 * α + β ∧
      9 = 0 * α + 3 * β)) ∧
    ((2 = 1 * α + 0 * β ∧ 7 = 2 * α + β ∧ 9 = 0 * α + 3 * β) ↔ α = 2 ∧ β = 3) ∧
    (7:ℝ) - 2 * 2 = 3 ∧ 3 * (3:ℝ) = 9 ∧
    (2:ℝ) • (!₂[1, 2, 0] : R3) + (3:ℝ) • !₂[0, 1, 3] - !₂[2, 7, 9] = 0 ∧
    ¬ LinearIndependent ℝ ![(!₂[1, 2, 0] : R3), !₂[0, 1, 3], !₂[2, 7, 9]] := by
  refine ⟨?_, ⟨fun ⟨h1, h2, h3⟩ => ⟨by linarith, by linarith⟩, fun ⟨h1, h2⟩ => by subst h1 h2; norm_num⟩,
    by norm_num, by norm_num, ?_, ?_⟩
  · rw [v3_smul, v3_smul, v3_add, v3_eq]
    constructor
    · rintro ⟨h1, h2, h3⟩; exact ⟨by linarith, by linarith, by linarith⟩
    · rintro ⟨h1, h2, h3⟩; exact ⟨by linarith, by linarith, by linarith⟩
  · rw [v3_smul, v3_smul, v3_add, v3_sub]; ext i; fin_cases i <;> simp <;> norm_num
  · intro hli
    rw [Fintype.linearIndependent_iff] at hli
    have := hli ![2, 3, -1] (by
      simp only [Fin.sum_univ_three, Matrix.cons_val_zero, Matrix.cons_val_one, Matrix.cons_val_two,
        Matrix.head_cons, Matrix.tail_cons]
      rw [v3_smul, v3_smul, v3_smul, v3_add, v3_add]; ext i; fin_cases i <;> simp <;> norm_num) 0
    norm_num at this

/-! ## Pogoste napake -/

/-- Pogoste napake: pri b⃗ = 2a⃗ je α a⃗ + β b⃗ = (α + 2β)a⃗ (vse kombinacije na eni premici); (1, 0) in (1, 1) sta
neodvisna, a nista pravokotna (skalarni produkt 1 ≠ 0).
trditev: MAT-SS-3/vektorji-v-geometriji#napake
besedilo: »Pri $\vec b = 2\vec a$ so vse kombinacije $\alpha\vec a + \beta\vec b = (\alpha + 2\beta)\vec a$ na eni premici.« -/
theorem napake (a : V) (α β : ℝ) :
    α • a + β • ((2:ℝ) • a) = (α + 2 * β) • a ∧
    LinearIndependent ℝ ![(!₂[1, 0] : R2), !₂[1, 1]] ∧ inner ℝ (!₂[1, 0] : R2) !₂[1, 1] ≠ 0 := by
  refine ⟨by rw [smul_smul, ← add_smul]; ring_nf, ?_, ?_⟩
  · rw [LinearIndependent.pair_iff]
    intro s t h
    rw [v2_smul, v2_smul, v2_add] at h
    have h' : (!₂[s * 1 + t * 1, s * 0 + t * 1] : R2) = !₂[0, 0] := by rw [h]; ext i; fin_cases i <;> rfl
    rw [v2_eq] at h'; constructor <;> linarith [h'.1, h'.2]
  · simp [EuclideanSpace.inner_eq_star_dotProduct, dotProduct, Fin.sum_univ_two]

/-! ## Za maturo -/

/-- Naloga 1: AB⃗ = (3 − 1, 1 + 2, 2 − 3) = (2, 3, −1), AC⃗ = (p − 1, 9, q − 3); A, B, C so na isti premici
natanko pri p = 7, q = 0 (9 = 3k da k = 3, p − 1 = 6, q − 3 = −3), C(7, 7, 0).
trditev: MAT-SS-3/vektorji-v-geometriji#naloga1
besedilo: »$\overrightarrow{AB} = (3 - 1, 1 + 2, 2 - 3) = (2, 3, -1)$ in $\overrightarrow{AC} = (p - 1, 9, q - 3)$.« -/
theorem naloga1 (p q : ℝ) :
    (!₂[3, 1, 2] : R3) - !₂[1, -2, 3] = !₂[2, 3, -1] ∧ (!₂[p, 7, q] : R3) - !₂[1, -2, 3] = !₂[p - 1, 9, q - 3] ∧
    (Collinear ℝ ({!₂[1, -2, 3], !₂[3, 1, 2], !₂[p, 7, q]} : Set R3) ↔ p = 7 ∧ q = 0) ∧
    (∀ k : ℝ, 9 = 3 * k ↔ k = 3) ∧ (p - 1 = 3 * 2 ↔ p = 7) ∧ (q - 3 = 3 * (-1) ↔ q = 0) := by
  refine ⟨by rw [v3_sub]; norm_num, by rw [v3_sub]; norm_num, ?_,
    fun k => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩⟩
  rw [tocke_na_premici _ _ _ (by rw [Ne, v3_eq]; norm_num)]
  simp only [v3_sub, v3_smul, v3_eq]
  constructor
  · rintro ⟨k, h1, h2, h3⟩
    have hk : k = 3 := by linarith
    subst hk; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; exact ⟨3, by norm_num, by norm_num, by norm_num⟩

/-- Naloga 2: α a⃗ + β b⃗ = (α + 2β, β, 2α − β); a) d⃗ = (4, 1, 3) = α a⃗ + β b⃗ ↔ α = 2 ∧ β = 1 (2·2 − 1 = 3);
b) a⃗, b⃗ nista kolinearna in a⃗, b⃗, c⃗ = (u, 3, 1) so koplanarni natanko pri u = 8 (β = 3, α = 2, u = 2 + 2·3);
c) e⃗ = (0, 1, 1) ni kombinacija (β = 1, α = −2, 2·(−2) − 1 = −5 ≠ 1), a⃗, b⃗, e⃗ niso koplanarni.
trditev: MAT-SS-3/vektorji-v-geometriji#naloga2
besedilo: »b) $(\alpha + 2\beta, \beta, 2\alpha - \beta) = (u, 3, 1)$: iz druge komponente $\beta = 3$, iz tretje $2\alpha - 3 = 1$, torej $\alpha = 2$. Prva komponenta da $u = 2 + 2 \cdot 3 = 8$.« -/
theorem naloga2 :
    (∀ α β : ℝ, α • (!₂[1, 0, 2] : R3) + β • !₂[2, 1, -1] = !₂[α + 2 * β, β, 2 * α - β]) ∧
    (∀ α β : ℝ, (!₂[4, 1, 3] : R3) = α • !₂[1, 0, 2] + β • !₂[2, 1, -1] ↔ α = 2 ∧ β = 1) ∧
    LinearIndependent ℝ ![(!₂[1, 0, 2] : R3), !₂[2, 1, -1]] ∧
    (∀ u : ℝ, ¬ LinearIndependent ℝ ![(!₂[1, 0, 2] : R3), !₂[2, 1, -1], !₂[u, 3, 1]] ↔ u = 8) ∧
    (2:ℝ) + 2 * 3 = 8 ∧ 2 * (-2:ℝ) - 1 = -5 ∧
    LinearIndependent ℝ ![(!₂[1, 0, 2] : R3), !₂[2, 1, -1], !₂[0, 1, 1]] := by
  have hc : ∀ α β : ℝ, α • (!₂[1, 0, 2] : R3) + β • !₂[2, 1, -1] = !₂[α + 2 * β, β, 2 * α - β] := by
    intro α β; rw [v3_smul, v3_smul, v3_add]; ext i; fin_cases i <;> simp <;> ring
  have hli : LinearIndependent ℝ ![(!₂[1, 0, 2] : R3), !₂[2, 1, -1]] := by
    rw [LinearIndependent.pair_iff]
    intro s t h
    rw [hc] at h
    have h' : (!₂[s + 2 * t, t, 2 * s - t] : R3) = !₂[0, 0, 0] := by rw [h]; ext i; fin_cases i <;> rfl
    rw [v3_eq] at h'; constructor <;> linarith [h'.1, h'.2.1, h'.2.2]
  refine ⟨hc, fun α β => ?_, hli, fun u => ?_, by norm_num, by norm_num, ?_⟩
  · rw [hc, v3_eq]
    constructor
    · rintro ⟨h1, h2, h3⟩; constructor <;> linarith
    · rintro ⟨rfl, rfl⟩; norm_num
  · rw [koplanarni _ _ _ hli]
    simp only [hc, v3_eq]
    constructor
    · rintro ⟨α, β, h1, h2, h3⟩; linarith
    · rintro rfl; exact ⟨2, 3, by norm_num, by norm_num, by norm_num⟩
  · apply not_not.mp
    rw [koplanarni _ _ _ hli]
    simp only [hc, v3_eq]
    rintro ⟨α, β, h1, h2, h3⟩; linarith

/-- Naloga 3 a), b): z a⃗ = AB⃗, b⃗ = AC⃗, AD⃗ = a⃗/3, AM⃗ = b⃗/2 je CD⃗ = a⃗/3 − b⃗, BM⃗ = b⃗/2 − a⃗; po poti čez CD
AQ⃗ = b⃗ + λ(a⃗/3 − b⃗) = (λ/3)a⃗ + (1 − λ)b⃗, po poti čez BM AQ⃗ = a⃗ + μ(b⃗/2 − a⃗) = (1 − μ)a⃗ + (μ/2)b⃗.
trditev: MAT-SS-3/vektorji-v-geometriji#naloga3ab
besedilo: »$\overrightarrow{AQ} = \vec b + \lambda\left(\frac{1}{3}\vec a - \vec b\right) = \frac{\lambda}{3}\vec a + (1 - \lambda)\vec b$« -/
theorem naloga3ab (A B C : V) (l μ : ℝ) :
    (A + (1 / 3 : ℝ) • (B - A)) - C = (1 / 3 : ℝ) • (B - A) - (C - A) ∧
    (A + (1 / 2 : ℝ) • (C - A)) - B = (1 / 2 : ℝ) • (C - A) - (B - A) ∧
    (C - A) + l • ((1 / 3 : ℝ) • (B - A) - (C - A)) = (l / 3) • (B - A) + (1 - l) • (C - A) ∧
    (B - A) + μ • ((1 / 2 : ℝ) • (C - A) - (B - A)) = (1 - μ) • (B - A) + (μ / 2) • (C - A) := by
  refine ⟨by abel, by abel, by module, by module⟩

/-- Naloga 3 c): pri neodvisnih a⃗, b⃗ se poti ujemata natanko pri λ = 3/5, μ = 4/5 (λ/3 = 1 − μ,
1 − λ = μ/2, 5λ/6 = 1/2); CQ : QD = 3 : 2 (2·CQ⃗ = 3·QD⃗) in BQ : QM = 4 : 1 (1·BQ⃗ = 4·QM⃗); AQ⃗ = a⃗/5 + 2b⃗/5.
trditev: MAT-SS-3/vektorji-v-geometriji#naloga3c
besedilo: »Iz prve enačbe $\mu = 1 - \frac{\lambda}{3}$, vstavimo v drugo: $1 - \lambda = \frac{1}{2} - \frac{\lambda}{6}$, torej $\frac{5\lambda}{6} = \frac{1}{2}$ in $\lambda = \frac{3}{5}$, $\mu = \frac{4}{5}$.« -/
theorem naloga3c (A B C : V) (h : LinearIndependent ℝ ![B - A, C - A]) (l μ : ℝ) :
    ((l / 3) • (B - A) + (1 - l) • (C - A) = (1 - μ) • (B - A) + (μ / 2) • (C - A) ↔ l = 3 / 5 ∧ μ = 4 / 5) ∧
    (∀ l μ : ℝ, (l / 3 = 1 - μ ∧ 1 - l = μ / 2) ↔ (μ = 1 - l / 3 ∧ 5 * l / 6 = 1 / 2)) ∧
    (2:ℝ) • ((C + (3 / 5 : ℝ) • ((A + (1 / 3 : ℝ) • (B - A)) - C)) - C) =
      (3:ℝ) • ((A + (1 / 3 : ℝ) • (B - A)) - (C + (3 / 5 : ℝ) • ((A + (1 / 3 : ℝ) • (B - A)) - C))) ∧
    (1:ℝ) • ((B + (4 / 5 : ℝ) • ((A + (1 / 2 : ℝ) • (C - A)) - B)) - B) =
      (4:ℝ) • ((A + (1 / 2 : ℝ) • (C - A)) - (B + (4 / 5 : ℝ) • ((A + (1 / 2 : ℝ) • (C - A)) - B))) ∧
    (C + (3 / 5 : ℝ) • ((A + (1 / 3 : ℝ) • (B - A)) - C)) - A = (1 / 5 : ℝ) • (B - A) + (2 / 5 : ℝ) • (C - A) := by
  refine ⟨⟨fun he => ?_, fun ⟨h1, h2⟩ => by subst h1 h2; module⟩,
    fun l μ => ⟨fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩, fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩⟩,
    by module, by module, by module⟩
  obtain ⟨-, h1, h2⟩ := primerjava_koeficientov _ _ h _ _ _ _ he
  constructor <;> linarith

/-- Predpostavke `naloga3c` se dajo izpolniti (a⃗ = (10, 5), b⃗ = (5, 10) iz točke d)). -/
example : LinearIndependent ℝ ![(!₂[10, 5] : R2) - !₂[0, 0], !₂[5, 10] - !₂[0, 0]] := by
  rw [LinearIndependent.pair_iff]
  intro s t h
  rw [v2_sub, v2_sub, v2_smul, v2_smul, v2_add] at h
  have h' : (!₂[s * (10 - 0) + t * (5 - 0), s * (5 - 0) + t * (10 - 0)] : R2) = !₂[0, 0] := by
    rw [h]; ext i; fin_cases i <;> rfl
  rw [v2_eq] at h'; constructor <;> linarith [h'.1, h'.2]

/-- Naloga 3 d): AQ⃗ = (1/5)(10, 5) + (2/5)(5, 10) = (2, 1) + (2, 4) = (4, 5), torej Q(4, 5); T = ((0 + 10 + 5)/3,
(0 + 5 + 10)/3) = (5, 5) ≠ Q, Q ni težišče.
trditev: MAT-SS-3/vektorji-v-geometriji#naloga3d
besedilo: »d) Iz koraka 3 je $\overrightarrow{AQ} = \frac{1}{5}\vec a + \frac{2}{5}\vec b$, kjer je $\vec a = (10, 5)$ in $\vec b = (5, 10)$. Torej $\overrightarrow{AQ} = (2, 1) + (2, 4) = (4, 5)$ in ker je $A$ izhodišče, je $Q(4, 5)$.« -/
theorem naloga3d :
    (1 / 5 : ℝ) • (!₂[10, 5] : R2) = !₂[2, 1] ∧ (2 / 5 : ℝ) • (!₂[5, 10] : R2) = !₂[2, 4] ∧
    (!₂[2, 1] : R2) + !₂[2, 4] = !₂[4, 5] ∧
    (3:ℝ)⁻¹ • ((!₂[0, 0] : R2) + !₂[10, 5] + !₂[5, 10]) = !₂[(0 + 10 + 5) / 3, (0 + 5 + 10) / 3] ∧
    (!₂[(0 + 10 + 5) / 3, (0 + 5 + 10) / 3] : R2) = !₂[5, 5] ∧ (!₂[4, 5] : R2) ≠ !₂[5, 5] := by
  refine ⟨?_, ?_, ?_, ?_, by norm_num, by rw [Ne, v2_eq]; norm_num⟩ <;>
    simp only [v2_add, v2_smul] <;> norm_num

/-- Ustno vprašanje 1: za neodvisna a⃗, b⃗ in c⃗ = a⃗ + b⃗ noben par ni kolinearen (a⃗, c⃗ in b⃗, c⃗ sta neodvisna),
vsi trije pa so koplanarni (odvisni).
trditev: MAT-SS-3/vektorji-v-geometriji#ustno1
besedilo: »Vzemimo nekolinearna vektorja $\vec a$ in $\vec b$ ter tretji vektor $\vec c = \vec a + \vec b$.« -/
theorem ustno1 (a b : V) (h : LinearIndependent ℝ ![a, b]) :
    LinearIndependent ℝ ![a, a + b] ∧ LinearIndependent ℝ ![b, a + b] ∧ ¬ LinearIndependent ℝ ![a, b, a + b] := by
  refine ⟨?_, ?_, (koplanarni a b _ h).2 ⟨1, 1, by simp⟩⟩ <;> rw [LinearIndependent.pair_iff] <;>
    intro s t hst
  · have := LinearIndependent.pair_iff.1 h (s + t) t (by rw [← hst]; module)
    constructor <;> linarith [this.1, this.2]
  · have := LinearIndependent.pair_iff.1 h t (s + t) (by rw [← hst]; module)
    constructor <;> linarith [this.1, this.2]

/-- Predpostavke `ustno1` se dajo izpolniti ((1, 0, 0) in (0, 1, 0) sta neodvisna). -/
example : LinearIndependent ℝ ![(!₂[1, 0, 0] : R3), !₂[0, 1, 0]] := by
  rw [LinearIndependent.pair_iff]
  intro s t h
  rw [v3_smul, v3_smul, v3_add] at h
  have h' : (!₂[s * 1 + t * 0, s * 0 + t * 1, s * 0 + t * 0] : R3) = !₂[0, 0, 0] := by
    rw [h]; ext i; fin_cases i <;> rfl
  rw [v3_eq] at h'; constructor <;> linarith [h'.1, h'.2.1]

/-! ## Preveri se -/

/-- Preveri se 1: vzhod (1, 0) in severovzhod (1, 1) sta neodvisna (le ničelna kombinacija da 0⃗), čeprav nista
pravokotna (glej `napake`); (1, 0) in (3, 0) sta kolinearna in zato odvisna.
trditev: MAT-SS-3/vektorji-v-geometriji#kviz1
besedilo: »Dolžina ne odloča: $(1, 0)$ in $(3, 0)$ imata različni dolžini, pa sta kolinearna in zato odvisna.« -/
theorem kviz1 :
    LinearIndependent ℝ ![(!₂[1, 0] : R2), !₂[1, 1]] ∧ ¬ LinearIndependent ℝ ![(!₂[1, 0] : R2), !₂[3, 0]] := by
  refine ⟨(napake (0 : R2) 0 0).2.1, ?_⟩
  rw [dva_odvisna]; left; exact ⟨3, by rw [v2_smul]; norm_num⟩

/-- Preveri se 3: b⃗ = (5, 5) − (1, 3) = (4, 2) = 2a⃗ za a⃗ = (2, 1), zato je α a⃗ + β b⃗ = (α + 2β)a⃗: vse kombinacije
ležijo na premici skozi O v smeri a⃗ (in vsaka točka te premice je kombinacija).
trditev: MAT-SS-3/vektorji-v-geometriji#kviz3
besedilo: »$\vec b = (4, 2) = 2\vec a$, zato je $\alpha\vec a + \beta\vec b = (\alpha + 2\beta)\vec a$. Vsi konci ležijo na eni premici.« -/
theorem kviz3 :
    (!₂[5, 5] : R2) - !₂[1, 3] = !₂[4, 2] ∧ (!₂[4, 2] : R2) = (2:ℝ) • !₂[2, 1] ∧
    ∀ v : R2, (∃ α β : ℝ, v = α • !₂[2, 1] + β • !₂[4, 2]) ↔ ∃ k : ℝ, v = k • !₂[2, 1] := by
  have hb : (!₂[4, 2] : R2) = (2:ℝ) • !₂[2, 1] := by rw [v2_smul]; norm_num
  refine ⟨by rw [v2_sub]; norm_num, hb, fun v => ⟨?_, fun ⟨k, hk⟩ => ⟨k, 0, by rw [hk]; simp⟩⟩⟩
  rintro ⟨α, β, rfl⟩
  exact ⟨α + 2 * β, by rw [hb, smul_smul, ← add_smul]; ring_nf⟩

/-- Preveri se 4: težišče A(2, −1), B(5, 3), C(−1, 7) ima y_T = (−1 + 3 + 7)/3 = 3 in x_T = (2 + 5 − 1)/3 = 2
(napačna 4,5 = 9/2 in 9 = −1 + 3 + 7).
trditev: MAT-SS-3/vektorji-v-geometriji#kviz4
besedilo: »$y_T = \frac{-1 + 3 + 7}{3} = 3$. Prva koordinata je $x_T = \frac{2 + 5 - 1}{3} = 2$.« -/
theorem kviz4 :
    (3:ℝ)⁻¹ • ((!₂[2, -1] : R2) + !₂[5, 3] + !₂[-1, 7]) = !₂[(2 + 5 - 1) / 3, (-1 + 3 + 7) / 3] ∧
    ((-1:ℝ) + 3 + 7) / 3 = 3 ∧ ((2:ℝ) + 5 - 1) / 3 = 2 ∧ ((-1:ℝ) + 3 + 7) / 2 = 4.5 ∧ (-1:ℝ) + 3 + 7 = 9 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  simp only [v2_add, v2_smul]; norm_num

/-- Preveri se 5: (p, 6) je vzporeden z (2, −3) natanko pri p = −4 (6 = −3k, k = −2, p = 2·(−2)).
trditev: MAT-SS-3/vektorji-v-geometriji#kviz5
besedilo: »Vzporedna smer pomeni $\vec b = k\vec a$. Iz druge komponente $6 = -3k$ dobiš $k = -2$, zato $p = 2 \cdot (-2) = -4$.« -/
theorem kviz5 (p : ℝ) :
    ((∃ k : ℝ, (!₂[p, 6] : R2) = k • !₂[2, -3]) ↔ p = -4) ∧ (∀ k : ℝ, 6 = -3 * k ↔ k = -2) ∧
    2 * (-2:ℝ) = -4 := by
  refine ⟨?_, fun k => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num⟩
  simp only [v2_smul, v2_eq]
  constructor
  · rintro ⟨k, h1, h2⟩; have : k = -2 := by linarith
    subst this; linarith
  · rintro rfl; exact ⟨-2, by norm_num, by norm_num⟩

/-- Blok RACUN (vrstice `vrednost`, ki niso že v drugih trditvah).
trditev: MAT-SS-3/vektorji-v-geometriji#racun
besedilo: »$\overrightarrow{AD} = (7 - 1, 7 - 2) = (6, 5)$. Prva komponenta da $k = \frac{6}{3} = 2$, druga $k = \frac{5}{2} = 2{,}5$. Enega samega $k$ ni, vektorja nista kolinearna.« -/
theorem racun :
    (9:ℝ) / 3 = 3 ∧ (6:ℝ) / 2 = 3 ∧ (6:ℝ) / 3 = 2 ∧ (5:ℝ) / 2 = 2.5 ∧ ((1:ℝ) + 7 + 4) / 3 = 4 ∧
    ((1:ℝ) + 4 + 7) / 3 = 4 ∧ (2 * (1:ℝ) + 7) / 3 = 3 ∧ (2 * (1:ℝ) + 4) / 3 = 2 ∧ ((1:ℝ) + 4) / 2 = 2.5 ∧
    (1 * (1:ℝ) + 2 * 7) / 3 = 5 ∧ 3 * (3:ℝ) = 9 ∧ 2 * (2:ℝ) - 1 = 3 ∧ (∀ x : ℝ, 2 * x - 3 = 1 ↔ x = 2) ∧
    (∀ x y : ℝ, (x + 2 * y = 4 ∧ y = 1) ↔ x = 2 ∧ y = 1) ∧ (∀ b : ℝ, 7 = 2 * 2 + b ↔ b = 3) ∧
    (1 / 5 : ℝ) * 10 + (2 / 5) * 5 = 4 ∧ (1 / 5 : ℝ) * 5 + (2 / 5) * 10 = 5 ∧ ((0:ℝ) + 10 + 5) / 3 = 5 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num,
    fun x => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    fun x y => ⟨fun ⟨h1, h2⟩ => ⟨by linarith, h2⟩, fun ⟨h1, h2⟩ => by subst h1 h2; norm_num⟩,
    fun b => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num⟩

end Evklid.Lekcije.MAT_SS_3.VektorjiVGeometriji
