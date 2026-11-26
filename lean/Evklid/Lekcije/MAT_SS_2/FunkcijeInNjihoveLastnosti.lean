/-
vir: content/lessons/MAT-SS-2/funkcije-in-njihove-lastnosti.md
sha256: c91e377278233d2aa75b38f3b2de6a7422acb5484e3f749dad82bdc3498456e8
Ni v Leanu: risba in simulacija; definicije (funkcija, D_f, Z_f, ničla, naraščanje, soda/liha, injektivna,
surjektivna, bijektivna, sestavljena in inverzna funkcija) so v Mathlibu že vgrajene (Set.range, StrictMonoOn,
Function.Injective, Set.SurjOn, Function.comp …) in se uporabljajo, ne dokazujejo; opisi grafa (»vodoravna
premica seka graf največ enkrat«, »simetrija glede na os y / izhodišče«, »graf seka os x v ničli«; dokazane so
algebrske trditve, ki jih opisujejo, in zrcaljenje točk (a, b) ↦ (b, a)); primeri iz vsakdanjega življenja kot
opis (temperatura juhe, pečica, mlinček in tehtnica v Kot zgodba); »v praksi na 180 °C« (praktični nasvet);
fizikalne formule kot modeli (dokazano je le izražanje količin); točkovanje.
Lean: x/0 = 0, zato so pri izražanju iz formul pogoji (t ≠ 0, v ≠ 0, M ≠ 0, …) zapisani kot predpostavke;
√x = 0 za x < 0, zato je D_f = [−4, ∞) pri Primeru 1 zapisano kot pogoj x + 4 ≥ 0. Za x³ + 1 (Preveri se, 6) je
kubični koren `koren 3` (za a < 0 je −(−a)^(1/3)).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.FunkcijeInNjihoveLastnosti

open Real Set Function

/-! ## Pomožno: kubični koren -/

/-- Realni n-ti koren: za a ≥ 0 je a^(1/n), za a < 0 je −(−a)^(1/n). -/
noncomputable def koren (n : ℕ) (a : ℝ) : ℝ :=
  if 0 ≤ a then a ^ ((n : ℝ)⁻¹) else -((-a) ^ ((n : ℝ)⁻¹))

