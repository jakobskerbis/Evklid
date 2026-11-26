/-
vir: content/lessons/MAT-SS-2/ekstremalni-problemi-s-kvadratno-funkcijo.md
sha256: da08a036975d77190dff48e5e75d1f25dd3898381b55907e4a0ab70215ac4cf9
Ni v Leanu: primerjalna tabela »Doslej/Zdaj« ter opisa »brez zveze bi ostali dve neznanki« in »P = x·y ni
funkcija ene spremenljivke« (opisi metode, ne računske trditve); risbe, simulacija in drsnik (opisi; dokazane so vrednosti, simetrija P(3) = P(7) in
maksimum); postopek reševanja v korakih (Razlaga 6, Ponovitev, Ustno vprašanje 1) in nasveti (skica,
»odgovor z enoto«); modeliranje iz besedila (ograja, podobnost trikotnikov, anketa »20 ljudi na evro«,
Pitagorov izrek za kolesarja, sadovnjak) kot prevod besedila v predpis: dokazano je, da iz zapisanih zvez
sledijo predpisi, in vsa računska vsebina; trditev »model je le približek«; točkovanje; besedilo
napačnih odgovorov v Preveri se (dokazani so pravilni odgovori in, kjer gre, da napačni ne ustrezajo);
»skoraj trikrat več« je dokazano kot 25/9 < 3 in 25/9 > 2,7.
Pri Primeru 2 (y/(8 − x) = 6/8) je pogoj x ≠ 8 zapisan, ker je v Leanu y/0 = 0.
Približki so dokazani kot ocene napake zaokrožitve. Decimalna števila so točna racionalna števila v ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.EkstremalniProblemiSKvadratnoFunkcijo

open Set

/-! ## Splošna pravila -/

/-- Razlaga 1, Povzetek, Ponovitev: za a < 0 je q največja vrednost a(x − p)² + q (dosežena pri x = p),
za a > 0 najmanjša. -/
theorem ekstrem_v_temenu (a p q : ℝ) :
    (a < 0 → (∀ x, a * (x - p) ^ 2 + q ≤ q) ∧ a * (p - p) ^ 2 + q = q) ∧
      (0 < a → (∀ x, q ≤ a * (x - p) ^ 2 + q) ∧ a * (p - p) ^ 2 + q = q) := by
  refine ⟨fun ha => ⟨fun x => by nlinarith [sq_nonneg (x - p)], by ring⟩,
    fun ha => ⟨fun x => by nlinarith [sq_nonneg (x - p)], by ring⟩⟩

/-- Pomožno: za a ≠ 0 je a(x − p)² + q = q natanko pri x = p (ekstrem je dosežen le v temenu). -/
theorem le_v_temenu (a p q x : ℝ) (ha : a ≠ 0) : a * (x - p) ^ 2 + q = q ↔ x = p := by
  constructor
  · intro h
    have h2 : a * (x - p) ^ 2 = 0 := by linarith
    have := (mul_eq_zero.mp h2).resolve_left ha
    linarith [pow_eq_zero_iff (n := 2) two_ne_zero |>.mp this]
  · rintro rfl; ring

/-- Predpostavka `le_v_temenu` se da izpolniti (a = 1). -/
example : (1 : ℝ) * (0 - 0) ^ 2 + 0 = 0 ↔ (0 : ℝ) = 0 := le_v_temenu 1 0 0 0 one_ne_zero

