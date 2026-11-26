/-
vir: content/lessons/MAT-OS-9/linearne-neenacbe.md
sha256: 607dd163ea335deb3c74cf25f56cfa16754108b863afbbf128a2de09dd1c0160
Model: števila so realna števila brez enot (€, km, L, %, h so le v docstringih); decimalna števila so točni
ulomki v ℝ (0,5 = 1/2, 0,06 = 6/100, 3,9 = 39/10). Reševanje neenačbe je veriga `calc` ekvivalenc (↔) z vmesnimi
neenačbami iz lekcije, zato je dokazana celotna množica rešitev (obe smeri). Preizkusi so posebni računi.
Ni v Leanu: risbe številske premice (krogci in barvanje) kot slike; dokazano je, kar risba pomeni: pri strogem
znaku meja ni rešitev, pri nestrogem je, in rešitve so na pravi strani meje; simulacija »Linearne neenačbe«;
poimenovanja (stroga/nestroga, linearna neenačba, interval (−3, ∞)) in postopek v 5 korakih kot navodilo
(odpravljanje ulomkov z najmanjšim skupnim večkratnikom je dokazano kot množenje s pozitivnim številom);
prevod zgodb v neenačbo (»vsaj« → ≥, »največ« → ≤, kviz 1 je dokazan le kot to, da 12 izpolni d ≤ 12 in ne
d < 12, ter da 11 izpolni d ≤ 12, ne pa d ≥ 12); smiselnost rešitev (»razdalja ne more biti negativna«: dokazana
je le množica 0 ≤ x ≤ 600 za x ≥ 0 oziroma 0 ≤ x ≤ 12); »prezrcali čez 0 na premici« kot slika (dokazano
−2 > −5); zemljevid v merilu 1 : 100 000 je dokazan le kot račun 100 000 cm = 1 km in razdalja 10 km → 10 cm
(»po zračni črti, cesta je daljša« je opis); »Neenačba ima običajno neskončno mnogo rešitev« je dokazana za
x < 4 (množica rešitev je neskončna); vrstni red korakov v kvizu 2 je dokazan kot pravilnost vsakega koraka.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.LinearneNeenacbe

/-! ## Zakaj se tega učimo in razlaga 1–3 -/

/-- Razlaga 2: rešitve neenačbe x < 4 so med drugim 3, 0, −5 in 3,9; število 4 ni rešitev, ker 4 < 4 ne drži. -/
theorem resitve_x_lt_4 :
    (3:ℝ) < 4 ∧ (0:ℝ) < 4 ∧ (-5:ℝ) < 4 ∧ (39/10:ℝ) < 4 ∧ ¬ ((4:ℝ) < 4) := by norm_num

/-- Razlaga 2 in Povzetek (»neenačba ima običajno neskončno mnogo rešitev«): množica rešitev x < 4 je
neskončna. -/
theorem resitve_x_lt_4_neskoncno : {x : ℝ | x < 4}.Infinite := Set.Iio_infinite 4

/-- Razlaga 3 (avtobus): 2 + 0,5x ≤ 8 ima rešitve natanko x ≤ 12, po korakih lekcije: odštejemo 2
(0,5x ≤ 6), delimo z 0,5 (x ≤ 12). -/
theorem avtobus (x : ℝ) : 2 + 1/2 * x ≤ 8 ↔ x ≤ 12 := by
  calc 2 + 1/2 * x ≤ 8 ↔ 1/2 * x ≤ 6 := by constructor <;> intro h <;> linarith
    _ ↔ x ≤ 12 := by constructor <;> intro h <;> linarith

/-- Razlaga 3, preizkus: pri x = 10 je cena 2 + 5 = 7 ≤ 8, pri x = 14 je 2 + 7 = 9 > 8. -/
theorem avtobus_preizkus :
    (2:ℝ) + 1/2 * 10 = 2 + 5 ∧ (2:ℝ) + 5 = 7 ∧ (7:ℝ) ≤ 8 ∧
    (2:ℝ) + 1/2 * 14 = 2 + 7 ∧ (2:ℝ) + 7 = 9 ∧ ¬ ((9:ℝ) ≤ 8) := by norm_num

