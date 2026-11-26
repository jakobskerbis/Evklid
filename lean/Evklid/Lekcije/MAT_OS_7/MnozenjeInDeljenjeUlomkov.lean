/-
vir: content/lessons/MAT-OS-7/mnozenje-in-deljenje-ulomkov.md
sha256: 382c806500a3f57fad872bda267d78c54edb310a3c01a4aa2931f3e33d4b6d3c
Model: ulomki so racionalna števila (`ℚ`), števci in imenovalci so poljubna racionalna števila; deljenje
»a : b« je `a / b`. Mešano število n p/q je n + p/q. Pogoji iz lekcije (b ≠ 0, d ≠ 0, pri deljenju c ≠ 0)
so zapisani kot predpostavke. Lean: x / 0 = 0, zato pravili za množenje in deljenje v Leanu veljata tudi brez
pogojev; zapisani sta s pogoji iz lekcije. Trditve »z ulomkom, manjšim od 1, dobiš manj / deljenje poveča« so
dokazane za pozitivno število in ulomek med 0 in 1 (lekcija govori o pozitivnih količinah; za negativna števila
ne veljata). Vrstni red računanja je dogovor o zapisu; Lean bere izraze po istem dogovoru, dokazane so
vrednosti in koraki primerov.
Ni v Leanu: trak papirja, prepogibanje in štetje osmin, slika s kvadratom in številska premica, simulacija
(dokazani so računi: 6/8 = 3/4, 1/2 · 3/4 = 3/8, 6 · 1/8 = 3/4, 3/4 : 1/4 = 3, 1/2 · 1/3 = 1/6); pomen besede »od«
kot množenje in »kolikokrat gre« kot deljenje (prevod besedila v račun); razlaga, zakaj se imenovalca zmnožita
(rezanje na dele; dokazano je pravilo); nasveti »sproti okrajšaj«, »najprej krajšaj, nato množi«, »oceni pred
računom«; enote (km, m, kg, skodelice) so le v docstringih; besedilo napačnih odgovorov v Preveri se (dokazane
so napačne vrednosti, ki jih razlaga navaja); »1/0 ni ulomek« kot dogovor (dokazano je, da 0 nima obratne
vrednosti: 0 · x ≠ 1).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.MnozenjeInDeljenjeUlomkov

/-! ## Zakaj se tega učimo -/

/-- Uvod: 6/8 = 3/4; polovica pobarvanega dela je 1/2 · 3/4 = 3/8; ena osmina gre v 3/4 natanko 6-krat
(3/4 : 1/8 = 6 in 6 · 1/8 = 3/4).
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#uvod-trak
besedilo: »Prvi odgovor je **množenje** ulomkov, $\frac{1}{2}\cdot\frac{3}{4}=\frac{3}{8}$. Drugi je **deljenje**, $\frac{3}{4}:\frac{1}{8}=6$.« -/
theorem uvod : (6:ℚ) / 8 = 3 / 4 ∧ (1:ℚ) / 2 * (3 / 4) = 3 / 8 ∧ (3:ℚ) / 4 / (1 / 8) = 6 ∧
    (6:ℚ) * (1 / 8) = 3 / 4 := by norm_num

/-! ## Razlaga -/

/-- Razlaga 1: 2/3 + 4/5 = 10/15 + 12/15 = 22/15.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#sestevanje-primer
besedilo: »ulomka najprej razširiš na skupni imenovalec $15$ in dobiš $\frac{10}{15}+\frac{12}{15}=\frac{22}{15}$.« -/
theorem sestevanje_primer : (2:ℚ) / 3 + 4 / 5 = 22 / 15 := by
  calc (2:ℚ) / 3 + 4 / 5 = 10 / 15 + 12 / 15 := by norm_num
    _ = 22 / 15 := by norm_num

/-- Razlaga 1, formula, Povzetek: a/b · c/d = (a · c)/(b · d) (b ≠ 0, d ≠ 0).
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#pravilo-mnozenja
besedilo: »Množenje: $\frac{a}{b}\cdot\frac{c}{d}=\frac{a\cdot c}{b\cdot d}$.« -/
theorem pravilo_mnozenja (a b c d : ℚ) (_hb : b ≠ 0) (_hd : d ≠ 0) :
    a / b * (c / d) = (a * c) / (b * d) := div_mul_div_comm a b c d

/-- Predpostavki `pravilo_mnozenja` se dajo izpolniti (b = 3, d = 5). -/
example := pravilo_mnozenja 2 3 4 5 (by norm_num) (by norm_num)

