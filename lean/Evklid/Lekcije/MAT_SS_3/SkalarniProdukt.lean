/-
vir: content/lessons/MAT-SS-3/skalarni-produkt.md
sha256: cddba5ff233a3b8f4752981ddb47d874c7a72281b3f04c8d4a47d4a01ed5bc3c
Model: vektorji v ℝ² / ℝ³ (`EuclideanSpace`, `!₂[…]`) ali v poljubnem realnem prostoru s skalarnim produktom;
a⃗·b⃗ = `inner ℝ a b`, kot φ = `InnerProductGeometry.angle` (arccos(a⃗·b⃗/(|a⃗||b⃗|)) ∈ [0, π]), stopinje = φ·180/π.
Leanov dogovor: `angle` z ničelnim vektorjem je π/2, zato `predznak` velja brez pogoja »neničelna« (za
neničelne vektorje je to trditev iz lekcije).
Ni v Leanu: uvodni zgodbi (dokazana sta le računa 5·cos 60° in 20·cos 60°), podoba sence ob soncu; risba
(dokazane so koordinate) in simulacija; »premici sta pravokotni, ko sta pravokotna smerna vektorja, tudi
mimobežni« (dogovor/definicija; dokazan je račun v Preveri se 7); projekcija daljice na ravnino in palica
(dokazan je le račun 2·cos 60° = 1 in |b⃗_a| = |b⃗|cos φ za oster kot); fizikalne razlage (sila premika telo,
krmar, delo sile in kovček, »Drugače«); α ≈ 71,6833° na štiri decimalke (zahtevno, še ni dokazano; dokazano
je 71,675° < α < 71,685°, torej α ≈ 71,68°); utemeljitev višine s pravokotnim trikotnikom v Nalogi 2 c)
(dokazana je razdalja |AC⃗ − projekcija|² = 146/9); točkovanje.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.SkalarniProdukt

open InnerProductGeometry Real

/-- Ravnina ℝ² (vektor `!₂[a_x, a_y]`, skalarni produkt `inner ℝ`, kot `angle`). -/
abbrev R2 := EuclideanSpace ℝ (Fin 2)

/-- Prostor ℝ³ (vektor `!₂[a_x, a_y, a_z]`). -/
abbrev R3 := EuclideanSpace ℝ (Fin 3)

/-- Razlaga in Povzetek (po komponentah): a⃗·b⃗ = a_x b_x + a_y b_y v ravnini.
trditev: MAT-SS-3/skalarni-produkt#skalarni2
besedilo: »$$\vec a \cdot \vec b = a_x b_x + a_y b_y + a_z b_z$$« -/
theorem skalarni2 (a₁ a₂ b₁ b₂ : ℝ) : inner ℝ (!₂[a₁, a₂] : R2) !₂[b₁, b₂] = a₁ * b₁ + a₂ * b₂ := by
  simp [EuclideanSpace.inner_eq_star_dotProduct, dotProduct, Fin.sum_univ_two]; ring

/-- Razlaga in Povzetek (po komponentah): a⃗·b⃗ = a_x b_x + a_y b_y + a_z b_z v prostoru.
trditev: MAT-SS-3/skalarni-produkt#skalarni3
besedilo: »$$\vec a \cdot \vec b = a_x b_x + a_y b_y + a_z b_z$$« -/
theorem skalarni3 (a₁ a₂ a₃ b₁ b₂ b₃ : ℝ) :
    inner ℝ (!₂[a₁, a₂, a₃] : R3) !₂[b₁, b₂, b₃] = a₁ * b₁ + a₂ * b₂ + a₃ * b₃ := by
  simp [EuclideanSpace.inner_eq_star_dotProduct, dotProduct, Fin.sum_univ_three]; ring

/-- Razlaga: dolžina v ravnini |a⃗| = √(a_x² + a_y²).
trditev: MAT-SS-3/skalarni-produkt#dolzina2
besedilo: »Od tod dobiš dolžino iz komponent: $|\vec a| = \sqrt{a_x^2 + a_y^2}$.« -/
theorem dolzina2 (a₁ a₂ : ℝ) : ‖(!₂[a₁, a₂] : R2)‖ = √(a₁ ^ 2 + a₂ ^ 2) := by
  rw [EuclideanSpace.norm_eq]; simp [Fin.sum_univ_two]

/-- Dolžina v prostoru |a⃗| = √(a_x² + a_y² + a_z²).
trditev: MAT-SS-3/skalarni-produkt#dolzina3
besedilo: »Od tod dobiš dolžino iz komponent: $|\vec a| = \sqrt{a_x^2 + a_y^2}$.« -/
theorem dolzina3 (a₁ a₂ a₃ : ℝ) : ‖(!₂[a₁, a₂, a₃] : R3)‖ = √(a₁ ^ 2 + a₂ ^ 2 + a₃ ^ 2) := by
  rw [EuclideanSpace.norm_eq]; simp [Fin.sum_univ_three]

/-- Pomožno: razlika po komponentah v ravnini.
pomozno -/
theorem razlika2 (a₁ a₂ b₁ b₂ : ℝ) : (!₂[a₁, a₂] : R2) - !₂[b₁, b₂] = !₂[a₁ - b₁, a₂ - b₂] := by
  ext i; fin_cases i <;> simp

/-- Pomožno: razlika po komponentah v prostoru.
pomozno -/
theorem razlika3 (a₁ a₂ a₃ b₁ b₂ b₃ : ℝ) :
    (!₂[a₁, a₂, a₃] : R3) - !₂[b₁, b₂, b₃] = !₂[a₁ - b₁, a₂ - b₂, a₃ - b₃] := by
  ext i; fin_cases i <;> simp

/-- Pomožno: večkratnik po komponentah v ravnini.
pomozno -/
theorem produkt2 (k a₁ a₂ : ℝ) : k • (!₂[a₁, a₂] : R2) = !₂[k * a₁, k * a₂] := by
  ext i; fin_cases i <;> simp

/-- Pomožno: večkratnik po komponentah v prostoru.
pomozno -/
theorem produkt3 (k a₁ a₂ a₃ : ℝ) : k • (!₂[a₁, a₂, a₃] : R3) = !₂[k * a₁, k * a₂, k * a₃] := by
  ext i; fin_cases i <;> simp

/-- Pomožno: √(x²) = x za x ≥ 0 v obliki, ki jo potrebujejo računi dolžin.
pomozno -/
theorem koren_kvadrata {s x : ℝ} (hx : 0 ≤ x) (h : s = x ^ 2) : √s = x := by
  rw [h, Real.sqrt_sq hx]

/-- Predpostavki `koren_kvadrata` se dajo izpolniti (x = 5, s = 25). -/
example : (0:ℝ) ≤ 5 ∧ (25:ℝ) = 5 ^ 2 := by norm_num

variable {V : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V]

/-! ## Splošna pravila (realni prostor s skalarnim produktom) -/

/-- Razlaga in Povzetek (definicija): a⃗·b⃗ = |a⃗||b⃗|cos φ, kjer je φ kot med vektorjema, 0 ≤ φ ≤ π; velja
cos φ = a⃗·b⃗/(|a⃗||b⃗|) in a⃗·a⃗ = |a⃗|².
trditev: MAT-SS-3/skalarni-produkt#definicija
besedilo: »Skalarni produkt vektorjev $\vec a$ in $\vec b$ je število $\vec a \cdot \vec b = |\vec a|\,|\vec b|\cos\varphi$, kjer je $\varphi$ kot med vektorjema s skupnim začetkom in $0^\circ \le \varphi \le 180^\circ$.« -/
theorem definicija (a b : V) :
    inner ℝ a b = ‖a‖ * ‖b‖ * Real.cos (angle a b) ∧ 0 ≤ angle a b ∧ angle a b ≤ π ∧
    Real.cos (angle a b) = inner ℝ a b / (‖a‖ * ‖b‖) ∧ inner ℝ a a = ‖a‖ ^ 2 := by
  refine ⟨by rw [← cos_angle_mul_norm_mul_norm]; ring, angle_nonneg a b, angle_le_pi a b, cos_angle a b,
    real_inner_self_eq_norm_sq a⟩

/-- Razlaga (pravokotnost in predznak): a⃗·b⃗ = 0 ↔ φ = π/2; a⃗·b⃗ > 0 ↔ φ < π/2 (oster kot);
a⃗·b⃗ < 0 ↔ φ > π/2 (top kot).
trditev: MAT-SS-3/skalarni-produkt#predznak
besedilo: »$$\vec a \perp \vec b \iff \vec a \cdot \vec b = 0$$« -/
theorem predznak (a b : V) :
    (inner ℝ a b = 0 ↔ angle a b = π / 2) ∧ (0 < inner ℝ a b ↔ angle a b < π / 2) ∧
    (inner ℝ a b < 0 ↔ π / 2 < angle a b) := by
  refine ⟨inner_eq_zero_iff_angle_eq_pi_div_two a b, ?_, inner_neg_iff_pi_div_two_lt_angle⟩
  rw [← not_le, ← not_le, inner_nonpos_iff_pi_div_two_le_angle]

/-- Razlaga (pravila računanja): a⃗·b⃗ = b⃗·a⃗, a⃗·(b⃗ + c⃗) = a⃗·b⃗ + a⃗·c⃗, (k a⃗)·b⃗ = k(a⃗·b⃗).
trditev: MAT-SS-3/skalarni-produkt#pravila
besedilo: »Za računanje velja še: $\vec a \cdot \vec b = \vec b \cdot \vec a$, $\vec a \cdot (\vec b + \vec c) = \vec a \cdot \vec b + \vec a \cdot \vec c$ in $(k\vec a) \cdot \vec b = k(\vec a \cdot \vec b)$.« -/
theorem pravila (a b c : V) (k : ℝ) :
    inner ℝ a b = inner ℝ b a ∧ inner ℝ a (b + c) = inner ℝ a b + inner ℝ a c ∧
    inner ℝ (k • a) b = k * inner ℝ a b :=
  ⟨real_inner_comm b a, inner_add_right a b c, real_inner_smul_left a b k⟩

/-- Razlaga (premica pravokotna na ravnino): če je n⃗ pravokoten na u⃗ in v⃗, je pravokoten na vsak vektor
ravnine α u⃗ + β v⃗.
trditev: MAT-SS-3/skalarni-produkt#pravokotno-na-ravnino
besedilo: »Premica je pravokotna na ravnino, ko je vektor v njeni smeri pravokoten na dva nekolinearna vektorja te ravnine.« -/
theorem pravokotno_na_ravnino (n u v : V) (hu : inner ℝ n u = 0) (hv : inner ℝ n v = 0) (α β : ℝ) :
    inner ℝ n (α • u + β • v) = 0 := by
  rw [inner_add_right, real_inner_smul_right, real_inner_smul_right, hu, hv]; ring

