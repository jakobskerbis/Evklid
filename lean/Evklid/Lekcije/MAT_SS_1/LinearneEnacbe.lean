/-
vir: content/lessons/MAT-SS-1/linearne-enacbe.md
sha256: ac4301ce10664ba9d991a28eb8f2f8898950a66585be38094c873643df14c71a
Ni v Leanu: definicije in poimenovanja (izraz, enačba, spremenljivka, neznanka, identiteta, linearna enačba,
parameter, ekvivalentna preoblika) in razlaga »izraz ničesar ne trdi« (dokazano je, da je izraz 4x + 6 različen od
2x + 3, enačbi 4x + 6 = 10 in 2x + 3 = 5 pa imata iste rešitve); trditev, da se vsaka linearna enačba z
ekvivalentnimi preoblikami prevede na ax = b (dokazano za vsako enačbo iz lekcije); postopek reševanja in nasveti
(»najprej odpri oklepaje«, »preveri«, »nikoli ne deli z izrazom, ki bi lahko bil 0«) kot navodila; simulacija in
slika tehtnice ter premic (dokazane so enakovrednosti enačb, presečišče (8, 23), ničla 2 funkcije 2x − 4 in trije
primeri za premici y = a₁x + b₁, y = a₂x + b₂); »parameter pove, kdaj ima naloga smisel« (dokazano: pri p = 800
je x = 0); »približno 200 g« (dokazano: rešitev je 201 in |201 − 200| ≤ 1); točkovanje maturitetnih nalog;
besedila napačnih odgovorov v Preveri se (dokazano je, da napačne vrednosti niso rešitve).
Lean: x/0 = 0, zato vrstici RACUN z ulomkom s parametrom v imenovalcu (vstavitev x = 4/(m + 1) in
(m − 1)/(m² − 1) = 1/(m + 1)) nosita lekcijina pogoja m ≠ −1 oz. m ≠ ±1. Decimalna števila so točna racionalna
števila v ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.LinearneEnacbe

/-! ## Pomožne trditve: ekvivalentne preoblike -/

/-- Razlaga 3 (prištevanje, odštevanje, poenostavljanje): a = b ⇔ c = d, če je c − d = a − b. -/
theorem iff_of_sub {a b c d : ℝ} (h : a - b = c - d) : a = b ↔ c = d := by
  constructor <;> intro h' <;> linarith

/-- Predpostavka `iff_of_sub` se da izpolniti. -/
example : (2 : ℝ) = 2 ↔ (0 : ℝ) = 0 := iff_of_sub (by norm_num)

/-- Razlaga 3 (množenje z istim številom k ≠ 0): a = b ⇔ c = d, če je c − d = k(a − b). -/
theorem iff_of_mul {a b c d k : ℝ} (hk : k ≠ 0) (h : c - d = k * (a - b)) : a = b ↔ c = d := by
  rw [← sub_eq_zero, ← sub_eq_zero (a := c), h, mul_eq_zero, or_iff_right hk]

/-- Predpostavki `iff_of_mul` se dajo izpolniti (k = 2: 2x + 3 = 5 ⇔ 4x + 6 = 10). -/
example (x : ℝ) : 2 * x + 3 = 5 ↔ 4 * x + 6 = 10 := iff_of_mul (k := 2) two_ne_zero (by ring)

/-- Razlaga 3 in Bolj natančno: A = B ⇔ A + c = B + c; za k ≠ 0 je A = B ⇔ kA = kB; pri k = 0 je kA = kB
vedno res. -/
theorem preoblike (A B c k : ℝ) : (A = B ↔ A + c = B + c) ∧ (k ≠ 0 → (A = B ↔ k * A = k * B)) ∧
    0 * A = 0 * B := by
  refine ⟨(add_left_inj c).symm, fun hk => ?_, by ring⟩
  exact ⟨fun h => by rw [h], fun h => mul_left_cancel₀ hk h⟩

/-- Razlaga 5, Povzetek, Ustno vprašanje 2, Bolj natančno: ax = b ima pri a ≠ 0 natanko rešitev x = b/a
(a·(b/a) = b), pri a = 0, b ≠ 0 nobene, pri a = 0, b = 0 pa je rešitev vsak x. -/
theorem ax_b (a b : ℝ) : (a ≠ 0 → ∀ x, (a * x = b ↔ x = b / a)) ∧ (a ≠ 0 → a * (b / a) = b) ∧
    (a = 0 → b ≠ 0 → ∀ x, a * x ≠ b) ∧ (a = 0 → b = 0 → ∀ x, a * x = b) := by
  refine ⟨fun ha x => ?_, fun ha => by field_simp, fun ha hb x => ?_, fun ha hb x => ?_⟩
  · rw [eq_div_iff ha, mul_comm]
  · rw [ha, zero_mul]; exact fun h => hb h.symm
  · rw [ha, hb, zero_mul]

/-- Predpostavke `ax_b` se dajo izpolniti (a = 3, b = 180; a = 0, b = 4; a = b = 0). -/
example : (3 * (60 : ℝ) = 180 ↔ (60 : ℝ) = 180 / 3) ∧ (0 : ℝ) * 1 ≠ 4 ∧ (0 : ℝ) * 1 = 0 :=
  ⟨(ax_b 3 180).1 (by norm_num) 60, (ax_b 0 4).2.2.1 rfl (by norm_num) 1, (ax_b 0 0).2.2.2 rfl rfl 1⟩

/-! ## Zakaj se tega učimo in Najprej opazuj -/

