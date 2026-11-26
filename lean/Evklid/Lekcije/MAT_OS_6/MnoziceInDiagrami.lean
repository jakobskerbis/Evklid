/-
vir: content/lessons/MAT-OS-6/mnozice-in-diagrami.md
sha256: 2e4c159a72802de1fd00b0fcf602a499802eae6ae45a5ebc4a52154da28b1de2
Model: množice so končne (`Finset`); kraji so elementi tipa `Kraj`; »pravokotnik« (vsi elementi, o katerih
govorimo) je množica U, kroga sta A, B ⊆ U; področja Vennovega diagrama so A ∩ B (prekrivanje), A \ B (samo A),
B \ A (samo B) in U \ (A ∪ B) (zunaj krogov); polja Carrollovega diagrama za lastnosti M, Z so preseki
M/ne M z Z/ne Z. Števila v nalogah s štetjem so števila elementov (`card`); trditve so dokazane za vse množice
s takimi števili elementov (rešitev je enolična), primer pokaže, da take množice obstajajo.
Lean: odštevanje v ℕ je odrezano pri 0; v trditvah se odšteva le manjše od večjega.
Ni v Leanu: zgodba in naštevanje uporab diagramov; »množica je lahko dana s seznamom ali z lastnostjo« (opis);
risanje diagramov in podobi znakov ∩, ∪ (podkev, posoda); napotek za simulacijo (dokazano, kaj simulacija pokaže
za U = {1, …, 20}: presek {6, 12, 18} in unija); »Diagram potem kaže, kot da sta to dva kraja« (opis risbe);
analogija s svetilkama in zgodba z ekskurzije (opis; ustrezna pravila – presek, unija, unijo štejemo brez
dvojnega štetja preseka, zunanje področje – so dokazana).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.MnoziceInDiagrami

/-- Kraji iz lekcije. -/
inductive Kraj
  | piran | koper | bled | postojna | ptuj | celje | kranj | ljubljana | bovec
  | lipa | breg | vrh | log | gaj
  deriving DecidableEq

open Kraj

/-! ## Zakaj se tega učimo -/

/-- Uvod: Piran 12, jama 9, vsak vsaj na enem (A ∪ B = vsi), vseh 16: na obeh je natanko 21 − 16 = 5 izletnikov.
trditev: MAT-OS-6/mnozice-in-diagrami#uvod
besedilo: »Takih je $21 - 16 = 5$.« -/
theorem uvod {α : Type*} [DecidableEq α] (A B : Finset α) (hA : A.card = 12) (hB : B.card = 9)
    (hU : (A ∪ B).card = 16) : (A ∩ B).card = 5 ∧ 12 + 9 = 21 ∧ 21 - 16 = 5 := by
  have := Finset.card_union_add_card_inter A B
  omega

example := uvod (Finset.range 12) (Finset.Icc 7 15) (by simp) (by simp) (by decide)

/-! ## Razlaga -/

/-- Razlaga (množica in element): za vsak predmet x in množico A velja: x je v A ali ni.
trditev: MAT-OS-6/mnozice-in-diagrami#element
besedilo: »Pri vsakem predmetu moramo znati odločiti: ali je v množici ali ni.« -/
theorem element {α : Type*} [DecidableEq α] (x : α) (A : Finset α) : x ∈ A ∨ x ∉ A := em _

