/-
vir: content/lessons/MAT-SS-4/anuitete-in-amortizacijski-nacrt.md
sha256: e3d2055a8396077b68ed43bc94459315a445ae60abb57e02e8e853dd7214c335
Ni v Leanu: besedne razlage in utemeljitve (premisli, ustno vprašanje 1, »Kot zgodba« razen števil,
točkovanje); simulacija »Obrestno obrestovanje skozi leta«; odčitavanje s stolpčnega prikaza (dokazane so
le vrednosti stolpcev in obresti); pravilo »zadnjo vrstico popravimo za cent ali dva« (navodilo za
zaokroževanje, ne trditev); primerjava z enakimi razdolžninami je dokazana le kot račun 4000/4 + 200 = 1200.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.AnuiteteInAmortizacijskiNacrt

open Finset

/-! ## Razlaga 1: poskus z ugibanjem (4000 €, 5 %, 4 leta) -/

/-- Razlaga 1: pri obroku 1100 € je D₁ = 4000·1,05 − 1100 = 3100 in D₂ = 3100·1,05 − 1100 = 2155.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#ugibanje-d1-d2
besedilo: »$$D_2 = 3100 \cdot 1{,}05 - 1100 = 2155$$« -/
theorem ugibanje_D1_D2 : (4000 : ℝ) * 1.05 - 1100 = 3100 ∧ (3100 : ℝ) * 1.05 - 1100 = 2155 := by
  norm_num

/-- Razlaga 1, tabela: dolg po 4 letih ((((4000·1,05 − a)·1,05 − a)·1,05 − a)·1,05 − a) je pri
a = 1000 natanko 551,90, pri a = 1100 ≈ 120,89, pri a = 1150 ≈ −94,62 (preplačilo).
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#ugibanje-tabela
besedilo: »$120{,}89 + 94{,}62 = 215{,}51$« -/
theorem ugibanje_tabela :
    (((4000 * (1.05 : ℝ) - 1000) * 1.05 - 1000) * 1.05 - 1000) * 1.05 - 1000 = 551.90 ∧
    |(((4000 * (1.05 : ℝ) - 1100) * 1.05 - 1100) * 1.05 - 1100) * 1.05 - 1100 - 120.89| < 0.005 ∧
    |(((4000 * (1.05 : ℝ) - 1150) * 1.05 - 1150) * 1.05 - 1150) * 1.05 - 1150 - (-94.62)| < 0.005 := by
  norm_num [abs_lt]

/-- Razlaga 1, premisli: ostanek pade za 120,89 + 94,62 = 215,51; obrok ≈ 1100 + 50·120,89/215,51 ≈ 1100 + 28 = 1128.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#ugibanje-ocena
besedilo: »Bližje $1100$ €. Ko obrok povečamo za $50$ €, ostanek pade za $120{,}89 + 94{,}62 = 215{,}51$ €. Do ničle manjka $120{,}89$ €, kar je dobra polovica od $215{,}51$, zato je obrok približno $1100 + 28 = 1128$ €.« -/
theorem ugibanje_ocena : (120.89 : ℝ) + 94.62 = 215.51 ∧ |50 * (120.89 : ℝ) / 215.51 - 28| < 0.1 ∧
    (120.89 : ℝ) / 215.51 > 1 / 2 ∧ (1100 : ℝ) + 28 = 1128 := by norm_num [abs_lt]

/-! ## Razlaga 2: vzorec -/

/-- Razlaga 2: D₂ = (G₀r − a)r − a = G₀r² − ar − a in D₃ = (G₀r² − ar − a)r − a = G₀r³ − ar² − ar − a.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#vzorec-d2-d3
besedilo: »$$D_3 = (G_0 r^2 - a r - a)\,r - a = G_0 r^3 - a r^2 - a r - a$$« -/
theorem vzorec_D2_D3 (G₀ r a : ℝ) : (G₀ * r - a) * r - a = G₀ * r ^ 2 - a * r - a ∧
    (G₀ * r ^ 2 - a * r - a) * r - a = G₀ * r ^ 3 - a * r ^ 2 - a * r - a := by
  constructor <;> ring

/-- Razlaga 2: če je D₀ = G₀ in Dₖ₊₁ = Dₖ·r − a, je Dₙ = G₀rⁿ − a(rⁿ⁻¹ + … + r + 1).
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#dolg-vsota
besedilo: »$D_n = G_0 r^n - a\,(r^{n-1} + \dots + r + 1)$« -/
theorem dolg_vsota (D : ℕ → ℝ) (G₀ r a : ℝ) (h0 : D 0 = G₀) (h : ∀ k, D (k + 1) = D k * r - a)
    (n : ℕ) : D n = G₀ * r ^ n - a * ∑ i ∈ range n, r ^ i := by
  induction n with
  | zero => simp [h0]
  | succ k ih => rw [h k, ih, geom_sum_succ]; ring