/-- Zakaj se tega učimo, Opazuj: 430 − 250 = 180, 180/3 = 60; x + 250 = 430 ⇔ x = 180; 3x = 180 ⇔ x = 60;
3x + 250 = 430 ⇔ 3x = 180 ⇔ x = 60. -/
theorem jajca (x : ℝ) : (430 - 250 : ℝ) = 180 ∧ (180 / 3 : ℝ) = 60 ∧ (x + 250 = 430 ↔ x = 180) ∧
    (3 * x = 180 ↔ x = 60) ∧ (3 * x + 250 = 430 ↔ x = 60) := by
  have h2 : 3 * x = 180 ↔ x = 60 := by
    calc 3 * x = 180 ↔ x = 180 / 3 := (ax_b 3 180).1 (by norm_num) x
      _ ↔ x = 60 := by norm_num
  refine ⟨by norm_num, by norm_num, iff_of_sub (by ring), h2, ?_⟩
  calc 3 * x + 250 = 430 ↔ 3 * x = 180 := iff_of_sub (by ring)
    _ ↔ x = 60 := h2

/-! ## Razlaga 1: izraz in enačba -/

/-- Razlaga 1, tabela: 3·50 + 250 = 400, 3·60 + 250 = 430, 3·70 + 250 = 460; enačba velja le pri x = 60. -/
theorem tabela : (3 * 50 + 250 : ℝ) = 400 ∧ (3 * 60 + 250 : ℝ) = 430 ∧ (3 * 70 + 250 : ℝ) = 460 ∧
    (400 : ℝ) ≠ 430 ∧ (460 : ℝ) ≠ 430 := by norm_num

/-- Razlaga 1: 2(x + 3) = 2x + 6 je identiteta (velja za vsak x); enačba x + 1 = x nima rešitve. -/
theorem identiteta : (∀ x : ℝ, 2 * (x + 3) = 2 * x + 6) ∧ ∀ x : ℝ, x + 1 ≠ x := by
  refine ⟨fun x => by ring, fun x h => ?_⟩
  linarith

/-- Razlaga 1: 4x + 6 = 10 ⇔ 2x + 3 = 5 ⇔ x = 1 (deljenje enačbe z 2), izraza 4x + 6 in 2x + 3 pa nista enaka:
pri x = 1 sta 10 in 5. -/
theorem deljenje_z_2 (x : ℝ) : (4 * x + 6 = 10 ↔ 2 * x + 3 = 5) ∧ (2 * x + 3 = 5 ↔ x = 1) ∧
    (4 * 1 + 6 : ℝ) = 10 ∧ (2 * 1 + 3 : ℝ) = 5 ∧ ¬ ∀ y : ℝ, 4 * y + 6 = 2 * y + 3 := by
  refine ⟨iff_of_mul (k := 1 / 2) (by norm_num) (by ring), ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    by norm_num, by norm_num, fun h => ?_⟩
  have := h 1; norm_num at this

/-- Razlaga 3, Premisli: z množenjem z 0 iz x + 250 = 430 nastane 0 = 0, ki velja za vsak x, prvotna enačba pa
le za x = 180. -/
theorem premisli_nic : (∀ x : ℝ, 0 * (x + 250) = 0 * 430) ∧ (0 : ℝ) + 250 ≠ 430 := by
  refine ⟨fun x => by ring, by norm_num⟩

/-- Razlaga 5, Premisli: 2x + 3 = 2x + 5 nima rešitve (leva stran je za 2 manjša, oblika 0·x = 2). -/
theorem premisli_2x (x : ℝ) : (2 * x + 3) - (2 * x + 5) = -2 ∧ 2 * x + 3 ≠ 2 * x + 5 := by
  refine ⟨by ring, fun h => ?_⟩
  linarith

/-! ## Razlaga 6: parameter -/

/-- Razlaga 6: mx + 1 = 3x + 5 ⇔ mx − 3x = 5 − 1 ⇔ (m − 3)x = 4; pri m ≠ 3 je rešitev x = 4/(m − 3), pri m = 3
rešitve ni. -/
theorem razlaga6 (m x : ℝ) : (m * x + 1 = 3 * x + 5 ↔ (m - 3) * x = 4) ∧
    (m ≠ 3 → (m * x + 1 = 3 * x + 5 ↔ x = 4 / (m - 3))) ∧ (m = 3 → m * x + 1 ≠ 3 * x + 5) := by
  have h1 : m * x + 1 = 3 * x + 5 ↔ (m - 3) * x = 4 := by
    calc m * x + 1 = 3 * x + 5 ↔ m * x - 3 * x = 5 - 1 := iff_of_sub (by ring)
      _ ↔ (m - 3) * x = 4 := iff_of_sub (by ring)
  refine ⟨h1, fun hm => ?_, fun hm => ?_⟩
  · rw [h1]; exact (ax_b (m - 3) 4).1 (sub_ne_zero.mpr hm) x
  · rw [Ne, h1, hm]; norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: 3(x − 2) + 5 = 2x + 7 ⇔ 3x − 6 + 5 = 2x + 7 ⇔ 3x − 1 = 2x + 7 ⇔ 3x − 2x = 7 + 1 ⇔ x = 8. -/
