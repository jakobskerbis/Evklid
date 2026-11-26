/-
vir: content/lessons/MAT-SS-1/linearne-neenacbe.md
sha256: df727fa57d0abccbeba6f6511edc4212335d0a9db615a1986fab89ad42b3aaf4
Ni v Leanu: definicije in poimenovanja (linearna neenačba, rešitev, znaki, interval, krajišče, okrogli in oglati
oklepaj, prazen in poln krožec) in zapis z intervali kot dogovor (dokazane so enakosti množic rešitev z intervali
Set.Iio, Set.Iic, Set.Ioi, Set.Ici, Set.Icc, Set.Ioc in pripadnost krajišč); »∞ ni število« (v Leanu intervala
(a, ∞) ni kot para števil, ampak Set.Ioi a); risbe številske premice in grafov ter simulacija (dokazane so
množice rešitev, presečišči (4, 11), (5, 6), naraščanje 2x + 3 in padanje 5 − 3x); analogija s termometrom kot opis
(dokazano: 2 < 5 in −5 < −2); »rešitev ni eno število, ampak množica« in »smiselnost rešitve« kot navodila (dokazane
so množice celih rešitev z najmanjšim oz. največjim elementom); postopek reševanja kot navodilo; točkovanje
maturitetnih nalog; besedila napačnih odgovorov v Preveri se (dokazano je, da napačne vrednosti oz. intervali niso
pravilni). Približek 261,63 je dokazan kot |1350/5,16 − 261,63| < 0,005 in 11,77… kot 11,77 < 530/45 < 11,78.
Decimalna števila so točna racionalna števila v ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.LinearneNeenacbe

open Set

/-! ## Pomožne trditve: ekvivalentna preoblikovanja -/

/-- Razlaga 3 (prištevanje, odštevanje): a < b ⇔ c < d, če je d − c = b − a. -/
theorem lt_of_sub {a b c d : ℝ} (h : b - a = d - c) : a < b ↔ c < d := by
  constructor <;> intro h' <;> linarith

/-- Razlaga 3 (prištevanje, odštevanje): a ≤ b ⇔ c ≤ d, če je d − c = b − a. -/
theorem le_of_sub {a b c d : ℝ} (h : b - a = d - c) : a ≤ b ↔ c ≤ d := by
  constructor <;> intro h' <;> linarith

/-- Razlaga 3 (množenje s pozitivnim k): a < b ⇔ c < d, če je d − c = k(b − a), k > 0. -/
theorem lt_of_mul {a b c d k : ℝ} (hk : 0 < k) (h : d - c = k * (b - a)) : a < b ↔ c < d := by
  constructor <;> intro h' <;> nlinarith

/-- Razlaga 3 (množenje s pozitivnim k): a ≤ b ⇔ c ≤ d, če je d − c = k(b − a), k > 0. -/
theorem le_of_mul {a b c d k : ℝ} (hk : 0 < k) (h : d - c = k * (b - a)) : a ≤ b ↔ c ≤ d := by
  constructor <;> intro h' <;> nlinarith

/-- Razlaga 3 (množenje z negativnim k, znak se obrne): a < b ⇔ d < c, če je d − c = k(b − a), k < 0. -/
theorem lt_of_mul_neg {a b c d k : ℝ} (hk : k < 0) (h : d - c = k * (b - a)) : a < b ↔ d < c := by
  constructor <;> intro h' <;> nlinarith

/-- Razlaga 3 (množenje z negativnim k, znak se obrne): a ≤ b ⇔ d ≤ c, če je d − c = k(b − a), k < 0. -/
theorem le_of_mul_neg {a b c d k : ℝ} (hk : k < 0) (h : d - c = k * (b - a)) : a ≤ b ↔ d ≤ c := by
  constructor <;> intro h' <;> nlinarith

/-- Predpostavke pomožnih trditev se dajo izpolniti (k = 2 in k = −1). -/
example (x : ℝ) : (x < 4 ↔ 2 * x < 8) ∧ (x < 4 ↔ -4 < -x) ∧ (x ≤ 4 ↔ 2 * x ≤ 8) ∧ (x ≤ 4 ↔ -4 ≤ -x) ∧
    (x + 1 < 3 ↔ x < 2) ∧ (x + 1 ≤ 3 ↔ x ≤ 2) :=
  ⟨lt_of_mul (k := 2) two_pos (by ring), lt_of_mul_neg (k := -1) (by norm_num) (by ring),
    le_of_mul (k := 2) two_pos (by ring), le_of_mul_neg (k := -1) (by norm_num) (by ring),
    lt_of_sub (by ring), le_of_sub (by ring)⟩

/-- Razlaga 3, Povzetek, Ponovitev: a < b ⇔ a + c < b + c; za c > 0 je a < b ⇔ ca < cb; za c < 0 je a < b ⇔
ca > cb (enako za ≤). -/
theorem preoblikovanja (a b c : ℝ) : (a < b ↔ a + c < b + c) ∧ (a ≤ b ↔ a + c ≤ b + c) ∧
    (0 < c → (a < b ↔ c * a < c * b)) ∧ (0 < c → (a ≤ b ↔ c * a ≤ c * b)) ∧
    (c < 0 → (a < b ↔ c * b < c * a)) ∧ (c < 0 → (a ≤ b ↔ c * b ≤ c * a)) := by
  refine ⟨lt_of_sub (by ring), le_of_sub (by ring), fun hc => lt_of_mul hc (by ring),
    fun hc => le_of_mul hc (by ring), fun hc => lt_of_mul_neg hc (by ring), fun hc => le_of_mul_neg hc (by ring)⟩