/-- Predpostavke trditev `dolg_vsota` in `dolg` se dajo izpolniti (Dₖ = G₀rᵏ − a·Σ, G₀ = 4000, r = 1,05). -/
example : ∃ D : ℕ → ℝ, D 0 = 4000 ∧ ∀ k, D (k + 1) = D k * 1.05 - 1128 :=
  ⟨fun k => 4000 * 1.05 ^ k - 1128 * ∑ i ∈ range k, (1.05 : ℝ) ^ i, by simp,
    fun k => by simp only [geom_sum_succ, pow_succ]; ring⟩

/-- Predpostavke trditve `dolg_vsota` se dajo izpolniti: izrek, uporabljen na primeru. -/
example : True :=
  have w : ∃ D : ℕ → ℝ, D 0 = 4000 ∧ ∀ k, D (k + 1) = D k * 1.05 - 1128 :=
    ⟨fun k => 4000 * 1.05 ^ k - 1128 * ∑ i ∈ range k, (1.05 : ℝ) ^ i, by simp,
      fun k => by simp only [geom_sum_succ, pow_succ]; ring⟩
  (fun _ => trivial) (dolg_vsota (D := w.choose) (h0 := w.choose_spec.1) (h := w.choose_spec.2))

/-- Razlaga 2 (in Povzetek, Primer 4): Dₙ = G₀rⁿ − a(rⁿ − 1)/(r − 1) za r ≠ 1.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#dolg
besedilo: »$$D_n = G_0 r^n - a \cdot \frac{r^n - 1}{r - 1}$$« -/
theorem dolg (D : ℕ → ℝ) (G₀ r a : ℝ) (hr : r ≠ 1) (h0 : D 0 = G₀) (h : ∀ k, D (k + 1) = D k * r - a)
    (n : ℕ) : D n = G₀ * r ^ n - a * ((r ^ n - 1) / (r - 1)) := by
  rw [dolg_vsota D G₀ r a h0 h n, geom_sum_eq hr]

/-- Predpostavka r ≠ 1 v trditvi `dolg` se da izpolniti (r = 1,05). -/
example : (1.05 : ℝ) ≠ 1 := by norm_num

/-! ## Razlaga 3–4: načelo ekvivalence glavnic in anuiteta -/

/-- Razlaga 3: preračun naprej in nazaj sta si inverzna: (G·rᵏ)/rᵏ = G za r ≠ 0.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#naprej-nazaj
besedilo: »Za $k$ let naprej v času preračunamo z množenjem z $r^k$, za $k$ let nazaj z deljenjem z $r^k$.« -/
theorem naprej_nazaj (G r : ℝ) (k : ℕ) (hr : r ≠ 0) : G * r ^ k / r ^ k = G := by
  field_simp

/-- Predpostavka trditve `naprej_nazaj` se da izpolniti. -/
example : (1.05 : ℝ) ≠ 0 := by norm_num

/-- Predpostavke trditve `naprej_nazaj` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1.05 : ℝ) ≠ 0 := by norm_num
  naprej_nazaj (hr := w)

/-- Razlaga 3–4: pri r > 1 in n ≥ 1 je posojilo odplačano (G₀rⁿ − a(rⁿ − 1)/(r − 1) = 0) natanko tedaj,
ko je G₀rⁿ = a(rⁿ − 1)/(r − 1) (enačba), in natanko tedaj, ko je a = G₀·rⁿ(r − 1)/(rⁿ − 1).
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#anuiteta
besedilo: »$$G_0 \cdot r^n = a \cdot \frac{r^n - 1}{r - 1} \qquad \text{(enačba)}$$« -/
theorem anuiteta (G₀ r a : ℝ) (n : ℕ) (hr : 1 < r) (hn : n ≠ 0) :
    (G₀ * r ^ n - a * ((r ^ n - 1) / (r - 1)) = 0 ↔ G₀ * r ^ n = a * ((r ^ n - 1) / (r - 1))) ∧
    (G₀ * r ^ n = a * ((r ^ n - 1) / (r - 1)) ↔ a = G₀ * (r ^ n * (r - 1) / (r ^ n - 1))) := by
  have h1 : r - 1 ≠ 0 := by linarith
  have h2 : r ^ n - 1 ≠ 0 := by have := one_lt_pow₀ hr hn; linarith
  refine ⟨sub_eq_zero, ?_⟩
  constructor
  · intro h; field_simp at h ⊢; linarith
  · intro h; rw [h]; field_simp

/-- Predpostavke trditve `anuiteta` se dajo izpolniti (r = 1,05, n = 4). -/
example : (1 : ℝ) < 1.05 ∧ (4 : ℕ) ≠ 0 := by norm_num

/-- Predpostavke trditve `anuiteta` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ) < 1.05 ∧ (4 : ℕ) ≠ 0 := by norm_num
  anuiteta (hr := w.1) (hn := w.2)

