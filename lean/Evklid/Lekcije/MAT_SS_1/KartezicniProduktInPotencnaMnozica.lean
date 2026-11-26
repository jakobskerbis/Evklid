/-
vir: content/lessons/MAT-SS-1/kartezicni-produkt-in-potencna-mnozica.md
sha256: da75b9b46b95b81aea416a244fb7ad9b8c4bba7286c202c1182874afab1cdc60
Ni v Leanu: zgodovina (Descartes) in zgledi z vozovnico in zemljevidom kot besedilo (števni del zemljevida je
dokazan: 4 · 3 = 12 in 6 · 5 = 30 kvadratov); vse risbe grafov in simulacija (dokazane so množice točk, ki jih
risbe kažejo, in to, da je graf intervalov pravokotnik ter da so točke končnega produkta posamezne točke);
oznaka m(A) v katalogu (zapis); zapisi, ki se v Leanu zaradi tipov ne dajo zapisati: »1 ni element 𝒫(A)«,
»5 ∈ 𝒫(B)«, »({0}, 2) ∈ A × 𝒫(B)« in 𝒫({1, 2}) = {1, 2, {1, 2}} (elementi 𝒫(A) so množice, par ima prvo komponento
iz A; dokazano je {5} ∈ 𝒫(B), 5 ∈ B, (2, {0}) ∈ A × 𝒫(B) in pravilni 𝒫({1, 2})); utemeljitev »n zaporednih
odločitev« (dokazano je |𝒫(A)| = 2ⁿ in podvojitev ob dodanem elementu); razvrščanje korakov v zadnjem vprašanju
Preveri se (postopek; dokazani so števci 1 + 3 + 3 + 1 = 8 po velikosti); točkovanje.
Dogovori: kraji, prevozi in stolpci so nizi (String); »ploščina« je Lebesgueova mera `volume` v ℝ × ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.KartezicniProduktInPotencnaMnozica

open MeasureTheory

/-! ## Razlaga 1–3: urejeni par in kartezični produkt -/

/-- Razlaga 1, Povzetek in Ustno vprašanje 1: (a, b) = (c, d) ⇔ a = c ∧ b = d. -/
theorem par_enakost {α β : Type*} (a c : α) (b d : β) : (a, b) = (c, d) ↔ a = c ∧ b = d :=
  ⟨fun h => Prod.mk.inj h, fun ⟨h1, h2⟩ => h1 ▸ h2 ▸ rfl⟩

/-- Razlaga 1 in Povzetek: pri a ≠ b je (a, b) ≠ (b, a). -/
theorem par_vrstni_red {α : Type*} (a b : α) (h : a ≠ b) : (a, b) ≠ (b, a) := fun e => h (Prod.mk.inj e).1

/-- Predpostavke `par_vrstni_red` se dajo izpolniti (a = 2, b = 5). -/
example : (2 : ℕ) ≠ 5 := by decide

/-- Razlaga 1: (2, 5) ≠ (5, 2), čeprav {2, 5} = {5, 2}; par (3, 3) obstaja, množica {3, 3} pa je {3}. -/
theorem par_proti_mnozici : ((2 : ℕ), (5 : ℕ)) ≠ (5, 2) ∧ ({2, 5} : Finset ℕ) = {5, 2} ∧
    ({3, 3} : Finset ℕ) = {3} ∧ ((3 : ℕ), (3 : ℕ)).1 = ((3 : ℕ), (3 : ℕ)).2 := by decide

/-- Razlaga 2 in Povzetek: (a, b) ∈ A × B ⇔ a ∈ A ∧ b ∈ B. -/
theorem produkt_clan {α β : Type*} (A : Set α) (B : Set β) (a : α) (b : β) :
    (a, b) ∈ A ×ˢ B ↔ a ∈ A ∧ b ∈ B := Set.mem_prod

/-- Razlaga 2: {1, 2} × {x, y, z} = {(1, x), (1, y), (1, z), (2, x), (2, y), (2, z)}. -/
theorem produkt_12_xyz : ({1, 2} : Finset ℕ) ×ˢ ({"x", "y", "z"} : Finset String) =
    {(1, "x"), (1, "y"), (1, "z"), (2, "x"), (2, "y"), (2, "z")} := by decide

