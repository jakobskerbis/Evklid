/-
vir: content/lessons/MAT-OS-8/kvadrat-stevila.md
sha256: 8573e5898f191b873a3d9000faecefcb382505c75a0c3659e381fa618e91d801
Model: števila so realna (`ℝ`), naravna števila (popolni kvadrati, zadnja števka) so `ℕ`. Decimalna števila
so točna racionalna števila v ℝ (npr. (0.3 : ℝ) = 3/10). Zadnja števka je ostanek pri deljenju z 10.
Ploščina kvadrata s stranico a je dokazana z Mathlibovo Lebesgueovo mero kvadrata [0, a] × [0, a] v ℝ²
(pogoj a ≥ 0). »Približno« je dokazano kot ocena napake: 529/400 = 1,3225 je od 1,32 oddaljeno manj kot
0,005 in od 1,3 manj kot 0,05. Lean: a / 0 = 0, zato pravilo (a/b)² = a²/b² v Leanu velja tudi brez pogoja;
zapisano je s pogojem b ≠ 0 iz lekcije.
Ni v Leanu: risbe in simulacija (dokazani so računi v njih, npr. 23² = 400 + 60 + 60 + 9 = 529, in razrez
(20 + 3)² = 20² + 2 · 20 · 3 + 3²); branje »a na kvadrat«, ime »kvadrat« in dogovor, da eksponent velja le za
tisto, kar stoji neposredno pred njim (dogovor o zapisu; Lean bere −6² kot −(6²), dokazane so vrednosti);
zgodbe (pekač, brownie, deska) kot opisi in enote (cm, dm, g); »bliže 900«, »malo več/manj« kot besedi
(dokazane so razlike, npr. 900 − 729 < 729 − 400, 2304 < 2500, 46,24 < 49); da je 1,3 »najboljša« ocena v
Primeru 3 (dokazana je natančnost; z 1,3225 bi bilo čokolade 264,5 g, lekcija pravi »okoli 260 g«); ocena v
5. vprašanju Preveri se kot »najboljša« (dokazano je 19² = 361 < 400 = 20²); besedilo napačnih odgovorov v
Preveri se (dokazane so napačne vrednosti, ki jih razlaga navaja); »vrstica in stolpec kvadratkov« kot
geometrijski razrez (dokazana je enakost (n + 1)² = n² + 2n + 1).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.KvadratStevila

/-! ## Korak 1: kaj je kvadrat -/

/-- Korak 1 in Povzetek: kvadrat števila a je produkt števila s samim seboj, a² = a · a.
trditev: MAT-OS-8/kvadrat-stevila#kvadrat
besedilo: »Kvadrat števila $a$ je produkt števila s samim seboj: $$a^2 = a \cdot a$$« -/
theorem kvadrat (a : ℝ) : a ^ 2 = a * a := sq a

/-- Korak 1 in Povzetek: kvadrat s stranico a ≥ 0 (kvadrat [0, a] × [0, a] v ravnini) ima ploščino a · a =
a².
trditev: MAT-OS-8/kvadrat-stevila#ploscina-kvadrata
besedilo: »kvadrat s stranico $a$ ima ploščino $a^2$« -/
theorem ploscina_kvadrata (a : ℝ) (ha : 0 ≤ a) :
    MeasureTheory.volume (Set.Icc 0 a ×ˢ Set.Icc 0 a : Set (ℝ × ℝ)) = ENNReal.ofReal (a ^ 2) := by
  rw [MeasureTheory.Measure.volume_eq_prod, MeasureTheory.Measure.prod_prod, Real.volume_Icc, sub_zero,
    ← ENNReal.ofReal_mul ha, sq]

/-- Predpostavka `ploscina_kvadrata` se da izpolniti (a = 15). -/
example : (0:ℝ) ≤ 15 := by norm_num

/-- Korak 1 (Tim): 15² = 225, 30² = 900, 900 : 225 = 4, in 2 · 2 = 4.
trditev: MAT-OS-8/kvadrat-stevila#pekaca
besedilo: »$15^2 = 225$ in $30^2 = 900$, dno velikega pekača je torej $900 : 225 = 4$-krat večje.« -/
theorem pekaca : (15:ℝ) ^ 2 = 225 ∧ (30:ℝ) ^ 2 = 900 ∧ (900:ℝ) / 225 = 4 ∧ (2:ℝ) * 2 = 4 := by norm_num

/-- Korak 1, Pogoste napake in Povzetek: dvakrat daljša stranica da štirikrat večjo ploščino,
(2a)² = 4a²; 30² = 900 = 4 · 225.
trditev: MAT-OS-8/kvadrat-stevila#dvakrat-stranica
besedilo: »Podvojita se dolžina in širina, zato je ploščina štirikrat večja: $30^2 = 900 = 4 \cdot 225$.« -/
theorem dvakrat_stranica (a : ℝ) : (2 * a) ^ 2 = 4 * a ^ 2 ∧ (30:ℝ) ^ 2 = 4 * 225 :=
  ⟨by ring, by norm_num⟩

