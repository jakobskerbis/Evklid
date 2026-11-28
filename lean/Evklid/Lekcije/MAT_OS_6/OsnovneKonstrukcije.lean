/-
vir: content/lessons/MAT-OS-6/osnovne-konstrukcije.md
sha256: 53fb84f6bad0c60fa0cc2f3413026085af3e54674d9c036d16768a374f30cfb8
Model: ravnina je `EuclideanSpace ℝ (Fin 2)`, točka (x; y) je `tc x y`, |PQ| je `dist P Q`. Lok s središčem A in
polmerom r je množica točk z |AP| = r (del krožnice). Simetrala daljice AB je Mathlibov `perpBisector A B`
(točke c z ⟪c − M, B − A⟫ = 0, M razpolovišče); »pravokotno« je skalarni produkt 0 oziroma kot π/2 = 90°. Kot je
neusmerjeni kot `∠ A V B` ∈ [0, π]. Računi s stopinjami so računi z realnimi števili (90° = 90). Konstrukcija
(kaj nariše šestilo, kaj ravnilo) je opisana z njenim izidom: presečišče lokov je točka z danima razdaljama.
Lean: kot z ničelnim krakom je v Mathlibu π/2; trditev `pravi_kot` zato velja tudi za P = M.
Ni v Leanu: orodje in pravila risanja (»ravnilo ne meri«, »ne briši lokov«, »drži šestilo za ročaj«), postopki
kot zaporedja korakov in kviz 4 (vrstni red korakov) – navodila; dokazano je, kaj da izid vsakega koraka; da se
loka pri r > |AB|/2 v splošnem res sekata v dveh točkah (zahtevno, še ni dokazano; dokazano je za daljico
6 cm s polmeroma 4 cm in 5 cm in za primer 2 s koordinatami); da je simetrala v ravnini premica (dimenzija 1)
in da »vse štiri točke ležijo na isti ravni črti« kot premica (dokazano: vse so na simetrali); »točke
simetrale kota so enako oddaljene od obeh krakov« in korak 1 primera 4 (razdalja do poltraka, zahtevno, še ni
dokazano); premisli 2 »če list prepogneš, se A pokrije z B« (dokazano je, da sta dela kota enaka, SSS) in »z
lokom drugje VS kota ne bi razpolovil« (ni dokazano: v posebnih legah bi ga lahko); delitev kota ∠AVB na dela
∠AVS + ∠SVB (dokazano je, da sta dela enaka; vsota delov je v primerih dana kot račun); smeri neba (sever,
zahod) v primeru 3 (dokazani so računi 45°, 135°); preverjanje z merjenjem in »razlikujejo le za malo« (meritev);
simulacija; zgodovina (2000 let); risbe.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.OsnovneKonstrukcije

open EuclideanGeometry AffineSubspace

/-- Ravnina. -/
abbrev Ravnina := EuclideanSpace ℝ (Fin 2)

/-- Točka (x; y). -/
noncomputable def tc (x y : ℝ) : Ravnina := EuclideanSpace.single 0 x + EuclideanSpace.single 1 y

/-- Pomožno: razdalja v koordinatah.
pomozno – računanje razdalj za primere izpolnljivosti -/
theorem dist_tc (a b c d : ℝ) : dist (tc a b) (tc c d) = Real.sqrt ((a - c) ^ 2 + (b - d) ^ 2) := by
  rw [EuclideanSpace.dist_eq, Fin.sum_univ_two]
  simp [tc, Real.dist_eq, sq_abs]

/-- Pomožno: razdalja r ≥ 0, če je (a − c)² + (b − d)² = r².
pomozno – računanje razdalj za primere izpolnljivosti -/
theorem dist_tc_eq (a b c d r : ℝ) (hr : 0 ≤ r) (h : (a - c) ^ 2 + (b - d) ^ 2 = r ^ 2) :
    dist (tc a b) (tc c d) = r := by
  rw [dist_tc, h, Real.sqrt_sq hr]

example := dist_tc_eq 0 4 (-3) 0 5 (by norm_num) (by norm_num)

/-! ## Razlaga -/

/-- Razlaga 2: presečišče P enako velikih lokov s središčema A in B (|AP| = |BP| = r) je enako oddaljeno od A
in B, torej leži na simetrali daljice AB.
trditev: MAT-OS-6/osnovne-konstrukcije#lok
besedilo: »Če narišemo enako velika loka s središčema $A$ in $B$, je vsako njuno presečišče enako oddaljeno od $A$ in od $B$.« -/
theorem lok (A B P : Ravnina) (r : ℝ) (hA : dist A P = r) (hB : dist B P = r) :
    dist P A = dist P B ∧ P ∈ perpBisector A B := by
  have h : dist P A = dist P B := by rw [dist_comm, hA, dist_comm, hB]
  exact ⟨h, mem_perpBisector_iff_dist_eq.mpr h⟩

