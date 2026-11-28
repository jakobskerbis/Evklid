/-
vir: content/lessons/MAT-SS-1/mnozice.md
sha256: 0948cc23d9f8f6db3aa701c886165d11162d6f66b3b2f33c10ed2d1ea977da33
Ni v Leanu: opredelitev množice kot »skupka natančno določenih objektov« in opombe o zapisu (⊂ v učbenikih, Aᶜ, Ā,
A′; dogovor o zapisu); primerjava množic z logiko »veznik da izjavo, operacija množico« (opis); Vennov diagram,
risba štirih območij, risba za Nalogo 2 b) in »pri treh krogih nastane osem območij« (risbe; dokazano je, da
štiri območja razdelijo 𝒰: `stiri_obmocja`, in elementi vseh območij Naloge 2 b)); simulacija (dokazano je štetje
10 + 6 − 3 = 13 za 𝒰 = {1, …, 20}); spletni filtri in galerija (vsakdanji zgledi; dokazano je, da presek ni večji od
nobene od množic); zapisa {2} ∈ A in 2 ⊆ A iz Pogostih napak (v Leanu se zaradi tipov sploh ne dasta zapisati);
anketa Primera 3 kot statistični podatek (dokazano je, da iz danih moči za vsake tri končne množice sledi 36 in
20, in da take množice obstajajo); točkovanje.
Dogovori: naravna števila so v lekciji od 1 naprej, v Leanu ℕ vsebuje 0, zato je pogoj x ≥ 1 zapisan posebej.
Splošna pravila s komplementom so dokazana v `Set α`, kjer je 𝒰 ves tip α (Aᶜ = 𝒰 ∖ A); konkretni zgledi so
končne množice (`Finset ℕ`) s komplementom 𝒰 ∖ A. Moč |A| je `Finset.card`; odštevanje v ℕ je pri formulah moči
varno, ker je |A ∩ B| ≤ |A| + |B|.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.Mnozice

/-! ## Razlaga 1–3: množica, moč, podmnožica -/

/-- Razlaga 1: vrstni red in ponavljanje elementov ne štejeta: {1, 2, 3} = {3, 2, 1} = {1, 1, 2, 3}.
trditev: MAT-SS-1/mnozice#vrstni-red
besedilo: »Vrstni red in ponavljanje elementov ne štejeta: $\{1, 2, 3\} = \{3, 2, 1\} = \{1, 1, 2, 3\}$.« -/
theorem vrstni_red : ({1, 2, 3} : Finset ℕ) = {3, 2, 1} ∧ ({3, 2, 1} : Finset ℕ) = {1, 1, 2, 3} := by decide

/-- Razlaga 1: zapis z naštevanjem in z lastnostjo opisujeta isto množico:
{x | x je naravno število in x < 6} = {1, 2, 3, 4, 5}.
trditev: MAT-SS-1/mnozice#zapis-z-lastnostjo
besedilo: »Oba zapisa opisujeta isto množico.« -/
theorem zapis_z_lastnostjo : {x : ℕ | 1 ≤ x ∧ x < 6} = ({1, 2, 3, 4, 5} : Set ℕ) := by
  ext x; simp only [Set.mem_ofPred_eq, Set.mem_insert_iff, Set.mem_singleton_iff]; omega

/-- Razlaga 2: |{a, b, c}| = 3 (za različne a, b, c) in |∅| = 0.
trditev: MAT-SS-1/mnozice#moc
besedilo: »$|\{a, b, c\}| = 3$ in $|\emptyset| = 0$« -/
theorem moc {α : Type*} [DecidableEq α] (a b c : α) (hab : a ≠ b) (hac : a ≠ c) (hbc : b ≠ c) :
    ({a, b, c} : Finset α).card = 3 ∧ (∅ : Finset α).card = 0 := by
  refine ⟨?_, Finset.card_empty⟩
  rw [Finset.card_insert_of_notMem (by simp [hab, hac]), Finset.card_pair hbc]

/-- Predpostavke `moc` se dajo izpolniti (a, b, c = 1, 2, 3). -/
example : (1 : ℕ) ≠ 2 ∧ (1 : ℕ) ≠ 3 ∧ (2 : ℕ) ≠ 3 := by decide

/-- Razlaga 2: množica vseh sodih števil je neskončna.
trditev: MAT-SS-1/mnozice#soda-neskoncna
besedilo: »sicer je *neskončna* (na primer množica vseh sodih števil)« -/
theorem soda_neskoncna : {n : ℕ | Even n}.Infinite :=
  Set.infinite_of_injective_forall_mem (f := fun n : ℕ => 2 * n) (fun a b h => by simpa using h)
    (fun n => even_two_mul n)

/-- Razlaga 3 in Ustno vprašanje 1: A = B natanko tedaj, ko A ⊆ B in B ⊆ A; prava podmnožica A ⊂ B pomeni
A ⊆ B in A ≠ B.
trditev: MAT-SS-1/mnozice#enakost-podmnozica
besedilo: »Če velja $A \subseteq B$ in $A \neq B$, je $A$ prava podmnožica množice $B$. Množici $A$ in $B$ sta enaki natanko tedaj, ko velja $A \subseteq B$ in $B \subseteq A$« -/
theorem enakost_podmnozica {α : Type*} (A B : Set α) :
    (A = B ↔ A ⊆ B ∧ B ⊆ A) ∧ (A ⊂ B ↔ A ⊆ B ∧ A ≠ B) :=
  ⟨Set.Subset.antisymm_iff, ssubset_iff_subset_ne⟩

