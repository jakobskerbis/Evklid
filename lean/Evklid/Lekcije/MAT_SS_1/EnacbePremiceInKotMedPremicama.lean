/-
vir: content/lessons/MAT-SS-1/enacbe-premice-in-kot-med-premicama.md
sha256: f5ed8558b239aa38fea1b45be61fe6f4111058204ba4bf74f434ca46360c5cfc
Ni v Leanu: risbe in simulacija; uporaba računala (tipka tan⁻¹, način DEG/RAD; dokazano je le, da
arctan 0,08 v radianih ≈ 0,08 in da obrnjeno razmerje da kot, ki prvega dopolni do 90°); poimenovanja
(eksplicitna, splošna, odsekovna oblika, odsek, naklonski kot, tangens kot »nasprotna/priležna kateta«);
geometrijske trditve o pravokotnem trikotniku in podobnih trikotnikih (dokazana je algebra: (3t)/(4t) = 3/4,
(kd)/d = k); »pravokotni« je formaliziran s smernima vektorjema (1, k₁)·(1, k₂) = 0 ⇔ k₁k₂ = −1 in s kotom
med premicama (= π/2 ⇔ k₁k₂ = −1); »vzporedni ⇔ k₁ = k₂« je dokazan kot: k₁ ≠ k₂ ⇒ natanko eno presečišče,
k₁ = k₂, n₁ ≠ n₂ ⇒ nobenega; naklonski kot je definiran kot α = arctan k (k ≥ 0) oz. π + arctan k (k < 0),
dokazano je tan α = k, 0 ≤ α < π in da je to edini tak kot (α ≠ π/2; v Leanu je tan(π/2) = 0, zato
navpična premica nima k); kot med premicama je definiran po lekciji kot |α₂ − α₁| oz. 180° minus to
(min(|α₂ − α₁|, π − |α₂ − α₁|)); dokazana je formula tan φ = |(k₂ − k₁)/(1 + k₁k₂)| (φ = arctan |…|) pri
1 + k₁k₂ ≠ 0; pri navpični premici je kot φ = |90° − α| po lekciji (Primer 4 je dokazan v tej obliki);
notranji kot trikotnika pri A (Naloga 2 c) ni formaliziran kot kot med poltrakoma (dokazano je
arctan ½ + arctan 0,8 = arctan(13/6) < 90° in tan φ = 13/6); »tesar meri topi kot« (izbira kota iz slike);
odsekovna oblika: v Leanu je x/0 = 0, zato zahtevamo m, n ≠ 0; postopki (Ponovitev), točkovanje maturitetnih
nalog, besedilo napačnih odgovorov v Preveri se (kjer gre, je dokazano, da napačna možnost ni pravilna).
Kotne vrednosti v stopinjah so dokazane kot |točna − približek| < pol enote zadnjega mesta, iz meja
arctan (alternirajoča vrsta Real.hasSum_arctan) in π (pi_gt_d20, pi_lt_d20).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.EnacbePremiceInKotMedPremicama

open Real Finset

/-! ## Pomožno: meje za arctan in stopinje -/

/-- Pomožno: za 0 ≤ x < 1 delne vsote vrste za arctan (sodo število členov spodaj, liho zgoraj) omejujejo
arctan x.
pomozno – orodje (meje arctan iz delnih vsot vrste) -/
theorem arctan_meje (x : ℝ) (h0 : 0 ≤ x) (h1 : x < 1) (k : ℕ) :
    ∑ i ∈ range (2 * k), (-1) ^ i * (x ^ (2 * i + 1) / ((2 * i + 1 : ℕ) : ℝ)) ≤ arctan x ∧
      arctan x ≤ ∑ i ∈ range (2 * k + 1), (-1) ^ i * (x ^ (2 * i + 1) / ((2 * i + 1 : ℕ) : ℝ)) := by
  have hs := Real.hasSum_arctan (x := x) (by rw [Real.norm_eq_abs, abs_lt]; constructor <;> linarith)
  have ht := hs.tendsto_sum_nat
  simp only [mul_div_assoc] at ht
  have hfa : Antitone (fun i : ℕ => x ^ (2 * i + 1) / ((2 * i + 1 : ℕ) : ℝ)) := by
    refine antitone_nat_of_succ_le (fun i => ?_)
    apply div_le_div₀ (pow_nonneg h0 _) (pow_le_pow_of_le_one h0 h1.le (by omega)) (by positivity)
    exact_mod_cast (by omega : 2 * i + 1 ≤ 2 * (i + 1) + 1)
  exact ⟨hfa.alternating_series_le_tendsto ht k, hfa.tendsto_le_alternating_series ht k⟩

/-- Predpostavki `arctan_meje` se dasta izpolniti (x = 1/2). -/
example : (0:ℝ) ≤ 1 / 2 ∧ (1:ℝ) / 2 < 1 := by norm_num

/-- Pomožno: iz L ≤ a ≤ U in mej za π sledi |a·180/π − D| < e.
pomozno – orodje (pretvorba mej v stopinje z mejami za π) -/
theorem stopinje_iz_mej {a L U D e : ℝ} (hL : L ≤ a) (hU : a ≤ U) (he0 : 0 < e) (he : e ≤ D)
    (h1 : (D - e) * 3.14159265358979323847 < L * 180)
    (h2 : U * 180 < (D + e) * 3.14159265358979323846) : |a * 180 / π - D| < e := by
  have hp1 := Real.pi_gt_d20
  have hp2 := Real.pi_lt_d20
  have hπ := Real.pi_pos
  rw [abs_sub_lt_iff]
  constructor
  · have : a * 180 / π < D + e := by
      rw [div_lt_iff₀ hπ]; nlinarith
    linarith
  · have : D - e < a * 180 / π := by
      rw [lt_div_iff₀ hπ]; nlinarith
    linarith

/-- Predpostavke `stopinje_iz_mej` se dajo izpolniti (a = L = U = π/4, D = 45, e = 1). -/
example : (0:ℝ) < 1 ∧ (1:ℝ) ≤ 45 ∧ (45 - 1 : ℝ) * 3.14159265358979323847 < π / 4 * 180 ∧
    π / 4 * 180 < (45 + 1 : ℝ) * 3.14159265358979323846 := by
  have hp1 := Real.pi_gt_d20
  have hp2 := Real.pi_lt_d20
  refine ⟨by norm_num, by norm_num, by nlinarith, by nlinarith⟩

/-- Pomožno: za x > 0 je arctan(1/x) v stopinjah 90° minus arctan x v stopinjah.
pomozno – orodje (arctan(1/x) = 90° − arctan x); trditev lekcije je v izreku napaka_rad -/
theorem stop_inv (x : ℝ) (hx : 0 < x) : arctan x⁻¹ * 180 / π = 90 - arctan x * 180 / π := by
  rw [arctan_inv_of_pos hx]
  have := Real.pi_pos.ne'
  field_simp
  ring

/-- Predpostavka `stop_inv` se da izpolniti (x = 2). -/
example : (0:ℝ) < 2 := by norm_num

/-- Pomožno: arctan 0,75 ≈ 36,87°.
pomozno – numerična ocena (orodje za izreke r6_075, p3_preizkus) -/
theorem st_075 : |arctan 0.75 * 180 / π - 36.87| < 0.005 := by
  obtain ⟨hL, hU⟩ := arctan_meje 0.75 (by norm_num) (by norm_num) 6
  refine stopinje_iz_mej hL hU (by norm_num) (by norm_num) ?_ ?_ <;> norm_num [Finset.sum_range_succ]

/-- Pomožno: arctan 0,5 ≈ 26,57°.
pomozno – numerična ocena (orodje za p3_preizkus) -/
theorem st_05 : |arctan 0.5 * 180 / π - 26.57| < 0.005 := by
  obtain ⟨hL, hU⟩ := arctan_meje 0.5 (by norm_num) (by norm_num) 5
  refine stopinje_iz_mej hL hU (by norm_num) (by norm_num) ?_ ?_ <;> norm_num [Finset.sum_range_succ]

/-- Pomožno: arctan 0,8 ≈ 38,66°.
pomozno – numerična ocena (orodje za m2_b) -/
theorem st_08 : |arctan 0.8 * 180 / π - 38.66| < 0.005 := by
  obtain ⟨hL, hU⟩ := arctan_meje 0.8 (by norm_num) (by norm_num) 8
  refine stopinje_iz_mej hL hU (by norm_num) (by norm_num) ?_ ?_ <;> norm_num [Finset.sum_range_succ]

/-- Pomožno: arctan(1/3) ≈ 18,43°.
pomozno – numerična ocena (orodje) -/
theorem st_13 : |arctan (1 / 3) * 180 / π - 18.43| < 0.005 := by
  obtain ⟨hL, hU⟩ := arctan_meje (1 / 3) (by norm_num) (by norm_num) 4
  refine stopinje_iz_mej hL hU (by norm_num) (by norm_num) ?_ ?_ <;> norm_num [Finset.sum_range_succ]