theorem primer1 (x : ℝ) : 3 * (x - 2) + 5 = 2 * x + 7 ↔ x = 8 := by
  calc 3 * (x - 2) + 5 = 2 * x + 7 ↔ 3 * x - 6 + 5 = 2 * x + 7 := iff_of_sub (by ring)
    _ ↔ 3 * x - 1 = 2 * x + 7 := iff_of_sub (by ring)
    _ ↔ 3 * x - 2 * x = 7 + 1 := iff_of_sub (by ring)
    _ ↔ x = 8 := iff_of_sub (by ring)

/-- Primer 1, preizkus: 3·(8 − 2) + 5 = 18 + 5 = 23 in 2·8 + 7 = 23. -/
theorem primer1_preizkus : (3 * (8 - 2) + 5 : ℝ) = 18 + 5 ∧ (18 + 5 : ℝ) = 23 ∧ (2 * 8 + 7 : ℝ) = 23 := by
  norm_num

/-- Primer 2: (x + 1)/2 − (2x − 1)/3 = 1 ⇔ 6·(x + 1)/2 − 6·(2x − 1)/3 = 6·1 ⇔ 3(x + 1) − 2(2x − 1) = 6
⇔ 3x + 3 − 4x + 2 = 6 ⇔ −x + 5 = 6 ⇔ −x = 1 ⇔ x = −1. -/
theorem primer2 (x : ℝ) : (x + 1) / 2 - (2 * x - 1) / 3 = 1 ↔ x = -1 := by
  calc (x + 1) / 2 - (2 * x - 1) / 3 = 1 ↔ 6 * ((x + 1) / 2) - 6 * ((2 * x - 1) / 3) = 6 * 1 :=
        iff_of_mul (k := 6) (by norm_num) (by ring)
    _ ↔ 3 * (x + 1) - 2 * (2 * x - 1) = 6 := iff_of_sub (by ring)
    _ ↔ 3 * x + 3 - 4 * x + 2 = 6 := iff_of_sub (by ring)
    _ ↔ -x + 5 = 6 := iff_of_sub (by ring)
    _ ↔ -x = 1 := iff_of_sub (by ring)
    _ ↔ x = -1 := iff_of_mul (k := -1) (by norm_num) (by ring)

/-- Primer 2, preizkus: (−1 + 1)/2 − (2·(−1) − 1)/3 = 0/2 − (−3)/3 = 0 + 1 = 1. -/
theorem primer2_preizkus : ((-1 + 1) / 2 - (2 * (-1) - 1) / 3 : ℝ) = 0 / 2 - (-3) / 3 ∧
    (0 / 2 - (-3) / 3 : ℝ) = 0 + 1 ∧ (0 + 1 : ℝ) = 1 := by norm_num

/-- Primer 3: ax + 3 = x + a + 2 ⇔ ax − x = a + 2 − 3 ⇔ (a − 1)x = a − 1; za a ≠ 1 je rešitev natanko x = 1
(= (a − 1)/(a − 1)), za a = 1 je rešitev vsak x. -/
theorem primer3 (a x : ℝ) : (a * x + 3 = x + a + 2 ↔ (a - 1) * x = a - 1) ∧
    (a ≠ 1 → (a - 1) / (a - 1) = 1 ∧ (a * x + 3 = x + a + 2 ↔ x = 1)) ∧ (a = 1 → a * x + 3 = x + a + 2) := by
  have h1 : a * x + 3 = x + a + 2 ↔ (a - 1) * x = a - 1 := by
    calc a * x + 3 = x + a + 2 ↔ a * x - x = a + 2 - 3 := iff_of_sub (by ring)
      _ ↔ (a - 1) * x = a - 1 := iff_of_sub (by ring)
  refine ⟨h1, fun ha => ?_, fun ha => by rw [ha]; ring⟩
  have ha' : a - 1 ≠ 0 := sub_ne_zero.mpr ha
  refine ⟨div_self ha', ?_⟩
  rw [h1, (ax_b (a - 1) (a - 1)).1 ha' x, div_self ha']

/-- Primer 3, preizkus: za a = 2 je 2x + 3 = x + 4 ⇔ x = 1; za a = 1 velja x + 3 = x + 3 za vsak x. -/
theorem primer3_preizkus : (∀ x : ℝ, 2 * x + 3 = x + 4 ↔ x = 1) ∧ ∀ x : ℝ, x + 3 = x + 3 :=
  ⟨fun x => iff_of_sub (by ring), fun _ => rfl⟩

/-- Primer 4: x − x/3 − x/2 = 150 ⇔ 6x − 2x − 3x = 900 ⇔ x = 900; preizkus 900 − 300 − 450 = 150. -/
theorem primer4 (x : ℝ) : (x - x / 3 - x / 2 = 150 ↔ x = 900) ∧ (6 * x - 2 * x - 3 * x = x) ∧
    (900 - 900 / 3 - 900 / 2 : ℝ) = 900 - 300 - 450 ∧ (900 - 300 - 450 : ℝ) = 150 := by
  refine ⟨?_, by ring, by norm_num, by norm_num⟩
  calc x - x / 3 - x / 2 = 150 ↔ 6 * x - 2 * x - 3 * x = 900 := iff_of_mul (k := 6) (by norm_num) (by ring)
    _ ↔ x = 900 := iff_of_sub (by ring)

/-! ## Pogoste napake -/

/-- Pogoste napake 1, Ponovitev: −(2x − 1) = −2x + 1, nikoli −2x − 1; 6·(−(2x − 1)/3) = −2(2x − 1). -/
theorem napaka_predznak (x : ℝ) : -(2 * x - 1) = -2 * x + 1 ∧ -(2 * x - 1) ≠ -2 * x - 1 ∧
    6 * (-((2 * x - 1) / 3)) = -2 * (2 * x - 1) := by
  refine ⟨by ring, fun h => ?_, by ring⟩
  linarith

