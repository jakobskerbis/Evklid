/-
vir: content/lessons/MAT-SS-1/togi-premiki.md
sha256: 373f03671cee456b1665b5e06b91d7f2bb410db274559d04a9b3e796921960c6
Model: ravnina je ℂ, točka T(x, y) je x + yi (`⟨x, y⟩`), razdalja je evklidska (`dist`), koti so Mathlibov `∠`.
Vzporedni premik za (p, q) je z ↦ z + (p + qi); vrtež okoli S je z ↦ S + e(z − S) z ‖e‖ = 1 (e = cos φ + i sin φ,
pozitivna smer pri φ > 0; vrtež za 90° je e = i); zrcaljenje čez premico skozi točko a s smernim enotskim u je
z ↦ a + u²·conj(z − a) (os x: a = 0, u = 1; os y: u = i; y = x in y = −x: u² = ±i); zrcaljenje čez točko S je
z ↦ 2S − z. Orientacija trikotnika ABC je predznak `orient A B C = (B − A)ₓ(C − A)_y − (B − A)_y(C − A)ₓ`
(> 0: nasproti urinemu kazalcu). »≈ a« je |vrednost − a| < ½·10⁻ᵏ.
Ni v Leanu: zgodbe (papirnati trikotnik, igra, sestavljanka, biljard, zaklad, Tjašini odtisi), risbe in simulacija
(»Zrcaljenje čez premico in točko, orientacija«); definicije (preslikava, slika, usmerjena daljica, pozitivna smer)
kot opis; »skladna trikotnika z enako orientacijo preslikaš s premikom ali vrtežem, pri nasprotni potrebuješ
zrcaljenje« in »izreki SSS ... povedo, kdaj premik obstaja« (zahtevno, še ni dokazano; dokazano je, da togi premik
ohranja razdalje in kote, da premiki in vrteži ohranijo orientacijo, zato ABC iz Naloge 2 ne preide v A''B''C''); da
je »vsak togi premik zaporedje osnovnih« (zahtevno, še ni dokazano); kot TST' pri splošnem vrtežu (dokazan je kot 90°
za e = i in |ST'| = |ST| za vsak vrtež); skladnost trikotnikov 1–3 z ABC v kvizu 1 (opis risbe; orientacije in zrcaljenje čez os x so dokazani) in kviz 6 (razvrščanje korakov konstrukcije); Postopek, Pazi
na, točkovanje. Pri Primeru 3 je »vpadni kot je enak odbojnemu« dokazan za izračunano točko R(6,5; 0)
(∠ARO = ∠BRX, X = 10), da je R edina točka roba na premici AB', pa kot ↔.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.TogiPremiki

open Real EuclideanGeometry ComplexConjugate
open scoped Congruent

/-- Vzporedni premik za (p, q). -/
def premik (p q : ℝ) (z : ℂ) : ℂ := z + ⟨p, q⟩

/-- Vrtež okoli S z enotskim e (‖e‖ = 1). -/
def vrtez (S e z : ℂ) : ℂ := S + e * (z - S)

/-- Zrcaljenje čez premico skozi a s smernim enotskim vektorjem u: z ↦ a + u²·conj(z − a). -/
def zrcPremica (a u z : ℂ) : ℂ := a + u ^ 2 * conj (z - a)

/-- Zrcaljenje čez točko S: z ↦ 2S − z. -/
def zrcTocka (S z : ℂ) : ℂ := 2 * S - z

/-- Orientacija trikotnika ABC (dvojna predznačena ploščina). -/
def orient (A B C : ℂ) : ℝ := (B - A).re * (C - A).im - (B - A).im * (C - A).re

/-! ## 2. Togi premik ohranja razdalje in kote -/

/-- Razlaga 2, Ustno vprašanje 1, Povzetek: preslikava, ki ohranja razdalje, ohranja kote, in slika trikotnika je
z njim skladna. -/
theorem ohranja_kote (f : ℂ → ℂ) (hf : ∀ z w, dist (f z) (f w) = dist z w) (A B C : ℂ) :
    (![A, B, C] ≅ ![f A, f B, f C]) ∧ ∠ (f A) (f B) (f C) = ∠ A B C := by
  have h := side_side_side (hf A B).symm (hf B C).symm (hf C A).symm
  exact ⟨h, by simpa using (angle_eq_of_congruent h 0 1 2).symm⟩

/-- Predpostavka trditve `ohranja_kote` se da izpolniti (vzporedni premik za (6, −2) ohranja razdalje). -/
example : ∀ z w : ℂ, dist (premik 6 (-2) z) (premik 6 (-2) w) = dist z w := by
  intro z w; unfold premik; exact dist_add_right _ _ _

/-- Razlaga 3: vzporedni premik ohranja razdalje. -/
theorem premik_razdalje (z w : ℂ) (a b : ℝ) : dist (premik a b z) (premik a b w) = dist z w := by
  unfold premik; exact dist_add_right _ _ _

/-- Razlaga 6: vrtež (‖e‖ = 1) ohranja razdalje. -/
theorem vrtez_razdalje (S e : ℂ) (he : ‖e‖ = 1) (z w : ℂ) : dist (vrtez S e z) (vrtez S e w) = dist z w := by
  unfold vrtez
  rw [dist_eq_norm, dist_eq_norm, show S + e * (z - S) - (S + e * (w - S)) = e * (z - w) by ring, norm_mul, he,
    one_mul]

