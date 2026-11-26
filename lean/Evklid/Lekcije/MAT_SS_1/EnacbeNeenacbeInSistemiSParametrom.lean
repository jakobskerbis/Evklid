/-
vir: content/lessons/MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom.md
sha256: 5a6966295f37c9f60e9c3347e1411ea26b1592236f2456b3fc4f9b325e44b365
Ni v Leanu: zgodovina (Viète) in zdravniški zgledi kot modeli (dokazana je algebra: 20 + at ≥ 12 pri
a = −2, 3, 0 in 30 + at ≤ 45 za t ≥ 0); risbe, drsnik in simulacija; »lega premic« (sekata, vzporedni,
sovpadata) je dokazana kot število rešitev sistema (ena, nobena, neskončno oz. enaki enačbi); pogoj
»vzporedni ali sovpadata ⇔ a₁b₂ = a₂b₁« je dokazan kot: a₁b₂ − a₂b₁ ≠ 0 ⇒ natanko ena rešitev, = 0 (in
a₁, b₁ ne oba 0) ⇒ ne natanko ene rešitve; »determinanta« kot poimenovanje; postopki v korakih (Ponovitev,
razvrščanje korakov v Preveri se 5, točkovanje) in nasveti (»preveri s konkretno vrednostjo«, »ne krajšaj
brez pogoja«) kot navodila (dokazani so preizkusi pri konkretnih m in to, da krajšanje izgubi primer m = 2);
analogiji (garaža je dokazana kot x < y ⇒ −y < −x, planinske poti so opis); besedilo napačnih odgovorov v
Preveri se (kjer gre, je dokazano, da napačna vrednost ni pravilna). Odgovori »za m ≠ ±k ena rešitev …«
so dokazani kot ↔ (natanko ta rešitev). Naloga 2 e) je dokazana v branju »kadar ima sistem natanko eno
rešitev« (`m2_e_ena`); kot opomba je dokazano še, da pri m = 3 (neskončno rešitev) na y = 2x leži (3/8, 3/4).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.EnacbeNeenacbeInSistemiSParametrom

/-! ## Razlaga 1: en bolnik -/

/-- Razlaga 1, RACUN: pri a = −2: 20 − 2t ≥ 12 ⇔ −2t ≥ −8 ⇔ t ≤ 4 (zdravilo deluje 4 ure).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#r1-minus2
besedilo: »Dobimo $-2t \ge -8$. Delimo z negativnim številom $-2$, zato se znak obrne: $t \le 4$. Zdravilo deluje $4$ ure.« -/
theorem r1_minus2 (t : ℝ) : 20 + (-2) * t ≥ 12 ↔ t ≤ 4 := by
  calc 20 + (-2) * t ≥ 12 ↔ -2 * t ≥ -8 := by constructor <;> intro h <;> linarith
    _ ↔ t ≤ 4 := by constructor <;> intro h <;> linarith

/-- Razlaga 1, RACUN: pri a = 3: 20 + 3t ≥ 12 ⇔ 3t ≥ −8 ⇔ t ≥ −8/3; to velja za vsak t ≥ 0.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#r1-plus3
besedilo: »Pri $a = 3$ (dovajanje prevlada) je $3t \ge -8$, torej $t \ge -\dfrac{8}{3}$. To velja za vsak $t \ge 0$: zdravilo deluje ves čas.« -/
theorem r1_plus3 (t : ℝ) : (20 + 3 * t ≥ 12 ↔ t ≥ -8 / 3) ∧ (0 ≤ t → 20 + 3 * t ≥ 12) := by
  refine ⟨?_, fun h => by linarith⟩
  calc 20 + 3 * t ≥ 12 ↔ 3 * t ≥ -8 := by constructor <;> intro h <;> linarith
    _ ↔ t ≥ -8 / 3 := by constructor <;> intro h <;> linarith

/-- Razlaga 1: pri a = 0: 0·t ≥ −8 velja vedno.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#r1-nic
besedilo: »Pri $a = 0$ dobimo $0 \cdot t \ge -8$, kar prav tako velja vedno.« -/
theorem r1_nic (t : ℝ) : 20 + 0 * t ≥ (12:ℝ) := by linarith

/-! ## Razlaga 2: neenačba ax > b -/

/-- Razlaga 2, Ustno 1, Povzetek: pri a > 0 je ax > b ⇔ x > b/a.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#neen-poz
besedilo: »Za $a > 0$ obe strani delimo s pozitivnim številom, znak ostane in rešitev je $x > \dfrac{b}{a}$.« -/
theorem neen_poz (a b x : ℝ) (ha : 0 < a) : a * x > b ↔ x > b / a := by
  rw [gt_iff_lt, gt_iff_lt, div_lt_iff₀ ha]
  constructor <;> intro h <;> linarith

/-- Predpostavka `neen_poz` se da izpolniti (a = 2). -/
example : (0:ℝ) < 2 := by norm_num

/-- Razlaga 2, Ustno 1, Povzetek: pri a < 0 je ax > b ⇔ x < b/a (znak obrnjen).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#neen-neg
besedilo: »Za $a < 0$ delimo z negativnim številom, zato se znak obrne in rešitev je $x < \dfrac{b}{a}$.« -/
theorem neen_neg (a b x : ℝ) (ha : a < 0) : a * x > b ↔ x < b / a := by
  rw [gt_iff_lt, lt_div_iff_of_neg ha]
  constructor <;> intro h <;> linarith

/-- Predpostavka `neen_neg` se da izpolniti (a = −2). -/
example : (-2:ℝ) < 0 := by norm_num

/-- Razlaga 2, Ustno 1, Pogoste napake 3: pri a = 0 je 0·x > b za vsak x, če je b < 0.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#neen-nic-vsi
besedilo: »Ta neenačba velja za vsak $x$, če je $b < 0$« -/
theorem neen_nic_vsi (b : ℝ) (hb : b < 0) : ∀ x : ℝ, 0 * x > b := by
  intro x; simpa using hb

/-- Predpostavka `neen_nic_vsi` se da izpolniti (b = −1). -/
example : (-1:ℝ) < 0 := by norm_num

/-- Razlaga 2, Ustno 1: pri a = 0 in b ≥ 0 neenačba 0·x > b nima rešitve.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#neen-nic-noben
besedilo: »in za noben $x$, če je $b \ge 0$« -/
theorem neen_nic_noben (b : ℝ) (hb : 0 ≤ b) : ∀ x : ℝ, ¬ (0 * x > b) := by
  intro x h; simp at h; linarith

/-- Predpostavka `neen_nic_noben` se da izpolniti (b = 0). -/
example : (0:ℝ) ≤ 0 := le_rfl

/-- Razlaga 2, Pogoste napake 3: pri ax ≥ b in a = b = 0 so rešitev vsa realna števila (0 ≥ 0 velja,
0 > 0 ne).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#neen-nestroga-nic
besedilo: »Pazi še na strogost: $0 > 0$ ne velja, $0 \ge 0$ velja.« -/
theorem neen_nestroga_nic (x : ℝ) : 0 * x ≥ (0:ℝ) ∧ ¬ (0 * x > (0:ℝ)) := by
  constructor <;> simp

/-- Razlaga 2: koeficient m − 1 je pozitiven za m > 1, negativen za m < 1, enak 0 pri m = 1.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#r2-koeficient
besedilo: »Pri $(m-1)x > 3$ je koeficient $m - 1$: pozitiven za $m > 1$, negativen za $m < 1$, enak $0$ pri $m = 1$.« -/
theorem r2_koeficient (m : ℝ) : (m > 1 ↔ m - 1 > 0) ∧ (m < 1 ↔ m - 1 < 0) ∧ (m = 1 ↔ m - 1 = 0) :=
  ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩⟩

/-- Razlaga 2, Premisli (Ana): pri m = 0 x = 0 ni rešitev −x > 3 (0 > 3 ne velja), po Aninem zapisu pa bi bil
(0 > 3/(0 − 1) = −3); za m < 1 je rešitev x < 3/(m − 1).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#r2-ana
besedilo: »Pri $m = 0$ je neenačba $-x > 3$, za $x = 0$ dobimo $0 > 3$, kar ne velja. Po Aninem zapisu pa bi bil $x = 0$ rešitev, saj je $0 > -3$. Za $m < 1$ je koeficient negativen in znak se obrne: $x < \dfrac{3}{m-1}$.« -/
theorem r2_ana : ¬ ((0 - 1) * (0:ℝ) > 3) ∧ (0:ℝ) > 3 / (0 - 1) ∧
    ∀ m x : ℝ, m < 1 → ((m - 1) * x > 3 ↔ x < 3 / (m - 1)) := by
  refine ⟨by norm_num, by norm_num, fun m x hm => neen_neg (m - 1) 3 x (by linarith)⟩

/-! ## Razlaga 3: enačba ax = b -/

/-- Razlaga 3, Povzetek: pri a ≠ 0 je ax = b ⇔ x = b/a (ena rešitev).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#enacba-ena
besedilo: »$ax = b$, $a \ne 0$: ena rešitev $x = \frac{b}{a}$« -/
theorem enacba_ena (a b x : ℝ) (ha : a ≠ 0) : a * x = b ↔ x = b / a := by
  rw [eq_div_iff ha]
  constructor <;> intro h <;> linarith

/-- Predpostavka `enacba_ena` se da izpolniti (a = 3). -/
example : (3:ℝ) ≠ 0 := by norm_num

/-- Razlaga 3, Povzetek, Ustno 3: pri a = 0, b ≠ 0 ni rešitve (npr. 0 = 5, 0 = 8).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#enacba-nobena
besedilo: »pri $a = 0$ in $b \neq 0$ nobene« -/
theorem enacba_nobena (b : ℝ) (hb : b ≠ 0) : ∀ x : ℝ, 0 * x ≠ b := by
  intro x h; simp at h; exact hb h.symm

/-- Predpostavka `enacba_nobena` se da izpolniti (b = 5). -/
example : (5:ℝ) ≠ 0 := by norm_num

/-- Razlaga 3, Povzetek, Ustno 3, Pogoste napake 4: pri a = b = 0 je rešitev vsak x (0 = 0 ne pomeni x = 0).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#enacba-vse
besedilo: »pri $a = 0$ in $b = 0$ pa je rešitev vsako realno število« -/
theorem enacba_vse (x : ℝ) : 0 * x = (0:ℝ) := by ring

