/-
vir: content/lessons/MAT-OS-6/racunske-operacije-in-lastnosti.md
sha256: 6c02be8be71bf54fadc14cd7e1b16de793fef77a43cc2fd65385ac4456e9e46c
Model: računamo z naravnimi števili in ničlo (ℕ), »:« je `/`. Vrstni red operacij je dogovor; Lean bere izraze po
istem dogovoru (· in / pred + in −, operacije iste stopnje od leve), zato so vrednosti izrazov zapisane brez
dodatnih oklepajev, kjer je drug vrstni red pomemben, pa je posebej dokazano, da da drugačen rezultat.
Lean: v ℕ je a − b = 0 za a < b in a / b zaokroženo navzdol, x / 0 = 0; lekcija odšteva le a ≥ b in deli le, kadar
se deljenje izide, zato so trditve zapisane s temi pogoji (a ≥ b, b ∣ a, a ≠ 0) ali na številih, kjer se izide;
»a : 0 nima pomena« je dokazano kot: ni števila q s q · 0 = a za a ≠ 0.
Ni v Leanu: zgodovina znakov (Oughtred, Leibniz); imena (seštevanca, vsota, zmanjševanec, …, količnik) in
»številski izraz«, »vrednost izraza« (izrazoslovje); dogovor o vrstnem redu kot tak (dogovor, ne trditev;
dokazane so vse vrednosti izrazov po njem); risba stolov in napotek za simulacijo (dokazan razčlenjevalni zakon);
ponavljalni znaki v notah (analogija; računi dokazani); kalkulatorji (opis naprav; dokazano 2 + 3 · 4 = 14 in
(2 + 3) · 4 = 20); zadnji kviz (razvrščanje korakov postopka) je navodilo.
`RACUN`: vse vrstice so dokazane v izrekih spodaj (`enako`: `razclenjevalni`, `razclenjevalni_minus`).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.RacunskeOperacijeInLastnosti

/-! ## Zakaj se tega učimo in Razlaga 1 -/

/-- Uvod in Razlaga 1: 2 + 3 · 4 = 2 + 12 = 14 (Luka), računanje od leve (2 + 3) · 4 = 5 · 4 = 20 da drugačen
rezultat (Anja).
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#takti
besedilo: »Takti dajo $3 \cdot 4 = 12$ dob, s predtaktom vred $2 + 12 = 14$ dob.« -/
theorem takti : 3 * 4 = 12 ∧ 2 + 3 * 4 = 2 + 12 ∧ 2 + 12 = 14 ∧ (2 + 3) * 4 = 20 ∧ 2 + 3 * 4 ≠ (2 + 3) * 4 := by
  decide

/-- Razlaga 1: z oklepajem najprej seštejemo: (2 + 3) · 4 = 5 · 4 = 20.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#oklepaj
besedilo: »To zapišemo z **oklepajem**: $(2 + 3) \cdot 4 = 5 \cdot 4 = 20$.« -/
theorem oklepaj : (2 + 3) * 4 = 5 * 4 ∧ 5 * 4 = 20 := by decide

/-! ## Razlaga 2: obratne operacije -/

/-- Razlaga 2: preizkus z obratno operacijo: iz 6 · 7 = 42 sledi 42 : 7 = 6; splošno (a · b) : b = a za b ≠ 0 in
(a + b) − b = a.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#obratna
besedilo: »Zato račun preizkusiš z obratno operacijo: iz $6 \cdot 7 = 42$ sledi $42 : 7 = 6$.« -/
theorem obratna (a b : ℕ) (hb : b ≠ 0) : a * b / b = a ∧ a + b - b = a ∧ 6 * 7 = 42 ∧ 42 / 7 = 6 :=
  ⟨Nat.mul_div_cancel a (Nat.pos_of_ne_zero hb), Nat.add_sub_cancel a b, rfl, rfl⟩

example := obratna 6 7 (by norm_num)

