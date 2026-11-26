/-
vir: content/lessons/MAT-SS-2/kompleksna-stevila.md
sha256: e5db3428fc72aece052de7504adec02448d70bd1b3494557376e03d995770bd4
Ni v Leanu: risbe in simulacija; zemljevid, smeri neba in »zasuk v levo« kot geometrijska slika (dokazano je
i · z = −b + ai z enako absolutno vrednostjo in potence iⁿ s periodo 4); pravilo paralelograma in »puščica
z₁ − z₂ je vzporedna daljici« kot geometrijski opis (dokazano je |z₁ − z₂| = razdalja točk in −z₂ = −c − di);
uporabe v elektrotehniki in obdelavi zvoka (opis; račun impedance |30 + 40i| = 50 je dokazan); oznaka j
namesto i (dogovor); »letalo potuje malo severno od vzhoda« (smer; dokazana je hitrost ≈ 401 km/h); da analogija
s √5 »neha veljati« (√5 je realno število med 2 in 3, i pa ni realno – oboje dokazano); napačni sklep
»√−1 · √−1 = √1« (v Leanu je √x = 0 za x < 0, zato je zapisan le izid: i · i = −1 ≠ 1); »zapis 3 + i < 2 + 5i nima
smisla« (dokazano je, da v ℂ ni pozitivnega dela, zaprtega za vsote, ki bi vseboval vse kvadrate neničelnih
števil, ne pa 0); točkovanje. Uporaba diskriminante (Naloga 2: √D = √−36 = 6i) je zapisana kot (6i)² = −36.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.KompleksnaStevila

open Complex ComplexConjugate

/-! ## Pomožno -/

/-- Pomožno: kompleksno število a + bi z realnima a in b. -/
theorem re_im (a b : ℝ) : ((a:ℂ) + b * I).re = a ∧ ((a:ℂ) + b * I).im = b := by simp

/-- Razlaga 6: |a + bi| = √(a² + b²) (Pitagorov izrek). -/
theorem abs_ab (a b : ℝ) : ‖(a:ℂ) + b * I‖ = √(a ^ 2 + b ^ 2) := norm_add_mul_I a b

/-! ## Razlaga 1: kompleksno število -/

/-- Razlaga 1: Re z = a, Im z = b (imaginarni del je realno število b, ne bi). -/
theorem re_in_im (a b : ℝ) : ((a:ℂ) + b * I).re = a ∧ ((a:ℂ) + b * I).im = b := re_im a b

/-- Razlaga 1: tabela – točke 3 + 4i, −2 − i, 5, 3i imajo koordinati (3, 4), (−2, −1), (5, 0), (0, 3). -/
theorem tabela_tock : ((3 + 4 * I : ℂ).re = 3 ∧ (3 + 4 * I : ℂ).im = 4) ∧ ((-2 - I : ℂ).re = -2 ∧ (-2 - I : ℂ).im = -1) ∧
    ((5 : ℂ).re = 5 ∧ (5 : ℂ).im = 0) ∧ ((3 * I : ℂ).re = 0 ∧ (3 * I : ℂ).im = 3) := by
  simp

/-- Razlaga 1: pri b = 0 je z = a realno število, R ⊂ C (vložitev je injektivna). -/
theorem realna_v_kompleksnih (a : ℝ) : (a:ℂ) + 0 * I = a ∧ Function.Injective ((↑) : ℝ → ℂ) :=
  ⟨by simp, ofReal_injective⟩

/-- Razlaga 1: enakost a + bi = c + di natanko tedaj, ko a = c in b = d. -/
theorem enakost (a b c d : ℝ) : (a:ℂ) + b * I = c + d * I ↔ a = c ∧ b = d := by
  rw [Complex.ext_iff]; simp

/-! ## Razlaga 2: imaginarna enota -/

/-- Razlaga 2: 1 · i = i, i · i = i² = −1. -/
theorem i_kvadrat : (1:ℂ) * I = I ∧ I * I = -1 ∧ I ^ 2 = -1 := ⟨one_mul I, I_mul_I, I_sq⟩

/-- Razlaga 2: i ni realno število (kvadrat realnega števila je nenegativen, i² = −1). -/
theorem i_ni_realno : (∀ r : ℝ, (r:ℂ) ≠ I) ∧ ¬ ∃ r : ℝ, r ^ 2 = -1 := by
  refine ⟨fun r h => by have := congrArg Complex.im h; simp at this, fun ⟨r, hr⟩ => ?_⟩
  nlinarith [sq_nonneg r]

/-- Razlaga 2 in Ustno vprašanje 2: i³ = −i, i⁴ = 1; za n = 4k + r je iⁿ = (i⁴)ᵏ · iʳ = iʳ (perioda 4);
tabela ostankov 0, 1, 2, 3 → 1, i, −1, −i. -/
theorem potence_i (k r : ℕ) : I ^ 3 = -I ∧ I ^ 4 = 1 ∧ I ^ (4 * k + r) = (I ^ 4) ^ k * I ^ r ∧
    I ^ (4 * k + r) = I ^ r ∧ (∀ n : ℕ, I ^ n = I ^ (n % 4)) ∧
    (I ^ 0 = 1 ∧ I ^ 1 = I ∧ I ^ 2 = -1 ∧ I ^ 3 = -I) := by
  have h4 : I ^ (4 * k + r) = (I ^ 4) ^ k * I ^ r := by rw [pow_add, pow_mul]
  refine ⟨I_pow_three, I_pow_four, h4, by rw [h4, I_pow_four, one_pow, one_mul], fun n => ?_,
    ⟨pow_zero I, pow_one I, I_sq, I_pow_three⟩⟩
  conv_lhs => rw [← Nat.div_add_mod n 4, pow_add, pow_mul, I_pow_four, one_pow, one_mul]

/-- Premisli: 27 = 6 · 4 + 3, i²⁷ = i²⁴ · i³ = 1 · (−i) = −i. -/
theorem i27 : 27 = 6 * 4 + 3 ∧ I ^ 27 = I ^ 24 * I ^ 3 ∧ I ^ 24 = 1 ∧ I ^ 27 = -I := by
  have h24 : I ^ 24 = 1 := by rw [show 24 = 4 * 6 by norm_num, pow_mul, I_pow_four, one_pow]
  refine ⟨by norm_num, by rw [← pow_add], h24, by rw [show 27 = 24 + 3 by norm_num, pow_add, h24, I_pow_three, one_mul]⟩

/-! ## Razlaga 3–4: seštevanje, odštevanje, množenje -/

/-- Razlaga 3: (a + bi) ± (c + di) = (a ± c) + (b ± d)i. -/
theorem sestevanje (a b c d : ℝ) : ((a:ℂ) + b * I) + (c + d * I) = (a + c : ℝ) + (b + d : ℝ) * I ∧
    ((a:ℂ) + b * I) - (c + d * I) = (a - c : ℝ) + (b - d : ℝ) * I := by
  constructor <;> push_cast <;> ring

/-- Razlaga 3: (3 + 4i) + (−1 + 2i) = 2 + 6i. -/
theorem premik_za_premikom : (3 + 4 * I) + (-1 + 2 * I) = (2 + 6 * I : ℂ) := by ring

/-- Razlaga 3 (grafično): z₁ − z₂ = z₁ + (−z₂), −(c + di) = −c − di (zrcaljenje čez izhodišče),
|z₁ − z₂| = √((a − c)² + (b − d)²) je razdalja med točkama. -/
theorem razlika (a b c d : ℝ) : ((a:ℂ) + b * I) - (c + d * I) = (a + b * I) + -(c + d * I) ∧
    -((c:ℂ) + d * I) = (-c : ℝ) + (-d : ℝ) * I ∧
    ‖((a:ℂ) + b * I) - (c + d * I)‖ = √((a - c) ^ 2 + (b - d) ^ 2) := by
  refine ⟨by ring, by push_cast; ring, ?_⟩
  rw [(sestevanje a b c d).2, abs_ab]

/-- Razlaga 4: (a + bi)(c + di) = (ac − bd) + (ad + bc)i. -/
theorem mnozenje (a b c d : ℝ) : ((a:ℂ) + b * I) * (c + d * I) = (a * c - b * d : ℝ) + (a * d + b * c : ℝ) * I := by
  push_cast; linear_combination (b * d : ℂ) * I_sq

/-- Razlaga 4: i(3 + 4i) = 3i + 4i² = −4 + 3i. -/
theorem i_krat_3_4i : I * (3 + 4 * I) = 3 * I + 4 * I ^ 2 ∧ 3 * I + 4 * I ^ 2 = (-4 + 3 * I : ℂ) :=
  ⟨by ring, by rw [I_sq]; ring⟩

