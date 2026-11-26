/-
vir: content/lessons/MAT-SS-3/vektorji-v-ravnini-in-prostoru.md
sha256: 4f7db1991ad5910c706ce288fb6571680858c2329cdd50d9d1d24fd3e9e7f46a
Model: vektor ravnine/prostora je element `EuclideanSpace ℝ (Fin 2)` / `(Fin 3)` (`!₂[a_x, a_y, a_z]`),
dolžina je evklidska norma, točka je dana s krajevnim vektorjem; »enako usmerjena« = `SameRay`, kolinearna
oziroma koplanarni = linearno odvisni, nekolinearna oziroma nekoplanarni = `LinearIndependent`.
Ni v Leanu: uvodna zgodba in fizikalne razlage (»tok kajaka ne upočasni«, »del truda se izniči«);
definicija vektorja kot razreda puščic (le kot model: puščica od P do P + v⃗ je v⃗ za vsak P); opis
koordinatnega sistema; risba vlačilcev (dokazane so koordinate) in simulacija; geometrijska utemeljitev pri
saneh z rombom in enakostraničnima trikotnikoma (dokazan je rezultat z računom, s kotom 2π/3 in s kosinusnim
izrekom); pri Nalogi 2 c) »romb s pravim kotom je kvadrat« kot geometrijski sklep (dokazane so vse štiri
stranice 3, AB⃗·BC⃗ = 0 in z obratom Pitagorovega izreka ∠ABC = π/2, `naloga2c_pravi_kot`); Preveri se 1 (definicija istega vektorja, ni računska
trditev); besedne utemeljitve Ustnih vprašanj (vsebina je v splošnih trditvah); »Drugače« (analogija);
točkovanje.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.VektorjiVRavniniInProstoru

open InnerProductGeometry Real

/-! ## Model: vektorji ravnine in prostora po komponentah -/

/-- Ravnina ℝ² (vektor `!₂[a_x, a_y]`, dolžina je evklidska norma). -/
abbrev R2 := EuclideanSpace ℝ (Fin 2)

/-- Prostor ℝ³ (vektor `!₂[a_x, a_y, a_z]`). -/
abbrev R3 := EuclideanSpace ℝ (Fin 3)

/-- Razlaga in Povzetek: a⃗ + b⃗ = (a_x + b_x, a_y + b_y) v ravnini. -/
theorem vsota2 (a₁ a₂ b₁ b₂ : ℝ) : (!₂[a₁, a₂] : R2) + !₂[b₁, b₂] = !₂[a₁ + b₁, a₂ + b₂] := by
  ext i; fin_cases i <;> simp

/-- Razlaga in Povzetek: a⃗ + b⃗ = (a_x + b_x, a_y + b_y, a_z + b_z) v prostoru. -/
theorem vsota3 (a₁ a₂ a₃ b₁ b₂ b₃ : ℝ) :
    (!₂[a₁, a₂, a₃] : R3) + !₂[b₁, b₂, b₃] = !₂[a₁ + b₁, a₂ + b₂, a₃ + b₃] := by
  ext i; fin_cases i <;> simp

/-- Razlaga in Povzetek: razlika po komponentah v ravnini. -/
theorem razlika2 (a₁ a₂ b₁ b₂ : ℝ) : (!₂[a₁, a₂] : R2) - !₂[b₁, b₂] = !₂[a₁ - b₁, a₂ - b₂] := by
  ext i; fin_cases i <;> simp

/-- Razlaga in Povzetek: razlika po komponentah v prostoru. -/
theorem razlika3 (a₁ a₂ a₃ b₁ b₂ b₃ : ℝ) :
    (!₂[a₁, a₂, a₃] : R3) - !₂[b₁, b₂, b₃] = !₂[a₁ - b₁, a₂ - b₂, a₃ - b₃] := by
  ext i; fin_cases i <;> simp

/-- Razlaga in Povzetek: k·a⃗ = (k a_x, k a_y) v ravnini. -/
theorem produkt2 (k a₁ a₂ : ℝ) : k • (!₂[a₁, a₂] : R2) = !₂[k * a₁, k * a₂] := by
  ext i; fin_cases i <;> simp

/-- Razlaga in Povzetek: k·a⃗ = (k a_x, k a_y, k a_z) v prostoru. -/
theorem produkt3 (k a₁ a₂ a₃ : ℝ) : k • (!₂[a₁, a₂, a₃] : R3) = !₂[k * a₁, k * a₂, k * a₃] := by
  ext i; fin_cases i <;> simp

/-- Razlaga in Povzetek: |a⃗| = √(a_x² + a_y²) v ravnini (Pitagorov izrek). -/
theorem dolzina2 (a₁ a₂ : ℝ) : ‖(!₂[a₁, a₂] : R2)‖ = √(a₁ ^ 2 + a₂ ^ 2) := by
  rw [EuclideanSpace.norm_eq]; simp [Fin.sum_univ_two]

/-- Razlaga in Povzetek: |a⃗| = √(a_x² + a_y² + a_z²) v prostoru. -/
theorem dolzina3 (a₁ a₂ a₃ : ℝ) : ‖(!₂[a₁, a₂, a₃] : R3)‖ = √(a₁ ^ 2 + a₂ ^ 2 + a₃ ^ 2) := by
  rw [EuclideanSpace.norm_eq]; simp [Fin.sum_univ_three]

/-! ## Splošna pravila -/

/-- Razlaga (isti vektor, vzporedni premik): puščica od P do P + v⃗ predstavlja vektor v⃗ ne glede na
začetek P; vektor, ki premakne A v B, je natanko r⃗_B − r⃗_A (AB⃗ = r⃗_B − r⃗_A). -/
theorem vektor_med_tockama (A B P Q v : R3) :
    (P + v) - P = (Q + v) - Q ∧ (A + v = B ↔ v = B - A) := by
  refine ⟨by simp, ⟨fun h => by rw [← h]; simp, fun h => by rw [h]; simp⟩⟩

/-- Razlaga (pravilo trikotnika in paralelograma, Ustno vprašanje 2): AB⃗ + BC⃗ = AC⃗; v paralelogramu z
B = A + a⃗, D = A + b⃗ je C = B + b⃗ = D + a⃗, diagonala AC⃗ = a⃗ + b⃗ = b⃗ + a⃗. -/
theorem trikotnik_paralelogram (A B C : R3) (a b : R3) :
    (B - A) + (C - B) = C - A ∧ (A + a) + b = (A + b) + a ∧ ((A + a) + b) - A = a + b ∧ a + b = b + a := by
  refine ⟨by abel, by abel, by abel, add_comm a b⟩

/-- Bolj natančno, pravila računanja: komutativnost, asociativnost, ničelni in nasprotni vektor,
distributivnosti, k(m a⃗) = (km)a⃗ in 1·a⃗ = a⃗. -/
theorem pravila_racunanja (a b c : R3) (k m : ℝ) :
    a + b = b + a ∧ (a + b) + c = a + (b + c) ∧ a + 0 = a ∧ a + (-a) = 0 ∧
    k • (a + b) = k • a + k • b ∧ (k + m) • a = k • a + m • a ∧ k • (m • a) = (k * m) • a ∧
    (1:ℝ) • a = a :=
  ⟨add_comm a b, add_assoc a b c, add_zero a, add_neg_cancel a, smul_add k a b, add_smul k m a,
    smul_smul k m a, one_smul ℝ a⟩