/-- Korak 1, preizkus: 8² = 8 · 8 = 64, ne 16.
trditev: MAT-OS-8/kvadrat-stevila#osem-na-kvadrat
besedilo: »(Rešitev: $8 \cdot 8 = 64$, ne $16$.)« -/
theorem osem_na_kvadrat : (8:ℝ) ^ 2 = 8 * 8 ∧ (8:ℝ) * 8 = 64 ∧ (8:ℝ) ^ 2 ≠ 16 := by norm_num

/-! ## Korak 2: popolni kvadrati -/

/-- Korak 2: tabela popolnih kvadratov 1² … 15² in 20².
trditev: MAT-OS-8/kvadrat-stevila#tabela-kvadratov
besedilo: »| $1$ | $1$ | $9$ | $81$ | | $2$ | $4$ | $10$ | $100$ | | $3$ | $9$ | $11$ | $121$ | | $4$ | $16$ | $12$ | $144$ | | $5$ | $25$ | $13$ | $169$ | | $6$ | $36$ | $14$ | $196$ | | $7$ | $49$ | $15$ | $225$ | | $8$ | $64$ | $20$ | $400$ |« -/
theorem tabela_kvadratov :
    (1:ℕ) ^ 2 = 1 ∧ (2:ℕ) ^ 2 = 4 ∧ (3:ℕ) ^ 2 = 9 ∧ (4:ℕ) ^ 2 = 16 ∧ (5:ℕ) ^ 2 = 25 ∧ (6:ℕ) ^ 2 = 36 ∧
    (7:ℕ) ^ 2 = 49 ∧ (8:ℕ) ^ 2 = 64 ∧ (9:ℕ) ^ 2 = 81 ∧ (10:ℕ) ^ 2 = 100 ∧ (11:ℕ) ^ 2 = 121 ∧
    (12:ℕ) ^ 2 = 144 ∧ (13:ℕ) ^ 2 = 169 ∧ (14:ℕ) ^ 2 = 196 ∧ (15:ℕ) ^ 2 = 225 ∧ (20:ℕ) ^ 2 = 400 := by
  norm_num

/-- Korak 2, preizkus: 150 ni popolni kvadrat; leži med 12² = 144 in 13² = 169.
trditev: MAT-OS-8/kvadrat-stevila#sto-petdeset
besedilo: »ne, leži med $12^2 = 144$ in $13^2 = 169$« -/
theorem sto_petdeset : (¬ ∃ n : ℕ, n ^ 2 = 150) ∧ (12:ℕ) ^ 2 < 150 ∧ 150 < (13:ℕ) ^ 2 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  rintro ⟨n, hn⟩
  have h : n < 13 := by nlinarith
  interval_cases n <;> omega

/-! ## Korak 3 in 4: negativna osnova, oklepaj -/

/-- Korak 3: (−4)² = (−4) · (−4) = 16; 4 in −4 imata enak kvadrat; preizkus (−7)² = 49.
trditev: MAT-OS-8/kvadrat-stevila#negativna-osnova
besedilo: »zato je $(-4)^2 = (-4) \cdot (-4) = 16$. Števili $4$ in $-4$ imata enak kvadrat.« -/
theorem negativna_osnova :
    ((-4):ℝ) ^ 2 = (-4) * (-4) ∧ ((-4):ℝ) * (-4) = 16 ∧ ((-4):ℝ) ^ 2 = 4 ^ 2 ∧ ((-7):ℝ) ^ 2 = 49 := by
  norm_num

/-- Korak 3, Povzetek, Bolj natančno: kvadrat ni nikoli negativen, in (−a)² = a².
trditev: MAT-OS-8/kvadrat-stevila#kvadrat-nenegativen
besedilo: »Kvadrat ni nikoli negativen; $(-a)^2 = a^2$« -/
theorem kvadrat_nenegativen (a : ℝ) : 0 ≤ a ^ 2 ∧ (-a) ^ 2 = a ^ 2 := ⟨sq_nonneg a, neg_sq a⟩

/-- Bolj natančno: utemeljitev po primerih: a > 0, a < 0 ali a = 0 da a · a ≥ 0 (za a ≠ 0 celo > 0), in
(−a) · (−a) = a · a.
trditev: MAT-OS-8/kvadrat-stevila#kvadrat-po-primerih
besedilo: »Če je $a > 0$, je produkt dveh pozitivnih števil pozitiven. Če je $a < 0$, je produkt dveh negativnih števil pozitiven. Če je $a = 0$, je $0^2 = 0$. V vseh primerih velja $a^2 \ge 0$.« -/
theorem kvadrat_po_primerih (a : ℝ) :
    (0 < a → 0 < a * a) ∧ (a < 0 → 0 < a * a) ∧ ((0:ℝ) ^ 2 = 0) ∧ (-a) * (-a) = a * a :=
  ⟨fun h => mul_pos h h, fun h => mul_pos_of_neg_of_neg h h, by norm_num, neg_mul_neg a a⟩