/-- Pogoste napake 4: pri a > 0 največje vrednosti na vseh realnih številih ni (za vsak M je kakšna
vrednost večja); pri a < 0 ni najmanjše. -/
theorem ni_drugega_ekstrema (a p q : ℝ) :
    (0 < a → ∀ M, ∃ x, M < a * (x - p) ^ 2 + q) ∧ (a < 0 → ∀ M, ∃ x, a * (x - p) ^ 2 + q < M) := by
  refine ⟨fun ha M => ?_, fun ha M => ?_⟩
  · refine ⟨p + |M - q| / a + 1, ?_⟩
    have h1 : 0 ≤ |M - q| / a := div_nonneg (abs_nonneg _) ha.le
    have h2 : a * (|M - q| / a) = |M - q| := by field_simp
    have h3 : M - q ≤ |M - q| := le_abs_self _
    rw [show p + |M - q| / a + 1 - p = |M - q| / a + 1 by ring]
    nlinarith [mul_nonneg ha.le (mul_nonneg h1 h1)]
  · refine ⟨p + |M - q| / (-a) + 1, ?_⟩
    have ha' : 0 < -a := by linarith
    have ha0 : a ≠ 0 := ha.ne
    have h1 : 0 ≤ |M - q| / (-a) := div_nonneg (abs_nonneg _) ha'.le
    have h2 : -a * (|M - q| / (-a)) = |M - q| := by field_simp
    have h3 : q - M ≤ |M - q| := by rw [abs_sub_comm]; exact le_abs_self _
    rw [show p + |M - q| / (-a) + 1 - p = |M - q| / (-a) + 1 by ring]
    nlinarith [mul_nonneg ha'.le (mul_nonneg h1 h1)]

/-- Pomožno (Razlaga 5): za x ∈ [m, n] je (x − p)² ≤ (m − p)² ali (x − p)² ≤ (n − p)². -/
theorem kvadrat_na_intervalu (p m n x : ℝ) (hx : x ∈ Icc m n) :
    (x - p) ^ 2 ≤ (m - p) ^ 2 ∨ (x - p) ^ 2 ≤ (n - p) ^ 2 := by
  rcases le_total x p with h | h
  · left; nlinarith [mul_nonneg (sub_nonneg.2 hx.1) (by linarith [hx.1] : (0 : ℝ) ≤ 2 * p - x - m)]
  · right; nlinarith [mul_nonneg (sub_nonneg.2 hx.2) (by linarith [hx.2] : (0 : ℝ) ≤ n + x - 2 * p)]

/-- Predpostavka `kvadrat_na_intervalu` se da izpolniti (x = 0 ∈ [0, 1]). -/
example : ((0 : ℝ) - 0) ^ 2 ≤ (0 - 0) ^ 2 ∨ ((0 : ℝ) - 0) ^ 2 ≤ (1 - 0) ^ 2 :=
  kvadrat_na_intervalu 0 0 1 0 ⟨le_rfl, zero_le_one⟩

/-- Razlaga 5, Povzetek, Ponovitev (pravilo za [m, n]): za f(x) = a(x − p)² + q in x ∈ [m, n] velja:
pri a ≤ 0 je min(f(m), f(n)) ≤ f(x) ≤ q, pri a ≥ 0 je q ≤ f(x) ≤ max(f(m), f(n)). Če teme leži v
intervalu, je q dosežen; največja in najmanjša vrednost sta torej med f(p), f(m), f(n). -/
theorem pravilo_mn (a p q m n x : ℝ) (hx : x ∈ Icc m n) :
    (a ≤ 0 → min (a * (m - p) ^ 2 + q) (a * (n - p) ^ 2 + q) ≤ a * (x - p) ^ 2 + q ∧
      a * (x - p) ^ 2 + q ≤ q) ∧
    (0 ≤ a → q ≤ a * (x - p) ^ 2 + q ∧
      a * (x - p) ^ 2 + q ≤ max (a * (m - p) ^ 2 + q) (a * (n - p) ^ 2 + q)) ∧
    (p ∈ Icc m n → ∃ y ∈ Icc m n, a * (y - p) ^ 2 + q = q) := by
  refine ⟨fun ha => ⟨?_, by nlinarith [mul_nonpos_of_nonpos_of_nonneg ha (sq_nonneg (x - p))]⟩,
    fun ha => ⟨by nlinarith [mul_nonneg ha (sq_nonneg (x - p))], ?_⟩, fun hp => ⟨p, hp, by ring⟩⟩
  · rcases kvadrat_na_intervalu p m n x hx with h | h
    · exact min_le_of_left_le (by nlinarith [mul_le_mul_of_nonpos_left h ha])
    · exact min_le_of_right_le (by nlinarith [mul_le_mul_of_nonpos_left h ha])
  · rcases kvadrat_na_intervalu p m n x hx with h | h
    · exact le_max_of_le_left (by nlinarith [mul_le_mul_of_nonneg_left h ha])
    · exact le_max_of_le_right (by nlinarith [mul_le_mul_of_nonneg_left h ha])

/-- Predpostavka `pravilo_mn` se da izpolniti (x = 0 ∈ [0, 1]). -/
example : (0 : ℝ) ≤ 1 * (0 - 0) ^ 2 + 0 := ((pravilo_mn 1 0 0 0 1 0 ⟨le_rfl, zero_le_one⟩).2.1 zero_le_one).1

/-- Razlaga 5, premisli, Ustno vprašanje 3: če teme ne leži v notranjosti [m, n] (n ≤ p ali p ≤ m),
ležijo vse vrednosti f(x) = a(x − p)² + q na [m, n] med f(m) in f(n), ekstrema sta v krajiščih
(monotonost glej `krajisca_monotona`). -/
theorem krajisca (a p q m n x : ℝ) (hx : x ∈ Icc m n) (hp : n ≤ p ∨ p ≤ m) :
    min (a * (m - p) ^ 2 + q) (a * (n - p) ^ 2 + q) ≤ a * (x - p) ^ 2 + q ∧
      a * (x - p) ^ 2 + q ≤ max (a * (m - p) ^ 2 + q) (a * (n - p) ^ 2 + q) := by
  obtain ⟨hm, hn⟩ := hx
  have key : ((n - p) ^ 2 ≤ (x - p) ^ 2 ∧ (x - p) ^ 2 ≤ (m - p) ^ 2) ∨
      ((m - p) ^ 2 ≤ (x - p) ^ 2 ∧ (x - p) ^ 2 ≤ (n - p) ^ 2) := by
    rcases hp with hp | hp
    · left
      constructor
      · nlinarith [mul_nonneg (sub_nonneg.2 hn) (by linarith : (0 : ℝ) ≤ 2 * p - x - n)]
      · nlinarith [mul_nonneg (sub_nonneg.2 hm) (by linarith : (0 : ℝ) ≤ 2 * p - x - m)]
    · right
      constructor
      · nlinarith [mul_nonneg (sub_nonneg.2 hm) (by linarith : (0 : ℝ) ≤ x + m - 2 * p)]
      · nlinarith [mul_nonneg (sub_nonneg.2 hn) (by linarith : (0 : ℝ) ≤ n + x - 2 * p)]
  rcases le_total 0 a with ha | ha <;> rcases key with ⟨k1, k2⟩ | ⟨k1, k2⟩
  · exact ⟨min_le_of_right_le (by nlinarith [mul_le_mul_of_nonneg_left k1 ha]),
      le_max_of_le_left (by nlinarith [mul_le_mul_of_nonneg_left k2 ha])⟩
  · exact ⟨min_le_of_left_le (by nlinarith [mul_le_mul_of_nonneg_left k1 ha]),
      le_max_of_le_right (by nlinarith [mul_le_mul_of_nonneg_left k2 ha])⟩
  · exact ⟨min_le_of_left_le (by nlinarith [mul_le_mul_of_nonpos_left k2 ha]),
      le_max_of_le_right (by nlinarith [mul_le_mul_of_nonpos_left k1 ha])⟩
  · exact ⟨min_le_of_right_le (by nlinarith [mul_le_mul_of_nonpos_left k2 ha]),
      le_max_of_le_left (by nlinarith [mul_le_mul_of_nonpos_left k1 ha])⟩

/-- Predpostavke `krajisca` se dajo izpolniti (x = 0 ∈ [0, 1], p = 2). -/
example : min ((1 : ℝ) * (0 - 2) ^ 2 + 0) (1 * (1 - 2) ^ 2 + 0) ≤ 1 * (0 - 2) ^ 2 + 0 :=
  (krajisca 1 2 0 0 1 0 ⟨le_rfl, zero_le_one⟩ (Or.inl one_le_two)).1

/-- Razlaga 5, premisli, Ustno vprašanje 3: če teme ne leži v notranjosti [m, n] (n ≤ p ali p ≤ m), je
f(x) = a(x − p)² + q na [m, n] monotona (naraščajoča ali padajoča). -/
theorem krajisca_monotona (a p q m n : ℝ) (hp : n ≤ p ∨ p ≤ m) :
    MonotoneOn (fun x => a * (x - p) ^ 2 + q) (Icc m n) ∨
      AntitoneOn (fun x => a * (x - p) ^ 2 + q) (Icc m n) := by
  rcases hp with hp | hp <;> rcases le_total 0 a with ha | ha
  · right
    intro x hx y hy hxy
    show a * (y - p) ^ 2 + q ≤ a * (x - p) ^ 2 + q
    nlinarith [mul_nonneg (mul_nonneg ha (sub_nonneg.2 hxy))
      (by linarith [hx.2, hy.2] : (0 : ℝ) ≤ 2 * p - x - y)]
  · left
    intro x hx y hy hxy
    show a * (x - p) ^ 2 + q ≤ a * (y - p) ^ 2 + q
    nlinarith [mul_nonneg (mul_nonneg (neg_nonneg.2 ha) (sub_nonneg.2 hxy))
      (by linarith [hx.2, hy.2] : (0 : ℝ) ≤ 2 * p - x - y)]
  · left
    intro x hx y hy hxy
    show a * (x - p) ^ 2 + q ≤ a * (y - p) ^ 2 + q
    nlinarith [mul_nonneg (mul_nonneg ha (sub_nonneg.2 hxy))
      (by linarith [hx.1, hy.1] : (0 : ℝ) ≤ x + y - 2 * p)]
  · right
    intro x hx y hy hxy
    show a * (y - p) ^ 2 + q ≤ a * (x - p) ^ 2 + q
    nlinarith [mul_nonneg (mul_nonneg (neg_nonneg.2 ha) (sub_nonneg.2 hxy))
      (by linarith [hx.1, hy.1] : (0 : ℝ) ≤ x + y - 2 * p)]

/-- Predpostavka `krajisca_monotona` se da izpolniti ([0, 1], p = 2). -/
example : MonotoneOn (fun x : ℝ => 1 * (x - 2) ^ 2 + 0) (Icc 0 1) ∨
    AntitoneOn (fun x : ℝ => 1 * (x - 2) ^ 2 + 0) (Icc 0 1) :=
  krajisca_monotona 1 2 0 0 1 (Or.inl one_le_two)

/-- Razlaga 4, Povzetek, Ustno vprašanje 2: pri obsegu 2s sta stranici x in s − x, ploščina
x(s − x) = s²/4 − (x − s/2)² ≤ s²/4, enakost le pri x = s/2 (takrat je tudi druga stranica s/2:
kvadrat). -/
theorem kvadrat_najvecji (s x : ℝ) : x * (s - x) = -x ^ 2 + s * x ∧
    -x ^ 2 + s * x = s ^ 2 / 4 - (x - s / 2) ^ 2 ∧ x * (s - x) ≤ s ^ 2 / 4 ∧
    (x * (s - x) = s ^ 2 / 4 ↔ x = s / 2) ∧ s - s / 2 = s / 2 := by
  refine ⟨by ring, by ring, by nlinarith [sq_nonneg (x - s / 2)], ⟨fun h => ?_, fun h => ?_⟩, by ring⟩
  · have h0 : (x - s / 2) ^ 2 = 0 := by nlinarith
    have := pow_eq_zero_iff (n := 2) (by norm_num) |>.1 h0
    linarith
  · subst h; ring

/-- Povzetek (ograja ob steni): pri ograji dolžine L > 0 in treh stranicah x, x, L − 2x je ploščina
x(L − 2x) največja pri x = L/4 (in le tam); stranica ob steni L − 2·(L/4) = L/2 je dvakrat daljša od
drugih dveh. -/
theorem ograja_ob_steni (L : ℝ) (_hL : 0 < L) :
    (∀ x : ℝ, x * (L - 2 * x) ≤ L / 4 * (L - 2 * (L / 4))) ∧
      (∀ x : ℝ, x * (L - 2 * x) = L / 4 * (L - 2 * (L / 4)) ↔ x = L / 4) ∧
      L - 2 * (L / 4) = 2 * (L / 4) := by
  refine ⟨fun x => by nlinarith [sq_nonneg (x - L / 4)], fun x => ?_, by ring⟩
  rw [show x * (L - 2 * x) = -2 * (x - L / 4) ^ 2 + L / 4 * (L - 2 * (L / 4)) by ring]
  exact le_v_temenu _ _ _ _ (by norm_num)

/-- Predpostavka `ograja_ob_steni` se da izpolniti (L = 40). -/
example : (40 : ℝ) - 2 * (40 / 4) = 2 * (40 / 4) := (ograja_ob_steni 40 (by norm_num)).2.2

/-- Pomožno (Primer 2, Preveri se 4): pravokotnik s stranico x na kateti a in ogliščem na hipotenuzi
pravokotnega trikotnika s katetama a, b > 0 ima ploščino b·x·(1 − x/a) ≤ ab/4 = polovica ploščine
trikotnika; največja je pri x = a/2 (druga stranica b/2). -/
theorem pravokotnik_v_trikotniku (a b : ℝ) (ha : 0 < a) (hb : 0 < b) :
    (∀ x : ℝ, b * x * (1 - x / a) ≤ a * b / 4) ∧ b * (a / 2) * (1 - a / 2 / a) = a * b / 4 ∧
      b * (1 - a / 2 / a) = b / 2 ∧ a * b / 4 = (a * b / 2) / 2 := by
  have ha0 : a ≠ 0 := ha.ne'
  refine ⟨fun x => ?_, by field_simp; ring, by field_simp; ring, by ring⟩
  have e : a * b / 4 - b * x * (1 - x / a) = b / a * (x - a / 2) ^ 2 := by field_simp; ring
  have : 0 ≤ b / a * (x - a / 2) ^ 2 := by positivity
  linarith

/-- Predpostavki `pravokotnik_v_trikotniku` se dasta izpolniti (a = 8, b = 6). -/
example : (8 : ℝ) * 6 / 4 = 8 * 6 / 2 / 2 := (pravokotnik_v_trikotniku 8 6 (by norm_num) (by norm_num)).2.2.2

/-! ## Razlaga -/

/-- Razlaga 2 (tabela): 2·18 = 36, 6·14 = 84, 10·10 = 100, 14·6 = 84, 18·2 = 36; vrednosti so simetrične
okoli x = 10: P(10 + d) = P(10 − d). -/
theorem tabela : (2 : ℝ) * (20 - 2) = 36 ∧ (6 : ℝ) * (20 - 6) = 84 ∧ (10 : ℝ) * (20 - 10) = 100 ∧
    (14 : ℝ) * (20 - 14) = 84 ∧ (18 : ℝ) * (20 - 18) = 36 ∧
    ∀ d : ℝ, (10 + d) * (20 - (10 + d)) = (10 - d) * (20 - (10 - d)) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, fun d => by ring⟩

/-- Razlaga 2–3: P(x) = x(20 − x) = −x² + 20x = −(x² − 20x + 100) + 100 = −(x − 10)² + 100; P(x) ≤ 100,
enakost le pri x = 10; p = −20/(2·(−1)) = 10 = (0 + 20)/2. -/
theorem vsota_20 (x : ℝ) : x * (20 - x) = -x ^ 2 + 20 * x ∧
    -x ^ 2 + 20 * x = -(x ^ 2 - 20 * x + 100) + 100 ∧ -(x ^ 2 - 20 * x + 100) + 100 = -(x - 10) ^ 2 + 100 ∧
    x * (20 - x) ≤ 100 ∧ (x * (20 - x) = 100 ↔ x = 10) ∧ -(20 : ℝ) / (2 * (-1)) = 10 ∧
    ((0 : ℝ) + 20) / 2 = 10 := by
  obtain ⟨_, _, h3, h4, _⟩ := kvadrat_najvecji 20 x
  refine ⟨by ring, by ring, by ring, by norm_num at h3; linarith, ?_, by norm_num, by norm_num⟩
  have := h4
  norm_num at this
  exact this

/-- Razlaga 3, premisli: na vseh realnih številih zmnožek nima najmanjše vrednosti (P(30) = 30·(−10) =
−300, za vsak M je kakšna vrednost manjša); pri x ∈ [0, 20] je najmanjši zmnožek 0, v krajiščih. -/
theorem vsota_20_minimum : (30 : ℝ) * (20 - 30) = -300 ∧ (∀ M : ℝ, ∃ x : ℝ, x * (20 - x) < M) ∧
    (∀ x ∈ Icc (0 : ℝ) 20, 0 ≤ x * (20 - x)) ∧ (0 : ℝ) * (20 - 0) = 0 ∧ (20 : ℝ) * (20 - 20) = 0 := by
  refine ⟨by norm_num, fun M => ?_, fun x hx => mul_nonneg hx.1 (by linarith [hx.2]), by norm_num,
    by norm_num⟩
  obtain ⟨x, hx⟩ := (ni_drugega_ekstrema (-1) 10 100).2 (by norm_num) M
  exact ⟨x, by linarith [show x * (20 - x) = -1 * (x - 10) ^ 2 + 100 by ring]⟩

/-- Razlaga 4: pravokotnik z obsegom 40 m: stranici x in 20 − x (2(x + (20 − x)) = 40), največja ploščina
je pri x = 10: kvadrat 10 m × 10 m, 100 m². -/
theorem obseg_40 (x : ℝ) : 2 * (x + (20 - x)) = 40 ∧ x * (20 - x) ≤ 10 * (20 - 10) ∧ (20 : ℝ) - 10 = 10 := by
  refine ⟨by ring, ?_, by norm_num⟩
  nlinarith [sq_nonneg (x - 10)]

/-- Razlaga 5: na pasu širine 6 m je x ∈ (0, 6]; teme 10 ni v območju; največja ploščina je v krajišču:
P(x) ≤ P(6) = 6·14 = 84 za vse x ∈ (0, 6]. Premisli: P na (−∞, 10] narašča; pri pasu 12 m je teme v
območju (0, 12] in odgovor spet kvadrat 10 × 10. -/
theorem pas_6m : (10 : ℝ) ∉ Ioc 0 6 ∧ (∀ x ∈ Ioc (0 : ℝ) 6, x * (20 - x) ≤ 6 * (20 - 6)) ∧
    (6 : ℝ) * (20 - 6) = 6 * 14 ∧ (6 : ℝ) * 14 = 84 ∧
    StrictMonoOn (fun x : ℝ => x * (20 - x)) (Iic 10) ∧ (10 : ℝ) ∈ Ioc 0 12 ∧
    ∀ x ∈ Ioc (0 : ℝ) 12, x * (20 - x) ≤ 10 * (20 - 10) := by
  refine ⟨fun h => by norm_num at h, fun x hx => ?_, by norm_num, by norm_num, fun x hx y hy hxy => ?_,
    by norm_num, fun x _ => by nlinarith [sq_nonneg (x - 10)]⟩
  · nlinarith [mul_nonneg (sub_nonneg.2 hx.2) (by linarith [hx.2] : (0 : ℝ) ≤ 14 - x)]
  · simp only [mem_Iic] at hx hy
    show x * (20 - x) < y * (20 - y)
    nlinarith [mul_pos (sub_pos.2 hxy) (by linarith : (0 : ℝ) < 20 - x - y)]

/-! ## Rešeni primeri -/

/-- Primer 1: P(x) = x(40 − 2x) = −2x² + 40x; območje x > 0 in 40 − 2x > 0 ⇔ 0 < x < 20 (`RACUN`:
x(40 − 2x) > 0 ⇔ 0 < x < 20); p = −40/(2·(−2)) = 10; 40 − 2·10 = 20; P(10) = 10·20 = 200 je največja
vrednost (enakost le pri x = 10). -/
theorem primer1 (x : ℝ) : x * (40 - 2 * x) = -2 * x ^ 2 + 40 * x ∧
    ((0 < x ∧ 0 < 40 - 2 * x) ↔ 0 < x ∧ x < 20) ∧ (0 < x * (40 - 2 * x) ↔ 0 < x ∧ x < 20) ∧
    -(40 : ℝ) / (2 * (-2)) = 10 ∧ (40 : ℝ) - 2 * 10 = 20 ∧ (10 : ℝ) * (40 - 2 * 10) = 10 * 20 ∧
    (10 : ℝ) * 20 = 200 ∧ x * (40 - 2 * x) ≤ 200 ∧ (x * (40 - 2 * x) = 200 ↔ x = 10) := by
  refine ⟨by ring, by constructor <;> rintro ⟨h1, h2⟩ <;> exact ⟨h1, by linarith⟩, ⟨fun h => ?_, fun h => ?_⟩,
    by norm_num, by norm_num, by norm_num, by norm_num, by nlinarith [sq_nonneg (x - 10)],
    ⟨fun h => ?_, fun h => by subst h; norm_num⟩⟩
  · by_contra hc
    rw [not_and_or] at hc
    rcases hc with hc | hc
    · push Not at hc; nlinarith
    · push Not at hc; nlinarith
  · exact mul_pos h.1 (by linarith [h.2])
  · have : (x - 10) ^ 2 = 0 := by nlinarith
    have := pow_eq_zero_iff (n := 2) (by norm_num) |>.1 this
    linarith

/-- Primer 2, koraka 1–2: iz y/(8 − x) = 6/8 (x ≠ 8) sledi y = 3/4·(8 − x) = 6 − 3/4·x. -/
theorem primer2_zveza (x y : ℝ) (hx : x ≠ 8) :
    y / (8 - x) = 6 / 8 ↔ y = 3 / 4 * (8 - x) ∧ 3 / 4 * (8 - x) = 6 - 3 / 4 * x := by
  have h : (8 : ℝ) - x ≠ 0 := sub_ne_zero.mpr (Ne.symm hx)
  rw [div_eq_iff h]
  constructor
  · intro e; exact ⟨by linarith, by ring⟩
  · rintro ⟨e, -⟩; rw [e]; ring

/-- Predpostavka `primer2_zveza` se da izpolniti (x = 4, y = 3). -/
example : (3 : ℝ) / (8 - 4) = 6 / 8 := ((primer2_zveza 4 3 (by norm_num)).2 ⟨by norm_num, by norm_num⟩)

/-- Primer 2, koraki 3–6: P(x) = x(6 − 3x/4) = −3/4·x² + 6x; ničli 0 in 8, p = (0 + 8)/2 = 4 =
−6/(2·(−3/4)); y = 6 − 3/4·4 = 3; P(4) = 4·3 = 12 je največja vrednost; 12 je polovica ploščine
8·6/2 = 24; stranici sta polovici katet. Največja vrednost je dosežena le pri x = 4. -/
theorem primer2 (x : ℝ) : x * (6 - 3 / 4 * x) = -3 / 4 * x ^ 2 + 6 * x ∧ ((0 : ℝ) + 8) / 2 = 4 ∧
    -(6 : ℝ) / (2 * (-3 / 4)) = 4 ∧ (6 : ℝ) - 3 / 4 * 4 = 3 ∧ (4 : ℝ) * 3 = 12 ∧
    x * (6 - 3 / 4 * x) ≤ 12 ∧ (x * (6 - 3 / 4 * x) = 12 ↔ x = 4) ∧
    (8 : ℝ) * 6 / 2 = 24 ∧ (12 : ℝ) = 24 / 2 ∧ (4 : ℝ) = 8 / 2 ∧ (3 : ℝ) = 6 / 2 := by
  refine ⟨by ring, by norm_num, by norm_num, by norm_num, by norm_num, by nlinarith [sq_nonneg (x - 4)],
    ?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  rw [show x * (6 - 3 / 4 * x) = -3 / 4 * (x - 4) ^ 2 + 12 by ring]
  exact le_v_temenu _ _ _ _ (by norm_num)

/-- Primer 2 (območje): pozitivni stranici x > 0 in y = 6 − 3/4·x > 0 ⇔ 0 < x < 8. -/
theorem primer2_obmocje (x : ℝ) : (0 < x ∧ 0 < 6 - 3 / 4 * x) ↔ 0 < x ∧ x < 8 := by
  constructor <;> rintro ⟨h1, h2⟩ <;> exact ⟨h1, by linarith⟩

/-- Primer 3, koraki 1–3: N(x) = 300 − 20(x − 8) = 460 − 20x, N(8) = 300; R(x) = x(460 − 20x) = −20x² + 460x;
območje x ≥ 0 in 460 − 20x ≥ 0 ⇔ x ∈ [0, 23]. -/
theorem primer3_model (x : ℝ) : 300 - 20 * (x - 8) = 460 - 20 * x ∧ (460 : ℝ) - 20 * 8 = 300 ∧
    (x < 8 → 300 < 460 - 20 * x) ∧ x * (460 - 20 * x) = -20 * x ^ 2 + 460 * x ∧
    ((0 ≤ x ∧ 0 ≤ 460 - 20 * x) ↔ x ∈ Icc 0 23) := by
  refine ⟨by ring, by norm_num, fun h => by linarith, by ring, ?_⟩
  rw [mem_Icc]
  constructor <;> rintro ⟨h1, h2⟩ <;> exact ⟨h1, by linarith⟩

/-- Primer 3 a): p = −460/(2·(−20)) = 11,5 ∈ [0, 23]; N(11,5) = 230, R(11,5) = 11,5·230 = 2645 je
največji prihodek (dosežen le pri x = 11,5); zdaj 8·300 = 2400, razlika 245. -/
theorem primer3a : -(460 : ℝ) / (2 * (-20)) = 11.5 ∧ (11.5 : ℝ) ∈ Icc 0 23 ∧ (460 : ℝ) - 20 * 11.5 = 230 ∧
    (11.5 : ℝ) * 230 = 2645 ∧ (∀ x : ℝ, x * (460 - 20 * x) ≤ 2645) ∧
    (∀ x : ℝ, x * (460 - 20 * x) = 2645 ↔ x = 11.5) ∧ (8 : ℝ) * 300 = 2400 ∧
    (2645 : ℝ) - 2400 = 245 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, fun x => by nlinarith [sq_nonneg (x - 11.5)],
    fun x => ?_, by norm_num, by norm_num⟩
  rw [show x * (460 - 20 * x) = -20 * (x - 11.5) ^ 2 + 2645 by ring]
  exact le_v_temenu _ _ _ _ (by norm_num)

