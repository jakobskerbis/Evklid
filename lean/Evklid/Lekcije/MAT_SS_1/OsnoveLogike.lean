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

/-- Razlaga 1: »2 + 3 = 6« je nepravilna izjava.
trditev: MAT-SS-1/osnove-logike#dva-plus-tri
besedilo: »»$2 + 3 = 6$« je nepravilna izjava.« -/
theorem dva_plus_tri : (2 : ℕ) + 3 ≠ 6 := by decide

/-- Razlaga 1: izjava je pravilna ali nepravilna, nikoli oboje hkrati.
trditev: MAT-SS-1/osnove-logike#izjava
besedilo: »Izjava je poved, za katero lahko rečemo, da je **pravilna** (P) ali **nepravilna** (N), nikoli oboje hkrati.« -/
theorem izjava_p_ali_n (A : Prop) : (A ∨ ¬A) ∧ ¬(A ∧ ¬A) :=
  ⟨Classical.em A, fun h => h.2 h.1⟩

/-- Razlaga 2: negacija ima vedno nasprotno vrednost kot A (¬P = N, ¬N = P).
trditev: MAT-SS-1/osnove-logike#negacija
besedilo: »Negacija ima vedno nasprotno vrednost kot $A$.« -/
theorem negacija_nasprotna (a : Bool) : (!a) ≠ a ∧ ((!a) = true ↔ a = false) := by
  cases a <;> decide

/-- Razlaga 2 in Pogoste napake 1: »ni res, da vsi …« pomeni »vsaj en … ni«.
trditev: MAT-SS-1/osnove-logike#negacija-vsi
besedilo: »Da izjava »Vsi vijaki so pocinkani« ne drži, zadošča en sam nepocinkan vijak. Njena negacija je zato »Vsaj en vijak ni pocinkan«.« -/
theorem negacija_vsi {α : Type*} (P : α → Prop) : (¬ ∀ x, P x) ↔ ∃ x, ¬ P x := not_forall

/-- Pogoste napake 1 in Pazi na: negacija »vsi so« ni »noben ni«. Protiprimer: dva vijaka, pocinkan je le prvi
(`true`); »vsi so pocinkani« ne drži, »noben ni pocinkan« pa tudi ne.
pomozno – izrek dokaže le, da »noben ni« ni negacija »vsi so« (protiprimer); stavek trdi še »je vsaj en ni« (negacija_vsi) -/
theorem negacija_vsi_ni_noben :
    (¬ ∀ x : Bool, x = true) ∧ ¬ (∀ x : Bool, ¬ x = true) := by decide

/-- Razlaga 2, Preveri: negacija izjave »deska je krajša od 2 m« je »deska je dolga 2 m ali več«.
trditev: MAT-SS-1/osnove-logike#negacija-deska
besedilo: »(»Deska ni krajša od $2\,\text{m}$«, torej je dolga $2\,\text{m}$ ali več.)« -/
theorem negacija_deska (d : ℝ) : ¬ (d < 2) ↔ 2 ≤ d := not_lt

/-- Razlaga 3: konjunkcija je pravilna le, kadar sta pravilni obe izjavi (brez enega pogoja ni pravilna).
trditev: MAT-SS-1/osnove-logike#konjunkcija
besedilo: »Je pravilna le, kadar sta pravilni **obe** izjavi.« -/
theorem konjunkcija (A B : Prop) : (¬A → ¬(A ∧ B)) ∧ (¬B → ¬(A ∧ B)) ∧ (A → B → A ∧ B) :=
  ⟨fun h hab => h hab.1, fun h hab => h hab.2, fun a b => ⟨a, b⟩⟩

/-- Razlaga 4 in Pogoste napake 2: disjunkcija je pravilna, kadar je pravilna vsaj ena izjava, tudi obe
(vključni »ali«); nepravilna je samo, ko sta obe nepravilni.
trditev: MAT-SS-1/osnove-logike#disjunkcija
besedilo: »Je pravilna, kadar je pravilna **vsaj ena** izjava, tudi kadar sta pravilni obe (vključni »ali«).« -/
theorem disjunkcija (A B : Prop) : (A → A ∨ B) ∧ (B → A ∨ B) ∧ (A → B → A ∨ B) ∧ (¬(A ∨ B) ↔ ¬A ∧ ¬B) :=
  ⟨Or.inl, Or.inr, fun a _ => Or.inl a, not_or⟩

