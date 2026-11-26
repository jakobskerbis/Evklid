/-
vir: content/lessons/MAT-SS-3/povrsina-in-prostornina-teles.md
sha256: 712b7519c0a3434ad9b22e77938c473e5a22f3c476db51c3b76a80a2697d2724
Model: formule za površino (P = 2S + S_p, P = S + S_p, plašč valja 2πrv, plašč stožca πrs, krogla 4πr²) so
vsote ploščin mejnih ploskev in so vzete kot definicije (Mathlib nima površine ploskev v ℝ³ v tej obliki);
dokazane so njihove algebrske oblike (2πr² + 2πrv = 2πr(r + v), πr² + πrs = πr(r + s), S_p = o·v kot vsota
ploščin pravokotnikov, plašč stožca kot ploščina izseka ½·2πr·s). Prostornina krogle je dokazana z Mathlibovo
Lebesgueovo mero (`EuclideanSpace.volume_closedBall_fin_three`); »tretjina« pri piramidi in stožcu ter
prostornina polkrogle (Bolj natančno) sta dokazani kot integral ploščin presekov ∫ S(h) dh (Cavalierijeva
ideja »plasti«); V = S·v pri prizmi in valju je definicija (enake plasti); stranica stožca s je po definiciji
s = √(r² + v²) (s² = r² + v², razlaga 5). Kot ob osnovni ploskvi je kot v
pravokotnem trikotniku, zapisan z arctan; zaokrožene vrednosti so dokazane kot |x − vrednost| < pol enote
zadnjega mesta, π med 3,141592 in 3,141593.
Ni v Leanu: simulacija, risbe in mreže (»Na sliki«), besedni deli (»Zakaj se tega učimo«, premisli o
plašču, Iz vsakdanjega življenja razen števil, kviza 1 in 2 o mreži in razlogu za tretjino, »Bolj natančno«
o razrezu kocke na tri skladne piramide – dokazan je le račun a³/3 = a²·a/3), Cavalierijevo načelo kot
splošen izrek o merah (zahtevno, še ni dokazano; dokazana je enakost integralov presekov v primerih lekcije),
podobnost trikotnikov v nalogi 3 b) kot geometrijska trditev (dokazana je enačba in dotik krožnice s
stranico kot razdalja središča od premice), pri nalogi 3 d) to, da ima poševni stožec na višini h prav tako
prerez s polmerom 6(8 − h)/8 (zahtevno, še ni dokazano; dokazan je integral presekov pokončnega stožca),
pri ustnem vprašanju 2 povečanje površine podobnega telesa k²-krat v splošnem (zahtevno, še ni dokazano;
prostornina k³-krat je dokazana z mero, za kroglo tudi površina), točkovanje. V nalogi 2 c) je plašč stožca π·2·s ≈ 15,341 z
nezaokroženim s = 2/cos 35° (dokazano tako).
Lean: x/0 = 0 in √ negativnega je 0; trditve imajo zato pozitivne podatke.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.PovrsinaInProstorninaTeles

open Real

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

/-- Meje za tan 35° in cos 35°.
pomozno -/
theorem meje_35 : (0.7002072 : ℝ) < tan (35 * π / 180) ∧ tan (35 * π / 180) < 0.7002077 ∧
    (0.81915197 : ℝ) < cos (35 * π / 180) ∧ cos (35 * π / 180) < 0.81915216 := by
  obtain ⟨h1, h2, h3, h4⟩ := meje_stopinj 35 (by norm_num) (by norm_num)
  have s1 : (0.57357626 : ℝ) < sin (35 * π / 180) := lt_of_lt_of_le (by norm_num [sSp]) h1
  have s2 : sin (35 * π / 180) < 0.57357650 := lt_of_le_of_lt h2 (by norm_num [sZg])
  have c1 : (0.81915197 : ℝ) < cos (35 * π / 180) := lt_of_lt_of_le (by norm_num [cSp]) h3
  have c2 : cos (35 * π / 180) < 0.81915216 := lt_of_le_of_lt h4 (by norm_num [cZg])
  have hc : 0 < cos (35 * π / 180) := by linarith
  refine ⟨?_, ?_, c1, c2⟩
  · rw [tan_eq_sin_div_cos, lt_div_iff₀ hc]; nlinarith
  · rw [tan_eq_sin_div_cos, div_lt_iff₀ hc]; nlinarith

/-- Kot v pravokotnem trikotniku s katetama p (ob kotu) in v (nasproti) je α = arctan(v/p); velja
tan α = v/p, cos α = p/√(p² + v²) = p/s, sin α = v/s, 0 < α < 90°.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#kot-trikotnik
besedilo: »Pravokotni trikotnik s katetama $v = 4$ in $\frac{a}{2} = 3$ ima hipotenuzo $v_s$: $v_s = \sqrt{4^2 + 3^2} = \sqrt{25} = 5\,\text{cm}$.« -/
theorem kot_trikotnik (p v : ℝ) (hp : 0 < p) (hv : 0 < v) :
    tan (arctan (v / p)) = v / p ∧ cos (arctan (v / p)) = p / √(p ^ 2 + v ^ 2) ∧
    sin (arctan (v / p)) = v / √(p ^ 2 + v ^ 2) ∧ 0 < arctan (v / p) ∧ arctan (v / p) < π / 2 := by
  have hs : √(1 + (v / p) ^ 2) = √(p ^ 2 + v ^ 2) / p := by
    rw [show 1 + (v / p) ^ 2 = (p ^ 2 + v ^ 2) / p ^ 2 by field_simp, Real.sqrt_div' _ (by positivity),
      Real.sqrt_sq hp.le]
  have hq : 0 < √(p ^ 2 + v ^ 2) := Real.sqrt_pos.2 (by positivity)
  refine ⟨tan_arctan _, ?_, ?_, arctan_pos.2 (by positivity), arctan_lt_pi_div_two _⟩
  · rw [cos_arctan, hs]; field_simp
  · rw [sin_arctan, hs]; field_simp

/-- Predpostavke trditve `kot_trikotnik` se dajo izpolniti (p = 3, v = 4). -/
example : (0:ℝ) < 3 ∧ (0:ℝ) < 4 := by norm_num

/-! ## Razlaga 2–6: formule -/

/-- Predpostavke trditve `kot_trikotnik` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 3 ∧ (0:ℝ) < 4 := by norm_num
  kot_trikotnik (hp := w.1) (hv := w.2)

/-- Razlaga 2: plašč pokončne prizme so pravokotniki z osnovnicami eᵢ in višino v, zato
S_p = Σ eᵢ·v = o·v (o = Σ eᵢ obseg osnovne ploskve).
trditev: MAT-SS-3/povrsina-in-prostornina-teles#plasc-prizme
besedilo: »Plašč pokončne prizme je sestavljen iz pravokotnikov, visokih $v$. Njegova ploščina je $S_p = o \cdot v$, kjer je $o$ obseg osnovne ploskve.« -/
theorem plasc_prizme {n : ℕ} (e : Fin n → ℝ) (v : ℝ) : ∑ i, e i * v = (∑ i, e i) * v :=
  (Finset.sum_mul _ _ _).symm

