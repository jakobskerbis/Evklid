/-
vir: content/lessons/MAT-SS-1/nacrtovalne-naloge.md
sha256: 71d5e0aea8448673edc364cf958774c060357af8ee06be8b53327e0f2df1d0b9
Model: ravnina je ℂ, A = 0, B = c > 0 na realni osi. Krak kota α z vrhom A je {t·(k + si) | t > 0} s k = cos α,
s = sin α (k² + s² = 1, k, s > 0 za ostri kot; 30°: k = √3/2, s = 1/2; 45°: k = s = √2/2). Oglišče C na kraku z
|BC| = a je t > 0 z |t(k + si) − c| = a (t = |AC|); t = 0 (točka A) ni trikotnik. Krožnici k(A, b) in k(B, a) sta
množici točk z |z| = b in |z − c| = a. Vzporednica na razdalji v_c je Im z = v_c. Koti `∠` so v radianih, stopinjski
računi kot števila. »≈ a« je |vrednost − a| < ½·10⁻ᵏ.
Ni v Leanu: zgodbe (Nika, ceste, ladja, Tine), risbe in simulacija »Načrtovanje trikotnikov in štirikotnikov«;
štirje deli rešitve (skica, opis, načrtovanje, diskusija), opisi načrtovanja in navodila za ravnilo in šestilo kot
postopki; dinamična geometrija (GeoGebra, test vlečenja, Naloga 3 a) in e), kviz 3, Ustno vprašanje 3) kot opis
programov; množice točk iz razlage 4 so definicije (krožnica, krak, vzporednica; za R je dokazano le, da je središče
na simetrali AB, glej `sredisce_na_simetrali`); »trikotnik na drugi strani AB je skladen« pri Primeru 2 (dokazano je
le, da je C na vzporednici nad AB en sam); pri Nalogi 2 c) »enako velja za vzporednico na drugi strani AB«
(simetrija, zahtevno, še ni dokazano; dokazano je za vzporednico Im z = v); izmerjene vrednosti (|AB| ≈ 4,6 cm, α = 60° »če izmeriš«) so dokazane z
računom; število presečišč krožnic k(A, b), k(B, a) (dokazana sta pogoj za presečišče in razcep, `krozjici`, štetje:
zahtevno, še ni dokazano); Pogoste napake, Postopek, Pazi na, točkovanje, razvrščanje korakov (kviz 5).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.NacrtovalneNaloge

open Real EuclideanGeometry
open scoped Congruent

variable {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P] [NormedAddTorsor V P]

/-- Pomožno: kvadrat razdalje v ℂ iz koordinat. -/
theorem dist_c_sq (z w : ℂ) : dist z w ^ 2 = (z.re - w.re) ^ 2 + (z.im - w.im) ^ 2 := by
  rw [Complex.dist_eq_re_im, Real.sq_sqrt (by positivity)]

/-- Pomožno: razdalja v ℂ iz koordinat. -/
theorem dist_c {z w : ℂ} {d : ℝ} (hd : 0 ≤ d) (h : (z.re - w.re) ^ 2 + (z.im - w.im) ^ 2 = d ^ 2) :
    dist z w = d := by
  rw [Complex.dist_eq_re_im, h, Real.sqrt_sq hd]

/-- Predpostavke trditve `dist_c` se dajo izpolniti (z = 3, w = 0, d = 3). -/
example : (0 : ℝ) ≤ 3 ∧ ((3 : ℂ).re - (0 : ℂ).re) ^ 2 + ((3 : ℂ).im - (0 : ℂ).im) ^ 2 = 3 ^ 2 := by
  constructor <;> simp

/-- Pomožno: √(k²) = k za k ≥ 0. -/
theorem sqrt_kv {k : ℝ} (hk : 0 ≤ k) : √(k ^ 2) = k := Real.sqrt_sq hk

/-- Predpostavka trditve `sqrt_kv` se da izpolniti (k = 3). -/
example : (0 : ℝ) ≤ 3 := by norm_num

/-! ## 3. Osnovne konstrukcije kotov -/

/-- Razlaga 3, Naloga 1, Ustno vprašanje 2: kot enakostraničnega trikotnika VPQ (|VP| = |VQ| = |PQ|) meri π/3 (60°). -/
theorem kot60 {Vv Pp Q : P} (hP : Pp ≠ Vv) (h1 : dist Vv Pp = dist Vv Q) (h2 : dist Pp Q = dist Pp Vv) :
    ∠ Pp Vv Q = π / 3 := by
  have e1 := EuclideanGeometry.angle_eq_angle_of_dist_eq h1
  have e2 := EuclideanGeometry.angle_eq_angle_of_dist_eq h2
  have hs := EuclideanGeometry.angle_add_angle_add_angle_eq_pi Q hP
  rw [EuclideanGeometry.angle_comm Pp Q Vv] at e2
  linarith [EuclideanGeometry.angle_comm Vv Q Pp, EuclideanGeometry.angle_comm Q Pp Vv,
    EuclideanGeometry.angle_comm Pp Vv Q, EuclideanGeometry.angle_comm Q Vv Pp]

/-- Predpostavke trditve `kot60` se dajo izpolniti: V = 0, P = 2, Q = 1 + √3·i v ℂ. -/
example : (2 : ℂ) ≠ 0 ∧ dist (0 : ℂ) 2 = dist (0 : ℂ) ⟨1, √3⟩ ∧ dist (2 : ℂ) ⟨1, √3⟩ = dist (2 : ℂ) 0 := by
  have h3 : (√3 : ℝ) ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have e1 : dist (0 : ℂ) 2 = 2 := dist_c (by norm_num) (by simp)
  have e2 : dist (0 : ℂ) ⟨1, √3⟩ = 2 := dist_c (by norm_num) (by simp; norm_num)
  have e3 : dist (2 : ℂ) ⟨1, √3⟩ = 2 := dist_c (by norm_num) (by simp; norm_num)
  have e4 : dist (2 : ℂ) 0 = 2 := dist_c (by norm_num) (by simp)
  exact ⟨two_ne_zero, e1.trans e2.symm, e3.trans e4.symm⟩

/-- Razlaga 3, Ustno vprašanje 2 (simetrala kota): če je |VP| = |VQ| in |PT| = |QT|, sta trikotnika VPT in VQT
skladna (SSS), zato ∠PVT = ∠QVT; če VT leži v kotu (∠PVQ = ∠PVT + ∠TVQ), je ∠PVT = ∠PVQ/2. -/
theorem simetrala_kota {Vv Pp Q T : P} (h1 : dist Vv Pp = dist Vv Q) (h2 : dist Pp T = dist Q T)
    (h : ∠ Pp Vv Q = ∠ Pp Vv T + ∠ T Vv Q) : ∠ Pp Vv T = ∠ Q Vv T ∧ ∠ Pp Vv T = ∠ Pp Vv Q / 2 := by
  have hc := side_side_side h1 h2 (rfl : dist T Vv = dist T Vv)
  have e : ∠ Pp Vv T = ∠ Q Vv T := by simpa using angle_eq_of_congruent hc 1 0 2
  refine ⟨e, ?_⟩
  rw [h, EuclideanGeometry.angle_comm T Vv Q, ← e]; ring

