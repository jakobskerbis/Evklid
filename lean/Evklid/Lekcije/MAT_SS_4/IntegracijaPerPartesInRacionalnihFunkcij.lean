/-
vir: content/lessons/MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij.md
sha256: a5b24a7401d1c4d8f1ac15a0a86d7d842497b40ecdd41aab3b41250da6c20d72
Ni v Leanu: zgodovina v uvodu (Mercator, Wright, Barrow) in »Drugače: Kot zgodba« (menjalnica);
simulacija »Družina primitivnih funkcij«; nasveti, kako izbrati u (»novi integral je lažji/težji«
ni matematična trditev; dokazana je le enakost pri obeh izbirah); Primer 3, koraki 5–6 in vrstica
`vrednost: 10*(1/2)*ln(...)` (sin 46° ≈ 0,7193, ulomek ≈ 6,126, y ≈ 9,06 cm): natančne meje za
sin 46° in ln 6,126 so zahtevne, še ni dokazano (preverjeno le numerično zunaj Leana: 0,71934; 6,12605;
9,0628);
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

/-- Tabela v razlagi, točka 7: (ln|x − a|)' = 1/(x − a) za x ≠ a.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#d-log-sub
besedilo: »Pomnožimo z $(x - 1)(x + 1)$ in dobimo $1 = A(x + 1) + B(x - 1)$. Pri $x = 1$ ostane $1 = 2A$, torej $A = \frac{1}{2}$. Pri $x = -1$ ostane $1 = -2B$, torej $B = -\frac{1}{2}$. Vsak parcialni ulomek integriramo v logaritem:« -/
theorem d_log_sub (a x : ℝ) (h : x - a ≠ 0) : HasDerivAt (fun x => log |x - a|) (1 / (x - a)) x := by
  have := ((hasDerivAt_id' x).sub_const a).log h
  simp only [log_abs]; exact this

/-- Predpostavka trditve `d_log_sub` se da izpolniti (a = 1, x = 2). -/
example : (2 : ℝ) - 1 ≠ 0 := by norm_num

/-- Predpostavke trditve `d_log_sub` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2 : ℝ) - 1 ≠ 0 := by norm_num
  d_log_sub (h := w)

/-- Pomožna: (ln|x + b|)' = 1/(x + b) za x ≠ −b.
pomozno -/
theorem d_log_add (b x : ℝ) (h : x + b ≠ 0) : HasDerivAt (fun x => log |x + b|) (1 / (x + b)) x := by
  have := ((hasDerivAt_id' x).add_const b).log h
  simp only [log_abs]; exact this

/-- Predpostavka trditve `d_log_add` se da izpolniti (b = 1, x = 0). -/
example : (0 : ℝ) + 1 ≠ 0 := by norm_num

/-- Pomožna: (ln|a − x|)' = −1/(a − x) za x ≠ a.
pomozno -/
theorem d_log_rsub (a x : ℝ) (h : a - x ≠ 0) : HasDerivAt (fun x => log |a - x|) (-1 / (a - x)) x := by
  have := ((hasDerivAt_const x a).sub (hasDerivAt_id' x)).log h
  simp only [log_abs]; exact this.congr_deriv (by odv)

/-- Predpostavka trditve `d_log_rsub` se da izpolniti (a = 1, x = 0). -/
example : (1 : ℝ) - 0 ≠ 0 := by norm_num

/-- Pomožna: (ln|a + x|)' = 1/(a + x) za x ≠ −a.
pomozno -/
theorem d_log_radd (a x : ℝ) (h : a + x ≠ 0) : HasDerivAt (fun x => log |a + x|) (1 / (a + x)) x := by
  have := ((hasDerivAt_const x a).add (hasDerivAt_id' x)).log h
  simp only [log_abs]; exact this.congr_deriv (by odv)

/-- Predpostavka trditve `d_log_radd` se da izpolniti (a = 1, x = 0). -/
example : (1 : ℝ) + 0 ≠ 0 := by norm_num

/-- Razlaga, točka 1 (in vrstica `odvod: x^2/2*exp(x)`): (x²/2 · eˣ)' = x eˣ + x²/2 · eˣ.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#bliznjica-odvod
besedilo: »$\left(\frac{x^2}{2}\,e^x\right)' = x\,e^x + \frac{x^2}{2}\,e^x$« -/
theorem bliznjica_odvod (x : ℝ) :
    HasDerivAt (fun x => x ^ 2 / 2 * exp x) (x * exp x + x ^ 2 / 2 * exp x) x :=
  (((hasDerivAt_pow 2 x).div_const 2).mul (hasDerivAt_exp x)).congr_deriv (by odv)

/-- Razlaga, točka 1, in »Pogoste napake«: x²/2 · eˣ ni primitivna funkcija za x eˣ
(pri x = 1 je odvod e + e/2, ne e).
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#bliznjica-napacna
besedilo: »$\int x\,dx \cdot \int e^x\,dx = \frac{x^2}{2}\,e^x$ (napačno).« -/
theorem bliznjica_napacna : ¬ HasDerivAt (fun x => x ^ 2 / 2 * exp x) (1 * exp 1) 1 := by
  intro h
  have := h.unique (bliznjica_odvod 1)
  have he := exp_pos 1
  norm_num at this

/-- Razlaga, točka 2: pravilo za odvod produkta (uv)' = u'v + uv'.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#produkt
besedilo: »Izhajamo iz pravila za odvod produkta $(uv)' = u'v + uv'$.« -/
theorem produkt (u v : ℝ → ℝ) (u' v' x : ℝ) (hu : HasDerivAt u u' x) (hv : HasDerivAt v v' x) :
    HasDerivAt (fun x => u x * v x) (u' * v x + u x * v') x := hu.mul hv

/-- Predpostavke trditve `produkt` se dajo izpolniti (u = id, v = exp). -/
example : HasDerivAt (fun x : ℝ => x) 1 0 ∧ HasDerivAt exp (exp 0) 0 := ⟨hasDerivAt_id' 0, hasDerivAt_exp 0⟩

/-- Predpostavke trditve `produkt` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : HasDerivAt (fun x : ℝ => x) 1 0 ∧ HasDerivAt exp (exp 0) 0 := ⟨hasDerivAt_id' 0, hasDerivAt_exp 0⟩
  produkt (hu := w.1) (hv := w.2)

/-- Razlaga, točka 2, in ustno vprašanje 1 (nedoločena oblika per partes): če je G primitivna
funkcija za u'v, je uv − G primitivna funkcija za uv', tj. ∫ u v' dx = u v − ∫ u' v dx.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#per-partes
besedilo: »Integrirajmo obe strani: $u\,v = \int u'\,v\,dx + \int u\,v'\,dx$. Ko drugi integral izrazimo, dobimo formulo **per partes**:« -/
theorem per_partes (u v u' v' G : ℝ → ℝ) (x : ℝ) (hu : HasDerivAt u (u' x) x)
    (hv : HasDerivAt v (v' x) x) (hG : HasDerivAt G (u' x * v x) x) :
    HasDerivAt (fun x => u x * v x - G x) (u x * v' x) x :=
  ((hu.mul hv).sub hG).congr_deriv (by odv)

/-- Predpostavke trditve `per_partes` se dajo izpolniti (u = x, v = eˣ, G = eˣ). -/
example : HasDerivAt (fun x : ℝ => x) ((fun _ => (1:ℝ)) 0) 0 ∧ HasDerivAt exp (exp 0) 0 ∧
    HasDerivAt exp ((fun _ => (1:ℝ)) 0 * exp 0) 0 :=
  ⟨hasDerivAt_id' 0, hasDerivAt_exp 0, by simpa using hasDerivAt_exp 0⟩

/-- Predpostavke trditve `per_partes` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : HasDerivAt (fun x : ℝ => x) ((fun _ => (1:ℝ)) 0) 0 ∧ HasDerivAt exp (exp 0) 0 ∧ HasDerivAt exp ((fun _ => (1:ℝ)) 0 * exp 0) 0 :=
    ⟨hasDerivAt_id' 0, hasDerivAt_exp 0, by simpa using hasDerivAt_exp 0⟩
  per_partes (hu := w.1) (hv := w.2.1) (hG := w.2.2)

/-- Razlaga, točka 2 (določena oblika per partes): za zvezno odvedljivi u, v na [a, b] je
∫ₐᵇ u v' dx = u(b)v(b) − u(a)v(a) − ∫ₐᵇ u' v dx.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#per-partes-dolocen
besedilo: »Integrirajmo obe strani: $u\,v = \int u'\,v\,dx + \int u\,v'\,dx$. Ko drugi integral izrazimo, dobimo formulo **per partes**:« -/
theorem per_partes_dolocen (u v u' v' : ℝ → ℝ) (a b : ℝ) (hu : ∀ x, HasDerivAt u (u' x) x)
    (hv : ∀ x, HasDerivAt v (v' x) x) (hu' : Continuous u') (hv' : Continuous v') :
    ∫ x in a..b, u x * v' x = u b * v b - u a * v a - ∫ x in a..b, u' x * v x :=
  integral_mul_deriv_eq_deriv_mul (fun x _ => hu x) (fun x _ => hv x) (hu'.intervalIntegrable a b)
    (hv'.intervalIntegrable a b)

/-- Predpostavke trditve `per_partes_dolocen` se dajo izpolniti (u = x, v = eˣ). -/
example : (∀ x : ℝ, HasDerivAt (fun x : ℝ => x) ((fun _ => (1:ℝ)) x) x) ∧
    (∀ x : ℝ, HasDerivAt exp (exp x) x) ∧ Continuous (fun _ : ℝ => (1:ℝ)) ∧ Continuous exp :=
  ⟨fun x => hasDerivAt_id' x, hasDerivAt_exp, continuous_const, continuous_exp⟩

/-- Predpostavke trditve `per_partes_dolocen` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (∀ x : ℝ, HasDerivAt (fun x : ℝ => x) ((fun _ => (1:ℝ)) x) x) ∧ (∀ x : ℝ, HasDerivAt exp (exp x) x) ∧ Continuous (fun _ : ℝ => (1:ℝ)) ∧ Continuous exp :=
    ⟨fun x => hasDerivAt_id' x, hasDerivAt_exp, continuous_const, continuous_exp⟩
  per_partes_dolocen (hu := w.1) (hv := w.2.1) (hu' := w.2.2.1) (hv' := w.2.2.2)

/-- Razlaga, točka 3 (in vrstici `integral`/`odvod` za x eˣ, povzetek): ∫ x eˣ dx = x eˣ − eˣ + C
= (x − 1)eˣ + C; preizkus (x eˣ − eˣ)' = eˣ + x eˣ − eˣ = x eˣ.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#integral-x-exp
besedilo: »Preizkus: $(x\,e^x - e^x)' = e^x + x\,e^x - e^x = x\,e^x$.« -/
theorem integral_x_exp (C x : ℝ) :
    HasDerivAt (fun x => x * exp x - exp x + C) (x * exp x) x ∧ x * exp x - exp x = (x - 1) * exp x := by
  refine ⟨?_, by ring⟩
  have := (((hasDerivAt_id' x).mul (hasDerivAt_exp x)).sub (hasDerivAt_exp x)).add_const C
  exact this.congr_deriv (by odv)

/-- Razlaga, točka 4, »Premisli« (obratna izbira u = eˣ, v' = x): če je G primitivna funkcija za
x²/2 · eˣ, je x²/2 · eˣ − G primitivna funkcija za x eˣ (enakost je pravilna, novi integral pa težji).
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#obratna-izbira
besedilo: »Dobil bi $v = \frac{x^2}{2}$ in $\int x\,e^x\,dx = \frac{x^2}{2}\,e^x - \int \frac{x^2}{2}\,e^x\,dx$. Enakost je pravilna, a novi integral ima višjo potenco $x$ kot prvotni, zato je težji. Izbira $u$ odloči, ali račun teče proti koncu ali stran od njega.« -/
theorem obratna_izbira (G : ℝ → ℝ) (x : ℝ) (hG : HasDerivAt G (x ^ 2 / 2 * exp x) x) :
    HasDerivAt (fun x => x ^ 2 / 2 * exp x - G x) (x * exp x) x :=
  (((hasDerivAt_pow 2 x).div_const 2 |>.mul (hasDerivAt_exp x)).sub hG).congr_deriv (by odv)

/-- Predpostavka trditve `obratna_izbira` se da izpolniti (G = (x² − 2x + 2)eˣ/2). -/
example (x : ℝ) : HasDerivAt (fun x => (x ^ 2 - 2 * x + 2) * exp x / 2) (x ^ 2 / 2 * exp x) x :=
  ((((hasDerivAt_pow 2 x).sub ((hasDerivAt_id' x).const_mul (2:ℝ))).add_const 2).mul
    (hasDerivAt_exp x) |>.div_const 2).congr_deriv (by odv)

/-- Predpostavke trditve `obratna_izbira` se dajo izpolniti: izrek, uporabljen na primeru. -/
example (x : ℝ) :=
  have w : HasDerivAt (fun x => (x ^ 2 - 2 * x + 2) * exp x / 2) (x ^ 2 / 2 * exp x) x :=
    ((((hasDerivAt_pow 2 x).sub ((hasDerivAt_id' x).const_mul (2:ℝ))).add_const 2).mul
      (hasDerivAt_exp x) |>.div_const 2).congr_deriv (by odv)
  obratna_izbira (hG := w)

/-- Razlaga, točka 5, in ustno vprašanje 3 (in vrstici za ln x): za x > 0 je
∫ ln x dx = x ln x − ∫ x · (1/x) dx = x ln x − x + C.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#integral-ln
besedilo: »$$\int \ln x\,dx = x \ln x - \int x \cdot \frac{1}{x}\,dx = x \ln x - x + C$$« -/
theorem integral_ln (C x : ℝ) (hx : 0 < x) :
    HasDerivAt (fun x => x * log x - x + C) (log x) x ∧ x * (1 / x) = 1 := by
  have hx0 : x ≠ 0 := hx.ne'
  refine ⟨?_, by field_simp⟩
  have := ((((hasDerivAt_id' x).mul (hasDerivAt_log hx.ne'))).sub (hasDerivAt_id' x)).add_const C
  exact this.congr_deriv (by field_simp; ring)

/-- Predpostavka trditve `integral_ln` se da izpolniti (x = 1). -/
example : (0 : ℝ) < 1 := one_pos

/-- Predpostavke trditve `integral_ln` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 1 := one_pos
  integral_ln (hx := w)

/-- Razlaga, točka 7 (in vrstica `odvod: ln(x^2-1)`): za x² ≠ 1 je (ln|x² − 1|)' = 2x/(x² − 1).
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#d-ln-x2-1
besedilo: »Odvod desne strani je $\frac{2x}{x^2 - 1}$, ne $\frac{1}{x^2 - 1}$.« -/
theorem d_ln_x2_1 (x : ℝ) (hx : x ^ 2 - 1 ≠ 0) :
    HasDerivAt (fun x => log |x ^ 2 - 1|) (2 * x / (x ^ 2 - 1)) x := by
  have := ((hasDerivAt_pow 2 x).sub_const 1).log hx
  simp only [log_abs]; exact this.congr_deriv (by odv)

/-- Predpostavka trditve `d_ln_x2_1` se da izpolniti (x = 2). -/
example : (2 : ℝ) ^ 2 - 1 ≠ 0 := by norm_num

/-- Predpostavke trditve `d_ln_x2_1` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2 : ℝ) ^ 2 - 1 ≠ 0 := by norm_num
  d_ln_x2_1 (hx := w)

/-- Razlaga, točka 7, in »Pogoste napake«: ln|x² − 1| ni primitivna funkcija za 1/(x² − 1)
(pri x = 2 je odvod 4/3, ne 1/3).
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#ln-imenovalca-napacno
besedilo: »Odvod desne strani je $\frac{2x}{x^2 - 1}$, ne $\frac{1}{x^2 - 1}$.« -/
theorem ln_imenovalca_napacno : ¬ HasDerivAt (fun x => log |x ^ 2 - 1|) (1 / ((2:ℝ) ^ 2 - 1)) 2 := by
  intro h
  have := h.unique (d_ln_x2_1 2 (by norm_num))
  norm_num at this

/-- Razlaga, točka 7: 1 = A(x + 1) + B(x − 1) za vsak x natanko pri A = 1/2, B = −1/2.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#razcep-x2-1-ab
besedilo: »Pomnožimo z $(x - 1)(x + 1)$ in dobimo $1 = A(x + 1) + B(x - 1)$. Pri $x = 1$ ostane $1 = 2A$, torej $A = \frac{1}{2}$. Pri $x = -1$ ostane $1 = -2B$, torej $B = -\frac{1}{2}$. Vsak parcialni ulomek integriramo v logaritem:« -/
theorem razcep_x2_1_AB (A B : ℝ) : (∀ x : ℝ, 1 = A * (x + 1) + B * (x - 1)) ↔ A = 1 / 2 ∧ B = -1 / 2 := by
  constructor
  · intro h
    have h1 := h 1
    have h2 := h (-1)
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩ x; ring

/-- Razlaga, točka 7 (in vrstica `enako: 1/(x^2-1)`): 1/(x² − 1) = (1/2)/(x − 1) − (1/2)/(x + 1)
za x ≠ ±1.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#razcep-x2-1
besedilo: »$$\int \frac{dx}{x^2 - 1} = \frac{1}{2} \ln\lvert x - 1\rvert - \frac{1}{2} \ln\lvert x + 1\rvert + C$$« -/
theorem razcep_x2_1 (x : ℝ) (h1 : x - 1 ≠ 0) (h2 : x + 1 ≠ 0) :
    1 / (x ^ 2 - 1) = 1 / 2 / (x - 1) - 1 / 2 / (x + 1) := by
  have h : x ^ 2 - 1 ≠ 0 := by
    rw [show x ^ 2 - 1 = (x - 1) * (x + 1) by ring]; exact mul_ne_zero h1 h2
  field_simp; ring

/-- Predpostavke trditve `razcep_x2_1` se dajo izpolniti (x = 2). -/
example : (2 : ℝ) - 1 ≠ 0 ∧ (2 : ℝ) + 1 ≠ 0 := by norm_num

/-- Predpostavke trditve `razcep_x2_1` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2 : ℝ) - 1 ≠ 0 ∧ (2 : ℝ) + 1 ≠ 0 := by norm_num
  razcep_x2_1 (h1 := w.1) (h2 := w.2)

/-- Razlaga, točka 7 (in vrstica `odvod`): ∫ dx/(x² − 1) = ½ ln|x − 1| − ½ ln|x + 1| + C (x ≠ ±1).
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#integral-x2-1
besedilo: »$x^2 - 1 = (x - 1)(x + 1)$« -/
theorem integral_x2_1 (C x : ℝ) (h1 : x - 1 ≠ 0) (h2 : x + 1 ≠ 0) :
    HasDerivAt (fun x => 1 / 2 * log |x - 1| - 1 / 2 * log |x + 1| + C) (1 / (x ^ 2 - 1)) x := by
  rw [razcep_x2_1 x h1 h2]
  exact ((((d_log_sub 1 x h1).const_mul (1 / 2 : ℝ)).sub ((d_log_add 1 x h2).const_mul (1 / 2 : ℝ))).add_const
    C).congr_deriv (by odv)

/-- Predpostavke trditve `integral_x2_1` se dajo izpolniti (x = 2). -/
example : (2 : ℝ) - 1 ≠ 0 ∧ (2 : ℝ) + 1 ≠ 0 := by norm_num

/-- Predpostavke trditve `integral_x2_1` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2 : ℝ) - 1 ≠ 0 ∧ (2 : ℝ) + 1 ≠ 0 := by norm_num
  integral_x2_1 (h1 := w.1) (h2 := w.2)

/-- Razlaga, točka 7, tabela: (k ln|x − a|)' = k/(x − a) in (−ln|a − x|)' = 1/(a − x) za x ≠ a.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#tabela-ulomkov
besedilo: »| $\frac{1}{a - x}$ | $-\ln\lvert a - x\rvert$ |« -/
theorem tabela_ulomkov (k a x : ℝ) (h : x - a ≠ 0) :
    HasDerivAt (fun x => k * log |x - a|) (k / (x - a)) x ∧
      HasDerivAt (fun x => -log |a - x|) (1 / (a - x)) x := by
  have h' : a - x ≠ 0 := fun e => h (by linarith)
  exact ⟨((d_log_sub a x h).const_mul k).congr_deriv (by odv),
    (d_log_rsub a x h').neg.congr_deriv (by odv)⟩

/-- Predpostavka trditve `tabela_ulomkov` se da izpolniti (a = 1, x = 2). -/
example : (2 : ℝ) - 1 ≠ 0 := by norm_num

/-- Predpostavke trditve `tabela_ulomkov` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2 : ℝ) - 1 ≠ 0 := by norm_num
  tabela_ulomkov (h := w)

/-- Razlaga, točka 8, »Premisli«: nobena izbira A, B ne da A/(x − 1) + B/(x + 1) = (x² + 1)/(x² − 1)
za vse x ≠ ±1.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#nastavek-brez-deljenja
besedilo: »Zakaj nastavek $\frac{A}{x - 1} + \frac{B}{x + 1}$ ne more biti enak $\frac{x^2 + 1}{x^2 - 1}$, ne glede na izbiro $A$ in $B$?« -/
theorem nastavek_brez_deljenja : ¬ ∃ A B : ℝ, ∀ x : ℝ, x - 1 ≠ 0 → x + 1 ≠ 0 →
    A / (x - 1) + B / (x + 1) = (x ^ 2 + 1) / (x ^ 2 - 1) := by
  rintro ⟨A, B, h⟩
  have e0 := h 0 (by norm_num) (by norm_num)
  have e2 := h 2 (by norm_num) (by norm_num)
  have e3 := h 3 (by norm_num) (by norm_num)
  norm_num at e0 e2 e3
  linarith

/-- Razlaga, točka 8 (in vrstici `enako`): (x² + 1)/(x² − 1) = 1 + 2/(x² − 1) = 1 + 1/(x − 1) − 1/(x + 1)
za x ≠ ±1.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#deljenje
besedilo: »Števec zapišemo kot $(x^2 - 1) + 2$, zato deljenje da $\frac{x^2 + 1}{x^2 - 1} = 1 + \frac{2}{x^2 - 1}$. Razcep ostanka je dvakratnik razcepa iz točke 7: $\frac{2}{x^2 - 1} = \frac{1}{x - 1} - \frac{1}{x + 1}$. Zato je« -/
theorem deljenje (x : ℝ) (h1 : x - 1 ≠ 0) (h2 : x + 1 ≠ 0) :
    (x ^ 2 + 1) / (x ^ 2 - 1) = 1 + 2 / (x ^ 2 - 1) ∧ 2 / (x ^ 2 - 1) = 1 / (x - 1) - 1 / (x + 1) := by
  have h : x ^ 2 - 1 ≠ 0 := by
    rw [show x ^ 2 - 1 = (x - 1) * (x + 1) by ring]; exact mul_ne_zero h1 h2
  constructor <;> field_simp <;> ring

/-- Predpostavke trditve `deljenje` se dajo izpolniti (x = 2). -/
example : (2 : ℝ) - 1 ≠ 0 ∧ (2 : ℝ) + 1 ≠ 0 := by norm_num

/-- Predpostavke trditve `deljenje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2 : ℝ) - 1 ≠ 0 ∧ (2 : ℝ) + 1 ≠ 0 := by norm_num
  deljenje (h1 := w.1) (h2 := w.2)

/-- Razlaga, točka 8 (in vrstica `odvod: x+ln(x-1)-ln(x+1)`):
∫ (x² + 1)/(x² − 1) dx = x + ln|x − 1| − ln|x + 1| + C za x ≠ ±1.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#integral-deljenje
besedilo: »$$\int \frac{x^2 + 1}{x^2 - 1}\,dx = x + \ln\lvert x - 1\rvert - \ln\lvert x + 1\rvert + C$$« -/
theorem integral_deljenje (C x : ℝ) (h1 : x - 1 ≠ 0) (h2 : x + 1 ≠ 0) :
    HasDerivAt (fun x => x + log |x - 1| - log |x + 1| + C) ((x ^ 2 + 1) / (x ^ 2 - 1)) x := by
  obtain ⟨e1, e2⟩ := deljenje x h1 h2
  rw [e1, e2]
  exact ((((hasDerivAt_id' x).add (d_log_sub 1 x h1)).sub (d_log_add 1 x h2)).add_const C).congr_deriv
    (by odv)

/-- Predpostavke trditve `integral_deljenje` se dajo izpolniti (x = 2). -/
example : (2 : ℝ) - 1 ≠ 0 ∧ (2 : ℝ) + 1 ≠ 0 := by norm_num

/-- Predpostavke trditve `integral_deljenje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2 : ℝ) - 1 ≠ 0 ∧ (2 : ℝ) + 1 ≠ 0 := by norm_num
  integral_deljenje (h1 := w.1) (h2 := w.2)

/-- Primer 1 (in vrstici za x sin x): u = x, v = −cos x; ∫ x sin x dx = −x cos x + ∫ cos x dx =
−x cos x + sin x + C; preizkus (−x cos x + sin x)' = −cos x + x sin x + cos x = x sin x.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#primer1
besedilo: »Preizkus: $(-x \cos x + \sin x)' = -\cos x + x \sin x + \cos x = x \sin x$.« -/
theorem primer1 (C x : ℝ) :
    HasDerivAt (fun x => -x * cos x + sin x + C) (-cos x + x * sin x + cos x) x ∧
      -cos x + x * sin x + cos x = x * sin x := by
  refine ⟨?_, by ring⟩
  exact ((((hasDerivAt_id' x).neg.mul (hasDerivAt_cos x)).add (hasDerivAt_sin x)).add_const C).congr_deriv
    (by odv)

/-- Primer 1, korak 2: (−cos x)' = sin x.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#primer1-v
besedilo: »$(-\cos x)' = \sin x$« -/
theorem primer1_v (x : ℝ) : HasDerivAt (fun x => -cos x) (sin x) x := by
  exact (hasDerivAt_cos x).neg.congr_deriv (by simp)

/-- Primer 2, korak 2: x² + x − 2 = (x − 1)(x + 2); preizkus 1 + 1 − 2 = 0 in 4 − 2 − 2 = 0.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#primer2-razcep
besedilo: »Razcep imenovalca: $x^2 + x - 2 = (x - 1)(x + 2)$, ker sta ničli $1$ in $-2$ (preizkus: $1 + 1 - 2 = 0$ in $4 - 2 - 2 = 0$).« -/
theorem primer2_razcep (x : ℝ) : x ^ 2 + x - 2 = (x - 1) * (x + 2) ∧ (1:ℝ) + 1 - 2 = 0 ∧
    (4:ℝ) - 2 - 2 = 0 := ⟨by ring, by norm_num, by norm_num⟩

/-- Primer 2, koraka 3–4: x + 5 = A(x + 2) + B(x − 1) za vsak x natanko pri A = 2, B = −1
(pri x = 1: 6 = 3A, pri x = −2: 3 = −3B).
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#primer2-ab
besedilo: »Pri $x = 1$: $6 = 3A$, torej $A = 2$. Pri $x = -2$: $3 = -3B$, torej $B = -1$.« -/
theorem primer2_AB (A B : ℝ) : (∀ x : ℝ, x + 5 = A * (x + 2) + B * (x - 1)) ↔ A = 2 ∧ B = -1 := by
  constructor
  · intro h
    have h1 := h 1
    have h2 := h (-2)
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩ x; ring

/-- Primer 2 (in vrstica `enako`): (x + 5)/(x² + x − 2) = 2/(x − 1) − 1/(x + 2) za x ≠ 1, −2; korak 6:
2(x + 2) − (x − 1) = x + 5.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#primer2-ulomki
besedilo: »$\int \frac{x + 5}{x^2 + x - 2}\,dx = 2\ln\lvert x - 1\rvert - \ln\lvert x + 2\rvert + C$« -/
theorem primer2_ulomki (x : ℝ) (h1 : x - 1 ≠ 0) (h2 : x + 2 ≠ 0) :
    (x + 5) / (x ^ 2 + x - 2) = 2 / (x - 1) - 1 / (x + 2) ∧ 2 * (x + 2) - (x - 1) = x + 5 := by
  have h : x ^ 2 + x - 2 ≠ 0 := by
    rw [(primer2_razcep x).1]; exact mul_ne_zero h1 h2
  constructor
  · rw [(primer2_razcep x).1]; field_simp; ring
  · ring

/-- Predpostavke trditve `primer2_ulomki` se dajo izpolniti (x = 3). -/
example : (3 : ℝ) - 1 ≠ 0 ∧ (3 : ℝ) + 2 ≠ 0 := by norm_num

/-- Predpostavke trditve `primer2_ulomki` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (3 : ℝ) - 1 ≠ 0 ∧ (3 : ℝ) + 2 ≠ 0 := by norm_num
  primer2_ulomki (h1 := w.1) (h2 := w.2)

/-- Primer 2, odgovor (in vrstica `odvod`): ∫ (x + 5)/(x² + x − 2) dx = 2 ln|x − 1| − ln|x + 2| + C.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#primer2
besedilo: »Odgovor: $\int \frac{x + 5}{x^2 + x - 2}\,dx = 2\ln\lvert x - 1\rvert - \ln\lvert x + 2\rvert + C$.« -/
theorem primer2 (C x : ℝ) (h1 : x - 1 ≠ 0) (h2 : x + 2 ≠ 0) :
    HasDerivAt (fun x => 2 * log |x - 1| - log |x + 2| + C) ((x + 5) / (x ^ 2 + x - 2)) x := by
  rw [(primer2_ulomki x h1 h2).1]
  exact ((((d_log_sub 1 x h1).const_mul (2:ℝ)).sub (d_log_add 2 x h2)).add_const C).congr_deriv
    (by odv)

/-- Predpostavke trditve `primer2` se dajo izpolniti (x = 3). -/
example : (3 : ℝ) - 1 ≠ 0 ∧ (3 : ℝ) + 2 ≠ 0 := by norm_num

/-- Predpostavke trditve `primer2` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (3 : ℝ) - 1 ≠ 0 ∧ (3 : ℝ) + 2 ≠ 0 := by norm_num
  primer2 (h1 := w.1) (h2 := w.2)

/-- Primer 3, koraka 1–2 (in vrstica `enako: 1/(1-s^2)`): 1 − s² = (1 − s)(1 + s); 1 = A(1 + s) + B(1 − s)
za vsak s natanko pri A = B = 1/2; 1/(1 − s²) = (1/2)/(1 − s) + (1/2)/(1 + s) za s ≠ ±1.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#primer3-razcep
besedilo: »Nastavek pomnožimo z imenovalcem: $1 = A(1 + s) + B(1 - s)$. Pri $s = 1$: $A = \frac{1}{2}$; pri $s = -1$: $B = \frac{1}{2}$.« -/
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

/-- Primer 3, korak 3: −½ ln|1 − s| + ½ ln|1 + s| = ½ ln|(1 + s)/(1 − s)| za s ≠ ±1.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#primer3-zdruzi
besedilo: »Nastavek pomnožimo z imenovalcem: $1 = A(1 + s) + B(1 - s)$. Pri $s = 1$: $A = \frac{1}{2}$; pri $s = -1$: $B = \frac{1}{2}$.« -/
theorem primer3_zdruzi (s : ℝ) (h1 : 1 - s ≠ 0) (h2 : 1 + s ≠ 0) :
    -(1 / 2) * log |1 - s| + 1 / 2 * log |1 + s| = 1 / 2 * log |(1 + s) / (1 - s)| := by
  rw [abs_div, log_div (abs_ne_zero.mpr h2) (abs_ne_zero.mpr h1)]; ring

/-- Predpostavke trditve `primer3_zdruzi` se dajo izpolniti (s = 0). -/
example : (1 : ℝ) - 0 ≠ 0 ∧ (1 : ℝ) + 0 ≠ 0 := by norm_num

/-- Predpostavke trditve `primer3_zdruzi` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ) - 0 ≠ 0 ∧ (1 : ℝ) + 0 ≠ 0 := by norm_num
  primer3_zdruzi (h1 := w.1) (h2 := w.2)

/-- Primer 3, korak 3 (in vrstica `odvod: (1/2)*ln((1+s)/(1-s))`): F(s) = ½ ln|(1 + s)/(1 − s)| + C
je primitivna funkcija za 1/(1 − s²) (s ≠ ±1).
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#primer3-f
besedilo: »$F(s) = \frac{1}{2}\ln\left\lvert\frac{1 + s}{1 - s}\right\rvert + C$« -/
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

/-- Primer 3, korak 4: F(0) = ½ ln 1 + C = C, zato iz F(0) = 0 sledi C = 0.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#primer3-c
besedilo: »Pogoj $F(0) = 0$: $\frac{1}{2}\ln 1 + C = C$, torej $C = 0$.« -/
theorem primer3_C (C : ℝ) : 1 / 2 * log |(1 + 0) / (1 - 0)| + C = 0 ↔ C = 0 := by
  simp

/-- Enoličnost (uporabljeno pri primeru 3 in maturi 2 d)): če imata f in F na odprtem intervalu U isti
odvod in se ujemata v točki a ∈ U, sta na U enaki.
pomozno -/
theorem enolicnost_na {U : Set ℝ} (hU : IsOpen U) (hpc : IsPreconnected U) (f F g : ℝ → ℝ) (a : ℝ)
    (ha : a ∈ U) (hf : ∀ x ∈ U, HasDerivAt f (g x) x) (hF : ∀ x ∈ U, HasDerivAt F (g x) x)
    (h : f a = F a) : ∀ x ∈ U, f x = F x := by
  have hd : ∀ x ∈ U, HasDerivAt (fun x => f x - F x) 0 x := fun x hx => by
    have := (hf x hx).sub (hF x hx); rwa [sub_self] at this
  obtain ⟨C, hC⟩ := hU.exists_is_const_of_deriv_eq_zero (f := fun x => f x - F x) hpc
    (fun x hx => (hd x hx).differentiableAt.differentiableWithinAt) (fun x hx => (hd x hx).deriv)
  intro x hx
  have h1 : f x - F x = C := hC x hx
  have h2 : f a - F a = C := hC a ha
  linarith

/-- Predpostavke trditve `enolicnost_na` se dajo izpolniti (U = (0, 1), f = F = x, a = 1/2). -/
example : IsOpen (Set.Ioo (0:ℝ) 1) ∧ IsPreconnected (Set.Ioo (0:ℝ) 1) ∧ (1 / 2 : ℝ) ∈ Set.Ioo 0 1 ∧
    ∀ x ∈ Set.Ioo (0:ℝ) 1, HasDerivAt (fun x : ℝ => x) 1 x :=
  ⟨isOpen_Ioo, isPreconnected_Ioo, by norm_num, fun x _ => hasDerivAt_id' x⟩

/-- Primer 3, korak 4: vsaka funkcija F z F'(s) = 1/(1 − s²) na (−1, 1) in F(0) = 0 je tam
F(s) = ½ ln|(1 + s)/(1 − s)|.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#primer3-enolicno
besedilo: »Podatki:** $R = 10\,\mathrm{cm}$, $\varphi = 46^\circ$, $y = R \cdot F(\sin\varphi)$, $F'(s) = \frac{1}{1 - s^2}$, $F(0) = 0$« -/
theorem primer3_enolicno (F : ℝ → ℝ) (hF : ∀ s ∈ Set.Ioo (-1:ℝ) 1, HasDerivAt F (1 / (1 - s ^ 2)) s)
    (h0 : F 0 = 0) : ∀ s ∈ Set.Ioo (-1:ℝ) 1, F s = 1 / 2 * log |(1 + s) / (1 - s)| := by
  have h := enolicnost_na isOpen_Ioo isPreconnected_Ioo F
    (fun s => 1 / 2 * log |(1 + s) / (1 - s)| + 0) _ 0 (by norm_num) hF
    (fun s hs => primer3_F 0 s (by linarith [hs.2]) (by linarith [hs.1]))
    (by rw [h0]; simp)
  intro s hs; rw [h s hs, add_zero]

/-- Predpostavke trditve `primer3_enolicno` se dajo izpolniti (F iz rešitve). -/
example : (∀ s ∈ Set.Ioo (-1:ℝ) 1,
      HasDerivAt (fun s => 1 / 2 * log |(1 + s) / (1 - s)| + 0) (1 / (1 - s ^ 2)) s) ∧
    (1 / 2 * log |(1 + 0) / (1 - 0)| + 0 : ℝ) = 0 :=
  ⟨fun s hs => primer3_F 0 s (by linarith [hs.2]) (by linarith [hs.1]), by simp⟩

/-- Predpostavke trditve `primer3_enolicno` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (∀ s ∈ Set.Ioo (-1:ℝ) 1, HasDerivAt (fun s => 1 / 2 * log |(1 + s) / (1 - s)| + 0) (1 / (1 - s ^ 2)) s) ∧ (1 / 2 * log |(1 + 0) / (1 - 0)| + 0 : ℝ) = 0 :=
    ⟨fun s hs => primer3_F 0 s (by linarith [hs.2]) (by linarith [hs.1]), by simp⟩
  primer3_enolicno (hF := w.1) (h0 := w.2)

/-- Primer 3, korak 7 (in vrstica `vrednost: 10*46*pi/180`): 46° = 46π/180 ≈ 0,8029 rad, lok
10 · 46π/180 ≈ 8,03 cm.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#primer3-lok
besedilo: »Na globusu: $46^\circ = \frac{46\pi}{180} \approx 0{,}8029$, lok $= 10\,\mathrm{cm} \cdot 0{,}8029 \approx 8{,}03\,\mathrm{cm}$.« -/
theorem primer3_lok : |46 * π / 180 - 0.8029| < 0.00005 ∧ |10 * (46 * π / 180) - 8.03| < 0.005 := by
  have p1 := pi_gt_d6
  have p2 := pi_lt_d6
  constructor <;> rw [abs_lt] <;> constructor <;> linarith

/-- Primer 4 (premisli, in vrstici za x² eˣ): ∫ x² eˣ dx = x² eˣ − 2(x eˣ − eˣ) + C = (x² − 2x + 2)eˣ + C;
preizkus (2x − 2)eˣ + (x² − 2x + 2)eˣ = x² eˣ.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#primer4
besedilo: »$\int x^2\,e^x\,dx = x^2\,e^x - 2(x\,e^x - e^x) + C = (x^2 - 2x + 2)\,e^x + C$. Preizkus: odvod je $(2x - 2)\,e^x + (x^2 - 2x + 2)\,e^x = x^2\,e^x$. Kdor pozabi oklepaj, dobi $-2e^x$ namesto $+2e^x$ in preizkus ne uspe.« -/
theorem primer4 (C x : ℝ) :
    x ^ 2 * exp x - 2 * (x * exp x - exp x) = (x ^ 2 - 2 * x + 2) * exp x ∧
      HasDerivAt (fun x => (x ^ 2 - 2 * x + 2) * exp x + C) ((2 * x - 2) * exp x + (x ^ 2 - 2 * x + 2) * exp x) x ∧
      (2 * x - 2) * exp x + (x ^ 2 - 2 * x + 2) * exp x = x ^ 2 * exp x := by
  refine ⟨by ring, ?_, by ring⟩
  exact (((((hasDerivAt_pow 2 x).sub ((hasDerivAt_id' x).const_mul (2:ℝ))).add_const 2).mul
    (hasDerivAt_exp x)).add_const C).congr_deriv (by odv)

/-- Primer 4, premisli: kdor pozabi oklepaj, dobi (x² − 2x − 2)eˣ, ki ni primitivna funkcija za x² eˣ
(pri x = 0 je njen odvod −4, ne 0).
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#primer4-brez-oklepaja
besedilo: »$\int x^2\,e^x\,dx = x^2\,e^x - 2(x\,e^x - e^x) + C = (x^2 - 2x + 2)\,e^x + C$. Preizkus: odvod je $(2x - 2)\,e^x + (x^2 - 2x + 2)\,e^x = x^2\,e^x$. Kdor pozabi oklepaj, dobi $-2e^x$ namesto $+2e^x$ in preizkus ne uspe.« -/
theorem primer4_brez_oklepaja : ¬ HasDerivAt (fun x => (x ^ 2 - 2 * x - 2) * exp x) ((0:ℝ) ^ 2 * exp 0) 0 := by
  intro h
  have h2 := ((((hasDerivAt_pow 2 (0:ℝ)).sub ((hasDerivAt_id' (0:ℝ)).const_mul (2:ℝ))).sub_const 2).mul
    (hasDerivAt_exp 0))
  have := h.unique h2
  norm_num at this

/-- Pogoste napake, »Izgubljeni minusi«: ∫ dx/(1 − x) = −ln|1 − x| + C (x ≠ 1).
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#napaka-1-minus-x
besedilo: »Izgubljeni minusi.** Pri $v' = \sin x$ je $v = -\cos x$, ne $\cos x$. Pred novim integralom je minus, ki se pri dveh korakih razširi na cel oklepaj. In $\int \frac{dx}{1 - x} = -\ln\lvert 1 - x\rvert + C$, ker je odvod notranje funkcije $1 - x$ enak $-1$.« -/
theorem napaka_1_minus_x (C x : ℝ) (h : 1 - x ≠ 0) :
    HasDerivAt (fun x => -log |1 - x| + C) (1 / (1 - x)) x :=
  ((d_log_rsub 1 x h).neg.add_const C).congr_deriv (by odv)

/-- Predpostavka trditve `napaka_1_minus_x` se da izpolniti (x = 0). -/
example : (1 : ℝ) - 0 ≠ 0 := by norm_num

/-- Predpostavke trditve `napaka_1_minus_x` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ) - 0 ≠ 0 := by norm_num
  napaka_1_minus_x (h := w)

/-- Matura, naloga 1 a) (in vrstici `integral`/`odvod`): ∫ (2x + 1)eˣ dx = (2x + 1)eˣ − 2eˣ + C =
(2x − 1)eˣ + C; preizkus 2eˣ + (2x − 1)eˣ = (2x + 1)eˣ.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#matura1a
besedilo: »a) Preizkus: $\bigl((2x - 1)\,e^x\bigr)' = 2e^x + (2x - 1)\,e^x = (2x + 1)\,e^x$.« -/
theorem matura1a (C x : ℝ) :
    (2 * x + 1) * exp x - 2 * exp x = (2 * x - 1) * exp x ∧
      HasDerivAt (fun x => (2 * x - 1) * exp x + C) (2 * exp x + (2 * x - 1) * exp x) x ∧
      2 * exp x + (2 * x - 1) * exp x = (2 * x + 1) * exp x := by
  refine ⟨by ring, ?_, by ring⟩
  exact (((((hasDerivAt_id' x).const_mul (2:ℝ)).sub_const 1).mul (hasDerivAt_exp x)).add_const C).congr_deriv
    (by odv)

/-- Matura, naloga 1 b), koraka 5–6 (in vrstica `integral: x*ln(x)`): za x > 0 je x²/2 · 1/x = x/2,
∫ x/2 dx = x²/4 + C in ∫ x ln x dx = x²/2 · ln x − x²/4 + C.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#matura1b
besedilo: »b) Ker je $\int \frac{x}{2}\,dx = \frac{x^2}{4}$, je $\int x\ln x\,dx = \frac{x^2}{2}\ln x - \frac{x^2}{4} + C$.« -/
theorem matura1b (C x : ℝ) (hx : 0 < x) :
    x ^ 2 / 2 * (1 / x) = x / 2 ∧ HasDerivAt (fun x => x ^ 2 / 4) (x / 2) x ∧
      HasDerivAt (fun x => x ^ 2 / 2 * log x - x ^ 2 / 4 + C) (x * log x) x := by
  have hx0 : x ≠ 0 := hx.ne'
  refine ⟨by field_simp, ((hasDerivAt_pow 2 x).div_const 4).congr_deriv (by odv), ?_⟩
  exact (((((hasDerivAt_pow 2 x).div_const 2).mul (hasDerivAt_log hx.ne')).sub
    ((hasDerivAt_pow 2 x).div_const 4)).add_const C).congr_deriv (by field_simp; ring)

/-- Predpostavka trditve `matura1b` se da izpolniti (x = 1). -/
example : (0 : ℝ) < 1 := one_pos

/-- Predpostavke trditve `matura1b` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 1 := one_pos
  matura1b (hx := w)

/-- Matura, naloga 2 a): x² − 2x − 3 = (x − 3)(x + 1) in imenovalec je 0 natanko pri x = −1 ali x = 3,
zato D_f = ℝ ∖ {−1, 3}.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#matura2a-df
besedilo: »a) Imenovalec razcepimo: $x^2 - 2x - 3 = (x - 3)(x + 1)$, zato je $D_f = \mathbb{R} \setminus \{-1, 3\}$.« -/
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
f(x) = 1 + (3x − 1)/(x² − 2x − 3) za x ∈ D_f.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#matura2a-deljenje
besedilo: »a) Stopnji števca in imenovalca sta enaki, zato najprej delimo: $x^2 + x - 4 = (x^2 - 2x - 3) + (3x - 1)$, torej $f(x) = 1 + \dfrac{3x - 1}{x^2 - 2x - 3}$.« -/
theorem matura2a_deljenje (x : ℝ) (h : x ^ 2 - 2 * x - 3 ≠ 0) :
    x ^ 2 + x - 4 = (x ^ 2 - 2 * x - 3) + (3 * x - 1) ∧
      (x ^ 2 + x - 4) / (x ^ 2 - 2 * x - 3) = 1 + (3 * x - 1) / (x ^ 2 - 2 * x - 3) := by
  constructor
  · ring
  · rw [one_add_div h]; congr 1; ring

/-- Predpostavka trditve `matura2a_deljenje` se da izpolniti (x = 4). -/
example : (4 : ℝ) ^ 2 - 2 * 4 - 3 ≠ 0 := by norm_num

/-- Predpostavke trditve `matura2a_deljenje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (4 : ℝ) ^ 2 - 2 * 4 - 3 ≠ 0 := by norm_num
  matura2a_deljenje (h := w)

/-- Matura, naloga 2 b), koraka 3–4: 3x − 1 = A(x + 1) + B(x − 3) za vsak x natanko pri A = 2, B = 1
(pri x = 3: 8 = 4A, pri x = −1: −4 = −4B).
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#matura2b-ab
besedilo: »b) Pri $x = 3$: $8 = 4A$, torej $A = 2$. Pri $x = -1$: $-4 = -4B$, torej $B = 1$.« -/
theorem matura2b_AB (A B : ℝ) : (∀ x : ℝ, 3 * x - 1 = A * (x + 1) + B * (x - 3)) ↔ A = 2 ∧ B = 1 := by
  constructor
  · intro h
    have h1 := h 3
    have h2 := h (-1)
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩ x; ring

/-- Matura, naloga 2 b), korak 5 (in vrstica `enako`): (3x − 1)/(x² − 2x − 3) = 2/(x − 3) + 1/(x + 1).
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#matura2b
besedilo: »$\dfrac{3x - 1}{x^2 - 2x - 3} = \dfrac{2}{x - 3} + \dfrac{1}{x + 1}$« -/
theorem matura2b (x : ℝ) (h1 : x - 3 ≠ 0) (h2 : x + 1 ≠ 0) :
    (3 * x - 1) / (x ^ 2 - 2 * x - 3) = 2 / (x - 3) + 1 / (x + 1) := by
  rw [(matura2a_Df x).1]; field_simp; ring

/-- Predpostavke trditve `matura2b` se dajo izpolniti (x = 4). -/
example : (4 : ℝ) - 3 ≠ 0 ∧ (4 : ℝ) + 1 ≠ 0 := by norm_num

/-- Predpostavke trditve `matura2b` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (4 : ℝ) - 3 ≠ 0 ∧ (4 : ℝ) + 1 ≠ 0 := by norm_num
  matura2b (h1 := w.1) (h2 := w.2)

/-- Matura, naloga 2 c) (in vrstica `integral`): ∫ f dx = x + 2 ln|x − 3| + ln|x + 1| + C na D_f.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#matura2c
besedilo: »d) Na intervalu $(3, \infty)$ sta $x - 3$ in $x + 1$ pozitivna, zato je $G(x) = x + 2\ln(x - 3) + \ln(x + 1) + C$.« -/
theorem matura2c (C x : ℝ) (h1 : x - 3 ≠ 0) (h2 : x + 1 ≠ 0) :
    HasDerivAt (fun x => x + 2 * log |x - 3| + log |x + 1| + C)
      ((x ^ 2 + x - 4) / (x ^ 2 - 2 * x - 3)) x := by
  have h : x ^ 2 - 2 * x - 3 ≠ 0 := by rw [(matura2a_Df x).1]; exact mul_ne_zero h1 h2
  rw [(matura2a_deljenje x h).2, matura2b x h1 h2]
  exact ((((hasDerivAt_id' x).add ((d_log_sub 3 x h1).const_mul (2:ℝ))).add (d_log_add 1 x h2)).add_const
    C).congr_deriv (by odv)

/-- Predpostavke trditve `matura2c` se dajo izpolniti (x = 4). -/
example : (4 : ℝ) - 3 ≠ 0 ∧ (4 : ℝ) + 1 ≠ 0 := by norm_num

/-- Predpostavke trditve `matura2c` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (4 : ℝ) - 3 ≠ 0 ∧ (4 : ℝ) + 1 ≠ 0 := by norm_num
  matura2c (h1 := w.1) (h2 := w.2)

/-- Matura, naloga 2 d) (in vrstica `vrednost`): na (3, ∞) je G(x) = x + 2 ln(x − 3) + ln(x + 1) − ln 5
primitivna funkcija za f; G(4) = 4 + 2 ln 1 + ln 5 + C = 4 + ln 5 + C, iz G(4) = 4 sledi C = −ln 5.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#matura2d
besedilo: »d) $G(4) = 4 + 2\ln 1 + \ln 5 + C = 4 + \ln 5 + C$; iz $G(4) = 4$ sledi $C = -\ln 5$.« -/
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

/-- Matura, naloga 2 d): vsaka funkcija G z G' = f na (3, ∞) in G(4) = 4 je tam
G(x) = x + 2 ln(x − 3) + ln(x + 1) − ln 5.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#matura2d-enolicno
besedilo: »$G(x) = x + 2\ln(x - 3) + \ln(x + 1) - \ln 5$« -/
theorem matura2d_enolicno (G : ℝ → ℝ)
    (hG : ∀ x ∈ Set.Ioi (3:ℝ), HasDerivAt G ((x ^ 2 + x - 4) / (x ^ 2 - 2 * x - 3)) x) (h4 : G 4 = 4) :
    ∀ x ∈ Set.Ioi (3:ℝ), G x = x + 2 * log (x - 3) + log (x + 1) - log 5 :=
  enolicnost_na isOpen_Ioi isPreconnected_Ioi G _ _ 4 (by norm_num) hG
    (fun x hx => matura2d.1 x hx) (by rw [h4, matura2d.2.2.2])

/-- Predpostavke trditve `matura2d_enolicno` se dajo izpolniti (G iz rešitve). -/
example : (∀ x ∈ Set.Ioi (3:ℝ), HasDerivAt (fun x => x + 2 * log (x - 3) + log (x + 1) - log 5)
      ((x ^ 2 + x - 4) / (x ^ 2 - 2 * x - 3)) x) ∧
    (4:ℝ) + 2 * log (4 - 3) + log (4 + 1) - log 5 = 4 :=
  ⟨fun x hx => matura2d.1 x hx, matura2d.2.2.2⟩

/-- Predpostavke trditve `matura2d_enolicno` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (∀ x ∈ Set.Ioi (3:ℝ), HasDerivAt (fun x => x + 2 * log (x - 3) + log (x + 1) - log 5) ((x ^ 2 + x - 4) / (x ^ 2 - 2 * x - 3)) x) ∧ (4:ℝ) + 2 * log (4 - 3) + log (4 + 1) - log 5 = 4 :=
    ⟨fun x hx => matura2d.1 x hx, matura2d.2.2.2⟩
  matura2d_enolicno (hG := w.1) (h4 := w.2)

/-- Ustno vprašanje 2 (in vrstici `enako`/`integral`): 1 = A(x + 1) + Bx za vsak x natanko pri A = 1,
B = −1; 1/(x(x + 1)) = 1/x − 1/(x + 1) in ∫ dx/(x(x + 1)) = ln|x| − ln|x + 1| + C.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#ustno2
besedilo: »Pri $\frac{1}{x(x + 1)}$ dobimo $1 = A(x + 1) + Bx$, torej $A = 1$ in $B = -1$.« -/
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
f(1) = e ≈ 2,718.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#stevilke-naklon
besedilo: »Trdimo, da je $F(x) = (x - 1)\,e^x$ primitivna funkcija za $f(x) = x\,e^x$. Potem mora biti naklon $F$ pri $x = 1$ enak $f(1) = e \approx 2{,}718$.« -/
theorem stevilke_naklon : HasDerivAt (fun x => (x - 1) * exp x) (1 * exp 1) 1 ∧
    |exp 1 - 2.718| < 0.0005 := by
  refine ⟨(((hasDerivAt_id' (1:ℝ)).sub_const 1).mul (hasDerivAt_exp 1)).congr_deriv (by odv), ?_⟩
  have := exp_one_gt_d9
  have := exp_one_lt_d9
  rw [abs_lt]; constructor <;> linarith

/-- Drugače, s številkami, koraka 2–3: F(1,01) = 0,01 · e^1,01 ≈ 0,02746, F(0,99) = −0,01 · e^0,99 ≈
−0,02691 in naklon sekante (0,02746 + 0,02691)/0,02 ≈ 2,72.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#stevilke-sekanta
besedilo: »Izračunamo $F$ malo levo in desno: $F(1{,}01) = 0{,}01 \cdot e^{1{,}01} \approx 0{,}02746$, $F(0{,}99) = -0{,}01 \cdot e^{0{,}99} \approx -0{,}02691$.« -/
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
2/(3 − 1) − 1/(3 + 2) = 1 − 0,2 = 0,8.
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#stevilke-razcep
besedilo: »Razcep iz Primera 2 preverimo pri $x = 3$. Levo: $\frac{3 + 5}{9 + 3 - 2} = \frac{8}{10} = 0{,}8$.« -/
theorem stevilke_razcep : ((3:ℝ) + 5) / (9 + 3 - 2) = 8 / 10 ∧ (8 / 10 : ℝ) = 0.8 ∧
    2 / ((3:ℝ) - 1) - 1 / (3 + 2) = 1 - 0.2 ∧ (1 : ℝ) - 0.2 = 0.8 := by norm_num

/-- Preveri se, vprašanje 2 (in vrstica `integral: 2*x*exp(x^2)`): ∫ 2x e^{x²} dx = e^{x²} + C
(nova spremenljivka t = x²).
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#kviz2
besedilo: »Pri $\int 2x\,e^{x^2}\,dx$ je $2x$ odvod notranje funkcije $x^2$. S $t = x^2$, $dt = 2x\,dx$ dobiš $\int e^t\,dt = e^{x^2} + C$.« -/
theorem kviz2 (C x : ℝ) : HasDerivAt (fun x => exp (x ^ 2) + C) (2 * x * exp (x ^ 2)) x :=
  (((hasDerivAt_pow 2 x).exp).add_const C).congr_deriv (by odv)

/-- Preveri se, vprašanje 3 (in vrstica `enako`): 3x + 1 = A(x + 1) + B(x − 1) za vsak x natanko pri
A = 2 (in B = 1); torej (3x + 1)/((x − 1)(x + 1)) = 2/(x − 1) + 1/(x + 1).
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#kviz3
besedilo: »Pomnožimo z imenovalcem: $3x + 1 = A(x + 1) + B(x - 1)$. Pri $x = 1$ je $4 = 2A$, torej $A = 2$ (in pri $x = -1$ je $B = 1$).« -/
theorem kviz3 (A B : ℝ) : ((∀ x : ℝ, 3 * x + 1 = A * (x + 1) + B * (x - 1)) ↔ A = 2 ∧ B = 1) ∧
    ∀ x : ℝ, x - 1 ≠ 0 → x + 1 ≠ 0 → (3 * x + 1) / ((x - 1) * (x + 1)) = 2 / (x - 1) + 1 / (x + 1) := by
  refine ⟨⟨fun h => ?_, ?_⟩, fun x h1 h2 => by field_simp; ring⟩
  · have e1 := h 1
    have e2 := h (-1)
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩ x; ring

/-- Preveri se, vprašanje 5: koraka 1 in 2 sta pravilna, korak 3 ne (ln|1 − x| ni primitivna funkcija
za 1/(1 − x): pri x = 0 je njen odvod −1, ne 1); pravilni rezultat je ln|1 + x| − ln|1 − x| + C
(in vrstica `odvod: ln(1+x)-ln(1-x)`).
trditev: MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij#kviz5
besedilo: »Odvod $\ln\lvert 1 - x\rvert$ je $\frac{-1}{1 - x}$, zato je $\int \frac{dx}{1 - x} = -\ln\lvert 1 - x\rvert + C$. Pravilni rezultat je $\ln\lvert 1 + x\rvert - \ln\lvert 1 - x\rvert + C$.« -/
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

/-! ## Primeri izpolnljivosti (izrek, uporabljen na konkretnih vrednostih) -/

/-- Predpostavke trditve `primer3_razcep` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  (primer3_razcep 0 0).2 0 (by norm_num) (by norm_num)

/-- Predpostavke trditve `ustno2` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  (ustno2 0 0).2 0 1 (by norm_num) (by norm_num)

/-- Predpostavke trditve `kviz3` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  (kviz3 0 0).2 0 (by norm_num) (by norm_num)

/-- Predpostavke trditve `kviz5` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  kviz5.2.2.2 0 0 (by norm_num) (by norm_num)

end Evklid.Lekcije.MAT_SS_4.IntegracijaPerPartesInRacionalnihFunkcij