/-- Razlaga 2–4: zemljevid S = {a, b, c, d}, V = {1, 2, 3}: kvadrat (c, 2) je v S × V, kvadratov je 4 · 3 = 12. -/
theorem zemljevid : ("c", 2) ∈ ({"a", "b", "c", "d"} : Finset String) ×ˢ ({1, 2, 3} : Finset ℕ) ∧
    (({"a", "b", "c", "d"} : Finset String) ×ˢ ({1, 2, 3} : Finset ℕ)).card = 4 * 3 ∧ 4 * 3 = 12 := by decide

/-- Razlaga 3, premisli in Ustno vprašanje 2: A × B = B × A natanko tedaj, ko je A = B ali je vsaj ena od množic
prazna. -/
theorem produkt_zamenljiv_iff {α : Type*} (A B : Set α) : A ×ˢ B = B ×ˢ A ↔ A = B ∨ A = ∅ ∨ B = ∅ := by
  rw [Set.prod_eq_prod_iff]
  constructor
  · rintro (⟨h, -⟩ | ⟨h1, -⟩)
    · exact Or.inl h
    · exact Or.inr h1
  · rintro (h | h | h)
    · exact Or.inl ⟨h, h.symm⟩
    · exact Or.inr ⟨Or.inl h, Or.inr h⟩
    · exact Or.inr ⟨Or.inr h, Or.inl h⟩

/-- Razlaga 3 in Ustno vprašanje 2: A = {1}, B = {2}: A × B = {(1, 2)}, B × A = {(2, 1)}, produkta sta različna. -/
theorem ustno2 : ({1} : Finset ℕ) ×ˢ ({2} : Finset ℕ) = {(1, 2)} ∧ ({2} : Finset ℕ) ×ˢ ({1} : Finset ℕ) = {(2, 1)} ∧
    ({1} : Finset ℕ) ×ˢ ({2} : Finset ℕ) ≠ ({2} : Finset ℕ) ×ˢ ({1} : Finset ℕ) := by decide

/-- Primer 2, Ustno vprašanje 2: graf B × A je zrcalna slika A × B čez y = x ((x, y) ∈ A × B ⇔ (y, x) ∈ B × A). -/
theorem zrcaljenje {α : Type*} (A B : Set α) (x y : α) : (x, y) ∈ A ×ˢ B ↔ (y, x) ∈ B ×ˢ A := by
  simp only [Set.mem_prod]; exact and_comm

/-! ## Razlaga 4: moč produkta -/

/-- Razlaga 4, Povzetek in Ustno vprašanje 1: |A × B| = |A| · |B|. -/
theorem moc_produkta {α β : Type*} (A : Finset α) (B : Finset β) : (A ×ˢ B).card = A.card * B.card :=
  Finset.card_product A B

/-- Razlaga 4: pri |A| = 2, |B| = 3 je polj 2 · 3 = 6. -/
theorem moc_2_3 {α β : Type*} (A : Finset α) (B : Finset β) (hA : A.card = 2) (hB : B.card = 3) :
    (A ×ˢ B).card = 2 * 3 ∧ 2 * 3 = 6 := by rw [Finset.card_product, hA, hB]; simp

/-- Predpostavke `moc_2_3` se dajo izpolniti. -/
example : ({1, 2} : Finset ℕ).card = 2 ∧ ({1, 2, 3} : Finset ℕ).card = 3 := by decide

/-- Razlaga 4, premisli: A × ∅ = ∅; pri |A| = 5 je 5 · 0 = 0. -/
theorem produkt_prazna {α β : Type*} (A : Finset α) (hA : A.card = 5) :
    A ×ˢ (∅ : Finset β) = ∅ ∧ (A ×ˢ (∅ : Finset β)).card = A.card * 0 ∧ A.card * 0 = 5 * 0 ∧ 5 * 0 = 0 := by
  rw [hA]; simp

/-- Predpostavke `produkt_prazna` se dajo izpolniti. -/
example : (Finset.range 5).card = 5 := by simp