/-- Razlaga 3: pri pravilni štiristrani piramidi je višina stranske ploskve hipotenuza trikotnika s
katetama v in a/2: v_s² = v² + (a/2)², torej v_s = √(v² + (a/2)²) (Pitagora v ℝ³: vrh (0,0,v),
sredina roba (a/2, 0, 0)).
trditev: MAT-SS-3/povrsina-in-prostornina-teles#visina-stranske
besedilo: »Povezuje jo z višino piramide Pitagorov izrek: pri pravilni štiristrani piramidi z osnovnim robom $a$ je $v_s^2 = v^2 + \left(\frac{a}{2}\right)^2$.« -/
theorem visina_stranske (a v : ℝ) :
    dist (!₂[0, 0, v] : EuclideanSpace ℝ (Fin 3)) !₂[a / 2, 0, 0] ^ 2 = v ^ 2 + (a / 2) ^ 2 := by
  rw [EuclideanSpace.dist_eq, Real.sq_sqrt (by positivity)]
  simp [Fin.sum_univ_three, Real.dist_eq, sq_abs]; ring

/-- Razlaga 4: površina valja P = 2πr² + 2πrv = 2πr(r + v).
trditev: MAT-SS-3/povrsina-in-prostornina-teles#povrsina-valja
besedilo: »$$P = 2\pi r^2 + 2\pi r v = 2\pi r(r + v) \qquad V = \pi r^2 v$$« -/
theorem povrsina_valja (r v : ℝ) : 2 * π * r ^ 2 + 2 * π * r * v = 2 * π * r * (r + v) := by ring

/-- Razlaga 5, Povzetek: površina stožca P = πr² + πrs = πr(r + s).
trditev: MAT-SS-3/povrsina-in-prostornina-teles#povrsina-stozca
besedilo: »$$P = \pi r^2 + \pi r s \qquad V = \frac{\pi r^2 v}{3}$$« -/
theorem povrsina_stozca (r s : ℝ) : π * r ^ 2 + π * r * s = π * r * (r + s) := by ring

/-- Ustno vprašanje 1, Na sliki: plašč stožca je izsek s polmerom s in lokom 2πr, ploščina izseka je
½·lok·polmer = ½·2πr·s = πrs; pri valju je plašč pravokotnik 2πr × v.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#plasc-izsek
besedilo: »Stožec:** en krog in krožni izsek s polmerom $s$. Lok izseka ima dolžino $2\pi r$ (obseg osnovnega kroga). Ploščina izseka je $\dfrac12 \cdot s \cdot 2\pi r = \pi r s$.« -/
theorem plasc_izsek (r s : ℝ) : 1 / 2 * (2 * π * r) * s = π * r * s := by ring

/-- Razlaga 6 (krogla): prostornina krogle s polmerom r ≥ 0 je 4πr³/3 (Lebesgueova mera v ℝ³).
trditev: MAT-SS-3/povrsina-in-prostornina-teles#prostornina-krogle
besedilo: »$$P = 4\pi r^2 \qquad V = \frac{4\pi r^3}{3}$$« -/
theorem prostornina_krogle (x : EuclideanSpace ℝ (Fin 3)) (r : ℝ) (hr : 0 ≤ r) :
    (MeasureTheory.volume (Metric.closedBall x r)).toReal = 4 * π * r ^ 3 / 3 := by
  rw [EuclideanSpace.volume_closedBall_fin_three, ENNReal.toReal_mul, ENNReal.toReal_pow,
    ENNReal.toReal_ofReal hr, ENNReal.toReal_ofReal (by positivity)]
  ring

/-- Predpostavke trditve `prostornina_krogle` se dajo izpolniti (r = 1). -/
example : (0:ℝ) ≤ 1 := zero_le_one

/-- Predpostavke trditve `prostornina_krogle` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 1 := zero_le_one
  prostornina_krogle (hr := w)

/-- Razlaga 6, Razlaga 7 (tabela): krogla zavzame 2/3 valja s polmerom r in višino 2r.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#krogla-v-valju
besedilo: »Postavimo jo v valj, ki se je ravno dotika (polmer $r$, višina $2r$): krogla zavzame natanko $\frac{2}{3}$ njegove prostornine.« -/
theorem krogla_v_valju (r : ℝ) (hr : 0 < r) : (4 * π * r ^ 3 / 3) / (π * r ^ 2 * (2 * r)) = 2 / 3 := by
  have := pi_pos
  field_simp; ring

/-- Predpostavke trditve `krogla_v_valju` se dajo izpolniti (r = 1). -/
example : (0:ℝ) < 1 := one_pos

/-- Predpostavke trditve `krogla_v_valju` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 1 := one_pos
  krogla_v_valju (hr := w)

/-- Razlaga 6 (premisli), Iz vsakdanjega življenja (žoga): pri dvakratnem premeru se prostornina poveča
osemkrat (2³ = 8; 8·4 g = 32 g), površina štirikrat (2² = 4).
trditev: MAT-SS-3/povrsina-in-prostornina-teles#toca
besedilo: »Osemkrat, ker je v prostornini $r^3$ in $2^3 = 8$. Zrno s premerom $4\,\text{cm}$ tehta okoli $8 \cdot 4\,\text{g} = 32\,\text{g}$, ne $8\,\text{g}$. Površina pa se poveča le štirikrat ($2^2 = 4$).« -/
theorem toca (r : ℝ) :
    4 * π * (2 * r) ^ 3 / 3 = 8 * (4 * π * r ^ 3 / 3) ∧ 4 * π * (2 * r) ^ 2 = 4 * (4 * π * r ^ 2) ∧
    (2 : ℝ) ^ 3 = 8 ∧ (8 : ℝ) * 4 = 32 ∧ (2 : ℝ) ^ 2 = 4 := by
  refine ⟨by ring, by ring, by norm_num, by norm_num, by norm_num⟩

/-- Ustno vprašanje 2: pri polmeru kr se površina krogle poveča k²-krat, prostornina k³-krat.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#krogla-k
besedilo: »Površina krogle je $P = 4\pi r^2$, zato se pri polmeru $k r$ poveča $k^2$-krat.« -/
theorem krogla_k (k r : ℝ) :
    4 * π * (k * r) ^ 2 = k ^ 2 * (4 * π * r ^ 2) ∧
    4 * π * (k * r) ^ 3 / 3 = k ^ 3 * (4 * π * r ^ 3 / 3) := ⟨by ring, by ring⟩

open scoped Pointwise in
/-- Ustno vprašanje 2 (splošno): telo, povečano k-krat (k ≥ 0), ima k³-krat večjo prostornino
(Lebesgueova mera v ℝ³).
trditev: MAT-SS-3/povrsina-in-prostornina-teles#podobno-telo-prostornina
besedilo: »Prostornina je $V = \frac{4\pi r^3}{3}$, zato se poveča $k^3$-krat.« -/
theorem podobno_telo_prostornina (K : Set (EuclideanSpace ℝ (Fin 3))) (k : ℝ) (hk : 0 ≤ k) :
    MeasureTheory.volume (k • K) = ENNReal.ofReal (k ^ 3) * MeasureTheory.volume K := by
  rw [MeasureTheory.Measure.addHaar_smul, finrank_euclideanSpace_fin, abs_of_nonneg (pow_nonneg hk 3)]

/-- Predpostavka trditve `podobno_telo_prostornina` se da izpolniti (k = 2). -/
example : (0:ℝ) ≤ 2 := by norm_num