/-- Razlaga 2, 4 in simulacija: množenje z i zasuka a + bi v −b + ai (za pravi kot v levo) in ohrani absolutno
vrednost. -/
theorem zasuk (a b : ℝ) : I * ((a:ℂ) + b * I) = (-b : ℝ) + a * I ∧ ‖I * ((a:ℂ) + b * I)‖ = ‖(a:ℂ) + b * I‖ := by
  refine ⟨by push_cast; linear_combination (b : ℂ) * I_sq, by rw [norm_mul, norm_I, one_mul]⟩

/-! ## Razlaga 5–7: konjugirano število, absolutna vrednost, deljenje -/

/-- Razlaga 5: z̄ = a − bi. -/
theorem konjugirano (a b : ℝ) : conj ((a:ℂ) + b * I) = a - b * I := by simp; ring

/-- Razlaga 5: 3 + 4i → 3 − 4i; conj(3 + 2i) = 3 − 2i, conj(−4i) = 4i, conj 5 = 5. -/
theorem konjugirano_primeri : conj (3 + 4 * I : ℂ) = 3 - 4 * I ∧ conj (3 + 2 * I : ℂ) = 3 - 2 * I ∧
    conj (-4 * I : ℂ) = 4 * I ∧ conj (5 : ℂ) = 5 := by
  refine ⟨?_, ?_, ?_, ?_⟩ <;> simp [map_add, map_mul, map_neg, conj_I, map_ofNat] <;> ring

/-- Razlaga 5: z + z̄ = 2a; z · z̄ = (a + bi)(a − bi) = a² − b²i² = a² + b² (realno, nenegativno). -/
theorem z_krat_konj (a b : ℝ) : ((a:ℂ) + b * I) + (a - b * I) = 2 * a ∧
    ((a:ℂ) + b * I) * (a - b * I) = a ^ 2 - b ^ 2 * I ^ 2 ∧ (a:ℂ) ^ 2 - b ^ 2 * I ^ 2 = (a ^ 2 + b ^ 2 : ℝ) ∧
    0 ≤ a ^ 2 + b ^ 2 :=
  ⟨by ring, by ring, by rw [I_sq]; push_cast; ring, by positivity⟩

/-- Razlaga 6: |3 − 4i| = √(9 + 16) = 5; |−7| = √49 = 7. -/
theorem abs_primeri : ‖(3 - 4 * I : ℂ)‖ = √(9 + 16) ∧ √((9:ℝ) + 16) = 5 ∧ ‖(-7 : ℂ)‖ = √49 ∧ √(49:ℝ) = 7 := by
  have e : (3 - 4 * I : ℂ) = ((3:ℝ):ℂ) + ((-4:ℝ):ℂ) * I := by push_cast; ring
  have e7 : (-7 : ℂ) = ((-7:ℝ):ℂ) + ((0:ℝ):ℂ) * I := by push_cast; ring
  refine ⟨by rw [e, abs_ab]; norm_num, by norm_num, by rw [e7, abs_ab]; norm_num, by norm_num⟩

/-- Razlaga 6: |z| = √(z · z̄) (z · z̄ = a² + b² je realno), |z̄| = |z|, |z₁z₂| = |z₁||z₂|, |z₁/z₂| = |z₁|/|z₂|. -/
theorem abs_lastnosti (z w : ℂ) (_hw : w ≠ 0) : z * conj z = (normSq z : ℂ) ∧ ‖z‖ = √(normSq z) ∧
    ‖conj z‖ = ‖z‖ ∧ ‖z * w‖ = ‖z‖ * ‖w‖ ∧ ‖z / w‖ = ‖z‖ / ‖w‖ :=
  ⟨mul_conj z, norm_def z, norm_conj z, norm_mul z w, norm_div z w⟩

example : (1 : ℂ) ≠ 0 := one_ne_zero

/-- Premisli: |3 + 4i| = 5, |3| + |4i| = 3 + 4 = 7, zato |3 + 4i| ≠ |3| + |4i|. -/
theorem premisli_abs : ‖(3 + 4 * I : ℂ)‖ = 5 ∧ ‖(3 : ℂ)‖ + ‖(4 * I : ℂ)‖ = 7 ∧
    ‖(3 + 4 * I : ℂ)‖ ≠ ‖(3 : ℂ)‖ + ‖(4 * I : ℂ)‖ := by
  have h5 : ‖(3 + 4 * I : ℂ)‖ = 5 := by
    rw [show (3 + 4 * I : ℂ) = ((3:ℝ):ℂ) + ((4:ℝ):ℂ) * I by push_cast; ring, abs_ab]; norm_num
  have h7 : ‖(3 : ℂ)‖ + ‖(4 * I : ℂ)‖ = 7 := by
    rw [norm_mul, norm_I]; norm_num
  exact ⟨h5, h7, by rw [h5, h7]; norm_num⟩

/-- Razlaga 7: (a + bi)/(c + di) = (a + bi)(c − di)/(c² + d²) za c + di ≠ 0. -/
theorem deljenje (a b c d : ℝ) (h : (c:ℂ) + d * I ≠ 0) :
    ((a:ℂ) + b * I) / (c + d * I) = (a + b * I) * (c - d * I) / (c ^ 2 + d ^ 2) := by
  have hcd : (c:ℂ) ^ 2 + d ^ 2 = (c + d * I) * (c - d * I) := by linear_combination (d ^ 2 : ℂ) * I_sq
  have hne : (c:ℂ) ^ 2 + d ^ 2 ≠ 0 := by
    rw [hcd]; refine mul_ne_zero h ?_
    intro h0; apply h
    have h1 := congrArg Complex.re h0; have h2 := congrArg Complex.im h0
    simp at h1 h2; apply Complex.ext <;> simp [h1, h2]
  rw [div_eq_div_iff h hne, hcd]; ring

example : ((1:ℝ):ℂ) + ((2:ℝ):ℂ) * I ≠ 0 := by
  intro h; have := congrArg Complex.re h; simp at this

/-- Razlaga 7 (obratna vrednost): 1/(a + bi) = (a − bi)/(a² + b²) za z ≠ 0. -/
theorem obratna (a b : ℝ) (h : (a:ℂ) + b * I ≠ 0) : 1 / ((a:ℂ) + b * I) = (a - b * I) / (a ^ 2 + b ^ 2) := by
  rw [show (1:ℂ) = (1:ℝ) + (0:ℝ) * I by simp, deljenje 1 0 a b h]; push_cast; ring

example : ((3:ℝ):ℂ) + ((4:ℝ):ℂ) * I ≠ 0 := by
  intro h; have := congrArg Complex.re h; simp at this

/-- Razlaga 7: 1/(3 + 4i) = (3 − 4i)/25 = 3/25 − 4/25 i; preizkus (3 + 4i)(3 − 4i) = 9 + 16 = 25; 1/i = −i
(i · (−i) = −i² = 1); 1/(3 + 4i) ≠ 1/3 + 1/4 i. -/
theorem obratna_primeri : 1 / (3 + 4 * I : ℂ) = (3 - 4 * I) / 25 ∧ (3 - 4 * I : ℂ) / 25 = 3 / 25 - 4 / 25 * I ∧
    (3 + 4 * I : ℂ) * (3 - 4 * I) = 9 + 16 ∧ (1 : ℂ) / I = -I ∧ I * -I = -I ^ 2 ∧ -I ^ 2 = 1 ∧
    1 / (3 + 4 * I : ℂ) ≠ 1 / 3 + 1 / 4 * I := by
  have hne : (3 + 4 * I : ℂ) ≠ 0 := by intro h; have := congrArg Complex.re h; simp at this
  have e : 1 / (3 + 4 * I : ℂ) = (3 - 4 * I) / 25 := by
    rw [div_eq_div_iff hne (by norm_num)]; linear_combination (16 : ℂ) * I_sq
  refine ⟨e, by ring, by linear_combination (-16 : ℂ) * I_sq, by rw [one_div, inv_I], by ring, by rw [I_sq]; ring, ?_⟩
  rw [e]; intro h; have := congrArg Complex.re h; simp at this; norm_num at this

/-! ## Razlaga 8: kvadratne enačbe -/