/-- Razlaga 1: 2/3 · 4/5 = 8/15.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#mnozenje-primer
besedilo: »Tako je $\frac{2}{3}\cdot\frac{4}{5}=\frac{8}{15}$.« -/
theorem mnozenje_primer : (2:ℚ) / 3 * (4 / 5) = 8 / 15 := by norm_num

/-- Razlaga 2: polovica od 3/4: imenovalec 4 · 2 = 8, števec 3 · 1 = 3, torej 1/2 · 3/4 = 3/8.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#od-traku
besedilo: »Celota ima zdaj $4\cdot 2=8$ delov, zato se imenovalca zmnožita. Od teh vzamemo $3\cdot 1=3$ dele, zato se zmnožita tudi števca.« -/
theorem od_traku : (4:ℚ) * 2 = 8 ∧ (3:ℚ) * 1 = 3 ∧ (1:ℚ) / 2 * (3 / 4) = (1 * 3) / (2 * 4) ∧
    (1:ℚ) / 2 * (3 / 4) = 3 / 8 := by norm_num

/-- Razlaga 2, premisli: 3/4 · 1/2 = 3/8 je manjše od 3/4.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#premisli-mnozenje
besedilo: »Manjše. Množiti z $\frac{1}{2}$ pomeni vzeti polovico, rezultat je $\frac{3}{8}$.« -/
theorem premisli_mnozenje : (3:ℚ) / 4 * (1 / 2) = 3 / 8 ∧ (3:ℚ) / 8 < 3 / 4 := by norm_num

/-- Razlaga 2, premisli: pri množenju pozitivnega števila x z ulomkom q, 0 < q < 1, dobiš manj kot x.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#mnozenje-z-manjsim
besedilo: »Pri množenju z ulomkom, manjšim od $1$, dobiš manj, kot si imel.« -/
theorem mnozenje_z_manjsim (x q : ℚ) (hx : 0 < x) (_hq0 : 0 < q) (hq1 : q < 1) : x * q < x := by
  nlinarith

/-- Predpostavke `mnozenje_z_manjsim` se dajo izpolniti (x = 3/4, q = 1/2). -/
example := mnozenje_z_manjsim (3 / 4) (1 / 2) (by norm_num) (by norm_num) (by norm_num)

/-- Razlaga 3: krajšanje pred množenjem: števec k · a prvega ulomka in imenovalec k · d drugega smemo krajšati
s k ≠ 0, ker je produkt en sam ulomek; enako za imenovalec prvega in števec drugega. (Navadno krajšanje
števca in imenovalca istega ulomka je pravilo krajšanja ulomkov.)
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#krajsanje-navzkriz
besedilo: »Zato smemo pred množenjem krajšati **katerikoli** števec s **katerimkoli** imenovalcem, če ju deli isto število.« -/
theorem krajsanje_navzkriz (a b c d k : ℚ) (hk : k ≠ 0) (hb : b ≠ 0) (hd : d ≠ 0) :
    (k * a) / b * (c / (k * d)) = a / b * (c / d) ∧ a / (k * b) * ((k * c) / d) = a / b * (c / d) := by
  constructor <;> field_simp

/-- Predpostavke `krajsanje_navzkriz` se dajo izpolniti (k = 3, b = 3, d = 10). -/
example := krajsanje_navzkriz 2 3 3 10 3 (by norm_num) (by norm_num) (by norm_num)

/-- Razlaga 3: pri seštevanju navzkriž ne smemo krajšati: 1/2 + 2/3 = 7/6, »pokrajšani« 1/1 + 1/3 = 4/3 pa je
drugo število.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#sestevanje-ne-navzkriz
besedilo: »Pri seštevanju tega ne smemo: v $\frac{1}{2}+\frac{2}{3}$ dvojk ne smeš »pokrajšati navzkriž«.« -/
theorem sestevanje_ne_navzkriz : (1:ℚ) / 2 + 2 / 3 = 7 / 6 ∧ (1:ℚ) / 1 + 1 / 3 = 4 / 3 ∧
    (1:ℚ) / 2 + 2 / 3 ≠ 1 / 1 + 1 / 3 := by norm_num

/-- Razlaga 4: celo število je ulomek z imenovalcem 1: n = n/1; 3 = 3/1.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#celo-stevilo
besedilo: »Celo število zapišemo kot ulomek z imenovalcem $1$: $3=\frac{3}{1}$.« -/
theorem celo_stevilo (n : ℚ) : n = n / 1 ∧ (3:ℚ) = 3 / 1 := ⟨(div_one n).symm, by norm_num⟩

/-- Razlaga 4, Povzetek: mešano število n p/q je nepravi ulomek (n · q + p)/q (q ≠ 0).
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#mesano-stevilo
besedilo: »Mešano število pred množenjem ali deljenjem pretvorimo v nepravi ulomek« -/
theorem mesano_stevilo (n p q : ℚ) (hq : q ≠ 0) : n + p / q = (n * q + p) / q := by
  field_simp

