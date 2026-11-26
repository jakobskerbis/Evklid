/-
vir: content/lessons/MAT-SS-1/osnovni-geometrijski-pojmi.md
sha256: 57028a2e3512dd2aab9afdf93930b285c00435eb4c827933c3737d9a68862642
Model: točke so v evklidskem prostoru `P` (`NormedAddTorsor` nad realnim prostorom s skalarnim produktom `V`);
premica je afin podprostor z `finrank` smeri 1 (`line[ℝ, A, B]` je premica skozi A in B); »vzporedni« je
Mathlibov `∥` (ista smer, zato zajema tudi »sovpadata«, kot lekcija pravi pri prehodnosti); »p ⊥ q« pomeni, da
sta smeri pravokotni (`Submodule.IsOrtho`). Trditve »v ravnini« imajo `finrank ℝ V = 2`. Koti `∠` so neorientirani
in v radianih (θ° = θ·π/180); stopinjske račune (minute, sekunde, Primeri, Naloge) dokazujemo v ℝ s stopinjami
kot števili (x° y' = x + y/60). Pravokotna projekcija je `EuclideanGeometry.orthogonalProjection`. Koti ob
prečnici: vzporedni premici p, q in prečnica skozi P ∈ p, Q ∈ q; točka B na q je v isti smeri kot A na p
(B − Q = r(A − P), r > 0), kar je vzporednost (enaka smer) z izbiro iste strani prečnice. Formula za dolžino
projekcije je dokazana v koordinatah: p je os x, A = (a, h₁), B = (b, h₂), A' = (a, 0), B' = (b, 0)
(razdalje do p so |h₁|, |h₂|).
Ni v Leanu: zgodba (palačinka, rešetka, pica, baklava, kuhinja), risbe in simulacija »Koti ob premicah«;
definicije in poimenovanja (osnovni pojmi, poltrak, daljica, nosilka, kot kot del ravnine, kraka, vrh, vrste
kotov v tabelah, sovršni/sokoti/istoležni/izmenični kot kot imena, »prečnica«, »osem kotov je največ dveh
velikosti«) kot opis; »sekata se ⇔ natanko ena skupna točka« in razvrstitev »sekata se, sta vzporedni ali
sovpadata« v ravnini ter »pravokotni premici se sekata« (zahtevno, še ni dokazano; dokazano je, da imata različni premici največ eno skupno točko);
»izmerimo samo dolžino daljice«, senca palice, »če AB ⊥ p, se daljica projicira v točko« in »sicer je projekcija
krajša« (opis; za krajišči na isti strani je dokazana formula, iz katere sledi |A'B'| ≤ |AB|); »|AB| cos φ« (kotne
funkcije še niso snov); obrat pravil o kotih ob prečnici (enaki istoležni/izmenični ali suplementarni notranji koti
⇒ vzporednost; zahtevno, še ni dokazano), zato je pri Nalogi 2 a) dokazana le enačba 2y + 10 = 4y − 30 ⇔ y = 20;
pri Nalogi 1 je trditev »dana vsota ni 180°, zato kota nista sosednja« dokazana kot račun 129°20' ≠ 180°;
mnemotehnika K pred S, Postopek, Pazi na, točkovanje, razlaga »zakaj« v kvizih (dokazani so pravilni odgovori in
da so napačni odgovori res napačni); trditev »Evklid je zapisal aksiom« (zgodovina). Razlika med kotoma pri
nevzporednih žicah (premisli 2) je opis.
Lean: √ negativnega je 0; vsi √ imajo pozitivne podatke.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.OsnovniGeometrijskiPojmi

open Real EuclideanGeometry InnerProductGeometry Module
open scoped Affine

variable {V P : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] [MetricSpace P] [NormedAddTorsor V P]

/-! ## 1. Točka, premica, ravnina -/

/-- Razlaga 1 in Povzetek: skozi dve različni točki A, B gre natanko ena premica: `line[ℝ, A, B]` vsebuje A in
B, je premica (smer dimenzije 1), in vsaka premica skozi A in B je enaka njej.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#premica-skozi-dve-tocki
besedilo: »skozi dve različni točki gre natanko ena premica« -/
theorem premica_skozi_dve_tocki {A B : P} (h : A ≠ B) :
    A ∈ line[ℝ, A, B] ∧ B ∈ line[ℝ, A, B] ∧ finrank ℝ (line[ℝ, A, B]).direction = 1 ∧
      ∀ l : AffineSubspace ℝ P, finrank ℝ l.direction = 1 → A ∈ l → B ∈ l → l = line[ℝ, A, B] := by
  have hd : (line[ℝ, A, B]).direction = ℝ ∙ (A -ᵥ B) := by rw [direction_affineSpan, vectorSpan_pair]
  have h1 : finrank ℝ (line[ℝ, A, B]).direction = 1 := by
    rw [hd]; exact finrank_span_singleton (vsub_ne_zero.mpr h)
  refine ⟨left_mem_affineSpan_pair ℝ A B, right_mem_affineSpan_pair ℝ A B, h1, ?_⟩
  intro l hl hA hB
  have hle : line[ℝ, A, B] ≤ l := affineSpan_pair_le_of_mem_of_mem hA hB
  have : Module.Finite ℝ l.direction := Module.finite_of_finrank_eq_succ hl
  have hdir : (line[ℝ, A, B]).direction = l.direction :=
    Submodule.eq_of_le_of_finrank_eq (AffineSubspace.direction_le hle) (by rw [h1, hl])
  exact (AffineSubspace.eq_of_direction_eq_of_nonempty_of_le hdir
    ⟨A, left_mem_affineSpan_pair ℝ A B⟩ hle).symm

/-- Predpostavka trditve `premica_skozi_dve_tocki` se da izpolniti (dve različni točki ravnine ℂ). -/
example : (0 : ℂ) ≠ 1 := zero_ne_one

/-- Razlaga 1: dve različni premici imata največ eno skupno točko.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#najvec-ena-skupna-tocka
besedilo: »dve različni premici imata največ eno skupno točko« -/
theorem najvec_ena_skupna_tocka {l m : AffineSubspace ℝ P} (hl : finrank ℝ l.direction = 1)
    (hm : finrank ℝ m.direction = 1) (hlm : l ≠ m) {A B : P} (hAl : A ∈ l) (hAm : A ∈ m) (hBl : B ∈ l)
    (hBm : B ∈ m) : A = B := by
  by_contra h
  have h1 := (premica_skozi_dve_tocki h).2.2.2 l hl hAl hBl
  have h2 := (premica_skozi_dve_tocki h).2.2.2 m hm hAm hBm
  exact hlm (h1.trans h2.symm)

/-- Predpostavke trditve `najvec_ena_skupna_tocka` se dajo izpolniti: os x in os y v ℂ sta različni premici s
skupno točko 0. -/
example : finrank ℝ (line[ℝ, (0 : ℂ), 1]).direction = 1 ∧ finrank ℝ (line[ℝ, (0 : ℂ), Complex.I]).direction = 1 ∧
    line[ℝ, (0 : ℂ), 1] ≠ line[ℝ, (0 : ℂ), Complex.I] ∧ (0 : ℂ) ∈ line[ℝ, (0 : ℂ), 1] ∧
    (0 : ℂ) ∈ line[ℝ, (0 : ℂ), Complex.I] := by
  refine ⟨(premica_skozi_dve_tocki zero_ne_one).2.2.1,
    (premica_skozi_dve_tocki (Ne.symm Complex.I_ne_zero)).2.2.1, ?_, left_mem_affineSpan_pair ℝ _ _,
    left_mem_affineSpan_pair ℝ _ _⟩
  intro h
  have hI : Complex.I ∈ line[ℝ, (0 : ℂ), 1] := h ▸ right_mem_affineSpan_pair ℝ _ _
  rw [← vsub_vadd Complex.I 0, AffineSubspace.vadd_mem_iff_mem_direction _ (left_mem_affineSpan_pair ℝ _ _),
    direction_affineSpan, vectorSpan_pair, Submodule.mem_span_singleton] at hI
  obtain ⟨r, hr⟩ := hI
  have := congrArg Complex.im hr
  simp at this

