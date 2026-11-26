/-
vir: content/lessons/MAT-SS-4/geometrijska-vrsta.md
sha256: c87d97cf477bcc001064b99fa760e72438aac2651046ea7d083e1cc22a56afa2
Ni v Leanu: zgodovina (Zenon, Arhimed); simulacija; modeliranje zgodb (Ahil in želva, žoga,
  čokolada): dokazani so računi in vsote vrst, ne to, da opisujejo gibanje; trditev »prava žoga
  obmiruje po končno mnogo odbojih« (fizika); zaokrožitve (t ≈ 11,1 s, napaka ≈ 0,0011 m, ≈ 11,4) so
  dokazane kot meje; definicije (vrsta, delna vsota) niso trditve; točkovanje.
  Vrsta a₁ + a₁q + … je zapisana z delnimi vsotami Sₙ = ∑_{k<n} a₁qᵏ, »konvergira« pa pomeni, da ima
  (Sₙ) limito, kot v lekciji.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.GeometrijskaVrsta

open Filter Topology Finset

/-- n-ta delna vsota geometrijske vrste: Sₙ = a₁ + a₁q + … + a₁qⁿ⁻¹. -/
noncomputable def S (a₁ q : ℝ) (n : ℕ) : ℝ := ∑ k ∈ range n, a₁ * q ^ k

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem S_succ (a₁ q : ℝ) (n : ℕ) : S a₁ q (n + 1) = S a₁ q n + a₁ * q ^ n := by
  simp [S, sum_range_succ]

/-! ## Razlaga -/

/-- Razlaga, Ahil: a₁ = 100, q = 1/10: odseki 100, 10, 1, 0,1, 0,01 in delne vsote 100, 110, 111,
111,1, 111,11.
trditev: MAT-SS-4/geometrijska-vrsta#ahil-tabela
besedilo: »| 1 | 100 | 100 | | 2 | 10 | 110 | | 3 | 1 | 111 | | 4 | 0,1 | 111,1 | | 5 | 0,01 | 111,11 |« -/
theorem ahil_tabela :
    (List.range 5).map (fun k => (100 : ℝ) * (1 / 10) ^ k) = [100, 10, 1, 0.1, 0.01] ∧
    S 100 (1 / 10) 1 = 100 ∧ S 100 (1 / 10) 2 = 110 ∧ S 100 (1 / 10) 3 = 111 ∧
    S 100 (1 / 10) 4 = 111.1 ∧ S 100 (1 / 10) 5 = 111.11 := by
  refine ⟨by norm_num [List.range_succ], ?_, ?_, ?_, ?_, ?_⟩ <;> norm_num [S, sum_range_succ]

/-- Razlaga, »Premisli«: nobena delna vsota ne preseže 112, ker so vse manjše od 1000/9 = 111,1̄ < 112.
trditev: MAT-SS-4/geometrijska-vrsta#ahil-112
besedilo: »Vsak nov odsek doda le enico na naslednjem decimalnem mestu: $111{,}1$; $111{,}11$; $111{,}111$ … Vse te vsote so manjše od $111{,}\overline{1}$, to pa je manj kot $112$.« -/
theorem ahil_112 (n : ℕ) : S 100 (1 / 10) n < 1000 / 9 ∧ (1000 / 9 : ℝ) < 112 := by
  refine ⟨?_, by norm_num⟩
  have : S 100 (1 / 10) n = 1000 / 9 - 1000 / 9 * (1 / 10) ^ n := by
    induction n with
    | zero => simp [S]
    | succ n ih => rw [S_succ, ih, pow_succ]; ring
  rw [this]
  have : (0 : ℝ) < (1 / 10) ^ n := by positivity
  linarith

/-- Razlaga, gibanje: 10t = 100 + t ⇔ t = 100/9 (≈ 11,1 s); takrat Ahil preteče 10·100/9 = 1000/9 m.
trditev: MAT-SS-4/geometrijska-vrsta#ahil-gibanje
besedilo: »Ahil jo ujame, ko je $10t = 100 + t$, torej pri $t = \frac{100}{9}\,\mathrm{s} \approx 11{,}1\,\mathrm{s}$. Takrat je pretekel $\frac{1000}{9}\,\mathrm{m} = 111{,}\overline{1}\,\mathrm{m}$.« -/
theorem ahil_gibanje (t : ℝ) :
    (10 * t = 100 + t ↔ t = 100 / 9) ∧ (10 : ℝ) * (100 / 9) = 1000 / 9 ∧
    (11.05 ≤ (100 / 9 : ℝ) ∧ (100 / 9 : ℝ) < 11.15) := by
  refine ⟨⟨fun h => by linarith, fun h => by rw [h]; ring⟩, by norm_num, by norm_num⟩

/-- Od primera k formuli: za q ≠ 1 je Sₙ = a₁(qⁿ − 1)/(q − 1) = a₁(1 − qⁿ)/(1 − q).
trditev: MAT-SS-4/geometrijska-vrsta#s-formula
besedilo: »Za $q \ne 1$ je $n$-ta delna vsota geometrijske vrste $S_n = a_1 \cdot \dfrac{1 - q^n}{1 - q}$.« -/
theorem S_formula (a₁ q : ℝ) (hq : q ≠ 1) (n : ℕ) :
    S a₁ q n = a₁ * ((q ^ n - 1) / (q - 1)) ∧
    a₁ * ((q ^ n - 1) / (q - 1)) = a₁ * ((1 - q ^ n) / (1 - q)) := by
  refine ⟨by rw [S, ← mul_sum, geom_sum_eq hq], ?_⟩
  have h1 : q - 1 ≠ 0 := sub_ne_zero.mpr hq
  have h2 : 1 - q ≠ 0 := sub_ne_zero.mpr (Ne.symm hq)
  field_simp; ring

/-- Predpostavke trditev `S_formula`, `negativna` in `napaka_delne` se dajo izpolniti (q = 1/2, n = 1). -/
example : (1 / 2 : ℝ) ≠ 1 ∧ |(1 / 2 : ℝ)| < 1 ∧ 1 ≤ (1:ℕ) := by norm_num [abs_of_pos]

/-- Predpostavke trditve `S_formula` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 / 2 : ℝ) ≠ 1 ∧ |(1 / 2 : ℝ)| < 1 ∧ 1 ≤ (1:ℕ) := by norm_num [abs_of_pos]
  S_formula (hq := w.1)