/-- Predpostavka `mesano_stevilo` se da izpolniti (q = 3). -/
example := mesano_stevilo 2 1 3 (by norm_num)

/-- Razlaga 4: 2 1/3 = (2 · 3 + 1)/3 = 7/3.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#dve-in-tretjina
besedilo: »$2\frac{1}{3}=\frac{2\cdot 3+1}{3}=\frac{7}{3}$.« -/
theorem dve_tretjini : (2:ℚ) + 1 / 3 = (2 * 3 + 1) / 3 ∧ ((2:ℚ) * 3 + 1) / 3 = 7 / 3 := by norm_num

/-- Razlaga 5, formula, Povzetek: ulomek in njegova obratna vrednost dasta v produktu 1:
a/b · b/a = (a · b)/(b · a) = 1 (a ≠ 0, b ≠ 0).
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#obratna-vrednost
besedilo: »Ulomek in njegova obratna vrednost dasta v produktu vedno $1$:« -/
theorem obratna_vrednost (a b : ℚ) (ha : a ≠ 0) (hb : b ≠ 0) :
    a / b * (b / a) = (a * b) / (b * a) ∧ (a * b) / (b * a) = 1 := by
  refine ⟨div_mul_div_comm a b b a, ?_⟩
  rw [mul_comm b a]; exact div_self (mul_ne_zero ha hb)

/-- Predpostavki `obratna_vrednost` se dajo izpolniti (a = 2, b = 5). -/
example := obratna_vrednost 2 5 (by norm_num) (by norm_num)

/-- Razlaga 5: obratna vrednost 2/5 je 5/2, od 4 = 4/1 je 1/4, od 2 1/3 = 7/3 je 3/7 (produkt je vsakič 1).
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#obratne-vrednosti
besedilo: »Obratna vrednost $2\frac{1}{3}=\frac{7}{3}$ je $\frac{3}{7}$.« -/
theorem obratne_vrednosti : (2:ℚ) / 5 * (5 / 2) = 1 ∧ (4:ℚ) = 4 / 1 ∧ (4:ℚ) * (1 / 4) = 1 ∧
    (2:ℚ) + 1 / 3 = 7 / 3 ∧ (7:ℚ) / 3 * (3 / 7) = 1 := by norm_num

/-- Razlaga 5, Povzetek: število 0 nima obratne vrednosti: nobeno število x ne da 0 · x = 1.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#nic-nima-obratne
besedilo: »Število $0$ nima obratne vrednosti.« -/
theorem nic_nima_obratne : ¬ ∃ x : ℚ, 0 * x = 1 := by
  rintro ⟨x, hx⟩; simp at hx

/-- Razlaga 6: 12 : 3 = 4; 3/4 : 1/8 = 3/4 · 8/1 = 24/4 = 6.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#deljenje-primer
besedilo: »Isto dobimo, če $\frac{3}{4}$ pomnožimo z obratno vrednostjo osmine: $\frac{3}{4}\cdot\frac{8}{1}=\frac{24}{4}=6$.« -/
theorem deljenje_primer : (12:ℚ) / 3 = 4 ∧ (3:ℚ) / 4 / (1 / 8) = 6 := by
  refine ⟨by norm_num, ?_⟩
  calc (3:ℚ) / 4 / (1 / 8) = 3 / 4 * (8 / 1) := by norm_num
    _ = 24 / 4 := by norm_num
    _ = 6 := by norm_num

/-- Razlaga 6, formula, Povzetek: a/b : c/d = a/b · d/c (b ≠ 0, c ≠ 0, d ≠ 0).
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#pravilo-deljenja
besedilo: »Deljenje: $\frac{a}{b}:\frac{c}{d}=\frac{a}{b}\cdot\frac{d}{c}$.« -/
theorem pravilo_deljenja (a b c d : ℚ) (_hb : b ≠ 0) (_hc : c ≠ 0) (_hd : d ≠ 0) :
    a / b / (c / d) = a / b * (d / c) := by
  rw [div_div_eq_mul_div, mul_div_assoc]

/-- Predpostavke `pravilo_deljenja` se dajo izpolniti (b = 4, c = 1, d = 8). -/
example := pravilo_deljenja 3 4 1 8 (by norm_num) (by norm_num) (by norm_num)