/-- Pomožno: arctan(6/13) ≈ 24,78°.
pomozno – numerična ocena (orodje) -/
theorem st_613 : |arctan (6 / 13) * 180 / π - 24.78| < 0.005 := by
  obtain ⟨hL, hU⟩ := arctan_meje (6 / 13) (by norm_num) (by norm_num) 5
  refine stopinje_iz_mej hL hU (by norm_num) (by norm_num) ?_ ?_ <;> norm_num [Finset.sum_range_succ]

/-- Pomožno: pretvorba |90 − a − D| < e iz |a − (90 − D)| < e.
pomozno – orodje (preoblikovanje absolutne vrednosti) -/
theorem abs_komplement {a D e : ℝ} (h : |a - (90 - D)| < e) : |90 - a - D| < e := by
  rw [abs_sub_lt_iff] at h ⊢; constructor <;> linarith

/-- Predpostavka `abs_komplement` se da izpolniti (a = 30, D = 60, e = 1). -/
example : |(30:ℝ) - (90 - 60)| < 1 := by norm_num

/-! ## Uvod -/

/-- Zakaj se tega učimo, Razlaga 6 (hitri preizkus): cesta 12 % ima k = 12/100 = 0,12 (≈ 6,84°), klančina
k = 0,6/4 = 0,15 (≈ 8,53°), ki je bolj strma (večji naklonski kot).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#uvod
besedilo: »$\tan^{-1} 0{,}12 \approx 6{,}84^\circ$; klančina v garažo ima $k = \dfrac{0{,}6}{4} = 0{,}15$ in $\alpha \approx 8{,}53^\circ$, torej je bolj strma.« -/
theorem uvod : (12:ℝ) / 100 = 0.12 ∧ (0.6:ℝ) / 4 = 0.15 ∧ arctan 0.12 < arctan 0.15 ∧
    |arctan 0.12 * 180 / π - 6.84| < 0.005 ∧ |arctan 0.15 * 180 / π - 8.53| < 0.005 := by
  refine ⟨by norm_num, by norm_num, arctan_strictMono (by norm_num), ?_, ?_⟩
  · obtain ⟨hL, hU⟩ := arctan_meje 0.12 (by norm_num) (by norm_num) 2
    refine stopinje_iz_mej hL hU (by norm_num) (by norm_num) ?_ ?_ <;> norm_num [Finset.sum_range_succ]
  · obtain ⟨hL, hU⟩ := arctan_meje 0.15 (by norm_num) (by norm_num) 2
    refine stopinje_iz_mej hL hU (by norm_num) (by norm_num) ?_ ?_ <;> norm_num [Finset.sum_range_succ]

/-! ## Razlaga 1–4: oblike enačbe premice -/

/-- Razlaga 1, hitri preizkus: y = −2x + 5 seka os y v (0, 5).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#r1-preizkus
besedilo: »V točki $(0, 5)$.« -/
theorem r1_preizkus : (-2:ℝ) * 0 + 5 = 5 := by norm_num

/-- Razlaga 2: y = 2x + 3 ⇔ 2x − y + 3 = 0.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#r2-splosna
besedilo: »Premica $y = 2x + 3$ ima splošno obliko $2x - y + 3 = 0$.« -/
theorem r2_splosna (x y : ℝ) : y = 2 * x + 3 ↔ 2 * x - y + 3 = 0 :=
  ⟨fun h => by linarith, fun h => by linarith⟩

/-- Razlaga 2, Povzetek: pri b ≠ 0 je ax + by + c = 0 ⇔ y = kx + n s k = −a/b, n = −c/b.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#splosna-v-eksplicitno
besedilo: »Če je $b \neq 0$, dobimo $k = -\dfrac{a}{b}$ in $n = -\dfrac{c}{b}$.« -/
theorem splosna_v_eksplicitno (a b c x y : ℝ) (hb : b ≠ 0) :
    a * x + b * y + c = 0 ↔ y = -a / b * x + -c / b := by
  constructor
  · intro h; field_simp; linarith
  · intro h; rw [h]; field_simp; ring

/-- Predpostavka `splosna_v_eksplicitno` se da izpolniti (b = −4). -/
example : (-4:ℝ) ≠ 0 := by norm_num

/-- Razlaga 2, hitri preizkus: pri 6x + 2y − 1 = 0 je k = −6/2 = −3.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#r2-preizkus
besedilo: »$k = -\dfrac{6}{2} = -3$.« -/
theorem r2_preizkus (x y : ℝ) : (6 * x + 2 * y - 1 = 0 ↔ y = -3 * x + 1 / 2) ∧ -(6:ℝ) / 2 = -3 :=
  ⟨⟨fun h => by linarith, fun h => by linarith⟩, by norm_num⟩

/-- Razlaga 2: pri b = 0 je npr. x − 4 = 0 ⇔ x = 4 (navpična premica); ta premica nima eksplicitne oblike.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#navpicna
besedilo: »Če je $b = 0$, ostane npr. $x - 4 = 0$, torej $x = 4$. To je **navpična premica** skozi vse točke z absciso $4$. Eksplicitne oblike nima« -/
theorem navpicna (x : ℝ) : (x - 4 = 0 ↔ x = 4) ∧
    ¬ ∃ k n : ℝ, ∀ x y : ℝ, (x - 4 = 0 ↔ y = k * x + n) := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ?_⟩
  rintro ⟨k, n, h⟩
  have h1 := (h 4 (k * 4 + n)).mpr rfl
  have h2 := (h 4 (k * 4 + n + 1)).mp h1
  linarith

/-- Bolj natančno: splošna oblika zajame tudi navpično premico x = c (1·x + 0·y − c = 0).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#splosna-navpicna
besedilo: »Pri $b = 0$ je premica **navpična**, $x = \text{konst.}$« -/
theorem splosna_navpicna (c x y : ℝ) : 1 * x + 0 * y + (-c) = 0 ↔ x = c :=
  ⟨fun h => by linarith, fun h => by rw [h]; ring⟩

/-- Razlaga 3, Pogoste napake 2: 2x + 3y = 6 seka osi pri x = 3, y = 2 in je 2x + 3y = 6 ⇔ x/3 + y/2 = 1;
x/2 + y/3 = 1 ni ista premica ((3, 0) je na prvi, ne na drugi).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#r3-odseki
besedilo: »Premica $2x + 3y = 6$ seka os $x$ pri $x = 3$ (vstavi $y = 0$) in os $y$ pri $y = 2$ (vstavi $x = 0$). Ti števili sta **odseka** na oseh. Če enačbo delimo s $6$, dobimo $\dfrac{x}{3} + \dfrac{y}{2} = 1$.« -/
theorem r3_odseki (x y : ℝ) : ((2:ℝ) * 3 + 3 * 0 = 6 ∧ (2:ℝ) * 0 + 3 * 2 = 6) ∧
    (2 * x + 3 * y = 6 ↔ x / 3 + y / 2 = 1) ∧ ¬ ((3:ℝ) / 2 + 0 / 3 = 1) :=
  ⟨by norm_num, ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num⟩

/-- Razlaga 3, Ustno 1: premica x/m + y/n = 1 (m, n ≠ 0) seka osi v (m, 0) in (0, n).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#odsekovna-tocki
besedilo: »Odsekovna oblika $\dfrac{x}{m} + \dfrac{y}{n} = 1$ pove odseka na oseh, saj premica seka osi v točkah $(m, 0)$ in $(0, n)$.« -/
theorem odsekovna_tocki (m n : ℝ) (hm : m ≠ 0) (hn : n ≠ 0) : m / m + 0 / n = 1 ∧ 0 / m + n / n = 1 := by
  rw [div_self hm, div_self hn]; simp

/-- Predpostavki `odsekovna_tocki` se dasta izpolniti (m = 3, n = 2). -/
example : (3:ℝ) ≠ 0 ∧ (2:ℝ) ≠ 0 := by norm_num

/-- Razlaga 3, Ustno 1, Bolj natančno: če je premica ax + by + c = 0 v odsekovni obliki x/m + y/n = 1
(m, n ≠ 0), potem a ≠ 0, b ≠ 0 in c ≠ 0: premica skozi izhodišče (c = 0) in premica, vzporedna osi
(a = 0 ali b = 0), te oblike nimata.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#odsekovna-pogoji
besedilo: »Premica skozi izhodišče in premica, vzporedna kateri od osi, te oblike nimata.« -/
theorem odsekovna_pogoji (a b c m n : ℝ) (hm : m ≠ 0) (hn : n ≠ 0)
    (h : ∀ x y : ℝ, a * x + b * y + c = 0 ↔ x / m + y / n = 1) : a ≠ 0 ∧ b ≠ 0 ∧ c ≠ 0 := by
  have e1 := (h m 0).mpr (by rw [div_self hm]; simp)
  have e2 := (h 0 n).mpr (by rw [div_self hn]; simp)
  have hc : c ≠ 0 := by
    intro hc
    have := (h 0 0).mp (by rw [hc]; ring)
    simp at this
  refine ⟨fun ha => ?_, fun hb => ?_, hc⟩
  · rw [ha] at e1; exact hc (by linarith)
  · rw [hb] at e2; exact hc (by linarith)

