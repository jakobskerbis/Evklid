/-
vir: content/lessons/MAT-SS-3/polinomi.md
sha256: 81832abe76cf25ba26778308560081dfb6d5437e09b9161fe489fd4593b676ea
Ni v Leanu: simulacija »Polinom in njegove ničle« (drsniki), risba grafa in besedni opis »graf seka os v teh
točkah« / »pri dvojni ničli se graf osi le dotakne« (opis slike; dokazani so predznaki po intervalih), navodila
postopka (»delimo le vodilna člena, pomnožimo nazaj, odštejemo«, Ponovitev/Postopek, »Hornerja ne moremo
uporabiti« pri deljitelju x² + 1) kot opis metode, ne trditev, analogija s teleskopom in sondo (dokazana so le
števila), točkovanje maturitetnih nalog. Hornerjev algoritem je dokazan v splošni obliki za stopnjo 3 (vsi
primeri lekcije so stopnje 3); za poljubno stopnjo je dokazan izrek o ostanku in deljenju (`izrek_o_ostanku`,
`deljenje_z_linearnim`); sama shema za stopnjo n kot seznam korakov namenoma ni zapisana (izbira obsega:
lekcija jo uporablja le pri stopnji 3). Količnik in ostanek sta podana s
`/ₘ` in `%ₘ` (deljenje z moničnim polinomom v Mathlibu); »ničle, štete s stopnjo« so `Polynomial.roots`
(večkratna množica). Vrstice `<<RACUN` s `/` so dokazane kot racionalni izrazi za x ≠ 2 oz. x ≠ 3 (v Leanu je
x/0 = 0, zato pogoj).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.Polinomi

open Polynomial

/-! ## Splošna pravila -/

