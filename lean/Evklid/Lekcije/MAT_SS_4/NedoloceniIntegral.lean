/-
vir: content/lessons/MAT-SS-4/nedoloceni-integral.md
sha256: f325620a1940e71709eac1bac095dade8fef02d0017d3ad87e17542d5be5e858
Ni v Leanu: zgodbe v uvodu razen računa fade-ina in bobnarja; risba premaknjenih parabol in simulacija
»Nedoločeni integral: družina funkcij« (dokazan je le naklon tangent); zapis ∫ f(x) dx = F(x) + C kot
množica funkcij (dokazano je, da je vsaka F + C primitivna funkcija in da se dve primitivni funkciji na
intervalu razlikujeta za konstanto); »Drugače: Z analogijo« (melodija, ni matematična trditev);
Preveri se, vprašanje 1 (pomen konstante C pri glasnosti) in vprašanje 2 (vrstni red korakov postopka),
ker nista matematični trditvi; pri napačnih odgovorih kviza ni dokazano, da so napačni (razen kjer to
lekcija posebej trdi v »Pogoste napake«); točkovanje maturitetnih nalog.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.NedoloceniIntegral

open Real

/-- Razlaga, tabela »Nazaj od odvoda«: odvod 8x je 8.
trditev: MAT-SS-4/nedoloceni-integral#tabela-8
besedilo: »| $8$ | $8x$ | $8$ ✓ |« -/
theorem tabela_8 (x : ℝ) : HasDerivAt (fun x : ℝ => 8 * x) 8 x := by
  simpa using (hasDerivAt_id' x).const_mul (8 : ℝ)

/-- Razlaga, tabela »Nazaj od odvoda«: odvod x² je 2x.
trditev: MAT-SS-4/nedoloceni-integral#tabela-x2
besedilo: »| $2x$ | $x^2$ | $2x$ ✓ |« -/
theorem tabela_x2 (x : ℝ) : HasDerivAt (fun x : ℝ => x ^ 2) (2 * x) x := by
  simpa using hasDerivAt_pow 2 x

/-- Razlaga, tabela »Nazaj od odvoda«: odvod x³ je 3x².
trditev: MAT-SS-4/nedoloceni-integral#tabela-x3
besedilo: »| $3x^2$ | $x^3$ | $3x^2$ ✓ |« -/
theorem tabela_x3 (x : ℝ) : HasDerivAt (fun x : ℝ => x ^ 3) (3 * x ^ 2) x := by
  simpa using hasDerivAt_pow 3 x

/-- Razlaga, tabela »Nazaj od odvoda«: odvod sin x je cos x.
trditev: MAT-SS-4/nedoloceni-integral#tabela-sin
besedilo: »| $\cos x$ | $\sin x$ | $\cos x$ ✓ |« -/
theorem tabela_sin (x : ℝ) : HasDerivAt sin (cos x) x := hasDerivAt_sin x

/-- Razlaga: tudi x² + 5 in x² − 3 imata odvod 2x (konstanta se pri odvajanju izgubi).
trditev: MAT-SS-4/nedoloceni-integral#x2-plus-5-minus-3
besedilo: »Vendar $x^2 + 5$ in $x^2 - 3$ imata tudi odvod $2x$, saj se konstanta pri odvajanju izgubi.« -/
theorem x2_plus_5_minus_3 (x : ℝ) :
    HasDerivAt (fun x : ℝ => x ^ 2 + 5) (2 * x) x ∧ HasDerivAt (fun x : ℝ => x ^ 2 - 3) (2 * x) x :=
  ⟨(tabela_x2 x).add_const 5, (tabela_x2 x).sub_const 3⟩

/-- Razlaga, »Premaknjene parabole« in prvi »Premisli«: vsaka parabola y = x² + C ima pri x = 1
tangento s smernim koeficientom 2, ne glede na C (C premakne graf, ne nagne ga).
trditev: MAT-SS-4/nedoloceni-integral#tangenta-pri-1
besedilo: »Premaknjene parabole.** Nariši parabole $y = x^2$, $y = x^2 + 1$, $y = x^2 + 2$ in $y = x^2 - 1$.« -/
theorem tangenta_pri_1 (C : ℝ) : HasDerivAt (fun x : ℝ => x ^ 2 + C) 2 1 := by
  simpa using (tabela_x2 1).add_const C

/-- Razlaga, »Simboli«: če je F primitivna funkcija za f, je tudi F + C primitivna funkcija za f za
vsako realno število C (družina F(x) + C).
trditev: MAT-SS-4/nedoloceni-integral#primitivna-plus-c
besedilo: »Simboli.** Funkcija $F$ je **primitivna funkcija** funkcije $f$, če je $F'(x) = f(x)$. Družino vseh primitivnih funkcij imenujemo **nedoločeni integral** in pišemo« -/
theorem primitivna_plus_C (F f : ℝ → ℝ) (C x : ℝ) (h : HasDerivAt F (f x) x) :
    HasDerivAt (fun x => F x + C) (f x) x := h.add_const C

/-- Predpostavka trditve `primitivna_plus_C` se da izpolniti (F = x², f = 2x). -/
example : HasDerivAt (fun x : ℝ => x ^ 2) (2 * 1) 1 := tabela_x2 1

/-- Ustno vprašanje 1: dve primitivni funkciji iste funkcije se na (odprtem) intervalu razlikujeta
le za konstanto.
trditev: MAT-SS-4/nedoloceni-integral#primitivni-razlika-konstanta
besedilo: »Dve primitivni funkciji iste funkcije se na intervalu razlikujeta le za konstanto.« -/
theorem primitivni_razlika_konstanta (F G f : ℝ → ℝ) (a b : ℝ)
    (hF : ∀ x ∈ Set.Ioo a b, HasDerivAt F (f x) x) (hG : ∀ x ∈ Set.Ioo a b, HasDerivAt G (f x) x) :
    ∃ C, ∀ x ∈ Set.Ioo a b, G x = F x + C := by
  have hd : ∀ x ∈ Set.Ioo a b, HasDerivAt (fun x => G x - F x) 0 x := fun x hx => by
    have := (hG x hx).sub (hF x hx); rwa [sub_self] at this
  obtain ⟨C, hC⟩ := IsOpen.exists_is_const_of_deriv_eq_zero (f := fun x => G x - F x) isOpen_Ioo
    isPreconnected_Ioo (fun x hx => (hd x hx).differentiableAt.differentiableWithinAt)
    (fun x hx => (hd x hx).deriv)
  exact ⟨C, fun x hx => by linarith [show G x - F x = C from hC x hx]⟩

/-- Predpostavke trditve `primitivni_razlika_konstanta` se dajo izpolniti (F = x², G = x² + 5). -/
example : (∀ x ∈ Set.Ioo (0:ℝ) 1, HasDerivAt (fun x : ℝ => x ^ 2) (2 * x) x) ∧
    (∀ x ∈ Set.Ioo (0:ℝ) 1, HasDerivAt (fun x : ℝ => x ^ 2 + 5) (2 * x) x) :=
  ⟨fun x _ => tabela_x2 x, fun x _ => (x2_plus_5_minus_3 x).1⟩

/-- Uvod (fade-in): z −40 dB in 8 dB na sekundo je glasnost po 5 sekundah 0 dB.
trditev: MAT-SS-4/nedoloceni-integral#fade-in
besedilo: »Če je začel pri $-40\,\mathrm{dB}$, je po $5$ sekundah pri $0\,\mathrm{dB}$.« -/
theorem fade_in : (-40 : ℝ) + 8 * 5 = 0 := by norm_num

/-- Razlaga, bobnar iz uvoda: N(t) = 60t + 6t² + C ima odvod 60 + 12t.
trditev: MAT-SS-4/nedoloceni-integral#bobnar-odvod
besedilo: »Bobnar iz uvoda: število udarcev $N(t)$ ima odvod $60 + 12t$, zato je $N(t) = 60t + 6t^2 + C$ (preverba: odvod $6t^2$ je $12t$).« -/
theorem bobnar_odvod (C t : ℝ) : HasDerivAt (fun t : ℝ => 60 * t + 6 * t ^ 2 + C) (60 + 12 * t) t := by
  have := (((hasDerivAt_id' t).const_mul (60:ℝ)).add ((hasDerivAt_pow 2 t).const_mul (6:ℝ))).add_const C
  convert this using 1; simp; ring

/-- Razlaga, bobnar: iz N(0) = 0 sledi C = 0.
trditev: MAT-SS-4/nedoloceni-integral#bobnar-c
besedilo: »Bobnar iz uvoda: število udarcev $N(t)$ ima odvod $60 + 12t$, zato je $N(t) = 60t + 6t^2 + C$ (preverba: odvod $6t^2$ je $12t$). Ob začetku ni odigral še nič, $N(0) = 0$, zato $C = 0$. Po dveh minutah: $N(2) = 120 + 24 = 144$ udarcev.« -/
theorem bobnar_C (C : ℝ) : 60 * 0 + 6 * 0 ^ 2 + C = 0 ↔ C = 0 := by
  constructor <;> intro h <;> simp_all

/-- Razlaga, bobnar: po dveh minutah N(2) = 120 + 24 = 144 udarcev.
trditev: MAT-SS-4/nedoloceni-integral#bobnar-n2
besedilo: »Bobnar iz uvoda: število udarcev $N(t)$ ima odvod $60 + 12t$, zato je $N(t) = 60t + 6t^2 + C$ (preverba: odvod $6t^2$ je $12t$). Ob začetku ni odigral še nič, $N(0) = 0$, zato $C = 0$. Po dveh minutah: $N(2) = 120 + 24 = 144$ udarcev.« -/
theorem bobnar_N2 : (60 : ℝ) * 2 + 6 * 2 ^ 2 + 0 = 144 := by
  calc (60 : ℝ) * 2 + 6 * 2 ^ 2 + 0 = 120 + 24 := by norm_num
    _ = 144 := by norm_num

/-- Enoličnost (uporabljeno pri bobnarju, primeru 3, maturi 3 b) in kvizu 5): če imata f in F na ℝ isti
odvod in se ujemata v eni točki a, sta enaki povsod.
pomozno -/
theorem enolicnost (f F g : ℝ → ℝ) (a : ℝ) (hf : ∀ x, HasDerivAt f (g x) x)
    (hF : ∀ x, HasDerivAt F (g x) x) (ha : f a = F a) : ∀ x, f x = F x := by
  have hd : ∀ x, HasDerivAt (fun x => f x - F x) 0 x := fun x => by
    have := (hf x).sub (hF x); rwa [sub_self] at this
  have hc := is_const_of_deriv_eq_zero (f := fun x => f x - F x)
    (fun x => (hd x).differentiableAt) (fun x => (hd x).deriv)
  intro x
  have : f x - F x = f a - F a := hc x a
  linarith

/-- Predpostavke trditve `enolicnost` se dajo izpolniti (f = F = x², a = 0). -/
example : (∀ x : ℝ, HasDerivAt (fun x : ℝ => x ^ 2) (2 * x) x) ∧ ((0:ℝ) ^ 2 = 0 ^ 2) :=
  ⟨tabela_x2, rfl⟩

/-- Razlaga, bobnar: vsaka funkcija N z N'(t) = 60 + 12t in N(0) = 0 je N(t) = 60t + 6t², zato
N(2) = 144.
trditev: MAT-SS-4/nedoloceni-integral#bobnar-enolicno
besedilo: »Bobnar iz uvoda: število udarcev $N(t)$ ima odvod $60 + 12t$, zato je $N(t) = 60t + 6t^2 + C$ (preverba: odvod $6t^2$ je $12t$). Ob začetku ni odigral še nič, $N(0) = 0$, zato $C = 0$. Po dveh minutah: $N(2) = 120 + 24 = 144$ udarcev.« -/
theorem bobnar_enolicno (N : ℝ → ℝ) (hN : ∀ t, HasDerivAt N (60 + 12 * t) t) (h0 : N 0 = 0) :
    (∀ t, N t = 60 * t + 6 * t ^ 2 + 0) ∧ N 2 = 144 := by
  have h := enolicnost N _ _ 0 hN (bobnar_odvod 0) (by rw [h0]; norm_num)
  exact ⟨h, by rw [h 2, bobnar_N2]⟩

/-- Predpostavke trditve `bobnar_enolicno` se dajo izpolniti (N(t) = 60t + 6t²). -/
example : (∀ t : ℝ, HasDerivAt (fun t : ℝ => 60 * t + 6 * t ^ 2 + 0) (60 + 12 * t) t) ∧
    ((60:ℝ) * 0 + 6 * 0 ^ 2 + 0 = 0) := ⟨bobnar_odvod 0, by norm_num⟩

/-- Osnovni integrali, potenca: za naravni n je odvod x^(n+1)/(n+1) enak xⁿ.
trditev: MAT-SS-4/nedoloceni-integral#potenca-nat
besedilo: »$$\int x^n\,dx = \frac{x^{n+1}}{n+1} + C$$« -/
theorem potenca_nat (n : ℕ) (x : ℝ) :
    HasDerivAt (fun x : ℝ => x ^ (n + 1) / (n + 1)) (x ^ n) x := by
  have := (hasDerivAt_pow (n + 1) x).div_const ((n:ℝ) + 1)
  convert this using 1
  field_simp; push_cast; ring

/-- Osnovni integrali, potenca s celim eksponentom: za n ≠ −1 in x ≠ 0 je odvod x^(n+1)/(n+1)
enak xⁿ (npr. 3/x² = 3x⁻² v maturitetni nalogi 1).
trditev: MAT-SS-4/nedoloceni-integral#potenca-cela
besedilo: »Prvi člen zapišemo kot potenco, $\dfrac{3}{x^2} = 3x^{-2}$, zato je $\int 3x^{-2}\,dx = 3 \cdot \dfrac{x^{-1}}{-1} = -\dfrac{3}{x}$.« -/
theorem potenca_cela (n : ℤ) (hn : n ≠ -1) (x : ℝ) (hx : x ≠ 0) :
    HasDerivAt (fun x : ℝ => x ^ (n + 1) / (n + 1)) (x ^ n) x := by
  have hn' : ((n:ℝ) + 1) ≠ 0 := by
    intro h; apply hn; exact_mod_cast (by linarith : (n:ℝ) = -1)
  have := (hasDerivAt_zpow (n + 1) x (Or.inl hx)).div_const ((n:ℝ) + 1)
  convert this using 1
  push_cast; field_simp; simp

/-- Predpostavke trditve `potenca_cela` se dajo izpolniti (n = −2, x = 1). -/
example : (-2 : ℤ) ≠ -1 ∧ (1 : ℝ) ≠ 0 := by norm_num

/-- Osnovni integrali, formula ∫ xⁿ dx = x^(n+1)/(n+1) + C za realni eksponent n ≠ −1 in x > 0
(uporabljeno pri √x = x^(1/2) v primeru 2).
trditev: MAT-SS-4/nedoloceni-integral#potenca-realna
besedilo: »| $x^n$ | $\dfrac{x^{n+1}}{n+1} + C$ | $n \ne -1$ |« -/
theorem potenca_realna (n : ℝ) (hn : n ≠ -1) (C x : ℝ) (hx : 0 < x) :
    HasDerivAt (fun x : ℝ => x ^ (n + 1) / (n + 1) + C) (x ^ n) x := by
  have hn' : n + 1 ≠ 0 := fun h => hn (by linarith)
  have := ((hasDerivAt_rpow_const (p := n + 1) (Or.inl hx.ne')).div_const (n + 1)).add_const C
  convert this using 1
  rw [add_sub_cancel_right]; field_simp

/-- Predpostavke trditve `potenca_realna` se dajo izpolniti (n = 1/2, x = 1). -/
example : (1 / 2 : ℝ) ≠ -1 ∧ (0 : ℝ) < 1 := by norm_num

/-- Premisli »Zakaj pravilo za potence ne velja za n = −1?«: pri n = −1 je imenovalec n + 1 = 0.
trditev: MAT-SS-4/nedoloceni-integral#n-minus-1
besedilo: »Zakaj pravilo za potence ne velja za $n = -1$?« -/
theorem n_minus_1 : (-1 : ℝ) + 1 = 0 := by norm_num

/-- Osnovni integrali: ∫ 1/x dx = ln|x| + C za x ≠ 0.
trditev: MAT-SS-4/nedoloceni-integral#integral-1-x
besedilo: »| $\dfrac{1}{x}$ | $\ln\lvert x\rvert + C$ | $x \ne 0$ |« -/
theorem integral_1_x (C x : ℝ) (hx : x ≠ 0) : HasDerivAt (fun x : ℝ => log |x| + C) (1 / x) x := by
  simpa using (hasDerivAt_log hx).add_const C

/-- Predpostavka trditve `integral_1_x` se da izpolniti (x = 1). -/
example : (1 : ℝ) ≠ 0 := one_ne_zero

/-- Razlaga: za x < 0 je po verižnem pravilu (ln(−x))' = 1/(−x) · (−1) = 1/x.
trditev: MAT-SS-4/nedoloceni-integral#ln-minus-x
besedilo: »Absolutna vrednost poskrbi še za $x < 0$: tam je po verižnem pravilu $\bigl(\ln(-x)\bigr)' = \frac{1}{-x} \cdot (-1) = \frac{1}{x}$.« -/
theorem ln_minus_x (x : ℝ) (hx : x < 0) :
    HasDerivAt (fun x : ℝ => log (-x)) (1 / (-x) * (-1)) x ∧ 1 / (-x) * (-1) = 1 / x := by
  have hx0 : x ≠ 0 := hx.ne
  have h := ((hasDerivAt_id' x).neg).log (by simp; exact hx0)
  refine ⟨?_, by field_simp⟩
  exact h.congr_deriv (by simp only [Pi.neg_apply]; field_simp)

/-- Predpostavka trditve `ln_minus_x` se da izpolniti (x = −1). -/
example : (-1 : ℝ) < 0 := by norm_num

/-- Osnovni integrali: ∫ eˣ dx = eˣ + C.
trditev: MAT-SS-4/nedoloceni-integral#integral-exp
besedilo: »$e^x + C$« -/
theorem integral_exp (C x : ℝ) : HasDerivAt (fun x => exp x + C) (exp x) x :=
  (hasDerivAt_exp x).add_const C

/-- Osnovni integrali: ∫ cos x dx = sin x + C.
trditev: MAT-SS-4/nedoloceni-integral#integral-cos
besedilo: »| $\cos x$ | $\sin x + C$ | |« -/
theorem integral_cos (C x : ℝ) : HasDerivAt (fun x => sin x + C) (cos x) x :=
  (hasDerivAt_sin x).add_const C

/-- Osnovni integrali: ∫ sin x dx = −cos x + C.
trditev: MAT-SS-4/nedoloceni-integral#integral-sin
besedilo: »| $\sin x$ | $-\cos x + C$ | |« -/
theorem integral_sin (C x : ℝ) : HasDerivAt (fun x => -cos x + C) (sin x) x := by
  simpa using ((hasDerivAt_cos x).neg).add_const C

/-- Razlaga in ustno vprašanje 2: ∫ (a f + b g) dx = a ∫ f dx + b ∫ g dx; če je F' = f in G' = g,
je (aF + bG)' = af + bg.
trditev: MAT-SS-4/nedoloceni-integral#linearnost
besedilo: »$$\int \bigl(a f(x) + b g(x)\bigr)\,dx = a \int f(x)\,dx + b \int g(x)\,dx$$« -/
theorem linearnost (F G f g : ℝ → ℝ) (a b x : ℝ) (hF : HasDerivAt F (f x) x)
    (hG : HasDerivAt G (g x) x) :
    HasDerivAt (fun x => a * F x + b * G x) (a * f x + b * g x) x :=
  (hF.const_mul a).add (hG.const_mul b)

/-- Predpostavke trditve `linearnost` se dajo izpolniti (F = sin, G = exp). -/
example : HasDerivAt sin (cos 0) 0 ∧ HasDerivAt exp (exp 0) 0 := ⟨hasDerivAt_sin 0, hasDerivAt_exp 0⟩

/-- Razlaga, uvedba nove spremenljivke: odvod (x² + 1)⁴ je 4(x² + 1)³ · 2x.
trditev: MAT-SS-4/nedoloceni-integral#veriga-primer
besedilo: »Uvedba nove spremenljivke (višja raven).** Odvajaj $(x^2 + 1)^4$ po verižnem pravilu: dobiš $4(x^2 + 1)^3 \cdot 2x$.« -/
theorem veriga_primer (x : ℝ) :
    HasDerivAt (fun x : ℝ => (x ^ 2 + 1) ^ 4) (4 * (x ^ 2 + 1) ^ 3 * (2 * x)) x := by
  have := ((tabela_x2 x).add_const 1).pow 4
  convert this using 1

/-- Razlaga, pravilo ∫ f(g(x)) g'(x) dx = ∫ f(u) du: če je F primitivna funkcija za f (v točki g(x)),
je F ∘ g primitivna funkcija za f(g(x)) · g'(x).
trditev: MAT-SS-4/nedoloceni-integral#nova-spremenljivka
besedilo: »Simboli.** Funkcija $F$ je **primitivna funkcija** funkcije $f$, če je $F'(x) = f(x)$.« -/
theorem nova_spremenljivka (F f g g' : ℝ → ℝ) (x : ℝ) (hF : HasDerivAt F (f (g x)) (g x))
    (hg : HasDerivAt g (g' x) x) : HasDerivAt (fun x => F (g x)) (f (g x) * g' x) x :=
  hF.comp x hg

/-- Predpostavke trditve `nova_spremenljivka` se dajo izpolniti (F = sin, g = x², x = 1). -/
example : HasDerivAt sin (cos ((fun x : ℝ => x ^ 2) 1)) ((fun x : ℝ => x ^ 2) 1) ∧
    HasDerivAt (fun x : ℝ => x ^ 2) (2 * 1) 1 := ⟨hasDerivAt_sin _, tabela_x2 1⟩

/-- Razlaga: ∫ cos(kx) dx = sin(kx)/k + C za k ≠ 0 (odvod sin(kx) je k cos(kx)).
trditev: MAT-SS-4/nedoloceni-integral#integral-cos-kx
besedilo: »Najpogostejši primer je linearna notranja funkcija. Pri $u = kx$ je $du = k\,dx$, zato na primer $\int \cos(kx)\,dx = \dfrac{\sin(kx)}{k} + C$. Preverba: odvod $\sin(kx)$ je $k\cos(kx)$, deljenje s $k$ ta faktor odstrani.« -/
theorem integral_cos_kx (k C x : ℝ) (hk : k ≠ 0) :
    HasDerivAt (fun x => sin (k * x) / k + C) (cos (k * x)) x := by
  have := ((((hasDerivAt_id' x).const_mul k).sin).div_const k).add_const C
  exact this.congr_deriv (by field_simp)

/-- Predpostavka trditve `integral_cos_kx` se da izpolniti (k = 2). -/
example : (2 : ℝ) ≠ 0 := two_ne_zero

/-- Primer 1, koraki 1–3: 6 · x³/3 = 2x³, −4 · x²/2 = −2x², člen 5 da 5x.
trditev: MAT-SS-4/nedoloceni-integral#primer1-koraki
besedilo: »$\int (6x^2 - 4x + 5)\,dx = 2x^3 - 2x^2 + 5x + C$« -/
theorem primer1_koraki (x : ℝ) : 6 * (x ^ 3 / 3) - 4 * (x ^ 2 / 2) + 5 * x = 2 * x ^ 3 - 2 * x ^ 2 + 5 * x := by
  ring

/-- Primer 1, preverba in odgovor: ∫ (6x² − 4x + 5) dx = 2x³ − 2x² + 5x + C.
trditev: MAT-SS-4/nedoloceni-integral#primer1
besedilo: »Odgovor: $\int (6x^2 - 4x + 5)\,dx = 2x^3 - 2x^2 + 5x + C$.« -/
theorem primer1 (C x : ℝ) :
    HasDerivAt (fun x : ℝ => 2 * x ^ 3 - 2 * x ^ 2 + 5 * x + C) (6 * x ^ 2 - 4 * x + 5) x := by
  have := ((((hasDerivAt_pow 3 x).const_mul (2:ℝ)).sub ((hasDerivAt_pow 2 x).const_mul (2:ℝ))).add
    ((hasDerivAt_id' x).const_mul (5:ℝ))).add_const C
  convert this using 1; simp; ring

/-- Primer 2, korak 2: 4 · x^(3/2)/(3/2) = (8/3) x^(3/2) = (8/3) x√x za x > 0.
trditev: MAT-SS-4/nedoloceni-integral#primer2-korak2
besedilo: »$4 \int x^{1/2}\,dx = 4 \cdot \dfrac{x^{3/2}}{3/2} = \dfrac{8}{3}\,x^{3/2} = \dfrac{8}{3}\,x\sqrt{x}$« -/
theorem primer2_korak2 (x : ℝ) (hx : 0 < x) :
    4 * (x ^ (3 / 2 : ℝ) / (3 / 2)) = 8 / 3 * x * √x := by
  calc 4 * (x ^ (3 / 2 : ℝ) / (3 / 2)) = 8 / 3 * x ^ (3 / 2 : ℝ) := by ring
    _ = 8 / 3 * x * √x := by
        rw [show (3 / 2 : ℝ) = 1 + 1 / 2 by norm_num, rpow_add hx, rpow_one, ← sqrt_eq_rpow]; ring

/-- Predpostavka trditve `primer2_korak2` se da izpolniti (x = 1). -/
example : (0 : ℝ) < 1 := one_pos

/-- Primer 2, korak 5 (preverba): (8/3) · (3/2) x^(1/2) = 4√x.
trditev: MAT-SS-4/nedoloceni-integral#primer2-preverba
besedilo: »Preverba: $\left(\dfrac{8}{3}x^{3/2}\right)' = \dfrac{8}{3} \cdot \dfrac{3}{2}\,x^{1/2} = 4\sqrt{x}$ ✓, $(3\cos x)' = -3\sin x$ ✓.« -/
theorem primer2_preverba (x : ℝ) : 8 / 3 * (3 / 2) * x ^ (1 / 2 : ℝ) = 4 * √x := by
  rw [← sqrt_eq_rpow]; ring

/-- Primer 2, odgovor: za x > 0 je ∫ (4√x − 3 sin x + 2eˣ) dx = (8/3) x√x + 3 cos x + 2eˣ + C.
trditev: MAT-SS-4/nedoloceni-integral#primer2
besedilo: »Preverba: $\left(\dfrac{8}{3}x^{3/2}\right)' = \dfrac{8}{3} \cdot \dfrac{3}{2}\,x^{1/2} = 4\sqrt{x}$ ✓, $(3\cos x)' = -3\sin x$ ✓.« -/
theorem primer2 (C x : ℝ) (hx : 0 < x) :
    HasDerivAt (fun x : ℝ => 8 / 3 * x * √x + 3 * cos x + 2 * exp x + C)
      (4 * √x - 3 * sin x + 2 * exp x) x := by
  have hs := (hasDerivAt_id' x).sqrt hx.ne'
  have h := ((((((hasDerivAt_id' x).const_mul (8 / 3 : ℝ)).mul hs).add
    ((hasDerivAt_cos x).const_mul (3:ℝ))).add ((hasDerivAt_exp x).const_mul (2:ℝ))).add_const C)
  have h0 : √x ≠ 0 := (sqrt_pos.mpr hx).ne'
  refine h.congr_deriv ?_
  have hsq := sq_sqrt hx.le
  field_simp
  linear_combination (-8) * hsq

/-- Predpostavka trditve `primer2` se da izpolniti (x = 1). -/
example : (0 : ℝ) < 1 := one_pos

/-- Primer 3, koraki 1–4: y(t) = 2 sin(3t) + C ima odvod 6 cos(3t) (z u = 3t, du = 3 dt).
trditev: MAT-SS-4/nedoloceni-integral#primer3-odvod
besedilo: »$\int 6\cos u \cdot \dfrac{du}{3} = 2\int \cos u\,du = 2\sin u + C$« -/
theorem primer3_odvod (C t : ℝ) : HasDerivAt (fun t => 2 * sin (3 * t) + C) (6 * cos (3 * t)) t := by
  have := ((((hasDerivAt_id' t).const_mul (3:ℝ)).sin).const_mul (2:ℝ)).add_const C
  exact this.congr_deriv (by ring)

/-- Primer 3, korak 3: 6 cos u · (1/3) = 2 cos u.
trditev: MAT-SS-4/nedoloceni-integral#primer3-korak3
besedilo: »$\int 6\cos u \cdot \dfrac{du}{3} = 2\int \cos u\,du = 2\sin u + C$« -/
theorem primer3_korak3 (u : ℝ) : 6 * cos u * (1 / 3) = 2 * cos u := by ring

/-- Primer 3, korak 5: y(0) = 2 sin 0 + C = C, zato iz y(0) = 0 sledi C = 0.
trditev: MAT-SS-4/nedoloceni-integral#primer3-c
besedilo: »Začetni pogoj določi $C$: $y(0) = 2\sin 0 + C = C = 0$.« -/
theorem primer3_C (C : ℝ) : 2 * sin (3 * 0) + C = 0 ↔ C = 0 := by
  constructor <;> intro h <;> simp_all

/-- Primer 3, korak 5: vsaka funkcija y z y'(t) = 6 cos(3t) in y(0) = 0 je y(t) = 2 sin(3t).
trditev: MAT-SS-4/nedoloceni-integral#primer3-enolicno
besedilo: »Podatki:** $v(t) = 6\cos(3t)\,\mathrm{mm/s}$, $y(0) = 0\,\mathrm{mm}$, $t_1 = \dfrac{\pi}{6}\,\mathrm{s}$« -/
theorem primer3_enolicno (y : ℝ → ℝ) (hy : ∀ t, HasDerivAt y (6 * cos (3 * t)) t) (h0 : y 0 = 0) :
    ∀ t, y t = 2 * sin (3 * t) := by
  have h := enolicnost y _ _ 0 hy (primer3_odvod 0) (by rw [h0]; simp)
  intro t; rw [h t, add_zero]

/-- Predpostavke trditve `primer3_enolicno` se dajo izpolniti (y(t) = 2 sin(3t)). -/
example : (∀ t : ℝ, HasDerivAt (fun t => 2 * sin (3 * t) + 0) (6 * cos (3 * t)) t) ∧
    (2 * sin (3 * 0) + 0 : ℝ) = 0 := ⟨primer3_odvod 0, by simp⟩

/-- Primer 3, korak 6: y(π/6) = 2 sin(π/2) = 2.
trditev: MAT-SS-4/nedoloceni-integral#primer3-vrednost
besedilo: »$y\!\left(\dfrac{\pi}{6}\right) = 2\sin\dfrac{\pi}{2} = 2$« -/
theorem primer3_vrednost : 2 * sin (3 * (π / 6)) = 2 := by
  calc 2 * sin (3 * (π / 6)) = 2 * sin (π / 2) := by ring_nf
    _ = 2 := by simp

/-- Primer 3, odgovor: 2 mm je največji odmik, saj je 2 sin(3t) ≤ 2 za vsak t.
trditev: MAT-SS-4/nedoloceni-integral#primer3-najvecji
besedilo: »Odgovor: odmik je $y(t) = 2\sin(3t)\,\mathrm{mm}$; ob $t = \dfrac{\pi}{6}\,\mathrm{s}$ je struna $2\,\mathrm{mm}$ od ravnovesne lege, kar je njen največji odmik.« -/
theorem primer3_najvecji (t : ℝ) : 2 * sin (3 * t) ≤ 2 := by
  nlinarith [sin_le_one (3 * t)]

/-- Primer 4 (premisli): ∫ 3x²(x³ − 2)⁴ dx = (x³ − 2)⁵/5 + C; preverba z odvajanjem.
trditev: MAT-SS-4/nedoloceni-integral#primer4
besedilo: »$\int u^4\,du = \dfrac{u^5}{5} + C$, torej $\dfrac{(x^3 - 2)^5}{5} + C$. Preverba: odvod je $\dfrac{5(x^3 - 2)^4 \cdot 3x^2}{5} = 3x^2(x^3 - 2)^4$ ✓.« -/
theorem primer4 (C x : ℝ) :
    HasDerivAt (fun x : ℝ => (x ^ 3 - 2) ^ 5 / 5 + C) (3 * x ^ 2 * (x ^ 3 - 2) ^ 4) x := by
  have := ((((hasDerivAt_pow 3 x).sub_const 2).pow 5).div_const 5).add_const C
  convert this using 1; simp; ring

/-- Pogoste napake, »Odvajanje namesto integriranja«: ∫ x³ dx = x⁴/4 + C (odvod x⁴/4 je x³).
trditev: MAT-SS-4/nedoloceni-integral#napaka-x3
besedilo: »Odvajanje namesto integriranja.** Kdor pri $\int x^3\,dx$ napiše $3x^2$, je eksponent zmanjšal. Pri integriranju se eksponent *poveča* za $1$, nato deliš z novim eksponentom: $\dfrac{x^4}{4}$.« -/
theorem napaka_x3 (C x : ℝ) : HasDerivAt (fun x : ℝ => x ^ 4 / 4 + C) (x ^ 3) x := by
  have := ((hasDerivAt_pow 4 x).div_const 4).add_const C
  convert this using 1; norm_num

/-- Pogoste napake, »Odvajanje namesto integriranja«: 3x² ni primitivna funkcija za x³
(pri x = 1 ima odvod 6, ne 1).
trditev: MAT-SS-4/nedoloceni-integral#napaka-x3-narobe
besedilo: »Odvajanje namesto integriranja.** Kdor pri $\int x^3\,dx$ napiše $3x^2$,« -/
theorem napaka_x3_narobe : ¬ HasDerivAt (fun x : ℝ => 3 * x ^ 2) ((1:ℝ) ^ 3) 1 := by
  intro h
  have h2 : HasDerivAt (fun x : ℝ => 3 * x ^ 2) (3 * (2 * 1)) 1 := (tabela_x2 1).const_mul 3
  have := h.unique h2; norm_num at this

/-- Pogoste napake, »Minus pri sinusu«: cos x ni primitivna funkcija za sin x
(pri x = π/2 je (cos x)' = −1, sin(π/2) = 1).
trditev: MAT-SS-4/nedoloceni-integral#napaka-sinus
besedilo: »Minus pri sinusu.** $\int \sin x\,dx = \cos x$ je narobe, ker je $(\cos x)' = -\sin x$. Pravilno: $-\cos x + C$. Preverba z odvajanjem to napako takoj ujame.« -/
theorem napaka_sinus : ¬ HasDerivAt cos (sin (π / 2)) (π / 2) := by
  intro h
  have := h.unique (hasDerivAt_cos (π / 2)); simp at this; linarith

/-- Pogoste napake, »Pozabljeni faktor«: sin(3x) ni primitivna funkcija za cos(3x)
(pri x = 0 je odvod 3, ne 1); pravilno je sin(3x)/3 + C.
trditev: MAT-SS-4/nedoloceni-integral#napaka-cos3x
besedilo: »Pozabljeni faktor pri notranji funkciji (višja raven).** $\int \cos(3x)\,dx = \sin(3x) + C$ ne drži: odvod desne strani je $3\cos(3x)$. Ker je $dx = \dfrac{du}{3}$, je pravilno $\dfrac{\sin(3x)}{3} + C$.« -/
theorem napaka_cos3x :
    ¬ HasDerivAt (fun x => sin (3 * x)) (cos (3 * 0)) 0 ∧
      ∀ C x : ℝ, HasDerivAt (fun x => sin (3 * x) / 3 + C) (cos (3 * x)) x := by
  refine ⟨fun h => ?_, fun C x => integral_cos_kx 3 C x (by norm_num)⟩
  have h2 := (((hasDerivAt_id' (0:ℝ)).const_mul (3:ℝ)).sin)
  have := h.unique h2; simp at this

/-- Pogoste napake, »Integral produkta po faktorjih«: x² · (x² + 1)⁴/4 ni primitivna funkcija za
2x(x² + 1)³ (pri x = 1 je njen odvod 24, integrand pa 16); pravilno je (x² + 1)⁴/4 + C.
trditev: MAT-SS-4/nedoloceni-integral#napaka-produkt
besedilo: »Integral produkta po faktorjih (višja raven).** $\int 2x\,(x^2 + 1)^3\,dx$ ni $x^2 \cdot \dfrac{(x^2 + 1)^4}{4}$. Za produkt ni pravila »integriraj vsak faktor posebej«; tu pomaga nova spremenljivka $u = x^2 + 1$, rezultat je $\dfrac{(x^2 + 1)^4}{4} + C$.« -/
theorem napaka_produkt :
    ¬ HasDerivAt (fun x : ℝ => x ^ 2 * ((x ^ 2 + 1) ^ 4 / 4)) (2 * 1 * (1 ^ 2 + 1) ^ 3) 1 ∧
      ∀ C x : ℝ, HasDerivAt (fun x : ℝ => (x ^ 2 + 1) ^ 4 / 4 + C) (2 * x * (x ^ 2 + 1) ^ 3) x := by
  refine ⟨fun h => ?_, fun C x => ?_⟩
  · have h2 := (tabela_x2 (1:ℝ)).mul ((((tabela_x2 (1:ℝ)).add_const 1).pow 4).div_const 4)
    have := h.unique h2; norm_num at this
  · have := (((tabela_x2 x).add_const 1).pow 4).div_const 4 |>.add_const C
    convert this using 1; simp; ring

/-- Matura, naloga 1, korak 1: 3 · x⁻¹/(−1) = −3/x.
trditev: MAT-SS-4/nedoloceni-integral#matura1-korak1
besedilo: »$\int 3x^{-2}\,dx = 3 \cdot \dfrac{x^{-1}}{-1} = -\dfrac{3}{x}$« -/
theorem matura1_korak1 (x : ℝ) : 3 * (x ^ (-1 : ℤ) / (-1)) = -(3 / x) := by
  simp; ring

/-- Matura, naloga 1 (in vrstici `integral`/`odvod` bloka RACUN): za x ≠ 0 je
∫ (3/x² − 2/x + 4 cos x) dx = −3/x − 2 ln|x| + 4 sin x + C.
trditev: MAT-SS-4/nedoloceni-integral#matura1
besedilo: »$\int \left(\dfrac{3}{x^2} - \dfrac{2}{x} + 4\cos x\right) dx = -\dfrac{3}{x} - 2\ln\lvert x\rvert + 4\sin x + C$« -/
theorem matura1 (C x : ℝ) (hx : x ≠ 0) :
    HasDerivAt (fun x : ℝ => -(3 / x) - 2 * log |x| + 4 * sin x + C)
      (3 / x ^ 2 - 2 / x + 4 * cos x) x := by
  have h1 : HasDerivAt (fun x : ℝ => -(3 / x)) (3 / x ^ 2) x := by
    have := ((hasDerivAt_inv hx).const_mul (3:ℝ)).neg
    convert this using 1
    · ext y; simp [div_eq_mul_inv]
    · field_simp
  have h2 : HasDerivAt (fun x : ℝ => log |x|) (1 / x) x := by simpa using hasDerivAt_log hx
  have := ((h1.sub (h2.const_mul (2:ℝ))).add ((hasDerivAt_sin x).const_mul (4:ℝ))).add_const C
  convert this using 1; ring

/-- Predpostavka trditve `matura1` se da izpolniti (x = 1). -/
example : (1 : ℝ) ≠ 0 := one_ne_zero

/-- Matura, naloga 2 a): x³ − 3x² + C je primitivna funkcija za 3x² − 6x.
trditev: MAT-SS-4/nedoloceni-integral#matura2-primitivna
besedilo: »a) Funkcija $f$ je primitivna funkcija za $f'$: $f(x) = \int (3x^2 - 6x)\,dx = x^3 - 3x^2 + C$.« -/
theorem matura2_primitivna (C x : ℝ) :
    HasDerivAt (fun x : ℝ => x ^ 3 - 3 * x ^ 2 + C) (3 * x ^ 2 - 6 * x) x := by
  have := (((hasDerivAt_pow 3 x).sub ((hasDerivAt_pow 2 x).const_mul (3:ℝ)))).add_const C
  convert this using 1; simp; ring

/-- Matura, naloga 2 a) (in vrstica `resi: 1-3+C=2`): iz f(1) = 2 sledi 1 − 3 + C = 2, torej C = 4.
trditev: MAT-SS-4/nedoloceni-integral#matura2-c
besedilo: »a) Iz $f(1) = 2$ sledi $1 - 3 + C = 2$, torej $C = 4$ in $f(x) = x^3 - 3x^2 + 4$.« -/
theorem matura2_C (C : ℝ) : 1 - 3 + C = 2 ↔ C = 4 := by
  constructor <;> intro h <;> linarith

/-- Matura, naloga 2 a): edina funkcija z f'(x) = 3x² − 6x (za vsak x) in f(1) = 2 je
f(x) = x³ − 3x² + 4.
trditev: MAT-SS-4/nedoloceni-integral#matura2-f
besedilo: »a) Iz $f(1) = 2$ sledi $1 - 3 + C = 2$, torej $C = 4$ in $f(x) = x^3 - 3x^2 + 4$.« -/
theorem matura2_f (f : ℝ → ℝ) (hf : ∀ x, HasDerivAt f (3 * x ^ 2 - 6 * x) x) (h1 : f 1 = 2) :
    ∀ x, f x = x ^ 3 - 3 * x ^ 2 + 4 := by
  have hd : ∀ x, HasDerivAt (fun x => f x - (x ^ 3 - 3 * x ^ 2 + 0)) 0 x := fun x =>
    ((hf x).sub (matura2_primitivna 0 x)).congr_deriv (by ring)
  have hc := is_const_of_deriv_eq_zero (f := fun x => f x - (x ^ 3 - 3 * x ^ 2 + 0))
    (fun x => (hd x).differentiableAt) (fun x => (hd x).deriv)
  intro x
  have := hc x 1
  simp only [h1, add_zero] at this
  linarith

/-- Predpostavke trditve `matura2_f` se dajo izpolniti (f(x) = x³ − 3x² + 4). -/
example : (∀ x : ℝ, HasDerivAt (fun x : ℝ => x ^ 3 - 3 * x ^ 2 + 4) (3 * x ^ 2 - 6 * x) x) ∧
    ((1:ℝ) ^ 3 - 3 * 1 ^ 2 + 4 = 2) := ⟨fun x => matura2_primitivna 4 x, by norm_num⟩

/-- Matura, naloga 2 b), korak 3: f(−1) = −1 − 3 + 4 = 0.
trditev: MAT-SS-4/nedoloceni-integral#matura2-f-minus1
besedilo: »$f(-1) = -1 - 3 + 4 = 0$« -/
theorem matura2_f_minus1 : (-1 : ℝ) ^ 3 - 3 * (-1) ^ 2 + 4 = 0 := by
  calc (-1 : ℝ) ^ 3 - 3 * (-1) ^ 2 + 4 = -1 - 3 + 4 := by norm_num
    _ = 0 := by norm_num

/-- Matura, naloga 2 b), korak 3 (in vrstica `enako`): x³ − 3x² + 4 = (x + 1)(x² − 4x + 4) = (x + 1)(x − 2)².
trditev: MAT-SS-4/nedoloceni-integral#matura2-razcep
besedilo: »b) Ena ničla je $x = -1$, ker je $f(-1) = -1 - 3 + 4 = 0$. Z deljenjem z $(x + 1)$ dobimo $f(x) = (x + 1)(x^2 - 4x + 4) = (x + 1)(x - 2)^2$.« -/
theorem matura2_razcep (x : ℝ) : x ^ 3 - 3 * x ^ 2 + 4 = (x + 1) * (x - 2) ^ 2 := by
  calc x ^ 3 - 3 * x ^ 2 + 4 = (x + 1) * (x ^ 2 - 4 * x + 4) := by ring
    _ = (x + 1) * (x - 2) ^ 2 := by ring

/-- Matura, naloga 2 b) (in vrstica `resi`): ničli f sta natanko x = −1 in x = 2.
trditev: MAT-SS-4/nedoloceni-integral#matura2-nicle
besedilo: »Odgovor: a) $f(x) = x^3 - 3x^2 + 4$; b) $x_1 = -1$, $x_2 = 2$ (dvojna ničla); c) lokalni maksimum v točki $(0, 4)$, lokalni minimum v točki $(2, 0)$.« -/
theorem matura2_nicle (x : ℝ) : x ^ 3 - 3 * x ^ 2 + 4 = 0 ↔ x = -1 ∨ x = 2 := by
  rw [matura2_razcep, mul_eq_zero, pow_eq_zero_iff two_ne_zero]
  constructor
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · rintro (h | h)
    · left; linarith
    · right; linarith

/-- Matura, naloga 2 c), korak 5 (in vrstica `resi: 3*x^2-6*x=0`): 3x² − 6x = 3x(x − 2) = 0
natanko pri x = 0 ali x = 2.
trditev: MAT-SS-4/nedoloceni-integral#matura2-stacionarni
besedilo: »c) Stacionarni točki: $f'(x) = 3x^2 - 6x = 3x(x - 2) = 0$, torej $x = 0$ in $x = 2$; $f(0) = 4$ in $f(2) = 8 - 12 + 4 = 0$.« -/
theorem matura2_stacionarni (x : ℝ) : 3 * x ^ 2 - 6 * x = 0 ↔ x = 0 ∨ x = 2 := by
  rw [show 3 * x ^ 2 - 6 * x = 3 * x * (x - 2) by ring]
  constructor
  · intro h
    rcases mul_eq_zero.mp h with h | h
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Matura, naloga 2 c), korak 5 (in vrstici `vrednost`): f(0) = 4 in f(2) = 8 − 12 + 4 = 0.
trditev: MAT-SS-4/nedoloceni-integral#matura2-vrednosti
besedilo: »c) Stacionarni točki: $f'(x) = 3x^2 - 6x = 3x(x - 2) = 0$, torej $x = 0$ in $x = 2$; $f(0) = 4$ in $f(2) = 8 - 12 + 4 = 0$.« -/
theorem matura2_vrednosti : (0 : ℝ) ^ 3 - 3 * 0 ^ 2 + 4 = 4 ∧ (2 : ℝ) ^ 3 - 3 * 2 ^ 2 + 4 = 0 := by
  refine ⟨by norm_num, ?_⟩
  calc (2 : ℝ) ^ 3 - 3 * 2 ^ 2 + 4 = 8 - 12 + 4 := by norm_num
    _ = 0 := by norm_num

/-- Matura, naloga 2 c), korak 6: f' je pozitiven za x < 0, negativen za 0 < x < 2 in pozitiven za x > 2.
trditev: MAT-SS-4/nedoloceni-integral#matura2-predznak
besedilo: »$f'(x) = 3x^2 - 6x = 3x(x - 2) = 0$« -/
theorem matura2_predznak (x : ℝ) :
    (x < 0 → 0 < 3 * x ^ 2 - 6 * x) ∧ (0 < x → x < 2 → 3 * x ^ 2 - 6 * x < 0) ∧
      (2 < x → 0 < 3 * x ^ 2 - 6 * x) := by
  refine ⟨fun h => by nlinarith, fun h1 h2 => by nlinarith, fun h => by nlinarith⟩

/-- Matura, naloga 2 c): f ima v točki (0, 4) lokalni maksimum.
trditev: MAT-SS-4/nedoloceni-integral#matura2-maks
besedilo: »Odgovor: a) $f(x) = x^3 - 3x^2 + 4$; b) $x_1 = -1$, $x_2 = 2$ (dvojna ničla); c) lokalni maksimum v točki $(0, 4)$, lokalni minimum v točki $(2, 0)$.« -/
theorem matura2_maks : IsLocalMax (fun x : ℝ => x ^ 3 - 3 * x ^ 2 + 4) 0 := by
  filter_upwards [Iio_mem_nhds (show (0:ℝ) < 3 by norm_num)] with y hy
  simp only [Set.mem_Iio] at hy
  nlinarith [sq_nonneg y]

/-- Matura, naloga 2 c): f ima v točki (2, 0) lokalni minimum.
trditev: MAT-SS-4/nedoloceni-integral#matura2-min
besedilo: »Odgovor: a) $f(x) = x^3 - 3x^2 + 4$; b) $x_1 = -1$, $x_2 = 2$ (dvojna ničla); c) lokalni maksimum v točki $(0, 4)$, lokalni minimum v točki $(2, 0)$.« -/
theorem matura2_min : IsLocalMin (fun x : ℝ => x ^ 3 - 3 * x ^ 2 + 4) 2 := by
  filter_upwards [Ioi_mem_nhds (show (-1:ℝ) < 2 by norm_num)] with y hy
  simp only [Set.mem_Ioi] at hy
  nlinarith [sq_nonneg (y - 2), mul_nonneg (le_of_lt (by linarith : (0:ℝ) < y + 1)) (sq_nonneg (y - 2))]

/-- Matura, naloga 3 a), korak 2: (1/2) · u^(3/2)/(3/2) = (1/3) u^(3/2).
trditev: MAT-SS-4/nedoloceni-integral#matura3-korak2
besedilo: »$\int \sqrt{u} \cdot \dfrac{du}{2} = \dfrac{1}{2} \cdot \dfrac{u^{3/2}}{3/2} = \dfrac{1}{3}\,u^{3/2}$« -/
theorem matura3_korak2 (u : ℝ) : 1 / 2 * (u ^ (3 / 2 : ℝ) / (3 / 2)) = 1 / 3 * u ^ (3 / 2 : ℝ) := by ring

/-- Matura, naloga 3 a) (in vrstica `integral: x*sqrt(x^2+9)`):
∫ x√(x² + 9) dx = (1/3)(x² + 9)√(x² + 9) + C.
trditev: MAT-SS-4/nedoloceni-integral#matura3a
besedilo: »$\int f(x)\,dx = \dfrac{1}{3}\,(x^2 + 9)\sqrt{x^2 + 9} + C$« -/
theorem matura3a (C x : ℝ) :
    HasDerivAt (fun x : ℝ => 1 / 3 * (x ^ 2 + 9) * √(x ^ 2 + 9) + C) (x * √(x ^ 2 + 9)) x := by
  have hu : (0:ℝ) < x ^ 2 + 9 := by positivity
  have hg : HasDerivAt (fun x : ℝ => x ^ 2 + 9) (2 * x) x := (tabela_x2 x).add_const 9
  have h := ((hg.const_mul (1 / 3 : ℝ)).mul (hg.sqrt hu.ne')).add_const C
  convert h using 1
  · have h0 : √(x ^ 2 + 9) ≠ 0 := (sqrt_pos.mpr hu).ne'
    field_simp
    rw [sq_sqrt hu.le]; ring

/-- Matura, naloga 3 b), korak 3 (in vrstica `vrednost`): F(0) = (1/3) · 9 · 3 + C = 9 + C.
trditev: MAT-SS-4/nedoloceni-integral#matura3b-f0
besedilo: »$F(0) = \dfrac{1}{3} \cdot 9 \cdot 3 + C = 9 + C$« -/
theorem matura3b_F0 (C : ℝ) : 1 / 3 * ((0:ℝ) ^ 2 + 9) * √((0:ℝ) ^ 2 + 9) + C = 9 + C := by
  have h : √((0:ℝ) ^ 2 + 9) = 3 := by
    rw [show (0:ℝ) ^ 2 + 9 = 3 ^ 2 by norm_num, sqrt_sq (by norm_num)]
  calc 1 / 3 * ((0:ℝ) ^ 2 + 9) * √((0:ℝ) ^ 2 + 9) + C = 1 / 3 * 9 * 3 + C := by rw [h]; norm_num
    _ = 9 + C := by norm_num

/-- Matura, naloga 3 b), korak 3: iz F(0) = 9 + C = 0 sledi C = −9.
trditev: MAT-SS-4/nedoloceni-integral#matura3b-c
besedilo: »b) $F(0) = \dfrac{1}{3} \cdot 9 \cdot 3 + C = 9 + C$; iz $F(0) = 0$ sledi $C = -9$.« -/
theorem matura3b_C (C : ℝ) : 9 + C = 0 ↔ C = -9 := by
  constructor <;> intro h <;> linarith