/-- Razlaga 5, premisli: pri x = 12 km je cena točno 8 € (meja je rešitev, poln krogec); če je x ≥ 0 (razdalja),
so rešitve natanko 0 ≤ x ≤ 12. -/
theorem avtobus_meja (x : ℝ) (hx : 0 ≤ x) : (2:ℝ) + 1/2 * 12 = 8 ∧ (2 + 1/2 * x ≤ 8 ↔ 0 ≤ x ∧ x ≤ 12) := by
  refine ⟨by norm_num, ?_⟩
  rw [avtobus]
  exact ⟨fun h => ⟨hx, h⟩, fun h => h.2⟩

/-- Predpostavka `avtobus_meja` se da izpolniti (x = 5). -/
example : (0:ℝ) ≤ 5 := by norm_num

/-- Razlaga 3 (pravilo): prištevanje ali odštevanje istega števila na obeh straneh ne spremeni rešitev
(za <, ≤ in za odštevanje). -/
theorem pristevanje (a b c : ℝ) :
    (a < b ↔ a + c < b + c) ∧ (a ≤ b ↔ a + c ≤ b + c) ∧ (a < b ↔ a - c < b - c) ∧ (a ≤ b ↔ a - c ≤ b - c) :=
  ⟨(add_lt_add_iff_right c).symm, (add_le_add_iff_right c).symm, (sub_lt_sub_iff_right c).symm,
    (sub_le_sub_iff_right c).symm⟩

/-- Razlaga 3 (pravilo): množenje ali deljenje obeh strani z istim pozitivnim številom ne spremeni rešitev. -/
theorem mnozenje_pozitivno (a b c : ℝ) (hc : 0 < c) :
    (a < b ↔ a * c < b * c) ∧ (a ≤ b ↔ a * c ≤ b * c) ∧ (a < b ↔ a / c < b / c) ∧ (a ≤ b ↔ a / c ≤ b / c) :=
  ⟨(mul_lt_mul_iff_left₀ hc).symm, (mul_le_mul_iff_left₀ hc).symm, (div_lt_div_iff_of_pos_right hc).symm,
    (div_le_div_iff_of_pos_right hc).symm⟩

/-- Predpostavka `mnozenje_pozitivno` se da izpolniti (c = 2). -/
example : (0:ℝ) < 2 := by norm_num

/-! ## Razlaga 4: množenje z negativnim številom -/

/-- Razlaga 4: »reševanje kot pri enačbi brez obrata« da x < −3, kar je napačno: −4 bi bilo po tem rešitev,
a −2·(−4) = 8 in 8 < 6 ne drži. -/
theorem skusnjava : (-4:ℝ) < -3 ∧ (-2:ℝ) * (-4) = 8 ∧ ¬ ((8:ℝ) < 6) := by norm_num

/-- Razlaga 4, premisli: 0 je rešitev −2x < 6 (−2·0 = 0 < 6), ni pa manjše od −3. -/
theorem skusnjava_nic : (-2:ℝ) * 0 = 0 ∧ (0:ℝ) < 6 ∧ ¬ ((0:ℝ) < -3) := by norm_num

/-- Razlaga 4 (popravek): −2x < 6 ima rešitve natanko x > −3. -/
theorem minus_2x (x : ℝ) : -2 * x < 6 ↔ x > -3 := by
  constructor <;> intro h <;> linarith

/-- Razlaga 4 (pravilo): pri množenju ali deljenju z negativnim številom se znak obrne (< postane >,
≤ postane ≥ in obratno). -/
theorem mnozenje_negativno (a b c : ℝ) (hc : c < 0) :
    (a < b ↔ a * c > b * c) ∧ (a ≤ b ↔ a * c ≥ b * c) ∧ (a < b ↔ a / c > b / c) ∧ (a ≤ b ↔ a / c ≥ b / c) :=
  ⟨(mul_lt_mul_right_of_neg hc).symm, (mul_le_mul_right_of_neg hc).symm, (div_lt_div_right_of_neg hc).symm,
    (div_le_div_right_of_neg hc).symm⟩

/-- Predpostavka `mnozenje_negativno` se da izpolniti (c = −1). -/
example : (-1:ℝ) < 0 := by norm_num

/-- Razlaga 4 (zakaj): iz 2 < 5 po množenju z −1 dobimo −2 in −5, in velja −2 > −5. -/
theorem obrat_primer : (2:ℝ) < 5 ∧ (2:ℝ) * (-1) = -2 ∧ (5:ℝ) * (-1) = -5 ∧ (-2:ℝ) > -5 := by norm_num

