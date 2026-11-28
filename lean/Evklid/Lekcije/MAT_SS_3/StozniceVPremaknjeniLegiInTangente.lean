/-
vir: content/lessons/MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente.md
sha256: c39c71ad3e426d0a1ecfce31377cab51771cb18a385a25d7f6b391e66b8b34f6
Ni v Leanu: zgodovina (Apolonij, Descartes) in uvodna zgodba; risbe (dokazane so le koordinate točk na njih) in
simulacija (dokazana je vsota razdalj 2a in e = 0 pri a = b); tabela za prepoznavo stožnice po koeficientih
x² in y² (pravilo za prepoznavo, ne izrek; dokazani so posamezni primeri v Primerih, Nalogah in Preveri se);
opisno »faktor, manjši od 1, krožnico stisne«; grafično odčitavanje in »skica pove,
koliko rešitev«; »pri hiperboli in paraboli je postopek enak« (opis postopka); Preveri se 6 (vrstni red
korakov, ni matematična trditev) in razlage napačnih odgovorov razen √34 − 3 ≈ 2,83; točkovanje; »Drugače«
(analogije, vsakdanje življenje); skica pri Nalogi 2 b).
Leanovi dogovori: `asimptoti` ne potrebuje a ≠ 0 in `tangenta_hiperbole` ne a, b ≠ 0, ker je v Leanu x/0 = 0
in trditvi veljata tudi tedaj; gorišča elipse zahtevajo b ≤ a (sicer je √(a² − b²) v Leanu 0).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.StozniceVPremaknjeniLegiInTangente

/-! ## Splošna pravila -/

/-- Razlaga 1 (in Ustno vprašanje 1): točka (x, y) leži na elipsi (x − x₀)²/a² + (y − y₀)²/b² = 1 natanko
tedaj, ko je premik točke (u, v) elipse u²/a² + v²/b² = 1 za vektor (x₀, y₀).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#premik-elipse
besedilo: »Točka $(x, y)$ leži na premaknjeni elipsi natanko tedaj, ko točka $(x - x_0, y - y_0)$ leži na prvotni elipsi.« -/
theorem premik_elipse (x₀ y₀ a b x y : ℝ) :
    (x - x₀) ^ 2 / a ^ 2 + (y - y₀) ^ 2 / b ^ 2 = 1 ↔
      ∃ u v : ℝ, u ^ 2 / a ^ 2 + v ^ 2 / b ^ 2 = 1 ∧ x = u + x₀ ∧ y = v + y₀ := by
  constructor
  · intro h; exact ⟨x - x₀, y - y₀, h, by ring, by ring⟩
  · rintro ⟨u, v, h, rfl, rfl⟩; simpa using h

/-- Razlaga 3: premik deluje enako pri hiperboli (x − x₀)²/a² − (y − y₀)²/b² = 1.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#premik-hiperbole
besedilo: »Premik deluje enako: $$\frac{(x - x_0)^2}{a^2} - \frac{(y - y_0)^2}{b^2} = 1$$« -/
theorem premik_hiperbole (x₀ y₀ a b x y : ℝ) :
    (x - x₀) ^ 2 / a ^ 2 - (y - y₀) ^ 2 / b ^ 2 = 1 ↔
      ∃ u v : ℝ, u ^ 2 / a ^ 2 - v ^ 2 / b ^ 2 = 1 ∧ x = u + x₀ ∧ y = v + y₀ := by
  constructor
  · intro h; exact ⟨x - x₀, y - y₀, h, by ring, by ring⟩
  · rintro ⟨u, v, h, rfl, rfl⟩; simpa using h

/-- Razlaga 4: parabola (y − y₀)² = 2p(x − x₀) je parabola v² = 2pu, premaknjena za vektor (x₀, y₀).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#premik-parabole
besedilo: »Parabola s temenom $T(x_0, y_0)$ in osjo, vzporedno z osjo $x$, ima enačbo $$(y - y_0)^2 = 2p(x - x_0)$$« -/
theorem premik_parabole (x₀ y₀ p x y : ℝ) :
    (y - y₀) ^ 2 = 2 * p * (x - x₀) ↔ ∃ u v : ℝ, v ^ 2 = 2 * p * u ∧ x = u + x₀ ∧ y = v + y₀ := by
  constructor
  · intro h; exact ⟨x - x₀, y - y₀, h, by ring, by ring⟩
  · rintro ⟨u, v, h, rfl, rfl⟩; simpa using h

/-- Razlaga 1 in Povzetek: krožnica je poseben primer elipse z a = b = r (r ≠ 0).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#kroznica-poseben-primer
besedilo: »Krožnica je poseben primer z $a = b = r$.« -/
theorem kroznica_poseben_primer (x₀ y₀ r x y : ℝ) (hr : r ≠ 0) :
    (x - x₀) ^ 2 / r ^ 2 + (y - y₀) ^ 2 / r ^ 2 = 1 ↔ (x - x₀) ^ 2 + (y - y₀) ^ 2 = r ^ 2 := by
  rw [← add_div, div_eq_one_iff_eq (pow_ne_zero 2 hr)]

/-- Predpostavka `kroznica_poseben_primer` se da izpolniti (r = 3). -/
example : (3:ℝ) ≠ 0 := by norm_num

/-- Predpostavke trditve `kroznica_poseben_primer` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (3:ℝ) ≠ 0 := by norm_num
  kroznica_poseben_primer (hr := w)

/-- Razlaga 1 (gorišči) v središčni legi: za 0 < b ≤ a in e = √(a² − b²) leži točka (u, v) na elipsi
u²/a² + v²/b² = 1 natanko tedaj, ko je vsota razdalj do (−e, 0) in (e, 0) enaka 2a.
pomozno -/
theorem gorisci_elipse_sredisce (a b u v : ℝ) (ha : 0 < a) (hb : 0 < b) (hab : b ≤ a) :
    u ^ 2 / a ^ 2 + v ^ 2 / b ^ 2 = 1 ↔
      √((u + √(a ^ 2 - b ^ 2)) ^ 2 + v ^ 2) + √((u - √(a ^ 2 - b ^ 2)) ^ 2 + v ^ 2) = 2 * a := by
  set e := √(a ^ 2 - b ^ 2) with he
  have he0 : 0 ≤ e := Real.sqrt_nonneg _
  have he2 : e ^ 2 = a ^ 2 - b ^ 2 := Real.sq_sqrt (by nlinarith)
  have hea : e ≤ a := by nlinarith
  obtain ⟨t, ht⟩ : ∃ t, t = u / a := ⟨_, rfl⟩
  have hu : u = a * t := by rw [ht]; field_simp
  constructor
  · intro h
    have hv : v ^ 2 = b ^ 2 * (1 - t ^ 2) := by
      rw [hu] at h; field_simp at h; linear_combination h
    have ht1 : t ^ 2 ≤ 1 := by nlinarith [sq_nonneg v, pow_pos hb 2]
    have hta : |t| ≤ 1 := by rw [← sq_le_one_iff_abs_le_one]; exact ht1
    have h1 : (u + e) ^ 2 + v ^ 2 = (a + e * t) ^ 2 := by rw [hu, hv]; linear_combination (1 - t ^ 2) * he2
    have h2 : (u - e) ^ 2 + v ^ 2 = (a - e * t) ^ 2 := by rw [hu, hv]; linear_combination (1 - t ^ 2) * he2
    have het : |e * t| ≤ a := by
      rw [abs_mul, abs_of_nonneg he0]; nlinarith [abs_nonneg t]
    rw [h1, h2, Real.sqrt_sq (by linarith [neg_abs_le (e * t)]),
      Real.sqrt_sq (by linarith [le_abs_self (e * t)])]
    ring
  · intro h
    set d₁ := √((u + e) ^ 2 + v ^ 2)
    set d₂ := √((u - e) ^ 2 + v ^ 2)
    have hd₁ : d₁ ^ 2 = (u + e) ^ 2 + v ^ 2 := Real.sq_sqrt (by positivity)
    have hd₂ : d₂ ^ 2 = (u - e) ^ 2 + v ^ 2 := Real.sq_sqrt (by positivity)
    have h2 : d₂ = 2 * a - d₁ := by linarith
    have hd : a * d₁ = a * (a + e * t) := by
      rw [h2] at hd₂; rw [hu] at hd₁ hd₂; nlinarith
    have hd' : d₁ = a + e * t := mul_left_cancel₀ ha.ne' hd
    rw [hd', hu] at hd₁
    have hv : v ^ 2 = b ^ 2 * (1 - t ^ 2) := by linear_combination -hd₁ - (1 - t ^ 2) * he2
    rw [hu, hv]; field_simp; ring

/-- Razlaga 1 in Povzetek: elipsa (x − x₀)²/a² + (y − y₀)²/b² = 1 z 0 < b ≤ a ima gorišči
F₁,₂(x₀ ∓ e, y₀), e = √(a² − b²): točka leži na elipsi natanko tedaj, ko je vsota razdalj do gorišč 2a.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#gorisci-elipse
besedilo: »Oblika, polosi in ekscentričnost $e = \sqrt{a^2 - b^2}$ ostanejo enake; premakneta se le središče in gorišči. Za $a > b$ sta gorišči $F_{1,2}(x_0 \pm e, y_0)$.« -/
theorem gorisci_elipse (x₀ y₀ a b x y : ℝ) (ha : 0 < a) (hb : 0 < b) (hab : b ≤ a) :
    (x - x₀) ^ 2 / a ^ 2 + (y - y₀) ^ 2 / b ^ 2 = 1 ↔
      √((x - (x₀ - √(a ^ 2 - b ^ 2))) ^ 2 + (y - y₀) ^ 2) +
        √((x - (x₀ + √(a ^ 2 - b ^ 2))) ^ 2 + (y - y₀) ^ 2) = 2 * a := by
  rw [gorisci_elipse_sredisce a b (x - x₀) (y - y₀) ha hb hab]
  ring_nf

/-- Premisli 1 in Za maturo, Naloga 2 b): pri elipsi z daljšo navpično osjo (0 < a ≤ b) ležita gorišči
na premici x = x₀, (x₀, y₀ ∓ e) z e = √(b² − a²).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#gorisci-elipse-navpicno
besedilo: »b) Daljša polos je navpična, zato gorišči ležita na premici $x = 1$, od središča oddaljeni $e = \sqrt{b^2 - a^2} = \sqrt{25 - 9} = 4$.« -/
theorem gorisci_elipse_navpicno (x₀ y₀ a b x y : ℝ) (ha : 0 < a) (hb : 0 < b) (hab : a ≤ b) :
    (x - x₀) ^ 2 / a ^ 2 + (y - y₀) ^ 2 / b ^ 2 = 1 ↔
      √((x - x₀) ^ 2 + (y - (y₀ - √(b ^ 2 - a ^ 2))) ^ 2) +
        √((x - x₀) ^ 2 + (y - (y₀ + √(b ^ 2 - a ^ 2))) ^ 2) = 2 * b := by
  rw [add_comm ((x - x₀) ^ 2 / a ^ 2), gorisci_elipse_sredisce b a (y - y₀) (x - x₀) hb ha hab]
  ring_nf

/-- Predpostavke `gorisci_elipse_sredisce`, `gorisci_elipse` in `gorisci_elipse_navpicno` se dajo
izpolniti (a = 3, b = 2 oziroma a = 2, b = 3). -/
example : (0:ℝ) < 3 ∧ (0:ℝ) < 2 ∧ (2:ℝ) ≤ 3 := by norm_num

/-- Predpostavke trditve `gorisci_elipse_navpicno` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 3 ∧ (0:ℝ) < 2 ∧ (2:ℝ) ≤ 3 := by norm_num
  gorisci_elipse_navpicno (ha := w.2.1) (hb := w.1) (hab := w.2.2)

/-- Predpostavke trditve `gorisci_elipse` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 3 ∧ (0:ℝ) < 2 ∧ (2:ℝ) ≤ 3 := by norm_num
  gorisci_elipse (ha := w.1) (hb := w.2.1) (hab := w.2.2)

/-- Predpostavke trditve `gorisci_elipse_sredisce` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 3 ∧ (0:ℝ) < 2 ∧ (2:ℝ) ≤ 3 := by norm_num
  gorisci_elipse_sredisce (ha := w.1) (hb := w.2.1) (hab := w.2.2)

/-- Razlaga 3 in Povzetek: hiperbola (x − x₀)²/a² − (y − y₀)²/b² = 1 (a, b > 0) ima gorišči (x₀ ∓ e, y₀),
e = √(a² + b²): absolutna razlika razdalj vsake njene točke do gorišč je 2a.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#gorisci-hiperbole
besedilo: »Gorišči sta $(x_0 \pm e, y_0)$ z $e = \sqrt{a^2 + b^2}$.« -/
theorem gorisci_hiperbole (x₀ y₀ a b x y : ℝ) (ha : 0 < a) (hb : 0 < b)
    (h : (x - x₀) ^ 2 / a ^ 2 - (y - y₀) ^ 2 / b ^ 2 = 1) :
    |√((x - (x₀ - √(a ^ 2 + b ^ 2))) ^ 2 + (y - y₀) ^ 2) -
        √((x - (x₀ + √(a ^ 2 + b ^ 2))) ^ 2 + (y - y₀) ^ 2)| = 2 * a := by
  set e := √(a ^ 2 + b ^ 2) with he
  have he2 : e ^ 2 = a ^ 2 + b ^ 2 := Real.sq_sqrt (by positivity)
  have hea : a < e := by nlinarith [Real.sqrt_nonneg (a ^ 2 + b ^ 2)]
  obtain ⟨t, ht⟩ : ∃ t, t = (x - x₀) / a := ⟨_, rfl⟩
  have hu : x - x₀ = a * t := by rw [ht]; field_simp
  have hv : (y - y₀) ^ 2 = b ^ 2 * (t ^ 2 - 1) := by
    rw [hu] at h; field_simp at h; linear_combination -h
  have ht1 : 1 ≤ t ^ 2 := by nlinarith [sq_nonneg (y - y₀), pow_pos hb 2]
  have h1 : (x - (x₀ - e)) ^ 2 + (y - y₀) ^ 2 = (e * t + a) ^ 2 := by
    rw [show x - (x₀ - e) = (x - x₀) + e by ring, hu, hv]; linear_combination (1 - t ^ 2) * he2
  have h2 : (x - (x₀ + e)) ^ 2 + (y - y₀) ^ 2 = (e * t - a) ^ 2 := by
    rw [show x - (x₀ + e) = (x - x₀) - e by ring, hu, hv]; linear_combination (1 - t ^ 2) * he2
  rw [h1, h2, Real.sqrt_sq_eq_abs, Real.sqrt_sq_eq_abs]
  rcases le_or_gt 0 t with h0 | h0
  · have : 1 ≤ t := by nlinarith
    have p1 : |e * t + a| = e * t + a := abs_of_pos (by nlinarith)
    have p2 : |e * t - a| = e * t - a := abs_of_pos (by nlinarith)
    rw [p1, p2, show e * t + a - (e * t - a) = 2 * a by ring, abs_of_pos (by linarith)]
  · have : t ≤ -1 := by nlinarith
    have p1 : |e * t + a| = -(e * t + a) := abs_of_neg (by nlinarith)
    have p2 : |e * t - a| = -(e * t - a) := abs_of_neg (by nlinarith)
    rw [p1, p2, show -(e * t + a) - -(e * t - a) = -(2 * a) by ring, abs_neg, abs_of_pos (by linarith)]

/-- Predpostavke `gorisci_hiperbole` se dajo izpolniti (točka (6, −1) na hiperboli iz Razlage 3). -/
example : (0:ℝ) < 4 ∧ (0:ℝ) < 3 ∧ ((6:ℝ) - 2) ^ 2 / 4 ^ 2 - ((-1:ℝ) - (-1)) ^ 2 / 3 ^ 2 = 1 := by
  norm_num

/-- Predpostavke trditve `gorisci_hiperbole` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 4 ∧ (0:ℝ) < 3 ∧ ((6:ℝ) - 2) ^ 2 / 4 ^ 2 - ((-1:ℝ) - (-1)) ^ 2 / 3 ^ 2 = 1 := by
    norm_num
  gorisci_hiperbole (ha := w.1) (hb := w.2.1) (h := w.2.2)

/-- Razlaga 3 in Povzetek (obrat `gorisci_hiperbole`): točka z absolutno razliko razdalj 2a do gorišč
(x₀ ∓ e, y₀), e = √(a² + b²), leži na hiperboli (x − x₀)²/a² − (y − y₀)²/b² = 1 (a, b > 0); skupaj z
`gorisci_hiperbole` je hiperbola natanko množica takih točk.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#gorisci-hiperbole-iff
besedilo: »Gorišči sta $(x_0 \pm e, y_0)$ z $e = \sqrt{a^2 + b^2}$.« -/
theorem gorisci_hiperbole_iff (x₀ y₀ a b x y : ℝ) (ha : 0 < a) (hb : 0 < b) :
    (x - x₀) ^ 2 / a ^ 2 - (y - y₀) ^ 2 / b ^ 2 = 1 ↔
    |√((x - (x₀ - √(a ^ 2 + b ^ 2))) ^ 2 + (y - y₀) ^ 2) -
        √((x - (x₀ + √(a ^ 2 + b ^ 2))) ^ 2 + (y - y₀) ^ 2)| = 2 * a := by
  refine ⟨gorisci_hiperbole x₀ y₀ a b x y ha hb, fun h => ?_⟩
  set e := √(a ^ 2 + b ^ 2) with he
  have he2 : e ^ 2 = a ^ 2 + b ^ 2 := Real.sq_sqrt (by positivity)
  set r₁ := √((x - (x₀ - e)) ^ 2 + (y - y₀) ^ 2)
  set r₂ := √((x - (x₀ + e)) ^ 2 + (y - y₀) ^ 2)
  have E1 : r₁ ^ 2 = (x - x₀ + e) ^ 2 + (y - y₀) ^ 2 := by
    rw [Real.sq_sqrt (by positivity)]; ring
  have E2 : r₂ ^ 2 = (x - x₀ - e) ^ 2 + (y - y₀) ^ 2 := by
    rw [Real.sq_sqrt (by positivity)]; ring
  have hd : (r₁ - r₂) ^ 2 = 4 * a ^ 2 := by rw [← sq_abs, h]; ring
  have K : (r₁ ^ 2 + r₂ ^ 2 - 4 * a ^ 2) ^ 2 = 4 * r₁ ^ 2 * r₂ ^ 2 := by
    linear_combination (r₁ ^ 2 + r₂ ^ 2 - 4 * a ^ 2 + 2 * r₁ * r₂) * hd
  rw [E1, E2] at K
  have P : b ^ 2 * (x - x₀) ^ 2 - a ^ 2 * (y - y₀) ^ 2 = a ^ 2 * b ^ 2 := by
    linear_combination K / 16 - ((x - x₀) ^ 2 - a ^ 2) * he2
  have ha0 : a ≠ 0 := ha.ne'
  have hb0 : b ≠ 0 := hb.ne'
  field_simp; linear_combination P