/-- Pogoste napake 2 in Preveri se 3: x/2 + x/3 = 5 ⇔ 3x + 2x = 30 ⇔ 5x = 30 ⇔ x = 6; napačna 1 (iz 3x + 2x = 5)
in 30 nista rešitvi. -/
theorem napaka_ulomki (x : ℝ) : (x / 2 + x / 3 = 5 ↔ 3 * x + 2 * x = 30) ∧ (3 * x + 2 * x = 30 ↔ 5 * x = 30) ∧
    (5 * x = 30 ↔ x = 6) ∧ (1 : ℝ) / 2 + 1 / 3 ≠ 5 ∧ (30 : ℝ) / 2 + 30 / 3 ≠ 5 := by
  refine ⟨iff_of_mul (k := 6) (by norm_num) (by ring), iff_of_sub (by ring), ?_, by norm_num, by norm_num⟩
  calc 5 * x = 30 ↔ x = 30 / 5 := (ax_b 5 30).1 (by norm_num) x
    _ ↔ x = 6 := by norm_num

/-- Pogoste napake 3, Ponovitev, Preveri se 2: 5x − 7 = 3x + 9 ⇔ 5x − 3x = 9 + 7 ⇔ 2x = 16 ⇔ x = 8; napačna 1 in
−8 nista rešitvi. -/
theorem napaka_prenos (x : ℝ) : (5 * x - 7 = 3 * x + 9 ↔ x = 8) ∧ (5 * 1 - 7 : ℝ) ≠ 3 * 1 + 9 ∧
    (5 * (-8) - 7 : ℝ) ≠ 3 * (-8) + 9 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  calc 5 * x - 7 = 3 * x + 9 ↔ 5 * x - 3 * x = 9 + 7 := iff_of_sub (by ring)
    _ ↔ 2 * x = 16 := iff_of_sub (by ring)
    _ ↔ x = 8 := by constructor <;> intro h <;> linarith

/-- Pogoste napake 4, Preveri se 6, Bolj natančno: pri (a − 1)x = a − 1 in a = 1 velja vsak x, zato »vedno x = 1«
ni pravilno (pri a = 1 je rešitev tudi x = 5). -/
theorem napaka_parameter : (∀ x : ℝ, ((1 : ℝ) - 1) * x = 1 - 1) ∧ ((1 : ℝ) - 1) * 5 = 1 - 1 ∧ (5 : ℝ) ≠ 1 := by
  refine ⟨fun x => by ring, by ring, by norm_num⟩

/-- Pogoste napake 5: 0·x = 6 nima rešitve, zato tudi x = 0 ni rešitev. -/
theorem napaka_nic : (∀ x : ℝ, 0 * x ≠ 6) ∧ (0 : ℝ) * 0 ≠ 6 :=
  ⟨(ax_b 0 6).2.2.1 rfl (by norm_num), by norm_num⟩

/-! ## Za maturo -/

/-- Naloga 1: (x − 3)/4 − (2x + 1)/6 = x/3 − 3 ⇔ 3(x − 3) − 2(2x + 1) = 4x − 36 ⇔ 3x − 9 − 4x − 2 = 4x − 36
⇔ −x − 11 = 4x − 36 ⇔ −5x = −25 ⇔ x = 5. -/
theorem naloga1 (x : ℝ) : (x - 3) / 4 - (2 * x + 1) / 6 = x / 3 - 3 ↔ x = 5 := by
  calc (x - 3) / 4 - (2 * x + 1) / 6 = x / 3 - 3 ↔ 3 * (x - 3) - 2 * (2 * x + 1) = 4 * x - 36 :=
        iff_of_mul (k := 12) (by norm_num) (by ring)
    _ ↔ 3 * x - 9 - 4 * x - 2 = 4 * x - 36 := iff_of_sub (by ring)
    _ ↔ -x - 11 = 4 * x - 36 := iff_of_sub (by ring)
    _ ↔ -5 * x = -25 := iff_of_sub (by ring)
    _ ↔ x = 5 := iff_of_mul (k := -1 / 5) (by norm_num) (by ring)

/-- Naloga 1, preizkus: 2/4 − 11/6 = 3/6 − 11/6 = −4/3 in 5/3 − 3 = −4/3. -/
theorem naloga1_preizkus : ((5 - 3) / 4 - (2 * 5 + 1) / 6 : ℝ) = 2 / 4 - 11 / 6 ∧
    (2 / 4 - 11 / 6 : ℝ) = 3 / 6 - 11 / 6 ∧ (3 / 6 - 11 / 6 : ℝ) = -4 / 3 ∧ (5 / 3 - 3 : ℝ) = -4 / 3 := by
  norm_num

/-- Naloga 2 a): 8,40 + 0,035x = 5,20 + 0,06x ⇔ 8,40 − 5,20 = 0,06x − 0,035x ⇔ 3,20 = 0,025x ⇔ x = 128
(3,20/0,025 = 3200/25 = 128). -/
theorem naloga2a (x : ℝ) : (8.40 + 0.035 * x = 5.20 + 0.06 * x ↔ 3.20 = 0.025 * x) ∧
    (3.20 = 0.025 * x ↔ x = 128) ∧ (3.20 / 0.025 : ℝ) = 3200 / 25 ∧ (3200 / 25 : ℝ) = 128 := by
  refine ⟨?_, ?_, by norm_num, by norm_num⟩
  · constructor <;> intro h <;> norm_num at h ⊢ <;> linarith
  · constructor <;> intro h <;> norm_num at h ⊢ <;> linarith

