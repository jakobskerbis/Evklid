/-
vir: content/lessons/MAT-SS-3/posevna-telesa-in-vrtenine.md
sha256: d8eb7b76c23d72d77f29b74b40c658233831717e8d7af05369d694ed91fd7ea2
Model: telo med vzporednima ravninama opišemo s ploščino preseka A(h) na višini h ∈ [0, v]; prostornina je
∫₀ᵛ A(h) dh. Cavalierijevo načelo je v tem modelu enakost integralov enakih funkcij (dokazano); prizma in
valj (pokončna ali poševna) imata A(h) = O, piramida in stožec A(h) = O·((v − h)/v)². Višina v = s·sin α je
dokazana v pravokotnem trikotniku (Mathlib `EuclideanGeometry`), polmer dvojnega stožca kot razdalja oglišča
od hipotenuze v koordinatah. Zaokrožene vrednosti so dokazane kot |x − vrednost| < pol enote zadnjega mesta
(π med 3,141592 in 3,141593, sin 40° in cos 40° iz Taylorjevih mej).
Ni v Leanu: Cavalierijevo načelo kot splošen izrek o Lebesgueovi meri teles v ℝ³ in to, da je prostornina
telesa integral ploščin presekov (zahtevno, še ni dokazano; Mathlib ima osnovo, npr. mero produkta
`MeasureTheory.Measure.prod_apply`, a izpeljava za telesa lekcije tu ni narejena); pri nalogi 2 b) je
r = 7 sin 40° dokazan le kot račun (da je to razdalja C od AB v trikotniku, ni povezano z geometrijo:
zahtevno, še ni dokazano); opis vrtenin (katero telo nastane, kaj opiše
stranica pri vrtenju, osni prerez) je geometrijski opis brez računa (zahtevno, še ni dokazano) – dokazani so
vsi računi z valji in stožci; »poševna prizma ima večjo površino« (ustno 3) je dokazano le za eno stransko
ploskev (h·sin β ≤ h), ne pa trditev, da ne morejo biti vse stranske ploskve pravokotne; risbe, simulacija,
zgodba, besedni kvizi (1, 2) razen računov, točkovanje.
Lean: √ negativnega je 0 in x/0 = 0; trditve imajo zato pozitivne podatke.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.PosevnaTelesaInVrtenine

open Real EuclideanGeometry

/-! ## Numerično orodje: meje za sin in cos na [0, 1] -/

open Complex Finset in
/-- Taylorjev polinom za cos in sin do x⁸ z ostankom (iz `Complex.exp_bound`, n = 9).
pomozno -/
theorem sc_bound (x : ℝ) (hx : |x| ≤ 1) :
    |Real.cos x - (1 - x^2/2 + x^4/24 - x^6/720 + x^8/40320)| ≤ |x|^9 * (10 / (362880 * 9)) ∧
    |Real.sin x - (x - x^3/6 + x^5/120 - x^7/5040)| ≤ |x|^9 * (10 / (362880 * 9)) := by
  have hb := Complex.exp_bound (x := (x : ℂ) * I) (n := 9) (by simpa using hx) (by norm_num)
  have hn : ‖(x:ℂ) * I‖ = |x| := by simp
  have hI3 : I ^ 3 = -I := by rw [pow_succ, I_sq]; ring
  have hfac : ((Nat.succ 9 : ℕ) : ℝ) * ((Nat.factorial 9 : ℕ) * (9:ℕ) : ℝ)⁻¹ = 10 / (362880 * 9) := by
    norm_num [Nat.factorial]
  have hz : cexp ((x:ℂ) * I) - ∑ m ∈ range 9, ((x:ℂ) * I) ^ m / (m.factorial : ℂ) =
      (((Real.cos x - (1 - x^2/2 + x^4/24 - x^6/720 + x^8/40320)) : ℝ) : ℂ) +
      (((Real.sin x - (x - x^3/6 + x^5/120 - x^7/5040)) : ℝ) : ℂ) * I := by
    rw [exp_mul_I]
    simp only [Finset.sum_range_succ, Finset.sum_range_zero, Nat.factorial, mul_pow]
    push_cast
    ring_nf
    simp only [I_sq, hI3]
    ring_nf
  rw [hn, hfac, hz] at hb
  constructor
  · refine le_trans ?_ hb
    have := Complex.abs_re_le_norm ((((Real.cos x - (1 - x^2/2 + x^4/24 - x^6/720 + x^8/40320)) : ℝ) : ℂ) +
      (((Real.sin x - (x - x^3/6 + x^5/120 - x^7/5040)) : ℝ) : ℂ) * I)
    simp only [add_re, ofReal_re, mul_re, I_re, I_im, ofReal_im, mul_zero, mul_one, sub_zero,
      add_zero] at this
    exact this
  · refine le_trans ?_ hb
    have := Complex.abs_im_le_norm ((((Real.cos x - (1 - x^2/2 + x^4/24 - x^6/720 + x^8/40320)) : ℝ) : ℂ) +
      (((Real.sin x - (x - x^3/6 + x^5/120 - x^7/5040)) : ℝ) : ℂ) * I)
    simp only [add_im, ofReal_re, mul_im, I_re, I_im, ofReal_im, mul_zero, mul_one, zero_add,
      add_zero] at this
    exact this

/-- Spodnja meja za sin. -/
@[expose] noncomputable def sSp (x : ℝ) : ℝ := x - x^3/6 + x^5/120 - x^7/5040 - x^9/326592
/-- Zgornja meja za sin. -/
@[expose] noncomputable def sZg (x : ℝ) : ℝ := x - x^3/6 + x^5/120 - x^7/5040 + x^9/326592
/-- Spodnja meja za cos. -/
@[expose] noncomputable def cSp (x : ℝ) : ℝ := 1 - x^2/2 + x^4/24 - x^6/720 + x^8/40320 - x^9/326592
/-- Zgornja meja za cos. -/
@[expose] noncomputable def cZg (x : ℝ) : ℝ := 1 - x^2/2 + x^4/24 - x^6/720 + x^8/40320 + x^9/326592

/-- Meje sSp ≤ sin ≤ sZg, cSp ≤ cos ≤ cZg na [0, 1].
pomozno -/
theorem meje (x : ℝ) (h0 : 0 ≤ x) (h1 : x ≤ 1) :
    sSp x ≤ sin x ∧ sin x ≤ sZg x ∧ cSp x ≤ cos x ∧ cos x ≤ cZg x := by
  have hx : |x| = x := abs_of_nonneg h0
  obtain ⟨hc, hs⟩ := sc_bound x (by rw [hx]; exact h1)
  rw [hx, abs_le] at hc hs
  unfold sSp sZg cSp cZg
  refine ⟨?_, ?_, ?_, ?_⟩ <;> nlinarith [hc.1, hc.2, hs.1, hs.2]