/-- Predpostavke `gorisci_hiperbole_iff` se dajo izpolniti (a = 4, b = 3, točka (6, −1)). -/
example := (gorisci_hiperbole_iff 2 (-1) 4 3 6 (-1) (by norm_num) (by norm_num)).1 (by norm_num)

/-- Razlaga 4 in Povzetek: za točko parabole (y − y₀)² = 2p(x − x₀) je razdalja do gorišča
F(x₀ + p/2, y₀) enaka razdalji do vodnice x = x₀ − p/2.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#gorisce-vodnica-parabole
besedilo: »Gorišče je $F\left(x_0 + \frac{p}{2}, y_0\right)$, vodnica $x = x_0 - \frac{p}{2}$.« -/
theorem gorisce_vodnica_parabole (x₀ y₀ p x y : ℝ) (h : (y - y₀) ^ 2 = 2 * p * (x - x₀)) :
    √((x - (x₀ + p / 2)) ^ 2 + (y - y₀) ^ 2) = |x - (x₀ - p / 2)| := by
  rw [h, ← Real.sqrt_sq_eq_abs]; congr 1; ring

/-- Predpostavka `gorisce_vodnica_parabole` se da izpolniti (teme (3, 2), p = 4, točka (5, 6)). -/
example : ((6:ℝ) - 2) ^ 2 = 2 * 4 * (5 - 3) := by norm_num

/-- Predpostavke trditve `gorisce_vodnica_parabole` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ((6:ℝ) - 2) ^ 2 = 2 * 4 * (5 - 3) := by norm_num
  gorisce_vodnica_parabole (h := w)

/-- Razlaga 3 in Povzetek: asimptoti y − y₀ = ±(b/a)(x − x₀) gresta skozi središče in hiperbole ne sekata.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#asimptoti
besedilo: »Asimptoti gresta skozi središče: $y - y_0 = \pm\frac{b}{a}(x - x_0)$.« -/
theorem asimptoti (x₀ y₀ a b : ℝ) (hb : b ≠ 0) :
    (y₀ - y₀ = b / a * (x₀ - x₀) ∧ y₀ - y₀ = -(b / a) * (x₀ - x₀)) ∧
    ∀ x y, (y - y₀ = b / a * (x - x₀) ∨ y - y₀ = -(b / a) * (x - x₀)) →
      (x - x₀) ^ 2 / a ^ 2 - (y - y₀) ^ 2 / b ^ 2 ≠ 1 := by
  refine ⟨by simp, fun x y hl => ?_⟩
  rcases hl with hl | hl <;> rw [hl] <;> field_simp <;> ring_nf <;> norm_num

/-- Predpostavka `asimptoti` se da izpolniti (b = 3). -/
example : (3:ℝ) ≠ 0 := by norm_num

/-- Predpostavke trditve `asimptoti` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (3:ℝ) ≠ 0 := by norm_num
  asimptoti (hb := w)

/-- Razlaga 3: desna zgornja veja hiperbole x²/a² − y²/b² = 1 (y = (b/a)√(x² − a²), x ≥ a) leži pod
asimptoto y = (b/a)x in se ji približuje: razlika je pozitivna in največ ab/x.
pomozno -/
theorem priblizevanje_asimptoti (a b x : ℝ) (ha : 0 < a) (hb : 0 < b) (hx : a ≤ x) :
    0 < b / a * x - b / a * √(x ^ 2 - a ^ 2) ∧ b / a * x - b / a * √(x ^ 2 - a ^ 2) ≤ a * b / x := by
  have hx0 : 0 < x := by linarith
  set s := √(x ^ 2 - a ^ 2)
  have hs0 : 0 ≤ s := Real.sqrt_nonneg _
  have hs2 : s ^ 2 = x ^ 2 - a ^ 2 := Real.sq_sqrt (by nlinarith)
  have hsx : s < x := by nlinarith
  have hba : 0 < b / a := by positivity
  have hprod : (x - s) * (x + s) = a ^ 2 := by linear_combination -hs2
  refine ⟨by rw [← mul_sub]; exact mul_pos hba (by linarith), ?_⟩
  rw [← mul_sub, div_mul_eq_mul_div, div_le_div_iff₀ ha hx0]
  have : (x - s) * x ≤ a ^ 2 := by nlinarith
  nlinarith

/-- Predpostavke `priblizevanje_asimptoti` se dajo izpolniti (a = 4, b = 3, x = 6). -/
example : (0:ℝ) < 4 ∧ (0:ℝ) < 3 ∧ (4:ℝ) ≤ 6 := by norm_num

/-- Predpostavke trditve `priblizevanje_asimptoti` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 4 ∧ (0:ℝ) < 3 ∧ (4:ℝ) ≤ 6 := by norm_num
  priblizevanje_asimptoti (ha := w.1) (hb := w.2.1) (hx := w.2.2)

/-- Razlaga 3: asimptota kot limita: razlika med asimptoto y = (b/a)x in desno zgornjo vejo gre proti 0
za x → ∞ (iz ocene `priblizevanje_asimptoti` ≤ ab/x); po simetriji enako za spodnjo desno vejo in asimptoto
y = −(b/a)x ter za obe levi veji pri x → −∞ (a, b > 0).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#asimptota-limita
besedilo: »Asimptoti gresta skozi središče: $y - y_0 = \pm\frac{b}{a}(x - x_0)$.« -/
theorem asimptota_limita (a b : ℝ) (ha : 0 < a) (hb : 0 < b) :
    Filter.Tendsto (fun x => b / a * x - b / a * √(x ^ 2 - a ^ 2)) Filter.atTop (nhds 0) ∧
    Filter.Tendsto (fun x => -(b / a) * x - (-(b / a) * √(x ^ 2 - a ^ 2))) Filter.atTop (nhds 0) ∧
    Filter.Tendsto (fun x => -(b / a) * x - b / a * √(x ^ 2 - a ^ 2)) Filter.atBot (nhds 0) ∧
    Filter.Tendsto (fun x => b / a * x - (-(b / a) * √(x ^ 2 - a ^ 2))) Filter.atBot (nhds 0) := by
  have up : Filter.Tendsto (fun x : ℝ => a * b / x) Filter.atTop (nhds 0) :=
    tendsto_const_nhds.div_atTop Filter.tendsto_id
  have h : Filter.Tendsto (fun x => b / a * x - b / a * √(x ^ 2 - a ^ 2)) Filter.atTop (nhds 0) := by
    refine tendsto_of_tendsto_of_tendsto_of_le_of_le' tendsto_const_nhds up ?_ ?_
    · filter_upwards [Filter.eventually_ge_atTop a] with x hx
      exact (priblizevanje_asimptoti a b x ha hb hx).1.le
    · filter_upwards [Filter.eventually_ge_atTop a] with x hx
      exact (priblizevanje_asimptoti a b x ha hb hx).2
  have hn : Filter.Tendsto (fun x => -(b / a * x - b / a * √(x ^ 2 - a ^ 2))) Filter.atTop (nhds 0) := by
    simpa using h.neg
  have hl := h.comp Filter.tendsto_neg_atBot_atTop
  have hln := hn.comp Filter.tendsto_neg_atBot_atTop
  refine ⟨h, ?_, ?_, ?_⟩
  · refine hn.congr fun x => ?_; ring
  · refine hl.congr fun x => ?_; simp only [Function.comp, neg_sq]; ring
  · refine hln.congr fun x => ?_; simp only [Function.comp, neg_sq]; ring

/-- Predpostavke `asimptota_limita` se dajo izpolniti (a = 4, b = 3). -/
example := asimptota_limita 4 3 (by norm_num) (by norm_num)