/-- Razlaga 4: pravilnostna tabela konjunkcije in disjunkcije (stolpca P, N, N, N in P, P, P, N).
trditev: MAT-SS-1/osnove-logike#tabela-in-ali
besedilo: »| P | P | P | P | | P | N | N | P | | N | P | N | P | | N | N | N | N |« -/
theorem tabela_in_ali :
    vrstice2.map (fun p => (decide (p.1 = true ∧ p.2 = true), decide (p.1 = true ∨ p.2 = true))) =
      [(true, true), (false, true), (false, true), (false, false)] := by decide

/-- Razlaga 4, Preveri: A = P, B = N ⇒ A ∨ B je pravilna.
trditev: MAT-SS-1/osnove-logike#preveri-ali
besedilo: »(Pravilna, ker je pravilna vsaj ena.)« -/
theorem preveri_ali (A B : Prop) (hA : A) (_hB : ¬B) : A ∨ B := Or.inl hA

/-- Predpostavke `preveri_ali` se dajo izpolniti (A = True, B = False). -/
example : True ∧ ¬False := ⟨trivial, id⟩

/-- Razlaga 5: implikacija A ⇒ B je nepravilna samo, kadar je A pravilna in B nepravilna.
trditev: MAT-SS-1/osnove-logike#implikacija-nepravilna
besedilo: »Implikacija $A \Rightarrow B$ je nepravilna samo, kadar je $A$ pravilna in $B$ nepravilna.« -/
theorem implikacija_nepravilna (A B : Prop) : ¬(A → B) ↔ A ∧ ¬B := not_imp

/-- Razlaga 5, Primer 1 (korak 3) in Pogoste napake 3: implikacija z nepravilno predpostavko je vedno pravilna,
implikacija s pravilno posledico tudi.
trditev: MAT-SS-1/osnove-logike#implikacija-pravilna
besedilo: »Implikacija z nepravilno predpostavko je pravilna.« -/
theorem implikacija_pravilna (A B : Prop) : (¬A → (A → B)) ∧ (B → (A → B)) :=
  ⟨fun h a => absurd a h, fun b _ => b⟩

/-- Razlaga 6: ekvivalenca je pravilna, kadar imata A in B enako vrednost (obe P ali obe N).
trditev: MAT-SS-1/osnove-logike#ekvivalenca
besedilo: »Je pravilna, kadar imata $A$ in $B$ **enako** vrednost (obe P ali obe N).« -/
theorem ekvivalenca (A B : Prop) : (A ↔ B) ↔ (A ∧ B) ∨ (¬A ∧ ¬B) := by
  by_cases hA : A <;> by_cases hB : B <;> simp [hA, hB]

/-- Razlaga 6: ekvivalenca za vrednosti: A ⇔ B je P natanko tedaj, ko je a = b.
trditev: MAT-SS-1/osnove-logike#ekvivalenca-vrednost
besedilo: »$A \Leftrightarrow B$ je P, ko imata enako vrednost« -/
theorem ekvivalenca_bool (a b : Bool) : (a = true ↔ b = true) ↔ a = b := by
  cases a <;> cases b <;> decide

/-- Razlaga 6: pravilnostna tabela implikacije in ekvivalence (stolpca P, N, P, P in P, N, N, P).
trditev: MAT-SS-1/osnove-logike#tabela-imp-ekv
besedilo: »| P | P | P | P | | P | N | N | N | | N | P | P | N | | N | N | P | P |« -/
theorem tabela_imp_ekv :
    vrstice2.map (fun p => (decide (p.1 = true → p.2 = true), decide (p.1 = true ↔ p.2 = true))) =
      [(true, true), (false, false), (true, false), (true, true)] := by decide