/-- Razlaga 3, premisli in Ustno vprašanje 1: A ⊆ A in ∅ ⊆ A (implikacija x ∈ ∅ ⇒ x ∈ A ima nepravilno
predpostavko).
trditev: MAT-SS-1/mnozice#podmnozica-sebe-prazna
besedilo: »Vsaka množica je podmnožica same sebe ($A \subseteq A$), prazna množica pa je podmnožica vsake množice ($\emptyset \subseteq A$).« -/
theorem podmnozica_sebe_prazna {α : Type*} (A : Set α) : A ⊆ A ∧ ∅ ⊆ A :=
  ⟨subset_rfl, fun _ hx => absurd hx (Set.notMem_empty _)⟩

/-- Razlaga 3 in Pogoste napake 1: 2 ∈ {1, 2, 3} in {2} ⊆ {1, 2, 3}.
trditev: MAT-SS-1/mnozice#element-podmnozica
besedilo: »Zato je $2 \in \{1, 2, 3\}$, toda $\{2\} \subseteq \{1, 2, 3\}$.« -/
theorem element_podmnozica : 2 ∈ ({1, 2, 3} : Finset ℕ) ∧ ({2} : Finset ℕ) ⊆ {1, 2, 3} := by decide

/-- Razlaga 3: 𝒫({a, b}) = {∅, {a}, {b}, {a, b}} (tu a = 1, b = 2) in ima 2² = 4 elemente.
pomozno – izrek preveri le {1, 2}; lekcija pravilo zapiše splošno za {a, b} in nima konkretne množice z dvema elementoma, ki bi jo lahko citirali -/
theorem potencna_ab : ({1, 2} : Finset ℕ).powerset = {∅, {1}, {2}, {1, 2}} ∧
    ({1, 2} : Finset ℕ).powerset.card = 2 ^ 2 ∧ (2 : ℕ) ^ 2 = 4 := by decide

/-- Razlaga 3 in Povzetek (višja raven): množica z n elementi ima natanko 2ⁿ podmnožic.
trditev: MAT-SS-1/mnozice#stevilo-podmnozic
besedilo: »Množica z $n$ elementi ima natanko $2^n$ podmnožic« -/
theorem stevilo_podmnozic {α : Type*} (A : Finset α) : A.powerset.card = 2 ^ A.card := Finset.card_powerset A

/-! ## Razlaga 5–7: operacije in pravila -/

/-- Razlaga 5 in Povzetek: unija, presek, razlika in komplement (v 𝒰) so zgrajeni iz »ali«, »in«, »ne«.
trditev: MAT-SS-1/mnozice#operacije
besedilo: »**Unija** $A \cup B$: $x \in A \vee x \in B$ (v $A$ ali v $B$, lahko v obeh). - **Presek** $A \cap B$: $x \in A \wedge x \in B$ (v $A$ in hkrati v $B$). - **Razlika** $A \setminus B$: $x \in A \wedge x \notin B$ (v $A$, ne pa v $B$). - **Komplement** $A^c$: $x \in \mathcal{U} \wedge x \notin A$ (iz $\mathcal{U}$, niso v $A$).« -/
theorem operacije {α : Type*} (U A B : Set α) (x : α) :
    (x ∈ A ∪ B ↔ x ∈ A ∨ x ∈ B) ∧ (x ∈ A ∩ B ↔ x ∈ A ∧ x ∈ B) ∧ (x ∈ A \ B ↔ x ∈ A ∧ x ∉ B) ∧
    (x ∈ U \ A ↔ x ∈ U ∧ x ∉ A) :=
  ⟨Iff.rfl, Iff.rfl, Iff.rfl, Iff.rfl⟩

/-- Zakaj se tega učimo in Razlaga 5: Ana {glasba, vreme, zemljevid, igra}, Bojan {vreme, igra, slovar}.
Presek je {vreme, igra}, unija ima 5 elementov (ne 4 + 3 = 7), Ana brez Bojana je {glasba, zemljevid}.
trditev: MAT-SS-1/mnozice#ana-bojan
besedilo: »Pri Ani in Bojanu je presek $\{\text{vreme}, \text{igra}\}$, unija ima $5$ elementov, razlika »Ana brez Bojana« pa je $\{\text{glasba}, \text{zemljevid}\}$.« -/
theorem ana_bojan :
    let Ana : Finset String := {"glasba", "vreme", "zemljevid", "igra"}
    let Bojan : Finset String := {"vreme", "igra", "slovar"}
    Ana ∩ Bojan = {"vreme", "igra"} ∧ (Ana ∪ Bojan).card = 5 ∧ 4 + 3 ≠ 5 ∧
      Ana \ Bojan = {"glasba", "zemljevid"} := by decide

/-- Razlaga 5 in Povzetek: disjunktni množici sta tisti z A ∩ B = ∅.
trditev: MAT-SS-1/mnozice#disjunktni
besedilo: »Če je $A \cap B = \emptyset$, sta množici **disjunktni** (tuji): nimata skupnih elementov.« -/
theorem disjunktni {α : Type*} (A B : Set α) : Disjoint A B ↔ A ∩ B = ∅ := Set.disjoint_iff_inter_eq_empty

/-- Razlaga 6 in Povzetek: unija in presek sta zamenljiva.
trditev: MAT-SS-1/mnozice#zamenljivost
besedilo: »Unija in presek sta zamenljiva: $A \cup B = B \cup A$ in $A \cap B = B \cap A$.« -/
theorem zamenljivost {α : Type*} (A B : Set α) : A ∪ B = B ∪ A ∧ A ∩ B = B ∩ A :=
  ⟨Set.union_comm A B, Set.inter_comm A B⟩