/-- Od primera k formuli: pri |q| < 1 in n ≥ 1 sta števec qⁿ − 1 in imenovalec q − 1 negativna.
trditev: MAT-SS-4/geometrijska-vrsta#negativna
besedilo: »Pri $|q| < 1$ sta števec in imenovalec negativna,« -/
theorem negativna (q : ℝ) (hq : |q| < 1) (n : ℕ) (hn : 1 ≤ n) : q ^ n - 1 < 0 ∧ q - 1 < 0 := by
  have h1 : |q ^ n| < 1 := by
    rw [abs_pow]; exact pow_lt_one₀ (abs_nonneg q) hq (by omega)
  exact ⟨by linarith [le_abs_self (q ^ n)], by linarith [le_abs_self q]⟩

/-- Predpostavke trditve `negativna` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 / 2 : ℝ) ≠ 1 ∧ |(1 / 2 : ℝ)| < 1 ∧ 1 ≤ (1:ℕ) := by norm_num [abs_of_pos]
  negativna (hq := w.2.1) (hn := w.2.2)

/-- Od primera k formuli: pri |q| < 1 gre qⁿ proti 0.
trditev: MAT-SS-4/geometrijska-vrsta#pot-nic
besedilo: »Če je $|q| < 1$, gre $q^n$ proti $0$, ko gre $n$ proti neskončnosti.« -/
theorem pot_nic (q : ℝ) (hq : |q| < 1) : Tendsto (fun n : ℕ => q ^ n) atTop (𝓝 0) :=
  tendsto_pow_atTop_nhds_zero_of_abs_lt_one hq

/-- Vsota geometrijske vrste: pri |q| < 1 delne vsote konvergirajo k S = a₁/(1 − q).
trditev: MAT-SS-4/geometrijska-vrsta#vsota
besedilo: »Tako dobimo vsoto geometrijske vrste: $$S = \frac{a_1}{1 - q}, \qquad |q| < 1$$« -/
theorem vsota (a₁ q : ℝ) (hq : |q| < 1) : Tendsto (S a₁ q) atTop (𝓝 (a₁ / (1 - q))) := by
  have := ((hasSum_geometric_of_abs_lt_one hq).mul_left a₁).tendsto_sum_nat
  rw [div_eq_mul_inv]
  exact this

/-- Ahil: delne vsote gredo proti 100/(1 − 0,1) = 1000/9.
trditev: MAT-SS-4/geometrijska-vrsta#ahil-vsota
besedilo: »delne vsote pa proti $\frac{100}{1 - 0{,}1} = \frac{1000}{9}$.« -/
theorem ahil_vsota : Tendsto (S 100 (1 / 10)) atTop (𝓝 (1000 / 9)) := by
  have := vsota 100 (1 / 10) (by rw [abs_of_pos (by norm_num)]; norm_num)
  convert this using 2; norm_num

/-- Kdaj vrsta divergira, »Premisli« in »Bolj natančno«: zaporedni delni vsoti se razlikujeta za člen
(Sₙ₊₁ − Sₙ = a₁qⁿ); pri |q| ≥ 1 je vsak člen po absolutni vrednosti vsaj |a₁|.
trditev: MAT-SS-4/geometrijska-vrsta#razlika-clen
besedilo: »Zaporedni delni vsoti se razlikujeta za cel člen: $S_n - S_{n-1} = a_n$. Pri $|q| \ge 1$ je vsak člen po absolutni vrednosti vsaj $|a_1|$.« -/
theorem razlika_clen (a₁ q : ℝ) (hq : 1 ≤ |q|) (n : ℕ) :
    S a₁ q (n + 1) - S a₁ q n = a₁ * q ^ n ∧ |a₁| ≤ |a₁ * q ^ n| := by
  refine ⟨by rw [S_succ]; ring, ?_⟩
  rw [abs_mul, abs_pow]
  exact le_mul_of_one_le_right (abs_nonneg _) (one_le_pow₀ hq)

/-- Predpostavka trditve `razlika_clen` se da izpolniti (q = 1). -/
example : 1 ≤ |(1:ℝ)| := by norm_num

/-- Predpostavke trditve `razlika_clen` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : 1 ≤ |(1:ℝ)| := by norm_num
  razlika_clen (hq := w)

/-- Vrsta konvergira natanko tedaj, ko je |q| < 1 (pri a₁ ≠ 0). Smer ⇒ je dokaz iz »Bolj natančno«:
če Sₙ → S, gredo členi a₁qⁿ = Sₙ₊₁ − Sₙ proti 0, pri |q| ≥ 1 pa je |a₁qⁿ| ≥ |a₁| > 0.
trditev: MAT-SS-4/geometrijska-vrsta#konvergira-iff
besedilo: »Vrsta torej konvergira natanko tedaj, ko je $|q| < 1$.« -/
theorem konvergira_iff (a₁ q : ℝ) (ha : a₁ ≠ 0) :
    (∃ L, Tendsto (S a₁ q) atTop (𝓝 L)) ↔ |q| < 1 := by
  constructor
  · rintro ⟨L, hL⟩
    by_contra hq
    replace hq := not_lt.mp hq
    have t1 : Tendsto (fun n => S a₁ q (n + 1)) atTop (𝓝 L) := (tendsto_add_atTop_iff_nat 1).2 hL
    have t : Tendsto (fun n => a₁ * q ^ n) atTop (𝓝 0) := by
      have := t1.sub hL
      rw [sub_self] at this
      exact this.congr (fun n => (razlika_clen a₁ q hq n).1)
    have ta : Tendsto (fun n => |a₁ * q ^ n|) atTop (𝓝 0) := by simpa using t.abs
    have hpos : 0 < |a₁| := abs_pos.mpr ha
    have ev := ta.eventually (gt_mem_nhds hpos)
    obtain ⟨N, hN⟩ := eventually_atTop.1 ev
    have := (razlika_clen a₁ q hq N).2
    linarith [hN N le_rfl]
  · intro hq; exact ⟨_, vsota a₁ q hq⟩

/-- Predpostavka a₁ ≠ 0 trditve `konvergira_iff` se da izpolniti (npr. a₁ = 1, q = 1/2).
Trditve: `pot_nic`, `vsota` in `qn_dokaz` (|q| < 1). -/
example : ∃ a₁ q : ℝ, a₁ ≠ 0 ∧ |q| < 1 := ⟨1, 1 / 2, one_ne_zero, by norm_num [abs_of_pos]⟩

