/-
vir: content/lessons/MAT-OS-7/tortni-prikaz.md
sha256: fde41297c9b5b383a3c9d33fe0125ad8bec56cf245da4b5fc3977d3228a1115b
Model: središčni kot izseka (v stopinjah) je realno število `kot n N = n/N · 360` (n v skupini, N vseh); iz
odstotka p je kot p·3,6. Decimalna števila so zapisana kot ulomki (3,6 = 36/10). Ves krog je 360°. Skupine so
g : Fin k → ℝ, celota je njihova vsota. »Zaokroženo na celo stopinjo« je |x − a| ≤ 1/2. Enote (€, ℓ, °) so
izpuščene.
Lean: x/0 = 0; zato imajo splošne trditve pogoj N ≠ 0 (celota) oziroma kot ≠ 0, kjer se z njima deli.
Ni v Leanu: zgodbe (hišice, garaža, omara, pleskar, rezbar, mizar Ivo) kot besedilo, njihovi računi so dokazani;
geometrija kroga, izseka, polmera in središčnega kota (»izsek je del kroga med polmeroma«, »polovica kroga je
iztegnjeni kot, četrtina pravi kot, osmino dobiš z razpolovitvijo pravega kota«; dokazano 180°, 90°, 45° = 90°/2)
in risanje s šestilom in kotomerom (»vsak kot odmeri od novega polmera«, Pogoste napake 3, označevanje izsekov) so
navodila in risba; »večji krog ne prikazuje več podatkov« (kviz 1, opis: kot ni odvisen od polmera, ker ga model
sploh nima); simulacija »Tortni prikaz« (dokazan je račun 105° → 84°); »ko gostje pogledajo mizo, takoj
vidijo« in raba v časopisih (opis); »enega od največjih izsekov popravi za 1°« (navodilo; dokazan je račun 359°).
Napačni odgovori kvizov: dokazano je, da napačne vrednosti niso pravilne.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.TortniPrikaz

open Finset

/-- Središčni kot izseka za n od N podatkov: n/N · 360°. -/
noncomputable def kot (n N : ℝ) : ℝ := n / N * 360

/-! ## Razlaga -/

/-- Razlaga (tabela): 1/2 = 50 % → 180°, 1/4 = 25 % → 90°, 1/8 = 12,5 % → 45° (= 90° : 2), 1/10 = 10 % → 36°.
trditev: MAT-OS-7/tortni-prikaz#tabela
besedilo: »Polovica kroga je iztegnjeni kot, četrtina je pravi kot. Za osmino razpoloviš pravi kot.« -/
theorem tabela :
    (1 / 2 : ℝ) * 360 = 180 ∧ (1 / 2 : ℝ) * 100 = 50 ∧ (1 / 4 : ℝ) * 360 = 90 ∧ (1 / 4 : ℝ) * 100 = 25 ∧
      (1 / 8 : ℝ) * 360 = 45 ∧ (1 / 8 : ℝ) * 100 = 12.5 ∧ (90 : ℝ) / 2 = 45 ∧ (1 / 10 : ℝ) * 360 = 36 ∧
      (1 / 10 : ℝ) * 100 = 10 := by
  norm_num

/-- Razlaga (premisli): izsek za tretjino podatkov ima kot 360° : 3 = 120° = 1/3 · 360°.
trditev: MAT-OS-7/tortni-prikaz#tretjina
besedilo: »Ves krog razdeliš na tri enake dele: $360^\circ : 3 = 120^\circ$.« -/
theorem tretjina : (360 : ℝ) / 3 = 120 ∧ (1 / 3 : ℝ) * 360 = 120 := by norm_num

/-- Razlaga in Povzetek (1 % = 3,6°): kot iz odstotka p je (p/100)·360° = p·3,6°; obratno odstotek = kot : 3,6.
trditev: MAT-OS-7/tortni-prikaz#odstotek-v-kot
besedilo: »Za odstotke torej velja: $\text{kot} = \text{odstotek} \cdot 3{,}6^\circ$.« -/
theorem odstotek_v_kot (p k : ℝ) : p / 100 * 360 = p * 3.6 ∧ (k = p * 3.6 ↔ p = k / 3.6) ∧ (360 : ℝ) / 100 = 3.6 := by
  refine ⟨by norm_num; ring, ⟨fun h => by rw [h]; norm_num, fun h => by rw [h]; norm_num⟩, by norm_num⟩