/-- Naloga 2 b): 8,40 + 0,035·128 = 8,40 + 4,48 = 12,88 € in 5,20 + 0,06·128 = 5,20 + 7,68 = 12,88 €. -/
theorem naloga2b : (8.40 + 0.035 * 128 : ℝ) = 8.40 + 4.48 ∧ (8.40 + 4.48 : ℝ) = 12.88 ∧
    (5.20 + 0.06 * 128 : ℝ) = 5.20 + 7.68 ∧ (5.20 + 7.68 : ℝ) = 12.88 := by norm_num

/-- Naloga 2 c): 8,40 + 0,035x = 17,85 ⇔ 0,035x = 9,45 ⇔ x = 270 (9,45/0,035 = 9450/35 = 270). -/
theorem naloga2c (x : ℝ) : (8.40 + 0.035 * x = 17.85 ↔ 0.035 * x = 9.45) ∧ (0.035 * x = 9.45 ↔ x = 270) ∧
    (9.45 / 0.035 : ℝ) = 9450 / 35 ∧ (9450 / 35 : ℝ) = 270 := by
  refine ⟨?_, ?_, by norm_num, by norm_num⟩
  · constructor <;> intro h <;> norm_num at h ⊢ <;> linarith
  · constructor <;> intro h <;> norm_num at h ⊢ <;> linarith

/-- Naloga 3: enačba (mx + 2)/2 − (m + 3)/3 = (4 − x)/2 − m/3. -/
def E (m x : ℝ) : Prop := (m * x + 2) / 2 - (m + 3) / 3 = (4 - x) / 2 - m / 3

/-- Naloga 3 a): pri m = 3 je enačba (3x + 2)/2 − 2 = (4 − x)/2 − 1 ⇔ 3x + 2 − 4 = 4 − x − 2 ⇔ 4x = 4 ⇔ x = 1. -/
theorem naloga3a (x : ℝ) : (E 3 x ↔ (3 * x + 2) / 2 - 2 = (4 - x) / 2 - 1) ∧
    ((3 * x + 2) / 2 - 2 = (4 - x) / 2 - 1 ↔ x = 1) := by
  refine ⟨by unfold E; norm_num, ?_⟩
  calc (3 * x + 2) / 2 - 2 = (4 - x) / 2 - 1 ↔ 3 * x + 2 - 4 = 4 - x - 2 :=
        iff_of_mul (k := 2) (by norm_num) (by ring)
    _ ↔ 4 * x = 4 := iff_of_sub (by ring)
    _ ↔ x = 1 := by constructor <;> intro h <;> linarith

/-- Naloga 3 b): E ⇔ 3(mx + 2) − 2(m + 3) = 3(4 − x) − 2m ⇔ 3mx + 6 − 2m − 6 = 12 − 3x − 2m ⇔ 3mx + 3x = 12
⇔ 3(m + 1)x = 12 ⇔ (m + 1)x = 4. -/
theorem naloga3b_oblika (m x : ℝ) : E m x ↔ (m + 1) * x = 4 := by
  unfold E
  calc (m * x + 2) / 2 - (m + 3) / 3 = (4 - x) / 2 - m / 3
        ↔ 3 * (m * x + 2) - 2 * (m + 3) = 3 * (4 - x) - 2 * m := iff_of_mul (k := 6) (by norm_num) (by ring)
    _ ↔ 3 * m * x + 6 - 2 * m - 6 = 12 - 3 * x - 2 * m := iff_of_sub (by ring)
    _ ↔ 3 * m * x + 3 * x = 12 := iff_of_sub (by ring)
    _ ↔ 3 * (m + 1) * x = 12 := iff_of_sub (by ring)
    _ ↔ (m + 1) * x = 4 := iff_of_mul (k := 1 / 3) (by norm_num) (by ring)

/-- Naloga 3 b): za m ≠ −1 je rešitev natanko x = 4/(m + 1) (pri m = 3: 4/4 = 1), za m = −1 rešitve ni. -/
theorem naloga3b (m : ℝ) : (m ≠ -1 → ∀ x, (E m x ↔ x = 4 / (m + 1))) ∧ (m = -1 → ∀ x, ¬ E m x) ∧
    (4 / (3 + 1) : ℝ) = 1 := by
  refine ⟨fun hm x => ?_, fun hm x => ?_, by norm_num⟩
  · have h : m + 1 ≠ 0 := fun h => hm (by linarith)
    rw [naloga3b_oblika]; exact (ax_b (m + 1) 4).1 h x
  · rw [naloga3b_oblika, hm]; norm_num

/-- Naloga 3 c): enačba ima negativno rešitev natanko tedaj, ko je m < −1. -/
theorem naloga3c (m : ℝ) : (∃ x, E m x ∧ x < 0) ↔ m < -1 := by
  constructor
  · rintro ⟨x, hx, hneg⟩
    rw [naloga3b_oblika] at hx
    by_contra h
    rw [not_lt] at h
    nlinarith
  · intro hm
    have h : m + 1 ≠ 0 := by intro h; linarith
    refine ⟨4 / (m + 1), ((naloga3b m).1 (by intro e; linarith) _).mpr rfl, ?_⟩
    exact div_neg_of_pos_of_neg (by norm_num) (by linarith)