/-- Predpostavke `odsekovna_pogoji` se dajo izpolniti (2x + 3y − 6 = 0, m = 3, n = 2). -/
example : ∀ x y : ℝ, 2 * x + 3 * y + (-6) = 0 ↔ x / 3 + y / 2 = 1 :=
  fun x y => ⟨fun h => by linarith, fun h => by linarith⟩

/-- Razlaga 3, hitri preizkus: x/(−5) + y/4 = 1 seka osi v (−5, 0) in (0, 4).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#r3-preizkus
besedilo: »V točkah $(-5, 0)$ in $(0, 4)$.« -/
theorem r3_preizkus : (-5:ℝ) / (-5) + 0 / 4 = 1 ∧ (0:ℝ) / (-5) + 4 / 4 = 1 := by norm_num

/-- Razlaga 4, Povzetek: premica y − y₁ = k(x − x₁) gre skozi T(x₁, y₁) in je y = kx + (y₁ − kx₁).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#skozi-tocko
besedilo: »Če vstaviš točko $T$ ($x = x_1$, $y = y_1$), je leva stran $0$ in desna tudi, zato premica res gre skozi $T$.« -/
theorem skozi_tocko (k x₁ y₁ x y : ℝ) : (y₁ - y₁ = k * (x₁ - x₁)) ∧
    (y - y₁ = k * (x - x₁) ↔ y = k * x + (y₁ - k * x₁)) :=
  ⟨by ring, ⟨fun h => by linarith, fun h => by linarith⟩⟩

/-- Razlaga 4, hitri preizkus: skozi T(1, 4) s k = 3: y − 4 = 3(x − 1) ⇔ y = 3x + 1.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#r4-preizkus
besedilo: »$y - 4 = 3(x - 1)$, torej $y = 3x + 1$.« -/
theorem r4_preizkus (x y : ℝ) : y - 4 = 3 * (x - 1) ↔ y = 3 * x + 1 :=
  ⟨fun h => by linarith, fun h => by linarith⟩

/-- Razlaga 4 (premica skozi dve točki): pri x₁ ≠ x₂ gre premica y − y₁ = k(x − x₁) s
k = (y₂ − y₁)/(x₂ − x₁) skozi obe točki.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#dve-tocki
besedilo: »Pri dveh točkah najprej izračunaš $k = \dfrac{y_2 - y_1}{x_2 - x_1}$, nato uporabiš eno od točk.« -/
theorem dve_tocki (x₁ y₁ x₂ y₂ : ℝ) (h : x₁ ≠ x₂) :
    y₁ - y₁ = (y₂ - y₁) / (x₂ - x₁) * (x₁ - x₁) ∧ y₂ - y₁ = (y₂ - y₁) / (x₂ - x₁) * (x₂ - x₁) := by
  have hd : x₂ - x₁ ≠ 0 := sub_ne_zero.mpr (Ne.symm h)
  exact ⟨by ring, by rw [div_mul_cancel₀ _ hd]⟩

/-- Predpostavka `dve_tocki` se da izpolniti (x₁ = 1, x₂ = 3). -/
example : (1:ℝ) ≠ 3 := by norm_num

/-- Razlaga 4: pri x₁ = x₂ in y₁ ≠ y₂ nobena premica y = kx + n ne gre skozi obe točki (premica je
navpična, x = x₁).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#dve-tocki-navpicna
besedilo: »Če je $x_1 = x_2$, je premica navpična: $x = x_1$.« -/
theorem dve_tocki_navpicna (x₁ y₁ x₂ y₂ : ℝ) (h : x₁ = x₂) (hy : y₁ ≠ y₂) :
    ¬ ∃ k n : ℝ, y₁ = k * x₁ + n ∧ y₂ = k * x₂ + n := by
  rintro ⟨k, n, h1, h2⟩
  subst h
  exact hy (h1.trans h2.symm)

/-- Predpostavki `dve_tocki_navpicna` se dasta izpolniti (x₁ = x₂ = 2, y₁ = 1, y₂ = 5). -/
example : (2:ℝ) = 2 ∧ (1:ℝ) ≠ 5 := by norm_num

/-! ## Razlaga 5: vzporednost in pravokotnost -/

/-- Razlaga 5 (vzporedni): pri k₁ ≠ k₂ se premici y = k₁x + n₁, y = k₂x + n₂ sekata v natanko eni točki.
pomozno – lekcija pove le, da sta vzporedni premici enako strmi; da se pri k₁ ≠ k₂ sekata v natanko eni točki, ne pove -/
theorem nevzporedni (k₁ n₁ k₂ n₂ : ℝ) (hk : k₁ ≠ k₂) :
    ∃! x : ℝ, k₁ * x + n₁ = k₂ * x + n₂ := by
  have hd : k₁ - k₂ ≠ 0 := sub_ne_zero.mpr hk
  refine ⟨(n₂ - n₁) / (k₁ - k₂), ?_, fun y hy => ?_⟩
  · have hc : (n₂ - n₁) / (k₁ - k₂) * (k₁ - k₂) = n₂ - n₁ := div_mul_cancel₀ _ hd
    linear_combination hc
  · rw [eq_div_iff hd]; linear_combination hy

/-- Predpostavka `nevzporedni` se da izpolniti (k₁ = 2, k₂ = −1). -/
example : (2:ℝ) ≠ -1 := by norm_num

/-- Razlaga 5 (vzporedni): pri k₁ = k₂ in n₁ ≠ n₂ premici nimata skupne točke.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#vzporedni
besedilo: »Nenavpični premici sta vzporedni, kadar imata enaka smerna koeficienta, $k_1 = k_2$, saj sta enako strmi.« -/
theorem vzporedni (k n₁ n₂ : ℝ) (hn : n₁ ≠ n₂) : ∀ x : ℝ, k * x + n₁ ≠ k * x + n₂ :=
  fun x h => hn (by linarith)

/-- Predpostavka `vzporedni` se da izpolniti (n₁ = 1, n₂ = −3). -/
example : (1:ℝ) ≠ -3 := by norm_num

/-- Razlaga 5 (pravokotni): smerna vektorja (1, k₁) in (1, k₂) sta pravokotna (skalarni produkt 0) natanko
tedaj, ko je k₁k₂ = −1.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#pravokotni-vektorja
besedilo: »Pravokotni premici pa imata smerna koeficienta, katerih produkt je $-1$: $$k_1 \cdot k_2 = -1$$« -/
theorem pravokotni_vektorja (k₁ k₂ : ℝ) : 1 * 1 + k₁ * k₂ = 0 ↔ k₁ * k₂ = -1 :=
  ⟨fun h => by linarith, fun h => by linarith⟩

/-- Razlaga 5: y = 2x je pravokotna na y = −½x + 4 (2·(−½) = −1); navpična smer (0, 1) je pravokotna na
vodoravno (1, 0).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#r5-primer
besedilo: »Premica $y = 2x$ je torej pravokotna na $y = -\dfrac{1}{2}x + 4$, ker je $2 \cdot \left(-\dfrac{1}{2}\right) = -1$.« -/
theorem r5_primer : (2:ℝ) * (-(1 / 2)) = -1 ∧ (0:ℝ) * 1 + 1 * 0 = 0 := by norm_num

/-- Razlaga 5, Premisli: pravokotnica na k = 3 ima k₂ = −1/3 (3·(−1/3) = −1); pri −3 bi bil produkt −9.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#r5-premisli
besedilo: »$k_2 = -\dfrac{1}{3}$, saj $3 \cdot \left(-\dfrac{1}{3}\right) = -1$. Pri $-3$ bi bil produkt $-9$« -/
theorem r5_premisli (k₂ : ℝ) : (3 * k₂ = -1 ↔ k₂ = -1 / 3) ∧ (3:ℝ) * (-3) = -9 :=
  ⟨⟨fun h => by linarith, fun h => by subst h; norm_num⟩, by norm_num⟩

/-- Ponovitev, Pogoste napake 3, Bolj natančno: pravokotnica ima k₂ = −1/k₁ (k₁ ≠ 0), ker je
k₁·(−1/k₁) = −1; zasuk stopnice (1, k) za 90° je (−k, 1) s smernim koeficientom 1/(−k) = −1/k.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#pravokotnica
besedilo: »Nova premica ima torej smerni koeficient $\dfrac{1}{-k} = -\dfrac{1}{k}$, in res je $k \cdot \left(-\dfrac{1}{k}\right) = -1$.« -/
theorem pravokotnica (k : ℝ) (hk : k ≠ 0) : k * (-1 / k) = -1 ∧ 1 / (-k) = -1 / k ∧
    (1 * (-k) + k * 1 = 0) := by
  refine ⟨by field_simp, by rw [div_neg, neg_div], by ring⟩

