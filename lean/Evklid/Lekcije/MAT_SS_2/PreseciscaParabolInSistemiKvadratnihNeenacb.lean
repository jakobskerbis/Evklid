/-
vir: content/lessons/MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb.md
sha256: b0c822721c423af43e500825dc95fc2831bb2329eb63e4270f6488bba9afc4fe
Ni v Leanu: risbe, številske premice, drsnik in simulacija (opisi; dokazane so pripadajoče rešitve);
fizikalni model leta žogice (parabola, pobočje, jeklenica kot podatki naloge); poimenovanja (presečišče,
sekanta, tangenta, mimobežnica, sistem neenačb: rešitev sistema je presek, kar je v Leanu zapisano s
konjunkcijo ∧) in postopki (Ponovitev, Ustna vprašanja 1 in 3, Preveri se 5 o vrstnem redu korakov);
risanje grafov v Nalogah 2 b) in 3 b) (dokazane so ničle, temena in smer odprtosti) in »pojasni z
grafom« v Nalogi 3 d) (dokazana je množica rešitev); točkovanje; besedilo napačnih odgovorov v
Preveri se (dokazani so pravilni odgovori in, kjer gre, da napačni ne ustrezajo).
Decimalna števila so točna racionalna števila v ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.PreseciscaParabolInSistemiKvadratnihNeenacb

/-! ## Pomožne trditve -/

/-- Pomožno: enačba L = R je enakovredna P = 0, če je L − R = P.
pomozno -/
theorem enacba_iff {L D P : ℝ} (h : L - D = P) : L = D ↔ P = 0 := by
  rw [← h, sub_eq_zero]

/-- Predpostavka `enacba_iff` se da izpolniti (L = 3, D = 1, P = 2). -/
example : (3 : ℝ) = 1 ↔ (2 : ℝ) = 0 := enacba_iff (by norm_num)

/-- Pomožno: (x − r)(x − s) = 0 ↔ x = r ∨ x = s.
pomozno -/
theorem dva_faktorja (x r s : ℝ) : (x - r) * (x - s) = 0 ↔ x = r ∨ x = s := by
  simp only [mul_eq_zero, sub_eq_zero]

/-- Primer 4 (formula): za a > 0 in ničli x₁ < x₂ je a(x − x₁)(x − x₂) < 0 ⇔ x₁ < x < x₂,
≤ 0 ⇔ x₁ ≤ x ≤ x₂, > 0 ⇔ x < x₁ ali x > x₂, ≥ 0 ⇔ x ≤ x₁ ali x ≥ x₂.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#predznak
besedilo: »Za $a > 0$ in ničli $x_1 < x_2$ je $ax^2 + bx + c < 0$ za $x \in (x_1, x_2)$,« -/
theorem predznak (a x₁ x₂ x : ℝ) (ha : 0 < a) (h12 : x₁ < x₂) :
    (a * (x - x₁) * (x - x₂) < 0 ↔ x₁ < x ∧ x < x₂) ∧
      (a * (x - x₁) * (x - x₂) ≤ 0 ↔ x₁ ≤ x ∧ x ≤ x₂) ∧
      (0 < a * (x - x₁) * (x - x₂) ↔ x < x₁ ∨ x₂ < x) ∧
      (0 ≤ a * (x - x₁) * (x - x₂) ↔ x ≤ x₁ ∨ x₂ ≤ x) := by
  refine ⟨⟨fun h => ⟨?_, ?_⟩, fun h => ?_⟩, ⟨fun h => ⟨?_, ?_⟩, fun h => ?_⟩, ⟨fun h => ?_, fun h => ?_⟩,
    ⟨fun h => ?_, fun h => ?_⟩⟩
  · by_contra hc; push Not at hc
    nlinarith [mul_nonneg ha.le (mul_nonneg (sub_nonneg.2 hc) (sub_nonneg.2 (hc.trans h12.le)))]
  · by_contra hc; push Not at hc
    nlinarith [mul_nonneg ha.le (mul_nonneg (sub_nonneg.2 (h12.le.trans hc)) (sub_nonneg.2 hc))]
  · nlinarith [mul_pos ha (mul_pos (sub_pos.2 h.1) (sub_pos.2 h.2))]
  · by_contra hc; push Not at hc
    nlinarith [mul_pos ha (mul_pos (sub_pos.2 hc) (sub_pos.2 (hc.trans h12)))]
  · by_contra hc; push Not at hc
    nlinarith [mul_pos ha (mul_pos (sub_pos.2 (h12.trans hc)) (sub_pos.2 hc))]
  · nlinarith [mul_nonneg ha.le (mul_nonneg (sub_nonneg.2 h.1) (sub_nonneg.2 h.2))]
  · by_contra hc; push Not at hc
    nlinarith [mul_nonneg ha.le (mul_nonneg (sub_nonneg.2 hc.1) (sub_nonneg.2 hc.2))]
  · rcases h with h | h
    · nlinarith [mul_pos ha (mul_pos (sub_pos.2 h) (sub_pos.2 (h.trans h12)))]
    · nlinarith [mul_pos ha (mul_pos (sub_pos.2 (h12.trans h)) (sub_pos.2 h))]
  · by_contra hc; push Not at hc
    nlinarith [mul_pos ha (mul_pos (sub_pos.2 hc.1) (sub_pos.2 hc.2))]
  · rcases h with h | h
    · nlinarith [mul_nonneg ha.le (mul_nonneg (sub_nonneg.2 h) (sub_nonneg.2 (h.trans h12.le)))]
    · nlinarith [mul_nonneg ha.le (mul_nonneg (sub_nonneg.2 (h12.le.trans h)) (sub_nonneg.2 h))]

/-- Predpostavke `predznak` se dajo izpolniti (a = 1, ničli 0 in 1). -/
example : (1 : ℝ) * (0.5 - 0) * (0.5 - 1) < 0 := (predznak 1 0 1 0.5 one_pos one_pos).1.2 (by norm_num)

/-! ## Splošna pravila -/

/-- Razlaga 3, Povzetek, Ponovitev, Ustno vprašanje 1: presečišča parabole y = ax² + bx + c in premice
y = kx + n: ax² + bx + c = kx + n ⇔ ax² + (b − k)x + (c − n) = 0; za D = (b − k)² − 4a(c − n) in a ≠ 0:
D > 0 ⇒ natanko dve različni presečišči (sekanta: vsaka rešitev je x₁ ali x₂), D = 0 ⇒ natanko eno
(tangenta), D < 0 ⇒ nobenega (mimobežnica).
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#parabola-premica
besedilo: »za enačbo $ax^2 + (b - k)x + (c - n) = 0$ je $D = (b - k)^2 - 4a(c - n)$.« -/
theorem parabola_premica (a b c k n : ℝ) (ha : a ≠ 0) :
    (∀ x, a * x ^ 2 + b * x + c = k * x + n ↔ a * x ^ 2 + (b - k) * x + (c - n) = 0) ∧
      (0 < (b - k) ^ 2 - 4 * a * (c - n) → ∃ x₁ x₂ : ℝ, x₁ ≠ x₂ ∧
        ∀ x, a * x ^ 2 + b * x + c = k * x + n ↔ x = x₁ ∨ x = x₂) ∧
      ((b - k) ^ 2 - 4 * a * (c - n) = 0 → ∃! x : ℝ, a * x ^ 2 + b * x + c = k * x + n) ∧
      ((b - k) ^ 2 - 4 * a * (c - n) < 0 → ∀ x : ℝ, a * x ^ 2 + b * x + c ≠ k * x + n) := by
  have e : ∀ x, a * x ^ 2 + b * x + c = k * x + n ↔ a * (x * x) + (b - k) * x + (c - n) = 0 :=
    fun x => by constructor <;> intro h <;> linarith
  refine ⟨fun x => by constructor <;> intro h <;> linarith, fun hD => ?_, fun hD => ?_, fun hD x h => ?_⟩
  · have hs : discrim a (b - k) (c - n) = Real.sqrt ((b - k) ^ 2 - 4 * a * (c - n)) *
        Real.sqrt ((b - k) ^ 2 - 4 * a * (c - n)) := by
      rw [discrim, Real.mul_self_sqrt hD.le]
    have hpos : 0 < Real.sqrt ((b - k) ^ 2 - 4 * a * (c - n)) := Real.sqrt_pos.2 hD
    refine ⟨(-(b - k) + Real.sqrt ((b - k) ^ 2 - 4 * a * (c - n))) / (2 * a),
      (-(b - k) - Real.sqrt ((b - k) ^ 2 - 4 * a * (c - n))) / (2 * a), ?_, fun x => ?_⟩
    · intro h
      rw [div_left_inj₀ (mul_ne_zero two_ne_zero ha)] at h
      linarith
    · rw [e]; exact quadratic_eq_zero_iff ha hs x
  · simp only [e]
    exact (discrim_eq_zero_iff ha).1 (by rw [discrim]; exact hD)
  · rw [e] at h
    exact quadratic_ne_zero_of_discrim_ne_sq (fun s hs => by
      rw [discrim] at hs; nlinarith [sq_nonneg s]) x h