/-- Pomožno: kota med 1 in 1 + i ter med 1 + i in i v ℂ sta π/4. -/
theorem kota_pi4 : InnerProductGeometry.angle (1 : ℂ) (1 + Complex.I) = π / 4 ∧
    InnerProductGeometry.angle (1 + Complex.I) Complex.I = π / 4 := by
  have hn1 : ‖(1 : ℂ) + Complex.I‖ = √2 := by
    rw [Complex.norm_eq_sqrt_sq_add_sq]; norm_num
  have hc : (√2 : ℝ)⁻¹ = Real.cos (π / 4) := by
    rw [Real.cos_pi_div_four]; field_simp; rw [Real.sq_sqrt (by norm_num)]
  unfold InnerProductGeometry.angle
  rw [hn1]
  constructor <;> simp [Complex.inner] <;> rw [hc, Real.arccos_cos (by positivity) (by linarith [pi_pos])]

/-- Predpostavke trditve `simetrala_kota` se dajo izpolniti: V = 0, P = 1, Q = i, T = 1 + i v ℂ
(∠PVQ = π/2 = π/4 + π/4). -/
example : dist (0 : ℂ) 1 = dist (0 : ℂ) Complex.I ∧ dist (1 : ℂ) (1 + Complex.I) = dist Complex.I (1 + Complex.I) ∧
    ∠ (1 : ℂ) 0 Complex.I = ∠ (1 : ℂ) 0 (1 + Complex.I) + ∠ (1 + Complex.I) 0 Complex.I := by
  refine ⟨by simp, ?_, ?_⟩
  · rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]; norm_num
  · simp only [EuclideanGeometry.angle, vsub_eq_sub, sub_zero]
    rw [(InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two _ _).mp (by simp [Complex.inner]),
      kota_pi4.1, kota_pi4.2]
    ring

/-- Razlaga 3, premisli 1, Naloga 1 in `RACUN`: 60/2 = 30, 30/2 = 15, 90/2 = 45, 60 + 60 = 120;
75 = 60 + 15 = 45 + 30 = 90 − 15; 105 = 60 + 45 = 90 + 15 = 120 − 15. -/
theorem koti : (60 : ℝ) / 2 = 30 ∧ (30 : ℝ) / 2 = 15 ∧ (90 : ℝ) / 2 = 45 ∧ (60 : ℝ) + 60 = 120 ∧
    (75 : ℝ) = 60 + 15 ∧ (75 : ℝ) = 45 + 30 ∧ (75 : ℝ) = 90 - 15 ∧ (60 : ℝ) + 45 = 105 ∧ (105 : ℝ) = 90 + 15 ∧
    (105 : ℝ) = 120 - 15 := by norm_num

/-! ## 4., 5. Lega oglišča in diskusija -/

/-- Razlaga 4: središče očrtane krožnice (enako oddaljeno od A in B) leži na simetrali AB. -/
theorem sredisce_na_simetrali {A B O : P} (h : dist O A = dist O B) : O ∈ AffineSubspace.perpBisector A B :=
  AffineSubspace.mem_perpBisector_iff_dist_eq.mpr h

/-- Predpostavka trditve `sredisce_na_simetrali` se da izpolniti (O = 0, A = 1, B = −1 v ℂ). -/
example : dist (0 : ℂ) 1 = dist (0 : ℂ) (-1) := by simp

/-- Pomožno: kvadrat razdalje točke t(k + si) na kraku od B = c je (t − ck)² + (cs)² (pri k² + s² = 1). -/
theorem krak_razdalja (c k s t : ℝ) (h : k ^ 2 + s ^ 2 = 1) :
    dist ((t : ℂ) * ⟨k, s⟩) c ^ 2 = (t - c * k) ^ 2 + (c * s) ^ 2 := by
  rw [dist_c_sq]; simp; linear_combination (t ^ 2 - c ^ 2) * h

/-- Razlaga 5: nožišče pravokotnice iz B na krak je D = ck(k + si), |BD| = d = cs in BD ⊥ AD; pri α = 30°
(s = 1/2) je d = c/2. -/
theorem nozisce (c k s : ℝ) (hc : 0 < c) (hs : 0 < s) (h : k ^ 2 + s ^ 2 = 1) :
    dist (((c * k : ℝ) : ℂ) * ⟨k, s⟩) c = c * s ∧
      inner ℝ ((((c * k : ℝ) : ℂ) * ⟨k, s⟩) - 0) ((c : ℂ) - ((c * k : ℝ) : ℂ) * ⟨k, s⟩) = 0 := by
  constructor
  · have := krak_razdalja c k s (c * k) h
    rw [sub_self, zero_pow two_ne_zero, zero_add] at this
    exact (sq_eq_sq₀ dist_nonneg (by positivity)).mp this
  · simp [Complex.inner]; linear_combination (-(c ^ 2 * k ^ 2)) * h

/-- Predpostavke trditev o kraku se dajo izpolniti: 30° (k = √3/2, s = 1/2) in 45° (k = s = √2/2). -/
theorem kot30_45 : (√3 / 2 : ℝ) ^ 2 + (1 / 2) ^ 2 = 1 ∧ (√2 / 2 : ℝ) ^ 2 + (√2 / 2) ^ 2 = 1 ∧
    Real.cos (π / 6) = √3 / 2 ∧ Real.sin (π / 6) = 1 / 2 ∧ Real.cos (π / 4) = √2 / 2 ∧ Real.sin (π / 4) = √2 / 2 := by
  have h3 : (√3 : ℝ) ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have h2 : (√2 : ℝ) ^ 2 = 2 := Real.sq_sqrt (by norm_num)
  refine ⟨?_, ?_, Real.cos_pi_div_six, Real.sin_pi_div_six, Real.cos_pi_div_four, Real.sin_pi_div_four⟩
  · rw [div_pow, h3]; norm_num
  · rw [div_pow, h2]; norm_num

/-- Predpostavke trditev `krak_razdalja`, `nozisce` in `dotik_pravi_kot` se dajo izpolniti (c = 6, 30°). -/
example : (0 : ℝ) < 6 ∧ (0 : ℝ) < 1 / 2 ∧ (√3 / 2 : ℝ) ^ 2 + (1 / 2) ^ 2 = 1 :=
  ⟨by norm_num, by norm_num, kot30_45.1⟩