/-- Razlaga 4: zrcaljenje čez premico (‖u‖ = 1) ohranja razdalje. -/
theorem zrc_razdalje (a u : ℂ) (hu : ‖u‖ = 1) (z w : ℂ) :
    dist (zrcPremica a u z) (zrcPremica a u w) = dist z w := by
  unfold zrcPremica
  rw [dist_eq_norm, dist_eq_norm,
    show a + u ^ 2 * conj (z - a) - (a + u ^ 2 * conj (w - a)) = u ^ 2 * conj (z - w) by
      rw [map_sub, map_sub, map_sub]; ring,
    norm_mul, norm_pow, hu, one_pow, one_mul, Complex.norm_conj]

/-- Razlaga 5: zrcaljenje čez točko ohranja razdalje. -/
theorem zrcTocka_razdalje (S z w : ℂ) : dist (zrcTocka S z) (zrcTocka S w) = dist z w := by
  unfold zrcTocka
  rw [dist_eq_norm, dist_eq_norm, show 2 * S - z - (2 * S - w) = -(z - w) by ring, norm_neg]

/-- Predpostavke trditev z ‖e‖ = 1 ali ‖u‖ = 1 (`vrtez_razdalje`, `zrc_razdalje`, `os_simetrala`,
`vrtez_lastnosti`, `vrtez_orient`, `zrc_orient`) se dajo izpolniti: ‖i‖ = 1, ‖e^{iφ}‖ = 1. -/
example (φ : ℝ) : ‖Complex.I‖ = 1 ∧ ‖Complex.exp (φ * Complex.I)‖ = 1 :=
  ⟨Complex.norm_I, Complex.norm_exp_ofReal_mul_I φ⟩

/-! ## 3.–6. Koordinatna pravila in negibne točke -/

/-- Razlaga 3: v koordinatah T(x, y) ↦ T'(x + p, y + q). -/
theorem premik_koord (p q x y : ℝ) : premik p q ⟨x, y⟩ = ⟨x + p, y + q⟩ := by
  unfold premik; apply Complex.ext <;> simp

/-- Razlaga 3, premisli 1, Povzetek: vzporedni premik za (p, q) ≠ (0, 0) ne pusti nobene točke na mestu. -/
theorem premik_brez_negibnih (p q : ℝ) (h : (p, q) ≠ (0, 0)) (z : ℂ) : premik p q z ≠ z := by
  unfold premik
  intro hz
  apply h
  have : (⟨p, q⟩ : ℂ) = 0 := by
    have := congrArg (· - z) hz; simpa using this
  have h1 := congrArg Complex.re this
  have h2 := congrArg Complex.im this
  simp at h1 h2
  rw [h1, h2]

/-- Predpostavka trditve `premik_brez_negibnih` se da izpolniti ((6, −2), Primer 1). -/
example : ((6 : ℝ), (-2 : ℝ)) ≠ (0, 0) := by simp

/-- Razlaga 4 in Povzetek (tabela): os x: (x, y) ↦ (x, −y), os y: (−x, y), y = x: (y, x), y = −x: (−y, −x);
os x je u = 1, os y je u = i, y = x je u² = i, y = −x je u² = −i. -/
theorem zrcaljenja_koord (x y : ℝ) (u : ℂ) :
    zrcPremica 0 1 ⟨x, y⟩ = ⟨x, -y⟩ ∧ zrcPremica 0 Complex.I ⟨x, y⟩ = ⟨-x, y⟩ ∧
      (u ^ 2 = Complex.I → zrcPremica 0 u ⟨x, y⟩ = ⟨y, x⟩) ∧
      (u ^ 2 = -Complex.I → zrcPremica 0 u ⟨x, y⟩ = ⟨-y, -x⟩) := by
  unfold zrcPremica
  refine ⟨?_, ?_, fun h => ?_, fun h => ?_⟩
  · apply Complex.ext <;> simp
  · apply Complex.ext <;> simp
  · rw [h]; apply Complex.ext <;> simp
  · rw [h]; apply Complex.ext <;> simp

/-- Predpostavki trditev `zrcaljenja_koord` in `zgled_41` se dajo izpolniti: u = (1 + i)/√2 ima u² = i, u = (1 − i)/√2 ima
u² = −i, oba sta enotska. -/
example : ((1 + Complex.I) / (√2 : ℝ)) ^ 2 = Complex.I ∧ ((1 - Complex.I) / (√2 : ℝ)) ^ 2 = -Complex.I ∧
    ‖(1 + Complex.I) / (√2 : ℝ)‖ = 1 := by
  have h2 : ((√2 : ℝ) : ℂ) ^ 2 = 2 := by rw [← Complex.ofReal_pow, Real.sq_sqrt (by norm_num)]; norm_num
  have hne : ((√2 : ℝ) : ℂ) ≠ 0 := by
    rw [Complex.ofReal_ne_zero]; positivity
  refine ⟨?_, ?_, ?_⟩
  · rw [div_pow, h2]; field_simp; ring_nf; rw [Complex.I_sq]; ring
  · rw [div_pow, h2]; field_simp; ring_nf; rw [Complex.I_sq]; ring
  · rw [norm_div, Complex.norm_real, Real.norm_of_nonneg (Real.sqrt_nonneg _), Complex.norm_eq_sqrt_sq_add_sq]
    simp only [Complex.add_re, Complex.one_re, Complex.I_re, Complex.add_im, Complex.one_im, Complex.I_im]
    norm_num

