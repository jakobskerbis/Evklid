/-
vir: content/lessons/MAT-SS-3/kotne-funkcije-poljubnega-kota.md
sha256: 202f3602863a804c1316ca00a68e16e6cb5777050325f8516fefd9e8e879144a
Ni v Leanu: kot kot zasuk kraka, smer vrtenja in pojem kvadranta (opis; dokazani so predznaki in vrednosti na
intervalih); definicija s točko T kot opis (Mathlib definira sin in cos analitično; dokazano je, da točka
(cos α, sin α) leži na enotski krožnici in da je vsaka točka enotske krožnice te oblike, ter za ostri kot
pravokotnega trikotnika cos = priležna/hipotenuza, sin = nasprotna/hipotenuza); radian kot »kot, ki mu pripada
lok, dolg kot polmer«, obseg enotske krožnice 2π in l = rα (dolžina loka kot krivulje: zahtevno, še ni
dokazano; dokazane so pretvorbe π rad = 180°); slike, simulacija »Enotska krožnica«, senci, ventil in vrvica
(dokazani so le računi v njih); »abeceda« za pomnjenje, »tan 90° ni definiran« (v Leanu je tan x = sin x/cos x
in x/0 = 0, zato je dokazano le cos 90° = cos 270° = 0); delovanje kalkulatorja (DEG/RAD) kot opis (dokazano je
sin 30 ≈ −0,988 za 30 rad in sin 30° = 0,5); točkovanje; Postopek v Ponovitvi.
Koti so v radianih (150° = 5π/6 ipd.). »≈ a« na k decimalk je a − ½·10⁻ᵏ < vrednost < a + ½·10⁻ᵏ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.KotneFunkcijePoljubnegaKota

open Real

/-! ## Pomožne trditve -/

/-- Pomožna trditev: 1,7320 < √3 < 1,7321.
pomozno -/
theorem koren3 : (1.7320 : ℝ) < √3 ∧ √3 < 1.7321 := by
  constructor
  · rw [Real.lt_sqrt (by norm_num)]; norm_num
  · rw [Real.sqrt_lt' (by norm_num)]; norm_num

/-- Pomožna trditev: (√3)² = 3.
pomozno -/
theorem kv3 : √3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)

/-- Pomožna trditev: sin 270° = −1 in cos 270° = 0.
pomozno -/
theorem kot270 : sin (3 * π / 2) = -1 ∧ cos (3 * π / 2) = 0 := by
  rw [show 3 * π / 2 = π / 2 + π by ring, sin_add_pi, cos_add_pi, sin_pi_div_two, cos_pi_div_two]
  norm_num

/-! ## Razlaga -/

/-- Razlaga 2, Povzetek in Ustno vprašanje 1: točka T(cos α, sin α) leži na enotski krožnici
(x² + y² = 1) in tan α = sin α/cos α (da je vsaka točka enotske krožnice oblike (cos α, sin α), je
izrek `tocka_je_kot`).
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#enotska-kroznica
besedilo: »$$\tan\alpha = \frac{y}{x} = \frac{\sin\alpha}{\cos\alpha},« -/
theorem enotska_kroznica (α : ℝ) : cos α ^ 2 + sin α ^ 2 = 1 ∧ tan α = sin α / cos α :=
  ⟨by rw [add_comm]; exact sin_sq_add_cos_sq α, tan_eq_sin_div_cos α⟩

/-- Razlaga 2: vsaka točka (x, y) z x² + y² = 1 je T(cos α, sin α) za neki kot α.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#tocka-je-kot
besedilo: »$$\cos\alpha = x, \qquad \sin\alpha = y$$« -/
theorem tocka_je_kot (x y : ℝ) (h : x ^ 2 + y ^ 2 = 1) : ∃ α : ℝ, cos α = x ∧ sin α = y := by
  have hx1 : -1 ≤ x := by nlinarith [sq_nonneg y, sq_nonneg (x + 1)]
  have hx2 : x ≤ 1 := by nlinarith [sq_nonneg y, sq_nonneg (x - 1)]
  have hs : √(1 - x ^ 2) = |y| := by rw [show 1 - x ^ 2 = y ^ 2 by linarith, Real.sqrt_sq_eq_abs]
  rcases le_or_gt 0 y with hy | hy
  · exact ⟨arccos x, cos_arccos hx1 hx2, by rw [sin_arccos, hs, abs_of_nonneg hy]⟩
  · exact ⟨-arccos x, by rw [cos_neg, cos_arccos hx1 hx2], by rw [sin_neg, sin_arccos, hs, abs_of_neg hy]; ring⟩

/-- Predpostavka izreka `tocka_je_kot` se da izpolniti (točka (0, 1)). -/
example : (0:ℝ) ^ 2 + 1 ^ 2 = 1 := by norm_num

