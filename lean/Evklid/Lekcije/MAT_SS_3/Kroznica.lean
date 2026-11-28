/-
vir: content/lessons/MAT-SS-3/kroznica.md
sha256: bd183679fd77498a8cf136fc1bdf5d9d68250e64ac3a76f592a6f04a613cadea
Ni v Leanu: zgodbe (Nika, koza, dron, navigacija) razen računov, risbe in simulacija; definicija krožnice
kot množice točk na razdalji r (uporabljena je v obliki √((x − p)² + (y − q)²) = r, `srediscna_oblika`);
lega premice za navpične premice x = c (splošna trditev `lega_premice` in `tangenta_iff` je dokazana za
premice y = kx + n, navpična premica je obdelana le pri nalogi 3 c), x = 8); »krožnico prepoznaš po enakih
koeficientih pri x² in y² in brez člena xy« (pravilo prepoznavanja, ne trditev; deljenje z 2 v primeru
2x² + 2y² − 8x = 0 je dokazano); »dve krivulji drugega reda imata lahko do štiri skupne točke«
(Bézoutov izrek, zahtevno, še ni dokazano; primer s štirimi točkami je dokazan v `preveri6`); »koliko
presečišč vidiš na skici« (risba); postopki, Ponovitev in točkovanje; Preveri se, vprašanje 4 kot izbira
koraka (dokazano je, da je pravilna desna stran 25 in ne 43).
Približki √18 ≈ 4,24, √98 ≈ 9,9, √8 ≈ 2,83 so dokazani kot ocene napake zaokrožitve.
Lean: deljenje z 0 da 0; pri `preveri6` (y = 12/x) zato x = 0 da y = 0, kar ni na krožnici, in pogoj x ≠ 0
ni potreben.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.Kroznica

/-! ## Pomožne trditve -/