/-- Pomožna trditev (orodje za dokaze v tej datoteki).
pomozno -/
theorem koren_lih_pot {n : ℕ} (hn : Odd n) (a : ℝ) : koren n a ^ n = a := by
  have hn0 : n ≠ 0 := by rintro rfl; exact Nat.not_odd_zero hn
  by_cases ha : 0 ≤ a
  · simp only [koren, ha, ↓reduceIte]; exact Real.rpow_inv_natCast_pow ha hn0
  · have ha' : 0 ≤ -a := le_of_lt (neg_pos.mpr (not_le.mp ha))
    simp only [koren, ha, ↓reduceIte]; rw [hn.neg_pow, Real.rpow_inv_natCast_pow ha' hn0, neg_neg]

example : Odd 3 := ⟨1, rfl⟩

/-! ## Uvod in razlaga -/

/-- Babičino pravilo f(x) = 50x + 100 (ml mleka za x palačink). -/
def babica (x : ℕ) : ℕ := 50 * x + 100

/-- Zakaj se tega učimo: f(10) = 600; 600 − 100 = 500, 500 : 50 = 10; 120 ml ne more porabiti (120 − 100 = 20,
20/50 = 0,4 ni naravno število), tj. 600 je v Z_f, 120 ni.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#uvod
besedilo: »Ne: $120 - 100 = 20$, to je le $0{,}4$ palačinke.« -/
theorem uvod : babica 10 = 600 ∧ 600 - 100 = 500 ∧ 500 / 50 = 10 ∧ (∀ x : ℕ, babica x = 600 ↔ x = 10) ∧
    ((120:ℝ) - 100) / 50 = 0.4 ∧ (600 ∈ Set.range babica) ∧ (120 ∉ Set.range babica) := by
  refine ⟨rfl, rfl, rfl, fun x => ⟨fun h => by unfold babica at h; omega, fun h => by rw [h]; rfl⟩, by norm_num,
    ⟨10, rfl⟩, ?_⟩
  rintro ⟨x, hx⟩; unfold babica at hx; omega

/-- Definicijsko območje: pri 1/(x − 2) mora biti x − 2 ≠ 0, tj. D_f = R \ {2}.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#d-ulomek
besedilo: »Pri $\dfrac{1}{x - 2}$ je zato $D_f = \mathbb{R} \setminus \{2\}$.« -/
theorem D_ulomek (x : ℝ) : x - 2 ≠ 0 ↔ x ≠ 2 := by rw [Ne, sub_eq_zero]

/-- Zaloga vrednosti: x² ima D_f = R, Z_f = [0, ∞).
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#z-kvadrat
besedilo: »Zaloga vrednosti** $Z_f$ je množica vseh vrednosti $f(x)$, ki jih funkcija res zavzame. Funkcija $f(x) = x^2$ ima $D_f = \mathbb{R}$, a $Z_f = [0, \infty)$, ker kvadrat ni nikoli negativen. Pri babici je $600$ v $Z_f$, $120$ pa ne, kot si videl v uganki.« -/
theorem Z_kvadrat : Set.range (fun x : ℝ => x ^ 2) = Set.Ici 0 := by
  ext y; constructor
  · rintro ⟨x, rfl⟩; exact sq_nonneg x
  · intro hy; exact ⟨√y, Real.sq_sqrt hy⟩

/-- Naraščanje: babičino mleko s številom palačink narašča.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#babica-narasca
besedilo: »Babičino mleko s številom palačink narašča.« -/
theorem babica_narasca : StrictMono babica := fun _ _ h => by unfold babica; omega

/-- Simetrija (tabela): (±1)² = 1, (±2)² = 4, (±3)² = 9 (enaki), (±1)³ = ±1, (±2)³ = ±8, (±3)³ = ±27 (nasprotni).
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#tabela
besedilo: »$(f \circ g)(1) = f(2) = 4 - 3 = 1$« -/
theorem tabela : ((1:ℝ) ^ 2 = 1 ∧ (-1:ℝ) ^ 2 = 1 ∧ (2:ℝ) ^ 2 = 4 ∧ (-2:ℝ) ^ 2 = 4 ∧ (3:ℝ) ^ 2 = 9 ∧ (-3:ℝ) ^ 2 = 9) ∧
    ((1:ℝ) ^ 3 = 1 ∧ (-1:ℝ) ^ 3 = -1 ∧ (2:ℝ) ^ 3 = 8 ∧ (-2:ℝ) ^ 3 = -8 ∧ (3:ℝ) ^ 3 = 27 ∧ (-3:ℝ) ^ 3 = -27) := by
  norm_num

/-- Simetrija: x + 1 ni ne soda ne liha (f(−1) = 0, f(1) = 2).
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#x-plus-1
besedilo: »Večina funkcij ni ne soda ne liha, na primer $x + 1$: $f(-1) = 0$, $f(1) = 2$.« -/
theorem x_plus_1 : ¬ (∀ x : ℝ, (-x) + 1 = x + 1) ∧ ¬ (∀ x : ℝ, (-x) + 1 = -(x + 1)) ∧
    ((-1:ℝ) + 1 = 0 ∧ (1:ℝ) + 1 = 2) := by
  refine ⟨fun h => by have := h 1; norm_num at this, fun h => by have := h 1; norm_num at this, by norm_num⟩

/-- Premisli: |x| in x⁴ sta sodi (|−x| = |x|, (−x)⁴ = x⁴); splošno so sode potence sode, lihe lihe funkcije.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#sode-lihe
besedilo: »Obe sta sodi. $|-x| = |x|$ in $(-x)^4 = x^4$, ker sodo število minusov da plus. Iz tabele vidiš splošno: sode potence so sode funkcije, lihe potence lihe.« -/
theorem sode_lihe (x : ℝ) (n : ℕ) : |(-x)| = |x| ∧ (-x) ^ 4 = x ^ 4 ∧ (Even n → (-x) ^ n = x ^ n) ∧
    (Odd n → (-x) ^ n = -x ^ n) :=
  ⟨abs_neg x, by ring, fun h => h.neg_pow x, fun h => h.neg_pow x⟩

/-- Injektivnost: x³ je injektivna, x² na R ni (2 in −2 dasta 4).
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#injektivnost
besedilo: »Funkcija $x^3$ je injektivna, $x^2$ na $\mathbb{R}$ ni.« -/
theorem injektivnost : Injective (fun x : ℝ => x ^ 3) ∧ ¬ Injective (fun x : ℝ => x ^ 2) :=
  ⟨(Odd.strictMono_pow (⟨1, rfl⟩ : Odd 3)).injective,
    fun h => by have := @h 2 (-2) (by norm_num); norm_num at this⟩

/-- Injektivnost in Ustno vprašanje 1: funkcija, ki na celem D_f narašča (ali pada), je injektivna.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#monotona-injektivna
besedilo: »Funkcija, ki na celem $D_f$ narašča (ali pada), je vedno injektivna.« -/
theorem monotona_injektivna {f : ℝ → ℝ} {D : Set ℝ} :
    (StrictMonoOn f D → InjOn f D) ∧ (StrictAntiOn f D → InjOn f D) :=
  ⟨fun h => h.injOn, fun h => h.injOn⟩

/-- Surjektivnost: babičina funkcija N → N je injektivna, surjektivna pa ne (120 ni vrednost).
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#babica-surj
besedilo: »Babičina funkcija $f\colon \mathbb{N} \to \mathbb{N}$ je injektivna, surjektivna pa ne, ker vrednosti $120$ ne doseže.« -/
theorem babica_surj : Injective babica ∧ ¬ Surjective babica :=
  ⟨babica_narasca.injective, fun h => by obtain ⟨x, hx⟩ := h 120; unfold babica at hx; omega⟩

/-- Surjektivnost: x² kot R → R ni injektivna ne surjektivna (−1 ni vrednost); kot R → [0, ∞) ni injektivna,
je surjektivna; kot [0, ∞) → [0, ∞) je injektivna, surjektivna in bijektivna.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#kvadrat-abc
besedilo: »$\mathbb{R} \to \mathbb{R}$: ni injektivna, ni surjektivna ($-1$ ni vrednost), ni bijektivna;« -/
theorem kvadrat_ABC :
    (¬ InjOn (fun x : ℝ => x ^ 2) univ ∧ ¬ SurjOn (fun x : ℝ => x ^ 2) univ univ) ∧
    (¬ InjOn (fun x : ℝ => x ^ 2) univ ∧ SurjOn (fun x : ℝ => x ^ 2) univ (Ici 0)) ∧
    BijOn (fun x : ℝ => x ^ 2) (Ici 0) (Ici 0) := by
  have ni : ¬ InjOn (fun x : ℝ => x ^ 2) univ := fun h => by
    have := h (mem_univ 2) (mem_univ (-2)) (by norm_num); norm_num at this
  have surj : SurjOn (fun x : ℝ => x ^ 2) (Ici 0) (Ici 0) := fun y hy =>
    ⟨√y, Real.sqrt_nonneg y, Real.sq_sqrt hy⟩
  refine ⟨⟨ni, fun h => ?_⟩, ⟨ni, fun y hy => ?_⟩, ⟨fun x _ => sq_nonneg x, ?_, surj⟩⟩
  · obtain ⟨x, _, hx⟩ := h (mem_univ (-1)); have := sq_nonneg x; simp only at hx; linarith
  · obtain ⟨x, _, hx⟩ := surj hy; exact ⟨x, mem_univ x, hx⟩
  · exact (pow_left_strictMonoOn₀ (by norm_num)).injOn

/-- Surjektivnost: x³ je kot R → R bijektivna.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#kub-bijektivna
besedilo: »Funkcija $x^3$ je kot $\mathbb{R} \to \mathbb{R}$ bijektivna. Če za $B$ vzamemo zalogo vrednosti $Z_f$, je vsaka funkcija surjektivna. Zato je vsaka injektivna funkcija kot $f\colon D_f \to Z_f$ bijektivna.« -/
theorem kub_bijektivna : Bijective (fun x : ℝ => x ^ 3) :=
  ⟨injektivnost.1, fun y => ⟨koren 3 y, koren_lih_pot ⟨1, rfl⟩ y⟩⟩

/-- Surjektivnost: kot f : A → Z_f je vsaka funkcija surjektivna, injektivna pa bijektivna.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#na-zalogo
besedilo: »Funkcija $x^3$ je kot $\mathbb{R} \to \mathbb{R}$ bijektivna. Če za $B$ vzamemo zalogo vrednosti $Z_f$, je vsaka funkcija surjektivna. Zato je vsaka injektivna funkcija kot $f\colon D_f \to Z_f$ bijektivna.« -/
theorem na_zalogo {α β : Type*} (f : α → β) : Surjective (rangeFactorization f) ∧
    (Injective f → Bijective (rangeFactorization f)) :=
  ⟨rangeFactorization_surjective, fun h => ⟨fun _ _ hab => h (congrArg Subtype.val hab), rangeFactorization_surjective⟩⟩

/-- Sestavljena funkcija: (g ∘ f)(x) = g(f(x)).
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#sestavljena
besedilo: »Sestavljena funkcija $g \circ f$ ima predpis $(g \circ f)(x) = g(f(x))$:« -/
theorem sestavljena {α β γ : Type*} (f : α → β) (g : β → γ) (x : α) : (g ∘ f) x = g (f x) := rfl

/-- Inverzna funkcija: levo obratna funkcija obstaja natanko za injektivno f; za injektivno f : A → Z_f obstaja
f⁻¹ : Z_f → A z f⁻¹(f(x)) = x za vsak x ∈ A in f(f⁻¹(y)) = y za vsak y ∈ Z_f.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#inverz-obstaja
besedilo: »Taki obrnjeni funkciji rečemo **inverzna funkcija** $f^{-1}$: če je $f(x) = y$, je $f^{-1}(y) = x$.« -/
theorem inverz_obstaja {α β : Type*} [Nonempty α] (f : α → β) : (Injective f ↔ HasLeftInverse f) ∧
    (Injective f → ∃ g : Set.range f → α, LeftInverse g (rangeFactorization f) ∧
      Function.RightInverse g (rangeFactorization f)) :=
  ⟨injective_iff_hasLeftInverse, fun h => bijective_iff_has_inverse.mp ((na_zalogo f).2 h)⟩

/-- Inverzna funkcija za babico (na realnih številih): f(x) = 50x + 100 ima inverz f⁻¹(x) = (x − 100)/50:
f⁻¹(f(x)) = x in f(f⁻¹(x)) = x za vsak x; iz y = 50x + 100 sledi x = (y − 100)/50; graf: (a, b) na grafu f ⇔
(b, a) na grafu f⁻¹.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#babica-inverz
besedilo: »$f^{-1}$ kot ulomek.** Oznaka $f^{-1}(x)$ ni $\dfrac{1}{f(x)}$. Pri babici je $\dfrac{1}{50x + 100}$ nesmiselna količina, prava inverzna pa je $\dfrac{x - 100}{50}$. Inverzna funkcija »odpravi« $f$, ne obrne ulomka.« -/
theorem babica_inverz (x y a b : ℝ) :
    LeftInverse (fun x : ℝ => (x - 100) / 50) (fun x : ℝ => 50 * x + 100) ∧
    Function.RightInverse (fun x : ℝ => (x - 100) / 50) (fun x : ℝ => 50 * x + 100) ∧
    (50 * x + 100 - 100) / 50 = x ∧ 50 * ((x - 100) / 50) + 100 = x ∧ (y = 50 * x + 100 ↔ x = (y - 100) / 50) ∧
    (b = 50 * a + 100 ↔ a = (b - 100) / 50) := by
  refine ⟨fun x => by ring, fun x => by ring, by ring, by ring, ⟨fun h => by rw [h]; ring, fun h => by rw [h]; ring⟩,
    ⟨fun h => by rw [h]; ring, fun h => by rw [h]; ring⟩⟩

/-- Inverzna funkcija: D_{f⁻¹} = Z_f in Z_{f⁻¹} = D_f; inverz bijektivne funkcije A → B je bijektiven B → A.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#inverz-bij
besedilo: »Inverzna funkcija bijektivne funkcije $f\colon A \to B$ je $f^{-1}\colon B \to A$ in je spet bijektivna.« -/
theorem inverz_bij {α β : Type*} {f : α → β} {g : β → α} {A : Set α} {B : Set β} (hf : BijOn f A B)
    (hinv : InvOn g f A B) : BijOn g B A ∧ f '' A = B ∧ g '' B = A :=
  ⟨hf.symm hinv.symm, hf.image_eq, (hf.symm hinv.symm).image_eq⟩

/-- Predpostavke trditve `inverz_bij` se dajo izpolniti. -/
example : BijOn (fun x : ℝ => x) univ univ ∧ InvOn (fun x : ℝ => x) (fun x : ℝ => x) univ univ :=
  ⟨bijOn_id univ, ⟨fun _ _ => rfl, fun _ _ => rfl⟩⟩

/-- Predpostavke trditve `inverz_bij` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : BijOn (fun x : ℝ => x) univ univ ∧ InvOn (fun x : ℝ => x) (fun x : ℝ => x) univ univ :=
    ⟨bijOn_id univ, ⟨fun _ _ => rfl, fun _ _ => rfl⟩⟩
  inverz_bij (hf := w.1) (hinv := w.2)

/-- Premisli: na R x² nima inverzne (4 = f(2) = f(−2)); na [0, ∞) je inverzna √x.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#premisli-kvadrat
besedilo: »Na $\mathbb{R}$ vrednost $4$ dobiš iz $2$ in iz $-2$, zato $f^{-1}(4)$ ni enolično. Na $[0, \infty)$ funkcija narašča in je injektivna. Inverzna je $\sqrt{x}$, saj je koren po definiciji nenegativen.« -/
theorem premisli_kvadrat : (2:ℝ) ^ 2 = 4 ∧ (-2:ℝ) ^ 2 = 4 ∧ InvOn (fun x : ℝ => √x) (fun x : ℝ => x ^ 2) (Ici 0) (Ici 0) :=
  ⟨by norm_num, by norm_num, ⟨fun x hx => Real.sqrt_sq hx, fun y hy => Real.sq_sqrt hy⟩⟩

/-! ## Izražanje neznanke iz formule -/

/-- Izražanje: v = s/t ⇔ t = s/v (t, v ≠ 0); n = m/M ⇔ m = n · M (M ≠ 0); c = n/V ⇔ V = n/c (V, c ≠ 0).
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#izrazanje
besedilo: »Koncentracija $c = \dfrac{n}{V}$: pomnožimo z $V$ in delimo s $c$, zato $V = \dfrac{n}{c}$.« -/
theorem izrazanje (s t v m M n c V : ℝ) (ht : t ≠ 0) (hv : v ≠ 0) (hM : M ≠ 0) (hV : V ≠ 0) (hc : c ≠ 0) :
    (v = s / t ↔ t = s / v) ∧ (n = m / M ↔ m = n * M) ∧ (c = n / V ↔ V = n / c) := by
  refine ⟨⟨fun h => ?_, fun h => ?_⟩, ⟨fun h => ?_, fun h => ?_⟩, ⟨fun h => ?_, fun h => ?_⟩⟩
  · have hs : s ≠ 0 := by rintro rfl; rw [zero_div] at h; exact hv h
    rw [h]; field_simp
  · have hs : s ≠ 0 := by rintro rfl; rw [zero_div] at h; exact ht h
    rw [h]; field_simp
  · rw [h]; field_simp
  · rw [h]; field_simp
  · have hn : n ≠ 0 := by rintro rfl; rw [zero_div] at h; exact hc h
    rw [h]; field_simp
  · have hn : n ≠ 0 := by rintro rfl; rw [zero_div] at h; exact hV h
    rw [h]; field_simp

/-- Predpostavke trditve `izrazanje` se dajo izpolniti. -/
example : (1:ℝ) ≠ 0 := one_ne_zero

/-- Predpostavke trditve `izrazanje` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 := one_ne_zero
  izrazanje (ht := w) (hv := w) (hM := w) (hV := w) (hc := w)

/-- Izražanje: E_k = mv²/2 ⇔ v = √(2E_k/m) (m > 0, E_k ≥ 0, v ≥ 0: vzamemo pozitivni koren).
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#izrazanje-v
besedilo: »Kinetična energija $E_k = \dfrac{mv^2}{2}$: pomnožimo z $2$, delimo z $m$ in korenimo, $v = \sqrt{\dfrac{2E_k}{m}}$. Vzamemo le pozitivni koren, ker je $v$ tu velikost hitrosti.« -/
theorem izrazanje_v (E m v : ℝ) (hm : 0 < m) (hE : 0 ≤ E) (hv : 0 ≤ v) : E = m * v ^ 2 / 2 ↔ v = √(2 * E / m) := by
  constructor
  · intro h; rw [h, show 2 * (m * v ^ 2 / 2) / m = v ^ 2 by field_simp, Real.sqrt_sq hv]
  · intro h; rw [h, Real.sq_sqrt (by positivity)]; field_simp

/-- Predpostavke trditve `izrazanje_v` se dajo izpolniti. -/
example : (0:ℝ) < 8 ∧ (0:ℝ) ≤ 100 ∧ (0:ℝ) ≤ 5 := by norm_num

/-- Predpostavke trditve `izrazanje_v` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 8 ∧ (0:ℝ) ≤ 100 ∧ (0:ℝ) ≤ 5 := by norm_num
  izrazanje_v (hm := w.1) (hE := w.2.1) (hv := w.2.2)

/-- Izražanje: l = l₀ + αl₀ΔT = l₀(1 + αΔT), zato l₀ = l/(1 + αΔT) (1 + αΔT ≠ 0).
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#izrazanje-l0
besedilo: »$l_0 + \alpha l_0 \Delta T = l_0(1 + \alpha \Delta T)$« -/
theorem izrazanje_l0 (l l0 α ΔT : ℝ) (h : 1 + α * ΔT ≠ 0) :
    l0 + α * l0 * ΔT = l0 * (1 + α * ΔT) ∧ (l = l0 + α * l0 * ΔT ↔ l0 = l / (1 + α * ΔT)) := by
  refine ⟨by ring, ⟨fun e => ?_, fun e => ?_⟩⟩
  · rw [e]; field_simp
  · rw [e]; field_simp

/-- Predpostavke trditve `izrazanje_l0` se dajo izpolniti. -/
example : (1:ℝ) + 1.2e-5 * 50 ≠ 0 := by norm_num

/-! ## Rešeni primeri -/

/-- Predpostavke trditve `izrazanje_l0` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) + 1.2e-5 * 50 ≠ 0 := by norm_num
  izrazanje_l0 (h := w)