/-- Matura, naloga 3 b), korak 4 (in vrstica `vrednost`): F(4) = (1/3) · 25 · 5 − 9 = 125/3 − 27/3 = 98/3.
trditev: MAT-SS-4/nedoloceni-integral#matura3b-f4
besedilo: »$F(4) = \dfrac{1}{3} \cdot 25 \cdot 5 - 9 = \dfrac{125}{3} - \dfrac{27}{3} = \dfrac{98}{3}$« -/
theorem matura3b_F4 : 1 / 3 * ((4:ℝ) ^ 2 + 9) * √((4:ℝ) ^ 2 + 9) - 9 = 98 / 3 := by
  have h : √((4:ℝ) ^ 2 + 9) = 5 := by
    rw [show (4:ℝ) ^ 2 + 9 = 5 ^ 2 by norm_num, sqrt_sq (by norm_num)]
  calc 1 / 3 * ((4:ℝ) ^ 2 + 9) * √((4:ℝ) ^ 2 + 9) - 9 = 1 / 3 * 25 * 5 - 9 := by rw [h]; norm_num
    _ = 125 / 3 - 27 / 3 := by norm_num
    _ = 98 / 3 := by norm_num

/-- Matura, naloga 3 b): vsaka funkcija F z F'(x) = x√(x² + 9) in F(0) = 0 je
F(x) = (1/3)(x² + 9)√(x² + 9) − 9, zato F(4) = 98/3.
trditev: MAT-SS-4/nedoloceni-integral#matura3b-enolicno
besedilo: »b) $F(x) = \dfrac{1}{3}\,(x^2 + 9)\sqrt{x^2 + 9} - 9$ in $F(4) = \dfrac{98}{3}$;« -/
theorem matura3b_enolicno (F : ℝ → ℝ) (hF : ∀ x, HasDerivAt F (x * √(x ^ 2 + 9)) x) (h0 : F 0 = 0) :
    (∀ x, F x = 1 / 3 * (x ^ 2 + 9) * √(x ^ 2 + 9) + -9) ∧ F 4 = 98 / 3 := by
  have h := enolicnost F _ _ 0 hF (matura3a (-9)) (by rw [h0, matura3b_F0]; norm_num)
  exact ⟨h, by rw [h 4, ← sub_eq_add_neg, matura3b_F4]⟩

