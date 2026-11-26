/-
vir: content/lessons/MAT-SS-4/obrestni-racun.md
sha256: 3607e0e062bc2dc771ada876b065d4f41cbc335a10ff8954a9171b744d5e324a
Ni v Leanu: navodila za računalo (tipke %, x^y, Ans, oklepaj pri 1,06^(1:12) – dokazano je le, da je
1,06/12 ≈ 0,088); simulacija »Navadno in obrestno obrestovanje« in opis grafov (premica, krivulja,
stolpci, stopnice); besedne utemeljitve in razlage (premisli, ustna vprašanja 1–2, poimenovanje
»konformna mera«, točkovanje); kvizne trditve brez računa (definicije navadnega/obrestnega
obrestovanja so zapisane kot pravila, ne kot izbira odgovora); »Povezava z vrstami« (le omenjena).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.ObrestniRacun

/-! ## Pomožna trditev: meje za m-ti koren (r_m = (1 + p/100)^(1/m)) -/

/-- Pomožno: če je aᵐ < y < bᵐ (y, b ≥ 0), leži m-ti koren y^(1/m) med a in b. Z njim so dokazani
vsi zaokroženi koreni v lekciji (konformne mere).
pomozno -/
theorem koren_med {y a b : ℝ} {m : ℕ} (hm : m ≠ 0) (hy : 0 ≤ y) (hb : 0 ≤ b)
    (h1 : a ^ m < y) (h2 : y < b ^ m) : a < y ^ ((1 : ℝ) / m) ∧ y ^ ((1 : ℝ) / m) < b := by
  have ht : (y ^ ((1 : ℝ) / m)) ^ m = y := by rw [one_div, Real.rpow_inv_natCast_pow hy hm]
  have ht0 : 0 ≤ y ^ ((1 : ℝ) / m) := Real.rpow_nonneg hy _
  constructor
  · by_contra h
    have := pow_le_pow_left₀ ht0 (not_lt.mp h) m
    linarith
  · by_contra h
    have := pow_le_pow_left₀ hb (not_lt.mp h) m
    linarith

/-- Predpostavke trditve `koren_med` se dajo izpolniti (m = 2, y = 2, a = 1, b = 2). -/
example : (2 : ℕ) ≠ 0 ∧ (0 : ℝ) ≤ 2 ∧ (0 : ℝ) ≤ 2 ∧ (1 : ℝ) ^ 2 < 2 ∧ (2 : ℝ) < 2 ^ 2 := by
  norm_num

/-- Pomožno: m-ti koren na m-to potenco je spet osnova: (y^(1/m))^m = y za y ≥ 0, m ≠ 0.
pomozno -/
theorem koren_pot {y : ℝ} {m : ℕ} (hm : m ≠ 0) (hy : 0 ≤ y) : (y ^ ((1 : ℝ) / m)) ^ m = y := by
  rw [one_div, Real.rpow_inv_natCast_pow hy hm]

/-- Predpostavke trditve `koren_pot` se dajo izpolniti. -/
example : (12 : ℕ) ≠ 0 ∧ (0 : ℝ) ≤ 1.06 := by norm_num

/-! ## Razlaga 1: odstotki in procentni račun -/

/-- Razlaga 1: 1 % = 1/100 = 0,01 in 15 % = 0,15.
trditev: MAT-SS-4/obrestni-racun#odstotek
besedilo: »Odstotki in procentni račun (ponovitev).** Odstotek je stotinka: $1\,\% = \frac{1}{100} = 0{,}01$, zato je $15\,\% = 0{,}15$.« -/
theorem odstotek : (1 : ℝ) / 100 = 0.01 ∧ (15 : ℝ) / 100 = 0.15 := by norm_num

/-- Razlaga 1: iz d = C·p/100 sledi p = 100·d/C (C ≠ 0).
trditev: MAT-SS-4/obrestni-racun#odstotek-iz-deleza
besedilo: »Od tod $p = \frac{100 \cdot d}{C}$« -/
theorem odstotek_iz_deleza (C d p : ℝ) (hC : C ≠ 0) : d = C * p / 100 ↔ p = 100 * d / C := by
  constructor
  · intro h; rw [h]; field_simp
  · intro h; rw [h]; field_simp

/-- Predpostavke trditve `odstotek_iz_deleza` se dajo izpolniti (C = 240). -/
example : (240 : ℝ) ≠ 0 := by norm_num

/-- Predpostavke trditve `odstotek_iz_deleza` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (240 : ℝ) ≠ 0 := by norm_num
  odstotek_iz_deleza (hC := w)

/-- Razlaga 1: iz d = C·p/100 sledi C = 100·d/p (p ≠ 0).
trditev: MAT-SS-4/obrestni-racun#osnova-iz-deleza
besedilo: »$C = \frac{100 \cdot d}{p}$« -/
theorem osnova_iz_deleza (C d p : ℝ) (hp : p ≠ 0) : d = C * p / 100 ↔ C = 100 * d / p := by
  constructor
  · intro h; rw [h]; field_simp
  · intro h; rw [h]; field_simp

/-- Predpostavke trditve `osnova_iz_deleza` se dajo izpolniti (p = 22). -/
example : (22 : ℝ) ≠ 0 := by norm_num

/-- Predpostavke trditve `osnova_iz_deleza` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (22 : ℝ) ≠ 0 := by norm_num
  osnova_iz_deleza (hp := w)

/-- Razlaga 1: 18 od 240 gostov: relativni delež 18/240 = 0,075 = 7,5 % (tudi 100·18/240 = 7,5).
trditev: MAT-SS-4/obrestni-racun#vegetarijanci
besedilo: »Primer: $18$ od $240$ gostov je vegetarijancev. **Relativni delež** je $\frac{d}{C} = \frac{18}{240} = 0{,}075 = 7{,}5\,\%$.« -/
theorem vegetarijanci : (18 : ℝ) / 240 = 0.075 ∧ (0.075 : ℝ) = 7.5 / 100 ∧ 100 * (18 : ℝ) / 240 = 7.5 := by
  norm_num

/-- Razlaga 1: povečanje za p %: C + C·p/100 = C(1 + p/100).
trditev: MAT-SS-4/obrestni-racun#povecanje
besedilo: »je nova cena $C + \frac{C \cdot p}{100} = C\left(1 + \frac{p}{100}\right)$« -/
theorem povecanje (C p : ℝ) : C + C * p / 100 = C * (1 + p / 100) := by ring

/-- Razlaga 1: zmanjšanje za p %: C − C·p/100 = C(1 − p/100).
trditev: MAT-SS-4/obrestni-racun#zmanjsanje
besedilo: »pri **zmanjšanju** pa $C\left(1 - \frac{p}{100}\right)$« -/
theorem zmanjsanje (C p : ℝ) : C - C * p / 100 = C * (1 - p / 100) := by ring

/-- Razlaga 1: podražitev za 15 % je množenje z 1,15, popust 15 % z 0,85.
trditev: MAT-SS-4/obrestni-racun#faktorja-15
besedilo: »Podražitev za $15\,\%$ je množenje z $1{,}15$, popust $15\,\%$ množenje z $0{,}85$.« -/
theorem faktorja_15 : 1 + (15 : ℝ) / 100 = 1.15 ∧ 1 - (15 : ℝ) / 100 = 0.85 := by norm_num

/-- Razlaga 1: cena 183 € z 22 % DDV je brez DDV 183 : 1,22 = 150 € (in 150·1,22 = 183).
trditev: MAT-SS-4/obrestni-racun#ddv
besedilo: »cena $183\,\text{€}$ z $22\,\%$ DDV je brez DDV $183 : 1{,}22 = 150\,\text{€}$.« -/
theorem ddv : (183 : ℝ) / 1.22 = 150 ∧ (150 : ℝ) * (1 + 22 / 100) = 183 := by norm_num

/-- Razlaga 1 in Pogoste napake: podražitev 20 % in pocenitev 20 %: 1,2·0,8 = 0,96, cena je 4 % nižja.
trditev: MAT-SS-4/obrestni-racun#zaporedni-20
besedilo: »Zaporedne spremembe množimo**, ne seštevamo: podražitev za $20\,\%$ in nato pocenitev za $20\,\%$ da $1{,}2 \cdot 0{,}8 = 0{,}96$, cena je za $4\,\%$ nižja, ker se drugi odstotek računa od večje osnove.« -/
theorem zaporedni_20 : (1.2 : ℝ) * 0.8 = 0.96 ∧ (0.96 : ℝ) = 1 - 4 / 100 := by norm_num