/-- Primer 1: f(x) = √(x + 4) − 2; D_f: x + 4 ≥ 0 ⇔ x ≥ −4; ničla: √(x + 4) = 2, x + 4 = 4, x = 0
(preizkus f(0) = √4 − 2 = 0); najmanjša vrednost f(−4) = 0 − 2 = −2, Z_f = [−2, ∞).
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#primer1
besedilo: »Odgovor: $D_f = [-4, \infty)$, ničla je $x = 0$, $Z_f = [-2, \infty)$.« -/
theorem primer1 :
    (∀ x : ℝ, 0 ≤ x + 4 ↔ -4 ≤ x) ∧ (∀ x : ℝ, (0 ≤ x + 4 ∧ √(x + 4) - 2 = 0) ↔ x = 0) ∧
    √((0:ℝ) + 4) - 2 = 0 ∧ √((-4:ℝ) + 4) - 2 = -2 ∧
    (fun x : ℝ => √(x + 4) - 2) '' Ici (-4) = Ici (-2) := by
  have s4 : √((0:ℝ) + 4) = 2 := by
    rw [show (0:ℝ) + 4 = 2 ^ 2 by norm_num]; exact Real.sqrt_sq (by norm_num)
  refine ⟨fun x => ⟨fun h => by linarith, fun h => by linarith⟩, fun x => ⟨?_, ?_⟩, by rw [s4]; norm_num,
    by norm_num, ?_⟩
  · rintro ⟨hA, h⟩
    have h2 : √(x + 4) = 2 := by linarith
    have := Real.sq_sqrt hA; rw [h2] at this; linarith
  · rintro rfl; exact ⟨by norm_num, by rw [s4]; norm_num⟩
  · ext y; simp only [mem_image, mem_Ici]
    constructor
    · rintro ⟨x, _, rfl⟩; have := Real.sqrt_nonneg (x + 4); linarith
    · intro hy
      refine ⟨(y + 2) ^ 2 - 4, by nlinarith [sq_nonneg (y + 2)], ?_⟩
      rw [sub_add_cancel, Real.sqrt_sq (by linarith)]; ring