/-- Razlaga 2 (in Ustno vprašanje 2): elipsa x²/a² + y²/b² = 1 (a, b > 0) je krožnica x² + y² = a²,
raztegnjena vzdolž osi y s faktorjem b/a: (x, y) je na elipsi natanko tedaj, ko je (x, (a/b)y) na krožnici,
oziroma ko je y = (b/a)·Y za točko (x, Y) krožnice.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#raztezek-kroznice
besedilo: »Splošno: krožnica $x^2 + y^2 = a^2$, raztegnjena vzdolž osi $y$ s faktorjem $\frac{b}{a}$, je elipsa s polosema $a$ in $b$.« -/
theorem raztezek_kroznice (a b x y : ℝ) (ha : 0 < a) (hb : 0 < b) :
    (x ^ 2 / a ^ 2 + y ^ 2 / b ^ 2 = 1 ↔ x ^ 2 + (a / b * y) ^ 2 = a ^ 2) ∧
    (x ^ 2 / a ^ 2 + y ^ 2 / b ^ 2 = 1 ↔ ∃ Y, x ^ 2 + Y ^ 2 = a ^ 2 ∧ y = b / a * Y) := by
  have key : x ^ 2 + (a / b * y) ^ 2 - a ^ 2 = a ^ 2 * (x ^ 2 / a ^ 2 + y ^ 2 / b ^ 2 - 1) := by
    field_simp
  have h1 : x ^ 2 / a ^ 2 + y ^ 2 / b ^ 2 = 1 ↔ x ^ 2 + (a / b * y) ^ 2 = a ^ 2 := by
    rw [← sub_eq_zero, ← sub_eq_zero (a := x ^ 2 + _), key, mul_eq_zero]
    simp [ha.ne']
  refine ⟨h1, ?_⟩
  rw [h1]
  constructor
  · intro h; exact ⟨a / b * y, h, by field_simp⟩
  · rintro ⟨Y, hY, rfl⟩; convert hY using 2; field_simp

/-- Razlaga 2: pri krožnici s središčem S(x₀, y₀) raztegujemo glede na premico y = y₀ in dobimo premaknjeno
elipso: (x, y) je na elipsi natanko tedaj, ko je y − y₀ = (b/a)(Y − y₀) za točko (x, Y) krožnice
(x − x₀)² + (y − y₀)² = a².
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#raztezek-premaknjene
besedilo: »Pri krožnici s središčem $S(x_0, y_0)$ raztegujemo glede na premico $y = y_0$ in dobimo premaknjeno elipso.« -/
theorem raztezek_premaknjene (x₀ y₀ a b x y : ℝ) (ha : 0 < a) (hb : 0 < b) :
    (x - x₀) ^ 2 / a ^ 2 + (y - y₀) ^ 2 / b ^ 2 = 1 ↔
      ∃ Y, (x - x₀) ^ 2 + (Y - y₀) ^ 2 = a ^ 2 ∧ y - y₀ = b / a * (Y - y₀) := by
  rw [(raztezek_kroznice a b (x - x₀) (y - y₀) ha hb).2]
  constructor
  · rintro ⟨Y, hY, h⟩; exact ⟨Y + y₀, by simpa using hY, by simpa using h⟩
  · rintro ⟨Y, hY, h⟩; exact ⟨Y - y₀, hY, h⟩

/-- Predpostavke `raztezek_kroznice` in `raztezek_premaknjene` se dajo izpolniti (a = 5, b = 3). -/
example : (0:ℝ) < 5 ∧ (0:ℝ) < 3 := by norm_num

/-! ## Tangenta v točki stožnice (Razlaga 6) -/

/-- Predpostavke trditve `raztezek_premaknjene` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 5 ∧ (0:ℝ) < 3 := by norm_num
  raztezek_premaknjene (ha := w.1) (hb := w.2)

/-- Predpostavke trditve `raztezek_kroznice` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 5 ∧ (0:ℝ) < 3 := by norm_num
  raztezek_kroznice (ha := w.1) (hb := w.2)

/-- Razlaga 6: za točko T₁(x₁, y₁) elipse je premica (x₁ − x₀)(x − x₀)/a² + (y₁ − y₀)(y − y₀)/b² = 1
tangenta: T₁ leži na njej, vzdolž nje (x = x₁ − t(y₁ − y₀)/b², y = y₁ + t(x₁ − x₀)/a²) je leva stran enačbe
elipse minus 1 enaka c·t² (dvojna ničla pri t = 0), in T₁ je njena edina skupna točka z elipso.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#tangenta-elipse
besedilo: »Za točko $T_1(x_1, y_1)$, ki **leži** na stožnici, je pravilo kratko: v vsakem kvadratu en faktor zamenjaj s koordinato točke. Pri elipsi je enačba tangente $$\frac{(x_1 - x_0)(x - x_0)}{a^2} + \frac{(y_1 - y_0)(y - y_0)}{b^2} = 1$$« -/
theorem tangenta_elipse (x₀ y₀ a b x₁ y₁ : ℝ) (ha : a ≠ 0) (hb : b ≠ 0)
    (h₁ : (x₁ - x₀) ^ 2 / a ^ 2 + (y₁ - y₀) ^ 2 / b ^ 2 = 1) :
    (x₁ - x₀) * (x₁ - x₀) / a ^ 2 + (y₁ - y₀) * (y₁ - y₀) / b ^ 2 = 1 ∧
    (∀ t : ℝ, (x₁ - x₀) * (x₁ - t * (y₁ - y₀) / b ^ 2 - x₀) / a ^ 2 +
        (y₁ - y₀) * (y₁ + t * (x₁ - x₀) / a ^ 2 - y₀) / b ^ 2 = 1 ∧
      (x₁ - t * (y₁ - y₀) / b ^ 2 - x₀) ^ 2 / a ^ 2 + (y₁ + t * (x₁ - x₀) / a ^ 2 - y₀) ^ 2 / b ^ 2 - 1 =
        t ^ 2 * (((y₁ - y₀) / b ^ 2) ^ 2 / a ^ 2 + ((x₁ - x₀) / a ^ 2) ^ 2 / b ^ 2)) ∧
    (∀ x y : ℝ, (x - x₀) ^ 2 / a ^ 2 + (y - y₀) ^ 2 / b ^ 2 = 1 →
      (x₁ - x₀) * (x - x₀) / a ^ 2 + (y₁ - y₀) * (y - y₀) / b ^ 2 = 1 → x = x₁ ∧ y = y₁) := by
  refine ⟨by linear_combination h₁, fun t => ⟨by linear_combination h₁, by linear_combination h₁⟩, fun x y h hl => ?_⟩
  have hs : (x - x₁) ^ 2 / a ^ 2 + (y - y₁) ^ 2 / b ^ 2 = 0 := by linear_combination h + h₁ - 2 * hl
  have p1 := div_nonneg (sq_nonneg (x - x₁)) (sq_nonneg a)
  have p2 := div_nonneg (sq_nonneg (y - y₁)) (sq_nonneg b)
  have e1 : (x - x₁) ^ 2 / a ^ 2 = 0 := by linarith
  have e2 : (y - y₁) ^ 2 / b ^ 2 = 0 := by linarith
  simp [ha, hb, sub_eq_zero] at e1 e2
  exact ⟨e1, e2⟩

/-- Predpostavke `tangenta_elipse` se dajo izpolniti (Primer 4: T₁(3,8; −1,4) na elipsi s S(2, −3), a = 3,
b = 2). -/
example : (3:ℝ) ≠ 0 ∧ (2:ℝ) ≠ 0 ∧ ((3.8:ℝ) - 2) ^ 2 / 3 ^ 2 + ((-1.4:ℝ) - (-3)) ^ 2 / 2 ^ 2 = 1 := by
  norm_num

/-- Predpostavke trditve `tangenta_elipse` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (3:ℝ) ≠ 0 ∧ (2:ℝ) ≠ 0 ∧ ((3.8:ℝ) - 2) ^ 2 / 3 ^ 2 + ((-1.4:ℝ) - (-3)) ^ 2 / 2 ^ 2 = 1 := by
    norm_num
  tangenta_elipse (ha := w.1) (hb := w.2.1) (h₁ := w.2.2)

/-- Razlaga 6: pri hiperboli je med ulomkoma minus: T₁ leži na premici
(x₁ − x₀)(x − x₀)/a² − (y₁ − y₀)(y − y₀)/b² = 1 in vzdolž nje (x = x₁ + t(y₁ − y₀)/b², y = y₁ + t(x₁ − x₀)/a²)
je leva stran enačbe hiperbole minus 1 enaka c·t² (dvojna ničla pri t = 0).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#tangenta-hiperbole
besedilo: »$$\frac{(x_1 - x_0)(x - x_0)}{a^2} + \frac{(y_1 - y_0)(y - y_0)}{b^2} = 1$$ pri hiperboli je med ulomkoma minus.« -/
theorem tangenta_hiperbole (x₀ y₀ a b x₁ y₁ : ℝ)
    (h₁ : (x₁ - x₀) ^ 2 / a ^ 2 - (y₁ - y₀) ^ 2 / b ^ 2 = 1) :
    (x₁ - x₀) * (x₁ - x₀) / a ^ 2 - (y₁ - y₀) * (y₁ - y₀) / b ^ 2 = 1 ∧
    ∀ t : ℝ, (x₁ - x₀) * (x₁ + t * (y₁ - y₀) / b ^ 2 - x₀) / a ^ 2 -
        (y₁ - y₀) * (y₁ + t * (x₁ - x₀) / a ^ 2 - y₀) / b ^ 2 = 1 ∧
      (x₁ + t * (y₁ - y₀) / b ^ 2 - x₀) ^ 2 / a ^ 2 - (y₁ + t * (x₁ - x₀) / a ^ 2 - y₀) ^ 2 / b ^ 2 - 1 =
        t ^ 2 * (((y₁ - y₀) / b ^ 2) ^ 2 / a ^ 2 - ((x₁ - x₀) / a ^ 2) ^ 2 / b ^ 2) :=
  ⟨by linear_combination h₁, fun t => ⟨by linear_combination h₁, by linear_combination h₁⟩⟩

/-- Razlaga 6: za a, b ≠ 0 je T₁ edina skupna točka hiperbole in njene tangente v T₁.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#tangenta-hiperbole-edina
besedilo: »$$\frac{(x_1 - x_0)(x - x_0)}{a^2} + \frac{(y_1 - y_0)(y - y_0)}{b^2} = 1$$ pri hiperboli je med ulomkoma minus.« -/
theorem tangenta_hiperbole_edina (x₀ y₀ a b x₁ y₁ : ℝ) (ha : a ≠ 0) (hb : b ≠ 0)
    (h₁ : (x₁ - x₀) ^ 2 / a ^ 2 - (y₁ - y₀) ^ 2 / b ^ 2 = 1) (x y : ℝ)
    (h : (x - x₀) ^ 2 / a ^ 2 - (y - y₀) ^ 2 / b ^ 2 = 1)
    (hl : (x₁ - x₀) * (x - x₀) / a ^ 2 - (y₁ - y₀) * (y - y₀) / b ^ 2 = 1) : x = x₁ ∧ y = y₁ := by
  set X := (x - x₁) / a
  set Y := (y - y₁) / b
  set s := (x₁ - x₀) / a
  set t := (y₁ - y₀) / b
  have H1 : s ^ 2 - t ^ 2 = 1 := by simp only [s, t, div_pow]; exact h₁
  have E1 : X ^ 2 - Y ^ 2 = 0 := by
    simp only [X, Y]; linear_combination h + h₁ - 2 * hl
  have E2 : s * X - t * Y = 0 := by
    simp only [X, Y, s, t]; linear_combination hl - h₁
  have hX : X ^ 2 = 0 := by linear_combination (s * X + t * Y) * E2 - t ^ 2 * E1 - X ^ 2 * H1
  have hY : Y ^ 2 = 0 := by linear_combination hX - E1
  have hX' : (x - x₁) / a = 0 := pow_eq_zero_iff two_ne_zero |>.1 hX
  have hY' : (y - y₁) / b = 0 := pow_eq_zero_iff two_ne_zero |>.1 hY
  rw [div_eq_zero_iff, sub_eq_zero] at hX' hY'
  exact ⟨hX'.resolve_right ha, hY'.resolve_right hb⟩

/-- Predpostavke `tangenta_hiperbole` se dajo izpolniti (Naloga 3: T₁(1, 9), S(−2, 1), a = 1, b = √8;
tu b² = 8 zapisan kot b = √8). Trditev: `tangenta_hiperbole_edina` (z x = x₁, y = y₁, ko sta h in hl enaki h₁). -/
example : (1:ℝ) ≠ 0 ∧ √(8:ℝ) ≠ 0 ∧ ((1:ℝ) - (-2)) ^ 2 / 1 ^ 2 - ((9:ℝ) - 1) ^ 2 / √8 ^ 2 = 1 := by
  refine ⟨one_ne_zero, by positivity, ?_⟩
  rw [Real.sq_sqrt (by norm_num)]; norm_num

/-- Predpostavke trditve `tangenta_hiperbole` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 ∧ √(8:ℝ) ≠ 0 ∧ ((1:ℝ) - (-2)) ^ 2 / 1 ^ 2 - ((9:ℝ) - 1) ^ 2 / √8 ^ 2 = 1 := by
    refine ⟨one_ne_zero, by positivity, ?_⟩
    rw [Real.sq_sqrt (by norm_num)]; norm_num
  tangenta_hiperbole (h₁ := w.2.2)

/-- Razlaga 6: pri paraboli (y − y₀)² = 2p(x − x₀) je tangenta v T₁ premica
(y₁ − y₀)(y − y₀) = p((x − x₀) + (x₁ − x₀)): T₁ leži na njej, vzdolž nje (x = x₁ + t(y₁ − y₀), y = y₁ + tp)
je (y − y₀)² − 2p(x − x₀) = p²t² (dvojna ničla), in za p ≠ 0 je T₁ edina skupna točka.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#tangenta-parabole
besedilo: »Pri paraboli $(y - y_0)^2 = 2p(x - x_0)$ člen $2p(x - x_0)$ razdelimo na polovici, $p(x - x_0) + p(x_1 - x_0)$, zato je enačba tangente $$(y_1 - y_0)(y - y_0) = p\big((x - x_0) + (x_1 - x_0)\big)$$« -/
theorem tangenta_parabole (x₀ y₀ p x₁ y₁ : ℝ) (h₁ : (y₁ - y₀) ^ 2 = 2 * p * (x₁ - x₀)) :
    (y₁ - y₀) * (y₁ - y₀) = p * ((x₁ - x₀) + (x₁ - x₀)) ∧
    (∀ t : ℝ, (y₁ - y₀) * (y₁ + t * p - y₀) = p * ((x₁ + t * (y₁ - y₀) - x₀) + (x₁ - x₀)) ∧
      (y₁ + t * p - y₀) ^ 2 - 2 * p * (x₁ + t * (y₁ - y₀) - x₀) = p ^ 2 * t ^ 2) ∧
    (p ≠ 0 → ∀ x y : ℝ, (y - y₀) ^ 2 = 2 * p * (x - x₀) →
      (y₁ - y₀) * (y - y₀) = p * ((x - x₀) + (x₁ - x₀)) → x = x₁ ∧ y = y₁) := by
  refine ⟨by linear_combination h₁, fun t => ⟨by linear_combination h₁, by linear_combination h₁⟩, fun hp x y h hl => ?_⟩
  have hy : (y - y₁) ^ 2 = 0 := by linear_combination h + h₁ - 2 * hl
  have hy' : y = y₁ := by simpa [sub_eq_zero] using hy
  subst hy'
  refine ⟨?_, rfl⟩
  have : 2 * p * (x - x₁) = 0 := by linear_combination h₁ - h
  simpa [hp, sub_eq_zero] using this

/-- Predpostavke `tangenta_parabole` se dajo izpolniti (Primer 2: T₁(5, 6), teme (3, 2), p = 4). -/
example : ((6:ℝ) - 2) ^ 2 = 2 * 4 * (5 - 3) ∧ (4:ℝ) ≠ 0 := by norm_num

/-- Predpostavke trditve `tangenta_parabole` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ((6:ℝ) - 2) ^ 2 = 2 * 4 * (5 - 3) ∧ (4:ℝ) ≠ 0 := by norm_num
  tangenta_parabole (h₁ := w.1)

/-- Razlaga 6: stožnice s središčem oziroma temenom v izhodišču: tangenta elipse x₁x/a² + y₁y/b² = 1,
hiperbole x₁x/a² − y₁y/b² = 1 in parabole y² = 2px premica y₁y = p(x + x₁) gredo skozi T₁, in T₁ je njihova
edina skupna točka s stožnico (pri paraboli za p ≠ 0).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#tangente-v-izhodiscu
besedilo: »Pri stožnici s središčem oziroma temenom v izhodišču se pravilo skrči: tangenta elipse je $\frac{x_1 x}{a^2} + \frac{y_1 y}{b^2} = 1$, hiperbole $\frac{x_1 x}{a^2} - \frac{y_1 y}{b^2} = 1$, parabole $y^2 = 2px$ pa $y_1 y = p(x + x_1)$.« -/
theorem tangente_v_izhodiscu (a b p x₁ y₁ : ℝ) (ha : a ≠ 0) (hb : b ≠ 0) :
    (x₁ ^ 2 / a ^ 2 + y₁ ^ 2 / b ^ 2 = 1 → x₁ * x₁ / a ^ 2 + y₁ * y₁ / b ^ 2 = 1 ∧
      ∀ x y, x ^ 2 / a ^ 2 + y ^ 2 / b ^ 2 = 1 → x₁ * x / a ^ 2 + y₁ * y / b ^ 2 = 1 → x = x₁ ∧ y = y₁) ∧
    (x₁ ^ 2 / a ^ 2 - y₁ ^ 2 / b ^ 2 = 1 → x₁ * x₁ / a ^ 2 - y₁ * y₁ / b ^ 2 = 1 ∧
      ∀ x y, x ^ 2 / a ^ 2 - y ^ 2 / b ^ 2 = 1 → x₁ * x / a ^ 2 - y₁ * y / b ^ 2 = 1 → x = x₁ ∧ y = y₁) ∧
    (y₁ ^ 2 = 2 * p * x₁ → y₁ * y₁ = p * (x₁ + x₁) ∧
      (p ≠ 0 → ∀ x y, y ^ 2 = 2 * p * x → y₁ * y = p * (x + x₁) → x = x₁ ∧ y = y₁)) := by
  refine ⟨fun h => ?_, fun h => ⟨by linear_combination h, fun x y hh hl => ?_⟩,
    fun h => ⟨by linear_combination h, fun hp x y hh hl => ?_⟩⟩
  · have := tangenta_elipse 0 0 a b x₁ y₁ ha hb (by simpa using h)
    simp only [sub_zero] at this
    exact ⟨this.1, this.2.2⟩
  · exact tangenta_hiperbole_edina 0 0 a b x₁ y₁ ha hb (by simpa using h) x y (by simpa using hh)
      (by simpa using hl)
  · have := (tangenta_parabole 0 0 p x₁ y₁ (by simpa using h)).2.2 hp x y (by simpa using hh)
      (by simp only [sub_zero]; linear_combination hl)
    exact this

/-- Predpostavke `tangente_v_izhodiscu` se dajo izpolniti (a = 5, b = 3, T₁(5, 0); p = 2, T₁(1, 2)). -/
example : (5:ℝ) ≠ 0 ∧ (3:ℝ) ≠ 0 ∧ (5:ℝ) ^ 2 / 5 ^ 2 + (0:ℝ) ^ 2 / 3 ^ 2 = 1 ∧
    (2:ℝ) ^ 2 = 2 * 2 * 1 := by norm_num

/-! ## Lega premice in diskriminanta (Razlaga 5 in 7) -/

/-- Predpostavke trditve `tangente_v_izhodiscu` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (5:ℝ) ≠ 0 ∧ (3:ℝ) ≠ 0 ∧ (5:ℝ) ^ 2 / 5 ^ 2 + (0:ℝ) ^ 2 / 3 ^ 2 = 1 ∧ (2:ℝ) ^ 2 = 2 * 2 * 1 := by norm_num
  tangente_v_izhodiscu (ha := w.1) (hb := w.2.1)

/-- Razlaga 7: kvadratna enačba Ax² + Bx + C = 0 (A ≠ 0) z D = B² − 4AC: pri D < 0 nima rešitve
(mimobežnica), pri D = 0 ima eno samo (dvojno) rešitev −B/(2A) (tangenta), pri D > 0 dve različni (sekanta).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#lega-po-diskriminanti
besedilo: »Diskriminanta pove lego: $D > 0$ sekanta, $D = 0$ tangenta, $D < 0$ mimobežnica.« -/
theorem lega_po_diskriminanti (A B C : ℝ) (hA : A ≠ 0) :
    (B ^ 2 - 4 * A * C < 0 → ∀ x, A * (x * x) + B * x + C ≠ 0) ∧
    (B ^ 2 - 4 * A * C = 0 → ∀ x, A * (x * x) + B * x + C = 0 ↔ x = -B / (2 * A)) ∧
    (0 < B ^ 2 - 4 * A * C → ∃ x₁ x₂, x₁ ≠ x₂ ∧ ∀ x, A * (x * x) + B * x + C = 0 ↔ x = x₁ ∨ x = x₂) := by
  refine ⟨fun hD x => quadratic_ne_zero_of_discrim_ne_sq (fun s hs => ?_) x,
    fun hD x => quadratic_eq_zero_iff_of_discrim_eq_zero hA hD x, fun hD => ?_⟩
  · unfold discrim at hs; nlinarith [sq_nonneg s]
  · set s := √(B ^ 2 - 4 * A * C)
    have hs : discrim A B C = s * s := by rw [discrim, Real.mul_self_sqrt hD.le]
    have hs0 : 0 < s := Real.sqrt_pos.2 hD
    refine ⟨(-B + s) / (2 * A), (-B - s) / (2 * A), fun h => ?_, quadratic_eq_zero_iff hA hs⟩
    field_simp at h; linarith

/-- Predpostavka `lega_po_diskriminanti` se da izpolniti (A = 1). -/
example : (1:ℝ) ≠ 0 := one_ne_zero

/-- Predpostavke trditve `lega_po_diskriminanti` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 := one_ne_zero
  lega_po_diskriminanti (hA := w)

/-- Razlaga 7: premica y = kx + n ima z elipso x²/a² + y²/b² = 1 natanko eno skupno točko (kvadratna enačba
za x ima dvojno rešitev, D = 0) natanko tedaj, ko je a²k² + b² = n².
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#pogoj-tangentnosti-elipse
besedilo: »Za stožnice s središčem oziroma temenom v izhodišču ta račun da pogoj tangentnosti: pri elipsi $a^2k^2 + b^2 = n^2$« -/
theorem pogoj_tangentnosti_elipse (a b k n : ℝ) (ha : a ≠ 0) (hb : b ≠ 0) :
    (∃! x : ℝ, x ^ 2 / a ^ 2 + (k * x + n) ^ 2 / b ^ 2 = 1) ↔ a ^ 2 * k ^ 2 + b ^ 2 = n ^ 2 := by
  have hA : b ^ 2 + a ^ 2 * k ^ 2 ≠ 0 := by positivity
  have key : ∀ x : ℝ, x ^ 2 / a ^ 2 + (k * x + n) ^ 2 / b ^ 2 = 1 ↔
      (b ^ 2 + a ^ 2 * k ^ 2) * (x * x) + (2 * a ^ 2 * k * n) * x + (a ^ 2 * n ^ 2 - a ^ 2 * b ^ 2) = 0 := by
    intro x
    rw [div_add_div _ _ (by positivity) (by positivity), div_eq_one_iff_eq (by positivity)]
    constructor <;> intro h <;> linear_combination h
  rw [existsUnique_congr key, ← discrim_eq_zero_iff hA, discrim]
  constructor
  · intro h
    have : 4 * a ^ 2 * b ^ 2 * (a ^ 2 * k ^ 2 + b ^ 2 - n ^ 2) = 0 := by linear_combination h
    have h4 : 4 * a ^ 2 * b ^ 2 ≠ 0 := by positivity
    linear_combination (mul_eq_zero.1 this).resolve_left h4
  · intro h; linear_combination (4 * a ^ 2 * b ^ 2) * h

/-- Razlaga 7: pri hiperboli x²/a² − y²/b² = 1 in premici y = kx + n, ki ni vzporedna asimptoti
(a²k² ≠ b², da je enačba kvadratna), ima kvadratna enačba dvojno rešitev natanko tedaj, ko je
a²k² − b² = n².
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#pogoj-tangentnosti-hiperbole
besedilo: »pri hiperboli $a^2k^2 - b^2 = n^2$ (za premice, ki niso vzporedne asimptoti, torej $a^2k^2 \ne b^2$; sicer pogoj da $n = 0$, to je asimptoto, ki ni tangenta)« -/
theorem pogoj_tangentnosti_hiperbole (a b k n : ℝ) (ha : a ≠ 0) (hb : b ≠ 0) (hk : a ^ 2 * k ^ 2 ≠ b ^ 2) :
    (∃! x : ℝ, x ^ 2 / a ^ 2 - (k * x + n) ^ 2 / b ^ 2 = 1) ↔ a ^ 2 * k ^ 2 - b ^ 2 = n ^ 2 := by
  have hA : b ^ 2 - a ^ 2 * k ^ 2 ≠ 0 := fun h => hk (by linarith)
  have key : ∀ x : ℝ, x ^ 2 / a ^ 2 - (k * x + n) ^ 2 / b ^ 2 = 1 ↔
      (b ^ 2 - a ^ 2 * k ^ 2) * (x * x) + (-2 * a ^ 2 * k * n) * x + (-a ^ 2 * n ^ 2 - a ^ 2 * b ^ 2) = 0 := by
    intro x
    rw [div_sub_div _ _ (by positivity) (by positivity), div_eq_one_iff_eq (by positivity)]
    constructor <;> intro h <;> linear_combination h
  rw [existsUnique_congr key, ← discrim_eq_zero_iff hA, discrim]
  constructor
  · intro h
    have : 4 * a ^ 2 * b ^ 2 * (a ^ 2 * k ^ 2 - b ^ 2 - n ^ 2) = 0 := by linear_combination -h
    have h4 : 4 * a ^ 2 * b ^ 2 ≠ 0 := by positivity
    linear_combination (mul_eq_zero.1 this).resolve_left h4
  · intro h; linear_combination (-4 * a ^ 2 * b ^ 2) * h

/-- Predpostavke `pogoj_tangentnosti_elipse` in `pogoj_tangentnosti_hiperbole` se dajo izpolniti
(a = 1, b = √8, k = 3: 1·9 ≠ 8). -/
example : (1:ℝ) ≠ 0 ∧ √(8:ℝ) ≠ 0 ∧ (1:ℝ) ^ 2 * 3 ^ 2 ≠ √8 ^ 2 := by
  refine ⟨one_ne_zero, by positivity, ?_⟩
  rw [Real.sq_sqrt (by norm_num)]; norm_num

/-- Predpostavke trditve `pogoj_tangentnosti_hiperbole` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 ∧ √(8:ℝ) ≠ 0 ∧ (1:ℝ) ^ 2 * 3 ^ 2 ≠ √8 ^ 2 := by
    refine ⟨one_ne_zero, by positivity, ?_⟩
    rw [Real.sq_sqrt (by norm_num)]; norm_num
  pogoj_tangentnosti_hiperbole (ha := w.1) (hb := w.2.1) (hk := w.2.2)

/-- Predpostavke trditve `pogoj_tangentnosti_elipse` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 ∧ √(8:ℝ) ≠ 0 ∧ (1:ℝ) ^ 2 * 3 ^ 2 ≠ √8 ^ 2 := by
    refine ⟨one_ne_zero, by positivity, ?_⟩
    rw [Real.sq_sqrt (by norm_num)]; norm_num
  pogoj_tangentnosti_elipse (ha := w.1) (hb := w.2.1)

/-- Razlaga 7: pri paraboli y² = 2px (p ≠ 0) in premici y = kx + n, ki ni vzporedna osi (k ≠ 0), ima
kvadratna enačba dvojno rešitev natanko tedaj, ko je p = 2kn.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#pogoj-tangentnosti-parabole
besedilo: »pri paraboli $y^2 = 2px$ pogoj $p = 2kn$.« -/
theorem pogoj_tangentnosti_parabole (p k n : ℝ) (hp : p ≠ 0) (hk : k ≠ 0) :
    (∃! x : ℝ, (k * x + n) ^ 2 = 2 * p * x) ↔ p = 2 * k * n := by
  have hA : k ^ 2 ≠ 0 := by positivity
  have key : ∀ x : ℝ, (k * x + n) ^ 2 = 2 * p * x ↔
      k ^ 2 * (x * x) + (2 * k * n - 2 * p) * x + n ^ 2 = 0 := by
    intro x; constructor <;> intro h <;> linear_combination h
  rw [existsUnique_congr key, ← discrim_eq_zero_iff hA, discrim]
  constructor
  · intro h
    have : 4 * p * (p - 2 * k * n) = 0 := by linear_combination h
    have h4 : 4 * p ≠ 0 := by positivity
    linear_combination (mul_eq_zero.1 this).resolve_left h4
  · intro h; linear_combination (4 * p) * h

/-- Predpostavke `pogoj_tangentnosti_parabole` se dajo izpolniti (p = 2, k = 1). -/
example : (2:ℝ) ≠ 0 ∧ (1:ℝ) ≠ 0 := by norm_num

/-- Predpostavke trditve `pogoj_tangentnosti_parabole` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2:ℝ) ≠ 0 ∧ (1:ℝ) ≠ 0 := by norm_num
  pogoj_tangentnosti_parabole (hp := w.1) (hk := w.2)