/-- Razlaga 1: s 3 % na 4 % je 1 odstotna točka, relativno pa tretjina.
trditev: MAT-SS-4/obrestni-racun#odstotne-tocke
besedilo: »Razliko dveh odstotkov merimo v **odstotnih točkah**: obrestna mera s $3\,\%$ na $4\,\%$ zraste za $1$ odstotno točko, relativno pa za tretjino.« -/
theorem odstotne_tocke : (4 : ℝ) - 3 = 1 ∧ ((4 : ℝ) - 3) / 3 = 1 / 3 := by norm_num

/-- Razlaga 1, hitri preizkus: jakna 60 € znižana za 30 %: 60·0,7 = 42 €.
trditev: MAT-SS-4/obrestni-racun#jakna
besedilo: »$60 \cdot 0{,}7 = 42\,\text{€}$« -/
theorem jakna : (60 : ℝ) * (1 - 30 / 100) = 60 * 0.7 ∧ (60 : ℝ) * 0.7 = 42 := by norm_num

/-! ## Razlaga 2–3: obresti in navadno obrestovanje -/

/-- Razlaga 2, hitri preizkus: obresti za 400 € pri p = 5 so 400·5/100 = 20 €.
trditev: MAT-SS-4/obrestni-racun#obresti-400
besedilo: »Hitri preizkus:* koliko obresti dobiš v enem letu za $400\,\text{€}$ pri $p = 5$? *(Odgovor: $20\,\text{€}$.)« -/
theorem obresti_400 : (400 : ℝ) * 5 / 100 = 20 := by norm_num

/-- Razlaga 3: G₀ + n·(G₀·p/100) = G₀(1 + n·p/100) (izpostavimo G₀).
trditev: MAT-SS-4/obrestni-racun#navadno-formula
besedilo: »$G_n = G_0 + n \cdot \frac{G_0 \cdot p}{100} = G_0 \left(1 + \frac{n \cdot p}{100}\right)$« -/
theorem navadno_formula (G₀ p n : ℝ) : G₀ + n * (G₀ * p / 100) = G₀ * (1 + n * p / 100) := by ring

/-- Razlaga 3: če se stanje vsako leto poveča za iste obresti o = G₀·p/100, je Gₙ = G₀(1 + n·p/100).
trditev: MAT-SS-4/obrestni-racun#navadno-stanje
besedilo: »zato se stanje vsako leto poveča za enake obresti $o = \frac{G_0 \cdot p}{100}$. Po $n$ letih je $G_n = G_0 + n \cdot \frac{G_0 \cdot p}{100} = G_0 \left(1 + \frac{n \cdot p}{100}\right)$« -/
theorem navadno_stanje (G : ℕ → ℝ) (p : ℝ) (h : ∀ k, G (k + 1) = G k + G 0 * p / 100) (n : ℕ) :
    G n = G 0 * (1 + n * p / 100) := by
  induction n with
  | zero => simp
  | succ k ih => rw [h k, ih]; push_cast; ring

/-- Predpostavke trditve `navadno_stanje` se dajo izpolniti (Gₖ = 1000 + 50k, p = 5). -/
example : ∃ G : ℕ → ℝ, ∀ k, G (k + 1) = G k + G 0 * 5 / 100 :=
  ⟨fun k => 1000 + 50 * k, fun k => by push_cast; ring⟩

/-- Predpostavke trditve `navadno_stanje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example : True :=
  have w : ∃ G : ℕ → ℝ, ∀ k, G (k + 1) = G k + G 0 * 5 / 100 :=
    ⟨fun k => 1000 + 50 * k, fun k => by push_cast; ring⟩
  (fun _ => trivial) (navadno_stanje (G := w.choose) (h := w.choose_spec))

/-- Razlaga 3: stanja navadnega obrestovanja tvorijo aritmetično zaporedje z diferenco o = G₀·p/100.
trditev: MAT-SS-4/obrestni-racun#navadno-aritmeticno
besedilo: »Stanja $G_0, G_1, G_2, \dots$ tvorijo **aritmetično zaporedje** z diferenco $o$.« -/
theorem navadno_aritmeticno (G₀ p : ℝ) (n : ℕ) :
    G₀ * (1 + ((n + 1 : ℕ) : ℝ) * p / 100) - G₀ * (1 + (n : ℝ) * p / 100) = G₀ * p / 100 := by
  push_cast; ring

/-- Razlaga 3, hitri preizkus: 800 € 4 leta pri 3 % navadno: 24 € na leto, skupaj 896 €.
trditev: MAT-SS-4/obrestni-racun#navadno-800
besedilo: »Hitri preizkus:* $800\,\text{€}$ vložimo za $4$ leta pri $3\,\%$ navadno. Koliko je na računu na koncu? *(Odgovor: vsako leto $24\,\text{€}$, skupaj $896\,\text{€}$.)« -/
theorem navadno_800 : (800 : ℝ) * 3 / 100 = 24 ∧ (800 : ℝ) + 4 * 24 = 896 ∧
    (800 : ℝ) * (1 + 4 * 3 / 100) = 896 := by norm_num

/-! ## Razlaga 4: obrestno obrestovanje -/

/-- Razlaga 4: obrestovalni faktor r = 1 + p/100; pri p = 3 je r = 1,03.
trditev: MAT-SS-4/obrestni-racun#faktor-3
besedilo: »Pri $p = 3$ je $r = 1{,}03$.« -/
theorem faktor_3 : 1 + (3 : ℝ) / 100 = 1.03 := by norm_num

/-- Razlaga 4: če vsako leto množimo z r, je Gₙ = G₀·rⁿ.
trditev: MAT-SS-4/obrestni-racun#obrestno-stanje
besedilo: »Vsako leto znova množimo z $r$: $$G_n = G_0 \cdot r^n$$« -/
theorem obrestno_stanje (G : ℕ → ℝ) (r : ℝ) (h : ∀ k, G (k + 1) = G k * r) (n : ℕ) :
    G n = G 0 * r ^ n := by
  induction n with
  | zero => simp
  | succ k ih => rw [h k, ih, pow_succ, mul_assoc]

/-- Predpostavke trditve `obrestno_stanje` se dajo izpolniti (Gₖ = 1000·1,05ᵏ). -/
example : ∃ G : ℕ → ℝ, ∀ k, G (k + 1) = G k * 1.05 :=
  ⟨fun k => 1000 * 1.05 ^ k, fun k => by simp only [pow_succ, mul_assoc]⟩

/-- Predpostavke trditve `obrestno_stanje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example : True :=
  have w : ∃ G : ℕ → ℝ, ∀ k, G (k + 1) = G k * 1.05 :=
    ⟨fun k => 1000 * 1.05 ^ k, fun k => by simp only [pow_succ, mul_assoc]⟩
  (fun _ => trivial) (obrestno_stanje (G := w.choose) (h := w.choose_spec))

/-- Razlaga 4: povečanje za p % je množenje z r: G + G·p/100 = G·(1 + p/100).
trditev: MAT-SS-4/obrestni-racun#obrestno-korak
besedilo: »Povečanje za $p\,\%$ je množenje z $1 + \frac{p}{100}$,« -/
theorem obrestno_korak (G p : ℝ) : G + G * p / 100 = G * (1 + p / 100) := by ring

/-- Razlaga 4: stanja G₀·rⁿ tvorijo geometrijsko zaporedje s količnikom r.
trditev: MAT-SS-4/obrestni-racun#obrestno-geometrijsko
besedilo: »Stanja tvorijo **geometrijsko zaporedje** s količnikom $r$.« -/
theorem obrestno_geometrijsko (G₀ r : ℝ) (n : ℕ) : G₀ * r ^ (n + 1) = (G₀ * r ^ n) * r := by ring

/-- Razlaga 4, hitri preizkus: 800 € 2 leti pri 3 % obrestno: 800·1,03² = 848,72 €.
trditev: MAT-SS-4/obrestni-racun#obrestno-800
besedilo: »$800 \cdot 1{,}03^2 = 848{,}72\,\text{€}$« -/
theorem obrestno_800 : (800 : ℝ) * 1.03 ^ 2 = 848.72 := by norm_num

/-- Razlaga 4, premisli: pri isti glavnici in meri sta po 1. letu stanji enaki.
trditev: MAT-SS-4/obrestni-racun#prvo-leto-enako
besedilo: »Pri isti meri sta obe po 1. letu enaki« -/
theorem prvo_leto_enako (G₀ p : ℝ) : G₀ * (1 + 1 * p / 100) = G₀ * (1 + p / 100) ^ 1 := by ring

/-! ## Razlaga 5: primerjava (1000 € pri 5 %) -/