/-- Predpostavke trditve `matura3b_enolicno` se dajo izpolniti (F iz rešitve). -/
example : (∀ x : ℝ, HasDerivAt (fun x : ℝ => 1 / 3 * (x ^ 2 + 9) * √(x ^ 2 + 9) + -9)
    (x * √(x ^ 2 + 9)) x) ∧ (1 / 3 * ((0:ℝ) ^ 2 + 9) * √((0:ℝ) ^ 2 + 9) + -9 = 0) :=
  ⟨matura3a (-9), by rw [matura3b_F0]; norm_num⟩

/-- Matura, naloga 3 c) (in vrstica `integral: sin(x)^2*cos(x)`): ∫ sin²x cos x dx = sin³x/3 + C.
trditev: MAT-SS-4/nedoloceni-integral#matura3c
besedilo: »c) Uvedemo $u = \sin x$, $du = \cos x\,dx$: $\int u^2\,du = \dfrac{u^3}{3} + C = \dfrac{\sin^3 x}{3} + C$.« -/
theorem matura3c (C x : ℝ) : HasDerivAt (fun x => sin x ^ 3 / 3 + C) (sin x ^ 2 * cos x) x := by
  have := (((hasDerivAt_sin x).pow 3).div_const 3).add_const C
  convert this using 1; simp; ring

