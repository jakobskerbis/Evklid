/-
vir: content/lessons/MAT-OS-6/desetiski-ulomki-in-decimalna-stevila.md
sha256: 5b8115c7ce3bb847cfbe03750310f303c24107f84bf6e9ad9afb346af2a92a4d
Model: decimalno število s celim delom c : ℕ in števkami za vejico ds = [d₁, d₂, …, dₙ] (vsaka dᵢ < 10) ima
vrednost c + `zaVejico ds`, kjer je `zaVejico [d₁, …, dₙ] = d₁/10 + d₂/100 + … + dₙ/10ⁿ` (rekurzivno:
(d₁ + zaVejico [d₂, …]) / 10). `stevilo ds` je število, ki ga števke tvorijo brez vejice (npr. [0, 4, 5] ↦ 45).
Pravilo »število ničel v imenovalcu = število decimalnih mest« je dokazano v obe smeri: n števk za vejico da
ulomek z imenovalcem 10ⁿ (`nazaj_v_ulomek`), vsak ulomek m/10ⁿ pa ima zapis z natanko n števkami za vejico
(`ulomek_v_decimalno`, s celim delom m : 10ⁿ). Primerjanje po mestih je dokazano za ta model (`cela_odlocijo`,
`prvo_mesto_odloci`, `enako_mesto`). Konkretna števila so tudi Leanovi decimalni zapisi v ℝ (npr. (0.045 : ℝ)),
ki so točni ulomki (45/1000), ne plavajoča vejica. Enote (l, kg) so le v docstringih.
Lean: x/0 = 0 se ne uporablja (vsi imenovalci so potence 10, ki niso 0); naravna števila so v ℝ pretvorjena s
prisilo (↑), odštevanja v ℕ ni.
Ni v Leanu: merilni vrč, tehtnica, mreža s 100 kvadratki in številska premica kot slika (dokazani so njihovi
računi: 10 kvadratkov = 1 desetinka, 0,25 je sredina med 0,2 in 0,3, premik 0,3 → 0,35 je pol desetinke);
simulacija in risanje vrča (navodilo); imena »desetiški ulomek«, »decimalna vejica«, »celi del«, »decimalni del«,
»decimalno mesto« (definicije, ne trditve); »recepti, embalaža in tehtnice uporabljajo zapis z vejico« (opis);
mišljenje učenca v Pogostih napakah in zgodbi (dokazano je, da so njegovi zapisi napačni); kviz 3, prvi napačni
odgovor »ničle nikoli ne spremenijo vrednosti« je ovržen z 0,05 ≠ 0,5; kviz 2 »malo pred sredino, blizu 0,5«
je dokazan kot 0,4 < 0,48 < 0,5 in 0,5 − 0,48 = 0,02 (»blizu« ni natančen pojem); kviz 5 »ne moremo vedeti«
je ovržen z dokazano primerjavo.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.DesetiskiUlomkiInDecimalnaStevila

/-! ## Model decimalnega zapisa -/

/-- Vrednost števk za vejico: [d₁, d₂, …] ↦ d₁/10 + d₂/100 + … -/
noncomputable def zaVejico : List ℕ → ℝ
  | [] => 0
  | d :: ds => (d + zaVejico ds) / 10

/-- Število, ki ga števke tvorijo brez vejice: [d₁, …, dₙ] ↦ d₁·10ⁿ⁻¹ + … + dₙ. -/
def stevilo : List ℕ → ℕ
  | [] => 0
  | d :: ds => d * 10 ^ ds.length + stevilo ds

/-- Pomožno: števke za vejico s tremi mesti so d₁/10 + d₂/100 + d₃/1000.
pomozno – razpis definicije `zaVejico` za tri mesta -/
theorem zaVejico_tri (a b c : ℕ) :
    zaVejico [a, b, c] = (a : ℝ) / 10 + b / 100 + c / 1000 := by
  simp only [zaVejico]; ring