/-- Razlaga 4: točke osi ostanejo na mestu (z = a + r·u, ‖u‖ = 1), in os je simetrala daljice TT': vsaka točka osi
je enako oddaljena od T in T'. -/
theorem os_simetrala (a u z : ℂ) (hu : ‖u‖ = 1) (r : ℝ) :
    zrcPremica a u (a + r * u) = a + r * u ∧ dist (a + r * u) z = dist (a + r * u) (zrcPremica a u z) := by
  have hfix : zrcPremica a u (a + r * u) = a + r * u := by
    unfold zrcPremica
    have hc : u * conj u = 1 := by
      rw [Complex.mul_conj, Complex.normSq_eq_norm_sq, hu]; norm_num
    rw [show a + r * u - a = r * u by ring, map_mul, Complex.conj_ofReal]
    rw [show u ^ 2 * (↑r * conj u) = r * u * (u * conj u) by ring, hc, mul_one]
  refine ⟨hfix, ?_⟩
  have := zrc_razdalje a u hu (a + r * u) z
  rw [hfix] at this
  exact this.symm

/-- Razlaga 4 (zakaj y = x): točka P(t, t) je enako oddaljena od T(x, y) in T'(y, x). -/
theorem simetrala_yx (t x y : ℝ) : dist (⟨t, t⟩ : ℂ) ⟨x, y⟩ = dist (⟨t, t⟩ : ℂ) ⟨y, x⟩ := by
  rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]; simp only; ring_nf

/-- Razlaga 4 (zgled): T(4, 1) ima čez y = x sliko (1, 4), čez y = −x pa (−1, −4). -/
theorem zgled_41 (u v : ℂ) (hu : u ^ 2 = Complex.I) (hv : v ^ 2 = -Complex.I) :
    zrcPremica 0 u ⟨4, 1⟩ = ⟨1, 4⟩ ∧ zrcPremica 0 v ⟨4, 1⟩ = ⟨-1, -4⟩ :=
  ⟨(zrcaljenja_koord 4 1 u).2.2.1 hu, (zrcaljenja_koord 4 1 v).2.2.2 hv⟩

/-- Razlaga 5, Ustno vprašanje 2: S je razpolovišče daljice TT' (T' = 2S − T), v koordinatah x' = 2x_S − x,
y' = 2y_S − y, čez O je slika (−x, −y). -/
theorem zrcTocka_lastnosti (S z : ℂ) (xS yS x y : ℝ) :
    midpoint ℝ z (zrcTocka S z) = S ∧ zrcTocka ⟨xS, yS⟩ ⟨x, y⟩ = ⟨2 * xS - x, 2 * yS - y⟩ ∧
      zrcTocka 0 ⟨x, y⟩ = ⟨-x, -y⟩ := by
  refine ⟨?_, ?_, ?_⟩
  · unfold zrcTocka; rw [midpoint_eq_smul_add]; simp only [invOf_eq_inv]
    rw [show z + (2 * S - z) = (2 : ℝ) • S by rw [two_smul]; ring, smul_smul]; norm_num
  · unfold zrcTocka; apply Complex.ext <;> simp
  · unfold zrcTocka; apply Complex.ext <;> simp

/-- Ustno vprašanje 2 (obratno): če je S razpolovišče TT', je T' = 2S − T (slika je določena enolično). -/
theorem zrcTocka_enolicno (S z z' : ℂ) (h : midpoint ℝ z z' = S) : z' = zrcTocka S z := by
  unfold zrcTocka
  rw [midpoint_eq_smul_add] at h
  simp only [invOf_eq_inv] at h
  rw [← h, Complex.real_smul]; push_cast; ring

/-- Predpostavka trditve `zrcTocka_enolicno` se da izpolniti (razpolovišče 1 in 3 v ℂ je 2). -/
example : midpoint ℝ (1 : ℂ) 3 = 2 := by
  rw [midpoint_eq_smul_add]; norm_num

/-- Razlaga 6: središče vrteža ostane na mestu, |ST'| = |ST|; vrtež za 90° okoli O je (x, y) ↦ (−y, x), kot TOT'
je pravi (⟪T, T'⟫ = 0) in v pozitivni smeri (orient(O, T, T') = x² + y² > 0 za T ≠ O); dvakrat zapored je (−x, −y). -/
theorem vrtez_lastnosti (S e z : ℂ) (he : ‖e‖ = 1) (x y : ℝ) :
    vrtez S e S = S ∧ dist S (vrtez S e z) = dist S z ∧ vrtez 0 Complex.I ⟨x, y⟩ = ⟨-y, x⟩ ∧
      inner ℝ (⟨x, y⟩ : ℂ) (vrtez 0 Complex.I ⟨x, y⟩) = 0 ∧
      orient 0 ⟨x, y⟩ (vrtez 0 Complex.I ⟨x, y⟩) = x ^ 2 + y ^ 2 ∧
      vrtez 0 Complex.I (vrtez 0 Complex.I ⟨x, y⟩) = ⟨-x, -y⟩ := by
  have hS : vrtez S e S = S := by unfold vrtez; ring
  refine ⟨hS, ?_, ?_, ?_, ?_, ?_⟩
  · have := vrtez_razdalje S e he S z; rwa [hS] at this
  · unfold vrtez; apply Complex.ext <;> simp
  · unfold vrtez; simp [Complex.inner]; ring
  · unfold vrtez orient; simp; ring
  · unfold vrtez; apply Complex.ext <;> simp

/-- Razlaga 6, Ustno vprašanje 3, Povzetek: zrcaljenje čez točko S je vrtež okoli S za 180° (e = −1 = cos π + i sin π). -/
theorem zrcTocka_je_vrtez (S z : ℂ) : zrcTocka S z = vrtez S (-1) z ∧ Complex.exp (π * Complex.I) = -1 := by
  refine ⟨by unfold zrcTocka vrtez; ring, Complex.exp_pi_mul_I⟩

