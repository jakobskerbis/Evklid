/-
vir: content/lessons/MAT-SS-1/osnove-logike.md
sha256: cf48b21ee75c5b29a50068827564d8a607962f9175410ac932f2d08af0cde042
Ni v Leanu: opredelitev izjave in primeri »Opeka je iz žgane gline«, »Prinesi meter!«, »Je malta že suha?«,
»Vsak trikotnik ima štiri kote« (razvrščanje povedi v jeziku, ne matematična trditev; dokazano je le, da ima vsaka
izjava natanko eno vrednost: `izjava_p_ali_n`); zgledi iz vsakdanjega jezika (ometavanje, rezalnik, betoniranje,
trajekt: besedilo c) Naloge 2 je prevod v besede, dokazana je enakovrednost ¬(A ⇒ B) ≡ A ∧ ¬B, na kateri temelji);
dogovor o vrstnem redu operacij (zapis; Leanova prednost ¬, ∧, ∨, →, ↔ je enaka, zato je Naloga 1 zapisana
brez oklepajev, `ne_a_ali_b_ni_ne_ali` pa pokaže, da (¬A) ∨ B in ¬(A ∨ B) nista enakovredni); »na tem temelji
posredni dokaz« (opis metode; dokazana je kontrapozicija); risba vezij s stikali in simulacija; točkovanje.
Vrednosti P in N so zapisane kot `true` in `false` (Bool); vrstice tabel so v vrstnem redu lekcije PP, PN, NP, NN.
Pravila veznikov so dokazana za izjave (Prop) in tabele za vrednosti (Bool, z `decide`).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.OsnoveLogike

/-- Vrstice tabele za dve izjavi v vrstnem redu lekcije: PP, PN, NP, NN. -/
def vrstice2 : List (Bool × Bool) := [(true, true), (true, false), (false, true), (false, false)]

/-! ## Razlaga -/

/-- Razlaga 1: izjava je pravilna ali nepravilna, nikoli oboje hkrati. -/
theorem izjava_p_ali_n (A : Prop) : (A ∨ ¬A) ∧ ¬(A ∧ ¬A) :=
  ⟨Classical.em A, fun h => h.2 h.1⟩

/-- Razlaga 2: negacija ima vedno nasprotno vrednost kot A (¬P = N, ¬N = P). -/
theorem negacija_nasprotna (a : Bool) : (!a) ≠ a ∧ ((!a) = true ↔ a = false) := by
  cases a <;> decide

/-- Razlaga 2 in Pogoste napake 1: »ni res, da vsi …« pomeni »vsaj en … ni«. -/
theorem negacija_vsi {α : Type*} (P : α → Prop) : (¬ ∀ x, P x) ↔ ∃ x, ¬ P x := not_forall

/-- Pogoste napake 1 in Pazi na: negacija »vsi so« ni »noben ni«. Protiprimer: dva vijaka, pocinkan je le prvi
(`true`); »vsi so pocinkani« ne drži, »noben ni pocinkan« pa tudi ne. -/
theorem negacija_vsi_ni_noben :
    (¬ ∀ x : Bool, x = true) ∧ ¬ (∀ x : Bool, ¬ x = true) := by decide

/-- Razlaga 2, Preveri: negacija izjave »deska je krajša od 2 m« je »deska je dolga 2 m ali več«. -/
theorem negacija_deska (d : ℝ) : ¬ (d < 2) ↔ 2 ≤ d := not_lt

/-- Razlaga 3: konjunkcija je pravilna le, kadar sta pravilni obe izjavi (brez enega pogoja ni pravilna). -/
theorem konjunkcija (A B : Prop) : (¬A → ¬(A ∧ B)) ∧ (¬B → ¬(A ∧ B)) ∧ (A → B → A ∧ B) :=
  ⟨fun h hab => h hab.1, fun h hab => h hab.2, fun a b => ⟨a, b⟩⟩

