/-
vir: content/lessons/MAT-SS-3/racionalne-funkcije.md
sha256: 4db3f1ef6f2078d822f09b9f196e76df3d294b74c3c284202e53be3a7b87c2af
Ni v Leanu: skice in opisi grafov z besedami (dokazani so le predznaki, lega vej nad oziroma pod asimptoto,
limite ob polih in v ±∞), simulacija, analogije (tekoči trak, zaprt mostiček; taksi je dokazan),
smisel naloge (»pri hoji je smiseln le x > 0«, izbira v > 3 pri čolnu je dokazana kot pogoj);
trditve »funkcija tam ni definirana« in »definirana je povsod razen v ničlah imenovalca« (v Leanu je
vsaka funkcija ℝ → ℝ definirana povsod, x/0 = 0; zato imajo rešitve enačb pogoje »imenovalec ≠ 0«
zapisane na levi strani ↔, sicer bi npr. x = 2 pri x/(x − 2) = 2/(x − 2) dal 0 = 0); »navpične
asimptote graf ne more sekati« (isti razlog); natančna definicija asimptote z razdaljo (definicija);
pravilo o najmanjšem skupnem imenovalcu (postopek, ne trditev; uporabljen je v primerih 3 in 4);
»števec višji za 2 ali več: asimptote v obliki premice ni« (zahtevno, še ni dokazano); postopek v
6 korakih in točkovanje maturitetnih nalog; ustni vprašanji 1 in 2 kot besedilo (pravila iz njiju so
dokazana splošno: `nicle_iz_stevca`, `asimptota_nizja_stopnja`, `asimptota_enaki_stopnji`,
`asimptota_kolicnik`).
Približki: »≈ 5,94«, »≈ 5,982«, »≈ 6,018« so dokazani kot ocene napake zaokrožitve.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_3.RacionalneFunkcije

open Filter Topology Set Polynomial

/-! ## Pomožne trditve -/

/-- Pomožna (razlaga, »daleč levo in desno«): če je f(x) = R(1/x) za velike |x| in je R zvezna v 0,
gre f v +∞ in v −∞ proti R(0). Tako lekcija dobi asimptoto: števec in imenovalec deli z x.
pomozno -/
theorem asimptota_inv {f R : ℝ → ℝ} {L : ℝ} (M : ℝ) (hR : ContinuousAt R 0) (hL : R 0 = L)
    (h : ∀ x, M < |x| → f x = R x⁻¹) :
    Tendsto f atTop (𝓝 L) ∧ Tendsto f atBot (𝓝 L) := by
  subst hL
  constructor
  · refine (hR.tendsto.comp tendsto_inv_atTop_zero).congr' ?_
    filter_upwards [eventually_gt_atTop M, eventually_gt_atTop 0] with x hx h0
    exact (h x (by rw [abs_of_pos h0]; exact hx)).symm
  · refine (hR.tendsto.comp tendsto_inv_atBot_zero).congr' ?_
    filter_upwards [eventually_lt_atBot (-M), eventually_lt_atBot 0] with x hx h0
    exact (h x (by rw [abs_of_neg h0]; linarith)).symm

/-- Predpostavke `asimptota_inv` se dajo izpolniti (f(x) = R(1/x) = 1/x). -/
example : Tendsto (fun x : ℝ => x⁻¹) atTop (𝓝 0) ∧ Tendsto (fun x : ℝ => x⁻¹) atBot (𝓝 0) :=
  asimptota_inv (R := id) 0 continuousAt_id rfl fun _ _ => rfl

/-- Pomožna: desno od c je (x − c)ᵐ pozitiven in gre proti 0 (m ≥ 1).
pomozno -/
theorem potenca_desno (c : ℝ) {m : ℕ} (hm : 1 ≤ m) :
    Tendsto (fun x : ℝ => (x - c) ^ m) (𝓝[>] c) (𝓝[>] 0) := by
  refine tendsto_nhdsWithin_iff.2 ⟨?_, eventually_nhdsWithin_of_forall fun x hx =>
    Set.mem_Ioi.2 (pow_pos (sub_pos.2 hx) m)⟩
  have : Tendsto (fun x : ℝ => (x - c) ^ m) (𝓝 c) (𝓝 ((c - c) ^ m)) :=
    ((continuous_id.sub continuous_const).pow m).continuousAt.tendsto
  rw [sub_self, zero_pow (by omega)] at this
  exact this.mono_left nhdsWithin_le_nhds

/-- Pomožna: levo od c je (x − c)ᵐ pri sodem m ≥ 1 pozitiven in gre proti 0.
pomozno -/
theorem potenca_levo_soda (c : ℝ) {m : ℕ} (hm : Even m) (hm1 : 1 ≤ m) :
    Tendsto (fun x : ℝ => (x - c) ^ m) (𝓝[<] c) (𝓝[>] 0) := by
  refine tendsto_nhdsWithin_iff.2 ⟨?_, eventually_nhdsWithin_of_forall fun x hx =>
    Set.mem_Ioi.2 (hm.pow_pos (sub_ne_zero.2 (ne_of_lt hx)))⟩
  have : Tendsto (fun x : ℝ => (x - c) ^ m) (𝓝 c) (𝓝 ((c - c) ^ m)) :=
    ((continuous_id.sub continuous_const).pow m).continuousAt.tendsto
  rw [sub_self, zero_pow (by omega)] at this
  exact this.mono_left nhdsWithin_le_nhds

/-- Pomožna: levo od c je (x − c)ᵐ pri lihem m negativen in gre proti 0.
pomozno -/
theorem potenca_levo_liha (c : ℝ) {m : ℕ} (hm : Odd m) :
    Tendsto (fun x : ℝ => (x - c) ^ m) (𝓝[<] c) (𝓝[<] 0) := by
  refine tendsto_nhdsWithin_iff.2 ⟨?_, eventually_nhdsWithin_of_forall fun x hx =>
    Set.mem_Iio.2 (hm.pow_neg (sub_neg.2 hx))⟩
  have : Tendsto (fun x : ℝ => (x - c) ^ m) (𝓝 c) (𝓝 ((c - c) ^ m)) :=
    ((continuous_id.sub continuous_const).pow m).continuousAt.tendsto
  rw [sub_self, zero_pow (by obtain ⟨k, rfl⟩ := hm; omega)] at this
  exact this.mono_left nhdsWithin_le_nhds

/-- Predpostavke `potenca_desno`, `potenca_levo_soda` in `potenca_levo_liha` se dajo izpolniti (c = 0, m = 2
oziroma m = 1). -/
example : Tendsto (fun x : ℝ => (x - 0) ^ 2) (𝓝[>] 0) (𝓝[>] 0) ∧
    Tendsto (fun x : ℝ => (x - 0) ^ 2) (𝓝[<] 0) (𝓝[>] 0) ∧
    Tendsto (fun x : ℝ => (x - 0) ^ 1) (𝓝[<] 0) (𝓝[<] 0) :=
  ⟨potenca_desno 0 (by norm_num), potenca_levo_soda 0 even_two (by norm_num), potenca_levo_liha 0 odd_one⟩

/-! ## Razlaga: pravila -/

/-- Razlaga, »Ničle, poli in luknje« (in Povzetek): ulomek p/q z imenovalcem q ≠ 0 je enak 0 natanko
tedaj, ko je števec p = 0 (ničle funkcije dá števec).
trditev: MAT-SS-3/racionalne-funkcije#nicle-iz-stevca
besedilo: »Ulomek je enak $0$, ko je števec $0$, imenovalec pa ne.« -/
theorem nicle_iz_stevca (p q : ℝ) (hq : q ≠ 0) : p / q = 0 ↔ p = 0 := by
  rw [div_eq_zero_iff]; tauto

/-- Predpostavka `nicle_iz_stevca` se da izpolniti (q = 1). -/
example : (0 : ℝ) / 1 = 0 ↔ (0 : ℝ) = 0 := nicle_iz_stevca 0 1 one_ne_zero

/-- Razlaga, »Stopnja pola«, pol lihe stopnje (in »Drugače: Bolj natančno«): f(x) = g(x)/(x − c)ᵐ, g
zvezna v c, g(c) > 0, m lih: levo od c gre f v −∞, desno v +∞ (veji na nasprotnih straneh).
trditev: MAT-SS-3/racionalne-funkcije#pol-liha-stopnja
besedilo: »pri lihi stopnji ima graf na obeh straneh pola nasproten predznak (ena veja $+\infty$, druga $-\infty$)« -/
theorem pol_liha_stopnja {g : ℝ → ℝ} {c : ℝ} {m : ℕ} (hg : ContinuousAt g c) (h0 : 0 < g c)
    (hm : Odd m) :
    Tendsto (fun x => g x / (x - c) ^ m) (𝓝[<] c) atBot ∧
      Tendsto (fun x => g x / (x - c) ^ m) (𝓝[>] c) atTop := by
  have hm1 : 1 ≤ m := by obtain ⟨k, rfl⟩ := hm; omega
  constructor
  · simpa [div_eq_mul_inv] using (hg.tendsto.mono_left nhdsWithin_le_nhds).pos_mul_atBot h0
      (tendsto_inv_nhdsLT_zero.comp (potenca_levo_liha c hm))
  · simpa [div_eq_mul_inv] using (hg.tendsto.mono_left nhdsWithin_le_nhds).pos_mul_atTop h0
      (tendsto_inv_nhdsGT_zero.comp (potenca_desno c hm1))

/-- Predpostavke `pol_liha_stopnja` se dajo izpolniti (g = 1, c = 0, m = 1). -/
example : Tendsto (fun x : ℝ => (fun _ => (1 : ℝ)) x / (x - 0) ^ 1) (𝓝[<] 0) atBot ∧
    Tendsto (fun x : ℝ => (fun _ => (1 : ℝ)) x / (x - 0) ^ 1) (𝓝[>] 0) atTop :=
  pol_liha_stopnja continuousAt_const one_pos odd_one

/-- Razlaga, »Stopnja pola«, pol lihe stopnje pri g(c) < 0: levo +∞, desno −∞.
trditev: MAT-SS-3/racionalne-funkcije#pol-liha-stopnja-crtica
besedilo: »pri lihi stopnji ima graf na obeh straneh pola nasproten predznak (ena veja $+\infty$, druga $-\infty$)« -/
theorem pol_liha_stopnja' {g : ℝ → ℝ} {c : ℝ} {m : ℕ} (hg : ContinuousAt g c) (h0 : g c < 0)
    (hm : Odd m) :
    Tendsto (fun x => g x / (x - c) ^ m) (𝓝[<] c) atTop ∧
      Tendsto (fun x => g x / (x - c) ^ m) (𝓝[>] c) atBot := by
  have h := pol_liha_stopnja (g := fun x => -g x) hg.neg (by linarith) hm
  simp only [neg_div] at h
  exact ⟨tendsto_neg_atBot_iff.1 h.1, tendsto_neg_atTop_iff.1 h.2⟩

/-- Predpostavke `pol_liha_stopnja'` se dajo izpolniti (g = −1, c = 0, m = 1). -/
example : Tendsto (fun x : ℝ => (fun _ => (-1 : ℝ)) x / (x - 0) ^ 1) (𝓝[<] 0) atTop ∧
    Tendsto (fun x : ℝ => (fun _ => (-1 : ℝ)) x / (x - 0) ^ 1) (𝓝[>] 0) atBot :=
  pol_liha_stopnja' continuousAt_const (by norm_num) odd_one