/-- Ustno vprašanje 1, Bolj natančno: če je a < b in c < 0, je b − a > 0, c(b − a) < 0, cb − ca < 0, cb < ca. -/
theorem obrnitev (a b c : ℝ) (hab : a < b) (hc : c < 0) :
    0 < b - a ∧ c * (b - a) < 0 ∧ c * b - c * a < 0 ∧ c * b < c * a := by
  have h1 : 0 < b - a := by linarith
  have h2 : c * (b - a) < 0 := mul_neg_of_neg_of_pos hc h1
  have h3 : c * b - c * a < 0 := by linarith
  exact ⟨h1, h2, h3, by linarith⟩

/-- Predpostavke `obrnitev` se dajo izpolniti (a = 2, b = 5, c = −1). -/
example : (-1 : ℝ) * 5 < -1 * 2 := (obrnitev 2 5 (-1) (by norm_num) (by norm_num)).2.2.2

/-- Razlaga 3 in termometer: 2 < 5 in z množenjem z −1 −2 > −5 (−5 < −2). -/
theorem dve_pet : (2 : ℝ) < 5 ∧ (-5 : ℝ) < -2 := by norm_num

/-- Bolj natančno: ax + b < c ima pri a > 0 rešitev x < (c − b)/a, pri a < 0 pa x > (c − b)/a. -/
theorem splosna (a b c x : ℝ) : (0 < a → (a * x + b < c ↔ x < (c - b) / a)) ∧
    (a < 0 → (a * x + b < c ↔ (c - b) / a < x)) := by
  refine ⟨fun ha => ?_, fun ha => ?_⟩
  · rw [lt_div_iff₀ ha]; constructor <;> intro h <;> linarith
  · rw [div_lt_iff_of_neg ha]; constructor <;> intro h <;> linarith

/-- Predpostavki `splosna` se dajo izpolniti (a = 2 in a = −2). -/
example : (2 * 0 + 3 < (11 : ℝ) ↔ (0 : ℝ) < (11 - 3) / 2) ∧ (-2 * 0 + 4 < (10 : ℝ) ↔ (10 - 4) / -2 < (0 : ℝ)) :=
  ⟨(splosna 2 3 11 0).1 two_pos, (splosna (-2) 4 10 0).2 (by norm_num)⟩

/-! ## Zakaj se tega učimo, Razlaga 2–5 -/

/-- Zakaj se tega učimo: 6 + 4,5·x ≤ 33 velja pri 3, 5, 6 letvah, pri 7 ne (37,5 > 33). -/
theorem letve_uvod : (6 + 4.5 * 3 : ℝ) ≤ 33 ∧ (6 + 4.5 * 5 : ℝ) ≤ 33 ∧ (6 + 4.5 * 6 : ℝ) ≤ 33 ∧
    ¬ (6 + 4.5 * 7 : ℝ) ≤ 33 := by norm_num

/-- Razlaga 2: x + 1 > 3 ⇔ x > 2; 2,5, 3 in 10 so rešitve, 2 ni (3 > 3 ne drži). -/
theorem razlaga2 : (∀ x : ℝ, x + 1 > 3 ↔ x > 2) ∧ (2.5 : ℝ) + 1 > 3 ∧ (3 : ℝ) + 1 > 3 ∧ (10 : ℝ) + 1 > 3 ∧
    ¬ (2 : ℝ) + 1 > 3 := by
  refine ⟨fun x => lt_of_sub (by ring), by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Razlaga 3, Premisli: −x > 3 ⇔ x < −3; −5 je rešitev (5 > 3), 0 ni. -/
theorem premisli_minus (x : ℝ) : (-x > 3 ↔ x < -3) ∧ -(-5 : ℝ) > 3 ∧ ¬ -(0 : ℝ) > 3 := by
  refine ⟨lt_of_mul_neg (k := -1) (by norm_num) (by ring), by norm_num, by norm_num⟩

/-- Razlaga 3 (hitro preveri): −2x < 8 ⇔ x > −4. -/
theorem hitro_preveri (x : ℝ) : -2 * x < 8 ↔ x > -4 := lt_of_mul_neg (k := -1 / 2) (by norm_num) (by ring)

/-- Razlaga 3, simulacija: −2x + 1 < 7 ⇔ x > −3; x = 0 je rešitev, x = −5 ni. -/
theorem simulacija (x : ℝ) : (-2 * x + 1 < 7 ↔ x > -3) ∧ (-2 * 0 + 1 : ℝ) < 7 ∧ ¬ (-2 * (-5) + 1 : ℝ) < 7 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  calc -2 * x + 1 < 7 ↔ -2 * x < 6 := lt_of_sub (by ring)
    _ ↔ x > -3 := lt_of_mul_neg (k := -1 / 2) (by norm_num) (by ring)