/-- Naloga 3 d): za celi m ima enačba celo rešitev natanko pri m ∈ {−5, −3, −2, 0, 1, 3} (m + 1 deli 4); rešitve
so po vrsti −1, −2, −4, 4, 2, 1. -/
theorem naloga3d (m : ℤ) : (∃ k : ℤ, E m k) ↔ m ∈ ({-5, -3, -2, 0, 1, 3} : Finset ℤ) := by
  constructor
  · rintro ⟨k, hk⟩
    rw [naloga3b_oblika] at hk
    have hz : (m + 1) * k = 4 := by exact_mod_cast hk
    have hd : (m + 1) ∣ 4 := ⟨k, hz.symm⟩
    have h1 : m + 1 ≤ 4 := Int.le_of_dvd (by norm_num) hd
    have h2 : -(m + 1) ≤ 4 := Int.le_of_dvd (by norm_num) ((neg_dvd).mpr hd)
    have h3 : -5 ≤ m := by omega
    have h4 : m ≤ 3 := by omega
    interval_cases m <;> simp <;> omega
  · intro hm
    simp only [Finset.mem_insert, Finset.mem_singleton] at hm
    rcases hm with rfl | rfl | rfl | rfl | rfl | rfl
    · exact ⟨-1, by rw [naloga3b_oblika]; norm_num⟩
    · exact ⟨-2, by rw [naloga3b_oblika]; norm_num⟩
    · exact ⟨-4, by rw [naloga3b_oblika]; norm_num⟩
    · exact ⟨4, by rw [naloga3b_oblika]; norm_num⟩
    · exact ⟨2, by rw [naloga3b_oblika]; norm_num⟩
    · exact ⟨1, by rw [naloga3b_oblika]; norm_num⟩

/-! ## Ustna vprašanja in Drugače -/

/-- Ustno vprašanje 1: 2x + 3 = 11 ⇔ x = 4. -/
theorem ustno1 (x : ℝ) : 2 * x + 3 = 11 ↔ x = 4 := by
  constructor <;> intro h <;> linarith

/-- Ustno vprašanje 3: (m² − 1)x = m − 1, m² − 1 = (m − 1)(m + 1); za m ≠ ±1 je rešitev natanko x = 1/(m + 1), pri
m = 1 vsak x, pri m = −1 nobena (0·x = −2). -/
theorem ustno3 (m : ℝ) : m ^ 2 - 1 = (m - 1) * (m + 1) ∧
    (m ≠ 1 → m ≠ -1 → ∀ x, ((m ^ 2 - 1) * x = m - 1 ↔ x = 1 / (m + 1))) ∧
    (m = 1 → ∀ x, (m ^ 2 - 1) * x = m - 1) ∧ (m = -1 → ∀ x, (m ^ 2 - 1) * x ≠ m - 1) := by
  refine ⟨by ring, fun h1 h2 x => ?_, fun h x => by rw [h]; ring, fun h x => by rw [h]; norm_num⟩
  have a1 : m - 1 ≠ 0 := sub_ne_zero.mpr h1
  have a2 : m + 1 ≠ 0 := fun h => h2 (by linarith)
  rw [(ax_b (m ^ 2 - 1) (m - 1)).1 (by rw [show m ^ 2 - 1 = (m - 1) * (m + 1) by ring]; exact mul_ne_zero a1 a2)]
  rw [show m ^ 2 - 1 = (m - 1) * (m + 1) by ring, div_mul_cancel_left₀ a1, one_div]

/-- Predpostavki `ustno3` (m ≠ ±1) se dajo izpolniti (m = 0). -/
example : ((0 : ℝ) ^ 2 - 1) * (1 / (0 + 1)) = 0 - 1 := (((ustno3 0).2.1 (by norm_num) (by norm_num)) _).mpr rfl

/-- RACUN: (m − 1)/(m² − 1) = 1/(m + 1) za m ≠ ±1. -/
theorem racun_ulomek (m : ℝ) (h1 : m ≠ 1) (h2 : m ≠ -1) : (m - 1) / (m ^ 2 - 1) = 1 / (m + 1) := by
  have a1 : m - 1 ≠ 0 := sub_ne_zero.mpr h1
  have a2 : m + 1 ≠ 0 := fun h => h2 (by linarith)
  rw [show m ^ 2 - 1 = (m - 1) * (m + 1) by ring]; field_simp

/-- Predpostavki `racun_ulomek` se dajo izpolniti (m = 0). -/
example : ((0 : ℝ) - 1) / (0 ^ 2 - 1) = 1 / (0 + 1) := racun_ulomek 0 (by norm_num) (by norm_num)

/-- Na sliki: 3x − 1 = 2x + 7 ⇔ x = 8, kjer imata premici vrednost 23; 2x − 4 = 0 ⇔ x = 2 (ničla, točka (2, 0)). -/
theorem na_sliki (x : ℝ) : (3 * x - 1 = 2 * x + 7 ↔ x = 8) ∧ (3 * 8 - 1 : ℝ) = 23 ∧ (2 * 8 + 7 : ℝ) = 23 ∧
    (2 * x - 4 = 0 ↔ x = 2) := by
  refine ⟨by constructor <;> intro h <;> linarith, by norm_num, by norm_num, by constructor <;> intro h <;> linarith⟩