/-- Predpostavke trditve `konvergira_iff` se dajo izpolniti: izrek, uporabljen na primeru. -/
example : True :=
  have w : ∃ a₁ q : ℝ, a₁ ≠ 0 ∧ |q| < 1 := ⟨1, 1 / 2, one_ne_zero, by norm_num [abs_of_pos]⟩
  (fun _ => trivial) (konvergira_iff (a₁ := w.choose) (q := w.choose_spec.choose) (ha := w.choose_spec.choose_spec.1))

/-- Predpostavke trditve `vsota` se dajo izpolniti: izrek, uporabljen na primeru. -/
example : True :=
  have w : ∃ a₁ q : ℝ, a₁ ≠ 0 ∧ |q| < 1 := ⟨1, 1 / 2, one_ne_zero, by norm_num [abs_of_pos]⟩
  (fun _ => trivial) (vsota (a₁ := w.choose) (q := w.choose_spec.choose) (hq := w.choose_spec.choose_spec.2))

/-- Predpostavke trditve `pot_nic` se dajo izpolniti: izrek, uporabljen na primeru. -/
example : True :=
  have w : ∃ a₁ q : ℝ, a₁ ≠ 0 ∧ |q| < 1 := ⟨1, 1 / 2, one_ne_zero, by norm_num [abs_of_pos]⟩
  (fun _ => trivial) (pot_nic (q := w.choose_spec.choose) (hq := w.choose_spec.choose_spec.2))

/-- Kdaj vrsta divergira: q = 1: 5 + 5 + … ima Sₙ = 5n; q > 1: 1 + 2 + 4 + … ima Sₙ = 2ⁿ − 1 ≥ n;
q = −1: 1 − 1 + 1 − … ima delne vsote 1, 0, 1, 0.
trditev: MAT-SS-4/geometrijska-vrsta#divergenca-primeri
besedilo: »$q = 1$: $5 + 5 + 5 + \dots$ ima $S_n = 5n$, kar raste čez vse meje. - $q > 1$: pri $1 + 2 + 4 + 8 + \dots$ delne vsote rastejo še hitreje. - $q = -1$: pri $1 - 1 + 1 - 1 + \dots$ delne vsote skačejo $1, 0, 1, 0, \dots$ in se ne ustalijo.« -/
theorem divergenca_primeri (n : ℕ) :
    S 5 1 n = 5 * n ∧ S 1 2 n = 2 ^ n - 1 ∧ (n : ℝ) ≤ S 1 2 n ∧
    (S 1 (-1) 1 = 1 ∧ S 1 (-1) 2 = 0 ∧ S 1 (-1) 3 = 1 ∧ S 1 (-1) 4 = 0) := by
  have h2 : S 1 2 n = 2 ^ n - 1 := by rw [(S_formula 1 2 (by norm_num) n).1]; norm_num
  refine ⟨by simp [S]; ring, h2, ?_, ?_⟩
  · have : n + 1 ≤ 2 ^ n := Nat.lt_two_pow_self
    have : (n : ℝ) + 1 ≤ 2 ^ n := by exact_mod_cast this
    rw [h2]; linarith
  · refine ⟨?_, ?_, ?_, ?_⟩ <;> norm_num [S, sum_range_succ]

/-- Simulacija: a₁ = 1, q = 0,5 ⇒ vsota 2; q = −0,5 ⇒ vsota 2/3; q = 1,1 ⇒ ne konvergira.
trditev: MAT-SS-4/geometrijska-vrsta#simulacija
besedilo: »Pri $q = 0{,}5$ se od spodaj bližajo vsoti $2$. Pri $q = -0{,}5$ skačejo nad in pod vsoto $\frac{2}{3}$, a vedno bliže. Pri $q = 1{,}1$ rastejo brez meje.« -/
theorem simulacija :
    Tendsto (S 1 0.5) atTop (𝓝 2) ∧ Tendsto (S 1 (-0.5)) atTop (𝓝 (2 / 3)) ∧
    ¬ ∃ L, Tendsto (S 1 1.1) atTop (𝓝 L) := by
  refine ⟨?_, ?_, ?_⟩
  · convert vsota 1 0.5 (by rw [abs_of_pos (by norm_num)]; norm_num) using 2; norm_num
  · convert vsota 1 (-0.5) (by rw [abs_of_neg (by norm_num)]; norm_num) using 2; norm_num
  · rw [konvergira_iff 1 1.1 one_ne_zero, abs_of_pos (by norm_num)]; norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: 6 + 2 + 2/3 + 2/9 + …: q = 2/6 = 1/3 (enako a₃/a₂ in a₄/a₃), |q| < 1,
S = 6/(1 − 1/3) = 6/(2/3) = 9.
trditev: MAT-SS-4/geometrijska-vrsta#primer1
besedilo: »Odgovor: vrsta konvergira, njena vsota je $9$.« -/
theorem primer1 :
    ((2 : ℝ) / 6 = 1 / 3 ∧ (2 / 3 : ℝ) / 2 = 1 / 3 ∧ (2 / 9 : ℝ) / (2 / 3) = 1 / 3) ∧
    |(1 / 3 : ℝ)| < 1 ∧
    (6 : ℝ) / (1 - 1 / 3) = 6 / (2 / 3) ∧ (6 : ℝ) / (2 / 3) = 9 ∧
    Tendsto (S 6 (1 / 3)) atTop (𝓝 9) := by
  have hq : |(1 / 3 : ℝ)| < 1 := by rw [abs_of_pos (by norm_num)]; norm_num
  refine ⟨by norm_num, hq, by norm_num, by norm_num, ?_⟩
  convert vsota 6 (1 / 3) hq using 2; norm_num