/-- Matura, naloga 3 d), korak 7 (in vrstica `vrednost: 3^2-4*5`): diskriminanta D = 9 − 20 = −11.
trditev: MAT-SS-4/nedoloceni-integral#matura3d-d
besedilo: »d) Diskriminanta imenovalca je $D = 9 - 20 = -11 < 0$, vodilni koeficient pa je pozitiven, zato je $x^2 + 3x + 5 > 0$ za vsak $x$ in absolutna vrednost ne spremeni ničesar.« -/
theorem matura3d_D : (3 : ℝ) ^ 2 - 4 * 1 * 5 = -11 := by
  calc (3 : ℝ) ^ 2 - 4 * 1 * 5 = 9 - 20 := by norm_num
    _ = -11 := by norm_num

/-- Matura, naloga 3 d), korak 7: x² + 3x + 5 > 0 za vsak x, zato ln|x² + 3x + 5| = ln(x² + 3x + 5).
trditev: MAT-SS-4/nedoloceni-integral#matura3d-pozitiven
besedilo: »zato je $x^2 + 3x + 5 > 0$ za vsak $x$ in absolutna vrednost ne spremeni ničesar.« -/
theorem matura3d_pozitiven (x : ℝ) :
    0 < x ^ 2 + 3 * x + 5 ∧ log |x ^ 2 + 3 * x + 5| = log (x ^ 2 + 3 * x + 5) := by
  have h : 0 < x ^ 2 + 3 * x + 5 := by nlinarith [sq_nonneg (x + 3 / 2)]
  exact ⟨h, by rw [abs_of_pos h]⟩