/-- Korak 4: −4² = −(4 · 4) = −16, (−4)² pa 16. Premisli: (−3)² = 9, −3² = −9.
trditev: MAT-OS-8/kvadrat-stevila#oklepaj-odloca
besedilo: »Zato je $-4^2 = -(4 \cdot 4) = -16$, $(-4)^2$ pa $16$.« -/
theorem oklepaj_odloca :
    -(4:ℝ) ^ 2 = -(4 * 4) ∧ -((4:ℝ) * 4) = -16 ∧ ((-4):ℝ) ^ 2 = 16 ∧ ((-3):ℝ) ^ 2 = 9 ∧
    -(3:ℝ) ^ 2 = -9 := by norm_num

/-- Povzetek: −a² je za a ≠ 0 negativno.
trditev: MAT-OS-8/kvadrat-stevila#minus-kvadrat-negativen
besedilo: »toda $-a^2$ je za $a \ne 0$ negativno« -/
theorem minus_kvadrat_negativen (a : ℝ) (ha : a ≠ 0) : -a ^ 2 < 0 := by
  have := pow_pos (abs_pos.mpr ha) 2
  rw [sq_abs] at this
  linarith

/-- Predpostavka `minus_kvadrat_negativen` se da izpolniti (a = 4). -/
example : (4:ℝ) ≠ 0 := by norm_num

/-! ## Korak 5: ulomki in decimalna števila -/

/-- Korak 5: (2/3)² = (2 · 2)/(3 · 3) = 4/9; (0,3)² = 0,09, ker je 3 · 3 = 9; preizkus (0,5)² = 0,25.
trditev: MAT-OS-8/kvadrat-stevila#ulomki-decimalke
besedilo: »$\left(\dfrac{2}{3}\right)^2 = \dfrac{2 \cdot 2}{3 \cdot 3} = \dfrac{4}{9}$« -/
theorem ulomki_decimalke :
    ((2:ℝ) / 3) ^ 2 = (2 * 2) / (3 * 3) ∧ ((2:ℝ) * 2) / (3 * 3) = 4 / 9 ∧ (0.3:ℝ) ^ 2 = 0.09 ∧
    (3:ℝ) * 3 = 9 ∧ (0.5:ℝ) ^ 2 = 0.25 := by norm_num

/-- Korak 5, Primer 2, Povzetek: kvadrat ulomka (b ≠ 0): (a/b)² = a²/b².
trditev: MAT-OS-8/kvadrat-stevila#kvadrat-ulomka
besedilo: »Kvadrat ulomka: $\left(\dfrac{a}{b}\right)^2 = \dfrac{a^2}{b^2}$« -/
theorem kvadrat_ulomka (a b : ℝ) (_hb : b ≠ 0) : (a / b) ^ 2 = a ^ 2 / b ^ 2 := div_pow a b 2

/-- Predpostavka `kvadrat_ulomka` se da izpolniti (b = 5). -/
example : (5:ℝ) ≠ 0 := by norm_num

/-- Korak 5, Primer 2, Povzetek: kvadrat decimalnega števila z k decimalkami (m/10ᵏ) ima dvakrat toliko
decimalk: (m/10ᵏ)² = m²/10²ᵏ (imenovalec 10²ᵏ; da je decimalk natanko 2k, je `decimalke_natanko`).
trditev: MAT-OS-8/kvadrat-stevila#decimalke
besedilo: »Pri decimalnem številu najprej pomnožimo brez vejice, nato štejemo decimalke.« -/
theorem decimalke (m : ℝ) (k : ℕ) : (m / 10 ^ k) ^ 2 = m ^ 2 / 10 ^ (2 * k) := by
  rw [div_pow, ← pow_mul, mul_comm k 2]

/-- Korak 5, Primer 2, Povzetek: decimalk je natanko dvakrat toliko: če ima m/10ᵏ natanko k decimalk
(zadnja števka m ni 0, torej 10 ∤ m), tudi zadnja števka m² ni 0, zato ima m²/10²ᵏ natanko 2k decimalk.
pomozno – lekcija ne pove, da se kvadrat števila, ki se ne konča z 0, tudi ne konča z 0; pravilo »dvakrat toliko decimalk« trdi več in ga navaja decimalke -/
theorem decimalke_natanko (m : ℕ) (hm : ¬ 10 ∣ m) : ¬ 10 ∣ m ^ 2 := by
  intro h
  apply hm
  have h2 : 2 ∣ m := Nat.prime_two.dvd_of_dvd_pow (Nat.dvd_trans (by norm_num) h)
  have h5 : 5 ∣ m := (by norm_num : Nat.Prime 5).dvd_of_dvd_pow (Nat.dvd_trans (by norm_num) h)
  exact Nat.Coprime.mul_dvd_of_dvd_of_dvd (by norm_num) h2 h5

/-- Predpostavka `decimalke_natanko` se da izpolniti (m = 12, kot pri 1,2). -/
example : ¬ 10 ∣ (12:ℕ) := by norm_num