/-- Na sliki: premici y = a₁x + b₁ in y = a₂x + b₂: pri a₁ ≠ a₂ se sekata v natanko eni točki, pri a₁ = a₂,
b₁ ≠ b₂ se ne sekata, pri a₁ = a₂, b₁ = b₂ se prekrivata. -/
theorem premici (a₁ b₁ a₂ b₂ : ℝ) :
    (a₁ ≠ a₂ → ∃! x : ℝ, a₁ * x + b₁ = a₂ * x + b₂) ∧ (a₁ = a₂ → b₁ ≠ b₂ → ∀ x, a₁ * x + b₁ ≠ a₂ * x + b₂) ∧
    (a₁ = a₂ → b₁ = b₂ → ∀ x, a₁ * x + b₁ = a₂ * x + b₂) := by
  refine ⟨fun h => ?_, fun h hb x e => hb (by rw [h] at e; linarith), fun h hb x => by rw [h, hb]⟩
  have h' : a₁ - a₂ ≠ 0 := sub_ne_zero.mpr h
  have key : ∀ x, a₁ * x + b₁ = a₂ * x + b₂ ↔ x = (b₂ - b₁) / (a₁ - a₂) := fun x =>
    (iff_of_sub (by ring)).trans ((ax_b (a₁ - a₂) (b₂ - b₁)).1 h' x)
  exact ⟨(b₂ - b₁) / (a₁ - a₂), (key _).mpr rfl, fun y hy => (key y).mp hy⟩

/-- Predpostavke `premici` se dajo izpolniti (a₁ = 3, b₁ = −1, a₂ = 2, b₂ = 7). -/
example : ∃! x : ℝ, 3 * x + -1 = 2 * x + 7 := (premici 3 (-1) 2 7).1 (by norm_num)

/-- Kot zgodba: 900 − 200 − 100 = 600, 600/4 = 150; 4x + 300 = 900 ⇔ 4x = 600 ⇔ x = 150;
4x + p + 100 = 900 ⇔ x = (800 − p)/4; pri p = 800 je x = 0. -/
theorem zgodba (x p : ℝ) : (900 - 200 - 100 : ℝ) = 600 ∧ (600 / 4 : ℝ) = 150 ∧
    (4 * x + 300 = 900 ↔ 4 * x = 600) ∧ (4 * x = 600 ↔ x = 150) ∧
    (4 * x + p + 100 = 900 ↔ x = (800 - p) / 4) ∧ ((800 : ℝ) - 800) / 4 = 0 := by
  refine ⟨by norm_num, by norm_num, iff_of_sub (by ring), by constructor <;> intro h <;> linarith, ?_, by norm_num⟩
  rw [eq_div_iff (by norm_num)]; constructor <;> intro h <;> linarith

/-- Korak za korakom: (2x − 1)/4 = (x + 2)/3 ⇔ 12·(2x − 1)/4 = 12·(x + 2)/3 ⇔ 3(2x − 1) = 4(x + 2) ⇔ 6x − 3 = 4x + 8
⇔ 6x − 4x = 8 + 3 ⇔ 2x = 11 ⇔ x = 11/2 = 5,5. -/
theorem korak (x : ℝ) : (2 * x - 1) / 4 = (x + 2) / 3 ↔ x = 5.5 := by
  calc (2 * x - 1) / 4 = (x + 2) / 3 ↔ 12 * ((2 * x - 1) / 4) = 12 * ((x + 2) / 3) :=
        iff_of_mul (k := 12) (by norm_num) (by ring)
    _ ↔ 3 * (2 * x - 1) = 4 * (x + 2) := iff_of_sub (by ring)
    _ ↔ 6 * x - 3 = 4 * x + 8 := iff_of_sub (by ring)
    _ ↔ 6 * x - 4 * x = 8 + 3 := iff_of_sub (by ring)
    _ ↔ 2 * x = 11 := iff_of_sub (by ring)
    _ ↔ x = 11 / 2 := by constructor <;> intro h <;> linarith
    _ ↔ x = 5.5 := by norm_num

/-- Korak za korakom, preizkus: (2·5,5 − 1)/4 = 10/4 = 2,5 in (5,5 + 2)/3 = 7,5/3 = 2,5. -/
theorem korak_preizkus : ((2 * 5.5 - 1) / 4 : ℝ) = 10 / 4 ∧ (10 / 4 : ℝ) = 2.5 ∧ ((5.5 + 2) / 3 : ℝ) = 7.5 / 3 ∧
    (7.5 / 3 : ℝ) = 2.5 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1: 5·4 − 2 = 18; 5x − 2 = 33 ⇔ x = 7; napačna 163 = 5·33 − 2 in 6,2 (iz 5x = 33 − 2, ki ima rešitev
31/5) nista rešitvi. -/
theorem preveri1 (x : ℝ) : (5 * 4 - 2 : ℝ) = 18 ∧ (5 * x - 2 = 33 ↔ x = 7) ∧ (5 * 33 - 2 : ℝ) = 163 ∧
    (5 * x = 33 - 2 ↔ x = 31 / 5) ∧ (31 / 5 : ℝ) = 6.2 ∧ (5 * 163 - 2 : ℝ) ≠ 33 ∧ (5 * 6.2 - 2 : ℝ) ≠ 33 := by
  refine ⟨by norm_num, by constructor <;> intro h <;> linarith, by norm_num, ?_, by norm_num, by norm_num,
    by norm_num⟩
  rw [eq_div_iff (by norm_num)]; constructor <;> intro h <;> linarith

/-- Preveri se 4: ax − 2 = 4 + 2x ⇔ (a − 2)x = 6; enačba nima rešitve natanko pri a = 2; pri a ≠ 2 je
x = 6/(a − 2) (pri a = 0 je x = −3). -/
theorem preveri4 (a : ℝ) : (∀ x, (a * x - 2 = 4 + 2 * x ↔ (a - 2) * x = 6)) ∧
    ((¬ ∃ x, a * x - 2 = 4 + 2 * x) ↔ a = 2) ∧ (a ≠ 2 → ∀ x, (a * x - 2 = 4 + 2 * x ↔ x = 6 / (a - 2))) ∧
    (0 : ℝ) * (-3) - 2 = 4 + 2 * (-3) := by
  have h1 : ∀ x, (a * x - 2 = 4 + 2 * x ↔ (a - 2) * x = 6) := fun x => iff_of_sub (by ring)
  have h3 : a ≠ 2 → ∀ x, (a * x - 2 = 4 + 2 * x ↔ x = 6 / (a - 2)) := fun ha x => by
    rw [h1]; exact (ax_b (a - 2) 6).1 (sub_ne_zero.mpr ha) x
  refine ⟨h1, ⟨fun h => ?_, fun ha => ?_⟩, h3, by norm_num⟩
  · by_contra ha
    exact h ⟨6 / (a - 2), (h3 ha _).mpr rfl⟩
  · rintro ⟨x, hx⟩
    rw [h1, ha] at hx; norm_num at hx

/-- Preveri se 5: 4x + 248 = 1052 ⇔ 4x = 804 ⇔ x = 201 ≈ 200 (|201 − 200| ≤ 1); 1052/4 = 263,
(1052 + 248)/4 = 325, 1052 − 248 = 804. -/
theorem preveri5 (x : ℝ) : (4 * x + 248 = 1052 ↔ 4 * x = 804) ∧ (4 * x = 804 ↔ x = 201) ∧
    |(201 : ℝ) - 200| ≤ 1 ∧ (1052 / 4 : ℝ) = 263 ∧ ((1052 + 248) / 4 : ℝ) = 325 ∧ (1052 - 248 : ℝ) = 804 := by
  refine ⟨iff_of_sub (by ring), by constructor <;> intro h <;> linarith, by norm_num [abs_of_pos],
    by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 6 (in Bolj natančno): pri a ≠ 1 je x = 1 rešitev (a − 1)x = a − 1, pri a = 1 je rešitev vsak x. -/
theorem preveri6 (a : ℝ) : (a - 1) * 1 = a - 1 ∧ (a = 1 → ∀ x, (a - 1) * x = a - 1) :=
  ⟨mul_one _, fun h x => by rw [h]; ring⟩

/-! ## RACUN -/

/-- Blok RACUN: resi vrstice so v `naloga1`, `naloga2a`, `naloga2c`, `naloga3a`, `naloga3b`, `ustno1`, `jajca`,
`deljenje_z_2`, `preveri1`, `napaka_ulomki`; neenacba m + 1 < 0 ⇔ m < −1; resi pri m = −1 (brez rešitve); enako in
vrednost vrstice tu. -/
theorem racun :
    (∀ x : ℝ, 3*(x-3)-2*(2*x+1) = 4*x-36 ↔ x = 5) ∧ ((2:ℝ)/4-11/6 = -4/3) ∧ ((5:ℝ)/3-3 = -4/3) ∧
    ((8.4:ℝ)+0.035*128 = 12.88) ∧ ((5.2:ℝ)+0.06*128 = 12.88) ∧
    (∀ m x : ℝ, 3*(m*x+2)-2*(m+3)-(3*(4-x)-2*m) = 3*(m+1)*x-12) ∧
    (∀ m x : ℝ, (m*x+2)/2-(m+3)/3-((4-x)/2-m/3) = (m+1)*x/2-2) ∧
    (∀ m : ℝ, m ≠ -1 → (m*(4/(m+1))+2)/2-(m+3)/3-((4-4/(m+1))/2-m/3) = 0) ∧
    (∀ x : ℝ, (-x+2)/2-2/3 ≠ (4-x)/2+1/3) ∧ (∀ m : ℝ, m + 1 < 0 ↔ m < -1) ∧
    ((4:ℝ)/(-5+1) = -1) ∧ ((4:ℝ)/(-3+1) = -2) ∧ ((4:ℝ)/(-2+1) = -4) ∧ ((4:ℝ)/(0+1) = 4) ∧
    ((4:ℝ)/(1+1) = 2) ∧ ((4:ℝ)/(3+1) = 1) ∧ ((3:ℝ)*50+250 = 400) ∧ ((3:ℝ)*60+250 = 430) ∧
    ((3:ℝ)*70+250 = 460) ∧ (∀ x : ℝ, 2*(x+3) = 2*x+6) ∧ ((4:ℝ)*1+6 = 10) ∧ ((2:ℝ)*1+3 = 5) ∧
    ((5:ℝ)*4-2 = 18) ∧ ((5:ℝ)*33-2 = 163) := by
  refine ⟨fun x => ?_, by norm_num, by norm_num, by norm_num, by norm_num, fun m x => by ring,
    fun m x => by ring, fun m hm => ?_, fun x h => ?_, fun m => ⟨fun h => by linarith, fun h => by linarith⟩,
    by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, fun x => by ring, by norm_num, by norm_num, by norm_num, by norm_num⟩
  · constructor <;> intro h <;> linarith
  · have h : m + 1 ≠ 0 := fun h => hm (by linarith)
    field_simp; ring
  · linarith

end Evklid.Lekcije.MAT_SS_1.LinearneEnacbe