/-- Primer 3 b): na [0, 10] teme 11,5 ni; R narašča levo od temena, največji prihodek je v krajišču
x = 10: N(10) = 460 − 200 = 260, R(10) = 10·260 = 2600 ≥ R(x); R(0) = 0. -/
theorem primer3b : (11.5 : ℝ) ∉ Icc 0 10 ∧ (∀ x ∈ Icc (0 : ℝ) 10, x * (460 - 20 * x) ≤ 2600) ∧
    (460 : ℝ) - 20 * 10 = 460 - 200 ∧ (460 : ℝ) - 200 = 260 ∧ (10 : ℝ) * 260 = 2600 ∧
    (0 : ℝ) * (460 - 20 * 0) = 0 ∧ StrictMonoOn (fun x : ℝ => x * (460 - 20 * x)) (Icc 0 10) := by
  refine ⟨fun h => by norm_num at h, fun x hx => ?_, by norm_num, by norm_num, by norm_num, by norm_num,
    fun x hx y hy hxy => ?_⟩
  · nlinarith [mul_nonneg (sub_nonneg.2 hx.2) (by linarith [hx.2] : (0 : ℝ) ≤ 13 - x)]
  · show x * (460 - 20 * x) < y * (460 - 20 * y)
    nlinarith [mul_pos (sub_pos.2 hxy) (by linarith [hx.2, hy.2] : (0 : ℝ) < 460 - 20 * x - 20 * y)]