/-! ## Razlaga 5 in 6: zapis na premici, ulomki -/

/-- Razlaga 5: pri strogi neenakosti x > a meja a ni rešitev (prazen krogec), pri nestrogi x ≥ a je (poln
krogec); enako za < in ≤. -/
theorem meja (a : ℝ) : ¬ (a > a) ∧ a ≥ a ∧ ¬ (a < a) ∧ a ≤ a := by
  exact ⟨lt_irrefl a, le_refl a, lt_irrefl a, le_refl a⟩

/-- Razlaga 5: pri x > a so rešitve desno od a (a + h za vsak h > 0 je rešitev, a − h ni). -/
theorem smer_barvanja (a h : ℝ) (hh : 0 < h) : a + h > a ∧ ¬ (a - h > a) ∧ a - h < a ∧ ¬ (a + h < a) := by
  refine ⟨?_, ?_, ?_, ?_⟩ <;> [linarith; (intro h'; linarith); linarith; (intro h'; linarith)]

/-- Predpostavka `smer_barvanja` se da izpolniti (h = 1). -/
example : (0:ℝ) < 1 := by norm_num

/-- Razlaga 6, korak 1: najmanjši skupni večkratnik imenovalcev je pozitiven, zato množenje z njim znaka ne
obrne (npr. lcm(2, 3) = 6 > 0). -/
theorem nsv_pozitiven (m n : ℕ) (hm : 0 < m) (hn : 0 < n) : 0 < Nat.lcm m n := Nat.lcm_pos hm hn

/-- Predpostavki `nsv_pozitiven` se dasta izpolniti (m = 2, n = 3, lcm = 6). -/
example : 0 < 2 ∧ 0 < 3 ∧ Nat.lcm 2 3 = 6 := by decide

/-! ## Rešeni primeri -/

/-- Primer 1: x + 5 > 9 ima rešitve natanko x > 4, po korakih: x + 5 − 5 > 9 − 5, x > 4. -/
theorem primer1 (x : ℝ) : x + 5 > 9 ↔ x > 4 := by
  calc x + 5 > 9 ↔ x + 5 - 5 > 9 - 5 := by constructor <;> intro h <;> linarith
    _ ↔ x > 4 := by constructor <;> intro h <;> linarith

/-- Primer 1, preizkus: pri x = 5 je 5 + 5 = 10 > 9; pri x = 4 je 9 > 9 napačno. -/
theorem primer1_preizkus : (5:ℝ) + 5 = 10 ∧ (10:ℝ) > 9 ∧ (4:ℝ) + 5 = 9 ∧ ¬ ((9:ℝ) > 9) := by norm_num

/-- Primer 2: 3x − 7 ≤ 8 ima rešitve natanko x ≤ 5, po korakih: 3x ≤ 15, x ≤ 5. -/
theorem primer2 (x : ℝ) : 3 * x - 7 ≤ 8 ↔ x ≤ 5 := by
  calc 3 * x - 7 ≤ 8 ↔ 3 * x ≤ 15 := by constructor <;> intro h <;> linarith
    _ ↔ x ≤ 5 := by constructor <;> intro h <;> linarith

/-- Primer 2, preizkus: 3·5 − 7 = 8 ≤ 8; pri 0 je −7 ≤ 8; pri 6 je 11 ≤ 8 napačno. -/
theorem primer2_preizkus :
    (3:ℝ) * 5 - 7 = 8 ∧ (8:ℝ) ≤ 8 ∧ (3:ℝ) * 0 - 7 = -7 ∧ (-7:ℝ) ≤ 8 ∧ (3:ℝ) * 6 - 7 = 11 ∧ ¬ ((11:ℝ) ≤ 8) := by
  norm_num

/-- Primer 3 (gorivo): 45 − 0,06x ≥ 9 ima rešitve natanko x ≤ 600, po korakih: −0,06x ≥ −36, x ≤ 600. -/
theorem primer3 (x : ℝ) : 45 - 6/100 * x ≥ 9 ↔ x ≤ 600 := by
  calc 45 - 6/100 * x ≥ 9 ↔ -(6/100) * x ≥ -36 := by constructor <;> intro h <;> linarith
    _ ↔ x ≤ 600 := by constructor <;> intro h <;> linarith