/-- Razlaga 2: med naravnimi števili je razlika a − b mogoča natanko tedaj, ko a ≥ b, količnik a : b pa natanko
tedaj, ko se deljenje izide (b deli a).
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#razlika-kolicnik
besedilo: »Računamo z naravnimi števili in ničlo, zato je razlika $a - b$ mogoča le, kadar je $a \ge b$, količnik $a : b$ pa je naravno število le, kadar se deljenje izide.« -/
theorem razlika_kolicnik (a b : ℕ) : ((∃ c, b + c = a) ↔ b ≤ a) ∧ ((∃ c, b * c = a) ↔ b ∣ a) := by
  refine ⟨⟨fun ⟨c, h⟩ => by omega, fun h => ⟨a - b, by omega⟩⟩, ⟨fun ⟨c, h⟩ => ⟨c, h.symm⟩, fun ⟨c, h⟩ => ⟨c, h.symm⟩⟩⟩

/-! ## Razlaga 3 in 4: vrstni red -/

/-- Razlaga 3 in Primer 1: vrednost izraza 5 + 6 · 4 − 18 : 3 je 23.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#primer1
besedilo: »Odgovor: vrednost izraza je $23$.« -/
theorem primer1 : 5 + 6 * 4 - 18 / 3 = 23 := by
  calc 5 + 6 * 4 - 18 / 3 = 5 + 24 - 6 := by norm_num
    _ = 29 - 6 := by norm_num
    _ = 23 := by norm_num

/-- Primer 1, korak 5: kdor računa le od leve, dobi 5 + 6 = 11, 11 · 4 = 44, 44 − 18 = 26, 26 : 3 pa se ne izide.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#primer1-od-leve
besedilo: »Kdor računa le od leve, dobi $5 + 6 = 11$, $11 \cdot 4 = 44$, $44 - 18 = 26$ in nato $26 : 3$, kar se ne izide.« -/
theorem primer1_od_leve : 5 + 6 = 11 ∧ 11 * 4 = 44 ∧ 44 - 18 = 26 ∧ ¬ 3 ∣ 26 := by decide

/-- Razlaga 4 in Pogoste napake 2: operacije iste stopnje od leve: 24 : 6 · 2 = 4 · 2 = 8 (ne 24 : (6 · 2) = 2),
20 − 8 + 3 = 12 + 3 = 15 (ne 20 − (8 + 3) = 9).
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#iste-stopnje
besedilo: »Množenje in deljenje sta iste stopnje, zato gremo od leve: $24 : 6 = 4$, $4 \cdot 2 = 8$. Enako pri $20 - 8 + 3 = 15$, ne $9$.« -/
theorem iste_stopnje : 24 / 6 * 2 = 4 * 2 ∧ 4 * 2 = 8 ∧ 20 - 8 + 3 = 12 + 3 ∧ 12 + 3 = 15 ∧
    24 / (6 * 2) = 2 ∧ 20 - (8 + 3) = 9 := by
  decide

/-- Razlaga 4 (premisli): 36 : 6 : 2 = 6 : 2 = 3; od desne 36 : (6 : 2) = 36 : 3 = 12.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#deljenje-od-leve
besedilo: »$36 : 6 = 6$, nato $6 : 2 = 3$.« -/
theorem deljenje_od_leve : 36 / 6 / 2 = 3 ∧ 36 / 6 = 6 ∧ 6 / 2 = 3 ∧ 36 / (6 / 2) = 12 := by decide

/-! ## Razlaga 5: več oklepajev -/

/-- Razlaga 5: 50 − [12 + 3 · (7 − 4)] = 50 − [12 + 3 · 3] = 50 − [12 + 9] = 50 − 21 = 29.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#oglati
besedilo: »$$50 - [12 + 3 \cdot 3] = 50 - [12 + 9] = 50 - 21 = 29$$« -/
theorem oglati : 50 - (12 + 3 * (7 - 4)) = 29 := by
  calc 50 - (12 + 3 * (7 - 4)) = 50 - (12 + 3 * 3) := by norm_num
    _ = 50 - (12 + 9) := by norm_num
    _ = 50 - 21 := by norm_num
    _ = 29 := by norm_num

/-! ## Razlaga 6: zamenjalni in združevalni zakon -/

