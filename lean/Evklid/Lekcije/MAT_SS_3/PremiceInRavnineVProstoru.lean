/-
vir: content/lessons/MAT-SS-3/premice-in-ravnine-v-prostoru.md
sha256: 0ef45563e6c30870c7cc7c878d36132f6073dd574ff1d467123d74eec5220cb4
Model: prostor je `EuclideanSpace ℝ (Fin 3)`, točka `T x y z`; kvader/kocka ima oglišča
A(0,0,0), B(a,0,0), C(a,b,0), D(0,b,0), E(0,0,c), F(a,0,c), G(a,b,c), H(0,b,c) (kocka: a = b = c).
Premica PQ je množica {P + t(Q − P)}, ravnina {X | ⟪n, X⟫ = k} z n ≠ 0. »Mimobežni« pomeni: ni skupne
točke in nobena ravnina ne vsebuje obeh (tabela v razlagi 2); »vzporedni« (različni) premici: ni skupne
točke, a obe ležita v neki ravnini. Pravokotna projekcija točke na ravnino je točka ravnine, katere zveznica
s točko je pravokotna na vsak vektor ravnine (nožišče). Kot med premico in ravnino je kot ∠ v
pravokotnem trikotniku krajišče–presečišče–nožišče (Mathlib `EuclideanGeometry.angle`). Zaokrožene
vrednosti so dokazane kot |x − vrednost| < pol enote zadnjega mesta (kot v stopinjah: · 180/π).
Ni v Leanu: risbe in simulacija »Robovi in ploskve teles«; uvodni prizori (igla, stojalo), analogije in
»Iz vsakdanjega življenja« razen v = l·sin φ in trditve, da je kot s projekcijo najmanjši (dokazano);
splošna razvrstitev leg (»dve premici se sekata, sta vzporedni ali mimobežni«, »dve ravnini sta
vzporedni ali se sekata v premici«, »premica leži v ravnini, jo seka ali je vzporedna«) – dokazani so vsi
primeri na kocki, splošna razvrstitev (zahtevno, še ni dokazano); kriterij pravokotnosti je dokazan v obeh
smereh za linearne kombinacije su + tv (da je vsak vektor ravnine take oblike, ni dokazano: zahtevno, še ni
dokazano); razlaga 5: projekcija premice kot premica skozi projekciji dveh točk ter »kot 0° ⇔ vzporedna,
90° ⇔ pravokotna« (zahtevno, še ni dokazano);
»sfera« in »valjasta ploskev« sta definiciji (za valjasto ploskev okoli AE je dokazana enačba
x² + y² = 16 prek `Metric.infDist`), obsevanje tumorja (krogla) je opis; razvrščanje korakov (kviz 3) in
točkovanje; ustni odgovori so dokazani v matematičnem delu; »45° je napačno« je dokazano kot
arctan 1 ≠ arctan(1/√2). Pri nalogi 1 je vrh pravilne piramide po definiciji nad središčem osnovne ploskve
(model V = (3, 3, h)); rob 6 določa h, uporabljen je le pogoj VA = 6.
Lean: √ negativnega je 0 in x/0 = 0; trditve s √ in deljenjem imajo zato pozitivne podatke.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.PremiceInRavnineVProstoru

open Real EuclideanGeometry InnerProductGeometry

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

/-- Predpostavke orodij `sc_bound` in `meje` se dajo izpolniti (x = 1/2). Predpostavke `arcsin_stopinje` in
`arctan_stopinje` so izpolnjene ob vsaki uporabi spodaj (npr. pri kotu 35,26°). -/
example : |(1 / 2 : ℝ)| ≤ 1 ∧ (0 : ℝ) ≤ 1 / 2 ∧ (1 / 2 : ℝ) ≤ 1 := by norm_num [abs_of_pos]