/-- Predpostavke `pravokotno_na_ravnino` se dajo izpolniti (n⃗ = (0, 0, 1), u⃗ = (1, 0, 0), v⃗ = (0, 1, 0)). -/
example : inner ℝ (!₂[0, 0, 1] : R3) !₂[1, 0, 0] = 0 ∧ inner ℝ (!₂[0, 0, 1] : R3) !₂[0, 1, 0] = 0 := by
  rw [skalarni3, skalarni3]; norm_num

/-- Predpostavke trditve `pravokotno_na_ravnino` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : inner ℝ (!₂[0, 0, 1] : R3) !₂[1, 0, 0] = 0 ∧ inner ℝ (!₂[0, 0, 1] : R3) !₂[0, 1, 0] = 0 := by
    rw [skalarni3, skalarni3]; norm_num
  pravokotno_na_ravnino (hu := w.1) (hv := w.2)

/-- Razlaga (kosinusni izrek, Ustno vprašanje 2): |a⃗ − b⃗|² = a⃗·a⃗ − 2a⃗·b⃗ + b⃗·b⃗ = |a⃗|² + |b⃗|² − 2|a⃗||b⃗|cos γ;
pri γ = π/2 ostane Pitagorov izrek.
trditev: MAT-SS-3/skalarni-produkt#kosinusni-izrek
besedilo: »Vstavimo $\vec a \cdot \vec a = a^2$, $\vec b \cdot \vec b = b^2$ in $\vec a \cdot \vec b = ab\cos\gamma$ ter dobimo kosinusni izrek:« -/
theorem kosinusni_izrek (a b : V) :
    ‖a - b‖ ^ 2 = inner ℝ (a - b) (a - b) ∧
    inner ℝ (a - b) (a - b) = inner ℝ a a - 2 * inner ℝ a b + inner ℝ b b ∧
    ‖a - b‖ ^ 2 = ‖a‖ ^ 2 + ‖b‖ ^ 2 - 2 * ‖a‖ * ‖b‖ * Real.cos (angle a b) ∧
    (angle a b = π / 2 → ‖a - b‖ ^ 2 = ‖a‖ ^ 2 + ‖b‖ ^ 2) := by
  have h3 : ‖a - b‖ ^ 2 = ‖a‖ ^ 2 + ‖b‖ ^ 2 - 2 * ‖a‖ * ‖b‖ * Real.cos (angle a b) := by
    rw [norm_sub_sq_real, ← cos_angle_mul_norm_mul_norm]; ring
  refine ⟨(real_inner_self_eq_norm_sq _).symm, ?_, h3, fun h => by rw [h3, h, Real.cos_pi_div_two]; ring⟩
  rw [inner_sub_left, inner_sub_right, inner_sub_right, real_inner_comm a b]; ring

/-- Razlaga (pravokotna projekcija): b⃗_a = (a⃗·b⃗/|a⃗|²) a⃗; ostanek b⃗ − b⃗_a je pravokoten na a⃗; predznačena dolžina
je |b⃗|cos φ = a⃗·b⃗/|a⃗|, b⃗_a = (|b⃗|cos φ)·(a⃗/|a⃗|), dolžina |b⃗_a| = |a⃗·b⃗|/|a⃗| (za a⃗ ≠ 0⃗).
trditev: MAT-SS-3/skalarni-produkt#projekcija
besedilo: »Vektor $\vec b$ projiciramo na premico, na kateri leži $\vec a$, in dobimo vektor $\vec b_a$. Njegova predznačena dolžina je senca $|\vec b|\cos\varphi = \dfrac{\vec a \cdot \vec b}{|\vec a|}$, smer pa mu da enotski vektor $\dfrac{\vec a}{|\vec a|}$. Zmnožimo:« -/
theorem projekcija (a b : V) (ha : a ≠ 0) :
    inner ℝ a (b - (inner ℝ a b / ‖a‖ ^ 2) • a) = 0 ∧
    ‖b‖ * Real.cos (angle a b) = inner ℝ a b / ‖a‖ ∧
    (inner ℝ a b / ‖a‖ ^ 2) • a = (‖b‖ * Real.cos (angle a b)) • ((1 / ‖a‖) • a) ∧
    ‖(inner ℝ a b / ‖a‖ ^ 2) • a‖ = |inner ℝ a b| / ‖a‖ := by
  have hn : 0 < ‖a‖ := norm_pos_iff.2 ha
  have hs : ‖b‖ * Real.cos (angle a b) = inner ℝ a b / ‖a‖ := by
    rw [← cos_angle_mul_norm_mul_norm]; field_simp
  refine ⟨?_, hs, ?_, ?_⟩
  · rw [inner_sub_right, real_inner_smul_right, real_inner_self_eq_norm_sq]; field_simp; ring
  · rw [hs, smul_smul]; congr 1; field_simp
  · rw [norm_smul, Real.norm_eq_abs, abs_div, abs_of_pos (by positivity : (0:ℝ) < ‖a‖ ^ 2)]
    field_simp

/-- Razlaga: pri negativnem produktu kaže b⃗_a nasprotno od a⃗ (koeficient a⃗·b⃗/|a⃗|² je negativen, b⃗_a je
pozitiven večkratnik −a⃗).
trditev: MAT-SS-3/skalarni-produkt#projekcija-nazaj
besedilo: »Pri negativnem produktu kaže $\vec b_a$ nasprotno od $\vec a$. Za $\vec a = (4, 2)$ in $\vec b = (1, 3)$ je $\vec a \cdot \vec b = 4 + 6 = 10$ in $|\vec a|^2 = 20$, zato je $\vec b_a = \frac{10}{20}(4, 2) = (2, 1)$:« -/
theorem projekcija_nazaj (a b : V) (ha : a ≠ 0) (h : inner ℝ a b < 0) :
    inner ℝ a b / ‖a‖ ^ 2 < 0 ∧ SameRay ℝ (-a) ((inner ℝ a b / ‖a‖ ^ 2) • a) := by
  have hn : 0 < ‖a‖ ^ 2 := by have := norm_pos_iff.2 ha; positivity
  have hk : inner ℝ a b / ‖a‖ ^ 2 < 0 := div_neg_of_neg_of_pos h hn
  refine ⟨hk, ?_⟩
  rw [show (inner ℝ a b / ‖a‖ ^ 2) • a = (-(inner ℝ a b / ‖a‖ ^ 2)) • (-a) by rw [smul_neg, neg_smul, neg_neg]]
  exact SameRay.sameRay_pos_smul_right (-a) (by linarith)

/-- Predpostavke `projekcija_nazaj` se dajo izpolniti (a⃗ = (2, 2), b⃗ = (−3, 0): a⃗·b⃗ = −6). -/
example : (!₂[2, 2] : R2) ≠ 0 ∧ inner ℝ (!₂[2, 2] : R2) !₂[-3, 0] < 0 := by
  refine ⟨fun h => ?_, by rw [skalarni2]; norm_num⟩
  have := congrArg (fun v : R2 => v 0) h; simp at this

/-- Predpostavke trditve `projekcija_nazaj` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (!₂[2, 2] : R2) ≠ 0 ∧ inner ℝ (!₂[2, 2] : R2) !₂[-3, 0] < 0 := by
    refine ⟨fun h => ?_, by rw [skalarni2]; norm_num⟩
    have := congrArg (fun v : R2 => v 0) h; simp at this
  projekcija_nazaj (ha := w.1) (h := w.2)

/-- Predpostavka `projekcija` se da izpolniti (a⃗ = (4, 2)). -/
example : (!₂[4, 2] : R2) ≠ 0 := by
  intro h; have := congrArg (fun v : R2 => v 0) h; simp at this

/-- Predpostavke trditve `projekcija` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (!₂[4, 2] : R2) ≠ 0 := by
    intro h; have := congrArg (fun v : R2 => v 0) h; simp at this
  projekcija (ha := w)

/-- Razlaga (projekcija daljice): pri ostrem kotu φ (φ ≤ π/2) je dolžina projekcije |b⃗|cos φ.
trditev: MAT-SS-3/skalarni-produkt#projekcija-daljice
besedilo: »Njegova predznačena dolžina je senca $|\vec b|\cos\varphi = \dfrac{\vec a \cdot \vec b}{|\vec a|}$,« -/
theorem projekcija_daljice (a b : V) (ha : a ≠ 0) (hφ : angle a b ≤ π / 2) :
    ‖(inner ℝ a b / ‖a‖ ^ 2) • a‖ = ‖b‖ * Real.cos (angle a b) := by
  have hi : 0 ≤ inner ℝ a b := by
    by_contra h; push Not at h; exact absurd ((predznak a b).2.2.1 h) (not_lt.2 hφ)
  rw [(projekcija a b ha).2.2.2, abs_of_nonneg hi, (projekcija a b ha).2.1]

/-- Predpostavke `projekcija_daljice` se dajo izpolniti (a⃗ = (4, 2), b⃗ = (1, 3): a⃗·b⃗ = 10 > 0). -/
example : (!₂[4, 2] : R2) ≠ 0 ∧ angle (!₂[4, 2] : R2) !₂[1, 3] ≤ π / 2 := by
  refine ⟨fun h => ?_, ?_⟩
  · have := congrArg (fun v : R2 => v 0) h; simp at this
  · exact ((predznak _ _).2.1.1 (by rw [skalarni2]; norm_num)).le

/-- Predpostavke trditve `projekcija_daljice` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (!₂[4, 2] : R2) ≠ 0 ∧ angle (!₂[4, 2] : R2) !₂[1, 3] ≤ π / 2 := by
    refine ⟨fun h => ?_, ?_⟩
    · have := congrArg (fun v : R2 => v 0) h; simp at this
    · exact ((predznak _ _).2.1.1 (by rw [skalarni2]; norm_num)).le
  projekcija_daljice (ha := w.1) (hφ := w.2)

/-- Premisli 3 in Preveri se 3: pri k > 0 je a⃗·(k b⃗) = k(a⃗·b⃗) (trikrat daljši b⃗ potroji produkt), kot pa ostane
enak.
trditev: MAT-SS-3/skalarni-produkt#raztezanje
besedilo: »Skalarni produkt se potroji, ker se potroji senca. Kot ostane enak: v formuli za $\cos\varphi$ se trojka pojavi v števcu in imenovalcu ter se pokrajša.« -/
theorem raztezanje (a b : V) (k : ℝ) (hk : 0 < k) :
    inner ℝ a (k • b) = k * inner ℝ a b ∧ angle a (k • b) = angle a b :=
  ⟨real_inner_smul_right a b k, angle_smul_right_of_pos a b hk⟩

/-- Predpostavka `raztezanje` se da izpolniti (k = 3 oziroma k = 2). -/
example : (0:ℝ) < 3 ∧ (0:ℝ) < 2 := by norm_num