/-- Razlaga 6: 8 + 5 = 5 + 8 = 13; (7 + 5) + 15 = 27 = 7 + (5 + 15) = 7 + 20.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#izkusnja
besedilo: »Izračunaj $(7 + 5) + 15 = 27$ in $7 + (5 + 15) = 7 + 20 = 27$.« -/
theorem izkusnja : 8 + 5 = 13 ∧ 5 + 8 = 13 ∧ (7 + 5) + 15 = 27 ∧ 7 + (5 + 15) = 7 + 20 ∧ 7 + 20 = 27 := by decide

/-- Razlaga 6 in Povzetek: zamenjalni zakon za seštevanje in množenje.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#zamenjalni
besedilo: »Zamenjalni zakon: $a + b = b + a$, $a \cdot b = b \cdot a$« -/
theorem zamenjalni (a b : ℕ) : a + b = b + a ∧ a * b = b * a := ⟨Nat.add_comm a b, Nat.mul_comm a b⟩

/-- Razlaga 6 in Povzetek: združevalni zakon za seštevanje in množenje.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#zdruzevalni
besedilo: »združevalni: $(a + b) + c = a + (b + c)$, $(a \cdot b) \cdot c = a \cdot (b \cdot c)$« -/
theorem zdruzevalni (a b c : ℕ) : (a + b) + c = a + (b + c) ∧ (a * b) * c = a * (b * c) :=
  ⟨Nat.add_assoc a b c, Nat.mul_assoc a b c⟩

/-- Razlaga 6: v računu s samimi seštevanji ali samimi množenji smemo števila poljubno premešati (vsota in
produkt premešanega seznama sta enaka).
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#poljubno
besedilo: »Skupaj povesta: v računu, ki ima samo seštevanja ali samo množenja, smeš števila poljubno zamenjati in združiti.« -/
theorem poljubno (l l' : List ℕ) (h : l.Perm l') : l.sum = l'.sum ∧ l.prod = l'.prod :=
  ⟨h.sum_eq, h.prod_eq⟩

example := poljubno [7, 5, 15] [15, 7, 5] (by decide)

/-- Razlaga 6: (5 · 4) · 9 = 5 · (4 · 9) = 5 · 36 = 180.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#produkt-180
besedilo: »Zato je $(5 \cdot 4) \cdot 9 = 5 \cdot (4 \cdot 9) = 5 \cdot 36 = 180$.« -/
theorem produkt_180 : (5 * 4) * 9 = 180 := by
  calc (5 * 4) * 9 = 5 * (4 * 9) := by norm_num
    _ = 5 * 36 := by norm_num
    _ = 180 := by norm_num

/-! ## Razlaga 7: razčlenjevalni zakon -/

/-- Razlaga 7: stoli po vrstah 3 · (4 + 5) = 3 · 9 = 27, po delih 3 · 4 + 3 · 5 = 12 + 15 = 27.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#stoli
besedilo: »Po vrstah: $3 \cdot (4 + 5) = 3 \cdot 9 = 27$. Po delih: $3 \cdot 4 + 3 \cdot 5 = 12 + 15 = 27$.« -/
theorem stoli : 3 * (4 + 5) = 3 * 9 ∧ 3 * 9 = 27 ∧ 3 * 4 + 3 * 5 = 12 + 15 ∧ 12 + 15 = 27 := by decide

/-- Razlaga 7 in Povzetek: razčlenjevalni zakon a · (b + c) = a · b + a · c.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#razclenjevalni
besedilo: »Razčlenjevalni zakon: $a \cdot (b + c) = a \cdot b + a \cdot c$« -/
theorem razclenjevalni (a b c : ℕ) : a * (b + c) = a * b + a * c := Nat.mul_add a b c

/-- Razlaga 7 in Povzetek: a · (b − c) = a · b − a · c, ko je b ≥ c.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#razclenjevalni-minus
besedilo: »Drugi zapis uporabljamo, ko je $b \ge c$.« -/
theorem razclenjevalni_minus (a b c : ℕ) (h : c ≤ b) : a * (b - c) = a * b - a * c := by
  have := h
  exact Nat.mul_sub a b c