/-- Razlaga 8: x² = −9 ima v C rešitvi ±3i, (3i)² = (−3i)² = 9i² = −9. -/
theorem x2_minus9 (x : ℂ) : (x ^ 2 = -9 ↔ x = 3 * I ∨ x = -(3 * I)) ∧ (3 * I) ^ 2 = 9 * I ^ 2 ∧
    (-(3 * I)) ^ 2 = 9 * I ^ 2 ∧ 9 * I ^ 2 = -9 := by
  have h9 : (3 * I) ^ 2 = (-9 : ℂ) := by rw [mul_pow, I_sq]; norm_num
  refine ⟨by rw [← h9, sq_eq_sq_iff_eq_or_eq_neg], by ring, by ring, by rw [I_sq]; ring⟩

/-- Razlaga 8: (x − 3)² = x² − 6x + 9, x² − 6x + 13 = (x − 3)² + 4; enačba je (x − 3)² = −4, rešitvi 3 ± 2i. -/
theorem kvadratna_primer (x : ℂ) : (x - 3) ^ 2 = x ^ 2 - 6 * x + 9 ∧ x ^ 2 - 6 * x + 13 = (x - 3) ^ 2 + 4 ∧
    (x ^ 2 - 6 * x + 13 = 0 ↔ (x - 3) ^ 2 = -4) ∧ (x ^ 2 - 6 * x + 13 = 0 ↔ x - 3 = 2 * I ∨ x - 3 = -(2 * I)) ∧
    (x ^ 2 - 6 * x + 13 = 0 ↔ x = 3 + 2 * I ∨ x = 3 - 2 * I) := by
  have h4 : (2 * I) ^ 2 = (-4 : ℂ) := by rw [mul_pow, I_sq]; norm_num
  have e1 : x ^ 2 - 6 * x + 13 = 0 ↔ (x - 3) ^ 2 = -4 :=
    ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩
  have e2 : x ^ 2 - 6 * x + 13 = 0 ↔ x - 3 = 2 * I ∨ x - 3 = -(2 * I) := by
    rw [e1, ← h4, sq_eq_sq_iff_eq_or_eq_neg]
  refine ⟨by ring, by ring, e1, e2, ?_⟩
  rw [e2]; constructor <;> rintro (h | h)
  · left; linear_combination h
  · right; linear_combination h
  · left; linear_combination h
  · right; linear_combination h

/-- Razlaga 8: rešitvi sta konjugirani; (3 + 2i) + (3 − 2i) = 6, (3 + 2i)(3 − 2i) = 9 + 4 = 13,
(x − 3 − 2i)(x − 3 + 2i) = x² − 6x + 13. -/
theorem konjugirani_resitvi (x : ℂ) : conj (3 + 2 * I : ℂ) = 3 - 2 * I ∧ (3 + 2 * I) + (3 - 2 * I : ℂ) = 6 ∧
    (3 + 2 * I : ℂ) * (3 - 2 * I) = 9 + 4 ∧ (9 + 4 : ℂ) = 13 ∧
    (x - 3 - 2 * I) * (x - 3 + 2 * I) = x ^ 2 - 6 * x + 13 := by
  refine ⟨?_, by ring, by linear_combination (-4 : ℂ) * I_sq, by norm_num, by linear_combination (-4 : ℂ) * I_sq⟩
  simp [map_add, map_mul, conj_I, map_ofNat]; ring

/-- Razlaga 8, Povzetek in Ustno vprašanje 3: kvadratna enačba x² + px + q = 0 z realnima p, q in
p² − 4q < 0 ima v C natanko dve rešitvi (−p ± i√(4q − p²))/2, ki sta konjugirani. -/
theorem kvadratna_splosno (p q : ℝ) (hD : p ^ 2 - 4 * q < 0) (x : ℂ) :
    (x ^ 2 + p * x + q = 0 ↔ x = (-p + √(4 * q - p ^ 2) * I) / 2 ∨ x = (-p - √(4 * q - p ^ 2) * I) / 2) ∧
    conj ((-p + √(4 * q - p ^ 2) * I) / 2 : ℂ) = (-p - √(4 * q - p ^ 2) * I) / 2 := by
  set s := √(4 * q - p ^ 2) with hs
  have hs2 : (s:ℂ) ^ 2 = 4 * q - p ^ 2 := by
    have : s ^ 2 = 4 * q - p ^ 2 := Real.sq_sqrt (by linarith)
    exact_mod_cast this
  have fac : x ^ 2 + p * x + q = (x - (-p + s * I) / 2) * (x - (-p - s * I) / 2) := by
    linear_combination (-1/4 : ℂ) * hs2 + ((s:ℂ) ^ 2 / 4) * I_sq
  refine ⟨by rw [fac, mul_eq_zero, sub_eq_zero, sub_eq_zero], ?_⟩
  simp [map_div₀, map_add, map_mul, conj_I, Complex.conj_ofReal, map_ofNat]; ring

example : (0:ℝ) ^ 2 - 4 * 1 < 0 := by norm_num

/-- Razlaga 8 in Povzetek (splošno, a ≠ 0): kvadratna enačba ax² + bx + c = 0 z realnimi koeficienti in
D = b² − 4ac < 0 ima v C natanko dve rešitvi (−b ± i√(4ac − b²))/(2a), ki sta konjugirani. -/
theorem kvadratna_splosno_a (a b c : ℝ) (ha : a ≠ 0) (hD : b ^ 2 - 4 * a * c < 0) (x : ℂ) :
    (a * x ^ 2 + b * x + c = 0 ↔
      x = (-b + √(4 * a * c - b ^ 2) * I) / (2 * a) ∨ x = (-b - √(4 * a * c - b ^ 2) * I) / (2 * a)) ∧
    conj ((-b + √(4 * a * c - b ^ 2) * I) / (2 * a) : ℂ) = (-b - √(4 * a * c - b ^ 2) * I) / (2 * a) := by
  set s := √(4 * a * c - b ^ 2) with hs
  have hs2 : (s:ℂ) ^ 2 = 4 * a * c - b ^ 2 := by
    have : s ^ 2 = 4 * a * c - b ^ 2 := Real.sq_sqrt (by linarith)
    exact_mod_cast this
  have ha' : (a:ℂ) ≠ 0 := Complex.ofReal_ne_zero.mpr ha
  have hd : discrim (a:ℂ) b c = (s * I) * (s * I) := by
    rw [discrim]; linear_combination (1 : ℂ) * hs2 + (-(s:ℂ) ^ 2) * I_sq
  refine ⟨by rw [sq]; exact quadratic_eq_zero_iff ha' hd x, ?_⟩
  simp [map_div₀, map_add, map_mul, conj_I, Complex.conj_ofReal, map_ofNat]; ring

example : (1:ℝ) ≠ 0 ∧ (0:ℝ) ^ 2 - 4 * 1 * 1 < 0 := by norm_num

/-- Ustno vprašanje 3: v C ima vsaka kvadratna enačba az² + bz + c = 0 z a ≠ 0 rešitev (tudi s kompleksnimi
koeficienti), ker je v C vsako število kvadrat (diskriminanta ima koren). -/
theorem vsaka_kvadratna (a b c : ℂ) (ha : a ≠ 0) : ∃ x : ℂ, a * x ^ 2 + b * x + c = 0 := by
  obtain ⟨x, hx⟩ := exists_quadratic_eq_zero ha (IsAlgClosed.isSquare (discrim a b c))
  exact ⟨x, by rw [sq]; exact hx⟩

example : (1 : ℂ) ≠ 0 := one_ne_zero

/-- Razlaga 8: kvadratna enačba ax² + bx + c = 0 z realnimi koeficienti (a ≠ 0) nima realne rešitve natanko
tedaj, ko je D = b² − 4ac < 0 (posebej x² + px + q: natanko tedaj, ko je p² − 4q < 0). -/
theorem brez_realne (a b c : ℝ) (ha : a ≠ 0) : (¬ ∃ x : ℝ, a * x ^ 2 + b * x + c = 0) ↔ b ^ 2 - 4 * a * c < 0 := by
  constructor
  · intro h
    by_contra hD
    replace hD := not_lt.mp hD
    have hd : discrim a b c = √(discrim a b c) * √(discrim a b c) := by
      rw [Real.mul_self_sqrt (by rw [discrim]; linarith)]
    obtain ⟨x, hx⟩ := exists_quadratic_eq_zero ha ⟨_, hd⟩
    exact h ⟨x, by rw [sq]; exact hx⟩
  · rintro hD ⟨x, hx⟩
    have := discrim_eq_sq_of_quadratic_eq_zero (show a * (x * x) + b * x + c = 0 by rw [← sq]; exact hx)
    rw [discrim] at this; nlinarith [sq_nonneg (2 * a * x + b)]

