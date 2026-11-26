/-
vir: content/lessons/MAT-OS-8/racunanje-s-celimi-stevili.md
sha256: d185f44aaf546ffc258cdd57ce405fb02b176b863d19f14a0387a4e6f20af56a
Model: cela števila so `ℤ`. Deljenje »a : b« je Leanovo `a / b` v `ℤ` (zaokroži navzdol); lekcija deli le
takrat, ko je deljenje brez ostanka, in tam se ujema z navadnim deljenjem (pravilo deljenja je dokazano s
pogojema b ≠ 0 in b ∣ a). Lean: a / 0 = 0, zato je »z 0 ne delimo« dokazano kot »ni števila x z x · 0 = 5«.
Predznak je `Int.sign` (−1, 0, 1). Odstotki in stopinje so le števila (enote niso v Leanu).
Ni v Leanu: risba številske premice in simulacija (dokazani so računi, ki ju spremljajo, npr. 3 + (−5) = −2);
»Zakaj se tega učimo« in zgodbe kot opisi (dokazana so vsa števila v njih); dogovor, da negativno število ob
računskem znaku pišemo v oklepaju, in vrstni red operacij kot dogovor o zapisu (Lean bere izraze z istim
vrstnim redom; dokazane so vrednosti vseh izrazov iz lekcije in da napačen vrstni red v Pogostih napakah da
drugo število); postopek v štirih korakih (Drugače: korak za korakom) kot navodilo (dokazana sta tabela
predznakov in primer); »skok v desno/levo« kot geometrijski opis (dokazano je, da prištevanje pozitivnega
števila število poveča, negativnega pa zmanjša); ocena »približno −1000« kot pojem (dokazano je
(−50)·20 = −1000, natančno −1029 in |−1029 − (−1000)| = 29); besedilo napačnih odgovorov v Preveri se
(dokazane so napačne vrednosti, ki jih razlaga navaja).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.RacunanjeSCelimiStevili

/-! ## Zakaj se tega učimo: Ninina baterija -/

/-- Zakaj se tega učimo, tabela: spremembe so »konec minus začetek«: 77 − 83 = −6, 89 − 77 = 12,
80 − 89 = −9.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#spremembe-baterije
besedilo: »Pri videu je to $77 - 83 = -6$.« -/
theorem spremembe_baterije : (77:ℤ) - 83 = -6 ∧ (89:ℤ) - 77 = 12 ∧ (80:ℤ) - 89 = -9 := by norm_num

/-! ## Razlaga: seštevanje -/

/-- Razlaga, seštevanje: dva padca (−6) + (−9) = −15; (−6) + 12 = 6; 12 + (−9) = 3.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#sestevanje-baterija
besedilo: »Torej $(-6) + (-9) = -15$.« -/
theorem sestevanje_baterija : (-6:ℤ) + (-9) = -15 ∧ (-6:ℤ) + 12 = 6 ∧ (12:ℤ) + (-9) = 3 := by norm_num

/-- Razlaga, seštevanje: vseh 45 minut skupaj (−6) + 12 + (−9) = −3, in res 83 + (−3) = 80.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#skupaj-45-minut
besedilo: »Vseh 45 minut skupaj: $(-6) + 12 + (-9) = -3$. Res, iz $83\,\%$ smo prišli na $80\,\%$.« -/
theorem skupaj_45_minut : (-6:ℤ) + 12 + (-9) = -3 ∧ (83:ℤ) + (-3) = 80 := by norm_num

/-- Razlaga, številska premica: od −6 skok za 9 v levo pristane v −15. Prištevanje pozitivnega števila
število poveča (skok v desno), prištevanje negativnega ga zmanjša (skok v levo).
trditev: MAT-OS-8/racunanje-s-celimi-stevili#skoki
besedilo: »Seštevanje pozitivnega števila je skok v desno, seštevanje negativnega skok v levo« -/
theorem skoki (a b : ℤ) : (-6:ℤ) + (-9) = -15 ∧ (0 < b → a < a + b) ∧ (b < 0 → a + b < a) :=
  ⟨by norm_num, fun h => by omega, fun h => by omega⟩

