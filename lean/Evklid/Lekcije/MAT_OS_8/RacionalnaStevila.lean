/-
vir: content/lessons/MAT-OS-8/racionalna-stevila.md
sha256: ceb6e93346c25852f4843c87e2ac5de20dffd10d0e98e80f75c01e321ddcd3c1
Model: računi so v ℚ (decimalna števila so točni ulomki, npr. (2.8 : ℚ) = 28/10); »x je racionalno« za realno
število x pomeni x ∈ Set.range (Rat.cast : ℚ → ℝ). Periodično število 0,333… je vrsta ∑ 3/10ⁿ⁺¹ v ℝ (in
0,666… vrsta ∑ 6/10ⁿ⁺¹). Pravilo a/c + b/c = (a + b)/c velja v Leanu brez pogoja (tudi pri c = 0, ker je
x/0 = 0); lekcija tu pogoja ne navaja. Pravila z deljenjem imajo pogoje lekcije (b, c, d ≠ 0).
Ni v Leanu: zgodba o vremenski postaji in pomen temperatur/gladin kot podatki (dokazani so računi in
primerjave); risbe številskih premic in simulacija (dokazane so lege kot neenakosti, razdalje in razpolovišča);
»premik po premici« in »zrcaljenje čez 0« kot geometrijska slika (dokazani so računi −1,5 + 2 = 0,5 in
(−2)·0,5 = −1 ter |−1| = 2·|0,5|); vrstni red računskih operacij kot pravilo zapisa (Lean ga ima vgrajenega;
dokazani sta obe branji 2 − 3·(−4) = 14 in (2 − 3)·(−4) = 4); »pravila za predznake pri seštevanju« v besedah
(dokazani so primeri); »seštevamo le enako velike dele« (razlaga); Primer 3, korak 4 (dokazano je
−3,5 < −1,7 < 1,2); »najnižja je bila gladina ...« kot besedilo (dokazan je vrstni red).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.RacionalnaStevila

/-! ## 1. Nova množica -/

/-- Razlaga 1 in Povzetek 1: realno število je racionalno natanko tedaj, ko ga lahko zapišemo kot a/b s celima
a, b in b ≠ 0. -/
theorem racionalno_iff (x : ℝ) : x ∈ Set.range ((↑) : ℚ → ℝ) ↔ ∃ a b : ℤ, b ≠ 0 ∧ x = a / b := by
  constructor
  · rintro ⟨q, rfl⟩
    refine ⟨q.num, q.den, by exact_mod_cast q.den_nz, ?_⟩
    push_cast
    exact Rat.cast_def q
  · rintro ⟨a, b, -, rfl⟩
    exact ⟨a / b, by push_cast; rfl⟩

/-- Razlaga 1 in Preveri se 1: vsako celo število n je racionalno, n = n/1 (npr. 5 = 5/1, −3 = −3/1, −7 = −7/1). -/
theorem celo_je_racionalno (n : ℤ) : ∃ a b : ℤ, b ≠ 0 ∧ (n : ℚ) = a / b :=
  ⟨n, 1, one_ne_zero, by simp⟩

/-- Razlaga 1: 5 = 5/1, −3 = −3/1, −7 = −7/1, −0,4 = −2/5, −3/4 = (−3)/4. -/
theorem zapisi : (5 : ℚ) = 5 / 1 ∧ (-3 : ℚ) = -3 / 1 ∧ (-7 : ℚ) = -7 / 1 ∧ (-0.4 : ℚ) = -(2 / 5) ∧
    -((3 : ℚ) / 4) = (-3) / 4 := by
  norm_num

/-- Pomožno: 0,ccc… = ∑ c/10ⁿ⁺¹ = c/9. -/
theorem periodicno (c : ℝ) : ∑' n : ℕ, c / 10 ^ (n + 1) = c / 9 := by
  have h : ∀ n : ℕ, c / 10 ^ (n + 1) = c / 10 * (1 / 10) ^ n := by
    intro n; rw [pow_succ, one_div_pow]; field_simp
  simp_rw [h]
  rw [tsum_mul_left, tsum_geometric_of_lt_one (by norm_num) (by norm_num)]
  norm_num
  ring