/-- Pogoste napake 2: moči se množijo, ne seštevajo: 3 kraji, 2 prevoza dajo 6 izbir, ne 5. -/
theorem napaka_sestevanje : 3 * 2 = 6 ∧ 3 + 2 ≠ 6 := by decide

/-! ## Razlaga 5: graf -/

/-- Razlaga 5 in Preveri se 1: graf {1, 2, 3} × {1, 2} je šest točk; (2, 3) ne sodi zraven, (1, 1), (3, 2),
(2, 1) pa. -/
theorem graf_123_12 : ({1, 2, 3} : Finset ℕ) ×ˢ ({1, 2} : Finset ℕ) =
      {(1, 1), (2, 1), (3, 1), (1, 2), (2, 2), (3, 2)} ∧
    (2, 3) ∉ ({1, 2, 3} : Finset ℕ) ×ˢ ({1, 2} : Finset ℕ) ∧
    (1, 1) ∈ ({1, 2, 3} : Finset ℕ) ×ˢ ({1, 2} : Finset ℕ) ∧ (3, 2) ∈ ({1, 2, 3} : Finset ℕ) ×ˢ ({1, 2} : Finset ℕ) ∧
    (2, 1) ∈ ({1, 2, 3} : Finset ℕ) ×ˢ ({1, 2} : Finset ℕ) ∧ (2, 3) ∈ ({1, 2} : Finset ℕ) ×ˢ ({1, 2, 3} : Finset ℕ) := by
  decide

/-- Razlaga 5: točk grafa ℕ × ℕ z obema koordinatama vsaj 1 je neskončno mnogo. -/
theorem nn_neskoncno : {p : ℕ × ℕ | 1 ≤ p.1 ∧ 1 ≤ p.2}.Infinite :=
  Set.infinite_of_injective_forall_mem (f := fun n : ℕ => (n + 1, 1))
    (fun a b h => by simpa using h) (fun n => by simp)

/-- Razlaga 5 in Povzetek: [1, 3] × [0, 2] so točke z 1 ≤ x ≤ 3 in 0 ≤ y ≤ 2 (pravokotnik z robom). -/
theorem pravokotnik (x y : ℝ) : (x, y) ∈ Set.Icc (1 : ℝ) 3 ×ˢ Set.Icc (0 : ℝ) 2 ↔ (1 ≤ x ∧ x ≤ 3) ∧ (0 ≤ y ∧ y ≤ 2) :=
  Iff.rfl

/-- Razlaga 5: {1, 2, 3} × [0, 2] so tri navpične daljice pri x = 1, 2, 3. -/
theorem tri_daljice : ({1, 2, 3} : Set ℝ) ×ˢ Set.Icc (0 : ℝ) 2 =
    ({1} ×ˢ Set.Icc 0 2) ∪ ({2} ×ˢ Set.Icc 0 2) ∪ ({3} ×ˢ Set.Icc 0 2) := by
  ext ⟨x, y⟩; simp only [Set.mem_prod, Set.mem_insert_iff, Set.mem_singleton_iff, Set.mem_union]; tauto

/-- Pogoste napake 4: končni množici ne dasta pravokotnika: (3/2, 1) leži v [1, 3] × [1, 2], ne pa na grafu
{1, 2, 3} × {1, 2}. -/
theorem tocke_ne_lik : ((3 / 2 : ℝ), (1 : ℝ)) ∈ Set.Icc (1 : ℝ) 3 ×ˢ Set.Icc (1 : ℝ) 2 ∧
    ((3 / 2 : ℝ), (1 : ℝ)) ∉ ({1, 2, 3} : Set ℝ) ×ˢ ({1, 2} : Set ℝ) := by
  constructor
  · simp only [Set.mem_prod, Set.mem_Icc]; norm_num
  · simp only [Set.mem_prod, Set.mem_insert_iff, Set.mem_singleton_iff]; norm_num

/-! ## Razlaga 6–7: potenčna množica -/

/-- Razlaga 6: izlet {Piran, Bled}: načrti so ∅, {Piran}, {Bled}, oba. -/
theorem nacrti_dva : ({"Piran", "Bled"} : Finset String).powerset =
    {∅, {"Piran"}, {"Bled"}, {"Piran", "Bled"}} := by decide