/-- Predpostavke trditve `podobno_telo_prostornina` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 2 := by norm_num
  podobno_telo_prostornina (hk := w)

/-- Razlaga 7, Na sliki, Preveri se (2): stožec je zložen iz plasti – presek na višini h je krog s polmerom
r(v − h)/v; vsota (integral) ploščin presekov je πr²v/3, tretjina valja πr²·v.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#stozec-plasti
besedilo: »presek »valja brez stožca« je kolobar: velik krog $\pi r^2$ minus krog stožca s polmerom $h$ (stožec ima enako višino in polmer, zato je na višini $h$ polmer $h$): $\pi r^2 - \pi h^2$.« -/
theorem stozec_plasti (r v : ℝ) (hv : 0 < v) :
    ∫ h in (0:ℝ)..v, π * (r * (v - h) / v) ^ 2 = π * r ^ 2 * v / 3 := by
  have hF : ∀ x ∈ Set.uIcc (0:ℝ) v, HasDerivAt (fun h : ℝ => -(π * r ^ 2 * (v - h) ^ 3 / (3 * v ^ 2)))
      (π * (r * (v - x) / v) ^ 2) x := by
    intro x _
    have h1 : HasDerivAt (fun h : ℝ => (v - h) ^ 3) (3 * (v - x) ^ 2 * (-1)) x := by
      have h := (hasDerivAt_pow 3 (v - x)).comp x ((hasDerivAt_const x v).sub (hasDerivAt_id x))
      simp only [Function.comp_def, Nat.cast_ofNat] at h
      convert h using 1; simp
    convert (h1.const_mul (π * r ^ 2 / (3 * v ^ 2))).neg using 1
    · ext h; simp only [Pi.neg_apply]; ring
    · field_simp
  have hc : Continuous (fun h : ℝ => π * (r * (v - h) / v) ^ 2) := by fun_prop
  rw [intervalIntegral.integral_eq_sub_of_hasDerivAt hF (hc.intervalIntegrable 0 v)]
  field_simp; ring

/-- Razlaga 7 (piramida), Bolj natančno: pri piramidi z osnovno ploskvijo S je presek na višini h osnovna
ploskev, pomanjšana v razmerju (v − h)/v; ∫ ploščin = S·v/3, tretjina prizme S·v. Pri kocki z robom a:
a³/3 = a²·a/3 (Ustno vprašanje 3).
trditev: MAT-SS-3/povrsina-in-prostornina-teles#piramida-plasti
besedilo: »Enako razmerje velja za vsako piramido in prizmo z enako osnovno ploskvijo in višino, zato je prostornina piramide $V = \frac{S\,v}{3}$, kjer je $S$ ploščina osnovne ploskve in $v$ višina.« -/
theorem piramida_plasti (S v : ℝ) (hv : 0 < v) :
    ∫ h in (0:ℝ)..v, S * ((v - h) / v) ^ 2 = S * v / 3 := by
  have hF : ∀ x ∈ Set.uIcc (0:ℝ) v, HasDerivAt (fun h : ℝ => -(S * (v - h) ^ 3 / (3 * v ^ 2)))
      (S * ((v - x) / v) ^ 2) x := by
    intro x _
    have h1 : HasDerivAt (fun h : ℝ => (v - h) ^ 3) (3 * (v - x) ^ 2 * (-1)) x := by
      have h := (hasDerivAt_pow 3 (v - x)).comp x ((hasDerivAt_const x v).sub (hasDerivAt_id x))
      simp only [Function.comp_def, Nat.cast_ofNat] at h
      convert h using 1; simp
    convert (h1.const_mul (S / (3 * v ^ 2))).neg using 1
    · ext h; simp only [Pi.neg_apply]; ring
    · field_simp
  have hc : Continuous (fun h : ℝ => S * ((v - h) / v) ^ 2) := by fun_prop
  rw [intervalIntegral.integral_eq_sub_of_hasDerivAt hF (hc.intervalIntegrable 0 v)]
  field_simp; ring

/-- Ustno vprašanje 3, Bolj natančno: a³/3 = a²·a/3.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#kocka-tretjina
besedilo: »$\frac{a^3}{3} = \frac{a^2 \cdot a}{3}$« -/
theorem kocka_tretjina (a : ℝ) : a ^ 3 / 3 = a ^ 2 * a / 3 := by ring

/-- Predpostavke trditev `stozec_plasti` in `piramida_plasti` se dajo izpolniti (v = 1). -/
example : (0:ℝ) < 1 := one_pos

/-- Predpostavke trditve `piramida_plasti` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 1 := one_pos
  piramida_plasti (hv := w)

/-- Predpostavke trditve `stozec_plasti` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 1 := one_pos
  stozec_plasti (hv := w)

/-- Bolj natančno (višja raven): presek polkrogle na višini h je krog s polmerom √(r² − h²), ploščina
π(r² − h²) = πr² − πh² (kolobar valja brez stožca); ∫₀ʳ = πr²·r − πr²·r/3 = 2πr³/3, krogla 4πr³/3.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#polkrogla
besedilo: »presek »valja brez stožca« je kolobar: velik krog $\pi r^2$ minus krog stožca s polmerom $h$ (stožec ima enako višino in polmer, zato je na višini $h$ polmer $h$): $\pi r^2 - \pi h^2$.« -/
theorem polkrogla (r : ℝ) (hr : 0 ≤ r) :
    (∀ h, |h| ≤ r → π * √(r ^ 2 - h ^ 2) ^ 2 = π * (r ^ 2 - h ^ 2)) ∧
    (∀ h : ℝ, π * (r ^ 2 - h ^ 2) = π * r ^ 2 - π * h ^ 2) ∧
    ∫ h in (0:ℝ)..r, π * (r ^ 2 - h ^ 2) = π * r ^ 2 * r - π * r ^ 2 * r / 3 ∧
    π * r ^ 2 * r - π * r ^ 2 * r / 3 = 2 * π * r ^ 3 / 3 ∧ 2 * (2 * π * r ^ 3 / 3) = 4 * π * r ^ 3 / 3 := by
  refine ⟨fun h hh => ?_, fun h => by ring, ?_, by ring, by ring⟩
  · rw [Real.sq_sqrt]; nlinarith [abs_le.1 hh, sq_abs h, abs_nonneg h]
  · have hF : ∀ x ∈ Set.uIcc (0:ℝ) r, HasDerivAt (fun h : ℝ => π * (r ^ 2 * h - h ^ 3 / 3))
        (π * (r ^ 2 - x ^ 2)) x := by
      intro x _
      have := (((hasDerivAt_id x).const_mul (r ^ 2)).sub ((hasDerivAt_pow 3 x).div_const 3)).const_mul π
      convert this using 1; simp; ring
    have hc : Continuous (fun h : ℝ => π * (r ^ 2 - h ^ 2)) := by fun_prop
    rw [intervalIntegral.integral_eq_sub_of_hasDerivAt hF (hc.intervalIntegrable 0 r)]
    ring

/-- Predpostavke trditve `polkrogla` se dajo izpolniti (r = 1). -/
example : (0:ℝ) ≤ 1 := zero_le_one

/-! ## Razlaga 8: koti v telesih -/

/-- Predpostavke trditve `polkrogla` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≤ 1 := zero_le_one
  polkrogla (hr := w)