/-- Razlaga 6, premisli: 3/4 : 1/8 je večje od 3/4; v splošnem deljenje pozitivnega x z ulomkom q, 0 < q < 1,
rezultat poveča.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#deljenje-z-manjsim
besedilo: »Deljenje z ulomkom, manjšim od $1$, rezultat poveča.« -/
theorem deljenje_z_manjsim (x q : ℚ) (hx : 0 < x) (hq0 : 0 < q) (hq1 : q < 1) : x < x / q := by
  rw [lt_div_iff₀ hq0]; nlinarith

/-- Predpostavke `deljenje_z_manjsim` se dajo izpolniti (x = 3/4, q = 1/8). -/
example := deljenje_z_manjsim (3 / 4) (1 / 8) (by norm_num) (by norm_num) (by norm_num)

/-- Razlaga 6, premisli: 3/4 < 3/4 : 1/8. Simulacija: pri drugem imenovalcu 4 je 3/4 : 1/4 = 3.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#premisli-deljenje
besedilo: »Nato drugi imenovalec spremeni na $4$: kosov je samo še $3$, ker je vsak kos dvakrat daljši.« -/
theorem premisli_deljenje : (3:ℚ) / 4 < 3 / 4 / (1 / 8) ∧ (3:ℚ) / 4 / (1 / 4) = 3 := by norm_num

/-- Razlaga 7, tabela: 1/2 + 1/3 = 5/6, 1/2 · 1/3 = 1/6, 1/2 : 1/3 = 3/2.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#tabela-primeri
besedilo: »$\frac{1}{2}+\frac{1}{3}=\frac{5}{6}$ | $\frac{1}{2}\cdot\frac{1}{3}=\frac{1}{6}$ | $\frac{1}{2}:\frac{1}{3}=\frac{3}{2}$« -/
theorem tabela : (1:ℚ) / 2 + 1 / 3 = 5 / 6 ∧ (1:ℚ) / 2 * (1 / 3) = 1 / 6 ∧ (1:ℚ) / 2 / (1 / 3) = 3 / 2 := by
  norm_num

/-! ## Rešeni primeri -/

/-- Primer 1 (rover): 2/3 od 9/10 km: 2/3 · 9/10 = (2 · 9)/(3 · 10) = (1 · 3)/(1 · 5) = 3/5 km.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#primer1-rover
besedilo: »Ostane $\frac{1\cdot 3}{1\cdot 5}=\frac{3}{5}$.« -/
theorem primer1 : (2:ℚ) / 3 * (9 / 10) = 3 / 5 := by
  calc (2:ℚ) / 3 * (9 / 10) = (2 * 9) / (3 * 10) := by norm_num
    _ = (1 * 3) / (1 * 5) := by norm_num
    _ = 3 / 5 := by norm_num

/-- Primer 1, korak 2: 9 : 3 = 3, 3 : 3 = 1, 2 : 2 = 1, 10 : 2 = 5; korak 4: 18/30 = 3/5 (18 = 6 · 3,
30 = 6 · 5); korak 5: 3/5 km = 600 m.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#primer1-koraki
besedilo: »Odgovor: do kosila je vozilo prevozilo $\frac{3}{5}\,\text{km}$, to je $600\,\text{m}$.« -/
theorem primer1_koraki : (9:ℚ) / 3 = 3 ∧ (3:ℚ) / 3 = 1 ∧ (2:ℚ) / 2 = 1 ∧ (10:ℚ) / 2 = 5 ∧
    (2:ℚ) * 9 = 18 ∧ (3:ℚ) * 10 = 30 ∧ (18:ℕ) = 6 * 3 ∧ (30:ℕ) = 6 * 5 ∧ (18:ℚ) / 30 = 3 / 5 ∧
    (3:ℚ) / 5 * 1000 = 600 := by norm_num

/-- Primer 2: 2 1/4 : 1 1/2 = 9/4 : 3/2 = 9/4 · 2/3 = (3 · 1)/(2 · 1) = 3/2 = 1 1/2.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#primer2-kolicnik
besedilo: »Odgovor: količnik je $\frac{3}{2}=1\frac{1}{2}$.« -/
theorem primer2 : ((2:ℚ) + 1 / 4) / (1 + 1 / 2) = 1 + 1 / 2 := by
  calc ((2:ℚ) + 1 / 4) / (1 + 1 / 2) = 9 / 4 / (3 / 2) := by norm_num
    _ = 9 / 4 * (2 / 3) := by norm_num
    _ = (3 * 1) / (2 * 1) := by norm_num
    _ = 3 / 2 := by norm_num
    _ = 1 + 1 / 2 := by norm_num

