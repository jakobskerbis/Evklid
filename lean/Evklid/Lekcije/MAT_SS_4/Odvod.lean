/-
vir: content/lessons/MAT-SS-4/odvod.md
sha256: 4881a4b277bd78693fc8c27ee9a438195f50d886b8f23dddbed676281e39dfdf
Ni v Leanu: Maticova trditev in pogovor o kuharju (besedilo, ni matematična trditev); pomen odvoda kot
hitrosti in diferenčnega količnika kot smernega koeficienta sekante oziroma tangente (razlaga na grafu,
Preveri se 1 in Ustno vprašanje 1: Lean dokaže le definicijo `odvod_definicija`); simulacija »Od sekante do
tangente«; opazovanje »vse več ničel« v razdelku Drugače (Lean dokaže le izračunane količnike); zgodba
o kuharici Mojci; točkovanje. Pravilo za potenco z racionalnim eksponentom je dokazano za x > 0 (za x < 0
lekcija pogoja ne navaja).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.Odvod

open Real Filter Topology Set

/-! ## Pomožni trditvi -/

/-- Pomožna trditev: odvod v točki `a` je limita diferenčnih količnikov `(f(a + h) − f(a))/h` pri
`h → 0`, `h ≠ 0` (razdelek 2, definicija odvoda; Mathlibova definicija je enakovredna).
pomozno -/
theorem odvod_definicija (f : ℝ → ℝ) (a f' : ℝ) :
    HasDerivAt f f' a ↔ Tendsto (fun h => (f (a + h) - f a) / h) (𝓝[≠] 0) (𝓝 f') := by
  rw [hasDerivAt_iff_tendsto_slope_zero]
  simp only [smul_eq_mul, div_eq_inv_mul]

/-- Pomožna trditev: če je diferenčni količnik za `h ≠ 0` (blizu 0) enak izrazu `g(h)`, ki je v 0 zvezen,
je njegova limita `g(0)` (»krajšamo h, nato vstavimo h = 0«).
pomozno -/
theorem lim_kvocient {q g : ℝ → ℝ} {L : ℝ} (he : ∀ᶠ h in 𝓝[≠] (0:ℝ), q h = g h)
    (hg : ContinuousAt g 0) (hL : g 0 = L) : Tendsto q (𝓝[≠] 0) (𝓝 L) := by
  rw [← hL]
  exact (hg.tendsto.mono_left nhdsWithin_le_nhds).congr' (he.mono fun h hh => hh.symm)

/-- Pomožna trditev: krajšanje `h` velja za vsak `h ≠ 0`, torej tudi blizu 0.
pomozno -/
theorem skoraj {q g : ℝ → ℝ} (he : ∀ h : ℝ, h ≠ 0 → q h = g h) : ∀ᶠ h in 𝓝[≠] (0:ℝ), q h = g h := by
  filter_upwards [self_mem_nhdsWithin] with h hh using he h hh

/-! ## Razlaga, 1: vedno krajši razmiki (olje) -/

/-- Razlaga 1: model olja T(t) = 20 + 20t − t² da T(4) = 84 in T(10) = 120 (°C).
trditev: MAT-SS-4/odvod#olje-vrednosti
besedilo: »$T(4) = 84 ^\circ\mathrm{C}$« -/
theorem olje_vrednosti : (20:ℝ) + 20 * 4 - 4 ^ 2 = 84 ∧ (20:ℝ) + 20 * 10 - 10 ^ 2 = 120 := by
  norm_num

/-- Uvod (Matic): povprečna hitrost v prvih desetih minutah je (120 − 20)/10 = 10 °C/min.
trditev: MAT-SS-4/odvod#olje-povprecje
besedilo: »Smiselna je le povprečna hitrost: $\frac{120 - 20}{10} = 10$ stopinj na minuto.« -/
theorem olje_povprecje : ((120:ℝ) - 20) / 10 = 10 := by norm_num

/-- Razlaga 1, tabela: h = 1 da T(5) = 95 in količnik 11; h = 0,1 da T(4,1) = 85,19 in 11,9;
h = 0,01 da T(4,01) = 84,1199 in 11,99.
trditev: MAT-SS-4/odvod#olje-tabela
besedilo: »| $1$ | $95$ | $11$ | | $0{,}1$ | $85{,}19$ | $11{,}9$ | | $0{,}01$ | $84{,}1199$ | $11{,}99$ |« -/
theorem olje_tabela :
    ((20:ℝ) + 20 * 5 - 5 ^ 2 = 95 ∧ ((95:ℝ) - 84) / 1 = 11) ∧
    ((20:ℝ) + 20 * 4.1 - 4.1 ^ 2 = 85.19 ∧ ((85.19:ℝ) - 84) / 0.1 = 11.9) ∧
    ((20:ℝ) + 20 * 4.01 - 4.01 ^ 2 = 84.1199 ∧ ((84.1199:ℝ) - 84) / 0.01 = 11.99) := by
  norm_num

/-- Razlaga 1: T(4 + h) − T(4) = 12h − h².
trditev: MAT-SS-4/odvod#olje-razlika
besedilo: »$T(4 + h) - T(4) = 12h - h^2$« -/
theorem olje_razlika (h : ℝ) :
    (20 + 20 * (4 + h) - (4 + h) ^ 2) - (20 + 20 * 4 - 4 ^ 2) = 12 * h - h ^ 2 := by ring

/-- Razlaga 1: diferenčni količnik je za h ≠ 0 enak 12 − h.
trditev: MAT-SS-4/odvod#olje-kvocient
besedilo: »Algebra to potrdi: $T(4 + h) - T(4) = 12h - h^2$, zato je diferenčni količnik $12 - h$, ta pa ima pri $h \to 0$ limito $12$.« -/
theorem olje_kvocient (h : ℝ) (hh : h ≠ 0) :
    ((20 + 20 * (4 + h) - (4 + h) ^ 2) - (20 + 20 * 4 - 4 ^ 2)) / h = 12 - h := by
  rw [olje_razlika]; field_simp

/-- Predpostavke trditve `olje_kvocient` se dajo izpolniti. -/
example : (1:ℝ) ≠ 0 := one_ne_zero

/-- Predpostavke trditve `olje_kvocient` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 := one_ne_zero
  olje_kvocient (hh := w)

/-- Razlaga 1: limita diferenčnih količnikov je 12, torej se olje ob t = 4 segreva s 12 °C/min
(več od povprečja 10).
trditev: MAT-SS-4/odvod#olje-odvod-4
besedilo: »Limita obstaja: v trenutku $t = 4$ se olje segreva s hitrostjo $12 ^\circ\mathrm{C/min}$, kar je več od povprečja $10$.« -/
theorem olje_odvod_4 : HasDerivAt (fun t : ℝ => 20 + 20 * t - t ^ 2) 12 4 ∧ (12:ℝ) > 10 := by
  refine ⟨(odvod_definicija _ _ _).mpr (lim_kvocient (g := fun h => 12 - h)
    (skoraj fun h hh => olje_kvocient h hh) (by fun_prop) (by norm_num)), by norm_num⟩

/-! ## Razlaga, 3: iščemo vzorec -/

/-- Razlaga 3: (a + h)² − a² = 2ah + h², diferenčni količnik je 2a + h (h ≠ 0), limita 2a.
trditev: MAT-SS-4/odvod#kvadrat-iz-definicije
besedilo: »Za $f(x) = x^2$ je $(a + h)^2 - a^2 = 2ah + h^2$. Diferenčni količnik je $2a + h$, njegova limita pa $2a$.« -/
theorem kvadrat_iz_definicije (a : ℝ) :
    (∀ h : ℝ, (a + h) ^ 2 - a ^ 2 = 2 * a * h + h ^ 2) ∧
    (∀ h : ℝ, h ≠ 0 → ((a + h) ^ 2 - a ^ 2) / h = 2 * a + h) ∧
    HasDerivAt (fun x : ℝ => x ^ 2) (2 * a) a := by
  have hq : ∀ h : ℝ, h ≠ 0 → ((a + h) ^ 2 - a ^ 2) / h = 2 * a + h := by
    intro h hh; field_simp; ring
  refine ⟨fun h => by ring, hq, (odvod_definicija _ _ _).mpr
    (lim_kvocient (g := fun h => 2 * a + h) (skoraj hq) (by fun_prop) (by simp))⟩

/-- Razlaga 3: (a + h)³ − a³ = 3a²h + 3ah² + h³, količnik 3a² + 3ah + h² (h ≠ 0), limita 3a².
trditev: MAT-SS-4/odvod#kub-iz-definicije
besedilo: »Za $f(x) = x^3$ podobno: $(a + h)^3 - a^3 = 3a^2 h + 3a h^2 + h^3$, po deljenju s $h$ je diferenčni količnik $3a^2 + 3ah + h^2$, njegova limita pa $3a^2$.« -/
theorem kub_iz_definicije (a : ℝ) :
    (∀ h : ℝ, (a + h) ^ 3 - a ^ 3 = 3 * a ^ 2 * h + 3 * a * h ^ 2 + h ^ 3) ∧
    (∀ h : ℝ, h ≠ 0 → ((a + h) ^ 3 - a ^ 3) / h = 3 * a ^ 2 + 3 * a * h + h ^ 2) ∧
    HasDerivAt (fun x : ℝ => x ^ 3) (3 * a ^ 2) a := by
  have hq : ∀ h : ℝ, h ≠ 0 → ((a + h) ^ 3 - a ^ 3) / h = 3 * a ^ 2 + 3 * a * h + h ^ 2 := by
    intro h hh; field_simp; ring
  refine ⟨fun h => by ring, hq, (odvod_definicija _ _ _).mpr
    (lim_kvocient (g := fun h => 3 * a ^ 2 + 3 * a * h + h ^ 2) (skoraj hq) (by fun_prop)
      (by simp))⟩

/-- Razlaga 3, tabela: odvodi x² v 1, 2, 3 so 2, 4, 6; odvodi x³ so 3, 12, 27.
trditev: MAT-SS-4/odvod#vzorec-tabela
besedilo: »| $1$ | $2$ | $3$ | | $2$ | $4$ | $12$ | | $3$ | $6$ | $27$ |« -/
theorem vzorec_tabela :
    deriv (fun x : ℝ => x ^ 2) 1 = 2 ∧ deriv (fun x : ℝ => x ^ 2) 2 = 4 ∧
    deriv (fun x : ℝ => x ^ 2) 3 = 6 ∧ deriv (fun x : ℝ => x ^ 3) 1 = 3 ∧
    deriv (fun x : ℝ => x ^ 3) 2 = 12 ∧ deriv (fun x : ℝ => x ^ 3) 3 = 27 := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_⟩ <;> simp <;> norm_num