/-- Razlaga 5 in Povzetek (diskusija za dve stranici in kot, ki ni med njima): legi C na kraku (t = |AC| > 0) z
|BC| = a. Za d = cs: a < d — ni rešitve; a = d — ena (t = ck, C = D); d < a < c — dve različni,
t = ck ∓ √(a² − d²); a ≥ c — ena, t = ck + √(a² − d²) (druga »rešitev« ni na kraku, pri a = c je točka A). -/
theorem diskusija (c k s a : ℝ) (hc : 0 < c) (hk : 0 < k) (hs : 0 < s) (h : k ^ 2 + s ^ 2 = 1) (ha : 0 < a) :
    let S := {t : ℝ | 0 < t ∧ dist ((t : ℂ) * ⟨k, s⟩) c = a}
    (a < c * s → S = ∅) ∧ (a = c * s → S = {c * k}) ∧
      (c * s < a → a < c → S = {c * k - √(a ^ 2 - (c * s) ^ 2), c * k + √(a ^ 2 - (c * s) ^ 2)} ∧
        c * k - √(a ^ 2 - (c * s) ^ 2) ≠ c * k + √(a ^ 2 - (c * s) ^ 2)) ∧
      (c ≤ a → S = {c * k + √(a ^ 2 - (c * s) ^ 2)}) := by
  intro S
  have key : ∀ t : ℝ, t ∈ S ↔ 0 < t ∧ (t - c * k) ^ 2 = a ^ 2 - (c * s) ^ 2 := by
    intro t
    simp only [S, Set.mem_ofPred_eq]
    constructor
    · rintro ⟨ht, hd⟩
      refine ⟨ht, ?_⟩
      have := krak_razdalja c k s t h
      rw [hd] at this; linarith
    · rintro ⟨ht, hd⟩
      refine ⟨ht, ?_⟩
      have := krak_razdalja c k s t h
      exact (sq_eq_sq₀ dist_nonneg ha.le).mp (by rw [this]; linarith)
  have hcs : (c * s) ^ 2 + (c * k) ^ 2 = c ^ 2 := by linear_combination c ^ 2 * h
  have hck : 0 < c * k := mul_pos hc hk
  refine ⟨fun h1 => ?_, fun h2 => ?_, fun h3 h4 => ?_, fun h5 => ?_⟩
  · ext t
    simp only [key, Set.mem_empty_iff_false, iff_false, not_and]
    intro _ e
    have : a ^ 2 < (c * s) ^ 2 := by nlinarith
    nlinarith [sq_nonneg (t - c * k)]
  · ext t
    rw [key, Set.mem_singleton_iff, h2, sub_self]
    constructor
    · rintro ⟨_, e⟩
      have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp e
      linarith
    · rintro rfl; exact ⟨by positivity, by ring⟩
  · set r := √(a ^ 2 - (c * s) ^ 2) with hr
    have hD : 0 < a ^ 2 - (c * s) ^ 2 := by
      have := mul_pos (sub_pos.mpr h3) (by positivity : 0 < a + c * s); nlinarith
    have hr0 : 0 < r := Real.sqrt_pos.mpr hD
    have hr2 : r ^ 2 = a ^ 2 - (c * s) ^ 2 := Real.sq_sqrt hD.le
    have hrk : r < c * k := by
      have : r ^ 2 < (c * k) ^ 2 := by
        rw [hr2]; nlinarith [mul_pos (sub_pos.mpr h4) (by positivity : 0 < c + a)]
      nlinarith [add_pos hr0 hck]
    refine ⟨?_, by linarith⟩
    ext t
    rw [key, Set.mem_insert_iff, Set.mem_singleton_iff]
    constructor
    · rintro ⟨_, e⟩
      have : (t - (c * k - r)) * (t - (c * k + r)) = 0 := by linear_combination e - hr2
      rcases mul_eq_zero.mp this with h0 | h0
      · left; linarith
      · right; linarith
    · rintro (rfl | rfl)
      · exact ⟨by linarith, by rw [← hr2]; ring⟩
      · exact ⟨by nlinarith [mul_pos hc hk], by rw [← hr2]; ring⟩
  · set r := √(a ^ 2 - (c * s) ^ 2) with hr
    have hca : c ^ 2 ≤ a ^ 2 := by nlinarith
    have hD : 0 ≤ a ^ 2 - (c * s) ^ 2 := by nlinarith [sq_nonneg (c * k)]
    have hr0 : 0 ≤ r := Real.sqrt_nonneg _
    have hr2 : r ^ 2 = a ^ 2 - (c * s) ^ 2 := Real.sq_sqrt hD
    have hrk : c * k ≤ r := by
      have : (c * k) ^ 2 ≤ r ^ 2 := by rw [hr2]; linarith
      nlinarith [add_pos_of_pos_of_nonneg hck hr0]
    ext t
    rw [key, Set.mem_singleton_iff]
    constructor
    · rintro ⟨ht, e⟩
      have : (t - (c * k - r)) * (t - (c * k + r)) = 0 := by linear_combination e - hr2
      rcases mul_eq_zero.mp this with h0 | h0
      · linarith
      · linarith
    · rintro rfl; exact ⟨by nlinarith [mul_pos hc hk], by rw [← hr2]; ring⟩

/-- Predpostavke trditve `diskusija` se dajo izpolniti (Nika: c = 6, 30°, a = 4). -/
example : (0 : ℝ) < 6 ∧ (0 : ℝ) < √3 / 2 ∧ (0 : ℝ) < 1 / 2 ∧ (√3 / 2 : ℝ) ^ 2 + (1 / 2) ^ 2 = 1 ∧ (0 : ℝ) < 4 :=
  ⟨by norm_num, by positivity, by norm_num, kot30_45.1, by norm_num⟩

/-- Premisli 3: pri a = d je C = D in kot pri C je pravi (⟪A − C, B − C⟫ = 0). -/
theorem dotik_pravi_kot (c k s : ℝ) (h : k ^ 2 + s ^ 2 = 1) :
    inner ℝ (0 - ((c * k : ℝ) : ℂ) * ⟨k, s⟩) ((c : ℂ) - ((c * k : ℝ) : ℂ) * ⟨k, s⟩) = 0 := by
  simp [Complex.inner]; linear_combination (c ^ 2 * k ^ 2) * h