/-- Razlaga, »Stopnja pola«, pol sode stopnje: g zvezna v c, g(c) > 0, m sod, m ≥ 1: obe veji gresta v +∞.
trditev: MAT-SS-3/racionalne-funkcije#pol-soda-stopnja
besedilo: »pri sodi stopnji gresta obe veji v isto smer.« -/
theorem pol_soda_stopnja {g : ℝ → ℝ} {c : ℝ} {m : ℕ} (hg : ContinuousAt g c) (h0 : 0 < g c)
    (hm : Even m) (hm1 : 1 ≤ m) :
    Tendsto (fun x => g x / (x - c) ^ m) (𝓝[<] c) atTop ∧
      Tendsto (fun x => g x / (x - c) ^ m) (𝓝[>] c) atTop := by
  constructor
  · simpa [div_eq_mul_inv] using (hg.tendsto.mono_left nhdsWithin_le_nhds).pos_mul_atTop h0
      (tendsto_inv_nhdsGT_zero.comp (potenca_levo_soda c hm hm1))
  · simpa [div_eq_mul_inv] using (hg.tendsto.mono_left nhdsWithin_le_nhds).pos_mul_atTop h0
      (tendsto_inv_nhdsGT_zero.comp (potenca_desno c hm1))

/-- Predpostavke `pol_soda_stopnja` se dajo izpolniti (g = 1, c = 0, m = 2). -/
example : Tendsto (fun x : ℝ => (fun _ => (1 : ℝ)) x / (x - 0) ^ 2) (𝓝[<] 0) atTop ∧
    Tendsto (fun x : ℝ => (fun _ => (1 : ℝ)) x / (x - 0) ^ 2) (𝓝[>] 0) atTop :=
  pol_soda_stopnja continuousAt_const one_pos even_two (by norm_num)

/-- Razlaga, »Stopnja pola«, pol sode stopnje pri g(c) < 0: obe veji gresta v −∞.
trditev: MAT-SS-3/racionalne-funkcije#pol-soda-stopnja-crtica
besedilo: »pri sodi stopnji gresta obe veji v isto smer.« -/
theorem pol_soda_stopnja' {g : ℝ → ℝ} {c : ℝ} {m : ℕ} (hg : ContinuousAt g c) (h0 : g c < 0)
    (hm : Even m) (hm1 : 1 ≤ m) :
    Tendsto (fun x => g x / (x - c) ^ m) (𝓝[<] c) atBot ∧
      Tendsto (fun x => g x / (x - c) ^ m) (𝓝[>] c) atBot := by
  have h := pol_soda_stopnja (g := fun x => -g x) hg.neg (by linarith) hm hm1
  simp only [neg_div] at h
  exact ⟨tendsto_neg_atTop_iff.1 h.1, tendsto_neg_atTop_iff.1 h.2⟩

/-- Predpostavke `pol_soda_stopnja'` se dajo izpolniti (g = −1, c = 0, m = 2). -/
example : Tendsto (fun x : ℝ => (fun _ => (-1 : ℝ)) x / (x - 0) ^ 2) (𝓝[<] 0) atBot ∧
    Tendsto (fun x : ℝ => (fun _ => (-1 : ℝ)) x / (x - 0) ^ 2) (𝓝[>] 0) atBot :=
  pol_soda_stopnja' continuousAt_const (by norm_num) even_two (by norm_num)

/-- Razlaga, »luknja« (in Povzetek »okrajšan skupni faktor pusti luknjo«): če je f(x) = k(x) za vse
x ≠ c (po krajšanju) in je k zvezna v c, ima f v c limito k(c): graf je graf k brez ene točke.
trditev: MAT-SS-3/racionalne-funkcije#luknja
besedilo: »Če ga po krajšanju v imenovalcu ni več, namesto pola ostane v grafu le prazna točka, **luknja**.« -/
theorem luknja {f k : ℝ → ℝ} {c : ℝ} (h : ∀ x, x ≠ c → f x = k x) (hk : ContinuousAt k c) :
    Tendsto f (𝓝[≠] c) (𝓝 (k c)) :=
  (hk.tendsto.mono_left nhdsWithin_le_nhds).congr'
    (eventually_nhdsWithin_of_forall fun x hx => (h x hx).symm)

/-- Predpostavke `luknja` se dajo izpolniti (f = k = id). -/
example : Tendsto (fun x : ℝ => x) (𝓝[≠] 0) (𝓝 ((fun x : ℝ => x) 0)) :=
  luknja (fun _ _ => rfl) continuousAt_id

/-- Razlaga, »Asimptote iz deljenja«: iz p(x) = q(x)k(x) + r(x) in q(x) ≠ 0 sledi
f(x) = p(x)/q(x) = k(x) + r(x)/q(x).
trditev: MAT-SS-3/racionalne-funkcije#deljenje
besedilo: »$p(x) = q(x)\,k(x) + r(x)$, stopnja ostanka $r$ je manjša od stopnje $q$. Potem je $$f(x) = k(x) + \frac{r(x)}{q(x)}$$« -/
theorem deljenje (p q k r : ℝ) (h : p = q * k + r) (hq : q ≠ 0) : p / q = k + r / q := by
  rw [h]; field_simp

/-- Predpostavke `deljenje` se dajo izpolniti (5 = 2·2 + 1). -/
example : (5 : ℝ) / 2 = 2 + 1 / 2 := deljenje 5 2 2 1 (by norm_num) (by norm_num)

/-- Razlaga, »Asimptote iz deljenja« (»Bolj natančno«, ustno vprašanje 2): če je P = Q·K + R in ima
ostanek R nižjo stopnjo kot Q, gre P(x)/Q(x) − K(x) = R(x)/Q(x) proti 0 v +∞ in v −∞: graf se bliža
grafu količnika K (poševna asimptota, ko je K stopnje 1).
trditev: MAT-SS-3/racionalne-funkcije#asimptota-kolicnik
besedilo: »Ulomek $\frac{r(x)}{q(x)}$ gre za velike $|x|$ proti $0$, zato se graf bliža grafu količnika $k$.« -/
theorem asimptota_kolicnik (P Q K R : ℝ[X]) (h : P = Q * K + R) (hdeg : R.degree < Q.degree) :
    Tendsto (fun x => P.eval x / Q.eval x - K.eval x) atTop (𝓝 0) ∧
      Tendsto (fun x => P.eval x / Q.eval x - K.eval x) atBot (𝓝 0) := by
  have hQ : Q ≠ 0 := by rintro rfl; simp at hdeg
  have key : ∀ x, Q.eval x ≠ 0 → P.eval x / Q.eval x - K.eval x = R.eval x / Q.eval x := by
    intro x hx; rw [h]; simp only [eval_add, eval_mul]; field_simp; ring
  have ev := eventually_eval_ne_zero_cofinite hQ
  exact ⟨(div_tendsto_atTop_zero_of_degree_lt hdeg).congr'
      ((ev.filter_mono atTop_le_cofinite).mono fun x hx => (key x hx).symm),
    (div_tendsto_atBot_zero_of_degree_lt hdeg).congr'
      ((ev.filter_mono atBot_le_cofinite).mono fun x hx => (key x hx).symm)⟩

/-- Predpostavke `asimptota_kolicnik` se dajo izpolniti (x² + 1 = x·x + 1, »Bolj natančno«). -/
example : Tendsto (fun x => (X ^ 2 + 1 : ℝ[X]).eval x / (X : ℝ[X]).eval x - (X : ℝ[X]).eval x) atTop (𝓝 0) ∧
    Tendsto (fun x => (X ^ 2 + 1 : ℝ[X]).eval x / (X : ℝ[X]).eval x - (X : ℝ[X]).eval x) atBot (𝓝 0) :=
  asimptota_kolicnik _ _ _ 1 (by ring) (by rw [degree_one, degree_X]; exact zero_lt_one)

/-- Razlaga, vodoravna asimptota, »števec nižje stopnje: y = 0«.
trditev: MAT-SS-3/racionalne-funkcije#asimptota-nizja-stopnja
besedilo: »Če ima števec nižjo stopnjo kot imenovalec, je asimptota $y = 0$.« -/
theorem asimptota_nizja_stopnja (P Q : ℝ[X]) (hdeg : P.degree < Q.degree) :
    Tendsto (fun x => P.eval x / Q.eval x) atTop (𝓝 0) ∧
      Tendsto (fun x => P.eval x / Q.eval x) atBot (𝓝 0) :=
  ⟨div_tendsto_atTop_zero_of_degree_lt hdeg, div_tendsto_atBot_zero_of_degree_lt hdeg⟩

/-- Predpostavka `asimptota_nizja_stopnja` se da izpolniti (P = 5, Q = X). -/
example : Tendsto (fun x => (C 5 : ℝ[X]).eval x / (X : ℝ[X]).eval x) atTop (𝓝 0) ∧
    Tendsto (fun x => (C 5 : ℝ[X]).eval x / (X : ℝ[X]).eval x) atBot (𝓝 0) :=
  asimptota_nizja_stopnja _ _ (by rw [degree_X]; exact (degree_C_le).trans_lt (by decide))

/-- Razlaga, vodoravna asimptota, »enaki stopnji: y = aₙ/bₙ« (vodilna koeficienta).
trditev: MAT-SS-3/racionalne-funkcije#asimptota-enaki-stopnji
besedilo: »Pri enakih stopnjah je asimptota $y = \frac{a_n}{b_n}$, kjer sta $a_n$ in $b_n$ vodilna koeficienta števca in imenovalca.« -/
theorem asimptota_enaki_stopnji (P Q : ℝ[X]) (hdeg : P.degree = Q.degree) :
    Tendsto (fun x => P.eval x / Q.eval x) atTop (𝓝 (P.leadingCoeff / Q.leadingCoeff)) ∧
      Tendsto (fun x => P.eval x / Q.eval x) atBot (𝓝 (P.leadingCoeff / Q.leadingCoeff)) :=
  ⟨div_tendsto_atTop_leadingCoeff_div_of_degree_eq hdeg,
    div_tendsto_atBot_leadingCoeff_div_of_degree_eq hdeg⟩

/-- Predpostavka `asimptota_enaki_stopnji` se da izpolniti (P = Q = X). -/
example : Tendsto (fun x => (X : ℝ[X]).eval x / (X : ℝ[X]).eval x) atTop
      (𝓝 ((X : ℝ[X]).leadingCoeff / (X : ℝ[X]).leadingCoeff)) ∧
    Tendsto (fun x => (X : ℝ[X]).eval x / (X : ℝ[X]).eval x) atBot
      (𝓝 ((X : ℝ[X]).leadingCoeff / (X : ℝ[X]).leadingCoeff)) :=
  asimptota_enaki_stopnji _ _ rfl

/-! ## Zakaj se tega učimo (uvod) -/

/-- Uvod: za 6 km s povprečjem 6 km/h imaš natanko 6/6 = 1 uro, vzpon (3 km s 3 km/h) pa traja
3/3 = 1 uro.
trditev: MAT-SS-3/racionalne-funkcije#uvod-ura
besedilo: »Za $6\,\mathrm{km}$ s povprečjem $6\,\mathrm{km/h}$ imaš na voljo natanko eno uro, to uro pa si porabil že za vzpon.« -/
theorem uvod_ura : (6 : ℝ) / 6 = 1 ∧ (3 : ℝ) / 3 = 1 := by norm_num

/-- Uvod: čas poti je 3/3 + 3/v = 1 + 3/v ur, povprečna hitrost 6/(1 + 3/v), po razširitvi z v je
v̄(v) = 6v/(v + 3) (v > 0).
trditev: MAT-SS-3/racionalne-funkcije#uvod-povprecna
besedilo: »Če greš nazaj s hitrostjo $v$, porabiš za vso pot $1 + \frac{3}{v}$ ur. Povprečna hitrost je pot, deljena s časom: $\bar v = \dfrac{6}{1 + \frac{3}{v}}$. Ko ulomek razširimo z $v$, dobimo $$\bar v(v) = \frac{6v}{v + 3}.$$« -/
theorem uvod_povprecna (v : ℝ) (hv : 0 < v) :
    (6 : ℝ) / (3 / 3 + 3 / v) = 6 / (1 + 3 / v) ∧ (6 : ℝ) / (1 + 3 / v) = 6 * v / (v + 3) := by
  have h3 : v + 3 ≠ 0 := by linarith
  refine ⟨by norm_num, ?_⟩
  field_simp

