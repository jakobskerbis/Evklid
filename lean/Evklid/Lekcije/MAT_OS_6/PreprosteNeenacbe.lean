/-
vir: content/lessons/MAT-OS-6/preproste-neenacbe.md
sha256: 2e187a585f6920ecf9b73fcd8971d4c5f39f9f6dcaed444d8b23678775266592
Model: lekcija šteje med naravna števila 1, 2, 3, … (brez 0), v Leanu pa ℕ vsebuje 0; zato je »x je naravno število«
zapisano kot `x : ℕ` s pogojem `1 ≤ x`, množica rešitev pa kot `x ∈ {…}` (končna) ali `x ∈ Set.Ici m` (»{m, m + 1,
…}«, neskončna). Vse neenačbe imajo obliko x + b (?) c ali a·x (?) c, zato v ℕ ni odštevanja ali deljenja z ostankom:
meja c − b je zapisana s pogojem m + b = c (izrek `meja`), meja z deljenjem (4,4; 7,5; 4,5) in x : 3 sta računana v ℚ.
Višina vozila v kvizu 1 je realno število.
Ni v Leanu: postopek v štirih korakih kot navodilo (dokazana so pravila, na katerih sloni: meja iz enačbe, stran,
meja sama pri ≤/≥ in </>, končno/neskončno mnogo rešitev); tabela »Beremo / V besedilu« (pomen besed »največ«,
»vsaj«, »manj kot«, »več kot« je dogovor; dokazano je, kaj vsak znak vključi); risba številske premice in simulacija
»Neenačba na številski premici« (dokazani so izpisi za x = 5, 6, 7 pri x + 2 ≤ 8); zgodbe (kombi, pohod, avtobus,
kolesarji, Jakob, Dunaj) so okvir neenačb.
Napačni odgovori kvizov: dokazano je, da napačne vrednosti niso pravilne.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.PreprosteNeenacbe

/-! ## Razlaga 1–2: enačba da le mejo, množica rešitev -/

/-- Razlaga 1 (tabela): x = 3, 5, 7 da x + 2 = 5, 7, 9 (največ 9), x = 8 da 10 (ne).
trditev: MAT-OS-6/preproste-neenacbe#tabela-kombi
besedilo: »| $8$ | $10$ | ne, en sedež premalo |« -/
theorem tabela_kombi : 3 + 2 = 5 ∧ 5 ≤ 9 ∧ 5 + 2 = 7 ∧ 7 ≤ 9 ∧ 7 + 2 = 9 ∧ 9 ≤ 9 ∧ 8 + 2 = 10 ∧ ¬ 10 ≤ 9 := by
  decide

/-- Razlaga 2 in Zakaj se tega učimo: naravne rešitve neenačbe x + 2 ≤ 9 so natanko 1, 2, …, 7.
trditev: MAT-OS-6/preproste-neenacbe#kombi
besedilo: »Za kombi je množica rešitev $\{1, 2, 3, 4, 5, 6, 7\}$.« -/
theorem kombi (x : ℕ) : (1 ≤ x ∧ x + 2 ≤ 9) ↔ x ∈ ({1, 2, 3, 4, 5, 6, 7} : Finset ℕ) := by
  simp only [Finset.mem_insert, Finset.mem_singleton]; omega

/-- Razlaga 1 in Pogoste napake 1: 7 ni edina rešitev x + 2 ≤ 9 (tudi 5 in 3, 1), je le največja.
trditev: MAT-OS-6/preproste-neenacbe#najvecja
besedilo: »Število $7$ ni edini odgovor, je le **največji**.« -/
theorem najvecja :
    IsGreatest {x : ℕ | 1 ≤ x ∧ x + 2 ≤ 9} 7 ∧ {x : ℕ | 1 ≤ x ∧ x + 2 ≤ 9} ≠ {7} ∧ 5 + 2 ≤ 9 ∧ 3 + 2 ≤ 9 ∧
      1 + 2 ≤ 9 := by
  refine ⟨⟨by simp, fun x hx => by simp at hx; omega⟩, fun h => ?_, by decide, by decide, by decide⟩
  have : (5 : ℕ) ∈ {x : ℕ | 1 ≤ x ∧ x + 2 ≤ 9} := by simp
  rw [h] at this; simp at this