/-- Razlaga 6, Povzetek in Pogoste napake 3: razlika ni zamenljiva; A = {1, 2, 3}, B = {3, 4}:
A ∖ B = {1, 2}, B ∖ A = {4}.
trditev: MAT-SS-1/mnozice#razlika-ni-zamenljiva
besedilo: »za $A = \{1, 2, 3\}$ in $B = \{3, 4\}$ je $A \setminus B = \{1, 2\}$, $B \setminus A = \{4\}$« -/
theorem razlika_ni_zamenljiva : ({1, 2, 3} : Finset ℕ) \ {3, 4} = {1, 2} ∧ ({3, 4} : Finset ℕ) \ {1, 2, 3} = {4} ∧
    ({1, 2, 3} : Finset ℕ) \ {3, 4} ≠ ({3, 4} : Finset ℕ) \ {1, 2, 3} := by decide

/-- Razlaga 6 in Preveri se 1: A ∖ B = A ∩ Bᶜ.
trditev: MAT-SS-1/mnozice#razlika-komplement
besedilo: »Razliko lahko zapišemo s komplementom: $A \setminus B = A \cap B^c$.« -/
theorem razlika_komplement {α : Type*} (A B : Set α) : A \ B = A ∩ Bᶜ := Set.sdiff_eq A B

/-- Razlaga 6: (Aᶜ)ᶜ = A.
trditev: MAT-SS-1/mnozice#komplement-komplementa
besedilo: »Komplement komplementa je prvotna množica: $(A^c)^c = A$.« -/
theorem komplement_komplementa {α : Type*} (A : Set α) : Aᶜᶜ = A := compl_compl A

/-- Razlaga 6 in Naloga 3 a): distributivnost preseka in unije.
trditev: MAT-SS-1/mnozice#distributivnost
besedilo: »Distributivnost: $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$ in $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$.« -/
theorem distributivnost {α : Type*} (A B C : Set α) :
    A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C) ∧ A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C) :=
  ⟨Set.inter_union_distrib_left A B C, Set.union_inter_distrib_left A B C⟩