/-- Predpostavka `uvod_povprecna` se da izpolniti (v = 9). -/
example : (6 : ℝ) / (3 / 3 + 3 / 9) = 6 / (1 + 3 / 9) ∧ (6 : ℝ) / (1 + 3 / 9) = 6 * 9 / (9 + 3) :=
  uvod_povprecna 9 (by norm_num)

/-- Uvod: pri v = 9 km/h je povprečna hitrost le 4,5 km/h.
trditev: MAT-SS-3/racionalne-funkcije#uvod-v9
besedilo: »Pri $v = 9\,\mathrm{km/h}$ dobiš le $4{,}5\,\mathrm{km/h}$.« -/
theorem uvod_v9 : (6 : ℝ) * 9 / (9 + 3) = 9 / 2 := by norm_num

/-- Uvod: pri v = 300 km/h je povprečna hitrost približno 5,94 km/h (na dve decimalki).
trditev: MAT-SS-3/racionalne-funkcije#uvod-v300
besedilo: »Pri $v = 300\,\mathrm{km/h}$ dobiš približno $5{,}94\,\mathrm{km/h}$.« -/
theorem uvod_v300 : |(6 : ℝ) * 300 / (300 + 3) - 594 / 100| < 5 / 1000 := by
  rw [abs_lt]; constructor <;> norm_num

/-- Uvod: povprečna hitrost 6v/(v + 3) pri v > 0 nikoli ne doseže 6 (je manjša od 6) in se 6 bliža,
ko v raste.
trditev: MAT-SS-3/racionalne-funkcije#uvod-nikoli-6
besedilo: »Vrednost se številu $6$ vedno bolj približuje, a ga nikoli ne doseže.« -/
theorem uvod_nikoli_6 : (∀ v : ℝ, 0 < v → 6 * v / (v + 3) < 6) ∧
    Tendsto (fun v : ℝ => 6 * v / (v + 3)) atTop (𝓝 6) := by
  refine ⟨fun v hv => by rw [div_lt_iff₀ (by linarith)]; linarith, ?_⟩
  refine (asimptota_inv (R := fun t => 6 / (1 + 3 * t)) 10 (by fun_prop (disch := norm_num))
    (by norm_num) ?_).1
  intro x hx
  have hx0 : x ≠ 0 := by rintro rfl; norm_num at hx
  have hx3 : x + 3 ≠ 0 := by rcases lt_abs.mp hx with h | h <;> intro e <;> linarith
  field_simp

/-! ## Razlaga: prvi primer f(x) = 6x/(x + 3) -/

/-- Razlaga: prvi primer f(x) = 6x/(x + 3). -/
noncomputable def f₀ (x : ℝ) : ℝ := 6 * x / (x + 3)

/-- Razlaga, »Kje ni definirana«: x + 3 ≠ 0 natanko tedaj, ko x ≠ −3.
trditev: MAT-SS-3/racionalne-funkcije#f0-definicija
besedilo: »Z ničlo ne smemo deliti, zato mora biti $x + 3 \ne 0$, torej $x \ne -3$.« -/
theorem f₀_definicija (x : ℝ) : x + 3 ≠ 0 ↔ x ≠ -3 := by
  constructor <;> intro h e <;> apply h <;> linarith

/-- Razlaga, »Ničla«: za x ≠ −3 je f(x) = 0 natanko pri x = 0.
trditev: MAT-SS-3/racionalne-funkcije#f0-nicla
besedilo: »Ulomek je enak $0$, ko je števec $0$, imenovalec pa ne. To je pri $x = 0$.« -/
theorem f₀_nicla (x : ℝ) (hx : x ≠ -3) : f₀ x = 0 ↔ x = 0 := by
  have : x + 3 ≠ 0 := (f₀_definicija x).2 hx
  rw [f₀, nicle_iz_stevca _ _ this]; constructor <;> intro h <;> linarith

/-- Predpostavka `f₀_nicla` se da izpolniti (x = 0). -/
example : f₀ 0 = 0 ↔ (0 : ℝ) = 0 := f₀_nicla 0 (by norm_num)

/-- Razlaga, tabela blizu −3: x + 3 in f(x) pri x = −3,1; −3,01; −2,99; −2,9.
trditev: MAT-SS-3/racionalne-funkcije#f0-tabela
besedilo: »| $-3{,}1$ | $-0{,}1$ | $186$ | | $-3{,}01$ | $-0{,}01$ | $1806$ | | $-2{,}99$ | $0{,}01$ | $-1794$ | | $-2{,}9$ | $0{,}1$ | $-174$ |« -/
theorem f₀_tabela :
    ((-31 / 10 : ℝ) + 3 = -1 / 10 ∧ f₀ (-31 / 10) = 186) ∧
    ((-301 / 100 : ℝ) + 3 = -1 / 100 ∧ f₀ (-301 / 100) = 1806) ∧
    ((-299 / 100 : ℝ) + 3 = 1 / 100 ∧ f₀ (-299 / 100) = -1794) ∧
    ((-29 / 10 : ℝ) + 3 = 1 / 10 ∧ f₀ (-29 / 10) = -174) := by
  unfold f₀; norm_num

/-- Razlaga, »Blizu −3«: števec 6x gre proti −18; levo od −3 gre f v +∞, desno v −∞ (pol stopnje 1).
trditev: MAT-SS-3/racionalne-funkcije#f0-pol
besedilo: »Števec ostaja blizu $-18$, imenovalec pa postaja vedno manjši. Količnik je zato po absolutni vrednosti ogromen. Levo od $-3$ sta števec in imenovalec negativna, zato gre graf v $+\infty$. Desno je imenovalec pozitiven in graf gre v $-\infty$.« -/
theorem f₀_pol : Tendsto (fun x : ℝ => 6 * x) (𝓝 (-3)) (𝓝 (-18)) ∧
    Tendsto f₀ (𝓝[<] (-3)) atTop ∧ Tendsto f₀ (𝓝[>] (-3)) atBot := by
  have h := pol_liha_stopnja' (g := fun x : ℝ => 6 * x) (c := -3) (m := 1) (by fun_prop)
    (by norm_num) odd_one
  have e : (fun x => (fun x : ℝ => 6 * x) x / (x - -3) ^ 1) = f₀ := by
    funext x; simp [f₀, sub_neg_eq_add]
  rw [e] at h
  refine ⟨?_, h⟩
  have : Tendsto (fun x : ℝ => 6 * x) (𝓝 (-3)) (𝓝 (6 * -3)) := (continuous_const.mul continuous_id).tendsto _
  rwa [show (6 : ℝ) * -3 = -18 by norm_num] at this

/-- Razlaga, »Daleč levo in desno«: f(1000) ≈ 5,982 in f(−1000) ≈ 6,018 (na tri decimalke).
trditev: MAT-SS-3/racionalne-funkcije#f0-dalec
besedilo: »$f(1000) \approx 5{,}982$ in $f(-1000) \approx 6{,}018$.« -/
theorem f₀_daleč : |f₀ 1000 - 5982 / 1000| < 5 / 10000 ∧ |f₀ (-1000) - 6018 / 1000| < 5 / 10000 := by
  unfold f₀; constructor <;> rw [abs_lt] <;> constructor <;> norm_num

/-- Razlaga: deljenje števca in imenovalca z x da f(x) = 6/(1 + 3/x) (x ≠ 0, x ≠ −3).
trditev: MAT-SS-3/racionalne-funkcije#f0-deljeno
besedilo: »Razlog vidiš, če števec in imenovalec delimo z $x$: $f(x) = \dfrac{6}{1 + \frac{3}{x}}$.« -/
theorem f₀_deljeno (x : ℝ) (hx : x ≠ 0) (hx3 : x ≠ -3) : f₀ x = 6 / (1 + 3 / x) := by
  have : x + 3 ≠ 0 := (f₀_definicija x).2 hx3
  unfold f₀; field_simp

/-- Predpostavke `f₀_deljeno` se dajo izpolniti (x = 1). -/
example : f₀ 1 = 6 / (1 + 3 / 1) := f₀_deljeno 1 one_ne_zero (by norm_num)

/-- Razlaga: y = 6 je vodoravna asimptota (f → 6 v +∞ in v −∞); desno od −3 je graf pod njo, levo nad
njo (»desno se ji bliža od spodaj, levo od zgoraj«).
trditev: MAT-SS-3/racionalne-funkcije#f0-asimptota
besedilo: »Premica $y = 6$ je **vodoravna asimptota**. Desno se ji graf bliža od spodaj, levo od zgoraj.« -/
theorem f₀_asimptota : Tendsto f₀ atTop (𝓝 6) ∧ Tendsto f₀ atBot (𝓝 6) ∧
    (∀ x, -3 < x → f₀ x < 6) ∧ (∀ x, x < -3 → 6 < f₀ x) := by
  refine ⟨?_, ?_, fun x hx => ?_, fun x hx => ?_⟩
  rotate_left 2
  · unfold f₀; rw [div_lt_iff₀ (by linarith)]; linarith
  · unfold f₀; rw [lt_div_iff_of_neg (by linarith)]; linarith
  all_goals
    have h := asimptota_inv (f := f₀) (L := 6) (R := fun t => 6 / (1 + 3 * t)) 10
      (by fun_prop (disch := norm_num)) (by norm_num) (by
        intro x hx
        have hx0 : x ≠ 0 := by rintro rfl; norm_num at hx
        have hx3 : x + 3 ≠ 0 := by rcases lt_abs.mp hx with h | h <;> intro e <;> linarith
        unfold f₀; field_simp)
  · exact h.1
  · exact h.2

/-! ## Razlaga: premisli, racionalne enačbe -/

/-- Razlaga, premisli: g(x) = 1/(x − 2)² ima pol sode stopnje 2; obe veji gresta v +∞.
trditev: MAT-SS-3/racionalne-funkcije#premisli-pol-sod
besedilo: »Na obeh straneh gre v $+\infty$. Imenovalec je kvadrat, torej pozitiven in zelo majhen, števec $1$ pa pozitiven.« -/
theorem premisli_pol_sod : Tendsto (fun x : ℝ => 1 / (x - 2) ^ 2) (𝓝[<] 2) atTop ∧
    Tendsto (fun x : ℝ => 1 / (x - 2) ^ 2) (𝓝[>] 2) atTop :=
  pol_soda_stopnja (g := fun _ => 1) continuousAt_const one_pos even_two (by norm_num)

/-- Razlaga, premisli: h(x) = (2x² − 2x)/(x² + 1) ima asimptoto y = 2 (enaki stopnji, 2/1), graf pa jo
seka pri x = −1: h(−1) = (2 + 2)/(1 + 1) = 2.
trditev: MAT-SS-3/racionalne-funkcije#premisli-seka
besedilo: »Lahko. Asimptota je $y = 2$ (enaki stopnji, $\frac{2}{1}$), in $h(-1) = \frac{2 + 2}{1 + 1} = 2$.« -/
theorem premisli_seka :
    Tendsto (fun x : ℝ => (2 * x ^ 2 - 2 * x) / (x ^ 2 + 1)) atTop (𝓝 2) ∧
    Tendsto (fun x : ℝ => (2 * x ^ 2 - 2 * x) / (x ^ 2 + 1)) atBot (𝓝 2) ∧
    (2 * (-1 : ℝ) ^ 2 - 2 * (-1)) / ((-1) ^ 2 + 1) = 2 := by
  refine ⟨?_, ?_, ?_⟩
  rotate_left 2
  · calc (2 * (-1 : ℝ) ^ 2 - 2 * (-1)) / ((-1) ^ 2 + 1) = (2 + 2) / (1 + 1) := by norm_num
      _ = 2 := by norm_num
  all_goals
    have h := asimptota_inv (f := fun x : ℝ => (2 * x ^ 2 - 2 * x) / (x ^ 2 + 1)) (L := 2)
      (R := fun t => (2 - 2 * t) / (1 + t ^ 2)) 10 (by fun_prop (disch := positivity))
      (by norm_num) (by
        intro x hx
        have hx0 : x ≠ 0 := by rintro rfl; norm_num at hx
        have h1 : x ^ 2 + 1 ≠ 0 := by positivity
        field_simp)
  · exact h.1
  · exact h.2