/-- Razlaga 6 (preizkus) in Pogoste napake: T(3, 1) ↦ (−1, 3); (1, 0) ↦ (0, 1); pravilo (x, y) ↦ (y, −x) je vrtež
v negativni smeri (e = −i: orient < 0). -/
theorem vrtez_preizkus : vrtez 0 Complex.I ⟨3, 1⟩ = ⟨-1, 3⟩ ∧ vrtez 0 Complex.I ⟨1, 0⟩ = ⟨0, 1⟩ ∧
    vrtez 0 (-Complex.I) ⟨3, 1⟩ = ⟨1, -3⟩ ∧ orient 0 ⟨3, 1⟩ (vrtez 0 (-Complex.I) ⟨3, 1⟩) < 0 := by
  refine ⟨?_, ?_, ?_, ?_⟩
  · unfold vrtez; apply Complex.ext <;> simp
  · unfold vrtez; apply Complex.ext <;> simp
  · unfold vrtez; apply Complex.ext <;> simp
  · unfold vrtez orient; simp; norm_num

/-! ## 7. Orientacija -/

/-- Razlaga 7 in Povzetek: vzporedni premik ohrani orientacijo. -/
theorem premik_orient (p q : ℝ) (A B C : ℂ) :
    orient (premik p q A) (premik p q B) (premik p q C) = orient A B C := by
  unfold orient premik; simp

/-- Razlaga 7 in Povzetek: vrtež (‖e‖ = 1) ohrani orientacijo. -/
theorem vrtez_orient (S e : ℂ) (he : ‖e‖ = 1) (A B C : ℂ) :
    orient (vrtez S e A) (vrtez S e B) (vrtez S e C) = orient A B C := by
  have hn : e.re ^ 2 + e.im ^ 2 = 1 := by
    have := Complex.normSq_eq_norm_sq e
    rw [he, Complex.normSq_apply] at this; nlinarith [this]
  unfold orient vrtez
  simp only [add_sub_add_left_eq_sub, ← mul_sub, sub_sub_sub_cancel_right, Complex.mul_re, Complex.mul_im]
  linear_combination ((B - A).re * (C - A).im - (B - A).im * (C - A).re) * hn

/-- Razlaga 7 in Povzetek: zrcaljenje čez premico (‖u‖ = 1) obrne orientacijo. -/
theorem zrc_orient (a u : ℂ) (hu : ‖u‖ = 1) (A B C : ℂ) :
    orient (zrcPremica a u A) (zrcPremica a u B) (zrcPremica a u C) = -orient A B C := by
  have hn : (u ^ 2).re ^ 2 + (u ^ 2).im ^ 2 = 1 := by
    have := Complex.normSq_eq_norm_sq (u ^ 2)
    rw [norm_pow, hu, one_pow, Complex.normSq_apply] at this; nlinarith [this]
  unfold orient zrcPremica
  simp only [add_sub_add_left_eq_sub, ← mul_sub, ← map_sub, Complex.mul_re, Complex.mul_im, Complex.conj_re,
    Complex.conj_im, sub_sub_sub_cancel_right]
  linear_combination (-((B - A).re * (C - A).im - (B - A).im * (C - A).re)) * hn

/-- Razlaga 7, Pogoste napake, kviz 2: zrcaljenje čez točko orientacijo ohrani; dve zaporedni zrcaljenji čez
premici jo ohranita (vsako jo obrne enkrat). -/
theorem dve_zrcaljenji (S a u b v : ℂ) (hu : ‖u‖ = 1) (hv : ‖v‖ = 1) (A B C : ℂ) :
    orient (zrcTocka S A) (zrcTocka S B) (zrcTocka S C) = orient A B C ∧
      orient (zrcPremica b v (zrcPremica a u A)) (zrcPremica b v (zrcPremica a u B))
        (zrcPremica b v (zrcPremica a u C)) = orient A B C := by
  refine ⟨?_, ?_⟩
  · have := vrtez_orient S (-1) (by simp) A B C
    simp only [← (zrcTocka_je_vrtez S _).1] at this
    exact this
  · rw [zrc_orient b v hv, zrc_orient a u hu, neg_neg]

/-- Predpostavke trditve `dve_zrcaljenji` se dajo izpolniti (u = 1, v = i: os x, os y). -/
example : ‖(1 : ℂ)‖ = 1 ∧ ‖Complex.I‖ = 1 := by simp

/-- Premisli 2 in Pogoste napake: T(2, 1) čez O je (−2, −1), čez os x (2, −1); sliki sta različni, in zrcaljenje čez
os x orientacijo obrne, čez O pa ne. -/
theorem premisli2 : zrcTocka 0 ⟨2, 1⟩ = ⟨-2, -1⟩ ∧ zrcPremica 0 1 ⟨2, 1⟩ = ⟨2, -1⟩ ∧
    (⟨-2, -1⟩ : ℂ) ≠ ⟨2, -1⟩ := by
  refine ⟨(zrcTocka_lastnosti 0 0 0 0 2 1).2.2, (zrcaljenja_koord 2 1 0).1, ?_⟩
  intro h; have := congrArg Complex.re h; norm_num at this

/-! ## Rešeni primeri -/