/-- Razlaga 3, RACUN: m² − 4 = (m − 2)(m + 2) in (m − 2)/((m − 2)(m + 2)) = 1/(m + 2) za m ≠ ±2.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#r3-razstavi
besedilo: »Koeficient razstavimo: $(m-2)(m+2)x = m - 2$.« -/
theorem r3_razstavi (m : ℝ) (h2 : m ≠ 2) (_h2' : m ≠ -2) :
    m ^ 2 - 4 = (m - 2) * (m + 2) ∧ (m - 2) / ((m - 2) * (m + 2)) = 1 / (m + 2) := by
  have ha : m - 2 ≠ 0 := sub_ne_zero.mpr h2
  refine ⟨by ring, ?_⟩
  rw [div_mul_eq_div_div, div_self ha]

/-- Predpostavki `r3_razstavi` se dasta izpolniti (m = 1). -/
example : (1:ℝ) ≠ 2 ∧ (1:ℝ) ≠ -2 := by norm_num

/-- Razlaga 3: za m ≠ ±2 je (m² − 4)x = m − 2 ⇔ x = 1/(m + 2).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#r3-ena
besedilo: »Za $m \neq 2$ in $m \neq -2$: $x = \dfrac{m-2}{(m-2)(m+2)} = \dfrac{1}{m+2}$.« -/
theorem r3_ena (m x : ℝ) (h2 : m ≠ 2) (h2' : m ≠ -2) : (m ^ 2 - 4) * x = m - 2 ↔ x = 1 / (m + 2) := by
  have ha : m - 2 ≠ 0 := sub_ne_zero.mpr h2
  have hb : m + 2 ≠ 0 := fun h => h2' (by linarith)
  rw [eq_div_iff hb]
  constructor
  · intro h
    have : (m - 2) * (x * (m + 2) - 1) = 0 := by linear_combination h
    rcases mul_eq_zero.mp this with h0 | h0
    · exact absurd h0 ha
    · linarith
  · intro h; linear_combination (m - 2) * h

/-- Predpostavki `r3_ena` se dasta izpolniti (m = 1). -/
example : (1:ℝ) ≠ 2 ∧ (1:ℝ) ≠ -2 := by norm_num

/-- Razlaga 3, RACUN: pri m = 1 je (1² − 4)x = 1 − 2 ⇔ x = 1/3 (= 1/(1 + 2)).
pomozno – le vrstica bloka RACUN (preizkus pri m = 1); v vidnem besedilu tega primera ni -/
theorem r3_m1 (x : ℝ) : (1 ^ 2 - 4) * x = 1 - 2 ↔ x = 1 / 3 :=
  ⟨fun h => by linarith, fun h => by subst h; norm_num⟩

/-- Razlaga 3: pri m = 2 je enačba 0·x = 0 (vsak x), pri m = −2 je 0·x = −4 (rešitve ni).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#r3-posebni
besedilo: »Za $m = 2$: $0 \cdot x = 0$, rešitev je vsako realno število. - Za $m = -2$: $0 \cdot x = -4$, rešitve ni.« -/
theorem r3_posebni (x : ℝ) : ((2:ℝ) ^ 2 - 4) * x = 2 - 2 ∧ ¬ (((-2:ℝ) ^ 2 - 4) * x = -2 - 2) := by
  constructor
  · ring
  · intro h; norm_num at h

/-! ## Razlaga 4: sistem s parametrom -/

/-- Pomožno: sistem iz Razlage 4: y = mx + 1, y = (m² − 2)x + m − 1. -/
def sistem4 (m x y : ℝ) : Prop := y = m * x + 1 ∧ y = (m ^ 2 - 2) * x + m - 1

/-- Razlaga 4, RACUN: pri m = 1 (y = x + 1, y = −x) je x + 1 = −x ⇔ x = −1/2, rešitev natanko (−1/2, 1/2).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#r4-m1
besedilo: »Izenačimo: $x + 1 = -x$, torej $x = -\dfrac{1}{2}$ in $y = \dfrac{1}{2}$.« -/
theorem r4_m1 (x y : ℝ) : (x + 1 = -x ↔ x = -1 / 2) ∧ (sistem4 1 x y ↔ (x = -1 / 2 ∧ y = 1 / 2)) := by
  refine ⟨⟨fun h => by linarith, fun h => by subst h; norm_num⟩, ?_⟩
  unfold sistem4
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> nlinarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Razlaga 4, RACUN: mx + 1 = (m² − 2)x + m − 1 ⇔ (m − m² + 2)x = m − 2, in m − m² + 2 = −(m − 2)(m + 1).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#r4-izenaci
besedilo: »Izenačimo desni strani: $mx + 1 = (m^2 - 2)x + m - 1$. Člene z $x$ zberemo na levi: $(m - m^2 + 2)x = m - 2$. Koeficient razstavimo, $m - m^2 + 2 = -(m-2)(m+1)$« -/
theorem r4_izenaci (m x : ℝ) : (m * x + 1 = (m ^ 2 - 2) * x + m - 1 ↔ (m - m ^ 2 + 2) * x = m - 2) ∧
    m - m ^ 2 + 2 = -(m - 2) * (m + 1) :=
  ⟨⟨fun h => by linear_combination h, fun h => by linear_combination h⟩, by ring⟩

/-- Razlaga 4, RACUN: za m ≠ 2, −1 ima sistem natanko rešitev x = −1/(m + 1), y = m·x + 1 = 1/(m + 1).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#r4-ena
besedilo: »Za $m \neq 2$ in $m \neq -1$: $x = -\dfrac{1}{m+1}$ in $y = mx + 1 = \dfrac{1}{m+1}$. Ena rešitev.« -/
theorem r4_ena (m x y : ℝ) (h2 : m ≠ 2) (h1 : m ≠ -1) :
    sistem4 m x y ↔ (x = -1 / (m + 1) ∧ y = 1 / (m + 1)) := by
  have ha : m - 2 ≠ 0 := sub_ne_zero.mpr h2
  have hb : m + 1 ≠ 0 := fun h => h1 (by linarith)
  unfold sistem4
  rw [eq_div_iff hb, eq_div_iff hb]
  constructor
  · rintro ⟨e1, e2⟩
    have : (m - 2) * ((m + 1) * x + 1) = 0 := by linear_combination e1 - e2
    rcases mul_eq_zero.mp this with h0 | h0
    · exact absurd h0 ha
    · exact ⟨by linarith, by rw [e1]; linear_combination m * h0⟩
  · rintro ⟨e1, e2⟩
    have hx : x = -1 / (m + 1) := by rw [eq_div_iff hb]; exact e1
    have hy : y = 1 / (m + 1) := by rw [eq_div_iff hb]; exact e2
    subst hx hy
    constructor <;> field_simp <;> ring

/-- Predpostavki `r4_ena` se dasta izpolniti (m = 1). -/
example : (1:ℝ) ≠ 2 ∧ (1:ℝ) ≠ -1 := by norm_num

/-- Razlaga 4, RACUN: m·(−1/(m + 1)) + 1 = 1/(m + 1) (za m ≠ −1); pri m = 1 formula da (−1/2, 1/2),
pri m = 3 (−1/4, 1/4).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#r4-preizkus
besedilo: »Preizkus pri $m = 1$: formula da $x = -\dfrac{1}{2}$ in $y = \dfrac{1}{2}$, enako kot zgoraj.« -/
theorem r4_preizkus (m : ℝ) (h1 : m ≠ -1) : m * (-1 / (m + 1)) + 1 = 1 / (m + 1) ∧
    (-1:ℝ) / (1 + 1) = -1 / 2 ∧ (1:ℝ) / (1 + 1) = 1 / 2 ∧ (-1:ℝ) / (3 + 1) = -1 / 4 := by
  have hb : m + 1 ≠ 0 := fun h => h1 (by linarith)
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  field_simp; ring

/-- Predpostavka `r4_preizkus` se da izpolniti (m = 1). -/
example : (1:ℝ) ≠ -1 := by norm_num

/-- Razlaga 4, RACUN (m = 3): y = 3x + 1, y = 7x + 2 ima natanko rešitev (−1/4, 1/4).
pomozno – le vrstica bloka RACUN (sistem pri m = 3); v vidnem besedilu tega primera ni -/
theorem r4_m3 (x y : ℝ) : sistem4 3 x y ↔ (x = -1 / 4 ∧ y = 1 / 4) := by
  rw [r4_ena 3 x y (by norm_num) (by norm_num)]; norm_num

/-- Razlaga 4: pri m = 2 sta obe enačbi y = 2x + 1 (0·x = 0, neskončno rešitev).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#r4-m2
besedilo: »Za $m = 2$: $0 \cdot x = 0$. Obe enačbi sta $y = 2x + 1$: neskončno rešitev.« -/
theorem r4_m2 (x y : ℝ) : sistem4 2 x y ↔ y = 2 * x + 1 := by
  unfold sistem4
  constructor
  · rintro ⟨h, _⟩; exact h
  · intro h; exact ⟨h, by rw [h]; ring⟩

/-- Razlaga 4: pri m = −1 sta premici y = −x + 1 in y = −x − 2 (0·x = −3), rešitve ni.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#r4-m-minus1
besedilo: »Za $m = -1$: $0 \cdot x = -3$. Premici $y = -x + 1$ in $y = -x - 2$ sta vzporedni: rešitve ni.« -/
theorem r4_m_minus1 (x y : ℝ) : ((-1) * x + 1 = -x + 1 ∧ ((-1:ℝ) ^ 2 - 2) * x + (-1) - 1 = -x - 2) ∧
    ¬ sistem4 (-1) x y := by
  refine ⟨⟨by ring, by ring⟩, ?_⟩
  unfold sistem4
  rintro ⟨h1, h2⟩
  nlinarith

/-- Razlaga 4, Premisli: smerna koeficienta m in m² − 2 sta enaka natanko pri m = 2 ali m = −1; pri m = 2 sta
začetni vrednosti 1 in 2 − 1 = 1 enaki, pri m = −1 sta 1 in −2 različni.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#r4-premisli
besedilo: »Smerna koeficienta sta $m$ in $m^2 - 2$; enaka sta, ko je $m^2 - m - 2 = 0$, torej pri $m = 2$ in $m = -1$.« -/
theorem r4_premisli (m : ℝ) : (m = m ^ 2 - 2 ↔ m = 2 ∨ m = -1) ∧ (2:ℝ) - 1 = 1 ∧ (-1:ℝ) - 1 ≠ 1 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  constructor
  · intro h
    have : (m - 2) * (m + 1) = 0 := by linear_combination -h
    rcases mul_eq_zero.mp this with h0 | h0
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Razlaga 4: združena enačba Ax = B: pri A ≠ 0 ena rešitev, pri A = 0, B ≠ 0 nobena, pri A = B = 0 vsak x.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#zdruzena
besedilo: »| $a \neq 0$ | ena | | $a = 0$, $b \neq 0$ | nobena | | $a = 0$, $b = 0$ | vsak $x \in \mathbb{R}$ |« -/
theorem zdruzena (A B : ℝ) : (A ≠ 0 → ∃! x : ℝ, A * x = B) ∧ (A = 0 → B ≠ 0 → ∀ x : ℝ, A * x ≠ B) ∧
    (A = 0 → B = 0 → ∀ x : ℝ, A * x = B) := by
  refine ⟨fun hA => ⟨B / A, by field_simp, fun y hy => (enacba_ena A B y hA).mp hy⟩, ?_, ?_⟩
  · rintro rfl hB x h; simp at h; exact hB h.symm
  · rintro rfl rfl x; ring

/-! ## Primer 1 -/

/-- Primer 1, korak 1: mx − 1 > 2x + 3 ⇔ (m − 2)x > 4.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#primer1-uredi
besedilo: »Člene z $x$ zberemo na levi: $mx - 2x > 3 + 1$, torej $(m - 2)x > 4$.« -/
theorem p1_uredi (m x : ℝ) : m * x - 1 > 2 * x + 3 ↔ (m - 2) * x > 4 := by
  constructor <;> intro h <;> linarith

/-- Primer 1, koraki 2–4 in 6: za m > 2 je x > 4/(m − 2), za m < 2 je x < 4/(m − 2), za m = 2 rešitve ni.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#primer1
besedilo: »Odgovor: za $m > 2$ je $x \in \left(\dfrac{4}{m-2}, \infty\right)$, za $m < 2$ je $x \in \left(-\infty, \dfrac{4}{m-2}\right)$, za $m = 2$ rešitve ni.« -/
theorem p1_resitev (m x : ℝ) :
    (m > 2 → (m * x - 1 > 2 * x + 3 ↔ x ∈ Set.Ioi (4 / (m - 2)))) ∧
    (m < 2 → (m * x - 1 > 2 * x + 3 ↔ x ∈ Set.Iio (4 / (m - 2)))) ∧
    (m = 2 → ¬ (m * x - 1 > 2 * x + 3)) := by
  refine ⟨fun hm => ?_, fun hm => ?_, fun hm => ?_⟩
  · rw [p1_uredi, Set.mem_Ioi]; exact neen_poz _ _ _ (by linarith)
  · rw [p1_uredi, Set.mem_Iio]; exact neen_neg _ _ _ (by linarith)
  · rw [p1_uredi, hm]; simp

/-- Primer 1, korak 5, RACUN: pri m = 0: −2x > 4 ⇔ x < −2, formula 4/(0 − 2) = −2; pri m = 4: 2x > 4 ⇔ x > 2.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#primer1-preizkus
besedilo: »Preizkus pri $m = 0$: $-2x > 4$ da $x < -2$, formula da $\dfrac{4}{0 - 2} = -2$.« -/
theorem p1_preizkus (x : ℝ) : (-2 * x > 4 ↔ x < -2) ∧ (4:ℝ) / (0 - 2) = -2 ∧ (2 * x > 4 ↔ x > 2) :=
  ⟨⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, ⟨fun h => by linarith, fun h => by linarith⟩⟩

/-- Pogoste napake 1: zapis x > 4/(m − 2) za vse m je napačen: pri m = 0 je x = −3 rešitev, ne pa x > −2.
pomozno – izrek je le protiprimer pri m = 0 (x = −3); lekcija trdi splošno »za m < 2 ravno nasprotne rešitve« (p1_resitev) -/
theorem p1_napaka : (0:ℝ) * (-3) - 1 > 2 * (-3) + 3 ∧ ¬ ((-3:ℝ) > 4 / (0 - 2)) := by norm_num

/-! ## Primer 2 -/

/-- Primer 2, korak 1: ax + 3 ≤ x + a + 2 ⇔ (a − 1)x ≤ a − 1.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#primer2-uredi
besedilo: »Uredimo: $ax - x \le a + 2 - 3$, torej $(a - 1)x \le a - 1$.« -/
theorem p2_uredi (a x : ℝ) : a * x + 3 ≤ x + a + 2 ↔ (a - 1) * x ≤ a - 1 := by
  constructor <;> intro h <;> linarith

/-- Primer 2, koraki 2–5, RACUN: za a > 1 je x ≤ 1, za a < 1 je x ≥ 1, za a = 1 vsak x.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#primer2
besedilo: »Odgovor: za $a > 1$ je $x \in (-\infty, 1]$, za $a < 1$ je $x \in [1, \infty)$, za $a = 1$ je rešitev vsako realno število.« -/
theorem p2_resitev (a x : ℝ) :
    (a > 1 → (a * x + 3 ≤ x + a + 2 ↔ x ∈ Set.Iic 1)) ∧
    (a < 1 → (a * x + 3 ≤ x + a + 2 ↔ x ∈ Set.Ici 1)) ∧
    (a = 1 → a * x + 3 ≤ x + a + 2) := by
  refine ⟨fun ha => ?_, fun ha => ?_, fun ha => ?_⟩
  · rw [p2_uredi, Set.mem_Iic]
    constructor
    · intro h; nlinarith
    · intro h; nlinarith
  · rw [p2_uredi, Set.mem_Ici]
    constructor
    · intro h; nlinarith
    · intro h; nlinarith
  · rw [p2_uredi, ha]; simp

/-- Primer 2 (primerjava): enačba (a − 1)x = a − 1 ima za vsak a ≠ 1 isto rešitev x = 1.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#primer2-enacba
besedilo: »Primerjaj z enačbo $(a-1)x = a - 1$: tam je za vse $a \neq 1$ rešitev ista, $x = 1$.« -/
theorem p2_enacba (a x : ℝ) (ha : a ≠ 1) : (a - 1) * x = a - 1 ↔ x = 1 := by
  have h : a - 1 ≠ 0 := sub_ne_zero.mpr ha
  rw [enacba_ena _ _ _ h, div_self h]

/-- Predpostavka `p2_enacba` se da izpolniti (a = 2). -/
example : (2:ℝ) ≠ 1 := by norm_num

/-! ## Primer 3 -/

/-- Pomožno: sistem iz Primera 3: x + my = 2, mx + 4y = 4. -/
def sistemP3 (m x y : ℝ) : Prop := x + m * y = 2 ∧ m * x + 4 * y = 4

/-- Primer 3, koraka 1–3, RACUN: iz x = 2 − my: m(2 − my) + 4y = 4 ⇔ (4 − m²)y = 4 − 2m, in
(2 − m)(2 + m) = 4 − m², 4 − 2m = 2(2 − m).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#primer3-koraki
besedilo: »Vstavimo v drugo: $m(2 - my) + 4y = 4$, torej $(4 - m^2)y = 4 - 2m$. 3. Razstavimo: $(2 - m)(2 + m)y = 2(2 - m)$.« -/
theorem p3_koraki (m y : ℝ) : (m * (2 - m * y) + 4 * y = 4 ↔ (4 - m ^ 2) * y = 4 - 2 * m) ∧
    (2 - m) * (2 + m) = 4 - m ^ 2 ∧ 4 - 2 * m = 2 * (2 - m) :=
  ⟨⟨fun h => by linear_combination h, fun h => by linear_combination h⟩, by ring, by ring⟩

/-- Primer 3, korak 4, RACUN: za m ≠ ±2 ima sistem natanko rešitev (4/(m + 2), 2/(m + 2)).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#primer3
besedilo: »za $m \neq \pm 2$ je ena rešitev $\left(\dfrac{4}{m+2}, \dfrac{2}{m+2}\right)$« -/
theorem p3_ena (m x y : ℝ) (h2 : m ≠ 2) (h2' : m ≠ -2) :
    sistemP3 m x y ↔ (x = 4 / (m + 2) ∧ y = 2 / (m + 2)) := by
  have ha : 2 - m ≠ 0 := fun h => h2 (by linarith)
  have hb : m + 2 ≠ 0 := fun h => h2' (by linarith)
  unfold sistemP3
  rw [eq_div_iff hb, eq_div_iff hb]
  constructor
  · rintro ⟨e1, e2⟩
    have : (2 - m) * (y * (m + 2) - 2) = 0 := by linear_combination e2 - m * e1
    rcases mul_eq_zero.mp this with h0 | h0
    · exact absurd h0 ha
    · have hy : y * (m + 2) = 2 := by linarith
      exact ⟨by linear_combination (m + 2) * e1 - m * hy, hy⟩
  · rintro ⟨e1, e2⟩
    have hx : x = 4 / (m + 2) := by rw [eq_div_iff hb]; exact e1
    have hy : y = 2 / (m + 2) := by rw [eq_div_iff hb]; exact e2
    subst hx hy
    constructor
    · field_simp; ring
    · field_simp

/-- Predpostavki `p3_ena` se dasta izpolniti (m = 0). -/
example : (0:ℝ) ≠ 2 ∧ (0:ℝ) ≠ -2 := by norm_num

/-- Primer 3, korak 4, RACUN: 2 − 2m/(m + 2) = 4/(m + 2) (za m ≠ −2).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#primer3-x
besedilo: »$x = 2 - \dfrac{2m}{m+2} = \dfrac{4}{m+2}$« -/
theorem p3_x (m : ℝ) (h2' : m ≠ -2) : 2 - 2 * m / (m + 2) = 4 / (m + 2) := by
  have hb : m + 2 ≠ 0 := fun h => h2' (by linarith)
  field_simp; ring

/-- Predpostavka `p3_x` se da izpolniti (m = 0). -/
example : (0:ℝ) ≠ -2 := by norm_num

/-- Primer 3, korak 5: pri m = 2 je druga enačba 2x + 4y = 4 dvakratnik prve, rešitve so vsi pari prve.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#primer3-m2
besedilo: »Za $m = 2$: $0 \cdot y = 0$. Druga enačba $2x + 4y = 4$ je dvakratnik prve: premici sovpadata, rešitev je neskončno.« -/
theorem p3_m2 (x y : ℝ) : sistemP3 2 x y ↔ x + 2 * y = 2 := by
  unfold sistemP3
  exact ⟨fun h => h.1, fun h => ⟨h, by linarith⟩⟩

/-- Primer 3, korak 6, RACUN: pri m = −2 (0·y = 8; x − 2y = 2 in −2x + 4y = 4, tj. x − 2y = −2) rešitve ni.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#primer3-m-minus2
besedilo: »Za $m = -2$: $0 \cdot y = 8$. Enačbi sta $x - 2y = 2$ in $-2x + 4y = 4$, kar je po deljenju z $-2$ enako $x - 2y = -2$: vzporedni premici, rešitve ni.« -/
theorem p3_m_minus2 (x y : ℝ) : (-2 * x + 4 * y = 4 ↔ x - 2 * y = -2) ∧ ¬ sistemP3 (-2) x y := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ?_⟩
  unfold sistemP3
  rintro ⟨h1, h2⟩; linarith

/-- Primer 3, korak 7, RACUN: pri m = 0 ima sistem x = 2, 4y = 4 rešitev (2, 1) = (4/2, 2/2); pri m = 3
(x + 3y = 2, 3x + 4y = 4) rešitev (4/5, 2/5).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#primer3-preizkus
besedilo: »Preizkus pri $m = 0$: sistem $x = 2$, $4y = 4$ ima rešitev $(2, 1)$, formula da $\left(\dfrac{4}{2}, \dfrac{2}{2}\right) = (2, 1)$.« -/
theorem p3_preizkus (x y : ℝ) : (sistemP3 0 x y ↔ (x = 2 ∧ y = 1)) ∧ (4:ℝ) / 2 = 2 ∧ (2:ℝ) / 2 = 1 ∧
    (sistemP3 3 x y ↔ (x = 4 / 5 ∧ y = 2 / 5)) := by
  refine ⟨?_, by norm_num, by norm_num, ?_⟩
  · rw [p3_ena 0 x y (by norm_num) (by norm_num)]; norm_num
  · rw [p3_ena 3 x y (by norm_num) (by norm_num)]; norm_num

/-- Pogoste napake 5: kdor v (2 − m)(2 + m)y = 2(2 − m) krajša 2 − m, dobi (2 + m)y = 2, ki pri m = 2 da
samo y = 1/2, prvotna enačba pa pri m = 2 velja za vsak y (izgubljen primer).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#napaka-krajsanje
besedilo: »Kdor v $(2 - m)(2 + m)y = 2(2 - m)$ kar krajša $2 - m$, izgubi primer $m = 2$ z neskončno rešitvami.« -/
theorem napaka_krajsanje : (∀ y : ℝ, (2 - 2) * (2 + 2) * y = 2 * (2 - 2)) ∧
    ¬ (∀ y : ℝ, (2 + 2) * y = (2:ℝ)) := by
  refine ⟨fun y => by ring, fun h => ?_⟩
  have := h 0
  norm_num at this

/-! ## Primer 4 -/

/-- Primer 4: 30 + at ≤ 45 ⇔ at ≤ 15; pri a ≤ 0 je to res za vsak t ≥ 0; pri a > 0 je t ≤ 15/a;
pri a = 5 t ≤ 15/5 = 3 (RACUN: 30 + 5t ≤ 45 ⇔ t ≤ 3).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#primer4
besedilo: »Za $a > 0$ delimo s pozitivnim številom in znak ostane: $t \le \dfrac{15}{a}$. Pri $a = 5$ je $t \le \dfrac{15}{5} = 3$: bolnik je varen $3$ ure.« -/
theorem p4 (a t : ℝ) : (30 + a * t ≤ 45 ↔ a * t ≤ 15) ∧ (a ≤ 0 → 0 ≤ t → 30 + a * t ≤ 45) ∧
    (0 < a → (30 + a * t ≤ 45 ↔ t ≤ 15 / a)) ∧ (30 + 5 * t ≤ 45 ↔ t ≤ 3) ∧ (15:ℝ) / 5 = 3 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, fun ha ht => by nlinarith, fun ha => ?_,
    ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num⟩
  rw [le_div_iff₀ ha]
  constructor <;> intro h <;> linarith

/-! ## Za maturo: Naloga 1 -/

/-- Naloga 1 a), RACUN: pri m = 0: 0 ≥ 3x − 6 ⇔ 3x ≤ 6 ⇔ x ≤ 2, interval (−∞, 2].
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#naloga1a
besedilo: »Pri $m = 0$ je neenačba $0 \ge 3x - 6$, torej $3x \le 6$ in $x \le 2$, kar je interval $(-\infty, 2]$.« -/
theorem m1_a (x : ℝ) : 0 * (x - 1) ≥ 3 * x - 6 ↔ x ∈ Set.Iic (2:ℝ) := by
  rw [Set.mem_Iic]
  calc 0 * (x - 1) ≥ 3 * x - 6 ↔ 3 * x ≤ 6 := by constructor <;> intro h <;> linarith
    _ ↔ x ≤ 2 := by constructor <;> intro h <;> linarith

/-- Naloga 1 b), korak 2, RACUN: m(x − 1) ≥ 3x − 6 ⇔ (m − 3)x ≥ m − 6, ker
m(x − 1) − (3x − 6) = (m − 3)x − (m − 6).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#naloga1-uredi
besedilo: »Uredimo: $mx - m \ge 3x - 6$, $mx - 3x \ge m - 6$, torej $(m - 3)x \ge m - 6$.« -/
theorem m1_uredi (m x : ℝ) : (m * (x - 1) - (3 * x - 6) = (m - 3) * x - (m - 6)) ∧
    (m * (x - 1) ≥ 3 * x - 6 ↔ (m - 3) * x ≥ m - 6) :=
  ⟨by ring, ⟨fun h => by linarith, fun h => by linarith⟩⟩

/-- Naloga 1 b), koraki 3–5: za m > 3 je x ≥ (m − 6)/(m − 3), za m < 3 je x ≤ (m − 6)/(m − 3), za m = 3
vsak x (0·x ≥ −3).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#naloga1b
besedilo: »b) za $m > 3$ je $x \in \left[\dfrac{m - 6}{m - 3}, \infty\right)$, za $m < 3$ je $x \in \left(-\infty, \dfrac{m - 6}{m - 3}\right]$, za $m = 3$ je rešitev vsako realno število« -/
theorem m1_b (m x : ℝ) :
    (m > 3 → (m * (x - 1) ≥ 3 * x - 6 ↔ x ∈ Set.Ici ((m - 6) / (m - 3)))) ∧
    (m < 3 → (m * (x - 1) ≥ 3 * x - 6 ↔ x ∈ Set.Iic ((m - 6) / (m - 3)))) ∧
    (m = 3 → m * (x - 1) ≥ 3 * x - 6) := by
  refine ⟨fun hm => ?_, fun hm => ?_, fun hm => ?_⟩
  · rw [(m1_uredi m x).2, Set.mem_Ici, ge_iff_le, div_le_iff₀ (by linarith)]
    constructor <;> intro h <;> linarith
  · rw [(m1_uredi m x).2, Set.mem_Iic, le_div_iff_of_neg (by linarith)]
    constructor <;> intro h <;> linarith
  · subst hm; linarith