/-- Primer 3, korak 4: za pot x ≥ 0 so rešitve natanko 0 ≤ x ≤ 600. -/
theorem primer3_pot (x : ℝ) (hx : 0 ≤ x) : 45 - 6/100 * x ≥ 9 ↔ 0 ≤ x ∧ x ≤ 600 := by
  rw [primer3]
  exact ⟨fun h => ⟨hx, h⟩, fun h => h.2⟩

/-- Predpostavka `primer3_pot` se da izpolniti (x = 100). -/
example : (0:ℝ) ≤ 100 := by norm_num

/-- Primer 3, preizkus: pri 600 km ostane 45 − 36 = 9 L, pri 700 km samo 3 L (premalo). -/
theorem primer3_preizkus :
    (45:ℝ) - 6/100 * 600 = 45 - 36 ∧ (45:ℝ) - 36 = 9 ∧ (45:ℝ) - 6/100 * 700 = 3 ∧ ¬ ((3:ℝ) ≥ 9) := by norm_num

/-- Primer 3 (pozabljen obrat): x ≥ 600 ni pravilna množica rešitev: x = 0 je rešitev, x = 700 pa ne. -/
theorem primer3_brez_obrata : ¬ ∀ x : ℝ, (45 - 6/100 * x ≥ 9 ↔ x ≥ 600) := by
  intro h
  have := (h 0).mp (by norm_num)
  norm_num at this

/-- Primer 4: 5 − 2x < 3x + 15 ima rešitve natanko x > −2, po korakih: 5 − 5x < 15, −5x < 10, x > −2. -/
theorem primer4 (x : ℝ) : 5 - 2 * x < 3 * x + 15 ↔ x > -2 := by
  calc 5 - 2 * x < 3 * x + 15 ↔ 5 - 5 * x < 15 := by constructor <;> intro h <;> linarith
    _ ↔ -5 * x < 10 := by constructor <;> intro h <;> linarith
    _ ↔ x > -2 := by constructor <;> intro h <;> linarith

/-- Primer 4, preizkus: pri x = 0 je 5 < 15; pri x = −3 je levo 11, desno 6, in 11 < 6 ne drži. -/
theorem primer4_preizkus :
    (5:ℝ) - 2 * 0 = 5 ∧ (3:ℝ) * 0 + 15 = 15 ∧ (5:ℝ) < 15 ∧
    (5:ℝ) - 2 * (-3) = 11 ∧ (3:ℝ) * (-3) + 15 = 6 ∧ ¬ ((11:ℝ) < 6) := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1: −3x > 12 ima rešitve natanko x < −4; x > −4 je napačno (0 > −4, a 0 > 12 ne drži). -/
theorem napaka_obrat (x : ℝ) : (-3 * x > 12 ↔ x < -4) ∧ ((0:ℝ) > -4 ∧ ¬ ((-3:ℝ) * 0 > 12)) := by
  refine ⟨by constructor <;> intro h <;> linarith, by norm_num⟩

/-- Pogoste napake 2: 2x > −6 ima rešitve natanko x > −3 (delimo s pozitivnim 2, znak ostane). -/
theorem napaka_minus (x : ℝ) : 2 * x > -6 ↔ x > -3 := by
  constructor <;> intro h <;> linarith

/-- Pogoste napake 3: 5 je rešitev x ≤ 5, ker 5 ≤ 5 drži (poln krogec). -/
theorem napaka_krogec : (5:ℝ) ≤ 5 := le_refl 5

/-- Pogoste napake 4 in 5: −2 < x je isto kot x > −2 (ne x < −2); rešitve so desno od −2, npr. 0. -/
theorem napaka_strani (x : ℝ) : (-2 < x ↔ x > -2) ∧ ((-2:ℝ) < 0) ∧ ¬ ((-2 < (0:ℝ)) ↔ (0:ℝ) < -2) := by
  refine ⟨Iff.rfl, by norm_num, by norm_num⟩

/-! ## Drugače: Kot zgodba, korak za korakom, bolj natančno -/