/-- Razlaga 4 in Pogoste napake 2: disjunkcija je pravilna, kadar je pravilna vsaj ena izjava, tudi obe
(vključni »ali«); nepravilna je samo, ko sta obe nepravilni. -/
theorem disjunkcija (A B : Prop) : (A → A ∨ B) ∧ (B → A ∨ B) ∧ (A → B → A ∨ B) ∧ (¬(A ∨ B) ↔ ¬A ∧ ¬B) :=
  ⟨Or.inl, Or.inr, fun a _ => Or.inl a, not_or⟩

/-- Razlaga 4: pravilnostna tabela konjunkcije in disjunkcije (stolpca P, N, N, N in P, P, P, N). -/
theorem tabela_in_ali :
    vrstice2.map (fun p => (decide (p.1 = true ∧ p.2 = true), decide (p.1 = true ∨ p.2 = true))) =
      [(true, true), (false, true), (false, true), (false, false)] := by decide

/-- Razlaga 4, Preveri: A = P, B = N ⇒ A ∨ B je pravilna. -/
theorem preveri_ali (A B : Prop) (hA : A) (_hB : ¬B) : A ∨ B := Or.inl hA

/-- Predpostavke `preveri_ali` se dajo izpolniti (A = True, B = False). -/
example : True ∧ ¬False := ⟨trivial, id⟩

/-- Razlaga 5: implikacija A ⇒ B je nepravilna samo, kadar je A pravilna in B nepravilna. -/
theorem implikacija_nepravilna (A B : Prop) : ¬(A → B) ↔ A ∧ ¬B := not_imp

/-- Razlaga 5, Primer 1 (korak 3) in Pogoste napake 3: implikacija z nepravilno predpostavko je vedno pravilna,
implikacija s pravilno posledico tudi. -/
theorem implikacija_pravilna (A B : Prop) : (¬A → (A → B)) ∧ (B → (A → B)) :=
  ⟨fun h a => absurd a h, fun b _ => b⟩

/-- Razlaga 6: ekvivalenca je pravilna, kadar imata A in B enako vrednost (obe P ali obe N). -/
theorem ekvivalenca (A B : Prop) : (A ↔ B) ↔ (A ∧ B) ∨ (¬A ∧ ¬B) := by
  by_cases hA : A <;> by_cases hB : B <;> simp [hA, hB]

/-- Razlaga 6: ekvivalenca za vrednosti: A ⇔ B je P natanko tedaj, ko je a = b. -/
theorem ekvivalenca_bool (a b : Bool) : (a = true ↔ b = true) ↔ a = b := by
  cases a <;> cases b <;> decide

/-- Razlaga 6: pravilnostna tabela implikacije in ekvivalence (stolpca P, N, P, P in P, N, N, P). -/
theorem tabela_imp_ekv :
    vrstice2.map (fun p => (decide (p.1 = true → p.2 = true), decide (p.1 = true ↔ p.2 = true))) =
      [(true, true), (false, false), (true, false), (true, true)] := by decide

/-- Razlaga, Povzetek: celotna tabela za dve izjavi, vrstice ¬A, A ∧ B, A ∨ B, A ⇒ B, A ⇔ B po stolpcih
PP, PN, NP, NN. -/
theorem tabela_povzetek :
    vrstice2.map (fun p => decide (¬ p.1 = true)) = [false, false, true, true] ∧
    vrstice2.map (fun p => decide (p.1 = true ∧ p.2 = true)) = [true, false, false, false] ∧
    vrstice2.map (fun p => decide (p.1 = true ∨ p.2 = true)) = [true, true, true, false] ∧
    vrstice2.map (fun p => decide (p.1 = true → p.2 = true)) = [true, false, true, true] ∧
    vrstice2.map (fun p => decide (p.1 = true ↔ p.2 = true)) = [true, false, false, true] := by decide

/-- Zakaj se tega učimo in premisli po Razlagi 6: škatla krši pravilo »kopalnica ⇒ nedrseče« natanko pri
kopalnici (k = P) z gladkimi ploščicami (n = N). Škatla 1 (vidiš k = P) in 4 (vidiš n = N) lahko kršita pravilo
(obstaja skrita stran s kršitvijo), škatli 2 (k = N) in 3 (n = P) ne morata, ne glede na skrito stran. -/
theorem uganka_skatle :
    (∃ n : Bool, ¬((true = true) → n = true)) ∧
    (∀ n : Bool, ((false = true) → n = true)) ∧
    (∀ k : Bool, (k = true → (true = true))) ∧
    (∃ k : Bool, ¬(k = true → (false = true))) := by decide