/-- Predpostavka `parabola_premica` se da izpolniti (a = 1). -/
example : ∃! x : ℝ, 1 * x ^ 2 + 0 * x + 0 = 0 * x + 0 :=
  (parabola_premica 1 0 0 0 0 one_ne_zero).2.2.1 (by norm_num)

/-- Razlaga 4, premisli, Pogoste napake 4, Povzetek: paraboli z enakim vodilnim koeficientom a: če se
linearna koeficienta razlikujeta, se sekata v natanko eni točki; če sta enaka in prosta člena različna,
se ne sekata; če sta enaka tudi prosta člena, sta paraboli enaki (vse točke so skupne, neskončno
mnogo presečišč) — ta primer je pri »največ eno presečišče« izvzet.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#enak-vodilni
besedilo: »Paraboli z enakim $a$ »sta vzporedni«.** Če se člen $x^2$ odšteje, ostane linearna enačba. Paraboli se tedaj sekata v natanko eni točki, razen če se odšteje tudi člen z $x$.« -/
theorem enak_vodilni (a b₁ c₁ b₂ c₂ : ℝ) :
    (b₁ ≠ b₂ → ∃! x : ℝ, a * x ^ 2 + b₁ * x + c₁ = a * x ^ 2 + b₂ * x + c₂) ∧
      (b₁ = b₂ → c₁ ≠ c₂ → ∀ x : ℝ, a * x ^ 2 + b₁ * x + c₁ ≠ a * x ^ 2 + b₂ * x + c₂) ∧
      (b₁ = b₂ → c₁ = c₂ → ∀ x : ℝ, a * x ^ 2 + b₁ * x + c₁ = a * x ^ 2 + b₂ * x + c₂) := by
  refine ⟨fun hb => ⟨(c₂ - c₁) / (b₁ - b₂), ?_, fun y hy => ?_⟩, fun hb hc x h => ?_,
    fun hb hc x => by rw [hb, hc]⟩
  · have : b₁ - b₂ ≠ 0 := sub_ne_zero.mpr hb
    have hx : (b₁ - b₂) * ((c₂ - c₁) / (b₁ - b₂)) = c₂ - c₁ := by field_simp
    linear_combination hx
  · have : b₁ - b₂ ≠ 0 := sub_ne_zero.mpr hb
    rw [eq_div_iff this]; linarith
  · subst hb; exact hc (by linarith)

/-- Predpostavka `enak_vodilni` se da izpolniti (b₁ = 0, b₂ = −2). -/
example : ∃! x : ℝ, 1 * x ^ 2 + 0 * x + 1 = 1 * x ^ 2 + (-2) * x + 5 :=
  (enak_vodilni 1 0 1 (-2) 5).1 (by norm_num)

/-- Razlaga 4: paraboli a₁x² + b₁x + c₁ in a₂x² + b₂x + c₂ z a₁ ≠ a₂: o številu skupnih točk odloča
diskriminanta D = (b₁ − b₂)² − 4(a₁ − a₂)(c₁ − c₂) enačbe f(x) − g(x) = 0: D > 0 ⇒ dve, D < 0 ⇒ nobene
(D = 0 ⇒ natanko ena: `dve_paraboli_ena`); pri D > 0 sta skupni točki natanko dve.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#dve-paraboli
besedilo: »Dve paraboli imata lahko dve, eno ali nobene skupne točke; odloča spet diskriminanta enačbe $f(x) - g(x) = 0$.« -/
theorem dve_paraboli (a₁ b₁ c₁ a₂ b₂ c₂ : ℝ) (ha : a₁ ≠ a₂) :
    (0 < (b₁ - b₂) ^ 2 - 4 * (a₁ - a₂) * (c₁ - c₂) → ∃ x₁ x₂ : ℝ, x₁ ≠ x₂ ∧
      ∀ x, a₁ * x ^ 2 + b₁ * x + c₁ = a₂ * x ^ 2 + b₂ * x + c₂ ↔ x = x₁ ∨ x = x₂) ∧
    ((b₁ - b₂) ^ 2 - 4 * (a₁ - a₂) * (c₁ - c₂) < 0 →
      ∀ x : ℝ, a₁ * x ^ 2 + b₁ * x + c₁ ≠ a₂ * x ^ 2 + b₂ * x + c₂) := by
  have h := parabola_premica (a₁ - a₂) (b₁ - b₂) (c₁ - c₂) 0 0 (sub_ne_zero.mpr ha)
  have e : ∀ x : ℝ, a₁ * x ^ 2 + b₁ * x + c₁ = a₂ * x ^ 2 + b₂ * x + c₂ ↔
      (a₁ - a₂) * x ^ 2 + (b₁ - b₂) * x + (c₁ - c₂) = 0 * x + 0 := fun x => by
    constructor <;> intro h <;> linarith
  refine ⟨fun hD => ?_, fun hD x hx => ?_⟩
  · obtain ⟨x₁, x₂, hne, h12⟩ := h.2.1 (by rw [sub_zero, sub_zero]; exact hD)
    exact ⟨x₁, x₂, hne, fun x => (e x).trans (h12 x)⟩
  · exact h.2.2.2 (by rw [sub_zero, sub_zero]; exact hD) x ((e x).1 hx)

/-- Predpostavka `dve_paraboli` se da izpolniti (Razlaga 4: f(x) = x² − 2x − 3, g(x) = −x² + 4x + 5,
D = 36 + 64 = 100 > 0). -/
example : ∃ x₁ x₂ : ℝ, x₁ ≠ x₂ ∧
    ∀ x, 1 * x ^ 2 + (-2) * x + (-3) = (-1) * x ^ 2 + 4 * x + 5 ↔ x = x₁ ∨ x = x₂ :=
  (dve_paraboli 1 (-2) (-3) (-1) 4 5 (by norm_num)).1 (by norm_num)

/-! ## Razlaga -/

/-- Razlaga 1: −0,1x² + 2x = 0 ⇔ x(−0,1x + 2) = 0 ⇔ x = 0 ali x = 20; pri x = 20 je pobočje visoko
0,5·20 = 10, zato (20, 0) ni na pobočju (leži pod njim).
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#razlaga1
besedilo: »pri $x = 20$ je pobočje visoko že $0{,}5 \cdot 20 = 10\,\mathrm{m}$.« -/
theorem razlaga1 (x : ℝ) : (-0.1 * x ^ 2 + 2 * x = 0 ↔ x * (-0.1 * x + 2) = 0) ∧
    (-0.1 * x ^ 2 + 2 * x = 0 ↔ x = 0 ∨ x = 20) ∧ (0.5 : ℝ) * 20 = 10 ∧ (0 : ℝ) < 0.5 * 20 := by
  refine ⟨by constructor <;> intro h <;> linarith, ?_, by norm_num, by norm_num⟩
  rw [enacba_iff (P := -0.1 * ((x - 0) * (x - 20))) (by ring), mul_eq_zero, dva_faktorja,
    or_iff_right (by norm_num)]

/-- Razlaga 2: −0,1x² + 2x = 0,5x ⇔ −0,1x² + 1,5x = 0 ⇔ x(−0,1x + 1,5) = 0 ⇔ x = 0 ali x = 15;
ordinata 0,5·15 = 7,5, presečišče (15; 7,5).
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#razlaga2
besedilo: »Pri $D = 0$ je dvojna rešitev $x = -\dfrac{b}{2a} = \dfrac{15}{2} = 7{,}5$. Ordinata: $0{,}5 \cdot 7{,}5 + 5{,}625 = 9{,}375$. Na paraboli: $-0{,}1 \cdot 7{,}5^2 + 2 \cdot 7{,}5 = 9{,}375$, ustreza.« -/
theorem razlaga2 (x : ℝ) : (-0.1 * x ^ 2 + 2 * x = 0.5 * x ↔ -0.1 * x ^ 2 + 1.5 * x = 0) ∧
    (-0.1 * x ^ 2 + 1.5 * x = 0 ↔ x * (-0.1 * x + 1.5) = 0) ∧
    (-0.1 * x ^ 2 + 2 * x = 0.5 * x ↔ x = 0 ∨ x = 15) ∧ (0.5 : ℝ) * 15 = 7.5 ∧
    -0.1 * (15 : ℝ) ^ 2 + 2 * 15 = 7.5 := by
  refine ⟨by constructor <;> intro h <;> linarith, by constructor <;> intro h <;> linarith, ?_, by norm_num,
    by norm_num⟩
  rw [enacba_iff (P := -0.1 * ((x - 0) * (x - 15))) (by ring), mul_eq_zero, dva_faktorja,
    or_iff_right (by norm_num)]