/-- Razlaga 4, tabela: {x | x > a} = (a, ∞), {x | x ≥ a} = [a, ∞), {x | x < a} = (−∞, a), {x | x ≤ a} = (−∞, a];
krajišče a je v [a, ∞) in (−∞, a], ni pa v (a, ∞) in (−∞, a). -/
theorem intervali (a : ℝ) : {x : ℝ | x > a} = Ioi a ∧ {x : ℝ | x ≥ a} = Ici a ∧ {x : ℝ | x < a} = Iio a ∧
    {x : ℝ | x ≤ a} = Iic a ∧ a ∉ Ioi a ∧ a ∈ Ici a ∧ a ∉ Iio a ∧ a ∈ Iic a := by
  refine ⟨rfl, rfl, rfl, rfl, lt_irrefl a, le_refl a, lt_irrefl a, le_refl a⟩

/-- Razlaga 4 (hitro preveri), Ustno vprašanje 2, Ponovitev: x ≤ 7 je (−∞, 7]; x ≤ 3 je (−∞, 3], x > 3 je
(3, ∞); x > 4 je (4, ∞), x ≤ 4 je (−∞, 4]. -/
theorem intervali_primeri : {x : ℝ | x ≤ 7} = Iic 7 ∧ {x : ℝ | x ≤ 3} = Iic 3 ∧ {x : ℝ | x > 3} = Ioi 3 ∧
    {x : ℝ | x > 4} = Ioi 4 ∧ {x : ℝ | x ≤ 4} = Iic 4 := ⟨rfl, rfl, rfl, rfl, rfl⟩

/-- Pogoste napake 3: rešitev x > 4 ni (−∞, 4), ampak (4, ∞). -/
theorem napacna_smer : Ioi (4 : ℝ) ≠ Iio 4 := by
  intro h
  have : (5 : ℝ) ∈ Ioi 4 := by norm_num
  rw [h] at this; norm_num at this

/-- Razlaga 5: 0·x < 5 velja za vsak x (rešitev ℝ), 0·x > 5 za noben x. -/
theorem razlaga5 : {x : ℝ | 0 * x < 5} = univ ∧ {x : ℝ | 0 * x > 5} = ∅ := by
  constructor
  · ext x; simp
  · ext x; simp

/-- Razlaga 5, Premisli: 2x + 1 < 2x − 3 nima rešitve; leva stran je vedno za 4 večja. -/
theorem premisli_brez (x : ℝ) : (2 * x + 1) - (2 * x - 3) = 4 ∧ ¬ (2 * x + 1 < 2 * x - 3) := by
  refine ⟨by ring, fun h => ?_⟩
  linarith

/-- Ustno vprašanje 3, RACUN: x + 2 < x nima rešitve (2 < 0), x + 2 > x reši vsako realno število (2 > 0). -/
theorem ustno3 : {x : ℝ | x + 2 < x} = ∅ ∧ {x : ℝ | x + 2 > x} = univ := by
  constructor
  · ext x; simp only [mem_ofPred_eq, mem_empty_iff_false, iff_false, not_lt]; linarith
  · ext x; simp only [mem_ofPred_eq, mem_univ, iff_true]; linarith

/-! ## Rešeni primeri -/

/-- Primer 1: 2x + 3 < 11 ⇔ 2x < 8 ⇔ x < 4, množica rešitev je (−∞, 4). -/
theorem primer1 : (∀ x : ℝ, 2 * x + 3 < 11 ↔ x < 4) ∧ {x : ℝ | 2 * x + 3 < 11} = Iio 4 := by
  have h : ∀ x : ℝ, 2 * x + 3 < 11 ↔ x < 4 := fun x => by
    calc 2 * x + 3 < 11 ↔ 2 * x < 8 := lt_of_sub (by ring)
      _ ↔ x < 4 := lt_of_mul (k := 1 / 2) (by norm_num) (by ring)
  exact ⟨h, Set.ext h⟩

/-- Primer 1, preizkus: x = 0 da 3 < 11, x = 4 da 11 < 11, kar ne drži. -/
theorem primer1_preizkus : (2 * 0 + 3 : ℝ) < 11 ∧ ¬ (2 * 4 + 3 : ℝ) < 11 := by norm_num

/-- Primer 2: 5 − 3x ≤ 14 ⇔ −3x ≤ 9 ⇔ x ≥ −3, množica rešitev je [−3, ∞). -/
theorem primer2 : (∀ x : ℝ, 5 - 3 * x ≤ 14 ↔ x ≥ -3) ∧ {x : ℝ | 5 - 3 * x ≤ 14} = Ici (-3) := by
  have h : ∀ x : ℝ, 5 - 3 * x ≤ 14 ↔ x ≥ -3 := fun x => by
    calc 5 - 3 * x ≤ 14 ↔ -3 * x ≤ 9 := le_of_sub (by ring)
      _ ↔ x ≥ -3 := le_of_mul_neg (k := -1 / 3) (by norm_num) (by ring)
  exact ⟨h, Set.ext h⟩

/-- Primer 2, preizkus: x = −3 da 5 + 9 = 14 ≤ 14, x = 0 da 5 ≤ 14, x = −4 da 17 ≤ 14, kar ne drži. -/
theorem primer2_preizkus : (5 - 3 * (-3) : ℝ) = 5 + 9 ∧ (5 + 9 : ℝ) ≤ 14 ∧ (5 - 3 * 0 : ℝ) ≤ 14 ∧
    (5 - 3 * (-4) : ℝ) = 17 ∧ ¬ (17 : ℝ) ≤ 14 := by norm_num