/-- Razlaga, simulacija: 3 + (−5) = −2; točka skoči v levo in pristane levo od 0.
pomozno – stavek o simulaciji je navodilo (nastavi račun, opazuj), ne trditev -/
theorem simulacija_primer : (3:ℤ) + (-5) = -2 ∧ (3:ℤ) + (-5) < 3 ∧ (3:ℤ) + (-5) < 0 := by norm_num

/-- Razlaga in Povzetek, pravilo seštevanja pri enakih predznakih: absolutni vrednosti seštejemo in
predznak obdržimo (oba nenegativna: vsota je |a| + |b|; oba nepozitivna: vsota je −(|a| + |b|)).
trditev: MAT-OS-8/racunanje-s-celimi-stevili#sestevanje-enaka-predznaka
besedilo: »Pri **enakih predznakih** absolutni vrednosti seštejemo in predznak obdržimo.« -/
theorem sestevanje_enaka_predznaka (a b : ℤ) :
    (0 ≤ a → 0 ≤ b → a + b = |a| + |b|) ∧ (a ≤ 0 → b ≤ 0 → a + b = -(|a| + |b|)) := by
  constructor
  · intro ha hb; rw [abs_of_nonneg ha, abs_of_nonneg hb]
  · intro ha hb; rw [abs_of_nonpos ha, abs_of_nonpos hb]; ring

/-- Primera za `sestevanje_enaka_predznaka`: obe predpostavki se dajo izpolniti (a = 2, b = 3 oziroma
a = −6, b = −9). -/
example : ((0:ℤ) ≤ 2 ∧ (0:ℤ) ≤ 3) ∧ ((-6:ℤ) ≤ 0 ∧ (-9:ℤ) ≤ 0) := by norm_num

/-- Razlaga in Povzetek, pravilo seštevanja pri različnih predznakih: manjšo absolutno vrednost odštejemo od
večje, rezultat dobi predznak števila z večjo absolutno vrednostjo (tu je to b; pogoj a · b ≤ 0 pomeni
različna predznaka ali ničlo).
trditev: MAT-OS-8/racunanje-s-celimi-stevili#sestevanje-razlicna-predznaka
besedilo: »Pri **različnih predznakih** manjšo absolutno vrednost odštejemo od večje, rezultat pa dobi predznak števila z večjo absolutno vrednostjo.« -/
theorem sestevanje_razlicna_predznaka (a b : ℤ) (hab : a * b ≤ 0) (hv : |a| ≤ |b|) :
    a + b = Int.sign b * (|b| - |a|) := by
  rcases lt_trichotomy b 0 with hb | hb | hb
  · have ha : 0 ≤ a := by nlinarith
    rw [Int.sign_eq_neg_one_of_neg hb, abs_of_neg hb, abs_of_nonneg ha]; ring
  · subst hb; simp at hv; simp [hv]
  · have ha : a ≤ 0 := by nlinarith
    rw [Int.sign_eq_one_of_pos hb, abs_of_pos hb, abs_of_nonpos ha]; ring

/-- Predpostavke `sestevanje_razlicna_predznaka` se dajo izpolniti (a = −6, b = 12), in pravilo da
(−6) + 12 = 6. -/
example : (-6:ℤ) * 12 ≤ 0 ∧ |(-6:ℤ)| ≤ |(12:ℤ)| ∧ (-6:ℤ) + 12 = Int.sign 12 * (|12| - |-6|) := by
  simp

/-! ## Razlaga: odštevanje -/

/-- Razlaga, odštevanje: stolpec 5 − 2 = 3, 5 − 1 = 4, 5 − 0 = 5, 5 − (−1) = 6, 5 − (−2) = 7 in
naslednja vrstica (Premisli) 5 − (−3) = 8 = 5 + 3.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#stolpec-odstevanja
besedilo: »$5 - 2 = 3$, $5 - 1 = 4$, $5 - 0 = 5$, $5 - (-1) = 6$, $5 - (-2) = 7$.« -/
theorem stolpec_odstevanja :
    (5:ℤ) - 2 = 3 ∧ (5:ℤ) - 1 = 4 ∧ (5:ℤ) - 0 = 5 ∧ (5:ℤ) - (-1) = 6 ∧ (5:ℤ) - (-2) = 7 ∧
    (5:ℤ) - (-3) = 8 ∧ (5:ℤ) + 3 = 8 := by norm_num