/-- Razlaga, racionalne enačbe: 6v/(v + 3) = 5 s pogojem v ≠ −3 ima natanko rešitev v = 15
(koraki 6v = 5(v + 3) = 5v + 15, v = 15).
trditev: MAT-SS-3/racionalne-funkcije#enacba-sestop
besedilo: »Sestopiti moraš s hitrostjo $15\,\mathrm{km/h}$.« -/
theorem enacba_sestop (v : ℝ) : (v ≠ -3 ∧ 6 * v / (v + 3) = 5) ↔ v = 15 := by
  constructor
  · rintro ⟨hv, h⟩
    have h3 : v + 3 ≠ 0 := (f₀_definicija v).2 hv
    have h1 : 6 * v = 5 * v + 15 := by
      calc 6 * v = 5 * (v + 3) := by rw [div_eq_iff h3] at h; exact h
        _ = 5 * v + 15 := by ring
    linarith
  · rintro rfl; norm_num

/-- Razlaga, preizkus: 15 ≠ −3 in 6·15/18 = 5.
trditev: MAT-SS-3/racionalne-funkcije#enacba-sestop-preizkus
besedilo: »Število $15$ ustreza pogoju $v \ne -3$. Res: $\frac{6 \cdot 15}{18} = 5$.« -/
theorem enacba_sestop_preizkus : (15 : ℝ) ≠ -3 ∧ 6 * (15 : ℝ) / 18 = 5 := by norm_num

/-- Razlaga, »Zakaj je preizkus nujen«: pri imenovalcu b ≠ 0 je a/b = c/b natanko tedaj, ko a = c
(pomnožena enačba ima vse rešitve prvotne).
trditev: MAT-SS-3/racionalne-funkcije#mnozenje-ohrani
besedilo: »Pomnožena enačba ima vse rešitve prvotne, lahko pa še kakšno več.« -/
theorem mnozenje_ohrani (a b c : ℝ) (hb : b ≠ 0) : a / b = c / b ↔ a = c := div_left_inj₀ hb

/-- Predpostavka `mnozenje_ohrani` se da izpolniti (b = 1). -/
example : (1 : ℝ) / 1 = 1 / 1 ↔ (1 : ℝ) = 1 := mnozenje_ohrani 1 1 1 one_ne_zero

/-- Razlaga, navidezna rešitev: x/(x − 2) = 2/(x − 2) s pogojem x ≠ 2 nima rešitve (pomnožena enačba
x = 2 ima rešitev, ki jo pogoj prepoveduje).
trditev: MAT-SS-3/racionalne-funkcije#enacba-navidezna
besedilo: »Primer: $\dfrac{x}{x - 2} = \dfrac{2}{x - 2}$, pogoj $x \ne 2$. Po množenju z $x - 2$ dobimo $x = 2$, kar pogoj prepoveduje. Enačba nima rešitve.« -/
theorem enacba_navidezna (x : ℝ) : (x ≠ 2 ∧ x / (x - 2) = 2 / (x - 2)) ↔ False := by
  constructor
  · rintro ⟨hx, h⟩
    have h2 : x - 2 ≠ 0 := sub_ne_zero.2 hx
    have : x = 2 := (mnozenje_ohrani x _ 2 h2).1 h
    exact hx this
  · exact False.elim

/-- Razlaga: pomnožena enačba x = 2 ima rešitev 2, ki je ničla imenovalca x − 2.
trditev: MAT-SS-3/racionalne-funkcije#navidezna-kandidat
besedilo: »Po množenju z $x - 2$ dobimo $x = 2$, kar pogoj prepoveduje.« -/
theorem navidezna_kandidat : (2 : ℝ) - 2 = 0 := by norm_num

/-- Razlaga: razlika x/(x − 2) − 2/(x − 2) = (x − 2)/(x − 2) je za x ≠ 2 enaka 1 (premica y = 1 z luknjo
pri x = 2, ki osi x ne seka).
trditev: MAT-SS-3/racionalne-funkcije#navidezna-razlika
besedilo: »Na grafu vidiš isto: razlika leve in desne strani je $\frac{x - 2}{x - 2}$, torej premica $y = 1$ z luknjo pri $x = 2$, ki osi $x$ nikjer ne seka.« -/
theorem navidezna_razlika (x : ℝ) (hx : x ≠ 2) :
    x / (x - 2) - 2 / (x - 2) = (x - 2) / (x - 2) ∧ (x - 2) / (x - 2) = 1 := by
  have h2 : x - 2 ≠ 0 := sub_ne_zero.2 hx
  exact ⟨by ring, div_self h2⟩

/-- Predpostavka `navidezna_razlika` se da izpolniti (x = 3). -/
example : (3 : ℝ) / (3 - 2) - 2 / (3 - 2) = (3 - 2) / (3 - 2) ∧ ((3 : ℝ) - 2) / (3 - 2) = 1 :=
  navidezna_razlika 3 (by norm_num)

/-- Razlaga, uganka: 6v/(v + 3) = 6 s pogojem v ≠ −3 nima rešitve (6v = 6v + 18, torej 0 = 18).
trditev: MAT-SS-3/racionalne-funkcije#enacba-uganka
besedilo: »Iz $\dfrac{6v}{v + 3} = 6$ po množenju dobimo $6v = 6v + 18$, torej $0 = 18$. To ne velja za noben $v$« -/
theorem enacba_uganka (v : ℝ) : (v ≠ -3 ∧ 6 * v / (v + 3) = 6) ↔ False := by
  constructor
  · rintro ⟨hv, h⟩
    have h3 : v + 3 ≠ 0 := (f₀_definicija v).2 hv
    have h1 : 6 * v = 6 * v + 18 := by
      calc 6 * v = 6 * (v + 3) := by rw [div_eq_iff h3] at h; exact h
        _ = 6 * v + 18 := by ring
    have : (0 : ℝ) = 18 := by linarith
    norm_num at this
  · exact False.elim

/-! ## Primer 1: f(x) = (2x − 4)/(x + 1) -/

/-- Primer 1: f(x) = (2x − 4)/(x + 1). -/
noncomputable def f₁ (x : ℝ) : ℝ := (2 * x - 4) / (x + 1)

/-- Primer 1, korak 1–2: x + 1 ≠ 0 ↔ x ≠ −1; števec je 2(x − 2).
trditev: MAT-SS-3/racionalne-funkcije#f1-korak12
besedilo: »Imenovalec: $x + 1 \ne 0$, torej $x \ne -1$; $D_f = \mathbb{R} \setminus \{-1\}$.« -/
theorem f₁_korak12 (x : ℝ) : (x + 1 ≠ 0 ↔ x ≠ -1) ∧ 2 * x - 4 = 2 * (x - 2) := by
  refine ⟨by constructor <;> intro h e <;> apply h <;> linarith, by ring⟩

/-- Primer 1, korak 3: za x ≠ −1 je f(x) = 0 natanko pri x = 2.
trditev: MAT-SS-3/racionalne-funkcije#f1-nicla
besedilo: »Ničla: $2x - 4 = 0$, $x = 2$.« -/
theorem f₁_nicla (x : ℝ) (hx : x ≠ -1) : f₁ x = 0 ↔ x = 2 := by
  have : x + 1 ≠ 0 := ((f₁_korak12 x).1).2 hx
  rw [f₁, nicle_iz_stevca _ _ this]; constructor <;> intro h <;> linarith

/-- Predpostavka `f₁_nicla` se da izpolniti (x = 2). -/
example : f₁ 2 = 0 ↔ (2 : ℝ) = 2 := f₁_nicla 2 (by norm_num)

/-- Primer 1, koraka 3 in 6: pol x = −1 stopnje 1: levo +∞, desno −∞ (števec tam −6 < 0).
trditev: MAT-SS-3/racionalne-funkcije#f1-pol
besedilo: »Ob polu: $f(-1{,}1) = 62$, $f(-0{,}9) = -58$, torej levo $+\infty$, desno $-\infty$.« -/
theorem f₁_pol : Tendsto f₁ (𝓝[<] (-1)) atTop ∧ Tendsto f₁ (𝓝[>] (-1)) atBot := by
  have h := pol_liha_stopnja' (g := fun x : ℝ => 2 * x - 4) (c := -1) (m := 1) (by fun_prop)
    (by norm_num) odd_one
  have e : (fun x => (fun x : ℝ => 2 * x - 4) x / (x - -1) ^ 1) = f₁ := by
    funext x; simp [f₁, sub_neg_eq_add]
  rwa [e] at h

/-- Primer 1, korak 4: vodoravna asimptota y = 2 (vodilna koeficienta 2 in 1).
trditev: MAT-SS-3/racionalne-funkcije#f1-asimptota
besedilo: »Stopnji števca in imenovalca sta obe $1$, vodilna koeficienta $2$ in $1$: vodoravna asimptota $y = 2$.« -/
theorem f₁_asimptota : Tendsto f₁ atTop (𝓝 2) ∧ Tendsto f₁ atBot (𝓝 2) :=
  asimptota_inv (R := fun t => (2 - 4 * t) / (1 + t)) 10 (by fun_prop (disch := norm_num))
    (by norm_num) (by
      intro x hx
      have hx0 : x ≠ 0 := by rintro rfl; norm_num at hx
      have hx1 : x + 1 ≠ 0 := by rcases lt_abs.mp hx with h | h <;> intro e <;> linarith
      unfold f₁; field_simp)

/-- Primer 1, korak 5: f(0) = −4/1 = −4.
trditev: MAT-SS-3/racionalne-funkcije#f1-0
besedilo: »$f(0) = \dfrac{-4}{1} = -4$« -/
theorem f₁_0 : f₁ 0 = -4 := by
  calc f₁ 0 = -4 / 1 := by unfold f₁; norm_num
    _ = -4 := by norm_num

/-- Primer 1, korak 6: predznaki (x < −1: +, −1 < x < 2: −, x > 2: +) in f(−1,1) = 62, f(−0,9) = −58.
trditev: MAT-SS-3/racionalne-funkcije#f1-predznaki
besedilo: »Predznaki: za $x < -1$ pozitiven, med $-1$ in $2$ negativen, za $x > 2$ pozitiven. Ob polu: $f(-1{,}1) = 62$, $f(-0{,}9) = -58$, torej levo $+\infty$, desno $-\infty$.« -/
theorem f₁_predznaki : (∀ x, x < -1 → 0 < f₁ x) ∧ (∀ x, -1 < x → x < 2 → f₁ x < 0) ∧
    (∀ x, 2 < x → 0 < f₁ x) ∧ f₁ (-11 / 10) = 62 ∧ f₁ (-9 / 10) = -58 := by
  refine ⟨fun x hx => div_pos_of_neg_of_neg (by linarith) (by linarith),
    fun x h1 h2 => div_neg_of_neg_of_pos (by linarith) (by linarith),
    fun x hx => div_pos (by linarith) (by linarith), by unfold f₁; norm_num, by unfold f₁; norm_num⟩