/-- Razlaga 8: pri pravilni štiristrani piramidi tan α = v/(a/2) = 2v/a, tan φ = v/(a√2/2) = 2v/(a√2);
ker je a√2/2 > a/2, je stranski rob položnejši od stranske ploskve: φ < α.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#rob-polozenejsi
besedilo: »Iz tabele preberemo $\tan\alpha = \frac{2v}{a}$ in $\tan\varphi = \frac{2v}{a\sqrt{2}}$.« -/
theorem rob_polozenejsi (a v : ℝ) (ha : 0 < a) (hv : 0 < v) :
    v / (a / 2) = 2 * v / a ∧ v / (a * √2 / 2) = 2 * v / (a * √2) ∧ a / 2 < a * √2 / 2 ∧
    arctan (2 * v / (a * √2)) < arctan (2 * v / a) := by
  have h2 : 1 < √2 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  refine ⟨by field_simp, by field_simp, by nlinarith, arctan_strictMono ?_⟩
  apply div_lt_div_of_pos_left (by positivity) ha (by nlinarith)

/-- Razlaga 8 (tabela): stranski rob pravilne štiristrane piramide je hipotenuza trikotnika s katetama v in
a√2/2: l² = v² + a²/2 (vrh (0,0,v), oglišče (a/2, a/2, 0)).
trditev: MAT-SS-3/povrsina-in-prostornina-teles#rob-piramide
besedilo: »Kateta $\frac{a}{2}$ seže do sredine roba, $\frac{a\sqrt{2}}{2}$ do oglišča, $l$ je stranski rob. Kot ob osnovni ploskvi je v prvem trikotniku naklon stranske ploskve $\alpha$, v drugem naklon stranskega roba $\varphi$.« -/
theorem rob_piramide (a v : ℝ) :
    dist (!₂[0, 0, v] : EuclideanSpace ℝ (Fin 3)) !₂[a / 2, a / 2, 0] ^ 2 = v ^ 2 + a ^ 2 / 2 := by
  rw [EuclideanSpace.dist_eq, Real.sq_sqrt (by positivity)]
  simp [Fin.sum_univ_three, Real.dist_eq, sq_abs]; ring

/-- Predpostavke trditve `rob_polozenejsi` se dajo izpolniti (a = 8, v = 4√3). -/
example : (0:ℝ) < 8 ∧ (0:ℝ) < 4 * √3 := ⟨by norm_num, by positivity⟩

/-- Predpostavke trditve `rob_polozenejsi` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 8 ∧ (0:ℝ) < 4 * √3 := ⟨by norm_num, by positivity⟩
  rob_polozenejsi (ha := w.1) (hv := w.2)

/-- Razlaga 8 (stožec): za α = arctan(v/r) velja cos α = r/s, tan α = v/r (s = √(r² + v²)); polovični kot
ob vrhu je arctan(r/v) = 90° − α, zato kot ob vrhu osnega preseka meri 180° − 2α.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#stozec-koti
besedilo: »Pri stožcu je osni presek enakokraki trikotnik s krakoma $s$ in osnovnico $2r$. Stranica oklepa z osnovno ploskvijo kot $\alpha$, za katerega velja $\cos\alpha = \frac{r}{s}$ in $\tan\alpha = \frac{v}{r}$. Kot ob vrhu osnega preseka meri $180^\circ - 2\alpha$.« -/
theorem stozec_koti (r v : ℝ) (hr : 0 < r) (hv : 0 < v) :
    cos (arctan (v / r)) = r / √(r ^ 2 + v ^ 2) ∧ tan (arctan (v / r)) = v / r ∧
    2 * arctan (r / v) = π - 2 * arctan (v / r) := by
  obtain ⟨h1, h2, -, -, -⟩ := kot_trikotnik r v hr hv
  refine ⟨h2, h1, ?_⟩
  have := arctan_inv_of_pos (show 0 < v / r by positivity)
  rw [inv_div] at this; rw [this]; ring

/-- Predpostavke trditve `stozec_koti` se dajo izpolniti (r = 3, v = 4). -/
example : (0:ℝ) < 3 ∧ (0:ℝ) < 4 := by norm_num

/-! ## Rešeni primeri -/

/-- Predpostavke trditve `stozec_koti` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 3 ∧ (0:ℝ) < 4 := by norm_num
  stozec_koti (hr := w.1) (hv := w.2)

/-- Primer 1: S = 6² = 36, V = 36·4/3 = 48, v_s = √(4² + 3²) = √25 = 5, stranska ploskev 6·5/2 = 15,
S_p = 4·15 = 60, P = 36 + 60 = 96.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#primer1
besedilo: »Ena stranska ploskev je trikotnik: $\dfrac{a \cdot v_s}{2} = \dfrac{6 \cdot 5}{2} = 15\,\text{cm}^2$. Plašč ima 4 takšne ploskve: $S_p = 60\,\text{cm}^2$.« -/
theorem primer1 :
    (6 : ℝ) ^ 2 = 36 ∧ (36 : ℝ) * 4 / 3 = 48 ∧ (6 : ℝ) / 2 = 3 ∧ √((4 : ℝ) ^ 2 + 3 ^ 2) = √25 ∧
    √(25 : ℝ) = 5 ∧ (6 : ℝ) * 5 / 2 = 15 ∧ (4 : ℝ) * 15 = 60 ∧ (36 : ℝ) + 60 = 96 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_, by norm_num, by norm_num, by norm_num⟩
  rw [show (25 : ℝ) = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Primer 2 a) (valj r = 3, v = 8): V = π·9·8 = 72π ≈ 226,19, P = 2π·3·11 = 66π ≈ 207,35.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#primer2a
besedilo: »$V = \pi r^2 v = \pi \cdot 9 \cdot 8 = 72\pi \approx 226{,}19\,\text{cm}^3$« -/
theorem primer2a :
    π * 3 ^ 2 * 8 = 72 * π ∧ |72 * π - 226.19| < 0.005 ∧ 2 * π * 3 * (3 + 8) = 66 * π ∧
    |66 * π - 207.35| < 0.005 := by
  have := pi_gt_d6; have := pi_lt_d6
  refine ⟨by ring, ?_, by ring, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Primer 2 b) (stožec r = 3, v = 4): s = √(9 + 16) = 5, V = π·9·4/3 = 12π ≈ 37,70, P = 9π + 15π = 24π
