/-
vir: content/lessons/MAT-SS-4/uporaba-odvoda.md
sha256: d5438bc87780029fa224101a9619c7995a5bb8016abfbe68b944b7074dd0b5ab
Ni v Leanu: zgodba o peku in slika grafa (risba, številska premica); simulacija; formula za presečni kot
tan φ = |(k₂ − k₁)/(1 + k₁k₂)| je dokazana kot tan(α₂ − α₁) = (k₂ − k₁)/(1 + k₁k₂) za smerna kota (`presecni_kot`),
absolutna vrednost (izbira ostrega kota) pa je dogovor; približek φ ≈ 53,13° (53° 8′) v Primeru 5 (zahtevno,
še ni dokazano; dokazano je tan φ = 4/3); Preveri se 1 (R'(3) = −40 brez dane funkcije,
pomen besedila); analogije (pohodnik, temperatura); risanje grafa v Nalogi 2 c); odgovori »v stavku z
enotami« in točkovanje. Naloga 3: številke so dokazane za natančni r = ∛(1/π) (lekcija vstavlja zaokroženi
0,68278).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.UporabaOdvoda

open Real Filter Topology Set

/-! ## Pravila (Razlaga: naraščanje, padanje, ekstremi) -/

/-- Razlaga »Naraščanje in padanje«: f' > 0 na (notranjosti) intervala ⇒ f tam narašča. -/
theorem narasca {f f' : ℝ → ℝ} {D : Set ℝ} (hd : ∀ x, HasDerivAt f (f' x) x) (hD : Convex ℝ D)
    (hp : ∀ x ∈ interior D, 0 < f' x) : StrictMonoOn f D :=
  strictMonoOn_of_deriv_pos hD (fun x _ => (hd x).continuousAt.continuousWithinAt)
    fun x hx => by rw [(hd x).deriv]; exact hp x hx

/-- Razlaga »Naraščanje in padanje«: f' < 0 na (notranjosti) intervala ⇒ f tam pada. -/
theorem pada {f f' : ℝ → ℝ} {D : Set ℝ} (hd : ∀ x, HasDerivAt f (f' x) x) (hD : Convex ℝ D)
    (hn : ∀ x ∈ interior D, f' x < 0) : StrictAntiOn f D :=
  strictAntiOn_of_deriv_neg hD (fun x _ => (hd x).continuousAt.continuousWithinAt)
    fun x hx => by rw [(hd x).deriv]; exact hn x hx

/-- Predpostavke trditev `narasca` in `pada` so izpolnljive (f = x oziroma f = −x na ℝ). -/
example : (∀ x : ℝ, HasDerivAt (fun x : ℝ => x) ((fun _ => (1:ℝ)) x) x) ∧ Convex ℝ (univ : Set ℝ) ∧
    (∀ x ∈ interior (univ : Set ℝ), (0:ℝ) < (fun _ => (1:ℝ)) x) :=
  ⟨fun x => hasDerivAt_id' x, convex_univ, fun _ _ => one_pos⟩

example : (∀ x : ℝ, HasDerivAt (fun x : ℝ => -x) ((fun _ => (-1:ℝ)) x) x) ∧ Convex ℝ (univ : Set ℝ) ∧
    (∀ x ∈ interior (univ : Set ℝ), (fun _ => (-1:ℝ)) x < 0) :=
  ⟨fun x => (hasDerivAt_id' x).neg, convex_univ, fun _ _ => by norm_num⟩

/-- Razlaga »Ekstremi«: če odvod v b zamenja predznak iz + v −, ima f v b lokalni maksimum. -/
theorem lokalni_maksimum {f f' : ℝ → ℝ} {a b c : ℝ} (hd : ∀ x, HasDerivAt f (f' x) x) (hab : a < b)
    (hbc : b < c) (h₀ : ∀ x ∈ Ioo a b, 0 ≤ f' x) (h₁ : ∀ x ∈ Ioo b c, f' x ≤ 0) : IsLocalMax f b :=
  isLocalMax_of_deriv_Ioo hab hbc (hd b).continuousAt
    (fun x _ => (hd x).differentiableAt.differentiableWithinAt)
    (fun x _ => (hd x).differentiableAt.differentiableWithinAt)
    (fun x hx => by rw [(hd x).deriv]; exact h₀ x hx) (fun x hx => by rw [(hd x).deriv]; exact h₁ x hx)

/-- Razlaga »Ekstremi«: če odvod v b zamenja predznak iz − v +, ima f v b lokalni minimum. -/
theorem lokalni_minimum {f f' : ℝ → ℝ} {a b c : ℝ} (hd : ∀ x, HasDerivAt f (f' x) x) (hab : a < b)
    (hbc : b < c) (h₀ : ∀ x ∈ Ioo a b, f' x ≤ 0) (h₁ : ∀ x ∈ Ioo b c, 0 ≤ f' x) : IsLocalMin f b :=
  isLocalMin_of_deriv_Ioo hab hbc (hd b).continuousAt
    (fun x _ => (hd x).differentiableAt.differentiableWithinAt)
    (fun x _ => (hd x).differentiableAt.differentiableWithinAt)
    (fun x hx => by rw [(hd x).deriv]; exact h₀ x hx) (fun x hx => by rw [(hd x).deriv]; exact h₁ x hx)

/-- Predpostavke trditev `lokalni_maksimum` in `lokalni_minimum` so izpolnljive (f = −x², f = x² v 0). -/
example : (∀ x : ℝ, HasDerivAt (fun x : ℝ => x ^ 2) ((fun x => 2 * x) x) x) ∧ (-1:ℝ) < 0 ∧ (0:ℝ) < 1 ∧
    (∀ x ∈ Ioo (-1:ℝ) 0, (fun x => 2 * x) x ≤ 0) ∧ (∀ x ∈ Ioo (0:ℝ) 1, 0 ≤ (fun x => 2 * x) x) :=
  ⟨fun x => (hasDerivAt_pow 2 x).congr_deriv (by norm_num), by norm_num, by norm_num,
    fun x hx => by simp only; linarith [hx.2], fun x hx => by simp only; linarith [hx.1]⟩

