/-
vir: content/lessons/MAT-OS-7/znacilne-tocke-trikotnika.md
sha256: 11e62d3e2684dfa96b8ad0b9374c06f20909577f350e7cebca27374de6383148
Ni v Leanu: zgodovina (Arhimed, Evklid), zgodbe (deska, helikopterska baza, park) in fizikalna trditev
»v težišču je plošča v ravnovesju«; risbe, simulacija in načrtovanje s šestilom (Preveri se 4 in 5, koraki
1–5 v »Korak za korakom«: risanje in merjenje) kot slike oziroma postopek. Simetrale kotov, središče S
in včrtana krožnica (S enako oddaljena od stranic, S vedno znotraj, krožnica s polmerom |SA| seka
stranice, polmer r je razdalja do dotikališča, v enakostraničnem trikotniku S sovpada s T, v enakokrakem
leži S na osi simetrije): zahtevno, še ni dokazano. Lega O in V znotraj/zunaj
(ostrokotni: znotraj; topokotni: zunaj, O onkraj stranice c, V za ogliščem C; Primer 2, koraka 4–5,
Preveri se 3): zahtevno, še ni dokazano. Obstoj presečišča višin (da se nosilki dveh višin sploh sekata)
ni dokazan; dokazano je, da gre tretja nosilka skozi vsako skupno točko prvih dveh. Enoličnost V = C pri
pravokotnem trikotniku ni dokazana (dokazano je, da C leži na vseh treh nosilkah). Pri pravokotnem
trikotniku »simetrala vsake katete je vzporedna drugi kateti in razpolovi hipotenuzo« ni dokazano kot
geometrijska trditev (zahtevno, še ni dokazano); dokazano je, da je razpolovišče hipotenuze O in R = c/2.
Preveri se 1 in »točke so v splošnem različne«: za T in V dokazano na protiprimeru (`tocke_razlicne`), za S ni
(S ni formaliziran); dokazano je tudi, da je točka na simetrali stranice natanko tedaj, ko je enako
oddaljena od krajišč.
Model: točke so vektorji v realnem prostoru s skalarnim produktom V (ravnina je poseben primer), primeri
izpolnljivosti so v ℂ. Razpolovišče je (1/2)•(B + C) (= `midpoint`), težišče (1/3)•(A + B + C). Višina iz A
leži na premici skozi A, pravokotni na BC: točka X je na njej, ko ⟪X − A, B − C⟫ = 0. »T je znotraj« je
dokazano kot T = α·A + β·B + γ·C s pozitivnimi α, β, γ z vsoto 1. Kot ∠ je Mathlibov `EuclideanGeometry.angle`
v radianih (90° = π/2); stopinje v primerih so računane kot števila. Središče očrtane krožnice je
`Affine.Simplex.circumcenter`. Dolžine (cm, km) so števila v ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.ZnacilneTockeTrikotnika

open EuclideanGeometry Complex Real
open scoped InnerProductSpace

/-- Pomožna trditev za primere: √a = b, če je b ≥ 0 in a = b².
pomozno -/
theorem koren (a b : ℝ) (hb : 0 ≤ b) (h : a = b ^ 2) : √a = b := by
  rw [h, Real.sqrt_sq hb]