≈ 75,40; opazi: 12π ≠ 72π/3 (primerjava s tretjino valja velja le pri enaki višini).
trditev: MAT-SS-3/povrsina-in-prostornina-teles#primer2b
besedilo: »$P = \pi r^2 + \pi r s = 9\pi + 15\pi = 24\pi \approx 75{,}40\,\text{cm}^2$« -/
theorem primer2b :
    √((3 : ℝ) ^ 2 + 4 ^ 2) = √(9 + 16) ∧ √(9 + 16 : ℝ) = 5 ∧ π * 9 * 4 / 3 = 12 * π ∧
    |12 * π - 37.70| < 0.005 ∧ π * 3 ^ 2 + π * 3 * 5 = 9 * π + 15 * π ∧ 9 * π + 15 * π = 24 * π ∧
    |24 * π - 75.40| < 0.005 ∧ 12 * π ≠ 72 * π / 3 := by
  have := pi_gt_d6; have := pi_lt_d6
  refine ⟨by norm_num, ?_, by ring, ?_, by ring, by ring, ?_, ?_⟩
  · rw [show (9 + 16 : ℝ) = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  all_goals first | (rw [abs_lt]; constructor <;> linarith) | (intro h; linarith)

/-- Primer 3 (kornet): stožec 12π, polkrogla ½·4π·27/3 = ½·36π = 18π, skupaj 30π ≈ 94,25; plašč
π·3·5 = 15π, polkrogla ½·4π·9 = 18π, skupaj 33π ≈ 103,67.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#primer3
besedilo: »Odgovor: kornet s sladoledom ima prostornino $30\pi \approx 94{,}25\,\text{cm}^3$, od zunaj vidiš $33\pi \approx 103{,}67\,\text{cm}^2$.« -/
theorem primer3 :
    1 / 2 * (4 * π * 27 / 3) = 1 / 2 * (36 * π) ∧ 1 / 2 * (36 * π) = 18 * π ∧ 12 * π + 18 * π = 30 * π ∧
    |30 * π - 94.25| < 0.005 ∧ π * 3 * 5 = 15 * π ∧ 1 / 2 * (4 * π * 9) = 18 * π ∧
    15 * π + 18 * π = 33 * π ∧ |33 * π - 103.67| < 0.005 := by
  have := pi_gt_d6; have := pi_lt_d6
  refine ⟨by ring, by ring, by ring, ?_, by ring, by ring, by ring, ?_⟩ <;>
    rw [abs_lt] <;> constructor <;> linarith

/-- Primer 4 (dežemer): 0,5 l = 500 cm³, S = 64π ≈ 201,1; π·64·v = 500 ⇔ v = 500/(64π) ≈ 2,49 cm ≈ 25 mm.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#primer4
besedilo: »$v = \dfrac{500}{201{,}1} \approx 2{,}49\,\text{cm} \approx 25\,\text{mm}$« -/
theorem primer4 (v : ℝ) :
    (0.5 : ℝ) * 1000 = 500 ∧ π * 8 ^ 2 = 64 * π ∧ |64 * π - 201.1| < 0.05 ∧
    (π * 8 ^ 2 * v = 500 ↔ v = 500 / (64 * π)) ∧ |500 / (64 * π) - 2.49| < 0.005 ∧
    |10 * (500 / (64 * π)) - 25| < 0.5 := by
  have h1 := pi_gt_d6; have h2 := pi_lt_d6
  have hp : 0 < 64 * π := by positivity
  refine ⟨by norm_num, by ring, by rw [abs_lt]; constructor <;> linarith, ?_, ?_, ?_⟩
  · rw [eq_div_iff hp.ne']; constructor <;> intro h <;> linarith
  · rw [abs_lt]; constructor
    · rw [lt_sub_iff_add_lt, lt_div_iff₀ hp]; nlinarith
    · rw [sub_lt_iff_lt_add, div_lt_iff₀ hp]; nlinarith
  · rw [abs_lt]; constructor
    · rw [lt_sub_iff_add_lt, mul_div_assoc', lt_div_iff₀ hp]; nlinarith
    · rw [sub_lt_iff_lt_add, mul_div_assoc', div_lt_iff₀ hp]; nlinarith

/-- Primer 5 (streha): a/2 = 4, v = 4·tan 60° = 4√3 ≈ 6,93, v_s = 4/cos 60° = 4/0,5 = 8,
S_p = 4·8·8/2 = 128 m², polovica diagonale 8√2/2 = 4√2 ≈ 5,66, tan φ = 4√3/(4√2) ≈ 1,2247,
φ ≈ 50,8° < 60°.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#primer5
besedilo: »Stranski rob** se projicira na polovico diagonale kvadrata: $\dfrac{a\sqrt{2}}{2} = 4\sqrt{2} \approx 5{,}66\,\text{m}$. Zato je $\tan\varphi = \dfrac{4\sqrt{3}}{4\sqrt{2}} \approx 1{,}2247$ in $\varphi \approx 50{,}8^\circ$.« -/
theorem primer5 :
    (8 : ℝ) / 2 = 4 ∧ 4 * tan (60 * π / 180) = 4 * √3 ∧ |4 * √3 - 6.93| < 0.005 ∧
    4 / cos (60 * π / 180) = 4 / 0.5 ∧ (4 : ℝ) / 0.5 = 8 ∧ (4 : ℝ) * (8 * 8 / 2) = 128 ∧
    8 * √2 / 2 = 4 * √2 ∧ |4 * √2 - 5.66| < 0.005 ∧ |4 * √3 / (4 * √2) - 1.2247| < 0.00005 ∧
    |arctan (4 * √3 / (4 * √2)) * 180 / π - 50.8| < 0.05 ∧ arctan (4 * √3 / (4 * √2)) < 60 * π / 180 := by
  obtain ⟨s1, s2⟩ := sqrt2_meje
  obtain ⟨t1, t2⟩ := sqrt3_meje
  have h60 : (60 : ℝ) * π / 180 = π / 3 := by ring
  have hq : 4 * √3 / (4 * √2) = √(3 / 2) := by
    rw [Real.sqrt_div' _ (by norm_num)]; field_simp
  have q1 : (1.22474487 : ℝ) < √(3 / 2) := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have q2 : √(3 / 2) < (1.22474488 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, by rw [h60, tan_pi_div_three], by rw [abs_lt]; constructor <;> linarith,
    by rw [h60, cos_pi_div_three]; norm_num, by norm_num, by norm_num, by ring,
    by rw [abs_lt]; constructor <;> linarith, by rw [hq, abs_lt]; constructor <;> linarith, ?_, ?_⟩
  · rw [hq]
    exact arctan_stopinje (q₁ := 1.22474487) (q₂ := 1.22474488) ((50.8 - 0.05) * 3.141593 / 180)
      ((50.8 + 0.05) * 3.141592 / 180) (by norm_num) le_rfl le_rfl (by norm_num) (by norm_num)
      (by norm_num) q1.le q2.le (by norm_num) (by norm_num [cSp]) (by norm_num [cZg])
      (by norm_num [sZg, cSp]) (by norm_num [sSp, cZg])
  · rw [h60, ← arctan_sqrt_three, hq]
    exact arctan_strictMono (Real.sqrt_lt_sqrt (by norm_num) (by norm_num))

/-! ## Pogoste napake -/

/-- Pogoste napake (pozabljena osnovna ploskev): pri r > 0 je sam plašč 2πrv manjši od površine
2πr(r + v), ker manjkata dno in pokrov 2πr².
trditev: MAT-SS-3/povrsina-in-prostornina-teles#pozabljena-osnovna
besedilo: »Pozabljena osnovna ploskev.** Površino valja učenec računa samo kot plašč $2\pi r v$. Pločevinka pa ima tudi dno in pokrov. Popravek: valj in prizma imata dve osnovni ploskvi, stožec in piramida eno; izpusti jo le, če to zahteva naloga (šotor, kornet).« -/
theorem pozabljena_osnovna (r v : ℝ) (hr : 0 < r) :
    2 * π * r * (r + v) - 2 * π * r * v = 2 * π * r ^ 2 ∧ 2 * π * r * v < 2 * π * r * (r + v) := by
  have := pi_pos
  have h : 0 < 2 * π * r ^ 2 := by positivity
  refine ⟨by ring, by nlinarith⟩

/-- Predpostavke trditve `pozabljena_osnovna` se dajo izpolniti (r = 3). -/
example : (0:ℝ) < 3 := by norm_num

/-- Predpostavke trditve `pozabljena_osnovna` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 3 := by norm_num
  pozabljena_osnovna (hr := w)

/-- Pogoste napake: brez 1/3 dobiš π·9·4 = 36π (valj), stožec ima 12π; plašč s v namesto s: πrv ≠ πrs
(3·4 ≠ 3·5); premer 4 namesto polmera 2 da (4/2)³ = 8-krat preveč; r = 6: r³ = 216, ne r² = 36.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#pogoste-napake
besedilo: »Pozabljen faktor $\frac13$.** Učenec za stožec z $r = 3\,\text{cm}$, $v = 4\,\text{cm}$ računa $\pi \cdot 9 \cdot 4 = 36\pi$, kot pri valju.« -/
theorem pogoste_napake :
    π * 9 * 4 = 36 * π ∧ 36 * π / 3 = 12 * π ∧ π * 3 * 4 ≠ π * 3 * 5 ∧
    4 * π * 4 ^ 3 / 3 = 8 * (4 * π * 2 ^ 3 / 3) ∧ (6 : ℝ) ^ 3 = 216 ∧ (6 : ℝ) ^ 2 = 36 := by
  have := pi_pos
  refine ⟨by ring, by ring, ?_, by ring, by norm_num, by norm_num⟩
  intro h; nlinarith

/-! ## Za maturo -/

/-- Naloga 1: valj z v = 2r ima V = πr²·2r = 2πr³; 2πr³ = 54π ⇔ r³ = 27 ⇔ r = 3 (za realni r), v = 6,
P = 2π·3·9 = 54π.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#naloga1
besedilo: »Iz $2\pi r^3 = 54\pi$ sledi $r^3 = 27$, torej $r = 3\,\text{cm}$ in $v = 6\,\text{cm}$.« -/
theorem naloga1 (r : ℝ) :
    π * r ^ 2 * (2 * r) = 2 * π * r ^ 3 ∧ (2 * π * r ^ 3 = 54 * π ↔ r ^ 3 = 27) ∧ (r ^ 3 = 27 ↔ r = 3) ∧
    2 * (3 : ℝ) = 6 ∧ 2 * π * 3 * (3 + 6) = 54 * π := by
  have hp := pi_pos
  refine ⟨by ring, ?_, ?_, by norm_num, by ring⟩
  · constructor
    · intro h; nlinarith
    · intro h; rw [h]; ring
  · constructor
    · intro h; nlinarith [sq_nonneg (r - 3), sq_nonneg (r + 3 / 2)]
    · rintro rfl; norm_num

/-- RAČUN: 27^(1/3) = 3, 2π·3³ = 54π.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#racun-naloga1
besedilo: »Iz $2\pi r^3 = 54\pi$ sledi $r^3 = 27$, torej $r = 3\,\text{cm}$ in $v = 6\,\text{cm}$.« -/
theorem racun_naloga1 : (27 : ℝ) ^ ((1 : ℝ) / 3) = 3 ∧ 2 * π * 3 ^ 3 = 54 * π := by
  refine ⟨?_, by ring⟩
  rw [show (27 : ℝ) = 3 ^ (3 : ℝ) by norm_num, ← Real.rpow_mul (by norm_num)]; norm_num

/-- Naloga 2 a) (silos, r = 2, kot 35°): višina strehe v₂ = 2 tan 35° ≈ 1,4004 ≈ 1,40 m, stranica
s = 2/cos 35° ≈ 2,4415 ≈ 2,44 m.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#naloga2a
besedilo: »a) $v_2 = r\tan 35^\circ = 2\tan 35^\circ \approx 1{,}4004\,\text{m} \approx 1{,}40\,\text{m}$ in $s = \dfrac{r}{\cos 35^\circ} \approx 2{,}4415\,\text{m} \approx 2{,}44\,\text{m}$.« -/
theorem naloga2a :
    |2 * tan (35 * π / 180) - 1.4004| < 0.00005 ∧ |2 * tan (35 * π / 180) - 1.40| < 0.005 ∧
    |2 / cos (35 * π / 180) - 2.4415| < 0.00005 ∧ |2 / cos (35 * π / 180) - 2.44| < 0.005 := by
  obtain ⟨t1, t2, c1, c2⟩ := meje_35
  have hc : 0 < cos (35 * π / 180) := by linarith
  have u1 : (2.4415486 : ℝ) < 2 / cos (35 * π / 180) := by rw [lt_div_iff₀ hc]; nlinarith
  have u2 : 2 / cos (35 * π / 180) < (2.4415494 : ℝ) := by rw [div_lt_iff₀ hc]; nlinarith
  refine ⟨?_, ?_, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Naloga 2 b): V₁ = π·4·9 = 36π ≈ 113,097, V₂ = π·4·v₂/3 ≈ 5,866 (tudi z zaokroženim v₂ = 1,4004),
skupaj ≈ 118,963 ≈ 119,0 m³.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#naloga2b
besedilo: »b) Streha: $V_2 = \dfrac{\pi r^2 v_2}{3} \approx \dfrac{\pi \cdot 4 \cdot 1{,}4004}{3} \approx 5{,}866\,\text{m}^3$. Skupaj $V \approx 118{,}963\,\text{m}^3 \approx 119{,}0\,\text{m}^3$.« -/
theorem naloga2b :
    π * 2 ^ 2 * 9 = 36 * π ∧ |36 * π - 113.097| < 0.0005 ∧
    |π * 4 * (2 * tan (35 * π / 180)) / 3 - 5.866| < 0.0005 ∧ |π * 4 * 1.4004 / 3 - 5.866| < 0.0005 ∧
    |36 * π + π * 4 * (2 * tan (35 * π / 180)) / 3 - 118.963| < 0.0005 ∧
    |36 * π + π * 4 * (2 * tan (35 * π / 180)) / 3 - 119.0| < 0.05 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  obtain ⟨t1, t2, -, -⟩ := meje_35
  have hp : 0 < π := pi_pos
  refine ⟨by ring, ?_, ?_, ?_, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> nlinarith

/-- Naloga 2 c): plašč valja 2π·2·9 = 36π ≈ 113,097, plašč stožca π·2·s ≈ 15,341 (s = 2/cos 35°), skupaj
≈ 128,44 m²; navzgor zaokroženo ⌈·⌉ = 129 m².
trditev: MAT-SS-3/povrsina-in-prostornina-teles#naloga2c
besedilo: »c) Plašč valja: $2\pi r v_1 = 36\pi \approx 113{,}097\,\text{m}^2$. Plašč stožca: $\pi r s = \pi \cdot 2 \cdot s \approx 15{,}341\,\text{m}^2$.« -/
theorem naloga2c :
    2 * π * 2 * 9 = 36 * π ∧ |π * 2 * (2 / cos (35 * π / 180)) - 15.341| < 0.0005 ∧
    |36 * π + π * 2 * (2 / cos (35 * π / 180)) - 128.44| < 0.005 ∧
    ⌈36 * π + π * 2 * (2 / cos (35 * π / 180))⌉ = 129 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  obtain ⟨-, -, c1, c2⟩ := meje_35
  have hc : 0 < cos (35 * π / 180) := by linarith
  have u1 : (2.4415486 : ℝ) < 2 / cos (35 * π / 180) := by rw [lt_div_iff₀ hc]; nlinarith
  have u2 : 2 / cos (35 * π / 180) < (2.4415494 : ℝ) := by rw [div_lt_iff₀ hc]; nlinarith
  have hp : 0 < π := pi_pos
  refine ⟨by ring, ?_, ?_, ?_⟩
  · rw [abs_lt]; constructor <;> nlinarith
  · rw [abs_lt]; constructor <;> nlinarith
  · rw [Int.ceil_eq_iff]; constructor <;> push_cast <;> nlinarith