/-- Bolj natančno, izrek o deljenju (in Ustno vprašanje 1): za polinoma `p` in `q ≠ 0` obstajata količnik `k`
in ostanek `r` z `p = q·k + r`, kjer je `r = 0` ali je stopnja `r` manjša od stopnje `q`; taka `k` in `r` sta
ena sama.
trditev: MAT-SS-3/polinomi#izrek-o-deljenju
besedilo: »Izrek o deljenju.** Za polinoma $p$ in $q \ne 0$ obstajata natanko en količnik $k$ in natanko en ostanek $r$, da velja $p = q k + r$ in je $r = 0$ ali pa je stopnja $r$ manjša od stopnje $q$.« -/
theorem izrek_o_deljenju (p q : ℝ[X]) (hq : q ≠ 0) :
    (∃ k r : ℝ[X], p = q * k + r ∧ (r = 0 ∨ r.degree < q.degree)) ∧
    ∀ k r k' r' : ℝ[X], p = q * k + r → (r = 0 ∨ r.degree < q.degree) →
      p = q * k' + r' → (r' = 0 ∨ r'.degree < q.degree) → k = k' ∧ r = r' := by
  have hbot : ∀ s : ℝ[X], (s = 0 ∨ s.degree < q.degree) → s.degree < q.degree := by
    rintro s (rfl | h)
    · rw [degree_zero]; exact bot_lt_iff_ne_bot.mpr (degree_ne_bot.mpr hq)
    · exact h
  refine ⟨⟨p / q, p % q, (EuclideanDomain.div_add_mod p q).symm, Or.inr (degree_mod_lt p hq)⟩, ?_⟩
  intro k r k' r' h hr h' hr'
  have hr := hbot r hr
  have hr' := hbot r' hr'
  have h1 : q * (k - k') = r' - r := by linear_combination h' - h
  by_cases hk : k - k' = 0
  · have : r' - r = 0 := by rw [← h1, hk, mul_zero]
    exact ⟨sub_eq_zero.mp hk, (sub_eq_zero.mp this).symm⟩
  · exfalso
    have hdeg : q.degree ≤ (q * (k - k')).degree := degree_le_mul_left q hk
    have hlt : (r' - r).degree < q.degree := (degree_sub_le r' r).trans_lt (max_lt hr' hr)
    rw [h1] at hdeg
    exact absurd hdeg (not_le.mpr hlt)

/-- Predpostavke trditve `izrek_o_deljenju` se dajo izpolniti (`q = 1`). -/
example : (1 : ℝ[X]) ≠ 0 := one_ne_zero

/-- Predpostavke trditve `izrek_o_deljenju` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ[X]) ≠ 0 := one_ne_zero
  izrek_o_deljenju (hq := w)

/-- Blok 4 in Ustno vprašanje 3: količnik pri deljenju z `x − a` ima stopnjo za ena manjšo.
trditev: MAT-SS-3/polinomi#stopnja-kolicnika
besedilo: »ko je $p$ deljiv z $x - a$.** Vsaka najdena ničla torej odcepi faktor $x - a$ in polinom zniža za eno stopnjo.« -/
theorem stopnja_kolicnika (p : ℝ[X]) (a : ℝ) :
    (p /ₘ (X - C a)).natDegree = p.natDegree - 1 := by
  rw [natDegree_divByMonic p (monic_X_sub_C a), natDegree_X_sub_C]

/-- Blok 4 in Bolj natančno, izrek o ostanku: pri deljenju z `x − a` je ostanek število `p(a)`, torej
`p(x) = (x − a)·k(x) + p(a)`.
trditev: MAT-SS-3/polinomi#izrek-o-ostanku
besedilo: »Blok 4: izrek o ostanku.** Premislek posplošimo. Pri deljenju z $x - a$ je ostanek število in velja« -/
theorem izrek_o_ostanku (p : ℝ[X]) (a : ℝ) :
    p %ₘ (X - C a) = C (p.eval a) ∧ p = (X - C a) * (p /ₘ (X - C a)) + C (p.eval a) := by
  refine ⟨modByMonic_X_sub_C_eq_C_eval p a, ?_⟩
  rw [← modByMonic_X_sub_C_eq_C_eval p a, add_comm]
  exact (modByMonic_add_div p (X - C a)).symm

/-- Blok 4 in Povzetek: `a` je ničla polinoma natanko tedaj, ko je `p` deljiv z `x − a`.
trditev: MAT-SS-3/polinomi#nicla-iff-deljiv
besedilo: »Od tod sledi najpomembnejša posledica: **$a$ je ničla polinoma natanko tedaj, ko je $p$ deljiv z $x - a$.** Vsaka najdena ničla torej odcepi faktor $x - a$ in polinom zniža za eno stopnjo.« -/
theorem nicla_iff_deljiv (p : ℝ[X]) (a : ℝ) : p.eval a = 0 ↔ X - C a ∣ p :=
  dvd_iff_isRoot.symm

/-- Blok 6 in Ustno vprašanje 2: cela ničla `a` polinoma s celimi koeficienti deli prosti člen `a₀`.
trditev: MAT-SS-3/polinomi#cela-nicla-deli-prosti-clen
besedilo: »da je vsaka cela ničla polinoma s celimi koeficienti delitelj njegovega prostega člena.« -/
theorem cela_nicla_deli_prosti_clen (p : ℤ[X]) (a : ℤ) (h : p.eval a = 0) : a ∣ p.coeff 0 := by
  obtain ⟨k, hk⟩ := dvd_iff_isRoot.mpr h
  rw [hk, mul_coeff_zero]
  simp

/-- Predpostavke trditve `cela_nicla_deli_prosti_clen` se dajo izpolniti (`t³ − 6t² + 11t − 6` ima ničlo 1). -/
example : (X ^ 3 - 6 * X ^ 2 + 11 * X - 6 : ℤ[X]).eval 1 = 0 := by norm_num

/-- Predpostavke trditve `cela_nicla_deli_prosti_clen` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (X ^ 3 - 6 * X ^ 2 + 11 * X - 6 : ℤ[X]).eval 1 = 0 := by norm_num
  cela_nicla_deli_prosti_clen (h := w)

/-- Blok 6 in Povzetek: polinom stopnje `n` ima največ `n` ničel (štetih s stopnjo, `roots` je večkratna
množica), torej tudi največ `n` različnih.
trditev: MAT-SS-3/polinomi#najvec-n-nicel
besedilo: »Polinom stopnje $n$ ima največ $n$ ničel,« -/
theorem najvec_n_nicel (p : ℝ[X]) :
    Multiset.card p.roots ≤ p.natDegree ∧ p.roots.toFinset.card ≤ p.natDegree :=
  ⟨card_roots' p, (Multiset.toFinset_card_le _).trans (card_roots' p)⟩

/-- Blok 7, osnovni izrek algebre: polinom stopnje `n ≥ 1` ima vsaj eno kompleksno ničlo.
trditev: MAT-SS-3/polinomi#osnovni-izrek-algebre
besedilo: »Osnovni izrek algebre:** vsak polinom stopnje $n \ge 1$ ima vsaj eno kompleksno ničlo.« -/
theorem osnovni_izrek_algebre (f : ℂ[X]) (hf : 1 ≤ f.natDegree) : ∃ z : ℂ, f.eval z = 0 := by
  have : 0 < f.degree := natDegree_pos_iff_degree_pos.mp hf
  exact Complex.exists_root this

/-- Predpostavke trditve `osnovni_izrek_algebre` se dajo izpolniti (`x² + 1` ima stopnjo 2). -/
example : 1 ≤ (X ^ 2 + 1 : ℂ[X]).natDegree := by
  rw [show (X ^ 2 + 1 : ℂ[X]) = X ^ 2 + C 1 by simp, natDegree_X_pow_add_C]; norm_num

/-- Predpostavke trditve `osnovni_izrek_algebre` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : 1 ≤ (X ^ 2 + 1 : ℂ[X]).natDegree := by
    rw [show (X ^ 2 + 1 : ℂ[X]) = X ^ 2 + C 1 by simp, natDegree_X_pow_add_C]; norm_num
  osnovni_izrek_algebre (hf := w)

/-- Blok 7, posledici 1 in 2: polinom stopnje `n` ima natanko `n` kompleksnih ničel (štetih s stopnjo) in
`p(x) = aₙ(x − z₁)⋯(x − zₙ)`.
trditev: MAT-SS-3/polinomi#razcep-nad-c
besedilo: »Natanko $n$ ničel.** Polinom stopnje $n$ ima natanko $n$ kompleksnih ničel, če vsako štejemo tolikokrat, kolikor je njena stopnja. Polinom $(x - 2)^2(x + 1)$ ima ničle $2$, $2$ in $-1$.« -/
theorem razcep_nad_C (p : ℂ[X]) :
    Multiset.card p.roots = p.natDegree ∧
    p = C p.leadingCoeff * (p.roots.map fun z => X - C z).prod :=
  ⟨IsAlgClosed.card_roots_eq_natDegree,
    (C_leadingCoeff_mul_prod_multiset_X_sub_C IsAlgClosed.card_roots_eq_natDegree).symm⟩

/-- Blok 7, posledica 2: `(x − 2)²(x + 1)` ima ničle 2, 2 in −1.
trditev: MAT-SS-3/polinomi#nicle-dvojna
besedilo: »Polinom $(x - 2)^2(x + 1)$ ima ničle $2$, $2$ in $-1$.« -/
theorem nicle_dvojna : ((X - C 2) ^ 2 * (X - C (-1)) : ℂ[X]).roots = {2, 2, -1} := by
  rw [roots_mul (mul_ne_zero (pow_ne_zero _ (X_sub_C_ne_zero 2)) (X_sub_C_ne_zero _)), roots_pow,
    roots_X_sub_C, roots_X_sub_C]
  rfl

/-- Blok 7, posledica 3 (prvi del): če ima polinom realne koeficiente in je `z` njegova ničla, je ničla tudi
`z̄`, ker `p(z̄) = conj(p(z)) = 0`.
trditev: MAT-SS-3/polinomi#konjugirana-nicla
besedilo: »Konjugirani pari.** Če ima polinom realne koeficiente in je $z$ njegova ničla,« -/
theorem konjugirana_nicla (p : ℝ[X]) (z : ℂ) (h : aeval z p = 0) :
    aeval (starRingEnd ℂ z) p = 0 := by
  have := aeval_algHom_apply (Complex.conjAe : ℂ →ₐ[ℝ] ℂ) z p
  rw [h, map_zero] at this
  simpa using this

/-- Predpostavke trditve `konjugirana_nicla` se dajo izpolniti (`i` je ničla `x² + 1`). -/
example : aeval Complex.I (X ^ 2 + 1 : ℝ[X]) = 0 := by simp

/-- Predpostavke trditve `konjugirana_nicla` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : aeval Complex.I (X ^ 2 + 1 : ℝ[X]) = 0 := by simp
  konjugirana_nicla (h := w)

/-- Blok 7, posledica 3 (drugi del): `z` in `z̄` sta ničli z enako stopnjo.
trditev: MAT-SS-3/polinomi#konjugirana-stopnja
besedilo: »Konjugirani pari.** Če ima polinom realne koeficiente in je $z$ njegova ničla, je ničla tudi $\bar{z}$, in to z enako stopnjo.« -/
theorem konjugirana_stopnja (p : ℝ[X]) (z : ℂ) :
    rootMultiplicity (starRingEnd ℂ z) (p.map (algebraMap ℝ ℂ)) =
      rootMultiplicity z (p.map (algebraMap ℝ ℂ)) := by
  have hinj : Function.Injective (starRingEnd ℂ) := (starRingEnd ℂ).injective
  rw [eq_rootMultiplicity_map hinj z, map_map]
  congr 2
  ext r
  simp

/-- Blok 7, hitri test: polinom z realnimi koeficienti z ničlo `3 − 2i` ima zagotovo še ničlo `3 + 2i`.
trditev: MAT-SS-3/polinomi#hitri-test-konjugirana
besedilo: »Hitri test:** polinom z realnimi koeficienti ima ničlo $3 - 2i$. Katera je zagotovo še njegova ničla? *Odgovor: $3 + 2i$.« -/
theorem hitri_test_konjugirana (p : ℝ[X]) (h : aeval (3 - 2 * Complex.I) p = 0) :
    aeval (3 + 2 * Complex.I) p = 0 := by
  have := konjugirana_nicla p _ h
  simpa [map_sub, map_ofNat] using this

/-- Predpostavke trditve `hitri_test_konjugirana` se dajo izpolniti (`3 − 2i` je ničla `x² − 6x + 13`). -/
example : aeval (3 - 2 * Complex.I) (X ^ 2 - 6 * X + 13 : ℝ[X]) = 0 := by
  simp only [map_add, map_sub, map_mul, map_pow, aeval_X, map_ofNat]
  linear_combination (4 : ℂ) * Complex.I_sq

/-- Predpostavke trditve `hitri_test_konjugirana` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : aeval (3 - 2 * Complex.I) (X ^ 2 - 6 * X + 13 : ℝ[X]) = 0 := by
    simp only [map_add, map_sub, map_mul, map_pow, aeval_X, map_ofNat]
    linear_combination (4 : ℂ) * Complex.I_sq
  hitri_test_konjugirana (h := w)

/-- Blok 7, posledica 4: za nerealno ničlo `z = u + wi` (`w ≠ 0`) je `(x − z)(x − z̄) = x² − 2ux + u² + w²`,
kvadratni polinom z realnimi koeficienti in negativno diskriminanto `(2u)² − 4(u² + w²) = −4w²`.
trditev: MAT-SS-3/polinomi#konjugirani-par
besedilo: »Realni razcep.** Za nerealno ničlo $z = u + wi$ ($w \ne 0$) je $(x - z)(x - \bar{z}) = x^2 - 2ux + u^2 + w^2$ kvadratni polinom z realnimi koeficienti in negativno diskriminanto.« -/
theorem konjugirani_par (u w : ℝ) (hw : w ≠ 0) (x : ℂ) :
    (x - (u + w * Complex.I)) * (x - (u - w * Complex.I)) = x ^ 2 - 2 * u * x + (u ^ 2 + w ^ 2) ∧
    (-2 * u) ^ 2 - 4 * 1 * (u ^ 2 + w ^ 2) < 0 := by
  constructor
  · linear_combination (-(w : ℂ) ^ 2) * Complex.I_sq
  · nlinarith [sq_pos_of_ne_zero hw]

/-- Predpostavke trditve `konjugirani_par` se dajo izpolniti (`u = 1`, `w = 1`, `x = 0`). -/
example : (1 : ℝ) ≠ 0 := one_ne_zero

/-- Predpostavke trditve `konjugirani_par` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ) ≠ 0 := one_ne_zero
  konjugirani_par (hw := w)

/-- Blok 7, posledica 4 (realni razcep): vsak nerazcepen polinom z realnimi koeficienti ima stopnjo največ 2.
(Dokazana je le ta meja; sam razcep na linearne in kvadratne faktorje tu ni posebej zapisan.)
trditev: MAT-SS-3/polinomi#nerazcepni-realni
besedilo: »Zato vsak polinom z realnimi koeficienti razcepimo na faktorje z realnimi koeficienti: linearne in kvadratne brez realnih ničel.« -/
theorem nerazcepni_realni (p : ℝ[X]) (hp : Irreducible p) : p.natDegree ≤ 2 :=
  hp.natDegree_le_two

/-- Predpostavke trditve `nerazcepni_realni` se dajo izpolniti (`x` je nerazcepen). -/
example : Irreducible (X : ℝ[X]) := irreducible_X

/-- Predpostavke trditve `nerazcepni_realni` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Irreducible (X : ℝ[X]) := irreducible_X
  nerazcepni_realni (hp := w)

/-- Blok 7, posledica 5: polinom lihe stopnje z realnimi koeficienti ima vsaj eno realno ničlo.
trditev: MAT-SS-3/polinomi#liha-stopnja
besedilo: »Polinom lihe stopnje z realnimi koeficienti ima torej vsaj eno realno ničlo.« -/
theorem liha_stopnja (p : ℝ[X]) (hp : Odd p.natDegree) : ∃ x : ℝ, p.eval x = 0 :=
  IsRealClosed.exists_isRoot_of_odd_natDegree hp

/-- Predpostavke trditve `liha_stopnja` se dajo izpolniti (`x` ima stopnjo 1). -/
example : Odd (X : ℝ[X]).natDegree := by rw [natDegree_X]; exact odd_one

/-- Predpostavke trditve `liha_stopnja` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Odd (X : ℝ[X]).natDegree := by rw [natDegree_X]; exact odd_one
  liha_stopnja (hp := w)

/-- Bolj natančno, racionalne ničle: če ima polinom s celimi koeficienti ničlo `m/s` (okrajšan ulomek,
`s ≠ 0`), potem `m` deli `a₀` in `s` deli `aₙ`.
trditev: MAT-SS-3/polinomi#racionalne-nicle
besedilo: »Racionalne ničle.** Če ima polinom s celimi koeficienti ničlo $\frac{m}{s}$ (okrajšan ulomek), potem $m$ deli $a_0$ in $s$ deli $a_n$.« -/
theorem racionalne_nicle (p : ℤ[X]) (m s : ℤ) (hms : IsCoprime m s) (hs : s ≠ 0)
    (h : aeval ((m : ℚ) / s) p = 0) : m ∣ p.coeff 0 ∧ s ∣ p.leadingCoeff := by
  set r : ℚ := (m : ℚ) / s
  have hn := num_dvd_of_is_root (A := ℤ) h
  have hd := den_dvd_of_is_root (A := ℤ) h
  have hden : (IsFractionRing.den ℤ r : ℤ) ≠ 0 := nonZeroDivisors.coe_ne_zero _
  have hq := IsFractionRing.mk'_num_den' ℤ r
  have heq : m * (IsFractionRing.den ℤ r : ℤ) = IsFractionRing.num ℤ r * s := by
    have hs' : (s : ℚ) ≠ 0 := by exact_mod_cast hs
    have hd' : ((IsFractionRing.den ℤ r : ℤ) : ℚ) ≠ 0 := by exact_mod_cast hden
    have : ((IsFractionRing.num ℤ r : ℤ) : ℚ) / ((IsFractionRing.den ℤ r : ℤ) : ℚ) = (m : ℚ) / s := hq
    rw [div_eq_div_iff hd' hs'] at this
    exact_mod_cast this.symm
  constructor
  · have : m ∣ IsFractionRing.num ℤ r * s := ⟨_, heq.symm⟩
    exact (hms.dvd_of_dvd_mul_right this).trans hn
  · have : s ∣ m * (IsFractionRing.den ℤ r : ℤ) := ⟨_, heq.trans (mul_comm _ _)⟩
    exact (hms.symm.dvd_of_dvd_mul_left this).trans hd

/-- Predpostavke trditve `racionalne_nicle` se dajo izpolniti (`2x − 1` ima ničlo `1/2`). -/
example : IsCoprime (1 : ℤ) 2 ∧ (2 : ℤ) ≠ 0 ∧ aeval (((1 : ℤ) : ℚ) / ((2 : ℤ) : ℚ)) (C 2 * X - 1 : ℤ[X]) = 0 :=
  ⟨isCoprime_one_left, by norm_num, by rw [map_sub, map_mul, aeval_C, aeval_X, map_one]; norm_num⟩

/-- Predpostavke trditve `racionalne_nicle` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : IsCoprime (1 : ℤ) 2 ∧ (2 : ℤ) ≠ 0 ∧ aeval (((1 : ℤ) : ℚ) / ((2 : ℤ) : ℚ)) (C 2 * X - 1 : ℤ[X]) = 0 :=
    ⟨isCoprime_one_left, by norm_num, by rw [map_sub, map_mul, aeval_C, aeval_X, map_one]; norm_num⟩
  racionalne_nicle (hms := w.1) (hs := w.2.1) (h := w.2.2)

/-- Bolj natančno: pri `aₙ = 1` je vsaka racionalna ničla celo število (imenovalec deli 1).
trditev: MAT-SS-3/polinomi#racionalne-nicle-monic
besedilo: »Racionalne ničle.** Če ima polinom s celimi koeficienti ničlo $\frac{m}{s}$ (okrajšan ulomek), potem $m$ deli $a_0$ in $s$ deli $a_n$. Pri $a_n = 1$ so zato vse racionalne ničle cela števila.« -/
theorem racionalne_nicle_monic (p : ℤ[X]) (hp : p.leadingCoeff = 1) (m s : ℤ) (hms : IsCoprime m s)
    (hs : s ≠ 0) (h : aeval ((m : ℚ) / s) p = 0) : s = 1 ∨ s = -1 := by
  have := (racionalne_nicle p m s hms hs h).2
  rw [hp] at this
  exact Int.isUnit_iff.mp (isUnit_of_dvd_one this)

/-- Predpostavke trditve `racionalne_nicle_monic` se dajo izpolniti (`x − 2` z ničlo `2/1`). -/
example : (X - C 2 : ℤ[X]).leadingCoeff = 1 ∧ IsCoprime (2 : ℤ) 1 ∧
    aeval (((2 : ℤ) : ℚ) / ((1 : ℤ) : ℚ)) (X - C 2 : ℤ[X]) = 0 :=
  ⟨leadingCoeff_X_sub_C 2, isCoprime_one_right, by rw [map_sub, aeval_X, aeval_C]; norm_num⟩

/-! ## Zakaj se tega učimo, bloki 1–7 -/

/-- Zakaj se tega učimo: vstavimo 0, 1, 2, 3, 4 v `f(t) = t³ − 6t² + 11t − 6` in dobimo −6, 0, 0, 0, 6.
trditev: MAT-SS-3/polinomi#uganka-vrednosti
besedilo: »$$f(t) = t^3 - 6t^2 + 11t - 6,$$« -/
theorem uganka_vrednosti :
    (0:ℝ) ^ 3 - 6 * 0 ^ 2 + 11 * 0 - 6 = -6 ∧ (1:ℝ) ^ 3 - 6 * 1 ^ 2 + 11 * 1 - 6 = 0 ∧
    (2:ℝ) ^ 3 - 6 * 2 ^ 2 + 11 * 2 - 6 = 0 ∧ (3:ℝ) ^ 3 - 6 * 3 ^ 2 + 11 * 3 - 6 = 0 ∧
    (4:ℝ) ^ 3 - 6 * 4 ^ 2 + 11 * 4 - 6 = 6 := by norm_num

/-- Zakaj se tega učimo in Blok 6: `f(t) = 0` natanko pri `t = 1`, `2`, `3`; četrtega trenutka ni.
trditev: MAT-SS-3/polinomi#uganka-nicle
besedilo: »$$f(t) = t^3 - 6t^2 + 11t - 6,$$« -/
theorem uganka_nicle (t : ℝ) : t ^ 3 - 6 * t ^ 2 + 11 * t - 6 = 0 ↔ t = 1 ∨ t = 2 ∨ t = 3 := by
  constructor
  · intro h
    have h' : (t - 1) * ((t - 2) * (t - 3)) = 0 := by rw [← h]; ring
    rcases mul_eq_zero.mp h' with h1 | h1
    · left; linarith
    · rcases mul_eq_zero.mp h1 with h2 | h2
      · right; left; linarith
      · right; right; linarith
  · rintro (rfl | rfl | rfl) <;> norm_num

/-- Blok 1, hitri test: `p(x) = 4 − 2x³ + x` ima stopnjo 3, vodilni koeficient −2 in prosti člen 4.
trditev: MAT-SS-3/polinomi#hitri-test-stopnja
besedilo: »Hitri test:** kakšne so stopnja, vodilni koeficient in prosti člen polinoma $p(x) = 4 - 2x^3 + x$? *Odgovor: stopnja $3$, vodilni koeficient $-2$, prosti člen $4$; vrstni red zapisa ne šteje.« -/
theorem hitri_test_stopnja :
    (4 - 2 * X ^ 3 + X : ℝ[X]).natDegree = 3 ∧ (4 - 2 * X ^ 3 + X : ℝ[X]).leadingCoeff = -2 ∧
    (4 - 2 * X ^ 3 + X : ℝ[X]).coeff 0 = 4 := by
  have hd : (4 - 2 * X ^ 3 + X : ℝ[X]).natDegree = 3 := by compute_degree!
  refine ⟨hd, ?_, ?_⟩
  · rw [leadingCoeff, hd]; simp [coeff_X]
  · simp [coeff_X]

/-- Blok 1: linearna funkcija `kx + n` (`k ≠ 0`) je polinom stopnje 1 z vodilnim koeficientom `k` in prostim
členom `n`; ima natanko eno ničlo `x = −n/k`.
trditev: MAT-SS-3/polinomi#linearna
besedilo: »Linearna** $kx + n$ ($k \ne 0$): stopnja $1$, vodilni koeficient je smerni koeficient $k$, prosti člen je začetna vrednost $n$.« -/
theorem linearna (k n : ℝ) (hk : k ≠ 0) :
    (C k * X + C n).natDegree = 1 ∧ (C k * X + C n).leadingCoeff = k ∧ (C k * X + C n).coeff 0 = n ∧
    ∀ x : ℝ, k * x + n = 0 ↔ x = -n / k := by
  refine ⟨natDegree_linear hk, leadingCoeff_linear hk, by simp, fun x => ?_⟩
  rw [eq_div_iff hk]
  constructor <;> intro h <;> linarith

/-- Predpostavke trditve `linearna` se dajo izpolniti (`k = 1`). -/
example : (1:ℝ) ≠ 0 := one_ne_zero

/-- Predpostavke trditve `linearna` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 := one_ne_zero
  linearna (hk := w)

/-- Blok 1: kvadratna funkcija `ax² + bx + c` (`a ≠ 0`) je polinom stopnje 2 z vodilnim koeficientom `a` in
prostim členom `c`; ima največ dve ničli.
trditev: MAT-SS-3/polinomi#kvadratna
besedilo: »Kvadratna** $ax^2 + bx + c$ ($a \ne 0$): stopnja $2$, vodilni koeficient $a$, prosti člen $c$.« -/
theorem kvadratna (a b c : ℝ) (ha : a ≠ 0) :
    (C a * X ^ 2 + C b * X + C c).natDegree = 2 ∧ (C a * X ^ 2 + C b * X + C c).leadingCoeff = a ∧
    (C a * X ^ 2 + C b * X + C c).coeff 0 = c ∧
    Multiset.card (C a * X ^ 2 + C b * X + C c).roots ≤ 2 := by
  refine ⟨natDegree_quadratic ha, leadingCoeff_quadratic ha, by simp, ?_⟩
  exact (card_roots' _).trans (natDegree_quadratic ha).le

/-- Predpostavke trditve `kvadratna` se dajo izpolniti (`a = 1`). -/
example : (1:ℝ) ≠ 0 := one_ne_zero

/-- Predpostavke trditve `kvadratna` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 := one_ne_zero
  kvadratna (ha := w)

/-- Blok 1: konstantna funkcija `p(x) = a₀`, `a₀ ≠ 0`, je polinom stopnje 0 in nima ničel.
trditev: MAT-SS-3/polinomi#konstantna
besedilo: »Konstantna funkcija $p(x) = a_0$ z $a_0 \ne 0$ je polinom stopnje $0$.« -/
theorem konstantna (a₀ : ℝ) (h : a₀ ≠ 0) : (C a₀).natDegree = 0 ∧ ∀ x : ℝ, (C a₀).eval x ≠ 0 :=
  ⟨natDegree_C a₀, fun x => by simpa using h⟩

/-- Predpostavke trditve `konstantna` se dajo izpolniti (`a₀ = 1`). -/
example : (1:ℝ) ≠ 0 := one_ne_zero

/-- Predpostavke trditve `konstantna` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 := one_ne_zero
  konstantna (h := w)

/-- Blok 2, hitri test: `t = 4` ni ničla `f`, ker `f(4) = 64 − 96 + 44 − 6 = 6`.
trditev: MAT-SS-3/polinomi#hitri-test-f4
besedilo: »Hitri test:** ali je $t = 4$ ničla $f$? *Odgovor: ne, $f(4) = 64 - 96 + 44 - 6 = 6$.« -/
theorem hitri_test_f4 : (4:ℝ) ^ 3 - 6 * 4 ^ 2 + 11 * 4 - 6 ≠ 0 := by
  have : (4:ℝ) ^ 3 - 6 * 4 ^ 2 + 11 * 4 - 6 = 6 := by
    calc (4:ℝ) ^ 3 - 6 * 4 ^ 2 + 11 * 4 - 6 = 64 - 96 + 44 - 6 := by norm_num
      _ = 6 := by norm_num
  rw [this]; norm_num

/-- Blok 3: `157 = 12·13 + 1`, ostanek 1 je manjši od delitelja 12.
trditev: MAT-SS-3/polinomi#deljenje-stevil
besedilo: »Pri številih velja $157 = 12 \cdot 13 + 1$: deljenec je delitelj krat količnik plus ostanek, ostanek pa je manjši od delitelja.« -/
theorem deljenje_stevil : (157:ℕ) = 12 * 13 + 1 ∧ 1 < 12 := by norm_num

/-- Pomožna trditev: iz `f = (x − a)·k + r` (r število) sledi, da sta `k` količnik in `r` ostanek pri deljenju
z `x − a` (enolično, `div_modByMonic_unique`).
pomozno -/
theorem deljenje_z_linearnim (f k : ℝ[X]) (a r : ℝ) (h : f = (X - C a) * k + C r) :
    f /ₘ (X - C a) = k ∧ f %ₘ (X - C a) = C r :=
  div_modByMonic_unique k (C r) (monic_X_sub_C a)
    ⟨by rw [h]; ring, by rw [degree_X_sub_C]; exact degree_C_le.trans_lt (by norm_num)⟩

/-- Predpostavke trditve `deljenje_z_linearnim` se dajo izpolniti (`x = (x − 0)·1 + 0`). -/
example : (X : ℝ[X]) = (X - C 0) * 1 + C 0 := by simp

/-- Blok 3: koraki deljenja `(2x³ − 3x² + 4x − 5) : (x − 2)`: ostane `x² + 4x − 5`, nato `6x − 5`, nato 7.
trditev: MAT-SS-3/polinomi#blok3-koraki
besedilo: »$2x^3 : x = 2x^2$. Pomnožimo z $x - 2$: $2x^3 - 4x^2$. Ostane $x^2 + 4x - 5$.« -/
theorem blok3_koraki (x : ℝ) : 2 * x ^ 3 - 3 * x ^ 2 + 4 * x - 5 = (x - 2) * (2 * x ^ 2 + x + 6) + 7 := by
  calc 2 * x ^ 3 - 3 * x ^ 2 + 4 * x - 5 = 2 * x ^ 2 * (x - 2) + (x ^ 2 + 4 * x - 5) := by ring
    _ = 2 * x ^ 2 * (x - 2) + x * (x - 2) + (6 * x - 5) := by ring
    _ = 2 * x ^ 2 * (x - 2) + x * (x - 2) + 6 * (x - 2) + 7 := by ring
    _ = (x - 2) * (2 * x ^ 2 + x + 6) + 7 := by ring

/-- Blok 3 in Blok 5: količnik je `k(x) = 2x² + x + 6`, ostanek `r = 7`.
trditev: MAT-SS-3/polinomi#blok3-deljenje
besedilo: »Količnik je $k(x) = 2x^2 + x + 6$, ostanek $r = 7$.« -/
theorem blok3_deljenje :
    (2 * X ^ 3 - 3 * X ^ 2 + 4 * X - 5 : ℝ[X]) /ₘ (X - C 2) = 2 * X ^ 2 + X + 6 ∧
    (2 * X ^ 3 - 3 * X ^ 2 + 4 * X - 5 : ℝ[X]) %ₘ (X - C 2) = C 7 :=
  deljenje_z_linearnim _ _ 2 7 (by simp only [map_ofNat]; ring)

/-- Blok 3, premisli: `p(2) = 16 − 12 + 8 − 5 = 7`, kar je ostanek.
trditev: MAT-SS-3/polinomi#blok3-premisli
besedilo: »$p(2) = 16 - 12 + 8 - 5 = 7$, kar je točno ostanek.« -/
theorem blok3_premisli : (2:ℝ) * 2 ^ 3 - 3 * 2 ^ 2 + 4 * 2 - 5 = 7 := by
  calc (2:ℝ) * 2 ^ 3 - 3 * 2 ^ 2 + 4 * 2 - 5 = 16 - 12 + 8 - 5 := by norm_num
    _ = 7 := by norm_num

/-- Blok 4, hitri test: ostanek pri deljenju `x² + 1` z `x − 3` je `3² + 1 = 10`.
trditev: MAT-SS-3/polinomi#blok4-hitri-test
besedilo: »Hitri test:** kolikšen je ostanek pri deljenju $x^2 + 1$ z $x - 3$? *Odgovor: $3^2 + 1 = 10$, deliti ni treba.« -/
theorem blok4_hitri_test : (X ^ 2 + 1 : ℝ[X]) %ₘ (X - C 3) = C 10 := by
  rw [modByMonic_X_sub_C_eq_C_eval]; norm_num

/-- Blok 5: Hornerjev algoritem za polinom tretje stopnje (vsi primeri lekcije): prepišemo `c₃`, nato
»pomnoži z `a`, prištej naslednjega«; spodnja vrstica so koeficienti količnika, zadnje število je ostanek
`p(a)`. (Za poljubno stopnjo glej glavo.)
trditev: MAT-SS-3/polinomi#horner-3
besedilo: »Hornerjev algoritem: prepiši prvi koeficient, nato »pomnoži z $a$, prištej naslednjega«; zadnje število je $p(a)$.« -/
theorem horner_3 (c₃ c₂ c₁ c₀ a x : ℝ) :
    let b₂ := c₃; let b₁ := b₂ * a + c₂; let b₀ := b₁ * a + c₁; let r := b₀ * a + c₀
    c₃ * x ^ 3 + c₂ * x ^ 2 + c₁ * x + c₀ = (x - a) * (b₂ * x ^ 2 + b₁ * x + b₀) + r ∧
      r = c₃ * a ^ 3 + c₂ * a ^ 2 + c₁ * a + c₀ := by
  intro b₂ b₁ b₀ r
  constructor <;> (simp only [b₂, b₁, b₀, r]; ring)

/-- Blok 5, tabela za `a = 2`: srednja vrstica 4, 2, 12, spodnja 2, 1, 6, 7.
trditev: MAT-SS-3/polinomi#blok5-tabela
besedilo: »Spodnja vrstica so koeficienti količnika $2x^2 + x + 6$, zadnje število je ostanek $7$, torej tudi $p(2)$.« -/
theorem blok5_tabela :
    (2:ℝ) * 2 = 4 ∧ (-3:ℝ) + 4 = 1 ∧ (1:ℝ) * 2 = 2 ∧ (4:ℝ) + 2 = 6 ∧ (6:ℝ) * 2 = 12 ∧ (-5:ℝ) + 12 = 7 := by
  norm_num

/-- Blok 5, premisli: pri deljenju z `x + 3` množimo z `a = −3`, ker `x + 3 = x − (−3)`.
trditev: MAT-SS-3/polinomi#blok5-premisli
besedilo: »Število $-3$, ker je $x + 3 = x - (-3)$.« -/
theorem blok5_premisli (x : ℝ) : x + 3 = x - (-3) := by ring

/-- Pomožna trditev: delitelji števila `n` (`0 < n`) so med `−n, …, n`; uporabljeno za kandidate.
pomozno -/
theorem delitelj_meje (a n : ℤ) (hn : 0 < n) (h : a ∣ n) : -n ≤ a ∧ a ≤ n := by
  have h1 := Int.le_of_dvd hn h
  have h2 := Int.le_of_dvd hn (neg_dvd.mpr h)
  constructor <;> linarith

/-- Predpostavke trditve `delitelj_meje` se dajo izpolniti (`1 ∣ 6`). -/
example : (0:ℤ) < 6 ∧ (1:ℤ) ∣ 6 := by norm_num

/-- Blok 6: kandidati za cele ničle `f` so delitelji prostega člena −6: `±1, ±2, ±3, ±6`.
trditev: MAT-SS-3/polinomi#kandidati-uganka
besedilo: »Pri uganki je prosti člen $-6$, zato so kandidati $\pm 1, \pm 2, \pm 3, \pm 6$.« -/
theorem kandidati_uganka (a : ℤ) : a ∣ -6 ↔ a ∈ ({1, -1, 2, -2, 3, -3, 6, -6} : Finset ℤ) := by
  constructor
  · intro h
    obtain ⟨h1, h2⟩ := delitelj_meje a 6 (by norm_num) (dvd_neg.mp h)
    interval_cases a <;> simp_all
  · intro h; simp only [Finset.mem_insert, Finset.mem_singleton] at h
    rcases h with rfl | rfl | rfl | rfl | rfl | rfl | rfl | rfl <;> norm_num

/-- Blok 6: s Hornerjem iz ničle 1 dobimo količnik `t² − 5t + 6 = (t − 2)(t − 3)`, zato
`f(t) = (t − 1)(t − 2)(t − 3)`.
trditev: MAT-SS-3/polinomi#uganka-razcep
besedilo: »$f(t) = (t - 1)(t - 2)(t - 3).$« -/
theorem uganka_razcep (t : ℝ) : t ^ 3 - 6 * t ^ 2 + 11 * t - 6 = (t - 1) * (t ^ 2 - 5 * t + 6) ∧
    t ^ 2 - 5 * t + 6 = (t - 2) * (t - 3) ∧
    t ^ 3 - 6 * t ^ 2 + 11 * t - 6 = (t - 1) * (t - 2) * (t - 3) := by
  refine ⟨by ring, by ring, by ring⟩

/-- Blok 6, hitri test (kandidati): delitelji −5 so natanko `±1` in `±5`.
trditev: MAT-SS-3/polinomi#delitelji-5
besedilo: »Hitri test:** kateri kandidati za cele ničle pridejo v poštev pri $x^3 + 2x - 5$? *Odgovor: $\pm 1$ in $\pm 5$.« -/
theorem delitelji_5 (a : ℤ) : a ∣ -5 ↔ a ∈ ({1, -1, 5, -5} : Finset ℤ) := by
  constructor
  · intro h
    obtain ⟨h1, h2⟩ := delitelj_meje a 5 (by norm_num) (dvd_neg.mp h)
    interval_cases a <;> simp_all
  · intro h; simp only [Finset.mem_insert, Finset.mem_singleton] at h
    rcases h with rfl | rfl | rfl | rfl <;> norm_num

/-- Blok 6, hitri test: prosti člen `x³ + 2x − 5` je −5, zato so kandidati za cele ničle le njegovi delitelji
`±1` in `±5` (glej `cela_nicla_deli_prosti_clen`).
trditev: MAT-SS-3/polinomi#hitri-test-kandidati
besedilo: »Hitri test:** kateri kandidati za cele ničle pridejo v poštev pri $x^3 + 2x - 5$? *Odgovor: $\pm 1$ in $\pm 5$.« -/
theorem hitri_test_kandidati :
    (X ^ 3 + 2 * X - 5 : ℤ[X]).coeff 0 = -5 ∧
      ∀ a : ℤ, a ∣ (X ^ 3 + 2 * X - 5 : ℤ[X]).coeff 0 ↔ a ∈ ({1, -1, 5, -5} : Finset ℤ) := by
  have h : (X ^ 3 + 2 * X - 5 : ℤ[X]).coeff 0 = -5 := by simp [coeff_X, coeff_X_pow]
  refine ⟨h, fun a => ?_⟩
  rw [h]
  exact delitelji_5 a

/-- Blok 7: `x² + 1` nima realne ničle; med kompleksnimi ima ničli `i` in `−i`, ker `x² + 1 = (x − i)(x + i)`.
trditev: MAT-SS-3/polinomi#x2-plus-1
besedilo: »Blok 7: osnovni izrek algebre.** Polinom $x^2 + 1$ nima nobene realne ničle. Med kompleksnimi števili pa ima dve: $i$ in $-i$, saj je $x^2 + 1 = (x - i)(x + i)$. To ni naključje.« -/
theorem x2_plus_1 : (∀ x : ℝ, x ^ 2 + 1 ≠ 0) ∧ (∀ z : ℂ, z ^ 2 + 1 = (z - Complex.I) * (z + Complex.I)) ∧
    ∀ z : ℂ, z ^ 2 + 1 = 0 ↔ z = Complex.I ∨ z = -Complex.I := by
  have hf : ∀ z : ℂ, z ^ 2 + 1 = (z - Complex.I) * (z + Complex.I) := fun z => by
    linear_combination Complex.I_sq
  refine ⟨fun x => by positivity, hf, fun z => ?_⟩
  rw [hf, mul_eq_zero, sub_eq_zero, add_eq_zero_iff_eq_neg]

/-- Blok 7, primer: `x³ − 1 = (x − 1)(x² + x + 1)`; kvadratni faktor ima diskriminanto `1 − 4 = −3` in
ničli `−1/2 ± (√3/2)i`.
trditev: MAT-SS-3/polinomi#x3-minus-1
besedilo: »Primer: $x^3 - 1 = (x - 1)(x^2 + x + 1)$. Kvadratni faktor ima diskriminanto $1 - 4 = -3$ in konjugirani ničli $-\frac{1}{2} \pm \frac{\sqrt{3}}{2}\,i$. Polinom ima tri kompleksne ničle, od tega eno realno.« -/
theorem x3_minus_1 :
    (∀ x : ℂ, x ^ 3 - 1 = (x - 1) * (x ^ 2 + x + 1)) ∧ (1:ℝ) ^ 2 - 4 * 1 * 1 = 1 - 4 ∧ (1:ℝ) - 4 = -3 ∧
    ∀ s : ℝ, s = 1 ∨ s = -1 →
      let z : ℂ := -1 / 2 + (s : ℂ) * ((Real.sqrt 3 : ℂ) / 2) * Complex.I
      z ^ 2 + z + 1 = 0 := by
  refine ⟨fun x => by ring, by norm_num, by norm_num, fun s hs => ?_⟩
  intro z
  have h3 : ((Real.sqrt 3 : ℝ) : ℂ) ^ 2 = 3 := by
    rw [← Complex.ofReal_pow, Real.sq_sqrt (by norm_num)]; norm_num
  have hs2 : (s : ℂ) ^ 2 = 1 := by rcases hs with rfl | rfl <;> norm_num
  have hb : ((s : ℂ) * ((Real.sqrt 3 : ℂ) / 2)) ^ 2 = 3 / 4 := by
    rw [mul_pow, div_pow, h3, hs2]; norm_num
  simp only [z]
  linear_combination (Complex.I ^ 2) * hb + (3 / 4 : ℂ) * Complex.I_sq

/-- Blok 7, primer: `x³ − 1` ima eno samo realno ničlo, `x = 1`.
trditev: MAT-SS-3/polinomi#x3-minus-1-realna
besedilo: »Polinom $x^3 + x$ ima eno samo realno ničlo, $0$.« -/
theorem x3_minus_1_realna (x : ℝ) : x ^ 3 - 1 = 0 ↔ x = 1 := by
  constructor
  · intro h
    have h' : (x - 1) * (x ^ 2 + x + 1) = 0 := by rw [← h]; ring
    rcases mul_eq_zero.mp h' with h1 | h1
    · linarith
    · nlinarith [sq_nonneg (x + 1 / 2)]
  · rintro rfl; norm_num

/-! ## Rešeni primeri -/

/-- Primer 1, korak 2: Horner z `a = 3` na `1, −2, −5, 6`: `1·3 − 2 = 1`, `1·3 − 5 = −2`, `−2·3 + 6 = 0`.
trditev: MAT-SS-3/polinomi#primer1-horner
besedilo: »Naprej: $1 \cdot 3 - 2 = 1$, nato $1 \cdot 3 - 5 = -2$, nato $-2 \cdot 3 + 6 = 0$.« -/
theorem primer1_horner : (1:ℝ) * 3 - 2 = 1 ∧ (1:ℝ) * 3 - 5 = -2 ∧ (-2:ℝ) * 3 + 6 = 0 := by norm_num

/-- Primer 1, koraka 3 in 4: `p(3) = 0`, torej je 3 ničla in `p(x) = (x − 3)(x² + x − 2)`.
trditev: MAT-SS-3/polinomi#primer1
besedilo: »Odgovor: $x = 3$ je ničla, količnik je $k(x) = x^2 + x - 2$, zato $p(x) = (x - 3)(x^2 + x - 2)$.« -/
theorem primer1 : (3:ℝ) ^ 3 - 2 * 3 ^ 2 - 5 * 3 + 6 = 0 ∧
    ∀ x : ℝ, x ^ 3 - 2 * x ^ 2 - 5 * x + 6 = (x - 3) * (x ^ 2 + x - 2) :=
  ⟨by norm_num, fun x => by ring⟩

/-- Primer 1: količnik pri deljenju z `x − 3` je `x² + x − 2`, ostanek 0.
trditev: MAT-SS-3/polinomi#primer1-deljenje
besedilo: »S Hornerjevim algoritmom preveri, ali je $x = 3$ ničla polinoma $p(x) = x^3 - 2x^2 - 5x + 6$, in zapiši količnik pri deljenju z $x - 3$.« -/
theorem primer1_deljenje :
    (X ^ 3 - 2 * X ^ 2 - 5 * X + 6 : ℝ[X]) /ₘ (X - C 3) = X ^ 2 + X - 2 ∧
    (X ^ 3 - 2 * X ^ 2 - 5 * X + 6 : ℝ[X]) %ₘ (X - C 3) = C 0 :=
  deljenje_z_linearnim _ _ 3 0 (by simp only [map_ofNat, map_zero]; ring)

/-- Primer 2, koraki 2–4: deljenje `(x⁴ − 3x³ + x − 5) : (x² + 1)`; ostane `−3x³ − x² + x − 5`, nato
`−x² + 4x − 5`, nato `4x − 4`.
trditev: MAT-SS-3/polinomi#primer2-koraki
besedilo: »$x^4 : x^2 = x^2$; $x^2(x^2 + 1) = x^4 + x^2$; ostane $-3x^3 - x^2 + x - 5$.« -/
theorem primer2_koraki (x : ℝ) :
    x ^ 4 - 3 * x ^ 3 + x - 5 = (x ^ 2 + 1) * (x ^ 2 - 3 * x - 1) + (4 * x - 4) := by
  calc x ^ 4 - 3 * x ^ 3 + x - 5 = x ^ 4 - 3 * x ^ 3 + 0 * x ^ 2 + x - 5 := by ring
    _ = x ^ 2 * (x ^ 2 + 1) + (-3 * x ^ 3 - x ^ 2 + x - 5) := by ring
    _ = x ^ 2 * (x ^ 2 + 1) + (-3 * x) * (x ^ 2 + 1) + (-x ^ 2 + 4 * x - 5) := by ring
    _ = x ^ 2 * (x ^ 2 + 1) + (-3 * x) * (x ^ 2 + 1) + (-1) * (x ^ 2 + 1) + (4 * x - 4) := by ring
    _ = (x ^ 2 + 1) * (x ^ 2 - 3 * x - 1) + (4 * x - 4) := by ring

/-- Primer 2, korak 5: preizkus pri `x = 2`: `p(2) = −11` in `5·(−3) + 4 = −11`.
trditev: MAT-SS-3/polinomi#primer2-preizkus
besedilo: »Preizkus pri $x = 2$: $p(2) = -11$, desna stran $5 \cdot (-3) + 4 = -11$.« -/
theorem primer2_preizkus : (2:ℝ) ^ 4 - 3 * 2 ^ 3 + 2 - 5 = -11 ∧
    ((2:ℝ) ^ 2 + 1) * (2 ^ 2 - 3 * 2 - 1) + (4 * 2 - 4) = 5 * (-3) + 4 ∧ (5:ℝ) * (-3) + 4 = -11 := by
  norm_num

/-- Primer 2, odgovor: količnik je `x² − 3x − 1`, ostanek `4x − 4` (enolično, ostanek stopnje manj kot 2).
trditev: MAT-SS-3/polinomi#primer2-deljenje
besedilo: »Odgovor: $k(x) = x^2 - 3x - 1$, $r(x) = 4x - 4$.« -/
theorem primer2_deljenje :
    (X ^ 4 - 3 * X ^ 3 + X - 5 : ℝ[X]) /ₘ (X ^ 2 + C 1) = X ^ 2 - 3 * X - 1 ∧
    (X ^ 4 - 3 * X ^ 3 + X - 5 : ℝ[X]) %ₘ (X ^ 2 + C 1) = C 4 * X + C (-4) := by
  apply div_modByMonic_unique _ _ (monic_X_pow_add_C 1 (by norm_num))
  refine ⟨by simp only [map_ofNat, map_neg, map_one]; ring, ?_⟩
  rw [degree_X_pow_add_C (by norm_num)]
  exact degree_linear_le.trans_lt (by norm_num)

/-- Primer 3, korak 1: kandidati za cele ničle so delitelji 15: `±1, ±3, ±5, ±15`.
trditev: MAT-SS-3/polinomi#primer3-kandidati
besedilo: »Kandidati so delitelji $15$: $\pm 1, \pm 3, \pm 5, \pm 15$.« -/
theorem primer3_kandidati (a : ℤ) : a ∣ 15 ↔ a ∈ ({1, -1, 3, -3, 5, -5, 15, -15} : Finset ℤ) := by
  constructor
  · intro h
    obtain ⟨h1, h2⟩ := delitelj_meje a 15 (by norm_num) h
    interval_cases a <;> simp_all
  · intro h; simp only [Finset.mem_insert, Finset.mem_singleton] at h
    rcases h with rfl | rfl | rfl | rfl | rfl | rfl | rfl | rfl <;> norm_num

/-- Primer 3, koraka 2 in 3: `h(1) = 1 − 7 + 7 + 15 = 16`, `h(−1) = −1 − 7 − 7 + 15 = 0`; Horner z `a = −1`:
`1`, `1·(−1) − 7 = −8`, `−8·(−1) + 7 = 15`, `15·(−1) + 15 = 0`.
trditev: MAT-SS-3/polinomi#primer3-koraki
besedilo: »Horner z $a = -1$: $1$; $1 \cdot (-1) - 7 = -8$; $-8 \cdot (-1) + 7 = 15$; $15 \cdot (-1) + 15 = 0$. Količnik je $t^2 - 8t + 15$.« -/
theorem primer3_koraki :
    (1:ℝ) ^ 3 - 7 * 1 ^ 2 + 7 * 1 + 15 = 1 - 7 + 7 + 15 ∧ (1:ℝ) - 7 + 7 + 15 = 16 ∧
    (-1:ℝ) ^ 3 - 7 * (-1) ^ 2 + 7 * (-1) + 15 = -1 - 7 - 7 + 15 ∧ (-1:ℝ) - 7 - 7 + 15 = 0 ∧
    (1:ℝ) * (-1) - 7 = -8 ∧ (-8:ℝ) * (-1) + 7 = 15 ∧ (15:ℝ) * (-1) + 15 = 0 := by norm_num

/-- Primer 3, koraki 3–5: `h(t) = (t + 1)(t² − 8t + 15)`, `t² − 8t + 15 = (t − 3)(t − 5)` (`3·5 = 15`,
`3 + 5 = 8`), torej `h(t) = (t + 1)(t − 3)(t − 5)`.
trditev: MAT-SS-3/polinomi#primer3-razcep
besedilo: »Kvadratni del razstavimo: $t^2 - 8t + 15 = (t - 3)(t - 5)$, ker $3 \cdot 5 = 15$ in $3 + 5 = 8$.« -/
theorem primer3_razcep (t : ℝ) :
    t ^ 3 - 7 * t ^ 2 + 7 * t + 15 = (t + 1) * (t ^ 2 - 8 * t + 15) ∧
    t ^ 2 - 8 * t + 15 = (t - 3) * (t - 5) ∧ (3:ℝ) * 5 = 15 ∧ (3:ℝ) + 5 = 8 ∧
    t ^ 3 - 7 * t ^ 2 + 7 * t + 15 = (t + 1) * (t - 3) * (t - 5) :=
  ⟨by ring, by ring, by norm_num, by norm_num, by ring⟩

/-- Primer 3, korak 5: ničle `h` so natanko −1, 3 in 5.
trditev: MAT-SS-3/polinomi#primer3-nicle
besedilo: »Torej $h(t) = (t + 1)(t - 3)(t - 5)$, ničle so $-1$, $3$ in $5$.« -/
theorem primer3_nicle (t : ℝ) : t ^ 3 - 7 * t ^ 2 + 7 * t + 15 = 0 ↔ t = -1 ∨ t = 3 ∨ t = 5 := by
  constructor
  · intro h
    have h' : (t + 1) * ((t - 3) * (t - 5)) = 0 := by rw [← h]; ring
    rcases mul_eq_zero.mp h' with h1 | h1
    · left; linarith
    · rcases mul_eq_zero.mp h1 with h2 | h2
      · right; left; linarith
      · right; right; linarith
  · rintro (rfl | rfl | rfl) <;> norm_num

/-- Primer 3, koraka 6 in 7: za `0 ≤ t ≤ 6` je sonda na tirnici natanko pri `t = 3` in `t = 5` minut.
trditev: MAT-SS-3/polinomi#primer3-odgovor
besedilo: »Med popravkom tirnice opisuje odmik vesoljske sonde od načrtovane tirnice (v metrih) polinom $h(t) = t^3 - 7t^2 + 7t + 15$, kjer je $t$ čas v minutah od začetka popravka, $0 \le t \le 6$.« -/
theorem primer3_odgovor (t : ℝ) (h0 : 0 ≤ t) (_h6 : t ≤ 6) :
    t ^ 3 - 7 * t ^ 2 + 7 * t + 15 = 0 ↔ t = 3 ∨ t = 5 := by
  rw [primer3_nicle]
  constructor
  · rintro (h | h | h)
    · linarith
    · exact Or.inl h
    · exact Or.inr h
  · rintro (h | h)
    · exact Or.inr (Or.inl h)
    · exact Or.inr (Or.inr h)

/-- Predpostavke trditve `primer3_odgovor` se dajo izpolniti (`t = 3`). -/
example : (0:ℝ) ≤ 3 ∧ (3:ℝ) ≤ 6 := by norm_num

/-- Predpostavke trditve `primer3_odgovor` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 3 ∧ (3:ℝ) ≤ 6 := by norm_num
  primer3_odgovor (h0 := w.1) (_h6 := w.2)

/-- Primer 4: Horner z `a = −2` na `2, 1, −8, 1`: `2·(−2) + 1 = −3`, `−3·(−2) − 8 = −2`, `−2·(−2) + 1 = 5`;
preizkus `p(−2) = −16 + 4 + 16 + 1 = 5`.
trditev: MAT-SS-3/polinomi#primer4-koraki
besedilo: »$-3 \cdot (-2) - 8 = -2$ in $-2 \cdot (-2) + 1 = 5$. Količnik je $2x^2 - 3x - 2$, ostanek $5$. Preizkus: $p(-2) = -16 + 4 + 16 + 1 = 5$.« -/
theorem primer4_koraki :
    (2:ℝ) * (-2) + 1 = -3 ∧ (-3:ℝ) * (-2) - 8 = -2 ∧ (-2:ℝ) * (-2) + 1 = 5 ∧
    (2:ℝ) * (-2) ^ 3 + (-2) ^ 2 - 8 * (-2) + 1 = -16 + 4 + 16 + 1 ∧ (-16:ℝ) + 4 + 16 + 1 = 5 := by
  norm_num

/-- Primer 4: pri deljenju z `x + 2 = x − (−2)` je količnik `2x² − 3x − 2`, ostanek 5.
trditev: MAT-SS-3/polinomi#primer4-deljenje
besedilo: »$-3 \cdot (-2) - 8 = -2$ in $-2 \cdot (-2) + 1 = 5$. Količnik je $2x^2 - 3x - 2$, ostanek $5$. Preizkus: $p(-2) = -16 + 4 + 16 + 1 = 5$.« -/
theorem primer4_deljenje :
    (2 * X ^ 3 + X ^ 2 - 8 * X + 1 : ℝ[X]) /ₘ (X - C (-2)) = 2 * X ^ 2 - 3 * X - 2 ∧
    (2 * X ^ 3 + X ^ 2 - 8 * X + 1 : ℝ[X]) %ₘ (X - C (-2)) = C 5 :=
  deljenje_z_linearnim _ _ (-2) 5 (by simp only [map_ofNat, map_neg]; ring)

/-- Primer 5, korak 2: `(x − 1 − i)(x − 1 + i) = (x − 1)² − i² = x² − 2x + 2`.
trditev: MAT-SS-3/polinomi#primer5-konjugirana
besedilo: »$(x - 1 - i)(x - 1 + i) = (x - 1)^2 - i^2 = x^2 - 2x + 2$« -/
theorem primer5_konjugirana (x : ℂ) :
    (x - 1 - Complex.I) * (x - 1 + Complex.I) = x ^ 2 - 2 * x + 2 := by
  calc (x - 1 - Complex.I) * (x - 1 + Complex.I) = (x - 1) ^ 2 - Complex.I ^ 2 := by ring
    _ = x ^ 2 - 2 * x + 2 := by rw [Complex.I_sq]; ring

/-- Primer 5, koraka 3 in 4: `(x − 2)(x² − 2x + 2) = x³ − 4x² + 6x − 4`; preizkus `p(2) = 8 − 16 + 12 − 4 = 0`.
trditev: MAT-SS-3/polinomi#primer5-razvoj
besedilo: »Preizkus: $p(2) = 8 - 16 + 12 - 4 = 0$.« -/
theorem primer5_razvoj :
    (∀ x : ℝ, (x - 2) * (x ^ 2 - 2 * x + 2) = x ^ 3 - 4 * x ^ 2 + 6 * x - 4) ∧
    (2:ℝ) ^ 3 - 4 * 2 ^ 2 + 6 * 2 - 4 = 8 - 16 + 12 - 4 ∧ (8:ℝ) - 16 + 12 - 4 = 0 :=
  ⟨fun x => by ring, by norm_num, by norm_num⟩

/-- Primer 5 (enoličnost): edini polinom tretje stopnje z realnimi koeficienti in vodilnim koeficientom 1 z
ničlama 2 in `1 + i` je `x³ − 4x² + 6x − 4` (ničle so 2, `1 + i`, `1 − i` in več jih ni).
trditev: MAT-SS-3/polinomi#primer5-enolicnost
besedilo: »Sestavi polinom tretje stopnje z realnimi koeficienti in vodilnim koeficientom $1$, ki ima ničli $2$ in $1 + i$.« -/
theorem primer5_enolicnost (p : ℝ[X]) (hm : p.Monic) (hd : p.natDegree = 3)
    (h2 : aeval (2 : ℂ) p = 0) (hi : aeval (1 + Complex.I) p = 0) :
    p = X ^ 3 - 4 * X ^ 2 + 6 * X - 4 := by
  set P := p.map (algebraMap ℝ ℂ) with hPdef
  have hPm : P.Monic := hm.map _
  have hP0 : P ≠ 0 := hPm.ne_zero
  have hPd : P.natDegree = 3 := by rw [hPdef, natDegree_map]; exact hd
  have hroot : ∀ z : ℂ, aeval z p = 0 → z ∈ P.roots := fun z hz => by
    rw [mem_roots hP0, IsRoot.def, hPdef, eval_map, ← aeval_def]; exact hz
  have hc := konjugirana_nicla p _ hi
  have hc' : starRingEnd ℂ (1 + Complex.I) = 1 - Complex.I := by
    simp [map_add, Complex.conj_I]; ring
  rw [hc'] at hc
  have hne1 : (2 : ℂ) ≠ 1 + Complex.I := by simp [Complex.ext_iff]
  have hne2 : (2 : ℂ) ≠ 1 - Complex.I := by simp [Complex.ext_iff]
  have hne3 : (1 + Complex.I : ℂ) ≠ 1 - Complex.I := by simp [Complex.ext_iff]; norm_num
  have hle : ({2, 1 + Complex.I, 1 - Complex.I} : Multiset ℂ) ≤ P.roots := by
    rw [Multiset.le_iff_subset (by simp [hne1, hne2, hne3])]
    intro z hz
    simp only [Multiset.insert_eq_cons, Multiset.mem_cons, Multiset.mem_singleton] at hz
    rcases hz with rfl | rfl | rfl
    · exact hroot _ h2
    · exact hroot _ hi
    · exact hroot _ hc
  have hroots : P.roots = {2, 1 + Complex.I, 1 - Complex.I} :=
    (Multiset.eq_of_le_of_card_le hle (by have := card_roots' P; rw [hPd] at this; simpa using this)).symm
  have hprod := prod_multiset_X_sub_C_of_monic_of_roots_card_eq hPm (by rw [hroots, hPd]; rfl)
  rw [hroots] at hprod
  simp only [Multiset.insert_eq_cons, Multiset.map_cons, Multiset.prod_cons, Multiset.map_singleton,
    Multiset.prod_singleton] at hprod
  have hq : (X - C (1 + Complex.I)) * (X - C (1 - Complex.I)) = (X ^ 2 - 2 * X + 2 : ℂ[X]) := by
    have e : ∀ a b : ℂ, (X - C a) * (X - C b) = X ^ 2 - C (a + b) * X + C (a * b) := by
      intro a b; rw [C_add, C_mul]; ring
    have e1 : (1 + Complex.I) + (1 - Complex.I) = 2 := by ring
    have e2 : (1 + Complex.I) * (1 - Complex.I) = 2 := by
      linear_combination -Complex.I_sq
    rw [e, e1, e2, map_ofNat]
  apply map_injective (algebraMap ℝ ℂ) (algebraMap ℝ ℂ).injective
  rw [← hPdef, ← hprod, hq]
  simp only [Polynomial.map_sub, Polynomial.map_add, Polynomial.map_mul, Polynomial.map_pow, map_X,
    Polynomial.map_ofNat, map_ofNat]
  ring

/-- Predpostavke trditve `primer5_enolicnost` se dajo izpolniti (`p = x³ − 4x² + 6x − 4`). -/
example : (X ^ 3 - 4 * X ^ 2 + 6 * X - 4 : ℝ[X]).Monic ∧ (X ^ 3 - 4 * X ^ 2 + 6 * X - 4 : ℝ[X]).natDegree = 3 ∧
    aeval (2 : ℂ) (X ^ 3 - 4 * X ^ 2 + 6 * X - 4 : ℝ[X]) = 0 ∧
    aeval (1 + Complex.I) (X ^ 3 - 4 * X ^ 2 + 6 * X - 4 : ℝ[X]) = 0 := by
  have e : (X ^ 3 - 4 * X ^ 2 + 6 * X - 4 : ℝ[X]) = X ^ 3 - C 4 * X ^ 2 + C 6 * X - C 4 := by
    simp only [map_ofNat]
  refine ⟨by monicity!, by compute_degree!, ?_, ?_⟩
  · rw [e]; simp; norm_num
  · rw [e]; simp
    linear_combination (Complex.I - 1) * Complex.I_sq

/-! ## Pogoste napake -/

/-- Predpostavke trditve `primer5_enolicnost` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (X ^ 3 - 4 * X ^ 2 + 6 * X - 4 : ℝ[X]).Monic ∧ (X ^ 3 - 4 * X ^ 2 + 6 * X - 4 : ℝ[X]).natDegree = 3 ∧ aeval (2 : ℂ) (X ^ 3 - 4 * X ^ 2 + 6 * X - 4 : ℝ[X]) = 0 ∧ aeval (1 + Complex.I) (X ^ 3 - 4 * X ^ 2 + 6 * X - 4 : ℝ[X]) = 0 := by
    have e : (X ^ 3 - 4 * X ^ 2 + 6 * X - 4 : ℝ[X]) = X ^ 3 - C 4 * X ^ 2 + C 6 * X - C 4 := by
      simp only [map_ofNat]
    refine ⟨by monicity!, by compute_degree!, ?_, ?_⟩
    · rw [e]; simp; norm_num
    · rw [e]; simp
      linear_combination (Complex.I - 1) * Complex.I_sq
  primer5_enolicnost (hm := w.1) (hd := w.2.1) (h2 := w.2.2.1) (hi := w.2.2.2)

/-- Pogoste napake (manjkajoča potenca): koeficienti `2x³ − 5x + 3` od najvišje potence so 2, 0, −5, 3.
trditev: MAT-SS-3/polinomi#napaka-manjkajoca-potenca
besedilo: »Manjkajoča potenca brez ničle.** Pri $2x^3 - 5x + 3$ nekdo v Hornerjevo shemo napiše le $2, -5, 3$ in računa, kot da gre za polinom druge stopnje. Vsaka potenca od najvišje do $x^0$ mora imeti svoje mesto, zato $2, 0, -5, 3$.« -/
theorem napaka_manjkajoca_potenca :
    (2 * X ^ 3 - 5 * X + 3 : ℝ[X]).coeff 3 = 2 ∧ (2 * X ^ 3 - 5 * X + 3 : ℝ[X]).coeff 2 = 0 ∧
    (2 * X ^ 3 - 5 * X + 3 : ℝ[X]).coeff 1 = -5 ∧ (2 * X ^ 3 - 5 * X + 3 : ℝ[X]).coeff 0 = 3 := by
  refine ⟨?_, ?_, ?_, ?_⟩ <;> simp [coeff_X, coeff_X_pow]

/-- Pogoste napake (predznak `a`): delitelj `x + 2` je enak 0 natanko pri `x = −2`.
trditev: MAT-SS-3/polinomi#napaka-predznak
besedilo: »Napačen predznak števila $a$.** Pri deljenju z $x + 2$ se zdi naravno vzeti $2$. Algoritem pa računa v točki, kjer je delitelj enak $0$: $x + 2 = 0$ pri $x = -2$.« -/
theorem napaka_predznak (x : ℝ) : x + 2 = 0 ↔ x = -2 := by
  constructor <;> intro h <;> linarith

/-- Pogoste napake (odštevanje celega oklepaja): `−3x² − (−4x²) = x²`, ne `−7x²`.
trditev: MAT-SS-3/polinomi#napaka-odstevanje
besedilo: »Odštevanje samo prvega člena.** Pri deljenju učenec odšteje $2x^3 - 4x^2$, a $-4x^2$ prišteje namesto odšteje in dobi $-7x^2$. Odštevaš cel oklepaj, zato se spremenijo vsi predznaki: $-3x^2 - (-4x^2) = x^2$.« -/
theorem napaka_odstevanje (x : ℝ) : -3 * x ^ 2 - (-4 * x ^ 2) = x ^ 2 := by ring

/-- Pogoste napake (kandidati samo pozitivni): v Primeru 3 je ničla tudi negativni kandidat −1.
trditev: MAT-SS-3/polinomi#napaka-negativni
besedilo: »Kandidati samo pozitivni.** Kdor preizkusi le $1, 3, 5, 15$, v Primeru 3 spregleda ničlo $-1$.« -/
theorem napaka_negativni : (-1:ℝ) ^ 3 - 7 * (-1) ^ 2 + 7 * (-1) + 15 = 0 := by norm_num

/-- Pogoste napake in Ustno vprašanje 3: `x³ + x = x(x² + 1)` ima eno samo realno ničlo, 0, ker je
`x² + 1 > 0`.
trditev: MAT-SS-3/polinomi#x3-plus-x
besedilo: »Primer je $p(x) = x^3 + x = x(x^2 + 1)$: faktor $x^2 + 1$ je vedno pozitiven, zato je edina realna ničla $0$.« -/
theorem x3_plus_x (x : ℝ) : x ^ 3 + x = x * (x ^ 2 + 1) ∧ 0 < x ^ 2 + 1 ∧ (x ^ 3 + x = 0 ↔ x = 0) := by
  have hf : x ^ 3 + x = x * (x ^ 2 + 1) := by ring
  have hp : 0 < x ^ 2 + 1 := by positivity
  refine ⟨hf, hp, ?_⟩
  rw [hf, mul_eq_zero]
  constructor
  · rintro (h | h)
    · exact h
    · linarith
  · intro h; exact Or.inl h

/-- Pogoste napake in Ustno vprašanje 3: `x³ + x` ima stopnjo 3.
trditev: MAT-SS-3/polinomi#x3-plus-x-stopnja
besedilo: »»Stopnja $3$ pomeni tri ničle.«** Stopnja pove, koliko ničel je **največ**. Polinom $x^3 + x$ ima eno samo realno ničlo, $0$.« -/
theorem x3_plus_x_stopnja : (X ^ 3 + X : ℝ[X]).natDegree = 3 := by compute_degree!

/-! ## Za maturo -/

/-- Naloga 1, koraki 1 in 2: `x³ + mx² − 4x + 12` je deljiv z `x − 2` natanko tedaj, ko
`p(2) = 8 + 4m − 8 + 12 = 4m + 12 = 0`, torej `m = −3`.
trditev: MAT-SS-3/polinomi#matura1
besedilo: »$p(2) = 8 + 4m - 8 + 12 = 4m + 12$. Iz $4m + 12 = 0$ sledi $m = -3$.« -/
theorem matura1 (m : ℝ) : X - C 2 ∣ (X ^ 3 + C m * X ^ 2 - 4 * X + 12 : ℝ[X]) ↔ m = -3 := by
  have hp : (X ^ 3 + C m * X ^ 2 - 4 * X + 12 : ℝ[X]).eval 2 = 4 * m + 12 := by
    simp; ring
  rw [dvd_iff_isRoot, IsRoot.def, hp]
  have : (2:ℝ) ^ 3 + 4 * m - 8 + 12 = 4 * m + 12 := by ring
  constructor <;> intro h <;> linarith

/-- Naloga 1, korak 2: `p(2) = 8 + 4m − 8 + 12 = 4m + 12`.
trditev: MAT-SS-3/polinomi#matura1-p2
besedilo: »$p(2) = 8 + 4m - 8 + 12 = 4m + 12$. Iz $4m + 12 = 0$ sledi $m = -3$.« -/
theorem matura1_p2 (m : ℝ) : (2:ℝ) ^ 3 + m * 2 ^ 2 - 4 * 2 + 12 = 8 + 4 * m - 8 + 12 ∧
    8 + 4 * m - 8 + 12 = 4 * m + 12 := ⟨by ring, by ring⟩

/-- Naloga 1, korak 3: Horner z `a = 2` na `1, −3, −4, 12`: `1·2 − 3 = −1`, `−1·2 − 4 = −6`,
`−6·2 + 12 = 0`; količnik je `x² − x − 6`.
trditev: MAT-SS-3/polinomi#matura1-horner
besedilo: »Hornerjev algoritem z $a = 2$ na koeficientih $1, -3, -4, 12$: $1$; $1 \cdot 2 - 3 = -1$; $-1 \cdot 2 - 4 = -6$; $-6 \cdot 2 + 12 = 0$.« -/
theorem matura1_horner : (1:ℝ) * 2 - 3 = -1 ∧ (-1:ℝ) * 2 - 4 = -6 ∧ (-6:ℝ) * 2 + 12 = 0 ∧
    (X ^ 3 - 3 * X ^ 2 - 4 * X + 12 : ℝ[X]) /ₘ (X - C 2) = X ^ 2 - X - 6 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  exact (deljenje_z_linearnim _ _ 2 0 (by simp only [map_ofNat, map_zero]; ring)).1

/-- Naloga 2 a): `p(3) = 54 − 27 − 33 + 6 = 0`.
trditev: MAT-SS-3/polinomi#matura2a
besedilo: »$p(3) = 54 - 27 - 33 + 6 = 0$« -/
theorem matura2a : (2:ℝ) * 3 ^ 3 - 3 * 3 ^ 2 - 11 * 3 + 6 = 54 - 27 - 33 + 6 ∧ (54:ℝ) - 27 - 33 + 6 = 0 := by
  norm_num

/-- Naloga 2 b), korak 2: Horner z `a = 3` na `2, −3, −11, 6`: `2·3 − 3 = 3`, `3·3 − 11 = −2`, `−2·3 + 6 = 0`;
količnik `2x² + 3x − 2`.
trditev: MAT-SS-3/polinomi#matura2b-horner
besedilo: »b) Hornerjev algoritem z $a = 3$ na koeficientih $2, -3, -11, 6$: $2$; $2 \cdot 3 - 3 = 3$; $3 \cdot 3 - 11 = -2$; $-2 \cdot 3 + 6 = 0$. Količnik je $2x^2 + 3x - 2$.« -/
theorem matura2b_horner : (2:ℝ) * 3 - 3 = 3 ∧ (3:ℝ) * 3 - 11 = -2 ∧ (-2:ℝ) * 3 + 6 = 0 ∧
    (2 * X ^ 3 - 3 * X ^ 2 - 11 * X + 6 : ℝ[X]) /ₘ (X - C 3) = 2 * X ^ 2 + 3 * X - 2 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  exact (deljenje_z_linearnim _ _ 3 0 (by simp only [map_ofNat, map_zero]; ring)).1

/-- Naloga 2 b), korak 3: `x = (−3 ± √(9 + 16))/4 = (−3 ± 5)/4`, torej `1/2` ali `−2`, in
`2x² + 3x − 2 = (2x − 1)(x + 2)`; to sta edini ničli.
trditev: MAT-SS-3/polinomi#matura2b-kvadratna
besedilo: »b) Ničle količnika: $x = \dfrac{-3 \pm \sqrt{9 + 16}}{4} = \dfrac{-3 \pm 5}{4}$, torej $x = \dfrac{1}{2}$ ali $x = -2$. Zato je $2x^2 + 3x - 2 = (2x - 1)(x + 2)$.« -/
theorem matura2b_kvadratna :
    Real.sqrt (9 + 16) = 5 ∧ ((-3:ℝ) + 5) / 4 = 1 / 2 ∧ ((-3:ℝ) - 5) / 4 = -2 ∧
    (∀ x : ℝ, 2 * x ^ 2 + 3 * x - 2 = (2 * x - 1) * (x + 2)) ∧
    ∀ x : ℝ, 2 * x ^ 2 + 3 * x - 2 = 0 ↔ x = 1 / 2 ∨ x = -2 := by
  refine ⟨?_, by norm_num, by norm_num, fun x => by ring, fun x => ?_⟩
  · rw [show (9:ℝ) + 16 = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · constructor
    · intro h
      have h' : (2 * x - 1) * (x + 2) = 0 := by rw [← h]; ring
      rcases mul_eq_zero.mp h' with h1 | h1
      · left; linarith
      · right; linarith
    · rintro (rfl | rfl) <;> norm_num

/-- Naloga 2 b), korak 4 (in `<<RACUN`): `p(x) = (x − 3)(2x − 1)(x + 2)`, ničle so natanko 3, 1/2 in −2.
trditev: MAT-SS-3/polinomi#matura2b
besedilo: »b) $p(x) = (x - 3)(2x - 1)(x + 2)$; ničle so $3$, $\dfrac{1}{2}$ in $-2$.« -/
theorem matura2b (x : ℝ) : 2 * x ^ 3 - 3 * x ^ 2 - 11 * x + 6 = (x - 3) * (2 * x - 1) * (x + 2) ∧
    (2 * x ^ 3 - 3 * x ^ 2 - 11 * x + 6 = 0 ↔ x = 3 ∨ x = 1 / 2 ∨ x = -2) := by
  have hf : 2 * x ^ 3 - 3 * x ^ 2 - 11 * x + 6 = (x - 3) * (2 * x - 1) * (x + 2) := by ring
  refine ⟨hf, ?_⟩
  constructor
  · intro h
    rw [hf] at h
    rcases mul_eq_zero.mp h with h1 | h1
    · rcases mul_eq_zero.mp h1 with h2 | h2
      · left; linarith
      · right; left; linarith
    · right; right; linarith
  · rintro (rfl | rfl | rfl) <;> norm_num

