/-
vir: content/lessons/MAT-OS-6/racunanje-z-decimalnimi-stevili.md
sha256: 54d0aa537cfe073194d5fb1a47cd1a201446b35e151d00c3ebd9506969bae9e6
Model: decimalna števila so točni ulomki v ℚ (npr. 2,4 = 24/10); število z m decimalkami je a/10^m z a celim.
»Decimalke« pravil so zato eksponenti potenc 10: pravilo za množenje je (a/10^m) · (b/10^n) = (a · b)/10^(m+n),
za seštevanje a/10^m + b/10^m = (a + b)/10^m, dopisane ničle pa a/10^m = (a · 10^k)/10^(m+k). Koraki pisnega
deljenja so deljenje z ostankom v ℕ (`n = d · q + r`, r < d). Enote (kg, l, €) so le v docstringih.
Lean: x/0 = 0, zato pravilo o razširjanju količnika velja v Leanu tudi pri delitelju 0 (zapisano s pogojem k ≠ 0,
kot v lekciji). Pravila »množenje s številom pod 1 zmanjša, deljenje z njim poveča« veljajo za pozitivna števila
(lekcija računa s pozitivnimi decimalnimi števili); naravna števila so ≥ 1.
Ni v Leanu: uganka in zgodbe (recept, mama, brat, sestra) kot opis, dokazani so njihovi računi; pisni postopki kot
zapis s števkami (»vejica pod vejico«, »enice pod enice«, »prečrtana ničla«, »vejico zapišemo v količnik«), dokazani
so njihovi rezultati in pravila zgoraj; simulacija in slika s kvadratki kot slika (dokazani so računi 0,7 + 0,5 = 1,2
in 0,3 · 0,2 = 0,06 ter 6 kvadratkov po 0,01); »ocena« kot navodilo (dokazane so ocene, ki jih lekcija izračuna);
razlage napačnih odgovorov v kvizih, razen kjer so dokazane kot račun.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.RacunanjeZDecimalnimiStevili

/-! ## Splošna pravila -/

/-- Razlaga 2, Povzetek 2, Bolj natančno (množenje): zmnožek števil z m in n decimalkami je zmnožek »naravnih«
števil z m + n decimalkami: (a/10^m) · (b/10^n) = (a · b)/10^(m+n).
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#mnozenje
besedilo: »Pri množenju množimo kot naravni števili, v zmnožku ima število toliko decimalk, kot jih imata faktorja skupaj.« -/
theorem mnozenje (a b : ℤ) (m n : ℕ) :
    (a : ℚ) / 10 ^ m * ((b : ℚ) / 10 ^ n) = ((a * b : ℤ) : ℚ) / 10 ^ (m + n) := by
  rw [pow_add]; push_cast; field_simp

/-- Razlaga 1, Povzetek 1, Bolj natančno (seštevanje): dopisane ničle ne spremenijo vrednosti
(a/10^m = (a · 10^k)/10^(m+k)); števili z enakim številom decimalk seštejemo in odštejemo kot naravni števili.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#sestevanje
besedilo: »Decimalna števila seštevamo in odštevamo **vejica pod vejico**, manjkajoča mesta dopolnimo z ničlami.« -/
theorem sestevanje (a b : ℤ) (m k : ℕ) :
    (a : ℚ) / 10 ^ m = ((a * 10 ^ k : ℤ) : ℚ) / 10 ^ (m + k) ∧
      (a : ℚ) / 10 ^ m + (b : ℚ) / 10 ^ m = ((a + b : ℤ) : ℚ) / 10 ^ m ∧
      (a : ℚ) / 10 ^ m - (b : ℚ) / 10 ^ m = ((a - b : ℤ) : ℚ) / 10 ^ m := by
  refine ⟨?_, ?_, ?_⟩
  · rw [pow_add]; push_cast; field_simp
  · push_cast; ring
  · push_cast; ring

/-- Razlaga 5, Povzetek 4, Bolj natančno (deljenje): količnik se ne spremeni, če deljenec in delitelj pomnožimo z
istim neničelnim številom k: x : y = (x · k) : (y · k).
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#deljenje
besedilo: »Količnik se ne spremeni, če deljenec in delitelj pomnožimo z istim neničelnim številom« -/
theorem deljenje (x y k : ℚ) (hk : k ≠ 0) : x / y = (x * k) / (y * k) := (mul_div_mul_right x y hk).symm