/-- Zakaj se tega učimo: v kombi lahko sede 7 učencev, lahko pa tudi 5 ali 1.
trditev: MAT-OS-6/preproste-neenacbe#kombi-vec
besedilo: »V kombi lahko sede $7$ učencev, lahko pa tudi $5$ ali $1$.« -/
theorem kombi_vec : 7 + 2 ≤ 9 ∧ 5 + 2 ≤ 9 ∧ 1 + 2 ≤ 9 := by decide

/-- Razlaga 2 in Povzetek: rešitev je lahko več ali neskončno mnogo (x + 2 ≤ 9 ima 7 rešitev, x + 3 > 10
neskončno mnogo).
trditev: MAT-OS-6/preproste-neenacbe#vec-resitev
besedilo: »Rešitev je vsako število, s katerim neenačba drži. Rešitev je lahko več ali neskončno mnogo.« -/
theorem vec_resitev :
    ({x : ℕ | 1 ≤ x ∧ x + 2 ≤ 9}).ncard = 7 ∧ ({x : ℕ | 1 ≤ x ∧ x + 3 > 10}).Infinite := by
  constructor
  · have : {x : ℕ | 1 ≤ x ∧ x + 2 ≤ 9} = ↑({1, 2, 3, 4, 5, 6, 7} : Finset ℕ) := by
      ext x; simp only [Set.mem_ofPred_eq, Finset.coe_insert, Finset.coe_singleton, Set.mem_insert_iff,
        Set.mem_singleton_iff]; omega
    rw [this, Set.ncard_coe_finset]; rfl
  · refine (Set.Ici_infinite 8).mono fun x hx => ?_
    simp only [Set.mem_Ici] at hx; simp only [Set.mem_ofPred_eq]; omega

/-! ## Razlaga 3–6: znaki, meja, stran, končno ali neskončno -/

/-- Razlaga 3, 5 (koraka 1 in 3) in Povzetek: če je m meja (m + b = c), so rešitve x + b ≤ c natanko x ≤ m,
x + b ≥ c natanko x ≥ m (meja spada zraven), x + b < c natanko x < m, x + b > c natanko x > m (meja ne spada
zraven).
trditev: MAT-OS-6/preproste-neenacbe#meja
besedilo: »Pri $\le$ in $\ge$ meja **spada** med rešitve, pri $<$ in $>$ ne.« -/
theorem meja (x m b c : ℕ) (h : m + b = c) :
    (x + b ≤ c ↔ x ≤ m) ∧ (x + b ≥ c ↔ x ≥ m) ∧ (x + b < c ↔ x < m) ∧ (x + b > c ↔ x > m) ∧ m + b ≤ c ∧
      m + b ≥ c ∧ ¬ m + b < c ∧ ¬ m + b > c := by
  omega

example := meja 3 7 2 9 (by norm_num)

/-- Razlaga 3 (premisli), Pogoste napake 2 in kviz 3: x + 2 < 9 ima rešitve 1, …, 6; 7 ni rešitev (9 < 9 ne drži),
8 tudi ne; množica izgubi 7 in ostane končna.
trditev: MAT-OS-6/preproste-neenacbe#manj-kot-9
besedilo: »Za $x + 2 < 9$ število $7$ ni več rešitev, ker $9 < 9$ ne drži. Rešitve so $\{1, 2, 3, 4, 5, 6\}$.« -/
theorem manj_kot_9 (x : ℕ) :
    ((1 ≤ x ∧ x + 2 < 9) ↔ x ∈ ({1, 2, 3, 4, 5, 6} : Finset ℕ)) ∧ ¬ (9 < 9) ∧ ¬ (8 + 2 < 9) ∧
      ((1 ≤ x ∧ x + 2 ≤ 9) ↔ (1 ≤ x ∧ x + 2 < 9) ∨ x = 7) := by
  simp only [Finset.mem_insert, Finset.mem_singleton]; omega