/-- Predpostavka `pravokotnica` se da izpolniti (k = 2). -/
example : (2:ℝ) ≠ 0 := by norm_num

/-- Pogoste napake 3: pravokotnica na k = 2 nima k = −2 ali ½ (2·(−2) = −4, 2·½ = 1), ampak −½.
pomozno – izrek preveri napako le na zgledu k = 2; lekcija navede splošen popravek k₂ = −1/k₁ -/
theorem napaka_pravokotnica : (2:ℝ) * (-2) ≠ -1 ∧ (2:ℝ) * (1 / 2) ≠ -1 ∧ (2:ℝ) * (-(1 / 2)) = -1 := by
  norm_num

/-! ## Razlaga 6: naklonski kot -/

/-- Naklonski kot premice s smernim koeficientom k: arctan k (k ≥ 0) oz. π + arctan k (k < 0). -/
noncomputable def naklon (k : ℝ) : ℝ := if 0 ≤ k then arctan k else π + arctan k

/-- Pomožno: pri k ≥ 0 je naklonski kot arctan k.
pomozno – orodje (naklonski kot pri k ≥ 0 po definiciji) -/
theorem naklon_nonneg {k : ℝ} (hk : 0 ≤ k) : naklon k = arctan k := by
  unfold naklon; split_ifs
  rfl

/-- Predpostavka `naklon_nonneg` se da izpolniti (k = 1). -/
example : (0:ℝ) ≤ 1 := by norm_num

/-- Pomožno: pri k < 0 je naklonski kot π + arctan k.
pomozno – orodje (naklonski kot pri k < 0 po definiciji) -/
theorem naklon_neg {k : ℝ} (hk : k < 0) : naklon k = π + arctan k := by
  unfold naklon; split_ifs with h
  · exact absurd hk (not_lt.mpr h)
  · rfl

/-- Predpostavka `naklon_neg` se da izpolniti (k = −1). -/
example : (-1:ℝ) < 0 := by norm_num

/-- Razlaga 6, Ustno 2, Povzetek: k = tan α.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#naklon-tan
besedilo: »In to razmerje je ravno smerni koeficient: $$k = \tan\alpha$$« -/
theorem naklon_tan (k : ℝ) : tan (naklon k) = k := by
  unfold naklon
  split_ifs
  · exact tan_arctan k
  · rw [add_comm, tan_add_pi, tan_arctan]

/-- Razlaga 6: 0° ≤ α < 180°.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#naklon-meje
besedilo: »Kot $\alpha$, ki ga premica oklepa s pozitivnim delom osi $x$, je **naklonski kot**; velja $0^\circ \le \alpha < 180^\circ$.« -/
theorem naklon_meje (k : ℝ) : 0 ≤ naklon k ∧ naklon k < π := by
  have a1 := arctan_lt_pi_div_two k
  have a2 := neg_pi_div_two_lt_arctan k
  have hp := Real.pi_pos
  unfold naklon
  split_ifs with h
  · exact ⟨arctan_nonneg.mpr h, by linarith⟩
  · have := arctan_lt_zero.mpr (lt_of_not_ge h)
    constructor <;> linarith

/-- Razlaga 6: pri naraščajoči premici (k > 0) je naklonski kot oster, pri padajoči (k < 0) top.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#naklon-oster-top
besedilo: »Pri naraščajoči premici je oster, pri padajoči top.« -/
theorem naklon_oster_top (k : ℝ) : (0 < k → naklon k < π / 2) ∧ (k < 0 → π / 2 < naklon k) := by
  have a1 := arctan_lt_pi_div_two k
  have a2 := neg_pi_div_two_lt_arctan k
  refine ⟨fun hk => ?_, fun hk => ?_⟩
  · rw [naklon_nonneg hk.le]; exact a1
  · rw [naklon_neg hk]; linarith

/-- Razlaga 6: naklonski kot je edini kot α ∈ [0, π), α ≠ π/2, s tan α = k.
pomozno – enoličnost kota s tan α = k na [0°, 180°) lekcija ne pove (orodje za definicijo naklonskega kota) -/
theorem naklon_enolicen (k α : ℝ) (h0 : 0 ≤ α) (h1 : α < π) (h2 : α ≠ π / 2) (ht : tan α = k) :
    α = naklon k := by
  have hp := Real.pi_pos
  rcases lt_or_gt_of_ne h2 with h | h
  · have ha : arctan k = α := by rw [← ht]; exact arctan_tan (by linarith) h
    have hk : 0 ≤ k := arctan_nonneg.mp (by rw [ha]; exact h0)
    rw [naklon_nonneg hk, ha]
  · have htb : tan (α - π) = k := by rw [← tan_add_pi (α - π), sub_add_cancel, ht]
    have ha : arctan k = α - π := by rw [← htb]; exact arctan_tan (by linarith) (by linarith)
    have hk : k < 0 := arctan_lt_zero.mp (by rw [ha]; linarith)
    rw [naklon_neg hk, ha]; ring

/-- Predpostavke `naklon_enolicen` se dajo izpolniti (α = π/4, k = 1). -/
example : (0:ℝ) ≤ π / 4 ∧ π / 4 < π ∧ π / 4 ≠ π / 2 ∧ tan (π / 4) = 1 := by
  have hp := Real.pi_pos
  exact ⟨by positivity, by linarith, by intro h; linarith, tan_pi_div_four⟩

/-- Razlaga 6, Ustno 2: tan α = dvig/pomik = (kd)/d = k (neodvisno od d ≠ 0); pri k = 3/4: 4 v desno in 3
gor; večji trikotnik (3t)/(4t) = 3/4.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#dvig-pomik
besedilo: »\dfrac{kd}{d} = k$, kar je neodvisno od izbire $d$.« -/
theorem dvig_pomik (k d t : ℝ) (hd : d ≠ 0) (ht : t ≠ 0) : (k * d) / d = k ∧ (3 / 4 : ℝ) * 4 = 3 ∧
    (3 * t) / (4 * t) = 3 / 4 := by
  refine ⟨by field_simp, by norm_num, ?_⟩
  rw [mul_div_mul_right _ _ ht]

/-- Predpostavki `dvig_pomik` se dasta izpolniti (d = t = 1). -/
example : (1:ℝ) ≠ 0 := by norm_num

/-- Ustno 2: pri padajoči premici je tan α = −tan(180° − α).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#ustno2-top
besedilo: »$\tan\alpha = -\tan(180^\circ - \alpha)« -/
theorem ustno2_top (α : ℝ) : tan α = -tan (π - α) := by rw [tan_pi_sub, neg_neg]

/-- Razlaga 6: α = arctan 0,75 ≈ 36,87°.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#r6-075
besedilo: »Tu: $\alpha = \tan^{-1} 0{,}75 \approx 36{,}87^\circ$.« -/
theorem r6_075 : naklon 0.75 = arctan 0.75 ∧ |arctan 0.75 * 180 / π - 36.87| < 0.005 := by
  refine ⟨naklon_nonneg (by norm_num), st_075⟩

/-- Razlaga 6 in tabela: pri k = −1 je α = 180° − 45° = 135°.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#r6-minus1
besedilo: »pri $k = -1$ je $\alpha = 180^\circ - 45^\circ = 135^\circ$« -/
theorem r6_minus1 : naklon (-1) = π - π / 4 ∧ (π - π / 4) * 180 / π = 135 := by
  constructor
  · rw [naklon_neg (by norm_num), arctan_neg, arctan_one]; ring
  · have := Real.pi_pos.ne'; field_simp; ring

/-- Razlaga 6, tabela: k = 0, √3/3, 1, √3 dajo α = 0°, 30°, 45°, 60°.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#r6-tabela
besedilo: »| $0$ | $0^\circ$ | | $\frac{\sqrt{3}}{3}$ | $30^\circ$ | | $1$ | $45^\circ$ | | $\sqrt{3}$ | $60^\circ$ |« -/
theorem r6_tabela : naklon 0 * 180 / π = 0 ∧ naklon (√3 / 3) * 180 / π = 30 ∧
    naklon 1 * 180 / π = 45 ∧ naklon (√3) * 180 / π = 60 := by
  have hp := Real.pi_pos.ne'
  have h3 : √3 / 3 = (√3)⁻¹ := by
    have hs : (0:ℝ) < √3 := by positivity
    field_simp
    rw [Real.sq_sqrt (by norm_num)]
  have hn : (0:ℝ) ≤ √3 := Real.sqrt_nonneg 3
  refine ⟨?_, ?_, ?_, ?_⟩
  · rw [naklon_nonneg le_rfl, arctan_zero]; ring
  · rw [naklon_nonneg (by positivity), h3, arctan_inv_sqrt_three]; field_simp; ring
  · rw [naklon_nonneg (by norm_num), arctan_one]; field_simp; ring
  · rw [naklon_nonneg hn, arctan_sqrt_three]; field_simp; ring

/-! ## Razlaga 7: kot med premicama -/

/-- Pomožno: manjši od kotov |d| in 180° − |d|. -/
noncomputable def ostri (d : ℝ) : ℝ := min |d| (π - |d|)