/-- Korak 5, Premisli: 3² = 9 > 3, 1² = 1, (0,5)² = 0,25 < 0,5.
trditev: MAT-OS-8/kvadrat-stevila#premisli-vecji
besedilo: »Ne. $3^2 = 9$ je več kot $3$; $1^2 = 1$ je enako $1$; $(0{,}5)^2 = 0{,}25$ pa je manj kot $0{,}5$.« -/
theorem premisli_vecji : (3:ℝ) ^ 2 = 9 ∧ (3:ℝ) < 9 ∧ (1:ℝ) ^ 2 = 1 ∧ (0.5:ℝ) ^ 2 = 0.25 ∧
    (0.25:ℝ) < 0.5 := by norm_num

/-- Korak 5, Premisli: kvadrat je večji od števila natanko tedaj, ko je število večje od 1 ali negativno.
trditev: MAT-OS-8/kvadrat-stevila#kvadrat-vecji
besedilo: »Kvadrat je večji od števila le, če je število večje od $1$ ali negativno.« -/
theorem kvadrat_vecji (a : ℝ) : a < a ^ 2 ↔ 1 < a ∨ a < 0 := by
  constructor
  · intro h
    by_contra hc
    push Not at hc
    nlinarith [hc.1, hc.2]
  · rintro (h | h) <;> nlinarith

/-- Povzetek, Pogoste napake, Preveri se 4: kvadrat števila med 0 in 1 je manjši od števila.
trditev: MAT-OS-8/kvadrat-stevila#kvadrat-med-0-in-1
besedilo: »Kvadrat števila med $0$ in $1$ je manjši od števila.« -/
theorem kvadrat_med_0_in_1 (a : ℝ) (h0 : 0 < a) (h1 : a < 1) : a ^ 2 < a := by nlinarith

/-- Predpostavke `kvadrat_med_0_in_1` se dajo izpolniti (a = 0,9). -/
example : (0:ℝ) < 0.9 ∧ (0.9:ℝ) < 1 := by norm_num

/-- Preveri se 4, razlaga napačnega odgovora: število in njegov kvadrat sta enaka le pri 0 in 1.
trditev: MAT-OS-8/kvadrat-stevila#kvadrat-enak
besedilo: »Enaka sta le pri številih $0$ in $1$.« -/
theorem kvadrat_enak (a : ℝ) : a ^ 2 = a ↔ a = 0 ∨ a = 1 := by
  have : a ^ 2 - a = a * (a - 1) := by ring
  constructor
  · intro h
    have h2 : a * (a - 1) = 0 := by rw [← this]; linarith
    rcases mul_eq_zero.mp h2 with h3 | h3
    · exact Or.inl h3
    · exact Or.inr (by linarith)
  · rintro (rfl | rfl) <;> norm_num

/-! ## Korak 6: ocenjevanje -/

/-- Korak 6: za 0 ≤ a < b je a² < b² (zato kvadrat ujamemo med dva znana kvadrata).
trditev: MAT-OS-8/kvadrat-stevila#ocena
besedilo: »Števila, ki ga ni v tabeli, ujameš med dva znana kvadrata.« -/
theorem ocena (a b : ℝ) (ha : 0 ≤ a) (hab : a < b) : a ^ 2 < b ^ 2 := by nlinarith

/-- Predpostavke `ocena` se dajo izpolniti (a = 20, b = 27). -/
example : (0:ℝ) ≤ 20 ∧ (20:ℝ) < 27 := by norm_num

/-- Korak 6: 400 < 27² < 900, natančno 27² = 729, ki je bliže 900 kot 400.
trditev: MAT-OS-8/kvadrat-stevila#ocena-27
besedilo: »ker je $20 < 27 < 30$, je $400 < 27^2 < 900$. Ker je $27$ bliže $30$, bo kvadrat bliže $900$; natančno je $729$.« -/
theorem ocena_27 :
    (400:ℝ) < 27 ^ 2 ∧ (27:ℝ) ^ 2 < 900 ∧ (27:ℝ) ^ 2 = 729 ∧ (900:ℝ) - 729 < 729 - 400 := by norm_num

/-- Korak 6: 48² ≈ 50² = 2500, natančno 2304, kar je manj; (6,8)² = 46,24 < 7² = 49.
trditev: MAT-OS-8/kvadrat-stevila#ocena-48-68
besedilo: »Lahko pa osnovo zaokrožiš: $48^2 \approx 50^2 = 2500$. Pravi rezultat, $2304$, je malo manjši, ker je $48 < 50$. Enako gre z decimalnimi števili: $(6{,}8)^2$ je malo manj kot $7^2 = 49$, natančno $46{,}24$.« -/
theorem ocena_48_68 :
    (50:ℝ) ^ 2 = 2500 ∧ (48:ℝ) ^ 2 = 2304 ∧ (2304:ℝ) < 2500 ∧ (6.8:ℝ) ^ 2 = 46.24 ∧ (7:ℝ) ^ 2 = 49 ∧
    (46.24:ℝ) < 49 := by norm_num

