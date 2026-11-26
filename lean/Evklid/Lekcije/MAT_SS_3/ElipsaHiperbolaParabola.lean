/-
vir: content/lessons/MAT-SS-3/elipsa-hiperbola-parabola.md
sha256: 5944321a2099a5399748fd2ed325d48be5697fd9bf591593c651e2c8eec3fc77
Ni v Leanu: zgodbe in analogije (ogledalo kot nakup, denar, trgovini, svetilka in stožec), risba, simulacija,
GeoGebra in Desmos (razdelek 7, Primer 5 korak 6); odbojna lastnost parabole (žarki vzporedni z osjo se odbijejo
v gorišče, razdelek 3 in ustno vprašanje 3: zahtevno, še ni dokazano); presek stožca z ravnino (»od tod ime
stožnice«); pravila za prepoznavanje vrste krivulje iz Ax² + Bxy + Cy² + Dx + Ey + F = 0 v splošnem
(dokazani so vsi primeri iz razdelka 5) in »člena Dx, Ey premakneta središče« (naslednja lekcija); »graf
kvadratne funkcije je parabola« za premaknjene parabole (dokazano za y = x²/(2p) in y = −x²/8); trditev »Ana ne
more vrniti ogledala« in cena; postopek in Ponovitev; točkovanje.
Razdalje so zapisane kot √((x − u)² + (y − v)²) (`raz`); `raz_dist` pokaže, da je to evklidska razdalja v
ravnini (uporabljeno pri trikotniški neenakosti).
Približki √2000 ≈ 44,7, 2√2000 ≈ 89,4, √91 ≈ 9,54, √27 ≈ 5,20 so dokazani kot ocene napake zaokrožitve.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.ElipsaHiperbolaParabola

open Filter Topology

/-! ## Razdalja in pomožne trditve -/

/-- Razdalja točke (x, y) od točke (u, v). -/
noncomputable def raz (x y u v : ℝ) : ℝ := Real.sqrt ((x - u) ^ 2 + (y - v) ^ 2)

/-- Pomožna: `raz` je evklidska razdalja v ravnini.
pomozno -/
theorem raz_dist (x y u v : ℝ) : dist (!₂[x, y]) (!₂[u, v]) = raz x y u v := by
  rw [EuclideanSpace.dist_eq, raz]; simp [Fin.sum_univ_two, Real.dist_eq, sq_abs]

/-- Pomožna: če je (x − u)² + (y − v)² = c² in c ≥ 0, je razdalja c.
pomozno -/
theorem raz_eq {x y u v c : ℝ} (h : (x - u) ^ 2 + (y - v) ^ 2 = c ^ 2) (hc : 0 ≤ c) : raz x y u v = c := by
  rw [raz, h, Real.sqrt_sq hc]