/-- Primer 4: P(x) = x(x + 8) = x² + 8x = (x + 4)² − 16; najmanjši zmnožek −16 pri x = −4 in le tam (števili −4 in 4). -/
theorem primer4 (x : ℝ) : x * (x + 8) = x ^ 2 + 8 * x ∧ x ^ 2 + 8 * x = (x + 4) ^ 2 - 16 ∧
    -16 ≤ x * (x + 8) ∧ (x * (x + 8) = -16 ↔ x = -4) ∧ (-4 : ℝ) * (-4 + 8) = -16 ∧ (-4 : ℝ) + 8 = 4 := by
  refine ⟨by ring, by ring, by nlinarith [sq_nonneg (x + 4)], ?_, by norm_num, by norm_num⟩
  rw [show x * (x + 8) = 1 * (x - -4) ^ 2 + -16 by ring]
  exact le_v_temenu _ _ _ _ one_ne_zero

/-! ## Pogoste napake -/

/-- Pogoste napake 5, Preveri se 1: P(9) = 99 in P(11) = 99 sta manjša od P(10) = 100, a to ni dokaz;
dokaz je P(x) = 100 − (x − 10)² ≤ 100; ničli P sta 0 in 20. -/
theorem napaka_tabela (x : ℝ) : (9 : ℝ) * (20 - 9) = 99 ∧ (11 : ℝ) * (20 - 11) = 99 ∧
    x * (20 - x) = 100 - (x - 10) ^ 2 ∧ (x * (20 - x) = 0 ↔ x = 0 ∨ x = 20) := by
  refine ⟨by norm_num, by norm_num, by ring, ?_⟩
  rw [mul_eq_zero, sub_eq_zero, eq_comm (a := (20 : ℝ))]