/-- Kot med premicama s smernima koeficientoma k₁, k₂ (Razlaga 7): |α₂ − α₁|, oziroma 180° minus to, če je
razlika večja od 90°. -/
noncomputable def kotMed (k₁ k₂ : ℝ) : ℝ := ostri (naklon k₂ - naklon k₁)

/-- Pomožno: ostri(u + π) = ostri(u) za −π < u < 0.
pomozno – orodje (ostri kot se pri premiku za π ne spremeni) -/
theorem ostri_add_pi (u : ℝ) (h1 : -π < u) (h2 : u < 0) : ostri (u + π) = ostri u := by
  unfold ostri
  rw [abs_of_pos (by linarith : 0 < u + π), abs_of_neg h2, min_comm]
  congr 1 <;> ring

/-- Predpostavki `ostri_add_pi` se dasta izpolniti (u = −π/2). -/
example : -π < -(π / 2) ∧ -(π / 2) < 0 := by
  have := Real.pi_pos; constructor <;> linarith

/-- Pomožno: ostri(u − π) = ostri(u) za 0 < u < π.
pomozno – orodje (ostri kot se pri premiku za −π ne spremeni) -/
theorem ostri_sub_pi (u : ℝ) (h1 : 0 < u) (h2 : u < π) : ostri (u - π) = ostri u := by
  unfold ostri
  rw [abs_of_neg (by linarith : u - π < 0), abs_of_pos h1, min_comm]
  congr 1 <;> ring

/-- Predpostavki `ostri_sub_pi` se dasta izpolniti (u = π/2). -/
example : (0:ℝ) < π / 2 ∧ π / 2 < π := by
  have := Real.pi_pos; constructor <;> linarith

/-- Pomožno: kot med premicama je enak ostri(arctan k₂ − arctan k₁).
pomozno – orodje (kot med premicama prek razlike arctan) -/
theorem kotMed_arctan (k₁ k₂ : ℝ) : kotMed k₁ k₂ = ostri (arctan k₂ - arctan k₁) := by
  have a1 := arctan_lt_pi_div_two k₁
  have a2 := neg_pi_div_two_lt_arctan k₁
  have b1 := arctan_lt_pi_div_two k₂
  have b2 := neg_pi_div_two_lt_arctan k₂
  unfold kotMed naklon
  split_ifs with h2 h1 h1
  · rfl
  · have hn := arctan_lt_zero.mpr (lt_of_not_ge h1)
    have hp := arctan_nonneg.mpr h2
    rw [show arctan k₂ - (π + arctan k₁) = (arctan k₂ - arctan k₁) - π by ring]
    exact ostri_sub_pi _ (by linarith) (by linarith)
  · have hn := arctan_lt_zero.mpr (lt_of_not_ge h2)
    have hp := arctan_nonneg.mpr h1
    rw [show π + arctan k₂ - arctan k₁ = (arctan k₂ - arctan k₁) + π by ring]
    exact ostri_add_pi _ (by linarith) (by linarith)
  · congr 1; ring

/-- Pomožno: |arctan q| = arctan |q|.
pomozno – orodje (|arctan q| = arctan |q|) -/
theorem abs_arctan (q : ℝ) : |arctan q| = arctan |q| := by
  rcases le_or_gt 0 q with h | h
  · rw [abs_of_nonneg h, abs_of_nonneg (arctan_nonneg.mpr h)]
  · rw [abs_of_neg h, abs_of_neg (arctan_lt_zero.mpr h), arctan_neg]

/-- Razlaga 7, Povzetek: pri 1 + k₁k₂ ≠ 0 je kot med premicama φ = arctan |(k₂ − k₁)/(1 + k₁k₂)|,
torej tan φ = |(k₂ − k₁)/(1 + k₁k₂)|.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#kot-med-premicama
besedilo: »Izračunamo ga iz smernih koeficientov: $$\tan\varphi = \left|\frac{k_2 - k_1}{1 + k_1 k_2}\right|$$« -/
theorem kot_med_premicama (k₁ k₂ : ℝ) (h : 1 + k₁ * k₂ ≠ 0) :
    kotMed k₁ k₂ = arctan |(k₂ - k₁) / (1 + k₁ * k₂)| := by
  have a1 := arctan_lt_pi_div_two k₁
  have a2 := neg_pi_div_two_lt_arctan k₁
  have b1 := arctan_lt_pi_div_two k₂
  have b2 := neg_pi_div_two_lt_arctan k₂
  set q := (k₂ - k₁) / (1 + k₁ * k₂) with hq
  have c1 := arctan_lt_pi_div_two q
  have c2 := neg_pi_div_two_lt_arctan q
  have hqe : (k₂ + -k₁) / (1 - k₂ * -k₁) = q := by rw [hq]; ring
  have hθ : arctan k₂ - arctan k₁ = arctan k₂ + arctan (-k₁) := by rw [arctan_neg]; ring
  rw [kotMed_arctan, hθ]
  unfold ostri
  rcases lt_or_gt_of_ne h with hneg | hpos
  · have hm : 1 < k₂ * -k₁ := by linarith
    rcases lt_trichotomy k₂ 0 with hk | hk | hk
    · rw [arctan_add_eq_sub_pi hm hk, hqe]
      have hpos' : 0 < arctan q := by
        have : arctan k₂ + arctan (-k₁) = arctan q - π := by rw [arctan_add_eq_sub_pi hm hk, hqe]
        rw [arctan_neg] at this; linarith
      have hq0 : 0 < q := arctan_pos.mp hpos'
      rw [abs_of_neg (by linarith : arctan q - π < 0), min_eq_right (by linarith), abs_of_pos hq0]
      ring
    · rw [hk] at hm; simp at hm; linarith
    · rw [arctan_add_eq_add_pi hm hk, hqe]
      have hneg' : arctan q < 0 := by
        have : arctan k₂ + arctan (-k₁) = arctan q + π := by rw [arctan_add_eq_add_pi hm hk, hqe]
        rw [arctan_neg] at this; linarith
      have hq0 : q < 0 := arctan_lt_zero.mp hneg'
      rw [abs_of_pos (by linarith : 0 < arctan q + π), min_eq_right (by linarith), abs_of_neg hq0,
        arctan_neg]
      ring
  · have hm : k₂ * -k₁ < 1 := by linarith
    rw [arctan_add hm, hqe, abs_arctan]
    have := arctan_lt_pi_div_two |q|
    exact min_eq_left (by linarith)

/-- Predpostavka `kot_med_premicama` se da izpolniti (k₁ = 2, k₂ = −1: 1 + 2·(−1) = −1 ≠ 0). -/
example : (1:ℝ) + 2 * (-1) ≠ 0 := by norm_num

/-- Razlaga 7: 0° ≤ φ ≤ 90°.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#kotmed-meje
besedilo: »**Kot med premicama** $\varphi$ je manjši od njiju, zato $0^\circ \le \varphi \le 90^\circ$.« -/
theorem kotMed_meje (k₁ k₂ : ℝ) : 0 ≤ kotMed k₁ k₂ ∧ kotMed k₁ k₂ ≤ π / 2 := by
  obtain ⟨p1, p2⟩ := naklon_meje k₁
  obtain ⟨q1, q2⟩ := naklon_meje k₂
  unfold kotMed ostri
  have hd : |naklon k₂ - naklon k₁| < π := by rw [abs_lt]; constructor <;> linarith
  constructor
  · exact le_min (abs_nonneg _) (by linarith)
  · rcases le_total |naklon k₂ - naklon k₁| (π / 2) with h | h
    · exact (min_le_left _ _).trans h
    · exact (min_le_right _ _).trans (by linarith)

/-- Razlaga 7, Premisli: zamenjava k₁, k₂ spremeni predznak ulomka, absolutna vrednost pa ne.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#zamenjava
besedilo: »Brez nje bi zamenjava $k_1$ in $k_2$ spremenila predznak ulomka, kot pa je med premicama vedno isti.« -/
theorem zamenjava (k₁ k₂ : ℝ) : (k₁ - k₂) / (1 + k₂ * k₁) = -((k₂ - k₁) / (1 + k₁ * k₂)) ∧
    |(k₁ - k₂) / (1 + k₂ * k₁)| = |(k₂ - k₁) / (1 + k₁ * k₂)| := by
  have e : (k₁ - k₂) / (1 + k₂ * k₁) = -((k₂ - k₁) / (1 + k₁ * k₂)) := by ring
  exact ⟨e, by rw [e, abs_neg]⟩

/-- Razlaga 7 (posebni primer): vzporedni premici (k₁ = k₂) oklepata φ = 0°.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#kot-vzporedni
besedilo: »vzporedni premici ($k_1 = k_2$): $\varphi = 0^\circ$« -/
theorem kot_vzporedni (k : ℝ) : kotMed k k = 0 := by
  unfold kotMed ostri; simp [Real.pi_pos.le]