/-- Primer 1 in `RACUN`: premik (6, −2): A(−4, 1) ↦ (2, −1), B(−1, 1) ↦ (5, −1), C(−3, 3) ↦ (3, 1);
|AB| = −1 − (−4) = 3 = |A'B'| = 5 − 2. -/
theorem primer1 : premik 6 (-2) ⟨-4, 1⟩ = ⟨2, -1⟩ ∧ premik 6 (-2) ⟨-1, 1⟩ = ⟨5, -1⟩ ∧
    premik 6 (-2) ⟨-3, 3⟩ = ⟨3, 1⟩ ∧ dist (⟨-4, 1⟩ : ℂ) ⟨-1, 1⟩ = 3 ∧ dist (⟨2, -1⟩ : ℂ) ⟨5, -1⟩ = 3 ∧
    (-1 : ℝ) - (-4) = 3 ∧ (5 : ℝ) - 2 = 3 := by
  refine ⟨?_, ?_, ?_, ?_, ?_, by norm_num, by norm_num⟩
  · unfold premik; apply Complex.ext <;> norm_num
  · unfold premik; apply Complex.ext <;> norm_num
  · unfold premik; apply Complex.ext <;> norm_num
  · rw [Complex.dist_eq_re_im]; norm_num
  · rw [Complex.dist_eq_re_im]; norm_num

/-- Primer 2: vrtež za 90° okoli O: A(1, 1) ↦ (−1, 1), B(4, 1) ↦ (−1, 4), C(4, 3) ↦ (−3, 4); kot pri B ostane pravi;
orientacija ABC in A'B'C' je pozitivna. -/
theorem primer2 : vrtez 0 Complex.I ⟨1, 1⟩ = ⟨-1, 1⟩ ∧ vrtez 0 Complex.I ⟨4, 1⟩ = ⟨-1, 4⟩ ∧
    vrtez 0 Complex.I ⟨4, 3⟩ = ⟨-3, 4⟩ ∧ ∠ (⟨-1, 1⟩ : ℂ) ⟨-1, 4⟩ ⟨-3, 4⟩ = π / 2 ∧
    0 < orient ⟨1, 1⟩ ⟨4, 1⟩ ⟨4, 3⟩ ∧ 0 < orient ⟨-1, 1⟩ ⟨-1, 4⟩ ⟨-3, 4⟩ := by
  refine ⟨(vrtez_lastnosti 0 1 0 (by simp) 1 1).2.2.1, (vrtez_lastnosti 0 1 0 (by simp) 4 1).2.2.1,
    (vrtez_lastnosti 0 1 0 (by simp) 4 3).2.2.1, ?_, ?_, ?_⟩
  · rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [Complex.inner]
  · unfold orient; norm_num
  · unfold orient; norm_num