example := razclenjevalni_minus 6 100 1 (by norm_num)

/-- Razlaga 7: izpostavljanje: 37 · 8 + 37 · 2 = 37 · (8 + 2) = 37 · 10 = 370.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#izpostavljanje
besedilo: »Temu pravimo **izpostavljanje skupnega faktorja**: $37 \cdot 8 + 37 \cdot 2 = 37 \cdot (8 + 2) = 37 \cdot 10 = 370$.« -/
theorem izpostavljanje : 37 * 8 + 37 * 2 = 370 := by
  calc 37 * 8 + 37 * 2 = 37 * (8 + 2) := by rw [Nat.mul_add]
    _ = 37 * 10 := by norm_num
    _ = 370 := by norm_num

/-- Razlaga 7 (premisli): (b + c) · a = a · b + a · c (zamenjalni, nato razčlenjevalni zakon); (10 + 3) · 6 =
6 · (10 + 3) = 6 · 10 + 6 · 3 = 78.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#oklepaj-levo
besedilo: »Po zamenjalnem zakonu je $(10 + 3) \cdot 6 = 6 \cdot (10 + 3)$, to pa je po razčlenjevalnem zakonu $6 \cdot 10 + 6 \cdot 3 = 78$.« -/
theorem oklepaj_levo (a b c : ℕ) : (b + c) * a = a * b + a * c ∧ (10 + 3) * 6 = 10 * 6 + 3 * 6 ∧
    (10 + 3) * 6 = 6 * (10 + 3) ∧ 6 * (10 + 3) = 6 * 10 + 6 * 3 ∧ 6 * 10 + 6 * 3 = 78 := by
  refine ⟨by ring, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-! ## Razlaga 8: odštevanje in deljenje -/

/-- Razlaga 8 in Pogoste napake 3: za odštevanje in deljenje zakona ne veljata: 8 − 3 = 5, a 3 − 8 med
naravnimi števili ni (ni n s 8 + n = 3); 12 : 4 = 3, a 4 : 12 ni naravno; (20 − 8) − 4 = 8, a 20 − (8 − 4) = 16;
(24 : 6) : 2 = 2, a 24 : (6 : 2) = 8.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#ne-veljata
besedilo: »Zamenjalni in združevalni zakon veljata le za seštevanje in množenje: $(20 - 8) - 4 = 8$, a $20 - (8 - 4) = 16$.« -/
theorem ne_veljata : 8 - 3 = 5 ∧ ¬ (∃ n : ℕ, 8 + n = 3) ∧ 12 / 4 = 3 ∧ ¬ 12 ∣ 4 ∧ (20 - 8) - 4 = 8 ∧
    20 - (8 - 4) = 16 ∧ (24 / 6) / 2 = 2 ∧ 24 / (6 / 2) = 8 := by
  refine ⟨rfl, fun ⟨n, h⟩ => by omega, rfl, by decide, rfl, rfl, rfl, rfl⟩

/-! ## Razlaga 9: števili 0 in 1 -/

/-- Razlaga 9 in Povzetek: a + 0 = a, a − 0 = a, a · 1 = a, a : 1 = a, a · 0 = 0.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#nic-ena
besedilo: »$a + 0 = a$ in $a - 0 = a$; $a \cdot 1 = a$ in $a : 1 = a$.« -/
theorem nic_ena (a : ℕ) : a + 0 = a ∧ a - 0 = a ∧ a * 1 = a ∧ a / 1 = a ∧ a * 0 = 0 :=
  ⟨rfl, rfl, Nat.mul_one a, Nat.div_one a, Nat.mul_zero a⟩

/-- Razlaga 9: kadar je a ≠ 0, je 0 : a = 0.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#nic-deljeno
besedilo: »$a \cdot 0 = 0$, in kadar je $a \ne 0$, tudi $0 : a = 0$.« -/
theorem nic_deljeno (a : ℕ) (ha : a ≠ 0) : a * 0 = 0 ∧ 0 / a = 0 := by
  have := ha
  exact ⟨Nat.mul_zero a, Nat.zero_div a⟩