/-- Naloga 1 b), korak 6, RACUN: (0 − 6)/(0 − 3) = 2; pri m = 4: 4(x − 1) ≥ 3x − 6 ⇔ x ≥ −2 in
(4 − 6)/(4 − 3) = −2.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#naloga1-preizkus
besedilo: »Preizkus pri $m = 0$: $\dfrac{0 - 6}{0 - 3} = 2$ in $x \le 2$, enako kot v a). Pri $m = 4$: $4x - 4 \ge 3x - 6$ da $x \ge -2$, formula pa $\dfrac{4 - 6}{4 - 3} = -2$.« -/
theorem m1_preizkus (x : ℝ) : (0 - 6 : ℝ) / (0 - 3) = 2 ∧ (4 * (x - 1) ≥ 3 * x - 6 ↔ x ≥ -2) ∧
    (4 - 6 : ℝ) / (4 - 3) = -2 :=
  ⟨by norm_num, ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num⟩

/-- Naloga 1 c), RACUN: 0 je rešitev natanko za m ≤ 6 (m(0 − 1) ≥ 0 − 6 ⇔ −m ≥ −6).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#naloga1c
besedilo: »Vstavimo $x = 0$: $m \cdot (0 - 1) \ge 0 - 6$, torej $-m \ge -6$ in $m \le 6$.« -/
theorem m1_c (m : ℝ) : m * (0 - 1) ≥ 3 * 0 - 6 ↔ m ≤ 6 := by
  calc m * (0 - 1) ≥ 3 * 0 - 6 ↔ -m ≥ -6 := by constructor <;> intro h <;> linarith
    _ ↔ m ≤ 6 := by constructor <;> intro h <;> linarith