/-- Naloga 2 d): m = 36π m³ · 750 kg/m³ ≈ 84 823 kg ≈ 84,8 t (tudi 113,097·750 ≈ 84 823); RAČUN
π·2²·9·0,75 ≈ 84,82 t.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#naloga2d
besedilo: »$m = 113{,}097\,\text{m}^3 \cdot 750\,\text{kg/m}^3 \approx 84\,823\,\text{kg} \approx 84{,}8\,\text{t}$« -/
theorem naloga2d :
    |36 * π * 750 - 84823| < 0.5 ∧ |(113.097 : ℝ) * 750 - 84823| < 0.5 ∧
    |36 * π * 750 / 1000 - 84.8| < 0.05 ∧ |π * 2 ^ 2 * 9 * 0.75 - 84.82| < 0.005 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  refine ⟨?_, by rw [abs_lt]; norm_num, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Naloga 3 a) (r = 6, v = 8): s = √(36 + 64) = 10, P = 36π + 60π = 96π, V = π·36·8/3 = 96π.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#naloga3a
besedilo: »a) Stranica: $s = \sqrt{6^2 + 8^2} = 10\,\text{cm}$. Površina: $P = \pi r^2 + \pi r s = 36\pi + 60\pi = 96\pi\,\text{cm}^2$.« -/
theorem naloga3a :
    √((6 : ℝ) ^ 2 + 8 ^ 2) = 10 ∧ π * 6 ^ 2 + π * 6 * 10 = 36 * π + 60 * π ∧ 36 * π + 60 * π = 96 * π ∧
    π * 6 ^ 2 * 8 / 3 = 96 * π := by
  refine ⟨?_, by ring, by ring, by ring⟩
  rw [show (6 : ℝ) ^ 2 + 8 ^ 2 = 10 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Naloga 3 b): v osnem prerezu (N = (0,0), M = (6,0), T = (0,8)) ima premica TM enačbo 8x + 6y = 48;