/-- Razlaga 3 in Primer 3: enačba na dan najema: G₀rⁿ = a(rⁿ − 1)/(r − 1) ⟺ G₀ = a(rⁿ − 1)/(rⁿ(r − 1)).
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#dan-najema
besedilo: »Ekvivalenca glavnic na dan najema: $G_0 = a \cdot \dfrac{r^n - 1}{r^n (r - 1)}$« -/
theorem dan_najema (G₀ r a : ℝ) (n : ℕ) (hr : 1 < r) :
    G₀ * r ^ n = a * ((r ^ n - 1) / (r - 1)) ↔ G₀ = a * ((r ^ n - 1) / (r ^ n * (r - 1))) := by
  have h1 : r - 1 ≠ 0 := by linarith
  have h3 : r ^ n ≠ 0 := pow_ne_zero n (by linarith)
  constructor
  · intro h; field_simp at h ⊢; linarith
  · intro h; rw [h]; field_simp

/-- Predpostavka trditve `dan_najema` se da izpolniti (r = 1,06). -/
example : (1 : ℝ) < 1.06 := by norm_num

/-- Predpostavke trditve `dan_najema` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ) < 1.06 := by norm_num
  dan_najema (hr := w)

/-- Razlaga 3: vsak obrok delimo z r tolikokrat, kolikor let je oddaljen od najema:
a/r + a/r² + … + a/rⁿ = a(rⁿ − 1)/(rⁿ(r − 1)), kar je G₀ iz trditve `dan_najema`.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#vsota-nazaj
besedilo: »Isto enačbo lahko preračunamo na dan najema: vsak obrok delimo z $r$ tolikokrat, kolikor let je oddaljen od najema, in vsota je $G_0$.« -/
theorem vsota_nazaj (r a : ℝ) (hr : 1 < r) (n : ℕ) :
    ∑ i ∈ range n, a / r ^ (i + 1) = a * ((r ^ n - 1) / (r ^ n * (r - 1))) := by
  have h1 : r - 1 ≠ 0 := by linarith
  have h0 : r ≠ 0 := by linarith
  induction n with
  | zero => simp
  | succ k ih =>
    rw [sum_range_succ, ih]
    field_simp
    ring

/-- Predpostavka trditve `vsota_nazaj` se da izpolniti. -/
example : (1 : ℝ) < 1.1 := by norm_num

/-- Predpostavke trditve `vsota_nazaj` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1 : ℝ) < 1.1 := by norm_num
  vsota_nazaj (hr := w)

/-- Razlaga 3: brez obrokov bi dolg narasel na 4000·1,05⁴ = 4862,025 ≈ 4862,03 €.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#brez-obrokov
besedilo: »Brez obrokov bi dolg narasel na $4000 \cdot 1{,}05^4 \approx 4862{,}03$ €: to je vrednost posojila ob koncu četrtega leta, s katero primerjamo vrednost vseh štirih obrokov ob koncu četrtega leta.« -/
theorem brez_obrokov : (4000 : ℝ) * 1.05 ^ 4 = 4862.025 ∧ |(4862.025 : ℝ) - 4862.03| ≤ 0.005 := by
  norm_num [abs_le]

/-- Razlaga 4: r⁴ = 1,05⁴ = 1,21550625 in a = 4000·1,21550625·0,05/0,21550625 ≈ 1128,05.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#teleskop-anuiteta
besedilo: »$$a = 4000 \cdot \frac{1{,}21550625 \cdot 0{,}05}{0{,}21550625} \approx 1128{,}05$$« -/
theorem teleskop_anuiteta : (1.05 : ℝ) ^ 4 = 1.21550625 ∧
    |(4000 : ℝ) * (1.21550625 * 0.05 / 0.21550625) - 1128.05| < 0.005 := by
  norm_num [abs_lt]

/-- Razlaga 4: 4·1128,05 = 4512,20 €, od tega 4512,20 − 4000 = 512,20 € obresti; premisli: ne 4000·0,05·4 = 800.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#teleskop-skupaj
besedilo: »Krožek plača $4 \cdot 1128{,}05 = 4512{,}20$ €, od tega $512{,}20$ € obresti.« -/
theorem teleskop_skupaj : 4 * (1128.05 : ℝ) = 4512.20 ∧ (4512.20 : ℝ) - 4000 = 512.20 ∧
    (4000 : ℝ) * 0.05 * 4 = 800 := by norm_num

/-! ## Razlaga 5: amortizacijski načrt -/

/-- Razlaga 5: vrstica načrta z oₖ = Dₖ₋₁·p/100, Rₖ = a − oₖ da Dₖ = Dₖ₋₁ − Rₖ = Dₖ₋₁·r − a, r = 1 + p/100.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#vrstica
besedilo: »$a = G_0 \cdot \dfrac{r^n (r - 1)}{r^n - 1}$, kjer je $r = 1 + \dfrac{p}{100}$« -/
theorem vrstica (Dp a p : ℝ) : Dp - (a - Dp * (p / 100)) = Dp * (1 + p / 100) - a := by ring