/-! ## Za maturo: Naloga 2 -/

/-- Pomožno: sistem Naloge 2: (m + 1)x + 2y = 3, 4x + (m − 1)y = m. -/
def sistemN2 (m x y : ℝ) : Prop := (m + 1) * x + 2 * y = 3 ∧ 4 * x + (m - 1) * y = m

/-- Naloga 2 a), RACUN: pri m = 0 (x + 2y = 3, 4x − y = 0, y = 4x, 9x = 3) je rešitev natanko (1/3, 4/3).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#naloga2a
besedilo: »Pri $m = 0$ je sistem $x + 2y = 3$, $4x - y = 0$. Iz druge enačbe je $y = 4x$; vstavimo v prvo: $9x = 3$, torej $x = \dfrac{1}{3}$ in $y = \dfrac{4}{3}$.« -/
theorem m2_a (x y : ℝ) : (x + 8 * x = 3 ↔ x = 1 / 3) ∧ (sistemN2 0 x y ↔ (x = 1 / 3 ∧ y = 4 / 3)) := by
  refine ⟨⟨fun h => by linarith, fun h => by subst h; norm_num⟩, ?_⟩
  unfold sistemN2
  constructor
  · rintro ⟨h1, h2⟩; constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Naloga 2 b), RACUN: (m + 1)(m − 1) − 8 = m² − 9, 3(m − 1) − 2m = m − 3, in iz sistema sledi