/-- Pomožna: če je c − e ≥ 0, (c − e)² < a < (c + e)² in e > 0, je |√a − c| < e (zaokrožitev).
pomozno -/
theorem koren_priblizno {a c e : ℝ} (he : 0 < e) (h0 : 0 ≤ c - e) (h1 : (c - e) ^ 2 < a)
    (h2 : a < (c + e) ^ 2) : |Real.sqrt a - c| < e := by
  rw [abs_lt]; constructor
  · have : c - e < Real.sqrt a := by rw [Real.lt_sqrt h0]; exact h1
    linarith
  · have : Real.sqrt a < c + e := by rw [Real.sqrt_lt' (by linarith)]; exact h2
    linarith

/-- Predpostavke `koren_priblizno` se dajo izpolniti (√4 ≈ 2). -/
example : |Real.sqrt 4 - 2| < 1 / 2 := koren_priblizno (by norm_num) (by norm_num) (by norm_num) (by norm_num)

/-! ## Razlaga: enačba krožnice -/

/-- Razlaga 2 in ustno vprašanje 1: pogoj razdalje √((x − p)² + (y − q)²) = r je za r ≥ 0 enakovreden
središčni obliki (x − p)² + (y − q)² = r² (kvadriranje ne doda rešitev, obe strani sta nenegativni).
trditev: MAT-SS-3/kroznica#srediscna-oblika
besedilo: »Iz pogoja $\sqrt{(x - p)^2 + (y - q)^2} = r$ s kvadriranjem dobimo $(x - p)^2 + (y - q)^2 = r^2$.« -/
theorem srediscna_oblika (x y p q r : ℝ) (hr : 0 ≤ r) :
    Real.sqrt ((x - p) ^ 2 + (y - q) ^ 2) = r ↔ (x - p) ^ 2 + (y - q) ^ 2 = r ^ 2 := by
  constructor
  · intro h; rw [← h, Real.sq_sqrt (by positivity)]
  · intro h; rw [h, Real.sqrt_sq hr]

/-- Predpostavka `srediscna_oblika` se da izpolniti (r = 5). -/
example : Real.sqrt ((8 - 3) ^ 2 + (2 - 2) ^ 2) = 5 ↔ ((8 : ℝ) - 3) ^ 2 + (2 - 2) ^ 2 = 5 ^ 2 :=
  srediscna_oblika 8 2 3 2 5 (by norm_num)

/-- Lega točke (Razlaga 2, Povzetek): za r ≥ 0 je razdalja do središča manjša od r, enaka r ali večja od r
natanko tedaj, ko je leva stran središčne oblike manjša od r², enaka r² ali večja od r².
trditev: MAT-SS-3/kroznica#lega-tocke
besedilo: »Koordinate točke vstaviš v levo stran središčne oblike in rezultat primerjaš z $r^2$. Manj pomeni, da je točka znotraj kroga. Enako pomeni, da leži na krožnici. Več pomeni, da je zunaj.« -/
theorem lega_tocke (x y p q r : ℝ) (hr : 0 ≤ r) :
    (Real.sqrt ((x - p) ^ 2 + (y - q) ^ 2) < r ↔ (x - p) ^ 2 + (y - q) ^ 2 < r ^ 2) ∧
    (Real.sqrt ((x - p) ^ 2 + (y - q) ^ 2) = r ↔ (x - p) ^ 2 + (y - q) ^ 2 = r ^ 2) ∧
    (r < Real.sqrt ((x - p) ^ 2 + (y - q) ^ 2) ↔ r ^ 2 < (x - p) ^ 2 + (y - q) ^ 2) := by
  have h0 : 0 ≤ (x - p) ^ 2 + (y - q) ^ 2 := by positivity
  have hs : Real.sqrt (r ^ 2) = r := Real.sqrt_sq hr
  refine ⟨?_, srediscna_oblika x y p q r hr, ?_⟩
  · conv_lhs => rw [← hs]
    exact Real.sqrt_lt_sqrt_iff h0
  · conv_lhs => rw [← hs]
    exact Real.sqrt_lt_sqrt_iff (sq_nonneg r)

/-- Predpostavka `lega_tocke` se da izpolniti (r = 5). -/
example : Real.sqrt (((1 : ℝ) - 3) ^ 2 + (2 - 2) ^ 2) < 5 ↔ ((1 : ℝ) - 3) ^ 2 + (2 - 2) ^ 2 < 5 ^ 2 :=
  (lega_tocke 1 2 3 2 5 (by norm_num)).1

/-- Razlaga 2: s središčem v izhodišču (p = q = 0) je enačba x² + y² = r².
trditev: MAT-SS-3/kroznica#izhodisce
besedilo: »Če je središče v izhodišču, sta $p$ in $q$ enaka $0$ in ostane enačba $x^2 + y^2 = r^2$.« -/
theorem izhodisce (x y r : ℝ) : (x - 0) ^ 2 + (y - 0) ^ 2 = r ^ 2 ↔ x ^ 2 + y ^ 2 = r ^ 2 := by
  simp only [sub_zero]

/-- Razlaga 1: točka (8, 2) ne ustreza napačni enačbi (x + 3)² + (y + 2)² = 5: 11² + 4² = 137 ≠ 5.
trditev: MAT-SS-3/kroznica#bliznjica
besedilo: »V napačno enačbo vstavimo: $(8 + 3)^2 + (2 + 2)^2 = 11^2 + 4^2 = 137$, kar ni $5$.« -/
theorem bliznjica : ((8 : ℝ) + 3) ^ 2 + (2 + 2) ^ 2 = 11 ^ 2 + 4 ^ 2 ∧ (11 : ℝ) ^ 2 + 4 ^ 2 = 137 ∧
    (137 : ℝ) ≠ 5 := by norm_num

/-- Razlaga 2: točka (8, 2) ustreza pravilni enačbi (x − 3)² + (y − 2)² = 25: 5² + 0² = 25.
trditev: MAT-SS-3/kroznica#bliznjica-popravek
besedilo: »Točka $(8, 2)$ zdaj ustreza: $5^2 + 0^2 = 25$.« -/
theorem bliznjica_popravek : ((8 : ℝ) - 3) ^ 2 + (2 - 2) ^ 2 = 5 ^ 2 + 0 ^ 2 ∧ (5 : ℝ) ^ 2 + 0 ^ 2 = 25 := by
  norm_num

/-- Razlaga 2, premisli: x² + y² = 0 opisuje le izhodišče, x² + y² = −4 nobene točke.
trditev: MAT-SS-3/kroznica#premisli-tocka
besedilo: »Prva le eno točko, izhodišče $(0, 0)$: vsota dveh kvadratov je $0$ samo, če sta oba $0$. Druga ne opisuje nobene točke, ker vsota kvadratov ne more biti negativna.« -/
theorem premisli_tocka (x y : ℝ) : (x ^ 2 + y ^ 2 = 0 ↔ x = 0 ∧ y = 0) ∧ x ^ 2 + y ^ 2 ≠ -4 := by
  refine ⟨⟨fun h => ⟨by nlinarith [sq_nonneg x, sq_nonneg y], by nlinarith [sq_nonneg x, sq_nonneg y]⟩,
    fun ⟨a, b⟩ => by rw [a, b]; norm_num⟩, fun h => by nlinarith [sq_nonneg x, sq_nonneg y]⟩

/-- Razlaga 3: dopolnjevanje do popolnega kvadrata x² + Dx = (x + D/2)² − D²/4; npr. x² − 6x = (x − 3)² − 9.
trditev: MAT-SS-3/kroznica#dopolnjevanje
besedilo: »k $x^2 + Dx$ dodaš in odvzameš kvadrat polovice koeficienta. Tako je na primer $x^2 - 6x = (x - 3)^2 - 9$.« -/
theorem dopolnjevanje (x D : ℝ) : x ^ 2 + D * x = (x + D / 2) ^ 2 - D ^ 2 / 4 ∧
    x ^ 2 - 6 * x = (x - 3) ^ 2 - 9 := ⟨by ring, by ring⟩

/-- Razlaga 3: iz središčne oblike z odpravo oklepajev dobiš splošno obliko z D = −2p, E = −2q,
F = p² + q² − r².
trditev: MAT-SS-3/kroznica#srediscna-v-splosno
besedilo: »Če v središčni obliki odpraviš oklepaje in vse preneseš na levo, dobiš **splošno obliko** $x^2 + y^2 + Dx + Ey + F = 0$.« -/
theorem srediscna_v_splosno (x y p q r : ℝ) :
    (x - p) ^ 2 + (y - q) ^ 2 = r ^ 2 ↔
      x ^ 2 + y ^ 2 + (-2 * p) * x + (-2 * q) * y + (p ^ 2 + q ^ 2 - r ^ 2) = 0 := by
  constructor <;> intro h <;> linear_combination h

/-- Razlaga 3 in Povzetek: splošna oblika x² + y² + Dx + Ey + F = 0 je enakovredna
(x + D/2)² + (y + E/2)² = D²/4 + E²/4 − F: središče S(−D/2, −E/2), r² = D²/4 + E²/4 − F.
trditev: MAT-SS-3/kroznica#splosna-oblika
besedilo: »Če to narediš s splošnima $D$ in $E$, dobiš: središče je v točki $S\!\left(-\frac{D}{2}, -\frac{E}{2}\right)$ in velja $r^2 = \frac{D^2}{4} + \frac{E^2}{4} - F$.« -/
theorem splosna_oblika (x y D E F : ℝ) :
    x ^ 2 + y ^ 2 + D * x + E * y + F = 0 ↔
      (x - (-D / 2)) ^ 2 + (y - (-E / 2)) ^ 2 = D ^ 2 / 4 + E ^ 2 / 4 - F := by
  constructor <;> intro h <;> linear_combination h

/-- Razlaga 3, Pogoste napake, ustno vprašanje 2: krožnica s polmerom r = √(D²/4 + E²/4 − F) je le, ko je ta
vrednost pozitivna; pri 0 enačba opisuje eno točko S(−D/2, −E/2), pri negativni nobene.
trditev: MAT-SS-3/kroznica#splosna-primeri
besedilo: »V splošnem enačba opisuje krožnico le, če je $\frac{D^2}{4} + \frac{E^2}{4} - F > 0$; če je ta vrednost $0$, opisuje eno samo točko.« -/
theorem splosna_primeri (D E F : ℝ) :
    (0 < D ^ 2 / 4 + E ^ 2 / 4 - F → ∀ x y, x ^ 2 + y ^ 2 + D * x + E * y + F = 0 ↔
      (x - (-D / 2)) ^ 2 + (y - (-E / 2)) ^ 2 = Real.sqrt (D ^ 2 / 4 + E ^ 2 / 4 - F) ^ 2) ∧
    (D ^ 2 / 4 + E ^ 2 / 4 - F = 0 → ∀ x y, x ^ 2 + y ^ 2 + D * x + E * y + F = 0 ↔
      (x = -D / 2 ∧ y = -E / 2)) ∧
    (D ^ 2 / 4 + E ^ 2 / 4 - F < 0 → ∀ x y, x ^ 2 + y ^ 2 + D * x + E * y + F ≠ 0) := by
  refine ⟨fun h x y => ?_, fun h x y => ?_, fun h x y => ?_⟩
  · rw [splosna_oblika, Real.sq_sqrt h.le]
  · rw [splosna_oblika, h]
    constructor
    · intro e
      have a := sq_nonneg (x - -D / 2)
      have b := sq_nonneg (y - -E / 2)
      have ha : (x - -D / 2) ^ 2 = 0 := by linarith
      have hb : (y - -E / 2) ^ 2 = 0 := by linarith
      exact ⟨by have := pow_eq_zero_iff (n := 2) (by norm_num) |>.1 ha; linarith,
        by have := pow_eq_zero_iff (n := 2) (by norm_num) |>.1 hb; linarith⟩
    · rintro ⟨rfl, rfl⟩; ring
  · rw [ne_eq, splosna_oblika]
    intro e; nlinarith [sq_nonneg (x - -D / 2), sq_nonneg (y - -E / 2)]

/-- Vsi trije pogoji v `splosna_primeri` se dajo izpolniti (D = E = 0 in F = −1, 0, 1). -/
example : (0 : ℝ) < 0 ^ 2 / 4 + 0 ^ 2 / 4 - (-1) ∧ (0 : ℝ) ^ 2 / 4 + 0 ^ 2 / 4 - 0 = 0 ∧
    (0 : ℝ) ^ 2 / 4 + 0 ^ 2 / 4 - 1 < 0 := by norm_num

/-- Razlaga 3 (RACUN enako): 2x² + 2y² − 8x = 0 delimo z 2: x² + y² − 4x = 0, kar je (x − 2)² + y² = 4;
(2x² + 2y² − 8x)/2 = (x − 2)² + y² − 4.
trditev: MAT-SS-3/kroznica#deljenje-z-2
besedilo: »Enačbo $2x^2 + 2y^2 - 8x = 0$ najprej deliš z $2$: $x^2 + y^2 - 4x = 0$. Dopolnjevanje do kvadrata da $(x - 2)^2 + y^2 = 4$.« -/
theorem deljenje_z_2 (x y : ℝ) : (2 * x ^ 2 + 2 * y ^ 2 - 8 * x = 0 ↔ x ^ 2 + y ^ 2 - 4 * x = 0) ∧
    (x ^ 2 + y ^ 2 - 4 * x = 0 ↔ (x - 2) ^ 2 + y ^ 2 = 4) ∧
    (2 * x ^ 2 + 2 * y ^ 2 - 8 * x) / 2 = (x - 2) ^ 2 + y ^ 2 - 4 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    by ring⟩

/-! ## Razlaga: premica in krožnica -/

/-- Razlaga 5: kvadratna enačba za x, ki jo dobiš, ko y = kx + n vstaviš v krožnico s središčem (p, q) in
polmerom r: (x − p)² + (kx + n − q)² − r² = (1 + k²)x² + 2(k(n − q) − p)x + p² + (n − q)² − r².
trditev: MAT-SS-3/kroznica#vstavljena
besedilo: »Iz enačbe premice izraziš $y$ in ga vstaviš v enačbo krožnice. Dobiš kvadratno enačbo za $x$.« -/
theorem vstavljena (k n p q r x : ℝ) :
    (x - p) ^ 2 + (k * x + n - q) ^ 2 - r ^ 2 =
      (1 + k ^ 2) * (x * x) + 2 * (k * (n - q) - p) * x + (p ^ 2 + (n - q) ^ 2 - r ^ 2) := by ring

/-- Razlaga 5: diskriminanta kvadratne enačbe po vstavljanju premice y = kx + n v krožnico. -/
noncomputable def diskr (k n p q r : ℝ) : ℝ :=
  discrim (1 + k ^ 2) (2 * (k * (n - q) - p)) (p ^ 2 + (n - q) ^ 2 - r ^ 2)

/-- Razlaga 5: diskriminanta je 4(1 + k²)(r² − d²), kjer je d = |kp − q + n|/√(1 + k²) razdalja središča
od premice y = kx + n.
pomozno -/
theorem diskr_razdalja (k n p q r : ℝ) :
    diskr k n p q r = 4 * (1 + k ^ 2) * (r ^ 2 - (|k * p - q + n| / Real.sqrt (1 + k ^ 2)) ^ 2) := by
  have h1 : 0 < 1 + k ^ 2 := by positivity
  rw [div_pow, sq_abs, Real.sq_sqrt h1.le, diskr, discrim]
  field_simp
  ring

/-- Razlaga 5, tabela: D > 0 ↔ d < r, D = 0 ↔ d = r, D < 0 ↔ d > r (r > 0).
trditev: MAT-SS-3/kroznica#diskr-in-razdalja
besedilo: »| $D > 0$ | sekanta | $d < r$ | | $D = 0$ | tangenta | $d = r$ | | $D < 0$ | mimobežnica | $d > r$ |« -/
theorem diskr_in_razdalja (k n p q r : ℝ) (hr : 0 < r) :
    (0 < diskr k n p q r ↔ |k * p - q + n| / Real.sqrt (1 + k ^ 2) < r) ∧
    (diskr k n p q r = 0 ↔ |k * p - q + n| / Real.sqrt (1 + k ^ 2) = r) ∧
    (diskr k n p q r < 0 ↔ r < |k * p - q + n| / Real.sqrt (1 + k ^ 2)) := by
  rw [diskr_razdalja]
  set d := |k * p - q + n| / Real.sqrt (1 + k ^ 2)
  have hd : 0 ≤ d := by positivity
  have h1 : 0 < 4 * (1 + k ^ 2) := by positivity
  have e : r ^ 2 - d ^ 2 = (r - d) * (r + d) := by ring
  have hrd : 0 < r + d := by linarith
  refine ⟨?_, ?_, ?_⟩
  · rw [mul_pos_iff_of_pos_left h1, e, mul_pos_iff_of_pos_right hrd, sub_pos]
  · rw [mul_eq_zero, or_iff_right h1.ne', e, mul_eq_zero, or_iff_left hrd.ne', sub_eq_zero, eq_comm]
  · rw [mul_neg_iff, e]
    constructor
    · rintro (⟨_, h⟩ | ⟨h, _⟩)
      · by_contra hc; push Not at hc; nlinarith
      · linarith
    · intro h; left; exact ⟨h1, by nlinarith⟩

/-- Predpostavka `diskr_in_razdalja` se da izpolniti (r = 1). -/
example := diskr_in_razdalja 0 0 0 0 1 one_pos

/-- Pomožna: točka (x, y) je na krožnici in na premici y = kx + n natanko tedaj, ko je y = kx + n in x reši
vstavljeno kvadratno enačbo.
pomozno -/
theorem sistem_kvadratna (k n p q r x y : ℝ) :
    ((x - p) ^ 2 + (y - q) ^ 2 = r ^ 2 ∧ y = k * x + n) ↔
      (y = k * x + n ∧ (1 + k ^ 2) * (x * x) + 2 * (k * (n - q) - p) * x + (p ^ 2 + (n - q) ^ 2 - r ^ 2) = 0) := by
  constructor
  · rintro ⟨h, rfl⟩; refine ⟨rfl, ?_⟩; rw [← vstavljena]; linarith
  · rintro ⟨rfl, h⟩; refine ⟨?_, rfl⟩; rw [← vstavljena] at h; linarith

/-- Razlaga 5 (in Povzetek, Preveri se, vprašanje 3): premica y = kx + n in krožnica imata pri D < 0 nobene,
pri D = 0 natanko eno in pri D > 0 natanko dve skupni točki (mimobežnica, tangenta, sekanta).
trditev: MAT-SS-3/kroznica#lega-premice
besedilo: »Sekanta ima s krožnico dve skupni točki, tangenta eno, mimobežnica nobene.« -/
theorem lega_premice (k n p q r : ℝ) :
    (diskr k n p q r < 0 → ∀ x y, ¬ ((x - p) ^ 2 + (y - q) ^ 2 = r ^ 2 ∧ y = k * x + n)) ∧
    (diskr k n p q r = 0 → ∃ x₀, ∀ x y,
      ((x - p) ^ 2 + (y - q) ^ 2 = r ^ 2 ∧ y = k * x + n) ↔ (x = x₀ ∧ y = k * x₀ + n)) ∧
    (0 < diskr k n p q r → ∃ x₁ x₂, x₁ ≠ x₂ ∧ ∀ x y,
      ((x - p) ^ 2 + (y - q) ^ 2 = r ^ 2 ∧ y = k * x + n) ↔ ((x = x₁ ∨ x = x₂) ∧ y = k * x + n)) := by
  have ha : (1 + k ^ 2) ≠ 0 := by positivity
  refine ⟨fun h x y hxy => ?_, fun h => ?_, fun h => ?_⟩
  · rw [sistem_kvadratna] at hxy
    exact quadratic_ne_zero_of_discrim_ne_sq (fun s hs => by
      have := sq_nonneg s; unfold diskr at h; linarith) x hxy.2
  · refine ⟨-(2 * (k * (n - q) - p)) / (2 * (1 + k ^ 2)), fun x y => ?_⟩
    rw [sistem_kvadratna, quadratic_eq_zero_iff_of_discrim_eq_zero ha h]
    constructor
    · rintro ⟨h1, h2⟩; exact ⟨h2, by rw [h1, h2]⟩
    · rintro ⟨h1, h2⟩; exact ⟨by rw [h2, h1], h1⟩
  · set s := Real.sqrt (diskr k n p q r)
    have hs : diskr k n p q r = s * s := (Real.mul_self_sqrt h.le).symm
    have hs0 : 0 < s := Real.sqrt_pos.2 h
    refine ⟨(-(2 * (k * (n - q) - p)) + s) / (2 * (1 + k ^ 2)),
      (-(2 * (k * (n - q) - p)) - s) / (2 * (1 + k ^ 2)), ?_, fun x y => ?_⟩
    · intro e
      have h2 : (0 : ℝ) < 2 * (1 + k ^ 2) := by positivity
      rw [div_left_inj₀ h2.ne'] at e
      linarith
    · rw [sistem_kvadratna, quadratic_eq_zero_iff ha hs]
      tauto

/-- Predpostavka vsakega dela `lega_premice` se da izpolniti: krožnica x² + y² = 1 in premice y = 2
(D < 0), y = 1 (D = 0), y = 0 (D > 0). -/
example : diskr 0 2 0 0 1 < 0 ∧ diskr 0 1 0 0 1 = 0 ∧ 0 < diskr 0 0 0 0 1 := by
  unfold diskr discrim; norm_num

/-- Razlaga 5: premica ima s krožnico natanko eno skupno točko (je tangenta). -/
def jeTangenta (k n p q r : ℝ) : Prop :=
  ∃ x₀, ∀ x y, ((x - p) ^ 2 + (y - q) ^ 2 = r ^ 2 ∧ y = k * x + n) ↔ (x = x₀ ∧ y = k * x₀ + n)

/-- Razlaga 5: premica y = kx + n je tangenta (ena sama skupna točka) natanko tedaj, ko je D = 0.
trditev: MAT-SS-3/kroznica#tangenta-iff
besedilo: »Diskriminanta $0$ ali $d = r$: **tangenta**.« -/
theorem tangenta_iff (k n p q r : ℝ) : jeTangenta k n p q r ↔ diskr k n p q r = 0 := by
  obtain ⟨h1, h2, h3⟩ := lega_premice k n p q r
  constructor
  · rintro ⟨x₀, hx₀⟩
    rcases lt_trichotomy (diskr k n p q r) 0 with h | h | h
    · exact absurd ((hx₀ x₀ _).2 ⟨rfl, rfl⟩) (h1 h x₀ _)
    · exact h
    · obtain ⟨a, b, hab, hx⟩ := h3 h
      have ha := ((hx₀ a (k * a + n)).1 ((hx a _).2 ⟨Or.inl rfl, rfl⟩)).1
      have hb := ((hx₀ b (k * b + n)).1 ((hx b _).2 ⟨Or.inr rfl, rfl⟩)).1
      exact absurd (ha.trans hb.symm) hab
  · exact h2

/-- Razlaga 5, premisli: premica skozi središče (y = q + k(x − p)) ima razdaljo d = 0 < r, zato je sekanta
(dve skupni točki); presečišči sta simetrični glede na S (krajišči premera).
trditev: MAT-SS-3/kroznica#premica-skozi-sredisce
besedilo: »Natanko dve. Razdalja od središča do premice je $d = 0$, kar je manj od vsakega polmera, zato je premica sekanta. Presečišči sta krajišči premera.« -/
theorem premica_skozi_sredisce (k p q r : ℝ) (hr : 0 < r) :
    0 < diskr k (q - k * p) p q r ∧
    ∀ x y, ((x - p) ^ 2 + (y - q) ^ 2 = r ^ 2 ∧ y = k * x + (q - k * p)) →
      ((2 * p - x - p) ^ 2 + (2 * q - y - q) ^ 2 = r ^ 2 ∧ 2 * q - y = k * (2 * p - x) + (q - k * p)) := by
  refine ⟨?_, fun x y ⟨h1, h2⟩ => ⟨by linear_combination h1, by linear_combination -h2⟩⟩
  rw [(diskr_in_razdalja k _ p q r hr).1]
  have : k * p - q + (q - k * p) = 0 := by ring
  rw [this, abs_zero, zero_div]; exact hr

/-- Predpostavka `premica_skozi_sredisce` se da izpolniti (r = 1). -/
example : 0 < diskr 1 (0 - 1 * 0) 0 0 1 := (premica_skozi_sredisce 1 0 0 1 one_pos).1

/-- Razlaga 6 in ustno vprašanje 3: tangenta v točki T(x₀, y₀) krožnice je pravokotna na polmer ST:
premica (x₀ − p)(x − x₀) + (y₀ − q)(y − y₀) = 0 ima s krožnico le skupno točko T.
trditev: MAT-SS-3/kroznica#tangenta-v-tocki
besedilo: »Za središče $S(p, q)$ in dotikališče $T(x_0, y_0)$ je zato enačba tangente $(x_0 - p)(x - x_0) + (y_0 - q)(y - y_0) = 0$, saj je skalarni produkt vektorja $\overrightarrow{ST}$ in vektorja od $T$ do poljubne točke $(x, y)$ tangente enak $0$.« -/
theorem tangenta_v_tocki (p q r x₀ y₀ : ℝ) (hT : (x₀ - p) ^ 2 + (y₀ - q) ^ 2 = r ^ 2) (x y : ℝ) :
    ((x - p) ^ 2 + (y - q) ^ 2 = r ^ 2 ∧ (x₀ - p) * (x - x₀) + (y₀ - q) * (y - y₀) = 0) ↔
      (x = x₀ ∧ y = y₀) := by
  constructor
  · rintro ⟨h1, h2⟩
    have e : (x - x₀) ^ 2 + (y - y₀) ^ 2 = 0 := by linear_combination h1 - 2 * h2 - hT
    have a := sq_nonneg (x - x₀)
    have b := sq_nonneg (y - y₀)
    have ha : (x - x₀) ^ 2 = 0 := by linarith
    have hb : (y - y₀) ^ 2 = 0 := by linarith
    exact ⟨by have := pow_eq_zero_iff (n := 2) (by norm_num) |>.1 ha; linarith,
      by have := pow_eq_zero_iff (n := 2) (by norm_num) |>.1 hb; linarith⟩
  · rintro ⟨rfl, rfl⟩; exact ⟨hT, by ring⟩

/-- Predpostavka `tangenta_v_tocki` se da izpolniti (T(4, 2) na (x − 1)² + (y + 2)² = 25). -/
example : ((4 : ℝ) - 1) ^ 2 + (2 - -2) ^ 2 = 5 ^ 2 := by norm_num

/-- Predpostavke trditve `tangenta_v_tocki` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ((4 : ℝ) - 1) ^ 2 + (2 - -2) ^ 2 = 5 ^ 2 := by norm_num
  tangenta_v_tocki (hT := w)

/-- Ustno vprašanje 3: tangenta v T je od središča oddaljena natanko r (r > 0).
trditev: MAT-SS-3/kroznica#tangenta-razdalja
besedilo: »Enakovredno je tangenta premica, ki je od središča oddaljena natanko $r$« -/
theorem tangenta_razdalja (p q r x₀ y₀ : ℝ) (hr : 0 < r) (hT : (x₀ - p) ^ 2 + (y₀ - q) ^ 2 = r ^ 2) :
    |(x₀ - p) * (p - x₀) + (y₀ - q) * (q - y₀)| / Real.sqrt ((x₀ - p) ^ 2 + (y₀ - q) ^ 2) = r := by
  have e : (x₀ - p) * (p - x₀) + (y₀ - q) * (q - y₀) = -r ^ 2 := by linear_combination -hT
  rw [e, hT, Real.sqrt_sq hr.le, abs_neg, abs_of_nonneg (sq_nonneg r)]
  field_simp

/-- Predpostavke `tangenta_razdalja` se dajo izpolniti (naloga 3 b). -/
example : |((4 : ℝ) - 1) * (1 - 4) + (2 - -2) * (-2 - 2)| / Real.sqrt ((4 - 1) ^ 2 + (2 - -2) ^ 2) = 5 :=
  tangenta_razdalja 1 (-2) 5 4 2 (by norm_num) (by norm_num)

/-- Razlaga 7: pri dveh krožnicah enačbi odšteješ; kvadrata se odštejeta in ostane premica
2(p₂ − p₁)x + 2(q₂ − q₁)y = r₁² − r₂² − p₁² + p₂² − q₁² + q₂² skozi obe presečišči.
trditev: MAT-SS-3/kroznica#dve-kroznici
besedilo: »Pri dveh krožnicah enačbi odšteješ. Kvadrata se odštejeta in ostane premica skozi obe presečišči. Nato nadaljuješ kot v bloku 5.« -/
theorem dve_kroznici (x y p₁ q₁ r₁ p₂ q₂ r₂ : ℝ) :
    ((x - p₁) ^ 2 + (y - q₁) ^ 2 = r₁ ^ 2 ∧ (x - p₂) ^ 2 + (y - q₂) ^ 2 = r₂ ^ 2) ↔
      ((x - p₁) ^ 2 + (y - q₁) ^ 2 = r₁ ^ 2 ∧
        2 * (p₂ - p₁) * x + 2 * (q₂ - q₁) * y = r₁ ^ 2 - r₂ ^ 2 - p₁ ^ 2 + p₂ ^ 2 - q₁ ^ 2 + q₂ ^ 2) := by
  constructor
  · rintro ⟨h1, h2⟩; exact ⟨h1, by linear_combination h1 - h2⟩
  · rintro ⟨h1, h2⟩; exact ⟨h1, by linear_combination h1 - h2⟩

/-- Razlaga 7 (parabola y = ax², a ≠ 0): iz parabole je x² = y/a; vstavljeno v enačbo krožnice
(x − p)² + (y − q)² = r² s p = 0 da enačbo za y: y/a + (y − q)² = r².
trditev: MAT-SS-3/kroznica#parabola-vstavi
besedilo: »Pri paraboli $y = ax^2$ izraziš $x^2 = \frac{y}{a}$ in ga vstaviš v enačbo krožnice. Dobiš kvadratno enačbo za $y$.« -/
theorem parabola_vstavi (x y a q r : ℝ) (ha : a ≠ 0) :
    (x ^ 2 + (y - q) ^ 2 = r ^ 2 ∧ y = a * x ^ 2) ↔
      (y / a + (y - q) ^ 2 = r ^ 2 ∧ x ^ 2 = y / a) := by
  constructor
  · rintro ⟨h1, h2⟩
    have hx : x ^ 2 = y / a := by rw [h2]; field_simp
    exact ⟨by rw [← hx]; exact h1, hx⟩
  · rintro ⟨h1, h2⟩
    refine ⟨by rw [h2]; exact h1, ?_⟩
    rw [h2]; field_simp

/-- Predpostavka `parabola_vstavi` se da izpolniti (a = 4/9, Primer 5). -/
example : ((3 : ℝ) ^ 2 + (4 - 0) ^ 2 = 5 ^ 2 ∧ (4 : ℝ) = 4 / 9 * 3 ^ 2) ↔
    ((4 : ℝ) / (4 / 9) + (4 - 0) ^ 2 = 5 ^ 2 ∧ (3 : ℝ) ^ 2 = 4 / (4 / 9)) :=
  parabola_vstavi 3 4 (4 / 9) 0 5 (by norm_num)

/-- Razlaga 7: rešitev za y z x² = y/a < 0 ne da nobene točke, z y/a = 0 eno (x = 0), z y/a > 0 dve,
simetrični glede na os y (x = ±√(y/a)).
trditev: MAT-SS-3/kroznica#parabola-tocke
besedilo: »Pri paraboli rešitev za $y$, pri kateri je $x^2$ negativen, ne da nobene točke. Rešitev s pozitivnim $x^2$ da dve točki, simetrični glede na os $y$, rešitev z $x^2 = 0$ eno samo.« -/
theorem parabola_tocke (x c : ℝ) :
    (c < 0 → x ^ 2 ≠ c) ∧ (c = 0 → (x ^ 2 = c ↔ x = 0)) ∧
    (0 < c → (x ^ 2 = c ↔ x = Real.sqrt c ∨ x = -Real.sqrt c)) := by
  refine ⟨fun h e => by nlinarith [sq_nonneg x], fun h => by rw [h]; exact pow_eq_zero_iff two_ne_zero,
    fun h => ?_⟩
  have hs : Real.sqrt c ^ 2 = c := Real.sq_sqrt h.le
  constructor
  · intro e
    have : (x - Real.sqrt c) * (x + Real.sqrt c) = 0 := by linear_combination e - hs
    rcases mul_eq_zero.1 this with f | f
    · left; linarith
    · right; linarith
  · rintro (e | e)
    · rw [e]; exact hs
    · rw [e, neg_sq]; exact hs

/-- Predpostavke `parabola_tocke` se dajo izpolniti (c = −1, 0, 9). -/
example : ((-1 : ℝ) < 0 → (2 : ℝ) ^ 2 ≠ -1) ∧ ((0 : ℝ) = 0 → ((0 : ℝ) ^ 2 = 0 ↔ (0 : ℝ) = 0)) ∧
    ((0 : ℝ) < 9 → ((3 : ℝ) ^ 2 = 9 ↔ (3 : ℝ) = Real.sqrt 9 ∨ (3 : ℝ) = -Real.sqrt 9)) :=
  parabola_tocke 3 9 |>.2.2 |> fun h => ⟨fun _ => by norm_num, fun _ => by norm_num, h⟩

/-! ## Primer 1 -/

/-- Primer 1, korak 1 in Pogoste napake: (x + 2)² + (y − 3)² = 16 je krožnica s S(−2, 3) in r = 4
(ne S(2, −3)).
trditev: MAT-SS-3/kroznica#primer1-enacba
besedilo: »Vstavimo $p = -2$ in $q = 3$. Minus in minus dasta plus, zato: $(x + 2)^2 + (y - 3)^2 = 16$ je enačba roba.« -/
theorem primer1_enacba (x y : ℝ) :
    (x + 2) ^ 2 + (y - 3) ^ 2 = 16 ↔ (x - (-2)) ^ 2 + (y - 3) ^ 2 = 4 ^ 2 := by
  constructor <;> intro h <;> linear_combination h

/-- Primer 1, koraka 2–4: za A(1, 6) je (1 + 2)² + (6 − 3)² = 18 > 16, A je zunaj; razdalja √18 ≈ 4,24 km.
trditev: MAT-SS-3/kroznica#primer1-a
besedilo: »Odgovor: rob območja je krožnica $(x + 2)^2 + (y - 3)^2 = 16$; vas $A$ ni v dosegu, a je blizu roba ($\sqrt{18} \approx 4{,}24\,\mathrm{km}$ od oddajnika).« -/
theorem primer1_A : ((1 : ℝ) + 2) ^ 2 + (6 - 3) ^ 2 = 18 ∧ (16 : ℝ) < 18 ∧
    |Real.sqrt 18 - 424 / 100| < 5 / 1000 := by
  refine ⟨by norm_num, by norm_num, koren_priblizno (by norm_num) (by norm_num) (by norm_num) (by norm_num)⟩

/-! ## Primer 2 -/

/-- Primer 2, koraki 1–5: x² − 6x = (x − 3)² − 9, y² + 4y = (y + 2)² − 4, 9 + 4 + 12 = 25, enačba je
(x − 3)² + (y + 2)² = 25: S(3, −2), r = √25 = 5.
trditev: MAT-SS-3/kroznica#primer2
besedilo: »Odgovor: središče je $S(3, -2)$, polmer je $r = \sqrt{25} = 5$.« -/
theorem primer2 (x y : ℝ) :
    x ^ 2 - 6 * x = (x - 3) ^ 2 - 9 ∧ y ^ 2 + 4 * y = (y + 2) ^ 2 - 4 ∧
    (x ^ 2 + y ^ 2 - 6 * x + 4 * y - 12 = 0 ↔ (x - 3) ^ 2 - 9 + (y + 2) ^ 2 - 4 - 12 = 0) ∧
    ((x - 3) ^ 2 - 9 + (y + 2) ^ 2 - 4 - 12 = 0 ↔ (x - 3) ^ 2 + (y + 2) ^ 2 = 9 + 4 + 12) ∧
    (9 + 4 + 12 : ℝ) = 25 ∧ Real.sqrt 25 = 5 := by
  refine ⟨by ring, by ring, ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩,
    ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩, by norm_num, ?_⟩
  rw [show (25 : ℝ) = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-! ## Primer 3: Nikina cesta -/

/-- Primer 3, koraki 1–4 (RACUN): presečišči krožnice (x − 3)² + (y − 2)² = 25 in premice y = x − 2 sta
natanko P₁(0, −2) in P₂(7, 5) (koraki: (x − 3)² + (x − 4)² = 25, 2x² − 14x = 0, 2x(x − 7) = 0).
trditev: MAT-SS-3/kroznica#primer3
besedilo: »Pripadajoča $y$ iz premice: $y_1 = 0 - 2 = -2$ in $y_2 = 7 - 2 = 5$. Presečišči sta $P_1(0, -2)$ in $P_2(7, 5)$.« -/
theorem primer3 (x y : ℝ) : ((x - 3) ^ 2 + (y - 2) ^ 2 = 25 ∧ y = x - 2) ↔
    ((x = 0 ∧ y = -2) ∨ (x = 7 ∧ y = 5)) := by
  constructor
  · rintro ⟨h, rfl⟩
    have k1 : (x - 3) ^ 2 + (x - 4) ^ 2 = 25 := by linear_combination h
    have k2 : x ^ 2 - 6 * x + 9 + x ^ 2 - 8 * x + 16 = 25 := by linear_combination k1
    have k3 : 2 * x ^ 2 - 14 * x = 0 := by linear_combination k2
    have k4 : 2 * x * (x - 7) = 0 := by linear_combination k3
    rcases mul_eq_zero.1 k4 with e | e
    · left; constructor <;> linarith
    · right; constructor <;> linarith
  · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩) <;> norm_num

/-- Primer 3, koraka 5–6: preizkus P₂: 4² + 3² = 25; dolžina s = √(7² + 7²) = √98 ≈ 9,9 km.
trditev: MAT-SS-3/kroznica#primer3-dolzina
besedilo: »Preverimo $P_2$ v enačbi krožnice: $4^2 + 3^2 = 25$. Drži. 6. Dolžina: $s = \sqrt{7^2 + 7^2} = \sqrt{98} \approx 9{,}9$, ker se $x$ in $y$ oba spremenita za $7$.« -/
theorem primer3_dolzina : ((7 : ℝ) - 3) ^ 2 + (5 - 2) ^ 2 = 4 ^ 2 + 3 ^ 2 ∧ (4 : ℝ) ^ 2 + 3 ^ 2 = 25 ∧
    Real.sqrt ((7 - 0) ^ 2 + (5 - -2) ^ 2) = Real.sqrt (7 ^ 2 + 7 ^ 2) ∧ (7 : ℝ) ^ 2 + 7 ^ 2 = 98 ∧
    |Real.sqrt 98 - 99 / 10| < 5 / 100 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num,
    koren_priblizno (by norm_num) (by norm_num) (by norm_num) (by norm_num)⟩

/-- Primer 3, korak 3: dve rešitvi pomenita sekanto (D > 0 za y = 1·x − 2).
trditev: MAT-SS-3/kroznica#primer3-sekanta
besedilo: »Izpostavimo: $2x(x - 7) = 0$, rešitvi sta $x_1 = 0$ in $x_2 = 7$. Dve rešitvi pomenita sekanto.« -/
theorem primer3_sekanta : 0 < diskr 1 (-2) 3 2 5 := by unfold diskr discrim; norm_num

/-! ## Primer 4 -/

/-- Primer 4 in premisli: premica 4x + 3y = 43 se krožnice (x − 3)² + (y − 2)² = 25 dotakne le v (7, 5)
(koraki: 9(x − 3)² + (37 − 4x)² = 225, 25x² − 350x + 1225 = 0, x² − 14x + 49 = 0).
trditev: MAT-SS-3/kroznica#primer4
besedilo: »Rešitev je $x = 7$, iz premice $y = 5$. Pot se območja signala le dotakne v točki $(7, 5)$.« -/
theorem primer4 (x y : ℝ) : ((x - 3) ^ 2 + (y - 2) ^ 2 = 25 ∧ 4 * x + 3 * y = 43) ↔ (x = 7 ∧ y = 5) := by
  constructor
  · rintro ⟨h, hl⟩
    have hy : y = (43 - 4 * x) / 3 := by linarith
    have hy2 : y - 2 = (37 - 4 * x) / 3 := by rw [hy]; ring
    have k2 : 9 * (x - 3) ^ 2 + (37 - 4 * x) ^ 2 = 225 := by
      have : (x - 3) ^ 2 + ((37 - 4 * x) / 3) ^ 2 = 25 := by rw [← hy2]; exact h
      linear_combination 9 * this
    have k3 : 25 * x ^ 2 - 350 * x + 1225 = 0 := by linear_combination k2
    have k3' : x ^ 2 - 14 * x + 49 = 0 := by linear_combination k3 / 25
    have : (x - 7) ^ 2 = 0 := by linear_combination k3'
    have hx : x = 7 := by have := pow_eq_zero_iff (n := 2) (by norm_num) |>.1 this; linarith
    exact ⟨hx, by rw [hx] at hl; linarith⟩
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Primer 4, premisli: diskriminanta 14² − 4·49 = 0 (tangenta); ST = (4, 3) je pravokoten na smer (3, −4).
trditev: MAT-SS-3/kroznica#primer4-premisli
besedilo: »Diskriminanta je $14^2 - 4 \cdot 49 = 0$, zato je premica tangenta.« -/
theorem primer4_premisli : (14 : ℝ) ^ 2 - 4 * 49 = 0 ∧ ((7 : ℝ) - 3, (5 : ℝ) - 2) = (4, 3) ∧
    (4 : ℝ) * 3 + 3 * (-4) = 0 := by norm_num

/-! ## Primer 5: krožnica in parabola -/

/-- Primer 5 (RACUN): skupni točki krožnice x² + y² = 25 in parabole y = 4x²/9 sta natanko (3, 4) in (−3, 4)
(koraki: x² = 9y/4, 4y² + 9y − 100 = 0, y = 4 ali y = −6,25; pri y = −6,25 bi bil x² < 0).
trditev: MAT-SS-3/kroznica#primer5
besedilo: »Odgovor: krožnica in parabola imata dve skupni točki, $P_1(3, 4)$ in $P_2(-3, 4)$. Rešitev $y = -6{,}25$ ne ustreza, ker bi zahtevala $x^2 < 0$.« -/
theorem primer5 (x y : ℝ) : (x ^ 2 + y ^ 2 = 25 ∧ y = 4 / 9 * x ^ 2) ↔
    ((x = 3 ∧ y = 4) ∨ (x = -3 ∧ y = 4)) := by
  constructor
  · rintro ⟨h, hp⟩
    have k1 : x ^ 2 = 9 * y / 4 := by rw [hp]; ring
    have k2 : 4 * y ^ 2 + 9 * y - 100 = 0 := by
      have : 9 * y / 4 + y ^ 2 = 25 := by rw [← k1]; exact h
      linear_combination 4 * this
    have k3 : (y - 4) * (4 * y + 25) = 0 := by linear_combination k2
    rcases mul_eq_zero.1 k3 with e | e
    · have hy : y = 4 := by linarith
      have : x ^ 2 = 9 := by rw [k1, hy]; norm_num
      have : (x - 3) * (x + 3) = 0 := by linear_combination this
      rcases mul_eq_zero.1 this with f | f
      · left; exact ⟨by linarith, hy⟩
      · right; exact ⟨by linarith, hy⟩
    · exfalso
      have hy : y = -25 / 4 := by linarith
      have : x ^ 2 < 0 := by rw [k1, hy]; norm_num
      nlinarith [sq_nonneg x]
  · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩) <;> norm_num

/-- Primer 5, korak 3 (RACUN vrednost, resi): diskriminanta 9² + 4·4·100 = 1681 = 41², y = (−9 ± 41)/8 da
4 in −6,25; 4y² + 9y − 100 = 0 ↔ y = −25/4 ali y = 4; 4(9y/4 + y² − 25) = 4y² + 9y − 100.
trditev: MAT-SS-3/kroznica#primer5-kvadratna
besedilo: »Diskriminanta: $9^2 + 4 \cdot 4 \cdot 100 = 1681 = 41^2$, zato $y = \frac{-9 \pm 41}{8}$. Rešitvi sta $y_1 = 4$ in $y_2 = -6{,}25$.« -/
theorem primer5_kvadratna (y : ℝ) : (9 : ℝ) ^ 2 + 4 * 4 * 100 = 1681 ∧ (1681 : ℝ) = 41 ^ 2 ∧
    (-9 + 41 : ℝ) / 8 = 4 ∧ (-9 - 41 : ℝ) / 8 = -625 / 100 ∧
    (4 * y ^ 2 + 9 * y - 100 = 0 ↔ y = -25 / 4 ∨ y = 4) ∧
    4 * (9 * y / 4 + y ^ 2 - 25) = 4 * y ^ 2 + 9 * y - 100 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_, by ring⟩
  rw [show 4 * y ^ 2 + 9 * y - 100 = 4 * (y + 25 / 4) * (y - 4) by ring, mul_eq_zero, mul_eq_zero]
  constructor
  · rintro ((e | e) | e)
    · norm_num at e
    · left; linarith
    · right; linarith
  · rintro (e | e)
    · left; right; linarith
    · right; linarith

/-- Primer 5, korak 5: točke krožnice x² + y² = 25 imajo y² ≤ 25, zato krožnica ne seže do y = −6,25
((−25/4)² = 625/16 > 25).
trditev: MAT-SS-3/kroznica#primer5-korak5
besedilo: »Pri $y_2 = -6{,}25$ bi bil $x^2$ negativen. Ta rešitev ne da točke: parabola ne seže pod os $x$, krožnica pa sploh ne seže do $y = -6{,}25$.« -/
theorem primer5_korak5 (x y : ℝ) (h : x ^ 2 + y ^ 2 = 25) : y ^ 2 ≤ 25 ∧ y ≠ -25 / 4 := by
  have : y ^ 2 ≤ 25 := by nlinarith [sq_nonneg x]
  refine ⟨this, fun e => ?_⟩
  rw [e] at this; norm_num at this

/-- Predpostavka `primer5_korak5` se da izpolniti (točka (3, 4)). -/
example : (4 : ℝ) ^ 2 ≤ 25 ∧ (4 : ℝ) ≠ -25 / 4 := primer5_korak5 3 4 (by norm_num)

/-- Primer 5, koraka 4 in 6 (RACUN vrednost): pri y = 4 je x² = 9·4/4 = 9; preizkus 3² + 4² = 25 in
4/9·9 = 4.
trditev: MAT-SS-3/kroznica#primer5-preizkus
besedilo: »Preizkus za $(3, 4)$: $3^2 + 4^2 = 25$ in $\frac{4}{9} \cdot 9 = 4$.« -/
theorem primer5_preizkus : (9 : ℝ) * 4 / 4 = 9 ∧ (3 : ℝ) ^ 2 + 4 ^ 2 = 25 ∧ (4 : ℝ) / 9 * 9 = 4 := by
  norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake: iz (x − 1)² + y² = 9 je r = √9 = 3; pri r = 4 je desna stran 16; x² − 6x se razlikuje
od (x − 3)² za 9.
trditev: MAT-SS-3/kroznica#napake
besedilo: »Na desni je $r^2$, zato je $r = 3$. Obratno: pri $r = 4$ na desno napiši $16$, ne $4$.« -/
theorem napake (x : ℝ) : Real.sqrt 9 = 3 ∧ (4 : ℝ) ^ 2 = 16 ∧ (x - 3) ^ 2 - (x ^ 2 - 6 * x) = 9 := by
  refine ⟨?_, by norm_num, by ring⟩
  rw [show (9 : ℝ) = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-! ## Za maturo -/

/-- Naloga 1 (RACUN vrednost, enako): središče S(2, 0) je razpolovišče AB, |AB| = √(6² + (−8)²) = √100 = 10,
r = 5; enačba (x − 2)² + y² = 25, ki jo izpolnita A in B; (x − 2)² + y² − 25 = x² − 4x + y² − 21.
trditev: MAT-SS-3/kroznica#matura1
besedilo: »Središče je razpolovišče premera: $S\left(\frac{-1 + 5}{2}, \frac{4 + (-4)}{2}\right) = S(2, 0)$. 2. Dolžina premera je $|AB| = \sqrt{6^2 + (-8)^2} = \sqrt{100} = 10$, zato je polmer $r = 5$. 3. Odgovor: enačba krožnice je $(x - 2)^2 + y^2 = 25$.« -/
theorem matura1 (x y : ℝ) : ((-1 : ℝ) + 5) / 2 = 2 ∧ ((4 : ℝ) + -4) / 2 = 0 ∧
    Real.sqrt ((5 - -1) ^ 2 + (-4 - 4) ^ 2) = Real.sqrt (6 ^ 2 + (-8) ^ 2) ∧
    Real.sqrt (6 ^ 2 + (-8) ^ 2) = Real.sqrt 100 ∧ Real.sqrt 100 = 10 ∧ (10 : ℝ) / 2 = 5 ∧
    ((-1 : ℝ) - 2) ^ 2 + 4 ^ 2 = 25 ∧ ((5 : ℝ) - 2) ^ 2 + (-4) ^ 2 = 25 ∧
    (x - 2) ^ 2 + y ^ 2 - 25 = x ^ 2 - 4 * x + y ^ 2 - 21 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_, by norm_num, by norm_num, by norm_num,
    by ring⟩
  rw [show (100 : ℝ) = 10 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Naloga 2 a) (RACUN enako): x² + 4x = (x + 2)² − 4, y² − 2y = (y − 1)² − 1, enačba je
(x + 2)² + (y − 1)² = 25: S(−2, 1), r = 5.
trditev: MAT-SS-3/kroznica#matura2a
besedilo: »a) Enačba postane $(x + 2)^2 - 4 + (y - 1)^2 - 1 - 20 = 0$ oziroma $(x + 2)^2 + (y - 1)^2 = 25$. Središče je $S(-2, 1)$, polmer $r = 5$.« -/
theorem matura2a (x y : ℝ) : x ^ 2 + 4 * x = (x + 2) ^ 2 - 4 ∧ y ^ 2 - 2 * y = (y - 1) ^ 2 - 1 ∧
    (x ^ 2 + y ^ 2 + 4 * x - 2 * y - 20 = 0 ↔ (x + 2) ^ 2 - 4 + (y - 1) ^ 2 - 1 - 20 = 0) ∧
    (x ^ 2 + y ^ 2 + 4 * x - 2 * y - 20 = 0 ↔ (x - (-2)) ^ 2 + (y - 1) ^ 2 = 5 ^ 2) ∧
    (x + 2) ^ 2 + (y - 1) ^ 2 - 25 = x ^ 2 + y ^ 2 + 4 * x - 2 * y - 20 := by
  refine ⟨by ring, by ring, ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩,
    ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩, by ring⟩

/-- Naloga 2 b) (RACUN enako, resi): presečišči krožnice in premice x + y = 4 sta natanko P₁(3, 1) in
P₂(−2, 6) (koraki (x + 2)² + (3 − x)² = 25, 2x² − 2x − 12 = 0, x² − x − 6 = 0, (x − 3)(x + 2) = 0).
trditev: MAT-SS-3/kroznica#matura2b
besedilo: »b) Razstavimo: $(x - 3)(x + 2) = 0$, zato $x_1 = 3$ in $x_2 = -2$. Iz premice $y_1 = 1$ in $y_2 = 6$. Presečišči sta $P_1(3, 1)$ in $P_2(-2, 6)$.« -/
theorem matura2b (x y : ℝ) : ((x + 2) ^ 2 + (y - 1) ^ 2 = 25 ∧ x + y = 4) ↔
    ((x = 3 ∧ y = 1) ∨ (x = -2 ∧ y = 6)) := by
  constructor
  · rintro ⟨h, hl⟩
    have hy : y = 4 - x := by linarith
    subst hy
    have k1 : (x + 2) ^ 2 + (3 - x) ^ 2 = 25 := by linear_combination h
    have k2 : x ^ 2 + 4 * x + 4 + 9 - 6 * x + x ^ 2 = 25 := by linear_combination k1
    have k3 : 2 * x ^ 2 - 2 * x - 12 = 0 := by linear_combination k2
    have k4 : x ^ 2 - x - 6 = 0 := by linear_combination k3 / 2
    have k5 : (x - 3) * (x + 2) = 0 := by linear_combination k4
    rcases mul_eq_zero.1 k5 with e | e
    · left; constructor <;> linarith
    · right; constructor <;> linarith
  · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩) <;> norm_num

/-- Naloga 2 b) (RACUN): (x + 2)² + (3 − x)² − 25 = 2x² − 2x − 12 in x² − x − 6 = 0 ↔ x = −2 ali x = 3.
trditev: MAT-SS-3/kroznica#matura2b-racun
besedilo: »b) Odpravimo oklepaje: $x^2 + 4x + 4 + 9 - 6x + x^2 = 25$, torej $2x^2 - 2x - 12 = 0$ oziroma $x^2 - x - 6 = 0$.« -/
theorem matura2b_racun (x : ℝ) : (x + 2) ^ 2 + (3 - x) ^ 2 - 25 = 2 * x ^ 2 - 2 * x - 12 ∧
    (x ^ 2 - x - 6 = 0 ↔ x = -2 ∨ x = 3) := by
  refine ⟨by ring, ?_⟩
  rw [show x ^ 2 - x - 6 = (x + 2) * (x - 3) by ring, mul_eq_zero]
  constructor
  · rintro (e | e)
    · left; linarith
    · right; linarith
  · rintro (e | e)
    · left; linarith
    · right; linarith

/-- Naloga 2 c) (RACUN vrednost): SP₁ = (5, 0) je vzporedna z osjo x, SP₂ = (0, 5) z osjo y, skalarni produkt
0 (pravi kot pri S); ploščina 5·5/2 = 25/2 (tudi po formuli |det(SP₁, SP₂)|/2).
trditev: MAT-SS-3/kroznica#matura2c
besedilo: »Kot pri $S$ je pravi, kateti sta polmera dolžine $5$. 7. c) Ploščina: $\frac{5 \cdot 5}{2} = \frac{25}{2}$.« -/
theorem matura2c : ((3 : ℝ) - -2, (1 : ℝ) - 1) = (5, 0) ∧ ((-2 : ℝ) - -2, (6 : ℝ) - 1) = (0, 5) ∧
    (5 : ℝ) * 0 + 0 * 5 = 0 ∧ (5 : ℝ) * 5 / 2 = 25 / 2 ∧ |(5 : ℝ) * 5 - 0 * 0| / 2 = 25 / 2 := by
  norm_num