/-- Kot zgodba: 100 − 4x ≥ 20 ima rešitve natanko x ≤ 20, po korakih: −4x ≥ −80, x ≤ 20. -/
theorem kolo (x : ℝ) : 100 - 4 * x ≥ 20 ↔ x ≤ 20 := by
  calc 100 - 4 * x ≥ 20 ↔ -4 * x ≥ -80 := by constructor <;> intro h <;> linarith
    _ ↔ x ≤ 20 := by constructor <;> intro h <;> linarith

/-- Kot zgodba: Majin zapis x ≥ 20 je napačen: pri x = 5 ostane 100 − 20 = 80 % ≥ 20 %, a 5 ≥ 20 ne drži. -/
theorem kolo_napaka : (100:ℝ) - 4 * 5 = 100 - 20 ∧ (100:ℝ) - 20 = 80 ∧ (80:ℝ) ≥ 20 ∧ ¬ ((5:ℝ) ≥ 20) := by
  norm_num

/-- Kot zgodba: pot tja in nazaj (2x) največ 20 km pomeni koča največ 10 km daleč (2x ≤ 20 ↔ x ≤ 10). -/
theorem kolo_tja_nazaj (x : ℝ) : 2 * x ≤ 20 ↔ x ≤ 10 := by
  constructor <;> intro h <;> linarith

/-- Kot zgodba: v merilu 1 : 100 000 je 1 cm na zemljevidu 100 000 cm = 1 km v naravi (1 km = 1000 m,
1 m = 100 cm), zato je 10 km na zemljevidu 10 cm. -/
theorem merilo : (1:ℝ) * 100000 = 1000 * 100 ∧ (10:ℝ) * 100000 / 100000 = 10 := by norm_num

/-- Korak za korakom: −4x + 6 ≥ 18 ima rešitve natanko x ≤ −3, po korakih: −4x ≥ 12, x ≤ −3. -/
theorem korak (x : ℝ) : -4 * x + 6 ≥ 18 ↔ x ≤ -3 := by
  calc -4 * x + 6 ≥ 18 ↔ -4 * x ≥ 12 := by constructor <;> intro h <;> linarith
    _ ↔ x ≤ -3 := by constructor <;> intro h <;> linarith

/-- Korak za korakom, preizkus s tremi števili: −5 → 26 (≥ 18), −3 → 18 (≥ 18), 0 → 6 (ni ≥ 18). -/
theorem korak_preizkus :
    (-4:ℝ) * (-5) + 6 = 26 ∧ (26:ℝ) ≥ 18 ∧ (-4:ℝ) * (-3) + 6 = 18 ∧ (18:ℝ) ≥ 18 ∧
    (-4:ℝ) * 0 + 6 = 6 ∧ ¬ ((6:ℝ) ≥ 18) := by norm_num

/-- Bolj natančno: bc − ac = (b − a)·c. -/
theorem razlika_produkt (a b c : ℝ) : b * c - a * c = (b - a) * c := by ring

/-- Bolj natančno: iz a < b in c < 0 sledi bc < ac, torej ac > bc (znak se obrne), po korakih: b − a > 0,
(b − a)c < 0, bc − ac < 0. -/
theorem obrat_dokaz (a b c : ℝ) (hab : a < b) (hc : c < 0) : a * c > b * c := by
  have h1 : 0 < b - a := by linarith
  have h2 : (b - a) * c < 0 := mul_neg_of_pos_of_neg h1 hc
  have h3 : b * c - a * c < 0 := by rw [razlika_produkt]; exact h2
  linarith

/-- Predpostavki `obrat_dokaz` se dasta izpolniti (a = 2, b = 5, c = −1). -/
example : (2:ℝ) < 5 ∧ (-1:ℝ) < 0 := by norm_num

/-- Bolj natančno: (b + c) − (a + c) = b − a, zato iz a < b sledi a + c < b + c za vsak c (pozitiven ali
negativen). -/
theorem pristevanje_dokaz (a b c : ℝ) (hab : a < b) : (b + c) - (a + c) = b - a ∧ a + c < b + c :=
  ⟨by ring, by linarith⟩