example : (∀ x : ℝ, HasDerivAt (fun x : ℝ => -x ^ 2) ((fun x => -(2 * x)) x) x) ∧ (-1:ℝ) < 0 ∧ (0:ℝ) < 1 ∧
    (∀ x ∈ Ioo (-1:ℝ) 0, 0 ≤ (fun x => -(2 * x)) x) ∧ (∀ x ∈ Ioo (0:ℝ) 1, (fun x => -(2 * x)) x ≤ 0) :=
  ⟨fun x => ((hasDerivAt_pow 2 x).neg).congr_deriv (by norm_num), by norm_num, by norm_num,
    fun x hx => by simp only; linarith [hx.2], fun x hx => by simp only; linarith [hx.1]⟩

/-! ## Uvod in razlaga: rogljički -/

/-- Uvod: pri 1 € in 300 kosih ter pri 1,50 € in 200 kosih je prihodek enak, 300 €. -/
theorem uvod : (1:ℝ) * 300 = 300 ∧ (1.5:ℝ) * 200 = 300 := by norm_num

/-- Tabela namesto formule: prodanih je 300 − 200(x − 1) = 500 − 200x kosov, prihodek
R(x) = x(500 − 200x) = 500x − 200x². -/
theorem kosi_in_prihodek (x : ℝ) :
    300 - 200 * (x - 1) = 500 - 200 * x ∧ x * (500 - 200 * x) = 500 * x - 200 * x ^ 2 := by
  constructor <;> ring

/-- Tabela: R(1) = 300, R(1,1) = 308, R(1,2) = 312, R(1,25) = 312,5, R(1,3) = 312, R(1,4) = 308,
R(1,5) = 300 (s kosi 300, 280, 260, 250, 240, 220, 200). -/
theorem tabela :
    (500:ℝ) - 200 * 1 = 300 ∧ (1:ℝ) * 300 = 300 ∧ (500:ℝ) - 200 * 1.1 = 280 ∧ (1.1:ℝ) * 280 = 308 ∧
    (500:ℝ) - 200 * 1.2 = 260 ∧ (1.2:ℝ) * 260 = 312 ∧ (500:ℝ) - 200 * 1.25 = 250 ∧
    (1.25:ℝ) * 250 = 312.5 ∧ (500:ℝ) - 200 * 1.3 = 240 ∧ (1.3:ℝ) * 240 = 312 ∧
    (500:ℝ) - 200 * 1.4 = 220 ∧ (1.4:ℝ) * 220 = 308 ∧ (500:ℝ) - 200 * 1.5 = 200 ∧
    (1.5:ℝ) * 200 = 300 := by norm_num

/-- Tabela: vrh je pri 1,25 €: R(x) ≤ R(1,25) = 312,5 za vsak x. -/
theorem vrh (x : ℝ) : 500 * x - 200 * x ^ 2 ≤ 500 * 1.25 - 200 * 1.25 ^ 2 := by
  nlinarith [sq_nonneg (x - 1.25)]