/-- Pomožna: |√a − c| < e, če je c − e ≥ 0 in (c − e)² < a < (c + e)² (zaokrožitev).
pomozno -/
theorem koren_priblizno {a c e : ℝ} (he : 0 < e) (h0 : 0 ≤ c - e) (h1 : (c - e) ^ 2 < a)
    (h2 : a < (c + e) ^ 2) : |Real.sqrt a - c| < e := by
  rw [abs_lt]; constructor
  · have : c - e < Real.sqrt a := by rw [Real.lt_sqrt h0]; exact h1
    linarith
  · have : Real.sqrt a < c + e := by rw [Real.sqrt_lt' (by linarith)]; exact h2
    linarith

/-- Predpostavke `raz_eq` in `koren_priblizno` se dajo izpolniti. -/
example : raz 3 4 0 0 = 5 ∧ |Real.sqrt 4 - 2| < 1 / 2 :=
  ⟨raz_eq (by norm_num) (by norm_num), koren_priblizno (by norm_num) (by norm_num) (by norm_num) (by norm_num)⟩

/-- Pomožna: √(c²) = c za c ≥ 0 (polosi so korena imenovalcev).
pomozno -/
theorem koren_kvadrata {c : ℝ} (hc : 0 ≤ c) : Real.sqrt (c ^ 2) = c := Real.sqrt_sq hc

/-- Predpostavka `koren_kvadrata` se da izpolniti (c = 5). -/
example : Real.sqrt ((5 : ℝ) ^ 2) = 5 := koren_kvadrata (by norm_num)

/-! ## Razlaga 1: elipsa -/

/-- Razlaga 1 (izpeljava z dvakratnim kvadriranjem): na elipsi x²/a² + y²/b² = 1 (0 < b ≤ a, e = √(a² − b²)) sta
razdalji do gorišč r₁ = a + ex/a in r₂ = a − ex/a.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#elipsa-gorisci
besedilo: »$$\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$$« -/
theorem elipsa_gorisci {a b x y : ℝ} (ha : 0 < a) (hb : 0 < b) (hab : b ≤ a)
    (h : x ^ 2 / a ^ 2 + y ^ 2 / b ^ 2 = 1) :
    raz x y (-Real.sqrt (a ^ 2 - b ^ 2)) 0 = a + Real.sqrt (a ^ 2 - b ^ 2) * x / a ∧
    raz x y (Real.sqrt (a ^ 2 - b ^ 2)) 0 = a - Real.sqrt (a ^ 2 - b ^ 2) * x / a := by
  set e := Real.sqrt (a ^ 2 - b ^ 2) with he
  have he2 : e ^ 2 = a ^ 2 - b ^ 2 := Real.sq_sqrt (by nlinarith)
  have he0 : 0 ≤ e := Real.sqrt_nonneg _
  have hea : e ≤ a := by nlinarith
  have H1 : x ^ 2 * b ^ 2 + y ^ 2 * a ^ 2 = a ^ 2 * b ^ 2 := by
    have := h; field_simp at this; linarith
  have hxx : x ^ 2 ≤ a ^ 2 := by
    have : 0 ≤ y ^ 2 * a ^ 2 := by positivity
    have hb2 : 0 < b ^ 2 := by positivity
    by_contra hc; push Not at hc; nlinarith [mul_lt_mul_of_pos_right hc hb2]
  have hx1 : -a ≤ x := by nlinarith
  have hx2 : x ≤ a := by nlinarith
  have ha0 : a ≠ 0 := ha.ne'
  constructor
  · have key : (x + e) ^ 2 + y ^ 2 = (a + e * x / a) ^ 2 := by
      have k : ((x + e) ^ 2 + y ^ 2) * a ^ 2 = (a * a + e * x) ^ 2 := by
        linear_combination H1 + (a ^ 2 - x ^ 2) * he2
      field_simp; linear_combination k
    have pos : 0 ≤ a + e * x / a := by
      have : a + e * x / a = (a * a + e * x) / a := by field_simp
      rw [this]; exact div_nonneg (by nlinarith) ha.le
    exact raz_eq (by rw [sub_neg_eq_add, sub_zero]; exact key) pos
  · have key : (x - e) ^ 2 + y ^ 2 = (a - e * x / a) ^ 2 := by
      have k : ((x - e) ^ 2 + y ^ 2) * a ^ 2 = (a * a - e * x) ^ 2 := by
        linear_combination H1 + (a ^ 2 - x ^ 2) * he2
      field_simp; linear_combination k
    have pos : 0 ≤ a - e * x / a := by
      have : a - e * x / a = (a * a - e * x) / a := by field_simp
      rw [this]; exact div_nonneg (by nlinarith) ha.le
    exact raz_eq (by rw [sub_zero]; exact key) pos

/-- Razlaga 1 in Povzetek: elipsa je množica točk z r₁ + r₂ = 2a: x²/a² + y²/b² = 1 natanko tedaj, ko je vsota
razdalj do gorišč (±e, 0), e = √(a² − b²), enaka 2a (0 < b ≤ a).
trditev: MAT-SS-3/elipsa-hiperbola-parabola#elipsa-definicija
besedilo: »Elipsa je množica točk z $r_1 + r_2 = 2a$.« -/
theorem elipsa_definicija {a b : ℝ} (ha : 0 < a) (hb : 0 < b) (hab : b ≤ a) (x y : ℝ) :
    x ^ 2 / a ^ 2 + y ^ 2 / b ^ 2 = 1 ↔
      raz x y (-Real.sqrt (a ^ 2 - b ^ 2)) 0 + raz x y (Real.sqrt (a ^ 2 - b ^ 2)) 0 = 2 * a := by
  constructor
  · intro h
    obtain ⟨h1, h2⟩ := elipsa_gorisci ha hb hab h
    rw [h1, h2]; ring
  · intro h
    set e := Real.sqrt (a ^ 2 - b ^ 2) with he
    have he2 : e ^ 2 = a ^ 2 - b ^ 2 := Real.sq_sqrt (by nlinarith)
    set r₁ := raz x y (-e) 0
    set r₂ := raz x y e 0
    have E1 : r₁ ^ 2 = (x + e) ^ 2 + y ^ 2 := by
      simp only [r₁, raz]; rw [Real.sq_sqrt (by positivity)]; ring
    have E2 : r₂ ^ 2 = (x - e) ^ 2 + y ^ 2 := by
      simp only [r₂, raz]; rw [Real.sq_sqrt (by positivity)]; ring
    have G : a * r₁ = a ^ 2 + e * x := by
      linear_combination (E1 - E2 - (r₁ - r₂ - 2 * a) * h) / 4
    have key : ((x + e) ^ 2 + y ^ 2) * a ^ 2 = (a * a + e * x) ^ 2 := by
      linear_combination (-a ^ 2) * E1 + (a * r₁ + a ^ 2 + e * x) * G
    have H1 : x ^ 2 * b ^ 2 + y ^ 2 * a ^ 2 = a ^ 2 * b ^ 2 := by
      linear_combination key - (a ^ 2 - x ^ 2) * he2
    have ha0 : a ≠ 0 := ha.ne'
    have hb0 : b ≠ 0 := hb.ne'
    field_simp; linear_combination H1

/-- Predpostavke `elipsa_gorisci` in `elipsa_definicija` se dajo izpolniti (a = 5, b = 3, teme (5, 0)). -/
example : (raz 5 0 (-Real.sqrt (5 ^ 2 - 3 ^ 2)) 0 = 5 + Real.sqrt (5 ^ 2 - 3 ^ 2) * 5 / 5 ∧
      raz 5 0 (Real.sqrt (5 ^ 2 - 3 ^ 2)) 0 = 5 - Real.sqrt (5 ^ 2 - 3 ^ 2) * 5 / 5) ∧
    raz 5 0 (-Real.sqrt (5 ^ 2 - 3 ^ 2)) 0 + raz 5 0 (Real.sqrt (5 ^ 2 - 3 ^ 2)) 0 = 2 * 5 :=
  ⟨elipsa_gorisci (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    (elipsa_definicija (by norm_num) (by norm_num) (by norm_num) 5 0).1 (by norm_num)⟩

/-- Razlaga 1 in ustno vprašanje 2: b² + e² = a² za e = √(a² − b²); teme (0, b) je od gorišča (e, 0) oddaljeno
a (pravokotni trikotnik s katetama b in e).
trditev: MAT-SS-3/elipsa-hiperbola-parabola#pitagora-elipsa
besedilo: »To teme, središče in gorišče tvorijo pravokotni trikotnik s katetama $b$ in $e$ ter hipotenuzo $a$, zato po Pitagorovem izreku velja $a^2 = b^2 + e^2$.« -/
theorem pitagora_elipsa {a b : ℝ} (ha : 0 < a) (hab : b ≤ a) (hb : 0 ≤ b) :
    b ^ 2 + Real.sqrt (a ^ 2 - b ^ 2) ^ 2 = a ^ 2 ∧ raz 0 b (Real.sqrt (a ^ 2 - b ^ 2)) 0 = a := by
  have he2 : Real.sqrt (a ^ 2 - b ^ 2) ^ 2 = a ^ 2 - b ^ 2 := Real.sq_sqrt (by nlinarith)
  exact ⟨by linarith, raz_eq (by rw [zero_sub, neg_sq, he2]; ring) ha.le⟩

/-- Predpostavke `pitagora_elipsa` se dajo izpolniti (a = 5, b = 3). -/
example : (3 : ℝ) ^ 2 + Real.sqrt (5 ^ 2 - 3 ^ 2) ^ 2 = 5 ^ 2 ∧ raz 0 3 (Real.sqrt (5 ^ 2 - 3 ^ 2)) 0 = 5 :=
  pitagora_elipsa (by norm_num) (by norm_num) (by norm_num)

/-- Razlaga 1 in Povzetek: numerična ekscentričnost ε = e/a elipse je med 0 in 1 (0 ≤ ε < 1). Trditev velja
že za vse a, b > 0 brez pogoja b ≤ a: v Leanu je √ negativnega števila 0, zato je pri b > a vrednost ε = 0.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#eps-elipsa
besedilo: »Kako sploščena je elipsa, pove **numerična ekscentričnost** $\varepsilon = \frac{e}{a}$, ki je pri elipsi med $0$ in $1$.« -/
theorem eps_elipsa {a b : ℝ} (ha : 0 < a) (hb : 0 < b) :
    0 ≤ Real.sqrt (a ^ 2 - b ^ 2) / a ∧ Real.sqrt (a ^ 2 - b ^ 2) / a < 1 := by
  refine ⟨div_nonneg (Real.sqrt_nonneg _) ha.le, ?_⟩
  rw [div_lt_one ha, Real.sqrt_lt' ha]; nlinarith

/-- Predpostavke `eps_elipsa` se dajo izpolniti (a = 5, b = 3). -/
example : 0 ≤ Real.sqrt (5 ^ 2 - 3 ^ 2) / 5 ∧ Real.sqrt ((5 : ℝ) ^ 2 - 3 ^ 2) / 5 < 1 :=
  eps_elipsa (by norm_num) (by norm_num)

/-- Razlaga 1, premisli, Povzetek: pri b = a je e = 0 in elipsa je krožnica x² + y² = a².
trditev: MAT-SS-3/elipsa-hiperbola-parabola#elipsa-kroznica
besedilo: »$$\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$$« -/
theorem elipsa_kroznica {a : ℝ} (ha : 0 < a) (x y : ℝ) :
    Real.sqrt (a ^ 2 - a ^ 2) = 0 ∧ (x ^ 2 / a ^ 2 + y ^ 2 / a ^ 2 = 1 ↔ x ^ 2 + y ^ 2 = a ^ 2) := by
  refine ⟨by simp, ?_⟩
  have : a ^ 2 ≠ 0 := by positivity
  rw [← add_div, div_eq_one_iff_eq this]

/-- Predpostavka `elipsa_kroznica` se da izpolniti (a = 1). -/
example : Real.sqrt ((1 : ℝ) ^ 2 - 1 ^ 2) = 0 ∧ ((0 : ℝ) ^ 2 / 1 ^ 2 + 1 ^ 2 / 1 ^ 2 = 1 ↔ (0 : ℝ) ^ 2 + 1 ^ 2 = 1 ^ 2) :=
  elipsa_kroznica one_pos 0 1

/-- Preveri se, vprašanje 3 (in premisli 1): pri stalnem a se z večanjem b ∈ (0, a] ekscentričnost
ε = √(a² − b²)/a manjša, v b = a je 0 in gre proti 0, ko gre b proti a.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#eps-pada
besedilo: »$e = \sqrt{a^2 - b^2}$ se z večjim $b$ manjša,« -/
theorem eps_pada {a : ℝ} (ha : 0 < a) :
    (∀ b₁ b₂, 0 < b₁ → b₁ < b₂ → b₂ ≤ a →
      Real.sqrt (a ^ 2 - b₂ ^ 2) / a < Real.sqrt (a ^ 2 - b₁ ^ 2) / a) ∧
    Real.sqrt (a ^ 2 - a ^ 2) / a = 0 ∧
    Tendsto (fun b => Real.sqrt (a ^ 2 - b ^ 2) / a) (𝓝[<] a) (𝓝 0) := by
  refine ⟨fun b₁ b₂ h1 h2 h3 => ?_, by simp, ?_⟩
  · apply div_lt_div_of_pos_right _ ha
    exact Real.sqrt_lt_sqrt (by nlinarith) (by nlinarith)
  · have : Tendsto (fun b => Real.sqrt (a ^ 2 - b ^ 2) / a) (𝓝 a) (𝓝 (Real.sqrt (a ^ 2 - a ^ 2) / a)) :=
      ((by fun_prop : Continuous fun b : ℝ => Real.sqrt (a ^ 2 - b ^ 2) / a).tendsto a)
    simp only [sub_self, Real.sqrt_zero, zero_div] at this
    exact this.mono_left nhdsWithin_le_nhds

/-- Predpostavka `eps_pada` se da izpolniti (a = 1). -/
example : Real.sqrt ((1 : ℝ) ^ 2 - 1 ^ 2) / 1 = 0 := (eps_pada one_pos).2.1

/-- Razlaga 1, tabela: za gorišči (±4, 0) so razdalje točk (5, 0), (0, 3), (4; 1,8), (−5, 0) 9 + 1, 5 + 5,
8,2 + 1,8, 1 + 9, vsota vedno 10; teme (5, 0) preverimo: 25/25 + 0 = 1.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#elipsa-tabela
besedilo: »| $(4;\; 1{,}8)$ | $8{,}2$ | $1{,}8$ | $10$ |« -/
theorem elipsa_tabela :
    (raz 5 0 (-4) 0 = 9 ∧ raz 5 0 4 0 = 1) ∧ (raz 0 3 (-4) 0 = 5 ∧ raz 0 3 4 0 = 5) ∧
    (raz 4 (18 / 10) (-4) 0 = 82 / 10 ∧ raz 4 (18 / 10) 4 0 = 18 / 10) ∧
    (raz (-5) 0 (-4) 0 = 1 ∧ raz (-5) 0 4 0 = 9) ∧
    (9 + 1 : ℝ) = 10 ∧ (5 + 5 : ℝ) = 10 ∧ (82 / 10 + 18 / 10 : ℝ) = 10 ∧ (1 + 9 : ℝ) = 10 ∧
    (25 : ℝ) / 25 + 0 = 1 := by
  refine ⟨⟨raz_eq (by norm_num) (by norm_num), raz_eq (by norm_num) (by norm_num)⟩,
    ⟨raz_eq (by norm_num) (by norm_num), raz_eq (by norm_num) (by norm_num)⟩,
    ⟨raz_eq (by norm_num) (by norm_num), raz_eq (by norm_num) (by norm_num)⟩,
    ⟨raz_eq (by norm_num) (by norm_num), raz_eq (by norm_num) (by norm_num)⟩,
    by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-! ## Razlaga 2: hiperbola -/

/-- Razlaga 2: na hiperboli x²/a² − y²/b² = 1 (a, b > 0, e = √(a² + b²)) je x² ≥ a², r₁ = |a + ex/a|,
r₂ = |a − ex/a|; na desni veji (x ≥ a) je r₁ − r₂ = 2a, na levi (x ≤ −a) r₁ − r₂ = −2a.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#hiperbola-gorisci
besedilo: »hiperbola, $\lvert r_1 - r_2\rvert = 2a$: $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$« -/
theorem hiperbola_gorisci {a b x y : ℝ} (ha : 0 < a) (hb : 0 < b)
    (h : x ^ 2 / a ^ 2 - y ^ 2 / b ^ 2 = 1) :
    a ^ 2 ≤ x ^ 2 ∧
    raz x y (-Real.sqrt (a ^ 2 + b ^ 2)) 0 = |a + Real.sqrt (a ^ 2 + b ^ 2) * x / a| ∧
    raz x y (Real.sqrt (a ^ 2 + b ^ 2)) 0 = |a - Real.sqrt (a ^ 2 + b ^ 2) * x / a| ∧
    (a ≤ x → raz x y (-Real.sqrt (a ^ 2 + b ^ 2)) 0 - raz x y (Real.sqrt (a ^ 2 + b ^ 2)) 0 = 2 * a) ∧
    (x ≤ -a → raz x y (-Real.sqrt (a ^ 2 + b ^ 2)) 0 - raz x y (Real.sqrt (a ^ 2 + b ^ 2)) 0 = -2 * a) := by
  set e := Real.sqrt (a ^ 2 + b ^ 2) with he
  have he2 : e ^ 2 = a ^ 2 + b ^ 2 := Real.sq_sqrt (by positivity)
  have he0 : 0 ≤ e := Real.sqrt_nonneg _
  have hea : a < e := by nlinarith
  have H1 : x ^ 2 * b ^ 2 - y ^ 2 * a ^ 2 = a ^ 2 * b ^ 2 := by
    have := h; field_simp at this; linarith
  have ha0 : a ≠ 0 := ha.ne'
  have hx : a ^ 2 ≤ x ^ 2 := by
    have : 0 ≤ y ^ 2 * a ^ 2 := by positivity
    have hb2 : 0 < b ^ 2 := by positivity
    by_contra hc; push Not at hc; nlinarith [mul_lt_mul_of_pos_right hc hb2]
  have r1 : raz x y (-e) 0 = |a + e * x / a| := by
    have k : ((x + e) ^ 2 + y ^ 2) * a ^ 2 = (a * a + e * x) ^ 2 := by
      linear_combination -H1 + (a ^ 2 - x ^ 2) * he2
    have key : (x - -e) ^ 2 + (y - 0) ^ 2 = (a + e * x / a) ^ 2 := by
      field_simp; linear_combination k
    rw [raz, key, Real.sqrt_sq_eq_abs]
  have r2 : raz x y e 0 = |a - e * x / a| := by
    have k : ((x - e) ^ 2 + y ^ 2) * a ^ 2 = (a * a - e * x) ^ 2 := by
      linear_combination -H1 + (a ^ 2 - x ^ 2) * he2
    have key : (x - e) ^ 2 + (y - 0) ^ 2 = (a - e * x / a) ^ 2 := by
      field_simp; linear_combination k
    rw [raz, key, Real.sqrt_sq_eq_abs]
  refine ⟨hx, r1, r2, fun hxa => ?_, fun hxa => ?_⟩
  · have hq : a < e * x / a := by rw [lt_div_iff₀ ha]; nlinarith
    rw [r1, r2, abs_of_pos (by linarith), abs_of_neg (by linarith)]; ring
  · have hq : e * x / a < -a := by rw [div_lt_iff₀ ha]; nlinarith
    rw [r1, r2, abs_of_neg (by linarith), abs_of_pos (by linarith)]; ring

/-- Razlaga 2, Povzetek, ustno vprašanje 1: hiperbola je množica točk z |r₁ − r₂| = 2a:
x²/a² − y²/b² = 1 natanko tedaj, ko je absolutna razlika razdalj do gorišč (±e, 0), e = √(a² + b²), enaka 2a.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#hiperbola-definicija
besedilo: »Če gorišči ležita na osi $x$ simetrično glede na izhodišče, je enačba hiperbole $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$, kjer je $e$ razdalja gorišča od središča in velja $e^2 = a^2 + b^2$.« -/
theorem hiperbola_definicija {a b : ℝ} (ha : 0 < a) (hb : 0 < b) (x y : ℝ) :
    x ^ 2 / a ^ 2 - y ^ 2 / b ^ 2 = 1 ↔
      |raz x y (-Real.sqrt (a ^ 2 + b ^ 2)) 0 - raz x y (Real.sqrt (a ^ 2 + b ^ 2)) 0| = 2 * a := by
  constructor
  · intro h
    obtain ⟨hx, -, -, hd, hl⟩ := hiperbola_gorisci ha hb h
    rcases le_or_gt a x with hxa | hxa
    · rw [hd hxa, abs_of_pos (by linarith)]
    · have : x ≤ -a := by nlinarith
      rw [hl this, abs_of_neg (by linarith)]; ring
  · intro h
    set e := Real.sqrt (a ^ 2 + b ^ 2) with he
    have he2 : e ^ 2 = a ^ 2 + b ^ 2 := Real.sq_sqrt (by positivity)
    set r₁ := raz x y (-e) 0
    set r₂ := raz x y e 0
    have E1 : r₁ ^ 2 = (x + e) ^ 2 + y ^ 2 := by
      simp only [r₁, raz]; rw [Real.sq_sqrt (by positivity)]; ring
    have E2 : r₂ ^ 2 = (x - e) ^ 2 + y ^ 2 := by
      simp only [r₂, raz]; rw [Real.sq_sqrt (by positivity)]; ring
    have key : ((x + e) ^ 2 + y ^ 2) * a ^ 2 = (a * a + e * x) ^ 2 := by
      rcases abs_eq (by linarith : (0 : ℝ) ≤ 2 * a) |>.1 h with E3 | E3
      · have G : a * r₁ = a ^ 2 + e * x := by
          linear_combination (E1 - E2 - (r₁ + r₂ - 2 * a) * E3) / 4
        linear_combination (-a ^ 2) * E1 + (a * r₁ + a ^ 2 + e * x) * G
      · have G : a * r₁ = -(a ^ 2 + e * x) := by
          linear_combination -(E1 - E2 - (r₁ + r₂ + 2 * a) * E3) / 4
        linear_combination (-a ^ 2) * E1 + (a * r₁ - a ^ 2 - e * x) * G
    have H1 : x ^ 2 * b ^ 2 - y ^ 2 * a ^ 2 = a ^ 2 * b ^ 2 := by
      linear_combination -key + (a ^ 2 - x ^ 2) * he2
    have ha0 : a ≠ 0 := ha.ne'
    have hb0 : b ≠ 0 := hb.ne'
    field_simp; linear_combination H1

/-- Predpostavke `hiperbola_gorisci` in `hiperbola_definicija` se dajo izpolniti (a = 4, b = 3, teme (4, 0)). -/
example := hiperbola_gorisci (a := 4) (b := 3) (x := 4) (y := 0) (by norm_num) (by norm_num) (by norm_num)

/-- Predpostavke `hiperbola_definicija` se dajo izpolniti (a = 4, b = 3, teme (4, 0)). -/
example : |raz 4 0 (-Real.sqrt (4 ^ 2 + 3 ^ 2)) 0 - raz 4 0 (Real.sqrt (4 ^ 2 + 3 ^ 2)) 0| = 2 * 4 :=
  (hiperbola_definicija (by norm_num) (by norm_num) 4 0).1 (by norm_num)

/-- Razlaga 2, premisli: za vsako točko T sta trikotniški neenakosti |F₁F₂| ≤ r₁ + r₂ in |r₁ − r₂| ≤ |F₁F₂|
(gorišči (±e, 0), |F₁F₂| = 2e); pri elipsi z b > 0 je e < a, pri hiperboli z b > 0 je e > a.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#premisli-trikotnik
besedilo: »V trikotniku $F_1 T F_2$ je vsaka stranica krajša od vsote drugih dveh in daljša od njune razlike. Pri elipsi je zato $2a = r_1 + r_2 > 2e$. Pri hiperboli je $2a = |r_1 - r_2| < 2e$.« -/
theorem premisli_trikotnik (x y e : ℝ) (he : 0 ≤ e) :
    2 * e ≤ raz x y (-e) 0 + raz x y e 0 ∧ |raz x y (-e) 0 - raz x y e 0| ≤ 2 * e := by
  have d : dist (!₂[-e, (0 : ℝ)]) (!₂[e, 0]) = 2 * e := by
    rw [raz_dist]; exact raz_eq (by ring) (by linarith)
  constructor
  · have := dist_triangle (!₂[-e, (0 : ℝ)]) (!₂[x, y]) (!₂[e, 0])
    rw [d, dist_comm, raz_dist, raz_dist] at this; exact this
  · have := abs_dist_sub_le (!₂[-e, (0 : ℝ)]) (!₂[e, 0]) (!₂[x, y])
    rw [dist_comm (!₂[-e, (0 : ℝ)]) (!₂[x, y]), dist_comm (!₂[e, (0 : ℝ)]) (!₂[x, y]), raz_dist, raz_dist,
      d] at this
    exact this

/-- Predpostavka `premisli_trikotnik` se da izpolniti (e = 4). -/
example : 2 * 4 ≤ raz 0 3 (-4) 0 + raz 0 3 4 0 := (premisli_trikotnik 0 3 4 (by norm_num)).1

/-- Razlaga 2, premisli (strogo): pri elipsi (0 < b ≤ a) je e = √(a² − b²) < a, pri hiperboli (a, b > 0) je
e = √(a² + b²) > a. Prvi del velja že za vse a, b > 0 brez pogoja b ≤ a (v Leanu je √ negativnega števila 0).
trditev: MAT-SS-3/elipsa-hiperbola-parabola#premisli-e
besedilo: »$e = \sqrt{a^2 + b^2}$« -/
theorem premisli_e (a b : ℝ) (ha : 0 < a) (hb : 0 < b) :
    Real.sqrt (a ^ 2 - b ^ 2) < a ∧ a < Real.sqrt (a ^ 2 + b ^ 2) := by
  constructor
  · rw [Real.sqrt_lt' ha]; nlinarith
  · rw [Real.lt_sqrt ha.le]; nlinarith

/-- Predpostavke `premisli_e` se dajo izpolniti (a = 5, b = 3). -/
example : Real.sqrt ((5 : ℝ) ^ 2 - 3 ^ 2) < 5 ∧ (5 : ℝ) < Real.sqrt (5 ^ 2 + 3 ^ 2) :=
  premisli_e 5 3 (by norm_num) (by norm_num)

/-- Razlaga 2, tabela: za gorišči (±5, 0) imajo (4, 0), (5; 2,25), (8, √27) razdalje 9 in 1, 10,25 in 2,25,
14 in 6 (razlika 8); a = 4, b = √(25 − 16) = 3.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#hiperbola-tabela
besedilo: »| $(5; 2{,}25)$ | $10{,}25$ | $2{,}25$ | $8$ |« -/
theorem hiperbola_tabela :
    (raz 4 0 (-5) 0 = 9 ∧ raz 4 0 5 0 = 1) ∧
    (raz 5 (225 / 100) (-5) 0 = 1025 / 100 ∧ raz 5 (225 / 100) 5 0 = 225 / 100) ∧
    (raz 8 (Real.sqrt 27) (-5) 0 = 14 ∧ raz 8 (Real.sqrt 27) 5 0 = 6) ∧
    (9 - 1 : ℝ) = 8 ∧ (1025 / 100 - 225 / 100 : ℝ) = 8 ∧ (14 - 6 : ℝ) = 8 ∧ Real.sqrt (25 - 16) = 3 := by
  have s : Real.sqrt 27 ^ 2 = 27 := Real.sq_sqrt (by norm_num)
  refine ⟨⟨raz_eq (by norm_num) (by norm_num), raz_eq (by norm_num) (by norm_num)⟩,
    ⟨raz_eq (by norm_num) (by norm_num), raz_eq (by norm_num) (by norm_num)⟩,
    ⟨raz_eq (by rw [sub_zero, s]; norm_num) (by norm_num), raz_eq (by rw [sub_zero, s]; norm_num) (by norm_num)⟩,
    by norm_num, by norm_num, by norm_num, ?_⟩
  rw [show (25 : ℝ) - 16 = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Razlaga 2: veja y = (b/a)√(x² − a²) (x ≥ a) leži na hiperboli in se bliža asimptoti y = (b/a)x:
razlika (b/a)x − (b/a)√(x² − a²) gre proti 0 (a, b > 0); oglišče (a, b) pravokotnika leži na asimptoti.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#asimptota
besedilo: »Veji se oddaljujeta in se vse bolj približujeta dvema premicama skozi središče, **asimptotama** $y = \pm \frac{b}{a} x$. Narišeš ju kot diagonali pravokotnika s stranicama $2a$ in $2b$ okoli središča. Enačba hiperbole je« -/
theorem asimptota {a b : ℝ} (ha : 0 < a) (hb : 0 < b) :
    (∀ x, a ≤ x → x ^ 2 / a ^ 2 - (b / a * Real.sqrt (x ^ 2 - a ^ 2)) ^ 2 / b ^ 2 = 1) ∧
    Tendsto (fun x => b / a * x - b / a * Real.sqrt (x ^ 2 - a ^ 2)) atTop (𝓝 0) ∧ b = b / a * a := by
  refine ⟨fun x hx => ?_, ?_, by field_simp⟩
  · have hs : Real.sqrt (x ^ 2 - a ^ 2) ^ 2 = x ^ 2 - a ^ 2 := Real.sq_sqrt (by nlinarith)
    rw [mul_pow, hs]; field_simp; ring
  · have up : Tendsto (fun x : ℝ => b / a * (a ^ 2 / x)) atTop (𝓝 0) := by
      have := (tendsto_const_nhds (x := a ^ 2)).div_atTop tendsto_id
      simpa using this.const_mul (b / a)
    refine tendsto_of_tendsto_of_tendsto_of_le_of_le' tendsto_const_nhds up ?_ ?_
    · filter_upwards [eventually_ge_atTop a] with x hx
      have hs0 := Real.sqrt_nonneg (x ^ 2 - a ^ 2)
      have hs : Real.sqrt (x ^ 2 - a ^ 2) ^ 2 = x ^ 2 - a ^ 2 := Real.sq_sqrt (by nlinarith)
      have : Real.sqrt (x ^ 2 - a ^ 2) ≤ x := by nlinarith
      have : 0 ≤ b / a := by positivity
      nlinarith
    · filter_upwards [eventually_ge_atTop a] with x hx
      have hx0 : 0 < x := by linarith
      have hs0 := Real.sqrt_nonneg (x ^ 2 - a ^ 2)
      have hs : Real.sqrt (x ^ 2 - a ^ 2) ^ 2 = x ^ 2 - a ^ 2 := Real.sq_sqrt (by nlinarith)
      have hle : Real.sqrt (x ^ 2 - a ^ 2) ≤ x := by nlinarith
      have h1 : x - Real.sqrt (x ^ 2 - a ^ 2) ≤ a ^ 2 / x := by
        rw [le_div_iff₀ hx0]; nlinarith
      have : 0 ≤ b / a := by positivity
      calc b / a * x - b / a * Real.sqrt (x ^ 2 - a ^ 2) = b / a * (x - Real.sqrt (x ^ 2 - a ^ 2)) := by ring
        _ ≤ b / a * (a ^ 2 / x) := mul_le_mul_of_nonneg_left h1 this

/-- Predpostavke `asimptota` se dajo izpolniti (a = 4, b = 3). -/
example : Tendsto (fun x => 3 / 4 * x - 3 / 4 * Real.sqrt (x ^ 2 - 4 ^ 2)) atTop (𝓝 (0 : ℝ)) :=
  (asimptota (by norm_num : (0 : ℝ) < 4) (by norm_num : (0 : ℝ) < 3)).2.1

/-- Razlaga 2: tudi ostale tri veje se bližajo asimptotama: spodnja desna y = −(b/a)√(x² − a²) asimptoti
y = −(b/a)x za x → ∞, leva zgornja y = (b/a)√(x² − a²) asimptoti y = −(b/a)x in leva spodnja
y = −(b/a)√(x² − a²) asimptoti y = (b/a)x za x → −∞ (a, b > 0).
trditev: MAT-SS-3/elipsa-hiperbola-parabola#asimptota-veje
besedilo: »$\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$, $e = \sqrt{a^2 + b^2}$, asimptoti $y = \pm \frac{b}{a} x$« -/
theorem asimptota_veje {a b : ℝ} (ha : 0 < a) (hb : 0 < b) :
    Tendsto (fun x => b / a * x - b / a * Real.sqrt (x ^ 2 - a ^ 2)) atTop (𝓝 0) ∧
    Tendsto (fun x => -(b / a) * x - (-(b / a) * Real.sqrt (x ^ 2 - a ^ 2))) atTop (𝓝 0) ∧
    Tendsto (fun x => -(b / a) * x - b / a * Real.sqrt (x ^ 2 - a ^ 2)) atBot (𝓝 0) ∧
    Tendsto (fun x => b / a * x - (-(b / a) * Real.sqrt (x ^ 2 - a ^ 2))) atBot (𝓝 0) := by
  have h := (asimptota ha hb).2.1
  have hn : Tendsto (fun x => -(b / a * x - b / a * Real.sqrt (x ^ 2 - a ^ 2))) atTop (𝓝 0) := by
    simpa using h.neg
  have hl := h.comp tendsto_neg_atBot_atTop
  have hln := hn.comp tendsto_neg_atBot_atTop
  refine ⟨h, ?_, ?_, ?_⟩
  · refine hn.congr fun x => ?_; ring
  · refine hl.congr fun x => ?_; simp only [Function.comp, neg_sq]; ring
  · refine hln.congr fun x => ?_; simp only [Function.comp, neg_sq]; ring

/-- Predpostavke `asimptota_veje` se dajo izpolniti (a = 4, b = 3). -/
example := asimptota_veje (by norm_num : (0 : ℝ) < 4) (by norm_num : (0 : ℝ) < 3)

/-- Razlaga 2 in 5, Povzetek: y = 12/x je xy = 12 (x ≠ 0), po zasuku za 45° (u = (x + y)/√2, v = (x − y)/√2)
hiperbola u²/24 − v²/24 = 1; koordinatni osi sta asimptoti (12/x → 0 v ±∞, 12/x → +∞ za x → 0⁺).
trditev: MAT-SS-3/elipsa-hiperbola-parabola#hiperbola-12
besedilo: »Graf funkcije $y = \frac{12}{x}$ iz racionalnih funkcij je tudi hiperbola, le zasukana: asimptoti sta koordinatni osi.« -/
theorem hiperbola_12 :
    (∀ x y : ℝ, x ≠ 0 → (y = 12 / x ↔ x * y = 12)) ∧
    (∀ x y : ℝ, x * y = 12 ↔ ((x + y) / Real.sqrt 2) ^ 2 / 24 - ((x - y) / Real.sqrt 2) ^ 2 / 24 = 1) ∧
    Tendsto (fun x : ℝ => 12 / x) atTop (𝓝 0) ∧ Tendsto (fun x : ℝ => 12 / x) atBot (𝓝 0) ∧
    Tendsto (fun x : ℝ => 12 / x) (𝓝[>] 0) atTop := by
  have s : Real.sqrt 2 ^ 2 = 2 := Real.sq_sqrt (by norm_num)
  refine ⟨fun x y hx => ⟨fun h => by rw [h]; field_simp, fun h => by field_simp; linarith⟩,
    fun x y => ?_, tendsto_const_nhds.div_atTop tendsto_id, tendsto_const_nhds.div_atBot tendsto_id, ?_⟩
  · rw [div_pow, div_pow, s]
    constructor
    · intro h; linear_combination h / 12
    · intro h; linear_combination 12 * h
  · simpa [div_eq_mul_inv] using tendsto_inv_nhdsGT_zero.const_mul_atTop (by norm_num : (0 : ℝ) < 12)

/-! ## Razlaga 3: parabola -/

/-- Pomožna: točka je enako oddaljena od (u, v) in od premice z »razdaljo« |d| natanko tedaj, ko velja
(x − u)² + (y − v)² = d².
pomozno -/
theorem enako_oddaljena (x y u v d : ℝ) : raz x y u v = |d| ↔ (x - u) ^ 2 + (y - v) ^ 2 = d ^ 2 := by
  rw [raz, ← Real.sqrt_sq_eq_abs, Real.sqrt_inj (by positivity) (sq_nonneg _)]

/-- Razlaga 3 in Povzetek: y² = 2px natanko tedaj, ko je točka enako oddaljena od gorišča (p/2, 0) in od vodnice
x = −p/2 (razdalja do vodnice je |x + p/2|).
trditev: MAT-SS-3/elipsa-hiperbola-parabola#parabola-definicija
besedilo: »$y^2 = 2px$: gorišče $\left(\frac{p}{2}, 0\right)$, vodnica $x = -\frac{p}{2}$ (priloga)« -/
theorem parabola_definicija (p x y : ℝ) : y ^ 2 = 2 * p * x ↔ raz x y (p / 2) 0 = |x + p / 2| := by
  rw [enako_oddaljena]; constructor <;> intro h <;> linear_combination h

/-- Razlaga 3, tabela smeri: y² = −2px ima gorišče (−p/2, 0) in vodnico x = p/2; x² = 2py gorišče (0, p/2) in
vodnico y = −p/2; x² = −2py gorišče (0, −p/2) in vodnico y = p/2.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#parabola-smeri
besedilo: »Graf $y = -\frac{x^2}{8}$ zapišemo kot $x^2 = -8y$: parabola je odprta navzdol, $2p = 8$, torej $p = 4$. Gorišče je $(0, -2)$, vodnica $y = 2$. Preizkus s točko $(4, -2)$: do gorišča je $4$, do vodnice $2 - (-2) = 4$.« -/
theorem parabola_smeri (p x y : ℝ) :
    (y ^ 2 = -2 * p * x ↔ raz x y (-p / 2) 0 = |x - p / 2|) ∧
    (x ^ 2 = 2 * p * y ↔ raz x y 0 (p / 2) = |y + p / 2|) ∧
    (x ^ 2 = -2 * p * y ↔ raz x y 0 (-p / 2) = |y - p / 2|) := by
  refine ⟨?_, ?_, ?_⟩ <;> rw [enako_oddaljena] <;> constructor <;> intro h <;> linear_combination h

/-- Razlaga 3: teme (0, 0) je na sredi med goriščem (p/2, 0) in vodnico x = −p/2; razdalja gorišča od vodnice
je p (p > 0).
trditev: MAT-SS-3/elipsa-hiperbola-parabola#parabola-teme
besedilo: »Točka $(0, 0)$ je **teme**, točno na sredi med goriščem in vodnico. Razdaljo med goriščem in vodnico označimo s $p$. Gorišče je v točki $\left(\frac{p}{2}, 0\right)$, vodnica je premica $x = -\frac{p}{2}$. Enačba parabole z osjo na osi $x$ je« -/
theorem parabola_teme (p : ℝ) (hp : 0 < p) : (p / 2 + -p / 2) / 2 = 0 ∧ |p / 2 - -p / 2| = p := by
  refine ⟨by ring, ?_⟩
  rw [show p / 2 - -p / 2 = p by ring, abs_of_pos hp]

/-- Predpostavka `parabola_teme` se da izpolniti (p = 2). -/
example : ((2 : ℝ) / 2 + -2 / 2) / 2 = 0 ∧ |(2 : ℝ) / 2 - -2 / 2| = 2 := parabola_teme 2 (by norm_num)

/-- Razlaga 3, tabela (p = 2, y² = 4x): (0, 0), (1, 2), (4, 4), (9, 6) so od F(1, 0) in od vodnice x = −1
oddaljene 1, 2, 5, 10 in ležijo na y² = 4x.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#parabola-tabela
besedilo: »V tabeli je $p = 2$, zato velja $y^2 = 4x$.« -/
theorem parabola_tabela :
    (raz 0 0 1 0 = 1 ∧ |(0 : ℝ) - -1| = 1) ∧ (raz 1 2 1 0 = 2 ∧ |(1 : ℝ) - -1| = 2) ∧
    (raz 4 4 1 0 = 5 ∧ |(4 : ℝ) - -1| = 5) ∧ (raz 9 6 1 0 = 10 ∧ |(9 : ℝ) - -1| = 10) ∧
    (0 : ℝ) ^ 2 = 4 * 0 ∧ (2 : ℝ) ^ 2 = 4 * 1 ∧ (4 : ℝ) ^ 2 = 4 * 4 ∧ (6 : ℝ) ^ 2 = 4 * 9 ∧
    (2 : ℝ) / 2 = 1 := by
  refine ⟨⟨raz_eq (by norm_num) (by norm_num), by norm_num⟩, ⟨raz_eq (by norm_num) (by norm_num), by norm_num⟩,
    ⟨raz_eq (by norm_num) (by norm_num), by norm_num⟩, ⟨raz_eq (by norm_num) (by norm_num), by norm_num⟩,
    by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Razlaga 3: zasukana parabola x² = 2py je graf y = x²/(2p) (p > 0).
trditev: MAT-SS-3/elipsa-hiperbola-parabola#parabola-graf
besedilo: »Če parabolo zasučeš, da je os navpična, dobiš $x^2 = 2py$, torej znani graf kvadratne funkcije $y = \frac{x^2}{2p}$.« -/
theorem parabola_graf (p x y : ℝ) (hp : 0 < p) : x ^ 2 = 2 * p * y ↔ y = x ^ 2 / (2 * p) := by
  rw [eq_div_iff (by positivity)]; constructor <;> intro h <;> linarith

/-- Predpostavka `parabola_graf` se da izpolniti (p = 2, točka (2, 1)). -/
example : (2 : ℝ) ^ 2 = 2 * 2 * 1 ↔ (1 : ℝ) = 2 ^ 2 / (2 * 2) := parabola_graf 2 2 1 (by norm_num)

/-- Razlaga 3: y = −x²/8 je x² = −8y (2p = 8, p = 4), gorišče (0, −2), vodnica y = 2; preizkus (4, −2): do gorišča
4, do vodnice 2 − (−2) = 4 (RACUN vrednost).
trditev: MAT-SS-3/elipsa-hiperbola-parabola#parabola-navzdol
besedilo: »Graf $y = -\frac{x^2}{8}$ zapišemo kot $x^2 = -8y$: parabola je odprta navzdol, $2p = 8$, torej $p = 4$. Gorišče je $(0, -2)$, vodnica $y = 2$. Preizkus s točko $(4, -2)$: do gorišča je $4$, do vodnice $2 - (-2) = 4$.« -/
theorem parabola_navzdol (x y : ℝ) : (y = -x ^ 2 / 8 ↔ x ^ 2 = -8 * y) ∧ (8 : ℝ) / 2 = 4 ∧ -(4 : ℝ) / 2 = -2 ∧
    (x ^ 2 = -2 * 4 * y ↔ raz x y 0 (-4 / 2) = |y - 4 / 2|) ∧ raz 4 (-2) 0 (-2) = 4 ∧ (2 : ℝ) - -2 = 4 ∧
    Real.sqrt (4 ^ 2 + (-2 + 2) ^ 2) = 4 := by
  refine ⟨⟨fun h => by rw [h]; ring, fun h => by linarith⟩, by norm_num, by norm_num,
    (parabola_smeri 4 x y).2.2, raz_eq (by norm_num) (by norm_num), by norm_num, ?_⟩
  rw [show (4 : ℝ) ^ 2 + (-2 + 2) ^ 2 = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-! ## Razlaga 5: krivulje drugega reda -/

/-- Razlaga 5: primeri 4x² + 9y² − 36 = 0 (elipsa x²/9 + y²/4 = 1), 9x² − 16y² − 144 = 0 (hiperbola
x²/16 − y²/9 = 1), y² − 4x = 0 (parabola y² = 2·2·x), x² + y² + 4 = 0 (nobena točka), x² + y² = 0 (le (0, 0)),
x² − y² = 0 (premici y = ±x).
trditev: MAT-SS-3/elipsa-hiperbola-parabola#drugi-red
besedilo: »elipsa (na primer $4x^2 + 9y^2 - 36 = 0$),« -/
theorem drugi_red (x y : ℝ) :
    (4 * x ^ 2 + 9 * y ^ 2 - 36 = 0 ↔ x ^ 2 / 9 + y ^ 2 / 4 = 1) ∧
    (9 * x ^ 2 - 16 * y ^ 2 - 144 = 0 ↔ x ^ 2 / 16 - y ^ 2 / 9 = 1) ∧
    (y ^ 2 - 4 * x = 0 ↔ y ^ 2 = 2 * 2 * x) ∧ x ^ 2 + y ^ 2 + 4 ≠ 0 ∧
    (x ^ 2 + y ^ 2 = 0 ↔ x = 0 ∧ y = 0) ∧ (x ^ 2 - y ^ 2 = 0 ↔ y = x ∨ y = -x) := by
  refine ⟨⟨fun h => by linear_combination h / 36, fun h => by linear_combination 36 * h⟩,
    ⟨fun h => by linear_combination h / 144, fun h => by linear_combination 144 * h⟩,
    ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩,
    fun h => by nlinarith [sq_nonneg x, sq_nonneg y], ⟨fun h => ⟨by nlinarith [sq_nonneg x, sq_nonneg y],
      by nlinarith [sq_nonneg x, sq_nonneg y]⟩, fun ⟨a, b⟩ => by rw [a, b]; norm_num⟩, ?_⟩
  rw [show x ^ 2 - y ^ 2 = (y - x) * (-(y + x)) by ring, mul_eq_zero, neg_eq_zero, sub_eq_zero,
    add_eq_zero_iff_eq_neg]

/-! ## Razlaga 6: konstrukcija s šestilom -/

/-- Razlaga 6 (elipsa): za a − e < r < a + e (0 < b < a, e = √(a² − b²)) se loka okoli F₁ s polmerom r in okoli
F₂ s polmerom 2a − r sekata v dveh različnih točkah elipse.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#konstrukcija-elipsa
besedilo: »Elipsa (gorišči $F_1$, $F_2$, vsota $2a$): izberi polmer $r$ med $a - e$ in $a + e$. Loka okoli $F_1$ s polmerom $r$ in okoli $F_2$ s polmerom $2a - r$ se sekata v dveh točkah elipse.« -/
theorem konstrukcija_elipsa {a b r : ℝ} (ha : 0 < a) (hb : 0 < b) (hab : b < a)
    (h1 : a - Real.sqrt (a ^ 2 - b ^ 2) < r) (h2 : r < a + Real.sqrt (a ^ 2 - b ^ 2)) :
    ∃ x y₁ y₂, y₁ ≠ y₂ ∧ ∀ y ∈ ({y₁, y₂} : Set ℝ), x ^ 2 / a ^ 2 + y ^ 2 / b ^ 2 = 1 ∧
      raz x y (-Real.sqrt (a ^ 2 - b ^ 2)) 0 = r ∧ raz x y (Real.sqrt (a ^ 2 - b ^ 2)) 0 = 2 * a - r := by
  set e := Real.sqrt (a ^ 2 - b ^ 2) with he
  have he2 : e ^ 2 = a ^ 2 - b ^ 2 := Real.sq_sqrt (by nlinarith)
  have he0 : 0 < e := Real.sqrt_pos.2 (by nlinarith)
  have hq : 0 < 1 - (r - a) ^ 2 / e ^ 2 := by
    rw [sub_pos, div_lt_one (by positivity)]; nlinarith
  set x := a * (r - a) / e
  set y₀ := b * Real.sqrt (1 - (r - a) ^ 2 / e ^ 2)
  have hy0 : 0 < y₀ := mul_pos hb (Real.sqrt_pos.2 hq)
  refine ⟨x, y₀, -y₀, by linarith, fun y hy => ?_⟩
  have hy2 : y ^ 2 = b ^ 2 * (1 - (r - a) ^ 2 / e ^ 2) := by
    rcases hy with rfl | hy
    · rw [mul_pow, Real.sq_sqrt hq.le]
    · rw [Set.mem_singleton_iff] at hy; rw [hy, neg_sq, mul_pow, Real.sq_sqrt hq.le]
  have hel : x ^ 2 / a ^ 2 + y ^ 2 / b ^ 2 = 1 := by
    rw [hy2]; simp only [x]; field_simp; ring
  obtain ⟨g1, g2⟩ := elipsa_gorisci ha hb hab.le hel
  refine ⟨hel, ?_, ?_⟩
  · rw [g1]; simp only [x]; field_simp; ring
  · rw [g2]; simp only [x]; field_simp; ring

/-- Predpostavke `konstrukcija_elipsa` se dajo izpolniti (a = 5, b = 3, e = 4, r = 3). -/
example := by
  have s : Real.sqrt ((5 : ℝ) ^ 2 - 3 ^ 2) = 4 := by
    rw [show (5 : ℝ) ^ 2 - 3 ^ 2 = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  exact konstrukcija_elipsa (a := 5) (b := 3) (r := 3) (by norm_num) (by norm_num) (by norm_num)
    (by rw [s]; norm_num) (by rw [s]; norm_num)

/-- Razlaga 6 (hiperbola): za r > e − a (a, b > 0, e = √(a² + b²)) loka okoli F₂ s polmerom r in okoli F₁ s
polmerom r + 2a dasta dve različni točki desne veje.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#konstrukcija-hiperbola
besedilo: »Hiperbola (razlika $2a$): izberi $r > e - a$. Loka okoli $F_2$ s polmerom $r$ in okoli $F_1$ s polmerom $r + 2a$ dasta dve točki desne veje. Z zamenjanima goriščema dobiš levo vejo.« -/
theorem konstrukcija_hiperbola {a b r : ℝ} (ha : 0 < a) (hb : 0 < b) (hr : Real.sqrt (a ^ 2 + b ^ 2) - a < r) :
    ∃ x y₁ y₂, y₁ ≠ y₂ ∧ a < x ∧ ∀ y ∈ ({y₁, y₂} : Set ℝ), x ^ 2 / a ^ 2 - y ^ 2 / b ^ 2 = 1 ∧
      raz x y (Real.sqrt (a ^ 2 + b ^ 2)) 0 = r ∧ raz x y (-Real.sqrt (a ^ 2 + b ^ 2)) 0 = r + 2 * a := by
  set e := Real.sqrt (a ^ 2 + b ^ 2) with he
  have he2 : e ^ 2 = a ^ 2 + b ^ 2 := Real.sq_sqrt (by positivity)
  have hea : a < e := by rw [he, Real.lt_sqrt ha.le]; nlinarith
  have he0 : 0 < e := by linarith
  set x := a * (r + a) / e
  have hxa : a < x := by simp only [x]; rw [lt_div_iff₀ he0]; nlinarith
  have hq : 0 < x ^ 2 / a ^ 2 - 1 := by
    rw [sub_pos, one_lt_div (by positivity)]; nlinarith
  set y₀ := b * Real.sqrt (x ^ 2 / a ^ 2 - 1)
  have hy0 : 0 < y₀ := mul_pos hb (Real.sqrt_pos.2 hq)
  refine ⟨x, y₀, -y₀, by linarith, hxa, fun y hy => ?_⟩
  have hy2 : y ^ 2 = b ^ 2 * (x ^ 2 / a ^ 2 - 1) := by
    rcases hy with rfl | hy
    · rw [mul_pow, Real.sq_sqrt hq.le]
    · rw [Set.mem_singleton_iff] at hy; rw [hy, neg_sq, mul_pow, Real.sq_sqrt hq.le]
  have hh : x ^ 2 / a ^ 2 - y ^ 2 / b ^ 2 = 1 := by
    rw [hy2]; field_simp; ring
  obtain ⟨-, g1, g2, -, -⟩ := hiperbola_gorisci ha hb hh
  have ex : e * x / a = r + a := by simp only [x]; field_simp
  refine ⟨hh, ?_, ?_⟩
  · rw [g2, ex, show a - (r + a) = -r by ring, abs_neg, abs_of_pos (by linarith)]
  · rw [g1, ex, abs_of_pos (by linarith)]; ring

/-- Predpostavke `konstrukcija_hiperbola` se dajo izpolniti (a = 4, b = 3, e = 5, r = 6; Primer 5). -/
example := konstrukcija_hiperbola (a := 4) (b := 3) (r := 6) (by norm_num) (by norm_num) (by
  rw [show (4 : ℝ) ^ 2 + 3 ^ 2 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]; norm_num)

/-- Razlaga 6 (parabola): vzporednica vodnice x = −p/2 na razdalji r > p/2 (premica x = r − p/2) in lok okoli F
s polmerom r se sekata v dveh različnih točkah parabole y² = 2px (p > 0).
trditev: MAT-SS-3/elipsa-hiperbola-parabola#konstrukcija-parabola
besedilo: »Parabola (gorišče $F$, vodnica): na strani gorišča nariši vzporednico vodnice na razdalji $r > \frac{p}{2}$. Lok okoli $F$ s polmerom $r$ jo seka v dveh točkah parabole.« -/
theorem konstrukcija_parabola {p r : ℝ} (hp : 0 < p) (hr : p / 2 < r) :
    ∃ y₁ y₂, y₁ ≠ y₂ ∧ ∀ y ∈ ({y₁, y₂} : Set ℝ), y ^ 2 = 2 * p * (r - p / 2) ∧
      raz (r - p / 2) y (p / 2) 0 = r ∧ |(r - p / 2) - -p / 2| = r := by
  have hq : 0 < 2 * p * (r - p / 2) := by nlinarith
  refine ⟨Real.sqrt (2 * p * (r - p / 2)), -Real.sqrt (2 * p * (r - p / 2)),
    by have := Real.sqrt_pos.2 hq; linarith, fun y hy => ?_⟩
  have hy2 : y ^ 2 = 2 * p * (r - p / 2) := by
    rcases hy with rfl | hy
    · rw [Real.sq_sqrt hq.le]
    · rw [Set.mem_singleton_iff] at hy; rw [hy, neg_sq, Real.sq_sqrt hq.le]
  have hd : |(r - p / 2) - -p / 2| = r := by
    rw [show r - p / 2 - -p / 2 = r by ring, abs_of_pos (by linarith)]
  refine ⟨hy2, ?_, hd⟩
  rw [(parabola_definicija p _ y).1 hy2, show r - p / 2 + p / 2 = r by ring, abs_of_pos (by linarith)]

/-- Predpostavke `konstrukcija_parabola` se dajo izpolniti (p = 2, r = 2). -/
example : ∃ y₁ y₂ : ℝ, y₁ ≠ y₂ ∧ ∀ y ∈ ({y₁, y₂} : Set ℝ), y ^ 2 = 2 * 2 * (2 - 2 / 2) ∧
    raz (2 - 2 / 2) y (2 / 2) 0 = 2 ∧ |((2 : ℝ) - 2 / 2) - -2 / 2| = 2 :=
  konstrukcija_parabola (by norm_num) (by norm_num)

/-! ## Rešeni primeri -/

/-- Primer 1: a = √25 = 5, b = √9 = 3; temena (±5, 0), (0, ±3) ležijo na elipsi; e = √(25 − 9) = 4, gorišči (±4, 0),
ε = 4/5 = 0,8; elipsa je množica točk z vsoto razdalj do (±4, 0) enako 10.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#primer1
besedilo: »Odgovor: $a = 5$, $b = 3$, gorišči $(\pm 4, 0)$, $\varepsilon = 0{,}8$. To je elipsa iz tabele v razlagi.« -/
theorem primer1 : Real.sqrt 25 = 5 ∧ Real.sqrt 9 = 3 ∧
    ((5 : ℝ) ^ 2 / 25 + 0 ^ 2 / 9 = 1 ∧ (-5 : ℝ) ^ 2 / 25 + 0 ^ 2 / 9 = 1 ∧
      (0 : ℝ) ^ 2 / 25 + 3 ^ 2 / 9 = 1 ∧ (0 : ℝ) ^ 2 / 25 + (-3) ^ 2 / 9 = 1) ∧
    Real.sqrt (25 - 9) = 4 ∧ (4 : ℝ) / 5 = 8 / 10 ∧
    ∀ x y : ℝ, x ^ 2 / 25 + y ^ 2 / 9 = 1 ↔ raz x y (-4) 0 + raz x y 4 0 = 10 := by
  have s4 : Real.sqrt ((5 : ℝ) ^ 2 - 3 ^ 2) = 4 := by
    rw [show (5 : ℝ) ^ 2 - 3 ^ 2 = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨?_, ?_, by norm_num, ?_, by norm_num, fun x y => ?_⟩
  · rw [show (25 : ℝ) = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (9 : ℝ) = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (25 : ℝ) - 9 = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · have := elipsa_definicija (a := 5) (b := 3) (by norm_num) (by norm_num) (by norm_num) x y
    rw [s4] at this; norm_num at this ⊢; exact this

/-- Primer 2: a = 4, b = 3 (temeni (±4, 0)), e = √(16 + 9) = 5 (gorišči (±5, 0)), naklon asimptot ±3/4;
hiperbola je množica točk z |r₁ − r₂| = 8.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#primer2
besedilo: »Za hiperbolo $\frac{x^2}{9} - \frac{y^2}{16} = 1$ je Tina zapisala: (1) $a = 3$, $b = 4$; (2) $e = \sqrt{9 + 16} = 5$; (3) gorišči $(\pm 5, 0)$; (4) asimptoti $y = \pm \frac{3}{4} x$.« -/
theorem primer2 : Real.sqrt 16 = 4 ∧ Real.sqrt 9 = 3 ∧
    ((4 : ℝ) ^ 2 / 16 - 0 ^ 2 / 9 = 1 ∧ (-4 : ℝ) ^ 2 / 16 - 0 ^ 2 / 9 = 1) ∧ Real.sqrt (16 + 9) = 5 ∧
    Real.sqrt 9 / Real.sqrt 16 = 3 / 4 ∧
    Tendsto (fun x => 3 / 4 * x - 3 / 4 * Real.sqrt (x ^ 2 - 4 ^ 2)) atTop (𝓝 0) ∧
    Tendsto (fun x => -(3 / 4) * x - (-(3 / 4) * Real.sqrt (x ^ 2 - 4 ^ 2))) atTop (𝓝 0) ∧
    (∀ x y : ℝ, x ^ 2 / 16 - y ^ 2 / 9 = 1 ↔ |raz x y (-5) 0 - raz x y 5 0| = 8) := by
  have s5 : Real.sqrt ((4 : ℝ) ^ 2 + 3 ^ 2) = 5 := by
    rw [show (4 : ℝ) ^ 2 + 3 ^ 2 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have q4 : Real.sqrt 16 = 4 := by rw [show (16 : ℝ) = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have q3 : Real.sqrt 9 = 3 := by rw [show (9 : ℝ) = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have A := asimptota_veje (by norm_num : (0 : ℝ) < 4) (by norm_num : (0 : ℝ) < 3)
  refine ⟨q4, q3, by norm_num, ?_, by rw [q3, q4], A.1, A.2.1, fun x y => ?_⟩
  · rw [show (16 : ℝ) + 9 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · have := hiperbola_definicija (a := 4) (b := 3) (by norm_num) (by norm_num) x y
    rw [s5] at this; norm_num at this ⊢; exact this

/-- Primer 3: a = 120/2 = 60, b = 80/2 = 40, 60² = 3600, 40² = 1600, e = √(3600 − 1600) = √2000 ≈ 44,7,
2e ≈ 89,4; vsota razdalj od svinčnika do žebljičkov je 2a = 120.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#primer3
besedilo: »$e = \sqrt{3600 - 1600} = \sqrt{2000} \approx 44{,}7$« -/
theorem primer3 : (120 : ℝ) / 2 = 60 ∧ (80 : ℝ) / 2 = 40 ∧ (60 : ℝ) ^ 2 = 3600 ∧ (40 : ℝ) ^ 2 = 1600 ∧
    Real.sqrt (3600 - 1600) = Real.sqrt 2000 ∧ |Real.sqrt 2000 - 447 / 10| < 5 / 100 ∧
    |2 * Real.sqrt 2000 - 894 / 10| < 5 / 100 ∧
    ∀ x y : ℝ, x ^ 2 / 3600 + y ^ 2 / 1600 = 1 →
      raz x y (-Real.sqrt 2000) 0 + raz x y (Real.sqrt 2000) 0 = 120 := by
  have b1 : (44721 / 1000 : ℝ) < Real.sqrt 2000 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have b2 : Real.sqrt 2000 < 44722 / 1000 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_, ?_, fun x y h => ?_⟩
  · rw [abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor <;> linarith
  · have := (elipsa_definicija (a := 60) (b := 40) (by norm_num) (by norm_num) (by norm_num) x y).1
      (by norm_num at h ⊢; exact h)
    norm_num at this; exact this

/-- Primer 4 in premisli: rob (10, 40) leži na y² = 2px natanko pri 40² = 2p·10, tj. 1600 = 20p, p = 1600/20 = 80;
sprejemnik je v gorišču p/2 = 40 cm od temena.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#primer4
besedilo: »$p = \frac{1600}{20} = 80$, gorišče je pri $\frac{p}{2} = 40$. Sprejemnik mora biti $40\,\mathrm{cm}$ pred temenom, na osi antene.« -/
theorem primer4 (p : ℝ) : ((40 : ℝ) ^ 2 = 2 * p * 10 ↔ 1600 = 20 * p) ∧ (1600 = 20 * p ↔ p = 80) ∧
    (1600 : ℝ) / 20 = 80 ∧ (80 : ℝ) / 2 = 40 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    by norm_num, by norm_num⟩

/-- Primer 5, koraki 1–5 (RACUN): e − a = 5 − 4 = 1 < 6; polmera 6 in 6 + 8 = 14; krožnici (x − 5)² + y² = 36 in
(x + 5)² + y² = 196 se sekata natanko v (8, ±√27) ((x + 5)² − (x − 5)² = 20x, 20x = 160, y² = 36 − 9 = 27);
točki ležita na hiperboli: 64/16 − 27/9 = 4 − 3 = 1; √27 ≈ 5,20.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#primer5
besedilo: »Račun: enačbi krožnic $(x - 5)^2 + y^2 = 36$ in $(x + 5)^2 + y^2 = 196$ odštejemo in dobimo $20x = 160$, torej $x = 8$.« -/
theorem primer5 (x y : ℝ) : (5 : ℝ) - 4 = 1 ∧ (1 : ℝ) < 6 ∧ (6 : ℝ) + 8 = 14 ∧ (14 : ℝ) - 6 = 8 ∧
    (x + 5) ^ 2 - (x - 5) ^ 2 = 20 * x ∧
    (((x - 5) ^ 2 + y ^ 2 = 36 ∧ (x + 5) ^ 2 + y ^ 2 = 196) ↔ (x = 8 ∧ (y = Real.sqrt 27 ∨ y = -Real.sqrt 27))) ∧
    (36 : ℝ) - (8 - 5) ^ 2 = 27 ∧ (64 : ℝ) / 16 - 27 / 9 = 4 - 3 ∧ (4 - 3 : ℝ) = 1 ∧
    |Real.sqrt 27 - 520 / 100| < 5 / 1000 ∧ Real.sqrt ((8 + 5) ^ 2 + 27) = 14 := by
  have s : Real.sqrt 27 ^ 2 = 27 := Real.sq_sqrt (by norm_num)
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by ring, ⟨?_, ?_⟩, by norm_num, by norm_num,
    by norm_num, koren_priblizno (by norm_num) (by norm_num) (by norm_num) (by norm_num), ?_⟩
  · rintro ⟨h1, h2⟩
    have k : 20 * x = 160 := by linear_combination h2 - h1
    have hx : x = 8 := by linarith
    refine ⟨hx, ?_⟩
    have hy : y ^ 2 = 27 := by rw [hx] at h1; linarith
    have : (y - Real.sqrt 27) * (y + Real.sqrt 27) = 0 := by linear_combination hy - s
    rcases mul_eq_zero.1 this with e | e
    · left; linarith
    · right; linarith
  · rintro ⟨rfl, h | h⟩ <;> (rw [h]; constructor) <;> (try rw [neg_sq]) <;> rw [s] <;> norm_num
  · rw [show ((8 : ℝ) + 5) ^ 2 + 27 = 14 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-! ## Pogoste napake -/

/-- Pogoste napake: a = √25 = 5 (ne 25); z zamenjano zvezo e = √(25 + 9) bi bilo gorišče (√34, 0) zunaj elipse
x²/25 + y²/9 = 1; z naklonom a/b = 4/3 premica ne gre skozi oglišče (4, 3); pri y² = 6x je p = 3, gorišče 1,5.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#napake
besedilo: »Gorišče parabole pri $p$.** Pri $y^2 = 2px$ je gorišče v $\left(\frac{p}{2}, 0\right)$, ne v $(p, 0)$. Pri $y^2 = 6x$ je $2p = 6$, $p = 3$, gorišče pri $1{,}5$.« -/
theorem napake : Real.sqrt 25 = 5 ∧ 1 < Real.sqrt (25 + 9) ^ 2 / 25 + 0 ^ 2 / 9 ∧ (4 / 3 : ℝ) * 4 ≠ 3 ∧
    (3 / 4 : ℝ) * 4 = 3 ∧ (∀ p : ℝ, 2 * p = 6 ↔ p = 3) ∧ (3 : ℝ) / 2 = 15 / 10 := by
  refine ⟨by rw [show (25 : ℝ) = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)], ?_, by norm_num, by norm_num,
    fun p => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num⟩
  rw [Real.sq_sqrt (by norm_num)]; norm_num

/-- Povzetek: večji imenovalec elipse pove, na kateri osi sta gorišči. Če je večji imenovalec a² pod y²
(0 < b ≤ a), je x²/b² + y²/a² = 1 natanko množica točk z vsoto razdalj 2a do gorišč (0, ±e) na osi y,
e = √(a² − b²) (primer z večjim imenovalcem pod x² je `elipsa_definicija`).
trditev: MAT-SS-3/elipsa-hiperbola-parabola#elipsa-os-y
besedilo: »Polosi** preberi kot korena imenovalcev; večji imenovalec pove, na kateri osi sta gorišči elipse.« -/
theorem elipsa_os_y {a b : ℝ} (ha : 0 < a) (hb : 0 < b) (hab : b ≤ a) (x y : ℝ) :
    x ^ 2 / b ^ 2 + y ^ 2 / a ^ 2 = 1 ↔
      raz x y 0 (-Real.sqrt (a ^ 2 - b ^ 2)) + raz x y 0 (Real.sqrt (a ^ 2 - b ^ 2)) = 2 * a := by
  have := elipsa_definicija ha hb hab y x
  have e1 : ∀ u, raz x y 0 u = raz y x u 0 := fun u => by unfold raz; ring_nf
  rw [e1, e1, add_comm (x ^ 2 / b ^ 2)]; exact this

/-- Predpostavke `elipsa_os_y` se dajo izpolniti (a = 5, b = 3). -/
example := elipsa_os_y (a := 5) (b := 3) (by norm_num) (by norm_num) (by norm_num) 0 5

/-- Pogoste napake: pri x²/9 + y²/25 = 1 je večji imenovalec pod y²: elipsa je množica točk z vsoto razdalj
do gorišč (0, ±4) enako 10 (gorišči na osi y).
trditev: MAT-SS-3/elipsa-hiperbola-parabola#napaka-os-y
besedilo: »Glavna os vedno na osi $x$.** Pri $\frac{x^2}{9} + \frac{y^2}{25} = 1$ je večji imenovalec pod $y^2$, zato sta gorišči na osi $y$.« -/
theorem napaka_os_y (x y : ℝ) : x ^ 2 / 9 + y ^ 2 / 25 = 1 ↔ raz x y 0 (-4) + raz x y 0 4 = 10 := by
  have s4 : Real.sqrt ((5 : ℝ) ^ 2 - 3 ^ 2) = 4 := by
    rw [show (5 : ℝ) ^ 2 - 3 ^ 2 = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have := elipsa_definicija (a := 5) (b := 3) (by norm_num) (by norm_num) (by norm_num) y x
  rw [s4] at this
  have e1 : raz x y 0 (-4) = raz y x (-4) 0 := by unfold raz; ring_nf
  have e2 : raz x y 0 4 = raz y x 4 0 := by unfold raz; ring_nf
  rw [e1, e2, add_comm (x ^ 2 / 9)]
  norm_num at this ⊢; exact this

/-! ## Za maturo -/

/-- Naloga 1 (RACUN resi, vrednost): (−4)² = 2p·2 ↔ p = 4 (16 = 4p); parabola y² = 8x, gorišče (2, 0), vodnica
x = −2; A je od gorišča in od vodnice oddaljena 4.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#matura1
besedilo: »Odgovor: parabola $y^2 = 8x$, gorišče $F(2, 0)$, vodnica $x = -2$.« -/
theorem matura1 (p x y : ℝ) : ((-4 : ℝ) ^ 2 = 2 * p * 2 ↔ p = 4) ∧ (y ^ 2 = 2 * 4 * x ↔ y ^ 2 = 8 * x) ∧
    (4 : ℝ) / 2 = 2 ∧ -(4 : ℝ) / 2 = -2 ∧ raz 2 (-4) 2 0 = 4 ∧ |(2 : ℝ) - -2| = 4 ∧
    Real.sqrt ((2 - 2) ^ 2 + (-4) ^ 2) = 4 ∧ (-4 : ℝ) ^ 2 + 8 * (-2) = 0 ∧ (-4 : ℝ) ^ 2 - 8 * 2 = 0 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    by norm_num, by norm_num, raz_eq (by norm_num) (by norm_num), by norm_num, ?_, by norm_num, by norm_num⟩
  rw [show ((2 : ℝ) - 2) ^ 2 + (-4) ^ 2 = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Naloga 2 a) (in razlaga za temena): na elipsi je razdalja do gorišča F₂ med a − e in a + e; najmanjša je v
temenu (a, 0), največja v (−a, 0) (0 < b ≤ a).
trditev: MAT-SS-3/elipsa-hiperbola-parabola#najblizje-najdlje
besedilo: »a) Najmanjša in največja oddaljenost od gorišča sta razdalji do temen na veliki osi: $a - e = 7$ in $a + e = 13$.« -/
theorem najblizje_najdlje {a b x y : ℝ} (ha : 0 < a) (hb : 0 < b) (hab : b ≤ a)
    (h : x ^ 2 / a ^ 2 + y ^ 2 / b ^ 2 = 1) :
    a - Real.sqrt (a ^ 2 - b ^ 2) ≤ raz x y (Real.sqrt (a ^ 2 - b ^ 2)) 0 ∧
    raz x y (Real.sqrt (a ^ 2 - b ^ 2)) 0 ≤ a + Real.sqrt (a ^ 2 - b ^ 2) ∧
    raz a 0 (Real.sqrt (a ^ 2 - b ^ 2)) 0 = a - Real.sqrt (a ^ 2 - b ^ 2) ∧
    raz (-a) 0 (Real.sqrt (a ^ 2 - b ^ 2)) 0 = a + Real.sqrt (a ^ 2 - b ^ 2) := by
  have H1 : x ^ 2 * b ^ 2 + y ^ 2 * a ^ 2 = a ^ 2 * b ^ 2 := by
    have := h; field_simp at this; linarith
  have hxx : x ^ 2 ≤ a ^ 2 := by
    have : 0 ≤ y ^ 2 * a ^ 2 := by positivity
    have hb2 : 0 < b ^ 2 := by positivity
    by_contra hc; push Not at hc; nlinarith [mul_lt_mul_of_pos_right hc hb2]
  have hx1 : -a ≤ x := by nlinarith
  have hx2 : x ≤ a := by nlinarith
  have he0 := Real.sqrt_nonneg (a ^ 2 - b ^ 2)
  obtain ⟨-, g2⟩ := elipsa_gorisci ha hb hab h
  obtain ⟨-, ga⟩ := elipsa_gorisci (x := a) (y := 0) ha hb hab
    (by rw [zero_pow two_ne_zero, zero_div, add_zero, div_self (by positivity)])
  obtain ⟨-, gb⟩ := elipsa_gorisci (x := -a) (y := 0) ha hb hab
    (by rw [neg_sq, zero_pow two_ne_zero, zero_div, add_zero, div_self (by positivity)])
  rw [g2, ga, gb]
  have : Real.sqrt (a ^ 2 - b ^ 2) * x / a ≤ Real.sqrt (a ^ 2 - b ^ 2) := by
    rw [div_le_iff₀ ha]; nlinarith
  have : -Real.sqrt (a ^ 2 - b ^ 2) ≤ Real.sqrt (a ^ 2 - b ^ 2) * x / a := by
    rw [le_div_iff₀ ha]; nlinarith
  refine ⟨by linarith, by linarith, by field_simp, by field_simp; ring⟩

/-- Predpostavke `najblizje_najdlje` se dajo izpolniti (naloga 2: a = 10, b = √91, teme (10, 0)). -/
example := najblizje_najdlje (a := 10) (b := Real.sqrt 91) (x := 10) (y := 0) (by norm_num) (by positivity)
  (by rw [Real.sqrt_le_left (by norm_num)]; norm_num) (by norm_num)

/-- Naloga 2 a), b), c) (RACUN vrednost): a − e = 7 in a + e = 13 ↔ a = 10, e = 3; ε = 3/10 = 0,3;
b = √(100 − 9) = √91 ≈ 9,54; tir x²/100 + y²/91 = 1; pri x = 3 je y² = 91·0,91 = 82,81 in |y| = 9,1 (9100 km);
preizkus √(6² + 82,81) = 10,9 in 10,9 + 9,1 = 20 = 2a.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#matura2
besedilo: »c) Preizkus z definicijo elipse: razdalja do $F_1(-3, 0)$ je $\sqrt{6^2 + 82{,}81} = \sqrt{118{,}81} = 10{,}9$, vsota razdalj je $10{,}9 + 9{,}1 = 20 = 2a$.« -/
theorem matura2 (a e y : ℝ) : ((a - e = 7 ∧ a + e = 13) ↔ (a = 10 ∧ e = 3)) ∧ (7 + 13 : ℝ) / 2 = 10 ∧
    (13 - 10 : ℝ) = 3 ∧ (3 : ℝ) / 10 = 0.3 ∧ |Real.sqrt (100 - 9) - 954 / 100| < 5 / 1000 ∧
    ((3 : ℝ) ^ 2 / 100 + y ^ 2 / 91 = 1 ↔ y ^ 2 = 91 * (1 - 9 / 100)) ∧ (91 : ℝ) * (1 - 9 / 100) = 8281 / 100 ∧
    Real.sqrt (8281 / 100) = 91 / 10 ∧ Real.sqrt (6 ^ 2 + 8281 / 100) = 109 / 10 ∧
    (109 / 10 + 91 / 10 : ℝ) = 20 ∧ (91 / 10 : ℝ) * 1000 = 9100 ∧
    (y ^ 2 = 8281 / 100 → |y| = 91 / 10) ∧ raz 3 (91 / 10) (-3) 0 = 109 / 10 ∧ raz 3 (91 / 10) 3 0 = 91 / 10 := by
  refine ⟨⟨fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩, fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩⟩,
    by norm_num, by norm_num, by norm_num,
    koren_priblizno (by norm_num) (by norm_num) (by norm_num) (by norm_num),
    ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, ?_, ?_, by norm_num, by norm_num, fun h => ?_,
    raz_eq (by norm_num) (by norm_num), raz_eq (by norm_num) (by norm_num)⟩
  · rw [show (8281 / 100 : ℝ) = (91 / 10) ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (6 : ℝ) ^ 2 + 8281 / 100 = (109 / 10) ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [← Real.sqrt_sq_eq_abs, h, show (8281 / 100 : ℝ) = (91 / 10) ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Naloga 3 a) (RACUN vrednost): 2a = 4, a = 2, e = 4, b² = 16 − 4 = 12; hiperbola x²/4 − y²/12 = 1 je množica
točk z |r₁ − r₂| = 4 (gorišči A(−4, 0), B(4, 0)); ladja z r₁ − r₂ = 4 leži na desni veji (x ≥ 2).
trditev: MAT-SS-3/elipsa-hiperbola-parabola#matura3a
besedilo: »a) Iz $2a = 4$ sledi $a = 2$. Gorišči sta $4$ od središča, zato $e = 4$ in $b^2 = e^2 - a^2 = 16 - 4 = 12$. Enačba je $\frac{x^2}{4} - \frac{y^2}{12} = 1$.« -/
theorem matura3a (x y : ℝ) : (4 : ℝ) ^ 2 - 2 ^ 2 = 12 ∧
    (x ^ 2 / 4 - y ^ 2 / 12 = 1 ↔ |raz x y (-4) 0 - raz x y 4 0| = 4) ∧
    (raz x y (-4) 0 - raz x y 4 0 = 4 → x ^ 2 / 4 - y ^ 2 / 12 = 1 ∧ 2 ≤ x) := by
  have s4 : Real.sqrt ((2 : ℝ) ^ 2 + Real.sqrt 12 ^ 2) = 4 := by
    rw [Real.sq_sqrt (by norm_num), show (2 : ℝ) ^ 2 + 12 = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have hd := hiperbola_definicija (a := 2) (b := Real.sqrt 12) (by norm_num) (by positivity) x y
  rw [s4, Real.sq_sqrt (by norm_num)] at hd
  have hd' : x ^ 2 / 4 - y ^ 2 / 12 = 1 ↔ |raz x y (-4) 0 - raz x y 4 0| = 4 := by
    norm_num at hd ⊢; exact hd
  refine ⟨by norm_num, hd', fun h => ?_⟩
  have hh : x ^ 2 / 4 - y ^ 2 / 12 = 1 := hd'.2 (by rw [h]; norm_num)
  refine ⟨hh, ?_⟩
  have hg := hiperbola_gorisci (a := 2) (b := Real.sqrt 12) (x := x) (y := y) (by norm_num) (by positivity)
    (by rw [Real.sq_sqrt (by norm_num)]; norm_num at hh ⊢; exact hh)
  rw [s4] at hg
  obtain ⟨hx, -, -, -, hl⟩ := hg
  by_contra hc; push Not at hc
  have : x ≤ -2 := by nlinarith
  have := hl this; linarith

/-- Naloga 3 b) (RACUN enako, resi, vrednost): sistem s premico y = x + 2 ima rešitvi (4, 6) in (−2, 0)
(3x² − (x + 2)² − 12 = 2(x² − 2x − 8), (x − 4)(x + 2) = 0); (−2, 0) je bližje A (r₁ = 2, r₂ = 6), zato ladja je
v (4, 6) (r₁ = 10, r₂ = 6, razlika 4; 16/4 − 36/12 = 1).
trditev: MAT-SS-3/elipsa-hiperbola-parabola#matura3b
besedilo: »b) Enačbo hiperbole pomnožimo z $12$ in vstavimo $y = x + 2$: $3x^2 - (x + 2)^2 = 12$, torej $2x^2 - 4x - 16 = 0$ oziroma $x^2 - 2x - 8 = 0$.« -/
theorem matura3b (x y : ℝ) : 3 * x ^ 2 - (x + 2) ^ 2 - 12 = 2 * (x ^ 2 - 2 * x - 8) ∧
    ((x ^ 2 / 4 - y ^ 2 / 12 = 1 ∧ y = x + 2) ↔ ((x = 4 ∧ y = 6) ∨ (x = -2 ∧ y = 0))) ∧
    (raz (-2) 0 (-4) 0 = 2 ∧ raz (-2) 0 4 0 = 6) ∧ (raz 4 6 (-4) 0 = 10 ∧ raz 4 6 4 0 = 6) ∧
    (4 : ℝ) ^ 2 / 4 - 6 ^ 2 / 12 = 1 ∧
    ((raz x y (-4) 0 - raz x y 4 0 = 4 ∧ y = x + 2) ↔ (x = 4 ∧ y = 6)) := by
  have sys : ∀ x y : ℝ, (x ^ 2 / 4 - y ^ 2 / 12 = 1 ∧ y = x + 2) ↔ ((x = 4 ∧ y = 6) ∨ (x = -2 ∧ y = 0)) := by
    intro x y
    constructor
    · rintro ⟨h, rfl⟩
      have k4 : 3 * x ^ 2 - (x + 2) ^ 2 = 12 := by linear_combination 12 * h
      have k : x ^ 2 - 2 * x - 8 = 0 := by linear_combination k4 / 2
      have k5 : (x - 4) * (x + 2) = 0 := by linear_combination k
      rcases mul_eq_zero.1 k5 with e | e
      · left; constructor <;> linarith
      · right; constructor <;> linarith
    · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩) <;> norm_num
  have r1 : raz (-2) 0 (-4) 0 = 2 := raz_eq (by norm_num) (by norm_num)
  have r2 : raz (-2) 0 4 0 = 6 := raz_eq (by norm_num) (by norm_num)
  have r3 : raz 4 6 (-4) 0 = 10 := raz_eq (by norm_num) (by norm_num)
  have r4 : raz 4 6 4 0 = 6 := raz_eq (by norm_num) (by norm_num)
  refine ⟨by ring, sys x y, ⟨r1, r2⟩, ⟨r3, r4⟩, by norm_num, ⟨fun ⟨h, hl⟩ => ?_, ?_⟩⟩
  · obtain ⟨hh, -⟩ := (matura3a x y).2.2 h
    rcases (sys x y).1 ⟨hh, hl⟩ with e | ⟨rfl, rfl⟩
    · exact e
    · rw [r1, r2] at h; norm_num at h
  · rintro ⟨rfl, rfl⟩; rw [r3, r4]; norm_num

/-- Naloga 3 c) (RACUN enako, vrednost): meja območja (enako oddaljene točke od B(4, 0) in obale x = −4) je
parabola y² = 16x (p = 8, (x − 4)² + y² − (x + 4)² = y² − 16x); točke bližje B kot obali so y² < 16x; ladja:
6 < 8 oziroma 36 < 16·4 = 64.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#matura3c
besedilo: »c) Ladja je od svetilnika $B$ oddaljena $6\,\mathrm{km}$, od obale pa $4 - (-4) = 8\,\mathrm{km}$. Ker je $6 < 8$, je v območju ribolova (enakovredno: $6^2 = 36 < 16 \cdot 4 = 64$).« -/
theorem matura3c (x y : ℝ) : (x - 4) ^ 2 + y ^ 2 - (x + 4) ^ 2 = y ^ 2 - 16 * x ∧
    (raz x y 4 0 = |x + 4| ↔ y ^ 2 = 16 * x) ∧ (raz x y 4 0 < |x + 4| ↔ y ^ 2 < 16 * x) ∧
    (4 : ℝ) - -4 = 8 ∧ (y ^ 2 = 2 * 8 * x ↔ y ^ 2 = 16 * x) ∧ raz 4 6 4 0 = 6 ∧ |(4 : ℝ) + 4| = 8 ∧
    (6 : ℝ) < 8 ∧ (6 : ℝ) ^ 2 < 16 * 4 ∧ (16 : ℝ) * 4 = 64 := by
  refine ⟨by ring, ?_, ?_, by norm_num, ⟨fun h => by linarith, fun h => by linarith⟩,
    raz_eq (by norm_num) (by norm_num), by norm_num, by norm_num, by norm_num, by norm_num⟩
  · rw [enako_oddaljena]; constructor <;> intro h <;> linear_combination h
  · rw [raz, ← Real.sqrt_sq_eq_abs, Real.sqrt_lt_sqrt_iff (by positivity)]
    constructor <;> intro h <;> nlinarith

/-! ## Preveri se -/

/-- Preveri se, vprašanje 1: 4x² + 9y² = 36 ↔ x²/9 + y²/4 = 1, a = √9 = 3, b = √4 = 2.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#preveri1
besedilo: »Delimo s $36$: $\frac{x^2}{9} + \frac{y^2}{4} = 1$, torej elipsa z $a = \sqrt{9} = 3$ in $b = \sqrt{4} = 2$.« -/
theorem preveri1 (x y : ℝ) : (4 * x ^ 2 + 9 * y ^ 2 = 36 ↔ x ^ 2 / 9 + y ^ 2 / 4 = 1) ∧
    Real.sqrt 9 = 3 ∧ Real.sqrt 4 = 2 := by
  refine ⟨⟨fun h => by linear_combination h / 36, fun h => by linear_combination 36 * h⟩, ?_, ?_⟩
  · rw [show (9 : ℝ) = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (4 : ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Preveri se, vprašanje 2: e = √(169 − 25) = √144 = 12, gorišči (±12, 0); temena (±13, 0) niso gorišči.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#preveri2
besedilo: »$e = \sqrt{169 - 25} = \sqrt{144} = 12$, gorišči sta $(\pm 12, 0)$.« -/
theorem preveri2 : Real.sqrt (169 - 25) = Real.sqrt 144 ∧ Real.sqrt 144 = 12 ∧ Real.sqrt 169 = 13 := by
  refine ⟨by norm_num, ?_, ?_⟩
  · rw [show (144 : ℝ) = 12 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (169 : ℝ) = 13 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Preveri se, vprašanje 4: pri x²/9 − y²/16 = 1 so koraki 1–3 pravilni (a = 3, b = 4, e = √(9 + 16) = 5), naklon
asimptot pa je b/a = 4/3, ne 3/4.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#preveri4
besedilo: »Za hiperbolo $\frac{x^2}{9} - \frac{y^2}{16} = 1$ je Tina zapisala: (1) $a = 3$, $b = 4$; (2) $e = \sqrt{9 + 16} = 5$; (3) gorišči $(\pm 5, 0)$; (4) asimptoti $y = \pm \frac{3}{4} x$.« -/
theorem preveri4 : Real.sqrt 9 = 3 ∧ Real.sqrt 16 = 4 ∧ Real.sqrt (9 + 16) = 5 ∧ (4 : ℝ) / 3 ≠ 3 / 4 := by
  refine ⟨?_, ?_, ?_, by norm_num⟩
  · rw [show (9 : ℝ) = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (16 : ℝ) = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (9 : ℝ) + 16 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Preveri se, vprašanji 5 in 6 (RACUN vrednost): y² = 6x: p = 3, gorišče p/2 = 1,5 cm od temena;
x² = −10y: 2p = 10, p = 5, gorišče (0, −p/2) = (0; −2,5), vodnica y = 2,5.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#preveri56
besedilo: »$2p = 10$, $p = 5$. Parabola je odprta navzdol, zato je gorišče $\left(0, -\frac{p}{2}\right) = (0;\; -2{,}5)$, vodnica pa $y = 2{,}5$.« -/
theorem preveri56 (x y : ℝ) : (y ^ 2 = 6 * x ↔ raz x y (3 / 2) 0 = |x + 3 / 2|) ∧ (3 : ℝ) / 2 = 15 / 10 ∧
    (x ^ 2 = -10 * y ↔ raz x y 0 (-5 / 2) = |y - 5 / 2|) ∧ -((10 : ℝ) / 2) / 2 = -25 / 10 := by
  have h1 := parabola_definicija 3 x y
  have h2 := (parabola_smeri 5 x y).2.2
  refine ⟨?_, by norm_num, ?_, by norm_num⟩
  · rw [← h1]; constructor <;> intro h <;> linarith
  · rw [← h2]; constructor <;> intro h <;> linarith

/-- Preveri se, vprašanje 7 (RACUN enako): x² + Cy² − 16 = 0 je hiperbola x²/16 − y²/4 = 1 (b = 2) natanko pri
C = −4; 16(x²/16 − y²/4 − 1) = x² − 4y² − 16.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#preveri7
besedilo: »Hiperbola: $\frac{x^2}{16} - \frac{y^2}{4} = 1$. Pomnožimo s $16$: $x^2 - 4y^2 - 16 = 0$, torej $C = -4$.« -/
theorem preveri7 (C : ℝ) : (∀ x y : ℝ, x ^ 2 + C * y ^ 2 - 16 = 0 ↔ x ^ 2 / 16 - y ^ 2 / 4 = 1) ↔ C = -4 := by
  constructor
  · intro h
    have := (h (Real.sqrt 32) 2).2 (by rw [Real.sq_sqrt (by norm_num)]; norm_num)
    rw [Real.sq_sqrt (by norm_num)] at this
    linarith
  · rintro rfl x y
    constructor
    · intro h; linear_combination h / 16
    · intro h; linear_combination 16 * h

/-- Preveri se, vprašanje 7 (RACUN enako): 16(x²/16 − y²/4 − 1) = x² − 4y² − 16.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#preveri7-racun
besedilo: »Hiperbola: $\frac{x^2}{16} - \frac{y^2}{4} = 1$. Pomnožimo s $16$: $x^2 - 4y^2 - 16 = 0$, torej $C = -4$.« -/
theorem preveri7_racun (x y : ℝ) : 16 * (x ^ 2 / 16 - y ^ 2 / 4 - 1) = x ^ 2 - 4 * y ^ 2 - 16 := by ring

/-- Preveri se, vprašanje 8 (RACUN vrednost): za točke desne veje je r₁ − r₂ = 2a, zato r₁ = 4 + 6 = 10.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#preveri8
besedilo: »Za točke desne veje je $r_1 - r_2 = 2a$, zato $r_1 = 4 + 6 = 10$.« -/
theorem preveri8 (r₁ : ℝ) : (r₁ - 4 = 6 ↔ r₁ = 10) ∧ (4 + 6 : ℝ) = 10 :=
  ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num⟩

/-- Preveri se, vprašanje 9: asimptoti y = ±(b/3)x sta y = ±x natanko pri b/3 = 1, tj. b = 3.
trditev: MAT-SS-3/elipsa-hiperbola-parabola#preveri9
besedilo: »Naklon asimptot je $\frac{b}{a} = 1$, zato $b = a = 3$.« -/
theorem preveri9 (b : ℝ) : b / 3 = 1 ↔ b = 3 := by
  constructor <;> intro h
  · linarith [show b = b / 3 * 3 by ring]
  · rw [h]; norm_num

end Evklid.Lekcije.MAT_SS_3.ElipsaHiperbolaParabola