/-- Razlaga 2 in Ustno vprašanje 1: za ostri kot pravokotnega trikotnika (pravi kot pri p₂) je
cos = priležna/hipotenuza in sin = nasprotna/hipotenuza, torej se nova definicija ujema s staro.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#trikotnik
besedilo: »Kosinus je torej vodoravna koordinata točke $T$, sinus pa navpična. Za ostre kote se to ujema s staro definicijo: iz točke $T$ spustimo pravokotnico na os $x$ in dobimo pravokotni trikotnik s hipotenuzo $1$. Priležna kateta je $x$, nasprotna kateta je $y$.« -/
theorem trikotnik {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] {p₁ p₂ p₃ : P} (h : EuclideanGeometry.angle p₁ p₂ p₃ = π / 2) (hn : p₁ ≠ p₂)
    (_hn' : p₃ ≠ p₂) :
    cos (EuclideanGeometry.angle p₂ p₃ p₁) = dist p₃ p₂ / dist p₁ p₃ ∧
    sin (EuclideanGeometry.angle p₂ p₃ p₁) = dist p₁ p₂ / dist p₁ p₃ :=
  ⟨EuclideanGeometry.cos_angle_of_angle_eq_pi_div_two h,
    EuclideanGeometry.sin_angle_of_angle_eq_pi_div_two h (Or.inl hn)⟩

/-- Pogoja izreka `trikotnik` se dajo izpolniti: v ravnini ℂ imajo točke 1, 0, i pravi kot pri 0. -/
example : EuclideanGeometry.angle (1:ℂ) 0 Complex.I = π / 2 ∧ (1:ℂ) ≠ 0 ∧ Complex.I ≠ 0 := by
  refine ⟨?_, one_ne_zero, Complex.I_ne_zero⟩
  rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
  simp [Complex.inner]

/-- Razlaga 3 (posebni koti): cos 0° = 1, sin 0° = 0; cos 90° = 0, sin 90° = 1; cos 180° = −1, sin 180° = 0;
cos 270° = 0, sin 270° = −1 (pri 90° in 270° je x = 0, zato tangens tam ni definiran).
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#posebni-koti
besedilo: »Pri $90^\circ$ in $270^\circ$ je $x = 0$, zato $\tan\alpha$ tam **ni definiran**.« -/
theorem posebni_koti : cos 0 = 1 ∧ sin 0 = 0 ∧ cos (π / 2) = 0 ∧ sin (π / 2) = 1 ∧ cos π = -1 ∧ sin π = 0 ∧
    cos (3 * π / 2) = 0 ∧ sin (3 * π / 2) = -1 :=
  ⟨cos_zero, sin_zero, cos_pi_div_two, sin_pi_div_two, cos_pi, sin_pi, kot270.2, kot270.1⟩

/-- Razlaga 3, Premisli: cos 120° < 0 in sin 120° > 0.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#premisli-120
besedilo: »Zato je $\cos 120^\circ < 0$ in $\sin 120^\circ > 0$.« -/
theorem premisli_120 : cos (2 * π / 3) < 0 ∧ 0 < sin (2 * π / 3) := by
  have hp := pi_pos
  exact ⟨cos_neg_of_pi_div_two_lt_of_lt (by linarith) (by linarith),
    sin_pos_of_pos_of_lt_pi (by positivity) (by linarith)⟩

/-- Razlaga 4 (predznaki po kvadrantih), I. kvadrant: sin > 0, cos > 0, tan > 0.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#kvadrant1
besedilo: »| kvadrant | $\sin$ | $\cos$ | $\tan$ |« -/
theorem kvadrant1 (α : ℝ) (h0 : 0 < α) (h1 : α < π / 2) : 0 < sin α ∧ 0 < cos α ∧ 0 < tan α := by
  have hp := pi_pos
  have hs := sin_pos_of_pos_of_lt_pi h0 (by linarith)
  have hc := cos_pos_of_mem_Ioo ⟨by linarith, h1⟩
  exact ⟨hs, hc, by rw [tan_eq_sin_div_cos]; positivity⟩

/-- Razlaga 4, II. kvadrant: sin > 0, cos < 0, tan < 0.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#kvadrant2
besedilo: »| kvadrant | $\sin$ | $\cos$ | $\tan$ |« -/
theorem kvadrant2 (α : ℝ) (h0 : π / 2 < α) (h1 : α < π) : 0 < sin α ∧ cos α < 0 ∧ tan α < 0 := by
  have hp := pi_pos
  have hs := sin_pos_of_pos_of_lt_pi (by linarith) h1
  have hc := cos_neg_of_pi_div_two_lt_of_lt h0 (by linarith)
  exact ⟨hs, hc, by rw [tan_eq_sin_div_cos]; exact div_neg_of_pos_of_neg hs hc⟩

/-- Predpostavki trditve `kvadrant2` se dajo izpolniti (α = 3π/4). -/
example : π / 2 < 3 * π / 4 ∧ 3 * π / 4 < π := ⟨by linarith [pi_pos], by linarith [pi_pos]⟩

/-- Razlaga 4, III. kvadrant: sin < 0, cos < 0, tan > 0.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#kvadrant3
besedilo: »| kvadrant | $\sin$ | $\cos$ | $\tan$ |« -/
theorem kvadrant3 (α : ℝ) (h0 : π < α) (h1 : α < 3 * π / 2) : sin α < 0 ∧ cos α < 0 ∧ 0 < tan α := by
  have hp := pi_pos
  have hs := sin_neg_of_neg_of_neg_pi_lt (x := α - 2 * π) (by linarith) (by linarith)
  rw [sin_sub_two_pi] at hs
  have hc := cos_neg_of_pi_div_two_lt_of_lt (x := α) (by linarith) (by linarith)
  exact ⟨hs, hc, by rw [tan_eq_sin_div_cos]; exact div_pos_of_neg_of_neg hs hc⟩

/-- Predpostavki trditve `kvadrant3` se dajo izpolniti (α = 5π/4). -/
example : π < 5 * π / 4 ∧ 5 * π / 4 < 3 * π / 2 := ⟨by linarith [pi_pos], by linarith [pi_pos]⟩

/-- Razlaga 4, IV. kvadrant: sin < 0, cos > 0, tan < 0.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#kvadrant4
besedilo: »| kvadrant | $\sin$ | $\cos$ | $\tan$ |« -/
theorem kvadrant4 (α : ℝ) (h0 : 3 * π / 2 < α) (h1 : α < 2 * π) : sin α < 0 ∧ 0 < cos α ∧ tan α < 0 := by
  have hp := pi_pos
  have hs := sin_neg_of_neg_of_neg_pi_lt (x := α - 2 * π) (by linarith) (by linarith)
  rw [sin_sub_two_pi] at hs
  have hc := cos_pos_of_mem_Ioo (x := α - 2 * π) ⟨by linarith, by linarith⟩
  rw [cos_sub_two_pi] at hc
  exact ⟨hs, hc, by rw [tan_eq_sin_div_cos]; exact div_neg_of_neg_of_pos hs hc⟩

/-- Pogoji izrekov `kvadrant1` … `kvadrant4` se dajo izpolniti (koti 30°, 120°, 210°, 300°). -/
example : (0 < π / 6 ∧ π / 6 < π / 2) ∧ (π / 2 < 2 * π / 3 ∧ 2 * π / 3 < π) ∧
    (π < 7 * π / 6 ∧ 7 * π / 6 < 3 * π / 2) ∧ (3 * π / 2 < 5 * π / 3 ∧ 5 * π / 3 < 2 * π) := by
  have hp := pi_pos
  refine ⟨⟨?_, ?_⟩, ⟨?_, ?_⟩, ⟨?_, ?_⟩, ⟨?_, ?_⟩⟩ <;> linarith

/-- Razlaga 5 in Ustno vprašanje 3 (pripadajoči ostri kot): II. kvadrant sin(180° − α) = sin α,
cos(180° − α) = −cos α; III. kvadrant sin(180° + α) = −sin α, cos(180° + α) = −cos α; IV. kvadrant
sin(360° − α) = −sin α, cos(360° − α) = cos α.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#pripadajoci
besedilo: »Pripadajoči ostri kot je ostri kot med gibljivim krakom in osjo $x$: v II. kvadrantu je $180^\circ - \alpha$, v III. kvadrantu $\alpha - 180^\circ$ in v IV. kvadrantu $360^\circ - \alpha$.« -/
theorem pripadajoci (α : ℝ) : sin (π - α) = sin α ∧ cos (π - α) = -cos α ∧
    sin (π + α) = -sin α ∧ cos (π + α) = -cos α ∧ sin (2 * π - α) = -sin α ∧ cos (2 * π - α) = cos α := by
  refine ⟨sin_pi_sub α, cos_pi_sub α, ?_, ?_, sin_two_pi_sub α, cos_two_pi_sub α⟩
  · rw [add_comm, sin_add_pi]
  · rw [add_comm, cos_add_pi]

/-- Razlaga 5, uganka in Zakaj se tega učimo: sin 30° = 1/2 (pikica 0,5 cm nad središčem),
sin 150° = sin 30° = 1/2, cos 150° = −cos 30° = −√3/2, sin 210° = −sin 30° = −1/2 (0,5 cm pod središčem).
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#kot150-210
besedilo: »Tako rešiš tudi uganko s pikico: pri $150^\circ$ je $0{,}5\,\text{cm}$ nad središčem, pri $210^\circ$ pa $0{,}5\,\text{cm}$ pod njim, ker je $\sin 210^\circ = -\sin 30^\circ = -\frac12$.« -/
theorem kot150_210 : sin (π / 6) = 1 / 2 ∧ sin (5 * π / 6) = 1 / 2 ∧ cos (5 * π / 6) = -(√3 / 2) ∧
    sin (7 * π / 6) = -(1 / 2) := by
  refine ⟨sin_pi_div_six, ?_, ?_, ?_⟩
  · rw [show 5 * π / 6 = π - π / 6 by ring, sin_pi_sub, sin_pi_div_six]
  · rw [show 5 * π / 6 = π - π / 6 by ring, cos_pi_sub, cos_pi_div_six]
  · rw [show 7 * π / 6 = π + π / 6 by ring, (pripadajoci _).2.2.1, sin_pi_div_six]

/-- Razlaga 6, Povzetek in Ustno vprašanje 2: sin²α + cos²α = 1, zato −1 ≤ sin α ≤ 1 in −1 ≤ cos α ≤ 1.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#osnovna-zveza
besedilo: »$$\sin^2\alpha + \cos^2\alpha = 1$$« -/
theorem osnovna_zveza (α : ℝ) : sin α ^ 2 + cos α ^ 2 = 1 ∧ -1 ≤ sin α ∧ sin α ≤ 1 ∧ -1 ≤ cos α ∧
    cos α ≤ 1 :=
  ⟨sin_sq_add_cos_sq α, neg_one_le_sin α, sin_le_one α, neg_one_le_cos α, cos_le_one α⟩

/-- Razlaga 7, Povzetek in Bolj natančno: sin(α + 2kπ) = sin α in cos(α + 2kπ) = cos α za vsak celi k.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#periodicnost
besedilo: »$$\sin(\alpha + 2k\pi) = \sin\alpha, \quad \cos(\alpha + 2k\pi) = \cos\alpha.$$« -/
theorem periodicnost (α : ℝ) (k : ℤ) : sin (α + 2 * k * π) = sin α ∧ cos (α + 2 * k * π) = cos α := by
  rw [show 2 * (k : ℝ) * π = k * (2 * π) by ring]
  exact ⟨sin_add_int_mul_two_pi α k, cos_add_int_mul_two_pi α k⟩

/-- Bolj natančno (simetrija čez os x): sin(−α) = −sin α in cos(−α) = cos α.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#simetrija-x
besedilo: »Iz simetrije krožnice čez os $x$ sledi $\sin(-\alpha) = -\sin\alpha$ in $\cos(-\alpha) = \cos\alpha$. Iz simetrije čez os $y$ sledi $\sin(\pi - \alpha) = \sin\alpha$ in $\cos(\pi - \alpha) = -\cos\alpha$.« -/
theorem simetrija_x (α : ℝ) : sin (-α) = -sin α ∧ cos (-α) = cos α := ⟨sin_neg α, cos_neg α⟩

/-- Razlaga 7: sin 390° = sin 30° in cos(−60°) = cos 300°, ker je −60° + 360° = 300°; Iz vsakdanjega
življenja: kot 400° dá isto lego kot 40°.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#koti-nad-360
besedilo: »Tako je $\sin 390^\circ = \sin 30^\circ$ in $\cos(-60^\circ) = \cos 300^\circ$, ker je $-60^\circ + 360^\circ = 300^\circ$.« -/
theorem koti_nad_360 : sin (13 * π / 6) = sin (π / 6) ∧ cos (-(π / 3)) = cos (5 * π / 3) ∧
    -(π / 3) + 2 * π = 5 * π / 3 ∧ sin (20 * π / 9) = sin (2 * π / 9) ∧ cos (20 * π / 9) = cos (2 * π / 9) := by
  have a := periodicnost (π / 6) 1
  have b := periodicnost (-(π / 3)) 1
  have c := periodicnost (2 * π / 9) 1
  push_cast at a b c
  refine ⟨?_, ?_, by ring, ?_, ?_⟩
  · rw [← a.1]; congr 1; ring
  · rw [← b.2]; congr 1; ring
  · rw [← c.1]; congr 1; ring
  · rw [← c.2]; congr 1; ring

/-- Razlaga 8 in Povzetek: 360° = 2π rad, 180° = π rad, 1 rad = 180°/π ≈ 57,3°; tabela 30° = π/6, 45° = π/4,
60° = π/3, 90° = π/2 (pretvorba α·π/180); sin(π/2) = 1.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#radian
besedilo: »$$\pi\,\text{rad} = 180^\circ,\quad 1\,\text{rad} \approx 57{,}3^\circ$$« -/
theorem radian : 360 * (π / 180) = 2 * π ∧ 180 * (π / 180) = π ∧ (57.25 : ℝ) < 180 / π ∧ 180 / π < 57.35 ∧
    30 * (π / 180) = π / 6 ∧ 45 * (π / 180) = π / 4 ∧ 60 * (π / 180) = π / 3 ∧ 90 * (π / 180) = π / 2 ∧
    sin (π / 2) = 1 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have hp := pi_pos
  refine ⟨by ring, by ring, ?_, ?_, by ring, by ring, by ring, by ring, sin_pi_div_two⟩
  · rw [lt_div_iff₀ hp]; linarith
  · rw [div_lt_iff₀ hp]; linarith

/-- Razlaga 8, Premisli: kot 3 rad je v II. kvadrantu (π/2 ≈ 1,57 < 3 < π ≈ 3,14) in meri ≈ 171,9°.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#kot3
besedilo: »V II. kvadrantu. Velja $\frac{\pi}{2} \approx 1{,}57 < 3 < \pi \approx 3{,}14$, torej je kot nekaj manjši od iztegnjenega ($3\,\text{rad} \approx 171{,}9^\circ$).« -/
theorem kot3 : π / 2 < 3 ∧ 3 < π ∧ (1.565 : ℝ) < π / 2 ∧ π / 2 < 1.575 ∧ (3.135 : ℝ) < π ∧ π < 3.145 ∧
    (171.85 : ℝ) < 3 * (180 / π) ∧ 3 * (180 / π) < 171.95 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have hp := pi_pos
  refine ⟨by linarith, by linarith, by linarith, by linarith, by linarith, by linarith, ?_, ?_⟩
  · rw [mul_div_assoc', lt_div_iff₀ hp]; linarith
  · rw [mul_div_assoc', div_lt_iff₀ hp]; linarith

/-! ## Rešeni primeri -/

/-- Primer 1: 150° · π/180° = 5π/6 (150/180 = 5/6) in 5π/4 · 180°/π = 5·45° = 225°.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#primer1
besedilo: »$\frac{5\pi}{4} \cdot \frac{180^\circ}{\pi} = 5 \cdot 45^\circ = 225^\circ$« -/
theorem primer1 : 150 * (π / 180) = 5 * π / 6 ∧ (150 : ℝ) / 180 = 5 / 6 ∧
    5 * π / 4 * (180 / π) = 5 * 45 ∧ (5 : ℝ) * 45 = 225 := by
  have hp := pi_pos.ne'
  refine ⟨by ring, by norm_num, by field_simp; ring, by norm_num⟩

/-- Primer 2: 4π/3 = 240° (III. kvadrant, pripadajoči ostri kot 240° − 180° = 60°);
sin 240° = −sin 60° = −√3/2, cos 240° = −cos 60° = −1/2, tan 240° = (−√3/2)/(−1/2) = √3 > 0.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#primer2
besedilo: »$\sin 240^\circ = -\sin 60^\circ = -\frac{\sqrt3}{2}$ in $\cos 240^\circ = -\cos 60^\circ = -\frac12$.« -/
theorem primer2 : 4 * π / 3 * (180 / π) = 240 ∧ π < 4 * π / 3 ∧ 4 * π / 3 < 3 * π / 2 ∧
    (240 : ℝ) - 180 = 60 ∧
    sin (4 * π / 3) = -sin (π / 3) ∧ -sin (π / 3) = -(√3 / 2) ∧
    cos (4 * π / 3) = -cos (π / 3) ∧ -cos (π / 3) = -(1 / 2) ∧
    tan (4 * π / 3) = (-(√3 / 2)) / (-(1 / 2)) ∧ (-(√3 / 2)) / (-(1 / 2)) = √3 ∧ 0 < tan (4 * π / 3) := by
  have hp := pi_pos
  have hs : sin (4 * π / 3) = -sin (π / 3) := by rw [show 4 * π / 3 = π + π / 3 by ring, (pripadajoci _).2.2.1]
  have hc : cos (4 * π / 3) = -cos (π / 3) := by
    rw [show 4 * π / 3 = π + π / 3 by ring, (pripadajoci _).2.2.2.1]
  refine ⟨by field_simp; ring, by linarith, by linarith, by norm_num, hs, by rw [sin_pi_div_three], hc,
    by rw [cos_pi_div_three], by rw [tan_eq_sin_div_cos, hs, hc, sin_pi_div_three, cos_pi_div_three],
    by ring, (kvadrant3 _ (by linarith) (by linarith)).2.2⟩

/-- Primer 3: 7π/6 = 210° (III. kvadrant, ostri kot 30°), sin 210° = −1/2, cos 210° = −√3/2;
y = 12·(−1/2) = −6 mm, h = 40 − 6 = 34 mm, x = 12·(−√3/2) = −6√3 ≈ −10,4 mm.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#primer3
besedilo: »$x = 12\,\text{mm} \cdot \left(-\frac{\sqrt3}{2}\right) = -6\sqrt3\,\text{mm} \approx -10{,}4\,\text{mm}$« -/
theorem primer3 : 7 * π / 6 * (180 / π) = 210 ∧ (210 : ℝ) - 180 = 30 ∧
    sin (7 * π / 6) = -(1 / 2) ∧ cos (7 * π / 6) = -(√3 / 2) ∧
    12 * sin (7 * π / 6) = -6 ∧ 40 + 12 * sin (7 * π / 6) = 34 ∧
    12 * cos (7 * π / 6) = -6 * √3 ∧ (-10.45 : ℝ) < -6 * √3 ∧ -6 * √3 < -10.35 := by
  have hp := pi_pos
  have h3 := koren3
  have hs : sin (7 * π / 6) = -(1 / 2) := kot150_210.2.2.2
  have hc : cos (7 * π / 6) = -(√3 / 2) := by
    rw [show 7 * π / 6 = π + π / 6 by ring, (pripadajoci _).2.2.2.1, cos_pi_div_six]
  refine ⟨by field_simp; ring, by norm_num, hs, hc, by rw [hs]; norm_num, by rw [hs]; norm_num,
    by rw [hc]; ring, by linarith, by linarith⟩

/-- Primer 4: iz sin α = 3/5 sledi cos²α = 1 − 9/25 = 16/25, torej cos α = 4/5 ali cos α = −4/5 (obe možnosti
korenjenja, kot enakovrednost); v II. kvadrantu je cos α = −4/5 in tan α = (3/5)/(−4/5) = −3/4.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#primer4
besedilo: »V II. kvadrantu je kosinus negativen, zato $\cos\alpha = -\frac45$. Potem je $\tan\alpha = \dfrac{3/5}{-4/5} = -\frac34$.« -/
theorem primer4 (α : ℝ) (hs : sin α = 3 / 5) (h0 : π / 2 < α) (h1 : α < π) :
    cos α ^ 2 = 1 - 9 / 25 ∧ (1 : ℝ) - 9 / 25 = 16 / 25 ∧
    (∀ c : ℝ, c ^ 2 = 16 / 25 ↔ c = 4 / 5 ∨ c = -4 / 5) ∧
    cos α = -4 / 5 ∧ tan α = (3 / 5) / (-4 / 5) ∧ (3 / 5 : ℝ) / (-4 / 5) = -3 / 4 := by
  have hk : cos α ^ 2 = 1 - 9 / 25 := by have := sin_sq_add_cos_sq α; rw [hs] at this; linarith
  have hn := (kvadrant2 α h0 h1).2.1
  have hc : cos α = -4 / 5 := by nlinarith
  refine ⟨hk, by norm_num, fun c => ⟨fun h => ?_, fun h => ?_⟩, hc, by rw [tan_eq_sin_div_cos, hs, hc],
    by norm_num⟩
  · have : (c - 4 / 5) * (c + 4 / 5) = 0 := by nlinarith
    rcases mul_eq_zero.mp this with h' | h'
    · left; linarith
    · right; linarith
  · rcases h with rfl | rfl <;> norm_num

/-- Pogoji izreka `primer4` se dajo izpolniti: α = 180° − arcsin(3/5). -/
example : sin (π - arcsin (3 / 5)) = 3 / 5 ∧ π / 2 < π - arcsin (3 / 5) ∧ π - arcsin (3 / 5) < π := by
  have h1 : 0 < arcsin (3 / 5 : ℝ) := arcsin_pos.mpr (by norm_num)
  have h2 : arcsin (3 / 5 : ℝ) < π / 2 := arcsin_lt_pi_div_two.mpr (by norm_num)
  exact ⟨by rw [sin_pi_sub, sin_arcsin (by norm_num) (by norm_num)], by linarith, by linarith⟩

/-! ## Pogoste napake -/

/-- Pogoste napake in Preveri se 2: cos 120° = −1/2 = −0,5, ne cos 60° = 1/2.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#cos120
besedilo: »0,5 | To je $\cos 60^\circ$ brez predznaka. Kot $120^\circ$ je v II. kvadrantu, kjer je kosinus negativen.« -/
theorem cos120 : cos (2 * π / 3) = -(1 / 2) ∧ cos (2 * π / 3) ≠ cos (π / 3) ∧ -(1 / 2 : ℝ) = -0.5 := by
  have e : cos (2 * π / 3) = -(1 / 2) := by
    rw [show 2 * π / 3 = π - π / 3 by ring, cos_pi_sub, cos_pi_div_three]
  refine ⟨e, by rw [e, cos_pi_div_three]; norm_num, by norm_num⟩

/-- Pogoste napake in Preveri se 4: kot 2 rad je v II. kvadrantu (π/2 < 2 < π) in meri ≈ 114,6°, kar je več
od 100° = 5π/9 rad.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#kot2
besedilo: »$2\,\text{rad} = 2 \cdot \frac{180^\circ}{\pi} \approx 114{,}6^\circ$, kar je več kot $100^\circ$.« -/
theorem kot2 : π / 2 < 2 ∧ 2 < π ∧ (114.55 : ℝ) < 2 * (180 / π) ∧ 2 * (180 / π) < 114.65 ∧
    100 * (π / 180) < 2 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have hp := pi_pos
  refine ⟨by linarith, by linarith, ?_, ?_, by linarith⟩
  · rw [mul_div_assoc', lt_div_iff₀ hp]; linarith
  · rw [mul_div_assoc', div_lt_iff₀ hp]; linarith

/-- Pogoste napake in Preveri se 5 (kalkulator v načinu RAD): sinus 30 radianov je ≈ −0,988 (negativen),
sin 30° = 0,5.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#sin30rad
besedilo: »Kalkulator v napačnem načinu.** »$\sin 30 = -0{,}988$, torej je sinus $30^\circ$ negativen.« Kalkulator je bil nastavljen na radiane (RAD) in je izračunal sinus $30$ radianov.« -/
theorem sin30rad : (-0.9885 : ℝ) < sin 30 ∧ sin 30 < -0.9875 ∧ sin (30 * (π / 180)) = 0.5 := by
  set x : ℝ := 30 - 19 * π / 2 with hx
  have e : sin 30 = - cos x := by
    have : (30:ℝ) = (x + π / 2 + π) + (4:ℕ) * (2 * π) := by rw [hx]; push_cast; ring
    rw [this, sin_add_nat_mul_two_pi, sin_add_pi, sin_add_pi_div_two]
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have x1 : 0.15486 < x := by rw [hx]; linarith
  have x2 : x < 0.15488 := by rw [hx]; linarith
  have hb := cos_bound (x := x) (by rw [abs_le]; constructor <;> linarith)
  rw [abs_of_pos (by linarith : (0:ℝ) < x)] at hb
  rw [abs_le] at hb
  have q1 : x ^ 2 < 0.15488 ^ 2 := by nlinarith
  have q2 : 0.15486 ^ 2 < x ^ 2 := by nlinarith
  have q4 : x ^ 4 < 0.0006 := by nlinarith
  refine ⟨by rw [e]; nlinarith, by rw [e]; nlinarith, ?_⟩
  rw [show 30 * (π / 180) = π / 6 by ring, sin_pi_div_six]; norm_num

/-! ## Za maturo -/

/-- Naloga 1: sin(7π/4) = −√2/2 (315°, IV. kvadrant), cos(3π/4) = −√2/2 (135°, II. kvadrant), produkt 2/4 = 1/2;
8π/3 = 2π + 2π/3, tan(8π/3) = tan(2π/3) = −√3; izraz 1/2 − (−√3) = 1/2 + √3.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#matura1
besedilo: »Točkovanje:** 1 točka za $\sin\frac{7\pi}{4} = -\frac{\sqrt2}{2}$ in $\cos\frac{3\pi}{4} = -\frac{\sqrt2}{2}$ s pravilnima predznakoma, 1 točka za $\tan\frac{8\pi}{3} = -\sqrt3$ (z odštetim polnim kotom), 1 točka za končni rezultat $\frac12 + \sqrt3$.« -/
theorem matura1 : sin (7 * π / 4) = -(√2 / 2) ∧ cos (3 * π / 4) = -(√2 / 2) ∧
    (-(√2 / 2)) * (-(√2 / 2)) = 2 / 4 ∧ (2 : ℝ) / 4 = 1 / 2 ∧ 8 * π / 3 = 2 * π + 2 * π / 3 ∧
    tan (8 * π / 3) = tan (2 * π / 3) ∧ tan (2 * π / 3) = -√3 ∧
    sin (7 * π / 4) * cos (3 * π / 4) - tan (8 * π / 3) = 1 / 2 - (-√3) ∧ 1 / 2 - (-√3) = 1 / 2 + √3 := by
  have hs : sin (7 * π / 4) = -(√2 / 2) := by
    rw [show 7 * π / 4 = 2 * π - π / 4 by ring, sin_two_pi_sub, sin_pi_div_four]
  have hc : cos (3 * π / 4) = -(√2 / 2) := by
    rw [show 3 * π / 4 = π - π / 4 by ring, cos_pi_sub, cos_pi_div_four]
  have hp : (-(√2 / 2)) * (-(√2 / 2)) = 2 / 4 := by
    rw [neg_mul_neg, ← sq, div_pow, Real.sq_sqrt (by norm_num)]; norm_num
  have ht : tan (8 * π / 3) = tan (2 * π / 3) := by
    rw [tan_eq_sin_div_cos, tan_eq_sin_div_cos, show 8 * π / 3 = 2 * π / 3 + 2 * (1 : ℤ) * π by push_cast; ring,
      (periodicnost _ 1).1, (periodicnost _ 1).2]
  have ht2 : tan (2 * π / 3) = -√3 := by
    rw [tan_eq_sin_div_cos, cos120.1, show 2 * π / 3 = π - π / 3 by ring, sin_pi_sub, sin_pi_div_three]; ring
  refine ⟨hs, hc, hp, by norm_num, by ring, ht, ht2, by rw [hs, hc, hp, ht, ht2]; norm_num, by ring⟩

/-- Naloga 2 a), RACUN `resi`: točka (−5/13, y) leži na enotski krožnici natanko za y = −12/13 ali y = 12/13
(y² = 1 − 25/169 = 144/169); pod osjo x je y = −12/13.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#matura2a
besedilo: »a) Točka $T$ leži na enotski krožnici, zato je $\left(-\frac{5}{13}\right)^2 + y^2 = 1$ in $y^2 = 1 - \frac{25}{169} = \frac{144}{169}$.« -/
theorem matura2a (y : ℝ) : ((-5 / 13 : ℝ) ^ 2 + y ^ 2 = 1 ↔ y = -12 / 13 ∨ y = 12 / 13) ∧
    ((-5 / 13 : ℝ) ^ 2 + y ^ 2 = 1 → y ^ 2 = 1 - 25 / 169 ∧ (1 : ℝ) - 25 / 169 = 144 / 169) ∧
    ((-5 / 13 : ℝ) ^ 2 + y ^ 2 = 1 → y < 0 → y = -12 / 13) := by
  have key : (-5 / 13 : ℝ) ^ 2 + y ^ 2 = 1 ↔ y = -12 / 13 ∨ y = 12 / 13 := by
    constructor
    · intro h
      have : (y + 12 / 13) * (y - 12 / 13) = 0 := by nlinarith
      rcases mul_eq_zero.mp this with h' | h'
      · left; linarith
      · right; linarith
    · rintro (rfl | rfl) <;> norm_num
  refine ⟨key, fun h => ⟨by linarith, by norm_num⟩, fun h hy => ?_⟩
  rcases key.mp h with h' | h'
  · exact h'
  · rw [h'] at hy; norm_num at hy

/-- Naloga 2 a)–c): kot α ∈ [0, 2π) s cos α = −5/13 in sin α = −12/13 leži v III. kvadrantu
(π < α < 3π/2), tan α = (−12/13)/(−5/13) = 12/5; točka S(−5/13, 12/13) je zrcalna slika T čez os x,
β = 2π − α leži v (π/2, π) ⊂ [0, 2π), sin β = 12/13, cos β = −5/13, in β je edini tak kot v [0, 2π).
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#matura2
besedilo: »b) $\tan\alpha = \dfrac{\sin\alpha}{\cos\alpha} = \dfrac{-12/13}{-5/13} = \dfrac{12}{5}$, kar je pozitivno, kot mora biti v III. kvadrantu.« -/
theorem matura2 (α : ℝ) (h0 : 0 ≤ α) (h1 : α < 2 * π) (hc : cos α = -5 / 13) (hs : sin α = -12 / 13) :
    π < α ∧ α < 3 * π / 2 ∧ tan α = (-12 / 13) / (-5 / 13) ∧ (-12 / 13 : ℝ) / (-5 / 13) = 12 / 5 ∧
    π / 2 < 2 * π - α ∧ 2 * π - α < π ∧ sin (2 * π - α) = 12 / 13 ∧ cos (2 * π - α) = -5 / 13 ∧
    ∀ β : ℝ, 0 ≤ β → β < 2 * π → sin β = 12 / 13 → cos β = -5 / 13 → β = 2 * π - α := by
  have hp := pi_pos
  have a1 : π < α := by
    by_contra h; push Not at h
    have := sin_nonneg_of_nonneg_of_le_pi h0 h; linarith
  have a2 : α < 3 * π / 2 := by
    by_contra h; push Not at h
    have := cos_nonneg_of_neg_pi_div_two_le_of_le (x := α - 2 * π) (by linarith) (by linarith)
    rw [cos_sub_two_pi] at this; linarith
  have sb : sin (2 * π - α) = 12 / 13 := by rw [sin_two_pi_sub, hs]; norm_num
  have cb : cos (2 * π - α) = -5 / 13 := by rw [cos_two_pi_sub, hc]
  refine ⟨a1, a2, by rw [tan_eq_sin_div_cos, hs, hc], by norm_num, by linarith, by linarith, sb, cb, ?_⟩
  intro β hb0 hb1 hsb hcb
  have h1' : cos (β - (2 * π - α)) = 1 := by
    rw [cos_sub, hsb, hcb, sb, cb]; norm_num
  obtain ⟨n, hn⟩ := (cos_eq_one_iff _).mp h1'
  have n1 : (n : ℝ) < 1 := by
    by_contra h; push Not at h
    have : 2 * π ≤ (n : ℝ) * (2 * π) := by nlinarith
    linarith
  have n2 : (-1 : ℝ) < n := by
    by_contra h; push Not at h
    have : (n : ℝ) * (2 * π) ≤ -(2 * π) := by nlinarith
    linarith
  have : n = 0 := by
    have a : n < 1 := by exact_mod_cast n1
    have b : -1 < n := by exact_mod_cast n2
    omega
  rw [this] at hn; simp at hn; linarith

/-- Pogoji izreka `matura2` se dajo izpolniti: α = 2π − arccos(−5/13) (kot iz bloka RACUN), za katerega je
cos α = −5/13 in sin α = −12/13; RACUN: sin(2π − (2π − arccos(−5/13))) = 12/13.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#matura2-kot
besedilo: »$\tan\alpha = \dfrac{\sin\alpha}{\cos\alpha} = \dfrac{-12/13}{-5/13} = \dfrac{12}{5}$« -/
theorem matura2_kot : 0 ≤ 2 * π - arccos (-5 / 13) ∧ 2 * π - arccos (-5 / 13) < 2 * π ∧
    cos (2 * π - arccos (-5 / 13)) = -5 / 13 ∧ sin (2 * π - arccos (-5 / 13)) = -12 / 13 ∧
    sin (2 * π - (2 * π - arccos (-5 / 13))) = 12 / 13 := by
  have hp := pi_pos
  have q : √(1 - (-5 / 13 : ℝ) ^ 2) = 12 / 13 := by
    rw [show (1 - (-5 / 13 : ℝ) ^ 2) = (12 / 13) ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have a1 := arccos_le_pi (-5 / 13 : ℝ)
  have a2 : 0 < arccos (-5 / 13 : ℝ) := arccos_pos.mpr (by norm_num)
  refine ⟨by linarith, by linarith, by rw [cos_two_pi_sub, cos_arccos (by norm_num) (by norm_num)],
    by rw [sin_two_pi_sub, sin_arccos, q]; norm_num, by rw [sub_sub_cancel, sin_arccos, q]⟩

/-- Pogoji izreka `matura2` se dajo izpolniti (kot iz `matura2_kot`). -/
example : ∃ α : ℝ, 0 ≤ α ∧ α < 2 * π ∧ cos α = -5 / 13 ∧ sin α = -12 / 13 :=
  ⟨_, matura2_kot.1, matura2_kot.2.1, matura2_kot.2.2.1, matura2_kot.2.2.2.1⟩

/-- Ustno vprašanje 3: cos 225° = −cos 45° = −√2/2 (III. kvadrant, ostri kot 45°).
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#cos225
besedilo: »Na primer kot $225^\circ$ leži v III. kvadrantu s pripadajočim ostrim kotom $45^\circ$, zato je $\cos 225^\circ = -\cos 45^\circ = -\frac{\sqrt2}{2}$.« -/
theorem cos225 : cos (5 * π / 4) = -cos (π / 4) ∧ -cos (π / 4) = -(√2 / 2) := by
  refine ⟨by rw [show 5 * π / 4 = π + π / 4 by ring, (pripadajoci _).2.2.2.1], by rw [cos_pi_div_four]⟩

/-! ## Drugače -/

/-- Drugače, korak za korakom (tabela): (cos, sin) za 30°, 150°, 210°, 330° je (√3/2, 1/2), (−√3/2, 1/2),
(−√3/2, −1/2), (√3/2, −1/2); preverba za 150°: (−√3/2)² + (1/2)² = 3/4 + 1/4 = 1.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#tabela-30
besedilo: »| $330^\circ$ | IV. | $30^\circ$ | $(\frac{\sqrt3}{2}, -\frac12)$ |« -/
theorem tabela_30 :
    (cos (π / 6) = √3 / 2 ∧ sin (π / 6) = 1 / 2) ∧
    (cos (5 * π / 6) = -(√3 / 2) ∧ sin (5 * π / 6) = 1 / 2) ∧
    (cos (7 * π / 6) = -(√3 / 2) ∧ sin (7 * π / 6) = -(1 / 2)) ∧
    (cos (11 * π / 6) = √3 / 2 ∧ sin (11 * π / 6) = -(1 / 2)) ∧
    (-(√3 / 2)) ^ 2 + (1 / 2 : ℝ) ^ 2 = 3 / 4 + 1 / 4 ∧ (3 : ℝ) / 4 + 1 / 4 = 1 := by
  refine ⟨⟨cos_pi_div_six, sin_pi_div_six⟩, ⟨kot150_210.2.2.1, kot150_210.2.1⟩,
    ⟨primer3.2.2.2.1, primer3.2.2.1⟩, ⟨?_, ?_⟩, ?_, by norm_num⟩
  · rw [show 11 * π / 6 = 2 * π - π / 6 by ring, cos_two_pi_sub, cos_pi_div_six]
  · rw [show 11 * π / 6 = 2 * π - π / 6 by ring, sin_two_pi_sub, sin_pi_div_six]
  · rw [neg_sq, div_pow, kv3]; norm_num

/-- Drugače, korak za korakom: štiri točke A(√3/2, 1/2), B(−√3/2, 1/2), C(−√3/2, −1/2), D(√3/2, −1/2)
so oglišča pravokotnika: AB in DC sta enaka vektorja (paralelogram), AB ⟂ BC (pravi kot pri B).
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#tabela-pravokotnik
besedilo: »Vidiš vzorec: vse štiri točke so oglišča pravokotnika, ki je vrisan v krožnico. Številke so iste, spreminjajo se le predznaki. Preveri še osnovno zvezo za $150^\circ$: $\left(-\frac{\sqrt3}{2}\right)^2 + \left(\frac12\right)^2 = \frac34 + \frac14 = 1$.« -/
theorem tabela_pravokotnik :
    let A : ℝ × ℝ := (√3 / 2, 1 / 2)
    let B : ℝ × ℝ := (-(√3 / 2), 1 / 2)
    let C : ℝ × ℝ := (-(√3 / 2), -(1 / 2))
    let D : ℝ × ℝ := (√3 / 2, -(1 / 2))
    B - A = C - D ∧ (B - A).1 * (C - B).1 + (B - A).2 * (C - B).2 = 0 ∧ B - A ≠ 0 ∧ C - B ≠ 0 := by
  intro A B C D
  have h3 : 0 < √3 := by positivity
  refine ⟨?_, ?_, ?_, ?_⟩
  · ext
    · simp only [A, B, C, D, Prod.fst_sub]
    · simp only [A, B, C, D, Prod.snd_sub]; ring
  · simp only [A, B, C, Prod.fst_sub, Prod.snd_sub]; ring
  · intro h; have := congrArg Prod.fst h; simp only [A, B, Prod.fst_sub, Prod.fst_zero] at this; linarith
  · intro h; have := congrArg Prod.snd h; simp only [B, C, Prod.snd_sub, Prod.snd_zero] at this; linarith

/-- Drugače, iz vsakdanjega življenja: po obodu zložiš malo več kot šest vrvic, 2π ≈ 6,28.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#sest-vrvic
besedilo: »Po obodu zložiš malo več kot šest takih vrvic ($2\pi \approx 6{,}28$),« -/
theorem sest_vrvic : (6 : ℝ) < 2 * π ∧ (6.275 : ℝ) < 2 * π ∧ 2 * π < 6.285 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  refine ⟨by linarith, by linarith, by linarith⟩

/-! ## Preveri se -/

/-- Preveri se 1: sinus je lahko negativen (sin 270° = −1), pri 90° je kosinus (imenovalec) enak 0, in en
radian ni ena stopinja (180/π ≠ 1).
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#preveri1
besedilo: »Pri $90^\circ$ je nič kosinus, ki je v imenovalcu, ne sinus v števcu.« -/
theorem preveri1 : sin (3 * π / 2) < 0 ∧ cos (π / 2) = 0 ∧ 180 / π ≠ 1 := by
  refine ⟨by rw [kot270.1]; norm_num, cos_pi_div_two, ?_⟩
  have := radian.2.2.1; intro h; rw [h] at this; norm_num at this

/-- Preveri se 2: napačni odgovor −0,87 je −sin 60° = −√3/2 ≈ −0,87.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#preveri2
besedilo: »-0,87 | Predznak je pravilen, absolutna vrednost pa je $\sin 60^\circ = \frac{\sqrt3}{2} \approx 0{,}87$, ne $\cos 60^\circ$.« -/
theorem preveri2 : -sin (π / 3) = -(√3 / 2) ∧ (-0.875 : ℝ) < -(√3 / 2) ∧ -(√3 / 2) < -0.865 := by
  have h3 := koren3
  refine ⟨by rw [sin_pi_div_three], by linarith, by linarith⟩

/-- Preveri se 3 (Luka): 300° je v IV. kvadrantu (270° < 300° < 360°), ostri kot 360° − 300° = 60°, napaka je
v koraku 3: sin 300° = −sin 60° = −√3/2 < 0.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#preveri3
besedilo: »Luka je računal $\sin 300^\circ$: »(1) Kot je v IV. kvadrantu. (2) Pripadajoči ostri kot je $360^\circ - 300^\circ = 60^\circ$. (3) Torej je $\sin 300^\circ = \frac{\sqrt3}{2}$.« Kje je napaka?« -/
theorem preveri3 : 3 * π / 2 < 5 * π / 3 ∧ 5 * π / 3 < 2 * π ∧ 2 * π - 5 * π / 3 = π / 3 ∧
    sin (5 * π / 3) = -sin (π / 3) ∧ -sin (π / 3) = -(√3 / 2) ∧ sin (5 * π / 3) ≠ √3 / 2 := by
  have hp := pi_pos
  have e : sin (5 * π / 3) = -sin (π / 3) := by
    rw [show 5 * π / 3 = 2 * π - π / 3 by ring, sin_two_pi_sub]
  have h3 : 0 < √3 := by positivity
  refine ⟨by linarith, by linarith, by ring, e, by rw [sin_pi_div_three], ?_⟩
  rw [e, sin_pi_div_three]; intro h; linarith

/-- Preveri se 6: tan 225° = tan 45° = 1 (III. kvadrant, tangens pozitiven), ne −1.
trditev: MAT-SS-3/kotne-funkcije-poljubnega-kota#preveri6
besedilo: »Pripadajoči ostri kot je $225^\circ - 180^\circ = 45^\circ$ in $\tan 45^\circ = 1$. V III. kvadrantu je tangens pozitiven, zato $\tan 225^\circ = 1$.« -/
theorem preveri6 : tan (5 * π / 4) = 1 ∧ tan (5 * π / 4) ≠ -1 := by
  have e : tan (5 * π / 4) = 1 := by
    rw [tan_eq_sin_div_cos, show 5 * π / 4 = π + π / 4 by ring, (pripadajoci _).2.2.1,
      (pripadajoci _).2.2.2.1, neg_div_neg_eq, ← tan_eq_sin_div_cos, tan_pi_div_four]
  exact ⟨e, by rw [e]; norm_num⟩

end Evklid.Lekcije.MAT_SS_3.KotneFunkcijePoljubnegaKota