/-- Primer 3: 6 + 4,5x ≤ 33 ⇔ 4,5x ≤ 27 ⇔ x ≤ 6; z x ≥ 0 je rešitev [0, 6]; med celimi števili letev je največ 6
(račun pri 6 letvah je 33 €, pri 7 pa 37,5 €). -/
theorem primer3 : (∀ x : ℝ, 6 + 4.5 * x ≤ 33 ↔ x ≤ 6) ∧ {x : ℝ | 0 ≤ x ∧ 6 + 4.5 * x ≤ 33} = Icc 0 6 ∧
    IsGreatest {n : ℕ | (6 : ℝ) + 4.5 * n ≤ 33} 6 ∧ (6 + 4.5 * 6 : ℝ) = 33 ∧ (6 + 4.5 * 7 : ℝ) = 37.5 := by
  have h : ∀ x : ℝ, 6 + 4.5 * x ≤ 33 ↔ x ≤ 6 := fun x => by
    calc 6 + 4.5 * x ≤ 33 ↔ 4.5 * x ≤ 27 := by constructor <;> intro h <;> norm_num at h ⊢ <;> linarith
      _ ↔ x ≤ 6 := by constructor <;> intro h <;> norm_num at h ⊢ <;> linarith
  refine ⟨h, ?_, ⟨by norm_num, fun n hn => ?_⟩, by norm_num, by norm_num⟩
  · ext x; simp only [mem_ofPred_eq, mem_Icc, h]
  · have : (n : ℝ) ≤ 6 := (h n).mp hn
    exact_mod_cast this

/-- Primer 4: 3(x − 2) ≥ 5x + 4 ⇔ 3x − 6 ≥ 5x + 4 ⇔ 3x − 5x ≥ 4 + 6 ⇔ −2x ≥ 10 ⇔ x ≤ −5, rešitev (−∞, −5]. -/
theorem primer4 : (∀ x : ℝ, 3 * (x - 2) ≥ 5 * x + 4 ↔ x ≤ -5) ∧ {x : ℝ | 3 * (x - 2) ≥ 5 * x + 4} = Iic (-5) := by
  have h : ∀ x : ℝ, 3 * (x - 2) ≥ 5 * x + 4 ↔ x ≤ -5 := fun x => by
    calc 3 * (x - 2) ≥ 5 * x + 4 ↔ 3 * x - 6 ≥ 5 * x + 4 := le_of_sub (by ring)
      _ ↔ 3 * x - 5 * x ≥ 4 + 6 := le_of_sub (by ring)
      _ ↔ -2 * x ≥ 10 := le_of_sub (by ring)
      _ ↔ x ≤ -5 := le_of_mul_neg (k := -1 / 2) (by norm_num) (by ring)
  exact ⟨h, Set.ext h⟩

/-- Primer 4, preizkus: pri x = −5 sta obe strani −21. -/
theorem primer4_preizkus : (3 * (-5 - 2) : ℝ) = -21 ∧ (5 * (-5) + 4 : ℝ) = -21 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1, Ponovitev: −2x < 6 ⇔ x > −3 (ne x < −3: x = −4 izpolni x < −3, ni pa rešitev). -/
theorem napaka_obrnitev : (∀ x : ℝ, -2 * x < 6 ↔ x > -3) ∧ (-4 : ℝ) < -3 ∧ ¬ (-2 * (-4) : ℝ) < 6 := by
  refine ⟨fun x => lt_of_mul_neg (k := -1 / 2) (by norm_num) (by ring), by norm_num, by norm_num⟩

/-- Pogoste napake 5: pri celih kosih iz x ≤ 10,5 sledi največ 10, ne 11 (11 > 10,5). -/
theorem napaka_zaokrozevanje : IsGreatest {n : ℕ | (n : ℝ) ≤ 10.5} 10 ∧ ¬ ((11 : ℕ) : ℝ) ≤ 10.5 := by
  refine ⟨⟨by norm_num, fun n hn => ?_⟩, by norm_num⟩
  have h : (n : ℝ) < 11 := by simp only [mem_ofPred_eq] at hn; linarith
  exact Nat.lt_succ_iff.mp (by exact_mod_cast h)

/-! ## Za maturo -/

/-- Naloga 1: (x − 1)/3 − (x + 2)/2 ≥ x/6 − 1 ⇔ 2(x − 1) − 3(x + 2) ≥ x − 6 ⇔ 2x − 2 − 3x − 6 ≥ x − 6
⇔ −x − 8 ≥ x − 6 ⇔ −2x ≥ 2 ⇔ x ≤ −1; rešitev (−∞, −1]. -/
theorem naloga1 : (∀ x : ℝ, (x - 1) / 3 - (x + 2) / 2 ≥ x / 6 - 1 ↔ x ≤ -1) ∧
    {x : ℝ | (x - 1) / 3 - (x + 2) / 2 ≥ x / 6 - 1} = Iic (-1) := by
  have h : ∀ x : ℝ, (x - 1) / 3 - (x + 2) / 2 ≥ x / 6 - 1 ↔ x ≤ -1 := fun x => by
    calc (x - 1) / 3 - (x + 2) / 2 ≥ x / 6 - 1 ↔ 2 * (x - 1) - 3 * (x + 2) ≥ x - 6 :=
          le_of_mul (k := 6) (by norm_num) (by ring)
      _ ↔ 2 * x - 2 - 3 * x - 6 ≥ x - 6 := le_of_sub (by ring)
      _ ↔ -x - 8 ≥ x - 6 := le_of_sub (by ring)
      _ ↔ -2 * x ≥ 2 := le_of_sub (by ring)
      _ ↔ x ≤ -1 := le_of_mul_neg (k := -1 / 2) (by norm_num) (by ring)
  exact ⟨h, Set.ext h⟩