/-- Razlaga 7 (posebni primer), Preveri se 2: pri 1 + k₁k₂ = 0 je φ = 90°, in obratno.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#kot-pravokotni
besedilo: »pravokotni premici ($1 + k_1 k_2 = 0$): ulomek ni definiran, $\varphi = 90^\circ$« -/
theorem kot_pravokotni (k₁ k₂ : ℝ) : kotMed k₁ k₂ = π / 2 ↔ 1 + k₁ * k₂ = 0 := by
  constructor
  · intro h
    by_contra hne
    rw [kot_med_premicama k₁ k₂ hne] at h
    have := arctan_lt_pi_div_two |(k₂ - k₁) / (1 + k₁ * k₂)|
    linarith
  · intro h
    have hk1 : k₁ ≠ 0 := by rintro rfl; simp at h
    have hk2 : k₂ = -k₁⁻¹ := by field_simp; linarith
    rw [kotMed_arctan, hk2, arctan_neg]
    unfold ostri
    rcases lt_or_gt_of_ne hk1 with hn | hp
    · rw [arctan_inv_of_neg hn]
      rw [show -(-(π / 2) - arctan k₁) - arctan k₁ = π / 2 by ring,
        abs_of_pos (by linarith [Real.pi_pos])]
      rw [show π - π / 2 = π / 2 by ring, min_self]
    · rw [arctan_inv_of_pos hp]
      rw [show -(π / 2 - arctan k₁) - arctan k₁ = -(π / 2) by ring, abs_neg,
        abs_of_pos (by linarith [Real.pi_pos])]
      rw [show π - π / 2 = π / 2 by ring, min_self]

/-- Razlaga 7: za y = 2x in y = −x + 1 je tan φ = |(−1 − 2)/(1 + 2·(−1))| = 3, φ = arctan 3 ≈ 71,57°;
α₁ = arctan 2 ≈ 63,43°, α₂ = 135°, 135 − 63,43 = 71,57.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#r7-primer
besedilo: »Za $y = 2x$ in $y = -x + 1$: $\tan\varphi = \left|\dfrac{-1 - 2}{1 + 2 \cdot (-1)}\right| = 3$, zato $\varphi \approx 71{,}57^\circ$.« -/
theorem r7_primer : |((-1:ℝ) - 2) / (1 + 2 * (-1))| = 3 ∧ kotMed 2 (-1) = arctan 3 ∧
    |arctan 3 * 180 / π - 71.57| < 0.005 ∧ |arctan 2 * 180 / π - 63.43| < 0.005 ∧
    naklon (-1) * 180 / π = 135 ∧ (135:ℝ) - 63.43 = 71.57 := by
  have h3 := stop_inv (1 / 3) (by norm_num)
  rw [show ((1:ℝ) / 3)⁻¹ = 3 by norm_num] at h3
  have h2 := stop_inv (1 / 2) (by norm_num)
  rw [show ((1:ℝ) / 2)⁻¹ = 2 by norm_num] at h2
  have e05 : arctan (1 / 2) = arctan 0.5 := by norm_num
  refine ⟨by norm_num, ?_, ?_, ?_, ?_, by norm_num⟩
  · rw [kot_med_premicama 2 (-1) (by norm_num)]; norm_num
  · rw [h3]; exact abs_komplement (by have := st_13; norm_num at this ⊢; exact this)
  · rw [h2, e05]; exact abs_komplement (by have := st_05; norm_num at this ⊢; exact this)
  · have := r6_minus1; rw [this.1]; exact this.2

/-! ## Primer 1 -/

/-- Primer 1, koraki 1–3: 3x − 4y + 12 = 0 ⇔ 4y = 3x + 12 ⇔ y = ¾x + 3 (k = ¾, n = 3) ⇔ 3x − 4y = −12 ⇔
x/(−4) + y/3 = 1.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#p1
besedilo: »Odgovor: $y = \dfrac{3}{4}x + 3$ in $\dfrac{x}{-4} + \dfrac{y}{3} = 1$« -/
theorem p1 (x y : ℝ) : (3 * x - 4 * y + 12 = 0 ↔ 4 * y = 3 * x + 12) ∧ (4 * y = 3 * x + 12 ↔ y = 3 / 4 * x + 3) ∧
    (3 * x - 4 * y + 12 = 0 ↔ 3 * x - 4 * y = -12) ∧ (3 * x - 4 * y = -12 ↔ x / (-4) + y / 3 = 1) :=
  ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩⟩

/-- Primer 1, koraka 4–5, RACUN: pri y = 0: 3x + 12 = 0 ⇔ x = −4; presečišči (−4, 0) in (0, 3);
Pogoste napake 1: k ni 3.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#p1-preizkus
besedilo: »premica seka os $x$ v $(-4, 0)$ in os $y$ v $(0, 3)$.« -/
theorem p1_preizkus (x : ℝ) : (3 * x + 12 = 0 ↔ x = -4) ∧ (3:ℝ) * 0 - 4 * 3 + 12 = 0 ∧
    -(3:ℝ) / (-4) = 3 / 4 ∧ (3:ℝ) / 4 ≠ 3 :=
  ⟨⟨fun h => by linarith, fun h => by subst h; norm_num⟩, by norm_num, by norm_num, by norm_num⟩

/-! ## Primer 2 -/

/-- Primer 2, koraki 1–2, RACUN: k₁ = (10 − 2)/(3 − (−1)) = 8/4 = 2; y − 2 = 2(x + 1) ⇔ y = 2x + 4;
preizkus 2·3 + 4 = 10.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#p2-p
besedilo: »Skozi $A$: $y - 2 = 2(x + 1)$, torej $p\colon y = 2x + 4$. Preizkus z $B$: $2 \cdot 3 + 4 = 10$.« -/
theorem p2_p (x y : ℝ) : ((10:ℝ) - 2) / (3 - (-1)) = 8 / 4 ∧ (8:ℝ) / 4 = 2 ∧
    (y - 2 = 2 * (x + 1) ↔ y = 2 * x + 4) ∧ (2:ℝ) * 3 + 4 = 10 :=
  ⟨by norm_num, by norm_num, ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num⟩

/-- Primer 2, koraki 3–5, RACUN: 2·k₂ = −1 ⇔ k₂ = −½; y − 2 = −½(x + 1) ⇔ 2y − 4 = −x − 1 ⇔
x + 2y − 3 = 0; preizkus −1 + 4 − 3 = 0.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#p2-q
besedilo: »Vse prenesemo na levo: $x + 2y - 3 = 0$. Preizkus z $A$: $-1 + 4 - 3 = 0$.« -/
theorem p2_q (k₂ x y : ℝ) : (2 * k₂ = -1 ↔ k₂ = -(1 / 2)) ∧
    (y - 2 = -(1 / 2) * (x + 1) ↔ 2 * y - 4 = -x - 1) ∧ (2 * y - 4 = -x - 1 ↔ x + 2 * y - 3 = 0) ∧
    (-1:ℝ) + 2 * 2 - 3 = 0 :=
  ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num⟩

/-! ## Primer 3 -/

/-- Primer 3, koraka 1–2, RACUN: k₁ = 3/4 = 0,75 (y = 0,75x gre skozi (0, 0) in (4, 3)); k₂ = (0 − 3)/(10 − 4)
= −0,5; y − 3 = −0,5(x − 4) ⇔ y = −0,5x + 5 (gre skozi (10, 0)); premici se sekata natanko v S(4, 3).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#p3-premici
besedilo: »Odgovor: strešini ležita na $y = 0{,}75x$ in $y = -0{,}5x + 5$« -/
theorem p3_premici (x y : ℝ) : (3:ℝ) / 4 = 0.75 ∧ (0.75:ℝ) * 4 = 3 ∧ ((0:ℝ) - 3) / (10 - 4) = -0.5 ∧
    (y - 3 = -0.5 * (x - 4) ↔ y = -0.5 * x + 5) ∧ (-0.5:ℝ) * 10 + 5 = 0 ∧
    ((y = 0.75 * x ∧ y = -0.5 * x + 5) ↔ (x = 4 ∧ y = 3)) := by
  refine ⟨by norm_num, by norm_num, by norm_num, ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num,
    ⟨fun ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩, ?_⟩⟩
  rintro ⟨rfl, rfl⟩; norm_num

/-- Primer 3, korak 3, RACUN: tan φ = |(−0,5 − 0,75)/(1 + 0,75·(−0,5))| = 1,25/0,625 = 2, φ = arctan 2 ≈ 63,43°.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#p3-kot
besedilo: »$\tan\varphi = \left|\dfrac{-0{,}5 - 0{,}75}{1 + 0{,}75 \cdot (-0{,}5)}\right| = \dfrac{1{,}25}{0{,}625} = 2$, zato $\varphi \approx 63{,}43^\circ$.« -/
theorem p3_kot : |((-0.5:ℝ) - 0.75) / (1 + 0.75 * (-0.5))| = 1.25 / 0.625 ∧ (1.25:ℝ) / 0.625 = 2 ∧
    kotMed 0.75 (-0.5) = arctan 2 ∧ |arctan 2 * 180 / π - 63.43| < 0.005 := by
  refine ⟨by norm_num [abs_div], by norm_num, ?_, r7_primer.2.2.2.1⟩
  rw [kot_med_premicama _ _ (by norm_num)]; norm_num

