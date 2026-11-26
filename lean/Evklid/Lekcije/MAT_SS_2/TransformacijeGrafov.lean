/-
vir: content/lessons/MAT-SS-2/transformacije-grafov.md
sha256: 90931abc94e276318075dcfd2b5c881e1ebde7018009e3389d07a3fbe2d226f2
Ni v Leanu: zgodba o senzorju (meritve, Freckmann in sod. 2007; dokazan je le model m, s, n in pretvorba
132 mg/dL ≈ 7,3 mmol/L z deliteljem 18,016 iz bloka RACUN), risbe, drsniki in simulacija (opis; dokazane so
trditve, ki jih opisujejo: lega temena, točke (1, a), presečišče √(kx) = 2 pri x = 4/k), »Kot zgodba«
(odrski delavci), Postopek in Pazi na (navodila), opisi »strmejši / položnejši / ožja / širša« kot
geometrijski pojem (dokazano je, da se vrednosti pomnožijo z a in da je |a·y| ≥ |y| za |a| ≥ 1 oz. ≤ za
|a| ≤ 1; vrstni red parabol v Preveri se 1 je dokazan kot vrstni red faktorjev 4 > 3 > 1 > 1/2), točkovanje.
Graf funkcije je množica `graf f = {(x, y) | y = f x}`. Lean definira √x tudi za x < 0 (√x = 0), zato je
definicijsko območje korena zapisano kot pogoj x + 4 ≥ 0 oz. x ≤ 0 in zaloga vrednosti kot slika tega območja.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.TransformacijeGrafov

open Real Set

/-- Graf funkcije f: množica točk (x, f(x)). -/
def graf (f : ℝ → ℝ) : Set (ℝ × ℝ) := {P | P.2 = f P.1}

/-! ## Razlaga -/

/-- Razlaga, tabela: vrednosti x², x² + 2 in (x − 2)² za x = −1, 0, 1, 2, 3, 4. -/
theorem tabela :
    ((-1:ℝ) ^ 2 = 1 ∧ (-1:ℝ) ^ 2 + 2 = 3 ∧ ((-1:ℝ) - 2) ^ 2 = 9) ∧
    ((0:ℝ) ^ 2 = 0 ∧ (0:ℝ) ^ 2 + 2 = 2 ∧ ((0:ℝ) - 2) ^ 2 = 4) ∧
    ((1:ℝ) ^ 2 = 1 ∧ (1:ℝ) ^ 2 + 2 = 3 ∧ ((1:ℝ) - 2) ^ 2 = 1) ∧
    ((2:ℝ) ^ 2 = 4 ∧ (2:ℝ) ^ 2 + 2 = 6 ∧ ((2:ℝ) - 2) ^ 2 = 0) ∧
    ((3:ℝ) ^ 2 = 9 ∧ (3:ℝ) ^ 2 + 2 = 11 ∧ ((3:ℝ) - 2) ^ 2 = 1) ∧
    ((4:ℝ) ^ 2 = 16 ∧ (4:ℝ) ^ 2 + 2 = 18 ∧ ((4:ℝ) - 2) ^ 2 = 4) := by
  norm_num

/-- Razlaga (tabela in slika): teme x² + 2 je (0, 2), teme (x − 2)² je (2, 0): najmanjša vrednost 2 oz. 0 je
dosežena natanko pri x = 0 oz. x = 2 (premik v desno, čeprav smo 2 odšteli). -/
theorem temeni :
    (∀ x : ℝ, 2 ≤ x ^ 2 + 2 ∧ (x ^ 2 + 2 = 2 ↔ x = 0)) ∧
    (∀ x : ℝ, 0 ≤ (x - 2) ^ 2 ∧ ((x - 2) ^ 2 = 0 ↔ x = 2)) := by
  refine ⟨fun x => ⟨by nlinarith [sq_nonneg x], ?_⟩, fun x => ⟨sq_nonneg _, ?_⟩⟩
  · constructor
    · intro h; exact pow_eq_zero_iff (n := 2) (by norm_num) |>.mp (by linarith)
    · rintro rfl; norm_num
  · constructor
    · intro h; have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h; linarith
    · rintro rfl; norm_num

/-- Zakaj se tega učimo: krivulja m(t) = −2(t − 1)² + 7, premaknjena za 2 uri v desno, ima vrh pri t = 3 (ob
10.00) in je pri t = 4 (ob 11.00) spet 5; sobotna vrednost ob 10.00 (t = 3) je enaka običajni ob 8.00 (t = 1). -/
theorem uvod :
    (∀ t : ℝ, -2 * ((t - 2) - 1) ^ 2 + 7 ≤ 7 ∧ (-2 * ((t - 2) - 1) ^ 2 + 7 = 7 ↔ t = 3)) ∧
    -2 * (((4:ℝ) - 2) - 1) ^ 2 + 7 = 5 ∧ -2 * (((3:ℝ) - 2) - 1) ^ 2 + 7 = -2 * ((1:ℝ) - 1) ^ 2 + 7 := by
  refine ⟨fun t => ⟨by nlinarith [sq_nonneg (t - 2 - 1)], ⟨fun h => ?_, by rintro rfl; norm_num⟩⟩, by norm_num,
    by norm_num⟩
  have h2 : (t - 2 - 1) ^ 2 = 0 := by linarith
  have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h2; linarith

/-- Razlaga, splošno pravilo »Vse skupaj« (in Povzetek, Ustno vprašanje 1): graf g(x) = a·f(x − p) + q je
slika grafa f pri preslikavi (x, y) ↦ (x + p, a·y + q). Velja za vse a, p, q. -/
theorem vse_skupaj (f : ℝ → ℝ) (a p q : ℝ) :
    graf (fun x => a * f (x - p) + q) = (fun P : ℝ × ℝ => (P.1 + p, a * P.2 + q)) '' graf f := by
  ext ⟨x, y⟩
  simp only [graf, mem_ofPred_eq, mem_image, Prod.exists, Prod.mk.injEq]
  constructor
  · intro h
    exact ⟨x - p, f (x - p), rfl, by ring, h.symm⟩
  · rintro ⟨u, v, hv, hx, hy⟩
    subst hx hy hv
    simp