(m² − 9)x = m − 3 (prva·(m − 1) − druga·2).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#naloga2b
besedilo: »Enačbi odštejemo: $\big((m + 1)(m - 1) - 8\big)x = 3(m - 1) - 2m$, torej $(m^2 - 9)x = m - 3$.« -/
theorem m2_b (m x y : ℝ) : (m + 1) * (m - 1) - 8 = m ^ 2 - 9 ∧ 3 * (m - 1) - 2 * m = m - 3 ∧
    (sistemN2 m x y → (m ^ 2 - 9) * x = m - 3) :=
  ⟨by ring, by ring, fun ⟨h1, h2⟩ => by linear_combination (m - 1) * h1 - 2 * h2⟩

/-- Naloga 2 c), d), RACUN: za m ≠ ±3 ima sistem natanko rešitev (1/(m + 3), (m + 4)/(m + 3)).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#naloga2-ena
besedilo: »d) $\left(\dfrac{1}{m + 3}, \dfrac{m + 4}{m + 3}\right)$« -/
theorem m2_ena (m x y : ℝ) (h3 : m ≠ 3) (h3' : m ≠ -3) :
    sistemN2 m x y ↔ (x = 1 / (m + 3) ∧ y = (m + 4) / (m + 3)) := by
  have ha : m - 3 ≠ 0 := sub_ne_zero.mpr h3
  have hb : m + 3 ≠ 0 := fun h => h3' (by linarith)
  constructor
  · intro hs
    obtain ⟨e1, e2⟩ := hs
    have hk := (m2_b m x y).2.2 ⟨e1, e2⟩
    have : (m - 3) * (x * (m + 3) - 1) = 0 := by linear_combination hk
    rcases mul_eq_zero.mp this with h0 | h0
    · exact absurd h0 ha
    · have hx : x * (m + 3) = 1 := by linarith
      rw [eq_div_iff hb, eq_div_iff hb]
      exact ⟨hx, by linear_combination (m + 3) / 2 * e1 - (m + 1) / 2 * hx⟩
  · rintro ⟨rfl, rfl⟩
    unfold sistemN2
    constructor <;> field_simp <;> ring

/-- Predpostavki `m2_ena` se dasta izpolniti (m = 0). -/
example : (0:ℝ) ≠ 3 ∧ (0:ℝ) ≠ -3 := by norm_num

/-- Naloga 2 d), RACUN: (m − 3)/(m² − 9) = 1/(m + 3) in (3 − (m + 1)/(m + 3))/2 = (m + 4)/(m + 3), ker
3 − (m + 1)/(m + 3) = (2m + 8)/(m + 3) (m ≠ ±3); pri m = 0 je to (1/3, 4/3).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#naloga2d
besedilo: »Za $m \neq \pm 3$ je $x = \dfrac{m - 3}{(m - 3)(m + 3)} = \dfrac{1}{m + 3}$. 8. d) Iz prve enačbe: $2y = 3 - \dfrac{m + 1}{m + 3} = \dfrac{3m + 9 - m - 1}{m + 3} = \dfrac{2m + 8}{m + 3}$, torej $y = \dfrac{m + 4}{m + 3}$. Preizkus pri $m = 0$ da $\left(\dfrac{1}{3}, \dfrac{4}{3}\right)$, enako kot v a).« -/
theorem m2_d (m : ℝ) (h3 : m ≠ 3) (h3' : m ≠ -3) : (m - 3) / (m ^ 2 - 9) = 1 / (m + 3) ∧
    3 - (m + 1) / (m + 3) = (3 * m + 9 - m - 1) / (m + 3) ∧
    (3 * m + 9 - m - 1) / (m + 3) = (2 * m + 8) / (m + 3) ∧
    (3 - (m + 1) / (m + 3)) / 2 = (m + 4) / (m + 3) ∧
    (1:ℝ) / (0 + 3) = 1 / 3 ∧ (0 + 4 : ℝ) / (0 + 3) = 4 / 3 := by
  have ha : m - 3 ≠ 0 := sub_ne_zero.mpr h3
  have hb : m + 3 ≠ 0 := fun h => h3' (by linarith)
  have hm : m ^ 2 - 9 = (m - 3) * (m + 3) := by ring
  refine ⟨?_, ?_, ?_, ?_, by norm_num, by norm_num⟩
  · rw [hm, div_mul_eq_div_div, div_self ha]
  · field_simp; ring
  · congr 1; ring
  · field_simp; ring

/-- Predpostavki `m2_d` se dasta izpolniti (m = 0). -/
example : (0:ℝ) ≠ 3 ∧ (0:ℝ) ≠ -3 := by norm_num

/-- Naloga 2 c): pri m = 3 sta obe enačbi 4x + 2y = 3 (sovpadata, neskončno rešitev).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#naloga2-m3
besedilo: »Za $m = 3$ sta obe enačbi $4x + 2y = 3$: premici sovpadata in rešitev je neskončno.« -/
theorem m2_m3 (x y : ℝ) : sistemN2 3 x y ↔ 4 * x + 2 * y = 3 := by
  unfold sistemN2
  constructor
  · rintro ⟨h1, _⟩; linarith
  · intro h; constructor <;> linarith

/-- Naloga 2 c), RACUN: pri m = −3 sta enačbi −2x + 2y = 3 in 4x − 4y = −3 (deljena z −2:
−2x + 2y = 3/2), vzporedni; rešitve ni (0·x = −6).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#naloga2-m-minus3
besedilo: »Za $m = -3$ sta enačbi $-2x + 2y = 3$ in $4x - 4y = -3$. Druga, deljena z $-2$, je $-2x + 2y = \dfrac{3}{2}$. Premici sta vzporedni in različni, rešitve ni (enačba iz b) da $0 \cdot x = -6$).« -/
theorem m2_m_minus3 (x y : ℝ) : (4 * x - 4 * y = -3 ↔ -2 * x + 2 * y = 3 / 2) ∧ ((-3:ℝ) - 3 = -6) ∧
    ¬ sistemN2 (-3) x y := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, ?_⟩
  unfold sistemN2
  rintro ⟨h1, h2⟩; linarith