središče O = (0, ρ) na osi je od nje oddaljeno |6ρ − 48|/10, dotik pomeni |6ρ − 48|/10 = ρ; za 0 < ρ < 8
je to natanko ρ = 3. Enačba iz podobnosti ρ/(8 − ρ) = 6/10 da 10ρ = 48 − 6ρ, 16ρ = 48, ρ = 3; tudi
ploščina 48 deljena s polobsegom 16 je 3.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#naloga3b
besedilo: »b) $10\rho = 48 - 6\rho$, $16\rho = 48$, $\rho = 3\,\text{cm}$. (Enako da formula za polmer včrtanega kroga: ploščina $48\,\text{cm}^2$ deljena s polobsegom $16\,\text{cm}$.)« -/
theorem naloga3b (ρ : ℝ) (h8 : ρ < 8) :
    (|6 * ρ - 48| / 10 = ρ ↔ ρ = 3) ∧ (ρ / (8 - ρ) = 6 / 10 ↔ 10 * ρ = 48 - 6 * ρ) ∧
    (10 * ρ = 48 - 6 * ρ ↔ 16 * ρ = 48) ∧ (16 * ρ = 48 ↔ ρ = 3) ∧
    (12 : ℝ) * 8 / 2 = 48 ∧ ((12 : ℝ) + 10 + 10) / 2 = 16 ∧ (48 : ℝ) / 16 = 3 := by
  have h8' : 8 - ρ ≠ 0 := by linarith
  refine ⟨?_, ?_, ⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    by norm_num, by norm_num, by norm_num⟩
  · rw [abs_of_neg (by linarith)]; constructor <;> intro h <;> linarith
  · rw [div_eq_div_iff h8' (by norm_num)]; constructor <;> intro h <;> linarith

/-- Predpostavka trditve `naloga3b` se da izpolniti (ρ = 3). -/
example : (3:ℝ) < 8 := by norm_num

/-- Predpostavke trditve `naloga3b` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (3:ℝ) < 8 := by norm_num
  naloga3b (h8 := w)

/-- Naloga 3 c): V_k = 4π·27/3 = 36π, delež 36π/(96π) = 3/8 = 37,5 %.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#naloga3c
besedilo: »c) $V_k = \dfrac{4\pi \rho^3}{3} = \dfrac{4\pi \cdot 27}{3} = 36\pi\,\text{cm}^3$. Delež: $\dfrac{36\pi}{96\pi} = \dfrac{3}{8} = 37{,}5\,\%$.« -/
theorem naloga3c : 4 * π * 3 ^ 3 / 3 = 36 * π ∧ (36 * π) / (96 * π) = 3 / 8 ∧ (3 : ℝ) / 8 * 100 = 37.5 := by
  have := pi_pos
  refine ⟨by ring, by field_simp; ring, by norm_num⟩

/-- Naloga 3 d): na višini h je prerez pokončnega stožca krog s polmerom 6(8 − h)/8; vsota (integral)
ploščin presekov je 96π. (Da ima poševni stožec enake prereze, tu ni dokazano; glej glavo.)
trditev: MAT-SS-3/povrsina-in-prostornina-teles#naloga3d
besedilo: »Na višini $h$ nad osnovno ploskvijo je prerez pri obeh krog s polmerom $\frac{6(8 - h)}{8}$,« -/
theorem naloga3d : ∫ h in (0:ℝ)..8, π * (6 * (8 - h) / 8) ^ 2 = 96 * π := by
  rw [stozec_plasti 6 8 (by norm_num)]; ring

/-! ## Preveri se -/