/-- Razlaga (Euler-Vennov diagram) in Povzetek: vsak element pravokotnika U je v natanko enem od štirih področij
(prekrivanje, samo A, samo B, zunaj), zato je |U| vsota števil elementov štirih področij.
trditev: MAT-OS-6/mnozice-in-diagrami#venn-stiri
besedilo: »Vsak element napišeš **natanko enkrat**, v tisto področje, kamor sodi.« -/
theorem venn_stiri {α : Type*} [DecidableEq α] (U A B : Finset α) (hA : A ⊆ U) (hB : B ⊆ U) :
    (∀ x ∈ U, (x ∈ A ∩ B ∧ x ∉ A \ B ∧ x ∉ B \ A ∧ x ∉ U \ (A ∪ B)) ∨
      (x ∉ A ∩ B ∧ x ∈ A \ B ∧ x ∉ B \ A ∧ x ∉ U \ (A ∪ B)) ∨
      (x ∉ A ∩ B ∧ x ∉ A \ B ∧ x ∈ B \ A ∧ x ∉ U \ (A ∪ B)) ∨
      (x ∉ A ∩ B ∧ x ∉ A \ B ∧ x ∉ B \ A ∧ x ∈ U \ (A ∪ B))) ∧
    U.card = (A ∩ B).card + (A \ B).card + (B \ A).card + (U \ (A ∪ B)).card := by
  refine ⟨fun x hx => ?_, ?_⟩
  · by_cases ha : x ∈ A <;> by_cases hb : x ∈ B <;> simp [ha, hb, hx]
  · have h1 := Finset.card_sdiff_add_card_eq_card (Finset.union_subset hA hB)
    have h2 := Finset.card_union_add_card_inter A B
    have h3 := Finset.card_sdiff_add_card_inter A B
    have h4 := Finset.card_sdiff_add_card_inter B A
    rw [Finset.inter_comm B A] at h4
    omega

example := (venn_stiri ({1, 2, 3, 4} : Finset ℕ) {1, 2} {2, 3} (by decide) (by decide)).1 4 (by decide)

/-- Razlaga (premisli): kraj, ki ga je obiskala Ana in ne Bor, je v delu »samo A« (in v nobenem drugem
področju); kraj samo Bora v delu »samo B«; kraj, kjer ni bil nihče, je v pravokotniku zunaj obeh krogov.
trditev: MAT-OS-6/mnozice-in-diagrami#premisli-podrocja
besedilo: »Koper v levi del (samo $A$), Kranj v desni del (samo $B$), Celje pa v pravokotnik zunaj obeh krogov.« -/
theorem premisli_podrocja {α : Type*} [DecidableEq α] (U A B : Finset α) (k kr c : α)
    (hk : k ∈ A ∧ k ∉ B) (hkr : kr ∉ A ∧ kr ∈ B) (hc : c ∈ U ∧ c ∉ A ∧ c ∉ B) :
    (k ∈ A \ B ∧ k ∉ A ∩ B) ∧ (kr ∈ B \ A ∧ kr ∉ A ∩ B) ∧ c ∈ U \ (A ∪ B) := by
  simp_all

example := premisli_podrocja {koper, kranj, celje} {koper} {kranj} koper kranj celje (by decide) (by decide)
  (by decide)

/-- Razlaga (presek in unija) in Povzetek: x ∈ A ∩ B ⇔ x ∈ A in x ∈ B; x ∈ A ∪ B ⇔ x ∈ A ali x ∈ B (ali v obeh).
trditev: MAT-OS-6/mnozice-in-diagrami#presek-unija
besedilo: »Presek $A \cap B$: elementi v $A$ **in** v $B$. Unija $A \cup B$: elementi v $A$ **ali** v $B$.« -/
theorem presek_unija {α : Type*} [DecidableEq α] (A B : Finset α) (x : α) :
    (x ∈ A ∩ B ↔ x ∈ A ∧ x ∈ B) ∧ (x ∈ A ∪ B ↔ x ∈ A ∨ x ∈ B) :=
  ⟨Finset.mem_inter, Finset.mem_union⟩

/-- Razlaga: presek je vedno del unije.
trditev: MAT-OS-6/mnozice-in-diagrami#presek-del-unije
besedilo: »Presek je vedno del unije.« -/
theorem presek_del_unije {α : Type*} [DecidableEq α] (A B : Finset α) : A ∩ B ⊆ A ∪ B :=
  Finset.inter_subset_union

/-- Razlaga (Carrollov diagram): ob morju M = {Koper, Piran}, železnica Z = {Koper, Ljubljana}; polja so
{Koper}, {Ljubljana}, {Piran}, {Bovec}; levo zgoraj je presek M ∩ Z, prva vrstica in prvi stolpec sta M ∪ Z.
trditev: MAT-OS-6/mnozice-in-diagrami#carroll-kraji
besedilo: »Polje levo zgoraj je presek lastnosti »ob morju« in »ima železnico«. Prva vrstica in prvi stolpec skupaj sta njuna unija.« -/
theorem carroll_kraji :
    let U : Finset Kraj := {koper, ljubljana, piran, bovec}
    let M : Finset Kraj := {koper, piran}
    let Z : Finset Kraj := {koper, ljubljana}
    M ∩ Z = {koper} ∧ Z \ M = {ljubljana} ∧ M \ Z = {piran} ∧ U \ (M ∪ Z) = {bovec} ∧
      M ∪ Z = {koper, ljubljana, piran} := by
  decide