example := lok (tc 0 0) (tc 2 0) (tc 1 0) 1 (dist_tc_eq _ _ _ _ 1 (by norm_num) (by norm_num))
  (dist_tc_eq _ _ _ _ 1 (by norm_num) (by norm_num))

/-- Razlaga 3 in Povzetek 3, kviz 1: točka je na simetrali daljice AB natanko tedaj, ko je enako oddaljena od A
in B; razpolovišče je na simetrali; simetrala je pravokotna na AB (⟪P − M, B − A⟫ = 0).
trditev: MAT-OS-6/osnovne-konstrukcije#simetrala
besedilo: »Vsaka točka simetrale je enako oddaljena od $A$ in $B$.« -/
theorem simetrala (A B P : Ravnina) :
    (P ∈ perpBisector A B ↔ dist P A = dist P B) ∧ midpoint ℝ A B ∈ perpBisector A B ∧
      (P ∈ perpBisector A B ↔ inner ℝ (P -ᵥ midpoint ℝ A B) (B -ᵥ A) = 0) :=
  ⟨mem_perpBisector_iff_dist_eq, midpoint_mem_perpBisector A B, mem_perpBisector_iff_inner_eq_zero⟩

/-- Razlaga 3, Povzetek 2: simetrala seka daljico pod pravim kotom: za vsako točko P simetrale je
∠ P M B = 90° (π/2), kjer je M razpolovišče.
trditev: MAT-OS-6/osnovne-konstrukcije#pravi-kot
besedilo: »Poteka skozi razpolovišče in je pravokotna na $AB$.« -/
theorem pravi_kot (A B P : Ravnina) (hP : P ∈ perpBisector A B) :
    ∠ P (midpoint ℝ A B) B = Real.pi / 2 := by
  rw [mem_perpBisector_iff_inner_eq_zero] at hP
  rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two,
    right_vsub_midpoint, real_inner_smul_right, hP, mul_zero]

example := pravi_kot (tc 0 0) (tc 2 0) (midpoint ℝ (tc 0 0) (tc 2 0)) (midpoint_mem_perpBisector _ _)

/-- Razlaga 3 (definicija simetrale): razpolovišče je od krajišča A oddaljeno |AB|/2 (enako od B).
trditev: MAT-OS-6/osnovne-konstrukcije#razpolovisce
besedilo: »Pravilno: preveri, da sta obe polovici daljice enako dolgi, vsaka $\dfrac{\lvert AB\rvert}{2}$, in da je kot $90^\circ$.« -/
theorem razpolovisce (A B : Ravnina) :
    dist A (midpoint ℝ A B) = dist A B / 2 ∧ dist (midpoint ℝ A B) B = dist A B / 2 := by
  constructor
  · rw [dist_left_midpoint, Real.norm_eq_abs, abs_two]; ring
  · rw [dist_midpoint_right, Real.norm_eq_abs, abs_two]; ring

/-- Razlaga 3 (uganka): za postaji 6 cm narazen (A = (−3; 0), B = (3; 0)) je mest, enako oddaljenih od obeh,
neskončno mnogo: vsa so na simetrali, ta pa vsebuje vse točke (0; t).
trditev: MAT-OS-6/osnovne-konstrukcije#neskoncno
besedilo: »Odgovor na uganko je torej: radar lahko stoji kjer koli na simetrali daljice $AB$, takih mest je neskončno mnogo.« -/
theorem neskoncno : dist (tc (-3) 0) (tc 3 0) = 6 ∧ (perpBisector (tc (-3) 0) (tc 3 0) : Set Ravnina).Infinite := by
  refine ⟨dist_tc_eq _ _ _ _ 6 (by norm_num) (by norm_num), ?_⟩
  refine Set.infinite_of_injective_forall_mem (f := fun t : ℝ => tc 0 t) ?_ ?_
  · intro s t h
    have := congrArg (fun v : Ravnina => dist v (tc 0 0)) h
    simp only [dist_tc] at this
    rw [Real.sqrt_inj (by positivity) (by positivity)] at this
    -- s² = t² ne zadošča; vzamemo še razdaljo do (0; 1)
    have h' := congrArg (fun v : Ravnina => dist v (tc 0 1)) h
    simp only [dist_tc] at h'
    rw [Real.sqrt_inj (by positivity) (by positivity)] at h'
    nlinarith
  · intro t
    rw [SetLike.mem_coe, mem_perpBisector_iff_dist_eq, dist_tc, dist_tc]
    congr 1; ring