/-- Primer 2: 12 − 6 + 3 − 3/2 + …: q = −6/12 = −1/2, S = 12/(1 − (−1/2)) = 12/(3/2) = 8; delne vsote
12, 6, 9, 7,5. Vrsta 12 − 18 + 27 − …: q = −18/12 = −3/2, |q| > 1, divergira; formula bi dala
12/(5/2) = 4,8; delne vsote 12, −6, 21.
trditev: MAT-SS-4/geometrijska-vrsta#primer2
besedilo: »Odgovor: prva vrsta konvergira in ima vsoto $8$; druga divergira in vsote nima.« -/
theorem primer2 :
    (-6 : ℝ) / 12 = -1 / 2 ∧ (1 : ℝ) - (-1 / 2) = 3 / 2 ∧ (12 : ℝ) / (1 - (-1 / 2)) = 12 / (3 / 2) ∧
    (12 : ℝ) / (3 / 2) = 8 ∧ Tendsto (S 12 (-1 / 2)) atTop (𝓝 8) ∧
    (S 12 (-1 / 2) 1 = 12 ∧ S 12 (-1 / 2) 2 = 6 ∧ S 12 (-1 / 2) 3 = 9 ∧ S 12 (-1 / 2) 4 = 7.5) ∧
    (-18 : ℝ) / 12 = -3 / 2 ∧ ¬ (∃ L, Tendsto (S 12 (-3 / 2)) atTop (𝓝 L)) ∧
    (12 : ℝ) / (1 - (-3 / 2)) = 12 / (5 / 2) ∧ (12 : ℝ) / (5 / 2) = 4.8 ∧
    (S 12 (-3 / 2) 1 = 12 ∧ S 12 (-3 / 2) 2 = -6 ∧ S 12 (-3 / 2) 3 = 21) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_, ?_, by norm_num, ?_, by norm_num,
    by norm_num, ?_⟩
  · convert vsota 12 (-1 / 2) (by rw [abs_of_neg (by norm_num)]; norm_num) using 2; norm_num
  · refine ⟨?_, ?_, ?_, ?_⟩ <;> norm_num [S, sum_range_succ]
  · rw [konvergira_iff 12 (-3 / 2) (by norm_num), abs_of_neg (by norm_num)]; norm_num
  · refine ⟨?_, ?_, ?_⟩ <;> norm_num [S, sum_range_succ]

/-- Primer 3: žoga, h₀ = 2, q = 0,6: h₁ = 0,6·2 = 1,2, h₂ = 0,6·1,2 = 0,72; h₁ + h₂ + … =
1,2/(1 − 0,6) = 1,2/0,4 = 3; s = 2 + 2·3 = 8 (pot po n dvigih gre proti 8).
trditev: MAT-SS-4/geometrijska-vrsta#primer3
besedilo: »Celotna pot: $s = 2\,\mathrm{m} + 2 \cdot 3\,\mathrm{m} = 8\,\mathrm{m}$.« -/
theorem primer3 :
    (0.6 : ℝ) * 2 = 1.2 ∧ (0.6 : ℝ) * 1.2 = 0.72 ∧
    (1.2 : ℝ) / (1 - 0.6) = 1.2 / 0.4 ∧ (1.2 : ℝ) / 0.4 = 3 ∧ (2 : ℝ) + 2 * 3 = 8 ∧
    Tendsto (fun n => 2 + 2 * S 1.2 0.6 n) atTop (𝓝 8) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  have := ((vsota 1.2 0.6 (by rw [abs_of_pos (by norm_num)]; norm_num)).const_mul 2).const_add 2
  convert this using 2; norm_num

/-- Primer 4: 0,3̄6̄ = 0,36 + 0,0036 + …: a₁ = 0,36, q = 0,01, S = 0,36/(1 − 0,01) = 0,36/0,99 = 36/99 = 4/11.
trditev: MAT-SS-4/geometrijska-vrsta#primer4
besedilo: »$S = \dfrac{0{,}36}{0{,}99} = \dfrac{36}{99} = \dfrac{4}{11}$« -/
theorem primer4 :
    (0.36 : ℝ) / (1 - 0.01) = 0.36 / 0.99 ∧ (0.36 : ℝ) / 0.99 = 36 / 99 ∧ (36 / 99 : ℝ) = 4 / 11 ∧
    Tendsto (S 0.36 0.01) atTop (𝓝 (4 / 11)) := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  convert vsota 0.36 0.01 (by rw [abs_of_pos (by norm_num)]; norm_num) using 2; norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1 in »Preveri se« 4: 1 + 2 + 4 + … (in 3 + 6 + 12 + …) divergira; formula bi dala
1/(1 − 2) = −1 oziroma 3/(1 − 2) = −3; delne vsote 3, 9, 21 rastejo.
trditev: MAT-SS-4/geometrijska-vrsta#napaka-formula
besedilo: »Vsota pozitivnih števil ne more biti negativna. Formula $S = \frac{a_1}{1-q}$ velja le pri $|q| < 1$.« -/
theorem napaka_formula :
    ¬ (∃ L, Tendsto (S 1 2) atTop (𝓝 L)) ∧ (1 : ℝ) / (1 - 2) = -1 ∧
    ¬ (∃ L, Tendsto (S 3 2) atTop (𝓝 L)) ∧ (3 : ℝ) / (1 - 2) = -3 ∧
    (S 3 2 1 = 3 ∧ S 3 2 2 = 9 ∧ S 3 2 3 = 21) ∧ (6 : ℝ) / 3 = 2 ∧ (12 : ℝ) / 6 = 2 := by
  refine ⟨?_, by norm_num, ?_, by norm_num, ?_, by norm_num, by norm_num⟩
  · rw [konvergira_iff 1 2 one_ne_zero]; norm_num
  · rw [konvergira_iff 3 2 (by norm_num)]; norm_num
  · refine ⟨?_, ?_, ?_⟩ <;> norm_num [S, sum_range_succ]

/-- Pogoste napake 2 in »Z analogijo«: 1/2 + 1/4 + 1/8 + … ima vsoto (1/2)/(1 − 1/2) = 1; delne vsote
1/2, 3/4, 7/8, splošno Sₙ = 1 − (1/2)ⁿ.
trditev: MAT-SS-4/geometrijska-vrsta#napaka-polovice
besedilo: »Vrsta $\frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \dots$ ima vsoto $1$.« -/
theorem napaka_polovice :
    Tendsto (S (1 / 2) (1 / 2)) atTop (𝓝 1) ∧ ((1 / 2 : ℝ) / (1 - 1 / 2) = 1) ∧
    (S (1 / 2) (1 / 2) 1 = 1 / 2 ∧ S (1 / 2) (1 / 2) 2 = 3 / 4 ∧ S (1 / 2) (1 / 2) 3 = 7 / 8) ∧
    ∀ n, S (1 / 2) (1 / 2) n = 1 - (1 / 2) ^ n := by
  refine ⟨?_, by norm_num, ?_, fun n => ?_⟩
  · convert vsota (1 / 2) (1 / 2) (by rw [abs_of_pos (by norm_num)]; norm_num) using 2; norm_num
  · refine ⟨?_, ?_, ?_⟩ <;> norm_num [S, sum_range_succ]
  · induction n with
    | zero => simp [S]
    | succ n ih => rw [S_succ, ih, pow_succ]; ring