/-- Razlaga, Premisli: ko se odštevanec zmanjša za 1, se rezultat poveča za 1.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#vzorec-odstevanja
besedilo: »Rezultat se vsakič poveča za $1$.« -/
theorem vzorec_odstevanja (b : ℤ) : 5 - (b - 1) = (5 - b) + 1 := by ring

/-- Razlaga: 5 − 3 = 2 in 5 + (−3) = 2.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#pet-minus-tri
besedilo: »Isto opazimo pri $5 - 3 = 2$ in $5 + (-3) = 2$.« -/
theorem pet_minus_tri : (5:ℤ) - 3 = 2 ∧ (5:ℤ) + (-3) = 2 := by norm_num

/-- Razlaga, Povzetek, formula Primera 1 in 4: odštevanje je seštevanje nasprotnega števila,
a − b = a + (−b).
trditev: MAT-OS-8/racunanje-s-celimi-stevili#odstevanje
besedilo: »Odštevanje je seštevanje nasprotnega števila: $a - b = a + (-b)$.« -/
theorem odstevanje (a b : ℤ) : a - b = a + (-b) := sub_eq_add_neg a b

/-- Razlaga, odštevanje: (−4) − 3 = (−4) + (−3) = −7 in (−6) − (−10) = (−6) + 10 = 4.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#odstevanje-primera
besedilo: »Zato $(-4) - 3 = (-4) + (-3) = -7$ in $(-6) - (-10) = (-6) + 10 = 4$.« -/
theorem odstevanje_primera :
    ((-4:ℤ) - 3 = (-4) + (-3) ∧ (-4:ℤ) + (-3) = -7) ∧ ((-6:ℤ) - (-10) = (-6) + 10 ∧ (-6:ℤ) + 10 = 4) := by
  norm_num

/-! ## Razlaga: množenje -/

/-- Razlaga, množenje: v 40 minutah (štirje desetminutni deli) baterija pade za 4 · (−3) = −12.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#stirideset-minut
besedilo: »V $40$ minutah, to so štirje desetminutni deli, pade za $4 \cdot (-3) = -12$.« -/
theorem stirideset_minut : (40:ℤ) / 10 = 4 ∧ (4:ℤ) * (-3) = -12 := by norm_num

/-- Razlaga, tabela: 3 · (−2) = −6, 2 · (−2) = −4, 1 · (−2) = −2, 0 · (−2) = 0 in (Premisli)
(−1) · (−2) = 2, (−2) · (−2) = 4.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#tabela-mnozenja
besedilo: »$(-1)\cdot(-2) = 2$ in $(-2)\cdot(-2) = 4$.« -/
theorem tabela_mnozenja :
    (3:ℤ) * (-2) = -6 ∧ (2:ℤ) * (-2) = -4 ∧ (1:ℤ) * (-2) = -2 ∧ (0:ℤ) * (-2) = 0 ∧
    (-1:ℤ) * (-2) = 2 ∧ (-2:ℤ) * (-2) = 4 := by norm_num

/-- Razlaga, tabela: ko se prvi faktor zmanjša za 1, se rezultat poveča za 2.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#vzorec-mnozenja
besedilo: »Rezultat se v vsaki vrstici poveča za $2$.« -/
theorem vzorec_mnozenja (k : ℤ) : (k - 1) * (-2) = k * (-2) + 2 := by ring

/-- Razlaga, Premisli: pred 20 minutami (−2 desetminutna dela) je bila sprememba (−2) · (−3) = 6.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#pred-dvajsetimi-minutami
besedilo: »pred $20$ minutami pomeni $-2$ desetminutna dela, zato $(-2)\cdot(-3) = 6$« -/
theorem pred_dvajsetimi_minutami : (-2:ℤ) * (-3) = 6 := by norm_num