/-- Tangenta: R'(x) = 500 − 400x, R'(1) = 100, tangenta y = 300 + 100(x − 1) = 100x + 200. -/
theorem rogljicki_tangenta (x : ℝ) :
    HasDerivAt (fun x : ℝ => 500 * x - 200 * x ^ 2) (500 - 400 * x) x ∧ (500:ℝ) - 400 * 1 = 100 ∧
    300 + 100 * (x - 1) = 100 * x + 200 := by
  refine ⟨?_, by norm_num, by ring⟩
  exact (((hasDerivAt_id' x).const_mul 500).sub ((hasDerivAt_pow 2 x).const_mul 200)).congr_deriv
    (by push_cast; ring)

/-- Številska premica: R narašča na [1; 1,25] (R' > 0) in pada na [1,25; 1,5] (R' < 0). -/
theorem rogljicki_monotonost :
    StrictMonoOn (fun x : ℝ => 500 * x - 200 * x ^ 2) (Icc 1 1.25) ∧
    StrictAntiOn (fun x : ℝ => 500 * x - 200 * x ^ 2) (Icc 1.25 1.5) := by
  have hd := fun x => (rogljicki_tangenta x).1
  refine ⟨narasca hd (convex_Icc _ _) fun x hx => ?_, pada hd (convex_Icc _ _) fun x hx => ?_⟩
  · rw [interior_Icc] at hx; linarith [hx.2]
  · rw [interior_Icc] at hx; linarith [hx.1]

/-- Normala: pri k_t ≠ 0 je produkt k_t · (−1/k_t) = −1, normala je pravokotna na tangento. -/
theorem normala (k : ℝ) (hk : k ≠ 0) : k * (-1 / k) = -1 := by field_simp

example : (1:ℝ) ≠ 0 := one_ne_zero

/-- Normala (Razlaga, Ponovitev): pri k = f'(a) ≠ 0 premica y = f(a) − (x − a)/f'(a) gre skozi (a, f(a)),
ima smerni koeficient −1/k in je pravokotna na tangento y = f(a) + k(x − a) (skalarni produkt
smernih vektorjev (1, k) in (1, −1/k) je 0). -/
theorem normala_enacba (fa k a : ℝ) (hk : k ≠ 0) :
    fa - (a - a) / k = fa ∧ (∀ x, fa - (x - a) / k = fa + (-1 / k) * (x - a)) ∧
    (1:ℝ) * 1 + k * (-1 / k) = 0 := by
  refine ⟨by simp, fun x => by ring, by field_simp; ring⟩

example : (1:ℝ) ≠ 0 := one_ne_zero

/-- Normala pri f'(a) = 0: tangenta y = f(a) je vodoravna (smer (1, 0)), navpična premica x = a skozi
(a, f(a)) (smer (0, 1)) je nanjo pravokotna. -/
theorem normala_navpicna (fa a x : ℝ) :
    fa + 0 * (x - a) = fa ∧ (1:ℝ) * 0 + 0 * 1 = 0 := by constructor <;> ring

/-- Presečni kot: če sta α₁, α₂ smerna kota tangent (tan αᵢ = kᵢ, cos αᵢ ≠ 0), je
tan(α₂ − α₁) = (k₂ − k₁)/(1 + k₁k₂); pri k₁k₂ = −1 je cos(α₂ − α₁) = 0 (pravi kot). -/
theorem presecni_kot (α₁ α₂ k₁ k₂ : ℝ) (h₁ : cos α₁ ≠ 0) (h₂ : cos α₂ ≠ 0) (t₁ : tan α₁ = k₁)
    (t₂ : tan α₂ = k₂) :
    tan (α₂ - α₁) = (k₂ - k₁) / (1 + k₁ * k₂) ∧ (k₁ * k₂ = -1 → cos (α₂ - α₁) = 0) := by
  rw [Real.tan_eq_sin_div_cos] at t₁ t₂
  have s₁ : sin α₁ = k₁ * cos α₁ := by rw [← t₁]; field_simp
  have s₂ : sin α₂ = k₂ * cos α₂ := by rw [← t₂]; field_simp
  have hs : sin (α₂ - α₁) = cos α₁ * cos α₂ * (k₂ - k₁) := by rw [sin_sub, s₁, s₂]; ring
  have hc : cos (α₂ - α₁) = cos α₁ * cos α₂ * (1 + k₁ * k₂) := by rw [cos_sub, s₁, s₂]; ring
  refine ⟨?_, fun h => by rw [hc, h]; ring⟩
  rw [Real.tan_eq_sin_div_cos, hs, hc]
  have : cos α₁ * cos α₂ ≠ 0 := mul_ne_zero h₁ h₂
  rw [mul_div_mul_left _ _ this]

/-- Predpostavke trditve `presecni_kot` se dajo izpolniti (α₁ = α₂ = 0, k₁ = k₂ = 0). -/
example : cos (0:ℝ) ≠ 0 ∧ tan (0:ℝ) = 0 := by simp

/-- Premisli (x³): f'(0) = 0, a f'(x) = 3x² ≥ 0, f ves čas narašča in v 0 nima ekstrema. -/
theorem kub_terasa :
    deriv (fun x : ℝ => x ^ 3) 0 = 0 ∧ StrictMono (fun x : ℝ => x ^ 3) ∧
    ¬ IsLocalMax (fun x : ℝ => x ^ 3) 0 ∧ ¬ IsLocalMin (fun x : ℝ => x ^ 3) 0 := by
  have hm : StrictMono (fun x : ℝ => x ^ 3) := Odd.strictMono_pow (by decide)
  refine ⟨by simp, hm, fun h => ?_, fun h => ?_⟩
  · obtain ⟨x, hx, hx0⟩ := (h.filter_mono (nhdsWithin_le_nhds (s := Ioi 0))).and
      self_mem_nhdsWithin |>.exists
    exact absurd (hm (show (0:ℝ) < x from hx0)) (not_lt.mpr hx)
  · obtain ⟨x, hx, hx0⟩ := (h.filter_mono (nhdsWithin_le_nhds (s := Iio 0))).and
      self_mem_nhdsWithin |>.exists
    exact absurd (hm (show x < (0:ℝ) from hx0)) (not_lt.mpr hx)

/-! ## Rešeni primeri -/

/-- Primer 1: f(2) = 8 − 6 = 2, f'(x) = 3x² − 3, f'(2) = 12 − 3 = 9, tangenta y = 2 + 9(x − 2) = 9x − 16. -/
theorem primer1 (x : ℝ) :
    (2:ℝ) ^ 3 - 3 * 2 = 8 - 6 ∧ (8:ℝ) - 6 = 2 ∧
    HasDerivAt (fun x : ℝ => x ^ 3 - 3 * x) (3 * x ^ 2 - 3) x ∧
    (3:ℝ) * 2 ^ 2 - 3 = 12 - 3 ∧ (12:ℝ) - 3 = 9 ∧ 2 + 9 * (x - 2) = 9 * x - 16 := by
  refine ⟨by norm_num, by norm_num, ?_, by norm_num, by norm_num, by ring⟩
  exact ((hasDerivAt_pow 3 x).sub ((hasDerivAt_id' x).const_mul 3)).congr_deriv (by push_cast; ring)

/-- Primer 2, korak 1: f'(x) = 3x² − 6x − 9 = 3(x + 1)(x − 3). -/
theorem primer2_odvod (x : ℝ) :
    HasDerivAt (fun x : ℝ => x ^ 3 - 3 * x ^ 2 - 9 * x + 2) (3 * x ^ 2 - 6 * x - 9) x ∧
    3 * x ^ 2 - 6 * x - 9 = 3 * (x + 1) * (x - 3) := by
  refine ⟨?_, by ring⟩
  exact ((((hasDerivAt_pow 3 x).sub ((hasDerivAt_pow 2 x).const_mul 3)).sub
    ((hasDerivAt_id' x).const_mul 9)).add_const 2).congr_deriv (by push_cast; ring)

/-- Primer 2, korak 2: stacionarni točki sta natanko −1 in 3. -/
theorem primer2_stacionarni (x : ℝ) : 3 * (x + 1) * (x - 3) = 0 ↔ x = -1 ∨ x = 3 := by
  constructor
  · intro h
    rcases mul_eq_zero.mp h with h | h
    · rcases mul_eq_zero.mp h with h | h
      · norm_num at h
      · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Primer 2, korak 3: testne točke f'(−2) = 15, f'(0) = −9, f'(4) = 15; f narašča na (−∞, −1) in
(3, ∞), pada na (−1, 3). -/
theorem primer2_monotonost :
    (3:ℝ) * (-2) ^ 2 - 6 * (-2) - 9 = 15 ∧ (3:ℝ) * 0 ^ 2 - 6 * 0 - 9 = -9 ∧
    (3:ℝ) * 4 ^ 2 - 6 * 4 - 9 = 15 ∧
    StrictMonoOn (fun x : ℝ => x ^ 3 - 3 * x ^ 2 - 9 * x + 2) (Iio (-1)) ∧
    StrictAntiOn (fun x : ℝ => x ^ 3 - 3 * x ^ 2 - 9 * x + 2) (Ioo (-1) 3) ∧
    StrictMonoOn (fun x : ℝ => x ^ 3 - 3 * x ^ 2 - 9 * x + 2) (Ioi 3) := by
  have hd := fun x => (primer2_odvod x).1
  refine ⟨by norm_num, by norm_num, by norm_num, narasca hd (convex_Iio _) fun x hx => ?_,
    pada hd (convex_Ioo _ _) fun x hx => ?_, narasca hd (convex_Ioi _) fun x hx => ?_⟩
  · rw [interior_Iio] at hx; have : x < -1 := hx; nlinarith
  · rw [interior_Ioo] at hx; nlinarith [hx.1, hx.2]
  · rw [interior_Ioi] at hx; have : 3 < x := hx; nlinarith

/-- Primer 2, koraka 4–5: v −1 se predznak f' zamenja iz + v −, lokalni maksimum
f(−1) = −1 − 3 + 9 + 2 = 7; v 3 iz − v +, lokalni minimum f(3) = 27 − 27 − 27 + 2 = −25. -/
theorem primer2_ekstrema :
    IsLocalMax (fun x : ℝ => x ^ 3 - 3 * x ^ 2 - 9 * x + 2) (-1) ∧
    (-1:ℝ) ^ 3 - 3 * (-1) ^ 2 - 9 * (-1) + 2 = -1 - 3 + 9 + 2 ∧ (-1:ℝ) - 3 + 9 + 2 = 7 ∧
    IsLocalMin (fun x : ℝ => x ^ 3 - 3 * x ^ 2 - 9 * x + 2) 3 ∧
    (3:ℝ) ^ 3 - 3 * 3 ^ 2 - 9 * 3 + 2 = 27 - 27 - 27 + 2 ∧ (27:ℝ) - 27 - 27 + 2 = -25 := by
  have hd := fun x => (primer2_odvod x).1
  refine ⟨lokalni_maksimum hd (show (-2:ℝ) < -1 by norm_num) (show (-1:ℝ) < 0 by norm_num) ?_ ?_,
    by norm_num, by norm_num,
    lokalni_minimum hd (show (2:ℝ) < 3 by norm_num) (show (3:ℝ) < 4 by norm_num) ?_ ?_,
    by norm_num, by norm_num⟩
  · intro x hx; nlinarith [hx.1, hx.2]
  · intro x hx; nlinarith [hx.1, hx.2]
  · intro x hx; nlinarith [hx.1, hx.2]
  · intro x hx; nlinarith [hx.1, hx.2]

/-- Primer 3, koraka 1–2: D(c) = (c − 20)(600 − 10c) = −10c² + 800c − 12000; smiselne cene
c ≥ 20 in 600 − 10c ≥ 0, torej 20 ≤ c ≤ 60. -/
theorem primer3_funkcija (c : ℝ) :
    (c - 20) * (600 - 10 * c) = -10 * c ^ 2 + 800 * c - 12000 ∧
    (20 ≤ c ∧ 0 ≤ 600 - 10 * c ↔ 20 ≤ c ∧ c ≤ 60) := by
  refine ⟨by ring, ⟨fun ⟨h1, h2⟩ => ⟨h1, by linarith⟩, fun ⟨h1, h2⟩ => ⟨h1, by linarith⟩⟩⟩

/-- Primer 3, koraki 3–4: D'(c) = −20c + 800, D'(c) = 0 ⇔ c = 40; D'(30) = 200 > 0, D'(50) = −200 < 0. -/
theorem primer3_odvod (c : ℝ) :
    HasDerivAt (fun c : ℝ => -10 * c ^ 2 + 800 * c - 12000) (-20 * c + 800) c ∧
    (-20 * c + 800 = 0 ↔ c = 40) ∧ (-20:ℝ) * 30 + 800 = 200 ∧ (-20:ℝ) * 50 + 800 = -200 := by
  refine ⟨?_, ⟨fun h => by linarith, fun h => by subst h; norm_num⟩, by norm_num, by norm_num⟩
  exact ((((hasDerivAt_pow 2 c).const_mul (-10)).add ((hasDerivAt_id' c).const_mul 800)).sub_const
    12000).congr_deriv (by push_cast; ring)

/-- Primer 3, koraki 5–7: D(20) = 0, D(60) = 0; pri c = 40 proda 600 − 400 = 200 kosov in
D(40) = 20 · 200 = 4000; to je največji dobiček na [20, 60]. -/
theorem primer3_maksimum :
    ((20:ℝ) - 20) * (600 - 10 * 20) = 0 ∧ ((60:ℝ) - 20) * (600 - 10 * 60) = 0 ∧
    (600:ℝ) - 10 * 40 = 600 - 400 ∧ (600:ℝ) - 400 = 200 ∧ ((40:ℝ) - 20) * 200 = 20 * 200 ∧
    (20:ℝ) * 200 = 4000 ∧ IsMaxOn (fun c : ℝ => (c - 20) * (600 - 10 * c)) (Icc 20 60) 40 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  intro c _
  show (c - 20) * (600 - 10 * c) ≤ (40 - 20) * (600 - 10 * 40)
  nlinarith [sq_nonneg (c - 40)]

/-- Primer 4, koraka 1–2: V(x) = x(30 − 2x)², V'(x) = (30 − 2x)² + x · 2(30 − 2x) · (−2)
= (30 − 2x)² − 4x(30 − 2x) = (30 − 2x)(30 − 6x). -/
theorem primer4_odvod (x : ℝ) :
    HasDerivAt (fun x : ℝ => x * (30 - 2 * x) ^ 2) ((30 - 2 * x) ^ 2 + x * (2 * (30 - 2 * x) * (-2))) x ∧
    (30 - 2 * x) ^ 2 + x * (2 * (30 - 2 * x) * (-2)) = (30 - 2 * x) ^ 2 - 4 * x * (30 - 2 * x) ∧
    (30 - 2 * x) ^ 2 - 4 * x * (30 - 2 * x) = (30 - 2 * x) * (30 - 6 * x) := by
  refine ⟨?_, by ring, by ring⟩
  have hin : HasDerivAt (fun x : ℝ => 30 - 2 * x) (-2) x :=
    ((hasDerivAt_id' x).const_mul 2).const_sub 30 |>.congr_deriv (by ring)
  exact ((hasDerivAt_id' x).mul (hin.pow 2)).congr_deriv (by simp only [Pi.pow_apply]; push_cast; ring)

/-- Primer 4, korak 3: znotraj (0, 15) je V'(x) = 0 le pri x = 5. -/
theorem primer4_stacionarna (x : ℝ) (hx : x ∈ Ioo (0:ℝ) 15) :
    (30 - 2 * x) * (30 - 6 * x) = 0 ↔ x = 5 := by
  constructor
  · intro h
    rcases mul_eq_zero.mp h with h | h
    · linarith [hx.2]
    · linarith
  · rintro rfl; norm_num

example : (5:ℝ) ∈ Ioo (0:ℝ) 15 := by norm_num

/-- Primer 4, Premisli: V'(4) > 0, V'(6) < 0, torej maksimum; V(5) = 5 · 20² = 2000 cm³ (2 litra), največja
prostornina na (0, 15). -/
theorem primer4_maksimum :
    (0:ℝ) < (30 - 2 * 4) * (30 - 6 * 4) ∧ (30 - 2 * 6) * (30 - 6 * 6) < (0:ℝ) ∧
    (5:ℝ) * (30 - 2 * 5) ^ 2 = 5 * 20 ^ 2 ∧ (5:ℝ) * 20 ^ 2 = 2000 ∧
    IsMaxOn (fun x : ℝ => x * (30 - 2 * x) ^ 2) (Ioo 0 15) 5 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  intro x hx
  have hx' : x ∈ Ioo (0:ℝ) 15 := hx
  show x * (30 - 2 * x) ^ 2 ≤ 5 * (30 - 2 * 5) ^ 2
  nlinarith [mul_nonneg (sq_nonneg (x - 5)) (show (0:ℝ) ≤ 20 - x by linarith [hx'.2])]

/-- Primer 5: f'(1) = 2, g'(1) = −2, T(1, 1) leži na obeh parabolah; normala k_n = −1/2,
y = 1 − 1/2 (x − 1) = −x/2 + 3/2; tan φ = |(−2 − 2)/(1 + 2 · (−2))| = 4/3. -/
theorem primer5 (x : ℝ) :
    HasDerivAt (fun x : ℝ => x ^ 2) 2 1 ∧ HasDerivAt (fun x : ℝ => 2 - x ^ 2) (-2) 1 ∧
    (1:ℝ) ^ 2 = 1 ∧ (2:ℝ) - 1 ^ 2 = 1 ∧ -(1:ℝ) / 2 = -1 / 2 ∧
    1 - 1 / 2 * (x - 1) = -x / 2 + 3 / 2 ∧ |((-2:ℝ) - 2) / (1 + 2 * (-2))| = 4 / 3 := by
  refine ⟨(hasDerivAt_pow 2 (1:ℝ)).congr_deriv (by norm_num),
    ((hasDerivAt_pow 2 (1:ℝ)).const_sub 2).congr_deriv (by norm_num), by norm_num, by norm_num,
    by norm_num, by ring, ?_⟩
  rw [show ((-2:ℝ) - 2) / (1 + 2 * (-2)) = 4 / 3 by norm_num, abs_of_pos (by norm_num)]

/-- Pogoste napake 3: prihodek je pri 1,40 € pozitiven (308 €), pa vseeno pada: R'(1,4) = −60 < 0. -/
theorem napaka_pozitivna : (0:ℝ) < 500 * 1.4 - 200 * 1.4 ^ 2 ∧ (500:ℝ) - 400 * 1.4 = -60 := by
  norm_num

/-! ## Za maturo -/

/-- Naloga 1: f'(x) = 2x − 4, 2x − 4 = 2 ⇔ x = 3, f(3) = 9 − 12 + 5 = 2, tangenta y = 2 + 2(x − 3) = 2x − 4. -/
theorem matura1 (x : ℝ) :
    HasDerivAt (fun x : ℝ => x ^ 2 - 4 * x + 5) (2 * x - 4) x ∧ (2 * x - 4 = 2 ↔ x = 3) ∧
    (3:ℝ) ^ 2 - 4 * 3 + 5 = 9 - 12 + 5 ∧ (9:ℝ) - 12 + 5 = 2 ∧ 2 + 2 * (x - 3) = 2 * x - 4 := by
  refine ⟨?_, ⟨fun h => by linarith, fun h => by subst h; norm_num⟩, by norm_num, by norm_num, by ring⟩
  exact (((hasDerivAt_pow 2 x).sub ((hasDerivAt_id' x).const_mul 4)).add_const 5).congr_deriv
    (by push_cast; ring)

/-- Naloga 2 a): f(x) = x(x² − 6x + 9) = x(x − 3)², ničli sta 0 in 3. -/
theorem matura2a (x : ℝ) :
    x ^ 3 - 6 * x ^ 2 + 9 * x = x * (x ^ 2 - 6 * x + 9) ∧ x * (x ^ 2 - 6 * x + 9) = x * (x - 3) ^ 2 ∧
    (x * (x - 3) ^ 2 = 0 ↔ x = 0 ∨ x = 3) := by
  refine ⟨by ring, by ring, ⟨fun h => ?_, ?_⟩⟩
  · rcases mul_eq_zero.mp h with h | h
    · left; exact h
    · right; have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Naloga 2 b): f'(x) = 3x² − 12x + 9 = 3(x − 1)(x − 3), stacionarni točki 1 in 3; f'(0) = 9, f'(2) = −3,
f'(4) = 9; f' < 0 natanko na (1, 3). -/
theorem matura2b_odvod (x : ℝ) :
    HasDerivAt (fun x : ℝ => x ^ 3 - 6 * x ^ 2 + 9 * x) (3 * x ^ 2 - 12 * x + 9) x ∧
    3 * x ^ 2 - 12 * x + 9 = 3 * (x - 1) * (x - 3) ∧
    (3 * x ^ 2 - 12 * x + 9 = 0 ↔ x = 1 ∨ x = 3) ∧ (3 * x ^ 2 - 12 * x + 9 < 0 ↔ 1 < x ∧ x < 3) ∧
    (3:ℝ) * 0 ^ 2 - 12 * 0 + 9 = 9 ∧ (3:ℝ) * 2 ^ 2 - 12 * 2 + 9 = -3 ∧ (3:ℝ) * 4 ^ 2 - 12 * 4 + 9 = 9 := by
  refine ⟨?_, by ring, ⟨fun h => ?_, ?_⟩, ⟨fun h => ?_, fun h => by nlinarith [h.1, h.2]⟩,
    by norm_num, by norm_num, by norm_num⟩
  · exact (((hasDerivAt_pow 3 x).sub ((hasDerivAt_pow 2 x).const_mul 6)).add
      ((hasDerivAt_id' x).const_mul 9)).congr_deriv (by push_cast; ring)
  · have : (x - 1) * (x - 3) = 0 := by nlinarith
    rcases mul_eq_zero.mp this with h | h
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num
  · by_contra hc
    rcases not_and_or.mp hc with h1 | h1
    · nlinarith [not_lt.mp h1]
    · nlinarith [not_lt.mp h1]

/-- Naloga 2 b): f narašča na (−∞, 1) in (3, ∞), pada na (1, 3); lokalni maksimum f(1) = 1 − 6 + 9 = 4,
lokalni minimum f(3) = 0. -/
theorem matura2b_ekstremi :
    StrictMonoOn (fun x : ℝ => x ^ 3 - 6 * x ^ 2 + 9 * x) (Iio 1) ∧
    StrictAntiOn (fun x : ℝ => x ^ 3 - 6 * x ^ 2 + 9 * x) (Ioo 1 3) ∧
    StrictMonoOn (fun x : ℝ => x ^ 3 - 6 * x ^ 2 + 9 * x) (Ioi 3) ∧
    IsLocalMax (fun x : ℝ => x ^ 3 - 6 * x ^ 2 + 9 * x) 1 ∧ (1:ℝ) ^ 3 - 6 * 1 ^ 2 + 9 * 1 = 1 - 6 + 9 ∧
    (1:ℝ) - 6 + 9 = 4 ∧ IsLocalMin (fun x : ℝ => x ^ 3 - 6 * x ^ 2 + 9 * x) 3 ∧
    (3:ℝ) ^ 3 - 6 * 3 ^ 2 + 9 * 3 = 0 := by
  have hd := fun x => (matura2b_odvod x).1
  refine ⟨narasca hd (convex_Iio _) fun x hx => ?_, pada hd (convex_Ioo _ _) fun x hx => ?_,
    narasca hd (convex_Ioi _) fun x hx => ?_,
    lokalni_maksimum hd (show (0:ℝ) < 1 by norm_num) (show (1:ℝ) < 2 by norm_num) ?_ ?_, by norm_num,
    by norm_num, lokalni_minimum hd (show (2:ℝ) < 3 by norm_num) (show (3:ℝ) < 4 by norm_num) ?_ ?_,
    by norm_num⟩
  · rw [interior_Iio] at hx; have : x < 1 := hx; nlinarith
  · rw [interior_Ioo] at hx; nlinarith [hx.1, hx.2]
  · rw [interior_Ioi] at hx; have : 3 < x := hx; nlinarith
  all_goals intro x hx; nlinarith [hx.1, hx.2]

/-- Naloga 2 c), oporne točke (RACUN): f(−1) = −16 in f(4) = 4. -/
theorem matura2c :
    (-1:ℝ) ^ 3 - 6 * (-1) ^ 2 + 9 * (-1) = -16 ∧ (4:ℝ) ^ 3 - 6 * 4 ^ 2 + 9 * 4 = 4 := by norm_num

/-- Naloga 3 a): iz πr²h = 2 sledi h = 2/(πr²); stroški C = 0,6 · πr² + 0,3 · 2πrh, z vstavljenim h
0,3 · 2πr · 2/(πr²) = 1,2/r, torej C(r) = 0,6πr² + 1,2/r (r > 0). -/
theorem matura3a (r h : ℝ) (hr : 0 < r) :
    (π * r ^ 2 * h = 2 ↔ h = 2 / (π * r ^ 2)) ∧ 0.3 * (2 * π * r) * (2 / (π * r ^ 2)) = 1.2 / r ∧
    0.6 * (π * r ^ 2) + 0.3 * (2 * π * r) * (2 / (π * r ^ 2)) = 0.6 * π * r ^ 2 + 1.2 / r := by
  have hp : 0 < π * r ^ 2 := by positivity
  refine ⟨⟨fun e => by field_simp; linarith, fun e => by rw [e]; field_simp⟩, ?_, ?_⟩
  · field_simp; ring
  · field_simp; ring

example : (0:ℝ) < 1 := one_pos

/-- Naloga 3 b): C'(r) = 1,2πr − 1,2/r² (r > 0). -/
theorem matura3b_odvod (r : ℝ) (hr : 0 < r) :
    HasDerivAt (fun r : ℝ => 0.6 * π * r ^ 2 + 1.2 / r) (1.2 * π * r - 1.2 / r ^ 2) r := by
  have h1 := (hasDerivAt_pow 2 r).const_mul (0.6 * π)
  have h2 := (hasDerivAt_const r (1.2:ℝ)).div (hasDerivAt_id' r) hr.ne'
  exact (h1.add h2).congr_deriv (by field_simp; ring)

example : (0:ℝ) < 1 := one_pos

/-- Naloga 3 b): C'(r) = 0 ⇔ 1,2πr³ = 1,2 ⇔ r³ = 1/π (r > 0). -/
theorem matura3b_stacionarna (r : ℝ) (hr : 0 < r) :
    (1.2 * π * r - 1.2 / r ^ 2 = 0 ↔ 1.2 * π * r ^ 3 = 1.2) ∧ (1.2 * π * r ^ 3 = 1.2 ↔ r ^ 3 = 1 / π) := by
  have hp := pi_pos
  constructor
  · constructor
    · intro h; field_simp at h; nlinarith
    · intro h; field_simp; nlinarith
  · constructor
    · intro h; field_simp; nlinarith
    · intro h; field_simp at h; nlinarith

example : (0:ℝ) < 1 := one_pos

/-- Naloga 3 b): r₀ = ∛(1/π) obstaja (r₀ > 0, πr₀³ = 1). -/
theorem matura3b_r0 : 0 < (1 / π) ^ ((1:ℝ) / 3) ∧ π * ((1 / π) ^ ((1:ℝ) / 3)) ^ 3 = 1 := by
  have hp := pi_pos
  refine ⟨by positivity, ?_⟩
  rw [← rpow_natCast, ← rpow_mul (by positivity)]
  norm_num

/-- Naloga 3 b): pri r₀ (πr₀³ = 1) so stroški najmanjši na (0, ∞): za manjši r je C' < 0, za večji C' > 0,
C(r) ≥ C(r₀) za vsak r > 0. -/
theorem matura3b_minimum (r₀ : ℝ) (h0 : 0 < r₀) (hπ : π * r₀ ^ 3 = 1) :
    (∀ r, 0 < r → r < r₀ → 1.2 * π * r - 1.2 / r ^ 2 < 0) ∧
    (∀ r, r₀ < r → 0 < 1.2 * π * r - 1.2 / r ^ 2) ∧
    IsMinOn (fun r : ℝ => 0.6 * π * r ^ 2 + 1.2 / r) (Ioi 0) r₀ := by
  have hp := pi_pos
  have key : ∀ r, 0 < r → 1.2 * π * r - 1.2 / r ^ 2 = 1.2 * (π * r ^ 3 - π * r₀ ^ 3) / r ^ 2 := by
    intro r hr; rw [hπ]; field_simp
  refine ⟨fun r hr hlt => ?_, fun r hlt => ?_, fun r hr => ?_⟩
  · rw [key r hr]
    have : r ^ 3 < r₀ ^ 3 := by gcongr
    apply div_neg_of_neg_of_pos _ (by positivity)
    nlinarith
  · have hr : 0 < r := h0.trans hlt
    rw [key r hr]
    have : r₀ ^ 3 < r ^ 3 := by gcongr
    apply div_pos _ (by positivity)
    nlinarith
  · have hr' : 0 < r := hr
    show 0.6 * π * r₀ ^ 2 + 1.2 / r₀ ≤ 0.6 * π * r ^ 2 + 1.2 / r
    have e1 : 0.6 * π * r₀ ^ 2 + 1.2 / r₀ = 1.8 * π * r₀ ^ 2 := by
      field_simp; nlinarith
    rw [e1, ← sub_nonneg]
    have : 0.6 * π * r ^ 2 + 1.2 / r - 1.8 * π * r₀ ^ 2 =
        0.6 * π * (r - r₀) ^ 2 * (r + 2 * r₀) / r := by
      field_simp; nlinarith
    rw [this]; positivity

/-- Predpostavke trditve `matura3b_minimum` so izpolnljive (r₀ = ∛(1/π)). -/
example : ∃ r₀ : ℝ, 0 < r₀ ∧ π * r₀ ^ 3 = 1 := ⟨_, matura3b_r0⟩

/-- Naloga 3 b), c): r₀ ≐ 0,68278 dm (na milimeter 0,683 dm ≐ 6,8 cm); višina h = 2/(πr₀²) = 2r₀ ≐ 1,3656 dm
(13,7 cm); stroški 0,6πr₀² ≐ 0,8788, 1,2/r₀ ≐ 1,7575, C(r₀) ≐ 2,6363 ≐ 2,64 €. -/
theorem matura3_stevila (r₀ : ℝ) (h0 : 0 < r₀) (hπ : π * r₀ ^ 3 = 1) :
    (0.682775 < r₀ ∧ r₀ < 0.682785) ∧ 2 / (π * r₀ ^ 2) = 2 * r₀ ∧
    (1.36555 < 2 * r₀ ∧ 2 * r₀ < 1.36565) ∧
    (0.87875 < 0.6 * π * r₀ ^ 2 ∧ 0.6 * π * r₀ ^ 2 < 0.87885) ∧
    (1.75745 < 1.2 / r₀ ∧ 1.2 / r₀ < 1.75755) ∧
    (2.63625 < 0.6 * π * r₀ ^ 2 + 1.2 / r₀ ∧ 0.6 * π * r₀ ^ 2 + 1.2 / r₀ < 2.63635) := by
  have p1 := pi_gt_d6
  have p2 := pi_lt_d6
  have hlo : 0.682775 < r₀ := by
    by_contra h; rw [not_lt] at h
    have : r₀ ^ 3 ≤ 0.682775 ^ 3 := by gcongr
    nlinarith
  have hhi : r₀ < 0.682785 := by
    by_contra h; rw [not_lt] at h
    have : 0.682785 ^ 3 ≤ r₀ ^ 3 := by gcongr
    nlinarith
  have hpr : π * r₀ ^ 2 = 1 / r₀ := by field_simp; linarith
  have e6 : 0.6 * π * r₀ ^ 2 = 0.6 / r₀ := by rw [mul_assoc, hpr]; ring
  refine ⟨⟨hlo, hhi⟩, by rw [hpr]; field_simp, ⟨by linarith, by linarith⟩, ?_, ?_, ?_⟩
  · rw [e6]; constructor
    · rw [lt_div_iff₀ h0]; nlinarith
    · rw [div_lt_iff₀ h0]; nlinarith
  · constructor
    · rw [lt_div_iff₀ h0]; nlinarith
    · rw [div_lt_iff₀ h0]; nlinarith
  · rw [e6, ← add_div]; constructor
    · rw [lt_div_iff₀ h0]; nlinarith
    · rw [div_lt_iff₀ h0]; nlinarith

/-- Naloga 3 c): pri πr³ = 1 je h = 2/(πr²) = 2r³/r² = 2r, višina je enaka premeru dna. -/
theorem matura3c_premer (r : ℝ) (hr : 0 < r) (hπ : π * r ^ 3 = 1) :
    2 / (π * r ^ 2) = 2 * r ^ 3 / r ^ 2 ∧ 2 * r ^ 3 / r ^ 2 = 2 * r := by
  have hp := pi_pos
  constructor
  · field_simp; nlinarith
  · field_simp

example : ∃ r : ℝ, 0 < r ∧ π * r ^ 3 = 1 := ⟨_, matura3b_r0⟩

/-! ## Preveri se -/

/-- Preveri se 2: pri f(x) = x² so smerni koeficienti tangent v −1, 0, 2 enaki −2, 0, 4 (vrstni red
−1, 0, 2). -/
theorem kviz2 : (2:ℝ) * (-1) = -2 ∧ (2:ℝ) * 0 = 0 ∧ (2:ℝ) * 2 = 4 ∧ (-2:ℝ) < 0 ∧ (0:ℝ) < 4 := by norm_num

/-- Preveri se 3: desno od 1,25 je R' < 0, R(1,40) = 1,40 · 220 = 308 < 312,50. -/
theorem kviz3 :
    (∀ x : ℝ, 1.25 < x → 500 - 400 * x < 0) ∧ (1.4:ℝ) * 220 = 308 ∧ (308:ℝ) < 312.5 ∧
    StrictAntiOn (fun x : ℝ => 500 * x - 200 * x ^ 2) (Ici 1.25) := by
  refine ⟨fun x hx => by linarith, by norm_num, by norm_num, ?_⟩
  refine pada (fun x => (rogljicki_tangenta x).1) (convex_Ici _) fun x hx => ?_
  rw [interior_Ici] at hx; have : (1.25:ℝ) < x := hx; linarith

/-- Preveri se 4: f(x) = x² − 2x, f(3) = 3, f'(3) = 4, tangenta y = 3 + 4(x − 3) = 4x − 9, n = −9. -/
theorem kviz4 (x : ℝ) :
    (3:ℝ) ^ 2 - 2 * 3 = 3 ∧ HasDerivAt (fun x : ℝ => x ^ 2 - 2 * x) 4 3 ∧
    3 + 4 * (x - 3) = 4 * x - 9 := by
  refine ⟨by norm_num, ?_, by ring⟩
  exact ((hasDerivAt_pow 2 (3:ℝ)).sub ((hasDerivAt_id' (3:ℝ)).const_mul 2)).congr_deriv (by norm_num)

/-- Preveri se 5: D(x) = −2x² + 120x − 1000, D'(x) = −4x + 120 = 0 ⇔ x = 30,
D(30) = −1800 + 3600 − 1000 = 800 je največji dobiček. -/
theorem kviz5 (x : ℝ) :
    HasDerivAt (fun x : ℝ => -2 * x ^ 2 + 120 * x - 1000) (-4 * x + 120) x ∧
    (-4 * x + 120 = 0 ↔ x = 30) ∧ (-2:ℝ) * 30 ^ 2 + 120 * 30 - 1000 = -1800 + 3600 - 1000 ∧
    (-1800:ℝ) + 3600 - 1000 = 800 ∧ -2 * x ^ 2 + 120 * x - 1000 ≤ 800 := by
  refine ⟨?_, ⟨fun h => by linarith, fun h => by subst h; norm_num⟩, by norm_num, by norm_num,
    by nlinarith [sq_nonneg (x - 30)]⟩
  exact ((((hasDerivAt_pow 2 x).const_mul (-2)).add ((hasDerivAt_id' x).const_mul 120)).sub_const
    1000).congr_deriv (by push_cast; ring)

end Evklid.Lekcije.MAT_SS_4.UporabaOdvoda