/-- Pogoste napake 3: pri obsegu 40 m sta stranici x in 20 − x (ne 40 − x: 2(x + (40 − x)) = 80 ≠ 40). -/
theorem napaka_zveza (x : ℝ) : 2 * (x + (20 - x)) = 40 ∧ 2 * (x + (40 - x)) ≠ 40 := by
  constructor <;> norm_num

/-! ## Za maturo -/

/-- Za maturo, naloga 1 a): 8x + 4h = 6 ⇔ h = 1,5 − 2x; S(x) = x² + 4x(1,5 − 2x) = x² + 6x − 8x² = −7x² + 6x;
model je smiseln za x > 0 in h > 0, tj. 0 < x < 0,75 (`RACUN`: x(3/2 − 2x) > 0 ⇔ 0 < x < 3/4). -/
theorem matura1a (x h : ℝ) : (8 * x + 4 * h = 6 ↔ h = 1.5 - 2 * x) ∧
    x ^ 2 + 4 * x * (1.5 - 2 * x) = x ^ 2 + 6 * x - 8 * x ^ 2 ∧ x ^ 2 + 6 * x - 8 * x ^ 2 = -7 * x ^ 2 + 6 * x ∧
    ((0 < x ∧ 0 < 1.5 - 2 * x) ↔ 0 < x ∧ x < 0.75) ∧ (0 < x * (3 / 2 - 2 * x) ↔ 0 < x ∧ x < 3 / 4) := by
  refine ⟨by constructor <;> intro e <;> linarith, by ring, by ring,
    by constructor <;> rintro ⟨h1, h2⟩ <;> exact ⟨h1, by linarith⟩, ⟨fun e => ?_, fun e => ?_⟩⟩
  · by_contra hc
    rw [not_and_or] at hc
    rcases hc with hc | hc
    · push Not at hc; nlinarith
    · push Not at hc; nlinarith
  · exact mul_pos e.1 (by linarith [e.2])