/-- Korak 6, simulacija: 23² = (20 + 3)² = 20 · 20 + 20 · 3 + 20 · 3 + 3 · 3 = 400 + 60 + 60 + 9 = 529.
trditev: MAT-OS-8/kvadrat-stevila#razrez-23
besedilo: »zato je $23^2 = 400 + 60 + 60 + 9 = 529$« -/
theorem razrez_23 : (23:ℝ) ^ 2 = 529 := by
  calc (23:ℝ) ^ 2 = (20 + 3) ^ 2 := by norm_num
    _ = 20 * 20 + 20 * 3 + 20 * 3 + 3 * 3 := by ring
    _ = 400 + 60 + 60 + 9 := by norm_num
    _ = 529 := by norm_num

/-- Korak 6, preizkus: 31² = 961, malo več kot 30² = 900.
trditev: MAT-OS-8/kvadrat-stevila#ocena-31
besedilo: »(Rešitev: malo več kot $30^2 = 900$; natančno $961$.)« -/
theorem ocena_31 : (31:ℝ) ^ 2 = 961 ∧ (30:ℝ) ^ 2 = 900 ∧ (900:ℝ) < 961 := by norm_num

/-! ## Korak 7: zadnja števka -/

/-- Korak 7, Bolj natančno: zadnja števka kvadrata je odvisna le od zadnje števke osnove.
trditev: MAT-OS-8/kvadrat-stevila#zadnja-stevka
besedilo: »Zadnja števka kvadrata je odvisna le od zadnje števke osnove:« -/
theorem zadnja_stevka (n : ℕ) : n ^ 2 % 10 = (n % 10) ^ 2 % 10 := Nat.pow_mod n 2 10

/-- Korak 7: tabela zadnjih števk (0→0, 1→1, 2→4, 3→9, 4→6, 5→5, 6→6, 7→9, 8→4, 9→1).
trditev: MAT-OS-8/kvadrat-stevila#tabela-zadnjih-stevk
besedilo: »| $0$ | $0$ | $5$ | $5$ | | $1$ | $1$ | $6$ | $6$ | | $2$ | $4$ | $7$ | $9$ | | $3$ | $9$ | $8$ | $4$ | | $4$ | $6$ | $9$ | $1$ |« -/
theorem tabela_zadnjih_stevk (n : ℕ) :
    (n % 10 = 0 → n ^ 2 % 10 = 0) ∧ (n % 10 = 1 → n ^ 2 % 10 = 1) ∧ (n % 10 = 2 → n ^ 2 % 10 = 4) ∧
    (n % 10 = 3 → n ^ 2 % 10 = 9) ∧ (n % 10 = 4 → n ^ 2 % 10 = 6) ∧ (n % 10 = 5 → n ^ 2 % 10 = 5) ∧
    (n % 10 = 6 → n ^ 2 % 10 = 6) ∧ (n % 10 = 7 → n ^ 2 % 10 = 9) ∧ (n % 10 = 8 → n ^ 2 % 10 = 4) ∧
    (n % 10 = 9 → n ^ 2 % 10 = 1) := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_⟩ <;> intro h <;> rw [Nat.pow_mod, h]

/-- Korak 7, Povzetek, Bolj natančno: kvadrat naravnega števila se nikoli ne konča na 2, 3, 7 ali 8
(konča se na 0, 1, 4, 5, 6 ali 9).
trditev: MAT-OS-8/kvadrat-stevila#ni-2-3-7-8
besedilo: »Kvadrat naravnega števila se nikoli ne konča na $2$, $3$, $7$ ali $8$.« -/
theorem ni_2_3_7_8 (n : ℕ) :
    n ^ 2 % 10 = 0 ∨ n ^ 2 % 10 = 1 ∨ n ^ 2 % 10 = 4 ∨ n ^ 2 % 10 = 5 ∨ n ^ 2 % 10 = 6 ∨
    n ^ 2 % 10 = 9 := by
  rw [Nat.pow_mod]
  have h : n % 10 < 10 := Nat.mod_lt _ (by norm_num)
  interval_cases n % 10 <;> simp

/-- Korak 7: 1237 ne more biti popolni kvadrat (konča se na 7).
trditev: MAT-OS-8/kvadrat-stevila#ni-kvadrat-1237
besedilo: »Število $1237$ zato ne more biti popolni kvadrat.« -/
theorem ni_kvadrat_1237 : ¬ ∃ n : ℕ, n ^ 2 = 1237 := by
  rintro ⟨n, hn⟩
  have := ni_2_3_7_8 n
  rw [hn] at this
  norm_num at this

/-- Korak 7, preizkus: 38² se konča na 4, ker je 8 · 8 = 64.
trditev: MAT-OS-8/kvadrat-stevila#stevka-38
besedilo: »(Rešitev: na $4$, ker je $8 \cdot 8 = 64$.)« -/
theorem stevka_38 : (38:ℕ) ^ 2 % 10 = 4 ∧ 8 * 8 = 64 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: 9² = 9 · 9 = 81; (−6)² = (−6) · (−6) = 36; −6² = −(6 · 6) = −36.
trditev: MAT-OS-8/kvadrat-stevila#primer1
besedilo: »Odgovor: vrednosti so $81$, $36$ in $-36$.« -/
theorem primer1 : (9:ℝ) ^ 2 = 81 ∧ ((-6):ℝ) ^ 2 = 36 ∧ -(6:ℝ) ^ 2 = -36 := by
  refine ⟨?_, ?_, ?_⟩
  · calc (9:ℝ) ^ 2 = 9 * 9 := sq 9
      _ = 81 := by norm_num
  · calc ((-6):ℝ) ^ 2 = (-6) * (-6) := sq (-6)
      _ = 36 := by norm_num
  · calc -(6:ℝ) ^ 2 = -(6 * 6) := by rw [sq]
      _ = -36 := by norm_num