/-- Razlaga in Povzetek: koti vseh izsekov skupaj merijo 360° (celota ∑ gᵢ ≠ 0).
trditev: MAT-OS-7/tortni-prikaz#vsota-kotov
besedilo: »Zato koti vseh izsekov skupaj dajo $360^\circ$.« -/
theorem vsota_kotov {k : ℕ} (g : Fin k → ℝ) (hN : ∑ i, g i ≠ 0) : ∑ i, kot (g i) (∑ j, g j) = 360 := by
  unfold kot
  rw [← sum_mul, ← sum_div, div_self hN, one_mul]

example := vsota_kotov (![12, 6, 4, 2]) (by simp [Fin.sum_univ_four]; norm_num)

/-- Razlaga (branje) in Povzetek: kot = n/N · 360° natanko tedaj, ko je n = kot/360° · N (N ≠ 0).
trditev: MAT-OS-7/tortni-prikaz#branje
besedilo: »\text{število v skupini} = \frac{\text{kot}}{360^\circ} \cdot \text{število vseh}« -/
theorem branje (n N k : ℝ) (hN : N ≠ 0) : k = kot n N ↔ n = k / 360 * N := by
  unfold kot
  constructor
  · rintro rfl; field_simp
  · rintro rfl; field_simp

example := branje 12 24 180 (by norm_num)

/-- Primer 3 in Povzetek (iz enega izseka do celote): znesek = kot/360° · celota natanko tedaj, ko je
celota = znesek · 360°/kot (kot ≠ 0).
trditev: MAT-OS-7/tortni-prikaz#celota-iz-izseka
besedilo: »iz enega znanega izseka dobiš celoto.« -/
theorem celota_iz_izseka (z c k : ℝ) (hk : k ≠ 0) : z = k / 360 * c ↔ c = z * (360 / k) := by
  constructor
  · rintro rfl; field_simp
  · rintro rfl; field_simp

example := celota_iz_izseka 64 480 48 (by norm_num)

/-- Zakaj se tega učimo in Razlaga: Matic bi narisal 50° + 25° + (4/24·100)° + (2/24·100)° = 100° (odstotki kot
stopinje), kar je manj kot tretjina kroga (120°); pravilno ima smreka 50·3,6° = 180°.
trditev: MAT-OS-7/tortni-prikaz#matic
besedilo: »Smreka ima $50\,\%$, njen izsek pa meri $50 \cdot 3{,}6^\circ = 180^\circ$, ne $50^\circ$.« -/
theorem matic :
    (12 : ℝ) / 24 * 100 = 50 ∧ (6 : ℝ) / 24 * 100 = 25 ∧
      (50 : ℝ) + 25 + 4 / 24 * 100 + 2 / 24 * 100 = 100 ∧ (100 : ℝ) < 360 / 3 ∧ (50 : ℝ) * 3.6 = 180 := by
  norm_num

/-- Razlaga (simulacija) in premisli: jabolko ima 7 glasov; pri 24 glasovih je kot 7/24·360° = 105°, ko hruška
dobi 6 glasov več (24 → 30), je kot 7/30·360° = 84°.
trditev: MAT-OS-7/tortni-prikaz#simulacija
besedilo: »njegovih glasov je še vedno $7$, kot pa se zmanjša s $105^\circ$ na $84^\circ$.« -/
theorem simulacija : kot 7 24 = 105 ∧ (24 : ℝ) + (8 - 2) = 30 ∧ kot 7 30 = 84 := by
  unfold kot; norm_num

/-- Razlaga (premisli), splošno: pri istem številu n > 0 in večji celoti 0 < N < N' je izsek manjši (prikaz kaže
delež, ne števila).
trditev: MAT-OS-7/tortni-prikaz#vecja-celota-manjsi-kot
besedilo: »Tortni prikaz kaže delež, ne števila samega.« -/
theorem vecja_celota_manjsi_kot (n N N' : ℝ) (hn : 0 < n) (hN : 0 < N) (h : N < N') : kot n N' < kot n N := by
  unfold kot
  have : n / N' < n / N := div_lt_div_of_pos_left hn hN h
  linarith

example := vecja_celota_manjsi_kot 7 24 30 (by norm_num) (by norm_num) (by norm_num)