/-- Predpostavka `pristevanje_dokaz` se da izpolniti (a = 2, b = 5). -/
example : (2:ℝ) < 5 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1: »največ 12« je d ≤ 12: 12 izpolni d ≤ 12, ne pa d < 12; 11 izpolni d ≤ 12, ne pa d ≥ 12. -/
theorem kviz1 : (12:ℝ) ≤ 12 ∧ ¬ ((12:ℝ) < 12) ∧ (11:ℝ) ≤ 12 ∧ ¬ ((11:ℝ) ≥ 12) := by norm_num

/-- Preveri se 2: 4 − 2x ≥ 10 ima rešitve natanko x ≤ −3, po korakih: −2x ≥ 6, x ≤ −3. -/
theorem kviz2 (x : ℝ) : 4 - 2 * x ≥ 10 ↔ x ≤ -3 := by
  calc 4 - 2 * x ≥ 10 ↔ -2 * x ≥ 6 := by constructor <;> intro h <;> linarith
    _ ↔ x ≤ -3 := by constructor <;> intro h <;> linarith

/-- Preveri se 2, tretji (napačni) postopek: koraki 4 ≥ 10 + 2x, −6 ≥ 2x so pravilni, iz −6 ≥ 2x pa sledi
x ≤ −3 (delimo s pozitivnim 2), ne x ≥ −3. Preizkus z x = 0 izloči x ≥ −3, preizkus z x = −3: 4 + 6 = 10 ≥ 10. -/
theorem kviz2_koraki (x : ℝ) :
    (4 - 2 * x ≥ 10 ↔ 4 ≥ 10 + 2 * x) ∧ (4 ≥ 10 + 2 * x ↔ -6 ≥ 2 * x) ∧ (-6 ≥ 2 * x ↔ x ≤ -3) ∧
    ((0:ℝ) ≥ -3 ∧ ¬ ((4:ℝ) - 2 * 0 ≥ 10)) ∧ (4:ℝ) - 2 * (-3) = 4 + 6 ∧ (4:ℝ) + 6 ≥ 10 := by
  refine ⟨?_, ?_, ?_, by norm_num, by norm_num, by norm_num⟩ <;> constructor <;> intro h <;> linarith

/-- Preveri se 3: 3x > −12 ima rešitve natanko x > −4 (delimo s pozitivnim 3); preizkus x = 0: 0 > −12. -/
theorem kviz3 (x : ℝ) : (3 * x > -12 ↔ x > -4) ∧ (3:ℝ) * 0 > -12 := by
  refine ⟨by constructor <;> intro h <;> linarith, by norm_num⟩

/-- Preveri se 4: −3x < 12 ima rešitve natanko x > −4 (prazen krogec pri −4: −3·(−4) = 12 in 12 < 12 ne drži;
12/(−3) = −4). -/
theorem kviz4 (x : ℝ) : (-3 * x < 12 ↔ x > -4) ∧ (-3:ℝ) * (-4) = 12 ∧ ¬ ((12:ℝ) < 12) ∧ (12:ℝ) / (-3) = -4 := by
  refine ⟨by constructor <;> intro h <;> linarith, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 5: 40 − 16t ≤ 8 ima rešitve natanko t ≥ 2, po korakih: −16t ≤ −32, t ≥ 2. Po 2 urah ostane
točno 8 km, po 1 uri še 24 km. -/
theorem kviz5 (t : ℝ) : (40 - 16 * t ≤ 8 ↔ t ≥ 2) ∧ (40:ℝ) - 16 * 2 = 8 ∧ (40:ℝ) - 16 * 1 = 24 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  calc 40 - 16 * t ≤ 8 ↔ -16 * t ≤ -32 := by constructor <;> intro h <;> linarith
    _ ↔ t ≥ 2 := by constructor <;> intro h <;> linarith

/-- Preveri se 5, napačni odgovor t ≥ 3: dobiš ga iz napačnega 40 + 8 ≤ 16t (16t ≥ 48); pravilno je
40 − 8 ≤ 16t (16t ≥ 32). -/
theorem kviz5_napaka (t : ℝ) : (40 + 8 ≤ 16 * t ↔ t ≥ 3) ∧ (40 - 8 ≤ 16 * t ↔ 16 * t ≥ 32) ∧
    (40 - 16 * t ≤ 8 ↔ 40 - 8 ≤ 16 * t) := by
  refine ⟨?_, ?_, ?_⟩ <;> constructor <;> intro h <;> linarith

end Evklid.Lekcije.MAT_OS_9.LinearneNeenacbe