/-- Razlaga 5, tabela, stolpec »navadno«: 1000(1 + n·5/100) za n = 0, 1, 2, 3, 5, 10, 20.
trditev: MAT-SS-4/obrestni-racun#tabela-navadno
besedilo: »| 0 | 1000 | 1000 | | 1 | 1050 | 1050 | | 2 | 1100 | 1102,50 | | 3 | 1150 | 1157,63 | | 5 | 1250 | 1276,28 | | 10 | 1500 | 1628,89 | | 20 | 2000 | 2653,30 |« -/
theorem tabela_navadno :
    (1000 : ℝ) * (1 + 0 * 5 / 100) = 1000 ∧ (1000 : ℝ) * (1 + 1 * 5 / 100) = 1050 ∧
    (1000 : ℝ) * (1 + 2 * 5 / 100) = 1100 ∧ (1000 : ℝ) * (1 + 3 * 5 / 100) = 1150 ∧
    (1000 : ℝ) * (1 + 5 * 5 / 100) = 1250 ∧ (1000 : ℝ) * (1 + 10 * 5 / 100) = 1500 ∧
    (1000 : ℝ) * (1 + 20 * 5 / 100) = 2000 := by norm_num

/-- Razlaga 5, tabela, stolpec »obrestno«: 1000·1,05ⁿ, zaokroženo na cente
(1000; 1050; 1102,50; 1157,63; 1276,28; 1628,89; 2653,30).
trditev: MAT-SS-4/obrestni-racun#tabela-obrestno
besedilo: »| 0 | 1000 | 1000 | | 1 | 1050 | 1050 | | 2 | 1100 | 1102,50 | | 3 | 1150 | 1157,63 | | 5 | 1250 | 1276,28 | | 10 | 1500 | 1628,89 | | 20 | 2000 | 2653,30 |« -/
theorem tabela_obrestno :
    (1000 : ℝ) * 1.05 ^ 0 = 1000 ∧ (1000 : ℝ) * 1.05 ^ 1 = 1050 ∧ (1000 : ℝ) * 1.05 ^ 2 = 1102.5 ∧
    |(1000 : ℝ) * 1.05 ^ 3 - 1157.63| ≤ 0.005 ∧ |(1000 : ℝ) * 1.05 ^ 5 - 1276.28| < 0.005 ∧
    |(1000 : ℝ) * 1.05 ^ 10 - 1628.89| < 0.005 ∧ |(1000 : ℝ) * 1.05 ^ 20 - 2653.30| < 0.005 := by
  norm_num [abs_le, abs_lt]

/-- Razlaga 5: po 2 letih je razlika 2,50 €, po 20 letih več kot 650 €
(Drugače: Na sliki – več kot trinajst stopnic po 50 €).
trditev: MAT-SS-4/obrestni-racun#razlika-tabela
besedilo: »Po $2$ letih je razlika le $2{,}50\,\text{€}$, po $20$ letih več kot $650\,\text{€}$.« -/
theorem razlika_tabela : (1000 : ℝ) * 1.05 ^ 2 - 1000 * (1 + 2 * 5 / 100) = 2.5 ∧
    (1000 : ℝ) * 1.05 ^ 20 - 1000 * (1 + 20 * 5 / 100) > 650 ∧ (13 : ℝ) * 50 = 650 := by
  norm_num

/-! ## Uganka (Razlaga 5, premisli): banka A navadno 6 %, banka B obrestno 5 %, 2000 € -/

/-- Uganka: po 5 letih A 2600 €, B ≈ 2552,56 €, boljša je A.
trditev: MAT-SS-4/obrestni-racun#uganka-5
besedilo: »Po $5$ letih: A $2600\,\text{€}$, B približno $2552{,}56\,\text{€}$, boljša je A.« -/
theorem uganka_5 : (2000 : ℝ) * (1 + 0.06 * 5) = 2600 ∧ |(2000 : ℝ) * 1.05 ^ 5 - 2552.56| < 0.005 ∧
    (2000 : ℝ) * 1.05 ^ 5 < 2000 * (1 + 0.06 * 5) := by norm_num [abs_lt]

/-- Uganka: po 10 letih A 3200 €, B ≈ 3257,79 €, boljša je B.
trditev: MAT-SS-4/obrestni-racun#uganka-10
besedilo: »Po $10$ letih: A $3200\,\text{€}$, B približno $3257{,}79\,\text{€}$, boljša je B.« -/
theorem uganka_10 : (2000 : ℝ) * (1 + 0.06 * 10) = 3200 ∧ |(2000 : ℝ) * 1.05 ^ 10 - 3257.79| < 0.005 ∧
    (2000 : ℝ) * (1 + 0.06 * 10) < 2000 * 1.05 ^ 10 := by norm_num [abs_lt]

/-- Uganka: po 8 letih A 2960 €, B ≈ 2954,91 € (A še boljša); po 9 letih A 3080 €, B ≈ 3102,66 €.
trditev: MAT-SS-4/obrestni-racun#uganka-8-9
besedilo: »Banka B prehiti A med 8. letom (A $2960\,\text{€}$, B $2954{,}91\,\text{€}$) in 9. letom (A $3080\,\text{€}$, B $3102{,}66\,\text{€}$).« -/
theorem uganka_8_9 : (2000 : ℝ) * (1 + 0.06 * 8) = 2960 ∧ |(2000 : ℝ) * 1.05 ^ 8 - 2954.91| < 0.005 ∧
    (2000 : ℝ) * 1.05 ^ 8 < 2000 * (1 + 0.06 * 8) ∧
    (2000 : ℝ) * (1 + 0.06 * 9) = 3080 ∧ |(2000 : ℝ) * 1.05 ^ 9 - 3102.66| < 0.005 ∧
    (2000 : ℝ) * (1 + 0.06 * 9) < 2000 * 1.05 ^ 9 := by norm_num [abs_lt]

/-- Uganka: »B prehiti A med 8. in 9. letom« – za 1 ≤ n ≤ 8 je A boljša, za vsak n ≥ 9 B.
trditev: MAT-SS-4/obrestni-racun#uganka-prehit
besedilo: »Banka B prehiti A med 8. letom (A $2960\,\text{€}$, B $2954{,}91\,\text{€}$) in 9. letom (A $3080\,\text{€}$, B $3102{,}66\,\text{€}$).« -/
theorem uganka_prehit (n : ℕ) :
    ((1 ≤ n ∧ n ≤ 8) → 2000 * (1.05 : ℝ) ^ n < 2000 * (1 + 0.06 * n)) ∧
    (9 ≤ n → 2000 * (1 + 0.06 * (n : ℝ)) < 2000 * (1.05 : ℝ) ^ n) := by
  constructor
  · rintro ⟨h1, h8⟩
    interval_cases n <;> norm_num
  · intro h9
    suffices h : 1 + 0.06 * (n : ℝ) < (1.05 : ℝ) ^ n by linarith
    induction n, h9 using Nat.le_induction with
    | base => norm_num
    | succ k hk ih =>
      have hk' : (9 : ℝ) ≤ k := by exact_mod_cast hk
      rw [pow_succ]; push_cast; nlinarith

/-! ## Razlaga 6: računanje nazaj -/

/-- Razlaga 6: iz Gₙ = G₀·rⁿ sledi G₀ = Gₙ/rⁿ (r ≠ 0).
trditev: MAT-SS-4/obrestni-racun#nazaj
besedilo: »Iz $G_n = G_0 \cdot r^n$ sledi $$G_0 = \frac{G_n}{r^n}$$« -/
theorem nazaj (G₀ Gn r : ℝ) (n : ℕ) (hr : r ≠ 0) : Gn = G₀ * r ^ n ↔ G₀ = Gn / r ^ n := by
  have : r ^ n ≠ 0 := pow_ne_zero n hr
  constructor
  · intro h; rw [h]; field_simp
  · intro h; rw [h]; field_simp

/-- Predpostavke trditve `nazaj` se dajo izpolniti (r = 1,04). -/
example : (1.04 : ℝ) ≠ 0 := by norm_num

/-- Predpostavke trditve `nazaj` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1.04 : ℝ) ≠ 0 := by norm_num
  nazaj (hr := w)

/-- Razlaga 6, hitri preizkus: 1081,60 : 1,04² = 1000 €.
trditev: MAT-SS-4/obrestni-racun#nazaj-1081
besedilo: »$1081{,}60 : 1{,}04^2 = 1000\,\text{€}$« -/
theorem nazaj_1081 : (1081.60 : ℝ) / 1.04 ^ 2 = 1000 := by norm_num

/-! ## Razlaga 7: relativna in konformna obrestna mera -/

