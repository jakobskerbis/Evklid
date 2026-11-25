/-
vir: content/lessons/MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij.md
sha256: a5b24a7401d1c4d8f1ac15a0a86d7d842497b40ecdd41aab3b41250da6c20d72
Ni v Leanu: zgodovina v uvodu (Mercator, Wright, Barrow) in »Drugače: Kot zgodba« (menjalnica);
simulacija »Družina primitivnih funkcij«; nasveti, kako izbrati u (»novi integral je lažji/težji«
ni matematična trditev; dokazana je le enakost pri obeh izbirah); Primer 3, koraki 5–6 in vrstica
`vrednost: 10*(1/2)*ln(...)` (sin 46° ≈ 0,7193, ulomek ≈ 6,126, y ≈ 9,06 cm): Mathlib nima dovolj
natančnih mej za sin 46° in ln 6,126 (preverjeno le numerično zunaj Leana: 0,71934; 6,12605; 9,0628);
zemljevid in »Grenlandija je videti večja«; Preveri se, vprašanje 1 (vrstni red korakov) in vprašanje 4
(katera izbira u je smiselna) ter pri vprašanju 2 trditev, da se ostali trije rešijo s per partes
(ni računska trditev; dokazani so vsi štirje rezultati razen ∫ x² cos x, ki ga lekcija ne izračuna);
točkovanje maturitetnih nalog.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.IntegracijaPerPartesInRacionalnihFunkcij

open Real intervalIntegral

