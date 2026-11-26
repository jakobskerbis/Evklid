/-
vir: content/lessons/MAT-SS-4/doloceni-integral.md
sha256: 2f9c79618c8f13ebb55b6bb617841626d13f3c033f65e3a50b1892c72433feb6
Ni v Leanu: zgodbe v uvodu in v »Drugače« (trener, kolesar, GPS, števec kilometrov, kovanci, pokal);
risbe in simulacija »Ploščina pod grafom in Riemannove vsote« (tudi trditev, da sredinsko pravilo konvergira
najhitreje); definicija določenega integrala s spodnjimi in zgornjimi vsotami za splošno zvezno funkcijo
(Mathlib integral definira po Lebesgueu; dokazane so vsote za x² na [0, 1], njihove limite in vrednost
integrala); izpeljava formule za prostornino vrtenine z rezinami (ustno vprašanje 3; formula
V = π ∫ f² je v Leanu le zapis, preverjen na stožcu); »ploščina« kot geometrijski pojem (ploščina je
zapisana kot ∫ |f| oziroma ∫ (g − f)); Preveri se, vprašanje 1 (pomen integrala hitrosti, ni računska
trditev); razlaga »Arhimed«; točkovanje maturitetnih nalog.
Opomba: `kviz3` (π ∫ (2f)² = 4 · π ∫ f²) je zapisan brez predpostavke o integrabilnosti; za f, pri kateri f²
ni integrabilna, velja le zaradi Leanovega dogovora, da je integral take funkcije 0 (obe strani sta 0).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.DoloceniIntegral

open Real intervalIntegral Filter Topology