/-- Razlaga 3, Premisli: (2 + h)⁴ − 16 = 32h + 24h² + 8h³ + h⁴ in (x⁴)' v 2 je 4 · 2³ = 32.
trditev: MAT-SS-4/odvod#cetrta-potenca-v-2
besedilo: »Po vzorcu je $(x^4)' = 4x^3$, zato je $f'(2) = 4 \cdot 2^3 = 32$. Z diferenčnim količnikom dobiš isto: $(2 + h)^4 - 16 = 32h + 24h^2 + 8h^3 + h^4$.« -/
theorem cetrta_potenca_v_2 :
    (∀ h : ℝ, (2 + h) ^ 4 - 16 = 32 * h + 24 * h ^ 2 + 8 * h ^ 3 + h ^ 4) ∧
    HasDerivAt (fun x : ℝ => x ^ 4) (4 * 2 ^ 3) 2 ∧ (4:ℝ) * 2 ^ 3 = 32 := by
  refine ⟨fun h => by ring, ?_, by norm_num⟩
  exact (hasDerivAt_pow 4 (2:ℝ)).congr_deriv (by norm_num)

/-- Razlaga 3, pravilo za potenco (naravni eksponent): (xⁿ)' = n xⁿ⁻¹.
trditev: MAT-SS-4/odvod#potenca-naravna
besedilo: »$$(x^n)' = n x^{n-1}$$« -/
theorem potenca_naravna (n : ℕ) (x : ℝ) : HasDerivAt (fun x : ℝ => x ^ n) (n * x ^ (n - 1)) x :=
  hasDerivAt_pow n x

/-- Razlaga 3, pravilo za potenco (negativni, celi eksponent) za x ≠ 0: (xⁿ)' = n xⁿ⁻¹.
trditev: MAT-SS-4/odvod#potenca-cela
besedilo: »Velja tudi za negativne in racionalne eksponente« -/
theorem potenca_cela (n : ℤ) (x : ℝ) (hx : x ≠ 0) :
    HasDerivAt (fun x : ℝ => x ^ n) (n * x ^ (n - 1)) x :=
  hasDerivAt_zpow n x (Or.inl hx)

/-- Predpostavke trditve `potenca_cela` se dajo izpolniti. -/
example : (2:ℝ) ≠ 0 := two_ne_zero

/-- Predpostavke trditve `potenca_cela` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2:ℝ) ≠ 0 := two_ne_zero
  potenca_cela (hx := w)