/-- Razlaga 5 (premisli), Razlaga 6, Povzetek in Ustno vprašanje 3: De Morganovi pravili.
trditev: MAT-SS-1/mnozice#de-morgan
besedilo: »De Morganovi pravili: $(A \cup B)^c = A^c \cap B^c$ in $(A \cap B)^c = A^c \cup B^c$.« -/
theorem de_morgan {α : Type*} (A B : Set α) : (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ ∧ (A ∩ B)ᶜ = Aᶜ ∪ Bᶜ :=
  ⟨Set.compl_union A B, Set.compl_inter A B⟩

/-- Razlaga 6: De Morganovi pravili s komplementom v dani univerzalni množici 𝒰 (Xᶜ = 𝒰 ∖ X).
trditev: MAT-SS-1/mnozice#de-morgan-u
besedilo: »Komplement unije je presek komplementov, komplement preseka pa unija komplementov.« -/
theorem de_morgan_u {α : Type*} [DecidableEq α] (U A B : Finset α) :
    U \ (A ∪ B) = (U \ A) ∩ (U \ B) ∧ U \ (A ∩ B) = (U \ A) ∪ (U \ B) := by
  constructor <;> ext x <;> simp only [Finset.mem_sdiff, Finset.mem_union, Finset.mem_inter] <;> tauto

/-- Drugače: Na sliki: štiri območja A ∖ B, A ∩ B, B ∖ A in (A ∪ B)ᶜ: vsak element leži v natanko enem.
trditev: MAT-SS-1/mnozice#stiri-obmocja
besedilo: »Dva kroga, ki se delno prekrivata, razdelita pravokotnik na štiri območja: le v $A$, v obeh, le v $B$ in v nobeni od njiju.« -/
theorem stiri_obmocja {α : Type*} (A B : Set α) (x : α) :
    (x ∈ A \ B ∨ x ∈ A ∩ B ∨ x ∈ B \ A ∨ x ∈ (A ∪ B)ᶜ) ∧
    (x ∈ A \ B → x ∉ A ∩ B ∧ x ∉ B \ A ∧ x ∉ (A ∪ B)ᶜ) ∧
    (x ∈ A ∩ B → x ∉ B \ A ∧ x ∉ (A ∪ B)ᶜ) ∧ (x ∈ B \ A → x ∉ (A ∪ B)ᶜ) := by
  simp only [Set.mem_sdiff, Set.mem_inter_iff, Set.mem_compl_iff, Set.mem_union]; tauto

/-- Drugače: Na sliki: A ⊆ B pomeni, da je krog A cel v krogu B (A ∖ B = ∅); disjunktni množici se ne
prekrivata (A ∩ B = ∅).
trditev: MAT-SS-1/mnozice#podmnozica-razlika
besedilo: »Če je $A \subseteq B$, leži krog $A$ cel znotraj kroga $B$.« -/
theorem podmnozica_razlika {α : Type*} (A B : Set α) : A ⊆ B ↔ A \ B = ∅ := Set.sdiff_eq_empty.symm

/-- Drugače: Iz vsakdanjega življenja: presek ni nikoli večji od nobene od množic.
trditev: MAT-SS-1/mnozice#presek-manjsi
besedilo: »Nov filter, dodan z »in«, števila zadetkov nikoli ne poveča: presek je del vsake od množic, iz katerih nastane.« -/
theorem presek_manjsi {α : Type*} [DecidableEq α] (A B : Finset α) :
    (A ∩ B).card ≤ A.card ∧ (A ∩ B).card ≤ B.card :=
  ⟨Finset.card_le_card Finset.inter_subset_left, Finset.card_le_card Finset.inter_subset_right⟩

/-- Razlaga 7, Povzetek in Ustno vprašanje 2: |A ∪ B| = |A| + |B| − |A ∩ B|; disjunktni množici: |A ∪ B| =
|A| + |B|.
trditev: MAT-SS-1/mnozice#moc-unije
besedilo: »Za končni množici velja $|A \cup B| = |A| + |B| - |A \cap B|$. Elemente preseka vsota $|A| + |B|$ prešteje dvakrat, zato jih enkrat odštejemo. Če sta množici disjunktni, je $A \cap B = \emptyset$, zato je $|A \cup B| = |A| + |B|$.« -/
theorem moc_unije {α : Type*} [DecidableEq α] (A B : Finset α) :
    (A ∪ B).card = A.card + B.card - (A ∩ B).card ∧
    (Disjoint A B → (A ∪ B).card = A.card + B.card) :=
  ⟨Finset.card_union A B, Finset.card_union_of_disjoint⟩

/-- Ustno vprašanje 2: {1, 2} in {3, 4, 5} sta disjunktni, unija ima 2 + 3 = 5 elementov.
trditev: MAT-SS-1/mnozice#ustno2
besedilo: »Primer sta množici $\{1, 2\}$ in $\{3, 4, 5\}$, ki nimata skupnih elementov, zato ima njuna unija $2 + 3 = 5$ elementov.« -/
theorem ustno2 : Disjoint ({1, 2} : Finset ℕ) {3, 4, 5} ∧ (({1, 2} : Finset ℕ) ∪ {3, 4, 5}).card = 2 + 3 ∧
    2 + 3 = 5 := by decide

/-- Razlaga 7 in Primer 3: moč unije treh končnih množic (vključitve in izključitve).
trditev: MAT-SS-1/mnozice#moc-unije3
besedilo: »$|K \cup V \cup G| = |K| + |V| + |G| - |K \cap V| - |K \cap G| - |V \cap G| + |K \cap V \cap G|$« -/
theorem moc_unije3 {α : Type*} [DecidableEq α] (A B C : Finset α) :
    ((A ∪ B ∪ C).card : ℤ) = A.card + B.card + C.card - (A ∩ B).card - (A ∩ C).card - (B ∩ C).card +
      (A ∩ B ∩ C).card := by
  have h1 := Finset.card_union_add_card_inter (A ∪ B) C
  have h2 := Finset.card_union_add_card_inter A B
  have h3 := Finset.card_union_add_card_inter (A ∩ C) (B ∩ C)
  have e1 : (A ∪ B) ∩ C = (A ∩ C) ∪ (B ∩ C) := Finset.union_inter_distrib_right A B C
  have e2 : (A ∩ C) ∩ (B ∩ C) = A ∩ B ∩ C := by
    ext x; simp only [Finset.mem_inter]; tauto
  rw [e1] at h1; rw [e2] at h3
  omega

/-- Razlaga 7 (simulacija): 𝒰 = {1, …, 20}, A soda, B deljiva s 3: |A ∪ B| = 10 + 6 − 3 = 13.
trditev: MAT-SS-1/mnozice#simulacija
besedilo: »Nato preveri štetje: $|A \cup B| = 10 + 6 - 3 = 13$.« -/
theorem simulacija :
    let U := Finset.Icc 1 20
    let A := U.filter (fun n => 2 ∣ n)
    let B := U.filter (fun n => 3 ∣ n)
    A.card = 10 ∧ B.card = 6 ∧ (A ∩ B).card = 3 ∧ (A ∪ B).card = 10 + 6 - 3 ∧ 10 + 6 - 3 = 13 := by decide

/-! ## Rešeni primeri -/

/-- Primer 1: A = {1, …, 6}, B = {2, 4, 6, 8, 10}: unija, presek, obe razliki in preizkus 6 + 5 − 3 = 8.
trditev: MAT-SS-1/mnozice#primer1
besedilo: »Preverimo s formulo za moč unije: $|A| = 6$, $|B| = 5$, $|A \cap B| = 3$, zato je $|A \cup B| = 6 + 5 - 3 = 8$. V uniji smo res našteli $8$ elementov. 6. Odgovor: $A \cup B = \{1, 2, 3, 4, 5, 6, 8, 10\}$, $A \cap B = \{2, 4, 6\}$, $A \setminus B = \{1, 3, 5\}$, $B \setminus A = \{8, 10\}$.« -/
theorem primer1 :
    let A : Finset ℕ := {1, 2, 3, 4, 5, 6}
    let B : Finset ℕ := {2, 4, 6, 8, 10}
    A ∪ B = {1, 2, 3, 4, 5, 6, 8, 10} ∧ A ∩ B = {2, 4, 6} ∧ A \ B = {1, 3, 5} ∧ B \ A = {8, 10} ∧
    A.card = 6 ∧ B.card = 5 ∧ (A ∩ B).card = 3 ∧ (A ∪ B).card = 6 + 5 - 3 ∧ 6 + 5 - 3 = 8 := by decide

/-- Primer 2: 𝒰 = {1, …, 12}, A soda, B večkratniki 3; koraki 1–7 in (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ = {1, 5, 7, 11}.
trditev: MAT-SS-1/mnozice#primer2
besedilo: »Odgovor: $A \cap B = \{6, 12\}$, $A \cup B = \{2, 3, 4, 6, 8, 9, 10, 12\}$ in $(A \cup B)^c = A^c \cap B^c = \{1, 5, 7, 11\}$.« -/
theorem primer2 :
    let U := Finset.Icc 1 12
    let A := U.filter (fun n => 2 ∣ n)
    let B := U.filter (fun n => 3 ∣ n)
    A = {2, 4, 6, 8, 10, 12} ∧ B = {3, 6, 9, 12} ∧ A ∩ B = {6, 12} ∧ A ∩ B = U.filter (fun n => 6 ∣ n) ∧
    A ∪ B = {2, 3, 4, 6, 8, 9, 10, 12} ∧ U \ (A ∪ B) = {1, 5, 7, 11} ∧
    U \ A = {1, 3, 5, 7, 9, 11} ∧ U \ B = {1, 2, 4, 5, 7, 8, 10, 11} ∧ (U \ A) ∩ (U \ B) = {1, 5, 7, 11} ∧
    (A ∪ B).card = 6 + 4 - 2 ∧ 6 + 4 - 2 = 8 ∧ (U \ (A ∪ B)).card = 12 - 8 ∧ 12 - 8 = 4 := by decide

/-- Primer 3: za vsake tri končne množice K, V, G z danimi močmi je |K ∪ V ∪ G| = 36, natanko eno vrsto
(območja samo K, samo V, samo G) pa uporablja 9 + 6 + 5 = 20 dijakov.
trditev: MAT-SS-1/mnozice#primer3
besedilo: »$9 + 6 + 5 = 20$. Sodelovalo je $36$ dijakov, natanko eno vrsto aplikacij jih uporablja $20$.« -/
theorem primer3 {α : Type*} [DecidableEq α] (K V G : Finset α) (hK : K.card = 22) (hV : V.card = 18)
    (hG : G.card = 15) (hKV : (K ∩ V).card = 9) (hKG : (K ∩ G).card = 7) (hVG : (V ∩ G).card = 6)
    (hKVG : (K ∩ V ∩ G).card = 3) :
    (K ∪ V ∪ G).card = 36 ∧ (K \ (V ∪ G)).card = 9 ∧ (V \ (K ∪ G)).card = 6 ∧ (G \ (K ∪ V)).card = 5 ∧
    (K \ (V ∪ G)).card + (V \ (K ∪ G)).card + (G \ (K ∪ V)).card = 20 := by
  -- samo X: |X ∖ (Y ∪ Z)| + |X ∩ Y| + |X ∩ Z| = |X| + |X ∩ Y ∩ Z|
  have samo : ∀ X Y Z : Finset α, (X \ (Y ∪ Z)).card + (X ∩ Y).card + (X ∩ Z).card =
      X.card + (X ∩ Y ∩ Z).card := by
    intro X Y Z
    have a := Finset.card_sdiff_add_card_inter X (Y ∪ Z)
    have b := Finset.card_union_add_card_inter (X ∩ Y) (X ∩ Z)
    have e1 : X ∩ (Y ∪ Z) = (X ∩ Y) ∪ (X ∩ Z) := Finset.inter_union_distrib_left X Y Z
    have e2 : (X ∩ Y) ∩ (X ∩ Z) = X ∩ Y ∩ Z := by ext x; simp only [Finset.mem_inter]; tauto
    rw [e1] at a; rw [e2] at b; omega
  have u := moc_unije3 K V G
  have sK := samo K V G
  have sV := samo V K G
  have sG := samo G K V
  rw [Finset.inter_comm V K] at sV
  rw [Finset.inter_comm G K, Finset.inter_comm G V] at sG
  have e : K ∩ G ∩ V = K ∩ V ∩ G := by ext x; simp only [Finset.mem_inter]; tauto
  rw [e] at sG
  refine ⟨by omega, by omega, by omega, by omega, by omega⟩

/-- Predpostavke `primer3` se dajo izpolniti: območja 3 (vse tri), 6, 4, 3 (natanko dve), 9, 6, 5 (natanko ena)
na številih 0–35. -/
example : ∃ K V G : Finset ℕ, K.card = 22 ∧ V.card = 18 ∧ G.card = 15 ∧ (K ∩ V).card = 9 ∧
    (K ∩ G).card = 7 ∧ (V ∩ G).card = 6 ∧ (K ∩ V ∩ G).card = 3 :=
  ⟨Finset.range 13 ∪ Finset.Ico 16 25, Finset.range 9 ∪ Finset.Ico 13 16 ∪ Finset.Ico 25 31,
    Finset.range 3 ∪ Finset.Ico 9 16 ∪ Finset.Ico 31 36, by decide⟩

/-- Primer 3, koraki 2–5 in premisli: 9 − 3 = 6, 7 − 3 = 4, 6 − 3 = 3; 22 − (6 + 4 + 3) = 22 − 13 = 9,
18 − (6 + 3 + 3) = 18 − 12 = 6, 15 − (4 + 3 + 3) = 15 − 10 = 5; vsota 36; formula 55 − 22 + 3 = 36; 9 + 6 + 5 = 20.
trditev: MAT-SS-1/mnozice#primer3-racun
besedilo: »Natanko dve vrsti: klepet in videe brez glasbe $9 - 3 = 6$, klepet in glasbo brez videov $7 - 3 = 4$, videe in glasbo brez klepeta $6 - 3 = 3$. 3. Natanko ena vrsta: od vseh v krogu odštejemo že vpisana območja z dvema ali tremi vrstami. Samo klepet $22 - (6 + 4 + 3) = 22 - 13 = 9$, samo videi $18 - (6 + 3 + 3) = 18 - 12 = 6$, samo glasba $15 - (4 + 3 + 3) = 15 - 10 = 5$. 4. Skupaj: $9 + 6 + 5 + 6 + 4 + 3 + 3 = 36$ dijakov. 5. Preverimo s formulo: $22 + 18 + 15 - 9 - 7 - 6 + 3 = 55 - 22 + 3 = 36$.« -/
theorem primer3_racun :
    9 - 3 = 6 ∧ 7 - 3 = 4 ∧ 6 - 3 = 3 ∧
    (22 - (6 + 4 + 3) = 22 - 13 ∧ 22 - 13 = 9) ∧ (18 - (6 + 3 + 3) = 18 - 12 ∧ 18 - 12 = 6) ∧
    (15 - (4 + 3 + 3) = 15 - 10 ∧ 15 - 10 = 5) ∧ 9 + 6 + 5 + 6 + 4 + 3 + 3 = 36 ∧
    ((22 : ℤ) + 18 + 15 - 9 - 7 - 6 + 3 = 55 - 22 + 3 ∧ (55 : ℤ) - 22 + 3 = 36) ∧ 9 + 6 + 5 = 20 := by decide

/-! ## Pogoste napake -/

/-- Pogoste napake 2: |A| = 20, |B| = 15, |A ∩ B| = 6 ⇒ |A ∪ B| = 29, ne 35.
trditev: MAT-SS-1/mnozice#napaka-dvojno
besedilo: »Pri $|A| = 20$, $|B| = 15$ in $|A \cap B| = 6$ je v uniji $29$ elementov, ne $35$.« -/
theorem napaka_dvojno {α : Type*} [DecidableEq α] (A B : Finset α) (hA : A.card = 20) (hB : B.card = 15)
    (hAB : (A ∩ B).card = 6) : (A ∪ B).card = 29 ∧ (A ∪ B).card ≠ 35 := by
  have := Finset.card_union_add_card_inter A B; omega

/-- Predpostavke `napaka_dvojno` se dajo izpolniti (A = {0, …, 19}, B = {14, …, 28}). -/
example : (Finset.range 20).card = 20 ∧ (Finset.Ico 14 29).card = 15 ∧
    (Finset.range 20 ∩ Finset.Ico 14 29).card = 6 := by decide

/-- Pogoste napake 4: komplement je odvisen od 𝒰: za A = {2, 4} je v {1, 2, 3, 4} komplement {1, 3}, v {1, …, 6}
pa {1, 3, 5, 6}.
trditev: MAT-SS-1/mnozice#komplement-odvisen
besedilo: »Za $A = \{2, 4\}$ je v $\mathcal{U} = \{1, 2, 3, 4\}$ komplement $\{1, 3\}$, v $\mathcal{U} = \{1, \dots, 6\}$ pa $\{1, 3, 5, 6\}$.« -/
theorem komplement_odvisen : ({1, 2, 3, 4} : Finset ℕ) \ {2, 4} = {1, 3} ∧
    Finset.Icc 1 6 \ {2, 4} = {1, 3, 5, 6} := by decide

/-- Pogoste napake 5: ∅ ≠ {0}, |∅| = 0, |{0}| = 1, |{∅}| = 1.
trditev: MAT-SS-1/mnozice#prazna-ni-nic
besedilo: »Pravilno: $|\emptyset| = 0$, $|\{0\}| = 1$ in tudi $|\{\emptyset\}| = 1$.« -/
theorem prazna_ni_nic : (∅ : Finset ℕ) ≠ {0} ∧ (∅ : Finset ℕ).card = 0 ∧ ({0} : Finset ℕ).card = 1 ∧
    ({∅} : Finset (Finset ℕ)).card = 1 := by decide

/-! ## Za maturo -/

/-- Naloga 1: 28 dijakov, 17 košarka, 12 odbojka, 4 nobenega ⇒ |A ∪ B| = 28 − 4 = 24, |A ∩ B| = 17 + 12 − 24 = 5,
samo košarka |A ∖ B| = 17 − 5 = 12.
trditev: MAT-SS-1/mnozice#naloga1
besedilo: »Odgovor: oba športa trenira $5$ dijakov, samo košarko pa $12$ dijakov.« -/
theorem naloga1 {α : Type*} [DecidableEq α] (U A B : Finset α) (hA : A ⊆ U) (hB : B ⊆ U) (hU : U.card = 28)
    (hAc : A.card = 17) (hBc : B.card = 12) (h0 : (U \ (A ∪ B)).card = 4) :
    (A ∪ B).card = 28 - 4 ∧ 28 - 4 = 24 ∧ (A ∩ B).card = 17 + 12 - 24 ∧ 17 + 12 - 24 = 5 ∧
    (A \ B).card = 17 - 5 ∧ 17 - 5 = 12 := by
  have h1 := Finset.card_sdiff_add_card_eq_card (Finset.union_subset hA hB)
  have h2 := Finset.card_union_add_card_inter A B
  have h3 := Finset.card_sdiff_add_card_inter A B
  omega

/-- Predpostavke `naloga1` se dajo izpolniti (𝒰 = {0, …, 27}, A = {0, …, 16}, B = {12, …, 23}). -/
example : Finset.range 17 ⊆ Finset.range 28 ∧ Finset.Ico 12 24 ⊆ Finset.range 28 ∧
    (Finset.range 28).card = 28 ∧ (Finset.range 17).card = 17 ∧ (Finset.Ico 12 24).card = 12 ∧
    (Finset.range 28 \ (Finset.range 17 ∪ Finset.Ico 12 24)).card = 4 := by decide

/-- Naloga 2: 𝒰 = {1, …, 15}, A praštevila, B liha števila; a) naštevanje, b) območja diagrama, c) presek,
razlika, komplement unije s preizkusom 6 + 8 − 5 = 9, 15 − 9 = 6, d) A ⊄ B (2 ∈ A, 2 ∉ B).
trditev: MAT-SS-1/mnozice#naloga2
besedilo: »Odgovor: $A = \{2, 3, 5, 7, 11, 13\}$, $B = \{1, 3, 5, 7, 9, 11, 13, 15\}$, $A \cap B = \{3, 5, 7, 11, 13\}$, $B \setminus A = \{1, 9, 15\}$, $(A \cup B)^c = \{4, 6, 8, 10, 12, 14\}$; $A$ ni podmnožica množice $B$.« -/
theorem naloga2 :
    let U := Finset.Icc 1 15
    let A := U.filter Nat.Prime
    let B := U.filter (fun n => n % 2 = 1)
    A = {2, 3, 5, 7, 11, 13} ∧ ¬ Nat.Prime 1 ∧ B = {1, 3, 5, 7, 9, 11, 13, 15} ∧
    A \ B = {2} ∧ U \ (A ∪ B) = {4, 6, 8, 10, 12, 14} ∧
    A ∩ B = {3, 5, 7, 11, 13} ∧ B \ A = {1, 9, 15} ∧ A ∪ B = {1, 2, 3, 5, 7, 9, 11, 13, 15} ∧
    (A ∪ B).card = 6 + 8 - 5 ∧ 6 + 8 - 5 = 9 ∧ (U \ (A ∪ B)).card = 15 - 9 ∧ 15 - 9 = 6 ∧
    2 ∈ A ∧ 2 ∉ B ∧ ¬ A ⊆ B := by decide