/-- Pomožna taktika za izenačenje odvodov v verigah `HasDerivAt`. -/
local macro "odv" : tactic =>
  `(tactic| first | ring | (norm_num; done) | (norm_num; ring) | (simp; ring) | (field_simp; ring))

/-- Razlaga, blok 4: Newton-Leibnizova formula ∫ₐᵇ f(x) dx = F(b) − F(a) za zvezno f in vsako
primitivno funkcijo F (na intervalu med a in b).
trditev: MAT-SS-4/doloceni-integral#newton-leibniz
besedilo: »Ker je $A(a) = 0$, za vsako primitivno funkcijo $F$ velja **Newton-Leibnizova formula**:« -/
theorem newton_leibniz (f F : ℝ → ℝ) (a b : ℝ) (hf : ContinuousOn f (Set.uIcc a b))
    (hF : ∀ x ∈ Set.uIcc a b, HasDerivAt F (f x) x) : ∫ x in a..b, f x = F b - F a :=
  integral_eq_sub_of_hasDerivAt hF (hf.intervalIntegrable)

/-- Predpostavke trditve `newton_leibniz` se dajo izpolniti (f = 2x, F = x²). -/
example : ContinuousOn (fun x : ℝ => 2 * x) (Set.uIcc 0 1) ∧
    ∀ x ∈ Set.uIcc (0:ℝ) 1, HasDerivAt (fun x : ℝ => x ^ 2) (2 * x) x :=
  ⟨by fun_prop, fun x _ => by simpa using hasDerivAt_pow 2 x⟩

/-- Predpostavke trditve `newton_leibniz` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ContinuousOn (fun x : ℝ => 2 * x) (Set.uIcc 0 1) ∧ ∀ x ∈ Set.uIcc (0:ℝ) 1, HasDerivAt (fun x : ℝ => x ^ 2) (2 * x) x :=
    ⟨by fun_prop, fun x _ => by simpa using hasDerivAt_pow 2 x⟩
  newton_leibniz (hf := w.1) (hF := w.2)

/-- Pomožna oblika Newton-Leibnizove formule za funkcije, zvezne na vsej realni osi.
pomozno -/
theorem nl (f F : ℝ → ℝ) (a b : ℝ) (hF : ∀ x, HasDerivAt F (f x) x) (hf : Continuous f) :
    ∫ x in a..b, f x = F b - F a :=
  integral_eq_sub_of_hasDerivAt (fun x _ => hF x) (hf.intervalIntegrable a b)

/-- Predpostavke trditve `nl` se dajo izpolniti (f = 2x, F = x²). -/
example : (∀ x : ℝ, HasDerivAt (fun x : ℝ => x ^ 2) (2 * x) x) ∧ Continuous (fun x : ℝ => 2 * x) :=
  ⟨fun x => by simpa using hasDerivAt_pow 2 x, by fun_prop⟩

/-- Razlaga, blok 4, in ustno vprašanje 2: ploščina A(x) = ∫ₐˣ f(t) dt zvezne funkcije f ima odvod
A'(x) = f(x), je torej primitivna funkcija integranda, in A(a) = 0.
trditev: MAT-SS-4/doloceni-integral#ploscinska-funkcija
besedilo: »Če je $F$ katera koli primitivna funkcija zvezne funkcije $f$ na intervalu $[a, b]$, velja $\int_a^b f(x)\,dx = F(b) - F(a)$.« -/
theorem ploscinska_funkcija (f : ℝ → ℝ) (hf : Continuous f) (a x : ℝ) :
    HasDerivAt (fun u => ∫ t in a..u, f t) (f x) x ∧ ∫ t in a..a, f t = 0 :=
  ⟨(hf.integral_hasStrictDerivAt a x).hasDerivAt, integral_same⟩

/-- Predpostavka trditve `ploscinska_funkcija` se da izpolniti (f = x²). -/
example : Continuous (fun x : ℝ => x ^ 2) := by fun_prop

/-- Predpostavke trditve `ploscinska_funkcija` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Continuous (fun x : ℝ => x ^ 2) := by fun_prop
  ploscinska_funkcija (hf := w)

/-- Razlaga, blok 4, in ustno vprašanje 2: konstanta C se v razliki izniči,
(F(b) + C) − (F(a) + C) = F(b) − F(a).
trditev: MAT-SS-4/doloceni-integral#konstanta-se-izgubi
besedilo: »se v razliki $\bigl(F(b) + C\bigr) - \bigl(F(a) + C\bigr)$ konstanta odšteje,« -/
theorem konstanta_se_izgubi (F : ℝ → ℝ) (a b C : ℝ) : (F b + C) - (F a + C) = F b - F a := by ring

/-- Razlaga, blok 1: pravokotnik 10 s × 6 m/s ima ploščino 60 m, tj. ∫₀¹⁰ 6 dt = 60.
trditev: MAT-SS-4/doloceni-integral#kolesar
besedilo: »Lik pod njo je pravokotnik s stranicama $10\,\mathrm{s}$ in $6\,\mathrm{m/s}$, njegova ploščina pa je $60\,\mathrm{m}$, ravno prevožena pot.« -/
theorem kolesar : ∫ _t in (0:ℝ)..10, (6:ℝ) = 60 := by
  rw [integral_const]; norm_num

/-- Spodnja vsota za x² na [0, 1] z n deli (višina na levem robu). -/
noncomputable def spodnja (n : ℕ) : ℝ := ∑ i ∈ Finset.range n, (1 / n) * ((i : ℝ) / n) ^ 2

/-- Zgornja vsota za x² na [0, 1] z n deli (višina na desnem robu). -/
noncomputable def zgornja (n : ℕ) : ℝ := ∑ i ∈ Finset.range n, (1 / n) * (((i : ℝ) + 1) / n) ^ 2

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem vsota_kvadratov (n : ℕ) :
    ∑ i ∈ Finset.range n, (i : ℝ) ^ 2 = ((n : ℝ) - 1) * n * (2 * n - 1) / 6 := by
  induction n with
  | zero => simp
  | succ k ih => rw [Finset.sum_range_succ, ih]; push_cast; ring

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem vsota_kvadratov' (n : ℕ) :
    ∑ i ∈ Finset.range n, ((i : ℝ) + 1) ^ 2 = ((n : ℝ) + 1) * n * (2 * n + 1) / 6 := by
  induction n with
  | zero => simp
  | succ k ih => rw [Finset.sum_range_succ, ih]; push_cast; ring

/-- Razlaga, blok 2: za n ≥ 1 je spodnja vsota (n − 1)(2n − 1)/(6n²).
trditev: MAT-SS-4/doloceni-integral#spodnja-formula
besedilo: »njihova skupna ploščina je **spodnja vsota**.« -/
theorem spodnja_formula (n : ℕ) (hn : n ≠ 0) :
    spodnja n = ((n : ℝ) - 1) * (2 * n - 1) / (6 * n ^ 2) := by
  have hn' : (n : ℝ) ≠ 0 := by exact_mod_cast hn
  unfold spodnja
  simp_rw [div_pow, ← Finset.mul_sum, ← Finset.sum_div, vsota_kvadratov]
  field_simp

/-- Razlaga, blok 2: za n ≥ 1 je zgornja vsota (n + 1)(2n + 1)/(6n²).
trditev: MAT-SS-4/doloceni-integral#zgornja-formula
besedilo: »to je **zgornja vsota**.« -/
theorem zgornja_formula (n : ℕ) (hn : n ≠ 0) :
    zgornja n = ((n : ℝ) + 1) * (2 * n + 1) / (6 * n ^ 2) := by
  have hn' : (n : ℝ) ≠ 0 := by exact_mod_cast hn
  unfold zgornja
  simp_rw [div_pow, ← Finset.mul_sum, ← Finset.sum_div, vsota_kvadratov']
  field_simp

/-- Predpostavka trditev `spodnja_formula` in `zgornja_formula` se da izpolniti (n = 4). -/
example : (4 : ℕ) ≠ 0 := by norm_num

/-- Predpostavke trditve `zgornja_formula` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (4 : ℕ) ≠ 0 := by norm_num
  zgornja_formula (hn := w)

/-- Predpostavke trditve `spodnja_formula` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (4 : ℕ) ≠ 0 := by norm_num
  spodnja_formula (hn := w)

/-- Razlaga, blok 2, tabela: pri n = 4 sta vsoti 0,21875 in 0,46875.
trditev: MAT-SS-4/doloceni-integral#tabela-4
besedilo: »| $4$ | $0{,}21875$ | $0{,}46875$ |« -/
theorem tabela_4 : spodnja 4 = 0.21875 ∧ zgornja 4 = 0.46875 := by
  rw [spodnja_formula 4 (by norm_num), zgornja_formula 4 (by norm_num)]; norm_num

/-- Razlaga, blok 2, tabela: pri n = 10 sta vsoti 0,285 in 0,385.
trditev: MAT-SS-4/doloceni-integral#tabela-10
besedilo: »| $10$ | $0{,}285$ | $0{,}385$ |« -/
theorem tabela_10 : spodnja 10 = 0.285 ∧ zgornja 10 = 0.385 := by
  rw [spodnja_formula 10 (by norm_num), zgornja_formula 10 (by norm_num)]; norm_num

/-- Razlaga, blok 2, tabela: pri n = 100 sta vsoti 0,32835 in 0,33835.
trditev: MAT-SS-4/doloceni-integral#tabela-100
besedilo: »| $100$ | $0{,}32835$ | $0{,}33835$ |« -/
theorem tabela_100 : spodnja 100 = 0.32835 ∧ zgornja 100 = 0.33835 := by
  rw [spodnja_formula 100 (by norm_num), zgornja_formula 100 (by norm_num)]; norm_num

/-- Razlaga, blok 2, in prvi »Premisli«: razlika zgornje in spodnje vsote je 1/n
(0,25; 0,1; 0,01 in pri n = 1000 0,001).
trditev: MAT-SS-4/doloceni-integral#razlika-vsot
besedilo: »Razlika med zgornjo in spodnjo vsoto je bila $0{,}25$; $0{,}1$ in $0{,}01$. Kolikšna bo pri $n = 1000$? Zakaj se tako lepo zmanjšuje?« -/
theorem razlika_vsot (n : ℕ) (hn : n ≠ 0) : zgornja n - spodnja n = 1 / n := by
  have hn' : (n : ℝ) ≠ 0 := by exact_mod_cast hn
  rw [zgornja_formula n hn, spodnja_formula n hn]; field_simp; ring

/-- Predpostavka trditve `razlika_vsot` se da izpolniti (n = 1000). -/
example : (1000 : ℕ) ≠ 0 := by norm_num

/-- Predpostavke trditve `razlika_vsot` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1000 : ℕ) ≠ 0 := by norm_num
  razlika_vsot (hn := w)

/-- Prvi »Premisli«: pri n = 1000 je razlika 0,001.
trditev: MAT-SS-4/doloceni-integral#razlika-1000
besedilo: »$0{,}001$.« -/
theorem razlika_1000 : zgornja 1000 - spodnja 1000 = 0.001 := by
  rw [razlika_vsot 1000 (by norm_num)]; norm_num

/-- Razlaga, blok 2: prava ploščina 1/3 je med vsotama, spodnja < 1/3 < zgornja za vsak n ≥ 1.
trditev: MAT-SS-4/doloceni-integral#vsoti-okoli-tretjine
besedilo: »Zgornja vsota ima iste pravokotnike kot spodnja,« -/
theorem vsoti_okoli_tretjine (n : ℕ) (hn : n ≠ 0) : spodnja n < 1 / 3 ∧ 1 / 3 < zgornja n := by
  have hpos : (0 : ℝ) < n := by exact_mod_cast Nat.pos_of_ne_zero hn
  have hn1 : (1 : ℝ) ≤ n := by exact_mod_cast Nat.one_le_iff_ne_zero.mpr hn
  rw [spodnja_formula n hn, zgornja_formula n hn]
  constructor
  · rw [div_lt_iff₀ (by positivity)]; nlinarith
  · rw [lt_div_iff₀ (by positivity)]; nlinarith

/-- Predpostavka trditve `vsoti_okoli_tretjine` se da izpolniti (n = 1). -/
example : (1 : ℕ) ≠ 0 := by norm_num

/-- Predpostavke trditve `vsoti_okoli_tretjine` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℕ) ≠ 0 := by norm_num
  vsoti_okoli_tretjine (hn := w)

/-- Razlaga, blok 2: obe vsoti se stiskata k istemu številu 1/3.
trditev: MAT-SS-4/doloceni-integral#vsoti-limita
besedilo: »Obe vsoti se stiskata k istemu številu, $\frac{1}{3}$.« -/
theorem vsoti_limita : Tendsto spodnja atTop (𝓝 (1 / 3)) ∧ Tendsto zgornja atTop (𝓝 (1 / 3)) := by
  have hu := (tendsto_one_div_atTop_nhds_zero_nat (𝕜 := ℝ))
  have h1 : Tendsto (fun n : ℕ => 1 / 3 - 1 / 2 * (1 / (n : ℝ)) + 1 / 6 * (1 / (n : ℝ)) ^ 2) atTop
      (𝓝 (1 / 3)) := by
    have := ((tendsto_const_nhds (x := (1 / 3 : ℝ))).sub (hu.const_mul (1 / 2))).add
      ((hu.pow 2).const_mul (1 / 6))
    simpa using this
  have h2 : Tendsto (fun n : ℕ => 1 / 3 + 1 / 2 * (1 / (n : ℝ)) + 1 / 6 * (1 / (n : ℝ)) ^ 2) atTop
      (𝓝 (1 / 3)) := by
    have := ((tendsto_const_nhds (x := (1 / 3 : ℝ))).add (hu.const_mul (1 / 2))).add
      ((hu.pow 2).const_mul (1 / 6))
    simpa using this
  constructor
  · refine h1.congr' ?_
    filter_upwards [eventually_ne_atTop 0] with n hn
    have hn' : (n : ℝ) ≠ 0 := by exact_mod_cast hn
    rw [spodnja_formula n hn]; field_simp; ring
  · refine h2.congr' ?_
    filter_upwards [eventually_ne_atTop 0] with n hn
    have hn' : (n : ℝ) ≠ 0 := by exact_mod_cast hn
    rw [zgornja_formula n hn]; field_simp; ring

/-- Razlaga, bloka 2 in 4: ∫₀¹ x² dx = F(1) − F(0) = 1/3 za F(x) = x³/3.
trditev: MAT-SS-4/doloceni-integral#integral-x2
besedilo: »za $f(x) = x^2$ je $F(x) = \frac{x^3}{3}$ in $F(1) - F(0) = \frac{1}{3}$,« -/
theorem integral_x2 : ∫ x in (0:ℝ)..1, x ^ 2 = 1 / 3 := by
  calc ∫ x in (0:ℝ)..1, x ^ 2 = 1 ^ 3 / 3 - 0 ^ 3 / 3 :=
        nl (fun x => x ^ 2) (fun x => x ^ 3 / 3) 0 1
          (fun x => by simpa using (hasDerivAt_pow 3 x).div_const 3) (by fun_prop)
    _ = 1 / 3 := by norm_num

/-- Razlaga, blok 5, »Premisli«: ∫₋₁¹ x³ dx = 0.
trditev: MAT-SS-4/doloceni-integral#integral-x3-simetricen
besedilo: »$2 \cdot \int_0^1 x^3\,dx = 2 \cdot \frac{1}{4} = \frac{1}{2}$« -/
theorem integral_x3_simetricen : ∫ x in (-1:ℝ)..1, x ^ 3 = 0 := by
  rw [integral_pow]; norm_num

/-- Razlaga, blok 5, »Premisli«: ploščina lika med y = x³ in osjo x na [−1, 1] je
∫₋₁¹ |x³| dx = 2 · ∫₀¹ x³ dx = 2 · 1/4 = 1/2.
trditev: MAT-SS-4/doloceni-integral#ploscina-x3
besedilo: »Ploščina pa je $2 \cdot \int_0^1 x^3\,dx = 2 \cdot \frac{1}{4} = \frac{1}{2}$.« -/
theorem ploscina_x3 : ∫ x in (-1:ℝ)..1, |x ^ 3| = 2 * ∫ x in (0:ℝ)..1, x ^ 3 ∧
    2 * ∫ x in (0:ℝ)..1, x ^ 3 = 1 / 2 := by
  have hc : Continuous (fun x : ℝ => |x ^ 3|) := by fun_prop
  have hsplit := integral_add_adjacent_intervals (hc.intervalIntegrable (μ := MeasureTheory.volume) (-1) 0)
    (hc.intervalIntegrable 0 1)
  have h1 : ∫ x in (-1:ℝ)..0, |x ^ 3| = ∫ x in (-1:ℝ)..0, -x ^ 3 := by
    refine integral_congr (fun x hx => ?_)
    rw [Set.uIcc_of_le (by norm_num)] at hx
    rw [abs_of_nonpos (by nlinarith [hx.2, sq_nonneg x])]
  have h2 : ∫ x in (0:ℝ)..1, |x ^ 3| = ∫ x in (0:ℝ)..1, x ^ 3 := by
    refine integral_congr (fun x hx => ?_)
    rw [Set.uIcc_of_le (by norm_num)] at hx
    rw [abs_of_nonneg (by have := hx.1; positivity)]
  have h3 : ∫ x in (0:ℝ)..1, x ^ 3 = 1 / 4 := by rw [integral_pow]; norm_num
  refine ⟨?_, by rw [h3]; norm_num⟩
  rw [← hsplit, h1, h2, integral_neg, integral_pow, h3]; norm_num

/-- Razlaga, blok 6: enaki meji, ∫ₐᵃ f dx = 0.
trditev: MAT-SS-4/doloceni-integral#enaki-meji
besedilo: »Enaki meji.** $\int_a^a f(x)\,dx = F(a) - F(a) = 0$:« -/
theorem enaki_meji (f : ℝ → ℝ) (a : ℝ) : ∫ x in a..a, f x = 0 := integral_same

/-- Razlaga, blok 6: zamenjava mej, ∫_b^a f dx = −∫ₐᵇ f dx.
trditev: MAT-SS-4/doloceni-integral#zamenjava-mej
besedilo: »Zamenjava mej.** $\int_b^a f(x)\,dx = F(a) - F(b) = -\int_a^b f(x)\,dx$:« -/
theorem zamenjava_mej (f : ℝ → ℝ) (a b : ℝ) : ∫ x in b..a, f x = -∫ x in a..b, f x := integral_symm a b

/-- Razlaga, blok 6: aditivnost, ∫ₐᵇ f + ∫_b^c f = ∫ₐᶜ f (za zvezno f, tudi če b ni med a in c).
trditev: MAT-SS-4/doloceni-integral#aditivnost
besedilo: »Aditivnost glede na interval.** $\int_a^b f(x)\,dx + \int_b^c f(x)\,dx = \int_a^c f(x)\,dx$, saj je $\bigl(F(b) - F(a)\bigr) + \bigl(F(c) - F(b)\bigr) = F(c) - F(a)$.« -/
theorem aditivnost (f : ℝ → ℝ) (hf : Continuous f) (a b c : ℝ) :
    (∫ x in a..b, f x) + ∫ x in b..c, f x = ∫ x in a..c, f x :=
  integral_add_adjacent_intervals (hf.intervalIntegrable a b) (hf.intervalIntegrable b c)

/-- Predpostavka trditve `aditivnost` se da izpolniti (f = x²). -/
example : Continuous (fun x : ℝ => x ^ 2) := by fun_prop

/-- Predpostavke trditve `aditivnost` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Continuous (fun x : ℝ => x ^ 2) := by fun_prop
  aditivnost (hf := w)

/-- Razlaga, blok 6: (F(b) − F(a)) + (F(c) − F(b)) = F(c) − F(a).
trditev: MAT-SS-4/doloceni-integral#aditivnost-f
besedilo: »$\bigl(F(b) - F(a)\bigr) + \bigl(F(c) - F(b)\bigr) = F(c) - F(a)$« -/
theorem aditivnost_F (F : ℝ → ℝ) (a b c : ℝ) : (F b - F a) + (F c - F b) = F c - F a := by ring

/-- Razlaga, blok 6: linearnost, ∫ (f + g) = ∫ f + ∫ g in ∫ k f = k ∫ f (za zvezni f, g).
trditev: MAT-SS-4/doloceni-integral#linearnost
besedilo: »Linearnost.** Integral vsote je vsota integralov, $\int_a^b \bigl(f(x) + g(x)\bigr)\,dx = \int_a^b f(x)\,dx + \int_a^b g(x)\,dx$, konstantni faktor pa izpostavimo: $\int_a^b k\,f(x)\,dx = k\int_a^b f(x)\,dx$.« -/
theorem linearnost (f g : ℝ → ℝ) (hf : Continuous f) (hg : Continuous g) (a b k : ℝ) :
    ∫ x in a..b, (f x + g x) = (∫ x in a..b, f x) + ∫ x in a..b, g x ∧
      ∫ x in a..b, k * f x = k * ∫ x in a..b, f x :=
  ⟨integral_add (hf.intervalIntegrable a b) (hg.intervalIntegrable a b), integral_const_mul k _⟩

/-- Predpostavke trditve `linearnost` se dajo izpolniti (f = x, g = x²). -/
example : Continuous (fun x : ℝ => x) ∧ Continuous (fun x : ℝ => x ^ 2) := ⟨by fun_prop, by fun_prop⟩

/-- Predpostavke trditve `linearnost` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Continuous (fun x : ℝ => x) ∧ Continuous (fun x : ℝ => x ^ 2) := ⟨by fun_prop, by fun_prop⟩
  linearnost (hf := w.1) (hg := w.2)

/-- Pomožna trditev za primere k predpostavkam: ∫ₐᵇ (px + q) dx = p(b² − a²)/2 + q(b − a).
pomozno -/
theorem linearna (p q a b : ℝ) : ∫ x in a..b, (p * x + q) = p * (b ^ 2 - a ^ 2) / 2 + q * (b - a) := by
  rw [nl _ (fun x => p * x ^ 2 / 2 + q * x) a b
    (fun x => (((hasDerivAt_pow 2 x).const_mul p).div_const 2 |>.add ((hasDerivAt_id' x).const_mul q)).congr_deriv
      (by odv)) (by fun_prop)]
  ring

/-- Razlaga, blok 6, številski zgled: iz ∫₀² f = 3 in ∫₀⁵ f = 7 sledi ∫₂⁵ f = 7 − 3 = 4 in ∫₅² f = −4.
trditev: MAT-SS-4/doloceni-integral#zgled-aditivnost
besedilo: »Številski zgled: če je $\int_0^2 f(x)\,dx = 3$ in $\int_0^5 f(x)\,dx = 7$, je $\int_2^5 f(x)\,dx = 7 - 3 = 4$ in $\int_5^2 f(x)\,dx = -4$.« -/
theorem zgled_aditivnost (f : ℝ → ℝ) (hf : Continuous f) (h2 : ∫ x in (0:ℝ)..2, f x = 3)
    (h5 : ∫ x in (0:ℝ)..5, f x = 7) : ∫ x in (2:ℝ)..5, f x = 4 ∧ ∫ x in (5:ℝ)..2, f x = -4 := by
  have h := aditivnost f hf 0 2 5
  have h25 : ∫ x in (2:ℝ)..5, f x = 7 - 3 := by linarith
  refine ⟨by rw [h25]; norm_num, ?_⟩
  rw [zamenjava_mej, h25]; norm_num

/-- Predpostavke trditve `zgled_aditivnost` se dajo izpolniti (f(x) = −x/15 + 47/30). -/
example : ∃ f : ℝ → ℝ, Continuous f ∧ ∫ x in (0:ℝ)..2, f x = 3 ∧ ∫ x in (0:ℝ)..5, f x = 7 := by
  -- f(x) = p x + q: ∫₀² = 2p + 2q = 3, ∫₀⁵ = 25p/2 + 5q = 7 ⇒ p = −1/15, q = 47/30
  refine ⟨fun x => -1 / 15 * x + 47 / 30, by fun_prop, ?_, ?_⟩ <;>
  · beta_reduce; rw [linearna]; norm_num

/-- Predpostavke trditve `zgled_aditivnost` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ f : ℝ → ℝ, Continuous f ∧ ∫ x in (0:ℝ)..2, f x = 3 ∧ ∫ x in (0:ℝ)..5, f x = 7 := by
    -- f(x) = p x + q: ∫₀² = 2p + 2q = 3, ∫₀⁵ = 25p/2 + 5q = 7 ⇒ p = −1/15, q = 47/30
    refine ⟨fun x => -1 / 15 * x + 47 / 30, by fun_prop, ?_, ?_⟩ <;>
    · beta_reduce; rw [linearna]; norm_num
  zgled_aditivnost (hf := w.choose_spec.1) (h2 := w.choose_spec.2.1) (h5 := w.choose_spec.2.2)

/-- Razlaga, blok 7, in »Pogoste napake«: če je g ≥ f na [a, b], je ∫ₐᵇ (g − f) ≥ 0, obratna razlika
(spodnja minus zgornja) pa da ∫ₐᵇ (f − g) = −∫ₐᵇ (g − f) ≤ 0.
trditev: MAT-SS-4/doloceni-integral#med-krivuljama
besedilo: »Ploščina med krivuljama.** Če je na intervalu $[a, b]$ graf $g$ ves čas nad grafom $f$, je ploščina vmes $\int_a^b \bigl(g(x) - f(x)\bigr)\,dx$: zgornja minus spodnja.« -/
theorem med_krivuljama (f g : ℝ → ℝ) (a b : ℝ) (hab : a ≤ b) (h : ∀ x ∈ Set.Icc a b, f x ≤ g x) :
    0 ≤ ∫ x in a..b, (g x - f x) ∧ ∫ x in a..b, (f x - g x) ≤ 0 := by
  have h1 : 0 ≤ ∫ x in a..b, (g x - f x) := integral_nonneg hab (fun x hx => by linarith [h x hx])
  refine ⟨h1, ?_⟩
  have : ∫ x in a..b, (f x - g x) = -∫ x in a..b, (g x - f x) := by
    rw [← integral_neg]; congr 1; ext x; ring
  linarith

/-- Predpostavke trditve `med_krivuljama` se dajo izpolniti (f = x + 2, g = 4 − x² na [−2, 1]). -/
example : (-2 : ℝ) ≤ 1 ∧ ∀ x ∈ Set.Icc (-2:ℝ) 1, x + 2 ≤ 4 - x ^ 2 :=
  ⟨by norm_num, fun x hx => by nlinarith [hx.1, hx.2]⟩

/-- Predpostavke trditve `med_krivuljama` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (-2 : ℝ) ≤ 1 ∧ ∀ x ∈ Set.Icc (-2:ℝ) 1, x + 2 ≤ 4 - x ^ 2 :=
    ⟨by norm_num, fun x hx => by nlinarith [hx.1, hx.2]⟩
  med_krivuljama (hab := w.1) (h := w.2)

/-- Primer 1, korak 1: F(t) = 2t² − t³/6 ima odvod 4t − 0,5t².
trditev: MAT-SS-4/doloceni-integral#primer1-f
besedilo: »Primitivna funkcija po členih: $F(t) = 2t^2 - \frac{t^3}{6}$. Preizkus z odvajanjem: $F'(t) = 4t - 0{,}5t^2$.« -/
theorem primer1_F (t : ℝ) : HasDerivAt (fun t : ℝ => 2 * t ^ 2 - t ^ 3 / 6) (4 * t - 0.5 * t ^ 2) t := by
  have := ((hasDerivAt_pow 2 t).const_mul (2:ℝ)).sub ((hasDerivAt_pow 3 t).div_const 6)
  exact this.congr_deriv (by odv)

/-- Primer 1, koraki 2–4: s = ∫₀⁴ (4t − 0,5t²) dt = F(4) − F(0) = (32 − 64/6) − 0 = 64/3.
trditev: MAT-SS-4/doloceni-integral#primer1
besedilo: »Primitivna funkcija po členih: $F(t) = 2t^2 - \frac{t^3}{6}$. Preizkus z odvajanjem: $F'(t) = 4t - 0{,}5t^2$.« -/
theorem primer1 : ∫ t in (0:ℝ)..4, (4 * t - 0.5 * t ^ 2) = 64 / 3 := by
  calc ∫ t in (0:ℝ)..4, (4 * t - 0.5 * t ^ 2)
      = (2 * 4 ^ 2 - 4 ^ 3 / 6) - (2 * 0 ^ 2 - 0 ^ 3 / 6) :=
        nl (fun t => 4 * t - 0.5 * t ^ 2) (fun t => 2 * t ^ 2 - t ^ 3 / 6) 0 4 primer1_F (by fun_prop)
    _ = (32 - 64 / 6) - 0 := by norm_num
    _ = 64 / 3 := by norm_num

/-- Primer 1, koraka 2 in 4: 64/3 ≈ 21,33 ≈ 21,3 (zaokroženo na stotinko oziroma desetinko).
trditev: MAT-SS-4/doloceni-integral#primer1-priblizek
besedilo: »$F(4) = 32 - \frac{64}{6} = \frac{64}{3} \approx 21{,}33$« -/
theorem primer1_priblizek : |(64 / 3 : ℝ) - 21.33| < 0.005 ∧ |(64 / 3 : ℝ) - 21.3| < 0.05 := by
  constructor <;> rw [abs_lt] <;> constructor <;> norm_num

/-- Primer 1, odgovor: v(4) = 16 − 8 = 8 m/s.
trditev: MAT-SS-4/doloceni-integral#primer1-v4
besedilo: »$v(4) = 8\,\mathrm{m/s}$« -/
theorem primer1_v4 : (4 : ℝ) * 4 - 0.5 * 4 ^ 2 = 8 := by norm_num

/-- Primer 2, korak 1: x² − 2x − 3 = (x − 3)(x + 1); ničli sta 3 in −1.
trditev: MAT-SS-4/doloceni-integral#primer2-nicle
besedilo: »Ničle: $x^2 - 2x - 3 = (x - 3)(x + 1)$, na intervalu leži ničla $x = 3$.« -/
theorem primer2_nicle (x : ℝ) : x ^ 2 - 2 * x - 3 = (x - 3) * (x + 1) ∧
    (x ^ 2 - 2 * x - 3 = 0 ↔ x = 3 ∨ x = -1) := by
  have h : x ^ 2 - 2 * x - 3 = (x - 3) * (x + 1) := by ring
  refine ⟨h, ?_⟩
  rw [h, mul_eq_zero]
  constructor
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · rintro (h | h)
    · left; linarith
    · right; linarith

/-- Primer 2, korak 1: na [0, 3] je graf pod osjo, na [3, 4] nad njo.
trditev: MAT-SS-4/doloceni-integral#primer2-predznak
besedilo: »Ničle: $x^2 - 2x - 3 = (x - 3)(x + 1)$, na intervalu leži ničla $x = 3$. Na $[0, 3]$ je graf pod osjo, na $[3, 4]$ nad njo.« -/
theorem primer2_predznak :
    (∀ x ∈ Set.Icc (0:ℝ) 3, x ^ 2 - 2 * x - 3 ≤ 0) ∧ (∀ x ∈ Set.Icc (3:ℝ) 4, 0 ≤ x ^ 2 - 2 * x - 3) :=
  ⟨fun x hx => by nlinarith [hx.1, hx.2], fun x hx => by nlinarith [hx.1, hx.2]⟩

/-- Primitivna funkcija iz primera 2: F(x) = x³/3 − x² − 3x.
trditev: MAT-SS-4/doloceni-integral#primer2-f
besedilo: »Primitivna funkcija: $F(x) = \frac{x^3}{3} - x^2 - 3x$, zato je $F(0) = 0$, $F(3) = -9$ in $F(4) = -\frac{20}{3}$.« -/
theorem primer2_F (x : ℝ) :
    HasDerivAt (fun x : ℝ => x ^ 3 / 3 - x ^ 2 - 3 * x) (x ^ 2 - 2 * x - 3) x := by
  have := (((hasDerivAt_pow 3 x).div_const 3).sub (hasDerivAt_pow 2 x)).sub
    ((hasDerivAt_id' x).const_mul (3:ℝ))
  exact this.congr_deriv (by odv)

/-- Primer 2, korak 2: F(0) = 0, F(3) = −9, F(4) = −20/3.
trditev: MAT-SS-4/doloceni-integral#primer2-vrednosti
besedilo: »Primitivna funkcija: $F(x) = \frac{x^3}{3} - x^2 - 3x$, zato je $F(0) = 0$, $F(3) = -9$ in $F(4) = -\frac{20}{3}$.« -/
theorem primer2_vrednosti : (0:ℝ) ^ 3 / 3 - 0 ^ 2 - 3 * 0 = 0 ∧ (3:ℝ) ^ 3 / 3 - 3 ^ 2 - 3 * 3 = -9 ∧
    (4:ℝ) ^ 3 / 3 - 4 ^ 2 - 3 * 4 = -20 / 3 := by norm_num

/-- Primer 2, korak 3: ∫₀³ f dx = −9 − 0 = −9.
trditev: MAT-SS-4/doloceni-integral#primer2-del1
besedilo: »$\int_0^3 f(x)\,dx = -9 - 0 = -9$« -/
theorem primer2_del1 : ∫ x in (0:ℝ)..3, (x ^ 2 - 2 * x - 3) = -9 := by
  calc ∫ x in (0:ℝ)..3, (x ^ 2 - 2 * x - 3) = -9 - 0 := by
        rw [nl _ _ 0 3 primer2_F (by fun_prop)]; norm_num
    _ = -9 := by norm_num

/-- Primer 2, korak 4: ∫₃⁴ f dx = −20/3 + 9 = 7/3.
trditev: MAT-SS-4/doloceni-integral#primer2-del2
besedilo: »$\int_3^4 f(x)\,dx = -\frac{20}{3} + 9 = \frac{7}{3}$« -/
theorem primer2_del2 : ∫ x in (3:ℝ)..4, (x ^ 2 - 2 * x - 3) = 7 / 3 := by
  calc ∫ x in (3:ℝ)..4, (x ^ 2 - 2 * x - 3) = -20 / 3 + 9 := by
        rw [nl _ _ 3 4 primer2_F (by fun_prop)]; norm_num
    _ = 7 / 3 := by norm_num

/-- Primer 2, odgovor in »Pogoste napake«: integral čez cel interval je le −20/3.
trditev: MAT-SS-4/doloceni-integral#primer2-cel
besedilo: »Odgovor: ploščina je $\frac{34}{3}$. Integral čez cel interval bi dal le $-\frac{20}{3}$, ker se dela odštejeta.« -/
theorem primer2_cel : ∫ x in (0:ℝ)..4, (x ^ 2 - 2 * x - 3) = -20 / 3 := by
  rw [nl _ _ 0 4 primer2_F (by fun_prop)]; norm_num

/-- Primer 2, koraka 5–6: ploščina p = ∫₀⁴ |x² − 2x − 3| dx = 9 + 7/3 = 34/3 ≈ 11,33.
trditev: MAT-SS-4/doloceni-integral#primer2-ploscina
besedilo: »$p = 9 + \frac{7}{3} = \frac{34}{3} \approx 11{,}33$« -/
theorem primer2_ploscina : ∫ x in (0:ℝ)..4, |x ^ 2 - 2 * x - 3| = 34 / 3 ∧
    |(34 / 3 : ℝ) - 11.33| < 0.005 := by
  have hc : Continuous (fun x : ℝ => |x ^ 2 - 2 * x - 3|) := by fun_prop
  have hsplit := aditivnost _ hc 0 3 4
  have h1 : ∫ x in (0:ℝ)..3, |x ^ 2 - 2 * x - 3| = -∫ x in (0:ℝ)..3, (x ^ 2 - 2 * x - 3) := by
    rw [← integral_neg]
    refine integral_congr (fun x hx => ?_)
    rw [Set.uIcc_of_le (by norm_num)] at hx
    exact abs_of_nonpos (primer2_predznak.1 x hx)
  have h2 : ∫ x in (3:ℝ)..4, |x ^ 2 - 2 * x - 3| = ∫ x in (3:ℝ)..4, (x ^ 2 - 2 * x - 3) := by
    refine integral_congr (fun x hx => ?_)
    rw [Set.uIcc_of_le (by norm_num)] at hx
    exact abs_of_nonneg (primer2_predznak.2 x hx)
  refine ⟨?_, by rw [abs_lt]; constructor <;> norm_num⟩
  calc ∫ x in (0:ℝ)..4, |x ^ 2 - 2 * x - 3| = 9 + 7 / 3 := by
        rw [← hsplit, h1, h2, primer2_del1, primer2_del2]; norm_num
    _ = 34 / 3 := by norm_num

/-- Primer 3 a): iz ∫₀⁶ f = 10 in ∫₂⁶ f = 4 (f zvezna na [0, 6]) sledi ∫₀² f = 10 − 4 = 6.
Primer 3 b): ∫₀⁶ (3f − 2) = 3 · 10 − ∫₀⁶ 2 = 30 − 12 = 18 in ∫₆⁰ (3f − 2) = −18.
trditev: MAT-SS-4/doloceni-integral#primer3ab
besedilo: »Funkcija $f$ je zvezna na $[0, 6]$. Znano je $\int_0^6 f(x)\,dx = 10$ in $\int_2^6 f(x)\,dx = 4$. Izračunaj a) $\int_0^2 f(x)\,dx$ in b) $\int_6^0 \bigl(3f(x) - 2\bigr)\,dx$. c) Z aditivnostjo izračunaj še $\int_{-1}^{2} |x|\,dx$.« -/
theorem primer3ab (f : ℝ → ℝ) (hf : ContinuousOn f (Set.Icc 0 6))
    (h06 : ∫ x in (0:ℝ)..6, f x = 10) (h26 : ∫ x in (2:ℝ)..6, f x = 4) :
    ∫ x in (0:ℝ)..2, f x = 6 ∧ ∫ x in (0:ℝ)..6, (3 * f x - 2) = 18 ∧
      ∫ x in (6:ℝ)..0, (3 * f x - 2) = -18 := by
  have hi : IntervalIntegrable f MeasureTheory.volume 0 6 := hf.intervalIntegrable_of_Icc (by norm_num)
  have hi02 : IntervalIntegrable f MeasureTheory.volume 0 2 :=
    hi.mono_set (by rw [Set.uIcc_of_le (by norm_num), Set.uIcc_of_le (by norm_num)];
                    exact Set.Icc_subset_Icc le_rfl (by norm_num))
  have hi26 : IntervalIntegrable f MeasureTheory.volume 2 6 :=
    hi.mono_set (by rw [Set.uIcc_of_le (by norm_num), Set.uIcc_of_le (by norm_num)];
                    exact Set.Icc_subset_Icc (by norm_num) le_rfl)
  have ha := integral_add_adjacent_intervals hi02 hi26
  have h18 : ∫ x in (0:ℝ)..6, (3 * f x - 2) = 18 := by
    calc ∫ x in (0:ℝ)..6, (3 * f x - 2) = 3 * 10 - ∫ _x in (0:ℝ)..6, (2:ℝ) := by
          rw [integral_sub (hi.const_mul 3) intervalIntegrable_const, integral_const_mul, h06]
      _ = 30 - 12 := by rw [integral_const]; norm_num
      _ = 18 := by norm_num
  refine ⟨?_, h18, ?_⟩
  · calc ∫ x in (0:ℝ)..2, f x = 10 - 4 := by linarith
      _ = 6 := by norm_num
  · rw [integral_symm, h18]

/-- Predpostavke trditve `primer3ab` se dajo izpolniti (f(x) = −2x/3 + 11/3). -/
example : ∃ f : ℝ → ℝ, ContinuousOn f (Set.Icc 0 6) ∧ ∫ x in (0:ℝ)..6, f x = 10 ∧
    ∫ x in (2:ℝ)..6, f x = 4 := by
  -- ∫₀⁶ = 18p + 6q = 10, ∫₂⁶ = 16p + 4q = 4 ⇒ p = −2/3, q = 11/3
  refine ⟨fun x => -2 / 3 * x + 11 / 3, by fun_prop, ?_, ?_⟩ <;>
  · beta_reduce; rw [linearna]; norm_num

/-- Predpostavke trditve `primer3ab` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ f : ℝ → ℝ, ContinuousOn f (Set.Icc 0 6) ∧ ∫ x in (0:ℝ)..6, f x = 10 ∧ ∫ x in (2:ℝ)..6, f x = 4 := by
    -- ∫₀⁶ = 18p + 6q = 10, ∫₂⁶ = 16p + 4q = 4 ⇒ p = −2/3, q = 11/3
    refine ⟨fun x => -2 / 3 * x + 11 / 3, by fun_prop, ?_, ?_⟩ <;>
    · beta_reduce; rw [linearna]; norm_num
  primer3ab (hf := w.choose_spec.1) (h06 := w.choose_spec.2.1) (h26 := w.choose_spec.2.2)

/-- Primer 3 c): ∫₋₁² |x| dx = ∫₋₁⁰ (−x) dx + ∫₀² x dx = 1/2 + 2 = 5/2.
trditev: MAT-SS-4/doloceni-integral#primer3c
besedilo: »c) $\int_{-1}^{0} (-x)\,dx = -\frac{x^2}{2}\Big|_{-1}^{0} = 0 + \frac{1}{2} = \frac{1}{2}$ in $\int_0^2 x\,dx = \frac{x^2}{2}\Big|_0^2 = 2$.« -/
theorem primer3c : ∫ x in (-1:ℝ)..2, |x| = (∫ x in (-1:ℝ)..0, -x) + ∫ x in (0:ℝ)..2, x ∧
    ∫ x in (-1:ℝ)..0, -x = 1 / 2 ∧ ∫ x in (0:ℝ)..2, x = 2 ∧ (1 / 2 : ℝ) + 2 = 5 / 2 := by
  have hc : Continuous (fun x : ℝ => |x|) := by fun_prop
  have hsplit := aditivnost _ hc (-1) 0 2
  have h1 : ∫ x in (-1:ℝ)..0, |x| = ∫ x in (-1:ℝ)..0, -x := by
    refine integral_congr (fun x hx => ?_)
    rw [Set.uIcc_of_le (by norm_num)] at hx
    exact abs_of_nonpos hx.2
  have h2 : ∫ x in (0:ℝ)..2, |x| = ∫ x in (0:ℝ)..2, x := by
    refine integral_congr (fun x hx => ?_)
    rw [Set.uIcc_of_le (by norm_num)] at hx
    exact abs_of_nonneg hx.1
  refine ⟨by rw [← hsplit, h1, h2], ?_, ?_, by norm_num⟩
  · rw [integral_neg, integral_id]; norm_num
  · rw [integral_id]; norm_num

/-- Primer 3 c), preizkus z liki: (1 · 1)/2 + (2 · 2)/2 = 5/2.
trditev: MAT-SS-4/doloceni-integral#primer3c-liki
besedilo: »c) Seštejemo: $\frac{1}{2} + 2 = \frac{5}{2}$. Preizkus z liki: pod grafom sta trikotnika s ploščinama $\frac{1 \cdot 1}{2}$ in $\frac{2 \cdot 2}{2}$.« -/
theorem primer3c_liki : (1 * 1 : ℝ) / 2 + 2 * 2 / 2 = 5 / 2 := by norm_num

/-- Primer 4, korak 1: f(0) = 9 in f(15) = 0 za f(x) = 9 − x²/25.
trditev: MAT-SS-4/doloceni-integral#primer4-obris
besedilo: »Njen obris opišemo s parabolo $f(x) = 9 - \frac{x^2}{25}$ za $-15 \le x \le 15$ (vse v centimetrih).« -/
theorem primer4_obris : (9 : ℝ) - 0 ^ 2 / 25 = 9 ∧ (9 : ℝ) - 15 ^ 2 / 25 = 0 := by norm_num

/-- Primer 4, korak 2: f(x)² = 81 − 18x²/25 + x⁴/625.
trditev: MAT-SS-4/doloceni-integral#primer4-kvadrat
besedilo: »$f(x)^2 = 81 - \frac{18x^2}{25} + \frac{x^4}{625}$« -/
theorem primer4_kvadrat (x : ℝ) : (9 - x ^ 2 / 25) ^ 2 = 81 - 18 * x ^ 2 / 25 + x ^ 4 / 625 := by ring

/-- Primer 4, korak 4: G(x) = 81x − 6x³/25 + x⁵/3125 je primitivna funkcija za f(x)².
trditev: MAT-SS-4/doloceni-integral#primer4-g
besedilo: »Primitivna funkcija: $G(x) = 81x - \frac{6x^3}{25} + \frac{x^5}{3125}$, $G(0) = 0$.« -/
theorem primer4_G (x : ℝ) :
    HasDerivAt (fun x : ℝ => 81 * x - 6 * x ^ 3 / 25 + x ^ 5 / 3125) ((9 - x ^ 2 / 25) ^ 2) x := by
  have := (((hasDerivAt_id' x).const_mul (81:ℝ)).sub (((hasDerivAt_pow 3 x).const_mul (6:ℝ)).div_const 25)).add
    ((hasDerivAt_pow 5 x).div_const 3125)
  exact this.congr_deriv (by odv)

/-- Primer 4, koraka 3 in 5: ∫₋₁₅¹⁵ f² = 2 ∫₀¹⁵ f², G(0) = 0 in G(15) = 1215 − 810 + 243 = 648.
trditev: MAT-SS-4/doloceni-integral#primer4-integral
besedilo: »$G(15) = 1215 - 810 + 243 = 648$« -/
theorem primer4_integral : ∫ x in (-15:ℝ)..15, (9 - x ^ 2 / 25) ^ 2 = 2 * ∫ x in (0:ℝ)..15, (9 - x ^ 2 / 25) ^ 2 ∧
    ∫ x in (0:ℝ)..15, (9 - x ^ 2 / 25) ^ 2 = 648 := by
  have h0 : ∫ x in (0:ℝ)..15, (9 - x ^ 2 / 25) ^ 2 = 648 := by
    calc ∫ x in (0:ℝ)..15, (9 - x ^ 2 / 25) ^ 2 = (1215 - 810 + 243) - 0 := by
          rw [nl _ _ 0 15 primer4_G (by fun_prop)]; norm_num
      _ = 648 := by norm_num
  refine ⟨?_, h0⟩
  rw [h0, nl _ _ (-15) 15 primer4_G (by fun_prop)]; norm_num

/-- Primer 4, koraki 6–8: V = 2π · 648 = 1296π ≈ 4071,5 cm³ ≈ 4,07 L ≈ 4,1 L.
trditev: MAT-SS-4/doloceni-integral#primer4-v
besedilo: »$V = 2\pi \cdot 648 = 1296\pi \approx 4071{,}5\,\mathrm{cm^3}$« -/
theorem primer4_V : π * ∫ x in (-15:ℝ)..15, (9 - x ^ 2 / 25) ^ 2 = 1296 * π ∧
    |1296 * π - 4071.5| < 0.05 ∧ |1296 * π / 1000 - 4.07| < 0.005 ∧ |1296 * π / 1000 - 4.1| < 0.05 := by
  obtain ⟨h1, h2⟩ := primer4_integral
  have p1 := pi_gt_d6
  have p2 := pi_lt_d6
  refine ⟨by rw [h1, h2]; ring, ?_, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Primer 5 (premisli): V = π ∫₀³⁰ (x/3)² dx = π · 27000/27 = 1000π ≈ 3142 cm³ ≈ 3,1 L, kar je
enako π r² h/3 pri r = 10, h = 30.
trditev: MAT-SS-4/doloceni-integral#primer5
besedilo: »$\int_0^{30} \frac{x^2}{9}\,dx = \frac{x^3}{27}\Big|_0^{30} = \frac{27000}{27} = 1000$, torej $V = 1000\pi \approx 3142\,\mathrm{cm^3} \approx 3{,}1\,\mathrm{L}$. Enako da formula za stožec $\frac{\pi r^2 h}{3}$.« -/
theorem primer5 : π * ∫ x in (0:ℝ)..30, (x / 3) ^ 2 = 1000 * π ∧ |1000 * π - 3142| < 0.5 ∧
    |1000 * π / 1000 - 3.1| < 0.05 ∧ π * 10 ^ 2 * 30 / 3 = 1000 * π := by
  have p1 := pi_gt_d6
  have p2 := pi_lt_d6
  have hF : ∀ x : ℝ, HasDerivAt (fun x : ℝ => x ^ 3 / 27) ((x / 3) ^ 2) x := fun x =>
    ((hasDerivAt_pow 3 x).div_const 27).congr_deriv (by odv)
  refine ⟨?_, ?_, ?_, by ring⟩
  · calc π * ∫ x in (0:ℝ)..30, (x / 3) ^ 2 = π * (27000 / 27 - 0) := by
          rw [nl _ _ 0 30 hF (by fun_prop)]; norm_num
      _ = 1000 * π := by ring
  all_goals rw [abs_lt]; constructor <;> linarith

/-- Pogoste napake, »Prostornina brez kvadrata« (preizkus s stožcem): za stožec z višino h > 0 in
polmerom r je π ∫₀ʰ (r x/h)² dx = π r² h/3.
trditev: MAT-SS-4/doloceni-integral#stozec
besedilo: »Pomaga preizkus s stožcem: formula mora dati $\frac{\pi r^2 h}{3}$.« -/
theorem stozec (r h : ℝ) (hh : 0 < h) : π * ∫ x in (0:ℝ)..h, (r * x / h) ^ 2 = π * r ^ 2 * h / 3 := by
  have hF : ∀ x : ℝ, HasDerivAt (fun x : ℝ => r ^ 2 * x ^ 3 / (3 * h ^ 2)) ((r * x / h) ^ 2) x := fun x =>
    (((hasDerivAt_pow 3 x).const_mul (r ^ 2)).div_const (3 * h ^ 2)).congr_deriv
      (by field_simp; ring)
  rw [nl _ _ 0 h hF (by fun_prop)]
  field_simp; ring

/-- Predpostavka trditve `stozec` se da izpolniti (h = 30). -/
example : (0 : ℝ) < 30 := by norm_num

/-- Predpostavke trditve `stozec` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 30 := by norm_num
  stozec (hh := w)

/-- Pogoste napake, »F(0) je vedno 0«: za F(x) = −cos x je F(0) = −1, za F(x) = eˣ je F(0) = 1.
trditev: MAT-SS-4/doloceni-integral#f0-ni-0
besedilo: »$F(0)$ je vedno $0$.** Pri potencah drži, pri drugih funkcijah ne: za $F(x) = -\cos x$ je $F(0) = -1$, za $F(x) = e^x$ je $F(0) = 1$.« -/
theorem F0_ni_0 : -cos (0:ℝ) = -1 ∧ exp (0:ℝ) = 1 := by simp

/-- Pogoste napake, »Meji v napačnem vrstnem redu«: F(a) − F(b) = −(F(b) − F(a)).
trditev: MAT-SS-4/doloceni-integral#napacni-red
besedilo: »Meji v napačnem vrstnem redu.** $F(a) - F(b)$ da nasprotno predznačen rezultat. Vedno je »zgornja minus spodnja«: $F(b) - F(a)$.« -/
theorem napacni_red (F : ℝ → ℝ) (a b : ℝ) : F a - F b = -(F b - F a) := by ring

/-- Matura, naloga 1 (in vrstica `integral` bloka RACUN): ∫₀^{π/2} (3 sin x + 2 cos x) dx =
F(π/2) − F(0) = (−3 · 0 + 2 · 1) − (−3 · 1 + 2 · 0) = 2 − (−3) = 5.
trditev: MAT-SS-4/doloceni-integral#matura1
besedilo: »$\int_0^{\pi/2} (3\sin x + 2\cos x)\,dx = F\!\left(\frac{\pi}{2}\right) - F(0) = 2 - (-3) = 5$« -/
theorem matura1 : ∫ x in (0:ℝ)..(π / 2), (3 * sin x + 2 * cos x) = 5 := by
  have hF : ∀ x : ℝ, HasDerivAt (fun x : ℝ => -3 * cos x + 2 * sin x) (3 * sin x + 2 * cos x) x :=
    fun x => (((hasDerivAt_cos x).const_mul (-3:ℝ)).add ((hasDerivAt_sin x).const_mul (2:ℝ))).congr_deriv
      (by ring)
  calc ∫ x in (0:ℝ)..(π / 2), (3 * sin x + 2 * cos x)
      = (-3 * cos (π / 2) + 2 * sin (π / 2)) - (-3 * cos 0 + 2 * sin 0) := nl _ _ 0 (π / 2) hF (by fun_prop)
    _ = (-3 * 0 + 2 * 1) - (-3 * 1 + 2 * 0) := by simp
    _ = 2 - (-3) := by norm_num
    _ = 5 := by norm_num

/-- Matura, naloga 2 a) (in vrstica `resi: 4-x^2=x+2`): 4 − x² = x + 2 ⇔ x² + x − 2 = 0 ⇔
(x + 2)(x − 1) = 0 ⇔ x = −2 ali x = 1.
trditev: MAT-SS-4/doloceni-integral#matura2a
besedilo: »a) Enačbo $4 - x^2 = x + 2$ preuredimo v $x^2 + x - 2 = 0$, torej $(x + 2)(x - 1) = 0$ in $x_1 = -2$, $x_2 = 1$.« -/
theorem matura2a (x : ℝ) : 4 - x ^ 2 = x + 2 ↔ x = -2 ∨ x = 1 := by
  calc 4 - x ^ 2 = x + 2 ↔ x ^ 2 + x - 2 = 0 := by constructor <;> intro h <;> linarith
    _ ↔ (x + 2) * (x - 1) = 0 := by rw [show x ^ 2 + x - 2 = (x + 2) * (x - 1) by ring]
    _ ↔ x = -2 ∨ x = 1 := by
        rw [mul_eq_zero]
        constructor
        · rintro (h | h)
          · left; linarith
          · right; linarith
        · rintro (h | h)
          · left; linarith
          · right; linarith

/-- Matura, naloga 2 a): f(−2) = 0 in f(1) = 3, presečišči sta P₁(−2, 0) in P₂(1, 3).
trditev: MAT-SS-4/doloceni-integral#matura2a-tocki
besedilo: »a) $f(-2) = 0$ in $f(1) = 3$, zato sta presečišči $P_1(-2, 0)$ in $P_2(1, 3)$.« -/
theorem matura2a_tocki : (-2 : ℝ) + 2 = 0 ∧ (1 : ℝ) + 2 = 3 ∧ (4 : ℝ) - (-2) ^ 2 = 0 ∧ (4 : ℝ) - 1 ^ 2 = 3 := by
  norm_num

/-- Matura, naloga 2 b) in c), korak 7: na [−2, 1] je 0 ≤ f(x) ≤ g(x) (parabola nad premico, premica
nad osjo x); npr. g(0) = 4 > f(0) = 2.
trditev: MAT-SS-4/doloceni-integral#matura2-lega
besedilo: »b) Na $[-2, 1]$ je parabola nad premico (na primer $g(0) = 4 > f(0) = 2$), zato je ploščina $p = \int_{-2}^{1} \bigl(g(x) - f(x)\bigr)\,dx = \int_{-2}^{1} (2 - x - x^2)\,dx$.« -/
theorem matura2_lega : ∀ x ∈ Set.Icc (-2:ℝ) 1, 0 ≤ x + 2 ∧ x + 2 ≤ 4 - x ^ 2 :=
  fun x hx => ⟨by linarith [hx.1], by nlinarith [hx.1, hx.2]⟩

/-- Matura, naloga 2 b) (in vrstici `integral`, `vrednost`): p = ∫₋₂¹ (g − f) dx = ∫₋₂¹ (2 − x − x²) dx
= H(1) − H(−2) = 7/6 − (−10/3) = 7/6 + 20/6 = 27/6 = 9/2, kjer je H(1) = 2 − 1/2 − 1/3 = 7/6 in
H(−2) = −4 − 2 + 8/3 = −10/3.
trditev: MAT-SS-4/doloceni-integral#matura2b
besedilo: »b) Primitivna funkcija je $H(x) = 2x - \frac{x^2}{2} - \frac{x^3}{3}$, zato je $H(1) = 2 - \frac{1}{2} - \frac{1}{3} = \frac{7}{6}$ in $H(-2) = -4 - 2 + \frac{8}{3} = -\frac{10}{3}$.« -/
theorem matura2b : ∫ x in (-2:ℝ)..1, ((4 - x ^ 2) - (x + 2)) = 9 / 2 := by
  have hH : ∀ x : ℝ, HasDerivAt (fun x : ℝ => 2 * x - x ^ 2 / 2 - x ^ 3 / 3) ((4 - x ^ 2) - (x + 2)) x :=
    fun x => ((((hasDerivAt_id' x).const_mul (2:ℝ)).sub ((hasDerivAt_pow 2 x).div_const 2)).sub
      ((hasDerivAt_pow 3 x).div_const 3)).congr_deriv (by odv)
  calc ∫ x in (-2:ℝ)..1, ((4 - x ^ 2) - (x + 2))
      = (2 * 1 - 1 ^ 2 / 2 - 1 ^ 3 / 3) - (2 * (-2) - (-2) ^ 2 / 2 - (-2) ^ 3 / 3) :=
        nl _ _ (-2) 1 hH (by fun_prop)
    _ = (2 - 1 / 2 - 1 / 3) - (-4 - 2 + 8 / 3) := by norm_num
    _ = 7 / 6 - (-10 / 3) := by norm_num
    _ = 7 / 6 + 20 / 6 := by norm_num
    _ = 27 / 6 := by norm_num
    _ = 9 / 2 := by norm_num

/-- Matura, naloga 2 c) (in vrstici `integral`, `vrednost`): ničli g sta −2 in 2, med njima je g ≥ 0;
p₁ = ∫₋₂² (4 − x²) dx = 16/3 − (−16/3) = 32/3, delež (9/2)/(32/3) = 27/64 ≈ 42 %.
trditev: MAT-SS-4/doloceni-integral#matura2c
besedilo: »c) Ničli funkcije $g$ sta $-2$ in $2$, med njima je graf nad osjo $x$: $p_1 = \int_{-2}^{2} (4 - x^2)\,dx = \left(4x - \frac{x^3}{3}\right)\Big|_{-2}^{2} = \frac{16}{3} - \left(-\frac{16}{3}\right) = \frac{32}{3}$.« -/
theorem matura2c : (∀ x : ℝ, 4 - x ^ 2 = 0 ↔ x = -2 ∨ x = 2) ∧
    (∀ x ∈ Set.Icc (-2:ℝ) 2, 0 ≤ 4 - x ^ 2) ∧
    ∫ x in (-2:ℝ)..2, (4 - x ^ 2) = 32 / 3 ∧ (9 / 2 : ℝ) / (32 / 3) = 27 / 64 ∧
    |(27 / 64 : ℝ) - 0.42| < 0.005 := by
  have hG : ∀ x : ℝ, HasDerivAt (fun x : ℝ => 4 * x - x ^ 3 / 3) (4 - x ^ 2) x :=
    fun x => (((hasDerivAt_id' x).const_mul (4:ℝ)).sub ((hasDerivAt_pow 3 x).div_const 3)).congr_deriv
      (by odv)
  refine ⟨fun x => ?_, fun x hx => by nlinarith [hx.1, hx.2], ?_, by norm_num,
    by rw [abs_lt]; constructor <;> norm_num⟩
  · rw [show 4 - x ^ 2 = (2 + x) * (2 - x) by ring, mul_eq_zero]
    constructor
    · rintro (h | h)
      · left; linarith
      · right; linarith
    · rintro (h | h)
      · left; linarith
      · right; linarith
  · calc ∫ x in (-2:ℝ)..2, (4 - x ^ 2) = (4 * 2 - 2 ^ 3 / 3) - (4 * (-2) - (-2) ^ 3 / 3) :=
          nl _ _ (-2) 2 hG (by fun_prop)
      _ = 16 / 3 - (-16 / 3) := by norm_num
      _ = 32 / 3 := by norm_num

/-- Matura, naloga 3 a): f(4) = 12/2 = 6, f(16) = 12/4 = 3, višina 16 − 4 = 12.
trditev: MAT-SS-4/doloceni-integral#matura3a
besedilo: »a) $f(4) = \frac{12}{2} = 6$ in $f(16) = \frac{12}{4} = 3$, zato sta polmera $6\,\mathrm{cm}$ in $3\,\mathrm{cm}$; višina je $16 - 4 = 12$, torej $12\,\mathrm{cm}$.« -/
theorem matura3a : 12 / √(4:ℝ) = 6 ∧ 12 / √(16:ℝ) = 3 ∧ (16:ℝ) - 4 = 12 := by
  have h4 : √(4:ℝ) = 2 := by rw [show (4:ℝ) = 2 ^ 2 by norm_num, sqrt_sq (by norm_num)]
  have h16 : √(16:ℝ) = 4 := by rw [show (16:ℝ) = 4 ^ 2 by norm_num, sqrt_sq (by norm_num)]
  rw [h4, h16]; norm_num

/-- Matura, naloga 3 b), koraki 2–4 (in vrstici `integral`, `vrednost`): f(x)² = 144/x za x > 0 in
V = π ∫₄¹⁶ 144/x dx = 144π(ln 16 − ln 4) = 144π ln 4 ≈ 627,14 cm³ (≈ 627 cm³).
trditev: MAT-SS-4/doloceni-integral#matura3b
besedilo: »$V = 144\pi(\ln 16 - \ln 4) = 144\pi\ln 4 \approx 627{,}14\,\mathrm{cm^3}$« -/
theorem matura3b : (∀ x : ℝ, 0 < x → (12 / √x) ^ 2 = 144 / x) ∧
    π * ∫ x in (4:ℝ)..16, (12 / √x) ^ 2 = 144 * π * (log 16 - log 4) ∧
    144 * π * (log 16 - log 4) = 144 * π * log 4 ∧
    |144 * π * log 4 - 627.14| < 0.005 ∧ |144 * π * log 4 - 627| < 0.5 := by
  have hsq : ∀ x : ℝ, 0 < x → (12 / √x) ^ 2 = 144 / x := fun x hx => by
    rw [div_pow, sq_sqrt hx.le]; norm_num
  have hl4 : log 16 - log 4 = log 4 := by
    rw [← log_div (by norm_num) (by norm_num)]; norm_num
  have hlog4 : log (4:ℝ) = 2 * log 2 := by
    rw [show (4:ℝ) = 2 ^ 2 by norm_num, log_pow]; norm_num
  have p1 := pi_gt_d6
  have p2 := pi_lt_d6
  have l1 := log_two_gt_d9
  have l2 := log_two_lt_d9
  refine ⟨hsq, ?_, by rw [hl4], ?_, ?_⟩
  · have hc : ∫ x in (4:ℝ)..16, (12 / √x) ^ 2 = ∫ x in (4:ℝ)..16, 144 * x⁻¹ := by
      refine integral_congr (fun x hx => ?_)
      rw [Set.uIcc_of_le (by norm_num)] at hx
      rw [hsq x (by linarith [hx.1]), div_eq_mul_inv]
    rw [hc, integral_const_mul, integral_inv_of_pos (by norm_num) (by norm_num),
      log_div (by norm_num) (by norm_num)]
    ring
  all_goals
    rw [hlog4, abs_lt]
    constructor <;> nlinarith [mul_lt_mul'' p1 l1 (by norm_num) (by norm_num),
      mul_lt_mul'' p2 l2 (by positivity) (by positivity)]

/-- Matura, naloga 3 c) (in vrstica `resi`): za 4 < c je prostornina dela π ∫₄ᶜ 144/x dx = 144π ln(c/4),
in 144π ln(c/4) = 72π ln 4 natanko pri c = 8 (ln(c/4) = ½ ln 4 = ln 2, c/4 = 2).
trditev: MAT-SS-4/doloceni-integral#matura3c
besedilo: »c) Prostornina dela med $x = 4$ in $x = c$ je $\pi \int_4^{c} \frac{144}{x}\,dx = 144\pi\ln\frac{c}{4}$ in mora biti enaka $\frac{V}{2} = 72\pi\ln 4$.« -/
theorem matura3c (c : ℝ) (hc : 4 < c) :
    π * ∫ x in (4:ℝ)..c, (12 / √x) ^ 2 = 144 * π * log (c / 4) ∧
      (144 * π * log (c / 4) = 72 * π * log 4 ↔ c = 8) := by
  have hc0 : 0 < c := by linarith
  have hsq : ∀ x : ℝ, 0 < x → (12 / √x) ^ 2 = 144 * x⁻¹ := fun x hx => by
    rw [div_pow, sq_sqrt hx.le]; ring
  refine ⟨?_, ?_⟩
  · have h : ∫ x in (4:ℝ)..c, (12 / √x) ^ 2 = ∫ x in (4:ℝ)..c, 144 * x⁻¹ := by
      refine integral_congr (fun x hx => ?_)
      rw [Set.uIcc_of_le hc.le] at hx
      exact hsq x (by linarith [hx.1])
    rw [h, integral_const_mul, integral_inv_of_pos (by norm_num) hc0]; ring
  · have hlog4 : log (4:ℝ) = 2 * log 2 := by
      rw [show (4:ℝ) = 2 ^ 2 by norm_num, log_pow]; norm_num
    have hpi := pi_pos
    calc 144 * π * log (c / 4) = 72 * π * log 4 ↔ log (c / 4) = log 2 := by
          rw [hlog4]; constructor <;> intro h
          · nlinarith
          · rw [h]; ring
      _ ↔ c / 4 = 2 := by
          constructor
          · intro h; exact log_injOn_pos (by simp; positivity) (by simp) h
          · intro h; rw [h]
      _ ↔ c = 8 := by constructor <;> intro h <;> linarith

/-- Predpostavka trditve `matura3c` se da izpolniti (c = 8). -/
example : (4 : ℝ) < 8 := by norm_num

/-- Predpostavke trditve `matura3c` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (4 : ℝ) < 8 := by norm_num
  matura3c (hc := w)

/-- Matura, naloga 3 d) (in vrstica `integral: 2*12/sqrt(x)`): p = ∫₄¹⁶ (f − (−f)) dx =
48√x |₄¹⁶ = 48(4 − 2) = 96.
trditev: MAT-SS-4/doloceni-integral#matura3d
besedilo: »$p = \int_4^{16} \bigl(f(x) - (-f(x))\bigr)\,dx = 2\int_4^{16} 12x^{-1/2}\,dx = 48\sqrt{x}\,\Big|_4^{16} = 48(4 - 2) = 96$« -/
theorem matura3d : ∫ x in (4:ℝ)..16, (12 / √x - -(12 / √x)) = 96 := by
  have hF : ∀ x ∈ Set.uIcc (4:ℝ) 16, HasDerivAt (fun x => 48 * √x) (12 / √x - -(12 / √x)) x := by
    intro x hx
    rw [Set.uIcc_of_le (by norm_num)] at hx
    have hx0 : 0 < x := by linarith [hx.1]
    have hs : √x ≠ 0 := (sqrt_pos.mpr hx0).ne'
    exact (((hasDerivAt_id' x).sqrt hx0.ne').const_mul (48:ℝ)).congr_deriv (by field_simp; ring)
  have hcont : ContinuousOn (fun x : ℝ => 12 / √x - -(12 / √x)) (Set.uIcc 4 16) := by
    rw [Set.uIcc_of_le (by norm_num)]
    intro x hx
    have hs : √x ≠ 0 := (sqrt_pos.mpr (by linarith [hx.1])).ne'
    exact (by fun_prop : ContinuousAt (fun x : ℝ => 12 / √x - -(12 / √x)) x).continuousWithinAt
  have h4 : √(4:ℝ) = 2 := by rw [show (4:ℝ) = 2 ^ 2 by norm_num, sqrt_sq (by norm_num)]
  have h16 : √(16:ℝ) = 4 := by rw [show (16:ℝ) = 4 ^ 2 by norm_num, sqrt_sq (by norm_num)]
  calc ∫ x in (4:ℝ)..16, (12 / √x - -(12 / √x)) = 48 * √16 - 48 * √4 :=
        newton_leibniz _ _ 4 16 hcont hF
    _ = 48 * (4 - 2) := by rw [h4, h16]; ring
    _ = 96 := by norm_num

/-- Preveri se, vprašanje 2: I₁ = 1/2, I₂ = 1/3, I₃ = 1/4, torej I₃ < I₂ < I₁.
trditev: MAT-SS-4/doloceni-integral#kviz2
besedilo: »Na $(0, 1)$ leži graf $x^3$ pod grafom $x^2$, ta pa pod grafom $x$. Res: $I_3 = \frac{1}{4}$, $I_2 = \frac{1}{3}$, $I_1 = \frac{1}{2}$.« -/
theorem kviz2 : ∫ x in (0:ℝ)..1, x = 1 / 2 ∧ ∫ x in (0:ℝ)..1, x ^ 2 = 1 / 3 ∧
    ∫ x in (0:ℝ)..1, x ^ 3 = 1 / 4 ∧
    ∫ x in (0:ℝ)..1, x ^ 3 < ∫ x in (0:ℝ)..1, x ^ 2 ∧ ∫ x in (0:ℝ)..1, x ^ 2 < ∫ x in (0:ℝ)..1, x := by
  have h1 : ∫ x in (0:ℝ)..1, x = 1 / 2 := by rw [integral_id]; norm_num
  have h3 : ∫ x in (0:ℝ)..1, x ^ 3 = 1 / 4 := by rw [integral_pow]; norm_num
  rw [h1, integral_x2, h3]; norm_num

/-- Preveri se, vprašanje 3: če obris podvojimo, se prostornina poveča štirikrat,
π ∫ (2f)² = 4 · π ∫ f².
trditev: MAT-SS-4/doloceni-integral#kviz3
besedilo: »$V = \pi \int_a^b \bigl(2f(x)\bigr)^2\,dx = 4\pi \int_a^b f(x)^2\,dx$: vsaka rezina ima dvakrat večji polmer, zato štirikrat večjo ploskev.« -/
theorem kviz3 (f : ℝ → ℝ) (a b : ℝ) :
    π * ∫ x in a..b, (2 * f x) ^ 2 = 4 * (π * ∫ x in a..b, f x ^ 2) := by
  have : ∫ x in a..b, (2 * f x) ^ 2 = ∫ x in a..b, 4 * f x ^ 2 := by
    congr 1; ext x; ring
  rw [this, integral_const_mul]; ring

/-- Preveri se, vprašanje 4: ∫₁³ 2x dx = 9 − 1 = 8.
trditev: MAT-SS-4/doloceni-integral#kviz4
besedilo: »$\int_1^3 2x\,dx = 9 - 1 = 8$« -/
theorem kviz4 : ∫ x in (1:ℝ)..3, 2 * x = 8 := by
  calc ∫ x in (1:ℝ)..3, 2 * x = 3 ^ 2 - 1 ^ 2 :=
        nl _ (fun x => x ^ 2) 1 3 (fun x => by simpa using hasDerivAt_pow 2 x) (by fun_prop)
    _ = 9 - 1 := by norm_num
    _ = 8 := by norm_num

/-- Preveri se, vprašanje 5: ploščina med y = x² − 1 in osjo x na [0, 2]:
∫₀¹ (x² − 1) = −2/3, ∫₁² (x² − 1) = 4/3, ∫₀² |x² − 1| = 2/3 + 4/3 = 2.
trditev: MAT-SS-4/doloceni-integral#kviz5
besedilo: »Ničla je $x = 1$. $\int_0^1 (x^2 - 1)\,dx = -\frac{2}{3}$, $\int_1^2 (x^2 - 1)\,dx = \frac{4}{3}$. Ploščina je $\frac{2}{3} + \frac{4}{3} = 2$.« -/
theorem kviz5 : ∫ x in (0:ℝ)..1, (x ^ 2 - 1) = -2 / 3 ∧ ∫ x in (1:ℝ)..2, (x ^ 2 - 1) = 4 / 3 ∧
    ∫ x in (0:ℝ)..2, |x ^ 2 - 1| = 2 := by
  have hF : ∀ x : ℝ, HasDerivAt (fun x : ℝ => x ^ 3 / 3 - x) (x ^ 2 - 1) x := fun x =>
    (((hasDerivAt_pow 3 x).div_const 3).sub (hasDerivAt_id' x)).congr_deriv (by odv)
  have h1 : ∫ x in (0:ℝ)..1, (x ^ 2 - 1) = -2 / 3 := by rw [nl _ _ 0 1 hF (by fun_prop)]; norm_num
  have h2 : ∫ x in (1:ℝ)..2, (x ^ 2 - 1) = 4 / 3 := by rw [nl _ _ 1 2 hF (by fun_prop)]; norm_num
  refine ⟨h1, h2, ?_⟩
  have hc : Continuous (fun x : ℝ => |x ^ 2 - 1|) := by fun_prop
  have hsplit := aditivnost _ hc 0 1 2
  have e1 : ∫ x in (0:ℝ)..1, |x ^ 2 - 1| = -∫ x in (0:ℝ)..1, (x ^ 2 - 1) := by
    rw [← integral_neg]
    refine integral_congr (fun x hx => ?_)
    rw [Set.uIcc_of_le (by norm_num)] at hx
    exact abs_of_nonpos (by nlinarith [hx.1, hx.2])
  have e2 : ∫ x in (1:ℝ)..2, |x ^ 2 - 1| = ∫ x in (1:ℝ)..2, (x ^ 2 - 1) := by
    refine integral_congr (fun x hx => ?_)
    rw [Set.uIcc_of_le (by norm_num)] at hx
    exact abs_of_nonneg (by nlinarith [hx.1, hx.2])
  rw [← hsplit, e1, e2, h1, h2]; norm_num

/-- Preveri se, vprašanje 6 (in vrstica `vrednost: -(10-3)`): iz ∫₀⁴ f = 10 in ∫₀¹ f = 3 sledi
∫₁⁴ f = 10 − 3 = 7 in ∫₄¹ f = −7 (f zvezna).
trditev: MAT-SS-4/doloceni-integral#kviz6
besedilo: »Aditivnost: $\int_1^4 f(x)\,dx = 10 - 3 = 7$. Zamenjava mej: $\int_4^1 f(x)\,dx = -7$.« -/
theorem kviz6 (f : ℝ → ℝ) (hf : Continuous f) (h4 : ∫ x in (0:ℝ)..4, f x = 10)
    (h1 : ∫ x in (0:ℝ)..1, f x = 3) : ∫ x in (4:ℝ)..1, f x = -7 := by
  have h := aditivnost f hf 0 1 4
  rw [zamenjava_mej]
  calc -∫ x in (1:ℝ)..4, f x = -(10 - 3) := by rw [show ∫ x in (1:ℝ)..4, f x = 10 - 3 by linarith]
    _ = -7 := by norm_num

/-- Predpostavke trditve `kviz6` se dajo izpolniti (f(x) = −x/3 + 19/6). -/
example : ∃ f : ℝ → ℝ, Continuous f ∧ ∫ x in (0:ℝ)..4, f x = 10 ∧ ∫ x in (0:ℝ)..1, f x = 3 := by
  -- ∫₀⁴ = 8p + 4q = 10, ∫₀¹ = p/2 + q = 3 ⇒ p = −1/3, q = 19/6
  refine ⟨fun x => -1 / 3 * x + 19 / 6, by fun_prop, ?_, ?_⟩ <;>
  · beta_reduce; rw [linearna]; norm_num

end Evklid.Lekcije.MAT_SS_4.DoloceniIntegral
/-- Predpostavke trditve `kviz6` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ f : ℝ → ℝ, Continuous f ∧ ∫ x in (0:ℝ)..4, f x = 10 ∧ ∫ x in (0:ℝ)..1, f x = 3 := by
    -- ∫₀⁴ = 8p + 4q = 10, ∫₀¹ = p/2 + q = 3 ⇒ p = −1/3, q = 19/6
    refine ⟨fun x => -1 / 3 * x + 19 / 6, by fun_prop, ?_, ?_⟩ <;>
    · beta_reduce; rw [linearna]; norm_num
  kviz6 (hf := w.choose_spec.1) (h4 := w.choose_spec.2.1) (h1 := w.choose_spec.2.2)