/-- Razlaga 7: število vrstic tabele za n izjav je 2ⁿ (vse možne izbire vrednosti P/N za n izjav). -/
theorem stevilo_vrstic (n : ℕ) : Fintype.card (Fin n → Bool) = 2 ^ n := by simp

/-- Razlaga 7: dve izjavi 2 · 2 = 4 vrstice, tri izjave 2³ = 8 vrstic. -/
theorem vrstice_2_3 : Fintype.card (Fin 2 → Bool) = 2 * 2 ∧ 2 * 2 = 4 ∧ Fintype.card (Fin 3 → Bool) = 2 ^ 3 ∧
    (2 : ℕ) ^ 3 = 8 := by simp

/-- Razlaga 7, Preveri: tabela izjave (A ∨ B) ∧ ¬C ima tri izjave, torej 8 vrstic. -/
theorem preveri_vrstice : Fintype.card (Bool × Bool × Bool) = 8 := by decide

/-- Razlaga 7: ¬A ∨ B pomeni (¬A) ∨ B, ne ¬(A ∨ B); izjavi nista enakovredni (vrstica A = N, B = P). -/
theorem ne_a_ali_b_ni_ne_ali : (¬False ∨ True) ∧ ¬¬(False ∨ True) := by simp

/-- Razlaga 8 in Ustno vprašanje 2: A ∨ ¬A je tavtologija (pravilna pri vsaki vrednosti A). -/
theorem tavtologija_em (A : Prop) : A ∨ ¬A := Classical.em A

/-- Razlaga 8 in Ustno vprašanje 2: A ∧ ¬A je protislovje (nepravilna pri vsaki vrednosti A). -/
theorem protislovje (A : Prop) : ¬(A ∧ ¬A) := fun h => h.2 h.1

/-- Razlaga 8: v tabeli ima A ∨ ¬A same P, A ∧ ¬A pa same N. -/
theorem tavtologija_tabela : [true, false].map (fun a => decide (a = true ∨ ¬ a = true)) = [true, true] ∧
    [true, false].map (fun a => decide (a = true ∧ ¬ a = true)) = [false, false] := by decide

/-- Razlaga 9, Povzetek in Bolj natančno: A ⇒ B ≡ ¬A ∨ B. -/
theorem imp_ali (A B : Prop) : (A → B) ↔ (¬A ∨ B) := imp_iff_not_or

/-- Razlaga 9, Povzetek in Ustno vprašanje 3: A ⇒ B ≡ ¬B ⇒ ¬A (kontrapozicija). -/
theorem kontrapozicija (A B : Prop) : (A → B) ↔ (¬B → ¬A) := not_imp_not.symm

/-- Razlaga 9: stolpci A ⇒ B, ¬B ⇒ ¬A in ¬A ∨ B se ujemajo v vseh vrsticah. -/
theorem kontrapozicija_tabela :
    vrstice2.map (fun p => decide (¬ p.2 = true → ¬ p.1 = true)) = [true, false, true, true] ∧
    vrstice2.map (fun p => decide (¬ p.1 = true ∨ p.2 = true)) = [true, false, true, true] := by decide

/-- Razlaga 9, premisli, Povzetek, Pogoste napake 4 in Ustno vprašanje 3: obrat B ⇒ A ni enakovreden A ⇒ B;
odloči vrstica A = N, B = P (A ⇒ B je P, B ⇒ A je N). -/
theorem obrat_ni_enakovreden : ((False → True) ∧ ¬(True → False)) ∧
    ¬ (∀ A B : Prop, (A → B) ↔ (B → A)) := by
  refine ⟨⟨fun h => h.elim, fun h => h trivial⟩, fun h => ?_⟩
  exact (h False True).mp (fun h => h.elim) trivial

/-- Bolj natančno: A ⇔ B ≡ (A ⇒ B) ∧ (B ⇒ A); ekvivalenca je implikacija v obe smeri. -/
theorem ekv_obe_smeri (A B : Prop) : (A ↔ B) ↔ ((A → B) ∧ (B → A)) := iff_iff_implies_and_implies