/-- Primer 2: f(x) = x³ − 4x je liha: f(−x) = (−x)³ − 4(−x) = −x³ + 4x = −(x³ − 4x); g(x) = x² + 2x ni ne soda
ne liha (g(−x) = x² − 2x; g(1) = 3, g(−1) = −1); f(0) = 0 = f(2) = 8 − 8, zato f ni injektivna.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#primer2
besedilo: »Ugotovi, ali sta $f(x) = x^3 - 4x$ in $g(x) = x^2 + 2x$ sodi ali lihi. Ali je $f$ injektivna?« -/
theorem primer2 :
    (∀ x : ℝ, (-x) ^ 3 - 4 * (-x) = -x ^ 3 + 4 * x ∧ -x ^ 3 + 4 * x = -(x ^ 3 - 4 * x)) ∧
    (∀ x : ℝ, (-x) ^ 2 + 2 * (-x) = x ^ 2 - 2 * x) ∧ ((1:ℝ) ^ 2 + 2 * 1 = 3 ∧ (-1:ℝ) ^ 2 + 2 * (-1) = -1) ∧
    ¬ (∀ x : ℝ, (-x) ^ 2 + 2 * (-x) = x ^ 2 + 2 * x) ∧ ¬ (∀ x : ℝ, (-x) ^ 2 + 2 * (-x) = -(x ^ 2 + 2 * x)) ∧
    ((0:ℝ) ^ 3 - 4 * 0 = 0 ∧ (2:ℝ) ^ 3 - 4 * 2 = 8 - 8 ∧ (8:ℝ) - 8 = 0) ∧ ¬ Injective (fun x : ℝ => x ^ 3 - 4 * x) := by
  refine ⟨fun x => ⟨by ring, by ring⟩, fun x => by ring, by norm_num, fun h => ?_, fun h => ?_, by norm_num, fun h => ?_⟩
  · have := h 1; norm_num at this
  · have := h 1; norm_num at this
  · have := @h 0 2 (by norm_num); norm_num at this