/-- Naloga 2 c), koraki 5–6: deljenje z `x² − 1`; ostane `−3x² − 9x + 6`, nato `−9x + 3`.
trditev: MAT-SS-3/polinomi#matura2c-koraki
besedilo: »c) Preizkus pri $x = 1$, kjer je $x^2 - 1 = 0$: $p(1) = 2 - 3 - 11 + 6 = -6$ in ostanek $-9 + 3 = -6$.« -/
theorem matura2c_koraki (x : ℝ) :
    2 * x ^ 3 - 3 * x ^ 2 - 11 * x + 6 = (x ^ 2 - 1) * (2 * x - 3) + (-9 * x + 3) := by
  calc 2 * x ^ 3 - 3 * x ^ 2 - 11 * x + 6 = 2 * x * (x ^ 2 - 1) + (-3 * x ^ 2 - 9 * x + 6) := by ring
    _ = 2 * x * (x ^ 2 - 1) + (-3) * (x ^ 2 - 1) + (-9 * x + 3) := by ring
    _ = (x ^ 2 - 1) * (2 * x - 3) + (-9 * x + 3) := by ring

/-- Naloga 2 c), korak 7: preizkus pri `x = 1`: `p(1) = 2 − 3 − 11 + 6 = −6` in ostanek `−9 + 3 = −6`.
trditev: MAT-SS-3/polinomi#matura2c-preizkus
besedilo: »c) Preizkus pri $x = 1$, kjer je $x^2 - 1 = 0$: $p(1) = 2 - 3 - 11 + 6 = -6$ in ostanek $-9 + 3 = -6$. Ujema se.« -/
theorem matura2c_preizkus : (2:ℝ) * 1 ^ 3 - 3 * 1 ^ 2 - 11 * 1 + 6 = 2 - 3 - 11 + 6 ∧
    (2:ℝ) - 3 - 11 + 6 = -6 ∧ (-9:ℝ) + 3 = -6 := by norm_num