/-- Pomožno: vrednost števk za vejico je med 0 (vključno) in 1 (izključno), če je vsaka števka manjša od 10.
pomozno – meja ostanka za primerjanje po mestih -/
theorem zaVejico_meje (ds : List ℕ) (h : ∀ d ∈ ds, d < 10) : 0 ≤ zaVejico ds ∧ zaVejico ds < 1 := by
  induction ds with
  | nil => simp [zaVejico]
  | cons d ds ih =>
    have hd : d < 10 := h d (by simp)
    obtain ⟨h0, h1⟩ := ih (fun e he => h e (by simp [he]))
    have hd' : (d : ℝ) ≤ 9 := by exact_mod_cast Nat.le_of_lt_succ hd
    simp only [zaVejico]
    constructor
    · positivity
    · rw [div_lt_one (by norm_num)]; linarith

example := zaVejico_meje [2, 5] (by decide)

/-! ## Razlaga -/

/-- Razlaga (Nazaj v ulomek), Primer 2 (formula), Drugače (Recept B), Povzetek 4: decimalno število s celim delom c
in n števkami za vejico je ulomek, katerega števec je število brez vejice (c·10ⁿ + števke), imenovalec pa ima
toliko ničel, kolikor je decimalnih mest (10ⁿ).
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#nazaj-v-ulomek
besedilo: »Preštej decimalna mesta in zapiši imenovalec z enakim številom ničel. Števec je število brez vejice.« -/
theorem nazaj_v_ulomek (c : ℕ) (ds : List ℕ) :
    (c : ℝ) + zaVejico ds = ((c * 10 ^ ds.length + stevilo ds : ℕ) : ℝ) / 10 ^ ds.length := by
  have key : ∀ es : List ℕ, zaVejico es = (stevilo es : ℝ) / 10 ^ es.length := by
    intro es
    induction es with
    | nil => simp [zaVejico, stevilo]
    | cons d es ih =>
      simp only [zaVejico, stevilo, ih, List.length_cons]
      push_cast
      field_simp
      ring
  rw [key]
  push_cast
  field_simp

/-- Pomožno: vsak m < 10ⁿ je število brez vejice natanko n števk (spredaj po potrebi z ničlami).
pomozno – obstoj zapisa z n števkami, uporabljen v `ulomek_v_decimalno` -/
theorem stevke_obstajajo (n : ℕ) :
    ∀ m : ℕ, m < 10 ^ n → ∃ ds : List ℕ, ds.length = n ∧ (∀ d ∈ ds, d < 10) ∧ stevilo ds = m := by
  induction n with
  | zero =>
    intro m hm
    refine ⟨[], rfl, by simp, ?_⟩
    simp at hm; simp [stevilo, hm]
  | succ n ih =>
    intro m hm
    have hp : 0 < 10 ^ n := by positivity
    obtain ⟨ds, hl, hd, hs⟩ := ih (m % 10 ^ n) (Nat.mod_lt _ hp)
    refine ⟨(m / 10 ^ n) :: ds, by simp [hl], ?_, ?_⟩
    · intro d hd'
      rcases List.mem_cons.mp hd' with rfl | h
      · rw [Nat.div_lt_iff_lt_mul hp]; rw [pow_succ] at hm; linarith
      · exact hd d h
    · simp only [stevilo, hl, hs]
      exact Nat.div_add_mod' m (10 ^ n)

example := stevke_obstajajo 3 45 (by norm_num)