/-- Primer 3: F(C) = 1,8C + 32 narašča (injektivna); iz y = 1,8C + 32 sledi C = (y − 32)/1,8 (F⁻¹);
F⁻¹(350) = (350 − 32)/1,8 = 318/1,8 ≈ 176,7 ≈ 177 °C; preizkus 1,8 · 176,7 + 32 ≈ 350.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#primer3
besedilo: »Vstavimo $y = 350$: $C = \dfrac{350 - 32}{1{,}8} = \dfrac{318}{1{,}8} \approx 176{,}7$.« -/
theorem primer3 :
    StrictMono (fun C : ℝ => 1.8 * C + 32) ∧ (∀ C y : ℝ, y = 1.8 * C + 32 ↔ C = (y - 32) / 1.8) ∧
    ((350:ℝ) - 32) / 1.8 = 318 / 1.8 ∧ 176.65 < (318:ℝ) / 1.8 ∧ (318:ℝ) / 1.8 < 176.75 ∧
    176.5 < (318:ℝ) / 1.8 ∧ (318:ℝ) / 1.8 < 177.5 ∧ 349.5 < (1.8:ℝ) * 176.7 + 32 ∧ (1.8:ℝ) * 176.7 + 32 < 350.5 := by
  refine ⟨fun a b h => by simp only; linarith, fun C y => ⟨fun h => by rw [h]; ring, fun h => by rw [h]; ring⟩,
    by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Primer 4: f(10) = 50 · 10 + 100 = 600, g(600) = 0,0012 · 600 = 0,72 €; (g ∘ f)(x) = 0,0012(50x + 100)
= 0,06x + 0,12.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#primer4
besedilo: »$g(600) = 0{,}0012 \cdot 600 = 0{,}72$, mleko stane $0{,}72\,€$. Splošno $(g \circ f)(x) = 0{,}0012(50x + 100) = 0{,}06x + 0{,}12$.« -/
theorem primer4 (x : ℝ) : (50:ℝ) * 10 + 100 = 600 ∧ (0.0012:ℝ) * 600 = 0.72 ∧
    ((fun m : ℝ => 0.0012 * m) ∘ (fun x : ℝ => 50 * x + 100)) x = 0.0012 * (50 * x + 100) ∧
    (0.0012:ℝ) * (50 * x + 100) = 0.06 * x + 0.12 :=
  ⟨by norm_num, by norm_num, rfl, by ring⟩

/-- Primer 5: iz 1/R = 1/R₁ + 1/R₂ sledi 1/R₂ = 1/R − 1/R₁ = (R₁ − R)/(R R₁) in R₂ = R R₁/(R₁ − R)
(R, R₁, R₂ > 0); R₂ = 4 · 12/(12 − 4) = 48/8 = 6 Ω, preizkus 1/12 + 1/6 = 3/12 = 1/4.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#primer5
besedilo: »Vstavimo podatke: $R_2 = \dfrac{4 \cdot 12}{12 - 4} = \dfrac{48}{8} = 6$, torej $6\,\Omega$.« -/
theorem primer5 (R R1 R2 : ℝ) (hR : 0 < R) (hR1 : 0 < R1) (hR2 : 0 < R2) :
    (1 / R = 1 / R1 + 1 / R2 ↔ 1 / R2 = 1 / R - 1 / R1) ∧ 1 / R - 1 / R1 = (R1 - R) / (R * R1) ∧
    (1 / R = 1 / R1 + 1 / R2 ↔ R2 = R * R1 / (R1 - R)) ∧
    (4:ℝ) * 12 / (12 - 4) = 48 / 8 ∧ (48:ℝ) / 8 = 6 ∧ (1:ℝ) / 12 + 1 / 6 = 3 / 12 ∧ (3:ℝ) / 12 = 1 / 4 := by
  have e2 : 1 / R - 1 / R1 = (R1 - R) / (R * R1) := by field_simp
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, e2, ⟨fun h => ?_, fun h => ?_⟩, by norm_num, by norm_num,
    by norm_num, by norm_num⟩
  · have h1 : 1 / R2 = (R1 - R) / (R * R1) := by rw [← e2]; linarith
    have hne : R1 - R ≠ 0 := by
      intro h0; rw [h0, zero_div] at h1; have : 0 < 1 / R2 := by positivity
      linarith
    rw [one_div, inv_eq_iff_eq_inv, inv_div] at h1; exact h1
  · have hne : R1 - R ≠ 0 := by
      intro h0; rw [h0, div_zero] at h; linarith
    rw [h]; field_simp; ring

/-- Predpostavke trditve `primer5` se dajo izpolniti. -/
example : (0:ℝ) < 4 ∧ (0:ℝ) < 12 ∧ (0:ℝ) < 6 ∧ (1:ℝ) / 4 = 1 / 12 + 1 / 6 := by norm_num

/-! ## Pogoste napake -/

/-- Predpostavke trditve `primer5` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 4 ∧ (0:ℝ) < 12 ∧ (0:ℝ) < 6 ∧ (1:ℝ) / 4 = 1 / 12 + 1 / 6 := by norm_num
  primer5 (hR := w.1) (hR1 := w.2.1) (hR2 := w.2.2.1)

/-- Pogoste napake: f⁻¹(x) ni 1/f(x) (npr. pri x = 200: (200 − 100)/50 = 2, 1/(50 · 200 + 100) ≠ 2); iz
1/R₂ = 1/R − 1/R₁ ne sledi R₂ = R − R₁ (pri R = 4, R₁ = 12 bi bilo −8 < 0, pravilno 6).
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#pogoste-napake
besedilo: »$f^{-1}$ kot ulomek.** Oznaka $f^{-1}(x)$ ni $\dfrac{1}{f(x)}$. Pri babici je $\dfrac{1}{50x + 100}$ nesmiselna količina, prava inverzna pa je $\dfrac{x - 100}{50}$. Inverzna funkcija »odpravi« $f$, ne obrne ulomka.« -/
theorem pogoste_napake : ((200:ℝ) - 100) / 50 = 2 ∧ (1:ℝ) / (50 * 200 + 100) ≠ 2 ∧ (4:ℝ) - 12 = -8 ∧
    (1:ℝ) / 4 - 1 / 12 ≠ 1 / (4 - 12) ∧ (4:ℝ) * 12 / (12 - 4) = 6 := by norm_num