/-- Razlaga 5 in Povzetek (SSS, Kot zgodba): krožnici k(A, b) in k(B, a) (A = 0, B = c > 0) se sekata v točkah z
Re z = x = (b² + c² − a²)/(2c) in (Im z)² = b² − x²; pri tem 4c²(b² − x²) = (a² − (b − c)²)((b + c)² − a²), zato sta
presečišči dve natanko pri |a − b| < c < a + b (pozitivni faktorji), eno pri enakosti, nobenega sicer. Dokazana sta
ta ↔ in razcep (`krozjici_faktor`); samo štetje presečišč ni izrek (zahtevno, še ni dokazano). -/
theorem krozjici (a b c : ℝ) (hc : 0 < c) (z : ℂ) :
    (dist z 0 = b ∧ dist z c = a ∧ 0 ≤ a ∧ 0 ≤ b) ↔
      (z.re = (b ^ 2 + c ^ 2 - a ^ 2) / (2 * c) ∧ z.im ^ 2 = b ^ 2 - ((b ^ 2 + c ^ 2 - a ^ 2) / (2 * c)) ^ 2 ∧
        0 ≤ a ∧ 0 ≤ b) := by
  have e1 := dist_c_sq z 0
  have e2 := dist_c_sq z c
  simp only [Complex.zero_re, Complex.zero_im, sub_zero, Complex.ofReal_re, Complex.ofReal_im] at e1 e2
  constructor
  · rintro ⟨h1, h2, ha, hb⟩
    rw [h1] at e1; rw [h2] at e2
    have hre : z.re = (b ^ 2 + c ^ 2 - a ^ 2) / (2 * c) := by
      field_simp; nlinarith
    exact ⟨hre, by rw [← hre]; linarith, ha, hb⟩
  · rintro ⟨hre, him, ha, hb⟩
    refine ⟨?_, ?_, ha, hb⟩
    · exact (sq_eq_sq₀ dist_nonneg hb).mp (by rw [e1, him, hre]; ring)
    · refine (sq_eq_sq₀ dist_nonneg ha).mp ?_
      rw [e2, show (z.re - c) ^ 2 + z.im ^ 2 = z.re ^ 2 + z.im ^ 2 - 2 * c * z.re + c ^ 2 by ring, him, hre]
      field_simp; ring

/-- Pomožno k `krozjici`: 4c²(b² − x²) = (a² − (b − c)²)((b + c)² − a²) za x = (b² + c² − a²)/(2c). -/
theorem krozjici_faktor (a b c : ℝ) (hc : 0 < c) :
    4 * c ^ 2 * (b ^ 2 - ((b ^ 2 + c ^ 2 - a ^ 2) / (2 * c)) ^ 2) = (a ^ 2 - (b - c) ^ 2) * ((b + c) ^ 2 - a ^ 2) := by
  field_simp; ring

/-- Predpostavka trditev `krozjici` se da izpolniti (c = 70, Kot zgodba). -/
example : (0 : ℝ) < 70 := by norm_num

/-- Razlaga 5 in Povzetek (KSK): kraka kotov α pri A = 0 in β pri B = c (0 < α, β < π) se nad AB sekata
(t, u > 0 s t·e^{iα} = c + u·e^{i(π − β)}) natanko tedaj, ko je α + β < π (180°). -/
theorem ksk_pogoj (c α β : ℝ) (hc : 0 < c) (hα : 0 < α) (hα' : α < π) (hβ : 0 < β) (hβ' : β < π) :
    (∃ t u : ℝ, 0 < t ∧ 0 < u ∧ t * Real.sin α = u * Real.sin β ∧ t * Real.cos α + u * Real.cos β = c) ↔
      α + β < π := by
  have sa := Real.sin_pos_of_pos_of_lt_pi hα hα'
  have sb := Real.sin_pos_of_pos_of_lt_pi hβ hβ'
  constructor
  · rintro ⟨t, u, ht, hu, h1, h2⟩
    have key : t * Real.sin (α + β) = c * Real.sin β := by
      rw [Real.sin_add]; linear_combination Real.sin β * h2 + Real.cos β * h1
    have hpos : 0 < Real.sin (α + β) := by
      have : 0 < t * Real.sin (α + β) := by rw [key]; positivity
      exact pos_of_mul_pos_right this ht.le
    by_contra hge
    push Not at hge
    have h' : Real.sin (α + β) = -Real.sin (α + β - π) := by rw [Real.sin_sub_pi]; ring
    have : 0 ≤ Real.sin (α + β - π) := Real.sin_nonneg_of_nonneg_of_le_pi (by linarith) (by linarith)
    linarith
  · intro hs
    have hsab := Real.sin_pos_of_pos_of_lt_pi (by linarith) hs
    refine ⟨c * Real.sin β / Real.sin (α + β), c * Real.sin α / Real.sin (α + β), by positivity, by positivity,
      ?_, ?_⟩
    · field_simp
    · have hne := hsab.ne'
      field_simp
      rw [Real.sin_add]; ring

/-- Predpostavke trditve `ksk_pogoj` se dajo izpolniti (kviz 1: c = 5, α = 40°, β = 70°). -/
example : (0 : ℝ) < 5 ∧ (0 : ℝ) < 40 * π / 180 ∧ 40 * π / 180 < π ∧ (0 : ℝ) < 70 * π / 180 ∧ 70 * π / 180 < π :=
  ⟨by norm_num, by positivity, by linarith [pi_pos], by positivity, by linarith [pi_pos]⟩

/-- Razlaga 5 (SKS ima natanko eno rešitev): obstoj (C = 0, B = a, A = b·e^{iγ} v ℂ ima |CB| = a, |CA| = b; da je
kot pri C res γ za 0 ≤ γ ≤ π, je `sks_kot`), enoličnost do skladnosti (dva trikotnika z istima stranicama in kotom
med njima sta skladna). -/
theorem sks (a b γ : ℝ) (ha : 0 ≤ a) (hb : 0 ≤ b) {A B C A₁ B₁ C₁ : P} (h : ∠ A C B = ∠ A₁ C₁ B₁)
    (h1 : dist A C = dist A₁ C₁) (h2 : dist C B = dist C₁ B₁) :
    (dist (0 : ℂ) a = a ∧ dist (0 : ℂ) (b * Complex.exp (γ * Complex.I)) = b) ∧ (![A, C, B] ≅ ![A₁, C₁, B₁]) := by
  refine ⟨⟨?_, ?_⟩, side_angle_side h h1 h2⟩
  · rw [Complex.dist_eq, zero_sub, norm_neg, Complex.norm_real, Real.norm_of_nonneg ha]
  · rw [Complex.dist_eq, zero_sub, norm_neg, norm_mul, Complex.norm_exp_ofReal_mul_I, mul_one, Complex.norm_real,
      Real.norm_of_nonneg hb]

/-- Predpostavke trditve `sks` se dajo izpolniti (a = 5, b = 4, Primer 1). -/
example : (0 : ℝ) ≤ 5 ∧ (0 : ℝ) ≤ 4 := by norm_num