/-- Primer 1, korak 7: leva veja leži nad y = 2, desna pod njo; desna gre skozi (0, −4) in (2, 0).
trditev: MAT-SS-3/racionalne-funkcije#f1-veji
besedilo: »Odgovor: leva veja leži nad $y = 2$ in se ob $x = -1$ dviga v $+\infty$. Desna veja pride iz $-\infty$, gre skozi $(0, -4)$ in $(2, 0)$ ter se od spodaj bliža premici $y = 2$.« -/
theorem f₁_veji : (∀ x, x < -1 → 2 < f₁ x) ∧ (∀ x, -1 < x → f₁ x < 2) ∧ f₁ 0 = -4 ∧ f₁ 2 = 0 := by
  refine ⟨fun x hx => ?_, fun x hx => ?_, f₁_0, by unfold f₁; norm_num⟩
  · unfold f₁; rw [lt_div_iff_of_neg (by linarith)]; linarith
  · unfold f₁; rw [div_lt_iff₀ (by linarith)]; linarith

/-! ## Primer 2: f(x) = (x² − 4)/(x² − x − 2) -/

/-- Primer 2: f(x) = (x² − 4)/(x² − x − 2). -/
noncomputable def f₂ (x : ℝ) : ℝ := (x ^ 2 - 4) / (x ^ 2 - x - 2)

/-- Primer 2, korak 1: razcep x² − 4 = (x − 2)(x + 2), x² − x − 2 = (x − 2)(x + 1).
trditev: MAT-SS-3/racionalne-funkcije#f2-razcep
besedilo: »Razcep: $x^2 - 4 = (x - 2)(x + 2)$ in $x^2 - x - 2 = (x - 2)(x + 1)$.« -/
theorem f₂_razcep (x : ℝ) : x ^ 2 - 4 = (x - 2) * (x + 2) ∧ x ^ 2 - x - 2 = (x - 2) * (x + 1) :=
  ⟨by ring, by ring⟩

/-- Primer 2, korak 2: imenovalec je ≠ 0 natanko pri x ≠ 2 in x ≠ −1.
trditev: MAT-SS-3/racionalne-funkcije#f2-definicija
besedilo: »Definicijsko območje: $x \ne 2$ in $x \ne -1$, ker sta to ničli imenovalca.« -/
theorem f₂_definicija (x : ℝ) : x ^ 2 - x - 2 ≠ 0 ↔ x ≠ 2 ∧ x ≠ -1 := by
  rw [(f₂_razcep x).2, mul_ne_zero_iff, sub_ne_zero]
  constructor <;> rintro ⟨h1, h2⟩ <;> refine ⟨h1, fun e => h2 ?_⟩ <;> linarith

/-- Primer 2, korak 3: f(x) = (x + 2)/(x + 1) za x ≠ 2 (in x ≠ −1).
trditev: MAT-SS-3/racionalne-funkcije#f2-okrajsano
besedilo: »$f(x) = \dfrac{x + 2}{x + 1}$ za $x \ne 2$.« -/
theorem f₂_okrajsano (x : ℝ) (h2 : x ≠ 2) (h1 : x ≠ -1) : f₂ x = (x + 2) / (x + 1) := by
  have a : x - 2 ≠ 0 := sub_ne_zero.2 h2
  have b : x + 1 ≠ 0 := fun e => h1 (by linarith)
  unfold f₂; rw [(f₂_razcep x).1, (f₂_razcep x).2, mul_div_mul_left _ _ a]

/-- Predpostavke `f₂_okrajsano` se dajo izpolniti (x = 0). -/
example : f₂ 0 = (0 + 2) / (0 + 1) := f₂_okrajsano 0 (by norm_num) (by norm_num)

/-- Primer 2, korak 3: pri x = 2 je luknja z višino (2 + 2)/(2 + 1) = 4/3 (limita f v 2).
trditev: MAT-SS-3/racionalne-funkcije#f2-luknja
besedilo: »Krajšanje: $f(x) = \dfrac{x + 2}{x + 1}$ za $x \ne 2$. Faktor $(x - 2)$ je izginil, zato je pri $x = 2$ luknja, ne pol. Njena višina je $\frac{2 + 2}{2 + 1} = \frac{4}{3}$.« -/
theorem f₂_luknja : Tendsto f₂ (𝓝[≠] 2) (𝓝 (4 / 3)) := by
  have h : Tendsto f₂ (𝓝[≠] 2) (𝓝 ((fun x : ℝ => (x + 2) / (x + 1)) 2)) := by
    refine (((by fun_prop (disch := norm_num) : ContinuousAt (fun x : ℝ => (x + 2) / (x + 1)) 2)
      ).tendsto.mono_left nhdsWithin_le_nhds).congr' ?_
    have : Ioo (1 : ℝ) 3 ∈ 𝓝 (2 : ℝ) := Ioo_mem_nhds (by norm_num) (by norm_num)
    filter_upwards [self_mem_nhdsWithin, nhdsWithin_le_nhds this] with x hx hx'
    exact (f₂_okrajsano x hx (by intro e; rw [e] at hx'; norm_num at hx')).symm
  have v : (fun x : ℝ => (x + 2) / (x + 1)) 2 = 4 / 3 := by
    show ((2 : ℝ) + 2) / (2 + 1) = 4 / 3; norm_num
  rwa [v] at h

/-- Primer 2, korak 4: ničla x = −2 (pogoji x ≠ 2, x ≠ −1).
trditev: MAT-SS-3/racionalne-funkcije#f2-nicla
besedilo: »Po krajšanju: ničla $x = -2$ (števec), pol $x = -1$ (imenovalec), stopnje $1$.« -/
theorem f₂_nicla (x : ℝ) (h2 : x ≠ 2) (h1 : x ≠ -1) : f₂ x = 0 ↔ x = -2 := by
  have b : x + 1 ≠ 0 := fun e => h1 (by linarith)
  rw [f₂_okrajsano x h2 h1, nicle_iz_stevca _ _ b]; constructor <;> intro h <;> linarith

/-- Predpostavke `f₂_nicla` se dajo izpolniti (x = −2). -/
example : f₂ (-2) = 0 ↔ (-2 : ℝ) = -2 := f₂_nicla (-2) (by norm_num) (by norm_num)

/-- Primer 2, korak 4: pol x = −1 stopnje 1 (števec po krajšanju tam 1 > 0: levo −∞, desno +∞).
trditev: MAT-SS-3/racionalne-funkcije#f2-pol
besedilo: »Po krajšanju: ničla $x = -2$ (števec), pol $x = -1$ (imenovalec), stopnje $1$.« -/
theorem f₂_pol : Tendsto f₂ (𝓝[<] (-1)) atBot ∧ Tendsto f₂ (𝓝[>] (-1)) atTop := by
  have h := pol_liha_stopnja (g := fun x : ℝ => x + 2) (c := -1) (m := 1) (by fun_prop)
    (by norm_num) odd_one
  have ev : ∀ x : ℝ, x ∈ Ioo (-2 : ℝ) 0 → x ≠ -1 →
      (fun x => (fun x : ℝ => x + 2) x / (x - -1) ^ 1) x = f₂ x := by
    intro x hx h1
    rw [f₂_okrajsano x (by intro e; rw [e] at hx; norm_num at hx) h1]; simp [sub_neg_eq_add]
  have hn : Ioo (-2 : ℝ) 0 ∈ 𝓝 (-1 : ℝ) := Ioo_mem_nhds (by norm_num) (by norm_num)
  constructor
  · refine h.1.congr' ?_
    filter_upwards [self_mem_nhdsWithin, nhdsWithin_le_nhds hn] with x hx hx'
    exact ev x hx' (ne_of_lt hx)
  · refine h.2.congr' ?_
    filter_upwards [self_mem_nhdsWithin, nhdsWithin_le_nhds hn] with x hx hx'
    exact ev x hx' (ne_of_gt hx)

/-- Primer 2, korak 5: vodoravna asimptota y = 1 (prvotni stopnji 2, vodilna koeficienta 1 in 1) in
f(0) = 2 (po krajšanju 2/1).
trditev: MAT-SS-3/racionalne-funkcije#f2-asimptota
besedilo: »Prvotni stopnji sta obe $2$, vodilna koeficienta $1$ in $1$: vodoravna asimptota $y = 1$. Še $f(0) = \frac{2}{1} = 2$.« -/
theorem f₂_asimptota : Tendsto f₂ atTop (𝓝 1) ∧ Tendsto f₂ atBot (𝓝 1) ∧ f₂ 0 = 2 := by
  refine ⟨?_, ?_, ?_⟩
  rotate_left 2
  · calc f₂ 0 = (0 + 2) / (0 + 1) := f₂_okrajsano 0 (by norm_num) (by norm_num)
      _ = 2 / 1 := by norm_num
      _ = 2 := by norm_num
  all_goals
    have h := asimptota_inv (f := f₂) (L := 1) (R := fun t => (1 - 4 * t ^ 2) / (1 - t - 2 * t ^ 2)) 10
      (by fun_prop (disch := norm_num)) (by norm_num) (by
        intro x hx
        have hx0 : x ≠ 0 := by rintro rfl; norm_num at hx
        have hq : x ^ 2 - x - 2 ≠ 0 := by
          rcases lt_abs.mp hx with h | h <;> intro e <;> nlinarith
        unfold f₂; field_simp)
  · exact h.1
  · exact h.2

/-! ## Primer 3: čoln proti toku in nazaj -/

/-- Primer 3: skupni čas t(v) = 12/(v − 3) + 12/(v + 3). -/
noncomputable def t₃ (v : ℝ) : ℝ := 12 / (v - 3) + 12 / (v + 3)

/-- Primer 3, korak 2: skupni imenovalec t(v) = (12(v + 3) + 12(v − 3))/((v − 3)(v + 3)) = 24v/(v² − 9)
(v ≠ ±3).
trditev: MAT-SS-3/racionalne-funkcije#t3-skupni
besedilo: »Skupni imenovalec: $t(v) = \dfrac{12(v + 3) + 12(v - 3)}{(v - 3)(v + 3)} = \dfrac{24v}{v^2 - 9}$.« -/
theorem t₃_skupni (v : ℝ) (h1 : v ≠ 3) (h2 : v ≠ -3) :
    t₃ v = 24 * v / (v ^ 2 - 9) := by
  have a : v - 3 ≠ 0 := sub_ne_zero.2 h1
  have b : v + 3 ≠ 0 := fun e => h2 (by linarith)
  calc t₃ v = (12 * (v + 3) + 12 * (v - 3)) / ((v - 3) * (v + 3)) := by
        unfold t₃; field_simp
    _ = 24 * v / (v ^ 2 - 9) := by congr 1 <;> ring

/-- Predpostavke `t₃_skupni` se dajo izpolniti (v = 5). -/
example : t₃ 5 = 24 * 5 / (5 ^ 2 - 9) := t₃_skupni 5 (by norm_num) (by norm_num)

/-- Primer 3, korak 3: pri v tik nad 3 čas raste čez vse meje (pol v = 3); v = −3 je drugi pol.
trditev: MAT-SS-3/racionalne-funkcije#t3-pol
besedilo: »Pola sta $v = 3$ in $v = -3$; smisel ima le $v > 3$. Pri $v$ tik nad $3$ se čoln proti toku komaj premika, zato čas raste čez vse meje.« -/
theorem t₃_pol : Tendsto t₃ (𝓝[>] 3) atTop ∧ (3 : ℝ) ^ 2 - 9 = 0 ∧ (-3 : ℝ) ^ 2 - 9 = 0 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  have h := (pol_liha_stopnja (g := fun v : ℝ => 24 * v / (v + 3)) (c := 3) (m := 1)
    (by fun_prop (disch := norm_num)) (by norm_num) odd_one).2
  refine h.congr' (eventually_nhdsWithin_of_forall fun v hv => ?_)
  have hv : (3 : ℝ) < v := hv
  rw [t₃_skupni v (by linarith) (by linarith)]
  have a : v - 3 ≠ 0 := by linarith
  have b : v + 3 ≠ 0 := by linarith
  have c : v ^ 2 - 9 ≠ 0 := by nlinarith
  field_simp; ring