/-- Razlaga 3: pri daljici 6 cm (A = (−3; 0), B = (3; 0)) se loka s polmerom 4 cm sekata v (0; √7) in (0; −√7),
loka s polmerom 5 cm v (0; 4) in (0; −4); vse štiri točke so od A in B enako oddaljene, so na simetrali skupaj z
razpoloviščem.
trditev: MAT-OS-6/osnovne-konstrukcije#stiri-tocke
besedilo: »Obe sta od $A$ in od $B$ oddaljeni po $4\,\text{cm}$. Ponovi s polmerom $5\,\text{cm}$ in dobiš še dve taki točki.« -/
theorem stiri_tocke :
    dist (tc (-3) 0) (tc 0 (Real.sqrt 7)) = 4 ∧ dist (tc 3 0) (tc 0 (Real.sqrt 7)) = 4 ∧
    dist (tc (-3) 0) (tc 0 (-Real.sqrt 7)) = 4 ∧ dist (tc 3 0) (tc 0 (-Real.sqrt 7)) = 4 ∧
    dist (tc (-3) 0) (tc 0 4) = 5 ∧ dist (tc 3 0) (tc 0 4) = 5 ∧
    dist (tc (-3) 0) (tc 0 (-4)) = 5 ∧ dist (tc 3 0) (tc 0 (-4)) = 5 ∧
    tc 0 (Real.sqrt 7) ∈ perpBisector (tc (-3) 0) (tc 3 0) ∧
    tc 0 (-Real.sqrt 7) ∈ perpBisector (tc (-3) 0) (tc 3 0) ∧
    tc 0 4 ∈ perpBisector (tc (-3) 0) (tc 3 0) ∧ tc 0 (-4) ∈ perpBisector (tc (-3) 0) (tc 3 0) ∧
    midpoint ℝ (tc (-3) 0) (tc 3 0) ∈ perpBisector (tc (-3) 0) (tc 3 0) := by
  have h7 : Real.sqrt 7 ^ 2 = 7 := Real.sq_sqrt (by norm_num)
  have a1 : dist (tc (-3) 0) (tc 0 (Real.sqrt 7)) = 4 := dist_tc_eq _ _ _ _ 4 (by norm_num) (by nlinarith)
  have a2 : dist (tc 3 0) (tc 0 (Real.sqrt 7)) = 4 := dist_tc_eq _ _ _ _ 4 (by norm_num) (by nlinarith)
  have a3 : dist (tc (-3) 0) (tc 0 (-Real.sqrt 7)) = 4 := dist_tc_eq _ _ _ _ 4 (by norm_num) (by nlinarith)
  have a4 : dist (tc 3 0) (tc 0 (-Real.sqrt 7)) = 4 := dist_tc_eq _ _ _ _ 4 (by norm_num) (by nlinarith)
  have b1 : dist (tc (-3) 0) (tc 0 4) = 5 := dist_tc_eq _ _ _ _ 5 (by norm_num) (by norm_num)
  have b2 : dist (tc 3 0) (tc 0 4) = 5 := dist_tc_eq _ _ _ _ 5 (by norm_num) (by norm_num)
  have b3 : dist (tc (-3) 0) (tc 0 (-4)) = 5 := dist_tc_eq _ _ _ _ 5 (by norm_num) (by norm_num)
  have b4 : dist (tc 3 0) (tc 0 (-4)) = 5 := dist_tc_eq _ _ _ _ 5 (by norm_num) (by norm_num)
  exact ⟨a1, a2, a3, a4, b1, b2, b3, b4, (lok _ _ _ 4 a1 a2).2, (lok _ _ _ 4 a3 a4).2, (lok _ _ _ 5 b1 b2).2,
    (lok _ _ _ 5 b3 b4).2, midpoint_mem_perpBisector _ _⟩

/-- Razlaga 3 (pogoj za polmer), premisli 1, Pogoste napake 2: če je polmer manjši od polovice daljice, se loka
ne srečata; če je enak polovici, je edino skupno točko razpolovišče (loka se le dotakneta).
trditev: MAT-OS-6/osnovne-konstrukcije#polmer
besedilo: »Če je polmer manjši od polovice daljice $AB$, se loka ne srečata. Če je enak polovici, se le dotakneta v razpolovišču, in premice ni s čim določiti.« -/
theorem polmer (A B : Ravnina) (r : ℝ) :
    (r < dist A B / 2 → ¬ ∃ P : Ravnina, dist A P = r ∧ dist B P = r) ∧
      (r = dist A B / 2 → ∀ P : Ravnina, dist A P = r → dist B P = r → P = midpoint ℝ A B) := by
  constructor
  · rintro h ⟨P, hA, hB⟩
    have := dist_triangle A P B
    rw [hA, dist_comm P B, hB] at this
    linarith
  · intro h P hA hB
    apply eq_midpoint_of_dist_eq_half
    · rw [hA, h]
    · rw [dist_comm, hB, h]