/-- Razlaga 5 (SKS, obstoj s kotom): za a, b > 0 in 0 ≤ γ ≤ π (0° do 180°) ima trikotnik C = 0, B = a,
A = b·e^{iγ} pri C res kot ∠BCA = γ (stranici |CB| = a, |CA| = b sta v `sks`). -/
theorem sks_kot (a b γ : ℝ) (ha : 0 < a) (hb : 0 < b) (h0 : 0 ≤ γ) (hπ : γ ≤ π) :
    ∠ (a : ℂ) 0 (b * Complex.exp (γ * Complex.I)) = γ := by
  simp only [EuclideanGeometry.angle, vsub_eq_sub, sub_zero]
  unfold InnerProductGeometry.angle
  have n1 : ‖(a : ℂ)‖ = a := by rw [Complex.norm_real, Real.norm_of_nonneg ha.le]
  have n2 : ‖(b : ℂ) * Complex.exp (γ * Complex.I)‖ = b := by
    rw [norm_mul, Complex.norm_exp_ofReal_mul_I, mul_one, Complex.norm_real, Real.norm_of_nonneg hb.le]
  have hi : inner ℝ (a : ℂ) ((b : ℂ) * Complex.exp (γ * Complex.I)) = a * (b * Real.cos γ) := by
    rw [Complex.inner, Complex.exp_mul_I]
    simp [← Complex.ofReal_cos, ← Complex.ofReal_sin]; ring
  rw [n1, n2, hi, show a * (b * Real.cos γ) / (a * b) = Real.cos γ by field_simp, Real.arccos_cos h0 hπ]

/-- Predpostavke trditve `sks_kot` se dajo izpolniti (a = 5, b = 4, γ = π/3, Primer 1). -/
example : (0 : ℝ) < 5 ∧ (0 : ℝ) < 4 ∧ (0 : ℝ) ≤ π / 3 ∧ π / 3 ≤ π :=
  ⟨by norm_num, by norm_num, by positivity, by linarith [pi_pos]⟩

/-! ## Rešeni primeri -/

/-- Uvod in `RACUN` (Nika: c = 6, 30°, a = 4): d = 3 < 4 < 6, dve legi |AC| = √27 ∓ √7 ≈ 2,55 in 7,84
(≈ 2,6 km in 7,8 km); √27 = 6·√3/2, √7 = √(4² − 3²). -/
theorem nika : 6 * (1 / 2 : ℝ) = 3 ∧ (6 : ℝ) * (√3 / 2) = √27 ∧ √((4 : ℝ) ^ 2 - (6 * (1 / 2)) ^ 2) = √7 ∧
    |√27 - √7 - 255 / 100| < 5 / 1000 ∧ |√27 - √7 - 26 / 10| < 5 / 100 ∧ |√27 + √7 - 784 / 100| < 5 / 1000 ∧
    |√27 + √7 - 78 / 10| < 5 / 100 := by
  have l27 : (5196 / 1000 : ℝ) < √27 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u27 : √(27 : ℝ) < 5197 / 1000 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have l7 : (2645 / 1000 : ℝ) < √7 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u7 : √(7 : ℝ) < 2646 / 1000 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, ?_, by norm_num, ?_, ?_, ?_, ?_⟩
  · rw [show (27 : ℝ) = 3 ^ 2 * 3 by norm_num, Real.sqrt_mul (by norm_num), sqrt_kv (by norm_num)]; ring
  all_goals rw [abs_lt]; constructor <;> linarith