/-- Razlaga (Carrollov diagram): vsak element je v natanko enem polju – polje določata odgovora da/ne na obe
vprašanji (x ∈ M, x ∈ Z); možnih kombinacij odgovorov je 2 · 2 = 4.
trditev: MAT-OS-6/mnozice-in-diagrami#carroll-eno-polje
besedilo: »Vsak kraj pade v **natanko eno** polje, ker na obe vprašanji odgovoriš z da ali ne.« -/
theorem carroll_eno_polje {α : Type*} [DecidableEq α] (M Z : Finset α) (x : α) :
    ∃! p : Bool × Bool, p = (decide (x ∈ M), decide (x ∈ Z)) :=
  ⟨_, rfl, fun _ h => h⟩

/-- Razlaga (premisli): pri dveh lastnostih so 4 kombinacije odgovorov (da-da, da-ne, ne-da, ne-ne).
trditev: MAT-OS-6/mnozice-in-diagrami#stiri-kombinacije
besedilo: »Ker so pri dveh lastnostih možne $4$ kombinacije odgovorov: da-da, da-ne, ne-da in ne-ne.« -/
theorem stiri_kombinacije : Fintype.card (Bool × Bool) = 4 := by simp

/-- Razlaga (simulacija): v U = {1, …, 20} so soda števila, deljiva s 3, natanko 6, 12 in 18.
trditev: MAT-OS-6/mnozice-in-diagrami#simulacija
besedilo: »v njem so samo $6$, $12$ in $18$, ker so ta števila hkrati soda in deljiva s $3$.« -/
theorem simulacija :
    (Finset.Icc 1 20).filter (fun n => 2 ∣ n) ∩ (Finset.Icc 1 20).filter (fun n => 3 ∣ n) = {6, 12, 18} ∧
      (Finset.Icc 1 20).filter (fun n => 2 ∣ n) ∪ (Finset.Icc 1 20).filter (fun n => 3 ∣ n) =
        {2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20} := by
  decide

/-- Razlaga (zapis s simboli): za A = {Piran, Koper, Bled} je Bled ∈ A in Kranj ∉ A.
trditev: MAT-OS-6/mnozice-in-diagrami#simboli
besedilo: »$\text{Bled} \in A$ beremo »Bled je element množice $A$«, $\text{Kranj} \notin A$ pa »Kranj ni element množice $A$«« -/
theorem simboli : bled ∈ ({piran, koper, bled} : Finset Kraj) ∧ kranj ∉ ({piran, koper, bled} : Finset Kraj) := by
  decide

/-! ## Rešeni primeri -/

/-- Primer 1: grad G = {Lipa, Breg, Gaj}, kopališče K = {Lipa, Vrh, Gaj}; polja so {Lipa, Gaj}, {Breg}, {Vrh},
{Log}; v vsakem je vsaj en kraj, največ (dva) jih je v polju »grad in kopališče«.
trditev: MAT-OS-6/mnozice-in-diagrami#primer1
besedilo: »Odgovor: v vsakem polju je vsaj en kraj, največ krajev (dva) je v polju »grad in kopališče«.« -/
theorem primer1 :
    let U : Finset Kraj := {lipa, breg, vrh, log, gaj}
    let G : Finset Kraj := {lipa, breg, gaj}
    let K : Finset Kraj := {lipa, vrh, gaj}
    G ∩ K = {lipa, gaj} ∧ G \ K = {breg} ∧ K \ G = {vrh} ∧ U \ (G ∪ K) = {log} ∧
      (G ∩ K).card = 2 ∧ (G \ K).card = 1 ∧ (K \ G).card = 1 ∧ (U \ (G ∪ K)).card = 1 := by
  decide