/-- Naloga 1, preizkus: pri x = −1 sta strani −2/3 − 1/2 = −7/6 in −1/6 − 1 = −7/6; pri x = 0 je leva stran
−1/3 − 1 = −4/3, kar ni ≥ −1. -/
theorem naloga1_preizkus : ((-1 - 1) / 3 - (-1 + 2) / 2 : ℝ) = -2 / 3 - 1 / 2 ∧ (-2 / 3 - 1 / 2 : ℝ) = -7 / 6 ∧
    ((-1) / 6 - 1 : ℝ) = -7 / 6 ∧ ((0 - 1) / 3 - (0 + 2) / 2 : ℝ) = -1 / 3 - 1 ∧ (-1 / 3 - 1 : ℝ) = -4 / 3 ∧
    ¬ (-4 / 3 : ℝ) ≥ 0 / 6 - 1 := by norm_num

/-- Naloga 2 a): dobiček 11,70x − (1350 + 4,20x) = 11,70x − 4,20x − 1350 = 7,50x − 1350. -/
theorem naloga2a (x : ℝ) : 11.70 * x - (1350 + 4.20 * x) = 11.70 * x - 4.20 * x - 1350 ∧
    11.70 * x - 4.20 * x - 1350 = 7.50 * x - 1350 := by
  constructor
  · ring
  · norm_num; ring

/-- Naloga 2 b): 7,50x − 1350 > 0 ⇔ 7,50x > 1350 ⇔ x > 180; pri 180 majicah je dobiček 0, najmanjše celo število
majic s pozitivnim dobičkom je 181. -/
theorem naloga2b : (∀ x : ℝ, 7.50 * x - 1350 > 0 ↔ 7.50 * x > 1350) ∧ (∀ x : ℝ, 7.50 * x > 1350 ↔ x > 180) ∧
    (7.50 * 180 - 1350 : ℝ) = 0 ∧ IsLeast {n : ℕ | (7.50 : ℝ) * n - 1350 > 0} 181 := by
  have h2 : ∀ x : ℝ, 7.50 * x > 1350 ↔ x > 180 := fun x => by
    constructor <;> intro h <;> norm_num at h ⊢ <;> linarith
  refine ⟨fun x => lt_of_sub (by ring), h2, by norm_num, ⟨by norm_num, fun n hn => ?_⟩⟩
  have : (180 : ℝ) < n := (h2 n).mp (by simp only [mem_ofPred_eq] at hn; linarith)
  have : 180 < n := by exact_mod_cast this
  omega

/-- Naloga 2 c): 0,2·11,70x = 2,34x; 7,50x − 1350 ≥ 2,34x ⇔ 5,16x ≥ 1350 ⇔ x ≥ 1350/5,16 = 11250/43
(= 261,627…, |1350/5,16 − 261,63| < 0,005); najmanjše celo število majic je 262; preizkus: pri 262 je dobiček
615 € ≥ 613,08 €, pri 261 je 607,50 € < 610,74 €. -/
theorem naloga2c : (∀ x : ℝ, 0.2 * (11.70 * x) = 2.34 * x) ∧
    (∀ x : ℝ, 7.50 * x - 1350 ≥ 2.34 * x ↔ 5.16 * x ≥ 1350) ∧ (∀ x : ℝ, 5.16 * x ≥ 1350 ↔ x ≥ 1350 / 5.16) ∧
    (1350 / 5.16 : ℝ) = 11250 / 43 ∧ |(1350 / 5.16 : ℝ) - 261.63| < 0.005 ∧
    IsLeast {n : ℕ | (7.50 : ℝ) * n - 1350 ≥ 2.34 * n} 262 ∧ (7.50 * 262 - 1350 : ℝ) = 615 ∧
    (2.34 * 262 : ℝ) = 613.08 ∧ (7.50 * 261 - 1350 : ℝ) = 607.5 ∧ (2.34 * 261 : ℝ) = 610.74 := by
  have h2 : ∀ x : ℝ, 7.50 * x - 1350 ≥ 2.34 * x ↔ 5.16 * x ≥ 1350 := fun x => by
    constructor <;> intro h <;> norm_num at h ⊢ <;> linarith
  refine ⟨fun x => by norm_num; ring, h2, fun x => ?_, by norm_num, ?_, ⟨by norm_num, fun n hn => ?_⟩,
    by norm_num, by norm_num, by norm_num, by norm_num⟩
  · rw [ge_iff_le, ge_iff_le, div_le_iff₀ (by norm_num), mul_comm]
  · rw [abs_lt]; constructor <;> norm_num
  · have h3 : (5.16 : ℝ) * n ≥ 1350 := (h2 n).mp hn
    have : (261 : ℝ) < n := by norm_num at h3; linarith
    have : 261 < n := by exact_mod_cast this
    omega