/-- Primer 2: (3/5)² = 3²/5² = 9/25; 12 · 12 = 144, (1,2)² = 1,44, kar je malo več kot 1.
trditev: MAT-OS-8/kvadrat-stevila#primer2
besedilo: »Odgovor: $\left(\dfrac{3}{5}\right)^2 = \dfrac{9}{25}$ in $(1{,}2)^2 = 1{,}44$.« -/
theorem primer2 :
    ((3:ℝ) / 5) ^ 2 = 9 / 25 ∧ (12:ℝ) * 12 = 144 ∧ (1.2:ℝ) ^ 2 = 1.44 ∧ (1:ℝ) < 1.44 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  calc ((3:ℝ) / 5) ^ 2 = 3 ^ 2 / 5 ^ 2 := div_pow 3 5 2
    _ = 9 / 25 := by norm_num

/-- Primer 3, korak 1: 20 < 23 < 25, zato je 23² med 400 in 625.
trditev: MAT-OS-8/kvadrat-stevila#primer3-ocena
besedilo: »Ocena: $20 < 23 < 25$, zato je $23^2$ med $400$ in $625$.« -/
theorem primer3_ocena : (20:ℝ) ^ 2 = 400 ∧ (25:ℝ) ^ 2 = 625 ∧ (400:ℝ) < 23 ^ 2 ∧ (23:ℝ) ^ 2 < 625 := by
  norm_num

/-- Primer 3, korak 2: 23² = 23 · 20 + 23 · 3 = 460 + 69 = 529; zadnja števka 9 = 3 · 3.
trditev: MAT-OS-8/kvadrat-stevila#primer3-racun
besedilo: »Račun po delih: $23^2 = 23 \cdot 20 + 23 \cdot 3 = 460 + 69 = 529$, torej $p_2 = 529\,\text{cm}^2$. Zadnja števka se ujema: $3 \cdot 3 = 9$.« -/
theorem primer3_racun : (23:ℝ) ^ 2 = 529 ∧ (529:ℕ) % 10 = 3 * 3 := by
  refine ⟨?_, by norm_num⟩
  calc (23:ℝ) ^ 2 = 23 * 20 + 23 * 3 := by norm_num
    _ = 460 + 69 := by norm_num
    _ = 529 := by norm_num

/-- Primer 3, koraki 3–6: p₁ = 20² = 400; 529/400 = 1,3225 ≈ 1,32 ≈ 1,3 (napaki < 0,005 in < 0,05);
200 · 1,3 = 260 (g); dno je večje za 529 − 400 = 129 (cm²).
trditev: MAT-OS-8/kvadrat-stevila#primer3-odgovor
besedilo: »potrebuješ približno $1{,}3$-krat več testa in okoli $260\,\text{g}$ čokolade. Stranica je daljša le za $3\,\text{cm}$, dno pa je večje za $129\,\text{cm}^2$.« -/
theorem primer3_razmerje :
    (20:ℝ) ^ 2 = 400 ∧ (529:ℝ) / 400 = 1.3225 ∧ |(529:ℝ) / 400 - 1.32| < 0.005 ∧
    |(529:ℝ) / 400 - 1.3| < 0.05 ∧ (200:ℝ) * 1.3 = 260 ∧ (529:ℝ) - 400 = 129 := by
  refine ⟨by norm_num, by norm_num, ?_, ?_, by norm_num, by norm_num⟩ <;>
    rw [abs_lt] <;> constructor <;> norm_num

/-- Primer 4: 2,9 < 3, zato (2,9)² < 3² = 9; 29 · 29 = 841; (2,9)² = 8,41.
trditev: MAT-OS-8/kvadrat-stevila#primer4
besedilo: »$(2{,}9)^2 = 8{,}41$, torej $p = 8{,}41\,\text{dm}^2$. To je malo manj kot $9$, kot je napovedala ocena.« -/
theorem primer4 :
    (2.9:ℝ) ^ 2 < 3 ^ 2 ∧ (3:ℝ) ^ 2 = 9 ∧ (29:ℝ) * 29 = 841 ∧ (2.9:ℝ) ^ 2 = 8.41 ∧ (8.41:ℝ) < 9 := by
  norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake: 7² = 7 · 7 = 49, ne 7 · 2 = 14.
trditev: MAT-OS-8/kvadrat-stevila#napaka-krat-dva
besedilo: »Eksponent pove, kolikokrat je osnova faktor v produktu: $7^2 = 7 \cdot 7 = 49$.« -/
theorem napaka_krat_dva : (7:ℝ) ^ 2 = 7 * 7 ∧ (7:ℝ) * 7 = 49 ∧ (7:ℝ) ^ 2 ≠ 7 * 2 := by norm_num