/-- Primer 2: A ∩ B = {Bled, Postojna}, samo A: Piran, Koper, samo B: Ptuj, A ∪ B ima 2 + 2 + 1 = 5 krajev.
trditev: MAT-OS-6/mnozice-in-diagrami#primer2
besedilo: »Odgovor: skupaj sta obiskala $5$ različnih krajev, Bled in Postojno sta videla oba.« -/
theorem primer2 :
    let A : Finset Kraj := {piran, koper, bled, postojna}
    let B : Finset Kraj := {bled, postojna, ptuj}
    A ∩ B = {bled, postojna} ∧ A \ B = {piran, koper} ∧ B \ A = {ptuj} ∧
      A ∪ B = {piran, koper, bled, postojna, ptuj} ∧ (A ∪ B).card = 2 + 2 + 1 ∧ 2 + 2 + 1 = 5 := by
  decide

/-- Primer 3: vseh 40, vlak V 22, morje M 25, vlak in morje 14: vlak–gore 22 − 14 = 8, avtobus–morje 25 − 14 = 11,
avtobus–gore 40 − 22 − 11 = 7, preizkus 14 + 8 + 11 + 7 = 40 (za vse take množice).
trditev: MAT-OS-6/mnozice-in-diagrami#primer3
besedilo: »Odgovor: z vlakom na morje $14$, z vlakom v gore $8$, z avtobusom na morje $11$ in z avtobusom v gore $7$ potnikov.« -/
theorem primer3 {α : Type*} [DecidableEq α] (U V M : Finset α) (hV : V ⊆ U) (hM : M ⊆ U) (hU : U.card = 40)
    (hVc : V.card = 22) (hMc : M.card = 25) (hVM : (V ∩ M).card = 14) :
    (V \ M).card = 8 ∧ (M \ V).card = 11 ∧ (U \ (V ∪ M)).card = 7 ∧ 14 + 8 + 11 + 7 = 40 := by
  have h3 := Finset.card_sdiff_add_card_inter V M
  have h4 := Finset.card_sdiff_add_card_inter M V
  rw [Finset.inter_comm M V] at h4
  have h1 := Finset.card_sdiff_add_card_eq_card (Finset.union_subset hV hM)
  have h2 := Finset.card_union_add_card_inter V M
  refine ⟨?_, ?_, ?_, rfl⟩
  · calc (V \ M).card = 22 - 14 := by omega
      _ = 8 := rfl
  · calc (M \ V).card = 25 - 14 := by omega
      _ = 11 := rfl
  · calc (U \ (V ∪ M)).card = 40 - 22 - 11 := by omega
      _ = 7 := rfl

example := primer3 (Finset.range 40) (Finset.range 22) (Finset.Icc 8 32) (by decide) (by decide) (by simp)
  (by simp) (by simp) (by decide)

/-- Primer 4: vseh 30, letalo 18, ladja 12, oboje 7: samo letalo 18 − 7 = 11, samo ladja 12 − 7 = 5, unija
11 + 7 + 5 = 23, zunaj krogov 30 − 23 = 7 (za vse take množice).
trditev: MAT-OS-6/mnozice-in-diagrami#primer4
besedilo: »V uniji je $11 + 7 + 5 = 23$ učencev, zunaj krogov pa $30 - 23 = 7$ učencev.« -/
theorem primer4 {α : Type*} [DecidableEq α] (U L S : Finset α) (hL : L ⊆ U) (hS : S ⊆ U) (hU : U.card = 30)
    (hLc : L.card = 18) (hSc : S.card = 12) (hLS : (L ∩ S).card = 7) :
    (L \ S).card = 18 - 7 ∧ 18 - 7 = 11 ∧ (S \ L).card = 12 - 7 ∧ 12 - 7 = 5 ∧
      (L ∪ S).card = 11 + 7 + 5 ∧ 11 + 7 + 5 = 23 ∧ (U \ (L ∪ S)).card = 30 - 23 ∧ 30 - 23 = 7 := by
  have h3 := Finset.card_sdiff_add_card_inter L S
  have h4 := Finset.card_sdiff_add_card_inter S L
  rw [Finset.inter_comm S L] at h4
  have h1 := Finset.card_sdiff_add_card_eq_card (Finset.union_subset hL hS)
  have h2 := Finset.card_union_add_card_inter L S
  omega

example := primer4 (Finset.range 30) (Finset.range 18) (Finset.Icc 11 22) (by decide) (by decide) (by simp)
  (by simp) (by simp) (by decide)