/-- Primer 1 (SKS, C = 0, B = 5, A = 4·(1/2 + (√3/2)i) = 2 + 2√3·i): višina 4√3/2 = 2√3 ≈ 3,46, 5 − 2 = 3,
c = √(3² + (2√3)²) = √21 ≈ 4,58 ≈ 4,6. -/
theorem primer1 : dist (⟨2, 2 * √3⟩ : ℂ) 5 = √21 ∧ dist (0 : ℂ) ⟨2, 2 * √3⟩ = 4 ∧ 4 * √3 / 2 = 2 * √3 ∧
    |2 * √3 - 346 / 100| < 5 / 1000 ∧ (5 : ℝ) - 2 = 3 ∧ √((3 : ℝ) ^ 2 + (2 * √3) ^ 2) = √21 ∧
    |√(21 : ℝ) - 458 / 100| < 5 / 1000 ∧ |√(21 : ℝ) - 46 / 10| < 5 / 100 := by
  have h3 : (√3 : ℝ) ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have l3 : (17320 / 10000 : ℝ) < √3 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u3 : √(3 : ℝ) < 17321 / 10000 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have l21 : (4582 / 1000 : ℝ) < √21 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u21 : √(21 : ℝ) < 4583 / 1000 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨?_, ?_, by ring, ?_, by norm_num, ?_, ?_, ?_⟩
  · rw [Complex.dist_eq_re_im]; congr 1; simp; nlinarith [h3]
  · exact dist_c (by norm_num) (by simp; nlinarith [h3])
  · rw [abs_lt]; constructor <;> linarith
  · congr 1; nlinarith [h3]
  · rw [abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor <;> linarith

/-- Primer 1 (kot pri C je 60°): ∠BCA za B = 5, A = 2 + 2√3·i je π/3. -/
theorem primer1_kot : ∠ (5 : ℂ) 0 ⟨2, 2 * √3⟩ = π / 3 := by
  have h3 : (√3 : ℝ) ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  simp only [EuclideanGeometry.angle, vsub_eq_sub, sub_zero]
  unfold InnerProductGeometry.angle
  have n1 : ‖(5 : ℂ)‖ = 5 := by simp
  have n2 : ‖(⟨2, 2 * √3⟩ : ℂ)‖ = 4 := by
    rw [Complex.norm_eq_sqrt_sq_add_sq]; simp
    rw [show (2 : ℝ) ^ 2 + (2 * √3) ^ 2 = 4 ^ 2 by nlinarith [h3], sqrt_kv (by norm_num)]
  rw [n1, n2]
  simp [Complex.inner]
  rw [show (2 : ℝ) * 5 / (5 * 4) = Real.cos (π / 3) by rw [Real.cos_pi_div_three]; norm_num,
    Real.arccos_cos (by positivity) (by linarith [pi_pos])]

/-- Primer 2: c = 7, v_c = 4, α = 45°: krak {t(1 + i), t > 0} seka vzporednico Im z = 4 v eni sami točki C(4, 4). -/
theorem primer2 (z : ℂ) : (z.im = 4 ∧ ∃ t : ℝ, 0 < t ∧ z = t * (1 + Complex.I)) ↔ z = ⟨4, 4⟩ := by
  constructor
  · rintro ⟨h1, t, ht, rfl⟩
    simp at h1
    rw [h1]; apply Complex.ext <;> simp
  · rintro rfl
    exact ⟨rfl, 4, by norm_num, by apply Complex.ext <;> simp⟩

/-- Primer 3 in `RACUN`: c = 10, 30°, a = 8: d = 10/2 = 5 < 8 < 10 (dve rešitvi); |AD| = √(10² − 5²) = √75 ≈ 8,66,
|DC| = √(8² − 5²) = √39 ≈ 6,24, |AC₁| = √75 − √39 ≈ 2,42 (≈ 2,4), |AC₂| = √75 + √39 ≈ 14,91 (≈ 14,9),
|C₁C₂| = 2√39 ≈ 12,49 (≈ 12,5); dotik pri a = d = 5; ck = 10·√3/2 = √75. -/
theorem primer3 : (10 : ℝ) / 2 = 5 ∧ (10 : ℝ) * (1 / 2) = 5 ∧ (5 : ℝ) < 8 ∧ (8 : ℝ) < 10 ∧
    √((10 : ℝ) ^ 2 - 5 ^ 2) = √75 ∧ (10 : ℝ) * (√3 / 2) = √75 ∧ √((8 : ℝ) ^ 2 - 5 ^ 2) = √39 ∧
    |√(75 : ℝ) - 866 / 100| < 5 / 1000 ∧ |√(39 : ℝ) - 624 / 100| < 5 / 1000 ∧
    |√75 - √39 - 242 / 100| < 5 / 1000 ∧ |√75 + √39 - 1491 / 100| < 5 / 1000 ∧
    √75 + √39 - (√75 - √39) = 2 * √39 ∧ |2 * √(39 : ℝ) - 1249 / 100| < 5 / 1000 ∧
    |√75 - √39 - 24 / 10| < 5 / 100 ∧ |√75 + √39 - 149 / 10| < 5 / 100 ∧ |2 * √(39 : ℝ) - 125 / 10| < 5 / 100 := by
  have l75 : (86602 / 10000 : ℝ) < √75 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u75 : √(75 : ℝ) < 86603 / 10000 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have l39 : (62449 / 10000 : ℝ) < √39 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u39 : √(39 : ℝ) < 62450 / 10000 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_, by norm_num, ?_, ?_, ?_, ?_,
    by ring, ?_, ?_, ?_, ?_⟩
  · rw [show (75 : ℝ) = 5 ^ 2 * 3 by norm_num, Real.sqrt_mul (by norm_num), sqrt_kv (by norm_num)]; ring
  all_goals rw [abs_lt]; constructor <;> linarith

/-- Primer 4 (premisli) in `RACUN`: trikotnik ABC s stranicami 5, 3, 7 obstaja (5 − 3 < 7 < 5 + 3);
cos β = (5² + 3² − 7²)/(2·5·3) = −0,5, zato β = 120° (2π/3) in α = 180° − β = 60° (sosednja kota paralelograma). -/
theorem primer4 {A B C : P} (h1 : dist A B = 5) (h2 : dist B C = 3) (h3 : dist A C = 7) :
    ((5 : ℝ) - 3 < 7 ∧ (7 : ℝ) < 5 + 3) ∧ ((5 : ℝ) ^ 2 + 3 ^ 2 - 7 ^ 2) / (2 * 5 * 3) = -1 / 2 ∧
      ∠ A B C = 2 * π / 3 ∧ π - ∠ A B C = π / 3 := by
  have l := EuclideanGeometry.law_cos A B C
  rw [dist_comm C B, h1, h2, h3] at l
  have hcos : Real.cos (∠ A B C) = Real.cos (2 * π / 3) := by
    rw [show 2 * π / 3 = π - π / 3 by ring, Real.cos_pi_sub, Real.cos_pi_div_three]; linarith
  have hang : ∠ A B C = 2 * π / 3 :=
    Real.injOn_cos ⟨EuclideanGeometry.angle_nonneg _ _ _, EuclideanGeometry.angle_le_pi _ _ _⟩
      ⟨by positivity, by linarith [pi_pos]⟩ hcos
  refine ⟨by norm_num, by norm_num, hang, by rw [hang]; ring⟩

/-- Predpostavke trditve `primer4` se dajo izpolniti: A = 0, B = 5, C = 6,5 + (3√3/2)i v ℂ. -/
example : dist (0 : ℂ) 5 = 5 ∧ dist (5 : ℂ) ⟨13 / 2, 3 * √3 / 2⟩ = 3 ∧ dist (0 : ℂ) ⟨13 / 2, 3 * √3 / 2⟩ = 7 := by
  have h3 : (√3 : ℝ) ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  refine ⟨dist_c (by norm_num) (by simp), dist_c (by norm_num) (by simp; nlinarith [h3]),
    dist_c (by norm_num) (by simp; nlinarith [h3])⟩

/-! ## Za maturo -/

/-- Naloga 2 a), c) (diskusija v modelu A = −3, B = 3, M = 0): točke z Im z = v (vzporednica) in |z| = t (krožnica
k(M, t)) za t, v > 0: pri t > v sta dve, z = ±√(t² − v²) + vi; pri t = v ena (z = vi, enakokraki); pri t < v nobene. Tu je dokazan ↔; štetje je `naloga2_stevilo`. -/
theorem naloga2_diskusija (t v : ℝ) (ht : 0 < t) (z : ℂ) :
    (z.im = v ∧ ‖z‖ = t) ↔ (z.im = v ∧ z.re ^ 2 = t ^ 2 - v ^ 2) := by
  have hn : ‖z‖ ^ 2 = z.re ^ 2 + z.im ^ 2 := by rw [Complex.sq_norm, Complex.normSq_apply]; ring
  constructor
  · rintro ⟨h1, h2⟩; refine ⟨h1, ?_⟩; rw [h2, h1] at hn; linarith
  · rintro ⟨h1, h2⟩
    refine ⟨h1, (sq_eq_sq₀ (norm_nonneg _) ht.le).mp ?_⟩
    rw [hn, h2, h1]; ring

/-- Predpostavka trditve `naloga2_diskusija` se da izpolniti (t = 5). -/
example : (0 : ℝ) < 5 := by norm_num