/-! ## Rešeni primeri -/

/-- Primer 1: vseh je 12 + 6 + 4 + 2 = 24; smreka 12/24·360° = 180°, bukev 6/24·360° = 90°, topol 4/24·360° = 60°,
hrast 2/24·360° = 30°; preizkus 180° + 90° + 60° + 30° = 360°; ostanek po prvih treh je 30°.
trditev: MAT-OS-7/tortni-prikaz#primer-1
besedilo: »Odgovor: izseki merijo $180^\circ$, $90^\circ$, $60^\circ$ in $30^\circ$;« -/
theorem primer1 :
    (12 : ℝ) + 6 + 4 + 2 = 24 ∧ kot 12 24 = 180 ∧ kot 6 24 = 90 ∧ kot 4 24 = 60 ∧ kot 2 24 = 30 ∧
      (180 : ℝ) + 90 + 60 + 30 = 360 ∧ (360 : ℝ) - 180 - 90 - 60 = 30 := by
  unfold kot; norm_num

/-- Primer 2: 45 + 35 + 20 = 100; material 45·3,6° = 162°, delo 35·3,6° = 126°, dovoljenja 20·3,6° = 72°; preizkus
162° + 126° + 72° = 360°; material ima največji izsek, a manj kot pol kroga (162° < 180°).
trditev: MAT-OS-7/tortni-prikaz#primer-2
besedilo: »Odgovor: izseki merijo $162^\circ$, $126^\circ$ in $72^\circ$. Material ima največji izsek, a manj kot pol kroga.« -/
theorem primer2 :
    (45 : ℝ) + 35 + 20 = 100 ∧ (45 : ℝ) * 3.6 = 162 ∧ (35 : ℝ) * 3.6 = 126 ∧ (20 : ℝ) * 3.6 = 72 ∧
      (162 : ℝ) + 126 + 72 = 360 ∧ (126 : ℝ) < 162 ∧ (72 : ℝ) < 162 ∧ (162 : ℝ) < 180 := by
  norm_num

/-- Primer 3: 360°/48° = 7,5; celota 64·7,5 = 480 €; les 225/360·480 = 300 €; preizkus 48/360·480 = 64.
trditev: MAT-OS-7/tortni-prikaz#primer-3
besedilo: »Odgovor: izdelava je stala $480\,€$, od tega les $300\,€$.« -/
theorem primer3 :
    (360 : ℝ) / 48 = 7.5 ∧ (64 : ℝ) * 7.5 = 480 ∧ (225 : ℝ) / 360 * 480 = 300 ∧ (48 : ℝ) / 360 * 480 = 64 := by
  norm_num

/-- Primer 3: znesek okovja 64 € pri izseku 48° določa celoto natanko: 64 = 48/360 · c ⇔ c = 480.
trditev: MAT-OS-7/tortni-prikaz#primer-3-celota
besedilo: »Celota: $64 \cdot 7{,}5 = 480$, torej $480\,€$.« -/
theorem primer3_celota (c : ℝ) : (64 : ℝ) = 48 / 360 * c ↔ c = 480 := by
  rw [celota_iz_izseka 64 c 48 (by norm_num)]; norm_num

/-- Primer 4: 216° + 108° + 36° = 360°; vrata 36/360·20 = 2 ℓ; stene 216/360·20 = 12 ℓ; strop 108 : 3,6 = 30 %,
to je 6 ℓ; preizkus 12 + 6 + 2 = 20.
trditev: MAT-OS-7/tortni-prikaz#primer-4
besedilo: »Stene: $\dfrac{216}{360} \cdot 20 = 12$, torej $12\,\ell$. Strop: $108 : 3{,}6 = 30$, torej $30\,\%$ (to je $6\,\ell$).« -/
theorem primer4 :
    (216 : ℝ) + 108 + 36 = 360 ∧ (36 : ℝ) / 360 * 20 = 2 ∧ (216 : ℝ) / 360 * 20 = 12 ∧ (108 : ℝ) / 3.6 = 30 ∧
      (30 : ℝ) / 100 * 20 = 6 ∧ (108 : ℝ) / 360 * 20 = 6 ∧ (12 : ℝ) + 6 + 2 = 20 := by
  norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1: 25 % je 25·3,6° = 90°, ne 25°; odstotki kot stopinje skupaj dajo 100°, dobro četrtino kroga