/-- Razlaga 6, Povzetek in Preveri se 3: 𝒫({1, 2}) = {∅, {1}, {2}, {1, 2}}; {1} ∈ 𝒫({1, 2}). -/
theorem potencna_12 : ({1, 2} : Finset ℕ).powerset = {∅, {1}, {2}, {1, 2}} ∧
    ({1} : Finset ℕ) ∈ ({1, 2} : Finset ℕ).powerset := by decide

/-- Razlaga 6: X ∈ 𝒫(A) ⇔ X ⊆ A; ∅ in A sta vedno v 𝒫(A). -/
theorem potencna_clan {α : Type*} (A X : Finset α) :
    (X ∈ A.powerset ↔ X ⊆ A) ∧ ∅ ∈ A.powerset ∧ A ∈ A.powerset :=
  ⟨Finset.mem_powerset, Finset.empty_mem_powerset A, Finset.mem_powerset_self A⟩

/-- Razlaga 7, Povzetek in Ustno vprašanje 3: |A| = n ⇒ |𝒫(A)| = 2ⁿ; pri |A| = 2 je 2² = 4. -/
theorem moc_potencne {α : Type*} (A : Finset α) (n : ℕ) (h : A.card = n) : A.powerset.card = 2 ^ n := by
  rw [Finset.card_powerset, h]

/-- Predpostavke `moc_potencne` se dajo izpolniti. -/
example : ({1, 2} : Finset ℕ).card = 2 ∧ (2 : ℕ) ^ 2 = 4 := by decide

/-- Pogoste napake 5 in Kot zgodba: z dodanim elementom se število podmnožic podvoji (ne poveča za 2). -/
theorem podvojitev {α : Type*} [DecidableEq α] (A : Finset α) (a : α) (ha : a ∉ A) :
    (insert a A).powerset.card = 2 * A.powerset.card := by
  rw [Finset.card_powerset, Finset.card_powerset, Finset.card_insert_of_notMem ha, pow_succ, mul_comm]

/-- Predpostavke `podvojitev` se dajo izpolniti. -/
example : (3 : ℕ) ∉ ({1, 2} : Finset ℕ) := by decide

/-- Pogoste napake 5: 2n ni 2ⁿ (npr. n = 3: 6 ≠ 8). -/
theorem dva_n_ni_pot : 2 * 3 ≠ 2 ^ 3 := by decide

/-! ## Rešeni primeri -/

/-- Primer 1 in Pogoste napake 1: K = {Piran, Bled, Ptuj}, V = {vlak, avtobus}: šest parov, 3 · 2 = 6;
(vlak, Bled) ni v K × V (je v V × K), pravilno je (Bled, vlak). -/
theorem primer1 :
    let K : Finset String := {"Piran", "Bled", "Ptuj"}
    let V : Finset String := {"vlak", "avtobus"}
    K ×ˢ V = {("Piran", "vlak"), ("Piran", "avtobus"), ("Bled", "vlak"), ("Bled", "avtobus"),
      ("Ptuj", "vlak"), ("Ptuj", "avtobus")} ∧
    (K ×ˢ V).card = 3 * 2 ∧ 3 * 2 = 6 ∧ ("vlak", "Bled") ∉ K ×ˢ V ∧ ("vlak", "Bled") ∈ V ×ˢ K ∧
    ("Bled", "vlak") ∈ K ×ˢ V := by decide

/-- Primer 2: A = {1, 2, 3}, B = {0, 2}: A × B, B × A, skupna je le (2, 2), zato A × B ≠ B × A. -/
theorem primer2 :
    let A : Finset ℕ := {1, 2, 3}
    let B : Finset ℕ := {0, 2}
    A ×ˢ B = {(1, 0), (2, 0), (3, 0), (1, 2), (2, 2), (3, 2)} ∧
    B ×ˢ A = {(0, 1), (0, 2), (0, 3), (2, 1), (2, 2), (2, 3)} ∧ A ∩ B = {2} ∧
    (A ×ˢ B) ∩ (B ×ˢ A) = {(2, 2)} ∧ A ×ˢ B ≠ B ×ˢ A := by decide