/-- Naloga 3 a) (RACUN enako, vrednost): S(1, −2), r = 5; za A(8, −1) je (8 − 1)² + (−1 + 2)² = 49 + 1 = 50 > 25,
A je zunaj.
trditev: MAT-SS-3/kroznica#matura3a
besedilo: »a) Za točko $A$: $(8 - 1)^2 + (-1 + 2)^2 = 49 + 1 = 50$. Ker je $50 > 25$, točka $A$ leži zunaj krožnice.« -/
theorem matura3a (x y : ℝ) :
    (x ^ 2 + y ^ 2 - 2 * x + 4 * y - 20 = 0 ↔ (x - 1) ^ 2 + (y - (-2)) ^ 2 = 5 ^ 2) ∧
    x ^ 2 - 2 * x = (x - 1) ^ 2 - 1 ∧ y ^ 2 + 4 * y = (y + 2) ^ 2 - 4 ∧
    (x - 1) ^ 2 + (y + 2) ^ 2 - 25 = x ^ 2 + y ^ 2 - 2 * x + 4 * y - 20 ∧
    ((8 : ℝ) - 1) ^ 2 + (-1 + 2) ^ 2 = 49 + 1 ∧ (49 + 1 : ℝ) = 50 ∧ (25 : ℝ) < 50 := by
  refine ⟨⟨fun h => by linear_combination h, fun h => by linear_combination h⟩, by ring, by ring, by ring,
    by norm_num, by norm_num, by norm_num⟩