/-- Primer 3, korak 3: tudi v = −3 je pol (lihe stopnje): levo od −3 gre t(v) v −∞, desno v +∞.
trditev: MAT-SS-3/racionalne-funkcije#t3-pol-minus3
besedilo: »Pola sta $v = 3$ in $v = -3$; smisel ima le $v > 3$.« -/
theorem t₃_pol_minus3 : Tendsto t₃ (𝓝[<] (-3)) atBot ∧ Tendsto t₃ (𝓝[>] (-3)) atTop := by
  have h := pol_liha_stopnja (g := fun v : ℝ => 24 * v / (v - 3)) (c := -3) (m := 1)
    (by fun_prop (disch := norm_num)) (by norm_num) odd_one
  have e : ∀ v : ℝ, v ≠ 3 → v ≠ -3 → (fun v : ℝ => 24 * v / (v - 3)) v / (v - -3) ^ 1 = t₃ v := by
    intro v h1 h2
    rw [t₃_skupni v h1 h2]
    have a : v - 3 ≠ 0 := sub_ne_zero.2 h1
    have b : v + 3 ≠ 0 := fun e => h2 (by linarith)
    have c : v ^ 2 - 9 ≠ 0 := by
      rw [show v ^ 2 - 9 = (v - 3) * (v + 3) by ring]; exact mul_ne_zero a b
    rw [sub_neg_eq_add, pow_one]
    field_simp; ring
  constructor
  · refine h.1.congr' (eventually_nhdsWithin_of_forall fun v hv => ?_)
    have hv : v < -3 := hv
    exact e v (by linarith) (by linarith)
  · have h3 : ∀ᶠ v in 𝓝[>] (-3 : ℝ), v < 3 :=
      nhdsWithin_le_nhds (Iio_mem_nhds (by norm_num : (-3 : ℝ) < 3))
    refine h.2.congr' ?_
    filter_upwards [h3, self_mem_nhdsWithin] with v hv hv'
    have hv' : -3 < v := hv'
    exact e v (by linarith) (by linarith)

/-- Primer 3, korak 4: asimptota t = 0 (števec nižje stopnje; dokazano za v → +∞, saj je v Primeru v > 3)
in t(5) = 120/16 = 7,5 h.
trditev: MAT-SS-3/racionalne-funkcije#t3-asimptota
besedilo: »Števec ima nižjo stopnjo kot imenovalec, asimptota je $t = 0$: zelo hiter čoln porabi zelo malo časa. Za primer $t(5) = \dfrac{120}{16} = 7{,}5\,\mathrm{h}$.« -/
theorem t₃_asimptota : Tendsto t₃ atTop (𝓝 0) ∧ t₃ 5 = 120 / 16 ∧ (120 : ℝ) / 16 = 15 / 2 := by
  refine ⟨?_, ?_, by norm_num⟩
  · refine (asimptota_inv (f := fun v : ℝ => 24 * v / (v ^ 2 - 9)) (R := fun t => 24 * t / (1 - 9 * t ^ 2))
      10 (by fun_prop (disch := norm_num)) (by norm_num) (by
        intro x hx
        have hx0 : x ≠ 0 := by rintro rfl; norm_num at hx
        have hq : x ^ 2 - 9 ≠ 0 := by rcases lt_abs.mp hx with h | h <;> intro e <;> nlinarith
        field_simp)).1.congr' ?_
    filter_upwards [eventually_gt_atTop 3] with v hv
    exact (t₃_skupni v (by linarith) (by linarith)).symm
  · rw [t₃_skupni 5 (by norm_num) (by norm_num)]; norm_num

/-- Primer 3, korak 5 in premisli: 24v/(v² − 9) = 3 s pogojema v ≠ ±3 ↔ v = 9 ali v = −1
(24v = 3v² − 27, v² − 8v − 9 = 0, (v − 9)(v + 1) = 0).
trditev: MAT-SS-3/racionalne-funkcije#t3-enacba
besedilo: »$v^2 - 8v - 9 = (v - 9)(v + 1) = 0$, torej $v = 9$ ali $v = -1$.« -/
theorem t₃_enacba (v : ℝ) : (v ≠ 3 ∧ v ≠ -3 ∧ 24 * v / (v ^ 2 - 9) = 3) ↔ (v = 9 ∨ v = -1) := by
  constructor
  · rintro ⟨h1, h2, h⟩
    have hq : v ^ 2 - 9 ≠ 0 := by
      intro e
      have : (v - 3) * (v + 3) = 0 := by linear_combination e
      rcases mul_eq_zero.1 this with e | e
      · exact h1 (by linarith)
      · exact h2 (by linarith)
    have k5 : 24 * v = 3 * v ^ 2 - 27 := by
      calc 24 * v = 3 * (v ^ 2 - 9) := by rw [div_eq_iff hq] at h; exact h
        _ = 3 * v ^ 2 - 27 := by ring
    have k6 : v ^ 2 - 8 * v - 9 = 0 := by linarith
    have k7 : (v - 9) * (v + 1) = 0 := by linear_combination k6
    rcases mul_eq_zero.1 k7 with e | e
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Primer 3, premisli: hitrost mora biti večja od 3 km/h, zato je v = 9; preizkus t(9) = 216/72 = 3.
trditev: MAT-SS-3/racionalne-funkcije#t3-odgovor
besedilo: »Hitrost mora biti večja od $3\,\mathrm{km/h}$, zato je $v = 9\,\mathrm{km/h}$. Preizkus: $t(9) = \dfrac{216}{72} = 3\,\mathrm{h}$.« -/
theorem t₃_odgovor (v : ℝ) : (3 < v ∧ t₃ v = 3) ↔ v = 9 := by
  constructor
  · rintro ⟨hv, h⟩
    rw [t₃_skupni v (by linarith) (by linarith)] at h
    rcases (t₃_enacba v).1 ⟨by linarith, by linarith, h⟩ with e | e
    · exact e
    · linarith
  · rintro rfl
    refine ⟨by norm_num, ?_⟩
    calc t₃ 9 = 24 * 9 / (9 ^ 2 - 9) := t₃_skupni 9 (by norm_num) (by norm_num)
      _ = 216 / 72 := by norm_num
      _ = 3 := by norm_num

/-! ## Primer 4: enačba z navidezno rešitvijo -/

/-- Primer 4: x/(x − 1) − 2/(x + 1) = 4/(x² − 1) s pogojema x ≠ 1, x ≠ −1 ima natanko rešitev x = 2
(koraki: x(x + 1) − 2(x − 1) = 4; x² + x − 2x + 2 = 4; x² − x − 2 = 0; (x − 2)(x + 1) = 0; x = −1 je
navidezna).
trditev: MAT-SS-3/racionalne-funkcije#primer4
besedilo: »Odgovor: enačba ima eno rešitev, $x = 2$.« -/
theorem primer4 (x : ℝ) :
    (x ≠ 1 ∧ x ≠ -1 ∧ x / (x - 1) - 2 / (x + 1) = 4 / (x ^ 2 - 1)) ↔ x = 2 := by
  constructor
  · rintro ⟨h1, h2, h⟩
    have a : x - 1 ≠ 0 := sub_ne_zero.2 h1
    have b : x + 1 ≠ 0 := fun e => h2 (by linarith)
    have r : x ^ 2 - 1 = (x - 1) * (x + 1) := by ring
    rw [r] at h
    have k3 : x * (x + 1) - 2 * (x - 1) = 4 := by
      field_simp at h; linarith
    have k4 : x ^ 2 + x - 2 * x + 2 = 4 := by linarith
    have k4' : x ^ 2 - x - 2 = 0 := by linarith
    have k5 : (x - 2) * (x + 1) = 0 := by linear_combination k4'
    rcases mul_eq_zero.1 k5 with e | e
    · linarith
    · exact absurd e b
  · rintro rfl
    refine ⟨by norm_num, by norm_num, ?_⟩
    calc (2 : ℝ) / (2 - 1) - 2 / (2 + 1) = 2 / 1 - 2 / 3 := by norm_num
      _ = 4 / 3 := by norm_num
      _ = 4 / (2 ^ 2 - 1) := by norm_num

/-- Primer 4, korak 1 in 5: x² − 1 = (x − 1)(x + 1), x² − x − 2 = (x − 2)(x + 1) ima rešitvi −1 in 2
(RACUN: resi x^2-x-2=0).
trditev: MAT-SS-3/racionalne-funkcije#primer4-kvadratna
besedilo: »Razcep: $(x - 2)(x + 1) = 0$, kandidata sta $x = 2$ in $x = -1$.« -/
theorem primer4_kvadratna (x : ℝ) : x ^ 2 - 1 = (x - 1) * (x + 1) ∧
    (x ^ 2 - x - 2 = 0 ↔ x = -1 ∨ x = 2) := by
  refine ⟨by ring, ?_⟩
  have : x ^ 2 - x - 2 = (x - 2) * (x + 1) := by ring
  rw [this, mul_eq_zero]
  constructor
  · rintro (e | e)
    · right; linarith
    · left; linarith
  · rintro (e | e)
    · right; linarith
    · left; linarith

/-! ## Pogoste napake -/

/-- Pogoste napake: (x − 5)/(x + 2) ima ničlo 5 (za x ≠ −2) in pol −2 (levo +∞, desno −∞).
trditev: MAT-SS-3/racionalne-funkcije#napaka-pol-nicla
besedilo: »Ničle dá števec, pole imenovalec: ničla je $5$, pol $-2$.« -/
theorem napaka_pol_nicla :
    (∀ x : ℝ, x ≠ -2 → ((x - 5) / (x + 2) = 0 ↔ x = 5)) ∧
    Tendsto (fun x : ℝ => (x - 5) / (x + 2)) (𝓝[<] (-2)) atTop ∧
    Tendsto (fun x : ℝ => (x - 5) / (x + 2)) (𝓝[>] (-2)) atBot := by
  refine ⟨fun x hx => ?_, ?_⟩
  · have : x + 2 ≠ 0 := fun e => hx (by linarith)
    rw [nicle_iz_stevca _ _ this]; constructor <;> intro h <;> linarith
  · have h := pol_liha_stopnja' (g := fun x : ℝ => x - 5) (c := -2) (m := 1) (by fun_prop)
      (by norm_num) odd_one
    have e : (fun x => (fun x : ℝ => x - 5) x / (x - -2) ^ 1) = fun x : ℝ => (x - 5) / (x + 2) := by
      funext x; simp [sub_neg_eq_add]
    rwa [e] at h

/-- Pogoste napake: asimptota (3x + 1)/(x − 2) je y = 3 (vodilna koeficienta), ne −1/2 in ne 0.
trditev: MAT-SS-3/racionalne-funkcije#napaka-asimptota
besedilo: »Pri $\dfrac{3x + 1}{x - 2}$ asimptota ni $y = -\frac{1}{2}$ (prosta člena) in ne $y = 0$, ampak $y = 3$.« -/
theorem napaka_asimptota : Tendsto (fun x : ℝ => (3 * x + 1) / (x - 2)) atTop (𝓝 3) ∧
    Tendsto (fun x : ℝ => (3 * x + 1) / (x - 2)) atBot (𝓝 3) :=
  asimptota_inv (R := fun t => (3 + t) / (1 - 2 * t)) 10 (by fun_prop (disch := norm_num))
    (by norm_num) (by
      intro x hx
      have hx0 : x ≠ 0 := by rintro rfl; norm_num at hx
      have hx1 : x - 2 ≠ 0 := by rcases lt_abs.mp hx with h | h <;> intro e <;> linarith
      field_simp)

/-! ## Za maturo -/

/-- Naloga 1, korak 1: števec v x = 1 je 1 − 3 + 4 = 2 ≠ 0, imenovalec 0.
trditev: MAT-SS-3/racionalne-funkcije#matura1-korak1
besedilo: »Imenovalec je enak $0$ pri $x = 1$. Števec tam ni $0$, saj je $1 - 3 + 4 = 2$« -/
theorem matura1_korak1 : (1 : ℝ) ^ 2 - 3 * 1 + 4 = 1 - 3 + 4 ∧ (1 : ℝ) - 3 + 4 = 2 ∧ (1 : ℝ) - 1 = 0 := by
  norm_num