/-- Bolj natančno: izjavna forma x + 2 = 5 je pri x = 3 pravilna, pri x = 4 nepravilna. -/
theorem izjavna_forma : ((3 : ℝ) + 2 = 5) ∧ ¬((4 : ℝ) + 2 = 5) := by norm_num

/-- Povzetek, Pogoste napake 5 in Primer 4: De Morganovi pravili. -/
theorem de_morgan (A B : Prop) : (¬(A ∧ B) ↔ ¬A ∨ ¬B) ∧ (¬(A ∨ B) ↔ ¬A ∧ ¬B) :=
  ⟨not_and_or, not_or⟩

/-! ## Rešeni primeri -/

/-- Primer 1: A = P, B = N ⇒ A ∧ B je N, A ∨ B je P, ¬A ⇒ B je P, A ⇔ B je N. -/
theorem primer1 (A B : Prop) (hA : A) (hB : ¬B) :
    ¬(A ∧ B) ∧ (A ∨ B) ∧ (¬A → B) ∧ ¬(A ↔ B) :=
  ⟨fun h => hB h.2, Or.inl hA, fun h => absurd hA h, fun h => hB (h.mp hA)⟩

/-- Predpostavke `primer1` se dajo izpolniti (A = True, B = False). -/
example : True ∧ ¬False := ⟨trivial, id⟩

/-- Primer 2: (A ∧ B) ⇒ A je tavtologija. -/
theorem primer2 (A B : Prop) : (A ∧ B) → A := fun h => h.1

/-- Primer 2, korak 2: stolpec A ∧ B je P, N, N, N, stolpec (A ∧ B) ⇒ A pa P, P, P, P. -/
theorem primer2_tabela :
    vrstice2.map (fun p => decide (p.1 = true ∧ p.2 = true)) = [true, false, false, false] ∧
    vrstice2.map (fun p => decide ((p.1 = true ∧ p.2 = true) → p.1 = true)) = [true, true, true, true] := by
  decide

/-- Primer 3, koraki 2–4: pravilo A ⇒ ¬B in sodelavčev obrat ¬B ⇒ A se razlikujeta v vrstici A = N, B = N
(pravilo P, obrat N), zato nista enakovredni. -/
theorem primer3_razlika : (False → ¬False) ∧ ¬(¬False → False) :=
  ⟨fun h => h.elim, fun h => h id⟩

/-- Primer 3, korak 5: pravilu A ⇒ ¬B je enakovredna kontrapozicija ¬¬B ⇒ ¬A, torej B ⇒ ¬A. -/
theorem primer3_kontrapozicija (A B : Prop) : ((A → ¬B) ↔ (¬¬B → ¬A)) ∧ ((¬¬B → ¬A) ↔ (B → ¬A)) :=
  ⟨kontrapozicija A (¬B), by simp only [not_not]⟩

/-- Primer 4 in premisli: ¬(A ∧ B) ima po vrsticah PP, PN, NP, NN vrednosti N, P, P, P, enako ¬A ∨ ¬B. -/
theorem primer4_tabela :
    vrstice2.map (fun p => decide (¬(p.1 = true ∧ p.2 = true))) = [false, true, true, true] ∧
    vrstice2.map (fun p => decide (¬ p.1 = true ∨ ¬ p.2 = true)) = [false, true, true, true] := by decide

/-! ## Za maturo -/

/-- Naloga 1: A = N, B = P, C = N. Zapis brez oklepajev se bere (¬A ∧ B) ⇒ (C ∨ ¬B) (Lean ima enak vrstni red):
predpostavka je P, posledica N, zato je izjava N. -/
theorem naloga1 (A B C : Prop) (hA : ¬A) (hB : B) (hC : ¬C) :
    (¬A ∧ B) ∧ ¬(C ∨ ¬B) ∧ ¬(¬A ∧ B → C ∨ ¬B) := by
  have h1 : ¬A ∧ B := ⟨hA, hB⟩
  have h2 : ¬(C ∨ ¬B) := by rintro (h | h); exacts [hC h, h hB]
  exact ⟨h1, h2, fun h => h2 (h h1)⟩