example := nic_deljeno 7 (by norm_num)

/-- Razlaga 9, Pogoste napake 5 in Bolj natančno: z ničlo ne delimo: za a ≠ 0 ni števila q s q · 0 = a (vsak
produkt z ničlo je 0).
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#ne-z-nic
besedilo: »Deliti z ničlo ne moremo, ker ni števila, ki bi ga pomnožil z $0$ in dobil $7$. Velja le $0 : 7 = 0$.« -/
theorem ne_z_nic (a : ℕ) (ha : a ≠ 0) : ¬ ∃ q : ℕ, q * 0 = a := by
  rintro ⟨q, h⟩
  simp at h
  exact ha h.symm

example := ne_z_nic 12 (by norm_num)

/-- Razlaga 9, Pogoste napake 5: 7 · 0 = 0 (ne 7), 0 : 7 = 0, ni q s q · 0 = 7.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#nic-sedem
besedilo: »Produkt z ničlo je $0$.« -/
theorem nic_sedem : 7 * 0 = 0 ∧ 7 * 0 ≠ 7 ∧ 0 / 7 = 0 ∧ ¬ ∃ q : ℕ, q * 0 = 7 := by
  refine ⟨rfl, by decide, rfl, fun ⟨q, h⟩ => by simp at h⟩

/-! ## Razlaga 10: računanje na pamet -/

/-- Razlaga 10: 4 · 37 · 25 = 37 · (4 · 25) = 37 · 100 = 3 700; 12 · 15 = 12 · (10 + 5) = 120 + 60 = 180.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#na-pamet
besedilo: »ali število razbij, $12 \cdot 15 = 12 \cdot (10 + 5) = 120 + 60 = 180$.« -/
theorem na_pamet : 4 * 37 * 25 = 3700 ∧ 12 * 15 = 180 := by
  constructor
  · calc 4 * 37 * 25 = 37 * (4 * 25) := by ring
      _ = 37 * 100 := by norm_num
      _ = 3700 := by norm_num
  · calc 12 * 15 = 12 * (10 + 5) := by norm_num
      _ = 120 + 60 := by norm_num
      _ = 180 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 2: (48 − 3 · 6) : 5 + 2 · (9 − 4) = (48 − 18) : 5 + 2 · 5 = 30 : 5 + 2 · 5 = 6 + 10 = 16; preizkus
deljenja 6 · 5 = 30.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#primer2
besedilo: »Odgovor: vrednost izraza je $16$. Preizkus deljenja: $6 \cdot 5 = 30$.« -/
theorem primer2 : (48 - 3 * 6) / 5 + 2 * (9 - 4) = 16 ∧ 6 * 5 = 30 := by
  refine ⟨?_, rfl⟩
  calc (48 - 3 * 6) / 5 + 2 * (9 - 4) = (48 - 18) / 5 + 2 * 5 := by norm_num
    _ = 30 / 5 + 2 * 5 := by norm_num
    _ = 6 + 10 := by norm_num
    _ = 16 := by norm_num

/-- Primer 3: 4 · 125 + 4 · 25 = 4 · (125 + 25) = 4 · 150 = 600; preizkus 4 · 125 = 500, 4 · 25 = 100,
500 + 100 = 600.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#primer3
besedilo: »Odgovor: šola je plačala $600$ €.« -/
theorem primer3 : 4 * 125 + 4 * 25 = 600 ∧ 4 * 125 = 500 ∧ 4 * 25 = 100 ∧ 500 + 100 = 600 := by
  refine ⟨?_, rfl, rfl, rfl⟩
  calc 4 * 125 + 4 * 25 = 4 * (125 + 25) := by rw [Nat.mul_add]
    _ = 4 * 150 := by norm_num
    _ = 600 := by norm_num