/-- Primer 2, korak 3: krajšamo 9 in 3 s 3 ter 2 in 4 z 2: 9 : 3 = 3, 3 : 3 = 1, 2 : 2 = 1, 4 : 2 = 2.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#primer2-krajsanje
besedilo: »Krajšamo: $9$ in $3$ s $3$, $2$ in $4$ z $2$.« -/
theorem primer2_krajsanje : (9:ℚ) / 3 = 3 ∧ (3:ℚ) / 3 = 1 ∧ (2:ℚ) / 2 = 1 ∧ (4:ℚ) / 2 = 2 := by norm_num

/-- Primer 2, korak 4 (preizkus): 3/2 · 3/2 = 9/4 = 2 1/4.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#primer2-preizkus
besedilo: »Preverimo z množenjem: $\frac{3}{2}\cdot\frac{3}{2}=\frac{9}{4}=2\frac{1}{4}$.« -/
theorem primer2_preizkus : (3:ℚ) / 2 * (3 / 2) = 9 / 4 ∧ (9:ℚ) / 4 = 2 + 1 / 4 := by norm_num

/-- Primer 3: (1/2 + 1/3) : 5/12 − 1/5 · 5/2 = (3/6 + 2/6) : 5/12 − 1/5 · 5/2 = 5/6 : 5/12 − 1/5 · 5/2
= 5/6 · 12/5 − 1/5 · 5/2 = (1 · 2)/(1 · 1) − 1/5 · 5/2 = 2 − 1/2 = 4/2 − 1/2 = 3/2 = 1 1/2.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#primer3-vrednost
besedilo: »Odgovor: vrednost računa je $\frac{3}{2}=1\frac{1}{2}$.« -/
theorem primer3 : ((1:ℚ) / 2 + 1 / 3) / (5 / 12) - 1 / 5 * (5 / 2) = 1 + 1 / 2 := by
  calc ((1:ℚ) / 2 + 1 / 3) / (5 / 12) - 1 / 5 * (5 / 2)
      = (3 / 6 + 2 / 6) / (5 / 12) - 1 / 5 * (5 / 2) := by norm_num
    _ = 5 / 6 / (5 / 12) - 1 / 5 * (5 / 2) := by norm_num
    _ = 5 / 6 * (12 / 5) - 1 / 5 * (5 / 2) := by norm_num
    _ = (1 * 2) / (1 * 1) - 1 / 5 * (5 / 2) := by norm_num
    _ = 2 - 1 / 2 := by norm_num
    _ = 4 / 2 - 1 / 2 := by norm_num
    _ = 3 / 2 := by norm_num
    _ = 1 + 1 / 2 := by norm_num

/-- Primer 3, korak 2: krajšamo 5 in 5 s 5 ter 12 in 6 s 6: 5 : 5 = 1, 12 : 6 = 2, 6 : 6 = 1.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#primer3-krajsanje
besedilo: »Pokrajšamo $5$ s $5$ in $12$ s $6$, ostane $\frac{1\cdot 2}{1\cdot 1}=2$.« -/
theorem primer3_krajsanje : (5:ℚ) / 5 = 1 ∧ (12:ℚ) / 6 = 2 ∧ (6:ℚ) / 6 = 1 := by norm_num

/-- Primer 4, korak 1: pojedeno 2/5 · 5/6 = 2/6 = 1/3 kg.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#primer4-pojedeno
besedilo: »$\frac{2}{5}\cdot\frac{5}{6}=\frac{2}{6}=\frac{1}{3}\,\text{kg}$.« -/
theorem primer4_pojedeno : (2:ℚ) / 5 * (5 / 6) = 1 / 3 := by
  calc (2:ℚ) / 5 * (5 / 6) = 2 / 6 := by norm_num
    _ = 1 / 3 := by norm_num

/-- Primer 4, korak 2: ostanek 5/6 − 1/3 = 5/6 − 2/6 = 3/6 = 1/2 kg.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#primer4-ostanek
besedilo: »Ostanek: $\frac{5}{6}-\frac{1}{3}=\frac{5}{6}-\frac{2}{6}=\frac{3}{6}=\frac{1}{2}\,\text{kg}$.« -/
theorem primer4_ostanek : (5:ℚ) / 6 - 1 / 3 = 1 / 2 := by
  calc (5:ℚ) / 6 - 1 / 3 = 5 / 6 - 2 / 6 := by norm_num
    _ = 3 / 6 := by norm_num
    _ = 1 / 2 := by norm_num