/-- Pogoste napake 3–5: 12/(1/2) = 24 (napačen 1 − q); obrnjen količnik 6/2 = 3; žoga brez dvojnega
odseka 2/(1 − 0,6) = 5.
trditev: MAT-SS-4/geometrijska-vrsta#napaka-racuni
besedilo: »Kdor to zamenja, dobi v primeru 2 vsoto $24$ namesto $8$. Negativen $q$ vstavi v oklepaju. - **Obrnjen količnik.** $q = \frac{a_1}{a_2}$ namesto $\frac{a_2}{a_1}$. Pri vrsti $6 + 2 + \dots$ bi dobil $q = 3$ in zmotno sklepal, da vrsta divergira. Količnik je vedno »naslednji deljeno s prejšnjim«. - **Pozabljen dvojni odsek.** Pri žogi nekateri seštejejo $2 + 1{,}2 + 0{,}72 + \dots = \frac{2}{1 - 0{,}6} = 5\,\mathrm{m}$.« -/
theorem napaka_racuni : (12 : ℝ) / (1 / 2) = 24 ∧ (6 : ℝ) / 2 = 3 ∧ (2 : ℝ) / (1 - 0.6) = 5 := by
  norm_num

/-! ## Drugače: Bolj natančno -/

/-- Bolj natančno: Sₙ − qSₙ = a₁ − a₁qⁿ.
trditev: MAT-SS-4/geometrijska-vrsta#odstej
besedilo: »$S_n - q S_n = a_1 - a_1 q^n$« -/
theorem odstej (a₁ q : ℝ) (n : ℕ) : S a₁ q n - q * S a₁ q n = a₁ - a₁ * q ^ n := by
  induction n with
  | zero => simp [S]
  | succ n ih => rw [S_succ, pow_succ]; linear_combination ih

/-- Bolj natančno: xₙ = |q|ⁿ je padajoče in navzdol omejeno z 0; če je limita L, velja L = |q|L, in
ker |q| ≠ 1, je L = 0.
trditev: MAT-SS-4/geometrijska-vrsta#qn-dokaz
besedilo: »Zaporedje $x_n = |q|^n$ je padajoče ($x_{n+1} = |q|\,x_n \le x_n$) in navzdol omejeno z $0$. Monotono in omejeno zaporedje je konvergentno, recimo z limito $L$. Iz $x_{n+1} = |q|\,x_n$ v limiti dobimo $L = |q|\,L$. Ker je $|q| \ne 1$, je $L = 0$.« -/
theorem qn_dokaz (q : ℝ) (hq : |q| < 1) :
    Antitone (fun n : ℕ => |q| ^ n) ∧ (∀ n : ℕ, 0 ≤ |q| ^ n) ∧
    ∀ L, Tendsto (fun n : ℕ => |q| ^ n) atTop (𝓝 L) → L = |q| * L ∧ L = 0 := by
  refine ⟨fun m n hmn => pow_le_pow_of_le_one (abs_nonneg q) hq.le hmn, fun n => by positivity,
    fun L hL => ?_⟩
  have t1 : Tendsto (fun n : ℕ => |q| ^ (n + 1)) atTop (𝓝 L) := (tendsto_add_atTop_iff_nat 1).2 hL
  have t2 : Tendsto (fun n : ℕ => |q| ^ (n + 1)) atTop (𝓝 (|q| * L)) := by
    simpa [pow_succ, mul_comm] using hL.const_mul |q|
  have e := tendsto_nhds_unique t1 t2
  refine ⟨e, ?_⟩
  have : (1 - |q|) * L = 0 := by linarith
  rcases mul_eq_zero.mp this with h | h
  · linarith
  · exact h

/-- Predpostavke trditve `qn_dokaz` se dajo izpolniti: izrek, uporabljen na primeru. -/
example : True :=
  have w : ∃ a₁ q : ℝ, a₁ ≠ 0 ∧ |q| < 1 := ⟨1, 1 / 2, one_ne_zero, by norm_num [abs_of_pos]⟩
  (fun _ => trivial) (qn_dokaz (q := w.choose_spec.choose) (hq := w.choose_spec.choose_spec.2))

/-- Bolj natančno: napaka delne vsote S − Sₙ = a₁qⁿ/(1 − q) (q ≠ 1); pri Ahilu po petih odsekih
100·0,1⁵/0,9 ≈ 0,0011 m.
trditev: MAT-SS-4/geometrijska-vrsta#napaka-delne
besedilo: »Napaka delne vsote je $S - S_n = \frac{a_1 q^n}{1 - q}$. Pri Ahilu po petih odsekih: $\frac{100 \cdot 0{,}1^5}{0{,}9} \approx 0{,}0011\,\mathrm{m}$, kar je približno milimeter.« -/
theorem napaka_delne (a₁ q : ℝ) (hq : q ≠ 1) (n : ℕ) :
    a₁ / (1 - q) - S a₁ q n = a₁ * q ^ n / (1 - q) ∧
    (0.00105 ≤ (100 : ℝ) * 0.1 ^ 5 / 0.9 ∧ (100 : ℝ) * 0.1 ^ 5 / 0.9 < 0.00115) := by
  refine ⟨?_, by norm_num⟩
  rw [(S_formula a₁ q hq n).1, (S_formula a₁ q hq n).2]
  have : 1 - q ≠ 0 := sub_ne_zero.mpr (Ne.symm hq)
  field_simp; ring

/-- Predpostavke trditve `napaka_delne` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 / 2 : ℝ) ≠ 1 ∧ |(1 / 2 : ℝ)| < 1 ∧ 1 ≤ (1:ℕ) := by norm_num [abs_of_pos]
  napaka_delne (hq := w.1)