/-- Naloga 2 c) (štetje): pri t > v sta točki dve (±√(t² − v²) + vi, različni), pri t = v je ena (vi, in trikotnik
ABC z A = −3, B = 3, C = vi je enakokrak, |CA| = |CB|), pri t < v ni nobene (v > 0). -/
theorem naloga2_stevilo (t v : ℝ) (ht : 0 < t) (hv : 0 < v) :
    (v < t → {z : ℂ | z.im = v ∧ ‖z‖ = t} = {⟨√(t ^ 2 - v ^ 2), v⟩, ⟨-√(t ^ 2 - v ^ 2), v⟩} ∧
      (⟨√(t ^ 2 - v ^ 2), v⟩ : ℂ) ≠ ⟨-√(t ^ 2 - v ^ 2), v⟩) ∧
    (t = v → {z : ℂ | z.im = v ∧ ‖z‖ = t} = {⟨0, v⟩} ∧ dist (⟨0, v⟩ : ℂ) (-3) = dist (⟨0, v⟩ : ℂ) 3) ∧
    (t < v → {z : ℂ | z.im = v ∧ ‖z‖ = t} = ∅) := by
  have key := fun z => naloga2_diskusija t v ht z
  refine ⟨fun hlt => ?_, fun heq => ?_, fun hlt => ?_⟩
  · have hd : 0 < t ^ 2 - v ^ 2 := by nlinarith
    have hs : √(t ^ 2 - v ^ 2) ^ 2 = t ^ 2 - v ^ 2 := Real.sq_sqrt hd.le
    have hp : 0 < √(t ^ 2 - v ^ 2) := Real.sqrt_pos.mpr hd
    refine ⟨?_, ?_⟩
    · ext z
      simp only [Set.mem_ofPred_eq, Set.mem_insert_iff, Set.mem_singleton_iff, key]
      constructor
      · rintro ⟨h1, h2⟩
        rw [← hs] at h2
        rcases sq_eq_sq_iff_eq_or_eq_neg.mp h2 with h | h
        · left; exact Complex.ext h h1
        · right; exact Complex.ext h h1
      · rintro (rfl | rfl) <;> exact ⟨rfl, by simp [hs]⟩
    · intro h
      have := congrArg Complex.re h
      simp at this; linarith
  · subst heq
    refine ⟨?_, ?_⟩
    · ext z
      simp only [Set.mem_ofPred_eq, Set.mem_singleton_iff, key, sub_self]
      constructor
      · rintro ⟨h1, h2⟩; exact Complex.ext (pow_eq_zero_iff two_ne_zero |>.mp h2) h1
      · rintro rfl; exact ⟨rfl, by simp⟩
    · rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]; norm_num
  · ext z
    simp only [Set.mem_ofPred_eq, Set.mem_empty_iff_false, iff_false, key, not_and]
    intro _ h2
    nlinarith [sq_nonneg z.re]

/-- Predpostavka trditve `naloga2_stevilo` se da izpolniti (t = 5, v = 3 kot v Nalogi 2). -/
example : (0 : ℝ) < 5 ∧ (0 : ℝ) < 3 ∧ (3 : ℝ) < 5 := by norm_num

/-- Naloga 2 c), d) in `RACUN`: t = 5, v = 3: C₁,₂ = ±4 + 3i (|MN| = √(5² − 3²) = 4); trikotnika ABC₁ in ABC₂ sta
skladna (zrcaljenje čez simetralo AB, SSS); za C = 4 + 3i (bliže B): |BN| = 4 − 3 = 1, |AN| = 3 + 4 = 7,
a = √(1² + 3²) = √10, b = √(7² + 3²) = √58. -/
theorem naloga2 :
    ((⟨4, 3⟩ : ℂ).im = 3 ∧ ‖(⟨4, 3⟩ : ℂ)‖ = 5) ∧ ((⟨-4, 3⟩ : ℂ).im = 3 ∧ ‖(⟨-4, 3⟩ : ℂ)‖ = 5) ∧
    √((5 : ℝ) ^ 2 - 3 ^ 2) = 4 ∧ (![(-3 : ℂ), 3, ⟨4, 3⟩] ≅ ![(3 : ℂ), -3, ⟨-4, 3⟩]) ∧ (4 : ℝ) - 3 = 1 ∧
    (3 : ℝ) + 4 = 7 ∧ dist (3 : ℂ) ⟨4, 3⟩ = √(1 ^ 2 + 3 ^ 2) ∧ √((1 : ℝ) ^ 2 + 3 ^ 2) = √10 ∧
    dist (-3 : ℂ) ⟨4, 3⟩ = √(7 ^ 2 + 3 ^ 2) ∧ √((7 : ℝ) ^ 2 + 3 ^ 2) = √58 ∧ dist (3 : ℂ) ⟨4, 3⟩ < dist (-3 : ℂ) ⟨4, 3⟩ := by
  have n1 : ‖(⟨4, 3⟩ : ℂ)‖ = 5 := by
    rw [Complex.norm_eq_sqrt_sq_add_sq]; simp
    rw [show (4 : ℝ) ^ 2 + 3 ^ 2 = 5 ^ 2 by norm_num, sqrt_kv (by norm_num)]
  have n2 : ‖(⟨-4, 3⟩ : ℂ)‖ = 5 := by
    rw [Complex.norm_eq_sqrt_sq_add_sq]; simp
    rw [show (4 : ℝ) ^ 2 + 3 ^ 2 = 5 ^ 2 by norm_num, sqrt_kv (by norm_num)]
  have d1 : dist (3 : ℂ) ⟨4, 3⟩ = √(1 ^ 2 + 3 ^ 2) := by rw [Complex.dist_eq_re_im]; norm_num
  have d2 : dist (-3 : ℂ) ⟨4, 3⟩ = √(7 ^ 2 + 3 ^ 2) := by rw [Complex.dist_eq_re_im]; norm_num
  refine ⟨⟨rfl, n1⟩, ⟨rfl, n2⟩, ?_, ?_, by norm_num, by norm_num, d1, by norm_num, d2, by norm_num, ?_⟩
  · rw [show (5 : ℝ) ^ 2 - 3 ^ 2 = 4 ^ 2 by norm_num, sqrt_kv (by norm_num)]
  · apply side_side_side
    · rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]; norm_num
    · rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]; norm_num
    · rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]; norm_num
  · rw [d1, d2]; exact Real.sqrt_lt_sqrt (by norm_num) (by norm_num)