/-- Primer 4, premisli: 1/2 : 1/12 = 1/2 · 12/1 = 6 vrečk; preizkus 6 · 1/12 = 6/12 = 1/2.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#primer4-vrecke
besedilo: »Napolnijo $6$ vrečk. Preizkus: $6\cdot\frac{1}{12}=\frac{6}{12}=\frac{1}{2}$.« -/
theorem primer4_vrecke : (1:ℚ) / 2 / (1 / 12) = 6 ∧ (6:ℚ) * (1 / 12) = 1 / 2 := by
  refine ⟨?_, ?_⟩
  · calc (1:ℚ) / 2 / (1 / 12) = 1 / 2 * (12 / 1) := by norm_num
      _ = 6 := by norm_num
  · calc (6:ℚ) * (1 / 12) = 6 / 12 := by norm_num
      _ = 1 / 2 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1: 1/2 · 1/3 = 3/6 · 2/6 je 1/6, ne 6/6 = 1 (napačno je zmnožiti samo števca).
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#napaka-skupni-imenovalec
besedilo: »Popravek: brez razširjanja $\frac{1}{2}\cdot\frac{1}{3}=\frac{1}{6}$.« -/
theorem napaka_skupni_imenovalec : (1:ℚ) / 2 * (1 / 3) = 3 / 6 * (2 / 6) ∧ (3:ℚ) / 6 * (2 / 6) = 1 / 6 ∧
    (3:ℚ) * 2 / 6 = 1 ∧ (1:ℚ) / 2 * (1 / 3) ≠ 1 := by norm_num

/-- Pogoste napake 2: obrnjen prvi ulomek da 3/2 · 4/5 = 6/5, pravilno pa je 2/3 : 4/5 = 2/3 · 5/4 = 5/6;
preizkus 5/6 · 4/5 = 2/3.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#napaka-obrnjen
besedilo: »Popravek: $\frac{2}{3}\cdot\frac{5}{4}=\frac{5}{6}$; preizkus $\frac{5}{6}\cdot\frac{4}{5}=\frac{2}{3}$.« -/
theorem napaka_obrnjen : (3:ℚ) / 2 * (4 / 5) = 6 / 5 ∧ (2:ℚ) / 3 / (4 / 5) = 2 / 3 * (5 / 4) ∧
    (2:ℚ) / 3 * (5 / 4) = 5 / 6 ∧ (5:ℚ) / 6 * (4 / 5) = 2 / 3 ∧ (2:ℚ) / 3 / (4 / 5) ≠ 6 / 5 := by norm_num

/-- Pogoste napake 3: 2 1/2 · 3 = 5/2 · 3 = 15/2 = 7 1/2, ne 6 1/2.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#napaka-mesano
besedilo: »Popravek: najprej nepravi ulomek, $\frac{5}{2}\cdot 3=\frac{15}{2}=7\frac{1}{2}$.« -/
theorem napaka_mesano : ((2:ℚ) + 1 / 2) * 3 = 5 / 2 * 3 ∧ (5:ℚ) / 2 * 3 = 15 / 2 ∧ (15:ℚ) / 2 = 7 + 1 / 2 ∧
    ((2:ℚ) + 1 / 2) * 3 ≠ 6 + 1 / 2 := by norm_num

/-- Pogoste napake 4: »množenje poveča, deljenje zmanjša« velja za množenje in deljenje pozitivnega x z
naravnim številom n > 1.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#naravno-vecje-od-ena
besedilo: »To velja pri naravnih številih, večjih od $1$.« -/
theorem naravno_vecje_od_ena (x : ℚ) (n : ℕ) (hx : 0 < x) (hn : 1 < n) : x < n * x ∧ x / n < x := by
  have hn' : (1:ℚ) < n := by exact_mod_cast hn
  refine ⟨by nlinarith, ?_⟩
  rw [div_lt_iff₀ (by linarith)]; nlinarith

/-- Predpostavke `naravno_vecje_od_ena` se dajo izpolniti (x = 3, n = 2). -/
example := naravno_vecje_od_ena 3 2 (by norm_num) (by norm_num)

/-- Pogoste napake 4: z ulomkom, manjšim od 1, je obratno: 1/2 · 1/3 = 1/6 je manj od obeh, 3 : 1/2 = 6 je več
kot 3.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#napaka-poveca
besedilo: »Z ulomkom, manjšim od $1$, je obratno: $\frac{1}{2}\cdot\frac{1}{3}=\frac{1}{6}$ je manj od obeh, $3:\frac{1}{2}=6$ pa več kot $3$.« -/
theorem napaka_poveca : (1:ℚ) / 2 * (1 / 3) = 1 / 6 ∧ (1:ℚ) / 6 < 1 / 2 ∧ (1:ℚ) / 6 < 1 / 3 ∧
    (3:ℚ) / (1 / 2) = 6 ∧ (3:ℚ) < 6 := by norm_num