/-- Razlaga (Opazuj vzorec), Primer 1 (formula), Drugače (Recept A), Povzetek 3: ulomek z imenovalcem 10ⁿ (n ničel)
ima zapis z natanko n decimalnimi mesti: celi del c in n števk za vejico (vsaka manjša od 10, spredaj po potrebi
ničle).
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#nicle-mesta
besedilo: »Ničel v imenovalcu je natanko toliko, kolikor je števk za vejico.« -/
theorem ulomek_v_decimalno (m n : ℕ) :
    ∃ (c : ℕ) (ds : List ℕ), ds.length = n ∧ (∀ d ∈ ds, d < 10) ∧
      (c : ℝ) + zaVejico ds = (m : ℝ) / 10 ^ n := by
  have hp : 0 < 10 ^ n := by positivity
  obtain ⟨ds, hl, hd, hs⟩ := stevke_obstajajo n (m % 10 ^ n) (Nat.mod_lt _ hp)
  refine ⟨m / 10 ^ n, ds, hl, hd, ?_⟩
  rw [nazaj_v_ulomek, hl, hs, Nat.div_add_mod' m (10 ^ n)]

/-- Razlaga (Opazuj vzorec), tabela: 3/10 = 0,3; 25/100 = 0,25; 5/100 = 0,05; 125/1000 = 0,125, tudi v modelu
mest (0,05 ima števki [0, 5]).
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#tabela
besedilo: »Zadnja dva stolpca se v vsaki vrstici ujemata.« -/
theorem tabela :
    (3 : ℝ) / 10 = 0.3 ∧ (25 : ℝ) / 100 = 0.25 ∧ (5 : ℝ) / 100 = 0.05 ∧ (125 : ℝ) / 1000 = 0.125 ∧
      zaVejico [3] = 3 / 10 ∧ zaVejico [2, 5] = 25 / 100 ∧ zaVejico [0, 5] = 5 / 100 ∧
      zaVejico [1, 2, 5] = 125 / 1000 := by
  simp only [zaVejico]; norm_num

/-- Razlaga (Opazuj vzorec), tretja vrstica: pri 5/100 morata biti dve mesti, zato pred petico vpišemo ničlo:
0,05 = [0, 5], brez ničle pa bi bilo 0,5 = 5/10 ≠ 5/100.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#nicla-pred-petico
besedilo: »Zato pred petico vpišemo ničlo: $0{,}05$.« -/
theorem nicla_pred_petico : zaVejico [0, 5] = 5 / 100 ∧ zaVejico [5] ≠ 5 / 100 := by
  simp only [zaVejico]; norm_num

/-- Razlaga (Mestna tabela): vsako mesto je desetkrat večje od mesta desno od njega (1 = 10 · 1/10,
1/10 = 10 · 1/100, 1/100 = 10 · 1/1000); 2,375 kg = 2 + 3/10 + 7/100 + 5/1000.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#mestna-tabela
besedilo: »Moke je torej $2 + \dfrac{3}{10} + \dfrac{7}{100} + \dfrac{5}{1000}$ kilograma.« -/
theorem mestna_tabela :
    (1 : ℝ) = 10 * (1 / 10) ∧ (1 / 10 : ℝ) = 10 * (1 / 100) ∧ (1 / 100 : ℝ) = 10 * (1 / 1000) ∧
      (2.375 : ℝ) = 2 + 3 / 10 + 7 / 100 + 5 / 1000 ∧ (2 : ℝ) + zaVejico [3, 7, 5] = 2.375 := by
  simp only [zaVejico]; norm_num

/-- Premisli 1: 4/100 = 0,04 ([0, 4]); 0,4 = 4/10 je desetkrat več.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#premisli-1
besedilo: »Zapis $0{,}4$ bi pomenil $\dfrac{4}{10}$, kar je desetkrat več.« -/
theorem premisli1 :
    (4 : ℝ) / 100 = 0.04 ∧ zaVejico [0, 4] = 4 / 100 ∧ (0.4 : ℝ) = 4 / 10 ∧ (0.4 : ℝ) = 10 * 0.04 := by
  simp only [zaVejico]; norm_num

/-- Razlaga (Nazaj v ulomek): 0,35 = 35/100 in 1,5 = 15/10; kot mešano število 1,5 = 1 5/10.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#nazaj-primeri
besedilo: »Tako je $0{,}35 = \dfrac{35}{100}$ in $1{,}5 = \dfrac{15}{10}$.« -/
theorem nazaj_primeri : (0.35 : ℝ) = 35 / 100 ∧ (1.5 : ℝ) = 15 / 10 ∧ (1.5 : ℝ) = 1 + 5 / 10 := by
  norm_num

/-- Razlaga (Ničle na koncu), Povzetek 5: ničla na koncu decimalnega dela vrednosti ne spremeni (dopisana ničla
na koncu števk da isto vrednost).
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#nicle-na-koncu
besedilo: »Ničle na koncu decimalnega dela vrednosti ne spremenijo.« -/
theorem nicle_na_koncu (ds : List ℕ) : zaVejico (ds ++ [0]) = zaVejico ds := by
  induction ds with
  | nil => simp [zaVejico]
  | cons d ds ih => simp only [List.cons_append, zaVejico, ih]

/-- Razlaga (Ničle na koncu), Povzetek 5: ničla takoj za vejico vrednost spremeni: zmanjša jo na desetino.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#nicla-za-vejico
besedilo: »Ničla takoj za vejico pa jo spremeni: $0{,}05$ je desetkrat manj kot $0{,}5$.« -/
theorem nicla_za_vejico (ds : List ℕ) : zaVejico (0 :: ds) = zaVejico ds / 10 ∧
    zaVejico [0, 5] = zaVejico [5] / 10 := by
  simp only [zaVejico]; norm_num

/-- Razlaga (Ničle na koncu): 0,5 l in 0,50 l je ista voda: pet desetink je petdeset stotink.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#pol-litra
besedilo: »pet desetink je toliko kot petdeset stotink.« -/
theorem pol_litra : (0.5 : ℝ) = 0.50 ∧ (5 : ℝ) / 10 = 50 / 100 ∧ zaVejico [5, 0] = zaVejico [5] := by
  refine ⟨by norm_num, by norm_num, nicle_na_koncu [5]⟩

/-- Razlaga (Urejanje), korak 1: če je celi del manjši, je manjše število (ne glede na števke za vejico).
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#cela-odlocijo
besedilo: »Primerjaj cela dela.« -/
theorem cela_odlocijo (c c' : ℕ) (ds es : List ℕ) (hc : c < c') (hd : ∀ d ∈ ds, d < 10)
    (he : ∀ d ∈ es, d < 10) : (c : ℝ) + zaVejico ds < c' + zaVejico es := by
  have h1 := (zaVejico_meje ds hd).2
  have h2 := (zaVejico_meje es he).1
  have : (c : ℝ) + 1 ≤ c' := by exact_mod_cast hc
  linarith

example := cela_odlocijo 1 2 [9] [0] (by norm_num) (by decide) (by decide)

/-- Razlaga (Urejanje), korak 2: pri enakih celih delih odloči prvo mesto, na katerem se števki razlikujeta:
manjša števka da manjše število, ne glede na nadaljnje števke.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#prvo-mesto-odloci
besedilo: »Če sta enaka, primerjaj desetinke, nato stotinke, nato tisočinke.« -/
theorem prvo_mesto_odloci (a b : ℕ) (ds es : List ℕ) (hab : a < b) (hd : ∀ d ∈ ds, d < 10)
    (he : ∀ d ∈ es, d < 10) : zaVejico (a :: ds) < zaVejico (b :: es) := by
  have h1 := (zaVejico_meje ds hd).2
  have h2 := (zaVejico_meje es he).1
  have : (a : ℝ) + 1 ≤ b := by exact_mod_cast hab
  simp only [zaVejico]
  rw [div_lt_div_iff_of_pos_right (by norm_num)]
  linarith

example := prvo_mesto_odloci 1 3 [2, 5] [] (by norm_num) (by decide) (by decide)

/-- Razlaga (Urejanje), korak 2: če je števka na tem mestu enaka, odločijo naslednja mesta (primerjava se
prenese na ostanek).
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#enako-mesto
besedilo: »Decimalni števili primerjaš po mestih, od leve proti desni:« -/
theorem enako_mesto (a : ℕ) (ds es : List ℕ) :
    zaVejico (a :: ds) < zaVejico (a :: es) ↔ zaVejico ds < zaVejico es := by
  simp only [zaVejico]
  rw [div_lt_div_iff_of_pos_right (by norm_num)]
  constructor <;> intro h <;> linarith

/-- Razlaga (Urejanje, številska premica): 0,25 je sredina med 0,2 in 0,3, zato je 0,25 < 0,3, čeprav ima več
števk.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#premica
besedilo: »Zato je $0{,}25 < 0{,}3$, čeprav ima $0{,}25$ več števk.« -/
theorem premica : ((0.2 : ℝ) + 0.3) / 2 = 0.25 ∧ (0.2 : ℝ) < 0.25 ∧ (0.25 : ℝ) < 0.3 := by
  norm_num

/-- Premisli 2: 0,8 kg = 0,80 kg > 0,75 kg; odločijo desetinke (8 > 7).
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#premisli-2
besedilo: »Težji je $0{,}8\,\text{kg}$. Dopišemo ničlo: $0{,}80$ in $0{,}75$. Odločijo že desetinke, $8 > 7$.« -/
theorem premisli2 : (0.8 : ℝ) = 0.80 ∧ (0.75 : ℝ) < 0.80 ∧ zaVejico [7, 5] < zaVejico [8, 0] := by
  refine ⟨by norm_num, by norm_num, prvo_mesto_odloci 7 8 [5] [0] (by norm_num) (by decide) (by decide)⟩

/-- Razlaga (simulacija): en stolpec mreže (10 kvadratkov) je ena desetinka, en kvadratek ena stotinka; od 0,3 do
0,35 se točka premakne za pol desetinke.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#mreza
besedilo: »Na premici pod mrežo poglej, da se točka premakne le za pol desetinke naprej.« -/
theorem mreza : (10 : ℝ) * (1 / 100) = 1 / 10 ∧ (0.35 : ℝ) - 0.3 = 1 / 2 * (1 / 10) := by
  norm_num

/-! ## Rešeni primeri -/

/-- Primer 1, korak 1: 7/10 = 0,7 (ena ničla, eno decimalno mesto).
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#primer-1-mleko
besedilo: »Imenovalec $10$ ima eno ničlo, zato ima število eno decimalno mesto: $\dfrac{7}{10} = 0{,}7$.« -/
theorem primer1_mleko : (7 : ℝ) / 10 = 0.7 ∧ zaVejico [7] = 7 / 10 := by
  simp only [zaVejico]; norm_num

/-- Primer 1, koraka 2 in 3: 45/1000 = 0,045 (tri mesta, pred 45 ena ničla); preizkus z mestno tabelo:
0 desetink, 4 stotinke, 5 tisočink je skupaj 45 tisočink.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#primer-1-sladkor
besedilo: »$0{,}045$ ima $0$ desetink, $4$ stotinke in $5$ tisočink, skupaj $45$ tisočink.« -/
theorem primer1_sladkor : (45 : ℝ) / 1000 = 0.045 ∧ stevilo [0, 4, 5] = 45 ∧
    zaVejico [0, 4, 5] = 45 / 1000 := by
  refine ⟨by norm_num, by decide, ?_⟩
  calc zaVejico [0, 4, 5] = (0 : ℝ) / 10 + 4 / 100 + 5 / 1000 := by rw [zaVejico_tri]; norm_num
    _ = 45 / 1000 := by norm_num

/-- Primer 1, odgovor: na vrču 0,7 l, na tehtnici 0,045 kg.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#primer-1
besedilo: »Odgovor: na vrču odčitaš $0{,}7\,\text{l}$ mleka, na tehtnici $0{,}045\,\text{kg}$ sladkorja.« -/
theorem primer1 : (7 : ℝ) / 10 = 0.7 ∧ (45 : ℝ) / 1000 = 0.045 := by norm_num

/-- Primer 2, koraki 1–3: 0,35 = 35/100; 2,08 = 208/100 = 2 8/100 (nazaj v ulomek s celim delom 2 in
števkama [0, 8]).
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#primer-2
besedilo: »Odgovor: sira je $\dfrac{35}{100}\,\text{kg}$, juhe pa $\dfrac{208}{100}\,\text{l}$, kar je $2\dfrac{8}{100}\,\text{l}$.« -/
theorem primer2 : (0.35 : ℝ) = 35 / 100 ∧ (2.08 : ℝ) = 208 / 100 ∧ (208 : ℝ) / 100 = 2 + 8 / 100 ∧
    (2 : ℝ) + zaVejico [0, 8] = 208 / 100 := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  calc (2 : ℝ) + zaVejico [0, 8] = ((2 * 10 ^ 2 + stevilo [0, 8] : ℕ) : ℝ) / 10 ^ 2 := nazaj_v_ulomek 2 [0, 8]
    _ = 208 / 100 := by norm_num [stevilo]

/-- Primer 3, koraki 1–4: z ničlami do treh mest 0,300; 0,125; 0,200; 0,250 in 0,240; vrstni red
0,125 < 0,2 < 0,25 < 0,3 (desetinke 1 < 2 < 3, med 0,200 in 0,250 stotinke 0 < 5).
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#primer-3-red
besedilo: »Vrstni red: $0{,}125 < 0{,}2 < 0{,}25 < 0{,}3$.« -/
theorem primer3_red :
    (0.3 : ℝ) = 0.300 ∧ (0.2 : ℝ) = 0.200 ∧ (0.25 : ℝ) = 0.250 ∧ (0.24 : ℝ) = 0.240 ∧
      (0.125 : ℝ) < 0.2 ∧ (0.2 : ℝ) < 0.25 ∧ (0.25 : ℝ) < 0.3 ∧
      zaVejico [1, 2, 5] < zaVejico [2, 0, 0] ∧ zaVejico [2, 0, 0] < zaVejico [2, 5, 0] ∧
      zaVejico [2, 5, 0] < zaVejico [3, 0, 0] := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    prvo_mesto_odloci 1 2 _ _ (by norm_num) (by decide) (by decide),
    (enako_mesto 2 _ _).mpr (prvo_mesto_odloci 0 5 _ _ (by norm_num) (by decide) (by decide)),
    prvo_mesto_odloci 2 3 _ _ (by norm_num) (by decide) (by decide)⟩

/-- Primer 3, koraka 5 in 6: od štirih kosov imata vsaj 0,24 kg natanko kosa 0,25 kg in 0,3 kg; 0,2 kg in
0,125 kg ne zadoščata.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#primer-3-zadosca
besedilo: »Vsak zase zadoščata kosa z $0{,}25\,\text{kg}$ in $0{,}3\,\text{kg}$.« -/
theorem primer3_zadosca :
    (0.24 : ℝ) ≤ 0.3 ∧ (0.24 : ℝ) ≤ 0.25 ∧ ¬ (0.24 : ℝ) ≤ 0.2 ∧ ¬ (0.24 : ℝ) ≤ 0.125 := by
  norm_num

/-- Primer 4 in premisli: 6/100 = 0,06; 0,1 = 0,10; 0,06 < 0,1, zato kisa ni dovolj; manjka 0,04 l.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#primer-4
besedilo: »Velja $0{,}06 < 0{,}1$, zato kisa ni dovolj. Manjkajo še $4$ stotinke litra, to je $0{,}04\,\text{l}$.« -/
theorem primer4 : (6 : ℝ) / 100 = 0.06 ∧ (0.1 : ℝ) = 0.10 ∧ (0.06 : ℝ) < 0.1 ∧ (0.1 : ℝ) - 0.06 = 0.04 ∧
    zaVejico [0, 6] < zaVejico [1, 0] := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num,
    prvo_mesto_odloci 0 1 _ _ (by norm_num) (by decide) (by decide)⟩

/-! ## Pogoste napake -/

/-- Pogoste napake 1 in Povzetek 6: 0,125 < 0,3, čeprav je 125 > 3 (0,3 ima 3 desetinke, 0,125 le 1).
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#napaka-1
besedilo: »$0{,}3$ ima $3$ desetinke, $0{,}125$ le $1$.« -/
theorem napaka1 : (125 : ℕ) > 3 ∧ (0.125 : ℝ) < 0.3 ∧ (0.3 : ℝ) = 0.300 := by norm_num

/-- Pogoste napake 2: 0,45 = 45/100 ≠ 45/1000 = 0,045.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#napaka-2
besedilo: »Število decimalnih mest določi imenovalec: tri ničle, tri mesta, $0{,}045$.« -/
theorem napaka2 : (0.45 : ℝ) = 45 / 100 ∧ (0.45 : ℝ) ≠ 45 / 1000 ∧ (45 : ℝ) / 1000 = 0.045 := by norm_num

/-- Pogoste napake 3: 5/100 = 0,05; 0,5 je pet desetink, desetkrat preveč.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#napaka-3
besedilo: »To je pet desetink, desetkrat preveč. Petica mora stati na mestu stotink: $0{,}05$.« -/
theorem napaka3 : (5 : ℝ) / 100 = 0.05 ∧ (0.5 : ℝ) = 10 * (5 / 100) := by norm_num

/-- Pogoste napake 4: 2,35 = 235/100, ne 235/1000.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#napaka-4
besedilo: »Imenovalec določijo le mesta za vejico; dve mesti dasta $\dfrac{235}{100}$.« -/
theorem napaka4 : (2.35 : ℝ) = 235 / 100 ∧ (2.35 : ℝ) ≠ 235 / 1000 := by norm_num

/-- Pogoste napake 5: 0,50 ni večje od 0,5 (ničla na koncu vrednosti ne spremeni).
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#napaka-5
besedilo: »Toda pet desetink je toliko kot petdeset stotink; ničla na koncu vrednosti ne spremeni.« -/
theorem napaka5 : ¬ (0.5 : ℝ) < 0.50 ∧ (0.50 : ℝ) = 0.5 := by norm_num

/-- Povzetek 3: 45/1000 = 0,045.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#povzetek-3
besedilo: »Število ničel v imenovalcu je enako številu decimalnih mest: $\dfrac{45}{1000} = 0{,}045$.« -/
theorem povzetek3 : (45 : ℝ) / 1000 = 0.045 ∧ zaVejico [0, 4, 5] = 45 / 1000 := by
  simp only [zaVejico]; norm_num

/-- Povzetek 4: 2,08 = 208/100 = 2 8/100.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#povzetek-4
besedilo: »$2{,}08 = \dfrac{208}{100} = 2\dfrac{8}{100}$.« -/
theorem povzetek4 : (2.08 : ℝ) = 208 / 100 ∧ (208 : ℝ) / 100 = 2 + 8 / 100 := by norm_num

/-! ## Drugače -/

/-- Drugače, Recept A: 27/1000 ima tri mesta, 27 dobi spredaj eno ničlo: 0,027.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#recept-a
besedilo: »Spredaj zapiši še $0$ in vejico: $0{,}027$.« -/
theorem receptA : (27 : ℝ) / 1000 = 0.027 ∧ stevilo [0, 2, 7] = 27 ∧ zaVejico [0, 2, 7] = 27 / 1000 := by
  refine ⟨by norm_num, by decide, ?_⟩
  simp only [zaVejico]; norm_num

/-- Drugače, Recept B: 3,08 = 308/100 = 3 8/100.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#recept-b
besedilo: »Ulomek: $\dfrac{308}{100}$, kot mešano število $3\dfrac{8}{100}$.« -/
theorem receptB : (3.08 : ℝ) = 308 / 100 ∧ (308 : ℝ) / 100 = 3 + 8 / 100 := by norm_num

/-- Drugače, Recept C: 0,6 = 0,60 > 0,58; odločijo desetinke 6 > 5.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#recept-c
besedilo: »Desetinke se razlikujejo, $6 > 5$, zato je $0{,}6 > 0{,}58$.« -/
theorem receptC : (0.6 : ℝ) = 0.60 ∧ (0.6 : ℝ) > 0.58 ∧ zaVejico [5, 8] < zaVejico [6, 0] := by
  refine ⟨by norm_num, by norm_num, prvo_mesto_odloci 5 6 _ _ (by norm_num) (by decide) (by decide)⟩

/-- Drugače (zgodba): 3/10 kg = 0,3 kg; 15/100 kg = 0,15 kg; Nikin zapis 0,015 je 15/1000 (tisočinke), desetkrat
premalo.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#zgodba
besedilo: »Sto ima dve ničli, zato sta za vejico dve mesti: $0{,}15$.« -/
theorem zgodba : (3 : ℝ) / 10 = 0.3 ∧ (15 : ℝ) / 100 = 0.15 ∧ (0.015 : ℝ) = 15 / 1000 ∧
    (0.015 : ℝ) ≠ 0.15 ∧ (0.15 : ℝ) = 10 * 0.015 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1: 4 stolpci so 40 stotink, s 7 kvadratki 47 stotink, 47/100 = 0,47; napačni 4,7; 0,407 in 47 niso
enaki 0,47.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#kviz-1
besedilo: »$4$ stolpci so $40$ stotink, skupaj s $7$ kvadratki je pobarvanih $47$ stotink: $\dfrac{47}{100} = 0{,}47$.« -/
theorem kviz1 : (4 : ℝ) * 10 + 7 = 47 ∧ (47 : ℝ) / 100 = 0.47 ∧ (4.7 : ℝ) ≠ 0.47 ∧ (0.407 : ℝ) ≠ 0.47 ∧
    (47 : ℝ) ≠ 0.47 ∧ (0.47 : ℝ) < 1 := by norm_num

/-- Preveri se 2: 0,48 = 0,480 leži med 0,4 in 0,5 (blizu sredine: 0,5 − 0,48 = 0,02), manjše od 1.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#kviz-2
besedilo: »$0{,}48 = 0{,}480$ ima $4$ desetinke in $8$ stotink, torej leži med $0{,}4$ in $0{,}5$, blizu sredine odseka.« -/
theorem kviz2 : (0.48 : ℝ) = 0.480 ∧ (0.48 : ℝ) = 4 / 10 + 8 / 100 ∧ (0.4 : ℝ) < 0.48 ∧ (0.48 : ℝ) < 0.5 ∧
    (0.5 : ℝ) - 0.48 = 0.02 ∧ (0.48 : ℝ) < 1 := by norm_num

/-- Preveri se 3: 5 desetink je 50 stotink, zato 0,5 = 0,50; ničla takoj za vejico pa vrednost spremeni
(0,05 ≠ 0,5).
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#kviz-3
besedilo: »Desetinka je deset stotink, zato je $5$ desetink $50$ stotink.« -/
theorem kviz3 : (1 : ℝ) / 10 = 10 * (1 / 100) ∧ (5 : ℝ) * (1 / 10) = 50 * (1 / 100) ∧ (0.5 : ℝ) = 0.50 ∧
    (0.05 : ℝ) ≠ 0.5 ∧ (0.05 : ℝ) = 0.5 / 10 := by norm_num

/-- Preveri se 4: 0,08 = 8/100; napačni 8/10 = 0,8; 8/1000 = 0,008; 80/100 = 0,80 = 0,8 niso 0,08.
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#kviz-4
besedilo: »$0{,}08$ ima dve decimalni mesti, zato je imenovalec $100$; števec je število brez vejice, $8$.« -/
theorem kviz4 : (0.08 : ℝ) = 8 / 100 ∧ (8 : ℝ) / 10 = 0.8 ∧ (8 : ℝ) / 1000 = 0.008 ∧ (80 : ℝ) / 100 = 0.8 ∧
    (0.8 : ℝ) ≠ 0.08 ∧ (0.008 : ℝ) ≠ 0.08 := by norm_num

/-- Preveri se 5: 0,6 = 0,60 in 0,55 < 0,60, zato moke ni dovolj (55 > 6 ne odloča).
trditev: MAT-OS-6/desetiski-ulomki-in-decimalna-stevila#kviz-5
besedilo: »Z ničlo: $0{,}60$ in $0{,}55$. Odločijo desetinke, $5 < 6$, zato je moke premalo.« -/
theorem kviz5 : (0.6 : ℝ) = 0.60 ∧ (0.55 : ℝ) < 0.60 ∧ zaVejico [5, 5] < zaVejico [6, 0] := by
  refine ⟨by norm_num, by norm_num, prvo_mesto_odloci 5 6 _ _ (by norm_num) (by decide) (by decide)⟩

end Evklid.Lekcije.MAT_OS_6.DesetiskiUlomkiInDecimalnaStevila