/-- Naloga 3: funkciji f(x) = (x + 7)/2 in g(x) = (4x − 2)/3. -/
noncomputable def f (x : ℝ) : ℝ := (x + 7) / 2

/-- Naloga 3: funkcija g(x) = (4x − 2)/3. -/
noncomputable def g (x : ℝ) : ℝ := (4 * x - 2) / 3

/-- Naloga 3 a): f(x) ≥ g(x) ⇔ 3(x + 7) ≥ 2(4x − 2) ⇔ 3x + 21 ≥ 8x − 4 ⇔ −5x ≥ −25 ⇔ x ≤ 5; rešitev (−∞, 5]. -/
theorem naloga3a : (∀ x, f x ≥ g x ↔ x ≤ 5) ∧ {x | f x ≥ g x} = Iic 5 := by
  have h : ∀ x, f x ≥ g x ↔ x ≤ 5 := fun x => by
    unfold f g
    calc (x + 7) / 2 ≥ (4 * x - 2) / 3 ↔ 3 * (x + 7) ≥ 2 * (4 * x - 2) := le_of_mul (k := 6) (by norm_num) (by ring)
      _ ↔ 3 * x + 21 ≥ 8 * x - 4 := le_of_sub (by ring)
      _ ↔ -5 * x ≥ -25 := le_of_sub (by ring)
      _ ↔ x ≤ 5 := le_of_mul_neg (k := -1 / 5) (by norm_num) (by ring)
  exact ⟨h, Set.ext h⟩

/-- Naloga 3 b): f(5) = g(5) = 6 (presečišče (5, 6)); levo od 5 je graf f nad grafom g, desno pod njim. -/
theorem naloga3b : f 5 = 6 ∧ g 5 = 6 ∧ (∀ x, x < 5 → g x < f x) ∧ (∀ x, 5 < x → f x < g x) := by
  unfold f g
  refine ⟨by norm_num, by norm_num, fun x hx => ?_, fun x hx => ?_⟩ <;>
    · rw [div_lt_div_iff₀ (by norm_num) (by norm_num)]; linarith

/-- Naloga 3 c): f(x) > 0 ⇔ x > −7, g(x) > 0 ⇔ x > 1/2, obe vrednosti pozitivni ⇔ x > 1/2, tj. (1/2, ∞). -/
theorem naloga3c : (∀ x, f x > 0 ↔ x > -7) ∧ (∀ x, g x > 0 ↔ x > 1 / 2) ∧ {x | f x > 0 ∧ g x > 0} = Ioi (1 / 2) := by
  have hf : ∀ x, f x > 0 ↔ x > -7 := fun x => by
    unfold f; rw [gt_iff_lt, div_pos_iff_of_pos_right two_pos]; constructor <;> intro h <;> linarith
  have hg : ∀ x, g x > 0 ↔ x > 1 / 2 := fun x => by
    unfold g; rw [gt_iff_lt, div_pos_iff_of_pos_right (by norm_num)]; constructor <;> intro h <;> linarith
  refine ⟨hf, hg, ?_⟩
  ext x
  simp only [mem_ofPred_eq, mem_Ioi, hf, hg]
  constructor
  · exact fun h => h.2
  · intro h; exact ⟨by linarith, h⟩

/-- Naloga 3 d): pogoja iz a) in c) hkrati izpolnjujejo natanko x ∈ (1/2, 5]. -/
theorem naloga3d : {x | f x ≥ g x ∧ f x > 0 ∧ g x > 0} = Ioc (1 / 2) 5 := by
  ext x
  simp only [mem_ofPred_eq, mem_Ioc, naloga3a.1, naloga3c.1, naloga3c.2.1]
  constructor
  · rintro ⟨h1, _, h3⟩; exact ⟨h3, h1⟩
  · rintro ⟨h1, h2⟩; exact ⟨h2, by linarith, h1⟩

/-- Naloga 3 e): f(x) ≥ g(x) + p ⇔ 3x + 21 ≥ 8x − 4 + 6p ⇔ −5x ≥ 6p − 25 ⇔ x ≤ (25 − 6p)/5. -/
theorem naloga3e_resitev (p x : ℝ) : f x ≥ g x + p ↔ x ≤ (25 - 6 * p) / 5 := by
  unfold f g
  calc (x + 7) / 2 ≥ (4 * x - 2) / 3 + p ↔ 3 * x + 21 ≥ 8 * x - 4 + 6 * p :=
        le_of_mul (k := 6) (by norm_num) (by ring)
    _ ↔ -5 * x ≥ 6 * p - 25 := le_of_sub (by ring)
    _ ↔ x ≤ (25 - 6 * p) / 5 := by rw [le_div_iff₀ (by norm_num)]; constructor <;> intro h <;> linarith