/-- Primer 2, korak 4 in Naloga 2 c): skupne točke A × B in B × A so (A ∩ B) × (B ∩ A). -/
theorem skupne_tocke {α : Type*} (A B : Set α) : (A ×ˢ B) ∩ (B ×ˢ A) = (A ∩ B) ×ˢ (B ∩ A) := Set.prod_inter_prod

/-- Primer 3: R = [2, 5] × [1, 3]; K(4, 2) ∈ R, I(2, 4) ∉ R. -/
theorem primer3_tocke : ((4 : ℝ), (2 : ℝ)) ∈ Set.Icc (2 : ℝ) 5 ×ˢ Set.Icc (1 : ℝ) 3 ∧
    ((2 : ℝ), (4 : ℝ)) ∉ Set.Icc (2 : ℝ) 5 ×ˢ Set.Icc (1 : ℝ) 3 := by
  simp only [Set.mem_prod, Set.mem_Icc]; norm_num

/-- Primer 3, korak 4: ploščina R je (5 − 2) · (3 − 1) = 3 · 2 = 6 (km²). -/
theorem primer3_ploscina : volume (Set.Icc (2 : ℝ) 5 ×ˢ Set.Icc (1 : ℝ) 3) = ENNReal.ofReal 6 := by
  calc volume (Set.Icc (2 : ℝ) 5 ×ˢ Set.Icc (1 : ℝ) 3)
      = ENNReal.ofReal (5 - 2) * ENNReal.ofReal (3 - 1) := by
        rw [Measure.volume_eq_prod, Measure.prod_prod, Real.volume_Icc, Real.volume_Icc]
    _ = ENNReal.ofReal (3 * 2) := by rw [← ENNReal.ofReal_mul (by norm_num)]; norm_num
    _ = ENNReal.ofReal 6 := by norm_num

/-- Primer 3, korak 5: [1, 3] × [2, 5] ima enako ploščino 6, a je drug rezervat (K(4, 2) leži v R, ne pa v njem). -/
theorem primer3_drug : volume (Set.Icc (1 : ℝ) 3 ×ˢ Set.Icc (2 : ℝ) 5) = ENNReal.ofReal 6 ∧
    Set.Icc (1 : ℝ) 3 ×ˢ Set.Icc (2 : ℝ) 5 ≠ Set.Icc (2 : ℝ) 5 ×ˢ Set.Icc (1 : ℝ) 3 := by
  constructor
  · rw [Measure.volume_eq_prod, Measure.prod_prod, Real.volume_Icc, Real.volume_Icc,
      ← ENNReal.ofReal_mul (by norm_num)]; norm_num
  · intro h
    have : ((4 : ℝ), (2 : ℝ)) ∈ Set.Icc (1 : ℝ) 3 ×ˢ Set.Icc (2 : ℝ) 5 := h ▸ primer3_tocke.1
    simp only [Set.mem_prod, Set.mem_Icc] at this; norm_num at this

/-- Primer 4 in premisli: 𝒫({Piran, Bled, Ptuj}) ima 1 + 3 + 3 + 1 = 8 elementov (po velikosti 0, 1, 2, 3), 2³ = 8. -/
theorem primer4 :
    let A : Finset String := {"Piran", "Bled", "Ptuj"}
    A.powerset = {∅, {"Piran"}, {"Bled"}, {"Ptuj"}, {"Piran", "Bled"}, {"Piran", "Ptuj"}, {"Bled", "Ptuj"},
      {"Piran", "Bled", "Ptuj"}} ∧
    (A.powersetCard 0).card = 1 ∧ (A.powersetCard 1).card = 3 ∧ (A.powersetCard 2).card = 3 ∧
    (A.powersetCard 3).card = 1 ∧ 1 + 3 + 3 + 1 = 8 ∧ A.powerset.card = 2 ^ 3 ∧ (2 : ℕ) ^ 3 = 8 := by decide

/-! ## Za maturo -/

/-- Naloga 1: A = {−1, 0, 2}, B = {1, 3}: šest parov, 3 · 2 = 6. -/
theorem naloga1 : ({-1, 0, 2} : Finset ℤ) ×ˢ ({1, 3} : Finset ℤ) =
      {(-1, 1), (-1, 3), (0, 1), (0, 3), (2, 1), (2, 3)} ∧
    (({-1, 0, 2} : Finset ℤ) ×ˢ ({1, 3} : Finset ℤ)).card = 3 * 2 ∧ 3 * 2 = 6 := by decide