/-- Razlaga, Povzetek: celotna tabela za dve izjavi, vrstice ¬A, A ∧ B, A ∨ B, A ⇒ B, A ⇔ B po stolpcih
PP, PN, NP, NN.
trditev: MAT-SS-1/osnove-logike#tabela-povzetek
besedilo: »| $\neg A$ | N | N | P | P | | $A \wedge B$ | P | N | N | N | | $A \vee B$ | P | P | P | N | | $A \Rightarrow B$ | P | N | P | P | | $A \Leftrightarrow B$ | P | N | N | P |« -/
theorem tabela_povzetek :
    vrstice2.map (fun p => decide (¬ p.1 = true)) = [false, false, true, true] ∧
    vrstice2.map (fun p => decide (p.1 = true ∧ p.2 = true)) = [true, false, false, false] ∧
    vrstice2.map (fun p => decide (p.1 = true ∨ p.2 = true)) = [true, true, true, false] ∧
    vrstice2.map (fun p => decide (p.1 = true → p.2 = true)) = [true, false, true, true] ∧
    vrstice2.map (fun p => decide (p.1 = true ↔ p.2 = true)) = [true, false, false, true] := by decide

/-- Zakaj se tega učimo in premisli po Razlagi 6: škatla krši pravilo »kopalnica ⇒ nedrseče« natanko pri
kopalnici (k = P) z gladkimi ploščicami (n = N). Škatla 1 (vidiš k = P) in 4 (vidiš n = N) lahko kršita pravilo
(obstaja skrita stran s kršitvijo), škatli 2 (k = N) in 3 (n = P) ne morata, ne glede na skrito stran.
trditev: MAT-SS-1/osnove-logike#uganka-skatle
besedilo: »Obrneš škatli 1 (»kopalnica«) in 4 (»gladke«). Pravilo krši le kopalniška škatla z gladkimi ploščicami ($A$ = P, $B$ = N). Le pri teh dveh škatlah je to mogoče. Škatla 2 ima $A$ = N, škatla 3 pa $B$ = P: tam je implikacija pravilna ne glede na drugo stran.« -/
theorem uganka_skatle :
    (∃ n : Bool, ¬((true = true) → n = true)) ∧
    (∀ n : Bool, ((false = true) → n = true)) ∧
    (∀ k : Bool, (k = true → (true = true))) ∧
    (∃ k : Bool, ¬(k = true → (false = true))) := by decide

/-- Razlaga 7: število vrstic tabele za n izjav je 2ⁿ (vse možne izbire vrednosti P/N za n izjav).
trditev: MAT-SS-1/osnove-logike#stevilo-vrstic
besedilo: »Pravilnostna tabela za $n$ izjav ima $2^n$ vrstic« -/
theorem stevilo_vrstic (n : ℕ) : Fintype.card (Fin n → Bool) = 2 ^ n := by simp

/-- Razlaga 7: dve izjavi 2 · 2 = 4 vrstice, tri izjave 2³ = 8 vrstic.
trditev: MAT-SS-1/osnove-logike#vrstice-2-3
besedilo: »Pri dveh izjavah je možnosti $2 \cdot 2 = 4$, pri treh pa $2^3 = 8$.« -/
theorem vrstice_2_3 : Fintype.card (Fin 2 → Bool) = 2 * 2 ∧ 2 * 2 = 4 ∧ Fintype.card (Fin 3 → Bool) = 2 ^ 3 ∧
    (2 : ℕ) ^ 3 = 8 := by simp

/-- Razlaga 7, Preveri: tabela izjave (A ∨ B) ∧ ¬C ima tri izjave, torej 8 vrstic.
trditev: MAT-SS-1/osnove-logike#preveri-vrstice
besedilo: »(Tri izjave, torej 8.)« -/
theorem preveri_vrstice : Fintype.card (Bool × Bool × Bool) = 8 := by decide

/-- Razlaga 7: ¬A ∨ B pomeni (¬A) ∨ B, ne ¬(A ∨ B); izjavi nista enakovredni (vrstica A = N, B = P).
trditev: MAT-SS-1/osnove-logike#ne-a-ali-b
besedilo: »Tako $\neg A \vee B$ pomeni $(\neg A) \vee B$, ne $\neg(A \vee B)$.« -/
theorem ne_a_ali_b_ni_ne_ali : (¬False ∨ True) ∧ ¬¬(False ∨ True) := by simp