/-- Primer 3 in `RACUN`: B(8, 1) ↦ B'(8, −1); R(x, 0) leži na premici AB' (A(2, 3)) natanko pri x = 2 + ¾·6 = 6,5;
|RB'| = |RB|, |AR| + |RB| = |AB'| = √(6² + 4²) = √52 ≈ 7,21 (≈ 7,2). -/
theorem primer3 (x : ℝ) : zrcPremica 0 1 ⟨8, 1⟩ = ⟨8, -1⟩ ∧
    (orient ⟨2, 3⟩ ⟨8, -1⟩ ⟨x, 0⟩ = 0 ↔ x = 2 + 3 / 4 * 6) ∧ (2 : ℝ) + 3 / 4 * 6 = 13 / 2 ∧
    dist (⟨13 / 2, 0⟩ : ℂ) ⟨8, -1⟩ = dist (⟨13 / 2, 0⟩ : ℂ) ⟨8, 1⟩ ∧
    dist (⟨2, 3⟩ : ℂ) ⟨13 / 2, 0⟩ + dist (⟨13 / 2, 0⟩ : ℂ) ⟨8, 1⟩ = dist (⟨2, 3⟩ : ℂ) ⟨8, -1⟩ ∧
    dist (⟨2, 3⟩ : ℂ) ⟨8, -1⟩ = √(6 ^ 2 + 4 ^ 2) ∧ √((6 : ℝ) ^ 2 + 4 ^ 2) = √52 ∧
    |√(52 : ℝ) - 721 / 100| < 5 / 1000 ∧ |√(52 : ℝ) - 72 / 10| < 5 / 100 := by
  have h13 : √(13 : ℝ) ^ 2 = 13 := Real.sq_sqrt (by norm_num)
  have hs52 : √(52 : ℝ) = 2 * √13 := by
    rw [show (52 : ℝ) = 2 ^ 2 * 13 by norm_num, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  have hAR : dist (⟨2, 3⟩ : ℂ) ⟨13 / 2, 0⟩ = 3 / 2 * √13 := by
    rw [Complex.dist_eq_re_im]; norm_num
    rw [show (117 : ℝ) = 3 ^ 2 * 13 by norm_num, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]; ring
  have hRB : dist (⟨13 / 2, 0⟩ : ℂ) ⟨8, 1⟩ = 1 / 2 * √13 := by
    rw [Complex.dist_eq_re_im]; norm_num
    ring
  have hAB : dist (⟨2, 3⟩ : ℂ) ⟨8, -1⟩ = √(6 ^ 2 + 4 ^ 2) := by
    rw [Complex.dist_eq_re_im]; norm_num
  have l : (721 / 100 : ℝ) < √52 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have u : √(52 : ℝ) < 7212 / 1000 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨(zrcaljenja_koord 8 1 0).1, ?_, by norm_num, ?_, ?_, hAB, by norm_num, ?_, ?_⟩
  · unfold orient; simp only [Complex.sub_re, Complex.sub_im]; constructor <;> intro h <;> linarith
  · rw [Complex.dist_eq_re_im, Complex.dist_eq_re_im]; norm_num
  · rw [hAR, hRB, hAB, show (6 : ℝ) ^ 2 + 4 ^ 2 = 52 by norm_num, hs52]; ring
  · rw [abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor <;> linarith

/-- Primer 3: vpadni kot je enak odbojnemu: ∠ARO = ∠BRX za R(6,5; 0), O(0, 0), X(10, 0) na robu. -/
theorem primer3_koti : ∠ (⟨2, 3⟩ : ℂ) ⟨13 / 2, 0⟩ 0 = ∠ (⟨8, 1⟩ : ℂ) ⟨13 / 2, 0⟩ 10 := by
  simp only [EuclideanGeometry.angle, vsub_eq_sub]
  unfold InnerProductGeometry.angle
  congr 1
  have h13 : (0 : ℝ) < √13 := by positivity
  have n1 : ‖(⟨2, 3⟩ : ℂ) - ⟨13 / 2, 0⟩‖ = 3 / 2 * √13 := by
    rw [← dist_eq_norm, Complex.dist_eq_re_im]; norm_num
    rw [show (117 : ℝ) = 3 ^ 2 * 13 by norm_num, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]; ring
  have n2 : ‖(0 : ℂ) - ⟨13 / 2, 0⟩‖ = 13 / 2 := by
    rw [← dist_eq_norm, Complex.dist_eq_re_im]; norm_num
  have n3 : ‖(⟨8, 1⟩ : ℂ) - ⟨13 / 2, 0⟩‖ = 1 / 2 * √13 := by
    rw [← dist_eq_norm, Complex.dist_eq_re_im]; norm_num
    ring
  have n4 : ‖(10 : ℂ) - ⟨13 / 2, 0⟩‖ = 7 / 2 := by
    rw [← dist_eq_norm, Complex.dist_eq_re_im]; norm_num
  rw [n1, n2, n3, n4]
  simp [Complex.inner]
  field_simp
  ring

/-- Primer 4 (premisli): Z(3, −5) čez os y je Z₁(−3, −5), nato čez os x Z₂(−3, 5) = zrcaljenje Z čez O; orientacija
je po dveh zrcaljenjih ohranjena (`dve_zrcaljenji`). -/
theorem primer4 : zrcPremica 0 Complex.I ⟨3, -5⟩ = ⟨-3, -5⟩ ∧ zrcPremica 0 1 ⟨-3, -5⟩ = ⟨-3, 5⟩ ∧
    zrcTocka 0 ⟨3, -5⟩ = ⟨-3, 5⟩ ∧
    ∀ x y : ℝ, zrcPremica 0 1 (zrcPremica 0 Complex.I ⟨x, y⟩) = zrcTocka 0 ⟨x, y⟩ := by
  refine ⟨(zrcaljenja_koord 3 (-5) 0).2.1, ?_, ?_, fun x y => ?_⟩
  · rw [(zrcaljenja_koord (-3) (-5) 0).1]; norm_num
  · rw [(zrcTocka_lastnosti 0 0 0 0 3 (-5)).2.2]; norm_num
  · rw [(zrcaljenja_koord x y 0).2.1, (zrcaljenja_koord (-x) y 0).1, (zrcTocka_lastnosti 0 0 0 0 x y).2.2]

/-! ## Za maturo -/

/-- Naloga 1 in `RACUN`: S je razpolovišče AA' za A(−3, 5), A'(7, −1): x_S = (−3 + 7)/2 = 2, y_S = (5 + (−1))/2 = 2
(edina možnost), slika B(2, 4) je (2·2 − 2, 2·2 − 4) = (2, 0). -/
theorem naloga1 (S : ℂ) : (zrcTocka S ⟨-3, 5⟩ = ⟨7, -1⟩ ↔ S = ⟨2, 2⟩) ∧ ((-3 : ℝ) + 7) / 2 = 2 ∧
    ((5 : ℝ) + (-1)) / 2 = 2 ∧ zrcTocka ⟨2, 2⟩ ⟨2, 4⟩ = ⟨2 * 2 - 2, 2 * 2 - 4⟩ ∧
    (⟨2 * 2 - 2, 2 * 2 - 4⟩ : ℂ) = ⟨2, 0⟩ := by
  refine ⟨?_, by norm_num, by norm_num, (zrcTocka_lastnosti 0 0 2 2 2 4).2.1, by norm_num⟩
  unfold zrcTocka
  constructor
  · intro h
    have h1 := congrArg Complex.re h; have h2 := congrArg Complex.im h
    simp at h1 h2
    apply Complex.ext <;> simp <;> linarith
  · rintro rfl; apply Complex.ext <;> simp <;> norm_num

/-- Naloga 2 a), b), c): vrtež 90°: A(2, 1) ↦ (−1, 2), B(5, 2) ↦ (−2, 5), C(3, 4) ↦ (−4, 3); čez os y: (1, 2),
(2, 5), (4, 3); skupni predpis (x, y) ↦ (y, x); ABC je pozitivno, A''B''C'' negativno orientiran. -/
theorem naloga2 (x y : ℝ) :
    vrtez 0 Complex.I ⟨2, 1⟩ = ⟨-1, 2⟩ ∧ vrtez 0 Complex.I ⟨5, 2⟩ = ⟨-2, 5⟩ ∧ vrtez 0 Complex.I ⟨3, 4⟩ = ⟨-4, 3⟩ ∧
    zrcPremica 0 Complex.I ⟨-1, 2⟩ = ⟨1, 2⟩ ∧ zrcPremica 0 Complex.I ⟨-2, 5⟩ = ⟨2, 5⟩ ∧
    zrcPremica 0 Complex.I ⟨-4, 3⟩ = ⟨4, 3⟩ ∧ zrcPremica 0 Complex.I (vrtez 0 Complex.I ⟨x, y⟩) = ⟨y, x⟩ ∧
    0 < orient ⟨2, 1⟩ ⟨5, 2⟩ ⟨3, 4⟩ ∧ orient ⟨1, 2⟩ ⟨2, 5⟩ ⟨4, 3⟩ < 0 := by
  refine ⟨(vrtez_lastnosti 0 1 0 (by simp) 2 1).2.2.1, (vrtez_lastnosti 0 1 0 (by simp) 5 2).2.2.1,
    (vrtez_lastnosti 0 1 0 (by simp) 3 4).2.2.1, ?_, ?_, ?_, ?_, ?_, ?_⟩
  · rw [(zrcaljenja_koord (-1) 2 0).2.1]; norm_num
  · rw [(zrcaljenja_koord (-2) 5 0).2.1]; norm_num
  · rw [(zrcaljenja_koord (-4) 3 0).2.1]; norm_num
  · rw [(vrtez_lastnosti 0 1 0 (by simp) x y).2.2.1, (zrcaljenja_koord (-y) x 0).2.1]; norm_num
  · unfold orient; norm_num
  · unfold orient; norm_num