/-- Predpostavka trditve `deljenje` se da izpolniti, izrek uporabljen na 4,8 : 0,6 in k = 10. -/
example := deljenje (48 / 10) (6 / 10) 10 (by norm_num)

/-- Bolj natančno (deljenje): če pomnožimo le delitelj z 10, delimo z desetkrat večjim številom in dobimo desetkrat
manjši rezultat: x : (10 · y) = (x : y) : 10.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#le-delitelj
besedilo: »Če bi pomnožili le delitelj, bi delili z desetkrat večjim številom in dobili desetkrat manjši rezultat.« -/
theorem le_delitelj (x y : ℚ) : x / (10 * y) = x / y / 10 := by
  rw [div_div, mul_comm]

/-- Razlaga 3, Povzetek 5: množenje z 10^k in deljenje z 10^k sta obratni operaciji; npr. 3,47 · 100 = 347,
45,6 : 10 = 4,56.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#potence-10
besedilo: »Pri množenju se vejica premakne v desno za toliko mest, kolikor ničel ima množitelj: $3{,}47 \cdot 100 = 347$.« -/
theorem potence_10 (x : ℚ) (k : ℕ) : x * 10 ^ k / 10 ^ k = x ∧ (347 / 100 : ℚ) * 100 = 347 ∧
    (456 / 10 : ℚ) / 10 = 456 / 100 := by
  refine ⟨by field_simp, by norm_num, by norm_num⟩

/-- Razlaga 2 (premisli), Pogoste napake 3, Povzetek 6: množenje s pozitivnim številom, manjšim od 1, pozitivno
število zmanjša, deljenje z njim pa poveča.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#pod-ena
besedilo: »Množenje s številom, manjšim od $1$, zmanjša, deljenje z njim poveča.« -/
theorem pod_ena (x q : ℚ) (hx : 0 < x) (hq : 0 < q) (hq1 : q < 1) : x * q < x ∧ x < x / q := by
  refine ⟨by nlinarith, ?_⟩
  rw [lt_div_iff₀ hq]; nlinarith

/-- Predpostavke trditve `pod_ena` se dajo izpolniti, izrek uporabljen na 8 · 0,5 in 3 : 0,5. -/
example := pod_ena 8 (1 / 2) (by norm_num) (by norm_num) (by norm_num)

/-- Razlaga 2 (premisli), Pogoste napake 3: pri naravnih številih (≥ 1) množenje ne zmanjša, deljenje ne poveča.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#naravna
besedilo: »Pri naravnih številih množenje nikoli ne zmanjša števila.« -/
theorem naravna (n d : ℕ) (hd : 1 ≤ d) : n ≤ n * d ∧ n / d ≤ n :=
  ⟨Nat.le_mul_of_pos_right n hd, Nat.div_le_self n d⟩

/-- Predpostavka trditve `naravna` se da izpolniti, izrek uporabljen na 8 in 2. -/
example := naravna 8 2 (by norm_num)

/-- Pogoste napake 2: zmnožek dveh pozitivnih števil, manjših od 1, je manjši od 1 (in manjši od obeh faktorjev).
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#oba-pod-ena
besedilo: »Ocena pomaga: oba faktorja sta manjša od $1$, zato mora biti tudi zmnožek manjši od $1$.« -/
theorem oba_pod_ena (x y : ℚ) (hx : 0 < x) (hx1 : x < 1) (hy : 0 < y) (hy1 : y < 1) :
    x * y < 1 ∧ x * y < x ∧ x * y < y := by
  refine ⟨by nlinarith, by nlinarith, by nlinarith⟩

/-- Predpostavke trditve `oba_pod_ena` se dajo izpolniti, izrek uporabljen na 0,4 · 0,3. -/
example := oba_pod_ena (4 / 10) (3 / 10) (by norm_num) (by norm_num) (by norm_num) (by norm_num)