/-- Razlaga 5 in 7, Premisli 2, Ustno vprašanje 3: premica y = (b/a)x + n (n ≠ 0), vzporedna asimptoti
hiperbole x²/a² − y²/b² = 1, da linearno enačbo (člena z x² se odštejeta) in ima s hiperbolo natanko eno
skupno točko; leva stran enačbe hiperbole minus 1 vzdolž nje spremeni predznak (premica seka, ne dotika).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#vzporednica-asimptoti
besedilo: »Ko jo vstaviš, se člena z $x^2$ odštejeta in ostane linearna enačba. Diskriminante sploh ni, ena rešitev pomeni presečišče, ne dotika: premica gre z ene strani veje na drugo.« -/
theorem vzporednica_asimptoti (a b n : ℝ) (ha : 0 < a) (hb : 0 < b) (hn : n ≠ 0) :
    (∀ x : ℝ, x ^ 2 / a ^ 2 - (b / a * x + n) ^ 2 / b ^ 2 = -2 * n * x / (a * b) - n ^ 2 / b ^ 2) ∧
    (∃! x : ℝ, x ^ 2 / a ^ 2 - (b / a * x + n) ^ 2 / b ^ 2 = 1) ∧
    (∃ x₁ x₂ : ℝ, x₁ ^ 2 / a ^ 2 - (b / a * x₁ + n) ^ 2 / b ^ 2 - 1 < 0 ∧
      0 < x₂ ^ 2 / a ^ 2 - (b / a * x₂ + n) ^ 2 / b ^ 2 - 1) := by
  have hl : ∀ x : ℝ, x ^ 2 / a ^ 2 - (b / a * x + n) ^ 2 / b ^ 2 = -2 * n * x / (a * b) - n ^ 2 / b ^ 2 := by
    intro x; field_simp; ring
  refine ⟨hl, ?_, ?_⟩
  · refine ⟨-(a * b) * (1 + n ^ 2 / b ^ 2) / (2 * n), ?_, fun x hx => ?_⟩
    · simp only; rw [hl]; field_simp; ring
    · beta_reduce at hx; rw [hl] at hx; field_simp at hx ⊢; linear_combination -hx
  · -- vrednosti v x = ∓(ab)(1 + n²/b²)/(2n) ± ab/n: razlika od 1 je ±2
    refine ⟨-(a * b) * (1 + n ^ 2 / b ^ 2) / (2 * n) + a * b / n,
      -(a * b) * (1 + n ^ 2 / b ^ 2) / (2 * n) - a * b / n, ?_, ?_⟩
    · rw [hl]; field_simp; ring_nf; norm_num; positivity
    · rw [hl]; field_simp; ring_nf; norm_num; positivity

/-- Ustno vprašanje 3 (RACUN): za y = (b/a)x + 1 je x²/a² − y²/b² = −2x/(ab) − 1/b²; asimptota (n = 0)
hiperbole ne seka.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#vzporednica-primer
besedilo: »Primer je premica $y = \frac{b}{a}x + 1$, ki je vzporedna asimptoti hiperbole $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$. Ko jo vstavimo v enačbo hiperbole, se člena z $x^2$ odštejeta in ostane linearna enačba z eno samo rešitvijo.« -/
theorem vzporednica_primer (a b : ℝ) (ha : 0 < a) (hb : 0 < b) :
    (∀ x : ℝ, x ^ 2 / a ^ 2 - (b / a * x + 1) ^ 2 / b ^ 2 = -2 * x / (a * b) - 1 / b ^ 2) ∧
    ∀ x : ℝ, x ^ 2 / a ^ 2 - (b / a * x) ^ 2 / b ^ 2 ≠ 1 := by
  refine ⟨fun x => by simpa using (vzporednica_asimptoti a b 1 ha hb one_ne_zero).1 x, fun x => ?_⟩
  field_simp; ring_nf; norm_num

/-- Predpostavke `vzporednica_asimptoti` in `vzporednica_primer` se dajo izpolniti (a = 4, b = 3, n = 1). -/
example : (0:ℝ) < 4 ∧ (0:ℝ) < 3 ∧ (1:ℝ) ≠ 0 := by norm_num

/-- Predpostavke trditve `vzporednica_primer` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 4 ∧ (0:ℝ) < 3 ∧ (1:ℝ) ≠ 0 := by norm_num
  vzporednica_primer (ha := w.1) (hb := w.2.1)

/-- Predpostavke trditve `vzporednica_asimptoti` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 4 ∧ (0:ℝ) < 3 ∧ (1:ℝ) ≠ 0 := by norm_num
  vzporednica_asimptoti (ha := w.1) (hb := w.2.1) (hn := w.2.2)

/-- Razlaga 5: premica y = c, vzporedna osi parabole (y − y₀)² = 2p(x − x₀) (p ≠ 0), da linearno enačbo in
eno samo presečišče.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#vzporednica-osi
besedilo: »Le pri premici, vzporedni z asimptoto hiperbole (a ne asimptoti sami, ki hiperbole sploh ne seka) ali z osjo parabole, je enačba linearna in da eno samo presečišče.« -/
theorem vzporednica_osi (x₀ y₀ p c : ℝ) (hp : p ≠ 0) : ∃! x : ℝ, (c - y₀) ^ 2 = 2 * p * (x - x₀) :=
  ⟨x₀ + (c - y₀) ^ 2 / (2 * p), by field_simp; ring, fun x hx => by field_simp; linear_combination -hx⟩

/-- Predpostavka `vzporednica_osi` se da izpolniti (p = 4). -/
example : (4:ℝ) ≠ 0 := by norm_num

/-- Predpostavke trditve `vzporednica_osi` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (4:ℝ) ≠ 0 := by norm_num
  vzporednica_osi (hp := w)

/-- Pomožna trditev: x² + Bx + C = 0 z B = −(r + s), C = rs ima natanko rešitvi r in s.
pomozno -/
private theorem kvadratna (x r s B C : ℝ) (hB : B = -(r + s)) (hC : C = r * s) :
    x ^ 2 + B * x + C = 0 ↔ x = r ∨ x = s := by
  subst hB hC
  constructor
  · intro h
    have : (x - r) * (x - s) = 0 := by linear_combination h
    rcases mul_eq_zero.1 this with h | h
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> ring

/-- Predpostavki pomožne trditve `kvadratna` se dajo izpolniti (r = 6, s = −8: B = 2, C = −48). -/
example : (2:ℝ) = -(6 + -8) ∧ (-48:ℝ) = 6 * -8 := by norm_num

/-! ## Razlaga 1 in 2: številski podatki -/

/-- Razlaga 1, tabela: premik za vektor (2, −3) preslika temena (3, 0), (−3, 0), (0, 2), (0, −2) in središče
(0, 0) v (5, −3), (−1, −3), (2, −1), (2, −5) in (2, −3); vsa štiri nova temena ležijo na polni elipsi
(x − 2)²/9 + (y + 3)²/4 = 1.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#premik-tabela
besedilo: »| $(3, 0)$ | $(5, -3)$ | | $(-3, 0)$ | $(-1, -3)$ | | $(0, 2)$ | $(2, -1)$ | | $(0, -2)$ | $(2, -5)$ | | središče $(0, 0)$ | središče $(2, -3)$ |« -/
theorem premik_tabela :
    ((3:ℝ) + 2, (0:ℝ) - 3) = (5, -3) ∧ ((-3:ℝ) + 2, (0:ℝ) - 3) = (-1, -3) ∧
    ((0:ℝ) + 2, (2:ℝ) - 3) = (2, -1) ∧ ((0:ℝ) + 2, (-2:ℝ) - 3) = (2, -5) ∧
    ((0:ℝ) + 2, (0:ℝ) - 3) = (2, -3) ∧
    ((5:ℝ) - 2) ^ 2 / 9 + ((-3:ℝ) + 3) ^ 2 / 4 = 1 ∧ ((-1:ℝ) - 2) ^ 2 / 9 + ((-3:ℝ) + 3) ^ 2 / 4 = 1 ∧
    ((2:ℝ) - 2) ^ 2 / 9 + ((-1:ℝ) + 3) ^ 2 / 4 = 1 ∧ ((2:ℝ) - 2) ^ 2 / 9 + ((-5:ℝ) + 3) ^ 2 / 4 = 1 := by
  norm_num

/-- Razlaga 1: (x, y) leži na polni elipsi (x − 2)²/9 + (y + 3)²/4 = 1 natanko tedaj, ko točka
(x − 2, y + 3) leži na črtkani elipsi x²/9 + y²/4 = 1.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#polna-elipsa
besedilo: »točka $(x, y)$ leži na polni elipsi, če točka $(x - 2, y + 3)$, torej $2$ v levo in $3$ navzgor, leži na črtkani. Zato v enačbo črtkane namesto $x$ vstavimo $x - 2$ in namesto $y$ vstavimo $y + 3$: dobimo $\frac{(x - 2)^2}{9} + \frac{(y + 3)^2}{4} = 1$.« -/
theorem polna_elipsa (x y : ℝ) :
    (x - 2) ^ 2 / 9 + (y + 3) ^ 2 / 4 = 1 ↔
      ∃ u v : ℝ, u ^ 2 / 9 + v ^ 2 / 4 = 1 ∧ x = u + 2 ∧ y = v - 3 := by
  constructor
  · intro h; exact ⟨x - 2, y + 3, h, by ring, by ring⟩
  · rintro ⟨u, v, h, rfl, rfl⟩; ring_nf; ring_nf at h; exact h

/-- Razlaga 1, simulacija: pri a = 3, b = 2 je vsota razdalj do gorišč (∓√5, 0) enaka 2a = 6; pri b = 3 je
e = √(9 − 9) = 0, gorišči se združita v središču (krožnica).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#simulacija
besedilo: »Opazuj, da vsota razdalj do gorišč ostane $2a = 6$. Nato nastavi b = 3: gorišči se združita v središču in dobiš krožnico.« -/
theorem simulacija (x y : ℝ) :
    (x ^ 2 / 9 + y ^ 2 / 4 = 1 ↔ √((x + √5) ^ 2 + y ^ 2) + √((x - √5) ^ 2 + y ^ 2) = 6) ∧
    √((3:ℝ) ^ 2 - 3 ^ 2) = 0 := by
  refine ⟨?_, by norm_num⟩
  have h := gorisci_elipse_sredisce 3 2 x y (by norm_num) (by norm_num) (by norm_num)
  norm_num at h ⊢; exact h

/-- Premisli 1: elipsa (x + 1)²/4 + (y − 5)²/25 = 1 ima središče S(−1, 5) (x + 1 = x − (−1)), daljšo os
navpično, gorišči (−1, 5 ∓ √21) na premici x = −1, √(25 − 4) = √21.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#premisli-navpicna
besedilo: »Središče je $S(-1, 5)$, ker $x + 1 = x - (-1)$. Večji imenovalec $25$ stoji pod $y$, zato je daljša os navpična. Gorišči ležita na premici $x = -1$, oddaljeni $\sqrt{25 - 4} = \sqrt{21}$ od središča.« -/
theorem premisli_navpicna (x y : ℝ) :
    x + 1 = x - (-1) ∧ √((25:ℝ) - 4) = √21 ∧
    ((x + 1) ^ 2 / 4 + (y - 5) ^ 2 / 25 = 1 ↔
      √((x - (-1)) ^ 2 + (y - (5 - √21)) ^ 2) + √((x - (-1)) ^ 2 + (y - (5 + √21)) ^ 2) = 2 * 5) := by
  refine ⟨by ring, by norm_num, ?_⟩
  have h := gorisci_elipse_navpicno (-1) 5 2 5 x y (by norm_num) (by norm_num) (by norm_num)
  norm_num at h ⊢; exact h

/-- Razlaga 2, tabela: raztezek s faktorjem 3/5 vzdolž osi y preslika (0, 5), (3, 4), (−4, 3), (5, 0) v
(0, 3), (3; 2,4), (−4; 1,8), (5, 0); vse točke krožnice x² + y² = 25 gredo na elipso x²/25 + y²/9 = 1.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#raztezek-tabela
besedilo: »| $(0, 5)$ | $(0, 3)$ | | $(3, 4)$ | $(3; 2{,}4)$ | | $(-4, 3)$ | $(-4; 1{,}8)$ | | $(5, 0)$ | $(5, 0)$ |« -/
theorem raztezek_tabela :
    (3 / 5 * (5:ℝ) = 3 ∧ 3 / 5 * (4:ℝ) = 2.4 ∧ 3 / 5 * (3:ℝ) = 1.8 ∧ 3 / 5 * (0:ℝ) = 0) ∧
    ((0:ℝ) ^ 2 + 5 ^ 2 = 25 ∧ (3:ℝ) ^ 2 + 4 ^ 2 = 25 ∧ (-4:ℝ) ^ 2 + 3 ^ 2 = 25 ∧ (5:ℝ) ^ 2 + 0 ^ 2 = 25) ∧
    ((0:ℝ) ^ 2 / 25 + 3 ^ 2 / 9 = 1 ∧ (3:ℝ) ^ 2 / 25 + 2.4 ^ 2 / 9 = 1 ∧
      (-4:ℝ) ^ 2 / 25 + 1.8 ^ 2 / 9 = 1 ∧ (5:ℝ) ^ 2 / 25 + 0 ^ 2 / 9 = 1) := by
  norm_num

/-- Razlaga 2: točka (x, y) elipse je nastala iz točke (x, (5/3)y) krožnice: x² + ((5/3)y)² = 25, po deljenju
s 25 je to x²/25 + y²/9 = 1.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#raztezek-primer
besedilo: »Ta zadošča enačbi krožnice: $x^2 + \left(\frac53 y\right)^2 = 25$. Delimo s $25$ in dobimo $\frac{x^2}{25} + \frac{y^2}{9} = 1$.« -/
theorem raztezek_primer (x y : ℝ) : x ^ 2 + (5 / 3 * y) ^ 2 = 25 ↔ x ^ 2 / 25 + y ^ 2 / 9 = 1 :=
  ⟨fun h => by linear_combination h / 25, fun h => by linear_combination 25 * h⟩

/-! ## Razlaga 3 in 4: hiperbola in parabola -/

/-- Razlaga 3, primer: 9x² − 16y² − 36x − 32y − 124 = 0 po korakih dopolnjevanja do popolnih kvadratov
postane (x − 2)²/16 − (y + 1)²/9 = 1.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#hiperbola-primer
besedilo: »Iz $9(x^2 - 4x) - 16(y^2 + 2y) = 124$ dobimo $9(x - 2)^2 - 36 - 16(y + 1)^2 + 16 = 124$ oziroma $9(x - 2)^2 - 16(y + 1)^2 = 144$. Po deljenju s $144$ je to $\frac{(x - 2)^2}{16} - \frac{(y + 1)^2}{9} = 1$« -/
theorem hiperbola_primer (x y : ℝ) :
    9 * x ^ 2 - 16 * y ^ 2 - 36 * x - 32 * y - 124 = 0 ↔ (x - 2) ^ 2 / 16 - (y + 1) ^ 2 / 9 = 1 :=
  calc 9 * x ^ 2 - 16 * y ^ 2 - 36 * x - 32 * y - 124 = 0
      ↔ 9 * (x ^ 2 - 4 * x) - 16 * (y ^ 2 + 2 * y) = 124 :=
        ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
    _ ↔ 9 * (x - 2) ^ 2 - 36 - 16 * (y + 1) ^ 2 + 16 = 124 :=
        ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
    _ ↔ 9 * (x - 2) ^ 2 - 16 * (y + 1) ^ 2 = 144 :=
        ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
    _ ↔ (x - 2) ^ 2 / 16 - (y + 1) ^ 2 / 9 = 1 :=
        ⟨fun h => by linear_combination h / 144, fun h => by linear_combination 144 * h⟩