/-! ## Pogoste napake -/

/-- Pogoste napake 1 in Povzetek: v uniji presek štejemo enkrat: |A ∪ B| = |A| + |B| − |A ∩ B|; pri izletu
12 + 9 − 5 = 16.
trditev: MAT-OS-6/mnozice-in-diagrami#dvojno-stetje
besedilo: »Seštej področja ali od vsote odštej presek: $12 + 9 - 5 = 16$.« -/
theorem dvojno_stetje {α : Type*} [DecidableEq α] (A B : Finset α) :
    (A ∪ B).card = A.card + B.card - (A ∩ B).card ∧
      (A ∪ B).card = (A \ B).card + (A ∩ B).card + (B \ A).card ∧ 12 + 9 - 5 = 16 := by
  have h2 := Finset.card_union_add_card_inter A B
  have h3 := Finset.card_sdiff_add_card_inter A B
  have h4 := Finset.card_sdiff_add_card_inter B A
  rw [Finset.inter_comm B A] at h4
  refine ⟨Finset.card_union A B, by omega, rfl⟩

/-- Pogoste napake 2: presek zahteva oboje hkrati, zato je del vsake od množic in nima več elementov kot ena od
njiju.
trditev: MAT-OS-6/mnozice-in-diagrami#presek-manjsi
besedilo: »Presek pa zahteva oboje hkrati, zato je manjši.« -/
theorem presek_manjsi {α : Type*} [DecidableEq α] (A B : Finset α) :
    A ∩ B ⊆ A ∧ A ∩ B ⊆ B ∧ (A ∩ B).card ≤ A.card ∧ (A ∩ B).card ≤ B.card ∧ (A ∩ B).card ≤ (A ∪ B).card :=
  ⟨Finset.inter_subset_left, Finset.inter_subset_right, Finset.card_le_card Finset.inter_subset_left,
    Finset.card_le_card Finset.inter_subset_right, Finset.card_le_card Finset.inter_subset_union⟩

/-- Pogoste napake 4: element, ki je v obeh množicah (Bled pri Primeru 2), je v preseku, ne v »samo A« ali
»samo B«.
trditev: MAT-OS-6/mnozice-in-diagrami#v-obeh
besedilo: »Element, ki je v obeh množicah, sodi v presek, in to le enkrat.« -/
theorem v_obeh {α : Type*} [DecidableEq α] (A B : Finset α) (x : α) (ha : x ∈ A) (hb : x ∈ B) :
    x ∈ A ∩ B ∧ x ∉ A \ B ∧ x ∉ B \ A := by
  simp [ha, hb]

example := v_obeh ({piran, koper, bled, postojna} : Finset Kraj) {bled, postojna, ptuj} bled (by decide)
  (by decide)

/-! ## Preveri se -/

/-- Preveri se 1: kraj je v preseku (ob morju) ∩ (z gradom) natanko tedaj, ko je ob morju in ima grad.
trditev: MAT-OS-6/mnozice-in-diagrami#preveri1
besedilo: »Presek so elementi, ki so v $A$ in v $B$ hkrati: kraj mora biti ob morju in imeti grad.« -/
theorem preveri1 {α : Type*} [DecidableEq α] (A B : Finset α) (x : α) : x ∈ A ∩ B ↔ x ∈ A ∧ x ∈ B :=
  Finset.mem_inter

/-- Preveri se 2: presek ima 2 elementa, B 3, A 5, unija 6; urejeno A ∩ B, B, A, A ∪ B; splošno je presek
najmanjši, unija največja.
trditev: MAT-OS-6/mnozice-in-diagrami#preveri2
besedilo: »Presek ima $2$ elementa, $B$ jih ima $3$, $A$ jih ima $5$, unija pa $6$. Presek je vedno najmanjši, unija največja.« -/
theorem preveri2 :
    let A : Finset Kraj := {piran, koper, bled, ptuj, celje}
    let B : Finset Kraj := {bled, ptuj, kranj}
    ((A ∩ B).card = 2 ∧ B.card = 3 ∧ A.card = 5 ∧ (A ∪ B).card = 6) ∧
      ∀ {α : Type} [DecidableEq α] (X Y : Finset α), (X ∩ Y).card ≤ X.card ∧ (X ∩ Y).card ≤ Y.card ∧
        X.card ≤ (X ∪ Y).card ∧ Y.card ≤ (X ∪ Y).card := by
  refine ⟨by decide, fun X Y => ⟨Finset.card_le_card Finset.inter_subset_left,
    Finset.card_le_card Finset.inter_subset_right, Finset.card_le_card Finset.subset_union_left,
    Finset.card_le_card Finset.subset_union_right⟩⟩