/-- Razlaga 6, Povzetek 7: preizkus z obratno operacijo: (a − b) + b = a in (a : b) · b = a za b ≠ 0.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#preizkus
besedilo: »Po računu ga preveri z obratno operacijo: odštevanje s seštevanjem, deljenje z množenjem.« -/
theorem preizkus (a b : ℚ) (hb : b ≠ 0) : (a - b) + b = a ∧ a / b * b = a :=
  ⟨by ring, div_mul_cancel₀ a hb⟩

/-- Predpostavka trditve `preizkus` se da izpolniti, izrek uporabljen na 7,56 : 4. -/
example := preizkus (756 / 100) 4 (by norm_num)

/-! ## Zakaj se tega učimo, Razlaga -/

/-- Zakaj se tega učimo, Razlaga 2: 4 · 5 = 20, 0,4 · 0,5 = 0,20 = 0,2 (prav ima mama, ne brat 2 in ne sestra 0,02);
polovica od 0,4 je manj kot 0,4.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#uganka
besedilo: »Zdaj lahko rešiš uganko: $4 \cdot 5 = 20$, decimalki sta dve, torej $0{,}4 \cdot 0{,}5 = 0{,}20 = 0{,}2$.« -/
theorem uganka : (4 : ℚ) * 5 = 20 ∧ (4 / 10 : ℚ) * (5 / 10) = 20 / 100 ∧ (20 / 100 : ℚ) = 2 / 10 ∧
    (4 / 10 : ℚ) * (5 / 10) ≠ 2 ∧ (4 / 10 : ℚ) * (5 / 10) ≠ 2 / 100 ∧ (4 / 10 : ℚ) * (5 / 10) < 4 / 10 := by
  norm_num

/-- Razlaga 1: 2,50 + 0,75 = 3,25 (kg).
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#krompir
besedilo: »V skledi je $3{,}25\,\text{kg}$ krompirja.« -/
theorem krompir : (250 / 100 : ℚ) + 75 / 100 = 325 / 100 ∧ (25 / 10 : ℚ) = 250 / 100 := by norm_num

/-- Razlaga 2, Na sliki: 3 · 2 = 6 stotink, 0,3 · 0,2 = 0,06, kar je manj od obeh faktorjev.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#desetinka-desetinke
besedilo: »Pri $0{,}3 \cdot 0{,}2$ zmnožimo $3 \cdot 2 = 6$, vsak del pa je stotinka, zato je $0{,}3 \cdot 0{,}2 = 0{,}06$.« -/
theorem desetinka_desetinke : (1 / 10 : ℚ) * (1 / 10) = 1 / 100 ∧ (3 : ℚ) * 2 = 6 ∧
    (3 / 10 : ℚ) * (2 / 10) = 6 * (1 / 100) ∧ (3 / 10 : ℚ) * (2 / 10) = 6 / 100 ∧
    (6 / 100 : ℚ) < 2 / 10 ∧ (6 / 100 : ℚ) < 3 / 10 := by norm_num

/-- Razlaga 2 (premisli): 8 · 0,5 = 4, manj kot 8.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#osem-pol
besedilo: »Manj: $8 \cdot 0{,}5 = 4$.« -/
theorem osem_pol : (8 : ℚ) * (5 / 10) = 4 ∧ (8 : ℚ) * (5 / 10) < 8 := by norm_num

/-- Razlaga 5: 4,8 l : 0,6 l = 48 dl : 6 dl, 4,8 : 0,6 = 48 : 6 = 8 kozarcev; premisli: 3 : 0,5 = 30 : 5 = 6 > 3.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#decimalni-delitelj
besedilo: »V decilitrih je to $48\,\text{dl} : 6\,\text{dl}$, torej $4{,}8 : 0{,}6 = 48 : 6 = 8$ kozarcev.« -/
theorem decimalni_delitelj : (48 / 10 : ℚ) / (6 / 10) = 48 / 6 ∧ (48 : ℚ) / 6 = 8 ∧
    (3 : ℚ) / (5 / 10) = 30 / 5 ∧ (30 : ℚ) / 5 = 6 ∧ (3 : ℚ) < 3 / (5 / 10) := by norm_num