/-- Primer 4: 6 · 99 = 6 · (100 − 1) = 6 · 100 − 6 · 1 = 600 − 6 = 594; 6 · 100 − 1 = 599 ni pravilno.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#primer4
besedilo: »$6 \cdot 100 - 6 \cdot 1 = 600 - 6 = 594$ sedežev.« -/
theorem primer4 : 6 * 99 = 594 ∧ 6 * 100 - 1 = 599 ∧ 6 * 99 ≠ 599 := by
  refine ⟨?_, rfl, by decide⟩
  calc 6 * 99 = 6 * (100 - 1) := by norm_num
    _ = 6 * 100 - 6 * 1 := Nat.mul_sub 6 100 1
    _ = 600 - 6 := by norm_num
    _ = 594 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1: 7 + 3 · 5 = 7 + 15 = 22, ne (7 + 3) · 5 = 10 · 5 = 50.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#napaka1
besedilo: »Pravilno: $3 \cdot 5 = 15$, nato $7 + 15 = 22$.« -/
theorem napaka1 : 3 * 5 = 15 ∧ 7 + 3 * 5 = 7 + 15 ∧ 7 + 15 = 22 ∧ (7 + 3) * 5 = 50 := by decide

/-- Pogoste napake 4: 3 · (4 + 5) ni 3 · 4 + 5 = 17, ampak 3 · 4 + 3 · 5 = 27; preizkus 3 · 9 = 27.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#napaka4
besedilo: »S faktorjem pomnožimo vsak člen: $3 \cdot 4 + 3 \cdot 5 = 27$. Preizkus: $3 \cdot 9 = 27$.« -/
theorem napaka4 : 3 * 4 + 5 = 17 ∧ 3 * (4 + 5) ≠ 17 ∧ 3 * (4 + 5) = 3 * 4 + 3 * 5 ∧ 3 * 4 + 3 * 5 = 27 ∧
    3 * 9 = 27 := by
  decide

/-! ## Drugače -/

/-- Drugače (analogija): 2 · (3 + 5) = 2 · 8 = 16 = 2 · 3 + 2 · 5 = 6 + 10; brez oklepaja 2 · 3 + 5 = 11.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#ponavljanje
besedilo: »Zato je $2 \cdot 3 + 5 = 11$ taktov: kitica dvakrat, refren enkrat.« -/
theorem ponavljanje : 2 * (3 + 5) = 2 * 8 ∧ 2 * 8 = 16 ∧ 2 * 3 = 6 ∧ 2 * 5 = 10 ∧ 6 + 10 = 16 ∧ 2 * 3 + 5 = 11 := by
  decide

/-- Drugače (bolj natančno): 3 · 4 = 4 + 4 + 4, zato 2 + 3 · 4 = 2 + (4 + 4 + 4) = 14; 3 · (4 + 5) =
(4 + 5) + (4 + 5) + (4 + 5) = 4 + 4 + 4 + 5 + 5 + 5 = 3 · 4 + 3 · 5; splošno 3 · a = a + a + a.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#skrajsano
besedilo: »Množenje je skrajšano seštevanje enakih členov: $3 \cdot 4 = 4 + 4 + 4$.« -/
theorem skrajsano (a : ℕ) : 3 * a = a + a + a ∧ 2 + 3 * 4 = 2 + (4 + 4 + 4) ∧ 2 + (4 + 4 + 4) = 14 ∧
    3 * (4 + 5) = (4 + 5) + (4 + 5) + (4 + 5) ∧ (4 + 5) + (4 + 5) + (4 + 5) = 4 + 4 + 4 + 5 + 5 + 5 ∧
    4 + 4 + 4 + 5 + 5 + 5 = 3 * 4 + 3 * 5 := by
  refine ⟨by ring, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Drugače (bolj natančno): odštevanje vsote a − (b + c) = a − b − c (20 − (8 + 5) = 7 = 20 − 8 − 5) in