/-- Razlaga in Povzetek, predznak zmnožka: predznak zmnožka je zmnožek predznakov, absolutni vrednosti se
zmnožita, in kar koli pomnožimo z 0, dobimo 0.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#predznak-zmnozka
besedilo: »Absolutni vrednosti zmnožimo kot običajno. Kar koli pomnožimo z $0$, dobimo $0$.« -/
theorem predznak_zmnozka (a b : ℤ) :
    Int.sign (a * b) = Int.sign a * Int.sign b ∧ |a * b| = |a| * |b| ∧ a * 0 = 0 ∧ 0 * a = 0 :=
  ⟨Int.sign_mul a b, abs_mul a b, mul_zero a, zero_mul a⟩

/-- Razlaga in Povzetek, predznak zmnožka v besedah: enaka predznaka dasta pozitiven zmnožek, različna
negativnega.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#predznak-zmnozka-besede
besedilo: »Pravilo za **predznak zmnožka**: enaka predznaka dasta pozitiven zmnožek, različna predznaka negativnega.« -/
theorem predznak_zmnozka_besede (a b : ℤ) :
    (0 < a → 0 < b → 0 < a * b) ∧ (a < 0 → b < 0 → 0 < a * b) ∧
    (0 < a → b < 0 → a * b < 0) ∧ (a < 0 → 0 < b → a * b < 0) :=
  ⟨fun ha hb => mul_pos ha hb, fun ha hb => mul_pos_of_neg_of_neg ha hb,
    fun ha hb => mul_neg_of_pos_of_neg ha hb, fun ha hb => mul_neg_of_neg_of_pos ha hb⟩

/-- Primeri, ki izpolnijo vse štiri primere v `predznak_zmnozka_besede` (tabela predznakov v Drugače:
korak za korakom): (+)(+) = +, (−)(−) = +, (+)(−) = −, (−)(+) = −. -/
example : (0:ℤ) < 2 * 3 ∧ (0:ℤ) < (-2) * (-3) ∧ (2:ℤ) * (-3) < 0 ∧ (-2:ℤ) * 3 < 0 := by norm_num

/-! ## Razlaga: deljenje -/

/-- Razlaga, deljenje: deljenje preverimo z množenjem: za b ≠ 0 in b ∣ a je a : b = c natanko tedaj, ko
je c · b = a.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#deljenje
besedilo: »Deljenje preverimo z množenjem.« -/
theorem deljenje (a b c : ℤ) (hb : b ≠ 0) (hd : b ∣ a) : a / b = c ↔ c * b = a := by
  obtain ⟨q, rfl⟩ := hd
  rw [Int.mul_ediv_cancel_left q hb]
  constructor
  · rintro rfl; ring
  · intro h
    have : b * (c - q) = 0 := by linarith
    rcases mul_eq_zero.mp this with h0 | h0
    · exact absurd h0 hb
    · linarith

/-- Predpostavke `deljenje` se dajo izpolniti (a = −12, b = 4). -/
example : (4:ℤ) ≠ 0 ∧ (4:ℤ) ∣ -12 := by norm_num

/-- Razlaga, deljenje: 4 · (−3) = −12, zato (−12) : 4 = −3; (−3) · 4 = −12, zato (−12) : (−3) = 4.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#deljenje-primera
besedilo: »Ker je $4 \cdot (-3) = -12$, velja $(-12) : 4 = -3$. Ker je $(-3) \cdot 4 = -12$, velja $(-12) : (-3) = 4$.« -/
theorem deljenje_primera :
    ((4:ℤ) * (-3) = -12 ∧ (-12:ℤ) / 4 = -3) ∧ ((-3:ℤ) * 4 = -12 ∧ (-12:ℤ) / (-3) = 4) := by
  norm_num

/-- Razlaga, Povzetek, Primer 2: za predznak količnika velja isto pravilo kot za zmnožek (pri deljenju
brez ostanka z b ≠ 0); absolutna vrednost količnika je količnik absolutnih vrednosti.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#predznak-kolicnika
besedilo: »Za predznak količnika torej velja isto pravilo kot za zmnožek.« -/
theorem predznak_kolicnika (a b : ℤ) (hb : b ≠ 0) (hd : b ∣ a) :
    Int.sign (a / b) = Int.sign a * Int.sign b ∧ |a / b| = |a| / |b| := by
  obtain ⟨q, rfl⟩ := hd
  rw [Int.mul_ediv_cancel_left q hb, abs_mul, Int.mul_ediv_cancel_left _ (abs_ne_zero.mpr hb),
    Int.sign_mul]
  refine ⟨?_, rfl⟩
  rcases lt_trichotomy b 0 with h | h | h
  · rw [Int.sign_eq_neg_one_of_neg h]; ring
  · exact absurd h hb
  · rw [Int.sign_eq_one_of_pos h]; ring