/-- Naloga 2 c), odgovor: količnik `2x − 3`, ostanek `−9x + 3` (enolično).
trditev: MAT-SS-3/polinomi#matura2c
besedilo: »Odgovor: $p(x) = (x - 3)(2x - 1)(x + 2)$ z ničlami $3$, $\frac{1}{2}$ in $-2$; pri deljenju z $x^2 - 1$ je količnik $2x - 3$, ostanek $-9x + 3$.« -/
theorem matura2c :
    (2 * X ^ 3 - 3 * X ^ 2 - 11 * X + 6 : ℝ[X]) /ₘ (X ^ 2 + C (-1)) = 2 * X - 3 ∧
    (2 * X ^ 3 - 3 * X ^ 2 - 11 * X + 6 : ℝ[X]) %ₘ (X ^ 2 + C (-1)) = C (-9) * X + C 3 := by
  apply div_modByMonic_unique _ _ (monic_X_pow_add_C (-1) (by norm_num))
  refine ⟨by simp only [map_ofNat, map_neg, map_one]; ring, ?_⟩
  rw [degree_X_pow_add_C (by norm_num)]
  exact degree_linear_le.trans_lt (by norm_num)

/-- Naloga 3 a), koraka 1 in 2: `V(x) = x(16 − 2x)(10 − 2x)`, `(16 − 2x)(10 − 2x) = 160 − 52x + 4x²`, torej
`V(x) = 4x³ − 52x² + 160x`.
trditev: MAT-SS-3/polinomi#matura3a
besedilo: »a) $(16 - 2x)(10 - 2x) = 160 - 52x + 4x^2$, torej $V(x) = 4x^3 - 52x^2 + 160x$.« -/
theorem matura3a (x : ℝ) : (16 - 2 * x) * (10 - 2 * x) = 160 - 52 * x + 4 * x ^ 2 ∧
    x * (16 - 2 * x) * (10 - 2 * x) = 4 * x ^ 3 - 52 * x ^ 2 + 160 * x := ⟨by ring, by ring⟩