/-! ## Za maturo -/

/-- Naloga 1: f(x) = x⁴ − 2x² + 3; f(−x) = (−x)⁴ − 2(−x)² + 3 = f(x), soda; ni liha (f(−1) = 2, −f(1) = −2);
f(1) = 1 − 2 + 3 = 2 = f(−1), ni injektivna.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#matura1
besedilo: »$f(-x) = (-x)^4 - 2(-x)^2 + 3 = x^4 - 2x^2 + 3 = f(x)$« -/
theorem matura1 :
    (∀ x : ℝ, (-x) ^ 4 - 2 * (-x) ^ 2 + 3 = x ^ 4 - 2 * x ^ 2 + 3) ∧ ¬ (∀ x : ℝ, (-x) ^ 4 - 2 * (-x) ^ 2 + 3 = -(x ^ 4 - 2 * x ^ 2 + 3)) ∧
    ((-1:ℝ) ^ 4 - 2 * (-1) ^ 2 + 3 = 2 ∧ -((1:ℝ) ^ 4 - 2 * 1 ^ 2 + 3) = -2 ∧ (1:ℝ) ^ 4 - 2 * 1 ^ 2 + 3 = 1 - 2 + 3) ∧
    ¬ Injective (fun x : ℝ => x ^ 4 - 2 * x ^ 2 + 3) := by
  refine ⟨fun x => by ring, fun h => by have := h 1; norm_num at this, by norm_num, fun h => ?_⟩
  have := @h 1 (-1) (by norm_num); norm_num at this

/-- Naloga 2: f(x) = 2x − 3, g(x) = x² + 1. -/
def f2 (x : ℝ) : ℝ := 2 * x - 3
def g2 (x : ℝ) : ℝ := x ^ 2 + 1

/-- Naloga 2 a): f(1) = −1, (g ∘ f)(1) = g(−1) = 2; g(1) = 2, (f ∘ g)(1) = f(2) = 1 (vrednosti sta različni).
b) (g ∘ f)(x) = (2x − 3)² + 1 = 4x² − 12x + 10; (g ∘ f)(x) = 10 ⇔ 4x(x − 3) = 0 ⇔ x = 0 ali x = 3.
c) (g ∘ f)(0) = (g ∘ f)(3) = 10, zato g ∘ f ni injektivna. d) f narašča, f⁻¹(x) = (x + 3)/2,
f⁻¹(f(x)) = ((2x − 3) + 3)/2 = 2x/2 = x.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#matura2
besedilo: »Odgovor: $(g \circ f)(1) = 2$, $(f \circ g)(1) = 1$; $(g \circ f)(x) = 4x^2 - 12x + 10$, rešitvi enačbe sta $0$ in $3$; $g \circ f$ ni injektivna; $f^{-1}(x) = \dfrac{x + 3}{2}$.« -/
theorem matura2 :
    (f2 1 = -1 ∧ (g2 ∘ f2) 1 = 2 ∧ g2 1 = 2 ∧ (f2 ∘ g2) 1 = 1 ∧ (g2 ∘ f2) 1 ≠ (f2 ∘ g2) 1) ∧
    (∀ x, (g2 ∘ f2) x = (2 * x - 3) ^ 2 + 1 ∧ (2 * x - 3) ^ 2 + 1 = 4 * x ^ 2 - 12 * x + 10) ∧
    (∀ x, (g2 ∘ f2) x = 10 ↔ x = 0 ∨ x = 3) ∧ ((g2 ∘ f2) 0 = 10 ∧ (g2 ∘ f2) 3 = 10 ∧ ¬ Injective (g2 ∘ f2)) ∧
    (StrictMono f2 ∧ ∀ x y, y = f2 x ↔ x = (y + 3) / 2) ∧
    (∀ x, ((2 * x - 3) + 3) / 2 = 2 * x / 2 ∧ 2 * x / 2 = x ∧ (f2 x + 3) / 2 = x ∧ f2 ((x + 3) / 2) = x) := by
  refine ⟨⟨by simp [f2]; norm_num, by simp [f2, g2]; norm_num, by simp [g2]; norm_num, by simp [f2, g2]; norm_num,
    by simp [f2, g2]; norm_num⟩, fun x => ⟨rfl, by ring⟩, fun x => ?_, ⟨by simp [f2, g2]; norm_num,
    by simp [f2, g2]; norm_num, fun h => ?_⟩, ⟨fun a b h => by simp only [f2]; linarith,
    fun x y => ⟨fun h => by rw [h, f2]; ring, fun h => by rw [h, f2]; ring⟩⟩,
    fun x => ⟨by ring, by ring, by simp only [f2]; ring, by simp only [f2]; ring⟩⟩
  · simp only [comp_apply, f2, g2]
    constructor
    · intro h
      have : 4 * x * (x - 3) = 0 := by linear_combination h
      rcases mul_eq_zero.mp this with h1 | h1
      · left; linarith
      · right; linarith
    · rintro (rfl | rfl) <;> norm_num
  · have := @h 0 3 (by simp [f2, g2]; norm_num); norm_num at this

/-- Ustno vprašanje 3: za f(x) = x + 1 in g(x) = x² je (g ∘ f)(x) = (x + 1)², (f ∘ g)(x) = x² + 1; pri x = 1 sta
vrednosti 4 in 2, zato g ∘ f ≠ f ∘ g.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#ustno3
besedilo: »Za $f(x) = x + 1$ in $g(x) = x^2$ je $(g \circ f)(x) = (x + 1)^2$, $(f \circ g)(x) = x^2 + 1$.« -/
theorem ustno3 : ((fun x : ℝ => x ^ 2) ∘ (fun x : ℝ => x + 1)) 1 = (1 + 1) ^ 2 ∧ ((1:ℝ) + 1) ^ 2 = 4 ∧
    ((fun x : ℝ => x + 1) ∘ (fun x : ℝ => x ^ 2)) 1 = 1 ^ 2 + 1 ∧ (1:ℝ) ^ 2 + 1 = 2 ∧
    (fun x : ℝ => x ^ 2) ∘ (fun x : ℝ => x + 1) ≠ (fun x : ℝ => x + 1) ∘ (fun x : ℝ => x ^ 2) := by
  refine ⟨rfl, by norm_num, rfl, by norm_num, fun h => ?_⟩
  have := congrFun h 1; simp at this; norm_num at this

/-! ## Drugače: Korak za korakom -/