/-- Razlaga 3, primer in slika: S(2, −1), a = 4, b = 3, e = √(16 + 9) = 5; temeni (−2, −1), (6, −1) ležita na
hiperboli, gorišči sta (2 ∓ 5, −1) = (−3, −1), (7, −1); asimptoti y + 1 = ±(3/4)(x − 2) (smerna koeficienta ±3/4) hiperbole ne sekata.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#hiperbola-primer-podatki
besedilo: »Po deljenju s $144$ je to $\frac{(x - 2)^2}{16} - \frac{(y + 1)^2}{9} = 1$: središče $S(2, -1)$, $a = 4$, $b = 3$, $e = 5$.« -/
theorem hiperbola_primer_podatki :
    √((4:ℝ) ^ 2 + 3 ^ 2) = 5 ∧ ((-2:ℝ) - 2) ^ 2 / 16 - ((-1:ℝ) + 1) ^ 2 / 9 = 1 ∧
    ((6:ℝ) - 2) ^ 2 / 16 - ((-1:ℝ) + 1) ^ 2 / 9 = 1 ∧ (2:ℝ) - 5 = -3 ∧ (2:ℝ) + 5 = 7 ∧
    ∀ x y : ℝ, (y - (-1) = 3 / 4 * (x - 2) ∨ y - (-1) = -(3 / 4) * (x - 2)) →
      (x - 2) ^ 2 / 4 ^ 2 - (y - (-1)) ^ 2 / 3 ^ 2 ≠ 1 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, (asimptoti 2 (-1) 4 3 (by norm_num)).2⟩
  rw [show (4:ℝ) ^ 2 + 3 ^ 2 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Razlaga 4: graf kvadratne funkcije y = x² − 4x + 7 je parabola (x − 2)² = y − 3 s temenom (2, 3).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#kvadratna-funkcija
besedilo: »To je graf kvadratne funkcije: iz $y = x^2 - 4x + 7$ dobiš $(x - 2)^2 = y - 3$, teme $(2, 3)$.« -/
theorem kvadratna_funkcija (x y : ℝ) : y = x ^ 2 - 4 * x + 7 ↔ (x - 2) ^ 2 = y - 3 :=
  ⟨fun h => by linear_combination -h, fun h => by linear_combination -h⟩

/-! ## Razlaga 5: presečišča elipse in premice -/

/-- Razlaga 5, primer: elipsa x²/100 + y²/25 = 1 in premica y = x/2 + 1 se sekata natanko v P₁(6, 4) in
P₂(−8, −3); vmesni koraki: x² + 4y² = 100, x² + 4(x²/4 + x + 1) = 100, 2x² + 4x − 96 = 0,
x² + 2x − 48 = 0, D = 4 + 192 = 196 = 14², x = (−2 ± 14)/2.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#presecisci-primer
besedilo: »Presečišči sta $P_1(6, 4)$ in $P_2(-8, -3)$.« -/
theorem presecisci_primer (x y : ℝ) :
    (x ^ 2 / 100 + y ^ 2 / 25 = 1 ∧ y = 1 / 2 * x + 1) ↔ (x = 6 ∧ y = 4) ∨ (x = -8 ∧ y = -3) := by
  have hx : x ^ 2 + 4 * (1 / 2 * x + 1) ^ 2 = 100 ↔ x = 6 ∨ x = -8 :=
    calc x ^ 2 + 4 * (1 / 2 * x + 1) ^ 2 = 100
        ↔ x ^ 2 + 4 * (1 / 4 * x ^ 2 + x + 1) = 100 :=
          ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
      _ ↔ 2 * x ^ 2 + 4 * x - 96 = 0 := ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
      _ ↔ x ^ 2 + 2 * x - 48 = 0 := ⟨fun h => by linear_combination h / 2, fun h => by linear_combination 2 * h⟩
      _ ↔ x = (-2 + 14) / 2 ∨ x = (-2 - 14) / 2 := by
          rw [show x ^ 2 + 2 * x - 48 = x ^ 2 + 2 * x + (-48) by ring]
          exact kvadratna x _ _ _ _ (by norm_num) (by norm_num)
      _ ↔ x = 6 ∨ x = -8 := by norm_num
  constructor
  · rintro ⟨h, rfl⟩
    rcases hx.1 (by linear_combination 100 * h) with rfl | rfl
    · left; norm_num
    · right; norm_num
  · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩) <;> norm_num

/-- Razlaga 5: diskriminanta 2² + 4·48 = 196 = 14²; preizkus 36/100 + 16/25 = 0,36 + 0,64 = 1 in
(−8)²/100 + (−3)²/25 = 1.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#presecisci-preizkus
besedilo: »Diskriminanta je $4 + 192 = 196 = 14^2$, zato $x = \frac{-2 \pm 14}{2}$: $x = 6$ ali $x = -8$. Ordinati dobimo iz enačbe premice, $y = 4$ in $y = -3$. Presečišči sta $P_1(6, 4)$ in $P_2(-8, -3)$. Preizkus za $P_1$: $\frac{36}{100} + \frac{16}{25} = 0{,}36 + 0{,}64 = 1$.« -/
theorem presecisci_preizkus : (2:ℝ) ^ 2 + 4 * 48 = 196 ∧ (196:ℝ) = 14 ^ 2 ∧
    (36:ℝ) / 100 + 16 / 25 = 0.36 + 0.64 ∧ (0.36:ℝ) + 0.64 = 1 ∧ (-8:ℝ) ^ 2 / 100 + (-3) ^ 2 / 25 = 1 := by
  norm_num

/-! ## Rešeni primeri -/

/-- Primer 1, koraki 1–4: 4x² + 9y² − 16x + 54y + 61 = 0 ↔ 4(x² − 4x) + 9(y² + 6y) = −61 ↔
4(x − 2)² − 16 + 9(y + 3)² − 81 = −61 ↔ 4(x − 2)² + 9(y + 3)² = 36 ↔ (x − 2)²/9 + (y + 3)²/4 = 1.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#primer1
besedilo: »Člene z isto spremenljivko združimo in izpostavimo koeficienta: $4(x^2 - 4x) + 9(y^2 + 6y) = -61$. 2. Dopolnimo do popolnih kvadratov. Dodano odštejemo, pomnoženo s koeficientom pred oklepajem: $4(x - 2)^2 - 16 + 9(y + 3)^2 - 81 = -61$. 3. Konstante prenesemo na desno: $-61 + 16 + 81 = 36$, torej $4(x - 2)^2 + 9(y + 3)^2 = 36$. 4. Delimo s $36$, da je na desni $1$: $\frac{(x - 2)^2}{9} + \frac{(y + 3)^2}{4} = 1$.« -/
theorem primer1 (x y : ℝ) :
    4 * x ^ 2 + 9 * y ^ 2 - 16 * x + 54 * y + 61 = 0 ↔ (x - 2) ^ 2 / 9 + (y + 3) ^ 2 / 4 = 1 :=
  calc 4 * x ^ 2 + 9 * y ^ 2 - 16 * x + 54 * y + 61 = 0
      ↔ 4 * (x ^ 2 - 4 * x) + 9 * (y ^ 2 + 6 * y) = -61 :=
        ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
    _ ↔ 4 * (x - 2) ^ 2 - 16 + 9 * (y + 3) ^ 2 - 81 = -61 :=
        ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
    _ ↔ 4 * (x - 2) ^ 2 + 9 * (y + 3) ^ 2 = -61 + 16 + 81 :=
        ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
    _ ↔ 4 * (x - 2) ^ 2 + 9 * (y + 3) ^ 2 = 36 := by norm_num
    _ ↔ (x - 2) ^ 2 / 9 + (y + 3) ^ 2 / 4 = 1 :=
        ⟨fun h => by linear_combination h / 36, fun h => by linear_combination 36 * h⟩

/-- Primer 1, formula: x² − 4x = (x − 2)² − 4.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#primer1-formula
besedilo: »$x^2 - 4x = (x - 2)^2 - 4$« -/
theorem primer1_formula (x : ℝ) : x ^ 2 - 4 * x = (x - 2) ^ 2 - 4 := by ring

/-- Primer 1, koraka 5–6: S(2, −3), a = 3, b = 2, e = √(9 − 4) = √5 ≈ 2,24 (2,235 < √5 < 2,245); gorišči sta
F₁,₂(2 ∓ √5, −3): točka leži na elipsi natanko tedaj, ko je vsota razdalj do njiju 2·3 = 6.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#primer1-gorisci
besedilo: »Središče je $S(2, -3)$, $a = 3$, $b = 2$. Ekscentričnost $e = \sqrt{9 - 4} = \sqrt5 \approx 2{,}24$. 6. Odgovor: to je polna elipsa s prve slike. Središče $S(2, -3)$, polosi $3$ in $2$, gorišči $F_{1,2}(2 \pm \sqrt5, -3)$.« -/
theorem primer1_gorisci (x y : ℝ) :
    √((9:ℝ) - 4) = √5 ∧ (2.235 : ℝ) < √5 ∧ √5 < (2.245 : ℝ) ∧
    ((x - 2) ^ 2 / 9 + (y + 3) ^ 2 / 4 = 1 ↔
      √((x - (2 - √5)) ^ 2 + (y + 3) ^ 2) + √((x - (2 + √5)) ^ 2 + (y + 3) ^ 2) = 6) := by
  refine ⟨by norm_num, (Real.lt_sqrt (by norm_num)).2 (by norm_num),
    (Real.sqrt_lt' (by norm_num)).2 (by norm_num), ?_⟩
  have h := gorisci_elipse 2 (-3) 3 2 x y (by norm_num) (by norm_num) (by norm_num)
  norm_num at h ⊢; exact h

/-- Primer 2, korak 1: y² − 4y − 8x + 28 = 0 ↔ (y − 2)² = 8x − 24 ↔ (y − 2)² = 8(x − 3) (y² − 4y = (y − 2)² − 4).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#primer2-enacba
besedilo: »Dopolnimo: $y^2 - 4y = (y - 2)^2 - 4$, torej $(y - 2)^2 = 8x - 24 = 8(x - 3)$.« -/
theorem primer2_enacba (x y : ℝ) :
    y ^ 2 - 4 * y - 8 * x + 28 = 0 ↔ (y - 2) ^ 2 = 8 * (x - 3) :=
  calc y ^ 2 - 4 * y - 8 * x + 28 = 0 ↔ (y - 2) ^ 2 = 8 * x - 24 :=
        ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
    _ ↔ (y - 2) ^ 2 = 8 * (x - 3) := by ring_nf

/-- Primer 2, korak 2: 2p = 8 da p = 4; teme T(3, 2), gorišče F(3 + 4/2, 2) = (5, 2), vodnica x = 3 − 4/2 = 1;
vsaka točka krivulje je od F enako oddaljena kot od vodnice.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#primer2-gorisce
besedilo: »Teme je $T(3, 2)$, $2p = 8$, zato $p = 4$. Gorišče $F(5, 2)$, vodnica $x = 1$.« -/
theorem primer2_gorisce (x y : ℝ) (h : (y - 2) ^ 2 = 8 * (x - 3)) :
    (∀ p : ℝ, 2 * p = 8 ↔ p = 4) ∧ (3:ℝ) + 4 / 2 = 5 ∧ (3:ℝ) - 4 / 2 = 1 ∧
    √((x - 5) ^ 2 + (y - 2) ^ 2) = |x - 1| := by
  refine ⟨fun p => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, ?_⟩
  have := gorisce_vodnica_parabole 3 2 4 x y (by linear_combination h)
  norm_num at this; exact this

/-- Predpostavka `primer2_gorisce` se da izpolniti (T₁(5, 6)). -/
example : ((6:ℝ) - 2) ^ 2 = 8 * (5 - 3) := by norm_num

/-- Predpostavke trditve `primer2_gorisce` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ((6:ℝ) - 2) ^ 2 = 8 * (5 - 3) := by norm_num
  primer2_gorisce (h := w)

/-- Primer 2, korak 3: iz (6 − 2)² = 8(x₁ − 3) oziroma 16 = 8(x₁ − 3) sledi x₁ = 5 (edina rešitev).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#primer2-t1
besedilo: »iz $(6 - 2)^2 = 8(x_1 - 3)$ sledi $16 = 8(x_1 - 3)$ in $x_1 = 5$.« -/
theorem primer2_T1 (x₁ : ℝ) : (6 - 2) ^ 2 = 8 * (x₁ - 3) ↔ x₁ = 5 :=
  calc (6 - 2) ^ 2 = 8 * (x₁ - 3) ↔ 16 = 8 * (x₁ - 3) := by norm_num
    _ ↔ x₁ = 5 := ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩

/-- Primer 2, korak 4: tangenta (6 − 2)(y − 2) = 4((x − 3) + (5 − 3)) ↔ 4(y − 2) = 4(x − 1) ↔ y = x + 1.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#primer2-tangenta
besedilo: »Tangenta: $(6 - 2)(y - 2) = 4\big((x - 3) + (5 - 3)\big)$, torej $4(y - 2) = 4(x - 1)$ in $y = x + 1$.« -/
theorem primer2_tangenta (x y : ℝ) :
    (6 - 2) * (y - 2) = 4 * ((x - 3) + (5 - 3)) ↔ y = x + 1 :=
  calc (6 - 2) * (y - 2) = 4 * ((x - 3) + (5 - 3)) ↔ 4 * (y - 2) = 4 * (x - 1) :=
        ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
    _ ↔ y = x + 1 := ⟨fun h => by linear_combination h / 4, fun h => by linear_combination 4 * h⟩

/-- Primer 2, korak 5 (preizkus): z y = x + 1 dobimo (x − 1)² = 8(x − 3), torej x² − 10x + 25 = 0 z
D = 100 − 100 = 0 in dvojno rešitvijo x = 5; premica se krivulje dotakne le v T₁(5, 6).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#primer2-preizkus
besedilo: »Preizkus z diskriminanto: vstavimo $y = x + 1$ in dobimo $(x - 1)^2 = 8(x - 3)$ oziroma $x^2 - 10x + 25 = 0$. Diskriminanta je $100 - 100 = 0$, dvojna rešitev $x = 5$.« -/
theorem primer2_preizkus :
    (∀ x : ℝ, (x + 1 - 2) ^ 2 - 8 * (x - 3) = (x - 5) ^ 2) ∧
    (∀ x : ℝ, (x - 1) ^ 2 = 8 * (x - 3) ↔ x ^ 2 - 10 * x + 25 = 0) ∧ (-10:ℝ) ^ 2 - 4 * 25 = 0 ∧
    (∀ x : ℝ, x ^ 2 - 10 * x + 25 = 0 ↔ x = 5) ∧
    ∀ x y : ℝ, (y ^ 2 - 4 * y - 8 * x + 28 = 0 ∧ y = x + 1) ↔ (x = 5 ∧ y = 6) := by
  refine ⟨fun x => by ring, fun x => ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩,
    by norm_num, fun x => ?_, fun x y => ?_⟩
  · rw [show x ^ 2 - 10 * x + 25 = x ^ 2 + (-10) * x + 25 by ring]
    rw [kvadratna x 5 5 _ _ (by norm_num) (by norm_num), or_self]
  · constructor
    · rintro ⟨h, rfl⟩
      have : (x - 5) ^ 2 = 0 := by linear_combination h
      have hx : x = 5 := by simpa [sub_eq_zero] using this
      subst hx; norm_num
    · rintro ⟨rfl, rfl⟩; norm_num

/-- Primer 3, korak 1: s premikom u = x − 12, v = y − 8 postane premica y = x/2 + n premica v = u/2 + m z
m = n − 2, saj je y − 8 = (u + 12)/2 + n − 8.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#primer3-premik
besedilo: »Premica postane $v = \frac12 u + m$ z $m = n - 2$, saj je $y - 8 = \frac12(u + 12) + n - 8$.« -/
theorem primer3_premik (x y n : ℝ) :
    y = 1 / 2 * x + n ↔ y - 8 = 1 / 2 * (x - 12) + (n - 2) :=
  ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩

/-- Primer 3, korak 2: u²/36 + (u/2 + m)²/16 = 1 ↔ 4u² + 9(u/2 + m)² = 144 ↔ 25u² + 36mu + 36m² − 576 = 0.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#primer3-vstavitev
besedilo: »Vstavimo $v$ v elipso in pomnožimo s $144$: $4u^2 + 9\left(\frac12 u + m\right)^2 = 144$. Po množenju s $4$ in urejanju: $25u^2 + 36mu + 36m^2 - 576 = 0$.« -/
theorem primer3_vstavitev (u m : ℝ) :
    u ^ 2 / 36 + (1 / 2 * u + m) ^ 2 / 16 = 1 ↔ 25 * u ^ 2 + 36 * m * u + 36 * m ^ 2 - 576 = 0 :=
  calc u ^ 2 / 36 + (1 / 2 * u + m) ^ 2 / 16 = 1 ↔ 4 * u ^ 2 + 9 * (1 / 2 * u + m) ^ 2 = 144 :=
        ⟨fun h => by linear_combination 144 * h, fun h => by linear_combination h / 144⟩
    _ ↔ 25 * u ^ 2 + 36 * m * u + 36 * m ^ 2 - 576 = 0 :=
        ⟨fun h => by linear_combination 4 * h, fun h => by linear_combination h / 4⟩

/-- Primer 3, korak 3: D = (36m)² − 4·25·(36m² − 576) = 57600 − 2304m² in D = 0 ↔ m² = 25 ↔ m = 5 ∨ m = −5;
to sta natanko vrednosti m, pri katerih ima premica z elipso eno samo skupno točko.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#primer3-diskriminanta
besedilo: »Diskriminanta: $D = (36m)^2 - 4 \cdot 25 \cdot (36m^2 - 576) = 57600 - 2304m^2$. Iz $D = 0$ sledi $m^2 = 25$, torej $m = 5$ ali $m = -5$.« -/
theorem primer3_diskriminanta :
    (∀ m : ℝ, (36 * m) ^ 2 - 4 * 25 * (36 * m ^ 2 - 576) = 57600 - 2304 * m ^ 2) ∧
    (∀ m : ℝ, 57600 - 2304 * m ^ 2 = 0 ↔ m = 5 ∨ m = -5) ∧
    ∀ m : ℝ, (∃! u : ℝ, u ^ 2 / 6 ^ 2 + (1 / 2 * u + m) ^ 2 / 4 ^ 2 = 1) ↔ m = 5 ∨ m = -5 := by
  have hm : ∀ m : ℝ, m ^ 2 = 25 ↔ m = 5 ∨ m = -5 := fun m => by
    rw [show (25:ℝ) = 5 ^ 2 by norm_num, sq_eq_sq_iff_eq_or_eq_neg]
  refine ⟨fun m => by ring, fun m => ?_, fun m => ?_⟩
  · rw [← hm]
    exact ⟨fun h => by linear_combination (-1 / 2304) * h, fun h => by linear_combination (-2304) * h⟩
  · rw [pogoj_tangentnosti_elipse 6 4 (1 / 2) m (by norm_num) (by norm_num), ← hm]
    constructor <;> intro h <;> linear_combination -h

/-- Primer 3, koraka 4–5: pri m = −5 je n = m + 2 = −3 (pri m = 5 bi bil n = 7); dvojna rešitev
u = −36m/(2·25) = 180/50 = 3,6, v = 3,6/2 − 5 = −3,2, nazaj x = 15,6, y = 4,8; preizkus
3,6²/36 + 3,2²/16 = 1.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#primer3-dotikalisce
besedilo: »Pot pod vodnjakom ima manjši odsek: $m = -5$, zato je $n = m + 2 = -3$. (Pri $m = 5$ bi bila pot nad vodnjakom.) 5. Dvojna rešitev: $u = \frac{-36m}{2 \cdot 25} = \frac{180}{50} = 3{,}6$ in $v = \frac12 \cdot 3{,}6 - 5 = -3{,}2$. Nazaj: $x = 15{,}6$, $y = 4{,}8$.« -/
theorem primer3_dotikalisce :
    (-5:ℝ) + 2 = -3 ∧ (5:ℝ) + 2 = 7 ∧ -36 * (-5:ℝ) / (2 * 25) = 180 / 50 ∧ (180:ℝ) / 50 = 3.6 ∧
    1 / 2 * (3.6:ℝ) - 5 = -3.2 ∧ (3.6:ℝ) + 12 = 15.6 ∧ (-3.2:ℝ) + 8 = 4.8 ∧
    (3.6:ℝ) ^ 2 / 36 + 3.2 ^ 2 / 16 = 1 := by norm_num

/-- Primer 3, odgovor: pot y = x/2 − 3 ima z vodnjakom (x − 12)²/36 + (y − 8)²/16 = 1 edino skupno točko
(15,6; 4,8), ki leži južno od središča (4,8 < 8); druga tangenta y = x/2 + 7 se dotakne v (8,4; 11,2) severno
od središča.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#primer3-odgovor
besedilo: »Odgovor: pot ima enačbo $y = \frac12 x - 3$ in se vodnjaka dotakne v točki $(15{,}6; 4{,}8)$.« -/
theorem primer3_odgovor :
    (∀ x y : ℝ, ((x - 12) ^ 2 / 36 + (y - 8) ^ 2 / 16 = 1 ∧ y = 1 / 2 * x - 3) ↔ (x = 15.6 ∧ y = 4.8)) ∧
    (∀ x y : ℝ, ((x - 12) ^ 2 / 36 + (y - 8) ^ 2 / 16 = 1 ∧ y = 1 / 2 * x + 7) ↔ (x = 8.4 ∧ y = 11.2)) ∧
    (4.8:ℝ) < 8 ∧ (8:ℝ) < 11.2 := by
  refine ⟨fun x y => ⟨?_, ?_⟩, fun x y => ⟨?_, ?_⟩, by norm_num, by norm_num⟩
  · rintro ⟨h, rfl⟩
    have : (5 * x - 78) ^ 2 = 0 := by linear_combination 576 * h
    have hx : x = 15.6 := by norm_num at this; linarith
    subst hx; norm_num
  · rintro ⟨rfl, rfl⟩; norm_num
  · rintro ⟨h, rfl⟩
    have : (5 * x - 42) ^ 2 = 0 := by linear_combination 576 * h
    have hx : x = 8.4 := by norm_num at this; linarith
    subst hx; norm_num
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Primer 4, korak 1: T₁(3,8; −1,4) leži na elipsi: x₁ − x₀ = 1,8, y₁ − y₀ = 1,6 in
1,8²/9 + 1,6²/4 = 0,36 + 0,64 = 1.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#primer4-t1
besedilo: »Preizkus, da $T_1$ leži na elipsi: $\frac{1{,}8^2}{9} + \frac{1{,}6^2}{4} = 0{,}36 + 0{,}64 = 1$.« -/
theorem primer4_T1 :
    (3.8:ℝ) - 2 = 1.8 ∧ (-1.4:ℝ) - (-3) = 1.6 ∧ (1.8:ℝ) ^ 2 / 9 + 1.6 ^ 2 / 4 = 0.36 + 0.64 ∧
    (0.36:ℝ) + 0.64 = 1 := by norm_num

/-- Primer 4, koraka 2–3 in Premisli: 1,8(x − 2)/9 + 1,6(y + 3)/4 = 1 ↔ 0,2(x − 2) + 0,4(y + 3) = 1 ↔
0,2x − 0,4 + 0,4y + 1,2 = 1 ↔ 0,2x + 0,4y = 0,2 ↔ x + 2y = 1; preizkus 3,8 + 2·(−1,4) = 1.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#primer4-tangenta
besedilo: »$0{,}2x - 0{,}4 + 0{,}4y + 1{,}2 = 1$, torej $0{,}2x + 0{,}4y = 0{,}2$ in po množenju s $5$: $x + 2y = 1$. Preizkus: $3{,}8 + 2 \cdot (-1{,}4) = 1$, točka $T_1$ leži na tangenti.« -/
theorem primer4_tangenta (x y : ℝ) :
    (1.8 * (x - 2) / 9 + 1.6 * (y + 3) / 4 = 1 ↔ x + 2 * y = 1) ∧ (3.8:ℝ) + 2 * (-1.4) = 1 := by
  refine ⟨?_, by norm_num⟩
  calc 1.8 * (x - 2) / 9 + 1.6 * (y + 3) / 4 = 1 ↔ 0.2 * (x - 2) + 0.4 * (y + 3) = 1 := by
        constructor <;> intro h <;> linear_combination h
    _ ↔ 0.2 * x - 0.4 + 0.4 * y + 1.2 = 1 := by constructor <;> intro h <;> linear_combination h
    _ ↔ 0.2 * x + 0.4 * y = 0.2 := by constructor <;> intro h <;> linear_combination h
    _ ↔ x + 2 * y = 1 := ⟨fun h => by linear_combination 5 * h, fun h => by linear_combination h / 5⟩

/-- Primer 4: premica x + 2y = 1 ima z elipso (x − 2)²/9 + (y + 3)²/4 = 1 edino skupno točko T₁(3,8; −1,4)
(je tangenta po pravilu iz Razlage 6).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#primer4-edina
besedilo: »Preizkus: $3{,}8 + 2 \cdot (-1{,}4) = 1$, točka $T_1$ leži na tangenti.« -/
theorem primer4_edina (x y : ℝ) :
    ((x - 2) ^ 2 / 9 + (y + 3) ^ 2 / 4 = 1 ∧ x + 2 * y = 1) ↔ (x = 3.8 ∧ y = -1.4) := by
  constructor
  · rintro ⟨h, hl⟩
    exact (tangenta_elipse 2 (-3) 3 2 3.8 (-1.4) (by norm_num) (by norm_num) (by norm_num)).2.2 x y
      (by linear_combination h) (by linear_combination hl / 5)
  · rintro ⟨rfl, rfl⟩; norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake: x + 2 = x − (−2) (središče ima x₀ = −2); zapis 4(y² + 2y) = 4(y + 1)² − 1 ni pravilen
(npr. pri y = 0), pravilno je 4(y² + 2y) = 4(y + 1)² − 4.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#napake-predznak-koeficient
besedilo: »Zapiši $x + 2 = x - (-2)$: središče ima $x_0 = -2$. - **Pozabljen koeficient pri dopolnjevanju.** Zapis $4(y^2 + 2y) = 4(y + 1)^2 - 1$ je napačen, ker $4(y + 1)^2$ doda $4 \cdot 1 = 4$. Odšteti moraš $4$.« -/
theorem napake_predznak_koeficient :
    (∀ x : ℝ, x + 2 = x - (-2)) ∧ ¬ (∀ y : ℝ, 4 * (y ^ 2 + 2 * y) = 4 * (y + 1) ^ 2 - 1) ∧
    ∀ y : ℝ, 4 * (y ^ 2 + 2 * y) = 4 * (y + 1) ^ 2 - 4 := by
  refine ⟨fun x => by ring, fun h => by have := h 0; norm_num at this, fun y => by ring⟩

/-- Pogoste napake (polosi pred deljenjem): enačba 4(x − 2)² + 9(y + 3)² = 36 ni elipsa s polosema 2 in 3:
točka (5, −3) ji zadošča, (x − 2)²/2² + (y + 3)²/3² = 1 pa ne; pač pa zadošča (x − 2)²/9 + (y + 3)²/4 = 1.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#napake-polosi
besedilo: »Iz $4(x - 2)^2 + 9(y + 3)^2 = 36$ ne moreš prebrati $a = 2$ in $b = 3$. Najprej deli, da je na desni $1$; šele imenovalca $9$ in $4$ dasta $a = 3$, $b = 2$.« -/
theorem napake_polosi :
    4 * ((5:ℝ) - 2) ^ 2 + 9 * ((-3:ℝ) + 3) ^ 2 = 36 ∧ ((5:ℝ) - 2) ^ 2 / 2 ^ 2 + ((-3:ℝ) + 3) ^ 2 / 3 ^ 2 ≠ 1 ∧
    ((5:ℝ) - 2) ^ 2 / 9 + ((-3:ℝ) + 3) ^ 2 / 4 = 1 := by norm_num

/-- Pogoste napake (gorišča brez premika): točki (∓√5, 0) nista gorišči elipse iz Primera 1, saj je za njeno
teme (5, −3) vsota razdalj do njiju večja od 6.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#napake-gorisca
besedilo: »Gorišči premaknjene elipse nista $(\pm e, 0)$, ampak $(x_0 \pm e, y_0)$.« -/
theorem napake_gorisca :
    6 < √((5 - (-√5)) ^ 2 + ((-3:ℝ) - 0) ^ 2) + √((5 - √5) ^ 2 + ((-3:ℝ) - 0) ^ 2) := by
  have h5 : (2:ℝ) < √5 := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have h1 : 6 < √((5 - (-√5)) ^ 2 + ((-3:ℝ) - 0) ^ 2) :=
    (Real.lt_sqrt (by norm_num)).2 (by nlinarith)
  linarith [Real.sqrt_nonneg ((5 - √5) ^ 2 + ((-3:ℝ) - 0) ^ 2)]

/-- Pogoste napake (pravilo za točko zunaj): točka (2, 1) leži zunaj elipse x²/4 + y² = 1 (4/4 + 1 > 1),
»tangenta« 2x/4 + 1·y/1 = 1 pa elipso seka v dveh točkah (2, 0) in (0, 1), zato ni tangenta.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#napake-zunanja-tocka
besedilo: »Enačba tangente $\frac{x_1 x}{a^2} + \frac{y_1 y}{b^2} = 1$ velja le za točko na stožnici. Za točko zunaj daje premico, ki ni tangenta.« -/
theorem napake_zunanja_tocka :
    (1:ℝ) < 2 ^ 2 / 4 + 1 ^ 2 ∧
    ∀ x y : ℝ, (x ^ 2 / 4 + y ^ 2 = 1 ∧ 2 * x / 4 + 1 * y / 1 = 1) ↔ (x = 2 ∧ y = 0) ∨ (x = 0 ∧ y = 1) := by
  refine ⟨by norm_num, fun x y => ⟨?_, ?_⟩⟩
  · rintro ⟨h, hl⟩
    have hy : y = 1 - x / 2 := by linear_combination hl
    subst hy
    have : x * (x - 2) = 0 := by linear_combination 2 * h
    rcases mul_eq_zero.1 this with h0 | h0
    · right; constructor <;> linarith
    · left; constructor <;> linarith
  · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩) <;> norm_num

/-! ## Za maturo -/

/-- Naloga 1: gorišči F₁(−4, 2), F₂(2, 2): središče S((−4 + 2)/2, 2) = (−1, 2), e = 2 − (−1) = 3; teme (4, 2) da
a = 4 − (−1) = 5 in b = √(25 − 9) = 4.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#naloga1-podatki
besedilo: »Središče je razpolovišče daljice $F_1F_2$: $S(-1, 2)$. Gorišči sta od središča oddaljeni $e = 3$. 2. Teme $(4, 2)$ leži na isti vodoravni premici kot gorišči, torej na veliki osi: $a = 4 - (-1) = 5$. Mala polos je $b = \sqrt{a^2 - e^2} = \sqrt{25 - 9} = 4$.« -/
theorem naloga1_podatki :
    ((-4:ℝ) + 2) / 2 = -1 ∧ (2:ℝ) - (-1) = 3 ∧ (4:ℝ) - (-1) = 5 ∧ √((5:ℝ) ^ 2 - 3 ^ 2) = 4 ∧
    √((25:ℝ) - 9) = 4 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_, ?_⟩
  · rw [show (5:ℝ) ^ 2 - 3 ^ 2 = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (25:ℝ) - 9 = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Naloga 1, odgovor: elipsa (x + 1)²/25 + (y − 2)²/16 = 1 je natanko množica točk z vsoto razdalj do
F₁(−4, 2) in F₂(2, 2) enako 10, kolikor je ta vsota za teme (4, 2) (8 + 2 = 10); zato je to iskana elipsa.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#naloga1
besedilo: »Odgovor: $\frac{(x + 1)^2}{25} + \frac{(y - 2)^2}{16} = 1$.« -/
theorem naloga1 (x y : ℝ) :
    ((x + 1) ^ 2 / 25 + (y - 2) ^ 2 / 16 = 1 ↔
      √((x - (-4)) ^ 2 + (y - 2) ^ 2) + √((x - 2) ^ 2 + (y - 2) ^ 2) = 10) ∧
    √(((4:ℝ) - (-4)) ^ 2 + (2 - 2) ^ 2) + √(((4:ℝ) - 2) ^ 2 + (2 - 2) ^ 2) = 10 := by
  constructor
  · have h := gorisci_elipse (-1) 2 5 4 x y (by norm_num) (by norm_num) (by norm_num)
    rw [show √((5:ℝ) ^ 2 - 4 ^ 2) = 3 by
      rw [show (5:ℝ) ^ 2 - 4 ^ 2 = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]] at h
    norm_num at h ⊢; exact h
  · rw [show ((4:ℝ) - (-4)) ^ 2 + (2 - 2) ^ 2 = 8 ^ 2 by norm_num,
      show ((4:ℝ) - 2) ^ 2 + (2 - 2) ^ 2 = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num),
      Real.sqrt_sq (by norm_num)]
    norm_num

/-- Naloga 2 a): 25x² + 9y² − 50x + 36y − 164 = 0 ↔ 25(x² − 2x) + 9(y² + 4y) = 164 ↔
25(x − 1)² − 25 + 9(y + 2)² − 36 = 164 ↔ 25(x − 1)² + 9(y + 2)² = 225 ↔ (x − 1)²/9 + (y + 2)²/25 = 1.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#naloga2a
besedilo: »Delimo z $225$: $\frac{(x - 1)^2}{9} + \frac{(y + 2)^2}{25} = 1$.« -/
theorem naloga2a (x y : ℝ) :
    25 * x ^ 2 + 9 * y ^ 2 - 50 * x + 36 * y - 164 = 0 ↔ (x - 1) ^ 2 / 9 + (y + 2) ^ 2 / 25 = 1 :=
  calc 25 * x ^ 2 + 9 * y ^ 2 - 50 * x + 36 * y - 164 = 0
      ↔ 25 * (x ^ 2 - 2 * x) + 9 * (y ^ 2 + 4 * y) = 164 :=
        ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
    _ ↔ 25 * (x - 1) ^ 2 - 25 + 9 * (y + 2) ^ 2 - 36 = 164 :=
        ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
    _ ↔ 25 * (x - 1) ^ 2 + 9 * (y + 2) ^ 2 = 225 :=
        ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
    _ ↔ (x - 1) ^ 2 / 9 + (y + 2) ^ 2 / 25 = 1 :=
        ⟨fun h => by linear_combination h / 225, fun h => by linear_combination 225 * h⟩

/-- Naloga 2 b): e = √(25 − 9) = 4, gorišči (1, −2 ∓ 4) = (1, −6) in (1, 2) (vsota razdalj 2·5 = 10 natanko za
točke elipse); temena (−2, −2), (4, −2), (1, 3), (1, −7) ležijo na elipsi.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#naloga2b
besedilo: »Daljša polos je navpična, zato gorišči ležita na premici $x = 1$, od središča oddaljeni $e = \sqrt{b^2 - a^2} = \sqrt{25 - 9} = 4$. Gorišči sta $F_1(1, 2)$ in $F_2(1, -6)$. 5. b) Temena so $(-2, -2)$, $(4, -2)$, $(1, 3)$ in $(1, -7)$.« -/
theorem naloga2b (x y : ℝ) :
    √((25:ℝ) - 9) = 4 ∧
    ((x - 1) ^ 2 / 9 + (y + 2) ^ 2 / 25 = 1 ↔
      √((x - 1) ^ 2 + (y - (-6)) ^ 2) + √((x - 1) ^ 2 + (y - 2) ^ 2) = 10) ∧
    ((-2:ℝ) - 1) ^ 2 / 9 + ((-2:ℝ) + 2) ^ 2 / 25 = 1 ∧ ((4:ℝ) - 1) ^ 2 / 9 + ((-2:ℝ) + 2) ^ 2 / 25 = 1 ∧
    ((1:ℝ) - 1) ^ 2 / 9 + ((3:ℝ) + 2) ^ 2 / 25 = 1 ∧ ((1:ℝ) - 1) ^ 2 / 9 + ((-7:ℝ) + 2) ^ 2 / 25 = 1 := by
  have h4 : √((25:ℝ) - 9) = 4 := by
    rw [show (25:ℝ) - 9 = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨h4, ?_, by norm_num⟩
  have h := gorisci_elipse_navpicno 1 (-2) 3 5 x y (by norm_num) (by norm_num) (by norm_num)
  rw [show (5:ℝ) ^ 2 - 3 ^ 2 = 25 - 9 by norm_num, h4] at h
  norm_num at h ⊢; exact h

/-- Naloga 2 c): premica y = 2 skozi F₁(1, 2): (x − 1)²/9 + (2 + 2)²/25 = 1 ↔ (x − 1)² = 81/25 ↔
x = 14/5 ∨ x = −4/5; dolžina tetive 14/5 + 4/5 = 18/5.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#naloga2c
besedilo: »Premica skozi $F_1(1, 2)$, vzporedna osi $x$, je $y = 2$. Vstavimo: $\frac{(x - 1)^2}{9} + \frac{16}{25} = 1$, torej $(x - 1)^2 = \frac{81}{25}$ in $x - 1 = \pm\frac95$. 7. c) Krajišči tetive sta $\left(\frac{14}{5}, 2\right)$ in $\left(-\frac45, 2\right)$, dolžina tetive je $\frac{14}{5} + \frac45 = \frac{18}{5}$.« -/
theorem naloga2c (x : ℝ) :
    ((x - 1) ^ 2 / 9 + (2 + 2) ^ 2 / 25 = 1 ↔ x = 14 / 5 ∨ x = -4 / 5) ∧ (14:ℝ) / 5 + 4 / 5 = 18 / 5 ∧
    (14:ℝ) / 5 - (-4 / 5) = 18 / 5 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  calc (x - 1) ^ 2 / 9 + (2 + 2) ^ 2 / 25 = 1 ↔ (x - 1) ^ 2 = 81 / 25 :=
        ⟨fun h => by linear_combination 9 * h, fun h => by linear_combination h / 9⟩
    _ ↔ x - 1 = 9 / 5 ∨ x - 1 = -(9 / 5) := by
        rw [show (81:ℝ) / 25 = (9 / 5) ^ 2 by norm_num, sq_eq_sq_iff_eq_or_eq_neg]
    _ ↔ x = 14 / 5 ∨ x = -4 / 5 := by
        constructor <;> rintro (h | h)
        · left; linarith
        · right; linarith
        · left; linarith
        · right; linarith

