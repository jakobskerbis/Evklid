/-
vir: content/lessons/MAT-OS-9/verjetnost.md
sha256: f47263b73b4c70476f7ea1239cd80ec7fbcbb4a12a020c93977b62fa5e6ac36b
Ni v Leanu: risba premice in simulacija kot sliki; pojmi poskus, izid, dogodek, slučajni dogodek kot
poimenovanja (dogodek je predikat na končni množici izidov Ω; Preveri se 1, »kaj je dogodek«, je
poimenovanje); »poštena kocka/kovanec, enako verjetni izidi« je model: P(A) = #ugodnih/#vseh je definicija
`P`, povezava z enakomerno porazdelitvijo je dokazana z Mathlibovo `Measure.uniformOfFinset` (vsak izid
ima verjetnost 1/#Ω, dogodek #ugodnih/#Ω); »pri zelo veliko poskusih je relativna frekvenca blizu
verjetnosti« (zakon velikih števil; Mathlib ima splošni `ProbabilityTheory.strong_law_ae`, prenos na kocko
in kolo je zahteven, še ni dokazan), »kocka/kolo si ne zapomni« in »po šestih praznih vrtenjih je še
vedno 1/4« (neodvisnost ponovitev, ni formalizirana; dokazano je le, da je pri vsakem vrtenju P = 2/8),
»8 ali 13 šestic je običajno«, »45 ali 56 šestic je običajno« in »pri 6000 metih bližje« (statistične
ocene, niso formalizirane; dokazano je pričakovano število 60·1/6 = 10 in 300·1/6 = 50), srečke brez
vračanja (omenjene v oklepaju); zgodba z Luko kot zgodba (dokazana sta računa 100/400 = 1/4 in
400/2 = 200); postopek v korakih kot navodilo; besedilo napačnih odgovorov (dokazano je, da napačne vrednosti
niso pravilne). Odstotki so zapisani kot ulomki (25 % = 25/100), približki kot |točna − približek| < pol
enote zadnjega mesta. Lean deli z 0 kot x/0 = 0, zato imajo pravila pogoj, da je Ω neprazna.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.Verjetnost

/-- Razlaga 4: verjetnost dogodka p pri enako verjetnih izidih iz končne množice Ω:
P = (število ugodnih izidov)/(število vseh izidov). -/
def P {α : Type*} (Ω : Finset α) (p : α → Prop) [DecidablePred p] : ℚ :=
  ((Ω.filter p).card : ℚ) / Ω.card

/-! ## Razlaga 4–6: splošna pravila -/

open scoped Classical in
/-- Razlaga 4 (enako verjetni izidi): pri enakomerni porazdelitvi na Ω ima vsak izid verjetnost 1/#Ω, dogodek
t pa #(ugodnih)/#Ω; to je formula P(A) = ugodni/vsi.
trditev: MAT-OS-9/verjetnost#enakomerna
besedilo: »Če so vsi izidi poskusa enako verjetni, je verjetnost dogodka $A$: $$P(A) = \frac{\text{število ugodnih izidov}}{\text{število vseh izidov}}$$« -/
theorem enakomerna {α : Type*} [MeasurableSpace α] [MeasurableSingletonClass α] (Ω : Finset α) (a : α)
    (ha : a ∈ Ω) (t : Set α) :
    MeasureTheory.Measure.uniformOfFinset Ω {a} = (Ω.card : ENNReal)⁻¹ ∧
      MeasureTheory.Measure.uniformOfFinset Ω t = ((Ω.filter (· ∈ t)).card : ENNReal) / Ω.card :=
  ⟨MeasureTheory.Measure.uniformOfFinset_apply_singleton_of_mem ha,
    MeasureTheory.Measure.uniformOfFinset_apply t⟩

/-- Predpostavka `enakomerna` se da izpolniti (Ω = {1, …, 6}, a = 6). -/
example : (6:ℕ) ∈ Finset.Icc 1 6 := by decide

/-- Razlaga 5 in Povzetek: 0 ≤ P(A) ≤ 1.
trditev: MAT-OS-9/verjetnost#med-0-in-1
besedilo: »Ugodnih izidov ni nikoli manj kot $0$ in nikoli več kot vseh, zato je $$0 \le P(A) \le 1$$« -/
theorem med_0_in_1 {α : Type*} (Ω : Finset α) (p : α → Prop) [DecidablePred p] :
    0 ≤ P Ω p ∧ P Ω p ≤ 1 := by
  unfold P
  refine ⟨by positivity, div_le_one_of_le₀ ?_ (by positivity)⟩
  exact_mod_cast Finset.card_filter_le Ω p

/-- Razlaga 3 in Povzetek: nemogoč dogodek (ne zgodi se pri nobenem izidu) ima verjetnost 0.
trditev: MAT-OS-9/verjetnost#nemogoc
besedilo: »nemogoč dogodek ima $0$« -/
theorem nemogoc {α : Type*} (Ω : Finset α) (p : α → Prop) [DecidablePred p] (h : ∀ x ∈ Ω, ¬ p x) :
    P Ω p = 0 := by
  unfold P
  rw [Finset.filter_false_of_mem h]
  simp

/-- Predpostavka `nemogoc` se da izpolniti (»pade 7« pri kocki). -/
example : ∀ x ∈ Finset.Icc 1 6, ¬ x = 7 := by decide

/-- Razlaga 3 in Povzetek: gotov dogodek (zgodi se pri vsakem izidu) ima verjetnost 1 (Ω neprazna).
trditev: MAT-OS-9/verjetnost#gotov
besedilo: »gotov $1$«
besedilo-kratko: Povzetek pove »gotov dogodek ima verjetnost 1« le kot »gotov $1$« za vejico; daljši izsek bi trdil še nemogoč dogodek -/
theorem gotov {α : Type*} (Ω : Finset α) (hΩ : Ω.Nonempty) (p : α → Prop) [DecidablePred p]
    (h : ∀ x ∈ Ω, p x) : P Ω p = 1 := by
  unfold P
  rw [Finset.filter_true_of_mem h]
  have : (Ω.card : ℚ) ≠ 0 := by exact_mod_cast hΩ.card_pos.ne'
  exact div_self this

/-- Predpostavke `gotov` se dajo izpolniti (»izvlečem kupon« iz 40 kuponov). -/
example : (Finset.range 40).Nonempty ∧ ∀ x ∈ Finset.range 40, x < 40 :=
  ⟨⟨0, by simp⟩, fun x hx => Finset.mem_range.mp hx⟩

/-- Razlaga 6 in Povzetek: P(ne A) = 1 − P(A) (Ω neprazna).
trditev: MAT-OS-9/verjetnost#nasprotni
besedilo: »Ugodni so zanj vsi izidi, ki za $A$ niso ugodni, zato $$P(\text{ne } A) = 1 - P(A)$$« -/
theorem nasprotni {α : Type*} (Ω : Finset α) (hΩ : Ω.Nonempty) (p : α → Prop) [DecidablePred p] :
    P Ω (fun x => ¬ p x) = 1 - P Ω p := by
  unfold P
  have hc := Finset.card_filter_add_card_filter_not (s := Ω) p
  have : (Ω.card : ℚ) ≠ 0 := by exact_mod_cast hΩ.card_pos.ne'
  rw [eq_sub_iff_add_eq, ← add_div, div_eq_one_iff_eq this, add_comm]
  exact_mod_cast hc

/-- Predpostavka `nasprotni` se da izpolniti (Ω = 40 kuponov). -/
example : (Finset.range 40).Nonempty := ⟨0, by simp⟩

/-! ## Uvod in Razlaga 1: kolo sreče in škatla -/

/-- Kolo sreče z 8 polji, dobitni polji 0 in 1. -/
abbrev kolo : Finset ℕ := Finset.range 8

/-- Zakaj se tega učimo, Razlaga 1 in 4: P(darilo) = 2/8 = 1/4, P(ne dobim) = 6/8 = 3/4 ≠ 1/2 (»dobim« in
»ne dobim« nista enako verjetna).
trditev: MAT-OS-9/verjetnost#kolo-darilo
besedilo: »Napaka je v tem, da »dobim« in »ne dobim« nista **enako verjetni** možnosti: »ne dobim« pokrije $6$ polj, »dobim« samo $2$.« -/
theorem kolo_darilo : P kolo (fun x => x < 2) = 2 / 8 ∧ (2:ℚ) / 8 = 1 / 4 ∧
    P kolo (fun x => ¬ x < 2) = 6 / 8 ∧ (6:ℚ) / 8 = 3 / 4 ∧ (3:ℚ) / 4 ≠ 1 / 2 := by
  refine ⟨?_, by norm_num, ?_, by norm_num, by norm_num⟩
  · rw [P, show (kolo.filter fun x => x < 2).card = 2 from by decide,
      show kolo.card = 8 from by decide]
    norm_num
  · rw [P, show (kolo.filter fun x => ¬ x < 2).card = 6 from by decide,
      show kolo.card = 8 from by decide]
    norm_num

/-- Zakaj se tega učimo, Razlaga 4: škatla 10/40 = 1/4 = kolo 2/8; 80 vrtenj · 1/4 = 20, ne 40.
trditev: MAT-OS-9/verjetnost#skatla
besedilo: »A pri škatli je dobitna četrtina kuponov ($10$ od $40$), pri kolesu pa četrtina polj ($2$ od $8$). Možnosti so enake.« -/
theorem skatla : (10:ℚ) / 40 = 1 / 4 ∧ (10:ℚ) / 40 = 2 / 8 ∧ (80:ℚ) * (1 / 4) = 20 ∧ (20:ℚ) ≠ 40 := by
  norm_num

/-- Razlaga 4, Premisli: kolo X 1/4 in kolo Y 3/12 sta enako verjetna.
trditev: MAT-OS-9/verjetnost#kolesi-xy
besedilo: »Pri obeh enako: $\dfrac{1}{4} = \dfrac{3}{12}$.« -/
theorem kolesi_xy : (1:ℚ) / 4 = 3 / 12 := by norm_num

/-! ## Razlaga 3 in 5: kocka, tabela -/

/-- Kocka z izidi 1, …, 6. -/
abbrev kocka : Finset ℕ := Finset.Icc 1 6

/-- Razlaga 2 in 3: pri kocki je 6 izidov; za »pade sodo število« so ugodni natanko 2, 4, 6; »pade 7« je
nemogoč (P = 0).
trditev: MAT-OS-9/verjetnost#kocka-dogodki
besedilo: »Za »pade sodo število« so ugodni izidi $2$, $4$ in $6$.« -/
theorem kocka_dogodki : kocka.card = 6 ∧ kocka.filter (fun x => x % 2 = 0) = {2, 4, 6} ∧
    P kocka (fun x => x = 7) = 0 := by
  refine ⟨by decide, by decide, nemogoc _ _ (by decide)⟩

/-- Razlaga 5 (tabela): 0/40 = 0, 10/40 = 0,25, 1/2 = 0,5, 40/40 = 1; 1/4 = 0,25 = 25 %.
trditev: MAT-OS-9/verjetnost#tabela
besedilo: »Verjetnost zapišemo kot ulomek, decimalno število ali v odstotkih: $\dfrac{1}{4} = 0{,}25 = 25\,\%$.« -/
theorem tabela : (0:ℚ) / 40 = 0 ∧ (10:ℚ) / 40 = 0.25 ∧ (1:ℚ) / 2 = 0.5 ∧ (40:ℚ) / 40 = 1 ∧
    (1:ℚ) / 4 = 0.25 ∧ (0.25:ℚ) = 25 / 100 := by norm_num

/-- Razlaga 6: P(brez popusta) = 1 − 1/4 = 3/4.
trditev: MAT-OS-9/verjetnost#brez-popusta
besedilo: »Pri škatli: $P(\text{brez popusta}) = 1 - \dfrac{1}{4} = \dfrac{3}{4}$.« -/
theorem brez_popusta : (1:ℚ) - 1 / 4 = 3 / 4 := by norm_num

/-! ## Razlaga 7: relativna frekvenca -/

/-- Razlaga 7: relativna frekvenca f/n pri 0 ≤ f ≤ n je med 0 in 1.
pomozno – lekcija ne pove, da je relativna frekvenca med 0 in 1 (le definicija f/n) -/
theorem relativna_frekvenca (f n : ℕ) (h : f ≤ n) : 0 ≤ (f : ℚ) / n ∧ (f : ℚ) / n ≤ 1 :=
  ⟨by positivity, div_le_one_of_le₀ (by exact_mod_cast h) (by positivity)⟩

/-- Predpostavka `relativna_frekvenca` se da izpolniti (f = 13, n = 60). -/
example : 13 ≤ 60 := by decide

/-- Razlaga 7, Premisli; Pogoste napake 5; Korak za korakom: pričakovano 60·1/6 = 10 šestic; 13/60 ≈ 0,217 in
1/6 ≈ 0,167 (na 0,0005); 13/60 ≠ 1/6.
trditev: MAT-OS-9/verjetnost#sestice
besedilo: »| $60$ | $13$ | $\dfrac{13}{60} \approx 0{,}217$ | $\dfrac{1}{6} \approx 0{,}167$ |« -/
theorem sestice :
    (60:ℚ) * (1 / 6) = 10 ∧ |(13:ℚ) / 60 - 0.217| < 0.0005 ∧ |(1:ℚ) / 6 - 0.167| < 0.0005 ∧
      (13:ℚ) / 60 ≠ 1 / 6 := by
  refine ⟨by norm_num, by norm_num [abs_lt], by norm_num [abs_lt], by norm_num⟩

/-! ## Rešeni primeri -/

/-- Primer 1: ugodna izida za »večje od 4« sta natanko 5 in 6; P = 2/6 = 1/3 ∈ [0, 1]; ≈ 33 %.
trditev: MAT-OS-9/verjetnost#primer1
besedilo: »Verjetnost je $\dfrac{1}{3}$, približno $33\,\%$.« -/
theorem primer1 :
    kocka.filter (fun x => 4 < x) = {5, 6} ∧ P kocka (fun x => 4 < x) = 2 / 6 ∧ (2:ℚ) / 6 = 1 / 3 ∧
      (0:ℚ) ≤ 1 / 3 ∧ (1:ℚ) / 3 ≤ 1 ∧ |(1:ℚ) / 3 - 33 / 100| < 1 / 200 := by
  refine ⟨by decide, ?_, by norm_num, by norm_num, by norm_num, by norm_num [abs_lt]⟩
  rw [P, show (kocka.filter fun x => 4 < x).card = 2 from by decide, show kocka.card = 6 from by decide]
  norm_num

/-- Primer 2: 24 + 10 + 5 + 1 = 40, ugodnih 10 + 5 + 1 = 16, P = 16/40 = 2/5 = 0,4 = 40 %; preizkus
24/40 = 3/5 in 1 − 3/5 = 2/5.
trditev: MAT-OS-9/verjetnost#primer2
besedilo: »Kupec dobi popust ali bon z verjetnostjo $\dfrac{2}{5}$, to je $40\,\%$.« -/
theorem primer2 :
    24 + 10 + 5 + 1 = 40 ∧ 10 + 5 + 1 = 16 ∧ (16:ℚ) / 40 = 2 / 5 ∧ (2:ℚ) / 5 = 0.4 ∧ (0.4:ℚ) = 40 / 100 ∧
      (24:ℚ) / 40 = 3 / 5 ∧ (1:ℚ) - 3 / 5 = 2 / 5 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Primer 3: s 5 dobitnimi in x praznimi srečkami je P = 5/(5 + x) = 1/8 natanko pri x = 35 (vseh 8·5 = 40,
praznih 40 − 5 = 35); preizkus 5/40 = 1/8.
trditev: MAT-OS-9/verjetnost#primer3
besedilo: »Trgovec mora dodati $35$ praznih srečk.« -/
theorem primer3 (x : ℕ) :
    ((5:ℚ) / (5 + x) = 1 / 8 ↔ x = 35) ∧ 8 * 5 = 40 ∧ 40 - 5 = 35 ∧ (5:ℚ) / 40 = 1 / 8 := by
  refine ⟨⟨fun h => ?_, fun h => by subst h; norm_num⟩, by norm_num, by norm_num, by norm_num⟩
  have hpos : (5:ℚ) + x ≠ 0 := by positivity
  rw [div_eq_div_iff hpos (by norm_num)] at h
  have : (x:ℚ) = 35 := by linarith
  exact_mod_cast this

/-- Dva kovanca: izidi (prvi, drugi), true = grb. -/
abbrev kovanca : Finset (Bool × Bool) := Finset.univ

/-- Primer 4 in Premisli; Pogoste napake 2: vseh izidov je 4, »natanko en grb« ima ugodna GC in CG, P = 2/4 =
1/2; »0 grbov« in »2 grba« imata vsak 1/4, zato »0, 1, 2 grba« niso enako verjetni in 1/3 ni pravilno.
trditev: MAT-OS-9/verjetnost#primer4
besedilo: »Ugodna sta GC in CG, torej $2$ od $4$: $P = \dfrac{2}{4} = \dfrac{1}{2}$. Kdor šteje samo »$0$, $1$ ali $2$ grba«, dobi napačno $\dfrac{1}{3}$, ker ti trije izidi niso enako verjetni.« -/
theorem primer4 :
    kovanca.card = 4 ∧ kovanca.filter (fun x => x.1 ≠ x.2) = {(true, false), (false, true)} ∧
      P kovanca (fun x => x.1 ≠ x.2) = 2 / 4 ∧ (2:ℚ) / 4 = 1 / 2 ∧
      P kovanca (fun x => x.1 = false ∧ x.2 = false) = 1 / 4 ∧
      P kovanca (fun x => x.1 = true ∧ x.2 = true) = 1 / 4 ∧ (1:ℚ) / 3 ≠ 1 / 2 := by
  refine ⟨by decide, by decide, ?_, by norm_num, ?_, ?_, by norm_num⟩
  · rw [P, show (kovanca.filter fun x => x.1 ≠ x.2).card = 2 from by decide,
      show kovanca.card = 4 from by decide]
    norm_num
  · rw [P, show (kovanca.filter fun x => x.1 = false ∧ x.2 = false).card = 1 from by decide,
      show kovanca.card = 4 from by decide]
    norm_num
  · rw [P, show (kovanca.filter fun x => x.1 = true ∧ x.2 = true).card = 1 from by decide,
      show kovanca.card = 4 from by decide]
    norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 3, Preveri se 4: 15 dobitnih in 45 praznih: P = 15/60 = 1/4, ne 15/45 = 1/3.
trditev: MAT-OS-9/verjetnost#napaka-imenovalec
besedilo: »Pri $15$ dobitnih in $45$ praznih kuponih verjetnost ni $\dfrac{15}{45}$. V imenovalcu so **vsi** izidi: $\dfrac{15}{60} = \dfrac{1}{4}$.« -/
theorem napaka_imenovalec : (15:ℚ) / (15 + 45) = 1 / 4 ∧ (15:ℚ) / 45 = 1 / 3 ∧ (1:ℚ) / 4 ≠ 1 / 3 := by
  norm_num

/-- Pogoste napake 3: obrnjen ulomek da več kot 1: pri 0 < a < n je n/a > 1.
pomozno – lekcija pove obrat (»če dobiš več od 1, si ulomek obrnil«), izrek pa, da obrnjen ulomek a < n da n/a > 1 -/
theorem obrnjen_ulomek (a n : ℚ) (ha : 0 < a) (h : a < n) : 1 < n / a := (one_lt_div ha).mpr h

/-- Predpostavke `obrnjen_ulomek` se dajo izpolniti (a = 15, n = 60). -/
example : (0:ℚ) < 15 ∧ (15:ℚ) < 60 := by norm_num

/-! ## Drugače: Kot zgodba, Korak za korakom -/

/-- Kot zgodba: 100/400 = 1/4 = 2/8, pri pol-pol bi bilo 400/2 = 200 daril.
trditev: MAT-OS-9/verjetnost#zgodba
besedilo: »Luka je izračunal: $\dfrac{100}{400} = \dfrac{1}{4}$.« -/
theorem zgodba : (100:ℚ) / 400 = 1 / 4 ∧ (2:ℚ) / 8 = 1 / 4 ∧ (400:ℚ) / 2 = 200 := by norm_num

/-- Korak za korakom: praštevila med 1, …, 6 so natanko 2, 3, 5 (1 ni praštevilo); P = 3/6 = 1/2.
trditev: MAT-OS-9/verjetnost#prastevila
besedilo: »Ugodni izidi so $2$, $3$ in $5$, vseh je $6$: $P = \dfrac{3}{6} = \dfrac{1}{2}$.« -/
theorem prastevila :
    kocka.filter Nat.Prime = {2, 3, 5} ∧ ¬ Nat.Prime 1 ∧ P kocka Nat.Prime = 3 / 6 ∧ (3:ℚ) / 6 = 1 / 2 := by
  have hf : kocka.filter Nat.Prime = {2, 3, 5} := by decide
  refine ⟨hf, Nat.not_prime_one, ?_, by norm_num⟩
  rw [P, hf, show kocka.card = 6 from by decide]
  norm_num

/-! ## Preveri se -/

/-- Preveri se 1: dogodek »kazalec se ustavi na dobitnem polju« ima 2 ugodna izida od 8, P = 1/4.
trditev: MAT-OS-9/verjetnost#preveri1
besedilo: »Zanj sta ugodna $2$ izida od $8$, zato je njegova verjetnost $\dfrac{1}{4}$.« -/
theorem preveri1 : (kolo.filter fun x => x < 2).card = 2 ∧ kolo.card = 8 ∧ P kolo (fun x => x < 2) = 1 / 4 := by
  refine ⟨by decide, by decide, ?_⟩
  rw [kolo_darilo.1]
  norm_num

/-- Preveri se 2: P(C) = 3/20 = 0,15 < P(A) = 1/6 < P(B) = 1/2; 1/6 ≈ 0,167. Pri kocki je P(6) = 1/6.
trditev: MAT-OS-9/verjetnost#preveri2
besedilo: »$P(C) = \dfrac{3}{20} = 0{,}15$, $P(A) = \dfrac{1}{6} \approx 0{,}167$, $P(B) = \dfrac{1}{2} = 0{,}5$.« -/
theorem preveri2 :
    (3:ℚ) / 20 = 0.15 ∧ (3:ℚ) / 20 < 1 / 6 ∧ (1:ℚ) / 6 < 1 / 2 ∧ |(1:ℚ) / 6 - 0.167| < 0.0005 ∧
      P kocka (fun x => x = 6) = 1 / 6 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num [abs_lt], ?_⟩
  rw [P, show (kocka.filter fun x => x = 6).card = 1 from by decide, show kocka.card = 6 from by decide]
  norm_num

/-- Preveri se 3: 5/(5 + 15) = 1/4, 5/(5 + 15 + 5) = 1/5 < 1/4; splošno: več vseh pri istih ugodnih ⇒ manjša
verjetnost (a/(n + m) < a/n pri a, n, m > 0).
trditev: MAT-OS-9/verjetnost#preveri3
besedilo: »Prej $\dfrac{5}{20} = \dfrac{1}{4}$, potem $\dfrac{5}{25} = \dfrac{1}{5}$. Ugodnih je enako, vseh več, zato je delež manjši.« -/
theorem preveri3 :
    (5:ℚ) / (5 + 15) = 1 / 4 ∧ (5:ℚ) / (5 + 15 + 5) = 1 / 5 ∧ (1:ℚ) / 5 < 1 / 4 ∧
      ∀ a n m : ℚ, 0 < a → 0 < n → 0 < m → a / (n + m) < a / n := by
  refine ⟨by norm_num, by norm_num, by norm_num, fun a n m ha hn hm => ?_⟩
  exact div_lt_div_of_pos_left ha hn (by linarith)

/-- Preveri se 4: brez popusta 60 − 15 = 45 kuponov, P = 45/60 = 3/4 = 1 − 15/60; napačni 1/4, 1/2, 1/3.
trditev: MAT-OS-9/verjetnost#preveri4
besedilo: »Brez popusta je $60 - 15 = 45$ kuponov, zato $P = \dfrac{45}{60} = \dfrac{3}{4}$. Enako dobimo z $1 - \dfrac{15}{60}$.« -/
theorem preveri4 :
    60 - 15 = 45 ∧ (45:ℚ) / 60 = 3 / 4 ∧ (1:ℚ) - 15 / 60 = 3 / 4 ∧ (3:ℚ) / 4 ≠ 1 / 4 ∧ (3:ℚ) / 4 ≠ 1 / 2 ∧
      (3:ℚ) / 4 ≠ 1 / 3 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 5: pričakujemo 1/6·300 = 50 šestic (ne 150 in ne 6); »ne šestica« ima 5 izidov od 6.
trditev: MAT-OS-9/verjetnost#preveri5
besedilo: »$P(6) = \dfrac{1}{6}$, zato pričakujemo približno $\dfrac{1}{6} \cdot 300 = 50$ šestic.« -/
theorem preveri5 :
    (1:ℚ) / 6 * 300 = 50 ∧ (kocka.filter fun x => ¬ x = 6).card = 5 ∧ (50:ℚ) ≠ 150 ∧ (50:ℚ) ≠ 6 := by
  refine ⟨by norm_num, by decide, by norm_num, by norm_num⟩

end Evklid.Lekcije.MAT_OS_9.Verjetnost