/-- Naloga 2 a), d): A = [−1, 2], B = [1, 3]; T(0, 2) ∈ A × B, L(2, 0) ∉ A × B, L ∈ B × A, zato A × B ≠ B × A. -/
theorem naloga2_ad :
    ((0 : ℝ), (2 : ℝ)) ∈ Set.Icc (-1 : ℝ) 2 ×ˢ Set.Icc (1 : ℝ) 3 ∧
    ((2 : ℝ), (0 : ℝ)) ∉ Set.Icc (-1 : ℝ) 2 ×ˢ Set.Icc (1 : ℝ) 3 ∧
    ((2 : ℝ), (0 : ℝ)) ∈ Set.Icc (1 : ℝ) 3 ×ˢ Set.Icc (-1 : ℝ) 2 ∧
    Set.Icc (-1 : ℝ) 2 ×ˢ Set.Icc (1 : ℝ) 3 ≠ Set.Icc (1 : ℝ) 3 ×ˢ Set.Icc (-1 : ℝ) 2 := by
  have hL : ((2 : ℝ), (0 : ℝ)) ∉ Set.Icc (-1 : ℝ) 2 ×ˢ Set.Icc (1 : ℝ) 3 := by
    simp only [Set.mem_prod, Set.mem_Icc]; norm_num
  have hL' : ((2 : ℝ), (0 : ℝ)) ∈ Set.Icc (1 : ℝ) 3 ×ˢ Set.Icc (-1 : ℝ) 2 := by
    simp only [Set.mem_prod, Set.mem_Icc]; norm_num
  refine ⟨by simp only [Set.mem_prod, Set.mem_Icc]; norm_num, hL, hL', fun h => hL (h ▸ hL')⟩

/-- Naloga 2 c): A ∩ B = [1, 2], presek grafov je [1, 2] × [1, 2], ploščina (2 − 1) · (2 − 1) = 1 · 1 = 1. -/
theorem naloga2_c :
    Set.Icc (-1 : ℝ) 2 ∩ Set.Icc 1 3 = Set.Icc 1 2 ∧
    (Set.Icc (-1 : ℝ) 2 ×ˢ Set.Icc (1 : ℝ) 3) ∩ (Set.Icc (1 : ℝ) 3 ×ˢ Set.Icc (-1 : ℝ) 2) =
      Set.Icc (1 : ℝ) 2 ×ˢ Set.Icc (1 : ℝ) 2 ∧
    volume (Set.Icc (1 : ℝ) 2 ×ˢ Set.Icc (1 : ℝ) 2) = ENNReal.ofReal ((2 - 1) * (2 - 1)) ∧
    ((2 : ℝ) - 1) * (2 - 1) = 1 * 1 ∧ (1 : ℝ) * 1 = 1 := by
  have h1 : Set.Icc (-1 : ℝ) 2 ∩ Set.Icc 1 3 = Set.Icc 1 2 := by
    rw [Set.Icc_inter_Icc]; norm_num
  have h2 : Set.Icc (1 : ℝ) 3 ∩ Set.Icc (-1) 2 = Set.Icc 1 2 := by
    rw [Set.Icc_inter_Icc]; norm_num
  refine ⟨h1, by rw [Set.prod_inter_prod, h1, h2], ?_, by norm_num, by norm_num⟩
  rw [Measure.volume_eq_prod, Measure.prod_prod, Real.volume_Icc, ← ENNReal.ofReal_mul (by norm_num)]

/-- Naloga 3 a), b), c): B = {0, 5}: 𝒫(B) = {∅, {0}, {5}, {0, 5}}; |𝒫(A)| = 2³ = 8, |A × 𝒫(B)| = 3 · 4 = 12;
{5} ⊆ B, zato {5} ∈ 𝒫(B); 5 je element B; (2, {0}) ∈ A × 𝒫(B). -/
theorem naloga3_abc :
    let A : Finset ℕ := {1, 2, 3}
    let B : Finset ℕ := {0, 5}
    B.powerset = {∅, {0}, {5}, {0, 5}} ∧ A.powerset.card = 2 ^ 3 ∧ (2 : ℕ) ^ 3 = 8 ∧ B.powerset.card = 4 ∧
    (A ×ˢ B.powerset).card = 3 * 4 ∧ 3 * 4 = 12 ∧ ({5} : Finset ℕ) ⊆ B ∧ ({5} : Finset ℕ) ∈ B.powerset ∧
    5 ∈ B ∧ (2, ({0} : Finset ℕ)) ∈ A ×ˢ B.powerset := by decide