/-- Ustno vprašanje 3 (in Razlaga 5): pri Dₖ₊₁ = Dₖ·r − a je vsaka razdolžnina r-krat večja od prejšnje:
Rₖ₊₂ = Rₖ₊₁·r, kjer je Rₖ₊₁ = a − Dₖ(r − 1).
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#razdolznina-geometrijska
besedilo: »da je pri odplačevanju z enakimi anuitetami vsaka razdolžnina $r$-krat večja od prejšnje.« -/
theorem razdolznina_geometrijska (D : ℕ → ℝ) (r a : ℝ) (h : ∀ k, D (k + 1) = D k * r - a) (k : ℕ) :
    a - D (k + 1) * (r - 1) = (a - D k * (r - 1)) * r := by
  rw [h k]; ring

/-- Predpostavke trditve `razdolznina_geometrijska` se dajo izpolniti. -/
example : ∃ D : ℕ → ℝ, ∀ k, D (k + 1) = D k * 1.05 - 1128 :=
  ⟨fun k => 4000 * 1.05 ^ k - 1128 * ∑ i ∈ range k, (1.05 : ℝ) ^ i,
    fun k => by simp only [geom_sum_succ, pow_succ]; ring⟩

/-- Predpostavke trditve `razdolznina_geometrijska` se dajo izpolniti: izrek, uporabljen na primeru. -/
example : True :=
  have w : ∃ D : ℕ → ℝ, ∀ k, D (k + 1) = D k * 1.05 - 1128 :=
    ⟨fun k => 4000 * 1.05 ^ k - 1128 * ∑ i ∈ range k, (1.05 : ℝ) ^ i,
      fun k => by simp only [geom_sum_succ, pow_succ]; ring⟩
  (fun _ => trivial) (razdolznina_geometrijska (D := w.choose) (h := w.choose_spec))

/-- Razlaga 5: vsota razdolžnin (Dₖ − Dₖ₊₁) v n letih je D₀ − Dₙ; ko je Dₙ = 0, je to ravno posojilo.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#vsota-razdolznin
besedilo: »Vsota razdolžnin je ravno posojilo: $928{,}05 + 974{,}45 + 1023{,}17 + 1074{,}33 = 4000$.« -/
theorem vsota_razdolznin (D : ℕ → ℝ) (n : ℕ) (hn : D n = 0) :
    ∑ k ∈ range n, (D k - D (k + 1)) = D 0 := by
  have : ∀ m, ∑ k ∈ range m, (D k - D (k + 1)) = D 0 - D m := by
    intro m
    induction m with
    | zero => simp
    | succ j ih => rw [sum_range_succ, ih]; ring
  rw [this, hn, sub_zero]

/-- Predpostavke trditve `vsota_razdolznin` se dajo izpolniti (D₀ = 1, D₁ = 0, n = 1). -/
example : ∃ D : ℕ → ℝ, D 1 = 0 := ⟨fun k => 1 - k, by norm_num⟩

/-- Predpostavke trditve `vsota_razdolznin` se dajo izpolniti: izrek, uporabljen na primeru. -/
example : True :=
  have w : ∃ D : ℕ → ℝ, D 1 = 0 := ⟨fun k => 1 - k, by norm_num⟩
  (fun _ => trivial) (vsota_razdolznin (D := w.choose) (hn := w.choose_spec))

/-- Razlaga 5: zadnja razdolžnina je enaka ostanku pred zadnjim letom: iz 0 = Dₙ₋₁ − Rₙ sledi Rₙ = Dₙ₋₁.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#zadnja-razdolznina
besedilo: »Zadnja razdolžnina je enaka ostanku pred zadnjim letom, zato se načrt zapre z $0$.« -/
theorem zadnja_razdolznina (Dp R : ℝ) : Dp - R = 0 ↔ R = Dp := by
  constructor <;> intro h <;> linarith