/-- Razlaga 1 in Preveri se 1: periodično število 0,333… = 1/3 je racionalno. -/
theorem tretjina : ∑' n : ℕ, (3 : ℝ) / 10 ^ (n + 1) = 1 / 3 := by
  rw [periodicno]; norm_num

/-- Bolj natančno, »Periodično število kot ulomek«: za x = 0,333… je 10x = 3 + x (to je 3,333…), zato 9x = 3 in
x = 1/3. -/
theorem tretjina_korak (x : ℝ) (hx : x = ∑' n : ℕ, (3 : ℝ) / 10 ^ (n + 1)) :
    10 * x = 3 + x ∧ 9 * x = 3 ∧ x = 1 / 3 := by
  rw [tretjina] at hx
  subst hx
  norm_num

/-- Predpostavka `tretjina_korak` se da izpolniti (x = 0,333…). -/
example : ∃ x : ℝ, x = ∑' n : ℕ, (3 : ℝ) / 10 ^ (n + 1) := ⟨_, rfl⟩

/-! ## 2. Na premici -/

/-- Razlaga 2: −2,5 je na sredini med −3 in −2; −2,8 je bližje −3 kot −2. -/
theorem na_premici : ((-3 : ℚ) + (-2)) / 2 = -2.5 ∧ |(-2.8 : ℚ) - (-3)| < |(-2.8 : ℚ) - (-2)| := by
  norm_num [abs_of_pos, abs_of_neg]

/-- Razlaga 2 in Povzetek 2: od dveh negativnih števil je manjše tisto z večjo absolutno vrednostjo. -/
theorem negativni (a b : ℚ) (ha : a < 0) (hb : b < 0) : a < b ↔ |b| < |a| := by
  rw [abs_of_neg ha, abs_of_neg hb]
  constructor <;> intro h <;> linarith

/-- Predpostavke `negativni` se dajo izpolniti (a = −2,8, b = −2,5). -/
example : (-2.8 : ℚ) < 0 ∧ (-2.5 : ℚ) < 0 := by norm_num

/-- Zakaj se tega učimo, Razlaga 2, Pogoste napake 1: |−2,8| = 2,8 > 2,5 = |−2,5|, zato −2,8 < −2,5
(Luka nima prav, zjutraj je bilo hladneje); sprememba −2,8 − (−2,5) = −0,3. -/
theorem luka : |(-2.8 : ℚ)| = 2.8 ∧ |(-2.5 : ℚ)| = 2.5 ∧ (-2.8 : ℚ) < -2.5 ∧ ¬ ((-2.8 : ℚ) > -2.5) ∧
    (-2.8 : ℚ) - (-2.5) = -0.3 := by
  norm_num [abs_of_neg]

/-- Razlaga 2 (simulacija): −3/4 = −0,75 leži bolj levo kot −0,5. -/
theorem sim : -((3 : ℚ) / 4) < -0.5 := by norm_num

/-- Razlaga 2, »Hiter preizkus«: −1,2 > −1,25, ker |−1,2| < |−1,25|. -/
theorem preizkus_12 : (-1.25 : ℚ) < -1.2 ∧ |(-1.2 : ℚ)| < |(-1.25 : ℚ)| := by
  norm_num [abs_of_neg]

/-! ## 3. Seštevanje in odštevanje -/

/-- Razlaga 3: −2,4 + 5,1 = 2,7. -/
theorem segreje : (-2.4 : ℚ) + 5.1 = 2.7 := by norm_num

/-- Razlaga 3 (formula): a/c + b/c = (a + b)/c. -/
theorem skupni_imenovalec (a b c : ℚ) : a / c + b / c = (a + b) / c := (add_div a b c).symm

/-- Razlaga 3: −1/2 − 1/3 = −3/6 − 2/6 = −5/6. -/
theorem polovica_tretjina : -(1 : ℚ) / 2 - 1 / 3 = -5 / 6 := by
  calc -(1 : ℚ) / 2 - 1 / 3 = -3 / 6 - 2 / 6 := by norm_num
    _ = -5 / 6 := by norm_num

/-- Razlaga 3, »Premisli« in Pogoste napake 2: 1/2 + 1/3 ≠ 2/5; 2/5 = 0,4 < 0,5 = 1/2; pravilno
3/6 + 2/6 = 5/6. -/
theorem napaka_stevci : (1 : ℚ) / 2 + 1 / 3 ≠ 2 / 5 ∧ (2 : ℚ) / 5 = 0.4 ∧ (0.4 : ℚ) < 0.5 ∧ (1 : ℚ) / 2 = 0.5 ∧
    (1 : ℚ) / 2 + 1 / 3 = 3 / 6 + 2 / 6 ∧ (3 : ℚ) / 6 + 2 / 6 = 5 / 6 := by
  norm_num

/-! ## 4. Množenje in deljenje -/

/-- Razlaga 4: predznak produkta in količnika: enaka predznaka dasta +, različna −. -/
theorem predznaki (a b : ℚ) :
    (a < 0 → b < 0 → 0 < a * b ∧ 0 < a / b) ∧ (0 < a → 0 < b → 0 < a * b ∧ 0 < a / b) ∧
      (a < 0 → 0 < b → a * b < 0 ∧ a / b < 0) ∧ (0 < a → b < 0 → a * b < 0 ∧ a / b < 0) := by
  refine ⟨fun ha hb => ⟨mul_pos_of_neg_of_neg ha hb, div_pos_of_neg_of_neg ha hb⟩,
    fun ha hb => ⟨mul_pos ha hb, div_pos ha hb⟩,
    fun ha hb => ⟨mul_neg_of_neg_of_pos ha hb, div_neg_of_neg_of_pos ha hb⟩,
    fun ha hb => ⟨mul_neg_of_pos_of_neg ha hb, div_neg_of_pos_of_neg ha hb⟩⟩

/-- Razlaga 4: ulomke množimo števec s števcem, imenovalec z imenovalcem. -/
theorem mnozenje (a b c d : ℚ) : a / b * (c / d) = (a * c) / (b * d) := div_mul_div_comm a b c d

/-- Razlaga 4 (formula): a/b : c/d = a/b · d/c, pri čemer so b, c, d ≠ 0. -/
theorem deljenje (a b c d : ℚ) (_hb : b ≠ 0) (_hc : c ≠ 0) (_hd : d ≠ 0) : a / b / (c / d) = a / b * (d / c) := by
  rw [div_div_eq_mul_div, mul_div_assoc]

/-- Predpostavke `deljenje` se dajo izpolniti (b = 4, c = 1, d = 4). -/
example : (4 : ℚ) ≠ 0 ∧ (1 : ℚ) ≠ 0 := by norm_num

/-- Razlaga 4, Pogoste napake 4, Preveri se 2: (−1/2)·(−4/3) = 4/6 = 2/3 (ne −2/3); napačna odgovora: vsota
−1/2 + (−4/3) = −11/6 in količnik 1/2 : 4/3 = 3/8. -/
theorem produkt : (-(1 : ℚ) / 2) * (-(4 : ℚ) / 3) = 4 / 6 ∧ (4 : ℚ) / 6 = 2 / 3 ∧
    (-(1 : ℚ) / 2) * (-(4 : ℚ) / 3) ≠ -2 / 3 ∧ (1 * 4 : ℚ) / (2 * 3) = 4 / 6 ∧
    -(1 : ℚ) / 2 + (-(4 : ℚ) / 3) = -11 / 6 ∧ (1 : ℚ) / 2 / (4 / 3) = 3 / 8 := by
  norm_num

/-- Razlaga 4: (−3/4) : (1/4) = −3/4 · 4 = −3; »Hiter preizkus«: (−0,5)·4 = −2. -/
theorem kolicnik : (-(3 : ℚ) / 4) / (1 / 4) = -(3 : ℚ) / 4 * 4 ∧ -(3 : ℚ) / 4 * 4 = -3 ∧ (-0.5 : ℚ) * 4 = -2 := by
  norm_num

/-- Pogoste napake 3: 1/2 : 1/4 = 1/2 · 4 = 2, ne 1/8. -/
theorem napaka_obrat : (1 : ℚ) / 2 / (1 / 4) = 1 / 2 * 4 ∧ (1 : ℚ) / 2 * 4 = 2 ∧ (1 : ℚ) / 2 / (1 / 4) ≠ 1 / 8 := by
  norm_num

/-! ## 5. Številski izrazi -/

/-- Razlaga 5 »Premisli«, Pogoste napake 5, Preveri se 3: 2 − 3·(−4) = 2 − (−12) = 14; Rokov (2 − 3)·(−4) =
(−1)·(−4) = 4 je drug izraz. -/
theorem vrstni_red : (3 : ℚ) * (-4) = -12 ∧ (2 : ℚ) - 3 * (-4) = 2 - (-12) ∧ (2 : ℚ) - (-12) = 14 ∧
    ((2 : ℚ) - 3) * (-4) = (-1) * (-4) ∧ (-1 : ℚ) * (-4) = 4 ∧ (2 : ℚ) - 3 * (-4) ≠ 4 := by
  norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: −3/4 = −0,75; 0,8 > 0,75 ⇒ −0,8 < −0,75; 0,5 < 2/3; vrstni red −0,8 < −3/4 < 0,5 < 2/3. -/
theorem primer1 : -((3 : ℚ) / 4) = -0.75 ∧ (-0.75 : ℚ) < 0 ∧ (-0.8 : ℚ) < 0 ∧ (0.8 : ℚ) > 0.75 ∧
    (-0.8 : ℚ) < -0.75 ∧ (0.5 : ℚ) < 2 / 3 ∧ ((-0.8 : ℚ) < -(3 / 4) ∧ -((3 : ℚ) / 4) < 0.5 ∧ (0.5 : ℚ) < 2 / 3) := by
  norm_num

/-- Primer 1, korak 1: 2/3 = 0,666… (vrsta ∑ 6/10ⁿ⁺¹). -/
theorem dve_tretjini : ∑' n : ℕ, (6 : ℝ) / 10 ^ (n + 1) = 2 / 3 := by
  rw [periodicno]; norm_num

/-- Primer 2: skupni imenovalec 12 (najmanjši skupni večkratnik 3, 6, 4); 2/3 = 8/12, 5/6 = 10/12, 1/4 = 3/12;
2/3 − 5/6 + 1/4 = (8 − 10 + 3)/12 = 1/12, ki se ne da krajšati. -/
theorem primer2 : Nat.lcm (Nat.lcm 3 6) 4 = 12 ∧ (2 : ℚ) / 3 = 8 / 12 ∧ (5 : ℚ) / 6 = 10 / 12 ∧
    (1 : ℚ) / 4 = 3 / 12 ∧ Nat.gcd 1 12 = 1 ∧ (2 : ℚ) / 3 - 5 / 6 + 1 / 4 = 1 / 12 := by
  refine ⟨by decide, by norm_num, by norm_num, by norm_num, by decide, ?_⟩
  calc (2 : ℚ) / 3 - 5 / 6 + 1 / 4 = 8 / 12 - 10 / 12 + 3 / 12 := by norm_num
    _ = (8 - 10 + 3) / 12 := by ring
    _ = 1 / 12 := by norm_num

/-- Primer 3: povprečje (−3,5 + 1,2 + (−2,8)) : 3 = (−2,3 + (−2,8)) : 3 = −5,1 : 3 = −1,7; leži med −3,5 in 1,2. -/
theorem primer3 : ((-3.5 : ℚ) + 1.2 + (-2.8)) / 3 = -1.7 ∧ (-3.5 : ℚ) < -1.7 ∧ (-1.7 : ℚ) < 1.2 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  calc ((-3.5 : ℚ) + 1.2 + (-2.8)) / 3 = (-2.3 + (-2.8)) / 3 := by norm_num
    _ = -5.1 / 3 := by norm_num
    _ = -1.7 := by norm_num

/-- Primer 4: (−3/4 + 1/2) : (−1/8) − 3·5/6 = (−3/4 + 2/4) : (−1/8) − 3·5/6 = (−1/4)·(−8) − 3·5/6 =
2 − 15/6 = 2 − 5/2 = 4/2 − 5/2 = −1/2; 3·5/6 > 2, zato je rezultat negativen. -/
theorem primer4 : (-(3 : ℚ) / 4 + 1 / 2) / (-(1 : ℚ) / 8) - 3 * (5 / 6) = -1 / 2 ∧ (3 : ℚ) * (5 / 6) > 2 := by
  refine ⟨?_, by norm_num⟩
  calc (-(3 : ℚ) / 4 + 1 / 2) / (-(1 : ℚ) / 8) - 3 * (5 / 6)
      = (-(3 : ℚ) / 4 + 2 / 4) / (-(1 : ℚ) / 8) - 3 * (5 / 6) := by norm_num
    _ = (-(1 : ℚ) / 4) / (-(1 : ℚ) / 8) - 3 * (5 / 6) := by norm_num
    _ = (-(1 : ℚ) / 4) * (-8) - 3 * (5 / 6) := by norm_num
    _ = 2 - 15 / 6 := by norm_num
    _ = 2 - 5 / 2 := by norm_num
    _ = 4 / 2 - 5 / 2 := by norm_num
    _ = -1 / 2 := by norm_num

/-! ## Drugače: Na sliki -/

/-- Na sliki: kvadratek je 1/4 = 0,25; −3/4 je tri kvadratke levo od 0, 0,5 dva desno; −1,5 je na sredini med
−2 in −1; −1,5 < −0,75 < 0,5; −1,5 + 2 = 0,5, 2 = 8 kvadratkov; (−2)·0,5 = −1, |−1| = 2·|0,5|. -/
theorem na_sliki : (1 : ℚ) / 4 = 0.25 ∧ -((3 : ℚ) / 4) = 0 - 3 * (1 / 4) ∧ (0.5 : ℚ) = 0 + 2 * (1 / 4) ∧
    ((-2 : ℚ) + (-1)) / 2 = -1.5 ∧ ((-1.5 : ℚ) < -0.75 ∧ (-0.75 : ℚ) < 0.5) ∧ (-1.5 : ℚ) + 2 = 0.5 ∧
    (2 : ℚ) = 8 * (1 / 4) ∧ (-2 : ℚ) * 0.5 = -1 ∧ |(-1 : ℚ)| = 2 * |(0.5 : ℚ)| := by
  norm_num [abs_of_pos]

/-! ## Drugače: Bolj natančno -/

/-- Bolj natančno, »Enakost ulomkov«: a/b = c/d natanko tedaj, ko a·d = b·c (b, d ≠ 0). -/
theorem enakost_ulomkov (a b c d : ℤ) (hb : b ≠ 0) (hd : d ≠ 0) :
    (a : ℚ) / b = c / d ↔ a * d = b * c := by
  have hb' : (b : ℚ) ≠ 0 := by exact_mod_cast hb
  have hd' : (d : ℚ) ≠ 0 := by exact_mod_cast hd
  rw [div_eq_div_iff hb' hd']
  constructor
  · intro h; have : ((a * d : ℤ) : ℚ) = ((b * c : ℤ) : ℚ) := by push_cast; linarith
    exact_mod_cast this
  · intro h; have : ((a * d : ℤ) : ℚ) = ((b * c : ℤ) : ℚ) := by rw [h]
    push_cast at this; linarith

/-- Predpostavke `enakost_ulomkov` se dajo izpolniti (b = 3, d = 12). -/
example : (3 : ℤ) ≠ 0 ∧ (12 : ℤ) ≠ 0 := by norm_num

/-- Bolj natančno: 2/3 = 8/12, ker 2·12 = 3·8 = 24. -/
theorem dve_tretjini_osem : (2 : ℚ) / 3 = 8 / 12 ∧ (2 : ℤ) * 12 = 24 ∧ (3 : ℤ) * 8 = 24 := by norm_num

/-- Bolj natančno: eno racionalno število ima neskončno zapisov: a/b = (k·a)/(k·b) za vsak k ≠ 0. -/
theorem neskoncno_zapisov (a b k : ℚ) (hk : k ≠ 0) : a / b = (k * a) / (k * b) := by
  rw [mul_div_mul_left a b hk]

/-- Predpostavka `neskoncno_zapisov` se da izpolniti (k = 4). -/
example : (4 : ℚ) ≠ 0 := by norm_num

/-- Bolj natančno, »Gostota«: med dvema različnima racionalnima številoma je njuno povprečje; zato ni
»naslednjega« racionalnega števila. -/
theorem gostota (a b : ℚ) (h : a < b) : a < (a + b) / 2 ∧ (a + b) / 2 < b := by
  constructor <;> linarith

/-- Predpostavka `gostota` se da izpolniti (−2,8 < −2,5). -/
example : (-2.8 : ℚ) < -2.5 := by norm_num

/-- Bolj natančno: noben racionalni a nima naslednika: za vsak b > a obstaja c z a < c < b. -/
theorem ni_naslednika (a : ℚ) : ¬ ∃ b, a < b ∧ ∀ c, a < c → b ≤ c := by
  rintro ⟨b, hab, hb⟩
  have := hb ((a + b) / 2) (by linarith)
  linarith

/-- Bolj natančno: med −2,8 in −2,5 leži (−2,8 + (−2,5)) : 2 = −2,65. -/
theorem med_28_25 : ((-2.8 : ℚ) + (-2.5)) / 2 = -2.65 ∧ (-2.8 : ℚ) < -2.65 ∧ (-2.65 : ℚ) < -2.5 := by norm_num

/-- Preveri se 1: med −1 in 0 ležita npr. −0,5 in −3/4. -/
theorem med_m1_0 : (-1 : ℚ) < -0.5 ∧ (-0.5 : ℚ) < 0 ∧ (-1 : ℚ) < -(3 / 4) ∧ -((3 : ℚ) / 4) < 0 := by norm_num

/-- Bolj natančno, »Zakaj obratna vrednost?«: c/d · d/c = 1 in (a/b · d/c)·(c/d) = a/b (c, d ≠ 0). -/
theorem obratna (a b c d : ℚ) (hc : c ≠ 0) (hd : d ≠ 0) : c / d * (d / c) = 1 ∧ a / b * (d / c) * (c / d) = a / b := by
  constructor
  · field_simp
  · field_simp

/-- Predpostavke `obratna` se dajo izpolniti (c = 1, d = 4). -/
example : (1 : ℚ) ≠ 0 ∧ (4 : ℚ) ≠ 0 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 4: −2/3 = −0,666… je večje od −3/4 = −0,75 (manjša absolutna vrednost), ulomka nista enaka. -/
theorem kviz4 : -((3 : ℚ) / 4) < -(2 / 3) ∧ |(-(2 : ℚ) / 3)| < |(-(3 : ℚ) / 4)| ∧ -((2 : ℚ) / 3) ≠ -(3 / 4) ∧
    -((3 : ℚ) / 4) = -0.75 := by
  norm_num [abs_of_neg]

/-- Preveri se 4: −2/3 = −0,666… (vrsta). -/
theorem kviz4_periodicno : -∑' n : ℕ, (6 : ℝ) / 10 ^ (n + 1) = -(2 / 3) := by rw [dve_tretjini]

/-- Preveri se 5: sprememba 4,2 − (−1,5) = 4,2 + 1,5 = 5,7; napačna: 4,2 − 1,5 = 2,7 in −1,5 − 4,2 = −5,7. -/
theorem kviz5 : (4.2 : ℚ) - (-1.5) = 4.2 + 1.5 ∧ (4.2 : ℚ) + 1.5 = 5.7 ∧ (4.2 : ℚ) - 1.5 = 2.7 ∧
    (-1.5 : ℚ) - 4.2 = -5.7 := by
  norm_num

end Evklid.Lekcije.MAT_OS_8.RacionalnaStevila