/-- Razlaga: a⃗ + a⃗ = 2a⃗; (−1)a⃗ = −a⃗ je enako dolg kot a⃗; a⃗ − b⃗ = a⃗ + (−b⃗); 0·a⃗ = 0⃗. -/
theorem nasprotni_vektor (a b : R3) :
    a + a = (2:ℝ) • a ∧ (-1:ℝ) • a = -a ∧ ‖-a‖ = ‖a‖ ∧ a - b = a + (-b) ∧ (0:ℝ) • a = 0 :=
  ⟨by rw [two_smul], by simp, norm_neg a, sub_eq_add_neg a b, zero_smul ℝ a⟩

/-- Razlaga, tabela in Povzetek: |k a⃗| = |k|·|a⃗|; pri k > 0 ostane usmerjenost (k a⃗ kaže kot a⃗), pri k < 0
se obrne (k a⃗ kaže kot −a⃗). -/
theorem mnozenje_s_skalarjem (k : ℝ) (a : R3) :
    ‖k • a‖ = |k| * ‖a‖ ∧ (0 < k → SameRay ℝ a (k • a)) ∧ (k < 0 → SameRay ℝ (-a) (k • a)) := by
  refine ⟨by rw [norm_smul, Real.norm_eq_abs], fun hk => SameRay.sameRay_pos_smul_right a hk,
    fun hk => ?_⟩
  have : k • a = (-k) • (-a) := by rw [smul_neg, neg_smul, neg_neg]
  rw [this]; exact SameRay.sameRay_pos_smul_right (-a) (by linarith)

/-- Razlaga, tabela: pri k > 1 se dolžina poveča, pri 0 < k < 1 zmanjša (za a⃗ ≠ 0⃗). -/
theorem dolzina_povecanje (k : ℝ) (a : R3) (ha : a ≠ 0) :
    (1 < k → ‖a‖ < ‖k • a‖) ∧ (0 < k → k < 1 → ‖k • a‖ < ‖a‖) := by
  have hn : 0 < ‖a‖ := norm_pos_iff.2 ha
  rw [norm_smul, Real.norm_eq_abs]
  refine ⟨fun hk => ?_, fun hk0 hk1 => ?_⟩
  · rw [abs_of_pos (by linarith)]; nlinarith
  · rw [abs_of_pos hk0]; nlinarith

/-- Predpostavka `dolzina_povecanje` se da izpolniti (a⃗ = (1, 0, 0)). -/
example : (!₂[1, 0, 0] : R3) ≠ 0 := by
  intro h; have := congrArg (fun v : R3 => v 0) h; simp at this

/-- Premisli 2, Pogoste napake, Preveri se 3: |−2a⃗| = 2|a⃗| (ne −2|a⃗|, ki je za a⃗ ≠ 0⃗ negativno);
−2a⃗ je obrnjen (kaže kot −a⃗). -/
theorem minus_dva (a : R3) (ha : a ≠ 0) :
    ‖(-2:ℝ) • a‖ = 2 * ‖a‖ ∧ ‖(-2:ℝ) • a‖ ≠ -2 * ‖a‖ ∧ SameRay ℝ (-a) ((-2:ℝ) • a) := by
  have hn : 0 < ‖a‖ := norm_pos_iff.2 ha
  have h1 : ‖(-2:ℝ) • a‖ = 2 * ‖a‖ := by rw [norm_smul]; norm_num
  refine ⟨h1, by rw [h1]; intro h; linarith, (mnozenje_s_skalarjem (-2) a).2.2 (by norm_num)⟩

/-- Predpostavka `minus_dva` se da izpolniti (a⃗ = (1, 0, 0)). -/
example : (!₂[1, 0, 0] : R3) ≠ 0 := by
  intro h; have := congrArg (fun v : R3 => v 0) h; simp at this

/-- Povzetek in Bolj natančno (trikotniška neenakost, Premisli 1): |a⃗ + b⃗| ≤ |a⃗| + |b⃗|, enakost natanko
tedaj, ko sta vektorja enako usmerjena (SameRay). -/
theorem trikotniska_neenakost (a b : R3) :
    ‖a + b‖ ≤ ‖a‖ + ‖b‖ ∧ (‖a + b‖ = ‖a‖ + ‖b‖ ↔ SameRay ℝ a b) :=
  ⟨norm_add_le a b, sameRay_iff_norm_add.symm⟩

/-- Razlaga (kolinearnost, Ustno vprašanje 1): za a⃗ ≠ 0⃗ sta a⃗ in b⃗ linearno odvisna (kolinearna) natanko
tedaj, ko je b⃗ = k a⃗ za neko število k. -/
theorem kolinearna (a b : R3) (ha : a ≠ 0) : ¬ LinearIndependent ℝ ![a, b] ↔ ∃ k : ℝ, b = k • a := by
  rw [LinearIndependent.pair_iff]
  push Not
  constructor
  · rintro ⟨s, t, h, hst⟩
    have ht : t ≠ 0 := by
      intro ht; subst ht
      have : s = 0 := by simpa [ha] using h
      exact hst this rfl
    refine ⟨-s / t, ?_⟩
    have : t • b = -(s • a) := by rw [eq_neg_iff_add_eq_zero, add_comm]; exact h
    calc b = t⁻¹ • (t • b) := by rw [smul_smul, inv_mul_cancel₀ ht, one_smul]
      _ = (-s / t) • a := by rw [this, smul_neg, smul_smul, ← neg_smul]; congr 1; field_simp
  · rintro ⟨k, rfl⟩
    exact ⟨k, -1, by rw [smul_smul, neg_one_mul, neg_smul, add_neg_cancel], fun _ => by norm_num⟩

/-- Predpostavka `kolinearna` se da izpolniti (a⃗ = (2, −2, −3) iz Naloge 1). -/
example : (!₂[2, -2, -3] : R3) ≠ 0 := by
  intro h; have := congrArg (fun v : R3 => v 0) h; simp at this

/-- Ustno vprašanje 1: če a⃗, b⃗ nista kolinearna, so a⃗, b⃗, c⃗ koplanarni (linearno odvisni) natanko tedaj, ko je
c⃗ = k a⃗ + m b⃗. -/
theorem koplanarni (a b c : R3) (hab : LinearIndependent ℝ ![a, b]) :
    ¬ LinearIndependent ℝ ![a, b, c] ↔ ∃ k m : ℝ, c = k • a + m • b := by
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

/-- Predpostavka `koplanarni` se da izpolniti (AB⃗ = (2, 2, 1), BC⃗ = (−2, 1, 2) iz Naloge 2). -/
example : LinearIndependent ℝ ![(!₂[2, 2, 1] : R3), !₂[-2, 1, 2]] := by
  rw [LinearIndependent.pair_iff]
  intro s t h
  have h0 := congrArg (fun v : R3 => v 0) h
  have h1 := congrArg (fun v : R3 => v 1) h
  simp at h0 h1
  constructor <;> linarith