/-- Naloga 3 b) (RACUN vrednost, enako): T(4, 2) je na krožnici (9 + 16 = 25); tangenta v T je
3(x − 4) + 4(y − 2) = 0, tj. 3x + 4y = 20, in ima s krožnico le skupno točko T; gre skozi A: 24 − 4 = 20.
trditev: MAT-SS-3/kroznica#matura3b
besedilo: »Tangenta je pravokotna na polmer $ST$, zato je $\overrightarrow{ST} = (3, 4)$ njen normalni vektor. Enačba tangente: $3(x - 4) + 4(y - 2) = 0$ oziroma $3x + 4y = 20$.« -/
theorem matura3b : ((4 : ℝ) - 1) ^ 2 + (2 + 2) ^ 2 = 9 + 16 ∧ (9 + 16 : ℝ) = 25 ∧
    (∀ x y : ℝ, 3 * (x - 4) + 4 * (y - 2) = 3 * x + 4 * y - 20) ∧
    (∀ x y : ℝ, ((x - 1) ^ 2 + (y - -2) ^ 2 = 5 ^ 2 ∧ 3 * x + 4 * y = 20) ↔ (x = 4 ∧ y = 2)) ∧
    3 * (8 : ℝ) + 4 * (-1) = 24 - 4 ∧ (24 - 4 : ℝ) = 20 := by
  refine ⟨by norm_num, by norm_num, fun x y => by ring, fun x y => ?_, by norm_num, by norm_num⟩
  rw [← tangenta_v_tocki 1 (-2) 5 4 2 (by norm_num) x y]
  constructor
  · rintro ⟨h1, h2⟩; exact ⟨h1, by linear_combination h2⟩
  · rintro ⟨h1, h2⟩; exact ⟨h1, by linear_combination h2⟩