/-- Razlaga 3 (Lara): a = −0,1, b − k = 2 − 0,5 = 1,5, c − n = 0, D = 1,5² − 4·(−0,1)·0 = 2,25 > 0 (sekanta);
Pogoste napake 2: diskriminanta same parabole 2² − 4·(−0,1)·0 = 4 je drugačna.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#razlaga3-lara
besedilo: »Pri Lari je $a = -0{,}1$, $b - k = 1{,}5$ in $c - n = 0$, zato je $D = 1{,}5^2 - 0 = 2{,}25 > 0$ in pobočje je sekanta parabole.« -/
theorem razlaga3_lara : (2 : ℝ) - 0.5 = 1.5 ∧ (1.5 : ℝ) ^ 2 - 4 * (-0.1) * 0 = 2.25 ∧ (0 : ℝ) < 2.25 ∧
    (2 : ℝ) ^ 2 - 4 * (-0.1) * 0 = 4 := by norm_num

/-- Razlaga 3, premisli: za premico y = 0,5x + n je D = 1,5² − 4·(−0,1)·(0 − n) = 2,25 − 0,4n; D pada,
ko n raste, D = 0 ⇔ n = 5,625.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#premisli-n
besedilo: »Pri Lari je $a = -0{,}1$, $b - k = 1{,}5$ in $c - n = 0$, zato je $D = 1{,}5^2 - 0 = 2{,}25 > 0$ in pobočje je sekanta parabole.« -/
theorem premisli_n (n n' : ℝ) : (1.5 : ℝ) ^ 2 - 4 * (-0.1) * (0 - n) = 2.25 - 0.4 * n ∧
    (n < n' → 2.25 - 0.4 * n' < 2.25 - 0.4 * n) ∧ (2.25 - 0.4 * n = 0 ↔ n = 5.625) := by
  refine ⟨by ring, fun h => by linarith, by constructor <;> intro h <;> linarith⟩

/-- Razlaga 3, premisli (presečišči se bližata): za a ≠ 0 in D ≥ 0 sta rešitvi (−B ± √D)/(2a) za
√D/|a| narazen.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#razdalja-presecisc
besedilo: »Presečišči se bližata drugo drugemu.« -/
theorem razdalja_presecisc (a B D : ℝ) (ha : a ≠ 0) (_hD : 0 ≤ D) :
    |(-B + Real.sqrt D) / (2 * a) - (-B - Real.sqrt D) / (2 * a)| = Real.sqrt D / |a| := by
  rw [show (-B + Real.sqrt D) / (2 * a) - (-B - Real.sqrt D) / (2 * a) = Real.sqrt D / a by
    field_simp; ring, abs_div, abs_of_nonneg (Real.sqrt_nonneg _)]

/-- Predpostavki `razdalja_presecisc` se dasta izpolniti (a = 1, D = 4). -/
example : |(-0 + Real.sqrt 4) / (2 * 1) - (-0 - Real.sqrt 4) / (2 * 1)| = Real.sqrt 4 / |(1 : ℝ)| :=
  razdalja_presecisc 1 0 4 one_ne_zero (by norm_num)

/-- Razlaga 3, premisli (Lara, premica y = 0,5x + n): a = −0,1, D = 2,25 − 0,4n; razdalja med
abscisama presečišč √D/|a| = √(2,25 − 0,4n)/0,1 se z večanjem n (do n = 5,625, ko je D = 0) manjša:
presečišči se bližata.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#premisli-blizata
besedilo: »Diskriminanta se manjša: pri Lari je $a = -0{,}1$ in $c = 0$, zato je $D = 2{,}25 - 0{,}4n$.« -/
theorem premisli_blizata (n n' : ℝ) (h : n < n') (h' : n' ≤ 5.625) :
    |(-0.1 : ℝ)| = 0.1 ∧
      Real.sqrt (2.25 - 0.4 * n') / |(-0.1 : ℝ)| < Real.sqrt (2.25 - 0.4 * n) / |(-0.1 : ℝ)| := by
  have h01 : |(-0.1 : ℝ)| = 0.1 := by norm_num [abs_of_neg]
  refine ⟨h01, ?_⟩
  rw [h01]
  have := Real.sqrt_lt_sqrt (by linarith : (0 : ℝ) ≤ 2.25 - 0.4 * n') (by linarith : 2.25 - 0.4 * n' < 2.25 - 0.4 * n)
  exact div_lt_div_of_pos_right this (by norm_num)

/-- Predpostavki `premisli_blizata` se dasta izpolniti (n = 0, n' = 5). -/
example : Real.sqrt (2.25 - 0.4 * 5) / |(-0.1 : ℝ)| < Real.sqrt (2.25 - 0.4 * 0) / |(-0.1 : ℝ)| :=
  (premisli_blizata 0 5 (by norm_num) (by norm_num)).2

/-- Razlaga 4: f(x) = x² − 2x − 3, g(x) = −x² + 4x + 5: f = g ⇔ 2x² − 6x − 8 = 0 ⇔ x² − 3x − 4 = 0
⇔ (x − 4)(x + 1) = 0 ⇔ x = 4 ali x = −1; f(4) = 5, f(−1) = 0 (in g(4) = 5, g(−1) = 0).
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#razlaga4
besedilo: »Za paraboli $f(x) = x^2 - 2x - 3$ in $g(x) = -x^2 + 4x + 5$ izenačimo $f(x) = g(x)$ in vse prenesemo na levo: enačba $2x^2 - 6x - 8 = 0$, deljeno z $2$ enačba $x^2 - 3x - 4 = 0$.« -/
theorem razlaga4 (x : ℝ) : (x ^ 2 - 2 * x - 3 = -x ^ 2 + 4 * x + 5 ↔ 2 * x ^ 2 - 6 * x - 8 = 0) ∧
    (2 * x ^ 2 - 6 * x - 8 = 0 ↔ x ^ 2 - 3 * x - 4 = 0) ∧ x ^ 2 - 3 * x - 4 = (x - 4) * (x + 1) ∧
    (x ^ 2 - 2 * x - 3 = -x ^ 2 + 4 * x + 5 ↔ x = 4 ∨ x = -1) ∧
    (4 : ℝ) ^ 2 - 2 * 4 - 3 = 5 ∧ (-1 : ℝ) ^ 2 - 2 * (-1) - 3 = 0 ∧ -(4 : ℝ) ^ 2 + 4 * 4 + 5 = 5 ∧
    -(-1 : ℝ) ^ 2 + 4 * (-1) + 5 = 0 := by
  refine ⟨by constructor <;> intro h <;> linarith, by constructor <;> intro h <;> linarith, by ring, ?_,
    by norm_num, by norm_num, by norm_num, by norm_num⟩
  rw [enacba_iff (P := 2 * ((x - 4) * (x - -1))) (by ring), mul_eq_zero, dva_faktorja,
    or_iff_right (by norm_num)]

/-- Razlaga 4, premisli: x² + 1 = x² − 2x + 5 ⇔ 2x = 4 ⇔ x = 2; edina skupna točka je (2, 5).
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#premisli-enak-a
besedilo: »Za paraboli $f(x) = x^2 - 2x - 3$ in $g(x) = -x^2 + 4x + 5$ izenačimo $f(x) = g(x)$ in vse prenesemo na levo:« -/
theorem premisli_enak_a (x : ℝ) : (x ^ 2 + 1 = x ^ 2 - 2 * x + 5 ↔ 2 * x = 4) ∧ (2 * x = 4 ↔ x = 2) ∧
    (2 : ℝ) ^ 2 + 1 = 5 := by
  refine ⟨by constructor <;> intro h <;> linarith, by constructor <;> intro h <;> linarith, by norm_num⟩

/-- Razlaga 5: f(x) ≤ 0 ⇔ x ∈ [−1, 3], g(x) > 0 ⇔ x ∈ (−1, 5); sistem f ≤ 0 in g > 0 ⇔ x ∈ (−1, 3]
(presek); −1 izpade, ker je g(−1) = 0.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#razlaga5
besedilo: »Vzemimo sistem $x^2 - 2x - 3 \le 0$ in $-x^2 + 4x + 5 > 0$. To sta neenačbi $f(x) \le 0$ in $g(x) > 0$ za paraboli z zgornje slike. Rešitvi beremo z grafa:« -/
theorem razlaga5 (x : ℝ) : (x ^ 2 - 2 * x - 3 ≤ 0 ↔ -1 ≤ x ∧ x ≤ 3) ∧ (-x ^ 2 + 4 * x + 5 > 0 ↔ -1 < x ∧ x < 5) ∧
    ((x ^ 2 - 2 * x - 3 ≤ 0 ∧ -x ^ 2 + 4 * x + 5 > 0) ↔ -1 < x ∧ x ≤ 3) ∧
    -(-1 : ℝ) ^ 2 + 4 * (-1) + 5 = 0 := by
  have h1 : x ^ 2 - 2 * x - 3 ≤ 0 ↔ -1 ≤ x ∧ x ≤ 3 := by
    rw [show x ^ 2 - 2 * x - 3 = 1 * (x - -1) * (x - 3) by ring]
    exact (predznak 1 (-1) 3 x one_pos (by norm_num)).2.1
  have h2 : -x ^ 2 + 4 * x + 5 > 0 ↔ -1 < x ∧ x < 5 := by
    rw [gt_iff_lt, show -x ^ 2 + 4 * x + 5 = -(1 * (x - -1) * (x - 5)) by ring, neg_pos]
    exact (predznak 1 (-1) 5 x one_pos (by norm_num)).1
  refine ⟨h1, h2, ?_, by norm_num⟩
  rw [h1, h2]
  constructor
  · rintro ⟨⟨_, a⟩, b, _⟩; exact ⟨b, a⟩
  · rintro ⟨a, b⟩; exact ⟨⟨a.le, b⟩, a, by linarith⟩

/-! ## Rešeni primeri -/

/-- Primer 1: x² − 4x + 5 = x + 1 ⇔ x² − 5x + 4 = 0; D = 25 − 16 = 9 > 0; (x − 1)(x − 4) = 0 ⇔ x ∈ {1, 4};
ordinati 1 + 1 = 2 in 4 + 1 = 5, preverba 1 − 4 + 5 = 2 in 16 − 16 + 5 = 5.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#primer1
besedilo: »Ordinati iz premice: $1 + 1 = 2$ in $4 + 1 = 5$. Preverba na paraboli: $1 - 4 + 5 = 2$ in $16 - 16 + 5 = 5$.« -/
theorem primer1 (x : ℝ) : (x ^ 2 - 4 * x + 5 = x + 1 ↔ x ^ 2 - 5 * x + 4 = 0) ∧
    ((-5 : ℝ) ^ 2 - 4 * 1 * 4 = 25 - 16 ∧ (25 : ℝ) - 16 = 9) ∧ x ^ 2 - 5 * x + 4 = (x - 1) * (x - 4) ∧
    (x ^ 2 - 4 * x + 5 = x + 1 ↔ x = 1 ∨ x = 4) ∧ ((1 : ℝ) + 1 = 2 ∧ (4 : ℝ) + 1 = 5) ∧
    ((1 : ℝ) ^ 2 - 4 * 1 + 5 = 2 ∧ (4 : ℝ) ^ 2 - 4 * 4 + 5 = 5) := by
  refine ⟨by constructor <;> intro h <;> linarith, by norm_num, by ring, ?_, by norm_num, by norm_num⟩
  rw [enacba_iff (P := (x - 1) * (x - 4)) (by ring), dva_faktorja]

/-- Primer 2: x² + 2x − 1 = −x² + 3 ⇔ 2x² + 2x − 4 = 0 ⇔ x² + x − 2 = 0 ⇔ (x + 2)(x − 1) = 0 ⇔ x ∈ {−2, 1};
g(−2) = −4 + 3 = −1, g(1) = −1 + 3 = 2, f(−2) = 4 − 4 − 1 = −1, f(1) = 1 + 2 − 1 = 2.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#primer2
besedilo: »Ordinati iz preprostejše funkcije $g$: $g(-2) = -4 + 3 = -1$ in $g(1) = -1 + 3 = 2$. Preverba: $f(-2) = 4 - 4 - 1 = -1$ in $f(1) = 1 + 2 - 1 = 2$.« -/
theorem primer2 (x : ℝ) : (x ^ 2 + 2 * x - 1 = -x ^ 2 + 3 ↔ 2 * x ^ 2 + 2 * x - 4 = 0) ∧
    (2 * x ^ 2 + 2 * x - 4 = 0 ↔ x ^ 2 + x - 2 = 0) ∧ x ^ 2 + x - 2 = (x + 2) * (x - 1) ∧
    (x ^ 2 + 2 * x - 1 = -x ^ 2 + 3 ↔ x = -2 ∨ x = 1) ∧
    (-(-2 : ℝ) ^ 2 + 3 = -4 + 3 ∧ (-4 : ℝ) + 3 = -1 ∧ -(1 : ℝ) ^ 2 + 3 = -1 + 3 ∧ (-1 : ℝ) + 3 = 2) ∧
    ((-2 : ℝ) ^ 2 + 2 * (-2) - 1 = 4 - 4 - 1 ∧ (4 : ℝ) - 4 - 1 = -1 ∧ (1 : ℝ) ^ 2 + 2 * 1 - 1 = 1 + 2 - 1 ∧
      (1 : ℝ) + 2 - 1 = 2) := by
  refine ⟨by constructor <;> intro h <;> linarith, by constructor <;> intro h <;> linarith, by ring, ?_,
    by norm_num, by norm_num⟩
  rw [enacba_iff (P := 2 * ((x - -2) * (x - 1))) (by ring), mul_eq_zero, dva_faktorja,
    or_iff_right (by norm_num)]

/-- Primer 3 a): −0,1x² + 2x = 0,5x + 6 ⇔ x² − 15x + 60 = 0 (·(−10)); D = 225 − 240 = −15 < 0, žogica
jeklenice ne zadene.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#primer3a
besedilo: »Izenačimo: enačba $-0{,}1x^2 + 2x = 0{,}5x + 6$. Prenesemo na levo in pomnožimo z $-10$, da se znebimo decimalk: enačba $x^2 - 15x + 60 = 0$.« -/
theorem primer3a : (∀ x : ℝ, -0.1 * x ^ 2 + 2 * x = 0.5 * x + 6 ↔ x ^ 2 - 15 * x + 60 = 0) ∧
    ((-15 : ℝ) ^ 2 - 4 * 1 * 60 = 225 - 240 ∧ (225 : ℝ) - 240 = -15 ∧ (-15 : ℝ) < 0) ∧
    ∀ x : ℝ, -0.1 * x ^ 2 + 2 * x ≠ 0.5 * x + 6 := by
  refine ⟨fun x => by constructor <;> intro h <;> linarith, by norm_num, fun x h => ?_⟩
  nlinarith [sq_nonneg (x - 7.5)]

/-- Primer 3 b): −0,1x² + 2x = 0,5x + n ⇔ x² − 15x + 10n = 0; D = 225 − 40n; D = 0 ⇔ n = 5,625
(preverba 225 − 40·5,625 = 0).
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#primer3b-n
besedilo: »Za premico $y = 0{,}5x + n$ enako dobimo enačbo $x^2 - 15x + 10n = 0$ z diskriminanto $D = 225 - 40n$.« -/
theorem primer3b_n (n : ℝ) : (∀ x : ℝ, -0.1 * x ^ 2 + 2 * x = 0.5 * x + n ↔ x ^ 2 - 15 * x + 10 * n = 0) ∧
    (-15 : ℝ) ^ 2 - 4 * 1 * (10 * n) = 225 - 40 * n ∧ (225 - 40 * n = 0 ↔ n = 5.625) ∧
    (225 : ℝ) - 40 * 5.625 = 0 := by
  refine ⟨fun x => by constructor <;> intro h <;> linarith, by ring, by constructor <;> intro h <;> linarith,
    by norm_num⟩

/-- Primer 3 b), korak 5: pri n = 5,625 je edina skupna točka x = 15/2 = 7,5 (dvojna rešitev), ordinata
0,5·7,5 + 5,625 = 9,375, na paraboli −0,1·7,5² + 2·7,5 = 9,375; korak 6–7: 6 − 5,625 = 0,375, jeklenica
y = 0,5x + 6 je povsod vsaj 0,375 m (37,5 cm) nad žogico.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#primer3b
besedilo: »Pri $D = 0$ je dvojna rešitev $x = -\dfrac{b}{2a} = \dfrac{15}{2} = 7{,}5$. Ordinata: $0{,}5 \cdot 7{,}5 + 5{,}625 = 9{,}375$. Na paraboli: $-0{,}1 \cdot 7{,}5^2 + 2 \cdot 7{,}5 = 9{,}375$, ustreza.« -/
theorem primer3b (x : ℝ) : (-0.1 * x ^ 2 + 2 * x = 0.5 * x + 5.625 ↔ x = 7.5) ∧ (15 : ℝ) / 2 = 7.5 ∧
    (0.5 : ℝ) * 7.5 + 5.625 = 9.375 ∧ -0.1 * (7.5 : ℝ) ^ 2 + 2 * 7.5 = 9.375 ∧ (6 : ℝ) - 5.625 = 0.375 ∧
    0.375 ≤ (0.5 * x + 6) - (-0.1 * x ^ 2 + 2 * x) ∧ (0.375 : ℝ) * 100 = 37.5 := by
  refine ⟨⟨fun h => ?_, fun h => by subst h; norm_num⟩, by norm_num, by norm_num, by norm_num, by norm_num,
    by nlinarith [sq_nonneg (x - 7.5)], by norm_num⟩
  have h0 : (x - 7.5) ^ 2 = 0 := by nlinarith
  have := pow_eq_zero_iff (n := 2) (by norm_num) |>.1 h0
  linarith