/-- Predpostavke `predznak_kolicnika` se dajo izpolniti (a = −72, b = −8). -/
example : (-8:ℤ) ≠ 0 ∧ (-8:ℤ) ∣ -72 := by norm_num

/-- Razlaga in Povzetek: z 0 ne delimo: ni števila, ki bi pomnoženo z 0 dalo 5.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#z-nic-ne-delimo
besedilo: »Z $0$ ne delimo: števila, ki bi pomnoženo z $0$ dalo na primer $5$, ni.« -/
theorem z_nic_ne_delimo : ¬ ∃ x : ℤ, x * 0 = 5 := by simp

/-! ## Rešeni primeri -/

/-- Primer 1, korak 1: (−7) + 12: različna predznaka, 12 − 7 = 5, predznak od 12, torej 5 (°C).
trditev: MAT-OS-8/racunanje-s-celimi-stevili#primer1-temperatura
besedilo: »Večjo absolutno vrednost ima $12$, zato je rezultat pozitiven: $(-7) + 12 = 5$.« -/
theorem primer1_temperatura : (-7:ℤ) + 12 = 5 := by
  calc (-7:ℤ) + 12 = 12 - 7 := by norm_num
    _ = 5 := by norm_num

/-- Primer 1, korak 2: 3 − 10 = 3 + (−10); različna predznaka: 10 − 3 = 7, predznak od −10, torej −7.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#primer1-racun2
besedilo: »Različna predznaka: $10 - 3 = 7$, predznak od $-10$, torej $3 - 10 = -7$.« -/
theorem primer1_racun2 : (3:ℤ) - 10 = -7 := by
  calc (3:ℤ) - 10 = 3 + (-10) := by norm_num
    _ = -(10 - 3) := by norm_num
    _ = -7 := by norm_num

/-- Primer 1, korak 3: (−6) − (−10) = (−6) + 10 = 4.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#primer1-racun3
besedilo: »$(-6) - (-10) = (-6) + 10 = 4$, ker je nasprotno število od $-10$ število $10$.« -/
theorem primer1_racun3 : (-6:ℤ) - (-10) = 4 := by
  calc (-6:ℤ) - (-10) = (-6) + 10 := by norm_num
    _ = 4 := by norm_num

/-- Primer 2, korak 1: (−7) · 6: različna predznaka, 7 · 6 = 42, torej −42.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#primer2-1
besedilo: »$(-7)\cdot 6$: predznaka sta različna, zato je zmnožek negativen; $7 \cdot 6 = 42$, torej $-42$.« -/
theorem primer2_1 : (-7:ℤ) * 6 = -42 := by
  calc (-7:ℤ) * 6 = -(7 * 6) := by norm_num
    _ = -42 := by norm_num

/-- Primer 2, korak 2: (−5) · (−9): enaka predznaka, 5 · 9 = 45.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#primer2-2
besedilo: »$(-5)\cdot(-9)$: predznaka sta enaka, zato je zmnožek pozitiven; $5 \cdot 9 = 45$.« -/
theorem primer2_2 : (-5:ℤ) * (-9) = 45 := by
  calc (-5:ℤ) * (-9) = 5 * 9 := by norm_num
    _ = 45 := by norm_num

/-- Primer 2, korak 3: (−48) : 6: različna predznaka, 48 : 6 = 8, torej −8.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#primer2-3
besedilo: »$(-48) : 6$: različna predznaka, količnik je negativen; $48 : 6 = 8$, torej $-8$.« -/
theorem primer2_3 : (-48:ℤ) / 6 = -8 := by
  calc (-48:ℤ) / 6 = -(48 / 6) := by norm_num
    _ = -8 := by norm_num