/-- Razlaga (baza): n linearno neodvisnih vektorjev v ℝⁿ (za n = 2 nekolinearna v ravnini, za n = 3
nekoplanarni v prostoru) tvori bazo: vsak vektor je na en sam način linearna kombinacija ∑ gᵢ·wᵢ. -/
theorem razvoj_po_bazi (n : ℕ) [NeZero n] (w : Fin n → EuclideanSpace ℝ (Fin n))
    (h : LinearIndependent ℝ w) (v : EuclideanSpace ℝ (Fin n)) :
    ∃! g : Fin n → ℝ, v = ∑ i, g i • w i := by
  let B := basisOfLinearIndependentOfCardEqFinrank h (by simp)
  have hB : ⇑B = w := coe_basisOfLinearIndependentOfCardEqFinrank h _
  refine ⟨B.repr v, ?_, fun g hg => ?_⟩
  · simp only
    conv_lhs => rw [← B.sum_repr v]
    rw [hB]
  · have := B.repr_sum_self g
    rw [hB, ← hg] at this
    exact this.symm

/-- Predpostavke `razvoj_po_bazi` se dajo izpolniti (n = 2, baza (1, 1), (1, −1) iz Ustnega vprašanja 3). -/
example : LinearIndependent ℝ ![(!₂[1, 1] : R2), !₂[1, -1]] := by
  rw [LinearIndependent.pair_iff]
  intro s t h
  have h0 := congrArg (fun v : R2 => v 0) h
  have h1 := congrArg (fun v : R2 => v 1) h
  simp at h0 h1
  constructor <;> linarith

/-- Bolj natančno (standardna baza): a⃗ = a_x i⃗ + a_y j⃗ + a_z k⃗ z i⃗ = (1, 0, 0), j⃗ = (0, 1, 0), k⃗ = (0, 0, 1). -/
theorem standardna_baza (a₁ a₂ a₃ : ℝ) :
    (!₂[a₁, a₂, a₃] : R3) = a₁ • !₂[1, 0, 0] + a₂ • !₂[0, 1, 0] + a₃ • !₂[0, 0, 1] := by
  ext i; fin_cases i <;> simp

/-- Razlaga (razstavljanje sile): kadar sta smeri a⃗, b⃗ pravokotni (⟨a⃗, b⃗⟩ = 0, a⃗ ≠ 0⃗) in F⃗ = k a⃗ + m b⃗, je
komponenta k a⃗ pravokotna projekcija sile na smer a⃗: k a⃗ = (⟨F⃗, a⃗⟩/|a⃗|²) a⃗. -/
theorem pravokotni_smeri (a b F : R2) (k m : ℝ) (ha : a ≠ 0) (hab : inner ℝ a b = 0)
    (hF : F = k • a + m • b) : k • a = (inner ℝ F a / ‖a‖ ^ 2) • a := by
  have hn : ‖a‖ ^ 2 ≠ 0 := by positivity
  have : inner ℝ F a = k * ‖a‖ ^ 2 := by
    rw [hF, inner_add_left, real_inner_smul_left, real_inner_smul_left, real_inner_comm a b, hab,
      real_inner_self_eq_norm_sq]
    ring
  rw [this, mul_div_cancel_right₀ _ hn]

/-- Predpostavke `pravokotni_smeri` se dajo izpolniti (a⃗ = (1, 0), b⃗ = (0, 1)). -/
example : (!₂[1, 0] : R2) ≠ 0 ∧ inner ℝ (!₂[1, 0] : R2) !₂[0, 1] = 0 := by
  refine ⟨fun h => ?_, ?_⟩
  · have := congrArg (fun v : R2 => v 0) h; simp at this
  · simp [EuclideanSpace.inner_eq_star_dotProduct, dotProduct, Fin.sum_univ_two]

/-! ## Uganka s sanmi in sile pod kotom -/

/-- Pomožno za sani in Preveri se 2: |x⃗ + y⃗|² = |x⃗|² + |y⃗|² + 2|x⃗||y⃗| cos φ, φ kot med vektorjema. -/
theorem vsota_pod_kotom (x y : R2) :
    ‖x + y‖ = √(‖x‖ ^ 2 + ‖y‖ ^ 2 + 2 * ‖x‖ * ‖y‖ * Real.cos (angle x y)) := by
  rw [← Real.sqrt_sq (norm_nonneg (x + y)), norm_add_sq_real, ← cos_angle_mul_norm_mul_norm]
  congr 1; ring

/-- Uganka s sanmi: cos 120° = −1/2 (120° = π − π/3) in sosednji kot romba je 180° − 120° = 60°. -/
theorem cos_120 : Real.cos (2 * π / 3) = -1 / 2 ∧ π - 2 * π / 3 = π / 3 := by
  refine ⟨?_, by ring⟩
  rw [show 2 * π / 3 = π - π / 3 by ring, Real.cos_pi_sub, Real.cos_pi_div_three]; norm_num

/-- Uganka s sanmi: dve sili po 300 N pod kotom 120° dasta skupno silo 300 N. -/
theorem sani (F₁ F₂ : R2) (h₁ : ‖F₁‖ = 300) (h₂ : ‖F₂‖ = 300) (hk : angle F₁ F₂ = 2 * π / 3) :
    ‖F₁ + F₂‖ = 300 := by
  rw [vsota_pod_kotom, h₁, h₂, hk, cos_120.1, show (300:ℝ) ^ 2 + 300 ^ 2 + 2 * 300 * 300 * (-1 / 2) = 300 ^ 2 by
    norm_num, Real.sqrt_sq (by norm_num)]

/-- Predpostavke `sani` se dajo izpolniti: F⃗₁ = (300, 0), F⃗₂ = (−150, 150√3), oba dolga 300, vsota
(150, 150√3) dolga √(22500 + 67500) = 300. -/
example : ‖(!₂[300, 0] : R2)‖ = 300 ∧ ‖(!₂[-150, 150 * √3] : R2)‖ = 300 ∧
    (!₂[300, 0] : R2) + !₂[-150, 150 * √3] = !₂[150, 150 * √3] ∧ ‖(!₂[150, 150 * √3] : R2)‖ = 300 := by
  have h3 : √3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  refine ⟨?_, ?_, by rw [vsota2]; norm_num, ?_⟩ <;> rw [dolzina2]
  · rw [show (300:ℝ) ^ 2 + 0 ^ 2 = 300 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (-150:ℝ) ^ 2 + (150 * √3) ^ 2 = 300 ^ 2 by rw [mul_pow, h3]; norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (150:ℝ) ^ 2 + (150 * √3) ^ 2 = 300 ^ 2 by rw [mul_pow, h3]; norm_num, Real.sqrt_sq (by norm_num)]