/-- Pogoste napake 5: 1/2 + 1/2 · 1/3 = 1/2 + 1/6 = 2/3, ne (1/2 + 1/2) · 1/3 = 1/3.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#napaka-vrstni-red
besedilo: »Množenje ima prednost pred seštevanjem. Popravek: $\frac{1}{2}+\frac{1}{6}=\frac{2}{3}$.« -/
theorem napaka_vrstni_red : (1:ℚ) / 2 + 1 / 2 * (1 / 3) = 1 / 2 + 1 / 6 ∧ (1:ℚ) / 2 + 1 / 6 = 2 / 3 ∧
    ((1:ℚ) / 2 + 1 / 2) * (1 / 3) = 1 / 3 ∧ (1:ℚ) / 2 + 1 / 2 * (1 / 3) ≠ 1 / 3 := by norm_num

/-! ## Drugače -/

/-- Na sliki: 1/2 · 1/3 = 1/6; 3/4 = 6/8 in šest korakov 1/8 da 3/4, zato 3/4 : 1/8 = 6.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#na-sliki
besedilo: »Korakov je natanko $6$, zato $\frac{3}{4}:\frac{1}{8}=6$.« -/
theorem na_sliki : (1:ℚ) / 2 * (1 / 3) = 1 / 6 ∧ (3:ℚ) / 4 = 6 / 8 ∧ (6:ℚ) * (1 / 8) = 3 / 4 ∧
    (3:ℚ) / 4 / (1 / 8) = 6 := by norm_num

/-- Iz vsakdanjega življenja: recept 1/2 · 3/4 = 3/8 skodelice; trak 2/3 : 1/6 = 2/3 · 6/1 = 12/3 = 4 kosi;
2/3 = 4/6.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#vsakdanje-trak
besedilo: »Dobiš $4$ kose. Preveri na pamet: $\frac{2}{3}=\frac{4}{6}$, torej štiri šestine.« -/
theorem vsakdanje : (1:ℚ) / 2 * (3 / 4) = 3 / 8 ∧ (2:ℚ) / 3 / (1 / 6) = 4 ∧ (2:ℚ) / 3 = 4 / 6 := by
  refine ⟨by norm_num, ?_, by norm_num⟩
  calc (2:ℚ) / 3 / (1 / 6) = 2 / 3 * (6 / 1) := by norm_num
    _ = 12 / 3 := by norm_num
    _ = 4 := by norm_num

/-- Bolj natančno: količnik x = a/b : c/d je edino število z x · c/d = a/b, in to je x = a/b · d/c
(b ≠ 0, c ≠ 0, d ≠ 0).
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#kolicnik-enolicen
besedilo: »$$x=\frac{a}{b}\cdot\frac{d}{c}$$« -/
theorem kolicnik_enolicen (a b c d x : ℚ) (_hb : b ≠ 0) (hc : c ≠ 0) (hd : d ≠ 0) :
    x * (c / d) = a / b ↔ x = a / b * (d / c) := by
  have h : c / d * (d / c) = 1 := by field_simp
  constructor
  · intro hx
    calc x = x * (c / d) * (d / c) := by rw [mul_assoc, h, mul_one]
      _ = a / b * (d / c) := by rw [hx]
  · rintro rfl
    rw [mul_assoc, mul_comm (d / c), h, mul_one]

/-- Predpostavke `kolicnik_enolicen` se dajo izpolniti (b = 4, c = 1, d = 8). -/
example := kolicnik_enolicen 3 4 1 8 6 (by norm_num) (by norm_num) (by norm_num)

/-- Bolj natančno: »zahteva c ≠ 0«: pri c = 0 in a/b ≠ 0 nobeno x ne da x · c/d = a/b.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#brez-c-ni-kolicnika
besedilo: »Zahteva $c\ne 0$, saj drugače obratna vrednost ne obstaja.« -/
theorem brez_c_ni_kolicnika (a b d : ℚ) (hab : a / b ≠ 0) : ¬ ∃ x : ℚ, x * (0 / d) = a / b := by
  rintro ⟨x, hx⟩; simp at hx; exact hab hx.symm

/-- Predpostavka `brez_c_ni_kolicnika` se da izpolniti (a = 3, b = 4). -/
example := brez_c_ni_kolicnika 3 4 5 (by norm_num)

/-! ## Preveri se -/

/-- Preveri se 1: 2 3/5 = (2 · 5 + 3)/5 = 13/5, obratna vrednost je 5/13 (13/5 · 5/13 = 1); 5/23, 13/5 in
2 5/3 niso obratna vrednost (njihov produkt s 13/5 ni 1).
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#preveri1
besedilo: »$2\frac{3}{5}=\frac{13}{5}$, obratna vrednost je $\frac{5}{13}$. Preizkus: $\frac{13}{5}\cdot\frac{5}{13}=1$.« -/
theorem preveri1 : (2:ℚ) + 3 / 5 = (2 * 5 + 3) / 5 ∧ ((2:ℚ) * 5 + 3) / 5 = 13 / 5 ∧
    (13:ℚ) / 5 * (5 / 13) = 1 ∧ (13:ℚ) / 5 * (5 / 23) ≠ 1 ∧ (13:ℚ) / 5 * (13 / 5) ≠ 1 ∧
    (13:ℚ) / 5 * (2 + 5 / 3) ≠ 1 := by norm_num