/-- Za maturo, naloga 1 b): a = −7 < 0, teme x = −6/(2·(−7)) = 3/7 ≈ 0,43 ∈ (0; 0,75); S(3/7) = 9/7 ≈ 1,29
je največja ploščina (dosežena le pri x = 3/7). -/
theorem matura1b : -(6 : ℝ) / (2 * (-7)) = 3 / 7 ∧ (3 / 7 : ℝ) ∈ Ioo 0 0.75 ∧
    |(3 / 7 : ℝ) - 0.43| < 0.005 ∧ |(3 / 7 : ℝ) - 0.42857| < 0.000005 ∧
    -7 * (3 / 7 : ℝ) ^ 2 + 6 * (3 / 7) = 9 / 7 ∧ |(9 / 7 : ℝ) - 1.29| < 0.005 ∧
    |(9 / 7 : ℝ) - 1.28571| < 0.000005 ∧ (∀ x : ℝ, -7 * x ^ 2 + 6 * x ≤ 9 / 7) ∧
    ∀ x : ℝ, -7 * x ^ 2 + 6 * x = 9 / 7 ↔ x = 3 / 7 := by
  refine ⟨by norm_num, by norm_num, by rw [abs_lt]; norm_num, by rw [abs_lt]; norm_num, by norm_num,
    by rw [abs_lt]; norm_num, by rw [abs_lt]; norm_num, fun x => by nlinarith [sq_nonneg (x - 3 / 7)],
    fun x => ?_⟩
  rw [show -7 * x ^ 2 + 6 * x = -7 * (x - 3 / 7) ^ 2 + 9 / 7 by ring]
  exact le_v_temenu _ _ _ _ (by norm_num)

/-- Za maturo, naloga 1 c): na (0; 0,35] (levo od temena 3/7) S narašča, največja ploščina je
S(0,35) = −7·0,1225 + 2,1 = 1,2425 ≈ 1,24; višina h = 1,5 − 2·0,35 = 0,8. -/
theorem matura1c : (0.35 : ℝ) < 3 / 7 ∧ (∀ x ∈ Ioc (0 : ℝ) 0.35, -7 * x ^ 2 + 6 * x ≤ -7 * 0.35 ^ 2 + 6 * 0.35) ∧
    -7 * (0.35 : ℝ) ^ 2 + 6 * 0.35 = -7 * 0.1225 + 2.1 ∧ -7 * (0.1225 : ℝ) + 2.1 = 1.2425 ∧
    |(1.2425 : ℝ) - 1.24| < 0.005 ∧ (1.5 : ℝ) - 2 * 0.35 = 0.8 ∧
    StrictMonoOn (fun x : ℝ => -7 * x ^ 2 + 6 * x) (Ioc 0 0.35) := by
  refine ⟨by norm_num, fun x hx => ?_, by norm_num, by norm_num, by rw [abs_lt]; norm_num, by norm_num,
    fun x hx y hy hxy => ?_⟩
  · nlinarith [mul_nonneg (sub_nonneg.2 hx.2) (by linarith [hx.2] : (0 : ℝ) ≤ 71 / 140 - x)]
  · show -7 * x ^ 2 + 6 * x < -7 * y ^ 2 + 6 * y
    nlinarith [mul_pos (sub_pos.2 hxy) (by linarith [hx.2, hy.2] : (0 : ℝ) < 6 - 7 * x - 7 * y)]

/-- Za maturo, naloga 2 a): d² = (10 − 12t)² + (16t)² = 100 − 240t + 144t² + 256t² = 400t² − 240t + 100;
A pride v K pri 10 − 12t = 0 ⇔ t = 5/6. -/
theorem matura2a (t : ℝ) : (10 - 12 * t) ^ 2 + (16 * t) ^ 2 = 100 - 240 * t + 144 * t ^ 2 + 256 * t ^ 2 ∧
    100 - 240 * t + 144 * t ^ 2 + 256 * t ^ 2 = 400 * t ^ 2 - 240 * t + 100 ∧ (10 - 12 * t = 0 ↔ t = 5 / 6) := by
  refine ⟨by ring, by ring, by constructor <;> intro h <;> linarith⟩

/-- Za maturo, naloga 2 b): d = √(d²) in koren je naraščajoč, zato je d najmanjši natanko tam, kjer je
najmanjši d² (za v ≥ 0: √u ≤ √v ⇔ u ≤ v). -/
theorem koren_narasca (u v : ℝ) (hv : 0 ≤ v) : Real.sqrt u ≤ Real.sqrt v ↔ u ≤ v :=
  Real.sqrt_le_sqrt_iff hv

/-- Predpostavka `koren_narasca` se da izpolniti (v = 68). -/
example : Real.sqrt 64 ≤ Real.sqrt 68 ↔ (64 : ℝ) ≤ 68 := koren_narasca 64 68 (by norm_num)