/-- Preveri se 3: če je Koper v A in ne v B, potem po Borovem obisku (B ∪ {Koper}) presek dobi en element več,
unija pa ostane enaka.
trditev: MAT-OS-6/mnozice-in-diagrami#preveri3
besedilo: »Koper je zdaj v $A$ in v $B$, zato se preseli v presek. Unija ostane enaka, ker je Koper v njej že bil.« -/
theorem preveri3 {α : Type*} [DecidableEq α] (A B : Finset α) (k : α) (hA : k ∈ A) (hB : k ∉ B) :
    (A ∩ insert k B).card = (A ∩ B).card + 1 ∧ A ∪ insert k B = A ∪ B := by
  constructor
  · rw [Finset.inter_insert_of_mem hA, Finset.card_insert_of_notMem (by simp [hB])]
  · rw [Finset.union_insert, Finset.insert_eq_of_mem (Finset.mem_union_left B hA)]

example := preveri3 ({piran, koper} : Finset Kraj) {bled} koper (by decide) (by decide)

/-- Preveri se 4: 20 otrok, plavalo 13, pohod 10, vsak vsaj eno: 13 + 10 = 23, to je 3 več od 20, oboje je naredilo
natanko 3 otroci; 20 − 13 = 7 jih ni plavalo in so šli samo na pohod.
trditev: MAT-OS-6/mnozice-in-diagrami#preveri4
besedilo: »$13 + 10 = 23$, kar je $3$ več od $20$. Te $3$ otroke je vsota štela dvakrat, ker so v preseku.« -/
theorem preveri4 {α : Type*} [DecidableEq α] (U P H : Finset α) (hU : U.card = 20) (hPH : P ∪ H = U)
    (hP : P.card = 13) (hH : H.card = 10) :
    13 + 10 = 23 ∧ 23 - 20 = 3 ∧ (P ∩ H).card = 3 ∧ U \ P = H \ P ∧ (U \ P).card = 20 - 13 := by
  have h2 := Finset.card_union_add_card_inter P H
  have h5 : U \ P = H \ P := by rw [← hPH, Finset.union_sdiff_left]
  have h6 := Finset.card_sdiff_add_card_eq_card (hPH ▸ Finset.subset_union_left : P ⊆ U)
  rw [hPH] at h2
  refine ⟨rfl, rfl, by omega, h5, by omega⟩

example := preveri4 (Finset.range 20) (Finset.range 13) (Finset.Icc 10 19) (by simp) (by decide) (by simp)
  (by simp)

/-- Preveri se 5: 32 učencev, morje 20, gore 15, oboje 9: unija 20 + 15 − 9 = 26, zunaj 32 − 26 = 6.
trditev: MAT-OS-6/mnozice-in-diagrami#preveri5
besedilo: »V uniji je $20 + 15 - 9 = 26$ učencev, zunaj krogov pa $32 - 26 = 6$.« -/
theorem preveri5 {α : Type*} [DecidableEq α] (U M G : Finset α) (hM : M ⊆ U) (hG : G ⊆ U) (hU : U.card = 32)
    (hMc : M.card = 20) (hGc : G.card = 15) (hMG : (M ∩ G).card = 9) :
    (M ∪ G).card = 20 + 15 - 9 ∧ 20 + 15 - 9 = 26 ∧ (U \ (M ∪ G)).card = 32 - 26 ∧ 32 - 26 = 6 := by
  have h1 := Finset.card_sdiff_add_card_eq_card (Finset.union_subset hM hG)
  have h2 := Finset.card_union_add_card_inter M G
  omega

example := preveri5 (Finset.range 32) (Finset.range 20) (Finset.Icc 11 25) (by decide) (by decide) (by simp)
  (by simp) (by simp) (by decide)

end Evklid.Lekcije.MAT_OS_6.MnoziceInDiagrami