/-- Razlaga 3 (premisli): pri »manj kot 9« je pogoj x + 2 < 9; pri x = 7 dobimo 9 < 9, kar ne drži.
trditev: MAT-OS-6/preproste-neenacbe#premisli-manj-kot
besedilo: »Ne. Zdaj je pogoj $x + 2 < 9$. Pri $x = 7$ dobimo $9 < 9$, kar ne drži. Rešitve so $1, 2, 3, 4, 5, 6$.« -/
theorem premisli_manj_kot : 7 + 2 = 9 ∧ ¬ (7 + 2 < 9) := by decide

/-- Razlaga 4 in Pogoste napake 3: pri x + 3 > 10 je meja 7 (7 + 3 = 10); 5 + 3 = 8 in 8 > 10 ne drži;
8 + 3 = 11 > 10; nobeno od 1, …, 6 ni rešitev.
trditev: MAT-OS-6/preproste-neenacbe#nad-mejo
besedilo: »Prava stran je nad mejo: $8 + 3 = 11 > 10$.« -/
theorem nad_mejo : 7 + 3 = 10 ∧ 5 + 3 = 8 ∧ ¬ (8 > 10) ∧ 8 + 3 = 11 ∧ 11 > 10 ∧
    ∀ x, 1 ≤ x → x ≤ 6 → ¬ (x + 3 > 10) := by
  refine ⟨rfl, rfl, by decide, rfl, by decide, fun x _ h => by omega⟩

example := nad_mejo.2.2.2.2.2 6 (by norm_num) (by norm_num)

/-- Razlaga 4 in 6 (premisli): naravne rešitve x + 3 > 10 so natanko 8, 9, 10, …; ni največje rešitve (za vsako
rešitev je rešitev tudi naslednje število).
trditev: MAT-OS-6/preproste-neenacbe#vec-kot-10
besedilo: »Nima. Za vsako rešitev je tudi naslednje število rešitev, ker je $x + 3$ še večje. Zato pišemo $\{8, 9, 10, \dots\}$.« -/
theorem vec_kot_10 :
    (∀ x : ℕ, (1 ≤ x ∧ x + 3 > 10) ↔ x ∈ Set.Ici 8) ∧ (∀ x : ℕ, x + 3 > 10 → (x + 1) + 3 > 10) ∧
      ¬ ∃ m, IsGreatest {x : ℕ | 1 ≤ x ∧ x + 3 > 10} m := by
  refine ⟨fun x => by simp only [Set.mem_Ici]; omega, fun x h => by omega, ?_⟩
  rintro ⟨m, hm, hmax⟩
  have := hmax (show m + 1 ∈ {x : ℕ | 1 ≤ x ∧ x + 3 > 10} by simp only [Set.mem_ofPred_eq] at hm ⊢; omega)
  omega

example := vec_kot_10.2.1 8 (by norm_num)

/-- Razlaga 6: če so rešitve pod mejo, jih je končno mnogo, če so nad mejo, neskončno mnogo.
trditev: MAT-OS-6/preproste-neenacbe#koncno-neskoncno
besedilo: »Če so rešitve pod mejo, jih je med naravnimi števili končno mnogo, saj se ustavimo pri $1$. Če so nad mejo, jih je neskončno mnogo.« -/
theorem koncno_neskoncno (b c : ℕ) :
    {x : ℕ | 1 ≤ x ∧ x + b ≤ c}.Finite ∧ {x : ℕ | 1 ≤ x ∧ x + b < c}.Finite ∧
      {x : ℕ | 1 ≤ x ∧ x + b > c}.Infinite ∧ {x : ℕ | 1 ≤ x ∧ x + b ≥ c}.Infinite := by
  refine ⟨(Set.finite_le_nat c).subset fun x hx => ?_, (Set.finite_le_nat c).subset fun x hx => ?_,
    (Set.Ici_infinite (c + 1)).mono fun x hx => ?_, (Set.Ici_infinite (c + 1)).mono fun x hx => ?_⟩ <;>
    simp only [Set.mem_ofPred_eq, Set.mem_Ici] at hx ⊢ <;> omega