/-- Naloga 3 a), korak 3: vse tri mere so pozitivne natanko za `0 < x < 5`.
trditev: MAT-SS-3/polinomi#matura3a-smisel
besedilo: »a) Vse tri mere morajo biti pozitivne: $x > 0$ in $10 - 2x > 0$ (takrat je tudi $16 - 2x > 0$). Naloga ima smisel za $0 < x < 5$.« -/
theorem matura3a_smisel (x : ℝ) : (0 < x ∧ 0 < 16 - 2 * x ∧ 0 < 10 - 2 * x) ↔ (0 < x ∧ x < 5) := by
  constructor
  · rintro ⟨h1, -, h3⟩; exact ⟨h1, by linarith⟩
  · rintro ⟨h1, h2⟩; exact ⟨h1, by linarith, by linarith⟩

/-- Naloga 3 b), koraki 4–6: `4x³ − 52x² + 160x = 144` je enakovredno `x³ − 13x² + 40x − 36 = 0`;
`x = 1` da −8, `x = 2` da 0; Horner z `a = 2`: 1, −11, 18, 0; `x² − 11x + 18 = (x − 2)(x − 9)`.
trditev: MAT-SS-3/polinomi#matura3b-koraki
besedilo: »b) Horner z $a = 2$ na $1, -13, 40, -36$: $1$; $-11$; $18$; $0$. Količnik $x^2 - 11x + 18 = (x - 2)(x - 9)$.« -/
theorem matura3b_koraki :
    (∀ x : ℝ, 4 * x ^ 3 - 52 * x ^ 2 + 160 * x = 144 ↔ x ^ 3 - 13 * x ^ 2 + 40 * x - 36 = 0) ∧
    (1:ℝ) - 13 + 40 - 36 = -8 ∧ (8:ℝ) - 52 + 80 - 36 = 0 ∧
    (1:ℝ) * 2 - 13 = -11 ∧ (-11:ℝ) * 2 + 40 = 18 ∧ (18:ℝ) * 2 - 36 = 0 ∧
    (∀ x : ℝ, x ^ 3 - 13 * x ^ 2 + 40 * x - 36 = (x - 2) * (x ^ 2 - 11 * x + 18)) ∧
    (∀ x : ℝ, x ^ 2 - 11 * x + 18 = (x - 2) * (x - 9)) := by
  refine ⟨fun x => ?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    fun x => by ring, fun x => by ring⟩
  constructor <;> intro h <;> linarith