/-- Primer 2, korak 4: (−72) : (−8): enaka predznaka, 72 : 8 = 9.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#primer2-4
besedilo: »$(-72) : (-8)$: enaka predznaka, količnik je pozitiven; $72 : 8 = 9$.« -/
theorem primer2_4 : (-72:ℤ) / (-8) = 9 := by
  calc (-72:ℤ) / (-8) = 72 / 8 := by norm_num
    _ = 9 := by norm_num

/-- Primer 2, korak 5: preizkus deljenja z množenjem: (−8) · 6 = −48 in 9 · (−8) = −72.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#primer2-preizkus
besedilo: »Preizkus deljenja z množenjem: $(-8)\cdot 6 = -48$ in $9 \cdot (-8) = -72$.« -/
theorem primer2_preizkus : (-8:ℤ) * 6 = -48 ∧ (9:ℤ) * (-8) = -72 := by norm_num

/-- Primer 3: igra 50 min = 5 delov, 5 · (−3) = −15; polnjenje 30 min = 3 deli, 3 · 8 = 24;
41 + (−15) + 24 = 50, kar je nad 41 (%).
trditev: MAT-OS-8/racunanje-s-celimi-stevili#primer3
besedilo: »Odgovor: na koncu ima telefon $50\,\%$ baterije.« -/
theorem primer3 :
    (50:ℤ) / 10 = 5 ∧ (5:ℤ) * (-3) = -15 ∧ (30:ℤ) / 10 = 3 ∧ (3:ℤ) * 8 = 24 ∧
    (41:ℤ) + (-15) + 24 = 50 ∧ (41:ℤ) < 50 := by norm_num

/-- Primer 3, korak 3 kot račun končnega stanja: 41 + 5 · (−3) + 3 · 8 = 41 + (−15) + 24 = 50.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#primer3-konec
besedilo: »Spremembe prištejemo začetku: $41 + (-15) + 24 = 50$.« -/
theorem primer3_konec : (41:ℤ) + 5 * (-3) + 3 * 8 = 50 := by
  calc (41:ℤ) + 5 * (-3) + 3 * 8 = 41 + (-15) + 24 := by norm_num
    _ = 50 := by norm_num

/-- Primer 4 s Premisli: (−3)·(−4) − 2·(5 − 9) + (−20) : 4 = (−3)·(−4) − 2·(−4) + (−20) : 4 =
12 − (−8) + (−5) = 12 + 8 + (−5) = 20 + (−5) = 15.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#primer4
besedilo: »Vrednost izraza je $15$.« -/
theorem primer4 : (-3:ℤ) * (-4) - 2 * (5 - 9) + (-20) / 4 = 15 := by
  calc (-3:ℤ) * (-4) - 2 * (5 - 9) + (-20) / 4 = (-3) * (-4) - 2 * (-4) + (-20) / 4 := by norm_num
    _ = 12 - (-8) + (-5) := by norm_num
    _ = 12 + 8 + (-5) := by norm_num
    _ = 20 + (-5) := by norm_num
    _ = 15 := by norm_num

/-- Primer 4, Premisli: 12 − (−8) + (−5) je več kot 12.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#primer4-napoved
besedilo: »Več, ker odštevanje $-8$ doda $8$, $-5$ pa odvzame le $5$.« -/
theorem primer4_napoved : (12:ℤ) < 12 - (-8) + (-5) := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake: (−3) + (−4) = −7, ne 7.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#napaka-dva-minusa
besedilo: »Pri seštevanju dveh negativnih števil gremo dvakrat v levo, zato $(-3) + (-4) = -7$.« -/
theorem napaka_dva_minusa : (-3:ℤ) + (-4) = -7 ∧ (-3:ℤ) + (-4) ≠ 7 := by norm_num

/-- Pogoste napake: 5 − (−3) = 5 + 3 = 8, ne 2.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#napaka-odstevanje
besedilo: »Odštevanje negativnega števila je prištevanje nasprotnega: $5 - (-3) = 5 + 3 = 8$.« -/
theorem napaka_odstevanje : (5:ℤ) - (-3) = 5 + 3 ∧ (5:ℤ) + 3 = 8 ∧ (5:ℤ) - (-3) ≠ 2 := by norm_num