/-- Razlaga 5 (simulacija): pri x + 2 ≤ 8 sta x = 5 in x = 6 rešitvi, x = 7 ni.
trditev: MAT-OS-6/preproste-neenacbe#simulacija
besedilo: »Premikaj »preizkusi x« od $5$ do $7$ in beri, kdaj se izpis zamenja iz »je rešitev« v »ni rešitev«.« -/
theorem simulacija : 5 + 2 ≤ 8 ∧ 6 + 2 ≤ 8 ∧ ¬ (7 + 2 ≤ 8) := by decide

/-! ## Rešeni primeri -/

/-- Primer 1: meja 12 − 5 = 7; 1 + 5 = 6 < 12 (pod mejo); 7 + 5 = 12 < 12 ne drži; 6 + 5 = 11 < 12; naravne
rešitve x + 5 < 12 so natanko 1, …, 6 (0 ni naravno, Pogoste napake 5).
trditev: MAT-OS-6/preproste-neenacbe#primer-1
besedilo: »Odgovor: množica rešitev je $\{1, 2, 3, 4, 5, 6\}$.« -/
theorem primer1 (x : ℕ) :
    ((1 ≤ x ∧ x + 5 < 12) ↔ x ∈ ({1, 2, 3, 4, 5, 6} : Finset ℕ)) ∧ 12 - 5 = 7 ∧ 1 + 5 = 6 ∧ 6 < 12 ∧
      ¬ (7 + 5 < 12) ∧ 6 + 5 = 11 ∧ 11 < 12 := by
  refine ⟨by simp only [Finset.mem_insert, Finset.mem_singleton]; omega, by decide⟩

/-- Primer 2: x + 4 ≥ 7: meja 7 − 4 = 3; 1 + 4 = 5, 5 ≥ 7 ne drži (nad mejo); 3 + 4 = 7 ≥ 7; rešitve 3, 4, 5, ….
trditev: MAT-OS-6/preproste-neenacbe#primer-2
besedilo: »Odgovor: pred njimi so še vsaj $3$ postanki, množica rešitev je $\{3, 4, 5, \dots\}$.« -/
theorem primer2 (x : ℕ) :
    ((1 ≤ x ∧ x + 4 ≥ 7) ↔ x ∈ Set.Ici 3) ∧ 7 - 4 = 3 ∧ 1 + 4 = 5 ∧ ¬ (5 ≥ 7) ∧ 3 + 4 = 7 ∧ 7 ≥ 7 := by
  refine ⟨by simp only [Set.mem_Ici]; omega, by decide⟩

/-- Primer 3, Pogoste napake 4: 25·x ≥ 110: meja 110 : 25 = 4,4; 25·4 = 100 < 110, 25·5 = 125 ≥ 110; v 4 dneh
ostane 10 km; rešitve 5, 6, 7, …, najmanj 5 dni.
trditev: MAT-OS-6/preproste-neenacbe#primer-3
besedilo: »Odgovor: kolesarji potrebujejo najmanj $5$ dni.« -/
theorem primer3 (x : ℕ) :
    ((1 ≤ x ∧ 25 * x ≥ 110) ↔ x ∈ Set.Ici 5) ∧ IsLeast {x : ℕ | 1 ≤ x ∧ 25 * x ≥ 110} 5 ∧ (110 : ℚ) / 25 = 4.4 ∧
      25 * 4 = 100 ∧ ¬ (100 ≥ 110) ∧ 25 * 5 = 125 ∧ 125 ≥ 110 ∧ 110 - 100 = 10 := by
  refine ⟨by simp only [Set.mem_Ici]; omega, ⟨by simp, fun y hy => by simp at hy; omega⟩, by norm_num, by decide⟩