/-- Naloga 3 c), korak 6: navpična premica x = 8 je od S oddaljena 8 − 1 = 7 > 5 in s krožnico nima skupnih
točk (ni tangenta).
trditev: MAT-SS-3/kroznica#matura3c-navpicna
besedilo: »c) Navpična premica $x = 8$ je od središča oddaljena $8 - 1 = 7 > 5$, zato ni tangenta.« -/
theorem matura3c_navpicna : (8 : ℝ) - 1 = 7 ∧ (5 : ℝ) < 7 ∧
    ∀ y : ℝ, ((8 : ℝ) - 1) ^ 2 + (y - -2) ^ 2 ≠ 5 ^ 2 := by
  refine ⟨by norm_num, by norm_num, fun y h => ?_⟩
  nlinarith [sq_nonneg (y - -2)]

/-- Naloga 3 c), koraki 7–8 (RACUN enako, resi): vstavljanje premice y + 1 = k(x − 8) da
(k² + 1)x² − 2(8k² − k + 1)x + 64k² − 16k − 23 = 0; četrtina diskriminante je −24k² + 14k + 24; premica je
tangenta natanko pri 12k² − 7k − 12 = 0, tj. k = 4/3 ali k = −3/4; enako da (1 − 7k)² = 25(k² + 1).
trditev: MAT-SS-3/kroznica#matura3c
besedilo: »c) Premica je tangenta natanko tedaj, ko je diskriminanta te kvadratne enačbe enaka $0$. Njena četrtina je $(8k^2 - k + 1)^2 - (k^2 + 1)(64k^2 - 16k - 23) = -24k^2 + 14k + 24$, zato $12k^2 - 7k - 12 = 0$. Rešitvi sta $k = \frac{7 \pm 25}{24}$, torej $k = \frac43$ in $k = -\frac34$. (Enako enačbo da pogoj, da je razdalja središča od premice enaka polmeru: $(1 - 7k)^2 = 25(k^2 + 1)$.)« -/
theorem matura3c (k x : ℝ) :
    (x - 1) ^ 2 + (k * x - 8 * k + 1) ^ 2 - 25 =
      (k ^ 2 + 1) * x ^ 2 - 2 * (8 * k ^ 2 - k + 1) * x + 64 * k ^ 2 - 16 * k - 23 ∧
    (8 * k ^ 2 - k + 1) ^ 2 - (k ^ 2 + 1) * (64 * k ^ 2 - 16 * k - 23) = -24 * k ^ 2 + 14 * k + 24 ∧
    (jeTangenta k (-8 * k - 1) 1 (-2) 5 ↔ 12 * k ^ 2 - 7 * k - 12 = 0) ∧
    (12 * k ^ 2 - 7 * k - 12 = 0 ↔ k = -3 / 4 ∨ k = 4 / 3) ∧
    ((1 - 7 * k) ^ 2 = 25 * (k ^ 2 + 1) ↔ k = -3 / 4 ∨ k = 4 / 3) := by
  have kv : 12 * k ^ 2 - 7 * k - 12 = 0 ↔ k = -3 / 4 ∨ k = 4 / 3 := by
    rw [show 12 * k ^ 2 - 7 * k - 12 = 12 * (k + 3 / 4) * (k - 4 / 3) by ring, mul_eq_zero, mul_eq_zero]
    constructor
    · rintro ((e | e) | e)
      · norm_num at e
      · left; linarith
      · right; linarith
    · rintro (e | e)
      · left; right; linarith
      · right; linarith
  refine ⟨by ring, by ring, ?_, kv, ?_⟩
  · rw [tangenta_iff, diskr, discrim]
    constructor
    · intro h; linear_combination (-1 / 8 : ℝ) * h
    · intro h; linear_combination (-8 : ℝ) * h
  · rw [← kv]
    constructor
    · intro h; linear_combination (1 / 2 : ℝ) * h
    · intro h; linear_combination (2 : ℝ) * h