/-- Naloga 3 b): (Aᶜ ∪ B)ᶜ = (Aᶜ)ᶜ ∩ Bᶜ = A ∩ Bᶜ = A ∖ B.
trditev: MAT-SS-1/mnozice#naloga3b-pravilo
besedilo: »Po De Morganovem pravilu je $(A^c \cup B)^c = (A^c)^c \cap B^c$. Ker je $(A^c)^c = A$, dobimo $A \cap B^c = A \setminus B$.« -/
theorem naloga3b_pravilo {α : Type*} (A B : Set α) : (Aᶜ ∪ B)ᶜ = A \ B := by
  calc (Aᶜ ∪ B)ᶜ = Aᶜᶜ ∩ Bᶜ := Set.compl_union _ _
    _ = A ∩ Bᶜ := by rw [compl_compl]
    _ = A \ B := (Set.sdiff_eq A B).symm

/-- Naloga 3: 𝒰 = {1, …, 12}, A delitelji 12, B soda, C < 6; a) A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C) =
{1, 2, 3, 4, 6, 12}; b) 𝒰 ∖ ((𝒰 ∖ A) ∪ B) = A ∖ B = {1, 3}; c) 2⁶ = 64 podmnožic, 2⁵ = 32 z elementom 12;
d) moči in |A ∪ B ∪ C| = 6 + 6 + 5 − 4 − 4 − 2 + 2 = 9, zunaj so 7, 9, 11, 12 − 3 = 9.
trditev: MAT-SS-1/mnozice#naloga3
besedilo: »Odgovor: $A \cap (B \cup C) = (A \cap B) \cup (A \cap C) = \{1, 2, 3, 4, 6, 12\}$ (distributivnost); $(A^c \cup B)^c = A \setminus B = \{1, 3\}$; $A$ ima $64$ podmnožic, $32$ izmed njih vsebuje število $12$; $|A \cup B \cup C| = 9$.« -/
theorem naloga3 :
    let U := Finset.Icc 1 12
    let A := U.filter (fun n => n ∣ 12)
    let B := U.filter (fun n => 2 ∣ n)
    let C := U.filter (fun n => n < 6)
    A = {1, 2, 3, 4, 6, 12} ∧ B = {2, 4, 6, 8, 10, 12} ∧ C = {1, 2, 3, 4, 5} ∧
    B ∪ C = {1, 2, 3, 4, 5, 6, 8, 10, 12} ∧ A ∩ (B ∪ C) = {1, 2, 3, 4, 6, 12} ∧
    A ∩ B = {2, 4, 6, 12} ∧ A ∩ C = {1, 2, 3, 4} ∧ (A ∩ B) ∪ (A ∩ C) = {1, 2, 3, 4, 6, 12} ∧
    U \ ((U \ A) ∪ B) = A \ B ∧ A \ B = {1, 3} ∧
    A.card = 6 ∧ A.powerset.card = 2 ^ 6 ∧ (2 : ℕ) ^ 6 = 64 ∧
    (A.powerset.filter (fun S => 12 ∈ S)).card = ({1, 2, 3, 4, 6} : Finset ℕ).powerset.card ∧
    ({1, 2, 3, 4, 6} : Finset ℕ).powerset.card = 2 ^ 5 ∧ (2 : ℕ) ^ 5 = 32 ∧
    B.card = 6 ∧ C.card = 5 ∧ (A ∩ B).card = 4 ∧ (A ∩ C).card = 4 ∧ B ∩ C = {2, 4} ∧ (B ∩ C).card = 2 ∧
    A ∩ B ∩ C = {2, 4} ∧ (A ∩ B ∩ C).card = 2 ∧
    (A ∪ B ∪ C).card = 6 + 6 + 5 - 4 - 4 - 2 + 2 ∧ 6 + 6 + 5 - 4 - 4 - 2 + 2 = 9 ∧
    U \ (A ∪ B ∪ C) = {7, 9, 11} ∧ 12 - 3 = 9 := by decide