/-- Naloga 2 e), RACUN (algebra): pri m ≠ ±3, kjer je rešitev ena, leži na y = 2x natanko pri m = −2:
(m + 4)/(m + 3) = 2/(m + 3) ⇔ m + 4 = 2 ⇔ m = −2.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#naloga2e
besedilo: »Iz $y = 2x$ sledi $\dfrac{m + 4}{m + 3} = \dfrac{2}{m + 3}$, torej $m + 4 = 2$ in $m = -2$, kar ni izločena vrednost.« -/
theorem m2_e (m : ℝ) (h3 : m ≠ 3) (h3' : m ≠ -3) :
    ((m + 4) / (m + 3) = 2 * (1 / (m + 3)) ↔ m = -2) := by
  have hb : m + 3 ≠ 0 := fun h => h3' (by linarith)
  rw [mul_one_div]
  constructor
  · intro h
    have := (div_left_inj₀ hb).mp h
    linarith
  · rintro rfl; norm_num

/-- Predpostavki `m2_e` se dasta izpolniti (m = −2). -/
example : (-2:ℝ) ≠ 3 ∧ (-2:ℝ) ≠ -3 := by norm_num

/-- Naloga 2 e): kadar ima sistem natanko eno rešitev, ta leži na premici y = 2x natanko pri m = −2.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#naloga2e-ena
besedilo: »torej $m + 4 = 2$ in $m = -2$, kar ni izločena vrednost« -/
theorem m2_e_ena (m : ℝ) (h : ∃! p : ℝ × ℝ, sistemN2 m p.1 p.2) :
    (∃ x y : ℝ, sistemN2 m x y ∧ y = 2 * x) ↔ m = -2 := by
  by_cases h3 : m = 3
  · subst h3
    exfalso
    obtain ⟨p, -, hu⟩ := h
    have a := hu (3 / 4, 0) (by unfold sistemN2; norm_num)
    have b := hu (0, 3 / 2) (by unfold sistemN2; norm_num)
    rw [← b] at a
    simp [Prod.ext_iff] at a
  by_cases h3' : m = -3
  · subst h3'
    exfalso
    obtain ⟨p, hp, -⟩ := h
    exact (m2_m_minus3 p.1 p.2).2.2 hp
  constructor
  · rintro ⟨x, y, hs, hy⟩
    rw [m2_ena m x y h3 h3'] at hs
    obtain ⟨rfl, rfl⟩ := hs
    exact (m2_e m h3 h3').mp hy
  · rintro rfl
    exact ⟨1, 2, by unfold sistemN2; norm_num, by norm_num⟩

/-- Predpostavka `m2_e_ena` se da izpolniti: pri m = −2 je rešitev natanko ena. -/
example : ∃! p : ℝ × ℝ, sistemN2 (-2) p.1 p.2 :=
  ⟨(1, 2), by unfold sistemN2; norm_num, fun p hp => by
    obtain ⟨h1, h2⟩ := (m2_ena (-2) p.1 p.2 (by norm_num) (by norm_num)).mp hp
    ext <;> simp only [h1, h2] <;> norm_num⟩

/-- Naloga 2 e), opomba: pri m = 3 (neskončno rešitev, 4x + 2y = 3) na premici y = 2x leži rešitev
(3/8, 3/4); zato pogoj »natanko ena rešitev« v nalogi ni odveč.
pomozno – opomba v Leanu (pri m = 3 leži rešitev na y = 2x, zato je pogoj »natanko ena rešitev« potreben); v lekciji je ni -/
theorem m2_e_m3 : sistemN2 3 (3 / 8) (3 / 4) ∧ (3:ℝ) / 4 = 2 * (3 / 8) := by
  unfold sistemN2; norm_num

/-- Naloga 2 e), RACUN: pri m = −2 (−x + 2y = 3, 4x − 3y = −2) je rešitev natanko (1, 2); −1 + 4 = 3,
4 − 6 = −2.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#naloga2e-preizkus
besedilo: »Preizkus: pri $m = -2$ je rešitev $(1, 2)$; res je $-1 + 4 = 3$ in $4 - 6 = -2$.« -/
theorem m2_e_preizkus (x y : ℝ) : (sistemN2 (-2) x y ↔ (x = 1 ∧ y = 2)) ∧ (-1:ℝ) + 4 = 3 ∧ (4:ℝ) - 6 = -2 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  rw [m2_ena (-2) x y (by norm_num) (by norm_num)]; norm_num

/-! ## Ustna vprašanja, Bolj natančno -/

/-- Ustno 2, RACUN: sistem x + my = 1, x + y = 2 pri m = 1 (x + y = 1, x + y = 2) nima rešitve.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#ustno2
besedilo: »Ti premici sta vzporedni in različni, zato sistem pri $m = 1$ nima rešitve.« -/
theorem ustno2 (x y : ℝ) : ¬ (x + 1 * y = 1 ∧ x + y = 2) := by
  rintro ⟨h1, h2⟩; linarith

/-- Bolj natančno: če je a₁b₂ − a₂b₁ ≠ 0, ima sistem a₁x + b₁y = c₁, a₂x + b₂y = c₂ natanko eno rešitev
(premici se sekata).
pomozno – izrek dokaže eno smer (a₁b₂ ≠ a₂b₁ ⇒ natanko ena rešitev); lekcija pove le »natanko takrat« o legi premic -/
theorem det_ena (a₁ b₁ c₁ a₂ b₂ c₂ : ℝ) (hD : a₁ * b₂ - a₂ * b₁ ≠ 0) :
    ∃! p : ℝ × ℝ, a₁ * p.1 + b₁ * p.2 = c₁ ∧ a₂ * p.1 + b₂ * p.2 = c₂ := by
  refine ⟨((c₁ * b₂ - c₂ * b₁) / (a₁ * b₂ - a₂ * b₁), (a₁ * c₂ - a₂ * c₁) / (a₁ * b₂ - a₂ * b₁)),
    ⟨?_, ?_⟩, ?_⟩
  · simp only
    rw [mul_div_assoc', mul_div_assoc', ← add_div, div_eq_iff hD]; ring
  · simp only
    rw [mul_div_assoc', mul_div_assoc', ← add_div, div_eq_iff hD]; ring
  · rintro ⟨x, y⟩ ⟨h1, h2⟩
    simp only at h1 h2
    refine Prod.ext ?_ ?_
    · show x = _
      rw [eq_div_iff hD]; linear_combination b₂ * h1 - b₁ * h2
    · show y = _
      rw [eq_div_iff hD]; linear_combination a₁ * h2 - a₂ * h1

/-- Predpostavka `det_ena` se da izpolniti (Primer 3 pri m = 0: 1·4 − 0·0 ≠ 0). -/
example : (1:ℝ) * 4 - 0 * 0 ≠ 0 := by norm_num

/-- Bolj natančno: če je a₁b₂ = a₂b₁ (in a₁, b₁ nista oba 0), sistem nima natanko ene rešitve (premici sta
vzporedni ali sovpadata).
pomozno – izrek dokaže eno smer (a₁b₂ = a₂b₁ ⇒ ni natanko ene rešitve); lekcija pove le »natanko takrat« o legi premic -/
theorem det_nic (a₁ b₁ c₁ a₂ b₂ c₂ : ℝ) (h₁ : a₁ ≠ 0 ∨ b₁ ≠ 0) (hD : a₁ * b₂ = a₂ * b₁) :
    ¬ ∃! p : ℝ × ℝ, a₁ * p.1 + b₁ * p.2 = c₁ ∧ a₂ * p.1 + b₂ * p.2 = c₂ := by
  rintro ⟨⟨x, y⟩, ⟨h1, h2⟩, hu⟩
  simp only at h1 h2
  have := hu (x + b₁, y - a₁) ⟨by simp only; linear_combination h1,
    by simp only; linear_combination h2 - hD⟩
  have e1 : x + b₁ = x := congrArg Prod.fst this
  have e2 : y - a₁ = y := congrArg Prod.snd this
  rcases h₁ with h | h
  · exact h (by linarith)
  · exact h (by linarith)

/-- Predpostavke `det_nic` se dajo izpolniti (Primer 3 pri m = 2: 1·4 = 2·2). -/
example : ((1:ℝ) ≠ 0 ∨ (2:ℝ) ≠ 0) ∧ (1:ℝ) * 4 = 2 * 2 := by norm_num

