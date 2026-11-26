/-
vir: content/lessons/MAT-OS-6/osnovni-geometrijski-pojmi.md
sha256: 0cbd94f22d01a9dd8c32c5da4e0eb816d7aec1ab15221ef15711329038871e37
Model: ravnina je evklidska ravnina `EuclideanSpace ℝ (Fin 2)` (`Ravnina`). Premica je afini podprostor s smerjo
dimenzije 1 (`Premica`); »A leži na p« je `A ∈ p`. Premici sta vzporedni (`Vzporedni`), če sta premici brez skupne
točke (definicija iz lekcije, razlaga 7; različnost sledi); pravokotni (`Pravokotni`), če sta njuni smeri pravokotni
(`Submodule.IsOrtho`), da se sekata, je dokazano (`pravokotni_sekata`). Daljica AB je `segment ℝ A B`, »C leži na
daljici AB« je `Wbtw ℝ A C B`, |AB| je `dist A B`; razpolovišče je `midpoint ℝ A B`. Poltrak XY je množica
X + t · (Y − X) za t ≥ 0 (`poltrak`). Pravila za daljice in poltrake so dokazana v vsakem realnem normiranem
prostoru E (torej tudi v ravnini); primeri izpolnljivosti in računi z daljicami so na številski premici ℝ, kjer ležijo
vse točke teh nalog. Razdalja točke T od premice p je |TY|, kjer je Y ∈ p nožišče (T − Y pravokoten na smer p).
Daljice, ki jih določa n točk na premici, so dvoelementne podmnožice množice točk (`Finset.powersetCard 2`), ker je
daljica AB ista kot BA. Dolžine v cm so le v docstringih; decimalna števila so točni ulomki.
Ni v Leanu: točka »nima velikosti« in ravnina kot ploskev (osnovna pojma, opis); zgodbe (Luka, kuhinja, mama, mojster)
kot opis, dokazani so njihovi računi in sklepi; risbe in tabela »začetek/konec/merljiva« kot opis (dokazano je, da je
poltrak neomejen, daljica pa omejena z |AB|); poskus z ravnilom, risanje z geotrikotnikom in ravnilom (postopek B),
merjenje z ravnilom kot postopek (dokazan je račun 7,5 − 1 = 6,5); pravi kot »kot vogal lista« kot opis (pravokotnost
je pravokotnost smeri); »vodoravna in navpična« ter »na listu se ne srečata« kot opis; da preverjanje razdalje na
dveh mestih zadošča za vzporednost (zahtevno, še ni dokazano; dokazano je, da imata vzporednici povsod enako
razdaljo); da je razdalja med vzporednicama 4 cm (podatek Primera 3; dokazano je, da je potem tudi razdalja T od b
enaka) in »če dobiš 3 cm in 3,4 cm, premici nista vzporedni« (sledi iz `enako_narazen`, ni zapisano posebej);
Primer 1 a) in razlaga 3 kot zapis (A ∈ p, D ∉ p); razdalja med točkama kot definicija (`dist`); »dve krajišči« pri premici in poltraku kot štetje krajišč (dokazana je neomejenost); razlage napačnih
odgovorov v kvizih, razen kjer so dokazane kot račun ali izrek.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.OsnovniGeometrijskiPojmi

open Module Submodule

/-- Ravnina iz lekcije: evklidska ravnina. -/
abbrev Ravnina := EuclideanSpace ℝ (Fin 2)

/-- Premica: afini podprostor ravnine s smerjo dimenzije 1. -/
def Premica (p : AffineSubspace ℝ Ravnina) : Prop := finrank ℝ p.direction = 1

/-- Vzporedni premici (razlaga 7): premici brez skupne točke. -/
def Vzporedni (p q : AffineSubspace ℝ Ravnina) : Prop :=
  Premica p ∧ Premica q ∧ Disjoint (p : Set Ravnina) (q : Set Ravnina)

/-- Pravokotni premici: premici s pravokotnima smerema. -/
def Pravokotni (p q : AffineSubspace ℝ Ravnina) : Prop :=
  Premica p ∧ Premica q ∧ p.direction ⟂ q.direction

/-- Poltrak XY: točke X + t · (Y − X) za t ≥ 0. -/
def poltrak {E : Type*} [NormedAddCommGroup E] [NormedSpace ℝ E] (X Y : E) : Set E :=
  AffineMap.lineMap X Y '' Set.Ici (0 : ℝ)

/-! ## Pomožne trditve -/

/-- Točka (1, 0). -/
noncomputable def E1 : Ravnina := EuclideanSpace.single 0 1
/-- Točka (0, 1). -/
noncomputable def E2 : Ravnina := EuclideanSpace.single 1 1
/-- Točka (0, −1). -/
noncomputable def E3 : Ravnina := EuclideanSpace.single 1 (-1)
/-- Os x: premica skozi (0, 0) in (1, 0). -/
noncomputable def osx : AffineSubspace ℝ Ravnina := line[ℝ, (0 : Ravnina), E1]

/-- Pomožno: premica ni prazna.
pomozno – orodje: premica (smer dimenzije 1) ima točko -/
theorem Premica.nonempty {p : AffineSubspace ℝ Ravnina} (hp : Premica p) : (p : Set Ravnina).Nonempty := by
  by_contra h
  rw [Set.not_nonempty_iff_eq_empty, AffineSubspace.coe_eq_bot_iff] at h
  subst h
  rw [Premica, AffineSubspace.direction_bot, finrank_bot] at hp
  exact absurd hp (by norm_num)

/-- Pomožno: dve različni smeri dimenzije 1 v ravnini skupaj napneta vso ravnino.
pomozno – orodje: vsota različnih enodimenzionalnih podprostorov ravnine -/
theorem sup_eq_top {U W : Submodule ℝ Ravnina} (hU : finrank ℝ U = 1) (hW : finrank ℝ W = 1) (h : U ≠ W) :
    U ⊔ W = ⊤ := by
  apply Submodule.eq_top_of_finrank_eq
  rw [finrank_euclideanSpace_fin]
  have hlt : U < U ⊔ W := by
    refine lt_of_le_of_ne le_sup_left fun e => h ?_
    have hle : W ≤ U := e ▸ le_sup_right
    exact (Submodule.eq_of_le_of_finrank_eq hle (by rw [hU, hW])).symm
  have h1 := Submodule.finrank_lt_finrank_of_lt hlt
  have h2 : finrank ℝ (U ⊔ W : Submodule ℝ Ravnina) ≤ 2 := by
    have := Submodule.finrank_le (U ⊔ W)
    rwa [finrank_euclideanSpace_fin] at this
  omega