/-- Bolj natančno (iz `napaka_delne`): pri −1 < q < 0 in a₁ ≠ 0 delne vsote skačejo okoli vsote: napaki
S − Sₙ = a₁qⁿ/(1 − q) in S − Sₙ₊₁ imata vedno nasprotna predznaka.
trditev: MAT-SS-4/geometrijska-vrsta#skace-okoli
besedilo: »Pri negativnem $q$ delne vsote skačejo okoli vsote.« -/
theorem skace_okoli (a₁ q : ℝ) (ha : a₁ ≠ 0) (hq1 : -1 < q) (hq : q < 0) (n : ℕ) :
    (a₁ / (1 - q) - S a₁ q n) * (a₁ / (1 - q) - S a₁ q (n + 1)) < 0 := by
  have h1 : q ≠ 1 := by intro h; linarith
  rw [(napaka_delne a₁ q h1 n).1, (napaka_delne a₁ q h1 (n + 1)).1]
  have hx : a₁ * q ^ n / (1 - q) ≠ 0 :=
    div_ne_zero (mul_ne_zero ha (pow_ne_zero _ hq.ne)) (by intro h; linarith)
  have e : a₁ * q ^ n / (1 - q) * (a₁ * q ^ (n + 1) / (1 - q)) = q * (a₁ * q ^ n / (1 - q)) ^ 2 := by
    rw [pow_succ]; ring
  rw [e]
  exact mul_neg_of_neg_of_pos hq (by positivity)

/-- Predpostavke trditve `skace_okoli` se dajo izpolniti (a₁ = 12, q = −1/2 kot v Primeru 2). -/
example : (12 : ℝ) ≠ 0 ∧ (-1 : ℝ) < -1 / 2 ∧ (-1 / 2 : ℝ) < 0 := by norm_num

/-- Predpostavke trditve `skace_okoli` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (12 : ℝ) ≠ 0 ∧ (-1 : ℝ) < -1 / 2 ∧ (-1 / 2 : ℝ) < 0 := by norm_num
  skace_okoli (ha := w.1) (hq1 := w.2.1) (hq := w.2.2)

/-- Bolj natančno, trivialni primer: pri a₁ = 0 je vsota 0 za vsak q.
trditev: MAT-SS-4/geometrijska-vrsta#trivialni
besedilo: »Če je $a_1 = 0$, so vsi členi $0$ in vsota je $0$ za vsak $q$.« -/
theorem trivialni (q : ℝ) : Tendsto (S 0 q) atTop (𝓝 0) := by
  have : S 0 q = fun _ => 0 := by funext n; simp [S]
  rw [this]; exact tendsto_const_nhds

/-! ## Za maturo -/

/-- Naloga 1: 1,27̄ = 1,2 + 0,07 + 0,007 + …; 0,07/(1 − 0,1) = 0,07/0,9 = 7/90;
1,2 + 7/90 = 108/90 + 7/90 = 115/90 = 23/18.
trditev: MAT-SS-4/geometrijska-vrsta#matura1
besedilo: »Odgovor: $1{,}2\overline{7} = \dfrac{23}{18}$.« -/
theorem matura1 :
    (0.07 : ℝ) / (1 - 0.1) = 0.07 / 0.9 ∧ (0.07 : ℝ) / 0.9 = 7 / 90 ∧
    (1.2 : ℝ) + 7 / 90 = 108 / 90 + 7 / 90 ∧ (108 / 90 + 7 / 90 : ℝ) = 115 / 90 ∧
    (115 / 90 : ℝ) = 23 / 18 ∧ Tendsto (fun n => 1.2 + S 0.07 0.1 n) atTop (𝓝 (23 / 18)) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  convert (vsota 0.07 0.1 (by rw [abs_of_pos (by norm_num)]; norm_num)).const_add 1.2 using 2
  norm_num

/-- Naloga 2 a): vrsta 3 + 3(x − 2) + 3(x − 2)² + … konvergira natanko za 1 < x < 3 (tudi pri x = 2,
kjer so vse delne vsote 3); RAČUN: |x − 2| < 1 ⇔ x ∈ (1, 3).
trditev: MAT-SS-4/geometrijska-vrsta#matura2a
besedilo: »a) Vrsta konvergira za $1 < x < 3$, to je za $x \in (1, 3)$, vključno z $x = 2$.« -/
theorem matura2a (x : ℝ) :
    ((∃ L, Tendsto (S 3 (x - 2)) atTop (𝓝 L)) ↔ x ∈ Set.Ioo 1 3) ∧
    (|x - 2| < 1 ↔ x ∈ Set.Ioo 1 3) ∧ (∀ n, 1 ≤ n → S 3 (2 - 2) n = 3) := by
  have h : |x - 2| < 1 ↔ x ∈ Set.Ioo 1 3 := by
    rw [abs_sub_lt_iff, Set.mem_Ioo]; constructor <;> intro h <;> constructor <;> linarith [h.1, h.2]
  refine ⟨by rw [konvergira_iff 3 _ (by norm_num), h], h, fun n hn => ?_⟩
  obtain ⟨k, rfl⟩ := Nat.exists_eq_add_of_le' hn
  simp only [S, sub_self]
  rw [sum_range_succ']
  simp

/-- Naloga 2 b): pri x = 3/2 je q = −1/2, S = 3/(1 − (−1/2)) = 3/(3/2) = 2.
trditev: MAT-SS-4/geometrijska-vrsta#matura2b
besedilo: »b) Pri $x = \dfrac{3}{2}$ je $q = -\dfrac{1}{2}$ in $|q| < 1$, zato je $S = \dfrac{3}{1 - \left(-\frac{1}{2}\right)} = \dfrac{3}{\frac{3}{2}} = 2$.« -/
theorem matura2b :
    (3 / 2 : ℝ) - 2 = -1 / 2 ∧ (3 : ℝ) / (1 - (-1 / 2)) = 3 / (3 / 2) ∧ (3 : ℝ) / (3 / 2) = 2 ∧
    Tendsto (S 3 (3 / 2 - 2)) atTop (𝓝 2) := by
  refine ⟨by norm_num, by norm_num, by norm_num, ?_⟩
  convert vsota 3 (3 / 2 - 2) (by norm_num [abs_of_neg]) using 2; norm_num