/-- Naloga 3 e): množica rešitev f(x) ≥ g(x) + p je (−∞, 2] natanko pri p = 5/2 ((25 − 6p)/5 = 2 ⇔ 25 − 6p = 10
⇔ p = 5/2); preizkus f(2) = 9/2 = 2 + 5/2 = g(2) + 5/2. -/
theorem naloga3e (p : ℝ) : ({x | f x ≥ g x + p} = Iic 2 ↔ p = 5 / 2) ∧
    ((25 - 6 * p) / 5 = 2 ↔ 25 - 6 * p = 10) ∧ (25 - 6 * p = 10 ↔ p = 5 / 2) ∧
    f 2 = 9 / 2 ∧ g 2 + 5 / 2 = 2 + 5 / 2 ∧ (2 + 5 / 2 : ℝ) = 9 / 2 := by
  have hs : {x | f x ≥ g x + p} = Iic ((25 - 6 * p) / 5) := Set.ext fun x => naloga3e_resitev p x
  have e1 : (25 - 6 * p) / 5 = 2 ↔ 25 - 6 * p = 10 := by rw [div_eq_iff (by norm_num)]; norm_num
  have e2 : 25 - 6 * p = 10 ↔ p = 5 / 2 := by constructor <;> intro h <;> linarith
  refine ⟨?_, e1, e2, by unfold f; norm_num, by unfold g; norm_num, by norm_num⟩
  rw [hs, Iic_inj, e1, e2]

/-! ## Drugače -/

/-- Na sliki: 2x + 3 je naraščajoča, 5 − 3x padajoča; graf y = 2x + 3 seka y = 11 pri x = 4 (2·4 + 3 = 11). -/
theorem na_sliki : StrictMono (fun x : ℝ => 2 * x + 3) ∧ StrictAnti (fun x : ℝ => 5 - 3 * x) ∧
    (2 * 4 + 3 : ℝ) = 11 ∧ (5 - 3 * (-3) : ℝ) = 14 := by
  refine ⟨fun a b h => by simp only; linarith, fun a b h => by simp only; linarith, by norm_num, by norm_num⟩

/-- Iz vsakdanjega življenja: 70 + 45x ≤ 600 ⇔ 45x ≤ 530 ⇔ x ≤ 530/45 (11,77 < 530/45 < 11,78, torej 11,77…); največ 11 škatel
(565 ≤ 600, 610 > 600). -/
theorem dvigalo : (∀ x : ℝ, 70 + 45 * x ≤ 600 ↔ 45 * x ≤ 530) ∧ (∀ x : ℝ, 45 * x ≤ 530 ↔ x ≤ 530 / 45) ∧
    (11.77 : ℝ) < 530 / 45 ∧ (530 / 45 : ℝ) < 11.78 ∧ IsGreatest {n : ℕ | (70 : ℝ) + 45 * n ≤ 600} 11 ∧
    (70 + 45 * 11 : ℝ) = 565 ∧ (70 + 45 * 12 : ℝ) = 610 ∧ (610 : ℝ) > 600 := by
  refine ⟨fun x => le_of_sub (by ring), fun x => by rw [le_div_iff₀ (by norm_num), mul_comm], by norm_num,
    by norm_num, ⟨by norm_num, fun n hn => ?_⟩, by norm_num, by norm_num, by norm_num⟩
  have h : (n : ℝ) < 12 := by simp only [mem_ofPred_eq] at hn; linarith
  have : n < 12 := by exact_mod_cast h
  omega

/-- Korak za korakom: 4 − 2x > 10 ⇔ −2x > 6 ⇔ x < −3, rešitev (−∞, −3); x = −5 da 14 > 10, x = −3 da 10 (ni > 10),
x = 0 da 4. -/
theorem korak : (∀ x : ℝ, 4 - 2 * x > 10 ↔ x < -3) ∧ {x : ℝ | 4 - 2 * x > 10} = Iio (-3) ∧
    (4 - 2 * (-5) : ℝ) = 14 ∧ (14 : ℝ) > 10 ∧ (4 - 2 * (-3) : ℝ) = 10 ∧ ¬ (10 : ℝ) > 10 ∧ (4 - 2 * 0 : ℝ) = 4 ∧
    ¬ (4 : ℝ) > 10 := by
  have h : ∀ x : ℝ, 4 - 2 * x > 10 ↔ x < -3 := fun x => by
    calc 4 - 2 * x > 10 ↔ -2 * x > 6 := lt_of_sub (by ring)
      _ ↔ x < -3 := lt_of_mul_neg (k := -1 / 2) (by norm_num) (by ring)
  exact ⟨h, Set.ext h, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-! ## Preveri se -/

/-- Preveri se 1: rešitve x ≤ 2 so (−∞, 2], krajišče 2 je rešitev, števila desno od 2 niso. -/
theorem preveri1 : {x : ℝ | x ≤ 2} = Iic 2 ∧ (2 : ℝ) ∈ Iic 2 ∧ (3 : ℝ) ∉ Iic 2 := by
  refine ⟨rfl, by norm_num, by norm_num⟩

/-- Preveri se 2: −4x < 12 ⇔ x > −3; x = 0 je rešitev (0 < 12). -/
theorem preveri2 : (∀ x : ℝ, -4 * x < 12 ↔ x > -3) ∧ (-4 * 0 : ℝ) < 12 :=
  ⟨fun x => lt_of_mul_neg (k := -1 / 4) (by norm_num) (by ring), by norm_num⟩