/-- Kot v stopinjah iz arcsin: če je y₁ ≤ y ≤ y₂ in sZg a ≤ y₁, y₂ < sSp b za točki a, b tik ob
(D ∓ e)·π/180, je |arcsin y · 180/π − D| < e.
pomozno -/
theorem arcsin_stopinje {y D e y₁ y₂ : ℝ} (a b : ℝ) (hDe : 0 < D - e)
    (ha : (D - e) * 3.141593 / 180 ≤ a) (hb : b ≤ (D + e) * 3.141592 / 180) (ha1 : a ≤ 1)
    (hb0 : 0 ≤ b) (hb1 : b ≤ 1) (hy₁ : y₁ ≤ y) (hy₂ : y ≤ y₂) (hy1 : y ≤ 1)
    (hna : sZg a ≤ y₁) (hnb : y₂ < sSp b) : |arcsin y * 180 / π - D| < e := by
  have hpi1 := pi_gt_d6
  have hpi2 := pi_lt_d6
  have ha0 : 0 ≤ a := by nlinarith
  have hma := meje a ha0 ha1
  have hmb := meje b hb0 hb1
  have hya : sin a ≤ y := by linarith [hma.2.1]
  have hyb : y < sin b := by linarith [hmb.1]
  have hym : -1 ≤ y := le_trans (neg_one_le_sin a) hya
  have h1 : a ≤ arcsin y :=
    (le_arcsin_iff_sin_le ⟨by linarith, by linarith⟩ ⟨hym, hy1⟩).2 hya
  have h2 : arcsin y < b := (arcsin_lt_iff_lt_sin ⟨hym, hy1⟩ ⟨by linarith, by linarith⟩).2 hyb
  have hpi : 0 < π := pi_pos
  rw [abs_sub_lt_iff]
  constructor
  · rw [sub_lt_iff_lt_add, div_lt_iff₀ hpi]; nlinarith
  · rw [sub_lt_comm, lt_div_iff₀ hpi]; nlinarith

/-- Kot v stopinjah iz arctan: q₁ ≤ q ≤ q₂ in numerične meje za sin, cos v točkah a, b.
pomozno -/
theorem arctan_stopinje {q D e q₁ q₂ : ℝ} (a b : ℝ) (hDe : 0 < D - e)
    (ha : (D - e) * 3.141593 / 180 ≤ a) (hb : b ≤ (D + e) * 3.141592 / 180) (ha1 : a ≤ 1)
    (hb0 : 0 ≤ b) (hb1 : b ≤ 1) (hq₁ : q₁ ≤ q) (hq₂ : q ≤ q₂) (hq0 : 0 ≤ q₁)
    (hca0 : 0 ≤ cSp a) (hcb0 : 0 ≤ cZg b)
    (hna : sZg a ≤ q₁ * cSp a) (hnb : q₂ * cZg b < sSp b) : |arctan q * 180 / π - D| < e := by
  have hpi1 := pi_gt_d6
  have hpi2 := pi_lt_d6
  have ha0 : 0 ≤ a := by nlinarith
  have hma := meje a ha0 ha1
  have hmb := meje b hb0 hb1
  have hca : 0 < cos a := cos_pos_of_mem_Ioo ⟨by linarith, by linarith⟩
  have hcb : 0 < cos b := cos_pos_of_mem_Ioo ⟨by linarith, by linarith⟩
  have hqa : sin a ≤ q * cos a := by nlinarith [hma.2.1, hma.2.2.1]
  have hqb : q * cos b < sin b := by nlinarith [hmb.1, hmb.2.2.2]
  have h1 : a ≤ arctan q := by
    have : tan a ≤ q := by rw [tan_eq_sin_div_cos, div_le_iff₀ hca]; exact hqa
    calc a = arctan (tan a) := (arctan_tan (by linarith) (by linarith)).symm
      _ ≤ arctan q := arctan_strictMono.monotone this
  have h2 : arctan q < b := by
    have : q < tan b := by rw [tan_eq_sin_div_cos, lt_div_iff₀ hcb]; exact hqb
    calc arctan q < arctan (tan b) := arctan_strictMono this
      _ = b := arctan_tan (by linarith) (by linarith)
  have hpi : 0 < π := pi_pos
  rw [abs_sub_lt_iff]
  constructor
  · rw [sub_lt_iff_lt_add, div_lt_iff₀ hpi]; nlinarith
  · rw [sub_lt_comm, lt_div_iff₀ hpi]; nlinarith

/-- Meje za sin in cos kota k° (k·π/180 ≤ 1) prek mej za π (`pi_gt_d6`, `pi_lt_d6`).
pomozno -/
theorem meje_stopinj (k : ℝ) (hk : 0 ≤ k) (hk1 : k * 3.141593 / 180 ≤ 1) :
    sSp (k * 3.141592 / 180) ≤ sin (k * π / 180) ∧ sin (k * π / 180) ≤ sZg (k * 3.141593 / 180) ∧
    cSp (k * 3.141593 / 180) ≤ cos (k * π / 180) ∧ cos (k * π / 180) ≤ cZg (k * 3.141592 / 180) := by
  have hpi1 := pi_gt_d6
  have hpi2 := pi_lt_d6
  have l1 : k * 3.141592 / 180 ≤ k * π / 180 := by nlinarith
  have l2 : k * π / 180 ≤ k * 3.141593 / 180 := by nlinarith
  have h0 : 0 ≤ k * 3.141592 / 180 := by positivity
  have m1 := meje _ h0 (by nlinarith)
  have m2 := meje _ (by positivity) hk1
  refine ⟨?_, ?_, ?_, ?_⟩
  · exact m1.1.trans (sin_le_sin_of_le_of_le_pi_div_two (by linarith) (by linarith) l1)
  · exact (sin_le_sin_of_le_of_le_pi_div_two (by linarith) (by linarith) l2).trans m2.2.1
  · exact m2.2.2.1.trans (cos_le_cos_of_nonneg_of_le_pi (by linarith) (by linarith) l2)
  · exact (cos_le_cos_of_nonneg_of_le_pi h0 (by linarith) l1).trans m1.2.2.2