/-- Naloga 2 c): za x ∈ (1, 3) je vsota 3/(1 − (x − 2)) = 3/(3 − x) (pri x = 2 je 3/(3 − 2) = 3);
3/(3 − x) = 4 ⇔ 3 − x = 3/4 ⇔ x = 9/4; 9/4 ∈ (1, 3), q = 1/4, 3/(1 − 1/4) = 4.
trditev: MAT-SS-4/geometrijska-vrsta#matura2c
besedilo: »c) Za $x \in (1, 3)$ je vsota $S = \dfrac{3}{1 - (x - 2)} = \dfrac{3}{3 - x}$ (tudi pri $x = 2$, kjer je $S = 3$). Iz enačbe $\dfrac{3}{3 - x} = 4$ sledi $3 - x = \dfrac{3}{4}$ in $x = \dfrac{9}{4}$.« -/
theorem matura2c (x : ℝ) (hx : x ∈ Set.Ioo 1 3) :
    Tendsto (S 3 (x - 2)) atTop (𝓝 (3 / (3 - x))) ∧ (3 : ℝ) / (1 - (x - 2)) = 3 / (3 - x) ∧
    (3 : ℝ) / (3 - 2) = 3 ∧
    (3 / (3 - x) = 4 ↔ 3 - x = 3 / 4) ∧ (3 - x = 3 / 4 ↔ x = 9 / 4) ∧
    (9 / 4 : ℝ) ∈ Set.Ioo 1 3 ∧ (9 / 4 : ℝ) - 2 = 1 / 4 ∧ (3 : ℝ) / (1 - 1 / 4) = 4 := by
  have h3 : 3 - x ≠ 0 := by linarith [hx.2]
  have hq : |x - 2| < 1 := by rw [abs_sub_lt_iff]; constructor <;> linarith [hx.1, hx.2]
  refine ⟨?_, by ring_nf, by norm_num, ⟨fun h => ?_, fun h => ?_⟩, ⟨fun h => by linarith,
    fun h => by linarith⟩, by norm_num, by norm_num, by norm_num⟩
  · convert vsota 3 (x - 2) hq using 2; ring_nf
  · rw [div_eq_iff h3] at h; linarith
  · rw [h]; norm_num

/-- Predpostavka trditve `matura2c` se da izpolniti (x = 2). -/
example : (2:ℝ) ∈ Set.Ioo 1 3 := by norm_num

/-- Predpostavke trditve `matura2c` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2:ℝ) ∈ Set.Ioo 1 3 := by norm_num
  matura2c (hx := w)

/-- Naloga 2 c), RAČUN: 3/(3 − x) = 4 ⇔ x = 9/4 (za x ≠ 3).
trditev: MAT-SS-4/geometrijska-vrsta#matura2c-resi
besedilo: »Iz enačbe $\dfrac{3}{3 - x} = 4$ sledi $3 - x = \dfrac{3}{4}$ in $x = \dfrac{9}{4}$.« -/
theorem matura2c_resi (x : ℝ) (hx : x ≠ 3) : 3 / (3 - x) = 4 ↔ x = 9 / 4 := by
  have h3 : 3 - x ≠ 0 := sub_ne_zero.mpr (Ne.symm hx)
  rw [div_eq_iff h3]; constructor <;> intro h <;> linarith

/-- Predpostavka trditve `matura2c_resi` se da izpolniti (x = 0). -/
example : (0:ℝ) ≠ 3 := by norm_num

/-- Predpostavke trditve `matura2c_resi` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) ≠ 3 := by norm_num
  matura2c_resi (hx := w)

/-- Naloga 2 d): 3/(3 − x) = 1 ⇔ x = 0 (x ≠ 3), 0 ∉ (1, 3), pri x = 0 je q = −2 in vrsta divergira;
za 1 < x < 3 je 3/(3 − x) > 3/2. Torej ni x, za katerega bi vrsta konvergirala z vsoto 1.
trditev: MAT-SS-4/geometrijska-vrsta#matura2d
besedilo: »d) Enačba $\dfrac{3}{3 - x} = 1$ ima edino rešitev $x = 0$. Ta ne leži na intervalu $(1, 3)$: pri $x = 0$ je $q = -2$, vrsta divergira in vsote nima.« -/
theorem matura2d :
    (∀ x : ℝ, x ≠ 3 → (3 / (3 - x) = 1 ↔ x = 0)) ∧ (0 : ℝ) ∉ Set.Ioo 1 3 ∧
    ¬ (∃ L, Tendsto (S 3 (0 - 2)) atTop (𝓝 L)) ∧
    (∀ x ∈ Set.Ioo (1 : ℝ) 3, 3 / 2 < 3 / (3 - x)) ∧
    ¬ ∃ x : ℝ, Tendsto (S 3 (x - 2)) atTop (𝓝 1) := by
  refine ⟨fun x hx => ?_, by norm_num, ?_, fun x hx => ?_, ?_⟩
  · have h3 : 3 - x ≠ 0 := sub_ne_zero.mpr (Ne.symm hx)
    rw [div_eq_iff h3]; constructor <;> intro h <;> linarith
  · rw [konvergira_iff 3 _ (by norm_num)]; norm_num
  · rw [div_lt_div_iff₀ (by norm_num) (by linarith [hx.2])]; linarith [hx.1]
  · rintro ⟨x, hx⟩
    have hI := ((matura2a x).1).mp ⟨1, hx⟩
    have := tendsto_nhds_unique hx (matura2c x hI).1
    have h3 : 3 - x ≠ 0 := by linarith [hI.2]
    rw [eq_div_iff h3] at this
    linarith [hI.1]

/-- Ustno vprašanje 2: za q ≠ 1 je Sₙ = a₁(1 − qⁿ)/(1 − q), pri |q| < 1 pa Sₙ → a₁/(1 − q)
(trditvi `S_formula`, `vsota`). Ustno vprašanje 3: 1 − 2 + 4 − 8 + … ima delne vsote 1, −1, 3, −5,
divergira; formula bi dala 1/(1 − (−2)) = 1/3.
trditev: MAT-SS-4/geometrijska-vrsta#ustno3
besedilo: »Primer je vrsta $1 - 2 + 4 - 8 + \ldots$ s količnikom $q = -2$. Njene delne vsote so $1, -1, 3, -5, \ldots$ in skačejo vse dlje gor in dol. Zaporedje delnih vsot zato nima limite in vrsta divergira. Formula $\dfrac{a_1}{1 - q}$ bi dala $\dfrac{1}{3}$« -/
theorem ustno3 :
    (S 1 (-2) 1 = 1 ∧ S 1 (-2) 2 = -1 ∧ S 1 (-2) 3 = 3 ∧ S 1 (-2) 4 = -5) ∧
    (1 - 2 + 4 - 8 : ℝ) = -5 ∧
    ¬ (∃ L, Tendsto (S 1 (-2)) atTop (𝓝 L)) ∧ (1 : ℝ) / (1 - (-2)) = 1 / 3 := by
  refine ⟨?_, by norm_num, ?_, by norm_num⟩
  · refine ⟨?_, ?_, ?_, ?_⟩ <;> norm_num [S, sum_range_succ]
  · rw [konvergira_iff 1 _ one_ne_zero]; norm_num