/-- Preveri se 3: 7 − x > 2 ⇔ x < 5 (rešitev (−∞, 5)); 7 − x < 2 ⇔ x > 5; 7 − x ≥ 2 ⇔ x ≤ 5. -/
theorem preveri3 : {x : ℝ | 7 - x > 2} = Iio 5 ∧ {x : ℝ | 7 - x < 2} = Ioi 5 ∧ {x : ℝ | 7 - x ≥ 2} = Iic 5 := by
  refine ⟨Set.ext fun x => ?_, Set.ext fun x => ?_, Set.ext fun x => ?_⟩
  · calc 7 - x > 2 ↔ -x > -5 := lt_of_sub (by ring)
      _ ↔ x < 5 := lt_of_mul_neg (k := -1) (by norm_num) (by ring)
  · calc 7 - x < 2 ↔ -x < -5 := lt_of_sub (by ring)
      _ ↔ 5 < x := lt_of_mul_neg (k := -1) (by norm_num) (by ring)
  · calc 7 - x ≥ 2 ↔ -x ≥ -5 := le_of_sub (by ring)
      _ ↔ x ≤ 5 := le_of_mul_neg (k := -1) (by norm_num) (by ring)

/-- Preveri se 4, RACUN: 32x ≤ 250 ⇔ x ≤ 125/16 (= 7,8125); največ 7 celih kosov (224 ≤ 250, 256 > 250). -/
theorem preveri4 : (∀ x : ℝ, 32 * x ≤ 250 ↔ x ≤ 125 / 16) ∧ (125 / 16 : ℝ) = 7.8125 ∧
    IsGreatest {n : ℕ | (32 : ℝ) * n ≤ 250} 7 ∧ (7 * 32 : ℝ) = 224 ∧ (8 * 32 : ℝ) = 256 ∧ (256 : ℝ) > 250 := by
  refine ⟨fun x => le_of_mul (k := 1 / 32) (by norm_num) (by ring), by norm_num, ⟨by norm_num, fun n hn => ?_⟩,
    by norm_num, by norm_num, by norm_num⟩
  have h : (n : ℝ) < 8 := by simp only [mem_ofPred_eq] at hn; linarith
  have : n < 8 := by exact_mod_cast h
  omega

/-- Preveri se 5, RACUN: 0,3 + 0,2x ≤ 2,4 ⇔ 0,2x ≤ 2,1 ⇔ x ≤ 10,5; največ 10 vrst (pri 11 vrstah 2,5 m > 2,4 m);
2,4 : 0,2 = 12. -/
theorem preveri5 : (∀ x : ℝ, 0.3 + 0.2 * x ≤ 2.4 ↔ 0.2 * x ≤ 2.1) ∧ (∀ x : ℝ, 0.2 * x ≤ 2.1 ↔ x ≤ 10.5) ∧
    IsGreatest {n : ℕ | (0.3 : ℝ) + 0.2 * n ≤ 2.4} 10 ∧ (0.3 + 0.2 * 11 : ℝ) = 2.5 ∧ (2.5 : ℝ) > 2.4 ∧
    (2.4 / 0.2 : ℝ) = 12 := by
  have h1 : ∀ x : ℝ, 0.3 + 0.2 * x ≤ 2.4 ↔ 0.2 * x ≤ 2.1 := fun x => by
    constructor <;> intro h <;> norm_num at h ⊢ <;> linarith
  have h2 : ∀ x : ℝ, 0.2 * x ≤ 2.1 ↔ x ≤ 10.5 := fun x => by
    constructor <;> intro h <;> norm_num at h ⊢ <;> linarith
  refine ⟨h1, h2, ⟨by norm_num, fun n hn => ?_⟩, by norm_num, by norm_num, by norm_num⟩
  have h : (n : ℝ) ≤ 10.5 := (h2 n).mp ((h1 n).mp hn)
  have h' : (n : ℝ) < 11 := by norm_num at h; linarith
  have : n < 11 := by exact_mod_cast h'
  omega

/-! ## RACUN -/

/-- Blok RACUN: neenacba vrstice so v `naloga1`, `naloga2b`, `naloga2c`, `naloga3a`, `naloga3c`, `naloga3e`,
`ustno3`, `preveri4`, `preveri5`; −2x ≥ 2 ⇔ x ≤ −1; 15/2·x − 1350 ≥ 234/100·x ⇔ x ≥ 11250/43; vrednosti tu. -/
theorem racun : (∀ x : ℝ, -2 * x ≥ 2 ↔ x ≤ -1) ∧
    (∀ x : ℝ, 15 / 2 * x - 1350 ≥ 234 / 100 * x ↔ x ≥ 11250 / 43) ∧
    ((-1 - 1) / 3 - (-1 + 2) / 2 : ℝ) = -7 / 6 ∧ (-1 / 6 - 1 : ℝ) = -7 / 6 ∧
    (∀ x : ℝ, 11.7 * x - 4.2 * x - 1350 = 7.5 * x - 1350) ∧ ((5 + 7) / 2 : ℝ) = 6 ∧ ((4 * 5 - 2) / 3 : ℝ) = 6 ∧
    (∀ p : ℝ, (25 - 6 * p) / 5 = 2 ↔ p = 5 / 2) := by
  refine ⟨fun x => le_of_mul_neg (k := -1 / 2) (by norm_num) (by ring), fun x => ?_, by norm_num, by norm_num,
    fun x => by norm_num; ring, by norm_num, by norm_num, fun p => ?_⟩
  · show _ ↔ 11250 / 43 ≤ x; rw [div_le_iff₀ (by norm_num)]; constructor <;> intro h <;> linarith
  · rw [div_eq_iff (by norm_num)]; constructor <;> intro h <;> linarith

end Evklid.Lekcije.MAT_SS_1.LinearneNeenacbe