/-! ## 3. Medsebojna lega premic, aksiom o vzporednici, pravokotnost -/

/-- Razlaga 3 in Povzetek (aksiom o vzporednici): skozi točko T, ki ne leži na premici l, poteka natanko ena
vzporednica k l, to je `mk' T l.direction`; ta z l nima skupnih točk.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#aksiom-vzporednica
besedilo: »skozi točko, ki ne leži na dani premici, poteka natanko ena vzporednica k tej premici« -/
theorem aksiom_vzporednica (l : AffineSubspace ℝ P) (hl : (l : Set P).Nonempty) {T : P} (hT : T ∉ l) :
    (AffineSubspace.mk' T l.direction ∥ l ∧ T ∈ AffineSubspace.mk' T l.direction ∧
      (AffineSubspace.mk' T l.direction : Set P) ∩ l = ∅) ∧
      ∀ s : AffineSubspace ℝ P, s ∥ l → T ∈ s → s = AffineSubspace.mk' T l.direction := by
  refine ⟨⟨?_, AffineSubspace.self_mem_mk' T _, ?_⟩, ?_⟩
  · rw [AffineSubspace.parallel_iff_direction_eq_and_eq_bot_iff_eq_bot, AffineSubspace.direction_mk']
    refine ⟨rfl, ?_⟩
    constructor
    · intro h
      have := AffineSubspace.self_mem_mk' T l.direction
      rw [h] at this
      exact absurd this (AffineSubspace.notMem_bot ℝ V T)
    · intro h
      obtain ⟨X, hX⟩ := hl
      rw [h] at hX
      exact absurd hX (AffineSubspace.notMem_bot ℝ V X)
  · ext X
    simp only [Set.mem_inter_iff, SetLike.mem_coe, Set.mem_empty_iff_false, iff_false, not_and]
    intro hX hXl
    rw [AffineSubspace.mem_mk'] at hX
    apply hT
    have : T -ᵥ X ∈ l.direction := by
      rw [← neg_vsub_eq_vsub_rev]; exact l.direction.neg_mem hX
    rw [← vsub_vadd T X]
    exact AffineSubspace.vadd_mem_of_mem_direction this hXl
  · intro s hs hTs
    rw [← hs.direction_eq]
    exact (AffineSubspace.mk'_eq hTs).symm

/-- Predpostavke trditve `aksiom_vzporednica` se dajo izpolniti: os x v ℂ in točka i, ki ne leži na njej. -/
example : ((line[ℝ, (0 : ℂ), 1] : AffineSubspace ℝ ℂ) : Set ℂ).Nonempty ∧ Complex.I ∉ line[ℝ, (0 : ℂ), 1] := by
  refine ⟨⟨0, left_mem_affineSpan_pair ℝ _ _⟩, ?_⟩
  intro hI
  rw [← vsub_vadd Complex.I 0, AffineSubspace.vadd_mem_iff_mem_direction _ (left_mem_affineSpan_pair ℝ _ _),
    direction_affineSpan, vectorSpan_pair, Submodule.mem_span_singleton] at hI
  obtain ⟨r, hr⟩ := hI
  have := congrArg Complex.im hr
  simp at this

/-- Razlaga 3: vzporednost je zamenljiva (p ∥ q ⇒ q ∥ p).
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#vzporednost-zamenljiva
besedilo: »Vzporednost je zamenljiva: če je $p \parallel q$, je tudi $q \parallel p$.« -/
theorem vzporednost_zamenljiva {p q : AffineSubspace ℝ P} (h : p ∥ q) : q ∥ p := h.symm

/-- Predpostavke trditev `vzporednost_zamenljiva` in `vzporednost_prehodna` se dajo izpolniti: os x in njena
vzporednica skozi i v ℂ (`mk' i (smer osi x)`). -/
example : line[ℝ, (0 : ℂ), 1] ∥ AffineSubspace.mk' Complex.I (line[ℝ, (0 : ℂ), 1]).direction ∧
    AffineSubspace.mk' Complex.I (line[ℝ, (0 : ℂ), 1]).direction ∥ line[ℝ, (0 : ℂ), 1] := by
  have h := (aksiom_vzporednica (line[ℝ, (0 : ℂ), 1]) ⟨0, left_mem_affineSpan_pair ℝ _ _⟩ (T := Complex.I) (by
    intro hI
    rw [← vsub_vadd Complex.I 0, AffineSubspace.vadd_mem_iff_mem_direction _ (left_mem_affineSpan_pair ℝ _ _),
      direction_affineSpan, vectorSpan_pair, Submodule.mem_span_singleton] at hI
    obtain ⟨r, hr⟩ := hI
    have := congrArg Complex.im hr
    simp at this)).1.1
  exact ⟨h.symm, h⟩

/-- Razlaga 3: če sta p in q vzporedni s tretjo premico r, sta vzporedni med seboj (ali sovpadata; Mathlibov
`∥` zajema oboje).
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#vzporednost-prehodna
besedilo: »Če sta premici $p$ in $q$ vzporedni s tretjo premico $r$, sta vzporedni tudi med seboj (ali pa sovpadata).« -/
theorem vzporednost_prehodna {p q r : AffineSubspace ℝ P} (hp : p ∥ r) (hq : q ∥ r) : p ∥ q :=
  hp.trans hq.symm

/-- Pomožna trditev: v ravnini je smer premice p, pravokotne na premico r, natanko pravokotni komplement smeri r.
pomozno – orodje: smer pravokotnice je pravokotni komplement -/
theorem smer_pravokotnice [FiniteDimensional ℝ V] (hV : finrank ℝ V = 2) {p r : AffineSubspace ℝ P}
    (hp : finrank ℝ p.direction = 1) (hr : finrank ℝ r.direction = 1) (h : p.direction ⟂ r.direction) :
    p.direction = r.directionᗮ := by
  have hle : p.direction ≤ r.directionᗮ := Submodule.isOrtho_iff_le.mp h
  have hc := Submodule.finrank_add_finrank_orthogonal r.direction
  exact Submodule.eq_of_le_of_finrank_eq hle (by omega)

/-- Razlaga 3, premisli 1: v ravnini sta premici p in q, ki sta obe pravokotni na r, vzporedni (ali sovpadata).
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#pravokotnici-na-isto-vzporedni
besedilo: »Sta vzporedni (ali sovpadata).« -/
theorem pravokotnici_na_isto_vzporedni [FiniteDimensional ℝ V] (hV : finrank ℝ V = 2)
    {p q r : AffineSubspace ℝ P} (hp : finrank ℝ p.direction = 1) (hq : finrank ℝ q.direction = 1)
    (hr : finrank ℝ r.direction = 1) (hpr : p.direction ⟂ r.direction) (hqr : q.direction ⟂ r.direction) :
    p ∥ q := by
  rw [AffineSubspace.parallel_iff_direction_eq_and_eq_bot_iff_eq_bot,
    smer_pravokotnice hV hp hr hpr, smer_pravokotnice hV hq hr hqr]
  refine ⟨rfl, ?_⟩
  have hne : ∀ s : AffineSubspace ℝ P, finrank ℝ s.direction = 1 → s ≠ ⊥ := by
    intro s hs hb
    rw [hb, AffineSubspace.direction_bot, finrank_bot] at hs
    exact zero_ne_one hs
  exact ⟨fun h => absurd h (hne p hp), fun h => absurd h (hne q hq)⟩

/-- Razlaga 3: skozi vsako točko T ravnine poteka natanko ena pravokotnica na premico r:
`mk' T r.directionᗮ` je premica skozi T, pravokotna na r, in vsaka premica skozi T, pravokotna na r, je ta.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#ena-pravokotnica
besedilo: »skozi vsako točko poteka natanko ena pravokotnica na dano premico« -/
theorem ena_pravokotnica [FiniteDimensional ℝ V] (hV : finrank ℝ V = 2) {r : AffineSubspace ℝ P}
    (hr : finrank ℝ r.direction = 1) (T : P) :
    (finrank ℝ (AffineSubspace.mk' T r.directionᗮ).direction = 1 ∧ T ∈ AffineSubspace.mk' T r.directionᗮ ∧
      (AffineSubspace.mk' T r.directionᗮ).direction ⟂ r.direction) ∧
      ∀ p : AffineSubspace ℝ P, finrank ℝ p.direction = 1 → T ∈ p → p.direction ⟂ r.direction →
        p = AffineSubspace.mk' T r.directionᗮ := by
  have hc := Submodule.finrank_add_finrank_orthogonal r.direction
  refine ⟨⟨?_, AffineSubspace.self_mem_mk' T _, ?_⟩, ?_⟩
  · rw [AffineSubspace.direction_mk']; omega
  · rw [AffineSubspace.direction_mk']; exact (Submodule.isOrtho_orthogonal_left r.direction)
  · intro p hp hT hpr
    rw [← smer_pravokotnice hV hp hr hpr]
    exact (AffineSubspace.mk'_eq hT).symm

/-- Predpostavki ravnine iz trditev o pravokotnicah se dajo izpolniti: ℂ je realni prostor dimenzije 2, os x
(`line[ℝ, 0, 1]`) je premica. -/
example : finrank ℝ ℂ = 2 ∧ finrank ℝ (line[ℝ, (0 : ℂ), 1]).direction = 1 :=
  ⟨Complex.finrank_real_complex, (premica_skozi_dve_tocki zero_ne_one).2.2.1⟩

/-- Predpostavke trditev `pravokotnici_na_isto_vzporedni` in `smer_pravokotnice` se dajo izpolniti: premici skozi 0 in 1, pravokotni na
os x (`mk' 0 (smer x)ᗮ` in `mk' 1 (smer x)ᗮ`), sta pravokotni na os x. -/
example : let r : AffineSubspace ℝ ℂ := line[ℝ, (0 : ℂ), 1]
    finrank ℝ (AffineSubspace.mk' (0 : ℂ) r.directionᗮ).direction = 1 ∧
      finrank ℝ (AffineSubspace.mk' (1 : ℂ) r.directionᗮ).direction = 1 ∧ finrank ℝ r.direction = 1 ∧
      (AffineSubspace.mk' (0 : ℂ) r.directionᗮ).direction ⟂ r.direction ∧
      (AffineSubspace.mk' (1 : ℂ) r.directionᗮ).direction ⟂ r.direction := by
  intro r
  have hr : finrank ℝ r.direction = 1 := (premica_skozi_dve_tocki zero_ne_one).2.2.1
  have h0 := (ena_pravokotnica Complex.finrank_real_complex hr 0).1
  have h1 := (ena_pravokotnica Complex.finrank_real_complex hr 1).1
  exact ⟨h0.1, h1.1, hr, h0.2.2, h1.2.2⟩

/-- Naloga 2 c): premica r, pravokotna na p, je pravokotna tudi na vsako vzporednico q premice p.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#pravokotna-na-vzporednico
besedilo: »Istoležna kota sta enaka, zato tudi pri $q$ meri kot med $r$ in $q$ $90^\circ$, torej $r \perp q$.« -/
theorem pravokotna_na_vzporednico {p q r : AffineSubspace ℝ P} (hrp : r.direction ⟂ p.direction) (hpq : p ∥ q) :
    r.direction ⟂ q.direction := by
  rw [← hpq.direction_eq]; exact hrp

/-- Predpostavke trditve `pravokotna_na_vzporednico` se dajo izpolniti (p = q = os x, r = pravokotnica skozi 0). -/
example : let p : AffineSubspace ℝ ℂ := line[ℝ, (0 : ℂ), 1]
    (AffineSubspace.mk' (0 : ℂ) p.directionᗮ).direction ⟂ p.direction ∧ p ∥ p := by
  intro p
  refine ⟨?_, AffineSubspace.Parallel.refl p⟩
  rw [AffineSubspace.direction_mk']; exact Submodule.isOrtho_orthogonal_left _

/-! ## 4. Razdalja točke od premice, pravokotna projekcija -/

/-- Razlaga 4 in Ustno vprašanje 1: pravokotna projekcija T' točke T na premico (podprostor) s je najbližja
točka: za vsak X ∈ s je |TX|² = |TT'|² + |T'X|², zato |TT'| ≤ |TX|, in za X ≠ T' strogo.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#projekcija-najkrajsa
besedilo: »Za vsako drugo točko $X$ na $p$ je daljica $TX$ hipotenuza pravokotnega trikotnika $TT'X$, zato je daljša od katete $TT'$.« -/
theorem projekcija_najkrajsa (s : AffineSubspace ℝ P) [Nonempty s] [s.direction.HasOrthogonalProjection]
    (T : P) {X : P} (hX : X ∈ s) :
    dist X T ^ 2 = dist T (orthogonalProjection s T) ^ 2 + dist X (orthogonalProjection s T) ^ 2 ∧
      dist T (orthogonalProjection s T) ≤ dist T X ∧
      (X ≠ orthogonalProjection s T → dist T (orthogonalProjection s T) < dist T X) := by
  have h := dist_sq_eq_dist_orthogonalProjection_sq_add_dist_orthogonalProjection_sq T hX
  have hp : dist X T ^ 2 = dist T (orthogonalProjection s T) ^ 2 + dist X (orthogonalProjection s T) ^ 2 := by
    nlinarith [h]
  refine ⟨hp, ?_, ?_⟩
  · rw [dist_comm T X]
    nlinarith [dist_nonneg (x := T) (y := (orthogonalProjection s T : P)), dist_nonneg (x := X) (y := T),
      sq_nonneg (dist X (orthogonalProjection s T))]
  · intro hne
    have hpos : 0 < dist X (orthogonalProjection s T) := dist_pos.mpr hne
    rw [dist_comm T X]
    nlinarith [dist_nonneg (x := T) (y := (orthogonalProjection s T : P)), dist_nonneg (x := X) (y := T)]

/-- Predpostavke trditve `projekcija_najkrajsa` se dajo izpolniti (os x v ℂ, točka 0 na njej). -/
example : (0 : ℂ) ∈ line[ℝ, (0 : ℂ), 1] := left_mem_affineSpan_pair ℝ _ _

/-- Razlaga 4: vse točke premice q ∥ p so od p enako oddaljene (razdalja med vzporednicama): za X, Y ∈ q je
|X X'| = |Y Y'|, kjer sta X', Y' pravokotni projekciji na p.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#vzporednici-enako-oddaljeni
besedilo: »Vsaka točka premice $q \parallel p$ je od $p$ enako oddaljena« -/
theorem vzporednici_enako_oddaljeni (p q : AffineSubspace ℝ P) [Nonempty p] [p.direction.HasOrthogonalProjection]
    (hpq : q ∥ p) {X Y : P} (hX : X ∈ q) (hY : Y ∈ q) :
    dist X (orthogonalProjection p X) = dist Y (orthogonalProjection p Y) := by
  have hw : Y -ᵥ X ∈ p.direction := by
    rw [← hpq.direction_eq]; exact AffineSubspace.vsub_mem_direction hY hX
  have hY' : Y = ((⟨Y -ᵥ X, hw⟩ : p.direction) : V) +ᵥ X := (vsub_vadd Y X).symm
  rw [hY', EuclideanGeometry.orthogonalProjection_vadd, AffineSubspace.coe_vadd, dist_vadd_cancel_left]

/-- Predpostavke trditve `vzporednici_enako_oddaljeni` se dajo izpolniti (q = p = os x, X = 0, Y = 1). -/
example : line[ℝ, (0 : ℂ), 1] ∥ line[ℝ, (0 : ℂ), 1] ∧ (0 : ℂ) ∈ line[ℝ, (0 : ℂ), 1] ∧
    (1 : ℂ) ∈ line[ℝ, (0 : ℂ), 1] :=
  ⟨AffineSubspace.Parallel.refl _, left_mem_affineSpan_pair ℝ _ _, right_mem_affineSpan_pair ℝ _ _⟩

/-- Razlaga 4 in Povzetek (formula za projekcijo, koordinatni model): p je os x, A = (a, h₁), B = (b, h₂) na isti
strani p (h₁, h₂ ≥ 0), A' = (a, 0), B' = (b, 0). Trikotnik ABC s C = (b, h₁) ima |AC| = |A'B'| = |b − a| in
|BC| = |BB'| − |AA'|, zato |A'B'|² = |AB|² − (|BB'| − |AA'|)², kjer je |AB|² = (b − a)² + (h₂ − h₁)². V tem
koordinatnem modelu je to skoraj le algebrska identiteta; geometrijska vsebina (projekcija na premico) je
`projekcija_najkrajsa`.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#projekcija-ista-stran
besedilo: »projekcija ($A$, $B$ na isti strani $p$): $|A'B'|^2 = |AB|^2 - (|BB'| - |AA'|)^2$« -/
theorem projekcija_ista_stran (a b h₁ h₂ : ℝ) (h₁0 : 0 ≤ h₁) (h₂0 : 0 ≤ h₂) :
    |b - a| ^ 2 = ((b - a) ^ 2 + (h₂ - h₁) ^ 2) - (|h₂| - |h₁|) ^ 2 := by
  rw [abs_of_nonneg h₁0, abs_of_nonneg h₂0, sq_abs]; ring

/-- Predpostavke trditve `projekcija_ista_stran` se dajo izpolniti (slika: h₁ = 1, h₂ = 4). -/
example : (0 : ℝ) ≤ 1 ∧ (0 : ℝ) ≤ 4 := by norm_num

/-- Razlaga 4: če ležita krajišči na različnih straneh premice (h₁ ≥ 0 ≥ h₂), razdalji v oklepaju seštejemo:
|A'B'|² = |AB|² − (|BB'| + |AA'|)².
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#projekcija-razlicni-strani
besedilo: »Če ležita krajišči na različnih straneh premice, razdalji v oklepaju seštejemo.« -/
theorem projekcija_razlicni_strani (a b h₁ h₂ : ℝ) (h₁0 : 0 ≤ h₁) (h₂0 : h₂ ≤ 0) :
    |b - a| ^ 2 = ((b - a) ^ 2 + (h₂ - h₁) ^ 2) - (|h₂| + |h₁|) ^ 2 := by
  rw [abs_of_nonneg h₁0, abs_of_nonpos h₂0, sq_abs]; ring

/-- Predpostavke trditve `projekcija_razlicni_strani` se dajo izpolniti (h₁ = 1, h₂ = −4). -/
example : (0 : ℝ) ≤ 1 ∧ (-4 : ℝ) ≤ 0 := by norm_num

/-- Razlaga 4: če je AB ∥ p (h₁ = h₂), je projekcija enako dolga kot daljica: |A'B'| = |AB|.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#projekcija-vzporedne
besedilo: »Če je $AB \parallel p$, je projekcija enako dolga kot daljica: $|A'B'| = |AB|$.« -/
theorem projekcija_vzporedne (a b h : ℝ) : |b - a| = √((b - a) ^ 2 + (h - h) ^ 2) := by
  rw [sub_self, zero_pow two_ne_zero, add_zero, Real.sqrt_sq_eq_abs]

/-- Razlaga 4, slika: |AB| = 5, |AA'| = 1, |BB'| = 4 ⇒ |A'B'|² = 25 − 9 = 16 in |A'B'| = 4.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#slika-projekcija
besedilo: »Na sliki je $|AB| = 5$, $|AA'| = 1$ in $|BB'| = 4$, zato je $|A'B'|^2 = 25 - 9 = 16$ in $|A'B'| = 4$.« -/
theorem slika_projekcija : (5 : ℝ) ^ 2 - (4 - 1) ^ 2 = 25 - 9 ∧ (25 : ℝ) - 9 = 16 ∧ √(16 : ℝ) = 4 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  rw [show (16 : ℝ) = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-! ## 5. Simetrala daljice, razpolovišče -/

/-- Razlaga 5 in Povzetek: simetrala daljice AB (`AffineSubspace.perpBisector A B`) gre skozi razpolovišče, njena smer je
pravokotna na AB, in njene točke so natanko točke, enako oddaljene od A in B.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#simetrala-daljice
besedilo: »**Simetrala daljice** je premica, ki je pravokotna na daljico in gre skozi njeno razpolovišče. Vse njene točke so enako oddaljene od obeh krajišč.« -/
theorem simetrala_daljice (A B : P) :
    midpoint ℝ A B ∈ AffineSubspace.perpBisector A B ∧
      (AffineSubspace.perpBisector A B).direction = (ℝ ∙ (B -ᵥ A))ᗮ ∧
      ∀ X : P, X ∈ AffineSubspace.perpBisector A B ↔ dist X A = dist X B :=
  ⟨AffineSubspace.midpoint_mem_perpBisector A B, AffineSubspace.direction_perpBisector A B,
    fun _ => AffineSubspace.mem_perpBisector_iff_dist_eq⟩

/-- Razlaga 2: razpolovišče daljice AB je enako oddaljeno od obeh krajišč (|AM| = |MB| = |AB|/2).
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#razpolovisce
besedilo: »**Razpolovišče** daljice je točka na njej, ki je enako oddaljena od obeh krajišč.« -/
theorem razpolovisce (A B : P) :
    dist A (midpoint ℝ A B) = dist (midpoint ℝ A B) B ∧ dist A (midpoint ℝ A B) = dist A B / 2 := by
  refine ⟨by rw [dist_left_midpoint, dist_midpoint_right], ?_⟩
  rw [dist_left_midpoint]; simp; ring

/-! ## 7. Stopinje, minute, sekunde (stopinje kot števila: x° y' = x + y/60) -/

/-- Razlaga 7 in Pogoste napake: 37°42' = 37 + 42/60 = 37,7°, ker je 42 : 60 = 0,7, in ne 37,42°.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#minute-niso-decimalke
besedilo: »kot $37^\circ 42'$ je $37^\circ$ in še $42$ minut, torej $37{,}7^\circ$ (ker je $42 : 60 = 0{,}7$), ne $37{,}42^\circ$« -/
theorem minute_niso_decimalke : (42 : ℝ) / 60 = 7 / 10 ∧ (37 : ℝ) + 42 / 60 = 377 / 10 ∧
    (37 : ℝ) + 42 / 60 ≠ 3742 / 100 := by norm_num

/-- Razlaga 7: 1 h 30 min = 1,5 h, ne 1,3 h.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#ura
besedilo: »Tako kot $1\,\text{h}\,30\,\text{min}$ ni $1{,}3\,\text{h}$« -/
theorem ura : (1 : ℝ) + 30 / 60 = 3 / 2 ∧ (1 : ℝ) + 30 / 60 ≠ 13 / 10 := by norm_num

/-- Razlaga 7: 48°35' + 27°40' = 75°75' = 76°15'.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#sestevanje-minut
besedilo: »$48^\circ 35' + 27^\circ 40' = 75^\circ 75' = 76^\circ 15'$« -/
theorem sestevanje_minut : ((48 : ℝ) + 35 / 60) + (27 + 40 / 60) = 75 + 75 / 60 ∧
    (75 : ℝ) + 75 / 60 = 76 + 15 / 60 := by norm_num

/-- Razlaga 7: 90° = 89°60' in 180° = 179°60' (izposoja stopinje).
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#izposoja
besedilo: »Pri odštevanju si po potrebi »izposodimo« stopinjo: $90^\circ = 89^\circ 60'$.« -/
theorem izposoja : (90 : ℝ) = 89 + 60 / 60 ∧ (180 : ℝ) = 179 + 60 / 60 := by norm_num

/-! ## 8. Pari kotov (geometrijsko, radiani) -/

/-- Razlaga 8 (sokota): če je ∠AVC iztegnjeni kot (V leži med A in C), je ∠BVA + ∠BVC = π (180°).
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#sokota
besedilo: »**Sokota** (sosednja kota na premici) imata skupen krak, druga dva kraka pa tvorita premico. Njuna vsota je $180^\circ$.« -/
theorem sokota {A B C V : P} (h : ∠ A V C = π) : ∠ B V A + ∠ B V C = π :=
  EuclideanGeometry.angle_add_angle_eq_pi_of_angle_eq_pi B h

/-- Razlaga 8, Ustno vprašanje 2, Bolj natančno (sovršna kota): ob presečišču V premic AC in BD (∠AVC = ∠BVD = π)
sta sovršna kota enaka: ∠AVB = ∠CVD.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#sovrsna
besedilo: »**Sovršna kota** nastaneta ob presečišču dveh premic in ležita nasproti. Sta *enaka*.« -/
theorem sovrsna {A B C D V : P} (hAC : ∠ A V C = π) (hBD : ∠ B V D = π) : ∠ A V B = ∠ C V D :=
  EuclideanGeometry.angle_eq_angle_of_angle_eq_pi_of_angle_eq_pi hAC hBD

/-- Razlaga 8, Primer 1 in Ustno vprašanje 2 v enem: premici AC in BD se sekata v V; če je ∠AVB = α, sta dva
kota enaka α (∠AVB, ∠CVD), druga dva pa π − α (∠BVC, ∠DVA).
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#stirje-koti
besedilo: »Če se dve premici sekata in je en kot $\alpha$, sta dva kota enaka $\alpha$, druga dva pa $180^\circ - \alpha$.« -/
theorem stirje_koti {A B C D V : P} (hAC : ∠ A V C = π) (hBD : ∠ B V D = π) :
    ∠ C V D = ∠ A V B ∧ ∠ B V C = π - ∠ A V B ∧ ∠ D V A = π - ∠ A V B := by
  have h1 := sovrsna hAC hBD
  have h2 := sokota (B := B) hAC
  have hCA : ∠ C V A = π := by rw [EuclideanGeometry.angle_comm]; exact hAC
  have h3 := sovrsna hBD hCA
  refine ⟨h1.symm, ?_, ?_⟩
  · rw [EuclideanGeometry.angle_comm B V A] at h2; linarith
  · rw [EuclideanGeometry.angle_comm B V A] at h2; rw [EuclideanGeometry.angle_comm D V A]
    linarith [EuclideanGeometry.angle_comm A V D]

/-- Pomožno: v ℂ okoli 0 so 1, e^{iθ}, −1, −e^{iθ} štiri točke dveh premic, ki se sekata (∠ = π) s kotom θ.
pomozno – orodje: konkretne točke v ℂ za primer izpolnljivosti -/
theorem kompleksni_primer (θ : ℝ) (h0 : 0 < θ) (hπ : θ < π) :
    ∠ (1 : ℂ) 0 (-1) = π ∧ ∠ (Complex.exp (θ * Complex.I)) 0 (-Complex.exp (θ * Complex.I)) = π ∧
      ∠ (1 : ℂ) 0 (Complex.exp (θ * Complex.I)) = θ := by
  simp only [EuclideanGeometry.angle, vsub_eq_sub, sub_zero]
  refine ⟨angle_self_neg_of_ne_zero one_ne_zero, angle_self_neg_of_ne_zero (Complex.exp_ne_zero _), ?_⟩
  rw [InnerProductGeometry.angle_comm, Complex.angle_exp_one, toIocMod_eq_self _ |>.mpr ⟨by linarith, by linarith⟩, abs_of_pos h0]

/-- Predpostavke trditev `kompleksni_primer`, `sokota`, `sovrsna`, `stirje_koti` se dajo izpolniti (θ = 54°,
premici v ℂ s kotom 54°). -/
example : (0 : ℝ) < 54 * π / 180 ∧ 54 * π / 180 < π ∧ ∠ (1 : ℂ) 0 (-1) = π ∧
    ∠ (Complex.exp ((54 * π / 180 : ℝ) * Complex.I)) 0 (-Complex.exp ((54 * π / 180 : ℝ) * Complex.I)) = π :=
  let h := kompleksni_primer (54 * π / 180) (by positivity) (by linarith [pi_pos])
  ⟨by positivity, by linarith [pi_pos], h.1, h.2.1⟩

/-- Primer 1 (geometrijsko): premici AC in BD se sekata v V, ∠AVB = 54°. Potem je sovršni kot ∠CVD = 54°, sokot
∠BVC = 180° − 54° = 126°, četrti kot ∠DVA = 126° in vsota vseh štirih je 360°.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#primer1
besedilo: »Odgovor: ostali trije kosi imajo pri konici kote $54^\circ$, $126^\circ$ in $126^\circ$.« -/
theorem primer1 {A B C D V : P} (hAC : ∠ A V C = π) (hBD : ∠ B V D = π) (hα : ∠ A V B = 54 * π / 180) :
    ∠ C V D = 54 * π / 180 ∧ ∠ B V C = 126 * π / 180 ∧ ∠ D V A = 126 * π / 180 ∧
      ∠ A V B + ∠ B V C + ∠ C V D + ∠ D V A = 360 * π / 180 := by
  obtain ⟨h1, h2, h3⟩ := stirje_koti hAC hBD
  rw [hα] at h1 h2 h3
  refine ⟨h1, ?_, ?_, ?_⟩
  · rw [h2]; ring
  · rw [h3]; ring
  · rw [hα, h1, h2, h3]; ring

/-- Predpostavke trditve `primer1` se dajo izpolniti (V = 0, A = 1, C = −1, B = e^{i·54°}, D = −B v ℂ). -/
example : ∠ (1 : ℂ) 0 (-1) = π ∧
    ∠ (Complex.exp ((54 * π / 180 : ℝ) * Complex.I)) 0 (-Complex.exp ((54 * π / 180 : ℝ) * Complex.I)) = π ∧
    ∠ (1 : ℂ) 0 (Complex.exp ((54 * π / 180 : ℝ) * Complex.I)) = 54 * π / 180 :=
  kompleksni_primer (54 * π / 180) (by positivity) (by linarith [pi_pos])

/-- Primer 1 v stopinjah: γ = α = 54°, β = 180° − 54° = 126°, δ = β = 126°, preizkus 54 + 126 + 54 + 126 = 360.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#primer1-stopinje
besedilo: »$\beta = 180^\circ - 54^\circ = 126^\circ$. 3. Četrti kot je sovršen kotu $\beta$: $\delta = \beta = 126^\circ$. 4. Preizkus: $54^\circ + 126^\circ + 54^\circ + 126^\circ = 360^\circ$« -/
theorem primer1_stopinje : (180 : ℝ) - 54 = 126 ∧ (54 : ℝ) + 126 + 54 + 126 = 360 := by norm_num

/-- Primer 2: α = 37°42'; komplementarni kot β = 89°60' − 37°42' = 52°18', sokot γ = 179°60' − 37°42' = 142°18',
preizkus 37°42' + 52°18' = 89°60' = 90° in 37°42' + 142°18' = 179°60' = 180°.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#primer2
besedilo: »Odgovor: komplementarni kot meri $52^\circ 18'$, sokot pa $142^\circ 18'$.« -/
theorem primer2 :
    (90 : ℝ) - (37 + 42 / 60) = (89 + 60 / 60) - (37 + 42 / 60) ∧
    (89 + 60 / 60 : ℝ) - (37 + 42 / 60) = 52 + 18 / 60 ∧
    (180 : ℝ) - (37 + 42 / 60) = (179 + 60 / 60) - (37 + 42 / 60) ∧
    (179 + 60 / 60 : ℝ) - (37 + 42 / 60) = 142 + 18 / 60 ∧
    (37 + 42 / 60 : ℝ) + (52 + 18 / 60) = 89 + 60 / 60 ∧ (89 + 60 / 60 : ℝ) = 90 ∧
    (37 + 42 / 60 : ℝ) + (142 + 18 / 60) = 179 + 60 / 60 ∧ (179 + 60 / 60 : ℝ) = 180 := by
  norm_num

/-! ## 9. Koti ob prečnici vzporednic -/

/-- Razlaga 9 in Povzetek (istoležna kota): p ∋ P, A in q ∋ Q, B vzporedni (B − Q = r(A − P), r > 0), prečnica
skozi P in Q, X na prečnici onkraj P (X − P = s(P − Q), s > 0). Potem je istoležni kot ∠XPA = ∠PQB.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#istolezna
besedilo: »**istoležna**: na isti strani prečnice, oba nad ali oba pod svojo premico; pri $p \parallel q$ sta enaka« -/
theorem istolezna {A B P₀ Q X : P} {r s : ℝ} (hr : 0 < r) (hs : 0 < s) (hB : B -ᵥ Q = r • (A -ᵥ P₀))
    (hX : X -ᵥ P₀ = s • (P₀ -ᵥ Q)) : ∠ X P₀ A = ∠ P₀ Q B := by
  simp only [EuclideanGeometry.angle, hB, hX]
  rw [angle_smul_left_of_pos _ _ hs, angle_smul_right_of_pos _ _ hr]

/-- Razlaga 9 (izmenična kota): pri istih vzporednicah je B' na q na drugi strani prečnice
(B' − Q = −r(A − P), r > 0); izmenična kota med vzporednicama sta enaka: ∠APQ = ∠B'QP.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#izmenicna
besedilo: »**izmenična**: oba med vzporednicama (ali oba zunaj), na nasprotnih straneh prečnice; pri $p \parallel q$ sta enaka« -/
theorem izmenicna {A B' P₀ Q : P} {r : ℝ} (hr : 0 < r) (hB : B' -ᵥ Q = -(r • (A -ᵥ P₀))) :
    ∠ A P₀ Q = ∠ B' Q P₀ := by
  simp only [EuclideanGeometry.angle, hB]
  rw [← neg_vsub_eq_vsub_rev Q P₀, angle_neg_neg, angle_smul_left_of_pos _ _ hr]

/-- Razlaga 9 in Povzetek (notranja kota na isti strani prečnice): ∠APQ + ∠BQP = π (180°).
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#notranja
besedilo: »**notranja na isti strani prečnice**: med vzporednicama, na isti strani prečnice; pri $p \parallel q$ je njuna vsota $180^\circ$« -/
theorem notranja {A B P₀ Q : P} {r : ℝ} (hr : 0 < r) (hB : B -ᵥ Q = r • (A -ᵥ P₀)) :
    ∠ A P₀ Q + ∠ B Q P₀ = π := by
  simp only [EuclideanGeometry.angle, hB]
  rw [← neg_vsub_eq_vsub_rev Q P₀, angle_smul_left_of_pos _ _ hr, angle_neg_right]
  ring

/-- Predpostavke trditev `istolezna`, `izmenicna`, `notranja` se dajo izpolniti: za poljubne A, P, Q in r = s = 1
točke B = (A − P) + Q, B' = −(A − P) + Q, X = (P − Q) + P zadoščajo pogojem. -/
example (A P₀ Q : P) :
    ((A -ᵥ P₀) +ᵥ Q) -ᵥ Q = (1 : ℝ) • (A -ᵥ P₀) ∧ (-(A -ᵥ P₀) +ᵥ Q) -ᵥ Q = -((1 : ℝ) • (A -ᵥ P₀)) ∧
      ((P₀ -ᵥ Q) +ᵥ P₀) -ᵥ P₀ = (1 : ℝ) • (P₀ -ᵥ Q) := by
  simp

/-- Razlaga 9: pri t ⊥ p so vsi koti pravi: če je ∠APQ = π/2, je tudi notranji kot ∠BQP = π/2.
pomozno – lekcija trdi »pri t ⊥ p so vsi pravi«, izrek pa le, da je notranji kot pri q pravi -/
theorem pravokotna_precnica {A B P₀ Q : P} {r : ℝ} (hr : 0 < r) (hB : B -ᵥ Q = r • (A -ᵥ P₀))
    (h : ∠ A P₀ Q = π / 2) : ∠ B Q P₀ = π / 2 := by
  have := notranja hr hB; linarith

/-- Predpostavke trditve `pravokotna_precnica` se dajo izpolniti: P = 0, A = i, Q = 1, B = 1 + i v ℂ, r = 1. -/
example : (1 + Complex.I) -ᵥ (1 : ℂ) = (1 : ℝ) • (Complex.I -ᵥ (0 : ℂ)) ∧ ∠ Complex.I (0 : ℂ) 1 = π / 2 := by
  refine ⟨by simp, ?_⟩
  rw [EuclideanGeometry.angle, ← InnerProductGeometry.inner_eq_zero_iff_angle_eq_pi_div_two]
  simp [Complex.inner]

/-- Primer 3: α + β = 180° (notranja kota) in α − β = 40° natanko tedaj, ko α = 110°, β = 70°; po korakih:
seštejemo, 2α = 220°, α = 110°, β = 180° − 110° = 70°.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#primer3
besedilo: »Enačbi seštejemo: $2\alpha = 220^\circ$, torej $\alpha = 110^\circ$. 3. $\beta = 180^\circ - 110^\circ = 70^\circ$.« -/
theorem primer3 (α β : ℝ) : (α + β = 180 ∧ α - β = 40) ↔ (α = 110 ∧ β = 70) := by
  constructor
  · rintro ⟨h1, h2⟩
    have h3 : 2 * α = 220 := by linarith
    have hα : α = 110 := by linarith
    have hβ : β = 180 - 110 := by linarith
    exact ⟨hα, by rw [hβ]; norm_num⟩
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Primer 3, korak 4 in preizkus: γ = β = 70° (izmenična), 110 + 70 = 180, 110 − 70 = 40.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#primer3-preizkus
besedilo: »Preizkus: $110^\circ + 70^\circ = 180^\circ$ in $110^\circ - 70^\circ = 40^\circ$.« -/
theorem primer3_preizkus : (110 : ℝ) + 70 = 180 ∧ (110 : ℝ) - 70 = 40 := by norm_num

/-- Primer 4 (premisli): sokota x in 3x: x + 3x = 180° ⇔ 4x = 180° ⇔ x = 45°; 3x = 135°, preizkus 45 + 135 = 180,
istoležni kot je 135°.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#primer4
besedilo: »$x = 180^\circ : 4 = 45^\circ$« -/
theorem primer4 (x : ℝ) : x + 3 * x = 180 ↔ x = 45 := by
  constructor
  · intro h
    have h4 : 4 * x = 180 := by linarith
    linarith
  · rintro rfl; norm_num

/-- Primer 4, vrednosti: 3·45 = 135 in 45 + 135 = 180.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#primer4-vrednosti
besedilo: »$3x = 135^\circ$. Preizkus: $45^\circ + 135^\circ = 180^\circ$.« -/
theorem primer4_vrednosti : (3 : ℝ) * 45 = 135 ∧ (45 : ℝ) + 135 = 180 := by norm_num

/-- Primer 5: drogova 3 m in 8 m, žica 13 m: kateta 8 − 3 = 5, |A'B'|² = 13² − 5² = 169 − 25 = 144, |A'B'| = 12 m;
po formuli `projekcija_ista_stran` je to edina pozitivna rešitev.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#primer5
besedilo: »Pitagorov izrek: $|A'B'|^2 = 13^2 - 5^2 = 169 - 25 = 144$, zato $|A'B'| = 12\,\text{m}$.« -/
theorem primer5 (d : ℝ) (hd : 0 < d) (h : d ^ 2 = 13 ^ 2 - (8 - 3) ^ 2) : d = 12 := by
  have h1 : (13 : ℝ) ^ 2 - (8 - 3) ^ 2 = 13 ^ 2 - 5 ^ 2 := by norm_num
  have h2 : (13 : ℝ) ^ 2 - 5 ^ 2 = 169 - 25 := by norm_num
  have h3 : (169 : ℝ) - 25 = 144 := by norm_num
  rw [h1, h2, h3] at h
  nlinarith [sq_nonneg (d - 12), sq_nonneg (d + 12)]

/-- Predpostavke trditve `primer5` se dajo izpolniti (d = 12). -/
example : (0 : ℝ) < 12 ∧ (12 : ℝ) ^ 2 = 13 ^ 2 - (8 - 3) ^ 2 := by norm_num

/-- Drugače: Na sliki: kot 1 = 65°, sokot 180° − 65° = 115°, notranja kota 2 in 5: 115 + 65 = 180.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#na-sliki
besedilo: »Kota $2$ in $5$ sta notranja na isti strani prečnice: $115^\circ + 65^\circ = 180^\circ$.« -/
theorem na_sliki : (180 : ℝ) - 65 = 115 ∧ (115 : ℝ) + 65 = 180 := by norm_num

/-- Iz vsakdanjega življenja (kuhinjska ura): ob štirih 4·30° = 120°, ob treh 3·30° = 90°, ob šestih 6·30° = 180°
(urna mesta so po 360°/12 = 30°).
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#ura-kazalca
besedilo: »Ob štirih kazalca oklepata $4 \cdot 30^\circ = 120^\circ$« -/
theorem ura_kazalca : (360 : ℝ) / 12 = 30 ∧ (4 : ℝ) * 30 = 120 ∧ (3 : ℝ) * 30 = 90 ∧ (6 : ℝ) * 30 = 180 := by
  norm_num

/-! ## Za maturo -/

/-- Naloga 1: vsota 129°20' ni 180° (kota nista sokota, zato sta sovršna); vsak meri 129°20' : 2 = 128°80' : 2 =
64°40'; sokot 179°60' − 64°40' = 115°20'; preizkus 64°40' + 115°20' = 179°60' = 180° in 2·180° = 360°.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#naloga1
besedilo: »Vsak od njiju meri $129^\circ 20' : 2 = 128^\circ 80' : 2 = 64^\circ 40'$. 3. Preostala kota sta sokota kota $64^\circ 40'$: $179^\circ 60' - 64^\circ 40' = 115^\circ 20'$. 4. Preizkus: $64^\circ 40' + 115^\circ 20' = 179^\circ 60' = 180^\circ$, zato je vsota vseh štirih kotov $2 \cdot 180^\circ = 360^\circ$.« -/
theorem naloga1 :
    (129 + 20 / 60 : ℝ) ≠ 180 ∧
    (129 + 20 / 60 : ℝ) / 2 = (128 + 80 / 60) / 2 ∧ (128 + 80 / 60 : ℝ) / 2 = 64 + 40 / 60 ∧
    (179 + 60 / 60 : ℝ) - (64 + 40 / 60) = 115 + 20 / 60 ∧
    (64 + 40 / 60 : ℝ) + (115 + 20 / 60) = 179 + 60 / 60 ∧ (179 + 60 / 60 : ℝ) = 180 ∧ (2 : ℝ) * 180 = 360 := by
  norm_num

/-- Naloga 1 (vse rešitve): če sta dva kota ob presečišču enaka (sovršna) z vsoto 129°20', in sta druga dva
njuna sokota, so koti natanko 64°40', 115°20', 64°40', 115°20'.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#naloga1-iff
besedilo: »Odgovor: koti merijo $64^\circ 40'$, $115^\circ 20'$, $64^\circ 40'$ in $115^\circ 20'$.« -/
theorem naloga1_iff (a b c d : ℝ) :
    (a = c ∧ a + c = 129 + 20 / 60 ∧ a + b = 180 ∧ c + d = 180) ↔
      (a = 64 + 40 / 60 ∧ b = 115 + 20 / 60 ∧ c = 64 + 40 / 60 ∧ d = 115 + 20 / 60) := by
  constructor
  · rintro ⟨h1, h2, h3, h4⟩
    refine ⟨by linarith, by linarith, by linarith, by linarith⟩
  · rintro ⟨rfl, rfl, rfl, rfl⟩; norm_num

/-- `RACUN`: (129 + 20/60)/2 = 64 + 40/60, 180 − (64 + 40/60) = 115 + 20/60, 2(64 + 40/60) + 2(115 + 20/60) = 360.
pomozno – ponovi račun iz bloka RACUN; vidni račun Naloge 1 pokriva naloga1 -/
theorem racun_naloga1 : (129 + 20 / 60 : ℝ) / 2 = 64 + 40 / 60 ∧ (180 : ℝ) - (64 + 40 / 60) = 115 + 20 / 60 ∧
    2 * (64 + 40 / 60 : ℝ) + 2 * (115 + 20 / 60) = 360 := by norm_num

/-- Naloga 2 a) in `RACUN`: 2y + 10 = 4y − 30 ⇔ 2y = 40 ⇔ y = 20; oba kota merita 2·20 + 10 = 4·20 − 30 = 50.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#naloga2a
besedilo: »$2y + 10^\circ = 4y - 30^\circ$. 2. a) $2y = 40^\circ$, torej $y = 20^\circ$.« -/
theorem naloga2a (y : ℝ) : 2 * y + 10 = 4 * y - 30 ↔ y = 20 := by
  constructor
  · intro h
    have h2 : 2 * y = 40 := by linarith
    linarith
  · rintro rfl; norm_num

/-- Naloga 2 b), c) in `RACUN`: 2·20 + 10 = 50, 4·20 − 30 = 50, sokot 180 − 50 = 130, ostri kot med r in t je
90 − 50 = 40 (r ⊥ q glej `pravokotna_na_vzporednico`).
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#naloga2-vrednosti
besedilo: »ob presečišču $t$ in $q$ so koti $50^\circ$, $130^\circ$, $50^\circ$ in $130^\circ$; ostri kot med $r$ in $t$ meri $40^\circ$« -/
theorem naloga2_vrednosti : (2 : ℝ) * 20 + 10 = 50 ∧ (4 : ℝ) * 20 - 30 = 50 ∧ (180 : ℝ) - 50 = 130 ∧
    (90 : ℝ) - 50 = 40 := by norm_num

/-! ## Preveri se in `RACUN` -/

/-- Pogoj za štiri kote okoli presečišča po vrsti: sosednja sta sokota, nasprotna sta enaka. -/
def mozenZapis (a b c d : ℝ) : Prop := a + b = 180 ∧ b + c = 180 ∧ c + d = 180 ∧ d + a = 180 ∧ a = c ∧ b = d

/-- Preveri se 1: mogoč je le zapis 40°, 140°, 40°, 140°; drugi trije niso mogoči.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#kviz1
besedilo: »Nasprotna (sovršna) kota sta enaka, sosednja (sokota) imata vsoto $180^\circ$: $40^\circ + 140^\circ = 180^\circ$.« -/
theorem kviz1 : mozenZapis 40 140 40 140 ∧ ¬ mozenZapis 40 140 140 40 ∧ ¬ mozenZapis 40 50 40 50 ∧
    ¬ mozenZapis 40 140 60 120 := by
  unfold mozenZapis; norm_num

/-- Preveri se 2: 25°50' = 25 + 50/60 ≈ 25,8° (na desetinko: |25 + 50/60 − 25,8| < 0,05); ni 25,5° in ni 26° na
desetinko natančno.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#kviz2
besedilo: »$50' = \dfrac{50}{60}^\circ \approx 0{,}83^\circ$, torej je $25^\circ 50' \approx 25{,}8^\circ$.« -/
theorem kviz2 : |(25 + 50 / 60 : ℝ) - 258 / 10| < 5 / 100 ∧ ¬ |(25 + 50 / 60 : ℝ) - 255 / 10| < 5 / 100 ∧
    ¬ |(25 + 50 / 60 : ℝ) - 26| < 5 / 100 := by
  refine ⟨?_, ?_, ?_⟩ <;> rw [abs_lt] <;> norm_num

/-- Preveri se 3: α + β = 180 in γ + β = 180 ⇒ α = 180 − β = γ.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#kviz3
besedilo: »Če je $\alpha + \beta = 180^\circ$ in $\gamma + \beta = 180^\circ$, je $\alpha = 180^\circ - \beta = \gamma$.« -/
theorem kviz3 (α β γ : ℝ) (h1 : α + β = 180) (h2 : γ + β = 180) : α = 180 - β ∧ 180 - β = γ :=
  ⟨by linarith, by linarith⟩

/-- Predpostavke trditve `kviz3` se dajo izpolniti (α = γ = 40, β = 140). -/
example : (40 : ℝ) + 140 = 180 := by norm_num

/-- Preveri se 4: x + y = 90 in x − y = 20 ⇔ x = 55, y = 35 (večji kot je 55°).
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#kviz4
besedilo: »Seštejemo: $2x = 110^\circ$, $x = 55^\circ$, $y = 35^\circ$.« -/
theorem kviz4 (x y : ℝ) : (x + y = 90 ∧ x - y = 20) ↔ (x = 55 ∧ y = 35) := by
  constructor
  · rintro ⟨h1, h2⟩
    have h3 : 2 * x = 110 := by linarith
    exact ⟨by linarith, by linarith⟩
  · rintro ⟨rfl, rfl⟩; norm_num

/-- `RACUN`: x + (x − 20) = 90 ⇔ x = 55.
pomozno – račun iz bloka RACUN -/
theorem racun_kviz4 (x : ℝ) : x + (x - 20) = 90 ↔ x = 55 := by
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Preveri se 5: notranja kota na isti strani prečnice vzporednic: 180° − 72° = 108°.
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#kviz5
besedilo: »$180^\circ - 72^\circ = 108^\circ$« -/
theorem kviz5 : (180 : ℝ) - 72 = 108 := by norm_num

/-- Preveri se 5 (napačna odgovora): 72° + 72° ≠ 180° in 72° + 18° = 90° ≠ 180°; vsoto 180° da le 108°.
pomozno – kviz – napačni odgovori; povratna informacija teh enakosti ne pove -/
theorem kviz5_napacni (x : ℝ) : ((72 : ℝ) + x = 180 ↔ x = 108) ∧ (72 : ℝ) + 72 ≠ 180 ∧ (72 : ℝ) + 18 = 90 ∧
    (72 : ℝ) + 18 ≠ 180 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 6 in `RACUN`: |A'B'|² = 10² − (9 − 1)² = 100 − 64 = 36, |A'B'| = 6 cm (napačni odgovori 8, 10, 0 so
druge vrednosti: √(10² − 10²) = 0).
trditev: MAT-SS-1/osnovni-geometrijski-pojmi#kviz6
besedilo: »$|A'B'|^2 = 100 - 64 = 36$, zato $|A'B'| = 6\,\text{cm}$« -/
theorem kviz6 : (10 : ℝ) ^ 2 - (9 - 1) ^ 2 = 100 - 64 ∧ (100 : ℝ) - 64 = 36 ∧
    √((10 : ℝ) ^ 2 - (9 - 1) ^ 2) = 6 ∧ √((10 : ℝ) ^ 2 - (1 + 9) ^ 2) = 0 := by
  refine ⟨by norm_num, by norm_num, ?_, ?_⟩
  · rw [show (10 : ℝ) ^ 2 - (9 - 1) ^ 2 = 6 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · norm_num

/-- `RACUN`: √(5² − (4 − 1)²) = 4 in √(13² − (8 − 3)²) = 12.
pomozno – račun iz bloka RACUN -/
theorem racun_projekcije : √((5 : ℝ) ^ 2 - (4 - 1) ^ 2) = 4 ∧ √((13 : ℝ) ^ 2 - (8 - 3) ^ 2) = 12 := by
  constructor
  · rw [show (5 : ℝ) ^ 2 - (4 - 1) ^ 2 = 4 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  · rw [show (13 : ℝ) ^ 2 - (8 - 3) ^ 2 = 12 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

end Evklid.Lekcije.MAT_SS_1.OsnovniGeometrijskiPojmi