/-- Pomožna taktika za izenačenje odvodov v verigah `HasDerivAt`. -/
local macro "odv" : tactic =>
  `(tactic| first
    | (ring; done) | (norm_num; done) | (norm_num; ring; done) | (simp; ring; done)
    | (field_simp; ring; done) | (field_simp; done)
    | (simp only [Pi.add_apply, Pi.sub_apply, Pi.mul_apply, Pi.neg_apply]; done)
    | (simp only [Pi.add_apply, Pi.sub_apply, Pi.mul_apply, Pi.neg_apply]; ring; done)
    | (simp only [Pi.add_apply, Pi.sub_apply, Pi.mul_apply, Pi.neg_apply]; norm_num; ring; done)
    | (simp only [Pi.add_apply, Pi.sub_apply, Pi.mul_apply, Pi.neg_apply]; field_simp; done)
    | (simp only [Pi.add_apply, Pi.sub_apply, Pi.mul_apply, Pi.neg_apply]; field_simp; ring; done))

/-- Tabela v razlagi, točka 7: (ln|x − a|)' = 1/(x − a) za x ≠ a. -/
theorem d_log_sub (a x : ℝ) (h : x - a ≠ 0) : HasDerivAt (fun x => log |x - a|) (1 / (x - a)) x := by
  have := ((hasDerivAt_id' x).sub_const a).log h
  simp only [log_abs]; exact this

/-- Predpostavka trditve `d_log_sub` se da izpolniti (a = 1, x = 2). -/
example : (2 : ℝ) - 1 ≠ 0 := by norm_num

/-- Pomožna: (ln|x + b|)' = 1/(x + b) za x ≠ −b. -/
theorem d_log_add (b x : ℝ) (h : x + b ≠ 0) : HasDerivAt (fun x => log |x + b|) (1 / (x + b)) x := by
  have := ((hasDerivAt_id' x).add_const b).log h
  simp only [log_abs]; exact this

/-- Predpostavka trditve `d_log_add` se da izpolniti (b = 1, x = 0). -/
example : (0 : ℝ) + 1 ≠ 0 := by norm_num

/-- Pomožna: (ln|a − x|)' = −1/(a − x) za x ≠ a. -/
theorem d_log_rsub (a x : ℝ) (h : a - x ≠ 0) : HasDerivAt (fun x => log |a - x|) (-1 / (a - x)) x := by
  have := ((hasDerivAt_const x a).sub (hasDerivAt_id' x)).log h
  simp only [log_abs]; exact this.congr_deriv (by odv)

/-- Predpostavka trditve `d_log_rsub` se da izpolniti (a = 1, x = 0). -/
example : (1 : ℝ) - 0 ≠ 0 := by norm_num

/-- Pomožna: (ln|a + x|)' = 1/(a + x) za x ≠ −a. -/
theorem d_log_radd (a x : ℝ) (h : a + x ≠ 0) : HasDerivAt (fun x => log |a + x|) (1 / (a + x)) x := by
  have := ((hasDerivAt_const x a).add (hasDerivAt_id' x)).log h
  simp only [log_abs]; exact this.congr_deriv (by odv)

/-- Predpostavka trditve `d_log_radd` se da izpolniti (a = 1, x = 0). -/
example : (1 : ℝ) + 0 ≠ 0 := by norm_num

/-- Razlaga, točka 1 (in vrstica `odvod: x^2/2*exp(x)`): (x²/2 · eˣ)' = x eˣ + x²/2 · eˣ. -/
theorem bliznjica_odvod (x : ℝ) :
    HasDerivAt (fun x => x ^ 2 / 2 * exp x) (x * exp x + x ^ 2 / 2 * exp x) x :=
  (((hasDerivAt_pow 2 x).div_const 2).mul (hasDerivAt_exp x)).congr_deriv (by odv)

/-- Razlaga, točka 1, in »Pogoste napake«: x²/2 · eˣ ni primitivna funkcija za x eˣ
(pri x = 1 je odvod e + e/2, ne e). -/
theorem bliznjica_napacna : ¬ HasDerivAt (fun x => x ^ 2 / 2 * exp x) (1 * exp 1) 1 := by
  intro h
  have := h.unique (bliznjica_odvod 1)
  have he := exp_pos 1
  norm_num at this

/-- Razlaga, točka 2: pravilo za odvod produkta (uv)' = u'v + uv'. -/
theorem produkt (u v : ℝ → ℝ) (u' v' x : ℝ) (hu : HasDerivAt u u' x) (hv : HasDerivAt v v' x) :
    HasDerivAt (fun x => u x * v x) (u' * v x + u x * v') x := hu.mul hv

/-- Predpostavke trditve `produkt` se dajo izpolniti (u = id, v = exp). -/
example : HasDerivAt (fun x : ℝ => x) 1 0 ∧ HasDerivAt exp (exp 0) 0 := ⟨hasDerivAt_id' 0, hasDerivAt_exp 0⟩

/-- Razlaga, točka 2, in ustno vprašanje 1 (nedoločena oblika per partes): če je G primitivna
funkcija za u'v, je uv − G primitivna funkcija za uv', tj. ∫ u v' dx = u v − ∫ u' v dx. -/
theorem per_partes (u v u' v' G : ℝ → ℝ) (x : ℝ) (hu : HasDerivAt u (u' x) x)
    (hv : HasDerivAt v (v' x) x) (hG : HasDerivAt G (u' x * v x) x) :
    HasDerivAt (fun x => u x * v x - G x) (u x * v' x) x :=
  ((hu.mul hv).sub hG).congr_deriv (by odv)

/-- Predpostavke trditve `per_partes` se dajo izpolniti (u = x, v = eˣ, G = eˣ). -/
example : HasDerivAt (fun x : ℝ => x) ((fun _ => (1:ℝ)) 0) 0 ∧ HasDerivAt exp (exp 0) 0 ∧
    HasDerivAt exp ((fun _ => (1:ℝ)) 0 * exp 0) 0 :=
  ⟨hasDerivAt_id' 0, hasDerivAt_exp 0, by simpa using hasDerivAt_exp 0⟩

/-- Razlaga, točka 2 (določena oblika per partes): za zvezno odvedljivi u, v na [a, b] je
∫ₐᵇ u v' dx = u(b)v(b) − u(a)v(a) − ∫ₐᵇ u' v dx. -/
theorem per_partes_dolocen (u v u' v' : ℝ → ℝ) (a b : ℝ) (hu : ∀ x, HasDerivAt u (u' x) x)
    (hv : ∀ x, HasDerivAt v (v' x) x) (hu' : Continuous u') (hv' : Continuous v') :
    ∫ x in a..b, u x * v' x = u b * v b - u a * v a - ∫ x in a..b, u' x * v x :=
  integral_mul_deriv_eq_deriv_mul (fun x _ => hu x) (fun x _ => hv x) (hu'.intervalIntegrable a b)
    (hv'.intervalIntegrable a b)

/-- Predpostavke trditve `per_partes_dolocen` se dajo izpolniti (u = x, v = eˣ). -/
example : (∀ x : ℝ, HasDerivAt (fun x : ℝ => x) ((fun _ => (1:ℝ)) x) x) ∧
    (∀ x : ℝ, HasDerivAt exp (exp x) x) ∧ Continuous (fun _ : ℝ => (1:ℝ)) ∧ Continuous exp :=
  ⟨fun x => hasDerivAt_id' x, hasDerivAt_exp, continuous_const, continuous_exp⟩

/-- Razlaga, točka 3 (in vrstici `integral`/`odvod` za x eˣ, povzetek): ∫ x eˣ dx = x eˣ − eˣ + C
= (x − 1)eˣ + C; preizkus (x eˣ − eˣ)' = eˣ + x eˣ − eˣ = x eˣ. -/
theorem integral_x_exp (C x : ℝ) :
    HasDerivAt (fun x => x * exp x - exp x + C) (x * exp x) x ∧ x * exp x - exp x = (x - 1) * exp x := by
  refine ⟨?_, by ring⟩
  have := (((hasDerivAt_id' x).mul (hasDerivAt_exp x)).sub (hasDerivAt_exp x)).add_const C
  exact this.congr_deriv (by odv)

/-- Razlaga, točka 4, »Premisli« (obratna izbira u = eˣ, v' = x): če je G primitivna funkcija za
x²/2 · eˣ, je x²/2 · eˣ − G primitivna funkcija za x eˣ (enakost je pravilna, novi integral pa težji). -/
theorem obratna_izbira (G : ℝ → ℝ) (x : ℝ) (hG : HasDerivAt G (x ^ 2 / 2 * exp x) x) :
    HasDerivAt (fun x => x ^ 2 / 2 * exp x - G x) (x * exp x) x :=
  (((hasDerivAt_pow 2 x).div_const 2 |>.mul (hasDerivAt_exp x)).sub hG).congr_deriv (by odv)

/-- Predpostavka trditve `obratna_izbira` se da izpolniti (G = (x² − 2x + 2)eˣ/2). -/
example (x : ℝ) : HasDerivAt (fun x => (x ^ 2 - 2 * x + 2) * exp x / 2) (x ^ 2 / 2 * exp x) x :=
  ((((hasDerivAt_pow 2 x).sub ((hasDerivAt_id' x).const_mul (2:ℝ))).add_const 2).mul
    (hasDerivAt_exp x) |>.div_const 2).congr_deriv (by odv)

/-- Razlaga, točka 5, in ustno vprašanje 3 (in vrstici za ln x): za x > 0 je
∫ ln x dx = x ln x − ∫ x · (1/x) dx = x ln x − x + C. -/
theorem integral_ln (C x : ℝ) (hx : 0 < x) :
    HasDerivAt (fun x => x * log x - x + C) (log x) x ∧ x * (1 / x) = 1 := by
  have hx0 : x ≠ 0 := hx.ne'
  refine ⟨?_, by field_simp⟩
  have := ((((hasDerivAt_id' x).mul (hasDerivAt_log hx.ne'))).sub (hasDerivAt_id' x)).add_const C
  exact this.congr_deriv (by field_simp; ring)

/-- Predpostavka trditve `integral_ln` se da izpolniti (x = 1). -/
example : (0 : ℝ) < 1 := one_pos

/-- Razlaga, točka 7 (in vrstica `odvod: ln(x^2-1)`): za x² ≠ 1 je (ln|x² − 1|)' = 2x/(x² − 1). -/
theorem d_ln_x2_1 (x : ℝ) (hx : x ^ 2 - 1 ≠ 0) :
    HasDerivAt (fun x => log |x ^ 2 - 1|) (2 * x / (x ^ 2 - 1)) x := by
  have := ((hasDerivAt_pow 2 x).sub_const 1).log hx
  simp only [log_abs]; exact this.congr_deriv (by odv)

/-- Predpostavka trditve `d_ln_x2_1` se da izpolniti (x = 2). -/
example : (2 : ℝ) ^ 2 - 1 ≠ 0 := by norm_num

/-- Razlaga, točka 7, in »Pogoste napake«: ln|x² − 1| ni primitivna funkcija za 1/(x² − 1)
(pri x = 2 je odvod 4/3, ne 1/3). -/
theorem ln_imenovalca_napacno : ¬ HasDerivAt (fun x => log |x ^ 2 - 1|) (1 / ((2:ℝ) ^ 2 - 1)) 2 := by
  intro h
  have := h.unique (d_ln_x2_1 2 (by norm_num))
  norm_num at this

/-- Razlaga, točka 7: 1 = A(x + 1) + B(x − 1) za vsak x natanko pri A = 1/2, B = −1/2. -/
theorem razcep_x2_1_AB (A B : ℝ) : (∀ x : ℝ, 1 = A * (x + 1) + B * (x - 1)) ↔ A = 1 / 2 ∧ B = -1 / 2 := by
  constructor
  · intro h
    have h1 := h 1
    have h2 := h (-1)
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩ x; ring

/-- Razlaga, točka 7 (in vrstica `enako: 1/(x^2-1)`): 1/(x² − 1) = (1/2)/(x − 1) − (1/2)/(x + 1)
za x ≠ ±1. -/
theorem razcep_x2_1 (x : ℝ) (h1 : x - 1 ≠ 0) (h2 : x + 1 ≠ 0) :
    1 / (x ^ 2 - 1) = 1 / 2 / (x - 1) - 1 / 2 / (x + 1) := by
  have h : x ^ 2 - 1 ≠ 0 := by
    rw [show x ^ 2 - 1 = (x - 1) * (x + 1) by ring]; exact mul_ne_zero h1 h2
  field_simp; ring

/-- Predpostavke trditve `razcep_x2_1` se dajo izpolniti (x = 2). -/
example : (2 : ℝ) - 1 ≠ 0 ∧ (2 : ℝ) + 1 ≠ 0 := by norm_num

/-- Razlaga, točka 7 (in vrstica `odvod`): ∫ dx/(x² − 1) = ½ ln|x − 1| − ½ ln|x + 1| + C (x ≠ ±1). -/
theorem integral_x2_1 (C x : ℝ) (h1 : x - 1 ≠ 0) (h2 : x + 1 ≠ 0) :
    HasDerivAt (fun x => 1 / 2 * log |x - 1| - 1 / 2 * log |x + 1| + C) (1 / (x ^ 2 - 1)) x := by
  rw [razcep_x2_1 x h1 h2]
  exact ((((d_log_sub 1 x h1).const_mul (1 / 2 : ℝ)).sub ((d_log_add 1 x h2).const_mul (1 / 2 : ℝ))).add_const
    C).congr_deriv (by odv)

/-- Predpostavke trditve `integral_x2_1` se dajo izpolniti (x = 2). -/
example : (2 : ℝ) - 1 ≠ 0 ∧ (2 : ℝ) + 1 ≠ 0 := by norm_num

/-- Razlaga, točka 7, tabela: (k ln|x − a|)' = k/(x − a) in (−ln|a − x|)' = 1/(a − x) za x ≠ a. -/
theorem tabela_ulomkov (k a x : ℝ) (h : x - a ≠ 0) :
    HasDerivAt (fun x => k * log |x - a|) (k / (x - a)) x ∧
      HasDerivAt (fun x => -log |a - x|) (1 / (a - x)) x := by
  have h' : a - x ≠ 0 := fun e => h (by linarith)
  exact ⟨((d_log_sub a x h).const_mul k).congr_deriv (by odv),
    (d_log_rsub a x h').neg.congr_deriv (by odv)⟩

/-- Predpostavka trditve `tabela_ulomkov` se da izpolniti (a = 1, x = 2). -/
example : (2 : ℝ) - 1 ≠ 0 := by norm_num

/-- Razlaga, točka 8, »Premisli«: nobena izbira A, B ne da A/(x − 1) + B/(x + 1) = (x² + 1)/(x² − 1)
za vse x ≠ ±1. -/
theorem nastavek_brez_deljenja : ¬ ∃ A B : ℝ, ∀ x : ℝ, x - 1 ≠ 0 → x + 1 ≠ 0 →
    A / (x - 1) + B / (x + 1) = (x ^ 2 + 1) / (x ^ 2 - 1) := by
  rintro ⟨A, B, h⟩
  have e0 := h 0 (by norm_num) (by norm_num)
  have e2 := h 2 (by norm_num) (by norm_num)
  have e3 := h 3 (by norm_num) (by norm_num)
  norm_num at e0 e2 e3
  linarith

/-- Razlaga, točka 8 (in vrstici `enako`): (x² + 1)/(x² − 1) = 1 + 2/(x² − 1) = 1 + 1/(x − 1) − 1/(x + 1)
za x ≠ ±1. -/
theorem deljenje (x : ℝ) (h1 : x - 1 ≠ 0) (h2 : x + 1 ≠ 0) :
    (x ^ 2 + 1) / (x ^ 2 - 1) = 1 + 2 / (x ^ 2 - 1) ∧ 2 / (x ^ 2 - 1) = 1 / (x - 1) - 1 / (x + 1) := by
  have h : x ^ 2 - 1 ≠ 0 := by
    rw [show x ^ 2 - 1 = (x - 1) * (x + 1) by ring]; exact mul_ne_zero h1 h2
  constructor <;> field_simp <;> ring

/-- Predpostavke trditve `deljenje` se dajo izpolniti (x = 2). -/
example : (2 : ℝ) - 1 ≠ 0 ∧ (2 : ℝ) + 1 ≠ 0 := by norm_num

/-- Razlaga, točka 8 (in vrstica `odvod: x+ln(x-1)-ln(x+1)`):
∫ (x² + 1)/(x² − 1) dx = x + ln|x − 1| − ln|x + 1| + C za x ≠ ±1. -/
theorem integral_deljenje (C x : ℝ) (h1 : x - 1 ≠ 0) (h2 : x + 1 ≠ 0) :
    HasDerivAt (fun x => x + log |x - 1| - log |x + 1| + C) ((x ^ 2 + 1) / (x ^ 2 - 1)) x := by
  obtain ⟨e1, e2⟩ := deljenje x h1 h2
  rw [e1, e2]
  exact ((((hasDerivAt_id' x).add (d_log_sub 1 x h1)).sub (d_log_add 1 x h2)).add_const C).congr_deriv
    (by odv)

/-- Predpostavke trditve `integral_deljenje` se dajo izpolniti (x = 2). -/
example : (2 : ℝ) - 1 ≠ 0 ∧ (2 : ℝ) + 1 ≠ 0 := by norm_num

/-- Primer 1 (in vrstici za x sin x): u = x, v = −cos x; ∫ x sin x dx = −x cos x + ∫ cos x dx =
−x cos x + sin x + C; preizkus (−x cos x + sin x)' = −cos x + x sin x + cos x = x sin x. -/
theorem primer1 (C x : ℝ) :
    HasDerivAt (fun x => -x * cos x + sin x + C) (-cos x + x * sin x + cos x) x ∧
      -cos x + x * sin x + cos x = x * sin x := by
  refine ⟨?_, by ring⟩
  exact ((((hasDerivAt_id' x).neg.mul (hasDerivAt_cos x)).add (hasDerivAt_sin x)).add_const C).congr_deriv
    (by odv)

/-- Primer 1, korak 2: (−cos x)' = sin x. -/
theorem primer1_v (x : ℝ) : HasDerivAt (fun x => -cos x) (sin x) x := by
  exact (hasDerivAt_cos x).neg.congr_deriv (by simp)

/-- Primer 2, korak 2: x² + x − 2 = (x − 1)(x + 2); preizkus 1 + 1 − 2 = 0 in 4 − 2 − 2 = 0. -/
theorem primer2_razcep (x : ℝ) : x ^ 2 + x - 2 = (x - 1) * (x + 2) ∧ (1:ℝ) + 1 - 2 = 0 ∧
    (4:ℝ) - 2 - 2 = 0 := ⟨by ring, by norm_num, by norm_num⟩

/-- Primer 2, koraka 3–4: x + 5 = A(x + 2) + B(x − 1) za vsak x natanko pri A = 2, B = −1
(pri x = 1: 6 = 3A, pri x = −2: 3 = −3B). -/
theorem primer2_AB (A B : ℝ) : (∀ x : ℝ, x + 5 = A * (x + 2) + B * (x - 1)) ↔ A = 2 ∧ B = -1 := by
  constructor
  · intro h
    have h1 := h 1
    have h2 := h (-2)
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩ x; ring

/-- Primer 2 (in vrstica `enako`): (x + 5)/(x² + x − 2) = 2/(x − 1) − 1/(x + 2) za x ≠ 1, −2; korak 6:
2(x + 2) − (x − 1) = x + 5. -/
theorem primer2_ulomki (x : ℝ) (h1 : x - 1 ≠ 0) (h2 : x + 2 ≠ 0) :
    (x + 5) / (x ^ 2 + x - 2) = 2 / (x - 1) - 1 / (x + 2) ∧ 2 * (x + 2) - (x - 1) = x + 5 := by
  have h : x ^ 2 + x - 2 ≠ 0 := by
    rw [(primer2_razcep x).1]; exact mul_ne_zero h1 h2
  constructor
  · rw [(primer2_razcep x).1]; field_simp; ring
  · ring

/-- Predpostavke trditve `primer2_ulomki` se dajo izpolniti (x = 3). -/
example : (3 : ℝ) - 1 ≠ 0 ∧ (3 : ℝ) + 2 ≠ 0 := by norm_num

/-- Primer 2, odgovor (in vrstica `odvod`): ∫ (x + 5)/(x² + x − 2) dx = 2 ln|x − 1| − ln|x + 2| + C. -/
theorem primer2 (C x : ℝ) (h1 : x - 1 ≠ 0) (h2 : x + 2 ≠ 0) :
    HasDerivAt (fun x => 2 * log |x - 1| - log |x + 2| + C) ((x + 5) / (x ^ 2 + x - 2)) x := by
  rw [(primer2_ulomki x h1 h2).1]
  exact ((((d_log_sub 1 x h1).const_mul (2:ℝ)).sub (d_log_add 2 x h2)).add_const C).congr_deriv
    (by odv)

/-- Predpostavke trditve `primer2` se dajo izpolniti (x = 3). -/
example : (3 : ℝ) - 1 ≠ 0 ∧ (3 : ℝ) + 2 ≠ 0 := by norm_num

/-- Primer 3, koraka 1–2 (in vrstica `enako: 1/(1-s^2)`): 1 − s² = (1 − s)(1 + s); 1 = A(1 + s) + B(1 − s)
za vsak s natanko pri A = B = 1/2; 1/(1 − s²) = (1/2)/(1 − s) + (1/2)/(1 + s) za s ≠ ±1. -/
theorem primer3_razcep (A B : ℝ) :
    ((∀ s : ℝ, 1 = A * (1 + s) + B * (1 - s)) ↔ A = 1 / 2 ∧ B = 1 / 2) ∧
      ∀ s : ℝ, 1 - s ≠ 0 → 1 + s ≠ 0 → 1 - s ^ 2 = (1 - s) * (1 + s) ∧
        1 / (1 - s ^ 2) = 1 / 2 / (1 - s) + 1 / 2 / (1 + s) := by
  refine ⟨⟨fun h => ?_, ?_⟩, fun s h1 h2 => ⟨by ring, ?_⟩⟩
  · have h1 := h 1
    have h2 := h (-1)
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩ s; ring
  · have h : 1 - s ^ 2 ≠ 0 := by
      rw [show 1 - s ^ 2 = (1 - s) * (1 + s) by ring]; exact mul_ne_zero h1 h2
    field_simp; ring

/-- Primer 3, korak 3: −½ ln|1 − s| + ½ ln|1 + s| = ½ ln|(1 + s)/(1 − s)| za s ≠ ±1. -/
theorem primer3_zdruzi (s : ℝ) (h1 : 1 - s ≠ 0) (h2 : 1 + s ≠ 0) :
    -(1 / 2) * log |1 - s| + 1 / 2 * log |1 + s| = 1 / 2 * log |(1 + s) / (1 - s)| := by
  rw [abs_div, log_div (abs_ne_zero.mpr h2) (abs_ne_zero.mpr h1)]; ring

/-- Predpostavke trditve `primer3_zdruzi` se dajo izpolniti (s = 0). -/
example : (1 : ℝ) - 0 ≠ 0 ∧ (1 : ℝ) + 0 ≠ 0 := by norm_num

/-- Primer 3, korak 3 (in vrstica `odvod: (1/2)*ln((1+s)/(1-s))`): F(s) = ½ ln|(1 + s)/(1 − s)| + C
je primitivna funkcija za 1/(1 − s²) (s ≠ ±1). -/
theorem primer3_F (C s : ℝ) (h1 : 1 - s ≠ 0) (h2 : 1 + s ≠ 0) :
    HasDerivAt (fun s => 1 / 2 * log |(1 + s) / (1 - s)| + C) (1 / (1 - s ^ 2)) s := by
  have hd : HasDerivAt (fun s => -(1 / 2) * log |1 - s| + 1 / 2 * log |1 + s| + C) (1 / (1 - s ^ 2)) s := by
    rw [((primer3_razcep (1 / 2) (1 / 2)).2 s h1 h2).2]
    exact ((((d_log_rsub 1 s h1).const_mul (-(1 / 2) : ℝ)).add ((d_log_radd 1 s h2).const_mul (1 / 2 : ℝ))).add_const
      C).congr_deriv (by odv)
  have hev : (fun s => 1 / 2 * log |(1 + s) / (1 - s)| + C) =ᶠ[nhds s]
      (fun s => -(1 / 2) * log |1 - s| + 1 / 2 * log |1 + s| + C) := by
    have o1 : ∀ᶠ t in nhds s, 1 - t ≠ 0 :=
      (continuous_const.sub continuous_id).continuousAt.eventually_ne h1
    have o2 : ∀ᶠ t in nhds s, 1 + t ≠ 0 :=
      (continuous_const.add continuous_id).continuousAt.eventually_ne h2
    filter_upwards [o1, o2] with t t1 t2
    rw [primer3_zdruzi t t1 t2]
  exact hd.congr_of_eventuallyEq hev

/-- Predpostavke trditve `primer3_F` se dajo izpolniti (s = 0). -/
example : (1 : ℝ) - 0 ≠ 0 ∧ (1 : ℝ) + 0 ≠ 0 := by norm_num

/-- Primer 3, korak 4: F(0) = ½ ln 1 + C = C, zato iz F(0) = 0 sledi C = 0. -/
theorem primer3_C (C : ℝ) : 1 / 2 * log |(1 + 0) / (1 - 0)| + C = 0 ↔ C = 0 := by
  simp

/-- Primer 3, korak 7 (in vrstica `vrednost: 10*46*pi/180`): 46° = 46π/180 ≈ 0,8029 rad, lok
10 · 46π/180 ≈ 8,03 cm. -/
theorem primer3_lok : |46 * π / 180 - 0.8029| < 0.00005 ∧ |10 * (46 * π / 180) - 8.03| < 0.005 := by
  have p1 := pi_gt_d6
  have p2 := pi_lt_d6
  constructor <;> rw [abs_lt] <;> constructor <;> linarith

/-- Primer 4 (premisli, in vrstici za x² eˣ): ∫ x² eˣ dx = x² eˣ − 2(x eˣ − eˣ) + C = (x² − 2x + 2)eˣ + C;
preizkus (2x − 2)eˣ + (x² − 2x + 2)eˣ = x² eˣ. -/
theorem primer4 (C x : ℝ) :
    x ^ 2 * exp x - 2 * (x * exp x - exp x) = (x ^ 2 - 2 * x + 2) * exp x ∧
      HasDerivAt (fun x => (x ^ 2 - 2 * x + 2) * exp x + C) ((2 * x - 2) * exp x + (x ^ 2 - 2 * x + 2) * exp x) x ∧
      (2 * x - 2) * exp x + (x ^ 2 - 2 * x + 2) * exp x = x ^ 2 * exp x := by
  refine ⟨by ring, ?_, by ring⟩
  exact (((((hasDerivAt_pow 2 x).sub ((hasDerivAt_id' x).const_mul (2:ℝ))).add_const 2).mul
    (hasDerivAt_exp x)).add_const C).congr_deriv (by odv)

/-- Primer 4, premisli: kdor pozabi oklepaj, dobi (x² − 2x − 2)eˣ, ki ni primitivna funkcija za x² eˣ
(pri x = 0 je njen odvod −4, ne 0). -/
theorem primer4_brez_oklepaja : ¬ HasDerivAt (fun x => (x ^ 2 - 2 * x - 2) * exp x) ((0:ℝ) ^ 2 * exp 0) 0 := by
  intro h
  have h2 := ((((hasDerivAt_pow 2 (0:ℝ)).sub ((hasDerivAt_id' (0:ℝ)).const_mul (2:ℝ))).sub_const 2).mul
    (hasDerivAt_exp 0))
  have := h.unique h2
  norm_num at this

/-- Pogoste napake, »Izgubljeni minusi«: ∫ dx/(1 − x) = −ln|1 − x| + C (x ≠ 1). -/
theorem napaka_1_minus_x (C x : ℝ) (h : 1 - x ≠ 0) :
    HasDerivAt (fun x => -log |1 - x| + C) (1 / (1 - x)) x :=
  ((d_log_rsub 1 x h).neg.add_const C).congr_deriv (by odv)

/-- Predpostavka trditve `napaka_1_minus_x` se da izpolniti (x = 0). -/
example : (1 : ℝ) - 0 ≠ 0 := by norm_num

/-- Matura, naloga 1 a) (in vrstici `integral`/`odvod`): ∫ (2x + 1)eˣ dx = (2x + 1)eˣ − 2eˣ + C =
(2x − 1)eˣ + C; preizkus 2eˣ + (2x − 1)eˣ = (2x + 1)eˣ. -/
theorem matura1a (C x : ℝ) :
    (2 * x + 1) * exp x - 2 * exp x = (2 * x - 1) * exp x ∧
      HasDerivAt (fun x => (2 * x - 1) * exp x + C) (2 * exp x + (2 * x - 1) * exp x) x ∧
      2 * exp x + (2 * x - 1) * exp x = (2 * x + 1) * exp x := by
  refine ⟨by ring, ?_, by ring⟩
  exact (((((hasDerivAt_id' x).const_mul (2:ℝ)).sub_const 1).mul (hasDerivAt_exp x)).add_const C).congr_deriv
    (by odv)

/-- Matura, naloga 1 b), koraka 5–6 (in vrstica `integral: x*ln(x)`): za x > 0 je x²/2 · 1/x = x/2,
∫ x/2 dx = x²/4 + C in ∫ x ln x dx = x²/2 · ln x − x²/4 + C. -/
theorem matura1b (C x : ℝ) (hx : 0 < x) :
    x ^ 2 / 2 * (1 / x) = x / 2 ∧ HasDerivAt (fun x => x ^ 2 / 4) (x / 2) x ∧
      HasDerivAt (fun x => x ^ 2 / 2 * log x - x ^ 2 / 4 + C) (x * log x) x := by
  have hx0 : x ≠ 0 := hx.ne'
  refine ⟨by field_simp, ((hasDerivAt_pow 2 x).div_const 4).congr_deriv (by odv), ?_⟩
  exact (((((hasDerivAt_pow 2 x).div_const 2).mul (hasDerivAt_log hx.ne')).sub
    ((hasDerivAt_pow 2 x).div_const 4)).add_const C).congr_deriv (by field_simp; ring)

/-- Predpostavka trditve `matura1b` se da izpolniti (x = 1). -/
example : (0 : ℝ) < 1 := one_pos

/-- Matura, naloga 2 a): x² − 2x − 3 = (x − 3)(x + 1) in imenovalec je 0 natanko pri x = −1 ali x = 3,
zato D_f = ℝ ∖ {−1, 3}. -/
theorem matura2a_Df (x : ℝ) : x ^ 2 - 2 * x - 3 = (x - 3) * (x + 1) ∧
    (x ^ 2 - 2 * x - 3 = 0 ↔ x = -1 ∨ x = 3) := by
  have h : x ^ 2 - 2 * x - 3 = (x - 3) * (x + 1) := by ring
  refine ⟨h, ?_⟩
  rw [h, mul_eq_zero]
  constructor
  · rintro (h | h)
    · right; linarith
    · left; linarith
  · rintro (h | h)
    · right; linarith
    · left; linarith

/-- Matura, naloga 2 a), korak 2 (in vrstici `enako`): x² + x − 4 = (x² − 2x − 3) + (3x − 1) in
f(x) = 1 + (3x − 1)/(x² − 2x − 3) za x ∈ D_f. -/
theorem matura2a_deljenje (x : ℝ) (h : x ^ 2 - 2 * x - 3 ≠ 0) :
    x ^ 2 + x - 4 = (x ^ 2 - 2 * x - 3) + (3 * x - 1) ∧
      (x ^ 2 + x - 4) / (x ^ 2 - 2 * x - 3) = 1 + (3 * x - 1) / (x ^ 2 - 2 * x - 3) := by
  constructor
  · ring
  · rw [one_add_div h]; congr 1; ring

/-- Predpostavka trditve `matura2a_deljenje` se da izpolniti (x = 4). -/
example : (4 : ℝ) ^ 2 - 2 * 4 - 3 ≠ 0 := by norm_num

/-- Matura, naloga 2 b), koraka 3–4: 3x − 1 = A(x + 1) + B(x − 3) za vsak x natanko pri A = 2, B = 1
(pri x = 3: 8 = 4A, pri x = −1: −4 = −4B). -/
theorem matura2b_AB (A B : ℝ) : (∀ x : ℝ, 3 * x - 1 = A * (x + 1) + B * (x - 3)) ↔ A = 2 ∧ B = 1 := by
  constructor
  · intro h
    have h1 := h 3
    have h2 := h (-1)
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩ x; ring

/-- Matura, naloga 2 b), korak 5 (in vrstica `enako`): (3x − 1)/(x² − 2x − 3) = 2/(x − 3) + 1/(x + 1). -/
theorem matura2b (x : ℝ) (h1 : x - 3 ≠ 0) (h2 : x + 1 ≠ 0) :
    (3 * x - 1) / (x ^ 2 - 2 * x - 3) = 2 / (x - 3) + 1 / (x + 1) := by
  rw [(matura2a_Df x).1]; field_simp; ring

/-- Predpostavke trditve `matura2b` se dajo izpolniti (x = 4). -/
example : (4 : ℝ) - 3 ≠ 0 ∧ (4 : ℝ) + 1 ≠ 0 := by norm_num

/-- Matura, naloga 2 c) (in vrstica `integral`): ∫ f dx = x + 2 ln|x − 3| + ln|x + 1| + C na D_f. -/
theorem matura2c (C x : ℝ) (h1 : x - 3 ≠ 0) (h2 : x + 1 ≠ 0) :
    HasDerivAt (fun x => x + 2 * log |x - 3| + log |x + 1| + C)
      ((x ^ 2 + x - 4) / (x ^ 2 - 2 * x - 3)) x := by
  have h : x ^ 2 - 2 * x - 3 ≠ 0 := by rw [(matura2a_Df x).1]; exact mul_ne_zero h1 h2
  rw [(matura2a_deljenje x h).2, matura2b x h1 h2]
  exact ((((hasDerivAt_id' x).add ((d_log_sub 3 x h1).const_mul (2:ℝ))).add (d_log_add 1 x h2)).add_const
    C).congr_deriv (by odv)

/-- Predpostavke trditve `matura2c` se dajo izpolniti (x = 4). -/
example : (4 : ℝ) - 3 ≠ 0 ∧ (4 : ℝ) + 1 ≠ 0 := by norm_num

/-- Matura, naloga 2 d) (in vrstica `vrednost`): na (3, ∞) je G(x) = x + 2 ln(x − 3) + ln(x + 1) − ln 5
primitivna funkcija za f; G(4) = 4 + 2 ln 1 + ln 5 + C = 4 + ln 5 + C, iz G(4) = 4 sledi C = −ln 5. -/
theorem matura2d :
    (∀ x : ℝ, 3 < x → HasDerivAt (fun x => x + 2 * log (x - 3) + log (x + 1) - log 5)
      ((x ^ 2 + x - 4) / (x ^ 2 - 2 * x - 3)) x) ∧
    (∀ C : ℝ, (4:ℝ) + 2 * log (4 - 3) + log (4 + 1) + C = 4 + log 5 + C) ∧
    (∀ C : ℝ, (4:ℝ) + log 5 + C = 4 ↔ C = -log 5) ∧
    (4:ℝ) + 2 * log (4 - 3) + log (4 + 1) - log 5 = 4 := by
  refine ⟨fun x hx => ?_, fun C => by norm_num, fun C => by constructor <;> intro h <;> linarith,
    by norm_num⟩
  have h1 : x - 3 ≠ 0 := by linarith
  have h2 : x + 1 ≠ 0 := by linarith
  have hd := matura2c (-log 5) x h1 h2
  refine hd.congr_of_eventuallyEq ?_
  filter_upwards [Ioi_mem_nhds hx] with t ht
  have t1 : 0 < t - 3 := by simp at ht; linarith
  have t2 : 0 < t + 1 := by simp at ht; linarith
  rw [abs_of_pos t1, abs_of_pos t2]; ring

/-- Ustno vprašanje 2 (in vrstici `enako`/`integral`): 1 = A(x + 1) + Bx za vsak x natanko pri A = 1,
B = −1; 1/(x(x + 1)) = 1/x − 1/(x + 1) in ∫ dx/(x(x + 1)) = ln|x| − ln|x + 1| + C. -/
theorem ustno2 (A B : ℝ) :
    ((∀ x : ℝ, 1 = A * (x + 1) + B * x) ↔ A = 1 ∧ B = -1) ∧
      ∀ C x : ℝ, x ≠ 0 → x + 1 ≠ 0 → 1 / (x * (x + 1)) = 1 / x - 1 / (x + 1) ∧
        HasDerivAt (fun x => log |x| - log |x + 1| + C) (1 / (x * (x + 1))) x := by
  refine ⟨⟨fun h => ?_, ?_⟩, fun C x h1 h2 => ⟨by field_simp; ring, ?_⟩⟩
  · have e0 := h 0
    have e1 := h (-1)
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩ x; ring
  · have hl : HasDerivAt (fun x => log |x|) (1 / x) x := by simpa using hasDerivAt_log h1
    rw [show 1 / (x * (x + 1)) = 1 / x - 1 / (x + 1) by field_simp; ring]
    exact ((hl.sub (d_log_add 1 x h2)).add_const C).congr_deriv (by odv)

/-- Drugače, s številkami, korak 1: (x − 1)eˣ je primitivna funkcija za x eˣ, naklon pri x = 1 je
f(1) = e ≈ 2,718. -/
theorem stevilke_naklon : HasDerivAt (fun x => (x - 1) * exp x) (1 * exp 1) 1 ∧
    |exp 1 - 2.718| < 0.0005 := by
  refine ⟨(((hasDerivAt_id' (1:ℝ)).sub_const 1).mul (hasDerivAt_exp 1)).congr_deriv (by odv), ?_⟩
  have := exp_one_gt_d9
  have := exp_one_lt_d9
  rw [abs_lt]; constructor <;> linarith

/-- Drugače, s številkami, koraka 2–3: F(1,01) = 0,01 · e^1,01 ≈ 0,02746, F(0,99) = −0,01 · e^0,99 ≈
−0,02691 in naklon sekante (0,02746 + 0,02691)/0,02 ≈ 2,72. -/
theorem stevilke_sekanta :
    |(1.01 - 1) * exp (1.01:ℝ) - 0.02746| < 0.000005 ∧
      |(0.99 - 1) * exp (0.99:ℝ) - (-0.02691)| < 0.000005 ∧
      |((0.02746:ℝ) + 0.02691) / 0.02 - 2.72| < 0.005 := by
  have b := Real.exp_bound (x := (0.01:ℝ)) (by norm_num [abs_of_pos]) (n := 3) (by norm_num)
  have b' := Real.exp_bound (x := (-0.01:ℝ)) (by norm_num [abs_of_neg]) (n := 3) (by norm_num)
  norm_num [Finset.sum_range_succ, Nat.factorial] at b b'
  rw [abs_le] at b b'
  have e1 := exp_one_gt_d9
  have e2 := exp_one_lt_d9
  have h1 : exp (1.01:ℝ) = exp 1 * exp 0.01 := by rw [← exp_add]; norm_num
  have h2 : exp (0.99:ℝ) = exp 1 * exp (-0.01) := by rw [← exp_add]; norm_num
  have p1 := exp_pos (0.01:ℝ)
  have p2 := exp_pos (-0.01:ℝ)
  refine ⟨?_, ?_, by rw [abs_lt]; constructor <;> norm_num⟩
  · rw [h1, abs_lt]; constructor <;> nlinarith [b.1, b.2]
  · rw [h2, abs_lt]; constructor <;> nlinarith [b'.1, b'.2]

/-- Drugače, s številkami, koraka 4–5: razcep iz primera 2 pri x = 3: (3 + 5)/(9 + 3 − 2) = 8/10 = 0,8 in
2/(3 − 1) − 1/(3 + 2) = 1 − 0,2 = 0,8. -/
theorem stevilke_razcep : ((3:ℝ) + 5) / (9 + 3 - 2) = 8 / 10 ∧ (8 / 10 : ℝ) = 0.8 ∧
    2 / ((3:ℝ) - 1) - 1 / (3 + 2) = 1 - 0.2 ∧ (1 : ℝ) - 0.2 = 0.8 := by norm_num

/-- Preveri se, vprašanje 2 (in vrstica `integral: 2*x*exp(x^2)`): ∫ 2x e^{x²} dx = e^{x²} + C
(nova spremenljivka t = x²). -/
theorem kviz2 (C x : ℝ) : HasDerivAt (fun x => exp (x ^ 2) + C) (2 * x * exp (x ^ 2)) x :=
  (((hasDerivAt_pow 2 x).exp).add_const C).congr_deriv (by odv)

/-- Preveri se, vprašanje 3 (in vrstica `enako`): 3x + 1 = A(x + 1) + B(x − 1) za vsak x natanko pri
A = 2 (in B = 1); torej (3x + 1)/((x − 1)(x + 1)) = 2/(x − 1) + 1/(x + 1). -/
theorem kviz3 (A B : ℝ) : ((∀ x : ℝ, 3 * x + 1 = A * (x + 1) + B * (x - 1)) ↔ A = 2 ∧ B = 1) ∧
    ∀ x : ℝ, x - 1 ≠ 0 → x + 1 ≠ 0 → (3 * x + 1) / ((x - 1) * (x + 1)) = 2 / (x - 1) + 1 / (x + 1) := by
  refine ⟨⟨fun h => ?_, ?_⟩, fun x h1 h2 => by field_simp; ring⟩
  · have e1 := h 1
    have e2 := h (-1)
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩ x; ring

/-- Preveri se, vprašanje 5: koraka 1 in 2 sta pravilna, korak 3 ne (ln|1 − x| ni primitivna funkcija
za 1/(1 − x): pri x = 0 je njen odvod −1, ne 1); pravilni rezultat je ln|1 + x| − ln|1 − x| + C
(in vrstica `odvod: ln(1+x)-ln(1-x)`). -/
theorem kviz5 :
    (∀ x : ℝ, 1 - x ^ 2 = (1 - x) * (1 + x)) ∧
    (∀ x : ℝ, 1 - x ≠ 0 → 1 + x ≠ 0 → 2 / (1 - x ^ 2) = 1 / (1 - x) + 1 / (1 + x)) ∧
    ¬ HasDerivAt (fun x => log |1 - x|) (1 / (1 - 0)) 0 ∧
    ∀ C x : ℝ, 1 - x ≠ 0 → 1 + x ≠ 0 →
      HasDerivAt (fun x => log |1 + x| - log |1 - x| + C) (2 / (1 - x ^ 2)) x := by
  have hr : ∀ x : ℝ, 1 - x ≠ 0 → 1 + x ≠ 0 → 2 / (1 - x ^ 2) = 1 / (1 - x) + 1 / (1 + x) := by
    intro x h1 h2
    have h : 1 - x ^ 2 ≠ 0 := by
      rw [show 1 - x ^ 2 = (1 - x) * (1 + x) by ring]; exact mul_ne_zero h1 h2
    field_simp; ring
  refine ⟨fun x => by ring, hr, fun h => ?_, fun C x h1 h2 => ?_⟩
  · have := h.unique (d_log_rsub 1 0 (by norm_num))
    norm_num at this
  · rw [hr x h1 h2]
    exact (((d_log_radd 1 x h2).sub (d_log_rsub 1 x h1)).add_const C).congr_deriv (by odv)

end Evklid.Lekcije.MAT_SS_4.IntegracijaPerPartesInRacionalnihFunkcij