/-- Primer 4: x : 3 ≤ 8 (x naravno): meja 8·3 = 24; 3 : 3 = 1 ≤ 8; 24 : 3 = 8 ≤ 8, zato je 24 rešitev; rešitve so
natanko 1, …, 24, najdaljša pot 24 km.
trditev: MAT-OS-6/preproste-neenacbe#primer-4
besedilo: »Pot je lahko dolga od $1$ do $24\,\text{km}$: $\{1, 2, 3, \dots, 24\}$. Najdaljša pot meri $24\,\text{km}$.« -/
theorem primer4 (x : ℕ) :
    ((1 ≤ x ∧ (x : ℚ) / 3 ≤ 8) ↔ x ∈ Finset.Icc 1 24) ∧ IsGreatest {x : ℕ | 1 ≤ x ∧ (x : ℚ) / 3 ≤ 8} 24 ∧
      8 * 3 = 24 ∧ (3 : ℚ) / 3 = 1 ∧ (1 : ℚ) ≤ 8 ∧ (24 : ℚ) / 3 = 8 := by
  have key : ∀ y : ℕ, (y : ℚ) / 3 ≤ 8 ↔ y ≤ 24 := fun y => by
    rw [div_le_iff₀ (by norm_num)]; norm_cast
  refine ⟨by rw [key, Finset.mem_Icc], ⟨⟨by norm_num, by norm_num⟩, fun y hy => (key y).1 hy.2⟩, rfl, by norm_num,
    by norm_num, by norm_num⟩

/-! ## Drugače -/

/-- Kot zgodba in Zakaj se tega učimo (pohod): x + 4 ≤ 10 ima rešitve natanko 1, …, 6; 4 + 6 = 10 (meja),
2 + 4 ≤ 10; pri 7 km bi prehodili 11 km.
trditev: MAT-OS-6/preproste-neenacbe#pohod
besedilo: »Zapis zgodbe je neenačba $x + 4 \le 10$ z rešitvami $\{1, 2, 3, 4, 5, 6\}$.« -/
theorem pohod (x : ℕ) :
    ((1 ≤ x ∧ x + 4 ≤ 10) ↔ x ∈ ({1, 2, 3, 4, 5, 6} : Finset ℕ)) ∧ 4 + 6 = 10 ∧ 2 + 4 ≤ 10 ∧ 4 + 7 = 11 ∧
      ¬ (11 ≤ 10) := by
  refine ⟨by simp only [Finset.mem_insert, Finset.mem_singleton]; omega, by decide⟩

/-- Korak za korakom: x + 6 ≤ 10: meja 10 − 6 = 4; tabela 1 → 7, 3 → 9, 4 → 10 (da), 5 → 11, 8 → 14 (ne);
rešitve natanko 1, 2, 3, 4.
trditev: MAT-OS-6/preproste-neenacbe#korak
besedilo: »Tabela potrdi: rešitve so $\{1, 2, 3, 4\}$.« -/
theorem korak (x : ℕ) :
    ((1 ≤ x ∧ x + 6 ≤ 10) ↔ x ∈ ({1, 2, 3, 4} : Finset ℕ)) ∧ 10 - 6 = 4 ∧ 1 + 6 = 7 ∧ 7 ≤ 10 ∧ 3 + 6 = 9 ∧
      9 ≤ 10 ∧ 4 + 6 = 10 ∧ 10 ≤ 10 ∧ 5 + 6 = 11 ∧ ¬ (11 ≤ 10) ∧ 8 + 6 = 14 ∧ ¬ (14 ≤ 10) := by
  refine ⟨by simp only [Finset.mem_insert, Finset.mem_singleton]; omega, by decide⟩

/-! ## Preveri se -/

/-- Kviz 1: »največ 3 m« je v ≤ 3: vključuje v < 3 in v = 3; v < 3, v ≥ 3 in v = 3 niso isti pogoj.
trditev: MAT-OS-6/preproste-neenacbe#kviz-1
besedilo: »»Največ« pomeni manjše ali enako, torej $v \le 3$. Mimo smejo vsa vozila do vključno $3\,\text{m}$.« -/
theorem kviz1 (v : ℝ) : (v ≤ 3 ↔ v < 3 ∨ v = 3) ∧ ¬ ((3 : ℝ) < 3) ∧ ¬ ((2 : ℝ) ≥ 3) ∧ (2 : ℝ) ≠ 3 ∧ (2 : ℝ) ≤ 3 :=
  ⟨le_iff_lt_or_eq, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Kviz 2: meja je povsod 4; A: x + 3 < 7 ima rešitve 1, 2, 3; B: x + 3 ≤ 7 ima 1, 2, 3, 4; C: x + 3 > 7 ima
