/-
vir: content/lessons/MAT-OS-7/racunanje-s-koti.md
sha256: d917e6cb6695ac6b2a4ee18a3312d28f5e5de828675905d9118b0820857ae5cd
Model: kot s° m' je racionalno število stopinj `st s m = s + m/60` (ℚ), zato je npr. »62°73' = 63°13'« enakost
`st 62 73 = st 63 13`; »vmesni« zapisi (62°73', 179°60', 49°70') so isti kot, zapisan drugače. Kot v celih
minutah je naravno število N (minute), pravilen zapis s°m' ima 0 ≤ m ≤ 59 (`m < 60`); njegova enoličnost je
dokazana v ℕ (deljenje in ostanek pri deljenju s 60). Sokot je 180° − α, komplementarni kot 90° − α. Isti `st`
služi za ure in minute (ura = 60 min). »≈« pri zaokroževanju na celo število je |x − a| ≤ 1/2.
Ni v Leanu: poskus z mezincem (»mezinec pokrije približno 1°«), navidezna velikost Lune (31') in Sonca (32') ter
lega Ljubljane (46°03', 14°30') so podatki iz opazovanja, dokazano je le, da je 31' < 1° in da se 31' od pol
stopinje razlikuje za 1'; formula za višino opoldanskega Sonca (h₁ = 90° − φ + ε, h₂ = 90° − φ − ε) je podatek
iz astronomije, dokazani so računi z njo; »ena kotna minuta širine je približno 1,85 km, iz tega navtična milja
1852 m« in zgodovina (Babilonci) so podatki; dokazano je, da ima 60 dvanajst deliteljev; simulacija »Seštevanje
kotov v stopinjah in minutah« (dokazano 35°40' + 54°20' = 90°); risba v kvizu 2 (dokazan je račun); tipka na
računalu in pomorščaki (opis); razlogi napak (»navada iz desetiškega sistema«) so opis.
Napačni odgovori kvizov: dokazano je, da napačne vrednosti niso pravilne.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.RacunanjeSKoti

/-- Kot s° m' v stopinjah: s + m/60. -/
def st (s m : ℚ) : ℚ := s + m / 60

/-- Sokot kota α. -/
def sokot (α : ℚ) : ℚ := 180 - α

/-- Komplementarni kot kota α. -/
def komplement (α : ℚ) : ℚ := 90 - α

/-! ## Razlaga 1–5: minute, pravilen zapis, pretvarjanje -/

/-- Razlaga 1 in Povzetek: 1° = 60'; Bolj natančno: 1' = 60'', 1° = 3600'' (sekunda je 1/3600 stopinje).
trditev: MAT-OS-7/racunanje-s-koti#stopinja-minuta
besedilo: »1^\circ = 60' = 3600'' \qquad 1' = 60''« -/
theorem stopinja_minuta : st 1 0 = st 0 60 ∧ (1 : ℚ) / 60 = 60 * (1 / 3600) ∧ (1 : ℚ) = 3600 * (1 / 3600) := by
  unfold st; norm_num

/-- Razlaga 2 in Povzetek: 60' zamenjamo z 1° (prenos): s° m' = (s + 1)° (m − 60)'.
trditev: MAT-OS-7/racunanje-s-koti#prenos
besedilo: »Če dobiš $60$ ali več minut, jih pretvoriš v stopinje:« -/
theorem prenos (s m : ℚ) : st s m = st (s + 1) (m - 60) := by unfold st; ring

/-- Razlaga 7 in Povzetek: izposoja 1° → 60': s° m' = (s − 1)° (m + 60)'.
trditev: MAT-OS-7/racunanje-s-koti#izposoja
besedilo: »pri odštevanju po potrebi $1^\circ \to 60'$, npr. $180^\circ = 179^\circ 60'$.« -/
theorem izposoja (s m : ℚ) : st s m = st (s - 1) (m + 60) := by unfold st; ring

/-- Razlaga 2 in Povzetek: pravilen zapis (0 ≤ m ≤ 59) kota N' je en sam: s = N : 60, m = ostanek.
trditev: MAT-OS-7/racunanje-s-koti#pravilen-zapis
besedilo: »V pravilnem zapisu je število minut vedno med $0$ in $59$.« -/
theorem pravilen_zapis (N s m : ℕ) (hm : m < 60) : 60 * s + m = N ↔ s = N / 60 ∧ m = N % 60 := by
  omega

example := pravilen_zapis 3793 63 13 (by norm_num)

/-- Razlaga 2 in 4 (povezava): kot N' (celih minut) je v stopinjah N/60 = (N : 60)° (ostanek)'.
trditev: MAT-OS-7/racunanje-s-koti#minute-v-stopinje
besedilo: »Minute delimo s $60$; količnik so stopinje, ostanek so minute:« -/
theorem minute_v_stopinje (N : ℕ) : (N : ℚ) / 60 = st ((N / 60 : ℕ) : ℚ) ((N % 60 : ℕ) : ℚ) := by
  unfold st
  have h := Nat.div_add_mod N 60
  have h' : (N : ℚ) = 60 * ((N / 60 : ℕ) : ℚ) + ((N % 60 : ℕ) : ℚ) := by exact_mod_cast h.symm
  rw [h']; ring

/-- Razlaga 2: 62°73' = 62° + 60' + 13' = 63°13'.
trditev: MAT-OS-7/racunanje-s-koti#razlaga-2
besedilo: »62^\circ 73' = 62^\circ + 60' + 13' = 63^\circ 13'« -/
theorem razlaga2 : st 62 73 = st 62 (60 + 13) ∧ st 62 (60 + 13) = st 63 13 := by
  unfold st; norm_num

/-- Razlaga 3 in Povzetek: stopinje v minute množimo s 60: s° m' = (60s + m)'.
trditev: MAT-OS-7/racunanje-s-koti#v-minute
besedilo: »Stopinje v minute: množimo s $60$;« -/
theorem v_minute (s m : ℚ) : st s m * 60 = 60 * s + m := by unfold st; ring

/-- Razlaga 3: 3° = 3·60' = 180'; 12°25' = 12·60' + 25' = 720' + 25' = 745'.
trditev: MAT-OS-7/racunanje-s-koti#razlaga-3
besedilo: »$12^\circ 25' = 12 \cdot 60' + 25' = 720' + 25' = 745'$« -/
theorem razlaga3 : st 3 0 * 60 = 3 * 60 ∧ (3 : ℚ) * 60 = 180 ∧ st 12 25 * 60 = 12 * 60 + 25 ∧
    (12 : ℚ) * 60 + 25 = 720 + 25 ∧ (720 : ℚ) + 25 = 745 := by
  unfold st; norm_num

/-- Razlaga 4: 150' = 2°30' (150 : 60 = 2, ostanek 30).
trditev: MAT-OS-7/racunanje-s-koti#razlaga-4
besedilo: »$150' = 2^\circ 30'$, ker je $150 : 60 = 2$, ostanek $30$.« -/
theorem razlaga4 : 150 / 60 = 2 ∧ 150 % 60 = 30 ∧ (150 : ℚ) / 60 = st 2 30 := by
  refine ⟨by norm_num, by norm_num, by unfold st; norm_num⟩

/-- Razlaga 5 in Povzetek: decimalni del stopinje pomnožimo s 60: x° = s° ((x − s)·60)'.
trditev: MAT-OS-7/racunanje-s-koti#decimalni-zapis
besedilo: »Decimalni del stopinje pomnožimo s $60$:« -/
theorem decimalni_zapis (x s : ℚ) : x = st s ((x - s) * 60) := by unfold st; ring

/-- Razlaga 5: 15,4° = 15° + 0,4·60' = 15°24'; 0,5° = 30', 0,25° = 15', 0,75° = 45'; 45' = 45/60° = 0,75°.
trditev: MAT-OS-7/racunanje-s-koti#razlaga-5
besedilo: »$15{,}4^\circ = 15^\circ + 0{,}4 \cdot 60' = 15^\circ 24'$« -/
theorem razlaga5 :
    (15.4 : ℚ) = st 15 (0.4 * 60) ∧ st 15 (0.4 * 60) = st 15 24 ∧ (0.5 : ℚ) = st 0 30 ∧ (0.25 : ℚ) = st 0 15 ∧
      (0.75 : ℚ) = st 0 45 ∧ (45 : ℚ) / 60 = 0.75 := by
  unfold st; norm_num

/-! ## Razlaga 6–9: računske operacije -/

/-- Razlaga 6 in Povzetek: seštevamo posebej stopinje in posebej minute.
trditev: MAT-OS-7/racunanje-s-koti#sestevanje
besedilo: »Pravilo: seštejemo posebej stopinje in posebej minute.« -/
theorem sestevanje (a b c d : ℚ) : st a b + st c d = st (a + c) (b + d) := by unfold st; ring

/-- Razlaga 7 in Povzetek: odštevamo posebej stopinje in posebej minute.
trditev: MAT-OS-7/racunanje-s-koti#odstevanje
besedilo: »Odštejemo posebej stopinje in posebej minute.« -/
theorem odstevanje (a b c d : ℚ) : st a b - st c d = st (a - c) (b - d) := by unfold st; ring

/-- Razlaga 8 in Povzetek: pri množenju z naravnim številom n pomnožimo stopinje in minute.
trditev: MAT-OS-7/racunanje-s-koti#mnozenje
besedilo: »Z istim številom pomnožimo stopinje in minute, nato zapis uredimo.« -/
theorem mnozenje (n : ℕ) (a b : ℚ) : n * st a b = st (n * a) (n * b) := by unfold st; ring

/-- Razlaga 9 in Povzetek: pri deljenju z n ≠ 0 najprej delimo stopinje (a = n·q + r), ostanek r stopinj
pretvorimo v 60r minut, jih prištejemo minutam in delimo še minute.
trditev: MAT-OS-7/racunanje-s-koti#deljenje
besedilo: »Ostanek stopinj pretvorimo v minute in jih prištejemo minutam, nato delimo še minute.« -/
theorem deljenje (n : ℕ) (hn : n ≠ 0) (q r b : ℚ) : st (n * q + r) b / n = st q ((60 * r + b) / n) := by
  have hn' : (n : ℚ) ≠ 0 := by exact_mod_cast hn
  unfold st; field_simp; ring

example := deljenje 3 (by norm_num) 35 1 6

/-- Razlaga 6 (tabela): 10°20' + 5°15' = 15°35'; 20°40' + 10°30' = 30°70' = 31°10'; 15°45' + 15°15' = 30°60' = 31°0'.
trditev: MAT-OS-7/racunanje-s-koti#razlaga-6-tabela
besedilo: »| $20^\circ 40' + 10^\circ 30'$ | $30^\circ 70'$ | $31^\circ 10'$ |« -/
theorem razlaga6_tabela :
    st 10 20 + st 5 15 = st 15 35 ∧ st 20 40 + st 10 30 = st 30 70 ∧ st 30 70 = st 31 10 ∧
      st 15 45 + st 15 15 = st 30 60 ∧ st 30 60 = st 31 0 := by
  unfold st; norm_num

/-- Razlaga 6 (premisli): 40°59' + 1' = 40°60' = 41°0'.
trditev: MAT-OS-7/racunanje-s-koti#razlaga-6-premisli
besedilo: »$40^\circ 59' + 1' = 40^\circ 60' = 41^\circ 0'$« -/
theorem razlaga6_premisli : st 40 59 + st 0 1 = st 40 60 ∧ st 40 60 = st 41 0 := by unfold st; norm_num

/-- Razlaga 7 in Povzetek: 50°10' = 49°70'; 90° = 89°60', 180° = 179°60'.
trditev: MAT-OS-7/racunanje-s-koti#razlaga-7
besedilo: »Pogosta primera izposojanja: $90^\circ = 89^\circ 60'$ in $180^\circ = 179^\circ 60'$.« -/
theorem razlaga7 : st 50 10 = st 49 70 ∧ (90 : ℚ) = st 89 60 ∧ (180 : ℚ) = st 179 60 := by unfold st; norm_num

/-- Razlaga 7 (premisli): 180° − 123°45' = 179°60' − 123°45' = 56°15'; preizkus 56°15' + 123°45' = 179°60' = 180°.
trditev: MAT-OS-7/racunanje-s-koti#razlaga-7-premisli
besedilo: »$180^\circ = 179^\circ 60'$, zato je $179^\circ 60' - 123^\circ 45' = 56^\circ 15'$.« -/
theorem razlaga7_premisli :
    180 - st 123 45 = st 179 60 - st 123 45 ∧ st 179 60 - st 123 45 = st 56 15 ∧
      st 56 15 + st 123 45 = st 179 60 ∧ st 179 60 = 180 := by
  unfold st; norm_num

/-- Razlaga 9 (tabela): 50°10' − 20°40' = 49°70' − 20°40' = 29°30'; 2·15°40' = 30°80' = 31°20';
25°30' : 3 = 24°90' : 3 = 8°30'.
trditev: MAT-OS-7/racunanje-s-koti#razlaga-9-tabela
besedilo: »| deljenje | $25^\circ 30' : 3$ | $24^\circ 90' : 3 = 8^\circ 30'$ |« -/
theorem razlaga9_tabela :
    st 50 10 - st 20 40 = st 49 70 - st 20 40 ∧ st 49 70 - st 20 40 = st 29 30 ∧
      2 * st 15 40 = st 30 80 ∧ st 30 80 = st 31 20 ∧ st 25 30 / 3 = st 24 90 / 3 ∧ st 24 90 / 3 = st 8 30 := by
  unfold st; norm_num

/-- Razlaga (simulacija): 35°40' + 54°20' = 90°0': kota sta komplementarna.
trditev: MAT-OS-7/racunanje-s-koti#simulacija
besedilo: »Opazi, da je minut skupaj ravno $60$, zato vsota postane $90^\circ 0'$: kota sta komplementarna.« -/
theorem simulacija : st 35 40 + st 54 20 = st 90 0 ∧ komplement (st 35 40) = st 54 20 := by
  unfold st komplement; norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: 35°48' + 27°25' = (35 + 27)°(48 + 25)' = 62°73' = 62°(60 + 13)' = 63°13'.
trditev: MAT-OS-7/racunanje-s-koti#primer-1
besedilo: »Odgovor: vsota kotov meri $63^\circ 13'$.« -/
theorem primer1 : st 35 48 + st 27 25 = st 63 13 := by
  calc st 35 48 + st 27 25 = st (35 + 27) (48 + 25) := sestevanje _ _ _ _
    _ = st 62 73 := by norm_num
    _ = st 62 (60 + 13) := by norm_num
    _ = st 63 13 := by unfold st; norm_num

/-- Primer 1 (preverimo v minutah): 35°48' = 2148', 27°25' = 1645', vsota 3793'; 3793 : 60 = 63, ostanek 13
(tudi vrstica `vrednost: 35*60+48+27*60+25 | 3793`).
trditev: MAT-OS-7/racunanje-s-koti#primer-1-minute
besedilo: »vsota $3793'$; $3793 : 60 = 63$, ostanek $13$.« -/
theorem primer1_minute :
    35 * 60 + 48 = 2148 ∧ 27 * 60 + 25 = 1645 ∧ 2148 + 1645 = 3793 ∧ 3793 / 60 = 63 ∧ 3793 % 60 = 13 := by
  decide

/-- Primer 2: β = 180° − 52°17' = 179°60' − 52°17' = 127°43'; γ = 90° − 52°17' = 89°60' − 52°17' = 37°43';
preizkus 52°17' + 127°43' = 179°60' = 180°, 52°17' + 37°43' = 89°60' = 90°; β − γ = 90°.
trditev: MAT-OS-7/racunanje-s-koti#primer-2
besedilo: »Odgovor: sokot meri $127^\circ 43'$, komplementarni kot pa $37^\circ 43'$.« -/
theorem primer2 :
    sokot (st 52 17) = st 127 43 ∧ komplement (st 52 17) = st 37 43 ∧ st 52 17 + st 127 43 = st 179 60 ∧
      st 52 17 + st 37 43 = st 89 60 ∧ st 127 43 - st 37 43 = 90 := by
  refine ⟨?_, ?_, by unfold st; norm_num, by unfold st; norm_num, by unfold st; norm_num⟩
  · calc sokot (st 52 17) = st 179 60 - st 52 17 := by unfold sokot st; norm_num
      _ = st 127 43 := by unfold st; norm_num
  · calc komplement (st 52 17) = st 89 60 - st 52 17 := by unfold komplement st; norm_num
      _ = st 37 43 := by unfold st; norm_num

/-- Primer 2 (opazi): sokot in komplementarni kot se vedno razlikujeta za 90°.
trditev: MAT-OS-7/racunanje-s-koti#sokot-minus-komplement
besedilo: »Opazi, da se razlikujeta natanko za $90^\circ$.« -/
theorem sokot_minus_komplement (α : ℚ) : sokot α - komplement α = 90 := by unfold sokot komplement; ring

/-- Primer 3: β = 3·24°38' = 72°114' = 73°54'; γ = 180° − 73°54' = 179°60' − 73°54' = 106°6'; 106 = 3·35 + 1,
γ : 3 = 35°((60 + 6) : 3)' = 35°22'; preizkus 3·35°22' = 105°66' = 106°6'.
trditev: MAT-OS-7/racunanje-s-koti#primer-3
besedilo: »Odgovor: $\beta = 73^\circ 54'$, $\gamma = 106^\circ 6'$, tretjina kota $\gamma$ pa meri $35^\circ 22'$.« -/
theorem primer3 :
    3 * st 24 38 = st 73 54 ∧ sokot (st 73 54) = st 106 6 ∧ st 106 6 / 3 = st 35 22 ∧
      3 * st 35 22 = st 105 66 ∧ st 105 66 = st 106 6 := by
  refine ⟨?_, ?_, ?_, by unfold st; norm_num, by unfold st; norm_num⟩
  · calc 3 * st 24 38 = st 72 114 := by unfold st; norm_num
      _ = st 72 (60 + 54) := by norm_num
      _ = st 73 54 := by unfold st; norm_num
  · calc sokot (st 73 54) = st 179 60 - st 73 54 := by unfold sokot st; norm_num
      _ = st 106 6 := by unfold st; norm_num
  · calc st 106 6 / 3 = st (3 * 35 + 1) 6 / 3 := by norm_num
      _ = st 35 ((60 * 1 + 6) / 3) := by exact_mod_cast deljenje 3 (by norm_num) 35 1 6
      _ = st 35 (66 / 3) := by norm_num
      _ = st 35 22 := by norm_num

/-- Primer 3 in kviz 4: kot, katerega trikratnik meri 106°6', je natanko 35°22'.
trditev: MAT-OS-7/racunanje-s-koti#kviz-4
besedilo: »Preizkus: $3 \cdot 35^\circ 22' = 105^\circ 66' = 106^\circ 6'$.« -/
theorem kviz4 (x : ℚ) : 3 * x = st 106 6 ↔ x = st 35 22 := by
  unfold st; constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-- Primer 4: 90° − 46°03' = 89°60' − 46°03' = 43°57'; h₁ = 43°57' + 23°26' = 66°83' = 67°23';
h₂ = 43°57' − 23°26' = 20°31'; h₁ − h₂ = 66°83' − 20°31' = 46°52' = 2·23°26'.
trditev: MAT-OS-7/racunanje-s-koti#primer-4
besedilo: »Razlika: $67^\circ 23' - 20^\circ 31' = 66^\circ 83' - 20^\circ 31' = 46^\circ 52'$.« -/
theorem primer4 :
    90 - st 46 3 = st 89 60 - st 46 3 ∧ st 89 60 - st 46 3 = st 43 57 ∧
      90 - st 46 3 + st 23 26 = st 66 83 ∧ st 66 83 = st 67 23 ∧ 90 - st 46 3 - st 23 26 = st 20 31 ∧
      st 67 23 - st 20 31 = st 66 83 - st 20 31 ∧ st 66 83 - st 20 31 = st 46 52 ∧ st 46 52 = 2 * st 23 26 := by
  unfold st; norm_num

/-- Primer 4 (splošno): razlika višin h₁ − h₂ = (90° − φ + ε) − (90° − φ − ε) je dvakratni nagib osi 2ε.
trditev: MAT-OS-7/racunanje-s-koti#primer-4-razlika
besedilo: »To je ravno $2 \cdot 23^\circ 26' = 46^\circ 52'$, dvakratni nagib osi.« -/
theorem primer4_razlika (φ ε : ℚ) : (90 - φ + ε) - (90 - φ - ε) = 2 * ε := by ring

/-! ## Pogoste napake -/

/-- Pogoste napake 1: 0,5° = 30', ne 50'; 62°73' ni pravilen zapis (73 ≥ 60), pravilno 63°13'.
trditev: MAT-OS-7/racunanje-s-koti#napaka-100-minut
besedilo: »Pravilno: stopinja ima $60'$, zato je $0{,}5^\circ = 30'$ in $62^\circ 73' = 63^\circ 13'$.« -/
theorem napaka_100_minut : (0.5 : ℚ) = st 0 30 ∧ (0.5 : ℚ) ≠ st 0 50 ∧ ¬ (73 < 60) ∧ st 62 73 = st 63 13 := by
  unfold st; norm_num

/-- Pogoste napake 2, Korak za korakom (odštevanje) in kviz 2: 90° − 34°25' = 89°60' − 34°25' = (89 − 34)°(60 − 25)'
= 55°35'; preizkus 55°35' + 34°25' = 89°60' = 90°; napačni 56°25', 56°35' in sokot 145°35' niso rešitev.
trditev: MAT-OS-7/racunanje-s-koti#napaka-izposoja
besedilo: »Pravilno: $90^\circ = 89^\circ 60'$, torej $89^\circ 60' - 34^\circ 25' = 55^\circ 35'$.« -/
theorem napaka_izposoja :
    90 - st 34 25 = st 89 60 - st 34 25 ∧ st 89 60 - st 34 25 = st (89 - 34) (60 - 25) ∧
      st (89 - 34) (60 - 25) = st 55 35 ∧ st 55 35 + st 34 25 = st 89 60 ∧ st 89 60 = 90 ∧
      st 56 25 ≠ st 55 35 ∧ st 56 35 ≠ st 55 35 ∧ sokot (st 34 25) = st 145 35 ∧ st 145 35 ≠ st 55 35 := by
  unfold st sokot; norm_num

/-- Pogoste napake 3: 50°10' = 49°70' (ne 49°110'), 50°10' − 20°40' = 29°30'.
trditev: MAT-OS-7/racunanje-s-koti#napaka-100-pri-izposoji
besedilo: »Pravilno: $1^\circ = 60'$, zato $50^\circ 10' = 49^\circ 70'$ in rezultat je $29^\circ 30'$.« -/
theorem napaka_100_pri_izposoji : st 50 10 = st 49 70 ∧ st 49 110 ≠ st 50 10 ∧ st 50 10 - st 20 40 = st 29 30 := by
  unfold st; norm_num

/-- Pogoste napake 4: 25°30' : 3 = 24°90' : 3 = 8°30', ne 8°10'.
trditev: MAT-OS-7/racunanje-s-koti#napaka-deljenje
besedilo: »Pravilno: $25^\circ 30' = 24^\circ 90'$, zato $24^\circ 90' : 3 = 8^\circ 30'$.« -/
theorem napaka_deljenje : st 25 30 / 3 = st 24 90 / 3 ∧ st 24 90 / 3 = st 8 30 ∧ st 8 10 ≠ st 8 30 := by
  unfold st; norm_num

/-- Pogoste napake 5 in Povzetek: 15,4° ni 15°4' niti 15°40'; 0,4·60' = 24', 15,4° = 15°24'.
trditev: MAT-OS-7/racunanje-s-koti#napaka-decimalke
besedilo: »Pravilno: $0{,}4 \cdot 60' = 24'$, zato $15{,}4^\circ = 15^\circ 24'$.« -/
theorem napaka_decimalke :
    (15.4 : ℚ) ≠ st 15 4 ∧ (15.4 : ℚ) ≠ st 15 40 ∧ (0.4 : ℚ) * 60 = 24 ∧ (15.4 : ℚ) = st 15 24 := by
  unfold st; norm_num

/-! ## Drugače -/

/-- Iz vsakdanjega življenja (ure, ura = 60 min): 1 h 48 min + 1 h 25 min = 2 h 73 min = 3 h 13 min;
od 10.15 do 11.40 mine 1 h 25 min; od 10.40 do 12.15 (= 11 h 75 min) mine 1 h 35 min.
trditev: MAT-OS-7/racunanje-s-koti#ure
besedilo: »skupaj trajata $2$ uri $73$ minut, kar je $3$ ure $13$ minut.« -/
theorem ure :
    st 1 48 + st 1 25 = st 2 73 ∧ st 2 73 = st 3 13 ∧ st 11 40 - st 10 15 = st 1 25 ∧ st 12 15 = st 11 75 ∧
      st 11 75 - st 10 40 = st 1 35 := by
  unfold st; norm_num

/-- Korak za korakom (seštevanje): 47°38' + 25°42' = (47 + 25)°(38 + 42)' = 72°80' = 73°20'.
trditev: MAT-OS-7/racunanje-s-koti#korak-sestevanje
besedilo: »Rezultat: $73^\circ 20'$.« -/
theorem korak_sestevanje :
    st 47 38 + st 25 42 = st (47 + 25) (38 + 42) ∧ st (47 + 25) (38 + 42) = st 72 80 ∧ st 72 80 = st 73 20 := by
  unfold st; norm_num

/-- Korak za korakom (pretvorba): 28,75° = 28° (0,75·60)' = 28°45'.
trditev: MAT-OS-7/racunanje-s-koti#korak-pretvorba
besedilo: »decimalni del $0{,}75 \cdot 60 = 45$, torej $28^\circ 45'$.« -/
theorem korak_pretvorba : (28.75 : ℚ) = st 28 (0.75 * 60) ∧ (0.75 : ℚ) * 60 = 45 := by unfold st; norm_num

/-- Bolj natančno: delitelji 60 so 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60.
trditev: MAT-OS-7/racunanje-s-koti#delitelji-60
besedilo: »Število $60$ ima veliko deliteljev: $1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60$.« -/
theorem delitelji_60 : Nat.divisors 60 = {1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60} := by decide

/-- Bolj natančno: 45' = 0,75° (končno decimalno število), 20' = 20/60° = 1/3°, kar ni končno decimalno število
(ni oblike k/10ⁿ).
trditev: MAT-OS-7/racunanje-s-koti#dvajset-minut
besedilo: »$45' = 0{,}75^\circ$ je končno decimalno število, $20' = \dfrac{20}{60}{}^\circ = \dfrac{1}{3}{}^\circ = 0{,}333\ldots^\circ$ pa ni.« -/
theorem dvajset_minut :
    (45 : ℚ) / 60 = 75 / 10 ^ 2 ∧ (20 : ℚ) / 60 = 1 / 3 ∧ ¬ ∃ k n : ℕ, (k : ℚ) / 10 ^ n = 1 / 3 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  rintro ⟨k, n, h⟩
  have h1 : (3 * k : ℚ) = 10 ^ n := by
    have : (10 : ℚ) ^ n ≠ 0 := by positivity
    field_simp at h; linarith
  have h2 : 3 * k = 10 ^ n := by exact_mod_cast h1
  have h3 : 3 ∣ 10 := Nat.Prime.dvd_of_dvd_pow Nat.prime_three ⟨k, h2.symm⟩
  omega

/-- Kot zgodba: minut je premalo (33 < 48), zato 45°33' − 43°48' = 44°93' − 43°48' = 1°45' = 105';
105·1,852 = 194,46 ≈ 194 km; bratov »1°85'« (45,33 − 43,48 = 1,85) ni pravilen zapis (85 ≥ 60).
trditev: MAT-OS-7/racunanje-s-koti#mornarka
besedilo: »Razlika je $44^\circ 93' - 43^\circ 48' = 1^\circ 45'$.« -/
theorem mornarka :
    st 45 33 = st 44 93 ∧ st 44 93 - st 43 48 = st 1 45 ∧ st 1 45 * 60 = 105 ∧ (105 : ℚ) * 1.852 = 194.46 ∧
      |(194.46 : ℚ) - 194| ≤ 1 / 2 ∧ (45.33 : ℚ) - 43.48 = 1.85 ∧ ¬ (85 < 60) ∧ (33 : ℕ) < 48 := by
  refine ⟨by unfold st; norm_num, by unfold st; norm_num, by unfold st; norm_num, by norm_num, ?_, by norm_num,
    by norm_num⟩
  rw [abs_le]; constructor <;> norm_num

/-- Zakaj se tega učimo: Luna (31') je manjša od 1° (mezinec) in se od pol stopinje razlikuje za 1'.
trditev: MAT-OS-7/racunanje-s-koti#luna
besedilo: »Luna je na nebu široka le približno pol stopinje.« -/
theorem luna : st 0 31 < 1 ∧ st 0 31 - 1 / 2 = st 0 1 := by unfold st; norm_num

/-! ## Preveri se -/

/-- Kviz 1: 0,7° = 0,7·60' = 42' (ne 70' ali 7').
trditev: MAT-OS-7/racunanje-s-koti#kviz-1
besedilo: »$1^\circ = 60'$, zato je $0{,}7^\circ = 0{,}7 \cdot 60' = 42'$.« -/
theorem kviz1 : (0.7 : ℚ) * 60 = 42 ∧ (0.7 : ℚ) = st 0 42 ∧ (0.7 : ℚ) ≠ st 0 70 ∧ (0.7 : ℚ) ≠ st 0 7 := by
  unfold st; norm_num

/-- Kviz 3: 15,4° = 15°24' (0,4·60' = 24'), 925' = 15°25' (925 : 60 = 15, ostanek 25); vrstni red
15°20' < 15,4° < 925' < 15°40'.
trditev: MAT-OS-7/racunanje-s-koti#kviz-3
besedilo: »$925' = 15^\circ 25'$, ker je $925 : 60 = 15$, ostanek $25$.« -/
theorem kviz3 :
    (15.4 : ℚ) = st 15 24 ∧ 925 / 60 = 15 ∧ 925 % 60 = 25 ∧ (925 : ℚ) / 60 = st 15 25 ∧ st 15 20 < 15.4 ∧
      (15.4 : ℚ) < 925 / 60 ∧ (925 : ℚ) / 60 < st 15 40 := by
  refine ⟨by unfold st; norm_num, by norm_num, by norm_num, by unfold st; norm_num, by unfold st; norm_num,
    by norm_num, by unfold st; norm_num⟩

/-- Kviz 4 (napačna odgovora): 35°2' ni rešitev (3·35°2' ≠ 106°6'), 318°18' = 3·106°6' je trikratnik, ne tretjina.
trditev: MAT-OS-7/racunanje-s-koti#kviz-4-napacni
besedilo: »To je $3 \cdot 106^\circ 6'$. Iščemo kot, katerega trikratnik je $106^\circ 6'$, zato delimo s $3$.« -/
theorem kviz4_napacni : 3 * st 35 2 ≠ st 106 6 ∧ 3 * st 106 6 = st 318 18 ∧ 3 * st 318 18 ≠ st 106 6 := by
  unfold st; norm_num

/-- Kviz 5: 90° = 90·60' = 5400', 5400' : 32' = 168,75 ≈ 169; napačno 9000 : 32 = 281,25 ≈ 281 (stopinja s 100')
in 90 : 32 ≈ 3.
trditev: MAT-OS-7/racunanje-s-koti#kviz-5
besedilo: »$90^\circ = 5400'$ in $5400' : 32' = 168{,}75 \approx 169$.« -/
theorem kviz5 :
    (90 : ℚ) * 60 = 5400 ∧ (90 : ℚ) * 60 / 32 = 168.75 ∧ |(168.75 : ℚ) - 169| ≤ 1 / 2 ∧
      (90 : ℚ) * 100 / 32 = 281.25 ∧ |(90 : ℚ) / 32 - 3| ≤ 1 / 2 ∧ |(168.75 : ℚ) - 281| > 1 / 2 ∧
      |(168.75 : ℚ) - 3| > 1 / 2 := by
  refine ⟨by norm_num, by norm_num, ?_, by norm_num, ?_, ?_, ?_⟩ <;>
    first
    | (rw [abs_le]; constructor <;> norm_num)
    | (rw [gt_iff_lt, lt_abs]; norm_num)

/-! ## Blok RACUN (vrstice, ki niso že zgoraj) -/

/-- RACUN: 35 + 48/60 + 27 + 25/60 = 63 + 13/60; 180 − (52 + 17/60) = 127 + 43/60; 90 − (52 + 17/60) = 37 + 43/60;
3·(24 + 38/60) = 73 + 54/60; 180 − (73 + 54/60) = 106 + 6/60; (106 + 6/60)/3 = 35 + 22/60; 90 − (46 + 3/60) =
43 + 57/60; 43 + 57/60 + 23 + 26/60 = 67 + 23/60; 43 + 57/60 − (23 + 26/60) = 20 + 31/60; 67 + 23/60 −
(20 + 31/60) = 46 + 52/60; 180 − (123 + 45/60) = 56 + 15/60; 90 − (34 + 25/60) = 55 + 35/60; 15,4 = 15 + 24/60;
925/60 = 15 + 25/60; 90·60/32 = 168,75; 45 + 33/60 − (43 + 48/60) = 1 + 45/60; 105·1,852 = 194,46; 0,7·60 = 42.
pomozno – ponovi vrstice bloka RACUN, ki ga učenec ne vidi; iste račune citirajo izreki primerov -/
theorem racun :
    (35 : ℚ) + 48 / 60 + 27 + 25 / 60 = 63 + 13 / 60 ∧ (35 * 60 + 48 + 27 * 60 + 25 : ℚ) = 3793 ∧
      (180 : ℚ) - (52 + 17 / 60) = 127 + 43 / 60 ∧ (90 : ℚ) - (52 + 17 / 60) = 37 + 43 / 60 ∧
      (3 : ℚ) * (24 + 38 / 60) = 73 + 54 / 60 ∧ (180 : ℚ) - (73 + 54 / 60) = 106 + 6 / 60 ∧
      ((106 : ℚ) + 6 / 60) / 3 = 35 + 22 / 60 ∧ (90 : ℚ) - (46 + 3 / 60) = 43 + 57 / 60 ∧
      (43 : ℚ) + 57 / 60 + 23 + 26 / 60 = 67 + 23 / 60 ∧ (43 : ℚ) + 57 / 60 - (23 + 26 / 60) = 20 + 31 / 60 ∧
      (67 : ℚ) + 23 / 60 - (20 + 31 / 60) = 46 + 52 / 60 ∧ (180 : ℚ) - (123 + 45 / 60) = 56 + 15 / 60 ∧
      (90 : ℚ) - (34 + 25 / 60) = 55 + 35 / 60 ∧ (15.4 : ℚ) = 15 + 24 / 60 ∧ (925 : ℚ) / 60 = 15 + 25 / 60 ∧
      (90 : ℚ) * 60 / 32 = 168.75 ∧ (45 : ℚ) + 33 / 60 - (43 + 48 / 60) = 1 + 45 / 60 ∧
      (105 : ℚ) * 1.852 = 194.46 ∧ (0.7 : ℚ) * 60 = 42 := by
  norm_num

end Evklid.Lekcije.MAT_OS_7.RacunanjeSKoti