/-- Razlaga 8 in Ustno vprašanje 2: A ∨ ¬A je tavtologija (pravilna pri vsaki vrednosti A).
trditev: MAT-SS-1/osnove-logike#tavtologija
besedilo: »**Tavtologija** je pravilna v vseh vrsticah, npr. $A \vee \neg A$.« -/
theorem tavtologija_em (A : Prop) : A ∨ ¬A := Classical.em A

/-- Razlaga 8 in Ustno vprašanje 2: A ∧ ¬A je protislovje (nepravilna pri vsaki vrednosti A).
trditev: MAT-SS-1/osnove-logike#protislovje
besedilo: »**Protislovje** je nepravilno v vseh vrsticah, npr. $A \wedge \neg A$.« -/
theorem protislovje (A : Prop) : ¬(A ∧ ¬A) := fun h => h.2 h.1

/-- Razlaga 8: v tabeli ima A ∨ ¬A same P, A ∧ ¬A pa same N.
trditev: MAT-SS-1/osnove-logike#tavtologija-tabela
besedilo: »Sestavljena izjava, ki je pravilna v **vseh** vrsticah tabele, je **tavtologija**. Primer je $A \vee \neg A$: »Deska je ravna ali ni ravna.« Izjava, ki je nepravilna v vseh vrsticah, je **protislovje**, na primer $A \wedge \neg A$.« -/
theorem tavtologija_tabela : [true, false].map (fun a => decide (a = true ∨ ¬ a = true)) = [true, true] ∧
    [true, false].map (fun a => decide (a = true ∧ ¬ a = true)) = [false, false] := by decide

/-- Razlaga 9, Povzetek in Bolj natančno: A ⇒ B ≡ ¬A ∨ B.
trditev: MAT-SS-1/osnove-logike#imp-ali
besedilo: »$$A \Rightarrow B \;\equiv\; \neg A \vee B$$« -/
theorem imp_ali (A B : Prop) : (A → B) ↔ (¬A ∨ B) := imp_iff_not_or

/-- Razlaga 9, Povzetek, Ustno vprašanje 3 in Preveri se 4: A ⇒ B ≡ ¬B ⇒ ¬A (kontrapozicija).
trditev: MAT-SS-1/osnove-logike#kontrapozicija
besedilo: »$$A \Rightarrow B \;\equiv\; \neg B \Rightarrow \neg A$$« -/
theorem kontrapozicija (A B : Prop) : (A → B) ↔ (¬B → ¬A) := not_imp_not.symm

/-- Razlaga 9: stolpci A ⇒ B, ¬B ⇒ ¬A in ¬A ∨ B se ujemajo v vseh vrsticah.
trditev: MAT-SS-1/osnove-logike#kontrapozicija-tabela
besedilo: »**Enakovredni izjavi** ($\equiv$) imata v vseh vrsticah enako vrednost: $$(A \Rightarrow B) \equiv (\neg B \Rightarrow \neg A) \equiv (\neg A \vee B)$$« -/
theorem kontrapozicija_tabela :
    vrstice2.map (fun p => decide (¬ p.2 = true → ¬ p.1 = true)) = [true, false, true, true] ∧
    vrstice2.map (fun p => decide (¬ p.1 = true ∨ p.2 = true)) = [true, false, true, true] := by decide

/-- Razlaga 9, premisli, Povzetek, Pogoste napake 4, Ustno vprašanje 3 in Preveri se 4: obrat B ⇒ A ni enakovreden A ⇒ B;
odloči vrstica A = N, B = P (A ⇒ B je P, B ⇒ A je N).
trditev: MAT-SS-1/osnove-logike#obrat
besedilo: »Ni enakovreden. V vrstici $A$ = N, $B$ = P je $A \Rightarrow B$ pravilna, $B \Rightarrow A$ pa nepravilna (predpostavka $B$ je pravilna, posledica $A$ ne).« -/
theorem obrat_ni_enakovreden : ((False → True) ∧ ¬(True → False)) ∧
    ¬ (∀ A B : Prop, (A → B) ↔ (B → A)) := by
  refine ⟨⟨fun h => h.elim, fun h => h trivial⟩, fun h => ?_⟩
  exact (h False True).mp (fun h => h.elim) trivial