example := (polmer (tc 0 0) (tc 6 0) 2).1 (by rw [dist_tc_eq _ _ _ _ 6 (by norm_num) (by norm_num)]; norm_num)

example := (polmer (tc 0 0) (tc 6 0) 3).2 (by rw [dist_tc_eq _ _ _ _ 6 (by norm_num) (by norm_num)]; norm_num)
  (tc 3 0) (dist_tc_eq _ _ _ _ 3 (by norm_num) (by norm_num)) (dist_tc_eq _ _ _ _ 3 (by norm_num) (by norm_num))

/-- Premisli 1: pri daljici 6 cm loka s polmerom 2 cm ne dosežeta sredine (2 < 3); pri 3 cm se le dotakneta;
polmer mora biti večji od 6 : 2 = 3 cm.
trditev: MAT-OS-6/osnovne-konstrukcije#premisli-1
besedilo: »Vsak seže le $2\,\text{cm}$ od krajišča, do sredine pa je $3\,\text{cm}$.« -/
theorem premisli1 (A B : Ravnina) (h6 : dist A B = 6) :
    (6 : ℝ) / 2 = 3 ∧ (2 : ℝ) < 3 ∧ (¬ ∃ P : Ravnina, dist A P = 2 ∧ dist B P = 2) ∧
      ∀ P : Ravnina, dist A P = 3 → dist B P = 3 → P = midpoint ℝ A B := by
  refine ⟨by norm_num, by norm_num, (polmer A B 2).1 (by rw [h6]; norm_num), (polmer A B 3).2 (by rw [h6]; norm_num)⟩

example := premisli1 (tc 0 0) (tc 6 0) (dist_tc_eq _ _ _ _ 6 (by norm_num) (by norm_num))

/-- Razlaga 4 (točka na premici): če T leži na daljici AB in je |TA| = |TB|, je T razpolovišče AB in leži na
simetrali daljice AB (ki je pravokotnica skozi T).
trditev: MAT-OS-6/osnovne-konstrukcije#pravokotnica-na-premici
besedilo: »Točka $T$ je zdaj razpolovišče daljice $AB$.« -/
theorem pravokotnica_na_premici (A B T : Ravnina) (hW : Wbtw ℝ A T B) (h : dist T A = dist T B) :
    T = midpoint ℝ A B ∧ T ∈ perpBisector A B := by
  have hs := hW.dist_add_dist
  have h' : dist A T = dist T B := by rw [dist_comm]; exact h
  refine ⟨eq_midpoint_of_dist_eq_half ?_ ?_, mem_perpBisector_iff_dist_eq.mpr h⟩
  · linarith
  · linarith

example := pravokotnica_na_premici (tc (-3) 0) (tc 3 0) (tc 0 0)
  (by
    rw [← mem_segment_iff_wbtw]
    refine ⟨1 / 2, 1 / 2, by norm_num, by norm_num, by norm_num, ?_⟩
    ext i; fin_cases i <;> simp [tc])
  (by rw [dist_tc_eq _ _ _ _ 3 (by norm_num) (by norm_num), dist_tc_eq _ _ _ _ 3 (by norm_num) (by norm_num)])

/-- Razlaga 4 (točka zunaj premice): če lok s središčem T seka premico v A in B (|TA| = |TB|), leži T na
simetrali daljice AB.
trditev: MAT-OS-6/osnovne-konstrukcije#pravokotnica-zunaj
besedilo: »Ker je $T$ enako oddaljena od $A$ in $B$, leži $T$ na tej simetrali.« -/
theorem pravokotnica_zunaj (A B T : Ravnina) (h : dist T A = dist T B) : T ∈ perpBisector A B :=
  mem_perpBisector_iff_dist_eq.mpr h

example := pravokotnica_zunaj (tc (-3) 0) (tc 3 0) (tc 0 4)
  (by rw [dist_tc_eq _ _ _ _ 5 (by norm_num) (by norm_num), dist_tc_eq _ _ _ _ 5 (by norm_num) (by norm_num)])