/-- Primer 4 (sistem): x² − x − 6 = (x − 3)(x + 2) < 0 ⇔ −2 < x < 3; x² − 4x = x(x − 4) ≥ 0 ⇔ x ≤ 0 ali
x ≥ 4; sistem ⇔ −2 < x ≤ 0. Preizkus: pri 0 velja 0 − 0 − 6 < 0 in 0 ≥ 0, pri −2 je prva stran 0, pri
−1: 1 + 1 − 6 = −4 < 0 in 1 + 4 = 5 ≥ 0.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#primer4
besedilo: »Preizkus pri $x = -1$: $1 + 1 - 6 = -4 < 0$ in $1 + 4 = 5 \ge 0$.« -/
theorem primer4 (x : ℝ) : (x ^ 2 - x - 6 < 0 ↔ -2 < x ∧ x < 3) ∧ (x ^ 2 - 4 * x ≥ 0 ↔ x ≤ 0 ∨ 4 ≤ x) ∧
    ((x ^ 2 - x - 6 < 0 ∧ x ^ 2 - 4 * x ≥ 0) ↔ -2 < x ∧ x ≤ 0) ∧
    ((0 : ℝ) ^ 2 - 0 - 6 < 0 ∧ (0 : ℝ) ^ 2 - 4 * 0 ≥ 0) ∧ (-2 : ℝ) ^ 2 - (-2) - 6 = 0 ∧
    ((-1 : ℝ) ^ 2 - (-1) - 6 = -4 ∧ (-1 : ℝ) ^ 2 - 4 * (-1) = 5) := by
  have h1 : x ^ 2 - x - 6 < 0 ↔ -2 < x ∧ x < 3 := by
    rw [show x ^ 2 - x - 6 = 1 * (x - -2) * (x - 3) by ring]
    exact (predznak 1 (-2) 3 x one_pos (by norm_num)).1
  have h2 : x ^ 2 - 4 * x ≥ 0 ↔ x ≤ 0 ∨ 4 ≤ x := by
    rw [ge_iff_le, show x ^ 2 - 4 * x = 1 * (x - 0) * (x - 4) by ring]
    exact (predznak 1 0 4 x one_pos (by norm_num)).2.2.2
  refine ⟨h1, h2, ?_, by norm_num, by norm_num, by norm_num⟩
  rw [h1, h2]
  constructor
  · rintro ⟨⟨a, b⟩, c | c⟩
    · exact ⟨a, c⟩
    · exfalso; linarith
  · rintro ⟨a, b⟩; exact ⟨⟨a, by linarith⟩, Or.inl b⟩