(90° < 100° < 120°).
trditev: MAT-OS-7/tortni-prikaz#napaka-odstotek
besedilo: »Pravilno: $25 \cdot 3{,}6^\circ = 90^\circ$.« -/
theorem napaka_odstotek : (25 : ℝ) * 3.6 = 90 ∧ (25 : ℝ) ≠ 90 ∧ (360 : ℝ) / 4 < 100 ∧ (100 : ℝ) < 360 / 3 := by
  norm_num

/-- Pogoste napake 2: 12 hišic ni 12°, kot je 12/24·360° = 180°.
trditev: MAT-OS-7/tortni-prikaz#napaka-stevilo
besedilo: »Pravilno: $\dfrac{12}{24} \cdot 360^\circ = 180^\circ$.« -/
theorem napaka_stevilo : kot 12 24 = 180 ∧ (12 : ℝ) ≠ 180 := by unfold kot; norm_num

/-- Pogoste napake 4: pri 1, 3 in 3 od 7 desk so koti 1/7·360° ≈ 51°, 3/7·360° ≈ 154° (dvakrat), skupaj
51° + 154° + 154° = 359°.
trditev: MAT-OS-7/tortni-prikaz#napaka-zaokrozevanje
besedilo: »pri $1$, $3$ in $3$ od $7$ desk dobiš $51^\circ$, $154^\circ$ in $154^\circ$, skupaj $359^\circ$.« -/
theorem napaka_zaokrozevanje :
    |kot 1 7 - 51| ≤ 1 / 2 ∧ |kot 3 7 - 154| ≤ 1 / 2 ∧ (51 : ℝ) + 154 + 154 = 359 ∧ kot 1 7 + kot 3 7 + kot 3 7 = 360 := by
  unfold kot
  refine ⟨?_, ?_, by norm_num, by norm_num⟩ <;> (rw [abs_le]; constructor <;> norm_num)

/-- Pogoste napake 5 in Povzetek: enak izsek pri različnih celotah ne pomeni enakega števila (kot ≠ 0); četrtina od
24 je 6, četrtina od 32 je 8.
trditev: MAT-OS-7/tortni-prikaz#enak-izsek-razlicno
besedilo: »Dva tortna prikaza z enako velikim izsekom ne pomenita enakega števila, če sta celoti različni.« -/
theorem enak_izsek_razlicno (k N N' : ℝ) (hk : k ≠ 0) (h : N ≠ N') : k / 360 * N ≠ k / 360 * N' := by
  intro e
  apply h
  have : k / 360 ≠ 0 := by positivity
  exact mul_left_cancel₀ this e

example := enak_izsek_razlicno 90 24 32 (by norm_num) (by norm_num)

/-- Pogoste napake 5 in kviz 4: 90° je četrtina kroga; četrtina od 24 je 6, od 32 je 8, razlika 2; napačno
»enako« (6 ≠ 8) in »v 7.a več« (6 < 8).
trditev: MAT-OS-7/tortni-prikaz#kviz-4
besedilo: »Četrtina od $24$ je $6$, četrtina od $32$ je $8$, razlika je $2$.« -/
theorem kviz4 : (90 : ℝ) / 360 = 1 / 4 ∧ (90 : ℝ) / 360 * 24 = 6 ∧ (90 : ℝ) / 360 * 32 = 8 ∧ (8 : ℝ) - 6 = 2 ∧
    (6 : ℝ) ≠ 8 ∧ (6 : ℝ) < 8 := by
  norm_num

/-! ## Drugače -/

/-- Korak za korakom: 20 + 15 + 10 + 5 = 50; deleži 20/50 = 40 %, 15/50 = 30 %, 10/50 = 20 %, 5/50 = 10 %; koti
144°, 108°, 72°, 36°; vsota 360°.
trditev: MAT-OS-7/tortni-prikaz#rezbar
besedilo: »$144^\circ + 108^\circ + 72^\circ + 36^\circ = 360^\circ$.« -/
theorem rezbar :
    (20 : ℝ) + 15 + 10 + 5 = 50 ∧ (20 : ℝ) / 50 * 100 = 40 ∧ (15 : ℝ) / 50 * 100 = 30 ∧ (10 : ℝ) / 50 * 100 = 20 ∧
      (5 : ℝ) / 50 * 100 = 10 ∧ kot 20 50 = 144 ∧ kot 15 50 = 108 ∧ kot 10 50 = 72 ∧ kot 5 50 = 36 ∧
      (144 : ℝ) + 108 + 72 + 36 = 360 := by
  unfold kot; norm_num