/-- Naloga 3 d) in RACUN »resi: 2^n = 128«: 2ⁿ = 128 ⇔ n = 7. -/
theorem resi_128 (n : ℕ) : 2 ^ n = 128 ↔ n = 7 := by
  constructor
  · intro h; exact Nat.pow_right_injective le_rfl (by simpa using h)
  · rintro rfl; norm_num

/-- Naloga 3 d): podmnožice množice S, ki ne vsebujejo a ∈ S, so natanko podmnožice S ∖ {a}. -/
theorem brez_elementa {α : Type*} [DecidableEq α] (S : Finset α) (a : α) :
    S.powerset.filter (fun X => a ∉ X) = (S.erase a).powerset := by
  ext X; simp only [Finset.mem_filter, Finset.mem_powerset, Finset.subset_erase]

/-- Naloga 3 d): če množici A = {1, 2, 3} dodamo elemente in ima nova množica S 128 podmnožic, ima S 7 elementov,
dodali smo 7 − 3 = 4 elemente, števila 1 pa ne vsebuje 2⁶ = 64 podmnožic. -/
theorem naloga3_d (S : Finset ℕ) (hA : ({1, 2, 3} : Finset ℕ) ⊆ S) (h : S.powerset.card = 128) :
    S.card = 7 ∧ (S \ {1, 2, 3}).card = 7 - 3 ∧ 7 - 3 = 4 ∧
    (S.powerset.filter (fun X => 1 ∉ X)).card = 2 ^ 6 ∧ (2 : ℕ) ^ 6 = 64 := by
  rw [Finset.card_powerset] at h
  have h7 : S.card = 7 := (resi_128 _).mp h
  have h1 : (1 : ℕ) ∈ S := hA (by decide)
  refine ⟨h7, ?_, rfl, ?_, by norm_num⟩
  · rw [Finset.card_sdiff_of_subset hA, h7]; rfl
  · rw [brez_elementa, Finset.card_powerset, Finset.card_erase_of_mem h1, h7]

/-- Predpostavke `naloga3_d` se dajo izpolniti (S = {1, …, 7}). -/
example : ({1, 2, 3} : Finset ℕ) ⊆ Finset.Icc 1 7 ∧ (Finset.Icc 1 7).powerset.card = 128 :=
  ⟨by decide, by rw [Finset.card_powerset]; simp⟩

/-! ## Drugače -/

/-- Kot zgodba: 6 stolpcev a–f in 5 vrstic: 6 · 5 = 30 kvadratov; (d, 4) je kvadrat. Tri znamenitosti dajo 8
načrtov, z muzejem 16 (ne 8 + 1). -/
theorem kot_zgodba :
    (({"a", "b", "c", "d", "e", "f"} : Finset String) ×ˢ Finset.Icc 1 5).card = 6 * 5 ∧ 6 * 5 = 30 ∧
    ("d", 4) ∈ ({"a", "b", "c", "d", "e", "f"} : Finset String) ×ˢ Finset.Icc 1 5 ∧
    ({"grad", "jama", "slap"} : Finset String).powerset.card = 8 ∧
    ({"muzej", "grad", "jama", "slap"} : Finset String).powerset.card = 16 ∧ 8 + 1 ≠ 16 := by decide