/-- Matura, naloga 3 d) (in vrstica `integral`): ∫ (2x + 3)/(x² + 3x + 5) dx = ln(x² + 3x + 5) + C.
trditev: MAT-SS-4/nedoloceni-integral#matura3d
besedilo: »d) Števec je odvod imenovalca: $u = x^2 + 3x + 5$, $du = (2x + 3)\,dx$, zato je integral enak $\int \dfrac{du}{u} = \ln\lvert u\rvert + C$.« -/
theorem matura3d (C x : ℝ) :
    HasDerivAt (fun x : ℝ => log (x ^ 2 + 3 * x + 5) + C) ((2 * x + 3) / (x ^ 2 + 3 * x + 5)) x := by
  have hg : HasDerivAt (fun x : ℝ => x ^ 2 + 3 * x + 5) (2 * x + 3) x := by
    have := ((tabela_x2 x).add ((hasDerivAt_id' x).const_mul (3:ℝ))).add_const 5
    exact this.congr_deriv (by ring)
  exact (hg.log (matura3d_pozitiven x).1.ne').add_const C

/-- Ustno vprašanje 3 (in vrstica `integral: 2*x*cos(x^2)`): ∫ 2x cos(x²) dx = sin(x²) + C.
trditev: MAT-SS-4/nedoloceni-integral#ustno3
besedilo: »Pri $\int 2x\cos(x^2)\,dx$ vzamemo $u = x^2$, $du = 2x\,dx$ in dobimo $\int \cos u\,du = \sin(x^2) + C$.« -/
theorem ustno3 (C x : ℝ) : HasDerivAt (fun x : ℝ => sin (x ^ 2) + C) (2 * x * cos (x ^ 2)) x := by
  have := ((tabela_x2 x).sin).add_const C
  convert this using 1; ring

/-- Drugače, iz vsakdanjega življenja: v 3 urah po 8 % na uro je baterija 3 · 8 % = 24 % bolj prazna.
trditev: MAT-SS-4/nedoloceni-integral#baterija
besedilo: »$3 \cdot 8\,\% = 24\,\%$« -/
theorem baterija : (3 : ℝ) * 8 = 24 := by norm_num

/-- Preveri se, vprašanje 3: ∫ cos(4x) dx = a sin(4x) + C z a = 1/4 = 0,25 (in samo pri tem a).
trditev: MAT-SS-4/nedoloceni-integral#kviz3
besedilo: »$\int \cos(kx)\,dx = \dfrac{\sin(kx)}{k} + C$: večji $k$ pomeni manjši faktor $\dfrac{1}{k}$. Faktor se razpolovi, z $\frac{1}{2}$ na $a = \frac{1}{4} = 0{,}25$.« -/
theorem kviz3 : (∀ C x : ℝ, HasDerivAt (fun x => 1 / 4 * sin (4 * x) + C) (cos (4 * x)) x) ∧
    (1 / 4 : ℝ) = 0.25 ∧
    ∀ a : ℝ, (∀ x : ℝ, HasDerivAt (fun x => a * sin (4 * x)) (cos (4 * x)) x) → a = 1 / 4 := by
  refine ⟨fun C x => ?_, by norm_num, fun a h => ?_⟩
  · have := integral_cos_kx 4 C x (by norm_num)
    convert this using 2; ring
  · have h2 := (((hasDerivAt_id' (0:ℝ)).const_mul (4:ℝ)).sin).const_mul a
    have := (h 0).unique h2
    simp at this; linarith

/-- Preveri se, vprašanje 4: za x ≠ 0 je ∫ (x² + 1/x) dx = x³/3 + ln|x| + C.
trditev: MAT-SS-4/nedoloceni-integral#kviz4
besedilo: »$\int x^2\,dx = \dfrac{x^3}{3}$ in $\int \dfrac{1}{x}\,dx = \ln\lvert x\rvert$;« -/
theorem kviz4 (C x : ℝ) (hx : x ≠ 0) :
    HasDerivAt (fun x : ℝ => x ^ 3 / 3 + log |x| + C) (x ^ 2 + 1 / x) x := by
  have := (((hasDerivAt_pow 3 x).div_const 3).add (integral_1_x 0 x hx)).add_const C
  convert this using 1
  · funext y; simp only [Pi.add_apply]; ring
  · push_cast; ring

/-- Predpostavka trditve `kviz4` se da izpolniti (x = 1). -/
example : (1 : ℝ) ≠ 0 := one_ne_zero

/-- Preveri se, vprašanje 5: N(t) = 80t + 10t² + C ima odvod 80 + 20t, iz N(0) = 0 je C = 0 in
N(3) = 240 + 90 = 330 udarcev.
trditev: MAT-SS-4/nedoloceni-integral#kviz5
besedilo: »$N(t) = 80t + 10t^2 + C$, $N(0) = 0$ da $C = 0$; $N(3) = 240 + 90 = 330$.« -/
theorem kviz5 : (∀ C t : ℝ, HasDerivAt (fun t : ℝ => 80 * t + 10 * t ^ 2 + C) (80 + 20 * t) t) ∧
    (∀ C : ℝ, 80 * 0 + 10 * 0 ^ 2 + C = 0 ↔ C = 0) ∧ (80 : ℝ) * 3 + 10 * 3 ^ 2 + 0 = 330 := by
  refine ⟨fun C t => ?_, fun C => by constructor <;> intro h <;> simp_all, ?_⟩
  · have := (((hasDerivAt_id' t).const_mul (80:ℝ)).add ((hasDerivAt_pow 2 t).const_mul (10:ℝ))).add_const C
    convert this using 1; simp; ring
  · calc (80 : ℝ) * 3 + 10 * 3 ^ 2 + 0 = 240 + 90 := by norm_num
      _ = 330 := by norm_num

/-- Preveri se, vprašanje 5: vsaka funkcija N z N'(t) = 80 + 20t in N(0) = 0 je N(t) = 80t + 10t²,
zato N(3) = 330.
trditev: MAT-SS-4/nedoloceni-integral#kviz5-enolicno
besedilo: »$N(t) = 80t + 10t^2 + C$, $N(0) = 0$ da $C = 0$; $N(3) = 240 + 90 = 330$.« -/
theorem kviz5_enolicno (N : ℝ → ℝ) (hN : ∀ t, HasDerivAt N (80 + 20 * t) t) (h0 : N 0 = 0) :
    (∀ t, N t = 80 * t + 10 * t ^ 2 + 0) ∧ N 3 = 330 := by
  have h := enolicnost N _ _ 0 hN (kviz5.1 0) (by rw [h0]; norm_num)
  exact ⟨h, by rw [h 3, kviz5.2.2]⟩

/-- Predpostavke trditve `kviz5_enolicno` se dajo izpolniti (N(t) = 80t + 10t²). -/
example : (∀ t : ℝ, HasDerivAt (fun t : ℝ => 80 * t + 10 * t ^ 2 + 0) (80 + 20 * t) t) ∧
    ((80:ℝ) * 0 + 10 * 0 ^ 2 + 0 = 0) := ⟨kviz5.1 0, by norm_num⟩

end Evklid.Lekcije.MAT_SS_4.NedoloceniIntegral