/-- Meje za √2.
pomozno -/
theorem sqrt2_meje : (1.41421356 : ℝ) < √2 ∧ √2 < 1.41421357 :=
  ⟨by rw [Real.lt_sqrt (by norm_num)]; norm_num, by rw [Real.sqrt_lt' (by norm_num)]; norm_num⟩

/-- Meje za √3.
pomozno -/
theorem sqrt3_meje : (1.73205080 : ℝ) < √3 ∧ √3 < 1.73205081 :=
  ⟨by rw [Real.lt_sqrt (by norm_num)]; norm_num, by rw [Real.sqrt_lt' (by norm_num)]; norm_num⟩

/-! ## Model prostora -/

/-- Prostor ℝ³. -/
abbrev R3 := EuclideanSpace ℝ (Fin 3)

/-- Točka s koordinatami (x, y, z). -/
@[expose] noncomputable def T (x y z : ℝ) : R3 := !₂[x, y, z]

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
@[simp] theorem T_0 (x y z : ℝ) : T x y z 0 = x := rfl
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
@[simp] theorem T_1 (x y z : ℝ) : T x y z 1 = y := rfl
/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
@[simp] theorem T_2 (x y z : ℝ) : T x y z 2 = z := rfl

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem ext3 {X Y : R3} (h0 : X 0 = Y 0) (h1 : X 1 = Y 1) (h2 : X 2 = Y 2) : X = Y := by
  ext i; fin_cases i <;> assumption

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem T_sub (a b c d e f : ℝ) : T a b c - T d e f = T (a - d) (b - e) (c - f) :=
  ext3 (by simp) (by simp) (by simp)

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem T_ext {X : R3} {x y z : ℝ} : X = T x y z ↔ X 0 = x ∧ X 1 = y ∧ X 2 = z :=
  ⟨by rintro rfl; simp, fun ⟨h0, h1, h2⟩ => ext3 (by simpa) (by simpa) (by simpa)⟩

/-- Skalarni produkt po koordinatah.
pomozno -/
theorem inner_k (X Y : R3) : inner ℝ X Y = X 0 * Y 0 + X 1 * Y 1 + X 2 * Y 2 := by
  simp [EuclideanSpace.inner_eq_star_dotProduct, Fin.sum_univ_three, dotProduct]; ring

/-- Razdalja po koordinatah.
pomozno -/
theorem dist_k (X Y : R3) : dist X Y = √((X 0 - Y 0)^2 + (X 1 - Y 1)^2 + (X 2 - Y 2)^2) := by
  rw [EuclideanSpace.dist_eq]; simp [Fin.sum_univ_three, Real.dist_eq, sq_abs]

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem dist_T (a b c d e f : ℝ) : dist (T a b c) (T d e f) = √((a-d)^2 + (b-e)^2 + (c-f)^2) := by
  rw [dist_k]; simp

/-- Premica skozi P in Q. -/
@[expose] def premica (P Q : R3) : Set R3 := {X | ∃ t : ℝ, X = P + t • (Q - P)}

/-- Ravnina ⟪n, X⟫ = k. -/
@[expose] def ravnina (n : R3) (k : ℝ) : Set R3 := {X | inner ℝ n X = k}

/-- Množica leži v neki ravnini skupaj z drugo. -/
@[expose] def vIstiRavnini (p q : Set R3) : Prop := ∃ n k, n ≠ 0 ∧ p ⊆ ravnina n k ∧ q ⊆ ravnina n k

/-- Mimobežni premici: brez skupne točke in ne ležita v nobeni skupni ravnini. -/
@[expose] def mimobezni (p q : Set R3) : Prop := Disjoint p q ∧ ¬ vIstiRavnini p q

/-- (Različni) vzporedni premici: brez skupne točke, a v isti ravnini. -/
@[expose] def vzporedni (p q : Set R3) : Prop := Disjoint p q ∧ vIstiRavnini p q

/-- Sekajoči premici: natanko ena skupna točka. -/
@[expose] def sekajoci (p q : Set R3) : Prop := ∃! X, X ∈ p ∧ X ∈ q

/-- Determinanta vektorjev u, w, d (mešani produkt). -/
@[expose] def det3 (u w d : R3) : ℝ :=
  u 0 * (w 1 * d 2 - w 2 * d 1) - u 1 * (w 0 * d 2 - w 2 * d 0) + u 2 * (w 0 * d 1 - w 1 * d 0)

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem premica_apply (P Q : R3) (t : ℝ) (i : Fin 3) :
    (P + t • (Q - P)) i = P i + t * (Q i - P i) := by simp

/-- Orodje: premici PQ in RS sta mimobežni, če smeri Q − P, S − R in zveznica R − P niso
komplanarne (mešani produkt ≠ 0).
pomozno -/
theorem mimobezni_of_det (P Q R S : R3) (h : det3 (Q - P) (S - R) (R - P) ≠ 0) :
    mimobezni (premica P Q) (premica R S) := by
  constructor
  · rw [Set.disjoint_left]
    rintro X ⟨t, rfl⟩ ⟨s, hs⟩
    apply h
    have e0 := congrFun (congrArg (⇑) hs) 0
    have e1 := congrFun (congrArg (⇑) hs) 1
    have e2 := congrFun (congrArg (⇑) hs) 2
    simp only [PiLp.add_apply, PiLp.smul_apply, PiLp.sub_apply, smul_eq_mul] at e0 e1 e2
    unfold det3
    simp only [PiLp.sub_apply]
    have r0 : R 0 - P 0 = t * (Q 0 - P 0) - s * (S 0 - R 0) := by linarith
    have r1 : R 1 - P 1 = t * (Q 1 - P 1) - s * (S 1 - R 1) := by linarith
    have r2 : R 2 - P 2 = t * (Q 2 - P 2) - s * (S 2 - R 2) := by linarith
    rw [r0, r1, r2]; ring
  · rintro ⟨n, k, hn, hp, hq⟩
    have hP := hp (show P ∈ premica P Q from ⟨0, by simp⟩)
    have hQ := hp (show Q ∈ premica P Q from ⟨1, by simp⟩)
    have hR := hq (show R ∈ premica R S from ⟨0, by simp⟩)
    have hS := hq (show S ∈ premica R S from ⟨1, by simp⟩)
    simp only [ravnina, Set.mem_ofPred_eq, inner_k] at hP hQ hR hS
    apply hn
    unfold det3 at h
    simp only [PiLp.sub_apply] at h
    apply ext3
    · have : det3 (Q - P) (S - R) (R - P) * n 0 = 0 := by
        unfold det3; simp only [PiLp.sub_apply]
        linear_combination ((S 1 - R 1) * (R 2 - P 2) - (S 2 - R 2) * (R 1 - P 1)) * (hQ - hP) +
          (-(Q 1 - P 1) * (R 2 - P 2) + (Q 2 - P 2) * (R 1 - P 1)) * (hS - hR) +
          ((Q 1 - P 1) * (S 2 - R 2) - (Q 2 - P 2) * (S 1 - R 1)) * (hR - hP)
      unfold det3 at this; simp only [PiLp.sub_apply] at this
      simpa [h] using this
    · have : det3 (Q - P) (S - R) (R - P) * n 1 = 0 := by
        unfold det3; simp only [PiLp.sub_apply]
        linear_combination (-(S 0 - R 0) * (R 2 - P 2) + (S 2 - R 2) * (R 0 - P 0)) * (hQ - hP) +
          ((Q 0 - P 0) * (R 2 - P 2) - (Q 2 - P 2) * (R 0 - P 0)) * (hS - hR) +
          (-(Q 0 - P 0) * (S 2 - R 2) + (Q 2 - P 2) * (S 0 - R 0)) * (hR - hP)
      unfold det3 at this; simp only [PiLp.sub_apply] at this
      simpa [h] using this
    · have : det3 (Q - P) (S - R) (R - P) * n 2 = 0 := by
        unfold det3; simp only [PiLp.sub_apply]
        linear_combination ((S 0 - R 0) * (R 1 - P 1) - (S 1 - R 1) * (R 0 - P 0)) * (hQ - hP) +
          (-(Q 0 - P 0) * (R 1 - P 1) + (Q 1 - P 1) * (R 0 - P 0)) * (hS - hR) +
          ((Q 0 - P 0) * (S 1 - R 1) - (Q 1 - P 1) * (S 0 - R 0)) * (hR - hP)
      unfold det3 at this; simp only [PiLp.sub_apply] at this
      simpa [h] using this

/-- Predpostavka trditve `mimobezni_of_det` se da izpolniti (AB in CG enotske kocke, mešani produkt 1). -/
example : det3 (T 1 0 0 - T 0 0 0) (T 1 1 1 - T 1 1 0) (T 1 1 0 - T 0 0 0) ≠ 0 := by
  simp [det3, T_sub]

/-! ## Kvader in kocka -/

/-- Oglišča kvadra z robovi a = AB, b = BC, c = AE (kocka: a = b = c). -/
@[expose] noncomputable def A (_a _b _c : ℝ) : R3 := T 0 0 0
@[expose] noncomputable def B (a _b _c : ℝ) : R3 := T a 0 0
@[expose] noncomputable def C (a b _c : ℝ) : R3 := T a b 0
@[expose] noncomputable def D (_a b _c : ℝ) : R3 := T 0 b 0
@[expose] noncomputable def E (_a _b c : ℝ) : R3 := T 0 0 c
@[expose] noncomputable def F (a _b c : ℝ) : R3 := T a 0 c
@[expose] noncomputable def G (a b c : ℝ) : R3 := T a b c
@[expose] noncomputable def H (_a b c : ℝ) : R3 := T 0 b c

/-- Ravnina osnovne ploskve ABCD: z = 0. -/
@[expose] noncomputable def osnovna : Set R3 := ravnina (T 0 0 1) 0

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem mem_osnovna (X : R3) : X ∈ osnovna ↔ X 2 = 0 := by
  simp [osnovna, ravnina, inner_k]

/-- Pravokotna projekcija (nožišče) N točke X na ravnino ⟪n, ·⟫ = k: N leži v ravnini in X − N je
pravokoten na vsak vektor ravnine (vsako razliko dveh njenih točk). -/
@[expose] def nozisce (X N : R3) (n : R3) (k : ℝ) : Prop :=
  N ∈ ravnina n k ∧ ∀ U ∈ ravnina n k, ∀ W ∈ ravnina n k, inner ℝ (X - N) (U - W) = 0

/-! ## Razlaga 2: lega dveh premic -/

/-- Razlaga 2 (tabela, primer na kocki): AB in BC se sekata (natanko ena skupna točka, B) in ležita
v isti ravnini (z = 0).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#ab-bc-sekata
besedilo: »V tabeli so »Točke« število skupnih točk, »Ravnina« pa pove, ali premici ležita v isti ravnini.« -/
theorem AB_BC_sekata (a : ℝ) (ha : 0 < a) :
    sekajoci (premica (A a a a) (B a a a)) (premica (B a a a) (C a a a)) ∧
    vIstiRavnini (premica (A a a a) (B a a a)) (premica (B a a a) (C a a a)) := by
  constructor
  · refine ⟨B a a a, ⟨⟨1, by simp⟩, ⟨0, by simp⟩⟩, ?_⟩
    rintro X ⟨⟨t, rfl⟩, ⟨s, hs⟩⟩
    have e0 := congrFun (congrArg (⇑) hs) 0
    have e1 := congrFun (congrArg (⇑) hs) 1
    simp [A, B, C] at e0 e1
    have hs0 : s = 0 := by
      rcases e1 with h | h
      · exact h
      · exact absurd h ha.ne'
    have ht : t = 1 := by
      subst hs0
      have := e0; field_simp at this; nlinarith [this]
    subst ht; simp [A, B]
  · refine ⟨T 0 0 1, 0, ?_, ?_, ?_⟩
    · intro h; have := congrFun (congrArg (⇑) h) 2; simp at this
    · rintro X ⟨t, rfl⟩; simp [ravnina, inner_k, A, B]
    · rintro X ⟨t, rfl⟩; simp [ravnina, inner_k, B, C]

/-- Predpostavke trditve `AB_BC_sekata` se dajo izpolniti (a = 1). -/
example : (0:ℝ) < 1 := one_pos

/-- Razlaga 2: AB in HG sta vzporedni: nimata skupne točke, ležita v isti ravnini (y = z) in imata isto
smer (G − H = B − A).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#ab-hg-vzporedni
besedilo: »Sekajoči premici imata eno skupno točko, vzporedni nimata skupne točke in ležita v isti ravnini.« -/
theorem AB_HG_vzporedni (a : ℝ) (ha : 0 < a) :
    vzporedni (premica (A a a a) (B a a a)) (premica (H a a a) (G a a a)) ∧
    G a a a - H a a a = B a a a - A a a a := by
  refine ⟨⟨?_, ?_⟩, ?_⟩
  · rw [Set.disjoint_left]
    rintro X ⟨t, rfl⟩ ⟨s, hs⟩
    have e2 := congrFun (congrArg (⇑) hs) 2
    simp [A, B, H, G] at e2
    exact ha.ne e2
  · refine ⟨T 0 1 (-1), 0, ?_, ?_, ?_⟩
    · intro h; have := congrFun (congrArg (⇑) h) 1; simp at this
    · rintro X ⟨t, rfl⟩; simp [ravnina, inner_k, A, B]
    · rintro X ⟨t, rfl⟩; simp [ravnina, inner_k, H, G]
  · simp [G, H, B, A, T_sub]

/-- Razlaga 2 in Preveri se (1): AB in CG sta mimobežni in pravokotni (⟪B − A, G − C⟫ = 0);
CG je vzporedna z BF (G − C = F − B), BF pa pravokotna na AB.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#ab-cg-pravokotni-mimobezni
besedilo: »Kot med mimobežnicama izmerimo tako, da eno vzporedno premaknemo, da seka drugo. Premica $CG$ je vzporedna z $BF$, ta pa je pravokotna na $AB$. Zato sta $AB$ in $CG$ **pravokotni mimobežnici**.« -/
theorem AB_CG_pravokotni_mimobezni (a : ℝ) (ha : 0 < a) :
    mimobezni (premica (A a a a) (B a a a)) (premica (C a a a) (G a a a)) ∧
    inner ℝ (B a a a - A a a a) (G a a a - C a a a) = 0 ∧
    G a a a - C a a a = F a a a - B a a a ∧ inner ℝ (B a a a - A a a a) (F a a a - B a a a) = 0 := by
  refine ⟨mimobezni_of_det _ _ _ _ ?_, ?_, ?_, ?_⟩
  · simp [det3, A, B, C, G, ha.ne']
  · simp [inner_k, A, B, C, G]
  · simp [G, C, F, B, T_sub]
  · simp [inner_k, A, B, F]

/-- Predpostavke trditev o kocki z robom a > 0 se dajo izpolniti (a = 6).
Trditve: `AB_HG_vzporedni`, `AB_CG_pravokotni_mimobezni`, `razlaga3`, `AE_BD_mimobezni`, `AF_ena_ni_dovolj`,
`AF_45`, `AF_bolj_strma`, `primer1a`, `primer1b`, `primer1c`, `primer1d` in `AB_DH_mimobezni`. -/
example : (0:ℝ) < 6 := by norm_num

/-! ## Razlaga 3: premica in ravnina, dve ravnini -/

/-- Razlaga 3: AB leži v ABCD; AE seka ABCD samo v A; EF z ABCD nima skupne točke (vzporedna);
ABCD in EFGH (z = a) nimata skupne točke; ABCD in BCGF (x = a) se sekata v premici BC.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#razlaga3
besedilo: »Premica in ravnina, dve ravnini.** Premica lahko leži v ravnini (rob $AB$ v ploskvi $ABCD$), jo seka v eni točki (rob $AE$ seka $ABCD$ v $A$) ali je z njo vzporedna (rob $EF$ in ploskev $ABCD$).« -/
theorem razlaga3 (a : ℝ) (ha : 0 < a) :
    premica (A a a a) (B a a a) ⊆ osnovna ∧
    premica (A a a a) (E a a a) ∩ osnovna = {A a a a} ∧
    Disjoint (premica (E a a a) (F a a a)) osnovna ∧
    Disjoint osnovna (ravnina (T 0 0 1) a) ∧
    osnovna ∩ ravnina (T 1 0 0) a = premica (B a a a) (C a a a) := by
  refine ⟨?_, ?_, ?_, ?_, ?_⟩
  · rintro X ⟨t, rfl⟩; simp [mem_osnovna, A, B]
  · ext X
    simp only [Set.mem_inter_iff, Set.mem_singleton_iff, mem_osnovna]
    constructor
    · rintro ⟨⟨t, rfl⟩, h⟩
      simp [A, E] at h
      rcases h with h | h
      · subst h; simp
      · exact absurd h ha.ne'
    · rintro rfl; exact ⟨⟨0, by simp⟩, by simp [A]⟩
  · rw [Set.disjoint_left]
    rintro X ⟨t, rfl⟩ h
    rw [mem_osnovna] at h; simp [E, F] at h; exact ha.ne' h
  · rw [Set.disjoint_left]
    intro X h1 h2
    rw [mem_osnovna] at h1
    simp [ravnina, inner_k] at h2
    rw [h1] at h2; exact ha.ne h2
  · ext X
    simp only [Set.mem_inter_iff, mem_osnovna, ravnina, Set.mem_ofPred_eq, inner_k, T_0, T_1, T_2]
    constructor
    · rintro ⟨h2, h0⟩
      refine ⟨X 1 / a, ext3 ?_ ?_ ?_⟩ <;> simp [B, C] <;> first | linarith | field_simp
    · rintro ⟨t, rfl⟩; simp [B, C]

/-! ## Razlaga 4: pravokotnost premice na ravnino -/

/-- Razlaga 4 (kriterij): če je n pravokoten na dve (sekajoči se) smeri u, v ravnine, je pravokoten
na vsako linearno kombinacijo su + tv.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#kriterij
besedilo: »Vseh premic ne moremo preveriti, zato velja kriterij: dovolj je, da je pravokotna na **dve sekajoči se** premici ravnine.« -/
theorem kriterij {V : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] (n u v : V)
    (hu : inner ℝ n u = 0) (hv : inner ℝ n v = 0) (s t : ℝ) : inner ℝ n (s • u + t • v) = 0 := by
  rw [inner_add_right, inner_smul_right, inner_smul_right, hu, hv]; ring

/-- Razlaga 4 (obratna smer kriterija): če je n pravokoten na vse su + tv, je pravokoten na u in v.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#kriterij-obratno
besedilo: »zato velja kriterij:« -/
theorem kriterij_obratno {V : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] (n u v : V)
    (h : ∀ s t : ℝ, inner ℝ n (s • u + t • v) = 0) : inner ℝ n u = 0 ∧ inner ℝ n v = 0 :=
  ⟨by simpa using h 1 0, by simpa using h 0 1⟩

/-- Predpostavka trditve `kriterij_obratno` se da izpolniti (n = (0,0,1), u = (1,0,0), v = (0,1,0)). -/
example : ∀ s t : ℝ, inner ℝ (T 0 0 1) (s • T 1 0 0 + t • T 0 1 0) = 0 := by
  intro s t; simp [inner_k]

/-- Razlaga 4: AE ⊥ AB in AE ⊥ AD, zato je AE pravokoten na vsak vektor ploskve ABCD (vsak vektor z
z = 0), tudi na diagonalo BD.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#ae-pravokoten
besedilo: »na ploskev $ABCD$ pa ni pravokotna.« -/
theorem AE_pravokoten (a : ℝ) :
    inner ℝ (E a a a - A a a a) (B a a a - A a a a) = 0 ∧
    inner ℝ (E a a a - A a a a) (D a a a - A a a a) = 0 ∧
    (∀ U ∈ osnovna, ∀ W ∈ osnovna, inner ℝ (E a a a - A a a a) (U - W) = 0) ∧
    inner ℝ (E a a a - A a a a) (D a a a - B a a a) = 0 := by
  refine ⟨by simp [inner_k, A, B, E], by simp [inner_k, A, D, E], ?_, by simp [inner_k, A, B, D, E]⟩
  intro U hU W hW
  rw [mem_osnovna] at hU hW
  simp [inner_k, A, E, hU, hW]

/-- Razlaga 4: AE diagonale BD ne seka (premici sta mimobežni), pa je nanjo vseeno pravokoten.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#ae-bd-mimobezni
besedilo: »da je pravokotna na **dve sekajoči se** premici ravnine.« -/
theorem AE_BD_mimobezni (a : ℝ) (ha : 0 < a) :
    mimobezni (premica (A a a a) (E a a a)) (premica (B a a a) (D a a a)) ∧
    inner ℝ (E a a a - A a a a) (D a a a - B a a a) = 0 :=
  ⟨mimobezni_of_det _ _ _ _ (by simp [det3, A, B, D, E, ha.ne']), by simp [inner_k, A, B, D, E]⟩

/-- Razlaga 4: ravnina ABFE (y = 0) vsebuje AE, ki je pravokoten na ABCD, zato je ABFE ⊥ ABCD.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#abfe-pravokotna
besedilo: »Ravnini sta pravokotni, če ena vsebuje premico, ki je pravokotna na drugo. Ploskev $ABFE$ vsebuje $AE$, zato je $ABFE \perp ABCD$.« -/
theorem ABFE_pravokotna (a : ℝ) :
    premica (A a a a) (E a a a) ⊆ ravnina (T 0 1 0) 0 ∧
    ∀ U ∈ osnovna, ∀ W ∈ osnovna, inner ℝ (E a a a - A a a a) (U - W) = 0 := by
  constructor
  · rintro X ⟨t, rfl⟩; simp [ravnina, inner_k, A, E]
  · intro U hU W hW; rw [mem_osnovna] at hU hW; simp [inner_k, A, E, hU, hW]

/-- Razlaga 4, premisli; Pogoste napake (2); Ustno vprašanje 2: AF ne leži v ABCD, je pravokotna na
AD (AD ⊥ AB in AD ⊥ AE, zato AD ⊥ AF), na ABCD pa ni pravokotna (⟪AF, AB⟫ ≠ 0).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#af-ena-ni-dovolj
besedilo: »ki ne leži v ploskvi $ABCD$ in je pravokotna na $AD$,« -/
theorem AF_ena_ni_dovolj (a : ℝ) (ha : 0 < a) :
    F a a a ∉ osnovna ∧
    inner ℝ (D a a a - A a a a) (B a a a - A a a a) = 0 ∧
    inner ℝ (D a a a - A a a a) (E a a a - A a a a) = 0 ∧
    inner ℝ (F a a a - A a a a) (D a a a - A a a a) = 0 ∧
    inner ℝ (F a a a - A a a a) (B a a a - A a a a) ≠ 0 := by
  refine ⟨?_, by simp [inner_k, A, B, D], by simp [inner_k, A, D, E], by simp [inner_k, A, D, F], ?_⟩
  · rw [mem_osnovna]; simp [F]; exact ha.ne'
  · simp [inner_k, A, B, F]; exact ha.ne'

/-- Razlaga 4, premisli; Ustno vprašanje 2: AF je proti tlom nagnjena za 45°: v trikotniku ABF je pravi
kot pri B (B je projekcija F), ∠ F A B = π/4.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#af-45
besedilo: »Toda $AF$ je proti tlom nagnjena za $45^\circ$.« -/
theorem AF_45 (a : ℝ) (ha : 0 < a) :
    nozisce (F a a a) (B a a a) (T 0 0 1) 0 ∧ ∠ (F a a a) (A a a a) (B a a a) = π / 4 := by
  have hB : ∠ (F a a a) (B a a a) (A a a a) = π / 2 := by
    rw [EuclideanGeometry.angle, ← inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [inner_k, A, B, F]
  constructor
  · refine ⟨by simp [ravnina, inner_k, B], ?_⟩
    intro U hU W hW
    simp [ravnina, inner_k] at hU hW
    simp [inner_k, F, B, hU, hW]
  · rw [EuclideanGeometry.angle_comm, angle_eq_arctan_of_angle_eq_pi_div_two hB ?_]
    · simp only [A, B, F, dist_T]
      norm_num [Real.sqrt_sq ha.le, div_self ha.ne', arctan_one]
    · intro h; have := congrFun (congrArg (⇑) h) 0; simp [A, B] at this; exact ha.ne this

/-! ## Razlaga 5: pravokotna projekcija in kot med premico in ravnino -/

/-- Kvadrat razdalje po koordinatah.
pomozno -/
theorem dist_sq_k (X Y : R3) : dist X Y ^ 2 = (X 0 - Y 0)^2 + (X 1 - Y 1)^2 + (X 2 - Y 2)^2 := by
  rw [dist_k, sq_sqrt (by positivity)]

/-- Razlaga 5: pravokotna projekcija je enolična (dve nožišči iste točke na isto ravnino sovpadata).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#nozisce-enolicno
besedilo: »Pravokotna projekcija.** Iz točke $T$ spustimo pravokotnico na ravnino; nožišče $T'$ je **pravokotna projekcija** točke $T$.« -/
theorem nozisce_enolicno {X N N' n : R3} {k : ℝ} (h : nozisce X N n k) (h' : nozisce X N' n k) :
    N = N' := by
  have h1 := h.2 N h.1 N' h'.1
  have h2 := h'.2 N h.1 N' h'.1
  have : inner ℝ (N - N') (N - N') = 0 := by
    have e : inner ℝ (N - N') (N - N') = inner ℝ (X - N') (N - N') - inner ℝ (X - N) (N - N') := by
      rw [← inner_sub_left]; congr 1; abel
    rw [e, h1, h2, sub_zero]
  rw [real_inner_self_eq_norm_sq] at this
  have : ‖N - N'‖ = 0 := by nlinarith [norm_nonneg (N - N')]
  exact sub_eq_zero.mp (norm_eq_zero.mp this)

/-- Projekcija na ravnino z = 0 (ABCD): nožišče točke (x, y, z) je (x, y, 0).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#nozisce-z
besedilo: »Pravokotna projekcija.** Iz točke $T$ spustimo pravokotnico na ravnino; nožišče $T'$ je **pravokotna projekcija** točke $T$.« -/
theorem nozisce_z (x y z : ℝ) : nozisce (T x y z) (T x y 0) (T 0 0 1) 0 := by
  refine ⟨by simp [ravnina, inner_k], ?_⟩
  intro U hU W hW
  simp only [ravnina, Set.mem_ofPred_eq, inner_k, T_0, T_1, T_2] at hU hW
  have hU' : U 2 = 0 := by linarith
  have hW' : W 2 = 0 := by linarith
  simp only [inner_k, T_sub, PiLp.sub_apply, T_0, T_1, T_2, hU', hW']; ring

/-- Predpostavki trditve `nozisce_enolicno` se dajo izpolniti (N = N' = (1, 2, 0) za X = (1, 2, 3)). -/
example : nozisce (T 1 2 3) (T 1 2 0) (T 0 0 1) 0 ∧ nozisce (T 1 2 3) (T 1 2 0) (T 0 0 1) 0 :=
  ⟨nozisce_z 1 2 3, nozisce_z 1 2 3⟩

/-- Projekcija na ravnino y = 0 (ABFE): nožišče točke (x, y, z) je (x, 0, z).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#nozisce-y
besedilo: »Pravokotna projekcija.** Iz točke $T$ spustimo pravokotnico na ravnino; nožišče $T'$ je **pravokotna projekcija** točke $T$.« -/
theorem nozisce_y (x y z : ℝ) : nozisce (T x y z) (T x 0 z) (T 0 1 0) 0 := by
  refine ⟨by simp [ravnina, inner_k], ?_⟩
  intro U hU W hW
  simp only [ravnina, Set.mem_ofPred_eq, inner_k, T_0, T_1, T_2] at hU hW
  have hU' : U 1 = 0 := by linarith
  have hW' : W 1 = 0 := by linarith
  simp only [inner_k, T_sub, PiLp.sub_apply, T_0, T_1, T_2, hU', hW']; ring

/-- Projekcija na ravnino x = y (ACGE): nožišče točke (x, y, z) je ((x+y)/2, (x+y)/2, z).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#nozisce-xy
besedilo: »Pravokotna projekcija.** Iz točke $T$ spustimo pravokotnico na ravnino; nožišče $T'$ je **pravokotna projekcija** točke $T$.« -/
theorem nozisce_xy (x y z : ℝ) :
    nozisce (T x y z) (T ((x + y) / 2) ((x + y) / 2) z) (T 1 (-1) 0) 0 := by
  refine ⟨by simp [ravnina, inner_k], ?_⟩
  intro U hU W hW
  simp only [ravnina, Set.mem_ofPred_eq, inner_k, T_0, T_1, T_2] at hU hW
  have hU' : U 1 = U 0 := by linarith
  have hW' : W 1 = W 0 := by linarith
  simp only [inner_k, T_sub, PiLp.sub_apply, T_0, T_1, T_2, hU', hW']; ring

/-- Razlaga 5: projekcija oglišča G na ABCD je C (projekcija AG je AC, A leži v ravnini); premica AE,
pravokotna na ABCD, se vsa projicira v eno točko A.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#projekcije
besedilo: »Projekcija oglišča $G$ na ploskev $ABCD$ je $C$, zato je projekcija telesne diagonale $AG$ ploskovna diagonala $AC$.« -/
theorem projekcije (a : ℝ) :
    nozisce (G a a a) (C a a a) (T 0 0 1) 0 ∧ nozisce (A a a a) (A a a a) (T 0 0 1) 0 ∧
    ∀ X ∈ premica (A a a a) (E a a a), nozisce X (A a a a) (T 0 0 1) 0 := by
  refine ⟨by simpa [G, C] using nozisce_z a a a, by simpa [A] using nozisce_z 0 0 0, ?_⟩
  rintro X ⟨t, rfl⟩
  have : A a a a + t • (E a a a - A a a a) = T 0 0 (t * a) := by
    apply ext3 <;> simp [A, E]
  rw [this]; simpa [A] using nozisce_z 0 0 (t * a)

section Splosno
variable {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
  [NormedAddTorsor V P]

/-- Razlaga 5 (in Povzetek, Ponovitev): daljica XK (X v ravnini), nožišče N, pravi kot pri N.
Za φ = ∠ N X K, l = XK, p = XN, v = KN velja sin φ = v/l, cos φ = p/l, tan φ = v/p, p = l cos φ,
v = l sin φ (»Iz vsakdanjega življenja«), p ≤ l in 0 ≤ φ ≤ 90°.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#pravokotni-trikotnik
besedilo: »daljica $l$, projekcija $p$, razdalja $v$ krajišča od ravnine: $\sin\varphi = \frac{v}{l}$, $\cos\varphi = \frac{p}{l}$, $\tan\varphi = \frac{v}{p}$ (na pamet)« -/
theorem pravokotni_trikotnik {X N K : P} (h : ∠ K N X = π / 2) (hK : K ≠ N) (_hX : X ≠ N) :
    sin (∠ N X K) = dist K N / dist K X ∧ cos (∠ N X K) = dist X N / dist K X ∧
    tan (∠ N X K) = dist K N / dist X N ∧ dist X N = dist K X * cos (∠ N X K) ∧
    dist K N = dist K X * sin (∠ N X K) ∧ dist X N ≤ dist K X ∧
    0 ≤ ∠ N X K ∧ ∠ N X K ≤ π / 2 := by
  refine ⟨sin_angle_of_angle_eq_pi_div_two h (Or.inl hK), cos_angle_of_angle_eq_pi_div_two h,
    tan_angle_of_angle_eq_pi_div_two h, ?_, ?_, ?_, angle_nonneg _ _ _,
    angle_le_pi_div_two_of_angle_eq_pi_div_two h⟩
  · rw [mul_comm]; exact (cos_angle_mul_dist_of_angle_eq_pi_div_two h).symm
  · rw [mul_comm]; exact (sin_angle_mul_dist_of_angle_eq_pi_div_two h).symm
  · have := cos_angle_mul_dist_of_angle_eq_pi_div_two h
    rw [← this]
    exact mul_le_of_le_one_left dist_nonneg (cos_le_one _)

/-- Drugače (analogija s senco): kot med premico in njeno projekcijo je najmanjši od kotov s premicami
ravnine. Če je w = p + q, q pravokoten na p in na vektor u ravnine, je ∠(w, p) ≤ ∠(w, u).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#kot-s-projekcijo-najmanjsi
besedilo: »Kot med premico in ravnino** je kot med palico in njeno senco, ne kot med palico in katerokoli črto na tleh.« -/
theorem kot_s_projekcijo_najmanjsi (p q u : V) (hqp : inner ℝ q p = 0) (hqu : inner ℝ q u = 0)
    (hp : p ≠ 0) (hu : u ≠ 0) :
    InnerProductGeometry.angle (p + q) p ≤ InnerProductGeometry.angle (p + q) u := by
  unfold InnerProductGeometry.angle
  apply arccos_le_arccos
  have h1 : inner ℝ (p + q) u = inner ℝ p u := by rw [inner_add_left, hqu, add_zero]
  have h2 : inner ℝ (p + q) p = ‖p‖ ^ 2 := by
    rw [inner_add_left, hqp, add_zero, real_inner_self_eq_norm_sq]
  rw [h1, h2]
  by_cases hw : p + q = 0
  · simp [hw]
  have hpn : 0 < ‖p‖ := norm_pos_iff.mpr hp
  have hun : 0 < ‖u‖ := norm_pos_iff.mpr hu
  have hwn : 0 < ‖p + q‖ := norm_pos_iff.mpr hw
  rw [div_le_div_iff₀ (by positivity) (by positivity)]
  have := real_inner_le_norm p u
  have e : ‖p‖ ^ 2 * (‖p + q‖ * ‖u‖) = (‖p‖ * ‖u‖) * (‖p + q‖ * ‖p‖) := by ring
  rw [e]
  exact mul_le_mul_of_nonneg_right this (by positivity)

end Splosno

/-- Predpostavke trditve `pravokotni_trikotnik` se dajo izpolniti (X = (0,0,0), N = (4,0,0),
K = (4,0,3)). -/
example : ∠ (T 4 0 3) (T 4 0 0) (T 0 0 0) = π / 2 ∧ T 4 0 3 ≠ T 4 0 0 ∧ T 0 0 0 ≠ T 4 0 0 := by
  refine ⟨?_, ?_, ?_⟩
  · rw [EuclideanGeometry.angle, ← inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [vsub_eq_sub, T_sub, inner_k]
  · intro h; have := congrFun (congrArg (⇑) h) 2; simp at this
  · intro h; have := congrFun (congrArg (⇑) h) 0; norm_num at this

/-- Predpostavke trditve `kot_s_projekcijo_najmanjsi` se dajo izpolniti (p = (1,0,0), q = (0,0,1),
u = (0,1,0)). Trditev: `kriterij` (prvi dve enakosti: n = (0,0,1), u = (1,0,0), v = (0,1,0)). -/
example : inner ℝ (T 0 0 1) (T 1 0 0) = 0 ∧ inner ℝ (T 0 0 1) (T 0 1 0) = 0 ∧
    T 1 0 0 ≠ 0 ∧ T 0 1 0 ≠ 0 := by
  refine ⟨by simp [inner_k], by simp [inner_k], ?_, ?_⟩
  · intro h; have := congrFun (congrArg (⇑) h) 0; simp at this
  · intro h; have := congrFun (congrArg (⇑) h) 1; simp at this

/-- Preveri se (2): projekcija p(φ) = l cos φ se pri dviganju (φ od 0° do 90°) strogo krajša, pri 0°
je enaka l, v navpični legi je 0 (točka); nikoli ni daljša od l.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#projekcija-se-krajsa
besedilo: »»Projekcija je enako dolga kot daljica.«** Velja le za daljico, vzporedno z ravnino. Sicer je $p = l\cos\varphi$ krajša, pri $90^\circ$ je le točka.« -/
theorem projekcija_se_krajsa (l : ℝ) (hl : 0 < l) :
    StrictAntiOn (fun φ => l * cos φ) (Set.Icc 0 (π / 2)) ∧ l * cos 0 = l ∧ l * cos (π / 2) = 0 ∧
    ∀ φ, l * cos φ ≤ l := by
  refine ⟨?_, by simp, by simp, fun φ => mul_le_of_le_one_right hl.le (cos_le_one φ)⟩
  intro x hx y hy hxy
  have := strictAntiOn_cos ⟨hx.1, by linarith [hx.2, pi_pos]⟩ ⟨hy.1, by linarith [hy.2, pi_pos]⟩ hxy
  simpa using mul_lt_mul_of_pos_left this hl

/-- Predpostavke trditve `projekcija_se_krajsa` se dajo izpolniti (l = 1). -/
example : (0:ℝ) < 1 := one_pos

/-! ## Kot med telesno diagonalo kvadra in osnovno ploskvijo -/

/-- Telesna diagonala kvadra a × b × c: pravi kot pri C, AC = √(a² + b²), AG = √(a² + b² + c²) in
φ = ∠ C A G = arctan(c / √(a² + b²)).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#kot-kvader
besedilo: »$d = \sqrt{a^2 + b^2}$, $\tan\varphi = \dfrac{c}{d}$« -/
theorem kot_kvader (a b c : ℝ) (ha : 0 < a) (hc : 0 < c) :
    ∠ (G a b c) (C a b c) (A a b c) = π / 2 ∧ dist (A a b c) (C a b c) = √(a^2 + b^2) ∧
    dist (A a b c) (G a b c) = √(a^2 + b^2 + c^2) ∧ dist (G a b c) (C a b c) = c ∧
    ∠ (C a b c) (A a b c) (G a b c) = arctan (c / √(a^2 + b^2)) := by
  have hr : ∠ (G a b c) (C a b c) (A a b c) = π / 2 := by
    rw [EuclideanGeometry.angle, ← inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [vsub_eq_sub, G, C, A, T_sub, inner_k]
  have dAC : dist (A a b c) (C a b c) = √(a^2 + b^2) := by simp [A, C, dist_T]
  have dGC : dist (G a b c) (C a b c) = c := by simp [G, C, dist_T, Real.sqrt_sq hc.le]
  refine ⟨hr, dAC, by simp [A, G, dist_T], dGC, ?_⟩
  rw [angle_eq_arctan_of_angle_eq_pi_div_two hr ?_, dGC, dAC]
  intro h; have := congrFun (congrArg (⇑) h) 0; simp [A, C] at this; exact ha.ne this

/-- Predpostavke trditve `kot_kvader` se dajo izpolniti (a = b = c = 1). -/
example : (0:ℝ) < 1 := one_pos

/-- Razlaga 5 (premisli), Povzetek, Ustno vprašanje 3, Primer 2 (korak 6): pri kocki z robom a je
projekcija AG diagonala AC = a√2 in tan φ = a/(a√2) = 1/√2; kot je za vsak rob enak arctan(1/√2).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#kocka-kot
besedilo: »Diagonala $AF$. Obe se dvigneta za $a$, projekcija $AF$ je rob $AB$ dolžine $a$, projekcija $AG$ pa daljša diagonala $AC = a\sqrt{2}$. Pri $AF$ je $\tan\varphi = 1$, torej $45^\circ$; pri $AG$ je kot manjši, okoli $35^\circ$ (Primer 2).« -/
theorem kocka_kot (a : ℝ) (ha : 0 < a) :
    dist (A a a a) (C a a a) = a * √2 ∧ ∠ (C a a a) (A a a a) (G a a a) = arctan (1 / √2) := by
  have hs : √(a^2 + a^2) = a * √2 := by
    rw [show a^2 + a^2 = a^2 * 2 by ring, Real.sqrt_mul (sq_nonneg a), Real.sqrt_sq ha.le]
  obtain ⟨-, h1, -, -, h2⟩ := kot_kvader a a a ha ha
  refine ⟨h1.trans hs, ?_⟩
  rw [h2, hs]
  congr 1; field_simp

/-- Predpostavke trditve `kocka_kot` se dajo izpolniti (a = 1). -/
example : (0:ℝ) < 1 := one_pos

/-- Razlaga 5, premisli: AF je bolj strma od AG (tan 45° = 1 > 1/√2, torej ∠ B A F > ∠ C A G).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#af-bolj-strma
besedilo: »Diagonala $AF$. Obe se dvigneta za $a$, projekcija $AF$ je rob $AB$ dolžine $a$, projekcija $AG$ pa daljša diagonala $AC = a\sqrt{2}$. Pri $AF$ je $\tan\varphi = 1$, torej $45^\circ$; pri $AG$ je kot manjši, okoli $35^\circ$ (Primer 2).« -/
theorem AF_bolj_strma (a : ℝ) (ha : 0 < a) :
    ∠ (C a a a) (A a a a) (G a a a) < ∠ (F a a a) (A a a a) (B a a a) := by
  rw [(kocka_kot a ha).2, (AF_45 a ha).2, ← arctan_one]
  apply arctan_strictMono
  rw [div_lt_one (by positivity)]
  exact (sqrt2_meje).1.trans' (by norm_num)

/-- Primer 2 (a = 6): C je projekcija G, pravi kot pri C, d = 6√2 ≈ 8,49,
tan φ = 6/(6√2) = 1/√2 ≈ 0,707, φ ≈ 35,26°; D = √(72 + 36) = 6√3 ≈ 10,39, sin φ = 6/(6√3) ≈ 0,577.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#primer2
besedilo: »Za preizkus: telesna diagonala $AG$ meri $D = \sqrt{d^2 + a^2} = \sqrt{72 + 36} = 6\sqrt{3} \approx 10{,}39\,\mathrm{cm}$ in $\sin\varphi = \dfrac{6}{6\sqrt{3}} \approx 0{,}577$, kar spet da $35{,}26^\circ$.« -/
theorem primer2 :
    nozisce (G 6 6 6) (C 6 6 6) (T 0 0 1) 0 ∧ ∠ (G 6 6 6) (C 6 6 6) (A 6 6 6) = π / 2 ∧
    dist (A 6 6 6) (C 6 6 6) = 6 * √2 ∧ |6 * √2 - 8.49| < 0.005 ∧
    tan (∠ (C 6 6 6) (A 6 6 6) (G 6 6 6)) = 6 / (6 * √2) ∧ (6 : ℝ) / (6 * √2) = 1 / √2 ∧
    |1 / √2 - 0.707| < 0.0005 ∧
    dist (A 6 6 6) (G 6 6 6) = √(72 + 36) ∧ √(72 + 36) = 6 * √3 ∧ |6 * √3 - 10.39| < 0.005 ∧
    sin (∠ (C 6 6 6) (A 6 6 6) (G 6 6 6)) = 6 / (6 * √3) ∧ |6 / (6 * √3) - 0.577| < 0.0005 := by
  obtain ⟨s1, s2⟩ := sqrt2_meje
  obtain ⟨t1, t2⟩ := sqrt3_meje
  obtain ⟨hr, dAC, dAG, dGC, hk⟩ := kot_kvader 6 6 6 (by norm_num) (by norm_num)
  have dAC' : dist (A 6 6 6) (C 6 6 6) = 6 * √2 := by
    rw [dAC, show (6:ℝ)^2 + 6^2 = 6^2 * 2 by norm_num, Real.sqrt_mul (by norm_num),
      Real.sqrt_sq (by norm_num)]
  have h108 : √(72 + 36 : ℝ) = 6 * √3 := by
    rw [show (72 + 36 : ℝ) = 6^2 * 3 by norm_num, Real.sqrt_mul (by norm_num),
      Real.sqrt_sq (by norm_num)]
  have dAG' : dist (A 6 6 6) (G 6 6 6) = √(72 + 36) := by rw [dAG]; norm_num
  refine ⟨by simpa [G, C] using nozisce_z 6 6 6, hr, dAC', ?_, ?_, ?_, ?_, dAG', h108, ?_, ?_, ?_⟩
  · rw [abs_lt]; constructor <;> nlinarith
  · rw [tan_angle_of_angle_eq_pi_div_two hr, dGC, dAC']
  · field_simp
  · rw [abs_lt, one_div]; constructor
    · rw [lt_sub_iff_add_lt, lt_inv_comm₀ (by norm_num) (by positivity)]; linarith
    · rw [sub_lt_iff_lt_add, inv_lt_comm₀ (by positivity) (by norm_num)]; linarith
  · rw [abs_lt]; constructor <;> nlinarith
  · rw [sin_angle_of_angle_eq_pi_div_two hr (Or.inl ?_), dGC, dist_comm (G 6 6 6), dAG', h108]
    intro h; have := congrFun (congrArg (⇑) h) 2; simp [G, C] at this
  · have : (6:ℝ) / (6 * √3) = 1 / √3 := by field_simp
    rw [this, abs_lt, one_div]; constructor
    · rw [lt_sub_iff_add_lt, lt_inv_comm₀ (by norm_num) (by positivity)]; linarith
    · rw [sub_lt_iff_lt_add, inv_lt_comm₀ (by positivity) (by norm_num)]; linarith

/-- Natančnejša meja: arctan(1/√2) · 180/π ≈ 35,2644 (na 0,0005).
pomozno -/
theorem arctan_35_2644 : |arctan (1 / √2) * 180 / π - 35.2644| < 0.0005 := by
  obtain ⟨hs, hs2⟩ := sqrt2_meje
  exact arctan_stopinje (q₁ := 1/1.41421357) (q₂ := 1/1.41421356) ((35.2644 - 0.0005) * 3.141593 / 180)
    ((35.2644 + 0.0005) * 3.141592 / 180) (by norm_num) le_rfl le_rfl (by norm_num) (by norm_num)
    (by norm_num) (one_div_le_one_div_of_le (by positivity) hs2.le)
    (one_div_le_one_div_of_le (by norm_num) hs.le)
    (by norm_num) (by norm_num [cSp]) (by norm_num [cZg]) (by norm_num [sZg, cSp]) (by norm_num [sSp, cZg])

/-- Primer 2 (korak 4), Povzetek, RAČUN: arctan(1/√2) · 180/π ≈ 35,26 (φ ≈ 35,26°).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#arctan-35-26
besedilo: »$\tan\varphi = \dfrac{6}{6\sqrt{2}} = \dfrac{1}{\sqrt{2}} \approx 0{,}707$, zato $\varphi \approx 35{,}26^\circ$.« -/
theorem arctan_35_26 : |arctan (1 / √2) * 180 / π - 35.26| < 0.005 := by
  have h := arctan_35_2644
  rw [abs_lt] at h ⊢; constructor <;> linarith [h.1, h.2]

/-- Natančnejša meja: arcsin(1/√3) · 180/π ≈ 35,2644 (na 0,0005).
pomozno -/
theorem arcsin_35_2644 : |arcsin (1 / √3) * 180 / π - 35.2644| < 0.0005 := by
  obtain ⟨t1, t2⟩ := sqrt3_meje
  exact arcsin_stopinje (y₁ := 1/1.73205081) (y₂ := 1/1.73205080) ((35.2644 - 0.0005) * 3.141593 / 180)
    ((35.2644 + 0.0005) * 3.141592 / 180) (by norm_num) le_rfl le_rfl (by norm_num) (by norm_num)
    (by norm_num) (one_div_le_one_div_of_le (by positivity) t2.le)
    (one_div_le_one_div_of_le (by norm_num) t1.le)
    (by rw [div_le_one (by positivity)]; linarith) (by norm_num [sZg]) (by norm_num [sSp])

/-- Primer 2 (korak 5), RAČUN: φ = arcsin(1/√3) ≈ 35,26°.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#arcsin-35-26
besedilo: »$\tan\varphi = \dfrac{6}{6\sqrt{2}} = \dfrac{1}{\sqrt{2}} \approx 0{,}707$, zato $\varphi \approx 35{,}26^\circ$.« -/
theorem arcsin_35_26 : |arcsin (1 / √3) * 180 / π - 35.26| < 0.005 := by
  have h := arcsin_35_2644
  rw [abs_lt] at h ⊢; constructor <;> linarith [h.1, h.2]

/-- Primer 2: kot je pri a = 6 enak ∠ C A G = arctan(1/√2) ≈ 35,26° in ≈ 35°16′ (|φ − 35 16/60| < 1/120).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#primer2-kot
besedilo: »$\tan\varphi = \dfrac{6}{6\sqrt{2}} = \dfrac{1}{\sqrt{2}} \approx 0{,}707$, zato $\varphi \approx 35{,}26^\circ$.« -/
theorem primer2_kot :
    |∠ (C 6 6 6) (A 6 6 6) (G 6 6 6) * 180 / π - 35.26| < 0.005 ∧
    |∠ (C 6 6 6) (A 6 6 6) (G 6 6 6) * 180 / π - (35 + 16 / 60)| < 1 / 120 := by
  rw [(kocka_kot 6 (by norm_num)).2]
  have h := arctan_35_2644
  simp only [abs_lt] at h ⊢
  exact ⟨⟨by linarith [h.1], by linarith [h.2]⟩, ⟨by linarith [h.1], by linarith [h.2]⟩⟩

/-- Primer 3: igla l = 16 mm, globina v = 8 mm (pravi kot pri nožišču N). Tedaj sin φ = 8/16 = 0,5,
φ = 30° in projekcija p = 16 cos 30° = 8√3 ≈ 13,86 ≈ 13,9 mm.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#primer3
besedilo: »$\sin\varphi = \dfrac{8}{16} = 0{,}5$, torej $\varphi = 30^\circ$.« -/
theorem primer3 {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] {X N K : P} (h : ∠ K N X = π / 2) (hl : dist K X = 16)
    (hv : dist K N = 8) :
    sin (∠ N X K) = 8 / 16 ∧ (8 / 16 : ℝ) = 0.5 ∧ ∠ N X K = π / 6 ∧
    dist X N = 16 * cos (30 * π / 180) ∧ 16 * cos (30 * π / 180) = 8 * √3 ∧
    |8 * √3 - 13.86| < 0.005 ∧ |8 * √3 - 13.9| < 0.05 := by
  have hK : K ≠ N := by intro e; rw [e, dist_self] at hv; norm_num at hv
  have hX : X ≠ N := by intro e; rw [e, hv] at hl; norm_num at hl
  obtain ⟨hs, -, -, hp, -, -, h0, h1⟩ := pravokotni_trikotnik h hK hX
  rw [hv, hl] at hs
  have hφ : ∠ N X K = π / 6 := by
    have := arcsin_sin (x := ∠ N X K) (by linarith [pi_pos]) h1
    rw [hs, show (8:ℝ)/16 = 1/2 by norm_num, ← sin_pi_div_six,
      arcsin_sin (by linarith [pi_pos]) (by linarith [pi_pos])] at this
    exact this.symm
  have h30 : (30 : ℝ) * π / 180 = π / 6 := by ring
  obtain ⟨t1, t2⟩ := sqrt3_meje
  refine ⟨hs, by norm_num, hφ, ?_, ?_, ?_, ?_⟩
  · rw [hp, hl, hφ, h30]
  · rw [h30, cos_pi_div_six]; ring
  · rw [abs_lt]; constructor <;> linarith
  · rw [abs_lt]; constructor <;> linarith

/-- Predpostavke trditve `primer3` se dajo izpolniti: X = (0,0,0), N = (8√3, 0, 0), K = (8√3, 0, −8). -/
example : ∠ (T (8 * √3) 0 (-8)) (T (8 * √3) 0 0) (T 0 0 0) = π / 2 ∧
    dist (T (8 * √3) 0 (-8)) (T 0 0 0) = 16 ∧ dist (T (8 * √3) 0 (-8)) (T (8 * √3) 0 0) = 8 := by
  refine ⟨?_, ?_, ?_⟩
  · rw [EuclideanGeometry.angle, ← inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [vsub_eq_sub, T_sub, inner_k]
  · rw [dist_T]; rw [show (8 * √3 - 0) ^ 2 + (0 - 0) ^ 2 + (-8 - 0) ^ 2 = (16:ℝ) ^ 2 by
      ring_nf; rw [Real.sq_sqrt (by norm_num)]; norm_num]
    exact Real.sqrt_sq (by norm_num)
  · rw [dist_T]; norm_num

/-- Primer 4: kvader 3 × 4 × c (c > 0): d = √(9 + 16) = 5 in kot 60° med telesno diagonalo in osnovno
ploskvijo velja natanko tedaj, ko je c = d·tan 60° = 5√3 ≈ 8,66 cm.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#primer4
besedilo: »$c = d\tan 60^\circ = 5\sqrt{3} \approx 8{,}66\,\mathrm{cm}$« -/
theorem primer4 (c : ℝ) (hc : 0 < c) :
    dist (A 3 4 c) (C 3 4 c) = √(9 + 16) ∧ √(9 + 16 : ℝ) = 5 ∧
    (∠ (C 3 4 c) (A 3 4 c) (G 3 4 c) = 60 * π / 180 ↔ c = 5 * √3) ∧ |5 * √3 - 8.66| < 0.005 := by
  obtain ⟨-, dAC, -, -, hk⟩ := kot_kvader 3 4 c (by norm_num) hc
  have h5 : √(9 + 16 : ℝ) = 5 := by
    rw [show (9 + 16 : ℝ) = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have h5' : √((3:ℝ) ^ 2 + 4 ^ 2) = 5 := by norm_num [← h5]
  obtain ⟨t1, t2⟩ := sqrt3_meje
  refine ⟨by rw [dAC]; norm_num, h5, ?_, by rw [abs_lt]; constructor <;> linarith⟩
  rw [hk, h5', show (60 : ℝ) * π / 180 = π / 3 by ring]
  constructor
  · intro h
    have := congrArg tan h
    rw [tan_arctan, tan_pi_div_three] at this
    linarith [this]
  · intro h; rw [h, show 5 * √3 / 5 = √3 by ring, arctan_sqrt_three]

/-- Predpostavke trditve `primer4` se dajo izpolniti (c = 5√3). -/
example : (0:ℝ) < 5 * √3 := by positivity

/-- RAČUN: 5·tan 60° ≈ 8,66 (premisli v primeru 4).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#racun-5tan60
besedilo: »$c = d\tan 60^\circ = 5\sqrt{3} \approx 8{,}66\,\mathrm{cm}$« -/
theorem racun_5tan60 : |5 * tan (60 * π / 180) - 8.66| < 0.005 := by
  rw [show (60 : ℝ) * π / 180 = π / 3 by ring, tan_pi_div_three]
  obtain ⟨t1, t2⟩ := sqrt3_meje
  rw [abs_lt]; constructor <;> linarith

/-! ## Primer 1: lege na kocki -/

/-- Primer 1 (a): EH ∥ AD in AD ∥ BC (iste smeri), EH in BC sta vzporedni in ležita v ravnini BCHE
(x + z = a).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#primer1a
besedilo: »(a) $EH \parallel AD$ in $AD \parallel BC$, torej $EH \parallel BC$: premici sta vzporedni. Obe ležita v ravnini $BCHE$.« -/
theorem primer1a (a : ℝ) (ha : 0 < a) :
    H a a a - E a a a = D a a a - A a a a ∧ D a a a - A a a a = C a a a - B a a a ∧
    vzporedni (premica (E a a a) (H a a a)) (premica (B a a a) (C a a a)) ∧
    premica (E a a a) (H a a a) ⊆ ravnina (T 1 0 1) a ∧ premica (B a a a) (C a a a) ⊆ ravnina (T 1 0 1) a := by
  have r1 : premica (E a a a) (H a a a) ⊆ ravnina (T 1 0 1) a := by
    rintro X ⟨t, rfl⟩; simp [ravnina, inner_k, E, H]
  have r2 : premica (B a a a) (C a a a) ⊆ ravnina (T 1 0 1) a := by
    rintro X ⟨t, rfl⟩; simp [ravnina, inner_k, B, C]
  refine ⟨by simp [H, E, D, A, T_sub], by simp [D, A, C, B, T_sub], ⟨?_, T 1 0 1, a, ?_, r1, r2⟩, r1, r2⟩
  · rw [Set.disjoint_left]
    rintro X ⟨t, rfl⟩ ⟨s, hs⟩
    have e2 := congrFun (congrArg (⇑) hs) 2
    simp [E, H, B, C] at e2; exact ha.ne' e2
  · intro h; have := congrFun (congrArg (⇑) h) 0; simp at this

/-- Primer 1 (b): EH in CG sta pravokotni mimobežnici (CG ∥ DH, DH ⊥ EH).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#primer1b
besedilo: »sta pravokotni mimobežnici.« -/
theorem primer1b (a : ℝ) (ha : 0 < a) :
    mimobezni (premica (E a a a) (H a a a)) (premica (C a a a) (G a a a)) ∧
    G a a a - C a a a = H a a a - D a a a ∧ inner ℝ (H a a a - D a a a) (H a a a - E a a a) = 0 ∧
    inner ℝ (H a a a - E a a a) (G a a a - C a a a) = 0 := by
  refine ⟨mimobezni_of_det _ _ _ _ ?_, by simp [G, C, H, D, T_sub], by simp [inner_k, H, D, E],
    by simp [inner_k, H, E, G, C]⟩
  simp [det3, E, H, C, G, ha.ne']

/-- Primer 1 (c): vse točke EG so za a nad ABCD, EG ravnine ne doseže (vzporedna z ravnino).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#primer1c
besedilo: »(c) Vse točke $EG$ so za rob $a$ nad ploskvijo $ABCD$, zato $EG$ ravnine $ABCD$ ne doseže: premica je vzporedna z ravnino.« -/
theorem primer1c (a : ℝ) (ha : 0 < a) :
    (∀ X ∈ premica (E a a a) (G a a a), X 2 = a) ∧ Disjoint (premica (E a a a) (G a a a)) osnovna := by
  have h : ∀ X ∈ premica (E a a a) (G a a a), X 2 = a := by
    rintro X ⟨t, rfl⟩; simp [E, G]
  refine ⟨h, Set.disjoint_left.2 fun X hX hO => ?_⟩
  rw [mem_osnovna, h X hX] at hO; exact ha.ne' hO

/-- Primer 1 (d): ploskvi ABFE (y = 0) in DCGH (y = a) sta vzporedni ravnini (brez skupne točke).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#primer1d
besedilo: »ni skupne točke in sta v isti ravnini $\Rightarrow$ vzporedni;« -/
theorem primer1d (a : ℝ) (ha : 0 < a) :
    A a a a ∈ ravnina (T 0 1 0) 0 ∧ B a a a ∈ ravnina (T 0 1 0) 0 ∧ F a a a ∈ ravnina (T 0 1 0) 0 ∧
    E a a a ∈ ravnina (T 0 1 0) 0 ∧ D a a a ∈ ravnina (T 0 1 0) a ∧ C a a a ∈ ravnina (T 0 1 0) a ∧
    G a a a ∈ ravnina (T 0 1 0) a ∧ H a a a ∈ ravnina (T 0 1 0) a ∧
    Disjoint (ravnina (T 0 1 0) 0) (ravnina (T 0 1 0) a) := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_⟩
  all_goals simp [ravnina, inner_k, A, B, C, D, E, F, G, H]
  rw [Set.disjoint_left]
  intro X h1 h2
  simp only [Set.mem_ofPred_eq] at h1 h2
  rw [h1] at h2; exact ha.ne h2

/-! ## Pogoste napake -/

/-- Pogoste napake (3), Pazi na: kdor vzame za projekcijo rob AB, dobi tan φ = 1, torej 45°, kar ni pravi
kot arctan(1/√2).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#napacna-projekcija
besedilo: »Napačna projekcija.** Pri kotu med $AG$ in $ABCD$ marsikdo vzame rob $AB$ namesto diagonale $AC$ in dobi $\tan\varphi = 1$, torej $45^\circ$.« -/
theorem napacna_projekcija : arctan 1 = π / 4 ∧ arctan 1 ≠ arctan (1 / √2) := by
  refine ⟨arctan_one, fun h => ?_⟩
  have := arctan_injective h
  obtain ⟨s1, -⟩ := sqrt2_meje
  rw [eq_div_iff (by positivity)] at this
  linarith

/-! ## Preveri se -/

/-- Preveri se (4): omarica 6 × 8 × 10 dm: diagonala osnovne ploskve √(36 + 64) = 10 dm, tan φ = 10/10 = 1,
φ = 45°.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#omarica
besedilo: »Diagonala osnovne ploskve je $\sqrt{6^2 + 8^2} = 10\,\mathrm{dm}$, enako kot višina. Zato je $\tan\varphi = \frac{10}{10} = 1$ in $\varphi = 45^\circ$.« -/
theorem omarica :
    dist (A 6 8 10) (C 6 8 10) = √(36 + 64) ∧ √(36 + 64 : ℝ) = 10 ∧
    ∠ (C 6 8 10) (A 6 8 10) (G 6 8 10) = arctan (10 / 10) ∧
    ∠ (C 6 8 10) (A 6 8 10) (G 6 8 10) * 180 / π = 45 := by
  obtain ⟨-, dAC, -, -, hk⟩ := kot_kvader 6 8 10 (by norm_num) (by norm_num)
  have h10 : √(36 + 64 : ℝ) = 10 := by
    rw [show (36 + 64 : ℝ) = 10 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have h10' : √((6:ℝ) ^ 2 + 8 ^ 2) = 10 := by norm_num [← h10]
  refine ⟨by rw [dAC]; norm_num, h10, by rw [hk, h10'], ?_⟩
  rw [hk, h10', div_self (by norm_num), arctan_one]
  field_simp; ring

/-- Preveri se (4), napačna odgovora (RAČUN): arctan(10/8) ≈ 51,3° in arctan(10/6) ≈ 59,0°.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#omarica-napacni
besedilo: »51,3 | Za projekcijo si vzel rob $8\,\mathrm{dm}$. Projekcija diagonale je diagonala osnovne ploskve, $\sqrt{36 + 64} = 10\,\mathrm{dm}$.« -/
theorem omarica_napacni :
    |arctan (10 / 8) * 180 / π - 51.3| < 0.05 ∧ |arctan (10 / 6) * 180 / π - 59.0| < 0.05 := by
  constructor
  · exact arctan_stopinje (q₁ := 10/8) (q₂ := 10/8) ((51.3 - 0.05) * 3.141593 / 180)
      ((51.3 + 0.05) * 3.141592 / 180) (by norm_num) le_rfl le_rfl (by norm_num) (by norm_num)
      (by norm_num) le_rfl le_rfl (by norm_num) (by norm_num [cSp]) (by norm_num [cZg])
      (by norm_num [sZg, cSp]) (by norm_num [sSp, cZg])
  · have e : arctan (10 / 6) = π / 2 - arctan (6 / 10) := by
      rw [← arctan_inv_of_pos (by norm_num)]; norm_num
    have h := arctan_stopinje (q := 6/10) (D := 31.0) (e := 0.05) (q₁ := 6/10) (q₂ := 6/10)
      ((31.0 - 0.05) * 3.141593 / 180)
      ((31.0 + 0.05) * 3.141592 / 180) (by norm_num) le_rfl le_rfl (by norm_num) (by norm_num)
      (by norm_num) le_rfl le_rfl (by norm_num) (by norm_num [cSp]) (by norm_num [cZg])
      (by norm_num [sZg, cSp]) (by norm_num [sSp, cZg])
    rw [e]
    have hpi : (π / 2 - arctan (6 / 10)) * 180 / π = 90 - arctan (6 / 10) * 180 / π := by
      field_simp; ring
    rw [hpi]
    rw [abs_lt] at h ⊢; constructor <;> linarith [h.1, h.2]

/-- Preveri se (5): simetralna ravnina daljice AC (kocka a) vsebuje natanko oglišča B, D, F, H (4 oglišča):
ta so enako oddaljena od A in C, ostala (A, C, E, G) niso.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#simetralna-ac
besedilo: »Simetralna ravnina daljice $AC$ gre skozi razpolovišče in je pravokotna na $AC$. To je ravnina $BDHF$: oglišča $B$, $D$, $F$, $H$ so enako oddaljena od $A$ in $C$.« -/
theorem simetralna_AC (a : ℝ) (ha : 0 < a) :
    dist (B a a a) (A a a a) = dist (B a a a) (C a a a) ∧ dist (D a a a) (A a a a) = dist (D a a a) (C a a a) ∧
    dist (F a a a) (A a a a) = dist (F a a a) (C a a a) ∧ dist (H a a a) (A a a a) = dist (H a a a) (C a a a) ∧
    dist (A a a a) (A a a a) ≠ dist (A a a a) (C a a a) ∧ dist (C a a a) (A a a a) ≠ dist (C a a a) (C a a a) ∧
    dist (E a a a) (A a a a) ≠ dist (E a a a) (C a a a) ∧ dist (G a a a) (A a a a) ≠ dist (G a a a) (C a a a) := by
  have hq : ∀ X Y Z : R3, dist X Y = dist X Z ↔ dist X Y ^ 2 = dist X Z ^ 2 :=
    fun X Y Z => (sq_eq_sq₀ dist_nonneg dist_nonneg).symm
  have ha2 : 0 < a ^ 2 := by positivity
  simp only [hq, dist_sq_k, ne_eq, A, B, C, D, E, F, G, H, T_0, T_1, T_2]
  refine ⟨by ring, by ring, by ring, by ring, ?_, ?_, ?_, ?_⟩ <;> intro h <;> nlinarith

/-- Predpostavke trditve `simetralna_AC` se dajo izpolniti (a = 1). -/
example : (0:ℝ) < 1 := one_pos

/-! ## Razlaga 6: množice točk v prostoru (višja raven) -/

/-- Razlaga 6 (višja raven), Pogoste napake (5): točke, enako oddaljene od P in Q, so natanko točke
simetralne ravnine: X − razpolovišče je pravokoten na PQ (Mathlib `AffineSubspace.perpBisector`).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#simetralna-ravnina
besedilo: »(višja raven) Simetralna ravnina gre skozi razpolovišče daljice in je nanjo pravokotna. Pri obsevanju tumorja zdravnik določi območje točk, ki so od središča tumorja oddaljene največ $r$: to je krogla, njen rob pa sfera.« -/
theorem simetralna_ravnina {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
    [NormedAddTorsor V P] (X Q₁ Q₂ : P) :
    dist X Q₁ = dist X Q₂ ↔ inner ℝ (X -ᵥ midpoint ℝ Q₁ Q₂) (Q₂ -ᵥ Q₁) = 0 := by
  rw [← AffineSubspace.mem_perpBisector_iff_dist_eq, AffineSubspace.mem_perpBisector_iff_inner_eq_zero]

/-! ## Ustna vprašanja -/

/-- Ustno vprašanje 1: na kocki sta AB in DH mimobežni.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#ab-dh-mimobezni
besedilo: »Na kocki $ABCDEFGH$ z osnovno ploskvijo $ABCD$, kjer je $H$ nad $D$, sta mimobežni na primer premici $AB$ in $DH$.« -/
theorem AB_DH_mimobezni (a : ℝ) (ha : 0 < a) :
    mimobezni (premica (A a a a) (B a a a)) (premica (D a a a) (H a a a)) :=
  mimobezni_of_det _ _ _ _ (by simp [det3, A, B, D, H, ha.ne'])

/-! ## Za maturo, naloga 1: pravilna štiristrana piramida (osnovni rob 6, stranski rob 6) -/

/-- Naloga 1: osnova (0,0,0), (6,0,0), (6,6,0), (0,6,0), središče S = (3,3,0), vrh V = (3,3,h) nad S,
stranski rob VA = 6. Projekcija V je S, projekcija stranskega roba je polovica diagonale:
p = 6√2/2 = 3√2, cos φ = 3√2/6 = √2/2, φ = 45°.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#naloga1
besedilo: »Stranski rob $l = 6\,\mathrm{cm}$, projekcija in višina piramide tvorijo pravokotni trikotnik: $\cos\varphi = \dfrac{p}{l} = \dfrac{3\sqrt{2}}{6} = \dfrac{\sqrt{2}}{2}$, zato $\varphi = 45^\circ$.« -/
theorem naloga1 (h : ℝ) (hl : dist (T 3 3 h) (T 0 0 0) = 6) :
    nozisce (T 3 3 h) (T 3 3 0) (T 0 0 1) 0 ∧ dist (T 0 0 0) (T 6 6 0) = 6 * √2 ∧
    dist (T 0 0 0) (T 3 3 0) = 6 * √2 / 2 ∧ 6 * √2 / 2 = 3 * √2 ∧
    cos (∠ (T 3 3 0) (T 0 0 0) (T 3 3 h)) = 3 * √2 / 6 ∧ 3 * √2 / 6 = √2 / 2 ∧
    ∠ (T 3 3 0) (T 0 0 0) (T 3 3 h) = π / 4 := by
  have hr : ∠ (T 3 3 h) (T 3 3 0) (T 0 0 0) = π / 2 := by
    rw [EuclideanGeometry.angle, ← inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [vsub_eq_sub, T_sub, inner_k]
  have d1 : dist (T 0 0 0) (T 6 6 0) = 6 * √2 := by
    rw [dist_T, show ((0:ℝ) - 6) ^ 2 + (0 - 6) ^ 2 + (0 - 0) ^ 2 = 6 ^ 2 * 2 by norm_num,
      Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  have d2 : dist (T 0 0 0) (T 3 3 0) = 3 * √2 := by
    rw [dist_T, show ((0:ℝ) - 3) ^ 2 + (0 - 3) ^ 2 + (0 - 0) ^ 2 = 3 ^ 2 * 2 by norm_num,
      Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  have hc := cos_angle_of_angle_eq_pi_div_two hr
  rw [d2, hl] at hc
  have h45 : 3 * √2 / 6 = √2 / 2 := by ring
  refine ⟨nozisce_z 3 3 h, d1, by rw [d2]; ring, by ring, hc, h45, ?_⟩
  rw [← arccos_cos (angle_nonneg _ _ _) (angle_le_pi _ _ _), hc, h45, ← cos_pi_div_four,
    arccos_cos (by linarith [pi_pos]) (by linarith [pi_pos])]

/-- Predpostavke trditve `naloga1` se dajo izpolniti (h = 3√2). -/
example : (0:ℝ) < 3 * √2 ∧ dist (T 3 3 (3 * √2)) (T 0 0 0) = 6 := by
  refine ⟨by positivity, ?_⟩
  rw [dist_T, show ((3:ℝ) - 0) ^ 2 + (3 - 0) ^ 2 + (3 * √2 - 0) ^ 2 = 6 ^ 2 by
    ring_nf; rw [Real.sq_sqrt (by norm_num)]; norm_num, Real.sqrt_sq (by norm_num)]

/-- RAČUN (naloga 1): 6√2/2 = 3√2 in arccos(3√2/6) · 180/π = 45.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#racun-naloga1
besedilo: »Stranski rob $l = 6\,\mathrm{cm}$, projekcija in višina piramide tvorijo pravokotni trikotnik: $\cos\varphi = \dfrac{p}{l} = \dfrac{3\sqrt{2}}{6} = \dfrac{\sqrt{2}}{2}$, zato $\varphi = 45^\circ$.« -/
theorem racun_naloga1 : 6 * √2 / 2 = 3 * √2 ∧ arccos (3 * √2 / 6) * 180 / π = 45 := by
  refine ⟨by ring, ?_⟩
  rw [show 3 * √2 / 6 = √2 / 2 by ring, ← cos_pi_div_four,
    arccos_cos (by linarith [pi_pos]) (by linarith [pi_pos])]
  field_simp; ring

/-! ## Za maturo, naloga 2: kvader 12 × 4 × 3 -/

/-- Naloga 2 a): z AE mimobežni so BC, CD, FG in GH; AB, AD (v A) ter EF, EH (v E) jo sekajo
(natanko ena skupna točka), BF, CG, DH so z njo vzporedni (brez skupne točke, v isti ravnini, enaka smer).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#naloga2a
besedilo: »Kvader $ABCDEFGH$ ima osnovno ploskev $ABCD$ in robove $AB = 12\,\mathrm{cm}$, $BC = 4\,\mathrm{cm}$ in $AE = 3\,\mathrm{cm}$; oglišča $E$, $F$, $G$, $H$ ležijo po vrsti nad $A$, $B$, $C$, $D$.« -/
theorem naloga2a :
    mimobezni (premica (A 12 4 3) (E 12 4 3)) (premica (B 12 4 3) (C 12 4 3)) ∧
    mimobezni (premica (A 12 4 3) (E 12 4 3)) (premica (C 12 4 3) (D 12 4 3)) ∧
    mimobezni (premica (A 12 4 3) (E 12 4 3)) (premica (F 12 4 3) (G 12 4 3)) ∧
    mimobezni (premica (A 12 4 3) (E 12 4 3)) (premica (G 12 4 3) (H 12 4 3)) ∧
    sekajoci (premica (A 12 4 3) (E 12 4 3)) (premica (A 12 4 3) (B 12 4 3)) ∧
    sekajoci (premica (A 12 4 3) (E 12 4 3)) (premica (A 12 4 3) (D 12 4 3)) ∧
    sekajoci (premica (A 12 4 3) (E 12 4 3)) (premica (E 12 4 3) (F 12 4 3)) ∧
    sekajoci (premica (A 12 4 3) (E 12 4 3)) (premica (E 12 4 3) (H 12 4 3)) ∧
    vzporedni (premica (A 12 4 3) (E 12 4 3)) (premica (B 12 4 3) (F 12 4 3)) ∧
    vzporedni (premica (A 12 4 3) (E 12 4 3)) (premica (C 12 4 3) (G 12 4 3)) ∧
    vzporedni (premica (A 12 4 3) (E 12 4 3)) (premica (D 12 4 3) (H 12 4 3)) ∧
    F 12 4 3 - B 12 4 3 = E 12 4 3 - A 12 4 3 ∧ G 12 4 3 - C 12 4 3 = E 12 4 3 - A 12 4 3 ∧
    H 12 4 3 - D 12 4 3 = E 12 4 3 - A 12 4 3 := by
  have m0 : ∀ P : R3, ∀ Q, P ∈ premica P Q := fun P Q => ⟨0, by simp⟩
  have m1 : ∀ P : R3, ∀ Q, Q ∈ premica P Q := fun P Q => ⟨1, by simp⟩
  -- točka premice AE je (0, 0, 3t)
  have hAE : ∀ t : ℝ, A 12 4 3 + t • (E 12 4 3 - A 12 4 3) = T 0 0 (3 * t) := fun t => by
    apply ext3 <;> simp [A, E]; ring
  have vz : ∀ P Q : R3, ∀ n : R3, n ≠ 0 →
      (∀ t : ℝ, (P + t • (Q - P)) 0 ≠ 0 ∨ (P + t • (Q - P)) 1 ≠ 0) →
      premica (A 12 4 3) (E 12 4 3) ⊆ ravnina n 0 → premica P Q ⊆ ravnina n 0 →
      vzporedni (premica (A 12 4 3) (E 12 4 3)) (premica P Q) := by
    intro P Q n hn hi h1 h2
    refine ⟨Set.disjoint_left.2 ?_, n, 0, hn, h1, h2⟩
    rintro X ⟨t, rfl⟩ ⟨s, hs⟩
    rw [hAE] at hs
    rcases hi s with h | h
    · exact h (by rw [← hs]; simp)
    · exact h (by rw [← hs]; simp)
  refine ⟨mimobezni_of_det _ _ _ _ ?_, mimobezni_of_det _ _ _ _ ?_, mimobezni_of_det _ _ _ _ ?_,
    mimobezni_of_det _ _ _ _ ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_⟩
  all_goals try (norm_num [det3, A, B, C, D, E, F, G, H, T_sub]; done)
  · refine ⟨A 12 4 3, ⟨m0 _ _, m0 _ _⟩, ?_⟩
    rintro X ⟨⟨t, rfl⟩, ⟨s, hs⟩⟩
    rw [hAE] at hs ⊢
    have e2 := congrFun (congrArg (⇑) hs) 2
    simp [A, B] at e2
    apply ext3 <;> simp [A, e2]
  · refine ⟨A 12 4 3, ⟨m0 _ _, m0 _ _⟩, ?_⟩
    rintro X ⟨⟨t, rfl⟩, ⟨s, hs⟩⟩
    rw [hAE] at hs ⊢
    have e2 := congrFun (congrArg (⇑) hs) 2
    simp [A, D] at e2
    apply ext3 <;> simp [A, e2]
  · refine ⟨E 12 4 3, ⟨m1 _ _, m0 _ _⟩, ?_⟩
    rintro X ⟨⟨t, rfl⟩, ⟨s, hs⟩⟩
    rw [hAE] at hs ⊢
    have e2 := congrFun (congrArg (⇑) hs) 2
    simp [E, F] at e2
    apply ext3 <;> simp [E, e2]
  · refine ⟨E 12 4 3, ⟨m1 _ _, m0 _ _⟩, ?_⟩
    rintro X ⟨⟨t, rfl⟩, ⟨s, hs⟩⟩
    rw [hAE] at hs ⊢
    have e2 := congrFun (congrArg (⇑) hs) 2
    simp [E, H] at e2
    apply ext3 <;> simp [E, e2]
  · refine vz _ _ (T 0 1 0) ?_ ?_ ?_ ?_
    · intro h; have := congrFun (congrArg (⇑) h) 1; simp at this
    · intro t; left; simp [B, F]
    · rintro X ⟨t, rfl⟩; simp [ravnina, inner_k, A, E]
    · rintro X ⟨t, rfl⟩; simp [ravnina, inner_k, B, F]
  · refine vz _ _ (T 1 (-3) 0) ?_ ?_ ?_ ?_
    · intro h; have := congrFun (congrArg (⇑) h) 0; simp at this
    · intro t; left; simp [C, G]
    · rintro X ⟨t, rfl⟩; simp [ravnina, inner_k, A, E]
    · rintro X ⟨t, rfl⟩; simp [ravnina, inner_k, C, G]; norm_num
  · refine vz _ _ (T 1 0 0) ?_ ?_ ?_ ?_
    · intro h; have := congrFun (congrArg (⇑) h) 0; simp at this
    · intro t; right; simp [D, H]
    · rintro X ⟨t, rfl⟩; simp [ravnina, inner_k, A, E]
    · rintro X ⟨t, rfl⟩; simp [ravnina, inner_k, D, H]

/-- Naloga 2 b): projekcija AG na ABCD je AC = √(12² + 4²) = √160 ≈ 12,649 cm,
tan φ₁ = 3/√160 ≈ 0,2372.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#naloga2b
besedilo: »b) Projekcija oglišča $G$ na ravnino $ABCD$ je $C$, zato je projekcija diagonale $AG$ diagonala $AC = \sqrt{12^2 + 4^2} = \sqrt{160} \approx 12{,}649\,\mathrm{cm}$.« -/
theorem naloga2b :
    nozisce (G 12 4 3) (C 12 4 3) (T 0 0 1) 0 ∧ dist (A 12 4 3) (C 12 4 3) = √(12 ^ 2 + 4 ^ 2) ∧
    √(12 ^ 2 + 4 ^ 2 : ℝ) = √160 ∧ |√160 - 12.649| < 0.0005 ∧
    tan (∠ (C 12 4 3) (A 12 4 3) (G 12 4 3)) = 3 / √160 ∧ |3 / √160 - 0.2372| < 0.00005 ∧
    ∠ (C 12 4 3) (A 12 4 3) (G 12 4 3) = arctan (3 / √160) := by
  obtain ⟨hr, dAC, -, dGC, hk⟩ := kot_kvader 12 4 3 (by norm_num) (by norm_num)
  have s1 : (12.6491106 : ℝ) < √160 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have s2 : √160 < (12.6491107 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have e : √(12 ^ 2 + 4 ^ 2 : ℝ) = √160 := by norm_num
  refine ⟨by simpa [G, C] using nozisce_z 12 4 3, dAC, e, by rw [abs_lt]; constructor <;> linarith,
    ?_, ?_, by rw [hk, e]⟩
  · rw [tan_angle_of_angle_eq_pi_div_two hr, dGC, dAC, e]
  · rw [abs_lt]; constructor
    · rw [lt_sub_iff_add_lt, lt_div_iff₀ (by positivity)]; nlinarith
    · rw [sub_lt_iff_lt_add, div_lt_iff₀ (by positivity)]; nlinarith

/-- Naloga 2 b), RAČUN: φ₁ = arctan(3/√160) ≈ 13,342° ≈ 13,34°.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#naloga2b-kot
besedilo: »b) V pravokotnem trikotniku $ACG$ je $\tan\varphi_1 = \dfrac{3}{\sqrt{160}} \approx 0{,}2372$, zato $\varphi_1 \approx 13{,}342^\circ \approx 13{,}34^\circ$.« -/
theorem naloga2b_kot :
    |arctan (3 / √160) * 180 / π - 13.342| < 0.0005 ∧ |arctan (3 / √160) * 180 / π - 13.34| < 0.005 := by
  have s1 : (12.6491106 : ℝ) < √160 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have s2 : √160 < (12.6491107 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have h := arctan_stopinje (q := 3 / √160) (D := 13.342) (e := 0.0005) (q₁ := 3/12.6491107)
    (q₂ := 3/12.6491106) ((13.342 - 0.0005) * 3.141593 / 180) ((13.342 + 0.0005) * 3.141592 / 180)
    (by norm_num) le_rfl le_rfl (by norm_num) (by norm_num) (by norm_num)
    (div_le_div_of_nonneg_left (by norm_num) (by positivity) s2.le)
    (div_le_div_of_nonneg_left (by norm_num) (by norm_num) s1.le)
    (by norm_num) (by norm_num [cSp]) (by norm_num [cZg]) (by norm_num [sZg, cSp]) (by norm_num [sSp, cZg])
  refine ⟨h, ?_⟩
  rw [abs_lt] at h ⊢; constructor <;> linarith [h.1, h.2]

/-- Naloga 2 c): GF ⊥ FB in GF ⊥ FE (sekajoči se premici ravnine ABFE), zato je F projekcija G na ABFE
(y = 0); GF = BC = 4, AG = √(12² + 4² + 3²) = √169 = 13, sin φ₂ = 4/13 ≈ 0,3077,
φ₂ = ∠ F A G = arcsin(4/13).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#naloga2c
besedilo: »$AG = \sqrt{12^2 + 4^2 + 3^2} = \sqrt{169} = 13\,\mathrm{cm}$« -/
theorem naloga2c :
    inner ℝ (G 12 4 3 - F 12 4 3) (B 12 4 3 - F 12 4 3) = 0 ∧
    inner ℝ (G 12 4 3 - F 12 4 3) (E 12 4 3 - F 12 4 3) = 0 ∧
    nozisce (G 12 4 3) (F 12 4 3) (T 0 1 0) 0 ∧ dist (G 12 4 3) (F 12 4 3) = 4 ∧
    dist (G 12 4 3) (F 12 4 3) = dist (B 12 4 3) (C 12 4 3) ∧
    dist (A 12 4 3) (G 12 4 3) = √(12 ^ 2 + 4 ^ 2 + 3 ^ 2) ∧ √(12 ^ 2 + 4 ^ 2 + 3 ^ 2 : ℝ) = √169 ∧
    √169 = (13 : ℝ) ∧ sin (∠ (F 12 4 3) (A 12 4 3) (G 12 4 3)) = 4 / 13 ∧ |(4 : ℝ) / 13 - 0.3077| < 0.00005 ∧
    ∠ (F 12 4 3) (A 12 4 3) (G 12 4 3) = arcsin (4 / 13) := by
  have hr : ∠ (G 12 4 3) (F 12 4 3) (A 12 4 3) = π / 2 := by
    rw [EuclideanGeometry.angle, ← inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [vsub_eq_sub, G, F, A, T_sub, inner_k]
  have d169 : √169 = (13 : ℝ) := by rw [show (169 : ℝ) = 13 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have dGF : dist (G 12 4 3) (F 12 4 3) = 4 := by
    simp [G, F, dist_T]
  have dAG : dist (A 12 4 3) (G 12 4 3) = √(12 ^ 2 + 4 ^ 2 + 3 ^ 2) := by simp [A, G, dist_T]
  have hne : G 12 4 3 ≠ F 12 4 3 := by
    intro h; have := congrFun (congrArg (⇑) h) 1; simp [G, F] at this
  have hs := sin_angle_of_angle_eq_pi_div_two hr (Or.inl hne)
  rw [dGF, dist_comm, dAG, show (12 ^ 2 + 4 ^ 2 + 3 ^ 2 : ℝ) = 169 by norm_num, d169] at hs
  refine ⟨by simp [inner_k, G, F, B], by simp [inner_k, G, F, E], by simpa [G, F] using nozisce_y 12 4 3,
    dGF, by rw [dGF]; simp [B, C, dist_T],
    dAG, by norm_num, d169, hs, by rw [abs_lt]; norm_num, ?_⟩
  rw [← hs, arcsin_sin (by linarith [angle_nonneg (F 12 4 3) (A 12 4 3) (G 12 4 3), pi_pos])]
  exact angle_le_pi_div_two_of_angle_eq_pi_div_two hr

/-- Naloga 2 c), RAČUN: φ₂ = arcsin(4/13) ≈ 17,920° ≈ 17,92°.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#naloga2c-kot
besedilo: »c) $\sin\varphi_2 = \dfrac{4}{13} \approx 0{,}3077$, zato $\varphi_2 \approx 17{,}920^\circ \approx 17{,}92^\circ$.« -/
theorem naloga2c_kot :
    |arcsin (4 / 13) * 180 / π - 17.920| < 0.0005 ∧ |arcsin (4 / 13) * 180 / π - 17.92| < 0.005 := by
  have h := arcsin_stopinje (y := 4 / 13) (D := 17.920) (e := 0.0005) (y₁ := 4 / 13) (y₂ := 4 / 13)
    ((17.920 - 0.0005) * 3.141593 / 180) ((17.920 + 0.0005) * 3.141592 / 180)
    (by norm_num) le_rfl le_rfl (by norm_num) (by norm_num) (by norm_num) le_rfl le_rfl (by norm_num)
    (by norm_num [sZg]) (by norm_num [sSp])
  refine ⟨h, ?_⟩
  rw [abs_lt] at h ⊢; constructor <;> linarith [h.1, h.2]

/-! ## Za maturo, naloga 3 (višja raven): kocka z robom 4 -/

/-- Naloga 3 a): BD ⊥ AC (diagonali kvadrata), BD ⊥ AE, zato je BD pravokotna na vsak vektor ravnine
ACGE (x = y), torej na celo ravnino; A, C, G, E ležijo v tej ravnini.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#naloga3a
besedilo: »c) Robovi $AB$, $AD$, $EF$ in $EH$ so pravokotni na $AE$, zato so $B$, $D$, $F$ in $H$ od premice $AE$ oddaljeni $4\,\mathrm{cm}$. Oglišči $C$ in $G$ sta oddaljeni $4\sqrt{2}\,\mathrm{cm}$, $A$ in $E$ pa ležita na osi. V množici so oglišča $B$, $D$, $F$, $H$.« -/
theorem naloga3a :
    inner ℝ (D 4 4 4 - B 4 4 4) (C 4 4 4 - A 4 4 4) = 0 ∧
    inner ℝ (D 4 4 4 - B 4 4 4) (E 4 4 4 - A 4 4 4) = 0 ∧
    A 4 4 4 ∈ ravnina (T 1 (-1) 0) 0 ∧ C 4 4 4 ∈ ravnina (T 1 (-1) 0) 0 ∧
    G 4 4 4 ∈ ravnina (T 1 (-1) 0) 0 ∧ E 4 4 4 ∈ ravnina (T 1 (-1) 0) 0 ∧
    ∀ U ∈ ravnina (T 1 (-1) 0) 0, ∀ W ∈ ravnina (T 1 (-1) 0) 0,
      inner ℝ (D 4 4 4 - B 4 4 4) (U - W) = 0 := by
  refine ⟨by simp [inner_k, D, B, C, A], by simp [inner_k, D, B, E, A], by simp [ravnina, inner_k, A],
    by simp [ravnina, inner_k, C], by simp [ravnina, inner_k, G], by simp [ravnina, inner_k, E], ?_⟩
  intro U hU W hW
  simp only [ravnina, Set.mem_ofPred_eq, inner_k, T_0, T_1, T_2] at hU hW
  simp only [inner_k, D, B, T_sub, PiLp.sub_apply, T_0, T_1, T_2]
  linarith

/-- Naloga 3 b): točke, enako oddaljene od B in D, so ravnina ACGE (x = y); od A in C ravnina BDHF
(x + y = 4); od vseh štirih oglišč A, B, C, D natanko premica x = y = 2 skozi S = (2,2,0) in središče
zgornje ploskve (2,2,4), pravokotna na ABCD. Za X na njej je XA² = XS² + SA².
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#naloga3b
besedilo: »Odgovor: b) premica skozi $S$, pravokotna na ravnino $ABCD$ (skozi središči osnovne in zgornje ploskve); c) valjasta ploskev z osjo $AE$ in polmerom $4\,\mathrm{cm}$, na njej so $B$, $D$, $F$, $H$; d) $\varphi = 30^\circ$.« -/
theorem naloga3b :
    (∀ X : R3, dist X (B 4 4 4) = dist X (D 4 4 4) ↔ X ∈ ravnina (T 1 (-1) 0) 0) ∧
    (∀ X : R3, dist X (A 4 4 4) = dist X (C 4 4 4) ↔ X ∈ ravnina (T 1 1 0) 4) ∧
    {X : R3 | dist X (A 4 4 4) = dist X (B 4 4 4) ∧ dist X (A 4 4 4) = dist X (C 4 4 4) ∧
      dist X (A 4 4 4) = dist X (D 4 4 4)} = {X | X 0 = 2 ∧ X 1 = 2} ∧
    (∀ X : R3, X 0 = 2 → X 1 = 2 →
      dist X (A 4 4 4) ^ 2 = dist X (T 2 2 0) ^ 2 + dist (T 2 2 0) (A 4 4 4) ^ 2) := by
  have hq : ∀ X Y Z : R3, dist X Y = dist X Z ↔ dist X Y ^ 2 = dist X Z ^ 2 :=
    fun X Y Z => (sq_eq_sq₀ dist_nonneg dist_nonneg).symm
  refine ⟨fun X => ?_, fun X => ?_, ?_, fun X h0 h1 => ?_⟩
  · rw [hq, dist_sq_k, dist_sq_k]
    simp only [ravnina, Set.mem_ofPred_eq, inner_k, B, D, T_0, T_1, T_2]
    constructor <;> intro h <;> nlinarith
  · rw [hq, dist_sq_k, dist_sq_k]
    simp only [ravnina, Set.mem_ofPred_eq, inner_k, A, C, T_0, T_1, T_2]
    constructor <;> intro h <;> nlinarith
  · ext X
    simp only [Set.mem_ofPred_eq, hq, dist_sq_k, A, B, C, D, T_0, T_1, T_2]
    constructor
    · rintro ⟨h1, h2, h3⟩; constructor <;> nlinarith
    · rintro ⟨h1, h2⟩; rw [h1, h2]; refine ⟨by ring, by ring, by ring⟩
  · rw [dist_sq_k, dist_sq_k, dist_sq_k]; simp [A, h0, h1]; ring

/-- Naloga 3 c): razdalja točke X od premice AE je √(x² + y²) (Mathlib `Metric.infDist`); množica točk na
razdalji 4 je valjasta ploskev x² + y² = 16 z osjo AE.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#razdalja-od-ae
besedilo: »c) Točke na razdalji $4\,\mathrm{cm}$ od premice $AE$ tvorijo valjasto ploskev z osjo $AE$ in polmerom $4\,\mathrm{cm}$.« -/
theorem razdalja_od_AE (X : R3) :
    Metric.infDist X (premica (A 4 4 4) (E 4 4 4)) = √(X 0 ^ 2 + X 1 ^ 2) := by
  apply le_antisymm
  · have hm : T 0 0 (X 2) ∈ premica (A 4 4 4) (E 4 4 4) :=
      ⟨X 2 / 4, ext3 (by simp [A, E]) (by simp [A, E]) (by simp [A, E])⟩
    refine (Metric.infDist_le_dist_of_mem hm).trans (le_of_eq ?_)
    rw [dist_k]; simp
  · rw [Metric.le_infDist (show (premica (A 4 4 4) (E 4 4 4)).Nonempty from ⟨A 4 4 4, 0, by simp⟩)]
    rintro Y ⟨t, rfl⟩
    rw [dist_k]
    apply Real.sqrt_le_sqrt
    simp [A, E]
    nlinarith [sq_nonneg (X 2 - t * 4)]

/-- Naloga 3 c): valjasta ploskev: razdalja 4 od AE ⇔ x² + y² = 16; oglišča B, D, F, H so od AE
oddaljena 4 cm, C in G 4√2 cm, A in E ležita na osi (razdalja 0).
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#naloga3c
besedilo: »c) Robovi $AB$, $AD$, $EF$ in $EH$ so pravokotni na $AE$, zato so $B$, $D$, $F$ in $H$ od premice $AE$ oddaljeni $4\,\mathrm{cm}$. Oglišči $C$ in $G$ sta oddaljeni $4\sqrt{2}\,\mathrm{cm}$, $A$ in $E$ pa ležita na osi. V množici so oglišča $B$, $D$, $F$, $H$.« -/
theorem naloga3c :
    (∀ X : R3, Metric.infDist X (premica (A 4 4 4) (E 4 4 4)) = 4 ↔ X 0 ^ 2 + X 1 ^ 2 = 16) ∧
    Metric.infDist (B 4 4 4) (premica (A 4 4 4) (E 4 4 4)) = 4 ∧
    Metric.infDist (D 4 4 4) (premica (A 4 4 4) (E 4 4 4)) = 4 ∧
    Metric.infDist (F 4 4 4) (premica (A 4 4 4) (E 4 4 4)) = 4 ∧
    Metric.infDist (H 4 4 4) (premica (A 4 4 4) (E 4 4 4)) = 4 ∧
    Metric.infDist (C 4 4 4) (premica (A 4 4 4) (E 4 4 4)) = 4 * √2 ∧
    Metric.infDist (G 4 4 4) (premica (A 4 4 4) (E 4 4 4)) = 4 * √2 ∧
    Metric.infDist (A 4 4 4) (premica (A 4 4 4) (E 4 4 4)) = 0 ∧
    Metric.infDist (E 4 4 4) (premica (A 4 4 4) (E 4 4 4)) = 0 := by
  have h4 : √(16 : ℝ) = 4 := by rw [show (16 : ℝ) = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have h42 : √(32 : ℝ) = 4 * √2 := by
    rw [show (32 : ℝ) = 4 ^ 2 * 2 by norm_num, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  refine ⟨fun X => ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_⟩ <;> rw [razdalja_od_AE]
  · constructor
    · intro h
      have := Real.sq_sqrt (show 0 ≤ X 0 ^ 2 + X 1 ^ 2 by positivity)
      rw [h] at this; linarith
    · intro h; rw [h, h4]
  all_goals norm_num [A, B, C, D, E, F, G, H, h4, h42]

/-- Naloga 3 d): po a) je S = (2,2,0) projekcija B na ACGE, G leži v ACGE, zato je projekcija BG daljica SG;
BS = ½·4√2 = 2√2, BG = 4√2, sin φ = 2√2/(4√2) = 1/2, φ = ∠ S G B = 30°.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#naloga3d
besedilo: »d) $\sin\varphi = \dfrac{BS}{BG} = \dfrac{2\sqrt{2}}{4\sqrt{2}} = \dfrac{1}{2}$, zato $\varphi = 30^\circ$.« -/
theorem naloga3d :
    nozisce (B 4 4 4) (T 2 2 0) (T 1 (-1) 0) 0 ∧ G 4 4 4 ∈ ravnina (T 1 (-1) 0) 0 ∧
    dist (B 4 4 4) (T 2 2 0) = 1 / 2 * (4 * √2) ∧ 1 / 2 * (4 * √2) = 2 * √2 ∧
    dist (B 4 4 4) (G 4 4 4) = 4 * √2 ∧
    sin (∠ (T 2 2 0) (G 4 4 4) (B 4 4 4)) = 2 * √2 / (4 * √2) ∧ 2 * √2 / (4 * √2) = 1 / 2 ∧
    ∠ (T 2 2 0) (G 4 4 4) (B 4 4 4) = π / 6 := by
  have hr : ∠ (B 4 4 4) (T 2 2 0) (G 4 4 4) = π / 2 := by
    rw [EuclideanGeometry.angle, ← inner_eq_zero_iff_angle_eq_pi_div_two]
    simp [vsub_eq_sub, B, G, T_sub, inner_k]; norm_num
  have dBS : dist (B 4 4 4) (T 2 2 0) = 2 * √2 := by
    rw [B, dist_T, show ((4:ℝ) - 2) ^ 2 + (0 - 2) ^ 2 + (0 - 0) ^ 2 = 2 ^ 2 * 2 by norm_num,
      Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  have dBG : dist (B 4 4 4) (G 4 4 4) = 4 * √2 := by
    rw [B, G, dist_T, show ((4:ℝ) - 4) ^ 2 + (0 - 4) ^ 2 + (0 - 4) ^ 2 = 4 ^ 2 * 2 by norm_num,
      Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]
  have hne : B 4 4 4 ≠ T 2 2 0 := by
    intro h; have := congrFun (congrArg (⇑) h) 0; norm_num [B] at this
  have hs := sin_angle_of_angle_eq_pi_div_two hr (Or.inl hne)
  rw [dBS, dBG] at hs
  have h12 : 2 * √2 / (4 * √2) = 1 / 2 := by field_simp; ring
  have hx := (nozisce_xy 4 0 0)
  norm_num at hx
  refine ⟨by simpa [B] using hx, by simp [ravnina, inner_k, G], by rw [dBS]; ring, by ring, dBG, hs, h12, ?_⟩
  have h1 := angle_le_pi_div_two_of_angle_eq_pi_div_two hr
  have h0 := angle_nonneg (T 2 2 0) (G 4 4 4) (B 4 4 4)
  rw [← arcsin_sin (x := ∠ (T 2 2 0) (G 4 4 4) (B 4 4 4)) (by linarith [pi_pos]) h1, hs, h12,
    ← sin_pi_div_six, arcsin_sin (by linarith [pi_pos]) (by linarith [pi_pos])]

/-- RAČUN (naloga 3 d): 4√2/2 = 2√2 in arcsin(2√2/(4√2)) · 180/π = 30; (primer 3) arcsin(8/16) · 180/π = 30.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#racun-30
besedilo: »d) $\sin\varphi = \dfrac{BS}{BG} = \dfrac{2\sqrt{2}}{4\sqrt{2}} = \dfrac{1}{2}$, zato $\varphi = 30^\circ$.« -/
theorem racun_30 : 4 * √2 / 2 = 2 * √2 ∧ arcsin (2 * √2 / (4 * √2)) * 180 / π = 30 ∧
    arcsin (8 / 16) * 180 / π = 30 := by
  have h12 : 2 * √2 / (4 * √2) = 1 / 2 := by field_simp; ring
  have hp : arcsin (1 / 2) = π / 6 := by
    rw [← sin_pi_div_six, arcsin_sin (by linarith [pi_pos]) (by linarith [pi_pos])]
  refine ⟨by ring, ?_, ?_⟩
  · rw [h12, hp]; field_simp; ring
  · rw [show (8 : ℝ) / 16 = 1 / 2 by norm_num, hp]; field_simp; ring

/-- RAČUN: 16 cos 30° ≈ 13,86, arctan(10/10) · 180/π = 45, √(3² + 4²) = 5, √(6² + 8²) = 10,
√(12² + 4² + 3²) = 13, 4/13 ≈ 0,3077, 6√2 ≈ 8,49, 6√3 ≈ 10,39.
trditev: MAT-SS-3/premice-in-ravnine-v-prostoru#racun-ostalo
besedilo: »$p = 16 \cos 30^\circ \approx 13{,}86\,\mathrm{mm}$« -/
theorem racun_ostalo :
    |16 * cos (30 * π / 180) - 13.86| < 0.005 ∧ arctan (10 / 10) * 180 / π = 45 ∧
    √(3 ^ 2 + 4 ^ 2 : ℝ) = 5 ∧ √(6 ^ 2 + 8 ^ 2 : ℝ) = 10 ∧ √(12 ^ 2 + 4 ^ 2 + 3 ^ 2 : ℝ) = 13 ∧
    |(4 : ℝ) / 13 - 0.3077| < 0.00005 ∧ |6 * √2 - 8.49| < 0.005 ∧ |6 * √3 - 10.39| < 0.005 := by
  obtain ⟨s1, s2⟩ := sqrt2_meje
  obtain ⟨t1, t2⟩ := sqrt3_meje
  have sq : ∀ x : ℝ, 0 ≤ x → √(x ^ 2) = x := fun x hx => Real.sqrt_sq hx
  refine ⟨?_, ?_, ?_, ?_, ?_, by rw [abs_lt]; norm_num, by rw [abs_lt]; constructor <;> linarith,
    by rw [abs_lt]; constructor <;> linarith⟩
  · rw [show (30 : ℝ) * π / 180 = π / 6 by ring, cos_pi_div_six, abs_lt]; constructor <;> linarith
  · rw [div_self (by norm_num), arctan_one]; field_simp; ring
  · rw [show (3 ^ 2 + 4 ^ 2 : ℝ) = 5 ^ 2 by norm_num, sq 5 (by norm_num)]
  · rw [show (6 ^ 2 + 8 ^ 2 : ℝ) = 10 ^ 2 by norm_num, sq 10 (by norm_num)]
  · rw [show (12 ^ 2 + 4 ^ 2 + 3 ^ 2 : ℝ) = 13 ^ 2 by norm_num, sq 13 (by norm_num)]

end Evklid.Lekcije.MAT_SS_3.PremiceInRavnineVProstoru