/-- Razlaga 4 in kviz 5: če je TN pravokotna na premico skozi N (⟪T − N, X − N⟫ = 0), je |TN| najkrajša pot
od T do točke X na premici; za X ≠ N je pot strogo daljša.
trditev: MAT-OS-6/osnovne-konstrukcije#najkrajsa
besedilo: »Najkrajša pot od točke do premice je pravokotna daljica.« -/
theorem najkrajsa (T N X : Ravnina) (h : inner ℝ (T - N) (X - N) = 0) :
    dist T N ≤ dist T X ∧ (X ≠ N → dist T N < dist T X) := by
  have key : dist T X ^ 2 = dist T N ^ 2 + dist X N ^ 2 := by
    have := norm_sub_sq_eq_norm_sq_add_norm_sq_real h
    rw [dist_eq_norm, dist_eq_norm, dist_eq_norm, show T - X = (T - N) - (X - N) by abel, sq, sq, sq, this]
  refine ⟨?_, fun hX => ?_⟩
  · nlinarith [dist_nonneg (x := T) (y := X), dist_nonneg (x := T) (y := N), sq_nonneg (dist X N)]
  · have hp : 0 < dist X N := dist_pos.mpr hX
    nlinarith [dist_nonneg (x := T) (y := X), dist_nonneg (x := T) (y := N)]

example := najkrajsa (tc 0 4) (tc 0 0) (tc 3 0) (by
  rw [show tc 0 4 - tc 0 0 = EuclideanSpace.single 1 4 by ext i; fin_cases i <;> simp [tc],
    show tc 3 0 - tc 0 0 = EuclideanSpace.single 0 3 by ext i; fin_cases i <;> simp [tc]]
  simp [EuclideanSpace.inner_single_left])