/-- Pogoste napake: (−9) + 5 = −4 (ne 4).
trditev: MAT-OS-8/racunanje-s-celimi-stevili#napaka-predznak
besedilo: »Odločilna je večja absolutna vrednost, to je $9$, zato $(-9) + 5 = -4$.« -/
theorem napaka_predznak : (-9:ℤ) + 5 = -4 ∧ (-9:ℤ) + 5 ≠ 4 := by norm_num

/-- Pogoste napake: 2 + 3 · (−4) = 2 + (−12) = −10, kar ni (2 + 3) · (−4) = 5 · (−4) = −20.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#napaka-vrstni-red
besedilo: »$2 + 3 \cdot (-4)$ ni $5 \cdot (-4) = -20$. Množenje ima prednost: $2 + (-12) = -10$.« -/
theorem napaka_vrstni_red :
    (2:ℤ) + 3 * (-4) = 2 + (-12) ∧ (2:ℤ) + (-12) = -10 ∧ ((2:ℤ) + 3) * (-4) = 5 * (-4) ∧
    (5:ℤ) * (-4) = -20 ∧ (2:ℤ) + 3 * (-4) ≠ (2 + 3) * (-4) := by norm_num

/-- Pogoste napake: (−12) : (−3) = 4, ne −4; preizkus (−4) · (−3) = 12 ≠ −12.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#napaka-kolicnik
besedilo: »Preizkus z množenjem pokaže: $(-4)\cdot(-3) = 12$, ne $-12$. Pravilno je $4$.« -/
theorem napaka_kolicnik :
    (-12:ℤ) / (-3) = 4 ∧ (-4:ℤ) * (-3) = 12 ∧ (-4:ℤ) * (-3) ≠ -12 := by norm_num

/-! ## Drugače -/

/-- Drugače: korak za korakom: (−15) − (−6)·3 + (−12) : (−4) = (−15) − (−18) + 3 = (−15) + 18 + 3 =
3 + 3 = 6.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#drugace-korak-za-korakom
besedilo: »Rezultat je $6$.« -/
theorem drugace_korak_za_korakom : (-15:ℤ) - (-6) * 3 + (-12) / (-4) = 6 := by
  calc (-15:ℤ) - (-6) * 3 + (-12) / (-4) = (-15) - (-18) + 3 := by norm_num
    _ = (-15) + 18 + 3 := by norm_num
    _ = 3 + 3 := by norm_num
    _ = 6 := by norm_num

/-- Drugače: korak za korakom, koraka 1 in 2: (−6) · 3 = −18 in (−12) : (−4) = 3.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#drugace-koraka
besedilo: »Množenje: $(-6)\cdot 3 = -18$ (različna predznaka).« -/
theorem drugace_koraka : (-6:ℤ) * 3 = -18 ∧ (-12:ℤ) / (-4) = 3 := by norm_num

/-- Drugače: kot zgodba: (−2) + 7 = 5; 5 − 9 = −4; (−2) − (−4) = (−2) + 4 = 2; 3 · (−1) = −3;
(−3) · (−1) = 3.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#zgodba-dvigalo
besedilo: »Razlika je $(-2) - (-4) = (-2) + 4 = 2$, torej mora $2$ nadstropji gor.« -/
theorem zgodba_dvigalo :
    (-2:ℤ) + 7 = 5 ∧ (5:ℤ) - 9 = -4 ∧ (-2:ℤ) - (-4) = (-2) + 4 ∧ (-2:ℤ) + 4 = 2 ∧
    (3:ℤ) * (-1) = -3 ∧ (-3:ℤ) * (-1) = 3 := by norm_num

/-! ## Preveri se -/