/-- Korak za korakom: A = {1, 2, 3}, B = {4, 5}: tabela parov, 3 · 2 = 6, |B × A| = 6, (1, 4) ∉ B × A,
𝒫(B) in 𝒫(A) po velikosti (1 + 3 + 3 + 1 = 8), 2² = 4, 2³ = 8. -/
theorem korak_za_korakom :
    let A : Finset ℕ := {1, 2, 3}
    let B : Finset ℕ := {4, 5}
    A ×ˢ B = {(1, 4), (1, 5), (2, 4), (2, 5), (3, 4), (3, 5)} ∧ (A ×ˢ B).card = 3 * 2 ∧ 3 * 2 = 6 ∧
    (B ×ˢ A).card = 6 ∧ (1, 4) ∉ B ×ˢ A ∧
    B.powerset = {∅, {4}, {5}, {4, 5}} ∧
    A.powerset = {∅, {1}, {2}, {3}, {1, 2}, {1, 3}, {2, 3}, {1, 2, 3}} ∧ 1 + 3 + 3 + 1 = 8 ∧
    B.powerset.card = 2 ^ 2 ∧ (2 : ℕ) ^ 2 = 4 ∧ A.powerset.card = 2 ^ 3 ∧ (2 : ℕ) ^ 3 = 8 := by decide

/-! ## Preveri se -/

/-- Preveri se 2: z enim novim elementom v A se |A × B| poveča za |B|; pri |A| = 5, |B| = 4: 6 · 4 − 5 · 4 = 4. -/
theorem kviz2 {α β : Type*} [DecidableEq α] (A : Finset α) (B : Finset β) (a : α) (ha : a ∉ A) :
    ((insert a A) ×ˢ B).card = (A ×ˢ B).card + B.card := by
  rw [Finset.card_product, Finset.card_product, Finset.card_insert_of_notMem ha]; ring

/-- Predpostavke `kviz2` se dajo izpolniti; številke kviza: 5 · 4 = 20, 6 · 4 = 24, 6 · 4 − 5 · 4 = 4. -/
example : (5 : ℕ) ∉ Finset.range 5 ∧ 5 * 4 = 20 ∧ 6 * 4 = 24 ∧ 6 * 4 - 5 * 4 = 4 := by decide

/-- Preveri se 3: Nikin 4. korak: pravilno je 𝒫({a, b}) = {∅, {a}, {b}, {a, b}}. -/
theorem kviz3 : ({"a", "b"} : Finset String).powerset = {∅, {"a"}, {"b"}, {"a", "b"}} := by decide

/-- Preveri se 4: |A × B| = 42 in |A| = 6 ⇒ |B| = 42 : 6 = 7. -/
theorem kviz4 {α β : Type*} (A : Finset α) (B : Finset β) (h : (A ×ˢ B).card = 42) (hA : A.card = 6) :
    B.card = 42 / 6 ∧ 42 / 6 = 7 := by
  rw [Finset.card_product, hA] at h; omega

/-- Predpostavke `kviz4` se dajo izpolniti (A = {0, …, 5}, B = {0, …, 6}). -/
example : (Finset.range 6 ×ˢ Finset.range 7).card = 42 ∧ (Finset.range 6).card = 6 := by decide

/-- Preveri se 5: 𝒫({p, q, r}) po velikosti: 1 + 3 + 3 + 1 = 8 podmnožic. -/
theorem kviz5 :
    let A : Finset String := {"p", "q", "r"}
    (A.powersetCard 0).card = 1 ∧ (A.powersetCard 1).card = 3 ∧ (A.powersetCard 2).card = 3 ∧
    (A.powersetCard 3).card = 1 ∧ 1 + 3 + 3 + 1 = 8 ∧ A.powerset.card = 8 := by decide

/-- RACUN: vse vrstice »vrednost« (resi je `resi_128`). -/
theorem racun : 3 * 2 = 6 ∧ 4 * 3 = 12 ∧ 2 ^ 2 = 4 ∧ 2 ^ 3 = 8 ∧ 1 + 3 + 3 + 1 = 8 ∧ (5 - 2) * (3 - 1) = 6 ∧
    6 * 5 = 30 ∧ 6 * 4 - 5 * 4 = 4 ∧ 42 / 6 = 7 ∧ 5 * 0 = 0 ∧ (2 - 1) * (2 - 1) = 1 ∧ 3 * 4 = 12 ∧
    7 - 3 = 4 ∧ 2 ^ 6 = 64 := by decide

end Evklid.Lekcije.MAT_SS_1.KartezicniProduktInPotencnaMnozica