/-- Pomožna trditev za priče izpolnljivosti: oglišča 4, 2i, 0 v ℂ niso kolinearna.
pomozno -/
theorem oglisca_4_2i_0 : AffineIndependent ℝ ![(4 : ℂ), 2 * I, 0] := by
  rw [affineIndependent_iff_linearIndependent_vsub ℝ _ (2 : Fin 3), Fintype.linearIndependent_iff]
  intro g hg i
  have e : (Finset.univ : Finset {x : Fin 3 // x ≠ 2}) = {⟨0, by decide⟩, ⟨1, by decide⟩} := by
    decide
  rw [e, Finset.sum_pair (by decide)] at hg
  have hre := congrArg Complex.re hg
  have him := congrArg Complex.im hg
  simp at hre him
  obtain ⟨i, hi⟩ := i
  fin_cases i
  · simpa using hre
  · simpa using him
  · exact absurd rfl hi

section Vektorji

variable {V : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V]

/-! ## Težiščnice in težišče -/

/-- Razlaga (težiščnice): razpolovišče stranice BC je (1/2)·(B + C).
pomozno – zapis razpolovišča v modelu (midpoint = ½·(B + C)), orodje za ostale izreke -/
theorem razpolovisce (B C : V) : midpoint ℝ B C = (1 / 2 : ℝ) • (B + C) := by
  rw [midpoint_eq_smul_add, invOf_eq_inv, one_div]

/-- Razlaga (težiščnice) in Povzetek: težišče T = (A + B + C)/3 leži na vseh treh težiščnicah: na vsaki
je na dveh tretjinah od oglišča proti razpolovišču nasprotne stranice (težiščnice se sekajo v T).
trditev: MAT-OS-7/znacilne-tocke-trikotnika#tezisce-na-tezisnicah
besedilo: »Vse tri se sekajo v **težišču** $T$« -/
theorem tezisce_na_tezisnicah (A B C : V) :
    (1 / 3 : ℝ) • (A + B + C) = A + (2 / 3 : ℝ) • ((1 / 2 : ℝ) • (B + C) - A) ∧
      (1 / 3 : ℝ) • (A + B + C) = B + (2 / 3 : ℝ) • ((1 / 2 : ℝ) • (A + C) - B) ∧
      (1 / 3 : ℝ) • (A + B + C) = C + (2 / 3 : ℝ) • ((1 / 2 : ℝ) • (A + B) - C) := by
  refine ⟨by module, by module, by module⟩

/-- Razlaga (težiščnice), Povzetek in Primer 1 (formula): težišče deli težiščnico v razmerju 2 : 1 od
oglišča: |AT| = (2/3)·t_a in |TA₁| = (1/3)·t_a, kjer je A₁ razpolovišče BC in t_a = |AA₁|.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#tezisce-deli
besedilo: »Deli jo v razmerju $2 : 1$, merjeno od oglišča.« -/
theorem tezisce_deli (A B C : V) :
    ‖(1 / 3 : ℝ) • (A + B + C) - A‖ = 2 / 3 * ‖(1 / 2 : ℝ) • (B + C) - A‖ ∧
      ‖(1 / 2 : ℝ) • (B + C) - (1 / 3 : ℝ) • (A + B + C)‖ = 1 / 3 * ‖(1 / 2 : ℝ) • (B + C) - A‖ := by
  have e1 : (1 / 3 : ℝ) • (A + B + C) - A = (2 / 3 : ℝ) • ((1 / 2 : ℝ) • (B + C) - A) := by module
  have e2 : (1 / 2 : ℝ) • (B + C) - (1 / 3 : ℝ) • (A + B + C) =
      (1 / 3 : ℝ) • ((1 / 2 : ℝ) • (B + C) - A) := by module
  rw [e1, e2, norm_smul, norm_smul, Real.norm_eq_abs, Real.norm_eq_abs,
    abs_of_pos (by norm_num : (0 : ℝ) < 2 / 3), abs_of_pos (by norm_num : (0 : ℝ) < 1 / 3)]
  exact ⟨rfl, rfl⟩

/-- Razlaga (kje ležijo točke) in Povzetek: težišče je vedno znotraj trikotnika: T = α·A + β·B + γ·C
s pozitivnimi α, β, γ (α = β = γ = 1/3) in α + β + γ = 1.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#tezisce-znotraj
besedilo: »| težišče $T$ | znotraj | znotraj | znotraj |« -/
theorem tezisce_znotraj (A B C : V) :
    ∃ α β γ : ℝ, 0 < α ∧ 0 < β ∧ 0 < γ ∧ α + β + γ = 1 ∧
      (1 / 3 : ℝ) • (A + B + C) = α • A + β • B + γ • C :=
  ⟨1 / 3, 1 / 3, 1 / 3, by norm_num, by norm_num, by norm_num, by norm_num, by module⟩

/-- Pomožna trditev (dolžina do težišča): 9·|TA|² = 2·|AB|² + 2·|AC|² − |BC|².
pomozno -/
theorem tezisce_razdalja_sq (A B C : V) :
    9 * ‖(1 / 3 : ℝ) • (A + B + C) - A‖ ^ 2 = 2 * ‖B - A‖ ^ 2 + 2 * ‖C - A‖ ^ 2 - ‖B - C‖ ^ 2 := by
  have e : (1 / 3 : ℝ) • (A + B + C) - A = (1 / 3 : ℝ) • ((B - A) + (C - A)) := by module
  have e2 : B - C = (B - A) - (C - A) := by abel
  have h1 := norm_add_sq_real (B - A) (C - A)
  have h2 := norm_sub_sq_real (B - A) (C - A)
  rw [e, e2, norm_smul, mul_pow, h1, h2, Real.norm_eq_abs,
    abs_of_pos (by norm_num : (0 : ℝ) < 1 / 3)]
  ring

/-! ## Simetrale stranic in očrtana krožnica -/

/-- Razlaga (simetrale stranic): simetrala daljice AB gre skozi njeno razpolovišče in je pravokotna na AB
(X je na njej natanko, ko je X − razpolovišče pravokoten na B − A).
trditev: MAT-OS-7/znacilne-tocke-trikotnika#simetrala-def
besedilo: »Simetrala daljice je premica, ki je na daljico pravokotna in gre skozi njeno sredino.« -/
theorem simetrala_def (A B X : V) :
    midpoint ℝ A B ∈ AffineSubspace.perpBisector A B ∧
      (X ∈ AffineSubspace.perpBisector A B ↔ ⟪X - midpoint ℝ A B, B - A⟫_ℝ = 0) :=
  ⟨AffineSubspace.midpoint_mem_perpBisector A B, AffineSubspace.mem_perpBisector_iff_inner_eq_zero⟩

/-- Razlaga (simetrale stranic) in Preveri se 1: točka je na simetrali daljice AB natanko tedaj, ko je
enako oddaljena od krajišč A in B.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#simetrala-enako-dalec
besedilo: »Vsaka njena točka je enako oddaljena od obeh krajišč.« -/
theorem simetrala_enako_dalec (A B X : V) :
    X ∈ AffineSubspace.perpBisector A B ↔ dist X A = dist X B :=
  AffineSubspace.mem_perpBisector_iff_dist_eq

/-- Razlaga (simetrale stranic) in Povzetek: če je O na simetralah stranic AB in BC, je tudi na simetrali
AC (simetrale se sekajo v eni točki) in |OA| = |OB| = |OC|.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#simetrale-sekajo
besedilo: »Simetrale vseh treh stranic se sekajo v točki $O$, ki je zato enako oddaljena od vseh treh oglišč:« -/
theorem simetrale_sekajo (A B C O : V) (h1 : O ∈ AffineSubspace.perpBisector A B)
    (h2 : O ∈ AffineSubspace.perpBisector B C) :
    O ∈ AffineSubspace.perpBisector A C ∧ dist O A = dist O B ∧ dist O B = dist O C := by
  rw [AffineSubspace.mem_perpBisector_iff_dist_eq] at h1 h2 ⊢
  exact ⟨h1.trans h2, h1, h2⟩

/-- Predpostavke trditve `simetrale_sekajo` se dajo izpolniti (A = 1, B = −1, C = i, O = 0 v ℂ). -/
example := simetrale_sekajo (V := ℂ) 1 (-1) I 0
  (by rw [AffineSubspace.mem_perpBisector_iff_dist_eq]; simp [Complex.dist_eq])
  (by rw [AffineSubspace.mem_perpBisector_iff_dist_eq]; simp [Complex.dist_eq])

/-! ## Višine -/

/-- Razlaga (višine) in Povzetek: če točka X leži na nosilkah višin iz A in iz B (⟪X − A, B − C⟫ = 0 in
⟪X − B, C − A⟫ = 0), leži tudi na nosilki višine iz C; zato se nosilke višin sekajo v eni točki V.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#visine-sekajo
besedilo: »Premice, na katerih ležijo višine (nosilke višin), se sekajo v eni točki.« -/
theorem visine_sekajo (A B C X : V) (ha : ⟪X - A, B - C⟫_ℝ = 0) (hb : ⟪X - B, C - A⟫_ℝ = 0) :
    ⟪X - C, A - B⟫_ℝ = 0 := by
  simp only [inner_sub_left, inner_sub_right] at ha hb ⊢
  linarith [real_inner_comm A B, real_inner_comm B C, real_inner_comm A C, real_inner_comm X A,
    real_inner_comm X B, real_inner_comm X C]

/-- Predpostavke trditve `visine_sekajo` se dajo izpolniti (A = 1, B = −1, C = i, X = i v ℂ). -/
example := visine_sekajo (V := ℂ) 1 (-1) I I (by simp [Complex.inner]) (by simp [Complex.inner])

/-! ## Pravokotni trikotnik -/

/-- Razlaga (pravokotni trikotnik), Povzetek in Primer 3: pri pravem kotu pri C (⟪A − C, B − C⟫ = 0) je
razpolovišče C₁ hipotenuze AB enako oddaljeno od A, B in C, oddaljenost je c/2. Da je zato O = C₁ in
R = c/2, dokazuje `pravokotni_O_sredisce`.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#pravokotni-razpolovisce
besedilo: »Toliko je baza oddaljena od $A$, $B$ in tudi od $C$.« -/
theorem pravokotni_O (A B C : V) (h : ⟪A - C, B - C⟫_ℝ = 0) :
    ‖A - (1 / 2 : ℝ) • (A + B)‖ = ‖A - B‖ / 2 ∧ ‖B - (1 / 2 : ℝ) • (A + B)‖ = ‖A - B‖ / 2 ∧
      ‖C - (1 / 2 : ℝ) • (A + B)‖ = ‖A - B‖ / 2 := by
  have half : ‖(1 / 2 : ℝ)‖ = 1 / 2 := by
    rw [Real.norm_eq_abs, abs_of_pos (by norm_num : (0 : ℝ) < 1 / 2)]
  refine ⟨?_, ?_, ?_⟩
  · rw [show A - (1 / 2 : ℝ) • (A + B) = (1 / 2 : ℝ) • (A - B) by module, norm_smul, half]; ring
  · rw [show B - (1 / 2 : ℝ) • (A + B) = (1 / 2 : ℝ) • (B - A) by module, norm_smul, half,
      norm_sub_rev]; ring
  · have hn : ‖(A - C) + (B - C)‖ = ‖A - B‖ := by
      have e : A - B = (A - C) - (B - C) := by abel
      rw [e]
      have h1 := norm_add_sq_real (A - C) (B - C)
      have h2 := norm_sub_sq_real (A - C) (B - C)
      rw [h] at h1 h2
      exact (pow_left_inj₀ (norm_nonneg _) (norm_nonneg _) two_ne_zero).mp (by rw [h1, h2]; ring)
    rw [show C - (1 / 2 : ℝ) • (A + B) = (-(1 / 2) : ℝ) • ((A - C) + (B - C)) by module, norm_smul,
      norm_neg, half, hn]
    ring

/-- Predpostavka trditve `pravokotni_O` se da izpolniti (A = 1, B = −1, C = i v ℂ). -/
example := pravokotni_O (V := ℂ) 1 (-1) I (by simp [Complex.inner])

/-- Razlaga (pravokotni trikotnik), Povzetek in Primer 3: pri pravem kotu pri C je vsaka kateta višina na
drugo; C leži na vseh treh nosilkah višin.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#pravokotni-v
besedilo: »Vsaka kateta je višina na drugo kateto, zato se višine sekajo v oglišču pravega kota.« -/
theorem pravokotni_V (A B C : V) (h : ⟪A - C, B - C⟫_ℝ = 0) :
    ⟪C - A, B - C⟫_ℝ = 0 ∧ ⟪C - B, C - A⟫_ℝ = 0 ∧ ⟪C - C, A - B⟫_ℝ = 0 := by
  have e1 : C - A = -(A - C) := (neg_sub A C).symm
  have e2 : C - B = -(B - C) := (neg_sub B C).symm
  refine ⟨?_, ?_, ?_⟩
  · rw [e1, inner_neg_left, h, neg_zero]
  · rw [e1, e2, inner_neg_left, inner_neg_right, neg_neg, real_inner_comm, h]
  · rw [sub_self, inner_zero_left]

/-! ## Enakokraki in enakostranični trikotnik -/

/-- Predpostavka trditve `pravokotni_V` se da izpolniti (A = 1, B = −1, C = i v ℂ). -/
example := pravokotni_V (V := ℂ) 1 (-1) I (by simp [Complex.inner])

/-- Razlaga (posebni trikotniki) in Pogoste napake 1: težiščnica iz C je pravokotna na AB (je hkrati
višina) natanko tedaj, ko je |CA| = |CB| (enakokraki trikotnik z osnovnico AB).
trditev: MAT-OS-7/znacilne-tocke-trikotnika#tezisnica-je-visina
besedilo: »Sovpadata le, kadar ju narišemo na osnovnico enakokrakega trikotnika, in v enakostraničnem trikotniku.« -/
theorem tezisnica_je_visina (A B C : V) :
    ⟪(1 / 2 : ℝ) • (A + B) - C, A - B⟫_ℝ = 0 ↔ ‖A - C‖ = ‖B - C‖ := by
  rw [show (1 / 2 : ℝ) • (A + B) - C = (1 / 2 : ℝ) • ((A - C) + (B - C)) by module,
    show A - B = (A - C) - (B - C) by abel, real_inner_smul_left, mul_eq_zero,
    or_iff_right (by norm_num : (1 / 2 : ℝ) ≠ 0), real_inner_add_sub_eq_zero_iff]

/-- Razlaga (posebni trikotniki): v enakokrakem trikotniku (|CA| = |CB|) ležita C in razpolovišče AB na
simetrali stranice AB; ta premica je tudi nosilka višine in težiščnice iz C. Da ležijo na njej tudi T, V
in O, dokazuje `enakokraki_tocke`.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#enakokraki
besedilo: »V enakokrakem trikotniku to velja za višino na osnovnico« -/
theorem enakokraki (A B C : V) (h : ‖A - C‖ = ‖B - C‖) :
    C ∈ AffineSubspace.perpBisector A B ∧ midpoint ℝ A B ∈ AffineSubspace.perpBisector A B ∧
      ⟪(1 / 2 : ℝ) • (A + B) - C, A - B⟫_ℝ = 0 := by
  refine ⟨?_, AffineSubspace.midpoint_mem_perpBisector A B, (tezisnica_je_visina A B C).mpr h⟩
  rw [AffineSubspace.mem_perpBisector_iff_dist_eq, dist_eq_norm, dist_eq_norm, norm_sub_rev,
    norm_sub_rev C B, h]

/-- Predpostavka trditve `enakokraki` se da izpolniti (A = 1, B = −1, C = i v ℂ). -/
example := enakokraki (V := ℂ) 1 (-1) I (by
  rw [← norm_neg ((-1 : ℂ) - I)]
  ring_nf
  rw [← Complex.norm_conj]
  simp)

/-- Razlaga (posebni trikotniki): v enakokrakem trikotniku (|CA| = |CB|) ležijo na simetrali osnovnice AB
(osi simetrije) težišče T in vsaka točka X na nosilkah višin iz A in B (višinska točka V); središče O
očrtane krožnice leži na njej po `ocrtana`.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#enakokraki-tocke
besedilo: »ležijo na njeni nosilki, ki je os simetrije.« -/
theorem enakokraki_tocke (A B C X : V) (h : ‖A - C‖ = ‖B - C‖) (ha : ⟪X - A, B - C⟫_ℝ = 0)
    (hb : ⟪X - B, C - A⟫_ℝ = 0) :
    (1 / 3 : ℝ) • (A + B + C) ∈ AffineSubspace.perpBisector A B ∧
      X ∈ AffineSubspace.perpBisector A B := by
  constructor
  · rw [AffineSubspace.mem_perpBisector_iff_dist_eq, dist_eq_norm, dist_eq_norm]
    have dA := tezisce_razdalja_sq A B C
    have dB := tezisce_razdalja_sq B A C
    rw [show B + A + C = A + B + C by abel] at dB
    have e1 : ‖B - A‖ = ‖A - B‖ := norm_sub_rev _ _
    have e2 : ‖C - A‖ = ‖A - C‖ := norm_sub_rev _ _
    have e3 : ‖C - B‖ = ‖B - C‖ := norm_sub_rev _ _
    have e4 : ‖A - C‖ = ‖B - C‖ := h
    rw [e1, e2] at dA
    rw [e3] at dB
    rw [e4] at dA dB
    exact (pow_left_inj₀ (norm_nonneg _) (norm_nonneg _) two_ne_zero).mp (by linarith)
  · have hc := visine_sekajo A B C X ha hb
    have hC := (enakokraki A B C h).1
    rw [AffineSubspace.mem_perpBisector_iff_inner_eq_zero] at hC ⊢
    simp only [vsub_eq_sub] at hC ⊢
    rw [show X - midpoint ℝ A B = (X - C) + (C - midpoint ℝ A B) by abel, inner_add_left, hC,
      add_zero, show B - A = -(A - B) by abel, inner_neg_right, hc, neg_zero]

/-- Predpostavke trditve `enakokraki_tocke` se dajo izpolniti (A = 1, B = −1, C = i, X = i v ℂ). -/
example := enakokraki_tocke (V := ℂ) 1 (-1) I I (by
    rw [← norm_neg ((-1 : ℂ) - I)]
    ring_nf
    rw [← Complex.norm_conj]
    simp)
  (by simp [Complex.inner]) (by simp [Complex.inner])

/-- Razlaga (posebni trikotniki) in Povzetek: v enakostraničnem trikotniku je težišče T enako oddaljeno
od vseh oglišč (je središče očrtane krožnice) in leži na vseh treh nosilkah višin (je višinska točka).
trditev: MAT-OS-7/znacilne-tocke-trikotnika#enakostranicni
besedilo: »V enakostraničnem trikotniku je vsaka višina hkrati težiščnica, simetrala stranice« -/
theorem enakostranicni (A B C : V) (s : ℝ) (h1 : ‖A - B‖ = s) (h2 : ‖B - C‖ = s) (h3 : ‖C - A‖ = s) :
    ‖(1 / 3 : ℝ) • (A + B + C) - A‖ = ‖(1 / 3 : ℝ) • (A + B + C) - B‖ ∧
      ‖(1 / 3 : ℝ) • (A + B + C) - B‖ = ‖(1 / 3 : ℝ) • (A + B + C) - C‖ ∧
      ⟪(1 / 3 : ℝ) • (A + B + C) - A, B - C⟫_ℝ = 0 ∧ ⟪(1 / 3 : ℝ) • (A + B + C) - B, C - A⟫_ℝ = 0 ∧
      ⟪(1 / 3 : ℝ) • (A + B + C) - C, A - B⟫_ℝ = 0 := by
  have dA := tezisce_razdalja_sq A B C
  have dB := tezisce_razdalja_sq B A C
  have dC := tezisce_razdalja_sq C A B
  rw [show B + A + C = A + B + C by abel] at dB
  rw [show C + A + B = A + B + C by abel] at dC
  have s1 : ‖B - A‖ = s := by rw [norm_sub_rev]; exact h1
  have s2 : ‖C - B‖ = s := by rw [norm_sub_rev]; exact h2
  have s3 : ‖A - C‖ = s := by rw [norm_sub_rev]; exact h3
  rw [s1, h3, h2] at dA
  rw [h1, s2, s3] at dB
  rw [s3, h2, h1] at dC
  have hA_B : ‖(1 / 3 : ℝ) • (A + B + C) - A‖ = ‖(1 / 3 : ℝ) • (A + B + C) - B‖ :=
    (pow_left_inj₀ (norm_nonneg _) (norm_nonneg _) two_ne_zero).mp (by linarith)
  have hB_C : ‖(1 / 3 : ℝ) • (A + B + C) - B‖ = ‖(1 / 3 : ℝ) • (A + B + C) - C‖ :=
    (pow_left_inj₀ (norm_nonneg _) (norm_nonneg _) two_ne_zero).mp (by linarith)
  have tA : ⟪(1 / 3 : ℝ) • (A + B + C) - A, B - C⟫_ℝ = 0 := by
    rw [show (1 / 3 : ℝ) • (A + B + C) - A = (2 / 3 : ℝ) • ((1 / 2 : ℝ) • (B + C) - A) by module,
      real_inner_smul_left, (tezisnica_je_visina B C A).mpr (by rw [s1, h3]), mul_zero]
  have tB : ⟪(1 / 3 : ℝ) • (A + B + C) - B, C - A⟫_ℝ = 0 := by
    rw [show (1 / 3 : ℝ) • (A + B + C) - B = (2 / 3 : ℝ) • ((1 / 2 : ℝ) • (C + A) - B) by module,
      real_inner_smul_left, (tezisnica_je_visina C A B).mpr (by rw [s2, h1]), mul_zero]
  exact ⟨hA_B, hB_C, tA, tB, visine_sekajo A B C _ tA tB⟩

/-- Predpostavke trditve `enakostranicni` se dajo izpolniti (A = 0, B = 2, C = 1 + √3·i v ℂ, s = 2). -/
example := enakostranicni (V := ℂ) 0 2 (1 + (√3 : ℝ) * I) 2 (by simp)
  (by
    have h3 : (√3 : ℝ) ^ 2 = 3 := Real.sq_sqrt (by norm_num)
    rw [Complex.norm_eq_sqrt_sq_add_sq]
    apply koren _ _ (by norm_num)
    simp
    linarith)
  (by
    have h3 : (√3 : ℝ) ^ 2 = 3 := Real.sq_sqrt (by norm_num)
    rw [Complex.norm_eq_sqrt_sq_add_sq]
    apply koren _ _ (by norm_num)
    simp
    linarith)

end Vektorji

/-! ## Očrtana krožnica (Mathlibov circumcenter) -/

section Ravnina

variable {V : Type*} {P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P]
  [NormedAddTorsor V P]

/-- Razlaga (simetrale stranic) in Povzetek: vsak trikotnik ima središče očrtane krožnice O z
|OA| = |OB| = |OC| = R; O leži na simetralah vseh treh stranic.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#ocrtana
besedilo: »Krožnica s središčem $O$ in polmerom $R$ gre skozi vsa tri oglišča.« -/
theorem ocrtana (t : Affine.Triangle ℝ P) :
    dist (t.points 0) t.circumcenter = t.circumradius ∧
      dist (t.points 1) t.circumcenter = t.circumradius ∧
      dist (t.points 2) t.circumcenter = t.circumradius ∧
      t.circumcenter ∈ AffineSubspace.perpBisector (t.points 0) (t.points 1) ∧
      t.circumcenter ∈ AffineSubspace.perpBisector (t.points 1) (t.points 2) ∧
      t.circumcenter ∈ AffineSubspace.perpBisector (t.points 0) (t.points 2) := by
  simp only [Affine.Simplex.dist_circumcenter_eq_circumradius, AffineSubspace.mem_perpBisector_iff_dist_eq',
    and_self]

/-- Binder `t` trditve `ocrtana` se da izpolniti (trikotnik z oglišči 4, 2i, 0 v ℂ). -/
example := ocrtana (V := ℂ) (P := ℂ) ⟨_, oglisca_4_2i_0⟩

/-- Razlaga (simetrale stranic): središče očrtane krožnice je edina točka ravnine trikotnika, ki je enako
oddaljena od vseh treh oglišč.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#ocrtana-enolicna
besedilo: »Točka, enako oddaljena od vseh treh oglišč, je središče očrtane krožnice $O$.« -/
theorem ocrtana_enolicna (t : Affine.Triangle ℝ P) (p : P) (hp : p ∈ affineSpan ℝ (Set.range t.points))
    (r : ℝ) (hr : ∀ i, dist (t.points i) p = r) : p = t.circumcenter ∧ r = t.circumradius :=
  ⟨t.eq_circumcenter_of_dist_eq hp hr, t.eq_circumradius_of_dist_eq hp hr⟩

/-- Predpostavke trditve `ocrtana_enolicna` se dajo izpolniti (trikotnik 4, 2i, 0 v ℂ, p = O, r = R). -/
example := ocrtana_enolicna (V := ℂ) (P := ℂ) ⟨_, oglisca_4_2i_0⟩ _
  (Affine.Simplex.circumcenter_mem_affineSpan _) _
  (fun i => Affine.Simplex.dist_circumcenter_eq_circumradius _ i)

/-- Primer 2 (formula): v trikotniku (B ≠ A) je γ = 180° − α − β, tj. ∠BCA = π − ∠ABC − ∠CAB.
(Trditev velja tudi, če C sovpada z A ali B, a le zaradi dogovora, da je kot z ničelnim vektorjem π/2;
za pravi trikotnik je C ≠ A, B.)
trditev: MAT-OS-7/znacilne-tocke-trikotnika#tretji-kot
besedilo: »$\gamma = 180^\circ - \alpha - \beta$« -/
theorem tretji_kot (A B C : P) (h : B ≠ A) : ∠ B C A = π - ∠ A B C - ∠ C A B := by
  have := EuclideanGeometry.angle_add_angle_add_angle_eq_pi C h
  linarith

/-- Predpostavka trditve `tretji_kot` se da izpolniti (A = 0, B = 1 v ℂ). -/
example := tretji_kot (V := ℂ) (P := ℂ) 0 1 I one_ne_zero

/-- Korak za korakom: trikotnik s stranicami |AB| = 10, |BC| = 6, |CA| = 8 ima pri C pravi kot
(6² + 8² = 10²).
trditev: MAT-OS-7/znacilne-tocke-trikotnika#sss-pravokotni
besedilo: »Dobiš $90^\circ$, trikotnik je pravokotni.« -/
theorem sss_pravokotni (A B C : P) (hAB : dist A B = 10) (hBC : dist B C = 6) (hCA : dist C A = 8) :
    ∠ A C B = π / 2 := by
  rw [← EuclideanGeometry.dist_sq_eq_dist_sq_add_dist_sq_iff_angle_eq_pi_div_two, hAB, dist_comm A C,
    hCA, hBC]
  norm_num

/-- Predpostavke trditve `sss_pravokotni` se dajo izpolniti (A = 8i, B = 6, C = 0 v ℂ). -/
example := sss_pravokotni (V := ℂ) (P := ℂ) (8 * I) 6 0
  (by
    rw [Complex.dist_eq_re_im]
    apply koren _ _ (by norm_num)
    simp
    norm_num)
  (by simp) (by simp)

end Ravnina

/-! ## Pravokotni trikotnik: O je razpolovišče hipotenuze -/

section RavninaV

variable {V : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V]

/-- Razlaga (pravokotni trikotnik), Povzetek in Primer 3: pri pravem kotu pri oglišču C = t.points 2 je
središče očrtane krožnice O razpolovišče hipotenuze AB in R = c/2 (iz `pravokotni_O` in enoličnosti
`ocrtana_enolicna`).
trditev: MAT-OS-7/znacilne-tocke-trikotnika#pravokotni-o
besedilo: »zato se simetrali sekata na sredini hipotenuze $c$. Tam je $O$, zato je $R = \dfrac{c}{2}$.« -/
theorem pravokotni_O_sredisce (t : Affine.Triangle ℝ V)
    (h : ⟪t.points 0 - t.points 2, t.points 1 - t.points 2⟫_ℝ = 0) :
    t.circumcenter = midpoint ℝ (t.points 0) (t.points 1) ∧
      t.circumradius = ‖t.points 0 - t.points 1‖ / 2 := by
  have hm : midpoint ℝ (t.points 0) (t.points 1) ∈ affineSpan ℝ (Set.range t.points) := by
    apply affineSpan_pair_le_of_mem_of_mem (mem_affineSpan ℝ (Set.mem_range_self 0))
      (mem_affineSpan ℝ (Set.mem_range_self 1))
    exact AffineMap.lineMap_mem_affineSpan_pair _ _ _
  have hO := pravokotni_O (t.points 0) (t.points 1) (t.points 2) h
  have hd : ∀ i, dist (t.points i) (midpoint ℝ (t.points 0) (t.points 1)) =
      ‖t.points 0 - t.points 1‖ / 2 := by
    intro i
    rw [dist_eq_norm, razpolovisce]
    fin_cases i
    · exact hO.1
    · exact hO.2.1
    · exact hO.2.2
  obtain ⟨h1, h2⟩ := ocrtana_enolicna t _ hm _ hd
  exact ⟨h1.symm, h2.symm⟩

/-- Predpostavka trditve `pravokotni_O_sredisce` se da izpolniti: trikotnik z oglišči 4, 2i, 0 v ℂ
(oglišča niso kolinearna) ima pravi kot pri tretjem oglišču 0. -/
example := pravokotni_O_sredisce (V := ℂ) ⟨_, oglisca_4_2i_0⟩ (by simp [Complex.inner])

end RavninaV

/-- Zakaj se tega učimo, Kot zgodba (»štiri točke, štiri različna mesta«) in Preveri se 1: značilne točke
so v splošnem različne. Zgled: pravokotni trikotnik A = 4, B = 2i, C = 0 v ℂ (pravi kot pri C).
Razpolovišče hipotenuze 2 + i je enako oddaljeno od vseh oglišč (O, `pravokotni_O_sredisce`), C leži na
vseh nosilkah višin (V = C, `pravokotni_V`), težišče je T = (4 + 2i)/3. Velja T ≠ O, T ≠ C, O ≠ C; T ni enako
oddaljen od A in C (|TA|² = 68/9, |TC|² = 20/9), C pa ne od A in C (|CA| = 4, |CC| = 0). Središče S
včrtane krožnice ni formalizirano.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#tocke-razlicne
besedilo: »Težiščnice dajo težišče $T$, točko ravnovesja, ki v splošnem ni enako oddaljena od oglišč.« -/
theorem tocke_razlicne :
    ⟪(4 : ℂ) - 0, 2 * I - 0⟫_ℝ = 0 ∧ (1 / 2 : ℝ) • ((4 : ℂ) + 2 * I) = 2 + I ∧
      (1 / 3 : ℝ) • ((4 : ℂ) + 2 * I + 0) = 4 / 3 + 2 / 3 * I ∧
      (4 / 3 + 2 / 3 * I : ℂ) ≠ 2 + I ∧ (4 / 3 + 2 / 3 * I : ℂ) ≠ 0 ∧ (2 + I : ℂ) ≠ 0 ∧
      ‖(4 / 3 + 2 / 3 * I : ℂ) - 4‖ ^ 2 = 68 / 9 ∧ ‖(4 / 3 + 2 / 3 * I : ℂ) - 0‖ ^ 2 = 20 / 9 ∧
      ‖(0 : ℂ) - 4‖ = 4 ∧ ‖(0 : ℂ) - 0‖ = 0 := by
  refine ⟨by simp [Complex.inner], ?_, ?_, ?_, ?_, ?_, ?_, ?_, by simp, by simp⟩
  · rw [Complex.real_smul]; push_cast; ring
  · rw [Complex.real_smul]; push_cast; ring
  · intro h; have := congrArg Complex.re h; norm_num at this
  · intro h; have := congrArg Complex.re h; norm_num at this
  · intro h; have := congrArg Complex.re h; norm_num at this
  · rw [Complex.sq_norm, Complex.normSq_apply]; simp; norm_num
  · rw [Complex.sq_norm, Complex.normSq_apply]; simp; norm_num

/-! ## Rešeni primeri in računi -/

/-- Razlaga (slika): vznožje višine iz C = (7, 5) na AB (točka (7, 0)) in razpolovišče M = (4, 0) stranice
AB z A = (0, 0), B = (8, 0) sta različni točki; |AM| = |MB| = 4.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#slika
besedilo: »Pristaneta v različnih točkah, torej nista ista črta.« -/
theorem slika : ((0 : ℝ) + 8) / 2 = 4 ∧ (7 : ℝ) ≠ 4 ∧ (4 : ℝ) - 0 = 4 ∧ (8 : ℝ) - 4 = 4 := by norm_num

/-- Primer 1: t_a = 15: 2 + 1 = 3 deli, 15 : 3 = 5; |AT| = 2·5 = 10, |TA₁| = 5; 10 + 5 = 15 in 10 : 5 = 2 : 1;
to sta (2/3)·15 in (1/3)·15.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#primer1
besedilo: »Odgovor: podpora mora biti $10\,\text{cm}$ od oglišča $A$ in $5\,\text{cm}$ od razpolovišča stranice $a$.« -/
theorem primer1 : (2 : ℝ) + 1 = 3 ∧ (15 : ℝ) / 3 = 5 ∧ (2 : ℝ) * 5 = 10 ∧ (10 : ℝ) + 5 = 15 ∧
    (10 : ℝ) / 5 = 2 / 1 ∧ (2 / 3 : ℝ) * 15 = 10 ∧ (1 / 3 : ℝ) * 15 = 5 := by norm_num

/-- Primer 2: γ = 180° − 35° − 25° = 120° > 90°, trikotnik je topokotni.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#primer2
besedilo: »Ker je $\gamma = 120^\circ > 90^\circ$, je trikotnik **topokotni**.« -/
theorem primer2 : (180 : ℝ) - 35 - 25 = 120 ∧ (120 : ℝ) > 90 := by norm_num

/-- Primer 3: R = c/2 = 12/2 = 6 km; t_c = |CO| = 6, |CT| = (2/3)·6 = 4 km.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#primer3
besedilo: »Težišče deli težiščnico v razmerju $2 : 1$: $|CT| = \dfrac{2}{3} \cdot 6\,\text{km} = 4\,\text{km}$.« -/
theorem primer3 : (12 : ℝ) / 2 = 6 ∧ (2 / 3 : ℝ) * 6 = 4 := by norm_num

/-- Primer 4: |BT| = (2/3)·t_b = 14 natanko pri t_b = 21; en del 14 : 2 = 7 = |TB₁|, t_b = 3·7 = 21,
14 + 7 = 21.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#primer4
besedilo: »Težiščnica ima tri dele: $t_b = 3 \cdot 7\,\text{cm} = 21\,\text{cm}$.« -/
theorem primer4 (t : ℝ) : ((2 / 3 : ℝ) * t = 14 ↔ t = 21) ∧ (14 : ℝ) / 2 = 7 ∧ (1 / 3 : ℝ) * 21 = 7 ∧
    (3 : ℝ) * 7 = 21 ∧ (14 : ℝ) + 7 = 21 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-- Pogoste napake 4: pri t_a = 9 je |AT| = (2/3)·9 = 6 cm, ne 4,5 cm.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#napaka-polovica
besedilo: »Pri $t_a = 9\,\text{cm}$ je $|AT| = 6\,\text{cm}$, ne $4{,}5\,\text{cm}$.« -/
theorem napaka_polovica : (2 / 3 : ℝ) * 9 = 6 ∧ (9 : ℝ) / 2 = 4.5 ∧ (6 : ℝ) ≠ 4.5 := by norm_num

/-- Preveri se 2: t_b = 18 ⇒ |BT| = (2/3)·18 = 12 cm; napačni: 9 (polovica), 6 (|TB₁|), 27 = (3/2)·18.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#kviz2
besedilo: »$|BT| = \dfrac{2}{3} \cdot 18\,\text{cm} = 12\,\text{cm}$.« -/
theorem kviz2 : (2 / 3 : ℝ) * 18 = 12 ∧ (18 : ℝ) / 2 = 9 ∧ (1 / 3 : ℝ) * 18 = 6 ∧ (3 / 2 : ℝ) * 18 = 27 ∧
    (9 : ℝ) ≠ 12 ∧ (6 : ℝ) ≠ 12 ∧ (27 : ℝ) ≠ 12 := by norm_num

/-- Korak za korakom: 6² + 8² = 10² (pravi kot, `sss_pravokotni`); polovica hipotenuze 10 : 2 = 5 = R;
težišče je (2/3)·5 ≈ 3,3 cm od C.
trditev: MAT-OS-7/znacilne-tocke-trikotnika#korak
besedilo: »Težišče je na dveh tretjinah od oglišča: $\dfrac{2}{3} \cdot 5\,\text{cm} \approx 3{,}3\,\text{cm}$ od $C$.« -/
theorem korak : (6 : ℝ) ^ 2 + 8 ^ 2 = 10 ^ 2 ∧ (10 : ℝ) / 2 = 5 ∧ |(2 / 3 : ℝ) * 5 - 3.3| < 0.05 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  rw [abs_lt]; constructor <;> norm_num

/-- Blok RACUN: vse vrstice (3,3 je približek (2/3)·5 na desetinko).
pomozno – vrednosti skritega bloka RACUN (ni vidno besedilo); iste račune pokrivajo primer1–primer4, kviz2, korak, napaka_polovica -/
theorem racun :
    (15 : ℝ) / 3 = 5 ∧ (2 : ℝ) * 5 = 10 ∧ (180 : ℝ) - 35 - 25 = 120 ∧ (12 : ℝ) / 2 = 6 ∧
      (2 / 3 : ℝ) * 6 = 4 ∧ (14 : ℝ) / 2 = 7 ∧ (3 : ℝ) * 7 = 21 ∧ (2 / 3 : ℝ) * 18 = 12 ∧
      (2 / 3 : ℝ) * 9 = 6 ∧ (6 : ℝ) ^ 2 + 8 ^ 2 = 10 ^ 2 ∧ (10 : ℝ) / 2 = 5 ∧
      |(2 / 3 : ℝ) * 5 - 3.3| < 0.05 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  rw [abs_lt]; constructor <;> norm_num

end Evklid.Lekcije.MAT_OS_7.ZnacilneTockeTrikotnika