/-- Bolj natančno: A ⇔ B ≡ (A ⇒ B) ∧ (B ⇒ A); ekvivalenca je implikacija v obe smeri.
trditev: MAT-SS-1/osnove-logike#ekv-obe-smeri
besedilo: »$A \Leftrightarrow B \equiv (A \Rightarrow B) \wedge (B \Rightarrow A)$. Ekvivalenca je torej implikacija v obe smeri.« -/
theorem ekv_obe_smeri (A B : Prop) : (A ↔ B) ↔ ((A → B) ∧ (B → A)) := iff_iff_implies_and_implies

/-- Bolj natančno: izjavna forma x + 2 = 5 je pri x = 3 pravilna, pri x = 4 nepravilna.
trditev: MAT-SS-1/osnove-logike#izjavna-forma
besedilo: »pri $x = 3$ je pravilna, pri $x = 4$ nepravilna« -/
theorem izjavna_forma : ((3 : ℝ) + 2 = 5) ∧ ¬((4 : ℝ) + 2 = 5) := by norm_num

/-- Povzetek, Pogoste napake 5 in Primer 4: De Morganovi pravili.
trditev: MAT-SS-1/osnove-logike#de-morgan
besedilo: »$\neg(A \wedge B) \equiv \neg A \vee \neg B$, $\neg(A \vee B) \equiv \neg A \wedge \neg B$« -/
theorem de_morgan (A B : Prop) : (¬(A ∧ B) ↔ ¬A ∨ ¬B) ∧ (¬(A ∨ B) ↔ ¬A ∧ ¬B) :=
  ⟨not_and_or, not_or⟩

/-! ## Rešeni primeri -/

/-- Primer 1: A = P, B = N ⇒ A ∧ B je N, A ∨ B je P, ¬A ⇒ B je P, A ⇔ B je N.
trditev: MAT-SS-1/osnove-logike#primer1
besedilo: »Odgovor: $A \wedge B$ in $A \Leftrightarrow B$ sta nepravilni, $A \vee B$ in $\neg A \Rightarrow B$ sta pravilni.« -/
theorem primer1 (A B : Prop) (hA : A) (hB : ¬B) :
    ¬(A ∧ B) ∧ (A ∨ B) ∧ (¬A → B) ∧ ¬(A ↔ B) :=
  ⟨fun h => hB h.2, Or.inl hA, fun h => absurd hA h, fun h => hB (h.mp hA)⟩

/-- Predpostavke `primer1` se dajo izpolniti (A = True, B = False). -/
example : True ∧ ¬False := ⟨trivial, id⟩

/-- Primer 2: (A ∧ B) ⇒ A je tavtologija.
trditev: MAT-SS-1/osnove-logike#primer2
besedilo: »zadnji stolpec ima same P, zato je $(A \wedge B) \Rightarrow A$ tavtologija.« -/
theorem primer2 (A B : Prop) : (A ∧ B) → A := fun h => h.1

/-- Primer 2, korak 2: stolpec A ∧ B je P, N, N, N, stolpec (A ∧ B) ⇒ A pa P, P, P, P.
trditev: MAT-SS-1/osnove-logike#primer2-tabela
besedilo: »| P | P | P | | P | N | P | | N | P | P | | N | N | P |« -/
theorem primer2_tabela :
    vrstice2.map (fun p => decide (p.1 = true ∧ p.2 = true)) = [true, false, false, false] ∧
    vrstice2.map (fun p => decide ((p.1 = true ∧ p.2 = true) → p.1 = true)) = [true, true, true, true] := by
  decide

/-- Primer 3, koraki 2–4: pravilo A ⇒ ¬B in sodelavčev obrat ¬B ⇒ A se razlikujeta v vrstici A = N, B = N
(pravilo P, obrat N), zato nista enakovredni.
trditev: MAT-SS-1/osnove-logike#primer3-razlika
besedilo: »Pravilo $A \Rightarrow \neg B$ ima predpostavko N, zato je pravilno. 4. Sodelavčeva poved $\neg B \Rightarrow A$ ima predpostavko P in posledico N, zato je nepravilna. Povedi torej nista enakovredni.« -/
theorem primer3_razlika : (False → ¬False) ∧ ¬(¬False → False) :=
  ⟨fun h => h.elim, fun h => h id⟩