/-- Naloga 1, korak 1: x = 1 je pol (navpična asimptota x = 1): levo −∞, desno +∞.
trditev: MAT-SS-3/racionalne-funkcije#matura1-pol
besedilo: »Števec tam ni $0$, saj je $1 - 3 + 4 = 2$, zato je $x = 1$ pol in premica $x = 1$ navpična asimptota.« -/
theorem matura1_pol : Tendsto (fun x : ℝ => (x ^ 2 - 3 * x + 4) / (x - 1)) (𝓝[<] 1) atBot ∧
    Tendsto (fun x : ℝ => (x ^ 2 - 3 * x + 4) / (x - 1)) (𝓝[>] 1) atTop := by
  have h := pol_liha_stopnja (g := fun x : ℝ => x ^ 2 - 3 * x + 4) (c := 1) (m := 1) (by fun_prop)
    (by norm_num) odd_one
  simpa using h

/-- Naloga 1, korak 2 (RACUN enako): x² − 3x + 4 = (x − 1)(x − 2) + 2, zato
f(x) = x − 2 + 2/(x − 1) za x ≠ 1.
trditev: MAT-SS-3/racionalne-funkcije#matura1-deljenje
besedilo: »Števec delimo z imenovalcem: količnik je $x - 2$, ostanek $2$, saj je $x^2 - 3x + 4 = (x - 1)(x - 2) + 2$. Torej je $f(x) = x - 2 + \dfrac{2}{x - 1}$.« -/
theorem matura1_deljenje (x : ℝ) (hx : x ≠ 1) : x ^ 2 - 3 * x + 4 = (x - 1) * (x - 2) + 2 ∧
    (x ^ 2 - 3 * x + 4) / (x - 1) = x - 2 + 2 / (x - 1) := by
  have h1 : x - 1 ≠ 0 := sub_ne_zero.2 hx
  have e : x ^ 2 - 3 * x + 4 = (x - 1) * (x - 2) + 2 := by ring
  exact ⟨e, deljenje _ _ _ _ e h1⟩

/-- Predpostavka `matura1_deljenje` se da izpolniti (x = 0). -/
example : (0 : ℝ) ^ 2 - 3 * 0 + 4 = (0 - 1) * (0 - 2) + 2 ∧
    ((0 : ℝ) ^ 2 - 3 * 0 + 4) / (0 - 1) = 0 - 2 + 2 / (0 - 1) := matura1_deljenje 0 (by norm_num)

/-- Naloga 1, korak 3 (RACUN limita): razlika f(x) − (x − 2) = 2/(x − 1) gre proti 0 v ±∞: poševna
asimptota y = x − 2.
trditev: MAT-SS-3/racionalne-funkcije#matura1-posevna
besedilo: »Ulomek $\dfrac{2}{x - 1}$ gre za velike $|x|$ proti $0$, zato se graf bliža premici $y = x - 2$. Asimptota je poševna, ker je stopnja števca za $1$ višja od stopnje imenovalca.« -/
theorem matura1_posevna :
    Tendsto (fun x : ℝ => (x ^ 2 - 3 * x + 4) / (x - 1) - (x - 2)) atTop (𝓝 0) ∧
    Tendsto (fun x : ℝ => (x ^ 2 - 3 * x + 4) / (x - 1) - (x - 2)) atBot (𝓝 0) :=
  asimptota_inv (R := fun t => 2 * t / (1 - t)) 10 (by fun_prop (disch := norm_num)) (by norm_num) (by
    intro x hx
    have hx0 : x ≠ 0 := by rintro rfl; norm_num at hx
    have hx1 : x - 1 ≠ 0 := by rcases lt_abs.mp hx with h | h <;> intro e <;> linarith
    field_simp; ring)

/-- Naloga 2: f(x) = (x² − 4x + 3)/(x² − 2x). -/
noncomputable def g₂ (x : ℝ) : ℝ := (x ^ 2 - 4 * x + 3) / (x ^ 2 - 2 * x)

/-- Naloga 2 a) (RACUN enako, resi): razcepa (x − 1)(x − 3) in x(x − 2); f = (x − 1)(x − 3)/(x(x − 2));
ničli števca 1 in 3, ničli imenovalca 0 in 2.
trditev: MAT-SS-3/racionalne-funkcije#matura2-razcep
besedilo: »a) Razcepimo: $x^2 - 4x + 3 = (x - 1)(x - 3)$ in $x^2 - 2x = x(x - 2)$.« -/
theorem matura2_razcep (x : ℝ) : x ^ 2 - 4 * x + 3 = (x - 1) * (x - 3) ∧ x ^ 2 - 2 * x = x * (x - 2) ∧
    g₂ x = (x - 1) * (x - 3) / (x * (x - 2)) ∧
    (x ^ 2 - 4 * x + 3 = 0 ↔ x = 1 ∨ x = 3) ∧ (x ^ 2 - 2 * x = 0 ↔ x = 0 ∨ x = 2) := by
  have e1 : x ^ 2 - 4 * x + 3 = (x - 1) * (x - 3) := by ring
  have e2 : x ^ 2 - 2 * x = x * (x - 2) := by ring
  refine ⟨e1, e2, by rw [g₂, e1, e2], ?_, ?_⟩
  · rw [e1, mul_eq_zero, sub_eq_zero, sub_eq_zero]
  · rw [e2, mul_eq_zero, sub_eq_zero]

/-- Naloga 2 a): D_f = ℝ ∖ {0, 2}; v D_f sta ničli 1 in 3.
trditev: MAT-SS-3/racionalne-funkcije#matura2-nicle
besedilo: »Imenovalec je $0$ pri $x = 0$ in $x = 2$, zato je $D_f = \mathbb{R} \setminus \{0, 2\}$. Ničli sta $x = 1$ in $x = 3$« -/
theorem matura2_nicle (x : ℝ) : (x ^ 2 - 2 * x ≠ 0 ↔ x ≠ 0 ∧ x ≠ 2) ∧
    (x ^ 2 - 2 * x ≠ 0 → (g₂ x = 0 ↔ x = 1 ∨ x = 3)) := by
  refine ⟨by rw [ne_eq, (matura2_razcep x).2.2.2.2]; tauto, fun h => ?_⟩
  rw [g₂, nicle_iz_stevca _ _ h, (matura2_razcep x).2.2.2.1]

/-- Naloga 2 b) in d): pola 0 in 2 sta lihe stopnje; ob 0: levo +∞, desno −∞; ob 2: levo +∞, desno −∞.
trditev: MAT-SS-3/racionalne-funkcije#matura2-pola
besedilo: »d) Oba pola sta lihe stopnje, zato graf ob vsakem zamenja predznak.« -/
theorem matura2_pola : Tendsto g₂ (𝓝[<] 0) atTop ∧ Tendsto g₂ (𝓝[>] 0) atBot ∧
    Tendsto g₂ (𝓝[<] 2) atTop ∧ Tendsto g₂ (𝓝[>] 2) atBot := by
  have h0 := pol_liha_stopnja' (g := fun x : ℝ => (x ^ 2 - 4 * x + 3) / (x - 2)) (c := 0) (m := 1)
    (by fun_prop (disch := norm_num)) (by norm_num) odd_one
  have h2 := pol_liha_stopnja' (g := fun x : ℝ => (x ^ 2 - 4 * x + 3) / x) (c := 2) (m := 1)
    (by fun_prop (disch := norm_num)) (by norm_num) odd_one
  have e0 : (fun x => (fun x : ℝ => (x ^ 2 - 4 * x + 3) / (x - 2)) x / (x - 0) ^ 1) = g₂ := by
    funext x; simp only [g₂, sub_zero, pow_one, div_div]; congr 1; ring
  have e2 : (fun x => (fun x : ℝ => (x ^ 2 - 4 * x + 3) / x) x / (x - 2) ^ 1) = g₂ := by
    funext x; simp only [g₂, pow_one, div_div]; congr 1; ring
  rw [e0] at h0; rw [e2] at h2
  exact ⟨h0.1, h0.2, h2.1, h2.2⟩

/-- Naloga 2 b): vodoravna asimptota y = 1/1 = 1 (RACUN limita).
trditev: MAT-SS-3/racionalne-funkcije#matura2-asimptota
besedilo: »Števec in imenovalec imata stopnjo $2$ in vodilna koeficienta $1$ in $1$, zato je vodoravna asimptota $y = \frac{1}{1} = 1$.« -/
theorem matura2_asimptota : Tendsto g₂ atTop (𝓝 1) ∧ Tendsto g₂ atBot (𝓝 1) :=
  asimptota_inv (R := fun t => (1 - 4 * t + 3 * t ^ 2) / (1 - 2 * t)) 10
    (by fun_prop (disch := norm_num)) (by norm_num) (by
      intro x hx
      have hx0 : x ≠ 0 := by rintro rfl; norm_num at hx
      have hx2 : x - 2 ≠ 0 := by rcases lt_abs.mp hx with h | h <;> intro e <;> linarith
      have hq : x ^ 2 - 2 * x ≠ 0 := by rw [(matura2_razcep x).2.1]; exact mul_ne_zero hx0 hx2
      unfold g₂; field_simp)

/-- Naloga 2 c) (RACUN resi): f(x) = 1 v D_f ↔ x = 3/2 (koraka x² − 4x + 3 = x² − 2x, −2x = −3).
trditev: MAT-SS-3/racionalne-funkcije#matura2-presecisce
besedilo: »c) Kvadratna člena se odštejeta: $-2x = -3$, torej $x = \frac{3}{2}$. To število je v $D_f$, zato je presečišče $\left(\frac{3}{2}, 1\right)$.« -/
theorem matura2_presecisce (x : ℝ) : (x ^ 2 - 2 * x ≠ 0 ∧ g₂ x = 1) ↔ x = 3 / 2 := by
  constructor
  · rintro ⟨h, e⟩
    have k4 : x ^ 2 - 4 * x + 3 = x ^ 2 - 2 * x := by
      unfold g₂ at e; rw [div_eq_iff h] at e; linarith
    have k5 : -2 * x = -3 := by linarith
    linarith
  · rintro rfl; unfold g₂; norm_num

/-- Naloga 2 d): predznaki na intervalih (pozitivna na (−∞, 0), (1, 2), (3, ∞), negativna na (0, 1),
(2, 3)) in vrednosti v testnih številih −1, 1/2, 3/2, 5/2, 4.
trditev: MAT-SS-3/racionalne-funkcije#matura2-predznaki
besedilo: »d) Predznaki na intervalih (testna števila $-1$, $\frac{1}{2}$, $\frac{3}{2}$, $\frac{5}{2}$, $4$): $f$ je pozitivna na $(-\infty, 0)$, $(1, 2)$ in $(3, \infty)$, negativna na $(0, 1)$ in $(2, 3)$.« -/
theorem matura2_predznaki :
    (∀ x, x < 0 → 0 < g₂ x) ∧ (∀ x, 0 < x → x < 1 → g₂ x < 0) ∧ (∀ x, 1 < x → x < 2 → 0 < g₂ x) ∧
    (∀ x, 2 < x → x < 3 → g₂ x < 0) ∧ (∀ x, 3 < x → 0 < g₂ x) ∧
    g₂ (-1) = 8 / 3 ∧ g₂ (1 / 2) = -5 / 3 ∧ g₂ (3 / 2) = 1 ∧ g₂ (5 / 2) = -3 / 5 ∧ g₂ 4 = 3 / 8 := by
  refine ⟨fun x h => ?_, fun x h1 h2 => ?_, fun x h1 h2 => ?_, fun x h1 h2 => ?_, fun x h => ?_,
    by unfold g₂; norm_num, by unfold g₂; norm_num, by unfold g₂; norm_num, by unfold g₂; norm_num,
    by unfold g₂; norm_num⟩ <;> unfold g₂
  · exact div_pos (by nlinarith) (by nlinarith)
  · exact div_neg_of_pos_of_neg (by nlinarith) (by nlinarith)
  · exact div_pos_of_neg_of_neg (by nlinarith) (by nlinarith)
  · exact div_neg_of_neg_of_pos (by nlinarith) (by nlinarith)
  · exact div_pos (by nlinarith) (by nlinarith)