/-- Naloga 3 b), korak 7 (in `<<RACUN`): `x³ − 13x² + 40x − 36 = (x − 2)²(x − 9)`; `V(x) = 144` natanko pri
`x = 2` ali `x = 9`.
trditev: MAT-SS-3/polinomi#matura3b-nicle
besedilo: »c) Iz korakov 4–7: $V(x) - 144 = 4(x^3 - 13x^2 + 40x - 36) = 4(x - 2)^2(x - 9)$.« -/
theorem matura3b_nicle (x : ℝ) : x ^ 3 - 13 * x ^ 2 + 40 * x - 36 = (x - 2) ^ 2 * (x - 9) ∧
    (4 * x ^ 3 - 52 * x ^ 2 + 160 * x = 144 ↔ x = 2 ∨ x = 9) := by
  refine ⟨by ring, ?_⟩
  constructor
  · intro h
    have h' : (x - 2) ^ 2 * (x - 9) = 0 := by linear_combination h / 4
    rcases mul_eq_zero.mp h' with h1 | h1
    · left; have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h1; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Naloga 3 b), odgovor: za `0 < x < 5` ima škatla prostornino 144 cm³ natanko pri `x = 2`.
trditev: MAT-SS-3/polinomi#matura3b
besedilo: »Odgovor: $V(x) = 4x^3 - 52x^2 + 160x$ za $0 < x < 5$; prostornina je $144\,\mathrm{cm^3}$ le pri $x = 2\,\mathrm{cm}$, in to je največja možna prostornina.« -/
theorem matura3b (x : ℝ) (_h0 : 0 < x) (h5 : x < 5) :
    x * (16 - 2 * x) * (10 - 2 * x) = 144 ↔ x = 2 := by
  rw [(matura3a x).2, (matura3b_nicle x).2]
  constructor
  · rintro (h | h)
    · exact h
    · linarith
  · intro h; exact Or.inl h