/-- Preveri se, 1. vprašanje: (−)·(−) = + in (+)·(−) = −; razlaga: 3 · (−2) = −6. Napačna odgovora
ne veljata: (−2)·(−3) ni negativno, 3 · (−2) ni pozitivno.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#preveri1
besedilo: »Enaka predznaka dasta pozitiven zmnožek, različna negativnega.« -/
theorem preveri1 :
    (∀ a b : ℤ, a < 0 → b < 0 → 0 < a * b) ∧ (∀ a b : ℤ, 0 < a → b < 0 → a * b < 0) ∧
    (3:ℤ) * (-2) = -6 ∧ ¬ ((-2:ℤ) * (-3) < 0) ∧ ¬ (0 < (3:ℤ) * (-2)) :=
  ⟨fun _ _ ha hb => mul_pos_of_neg_of_neg ha hb, fun _ _ ha hb => mul_neg_of_pos_of_neg ha hb,
    by norm_num, by norm_num, by norm_num⟩

/-- Preveri se, 2. vprašanje: (−50) · 20 = −1000, natančno (−49) · 21 = −1029 (razlika do ocene je 29);
napačni odgovor −70 je (−49) + (−21).
trditev: MAT-OS-8/racunanje-s-celimi-stevili#preveri2
besedilo: »$(-50)\cdot 20 = -1000$. Natančno je $-1029$.« -/
theorem preveri2 :
    (-50:ℤ) * 20 = -1000 ∧ (-49:ℤ) * 21 = -1029 ∧ |(-1029:ℤ) - (-1000)| = 29 ∧
    (-49:ℤ) + (-21) = -70 := by norm_num

/-- Preveri se, 3. vprašanje: 5 − (−3) = 5 + 3 = 8, medtem ko je 5 − 3 = 2.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#preveri3
besedilo: »$5 - 3 = 2$, ne $8$. Odštevanec je $-3$, ne $3$.« -/
theorem preveri3 : (5:ℤ) - (-3) = 5 + 3 ∧ (5:ℤ) + 3 = 8 ∧ (5:ℤ) - 3 = 2 := by norm_num

/-- Preveri se, 4. vprašanje: −4 pomnožimo z x in dobimo 28 natanko za x = −7 (28 : (−4) = −7);
napačni odgovori: (−4) · 7 = −28 in 28 − (−4) = 32.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#preveri4
besedilo: »Iščemo $28 : (-4) = -7$.« -/
theorem preveri4 (x : ℤ) : (-4) * x = 28 ↔ x = -7 := by omega

/-- Preveri se, 4. vprašanje, računi iz razlage: 28 : (−4) = −7, (−4) · (−7) = 28, (−4) · 7 = −28,
28 − (−4) = 32.
trditev: MAT-OS-8/racunanje-s-celimi-stevili#preveri4-racuni
besedilo: »Preizkus: $(-4)\cdot(-7) = 28$, enaka predznaka dasta pozitiven zmnožek.« -/
theorem preveri4_racuni :
    (28:ℤ) / (-4) = -7 ∧ (-4:ℤ) * (-7) = 28 ∧ (-4:ℤ) * 7 = -28 ∧ (28:ℤ) - (-4) = 32 := by norm_num

/-- Preveri se, 5. vprašanje: enaka sprememba x vsako od 4 ur da skupaj −36 natanko za x = −9
((−36) : 4 = −9).
trditev: MAT-OS-8/racunanje-s-celimi-stevili#preveri5
besedilo: »razdelimo jo na $4$ ure: $(-36) : 4 = -9$ odstotnih točk na uro« -/
theorem preveri5 (x : ℤ) : 4 * x = -36 ↔ x = -9 := by omega

/-- Preveri se, 5. vprašanje, računi iz razlage: (−36) : 4 = −9; napačni odgovori (−36) + 4 = −32 in
(−36) · 4 = −144, kar je padec v 4 · 4 = 16 urah (16 · (−9) = −144).
trditev: MAT-OS-8/racunanje-s-celimi-stevili#preveri5-racuni
besedilo: »To je $(-36)\cdot 4$, kar bi bil padec v $16$ urah, ne v eni.« -/
theorem preveri5_racuni :
    (-36:ℤ) / 4 = -9 ∧ (-36:ℤ) + 4 = -32 ∧ (-36:ℤ) * 4 = -144 ∧ (4:ℤ) * 4 = 16 ∧
    (16:ℤ) * (-9) = -144 := by norm_num

end Evklid.Lekcije.MAT_OS_8.RacunanjeSCelimiStevili