/-- Naloga 3 c), korak 9: tangenta iz b) ima smerni koeficient −3/4 (3x + 4y = 20 ↔ y + 1 = −3/4(x − 8));
druga tangenta y + 1 = 4/3(x − 8) je 4x − 3y = 35 (RACUN: 3(y + 1) − 4(x − 8) = 3y − 4x + 35).
trditev: MAT-SS-3/kroznica#matura3c-tangenti
besedilo: »c) Smerni koeficient $-\frac34$ ima tangenta iz b). Druga tangenta je $y + 1 = \frac43(x - 8)$ oziroma $4x - 3y = 35$.« -/
theorem matura3c_tangenti (x y : ℝ) : (3 * x + 4 * y = 20 ↔ y + 1 = -3 / 4 * (x - 8)) ∧
    (y + 1 = 4 / 3 * (x - 8) ↔ 4 * x - 3 * y = 35) ∧ 3 * (y + 1) - 4 * (x - 8) = 3 * y - 4 * x + 35 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    by ring⟩

/-- Naloga 3 c), korak 10 (RACUN enako, vrednost): dotikališče druge tangente 4x − 3y = 35 je B(5, −5)
(9(x − 1)² + (4x − 29)² − 225 = 25(x − 5)²); preizkus (5 − 1)² + (−5 + 2)² = 25.
trditev: MAT-SS-3/kroznica#matura3c-b
besedilo: »Vstavimo v enačbo krožnice in pomnožimo z $9$: $9(x - 1)^2 + (4x - 29)^2 = 225$, torej $25x^2 - 250x + 625 = 0$ oziroma $(x - 5)^2 = 0$. Dvojna rešitev $x = 5$ da $y = \frac{20 - 35}{3} = -5$, zato je $B(5, -5)$.« -/
theorem matura3c_B (x y : ℝ) : 9 * (x - 1) ^ 2 + (4 * x - 29) ^ 2 - 225 = 25 * (x - 5) ^ 2 ∧
    (((x - 1) ^ 2 + (y + 2) ^ 2 = 25 ∧ 4 * x - 3 * y = 35) ↔ (x = 5 ∧ y = -5)) ∧
    ((5 : ℝ) - 1) ^ 2 + (-5 + 2) ^ 2 = 25 := by
  refine ⟨by ring, ?_, by norm_num⟩
  constructor
  · rintro ⟨h, hl⟩
    have hy : y + 2 = (4 * x - 29) / 3 := by linarith
    have : 9 * (x - 1) ^ 2 + (4 * x - 29) ^ 2 = 225 := by
      have e : (x - 1) ^ 2 + ((4 * x - 29) / 3) ^ 2 = 25 := by rw [← hy]; exact h
      linear_combination 9 * e
    have : 25 * (x - 5) ^ 2 = 0 := by linear_combination this
    have : (x - 5) ^ 2 = 0 := by linarith
    have hx : x = 5 := by have := pow_eq_zero_iff (n := 2) (by norm_num) |>.1 this; linarith
    exact ⟨hx, by rw [hx] at hl; linarith⟩
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Naloga 3 d) (RACUN vrednost): produkt smernih koeficientov 4/3·(−3/4) = −1 (pravokotni tangenti);
ATSB je kvadrat s stranico 5 (stranice AT = (−4, 3), TS = (−3, −4), SB = (4, −3), BA = (3, 4) dolžine 5 in
pravokotne zaporedne), ploščina 25 (tudi po formuli za ploščino mnogokotnika).
trditev: MAT-SS-3/kroznica#matura3d
besedilo: »d) Produkt smernih koeficientov je $\frac43 \cdot \left(-\frac34\right) = -1$, zato sta tangenti pravokotni. 12. d) Štirikotnik $ATSB$ ima pravi kot pri $A$ ter prava kota pri $T$ in $B$, ker je tangenta pravokotna na polmer. Zato je pravokotnik. Ker je $|ST| = |SB| = 5$, je kvadrat s stranico $5$. Ploščina je $25$.« -/
theorem matura3d : (4 / 3 : ℝ) * (-3 / 4) = -1 ∧
    ((4 : ℝ) - 8, (2 : ℝ) - -1) = (-4, 3) ∧ ((1 : ℝ) - 4, (-2 : ℝ) - 2) = (-3, -4) ∧
    ((5 : ℝ) - 1, (-5 : ℝ) - -2) = (4, -3) ∧ ((8 : ℝ) - 5, (-1 : ℝ) - -5) = (3, 4) ∧
    (-4 : ℝ) ^ 2 + 3 ^ 2 = 5 ^ 2 ∧ (-3 : ℝ) ^ 2 + (-4) ^ 2 = 5 ^ 2 ∧ (4 : ℝ) ^ 2 + (-3) ^ 2 = 5 ^ 2 ∧
    (3 : ℝ) ^ 2 + 4 ^ 2 = 5 ^ 2 ∧
    (-4 : ℝ) * -3 + 3 * -4 = 0 ∧ (-3 : ℝ) * 4 + -4 * -3 = 0 ∧ (4 : ℝ) * 3 + -3 * 4 = 0 ∧
    (3 : ℝ) * -4 + 4 * 3 = 0 ∧ (5 : ℝ) * 5 = 25 ∧
    |(8 * 2 - 4 * (-1) + (4 * (-2) - 1 * 2) + (1 * (-5) - 5 * (-2)) + (5 * (-1) - 8 * (-5)) : ℝ)| / 2 = 25 := by
  norm_num

/-! ## Ustno vprašanje 2, Korak za korakom, Preveri se -/

/-- Ustno vprašanje 2 (RACUN enako): x² + y² − 2x + 5 = 0 je (x − 1)² + y² = −4 in nima nobene točke.
trditev: MAT-SS-3/kroznica#ustno2
besedilo: »Z dopolnjevanjem do popolnega kvadrata jo preoblikujemo v $(x - 1)^2 + y^2 = -4$. Vsota kvadratov ne more biti negativna, zato tej enačbi ne ustreza nobena točka.« -/
theorem ustno2 (x y : ℝ) : (x - 1) ^ 2 + y ^ 2 + 4 = x ^ 2 + y ^ 2 - 2 * x + 5 ∧
    (x ^ 2 + y ^ 2 - 2 * x + 5 = 0 ↔ (x - 1) ^ 2 + y ^ 2 = -4) ∧ x ^ 2 + y ^ 2 - 2 * x + 5 ≠ 0 := by
  refine ⟨by ring, ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩, fun h => ?_⟩
  nlinarith [sq_nonneg (x - 1), sq_nonneg y]