/-- Primer 3, korak 4, RACUN: pri slemenu je sokot 180° − φ ≈ 180 − 63,43 = 116,57°.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#p3-sleme
besedilo: »sokot, $180^\circ - 63{,}43^\circ = 116{,}57^\circ$.« -/
theorem p3_sleme : |(π - arctan 2) * 180 / π - 116.57| < 0.005 ∧ (180:ℝ) - 63.43 = 116.57 := by
  refine ⟨?_, by norm_num⟩
  have e : (π - arctan 2) * 180 / π = 180 - arctan 2 * 180 / π := by
    have := Real.pi_pos.ne'; field_simp
  rw [e]
  have := r7_primer.2.2.2.1
  rw [abs_sub_lt_iff] at this ⊢; constructor <;> linarith

/-- Primer 3, korak 5, RACUN: kota trikotnika ob tleh arctan 0,75 ≈ 36,87° in arctan 0,5 ≈ 26,57°; točno je
π − arctan 0,75 − arctan 0,5 = π − arctan 2 (vsota kotov se ujema s sokotom), z zaokroženimi vrednostmi
180 − 36,87 − 26,57 = 116,56.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#p3-preizkus
besedilo: »zato je po vsoti kotov v trikotniku kot pri slemenu $180^\circ - 36{,}87^\circ - 26{,}57^\circ = 116{,}56^\circ$« -/
theorem p3_preizkus : |arctan 0.75 * 180 / π - 36.87| < 0.005 ∧ |arctan 0.5 * 180 / π - 26.57| < 0.005 ∧
    π - arctan 0.75 - arctan 0.5 = π - arctan 2 ∧ (180:ℝ) - 36.87 - 26.57 = 116.56 := by
  refine ⟨st_075, st_05, ?_, by norm_num⟩
  rw [sub_sub, arctan_add (by norm_num)]; norm_num

/-! ## Primer 4 -/

/-- Primer 4, Premisli, RACUN: opora ima k = 4/3, α = arctan(4/3) ≈ 53,13°; s steno (navpična, 90°) oklepa
φ = |90° − α| = arctan(3/4) ≈ 36,87° (90 − 53,13 = 36,87).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#p4
besedilo: »$\alpha = \tan^{-1} \dfrac{4}{3} \approx 53{,}13^\circ$, zato $\varphi = 90^\circ - 53{,}13^\circ = 36{,}87^\circ$.« -/
theorem p4 : (4:ℝ) / 3 = (4 - 0) / (3 - 0) ∧ |arctan (4 / 3) * 180 / π - 53.13| < 0.005 ∧
    ostri (π / 2 - arctan (4 / 3)) = arctan (3 / 4) ∧ |arctan (3 / 4) * 180 / π - 36.87| < 0.005 ∧
    (90:ℝ) - 53.13 = 36.87 := by
  have h := stop_inv (3 / 4) (by norm_num)
  rw [show ((3:ℝ) / 4)⁻¹ = 4 / 3 by norm_num] at h
  have e : arctan (3 / 4) = arctan 0.75 := by norm_num
  have hd : π / 2 - arctan (4 / 3) = arctan (3 / 4) := by
    rw [show (4:ℝ) / 3 = (3 / 4)⁻¹ by norm_num, arctan_inv_of_pos (by norm_num)]; ring
  refine ⟨by norm_num, ?_, ?_, by rw [e]; exact st_075, by norm_num⟩
  · rw [h, e]; exact abs_komplement (by have := st_075; norm_num at this ⊢; exact this)
  · unfold ostri
    rw [hd, abs_of_pos (arctan_pos.mpr (by norm_num))]
    exact min_eq_left (by linarith [arctan_lt_pi_div_two (3 / 4)])

/-! ## Pogoste napake -/

/-- Pogoste napake 4 (RAD): arctan 0,08 v radianih je ≈ 0,08 (|arctan 0,08 − 0,08| < 0,005), v stopinjah ≈ 4,57°;
obrnjeno razmerje da kot, ki prvega dopolni do 90° (arctan(1/k) = 90° − arctan k za k > 0).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#napaka-rad
besedilo: »$\tan^{-1} 0{,}08$ v načinu RAD da $0{,}08$, ne $4{,}57^\circ$. Kdor deli pomik z dvigom, dobi kot, ki pravega dopolni do $90^\circ$.« -/
theorem napaka_rad (k : ℝ) (hk : 0 < k) : |arctan 0.08 - 0.08| < 0.005 ∧
    arctan k⁻¹ * 180 / π = 90 - arctan k * 180 / π := by
  refine ⟨?_, stop_inv k hk⟩
  obtain ⟨hL, hU⟩ := arctan_meje 0.08 (by norm_num) (by norm_num) 1
  norm_num [Finset.sum_range_succ] at hL hU
  rw [abs_sub_lt_iff]; constructor <;> linarith

/-- Predpostavka `napaka_rad` se da izpolniti (k = 0,08). -/
example : (0:ℝ) < 0.08 := by norm_num

/-! ## Za maturo -/

/-- Naloga 1, RACUN: 3x + 2y − 1 = 0 ⇔ y = −3/2·x + 1/2 (k = −3/2); skozi T(2, 3): y − 3 = −3/2(x − 2) ⇔
y = −3/2·x + 6 ⇔ 3x + 2y = 12 ⇔ x/4 + y/6 = 1; odseka (4, 0) in (0, 6).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#m1
besedilo: »Odgovor: $\dfrac{x}{4} + \dfrac{y}{6} = 1$.« -/
theorem m1 (x y : ℝ) : (3 * x + 2 * y - 1 = 0 ↔ y = -(3 / 2) * x + 1 / 2) ∧
    (y - 3 = -(3 / 2) * (x - 2) ↔ y = -(3 / 2) * x + 6) ∧ (y = -(3 / 2) * x + 6 ↔ 3 * x + 2 * y = 12) ∧
    (3 * x + 2 * y = 12 ↔ x / 4 + y / 6 = 1) ∧ ((3:ℝ) * 4 + 2 * 0 = 12 ∧ (3:ℝ) * 0 + 2 * 6 = 12) :=
  ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num⟩

/-- Naloga 2 a), RACUN: k₁ = (4 − 1)/(4 − (−2)) = ½; y − 1 = ½(x + 2) ⇔ 2y − 2 = x + 2 ⇔ x − 2y + 4 = 0;
k₂ = (−3 − 1)/(3 − (−2)) = −4/5; y − 1 = −4/5(x + 2) ⇔ 5y − 5 = −4x − 8 ⇔ 4x + 5y + 3 = 0;
B in C ležita na premicah.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#m2-a
besedilo: »Odgovor: $AB\colon x - 2y + 4 = 0$, $AC\colon 4x + 5y + 3 = 0$« -/
theorem m2_a (x y : ℝ) : ((4:ℝ) - 1) / (4 - (-2)) = 1 / 2 ∧ ((-3:ℝ) - 1) / (3 - (-2)) = -4 / 5 ∧
    (y - 1 = 1 / 2 * (x + 2) ↔ 2 * y - 2 = x + 2) ∧ (2 * y - 2 = x + 2 ↔ x - 2 * y + 4 = 0) ∧
    (y - 1 = -4 / 5 * (x + 2) ↔ 5 * y - 5 = -4 * x - 8) ∧ (5 * y - 5 = -4 * x - 8 ↔ 4 * x + 5 * y + 3 = 0) ∧
    (4:ℝ) - 2 * 4 + 4 = 0 ∧ (4:ℝ) * 3 + 5 * (-3) + 3 = 0 :=
  ⟨by norm_num, by norm_num, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by linarith⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, by norm_num⟩

/-- Naloga 2 b), RACUN: k₂ = −0,8 < 0, naklonski kot je top: arctan 0,8 ≈ 38,66°, α₂ = 180° − 38,66° ≈ 141,34°.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#m2-b
besedilo: »Naklonski kot premice $AC$: $\alpha_2 = 180^\circ - 38{,}66^\circ = 141{,}34^\circ$.« -/
theorem m2_b : (-4:ℝ) / 5 = -0.8 ∧ naklon (-0.8) = π - arctan 0.8 ∧ |arctan 0.8 * 180 / π - 38.66| < 0.005 ∧
    |(π - arctan 0.8) * 180 / π - 141.34| < 0.005 := by
  refine ⟨by norm_num, ?_, st_08, ?_⟩
  · rw [naklon_neg (by norm_num), arctan_neg]; ring
  · have e : (π - arctan 0.8) * 180 / π = 180 - arctan 0.8 * 180 / π := by
      have := Real.pi_pos.ne'; field_simp
    rw [e]
    have := st_08
    rw [abs_sub_lt_iff] at this ⊢; constructor <;> linarith