/-- Predpostavke orodij `sc_bound` in `meje` se dajo izpolniti (x = 1/2). Predpostavke `arcsin_stopinje` in
`arctan_stopinje` so izpolnjene ob vsaki uporabi spodaj (npr. pri kotu 35,26°). -/
example : |(1 / 2 : ℝ)| ≤ 1 ∧ (0 : ℝ) ≤ 1 / 2 ∧ (1 / 2 : ℝ) ≤ 1 := by norm_num [abs_of_pos]

/-- Predpostavke trditve `meje_stopinj` se dajo izpolniti (k = 35). -/
example : (0 : ℝ) ≤ 35 ∧ (35 : ℝ) * 3.141593 / 180 ≤ 1 := by norm_num

/-- Meje za √2.
pomozno -/
theorem sqrt2_meje : (1.41421356 : ℝ) < √2 ∧ √2 < 1.41421357 :=
  ⟨by rw [Real.lt_sqrt (by norm_num)]; norm_num, by rw [Real.sqrt_lt' (by norm_num)]; norm_num⟩

/-- Meje za √3.
pomozno -/
theorem sqrt3_meje : (1.73205080 : ℝ) < √3 ∧ √3 < 1.73205081 :=
  ⟨by rw [Real.lt_sqrt (by norm_num)]; norm_num, by rw [Real.sqrt_lt' (by norm_num)]; norm_num⟩

/-- Meje za sin 40° in cos 40°.
pomozno -/
theorem meje_40 : (0.64278726 : ℝ) < sin (40 * π / 180) ∧ sin (40 * π / 180) < 0.64278769 ∧
    (0.76604428 : ℝ) < cos (40 * π / 180) ∧ cos (40 * π / 180) < 0.76604467 := by
  obtain ⟨h1, h2, h3, h4⟩ := meje_stopinj 40 (by norm_num) (by norm_num)
  exact ⟨lt_of_lt_of_le (by norm_num [sSp]) h1, lt_of_le_of_lt h2 (by norm_num [sZg]),
    lt_of_lt_of_le (by norm_num [cSp]) h3, lt_of_le_of_lt h4 (by norm_num [cZg])⟩

/-! ## Razlaga 1, 2: Cavalierijevo načelo -/

/-- Razlaga 2, Povzetek, Ustno vprašanje 1 (Cavalierijevo načelo v modelu presekov): telesi z enako
ploščino presekov na vsaki višini h ∈ [0, v] imata enako prostornino ∫₀ᵛ A(h) dh.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#cavalieri
besedilo: »Cavalierijevo načelo:** telesi z enako ploščino prerezov na vsaki višini imata enako prostornino.« -/
theorem cavalieri (A₁ A₂ : ℝ → ℝ) (v : ℝ) (hv : 0 ≤ v) (h : ∀ x ∈ Set.Icc 0 v, A₁ x = A₂ x) :
    ∫ x in (0:ℝ)..v, A₁ x = ∫ x in (0:ℝ)..v, A₂ x := by
  apply intervalIntegral.integral_congr
  intro x hx
  rw [Set.uIcc_of_le hv] at hx
  exact h x hx

/-- Predpostavke trditve `cavalieri` se dajo izpolniti (A₁ = A₂ = 1, v = 1). -/
example : (0:ℝ) ≤ 1 ∧ ∀ x ∈ Set.Icc (0:ℝ) 1, (fun _ => (1:ℝ)) x = (fun _ => (1:ℝ)) x :=
  ⟨zero_le_one, fun _ _ => rfl⟩

/-- Predpostavke trditve `cavalieri` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 1 ∧ ∀ x ∈ Set.Icc (0:ℝ) 1, (fun _ => (1:ℝ)) x = (fun _ => (1:ℝ)) x :=
    ⟨zero_le_one, fun _ _ => rfl⟩
  cavalieri (hv := w.1) (h := w.2)

/-- Razlaga 2, Povzetek: prerezi poševne (in pokončne) prizme ali valja so skladni z osnovno ploskvijo
(A(h) = O), zato V = ∫₀ᵛ O dh = O·v.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#prizma-v
besedilo: »Zato za poševno prizmo in poševni valj velja ista formula kot za pokončna: $$V = O\,v$$« -/
theorem prizma_V (O v : ℝ) : ∫ _ in (0:ℝ)..v, O = O * v := by simp; ring

/-- Razlaga 2, Povzetek: pri poševni piramidi ali stožcu je prerez na višini h osnovna ploskev, pomanjšana
v razmerju (v − h)/v, zato V = ∫₀ᵛ O((v − h)/v)² dh = O·v/3 (enako kot pri pokončni).
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#piramida-v
besedilo: »Zato za poševno piramido in poševni stožec, pri katerih vrh ne leži nad središčem osnovne ploskve, velja $V = \frac{O\,v}{3}$.« -/
theorem piramida_V (O v : ℝ) (hv : 0 < v) : ∫ h in (0:ℝ)..v, O * ((v - h) / v) ^ 2 = O * v / 3 := by
  have hF : ∀ x ∈ Set.uIcc (0:ℝ) v, HasDerivAt (fun h : ℝ => -(O * (v - h) ^ 3 / (3 * v ^ 2)))
      (O * ((v - x) / v) ^ 2) x := by
    intro x _
    have h1 : HasDerivAt (fun h : ℝ => (v - h) ^ 3) (3 * (v - x) ^ 2 * (-1)) x := by
      have h := (hasDerivAt_pow 3 (v - x)).comp x ((hasDerivAt_const x v).sub (hasDerivAt_id x))
      simp only [Function.comp_def, Nat.cast_ofNat] at h
      convert h using 1; simp
    convert (h1.const_mul (O / (3 * v ^ 2))).neg using 1
    · ext h; simp only [Pi.neg_apply]; ring
    · field_simp
  have hc : Continuous (fun h : ℝ => O * ((v - h) / v) ^ 2) := by fun_prop
  rw [intervalIntegral.integral_eq_sub_of_hasDerivAt hF (hc.intervalIntegrable 0 v)]
  field_simp; ring

/-- Predpostavke trditve `piramida_V` se dajo izpolniti (v = 1). -/
example : (0:ℝ) < 1 := one_pos

/-- Predpostavke trditve `piramida_V` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 1 := one_pos
  piramida_V (hv := w)

/-- Razlaga 1 (tabela), premisli: kup 16 palačink debeline 0,5 cm ima višino 8 cm in ploščino π·10² = 100π;
prerezi pokončnega, nagnjenega in cik-cak kupa imajo isto ploščino 100π na vsaki višini, zato vsi
∫₀⁸ 100π = 800π, ne glede na dolžino stranskega roba.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#palacinke
besedilo: »$V = 100\pi \cdot 8 = 800\pi \approx 2513\,\mathrm{cm^3}$, enako kot pri pokončnem kupu (Cavalierijevo načelo).« -/
theorem palacinke (A : ℝ → ℝ) (hA : ∀ x ∈ Set.Icc (0:ℝ) 8, A x = 100 * π) :
    (16 : ℝ) * 0.5 = 8 ∧ π * 10 ^ 2 = 100 * π ∧ ∫ x in (0:ℝ)..8, A x = 800 * π := by
  refine ⟨by norm_num, by ring, ?_⟩
  rw [cavalieri A (fun _ => 100 * π) 8 (by norm_num) hA, prizma_V]; ring

/-- Predpostavke trditve `palacinke` se dajo izpolniti (A = 100π). -/
example : ∀ x ∈ Set.Icc (0:ℝ) 8, (fun _ => 100 * π) x = 100 * π := fun _ _ => rfl

/-! ## Razlaga 3: višina ni stranski rob -/

/-- Predpostavke trditve `palacinke` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∀ x ∈ Set.Icc (0:ℝ) 8, (fun _ => 100 * π) x = 100 * π := fun _ _ => rfl
  palacinke (hA := w)

/-- Razlaga 3, Povzetek, Ponovitev: stranski rob XK z nožiščem N (pravi kot pri N) in kotom α = ∠ N X K
med robom in osnovno ploskvijo: višina v = KN = s·sin α ≤ s.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#visina
besedilo: »Višina** je razdalja med ravninama osnovnih ploskev, ne stranski rob: $v = s\sin\alpha$.« -/
theorem visina {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] {X N K : P} (h : ∠ K N X = π / 2) (_hX : X ≠ N) (_hK : K ≠ N) :
    dist K N = dist K X * sin (∠ N X K) ∧ dist K N ≤ dist K X := by
  have e := sin_angle_mul_dist_of_angle_eq_pi_div_two h
  refine ⟨by rw [mul_comm]; exact e.symm, ?_⟩
  rw [← e]; exact mul_le_of_le_one_left dist_nonneg (sin_le_one _)

/-- Predpostavke trditve `visina` se dajo izpolniti (pravokotni trikotnik v ℝ²). -/
example : ∠ (!₂[(0:ℝ), 1] : EuclideanSpace ℝ (Fin 2)) !₂[0, 0] !₂[1, 0] = π / 2 ∧
    (!₂[(1:ℝ), 0] : EuclideanSpace ℝ (Fin 2)) ≠ !₂[0, 0] ∧
    (!₂[(0:ℝ), 1] : EuclideanSpace ℝ (Fin 2)) ≠ !₂[0, 0] := by
  refine ⟨?_, ?_, ?_⟩
  · rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [EuclideanSpace.inner_eq_star_dotProduct, Fin.sum_univ_two, dotProduct]
  · intro h; have := congrFun (congrArg (⇑) h) 0; simp at this
  · intro h; have := congrFun (congrArg (⇑) h) 1; simp at this

/-- Predpostavke trditve `visina` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∠ (!₂[(0:ℝ), 1] : EuclideanSpace ℝ (Fin 2)) !₂[0, 0] !₂[1, 0] = π / 2 ∧ (!₂[(1:ℝ), 0] : EuclideanSpace ℝ (Fin 2)) ≠ !₂[0, 0] ∧ (!₂[(0:ℝ), 1] : EuclideanSpace ℝ (Fin 2)) ≠ !₂[0, 0] := by
    refine ⟨?_, ?_, ?_⟩
    · rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
      simp [EuclideanSpace.inner_eq_star_dotProduct, Fin.sum_univ_two, dotProduct]
    · intro h; have := congrFun (congrArg (⇑) h) 0; simp at this
    · intro h; have := congrFun (congrArg (⇑) h) 1; simp at this
  visina (h := w.1) (_hX := w.2.1) (_hK := w.2.2)

/-- Preveri se (2): pri enaki višini v in kotu 0 < α < 90° je stranski rob s = v/sin α daljši od v.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#rob-daljsi
besedilo: »Pri poševni je stranski rob $s$ daljši od $v$.« -/
theorem rob_daljsi (v α : ℝ) (hv : 0 < v) (h0 : 0 < α) (h1 : α < π / 2) : v < v / sin α := by
  have hs : 0 < sin α := sin_pos_of_pos_of_lt_pi h0 (by linarith [pi_pos])
  have hs1 : sin α < 1 := by
    rw [← sin_pi_div_two]
    exact sin_lt_sin_of_lt_of_le_pi_div_two (by linarith) le_rfl h1
  rw [lt_div_iff₀ hs]; nlinarith

/-- Predpostavke trditve `rob_daljsi` se dajo izpolniti (v = 5, α = π/6). -/
example : (0:ℝ) < 5 ∧ (0:ℝ) < π / 6 ∧ π / 6 < π / 2 := ⟨by norm_num, by positivity, by linarith [pi_pos]⟩

/-- Predpostavke trditve `rob_daljsi` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 5 ∧ (0:ℝ) < π / 6 ∧ π / 6 < π / 2 := ⟨by norm_num, by positivity, by linarith [pi_pos]⟩
  rob_daljsi (hv := w.1) (h0 := w.2.1) (h1 := w.2.2)

/-- Ustno vprašanje 3 (ena stranska ploskev): če je stranska ploskev nagnjena proti osnovni za kot β, je
višina prizme v = h·sin β ≤ h (h višina paralelograma na rob e), zato e·v ≤ e·h; enakost pri sin β = 1.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#stranska-ploskev
besedilo: »zato je $h \ge v$; enakost velja le, če je stranska ploskev pravokotna na osnovno ploskev.« -/
theorem stranska_ploskev (e h β : ℝ) (he : 0 < e) (hh : 0 < h) :
    e * (h * sin β) ≤ e * h ∧ (e * (h * sin β) = e * h ↔ sin β = 1) := by
  refine ⟨mul_le_mul_of_nonneg_left (mul_le_of_le_one_right hh.le (sin_le_one β)) he.le, ?_⟩
  constructor
  · intro h1
    have : h * sin β = h * 1 := by nlinarith [mul_pos he hh]
    exact mul_left_cancel₀ hh.ne' this
  · intro h1; rw [h1, mul_one]

/-- Predpostavke trditve `stranska_ploskev` se dajo izpolniti (e = h = 1). -/
example : (0:ℝ) < 1 := one_pos

/-! ## Razlaga 4: vrtenine (računi) -/

/-- Predpostavke trditve `stranska_ploskev` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 1 := one_pos
  stranska_ploskev (he := w) (hh := w)

/-- Razlaga 4, premisli: trikotnik 3, 4 okoli krajše katete (os 3, polmer 4) da π·16·3/3 = 16π, okoli
daljše (os 4, polmer 3) π·9·4/3 = 12π; 16π > 12π.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#premisli-stozca
besedilo: »Okoli krajše katete. Os $3$, polmer $4$: $V = \frac{\pi \cdot 16 \cdot 3}{3} = 16\pi$. Os $4$, polmer $3$: $V = \frac{\pi \cdot 9 \cdot 4}{3} = 12\pi$. Polmer je v formuli na kvadrat, višina ne, zato zmaga večji polmer.« -/
theorem premisli_stozca : π * 16 * 3 / 3 = 16 * π ∧ π * 9 * 4 / 3 = 12 * π ∧ 12 * π < 16 * π := by
  have := pi_pos
  exact ⟨by ring, by ring, by linarith⟩

/-- Razlaga 4 (simulacija): valj r = 2, v = 4 ima π·4·4 = 16π ≈ 50,3, stožec 16π/3 ≈ 16,8, natanko
tretjino: (π·2²·4/3)/(π·2²·4) = 1/3.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#simulacija
besedilo: »Primerjaj prostornini (približno $50{,}3$ in $16{,}8$): stožec ima natanko tretjino prostornine valja z isto osnovno ploskvijo in višino.« -/
theorem simulacija : π * 2 ^ 2 * 4 = 16 * π ∧ |16 * π - 50.3| < 0.05 ∧ |16 * π / 3 - 16.8| < 0.05 ∧
    (π * 2 ^ 2 * 4 / 3) / (π * 2 ^ 2 * 4) = 1 / 3 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have := pi_pos
  refine ⟨by ring, ?_, ?_, by field_simp⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Povzetek, Ponovitev, Pogoste napake (3), Ustno vprašanje 2: ploščina trikotnika na dva načina
ab/2 = cr/2 da polmer dvojnega stožca r = ab/c.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#polmer-dvojnega
besedilo: »Iz dveh zapisov ploščine trikotnika, $\frac{a\,b}{2} = \frac{c\,r}{2}$, dobimo $r = \frac{a\,b}{c}$.« -/
theorem polmer_dvojnega (a b c r : ℝ) (hc : 0 < c) : a * b / 2 = c * r / 2 ↔ r = a * b / c := by
  rw [eq_div_iff hc.ne']; constructor <;> intro h <;> linarith

/-- Predpostavke trditve `polmer_dvojnega` se dajo izpolniti (c = 10). -/
example : (0:ℝ) < 10 := by norm_num

/-- Predpostavke trditve `polmer_dvojnega` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 10 := by norm_num
  polmer_dvojnega (hc := w)

/-- Primer 3 (korak 4), naloga 2 c): dvojni stožec – prostornini stožcev z višinama c₁ in c₂ (c₁ + c₂ = c)
seštejemo in izpostavimo πr²/3: πr²c₁/3 + πr²c₂/3 = πr²c/3.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#dvojni-stozec
besedilo: »Prostornini stožcev seštejemo in izpostavimo $\frac{\pi r^2}{3}$; višini obeh stožcev skupaj dasta $c$« -/
theorem dvojni_stozec (r c₁ c₂ : ℝ) : π * r ^ 2 * c₁ / 3 + π * r ^ 2 * c₂ / 3 = π * r ^ 2 * (c₁ + c₂) / 3 := by
  ring

/-! ## Rešeni primeri -/

/-- Primer 1: v = 16·0,5 = 8, r = 10, O = 100π, V = 100π·8 = 800π ≈ 2513 cm³; sin α = 8/10 = 0,8,
α ≈ 53,13° ≈ 53,1°.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#primer1
besedilo: »Odgovor: v kupu je približno $2513\,\mathrm{cm^3}$ testa; rob je proti krožniku nagnjen za približno $53{,}1^\circ$.« -/
theorem primer1 :
    (16 : ℝ) * 0.5 = 8 ∧ (20 : ℝ) / 2 = 10 ∧ π * 10 ^ 2 = 100 * π ∧ 100 * π * 8 = 800 * π ∧
    |800 * π - 2513| < 0.5 ∧ (8 : ℝ) / 10 = 0.8 ∧ |arcsin 0.8 * 180 / π - 53.13| < 0.005 ∧
    |arcsin 0.8 * 180 / π - 53.1| < 0.05 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have h := arcsin_stopinje (y := 0.8) (D := 53.13) (e := 0.005) (y₁ := 0.8) (y₂ := 0.8)
    ((53.13 - 0.005) * 3.141593 / 180) ((53.13 + 0.005) * 3.141592 / 180)
    (by norm_num) le_rfl le_rfl (by norm_num) (by norm_num) (by norm_num) le_rfl le_rfl (by norm_num)
    (by norm_num [sZg]) (by norm_num [sSp])
  refine ⟨by norm_num, by norm_num, by ring, by ring, by rw [abs_lt]; constructor <;> linarith,
    by norm_num, h, ?_⟩
  rw [abs_lt] at h ⊢; constructor <;> linarith [h.1, h.2]

/-- Primer 2 (kornet, kateti 3 in 12, os 12): V = π·9·12/3 = 36π ≈ 113,1 (≈ 113), s = √(9 + 144) = √153
≈ 12,37, P_pl = π·3·12,37 ≈ 116,6 (tudi z nezaokroženim √153).
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#primer2
besedilo: »Odgovor: v kornet gre približno $113\,\mathrm{cm^3}$ sladoleda, plašč iz vaflja meri približno $116{,}6\,\mathrm{cm^2}$.« -/
theorem primer2 :
    π * 9 * 12 / 3 = 36 * π ∧ |36 * π - 113.1| < 0.05 ∧ |36 * π - 113| < 0.5 ∧
    √((3 : ℝ) ^ 2 + 12 ^ 2) = √153 ∧ |√153 - 12.37| < 0.005 ∧ |π * 3 * 12.37 - 116.6| < 0.05 ∧
    |π * 3 * √153 - 116.6| < 0.05 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have s1 : (12.369316 : ℝ) < √153 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have s2 : √153 < (12.369317 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have hp : 0 < π := pi_pos
  refine ⟨by ring, ?_, ?_, by norm_num, ?_, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> nlinarith

/-- Primer 3 (kalup, kateti 6 in 8, os hipotenuza): c = √(36 + 64) = 10; polmer je razdalja oglišča s
pravim kotom (0,0) od hipotenuze 8x + 6y = 48: |0 + 0 − 48|/√(8² + 6²) = 4,8 = 6·8/10;
V = π·4,8²·10/3 = 76,8π ≈ 241,3 (≈ 241), P = π·4,8·14 = 67,2π ≈ 211,1 (≈ 211).
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#primer3
besedilo: »Odgovor: v kalup gre približno $241\,\mathrm{cm^3}$ čokolade, površina izdelka je približno $211\,\mathrm{cm^2}$.« -/
theorem primer3 :
    √((36 : ℝ) + 64) = 10 ∧ |8 * 0 + 6 * 0 - 48| / √((8 : ℝ) ^ 2 + 6 ^ 2) = 4.8 ∧ (6 : ℝ) * 8 / 10 = 4.8 ∧
    π * 4.8 ^ 2 * 10 / 3 = 76.8 * π ∧ |76.8 * π - 241.3| < 0.05 ∧ |76.8 * π - 241| < 0.5 ∧
    π * 4.8 * (6 + 8) = 67.2 * π ∧ |67.2 * π - 211.1| < 0.05 ∧ |67.2 * π - 211| < 0.5 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  have h10 : √((36 : ℝ) + 64) = 10 := by
    rw [show (36 : ℝ) + 64 = 10 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨h10, ?_, by norm_num, by ring, ?_, ?_, by ring, ?_, ?_⟩
  · rw [show (8 : ℝ) ^ 2 + 6 ^ 2 = 36 + 64 by norm_num, h10]; norm_num [abs_of_neg]
  all_goals rw [abs_lt]; constructor <;> linarith

/-- Primer 4 (trapez okoli daljše osnovnice): r = 4, V_valj = π·16·3 = 48π, v₂ = 6 − 3 = 3,
V_stožec = π·16·3/3 = 16π, V = 64π ≈ 201,1.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#primer4
besedilo: »$V_{stožec} = \frac{\pi \cdot 16 \cdot 3}{3} = 16\pi\,\mathrm{cm^3}$, zato $V = 48\pi + 16\pi = 64\pi \approx 201{,}1\,\mathrm{cm^3}$.« -/
theorem primer4 :
    π * 4 ^ 2 * 3 = 48 * π ∧ (6 : ℝ) - 3 = 3 ∧ π * 16 * 3 / 3 = 16 * π ∧ 48 * π + 16 * π = 64 * π ∧
    |64 * π - 201.1| < 0.05 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  refine ⟨by ring, by norm_num, by ring, by ring, ?_⟩
  rw [abs_lt]; constructor <;> linarith

/-- Drugače (trapez okoli krajše osnovnice): V = π·16·6 − π·16·3/3 = 96π − 16π = 80π ≈ 251,3; okoli daljše
64π.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#trapez-krajsa
besedilo: »$V = \pi \cdot 16 \cdot 6 - \dfrac{\pi \cdot 16 \cdot 3}{3} = 96\pi - 16\pi = 80\pi \approx 251{,}3\,\mathrm{cm^3}$« -/
theorem trapez_krajsa :
    π * 16 * 6 - π * 16 * 3 / 3 = 96 * π - 16 * π ∧ 96 * π - 16 * π = 80 * π ∧ |80 * π - 251.3| < 0.05 ∧
    64 * π ≠ 80 * π := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  refine ⟨by ring, by ring, by rw [abs_lt]; constructor <;> linarith, by intro h; linarith⟩

/-! ## Pogoste napake -/

/-- Pogoste napake: rob s = 10 pod 30° da v = 10 sin 30° = 5; z v = 10 je prostornina dvakrat prevelika.
Pravokotnik 2 × 4 okoli stranice 4 ima polmer 2: π·2²·4 = 16π, ne π·4²·2 = 32π.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#pogoste-napake
besedilo: »Stranski rob namesto višine.** Pri poševnem valju z robom $s = 10\,\mathrm{cm}$ pod kotom $30^\circ$ nekdo računa z $v = 10\,\mathrm{cm}$ in dobi dvakrat preveč. Višina je razdalja med osnovnima ploskvama: $v = s\sin\alpha$.« -/
theorem pogoste_napake (O : ℝ) :
    10 * sin (30 * π / 180) = 5 ∧ O * 10 = 2 * (O * 5) ∧ π * 2 ^ 2 * 4 = 16 * π ∧ π * 4 ^ 2 * 2 = 32 * π := by
  refine ⟨?_, by ring, by ring, by ring⟩
  rw [show (30 : ℝ) * π / 180 = π / 6 by ring, sin_pi_div_six]; norm_num

/-! ## Preveri se -/

/-- Preveri se (3): piškoti r = 5, rob 10 pod 30°: v = 10 sin 30° = 5, V ≈ 3·25·5 = 375 (π ≈ 3), natančno
125π ≈ 393 (392,7); oba v pasu 390 ± 20. Napačni: 3·25·10 = 750, π·25·10 ≈ 785, s kosinusom
3·25·10·cos 30° ≈ 650 in π·25·10·cos 30° ≈ 680.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#piskoti
besedilo: »$v = 10 \cdot \frac{1}{2} = 5\,\mathrm{cm}$, $V \approx 3 \cdot 25 \cdot 5 = 375\,\mathrm{cm^3}$ (natančno $125\pi \approx 393\,\mathrm{cm^3}$).« -/
theorem piskoti :
    10 * sin (30 * π / 180) = 5 ∧ (3 : ℝ) * 25 * 5 = 375 ∧ π * 5 ^ 2 * 5 = 125 * π ∧ |125 * π - 393| < 0.5 ∧
    |125 * π - 392.7| < 0.05 ∧ |(375 : ℝ) - 390| ≤ 20 ∧ |125 * π - 390| ≤ 20 ∧ (3 : ℝ) * 25 * 10 = 750 ∧
    |π * 25 * 10 - 785| < 0.5 ∧ |3 * 25 * 10 * cos (30 * π / 180) - 650| < 0.5 ∧
    |π * 25 * 10 * cos (30 * π / 180) - 680| < 0.5 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  obtain ⟨t1, t2⟩ := sqrt3_meje
  have h30 : (30 : ℝ) * π / 180 = π / 6 := by ring
  have hp : 0 < π := pi_pos
  refine ⟨by rw [h30, sin_pi_div_six]; norm_num, by norm_num, by ring, ?_, ?_, by norm_num [abs_le], ?_,
    by norm_num, ?_, ?_, ?_⟩
  all_goals (try rw [h30, cos_pi_div_six])
  all_goals first
    | (rw [abs_lt]; constructor <;> nlinarith)
    | (rw [abs_le]; constructor <;> nlinarith)

/-- Preveri se (4): πr²·8/3 = 96π ⇔ r² = 36 ⇔ r = 6 (r > 0); brez 1/3 bi dobil r² = 12, r ≈ 3,46;
36 je r². RAČUN: √(96·3/8) = 6.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#kateta-6
besedilo: »Druga kateta je polmer: $\frac{\pi r^2 \cdot 8}{3} = 96\pi$, zato $r^2 = 36$ in $r = 6\,\mathrm{cm}$.« -/
theorem kateta_6 (r : ℝ) (hr : 0 < r) :
    (π * r ^ 2 * 8 / 3 = 96 * π ↔ r ^ 2 = 36) ∧ (r ^ 2 = 36 ↔ r = 6) ∧ √(96 * 3 / 8 : ℝ) = 6 ∧
    (π * r ^ 2 * 8 = 96 * π ↔ r ^ 2 = 12) ∧ |√(12 : ℝ) - 3.46| < 0.005 := by
  have hp := pi_pos
  refine ⟨⟨fun h => by nlinarith, fun h => by rw [h]; ring⟩,
    ⟨fun h => by nlinarith [sq_nonneg (r - 6), sq_nonneg (r + 6)], by rintro rfl; norm_num⟩, ?_,
    ⟨fun h => by nlinarith, fun h => by rw [h]; ring⟩, ?_⟩
  · rw [show (96 * 3 / 8 : ℝ) = 6 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · have h1 : (3.4641 : ℝ) < √12 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
    have h2 : √12 < (3.4642 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
    rw [abs_lt]; constructor <;> linarith

/-- Predpostavke trditve `kateta_6` se dajo izpolniti (r = 6). -/
example : (0:ℝ) < 6 := by norm_num

/-- Predpostavke trditve `kateta_6` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 6 := by norm_num
  kateta_6 (hr := w)

/-- Preveri se (5): kateti 6, 8: okoli hipotenuze 76,8π, okoli katete 8: π·36·8/3 = 96π, okoli katete 6:
π·64·6/3 = 128π; 76,8π < 96π < 128π.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#razvrsti
besedilo: »Okoli hipotenuze $76{,}8\pi$ (polmer le $4{,}8$), okoli katete $8$: $\frac{\pi \cdot 36 \cdot 8}{3} = 96\pi$, okoli katete $6$: $\frac{\pi \cdot 64 \cdot 6}{3} = 128\pi$.« -/
theorem razvrsti :
    π * 36 * 8 / 3 = 96 * π ∧ π * 64 * 6 / 3 = 128 * π ∧ 76.8 * π < 96 * π ∧ 96 * π < 128 * π := by
  have := pi_pos
  refine ⟨by ring, by ring, by linarith, by linarith⟩

/-! ## Za maturo -/

/-- Naloga 1: v = 6 sin 60° = 3√3, O = √3/4·4² = 4√3, V = 4√3·3√3 = 36, V' = 4√3·6 = 24√3,
V/V' = 36/(24√3) = 3/(2√3) = √3/2 = sin 60°.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#naloga1
besedilo: »Odgovor: a) $v = 3\sqrt{3}\,\mathrm{cm}$; b) $V = 36\,\mathrm{cm^3}$; c) $V : V' = \sqrt{3} : 2$.« -/
theorem naloga1 :
    6 * sin (60 * π / 180) = 6 * (√3 / 2) ∧ 6 * (√3 / 2) = 3 * √3 ∧ √3 / 4 * 4 ^ 2 = 4 * √3 ∧
    4 * √3 * (3 * √3) = 36 ∧ 4 * √3 * 6 = 24 * √3 ∧ 36 / (24 * √3) = 3 / (2 * √3) ∧
    3 / (2 * √3) = √3 / 2 ∧ √3 / 2 = sin (60 * π / 180) := by
  have h60 : (60 : ℝ) * π / 180 = π / 3 := by ring
  have h3 : √3 * √3 = 3 := Real.mul_self_sqrt (by norm_num)
  have hs : 0 < √3 := by positivity
  refine ⟨by rw [h60, sin_pi_div_three], by ring, by ring, by nlinarith, by ring, ?_, ?_, by rw [h60, sin_pi_div_three]⟩
  · field_simp; ring
  · field_simp; nlinarith

/-- Naloga 2 a): BC² = 7² + 10² − 2·7·10 cos 40° ≈ 41,754, BC ≈ 6,4617 ≈ 6,46.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#naloga2a
besedilo: »a) Kosinusni izrek: $BC^2 = 7^2 + 10^2 - 2 \cdot 7 \cdot 10 \cos 40^\circ \approx 41{,}754$, zato $BC \approx 6{,}4617\,\mathrm{cm} \approx 6{,}46\,\mathrm{cm}$.« -/
theorem naloga2a :
    |7 ^ 2 + 10 ^ 2 - 2 * 7 * 10 * cos (40 * π / 180) - 41.754| < 0.0005 ∧
    |√(7 ^ 2 + 10 ^ 2 - 2 * 7 * 10 * cos (40 * π / 180)) - 6.4617| < 0.00005 ∧
    |√(7 ^ 2 + 10 ^ 2 - 2 * 7 * 10 * cos (40 * π / 180)) - 6.46| < 0.005 := by
  obtain ⟨-, -, c1, c2⟩ := meje_40
  set q := (7 : ℝ) ^ 2 + 10 ^ 2 - 2 * 7 * 10 * cos (40 * π / 180)
  have q1 : 41.7537 < q := by simp only [q]; nlinarith
  have q2 : q < 41.75381 := by simp only [q]; nlinarith
  have b1 : (6.46171 : ℝ) < √q := by rw [Real.lt_sqrt (by norm_num)]; nlinarith
  have b2 : √q < (6.46172 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; nlinarith
  refine ⟨?_, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Naloga 2 b): kota pri A in B sta ostra – pri A je 40°, pri B velja AC² < AB² + BC²; zato nožišče D
višine iz C leži med A in B: 0 < AD = 7 cos 40° < 10. Polmer r = 7 sin 40° ≈ 4,4995 ≈ 4,50.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#naloga2b
besedilo: »b) Polmer: $r = AC\sin 40^\circ = 7\sin 40^\circ \approx 4{,}4995\,\mathrm{cm} \approx 4{,}50\,\mathrm{cm}$.« -/
theorem naloga2b :
    40 * π / 180 < π / 2 ∧
    (7 : ℝ) ^ 2 < 10 ^ 2 + (7 ^ 2 + 10 ^ 2 - 2 * 7 * 10 * cos (40 * π / 180)) ∧
    0 < 7 * cos (40 * π / 180) ∧ 7 * cos (40 * π / 180) < 10 ∧
    |7 * sin (40 * π / 180) - 4.4995| < 0.00005 ∧ |7 * sin (40 * π / 180) - 4.50| < 0.005 := by
  obtain ⟨s1, s2, c1, c2⟩ := meje_40
  have := pi_pos
  refine ⟨by linarith, by nlinarith, by linarith, by linarith, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;>
    linarith