/-- Naloga 3 c): podmnožice, ki vsebujejo 12, dobimo tako, da podmnožici {1, 2, 3, 4, 6} dodamo 12 (ta prireditev
je bijektivna).
trditev: MAT-SS-1/mnozice#naloga3c-bijekcija
besedilo: »Vsako podmnožico, ki vsebuje $12$, dobimo tako, da eni od podmnožic množice $\{1, 2, 3, 4, 6\}$ dodamo število $12$.« -/
theorem naloga3c_bijekcija :
    (({1, 2, 3, 4, 6, 12} : Finset ℕ).powerset.filter (fun S => 12 ∈ S)) =
      ({1, 2, 3, 4, 6} : Finset ℕ).powerset.image (insert 12) ∧
    Set.InjOn (insert 12) (({1, 2, 3, 4, 6} : Finset ℕ).powerset : Set (Finset ℕ)) := by
  refine ⟨by decide, ?_⟩
  intro S hS T hT h
  simp only [Finset.coe_powerset, Set.mem_preimage, Set.mem_powerset_iff, Finset.coe_subset] at hS hT
  have h12S : (12 : ℕ) ∉ S := fun h => by simpa using hS h
  have h12T : (12 : ℕ) ∉ T := fun h => by simpa using hT h
  rw [← Finset.erase_insert h12S, ← Finset.erase_insert h12T]; exact congrArg (·.erase 12) h

