/-
vir: content/lessons/MAT-SS-4/verjetnost.md
sha256: e327a4ecb7aca2ade4847b5238ee51a138026d34e4aaf52fd1a1351c8389c65e
Ni v Leanu: risba (verjetnostno drevo; dokazane so verjetnosti na vejah in poteh), simulacija »Verjetnost in
relativna frekvenca«, empirična in subjektivna verjetnost kot pojma (dokazani so le računi relativnih frekvenc),
zakon velikih števil (besedni opis; ni formaliziran), razlaga s ploščinami in Galtonova deska kot slika
(dokazano je število (1/2)³ = 1/8 in 3/8), ustni odgovori kot besedilo, »Preveri se 2« (subjektivna verjetnost
ni matematična trditev). Pravila so dokazana za klasično verjetnost P(A) = |A|/|Ω| na končnem prostoru in za
splošno verjetnostno mero (vsota, nasprotni dogodek, produkt, neodvisnost). Primer 4 je dokazan kot račun in
kot formula P(K) = P(A)P(K/A) + P(B)P(K/B) za klasično verjetnost, ne za podatke iz tovarne.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.Verjetnost

open Finset

/-- Klasična (matematična) verjetnost dogodka A ⊆ Ω: P(A) = m/n = |A|/|Ω|. -/
def P {α : Type*} (Ω A : Finset α) : ℚ := (#A : ℚ) / #Ω

/-- Pogojna verjetnost P(A/B) = P(A·B)/P(B). -/
def Pp {α : Type*} [DecidableEq α] (Ω A B : Finset α) : ℚ := P Ω (A ∩ B) / P Ω B

/-! ## Razlaga 1: dogodki -/

/-- Razlaga 1: gotov dogodek ima P(G) = 1, nemogoč P(N) = 0, vsak dogodek 0 ≤ P(A) ≤ 1.
trditev: MAT-SS-4/verjetnost#gotov-nemogoc
besedilo: »**Gotov dogodek** $G$ se zgodi vedno: $P(G) = 1$. - **Nemogoč dogodek** $N$ se ne zgodi nikoli: $P(N) = 0$. - Za vsak dogodek velja $0 \le P(A) \le 1$.« -/
theorem gotov_nemogoc {α : Type*} (Ω A : Finset α) (hΩ : Ω.Nonempty) (hA : A ⊆ Ω) :
    P Ω Ω = 1 ∧ P Ω ∅ = 0 ∧ 0 ≤ P Ω A ∧ P Ω A ≤ 1 := by
  have hn : (#Ω : ℚ) ≠ 0 := by exact_mod_cast hΩ.card_pos.ne'
  have hle : (#A : ℚ) ≤ #Ω := by exact_mod_cast card_le_card hA
  refine ⟨div_self hn, by simp [P], by unfold P; positivity, ?_⟩
  unfold P; rw [div_le_one (by positivity)]; exact hle

/-- Predpostavke trditve `gotov_nemogoc` se dajo izpolniti. -/
example : (Icc 1 6 : Finset ℕ).Nonempty ∧ ({2, 4, 6} : Finset ℕ) ⊆ Icc 1 6 := by decide

/-- Predpostavke trditve `gotov_nemogoc` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (Icc 1 6 : Finset ℕ).Nonempty ∧ ({2, 4, 6} : Finset ℕ) ⊆ Icc 1 6 := by decide
  gotov_nemogoc (hΩ := w.1) (hA := w.2)

/-- Razlaga 1: nasprotni dogodek: P(Ā) = 1 − P(A).
trditev: MAT-SS-4/verjetnost#nasprotni
besedilo: »**Nasprotni dogodek** $\overline{A}$ se zgodi, kadar se $A$ ne zgodi: $$P(\overline{A}) = 1 - P(A).$$« -/
theorem nasprotni {α : Type*} [DecidableEq α] (Ω A : Finset α) (hΩ : Ω.Nonempty) (hA : A ⊆ Ω) :
    P Ω (Ω \ A) = 1 - P Ω A := by
  have hn : (#Ω : ℚ) ≠ 0 := by exact_mod_cast hΩ.card_pos.ne'
  have h : ((#(Ω \ A) : ℕ) : ℚ) + #A = #Ω := by exact_mod_cast card_sdiff_add_card_eq_card hA
  unfold P
  rw [eq_sub_iff_add_eq, ← add_div, h, div_self hn]

/-- Predpostavke trditve `nasprotni` se dajo izpolniti. -/
example : (Icc 1 6 : Finset ℕ).Nonempty ∧ ({2, 4, 6} : Finset ℕ) ⊆ Icc 1 6 := by decide

/-- Predpostavke trditve `nasprotni` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (Icc 1 6 : Finset ℕ).Nonempty ∧ ({2, 4, 6} : Finset ℕ) ⊆ Icc 1 6 := by decide
  nasprotni (hΩ := w.1) (hA := w.2)

/-- Razlaga 1: poskus z n izidi ima 2ⁿ dogodkov (podmnožic).
trditev: MAT-SS-4/verjetnost#stevilo-dogodkov
besedilo: »Poskus z $n$ izidi ima $2^n$ dogodkov, saj za vsak izid izberemo, ali je v dogodku ali ne.« -/
theorem stevilo_dogodkov {α : Type*} (Ω : Finset α) : #Ω.powerset = 2 ^ #Ω := card_powerset Ω

/-- Razlaga 1: met kovanca (grb, cifra) ima 4 dogodke: ∅, {grb}, {cifra}, {grb, cifra}.
trditev: MAT-SS-4/verjetnost#kovanec-dogodki
besedilo: »Pri metu kovanca z izidoma »grb« in »cifra« so vsi dogodki $\emptyset$, $\{\text{grb}\}$, $\{\text{cifra}\}$ in $\{\text{grb}, \text{cifra}\}$.« -/
theorem kovanec_dogodki : (univ : Finset (Fin 2)).powerset = {∅, {0}, {1}, {0, 1}} ∧
    #(univ : Finset (Fin 2)).powerset = 4 := by decide

/-! ## Razlaga 2: matematična in empirična verjetnost -/

/-- Razlaga 2: pri pošteni kocki P(sodo) = 3/6 = 1/2.
trditev: MAT-SS-4/verjetnost#kocka-sodo
besedilo: »pri pošteni kocki je $P(\text{sodo}) = \frac{3}{6} = \frac{1}{2}$.« -/
theorem kocka_sodo : P (Icc 1 6) {2, 4, 6} = 3 / 6 ∧ (3 : ℚ) / 6 = 1 / 2 := by
  unfold P; rw [show #({2, 4, 6} : Finset ℕ) = 3 by decide, show #(Icc 1 6 : Finset ℕ) = 6 by decide]
  norm_num

/-- Razlaga 2: dve kocki: 36 enako verjetnih urejenih parov, 6 ugodnih za vsoto 7, P = 6/36 = 1/6 ≠ 1/11.
trditev: MAT-SS-4/verjetnost#vsota-sedem
besedilo: »zato $P(\text{vsota } 7) \ne \frac{1}{11}$. Enako verjetni so urejeni pari $(a, b)$, teh je $36$, ugodnih $6$, torej $P = \frac{6}{36} = \frac{1}{6}$.« -/
theorem vsota_sedem :
    #((Icc 1 6 : Finset ℕ) ×ˢ Icc 1 6) = 36 ∧
    #(((Icc 1 6 : Finset ℕ) ×ˢ Icc 1 6).filter (fun p => p.1 + p.2 = 7)) = 6 ∧
    P ((Icc 1 6 : Finset ℕ) ×ˢ Icc 1 6) (((Icc 1 6 : Finset ℕ) ×ˢ Icc 1 6).filter (fun p => p.1 + p.2 = 7)) =
      6 / 36 ∧ (6 : ℚ) / 36 = 1 / 6 ∧ (1 : ℚ) / 6 ≠ 1 / 11 := by
  refine ⟨by decide, by decide, ?_, by norm_num, by norm_num⟩
  unfold P
  rw [show #(((Icc 1 6 : Finset ℕ) ×ˢ Icc 1 6).filter (fun p => p.1 + p.2 = 7)) = 6 by decide,
    show #((Icc 1 6 : Finset ℕ) ×ˢ Icc 1 6) = 36 by decide]
  norm_num

/-- Razlaga 2 (relativne frekvence): 310/500 = 0,62; 4/10 = 0,4; 600·(1/6) = 100; 1/6 ≈ 0,17.
trditev: MAT-SS-4/verjetnost#empiricna
besedilo: »Risalni žebljiček vržemo $500$-krat in $310$-krat pade s konico navzgor, zato je empirična verjetnost $\frac{310}{500} = 0{,}62$.« -/
theorem empiricna : (310 : ℚ) / 500 = 0.62 ∧ (4 : ℚ) / 10 = 0.4 ∧ (600 : ℚ) / 6 = 100 ∧
    |(1 : ℚ) / 6 - 0.17| < 0.005 := by norm_num [abs_lt]

/-! ## Razlaga 4: verjetnost vsote -/

/-- Razlaga 4 (in Bolj natančno): `|A + B| = |A| + |B| − |A·B|` (vključitev in izključitev).
trditev: MAT-SS-4/verjetnost#vkljucitev
besedilo: »Število izidov v $A + B$ dobimo po principu vključitve in izključitve: $$|A + B| = |A| + |B| - |A \cdot B|,$$« -/
theorem vkljucitev {α : Type*} [DecidableEq α] (A B : Finset α) : #(A ∪ B) + #(A ∩ B) = #A + #B :=
  card_union_add_card_inter A B

/-- Razlaga 4: P(A + B) = P(A) + P(B) − P(A·B) (klasična verjetnost).
trditev: MAT-SS-4/verjetnost#verjetnost-vsote
besedilo: »$$P(A + B) = P(A) + P(B) - P(A \cdot B).$$« -/
theorem verjetnost_vsote {α : Type*} [DecidableEq α] (Ω A B : Finset α) :
    P Ω (A ∪ B) = P Ω A + P Ω B - P Ω (A ∩ B) := by
  unfold P
  rw [eq_sub_iff_add_eq, ← add_div, ← add_div]
  congr 1
  exact_mod_cast card_union_add_card_inter A B

/-- Razlaga 4: za nezdružljiva dogodka P(A + B) = P(A) + P(B).
trditev: MAT-SS-4/verjetnost#vsota-nezdruzljivih
besedilo: »Če sta $A$ in $B$ nezdružljiva, je $P(A \cdot B) = 0$ in dobimo preprosto $$P(A + B) = P(A) + P(B).$$« -/
theorem vsota_nezdruzljivih {α : Type*} [DecidableEq α] (Ω A B : Finset α) (h : Disjoint A B) :
    P Ω (A ∪ B) = P Ω A + P Ω B := by
  unfold P; rw [card_union_of_disjoint h]; push_cast; ring

/-- Predpostavka trditve `vsota_nezdruzljivih` se da izpolniti (»padla je 1« in »padla je 2«). -/
example : Disjoint ({1} : Finset ℕ) {2} := by decide

/-- Predpostavke trditve `vsota_nezdruzljivih` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Disjoint ({1} : Finset ℕ) {2} := by decide
  vsota_nezdruzljivih (h := w)

/-- Razlaga 3, »Preveri«: »padlo je sodo« {2, 4, 6} in »padla je 6« {6} nista nezdružljiva, saj je
{2, 4, 6} · {6} = {6} neprazen (šestica je soda).
trditev: MAT-SS-4/verjetnost#sodo-sest-zdruzljiva
besedilo: »Ne, šestica je soda, zato se lahko zgodita hkrati.« -/
theorem sodo_sest_zdruzljiva :
    ({2, 4, 6} : Finset ℕ) ∩ {6} = {6} ∧ ¬ Disjoint ({2, 4, 6} : Finset ℕ) {6} := by decide

/-- Razlaga 4 (splošna verjetnostna mera): μ(A ∪ B) + μ(A ∩ B) = μ(A) + μ(B).
trditev: MAT-SS-4/verjetnost#vsota-mera
besedilo: »$$P(A + B) = P(A) + P(B) - P(A \cdot B).$$« -/
theorem vsota_mera {Ω : Type*} [MeasurableSpace Ω] (μ : MeasureTheory.Measure Ω) (A B : Set Ω)
    (hB : MeasurableSet B) : μ (A ∪ B) + μ (A ∩ B) = μ A + μ B :=
  MeasureTheory.measure_union_add_inter A hB

/-- Predpostavka trditve `vsota_mera` se da izpolniti. -/
example : MeasurableSet (Set.univ : Set ℝ) := MeasurableSet.univ

/-- Predpostavke trditve `vsota_mera` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : MeasurableSet (Set.univ : Set ℝ) := MeasurableSet.univ
  vsota_mera (hB := w)

/-- Razlaga 1 (splošna verjetnostna mera): P(Ā) = 1 − P(A).
trditev: MAT-SS-4/verjetnost#nasprotni-mera
besedilo: »$$P(\overline{A}) = 1 - P(A).$$« -/
theorem nasprotni_mera {Ω : Type*} [MeasurableSpace Ω] (μ : MeasureTheory.Measure Ω)
    [MeasureTheory.IsProbabilityMeasure μ] (A : Set Ω) (hA : MeasurableSet A) : μ Aᶜ = 1 - μ A :=
  MeasureTheory.prob_compl_eq_one_sub hA

/-- Predpostavke trditve `nasprotni_mera` se dajo izpolniti (Diracova mera je verjetnostna). -/
example : MeasureTheory.IsProbabilityMeasure (MeasureTheory.Measure.dirac (0 : ℝ)) ∧
    MeasurableSet (Set.univ : Set ℝ) := ⟨inferInstance, MeasurableSet.univ⟩

/-- Razlaga 4, »Premisli«: P(A) = 0,7, P(B) = 0,6 ⇒ P(A·B) ≥ 0,3 (ker P(A + B) ≤ 1); vsota 1,3 > 1 ni
verjetnost.
trditev: MAT-SS-4/verjetnost#mleko-jajca
besedilo: »Ne, verjetnost ne more biti večja od $1$. Dneve, ko je v hladilniku oboje, smo šteli dvakrat. Odšteti moramo $P(A \cdot B)$; ta je vsaj $0{,}3$, saj mora biti vsota največ $1$.« -/
theorem mleko_jajca {α : Type*} [DecidableEq α] (Ω A B : Finset α) (hΩ : Ω.Nonempty) (hA : A ⊆ Ω) (hB : B ⊆ Ω)
    (pA : P Ω A = 0.7) (pB : P Ω B = 0.6) : 0.3 ≤ P Ω (A ∩ B) ∧ (1 : ℚ) < 0.7 + 0.6 := by
  have h1 := (gotov_nemogoc Ω (A ∪ B) hΩ (union_subset hA hB)).2.2.2
  rw [verjetnost_vsote, pA, pB] at h1
  refine ⟨by norm_num at h1 ⊢; linarith, by norm_num⟩

/-- Predpostavke trditve `mleko_jajca` se dajo izpolniti (10 dni, mleko 7 dni, jajca 6 dni, oboje 3 dni). -/
example : (range 10).Nonempty ∧ range 7 ⊆ range 10 ∧ Ico 4 10 ⊆ range 10 ∧
    P (range 10) (range 7) = 0.7 ∧ P (range 10) (Ico 4 10) = 0.6 := by
  refine ⟨by decide, by decide, by decide, ?_, ?_⟩ <;> unfold P <;> simp <;> norm_num

/-! ## Razlaga 5–7: pogojna verjetnost, produkt, neodvisnost -/

/-- Predpostavke trditve `mleko_jajca` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (range 10).Nonempty ∧ range 7 ⊆ range 10 ∧ Ico 4 10 ⊆ range 10 ∧ P (range 10) (range 7) = 0.7 ∧ P (range 10) (Ico 4 10) = 0.6 := by
    refine ⟨by decide, by decide, by decide, ?_, ?_⟩ <;> unfold P <;> simp <;> norm_num
  mleko_jajca (hΩ := w.1) (hA := w.2.1) (hB := w.2.2.1) (pA := w.2.2.2.1) (pB := w.2.2.2.2)

/-- Bolj natančno: pri klasični verjetnosti P(A/B) = |A·B|/|B| = (|A·B|/n)/(|B|/n).
trditev: MAT-SS-4/verjetnost#pogojna-stetje
besedilo: »$$P(A/B) = \frac{|A \cdot B|}{|B|} = \frac{|A \cdot B|/n}{|B|/n} = \frac{P(A \cdot B)}{P(B)}.$$« -/
theorem pogojna_stetje {α : Type*} [DecidableEq α] (Ω A B : Finset α) (hΩ : Ω.Nonempty) :
    Pp Ω A B = (#(A ∩ B) : ℚ) / #B := by
  have hn : (#Ω : ℚ) ≠ 0 := by exact_mod_cast hΩ.card_pos.ne'
  unfold Pp P; rw [div_div_div_cancel_right₀ hn]

/-- Predpostavka trditve `pogojna_stetje` se da izpolniti. -/
example : (Icc 1 6 : Finset ℕ).Nonempty := by decide

/-- Predpostavke trditve `pogojna_stetje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (Icc 1 6 : Finset ℕ).Nonempty := by decide
  pogojna_stetje (hΩ := w)

/-- Razlaga 6: verjetnost produkta P(A·B) = P(B)·P(A/B) (P(B) > 0).
trditev: MAT-SS-4/verjetnost#verjetnost-produkta
besedilo: »$$P(A \cdot B) = P(B) \cdot P(A/B).$$« -/
theorem verjetnost_produkta {α : Type*} [DecidableEq α] (Ω A B : Finset α) (hB : 0 < P Ω B) :
    P Ω (A ∩ B) = P Ω B * Pp Ω A B := by
  unfold Pp; field_simp

/-- Predpostavka trditve `verjetnost_produkta` se da izpolniti. -/
example : 0 < P (Icc 1 6) {4, 5, 6} := by
  unfold P; rw [show #({4, 5, 6} : Finset ℕ) = 3 by decide, show #(Icc 1 6 : Finset ℕ) = 6 by decide]; norm_num

/-- Predpostavke trditve `verjetnost_produkta` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : 0 < P (Icc 1 6) {4, 5, 6} := by
    unfold P; rw [show #({4, 5, 6} : Finset ℕ) = 3 by decide, show #(Icc 1 6 : Finset ℕ) = 6 by decide]; norm_num
  verjetnost_produkta (hB := w)

/-- Razlaga 7 in Bolj natančno: P(A/B) = P(A) natanko tedaj, ko P(A·B) = P(A)·P(B) (P(B) > 0).
trditev: MAT-SS-4/verjetnost#neodvisnost
besedilo: »Neodvisnost (višja raven).** Dogodka sta neodvisna natanko tedaj, ko je $P(A/B) = P(A)$, kar je po definiciji pogojne verjetnosti ekvivalentno $P(A \cdot B) = P(A) \cdot P(B)$.« -/
theorem neodvisnost {α : Type*} [DecidableEq α] (Ω A B : Finset α) (hB : 0 < P Ω B) :
    Pp Ω A B = P Ω A ↔ P Ω (A ∩ B) = P Ω A * P Ω B := by
  unfold Pp; rw [div_eq_iff hB.ne']

/-- Predpostavka trditve `neodvisnost` se da izpolniti. -/
example : 0 < P (Icc 1 6) {4, 5, 6} := by
  unfold P; rw [show #({4, 5, 6} : Finset ℕ) = 3 by decide, show #(Icc 1 6 : Finset ℕ) = 6 by decide]; norm_num

/-- Predpostavke trditve `neodvisnost` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : 0 < P (Icc 1 6) {4, 5, 6} := by
    unfold P; rw [show #({4, 5, 6} : Finset ℕ) = 3 by decide, show #(Icc 1 6 : Finset ℕ) = 6 by decide]; norm_num
  neodvisnost (hB := w)

/-- Razlaga 7 in Ustno vprašanje 3: pri dveh metih kovanca (izidi Fin 2 × Fin 2, 0 = grb) sta »v prvem metu
pade grb« in »v drugem metu pade grb« neodvisna: P(A·B) = 1/4 = 1/2 · 1/2 = P(A)·P(B), torej P(A/B) = P(A).
trditev: MAT-SS-4/verjetnost#kovanca-neodvisna
besedilo: »pri dveh metih kovanca pa sta dogodka »v prvem metu pade grb« in »v drugem metu pade grb« neodvisna« -/
theorem kovanca_neodvisna :
    P univ ((univ : Finset (Fin 2 × Fin 2)).filter (fun p => p.1 = 0) ∩ univ.filter (fun p => p.2 = 0)) =
      P univ ((univ : Finset (Fin 2 × Fin 2)).filter (fun p => p.1 = 0)) *
        P univ ((univ : Finset (Fin 2 × Fin 2)).filter (fun p => p.2 = 0)) ∧
    Pp univ ((univ : Finset (Fin 2 × Fin 2)).filter (fun p => p.1 = 0)) (univ.filter (fun p => p.2 = 0)) =
      P univ ((univ : Finset (Fin 2 × Fin 2)).filter (fun p => p.1 = 0)) := by
  have h : P univ ((univ : Finset (Fin 2 × Fin 2)).filter (fun p => p.1 = 0) ∩ univ.filter (fun p => p.2 = 0)) =
      P univ ((univ : Finset (Fin 2 × Fin 2)).filter (fun p => p.1 = 0)) *
        P univ ((univ : Finset (Fin 2 × Fin 2)).filter (fun p => p.2 = 0)) := by
    unfold P
    rw [show #((univ : Finset (Fin 2 × Fin 2)).filter (fun p => p.1 = 0) ∩ univ.filter (fun p => p.2 = 0)) = 1
        by decide, show #((univ : Finset (Fin 2 × Fin 2)).filter (fun p => p.1 = 0)) = 2 by decide,
      show #((univ : Finset (Fin 2 × Fin 2)).filter (fun p => p.2 = 0)) = 2 by decide,
      show #(univ : Finset (Fin 2 × Fin 2)) = 4 by decide]
    norm_num
  refine ⟨h, (neodvisnost _ _ _ ?_).mpr h⟩
  unfold P
  rw [show #((univ : Finset (Fin 2 × Fin 2)).filter (fun p => p.2 = 0)) = 2 by decide,
    show #(univ : Finset (Fin 2 × Fin 2)) = 4 by decide]
  norm_num

/-- Pogoste napake in Ustno vprašanje 3: nezdružljiva dogodka s pozitivnima verjetnostma nista neodvisna.
trditev: MAT-SS-4/verjetnost#nezdruzljiva-nista-neodvisna
besedilo: »Nezdružljiva dogodka, ki imata oba pozitivno verjetnost, nista neodvisna, saj se drugi gotovo ne zgodi, če se zgodi prvi.« -/
theorem nezdruzljiva_nista_neodvisna {α : Type*} [DecidableEq α] (Ω A B : Finset α) (h : Disjoint A B)
    (hA : 0 < P Ω A) (hB : 0 < P Ω B) : P Ω (A ∩ B) = 0 ∧ P Ω (A ∩ B) ≠ P Ω A * P Ω B := by
  have h0 : P Ω (A ∩ B) = 0 := by rw [disjoint_iff_inter_eq_empty.mp h]; simp [P]
  exact ⟨h0, by rw [h0]; exact (mul_pos hA hB).ne⟩

/-- Predpostavke trditve `nezdruzljiva_nista_neodvisna` se dajo izpolniti (»pade 1« in »pade 2«). -/
example : Disjoint ({1} : Finset ℕ) {2} ∧ 0 < P (Icc 1 6) {1} ∧ 0 < P (Icc 1 6) {2} := by
  refine ⟨by decide, ?_, ?_⟩ <;> unfold P <;> simp

/-- Predpostavke trditve `nezdruzljiva_nista_neodvisna` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Disjoint ({1} : Finset ℕ) {2} ∧ 0 < P (Icc 1 6) {1} ∧ 0 < P (Icc 1 6) {2} := by
    refine ⟨by decide, ?_, ?_⟩ <;> unfold P <;> simp
  nezdruzljiva_nista_neodvisna (h := w.1) (hA := w.2.1) (hB := w.2.2)

/-- Razlaga 5 in 6 (splošna verjetnostna mera): μ[A | B]·μ(B) = μ(B ∩ A) in μ[A | B] = μ(B)⁻¹·μ(B ∩ A).
trditev: MAT-SS-4/verjetnost#pogojna-mera
besedilo: »$$P(A/B) = \frac{P(A \cdot B)}{P(B)}.$$« -/
theorem pogojna_mera {Ω : Type*} [MeasurableSpace Ω] (μ : MeasureTheory.Measure Ω)
    [MeasureTheory.IsFiniteMeasure μ] (A B : Set Ω) (hB : MeasurableSet B) :
    ProbabilityTheory.cond μ B A * μ B = μ (B ∩ A) ∧ ProbabilityTheory.cond μ B A = (μ B)⁻¹ * μ (B ∩ A) :=
  ⟨ProbabilityTheory.cond_mul_eq_inter hB A μ, ProbabilityTheory.cond_apply hB μ A⟩

/-- Predpostavka trditve `pogojna_mera` se da izpolniti. -/
example : MeasurableSet (Set.univ : Set ℝ) := MeasurableSet.univ

/-- Predpostavke trditve `pogojna_mera` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  pogojna_mera (MeasureTheory.Measure.dirac (0:ℝ)) Set.univ Set.univ MeasurableSet.univ

/-- Razlaga 7 (splošna verjetnostna mera): A in B sta neodvisna natanko tedaj, ko μ(A ∩ B) = μ(A)·μ(B).
trditev: MAT-SS-4/verjetnost#neodvisnost-mera
besedilo: »Dogodka sta neodvisna, če izid enega ne spremeni verjetnosti drugega, torej je $P(A \cdot B) = P(A) \cdot P(B)$.« -/
theorem neodvisnost_mera {Ω : Type*} [MeasurableSpace Ω] (μ : MeasureTheory.Measure Ω)
    [MeasureTheory.IsProbabilityMeasure μ] (A B : Set Ω) (hA : MeasurableSet A) (hB : MeasurableSet B) :
    ProbabilityTheory.IndepSet A B μ ↔ μ (A ∩ B) = μ A * μ B :=
  ProbabilityTheory.indepSet_iff_measure_inter_eq_mul hA hB μ

/-- Predpostavke trditve `neodvisnost_mera` se dajo izpolniti. -/
example : MeasureTheory.IsProbabilityMeasure (MeasureTheory.Measure.dirac (0 : ℝ)) ∧
    MeasurableSet (Set.univ : Set ℝ) := ⟨inferInstance, MeasurableSet.univ⟩

/-! ## Jajca (Zakaj se tega učimo, Razlaga 5–7) -/

/-- Pari različnih jajc (urejeno), jajci 0 in 1 sta počeni. -/
def jajca : Finset (Fin 12 × Fin 12) := univ.filter (fun p => p.1 ≠ p.2)

/-- Predpostavke trditve `neodvisnost_mera` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  neodvisnost_mera (MeasureTheory.Measure.dirac (0:ℝ)) Set.univ Set.univ MeasurableSet.univ MeasurableSet.univ

/-- Razlaga 6 (drevo): 132 urejenih parov; obe celi 90, prvo celo 110, drugo celo 110, obe počeni 2; torej
P(obe celi) = 90/132 = 15/22, P(drugo celo / prvo celo) = 9/11 ≠ 10/12 = P(drugo celo), P(obe počeni) = 1/66.
trditev: MAT-SS-4/verjetnost#jajca-stetje
besedilo: »$P = \frac{10}{12} \cdot \frac{9}{11} = \frac{90}{132} = \frac{15}{22} \approx 0{,}68$« -/
theorem jajca_stetje :
    #jajca = 132 ∧ #(jajca.filter (fun p => 2 ≤ p.1.val ∧ 2 ≤ p.2.val)) = 90 ∧
    #(jajca.filter (fun p => 2 ≤ p.1.val)) = 110 ∧ #(jajca.filter (fun p => 2 ≤ p.2.val)) = 110 ∧
    #(jajca.filter (fun p => p.1.val < 2 ∧ p.2.val < 2)) = 2 := by
  unfold jajca; decide +kernel

/-- Razlaga 6: na zgornji poti 10/12·9/11 = 90/132 = 15/22 ≈ 0,68; poti 90/132, 20/132, 20/132, 2/132 dajo
skupaj 1; obe počeni 2/12·1/11 = 2/132 = 1/66.
trditev: MAT-SS-4/verjetnost#jajca-drevo
besedilo: »Na zgornji poti pomnožimo: $P = \frac{10}{12} \cdot \frac{9}{11} = \frac{90}{132} = \frac{15}{22} \approx 0{,}68$. Vsota vseh štirih poti je $1$, saj se gotovo zgodi ena od njih.« -/
theorem jajca_drevo :
    (10 : ℚ) / 12 * (9 / 11) = 90 / 132 ∧ (90 : ℚ) / 132 = 15 / 22 ∧ |(15 : ℚ) / 22 - 0.68| < 0.005 ∧
    (10 : ℚ) / 12 * (2 / 11) = 20 / 132 ∧ (2 : ℚ) / 12 * (10 / 11) = 20 / 132 ∧
    (2 : ℚ) / 12 * (1 / 11) = 2 / 132 ∧ (90 : ℚ) / 132 + 20 / 132 + 20 / 132 + 2 / 132 = 1 ∧
    (2 : ℚ) / 132 = 1 / 66 := by norm_num [abs_lt]

/-- Razlaga 5, »Premisli«, in Razlaga 7: po celem jajcu je verjetnost 9/11 (ostane 11 jajc, 9 celih), kar ni
10/12, zato dogodka nista neodvisna; napačni račun 10/12·10/12 ≈ 0,69.
trditev: MAT-SS-4/verjetnost#jajca-pogojna
besedilo: »$\frac{9}{11}$. V škatli je ostalo $11$ jajc, celih je še $9$. Pogoj »prvo je bilo celo« je spremenil vsebino škatle.« -/
theorem jajca_pogojna :
    Pp jajca (jajca.filter (fun p => 2 ≤ p.2.val)) (jajca.filter (fun p => 2 ≤ p.1.val)) = 9 / 11 ∧
    P jajca (jajca.filter (fun p => 2 ≤ p.2.val)) = 10 / 12 ∧ (9 : ℚ) / 11 ≠ 10 / 12 ∧
    |(10 : ℚ) / 12 * (10 / 12) - 0.69| < 0.005 := by
  obtain ⟨h1, h2, h3, h4, -⟩ := jajca_stetje
  refine ⟨?_, ?_, by norm_num, by norm_num [abs_lt]⟩
  · rw [pogojna_stetje _ _ _ (by unfold jajca; decide +kernel),
      show #(jajca.filter (fun p => 2 ≤ p.2.val) ∩ jajca.filter (fun p => 2 ≤ p.1.val)) = 90 by
        unfold jajca; decide +kernel, h3]
    norm_num
  · unfold P; rw [h4, h1]; norm_num

/-- Razlaga 1, »Preveri«: nasprotni dogodek dogodka »vsaj eno od dveh jajc je počeno« je »obe jajci sta celi«.
trditev: MAT-SS-4/verjetnost#jajca-nasprotni
besedilo: »nasprotni dogodek dogodka »vsaj eno od dveh jajc je počeno«? (Obe jajci sta celi.)« -/
theorem jajca_nasprotni :
    jajca \ jajca.filter (fun p => p.1.val < 2 ∨ p.2.val < 2) =
      jajca.filter (fun p => 2 ≤ p.1.val ∧ 2 ≤ p.2.val) := by
  unfold jajca; decide +kernel

/-! ## Rešeni primeri -/

/-- Primer 1: R, M, Z (0, 1, 2): 2³ = 8 dogodkov; po številu izidov 1 + 3 + 3 + 1 = 8; dogodek s k izidi ima
P = k/3 (0, 1/3, 2/3, 1).
trditev: MAT-SS-4/verjetnost#primer1
besedilo: »Dogodkov je $2^3 = 8$. Naštejemo jih po številu izidov, da nobenega ne izpustimo. 2. Brez izidov: $\emptyset$ (nemogoč dogodek), $P = \dfrac{0}{3} = 0$. 3. En izid: $\{R\}$, $\{M\}$, $\{Z\}$, vsak s $P = \dfrac{1}{3}$. 4. Dva izida: $\{R, M\}$, $\{R, Z\}$, $\{M, Z\}$, vsak s $P = \dfrac{2}{3}$. 5. Trije izidi: $\{R, M, Z\}$ (gotov dogodek), $P = \dfrac{3}{3} = 1$. 6. Preverimo: $1 + 3 + 3 + 1 = 8$.« -/
theorem primer1 :
    #(univ : Finset (Fin 3)).powerset = 2 ^ 3 ∧ (2 : ℕ) ^ 3 = 8 ∧
    (#((univ : Finset (Fin 3)).powersetCard 0), #((univ : Finset (Fin 3)).powersetCard 1),
      #((univ : Finset (Fin 3)).powersetCard 2), #((univ : Finset (Fin 3)).powersetCard 3)) = (1, 3, 3, 1) ∧
    1 + 3 + 3 + 1 = 8 ∧
    ∀ s ∈ (univ : Finset (Fin 3)).powerset, P univ s = (#s : ℚ) / 3 := by
  refine ⟨by simp, by norm_num, by decide, by norm_num, fun s _ => by simp [P]⟩

/-- Primer 1: verjetnosti 0/3 = 0, 1/3, 2/3, 3/3 = 1.
trditev: MAT-SS-4/verjetnost#primer1-verjetnosti
besedilo: »Odgovor: poskus ima $8$ dogodkov z verjetnostmi $0$, $\frac{1}{3}$ (trije), $\frac{2}{3}$ (trije) in $1$.« -/
theorem primer1_verjetnosti : P (univ : Finset (Fin 3)) ∅ = 0 / 3 ∧ (0 : ℚ) / 3 = 0 ∧
    P (univ : Finset (Fin 3)) {0} = 1 / 3 ∧ P (univ : Finset (Fin 3)) {0, 1} = 2 / 3 ∧
    P (univ : Finset (Fin 3)) univ = 3 / 3 ∧ (3 : ℚ) / 3 = 1 := by
  refine ⟨by simp [P], by norm_num, by simp [P], ?_, by simp [P], by norm_num⟩
  unfold P; rw [show #({0, 1} : Finset (Fin 3)) = 2 by decide]; simp

/-- Primer 2: A = {2,4,6}, B = {4,5,6}: P(A) = P(B) = 3/6 = 1/2, A·B = {4,6} s P = 2/6 = 1/3,
P(A + B) = 1/2 + 1/2 − 1/3 = 2/3; preizkus A + B = {2,4,5,6}, 4/6 = 2/3.
trditev: MAT-SS-4/verjetnost#primer2
besedilo: »Odgovor: verjetnost, da pade sodo število ali število, večje od $3$, je $\frac{2}{3}$.« -/
theorem primer2 :
    P (Icc 1 6) {2, 4, 6} = 1 / 2 ∧ P (Icc 1 6) {4, 5, 6} = 1 / 2 ∧
    ({2, 4, 6} : Finset ℕ) ∩ {4, 5, 6} = {4, 6} ∧ P (Icc 1 6) {4, 6} = 2 / 6 ∧ (2 : ℚ) / 6 = 1 / 3 ∧
    P (Icc 1 6) ({2, 4, 6} ∪ {4, 5, 6}) = 1 / 2 + 1 / 2 - 1 / 3 ∧ (1 : ℚ) / 2 + 1 / 2 - 1 / 3 = 2 / 3 ∧
    ({2, 4, 6} : Finset ℕ) ∪ {4, 5, 6} = {2, 4, 5, 6} ∧ P (Icc 1 6) {2, 4, 5, 6} = 4 / 6 ∧
    (4 : ℚ) / 6 = 2 / 3 := by
  have c6 : #(Icc 1 6 : Finset ℕ) = 6 := by decide
  have pA : P (Icc 1 6) {2, 4, 6} = 1 / 2 := by
    unfold P; rw [c6, show #({2, 4, 6} : Finset ℕ) = 3 by decide]; norm_num
  have pB : P (Icc 1 6) {4, 5, 6} = 1 / 2 := by
    unfold P; rw [c6, show #({4, 5, 6} : Finset ℕ) = 3 by decide]; norm_num
  have i : ({2, 4, 6} : Finset ℕ) ∩ {4, 5, 6} = {4, 6} := by decide
  have pAB : P (Icc 1 6) {4, 6} = 2 / 6 := by
    unfold P; rw [c6, show #({4, 6} : Finset ℕ) = 2 by decide]; norm_num
  refine ⟨pA, pB, i, pAB, by norm_num, ?_, by norm_num, by decide, ?_, by norm_num⟩
  · rw [verjetnost_vsote, pA, pB, i, pAB]; norm_num
  · unfold P; rw [c6, show #({2, 4, 5, 6} : Finset ℕ) = 4 by decide]; norm_num

/-- Bolj natančno (neodvisnost): v Primeru 2 je P(A·B) = 1/3, P(A)·P(B) = 1/4, zato A in B nista neodvisna.
trditev: MAT-SS-4/verjetnost#primer2-odvisna
besedilo: »V Primeru 2 je $P(A \cdot B) = \dfrac{1}{3}$, medtem ko je $P(A) \cdot P(B) = \dfrac{1}{4}$. Ker se vrednosti razlikujeta, dogodka »sodo število« in »večje od $3$« nista neodvisna.« -/
theorem primer2_odvisna : (1 : ℚ) / 2 * (1 / 2) = 1 / 4 ∧ (1 : ℚ) / 3 ≠ 1 / 4 := by norm_num

/-- Pari različnih jabolk (urejeno), jabolka 0–4 so rdeča, 5–7 zelena. -/
def jabolka : Finset (Fin 8 × Fin 8) := univ.filter (fun p => p.1 ≠ p.2)

/-- Primer 3 (štetje): 56 urejenih parov; obe rdeči 20, različnih barv 30, zato P = 20/56 = 5/14 in
30/56 = 15/28.
trditev: MAT-SS-4/verjetnost#primer3-stetje
besedilo: »Odgovor: obe jabolki sta rdeči z verjetnostjo $\frac{5}{14}$, različnih barv pa z verjetnostjo $\frac{15}{28}$.« -/
theorem primer3_stetje :
    #jabolka = 56 ∧ #(jabolka.filter (fun p => p.1.val < 5 ∧ p.2.val < 5)) = 20 ∧
    #(jabolka.filter (fun p => (p.1.val < 5 ∧ 5 ≤ p.2.val) ∨ (5 ≤ p.1.val ∧ p.2.val < 5))) = 30 := by
  unfold jabolka; decide +kernel

/-- Primer 3 (a): 5/8·4/7 = 20/56 = 5/14; (b): 5/8·3/7 = 15/56, 3/8·5/7 = 15/56, vsota 30/56 = 15/28;
preizkus `C(5,1)·C(3,1)/C(8,2) = 15/28`.
trditev: MAT-SS-4/verjetnost#primer3
besedilo: »$P = \dfrac{5}{8} \cdot \dfrac{4}{7} = \dfrac{20}{56} = \dfrac{5}{14}$. **(b)** 1. Različni barvi pomenita »prvo rdeče in drugo zeleno« ali »prvo zeleno in drugo rdeče«. To sta nezdružljiva dogodka, zato verjetnosti seštejemo. 2. $P(R_1 Z_2) = \dfrac{5}{8} \cdot \dfrac{3}{7} = \dfrac{15}{56}$ in $P(Z_1 R_2) = \dfrac{3}{8} \cdot \dfrac{5}{7} = \dfrac{15}{56}$. 3. $P = \dfrac{15}{56} + \dfrac{15}{56} = \dfrac{30}{56} = \dfrac{15}{28}$. 4. Preverimo s kombinacijami: $\dfrac{\binom{5}{1}\binom{3}{1}}{\binom{8}{2}} = \dfrac{15}{28}$.« -/
theorem primer3 :
    (5 : ℚ) / 8 * (4 / 7) = 20 / 56 ∧ (20 : ℚ) / 56 = 5 / 14 ∧
    (5 : ℚ) / 8 * (3 / 7) = 15 / 56 ∧ (3 : ℚ) / 8 * (5 / 7) = 15 / 56 ∧
    (15 : ℚ) / 56 + 15 / 56 = 30 / 56 ∧ (30 : ℚ) / 56 = 15 / 28 ∧
    ((Nat.choose 5 1 * Nat.choose 3 1 : ℕ) : ℚ) / (Nat.choose 8 2 : ℕ) = 15 / 28 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  rw [show Nat.choose 5 1 * Nat.choose 3 1 = 15 by decide, show Nat.choose 8 2 = 28 by decide]; norm_num

/-- Primer 4 (formula popolne verjetnosti): če A in B razdelita Ω in P(A), P(B) > 0, je
P(K) = P(A)·P(K/A) + P(B)·P(K/B), števec P(A·K) = P(A)·P(K/A).
trditev: MAT-SS-4/verjetnost#popolna-verjetnost
besedilo: »Imenovalec: izdelek je pokvarjen, če je pokvarjen in s stroja $A$, ali pokvarjen in s stroja $B$. To sta nezdružljiva dogodka, zato seštejemo:« -/
theorem popolna_verjetnost {α : Type*} [DecidableEq α] (Ω A B K : Finset α) (hAB : Disjoint A B)
    (hU : A ∪ B = Ω) (hK : K ⊆ Ω) (hA : 0 < P Ω A) (hB : 0 < P Ω B) :
    P Ω K = P Ω A * Pp Ω K A + P Ω B * Pp Ω K B := by
  rw [← verjetnost_produkta Ω K A hA, ← verjetnost_produkta Ω K B hB, ← vsota_nezdruzljivih]
  · rw [← inter_union_distrib_left, hU, inter_eq_left.mpr hK]
  · exact Disjoint.mono inter_subset_right inter_subset_right hAB

/-- Predpostavke trditve `popolna_verjetnost` se dajo izpolniti. -/
example : Disjoint ({0} : Finset ℕ) {1} ∧ ({0} : Finset ℕ) ∪ {1} = range 2 ∧ ({0} : Finset ℕ) ⊆ range 2 ∧
    0 < P (range 2) {0} ∧ 0 < P (range 2) {1} := by
  refine ⟨by decide, by decide, by decide, ?_, ?_⟩ <;> unfold P <;> simp

/-- Predpostavke trditve `popolna_verjetnost` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : Disjoint ({0} : Finset ℕ) {1} ∧ ({0} : Finset ℕ) ∪ {1} = range 2 ∧ ({0} : Finset ℕ) ⊆ range 2 ∧ 0 < P (range 2) {0} ∧ 0 < P (range 2) {1} := by
    refine ⟨by decide, by decide, by decide, ?_, ?_⟩ <;> unfold P <;> simp
  popolna_verjetnost (hAB := w.1) (hU := w.2.1) (hK := w.2.2.1) (hA := w.2.2.2.1) (hB := w.2.2.2.2)

/-- Primer 4: P(A·K) = 0,6·0,02 = 0,012; P(K) = 0,6·0,02 + 0,4·0,05 = 0,012 + 0,020 = 0,032;
P(A/K) = 0,012/0,032 = 12/32 = 3/8 = 0,375 (37,5 %, manj kot polovica).
trditev: MAT-SS-4/verjetnost#primer4
besedilo: »$P(A/K) = \dfrac{0{,}012}{0{,}032} = \dfrac{12}{32} = \dfrac{3}{8} = 0{,}375$, torej $37{,}5\,\%$. To je manj kot polovica« -/
theorem primer4 :
    (0.6 : ℚ) * 0.02 = 0.012 ∧ (0.6 : ℚ) * 0.02 + 0.4 * 0.05 = 0.012 + 0.020 ∧ (0.012 : ℚ) + 0.020 = 0.032 ∧
    (0.012 : ℚ) / 0.032 = 12 / 32 ∧ (12 : ℚ) / 32 = 3 / 8 ∧ (3 : ℚ) / 8 = 0.375 ∧ (0.375 : ℚ) < 1 / 2 := by
  norm_num

/-! ## Za maturo -/

/-- Naloga 1: dve kocki, 6·6 = 36 izidov, ugodni (2,6), (3,5), (4,4), (5,3), (6,2), P = 5/36.
trditev: MAT-SS-4/verjetnost#naloga1
besedilo: »Vseh enako verjetnih izidov je $6 \cdot 6 = 36$. 2. Ugodni izidi so $(2, 6)$, $(3, 5)$, $(4, 4)$, $(5, 3)$ in $(6, 2)$, torej $5$ izidov. 3. Po klasični definiciji je $P = \frac{5}{36}$.« -/
theorem naloga1 :
    #((Icc 1 6 : Finset ℕ) ×ˢ Icc 1 6) = 6 * 6 ∧
    ((Icc 1 6 : Finset ℕ) ×ˢ Icc 1 6).filter (fun p => p.1 + p.2 = 8) = {(2, 6), (3, 5), (4, 4), (5, 3), (6, 2)} ∧
    P ((Icc 1 6 : Finset ℕ) ×ˢ Icc 1 6) (((Icc 1 6 : Finset ℕ) ×ˢ Icc 1 6).filter (fun p => p.1 + p.2 = 8)) =
      5 / 36 := by
  refine ⟨by decide, by decide, ?_⟩
  unfold P
  rw [show #(((Icc 1 6 : Finset ℕ) ×ˢ Icc 1 6).filter (fun p => p.1 + p.2 = 8)) = 5 by decide,
    show #((Icc 1 6 : Finset ℕ) ×ˢ Icc 1 6) = 36 by decide]
  norm_num

/-- Izbori 3 kroglic izmed 12: rdeče 0–3, modre 4–6, zelene 7–11. -/
def izbori : Finset (Finset ℕ) := (range 12).powersetCard 3

/-- Naloga 2 (štetje): 220 izborov; vse zelene 10, po ena vsake barve 60, brez rdeče 56, vsaj ena rdeča 164.
trditev: MAT-SS-4/verjetnost#naloga2-stetje
besedilo: »Vseh enako verjetnih izborov $3$ kroglic izmed $12$ je $\binom{12}{3} = \frac{12 \cdot 11 \cdot 10}{3 \cdot 2 \cdot 1} = 220$. 2. a) Ugodnih izborov je $\binom{5}{3} = 10$, zato je $P = \frac{10}{220} = \frac{1}{22}$. 3. b) Izberemo po eno kroglico vsake barve: $4 \cdot 3 \cdot 5 = 60$ izborov, $P = \frac{60}{220} = \frac{3}{11}$. 4. c) Nasprotni dogodek je »nobena kroglica ni rdeča«, torej so vse tri izmed $8$ nerdečih: $\binom{8}{3} = 56$ izborov.« -/
theorem naloga2_stetje :
    #izbori = 220 ∧ #(izbori.filter (fun s => s ⊆ Ico 7 12)) = 10 ∧
    #(izbori.filter (fun s => #(s ∩ range 4) = 1 ∧ #(s ∩ Ico 4 7) = 1 ∧ #(s ∩ Ico 7 12) = 1)) = 60 ∧
    #(izbori.filter (fun s => s ⊆ Ico 4 12)) = 56 ∧
    #(izbori.filter (fun s => (s ∩ range 4).Nonempty)) = 164 := by
  unfold izbori; decide +kernel

/-- Naloga 2: `C(12,3) = 12·11·10/(3·2·1) = 220`; a) 10/220 = 1/22; b) 4·3·5 = 60, 60/220 = 3/11;
c) `C(8,3) = 56`, 1 − 56/220 = 1 − 14/55 = 41/55, tudi (112 + 48 + 4)/220 = 41/55.
trditev: MAT-SS-4/verjetnost#naloga2
besedilo: »Vseh enako verjetnih izborov $3$ kroglic izmed $12$ je $\binom{12}{3} = \frac{12 \cdot 11 \cdot 10}{3 \cdot 2 \cdot 1} = 220$. 2. a) Ugodnih izborov je $\binom{5}{3} = 10$, zato je $P = \frac{10}{220} = \frac{1}{22}$. 3. b) Izberemo po eno kroglico vsake barve: $4 \cdot 3 \cdot 5 = 60$ izborov, $P = \frac{60}{220} = \frac{3}{11}$. 4. c) Nasprotni dogodek je »nobena kroglica ni rdeča«, torej so vse tri izmed $8$ nerdečih: $\binom{8}{3} = 56$ izborov. 5. c) $P = 1 - \frac{56}{220} = 1 - \frac{14}{55} = \frac{41}{55}$.« -/
theorem naloga2 :
    Nat.choose 12 3 = 12 * 11 * 10 / (3 * 2 * 1) ∧ 12 * 11 * 10 / (3 * 2 * 1) = 220 ∧ Nat.choose 5 3 = 10 ∧
    (10 : ℚ) / 220 = 1 / 22 ∧ 4 * 3 * 5 = 60 ∧ (60 : ℚ) / 220 = 3 / 11 ∧ Nat.choose 8 3 = 56 ∧
    (1 : ℚ) - 56 / 220 = 1 - 14 / 55 ∧ (1 : ℚ) - 14 / 55 = 41 / 55 ∧
    4 * 28 + 6 * 8 + 4 = 112 + 48 + 4 ∧ ((112 + 48 + 4 : ℕ) : ℚ) / 220 = 41 / 55 := by
  refine ⟨by decide, by decide, by decide, by norm_num, by norm_num, by norm_num, by decide, by norm_num,
    by norm_num, by norm_num, by norm_num⟩

/-- Naloga 2 a)–c) kot klasične verjetnosti na prostoru izborov: 1/22, 3/11, 41/55 (c z nasprotnim dogodkom).
trditev: MAT-SS-4/verjetnost#naloga2-verjetnosti
besedilo: »Odgovor: a) $\frac{1}{22}$, b) $\frac{3}{11}$, c) $\frac{41}{55}$.« -/
theorem naloga2_verjetnosti :
    P izbori (izbori.filter (fun s => s ⊆ Ico 7 12)) = 1 / 22 ∧
    P izbori (izbori.filter (fun s => #(s ∩ range 4) = 1 ∧ #(s ∩ Ico 4 7) = 1 ∧ #(s ∩ Ico 7 12) = 1)) = 3 / 11 ∧
    P izbori (izbori.filter (fun s => (s ∩ range 4).Nonempty)) = 1 - P izbori (izbori.filter (fun s => s ⊆ Ico 4 12)) ∧
    P izbori (izbori.filter (fun s => (s ∩ range 4).Nonempty)) = 41 / 55 := by
  obtain ⟨h0, h1, h2, h3, h4⟩ := naloga2_stetje
  refine ⟨?_, ?_, ?_, ?_⟩ <;> unfold P <;> simp only [h0, h1, h2, h3, h4] <;> norm_num

/-- Naloga 3: v razredu Ω s 30 dijaki (|S| = 18, |I| = 12, |S·I| = 6) je P(S) = 3/5, P(I) = 2/5, P(S·I) = 1/5,
a) P(S + I) = 3/5 + 2/5 − 1/5 = 4/5, b) 1 − 4/5 = 1/5, c) P(S/I) = (1/5)/(2/5) = 1/2,
d) P(S·I) ≠ 0 (nista nezdružljiva), P(S)·P(I) = 6/25 ≠ 5/25 = P(S·I) in P(S/I) ≠ P(S) (nista neodvisna).
trditev: MAT-SS-4/verjetnost#naloga3
besedilo: »Odgovor: a) $\frac{4}{5}$, b) $\frac{1}{5}$, c) $\frac{1}{2}$, d) dogodka nista nezdružljiva in nista neodvisna, e) $\frac{22}{145}$.« -/
theorem naloga3 {α : Type*} [DecidableEq α] (Ω S I : Finset α) (hS : S ⊆ Ω) (hI : I ⊆ Ω) (h30 : #Ω = 30)
    (h18 : #S = 18) (h12 : #I = 12) (h6 : #(S ∩ I) = 6) :
    P Ω S = 3 / 5 ∧ P Ω I = 2 / 5 ∧ P Ω (S ∩ I) = 1 / 5 ∧
    P Ω (S ∪ I) = 3 / 5 + 2 / 5 - 1 / 5 ∧ (3 : ℚ) / 5 + 2 / 5 - 1 / 5 = 4 / 5 ∧
    P Ω (Ω \ (S ∪ I)) = 1 - 4 / 5 ∧ (1 : ℚ) - 4 / 5 = 1 / 5 ∧
    Pp Ω S I = (1 / 5) / (2 / 5) ∧ ((1 : ℚ) / 5) / (2 / 5) = 1 / 2 ∧
    P Ω (S ∩ I) ≠ 0 ∧ (3 : ℚ) / 5 * (2 / 5) = 6 / 25 ∧ (1 : ℚ) / 5 = 5 / 25 ∧
    P Ω (S ∩ I) ≠ P Ω S * P Ω I ∧ Pp Ω S I ≠ P Ω S := by
  have hΩ : Ω.Nonempty := by rw [← card_pos, h30]; norm_num
  have pS : P Ω S = 3 / 5 := by unfold P; rw [h18, h30]; norm_num
  have pI : P Ω I = 2 / 5 := by unfold P; rw [h12, h30]; norm_num
  have pSI : P Ω (S ∩ I) = 1 / 5 := by unfold P; rw [h6, h30]; norm_num
  have pU : P Ω (S ∪ I) = 3 / 5 + 2 / 5 - 1 / 5 := by rw [verjetnost_vsote, pS, pI, pSI]
  have pp : Pp Ω S I = (1 / 5) / (2 / 5) := by unfold Pp; rw [pSI, pI]
  refine ⟨pS, pI, pSI, pU, by norm_num, ?_, by norm_num, pp, by norm_num, by rw [pSI]; norm_num,
    by norm_num, by norm_num, by rw [pSI, pS, pI]; norm_num, by rw [pp, pS]; norm_num⟩
  rw [nasprotni Ω _ hΩ (union_subset hS hI), pU]; norm_num

/-- Predpostavke trditve `naloga3` se dajo izpolniti (dijaki 0–29, šport 0–17, glasbilo 12–23). -/
example : range 18 ⊆ range 30 ∧ Ico 12 24 ⊆ range 30 ∧ #(range 30) = 30 ∧ #(range 18) = 18 ∧
    #(Ico 12 24) = 12 ∧ #(range 18 ∩ Ico 12 24) = 6 := by decide

/-- Predpostavke trditve `naloga3` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : range 18 ⊆ range 30 ∧ Ico 12 24 ⊆ range 30 ∧ #(range 30) = 30 ∧ #(range 18) = 18 ∧ #(Ico 12 24) = 12 ∧ #(range 18 ∩ Ico 12 24) = 6 := by decide
  naloga3 (hS := w.1) (hI := w.2.1) (h30 := w.2.2.1) (h18 := w.2.2.2.1) (h12 := w.2.2.2.2.1) (h6 := w.2.2.2.2.2)

/-- Naloga 3 e): 12/30·11/29 = 132/870 = 22/145, tudi `C(12,2)/C(30,2) = 22/145`.
trditev: MAT-SS-4/verjetnost#naloga3-e
besedilo: »Prvi izbrani igra glasbilo z verjetnostjo $\frac{12}{30}$, drugi ob tem pogoju z verjetnostjo $\frac{11}{29}$: $P = \frac{12}{30} \cdot \frac{11}{29} = \frac{132}{870} = \frac{22}{145}$.« -/
theorem naloga3_e : (12 : ℚ) / 30 * (11 / 29) = 132 / 870 ∧ (132 : ℚ) / 870 = 22 / 145 ∧
    ((Nat.choose 12 2 : ℕ) : ℚ) / (Nat.choose 30 2 : ℕ) = 22 / 145 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  rw [show Nat.choose 12 2 = 66 by decide, show Nat.choose 30 2 = 435 by decide]; norm_num

/-- Naloga 3 (RAČUN): 18/30 + 12/30 − 6/30 = 4/5, (6/30)/(12/30) = 1/2, (18/30)·(12/30) = 6/25.
trditev: MAT-SS-4/verjetnost#naloga3-racun
besedilo: »a) $P(S) = \frac{18}{30} = \frac{3}{5}$, $P(I) = \frac{12}{30} = \frac{2}{5}$, $P(S \cdot I) = \frac{6}{30} = \frac{1}{5}$.« -/
theorem naloga3_racun : (18 : ℚ) / 30 + 12 / 30 - 6 / 30 = 4 / 5 ∧ ((6 : ℚ) / 30) / (12 / 30) = 1 / 2 ∧
    (18 : ℚ) / 30 * (12 / 30) = 6 / 25 := by norm_num

/-! ## Drugače: na sliki (Galtonova deska) -/

/-- Galtonova deska s tremi vrstami: skrajna košara (1/2)³ = 1/8, srednja 3 poti, `C(3,1)·1/8 = 3/8`.
trditev: MAT-SS-4/verjetnost#galton
besedilo: »Pri treh vrstah in enaki verjetnosti levo/desno pridemo do skrajne košare le na eni poti: $\left(\dfrac{1}{2}\right)^3 = \dfrac{1}{8}$. V vsaki od dveh srednjih košar končamo po $3$ poteh, torej $\dfrac{3}{8}$.« -/
theorem galton : ((1 : ℚ) / 2) ^ 3 = 1 / 8 ∧ Nat.choose 3 1 = 3 ∧ (3 : ℚ) * (1 / 8) = 3 / 8 := by
  refine ⟨by norm_num, by decide, by norm_num⟩

/-! ## Preveri se -/

/-- Preveri se 1: poskus s 4 izidi ima 2⁴ = 16 dogodkov (14 brez ∅ in Ω, 4 elementarni).
trditev: MAT-SS-4/verjetnost#kviz1
besedilo: »Vsak izid je v dogodku ali ni, zato je dogodkov $2^4 = 16$.« -/
theorem kviz1 : #(univ : Finset (Fin 4)).powerset = 16 ∧ 16 - 2 = 14 := by simp

/-- Preveri se 2 (matematični in empirični del): 96/200 = 0,48, 13/52 = 1/4.
trditev: MAT-SS-4/verjetnost#kviz2
besedilo: »To je matematična verjetnost: $13$ ugodnih od $52$ enako verjetnih izidov.« -/
theorem kviz2 : (96 : ℚ) / 200 = 0.48 ∧ (13 : ℚ) / 52 = 1 / 4 := by norm_num

/-- Preveri se 3: P(A) = 0,5, P(B) = 0,4, P(A + B) = 0,6 ⇒ P(A·B) = 0,5 + 0,4 − 0,6 = 0,3 (ne 0,2 = 0,5·0,4,
ne 0,9).
trditev: MAT-SS-4/verjetnost#kviz3
besedilo: »Iz $P(A + B) = P(A) + P(B) - P(A \cdot B)$ sledi $P(A \cdot B) = 0{,}5 + 0{,}4 - 0{,}6 = 0{,}3$.« -/
theorem kviz3 {α : Type*} [DecidableEq α] (Ω A B : Finset α) (pA : P Ω A = 0.5) (pB : P Ω B = 0.4)
    (pU : P Ω (A ∪ B) = 0.6) : P Ω (A ∩ B) = 0.5 + 0.4 - 0.6 ∧ (0.5 : ℚ) + 0.4 - 0.6 = 0.3 ∧
    (0.5 : ℚ) * 0.4 = 0.2 := by
  have h := verjetnost_vsote Ω A B
  rw [pA, pB, pU] at h
  refine ⟨by linarith, by norm_num, by norm_num⟩

/-- Predpostavke trditve `kviz3` se dajo izpolniti (Ω = 0–9, A = 0–4, B = 2–5). -/
example : P (range 10) (range 5) = 0.5 ∧ P (range 10) (Ico 2 6) = 0.4 ∧
    P (range 10) (range 5 ∪ Ico 2 6) = 0.6 := by
  refine ⟨?_, ?_, ?_⟩ <;> unfold P
  · simp; norm_num
  · simp; norm_num
  · rw [show #(range 5 ∪ Ico 2 6) = 6 by decide]; simp; norm_num

/-- Predpostavke trditve `kviz3` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : P (range 10) (range 5) = 0.5 ∧ P (range 10) (Ico 2 6) = 0.4 ∧ P (range 10) (range 5 ∪ Ico 2 6) = 0.6 := by
    refine ⟨?_, ?_, ?_⟩ <;> unfold P
    · simp; norm_num
    · simp; norm_num
    · rw [show #(range 5 ∪ Ico 2 6) = 6 by decide]; simp; norm_num
  kviz3 (pA := w.1) (pB := w.2.1) (pU := w.2.2)

/-- Preveri se 4: P(A) = 0,6, P(B) = 0,4, P(A·B) = 0,12 ⇒ P(A/B) = 0,12/0,4 = 0,3 (ne 0,12/0,6 = 0,2,
ne 0,12·0,4 = 0,048).
trditev: MAT-SS-4/verjetnost#kviz4
besedilo: »$P(A/B) = \dfrac{P(A \cdot B)}{P(B)} = \dfrac{0{,}12}{0{,}4} = 0{,}3$.« -/
theorem kviz4 {α : Type*} [DecidableEq α] (Ω A B : Finset α) (pB : P Ω B = 0.4) (pAB : P Ω (A ∩ B) = 0.12) :
    Pp Ω A B = 0.12 / 0.4 ∧ (0.12 : ℚ) / 0.4 = 0.3 ∧ (0.12 : ℚ) / 0.6 = 0.2 ∧ (0.12 : ℚ) * 0.4 = 0.048 := by
  refine ⟨by unfold Pp; rw [pB, pAB], by norm_num, by norm_num, by norm_num⟩

/-- Predpostavke trditve `kviz4` se dajo izpolniti (Ω = 0–49, A = 0–29, B = 24–43). -/
example : P (range 50) (range 30) = 0.6 ∧ P (range 50) (Ico 24 44) = 0.4 ∧
    P (range 50) (range 30 ∩ Ico 24 44) = 0.12 := by
  refine ⟨?_, ?_, ?_⟩ <;> unfold P
  · simp; norm_num
  · simp; norm_num
  · rw [show #(range 30 ∩ Ico 24 44) = 6 by decide]; simp; norm_num

/-- Preveri se 5: recepti 0–19, sladki 0–9, hitri 0–5 in 10–12: P(hiter/sladek) = 6/10 = 0,6
(ne 6/20 = 0,3, ne 6/9 = 2/3, ne 9/20 = 0,45).
trditev: MAT-SS-4/verjetnost#kviz5
besedilo: »Med $10$ sladkimi recepti je $6$ hitrih, zato $P(\text{hiter}/\text{sladek}) = \frac{6}{10} = 0{,}6$.« -/
theorem kviz5 : Pp (range 20) (range 6 ∪ Ico 10 13) (range 10) = 6 / 10 ∧ (6 : ℚ) / 10 = 0.6 ∧
    (6 : ℚ) / 20 = 0.3 ∧ (6 : ℚ) / 9 = 2 / 3 ∧ (9 : ℚ) / 20 = 0.45 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  rw [pogojna_stetje _ _ _ (by decide), show #((range 6 ∪ Ico 10 13) ∩ range 10) = 6 by decide]; simp

/-- Preveri se 6: brez vračanja 10/12·9/11 = 15/22, ne 10/12·10/12.
trditev: MAT-SS-4/verjetnost#kviz6
besedilo: »Prvo jemanje spremeni škatlo, zato je drugi faktor pogojna verjetnost $\frac{9}{11}$: $P = \frac{10}{12} \cdot \frac{9}{11} = \frac{15}{22}$.« -/
theorem kviz6 : (10 : ℚ) / 12 * (9 / 11) = 15 / 22 ∧ (10 : ℚ) / 12 * (10 / 12) ≠ 15 / 22 := by norm_num

/-- Preveri se 7: kruh pade trikrat neodvisno, P(namaz navzdol) = 0,6: nasprotni dogodek 0,4³ = 0,064,
P = 1 − 0,064 = 0,936 ≈ 0,94; napačno 3·0,6 = 1,8 > 1 in 0,6³ = 0,216.
trditev: MAT-SS-4/verjetnost#kviz7
besedilo: »Nasprotni dogodek je »vsakič z namazom navzgor«: $0{,}4^3 = 0{,}064$. Zato je $P = 1 - 0{,}064 = 0{,}936 \approx 0{,}94$.« -/
theorem kviz7 : (0.4 : ℚ) ^ 3 = 0.064 ∧ (1 : ℚ) - 0.064 = 0.936 ∧ |(0.936 : ℚ) - 0.94| < 0.005 ∧
    (3 : ℚ) * 0.6 = 1.8 ∧ (1 : ℚ) < 1.8 ∧ (0.6 : ℚ) ^ 3 = 0.216 := by norm_num [abs_lt]

/-- RAČUN: 6/36 = 1/6, 2³ = 8, 1 + 3 + 3 + 1 = 8, 2⁴ = 16, 5/(6·6) = 5/36, `12!/(3!·9!) = 220`,
`5!/(3!·2!)/220 = 1/22`, `8!/(3!·5!) = 56`, `(12!/(2!·10!))/(30!/(2!·28!)) = 22/145`.
trditev: MAT-SS-4/verjetnost#racun
besedilo: »a) Ugodnih izborov je $\binom{5}{3} = 10$, zato je $P = \frac{10}{220} = \frac{1}{22}$.« -/
theorem racun : (6 : ℚ) / 36 = 1 / 6 ∧ (2 : ℕ) ^ 3 = 8 ∧ 1 + 3 + 3 + 1 = 8 ∧ (2 : ℕ) ^ 4 = 16 ∧
    (5 : ℚ) / (6 * 6) = 5 / 36 ∧ Nat.factorial 12 / (Nat.factorial 3 * Nat.factorial 9) = 220 ∧
    ((Nat.factorial 5 / (Nat.factorial 3 * Nat.factorial 2) : ℕ) : ℚ) / 220 = 1 / 22 ∧
    Nat.factorial 8 / (Nat.factorial 3 * Nat.factorial 5) = 56 ∧
    ((Nat.factorial 12 / (Nat.factorial 2 * Nat.factorial 10) : ℕ) : ℚ) /
      ((Nat.factorial 30 / (Nat.factorial 2 * Nat.factorial 28) : ℕ) : ℚ) = 22 / 145 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by decide, ?_, by decide, ?_⟩
  · rw [show Nat.factorial 5 / (Nat.factorial 3 * Nat.factorial 2) = 10 by decide]; norm_num
  · rw [show Nat.factorial 12 / (Nat.factorial 2 * Nat.factorial 10) = 66 by decide,
      show Nat.factorial 30 / (Nat.factorial 2 * Nat.factorial 28) = 435 by decide]; norm_num

/-! ## Primeri izpolnljivosti (izrek, uporabljen na konkretnih vrednostih) -/

/-- Predpostavke trditve `nasprotni_mera` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  nasprotni_mera (MeasureTheory.Measure.dirac (0:ℝ)) Set.univ MeasurableSet.univ

/-- Predpostavke trditve `kviz4` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : P (range 50) (range 30) = 0.6 ∧ P (range 50) (Ico 24 44) = 0.4 ∧ P (range 50) (range 30 ∩ Ico 24 44) = 0.12 := by
    refine ⟨?_, ?_, ?_⟩ <;> unfold P
    · simp; norm_num
    · simp; norm_num
    · rw [show #(range 30 ∩ Ico 24 44) = 6 by decide]; simp; norm_num
  kviz4 (pB := w.2.1) (pAB := w.2.2)

end Evklid.Lekcije.MAT_SS_4.Verjetnost