/-! ## Pogoste napake -/

/-- Pogoste napake 5: rešitev x(x − 4) ≥ 0 je (−∞, 0] ∪ [4, ∞), ne [0, 4] (npr. 2·(2 − 4) = −4 < 0).
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#napaka-unija
besedilo: »(višja raven) **Unija namesto preseka ali napačna stran ničel.** Rešitev sistema je presek, ne unija. Pri $a > 0$ velja $ax^2 + bx + c \ge 0$ *zunaj* ničel: neenačba $x(x - 4) \ge 0$ ima rešitev $(-\infty, 0] \cup [4, \infty)$, ne $[0, 4]$.« -/
theorem napaka_unija : (∀ x : ℝ, x * (x - 4) ≥ 0 ↔ x ≤ 0 ∨ 4 ≤ x) ∧ (2 : ℝ) * (2 - 4) < 0 := by
  refine ⟨fun x => ?_, by norm_num⟩
  rw [ge_iff_le, show x * (x - 4) = 1 * (x - 0) * (x - 4) by ring]
  exact (predznak 1 0 4 x one_pos (by norm_num)).2.2.2

/-! ## Za maturo -/

/-- Za maturo, naloga 1: 2x² + x − 3 = 3x + 1 ⇔ 2x² − 2x − 4 = 0 ⇔ x² − x − 2 = 0 ⇔ (x − 2)(x + 1) = 0
⇔ x ∈ {−1, 2}; ordinati 3·(−1) + 1 = −2, 3·2 + 1 = 7; preverba 2 − 1 − 3 = −2, 8 + 2 − 3 = 7.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#matura1
besedilo: »Ordinati iz enačbe premice: $3 \cdot (-1) + 1 = -2$ in $3 \cdot 2 + 1 = 7$. Preverba na paraboli: $2 - 1 - 3 = -2$ in $8 + 2 - 3 = 7$.« -/
theorem matura1 (x : ℝ) : (2 * x ^ 2 + x - 3 = 3 * x + 1 ↔ 2 * x ^ 2 - 2 * x - 4 = 0) ∧
    (2 * x ^ 2 - 2 * x - 4 = 0 ↔ x ^ 2 - x - 2 = 0) ∧ x ^ 2 - x - 2 = (x - 2) * (x + 1) ∧
    (2 * x ^ 2 + x - 3 = 3 * x + 1 ↔ x = -1 ∨ x = 2) ∧ (3 * (-1 : ℝ) + 1 = -2 ∧ 3 * (2 : ℝ) + 1 = 7) ∧
    (2 * (-1 : ℝ) ^ 2 + (-1) - 3 = 2 - 1 - 3 ∧ (2 : ℝ) - 1 - 3 = -2 ∧ 2 * (2 : ℝ) ^ 2 + 2 - 3 = 8 + 2 - 3 ∧
      (8 : ℝ) + 2 - 3 = 7) := by
  refine ⟨by constructor <;> intro h <;> linarith, by constructor <;> intro h <;> linarith, by ring, ?_,
    by norm_num, by norm_num⟩
  rw [enacba_iff (P := 2 * ((x - -1) * (x - 2))) (by ring), mul_eq_zero, dva_faktorja,
    or_iff_right (by norm_num)]

/-- Za maturo, naloga 2 a): f(x) = x² − 4x + 3, g(x) = −x² + 2x + 3: f = g ⇔ 2x² − 6x = 0 ⇔ 2x(x − 3) = 0
⇔ x ∈ {0, 3}; f(0) = 3, f(3) = 9 − 12 + 3 = 0.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#matura2a
besedilo: »a) $x^2 - 4x + 3 = -x^2 + 2x + 3$ da $2x^2 - 6x = 0$, torej $2x(x - 3) = 0$ in $x = 0$ ali $x = 3$.« -/
theorem matura2a (x : ℝ) : (x ^ 2 - 4 * x + 3 = -x ^ 2 + 2 * x + 3 ↔ 2 * x ^ 2 - 6 * x = 0) ∧
    2 * x ^ 2 - 6 * x = 2 * x * (x - 3) ∧ (x ^ 2 - 4 * x + 3 = -x ^ 2 + 2 * x + 3 ↔ x = 0 ∨ x = 3) ∧
    (0 : ℝ) ^ 2 - 4 * 0 + 3 = 3 ∧ ((3 : ℝ) ^ 2 - 4 * 3 + 3 = 9 - 12 + 3 ∧ (9 : ℝ) - 12 + 3 = 0) := by
  refine ⟨by constructor <;> intro h <;> linarith, by ring, ?_, by norm_num, by norm_num⟩
  rw [enacba_iff (P := 2 * ((x - 0) * (x - 3))) (by ring), mul_eq_zero, dva_faktorja,
    or_iff_right (by norm_num)]

/-- Za maturo, naloga 2 b): f ima ničli 1 in 3 ter teme (2, −1) (f(2) = 4 − 8 + 3 = −1, najmanjša vrednost,
odprta navzgor); g ima ničli −1 in 3 (x² − 2x − 3 = 0) ter teme (1, 4) (g(1) = −1 + 2 + 3 = 4, največja
vrednost, odprta navzdol).
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#matura2b
besedilo: »b) Graf $g$: iz $x^2 - 2x - 3 = 0$ ničli $-1$ in $3$, teme $(1, 4)$, ker je $g(1) = -1 + 2 + 3 = 4$; parabola je odprta navzdol.« -/
theorem matura2b (x : ℝ) : (x ^ 2 - 4 * x + 3 = 0 ↔ x = 1 ∨ x = 3) ∧
    ((2 : ℝ) ^ 2 - 4 * 2 + 3 = 4 - 8 + 3 ∧ (4 : ℝ) - 8 + 3 = -1) ∧ -1 ≤ x ^ 2 - 4 * x + 3 ∧
    (-x ^ 2 + 2 * x + 3 = 0 ↔ x ^ 2 - 2 * x - 3 = 0) ∧ (x ^ 2 - 2 * x - 3 = 0 ↔ x = -1 ∨ x = 3) ∧
    (-(1 : ℝ) ^ 2 + 2 * 1 + 3 = -1 + 2 + 3 ∧ (-1 : ℝ) + 2 + 3 = 4) ∧ -x ^ 2 + 2 * x + 3 ≤ 4 := by
  refine ⟨?_, by norm_num, by nlinarith [sq_nonneg (x - 2)], by constructor <;> intro h <;> linarith, ?_,
    by norm_num, by nlinarith [sq_nonneg (x - 1)]⟩
  · rw [enacba_iff (P := (x - 1) * (x - 3)) (by ring), dva_faktorja]
  · rw [enacba_iff (P := (x - -1) * (x - 3)) (by ring), dva_faktorja]