/-- Razlaga (simulacija), Na sliki: 0,7 + 0,5 = 12 desetink = 1,2 (ne 0,12); 3,4 + 7 · 0,1 = 4,1.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#premica
besedilo: »$3{,}4 + 0{,}7$ pomeni skok od $3{,}4$ za sedem malih korakov. Pristanemo pri $4{,}1$.« -/
theorem premica : (7 / 10 : ℚ) + 5 / 10 = 12 * (1 / 10) ∧ (7 / 10 : ℚ) + 5 / 10 = 12 / 10 ∧
    (7 / 10 : ℚ) + 5 / 10 ≠ 12 / 100 ∧ (34 / 10 : ℚ) + 7 * (1 / 10) = 41 / 10 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: 1,25 + 0,60 = 1,85 (ocena 1 + 1 = 2); 2,00 − 1,85 = 0,15; preizkus 1,85 + 0,15 = 2.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#primer1
besedilo: »Odgovor: porabiš $1{,}85\,\text{kg}$ moke, ostane je $0{,}15\,\text{kg}$.« -/
theorem primer1 : (125 / 100 : ℚ) + 60 / 100 = 185 / 100 ∧ (6 / 10 : ℚ) = 60 / 100 ∧ (1 : ℚ) + 1 = 2 ∧
    (2 : ℚ) - 185 / 100 = 15 / 100 ∧ (185 / 100 : ℚ) + 15 / 100 = 2 := by norm_num

/-- Primer 2: 24 · 15 = 360, 2,4 · 1,5 = 3,60 = 3,6 (ocena 2 · 1,5 = 3); deljenje 7,56 : 4: 7 = 4 · 1 + 3,
35 = 4 · 8 + 3, 36 = 4 · 9 + 0, količnik 1,89; preizkus 1,89 · 4 = 7,56.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#primer2
besedilo: »Odgovor: $2{,}4 \cdot 1{,}5 = 3{,}6$ in $7{,}56 : 4 = 1{,}89$. Preizkus: $1{,}89 \cdot 4 = 7{,}56$.« -/
theorem primer2 : (24 : ℚ) * 15 = 360 ∧ (24 / 10 : ℚ) * (15 / 10) = 360 / 100 ∧ (360 / 100 : ℚ) = 36 / 10 ∧
    (2 : ℚ) * (15 / 10) = 3 ∧ 7 / 4 = 1 ∧ 7 % 4 = 3 ∧ 35 / 4 = 8 ∧ 35 % 4 = 3 ∧ 36 / 4 = 9 ∧ 36 % 4 = 0 ∧
    (756 / 100 : ℚ) / 4 = 189 / 100 ∧ (189 / 100 : ℚ) * 4 = 756 / 100 := by
  norm_num

/-- Primer 3: 1,8 : 0,15 = 180 : 15 = 12 kozarcev (n · 0,15 = 1,8 natanko pri n = 12; preizkus 0,15 · 12 = 1,8);
3,6 : 12: 3 : 12 = 0, 36 : 12 = 3, torej 0,3 (€).
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#primer3
besedilo: »Odgovor: napolniš $12$ kozarcev, en kozarec soka stane $0{,}30\,€$.« -/
theorem primer3 (n : ℚ) : (18 / 10 : ℚ) / (15 / 100) = 180 / 15 ∧ (180 : ℚ) / 15 = 12 ∧
    (n * (15 / 100) = 18 / 10 ↔ n = 12) ∧ (15 / 100 : ℚ) * 12 = 18 / 10 ∧ 3 / 12 = 0 ∧ 36 / 12 = 3 ∧
    (36 / 10 : ℚ) / 12 = 3 / 10 := by
  refine ⟨by norm_num, by norm_num, ⟨fun e => by linarith, fun e => by rw [e]; norm_num⟩, by norm_num, by norm_num,
    by norm_num, by norm_num⟩