/-! ## Preveri se -/

/-- Preveri se 2: 30 dijakov, 25 s kolesom, 20 s smučmi ⇒ oboje ima najmanj 25 + 20 − 30 = 15.
trditev: MAT-SS-1/mnozice#kviz2
besedilo: »V uniji je največ $30$ dijakov, zato je $|A \cap B| = |A| + |B| - |A \cup B| \ge 25 + 20 - 30 = 15$.« -/
theorem kviz2 {α : Type*} [DecidableEq α] (U A B : Finset α) (hA : A ⊆ U) (hB : B ⊆ U) (hU : U.card = 30)
    (hAc : A.card = 25) (hBc : B.card = 20) : 25 + 20 - 30 ≤ (A ∩ B).card ∧ 25 + 20 - 30 = 15 := by
  have h1 := Finset.card_le_card (Finset.union_subset hA hB)
  have h2 := Finset.card_union_add_card_inter A B
  omega

/-- Preveri se 2: najmanj 15 se res doseže (𝒰 = {0, …, 29}, A = {0, …, 24}, B = {10, …, 29}); to je tudi primer
za predpostavke `kviz2`. -/
example : Finset.range 25 ⊆ Finset.range 30 ∧ Finset.Ico 10 30 ⊆ Finset.range 30 ∧ (Finset.range 30).card = 30 ∧
    (Finset.range 25).card = 25 ∧ (Finset.Ico 10 30).card = 20 ∧
    (Finset.range 25 ∩ Finset.Ico 10 30).card = 15 := by decide