example : (1:ℝ) ≠ 0 := one_ne_zero

/-- Razlaga 8: x² + px + q = 0 nima realne rešitve natanko tedaj, ko je p² − 4q < 0. -/
theorem brez_realne_pq (p q : ℝ) : (¬ ∃ x : ℝ, x ^ 2 + p * x + q = 0) ↔ p ^ 2 - 4 * q < 0 := by
  have := brez_realne 1 p q one_ne_zero; simp only [one_mul, mul_one] at this; exact this

/-! ## Rešeni primeri -/

/-- Primer 1: z₁ + z₂ = (3 + 1) + (2 − 4)i = 4 − 2i; z₁ − z₂ = (3 − 1) + (2 + 4)i = 2 + 6i;
z₁z₂ = 3 − 12i + 2i − 8i² = 3 − 10i + 8 = 11 − 10i; grafično −z₂ = −1 + 4i in z₁ + (−z₂) = 2 + 6i. -/
theorem primer1 :
    (3 + 2 * I) + (1 - 4 * I) = ((3 + 1) + (2 - 4) * I : ℂ) ∧ ((3 + 1) + (2 - 4) * I : ℂ) = 4 - 2 * I ∧
    (3 + 2 * I) - (1 - 4 * I) = ((3 - 1) + (2 + 4) * I : ℂ) ∧ ((3 - 1) + (2 + 4) * I : ℂ) = 2 + 6 * I ∧
    (3 + 2 * I) * (1 - 4 * I) = (3 - 12 * I + 2 * I - 8 * I ^ 2 : ℂ) ∧
    (3 - 12 * I + 2 * I - 8 * I ^ 2 : ℂ) = 3 - 10 * I + 8 ∧ (3 - 10 * I + 8 : ℂ) = 11 - 10 * I ∧
    -(1 - 4 * I : ℂ) = -1 + 4 * I ∧ (3 + 2 * I) + (-1 + 4 * I) = (2 + 6 * I : ℂ) :=
  ⟨by ring, by ring, by ring, by ring, by ring, by rw [I_sq]; ring, by ring, by ring, by ring⟩

/-- Primer 2: imenovalec (2 + i)(2 − i) = 2² + 1² = 5; števec (1 + 8i)(2 − i) = 2 − i + 16i − 8i² = 2 + 15i + 8
= 10 + 15i; w = (10 + 15i)/5 = 2 + 3i; preverjanje (2 + 3i)(2 + i) = 4 + 2i + 6i + 3i² = 1 + 8i. -/
theorem primer2 :
    (2 + I) * (2 - I) = (2 ^ 2 + 1 ^ 2 : ℂ) ∧ (2 ^ 2 + 1 ^ 2 : ℂ) = 5 ∧
    (1 + 8 * I) * (2 - I) = (2 - I + 16 * I - 8 * I ^ 2 : ℂ) ∧ (2 - I + 16 * I - 8 * I ^ 2 : ℂ) = 2 + 15 * I + 8 ∧
    (2 + 15 * I + 8 : ℂ) = 10 + 15 * I ∧ (1 + 8 * I) / (2 + I) = ((10 + 15 * I) / 5 : ℂ) ∧
    ((10 + 15 * I) / 5 : ℂ) = 2 + 3 * I ∧
    (2 + 3 * I) * (2 + I) = (4 + 2 * I + 6 * I + 3 * I ^ 2 : ℂ) ∧ (4 + 2 * I + 6 * I + 3 * I ^ 2 : ℂ) = 1 + 8 * I := by
  have hne : (2 + I : ℂ) ≠ 0 := by intro h; have := congrArg Complex.re h; simp at this
  refine ⟨by linear_combination (-1 : ℂ) * I_sq, by norm_num, by ring, by rw [I_sq]; ring, by ring, ?_, by ring,
    by ring, by rw [I_sq]; ring⟩
  rw [div_eq_div_iff hne (by norm_num)]; linear_combination (-15 : ℂ) * I_sq