/-- Razlaga »Vzporedni premik« in seznam preslikav: f(x) + q da (x, y) ↦ (x, y + q), f(x − p) da
(x, y) ↦ (x + p, y). -/
theorem premika (f : ℝ → ℝ) (p q : ℝ) :
    graf (fun x => f x + q) = (fun P : ℝ × ℝ => (P.1, P.2 + q)) '' graf f ∧
    graf (fun x => f (x - p)) = (fun P : ℝ × ℝ => (P.1 + p, P.2)) '' graf f := by
  constructor
  · have := vse_skupaj f 1 0 q
    simp only [sub_zero, one_mul, add_zero] at this
    exact this
  · have := vse_skupaj f 1 p 0
    simp only [one_mul, add_zero] at this
    exact this

/-- Razlaga »Zrcaljenje« in seznam preslikav: −f(x) da (x, y) ↦ (x, −y), f(−x) da (x, y) ↦ (−x, y),
a·f(x) da (x, y) ↦ (x, a·y). -/
theorem zrcaljenji_razteg (f : ℝ → ℝ) (a : ℝ) :
    graf (fun x => -f x) = (fun P : ℝ × ℝ => (P.1, -P.2)) '' graf f ∧
    graf (fun x => f (-x)) = (fun P : ℝ × ℝ => (-P.1, P.2)) '' graf f ∧
    graf (fun x => a * f x) = (fun P : ℝ × ℝ => (P.1, a * P.2)) '' graf f := by
  refine ⟨?_, ?_, ?_⟩
  · have := vse_skupaj f (-1) 0 0
    simp only [sub_zero, add_zero, neg_one_mul] at this
    exact this
  · ext ⟨x, y⟩
    simp only [graf, mem_ofPred_eq, mem_image, Prod.exists, Prod.mk.injEq]
    constructor
    · intro h; exact ⟨-x, y, h, neg_neg x, rfl⟩
    · rintro ⟨u, v, hv, hx, hy⟩; subst hx hy hv; simp
  · have := vse_skupaj f a 0 0
    simp only [sub_zero, add_zero] at this
    exact this

/-- Razlaga »Raztezanje v smeri osi x« in seznam preslikav: za k ≠ 0 (v lekciji k > 0) f(kx) da
(x, y) ↦ (x/k, y). -/
theorem skrcitev (f : ℝ → ℝ) (k : ℝ) (hk : k ≠ 0) :
    graf (fun x => f (k * x)) = (fun P : ℝ × ℝ => (P.1 / k, P.2)) '' graf f := by
  ext ⟨x, y⟩
  simp only [graf, mem_ofPred_eq, mem_image, Prod.exists, Prod.mk.injEq]
  constructor
  · intro h; exact ⟨k * x, y, h, by field_simp, rfl⟩
  · rintro ⟨u, v, hv, hx, hy⟩
    subst hx hy hv
    congr 1; field_simp

/-- Predpostavka izreka `skrcitev` se da izpolniti (k = 2). -/
example : (2:ℝ) ≠ 0 := by norm_num

/-- Razlaga »Zakaj v desno?«: (x − 2)² pri x = 3 da 1² = 1, isto kot x² pri x = 1; pri p = 2 je g(x) = f(x − 2)
pri x enak f pri x − 2. -/
theorem zakaj_desno : ((3:ℝ) - 2) ^ 2 = 1 ^ 2 ∧ (1:ℝ) ^ 2 = 1 ∧
    ∀ (f : ℝ → ℝ) (x : ℝ), (fun t => f (t - 2)) x = f (x - 2) :=
  ⟨by norm_num, by norm_num, fun _ _ => rfl⟩

/-- Razlaga, slika z drsnikoma in Povzetek: za a > 0 ima a(x − p)² + q najmanjšo vrednost q natanko pri
x = p (teme (p, q)); pri p = 0, q = 0 je (x + 0)² + 0 = x². -/
theorem teme_parabole (a p q : ℝ) (ha : 0 < a) :
    (∀ x, q ≤ a * (x - p) ^ 2 + q) ∧ (∀ x, a * (x - p) ^ 2 + q = q ↔ x = p) ∧
    (∀ x : ℝ, (x + 0) ^ 2 + 0 = x ^ 2) := by
  refine ⟨fun x => by nlinarith [sq_nonneg (x - p)], fun x => ⟨fun h => ?_, by rintro rfl; ring⟩,
    fun x => by ring⟩
  have h2 : a * (x - p) ^ 2 = 0 := by linarith
  rcases mul_eq_zero.mp h2 with h3 | h3
  · linarith
  · have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h3; linarith

/-- Predpostavka izreka `teme_parabole` se da izpolniti (a = 1). -/
example : (0:ℝ) < 1 := one_pos

/-- Razlaga, Premisli 1: (x + 3)² − 1 = (x − (−3))² + (−1), teme (−3, −1) (p = −3: 3 v levo, 1 navzdol);
preizkus pri x = −3: 0² − 1 = −1. -/
theorem premisli1 :
    (∀ x : ℝ, (x + 3) ^ 2 - 1 = 1 * (x - (-3)) ^ 2 + (-1)) ∧ (∀ x : ℝ, -1 ≤ (x + 3) ^ 2 - 1) ∧
    (∀ x : ℝ, (x + 3) ^ 2 - 1 = -1 ↔ x = -3) ∧ ((-3:ℝ) + 3) ^ 2 - 1 = -1 := by
  obtain ⟨h1, h2, _⟩ := teme_parabole 1 (-3) (-1) one_pos
  refine ⟨fun x => by ring, fun x => ?_, fun x => ?_, by norm_num⟩
  · have := h1 x; linarith [show (x + 3) ^ 2 - 1 = 1 * (x - (-3)) ^ 2 + (-1) by ring]
  · rw [show (x + 3) ^ 2 - 1 = 1 * (x - (-3)) ^ 2 + (-1) by ring]; exact h2 x