/-- Kot zgodba: 12 klinov po 360° : 12 = 30°; oreh 6·30° = 180° (polovica), javor 4·30° = 120° (tretjina), češnja
2·30° = 60° (šestina).
trditev: MAT-OS-7/tortni-prikaz#mizar-ivo
besedilo: »Orehovi zavzamejo $6 \cdot 30^\circ = 180^\circ$, polovico mize.« -/
theorem mizar_ivo :
    (360 : ℝ) / 12 = 30 ∧ (6 : ℝ) * 30 = 180 ∧ (180 : ℝ) = 360 / 2 ∧ (4 : ℝ) * 30 = 120 ∧ (120 : ℝ) = 360 / 3 ∧
      (2 : ℝ) * 30 = 60 ∧ (60 : ℝ) = 360 / 6 := by
  norm_num

/-! ## Preveri se -/

/-- Kviz 1: izsek za 10 % ima kot 36°, ne 10°; 5 od 10 je pol kroga (180°), 5 od 100 le 18° (kot ni število
podatkov); pravilna trditev (vsota kotov 360°) je `vsota_kotov`.
trditev: MAT-OS-7/tortni-prikaz#kviz-1
besedilo: »Ves krog je $360^\circ$, zato je $10\,\%$ enako $36^\circ$.« -/
theorem kviz1 : (10 : ℝ) * 3.6 = 36 ∧ (36 : ℝ) ≠ 10 ∧ kot 5 10 = 180 ∧ kot 5 100 = 18 := by
  unfold kot; norm_num

/-- Kviz 2: 14/40·360° = 126° = 35·3,6° (14/40 = 35 %); napačni 14°, 35° in 14·3,6° = 50,4°.
trditev: MAT-OS-7/tortni-prikaz#kviz-2
besedilo: »$\dfrac{14}{40} \cdot 360^\circ = 126^\circ$ ali, ker je to $35\,\%$ orodij, $35 \cdot 3{,}6^\circ = 126^\circ$.« -/
theorem kviz2 :
    kot 14 40 = 126 ∧ (14 : ℝ) / 40 * 100 = 35 ∧ (35 : ℝ) * 3.6 = 126 ∧ (14 : ℝ) * 3.6 = 50.4 ∧ (14 : ℝ) ≠ 126 ∧
      (35 : ℝ) ≠ 126 ∧ (50.4 : ℝ) ≠ 126 := by
  unfold kot; norm_num

/-- Kviz 3: 9/36 je četrtina; 9/36·100 = 25 je odstotek, kot je 9/36·360° = 25·3,6° = 90°; napačno: 36/9 ni
del celote 9/36, 25° ni pravi kot 90°.
trditev: MAT-OS-7/tortni-prikaz#kviz-3
besedilo: »Četrtina kroga je $\frac{1}{4} \cdot 360^\circ = 90^\circ$, pravi kot.« -/
theorem kviz3 : (9 : ℝ) / 36 = 1 / 4 ∧ (9 : ℝ) / 36 * 100 = 25 ∧ kot 9 36 = 90 ∧ (25 : ℝ) * 3.6 = 90 ∧
    (36 : ℝ) / 9 ≠ 9 / 36 ∧ (25 : ℝ) ≠ 90 := by
  unfold kot; norm_num

/-- Kviz 5: 60°/360° = 1/6, cement 1/6·2400 = 400 €; napačno 2400 : 60 = 40 in 60 % od 2400 = 1440.
trditev: MAT-OS-7/tortni-prikaz#kviz-5
besedilo: »zato je cement stal $\dfrac{1}{6} \cdot 2400\,€ = 400\,€$.« -/
theorem kviz5 :
    (60 : ℝ) / 360 = 1 / 6 ∧ (1 / 6 : ℝ) * 2400 = 400 ∧ (2400 : ℝ) / 60 = 40 ∧ (60 : ℝ) / 100 * 2400 = 1440 ∧
      (40 : ℝ) ≠ 400 ∧ (1440 : ℝ) ≠ 400 := by
  norm_num

end Evklid.Lekcije.MAT_OS_7.TortniPrikaz