/-! ## Preveri se -/

/-- Preveri se 1: 9 + 3 + 1 + … ima vsoto 9/(1 − 1/3) = 13,5; 10 − 5 + 2,5 − … ima vsoto 20/3;
0,5 + 0,05 + … ima vsoto 5/9; 1 − 1 + 1 − … (q = −1) divergira.
trditev: MAT-SS-4/geometrijska-vrsta#kviz1
besedilo: »Tu je $q = \frac{1}{3}$, torej $|q| < 1$. Vrsta konvergira, vsota je $\frac{9}{1 - 1/3} = 13{,}5$.« -/
theorem kviz1 :
    Tendsto (S 9 (1 / 3)) atTop (𝓝 13.5) ∧ Tendsto (S 10 (-1 / 2)) atTop (𝓝 (20 / 3)) ∧
    Tendsto (S 0.5 0.1) atTop (𝓝 (5 / 9)) ∧ ¬ (∃ L, Tendsto (S 1 (-1)) atTop (𝓝 L)) ∧
    (9 : ℝ) / (1 - 1 / 3) = 13.5 ∧ (0.5 : ℝ) / 0.9 = 5 / 9 := by
  refine ⟨?_, ?_, ?_, ?_, by norm_num, by norm_num⟩
  · convert vsota 9 (1 / 3) (by rw [abs_of_pos (by norm_num)]; norm_num) using 2; norm_num
  · convert vsota 10 (-1 / 2) (by rw [abs_of_neg (by norm_num)]; norm_num) using 2; norm_num
  · convert vsota 0.5 0.1 (by rw [abs_of_pos (by norm_num)]; norm_num) using 2; norm_num
  · rw [konvergira_iff 1 _ one_ne_zero]; norm_num

/-- Preveri se 2: 1 + 1 + 1 + … (pozitivni členi) divergira.
trditev: MAT-SS-4/geometrijska-vrsta#kviz2
besedilo: »Pozitivni členi ne zadoščajo ($1 + 1 + 1 + \dots$ divergira),« -/
theorem kviz2 : ¬ (∃ L, Tendsto (S 1 1) atTop (𝓝 L)) := by
  rw [konvergira_iff 1 _ one_ne_zero]; norm_num

/-- Preveri se 3: 20 + 15 + 11,25 + …: q = 15/20 = 0,75, S = 20/(1 − 0,75) = 20/0,25 = 80;
napačni odgovori: 20 + 15 + 11,25 = 46,25 in 20/(1 + 0,75) ≈ 11,4.
trditev: MAT-SS-4/geometrijska-vrsta#kviz3
besedilo: »$q = \frac{15}{20} = 0{,}75$, $S = \frac{20}{1 - 0{,}75} = \frac{20}{0{,}25} = 80$.« -/
theorem kviz3 :
    (15 : ℝ) / 20 = 0.75 ∧ (11.25 : ℝ) / 15 = 0.75 ∧ (20 : ℝ) / (1 - 0.75) = 20 / 0.25 ∧
    (20 : ℝ) / 0.25 = 80 ∧ Tendsto (S 20 0.75) atTop (𝓝 80) ∧ (20 + 15 + 11.25 : ℝ) = 46.25 ∧
    (11.35 ≤ (20 : ℝ) / (1 + 0.75) ∧ (20 : ℝ) / (1 + 0.75) < 11.45) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_, by norm_num, by norm_num⟩
  convert vsota 20 0.75 (by rw [abs_of_pos (by norm_num)]; norm_num) using 2; norm_num

/-- Preveri se 5: žogica z 1 m, q = 0,5: dvigi 0,5/(1 − 0,5) = 1, s = 1 + 2·1 = 3; napačni odgovori
1/(1 − 0,5) = 2 in 2·2 = 4.
trditev: MAT-SS-4/geometrijska-vrsta#kviz5
besedilo: »Prvi padec $1\,\mathrm{m}$, dvigi $0{,}5 + 0{,}25 + \dots = \frac{0{,}5}{1 - 0{,}5} = 1\,\mathrm{m}$, ki jih žogica prepotuje dvakrat: $s = 1\,\mathrm{m} + 2 \cdot 1\,\mathrm{m} = 3\,\mathrm{m}$.« -/
theorem kviz5 :
    (0.5 : ℝ) / (1 - 0.5) = 1 ∧ (1 : ℝ) + 2 * 1 = 3 ∧ Tendsto (fun n => 1 + 2 * S 0.5 0.5 n) atTop (𝓝 3) ∧
    (1 : ℝ) / (1 - 0.5) = 2 ∧ (2 : ℝ) * 2 = 4 := by
  refine ⟨by norm_num, by norm_num, ?_, by norm_num, by norm_num⟩
  have := ((vsota 0.5 0.5 (by rw [abs_of_pos (by norm_num)]; norm_num)).const_mul 2).const_add 1
  convert this using 2; norm_num

/-- RAČUN: 0,07/(1 − 0,1) = 7/90, 6/5 + 7/90 = 23/18, 115/90 = 23/18, 3/(1 − (−1/2)) = 2, 3/(3 − 2) = 3,
3/(1 − 1/4) = 4, 1 − 2 + 4 − 8 = −5, 1/(1 − (−2)) = 1/3; 3/(1 − (x − 2)) = 3/(3 − x).
pomozno -/
theorem racun :
    (0.07 : ℝ) / (1 - 0.1) = 7 / 90 ∧ (6 / 5 + 7 / 90 : ℝ) = 23 / 18 ∧ (115 / 90 : ℝ) = 23 / 18 ∧
    (3 : ℝ) / (1 - (-1 / 2)) = 2 ∧ (3 : ℝ) / (3 - 2) = 3 ∧ (3 : ℝ) / (1 - 1 / 4) = 4 ∧
    (1 - 2 + 4 - 8 : ℝ) = -5 ∧ (1 : ℝ) / (1 - (-2)) = 1 / 3 ∧
    ∀ x : ℝ, (3 : ℝ) / (1 - (x - 2)) = 3 / (3 - x) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num, fun x => by ring_nf⟩

end Evklid.Lekcije.MAT_SS_4.GeometrijskaVrsta