/-- Razlaga, zrcaljenje (slika): točka (4, 2) leži na √x; minus zunaj jo pošlje v (4, −2) na −√x, minus
znotraj v (−4, 2) na √(−x); √(−x) je (realno) definiran natanko za x ≤ 0. -/
theorem zrcaljenje_korena : √(4:ℝ) = 2 ∧ -√(4:ℝ) = -2 ∧ √(-(-4):ℝ) = 2 ∧ ∀ x : ℝ, 0 ≤ -x ↔ x ≤ 0 := by
  have h : √(4:ℝ) = 2 := by
    rw [show (4:ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨h, by rw [h], by rw [neg_neg, h], fun x => neg_nonneg⟩

/-- Razlaga »Raztezanje v smeri osi y« (slika z drsnikom a): točka (1, 1) grafa |x| preide v (1, a), pri a = 2
v (1, 2); konica (0, 0) miruje (a·0 = 0); pri a = 1 se grafa pokrijeta, pri a = 0 je graf os x; za |a| ≥ 1 je
|a·y| ≥ |y| (stran od osi x), za |a| ≤ 1 je |a·y| ≤ |y| (proti osi x); pri a < 0 je a·y = −(|a|·y) (razteg s faktorjem |a| in zrcaljenje čez
os x). -/
theorem razteg_y (a : ℝ) :
    a * |(1:ℝ)| = a ∧ 2 * |(1:ℝ)| = 2 ∧ a * |(0:ℝ)| = 0 ∧ (∀ x : ℝ, 1 * |x| = |x|) ∧
    (∀ x : ℝ, 0 * |x| = 0) ∧ (1 ≤ |a| → ∀ y : ℝ, |y| ≤ |a * y|) ∧ (|a| ≤ 1 → ∀ y : ℝ, |a * y| ≤ |y|) ∧
    (a < 0 → ∀ y : ℝ, a * y = -(|a| * y)) := by
  refine ⟨by simp, by simp, by simp, fun x => one_mul _, fun x => zero_mul _, fun h y => ?_, fun h y => ?_,
    fun h y => by rw [abs_of_neg h]; ring⟩
  · rw [abs_mul]; nlinarith [abs_nonneg y]
  · rw [abs_mul]; nlinarith [abs_nonneg y]

/-- Razlaga »Raztezanje v smeri osi x«: x² doseže 4 pri x = 2, (2x)² že pri x = 1; (2x)² = 4x². Slika s
√(kx): za k > 0 in x ≥ 0 je √(kx) = 2 natanko pri x = 4/k; √(2·2) = 2; pri k = 4 je 4/k = 1, pri k = 0,5 je 8. -/
theorem razteg_x :
    (2:ℝ) ^ 2 = 4 ∧ (2 * 1 : ℝ) ^ 2 = 4 ∧ (∀ x : ℝ, (2 * x) ^ 2 = 4 * x ^ 2) ∧
    (∀ k x : ℝ, 0 < k → 0 ≤ x → (√(k * x) = 2 ↔ x = 4 / k)) ∧ √(2 * 2 : ℝ) = 2 ∧
    (4:ℝ) / 4 = 1 ∧ (4:ℝ) / 0.5 = 8 := by
  refine ⟨by norm_num, by norm_num, fun x => by ring, fun k x hk hx => ?_, ?_, by norm_num, by norm_num⟩
  · rw [Real.sqrt_eq_iff_mul_self_eq (by positivity) (by norm_num)]
    constructor
    · intro h; field_simp; linarith
    · intro h; rw [h]; field_simp; norm_num
  · rw [show (2 * 2 : ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Predpostavke četrtega dela `razteg_x` se dajo izpolniti (k = 2, x = 2). -/
example : (0:ℝ) < 2 ∧ (0:ℝ) ≤ 2 := by norm_num

/-- Razlaga »Več korakov hkrati«: vrstni red je pomemben; (1, 1) grafa x² gre pri »krat 2, nato plus 1« v
(1, 3), pri »plus 1, nato krat 2« v (1, 4); √(2 − x) = √(−(x − 2)), vrednost pri x = 2 je 0, pri x = −2 je 2;
koren je definiran za 2 − x ≥ 0, torej x ≤ 2 (graf gre od (2, 0) v levo). -/
theorem vrstni_red :
    2 * (1:ℝ) ^ 2 + 1 = 3 ∧ 2 * ((1:ℝ) ^ 2 + 1) = 4 ∧ (∀ x : ℝ, √(2 - x) = √(-(x - 2))) ∧
    √(2 - 2 : ℝ) = 0 ∧ √(2 - (-2) : ℝ) = 2 ∧ (∀ x : ℝ, 0 ≤ 2 - x ↔ x ≤ 2) := by
  refine ⟨by norm_num, by norm_num, fun x => by ring_nf, by norm_num, ?_,
    fun x => ⟨fun h => by linarith, fun h => by linarith⟩⟩
  rw [show (2 - (-2) : ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Razlaga, Premisli 2, Povzetek in Ustno vprašanje 2: |x| je soda (|−x| = |x|), zato se graf pri zrcaljenju
čez os y ne spremeni; x³ je liha, (−x)³ = −x³, zato zrcaljenje čez os y da isto kot čez os x; tudi x² je soda.
-/
theorem soda_liha :
    (∀ x : ℝ, |-x| = |x|) ∧ (∀ x : ℝ, (-x) ^ 3 = -x ^ 3) ∧ (∀ x : ℝ, (-x) ^ 2 = x ^ 2) ∧
    graf (fun x => |(-x)|) = graf (fun x => |x|) ∧
    graf (fun x => (-x) ^ 3) = graf (fun x => -x ^ 3) := by
  refine ⟨abs_neg, fun x => by ring, fun x => by ring, ?_, ?_⟩
  · simp only [abs_neg]
  · congr 1; funext x; ring

/-! ## Rešeni primeri -/

/-- Primer 1: g(x) = (x − 3)² + 1 je f(x − 3) + 1 za f(x) = x² (p = 3, q = 1); teme (0, 0) preide v (3, 1),
ki je najnižja točka; (1, 1), (−1, 1), (2, 4) preidejo v (4, 2), (2, 2), (5, 5); g(4) = 1² + 1 = 2,
g(5) = 2² + 1 = 5. -/
theorem primer1 :
    (∀ x : ℝ, (x - 3) ^ 2 + 1 = 1 * (x - 3) ^ 2 + 1) ∧ ((0:ℝ) + 3, (0:ℝ) + 1) = (3, 1) ∧
    (∀ x : ℝ, 1 ≤ (x - 3) ^ 2 + 1 ∧ ((x - 3) ^ 2 + 1 = 1 ↔ x = 3)) ∧
    ((1:ℝ) + 3, (1:ℝ) + 1) = (4, 2) ∧ ((-1:ℝ) + 3, (1:ℝ) + 1) = (2, 2) ∧ ((2:ℝ) + 3, (4:ℝ) + 1) = (5, 5) ∧
    ((4:ℝ) - 3) ^ 2 + 1 = 1 ^ 2 + 1 ∧ (1:ℝ) ^ 2 + 1 = 2 ∧ ((2:ℝ) - 3) ^ 2 + 1 = 2 ∧
    ((5:ℝ) - 3) ^ 2 + 1 = 2 ^ 2 + 1 ∧ (2:ℝ) ^ 2 + 1 = 5 := by
  obtain ⟨h1, h2, _⟩ := teme_parabole 1 3 1 one_pos
  refine ⟨fun x => by ring, by norm_num, fun x => ⟨by linarith [h1 x], ?_⟩, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  rw [show (x - 3) ^ 2 + 1 = 1 * (x - 3) ^ 2 + 1 by ring]; exact h2 x

/-- Primer 2: g(x) = −2|x| + 4 (a = −2, q = 4): (1, 1) → (1, 2) → (1, −2) → (1, 2), g(1) = −2 + 4 = 2;
ničli: −2|x| + 4 = 0 ⟺ |x| = 2 ⟺ x = −2 ali x = 2; vrh (0, 4) je najvišja točka in Z_g = (−∞, 4]. -/
theorem primer2 :
    (2 * (1:ℝ) = 2 ∧ -(2:ℝ) = -2 ∧ -(2:ℝ) + 4 = 2) ∧ -2 * |(1:ℝ)| + 4 = -2 + 4 ∧ (-2:ℝ) + 4 = 2 ∧
    (∀ x : ℝ, (-2 * |x| + 4 = 0 ↔ |x| = 2) ∧ (|x| = 2 ↔ x = -2 ∨ x = 2)) ∧
    -2 * |(0:ℝ)| + 4 = 4 ∧ (∀ x : ℝ, -2 * |x| + 4 ≤ 4) ∧ range (fun x : ℝ => -2 * |x| + 4) = Iic 4 := by
  refine ⟨by norm_num, by norm_num, by norm_num, fun x => ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    ?_⟩, by norm_num, fun x => by linarith [abs_nonneg x], ?_⟩
  · rw [abs_eq (by norm_num)]; tauto
  · ext y
    simp only [mem_range, mem_Iic]
    constructor
    · rintro ⟨x, rfl⟩; linarith [abs_nonneg x]
    · intro hy
      refine ⟨(4 - y) / 2, ?_⟩
      rw [abs_of_nonneg (by linarith)]; ring

/-- Primer 3, model: m(t) = −2(t − 1)² + 7 da m(0) = 5, m(1) = 7, m(2) = 5 (s 5 na 7 in nazaj na 5). -/
theorem primer3_model :
    -2 * ((0:ℝ) - 1) ^ 2 + 7 = 5 ∧ -2 * ((1:ℝ) - 1) ^ 2 + 7 = 7 ∧ -2 * ((2:ℝ) - 1) ^ 2 + 7 = 5 := by
  norm_num

/-- Primer 3, koraka 1–4: s(t) = m(t − 2) + 0,5 = −2(t − 3)² + 7,5 (ker je t − 2 − 1 = t − 3); vrh (1, 7) preide
v (1 + 2; 7 + 0,5) = (3; 7,5), na [2, 4] je največja vrednost 7,5 natanko pri t = 3; s(2) = −2·1 + 7,5 = 5,5 =
m(0) + 0,5. -/
theorem primer3_s :
    (∀ t : ℝ, (-2 * ((t - 2) - 1) ^ 2 + 7) + 0.5 = -2 * (t - 3) ^ 2 + 7.5) ∧
    ((1:ℝ) + 2, (7:ℝ) + 0.5) = (3, 7.5) ∧
    (∀ t : ℝ, -2 * (t - 3) ^ 2 + 7.5 ≤ 7.5 ∧ (-2 * (t - 3) ^ 2 + 7.5 = 7.5 ↔ t = 3)) ∧
    -2 * ((2:ℝ) - 3) ^ 2 + 7.5 = -2 * 1 + 7.5 ∧ -2 * (1:ℝ) + 7.5 = 5.5 ∧
    (-2 * ((0:ℝ) - 1) ^ 2 + 7) + 0.5 = 5 + 0.5 ∧ (5:ℝ) + 0.5 = 5.5 := by
  refine ⟨fun t => by ring, by norm_num, fun t => ⟨by nlinarith [sq_nonneg (t - 3)], ⟨fun h => ?_,
    by rintro rfl; norm_num⟩⟩, by norm_num, by norm_num, by norm_num, by norm_num⟩
  have h2 : (t - 3) ^ 2 = 0 := by linarith
  have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h2; linarith

/-- Primer 3, korak 5: −2(t − 3)² + 7,5 = 7 ⟺ (t − 3)² = 0,25 ⟺ t − 3 = ±0,5 ⟺ t = 2,5 ali t = 3,5, in
s(t) ≥ 7 natanko za 2,5 ≤ t ≤ 3,5 (od 9.30 do 10.30). -/
theorem primer3_meja (t : ℝ) :
    (-2 * (t - 3) ^ 2 + 7.5 = 7 ↔ (t - 3) ^ 2 = 0.25) ∧ ((t - 3) ^ 2 = 0.25 ↔ t - 3 = 0.5 ∨ t - 3 = -0.5) ∧
    (t - 3 = 0.5 ∨ t - 3 = -0.5 ↔ t = 3.5 ∨ t = 2.5) ∧
    (7 ≤ -2 * (t - 3) ^ 2 + 7.5 ↔ 2.5 ≤ t ∧ t ≤ 3.5) := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ?_, ⟨?_, ?_⟩, ⟨fun h => ⟨?_, ?_⟩, fun ⟨h1, h2⟩ => ?_⟩⟩
  · rw [show (0.25 : ℝ) = 0.5 ^ 2 by norm_num, sq_eq_sq_iff_eq_or_eq_neg]
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · nlinarith [sq_nonneg (t - 3.5)]
  · nlinarith [sq_nonneg (t - 2.5)]
  · nlinarith

/-- Primer 3, korak 6: n(t) = m(t/2) (k = 1/2): (t, y) ↦ (2t, y), vrh (1, 7) gre v (2, 7); n(2) = m(1) = 7 je
največja vrednost, dosežena natanko pri t = 2. -/
theorem primer3_n :
    (fun t : ℝ => -2 * (t / 2 - 1) ^ 2 + 7) 2 = (fun t : ℝ => -2 * (t - 1) ^ 2 + 7) 1 ∧
    -2 * ((1:ℝ) - 1) ^ 2 + 7 = 7 ∧
    (∀ t : ℝ, -2 * (t / 2 - 1) ^ 2 + 7 ≤ 7 ∧ (-2 * (t / 2 - 1) ^ 2 + 7 = 7 ↔ t = 2)) ∧
    graf (fun t => (fun u : ℝ => -2 * (u - 1) ^ 2 + 7) ((1 / 2) * t)) =
      (fun P : ℝ × ℝ => (P.1 / (1 / 2), P.2)) '' graf (fun u : ℝ => -2 * (u - 1) ^ 2 + 7) := by
  refine ⟨by norm_num, by norm_num, fun t => ⟨by nlinarith [sq_nonneg (t / 2 - 1)], ⟨fun h => ?_,
    by rintro rfl; norm_num⟩⟩, skrcitev (fun u : ℝ => -2 * (u - 1) ^ 2 + 7) (1 / 2) (by norm_num)⟩
  have h2 : (t / 2 - 1) ^ 2 = 0 := by linarith
  have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h2; linarith

/-- Primer 3 (blok RACUN): 132 mg/dL ≈ 7,3 mmol/L (132/18,016 se zaokroži na 7,3). -/
theorem primer3_pretvorba : |(132:ℝ) / 18.016 - 7.3| < 0.05 := by
  rw [abs_lt]; constructor <;> norm_num

/-- Primer 4: parabola s temenom (−2, −3) je g(x) = a(x + 2)² − 3; skozi (0, 5) gre natanko za a = 2
(5 = a·2² − 3, 4a = 8), torej g(x) = 2(x + 2)² − 3, preizkus g(0) = 2·4 − 3 = 5. -/
theorem primer4 (a : ℝ) :
    (∀ x : ℝ, a * (x - (-2)) ^ 2 + (-3) = a * (x + 2) ^ 2 - 3) ∧
    (a * ((0:ℝ) + 2) ^ 2 - 3 = 5 ↔ a = 2) ∧ (5 = a * 2 ^ 2 - 3 ↔ 4 * a = 8) ∧
    2 * ((0:ℝ) + 2) ^ 2 - 3 = 2 * 4 - 3 ∧ (2:ℝ) * 4 - 3 = 5 := by
  refine ⟨fun x => by ring, ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, by norm_num⟩

/-! ## Pogoste napake -/

/-- Pogoste napake: x² + 2 ima teme (0, 2), (x + 2)² pa (−2, 0) (najmanjša vrednost 0 natanko pri x = −2), zato
f(x) + 2 in f(x + 2) nista isto; 2x² ima pri x = 1 vrednost 2; ½x² ima pri 1 vrednost ½ (širša); (2x)² doseže
4 že pri x = 1; 2(x² + 1) = 2x² + 2 ≠ 2x² + 1. -/
theorem napake :
    (∀ x : ℝ, 0 ≤ (x + 2) ^ 2 ∧ ((x + 2) ^ 2 = 0 ↔ x = -2)) ∧ (0:ℝ) ^ 2 + 2 ≠ (0 + 2) ^ 2 ∧
    2 * (1:ℝ) ^ 2 = 2 ∧ 1 / 2 * (1:ℝ) ^ 2 = 1 / 2 ∧ (2 * (1:ℝ)) ^ 2 = 4 ∧
    (∀ x : ℝ, 2 * (x ^ 2 + 1) = 2 * x ^ 2 + 2 ∧ 2 * (x ^ 2 + 1) ≠ 2 * x ^ 2 + 1) := by
  refine ⟨fun x => ⟨sq_nonneg _, ⟨fun h => ?_, by rintro rfl; norm_num⟩⟩, by norm_num, by norm_num, by norm_num,
    by norm_num, fun x => ⟨by ring, fun h => by linarith⟩⟩
  have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h; linarith

/-! ## Za maturo -/

/-- Naloga 1: premik za 4 v levo, zrcaljenje čez os x in premik za 3 navzgor dajo g(x) = −√(x + 4) + 3;
√(x + 4) je definiran natanko za x ≥ −4 (D_g = [−4, ∞)); (0, 0) preide v (−4, 3); g(−4) = 3, g(5) = −√9 + 3 = 0;
zaloga vrednosti na D_g je (−∞, 3]. -/
theorem naloga1 :
    (fun x : ℝ => -1 * √(x - (-4)) + 3) = (fun x => -√(x + 4) + 3) ∧
    (∀ x : ℝ, 0 ≤ x + 4 ↔ -4 ≤ x) ∧ ((0:ℝ) + -4, -1 * (0:ℝ) + 3) = (-4, 3) ∧
    -√((-4:ℝ) + 4) + 3 = 3 ∧ -√((5:ℝ) + 4) + 3 = -√9 + 3 ∧ -√(9:ℝ) + 3 = 0 ∧
    (fun x : ℝ => -√(x + 4) + 3) '' Ici (-4) = Iic 3 := by
  have h9 : √(9:ℝ) = 3 := by rw [show (9:ℝ) = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨by funext x; ring_nf, fun x => ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num,
    by norm_num, by norm_num, by rw [h9]; norm_num, ?_⟩
  ext y
  simp only [mem_image, mem_Ici, mem_Iic]
  constructor
  · rintro ⟨x, _, rfl⟩; linarith [Real.sqrt_nonneg (x + 4)]
  · intro hy
    refine ⟨(3 - y) ^ 2 - 4, by nlinarith [sq_nonneg (3 - y)], ?_⟩
    rw [show (3 - y) ^ 2 - 4 + 4 = (3 - y) ^ 2 by ring, Real.sqrt_sq (by linarith)]; ring

/-- Naloga 2 a), c): g(x) = ½(x − 4)² − 2 je x² s faktorjem ½, premaknjen za 4 v desno in 2 navzdol; teme
(0, 0) → (4, −2) je najnižja točka, Z_g = [−2, ∞). -/
theorem naloga2_ac :
    (∀ x : ℝ, 1 / 2 * (x - 4) ^ 2 - 2 = 1 / 2 * (x - 4) ^ 2 + (-2)) ∧ ((0:ℝ) + 4, 1 / 2 * (0:ℝ) + -2) = (4, -2) ∧
    (∀ x : ℝ, -2 ≤ 1 / 2 * (x - 4) ^ 2 - 2 ∧ (1 / 2 * (x - 4) ^ 2 - 2 = -2 ↔ x = 4)) ∧
    range (fun x : ℝ => 1 / 2 * (x - 4) ^ 2 - 2) = Ici (-2) := by
  obtain ⟨h1, h2, _⟩ := teme_parabole (1 / 2) 4 (-2) (by norm_num)
  refine ⟨fun x => by ring, by norm_num, fun x => ⟨by linarith [h1 x], ?_⟩, ?_⟩
  · rw [show 1 / 2 * (x - 4) ^ 2 - 2 = 1 / 2 * (x - 4) ^ 2 + (-2) by ring]; exact h2 x
  · ext y
    simp only [mem_range, mem_Ici]
    constructor
    · rintro ⟨x, rfl⟩; linarith [h1 x]
    · intro hy
      refine ⟨4 + √(2 * (y + 2)), ?_⟩
      rw [show 4 + √(2 * (y + 2)) - 4 = √(2 * (y + 2)) by ring, Real.sq_sqrt (by linarith)]; ring

/-- Naloga 2 b): ½(x − 4)² − 2 = 0 ⟺ (x − 4)² = 4 ⟺ x − 4 = ±2 ⟺ x = 2 ali x = 6; g(0) = ½·16 − 2 = 6. -/
theorem naloga2_b (x : ℝ) :
    (1 / 2 * (x - 4) ^ 2 - 2 = 0 ↔ (x - 4) ^ 2 = 4) ∧ ((x - 4) ^ 2 = 4 ↔ x - 4 = 2 ∨ x - 4 = -2) ∧
    (x - 4 = 2 ∨ x - 4 = -2 ↔ x = 6 ∨ x = 2) ∧ 1 / 2 * ((0:ℝ) - 4) ^ 2 - 2 = 1 / 2 * 16 - 2 ∧
    1 / 2 * (16:ℝ) - 2 = 6 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ?_, ⟨?_, ?_⟩, by norm_num, by norm_num⟩
  · rw [show (4:ℝ) = 2 ^ 2 by norm_num, sq_eq_sq_iff_eq_or_eq_neg]
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · rintro (h | h)
    · left; linarith
    · right; linarith

/-- Naloga 2 d): zrcaljenje čez os y da g(−x) = ½(−x − 4)² − 2 = ½(x + 4)² − 2 (ker je (−x − 4)² = (x + 4)²);
teme (4, −2) preide v (−4, −2) (najmanjša vrednost natanko pri x = −4). -/
theorem naloga2_d :
    (∀ x : ℝ, 1 / 2 * (-x - 4) ^ 2 - 2 = 1 / 2 * (x + 4) ^ 2 - 2 ∧ (-x - 4) ^ 2 = (x + 4) ^ 2) ∧
    (∀ x : ℝ, -2 ≤ 1 / 2 * (x + 4) ^ 2 - 2 ∧ (1 / 2 * (x + 4) ^ 2 - 2 = -2 ↔ x = -4)) := by
  obtain ⟨h1, h2, _⟩ := teme_parabole (1 / 2) (-4) (-2) (by norm_num)
  refine ⟨fun x => ⟨by ring, by ring⟩, fun x => ⟨?_, ?_⟩⟩
  · have := h1 x; rw [show x - -4 = x + 4 by ring] at this; linarith
  · have := h2 x; rw [show x - -4 = x + 4 by ring] at this
    rw [show 1 / 2 * (x + 4) ^ 2 - 2 = 1 / 2 * (x + 4) ^ 2 + -2 by ring]; exact this

/-- Naloga 3 a), b): f(x) = 2|x − 1| − 4 je |x| raztegnjen s faktorjem 2, premaknjen za 1 v desno in 4 navzdol;
teme (1, −4) je najnižja točka; ničli: |x − 1| = 2 ⟺ x = −1 ali x = 3; f(0) = 2·1 − 4 = −2; Z_f = [−4, ∞). -/
theorem naloga3_ab :
    (∀ x : ℝ, -4 ≤ 2 * |x - 1| - 4) ∧ 2 * |(1:ℝ) - 1| - 4 = -4 ∧
    (∀ x : ℝ, (2 * |x - 1| - 4 = 0 ↔ |x - 1| = 2) ∧ (|x - 1| = 2 ↔ x - 1 = 2 ∨ x - 1 = -2) ∧
      (x - 1 = 2 ∨ x - 1 = -2 ↔ x = 3 ∨ x = -1)) ∧
    2 * |(0:ℝ) - 1| - 4 = 2 * 1 - 4 ∧ (2:ℝ) * 1 - 4 = -2 ∧ range (fun x : ℝ => 2 * |x - 1| - 4) = Ici (-4) := by
  refine ⟨fun x => by linarith [abs_nonneg (x - 1)], by norm_num, fun x => ⟨⟨fun h => by linarith,
    fun h => by rw [h]; norm_num⟩, abs_eq (by norm_num), ⟨?_, ?_⟩⟩, by norm_num, by norm_num, ?_⟩
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · ext y
    simp only [mem_range, mem_Ici]
    constructor
    · rintro ⟨x, rfl⟩; linarith [abs_nonneg (x - 1)]
    · intro hy
      refine ⟨1 + (y + 4) / 2, ?_⟩
      rw [show 1 + (y + 4) / 2 - 1 = (y + 4) / 2 by ring, abs_of_nonneg (by linarith)]; ring

/-- Naloga 3 c): g(x) = f(2x) = 2|2x − 1| − 4; teme (1/2, −4) je najnižja točka; ničli: g(x) = 0 ⟺ x = −1/2
ali x = 3/2; preizkus g(3/2) = 2·|2| − 4 = 0. -/
theorem naloga3_c :
    (∀ x : ℝ, 2 * |2 * x - 1| - 4 = (fun u : ℝ => 2 * |u - 1| - 4) (2 * x)) ∧
    (∀ x : ℝ, -4 ≤ 2 * |2 * x - 1| - 4 ∧ (2 * |2 * x - 1| - 4 = -4 ↔ x = 1 / 2)) ∧
    (∀ x : ℝ, 2 * |2 * x - 1| - 4 = 0 ↔ x = -1 / 2 ∨ x = 3 / 2) ∧
    2 * |2 * (3 / 2 : ℝ) - 1| - 4 = 2 * |(2:ℝ)| - 4 ∧ 2 * |(2:ℝ)| - 4 = 0 := by
  refine ⟨fun x => rfl, fun x => ⟨by linarith [abs_nonneg (2 * x - 1)], ⟨fun h => ?_, ?_⟩⟩, fun x => ?_,
    by norm_num, by norm_num⟩
  · have : |2 * x - 1| = 0 := by linarith
    rw [abs_eq_zero] at this; linarith
  · rintro rfl; norm_num
  · constructor
    · intro h
      have : |2 * x - 1| = 2 := by linarith
      rcases (abs_eq (by norm_num)).mp this with h1 | h1
      · right; linarith
      · left; linarith
    · rintro (rfl | rfl) <;> norm_num