/-- Naloga 3 a): 8x² − y² + 32x + 2y + 23 = 0 ↔ 8(x² + 4x) − (y² − 2y) = −23 ↔
8(x + 2)² − 32 − (y − 1)² + 1 = −23 ↔ 8(x + 2)² − (y − 1)² = 8 ↔ (x + 2)² − (y − 1)²/8 = 1.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#naloga3a
besedilo: »Združimo in dopolnimo: $8(x^2 + 4x) - (y^2 - 2y) = -23$, torej $8(x + 2)^2 - 32 - (y - 1)^2 + 1 = -23$ in $8(x + 2)^2 - (y - 1)^2 = 8$. 2. a) Delimo z $8$: $(x + 2)^2 - \frac{(y - 1)^2}{8} = 1$.« -/
theorem naloga3a (x y : ℝ) :
    8 * x ^ 2 - y ^ 2 + 32 * x + 2 * y + 23 = 0 ↔ (x + 2) ^ 2 - (y - 1) ^ 2 / 8 = 1 :=
  calc 8 * x ^ 2 - y ^ 2 + 32 * x + 2 * y + 23 = 0 ↔ 8 * (x ^ 2 + 4 * x) - (y ^ 2 - 2 * y) = -23 :=
        ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
    _ ↔ 8 * (x + 2) ^ 2 - 32 - (y - 1) ^ 2 + 1 = -23 :=
        ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
    _ ↔ 8 * (x + 2) ^ 2 - (y - 1) ^ 2 = 8 :=
        ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
    _ ↔ (x + 2) ^ 2 - (y - 1) ^ 2 / 8 = 1 :=
        ⟨fun h => by linear_combination h / 8, fun h => by linear_combination 8 * h⟩

/-- Naloga 3 a), b): a = 1, b = √8 = 2√2, e = √(1 + 8) = 3; temeni (−3, 1), (−1, 1) ležita na hiperboli;
gorišči (−2 ∓ 3, 1) = (−5, 1), (1, 1): absolutna razlika razdalj točke hiperbole do njiju je 2; smerna
koeficienta asimptot sta ±b/a = ±2√2: asimptoti y − 1 = ±2√2(x + 2) hiperbole ne sekata.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#naloga3ab
besedilo: »Kvadrata imata nasprotna predznaka, zato je to hiperbola s središčem $S(-2, 1)$, $a = 1$ in $b = \sqrt8 = 2\sqrt2$. 3. a) $e = \sqrt{a^2 + b^2} = \sqrt{1 + 8} = 3$. Temeni sta $(-3, 1)$ in $(-1, 1)$, gorišči $F_1(-5, 1)$ in $F_2(1, 1)$. 4. b) Asimptoti: $y - 1 = 2\sqrt2\,(x + 2)$ in $y - 1 = -2\sqrt2\,(x + 2)$.« -/
theorem naloga3ab (x y : ℝ) (h : (x + 2) ^ 2 - (y - 1) ^ 2 / 8 = 1) :
    √(8:ℝ) = 2 * √2 ∧ √((1:ℝ) + 8) = 3 ∧
    ((-3:ℝ) + 2) ^ 2 - ((1:ℝ) - 1) ^ 2 / 8 = 1 ∧ ((-1:ℝ) + 2) ^ 2 - ((1:ℝ) - 1) ^ 2 / 8 = 1 ∧
    |√((x - (-5)) ^ 2 + (y - 1) ^ 2) - √((x - 1) ^ 2 + (y - 1) ^ 2)| = 2 ∧
    ∀ u v : ℝ, (v - 1 = 2 * √2 * (u + 2) ∨ v - 1 = -(2 * √2) * (u + 2)) → (u + 2) ^ 2 - (v - 1) ^ 2 / 8 ≠ 1 := by
  have h8 : √(8:ℝ) = 2 * √2 := by
    rw [show (8:ℝ) = 2 ^ 2 * 2 by norm_num, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  have h3 : √((1:ℝ) + 8) = 3 := by rw [show (1:ℝ) + 8 = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have hb : √(8:ℝ) ^ 2 = 8 := Real.sq_sqrt (by norm_num)
  refine ⟨h8, h3, by norm_num, by norm_num, ?_, fun u v hl => ?_⟩
  swap
  · have A := (asimptoti (-2) 1 1 (√8) (by positivity)).2 u v
      (by rw [div_one, h8, sub_neg_eq_add]; exact hl)
    rw [hb, sub_neg_eq_add, one_pow, div_one] at A; exact A
  have g := gorisci_hiperbole (-2) 1 1 (√8) x y (by norm_num) (by positivity)
    (by rw [hb]; linear_combination h)
  rw [hb, show (1:ℝ) ^ 2 + 8 = 1 + 8 by norm_num, h3] at g
  norm_num at g ⊢; exact g

/-- Predpostavka `naloga3ab` se da izpolniti (T₁(1, 9)). -/
example : ((1:ℝ) + 2) ^ 2 - ((9:ℝ) - 1) ^ 2 / 8 = 1 := by norm_num

/-- Predpostavke trditve `naloga3ab` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ((1:ℝ) + 2) ^ 2 - ((9:ℝ) - 1) ^ 2 / 8 = 1 := by norm_num
  naloga3ab (h := w)

/-- Naloga 3 c): 8·(1 + 2)² − (y₁ − 1)² = 8 ↔ (y₁ − 1)² = 64 ↔ y₁ = −7 ∨ y₁ = 9; z y₁ > 1 ostane y₁ = 9,
T₁(1, 9). Tangenta 3(x + 2) − 8(y − 1)/8 = 1 ↔ 3x + 6 − y + 1 = 1 ↔ y = 3x + 6.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#naloga3c
besedilo: »Pri $x_1 = 1$: $8 \cdot 3^2 - (y_1 - 1)^2 = 8$, torej $(y_1 - 1)^2 = 64$ in $y_1 - 1 = \pm 8$. Ker je $y_1 > 1$, je $y_1 = 9$ in $T_1(1, 9)$. 6. c) Tangenta v točki hiperbole: $\frac{(x_1 - x_0)(x - x_0)}{a^2} - \frac{(y_1 - y_0)(y - y_0)}{b^2} = 1$, torej $3(x + 2) - \frac{8(y - 1)}{8} = 1$. 7. c) Uredimo: $3x + 6 - y + 1 = 1$, tangenta je $y = 3x + 6$.« -/
theorem naloga3c (x y : ℝ) :
    (8 * (1 + 2) ^ 2 - (y - 1) ^ 2 = 8 ↔ y = -7 ∨ y = 9) ∧
    ((8 * (1 + 2) ^ 2 - (y - 1) ^ 2 = 8 ∧ 1 < y) ↔ y = 9) ∧
    ((1 - (-2)) * (x - (-2)) / 1 ^ 2 - (9 - 1) * (y - 1) / 8 = 1 ↔ 3 * (x + 2) - 8 * (y - 1) / 8 = 1) ∧
    (3 * (x + 2) - 8 * (y - 1) / 8 = 1 ↔ y = 3 * x + 6) := by
  have hy : 8 * (1 + 2) ^ 2 - (y - 1) ^ 2 = 8 ↔ y = -7 ∨ y = 9 :=
    calc 8 * (1 + 2) ^ 2 - (y - 1) ^ 2 = 8 ↔ (y - 1) ^ 2 = 64 :=
          ⟨fun h => by linear_combination -h, fun h => by linear_combination -h⟩
      _ ↔ y - 1 = 8 ∨ y - 1 = -8 := by
          rw [show (64:ℝ) = 8 ^ 2 by norm_num, sq_eq_sq_iff_eq_or_eq_neg]
      _ ↔ y = -7 ∨ y = 9 := by
          constructor <;> rintro (h | h)
          · right; linarith
          · left; linarith
          · right; linarith
          · left; linarith
  refine ⟨hy, ⟨fun ⟨h, h1⟩ => ?_, fun h => ⟨hy.2 (Or.inr h), by rw [h]; norm_num⟩⟩,
    ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩, ?_⟩
  · rcases hy.1 h with h | h
    · rw [h] at h1; norm_num at h1
    · exact h
  · calc 3 * (x + 2) - 8 * (y - 1) / 8 = 1 ↔ 3 * x + 6 - y + 1 = 1 :=
          ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
      _ ↔ y = 3 * x + 6 := ⟨fun h => by linear_combination -h, fun h => by linear_combination -h⟩

/-- Naloga 3 d): z y = 3x + n je 8(x + 2)² − (3x + n − 1)² − 8 = −(x² − (38 − 6n)x + (n − 1)² − 24);
D = (38 − 6n)² − 4((n − 1)² − 24) = 32n² − 448n + 1536 = 32(n − 6)(n − 8), D = 0 ↔ n = 6 ∨ n = 8; pri n = 8 je
x² + 10x + 25 = 0 z dvojno rešitvijo x = −5, y = 3·(−5) + 8 = −7.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#naloga3d
besedilo: »Vzporedna premica ima enačbo $y = 3x + n$, zato je $y - 1 = 3x + n - 1$. Vstavimo v $8(x + 2)^2 - (y - 1)^2 = 8$: $8x^2 + 32x + 32 - 9x^2 - 6(n - 1)x - (n - 1)^2 = 8$. 9. d) Uredimo in pomnožimo z $-1$: $x^2 - (38 - 6n)x + (n - 1)^2 - 24 = 0$. 10. d) Diskriminanta: $D = (38 - 6n)^2 - 4\big((n - 1)^2 - 24\big) = 32n^2 - 448n + 1536 = 32(n - 6)(n - 8)$. Iz $D = 0$ sledi $n = 6$ (tangenta iz c) ali $n = 8$. 11. d) Pri $n = 8$ je enačba $x^2 + 10x + 25 = 0$, dvojna rešitev $x = -5$, $y = 3 \cdot (-5) + 8 = -7$.« -/
theorem naloga3d :
    (∀ x n : ℝ, 8 * (x + 2) ^ 2 - (3 * x + n - 1) ^ 2 - 8 = -(x ^ 2 - (38 - 6 * n) * x + (n - 1) ^ 2 - 24)) ∧
    (∀ n : ℝ, (38 - 6 * n) ^ 2 - 4 * ((n - 1) ^ 2 - 24) = 32 * n ^ 2 - 448 * n + 1536) ∧
    (∀ n : ℝ, 32 * n ^ 2 - 448 * n + 1536 = 32 * (n - 6) * (n - 8)) ∧
    (∀ n : ℝ, 32 * (n - 6) * (n - 8) = 0 ↔ n = 6 ∨ n = 8) ∧
    (∀ x : ℝ, x ^ 2 - (38 - 6 * 8) * x + (8 - 1) ^ 2 - 24 = x ^ 2 + 10 * x + 25) ∧
    (∀ x : ℝ, x ^ 2 + 10 * x + 25 = 0 ↔ x = -5) ∧ 3 * (-5:ℝ) + 8 = -7 ∧
    8 * ((-5:ℝ) + 2) ^ 2 - (-7 - 1) ^ 2 = 8 := by
  refine ⟨fun x n => by ring, fun n => by ring, fun n => by ring, fun n => ?_, fun x => by ring,
    fun x => ?_, by norm_num, by norm_num⟩
  · rw [mul_assoc, mul_eq_zero, mul_eq_zero, sub_eq_zero, sub_eq_zero]; norm_num
  · rw [kvadratna x (-5) (-5) _ _ (by norm_num) (by norm_num), or_self]

/-- Naloga 3, odgovor c) in d): tangenta y = 3x + 6 ima s hiperbolo edino skupno točko T₁(1, 9), vzporedna
tangenta y = 3x + 8 pa (−5, −7), ki je zrcalna slika T₁ čez središče S(−2, 1) (2·(−2) − 1 = −5, 2·1 − 9 = −7).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#naloga3-odgovor
besedilo: »c) $T_1(1, 9)$, tangenta $y = 3x + 6$; d) tangenta $y = 3x + 8$ z dotikališčem $(-5, -7)$.« -/
theorem naloga3_odgovor :
    (∀ x y : ℝ, (8 * (x + 2) ^ 2 - (y - 1) ^ 2 = 8 ∧ y = 3 * x + 6) ↔ (x = 1 ∧ y = 9)) ∧
    (∀ x y : ℝ, (8 * (x + 2) ^ 2 - (y - 1) ^ 2 = 8 ∧ y = 3 * x + 8) ↔ (x = -5 ∧ y = -7)) ∧
    2 * (-2:ℝ) - 1 = -5 ∧ 2 * (1:ℝ) - 9 = -7 := by
  refine ⟨fun x y => ⟨?_, ?_⟩, fun x y => ⟨?_, ?_⟩, by norm_num, by norm_num⟩
  · rintro ⟨h, rfl⟩
    have : (x - 1) ^ 2 = 0 := by linear_combination -h
    have hx : x = 1 := by simpa [sub_eq_zero] using this
    subst hx; norm_num
  · rintro ⟨rfl, rfl⟩; norm_num
  · rintro ⟨h, rfl⟩
    have : (x + 5) ^ 2 = 0 := by linear_combination -h
    have hx : x = -5 := by simpa [add_eq_zero_iff_eq_neg] using this
    subst hx; norm_num
  · rintro ⟨rfl, rfl⟩; norm_num

/-! ## Preveri se -/

/-- Preveri se, vprašanje 1: (x − 1)²/4 + (y + 2)²/9 = 1 je elipsa s središčem (1, −2);
x² + 4y² − 2x = 3 ↔ (x − 1)² + 4y² = 4; x² + y² + 6y = 0 ↔ x² + (y + 3)² = 9 (krožnica);
4x² − y² + 8x = 0 ↔ 4(x + 1)² − y² = 4 ↔ (x + 1)² − y²/4 = 1 (hiperbola).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#kviz1-oblike
besedilo: »Iz $4x^2 - y^2 + 8x = 0$ dobiš $4(x + 1)^2 - y^2 = 4$ oziroma $(x + 1)^2 - \frac{y^2}{4} = 1$.« -/
theorem kviz1_oblike (x y : ℝ) :
    (x ^ 2 + 4 * y ^ 2 - 2 * x = 3 ↔ (x - 1) ^ 2 + 4 * y ^ 2 = 4) ∧
    (x ^ 2 + y ^ 2 + 6 * y = 0 ↔ x ^ 2 + (y + 3) ^ 2 = 9) ∧
    (4 * x ^ 2 - y ^ 2 + 8 * x = 0 ↔ 4 * (x + 1) ^ 2 - y ^ 2 = 4) ∧
    (4 * (x + 1) ^ 2 - y ^ 2 = 4 ↔ (x + 1) ^ 2 - y ^ 2 / 4 = 1) := by
  refine ⟨⟨fun h => by linear_combination h, fun h => by linear_combination h⟩,
    ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩,
    ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩,
    ⟨fun h => by linear_combination h / 4, fun h => by linear_combination 4 * h⟩⟩

/-- Preveri se, vprašanje 1 (pravilni odgovor): krivulja 4x² − y² + 8x = 0 ni nobena elipsa (in zato tudi ne
krožnica): ima točke s poljubno veliko absciso, elipsa pa je omejena.
pomozno – razlaga kviza trdi »hiperbola«, ta izrek dokaže le, da krivulja ni elipsa; preoblikovanje iz razlage je
kviz1_preoblikovanje -/
theorem kviz1_ni_elipsa : ¬ ∃ x₀ y₀ a b : ℝ, a ≠ 0 ∧ ∀ x y : ℝ,
    (4 * x ^ 2 - y ^ 2 + 8 * x = 0 ↔ (x - x₀) ^ 2 / a ^ 2 + (y - y₀) ^ 2 / b ^ 2 = 1) := by
  rintro ⟨x₀, y₀, a, b, ha, h⟩
  set X := |x₀| + |a| + 1 with hX
  have hX0 : 0 ≤ X := by positivity
  have hY : √(4 * X ^ 2 + 8 * X) ^ 2 = 4 * X ^ 2 + 8 * X := Real.sq_sqrt (by positivity)
  have he := (h X (√(4 * X ^ 2 + 8 * X))).1 (by rw [hY]; ring)
  have h1 : (X - x₀) ^ 2 / a ^ 2 ≤ 1 := by
    have := div_nonneg (sq_nonneg (√(4 * X ^ 2 + 8 * X) - y₀)) (sq_nonneg b); linarith
  rw [div_le_one (by positivity)] at h1
  have h2 : |a| + 1 ≤ X - x₀ := by rw [hX]; linarith [le_abs_self x₀]
  nlinarith [abs_nonneg a, sq_abs a]

/-- Preveri se, vprašanje 1, razlaga: 4x² − y² + 8x = 0 ⟺ 4(x + 1)² − y² = 4 ⟺ (x + 1)² − y²/4 = 1.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#kviz1-preoblikovanje
besedilo: »Iz $4x^2 - y^2 + 8x = 0$ dobiš $4(x + 1)^2 - y^2 = 4$ oziroma $(x + 1)^2 - \frac{y^2}{4} = 1$.« -/
theorem kviz1_preoblikovanje (x y : ℝ) :
    (4 * x ^ 2 - y ^ 2 + 8 * x = 0 ↔ 4 * (x + 1) ^ 2 - y ^ 2 = 4) ∧
    (4 * (x + 1) ^ 2 - y ^ 2 = 4 ↔ (x + 1) ^ 2 - y ^ 2 / 4 = 1) :=
  ⟨⟨fun h => by linear_combination h, fun h => by linear_combination h⟩,
    ⟨fun h => by linear_combination h / 4, fun h => by linear_combination 4 * h⟩⟩