/-- Razlaga 7: pri 6 % in mesečnem pripisu je p_r = 6/12 = 0,5 %, faktor 1,005; 1000·1,005¹² ≈ 1061,68 €,
kar je več kot 1060 € pri letnem pripisu.
trditev: MAT-SS-4/obrestni-racun#relativna-6
besedilo: »Pri $p = 6\,\%$ in mesečnem pripisu je $p_r = 0{,}5\,\%$, faktor $1{,}005$. V enem letu $1000\,\text{€}$ zraste na $1000 \cdot 1{,}005^{12} \approx 1061{,}68\,\text{€}$, kar je **več** kot $1060\,\text{€}$ pri letnem pripisu« -/
theorem relativna_6 : (6 : ℝ) / 12 = 0.5 ∧ 1 + (0.5 : ℝ) / 100 = 1.005 ∧
    |(1000 : ℝ) * 1.005 ^ 12 - 1061.68| < 0.005 ∧ (1060 : ℝ) < 1000 * 1.005 ^ 12 ∧
    (1000 : ℝ) * (1 + 6 / 100) = 1060 := by norm_num [abs_lt]

/-- Razlaga 7: konformni faktor r_m = (1 + p/100)^(1/m) izpolni r_mᵐ = 1 + p/100 (p ≥ −100, m ≠ 0).
trditev: MAT-SS-4/obrestni-racun#konformni-faktor
besedilo: »$r_m = \sqrt[m]{1 + \frac{p}{100}} = \left(1 + \frac{p}{100}\right)^{1/m}$« -/
theorem konformni_faktor (p : ℝ) (m : ℕ) (hp : -100 ≤ p) (hm : m ≠ 0) :
    ((1 + p / 100) ^ ((1 : ℝ) / m)) ^ m = 1 + p / 100 :=
  koren_pot hm (by linarith)

/-- Predpostavke trditve `konformni_faktor` se dajo izpolniti (p = 6, m = 12). -/
example : (-100 : ℝ) ≤ 6 ∧ (12 : ℕ) ≠ 0 := by norm_num

/-- Predpostavke trditve `konformni_faktor` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (-100 : ℝ) ≤ 6 ∧ (12 : ℕ) ≠ 0 := by norm_num
  konformni_faktor (hp := w.1) (hm := w.2)

/-- Razlaga 7: r₁₂ = ¹²√1,06 ≈ 1,004868, torej p_k ≈ 0,487 %.
trditev: MAT-SS-4/obrestni-racun#konformna-6
besedilo: »Pri $6\,\%$ in mesečnem pripisu je $r_{12} = \sqrt[12]{1{,}06} \approx 1{,}004868$, torej $p_k \approx 0{,}487\,\%$, malo manj od relativne mere.« -/
theorem konformna_6 : |(1.06 : ℝ) ^ ((1 : ℝ) / 12) - 1.004868| < 0.0000005 ∧
    |100 * ((1.06 : ℝ) ^ ((1 : ℝ) / 12) - 1) - 0.487| < 0.0005 := by
  have h := koren_med (m := 12) (y := 1.06) (a := 1.0048675) (b := 1.0048680) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  push_cast at h
  obtain ⟨h1, h2⟩ := h
  constructor <;> rw [abs_lt] <;> constructor <;> linarith

/-- Razlaga 7: konformna mera p_k ≈ 0,487 % je manjša od relativne 0,5 %.
trditev: MAT-SS-4/obrestni-racun#konformna-manjsa-6
besedilo: »torej $p_k \approx 0{,}487\,\%$, malo manj od relativne mere.« -/
theorem konformna_manjsa_6 : 100 * ((1.06 : ℝ) ^ ((1 : ℝ) / 12) - 1) < 0.5 := by
  have := (konformna_6).2
  rw [abs_lt] at this; linarith [this.2]

/-- Razlaga 7: 1000·(¹²√1,06)¹² = 1000·1,06 = 1060 €.
trditev: MAT-SS-4/obrestni-racun#konformna-leto
besedilo: »$1000 \cdot \left(\sqrt[12]{1{,}06}\right)^{12} = 1000 \cdot 1{,}06 = 1060\,\text{€}$« -/
theorem konformna_leto : (1000 : ℝ) * ((1.06 : ℝ) ^ ((1 : ℝ) / 12)) ^ 12 = 1060 := by
  calc (1000 : ℝ) * ((1.06 : ℝ) ^ ((1 : ℝ) / 12)) ^ 12 = 1000 * 1.06 := by
        rw [show (12 : ℕ) = ((12 : ℕ) : ℕ) from rfl]
        have := koren_pot (y := (1.06 : ℝ)) (m := 12) (by norm_num) (by norm_num)
        push_cast at this
        rw [this]
    _ = 1060 := by norm_num

/-- Razlaga 7: konformna mera v n letih (m·n pripisov) da G₀(ᵐ√r)^(m·n) = G₀·rⁿ (r ≥ 0, m ≠ 0).
trditev: MAT-SS-4/obrestni-racun#konformna-n-let
besedilo: »Konformna da $G = G_0 \left(\sqrt[m]{r}\right)^{m n} = G_0 \cdot r^n$, enako kot letni pripis.« -/
theorem konformna_n_let (G₀ r : ℝ) (m n : ℕ) (hr : 0 ≤ r) (hm : m ≠ 0) :
    G₀ * (r ^ ((1 : ℝ) / m)) ^ (m * n) = G₀ * r ^ n := by
  rw [pow_mul, koren_pot hm hr]

/-- Predpostavke trditve `konformna_n_let` se dajo izpolniti (r = 1,06, m = 12). -/
example : (0 : ℝ) ≤ 1.06 ∧ (12 : ℕ) ≠ 0 := by norm_num

/-- Predpostavke trditve `konformna_n_let` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) ≤ 1.06 ∧ (12 : ℕ) ≠ 0 := by norm_num
  konformna_n_let (hr := w.1) (hm := w.2)

/-- Razlaga 7, z računalom: brez oklepaja računalo izračuna 1,06¹ : 12 ≈ 0,088.
trditev: MAT-SS-4/obrestni-racun#brez-oklepaja
besedilo: »Brez njega računalo izračuna $1{,}06^1 : 12 \approx 0{,}088$.« -/
theorem brez_oklepaja : |(1.06 : ℝ) ^ 1 / 12 - 0.088| < 0.0005 := by norm_num [abs_lt]

/-! ## Drugače: Bolj natančno – Bernoullijeva neenakost -/

/-- Bolj natančno: (1 + nx)(1 + x) = 1 + (n+1)x + nx² (člen nx² so »obresti od obresti«).
trditev: MAT-SS-4/obrestni-racun#bernoulli-korak
besedilo: »$(1 + nx)(1 + x) = 1 + (n+1)x + nx^2$« -/
theorem bernoulli_korak (n x : ℝ) : (1 + n * x) * (1 + x) = 1 + (n + 1) * x + n * x ^ 2 := by ring

/-- Bolj natančno: (1 + x)ⁿ ≥ 1 + nx za vsak naravni n in x ≥ 0 (Bernoullijeva neenakost).
trditev: MAT-SS-4/obrestni-racun#bernoulli
besedilo: »$(1 + x)^n \ge 1 + nx$ za vsak naravni $n$ (Bernoullijeva neenakost).« -/
theorem bernoulli (x : ℝ) (hx : 0 ≤ x) (n : ℕ) : 1 + n * x ≤ (1 + x) ^ n :=
  one_add_mul_le_pow (by linarith) n

/-- Predpostavke trditve `bernoulli` se dajo izpolniti (x = 0,05). -/
example : (0 : ℝ) ≤ 0.05 := by norm_num

/-- Predpostavke trditve `bernoulli` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) ≤ 0.05 := by norm_num
  bernoulli (hx := w)

/-- Bolj natančno: za x > 0 in n ≥ 2 je neenakost stroga: (1 + x)ⁿ > 1 + nx.
trditev: MAT-SS-4/obrestni-racun#bernoulli-strogo
besedilo: »Ker je pozitiven, je neenakost za $n \ge 2$ stroga.« -/
theorem bernoulli_strogo (x : ℝ) (hx : 0 < x) (n : ℕ) (hn : 2 ≤ n) : 1 + n * x < (1 + x) ^ n := by
  induction n, hn using Nat.le_induction with
  | base => push_cast; nlinarith
  | succ k hk ih =>
    have hk' : (0 : ℝ) ≤ k := by positivity
    calc 1 + ((k + 1 : ℕ) : ℝ) * x ≤ 1 + (k + 1) * x + k * x ^ 2 := by
          push_cast; nlinarith [sq_nonneg x]
      _ = (1 + k * x) * (1 + x) := by ring
      _ < (1 + x) ^ k * (1 + x) := by gcongr
      _ = (1 + x) ^ (k + 1) := by rw [pow_succ]

/-- Predpostavke trditve `bernoulli_strogo` se dajo izpolniti (x = 0,05, n = 2). -/
example : (0 : ℝ) < 0.05 ∧ 2 ≤ 2 := by norm_num