/-- Naloga 3 d), koraki: za x ≥ 1 je f(x) = 2x − 6 in 2x − 6 ≤ x − 1 ⟺ x ≤ 5; za x < 1 je f(x) = −2x − 2 in
−2x − 2 ≤ x − 1 ⟺ x ≥ −1/3; preizkus krajišč f(5) = 4 = 5 − 1, f(−1/3) = −4/3 = −1/3 − 1. -/
theorem naloga3_d_koraki :
    (∀ x : ℝ, 1 ≤ x → 2 * |x - 1| - 4 = 2 * (x - 1) - 4 ∧ 2 * (x - 1) - 4 = 2 * x - 6) ∧
    (∀ x : ℝ, 2 * x - 6 ≤ x - 1 ↔ x ≤ 5) ∧
    (∀ x : ℝ, x < 1 → 2 * |x - 1| - 4 = -2 * (x - 1) - 4 ∧ -2 * (x - 1) - 4 = -2 * x - 2) ∧
    (∀ x : ℝ, -2 * x - 2 ≤ x - 1 ↔ -3 * x ≤ 1) ∧ (∀ x : ℝ, -3 * x ≤ 1 ↔ -1 / 3 ≤ x) ∧
    2 * |(5:ℝ) - 1| - 4 = 4 ∧ (4:ℝ) = 5 - 1 ∧ 2 * |(-1 / 3 : ℝ) - 1| - 4 = -4 / 3 ∧ (-4 / 3 : ℝ) = -1 / 3 - 1 := by
  refine ⟨fun x hx => ⟨by rw [abs_of_nonneg (by linarith)], by ring⟩,
    fun x => ⟨fun h => by linarith, fun h => by linarith⟩,
    fun x hx => ⟨by rw [abs_of_neg (by linarith)]; ring, by ring⟩,
    fun x => ⟨fun h => by linarith, fun h => by linarith⟩, fun x => ⟨fun h => by linarith, fun h => by linarith⟩,
    by norm_num, by norm_num, ?_, by norm_num⟩
  rw [abs_of_neg (by norm_num)]; norm_num