/-- Razlaga 5, tabela za teleskop (a = 1128,05, zaokroženo na cente): vrstice 1–4.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#nacrt-teleskop
besedilo: »Za teleskop ($a = 1128{,}05$ € v vsakem letu,« -/
theorem nacrt_teleskop :
    (4000 : ℝ) * 0.05 = 200 ∧ (1128.05 : ℝ) - 200 = 928.05 ∧ (4000 : ℝ) - 928.05 = 3071.95 ∧
    |(3071.95 : ℝ) * 0.05 - 153.60| < 0.005 ∧ (1128.05 : ℝ) - 153.60 = 974.45 ∧
    (3071.95 : ℝ) - 974.45 = 2097.50 ∧
    |(2097.50 : ℝ) * 0.05 - 104.88| ≤ 0.005 ∧ (1128.05 : ℝ) - 104.88 = 1023.17 ∧
    (2097.50 : ℝ) - 1023.17 = 1074.33 ∧
    |(1074.33 : ℝ) * 0.05 - 53.72| < 0.005 ∧ (1128.05 : ℝ) - 53.72 = 1074.33 ∧ (1074.33 : ℝ) - 1074.33 = 0 := by
  norm_num [abs_lt, abs_le]

/-- Razlaga 5: 928,05·1,05 = 974,4525 in 928,05 + 974,45 + 1023,17 + 1074,33 = 4000.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#nacrt-teleskop-preizkus
besedilo: »$928{,}05 + 974{,}45 + 1023{,}17 + 1074{,}33 = 4000$« -/
theorem nacrt_teleskop_preizkus : (928.05 : ℝ) * 1.05 = 974.4525 ∧
    (928.05 : ℝ) + 974.45 + 1023.17 + 1074.33 = 4000 := by norm_num

/-- Razlaga 5 (varčevanje): če je S₀ = 0 in Sₖ₊₁ = Sₖ·r + a, je Sₙ = a(rⁿ − 1)/(r − 1) (r ≠ 1).
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#varcevanje
besedilo: »ima po $n$ letih $a \cdot \frac{r^n - 1}{r - 1}$,« -/
theorem varcevanje (S : ℕ → ℝ) (r a : ℝ) (hr : r ≠ 1) (h0 : S 0 = 0) (h : ∀ k, S (k + 1) = S k * r + a)
    (n : ℕ) : S n = a * ((r ^ n - 1) / (r - 1)) := by
  rw [← geom_sum_eq hr]
  induction n with
  | zero => simp [h0]
  | succ k ih => rw [h k, ih, geom_sum_succ]; ring

/-- Predpostavke trditve `varcevanje` se dajo izpolniti. -/
example : (1.05 : ℝ) ≠ 1 ∧ ∃ S : ℕ → ℝ, S 0 = 0 ∧ ∀ k, S (k + 1) = S k * 1.05 + 100 :=
  ⟨by norm_num, fun k => 100 * ∑ i ∈ range k, (1.05 : ℝ) ^ i, by simp,
    fun k => by simp only [geom_sum_succ]; ring⟩

/-! ## Primer 1: anuiteta za ogled mrka -/

/-- Predpostavke trditve `varcevanje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1.05 : ℝ) ≠ 1 ∧ ∃ S : ℕ → ℝ, S 0 = 0 ∧ ∀ k, S (k + 1) = S k * 1.05 + 100 :=
    ⟨by norm_num, fun k => 100 * ∑ i ∈ range k, (1.05 : ℝ) ^ i, by simp,
      fun k => by simp only [geom_sum_succ]; ring⟩
  varcevanje (hr := w.1) (h0 := w.2.1) (h := w.2.2)

/-- Primer 1: r = 1 + 4/100 = 1,04; 1,04³ = 1,124864; a = 2700·1,124864·0,04/0,124864 ≈ 972,94;
3·972,94 = 2918,82.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#primer1
besedilo: »$a = 2700 \cdot \dfrac{1{,}124864 \cdot 0{,}04}{0{,}124864} \approx 972{,}94$« -/
theorem primer1 : 1 + (4 : ℝ) / 100 = 1.04 ∧ (1.04 : ℝ) ^ 3 = 1.124864 ∧
    |(2700 : ℝ) * (1.124864 * 0.04 / 0.124864) - 972.94| < 0.005 ∧ 3 * (972.94 : ℝ) = 2918.82 := by
  norm_num [abs_lt]

/-! ## Primer 2: amortizacijski načrt -/

/-- Primer 2, koraki 1–3: o₁ = 108, R₁ = 864,94, D₁ = 1835,06; o₂ ≈ 73,40, R₂ = 899,54, D₂ = 935,52;
o₃ ≈ 37,42, R₃ = 935,52 = D₂, D₃ = 0.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#primer2
besedilo: »Drugo leto: $o_2 = 1835{,}06 \cdot 0{,}04 \approx 73{,}40$, $R_2 = 972{,}94 - 73{,}40 = 899{,}54$, $D_2 = 1835{,}06 - 899{,}54 = 935{,}52$.« -/
theorem primer2 :
    (2700 : ℝ) * 0.04 = 108 ∧ (972.94 : ℝ) - 108 = 864.94 ∧ (2700 : ℝ) - 864.94 = 1835.06 ∧
    |(1835.06 : ℝ) * 0.04 - 73.40| < 0.005 ∧ (972.94 : ℝ) - 73.40 = 899.54 ∧
    (1835.06 : ℝ) - 899.54 = 935.52 ∧
    |(935.52 : ℝ) * 0.04 - 37.42| < 0.005 ∧ (972.94 : ℝ) - 37.42 = 935.52 ∧ (935.52 : ℝ) - 935.52 = 0 := by
  norm_num [abs_lt]

/-- Primer 2, korak 4: 864,94 + 899,54 + 935,52 = 2700; 108 + 73,40 + 37,42 = 218,82 = 2918,82 − 2700.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#primer2-preizkus
besedilo: »Preizkus: razdolžnine skupaj dajo posojilo, $864{,}94 + 899{,}54 + 935{,}52 = 2700$; obresti $108 + 73{,}40 + 37{,}42 = 218{,}82$ se ujemajo s primerom 1, kjer je $2918{,}82 - 2700 = 218{,}82$.« -/
theorem primer2_preizkus : (864.94 : ℝ) + 899.54 + 935.52 = 2700 ∧ (108 : ℝ) + 73.40 + 37.42 = 218.82 ∧
    (2918.82 : ℝ) - 2700 = 218.82 := by norm_num

/-! ## Primer 3: koliko si društvo lahko izposodi -/

/-- Primer 3: 1,06⁵ = 1,3382255776; G₀ = 1500·0,3382255776/(1,3382255776·0,06) ≈ 6318,55;
6500 − 6318,55 = 181,45; 5·1500 = 7500 > 6318,55.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#primer3
besedilo: »$G_0 = 1500 \cdot \dfrac{0{,}3382255776}{1{,}3382255776 \cdot 0{,}06} \approx 6318{,}55$« -/
theorem primer3 : (1.06 : ℝ) ^ 5 = 1.3382255776 ∧
    |(1500 : ℝ) * (0.3382255776 / (1.3382255776 * 0.06)) - 6318.55| < 0.005 ∧
    (6500 : ℝ) - 6318.55 = 181.45 ∧ 5 * (1500 : ℝ) = 7500 ∧ (6318.55 : ℝ) < 7500 := by
  norm_num [abs_lt]

/-! ## Primer 4: preostanek naenkrat -/

/-- Primer 4, podatek: anuiteta za 3200 €, 6 %, 5 let je 3200·1,06⁵·0,06/(1,06⁵ − 1) ≈ 759,67.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#primer4-anuiteta
besedilo: »Tri plačane anuitete ob istem trenutku: $759{,}67 \cdot \dfrac{0{,}191016}{0{,}06} \approx 2418{,}4854$.« -/
theorem primer4_anuiteta : |(3200 : ℝ) * (1.06 ^ 5 * 0.06 / (1.06 ^ 5 - 1)) - 759.67| < 0.005 := by
  norm_num [abs_lt]

/-- Primer 4: 1,06³ = 1,191016; 3200·1,191016 = 3811,2512; 759,67·0,191016/0,06 ≈ 2418,4854;
D₃ = 3811,2512 − 2418,4854 ≈ 1392,77.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#primer4
besedilo: »$D_3 = 3811{,}2512 - 2418{,}4854 \approx 1392{,}77$ €. Preizkus: $\dfrac{759{,}67}{1{,}06} + \dfrac{759{,}67}{1{,}06^2} \approx 716{,}67 + 676{,}10 = 1392{,}77$ €. Oba načina dasta isto, kot zahteva načelo ekvivalence glavnic.« -/
theorem primer4 : (1.06 : ℝ) ^ 3 = 1.191016 ∧ (3200 : ℝ) * 1.191016 = 3811.2512 ∧
    |(759.67 : ℝ) * (0.191016 / 0.06) - 2418.4854| < 0.00005 ∧
    |(3811.2512 : ℝ) - 2418.4854 - 1392.77| < 0.005 := by
  norm_num [abs_lt]

/-- Primer 4, premisli (preizkus): 759,67/1,06 ≈ 716,67, 759,67/1,06² ≈ 676,10, 716,67 + 676,10 = 1392,77.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#primer4-preizkus
besedilo: »Preizkus: $\dfrac{759{,}67}{1{,}06} + \dfrac{759{,}67}{1{,}06^2} \approx 716{,}67 + 676{,}10 = 1392{,}77$ €.« -/
theorem primer4_preizkus : |(759.67 : ℝ) / 1.06 - 716.67| < 0.005 ∧ |(759.67 : ℝ) / 1.06 ^ 2 - 676.10| < 0.005 ∧
    (716.67 : ℝ) + 676.10 = 1392.77 := by
  norm_num [abs_lt]

/-! ## Pogoste napake -/

/-- Pogoste napake: 4000·0,05·4 = 800; 4000/4 + 200 = 1200; z 1,05⁴ ≈ 1,22 je a = 4000·1,22·0,05/0,22 ≈ 1109,09.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#napake
besedilo: »Prezgodnje zaokroževanje.** Z $1{,}05^4 \approx 1{,}22$ dobiš $a \approx 1109{,}09$ € namesto $1128{,}05$ €.« -/
theorem napake : (4000 : ℝ) * 0.05 * 4 = 800 ∧ (4000 : ℝ) / 4 + 200 = 1200 ∧
    |(4000 : ℝ) * 1.22 * 0.05 / 0.22 - 1109.09| < 0.005 := by
  norm_num [abs_lt]

/-! ## Drugače: korak za korakom in kot zgodba -/

/-- Drugače, koraki 3–5: 4000·1,21550625 = 4862,025; 0,21550625/0,05 = 4,310125; 4862,025/4,310125 ≈ 1128,05.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#recept
besedilo: »$a = \frac{4862{,}025}{4{,}310125} \approx 1128{,}05$« -/
theorem recept : (4000 : ℝ) * 1.21550625 = 4862.025 ∧ (0.21550625 : ℝ) / 0.05 = 4.310125 ∧
    |(4862.025 : ℝ) / 4.310125 - 1128.05| < 0.005 := by
  norm_num [abs_lt]

/-- Kot zgodba: 4000 € se napihne za 4000·0,05 = 200 €; od 1128,05 € gre 928,05 € za dolg.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#zgodba
besedilo: »Od Majinega denarja jih $200$ gre za obresti, ostalih $928{,}05$ € pa res zmanjša dolg.« -/
theorem zgodba : (4000 : ℝ) * 0.05 = 200 ∧ (1128.05 : ℝ) - 200 = 928.05 := by norm_num

/-! ## Za maturo -/

/-- Matura 1: o₅ = 6300·10/100 = 630; R₅ = 3630 − 630 = 3000; D₅ = 6300 − 3000 = 3300;
preizkus 3300·0,1 = 330, 3630 − 330 = 3300 (6. anuiteta zapre dolg).
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#matura1
besedilo: »Preizkus: v 6. letu so obresti $3300 \cdot 0{,}1 = 330$ €, razdolžnina $3630 - 330 = 3300$ € pa je ravno ostanek, zato se dolg s 6. anuiteto zapre.« -/
theorem matura1 : (6300 : ℝ) * 10 / 100 = 630 ∧ (3630 : ℝ) - 630 = 3000 ∧ (6300 : ℝ) - 3000 = 3300 ∧
    (3300 : ℝ) * 0.1 = 330 ∧ (3630 : ℝ) - 330 = 3300 := by norm_num

/-- Matura 2 a): 1,045⁵ ≈ 1,24618194; a = 15 000·1,24618194·0,045/0,24618194 ≈ 3416,87 (tudi z nezaokroženo
potenco).
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#matura2a
besedilo: »$a = 15\,000 \cdot \dfrac{1{,}24618194 \cdot 0{,}045}{0{,}24618194} \approx 3416{,}87$« -/
theorem matura2a : |(1.045 : ℝ) ^ 5 - 1.24618194| < 0.000000005 ∧
    |(15000 : ℝ) * (1.24618194 * 0.045 / 0.24618194) - 3416.87| < 0.005 ∧
    |(15000 : ℝ) * (1.045 ^ 5 * 0.045 / (1.045 ^ 5 - 1)) - 3416.87| < 0.005 := by
  norm_num [abs_lt]

/-- Matura 2 b): o₁ = 675, R₁ = 2741,87, D₁ = 12 258,13; o₂ ≈ 551,62, R₂ = 2865,25, D₂ = 9392,88.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#matura2b
besedilo: »b) 2. leto: $o_2 = 12\,258{,}13 \cdot 0{,}045 \approx 551{,}62$; $R_2 = 3416{,}87 - 551{,}62 = 2865{,}25$; $D_2 = 12\,258{,}13 - 2865{,}25 = 9392{,}88$.« -/
theorem matura2b : (15000 : ℝ) * 0.045 = 675 ∧ (3416.87 : ℝ) - 675 = 2741.87 ∧
    (15000 : ℝ) - 2741.87 = 12258.13 ∧ |(12258.13 : ℝ) * 0.045 - 551.62| < 0.005 ∧
    (3416.87 : ℝ) - 551.62 = 2865.25 ∧ (12258.13 : ℝ) - 2865.25 = 9392.88 := by
  norm_num [abs_lt]

/-- Matura 2 c): 15 000·1,045 = 15 675; a' = 15 675·1,24618194·0,045/0,24618194 ≈ 3570,63;
to je a·1,045 (točno, za katerikoli faktor q), in 3416,87·1,045 ≈ 3570,63.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#matura2c
besedilo: »c) Po načelu ekvivalence glavnic je $a' = 15\,675 \cdot \dfrac{1{,}24618194 \cdot 0{,}045}{0{,}24618194} \approx 3570{,}63$, torej $3570{,}63$ € (to je $a \cdot 1{,}045$).« -/
theorem matura2c : (15000 : ℝ) * 1.045 = 15675 ∧
    |(15675 : ℝ) * (1.24618194 * 0.045 / 0.24618194) - 3570.63| < 0.005 ∧
    (∀ q : ℝ, (15675 : ℝ) * q = (15000 * q) * 1.045) ∧ |(3416.87 : ℝ) * 1.045 - 3570.63| < 0.005 := by
  refine ⟨by norm_num, by norm_num [abs_lt], fun q => by ring, by norm_num [abs_lt]⟩

/-! ## Preveri se -/

/-- Preveri se 3 (stolpci): pri 6000 €, 6 %, 5 letih je ostanek po letih ≈ 4936, 3807, 2611, 1344, 0 €;
po 2. letu natančno ≈ 3807,38 €. Tu je a = 6000·1,06⁵·0,06/(1,06⁵ − 1) in Dₖ = 6000·1,06ᵏ − a(1,06ᵏ − 1)/0,06.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#kviz3-stolpci
besedilo: »Po 2. letu ostane približno $3800$ € (natančno $3807{,}38$ €), obresti 3. leta so $3800 \cdot 0{,}06 = 228$ € (natančno $228{,}44$ €).« -/
theorem kviz3_stolpci :
    let a : ℝ := 6000 * (1.06 ^ 5 * 0.06 / (1.06 ^ 5 - 1))
    |6000 * 1.06 - a - 4936| < 0.5 ∧
    |6000 * 1.06 ^ 2 - a * ((1.06 ^ 2 - 1) / 0.06) - 3807.38| < 0.005 ∧
    |6000 * 1.06 ^ 3 - a * ((1.06 ^ 3 - 1) / 0.06) - 2611| < 0.5 ∧
    |6000 * 1.06 ^ 4 - a * ((1.06 ^ 4 - 1) / 0.06) - 1344| < 0.5 ∧
    6000 * 1.06 ^ 5 - a * ((1.06 ^ 5 - 1) / 0.06) = 0 := by
  intro a
  simp only [a]
  norm_num [abs_lt]

/-- Preveri se 3: obresti 3. leta 3800·0,06 = 228 € (natančno 3807,38·0,06 ≈ 228,44); napačna odgovora:
6000·0,06 = 360 (1. leto) in 4936·0,06 ≈ 296 (2. leto).
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#kviz3-obresti
besedilo: »Po 2. letu ostane približno $3800$ € (natančno $3807{,}38$ €), obresti 3. leta so $3800 \cdot 0{,}06 = 228$ € (natančno $228{,}44$ €).« -/
theorem kviz3_obresti : (3800 : ℝ) * 0.06 = 228 ∧ |(3807.38 : ℝ) * 0.06 - 228.44| < 0.005 ∧
    (6000 : ℝ) * 0.06 = 360 ∧ |(4936 : ℝ) * 0.06 - 296| < 0.5 := by
  norm_num [abs_lt]

/-- Preveri se 4: 1210/1,1 + 1210/1,21 = 1100 + 1000 = 2100 €; napačni: 2·1210 = 2420,
2·1210/1,1 = 2200, 2·1210/1,21 = 2000; 1,1² = 1,21.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#kviz4
besedilo: »$\frac{1210}{1{,}1} + \frac{1210}{1{,}21} = 1100 + 1000 = 2100$« -/
theorem kviz4 : (1210 : ℝ) / 1.1 + 1210 / 1.21 = 1100 + 1000 ∧ (1100 : ℝ) + 1000 = 2100 ∧
    (1.1 : ℝ) ^ 2 = 1.21 ∧ 2 * (1210 : ℝ) = 2420 ∧ 2 * ((1210 : ℝ) / 1.1) = 2200 ∧
    2 * ((1210 : ℝ) / 1.21) = 2000 := by norm_num

/-- Preveri se 4 (tudi kot rešitev enačbe): posojilo G₀ z dvema anuitetama 1210 € pri 10 % je natanko
2100 €: G₀·1,1² − 1210·1,1 − 1210 = 0 ⟺ G₀ = 2100.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#kviz4-enacba
besedilo: »$\frac{1210}{1{,}1} + \frac{1210}{1{,}21} = 1100 + 1000 = 2100$ €.« -/
theorem kviz4_enacba (G₀ : ℝ) : G₀ * 1.1 ^ 2 - 1210 * 1.1 - 1210 = 0 ↔ G₀ = 2100 := by
  constructor
  · intro h; norm_num at h; linarith
  · rintro rfl; norm_num

/-- Preveri se 5: 1100/1,05 + 1100/1,05² + 1100/1,05³ ≈ 2995,57 < 3000 (B je ugodnejši), 3·1100 = 3300.
trditev: MAT-SS-4/anuitete-in-amortizacijski-nacrt#kviz5
besedilo: »$\frac{1100}{1{,}05} + \frac{1100}{1{,}05^2} + \frac{1100}{1{,}05^3} \approx 2995{,}57$ € $< 3000$ €; razlika je majhna, a B je ugodnejši.« -/
theorem kviz5 : |(1100 : ℝ) / 1.05 + 1100 / 1.05 ^ 2 + 1100 / 1.05 ^ 3 - 2995.57| < 0.005 ∧
    (1100 : ℝ) / 1.05 + 1100 / 1.05 ^ 2 + 1100 / 1.05 ^ 3 < 3000 ∧ 3 * (1100 : ℝ) = 3300 := by
  norm_num [abs_lt]

/-! ## Primeri izpolnljivosti (izrek, uporabljen na konkretnih vrednostih) -/

/-- Predpostavke trditve `dolg` se dajo izpolniti: izrek, uporabljen na primeru. -/
example : True :=
  have w : ∃ D : ℕ → ℝ, D 0 = 4000 ∧ ∀ k, D (k + 1) = D k * 1.05 - 1128 :=
    ⟨fun k => 4000 * 1.05 ^ k - 1128 * ∑ i ∈ range k, (1.05 : ℝ) ^ i, by simp,
      fun k => by simp only [geom_sum_succ, pow_succ]; ring⟩
  (fun _ => trivial) (dolg (D := w.choose) (hr := (by norm_num : (1.05:ℝ) ≠ 1)) (h0 := w.choose_spec.1) (h := w.choose_spec.2))

end Evklid.Lekcije.MAT_SS_4.AnuiteteInAmortizacijskiNacrt