/-- Predpostavke trditve `matura3b` se dajo izpolniti (`x = 2`). -/
example : (0:ℝ) < 2 ∧ (2:ℝ) < 5 := by norm_num

/-- Predpostavke trditve `matura3b` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 2 ∧ (2:ℝ) < 5 := by norm_num
  matura3b (_h0 := w.1) (h5 := w.2)

/-- Naloga 3 c): `V(x) − 144 = 4(x − 2)²(x − 9)`; za `0 < x < 5` je `V(x) ≤ 144`, enakost le pri `x = 2`, torej
je 144 cm³ največja prostornina.
trditev: MAT-SS-3/polinomi#matura3c
besedilo: »Odgovor: $V(x) = 4x^3 - 52x^2 + 160x$ za $0 < x < 5$; prostornina je $144\,\mathrm{cm^3}$ le pri $x = 2\,\mathrm{cm}$, in to je največja možna prostornina.« -/
theorem matura3c :
    (∀ x : ℝ, 4 * x ^ 3 - 52 * x ^ 2 + 160 * x - 144 = 4 * (x - 2) ^ 2 * (x - 9)) ∧
    IsGreatest ((fun x : ℝ => x * (16 - 2 * x) * (10 - 2 * x)) '' Set.Ioo 0 5) 144 := by
  refine ⟨fun x => by ring, ⟨⟨2, ⟨by norm_num, by norm_num⟩, by norm_num⟩, ?_⟩⟩
  rintro _ ⟨x, ⟨h0, h5⟩, rfl⟩
  have : x * (16 - 2 * x) * (10 - 2 * x) - 144 = 4 * (x - 2) ^ 2 * (x - 9) := by ring
  have hn : 4 * (x - 2) ^ 2 * (x - 9) ≤ 0 :=
    mul_nonpos_of_nonneg_of_nonpos (by positivity) (by linarith)
  simp only
  linarith

/-! ## Ustna vprašanja, Na sliki -/

/-- Ustno vprašanje 3: polinom stopnje `n` ima največ `n` različnih ničel (vsaka množica ničel ima največ
`n` elementov).
trditev: MAT-SS-3/polinomi#ustno3-razlicne
besedilo: »Ker stopnja pri vsakem odcepu pade za $1$ in polinom stopnje $0$ nima ničel, ima polinom stopnje $n$ največ $n$ različnih ničel.« -/
theorem ustno3_razlicne (p : ℝ[X]) (hp : p ≠ 0) (Z : Finset ℝ) (hZ : ∀ z ∈ Z, p.eval z = 0) :
    Z.card ≤ p.natDegree := by
  apply card_le_degree_of_subset_roots
  intro z hz
  rw [mem_roots hp]
  exact hZ z hz

/-- Predpostavke trditve `ustno3_razlicne` se dajo izpolniti (`x`, `Z = {0}`). -/
example : (X : ℝ[X]) ≠ 0 ∧ ∀ z ∈ ({0} : Finset ℝ), (X : ℝ[X]).eval z = 0 :=
  ⟨X_ne_zero, by simp⟩

/-- Predpostavke trditve `ustno3_razlicne` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (X : ℝ[X]) ≠ 0 ∧ ∀ z ∈ ({0} : Finset ℝ), (X : ℝ[X]).eval z = 0 :=
    ⟨X_ne_zero, by simp⟩
  ustno3_razlicne (hp := w.1) (hZ := w.2)

/-- Ustno vprašanje 3: če je `p(x) = (x − a)k(x)` in je `b ≠ a` ničla, je `b` ničla količnika.
trditev: MAT-SS-3/polinomi#ustno3-kolicnik
besedilo: »Vsaka druga ničla $b \ne a$ je ničla količnika, saj iz $(b - a)\,k(b) = 0$ in $b - a \ne 0$ sledi $k(b) = 0$.« -/
theorem ustno3_kolicnik (a b kb : ℝ) (hab : b ≠ a) (h : (b - a) * kb = 0) : kb = 0 := by
  rcases mul_eq_zero.mp h with h1 | h1
  · exact absurd (sub_eq_zero.mp h1) hab
  · exact h1

/-- Predpostavke trditve `ustno3_kolicnik` se dajo izpolniti (`a = 0`, `b = 1`, `k(b) = 0`). -/
example : (1:ℝ) ≠ 0 ∧ ((1:ℝ) - 0) * 0 = 0 := by norm_num

/-- Predpostavke trditve `ustno3_kolicnik` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 ∧ ((1:ℝ) - 0) * 0 = 0 := by norm_num
  ustno3_kolicnik (hab := w.1) (h := w.2)

/-- Na sliki: predznaki `f(t) = (t − 1)(t − 2)(t − 3)` po intervalih so −, +, −, +.
trditev: MAT-SS-3/polinomi#na-sliki
besedilo: »$f(t) = (t - 1)(t - 2)(t - 3)$« -/
theorem na_sliki (t : ℝ) :
    (t < 1 → (t - 1) * (t - 2) * (t - 3) < 0) ∧ (1 < t → t < 2 → 0 < (t - 1) * (t - 2) * (t - 3)) ∧
    (2 < t → t < 3 → (t - 1) * (t - 2) * (t - 3) < 0) ∧ (3 < t → 0 < (t - 1) * (t - 2) * (t - 3)) := by
  refine ⟨fun h => ?_, fun h1 h2 => ?_, fun h1 h2 => ?_, fun h => ?_⟩
  · exact mul_neg_of_pos_of_neg (mul_pos_of_neg_of_neg (by linarith) (by linarith)) (by linarith)
  · exact mul_pos_of_neg_of_neg (mul_neg_of_pos_of_neg (by linarith) (by linarith)) (by linarith)
  · exact mul_neg_of_pos_of_neg (mul_pos (by linarith) (by linarith)) (by linarith)
  · exact mul_pos (mul_pos (by linarith) (by linarith)) (by linarith)

/-! ## Preveri se -/

/-- Preveri se 1: `p(x) = 3x⁴ − x + 7` ima stopnjo 4 (ne 3), vodilni koeficient 3 (ne 7) in prosti člen 7.
trditev: MAT-SS-3/polinomi#kviz1
besedilo: »$p(x) = 3x^4 - x + 7$« -/
theorem kviz1 : (3 * X ^ 4 - X + 7 : ℝ[X]).natDegree = 4 ∧ (3 * X ^ 4 - X + 7 : ℝ[X]).leadingCoeff = 3 ∧
    (3 * X ^ 4 - X + 7 : ℝ[X]).coeff 0 = 7 := by
  have hd : (3 * X ^ 4 - X + 7 : ℝ[X]).natDegree = 4 := by compute_degree!
  refine ⟨hd, ?_, ?_⟩
  · rw [leadingCoeff, hd]; simp [coeff_X]
  · simp [coeff_X]

/-- Preveri se 2: ostanek pri deljenju `x³ − 2x + 4` z `x − 3` je `p(3) = 27 − 6 + 4 = 25`; `−17 = p(−3)`;
7 dobimo, če v Hornerju izpustimo 0 (1, `1·3 − 2 = 1`, `1·3 + 4 = 7`).
trditev: MAT-SS-3/polinomi#kviz2
besedilo: »Izrek o ostanku: $p(3) = 27 - 6 + 4 = 25$.« -/
theorem kviz2 : (X ^ 3 - 2 * X + 4 : ℝ[X]) %ₘ (X - C 3) = C 25 ∧
    (3:ℝ) ^ 3 - 2 * 3 + 4 = 27 - 6 + 4 ∧ (-3:ℝ) ^ 3 - 2 * (-3) + 4 = -17 ∧
    (1:ℝ) * 3 - 2 = 1 ∧ (1:ℝ) * 3 + 4 = 7 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  rw [modByMonic_X_sub_C_eq_C_eval]; norm_num

/-- Preveri se 3: Ana z napačnimi koeficienti 2, −5, 3 dobi 2, −1, 1; pravilni 2, 0, −5, 3 dajo 2, 4, 3, 9, in
`p(2) = 16 − 10 + 3 = 9`.
trditev: MAT-SS-3/polinomi#kviz3
besedilo: »S koeficienti $2, 0, -5, 3$: $2$; $4$; $3$; $9$.« -/
theorem kviz3 : ((2:ℝ) * 2 - 5 = -1 ∧ (-1:ℝ) * 2 + 3 = 1) ∧
    ((2:ℝ) * 2 + 0 = 4 ∧ (4:ℝ) * 2 - 5 = 3 ∧ (3:ℝ) * 2 + 3 = 9) ∧
    (2:ℝ) * 2 ^ 3 - 5 * 2 + 3 = 16 - 10 + 3 ∧ (16:ℝ) - 10 + 3 = 9 ∧
    (2 * X ^ 3 - 5 * X + 3 : ℝ[X]) %ₘ (X - C 2) = C 9 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  rw [modByMonic_X_sub_C_eq_C_eval]; norm_num