/-- Drugače: Korak za korakom: premica y = x + 1 in krožnica x² + y² = 13 se sekata natanko v (2, 3) in
(−3, −2) (koraki 2x² + 2x − 12 = 0, x² + x − 6 = 0, diskriminanta 1² − 4·(−6) = 25 > 0).
trditev: MAT-SS-3/kroznica#korak-za-korakom
besedilo: »Iz premice: $y_1 = 3$, $y_2 = -2$. Presečišči sta $(2, 3)$ in $(-3, -2)$.« -/
theorem korak_za_korakom (x y : ℝ) : ((x ^ 2 + y ^ 2 = 13 ∧ y = x + 1) ↔
    ((x = 2 ∧ y = 3) ∨ (x = -3 ∧ y = -2))) ∧ (1 : ℝ) ^ 2 - 4 * (-6) = 25 ∧
    (2 : ℝ) * (-3) = -6 ∧ (2 : ℝ) + (-3) = -1 ∧ (2 : ℝ) ^ 2 + 3 ^ 2 = 13 ∧ (-3 : ℝ) ^ 2 + (-2) ^ 2 = 13 := by
  refine ⟨⟨?_, ?_⟩, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  · rintro ⟨h, rfl⟩
    have k2 : x ^ 2 + (x + 1) ^ 2 = 13 := h
    have k3 : 2 * x ^ 2 + 2 * x - 12 = 0 := by linear_combination k2
    have k4 : x ^ 2 + x - 6 = 0 := by linear_combination k3 / 2
    have k6 : (x - 2) * (x + 3) = 0 := by linear_combination k4
    rcases mul_eq_zero.1 k6 with e | e
    · left; constructor <;> linarith
    · right; constructor <;> linarith
  · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩) <;> norm_num

/-- Preveri se, vprašanje 1: (x + 1)² + (y − 3)² = −4 nima točke; x² + y² − 4x = 0 ↔ (x − 2)² + y² = 4;
x² + y² + 2y = 3 ↔ x² + (y + 1)² = 4.
trditev: MAT-SS-3/kroznica#preveri1
besedilo: »Vsota kvadratov ne more biti negativna, zato enačbi $(x + 1)^2 + (y - 3)^2 = -4$ ne ustreza nobena točka.« -/
theorem preveri1 (x y : ℝ) : (x + 1) ^ 2 + (y - 3) ^ 2 ≠ -4 ∧
    (x ^ 2 + y ^ 2 - 4 * x = 0 ↔ (x - 2) ^ 2 + y ^ 2 = 4) ∧
    (x ^ 2 + y ^ 2 + 2 * y = 3 ↔ x ^ 2 + (y + 1) ^ 2 = 4) := by
  refine ⟨fun h => by nlinarith [sq_nonneg (x + 1), sq_nonneg (y - 3)],
    ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩,
    ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩⟩

/-- Preveri se, vprašanje 2: x² + y² + 8x − 2y + 8 = 0 ↔ (x + 4)² + (y − 1)² = 9: S(−4, 1), r = √9 = 3.
trditev: MAT-SS-3/kroznica#preveri2
besedilo: »$(x + 4)^2 - 16 + (y - 1)^2 - 1 + 8 = 0$, torej $(x + 4)^2 + (y - 1)^2 = 9$ in $r = 3$.« -/
theorem preveri2 (x y : ℝ) :
    (x ^ 2 + y ^ 2 + 8 * x - 2 * y + 8 = 0 ↔ (x + 4) ^ 2 - 16 + (y - 1) ^ 2 - 1 + 8 = 0) ∧
    (x ^ 2 + y ^ 2 + 8 * x - 2 * y + 8 = 0 ↔ (x - (-4)) ^ 2 + (y - 1) ^ 2 = 9) ∧ Real.sqrt 9 = 3 :=
  ⟨⟨fun h => by linear_combination h, fun h => by linear_combination h⟩,
    ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩, (napake 0).1⟩

/-- Preveri se, vprašanje 4: x² − 10x = (x − 5)² − 25, y² + 6y = (y + 3)² − 9; pravilna desna stran je
25 + 9 − 9 = 25 (ne 43), r = 5.
trditev: MAT-SS-3/kroznica#preveri4
besedilo: »Prosti člen $+9$ se pri prenosu na desno spremeni v $-9$: desna stran je $25 + 9 - 9 = 25$, zato je $r = 5$.« -/
theorem preveri4 (x y : ℝ) : x ^ 2 - 10 * x = (x - 5) ^ 2 - 25 ∧ y ^ 2 + 6 * y = (y + 3) ^ 2 - 9 ∧
    (x ^ 2 + y ^ 2 - 10 * x + 6 * y + 9 = 0 ↔ (x - 5) ^ 2 + (y + 3) ^ 2 = 25 + 9 - 9) ∧
    (25 + 9 - 9 : ℝ) = 25 ∧ (25 + 9 - 9 : ℝ) ≠ 43 ∧ Real.sqrt 25 = 5 := by
  refine ⟨by ring, by ring, ⟨fun h => by linear_combination h, fun h => by linear_combination h⟩,
    by norm_num, by norm_num, ?_⟩
  rw [show (25 : ℝ) = 5 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Preveri se, vprašanje 5: 2² + 2² = 8 < 9 = 3² (kmetija je v dosegu), razdalja √8 ≈ 2,83 km.
trditev: MAT-SS-3/kroznica#preveri5
besedilo: »Kmetija je $\sqrt{8} \approx 2{,}83\,\mathrm{km}$ od vzletišča, torej znotraj kroga z enačbo roba $x^2 + y^2 = 9$.« -/
theorem preveri5 : (2 : ℝ) ^ 2 + 2 ^ 2 = 8 ∧ (8 : ℝ) < 3 ^ 2 ∧ |Real.sqrt 8 - 283 / 100| < 5 / 1000 :=
  ⟨by norm_num, by norm_num, koren_priblizno (by norm_num) (by norm_num) (by norm_num) (by norm_num)⟩

/-- Preveri se, vprašanje 6 (RACUN enako, resi): krožnica x² + y² = 25 in hiperbola y = 12/x imata natanko
4 skupne točke (3, 4), (4, 3), (−3, −4), (−4, −3); x²(x² + (12/x)² − 25) = x⁴ − 25x² + 144 (x ≠ 0),
z² − 25z + 144 = 0 ↔ z = 9 ali z = 16.
trditev: MAT-SS-3/kroznica#preveri6
besedilo: »Vstavimo $y = \frac{12}{x}$ in pomnožimo z $x^2$: $x^4 - 25x^2 + 144 = 0$, torej $x^2 = 9$ ali $x^2 = 16$. Točke so $(3, 4)$, $(4, 3)$, $(-3, -4)$ in $(-4, -3)$.« -/
theorem preveri6 (x y z : ℝ) :
    ((x ^ 2 + y ^ 2 = 25 ∧ y = 12 / x) ↔
      ((x = 3 ∧ y = 4) ∨ (x = 4 ∧ y = 3) ∨ (x = -3 ∧ y = -4) ∨ (x = -4 ∧ y = -3))) ∧
    (x ≠ 0 → x ^ 2 * (x ^ 2 + (12 / x) ^ 2 - 25) = x ^ 4 - 25 * x ^ 2 + 144) ∧
    (z ^ 2 - 25 * z + 144 = 0 ↔ z = 9 ∨ z = 16) := by
  have kz : ∀ z : ℝ, z ^ 2 - 25 * z + 144 = 0 ↔ z = 9 ∨ z = 16 := by
    intro z
    rw [show z ^ 2 - 25 * z + 144 = (z - 9) * (z - 16) by ring, mul_eq_zero, sub_eq_zero, sub_eq_zero]
  have ke : ∀ x : ℝ, x ≠ 0 → x ^ 2 * (x ^ 2 + (12 / x) ^ 2 - 25) = x ^ 4 - 25 * x ^ 2 + 144 := by
    intro x hx; field_simp; ring
  refine ⟨⟨?_, ?_⟩, ke x, kz z⟩
  · rintro ⟨h, rfl⟩
    have hx : x ≠ 0 := by rintro rfl; norm_num at h
    have k : x ^ 4 - 25 * x ^ 2 + 144 = 0 := by rw [← ke x hx, h]; ring
    have k' : (x ^ 2) ^ 2 - 25 * x ^ 2 + 144 = 0 := by linear_combination k
    rcases (kz (x ^ 2)).1 k' with e | e
    · have : (x - 3) * (x + 3) = 0 := by linear_combination e
      rcases mul_eq_zero.1 this with f | f
      · left; have : x = 3 := by linarith
        subst this; norm_num
      · right; right; left; have : x = -3 := by linarith
        subst this; norm_num
    · have : (x - 4) * (x + 4) = 0 := by linear_combination e
      rcases mul_eq_zero.1 this with f | f
      · right; left; have : x = 4 := by linarith
        subst this; norm_num
      · right; right; right; have : x = -4 := by linarith
        subst this; norm_num
  · rintro (⟨rfl, rfl⟩ | ⟨rfl, rfl⟩ | ⟨rfl, rfl⟩ | ⟨rfl, rfl⟩) <;> norm_num

/-- Preveri se, vprašanje 7 (RACUN vrednost): r = √((−4 − 2)² + (7 + 1)²) = √(36 + 64) = √100 = 10.
trditev: MAT-SS-3/kroznica#preveri7
besedilo: »$r = \sqrt{(-4 - 2)^2 + (7 + 1)^2} = \sqrt{36 + 64} = \sqrt{100} = 10$« -/
theorem preveri7 : Real.sqrt ((-4 - 2) ^ 2 + (7 + 1) ^ 2) = Real.sqrt (36 + 64) ∧
    Real.sqrt (36 + 64) = Real.sqrt 100 ∧ Real.sqrt 100 = 10 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  rw [show (100 : ℝ) = 10 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

end Evklid.Lekcije.MAT_SS_3.Kroznica