/-- Korak za korakom: f(x) = 2x − 6; ničla 3 (f(3) = 6 − 6 = 0); f(1) = −4, f(2) = −2, f(5) = 4 (narašča);
f(−1) = −8 (ni ne soda ne liha); f⁻¹(x) = (x + 6)/2, f⁻¹(4) = 10/2 = 5; (5, 4) → (4, 5), (3, 0) → (0, 3);
grafa se sekata v (6, 6).
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#korak
besedilo: »Preizkus inverzne.** $f(5) = 4$ in $f^{-1}(4) = \dfrac{10}{2} = 5$.« -/
theorem korak :
    (∀ x : ℝ, 2 * x - 6 = 0 ↔ x = 3) ∧ (2:ℝ) * 3 - 6 = 0 ∧ (2:ℝ) * 1 - 6 = -4 ∧ (2:ℝ) * 2 - 6 = -2 ∧
    (2:ℝ) * 5 - 6 = 4 ∧ (2:ℝ) * (-1) - 6 = -8 ∧ StrictMono (fun x : ℝ => 2 * x - 6) ∧
    (∀ x y : ℝ, y = 2 * x - 6 ↔ x = (y + 6) / 2) ∧ ((4:ℝ) + 6) / 2 = 10 / 2 ∧ (10:ℝ) / 2 = 5 ∧
    ((0:ℝ) + 6) / 2 = 3 ∧ (2:ℝ) * 6 - 6 = 6 ∧ ((6:ℝ) + 6) / 2 = 6 := by
  refine ⟨fun x => ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num, fun a b h => by simp only; linarith,
    fun x y => ⟨fun h => by rw [h]; ring, fun h => by rw [h]; ring⟩, by norm_num, by norm_num, by norm_num,
    by norm_num, by norm_num⟩

/-! ## Preveri se -/

/-- Preveri se, 1: x³ − 4x ima ničle −2, 0, 2, zato ni injektivna (liha funkcija nima nujno inverzne).
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#preveri1
besedilo: »Liha $x^3 - 4x$ ima ničle $-2$, $0$ in $2$, zato ni injektivna in nima inverzne.« -/
theorem preveri1 : (∀ x : ℝ, x ^ 3 - 4 * x = 0 ↔ x = -2 ∨ x = 0 ∨ x = 2) ∧ (∀ x : ℝ, (-x) ^ 3 - 4 * (-x) = -(x ^ 3 - 4 * x)) ∧
    ¬ Injective (fun x : ℝ => x ^ 3 - 4 * x) := by
  refine ⟨fun x => ?_, fun x => by ring, primer2.2.2.2.2.2.2⟩
  have : x ^ 3 - 4 * x = (x - (-2)) * x * (x - 2) := by ring
  rw [this]
  constructor
  · intro h
    rcases mul_eq_zero.mp h with h | h
    · rcases mul_eq_zero.mp h with h | h
      · left; linarith
      · right; left; exact h
    · right; right; linarith
  · rintro (rfl | rfl | rfl) <;> norm_num

/-- Preveri se, 2: f(x) = 2x − 1, g(x) = x²: (g ∘ f)(3) = g(5) = 25; f(g(3)) = f(9) = 17; g(3) · f(3) = 45.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#preveri2
besedilo: »Naj bo $f(x) = 2x - 1$ in $g(x) = x^2$. Koliko je $(g \circ f)(3)$?« -/
theorem preveri2 : ((fun x : ℝ => x ^ 2) ∘ (fun x : ℝ => 2 * x - 1)) 3 = 25 ∧
    ((fun x : ℝ => 2 * x - 1) ∘ (fun x : ℝ => x ^ 2)) 3 = 17 ∧ ((3:ℝ) ^ 2) * (2 * 3 - 1) = 45 := by
  simp; norm_num

/-- Preveri se, 3: inverz 3x + 6 je (x − 6)/3 = x/3 − 2 (ne x/3 − 6); f(1) = 9, f⁻¹(9) = 3 − 2 = 1.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#preveri3
besedilo: »Jan je iskal inverzno funkcijo $f(x) = 3x + 6$. Pisal je: (1) $y = 3x + 6$; (2) $x = \dfrac{y - 6}{3}$; (3) $f^{-1}(x) = \dfrac{x}{3} - 6$. Kje je napaka?« -/
theorem preveri3 (x : ℝ) : (∀ y : ℝ, y = 3 * x + 6 ↔ x = (y - 6) / 3) ∧ (x - 6) / 3 = x / 3 - 2 ∧
    (3:ℝ) * 1 + 6 = 9 ∧ (9:ℝ) / 3 - 2 = 1 ∧ (9:ℝ) / 3 - 6 ≠ 1 :=
  ⟨fun y => ⟨fun h => by rw [h]; ring, fun h => by rw [h]; ring⟩, by ring, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se, 4: x² ni injektivna ((−2)² = 2²), x³ je injektivna in ima inverz ∛x.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#preveri4
besedilo: »$x^3$ narašča na vsem $\mathbb{R}$ in je injektivna; inverzna je $\sqrt[3]{x}$. Pri $x^2$ je $f(-2) = f(2) = 4$.« -/
theorem preveri4 : ¬ Injective (fun x : ℝ => x ^ 2) ∧ Bijective (fun x : ℝ => x ^ 3) :=
  ⟨injektivnost.2, kub_bijektivna⟩

/-- Preveri se, 5: funkcija, ki ves čas pada, je injektivna (vsako vrednost doseže le enkrat).
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#preveri5
besedilo: »Funkcija, ki ves čas pada, vsako vrednost doseže le enkrat.« -/
theorem preveri5 (T : ℝ → ℝ) (h : StrictAnti T) : Injective T := h.injective

/-- Predpostavke trditve `preveri5` se dajo izpolniti. -/
example : StrictAnti (fun t : ℝ => 100 - t) := fun a b h => by simp only; linarith

/-- Predpostavke trditve `preveri5` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : StrictAnti (fun t : ℝ => 100 - t) := fun a b h => by simp only; linarith
  preveri5 (h := w)