5, 6, 7, … (neskončno mnogo); zato A, B, C.
trditev: MAT-OS-6/preproste-neenacbe#kviz-2
besedilo: »Meja je povsod $4$. A: $\{1, 2, 3\}$, B: $\{1, 2, 3, 4\}$, C: $\{5, 6, 7, \dots\}$, kar je neskončno mnogo.« -/
theorem kviz2 :
    4 + 3 = 7 ∧ (∀ x : ℕ, (1 ≤ x ∧ x + 3 < 7) ↔ x ∈ ({1, 2, 3} : Finset ℕ)) ∧
      (∀ x : ℕ, (1 ≤ x ∧ x + 3 ≤ 7) ↔ x ∈ ({1, 2, 3, 4} : Finset ℕ)) ∧
      (∀ x : ℕ, (1 ≤ x ∧ x + 3 > 7) ↔ x ∈ Set.Ici 5) ∧ ({x : ℕ | 1 ≤ x ∧ x + 3 > 7}).Infinite := by
  refine ⟨rfl, fun x => by simp only [Finset.mem_insert, Finset.mem_singleton]; omega,
    fun x => by simp only [Finset.mem_insert, Finset.mem_singleton]; omega, fun x => by simp only [Set.mem_Ici]; omega,
    (Set.Ici_infinite 5).mono fun x hx => ?_⟩
  simp only [Set.mem_Ici] at hx; simp only [Set.mem_ofPred_eq]; omega

/-- Kviz 4: največja naravna rešitev 4·x < 30 je 7; meja 30 : 4 = 7,5 (4·7,5 = 30, ni rešitev); 4·7 = 28 < 30,
4·8 = 32 ne; 26 ni rešitev.
trditev: MAT-OS-6/preproste-neenacbe#kviz-4
besedilo: »Meja: $30 : 4 = 7{,}5$. Preverimo sosednji naravni števili: $4 \cdot 7 = 28 < 30$ drži, $4 \cdot 8 = 32 < 30$ ne drži.« -/
theorem kviz4 :
    IsGreatest {x : ℕ | 1 ≤ x ∧ 4 * x < 30} 7 ∧ (30 : ℚ) / 4 = 7.5 ∧ (4 : ℚ) * 7.5 = 30 ∧ ¬ ((4 : ℚ) * 7.5 < 30) ∧
      4 * 7 = 28 ∧ 28 < 30 ∧ 4 * 8 = 32 ∧ ¬ (32 < 30) ∧ ¬ (4 * 26 < 30) := by
  refine ⟨⟨by simp, fun y hy => by simp at hy; omega⟩, by norm_num, by norm_num, by norm_num, by decide⟩

/-- Kviz 5: 60·x ≥ 270: meja 270 : 60 = 4,5; najmanj 5 ur (60·5 = 300 ≥ 270); v 4 urah 60·4 = 240 premalo;
270 − 60 = 210 ni pravilen odgovor (ni najmanjši).
trditev: MAT-OS-6/preproste-neenacbe#kviz-5
besedilo: »Neenačba je $60 \cdot x \ge 270$, meja $270 : 60 = 4{,}5$. Prvo naravno število nad mejo je $5$: $60 \cdot 5 = 300 \ge 270$.« -/
theorem kviz5 :
    IsLeast {x : ℕ | 1 ≤ x ∧ 60 * x ≥ 270} 5 ∧ (270 : ℚ) / 60 = 4.5 ∧ 60 * 5 = 300 ∧ 300 ≥ 270 ∧ 60 * 4 = 240 ∧
      ¬ (240 ≥ 270) ∧ 270 - 60 = 210 ∧ 210 ≠ 5 := by
  refine ⟨⟨by simp, fun y hy => by simp at hy; omega⟩, by norm_num, by decide⟩

end Evklid.Lekcije.MAT_OS_6.PreprosteNeenacbe