/-- Za maturo, naloga 2 b): teme t = −(−240)/(2·400) = 0,3 ∈ [0, 5/6] (18 minut), d² = 400·0,09 − 240·0,3 + 100
= 36 − 72 + 100 = 64 je najmanjši, d = 8 km in d ≥ 8 za vse t; d = 8 le pri t = 0,3. -/
theorem matura2b : -(-240 : ℝ) / (2 * 400) = 0.3 ∧ (0.3 : ℝ) ∈ Icc 0 (5 / 6) ∧ (0.3 : ℝ) * 60 = 18 ∧
    (400 * (0.3 : ℝ) ^ 2 - 240 * 0.3 + 100 = 400 * 0.09 - 240 * 0.3 + 100 ∧
      400 * (0.09 : ℝ) - 240 * 0.3 + 100 = 36 - 72 + 100 ∧ (36 : ℝ) - 72 + 100 = 64) ∧
    Real.sqrt 64 = 8 ∧ (∀ t : ℝ, 8 ≤ Real.sqrt (400 * t ^ 2 - 240 * t + 100)) ∧
    ∀ t : ℝ, Real.sqrt (400 * t ^ 2 - 240 * t + 100) = 8 ↔ t = 0.3 := by
  have h8 : Real.sqrt 64 = 8 := by rw [show (64 : ℝ) = 8 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, h8, fun t => ?_, fun t => ?_⟩
  · rw [← h8]
    exact Real.sqrt_le_sqrt (by nlinarith [sq_nonneg (t - 0.3)])
  · rw [← h8, Real.sqrt_inj (by nlinarith [sq_nonneg (t - 0.3)]) (by norm_num),
      show 400 * t ^ 2 - 240 * t + 100 = 400 * (t - 0.3) ^ 2 + 64 by ring]
    exact le_v_temenu _ _ _ _ (by norm_num)

/-- Za maturo, naloga 2 c): 400t² − 240t + 100 = 100 ⇔ 80t(5t − 3) = 0 ⇔ t = 0 ali t = 0,6 (36 minut). -/
theorem matura2c (t : ℝ) : (400 * t ^ 2 - 240 * t + 100 = 100 ↔ 80 * t * (5 * t - 3) = 0) ∧
    (400 * t ^ 2 - 240 * t + 100 = 100 ↔ t = 0 ∨ t = 0.6) ∧ (0.6 : ℝ) ∈ Icc 0 (5 / 6) ∧ (0.6 : ℝ) * 60 = 36 := by
  have e : (400 * t ^ 2 - 240 * t + 100 = 100 ↔ 80 * t * (5 * t - 3) = 0) := by
    constructor <;> intro h <;> linarith
  refine ⟨e, ?_, by norm_num, by norm_num⟩
  rw [e]
  constructor
  · intro h
    rcases mul_eq_zero.mp h with h | h
    · left; linarith
    · right; linarith
  · rintro (h | h) <;> subst h <;> norm_num

/-- Za maturo, naloga 2 d): 12 min = 0,2 h; na [0; 0,2] (levo od temena 0,3) je d² najmanjši v krajišču:
d²(0,2) = 400·0,04 − 240·0,2 + 100 = 16 − 48 + 100 = 68 ≤ d²(t), d = √68 = 2√17. -/
theorem matura2d : (12 : ℝ) / 60 = 0.2 ∧ (∀ t ∈ Icc (0 : ℝ) 0.2, 68 ≤ 400 * t ^ 2 - 240 * t + 100) ∧
    (400 * (0.2 : ℝ) ^ 2 - 240 * 0.2 + 100 = 400 * 0.04 - 240 * 0.2 + 100 ∧
      400 * (0.04 : ℝ) - 240 * 0.2 + 100 = 16 - 48 + 100 ∧ (16 : ℝ) - 48 + 100 = 68) ∧
    Real.sqrt 68 = 2 * Real.sqrt 17 := by
  refine ⟨by norm_num, fun t ht => ?_, by norm_num, ?_⟩
  · nlinarith [mul_nonneg (by linarith [ht.2] : (0 : ℝ) ≤ 1 - 5 * t) (by linarith [ht.2] : (0 : ℝ) ≤ 4 - 10 * t)]
  · calc Real.sqrt 68 = Real.sqrt (2 ^ 2 * 17) := by norm_num
      _ = 2 * Real.sqrt 17 := by rw [Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]

/-- Ustno vprašanje 3: f(x) = −x² + 4x ima teme pri 2, na [3, 5] pada; največja vrednost je f(3) = 3,
najmanjša f(5) = −5. -/
theorem ustno3 : -(4 : ℝ) / (2 * (-1)) = 2 ∧ StrictAntiOn (fun x : ℝ => -x ^ 2 + 4 * x) (Icc 3 5) ∧
    (∀ x ∈ Icc (3 : ℝ) 5, -5 ≤ -x ^ 2 + 4 * x ∧ -x ^ 2 + 4 * x ≤ 3) ∧ -(3 : ℝ) ^ 2 + 4 * 3 = 3 ∧
    -(5 : ℝ) ^ 2 + 4 * 5 = -5 := by
  refine ⟨by norm_num, fun x hx y hy hxy => ?_, fun x hx => ⟨?_, ?_⟩, by norm_num, by norm_num⟩
  · show -y ^ 2 + 4 * y < -x ^ 2 + 4 * x
    nlinarith [mul_pos (sub_pos.2 hxy) (by linarith [hx.1, hy.1] : (0 : ℝ) < x + y - 4)]
  · nlinarith [mul_nonneg (sub_nonneg.2 hx.2) (by linarith [hx.1] : (0 : ℝ) ≤ x + 1)]
  · nlinarith [mul_nonneg (sub_nonneg.2 hx.1) (by linarith [hx.1] : (0 : ℝ) ≤ x - 1)]

/-! ## Drugače -/

/-- Drugače: Na sliki: pravokotniki z obsegom 20: 9·1 = 9, 7·3 = 21, 5·5 = 25; P(x) = x(10 − x) ≤ 25,
P(3) = P(7) = 21 (simetrija okoli 5); kvadrat ima 25/9 < 3-krat (a več kot 2,7-krat) več prostora. -/
theorem na_sliki : (2 * ((9 : ℝ) + 1) = 20 ∧ 2 * ((7 : ℝ) + 3) = 20 ∧ 2 * ((5 : ℝ) + 5) = 20) ∧
    ((9 : ℝ) * 1 = 9 ∧ (7 : ℝ) * 3 = 21 ∧ (5 : ℝ) * 5 = 25) ∧ (∀ x : ℝ, x * (10 - x) ≤ 25) ∧
    (3 : ℝ) * (10 - 3) = 7 * (10 - 7) ∧ (25 : ℝ) / 9 < 3 ∧ 2.7 < (25 : ℝ) / 9 := by
  refine ⟨by norm_num, by norm_num, fun x => by nlinarith [sq_nonneg (x - 5)], by norm_num, by norm_num,
    by norm_num⟩