/-- Za maturo, naloga 2 c) (`RACUN`): f(x) < g(x) ⇔ 0 < x < 3 (med presečiščema).
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#matura2c
besedilo: »c) Med presečiščema je parabola $f$ pod parabolo $g$: $x \in (0, 3)$.« -/
theorem matura2c (x : ℝ) : x ^ 2 - 4 * x + 3 < -x ^ 2 + 2 * x + 3 ↔ 0 < x ∧ x < 3 := by
  rw [← sub_neg (a := x ^ 2 - 4 * x + 3),
    show x ^ 2 - 4 * x + 3 - (-x ^ 2 + 2 * x + 3) = 2 * (x - 0) * (x - 3) by ring]
  exact (predznak 2 0 3 x (by norm_num) (by norm_num)).1

/-- Za maturo, naloga 2 d): x² − 4x + 3 = 4x + n ⇔ x² − 8x + 3 − n = 0; D = 64 − 4(3 − n) = 52 + 4n;
D = 0 ⇔ n = −13; tedaj je edina skupna točka x = 8/2 = 4, ordinata 4·4 − 13 = 3 = f(4) = 16 − 16 + 3.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#matura2d
besedilo: »d) Tangenta pomeni $D = 0$, torej $n = -13$. Dvojna rešitev je $x = \dfrac{8}{2} = 4$, ordinata $4 \cdot 4 - 13 = 3$; preverba: $f(4) = 16 - 16 + 3 = 3$.« -/
theorem matura2d (n x : ℝ) : (x ^ 2 - 4 * x + 3 = 4 * x + n ↔ x ^ 2 - 8 * x + 3 - n = 0) ∧
    ((-8 : ℝ) ^ 2 - 4 * 1 * (3 - n) = 64 - 4 * (3 - n) ∧ 64 - 4 * (3 - n) = 52 + 4 * n) ∧
    (52 + 4 * n = 0 ↔ n = -13) ∧ (x ^ 2 - 4 * x + 3 = 4 * x + -13 ↔ x = 4) ∧ (8 : ℝ) / 2 = 4 ∧
    (4 : ℝ) * 4 - 13 = 3 ∧ ((4 : ℝ) ^ 2 - 4 * 4 + 3 = 16 - 16 + 3 ∧ (16 : ℝ) - 16 + 3 = 3) := by
  refine ⟨by constructor <;> intro h <;> linarith, ⟨by ring, by ring⟩, by constructor <;> intro h <;> linarith,
    ?_, by norm_num, by norm_num, by norm_num⟩
  rw [enacba_iff (P := (x - 4) * (x - 4)) (by ring), dva_faktorja, or_self]

/-- Za maturo, naloga 3 a): f(x) = x² − 4, g(x) = −x² + 2x + 8: f = g ⇔ 2x² − 2x − 12 = 0 ⇔ x² − x − 6 = 0
⇔ (x − 3)(x + 2) = 0 ⇔ x ∈ {−2, 3}; f(−2) = 0, f(3) = 5.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#matura3a
besedilo: »a) $x^2 - 4 = -x^2 + 2x + 8$ da $2x^2 - 2x - 12 = 0$, torej $x^2 - x - 6 = 0$ in $(x - 3)(x + 2) = 0$: $x = -2$ ali $x = 3$.« -/
theorem matura3a (x : ℝ) : (x ^ 2 - 4 = -x ^ 2 + 2 * x + 8 ↔ 2 * x ^ 2 - 2 * x - 12 = 0) ∧
    (2 * x ^ 2 - 2 * x - 12 = 0 ↔ x ^ 2 - x - 6 = 0) ∧ x ^ 2 - x - 6 = (x - 3) * (x + 2) ∧
    (x ^ 2 - 4 = -x ^ 2 + 2 * x + 8 ↔ x = -2 ∨ x = 3) ∧ (-2 : ℝ) ^ 2 - 4 = 0 ∧ (3 : ℝ) ^ 2 - 4 = 5 := by
  refine ⟨by constructor <;> intro h <;> linarith, by constructor <;> intro h <;> linarith, by ring, ?_,
    by norm_num, by norm_num⟩
  rw [enacba_iff (P := 2 * ((x - -2) * (x - 3))) (by ring), mul_eq_zero, dva_faktorja,
    or_iff_right (by norm_num)]

/-- Za maturo, naloga 3 b): f ima ničli ±2 in teme (0, −4) (minimum); g: x² − 2x − 8 = (x + 2)(x − 4), ničli
−2 in 4, teme (1, 9) (g(1) = −1 + 2 + 8 = 9, maksimum).
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#matura3b
besedilo: »b) Graf $f$: ničli $-2$ in $2$, teme $(0, -4)$, odprt navzgor. Graf $g$: iz $x^2 - 2x - 8 = (x + 2)(x - 4) = 0$ ničli $-2$ in $4$, teme $(1, 9)$, odprt navzdol. Grafa se sekata v $(-2, 0)$ in $(3, 5)$.« -/
theorem matura3b (x : ℝ) : (x ^ 2 - 4 = 0 ↔ x = 2 ∨ x = -2) ∧ -4 ≤ x ^ 2 - 4 ∧
    x ^ 2 - 2 * x - 8 = (x + 2) * (x - 4) ∧ (-x ^ 2 + 2 * x + 8 = 0 ↔ x = -2 ∨ x = 4) ∧
    -(1 : ℝ) ^ 2 + 2 * 1 + 8 = 9 ∧ -x ^ 2 + 2 * x + 8 ≤ 9 := by
  refine ⟨?_, by nlinarith [sq_nonneg x], by ring, ?_, by norm_num, by nlinarith [sq_nonneg (x - 1)]⟩
  · rw [enacba_iff (P := (x - 2) * (x - -2)) (by ring), dva_faktorja]
  · rw [enacba_iff (P := -1 * ((x - -2) * (x - 4))) (by ring), mul_eq_zero, dva_faktorja,
      or_iff_right (by norm_num)]

/-- Za maturo, naloga 3 c): f(x) < 0 ⇔ −2 < x < 2; g(x) ≥ 5 ⇔ −x² + 2x + 3 ≥ 0 ⇔ x² − 2x − 3 ≤ 0
⇔ (x + 1)(x − 3) ≤ 0 ⇔ −1 ≤ x ≤ 3; sistem ⇔ −1 ≤ x < 2; f(−1) = −3 < 0, g(−1) = 5, f(2) = 0.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#matura3c
besedilo: »c) $g(x) \ge 5$: $-x^2 + 2x + 3 \ge 0$, torej $x^2 - 2x - 3 \le 0$ in $(x + 1)(x - 3) \le 0$, $x \in [-1, 3]$.« -/
theorem matura3c (x : ℝ) : (x ^ 2 - 4 < 0 ↔ -2 < x ∧ x < 2) ∧
    (-x ^ 2 + 2 * x + 8 ≥ 5 ↔ -x ^ 2 + 2 * x + 3 ≥ 0) ∧ (-x ^ 2 + 2 * x + 3 ≥ 0 ↔ x ^ 2 - 2 * x - 3 ≤ 0) ∧
    x ^ 2 - 2 * x - 3 = (x + 1) * (x - 3) ∧ (x ^ 2 - 2 * x - 3 ≤ 0 ↔ -1 ≤ x ∧ x ≤ 3) ∧
    ((x ^ 2 - 4 < 0 ∧ -x ^ 2 + 2 * x + 8 ≥ 5) ↔ -1 ≤ x ∧ x < 2) ∧
    (-1 : ℝ) ^ 2 - 4 = -3 ∧ -(-1 : ℝ) ^ 2 + 2 * (-1) + 8 = 5 ∧ (2 : ℝ) ^ 2 - 4 = 0 := by
  have h1 : x ^ 2 - 4 < 0 ↔ -2 < x ∧ x < 2 := by
    rw [show x ^ 2 - 4 = 1 * (x - -2) * (x - 2) by ring]
    exact (predznak 1 (-2) 2 x one_pos (by norm_num)).1
  have h2 : x ^ 2 - 2 * x - 3 ≤ 0 ↔ -1 ≤ x ∧ x ≤ 3 := by
    rw [show x ^ 2 - 2 * x - 3 = 1 * (x - -1) * (x - 3) by ring]
    exact (predznak 1 (-1) 3 x one_pos (by norm_num)).2.1
  have h3 : -x ^ 2 + 2 * x + 8 ≥ 5 ↔ x ^ 2 - 2 * x - 3 ≤ 0 := by
    constructor <;> intro h <;> linarith
  refine ⟨h1, by constructor <;> intro h <;> linarith, by constructor <;> intro h <;> linarith, by ring, h2,
    ?_, by norm_num, by norm_num, by norm_num⟩
  rw [h1, h3, h2]
  constructor
  · rintro ⟨⟨_, b⟩, c, _⟩; exact ⟨c, b⟩
  · rintro ⟨a, b⟩; exact ⟨⟨by linarith, b⟩, a, by linarith⟩