/-- Naloga 2 c): nobeno zaporedje vzporednih premikov in vrtežev (preslikava f, ki ohranja orientacijo, kot jo
`premik_orient`, `vrtez_orient`) ne preslika ABC v A''B''C''. -/
theorem naloga2c (f : ℂ → ℂ) (hf : ∀ A B C, orient (f A) (f B) (f C) = orient A B C) :
    ¬ (f ⟨2, 1⟩ = ⟨1, 2⟩ ∧ f ⟨5, 2⟩ = ⟨2, 5⟩ ∧ f ⟨3, 4⟩ = ⟨4, 3⟩) := by
  rintro ⟨h1, h2, h3⟩
  have := hf ⟨2, 1⟩ ⟨5, 2⟩ ⟨3, 4⟩
  rw [h1, h2, h3] at this
  have a := (naloga2 0 0).2.2.2.2.2.2.2.1
  have b := (naloga2 0 0).2.2.2.2.2.2.2.2
  linarith

/-- Predpostavka trditve `naloga2c` se da izpolniti: zaporedje premika in vrteža ohranja orientacijo. -/
example (p q : ℝ) (S e : ℂ) (he : ‖e‖ = 1) :
    ∀ A B C, orient (vrtez S e (premik p q A)) (vrtez S e (premik p q B)) (vrtez S e (premik p q C)) =
      orient A B C := by
  intro A B C; rw [vrtez_orient S e he, premik_orient]

/-! ## Korak za korakom in Preveri se -/

/-- Razlaga 7 (risba): ABC z A(2, 1), B(5, 1), C(2, 3) ima pozitivno orientacijo, A'B'C' (čez os y) negativno,
A''B''C'' (čez O) spet pozitivno. -/
theorem razlaga7_orient : 0 < orient ⟨2, 1⟩ ⟨5, 1⟩ ⟨2, 3⟩ ∧ orient ⟨-2, 1⟩ ⟨-5, 1⟩ ⟨-2, 3⟩ < 0 ∧
    0 < orient ⟨-2, -1⟩ ⟨-5, -1⟩ ⟨-2, -3⟩ := by
  unfold orient; norm_num

/-- Preveri se 1: ABC (A(1, 2), B(4, 2), C(1, 4)), trikotnik 1 in trikotnik 3 imajo pozitivno orientacijo,
trikotnik 2 negativno (zato ga s premikom in vrtežem ne dobiš, `naloga2c`); trikotnik 2 je slika ABC čez os x.
Skladnost vseh treh z ABC je opis risbe. -/
theorem kviz1 : 0 < orient ⟨1, 2⟩ ⟨4, 2⟩ ⟨1, 4⟩ ∧ 0 < orient ⟨-2, 1⟩ ⟨-2, 4⟩ ⟨-4, 1⟩ ∧
    orient ⟨1, -2⟩ ⟨4, -2⟩ ⟨1, -4⟩ < 0 ∧ 0 < orient ⟨-1, -2⟩ ⟨-4, -2⟩ ⟨-1, -4⟩ ∧
    zrcPremica 0 1 ⟨1, 2⟩ = ⟨1, -2⟩ ∧ zrcPremica 0 1 ⟨4, 2⟩ = ⟨4, -2⟩ ∧ zrcPremica 0 1 ⟨1, 4⟩ = ⟨1, -4⟩ := by
  refine ⟨?_, ?_, ?_, ?_, (zrcaljenja_koord 1 2 0).1, (zrcaljenja_koord 4 2 0).1, (zrcaljenja_koord 1 4 0).1⟩ <;>
    (unfold orient; norm_num)