/-- Primer 4: ocena 3 : 6 = 0,5; 2 : 6 = 0, 27 = 6 · 4 + 3, 30 = 6 · 5 + 0, zato 2,7 : 6 = 0,45 (l); preizkus
0,45 · 6 = 2,7.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#primer4
besedilo: »V krožniku je $2{,}7 : 6 = 0{,}45\,\text{l}$ juhe. Preizkus: $0{,}45 \cdot 6 = 2{,}7$.« -/
theorem primer4 : (3 : ℚ) / 6 = 1 / 2 ∧ 2 / 6 = 0 ∧ 27 / 6 = 4 ∧ 27 % 6 = 3 ∧ 30 / 6 = 5 ∧ 30 % 6 = 0 ∧
    (27 / 10 : ℚ) / 6 = 45 / 100 ∧ (45 / 100 : ℚ) * 6 = 27 / 10 := by
  norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1: 12,75 + 3,40 = 16,15 (ne 13,09).
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#napaka1
besedilo: »Pravilno: $12{,}75 + 3{,}40 = 16{,}15$, vejica pod vejico.« -/
theorem napaka1 : (1275 / 100 : ℚ) + 340 / 100 = 1615 / 100 ∧ (1275 / 100 : ℚ) + 34 / 10 ≠ 1309 / 100 := by
  norm_num

/-- Pogoste napake 2: decimalki se seštejeta (1 + 1 = 2): 0,4 · 0,3 = 0,12, ne 1,2.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#napaka2
besedilo: »Decimalke se seštejejo: $1 + 1 = 2$, torej $0{,}12$.« -/
theorem napaka2 : (4 / 10 : ℚ) * (3 / 10) = 12 / 100 ∧ (4 / 10 : ℚ) * (3 / 10) ≠ 12 / 10 := by norm_num

/-- Pogoste napake 4: 2,7 : 6 = 0,45, ne 4,5.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#napaka4
besedilo: »Ker gre $6$ v $2$ ničkrat, se mora količnik začeti z $0{,}$, torej $0{,}45$.« -/
theorem napaka4 : 2 / 6 = 0 ∧ (27 / 10 : ℚ) / 6 = 45 / 100 ∧ (27 / 10 : ℚ) / 6 ≠ 45 / 10 := by norm_num

/-- Pogoste napake 5, Preveri se 4: 6,3 : 0,7 = 63 : 7 = 9 (ne 6,3 : 7 = 0,9 in ne 630 : 7 = 90); preizkus
9 · 0,7 = 6,3.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#napaka5
besedilo: »Deljenec in delitelj pomnožimo z $10$: $63 : 7 = 9$. Preizkus: $9 \cdot 0{,}7 = 6{,}3$.« -/
theorem napaka5 : (63 / 10 : ℚ) / (7 / 10) = 63 / 7 ∧ (63 : ℚ) / 7 = 9 ∧ (9 : ℚ) * (7 / 10) = 63 / 10 ∧
    (63 / 10 : ℚ) / 7 = 9 / 10 ∧ (63 / 10 : ℚ) / (7 / 10) ≠ 9 / 10 ∧ (630 : ℚ) / 7 = 90 ∧
    (63 / 10 : ℚ) / (7 / 10) ≠ 90 := by
  norm_num

/-! ## Drugače -/

/-- Iz vsakdanjega življenja: 1,35 + 0,89 = 2,24; 5,00 − 2,24 = 2,76; 3 · 1,80 = 5,40 (3 · 180 = 540 centov);
9,60 : 4 = 2,40.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#denar
besedilo: »Skupaj plačaš $2{,}24\,€$. Če plačaš s $5\,€$, ti vrnejo $5{,}00 - 2{,}24 = 2{,}76\,€$.« -/
theorem denar : (135 / 100 : ℚ) + 89 / 100 = 224 / 100 ∧ (5 : ℚ) - 224 / 100 = 276 / 100 ∧
    (3 : ℚ) * (180 / 100) = 540 / 100 ∧ (3 : ℚ) * 180 = 540 ∧ (960 / 100 : ℚ) / 4 = 240 / 100 := by norm_num