/-- Za maturo, naloga 3 d): f(x) ≥ 0 ⇔ x ≤ −2 ali x ≥ 2; f(x) ≤ g(x) ⇔ x² − x − 6 ≤ 0 ⇔ −2 ≤ x ≤ 3;
0 ≤ f(x) ≤ g(x) ⇔ x ∈ {−2} ∪ [2, 3].
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#matura3d
besedilo: »d) $f(x) \le g(x)$: $x^2 - x - 6 \le 0$, $x \in [-2, 3]$ (med presečiščema grafov).« -/
theorem matura3d (x : ℝ) : (x ^ 2 - 4 ≥ 0 ↔ x ≤ -2 ∨ 2 ≤ x) ∧
    (x ^ 2 - 4 ≤ -x ^ 2 + 2 * x + 8 ↔ x ^ 2 - x - 6 ≤ 0) ∧ (x ^ 2 - x - 6 ≤ 0 ↔ -2 ≤ x ∧ x ≤ 3) ∧
    ((0 ≤ x ^ 2 - 4 ∧ x ^ 2 - 4 ≤ -x ^ 2 + 2 * x + 8) ↔ x = -2 ∨ (2 ≤ x ∧ x ≤ 3)) := by
  have h1 : x ^ 2 - 4 ≥ 0 ↔ x ≤ -2 ∨ 2 ≤ x := by
    rw [ge_iff_le, show x ^ 2 - 4 = 1 * (x - -2) * (x - 2) by ring]
    exact (predznak 1 (-2) 2 x one_pos (by norm_num)).2.2.2
  have h2 : x ^ 2 - x - 6 ≤ 0 ↔ -2 ≤ x ∧ x ≤ 3 := by
    rw [show x ^ 2 - x - 6 = 1 * (x - -2) * (x - 3) by ring]
    exact (predznak 1 (-2) 3 x one_pos (by norm_num)).2.1
  have h3 : x ^ 2 - 4 ≤ -x ^ 2 + 2 * x + 8 ↔ x ^ 2 - x - 6 ≤ 0 := by
    constructor <;> intro h <;> linarith
  refine ⟨h1, h3, h2, ?_⟩
  have h1' : 0 ≤ x ^ 2 - 4 ↔ x ≤ -2 ∨ 2 ≤ x := h1
  rw [h1', h3, h2]
  constructor
  · rintro ⟨a | a, b, c⟩
    · left; linarith
    · right; exact ⟨a, c⟩
  · rintro (h | ⟨a, b⟩)
    · subst h; norm_num
    · exact ⟨Or.inr a, by linarith, b⟩

/-! ## Ustna vprašanja, Drugače, Preveri se -/

/-- Ustno vprašanje 2: x² = x² + 2x − 4 ⇔ 2x − 4 = 0 ⇔ x = 2; edina skupna točka (2, 4). Paraboli z
različnima vodilnima koeficientoma imata natanko eno skupno točko natanko tedaj, ko je diskriminanta
razlike predpisov 0 (glej `dve_paraboli_ena`).
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#ustno2
besedilo: »Paraboli z različnima vodilnima koeficientoma imata natanko eno skupno točko takrat, ko ima kvadratna enačba, ki jo dobimo z izenačenjem predpisov, diskriminanto $0$.« -/
theorem ustno2 (x : ℝ) : (x ^ 2 = x ^ 2 + 2 * x - 4 ↔ 2 * x - 4 = 0) ∧ (2 * x - 4 = 0 ↔ x = 2) ∧
    (2 : ℝ) ^ 2 = 4 := by
  refine ⟨by constructor <;> intro h <;> linarith, by constructor <;> intro h <;> linarith, by norm_num⟩

/-- Ustno vprašanje 2 (splošno): paraboli a₁x² + b₁x + c₁ in a₂x² + b₂x + c₂ z a₁ ≠ a₂ imata natanko eno
skupno točko natanko tedaj, ko je (b₁ − b₂)² − 4(a₁ − a₂)(c₁ − c₂) = 0.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#dve-paraboli-ena
besedilo: »Paraboli $y = x^2$ in $y = x^2 + 2x - 4$ imata natanko eno skupno točko.« -/
theorem dve_paraboli_ena (a₁ b₁ c₁ a₂ b₂ c₂ : ℝ) (ha : a₁ ≠ a₂) :
    (∃! x : ℝ, a₁ * x ^ 2 + b₁ * x + c₁ = a₂ * x ^ 2 + b₂ * x + c₂) ↔
      (b₁ - b₂) ^ 2 - 4 * (a₁ - a₂) * (c₁ - c₂) = 0 := by
  have ha' : a₁ - a₂ ≠ 0 := sub_ne_zero.mpr ha
  have e : ∀ x : ℝ, a₁ * x ^ 2 + b₁ * x + c₁ = a₂ * x ^ 2 + b₂ * x + c₂ ↔
      (a₁ - a₂) * (x * x) + (b₁ - b₂) * x + (c₁ - c₂) = 0 := fun x => by
    constructor <;> intro h <;> linarith
  simp only [e]
  exact (discrim_eq_zero_iff ha').symm.trans (by rw [discrim])

/-- Predpostavka `dve_paraboli_ena` se da izpolniti (a₁ = 1, a₂ = 0: y = x² in tangenta y = 2x − 1). -/
example : (∃! x : ℝ, 1 * x ^ 2 + 0 * x + 0 = 0 * x ^ 2 + 2 * x + (-1)) :=
  (dve_paraboli_ena 1 0 0 0 2 (-1) one_ne_zero).2 (by norm_num)

/-- Predpostavka `dve_paraboli_ena` se da izpolniti tudi z dvema pravima parabolama (a₂ ≠ 0):
y = x² in y = −x² + 4x − 2 se dotikata (D = 16 − 16 = 0). -/
example : (∃! x : ℝ, 1 * x ^ 2 + 0 * x + 0 = (-1) * x ^ 2 + 4 * x + (-2)) :=
  (dve_paraboli_ena 1 0 0 (-1) 4 (-2) (by norm_num)).2 (by norm_num)

/-- Drugače: kot zgodba: pri n = 6 je D = −15 (ni skupnih točk); pri n = 5: −0,1x² + 2x = 0,5x + 5 ⇔
x² − 15x + 50 = 0, D = 25, x ∈ {5, 10}, točki (5; 7,5) in (10, 10).
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#zgodba
besedilo: »Izenačimo: enačba $-0{,}1x^2 + 2x = 0{,}5x + 6$. Prenesemo na levo in pomnožimo z $-10$, da se znebimo decimalk: enačba $x^2 - 15x + 60 = 0$.« -/
theorem zgodba (x : ℝ) : (225 : ℝ) - 40 * 6 = -15 ∧ (-0.1 * x ^ 2 + 2 * x = 0.5 * x + 5 ↔ x ^ 2 - 15 * x + 50 = 0) ∧
    ((-15 : ℝ) ^ 2 - 4 * 1 * 50 = 25) ∧ (x ^ 2 - 15 * x + 50 = 0 ↔ x = 5 ∨ x = 10) ∧
    (0.5 : ℝ) * 5 + 5 = 7.5 ∧ (0.5 : ℝ) * 10 + 5 = 10 := by
  refine ⟨by norm_num, by constructor <;> intro h <;> linarith, by norm_num, ?_, by norm_num, by norm_num⟩
  rw [enacba_iff (P := (x - 5) * (x - 10)) (by ring), dva_faktorja]

/-- Drugače: korak za korakom: x² − 2x + 3 = 2x ⇔ x² − 4x + 3 = 0; D = 16 − 12 = 4 > 0; (x − 1)(x − 3) = 0
⇔ x ∈ {1, 3}; ordinati 2·1 = 2 in 2·3 = 6.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#korak-presecisca
besedilo: »Enačba $x^2 - 5x + 4 = 0$ ima rešitvi $1$ in $4$. Pri $x = 4$ je $y = 2 \cdot 4 - 3 = 5$; preverba na paraboli: $16 - 12 + 1 = 5$.« -/
theorem korak_presecisca (x : ℝ) : (x ^ 2 - 2 * x + 3 = 2 * x ↔ x ^ 2 - 4 * x + 3 = 0) ∧
    ((-4 : ℝ) ^ 2 - 4 * 1 * 3 = 16 - 12 ∧ (16 : ℝ) - 12 = 4) ∧ (x ^ 2 - 2 * x + 3 = 2 * x ↔ x = 1 ∨ x = 3) ∧
    (2 * (1 : ℝ) = 2 ∧ 2 * (3 : ℝ) = 6) := by
  refine ⟨by constructor <;> intro h <;> linarith, by norm_num, ?_, by norm_num⟩
  rw [enacba_iff (P := (x - 1) * (x - 3)) (by ring), dva_faktorja]

/-- Drugače: sistem po korakih: x² − 9 ≤ 0 ⇔ −3 ≤ x ≤ 3; x² + x − 2 > 0 ⇔ x < −2 ali x > 1;
sistem ⇔ x ∈ [−3, −2) ∪ (1, 3].
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#korak-sistem
besedilo: »Sistem po korakih (višja raven).** Sistem $x^2 - 9 \le 0$ in $x^2 + x - 2 > 0$:« -/
theorem korak_sistem (x : ℝ) : (x ^ 2 - 9 ≤ 0 ↔ -3 ≤ x ∧ x ≤ 3) ∧ (x ^ 2 + x - 2 > 0 ↔ x < -2 ∨ 1 < x) ∧
    ((x ^ 2 - 9 ≤ 0 ∧ x ^ 2 + x - 2 > 0) ↔ (-3 ≤ x ∧ x < -2) ∨ (1 < x ∧ x ≤ 3)) := by
  have h1 : x ^ 2 - 9 ≤ 0 ↔ -3 ≤ x ∧ x ≤ 3 := by
    rw [show x ^ 2 - 9 = 1 * (x - -3) * (x - 3) by ring]
    exact (predznak 1 (-3) 3 x one_pos (by norm_num)).2.1
  have h2 : x ^ 2 + x - 2 > 0 ↔ x < -2 ∨ 1 < x := by
    rw [gt_iff_lt, show x ^ 2 + x - 2 = 1 * (x - -2) * (x - 1) by ring]
    exact (predznak 1 (-2) 1 x one_pos (by norm_num)).2.2.1
  refine ⟨h1, h2, ?_⟩
  rw [h1, h2]
  constructor
  · rintro ⟨⟨a, b⟩, c | c⟩
    · left; exact ⟨a, c⟩
    · right; exact ⟨c, b⟩
  · rintro (⟨a, b⟩ | ⟨a, b⟩)
    · exact ⟨⟨a, by linarith⟩, Or.inl b⟩
    · exact ⟨⟨by linarith, b⟩, Or.inr a⟩

/-- Preveri se 1: s parabolo y = x² so y = 2x − 1, y = −4x − 4 in y = 6x − 9 tangente (D = 0), y = x + 2 pa
sekanta (x² − x − 2 = 0, D = 9, presečišči (−1, 1) in (2, 4)).
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#preveri1
besedilo: »Enačba $x^2 - x - 2 = 0$ ima $D = 9 > 0$, zato je $y = x + 2$ sekanta (presečišči $(-1, 1)$ in $(2, 4)$). Ostale tri so tangente.« -/
theorem preveri1 (x : ℝ) : ((-2 : ℝ) ^ 2 - 4 * 1 * 1 = 0 ∧ (4 : ℝ) ^ 2 - 4 * 1 * 4 = 0 ∧
    (-6 : ℝ) ^ 2 - 4 * 1 * 9 = 0 ∧ (-1 : ℝ) ^ 2 - 4 * 1 * (-2) = 9) ∧
    (x ^ 2 = 2 * x - 1 ↔ x = 1) ∧ (x ^ 2 = -4 * x - 4 ↔ x = -2) ∧ (x ^ 2 = 6 * x - 9 ↔ x = 3) ∧
    (x ^ 2 = x + 2 ↔ x = -1 ∨ x = 2) ∧ (-1 : ℝ) + 2 = 1 ∧ (2 : ℝ) + 2 = 4 := by
  refine ⟨by norm_num, ?_, ?_, ?_, ?_, by norm_num, by norm_num⟩
  · rw [enacba_iff (P := (x - 1) * (x - 1)) (by ring), dva_faktorja, or_self]
  · rw [enacba_iff (P := (x - -2) * (x - -2)) (by ring), dva_faktorja, or_self]
  · rw [enacba_iff (P := (x - 3) * (x - 3)) (by ring), dva_faktorja, or_self]
  · rw [enacba_iff (P := (x - -1) * (x - 2)) (by ring), dva_faktorja]

/-- Preveri se 2: x² − 3x + 1 = 2x − 3 ⇔ x² − 5x + 4 = 0 ⇔ x ∈ {1, 4}; pri večji abscisi 4 je ordinata
2·4 − 3 = 5 (preverba 16 − 12 + 1 = 5), pri 1 je −1.
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#preveri2
besedilo: »Enačba $x^2 - 5x + 4 = 0$ ima rešitvi $1$ in $4$. Pri $x = 4$ je $y = 2 \cdot 4 - 3 = 5$; preverba na paraboli: $16 - 12 + 1 = 5$.« -/
theorem preveri2 (x : ℝ) : (x ^ 2 - 3 * x + 1 = 2 * x - 3 ↔ x = 1 ∨ x = 4) ∧ 2 * (4 : ℝ) - 3 = 5 ∧
    (4 : ℝ) ^ 2 - 3 * 4 + 1 = 5 ∧ 2 * (1 : ℝ) - 3 = -1 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  rw [enacba_iff (P := (x - 1) * (x - 4)) (by ring), dva_faktorja]

/-- Preveri se 3: x² = 2x + n ⇔ x² − 2x − n = 0, D = 4 + 4n; presečišči se zlijeta pri D = 0 ⇔ n = −1,
dotikališče (1, 1) (1² = 1); pri n = 0 sta skupni točki (0, 0) in (2, 4) (0² = 0, 2² = 4).
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#preveri3
besedilo: »Enačba $x^2 = 2x + n$ oziroma $x^2 - 2x - n = 0$ ima $D = 4 + 4n$. Presečišči se zlijeta pri $D = 0$, torej $n = -1$; tedaj je premica tangenta z dotikališčem $(1, 1)$.« -/
theorem preveri3 (n x : ℝ) : (x ^ 2 = 2 * x + n ↔ x ^ 2 - 2 * x - n = 0) ∧
    (-2 : ℝ) ^ 2 - 4 * 1 * (-n) = 4 + 4 * n ∧ (4 + 4 * n = 0 ↔ n = -1) ∧ (x ^ 2 = 2 * x + -1 ↔ x = 1) ∧
    (x ^ 2 = 2 * x + 0 ↔ x = 0 ∨ x = 2) ∧ (1 : ℝ) ^ 2 = 1 ∧ (0 : ℝ) ^ 2 = 0 ∧ (2 : ℝ) ^ 2 = 4 := by
  refine ⟨by constructor <;> intro h <;> linarith, by ring, by constructor <;> intro h <;> linarith, ?_, ?_,
    by norm_num, by norm_num, by norm_num⟩
  · rw [enacba_iff (P := (x - 1) * (x - 1)) (by ring), dva_faktorja, or_self]
  · rw [enacba_iff (P := (x - 0) * (x - 2)) (by ring), dva_faktorja]

/-- Preveri se 4: korak 2 je napačen: x² − 3x ≥ 0 ⇔ x ≤ 0 ali x ≥ 3 (x = 1: 1 − 3 = −2 < 0); prvi korak je
pravilen, pravilni presek z (−2, 2) je (−2, 0].
trditev: MAT-SS-2/presecisca-parabol-in-sistemi-kvadratnih-neenacb#preveri4
besedilo: »(višja raven) Miha rešuje sistem $x^2 - 4 < 0$ in $x^2 - 3x \ge 0$. Korak 1: prva neenačba ima rešitev $(-2, 2)$. Korak 2: druga neenačba ima rešitev $[0, 3]$. Korak 3: presek je $[0, 2)$. Kateri korak je napačen?« -/
theorem preveri4 (x : ℝ) : (x ^ 2 - 4 < 0 ↔ -2 < x ∧ x < 2) ∧ (x ^ 2 - 3 * x ≥ 0 ↔ x ≤ 0 ∨ 3 ≤ x) ∧
    (1 : ℝ) ^ 2 - 3 * 1 = -2 ∧ ((x ^ 2 - 4 < 0 ∧ x ^ 2 - 3 * x ≥ 0) ↔ -2 < x ∧ x ≤ 0) := by
  have h1 : x ^ 2 - 4 < 0 ↔ -2 < x ∧ x < 2 := by
    rw [show x ^ 2 - 4 = 1 * (x - -2) * (x - 2) by ring]
    exact (predznak 1 (-2) 2 x one_pos (by norm_num)).1
  have h2 : x ^ 2 - 3 * x ≥ 0 ↔ x ≤ 0 ∨ 3 ≤ x := by
    rw [ge_iff_le, show x ^ 2 - 3 * x = 1 * (x - 0) * (x - 3) by ring]
    exact (predznak 1 0 3 x one_pos (by norm_num)).2.2.2
  refine ⟨h1, h2, by norm_num, ?_⟩
  rw [h1, h2]
  constructor
  · rintro ⟨⟨a, b⟩, c | c⟩
    · exact ⟨a, c⟩
    · exfalso; linarith
  · rintro ⟨a, b⟩; exact ⟨⟨a, by linarith⟩, Or.inl b⟩

end Evklid.Lekcije.MAT_SS_2.PreseciscaParabolInSistemiKvadratnihNeenacb