/-- Preveri se, vprašanje 2: z grafa a = 5, b = 3 ((5, 0) in (0, 3) ležita na x²/25 + y²/9 = 1),
e = √(25 − 9) = 4; po premiku za 3 v levo in 2 navzgor je desno gorišče (−3 + 4, 2) = (1, 2), abscisa 1
(napačni 4, 7 in √34 − 3 niso 1).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#kviz2
besedilo: »Z grafa: $a = 5$, $b = 3$, $e = \sqrt{25 - 9} = 4$. Desno gorišče je bilo $(4, 0)$, po premiku je $(-3 + 4, 2) = (1, 2)$.« -/
theorem kviz2 :
    (5:ℝ) ^ 2 / 25 + 0 ^ 2 / 9 = 1 ∧ (0:ℝ) ^ 2 / 25 + 3 ^ 2 / 9 = 1 ∧ √((5:ℝ) ^ 2 - 3 ^ 2) = 4 ∧
    -3 + √((25:ℝ) - 9) = 1 ∧ (0:ℝ) + 4 - 3 = 1 := by
  have h4 : √((25:ℝ) - 9) = 4 := by
    rw [show (25:ℝ) - 9 = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨by norm_num, by norm_num, by rw [show (5:ℝ) ^ 2 - 3 ^ 2 = 25 - 9 by norm_num, h4], by rw [h4]; norm_num,
    by norm_num⟩

/-- Preveri se, vprašanje 3: (x² − 6x) + 4(y² + 2y) = −9 ↔ (x − 3)² − 9 + 4(y + 1)² − 4 = −9 ↔
(x − 3)² + 4(y + 1)² = 4 ↔ (x − 3)²/4 + (y + 1)² = 1; c = −9 + 9 + 4 = 4 je edina vrednost, pri kateri
oblika (x − 3)² + 4(y + 1)² = c velja za vse točke.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#kviz3
besedilo: »$(x^2 - 6x) + 4(y^2 + 2y) = -9$, nato $(x - 3)^2 - 9 + 4(y + 1)^2 - 4 = -9$, torej $c = -9 + 9 + 4 = 4$. Po deljenju s $4$: $\frac{(x - 3)^2}{4} + (y + 1)^2 = 1$, elipsa s središčem $(3, -1)$.« -/
theorem kviz3 :
    (∀ x y : ℝ, x ^ 2 + 4 * y ^ 2 - 6 * x + 8 * y + 9 = 0 ↔ (x ^ 2 - 6 * x) + 4 * (y ^ 2 + 2 * y) = -9) ∧
    (∀ x y : ℝ, (x ^ 2 - 6 * x) + 4 * (y ^ 2 + 2 * y) = -9 ↔ (x - 3) ^ 2 - 9 + 4 * (y + 1) ^ 2 - 4 = -9) ∧
    (∀ x y : ℝ, (x - 3) ^ 2 - 9 + 4 * (y + 1) ^ 2 - 4 = -9 ↔ (x - 3) ^ 2 + 4 * (y + 1) ^ 2 = 4) ∧
    (∀ x y : ℝ, (x - 3) ^ 2 + 4 * (y + 1) ^ 2 = 4 ↔ (x - 3) ^ 2 / 4 + (y + 1) ^ 2 = 1) ∧
    (-9:ℝ) + 9 + 4 = 4 ∧
    ∀ c : ℝ, (∀ x y : ℝ, x ^ 2 + 4 * y ^ 2 - 6 * x + 8 * y + 9 = 0 ↔ (x - 3) ^ 2 + 4 * (y + 1) ^ 2 = c) ↔
      c = 4 := by
  refine ⟨fun x y => ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩,
    fun x y => ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩,
    fun x y => ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩,
    fun x y => ⟨fun h => by linear_combination h / 4, fun h => by linear_combination 4 * h⟩,
    by norm_num, fun c => ⟨fun h => ?_, fun hc x y => ?_⟩⟩
  · have := (h 5 (-1)).1 (by norm_num); norm_num at this; linarith
  · subst hc; exact ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩

/-- Preveri se, vprašanje 4: x − 2y = 6 in x² + 4y² = 20 ↔ (x, y) = (4, −1) ali (2, −2) (prek
(2y + 6)² + 4y² − 20 = 8(y² + 3y + 2) in y = −1 ali y = −2); bližje osi y je (2, −2), abscisa 2.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#kviz4
besedilo: »Iz premice $x = 2y + 6$. Vstavimo: $(2y + 6)^2 + 4y^2 = 20$, torej $8y^2 + 24y + 16 = 0$ oziroma $y^2 + 3y + 2 = 0$. Rešitvi $y = -1$ in $y = -2$ dasta $x = 4$ in $x = 2$. Presečišči sta $(4, -1)$ in $(2, -2)$; bližje osi $y$ je $(2, -2)$.« -/
theorem kviz4 :
    (∀ y : ℝ, (2 * y + 6) ^ 2 + 4 * y ^ 2 - 20 = 8 * (y ^ 2 + 3 * y + 2)) ∧
    (∀ y : ℝ, y ^ 2 + 3 * y + 2 = 0 ↔ y = -1 ∨ y = -2) ∧
    2 * (-1:ℝ) + 6 = 4 ∧ 2 * (-2:ℝ) + 6 = 2 ∧ (4:ℝ) ^ 2 + 4 * (-1) ^ 2 = 20 ∧ (2:ℝ) ^ 2 + 4 * (-2) ^ 2 = 20 ∧
    (∀ x y : ℝ, (x - 2 * y = 6 ∧ x ^ 2 + 4 * y ^ 2 = 20) ↔ (x = 4 ∧ y = -1) ∨ (x = 2 ∧ y = -2)) ∧
    |(2:ℝ)| < |(4:ℝ)| := by
  have hq : ∀ y : ℝ, y ^ 2 + 3 * y + 2 = 0 ↔ y = -1 ∨ y = -2 := fun y =>
    kvadratna y (-1) (-2) 3 2 (by norm_num) (by norm_num)
  refine ⟨fun y => by ring, hq, by norm_num, by norm_num, by norm_num, by norm_num, fun x y => ⟨?_, ?_⟩,
    by norm_num⟩
  · rintro ⟨hl, h⟩
    have hx : x = 2 * y + 6 := by linarith
    subst hx
    rcases (hq y).1 (by linear_combination h / 8) with rfl | rfl
    · left; norm_num
    · right; norm_num
  · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩) <;> norm_num

/-- Preveri se, vprašanje 5: z y = x + n v (y − 1)² = 4(x + 2) dobimo x² + (2n − 6)x + (n − 1)² − 8 = 0,
D = (2n − 6)² − 4((n − 1)² − 8) = −16n + 64; premica je tangenta (dvojna rešitev) natanko pri n = 4, dotikališče
(−1, 3). Premica y = x + 3 skozi teme (−2, 1) parabolo seka še v (2, 5).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#kviz5
besedilo: »Vstaviš $y = x + n$: $x^2 + (2n - 6)x + (n - 1)^2 - 8 = 0$. $D = (2n - 6)^2 - 4\big((n - 1)^2 - 8\big) = -16n + 64 = 0$, torej $n = 4$. Dotikališče je $(-1, 3)$.« -/
theorem kviz5 :
    (∀ x n : ℝ, (x + n - 1) ^ 2 - 4 * (x + 2) = x ^ 2 + (2 * n - 6) * x + ((n - 1) ^ 2 - 8)) ∧
    (∀ n : ℝ, (2 * n - 6) ^ 2 - 4 * ((n - 1) ^ 2 - 8) = -16 * n + 64) ∧
    (∀ n : ℝ, (∃! x : ℝ, (x + n - 1) ^ 2 = 4 * (x + 2)) ↔ n = 4) ∧
    (∀ x y : ℝ, ((y - 1) ^ 2 = 4 * (x + 2) ∧ y = x + 4) ↔ (x = -1 ∧ y = 3)) ∧
    (∀ x y : ℝ, ((y - 1) ^ 2 = 4 * (x + 2) ∧ y = x + 3) ↔ (x = -2 ∧ y = 1) ∨ (x = 2 ∧ y = 5)) := by
  refine ⟨fun x n => by ring, fun n => by ring, fun n => ?_, fun x y => ⟨?_, ?_⟩, fun x y => ⟨?_, ?_⟩⟩
  · have key : ∀ x : ℝ, (x + n - 1) ^ 2 = 4 * (x + 2) ↔
        1 * (x * x) + (2 * n - 6) * x + ((n - 1) ^ 2 - 8) = 0 := fun x =>
      ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
    rw [existsUnique_congr key, ← discrim_eq_zero_iff one_ne_zero, discrim]
    exact ⟨fun h => by linear_combination h / (-16), fun h => by linear_combination (-16) * h⟩
  · rintro ⟨h, rfl⟩
    have : (x + 1) ^ 2 = 0 := by linear_combination h
    have hx : x = -1 := by simpa [add_eq_zero_iff_eq_neg] using this
    subst hx; norm_num
  · rintro ⟨rfl, rfl⟩; norm_num
  · rintro ⟨h, rfl⟩
    have : (x + 2) * (x - 2) = 0 := by linear_combination h
    rcases mul_eq_zero.1 this with h0 | h0
    · left; constructor <;> linarith
    · right; constructor <;> linarith
  · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩) <;> norm_num

/-- Razlaga 4: po dopolnjevanju mora biti pri elipsi desna stran pozitivna: A(x − x₀)² + B(y − y₀)² = c z
A, B > 0 in c < 0 nima nobene točke (c = 0 da le središče).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#desna-stran-elipse
besedilo: »Po dopolnjevanju mora biti pri elipsi desna stran pozitivna, sicer krivulje ni, tako kot pri krožnici.« -/
theorem desna_stran_elipse (x₀ y₀ A B c : ℝ) (hA : 0 < A) (hB : 0 < B) :
    (c < 0 → ∀ x y : ℝ, A * (x - x₀) ^ 2 + B * (y - y₀) ^ 2 ≠ c) ∧
    (∀ x y : ℝ, A * (x - x₀) ^ 2 + B * (y - y₀) ^ 2 = 0 ↔ x = x₀ ∧ y = y₀) := by
  refine ⟨fun hc x y h => by nlinarith [sq_nonneg (x - x₀), sq_nonneg (y - y₀)], fun x y => ⟨fun h => ?_, ?_⟩⟩
  · have h1 : A * (x - x₀) ^ 2 = 0 := by nlinarith [sq_nonneg (x - x₀), sq_nonneg (y - y₀)]
    have h2 : B * (y - y₀) ^ 2 = 0 := by nlinarith [sq_nonneg (x - x₀), sq_nonneg (y - y₀)]
    simp [hA.ne', hB.ne', sub_eq_zero] at h1 h2
    exact ⟨h1, h2⟩
  · rintro ⟨rfl, rfl⟩; simp

/-- Predpostavke `desna_stran_elipse` se dajo izpolniti (A = 4, B = 9). -/
example : (0:ℝ) < 4 ∧ (0:ℝ) < 9 := by norm_num

/-- Predpostavke trditve `desna_stran_elipse` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 4 ∧ (0:ℝ) < 9 := by norm_num
  desna_stran_elipse (hA := w.1) (hB := w.2)

/-- Preveri se, vprašanje 2 (napačni odgovor 2,83): √(25 + 9) − 3 = √34 − 3 ≈ 2,83.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#kviz2-napacni
besedilo: »To je $\sqrt{34} - 3$. Pri elipsi je $e = \sqrt{a^2 - b^2}$, ne $\sqrt{a^2 + b^2}$.« -/
theorem kviz2_napacni : |√((25:ℝ) + 9) - 3 - 2.83| < 0.01 := by
  rw [abs_lt]
  have h1 : (5.82:ℝ) < √(25 + 9) := (Real.lt_sqrt (by norm_num)).2 (by norm_num)
  have h2 : √((25:ℝ) + 9) < 5.84 := (Real.sqrt_lt' (by norm_num)).2 (by norm_num)
  constructor <;> linarith

/-! ## Blok RACUN -/

/-- Blok RACUN, vrstice `enako` (polinomske identitete).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#racun-enako
besedilo: »torej $\frac{1{,}8(x - 2)}{9} + \frac{1{,}6(y + 3)}{4} = 1$ oziroma $0{,}2(x - 2) + 0{,}4(y + 3) = 1$.« -/
theorem racun_enako (x y u m n : ℝ) :
    4 * (x - 2) ^ 2 + 9 * (y + 3) ^ 2 - 36 = 4 * x ^ 2 + 9 * y ^ 2 - 16 * x + 54 * y + 61 ∧
    9 * (x - 2) ^ 2 - 16 * (y + 1) ^ 2 - 144 = 9 * x ^ 2 - 16 * y ^ 2 - 36 * x - 32 * y - 124 ∧
    (y - 2) ^ 2 - 8 * (x - 3) = y ^ 2 - 4 * y - 8 * x + 28 ∧
    (x + 1 - 2) ^ 2 - 8 * (x - 3) = (x - 5) ^ 2 ∧
    4 * (4 * u ^ 2 + 9 * (u / 2 + m) ^ 2 - 144) = 25 * u ^ 2 + 36 * m * u + 36 * m ^ 2 - 576 ∧
    (36 * m) ^ 2 - 4 * 25 * (36 * m ^ 2 - 576) = 57600 - 2304 * m ^ 2 ∧
    5 * ((0.2:ℝ) * (x - 2) + 0.4 * (y + 3) - 1) = x + 2 * y - 1 ∧
    4 * (x + 1) ^ 2 - 4 - y ^ 2 = 4 * x ^ 2 - y ^ 2 + 8 * x ∧
    (x - 3) ^ 2 + 4 * (y + 1) ^ 2 - 4 = x ^ 2 + 4 * y ^ 2 - 6 * x + 8 * y + 9 ∧
    16 * (x + 1) ^ 2 + 25 * (y - 2) ^ 2 - 400 = 16 * x ^ 2 + 25 * y ^ 2 + 32 * x - 100 * y - 284 ∧
    25 * (x - 1) ^ 2 + 9 * (y + 2) ^ 2 - 225 = 25 * x ^ 2 + 9 * y ^ 2 - 50 * x + 36 * y - 164 ∧
    8 * (x + 2) ^ 2 - (y - 1) ^ 2 - 8 = 8 * x ^ 2 - y ^ 2 + 32 * x + 2 * y + 23 ∧
    3 * (x + 2) - (y - 1) - 1 = 3 * x - y + 6 ∧
    8 * (x + 2) ^ 2 - (3 * x + n - 1) ^ 2 - 8 = -(x ^ 2 - (38 - 6 * n) * x + (n - 1) ^ 2 - 24) ∧
    (38 - 6 * n) ^ 2 - 4 * ((n - 1) ^ 2 - 24) = 32 * (n - 6) * (n - 8) ∧
    x ^ 2 + 4 * (x / 2 + 1) ^ 2 - 100 = 2 * (x ^ 2 + 2 * x - 48) ∧
    (2 * y + 6) ^ 2 + 4 * y ^ 2 - 20 = 8 * (y ^ 2 + 3 * y + 2) := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_⟩ <;> ring

/-- Blok RACUN, vrstice `vrednost` (vrstica s korenom √(9 − 4) = √5 je v `primer1_gorisci`, √(25 − 9) = 4 v
`naloga2b`, −3 + √(25 − 9) = 1 in √(5² − 3²) = 4 v `kviz2`, √(1 + 8) = 3 v `naloga3ab`).
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#racun-vrednost
besedilo: »Konstante prenesemo na desno: $-61 + 16 + 81 = 36$« -/
theorem racun_vrednost :
    (-61:ℝ) + 16 + 81 = 36 ∧ √((16:ℝ) + 9) = 5 ∧ (3.6:ℝ) ^ 2 / 36 + 3.2 ^ 2 / 16 = 1 ∧
    (1.8:ℝ) ^ 2 / 9 + 1.6 ^ 2 / 4 = 1 ∧ (14:ℝ) / 5 + 4 / 5 = 18 / 5 ∧ 8 * ((-5:ℝ) + 2) ^ 2 - (-7 - 1) ^ 2 = 8 ∧
    (2:ℝ) ^ 2 + 4 * 48 = 196 ∧ (6:ℝ) / 2 + 1 = 4 ∧ (-8:ℝ) / 2 + 1 = -3 ∧ (36:ℝ) / 100 + 16 / 25 = 1 ∧
    (-8:ℝ) ^ 2 / 100 + (-3) ^ 2 / 25 = 1 ∧ 2 * (-2:ℝ) + 6 = 2 ∧ 2 * (-1:ℝ) + 6 = 4 ∧
    (2:ℝ) ^ 2 + 4 * (-2) ^ 2 = 20 ∧ (4:ℝ) ^ 2 + 4 * (-1) ^ 2 = 20 := by
  refine ⟨by norm_num, ?_, by norm_num⟩
  rw [show (16:ℝ) + 9 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Blok RACUN, vrstice `resi`, ki niso že v drugih trditvah: 57600 − 2304m² = 0 ↔ m ∈ {−5, 5},
(2n − 6)² − 4((n − 1)² − 8) = 0 ↔ n = 4, x² + 2x − 48 = 0 ↔ x ∈ {−8, 6}.
trditev: MAT-SS-3/stoznice-v-premaknjeni-legi-in-tangente#racun-resi
besedilo: »Vstaviš $y = x + n$: $x^2 + (2n - 6)x + (n - 1)^2 - 8 = 0$. $D = (2n - 6)^2 - 4\big((n - 1)^2 - 8\big) = -16n + 64 = 0$, torej $n = 4$. Dotikališče je $(-1, 3)$.« -/
theorem racun_resi :
    (∀ m : ℝ, 57600 - 2304 * m ^ 2 = 0 ↔ m = -5 ∨ m = 5) ∧
    (∀ n : ℝ, (2 * n - 6) ^ 2 - 4 * ((n - 1) ^ 2 - 8) = 0 ↔ n = 4) ∧
    (∀ x : ℝ, x ^ 2 + 2 * x - 48 = 0 ↔ x = -8 ∨ x = 6) := by
  refine ⟨fun m => ?_, fun n => ⟨fun h => by linear_combination h / (-16), fun h => by
    linear_combination (-16) * h⟩, fun x => ?_⟩
  · rw [(primer3_diskriminanta.2.1 m), or_comm]
  · rw [show x ^ 2 + 2 * x - 48 = x ^ 2 + 2 * x + (-48) by ring]
    exact kvadratna x _ _ _ _ (by norm_num) (by norm_num)

/-! ## Primeri izpolnljivosti (izrek, uporabljen na konkretnih vrednostih) -/

/-- Predpostavke trditve `tangenta_hiperbole_edina` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 ∧ √(8:ℝ) ≠ 0 ∧ ((1:ℝ) - (-2)) ^ 2 / 1 ^ 2 - ((9:ℝ) - 1) ^ 2 / √8 ^ 2 = 1 := by
    refine ⟨one_ne_zero, by positivity, ?_⟩
    rw [Real.sq_sqrt (by norm_num)]; norm_num
  tangenta_hiperbole_edina (ha := w.1) (hb := w.2.1) (h₁ := w.2.2) (h := w.2.2)
    (hl := by rw [Real.sq_sqrt (by norm_num)]; norm_num)

/-- Predpostavke trditve `hiperbola_primer_podatki` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  hiperbola_primer_podatki.2.2.2.2.2 2 (-1) (Or.inl (by norm_num))

end Evklid.Lekcije.MAT_SS_3.StozniceVPremaknjeniLegiInTangente