/-- Drugače: Iz vsakdanjega življenja (sadovnjak): (20 + x)(300 − 10x) = −10(x − 5)² + 6250; največ pri x = 5:
25 dreves po 250 jabolk, 25·250 = 6250 namesto 20·300 = 6000; 6250 je dosežen le pri x = 5. -/
theorem sadovnjak (x : ℝ) : (20 + x) * (300 - 10 * x) = -10 * (x - 5) ^ 2 + 6250 ∧
    (20 + x) * (300 - 10 * x) ≤ 6250 ∧ ((20 + x) * (300 - 10 * x) = 6250 ↔ x = 5) ∧
    (20 : ℝ) + 5 = 25 ∧ (300 : ℝ) - 10 * 5 = 250 ∧ (25 : ℝ) * 250 = 6250 ∧
    (20 : ℝ) * 300 = 6000 := by
  refine ⟨by ring, by nlinarith [sq_nonneg (x - 5)], ?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  rw [show (20 + x) * (300 - 10 * x) = -10 * (x - 5) ^ 2 + 6250 by ring]
  exact le_v_temenu _ _ _ _ (by norm_num)

/-- Drugače: Iz vsakdanjega življenja (vstopnice): pri ceni 0 je prihodek 0, pri ceni 23 ni obiskovalcev
(N(23) = 0); najboljša cena je vmes, 11,50 €. -/
theorem vstopnice : (0 : ℝ) * (460 - 20 * 0) = 0 ∧ (460 : ℝ) - 20 * 23 = 0 ∧
    (∀ x : ℝ, x * (460 - 20 * x) ≤ 11.5 * (460 - 20 * 11.5)) := by
  refine ⟨by norm_num, by norm_num, fun x => by nlinarith [sq_nonneg (x - 11.5)]⟩

/-! ## Preveri se -/

/-- Preveri se 2: Z(x) = −(x − 8)² + 64 na [2, 6] narašča (levo od temena 8, ki ni dovoljen); največ je
Z(6) = 60, Z(2) = 28 je najmanj, Z(8) = 64. -/
theorem preveri2 : (8 : ℝ) ∉ Icc 2 6 ∧ (∀ x ∈ Icc (2 : ℝ) 6, 28 ≤ -(x - 8) ^ 2 + 64 ∧ -(x - 8) ^ 2 + 64 ≤ 60) ∧
    -((6 : ℝ) - 8) ^ 2 + 64 = 60 ∧ -((2 : ℝ) - 8) ^ 2 + 64 = 28 ∧ -((8 : ℝ) - 8) ^ 2 + 64 = 64 := by
  refine ⟨fun h => by norm_num at h, fun x hx => ⟨?_, ?_⟩, by norm_num, by norm_num, by norm_num⟩
  · nlinarith [mul_nonneg (sub_nonneg.2 hx.1) (by linarith [hx.2] : (0 : ℝ) ≤ 14 - x)]
  · nlinarith [mul_nonneg (sub_nonneg.2 hx.2) (by linarith [hx.2] : (0 : ℝ) ≤ 10 - x)]

/-- Preveri se 3: največjo ploščino ima kvadrat; x² = 81, x > 0 ⇔ x = 9; obseg 4·9 = 36 = 4√81. Po
`kvadrat_najvecji` (obseg 2s, največja ploščina s²/4): s²/4 = 81 pri s > 0 ⇔ s = 18, obseg 2·18 = 36;
pri s = 18 je x(18 − x) ≤ 81, enakost le pri x = 9. -/
theorem preveri3 (x : ℝ) (hx : 0 < x) : (x ^ 2 = 81 ↔ x = 9) ∧ 4 * Real.sqrt 81 = 36 ∧ (4 : ℝ) * 9 = 36 ∧
    (∀ s : ℝ, 0 < s → (s ^ 2 / 4 = 81 ↔ s = 18)) ∧ 2 * (18 : ℝ) = 36 ∧
    (∀ y : ℝ, y * (18 - y) ≤ 18 ^ 2 / 4 ∧ (y * (18 - y) = 18 ^ 2 / 4 ↔ y = 18 / 2)) ∧
    (18 : ℝ) ^ 2 / 4 = 81 ∧ (18 : ℝ) / 2 = 9 := by
  refine ⟨⟨fun h => by nlinarith [sq_nonneg (x - 9), sq_nonneg (x + 9)], fun h => by subst h; norm_num⟩, ?_,
    by norm_num, fun s hs => ⟨fun h => by nlinarith [sq_nonneg (s - 18), sq_nonneg (s + 18)],
      fun h => by subst h; norm_num⟩, by norm_num,
    fun y => ⟨(kvadrat_najvecji 18 y).2.2.1, (kvadrat_najvecji 18 y).2.2.2.1⟩, by norm_num, by norm_num⟩
  rw [show (81 : ℝ) = 9 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]; norm_num

/-- Predpostavka `preveri3` se da izpolniti (x = 9). -/
example : (9 : ℝ) ^ 2 = 81 ↔ (9 : ℝ) = 9 := (preveri3 9 (by norm_num)).1

/-- Preveri se 4: kateti 1,5 m in 0,9 m: stranici 0,75 in 0,45, ploščina 0,75·0,45 = 0,3375 = 1,5·0,9/4 ≈ 0,34
je največja; cel trikotnik ima 0,675 ≈ 0,68, zmnožek katet 1,35. -/
theorem preveri4 : (∀ x : ℝ, 0.9 * x * (1 - x / 1.5) ≤ 1.5 * 0.9 / 4) ∧ (1.5 : ℝ) / 2 = 0.75 ∧
    (0.9 : ℝ) / 2 = 0.45 ∧ (0.75 : ℝ) * 0.45 = 0.3375 ∧ (1.5 : ℝ) * 0.9 / 4 = 0.3375 ∧
    |(0.3375 : ℝ) - 0.34| < 0.005 ∧ (1.5 : ℝ) * 0.9 / 2 = 0.675 ∧ (1.5 : ℝ) * 0.9 = 1.35 := by
  refine ⟨(pravokotnik_v_trikotniku 1.5 0.9 (by norm_num) (by norm_num)).1, by norm_num, by norm_num,
    by norm_num, by norm_num, by rw [abs_lt]; norm_num, by norm_num, by norm_num⟩

/-- Preveri se 5: x² + (10 − x)² = 2x² − 20x + 100 = 2(x − 5)² + 50; najmanjša vrednost 50 pri x = 5, v
x = 0 in x = 10 je 100. -/
theorem preveri5 (x : ℝ) : x ^ 2 + (10 - x) ^ 2 = 2 * x ^ 2 - 20 * x + 100 ∧
    2 * x ^ 2 - 20 * x + 100 = 2 * (x - 5) ^ 2 + 50 ∧ 50 ≤ x ^ 2 + (10 - x) ^ 2 ∧
    (5 : ℝ) ^ 2 + (10 - 5) ^ 2 = 50 ∧ (0 : ℝ) ^ 2 + (10 - 0) ^ 2 = 100 ∧ (10 : ℝ) ^ 2 + (10 - 10) ^ 2 = 100 := by
  refine ⟨by ring, by ring, by nlinarith [sq_nonneg (x - 5)], by norm_num, by norm_num, by norm_num⟩

end Evklid.Lekcije.MAT_SS_2.EkstremalniProblemiSKvadratnoFunkcijo