/-- Naloga 2 c): V = πr²·AD/3 + πr²·DB/3 = πr²·AB/3 ≈ 212,01 ≈ 212,0 (z zaokroženim r = 4,50 pa ≈ 212,1);
P = πr(AC + BC) ≈ π·4,4995·13,4617 ≈ 190,29 ≈ 190,3.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#naloga2c
besedilo: »c) $V \approx 212{,}0\,\mathrm{cm^3}$ in $P \approx 190{,}3\,\mathrm{cm^2}$« -/
theorem naloga2c :
    |π * (7 * sin (40 * π / 180)) ^ 2 * 10 / 3 - 212.01| < 0.005 ∧
    |π * (7 * sin (40 * π / 180)) ^ 2 * 10 / 3 - 212.0| < 0.05 ∧ |π * 4.50 ^ 2 * 10 / 3 - 212.1| < 0.05 ∧
    |π * (7 * sin (40 * π / 180)) * (7 + √(7 ^ 2 + 10 ^ 2 - 2 * 7 * 10 * cos (40 * π / 180))) - 190.29| < 0.005 ∧
    |π * (7 * sin (40 * π / 180)) * (7 + √(7 ^ 2 + 10 ^ 2 - 2 * 7 * 10 * cos (40 * π / 180))) - 190.3| < 0.05 ∧
    |π * 4.4995 * 13.4617 - 190.29| < 0.005 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  obtain ⟨s1, s2, c1, c2⟩ := meje_40
  set q := (7 : ℝ) ^ 2 + 10 ^ 2 - 2 * 7 * 10 * cos (40 * π / 180)
  have q1 : 41.7537 < q := by simp only [q]; nlinarith
  have q2 : q < 41.75381 := by simp only [q]; nlinarith
  have b1 : (6.46171 : ℝ) < √q := by rw [Real.lt_sqrt (by norm_num)]; nlinarith
  have b2 : √q < (6.46172 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; nlinarith
  set s := sin (40 * π / 180)
  have r1 : (20.24555 : ℝ) < (7 * s) ^ 2 := by nlinarith
  have r2 : (7 * s) ^ 2 < (20.24565 : ℝ) := by nlinarith
  have hp : 0 < π := pi_pos
  have a1 : (4.4995108 : ℝ) < 7 * s := by linarith
  have a2 : 7 * s < (4.4995139 : ℝ) := by linarith
  have k1 : (13.46171 : ℝ) < 7 + √q := by linarith
  have k2 : 7 + √q < (13.46172 : ℝ) := by linarith
  have m1 := mul_lt_mul'' a1 k1 (by norm_num) (by norm_num)
  have m2 := mul_lt_mul'' a2 k2 (by linarith) (by linarith)
  have n1 := mul_lt_mul'' p1 m1 (by norm_num) (by norm_num)
  have n2 := mul_lt_mul'' p2 m2 (by linarith) (by nlinarith)
  have e : π * (7 * s) * (7 + √q) = π * (7 * s * (7 + √q)) := by ring
  have v1 := mul_lt_mul'' p1 r1 (by norm_num) (by norm_num)
  have v2 := mul_lt_mul'' p2 r2 (by linarith) (by positivity)
  have ev : π * (7 * s) ^ 2 * 10 / 3 = π * (7 * s) ^ 2 * (10 / 3) := by ring
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_⟩
  · rw [ev, abs_lt]; constructor <;> nlinarith
  · rw [ev, abs_lt]; constructor <;> nlinarith
  · rw [abs_lt]; constructor <;> linarith
  · rw [e, abs_lt]; constructor <;> linarith
  · rw [e, abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor <;> linarith

/-- Naloga 2 d): vrtenina okoli premice skozi C, vzporedne z AB, je valj (polmer r, višina AB) brez dveh
stožcev z višinama AD in DB: V' = πr²·AB − πr²(AD + DB)/3 = 2·πr²·AB/3 = 2V ≈ 424,0.
trditev: MAT-SS-3/posevna-telesa-in-vrtenine#naloga2d
besedilo: »$V' = \pi r^2 \cdot AB - \dfrac{\pi r^2 (AD + DB)}{3} = \pi r^2 \cdot AB - \dfrac{\pi r^2 \cdot AB}{3} = 2 \cdot \dfrac{\pi r^2 \cdot AB}{3} = 2V \approx 424{,}0\,\mathrm{cm^3}$« -/
theorem naloga2d (r AD DB : ℝ) :
    π * r ^ 2 * (AD + DB) - π * r ^ 2 * (AD + DB) / 3 = 2 * (π * r ^ 2 * (AD + DB) / 3) ∧
    |2 * (π * (7 * sin (40 * π / 180)) ^ 2 * 10 / 3) - 424.0| < 0.05 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  obtain ⟨s1, s2, -, -⟩ := meje_40
  set s := sin (40 * π / 180)
  have r1 : (20.24555 : ℝ) < (7 * s) ^ 2 := by nlinarith
  have r2 : (7 * s) ^ 2 < (20.24565 : ℝ) := by nlinarith
  refine ⟨by ring, ?_⟩
  rw [abs_lt]; constructor <;> nlinarith

/-- RAČUN: π·3²·4/3 = 12π, π·4²·3/3 = 16π, √(6² + 8²) = 10, 36/(24√3) = √3/2. (6·8/10 = 4,8 je v
`primer3`; 6 sin 60° = 3√3, √3/4·4² = 4√3 in 4√3·3√3 = 36 so v `naloga1`.)
pomozno -/
theorem racun :
    π * 3 ^ 2 * 4 / 3 = 12 * π ∧ π * 4 ^ 2 * 3 / 3 = 16 * π ∧ √((6 : ℝ) ^ 2 + 8 ^ 2) = 10 ∧
    36 / (24 * √3) = √3 / 2 := by
  have h3 : √3 * √3 = 3 := Real.mul_self_sqrt (by norm_num)
  have hs : 0 < √3 := by positivity
  refine ⟨by ring, by ring, ?_, ?_⟩
  · rw [show (6 : ℝ) ^ 2 + 8 ^ 2 = 10 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · field_simp; nlinarith

end Evklid.Lekcije.MAT_SS_3.PosevnaTelesaInVrtenine