/-- Razlaga 5, premisli 2, Povzetek 5: pri simetrali kota sta A in B enako oddaljeni od vrha V (|VA| = |VB|),
S pa od A in B (|SA| = |SB|); zato sta trikotnika AVS in BVS skladna (SSS) in dela kota sta enaka:
∠AVS = ∠SVB.
trditev: MAT-OS-6/osnovne-konstrukcije#simetrala-kota
besedilo: »Tako sta $A$ in $B$ enako oddaljeni od $V$, točka $S$ pa je enako oddaljena od $A$ in $B$.« -/
theorem simetrala_kota (V A B S : Ravnina) (hV : dist V A = dist V B) (hS : dist S A = dist S B) :
    ∠ A V S = ∠ S V B := by
  have hc := side_side_side (a := A) (b := V) (c := S) (a' := B) (b' := V) (c' := S)
    (by rw [dist_comm, hV, dist_comm]) rfl (by rw [hS])
  have := angle_eq_of_congruent hc 0 1 2
  simp only [Matrix.cons_val_zero, Matrix.cons_val_one, Matrix.cons_val_two, Matrix.tail_cons,
    Matrix.head_cons] at this
  rw [this, angle_comm]

example := simetrala_kota (tc 0 0) (tc 1 0) (tc 0 1) (tc 1 1)
  (by rw [dist_tc_eq _ _ _ _ 1 (by norm_num) (by norm_num), dist_tc_eq _ _ _ _ 1 (by norm_num) (by norm_num)])
  (by rw [dist_tc_eq _ _ _ _ 1 (by norm_num) (by norm_num), dist_tc_eq _ _ _ _ 1 (by norm_num) (by norm_num)])

/-- Razlaga 5 in Povzetek 5: če simetrala razdeli kot α na dva enaka dela, je vsak del α/2 (in samo to:
x + x = α ↔ x = α/2); tabela: 80° → 40°, 90° → 45°, 120° → 60°.
trditev: MAT-OS-6/osnovne-konstrukcije#pol-kota
besedilo: »Če je kot enak $\alpha$, je vsak od obeh delov enak $\dfrac{\alpha}{2}$.« -/
theorem pol_kota (α x : ℝ) : (x + x = α ↔ x = α / 2) ∧ (80 : ℝ) / 2 = 40 ∧ (90 : ℝ) / 2 = 45 ∧
    (120 : ℝ) / 2 = 60 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, by norm_num, by norm_num⟩

/-- Povzetek 6: ko razpolovimo pravi kot, dobimo 45°.
trditev: MAT-OS-6/osnovne-konstrukcije#pravi-kot-pol
besedilo: »Ko razpolovimo pravi kot, dobimo kot $45^\circ$.« -/
theorem pravi_kot_pol : (90 : ℝ) / 2 = 45 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: |AB| = 7 cm; razpolovišče je od A oddaljeno 7 : 2 = 3,5 cm; polmer 5 cm je večji od 3,5 cm, polmer
3,5 cm ali manj pa ni primeren (loka se ne sekata v dveh točkah).
trditev: MAT-OS-6/osnovne-konstrukcije#primer-1
besedilo: »Odgovor: razpolovišče je od $A$ oddaljeno $3{,}5\,\text{cm}$. Polmer je lahko $5\,\text{cm}$ ali kateri koli, večji od $3{,}5\,\text{cm}$.« -/
theorem primer1 (A B : Ravnina) (h7 : dist A B = 7) :
    dist A (midpoint ℝ A B) = 3.5 ∧ (7 : ℝ) / 2 = 3.5 ∧ (3.5 : ℝ) < 5 ∧
      ∀ r : ℝ, r ≤ 3.5 → ∀ P Q : Ravnina, dist A P = r → dist B P = r → dist A Q = r → dist B Q = r → P = Q := by
  refine ⟨by rw [(razpolovisce A B).1, h7]; norm_num, by norm_num, by norm_num, ?_⟩
  intro r hr P Q hAP hBP hAQ hBQ
  rcases lt_or_eq_of_le hr with h | h
  · exact absurd ⟨P, hAP, hBP⟩ ((polmer A B r).1 (by rw [h7]; linarith))
  · have e : r = dist A B / 2 := by rw [h7, h]; norm_num
    rw [(polmer A B r).2 e P hAP hBP, (polmer A B r).2 e Q hAQ hBQ]

example := primer1 (tc 0 0) (tc 7 0) (dist_tc_eq _ _ _ _ 7 (by norm_num) (by norm_num))

/-- Primer 2: lok s polmerom 5 okrog T seka p v A in B; T in T' sta od A in B oddaljeni 5, zato sta na simetrali
AB (pravokotnici); T' je zrcalna slika T čez p (N razpolovišče TT', |TN| = |NT'| = 4), zato je
|TT'| = 4 + 4 = 8 cm.
trditev: MAT-OS-6/osnovne-konstrukcije#primer-2
besedilo: »Velja $\lvert TT'\rvert = 4\,\text{cm} + 4\,\text{cm} = 8\,\text{cm}$.« -/
theorem primer2 (A B T T' N : Ravnina) (hTA : dist T A = 5) (hTB : dist T B = 5) (hAT' : dist A T' = 5)
    (hBT' : dist B T' = 5) (hN : Wbtw ℝ T N T') (hTN : dist T N = 4) (hNT' : dist N T' = 4) :
    T ∈ perpBisector A B ∧ T' ∈ perpBisector A B ∧ dist T T' = 8 := by
  refine ⟨pravokotnica_zunaj A B T (by rw [hTA, hTB]), (lok A B T' 5 hAT' hBT').2, ?_⟩
  calc dist T T' = dist T N + dist N T' := hN.dist_add_dist.symm
    _ = 4 + 4 := by rw [hTN, hNT']
    _ = 8 := by norm_num

example := primer2 (tc (-3) 0) (tc 3 0) (tc 0 4) (tc 0 (-4)) (tc 0 0)
  (dist_tc_eq _ _ _ _ 5 (by norm_num) (by norm_num)) (dist_tc_eq _ _ _ _ 5 (by norm_num) (by norm_num))
  (dist_tc_eq _ _ _ _ 5 (by norm_num) (by norm_num)) (dist_tc_eq _ _ _ _ 5 (by norm_num) (by norm_num))
  (by
    rw [← mem_segment_iff_wbtw]
    refine ⟨1 / 2, 1 / 2, by norm_num, by norm_num, by norm_num, ?_⟩
    ext i; fin_cases i <;> simp [tc])
  (dist_tc_eq _ _ _ _ 4 (by norm_num) (by norm_num)) (dist_tc_eq _ _ _ _ 4 (by norm_num) (by norm_num))

/-- Primer 3: simetrala pravega kota da 90° : 2 = 45° (edini x z x + x = 90); kot z vzhodom je
180° − 45° = 135° = 90° + 45°.
trditev: MAT-OS-6/osnovne-konstrukcije#primer-3
besedilo: »S smerjo vzhod oklepa $135^\circ$, z zahodom $45^\circ$.« -/
theorem primer3 (x : ℝ) : (x + x = 90 ↔ x = 45) ∧ (90 : ℝ) / 2 = 45 ∧ (180 : ℝ) - 45 = 135 ∧
    (90 : ℝ) + 45 = 135 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num⟩

/-- Primer 4 in premisli: kot 110° razpolovljen: 110 : 2 = 55° (edini x z x + x = 110); preizkus 55 + 55 = 110.
trditev: MAT-OS-6/osnovne-konstrukcije#primer-4
besedilo: »$110^\circ : 2 = 55^\circ$. Preizkus: $55^\circ + 55^\circ = 110^\circ$.« -/
theorem primer4 (x : ℝ) : (x + x = 110 ↔ x = 55) ∧ (110 : ℝ) / 2 = 55 ∧ (55 : ℝ) + 55 = 110 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num⟩

/-! ## Pogoste napake -/

/-- Pogoste napake 1 in kviz 3: če je polmer v A 4 cm, v B pa 5 cm, presečišče ni enako oddaljeno od A in B in
ne leži na simetrali.
trditev: MAT-OS-6/osnovne-konstrukcije#napaka-1
besedilo: »Presečišči sta zato od $A$ oddaljeni $4\,\text{cm}$, od $B$ pa $5\,\text{cm}$, in premica ne gre skozi razpolovišče.« -/
theorem napaka1 (A B P : Ravnina) (hA : dist A P = 4) (hB : dist B P = 5) :
    dist P A ≠ dist P B ∧ P ∉ perpBisector A B := by
  have h : dist P A ≠ dist P B := by rw [dist_comm, hA, dist_comm, hB]; norm_num
  exact ⟨h, fun hP => h (mem_perpBisector_iff_dist_eq.mp hP)⟩

example := napaka1 (tc 0 0) (tc 3 0) (tc 0 4) (dist_tc_eq _ _ _ _ 4 (by norm_num) (by norm_num))
  (dist_tc_eq _ _ _ _ 5 (by norm_num) (by norm_num))

/-- Pogoste napake 2: pri daljici 6 cm je polmer 4 cm večji od 6 : 2 = 3 cm (primeren).
trditev: MAT-OS-6/osnovne-konstrukcije#napaka-2
besedilo: »Pri daljici $6\,\text{cm}$ vzemi na primer $4\,\text{cm}$.« -/
theorem napaka2 : (6 : ℝ) / 2 = 3 ∧ (3 : ℝ) < 4 := by norm_num

/-! ## Drugače -/

/-- Drugače A: daljica 8 cm, polovica 8 : 2 = 4 cm, polmer 5 > 4; razpolovišče je od A in B oddaljeno 4 cm,
4 + 4 = 8.
trditev: MAT-OS-6/osnovne-konstrukcije#drugace-a
besedilo: »Razpolovišče je od $A$ in od $B$ oddaljeno $4\,\text{cm}$, skupaj $4\,\text{cm} + 4\,\text{cm} = 8\,\text{cm}$.« -/
theorem drugaceA (A B : Ravnina) (h8 : dist A B = 8) :
    (8 : ℝ) / 2 = 4 ∧ (4 : ℝ) < 5 ∧ dist A (midpoint ℝ A B) = 4 ∧ dist (midpoint ℝ A B) B = 4 ∧
      (4 : ℝ) + 4 = 8 := by
  refine ⟨by norm_num, by norm_num, ?_, ?_, by norm_num⟩
  · rw [(razpolovisce A B).1, h8]; norm_num
  · rw [(razpolovisce A B).2, h8]; norm_num

example := drugaceA (tc 0 0) (tc 8 0) (dist_tc_eq _ _ _ _ 8 (by norm_num) (by norm_num))

/-- Drugače B: kot 50° razdeljen na dva dela po 50 : 2 = 25°; preizkus 25 + 25 = 50.
trditev: MAT-OS-6/osnovne-konstrukcije#drugace-b
besedilo: »Poltrak $VS$ razdeli kot na dva dela po $50^\circ : 2 = 25^\circ$.« -/
theorem drugaceB : (50 : ℝ) / 2 = 25 ∧ (25 : ℝ) + 25 = 50 := by norm_num

/-- Drugače C: |TA| = |TB| = 3 cm, T na daljici AB: |AB| = 3 + 3 = 6 cm, T je razpolovišče in leži na simetrali.
trditev: MAT-OS-6/osnovne-konstrukcije#drugace-c
besedilo: »Daljica $AB$ je dolga $3\,\text{cm} + 3\,\text{cm} = 6\,\text{cm}$.« -/
theorem drugaceC (A B T : Ravnina) (hW : Wbtw ℝ A T B) (hA : dist T A = 3) (hB : dist T B = 3) :
    dist A B = 6 ∧ T = midpoint ℝ A B ∧ T ∈ perpBisector A B := by
  refine ⟨?_, pravokotnica_na_premici A B T hW (by rw [hA, hB])⟩
  calc dist A B = dist A T + dist T B := hW.dist_add_dist.symm
    _ = 3 + 3 := by rw [dist_comm, hA, hB]
    _ = 6 := by norm_num

example := drugaceC (tc (-3) 0) (tc 3 0) (tc 0 0)
  (by
    rw [← mem_segment_iff_wbtw]
    refine ⟨1 / 2, 1 / 2, by norm_num, by norm_num, by norm_num, ?_⟩
    ext i; fin_cases i <;> simp [tc])
  (dist_tc_eq _ _ _ _ 3 (by norm_num) (by norm_num)) (dist_tc_eq _ _ _ _ 3 (by norm_num) (by norm_num))

/-- Drugače (zgodba): točka, ki jo dasta loka z isto vrvjo okrog hiš A in B, je od obeh hiš enako daleč; vsaka
točka na simetrali (vrvici) je od A enako daleč kot od B.
trditev: MAT-OS-6/osnovne-konstrukcije#zgodba
besedilo: »»Vsaka točka na tej vrvici je od tvoje hiše enako daleč kot od moje,« je rekla Ana.« -/
theorem zgodba (A B P : Ravnina) (hP : P ∈ perpBisector A B) : dist P A = dist P B :=
  mem_perpBisector_iff_dist_eq.mp hP

example := zgodba (tc 0 0) (tc 2 0) _ (midpoint_mem_perpBisector _ _)

/-! ## Preveri se -/

/-- Kviz 1: simetrala gre skozi razpolovišče in je pravokotna (90°), ne 45°; razpolovišče ni edina enako
oddaljena točka: pri A = (−3; 0), B = (3; 0) je tudi (0; 1) na simetrali in ni razpolovišče.
trditev: MAT-OS-6/osnovne-konstrukcije#kviz-1
besedilo: »Enako oddaljena od $A$ in $B$ je vsaka točka simetrale, tudi tiste daleč od daljice.« -/
theorem kviz1 :
    tc 0 1 ∈ perpBisector (tc (-3) 0) (tc 3 0) ∧ tc 0 1 ≠ midpoint ℝ (tc (-3) 0) (tc 3 0) ∧
      Real.pi / 2 ≠ Real.pi / 4 := by
  refine ⟨?_, ?_, ?_⟩
  · rw [mem_perpBisector_iff_dist_eq, dist_tc, dist_tc]; norm_num
  · intro h
    have h1 := (razpolovisce (tc (-3) 0) (tc 3 0)).1
    rw [← h, dist_tc, dist_tc] at h1
    have h2 : Real.sqrt ((-3 - 0) ^ 2 + (0 - 1) ^ 2) ^ 2 = (Real.sqrt ((-3 - 3) ^ 2 + (0 - 0) ^ 2) / 2) ^ 2 := by
      rw [h1]
    rw [Real.sq_sqrt (by positivity), div_pow, Real.sq_sqrt (by positivity)] at h2
    norm_num at h2
  · intro h; have := Real.pi_pos; linarith

/-- Kviz 2: simetrala razdeli kot na dva dela po 35°, zato je ∠AVB = 2 · 35° = 70° (edini kot s polovico 35°);
napačna 35 in 17,5.
trditev: MAT-OS-6/osnovne-konstrukcije#kviz-2
besedilo: »Simetrala razdeli kot na dva enaka dela po $35^\circ$, zato je $\angle AVB = 2 \cdot 35^\circ = 70^\circ$.« -/
theorem kviz2 (α : ℝ) : (α / 2 = 35 ↔ α = 70) ∧ (2 : ℝ) * 35 = 70 ∧ (35 : ℝ) / 2 = 17.5 ∧ (35 : ℝ) ≠ 70 ∧
    (17.5 : ℝ) ≠ 70 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-- Kviz 3: polmer 4 cm je večji od 6 : 2 = 3 cm (prvi korak je pravilen); napaka je v različnih polmerih
(`napaka1`).
trditev: MAT-OS-6/osnovne-konstrukcije#kviz-3
besedilo: »$4\,\text{cm}$ je več od polovice daljice, to je od $3\,\text{cm}$, zato je primeren.« -/
theorem kviz3 : (6 : ℝ) / 2 = 3 ∧ (4 : ℝ) > 3 ∧ (5 : ℝ) > 3 ∧ (4 : ℝ) ≠ 5 := by norm_num

/-- RACUN: 7/2 = 3,5; 4 + 4 = 8; 90/2 = 45; 180 − 45 = 135; 90 + 45 = 135; 110/2 = 55; 55 + 55 = 110;
2 · 35 = 70; 6/2 = 3; 8/2 = 4; 50/2 = 25.
pomozno – vrstice bloka RACUN, ki ni vidno besedilo -/
theorem racun : (7 : ℝ) / 2 = 3.5 ∧ (4 : ℝ) + 4 = 8 ∧ (90 : ℝ) / 2 = 45 ∧ (180 : ℝ) - 45 = 135 ∧
    (90 : ℝ) + 45 = 135 ∧ (110 : ℝ) / 2 = 55 ∧ (55 : ℝ) + 55 = 110 ∧ (2 : ℝ) * 35 = 70 ∧ (6 : ℝ) / 2 = 3 ∧
    (8 : ℝ) / 2 = 4 ∧ (50 : ℝ) / 2 = 25 := by norm_num

end Evklid.Lekcije.MAT_OS_6.OsnovneKonstrukcije