/-- Preveri se (3): 4πr³/3 = 288π ⇔ r³ = 3·288/4 = 216 ⇔ r = 6; napačni odgovori ∛288 ≈ 6,6 in √216 ≈ 14,7.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#krogla-288
besedilo: »6,6 | To je $\sqrt[3]{288}$. Pozabljen je faktor $\frac{4}{3}$: iz $\frac{4\pi r^3}{3} = 288\pi$ najprej dobiš $r^3 = 216$.« -/
theorem krogla_288 (r : ℝ) :
    (4 * π * r ^ 3 / 3 = 288 * π ↔ r ^ 3 = 216) ∧ (3 : ℝ) * 288 / 4 = 216 ∧ (r ^ 3 = 216 ↔ r = 6) ∧
    |(288 : ℝ) ^ ((1 : ℝ) / 3) - 6.6| < 0.05 ∧ |√(216 : ℝ) - 14.7| < 0.05 := by
  have hp := pi_pos
  refine ⟨⟨fun h => by nlinarith, fun h => by rw [h]; ring⟩, by norm_num,
    ⟨fun h => by nlinarith [sq_nonneg (r - 6), sq_nonneg (r + 3)], by rintro rfl; norm_num⟩, ?_, ?_⟩
  · set c := (288 : ℝ) ^ ((1 : ℝ) / 3) with hcdef
    have hc : c ^ 3 = 288 := by
      rw [hcdef, ← Real.rpow_natCast, ← Real.rpow_mul (by norm_num)]; norm_num
    have hc0 : 0 < c := by positivity
    rw [abs_lt]; constructor
    · by_contra h; push Not at h
      have := pow_le_pow_left₀ hc0.le (show c ≤ 6.55 by linarith) 3
      norm_num at this; linarith
    · by_contra h; push Not at h
      have := pow_le_pow_left₀ (by norm_num) (show (6.65 : ℝ) ≤ c by linarith) 3
      norm_num at this; linarith
  · have h1 : (14.65 : ℝ) < √216 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
    have h2 : √216 < (14.75 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
    rw [abs_lt]; constructor <;> linarith

/-- Preveri se (4): kup soli r = 2, v = 1,5: V = π·4·1,5/3 = 2π ≈ 6,3 (≈ 6 m³); napačni: valj
π·4·1,5 ≈ 18,8 (≈ 19), brez kvadrata π·2·1,5/3 ≈ 3,1 (≈ 3), premer π·16·1,5/3 ≈ 25,1 (≈ 25).
trditev: MAT-SS-3/povrsina-in-prostornina-teles#sol
besedilo: »$V = \dfrac{\pi r^2 v}{3} = \dfrac{\pi \cdot 4 \cdot 1{,}5}{3} = 2\pi \approx 6{,}3\,\text{m}^3$« -/
theorem sol :
    π * 4 * 1.5 / 3 = 2 * π ∧ |2 * π - 6.3| < 0.05 ∧ |2 * π - 6| < 0.5 ∧ |π * 4 * 1.5 - 18.8| < 0.05 ∧
    |π * 2 * 1.5 / 3 - 3.1| < 0.05 ∧ |π * 16 * 1.5 / 3 - 25.1| < 0.05 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  refine ⟨by ring, ?_, ?_, ?_, ?_, ?_⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Preveri se (5): r = 5, v = 12: s = √(25 + 144) = 13, P = 25π + 65π = 90π; napačni: 25π + 5·12π = 85π,
plašč 65π, prostornina π·25·12/3 = 100π.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#stozec-90
besedilo: »Stranica je $s = \sqrt{25 + 144} = 13\,\text{cm}$. Potem $P = \pi r^2 + \pi r s = 25\pi + 65\pi = 90\pi$. Odgovor $85\pi$ uporabi $v$ namesto $s$, $65\pi$ je samo plašč, $100\pi$ pa je prostornina.« -/
theorem stozec_90 :
    √((25 : ℝ) + 144) = 13 ∧ π * 5 ^ 2 + π * 5 * 13 = 25 * π + 65 * π ∧ 25 * π + 65 * π = 90 * π ∧
    25 * π + 5 * 12 * π = 85 * π ∧ π * 25 * 12 / 3 = 100 * π := by
  refine ⟨?_, by ring, by ring, by ring, by ring⟩
  rw [show (25 : ℝ) + 144 = 13 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Preveri se (6): r = 5, s = 10, cos α = 5/10 = 1/2, α = 60°; napačna: 30° (kot ob vrhu, 90° − 60°)
in arctan(10/5) ≈ 63,4°. RAČUN: arccos(5/10)·180/π = 60.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#stozec-60
besedilo: »V osnem preseku je polmer priležna kateta, stranica hipotenuza: $\cos\alpha = \frac{5}{10} = \frac{1}{2}$, zato $\alpha = 60^\circ$.« -/
theorem stozec_60 :
    arccos (5 / 10) * 180 / π = 60 ∧ (90 : ℝ) - 60 = 30 ∧ |arctan (10 / 5) * 180 / π - 63.4| < 0.05 := by
  refine ⟨?_, by norm_num, ?_⟩
  · rw [show (5 : ℝ) / 10 = 1 / 2 by norm_num, ← cos_pi_div_three,
      arccos_cos (by linarith [pi_pos]) (by linarith [pi_pos])]
    field_simp; ring
  · have e : arctan (10 / 5) = π / 2 - arctan (5 / 10) := by
      rw [← arctan_inv_of_pos (by norm_num)]; norm_num
    have h := arctan_stopinje (q := 5 / 10) (D := 26.6) (e := 0.05) (q₁ := 5 / 10) (q₂ := 5 / 10)
      ((26.6 - 0.05) * 3.141593 / 180) ((26.6 + 0.05) * 3.141592 / 180) (by norm_num) le_rfl le_rfl
      (by norm_num) (by norm_num) (by norm_num) le_rfl le_rfl (by norm_num) (by norm_num [cSp])
      (by norm_num [cZg]) (by norm_num [sZg, cSp]) (by norm_num [sSp, cZg])
    have hpi : (π / 2 - arctan (5 / 10)) * 180 / π = 90 - arctan (5 / 10) * 180 / π := by
      field_simp; ring
    rw [e, hpi]
    rw [abs_lt] at h ⊢; constructor <;> linarith [h.1, h.2]

/-- Iz vsakdanjega življenja: pločevinka r = 3, v = 8 ima V = 72π ≈ 226 cm³ ≈ 0,23 l.
trditev: MAT-SS-3/povrsina-in-prostornina-teles#plocevinka
besedilo: »Pločevinka z $r = 3\,\text{cm}$ in $v = 8\,\text{cm}$ ima $V \approx 226\,\text{cm}^3$, torej okoli $0{,}23\,\text{l}$.« -/
theorem plocevinka : |72 * π - 226| < 0.5 ∧ |72 * π / 1000 - 0.23| < 0.005 := by
  have p1 := pi_gt_d6; have p2 := pi_lt_d6
  constructor <;> rw [abs_lt] <;> constructor <;> linarith

/-- RAČUN: 4·tan 60° ≈ 6,93; 4/cos 60° = 8; 4·8·8/2 = 128; 10x = 6(8 − x) ⇔ x = 3. (Ostali računi
so v `primer5`, `naloga3a`, `naloga3b` in `naloga3c`.)
trditev: MAT-SS-3/povrsina-in-prostornina-teles#racun
besedilo: »$v = \dfrac{a}{2} \cdot \tan 60^\circ = 4\sqrt{3} \approx 6{,}93\,\text{m}$« -/
theorem racun :
    |4 * tan (60 * π / 180) - 6.93| < 0.005 ∧ 4 / cos (60 * π / 180) = 8 ∧ (4 : ℝ) * 8 * 8 / 2 = 128 ∧
    (∀ x : ℝ, 10 * x = 6 * (8 - x) ↔ x = 3) := by
  obtain ⟨t1, t2⟩ := sqrt3_meje
  refine ⟨?_, ?_, by norm_num, fun x => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩⟩
  · rw [show (60 : ℝ) * π / 180 = π / 3 by ring, tan_pi_div_three, abs_lt]; constructor <;> linarith
  · rw [show (60 : ℝ) * π / 180 = π / 3 by ring, cos_pi_div_three]; norm_num

end Evklid.Lekcije.MAT_SS_3.PovrsinaInProstorninaTeles