/-- Pomožno: premici sta brez skupne točke natanko tedaj, ko imata isto smer in sta različni.
pomozno – orodje: vzporednost kot ista smer -/
theorem disjoint_iff {p q : AffineSubspace ℝ Ravnina} (hp : Premica p) (hq : Premica q) :
    Disjoint (p : Set Ravnina) (q : Set Ravnina) ↔ p.direction = q.direction ∧ p ≠ q := by
  constructor
  · intro hd
    have hdir : p.direction = q.direction := by
      by_contra hne
      obtain ⟨X, hX⟩ := AffineSubspace.inter_nonempty_of_nonempty_of_sup_direction_eq_top hp.nonempty
        hq.nonempty (sup_eq_top hp hq hne)
      exact Set.disjoint_left.mp hd hX.1 hX.2
    refine ⟨hdir, fun e => ?_⟩
    subst e
    obtain ⟨X, hX⟩ := hp.nonempty
    exact Set.disjoint_left.mp hd hX hX
  · rintro ⟨hdir, hne⟩
    rw [Set.disjoint_left]
    intro X hXp hXq
    exact hne (AffineSubspace.ext_of_direction_eq hdir ⟨X, hXp, hXq⟩)

/-- Pomožno: premica skozi dve različni točki.
pomozno – orodje: premica AB ima smer dimenzije 1 -/
theorem premica_pair {A B : Ravnina} (h : A ≠ B) : Premica line[ℝ, A, B] := by
  rw [Premica, direction_affineSpan, vectorSpan_pair]
  exact finrank_span_singleton (vsub_ne_zero.mpr h)

/-- Pomožno: koordinate točk E1, E2, E3.
pomozno – orodje: koordinate konkretnih točk -/
theorem koord : E1 0 = 1 ∧ E1 1 = 0 ∧ E2 0 = 0 ∧ E2 1 = 1 ∧ E3 0 = 0 ∧ E3 1 = -1 := by
  simp [E1, E2, E3]

/-- Pomožno: (0, 0) ≠ (1, 0) in (0, 0) ≠ (0, 1).
pomozno – konkretne točke za primere izpolnljivosti -/
theorem o_ne : (0 : Ravnina) ≠ E1 ∧ (0 : Ravnina) ≠ E2 := by
  constructor
  · intro h; have := congrArg (fun v : Ravnina => v 0) h; simp [koord.1] at this
  · intro h; have := congrArg (fun v : Ravnina => v 1) h; simp [koord.2.2.2.1] at this

/-- Pomožno: os x je premica.
pomozno – konkretna premica za primere izpolnljivosti -/
theorem premica_osx : Premica osx := premica_pair o_ne.1

/-- Pomožno: smer osi x so vektorji z drugo koordinato 0, točke osi x imajo drugo koordinato 0.
pomozno – orodje: opis osi x v koordinatah -/
theorem osx_koord : (∀ v ∈ osx.direction, v 1 = 0) ∧ (∀ X ∈ osx, X 1 = 0) := by
  constructor
  · intro v hv
    rw [osx, direction_affineSpan, vectorSpan_pair, Submodule.mem_span_singleton] at hv
    obtain ⟨r, rfl⟩ := hv
    simp [koord.2.1]
  · intro X hX
    rw [osx, mem_affineSpan_pair_iff_exists_lineMap_eq] at hX
    obtain ⟨r, rfl⟩ := hX
    simp [AffineMap.lineMap_apply, koord.2.1]

/-- Pomožno: (0, 1) in (0, −1) ne ležita na osi x.
pomozno – konkretni točki za primere izpolnljivosti -/
theorem ne_na_osx : E2 ∉ osx ∧ E3 ∉ osx := by
  constructor
  · intro h; have := osx_koord.2 _ h; rw [koord.2.2.2.1] at this; norm_num at this
  · intro h; have := osx_koord.2 _ h; rw [koord.2.2.2.2.2] at this; norm_num at this

/-! ## Razlaga 2 in 6: premice -/

/-- Razlaga 2, Povzetek 1, Preveri se 1: skozi dve različni točki gre natanko ena premica.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#dve-tocki
besedilo: »Skozi dve različni točki gre natanko ena premica, premica $AB$.« -/
theorem dve_tocki (A B : Ravnina) (h : A ≠ B) : ∃! p, Premica p ∧ A ∈ p ∧ B ∈ p := by
  refine ⟨line[ℝ, A, B], ⟨premica_pair h, left_mem_affineSpan_pair ℝ A B, right_mem_affineSpan_pair ℝ A B⟩, ?_⟩
  rintro q ⟨hq, hA, hB⟩
  have hle := affineSpan_pair_le_of_mem_of_mem hA hB
  have hdir : line[ℝ, A, B].direction = q.direction :=
    Submodule.eq_of_le_of_finrank_eq (AffineSubspace.direction_le hle) (by rw [premica_pair h, hq])
  exact (AffineSubspace.ext_of_direction_eq hdir ⟨A, left_mem_affineSpan_pair ℝ A B, hA⟩).symm

/-- Predpostavka trditve `dve_tocki` se da izpolniti, izrek uporabljen na točkah (0, 0) in (1, 0). -/
example := dve_tocki 0 E1 o_ne.1