razlike a − (b − c) = a − b + c za c ≤ b ≤ a (20 − (8 − 5) = 17 = 20 − 8 + 5).
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#odstevanje-vsote
besedilo: »Kdor odšteje vsoto, odšteje vsak člen: $20 - (8 + 5) = 7$ in $20 - 8 - 5 = 7$.« -/
theorem odstevanje_vsote (a b c : ℕ) (hcb : c ≤ b) (hba : b ≤ a) :
    a - (b + c) = a - b - c ∧ a - (b - c) = a - b + c ∧ 20 - (8 + 5) = 7 ∧ 20 - 8 - 5 = 7 ∧
      20 - (8 - 5) = 17 ∧ 20 - 8 + 5 = 17 := by
  refine ⟨by omega, by omega, rfl, rfl, rfl, rfl⟩

example := odstevanje_vsote 20 8 5 (by norm_num) (by norm_num)

/-- Drugače (bolj natančno): 12 : 3 = 4 pomeni 4 · 3 = 12; števila q s q · 0 = 12 ni.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#deljenje-pomen
besedilo: »Vsak produkt z ničlo pa je $0$, zato takega števila ni.« -/
theorem deljenje_pomen : 12 / 3 = 4 ∧ 4 * 3 = 12 ∧ ¬ ∃ q : ℕ, q * 0 = 12 := by
  refine ⟨rfl, rfl, fun ⟨q, h⟩ => by simp at h⟩

/-! ## Preveri se -/

/-- Preveri se 1: 2 + 3 · 4 = 3 · 4 + 2 = 2 + 12 = 14, (2 + 3) · 4 = 5 · 4 = 20.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#preveri1
besedilo: »Oklepaj zahteva, da najprej seštejemo: $5 \cdot 4 = 20$. Ostali trije izrazi imajo vrednost $14$.« -/
theorem preveri1 : (2 + 3) * 4 = 5 * 4 ∧ 5 * 4 = 20 ∧ 2 + 3 * 4 = 14 ∧ 3 * 4 + 2 = 14 ∧ 2 + 12 = 14 := by decide

/-- Preveri se 2: (14 − 2 · 3) · 5 − 6 = 34: 2 · 3 = 6, 14 − 6 = 8, 8 · 5 = 40, 40 − 6 = 34; napačno 40 (brez
zadnjega koraka) in (14 − 2) · 3 · 5 − 6 = 174.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#preveri2
besedilo: »V oklepaju: $2 \cdot 3 = 6$, $14 - 6 = 8$. Nato $8 \cdot 5 = 40$ in $40 - 6 = 34$.« -/
theorem preveri2 : (14 - 2 * 3) * 5 - 6 = 34 ∧ (14 - 2) * 3 * 5 - 6 = 174 := by
  refine ⟨?_, rfl⟩
  calc (14 - 2 * 3) * 5 - 6 = (14 - 6) * 5 - 6 := by norm_num
    _ = 8 * 5 - 6 := by norm_num
    _ = 40 - 6 := by norm_num
    _ = 34 := by norm_num

/-- Preveri se 3: 20 − 8 − 4 = 12 − 4 = 8, 20 − (8 − 4) = 20 − 4 = 16.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#preveri3
besedilo: »$20 - 8 - 4 = 12 - 4 = 8$, $20 - (8 - 4) = 20 - 4 = 16$.« -/
theorem preveri3 : 20 - 8 - 4 = 12 - 4 ∧ 12 - 4 = 8 ∧ 20 - (8 - 4) = 20 - 4 ∧ 20 - 4 = 16 := by decide

/-- Preveri se 4: 24 : 4 · 3 + 2 = 6 · 3 + 2 = 18 + 2 = 20; Rokov račun 24 : (4 · 3) + 2 = 4.
trditev: MAT-OS-6/racunske-operacije-in-lastnosti#preveri4
besedilo: »Najprej od leve: $24 : 4 = 6$, nato $6 \cdot 3 = 18$ in $18 + 2 = 20$.« -/
theorem preveri4 : 24 / 4 * 3 + 2 = 20 ∧ 24 / (4 * 3) + 2 = 4 := by
  refine ⟨?_, rfl⟩
  calc 24 / 4 * 3 + 2 = 6 * 3 + 2 := by norm_num
    _ = 18 + 2 := by norm_num
    _ = 20 := by norm_num

end Evklid.Lekcije.MAT_OS_6.RacunskeOperacijeInLastnosti