/-- Naloga 2 c), RACUN: tan φ = |(−4/5 − ½)/(1 + ½·(−4/5))| = (13/10)/(3/5) = 13/6, φ = arctan(13/6) ≈ 65,22°;
arctan ½ + arctan 0,8 = arctan(13/6) < 90° (26,57° + 38,66° ≈ 65,2°).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#m2-c
besedilo: »$\tan\varphi = \left|\dfrac{-\frac{4}{5} - \frac{1}{2}}{1 + \frac{1}{2} \cdot \left(-\frac{4}{5}\right)}\right| = \dfrac{\frac{13}{10}}{\frac{3}{5}} = \dfrac{13}{6}$, zato $\varphi = \tan^{-1} \dfrac{13}{6} \approx 65{,}22^\circ$.« -/
theorem m2_c : |((-4:ℝ) / 5 - 1 / 2) / (1 + 1 / 2 * (-4 / 5))| = (13 / 10) / (3 / 5) ∧
    ((13:ℝ) / 10) / (3 / 5) = 13 / 6 ∧ kotMed (1 / 2) (-4 / 5) = arctan (13 / 6) ∧
    |arctan (13 / 6) * 180 / π - 65.22| < 0.005 ∧
    arctan 0.5 + arctan 0.8 = arctan (13 / 6) ∧ arctan 0.5 + arctan 0.8 < π / 2 ∧
    |(arctan 0.5 * 180 / π + arctan 0.8 * 180 / π) - 65.22| < 0.005 ∧ (26.57:ℝ) + 38.66 = 65.23 := by
  have hs : arctan 0.5 + arctan 0.8 = arctan (13 / 6) := by rw [arctan_add (by norm_num)]; norm_num
  have h := stop_inv (6 / 13) (by norm_num)
  rw [show ((6:ℝ) / 13)⁻¹ = 13 / 6 by norm_num] at h
  have hdeg : |arctan (13 / 6) * 180 / π - 65.22| < 0.005 := by
    rw [h]; exact abs_komplement (by have := st_613; norm_num at this ⊢; exact this)
  refine ⟨by norm_num [abs_div], by norm_num, ?_, hdeg, hs, arctan_add_arctan_lt_pi_div_two (by norm_num),
    ?_, by norm_num⟩
  · rw [kot_med_premicama _ _ (by norm_num)]; norm_num
  · have e : arctan 0.5 * 180 / π + arctan 0.8 * 180 / π = arctan (13 / 6) * 180 / π := by
      rw [← hs]; ring
    rw [e]; exact hdeg

/-! ## Ustna vprašanja, Na sliki -/

/-- Ustno 3: y = 2x + 1 je vzporedna y = 2x − 3 (nimata skupne točke) in pravokotna na y = −½x
(2·(−½) = −1).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#ustno3
besedilo: »Premica $y = 2x + 1$ je na primer vzporedna premici $y = 2x - 3$ in pravokotna na premico $y = -\dfrac{1}{2}x$.« -/
theorem ustno3 : (∀ x : ℝ, 2 * x + 1 ≠ 2 * x - 3) ∧ (2:ℝ) * (-(1 / 2)) = -1 :=
  ⟨fun x h => by linarith, by norm_num⟩

/-- Na sliki: ostri in topi kot med premicama se dopolnjujeta do 180°; stopnici 0,75 gor in 0,5 dol.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#na-sliki
besedilo: »Ostri in topi kot se dopolnjujeta do $180^\circ$.« -/
theorem na_sliki (φ x : ℝ) : φ + (π - φ) = π ∧ (0.75 * (x + 1)) - 0.75 * x = (0.75:ℝ) ∧
    (-0.5 * (x + 1) + 5) - (-0.5 * x + 5) = (-0.5:ℝ) := ⟨by ring, by ring, by ring⟩

/-! ## Preveri se -/

/-- Preveri se 1: premica skozi A(3, 0) in B(0, 2) je x/3 + y/2 = 1; x/2 + y/3 = 1 in 3x + 2y = 1 ne gresta
skozi A, x/3 − y/2 = 1 ne gre skozi B.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#preveri-1
besedilo: »Odseka sta $m = 3$ in $n = 2$, zato $\dfrac{x}{3} + \dfrac{y}{2} = 1$.« -/
theorem preveri_1 : ((3:ℝ) / 3 + 0 / 2 = 1 ∧ (0:ℝ) / 3 + 2 / 2 = 1) ∧ (3:ℝ) / 2 + 0 / 3 ≠ 1 ∧
    (3:ℝ) * 3 + 2 * 0 ≠ 1 ∧ (0:ℝ) / 3 - 2 / 2 ≠ 1 := by norm_num

/-- Preveri se 2: pri y = 2x in y = −½x + 3 je 1 + 2·(−½) = 0, premici sta pravokotni, φ = 90°.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#preveri-2
besedilo: »$1 + 2 \cdot \left(-\dfrac{1}{2}\right) = 0$, z $0$ ne delimo. Tangens kota $90^\circ$ ne obstaja, premici pa sta pravokotni.« -/
theorem preveri_2 : (1:ℝ) + 2 * (-(1 / 2)) = 0 ∧ kotMed 2 (-(1 / 2)) = π / 2 :=
  ⟨by norm_num, (kot_pravokotni _ _).mpr (by norm_num)⟩

/-- Preveri se 3, RACUN: k = 0,4/5 = 0,08, α = arctan 0,08 ≈ 4,57°; 90 − 4,57 = 85,43; napačni odgovori
0,08, 85,43 in 82,87 niso kot α v stopinjah.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#preveri-3
besedilo: »$k = \dfrac{0{,}4\,\text{m}}{5\,\text{m}} = 0{,}08$, $\alpha = \tan^{-1} 0{,}08 \approx 4{,}57^\circ$.« -/
theorem preveri_3 : (0.4:ℝ) / 5 = 0.08 ∧ |arctan 0.08 * 180 / π - 4.57| < 0.005 ∧ (90:ℝ) - 4.57 = 85.43 ∧
    arctan 0.08 * 180 / π ≠ 0.08 ∧ arctan 0.08 * 180 / π ≠ 85.43 ∧ arctan 0.08 * 180 / π ≠ 82.87 := by
  have hb : |arctan 0.08 * 180 / π - 4.57| < 0.005 := by
    obtain ⟨hL, hU⟩ := arctan_meje 0.08 (by norm_num) (by norm_num) 2
    refine stopinje_iz_mej hL hU (by norm_num) (by norm_num) ?_ ?_ <;> norm_num [Finset.sum_range_succ]
  have h2 := abs_lt.mp hb
  refine ⟨by norm_num, hb, by norm_num, ?_, ?_, ?_⟩ <;> intro h <;> rw [h] at h2 <;> norm_num at h2

/-- Preveri se 4, RACUN: ax + 2y − 6 = 0 ima k = −a/2; vzporedna y = 3x + 1 natanko pri −a/2 = 3 ⇔ a = −6;
tedaj −6x + 2y − 6 = 0 ⇔ y = 3x + 3.
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#preveri-4
besedilo: »$k = -\dfrac{a}{2} = 3$, torej $a = -6$. Premica je $-6x + 2y - 6 = 0$ oziroma $y = 3x + 3$.« -/
theorem preveri_4 (a x y : ℝ) : (a * x + 2 * y - 6 = 0 ↔ y = -a / 2 * x + 3) ∧ (-a / 2 = 3 ↔ a = -6) ∧
    (-6 * x + 2 * y - 6 = 0 ↔ y = 3 * x + 3) :=
  ⟨⟨fun h => by linarith, fun h => by linarith⟩, ⟨fun h => by linarith, fun h => by subst h; norm_num⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩⟩

/-- Preveri se 5, RACUN: α₁ = 45° (k = 1), α₂ = 60° (k = √3), kot med letvama je 60° − 45° = 15°
(ne 105°, 75° ali 60°).
trditev: MAT-SS-1/enacbe-premice-in-kot-med-premicama#preveri-5
besedilo: »$\alpha_1 = 45^\circ$ ($k = 1$), $\alpha_2 = 60^\circ$ ($k = \sqrt{3}$), zato $\varphi = 60^\circ - 45^\circ = 15^\circ$.« -/
theorem preveri_5 : arctan (√3) * 180 / π - arctan 1 * 180 / π = 15 ∧ kotMed 1 (√3) * 180 / π = 15 := by
  have hp := Real.pi_pos
  have hd : arctan (√3) - arctan 1 = π / 12 := by rw [arctan_sqrt_three, arctan_one]; ring
  have hn : (0:ℝ) ≤ √3 := Real.sqrt_nonneg 3
  constructor
  · rw [arctan_sqrt_three, arctan_one]; field_simp; ring
  · rw [kotMed_arctan, hd]
    unfold ostri
    rw [abs_of_pos (by positivity), min_eq_left (by linarith)]
    field_simp; ring

end Evklid.Lekcije.MAT_SS_1.EnacbePremiceInKotMedPremicama