/-- Preveri se 4: A = {1, 2, 3}; A ∪ B = {1, …, 5} in A ∩ B = {3} velja natanko za B = {3, 4, 5}.
trditev: MAT-SS-1/mnozice#kviz4
besedilo: »$B$ mora vsebovati $4$ in $5$ (zaradi unije) in $3$ (zaradi preseka), ne sme pa vsebovati $1$ in $2$. Torej $B = \{3, 4, 5\}$.« -/
theorem kviz4 (B : Finset ℕ) : (({1, 2, 3} : Finset ℕ) ∪ B = {1, 2, 3, 4, 5} ∧ ({1, 2, 3} : Finset ℕ) ∩ B = {3}) ↔
    B = {3, 4, 5} := by
  constructor
  · rintro ⟨hu, hi⟩
    ext x
    have h1 := Finset.ext_iff.mp hu x
    have h2 := Finset.ext_iff.mp hi x
    simp only [Finset.mem_union, Finset.mem_inter, Finset.mem_insert, Finset.mem_singleton] at h1 h2 ⊢
    by_cases hx : x ∈ B <;> simp [hx] at h1 h2 ⊢ <;> omega
  · rintro rfl; decide

/-- Preveri se 5: 120 fotografij, 45 priljubljenih, 30 z lokacijo, 12 oboje ⇒ unija 45 + 30 − 12 = 63, brez obeh
oznak 120 − 63 = 57.
trditev: MAT-SS-1/mnozice#kviz5
besedilo: »Unija: $45 + 30 - 12 = 63$. Komplement v $\mathcal{U}$ s $120$ fotografijami: $120 - 63 = 57$.« -/
theorem kviz5 {α : Type*} [DecidableEq α] (U A B : Finset α) (hA : A ⊆ U) (hB : B ⊆ U) (hU : U.card = 120)
    (hAc : A.card = 45) (hBc : B.card = 30) (hAB : (A ∩ B).card = 12) :
    (A ∪ B).card = 45 + 30 - 12 ∧ 45 + 30 - 12 = 63 ∧ (U \ (A ∪ B)).card = 120 - 63 ∧ 120 - 63 = 57 := by
  have h1 := Finset.card_sdiff_add_card_eq_card (Finset.union_subset hA hB)
  have h2 := Finset.card_union_add_card_inter A B
  omega

/-- Predpostavke `kviz5` se dajo izpolniti (𝒰 = {0, …, 119}, A = {0, …, 44}, B = {33, …, 62}). -/
example : Finset.range 45 ⊆ Finset.range 120 ∧ Finset.Ico 33 63 ⊆ Finset.range 120 ∧
    (Finset.range 120).card = 120 ∧ (Finset.range 45).card = 45 ∧ (Finset.Ico 33 63).card = 30 ∧
    (Finset.range 45 ∩ Finset.Ico 33 63).card = 12 := by decide

/-- RACUN: vse vrstice bloka.
pomozno – računi iz bloka RACUN, ki ga učenec ne vidi -/
theorem racun : 28 - 4 = 24 ∧ 17 + 12 - 24 = 5 ∧ 17 - 5 = 12 ∧ 6 + 8 - 5 = 9 ∧ 15 - 9 = 6 ∧ 2 ^ 6 = 64 ∧
    2 ^ 5 = 32 ∧ 6 + 6 + 5 - 4 - 4 - 2 + 2 = 9 ∧ 12 - 3 = 9 ∧ 2 + 3 = 5 ∧ 25 + 20 - 30 = 15 ∧
    120 - (45 + 30 - 12) = 57 := by decide

end Evklid.Lekcije.MAT_SS_1.Mnozice