/-- Predpostavke `naloga1` se dajo izpolniti (A = C = False, B = True). -/
example : ¬False ∧ True ∧ ¬False := ⟨id, trivial, id⟩

/-- Naloga 2 a): stolpca ¬(A ⇒ B) in A ∧ ¬B sta po vrsticah PP, PN, NP, NN oba N, P, N, N. -/
theorem naloga2a :
    vrstice2.map (fun p => decide (¬(p.1 = true → p.2 = true))) = [false, true, false, false] ∧
    vrstice2.map (fun p => decide (p.1 = true ∧ ¬ p.2 = true)) = [false, true, false, false] := by decide

/-- Naloga 2 b) in c): ¬(A ⇒ B) ≡ A ∧ ¬B (negacija »če veter, trajekt ostane« je »veter in trajekt ne ostane«). -/
theorem naloga2b (A B : Prop) : ¬(A → B) ↔ A ∧ ¬B := not_imp

/-- Naloga 2 d): (A ⇒ B) ∨ (B ⇒ A) je tavtologija. -/
theorem naloga2d (A B : Prop) : (A → B) ∨ (B → A) := by
  by_cases hB : B
  · exact Or.inl (fun _ => hB)
  · exact Or.inr (fun h => absurd h hB)

/-- Naloga 2 d): stolpca A ⇒ B (P, N, P, P) in B ⇒ A (P, P, N, P); disjunkcija je P, P, P, P. -/
theorem naloga2d_tabela :
    vrstice2.map (fun p => decide (p.2 = true → p.1 = true)) = [true, true, false, true] ∧
    vrstice2.map (fun p => decide ((p.1 = true → p.2 = true) ∨ (p.2 = true → p.1 = true))) =
      [true, true, true, true] := by decide

/-! ## Preveri se -/

/-- Preveri se 1: napačni odgovori ne držijo: implikacija z nepravilno A je pravilna (N ⇒ N), pravilna je tudi
pri A = N, B = P, kjer A in B nimata enake vrednosti in nista obe pravilni. -/
theorem kviz1_napacni : (False → False) ∧ (False → True) := ⟨id, fun _ => trivial⟩

/-- Preveri se 2 in Ustno vprašanje 1: tabela (A ∧ B) ⇒ C ima 2³ = 8 vrstic. -/
theorem kviz2 : Fintype.card (Fin 3 → Bool) = 2 ^ 3 ∧ (2 : ℕ) ^ 3 = 8 := by simp

/-- Preveri se 3: ¬(A ∧ B) ≢ ¬A ∧ ¬B; pri A = P, B = N je prva pravilna, druga nepravilna. -/
theorem kviz3 : ¬(True ∧ False) ∧ ¬(¬True ∧ ¬False) := by simp

/-- Preveri se 5: pravilo »brusiš ⇒ očala« krši le Luka (brusi, brez očal); Tine (ne brusi, očala) in Ana
(ne brusi, brez očal) ga ne kršita. -/
theorem kviz5 :
    ((false = true) → (true = true)) ∧ ((false = true) → (false = true)) ∧
    ¬((true = true) → (false = true)) := by decide

/-- Preveri se 6: izjava (A ∨ B) ⇒ C je nepravilna v 3 od 8 vrstic (pravilna v 5). -/
theorem kviz6 :
    (Finset.univ.filter (fun p : Bool × Bool × Bool => ¬((p.1 = true ∨ p.2.1 = true) → p.2.2 = true))).card = 3 ∧
    (Finset.univ.filter (fun p : Bool × Bool × Bool => ((p.1 = true ∨ p.2.1 = true) → p.2.2 = true))).card = 5 ∧
    (Finset.univ.filter (fun p : Bool × Bool => p.1 = true ∨ p.2 = true)).card = 3 ∧
    (3 : ℕ) * 1 = 3 := by decide

/-- RACUN: 2² = 4 in 2³ = 8. -/
theorem racun : (2 : ℕ) ^ 2 = 4 ∧ (2 : ℕ) ^ 3 = 8 := by norm_num

end Evklid.Lekcije.MAT_SS_1.OsnoveLogike