/-- Pogoste napake: (−5)² = 25 (ne −25), −5² = −25 (ne 25).
trditev: MAT-OS-8/kvadrat-stevila#napaka-minus
besedilo: »Pri $(-5)^2$ kvadriramo celo negativno število in dobimo $25$; pri $-5^2$ se kvadrira le $5$, rezultat je $-25$.« -/
theorem napaka_minus : ((-5):ℝ) ^ 2 = 25 ∧ -(5:ℝ) ^ 2 = -25 ∧ ((-5):ℝ) ^ 2 ≠ -25 ∧ -(5:ℝ) ^ 2 ≠ 25 := by
  norm_num

/-- Pogoste napake: (0,4)² = 0,16 (ne 1,6 ne 0,016), in 0,16 < 0,4.
trditev: MAT-OS-8/kvadrat-stevila#napaka-vejica
besedilo: »Kvadrat ima dvakrat toliko decimalk kot osnova: $0{,}16$.« -/
theorem napaka_vejica :
    (0.4:ℝ) ^ 2 = 0.16 ∧ (0.4:ℝ) ^ 2 ≠ 1.6 ∧ (0.4:ℝ) ^ 2 ≠ 0.016 ∧ (0.16:ℝ) < 0.4 := by norm_num

/-- Pogoste napake: (3 + 4)² = 7² = 49 ≠ 3² + 4² = 25; manjkata dva pravokotnika 3 × 4: 25 + 24 = 49.
trditev: MAT-OS-8/kvadrat-stevila#napaka-vsota
besedilo: »$(3 + 4)^2 = 3^2 + 4^2 = 25$ je napačno. Najprej izračunaj oklepaj: $7^2 = 49$. Do kvadrata $7 \times 7$ manjkata dva pravokotnika $3 \times 4$, in res je $25 + 24 = 49$.« -/
theorem napaka_vsota :
    ((3:ℝ) + 4) ^ 2 = 7 ^ 2 ∧ (7:ℝ) ^ 2 = 49 ∧ (3:ℝ) ^ 2 + 4 ^ 2 = 25 ∧ ((3:ℝ) + 4) ^ 2 ≠ 3 ^ 2 + 4 ^ 2 ∧
    (2:ℝ) * (3 * 4) = 24 ∧ (25:ℝ) + 24 = 49 ∧ ((3:ℝ) + 4) ^ 2 = 3 ^ 2 + 4 ^ 2 + 2 * (3 * 4) := by
  norm_num

/-! ## Drugače: na sliki in bolj natančno -/

/-- Na sliki: 4 vrstice po 4 je 16 = 4²; dodani L šteje 4 + 4 + 1 = 9, zato 5² = 16 + 9 = 25.
trditev: MAT-OS-8/kvadrat-stevila#na-sliki
besedilo: »Dodani del ima obliko črke L in šteje $4 + 4 + 1 = 9$ kvadratkov, zato je $5^2 = 16 + 9 = 25$.« -/
theorem na_sliki : (4:ℝ) * 4 = 16 ∧ (4:ℝ) ^ 2 = 16 ∧ (4:ℝ) + 4 + 1 = 9 ∧ (5:ℝ) ^ 2 = 16 + 9 ∧
    (16:ℝ) + 9 = 25 := by norm_num

/-- Bolj natančno: (n + 1)² = n² + 2n + 1; za n = 4: 5² = 16 + 9 = 25.
trditev: MAT-OS-8/kvadrat-stevila#naslednji-kvadrat
besedilo: »$$(n+1)^2 = n^2 + 2n + 1$$« -/
theorem naslednji_kvadrat (n : ℝ) : (n + 1) ^ 2 = n ^ 2 + 2 * n + 1 := by ring

/-- Na sliki, Bolj natančno: vsak naslednji L je za 2 večji, in 2n + 1 je vedno liho.
trditev: MAT-OS-8/kvadrat-stevila#l-liho
besedilo: »Vsak naslednji L je za $2$ kvadratka večji« -/
theorem l_liho (n : ℕ) : (2 * (n + 1) + 1) - (2 * n + 1) = 2 ∧ Odd (2 * n + 1) :=
  ⟨by omega, ⟨n, rfl⟩⟩

/-- Na sliki, Bolj natančno: n² je vsota prvih n lihih števil 1 + 3 + 5 + … + (2n − 1).
trditev: MAT-OS-8/kvadrat-stevila#vsota-lihih
besedilo: »je $n^2$ vsota prvih $n$ lihih števil« -/
theorem vsota_lihih (n : ℕ) : ∑ i ∈ Finset.range n, (2 * i + 1) = n ^ 2 := by
  induction n with
  | zero => simp
  | succ k ih => rw [Finset.sum_range_succ, ih]; ring