/-- Preveri se 4: za `p(x) = x³ − x` je ostanek pri deljenju z `x − 2` enak `p(2) = 6`, z `x + 2` pa
`p(−2) = −6`.
trditev: MAT-SS-3/polinomi#kviz4
besedilo: »Primerjaj ostanka pri deljenju $p(x) = x^3 - x$ z $x - 2$ in z $x + 2$.« -/
theorem kviz4 : (X ^ 3 - X : ℝ[X]) %ₘ (X - C 2) = C 6 ∧ (X ^ 3 - X : ℝ[X]) %ₘ (X - C (-2)) = C (-6) := by
  constructor <;> (rw [modByMonic_X_sub_C_eq_C_eval]; norm_num)

/-- Preveri se 5: `h(t) = t³ − 2t² − 9t + 18 = (t − 2)(t − 3)(t + 3)`; za `t ≥ 0` je sonda na tirnici natanko
pri `t = 2` in `t = 3`; `h(18) ≠ 0`.
trditev: MAT-SS-3/polinomi#kviz5
besedilo: »Odmik sonde od tirnice opisuje $h(t) = t^3 - 2t^2 - 9t + 18$ ($t$ v minutah, $t \ge 0$).« -/
theorem kviz5 :
    (∀ t : ℝ, t ^ 3 - 2 * t ^ 2 - 9 * t + 18 = (t - 2) * (t - 3) * (t + 3)) ∧
    (∀ t : ℝ, 0 ≤ t → (t ^ 3 - 2 * t ^ 2 - 9 * t + 18 = 0 ↔ t = 2 ∨ t = 3)) ∧
    (18:ℝ) ^ 3 - 2 * 18 ^ 2 - 9 * 18 + 18 ≠ 0 := by
  refine ⟨fun t => by ring, fun t ht => ?_, by norm_num⟩
  constructor
  · intro h
    have h' : (t - 2) * (t - 3) * (t + 3) = 0 := by rw [← h]; ring
    rcases mul_eq_zero.mp h' with h1 | h1
    · rcases mul_eq_zero.mp h1 with h2 | h2
      · left; linarith
      · right; linarith
    · linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Preveri se 6 (in `<<RACUN`): `(2x − 1)² − 4x² = 4x² − 4x + 1 − 4x² = −4x + 1`, polinom stopnje 1.
trditev: MAT-SS-3/polinomi#kviz6
besedilo: »$p(x) = 4x^2 - 4x + 1 - 4x^2 = -4x + 1$. To je linearna funkcija, torej polinomska funkcija stopnje $1$.« -/
theorem kviz6 : (∀ x : ℝ, (2 * x - 1) ^ 2 - 4 * x ^ 2 = 4 * x ^ 2 - 4 * x + 1 - 4 * x ^ 2 ∧
      4 * x ^ 2 - 4 * x + 1 - 4 * x ^ 2 = -4 * x + 1) ∧
    ((2 * X - 1) ^ 2 - 4 * X ^ 2 : ℝ[X]).natDegree = 1 := by
  refine ⟨fun x => ⟨by ring, by ring⟩, ?_⟩
  rw [show ((2 * X - 1) ^ 2 - 4 * X ^ 2 : ℝ[X]) = -4 * X + 1 by ring]
  compute_degree!

/-- Preveri se 7: polinom četrte stopnje z realnimi koeficienti in ničlama `1 + 2i`, `−3i` nima realnih ničel
(ničle so še `1 − 2i` in `3i`, skupaj štiri).
trditev: MAT-SS-3/polinomi#kviz7
besedilo: »Polinom četrte stopnje z realnimi koeficienti ima ničli $1 + 2i$ in $-3i$.« -/
theorem kviz7 (p : ℝ[X]) (hd : p.natDegree = 4) (h1 : aeval (1 + 2 * Complex.I) p = 0)
    (h2 : aeval (-3 * Complex.I) p = 0) : ∀ x : ℝ, p.eval x ≠ 0 := by
  intro x hx
  set P := p.map (algebraMap ℝ ℂ) with hPdef
  have hp0 : p ≠ 0 := by rintro rfl; simp at hd
  have hP0 : P ≠ 0 := (Polynomial.map_ne_zero_iff (algebraMap ℝ ℂ).injective).mpr hp0
  have hPd : P.natDegree = 4 := by rw [hPdef, natDegree_map]; exact hd
  have hroot : ∀ z : ℂ, aeval z p = 0 → z ∈ P.roots := fun z hz => by
    rw [mem_roots hP0, IsRoot.def, hPdef, eval_map, ← aeval_def]; exact hz
  have h1c := konjugirana_nicla p _ h1
  have h2c := konjugirana_nicla p _ h2
  have e1 : starRingEnd ℂ (1 + 2 * Complex.I) = 1 - 2 * Complex.I := by
    rw [map_add, map_mul, map_one, Complex.conj_I, map_ofNat]; ring
  have e2 : starRingEnd ℂ (-3 * Complex.I) = 3 * Complex.I := by
    rw [map_mul, map_neg, Complex.conj_I, map_ofNat]; ring
  rw [e1] at h1c; rw [e2] at h2c
  have hx' : aeval (x : ℂ) p = 0 := by
    rw [show (x : ℂ) = algebraMap ℝ ℂ x from rfl, aeval_algebraMap_apply_eq_algebraMap_eval, hx, map_zero]
  have hcard : ({1 + 2 * Complex.I, 1 - 2 * Complex.I, -3 * Complex.I, 3 * Complex.I, (x : ℂ)} :
      Finset ℂ).card = 5 := by
    rw [Finset.card_insert_of_notMem, Finset.card_insert_of_notMem, Finset.card_insert_of_notMem,
      Finset.card_insert_of_notMem, Finset.card_singleton] <;> simp [Complex.ext_iff] <;> norm_num
  have hsub : ({1 + 2 * Complex.I, 1 - 2 * Complex.I, -3 * Complex.I, 3 * Complex.I, (x : ℂ)} :
      Finset ℂ).val ⊆ P.roots := by
    intro z hz
    simp only [Finset.insert_val, Multiset.mem_ndinsert, Finset.singleton_val,
      Multiset.mem_singleton] at hz
    rcases hz with rfl | rfl | rfl | rfl | rfl
    · exact hroot _ h1
    · exact hroot _ h1c
    · exact hroot _ h2
    · exact hroot _ h2c
    · exact hroot _ hx'
  have := card_le_degree_of_subset_roots hsub
  rw [hcard, hPd] at this
  norm_num at this

/-- Predpostavke trditve `kviz7` se dajo izpolniti:
`(x² − 2x + 5)(x² + 9)` ima stopnjo 4 in ničli `1 + 2i` ter `−3i`. -/
example : ((X ^ 2 - C 2 * X + C 5) * (X ^ 2 + C 9) : ℝ[X]).natDegree = 4 ∧
    aeval (1 + 2 * Complex.I) ((X ^ 2 - C 2 * X + C 5) * (X ^ 2 + C 9) : ℝ[X]) = 0 ∧
    aeval (-3 * Complex.I) ((X ^ 2 - C 2 * X + C 5) * (X ^ 2 + C 9) : ℝ[X]) = 0 := by
  refine ⟨by compute_degree!, ?_, ?_⟩
  · simp
    left
    linear_combination (4 : ℂ) * Complex.I_sq
  · simp
    right
    linear_combination (9 : ℂ) * Complex.I_sq

/-! ## `<<RACUN` (vrstice, ki niso že zgoraj) -/

/-- Predpostavke trditve `kviz7` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ((X ^ 2 - C 2 * X + C 5) * (X ^ 2 + C 9) : ℝ[X]).natDegree = 4 ∧ aeval (1 + 2 * Complex.I) ((X ^ 2 - C 2 * X + C 5) * (X ^ 2 + C 9) : ℝ[X]) = 0 ∧ aeval (-3 * Complex.I) ((X ^ 2 - C 2 * X + C 5) * (X ^ 2 + C 9) : ℝ[X]) = 0 := by
    refine ⟨by compute_degree!, ?_, ?_⟩
    · simp
      left
      linear_combination (4 : ℂ) * Complex.I_sq
    · simp
      right
      linear_combination (9 : ℂ) * Complex.I_sq
  kviz7 (hd := w.1) (h1 := w.2.1) (h2 := w.2.2)

/-- `<<RACUN`: `resi: 4m + 12 = 0 → m = −3`; `vrednost: 2³ − 3·2² − 4·2 + 12 = 0`;
`vrednost: 2·3³ − 3·3² − 11·3 + 6 = 0`; `vrednost: 2³ − 4·2² + 6·2 − 4 = 0`.
trditev: MAT-SS-3/polinomi#racun-vrednosti
besedilo: »b) Hornerjev algoritem z $a = 3$ na koeficientih $2, -3, -11, 6$: $2$; $2 \cdot 3 - 3 = 3$; $3 \cdot 3 - 11 = -2$; $-2 \cdot 3 + 6 = 0$.« -/
theorem racun_vrednosti : (∀ m : ℝ, 4 * m + 12 = 0 ↔ m = -3) ∧ (2:ℝ) ^ 3 - 3 * 2 ^ 2 - 4 * 2 + 12 = 0 ∧
    (2:ℝ) * 3 ^ 3 - 3 * 3 ^ 2 - 11 * 3 + 6 = 0 ∧ (2:ℝ) ^ 3 - 4 * 2 ^ 2 + 6 * 2 - 4 = 0 := by
  refine ⟨fun m => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num,
    by norm_num⟩

/-- `<<RACUN`: `enako: (x³ − 3x² − 4x + 12)/(x − 2) = x² − x − 6` (za `x ≠ 2`, kot racionalni izraz).
trditev: MAT-SS-3/polinomi#racun-kolicnik-1
besedilo: »$p(x) = (x - 2)(x^2 - 2x + 2) = x^3 - 4x^2 + 6x - 4$« -/
theorem racun_kolicnik_1 (x : ℝ) (h2 : x ≠ 2) :
    (x ^ 3 - 3 * x ^ 2 - 4 * x + 12) / (x - 2) = x ^ 2 - x - 6 := by
  rw [div_eq_iff (sub_ne_zero.mpr h2)]; ring

/-- `<<RACUN`: `enako: (2x³ − 3x² − 11x + 6)/(x − 3) = 2x² + 3x − 2` (za `x ≠ 3`, kot racionalni izraz).
trditev: MAT-SS-3/polinomi#racun-kolicnik-2
besedilo: »$p(x) = (x - 2)(x^2 - 2x + 2) = x^3 - 4x^2 + 6x - 4$.« -/
theorem racun_kolicnik_2 (x : ℝ) (h3 : x ≠ 3) :
    (2 * x ^ 3 - 3 * x ^ 2 - 11 * x + 6) / (x - 3) = 2 * x ^ 2 + 3 * x - 2 := by
  rw [div_eq_iff (sub_ne_zero.mpr h3)]; ring

/-- `<<RACUN`: `enako: (x³ − 13x² + 40x − 36)/(x − 2) = x² − 11x + 18` (za `x ≠ 2`, kot racionalni izraz).
trditev: MAT-SS-3/polinomi#racun-kolicnik-3
besedilo: »$x^3 - 13x^2 + 40x - 36 = (x - 2)^2(x - 9)$« -/
theorem racun_kolicnik_3 (x : ℝ) (h2 : x ≠ 2) :
    (x ^ 3 - 13 * x ^ 2 + 40 * x - 36) / (x - 2) = x ^ 2 - 11 * x + 18 := by
  rw [div_eq_iff (sub_ne_zero.mpr h2)]; ring

/-- Predpostavke trditev `racun_kolicnik_1`, `_2`, `_3` se dajo izpolniti (`x = 0`).
Trditve: `racun_kolicnik_1`, `racun_kolicnik_2` in `racun_kolicnik_3`. -/
example : (0:ℝ) ≠ 2 ∧ (0:ℝ) ≠ 3 := by norm_num

/-- Predpostavke trditve `racun_kolicnik_3` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≠ 2 ∧ (0:ℝ) ≠ 3 := by norm_num
  racun_kolicnik_3 (h2 := w.1)

/-- Predpostavke trditve `racun_kolicnik_2` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≠ 2 ∧ (0:ℝ) ≠ 3 := by norm_num
  racun_kolicnik_2 (h3 := w.2)

/-- Predpostavke trditve `racun_kolicnik_1` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≠ 2 ∧ (0:ℝ) ≠ 3 := by norm_num
  racun_kolicnik_1 (h2 := w.1)

/-- `<<RACUN`: `enako: 2x³ − 3x² − 11x + 6 = (x² − 1)(2x − 3) − 9x + 3`.
trditev: MAT-SS-3/polinomi#racun-deljenje-kvadratni
besedilo: »c) $2x^3 : x^2 = 2x$; $2x(x^2 - 1) = 2x^3 - 2x$; ostane $-3x^2 - 9x + 6$.« -/
theorem racun_deljenje_kvadratni (x : ℝ) :
    2 * x ^ 3 - 3 * x ^ 2 - 11 * x + 6 = (x ^ 2 - 1) * (2 * x - 3) - 9 * x + 3 := by ring

/-! ## Primeri izpolnljivosti (izrek, uporabljen na konkretnih vrednostih) -/

/-- Predpostavke trditve `racionalne_nicle_monic` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (X - C 2 : ℤ[X]).leadingCoeff = 1 ∧ IsCoprime (2 : ℤ) 1 ∧ aeval (((2 : ℤ) : ℚ) / ((1 : ℤ) : ℚ)) (X - C 2 : ℤ[X]) = 0 :=
    ⟨leadingCoeff_X_sub_C 2, isCoprime_one_right, by rw [map_sub, aeval_X, aeval_C]; norm_num⟩
  racionalne_nicle_monic (hp := w.1) (hms := w.2.1) (hs := one_ne_zero) (h := w.2.2)

/-- Predpostavke trditve `x3_minus_1` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  x3_minus_1.2.2.2 1 (Or.inl rfl)

end Evklid.Lekcije.MAT_SS_3.Polinomi