/-- Primer 2: |w| = √(2² + 3²) = √13 ≈ 3,61; drugače |1 + 8i|/|2 + i| = √65/√5 = √13. -/
theorem primer2_abs : ‖(2 + 3 * I : ℂ)‖ = √(2 ^ 2 + 3 ^ 2) ∧ √((2:ℝ) ^ 2 + 3 ^ 2) = √13 ∧
    3.605 < √(13:ℝ) ∧ √(13:ℝ) < 3.615 ∧ ‖(1 + 8 * I : ℂ)‖ / ‖(2 + I : ℂ)‖ = √65 / √5 ∧ √(65:ℝ) / √5 = √13 := by
  have e1 : (2 + 3 * I : ℂ) = ((2:ℝ):ℂ) + ((3:ℝ):ℂ) * I := by push_cast; ring
  have e2 : (1 + 8 * I : ℂ) = ((1:ℝ):ℂ) + ((8:ℝ):ℂ) * I := by push_cast; ring
  have e3 : (2 + I : ℂ) = ((2:ℝ):ℂ) + ((1:ℝ):ℂ) * I := by push_cast; ring
  refine ⟨by rw [e1, abs_ab], by norm_num, (Real.lt_sqrt (by norm_num)).mpr (by norm_num),
    (Real.sqrt_lt' (by norm_num)).mpr (by norm_num), by rw [e2, e3, abs_ab, abs_ab]; norm_num, ?_⟩
  rw [← Real.sqrt_div' _ (by norm_num)]; norm_num

/-- Primer 3: z₂ = i(3 + 4i) = 3i + 4i² = −4 + 3i; z = (3 + 4i) + (−4 + 3i) = −1 + 7i; |z| = √((−1)² + 7²) = √50
≈ 7,07; vsak premik je dolg |3 + 4i| = √(9 + 16) = 5, pot 5 + 5 = 10 km > √50. -/
theorem primer3 : I * (3 + 4 * I) = (3 * I + 4 * I ^ 2 : ℂ) ∧ (3 * I + 4 * I ^ 2 : ℂ) = -4 + 3 * I ∧
    (3 + 4 * I) + (-4 + 3 * I) = (-1 + 7 * I : ℂ) ∧ ‖(-1 + 7 * I : ℂ)‖ = √((-1) ^ 2 + 7 ^ 2) ∧
    √((-1:ℝ) ^ 2 + 7 ^ 2) = √50 ∧ 7.065 < √(50:ℝ) ∧ √(50:ℝ) < 7.075 ∧
    ‖(3 + 4 * I : ℂ)‖ = √(9 + 16) ∧ √((9:ℝ) + 16) = 5 ∧ ‖(-4 + 3 * I : ℂ)‖ = 5 ∧ (5:ℝ) + 5 = 10 ∧ √(50:ℝ) < 10 := by
  have e1 : (-1 + 7 * I : ℂ) = ((-1:ℝ):ℂ) + ((7:ℝ):ℂ) * I := by push_cast; ring
  have e2 : (3 + 4 * I : ℂ) = ((3:ℝ):ℂ) + ((4:ℝ):ℂ) * I := by push_cast; ring
  have e3 : (-4 + 3 * I : ℂ) = ((-4:ℝ):ℂ) + ((3:ℝ):ℂ) * I := by push_cast; ring
  have a : (7.065:ℝ) < √50 := (Real.lt_sqrt (by norm_num)).mpr (by norm_num)
  have b : √(50:ℝ) < 7.075 := (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)
  refine ⟨by ring, by rw [I_sq]; ring, by ring, by rw [e1, abs_ab], by norm_num, a, b, by rw [e2, abs_ab]; norm_num,
    by norm_num, by rw [e3, abs_ab]; norm_num, by norm_num, by linarith⟩

/-- Primer 4: za z = a + bi je (1 + i)(a + bi) = (a − b) + (a + b)i, 3z̄ = 3a − 3bi, leva stran
(4a − b) + (a − 2b)i; enačba (1 + i)z + 3z̄ = 10 − i ⇔ 4a − b = 10 in a − 2b = −1 ⇔ a = 3, b = 2. -/
theorem primer4 (a b : ℝ) :
    (1 + I) * ((a:ℂ) + b * I) = (a - b : ℝ) + (a + b : ℝ) * I ∧ 3 * conj ((a:ℂ) + b * I) = 3 * a - 3 * b * I ∧
    (1 + I) * ((a:ℂ) + b * I) + 3 * conj ((a:ℂ) + b * I) = (4 * a - b : ℝ) + (a - 2 * b : ℝ) * I ∧
    ((1 + I) * ((a:ℂ) + b * I) + 3 * conj ((a:ℂ) + b * I) = 10 - I ↔ 4 * a - b = 10 ∧ a - 2 * b = -1) ∧
    ((4 * a - b = 10 ∧ a - 2 * b = -1) ↔ a = 3 ∧ b = 2) := by
  have h1 : (1 + I) * ((a:ℂ) + b * I) = (a - b : ℝ) + (a + b : ℝ) * I := by
    push_cast; linear_combination (b : ℂ) * I_sq
  have h2 : 3 * conj ((a:ℂ) + b * I) = 3 * a - 3 * b * I := by simp; ring
  have h3 : (1 + I) * ((a:ℂ) + b * I) + 3 * conj ((a:ℂ) + b * I) = (4 * a - b : ℝ) + (a - 2 * b : ℝ) * I := by
    rw [h1, h2]; push_cast; ring
  refine ⟨h1, h2, h3, ?_, ⟨fun ⟨e1, e2⟩ => ⟨by linarith, by linarith⟩, fun ⟨e1, e2⟩ => ⟨by rw [e1, e2]; norm_num,
    by rw [e1, e2]; norm_num⟩⟩⟩
  rw [h3, show (10 - I : ℂ) = ((10:ℝ):ℂ) + ((-1:ℝ):ℂ) * I by push_cast; ring, enakost]

/-- Primer 4 (koraki): iz druge enačbe je a = 2b − 1; vstavimo v prvo: 4(2b − 1) − b = 10, torej 7b = 14 in
b = 2, nato a = 2 · 2 − 1 = 3. -/
theorem primer4_koraki (a b : ℝ) : (a - 2 * b = -1 ↔ a = 2 * b - 1) ∧ (4 * (2 * b - 1) - b = 10 ↔ 7 * b = 14) ∧
    (7 * b = 14 ↔ b = 2) ∧ (2:ℝ) * 2 - 1 = 3 :=
  ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num⟩

/-- Primer 4 (premisli): z = 3 + 2i, |z| = √(3² + 2²) = √13 ≈ 3,61; preizkus (1 + i)(3 + 2i) = 1 + 5i,
3(3 − 2i) = 9 − 6i, vsota 10 − i. -/
theorem primer4_resitev : ‖(3 + 2 * I : ℂ)‖ = √(3 ^ 2 + 2 ^ 2) ∧ √((3:ℝ) ^ 2 + 2 ^ 2) = √13 ∧
    (1 + I) * (3 + 2 * I) = (1 + 5 * I : ℂ) ∧ 3 * conj (3 + 2 * I : ℂ) = 9 - 6 * I ∧ (1 + 5 * I) + (9 - 6 * I) = (10 - I : ℂ) := by
  have e : (3 + 2 * I : ℂ) = ((3:ℝ):ℂ) + ((2:ℝ):ℂ) * I := by push_cast; ring
  refine ⟨by rw [e, abs_ab], by norm_num, by linear_combination (2 : ℂ) * I_sq, ?_, by ring⟩
  simp [map_add, map_mul, conj_I, map_ofNat]; ring

/-! ## Pogoste napake -/

/-- Pogoste napake: i² = −1 ≠ 1, zato −8i² = +8 in (3 + 2i)(1 − 4i) = 11 − 10i ≠ 3 − 10i − 8; Im(4 − 7i) = −7;
conj(3 + 2i) = 3 − 2i ≠ −3 − 2i (to je nasprotno število); |3 − 4i| = √(3² + (−4)²) = 5 ≠ −1; i · i = −1 ≠ 1. -/
theorem pogoste_napake : I ^ 2 ≠ (1 : ℂ) ∧ -8 * I ^ 2 = (8 : ℂ) ∧ (3 + 2 * I) * (1 - 4 * I) ≠ (3 - 10 * I - 8 : ℂ) ∧
    (4 - 7 * I : ℂ).im = -7 ∧ conj (3 + 2 * I : ℂ) ≠ -3 - 2 * I ∧ -(3 + 2 * I : ℂ) = -3 - 2 * I ∧
    ‖(3 - 4 * I : ℂ)‖ = √(3 ^ 2 + (-4) ^ 2) ∧ √((3:ℝ) ^ 2 + (-4) ^ 2) = 5 ∧ I * I ≠ (1 : ℂ) := by
  have hI : I ^ 2 ≠ (1 : ℂ) := by rw [I_sq]; intro h; have := congrArg Complex.re h; norm_num at this
  have e : (3 - 4 * I : ℂ) = ((3:ℝ):ℂ) + ((-4:ℝ):ℂ) * I := by push_cast; ring
  refine ⟨hI, by rw [I_sq]; ring, ?_, by simp, ?_, by ring, by rw [e, abs_ab], by norm_num,
    by rw [← sq]; exact hI⟩
  · intro h; have := congrArg Complex.re (show (3 + 2 * I) * (1 - 4 * I) = (3 - 10 * I - 8 : ℂ) from h)
    simp at this; norm_num at this
  · simp [map_add, map_mul, conj_I, map_ofNat]; intro h; have := congrArg Complex.re h; simp at this; norm_num at this

/-! ## Za maturo -/

/-- Naloga 1: 23 = 5 · 4 + 3, i²³ = (i⁴)⁵ · i³ = −i, z = 2 − i; 1/(2 − i) = (2 + i)/((2 − i)(2 + i)) = (2 + i)/5
= 2/5 + 1/5 i. -/
theorem matura1 : 23 = 5 * 4 + 3 ∧ I ^ 23 = (I ^ 4) ^ 5 * I ^ 3 ∧ I ^ 23 = -I ∧ 2 + I ^ 23 = (2 - I : ℂ) ∧
    (2 - I) * (2 + I) = (2 ^ 2 + 1 ^ 2 : ℂ) ∧ 1 / (2 - I : ℂ) = (2 + I) / 5 ∧ (2 + I : ℂ) / 5 = 2 / 5 + 1 / 5 * I := by
  have h23 : I ^ 23 = -I := by
    rw [show 23 = 4 * 5 + 3 by norm_num, pow_add, pow_mul, I_pow_four, one_pow, one_mul, I_pow_three]
  have hne : (2 - I : ℂ) ≠ 0 := by intro h; have := congrArg Complex.re h; simp at this
  refine ⟨by norm_num, by rw [← pow_mul, ← pow_add], h23, by rw [h23]; ring,
    by linear_combination (-1 : ℂ) * I_sq, ?_, by ring⟩
  rw [div_eq_div_iff hne (by norm_num)]; linear_combination (1 : ℂ) * I_sq

/-- Naloga 2 a): D = (−4)² − 4 · 1 · 13 = −36, (6i)² = −36; x² − 4x + 13 = 0 ⇔ x = (4 ± 6i)/2 = 2 ± 3i. -/
theorem matura2a (x : ℂ) : ((-4:ℝ) ^ 2 - 4 * 1 * 13 = -36) ∧ (6 * I) ^ 2 = (-36 : ℂ) ∧
    ((4 + 6 * I) / 2 = (2 + 3 * I : ℂ) ∧ (4 - 6 * I) / 2 = (2 - 3 * I : ℂ)) ∧
    (x ^ 2 - 4 * x + 13 = 0 ↔ x = 2 + 3 * I ∨ x = 2 - 3 * I) := by
  refine ⟨by norm_num, by rw [mul_pow, I_sq]; norm_num, ⟨by ring, by ring⟩, ?_⟩
  have fac : x ^ 2 - 4 * x + 13 = (x - (2 + 3 * I)) * (x - (2 - 3 * I)) := by linear_combination (9 : ℂ) * I_sq
  rw [fac, mul_eq_zero, sub_eq_zero, sub_eq_zero]

/-- Naloga 2 b): z₁ = 2 + 3i je točka (2, 3), z₂ = 2 − 3i točka (2, −3); z₂ = z̄₁ (zrcalni čez realno os);
|z₁| = |z₂| = √(2² + 3²) = √13. -/
theorem matura2b : ((2 + 3 * I : ℂ).re = 2 ∧ (2 + 3 * I : ℂ).im = 3) ∧ ((2 - 3 * I : ℂ).re = 2 ∧ (2 - 3 * I : ℂ).im = -3) ∧
    conj (2 + 3 * I : ℂ) = 2 - 3 * I ∧ ‖(2 + 3 * I : ℂ)‖ = √13 ∧ ‖(2 - 3 * I : ℂ)‖ = √13 := by
  have e1 : (2 + 3 * I : ℂ) = ((2:ℝ):ℂ) + ((3:ℝ):ℂ) * I := by push_cast; ring
  have e2 : (2 - 3 * I : ℂ) = ((2:ℝ):ℂ) + ((-3:ℝ):ℂ) * I := by push_cast; ring
  refine ⟨by simp, by simp, ?_, by rw [e1, abs_ab]; norm_num, by rw [e2, abs_ab]; norm_num⟩
  simp [map_add, map_mul, conj_I, map_ofNat]; ring