/-- Korak za korakom: T(3, 1) ↦ premik (−4, 2): (−1, 3); os x: (3, −1); os y: (−3, 1); O: (−3, −1); vrtež 90°:
(−1, 3); čez S(1, 2): (2 − 3, 4 − 1) = (−1, 3); U(5, 1) ↦ (1, 3), (−1, 5), (−3, 3); |TU| = 2 se ohrani. -/
theorem korak_za_korakom :
    premik (-4) 2 ⟨3, 1⟩ = ⟨-1, 3⟩ ∧ zrcPremica 0 1 ⟨3, 1⟩ = ⟨3, -1⟩ ∧ zrcPremica 0 Complex.I ⟨3, 1⟩ = ⟨-3, 1⟩ ∧
    zrcTocka 0 ⟨3, 1⟩ = ⟨-3, -1⟩ ∧ vrtez 0 Complex.I ⟨3, 1⟩ = ⟨-1, 3⟩ ∧ zrcTocka ⟨1, 2⟩ ⟨3, 1⟩ = ⟨-1, 3⟩ ∧
    premik (-4) 2 ⟨5, 1⟩ = ⟨1, 3⟩ ∧ vrtez 0 Complex.I ⟨5, 1⟩ = ⟨-1, 5⟩ ∧ zrcTocka ⟨1, 2⟩ ⟨5, 1⟩ = ⟨-3, 3⟩ ∧
    dist (⟨3, 1⟩ : ℂ) ⟨5, 1⟩ = 2 ∧ dist (⟨-1, 3⟩ : ℂ) ⟨-1, 5⟩ = 2 ∧ dist (⟨-1, 3⟩ : ℂ) ⟨1, 3⟩ = 2 ∧
    dist (⟨-1, 3⟩ : ℂ) ⟨-3, 3⟩ = 2 := by
  refine ⟨?_, (zrcaljenja_koord 3 1 0).1, (zrcaljenja_koord 3 1 0).2.1, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_⟩
  · unfold premik; apply Complex.ext <;> norm_num
  · rw [(zrcTocka_lastnosti 0 0 0 0 3 1).2.2]
  · exact (vrtez_lastnosti 0 1 0 (by simp) 3 1).2.2.1
  · rw [(zrcTocka_lastnosti 0 0 1 2 3 1).2.1]; norm_num
  · unfold premik; apply Complex.ext <;> norm_num
  · exact (vrtez_lastnosti 0 1 0 (by simp) 5 1).2.2.1
  · rw [(zrcTocka_lastnosti 0 0 1 2 5 1).2.1]; norm_num
  all_goals rw [Complex.dist_eq_re_im]; norm_num

/-- Preveri se 3: T(−3, 4) ↦ (−4, −3) (abscisa −4); v negativni smeri (4, 3), čez O (3, −4). -/
theorem kviz3 : vrtez 0 Complex.I ⟨-3, 4⟩ = ⟨-4, -3⟩ ∧ vrtez 0 (-Complex.I) ⟨-3, 4⟩ = ⟨4, 3⟩ ∧
    zrcTocka 0 ⟨-3, 4⟩ = ⟨3, -4⟩ := by
  refine ⟨?_, ?_, ?_⟩
  · rw [(vrtez_lastnosti 0 1 0 (by simp) (-3) 4).2.2.1]
  · unfold vrtez; apply Complex.ext <;> simp
  · rw [(zrcTocka_lastnosti 0 0 0 0 (-3) 4).2.2]; norm_num

/-- Preveri se 4 in `RACUN`: T(2, −5) čez y = −x je (5, −2) (ordinata −2); razpolovišče (3,5; −3,5) leži na y = −x. -/
theorem kviz4 (v : ℂ) (hv : v ^ 2 = -Complex.I) :
    zrcPremica 0 v ⟨2, -5⟩ = ⟨5, -2⟩ ∧ midpoint ℝ (⟨2, -5⟩ : ℂ) ⟨5, -2⟩ = ⟨7 / 2, -7 / 2⟩ ∧
    ((2 : ℝ) + 5) / 2 = 7 / 2 ∧ ((-5 : ℝ) - 2) / 2 = -7 / 2 ∧ (-7 / 2 : ℝ) = -(7 / 2) := by
  refine ⟨?_, ?_, by norm_num, by norm_num, by norm_num⟩
  · rw [(zrcaljenja_koord 2 (-5) v).2.2.2 hv]; norm_num
  · rw [midpoint_eq_smul_add]; apply Complex.ext <;> simp <;> norm_num

/-- Predpostavka trditve `kviz4` se da izpolniti: v = (1 − i)/√2 ima v² = −i. -/
example : ((1 - Complex.I) / (√2 : ℝ)) ^ 2 = -Complex.I := by
  have h2 : ((√2 : ℝ) : ℂ) ^ 2 = 2 := by rw [← Complex.ofReal_pow, Real.sq_sqrt (by norm_num)]; norm_num
  have hne : ((√2 : ℝ) : ℂ) ≠ 0 := by rw [Complex.ofReal_ne_zero]; positivity
  rw [div_pow, h2]; field_simp; ring_nf; rw [Complex.I_sq]; ring

/-- Preveri se 5 in `RACUN`: A(3, −2) čez S(1, 1): x' = 2·1 − 3 = −1, y' = 2·1 − (−2) = 4, A' = (−1, 4)
(Ninin y' = 0 je napačen). -/
theorem kviz5 : zrcTocka ⟨1, 1⟩ ⟨3, -2⟩ = ⟨-1, 4⟩ ∧ (2 : ℝ) * 1 - 3 = -1 ∧ (2 : ℝ) * 1 - (-2) = 4 ∧
    (2 : ℝ) * 1 - (-2) ≠ 0 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  rw [(zrcTocka_lastnosti 0 0 1 1 3 (-2)).2.1]; norm_num

end Evklid.Lekcije.MAT_SS_1.TogiPremiki