/-- Naloga 2 d): leva veja (x < 0) leži nad y = 1, desna (x > 2) pod y = 1; srednja gre skozi (1, 0) in
(3/2, 1), desna skozi (3, 0).
trditev: MAT-SS-3/racionalne-funkcije#matura2-veje
besedilo: »Leva veja leži nad premico $y = 1$, se ji daleč levo bliža od zgoraj in se ob $x = 0$ dviga v $+\infty$. Srednja veja pride iz $-\infty$ desno od $x = 0$, gre skozi $(1, 0)$ in $\left(\frac{3}{2}, 1\right)$ ter se ob $x = 2$ dviga v $+\infty$. Desna veja pride iz $-\infty$ desno od $x = 2$, gre skozi $(3, 0)$ in se od spodaj bliža premici $y = 1$.« -/
theorem matura2_veje : (∀ x, x < 0 → 1 < g₂ x) ∧ (∀ x, 2 < x → g₂ x < 1) ∧
    g₂ 1 = 0 ∧ g₂ (3 / 2) = 1 ∧ g₂ 3 = 0 := by
  refine ⟨fun x h => ?_, fun x h => ?_, by unfold g₂; norm_num, by unfold g₂; norm_num,
    by unfold g₂; norm_num⟩ <;> unfold g₂
  · rw [lt_div_iff₀ (by nlinarith)]; nlinarith
  · rw [div_lt_iff₀ (by nlinarith)]; nlinarith

/-! ## Ustno vprašanje 3, Bolj natančno, analogija, Preveri se -/

/-- Ustno vprašanje 3 (RACUN enako): (x² − 1)/(x − 1) = x + 1 za x ≠ 1; pri x = 1 je luknja (1, 2).
trditev: MAT-SS-3/racionalne-funkcije#ustno3
besedilo: »Po krajšanju je $f(x) = x + 1$ za $x \ne 1$, faktor $(x - 1)$ v imenovalcu torej ne ostane. Graf je premica $y = x + 1$ brez točke $(1, 2)$, ki ji rečemo luknja.« -/
theorem ustno3 : (∀ x : ℝ, x ≠ 1 → (x ^ 2 - 1) / (x - 1) = x + 1) ∧
    Tendsto (fun x : ℝ => (x ^ 2 - 1) / (x - 1)) (𝓝[≠] 1) (𝓝 2) := by
  have h : ∀ x : ℝ, x ≠ 1 → (x ^ 2 - 1) / (x - 1) = x + 1 := by
    intro x hx
    have : x - 1 ≠ 0 := sub_ne_zero.2 hx
    field_simp; ring
  refine ⟨h, ?_⟩
  have := luknja (k := fun x : ℝ => x + 1) h (by fun_prop)
  norm_num at this ⊢; exact this

/-- Bolj natančno: (x² + 1)/x = x + 1/x (x ≠ 0), razlika do premice y = x je 1/x in gre proti 0.
trditev: MAT-SS-3/racionalne-funkcije#natancno-posevna
besedilo: »Primer: $\frac{x^2 + 1}{x} = x + \frac{1}{x}$, razlika do premice $y = x$ je $\frac{1}{x}$.« -/
theorem natancno_posevna : (∀ x : ℝ, x ≠ 0 → (x ^ 2 + 1) / x = x + 1 / x) ∧
    Tendsto (fun x : ℝ => (x ^ 2 + 1) / x - x) atTop (𝓝 0) ∧
    Tendsto (fun x : ℝ => (x ^ 2 + 1) / x - x) atBot (𝓝 0) := by
  refine ⟨fun x hx => by field_simp, ?_⟩
  exact asimptota_inv (R := id) 1 continuousAt_id rfl (by
    intro x hx
    have hx0 : x ≠ 0 := by rintro rfl; norm_num at hx
    simp only [id]; field_simp; ring)

/-- Analogija s tekočim trakom: 12/(v − 3) raste čez vse meje, ko gre v od zgoraj proti 3
(tudi Preveri se, vprašanje 1).
trditev: MAT-SS-3/racionalne-funkcije#trak
besedilo: »Tako se obnaša $\frac{12}{v - 3}$ pri $v$ tik nad $3$.« -/
theorem trak : Tendsto (fun v : ℝ => 12 / (v - 3)) (𝓝[>] 3) atTop := by
  simpa using (pol_liha_stopnja (g := fun _ : ℝ => (12 : ℝ)) (c := 3) (m := 1) continuousAt_const
    (by norm_num) odd_one).2

/-- Analogija s taksijem (in Preveri se, vprašanje 4): cena na km (4 + 0,8x)/x je pri 100 km 0,84 €, pri
1 km 4,80 €, nikoli ne pade pod 0,80 € in se 0,80 € bliža (asimptota y = 0,8).
trditev: MAT-SS-3/racionalne-funkcije#taksi
besedilo: »Pri $100\,\mathrm{km}$ je že $0{,}84\,€$ na kilometer. Nikoli pa ne pade pod $0{,}80\,€$: vstopnina se razredči, ne izgine. Funkcija $\frac{4 + 0{,}8x}{x}$ ima asimptoto $y = 0{,}8$.« -/
theorem taksi : (4 + 8 / 10 * 100 : ℝ) / 100 = 84 / 100 ∧ (4 + 8 / 10 * 1 : ℝ) / 1 = 48 / 10 ∧
    (∀ x : ℝ, 0 < x → 8 / 10 < (4 + 8 / 10 * x) / x) ∧
    Tendsto (fun x : ℝ => (4 + 8 / 10 * x) / x) atTop (𝓝 (8 / 10)) := by
  refine ⟨by norm_num, by norm_num, fun x hx => by rw [lt_div_iff₀ hx]; linarith, ?_⟩
  exact (asimptota_inv (R := fun t => 4 * t + 8 / 10) 1 (by fun_prop) (by norm_num) (by
    intro x hx
    have hx0 : x ≠ 0 := by rintro rfl; norm_num at hx
    field_simp)).1

/-- Preveri se, vprašanje 2: asimptote h → 0, g → 1/2, f → 3, in 0 < 1/2 < 3 (vrstni red h, g, f).
trditev: MAT-SS-3/racionalne-funkcije#preveri2
besedilo: »Asimptote: $h$ ima $y = 0$ (števec nižji), $g$ ima $y = \frac{1}{2}$, $f$ ima $y = 3$.« -/
theorem preveri2 : Tendsto (fun x : ℝ => 5 / (x + 4)) atTop (𝓝 0) ∧
    Tendsto (fun x : ℝ => x ^ 2 / (2 * x ^ 2 + 1)) atTop (𝓝 (1 / 2)) ∧
    Tendsto (fun x : ℝ => (3 * x + 1) / (x - 2)) atTop (𝓝 3) ∧ (0 : ℝ) < 1 / 2 ∧ (1 / 2 : ℝ) < 3 := by
  refine ⟨?_, ?_, napaka_asimptota.1, by norm_num, by norm_num⟩
  · exact (asimptota_inv (R := fun t => 5 * t / (1 + 4 * t)) 10 (by fun_prop (disch := norm_num))
      (by norm_num) (by
        intro x hx
        have hx0 : x ≠ 0 := by rintro rfl; norm_num at hx
        have hx4 : x + 4 ≠ 0 := by rcases lt_abs.mp hx with h | h <;> intro e <;> linarith
        field_simp)).1
  · exact (asimptota_inv (R := fun t => 1 / (2 + t ^ 2)) 1 (by fun_prop (disch := positivity))
      (by norm_num) (by
        intro x hx
        have hx0 : x ≠ 0 := by rintro rfl; norm_num at hx
        have : 2 * x ^ 2 + 1 ≠ 0 := by positivity
        field_simp)).1

/-- Preveri se, vprašanje 3: pri a = 1 je (x − 1)/(x − 1) = 1 za x ≠ 1 (premica y = 1 z luknjo).
trditev: MAT-SS-3/racionalne-funkcije#preveri3
besedilo: »Pozabil si okrajšati: $\frac{x - 1}{x - 1} = 1$ za $x \ne 1$, pol izgine.« -/
theorem preveri3 (x : ℝ) (hx : x ≠ 1) : (x - 1) / (x - 1) = 1 := div_self (sub_ne_zero.2 hx)

/-- Predpostavka `preveri3` se da izpolniti (x = 0). -/
example : ((0 : ℝ) - 1) / (0 - 1) = 1 := preveri3 0 (by norm_num)

/-- Preveri se, vprašanje 5: 20/(v − 4) = 2 s pogojem v ≠ 4 ↔ v = 14 (v − 4 = 10).
trditev: MAT-SS-3/racionalne-funkcije#preveri5
besedilo: »$\dfrac{20}{v - 4} = 2$, torej $v - 4 = 10$ in $v = 14\,\mathrm{km/h}$.« -/
theorem preveri5 (v : ℝ) : (v ≠ 4 ∧ 20 / (v - 4) = 2) ↔ v = 14 := by
  constructor
  · rintro ⟨hv, h⟩
    have h4 : v - 4 ≠ 0 := sub_ne_zero.2 hv
    have : v - 4 = 10 := by rw [div_eq_iff h4] at h; linarith
    linarith
  · rintro rfl; norm_num

/-- Preveri se, vprašanje 6 (RACUN resi): x/(x − 3) − 1/x = 3/(x² − 3x) s pogojema x ≠ 0, x ≠ 3 ↔ x = 1
(x² − (x − 3) = 3, x² − x = 0, x = 0 je navidezna).
trditev: MAT-SS-3/racionalne-funkcije#preveri6
besedilo: »Pogoja: $x \ne 0$, $x \ne 3$. Množimo z $x(x - 3)$: $x^2 - (x - 3) = 3$, torej $x^2 - x = 0$ in $x = 0$ ali $x = 1$. Število $0$ je ničla imenovalca, ostane $x = 1$.« -/
theorem preveri6 (x : ℝ) :
    (x ≠ 0 ∧ x ≠ 3 ∧ x / (x - 3) - 1 / x = 3 / (x ^ 2 - 3 * x)) ↔ x = 1 := by
  constructor
  · rintro ⟨h0, h3, h⟩
    have a : x - 3 ≠ 0 := sub_ne_zero.2 h3
    have r : x ^ 2 - 3 * x = x * (x - 3) := by ring
    rw [r] at h
    have k1 : x ^ 2 - (x - 3) = 3 := by field_simp at h; linarith
    have k2 : x ^ 2 - x = 0 := by linarith
    have k3 : x * (x - 1) = 0 := by linear_combination k2
    rcases mul_eq_zero.1 k3 with e | e
    · exact absurd e h0
    · linarith
  · rintro rfl; norm_num

/-- RACUN: resi x^2-x=0 ↔ x = 0 ali x = 1.
trditev: MAT-SS-3/racionalne-funkcije#racun-x2-x
besedilo: »torej $x^2 - x = 0$ in $x = 0$ ali $x = 1$.« -/
theorem racun_x2_x (x : ℝ) : x ^ 2 - x = 0 ↔ x = 0 ∨ x = 1 := by
  have : x ^ 2 - x = x * (x - 1) := by ring
  rw [this, mul_eq_zero, sub_eq_zero]

end Evklid.Lekcije.MAT_SS_3.RacionalneFunkcije