/-- Predpostavke trditve `raztezanje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 3 ∧ (0:ℝ) < 2 := by norm_num
  raztezanje (hk := w.1)

/-- Pogoste napake (kot iz napačnih vektorjev): angle(AB⃗, BC⃗) = π − angle(BA⃗, BC⃗) = 180° − β.
trditev: MAT-SS-3/skalarni-produkt#napacen-kot
besedilo: »Ta vektorja nimata skupnega začetka, zato dobiš $180^\circ - \beta$.« -/
theorem napacen_kot (A B C : V) : angle (B - A) (C - B) = π - angle (A - B) (C - B) := by
  rw [show B - A = -(A - B) by abel, angle_neg_left]

/-! ## Razlaga: številski primeri -/

/-- Razlaga, tabela sence za |b⃗| = 10: 10·cos 0 = 10, 10·cos 60° = 5, 10·cos 90° = 0, 10·cos 120° = −5,
10·cos 180° = −10.
trditev: MAT-SS-3/skalarni-produkt#tabela-sence
besedilo: »Pravokotnost.** Pri $\varphi = 90^\circ$ se senca skrči v točko in $\cos 90^\circ = 0$.« -/
theorem tabela_sence :
    10 * Real.cos 0 = 10 ∧ 10 * Real.cos (π / 3) = 5 ∧ 10 * Real.cos (π / 2) = 0 ∧
    10 * Real.cos (2 * π / 3) = -5 ∧ 10 * Real.cos π = -10 := by
  have h120 : Real.cos (2 * π / 3) = -1 / 2 := by
    rw [show 2 * π / 3 = π - π / 3 by ring, Real.cos_pi_sub, Real.cos_pi_div_three]; norm_num
  refine ⟨by simp, by rw [Real.cos_pi_div_three]; norm_num, by simp, by rw [h120]; norm_num, by simp⟩

/-- Zakaj se tega učimo: 5·cos 60° = 2,5 km in 20·cos 60° = 10 km/h.
trditev: MAT-SS-3/skalarni-produkt#uvod
besedilo: »Planinka gre od parkirišča po ravni poti: $5\,\mathrm{km}$ hoje, smer poti pa s smerjo proti severu oklepa kot $60^\circ$. Koča stoji natanko severno. Koliko je napredovala v smeri proti severu? Ne $5\,\mathrm{km}$, ampak samo $2{,}5\,\mathrm{km}$.« -/
theorem uvod : 5 * Real.cos (π / 3) = 2.5 ∧ 20 * Real.cos (π / 3) = 10 := by
  rw [Real.cos_pi_div_three]; norm_num

/-- Premisli 1: pri kotu 150° je cos φ < 0, zato je produkt neničelnih vektorjev negativen.
trditev: MAT-SS-3/skalarni-produkt#premisli-150
besedilo: »Ker sta vektorja neničelna, iz $|\vec a|\,|\vec b|\cos\varphi = 0$ sledi $\cos\varphi = 0$ in zato $\varphi = 90^\circ$.« -/
theorem premisli_150 (a b : V) (ha : a ≠ 0) (hb : b ≠ 0) (h : angle a b = 5 * π / 6) :
    Real.cos (5 * π / 6) < 0 ∧ inner ℝ a b < 0 := by
  have hc : Real.cos (5 * π / 6) < 0 := by
    rw [show 5 * π / 6 = π - π / 6 by ring, Real.cos_pi_sub, Real.cos_pi_div_six]
    have : 0 < √3 := by positivity
    linarith
  refine ⟨hc, ?_⟩
  rw [← cos_angle_mul_norm_mul_norm, h]
  exact mul_neg_of_neg_of_pos hc (mul_pos (norm_pos_iff.2 ha) (norm_pos_iff.2 hb))

/-- Predpostavke `premisli_150` se dajo izpolniti: med (1, 0) in (−√3, 1) je kot 5π/6. -/
example : (!₂[1, 0] : R2) ≠ 0 ∧ (!₂[-Real.sqrt 3, 1] : R2) ≠ 0 ∧
    angle (!₂[1, 0] : R2) !₂[-Real.sqrt 3, 1] = 5 * π / 6 := by
  have h3 : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have n1 : ‖(!₂[1, 0] : R2)‖ = 1 := by rw [dolzina2]; exact koren_kvadrata (by norm_num) (by norm_num)
  have n2 : ‖(!₂[-Real.sqrt 3, 1] : R2)‖ = 2 := by
    rw [dolzina2]; exact koren_kvadrata (by norm_num) (by rw [neg_sq, h3]; norm_num)
  refine ⟨fun h => ?_, fun h => ?_, ?_⟩
  · have := congrArg (fun v : R2 => v 0) h; simp at this
  · have := congrArg (fun v : R2 => v 1) h; simp at this
  · unfold angle
    rw [skalarni2, n1, n2, show (1 * -Real.sqrt 3 + 0 * 1) / (1 * 2) = Real.cos (5 * π / 6) by
      rw [show 5 * π / 6 = π - π / 6 by ring, Real.cos_pi_sub, Real.cos_pi_div_six]; ring]
    exact Real.arccos_cos (by positivity) (by nlinarith [Real.pi_pos])

/-- Predpostavke trditve `premisli_150` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (!₂[1, 0] : R2) ≠ 0 ∧ (!₂[-Real.sqrt 3, 1] : R2) ≠ 0 ∧ angle (!₂[1, 0] : R2) !₂[-Real.sqrt 3, 1] = 5 * π / 6 := by
    have h3 : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
    have n1 : ‖(!₂[1, 0] : R2)‖ = 1 := by rw [dolzina2]; exact koren_kvadrata (by norm_num) (by norm_num)
    have n2 : ‖(!₂[-Real.sqrt 3, 1] : R2)‖ = 2 := by
      rw [dolzina2]; exact koren_kvadrata (by norm_num) (by rw [neg_sq, h3]; norm_num)
    refine ⟨fun h => ?_, fun h => ?_, ?_⟩
    · have := congrArg (fun v : R2 => v 0) h; simp at this
    · have := congrArg (fun v : R2 => v 1) h; simp at this
    · unfold angle
      rw [skalarni2, n1, n2, show (1 * -Real.sqrt 3 + 0 * 1) / (1 * 2) = Real.cos (5 * π / 6) by
        rw [show 5 * π / 6 = π - π / 6 by ring, Real.cos_pi_sub, Real.cos_pi_div_six]; ring]
      exact Real.arccos_cos (by positivity) (by nlinarith [Real.pi_pos])
  premisli_150 (ha := w.1) (hb := w.2.1) (h := w.2.2)

/-- Razlaga (zakaj po komponentah): enotska vektorja i⃗ = (1, 0), j⃗ = (0, 1): i⃗·i⃗ = j⃗·j⃗ = 1, i⃗·j⃗ = 0.
trditev: MAT-SS-3/skalarni-produkt#enotska
besedilo: »smer pa mu da enotski vektor $\dfrac{\vec a}{|\vec a|}$.« -/
theorem enotska : inner ℝ (!₂[1, 0] : R2) !₂[1, 0] = 1 ∧ inner ℝ (!₂[0, 1] : R2) !₂[0, 1] = 1 ∧
    inner ℝ (!₂[1, 0] : R2) !₂[0, 1] = 0 := by
  refine ⟨?_, ?_, ?_⟩ <;> rw [skalarni2] <;> norm_num

/-- Razlaga (preizkus): a⃗ = (3, 0), b⃗ = (2, 2), |a⃗| = 3, |b⃗| = 2√2, kot π/4: 3·2√2·(√2/2) = 6 = 3·2 + 0·2.
trditev: MAT-SS-3/skalarni-produkt#preizkus-45
besedilo: »Preizkus: $\vec a = (3, 0)$ in $\vec b = (2, 2)$ oklepata $45^\circ$, $|\vec a| = 3$, $|\vec b| = 2\sqrt 2$. Po definiciji $3 \cdot 2\sqrt2 \cdot \frac{\sqrt2}{2} = 6$, po komponentah $3 \cdot 2 + 0 \cdot 2 = 6$.« -/
theorem preizkus_45 :
    ‖(!₂[3, 0] : R2)‖ = 3 ∧ ‖(!₂[2, 2] : R2)‖ = 2 * √2 ∧ angle (!₂[3, 0] : R2) !₂[2, 2] = π / 4 ∧
    3 * (2 * √2) * (√2 / 2) = 6 ∧ inner ℝ (!₂[3, 0] : R2) !₂[2, 2] = 3 * 2 + 0 * 2 ∧ (3:ℝ) * 2 + 0 * 2 = 6 := by
  have s2 : √2 ^ 2 = 2 := Real.sq_sqrt (by norm_num)
  have n1 : ‖(!₂[3, 0] : R2)‖ = 3 := by rw [dolzina2]; exact koren_kvadrata (by norm_num) (by norm_num)
  have n2 : ‖(!₂[2, 2] : R2)‖ = 2 * √2 := by
    rw [dolzina2]; exact koren_kvadrata (by positivity) (by rw [mul_pow, s2]; norm_num)
  refine ⟨n1, n2, ?_, by nlinarith [s2], skalarni2 _ _ _ _, by norm_num⟩
  unfold angle
  rw [n1, n2, skalarni2, show ((3:ℝ) * 2 + 0 * 2) / (3 * (2 * √2)) = Real.cos (π / 4) by
    rw [Real.cos_pi_div_four]; field_simp; nlinarith [s2]]
  exact Real.arccos_cos (by positivity) (by nlinarith [Real.pi_pos])

/-- Razlaga (projekcija, slika): a⃗ = (4, 2), b⃗ = (1, 3): a⃗·b⃗ = 4 + 6 = 10, |a⃗|² = 20, b⃗_a = (10/20)(4, 2) = (2, 1),
ostanek (−1, 2) z 4·(−1) + 2·2 = 0; palica: 2·cos 60° = 1.
trditev: MAT-SS-3/skalarni-produkt#projekcija-primer
besedilo: »Za $\vec a = (4, 2)$ in $\vec b = (1, 3)$ je $\vec a \cdot \vec b = 4 + 6 = 10$ in $|\vec a|^2 = 20$, zato je $\vec b_a = \frac{10}{20}(4, 2) = (2, 1)$:« -/
theorem projekcija_primer :
    inner ℝ (!₂[4, 2] : R2) !₂[1, 3] = 10 ∧ ‖(!₂[4, 2] : R2)‖ ^ 2 = 20 ∧
    (10 / 20 : ℝ) • (!₂[4, 2] : R2) = !₂[2, 1] ∧ (!₂[1, 3] : R2) - !₂[2, 1] = !₂[-1, 2] ∧
    inner ℝ (!₂[4, 2] : R2) !₂[-1, 2] = 0 ∧ 2 * Real.cos (π / 3) = 1 := by
  refine ⟨by rw [skalarni2]; norm_num, by rw [dolzina2, Real.sq_sqrt (by positivity)]; norm_num,
    by rw [produkt2]; norm_num, by rw [razlika2]; norm_num, by rw [skalarni2]; norm_num,
    by rw [Real.cos_pi_div_three]; norm_num⟩

/-! ## Rešeni primeri -/

/-- Primer 1: pri |a⃗| = 4, |b⃗| = 5 in kotu 60° je cos 60° = 0,5 in a⃗·b⃗ = 4·5·0,5 = 10 > 0.
trditev: MAT-SS-3/skalarni-produkt#primer1
besedilo: »$\vec a \cdot \vec b = 4 \cdot 5 \cdot 0{,}5 = 10$« -/
theorem primer1 (a b : V) (ha : ‖a‖ = 4) (hb : ‖b‖ = 5) (h : angle a b = π / 3) :
    Real.cos (π / 3) = 0.5 ∧ inner ℝ a b = 4 * 5 * 0.5 ∧ (4:ℝ) * 5 * 0.5 = 10 ∧ 0 < inner ℝ a b := by
  have hc : Real.cos (π / 3) = 0.5 := by rw [Real.cos_pi_div_three]; norm_num
  have hi : inner ℝ a b = 4 * 5 * 0.5 := by rw [← cos_angle_mul_norm_mul_norm, h, hc, ha, hb]; ring
  exact ⟨hc, hi, by norm_num, by rw [hi]; norm_num⟩

/-- Predpostavke `primer1` se dajo izpolniti: a⃗ = (4, 0), b⃗ = (5/2, 5√3/2). -/
example : ‖(!₂[4, 0] : R2)‖ = 4 ∧ ‖(!₂[5 / 2, 5 * Real.sqrt 3 / 2] : R2)‖ = 5 ∧
    angle (!₂[4, 0] : R2) !₂[5 / 2, 5 * Real.sqrt 3 / 2] = π / 3 := by
  have h3 : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have n1 : ‖(!₂[4, 0] : R2)‖ = 4 := by rw [dolzina2]; exact koren_kvadrata (by norm_num) (by norm_num)
  have n2 : ‖(!₂[5 / 2, 5 * Real.sqrt 3 / 2] : R2)‖ = 5 := by
    rw [dolzina2]; exact koren_kvadrata (by norm_num) (by linear_combination (25 / 4) * h3)
  refine ⟨n1, n2, ?_⟩
  unfold angle
  rw [skalarni2, n1, n2, show (4 * (5 / 2) + 0 * (5 * Real.sqrt 3 / 2)) / (4 * 5) = Real.cos (π / 3) by
    rw [Real.cos_pi_div_three]; norm_num]
  exact Real.arccos_cos (by positivity) (by nlinarith [Real.pi_pos])

/-- Predpostavke trditve `primer1` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ‖(!₂[4, 0] : R2)‖ = 4 ∧ ‖(!₂[5 / 2, 5 * Real.sqrt 3 / 2] : R2)‖ = 5 ∧ angle (!₂[4, 0] : R2) !₂[5 / 2, 5 * Real.sqrt 3 / 2] = π / 3 := by
    have h3 : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
    have n1 : ‖(!₂[4, 0] : R2)‖ = 4 := by rw [dolzina2]; exact koren_kvadrata (by norm_num) (by norm_num)
    have n2 : ‖(!₂[5 / 2, 5 * Real.sqrt 3 / 2] : R2)‖ = 5 := by
      rw [dolzina2]; exact koren_kvadrata (by norm_num) (by linear_combination (25 / 4) * h3)
    refine ⟨n1, n2, ?_⟩
    unfold angle
    rw [skalarni2, n1, n2, show (4 * (5 / 2) + 0 * (5 * Real.sqrt 3 / 2)) / (4 * 5) = Real.cos (π / 3) by
      rw [Real.cos_pi_div_three]; norm_num]
    exact Real.arccos_cos (by positivity) (by nlinarith [Real.pi_pos])
  primer1 (ha := w.1) (hb := w.2.1) (h := w.2.2)

/-- Primer 2: (3, 4)·(5, −12) = 15 − 48 = −33 < 0 (top kot); |a⃗| = √(9 + 16) = 5, |b⃗| = √(25 + 144) = 13;
cos φ = −33/65 ≈ −0,508.
trditev: MAT-SS-3/skalarni-produkt#primer2
besedilo: »Dolžini: $|\vec a| = \sqrt{9 + 16} = 5$, $|\vec b| = \sqrt{25 + 144} = 13$.« -/
theorem primer2 :
    inner ℝ (!₂[3, 4] : R2) !₂[5, -12] = 3 * 5 + 4 * (-12) ∧ (3:ℝ) * 5 + 4 * (-12) = 15 - 48 ∧
    (15:ℝ) - 48 = -33 ∧ ‖(!₂[3, 4] : R2)‖ = √(9 + 16) ∧ √((9:ℝ) + 16) = 5 ∧
    ‖(!₂[5, -12] : R2)‖ = √(25 + 144) ∧ √((25:ℝ) + 144) = 13 ∧
    Real.cos (angle (!₂[3, 4] : R2) !₂[5, -12]) = -33 / (5 * 13) ∧ |(-33:ℝ) / 65 - (-0.508)| < 0.0005 ∧
    π / 2 < angle (!₂[3, 4] : R2) !₂[5, -12] := by
  have n1 : ‖(!₂[3, 4] : R2)‖ = 5 := by rw [dolzina2]; exact koren_kvadrata (by norm_num) (by norm_num)
  have n2 : ‖(!₂[5, -12] : R2)‖ = 13 := by rw [dolzina2]; exact koren_kvadrata (by norm_num) (by norm_num)
  refine ⟨skalarni2 _ _ _ _, by norm_num, by norm_num, by rw [dolzina2]; norm_num,
    koren_kvadrata (by norm_num) (by norm_num), by rw [dolzina2]; norm_num,
    koren_kvadrata (by norm_num) (by norm_num), ?_, by rw [abs_lt]; norm_num,
    (predznak _ _).2.2.1 (by rw [skalarni2]; norm_num)⟩
  rw [cos_angle, n1, n2, skalarni2]; norm_num

/-- Primer 3: BA⃗ = (1 − 5, 2 − 4) = (−4, −2), BC⃗ = (3 − 5, 8 − 4) = (−2, 4), BA⃗·BC⃗ = 8 − 8 = 0, kot pri B je π/2;
AB⃗ = (4, 2), AC⃗ = (2, 6), AB⃗·AC⃗ = 8 + 12 = 20, |AB⃗| = √20, |AC⃗| = √40, cos α = 20/√800 = √2/2 ≈ 0,707, α = π/4;
|BA⃗| = |BC⃗| = √20 (enakokrak pravokoten trikotnik).
trditev: MAT-SS-3/skalarni-produkt#primer3
besedilo: »Produkt: $4 \cdot 2 + 2 \cdot 6 = 8 + 12 = 20$. Dolžini: $|\overrightarrow{AB}| = \sqrt{20}$, $|\overrightarrow{AC}| = \sqrt{40}$.« -/
theorem primer3 :
    (!₂[1, 2] : R2) - !₂[5, 4] = !₂[-4, -2] ∧ (!₂[3, 8] : R2) - !₂[5, 4] = !₂[-2, 4] ∧
    inner ℝ (!₂[-4, -2] : R2) !₂[-2, 4] = 8 - 8 ∧ angle (!₂[-4, -2] : R2) !₂[-2, 4] = π / 2 ∧
    (!₂[5, 4] : R2) - !₂[1, 2] = !₂[4, 2] ∧ (!₂[3, 8] : R2) - !₂[1, 2] = !₂[2, 6] ∧
    inner ℝ (!₂[4, 2] : R2) !₂[2, 6] = 8 + 12 ∧ ‖(!₂[4, 2] : R2)‖ = √20 ∧ ‖(!₂[2, 6] : R2)‖ = √40 ∧
    (20:ℝ) / (√20 * √40) = 20 / √800 ∧ (20:ℝ) / √800 = √2 / 2 ∧ |√2 / 2 - 0.707| < 0.0005 ∧
    angle (!₂[4, 2] : R2) !₂[2, 6] = π / 4 ∧ ‖(!₂[-4, -2] : R2)‖ = √20 ∧ ‖(!₂[-2, 4] : R2)‖ = √20 := by
  have s2 : √2 ^ 2 = 2 := Real.sq_sqrt (by norm_num)
  have h800 : √(800:ℝ) = 20 * √2 := by
    rw [show (800:ℝ) = 20 ^ 2 * 2 by norm_num, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  have hc : (20:ℝ) / √800 = √2 / 2 := by rw [h800]; field_simp; nlinarith [s2]
  have h2a : (1.4141:ℝ) < √2 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have h2b : √2 < (1.4143:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  have n1 : ‖(!₂[4, 2] : R2)‖ = √20 := by rw [dolzina2]; norm_num
  have n2 : ‖(!₂[2, 6] : R2)‖ = √40 := by rw [dolzina2]; norm_num
  have hm : √(20:ℝ) * √40 = √800 := by rw [← Real.sqrt_mul (by norm_num)]; norm_num
  refine ⟨by rw [razlika2]; norm_num, by rw [razlika2]; norm_num, by rw [skalarni2]; norm_num,
    (predznak _ _).1.1 (by rw [skalarni2]; norm_num), by rw [razlika2]; norm_num, by rw [razlika2]; norm_num,
    by rw [skalarni2]; norm_num, n1, n2, by rw [hm], hc, by rw [abs_lt]; constructor <;> linarith, ?_,
    by rw [dolzina2]; norm_num, by rw [dolzina2]; norm_num⟩
  unfold angle
  rw [n1, n2, skalarni2, hm, show ((4:ℝ) * 2 + 2 * 6) = 20 by norm_num, hc, ← Real.cos_pi_div_four]
  exact Real.arccos_cos (by positivity) (by nlinarith [Real.pi_pos])

/-- Primer 4: (4, 3)·(6, t) = 0 ↔ 24 + 3t = 0 ↔ 3t = −24 ↔ t = −8; preizkus 4·6 + 3·(−8) = 24 − 24 = 0.
trditev: MAT-SS-3/skalarni-produkt#primer4
besedilo: »$3t = -24$, zato $t = -8$. Preizkus: $4 \cdot 6 + 3 \cdot (-8) = 24 - 24 = 0$. Pešpot ima smer $(6, -8)$.« -/
theorem primer4 (t : ℝ) :
    (inner ℝ (!₂[4, 3] : R2) !₂[6, t] = 0 ↔ 4 * 6 + 3 * t = 0) ∧ (4 * 6 + 3 * t = 0 ↔ 24 + 3 * t = 0) ∧
    (24 + 3 * t = 0 ↔ 3 * t = -24) ∧ (3 * t = -24 ↔ t = -8) ∧ (4:ℝ) * 6 + 3 * (-8) = 24 - 24 ∧
    (24:ℝ) - 24 = 0 := by
  refine ⟨by rw [skalarni2], by norm_num, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num⟩

/-- Primer 5: pri |a⃗| = 3, |b⃗| = 5 in kotu 120° (cos 120° = −0,5) je a⃗·b⃗ = 3·5·(−0,5) = −7,5,
|a⃗ − b⃗|² = 9 − 2·(−7,5) + 25 = 49 in |a⃗ − b⃗| = √49 = 7.
trditev: MAT-SS-3/skalarni-produkt#primer5
besedilo: »Skalarni produkt: $\vec a \cdot \vec b = 3 \cdot 5 \cdot (-0{,}5) = -7{,}5$. Kot je top: $\cos 120^\circ = -0{,}5$.« -/
theorem primer5 (a b : V) (ha : ‖a‖ = 3) (hb : ‖b‖ = 5) (h : angle a b = 2 * π / 3) :
    Real.cos (2 * π / 3) = -0.5 ∧ inner ℝ a b = 3 * 5 * (-0.5) ∧ (3:ℝ) * 5 * (-0.5) = -7.5 ∧
    ‖a - b‖ ^ 2 = 9 - 2 * (-7.5) + 25 ∧ (9:ℝ) - 2 * (-7.5) + 25 = 49 ∧ ‖a - b‖ = √49 ∧ √(49:ℝ) = 7 := by
  have hc : Real.cos (2 * π / 3) = -0.5 := by
    rw [show 2 * π / 3 = π - π / 3 by ring, Real.cos_pi_sub, Real.cos_pi_div_three]; norm_num
  have hi : inner ℝ a b = 3 * 5 * (-0.5) := by rw [← cos_angle_mul_norm_mul_norm, h, hc, ha, hb]; ring
  have hs : ‖a - b‖ ^ 2 = 9 - 2 * (-7.5) + 25 := by rw [norm_sub_sq_real, hi, ha, hb]; norm_num
  refine ⟨hc, hi, by norm_num, hs, by norm_num, ?_, koren_kvadrata (by norm_num) (by norm_num)⟩
  rw [← Real.sqrt_sq (norm_nonneg (a - b)), hs]; norm_num

/-- Predpostavke `primer5` se dajo izpolniti: a⃗ = (3, 0), b⃗ = (−5/2, 5√3/2). -/
example : ‖(!₂[3, 0] : R2)‖ = 3 ∧ ‖(!₂[-5 / 2, 5 * Real.sqrt 3 / 2] : R2)‖ = 5 ∧
    angle (!₂[3, 0] : R2) !₂[-5 / 2, 5 * Real.sqrt 3 / 2] = 2 * π / 3 := by
  have h3 : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have n1 : ‖(!₂[3, 0] : R2)‖ = 3 := by rw [dolzina2]; exact koren_kvadrata (by norm_num) (by norm_num)
  have n2 : ‖(!₂[-5 / 2, 5 * Real.sqrt 3 / 2] : R2)‖ = 5 := by
    rw [dolzina2]; exact koren_kvadrata (by norm_num) (by linear_combination (25 / 4) * h3)
  refine ⟨n1, n2, ?_⟩
  unfold angle
  rw [skalarni2, n1, n2, show (3 * (-5 / 2) + 0 * (5 * Real.sqrt 3 / 2)) / (3 * 5) = Real.cos (2 * π / 3) by
    rw [show 2 * π / 3 = π - π / 3 by ring, Real.cos_pi_sub, Real.cos_pi_div_three]; norm_num]
  exact Real.arccos_cos (by positivity) (by nlinarith [Real.pi_pos])

/-- Predpostavke trditve `primer5` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ‖(!₂[3, 0] : R2)‖ = 3 ∧ ‖(!₂[-5 / 2, 5 * Real.sqrt 3 / 2] : R2)‖ = 5 ∧ angle (!₂[3, 0] : R2) !₂[-5 / 2, 5 * Real.sqrt 3 / 2] = 2 * π / 3 := by
    have h3 : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
    have n1 : ‖(!₂[3, 0] : R2)‖ = 3 := by rw [dolzina2]; exact koren_kvadrata (by norm_num) (by norm_num)
    have n2 : ‖(!₂[-5 / 2, 5 * Real.sqrt 3 / 2] : R2)‖ = 5 := by
      rw [dolzina2]; exact koren_kvadrata (by norm_num) (by linear_combination (25 / 4) * h3)
    refine ⟨n1, n2, ?_⟩
    unfold angle
    rw [skalarni2, n1, n2, show (3 * (-5 / 2) + 0 * (5 * Real.sqrt 3 / 2)) / (3 * 5) = Real.cos (2 * π / 3) by
      rw [show 2 * π / 3 = π - π / 3 by ring, Real.cos_pi_sub, Real.cos_pi_div_three]; norm_num]
    exact Real.arccos_cos (by positivity) (by nlinarith [Real.pi_pos])
  primer5 (ha := w.1) (hb := w.2.1) (h := w.2.2)

/-- Primer 6: a⃗·F⃗ = 4·20 + 3·90 = 350 > 0, |a⃗|² = 25, |a⃗| = 5; F⃗_a = (350/25)(4, 3) = 14·(4, 3) = (56, 42), dolžina
350/5 = 70 = √(56² + 42²); F⃗_⊥ = (20 − 56, 90 − 42) = (−36, 48), dolžina 60; 4·(−36) + 3·48 = 0;
70² + 60² = 8500 = 20² + 90².
trditev: MAT-SS-3/skalarni-produkt#primer6
besedilo: »Preizkus: $4 \cdot (-36) + 3 \cdot 48 = 0$, del je res pravokoten na kanal. Tudi $70^2 + 60^2 = 8500 = 20^2 + 90^2$.« -/
theorem primer6 :
    inner ℝ (!₂[4, 3] : R2) !₂[20, 90] = 4 * 20 + 3 * 90 ∧ (4:ℝ) * 20 + 3 * 90 = 350 ∧
    ‖(!₂[4, 3] : R2)‖ ^ 2 = 4 ^ 2 + 3 ^ 2 ∧ (4:ℝ) ^ 2 + 3 ^ 2 = 25 ∧ ‖(!₂[4, 3] : R2)‖ = 5 ∧
    (350 / 25 : ℝ) • (!₂[4, 3] : R2) = (14:ℝ) • !₂[4, 3] ∧ (14:ℝ) • (!₂[4, 3] : R2) = !₂[56, 42] ∧
    ‖(!₂[56, 42] : R2)‖ = 70 ∧ (350:ℝ) / 5 = 70 ∧
    (!₂[20, 90] : R2) - !₂[56, 42] = !₂[20 - 56, 90 - 42] ∧ (!₂[20 - 56, 90 - 42] : R2) = !₂[-36, 48] ∧
    ‖(!₂[-36, 48] : R2)‖ = 60 ∧ inner ℝ (!₂[4, 3] : R2) !₂[-36, 48] = 0 ∧
    (70:ℝ) ^ 2 + 60 ^ 2 = 8500 ∧ (20:ℝ) ^ 2 + 90 ^ 2 = 8500 := by
  have n : ‖(!₂[4, 3] : R2)‖ = 5 := by rw [dolzina2]; exact koren_kvadrata (by norm_num) (by norm_num)
  refine ⟨skalarni2 _ _ _ _, by norm_num, by rw [dolzina2, Real.sq_sqrt (by positivity)], by norm_num, n,
    by norm_num, by rw [produkt2]; norm_num,
    by rw [dolzina2]; exact koren_kvadrata (by norm_num) (by norm_num), by norm_num, razlika2 _ _ _ _,
    by norm_num, by rw [dolzina2]; exact koren_kvadrata (by norm_num) (by norm_num),
    by rw [skalarni2]; norm_num, by norm_num, by norm_num⟩

/-! ## Pogoste napake -/

/-- Pogoste napake: (3, 4)·(5, −12) je število 15 + (−48) = −33 (ne vektor (15, −48)); brez deljenja z dolžinama
bi bil »cos φ« = −33 < −1, kar ni kosinus nobenega kota; pri dolžini projekcije b⃗ = (7, 1) na a⃗ = (3, 4) je
25/25 = 1 le koeficient, dolžina je 25/5 = 5; neničelna (1, 0) in (0, 1) imata produkt 0.
trditev: MAT-SS-3/skalarni-produkt#napake
besedilo: »Rezultat zapišeš kot vektor.** Kdor računa $(3, 4) \cdot (5, -12) = (15, -48)$, je komponente zmnožil, ni pa jih seštel. Skalarni produkt je eno samo število: $15 + (-48) = -33$.« -/
theorem napake :
    inner ℝ (!₂[3, 4] : R2) !₂[5, -12] = 15 + (-48) ∧ (15:ℝ) + (-48) = -33 ∧
    (∀ φ : ℝ, Real.cos φ ≠ -33) ∧ (25:ℝ) / 25 = 1 ∧ (25:ℝ) / 5 = 5 ∧
    (!₂[1, 0] : R2) ≠ 0 ∧ (!₂[0, 1] : R2) ≠ 0 ∧ inner ℝ (!₂[1, 0] : R2) !₂[0, 1] = 0 := by
  refine ⟨by rw [skalarni2]; norm_num, by norm_num, fun φ h => by linarith [Real.neg_one_le_cos φ], by norm_num,
    by norm_num, fun h => ?_, fun h => ?_, by rw [skalarni2]; norm_num⟩
  · have := congrArg (fun v : R2 => v 0) h; simp at this
  · have := congrArg (fun v : R2 => v 1) h; simp at this

/-! ## Za maturo -/

/-- Naloga 1: a⃗ = (n, 2, −1) in b⃗ = (n, n, 8) nista ničelna; a⃗·b⃗ = n² + 2n − 8 = (n + 4)(n − 2), zato sta
pravokotna natanko pri n = −4 ali n = 2 (preizkus 4 + 4 − 8 = 0 in 16 − 8 − 8 = 0).
trditev: MAT-SS-3/skalarni-produkt#naloga1
besedilo: »Preizkus: pri $n = 2$ je $\vec a \cdot \vec b = 4 + 4 - 8 = 0$, pri $n = -4$ je $16 - 8 - 8 = 0$.« -/
theorem naloga1 (n : ℝ) :
    (!₂[n, 2, -1] : R3) ≠ 0 ∧ (!₂[n, n, 8] : R3) ≠ 0 ∧
    inner ℝ (!₂[n, 2, -1] : R3) !₂[n, n, 8] = n ^ 2 + 2 * n - 8 ∧ n ^ 2 + 2 * n - 8 = (n + 4) * (n - 2) ∧
    (angle (!₂[n, 2, -1] : R3) !₂[n, n, 8] = π / 2 ↔ n = -4 ∨ n = 2) ∧
    (4:ℝ) + 4 - 8 = 0 ∧ (16:ℝ) - 8 - 8 = 0 := by
  have hi : inner ℝ (!₂[n, 2, -1] : R3) !₂[n, n, 8] = n ^ 2 + 2 * n - 8 := by rw [skalarni3]; ring
  refine ⟨fun h => ?_, fun h => ?_, hi, by ring, ?_, by norm_num, by norm_num⟩
  · have := congrArg (fun v : R3 => v 1) h; simp at this
  · have := congrArg (fun v : R3 => v 2) h; simp at this
  · rw [← (predznak _ _).1, hi, show n ^ 2 + 2 * n - 8 = (n + 4) * (n - 2) by ring, mul_eq_zero]
    constructor
    · rintro (h | h)
      · left; linarith
      · right; linarith
    · rintro (h | h)
      · left; linarith
      · right; linarith

/-- Naloga 2 a): AB⃗ = (3 − 1, 0 + 1, 4 − 2) = (2, 1, 2), AC⃗ = (2 − 1, 3 + 1, 1 − 2) = (1, 4, −1),
AB⃗·AC⃗ = 2 + 4 − 2 = 4, |AB⃗| = √9 = 3, |AC⃗| = √18 = 3√2, cos α = 4/(3·3√2) = 4/(9√2) ≈ 0,314270.
trditev: MAT-SS-3/skalarni-produkt#naloga2a
besedilo: »$\cos\alpha = \dfrac{4}{3 \cdot 3\sqrt{2}} = \dfrac{4}{9\sqrt{2}} \approx 0{,}314270$« -/
theorem naloga2a :
    (!₂[3, 0, 4] : R3) - !₂[1, -1, 2] = !₂[2, 1, 2] ∧ (!₂[2, 3, 1] : R3) - !₂[1, -1, 2] = !₂[1, 4, -1] ∧
    inner ℝ (!₂[2, 1, 2] : R3) !₂[1, 4, -1] = 4 ∧ ‖(!₂[2, 1, 2] : R3)‖ = 3 ∧
    ‖(!₂[1, 4, -1] : R3)‖ = √18 ∧ √(18:ℝ) = 3 * √2 ∧
    Real.cos (angle (!₂[2, 1, 2] : R3) !₂[1, 4, -1]) = 4 / (3 * (3 * √2)) ∧ (4:ℝ) / (3 * (3 * √2)) = 4 / (9 * √2) ∧
    |4 / (9 * √2) - 0.314270| < 0.0000005 := by
  have h18 : √(18:ℝ) = 3 * √2 := by
    rw [show (18:ℝ) = 3 ^ 2 * 2 by norm_num, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  have n1 : ‖(!₂[2, 1, 2] : R3)‖ = 3 := by rw [dolzina3]; exact koren_kvadrata (by norm_num) (by norm_num)
  have n2 : ‖(!₂[1, 4, -1] : R3)‖ = √18 := by rw [dolzina3]; norm_num
  have a : (1.41421356:ℝ) < √2 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have b : √2 < (1.41421357:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  refine ⟨by rw [razlika3]; norm_num, by rw [razlika3]; norm_num, by rw [skalarni3]; norm_num, n1, n2, h18,
    by rw [cos_angle, n1, n2, h18, skalarni3]; norm_num, by ring_nf, ?_⟩
  rw [abs_lt]
  constructor
  · rw [lt_sub_iff_add_lt, lt_div_iff₀ (by positivity)]; nlinarith
  · rw [sub_lt_iff_lt_add, div_lt_iff₀ (by positivity)]; nlinarith

/-- Naloga 2 b): dolžina projekcije AC⃗ na AB⃗ je |AC⃗|cos α = AB⃗·AC⃗/|AB⃗| = 4/3; projekcija je
(4/3)·(1/3)(2, 1, 2) = (4/9)(2, 1, 2) = (8/9, 4/9, 8/9) (= (AB⃗·AC⃗/|AB⃗|²)·AB⃗).
trditev: MAT-SS-3/skalarni-produkt#naloga2b
besedilo: »projekcija pa $\frac{4}{3} \cdot \frac{1}{3}(2, 1, 2) = \frac{4}{9}(2, 1, 2) = \left(\frac{8}{9}, \frac{4}{9}, \frac{8}{9}\right)$.« -/
theorem naloga2b :
    ‖(!₂[1, 4, -1] : R3)‖ * Real.cos (angle (!₂[2, 1, 2] : R3) !₂[1, 4, -1]) = 4 / 3 ∧
    (4 / 3 * (1 / 3) : ℝ) • (!₂[2, 1, 2] : R3) = (4 / 9 : ℝ) • !₂[2, 1, 2] ∧
    (4 / 9 : ℝ) • (!₂[2, 1, 2] : R3) = !₂[8 / 9, 4 / 9, 8 / 9] ∧
    (inner ℝ (!₂[2, 1, 2] : R3) !₂[1, 4, -1] / ‖(!₂[2, 1, 2] : R3)‖ ^ 2) • (!₂[2, 1, 2] : R3) =
      !₂[8 / 9, 4 / 9, 8 / 9] ∧ 4 / 3 * (1 / 3) * (2:ℝ) = 8 / 9 := by
  have n1 : ‖(!₂[2, 1, 2] : R3)‖ = 3 := by rw [dolzina3]; exact koren_kvadrata (by norm_num) (by norm_num)
  have hi : inner ℝ (!₂[2, 1, 2] : R3) !₂[1, 4, -1] = 4 := by rw [skalarni3]; norm_num
  have hne : (!₂[2, 1, 2] : R3) ≠ 0 := fun h => by
    have := congrArg (fun v : R3 => v 0) h; simp at this
  refine ⟨by rw [(projekcija _ _ hne).2.1, hi, n1], by norm_num, by rw [produkt3]; norm_num,
    by rw [hi, n1, produkt3]; norm_num, by norm_num⟩

/-- Naloga 2 c): v_c² = 18 − 16/9 = 146/9 (višina je razdalja C do premice AB: |AC⃗ − projekcija|² = 146/9),
v_c = √146/3 ≈ 4,03; S = |AB⃗|·v_c/2 = √146/2 ≈ 6,04 = (1/2)|AB⃗||AC⃗| sin α.
trditev: MAT-SS-3/skalarni-produkt#naloga2c
besedilo: »Zato je $v_c^2 = 18 - \frac{16}{9} = \frac{146}{9}$ in $v_c = \frac{\sqrt{146}}{3} \approx 4{,}0277$, torej $v_c \approx 4{,}03$.« -/
theorem naloga2c :
    (18:ℝ) - 16 / 9 = 146 / 9 ∧
    ‖(!₂[1, 4, -1] : R3) - !₂[8 / 9, 4 / 9, 8 / 9]‖ ^ 2 = 146 / 9 ∧ √((146:ℝ) / 9) = √146 / 3 ∧
    |√146 / 3 - 4.03| < 0.005 ∧ 3 * (√146 / 3) / 2 = √146 / 2 ∧ |√146 / 2 - 6.04| < 0.005 ∧
    1 / 2 * 3 * √18 * Real.sin (angle (!₂[2, 1, 2] : R3) !₂[1, 4, -1]) = √146 / 2 := by
  have a : (12.083:ℝ) < √146 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have b : √146 < (12.0831:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  have h9 : √(146 / 9 : ℝ) = √146 / 3 := by
    rw [Real.sqrt_div' _ (by norm_num), show (9:ℝ) = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨by norm_num, ?_, h9, by rw [abs_lt]; constructor <;> linarith, by ring,
    by rw [abs_lt]; constructor <;> linarith, ?_⟩
  · rw [razlika3, dolzina3, Real.sq_sqrt (by positivity)]; norm_num
  · have n1 : ‖(!₂[2, 1, 2] : R3)‖ = 3 := by rw [dolzina3]; exact koren_kvadrata (by norm_num) (by norm_num)
    have n2 : ‖(!₂[1, 4, -1] : R3)‖ = √18 := by rw [dolzina3]; norm_num
    have h18 : √(18:ℝ) ^ 2 = 18 := Real.sq_sqrt (by norm_num)
    have hs : 0 < √(18:ℝ) := by positivity
    unfold angle
    rw [Real.sin_arccos, n1, n2, skalarni3]
    have : (1:ℝ) - ((2 * 1 + 1 * 4 + 2 * -1) / (3 * √18)) ^ 2 = 146 / 162 := by
      rw [div_pow, mul_pow, h18]; norm_num
    rw [this, show (146:ℝ) / 162 = 146 / 18 ^ 2 * 2 by norm_num]
    rw [Real.sqrt_mul (by norm_num), Real.sqrt_div' _ (by norm_num), Real.sqrt_sq (by norm_num)]
    have h182 : √(18:ℝ) = 3 * √2 := by
      rw [show (18:ℝ) = 3 ^ 2 * 2 by norm_num, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
    rw [h182]
    have s2 : √2 ^ 2 = 2 := Real.sq_sqrt (by norm_num)
    field_simp
    nlinarith [s2]

/-- Ustno vprašanje 3 in Preveri se 1: (1, 2, 2)·(2, 1, −2) = 2 + 2 − 4 = 0, vektorja sta neničelna in kot je
π/2; enako za neničelno smer letenja in vetra s produktom 0.
trditev: MAT-SS-3/skalarni-produkt#ustno3
besedilo: »Njun skalarni produkt po komponentah je $1 \cdot 2 + 2 \cdot 1 + 2 \cdot (-2) = 0$.« -/
theorem ustno3 :
    inner ℝ (!₂[1, 2, 2] : R3) !₂[2, 1, -2] = 1 * 2 + 2 * 1 + 2 * (-2) ∧ (1:ℝ) * 2 + 2 * 1 + 2 * (-2) = 0 ∧
    (!₂[1, 2, 2] : R3) ≠ 0 ∧ (!₂[2, 1, -2] : R3) ≠ 0 ∧ angle (!₂[1, 2, 2] : R3) !₂[2, 1, -2] = π / 2 := by
  refine ⟨skalarni3 _ _ _ _ _ _, by norm_num, fun h => ?_, fun h => ?_,
    (predznak _ _).1.1 (by rw [skalarni3]; norm_num)⟩
  · have := congrArg (fun v : R3 => v 0) h; simp at this
  · have := congrArg (fun v : R3 => v 0) h; simp at this

/-! ## Preveri se -/

/-- Preveri se 2: pri enakih dolžinah L > 0 je L²cos 20° > L²cos 90° = 0 > L²cos 135°; cos 20° ≈ 0,94,
cos 135° = −√2/2 ≈ −0,71.
trditev: MAT-SS-3/skalarni-produkt#kviz2
besedilo: »Pri enakih dolžinah odloča $\cos\varphi$: $\cos 20^\circ \approx 0{,}94$, $\cos 90^\circ = 0$, $\cos 135^\circ \approx -0{,}71$.« -/
theorem kviz2 (L : ℝ) (hL : 0 < L) :
    L * L * Real.cos (π / 2) < L * L * Real.cos (π / 9) ∧ L * L * Real.cos (3 * π / 4) < L * L * Real.cos (π / 2) ∧
    |Real.cos (π / 9) - 0.94| < 0.005 ∧ Real.cos (3 * π / 4) = -(√2 / 2) ∧ |-(√2 / 2) - (-0.71)| < 0.005 := by
  have h135 : Real.cos (3 * π / 4) = -(√2 / 2) := by
    rw [show 3 * π / 4 = π - π / 4 by ring, Real.cos_pi_sub, Real.cos_pi_div_four]
  have h2a : (1.414:ℝ) < √2 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have h2b : √2 < (1.415:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  have hp1 := Real.pi_gt_d6
  have hp2 := Real.pi_lt_d6
  have hx : |π / 9| ≤ 1 := by rw [abs_of_pos (by positivity)]; linarith
  have hb := Real.cos_bound hx
  have hc20 : 0 < Real.cos (π / 9) := Real.cos_pos_of_mem_Ioo ⟨by linarith, by linarith⟩
  have hLL : 0 < L * L := mul_pos hL hL
  refine ⟨?_, ?_, ?_, h135, by rw [abs_lt]; constructor <;> linarith⟩
  · rw [Real.cos_pi_div_two, mul_zero]; positivity
  · rw [Real.cos_pi_div_two, mul_zero, h135]; nlinarith
  · rw [abs_le] at hb
    rw [abs_of_pos (by positivity : (0:ℝ) < π / 9)] at hb
    obtain ⟨hb1, hb2⟩ := hb
    have e1 : (π / 9) ^ 2 / 2 < 0.0610 := by nlinarith
    have e2 : 0.0608 < (π / 9) ^ 2 / 2 := by nlinarith
    have e3 : (π / 9) ^ 4 * (5 / 96) < 0.001 := by nlinarith
    rw [abs_lt]; constructor <;> nlinarith

/-- Predpostavka `kviz2` se da izpolniti (L = 1). -/
example : (0:ℝ) < 1 := one_pos

/-- Predpostavke trditve `kviz2` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 1 := one_pos
  kviz2 (hL := w)

/-- Preveri se 4: (2, −1, 3)·(1, 4, 2) = 2 − 4 + 6 = 4 (napačno 12 = 2 + 4 + 6, če izpustimo predznak).
trditev: MAT-SS-3/skalarni-produkt#kviz4
besedilo: »$2 \cdot 1 + (-1) \cdot 4 + 3 \cdot 2 = 2 - 4 + 6 = 4$« -/
theorem kviz4 :
    inner ℝ (!₂[2, -1, 3] : R3) !₂[1, 4, 2] = 2 * 1 + (-1) * 4 + 3 * 2 ∧ (2:ℝ) * 1 + (-1) * 4 + 3 * 2 = 2 - 4 + 6 ∧
    (2:ℝ) - 4 + 6 = 4 ∧ (2:ℝ) + 4 + 6 = 12 := by
  refine ⟨skalarni3 _ _ _ _ _ _, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 5: (2, 2)·(−3, 0) = −6, |a⃗| = 2√2, |b⃗| = 3, cos φ = −6/(6√2) = −√2/2 ≈ −0,707, φ = 3π/4 = 135°.
trditev: MAT-SS-3/skalarni-produkt#kviz5
besedilo: »$\vec a \cdot \vec b = -6$, $|\vec a| = 2\sqrt2$, $|\vec b| = 3$, $\cos\varphi = \dfrac{-6}{6\sqrt2} \approx -0{,}707$, zato $\varphi = 135^\circ$.« -/
theorem kviz5 :
    inner ℝ (!₂[2, 2] : R2) !₂[-3, 0] = -6 ∧ ‖(!₂[2, 2] : R2)‖ = 2 * √2 ∧ ‖(!₂[-3, 0] : R2)‖ = 3 ∧
    (-6:ℝ) / (2 * √2 * 3) = -(√2 / 2) ∧ |-(√2 / 2) - (-0.707)| < 0.0005 ∧
    angle (!₂[2, 2] : R2) !₂[-3, 0] = 3 * π / 4 := by
  have s2 : √2 ^ 2 = 2 := Real.sq_sqrt (by norm_num)
  have h2a : (1.4141:ℝ) < √2 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have h2b : √2 < (1.4143:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  have n1 : ‖(!₂[2, 2] : R2)‖ = 2 * √2 := by
    rw [dolzina2]; exact koren_kvadrata (by positivity) (by rw [mul_pow, s2]; norm_num)
  have n2 : ‖(!₂[-3, 0] : R2)‖ = 3 := by rw [dolzina2]; exact koren_kvadrata (by norm_num) (by norm_num)
  have hc : (-6:ℝ) / (2 * √2 * 3) = -(√2 / 2) := by field_simp; nlinarith [s2]
  refine ⟨by rw [skalarni2]; norm_num, n1, n2, hc, by rw [abs_lt]; constructor <;> linarith, ?_⟩
  unfold angle
  rw [n1, n2, skalarni2, show (2:ℝ) * -3 + 2 * 0 = -6 by norm_num, hc]
  rw [show -(√2 / 2) = Real.cos (3 * π / 4) by
    rw [show 3 * π / 4 = π - π / 4 by ring, Real.cos_pi_sub, Real.cos_pi_div_four]]
  exact Real.arccos_cos (by positivity) (by nlinarith [Real.pi_pos])

/-- Preveri se 6: b⃗ = (7, 1) na a⃗ = (3, 4): a⃗·b⃗ = 21 + 4 = 25, |a⃗| = 5, dolžina projekcije 25/5 = 5, projekcija
(25/25)a⃗ = (3, 4); napačni 25 (produkt), 1 (koeficient), |b⃗| = √50 ≈ 7,07.
trditev: MAT-SS-3/skalarni-produkt#kviz6
besedilo: »$\vec a \cdot \vec b = 21 + 4 = 25$ in $|\vec a| = 5$, zato je dolžina projekcije $\frac{25}{5} = 5$. Projekcija je $\frac{25}{25}\vec a = (3, 4)$.« -/
theorem kviz6 :
    inner ℝ (!₂[3, 4] : R2) !₂[7, 1] = 25 ∧ ‖(!₂[3, 4] : R2)‖ = 5 ∧
    ‖(inner ℝ (!₂[3, 4] : R2) !₂[7, 1] / ‖(!₂[3, 4] : R2)‖ ^ 2) • (!₂[3, 4] : R2)‖ = 5 ∧
    (25 / 25 : ℝ) • (!₂[3, 4] : R2) = !₂[3, 4] ∧ |‖(!₂[7, 1] : R2)‖ - 7.07| < 0.005 := by
  have hi : inner ℝ (!₂[3, 4] : R2) !₂[7, 1] = 25 := by rw [skalarni2]; norm_num
  have n : ‖(!₂[3, 4] : R2)‖ = 5 := by rw [dolzina2]; exact koren_kvadrata (by norm_num) (by norm_num)
  have hne : (!₂[3, 4] : R2) ≠ 0 := fun h => by have := congrArg (fun v : R2 => v 0) h; simp at this
  refine ⟨hi, n, by rw [(projekcija _ _ hne).2.2.2, hi, n]; norm_num, by norm_num, ?_⟩
  rw [dolzina2]
  have a : (7.07:ℝ) < √(7 ^ 2 + 1 ^ 2) := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have b : √((7:ℝ) ^ 2 + 1 ^ 2) < 7.075 := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  rw [abs_lt]; constructor <;> linarith

/-- Preveri se 7: AG⃗ = (4, 4, 4), BD⃗ = D − B = (−4, 4, 0), AG⃗·BD⃗ = −16 + 16 + 0 = 0 (pravokotni mimobežnici);
napačno 32 = (4, 4, 4)·(4, 4, 0) (B + D namesto D − B).
trditev: MAT-SS-3/skalarni-produkt#kviz7
besedilo: »$\overrightarrow{AG} = (4, 4, 4)$ in $\overrightarrow{BD} = (-4, 4, 0)$, produkt je $-16 + 16 + 0 = 0$. Diagonali sta pravokotni mimobežnici.« -/
theorem kviz7 :
    (!₂[4, 4, 4] : R3) - !₂[0, 0, 0] = !₂[4, 4, 4] ∧ (!₂[0, 4, 0] : R3) - !₂[4, 0, 0] = !₂[-4, 4, 0] ∧
    inner ℝ (!₂[4, 4, 4] : R3) !₂[-4, 4, 0] = 0 ∧ inner ℝ (!₂[4, 4, 4] : R3) !₂[4, 4, 0] = 32 := by
  refine ⟨by rw [razlika3]; norm_num, by rw [razlika3]; norm_num, by rw [skalarni3]; norm_num,
    by rw [skalarni3]; norm_num⟩

/-- Blok RACUN: √(3² + 5² − 2·3·5·cos 120°) = 7, n² + 2n − 8 = 0 ↔ n ∈ {−4, 2}, 4·(1 − 2) + 2·(3 − 1) = 0,
(3·7 + 4·1)/√(3² + 4²) = 5, 10/20·4 = 2, 10/20·2 = 1, 350/25 = 14, 14·4 = 56, 14·3 = 42,
√((20 − 56)² + (90 − 42)²) = 60.
trditev: MAT-SS-3/skalarni-produkt#racun
besedilo: »Projekcija: $\vec F_a = \frac{350}{25}\,(4, 3) = 14 \cdot (4, 3) = (56, 42)\,\mathrm{N}$. Njena dolžina je $\frac{350}{5} = 70\,\mathrm{N}$.« -/
theorem racun :
    √((3:ℝ) ^ 2 + 5 ^ 2 - 2 * 3 * 5 * Real.cos (2 * π / 3)) = 7 ∧
    (∀ n : ℝ, n ^ 2 + 2 * n - 8 = 0 ↔ n = -4 ∨ n = 2) ∧ 4 * ((1:ℝ) - 2) + 2 * (3 - 1) = 0 ∧
    (3 * 7 + 4 * 1) / √((3:ℝ) ^ 2 + 4 ^ 2) = 5 ∧ (10:ℝ) / 20 * 4 = 2 ∧ (10:ℝ) / 20 * 2 = 1 ∧
    (350:ℝ) / 25 = 14 ∧ (14:ℝ) * 4 = 56 ∧ (14:ℝ) * 3 = 42 ∧ √(((20:ℝ) - 56) ^ 2 + (90 - 42) ^ 2) = 60 := by
  have h120 : Real.cos (2 * π / 3) = -1 / 2 := by
    rw [show 2 * π / 3 = π - π / 3 by ring, Real.cos_pi_sub, Real.cos_pi_div_three]; norm_num
  refine ⟨by rw [h120]; exact koren_kvadrata (by norm_num) (by norm_num), fun n => ?_, by norm_num,
    by rw [koren_kvadrata (x := 5) (by norm_num) (by norm_num)]; norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, koren_kvadrata (by norm_num) (by norm_num)⟩
  rw [show n ^ 2 + 2 * n - 8 = (n + 4) * (n - 2) by ring, mul_eq_zero]
  constructor
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · rintro (h | h)
    · left; linarith
    · right; linarith

/-! ## Koti v stopinjah (ocene) -/

/-- Pomožno: če je cos θ₂ < c < cos θ₁ za 0 ≤ θ₁ ≤ θ₂ ≤ π, je θ₁ < arccos c < θ₂ (kosinus na [0, π] pada).
pomozno -/
theorem kot_med {c θ₁ θ₂ : ℝ} (h1 : 0 ≤ θ₁) (h12 : θ₁ ≤ θ₂) (h2 : θ₂ ≤ π) (hc1 : c < Real.cos θ₁)
    (hc2 : Real.cos θ₂ < c) : θ₁ < Real.arccos c ∧ Real.arccos c < θ₂ := by
  have hm : -1 ≤ Real.cos θ₂ := Real.neg_one_le_cos θ₂
  constructor
  · have := Real.arccos_lt_arccos (by linarith) hc1 (Real.cos_le_one θ₁)
    rwa [Real.arccos_cos h1 (by linarith)] at this
  · have := Real.arccos_lt_arccos hm hc2 (by linarith [Real.cos_le_one θ₁])
    rwa [Real.arccos_cos (by linarith) h2] at this

/-- Predpostavke `kot_med` se dajo izpolniti (c = 0, θ₁ = π/3, θ₂ = 2π/3). -/
example : (0:ℝ) ≤ π / 3 ∧ π / 3 ≤ 2 * π / 3 ∧ 2 * π / 3 ≤ π ∧ (0:ℝ) < Real.cos (π / 3) ∧
    Real.cos (2 * π / 3) < 0 := by
  have hp := Real.pi_pos
  refine ⟨by positivity, by linarith, by linarith, by rw [Real.cos_pi_div_three]; norm_num, ?_⟩
  rw [show 2 * π / 3 = π - π / 3 by ring, Real.cos_pi_sub, Real.cos_pi_div_three]; norm_num

/-- Primer 2, korak 4: φ = arccos(−33/65) ≈ 120,5° (natančneje 120,45° < φ < 120,55°).
trditev: MAT-SS-3/skalarni-produkt#primer2-kot
besedilo: »$\varphi = \arccos(-0{,}508) \approx 120{,}5^\circ$« -/
theorem primer2_kot : |angle (!₂[3, 4] : R2) !₂[5, -12] * 180 / π - 120.5| < 0.05 := by
  have n1 : ‖(!₂[3, 4] : R2)‖ = 5 := by rw [dolzina2]; exact koren_kvadrata (by norm_num) (by norm_num)
  have n2 : ‖(!₂[5, -12] : R2)‖ = 13 := by rw [dolzina2]; exact koren_kvadrata (by norm_num) (by norm_num)
  have ha : angle (!₂[3, 4] : R2) !₂[5, -12] = Real.arccos (-33 / 65) := by
    unfold angle; rw [n1, n2, skalarni2]; norm_num
  rw [ha]
  have hp1 := Real.pi_gt_d6
  have hp2 := Real.pi_lt_d6
  have h3a : (1.732:ℝ) < √3 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have h3b : √3 < (1.7321:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  have hs : Real.sin (2 * π / 3) = √3 / 2 := by
    rw [show 2 * π / 3 = π - π / 3 by ring, Real.sin_pi_sub, Real.sin_pi_div_three]
  have hc : Real.cos (2 * π / 3) = -1 / 2 := by
    rw [show 2 * π / 3 = π - π / 3 by ring, Real.cos_pi_sub, Real.cos_pi_div_three]; norm_num
  set d₁ := π / 400 with hd₁
  set d₂ := 11 * π / 3600 with hd₂
  have c1 : -33 / 65 < Real.cos (2 * π / 3 + d₁) := by
    rw [Real.cos_add, hc, hs]
    have := Real.sin_le (show 0 ≤ d₁ by positivity)
    have := Real.cos_le_one d₁
    have : d₁ < 0.00786 := by rw [hd₁]; linarith
    nlinarith [Real.sin_nonneg_of_nonneg_of_le_pi (show 0 ≤ d₁ by positivity) (by linarith)]
  have c2 : Real.cos (2 * π / 3 + d₂) < -33 / 65 := by
    rw [Real.cos_add, hc, hs]
    have := Real.sin_gt_sub_cube (show 0 < d₂ by positivity)
    have := Real.one_sub_sq_div_two_le_cos (x := d₂)
    have : 0.0095 < d₂ := by rw [hd₂]; linarith
    have : d₂ < 0.0097 := by rw [hd₂]; linarith
    have hsd : 0.009499 < Real.sin d₂ := by nlinarith
    have hcd : 0.99995 < Real.cos d₂ := by nlinarith
    have : 1.732 * 0.009499 < √3 * Real.sin d₂ := mul_lt_mul'' h3a hsd (by norm_num) (by norm_num)
    linarith
  obtain ⟨k1, k2⟩ := kot_med (by positivity) (by linarith) (by linarith) c1 c2
  rw [abs_lt]
  constructor
  · rw [lt_sub_iff_add_lt, lt_div_iff₀ (by positivity)]; nlinarith
  · rw [sub_lt_iff_lt_add, div_lt_iff₀ (by positivity)]; nlinarith

/-- Naloga 2 a): α = arccos(4/(9√2)) ≈ 71,68° (natančneje 71,675° < α < 71,685°; ocena s
cos 72° = (√5 − 1)/4 in kotom 72° − α).
trditev: MAT-SS-3/skalarni-produkt#naloga2a-kot
besedilo: »a) $\cos\alpha = \dfrac{4}{3 \cdot 3\sqrt{2}} = \dfrac{4}{9\sqrt{2}} \approx 0{,}314270$, zato je $\alpha = \arccos 0{,}314270 \approx 71{,}6833^\circ \approx 71{,}68^\circ$.« -/
theorem naloga2a_kot : |angle (!₂[2, 1, 2] : R3) !₂[1, 4, -1] * 180 / π - 71.68| < 0.005 := by
  have h18 : √(18:ℝ) = 3 * √2 := by
    rw [show (18:ℝ) = 3 ^ 2 * 2 by norm_num, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  have n1 : ‖(!₂[2, 1, 2] : R3)‖ = 3 := by rw [dolzina3]; exact koren_kvadrata (by norm_num) (by norm_num)
  have n2 : ‖(!₂[1, 4, -1] : R3)‖ = 3 * √2 := by rw [dolzina3, ← h18]; norm_num
  have ha : angle (!₂[2, 1, 2] : R3) !₂[1, 4, -1] = Real.arccos (4 / (9 * √2)) := by
    unfold angle; rw [n1, n2, skalarni3]; congr 1; ring
  rw [ha]
  have hp1 := Real.pi_gt_d6
  have hp2 := Real.pi_lt_d6
  have h2a : (1.41421356:ℝ) < √2 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have h2b : √2 < (1.41421357:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  have h5a : (2.2360679:ℝ) < √5 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have h5b : √5 < (2.236068:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  have s5 : √5 ^ 2 = 5 := Real.sq_sqrt (by norm_num)
  have hc72 : Real.cos (2 * π / 5) = (√5 - 1) / 4 := by
    rw [show 2 * π / 5 = 2 * (π / 5) by ring, Real.cos_two_mul, Real.cos_pi_div_five]
    linear_combination (1 / 8) * s5
  have hs72p : 0 < Real.sin (2 * π / 5) := Real.sin_pos_of_pos_of_lt_pi (by positivity) (by linarith)
  have hs72sq : Real.sin (2 * π / 5) ^ 2 = (10 + 2 * √5) / 16 := by
    have := Real.sin_sq_add_cos_sq (2 * π / 5)
    rw [hc72] at this; linear_combination this - (1 / 16) * s5
  have hsa : 0.9510565 < Real.sin (2 * π / 5) := by nlinarith
  have hsb : Real.sin (2 * π / 5) < 0.9510566 := by nlinarith
  have hca : 0.30901697 < Real.cos (2 * π / 5) := by rw [hc72]; linarith
  have hcb : Real.cos (2 * π / 5) < 0.3090170 := by rw [hc72]; linarith
  have hqa : 0.3142696 < 4 / (9 * √2) := by rw [lt_div_iff₀ (by positivity)]; nlinarith
  have hqb : 4 / (9 * √2) < 0.31426969 := by rw [div_lt_iff₀ (by positivity)]; nlinarith
  set d₁ := 13 * π / 7200 with hd₁
  set d₂ := 7 * π / 4000 with hd₂
  have c1 : 4 / (9 * √2) < Real.cos (2 * π / 5 - d₁) := by
    rw [Real.cos_sub]
    have := Real.sin_gt_sub_cube (show 0 < d₁ by positivity)
    have := Real.one_sub_sq_div_two_le_cos (x := d₁)
    have : 0.0056723 < d₁ := by rw [hd₁]; linarith
    have : d₁ < 0.0056724 := by rw [hd₁]; linarith
    have hsd : 0.00567227 < Real.sin d₁ := by nlinarith
    have hcd : 0.99998391 < Real.cos d₁ := by nlinarith
    have e1 : 0.30901697 * 0.99998391 < Real.cos (2 * π / 5) * Real.cos d₁ :=
      mul_lt_mul'' hca hcd (by norm_num) (by norm_num)
    have e2 : 0.9510565 * 0.00567227 < Real.sin (2 * π / 5) * Real.sin d₁ :=
      mul_lt_mul'' hsa hsd (by norm_num) (by norm_num)
    linarith
  have c2 : Real.cos (2 * π / 5 - d₂) < 4 / (9 * √2) := by
    rw [Real.cos_sub]
    have hsd := Real.sin_le (show 0 ≤ d₂ by positivity)
    have hsd0 := Real.sin_nonneg_of_nonneg_of_le_pi (show 0 ≤ d₂ by positivity) (by linarith)
    have hcd := Real.cos_le_one d₂
    have : d₂ < 0.00549779 := by rw [hd₂]; linarith
    have e1 : Real.cos (2 * π / 5) * Real.cos d₂ ≤ 0.3090170 * 1 :=
      mul_le_mul hcb.le hcd (by linarith [Real.cos_pos_of_mem_Ioo (x := d₂) ⟨by linarith, by linarith⟩])
        (by norm_num)
    have e2 : Real.sin (2 * π / 5) * Real.sin d₂ ≤ 0.9510566 * 0.00549779 :=
      mul_le_mul hsb.le (by linarith) hsd0 (by norm_num)
    linarith
  obtain ⟨k1, k2⟩ := kot_med (by nlinarith) (by linarith) (by linarith) c1 c2
  rw [abs_lt]
  constructor
  · rw [lt_sub_iff_add_lt, lt_div_iff₀ (by positivity)]; nlinarith
  · rw [sub_lt_iff_lt_add, div_lt_iff₀ (by positivity)]; nlinarith

/-- Naloga 2 c), vmesni vrednosti: v_c = √146/3 ≈ 4,0277 in S = √146/2 ≈ 6,0415.
trditev: MAT-SS-3/skalarni-produkt#naloga2c-stiri-decimalke
besedilo: »Zato je $v_c^2 = 18 - \frac{16}{9} = \frac{146}{9}$ in $v_c = \frac{\sqrt{146}}{3} \approx 4{,}0277$,« -/
theorem naloga2c_stiri_decimalke : |√146 / 3 - 4.0277| < 0.00005 ∧ |√146 / 2 - 6.0415| < 0.00005 := by
  have a : (12.08304:ℝ) < √146 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have b : √146 < (12.08305:ℝ) := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  constructor <;> rw [abs_lt] <;> constructor <;> linarith

end Evklid.Lekcije.MAT_SS_3.SkalarniProdukt