/-- Bolj natančno: 0,3 · 0,07 = 3/10 · 7/100 = 21/1000 = 0,021 (10 · 100 = 1000); 0,4 + 0,25 = 40/100 + 25/100 =
65/100 = 0,65.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#bolj-natancno
besedilo: »$0{,}3 \cdot 0{,}07 = \dfrac{3}{10} \cdot \dfrac{7}{100} = \dfrac{21}{1000} = 0{,}021$.« -/
theorem bolj_natancno : (3 / 10 : ℚ) * (7 / 100) = 21 / 1000 ∧ (10 : ℚ) * 100 = 1000 ∧
    (4 / 10 : ℚ) = 40 / 100 ∧ (40 / 100 : ℚ) + 25 / 100 = 65 / 100 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1 in 2: 0,4 · 0,3 = 0,12 (dve decimalki, ne 1,2, ne 0,7 = 0,4 + 0,3, ne 0,012); 4 · 3 = 12.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#kviz2
besedilo: »$4 \cdot 3 = 12$, decimalki sta skupaj dve, zato $0{,}4 \cdot 0{,}3 = 0{,}12$.« -/
theorem kviz2 : (4 : ℚ) * 3 = 12 ∧ (4 / 10 : ℚ) * (3 / 10) = 12 / 100 ∧ (4 / 10 : ℚ) * (3 / 10) ≠ 12 / 10 ∧
    (4 / 10 : ℚ) + 3 / 10 = 7 / 10 ∧ (4 / 10 : ℚ) * (3 / 10) ≠ 7 / 10 ∧ (4 / 10 : ℚ) * (3 / 10) ≠ 12 / 1000 := by
  norm_num

/-- Preveri se 1 (napačen odgovor): če pomnožiš le delitelj (z 10), se neničelni količnik spremeni.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#kviz1
besedilo: »Če pomnožiš le delitelj, se količnik spremeni.« -/
theorem kviz1 (x y : ℚ) (h : x / y ≠ 0) : x / (y * 10) ≠ x / y := by
  rw [mul_comm, le_delitelj]
  intro e
  exact h (by linarith)

/-- Predpostavka trditve `kviz1` se da izpolniti, izrek uporabljen na 6,3 : 0,7. -/
example := kviz1 (63 / 10) (7 / 10) (by norm_num)

/-- Preveri se 3: 5 · 0,8 = 4, 5 + 0,8 = 5,8, 5 − 0,8 = 4,2, 5 : 0,8 = 50 : 8 = 6,25; največji je 5 : 0,8.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#kviz3
besedilo: »$5 : 0{,}8 = 50 : 8 = 6{,}25$. Deljenje s številom pod $1$ rezultat poveča, zato je to največ.« -/
theorem kviz3 : (5 : ℚ) * (8 / 10) = 4 ∧ (5 : ℚ) + 8 / 10 = 58 / 10 ∧ (5 : ℚ) - 8 / 10 = 42 / 10 ∧
    (5 : ℚ) / (8 / 10) = 50 / 8 ∧ (50 : ℚ) / 8 = 625 / 100 ∧
    (5 : ℚ) * (8 / 10) < 5 / (8 / 10) ∧ (5 : ℚ) + 8 / 10 < 5 / (8 / 10) ∧ (5 : ℚ) - 8 / 10 < 5 / (8 / 10) := by
  norm_num

/-- Preveri se 5: 16 · 25 = 400, 1,6 · 2,5 = 4,00 = 4 (€); 1,6 + 2,5 = 4,1; 40 in 0,40 sta napačna.
trditev: MAT-OS-6/racunanje-z-decimalnimi-stevili#kviz5
besedilo: »$16 \cdot 25 = 400$, dve decimalki: $1{,}6 \cdot 2{,}5 = 4{,}00 = 4$. Plačaš $4\,€$.« -/
theorem kviz5 : (16 : ℚ) * 25 = 400 ∧ (16 / 10 : ℚ) * (25 / 10) = 400 / 100 ∧ (400 / 100 : ℚ) = 4 ∧
    (16 / 10 : ℚ) + 25 / 10 = 41 / 10 ∧ (16 / 10 : ℚ) * (25 / 10) ≠ 40 ∧ (16 / 10 : ℚ) * (25 / 10) ≠ 40 / 100 ∧
    (3 : ℚ) < 16 / 10 * (25 / 10) := by
  norm_num

end Evklid.Lekcije.MAT_OS_6.RacunanjeZDecimalnimiStevili