/-- Preveri se 2: 7/8 : 1/9 = 7/8 · 9 = 63/8 = 7 7/8; to je malo manj kot 9 in od 8 oddaljeno le 1/8 (več kot 1,
ne pa 7/8 · 1/9 = 7/72).
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#preveri2
besedilo: »Ker je $\frac{7}{8}$ skoraj $1$, je rezultat malo manj kot $9$; natančno $\frac{63}{8}=7\frac{7}{8}$.« -/
theorem preveri2 : (7:ℚ) / 8 / (1 / 9) = 7 / 8 * 9 ∧ (7:ℚ) / 8 * 9 = 63 / 8 ∧ (63:ℚ) / 8 = 7 + 7 / 8 ∧
    (63:ℚ) / 8 < 9 ∧ |(63:ℚ) / 8 - 8| = 1 / 8 ∧ (1:ℚ) < 63 / 8 ∧ (7:ℚ) / 8 * (1 / 9) = 7 / 72 := by
  norm_num [abs_of_neg]

/-- Preveri se 3: 3/4 : 1/8 = 3/4 · 8/1 = 6 > 3/4, ker je 1/8 < 1; deljenje z ulomkom ni vedno večje:
3/4 : 3/2 = 1/2 < 3/4.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#preveri3
besedilo: »Deljenje vpraša, kolikokrat gre delitelj v deljenca. Kos, manjši od $1$, gre vanj večkrat: $\frac{3}{4}:\frac{1}{8}=6$.« -/
theorem preveri3 : (3:ℚ) / 4 / (1 / 8) = 3 / 4 * (8 / 1) ∧ (3:ℚ) / 4 * (8 / 1) = 6 ∧ (1:ℚ) / 8 < 1 ∧
    (3:ℚ) / 4 < 6 ∧ (3:ℚ) / 4 / (3 / 2) = 1 / 2 ∧ (1:ℚ) / 2 < 3 / 4 := by norm_num

/-- Preveri se 4: x · 3/5 = 9/20 natanko tedaj, ko je x = 9/20 : 3/5 = 9/20 · 5/3 = 3/4 (napačni odgovori:
3/5 · 9/20 = 27/100 in 3/5 : 9/20 = 4/3).
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#preveri4
besedilo: »$\frac{9}{20}:\frac{3}{5}=\frac{9}{20}\cdot\frac{5}{3}=\frac{3}{4}$.« -/
theorem preveri4 (x : ℚ) : x * (3 / 5) = 9 / 20 ↔ x = 3 / 4 := by
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Preveri se 4, koraki: 9/20 : 3/5 = 9/20 · 5/3 = 3/4; preizkus 3/5 · 3/4 = 9/20; napačna odgovora
3/5 · 9/20 = 27/100 in 3/5 : 9/20 = 4/3.
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#preveri4-koraki
besedilo: »Preizkus: $\frac{3}{5}\cdot\frac{3}{4}=\frac{9}{20}$.« -/
theorem preveri4_koraki : (9:ℚ) / 20 / (3 / 5) = 9 / 20 * (5 / 3) ∧ (9:ℚ) / 20 * (5 / 3) = 3 / 4 ∧
    (3:ℚ) / 5 * (3 / 4) = 9 / 20 ∧ (3:ℚ) / 5 * (9 / 20) = 27 / 100 ∧ (3:ℚ) / 5 / (9 / 20) = 4 / 3 := by
  norm_num

/-- Preveri se 5: porabljeno 3/4 · 4/5 = 3/5, ostane 4/5 − 3/5 = 1/5 rezervoarja (napačno: 4/5 − 3/4 = 1/20).
trditev: MAT-OS-7/mnozenje-in-deljenje-ulomkov#preveri5
besedilo: »Ostane $\frac{4}{5}-\frac{3}{5}=\frac{1}{5}$ rezervoarja.« -/
theorem preveri5 : (3:ℚ) / 4 * (4 / 5) = 3 / 5 ∧ (4:ℚ) / 5 - 3 / 5 = 1 / 5 ∧ (4:ℚ) / 5 - 3 / 4 = 1 / 20 := by
  norm_num

end Evklid.Lekcije.MAT_OS_7.MnozenjeInDeljenjeUlomkov