/-- Preveri se, 6: x² + 1 ni injektivna (f(−1) = f(1) = 2) ne surjektivna (0 < 1 ni vrednost); |x| ni injektivna
(|−3| = |3|) ne surjektivna (−1); x³ + 1 je bijektivna (x = ∛(y − 1)); konstanta 5 ni injektivna ne surjektivna.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#preveri6
besedilo: »$x^3 + 1$ narašča na vsem $\mathbb{R}$, zato je injektivna. Vsak $y$ je vrednost pri $x = \sqrt[3]{y - 1}$, zato je surjektivna.« -/
theorem preveri6 :
    (¬ Injective (fun x : ℝ => x ^ 2 + 1) ∧ ¬ Surjective (fun x : ℝ => x ^ 2 + 1)) ∧
    (¬ Injective (fun x : ℝ => |x|) ∧ ¬ Surjective (fun x : ℝ => |x|)) ∧ Bijective (fun x : ℝ => x ^ 3 + 1) ∧
    (¬ Injective (fun _ : ℝ => (5:ℝ)) ∧ ¬ Surjective (fun _ : ℝ => (5:ℝ))) := by
  refine ⟨⟨fun h => ?_, fun h => ?_⟩, ⟨fun h => ?_, fun h => ?_⟩, ⟨?_, fun y => ⟨koren 3 (y - 1), ?_⟩⟩,
    ⟨fun h => ?_, fun h => ?_⟩⟩
  · have := @h (-1) 1 (by norm_num); norm_num at this
  · obtain ⟨x, hx⟩ := h 0; simp only at hx; nlinarith [sq_nonneg x]
  · have := @h (-3) 3 (by norm_num); norm_num at this
  · obtain ⟨x, hx⟩ := h (-1); simp only at hx; have := abs_nonneg x; linarith
  · intro a b hab; simp only at hab
    exact injektivnost.1 (by simp only; linarith)
  · simp only; rw [koren_lih_pot (n := 3) ⟨1, rfl⟩]; ring
  · have := @h 0 1 rfl; norm_num at this
  · obtain ⟨x, hx⟩ := h 0; norm_num at hx

/-- Preveri se, 7: v = √(2E_k/m) = √(200/8) = √25 = 5 m/s (pri m = 8, E_k = 100); 100 = 8v²/2 ⇔ v = ±5;
napačno: 25 je v², √(100/8) ≈ 3,54.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#preveri7
besedilo: »$v = \sqrt{\dfrac{2E_k}{m}} = \sqrt{\dfrac{200}{8}} = \sqrt{25} = 5\,\mathrm{m/s}$« -/
theorem preveri7 (v : ℝ) : √(2 * 100 / 8 : ℝ) = √25 ∧ √(25:ℝ) = 5 ∧ ((100:ℝ) = 8 * v ^ 2 / 2 ↔ v = -5 ∨ v = 5) ∧
    (0 ≤ v → ((100:ℝ) = 8 * v ^ 2 / 2 ↔ v = 5)) ∧ 3.535 < √((100:ℝ) / 8) ∧ √((100:ℝ) / 8) < 3.545 := by
  have s25 : √(25:ℝ) = 5 := by rw [show (25:ℝ) = 5 ^ 2 by norm_num]; exact Real.sqrt_sq (by norm_num)
  have key : (100:ℝ) = 8 * v ^ 2 / 2 ↔ v = -5 ∨ v = 5 := by
    rw [show ((100:ℝ) = 8 * v ^ 2 / 2) ↔ v ^ 2 = 5 ^ 2 from ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
      sq_eq_sq_iff_eq_or_eq_neg]
    tauto
  refine ⟨by norm_num, s25, key, fun hv => ?_, (Real.lt_sqrt (by norm_num)).mpr (by norm_num),
    (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)⟩
  rw [key]; constructor
  · rintro (h | h)
    · linarith
    · exact h
  · intro h; right; exact h

/-- Preveri se, 8: αΔT = 1,2 · 10⁻⁵ · 50 = 0,0006, l₀ = l/(1 + αΔT) = 2,0012/1,0006 = 2 m; napačno
2,0012 − 0,0006 = 2,0006 in 2,0012/0,0006 ≈ 3335,33.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#preveri8
besedilo: »$\alpha \Delta T = 1{,}2 \cdot 10^{-5} \cdot 50 = 0{,}0006$, zato $l_0 = \dfrac{l}{1 + \alpha \Delta T} = \dfrac{2{,}0012}{1{,}0006} = 2\,\mathrm{m}$.« -/
theorem preveri8 : (1.2:ℝ) * 10 ^ (-5:ℤ) * 50 = 0.0006 ∧ (2.0012:ℝ) / (1 + 0.0006) = 2 ∧
    (2.0012:ℝ) - 0.0006 = 2.0006 ∧ 3335.325 < (2.0012:ℝ) / 0.0006 ∧ (2.0012:ℝ) / 0.0006 < 3335.335 ∧
    ((2:ℝ) = 2.0012 / (1 + 1.2 * 10 ^ (-5:ℤ) * 50) ↔ (2.0012:ℝ) = 2 + 1.2 * 10 ^ (-5:ℤ) * 2 * 50) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  have h := (izrazanje_l0 2.0012 2 (1.2 * 10 ^ (-5:ℤ)) 50 (by norm_num)).2
  exact h.symm

/-! ## RACUN -/

/-- RACUN: 1/(1/R − 1/R₁) = R R₁/(R₁ − R) (R, R₁ ≠ 0, R ≠ R₁); (l/(1 + ad))(1 + ad) = l (1 + ad ≠ 0);
4x² − 12x + 10 = 10 ⇔ x ∈ {0, 3}; 2((x + 3)/2) − 3 = x.
trditev: MAT-SS-2/funkcije-in-njihove-lastnosti#racun
besedilo: »$(g \circ f)(x) = g(2x - 3) = (2x - 3)^2 + 1 = 4x^2 - 12x + 10$« -/
theorem racun (R R1 l a d x : ℝ) (hR : R ≠ 0) (hR1 : R1 ≠ 0) (hRR : R1 - R ≠ 0) (had : 1 + a * d ≠ 0) :
    1 / (1 / R - 1 / R1) = R * R1 / (R1 - R) ∧ (l / (1 + a * d)) * (1 + a * d) = l ∧
    (4 * x ^ 2 - 12 * x + 10 = 10 ↔ x = 0 ∨ x = 3) ∧ 2 * ((x + 3) / 2) - 3 = x := by
  refine ⟨by field_simp, by field_simp, ?_, by ring⟩
  constructor
  · intro h
    have : 4 * x * (x - 3) = 0 := by linear_combination h
    rcases mul_eq_zero.mp this with h1 | h1
    · left; linarith
    · right; linarith
  · rintro (rfl | rfl) <;> norm_num

/-- Predpostavke trditve `racun` se dajo izpolniti. -/
example : (1:ℝ) ≠ 0 ∧ (2:ℝ) ≠ 0 ∧ (2:ℝ) - 1 ≠ 0 ∧ (1:ℝ) + 0 * 0 ≠ 0 := by norm_num

end Evklid.Lekcije.MAT_SS_2.FunkcijeInNjihoveLastnosti
/-- Predpostavke trditve `racun` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (1:ℝ) ≠ 0 ∧ (2:ℝ) ≠ 0 ∧ (2:ℝ) - 1 ≠ 0 ∧ (1:ℝ) + 0 * 0 ≠ 0 := by norm_num
  racun (hR := w.1) (hR1 := w.2.1) (hRR := w.2.2.1) (had := w.2.2.2)