/-- Primer 3, korak 5: pravilu A ⇒ ¬B je enakovredna kontrapozicija ¬¬B ⇒ ¬A, torej B ⇒ ¬A.
trditev: MAT-SS-1/osnove-logike#primer3-kontrapozicija
besedilo: »Enakovredna je kontrapozicija: $\neg(\neg B) \Rightarrow \neg A$, torej $B \Rightarrow \neg A$.« -/
theorem primer3_kontrapozicija (A B : Prop) : ((A → ¬B) ↔ (¬¬B → ¬A)) ∧ ((¬¬B → ¬A) ↔ (B → ¬A)) :=
  ⟨kontrapozicija A (¬B), by simp only [not_not]⟩

/-- Primer 4 in premisli: ¬(A ∧ B) ima po vrsticah PP, PN, NP, NN vrednosti N, P, P, P, enako ¬A ∨ ¬B.
trditev: MAT-SS-1/osnove-logike#primer4
besedilo: »Stolpec je N, P, P, P, enak kot pri $\neg(A \wedge B)$. Izjavi sta enakovredni.« -/
theorem primer4_tabela :
    vrstice2.map (fun p => decide (¬(p.1 = true ∧ p.2 = true))) = [false, true, true, true] ∧
    vrstice2.map (fun p => decide (¬ p.1 = true ∨ ¬ p.2 = true)) = [false, true, true, true] := by decide

/-! ## Za maturo -/

/-- Naloga 1: A = N, B = P, C = N. Zapis brez oklepajev se bere (¬A ∧ B) ⇒ (C ∨ ¬B) (Lean ima enak vrstni red):
predpostavka je P, posledica N, zato je izjava N.
trditev: MAT-SS-1/osnove-logike#naloga1
besedilo: »Odgovor: izjava $\neg A \wedge B \Rightarrow C \vee \neg B$ je nepravilna (N).« -/
theorem naloga1 (A B C : Prop) (hA : ¬A) (hB : B) (hC : ¬C) :
    (¬A ∧ B) ∧ ¬(C ∨ ¬B) ∧ ¬(¬A ∧ B → C ∨ ¬B) := by
  have h1 : ¬A ∧ B := ⟨hA, hB⟩
  have h2 : ¬(C ∨ ¬B) := by rintro (h | h); exacts [hC h, h hB]
  exact ⟨h1, h2, fun h => h2 (h h1)⟩

/-- Predpostavke `naloga1` se dajo izpolniti (A = C = False, B = True). -/
example : ¬False ∧ True ∧ ¬False := ⟨id, trivial, id⟩

/-- Naloga 2 a): stolpca ¬(A ⇒ B) in A ∧ ¬B sta po vrsticah PP, PN, NP, NN oba N, P, N, N.
trditev: MAT-SS-1/osnove-logike#naloga2a
besedilo: »| PP | N | N | | PN | P | P | | NP | N | N | | NN | N | N |« -/
theorem naloga2a :
    vrstice2.map (fun p => decide (¬(p.1 = true → p.2 = true))) = [false, true, false, false] ∧
    vrstice2.map (fun p => decide (p.1 = true ∧ ¬ p.2 = true)) = [false, true, false, false] := by decide

/-- Naloga 2 b) in c): ¬(A ⇒ B) ≡ A ∧ ¬B (negacija »če veter, trajekt ostane« je »veter in trajekt ne ostane«).
trditev: MAT-SS-1/osnove-logike#naloga2b
besedilo: »zato sta izjavi enakovredni: $\neg(A \Rightarrow B) \equiv A \wedge \neg B$.« -/
theorem naloga2b (A B : Prop) : ¬(A → B) ↔ A ∧ ¬B := not_imp

/-- Naloga 2 d): (A ⇒ B) ∨ (B ⇒ A) je tavtologija.
trditev: MAT-SS-1/osnove-logike#naloga2d
besedilo: »izjava $(A \Rightarrow B) \vee (B \Rightarrow A)$ je tavtologija.« -/
theorem naloga2d (A B : Prop) : (A → B) ∨ (B → A) := by
  by_cases hB : B
  · exact Or.inl (fun _ => hB)
  · exact Or.inr (fun h => absurd h hB)