/-- Predpostavke `sani` so izpolnjene tudi s kotom: med (300, 0) in (−150, 150√3) je kot 2π/3. -/
example : angle (!₂[300, 0] : R2) !₂[-150, 150 * √3] = 2 * π / 3 := by
  have h3 : √3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have n1 : ‖(!₂[300, 0] : R2)‖ = 300 := by
    rw [dolzina2, show (300:ℝ) ^ 2 + 0 ^ 2 = 300 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have n2 : ‖(!₂[-150, 150 * √3] : R2)‖ = 300 := by
    rw [dolzina2, show (-150:ℝ) ^ 2 + (150 * √3) ^ 2 = 300 ^ 2 by rw [mul_pow, h3]; norm_num,
      Real.sqrt_sq (by norm_num)]
  unfold angle
  rw [n1, n2]
  have : inner ℝ (!₂[300, 0] : R2) !₂[-150, 150 * √3] = -45000 := by
    simp [EuclideanSpace.inner_eq_star_dotProduct, dotProduct, Fin.sum_univ_two]; norm_num
  rw [this, show (-45000:ℝ) / (300 * 300) = -1 / 2 by norm_num, ← cos_120.1,
    Real.arccos_cos (by positivity) (by nlinarith [Real.pi_pos])]

/-- Uganka s sanmi (kosinusni izrek): |F⃗|² = 300² + 300² − 2·300·300·cos 60° = 300². -/
theorem sani_kosinusni : (300:ℝ) ^ 2 + 300 ^ 2 - 2 * 300 * 300 * Real.cos (π / 3) = 300 ^ 2 := by
  rw [Real.cos_pi_div_three]; norm_num

/-- Preveri se 2: dve sili po 5 N pod kotom 0°, 90°, 120°, 180° dasta 10 N, 5√2 ≈ 7,07 N, 5 N in 0 N; večji
kot pomeni manjšo vsoto. -/
theorem kviz_sile (F₁ F₂ : R2) (h₁ : ‖F₁‖ = 5) (h₂ : ‖F₂‖ = 5) :
    (angle F₁ F₂ = 0 → ‖F₁ + F₂‖ = 10) ∧ (angle F₁ F₂ = π / 2 → ‖F₁ + F₂‖ = 5 * √2) ∧
    (angle F₁ F₂ = 2 * π / 3 → ‖F₁ + F₂‖ = 5) ∧ (angle F₁ F₂ = π → ‖F₁ + F₂‖ = 0) ∧
    |5 * √2 - 7.07| < 0.005 ∧ (0:ℝ) < 5 ∧ (5:ℝ) < 5 * √2 ∧ 5 * √2 < (10:ℝ) := by
  have h2 : (1.414:ℝ) < √2 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have h2' : √2 < (1.415:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  refine ⟨fun hk => ?_, fun hk => ?_, fun hk => ?_, fun hk => ?_, by rw [abs_lt]; constructor <;> linarith,
    by norm_num, by linarith, by linarith⟩ <;> rw [vsota_pod_kotom, h₁, h₂, hk]
  · rw [Real.cos_zero, show (5:ℝ) ^ 2 + 5 ^ 2 + 2 * 5 * 5 * 1 = 10 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [Real.cos_pi_div_two, show (5:ℝ) ^ 2 + 5 ^ 2 + 2 * 5 * 5 * 0 = 5 ^ 2 * 2 by norm_num,
      Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  · rw [cos_120.1, show (5:ℝ) ^ 2 + 5 ^ 2 + 2 * 5 * 5 * (-1 / 2) = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [Real.cos_pi]; norm_num

/-- Predpostavke `kviz_sile` se dajo izpolniti (F⃗₁ = F⃗₂ = (5, 0)). -/
example : ‖(!₂[5, 0] : R2)‖ = 5 := by
  rw [dolzina2, show (5:ℝ) ^ 2 + 0 ^ 2 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-! ## Razlaga: številski primeri -/

/-- Razlaga, prvi primer (podaji): (12, 5) + (3, 4) = (15, 9); dolžini √(12² + 5²) = 13 in √(3² + 4²) = 5,
skupaj 18; razdalja od izhodišča √(15² + 9²) = √306 ≈ 17,5 < 18 (dolžini se ne seštejeta). -/
theorem podaji :
    (!₂[12, 5] : R2) + !₂[3, 4] = !₂[15, 9] ∧ ‖(!₂[12, 5] : R2)‖ = 13 ∧ ‖(!₂[3, 4] : R2)‖ = 5 ∧
    (13:ℝ) + 5 = 18 ∧ ‖(!₂[15, 9] : R2)‖ = √306 ∧ |√306 - 17.5| < 0.05 ∧ √306 < 18 := by
  have a : (17.45:ℝ) < √306 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have b : √306 < (17.55:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  refine ⟨by rw [vsota2]; norm_num, ?_, ?_, by norm_num, by rw [dolzina2]; norm_num,
    by rw [abs_lt]; constructor <;> linarith, by linarith⟩ <;> rw [dolzina2]
  · rw [show (12:ℝ) ^ 2 + 5 ^ 2 = 13 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (3:ℝ) ^ 2 + 4 ^ 2 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Razlaga (krajevni vektor, dron): AB⃗ = r⃗_B − r⃗_A = (4 − 1, 6 − 2, 12 − 0) = (3, 4, 12), dolžina
√(9 + 16 + 144) = 13; krajevni vektor žoge na koncu je (15, 9). -/
theorem dron :
    (!₂[4, 6, 12] : R3) - !₂[1, 2, 0] = !₂[4 - 1, 6 - 2, 12 - 0] ∧
    (!₂[4 - 1, 6 - 2, 12 - 0] : R3) = !₂[3, 4, 12] ∧ ‖(!₂[3, 4, 12] : R3)‖ = √(9 + 16 + 144) ∧
    √((9:ℝ) + 16 + 144) = 13 ∧ (!₂[15, 9] : R2) - 0 = !₂[15, 9] := by
  refine ⟨razlika3 _ _ _ _ _ _, by norm_num, by rw [dolzina3]; norm_num, ?_, sub_zero _⟩
  rw [show (9:ℝ) + 16 + 144 = 13 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Razlaga (vlačilca na sliki): pri enoti 10 kN sta F⃗₁ = (3, 1) → (30, 10) kN in F⃗₂ = (2, 4) → (20, 40) kN,
(3, 1) + (2, 4) = (5, 5) ↔ (50, 50) kN, (2, 4) = 2·(1, 2). -/
theorem vlacilca_slika :
    (!₂[3, 1] : R2) + !₂[2, 4] = !₂[5, 5] ∧ (10:ℝ) • (!₂[3, 1] : R2) = !₂[30, 10] ∧
    (10:ℝ) • (!₂[2, 4] : R2) = !₂[20, 40] ∧ (10:ℝ) • (!₂[5, 5] : R2) = !₂[50, 50] ∧
    (!₂[2, 4] : R2) = (2:ℝ) • !₂[1, 2] := by
  refine ⟨by rw [vsota2]; norm_num, by rw [produkt2]; norm_num, by rw [produkt2]; norm_num,
    by rw [produkt2]; norm_num, by rw [produkt2]; norm_num⟩

/-! ## Rešeni primeri -/

/-- Primer 1: 2a⃗ = (2·4, 2·(−1)) = (8, −2), s⃗ = (8 + (−2), −2 + 3) = (6, 1), |s⃗| = √(6² + 1²) = √37 ≈ 6,08
(≈ 6,1). -/
theorem primer1 :
    (2:ℝ) • (!₂[4, -1] : R2) = !₂[2 * 4, 2 * (-1)] ∧ (!₂[2 * 4, 2 * (-1)] : R2) = !₂[8, -2] ∧
    (!₂[8, -2] : R2) + !₂[-2, 3] = !₂[8 + (-2), -2 + 3] ∧ (!₂[8 + (-2), -2 + 3] : R2) = !₂[6, 1] ∧
    ‖(!₂[6, 1] : R2)‖ = √(6 ^ 2 + 1 ^ 2) ∧ √((6:ℝ) ^ 2 + 1 ^ 2) = √37 ∧ |√37 - 6.08| < 0.005 ∧
    |√37 - 6.1| < 0.05 := by
  have a : (6.08:ℝ) < √37 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have b : √37 < (6.085:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  refine ⟨produkt2 _ _ _, by norm_num, vsota2 _ _ _ _, by norm_num, dolzina2 _ _, by norm_num,
    by rw [abs_lt]; constructor <;> linarith, by rw [abs_lt]; constructor <;> linarith⟩

/-- Primer 2: 2b⃗ = (−4, 8, −2), s⃗ = (6 − 4, 2 + 8, 3 − 2) = (2, 10, 1), |s⃗| = √(2² + 10² + 1²) = √105 ≈ 10,25
(≈ 10,2); dron je 1 m višje. -/
theorem primer2 :
    (2:ℝ) • (!₂[-2, 4, -1] : R3) = !₂[-4, 8, -2] ∧ (!₂[6, 2, 3] : R3) + !₂[-4, 8, -2] = !₂[6 - 4, 2 + 8, 3 - 2] ∧
    (!₂[6 - 4, 2 + 8, 3 - 2] : R3) = !₂[2, 10, 1] ∧ ‖(!₂[2, 10, 1] : R3)‖ = √(2 ^ 2 + 10 ^ 2 + 1 ^ 2) ∧
    √((2:ℝ) ^ 2 + 10 ^ 2 + 1 ^ 2) = √105 ∧ |√105 - 10.25| < 0.005 ∧ |√105 - 10.2| < 0.05 := by
  have a : (10.245:ℝ) < √105 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have b : √105 < (10.25:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  refine ⟨by rw [produkt3]; norm_num, by rw [vsota3]; norm_num, by norm_num, dolzina3 _ _ _, by norm_num,
    by rw [abs_lt]; constructor <;> linarith, by rw [abs_lt]; constructor <;> linarith⟩

/-- Primer 3: v⃗ = (0 + 1,2; 3 + 0) = (1,2; 3), |v⃗| = √(1,2² + 3²) = √10,44 ≈ 3,23; t = 60/3 = 20 s;
s⃗ = 20·(1,2; 3) = (24; 60) (odnese ga 24 m). -/
theorem primer3 :
    (!₂[0, 3] : R2) + !₂[1.2, 0] = !₂[0 + 1.2, 3 + 0] ∧ (!₂[0 + 1.2, 3 + 0] : R2) = !₂[1.2, 3] ∧
    ‖(!₂[1.2, 3] : R2)‖ = √(1.2 ^ 2 + 3 ^ 2) ∧ √((1.2:ℝ) ^ 2 + 3 ^ 2) = √10.44 ∧ |√10.44 - 3.23| < 0.005 ∧
    (60:ℝ) / 3 = 20 ∧ (20:ℝ) • (!₂[1.2, 3] : R2) = !₂[24, 60] := by
  have a : (3.225:ℝ) < √10.44 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have b : √10.44 < (3.235:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  refine ⟨vsota2 _ _ _ _, by norm_num, dolzina2 _ _, by norm_num, by rw [abs_lt]; constructor <;> linarith,
    by norm_num, by rw [produkt2]; norm_num⟩

/-- Primer 4: k(1, 2) + m(3, −1) = (9, 4) ↔ (k + 3m = 9 ∧ 2k − m = 4) ↔ (m = 2k − 4 ∧ k + 3(2k − 4) = 9) ↔
(7k = 21 ∧ m = 2k − 4) ↔ k = 3 ∧ m = 2; preizkus 3·(1, 2) + 2·(3, −1) = (3 + 6, 6 − 2) = (9, 4). -/
theorem primer4 (k m : ℝ) :
    (k • (!₂[1, 2] : R2) + m • !₂[3, -1] = !₂[9, 4] ↔ k = 3 ∧ m = 2) ∧
    (3:ℝ) • (!₂[1, 2] : R2) + (2:ℝ) • !₂[3, -1] = !₂[3 + 6, 6 - 2] := by
  refine ⟨?_, by rw [produkt2, produkt2, vsota2]; norm_num⟩
  rw [produkt2, produkt2, vsota2]
  calc (!₂[k * 1 + m * 3, k * 2 + m * (-1)] : R2) = !₂[9, 4] ↔ k + 3 * m = 9 ∧ 2 * k - m = 4 := by
        constructor
        · intro h
          have h0 := congrArg (fun v : R2 => v 0) h
          have h1 := congrArg (fun v : R2 => v 1) h
          simp at h0 h1; constructor <;> linarith
        · rintro ⟨h0, h1⟩; ext i; fin_cases i <;> simp <;> linarith
    _ ↔ m = 2 * k - 4 ∧ k + 3 * (2 * k - 4) = 9 := by
        constructor
        · rintro ⟨h0, h1⟩; exact ⟨by linarith, by linarith⟩
        · rintro ⟨h0, h1⟩; exact ⟨by rw [h0]; linarith, by linarith⟩
    _ ↔ 7 * k = 21 ∧ m = 2 * k - 4 := by
        constructor
        · rintro ⟨h0, h1⟩; exact ⟨by linarith, h0⟩
        · rintro ⟨h0, h1⟩; exact ⟨h1, by linarith⟩
    _ ↔ k = 3 ∧ m = 2 := by
        constructor
        · rintro ⟨h0, h1⟩; constructor <;> linarith
        · rintro ⟨rfl, rfl⟩; norm_num

/-- Primer 5: k(3, 1) + m(1, 2) = (50, 50) ↔ (3k + m = 50 ∧ k + 2m = 50) ↔ (m = 50 − 3k ∧ k + 100 − 6k = 50) ↔
k = 10 ∧ m = 20 (5k = 50, m = 50 − 30); F⃗₁ = (30, 10), F⃗₂ = (20, 40), vsota (50, 50). -/
theorem primer5 (k m : ℝ) :
    (k • (!₂[3, 1] : R2) + m • !₂[1, 2] = !₂[50, 50] ↔ k = 10 ∧ m = 20) ∧
    (∀ k m : ℝ, (3 * k + m = 50 ∧ k + 2 * m = 50) ↔ (m = 50 - 3 * k ∧ k + 100 - 6 * k = 50)) ∧
    (5:ℝ) * 10 = 50 ∧ (50:ℝ) - 30 = 20 ∧
    (10:ℝ) • (!₂[3, 1] : R2) = !₂[30, 10] ∧ (20:ℝ) • (!₂[1, 2] : R2) = !₂[20, 40] ∧
    (!₂[30, 10] : R2) + !₂[20, 40] = !₂[50, 50] := by
  refine ⟨?_, fun k m => ⟨fun ⟨h0, h1⟩ => ⟨by linarith, by linarith⟩, fun ⟨h0, h1⟩ => ⟨by linarith, by linarith⟩⟩,
    by norm_num, by norm_num, by rw [produkt2]; norm_num, by rw [produkt2]; norm_num, by rw [vsota2]; norm_num⟩
  rw [produkt2, produkt2, vsota2]
  constructor
  · intro h
    have h0 := congrArg (fun v : R2 => v 0) h
    have h1 := congrArg (fun v : R2 => v 1) h
    simp at h0 h1; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Primer 5, velikosti: |F⃗₁| = √(30² + 10²) = √1000 ≈ 31,6, |F⃗₂| = √(20² + 40²) = √2000 ≈ 44,7, skupaj ≈ 76,3;
|F⃗| = √(50² + 50²) = √5000 ≈ 70,7 < 76,3. -/
theorem primer5_velikosti :
    ‖(!₂[30, 10] : R2)‖ = √1000 ∧ ‖(!₂[20, 40] : R2)‖ = √2000 ∧ ‖(!₂[50, 50] : R2)‖ = √5000 ∧
    |√1000 - 31.6| < 0.05 ∧ |√2000 - 44.7| < 0.05 ∧ |√1000 + √2000 - 76.3| < 0.05 ∧
    |√5000 - 70.7| < 0.05 ∧ √5000 < √1000 + √2000 := by
  have a1 : (31.622:ℝ) < √1000 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have b1 : √1000 < (31.623:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  have a2 : (44.721:ℝ) < √2000 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have b2 : √2000 < (44.722:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  have a3 : (70.71:ℝ) < √5000 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have b3 : √5000 < (70.72:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  refine ⟨by rw [dolzina2]; norm_num, by rw [dolzina2]; norm_num, by rw [dolzina2]; norm_num, ?_, ?_, ?_, ?_,
    by linarith⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-! ## Pogoste napake -/

/-- Pogoste napake: 3·(2, −3, 1) = (6, −9, 3) ≠ (6, −3, 1); 6 − (−1) = 7 ≠ 5 = 6 − 1; dve sili po 300 N ne
dasta nujno 600 N (glej `sani`: 300 ≠ 300 + 300). -/
theorem pogoste_napake :
    (3:ℝ) • (!₂[2, -3, 1] : R3) = !₂[6, -9, 3] ∧ (!₂[6, -9, 3] : R3) ≠ !₂[6, -3, 1] ∧
    (6:ℝ) - (-1) = 7 ∧ (6:ℝ) - 1 ≠ 7 ∧ (300:ℝ) ≠ 300 + 300 := by
  refine ⟨by rw [produkt3]; norm_num, fun h => ?_, by norm_num, by norm_num, by norm_num⟩
  have := congrArg (fun v : R3 => v 1) h; norm_num at this

/-! ## Za maturo -/

/-- Naloga 1: a⃗ = (2, p, −3) in b⃗ = (q, 6, 9) sta kolinearna (b⃗ = k a⃗) natanko pri p = −2, q = −6; koraki:
q = 2k, 6 = kp, 9 = −3k, k = 9/(−3) = −3, q = 2·(−3) = −6, 6 = −3p ⇒ p = −2; b⃗ = (−6, 6, 9) = −3a⃗. -/
theorem naloga1 (p q : ℝ) :
    ((∃ k : ℝ, (!₂[q, 6, 9] : R3) = k • !₂[2, p, -3]) ↔ p = -2 ∧ q = -6) ∧
    (∀ k : ℝ, (9 = -3 * k ↔ k = -3)) ∧ (9:ℝ) / (-3) = -3 ∧ 2 * (-3:ℝ) = -6 ∧ (6 = -3 * p ↔ p = -2) ∧
    (!₂[-6, 6, 9] : R3) = (-3:ℝ) • !₂[2, -2, -3] := by
  refine ⟨?_, fun k => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num,
    ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by rw [produkt3]; norm_num⟩
  constructor
  · rintro ⟨k, h⟩
    rw [produkt3] at h
    have h0 := congrArg (fun v : R3 => v 0) h
    have h1 := congrArg (fun v : R3 => v 1) h
    have h2 := congrArg (fun v : R3 => v 2) h
    simp at h0 h1 h2
    have hk : k = -3 := by linarith
    subst hk
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; exact ⟨-3, by rw [produkt3]; norm_num⟩

/-- Naloga 2 a), b): AB⃗ = (3 − 1, 2 − 0, 3 − 2) = (2, 2, 1), BC⃗ = (1 − 3, 3 − 2, 5 − 3) = (−2, 1, 2); ABCD je
paralelogram (AD⃗ = BC⃗) natanko za D = A + BC⃗ = (1 − 2, 0 + 1, 2 + 2) = (−1, 1, 4); preizkus DC⃗ = (2, 2, 1) = AB⃗. -/
theorem naloga2ab (D : R3) :
    (!₂[3, 2, 3] : R3) - !₂[1, 0, 2] = !₂[2, 2, 1] ∧ (!₂[1, 3, 5] : R3) - !₂[3, 2, 3] = !₂[-2, 1, 2] ∧
    (D - !₂[1, 0, 2] = (!₂[1, 3, 5] : R3) - !₂[3, 2, 3] ↔ D = !₂[1 - 2, 0 + 1, 2 + 2]) ∧
    (!₂[1 - 2, 0 + 1, 2 + 2] : R3) = !₂[-1, 1, 4] ∧ (!₂[1, 3, 5] : R3) - !₂[-1, 1, 4] = !₂[2, 2, 1] := by
  refine ⟨by rw [razlika3]; norm_num, by rw [razlika3]; norm_num, ?_, by norm_num, by rw [razlika3]; norm_num⟩
  rw [sub_eq_iff_eq_add, razlika3, vsota3]; norm_num

/-- Naloga 2 c): |AB⃗| = √(2² + 2² + 1²) = √9 = 3, |BC⃗| = √((−2)² + 1² + 2²) = 3, AC⃗ = (0, 3, 3),
|AC⃗| = √18 = 3√2; 9 + 9 = 18 = |AC⃗|²; vse štiri stranice merijo 3 (|CD⃗| = |DA⃗| = 3) in
AB⃗·BC⃗ = −4 + 2 + 2 = 0 (pravi kot pri B), zato je ABCD kvadrat. -/
theorem naloga2c :
    ‖(!₂[2, 2, 1] : R3)‖ = 3 ∧ ‖(!₂[-2, 1, 2] : R3)‖ = 3 ∧
    (!₂[1, 3, 5] : R3) - !₂[1, 0, 2] = !₂[0, 3, 3] ∧ ‖(!₂[0, 3, 3] : R3)‖ = 3 * √2 ∧
    (3:ℝ) ^ 2 + 3 ^ 2 = 18 ∧ (3 * √2) ^ 2 = 18 ∧
    ‖(!₂[-1, 1, 4] : R3) - !₂[1, 3, 5]‖ = 3 ∧ ‖(!₂[1, 0, 2] : R3) - !₂[-1, 1, 4]‖ = 3 ∧
    inner ℝ (!₂[2, 2, 1] : R3) !₂[-2, 1, 2] = 0 ∧ 2 * (-2:ℝ) + 2 * 1 + 1 * 2 = 0 := by
  have h3 : ∀ a b c : ℝ, a ^ 2 + b ^ 2 + c ^ 2 = 9 → ‖(!₂[a, b, c] : R3)‖ = 3 := fun a b c h => by
    rw [dolzina3, h, show (9:ℝ) = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have s2 : √2 ^ 2 = 2 := Real.sq_sqrt (by norm_num)
  refine ⟨h3 _ _ _ (by norm_num), h3 _ _ _ (by norm_num), by rw [razlika3]; norm_num, ?_, by norm_num,
    by rw [mul_pow, s2]; norm_num, by rw [razlika3]; exact h3 _ _ _ (by norm_num),
    by rw [razlika3]; exact h3 _ _ _ (by norm_num), ?_, by norm_num⟩
  · rw [dolzina3, show (0:ℝ) ^ 2 + 3 ^ 2 + 3 ^ 2 = 3 ^ 2 * 2 by norm_num, Real.sqrt_mul (by norm_num),
      Real.sqrt_sq (by norm_num)]
  · simp [EuclideanSpace.inner_eq_star_dotProduct, dotProduct, Fin.sum_univ_three]; norm_num

/-- Naloga 2 c): po obratu Pitagorovega izreka (|AB|² + |BC|² = 9 + 9 = 18 = |AC|²) je kot pri B pravi,
∠ABC = π/2. -/
theorem naloga2c_pravi_kot :
    EuclideanGeometry.angle (!₂[1, 0, 2] : R3) !₂[3, 2, 3] !₂[1, 3, 5] = π / 2 := by
  rw [← EuclideanGeometry.dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two]
  simp only [dist_eq_norm, razlika3, dolzina3]
  have e : ∀ c : ℝ, 0 ≤ c → √c * √c = c := fun c hc => Real.mul_self_sqrt hc
  rw [e _ (by norm_num), e _ (by norm_num), e _ (by norm_num)]; norm_num

/-- Naloga 2 d): AE⃗ = (3 − 1, 5 − 0, 6 − 2) = (2, 5, 4); k AB⃗ + m BC⃗ = AE⃗ ↔ (2k − 2m = 2 ∧ 2k + m = 5 ∧
k + 2m = 4) ↔ k = 2 ∧ m = 1 (3m = 3; tretja enačba 2 + 2·1 = 4 drži); E = A + 2AB⃗ + 1·AD⃗ leži v ravnini
paralelograma. -/
theorem naloga2d (k m : ℝ) :
    (!₂[3, 5, 6] : R3) - !₂[1, 0, 2] = !₂[2, 5, 4] ∧
    (k • (!₂[2, 2, 1] : R3) + m • !₂[-2, 1, 2] = !₂[2, 5, 4] ↔
      (2 * k - 2 * m = 2 ∧ 2 * k + m = 5 ∧ k + 2 * m = 4)) ∧
    ((2 * k - 2 * m = 2 ∧ 2 * k + m = 5 ∧ k + 2 * m = 4) ↔ k = 2 ∧ m = 1) ∧
    (2:ℝ) + 2 * 1 = 4 ∧ 2 * (2:ℝ) - 2 * 1 = 2 ∧ 2 * (2:ℝ) + 1 = 5 ∧
    (!₂[3, 5, 6] : R3) = !₂[1, 0, 2] + (2:ℝ) • (!₂[3, 2, 3] - !₂[1, 0, 2]) + (1:ℝ) • (!₂[-1, 1, 4] - !₂[1, 0, 2]) := by
  refine ⟨by rw [razlika3]; norm_num, ?_, ⟨fun ⟨h0, h1, _⟩ => ⟨by linarith, by linarith⟩,
    fun ⟨h0, h1⟩ => by subst h0 h1; norm_num⟩, by norm_num, by norm_num, by norm_num, ?_⟩
  · rw [produkt3, produkt3, vsota3]
    constructor
    · intro h
      have h0 := congrArg (fun v : R3 => v 0) h
      have h1 := congrArg (fun v : R3 => v 1) h
      have h2 := congrArg (fun v : R3 => v 2) h
      simp at h0 h1 h2
      exact ⟨by linarith, by linarith, by linarith⟩
    · rintro ⟨h0, h1, h2⟩; ext i; fin_cases i <;> simp <;> linarith
  · rw [razlika3, razlika3, produkt3, produkt3, vsota3, vsota3]; norm_num

/-- Ustno vprašanje 3: (1, 1) in (1, −1) nista kolinearna (tvorita bazo); k(1, 1) + m(1, −1) = (5, 1) ↔
(k + m = 5 ∧ k − m = 1) ↔ k = 3 ∧ m = 2; preizkus 3·(1, 1) + 2·(1, −1) = (5, 1). -/
theorem ustno3 (k m : ℝ) :
    LinearIndependent ℝ ![(!₂[1, 1] : R2), !₂[1, -1]] ∧
    (k • (!₂[1, 1] : R2) + m • !₂[1, -1] = !₂[5, 1] ↔ (k + m = 5 ∧ k - m = 1)) ∧
    ((k + m = 5 ∧ k - m = 1) ↔ k = 3 ∧ m = 2) := by
  refine ⟨?_, ?_, ⟨fun ⟨h0, h1⟩ => ⟨by linarith, by linarith⟩, fun ⟨h0, h1⟩ => by subst h0 h1; norm_num⟩⟩
  · rw [LinearIndependent.pair_iff]
    intro s t h
    have h0 := congrArg (fun v : R2 => v 0) h
    have h1 := congrArg (fun v : R2 => v 1) h
    simp at h0 h1
    constructor <;> linarith
  · rw [produkt2, produkt2, vsota2]
    constructor
    · intro h
      have h0 := congrArg (fun v : R2 => v 0) h
      have h1 := congrArg (fun v : R2 => v 1) h
      simp at h0 h1; constructor <;> linarith
    · rintro ⟨h0, h1⟩; ext i; fin_cases i <;> simp <;> linarith

/-! ## Preveri se -/

/-- Preveri se 4: 3a⃗ = (6, −9, 3), 3a⃗ − b⃗ = (6 + 1, −9 − 4, 3 − 0) = (7, −13, 3); napačni (5, −5, 3) je 3a⃗ + b⃗. -/
theorem kviz4 :
    (3:ℝ) • (!₂[2, -3, 1] : R3) = !₂[6, -9, 3] ∧
    (3:ℝ) • (!₂[2, -3, 1] : R3) - !₂[-1, 4, 0] = !₂[6 + 1, -9 - 4, 3 - 0] ∧
    (!₂[6 + 1, -9 - 4, 3 - 0] : R3) = !₂[7, -13, 3] ∧
    (3:ℝ) • (!₂[2, -3, 1] : R3) + !₂[-1, 4, 0] = !₂[5, -5, 3] := by
  refine ⟨by rw [produkt3]; norm_num, by rw [produkt3, razlika3]; norm_num, by norm_num,
    by rw [produkt3, vsota3]; norm_num⟩

/-- Preveri se 5: v⃗ = (2; 1,5), |v⃗| = √(2² + 1,5²) = √6,25 = 2,5 m/s (napačni 3,5 = 2 + 1,5, 0,5 = 2 − 1,5,
6,25 = |v⃗|²). -/
theorem kviz5 :
    ‖(!₂[2, 1.5] : R2)‖ = √6.25 ∧ √(6.25:ℝ) = 2.5 ∧ (2:ℝ) + 1.5 = 3.5 ∧ (2:ℝ) - 1.5 = 0.5 ∧
    (2.5:ℝ) ^ 2 = 6.25 := by
  refine ⟨by rw [dolzina2]; norm_num, ?_, by norm_num, by norm_num, by norm_num⟩
  rw [show (6.25:ℝ) = 2.5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Preveri se 6: AB⃗ = (5, 3, 3) − (2, −1, 3) = (3, 4, 0), |AB⃗| = √(9 + 16 + 0) = 5; napačna 9,43 ≈ |r⃗_A + r⃗_B| =
√(7² + 2² + 6²) in 6,56 ≈ |r⃗_B| = √(5² + 3² + 3²). -/
theorem kviz6 :
    (!₂[5, 3, 3] : R3) - !₂[2, -1, 3] = !₂[3, 4, 0] ∧ ‖(!₂[3, 4, 0] : R3)‖ = 5 ∧
    (!₂[2, -1, 3] : R3) + !₂[5, 3, 3] = !₂[7, 2, 6] ∧ |‖(!₂[7, 2, 6] : R3)‖ - 9.43| < 0.005 ∧
    |‖(!₂[5, 3, 3] : R3)‖ - 6.56| < 0.005 := by
  refine ⟨by rw [razlika3]; norm_num, ?_, by rw [vsota3]; norm_num, ?_, ?_⟩ <;> rw [dolzina3]
  · rw [show (3:ℝ) ^ 2 + 4 ^ 2 + 0 ^ 2 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · have a : (9.425:ℝ) < √(7 ^ 2 + 2 ^ 2 + 6 ^ 2) := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
    have b : √((7:ℝ) ^ 2 + 2 ^ 2 + 6 ^ 2) < 9.435 := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
    rw [abs_lt]; constructor <;> linarith
  · have a : (6.555:ℝ) < √(5 ^ 2 + 3 ^ 2 + 3 ^ 2) := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
    have b : √((5:ℝ) ^ 2 + 3 ^ 2 + 3 ^ 2) < 6.565 := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
    rw [abs_lt]; constructor <;> linarith

/-- Preveri se 7: k(2, 1) + m(1, −1) = (8, 1) ↔ (2k + m = 8 ∧ k − m = 1) ↔ k = 3 ∧ m = 2 (3k = 9). -/
theorem kviz7 (k m : ℝ) :
    (k • (!₂[2, 1] : R2) + m • !₂[1, -1] = !₂[8, 1] ↔ (2 * k + m = 8 ∧ k - m = 1)) ∧
    ((2 * k + m = 8 ∧ k - m = 1) ↔ k = 3 ∧ m = 2) ∧ (3:ℝ) • (!₂[2, 1] : R2) + (2:ℝ) • !₂[1, -1] = !₂[8, 1] := by
  refine ⟨?_, ⟨fun ⟨h0, h1⟩ => ⟨by linarith, by linarith⟩, fun ⟨h0, h1⟩ => by subst h0 h1; norm_num⟩,
    by rw [produkt2, produkt2, vsota2]; norm_num⟩
  rw [produkt2, produkt2, vsota2]
  constructor
  · intro h
    have h0 := congrArg (fun v : R2 => v 0) h
    have h1 := congrArg (fun v : R2 => v 1) h
    simp at h0 h1; constructor <;> linarith
  · rintro ⟨h0, h1⟩; ext i; fin_cases i <;> simp <;> linarith

/-- Blok RACUN: preostale vrstice `vrednost` in `resi` (√(2² + 2² + 1²) = 3, √((−2)² + 1² + 2²) = 3,
√(0² + 3² + 3²) = 3√2, 3·1 + 2·(−1) = 1, √(3² + 4² + 12²) = 13, √(50² + 50²) ≈ 70,7,
√(3² + 4² + 0²) = 5; sistema 2k − 2m = 2, 2k + m = 5 in k + m = 5, k − m = 1 sta v `naloga2d` in `ustno3`). -/
theorem racun :
    √((2:ℝ) ^ 2 + 2 ^ 2 + 1 ^ 2) = 3 ∧ √((-2:ℝ) ^ 2 + 1 ^ 2 + 2 ^ 2) = 3 ∧
    √((0:ℝ) ^ 2 + 3 ^ 2 + 3 ^ 2) = 3 * √2 ∧ 3 * (1:ℝ) + 2 * (-1) = 1 ∧ √((3:ℝ) ^ 2 + 4 ^ 2 + 12 ^ 2) = 13 ∧
    |√((50:ℝ) ^ 2 + 50 ^ 2) - 70.7| < 0.05 ∧ √((3:ℝ) ^ 2 + 4 ^ 2 + 0 ^ 2) = 5 ∧
    (∀ k m : ℝ, (2 * k - 2 * m = 2 ∧ 2 * k + m = 5) ↔ k = 2 ∧ m = 1) := by
  have a3 : (70.71:ℝ) < √(50 ^ 2 + 50 ^ 2) := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have b3 : √((50:ℝ) ^ 2 + 50 ^ 2) < (70.72:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  refine ⟨?_, ?_, ?_, by norm_num, ?_, by rw [abs_lt]; constructor <;> linarith, ?_,
    fun k m => ⟨fun ⟨h0, h1⟩ => ⟨by linarith, by linarith⟩, fun ⟨h0, h1⟩ => by subst h0 h1; norm_num⟩⟩
  · rw [show (2:ℝ) ^ 2 + 2 ^ 2 + 1 ^ 2 = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (-2:ℝ) ^ 2 + 1 ^ 2 + 2 ^ 2 = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (0:ℝ) ^ 2 + 3 ^ 2 + 3 ^ 2 = 3 ^ 2 * 2 by norm_num, Real.sqrt_mul (by norm_num),
      Real.sqrt_sq (by norm_num)]
  · rw [show (3:ℝ) ^ 2 + 4 ^ 2 + 12 ^ 2 = 13 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (3:ℝ) ^ 2 + 4 ^ 2 + 0 ^ 2 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

end Evklid.Lekcije.MAT_SS_3.VektorjiVRavniniInProstoru