/-- Razlaga 2, Preveri se 1: skozi eno točko gre neskončno mnogo premic.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#ena-tocka
besedilo: »Skozi eno točko jih gre neskončno mnogo.« -/
theorem ena_tocka (A : Ravnina) : Set.Infinite {p : AffineSubspace ℝ Ravnina | Premica p ∧ A ∈ p} := by
  have key : ∀ t : ℝ, (E1 + t • E2) 0 = 1 ∧ (E1 + t • E2) 1 = t := fun t => by
    simp [koord.1, koord.2.1, koord.2.2.1, koord.2.2.2.1]
  refine Set.infinite_of_injective_forall_mem
    (f := fun t : ℝ => AffineSubspace.mk' A (ℝ ∙ (E1 + t • E2))) ?_ ?_
  · intro s t hst
    have hd := congrArg AffineSubspace.direction hst
    simp only [AffineSubspace.direction_mk'] at hd
    have hmem : E1 + s • E2 ∈ ℝ ∙ (E1 + t • E2) := hd ▸ Submodule.mem_span_singleton_self _
    obtain ⟨c, hc⟩ := Submodule.mem_span_singleton.mp hmem
    have e0 := congrArg (fun w : Ravnina => w 0) hc
    have e1 := congrArg (fun w : Ravnina => w 1) hc
    simp only [PiLp.smul_apply, smul_eq_mul, (key _).1, (key _).2] at e0 e1
    rw [mul_one] at e0
    rw [e0, one_mul] at e1
    exact e1.symm
  · intro t
    refine ⟨?_, AffineSubspace.self_mem_mk' A _⟩
    show finrank ℝ (AffineSubspace.mk' A _).direction = 1
    rw [AffineSubspace.direction_mk']
    apply finrank_span_singleton
    intro h
    have := (key t).1
    rw [h] at this
    simp at this

/-- Razlaga 6 (premisli): dve različni premici imata največ eno skupno točko.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#najvec-ena
besedilo: »Dve različni premici imata največ eno skupno točko.« -/
theorem najvec_ena (p q : AffineSubspace ℝ Ravnina) (hp : Premica p) (hq : Premica q) (hpq : p ≠ q)
    (A B : Ravnina) (hA : A ∈ p ∧ A ∈ q) (hB : B ∈ p ∧ B ∈ q) : A = B := by
  by_contra h
  exact hpq ((dve_tocki A B h).unique ⟨hp, hA.1, hB.1⟩ ⟨hq, hA.2, hB.2⟩)

/-- Pomožno: os y (premica skozi (0, 0) in (0, 1)) ni os x.
pomozno – konkretni premici za primere izpolnljivosti -/
theorem osy_ne_osx : line[ℝ, (0 : Ravnina), E2] ≠ osx := fun e =>
  ne_na_osx.1 (e ▸ right_mem_affineSpan_pair ℝ _ _)

/-- Predpostavke trditve `najvec_ena` se dajo izpolniti: os y in os x se sekata le v (0, 0). -/
example := najvec_ena line[ℝ, (0 : Ravnina), E2] osx (premica_pair o_ne.2) premica_osx osy_ne_osx 0 0
  ⟨left_mem_affineSpan_pair ℝ _ _, left_mem_affineSpan_pair ℝ _ _⟩
  ⟨left_mem_affineSpan_pair ℝ _ _, left_mem_affineSpan_pair ℝ _ _⟩

/-- Razlaga 6, Povzetek 5: za dve različni premici velja natanko ena od možnosti: imata natanko eno skupno točko
(sekata se) ali pa sta vzporedni (nimata skupne točke).
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#sekata-ali-vzporedni
besedilo: »Dve različni premici se sekata v eni točki ali pa sta vzporedni ($p \parallel q$, brez skupne točke).« -/
theorem sekata_ali_vzporedni (p q : AffineSubspace ℝ Ravnina) (hp : Premica p) (hq : Premica q) (hpq : p ≠ q) :
    ((∃! X, X ∈ p ∧ X ∈ q) ∨ Vzporedni p q) ∧ ¬ ((∃! X, X ∈ p ∧ X ∈ q) ∧ Vzporedni p q) := by
  constructor
  · by_cases hdir : p.direction = q.direction
    · exact Or.inr ⟨hp, hq, (disjoint_iff hp hq).mpr ⟨hdir, hpq⟩⟩
    · obtain ⟨X, hX⟩ := AffineSubspace.inter_nonempty_of_nonempty_of_sup_direction_eq_top hp.nonempty
        hq.nonempty (sup_eq_top hp hq hdir)
      exact Or.inl ⟨X, hX, fun Y hY => najvec_ena p q hp hq hpq Y X hY hX⟩
  · rintro ⟨⟨X, hX, -⟩, -, -, hd⟩
    exact Set.disjoint_left.mp hd hX.1 hX.2

/-- Predpostavke trditve `sekata_ali_vzporedni` se dajo izpolniti, izrek uporabljen na osi y in osi x. -/
example := sekata_ali_vzporedni line[ℝ, (0 : Ravnina), E2] osx (premica_pair o_ne.2) premica_osx osy_ne_osx

/-! ## Razlaga 7: vzporednici -/

/-- Pomožno: premica s smerjo premice p skozi T ∉ p je vzporedna s p.
pomozno – orodje: konstrukcija vzporednice -/
theorem vzporednica_mk {p : AffineSubspace ℝ Ravnina} (hp : Premica p) {T : Ravnina} (hT : T ∉ p) :
    Vzporedni (AffineSubspace.mk' T p.direction) p := by
  have hq : Premica (AffineSubspace.mk' T p.direction) := by
    rw [Premica, AffineSubspace.direction_mk']; exact hp
  refine ⟨hq, hp, (disjoint_iff hq hp).mpr ⟨AffineSubspace.direction_mk' T _, fun e => hT ?_⟩⟩
  rw [← e]; exact AffineSubspace.self_mem_mk' T _

/-- Razlaga 7, Povzetek 7: skozi točko T, ki ne leži na premici p, gre natanko ena vzporednica s p.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#ena-vzporednica
besedilo: »skozi točko $T$, ki ne leži na premici $p$, gre **natanko ena** vzporednica s $p$« -/
theorem ena_vzporednica (p : AffineSubspace ℝ Ravnina) (hp : Premica p) (T : Ravnina) (hT : T ∉ p) :
    ∃! q, T ∈ q ∧ Vzporedni q p := by
  refine ⟨AffineSubspace.mk' T p.direction, ⟨AffineSubspace.self_mem_mk' T _, vzporednica_mk hp hT⟩, ?_⟩
  rintro q ⟨hTq, hq', -, hd⟩
  have hdir := ((disjoint_iff hq' hp).mp hd).1
  refine AffineSubspace.ext_of_direction_eq (by rw [hdir, AffineSubspace.direction_mk']) ⟨T, hTq, ?_⟩
  exact AffineSubspace.self_mem_mk' T _

/-- Predpostavke trditve `ena_vzporednica` se dajo izpolniti, izrek uporabljen na osi x in točki (0, 1). -/
example := ena_vzporednica osx premica_osx E2 ne_na_osx.1

/-- Razlaga 7: če je a ∥ b in b ∥ c (a in c različni), je a ∥ c.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#tranzitivnost
besedilo: »če je $a \parallel b$ in $b \parallel c$ (premici $a$ in $c$ sta različni), je tudi $a \parallel c$.« -/
theorem tranzitivnost (a b c : AffineSubspace ℝ Ravnina) (hab : Vzporedni a b) (hbc : Vzporedni b c) (hac : a ≠ c) :
    Vzporedni a c := by
  obtain ⟨ha, hb, d1⟩ := hab
  obtain ⟨-, hc, d2⟩ := hbc
  refine ⟨ha, hc, (disjoint_iff ha hc).mpr ⟨?_, hac⟩⟩
  rw [((disjoint_iff ha hb).mp d1).1, ((disjoint_iff hb hc).mp d2).1]

/-- Pomožno: vzporednici osi x skozi (0, 1) in (0, −1) sta različni.
pomozno – konkretni premici za primere izpolnljivosti -/
theorem vz_ne : AffineSubspace.mk' E2 osx.direction ≠ AffineSubspace.mk' E3 osx.direction := by
  intro e
  have h := AffineSubspace.self_mem_mk' E2 osx.direction
  rw [e, AffineSubspace.mem_mk'] at h
  have := osx_koord.1 _ h
  simp [koord.2.2.2.1, koord.2.2.2.2.2] at this

/-- Predpostavke trditve `tranzitivnost` se dajo izpolniti: vzporednica skozi (0, 1) ∥ os x ∥ vzporednica skozi
(0, −1). -/
example := tranzitivnost _ _ _ (vzporednica_mk premica_osx ne_na_osx.1)
  (let h := vzporednica_mk premica_osx ne_na_osx.2; ⟨h.2.1, h.1, h.2.2.symm⟩) vz_ne

/-- Pomožno: os x je vzporedna z vzporednico skozi (0, 1).
pomozno – konkretni premici za primere izpolnljivosti -/
theorem osx_vz : Vzporedni osx (AffineSubspace.mk' E2 osx.direction) :=
  let h := vzporednica_mk premica_osx ne_na_osx.1; ⟨h.2.1, h.1, h.2.2.symm⟩

/-! ## Razlaga 8: pravokotnici -/

/-- Razlaga 8 (definicija), Povzetek 6: pravokotni premici se sekata, in sicer v natanko eni točki.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#pravokotni-sekata
besedilo: »Pravokotni premici ($p \perp q$) se sekata pod pravim kotom.« -/
theorem pravokotni_sekata (p q : AffineSubspace ℝ Ravnina) (h : Pravokotni p q) : ∃! X, X ∈ p ∧ X ∈ q := by
  obtain ⟨hp, hq, ho⟩ := h
  have hdir : p.direction ≠ q.direction := by
    intro e
    rw [e] at ho
    have hbot : q.direction = ⊥ := by
      have hle := Submodule.isOrtho_iff_le.mp ho
      have := Submodule.inf_orthogonal_eq_bot q.direction
      rwa [inf_eq_left.mpr hle] at this
    rw [Premica, hbot, finrank_bot] at hq
    exact absurd hq (by norm_num)
  have hpq : p ≠ q := fun e => hdir (e ▸ rfl)
  obtain ⟨X, hX⟩ := AffineSubspace.inter_nonempty_of_nonempty_of_sup_direction_eq_top hp.nonempty
    hq.nonempty (sup_eq_top hp hq hdir)
  exact ⟨X, hX, fun Y hY => najvec_ena p q hp hq hpq Y X hY hX⟩

/-- Pomožno: pravokotnica na p skozi T.
pomozno – orodje: konstrukcija pravokotnice -/
theorem pravokotnica_mk {p : AffineSubspace ℝ Ravnina} (hp : Premica p) (T : Ravnina) :
    Pravokotni (AffineSubspace.mk' T p.directionᗮ) p := by
  have hdim : finrank ℝ p.directionᗮ = 1 := by
    have := Submodule.finrank_add_finrank_orthogonal p.direction
    rw [finrank_euclideanSpace_fin, hp] at this
    omega
  refine ⟨by rw [Premica, AffineSubspace.direction_mk']; exact hdim, hp, ?_⟩
  rw [AffineSubspace.direction_mk']
  exact (Submodule.isOrtho_iff_le.mpr (Submodule.le_orthogonal_orthogonal p.direction)).symm

/-- Razlaga 8, Povzetek 7: skozi dano točko T gre natanko ena pravokotnica na dano premico p (T na p ali zunaj nje).
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#ena-pravokotnica
besedilo: »Skozi dano točko gre **natanko ena** pravokotnica na dano premico (točka je na premici ali zunaj nje).« -/
theorem ena_pravokotnica (p : AffineSubspace ℝ Ravnina) (hp : Premica p) (T : Ravnina) :
    ∃! q, T ∈ q ∧ Pravokotni q p := by
  refine ⟨AffineSubspace.mk' T p.directionᗮ, ⟨AffineSubspace.self_mem_mk' T _, pravokotnica_mk hp T⟩, ?_⟩
  rintro q ⟨hTq, hq', -, ho⟩
  have hdim := (pravokotnica_mk hp T).1
  rw [Premica, AffineSubspace.direction_mk'] at hdim
  have hdir : q.direction = p.directionᗮ :=
    Submodule.eq_of_le_of_finrank_eq (Submodule.isOrtho_iff_le.mp ho) (by rw [hq', hdim])
  refine AffineSubspace.ext_of_direction_eq (by rw [hdir, AffineSubspace.direction_mk']) ⟨T, hTq, ?_⟩
  exact AffineSubspace.self_mem_mk' T _

/-- Predpostavka trditve `ena_pravokotnica` se da izpolniti, izrek uporabljen na osi x in točki (0, 1). -/
example := ena_pravokotnica osx premica_osx E2

/-- Predpostavka trditve `pravokotni_sekata` se da izpolniti, izrek uporabljen na osi x in pravokotnici nanjo. -/
example := pravokotni_sekata _ _ (pravokotnica_mk premica_osx 0)

/-- Razlaga 8, Povzetek 6, Primer 3 a): če sta premici vzporedni in je tretja pravokotna na eno izmed njiju, je
pravokotna tudi na drugo: iz a ∥ b in c ⊥ a sledi c ⊥ b.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#pravokotna-na-vzporedno
besedilo: »Če je $a \parallel b$ in $c \perp a$, je $c \perp b$.« -/
theorem pravokotna_na_vzporedno (a b c : AffineSubspace ℝ Ravnina) (hab : Vzporedni a b) (hca : Pravokotni c a) :
    Pravokotni c b := by
  obtain ⟨ha, hb, hd⟩ := hab
  obtain ⟨hc, -, ho⟩ := hca
  exact ⟨hc, hb, ((disjoint_iff ha hb).mp hd).1 ▸ ho⟩

/-- Predpostavke trditve `pravokotna_na_vzporedno` se dajo izpolniti: os x, njena vzporednica skozi (0, 1) in
pravokotnica na os x skozi (0, 0). -/
example := pravokotna_na_vzporedno _ _ _ osx_vz (pravokotnica_mk premica_osx 0)

/-- Pomožno: vzporedni premici imata isto smer, zato je pravokotnica na eno pravokotna premica tudi za vzporedno
premico na mestu prve (smer).
pomozno – orodje: pravokotnost se prenese z vzporedne premice -/
theorem vzporedna_na_pravokotno {c d a : AffineSubspace ℝ Ravnina} (hdc : Vzporedni d c) (hca : Pravokotni c a) :
    Pravokotni d a := by
  obtain ⟨hd, hc, hdis⟩ := hdc
  obtain ⟨-, ha, ho⟩ := hca
  exact ⟨hd, ha, ((disjoint_iff hd hc).mp hdis).1 ▸ ho⟩

/-- Primer 3 a) in b): iz a ∥ b, c ⊥ a in d ∥ c sledi c ⊥ b, d ⊥ a in d ⊥ b.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#primer3
besedilo: »Ker $c$ seka $a$ in $b$ pod pravim kotom, ju tako seka tudi $d$: $d \perp a$ in $d \perp b$.« -/
theorem primer3 (a b c d : AffineSubspace ℝ Ravnina) (hab : Vzporedni a b) (hca : Pravokotni c a)
    (hdc : Vzporedni d c) : Pravokotni c b ∧ Pravokotni d a ∧ Pravokotni d b :=
  ⟨pravokotna_na_vzporedno a b c hab hca, vzporedna_na_pravokotno hdc hca,
    pravokotna_na_vzporedno a b d hab (vzporedna_na_pravokotno hdc hca)⟩

/-- Pomožno: pravokotnica na os x skozi (1, 0) ni pravokotnica skozi (0, 0); ta ne vsebuje (1, 0).
pomozno – konkretna premica za primere izpolnljivosti -/
theorem e1_ne_osy : E1 ∉ AffineSubspace.mk' (0 : Ravnina) osx.directionᗮ := by
  intro h
  rw [AffineSubspace.mem_mk', vsub_eq_sub, sub_zero] at h
  have hv : (0 : Ravnina) -ᵥ E1 ∈ osx.direction := by
    rw [osx, direction_affineSpan, vectorSpan_pair]; exact Submodule.mem_span_singleton_self _
  have := Submodule.inner_right_of_mem_orthogonal hv h
  simp [E1] at this

/-- Predpostavke trditve `primer3` se dajo izpolniti: a = os x, b = vzporednica skozi (0, 1), c = pravokotnica na os
x skozi (0, 0), d = vzporednica s c skozi (1, 0). -/
example := primer3 osx _ _ _ osx_vz (pravokotnica_mk premica_osx 0)
  (vzporednica_mk (pravokotnica_mk premica_osx 0).1 e1_ne_osy)

/-- Preveri se 5: iz p ∥ q in o ⊥ p sledi o ⊥ q (rob q je pravokoten na rob omare o).
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#kviz5
besedilo: »Iz $p \parallel q$ in $o \perp p$ sledi $o \perp q$.« -/
theorem kviz5 (p q o : AffineSubspace ℝ Ravnina) (hpq : Vzporedni p q) (hop : Pravokotni o p) :
    Pravokotni o q ∧ ¬ Vzporedni q o := by
  have hoq := pravokotna_na_vzporedno p q o hpq hop
  refine ⟨hoq, fun hv => ?_⟩
  obtain ⟨X, hX, -⟩ := pravokotni_sekata o q hoq
  exact Set.disjoint_left.mp hv.2.2 hX.2 hX.1

/-- Predpostavke trditve `kviz5` se dajo izpolniti: p = os x, q = vzporednica skozi (0, 1), o = pravokotnica. -/
example := kviz5 _ _ _ osx_vz (pravokotnica_mk premica_osx 0)

/-! ## Razlaga 9: razdalje -/

/-- Razlaga 9, Povzetek 7: razdalja točke od premice je dolžina pravokotne daljice TY (Y ∈ p, TY pravokotna na p),
to je najkrajša pot do premice: |TY| ≤ |TX| za vsako točko X premice.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#najkrajsa
besedilo: »**Razdalja točke od premice** je dolžina pravokotne daljice od točke do premice, to je najkrajša pot do nje.« -/
theorem najkrajsa (p : AffineSubspace ℝ Ravnina) (T Y : Ravnina) (hY : Y ∈ p) (hTY : T -ᵥ Y ∈ p.directionᗮ) :
    ∀ X ∈ p, dist T Y ≤ dist T X := by
  intro X hX
  have hYX : Y -ᵥ X ∈ p.direction := AffineSubspace.vsub_mem_direction hY hX
  have hi : inner ℝ (T -ᵥ Y) (Y -ᵥ X) = 0 := by
    rw [real_inner_comm]; exact Submodule.inner_right_of_mem_orthogonal hYX hTY
  have h := norm_add_sq_eq_norm_sq_add_norm_sq_real hi
  rw [vsub_add_vsub_cancel] at h
  rw [dist_eq_norm_vsub, dist_eq_norm_vsub, mul_self_le_mul_self_iff (norm_nonneg _) (norm_nonneg _), h]
  nlinarith [mul_self_nonneg ‖Y -ᵥ X‖]

/-- Pomožno: točka (0, 0) je nožišče pravokotnice iz (0, 1) na os x.
pomozno – konkretno nožišče za primere izpolnljivosti -/
theorem e2_noz : E2 -ᵥ (0 : Ravnina) ∈ osx.directionᗮ := by
  rw [osx, direction_affineSpan, vectorSpan_pair, Submodule.mem_orthogonal_singleton_iff_inner_right, vsub_eq_sub, vsub_eq_sub, sub_zero, zero_sub]
  simp [E1, E2, EuclideanSpace.inner_single_left]

/-- Predpostavke trditve `najkrajsa` se dajo izpolniti: T = (0, 1), nožišče Y = (0, 0) na osi x. -/
example := najkrajsa osx E2 0 (left_mem_affineSpan_pair ℝ _ _) e2_noz

/-- Razlaga 7 in 9, Primer 3 c): vzporednici sta povsod enako narazen: za točki T₁, T₂ na a in njuni nožišči Y₁, Y₂
na b (a ∥ b) je |T₁Y₁| = |T₂Y₂|.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#enako-narazen
besedilo: »Ker sta vzporednici povsod enako narazen, dobiš vedno isto število.« -/
theorem enako_narazen (a b : AffineSubspace ℝ Ravnina) (hab : Vzporedni a b) (T₁ T₂ Y₁ Y₂ : Ravnina)
    (h₁ : T₁ ∈ a) (h₂ : T₂ ∈ a) (k₁ : Y₁ ∈ b) (k₂ : Y₂ ∈ b) (n₁ : T₁ -ᵥ Y₁ ∈ b.directionᗮ)
    (n₂ : T₂ -ᵥ Y₂ ∈ b.directionᗮ) : dist T₁ Y₁ = dist T₂ Y₂ := by
  have hdir := ((disjoint_iff hab.1 hab.2.1).mp hab.2.2).1
  have hw1 : (T₁ -ᵥ Y₁) - (T₂ -ᵥ Y₂) ∈ b.direction := by
    rw [vsub_sub_vsub_comm]
    exact Submodule.sub_mem _ (hdir ▸ AffineSubspace.vsub_mem_direction h₁ h₂)
      (AffineSubspace.vsub_mem_direction k₁ k₂)
  have hw2 : (T₁ -ᵥ Y₁) - (T₂ -ᵥ Y₂) ∈ b.directionᗮ := Submodule.sub_mem _ n₁ n₂
  have hw : (T₁ -ᵥ Y₁) - (T₂ -ᵥ Y₂) = 0 := by
    have := Submodule.inf_orthogonal_eq_bot b.direction
    have hm : (T₁ -ᵥ Y₁) - (T₂ -ᵥ Y₂) ∈ b.direction ⊓ b.directionᗮ := ⟨hw1, hw2⟩
    rw [this] at hm
    exact hm
  rw [dist_eq_norm_vsub, dist_eq_norm_vsub, sub_eq_zero.mp hw]

/-- Pomožno: (1, 0) je nožišče pravokotnice iz (1, 1) na os x in (1, 1) leži na vzporednici skozi (0, 1).
pomozno – konkretne točke za primere izpolnljivosti -/
theorem noz_e1 : (E1 + E2) -ᵥ E1 ∈ osx.directionᗮ ∧ E1 + E2 ∈ AffineSubspace.mk' E2 osx.direction ∧
    E1 ∈ osx := by
  refine ⟨?_, ?_, right_mem_affineSpan_pair ℝ _ _⟩
  · rw [vsub_eq_sub, add_sub_cancel_left]
    have := e2_noz; rwa [vsub_eq_sub, sub_zero] at this
  · rw [AffineSubspace.mem_mk', vsub_eq_sub, add_sub_cancel_right, osx, direction_affineSpan,
      vectorSpan_pair]
    exact Submodule.mem_span_singleton.mpr ⟨-1, by simp⟩

/-- Predpostavke trditve `enako_narazen` se dajo izpolniti: a = vzporednica skozi (0, 1), b = os x, T₁ = (0, 1),
T₂ = (1, 1), nožišči (0, 0) in (1, 0). -/
example := enako_narazen _ _ (vzporednica_mk premica_osx ne_na_osx.1) E2 (E1 + E2) 0 E1
  (AffineSubspace.self_mem_mk' _ _) noz_e1.2.1 (left_mem_affineSpan_pair ℝ _ _) noz_e1.2.2 e2_noz noz_e1.1

/-- Primer 3 c): T leži na a, razdalja med a in b je 4 (izmerjena pri točki T₀ ∈ a z nožiščem Y₀), zato je
razdalja T od b (nožišče Y) enaka 4.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#primer3c
besedilo: »Točka $T$ leži na $a$, razdalja med vzporednicama pa je povsod enaka, zato je razdalja $T$ od $b$ enaka $4\,\text{cm}$.« -/
theorem primer3c (a b : AffineSubspace ℝ Ravnina) (hab : Vzporedni a b) (T T₀ Y Y₀ : Ravnina)
    (hT : T ∈ a) (hT₀ : T₀ ∈ a) (hY : Y ∈ b) (hY₀ : Y₀ ∈ b) (nY : T -ᵥ Y ∈ b.directionᗮ)
    (nY₀ : T₀ -ᵥ Y₀ ∈ b.directionᗮ) (h4 : dist T₀ Y₀ = 4) : dist T Y = 4 := by
  rw [enako_narazen a b hab T T₀ Y Y₀ hT hT₀ hY hY₀ nY nY₀, h4]

/-- Pomožno: vzporednica osi x skozi (0, 4) z nožiščema točk (0, 4) in (1, 4) na osi x; razdalja (0, 4) od osi x je 4.
pomozno – konkretne točke za primere izpolnljivosti -/
theorem stiri :
    (4 : ℝ) • E2 ∉ osx ∧ E1 + (4 : ℝ) • E2 ∈ AffineSubspace.mk' ((4 : ℝ) • E2) osx.direction ∧
    (E1 + (4 : ℝ) • E2) -ᵥ E1 ∈ osx.directionᗮ ∧ (4 : ℝ) • E2 -ᵥ (0 : Ravnina) ∈ osx.directionᗮ ∧
    dist ((4 : ℝ) • E2) (0 : Ravnina) = 4 := by
  have hperp : (4 : ℝ) • E2 ∈ osx.directionᗮ := by
    rw [osx, direction_affineSpan, vectorSpan_pair, Submodule.mem_orthogonal_singleton_iff_inner_right,
      vsub_eq_sub, zero_sub]
    simp [E1, E2, EuclideanSpace.inner_single_left]
  refine ⟨fun h => ?_, ?_, ?_, ?_, ?_⟩
  · have := osx_koord.2 _ h
    simp [koord.2.2.2.1] at this
  · rw [AffineSubspace.mem_mk', vsub_eq_sub, add_sub_cancel_right, osx, direction_affineSpan, vectorSpan_pair]
    exact Submodule.mem_span_singleton.mpr ⟨-1, by simp⟩
  · rwa [vsub_eq_sub, add_sub_cancel_left]
  · rwa [vsub_eq_sub, sub_zero]
  · rw [dist_eq_norm, sub_zero, norm_smul]
    simp [E2]

/-- Predpostavke trditve `primer3c` se dajo izpolniti: a = vzporednica osi x skozi (0, 4), b = os x, T = (1, 4) z
nožiščem (1, 0), T₀ = (0, 4) z nožiščem (0, 0). -/
example := primer3c _ _ (vzporednica_mk premica_osx stiri.1) (E1 + (4 : ℝ) • E2) ((4 : ℝ) • E2) E1 0
  stiri.2.1 (AffineSubspace.self_mem_mk' _ _) (right_mem_affineSpan_pair ℝ _ _) (left_mem_affineSpan_pair ℝ _ _)
  stiri.2.2.1 stiri.2.2.2.1 stiri.2.2.2.2

/-! ## Razlaga 4 in 5: poltrak in daljica -/

/-- Razlaga 4, Povzetek 2, Pogoste napake 2: poltrak AB se začne v A (A je na njem pri t = 0); poltraka AB in BA
sta različna (A ≠ B): točka B + 2 · (A − B) je na BA, ni pa na AB.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#poltraka
besedilo: »Poltrak $AB$ ima začetek v $A$ in poteka skozi $B$; poltraka $AB$ in $BA$ sta različna.« -/
theorem poltraka {E : Type*} [NormedAddCommGroup E] [NormedSpace ℝ E] (A B : E) (h : A ≠ B) :
    A ∈ poltrak A B ∧ B ∈ poltrak A B ∧ poltrak A B ≠ poltrak B A := by
  refine ⟨⟨0, le_refl _, by simp⟩, ⟨1, zero_le_one, by simp⟩, fun e => ?_⟩
  have hm : AffineMap.lineMap B A (2 : ℝ) ∈ poltrak A B := e ▸ ⟨2, by norm_num, rfl⟩
  obtain ⟨t, ht, htq⟩ := hm
  rw [AffineMap.lineMap_apply_module', AffineMap.lineMap_apply_module'] at htq
  have h0 : (t + 1) • (B - A) = 0 := by
    have : t • (B - A) + A - ((2 : ℝ) • (A - B) + B) = 0 := sub_eq_zero.mpr htq
    rw [← this]; module
  rcases smul_eq_zero.mp h0 with h1 | h1
  · have : (0 : ℝ) ≤ t := ht
    linarith
  · exact h (sub_eq_zero.mp h1).symm

/-- Predpostavka trditve `poltraka` se da izpolniti, izrek uporabljen na točkah 0 in 1 številske premice. -/
example := poltraka (0 : ℝ) 1 (by norm_num)

/-- Razlaga 5, Povzetek 3: daljica AB je ista kot BA in |AB| = |BA|.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#daljica-ab-ba
besedilo: »Daljica $AB$ in daljica $BA$ sta ista daljica, zato je $|AB| = |BA|$.« -/
theorem daljica_ab_ba {E : Type*} [NormedAddCommGroup E] [NormedSpace ℝ E] (A B : E) :
    segment ℝ A B = segment ℝ B A ∧ dist A B = dist B A := ⟨segment_symm ℝ A B, dist_comm A B⟩

/-- Razlaga 5, Povzetek 3: če točka C leži na daljici AB, je |AB| = |AC| + |CB|.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#vsota-daljic
besedilo: »Če $C$ leži na daljici $AB$, je $|AB| = |AC| + |CB|$.« -/
theorem vsota_daljic {E : Type*} [NormedAddCommGroup E] [NormedSpace ℝ E] (A B C : E) (h : Wbtw ℝ A C B) :
    dist A B = dist A C + dist C B := h.dist_add_dist.symm

/-- Predpostavka trditve `vsota_daljic` se da izpolniti, izrek uporabljen na 0, 15 in 6 številske premice. -/
example := vsota_daljic (0 : ℝ) 15 6 (mem_segment_iff_wbtw.mp (by rw [segment_eq_Icc (by norm_num)]; norm_num))

/-- Razlaga 5, Povzetek 4: razpolovišče M daljice AB leži na daljici in |AM| = |MB| = |AB|/2; je edina točka
daljice, ki je enako oddaljena od obeh krajišč.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#razpolovisce
besedilo: »Razpolovišče $M$ daljice $AB$: $|AM| = |MB| = \dfrac{|AB|}{2}$.« -/
theorem razpolovisce {E : Type*} [NormedAddCommGroup E] [NormedSpace ℝ E] (A B : E) :
    Wbtw ℝ A (midpoint ℝ A B) B ∧ dist A (midpoint ℝ A B) = dist A B / 2 ∧
      dist (midpoint ℝ A B) B = dist A B / 2 ∧
      ∀ M, Wbtw ℝ A M B → dist A M = dist M B → M = midpoint ℝ A B := by
  refine ⟨wbtw_midpoint ℝ A B, ?_, ?_, ?_⟩
  · rw [dist_left_midpoint (𝕜 := ℝ)]; simp; ring
  · rw [dist_midpoint_right (𝕜 := ℝ)]; simp; ring
  · rintro M ⟨t, ⟨h0, h1⟩, rfl⟩ hd
    rw [dist_comm, dist_lineMap_left, dist_lineMap_right, Real.norm_eq_abs, Real.norm_eq_abs,
      abs_of_nonneg h0, abs_of_nonneg (by linarith)] at hd
    by_cases hAB : dist A B = 0
    · rw [dist_eq_zero] at hAB
      subst hAB
      simp
    · have ht : t = 1 / 2 := by
        have := mul_right_cancel₀ hAB hd
        linarith
      rw [ht, midpoint_eq_smul_add, AffineMap.lineMap_apply_module', invOf_eq_inv]
      module

/-- Predpostavki »M na daljici« in »|AM| = |MB|« v sklepu trditve `razpolovisce` se dajo izpolniti: M = 1 na
daljici od 0 do 2. -/
example := (razpolovisce (0 : ℝ) 2).2.2.2 1
  (mem_segment_iff_wbtw.mp (by rw [segment_eq_Icc (by norm_num)]; norm_num)) (by norm_num [Real.dist_eq])

/-- Primer 2 (pravilo): ker C leži na daljici AB in je M razpolovišče daljice CB, leži C tudi na daljici AM, zato
|AM| = |AC| + |CM|.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#am-vsota
besedilo: »Točka $M$ leži na daljici $CB$, zato $|AM| = |AC| + |CM| = 6\,\text{cm} + 4{,}5\,\text{cm} = 10{,}5\,\text{cm}$.« -/
theorem am_vsota {E : Type*} [NormedAddCommGroup E] [NormedSpace ℝ E] (A B C : E) (h : Wbtw ℝ A C B) :
    dist A (midpoint ℝ C B) = dist A C + dist C (midpoint ℝ C B) :=
  (h.trans_right_left (wbtw_midpoint ℝ C B)).dist_add_dist.symm

/-- Predpostavka trditve `am_vsota` se da izpolniti, izrek uporabljen na 0, 15 in 6 številske premice. -/
example := am_vsota (0 : ℝ) 15 6 (mem_segment_iff_wbtw.mp (by rw [segment_eq_Icc (by norm_num)]; norm_num))

/-- Preveri se 4, tabela (merljiva): daljica je omejena z |AB| (vsaka njena točka je od A oddaljena največ |AB|),
poltrak AB (A ≠ B) pa ni omejen (ima točke poljubno daleč od A), zato ga ne moremo izmeriti.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#merljiva
besedilo: »Premica nima krajišč, poltrak ima eno (začetek), daljica dve. Zato lahko izmerimo samo daljico.« -/
theorem merljiva {E : Type*} [NormedAddCommGroup E] [NormedSpace ℝ E] (A B : E) (h : A ≠ B) :
    (∀ X, Wbtw ℝ A X B → dist A X ≤ dist A B) ∧ (∀ R : ℝ, ∃ X ∈ poltrak A B, R < dist A X) := by
  refine ⟨fun X hX => ?_, fun R => ?_⟩
  · rw [← hX.dist_add_dist]; linarith [dist_nonneg (x := X) (y := B)]
  · have hd : 0 < dist A B := dist_pos.mpr h
    refine ⟨AffineMap.lineMap A B ((|R| + 1) / dist A B), ⟨_, Set.mem_Ici.mpr (by positivity), rfl⟩, ?_⟩
    rw [dist_comm, dist_lineMap_left, Real.norm_eq_abs, abs_of_nonneg (by positivity),
      div_mul_cancel₀ _ hd.ne']
    linarith [le_abs_self R]

/-- Predpostavka trditve `merljiva` se da izpolniti, izrek uporabljen na točkah 0 in 1 številske premice. -/
example := merljiva (0 : ℝ) 1 (by norm_num)

/-! ## Razlaga 5: koliko daljic -/

/-- Razlaga 5, premisli, Preveri se 2: daljica je par različnih točk (AB = BA); 2 točki določata 1 daljico, 3 točke
3, 4 točke 6 (3 + 3), 5 točk 10 (4 + 3 + 2 + 1); nova točka doda toliko daljic, kolikor točk je že bilo; napačni
odgovori: 4 sosednje daljice, 5 točk, 20 urejenih parov.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#stevilo-daljic
besedilo: »Iz $A$ gredo štiri daljice, iz $B$ še tri nove, iz $C$ dve, iz $D$ ena: $4 + 3 + 2 + 1 = 10$.« -/
theorem stevilo_daljic :
    ((Finset.univ : Finset (Fin 2)).powersetCard 2).card = 1 ∧
    ((Finset.univ : Finset (Fin 3)).powersetCard 2).card = 3 ∧
    ((Finset.univ : Finset (Fin 4)).powersetCard 2).card = 6 ∧ 3 + 3 = 6 ∧
    ((Finset.univ : Finset (Fin 5)).powersetCard 2).card = 10 ∧ 4 + 3 + 2 + 1 = 10 ∧
    (∀ n : ℕ, Nat.choose (n + 1) 2 = Nat.choose n 2 + n) ∧
    ((Finset.univ : Finset (Fin 5)).offDiag).card = 20 := by
  refine ⟨by simp, by simp, by simp; rfl, rfl, by simp; rfl, rfl, fun n => ?_, by decide⟩
  rw [Nat.choose_succ_succ, Nat.choose_one_right, add_comm]

/-! ## Rešeni primeri in računi -/

/-- Primer 1 b) in c): točke A < B < C na premici (številska premica): tri daljice AB, BC, AC; poltraka BA in BC
se začneta v B, a nista enaka (A je na BA, ni pa na BC).
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#primer1
besedilo: »Odgovor: tri daljice ($AB$, $BC$, $AC$); poltraka $BA$ in $BC$ nista enaka.« -/
theorem primer1 (A B C : ℝ) (hAB : A < B) (hBC : B < C) :
    ((Finset.univ : Finset (Fin 3)).powersetCard 2).card = 3 ∧ B ∈ poltrak B A ∧ B ∈ poltrak B C ∧
      A ∈ poltrak B A ∧ A ∉ poltrak B C ∧ poltrak B A ≠ poltrak B C := by
  have hA : A ∉ poltrak B C := by
    rintro ⟨s, hs, e⟩
    rw [AffineMap.lineMap_apply_module'] at e
    simp only [smul_eq_mul] at e
    have : (0 : ℝ) ≤ s := hs
    nlinarith
  refine ⟨by simp, ⟨0, le_refl _, by simp⟩, ⟨0, le_refl _, by simp⟩, ⟨1, zero_le_one, by simp⟩, hA,
    fun e => hA (e ▸ ⟨1, zero_le_one, by simp⟩)⟩

/-- Predpostavki trditve `primer1` se dajo izpolniti, izrek uporabljen na točkah 0 < 1 < 2. -/
example := primer1 0 1 2 (by norm_num) (by norm_num)

/-- Primer 2: |AB| = 15, C na AB, |AC| = 2/5 od 15: 15 : 5 = 3, |AC| = 2 · 3 = 6; |CB| = 15 − 6 = 9;
M razpolovišče CB: |CM| = 9 : 2 = 4,5; |AM| = 6 + 4,5 = 10,5; preizkus |AB| − |MB| = 15 − 4,5 = 10,5.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#primer2
besedilo: »Odgovor: $|AC| = 6\,\text{cm}$, $|CB| = 9\,\text{cm}$, $|CM| = 4{,}5\,\text{cm}$, $|AM| = 10{,}5\,\text{cm}$.« -/
theorem primer2 {E : Type*} [NormedAddCommGroup E] [NormedSpace ℝ E] (A B C : E) (hC : Wbtw ℝ A C B)
    (hAB : dist A B = 15) (hAC : dist A C = 15 / 5 * 2) :
    (15 : ℝ) / 5 = 3 ∧ dist A C = 6 ∧ dist C B = 9 ∧ dist C (midpoint ℝ C B) = 9 / 2 ∧
      dist A (midpoint ℝ C B) = 21 / 2 ∧ dist (midpoint ℝ C B) B = 9 / 2 ∧
      dist A B - dist (midpoint ℝ C B) B = 21 / 2 := by
  have h1 : dist A C = 6 := by rw [hAC]; norm_num
  have h2 : dist C B = 9 := by have := vsota_daljic A B C hC; linarith
  have h3 : dist C (midpoint ℝ C B) = 9 / 2 := by rw [(razpolovisce C B).2.1, h2]
  have h4 : dist (midpoint ℝ C B) B = 9 / 2 := by rw [(razpolovisce C B).2.2.1, h2]
  have h5 : dist A (midpoint ℝ C B) = 21 / 2 := by rw [am_vsota A B C hC, h1, h3]; norm_num
  exact ⟨by norm_num, h1, h2, h3, h5, h4, by rw [hAB, h4]; norm_num⟩

/-- Predpostavke trditve `primer2` se dajo izpolniti: A = 0, B = 15, C = 6 na številski premici. -/
example := primer2 (0 : ℝ) 15 6 (mem_segment_iff_wbtw.mp (by rw [segment_eq_Icc (by norm_num)]; norm_num))
  (by norm_num [Real.dist_eq]) (by norm_num [Real.dist_eq])

/-- Primer 4: A, C, D, B v tem vrstnem redu, |AB| = 42, |AC| = |DB| = 8: |CD| = 42 − 8 − 8 = 26; M razpolovišče CD:
|CM| = 26 : 2 = 13, |AM| = 8 + 13 = 21 = 42 : 2.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#primer4
besedilo: »$|CM| = 26\,\text{cm} : 2 = 13\,\text{cm}$ in $|AM| = 8\,\text{cm} + 13\,\text{cm} = 21\,\text{cm}$. To je ravno $42\,\text{cm} : 2$« -/
theorem primer4 {E : Type*} [NormedAddCommGroup E] [NormedSpace ℝ E] (A B C D : E) (hC : Wbtw ℝ A C D)
    (hD : Wbtw ℝ A D B) (hAB : dist A B = 42) (hAC : dist A C = 8) (hDB : dist D B = 8) :
    dist C D = 42 - 8 - 8 ∧ (42 : ℝ) - 8 - 8 = 26 ∧ dist C (midpoint ℝ C D) = 13 ∧
      dist A (midpoint ℝ C D) = 8 + 13 ∧ (8 : ℝ) + 13 = 21 ∧ (42 : ℝ) / 2 = 21 := by
  have h1 := vsota_daljic A B D hD
  have h2 := vsota_daljic A D C hC
  have hCD : dist C D = 42 - 8 - 8 := by linarith
  have hCM : dist C (midpoint ℝ C D) = 13 := by rw [(razpolovisce C D).2.1, hCD]; norm_num
  refine ⟨hCD, by norm_num, hCM, ?_, by norm_num, by norm_num⟩
  rw [(hC.trans_right_left (wbtw_midpoint ℝ C D)).dist_add_dist.symm, hAC, hCM]

/-- Predpostavke trditve `primer4` se dajo izpolniti: A = 0, C = 8, D = 34, B = 42 na številski premici. -/
example := primer4 (0 : ℝ) 42 8 34 (mem_segment_iff_wbtw.mp (by rw [segment_eq_Icc (by norm_num)]; norm_num))
  (mem_segment_iff_wbtw.mp (by rw [segment_eq_Icc (by norm_num)]; norm_num))
  (by norm_num [Real.dist_eq]) (by norm_num [Real.dist_eq]) (by norm_num [Real.dist_eq])

/-- Korak za korakom A: |AT| = x, |TB| = x + 6, x + x + 6 = 24 natanko pri x = 9 (2 · x = 24 − 6 = 18, x = 18 : 2);
|TB| = 15; preizkus 9 + 15 = 24, 15 − 9 = 6.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#korak-a
besedilo: »$|AT| = 9\,\text{cm}$ in $|TB| = 9 + 6 = 15\,\text{cm}$.« -/
theorem korak_a (x : ℝ) : (x + x + 6 = 24 ↔ x = 9) ∧ (24 : ℝ) - 6 = 18 ∧ (18 : ℝ) / 2 = 9 ∧ (9 : ℝ) + 6 = 15 ∧
    (9 : ℝ) + 15 = 24 ∧ (15 : ℝ) - 9 = 6 := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-- Pogoste napake 5, Preveri se 3: če krajišče A postavimo na oznako 1 cm, B pa je pri 7,5 cm, je
|AB| = 7,5 − 1 = 6,5 (cm), ne 7,5 in ne 8,5.
trditev: MAT-OS-6/osnovni-geometrijski-pojmi#merjenje
besedilo: »Če začneš pri $1\,\text{cm}$, ta centimeter odšteješ: $|AB| = 6{,}5\,\text{cm}$.« -/
theorem merjenje : dist (1 : ℝ) (15 / 2) = 13 / 2 ∧ (15 / 2 : ℝ) - 1 = 13 / 2 ∧ dist (1 : ℝ) (15 / 2) ≠ 15 / 2 ∧
    dist (1 : ℝ) (15 / 2) ≠ 17 / 2 := by
  norm_num [Real.dist_eq, abs_of_neg]

end Evklid.Lekcije.MAT_OS_6.OsnovniGeometrijskiPojmi