/-- Naloga 2 d): stolpca A ⇒ B (P, N, P, P) in B ⇒ A (P, P, N, P); disjunkcija je P, P, P, P.
trditev: MAT-SS-1/osnove-logike#naloga2d-tabela
besedilo: »| P | P | P | P | | P | N | N | P | | N | P | P | N | | N | N | P | P |« -/
theorem naloga2d_tabela :
    vrstice2.map (fun p => decide (p.2 = true → p.1 = true)) = [true, true, false, true] ∧
    vrstice2.map (fun p => decide ((p.1 = true → p.2 = true) ∨ (p.2 = true → p.1 = true))) =
      [true, true, true, true] := by decide

/-! ## Preveri se -/

/-- Preveri se 1: napačni odgovori ne držijo: implikacija z nepravilno A je pravilna (N ⇒ N), pravilna je tudi
pri A = N, B = P, kjer A in B nimata enake vrednosti in nista obe pravilni.
trditev: MAT-SS-1/osnove-logike#kviz1-napacni
besedilo: »Z nepravilno predpostavko implikacije ne moreš prelomiti, zato je takrat pravilna.« -/
theorem kviz1_napacni : (False → False) ∧ (False → True) := ⟨id, fun _ => trivial⟩

/-- Preveri se 2 in Ustno vprašanje 1: tabela (A ∧ B) ⇒ C ima 2³ = 8 vrstic.
trditev: MAT-SS-1/osnove-logike#kviz2
besedilo: »Tri izjave, vsaka P ali N: $2^3 = 8$ vrstic.« -/
theorem kviz2 : Fintype.card (Fin 3 → Bool) = 2 ^ 3 ∧ (2 : ℕ) ^ 3 = 8 := by simp

/-- Preveri se 3: ¬(A ∧ B) ≢ ¬A ∧ ¬B; pri A = P, B = N je prva pravilna, druga nepravilna.
trditev: MAT-SS-1/osnove-logike#kviz3
besedilo: »Negacija »razdeljena« brez menjave veznika ne da enakovredne izjave.« -/
theorem kviz3 : ¬(True ∧ False) ∧ ¬(¬True ∧ ¬False) := by simp

/-- Preveri se 5: pravilo »brusiš ⇒ očala« krši le Luka (brusi, brez očal); Tine (ne brusi, očala) in Ana
(ne brusi, brez očal) ga ne kršita.
trditev: MAT-SS-1/osnove-logike#kviz5
besedilo: »Predpostavka je nepravilna, zato je implikacija pravilna.« -/
theorem kviz5 :
    ((false = true) → (true = true)) ∧ ((false = true) → (false = true)) ∧
    ¬((true = true) → (false = true)) := by decide

/-- Preveri se 6: izjava (A ∨ B) ⇒ C je nepravilna v 3 od 8 vrstic (pravilna v 5).
trditev: MAT-SS-1/osnove-logike#kviz6
besedilo: »Implikacija je nepravilna le, ko je predpostavka $A \vee B$ pravilna (to je v $3$ od $4$ kombinacij $A$ in $B$) in posledica $C$ nepravilna. Takih vrstic je $3 \cdot 1 = 3$, od vseh $2^3 = 8$.« -/
theorem kviz6 :
    (Finset.univ.filter (fun p : Bool × Bool × Bool => ¬((p.1 = true ∨ p.2.1 = true) → p.2.2 = true))).card = 3 ∧
    (Finset.univ.filter (fun p : Bool × Bool × Bool => ((p.1 = true ∨ p.2.1 = true) → p.2.2 = true))).card = 5 ∧
    (Finset.univ.filter (fun p : Bool × Bool => p.1 = true ∨ p.2 = true)).card = 3 ∧
    (3 : ℕ) * 1 = 3 := by decide

/-- RACUN: 2² = 4 in 2³ = 8.
pomozno – vrstica bloka RACUN, ki ni vidno besedilo -/
theorem racun : (2 : ℕ) ^ 2 = 4 ∧ (2 : ℕ) ^ 3 = 8 := by norm_num

end Evklid.Lekcije.MAT_SS_1.OsnoveLogike