/-- Naloga 3 d) (in blok RACUN): f(x) ≤ x − 1 ⟺ x ∈ [−1/3, 5]; enačba f(x) = x − 1 ima natanko rešitvi −1/3 in 5.
-/
theorem naloga3_d (x : ℝ) :
    (2 * |x - 1| - 4 ≤ x - 1 ↔ -1 / 3 ≤ x ∧ x ≤ 5) ∧ (2 * |x - 1| - 4 = x - 1 ↔ x = -1 / 3 ∨ x = 5) := by
  rcases le_or_gt 1 x with hx | hx
  · rw [abs_of_nonneg (by linarith)]
    refine ⟨⟨fun h => ⟨by linarith, by linarith⟩, fun h => by linarith⟩, ⟨fun h => Or.inr (by linarith), ?_⟩⟩
    rintro (h | h) <;> linarith
  · rw [abs_of_neg (by linarith)]
    refine ⟨⟨fun h => ⟨by linarith, by linarith⟩, fun h => by linarith⟩, ⟨fun h => Or.inl (by linarith), ?_⟩⟩
    rintro (h | h) <;> linarith

/-! ## Drugače -/

/-- Korak za korakom: g(x) = 3√(x + 1) − 2; (0, 0), (1, 1), (4, 2) → (−1, 0), (0, 1), (3, 2) → (−1, 0), (0, 3),
(3, 6) → (−1, −2), (0, 1), (3, 4); preizkus g(3) = 3√4 − 2 = 6 − 2 = 4 in g(−1) = −2, g(0) = 1. -/
theorem korak_za_korakom :
    ((0:ℝ) + -1 = -1 ∧ (1:ℝ) + -1 = 0 ∧ (4:ℝ) + -1 = 3) ∧ (3 * (0:ℝ) = 0 ∧ 3 * (1:ℝ) = 3 ∧ 3 * (2:ℝ) = 6) ∧
    ((0:ℝ) - 2 = -2 ∧ (3:ℝ) - 2 = 1 ∧ (6:ℝ) - 2 = 4) ∧
    3 * √((3:ℝ) + 1) - 2 = 3 * √4 - 2 ∧ 3 * √(4:ℝ) - 2 = 6 - 2 ∧ (6:ℝ) - 2 = 4 ∧
    3 * √((-1:ℝ) + 1) - 2 = -2 ∧ 3 * √((0:ℝ) + 1) - 2 = 1 := by
  have h4 : √(4:ℝ) = 2 := by rw [show (4:ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by rw [h4]; norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-- Korak za korakom (zrcaljenje): g(x) = √(−x) + 1; (0, 0), (1, 1), (4, 2) → (0, 0), (−1, 1), (−4, 2) →
(0, 1), (−1, 2), (−4, 3); g(−4) = √4 + 1 = 3; √(−x) je definiran za x ≤ 0. -/
theorem korak_zrcaljenje :
    √(-(0:ℝ)) + 1 = 1 ∧ √(-(-1:ℝ)) + 1 = 2 ∧ √(-(-4:ℝ)) + 1 = √4 + 1 ∧ √(4:ℝ) + 1 = 3 ∧
    ∀ x : ℝ, 0 ≤ -x ↔ x ≤ 0 := by
  have h4 : √(4:ℝ) = 2 := by rw [show (4:ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨by norm_num, by norm_num, by norm_num, by rw [h4]; norm_num, fun x => neg_nonneg⟩

/-! ## Preveri se -/

/-- Preveri se 1: (2x)² = 4x², x² + 5 = 1·x² + 5, faktorji 4 > 3 > 1 > ½ (od najožje do najširše). -/
theorem kviz1 :
    (∀ x : ℝ, (2 * x) ^ 2 = 4 * x ^ 2) ∧ (∀ x : ℝ, x ^ 2 + 5 = 1 * x ^ 2 + 5) ∧
    (3:ℝ) < 4 ∧ (1:ℝ) < 3 ∧ (1 / 2 : ℝ) < 1 := by
  refine ⟨fun x => by ring, fun x => by ring, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 2: (4, 2) preide pri g(x) = −2√(x − 1) + 3 v (4 + 1; −2·2 + 3) = (5, −1), in res g(5) = −1;
napačni odgovori: 2·2 + 3 = 7, −2·(2 + 3) = −10, g(4) = −2√3 + 3 ≈ −0,46. -/
theorem kviz2 :
    ((4:ℝ) + 1, -2 * (2:ℝ) + 3) = (5, -1) ∧ -2 * √((5:ℝ) - 1) + 3 = -1 ∧ 2 * (2:ℝ) + 3 = 7 ∧
    -2 * ((2:ℝ) + 3) = -10 ∧ |(-2 * √((4:ℝ) - 1) + 3) - (-0.46)| < 0.005 := by
  have h4 : √(4:ℝ) = 2 := by rw [show (4:ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have s1 : (1.7320 : ℝ) < √3 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have s2 : √3 < (1.7321 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, by norm_num [h4], by norm_num, by norm_num, ?_⟩
  norm_num
  rw [abs_lt]; constructor <;> linarith

/-- Preveri se 3 in 6: g(x) = f(x − 3) ima pri x vrednost f pri x − 3 (graf 3 v desno: (x, y) ↦ (x + 3, y));
jutrišnja temperatura je T(t − 5), graf 5 minut v desno. -/
theorem kviz3_6 (f : ℝ → ℝ) :
    graf (fun x => f (x - 3)) = (fun P : ℝ × ℝ => (P.1 + 3, P.2)) '' graf f ∧
    graf (fun t => f (t - 5)) = (fun P : ℝ × ℝ => (P.1 + 5, P.2)) '' graf f :=
  ⟨(premika f 3 0).2, (premika f 5 0).2⟩

/-- Preveri se 4: g(x) = −2|x − 1| + 3 ima vrh (1, 3) (največja vrednost 3 natanko pri x = 1), en korak desno od
vrha je za 2 niže (g(2) = 1), zato a = −2. -/
theorem kviz4 :
    (∀ x : ℝ, -2 * |x - 1| + 3 ≤ 3 ∧ (-2 * |x - 1| + 3 = 3 ↔ x = 1)) ∧ -2 * |(2:ℝ) - 1| + 3 = 1 ∧
    (-2 * |(2:ℝ) - 1| + 3) - (-2 * |(1:ℝ) - 1| + 3) = -2 := by
  refine ⟨fun x => ⟨by linarith [abs_nonneg (x - 1)], ⟨fun h => ?_, by rintro rfl; norm_num⟩⟩, by norm_num,
    by norm_num⟩
  have : |x - 1| = 0 := by linarith
  rw [abs_eq_zero] at this; linarith

/-- Preveri se 5: −|x − 2| + 3 je zrcaljenje grafa |x − 2| čez os x (minus zunaj), nato dvig za 3; vrh je (2, 3):
g(2) = −0 + 3 = 3. -/
theorem kviz5 :
    graf (fun x => -|x - 2|) = (fun P : ℝ × ℝ => (P.1, -P.2)) '' graf (fun x => |x - 2|) ∧
    -|(2:ℝ) - 2| + 3 = 3 ∧ ∀ x : ℝ, -|x - 2| + 3 ≤ 3 :=
  ⟨(zrcaljenji_razteg _ 1).1, by norm_num, fun x => by linarith [abs_nonneg (x - 2)]⟩

end Evklid.Lekcije.MAT_SS_2.TransformacijeGrafov