/-- Razlaga 3, pravilo za potenco (realni, tudi racionalni eksponent) za x > 0.
trditev: MAT-SS-4/odvod#potenca-realna
besedilo: »Velja tudi za negativne in racionalne eksponente« -/
theorem potenca_realna (p x : ℝ) (hx : 0 < x) :
    HasDerivAt (fun x : ℝ => x ^ p) (p * x ^ (p - 1)) x :=
  hasDerivAt_rpow_const (Or.inl hx.ne')

/-- Predpostavke trditve `potenca_realna` se dajo izpolniti. -/
example : (0:ℝ) < 1 := one_pos

/-- Predpostavke trditve `potenca_realna` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 1 := one_pos
  potenca_realna (hx := w)

/-- Razlaga 3: (1/x)' = (x⁻¹)' = −1/x² za x ≠ 0.
trditev: MAT-SS-4/odvod#odvod-ena-skozi-x
besedilo: »$\left(\frac{1}{x}\right)' = (x^{-1})' = -\frac{1}{x^2}$« -/
theorem odvod_ena_skozi_x (x : ℝ) (hx : x ≠ 0) :
    HasDerivAt (fun x : ℝ => 1 / x) (-1 / x ^ 2) x := by
  have := hasDerivAt_inv hx
  simp only [one_div]
  exact this.congr_deriv (by field_simp)

/-- Predpostavka x ≠ 0 je izpolnljiva. Trditev: `odvod_ena_skozi_x`. -/
example : ∃ x : ℝ, x ≠ 0 := ⟨1, one_ne_zero⟩

/-- Predpostavke trditve `odvod_ena_skozi_x` se dajo izpolniti: izrek, uporabljen na primeru. -/
example : True :=
  have w : ∃ x : ℝ, x ≠ 0 := ⟨1, one_ne_zero⟩
  (fun _ => trivial) (odvod_ena_skozi_x (x := w.choose) (hx := w.choose_spec))

/-- Razlaga 3: x' = 1 in odvod konstante je 0.
trditev: MAT-SS-4/odvod#odvod-x-in-konstante
besedilo: »$x' = 1$ in odvod konstante je $0$,« -/
theorem odvod_x_in_konstante (c x : ℝ) :
    HasDerivAt (fun x : ℝ => x) 1 x ∧ HasDerivAt (fun _ : ℝ => c) 0 x :=
  ⟨hasDerivAt_id' x, hasDerivAt_const x c⟩

/-! ## Razlaga, 5: konstanta in vsota -/

/-- Razlaga 5: (c · f)' = c · f'.
trditev: MAT-SS-4/odvod#odvod-konstanta-krat
besedilo: »(c \cdot f)' = c \cdot f'« -/
theorem odvod_konstanta_krat {f : ℝ → ℝ} {f' x : ℝ} (c : ℝ) (hf : HasDerivAt f f' x) :
    HasDerivAt (fun x => c * f x) (c * f') x := hf.const_mul c

/-- Predpostavka je izpolnljiva (f = x). Trditev: `odvod_konstanta_krat`. -/
example : HasDerivAt (fun x : ℝ => x) 1 0 := hasDerivAt_id' 0

/-- Predpostavke trditve `odvod_konstanta_krat` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : HasDerivAt (fun x : ℝ => x) 1 0 := hasDerivAt_id' 0
  odvod_konstanta_krat (hf := w)

/-- Razlaga 5: (f + g)' = f' + g'.
trditev: MAT-SS-4/odvod#odvod-vsote
besedilo: »(f + g)' = f' + g'«
besedilo-kratko: formula pravila za vsoto; daljši odsek zajame še konstantni faktor -/
theorem odvod_vsote {f g : ℝ → ℝ} {f' g' x : ℝ} (hf : HasDerivAt f f' x) (hg : HasDerivAt g g' x) :
    HasDerivAt (fun x => f x + g x) (f' + g') x := hf.add hg

/-- Predpostavke trditve `odvod_vsote` se dajo izpolniti. -/
example : HasDerivAt (fun x : ℝ => x) 1 0 ∧ HasDerivAt (fun x : ℝ => x) 1 0 :=
  ⟨hasDerivAt_id' 0, hasDerivAt_id' 0⟩

/-- Predpostavke trditve `odvod_vsote` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : HasDerivAt (fun x : ℝ => x) 1 0 ∧ HasDerivAt (fun x : ℝ => x) 1 0 :=
    ⟨hasDerivAt_id' 0, hasDerivAt_id' 0⟩
  odvod_vsote (hf := w.1) (hg := w.2)

/-- Razlaga 5: T'(t) = 0 + 20 − 2t = 20 − 2t.
trditev: MAT-SS-4/odvod#olje-odvod
besedilo: »$T'(t) = 0 + 20 - 2t = 20 - 2t$« -/
theorem olje_odvod (t : ℝ) : HasDerivAt (fun t : ℝ => 20 + 20 * t - t ^ 2) (20 - 2 * t) t := by
  have := ((hasDerivAt_const t (20:ℝ)).add ((hasDerivAt_id' t).const_mul 20)).sub (hasDerivAt_pow 2 t)
  exact this.congr_deriv (by norm_num)

/-- Razlaga 5: T'(4) = 20 − 8 = 12 (ujema se s tabelo), T'(0) = 20 in T'(10) = 0.
trditev: MAT-SS-4/odvod#olje-odvod-vrednosti
besedilo: »Pri $t = 4$ dobimo $20 - 8 = 12$, kar se ujema s tabelo. Zdaj lahko Maticu odgovorimo. Na začetku se olje segreva s hitrostjo $T'(0) = 20\,^\circ\mathrm{C/min}$, ob $t = 10$ pa je $T'(10) = 0$« -/
theorem olje_odvod_vrednosti :
    (20:ℝ) - 2 * 4 = 20 - 8 ∧ (20:ℝ) - 8 = 12 ∧ (20:ℝ) - 2 * 0 = 20 ∧ (20:ℝ) - 2 * 10 = 0 := by
  norm_num

/-! ## Razlaga, 6: produkt, kvocient, sestavljena funkcija -/

/-- Razlaga 6, Premisli: x' · x' = 1, (x²)' = 2x; odvod produkta x · x ni produkt odvodov (npr. v x = 0),
pravilo za produkt pa da 1 · x + x · 1 = 2x.
trditev: MAT-SS-4/odvod#produkt-ni-produkt-odvodov
besedilo: »$x' \cdot x' = 1 \cdot 1 = 1$, pravi odvod pa je $(x^2)' = 2x$. Odvod produkta torej ni produkt odvodov. Pravilo spodaj da $1 \cdot x + x \cdot 1 = 2x$, kar je prav.« -/
theorem produkt_ni_produkt_odvodov :
    deriv (fun x : ℝ => x) 0 * deriv (fun x : ℝ => x) 0 ≠ deriv (fun x : ℝ => x ^ 2) 0 ∧
    ∀ x : ℝ, 1 * x + x * 1 = 2 * x := by
  refine ⟨by simp, fun x => by ring⟩

/-- Razlaga 6: (f · g)' = f' · g + f · g'.
trditev: MAT-SS-4/odvod#odvod-produkta
besedilo: »$$(f \cdot g)' = f' \cdot g + f \cdot g'$$« -/
theorem odvod_produkta {f g : ℝ → ℝ} {f' g' x : ℝ} (hf : HasDerivAt f f' x) (hg : HasDerivAt g g' x) :
    HasDerivAt (fun x => f x * g x) (f' * g x + f x * g') x := hf.mul hg

/-- Predpostavki sta izpolnljivi (f = g = x). Trditev: `odvod_produkta`. -/
example : HasDerivAt (fun x : ℝ => x) 1 0 ∧ HasDerivAt (fun x : ℝ => x) 1 0 :=
  ⟨hasDerivAt_id' 0, hasDerivAt_id' 0⟩

/-- Predpostavke trditve `odvod_produkta` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : HasDerivAt (fun x : ℝ => x) 1 0 ∧ HasDerivAt (fun x : ℝ => x) 1 0 :=
    ⟨hasDerivAt_id' 0, hasDerivAt_id' 0⟩
  odvod_produkta (hf := w.1) (hg := w.2)

/-- Razlaga 6: (f/g)' = (f' · g − f · g')/g² (za g(x) ≠ 0).
trditev: MAT-SS-4/odvod#odvod-kvocienta
besedilo: »$$\left(\frac{f}{g}\right)' = \frac{f' \cdot g - f \cdot g'}{g^2}$$« -/
theorem odvod_kvocienta {f g : ℝ → ℝ} {f' g' x : ℝ} (hf : HasDerivAt f f' x) (hg : HasDerivAt g g' x)
    (hx : g x ≠ 0) : HasDerivAt (fun x => f x / g x) ((f' * g x - f x * g') / g x ^ 2) x :=
  hf.div hg hx

/-- Predpostavke trditve `odvod_kvocienta` se dajo izpolniti. -/
example : HasDerivAt (fun x : ℝ => x) 1 1 ∧ HasDerivAt (fun x : ℝ => x) 1 1 ∧ (fun x : ℝ => x) 1 ≠ 0 :=
  ⟨hasDerivAt_id' 1, hasDerivAt_id' 1, one_ne_zero⟩

/-- Predpostavke trditve `odvod_kvocienta` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : HasDerivAt (fun x : ℝ => x) 1 1 ∧ HasDerivAt (fun x : ℝ => x) 1 1 ∧ (fun x : ℝ => x) 1 ≠ 0 :=
    ⟨hasDerivAt_id' 1, hasDerivAt_id' 1, one_ne_zero⟩
  odvod_kvocienta (hf := w.1) (hg := w.2.1) (hx := w.2.2)

/-- Razlaga 6: verižno pravilo (f(g(x)))' = f'(g(x)) · g'(x).
trditev: MAT-SS-4/odvod#verizno-pravilo
besedilo: »$$\bigl(f(g(x))\bigr)' = f'(g(x)) \cdot g'(x)$$« -/
theorem verizno_pravilo {f g : ℝ → ℝ} {f' g' x : ℝ} (hf : HasDerivAt f f' (g x))
    (hg : HasDerivAt g g' x) : HasDerivAt (fun x => f (g x)) (f' * g') x := hf.comp x hg

/-- Predpostavke trditve `verizno_pravilo` se dajo izpolniti. -/
example : HasDerivAt (fun x : ℝ => x) 1 ((fun x : ℝ => x) 0) ∧ HasDerivAt (fun x : ℝ => x) 1 0 :=
  ⟨hasDerivAt_id' _, hasDerivAt_id' 0⟩

/-! ## Razlaga, 7: odvodi elementarnih funkcij -/

/-- Predpostavke trditve `verizno_pravilo` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : HasDerivAt (fun x : ℝ => x) 1 ((fun x : ℝ => x) 0) ∧ HasDerivAt (fun x : ℝ => x) 1 0 :=
    ⟨hasDerivAt_id' _, hasDerivAt_id' 0⟩
  verizno_pravilo (hf := w.1) (hg := w.2)

/-- Razlaga 7, tabela: (sin x)' = cos x, (cos x)' = −sin x, (eˣ)' = eˣ.
trditev: MAT-SS-4/odvod#elementarni-odvodi
besedilo: »| $\sin x$ | $\cos x$ | | $\cos x$ | $-\sin x$ | | $e^x$ | $e^x$ |« -/
theorem elementarni_odvodi (x : ℝ) :
    HasDerivAt sin (cos x) x ∧ HasDerivAt cos (-sin x) x ∧ HasDerivAt exp (exp x) x :=
  ⟨hasDerivAt_sin x, hasDerivAt_cos x, hasDerivAt_exp x⟩

/-- Razlaga 7, tabela: (ln x)' = 1/x za x > 0.
trditev: MAT-SS-4/odvod#odvod-ln
besedilo: »| $\ln x$ | $\frac{1}{x}$ |« -/
theorem odvod_ln (x : ℝ) (hx : 0 < x) : HasDerivAt log (1 / x) x := by
  rw [one_div]; exact hasDerivAt_log hx.ne'

/-- Predpostavke trditve `odvod_ln` se dajo izpolniti. -/
example : (0:ℝ) < 1 := one_pos

/-! ## Razlaga, 8: pravila iz definicije (višja raven) -/

/-- Predpostavke trditve `odvod_ln` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 1 := one_pos
  odvod_ln (hx := w)

/-- Razlaga 8: diferenčni količnik vsote razpade na vsoto diferenčnih količnikov.
trditev: MAT-SS-4/odvod#vsota-kvocient
besedilo: »$\frac{(f + g)(a + h) - (f + g)(a)}{h} = \frac{f(a + h) - f(a)}{h} + \frac{g(a + h) - g(a)}{h}$« -/
theorem vsota_kvocient (f g : ℝ → ℝ) (a h : ℝ) :
    ((f (a + h) + g (a + h)) - (f a + g a)) / h = (f (a + h) - f a) / h + (g (a + h) - g a) / h := by
  ring

/-- Razlaga 8: v števcu prištejemo in odštejemo f(a) g(a + h).
trditev: MAT-SS-4/odvod#produkt-kvocient
besedilo: »$$\frac{f(a + h)\,g(a + h) - f(a)\,g(a)}{h} = \frac{f(a + h) - f(a)}{h} \cdot g(a + h) + f(a) \cdot \frac{g(a + h) - g(a)}{h}$$« -/
theorem produkt_kvocient (f g : ℝ → ℝ) (a h : ℝ) :
    (f (a + h) * g (a + h) - f a * g a) / h =
      (f (a + h) - f a) / h * g (a + h) + f a * ((g (a + h) - g a) / h) := by
  ring

/-- Razlaga 8: g(a + h) − g(a) = (g(a + h) − g(a))/h · h za h ≠ 0, in ker je g odvedljiva, gre to proti
g'(a) · 0 = 0, torej g(a + h) → g(a) (odvedljiva funkcija je zvezna).
trditev: MAT-SS-4/odvod#odvedljiva-zvezna
besedilo: »$g(a + h)$ pa proti $g(a)$, ker je odvedljiva funkcija zvezna: $g(a + h) - g(a) = \frac{g(a + h) - g(a)}{h} \cdot h \to g'(a) \cdot 0 = 0$« -/
theorem odvedljiva_zvezna {g : ℝ → ℝ} {a g' : ℝ} (hg : HasDerivAt g g' a) :
    (∀ h : ℝ, h ≠ 0 → g (a + h) - g a = (g (a + h) - g a) / h * h) ∧
    Tendsto (fun h => g (a + h)) (𝓝[≠] 0) (𝓝 (g a)) := by
  refine ⟨fun h hh => by field_simp, ?_⟩
  have hq := (odvod_definicija g a g').mp hg
  have hh : Tendsto (fun h : ℝ => h) (𝓝[≠] 0) (𝓝 0) := tendsto_nhdsWithin_of_tendsto_nhds tendsto_id
  have h2 := (hq.mul hh).const_add (g a)
  rw [mul_zero, add_zero] at h2
  refine h2.congr' ?_
  filter_upwards [self_mem_nhdsWithin] with h hh0
  have : h ≠ 0 := hh0
  field_simp; ring

/-- Predpostavke trditve `odvedljiva_zvezna` se dajo izpolniti. -/
example : HasDerivAt (fun x : ℝ => x) 1 0 := hasDerivAt_id' 0

/-- Predpostavke trditve `odvedljiva_zvezna` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : HasDerivAt (fun x : ℝ => x) 1 0 := hasDerivAt_id' 0
  odvedljiva_zvezna (hg := w)

/-- Razlaga 8 in Ustno vprašanje 3: pravilo za vsoto, izpeljano iz definicije (limita vsote je vsota
limit).
trditev: MAT-SS-4/odvod#vsota-iz-definicije
besedilo: »Ko gre $h \to 0$, gre prvi ulomek proti $f'(a)$, drugi proti $g'(a)$, zato je $(f + g)'(a) = f'(a) + g'(a)$.« -/
theorem vsota_iz_definicije {f g : ℝ → ℝ} {a f' g' : ℝ} (hf : HasDerivAt f f' a)
    (hg : HasDerivAt g g' a) : HasDerivAt (fun x => f x + g x) (f' + g') a := by
  rw [odvod_definicija] at hf hg ⊢
  exact (hf.add hg).congr fun h => (vsota_kvocient f g a h).symm

/-- Predpostavke trditve `vsota_iz_definicije` se dajo izpolniti. -/
example : HasDerivAt (fun x : ℝ => x) 1 0 ∧ HasDerivAt (fun x : ℝ => x) 1 0 :=
  ⟨hasDerivAt_id' 0, hasDerivAt_id' 0⟩

/-- Predpostavke trditve `vsota_iz_definicije` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : HasDerivAt (fun x : ℝ => x) 1 0 ∧ HasDerivAt (fun x : ℝ => x) 1 0 :=
    ⟨hasDerivAt_id' 0, hasDerivAt_id' 0⟩
  vsota_iz_definicije (hf := w.1) (hg := w.2)

/-- Razlaga 8: pravilo za produkt, izpeljano iz definicije: (fg)'(a) = f'(a) g(a) + f(a) g'(a).
trditev: MAT-SS-4/odvod#produkt-iz-definicije
besedilo: »$(f g)'(a) = f'(a) g(a) + f(a) g'(a)$« -/
theorem produkt_iz_definicije {f g : ℝ → ℝ} {a f' g' : ℝ} (hf : HasDerivAt f f' a)
    (hg : HasDerivAt g g' a) : HasDerivAt (fun x => f x * g x) (f' * g a + f a * g') a := by
  have hz := (odvedljiva_zvezna hg).2
  rw [odvod_definicija] at hf hg ⊢
  exact ((hf.mul hz).add (hg.const_mul (f a))).congr fun h => (produkt_kvocient f g a h).symm

/-- Predpostavke trditve `produkt_iz_definicije` se dajo izpolniti. -/
example : HasDerivAt (fun x : ℝ => x) 1 0 ∧ HasDerivAt (fun x : ℝ => x) 1 0 :=
  ⟨hasDerivAt_id' 0, hasDerivAt_id' 0⟩

/-- Predpostavke trditve `produkt_iz_definicije` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : HasDerivAt (fun x : ℝ => x) 1 0 ∧ HasDerivAt (fun x : ℝ => x) 1 0 :=
    ⟨hasDerivAt_id' 0, hasDerivAt_id' 0⟩
  produkt_iz_definicije (hf := w.1) (hg := w.2)

/-- Razlaga 8: pravilo za konstantni faktor je poseben primer (g = c, g' = 0).
trditev: MAT-SS-4/odvod#konstanta-poseben-primer
besedilo: »Pravilo za konstantni faktor je poseben primer: pri $g = c$ je $g' = 0$.« -/
theorem konstanta_poseben_primer {f : ℝ → ℝ} {a f' : ℝ} (c : ℝ) (hf : HasDerivAt f f' a) :
    HasDerivAt (fun x => f x * c) (f' * c + f a * 0) a ∧ f' * c + f a * 0 = c * f' :=
  ⟨produkt_iz_definicije hf (hasDerivAt_const a c), by ring⟩

/-- Predpostavke trditve `konstanta_poseben_primer` se dajo izpolniti. -/
example : HasDerivAt (fun x : ℝ => x) 1 0 := hasDerivAt_id' 0

/-! ## Razlaga, 9: novi odvodi iz pravil (višja raven) -/

/-- Predpostavke trditve `konstanta_poseben_primer` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : HasDerivAt (fun x : ℝ => x) 1 0 := hasDerivAt_id' 0
  konstanta_poseben_primer (hf := w)

/-- Razlaga 9: po pravilu za kvocient z u = 1, v = x je (1/x)' = (0 · x − 1 · 1)/x² = −1/x² (x ≠ 0).
trditev: MAT-SS-4/odvod#ena-skozi-x-kvocient
besedilo: »Po pravilu za kvocient z $u = 1$ in $v = x$: $\left(\frac{1}{x}\right)' = \frac{0 \cdot x - 1 \cdot 1}{x^2} = -\frac{1}{x^2}$.« -/
theorem ena_skozi_x_kvocient (x : ℝ) (hx : x ≠ 0) :
    HasDerivAt (fun x : ℝ => 1 / x) ((0 * x - 1 * 1) / x ^ 2) x ∧
    (0 * x - 1 * 1) / x ^ 2 = -1 / x ^ 2 :=
  ⟨(hasDerivAt_const x (1:ℝ)).div (hasDerivAt_id' x) hx, by ring⟩

/-- Predpostavke trditve `ena_skozi_x_kvocient` se dajo izpolniti. -/
example : (1:ℝ) ≠ 0 := one_ne_zero

/-- Predpostavke trditve `ena_skozi_x_kvocient` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 := one_ne_zero
  ena_skozi_x_kvocient (hx := w)

/-- Razlaga 9: (tan x)' = (cos x · cos x − sin x · (−sin x))/cos² x = 1/cos² x za cos x ≠ 0.
trditev: MAT-SS-4/odvod#odvod-tangensa
besedilo: »Ker je $\tan x = \frac{\sin x}{\cos x}$, je $(\tan x)' = \frac{\cos x \cdot \cos x - \sin x \cdot (-\sin x)}{\cos^2 x} = \frac{1}{\cos^2 x}$, saj je $\sin^2 x + \cos^2 x = 1$ (za $\cos x \ne 0$).« -/
theorem odvod_tangensa (x : ℝ) (hx : cos x ≠ 0) :
    HasDerivAt (fun x => sin x / cos x)
      ((cos x * cos x - sin x * (-sin x)) / cos x ^ 2) x ∧
    (cos x * cos x - sin x * (-sin x)) / cos x ^ 2 = 1 / cos x ^ 2 ∧
    HasDerivAt tan (1 / cos x ^ 2) x := by
  refine ⟨(hasDerivAt_sin x).div (hasDerivAt_cos x) hx, ?_, hasDerivAt_tan hx⟩
  congr 1
  nlinarith [sin_sq_add_cos_sq x]

/-- Predpostavke trditve `odvod_tangensa` se dajo izpolniti. -/
example : cos (0:ℝ) ≠ 0 := by simp

/-- Predpostavke trditve `odvod_tangensa` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : cos (0:ℝ) ≠ 0 := by simp
  odvod_tangensa (hx := w)

/-- Razlaga 9: 2ˣ = e^(x ln 2) in (2ˣ)' = e^(x ln 2) · ln 2 = 2ˣ ln 2; enako (aˣ)' = aˣ ln a za a > 0.
trditev: MAT-SS-4/odvod#odvod-eksponentne
besedilo: »Ker je $2 = e^{\ln 2}$, je $2^x = e^{x \ln 2}$. Po pravilu za sestavljeno funkcijo je $(2^x)' = e^{x \ln 2} \cdot \ln 2 = 2^x \ln 2$. Enako za vsako osnovo $a > 0$: $(a^x)' = a^x \ln a$.« -/
theorem odvod_eksponentne (a : ℝ) (ha : 0 < a) (x : ℝ) :
    a ^ x = exp (x * log a) ∧
    HasDerivAt (fun x : ℝ => a ^ x) (exp (x * log a) * log a) x ∧
    exp (x * log a) * log a = a ^ x * log a := by
  have hrw : (fun x : ℝ => a ^ x) = fun x => exp (x * log a) := by
    funext y; rw [rpow_def_of_pos ha, mul_comm]
  have e : a ^ x = exp (x * log a) := congrFun hrw x
  refine ⟨e, ?_, by rw [e]⟩
  rw [hrw]
  exact ((hasDerivAt_id' x).mul_const (log a)).exp.congr_deriv (by ring)

/-- Predpostavke trditve `odvod_eksponentne` se dajo izpolniti. -/
example : (0:ℝ) < 2 := two_pos

/-- Predpostavke trditve `odvod_eksponentne` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 2 := two_pos
  odvod_eksponentne (ha := w)

/-- Razlaga 9: (2ˣ)' = 2ˣ ln 2.
trditev: MAT-SS-4/odvod#odvod-dva-na-x
besedilo: »$(2^x)' = e^{x \ln 2} \cdot \ln 2 = 2^x \ln 2$« -/
theorem odvod_dva_na_x (x : ℝ) : HasDerivAt (fun x : ℝ => (2:ℝ) ^ x) ((2:ℝ) ^ x * log 2) x := by
  obtain ⟨-, h, e⟩ := odvod_eksponentne 2 two_pos x
  exact h.congr_deriv e

/-! ## Rešeni primeri -/

/-- Primer 1, korak 1: f(1) = 1 + 3 = 4.
trditev: MAT-SS-4/odvod#primer1-f1
besedilo: »$f(1) = 1 + 3 = 4$«
besedilo-kratko: cel korak 1 -/
theorem primer1_f1 : (1:ℝ) ^ 2 + 3 * 1 = 1 + 3 ∧ (1:ℝ) + 3 = 4 := by norm_num

/-- Primer 1, korak 2: f(1 + h) = (1 + h)² + 3(1 + h) = 4 + 5h + h².
trditev: MAT-SS-4/odvod#primer1-f1h
besedilo: »$f(1 + h) = (1 + h)^2 + 3(1 + h) = 4 + 5h + h^2$« -/
theorem primer1_f1h (h : ℝ) : (1 + h) ^ 2 + 3 * (1 + h) = 4 + 5 * h + h ^ 2 := by ring

/-- Primer 1, korak 3: diferenčni količnik (4 + 5h + h² − 4)/h = (5h + h²)/h = 5 + h za h ≠ 0.
trditev: MAT-SS-4/odvod#primer1-kvocient
besedilo: »Diferenčni količnik: $\dfrac{4 + 5h + h^2 - 4}{h} = \dfrac{5h + h^2}{h} = 5 + h$ (krajšamo $h$, ker je $h \ne 0$).« -/
theorem primer1_kvocient (h : ℝ) (hh : h ≠ 0) :
    (((1 + h) ^ 2 + 3 * (1 + h)) - (1 ^ 2 + 3 * 1)) / h = 5 + h := by
  calc (((1 + h) ^ 2 + 3 * (1 + h)) - (1 ^ 2 + 3 * 1)) / h = (4 + 5 * h + h ^ 2 - 4) / h := by ring
    _ = (5 * h + h ^ 2) / h := by ring
    _ = 5 + h := by field_simp

/-- Predpostavka h ≠ 0 je izpolnljiva. Trditev: `primer1_kvocient`. -/
example : ∃ h : ℝ, h ≠ 0 := ⟨1, one_ne_zero⟩

/-- Predpostavke trditve `primer1_kvocient` se dajo izpolniti: izrek, uporabljen na primeru. -/
example : True :=
  have w : ∃ h : ℝ, h ≠ 0 := ⟨1, one_ne_zero⟩
  (fun _ => trivial) (primer1_kvocient (h := w.choose) (hh := w.choose_spec))

/-- Primer 1, korak 4 in 6: limita je 5, torej f'(1) = 5 (smerni koeficient tangente v (1, 4)).
trditev: MAT-SS-4/odvod#primer1-odvod
besedilo: »Odgovor: $f'(1) = 5$; tangenta na graf v točki $(1, 4)$ ima smerni koeficient $5$.« -/
theorem primer1_odvod : HasDerivAt (fun x : ℝ => x ^ 2 + 3 * x) 5 1 :=
  (odvod_definicija _ _ _).mpr (lim_kvocient (g := fun h => 5 + h)
    (skoraj fun h hh => primer1_kvocient h hh) (by fun_prop) (by norm_num))

/-- Primer 1, korak 5: s pravili f'(x) = 2x + 3, v 1 je 2 + 3 = 5.
trditev: MAT-SS-4/odvod#primer1-pravila
besedilo: »Preizkus s pravili: $f'(x) = 2x + 3$, pri $x = 1$ je to $2 + 3 = 5$.« -/
theorem primer1_pravila (x : ℝ) :
    HasDerivAt (fun x : ℝ => x ^ 2 + 3 * x) (2 * x + 3) x ∧ (2:ℝ) * 1 + 3 = 2 + 3 ∧ (2:ℝ) + 3 = 5 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  exact ((hasDerivAt_pow 2 x).add ((hasDerivAt_id' x).const_mul 3)).congr_deriv (by norm_num)

/-- Primer 2, koraki 1–3: za x ≠ 3 je f'(x) = (2(x − 3) − (2x + 1) · 1)/(x − 3)² in števec je
2x − 6 − 2x − 1 = −7, torej f'(x) = −7/(x − 3)².
trditev: MAT-SS-4/odvod#primer2-odvod
besedilo: »Torej $f'(x) = \dfrac{-7}{(x - 3)^2}$.« -/
theorem primer2_odvod (x : ℝ) (hx : x ≠ 3) :
    HasDerivAt (fun x : ℝ => (2 * x + 1) / (x - 3)) ((2 * (x - 3) - (2 * x + 1) * 1) / (x - 3) ^ 2) x ∧
    2 * (x - 3) - (2 * x + 1) * 1 = 2 * x - 6 - 2 * x - 1 ∧ 2 * x - 6 - 2 * x - 1 = -7 ∧
    HasDerivAt (fun x : ℝ => (2 * x + 1) / (x - 3)) (-7 / (x - 3) ^ 2) x := by
  have hne : x - 3 ≠ 0 := sub_ne_zero.mpr hx
  have h := (((hasDerivAt_id' x).const_mul 2).add_const 1).div ((hasDerivAt_id' x).sub_const 3) hne
  have h' : HasDerivAt (fun x : ℝ => (2 * x + 1) / (x - 3))
      ((2 * (x - 3) - (2 * x + 1) * 1) / (x - 3) ^ 2) x := h.congr_deriv (by ring)
  exact ⟨h', by ring, by ring, h'.congr_deriv (by ring)⟩

/-- Predpostavke trditve `primer2_odvod` se dajo izpolniti. -/
example : (4:ℝ) ≠ 3 := by norm_num

/-- Predpostavke trditve `primer2_odvod` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (4:ℝ) ≠ 3 := by norm_num
  primer2_odvod (hx := w)

/-- Primer 2, korak 4: f'(4) = −7/1² = −7.
trditev: MAT-SS-4/odvod#primer2-v-4
besedilo: »Pri $x = 4$: $f'(4) = \dfrac{-7}{1^2} = -7$.« -/
theorem primer2_v_4 : (-7:ℝ) / (4 - 3) ^ 2 = -7 / 1 ^ 2 ∧ (-7:ℝ) / 1 ^ 2 = -7 := by norm_num

/-- Primer 2, korak 5: odvod je povsod negativen, zato f pada na (−∞, 3) in na (3, ∞).
trditev: MAT-SS-4/odvod#primer2-pada
besedilo: »Ker je odvod povsod negativen, funkcija na vsakem delu definicijskega območja pada.« -/
theorem primer2_pada :
    StrictAntiOn (fun x : ℝ => (2 * x + 1) / (x - 3)) (Iio 3) ∧
    StrictAntiOn (fun x : ℝ => (2 * x + 1) / (x - 3)) (Ioi 3) := by
  have hd : ∀ x : ℝ, x ≠ 3 → deriv (fun x : ℝ => (2 * x + 1) / (x - 3)) x < 0 := by
    intro x hx
    rw [((primer2_odvod x hx).2.2.2).deriv]
    have : 0 < (x - 3) ^ 2 := by positivity [sub_ne_zero.mpr hx]
    exact div_neg_of_neg_of_pos (by norm_num) this
  have hc : ∀ x : ℝ, x ≠ 3 → ContinuousAt (fun x : ℝ => (2 * x + 1) / (x - 3)) x :=
    fun x hx => (primer2_odvod x hx).2.2.2.continuousAt
  constructor
  · refine strictAntiOn_of_deriv_neg (convex_Iio 3)
      (fun x hx => (hc x (ne_of_lt hx)).continuousWithinAt) ?_
    intro x hx; rw [interior_Iio] at hx; exact hd x (ne_of_lt hx)
  · refine strictAntiOn_of_deriv_neg (convex_Ioi 3)
      (fun x hx => (hc x (ne_of_gt hx)).continuousWithinAt) ?_
    intro x hx; rw [interior_Ioi] at hx; exact hd x (ne_of_gt hx)

/-- Povzetek in Postopek, korak 5: f' > 0 na (notranjosti) intervala ⇒ f tam strogo narašča.
trditev: MAT-SS-4/odvod#narasca
besedilo: »$f' > 0$: funkcija narašča« -/
theorem narasca {f f' : ℝ → ℝ} {D : Set ℝ} (hd : ∀ x, HasDerivAt f (f' x) x) (hD : Convex ℝ D)
    (hp : ∀ x ∈ interior D, 0 < f' x) : StrictMonoOn f D :=
  strictMonoOn_of_deriv_pos hD (fun x _ => (hd x).continuousAt.continuousWithinAt)
    fun x hx => by rw [(hd x).deriv]; exact hp x hx

/-- Povzetek in Postopek, korak 5: f' < 0 na (notranjosti) intervala ⇒ f tam strogo pada.
trditev: MAT-SS-4/odvod#pada
besedilo: »$f' < 0$: pada«
besedilo-kratko: del vrstice v Povzetku; celotna vrstica zajame še naraščanje -/
theorem pada {f f' : ℝ → ℝ} {D : Set ℝ} (hd : ∀ x, HasDerivAt f (f' x) x) (hD : Convex ℝ D)
    (hn : ∀ x ∈ interior D, f' x < 0) : StrictAntiOn f D :=
  strictAntiOn_of_deriv_neg hD (fun x _ => (hd x).continuousAt.continuousWithinAt)
    fun x hx => by rw [(hd x).deriv]; exact hn x hx

/-- Primer za `narasca` (predpostavke so izpolnljive): f(x) = x² ima f'(x) = 2x > 0 na (0, ∞), zato tam
strogo narašča. -/
example : StrictMonoOn (fun x : ℝ => x ^ 2) (Ioi 0) :=
  narasca (f' := fun x => 2 * x) (fun x => by simpa using hasDerivAt_pow 2 x) (convex_Ioi 0)
    fun x hx => by rw [interior_Ioi] at hx; simp only [mem_Ioi] at hx; linarith

/-- Primer za `pada` (predpostavke so izpolnljive): f(x) = x² ima f'(x) = 2x < 0 na (−∞, 0), zato tam
strogo pada. -/
example : StrictAntiOn (fun x : ℝ => x ^ 2) (Iio 0) :=
  pada (f' := fun x => 2 * x) (fun x => by simpa using hasDerivAt_pow 2 x) (convex_Iio 0)
    fun x hx => by rw [interior_Iio] at hx; simp only [mem_Iio] at hx; linarith

/-- Primer 3, koraka 1–2: T(t) = 180 − 30t + 1,5t², T'(t) = −30 + 3t, T'(0) = −30.
trditev: MAT-SS-4/odvod#primer3-odvod
besedilo: »Odvajamo člen za členom: $T'(t) = -30 + 3t$. 2. Na začetku: $T'(0) = -30$.« -/
theorem primer3_odvod (t : ℝ) :
    HasDerivAt (fun t : ℝ => 180 - 30 * t + 1.5 * t ^ 2) (-30 + 3 * t) t ∧ (-30:ℝ) + 3 * 0 = -30 := by
  refine ⟨?_, by norm_num⟩
  have := ((hasDerivAt_const t (180:ℝ)).sub ((hasDerivAt_id' t).const_mul 30)).add
    ((hasDerivAt_pow 2 t).const_mul 1.5)
  exact this.congr_deriv (by norm_num; ring)

/-- Primer 3, korak 3: −30 + 3t = −12 ⇔ 3t = 18 ⇔ t = 6.
trditev: MAT-SS-4/odvod#primer3-enacba
besedilo: »Ohlajanje s hitrostjo $12 ^\circ\mathrm{C/min}$ pomeni $T'(t) = -12$: $-30 + 3t = -12$, torej $3t = 18$ in $t = 6$.« -/
theorem primer3_enacba (t : ℝ) : -30 + 3 * t = -12 ↔ t = 6 := by
  calc -30 + 3 * t = -12 ↔ 3 * t = 18 := by constructor <;> intro h <;> linarith
    _ ↔ t = 6 := by constructor <;> intro h <;> linarith

/-- Primer 3, korak 4: T(6) = 180 − 180 + 54 = 54.
trditev: MAT-SS-4/odvod#primer3-t6
besedilo: »$T(6) = 180 - 180 + 54 = 54$« -/
theorem primer3_T6 : (180:ℝ) - 30 * 6 + 1.5 * 6 ^ 2 = 180 - 180 + 54 ∧ (180:ℝ) - 180 + 54 = 54 := by
  norm_num

/-- Primer 4, koraka 1–3: za sin x ≠ 0 je (cot x)' = (−sin x · sin x − cos x · cos x)/sin² x
= −(sin² x + cos² x)/sin² x = −1/sin² x.
trditev: MAT-SS-4/odvod#primer4-odvod
besedilo: »Števec je $-1$, zato je $(\cot x)' = -\dfrac{1}{\sin^2 x}$ (za $\sin x \ne 0$).« -/
theorem primer4_odvod (x : ℝ) (hx : sin x ≠ 0) :
    HasDerivAt (fun x => cos x / sin x) ((-sin x * sin x - cos x * cos x) / sin x ^ 2) x ∧
    (-sin x * sin x - cos x * cos x) / sin x ^ 2 = -(sin x ^ 2 + cos x ^ 2) / sin x ^ 2 ∧
    -(sin x ^ 2 + cos x ^ 2) / sin x ^ 2 = -1 / sin x ^ 2 ∧
    HasDerivAt cot (-1 / sin x ^ 2) x := by
  have h := (hasDerivAt_cos x).div (hasDerivAt_sin x) hx
  have e3 : -(sin x ^ 2 + cos x ^ 2) / sin x ^ 2 = -1 / sin x ^ 2 := by rw [sin_sq_add_cos_sq]
  have e1 : (-sin x * sin x - cos x * cos x) / sin x ^ 2 = -(sin x ^ 2 + cos x ^ 2) / sin x ^ 2 := by
    ring
  have hcot : cot = fun x => cos x / sin x := by funext y; exact cot_eq_cos_div_sin y
  refine ⟨h, e1, e3, ?_⟩
  rw [hcot]; exact h.congr_deriv (e1.trans e3)

/-- Predpostavke trditve `primer4_odvod` se dajo izpolniti. -/
example : sin (π / 2) ≠ 0 := by simp

/-- Predpostavke trditve `primer4_odvod` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : sin (π / 2) ≠ 0 := by simp
  primer4_odvod (hx := w)

/-- Primer 4, korak 4: sin(π/4) = √2/2, sin²(π/4) = 1/2, k = −1/(1/2) = −2.
trditev: MAT-SS-4/odvod#primer4-tocka
besedilo: »V $x_0 = \frac{\pi}{4}$ je $\sin\frac{\pi}{4} = \frac{\sqrt{2}}{2}$ in $\sin^2\frac{\pi}{4} = \frac{1}{2}$, zato je $k = -\dfrac{1}{1/2} = -2$.« -/
theorem primer4_tocka :
    sin (π / 4) = √2 / 2 ∧ sin (π / 4) ^ 2 = 1 / 2 ∧ -1 / sin (π / 4) ^ 2 = -1 / (1 / 2) ∧
    (-1:ℝ) / (1 / 2) = -2 := by
  have h2 : sin (π / 4) ^ 2 = 1 / 2 := by
    rw [sin_pi_div_four, div_pow, sq_sqrt (by norm_num : (0:ℝ) ≤ 2)]; norm_num
  exact ⟨sin_pi_div_four, h2, by rw [h2], by norm_num⟩

/-- Primer 5: f'(x) = 3(x² + 1)² · 2x = 6x(x² + 1)² in f'(1) = 6 · 1 · 2² = 24.
trditev: MAT-SS-4/odvod#primer5
besedilo: »$f'(x) = 3(x^2 + 1)^2 \cdot 2x = 6x(x^2 + 1)^2$. Pri $x = 1$: $6 \cdot 1 \cdot 2^2 = 24$.« -/
theorem primer5 (x : ℝ) :
    HasDerivAt (fun x : ℝ => (x ^ 2 + 1) ^ 3) (3 * (x ^ 2 + 1) ^ 2 * (2 * x)) x ∧
    3 * (x ^ 2 + 1) ^ 2 * (2 * x) = 6 * x * (x ^ 2 + 1) ^ 2 ∧
    (6:ℝ) * 1 * (1 ^ 2 + 1) ^ 2 = 6 * 1 * 2 ^ 2 ∧ (6:ℝ) * 1 * 2 ^ 2 = 24 := by
  refine ⟨?_, by ring, by norm_num, by norm_num⟩
  exact ((hasDerivAt_pow 2 x).add_const 1).pow 3 |>.congr_deriv (by push_cast; ring)

/-! ## Pogoste napake -/

/-- Pogoste napake 1 in Preveri se 3: (x² sin x)' = 2x sin x + x² cos x; to ni 2x cos x (npr. pri x = π/2,
kjer je prvo π, drugo 0).
trditev: MAT-SS-4/odvod#napaka-produkt
besedilo: »Produkt: $(x^2 \sin x)' = 2x \sin x + x^2 \cos x$, ne $2x \cos x$.« -/
theorem napaka_produkt (x : ℝ) :
    HasDerivAt (fun x => x ^ 2 * sin x) (2 * x * sin x + x ^ 2 * cos x) x ∧
    2 * (π / 2) * sin (π / 2) + (π / 2) ^ 2 * cos (π / 2) ≠ 2 * (π / 2) * cos (π / 2) := by
  refine ⟨((hasDerivAt_pow 2 x).mul (hasDerivAt_sin x)).congr_deriv (by push_cast; ring), ?_⟩
  simp [pi_ne_zero]

/-- Pogoste napake 3: brez notranjega odvoda bi pri x = 1 dobili 3(1² + 1)² = 12, pravi odvod pa je 24.
trditev: MAT-SS-4/odvod#napaka-notranji
besedilo: »$\bigl((x^2 + 1)^3\bigr)' = 3(x^2 + 1)^2$ je nepopolno: manjka faktor $2x$.« -/
theorem napaka_notranji : (3:ℝ) * (1 ^ 2 + 1) ^ 2 = 12 ∧ (12:ℝ) ≠ 24 := by norm_num

/-- Pogoste napake 4: pri f(x) = x² je f(2) = 4, (4)' = 0, a f'(2) = 4; (x² + 7)' = 2x.
trditev: MAT-SS-4/odvod#napaka-vstavljanje
besedilo: »Pri $f(x) = x^2$ je $f(2) = 4$ in $(4)' = 0$, a $f'(2) = 4$. Najprej odvajaj funkcijo, šele nato vstavi točko. Iz istega razloga je $(x^2 + 7)' = 2x$« -/
theorem napaka_vstavljanje (x : ℝ) :
    (2:ℝ) ^ 2 = 4 ∧ deriv (fun _ : ℝ => (4:ℝ)) 2 = 0 ∧ deriv (fun x : ℝ => x ^ 2) 2 = 4 ∧
    HasDerivAt (fun x : ℝ => x ^ 2 + 7) (2 * x) x := by
  refine ⟨by norm_num, by simp, by simp; norm_num, ?_⟩
  exact ((hasDerivAt_pow 2 x).add_const 7).congr_deriv (by norm_num)

/-! ## Za maturo -/

/-- Naloga 1, koraka 1–2: f'(x) = (x²)' e^{2x} + x² (e^{2x})' = 2x e^{2x} + x² · e^{2x} · 2
= 2x e^{2x} + 2x² e^{2x} = 2x(x + 1) e^{2x}.
trditev: MAT-SS-4/odvod#matura1-odvod
besedilo: »Po pravilu za sestavljeno funkcijo je $(e^{2x})' = e^{2x} \cdot 2$, zato $f'(x) = 2x e^{2x} + 2x^2 e^{2x} = 2x(x + 1) e^{2x}$.« -/
theorem matura1_odvod (x : ℝ) :
    HasDerivAt (fun x => x ^ 2 * exp (2 * x)) (2 * x * exp (2 * x) + x ^ 2 * (exp (2 * x) * 2)) x ∧
    2 * x * exp (2 * x) + x ^ 2 * (exp (2 * x) * 2) = 2 * x * exp (2 * x) + 2 * x ^ 2 * exp (2 * x) ∧
    2 * x * exp (2 * x) + 2 * x ^ 2 * exp (2 * x) = 2 * x * (x + 1) * exp (2 * x) := by
  refine ⟨?_, by ring, by ring⟩
  have he : HasDerivAt (fun x => exp (2 * x)) (exp (2 * x) * 2) x :=
    ((hasDerivAt_id' x).const_mul 2).exp.congr_deriv (by ring)
  exact ((hasDerivAt_pow 2 x).mul he).congr_deriv (by push_cast; ring)

/-- Naloga 1, koraka 3–4: ker je e^{2x} > 0, je 2x(x + 1)e^{2x} = 0 natanko za x = 0 ali x = −1.
trditev: MAT-SS-4/odvod#matura1-nicle
besedilo: »Ker je $e^{2x} > 0$ za vsak $x$, je $f'(x) = 0$ natanko tedaj, ko je $2x(x + 1) = 0$. 4. Odgovor: $f'(x) = 2x(x + 1)\,e^{2x}$; odvod je enak $0$ pri $x = 0$ in pri $x = -1$.« -/
theorem matura1_nicle (x : ℝ) : 2 * x * (x + 1) * exp (2 * x) = 0 ↔ x = 0 ∨ x = -1 := by
  have he : exp (2 * x) ≠ 0 := (exp_pos _).ne'
  constructor
  · intro h
    have h1 : 2 * x * (x + 1) = 0 := by
      rcases mul_eq_zero.mp h with h | h
      · exact h
      · exact absurd h he
    rcases mul_eq_zero.mp h1 with h | h
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> simp

/-- Naloga 2 a): f(1) = 4, f(4) = 1, diferenčni količnik (1 − 4)/3 = −1.
trditev: MAT-SS-4/odvod#matura2a
besedilo: »a) $f(1) = 4$ in $f(4) = 1$, zato je diferenčni količnik $\dfrac{f(4) - f(1)}{4 - 1} = \dfrac{1 - 4}{3} = -1$.« -/
theorem matura2a : (4:ℝ) / 1 = 4 ∧ (4:ℝ) / 4 = 1 ∧ ((4:ℝ) / 4 - 4 / 1) / (4 - 1) = (1 - 4) / 3 ∧
    ((1:ℝ) - 4) / 3 = -1 := by norm_num

/-- Naloga 2 b): za h ≠ 0, h ≠ −2 je (4/(2 + h) − 2)/h = (4 − 4 − 2h)/(h(2 + h)) = −2/(2 + h).
trditev: MAT-SS-4/odvod#matura2b-kvocient
besedilo: »b) $\dfrac{f(2 + h) - f(2)}{h} = \dfrac{\frac{4}{2 + h} - 2}{h} = \dfrac{4 - 4 - 2h}{h(2 + h)} = \dfrac{-2}{2 + h}$ (krajšamo $h \ne 0$).« -/
theorem matura2b_kvocient (h : ℝ) (hh : h ≠ 0) (h2 : 2 + h ≠ 0) :
    (4 / (2 + h) - 4 / 2) / h = (4 / (2 + h) - 2) / h ∧
    (4 / (2 + h) - 2) / h = (4 - 4 - 2 * h) / (h * (2 + h)) ∧
    (4 - 4 - 2 * h) / (h * (2 + h)) = -2 / (2 + h) := by
  refine ⟨by norm_num, by field_simp; ring, by field_simp; ring⟩

/-- Predpostavki sta izpolnljivi (h = 1). Trditev: `matura2b_kvocient`. -/
example : (1:ℝ) ≠ 0 ∧ (2:ℝ) + 1 ≠ 0 := by norm_num

/-- Predpostavke trditve `matura2b_kvocient` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 ∧ (2:ℝ) + 1 ≠ 0 := by norm_num
  matura2b_kvocient (hh := w.1) (h2 := w.2)

/-- Naloga 2 b): f'(2) = lim −2/(2 + h) = −1.
trditev: MAT-SS-4/odvod#matura2b-odvod
besedilo: »$f'(2) = \lim\limits_{h \to 0} \dfrac{-2}{2 + h} = -1$« -/
theorem matura2b_odvod : HasDerivAt (fun x : ℝ => 4 / x) (-1) 2 := by
  refine (odvod_definicija _ _ _).mpr (lim_kvocient (g := fun h => -2 / (2 + h)) ?_ ?_ (by norm_num))
  · have hn : ∀ᶠ h in 𝓝[≠] (0:ℝ), 2 + h ≠ 0 := by
      apply nhdsWithin_le_nhds
      have : ContinuousAt (fun h : ℝ => 2 + h) 0 := by fun_prop
      exact this.eventually_ne (by norm_num)
    filter_upwards [self_mem_nhdsWithin, hn] with h hh h2
    have := matura2b_kvocient h hh h2
    rw [this.1, this.2.1, this.2.2]
  · exact continuousAt_const.div (by fun_prop) (by norm_num)

/-- Naloga 2 (RACUN): (4/x)' = −4/x² za x ≠ 0.
pomozno -/
theorem matura2_odvod_splosno (x : ℝ) (hx : x ≠ 0) : HasDerivAt (fun x : ℝ => 4 / x) (-4 / x ^ 2) x :=
  ((hasDerivAt_const x (4:ℝ)).div (hasDerivAt_id' x) hx).congr_deriv (by ring)

/-- Predpostavke trditve `matura2_odvod_splosno` se dajo izpolniti. -/
example : (1:ℝ) ≠ 0 := one_ne_zero

/-- Predpostavke trditve `matura2_odvod_splosno` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 := one_ne_zero
  matura2_odvod_splosno (hx := w)

/-- Naloga 2 c): f(2) = 2, tangenta y = 2 − 1 · (x − 2) = −x + 4, sekanta y = 4 − (x − 1) = −x + 5;
smerna koeficienta sta enaka (−1), premici pa različni, torej vzporedni.
trditev: MAT-SS-4/odvod#matura2c
besedilo: »c) $f(2) = 2$, zato je tangenta $y = 2 - 1 \cdot (x - 2) = -x + 4$. 6. c) Sekanta iz a) je $y = 4 - (x - 1) = -x + 5$. Premici imata enak smerni koeficient $-1$, zato sta vzporedni.« -/
theorem matura2c (x : ℝ) :
    (4:ℝ) / 2 = 2 ∧ 2 - 1 * (x - 2) = -x + 4 ∧ 4 - (x - 1) = -x + 5 ∧ -x + 4 ≠ -x + 5 := by
  refine ⟨by norm_num, by ring, by ring, by intro h; linarith⟩

/-- Naloga 3 a), korak 1: za h ≠ 0 in x + h ≥ 0 je (√(x + h) − √x)/h = ((x + h) − x)/(h(√(x + h) + √x))
= 1/(√(x + h) + √x) (x > 0).
trditev: MAT-SS-4/odvod#matura3a-kvocient
besedilo: »Razširimo ga s $\sqrt{x + h} + \sqrt{x}$: $\dfrac{(x + h) - x}{h (\sqrt{x + h} + \sqrt{x})} = \dfrac{1}{\sqrt{x + h} + \sqrt{x}}$.« -/
theorem matura3a_kvocient (x h : ℝ) (hx : 0 < x) (hh : h ≠ 0) (hxh : 0 ≤ x + h) :
    (√(x + h) - √x) / h = ((x + h) - x) / (h * (√(x + h) + √x)) ∧
    ((x + h) - x) / (h * (√(x + h) + √x)) = 1 / (√(x + h) + √x) := by
  have hs : 0 < √(x + h) + √x := by positivity
  have e : (√(x + h) - √x) * (√(x + h) + √x) = (x + h) - x := by
    have := sq_sqrt hxh; have := sq_sqrt hx.le; nlinarith
  constructor
  · rw [← e]; field_simp
  · field_simp; ring

/-- Predpostavke so izpolnljive (x = 4, h = 1). Trditev: `matura3a_kvocient`. -/
example : (0:ℝ) < 4 ∧ (1:ℝ) ≠ 0 ∧ (0:ℝ) ≤ 4 + 1 := by norm_num

/-- Predpostavke trditve `matura3a_kvocient` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 4 ∧ (1:ℝ) ≠ 0 ∧ (0:ℝ) ≤ 4 + 1 := by norm_num
  matura3a_kvocient (hx := w.1) (hh := w.2.1) (hxh := w.2.2)

/-- Naloga 3 a), korak 2: limita je 1/(2√x), torej (√x)' = 1/(2√x) za x > 0.
trditev: MAT-SS-4/odvod#matura3a-odvod
besedilo: »Ko gre $h \to 0$, gre $\sqrt{x + h} \to \sqrt{x}$, zato je limita enaka $\dfrac{1}{2\sqrt{x}}$. Torej $(\sqrt{x})' = \dfrac{1}{2\sqrt{x}}$.« -/
theorem matura3a_odvod (x : ℝ) (hx : 0 < x) : HasDerivAt (fun x => √x) (1 / (2 * √x)) x := by
  refine (odvod_definicija _ _ _).mpr
    (lim_kvocient (g := fun h => 1 / (√(x + h) + √x)) ?_ ?_ ?_)
  · have hn : ∀ᶠ h in 𝓝[≠] (0:ℝ), 0 ≤ x + h := by
      apply nhdsWithin_le_nhds
      have : ContinuousAt (fun h : ℝ => x + h) 0 := by fun_prop
      exact (this.eventually (lt_mem_nhds (by simpa using hx))).mono fun h hh => hh.le
    filter_upwards [self_mem_nhdsWithin, hn] with h hh hxh
    have := matura3a_kvocient x h hx hh hxh
    rw [this.1, this.2]
  · exact continuousAt_const.div (by fun_prop) (by simp; positivity)
  · simp only [add_zero]; ring

/-- Predpostavke trditve `matura3a_odvod` se dajo izpolniti. -/
example : (0:ℝ) < 4 := by norm_num

/-- Predpostavke trditve `matura3a_odvod` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 4 := by norm_num
  matura3a_odvod (hx := w)

/-- Naloga 3 a) (RACUN): pri x = 4 je ((4 + h) − 4)/(h(√(4 + h) + 2)) = 1/(√(4 + h) + 2) za h ≠ 0, h ≥ −4,
in limita (√(4 + h) − √4)/h je 1/4.
pomozno -/
theorem matura3a_pri_4 :
    (∀ h : ℝ, h ≠ 0 → 0 ≤ 4 + h → ((4 + h) - 4) / (h * (√(4 + h) + 2)) = 1 / (√(4 + h) + 2)) ∧
    Tendsto (fun h : ℝ => (√(4 + h) - √4) / h) (𝓝[≠] 0) (𝓝 (1 / 4)) := by
  have s4 : √(4:ℝ) = 2 := by
    rw [show (4:ℝ) = 2 ^ 2 by norm_num, sqrt_sq (by norm_num)]
  refine ⟨fun h hh h4 => ?_, ?_⟩
  · have := (matura3a_kvocient 4 h (by norm_num) hh h4).2
    rwa [s4] at this
  · have := (odvod_definicija _ _ _).mp (matura3a_odvod 4 (by norm_num))
    rw [s4] at this; norm_num at this; simpa [s4] using this

/-- Naloga 3 b): za cos x ≠ −1 je (sin x/(1 + cos x))' = ((1 + cos x) cos x + sin² x)/(1 + cos x)²,
števec je cos x + cos² x + sin² x = 1 + cos x, zato je odvod 1/(1 + cos x).
trditev: MAT-SS-4/odvod#matura3b
besedilo: »b) Ker je $\sin^2 x + \cos^2 x = 1$, je števec enak $1 + \cos x$. Okrajšamo: $\dfrac{1 + \cos x}{(1 + \cos x)^2} = \dfrac{1}{1 + \cos x}$ (za $\cos x \ne -1$).« -/
theorem matura3b (x : ℝ) (hx : cos x ≠ -1) :
    HasDerivAt (fun x => sin x / (1 + cos x))
      ((cos x * (1 + cos x) - sin x * (-sin x)) / (1 + cos x) ^ 2) x ∧
    (cos x * (1 + cos x) - sin x * (-sin x)) / (1 + cos x) ^ 2 =
      ((1 + cos x) * cos x + sin x ^ 2) / (1 + cos x) ^ 2 ∧
    (1 + cos x) * cos x + sin x ^ 2 = cos x + cos x ^ 2 + sin x ^ 2 ∧
    cos x + cos x ^ 2 + sin x ^ 2 = 1 + cos x ∧
    (1 + cos x) / (1 + cos x) ^ 2 = 1 / (1 + cos x) := by
  have hne : 1 + cos x ≠ 0 := by intro h; apply hx; linarith
  refine ⟨(hasDerivAt_sin x).div ((hasDerivAt_cos x).const_add 1) hne, by ring, by ring,
    by nlinarith [sin_sq_add_cos_sq x], by field_simp⟩

/-- Predpostavke trditve `matura3b` se dajo izpolniti. -/
example : cos (0:ℝ) ≠ -1 := by simp; norm_num

/-- Predpostavke trditve `matura3b` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : cos (0:ℝ) ≠ -1 := by simp; norm_num
  matura3b (hx := w)

/-- Naloga 3 c): (√(x² + 9))' = 1/(2√(x² + 9)) · 2x = x/√(x² + 9) in f'(4) = 4/√(16 + 9) = 4/5.
trditev: MAT-SS-4/odvod#matura3c
besedilo: »c) Sestavljena funkcija z notranjo funkcijo $x^2 + 9$: $f'(x) = \dfrac{1}{2\sqrt{x^2 + 9}} \cdot 2x = \dfrac{x}{\sqrt{x^2 + 9}}$. 6. c) $f'(4) = \dfrac{4}{\sqrt{16 + 9}} = \dfrac{4}{5}$.« -/
theorem matura3c (x : ℝ) :
    HasDerivAt (fun x => √(x ^ 2 + 9)) (1 / (2 * √(x ^ 2 + 9)) * (2 * x)) x ∧
    1 / (2 * √(x ^ 2 + 9)) * (2 * x) = x / √(x ^ 2 + 9) ∧
    (4:ℝ) / √(4 ^ 2 + 9) = 4 / √(16 + 9) ∧ (4:ℝ) / √(16 + 9) = 4 / 5 := by
  have hpos : 0 < x ^ 2 + 9 := by positivity
  have hs : 0 < √(x ^ 2 + 9) := sqrt_pos.mpr hpos
  refine ⟨?_, by field_simp, by norm_num, ?_⟩
  · have h1 := hasDerivAt_sqrt hpos.ne'
    have h2 : HasDerivAt (fun x : ℝ => x ^ 2 + 9) (2 * x) x :=
      ((hasDerivAt_pow 2 x).add_const 9).congr_deriv (by norm_num)
    exact h1.comp x h2
  · rw [show (16:ℝ) + 9 = 5 ^ 2 by norm_num, sqrt_sq (by norm_num)]

/-- Naloga 3 d): na (−π/2, π/2) je 1/cos² x = 4 natanko pri x = π/3 ali x = −π/3
(cos² x = 1/4, cos x > 0, cos x = 1/2).
trditev: MAT-SS-4/odvod#matura3d
besedilo: »d) Ker je $(\tan x)' = \dfrac{1}{\cos^2 x}$, pogoj $\dfrac{1}{\cos^2 x} = 4$ da $\cos^2 x = \dfrac{1}{4}$. Na intervalu $\left(-\frac{\pi}{2}, \frac{\pi}{2}\right)$ je $\cos x > 0$, zato $\cos x = \dfrac{1}{2}$ in $x = \pm\dfrac{\pi}{3}$.« -/
theorem matura3d (x : ℝ) (hx : x ∈ Ioo (-(π / 2)) (π / 2)) :
    1 / cos x ^ 2 = 4 ↔ x = π / 3 ∨ x = -(π / 3) := by
  have hc : 0 < cos x := cos_pos_of_mem_Ioo hx
  constructor
  · intro h
    have h2 : cos x ^ 2 = 1 / 4 := by
      field_simp at h; linarith
    have h3 : cos x = 1 / 2 := by nlinarith
    have habs : |x| = π / 3 := by
      apply injOn_cos ⟨abs_nonneg x, ?_⟩ ⟨by positivity, by linarith [pi_pos]⟩
      · rw [cos_abs, h3, cos_pi_div_three]
      · have := abs_lt.mpr ⟨hx.1, hx.2⟩; linarith [pi_pos]
    rcases abs_eq (by positivity : (0:ℝ) ≤ π / 3) |>.mp habs with h | h
    · exact Or.inl h
    · exact Or.inr h
  · rintro (rfl | rfl)
    · rw [cos_pi_div_three]; norm_num
    · rw [cos_neg, cos_pi_div_three]; norm_num

/-- Predpostavka je izpolnljiva (x = π/3 leži v (−π/2, π/2)). Trditev: `matura3d`. -/
example : π / 3 ∈ Ioo (-(π / 2)) (π / 2) := ⟨by linarith [pi_pos], by linarith [pi_pos]⟩

/-- Predpostavke trditve `matura3d` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : π / 3 ∈ Ioo (-(π / 2)) (π / 2) := ⟨by linarith [pi_pos], by linarith [pi_pos]⟩
  matura3d (hx := w)

/-- Naloga 3 d): v x = ±π/3 ima tangenta na tan smerni koeficient 4, točki sta (π/3, √3) in
(−π/3, −√3).
trditev: MAT-SS-4/odvod#matura3d-tocki
besedilo: »iskani točki sta $\left(\frac{\pi}{3}, \sqrt{3}\right)$ in $\left(-\frac{\pi}{3}, -\sqrt{3}\right)$« -/
theorem matura3d_tocki :
    HasDerivAt tan 4 (π / 3) ∧ HasDerivAt tan 4 (-(π / 3)) ∧
    tan (π / 3) = √3 ∧ tan (-(π / 3)) = -√3 := by
  have c1 : cos (π / 3) ≠ 0 := by rw [cos_pi_div_three]; norm_num
  have c2 : cos (-(π / 3)) ≠ 0 := by rw [cos_neg]; exact c1
  refine ⟨(hasDerivAt_tan c1).congr_deriv ?_, (hasDerivAt_tan c2).congr_deriv ?_,
    tan_pi_div_three, by rw [tan_neg, tan_pi_div_three]⟩
  · rw [cos_pi_div_three]; norm_num
  · rw [cos_neg, cos_pi_div_three]; norm_num

/-- Naloga 3 d) (RACUN): 1/cos²(π/3) = 4.
pomozno -/
theorem matura3d_racun : 1 / cos (π / 3) ^ 2 = 4 := by rw [cos_pi_div_three]; norm_num

/-- Ustno vprašanje 2: (sin(x²))' = cos(x²) · 2x.
trditev: MAT-SS-4/odvod#ustno2
besedilo: »$\bigl(\sin(x^2)\bigr)' = \cos(x^2) \cdot 2x$« -/
theorem ustno2 (x : ℝ) : HasDerivAt (fun x => sin (x ^ 2)) (cos (x ^ 2) * (2 * x)) x := by
  have h := (hasDerivAt_sin (x ^ 2)).comp x (hasDerivAt_pow 2 x)
  exact h.congr_deriv (by norm_num)

/-! ## Drugače: korak za korakom s številkami -/

/-- Drugače: f(x) = x³, f(2) = 8, f(2,1) = 9,261 in količnik 12,61; f(2,01) = 8,120601 in 12,0601;
pri h = 0,001 je količnik 12,006001; pravilo da f'(2) = 3 · 2² = 12.
trditev: MAT-SS-4/odvod#drugace-stevila
besedilo: »Sklep: $f'(2) = 12$. Pravilo da isto: $3 \cdot 2^2 = 12$.« -/
theorem drugace_stevila :
    (2:ℝ) ^ 3 = 8 ∧ (2.1:ℝ) ^ 3 = 9.261 ∧ ((9.261:ℝ) - 8) / 0.1 = 12.61 ∧
    (2.01:ℝ) ^ 3 = 8.120601 ∧ ((8.120601:ℝ) - 8) / 0.01 = 12.0601 ∧
    ((2.001:ℝ) ^ 3 - 8) / 0.001 = 12.006001 ∧ (3:ℝ) * 2 ^ 2 = 12 ∧
    HasDerivAt (fun x : ℝ => x ^ 3) 12 2 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  exact (hasDerivAt_pow 3 (2:ℝ)).congr_deriv (by norm_num)

/-! ## Preveri se -/

/-- Preveri se 2: f(x) = 4x³ − 2x + 7 ima f'(x) = 12x² − 2, f'(1) = 12 − 2 = 10; f(1) = 9 ni odvod.
trditev: MAT-SS-4/odvod#kviz2
besedilo: »$f'(x) = 12x^2 - 2$, zato je $f'(1) = 12 - 2 = 10$.« -/
theorem kviz2 (x : ℝ) :
    HasDerivAt (fun x : ℝ => 4 * x ^ 3 - 2 * x + 7) (12 * x ^ 2 - 2) x ∧
    (12:ℝ) * 1 ^ 2 - 2 = 12 - 2 ∧ (12:ℝ) - 2 = 10 ∧ (4:ℝ) * 1 ^ 3 - 2 * 1 + 7 = 9 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  exact ((((hasDerivAt_pow 3 x).const_mul 4).sub ((hasDerivAt_id' x).const_mul 2)).add_const 7).congr_deriv
    (by push_cast; ring)

/-- Preveri se 4: f'(0,5) = 2 · 0,5 = 1 in g'(0,5) = 3 · 0,25 = 0,75, zato f tam narašča hitreje.
trditev: MAT-SS-4/odvod#kviz4
besedilo: »$f'(x) = 2x$ da $1$, $g'(x) = 3x^2$ da $3 \cdot 0{,}25 = 0{,}75$. Večji odvod pomeni hitrejše naraščanje.« -/
theorem kviz4 :
    HasDerivAt (fun x : ℝ => x ^ 2) 1 0.5 ∧ HasDerivAt (fun x : ℝ => x ^ 3) 0.75 0.5 ∧
    (3:ℝ) * 0.5 ^ 2 = 3 * 0.25 ∧ (0.75:ℝ) < 1 := by
  refine ⟨(hasDerivAt_pow 2 (0.5:ℝ)).congr_deriv (by norm_num),
    (hasDerivAt_pow 3 (0.5:ℝ)).congr_deriv (by norm_num), by norm_num, by norm_num⟩

/-- Preveri se 5: T(t) = 10 + 12t − 0,5t² ima T'(t) = 12 − t, T'(4) = 8; T(4) = 50 in povprečje
(50 − 10)/4 = 10.
trditev: MAT-SS-4/odvod#kviz5
besedilo: »$T'(t) = 12 - t$, zato je $T'(4) = 8\,^\circ\mathrm{C/min}$.« -/
theorem kviz5 (t : ℝ) :
    HasDerivAt (fun t : ℝ => 10 + 12 * t - 0.5 * t ^ 2) (12 - t) t ∧ (12:ℝ) - 4 = 8 ∧
    (10:ℝ) + 12 * 4 - 0.5 * 4 ^ 2 = 50 ∧ ((50:ℝ) - 10) / 4 = 10 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  exact (((hasDerivAt_const t (10:ℝ)).add ((hasDerivAt_id' t).const_mul 12)).sub
    ((hasDerivAt_pow 2 t).const_mul 0.5)).congr_deriv (by norm_num; ring)

/-- Preveri se 7: (1/cos x)' = (0 · cos x − 1 · (−sin x))/cos² x = sin x/cos² x (cos x ≠ 0);
pri π/6 je to (1/2)/(3/4) = 2/3 ≈ 0,67.
trditev: MAT-SS-4/odvod#kviz7
besedilo: »$f'(x) = \dfrac{0 \cdot \cos x - 1 \cdot (-\sin x)}{\cos^2 x} = \dfrac{\sin x}{\cos^2 x}$. Pri $x = \frac{\pi}{6}$: $\dfrac{1/2}{3/4} = \dfrac{2}{3} \approx 0{,}67$.« -/
theorem kviz7 (x : ℝ) (hx : cos x ≠ 0) :
    HasDerivAt (fun x => 1 / cos x) ((0 * cos x - 1 * (-sin x)) / cos x ^ 2) x ∧
    (0 * cos x - 1 * (-sin x)) / cos x ^ 2 = sin x / cos x ^ 2 ∧
    sin (π / 6) / cos (π / 6) ^ 2 = (1 / 2) / (3 / 4) ∧ ((1:ℝ) / 2) / (3 / 4) = 2 / 3 ∧
    (0.665:ℝ) ≤ 2 / 3 ∧ (2:ℝ) / 3 < 0.675 := by
  refine ⟨(hasDerivAt_const x (1:ℝ)).div (hasDerivAt_cos x) hx, by ring, ?_, by norm_num, by norm_num,
    by norm_num⟩
  rw [sin_pi_div_six, cos_pi_div_six, div_pow, sq_sqrt (by norm_num : (0:ℝ) ≤ 3)]; norm_num

/-- Predpostavke trditve `kviz7` se dajo izpolniti. -/
example : cos (0:ℝ) ≠ 0 := by simp

/-- Predpostavke trditve `kviz7` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : cos (0:ℝ) ≠ 0 := by simp
  kviz7 (hx := w)

end Evklid.Lekcije.MAT_SS_4.Odvod