/-- Predpostavke trditve `bernoulli_strogo` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 0.05 ∧ 2 ≤ 2 := by norm_num
  bernoulli_strogo (hx := w.1) (hn := w.2)

/-- Ustno vprašanje 3: pri G₀ > 0, p > 0 in n ≥ 2 je G₀·rⁿ > G₀(1 + n·p/100), r = 1 + p/100.
trditev: MAT-SS-4/obrestni-racun#obrestno-vecje
besedilo: »Zato velja $G_0 \cdot r^n > G_0 \left(1 + \frac{n \cdot p}{100}\right)$ za vsak $n \ge 2$.« -/
theorem obrestno_vecje (G₀ p : ℝ) (hG : 0 < G₀) (hp : 0 < p) (n : ℕ) (hn : 2 ≤ n) :
    G₀ * (1 + n * p / 100) < G₀ * (1 + p / 100) ^ n := by
  have h := bernoulli_strogo (p / 100) (by positivity) n hn
  have : 1 + n * p / 100 = 1 + n * (p / 100) := by ring
  rw [this]; exact mul_lt_mul_of_pos_left h hG

/-- Predpostavke trditve `obrestno_vecje` se dajo izpolniti (G₀ = 1000, p = 5, n = 2). -/
example : (0 : ℝ) < 1000 ∧ (0 : ℝ) < 5 ∧ 2 ≤ 2 := by norm_num