/-- Naloga 2 c): števec (2 + 3i)² = 4 + 12i + 9i² = −5 + 12i, imenovalec (2 − 3i)(2 + 3i) = 4 + 9 = 13;
z₁/z₂ = (−5 + 12i)/13 = −5/13 + 12/13 i; |z₁/z₂| = √(25 + 144)/13 = 13/13 = 1 = |z₁|/|z₂|. -/
theorem matura2c : (2 + 3 * I : ℂ) ^ 2 = 4 + 12 * I + 9 * I ^ 2 ∧ (4 + 12 * I + 9 * I ^ 2 : ℂ) = -5 + 12 * I ∧
    (2 - 3 * I) * (2 + 3 * I) = (4 + 9 : ℂ) ∧ (2 + 3 * I) / (2 - 3 * I) = ((-5 + 12 * I) / 13 : ℂ) ∧
    ((-5 + 12 * I) / 13 : ℂ) = -5 / 13 + 12 / 13 * I ∧ ‖(-5 / 13 + 12 / 13 * I : ℂ)‖ = √(25 + 144) / 13 ∧
    √((25:ℝ) + 144) / 13 = 13 / 13 ∧ ‖(2 + 3 * I : ℂ) / (2 - 3 * I)‖ = 1 := by
  have hne : (2 - 3 * I : ℂ) ≠ 0 := by intro h; have := congrArg Complex.re h; simp at this
  have e : (-5 / 13 + 12 / 13 * I : ℂ) = ((-5/13:ℝ):ℂ) + ((12/13:ℝ):ℂ) * I := by push_cast; ring
  have h169 : √((25:ℝ) + 144) = 13 := by
    rw [show (25:ℝ) + 144 = 13 ^ 2 by norm_num]; exact Real.sqrt_sq (by norm_num)
  have hq : (2 + 3 * I) / (2 - 3 * I) = ((-5 + 12 * I) / 13 : ℂ) := by
    rw [div_eq_div_iff hne (by norm_num)]; linear_combination (36 : ℂ) * I_sq
  have hn : ‖(-5 / 13 + 12 / 13 * I : ℂ)‖ = √(25 + 144) / 13 := by
    rw [e, abs_ab, show ((-5:ℝ)/13) ^ 2 + (12/13) ^ 2 = (25 + 144) / 13 ^ 2 by norm_num,
      Real.sqrt_div' _ (by norm_num), Real.sqrt_sq (by norm_num)]
  refine ⟨by ring, by rw [I_sq]; ring, by linear_combination (-9 : ℂ) * I_sq, hq, by ring, hn, by rw [h169], ?_⟩
  rw [hq, show ((-5 + 12 * I) / 13 : ℂ) = -5 / 13 + 12 / 13 * I by ring, hn, h169]; norm_num

/-- Ustno vprašanje 1: z̄ = a − bi, z · z̄ = a² + b² = |z|². -/
theorem ustno1 (a b : ℝ) : conj ((a:ℂ) + b * I) = a - b * I ∧ ((a:ℂ) + b * I) * conj ((a:ℂ) + b * I) = (a ^ 2 + b ^ 2 : ℝ) ∧
    ‖(a:ℂ) + b * I‖ ^ 2 = a ^ 2 + b ^ 2 := by
  refine ⟨konjugirano a b, by rw [konjugirano]; push_cast; linear_combination (-(b:ℂ) ^ 2) * I_sq, ?_⟩
  rw [abs_ab, Real.sq_sqrt (by positivity)]

/-- Ustno vprašanje 3: x² = −1 nima realne rešitve; x² + 4 = 0 ima rešitvi ±2i ((x − 2i)(x + 2i) = x² + 4). -/
theorem ustno3 (x : ℂ) : (¬ ∃ r : ℝ, r ^ 2 = -1) ∧ (x - 2 * I) * (x + 2 * I) = x ^ 2 + 4 ∧
    (x ^ 2 + 4 = 0 ↔ x = 2 * I ∨ x = -(2 * I)) := by
  have fac : (x - 2 * I) * (x + 2 * I) = x ^ 2 + 4 := by linear_combination (-4 : ℂ) * I_sq
  refine ⟨i_ni_realno.2, fac, ?_⟩
  rw [← fac, mul_eq_zero, sub_eq_zero, add_eq_zero_iff_eq_neg]

/-! ## Drugače -/

/-- Z analogijo: (1 + 2√5) + (3 − √5) = 4 + √5 in (1 + 2i) + (3 − i) = 4 + i; (3 + √5)(3 − √5) = 9 − 5 = 4 in
(3 + i)(3 − i) = 9 − i² = 10; √5 leži med 2 in 3, i pa ni realno število. -/
theorem analogija : (1 + 2 * √5) + (3 - √(5:ℝ)) = 4 + √5 ∧ (1 + 2 * I) + (3 - I) = (4 + I : ℂ) ∧
    (3 + √5) * (3 - √(5:ℝ)) = 9 - 5 ∧ (9:ℝ) - 5 = 4 ∧ (3 + I) * (3 - I) = (9 - I ^ 2 : ℂ) ∧ (9 - I ^ 2 : ℂ) = 10 ∧
    2 < √(5:ℝ) ∧ √(5:ℝ) < 3 ∧ ∀ r : ℝ, (r:ℂ) ≠ I := by
  refine ⟨by ring, by ring, by linear_combination -(Real.sq_sqrt (show (0:ℝ) ≤ 5 by norm_num)), by norm_num, by ring,
    by rw [I_sq]; norm_num, (Real.lt_sqrt (by norm_num)).mpr (by norm_num), (Real.sqrt_lt' (by norm_num)).mpr (by norm_num),
    i_ni_realno.1⟩

/-- Iz vsakdanjega življenja: |400 + 30i| = √(400² + 30²) ≈ 401 km/h; impedanca |30 + 40i| = √(30² + 40²) = 50 Ω. -/
theorem vsakdan : ‖(400 + 30 * I : ℂ)‖ = √(400 ^ 2 + 30 ^ 2) ∧ 400.5 < √((400:ℝ) ^ 2 + 30 ^ 2) ∧
    √((400:ℝ) ^ 2 + 30 ^ 2) < 401.5 ∧ ‖(30 + 40 * I : ℂ)‖ = √(30 ^ 2 + 40 ^ 2) ∧ √((30:ℝ) ^ 2 + 40 ^ 2) = 50 := by
  have e1 : (400 + 30 * I : ℂ) = ((400:ℝ):ℂ) + ((30:ℝ):ℂ) * I := by push_cast; ring
  have e2 : (30 + 40 * I : ℂ) = ((30:ℝ):ℂ) + ((40:ℝ):ℂ) * I := by push_cast; ring
  refine ⟨by rw [e1, abs_ab], (Real.lt_sqrt (by norm_num)).mpr (by norm_num), (Real.sqrt_lt' (by norm_num)).mpr (by norm_num),
    by rw [e2, abs_ab], ?_⟩
  rw [show (30:ℝ) ^ 2 + 40 ^ 2 = 50 ^ 2 by norm_num]; exact Real.sqrt_sq (by norm_num)

/-- Bolj natančno: urejeni pari – (a, b)(c, d) = (ac − bd, ad + bc) je natanko množenje v C (Re in Im zmnožka);
(0, 1)(0, 1) = (−1, 0), torej i² = −1. -/
theorem urejeni_pari (z w : ℂ) : (z * w).re = z.re * w.re - z.im * w.im ∧ (z * w).im = z.re * w.im + z.im * w.re ∧
    (I * I).re = -1 ∧ (I * I).im = 0 ∧ I.re = 0 ∧ I.im = 1 := by
  refine ⟨mul_re z w, mul_im z w, by simp, by simp, by simp, by simp⟩

/-- Bolj natančno: conj(z₁ + z₂) = z̄₁ + z̄₂, conj(z₁z₂) = z̄₁z̄₂, |z₁z₂|² = |z₁|²|z₂|². -/
theorem konjugiranje_lastnosti (z w : ℂ) : conj (z + w) = conj z + conj w ∧ conj (z * w) = conj z * conj w ∧
    ‖z * w‖ ^ 2 = ‖z‖ ^ 2 * ‖w‖ ^ 2 :=
  ⟨map_add conj z w, map_mul conj z w, by rw [norm_mul, mul_pow]⟩

/-- Bolj natančno: kompleksnih števil ne urejamo – ni množice »pozitivnih« števil, ki bi vsebovala kvadrat
vsakega neničelnega števila, bila zaprta za vsoto in ne bi vsebovala 0 (1 = 1² in −1 = i² bi bili pozitivni,
torej tudi 0). -/
theorem ni_urejanja : ¬ ∃ P : Set ℂ, (∀ z : ℂ, z ≠ 0 → z ^ 2 ∈ P) ∧ (∀ a ∈ P, ∀ b ∈ P, a + b ∈ P) ∧ (0:ℂ) ∉ P := by
  rintro ⟨P, hsq, hadd, h0⟩
  have h1 : (1:ℂ) ∈ P := by simpa using hsq 1 one_ne_zero
  have h2 : (-1:ℂ) ∈ P := by simpa [I_sq] using hsq I I_ne_zero
  exact h0 (by simpa using hadd 1 h1 (-1) h2)

/-! ## Preveri se -/

/-- Preveri se, 1: za z = 4 − 7i je Re z = 4, Im z = −7 (ne −7i), z̄ = 4 + 7i, |z| = √(16 + 49) = √65. -/
theorem preveri1 : (4 - 7 * I : ℂ).re = 4 ∧ (4 - 7 * I : ℂ).im = -7 ∧ conj (4 - 7 * I : ℂ) = 4 + 7 * I ∧
    ‖(4 - 7 * I : ℂ)‖ = √(4 ^ 2 + (-7) ^ 2) ∧ √((4:ℝ) ^ 2 + (-7) ^ 2) = √(16 + 49) ∧ √((16:ℝ) + 49) = √65 := by
  have e : (4 - 7 * I : ℂ) = ((4:ℝ):ℂ) + ((-7:ℝ):ℂ) * I := by push_cast; ring
  refine ⟨by simp, by simp, ?_, by rw [e, abs_ab], by norm_num, by norm_num⟩
  simp [map_sub, map_mul, conj_I, map_ofNat]

/-- Preveri se, 2: (2 − i)² = 4 − 4i + i² = 4 − 4i − 1 = 3 − 4i (ne 5, ne 5 − 4i, ne 3 + 4i). -/
theorem preveri2 : (2 - I : ℂ) ^ 2 = 4 - 4 * I + I ^ 2 ∧ (4 - 4 * I + I ^ 2 : ℂ) = 4 - 4 * I - 1 ∧
    (4 - 4 * I - 1 : ℂ) = 3 - 4 * I ∧ (3 - 4 * I : ℂ) ≠ 5 ∧ (3 - 4 * I : ℂ) ≠ 5 - 4 * I ∧ (3 - 4 * I : ℂ) ≠ 3 + 4 * I := by
  refine ⟨by ring, by rw [I_sq]; ring, by ring, ?_, ?_, ?_⟩ <;> intro h
  · have := congrArg Complex.re h; norm_num at this
  · have := congrArg Complex.re h; norm_num at this
  · have := congrArg Complex.im h; norm_num at this

/-- Preveri se, 3: (1 − 2i)(1 + 2i) = 1 − 4i² = 1 + 4 = 5 (realno), zato (3 + 4i)/(1 − 2i) = (−5 + 10i)/5 = −1 + 2i. -/
theorem preveri3 : (1 - 2 * I) * (1 + 2 * I) = (1 - 4 * I ^ 2 : ℂ) ∧ (1 - 4 * I ^ 2 : ℂ) = 5 ∧
    (3 + 4 * I) / (1 - 2 * I) = ((-5 + 10 * I) / 5 : ℂ) ∧ ((-5 + 10 * I) / 5 : ℂ) = -1 + 2 * I := by
  have hne : (1 - 2 * I : ℂ) ≠ 0 := by intro h; have := congrArg Complex.re h; simp at this
  refine ⟨by ring, by rw [I_sq]; norm_num, ?_, by ring⟩
  rw [div_eq_div_iff hne (by norm_num)]; linear_combination (20 : ℂ) * I_sq

/-- Preveri se, 4: (2 + 3i)(1 − i) = 2 − 2i + 3i − 3i² = 2 + i − 3i² = 2 + i + 3 = 5 + i; korak (3) 2 + i − 3 je napačen. -/
theorem preveri4 : (2 + 3 * I) * (1 - I) = (2 - 2 * I + 3 * I - 3 * I ^ 2 : ℂ) ∧
    (2 - 2 * I + 3 * I - 3 * I ^ 2 : ℂ) = 2 + I - 3 * I ^ 2 ∧ (2 + I - 3 * I ^ 2 : ℂ) = 2 + I + 3 ∧
    (2 + I + 3 : ℂ) = 5 + I ∧ (2 + I - 3 * I ^ 2 : ℂ) ≠ 2 + I - 3 := by
  refine ⟨by ring, by ring, by rw [I_sq]; ring, by ring, ?_⟩
  rw [I_sq]; intro h; have := congrArg Complex.re h; simp at this; norm_num at this

/-- Preveri se, 5: |−6 + 8i| = √((−6)² + 8²) = √(36 + 64) = √100 = 10 km; napačni odgovori 6 + 8 = 14, −6 + 8 = 2,
√28 ≈ 5,29. -/
theorem preveri5 : ‖(-6 + 8 * I : ℂ)‖ = √((-6) ^ 2 + 8 ^ 2) ∧ √((-6:ℝ) ^ 2 + 8 ^ 2) = √(36 + 64) ∧
    √((36:ℝ) + 64) = √100 ∧ √(100:ℝ) = 10 ∧ 5.285 < √(28:ℝ) ∧ √(28:ℝ) < 5.295 ∧
    (6:ℝ) + 8 = 14 ∧ (-6:ℝ) + 8 = 2 := by
  have e : (-6 + 8 * I : ℂ) = ((-6:ℝ):ℂ) + ((8:ℝ):ℂ) * I := by push_cast; ring
  refine ⟨by rw [e, abs_ab], by norm_num, by norm_num, ?_, (Real.lt_sqrt (by norm_num)).mpr (by norm_num),
    (Real.sqrt_lt' (by norm_num)).mpr (by norm_num), by norm_num, by norm_num⟩
  rw [show (100:ℝ) = 10 ^ 2 by norm_num]; exact Real.sqrt_sq (by norm_num)

/-- Preveri se, 6: z₁ = 2 + 3i, z₂ = 4 − i, z₁ − z₂ = −2 + 4i, imaginarni del 4 (z₂ − z₁ ima −4, vsota ima 2). -/
theorem preveri6 : (2 + 3 * I) - (4 - I) = (-2 + 4 * I : ℂ) ∧ ((2 + 3 * I) - (4 - I) : ℂ).im = 4 ∧
    ((4 - I) - (2 + 3 * I) : ℂ).im = -4 ∧ ((2 + 3 * I) + (4 - I) : ℂ).im = 2 := by
  refine ⟨by ring, ?_, ?_, ?_⟩ <;> simp <;> norm_num

/-- Preveri se, 7: 1/(1 − 2i) = (1 + 2i)/((1 − 2i)(1 + 2i)) = (1 + 2i)/5 = 1/5 + 2/5 i, b = 0,4. Napačni
odgovori: z v števcu, (1 − 2i)/5, da b = −0,4; brez deljenja s 5 je b = 2 (1 + 2i); deljenje po členih
1/1 + 1/(−2) i da b = −0,5. -/
theorem preveri7 : 1 / (1 - 2 * I : ℂ) = (1 + 2 * I) / 5 ∧ ((1 + 2 * I) / 5 : ℂ) = 1 / 5 + 2 / 5 * I ∧
    (1 / (1 - 2 * I : ℂ)).im = 0.4 ∧ ((1 - 2 * I) / 5 : ℂ).im = -0.4 ∧ (1 + 2 * I : ℂ).im = 2 ∧
    ((1:ℂ) / 1 + 1 / (-2) * I).im = -0.5 := by
  have hne : (1 - 2 * I : ℂ) ≠ 0 := by intro h; have := congrArg Complex.re h; simp at this
  have e : 1 / (1 - 2 * I : ℂ) = (1 + 2 * I) / 5 := by
    rw [div_eq_div_iff hne (by norm_num)]; linear_combination (4 : ℂ) * I_sq
  refine ⟨e, by ring, ?_, ?_, ?_, ?_⟩
  · rw [e]; simp; norm_num
  · simp; norm_num
  · simp
  · simp; norm_num

/-- Preveri se, 8: če ima x² + px + q = 0 z realnima p, q rešitev 2 + 5i, je p = −4 in q = 29 = (2 + 5i)(2 − 5i)
= 2² + 5²; (x − 2 − 5i)(x − 2 + 5i) = x² − 4x + 29. -/
theorem preveri8 (p q : ℝ) (h : (2 + 5 * I : ℂ) ^ 2 + p * (2 + 5 * I) + q = 0) : p = -4 ∧ q = 29 ∧
    (2 + 5 * I) * (2 - 5 * I) = (2 ^ 2 + 5 ^ 2 : ℂ) ∧ ∀ x : ℂ, (x - 2 - 5 * I) * (x - 2 + 5 * I) = x ^ 2 - 4 * x + 29 := by
  have hre := congrArg Complex.re h
  have him := congrArg Complex.im h
  simp [sq] at hre him
  have hp : p = -4 := by linarith
  refine ⟨hp, by rw [hp] at hre; linarith, by linear_combination (-25 : ℂ) * I_sq,
    fun x => by linear_combination (-25 : ℂ) * I_sq⟩

example : (2 + 5 * I : ℂ) ^ 2 + ((-4:ℝ):ℂ) * (2 + 5 * I) + ((29:ℝ):ℂ) = 0 := by
  push_cast; linear_combination (25 : ℂ) * I_sq

/-- RACUN (vse vrstice): i²³ = −i; 1/(2 − i) = 2/5 + i/5; (−4)² − 4 · 1 · 13 = −36;
(x − 2 − 3i)(x − 2 + 3i) = x² − 4x + 13; (4 + √−36)/2 = 2 + 3i (√−36 = 6i, zapisano kot (4 + 6i)/2);
(2 + 3i)² = −5 + 12i; (2 + 3i)/(2 − 3i) = −5/13 + 12i/13; |2 + 3i| = √13; |−5/13 + 12i/13| = 1;
(x − 2i)(x + 2i) = x² + 4; (3 + 2i) + (1 − 4i) = 4 − 2i; (3 + 2i) − (1 − 4i) = 2 + 6i; (3 + 2i) + (−1 + 4i) = 2 + 6i;
1/(3 + 4i) = 3/25 − 4i/25; 1/i = −i; (x − 3)² = x² − 6x + 9; (x − 3)² + 4 = x² − 6x + 13;
(3 + 2i)² − 6(3 + 2i) + 13 = 0; (3i)² = −9; (x − 3 − 2i)(x − 3 + 2i) = x² − 6x + 13; (2 + 3i) − (4 − i) = −2 + 4i;
1/(1 − 2i) = 1/5 + 2i/5; (x − 2 − 5i)(x − 2 + 5i) = x² − 4x + 29. -/
theorem racun (x : ℂ) : I ^ 23 = -I ∧ 1 / (2 - I) = (2 / 5 + I / 5 : ℂ) ∧ ((-4:ℝ) ^ 2 - 4 * 1 * 13 = -36) ∧
    (x - 2 - 3 * I) * (x - 2 + 3 * I) = x ^ 2 - 4 * x + 13 ∧ (6 * I) ^ 2 = (-36 : ℂ) ∧ (4 + 6 * I) / 2 = (2 + 3 * I : ℂ) ∧
    (2 + 3 * I : ℂ) ^ 2 = -5 + 12 * I ∧ (2 + 3 * I) / (2 - 3 * I) = (-5 / 13 + 12 * I / 13 : ℂ) ∧
    ‖(2 + 3 * I : ℂ)‖ = √13 ∧ ‖(-5 / 13 + 12 * I / 13 : ℂ)‖ = 1 ∧
    (x - 2 * I) * (x + 2 * I) = x ^ 2 + 4 ∧ (3 + 2 * I) + (1 - 4 * I) = (4 - 2 * I : ℂ) ∧
    (3 + 2 * I) - (1 - 4 * I) = (2 + 6 * I : ℂ) ∧ (3 + 2 * I) + (-1 + 4 * I) = (2 + 6 * I : ℂ) ∧
    1 / (3 + 4 * I) = (3 / 25 - 4 * I / 25 : ℂ) ∧ 1 / I = -I ∧ (x - 3) ^ 2 = x ^ 2 - 6 * x + 9 ∧
    (x - 3) ^ 2 + 4 = x ^ 2 - 6 * x + 13 ∧ (3 + 2 * I : ℂ) ^ 2 - 6 * (3 + 2 * I) + 13 = 0 ∧ (3 * I : ℂ) ^ 2 = -9 ∧
    (x - 3 - 2 * I) * (x - 3 + 2 * I) = x ^ 2 - 6 * x + 13 ∧ (2 + 3 * I) - (4 - I) = (-2 + 4 * I : ℂ) ∧
    1 / (1 - 2 * I) = (1 / 5 + 2 * I / 5 : ℂ) ∧ (x - 2 - 5 * I) * (x - 2 + 5 * I) = x ^ 2 - 4 * x + 29 := by
  have h2i : (2 - I : ℂ) ≠ 0 := by intro h; have := congrArg Complex.im h; simp at this
  have h23 : (2 - 3 * I : ℂ) ≠ 0 := by intro h; have := congrArg Complex.im h; simp at this
  have h34 : (3 + 4 * I : ℂ) ≠ 0 := by intro h; have := congrArg Complex.im h; simp at this
  have h12 : (1 - 2 * I : ℂ) ≠ 0 := by intro h; have := congrArg Complex.im h; simp at this
  have e1 : (2 + 3 * I : ℂ) = ((2:ℝ):ℂ) + ((3:ℝ):ℂ) * I := by push_cast; ring
  have e2 : (-5 / 13 + 12 * I / 13 : ℂ) = ((-5 / 13:ℝ):ℂ) + ((12 / 13:ℝ):ℂ) * I := by push_cast; ring
  have i23 : I ^ 23 = -I := by
    rw [show 23 = 4 * 5 + 3 by norm_num, pow_add, pow_mul, I_pow_four, one_pow, one_mul, I_pow_three]
  refine ⟨i23, ?_, by norm_num, by linear_combination (-9 : ℂ) * I_sq, by linear_combination (36 : ℂ) * I_sq,
    by ring, by linear_combination (9 : ℂ) * I_sq, ?_, ?_, ?_, by linear_combination (-4 : ℂ) * I_sq, by ring, by ring,
    by ring, ?_, by rw [one_div, inv_I], by ring, by ring, by linear_combination (4 : ℂ) * I_sq,
    by linear_combination (9 : ℂ) * I_sq, by linear_combination (-4 : ℂ) * I_sq, by ring, ?_,
    by linear_combination (-25 : ℂ) * I_sq⟩
  · rw [div_eq_iff h2i]; linear_combination (1 / 5 : ℂ) * I_sq
  · rw [div_eq_iff h23]; linear_combination (36 / 13 : ℂ) * I_sq
  · rw [e1, abs_ab]; norm_num
  · rw [e2, abs_ab]; norm_num
  · rw [div_eq_iff h34]; linear_combination (16 / 25 : ℂ) * I_sq
  · rw [div_eq_iff h12]; linear_combination (4 / 5 : ℂ) * I_sq

/-- Drugače, Bolj natančno: pari (a, 0) se obnašajo natanko kot realna števila: vložitev ℝ → ℂ, a ↦ a + 0i, je
injektiven homomorfizem kolobarjev (ohranja vsoto, produkt, 0 in 1); (0, 1) · (0, 1) = (−1, 0). -/
theorem pari_realni (a b : ℝ) : (((a + b : ℝ) : ℂ) = a + b ∧ ((a * b : ℝ) : ℂ) = a * b ∧ ((0:ℝ):ℂ) = 0 ∧
    ((1:ℝ):ℂ) = 1 ∧ (a:ℂ).im = 0) ∧ Function.Injective (Complex.ofRealHom : ℝ →+* ℂ) ∧ I * I = ((-1:ℝ):ℂ) :=
  ⟨⟨by push_cast; ring, by push_cast; ring, by simp, by simp, by simp⟩, Complex.ofReal_injective,
    by rw [I_mul_I]; push_cast; ring⟩

end Evklid.Lekcije.MAT_SS_2.KompleksnaStevila