/-- Na sliki: 1, 1 + 3, 1 + 3 + 5, 1 + 3 + 5 + 7 so 1, 4, 9, 16.
trditev: MAT-OS-8/kvadrat-stevila#vsote-lihih
besedilo: »zato so kvadrati vsote zaporednih lihih števil: $$1,\quad 1+3,\quad 1+3+5,\quad 1+3+5+7,\ \dots$$« -/
theorem vsote_lihih : (1:ℕ) = 1 ^ 2 ∧ 1 + 3 = 2 ^ 2 ∧ 1 + 3 + 5 = 3 ^ 2 ∧ 1 + 3 + 5 + 7 = 4 ^ 2 := by
  norm_num

/-- Na sliki: iz 3² = 9 dobiš 6² = 36 = 4 · 9.
trditev: MAT-OS-8/kvadrat-stevila#sest-na-kvadrat
besedilo: »Iz $3^2 = 9$ tako dobiš $6^2 = 36 = 4 \cdot 9$.« -/
theorem sest_na_kvadrat : (3:ℝ) ^ 2 = 9 ∧ (6:ℝ) ^ 2 = 36 ∧ (36:ℝ) = 4 * 9 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1: pravilna je (−3)² = 3² (= 9); napačne so (−6)² = −36, (0,2)² = 0,4 (to je 0,2 · 2;
pravilno 0,04) in −3² = 9 (pravilno −9).
trditev: MAT-OS-8/kvadrat-stevila#preveri1
besedilo: »$(-3)^2 = (-3) \cdot (-3) = 9$ in $3^2 = 9$. Nasprotni števili imata enak kvadrat.« -/
theorem preveri1 :
    ((-3):ℝ) ^ 2 = 3 ^ 2 ∧ (3:ℝ) ^ 2 = 9 ∧ ((-6):ℝ) ^ 2 ≠ -36 ∧ (0.2:ℝ) ^ 2 ≠ 0.4 ∧ (0.2:ℝ) * 2 = 0.4 ∧
    (0.2:ℝ) ^ 2 = 0.04 ∧ -(3:ℝ) ^ 2 ≠ 9 ∧ -(3:ℝ) ^ 2 = -9 := by norm_num

/-- Preveri se 2: (3/4)² = (3 · 3)/(4 · 4) = 9/16; ni 6/8, 9/4 ali 3/16.
trditev: MAT-OS-8/kvadrat-stevila#preveri2
besedilo: »$\left(\dfrac{3}{4}\right)^2 = \dfrac{3 \cdot 3}{4 \cdot 4} = \dfrac{9}{16}$.« -/
theorem preveri2 :
    ((3:ℝ) / 4) ^ 2 = (3 * 3) / (4 * 4) ∧ ((3:ℝ) * 3) / (4 * 4) = 9 / 16 ∧ ((3:ℝ) / 4) ^ 2 ≠ 6 / 8 ∧
    ((3:ℝ) / 4) ^ 2 ≠ 9 / 4 ∧ ((3:ℝ) / 4) ^ 2 ≠ 3 / 16 := by norm_num

/-- Preveri se 3: (0,7)² = 0,7 · 0,7 = 0,49 (7 · 7 = 49); ne 4,9, ne 0,049; 0,7 · 2 = 1,4.
trditev: MAT-OS-8/kvadrat-stevila#preveri3
besedilo: »$7 \cdot 7 = 49$; ker ima $0{,}7$ eno decimalko, ima kvadrat dve: $(0{,}7)^2 = 0{,}49$.« -/
theorem preveri3 :
    (0.7:ℝ) ^ 2 = 0.7 * 0.7 ∧ (0.7:ℝ) * 0.7 = 0.49 ∧ (7:ℝ) * 7 = 49 ∧ (0.7:ℝ) * 0.7 ≠ 4.9 ∧
    (0.7:ℝ) ^ 2 ≠ 0.049 ∧ (0.7:ℝ) * 2 = 1.4 := by norm_num

/-- Preveri se 4: (0,9)² = 0,81 < 0,9.
trditev: MAT-OS-8/kvadrat-stevila#preveri4
besedilo: »$(0{,}9)^2 = 0{,}81$, kar je manj kot $0{,}90$.« -/
theorem preveri4 : (0.9:ℝ) ^ 2 = 0.81 ∧ (0.9:ℝ) ^ 2 < 0.9 := by norm_num

/-- Preveri se 5: 19² = 361, malo manj kot 20² = 400; napačne ocene 2 · 20 = 40, 4 · 20 = 80 in 4000
(20 · 20 = 400, ne 4000).
trditev: MAT-OS-8/kvadrat-stevila#preveri5
besedilo: »$19$ je malo manj kot $20$, zato je $19^2$ malo manj kot $20^2 = 400$. Natančno: $19^2 = 361\,\text{cm}^2$.« -/
theorem preveri5 :
    (19:ℝ) ^ 2 = 361 ∧ (20:ℝ) ^ 2 = 400 ∧ (361:ℝ) < 400 ∧ (2:ℝ) * 20 = 40 ∧ (4:ℝ) * 20 = 80 ∧
    (20:ℝ) * 20 ≠ 4000 := by
  norm_num

end Evklid.Lekcije.MAT_OS_8.KvadratStevila