/-- Naloga 3 b), c), d) in `RACUN`: c = 8, 45°: d = 8·√2/2 = 4√2 = √(8²/2) = √32; 2d² = 64; diskusija: a < 4√2
nič, a = 4√2 ena, 4√2 < a < 8 dve, a ≥ 8 ena (`diskusija`); a = 2√10: √32 < √40 < 8, |DC| = √(40 − 32) = √8 =
2√2, |AC₁| = 4√2 − 2√2 = 2√2, |AC₂| = 4√2 + 2√2 = 6√2; preizkus C₁ = (2, 2): √((8 − 2)² + 2²) = 2√10. -/
theorem naloga3 : (8 : ℝ) * (√2 / 2) = 4 * √2 ∧ √((8 : ℝ) ^ 2 / 2) = 4 * √2 ∧ 2 * (4 * √2) ^ 2 = (8 : ℝ) ^ 2 ∧
    (4 * √2 : ℝ) = √32 ∧ (2 * √10 : ℝ) = √40 ∧ √(32 : ℝ) < √40 ∧ √(40 : ℝ) < 8 ∧
    √((2 * √10) ^ 2 - 32) = 2 * √2 ∧ 4 * √2 - 2 * √2 = 2 * √2 ∧ 4 * √2 + 2 * √2 = 6 * √2 ∧
    √(((8 : ℝ) - 2) ^ 2 + 2 ^ 2) = 2 * √10 ∧ (2 * √2 : ℝ) * (√2 / 2) = 2 := by
  have h2 : (√2 : ℝ) ^ 2 = 2 := Real.sq_sqrt (by norm_num)
  have h10 : (√10 : ℝ) ^ 2 = 10 := Real.sq_sqrt (by norm_num)
  have s32 : √(32 : ℝ) = 4 * √2 := by
    rw [show (32 : ℝ) = 4 ^ 2 * 2 by norm_num, Real.sqrt_mul (by norm_num), sqrt_kv (by norm_num)]
  have s40 : √(40 : ℝ) = 2 * √10 := by
    rw [show (40 : ℝ) = 2 ^ 2 * 10 by norm_num, Real.sqrt_mul (by norm_num), sqrt_kv (by norm_num)]
  refine ⟨by ring, ?_, by nlinarith [h2], s32.symm, s40.symm, Real.sqrt_lt_sqrt (by norm_num) (by norm_num), ?_, ?_,
    by ring, by ring, ?_, by nlinarith [h2]⟩
  · rw [show (8 : ℝ) ^ 2 / 2 = 32 by norm_num, s32]
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num
  · rw [show (2 * √10 : ℝ) ^ 2 - 32 = 2 ^ 2 * 2 by nlinarith [h10], Real.sqrt_mul (by norm_num),
      sqrt_kv (by norm_num)]
  · rw [show ((8 : ℝ) - 2) ^ 2 + 2 ^ 2 = 40 by norm_num, s40]

/-! ## Drugače in Preveri se -/

/-- Kot zgodba (Tine): hrast in skala 70 korakov narazen, polmera 50 in 40: 50 − 40 < 70 < 50 + 40, faktorja
(a² − (b − c)²)((b + c)² − a²) > 0 (dve presečišči); pri 90 = 50 + 40 je faktor 0 (dotik), pri 100 negativen. -/
theorem zgodba : ((50 : ℝ) - 40 < 70 ∧ (70 : ℝ) < 50 + 40) ∧
    0 < ((40 : ℝ) ^ 2 - (50 - 70) ^ 2) * ((50 + 70) ^ 2 - 40 ^ 2) ∧
    ((40 : ℝ) ^ 2 - (50 - 90) ^ 2) * ((50 + 90) ^ 2 - 40 ^ 2) = 0 ∧
    ((40 : ℝ) ^ 2 - (50 - 100) ^ 2) * ((50 + 100) ^ 2 - 40 ^ 2) < 0 := by norm_num

/-- Korak za korakom (trapez a = 9, c = 4, b = 4, d = 3): |AE| = 9 − 4 = 5; 4 − 3 < 5 < 4 + 3; 3² + 4² = 25 = 5²
(pravi kot pri D); ploščina 3·4/2 = 6, v = 2·6/5 = 2,4. -/
theorem korak_za_korakom : (9 : ℝ) - 4 = 5 ∧ ((4 : ℝ) - 3 < 5 ∧ (5 : ℝ) < 4 + 3) ∧ (3 : ℝ) ^ 2 + 4 ^ 2 = 25 ∧
    (25 : ℝ) = 5 ^ 2 ∧ (3 : ℝ) * 4 / 2 = 6 ∧ (2 : ℝ) * 6 / 5 = 24 / 10 := by norm_num

/-- Preveri se 1: c = 8, a = 6, 30°: d = 8/2 = 4 < 6 < 8, dve rešitvi; drugi nabori: 4 − 3 < 5 < 4 + 3,
40 + 70 < 180; nabor c = 6, v_c = 2, α = 60° je `kviz1_visina`. -/
theorem kviz1 : (8 : ℝ) * (1 / 2) = 4 ∧ (4 : ℝ) < 6 ∧ (6 : ℝ) < 8 ∧ ((4 : ℝ) - 3 < 5 ∧ (5 : ℝ) < 4 + 3) ∧
    (40 : ℝ) + 70 < 180 := by norm_num

/-- Preveri se 1 (nabor c = 6, v_c = 2, α = 60°): krak {t(½ + (√3/2)i), t > 0} seka vzporednico Im z = 2 v eni sami
točki C = 2/√3 + 2i, zato je trikotnik en sam (na eni strani AB; zrcalni je skladen). -/
theorem kviz1_visina (z : ℂ) :
    (z.im = 2 ∧ ∃ t : ℝ, 0 < t ∧ z = t * ⟨1 / 2, √3 / 2⟩) ↔ z = ⟨2 / √3, 2⟩ := by
  have h3 : (√3 : ℝ) ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  have hp : 0 < √(3 : ℝ) := by positivity
  constructor
  · rintro ⟨h1, t, ht, rfl⟩
    simp at h1
    apply Complex.ext <;> simp
    · field_simp; nlinarith [h1, h3]
    · linarith
  · rintro rfl
    refine ⟨rfl, 4 / √3, by positivity, ?_⟩
    apply Complex.ext <;> simp <;> field_simp <;> nlinarith [h3]

/-- Preveri se 2 in `RACUN`: 9 − 4 < c < 9 + 4, največje celo število je 12 = 9 + 4 − 1 (13 ne, enakost). -/
theorem kviz2 : (9 - 4 < 12 ∧ 12 < 9 + 4) ∧ (∀ n : ℕ, 9 - 4 < n → n < 9 + 4 → n ≤ 12) ∧ 9 + 4 - 1 = 12 ∧
    ¬ (13 < 9 + 4) := by
  refine ⟨by norm_num, fun n _ h => by omega, by norm_num, by norm_num⟩

/-- Preveri se 4: c = 8, 30°, a = 3: d = 4 > 3, krožnica kraka ne doseže, rešitev ni (`diskusija`, prvi primer). -/
theorem kviz4 : {t : ℝ | 0 < t ∧ dist ((t : ℂ) * ⟨√3 / 2, 1 / 2⟩) (8 : ℝ) = 3} = ∅ :=
  ((diskusija 8 (√3 / 2) (1 / 2) 3 (by norm_num) (by positivity) (by norm_num) kot30_45.1 (by norm_num)).1
    (by norm_num))

end Evklid.Lekcije.MAT_SS_1.NacrtovalneNaloge