/-- Bolj natančno: pri b₁, b₂ ≠ 0 je a₁b₂ = a₂b₁ isto kot −a₁/b₁ = −a₂/b₂ (enaka smerna koeficienta).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#det-smerna
besedilo: »Pri $b_1 \neq 0$ in $b_2 \neq 0$ je to isto kot $-\dfrac{a_1}{b_1} = -\dfrac{a_2}{b_2}$, torej enaka smerna koeficienta« -/
theorem det_smerna (a₁ b₁ a₂ b₂ : ℝ) (hb₁ : b₁ ≠ 0) (hb₂ : b₂ ≠ 0) :
    a₁ * b₂ = a₂ * b₁ ↔ -a₁ / b₁ = -a₂ / b₂ := by
  rw [div_eq_div_iff hb₁ hb₂]
  constructor <;> intro h <;> linarith

/-- Predpostavki `det_smerna` se dasta izpolniti (b₁ = 2, b₂ = 4). -/
example : (2:ℝ) ≠ 0 ∧ (4:ℝ) ≠ 0 := by norm_num

/-- Bolj natančno: v Primeru 3 je pogoj 1·4 = m·m natanko m = 2 ali m = −2.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#det-p3
besedilo: »pogoj $4 = m^2$ pa da ravno $m = \pm 2$« -/
theorem det_p3 (m : ℝ) : 1 * 4 = m * m ↔ m = 2 ∨ m = -2 := by
  constructor
  · intro h
    have : (m - 2) * (m + 2) = 0 := by linear_combination -h
    rcases mul_eq_zero.mp this with h0 | h0
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Bolj natančno in Z analogijo (garaža): množenje z negativnim številom obrne vrstni red (1 < 3, −3 < −1);
pri a < 0 je tudi 1/a < 0.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#obrat
besedilo: »če je $a < 0$, neenačbo $ax > b$ pomnožimo z negativnim številom $\dfrac{1}{a}$, to pa obrne vrstni red vseh števil na številski premici.« -/
theorem obrat (a x y : ℝ) (ha : a < 0) (h : x < y) : a * y < a * x ∧ 1 / a < 0 ∧ (-3:ℝ) < -1 :=
  ⟨by nlinarith, by rw [one_div]; exact inv_lt_zero.mpr ha, by norm_num⟩

/-- Predpostavki `obrat` se dasta izpolniti (a = −1, x = 1, y = 3). -/
example : (-1:ℝ) < 0 ∧ (1:ℝ) < 3 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1, RACUN: −2x > 6, 3x < −9 in −x/3 > 1 imajo rešitev x < −3, −2x < 6 pa x > −3 (izjema).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#preveri1
besedilo: »Ostale tri imajo rešitev $x < -3$. Pri $-2x < 6$ deljenje z $-2$ obrne znak in da $x > -3$.« -/
theorem preveri_1 (x : ℝ) : (-2 * x > 6 ↔ x < -3) ∧ (3 * x < -9 ↔ x < -3) ∧ (-x / 3 > 1 ↔ x < -3) ∧
    (-2 * x < 6 ↔ x > -3) :=
  ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩⟩

/-- Preveri se 2, RACUN: sistem y = mx + 1, y = −2x + 3 nima rešitve natanko pri m = −2; pri m = 0 je
presečišče (1, 1).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#preveri2
besedilo: »Vzporedni sta pri $m = -2$; začetni vrednosti $1$ in $3$ sta različni, zato se premici ne sekata in rešitve ni.« -/
theorem preveri_2 (m : ℝ) : (¬ ∃ x y : ℝ, y = m * x + 1 ∧ y = -2 * x + 3) ↔ m = -2 := by
  constructor
  · intro h
    by_contra hm
    have hd : m + 2 ≠ 0 := fun h' => hm (by linarith)
    apply h
    refine ⟨2 / (m + 2), m * (2 / (m + 2)) + 1, rfl, ?_⟩
    have hc : 2 / (m + 2) * (m + 2) = 2 := div_mul_cancel₀ _ hd
    linear_combination hc
  · rintro rfl ⟨x, y, h1, h2⟩
    linarith

/-- Preveri se 2: pri m = 0 se premici sekata v (1, 1).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#preveri2-m0
besedilo: »Pri $m = 0$ (na sliki) se premici sekata v $(1, 1)$« -/
theorem preveri_2_m0 : (1:ℝ) = 0 * 1 + 1 ∧ (1:ℝ) = -2 * 1 + 3 := by norm_num

/-- Preveri se 3: mx + 3 < 3x + m ⇔ (m − 3)x < m − 3 (koraka A, B pravilna); za m > 3 je x < 1, za m < 3
x > 1 (korak C je napačen), za m = 3 rešitve ni (D pravilen).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#preveri3
besedilo: »Za $m < 3$ je $m - 3$ negativen, zato se znak obrne: $x > 1$. Pravilno: za $m > 3$ je $x < 1$, za $m < 3$ je $x > 1$.« -/
theorem preveri_3 (m x : ℝ) : (m * x + 3 < 3 * x + m ↔ m * x - 3 * x < m - 3) ∧
    (m * x - 3 * x = (m - 3) * x) ∧
    (m > 3 → (m * x + 3 < 3 * x + m ↔ x < 1)) ∧ (m < 3 → (m * x + 3 < 3 * x + m ↔ x > 1)) ∧
    (m = 3 → ¬ (m * x + 3 < 3 * x + m)) := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, by ring, fun hm => ⟨fun h => ?_, fun h => ?_⟩,
    fun hm => ⟨fun h => ?_, fun h => ?_⟩, fun hm h => ?_⟩
  · nlinarith
  · nlinarith
  · nlinarith
  · nlinarith
  · subst hm; linarith

/-- Preveri se 3: korak C je napačen: pri m = 0 je x = 0 < 1, ni pa rešitev (3 < 0 ne velja).
pomozno – protiprimer (m = 0, x = 0) za napačni korak C; razlaga kviza 3 ga ne navede -/
theorem preveri_3_c : (0:ℝ) < 1 ∧ ¬ ((0:ℝ) * 0 + 3 < 3 * 0 + 0) := by norm_num

/-- Preveri se 4, RACUN: sistem 2x + my = 1, 4x + 6y = 5 nima rešitve natanko pri m = 3 (2·6 = 4m; tedaj
2x + 3y = 1 in 2x + 3y = 5/2).
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#preveri4
besedilo: »$2 \cdot 6 = 4m$ da $m = 3$. Tedaj je prva enačba $2x + 3y = 1$, druga pa $2x + 3y = \dfrac{5}{2}$: vzporedni premici, rešitve ni.« -/
theorem preveri_4 (m : ℝ) : (¬ ∃ x y : ℝ, 2 * x + m * y = 1 ∧ 4 * x + 6 * y = 5) ↔ m = 3 := by
  constructor
  · intro h
    by_contra hm
    have hD : 2 * 6 - 4 * m ≠ 0 := fun h' => hm (by linarith)
    obtain ⟨⟨x, y⟩, ⟨h1, h2⟩, _⟩ := det_ena 2 m 1 4 6 5 hD
    exact h ⟨x, y, h1, h2⟩
  · rintro rfl ⟨x, y, h1, h2⟩
    linarith

/-- Preveri se 4: 2·6 = 4m ⇔ m = 3; pri m = 3 je druga enačba (deljena z 2) 2x + 3y = 5/2.
trditev: MAT-SS-1/enacbe-neenacbe-in-sistemi-s-parametrom#preveri4-pogoj
besedilo: »$2 \cdot 6 = 4m$ da $m = 3$. Tedaj je prva enačba $2x + 3y = 1$, druga pa $2x + 3y = \dfrac{5}{2}$« -/
theorem preveri_4_pogoj (m x y : ℝ) : (2 * 6 = 4 * m ↔ m = 3) ∧ (4 * x + 6 * y = 5 ↔ 2 * x + 3 * y = 5 / 2) :=
  ⟨⟨fun h => by linarith, fun h => by subst h; norm_num⟩, ⟨fun h => by linarith, fun h => by linarith⟩⟩

end Evklid.Lekcije.MAT_SS_1.EnacbeNeenacbeInSistemiSParametrom