/-- Predpostavke trditve `obrestno_vecje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 1000 ∧ (0 : ℝ) < 5 ∧ 2 ≤ 2 := by norm_num
  obrestno_vecje (hG := w.1) (hp := w.2.1) (hn := w.2.2)

/-- Bolj natančno: relativna mera da v letu več: (1 + x/m)ᵐ > 1 + x za x > 0, m ≥ 2.
trditev: MAT-SS-4/obrestni-racun#relativna-vec
besedilo: »Bernoullijeva neenakost z $\frac{x}{m}$ namesto $x$ da $\left(1 + \frac{x}{m}\right)^m \ge 1 + x$, za $m \ge 2$ strogo.« -/
theorem relativna_vec (x : ℝ) (hx : 0 < x) (m : ℕ) (hm : 2 ≤ m) : 1 + x < (1 + x / m) ^ m := by
  have h2m : (2 : ℝ) ≤ m := by exact_mod_cast hm
  have hm0 : (m : ℝ) ≠ 0 := by linarith
  have h := bernoulli_strogo (x / m) (by positivity) m hm
  rwa [mul_div_cancel₀ x hm0] at h

/-- Predpostavke trditve `relativna_vec` se dajo izpolniti (x = 0,06, m = 12). -/
example : (0 : ℝ) < 0.06 ∧ 2 ≤ 12 := by norm_num

/-- Predpostavke trditve `relativna_vec` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 0.06 ∧ 2 ≤ 12 := by norm_num
  relativna_vec (hx := w.1) (hm := w.2)

/-- Bolj natančno: konformna mera je manjša od relativne: ᵐ√(1 + x) < 1 + x/m za x > 0, m ≥ 2.
trditev: MAT-SS-4/obrestni-racun#konformna-manjsa
besedilo: »Korenimo: $\sqrt[m]{1 + x} < 1 + \frac{x}{m}$, zato je konformna mera manjša od relativne.« -/
theorem konformna_manjsa (x : ℝ) (hx : 0 < x) (m : ℕ) (hm : 2 ≤ m) :
    (1 + x) ^ ((1 : ℝ) / m) < 1 + x / m := by
  have hm0 : m ≠ 0 := by omega
  have hb : 0 ≤ 1 + x / m := by positivity
  have h := relativna_vec x hx m hm
  by_contra hc
  have := pow_le_pow_left₀ hb (not_lt.mp hc) m
  rw [koren_pot hm0 (by linarith)] at this
  linarith

/-- Predpostavke trditve `konformna_manjsa` se dajo izpolniti (x = 0,06, m = 12). -/
example : (0 : ℝ) < 0.06 ∧ 2 ≤ 12 := by norm_num

/-- Predpostavke trditve `konformna_manjsa` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) < 0.06 ∧ 2 ≤ 12 := by norm_num
  konformna_manjsa (hx := w.1) (hm := w.2)

/-- Bolj natančno: efektivna obrestna mera pri 6 % in mesečnem pripisu: 100(1,005¹² − 1) ≈ 6,17 %.
trditev: MAT-SS-4/obrestni-racun#efektivna-6
besedilo: »Letni meri, ki jo pri relativni meri dejansko dobimo, rečemo **efektivna obrestna mera**; pri $6\,\%$ in mesečnem pripisu je $100\,(1{,}005^{12} - 1) \approx 6{,}17\,\%$.« -/
theorem efektivna_6 : |100 * ((1.005 : ℝ) ^ 12 - 1) - 6.17| < 0.005 := by norm_num [abs_lt]

/-! ## Primer 1: podražitev in popust -/

/-- Primer 1: 240·1,15 = 276; 276·0,85 = 234,6; razlika 240 − 234,6 = 5,4; p = 100·5,4/240 = 2,25.
trditev: MAT-SS-4/obrestni-racun#primer1
besedilo: »Cena je nižja za $d = 240 - 234{,}6 = 5{,}4$, torej $5{,}40\,\text{€}$. Glede na prvotno ceno: $p = \dfrac{100 \cdot 5{,}4}{240} = 2{,}25$.« -/
theorem primer1 : (240 : ℝ) * 1.15 = 276 ∧ (276 : ℝ) * 0.85 = 234.6 ∧ (240 : ℝ) - 234.6 = 5.4 ∧
    100 * (5.4 : ℝ) / 240 = 2.25 := by norm_num

/-- Primer 1, korak 4: 1,15·0,85 = 0,9775 = 1 − 0,0225 in 240·1,15·0,85 = 234,6 v enem koraku.
trditev: MAT-SS-4/obrestni-racun#primer1-faktor
besedilo: »Hitreje s faktorji: $1{,}15 \cdot 0{,}85 = 0{,}9775 = 1 - 0{,}0225$. Na računalu v enem koraku: $240 \cdot 1{,}15 \cdot 0{,}85$.« -/
theorem primer1_faktor : (1.15 : ℝ) * 0.85 = 0.9775 ∧ (0.9775 : ℝ) = 1 - 0.0225 ∧
    (240 : ℝ) * 1.15 * 0.85 = 234.6 := by norm_num

/-- Primer 1 kot veriga: 240·1,15·0,85 = 276·0,85 = 234,6.
trditev: MAT-SS-4/obrestni-racun#primer1-calc
besedilo: »$240 \cdot 1{,}15 = 276$, torej $276\,\text{€}$. 2. Po razprodaji je osnova $276\,\text{€}$: $276 \cdot 0{,}85 = 234{,}6$« -/
theorem primer1_calc : (240 : ℝ) * 1.15 * 0.85 = 234.6 := by
  calc (240 : ℝ) * 1.15 * 0.85 = 276 * 0.85 := by norm_num
    _ = 234.6 := by norm_num

/-! ## Primer 2: navadno obrestovanje -/

/-- Primer 2: o = 1500·4/100 = 60; 3·60 = 180; 3·4/100 = 0,12; G₃ = 1500(1 + 0,12) = 1680.
trditev: MAT-SS-4/obrestni-racun#primer2
besedilo: »Končno stanje: $\frac{3 \cdot 4}{100} = 0{,}12$, zato $G_3 = 1500 \cdot (1 + 0{,}12) = 1680$, torej $1680\,\text{€}$.« -/
theorem primer2 : (1500 : ℝ) * 4 / 100 = 60 ∧ 3 * (60 : ℝ) = 180 ∧ 3 * (4 : ℝ) / 100 = 0.12 ∧
    (1500 : ℝ) * (1 + 0.12) = 1680 := by norm_num

/-- Primer 2 kot veriga: G₃ = 1500(1 + 3·4/100) = 1500(1 + 0,12) = 1680.
trditev: MAT-SS-4/obrestni-racun#primer2-calc
besedilo: »Končno stanje: $\frac{3 \cdot 4}{100} = 0{,}12$, zato $G_3 = 1500 \cdot (1 + 0{,}12) = 1680$, torej $1680\,\text{€}$.« -/
theorem primer2_calc : (1500 : ℝ) * (1 + 3 * 4 / 100) = 1680 := by
  calc (1500 : ℝ) * (1 + 3 * 4 / 100) = 1500 * (1 + 0.12) := by norm_num
    _ = 1680 := by norm_num

/-! ## Primer 3: obrestno obrestovanje -/

/-- Primer 3: r = 1 + 4/100 = 1,04; G₁ = 1560, G₂ = 1622,4, G₃ = 1687,296.
trditev: MAT-SS-4/obrestni-racun#primer3-leta
besedilo: »Po letih: $G_1 = 1500 \cdot 1{,}04 = 1560$, $G_2 = 1560 \cdot 1{,}04 = 1622{,}4$, $G_3 = 1622{,}4 \cdot 1{,}04 = 1687{,}296$.« -/
theorem primer3_leta : 1 + (4 : ℝ) / 100 = 1.04 ∧ (1500 : ℝ) * 1.04 = 1560 ∧ (1560 : ℝ) * 1.04 = 1622.4 ∧
    (1622.4 : ℝ) * 1.04 = 1687.296 := by norm_num

/-- Primer 3, korak 3: naenkrat G₃ = 1500·1,04³ = 1687,296, zaokroženo 1687,30 €.
trditev: MAT-SS-4/obrestni-racun#primer3-naenkrat
besedilo: »Isto naenkrat: $G_3 = 1500 \cdot 1{,}04^3 = 1687{,}296$, zaokroženo $1687{,}30\,\text{€}$.« -/
theorem primer3_naenkrat : (1500 : ℝ) * 1.04 ^ 3 = 1687.296 ∧ |(1687.296 : ℝ) - 1687.30| ≤ 0.005 := by
  norm_num [abs_le]

/-- Primer 3, korak 4: razlika 1687,30 − 1680 = 7,30 €.
trditev: MAT-SS-4/obrestni-racun#primer3-razlika
besedilo: »Razlika: $1687{,}30 - 1680 = 7{,}30$, torej $7{,}30\,\text{€}$.« -/
theorem primer3_razlika : (1687.30 : ℝ) - 1680 = 7.30 := by norm_num

/-! ## Primer 4: koliko vložiti danes -/

/-- Primer 4, korak 1: 1,03⁵ ≈ 1,159274.
trditev: MAT-SS-4/obrestni-racun#primer4-potenca
besedilo: »$r^5 = 1{,}03^5 \approx 1{,}159274$« -/
theorem primer4_potenca : |(1.03 : ℝ) ^ 5 - 1.159274| < 0.0000005 := by norm_num [abs_lt]

/-- Primer 4, korak 2: 6000/1,159274 ≈ 5175,65 (in tudi točno 6000/1,03⁵ ≈ 5175,65).
trditev: MAT-SS-4/obrestni-racun#primer4-obrestno
besedilo: »Obrestno: $G_0 = \dfrac{6000}{1{,}159274} \approx 5175{,}65$, torej približno $5175{,}65\,\text{€}$.« -/
theorem primer4_obrestno : |(6000 : ℝ) / 1.159274 - 5175.65| < 0.005 ∧
    |(6000 : ℝ) / 1.03 ^ 5 - 5175.65| < 0.005 := by
  constructor <;> rw [abs_lt] <;> constructor <;> norm_num

/-- Primer 4, korak 3: faktor 1 + 5·3/100 = 1,15 in 6000/1,15 ≈ 5217,39.
trditev: MAT-SS-4/obrestni-racun#primer4-navadno
besedilo: »Navadno: faktor je $1 + \frac{5 \cdot 3}{100} = 1{,}15$, zato $G_0 = \dfrac{6000}{1{,}15} \approx 5217{,}39$, torej približno $5217{,}39\,\text{€}$.« -/
theorem primer4_navadno : 1 + 5 * (3 : ℝ) / 100 = 1.15 ∧ |(6000 : ℝ) / 1.15 - 5217.39| < 0.005 := by
  refine ⟨by norm_num, ?_⟩
  rw [abs_lt]; constructor <;> norm_num

/-- Primer 4, korak 4: preizkus 5175,65·1,03⁵ ≈ 6000; navadno zahteva 5217,39 − 5175,65 = 41,74 € več.
trditev: MAT-SS-4/obrestni-racun#primer4-preizkus
besedilo: »Preizkus za obrestno: $5175{,}65 \cdot 1{,}03^5 \approx 6000$. Navadno zahteva približno $41{,}74\,\text{€}$ večjo vlogo, ker ne prinaša obresti od obresti.« -/
theorem primer4_preizkus : |(5175.65 : ℝ) * 1.03 ^ 5 - 6000| < 0.005 ∧ (5217.39 : ℝ) - 5175.65 = 41.74 := by
  norm_num [abs_lt]

/-- Pogoste napake in Preveri se 3: »6000 − 900 = 5100« je napačno, preizkus 5100·1,03⁵ ≈ 5912 € < 6000 €;
5·3 = 15 in 15 % od 6000 je 900.
trditev: MAT-SS-4/obrestni-racun#napaka-odstevanje
besedilo: »Računanje nazaj z odštevanjem.** »Čez $5$ let pri $3\,\%$ je $15\,\%$, $6000 - 900 = 5100\,\text{€}$.« Obresti se računajo od vloge, ne od končnega zneska. Preizkus pokaže napako: $5100 \cdot 1{,}03^5 \approx 5912\,\text{€}$. Končni znesek deli z $r^n$.« -/
theorem napaka_odstevanje : 5 * (3 : ℝ) = 15 ∧ (6000 : ℝ) * 15 / 100 = 900 ∧ (6000 : ℝ) - 900 = 5100 ∧
    |(5100 : ℝ) * 1.03 ^ 5 - 5912| < 0.5 ∧ (5100 : ℝ) * 1.03 ^ 5 < 6000 := by norm_num [abs_lt]

/-! ## Primer 5: relativna in konformna obrestna mera -/

/-- Primer 5, koraka 1–2: p_r = 4,8/12 = 0,4 (faktor 1,004); 12·3 = 36 pripisov; 5000·1,004³⁶ ≈ 5772,76.
trditev: MAT-SS-4/obrestni-racun#primer5-relativna
besedilo: »Relativna mera: $p_r = \dfrac{4{,}8}{12} = 0{,}4$, torej $0{,}4\,\%$ na mesec; faktor $1{,}004$. 2. Pripisov je $12 \cdot 3 = 36$, zato $5000 \cdot 1{,}004^{36} \approx 5772{,}76$, torej $5772{,}76\,\text{€}$.« -/
theorem primer5_relativna : (4.8 : ℝ) / 12 = 0.4 ∧ 1 + (0.4 : ℝ) / 100 = 1.004 ∧ 12 * 3 = 36 ∧
    |(5000 : ℝ) * 1.004 ^ 36 - 5772.76| < 0.005 := by norm_num [abs_lt]

/-- Primer 5, korak 3: r₁₂ = ¹²√1,048 ≈ 1,003915, p_k ≈ 0,391 %.
trditev: MAT-SS-4/obrestni-racun#primer5-konformna
besedilo: »Konformna mera: $r_{12} = \sqrt[12]{1{,}048} \approx 1{,}003915$, torej $p_k \approx 0{,}391\,\%$ na mesec.« -/
theorem primer5_konformna : |(1.048 : ℝ) ^ ((1 : ℝ) / 12) - 1.003915| < 0.0000005 ∧
    |100 * ((1.048 : ℝ) ^ ((1 : ℝ) / 12) - 1) - 0.391| < 0.0005 := by
  have h := koren_med (m := 12) (y := 1.048) (a := 1.0039145) (b := 1.0039150) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  push_cast at h
  obtain ⟨h1, h2⟩ := h
  constructor <;> rw [abs_lt] <;> constructor <;> linarith

/-- Primer 5, korak 4: ker je r₁₂¹² = 1,048, je po 36 pripisih 5000·r₁₂³⁶ = 5000·1,048³ ≈ 5755,11.
trditev: MAT-SS-4/obrestni-racun#primer5-36
besedilo: »Ker je $r_{12}^{\,12} = 1{,}048$, je po $36$ pripisih $5000 \cdot 1{,}048^3 \approx 5755{,}11$, torej $5755{,}11\,\text{€}$.« -/
theorem primer5_36 : (5000 : ℝ) * ((1.048 : ℝ) ^ ((1 : ℝ) / 12)) ^ 36 = 5000 * 1.048 ^ 3 ∧
    |(5000 : ℝ) * 1.048 ^ 3 - 5755.11| < 0.005 := by
  constructor
  · have := konformna_n_let 5000 1.048 12 3 (by norm_num) (by norm_num)
    push_cast at this
    rw [show (36 : ℕ) = 12 * 3 by norm_num, this]
  · norm_num [abs_lt]

/-- Primer 5, korak 5: razlika 5772,76 − 5755,11 = 17,65 €.
trditev: MAT-SS-4/obrestni-racun#primer5-razlika
besedilo: »Razlika: $5772{,}76 - 5755{,}11 = 17{,}65$, torej $17{,}65\,\text{€}$.« -/
theorem primer5_razlika : (5772.76 : ℝ) - 5755.11 = 17.65 := by norm_num

/-! ## Primer 6: obrestna mera -/

/-- Primer 6, korak 1: r² = 2163,2/2000 = 1,0816.
trditev: MAT-SS-4/obrestni-racun#primer6-r2
besedilo: »$r^2 = \dfrac{G_2}{G_0} = \dfrac{2163{,}2}{2000} = 1{,}0816$« -/
theorem primer6_r2 : (2163.2 : ℝ) / 2000 = 1.0816 := by norm_num

/-- Primer 6, premisli: r² = 1,0816 in r > 0 natanko tedaj, ko r = 1,04.
trditev: MAT-SS-4/obrestni-racun#primer6-r
besedilo: »$r = \sqrt{1{,}0816} = 1{,}04$« -/
theorem primer6_r (r : ℝ) : (r ^ 2 = 1.0816 ∧ 0 < r) ↔ r = 1.04 := by
  constructor
  · rintro ⟨h, hr⟩
    nlinarith [sq_nonneg (r - 1.04), sq_nonneg (r + 1.04)]
  · rintro rfl; norm_num

/-- Primer 6: 2000(1 + p/100)² = 2163,20 pri p > −100 natanko tedaj, ko p = 4 (preizkus 2000·1,04² = 2163,20).
trditev: MAT-SS-4/obrestni-racun#primer6
besedilo: »$r = \sqrt{1{,}0816} = 1{,}04$, zato $\frac{p}{100} = 0{,}04$ in $p = 4\,\%$. Preizkus: $2000 \cdot 1{,}04^2 = 2163{,}20\,\text{€}$.« -/
theorem primer6 (p : ℝ) : (2000 * (1 + p / 100) ^ 2 = 2163.20 ∧ -100 < p) ↔ p = 4 := by
  constructor
  · rintro ⟨h, hp⟩
    have hr : 0 < 1 + p / 100 := by linarith
    have := (primer6_r (1 + p / 100)).mp ⟨by linarith, hr⟩
    linarith
  · rintro rfl; norm_num

/-! ## Za maturo, naloga 1 -/

/-- Matura 1: 2616 − 2400 = 216; 216 : 3 = 72; p = 100·72/2400 = 3; preizkus 2400·1,09 = 2616.
trditev: MAT-SS-4/obrestni-racun#matura1
besedilo: »Preizkus: $2400 \cdot \left(1 + \dfrac{3 \cdot 3}{100}\right) = 2400 \cdot 1{,}09 = 2616$.« -/
theorem matura1 : (2616 : ℝ) - 2400 = 216 ∧ (216 : ℝ) / 3 = 72 ∧ 100 * (72 : ℝ) / 2400 = 3 ∧
    (2400 : ℝ) * (1 + 3 * 3 / 100) = 2400 * 1.09 ∧ (2400 : ℝ) * 1.09 = 2616 := by norm_num

/-- Matura 1 (točkovanje): enačba 2400(1 + 3p/100) = 2616 ima natanko rešitev p = 3.
trditev: MAT-SS-4/obrestni-racun#matura1-enacba
besedilo: »Preizkus: $2400 \cdot \left(1 + \dfrac{3 \cdot 3}{100}\right) = 2400 \cdot 1{,}09 = 2616$. 5. Odgovor: letna obrestna mera je $3\,\%$.« -/
theorem matura1_enacba (p : ℝ) : 2400 * (1 + 3 * p / 100) = 2616 ↔ p = 3 := by
  constructor
  · intro h; linarith
  · rintro rfl; norm_num

/-! ## Za maturo, naloga 2 -/

/-- Matura 2 a): 1,036⁵ ≈ 1,1934350, 6000·1,036⁵ ≈ 7160,6101, torej 7160,61 €.
trditev: MAT-SS-4/obrestni-racun#matura2a
besedilo: »a) Obrestovalni faktor je $r = 1{,}036$, zato $G_5 = 6000 \cdot 1{,}036^5 \approx 6000 \cdot 1{,}1934350 \approx 7160{,}6101$, torej $7160{,}61\,\text{€}$.« -/
theorem matura2a : |(1.036 : ℝ) ^ 5 - 1.1934350| < 0.00000005 ∧
    |(6000 : ℝ) * 1.036 ^ 5 - 7160.6101| < 0.00005 ∧ |(6000 : ℝ) * 1.036 ^ 5 - 7160.61| < 0.005 := by
  norm_num [abs_lt]

/-- Matura 2 b): 7160,61 − 6000 = 1160,61; 1160,61/6000·100 ≈ 19,34 ≈ 19,3 %; 5·3,6 = 18; 19,3 − 18 = 1,3.
trditev: MAT-SS-4/obrestni-racun#matura2b
besedilo: »b) Vse obresti: $7160{,}61 - 6000 = 1160{,}61$, torej $1160{,}61\,\text{€}$. Delež vloge: $\dfrac{1160{,}61}{6000} \cdot 100 \approx 19{,}34$, torej približno $19{,}3\,\%$. 3. b) Pri navadnem obrestovanju je vsako leto $3{,}6\,\%$ vloge, v petih letih $5 \cdot 3{,}6 = 18$, torej $18\,\%$. Razlika je $19{,}3 - 18 = 1{,}3$ odstotne točke.« -/
theorem matura2b : (7160.61 : ℝ) - 6000 = 1160.61 ∧ |(1160.61 : ℝ) / 6000 * 100 - 19.34| < 0.005 ∧
    |(1160.61 : ℝ) / 6000 * 100 - 19.3| < 0.05 ∧ 5 * (3.6 : ℝ) = 18 ∧ (19.3 : ℝ) - 18 = 1.3 := by
  norm_num [abs_lt]

/-- Matura 2 c): 3,6/12 = 0,3; faktor 1,003; 12·5 = 60; 6000·1,003⁶⁰ ≈ 7181,3688; 7181,37 − 7160,61 = 20,76.
trditev: MAT-SS-4/obrestni-racun#matura2c
besedilo: »c) Relativna mesečna obrestna mera je $\dfrac{3{,}6}{12} = 0{,}3$, torej $0{,}3\,\%$; mesečni faktor je $1{,}003$, pripisov je $12 \cdot 5 = 60$. 5. c) $G = 6000 \cdot 1{,}003^{60} \approx 7181{,}3688$, torej $7181{,}37\,\text{€}$. Razlika: $7181{,}37 - 7160{,}61 = 20{,}76$, torej $20{,}76\,\text{€}$.« -/
theorem matura2c : (3.6 : ℝ) / 12 = 0.3 ∧ 1 + (0.3 : ℝ) / 100 = 1.003 ∧ 12 * 5 = 60 ∧
    |(6000 : ℝ) * 1.003 ^ 60 - 7181.3688| < 0.00005 ∧ (7181.37 : ℝ) - 7160.61 = 20.76 := by
  norm_num [abs_lt]

/-- Matura 2 d): r₁₂⁶⁰ = 1,036⁵ za r₁₂ = ¹²√1,036 ≈ 1,0029516; mesečna mera 100(r₁₂ − 1) ≈ 0,29516 ≈ 0,295 %.
trditev: MAT-SS-4/obrestni-racun#matura2d
besedilo: »d) Mesečni faktor $r_{12}$ mora izpolniti $r_{12}^{\,12} = 1{,}036$: takrat $60$ mesečnih pripisov da $r_{12}^{\,60} = 1{,}036^5$, enako kot v a). Torej $r_{12} = \sqrt[12]{1{,}036} \approx 1{,}0029516$ in mesečna mera je $100 \cdot (r_{12} - 1) \approx 0{,}29516$, torej približno $0{,}295\,\%$.« -/
theorem matura2d : ((1.036 : ℝ) ^ ((1 : ℝ) / 12)) ^ 60 = 1.036 ^ 5 ∧
    |(1.036 : ℝ) ^ ((1 : ℝ) / 12) - 1.0029516| < 0.00000005 ∧
    |100 * ((1.036 : ℝ) ^ ((1 : ℝ) / 12) - 1) - 0.29516| < 0.000005 ∧
    |100 * ((1.036 : ℝ) ^ ((1 : ℝ) / 12) - 1) - 0.295| < 0.0005 := by
  have h := koren_med (m := 12) (y := 1.036) (a := 1.00295160) (b := 1.00295162) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  push_cast at h
  obtain ⟨h1, h2⟩ := h
  refine ⟨?_, ?_, ?_, ?_⟩
  · have := konformna_n_let 1 1.036 12 5 (by norm_num) (by norm_num)
    push_cast at this
    simpa [show (60 : ℕ) = 12 * 5 by norm_num] using this
  all_goals rw [abs_lt]; constructor <;> linarith

/-- Matura 2 d): konformna 0,295 % < relativna 0,3 %, ker 1,003¹² ≈ 1,03660 > 1,036.
trditev: MAT-SS-4/obrestni-racun#matura2d-primerjava
besedilo: »Je manjša od relativne $0{,}3\,\%$: z relativno mero se obresti obrestujejo že med letom, zato v enem letu da faktor $1{,}003^{12} \approx 1{,}03660$, več kot $1{,}036$, kar kaže tudi večje stanje v c).« -/
theorem matura2d_primerjava : |(1.003 : ℝ) ^ 12 - 1.03660| < 0.000005 ∧ (1.036 : ℝ) < 1.003 ^ 12 ∧
    100 * ((1.036 : ℝ) ^ ((1 : ℝ) / 12) - 1) < 0.3 := by
  refine ⟨by norm_num [abs_lt], by norm_num, ?_⟩
  have := (matura2d).2.2.2
  rw [abs_lt] at this; linarith [this.2]

/-! ## Pogoste napake in Preveri se -/

/-- Pogoste napake: pri p = 4 je r = 1 + 4/100 = 1,04, ne 5 ali 1,4.
trditev: MAT-SS-4/obrestni-racun#faktor-4
besedilo: »Odstotek v faktorju kot celo število.** Pri $p = 4$ nekateri zapišejo $r = 1 + 4 = 5$ ali $r = 1{,}4$. Pravilno je $r = 1 + \frac{4}{100} = 1{,}04$. Preveri: faktor pri majhni obrestni meri je le malo večji od $1$.« -/
theorem faktor_4 : 1 + (4 : ℝ) / 100 = 1.04 ∧ 1 + (4 : ℝ) / 100 ≠ 5 ∧ 1 + (4 : ℝ) / 100 ≠ 1.4 := by
  norm_num

/-- Preveri se 1: pri p = 5 je r = 1,05, ne 1,5 (1,5 bi pomenil 50 %).
trditev: MAT-SS-4/obrestni-racun#kviz1-faktor
besedilo: »$5\,\% = 0{,}05$, zato je $r = 1{,}05$. Faktor $1{,}5$ bi pomenil $50\,\%$.« -/
theorem kviz1_faktor : 1 + (5 : ℝ) / 100 = 1.05 ∧ 1 + (50 : ℝ) / 100 = 1.5 := by norm_num

/-- Preveri se 2: 3000·1,02³ = 3183,624 ≈ 3183,62 € (pravilni odgovor); napačni: 3000(1 + 0,06) = 3180,
3000·1,02·3 = 9180 (tudi Pogoste napake), 3000·1,2³ = 5184.
trditev: MAT-SS-4/obrestni-racun#kviz2
besedilo: »$G_3 = 3000 \cdot 1{,}02^3 = 3183{,}624 \approx 3183{,}62\,\text{€}$« -/
theorem kviz2 : (3000 : ℝ) * 1.02 ^ 3 = 3183.624 ∧ |(3183.624 : ℝ) - 3183.62| < 0.005 ∧
    (3000 : ℝ) * (1 + 0.06) = 3180 ∧ (3000 : ℝ) * 1.02 * 3 = 9180 ∧ (3000 : ℝ) * 1.2 ^ 3 = 5184 := by
  norm_num [abs_lt]

/-- Preveri se 3: pravilna vloga je 6000/1,03⁵ ≈ 5175,65 € (ne 5100 €).
trditev: MAT-SS-4/obrestni-racun#kviz3
besedilo: »Obrestno: $G_0 = \dfrac{6000}{1{,}159274} \approx 5175{,}65$, torej približno $5175{,}65\,\text{€}$.« -/
theorem kviz3 : |(6000 : ℝ) / 1.03 ^ 5 - 5175.65| < 0.005 ∧ (6000 : ℝ) / 1.03 ^ 5 ≠ 5100 := by
  refine ⟨primer4_obrestno.2, ?_⟩
  norm_num

/-- Preveri se 4: navadno 1000·1,08 = 1080, obrestno 1000·1,04² = 1081,60; obresti 80 in 81,60;
razlika 1,60 € je 4 % od 40 € (obresti 1. leta).
trditev: MAT-SS-4/obrestni-racun#kviz4
besedilo: »Navadno: $1000 \cdot 1{,}08 = 1080\,\text{€}$. Obrestno: $1000 \cdot 1{,}04^2 = 1081{,}60\,\text{€}$. Razlika $1{,}60\,\text{€}$ je $4\,\%$ od $40\,\text{€}$ obresti prvega leta.« -/
theorem kviz4 : (1000 : ℝ) * (1 + 2 * 4 / 100) = 1000 * 1.08 ∧ (1000 : ℝ) * 1.08 = 1080 ∧
    (1000 : ℝ) * 1.04 ^ 2 = 1081.60 ∧ (1081.60 : ℝ) - 1080 = 1.60 ∧ (1.60 : ℝ) = 40 * 4 / 100 ∧
    (1081.60 : ℝ) - 1000 = 81.60 ∧ (1080 : ℝ) - 1000 = 80 ∧ (81.60 : ℝ) ≠ 2 * 80 := by norm_num

/-- Preveri se 5: 10 000·1,025⁴ ≈ 11 038,13 €; napačni: 10 000·1,025 = 10 250, 4·2,5 = 10 → 11 000.
trditev: MAT-SS-4/obrestni-racun#kviz5
besedilo: »$10\,000 \cdot 1{,}025^4 \approx 11\,038{,}13\,\text{€}$.« -/
theorem kviz5 : |(10000 : ℝ) * 1.025 ^ 4 - 11038.13| < 0.005 ∧ (10000 : ℝ) * 1.025 = 10250 ∧
    4 * (2.5 : ℝ) = 10 ∧ (10000 : ℝ) * (1 + 10 / 100) = 11000 := by norm_num [abs_lt]

/-- Preveri se 6: 80·0,75 = 60, 60·1,25 = 75; skupni faktor 0,75·1,25 = 0,9375, cena 6,25 % nižja.
trditev: MAT-SS-4/obrestni-racun#kviz6
besedilo: »$80 \cdot 0{,}75 = 60$, nato $60 \cdot 1{,}25 = 75$. Skupni faktor $0{,}75 \cdot 1{,}25 = 0{,}9375$: cena je za $6{,}25\,\%$ nižja.« -/
theorem kviz6 : (80 : ℝ) * 0.75 = 60 ∧ (60 : ℝ) * 1.25 = 75 ∧ (80 : ℝ) * 0.75 * 1.25 = 75 ∧
    (0.75 : ℝ) * 1.25 = 0.9375 ∧ (0.9375 : ℝ) = 1 - 6.25 / 100 := by norm_num

/-- Preveri se 7: r₄ = ⁴√1,08 ≈ 1,019427, p_k ≈ 1,94 %; relativna bi bila 8/4 = 2.
trditev: MAT-SS-4/obrestni-racun#kviz7
besedilo: »$r_4 = \sqrt[4]{1{,}08} \approx 1{,}019427$, zato $p_k \approx 1{,}94\,\%$.« -/
theorem kviz7 : |(1.08 : ℝ) ^ ((1 : ℝ) / 4) - 1.019427| < 0.0000005 ∧
    |100 * ((1.08 : ℝ) ^ ((1 : ℝ) / 4) - 1) - 1.94| < 0.005 ∧ (8 : ℝ) / 4 = 2 := by
  have h := koren_med (m := 4) (y := 1.08) (a := 1.0194265) (b := 1.0194270) (by norm_num)
    (by norm_num) (by norm_num) (by norm_num) (by norm_num)
  push_cast at h
  obtain ⟨h1, h2⟩ := h
  refine ⟨?_, ?_, by norm_num⟩ <;> rw [abs_lt] <;> constructor <;> linarith

/-- Preveri se 7, preizkus: (⁴√1,08)⁴ = 1,08.
trditev: MAT-SS-4/obrestni-racun#kviz7-preizkus
besedilo: »$r_4 = \sqrt[4]{1{,}08} \approx 1{,}019427$, zato $p_k \approx 1{,}94\,\%$. Preizkus: $1{,}019427^4 \approx 1{,}08$.« -/
theorem kviz7_preizkus : ((1.08 : ℝ) ^ ((1 : ℝ) / 4)) ^ 4 = 1.08 := by
  have := koren_pot (y := (1.08 : ℝ)) (m := 4) (by norm_num) (by norm_num)
  push_cast at this
  exact this

end Evklid.Lekcije.MAT_SS_4.ObrestniRacun
