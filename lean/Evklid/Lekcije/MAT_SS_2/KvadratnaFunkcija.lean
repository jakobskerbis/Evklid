/-
vir: content/lessons/MAT-SS-2/kvadratna-funkcija.md
sha256: 6ed3d7aad0cdc940d1b554f2695f8cadb7d714a817564524218d8e6e7971c111
Ni v Leanu: risbe, drsniki in simulacija (opisi, kaj se zgodi ob premikanju drsnikov; dokazano je, da
sta ničli p ± √(−q/a), da je njuna razdalja 2√(−q/a) neodvisna od p, in kaj se zgodi s predznakom a·q);
»graf je parabola« in »ožja/širša« kot geometrijska opisa (dokazano: |a|x² > x² oz. < x² za x ≠ 0,
vrednosti 2, 8, 18 pri a = 2 in da je pri a = 0 funkcija linearna); poimenovanja (soda funkcija, teme,
simetrijska os) in postopki (Ponovitev, »obliko izberi po podatkih«, risanje grafa skozi pet točk);
temperature in meritve kot podatki ter trditev o resnični temperaturi (»najvišja navadno med 14. in
16. uro, ni parabola«), pravila FIBA in mere iz uvoda Primera 2 (4,225 m, 0,2 m) kot fizikalni podatki;
odčitavanje z grafa (Naloga 3 d), Preveri se 1: dokazana je računska vsebina); točkovanje; besedilo
napačnih odgovorov v Preveri se (dokazani so pravilni odgovori in, kjer gre, da napačni ne ustrezajo);
analogija s folijo (dokazano je le, da je dno pri obratnem vrstnem redu na višini a·q); model ograje
v Za maturo, nalogi 3 a) (ograja 3x, stranica ob zidu 120 − 3x kot opis iz besedila; dokazana sta
P(x) = x(120 − 3x) = −3x² + 120x in območje 0 < x < 40).
Decimalna števila so točna racionalna števila v ℝ.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.KvadratnaFunkcija

open Set

/-! ## Pomožne trditve -/

/-- Pomožno: enačba L = R je enakovredna P = 0, če je L − R = P.
pomozno -/
theorem enacba_iff {L D P : ℝ} (h : L - D = P) : L = D ↔ P = 0 := by
  rw [← h, sub_eq_zero]

/-- Predpostavka `enacba_iff` se da izpolniti (L = 3, D = 1, P = 2). -/
example : (3 : ℝ) = 1 ↔ (2 : ℝ) = 0 := enacba_iff (by norm_num)

/-- Pomožno: (x − r)(x − s) = 0 ↔ x = r ∨ x = s.
pomozno -/
theorem dva_faktorja (x r s : ℝ) : (x - r) * (x - s) = 0 ↔ x = r ∨ x = s := by
  simp only [mul_eq_zero, sub_eq_zero]

/-- Pomožno (korenjenje z ±): (x − p)² = d² ⇔ x = p + d ali x = p − d.
pomozno -/
theorem kvadrat_iff (x p d : ℝ) : (x - p) ^ 2 = d ^ 2 ↔ x = p + d ∨ x = p - d := by
  rw [sq_eq_sq_iff_eq_or_eq_neg]
  constructor <;> rintro (h | h)
  · left; linarith
  · right; linarith
  · left; linarith
  · right; linarith

/-! ## Razlaga: splošne lastnosti -/

/-- Razlaga 1: pri a = 0 je ax² + bx + c = bx + c linearna funkcija.
trditev: MAT-SS-2/kvadratna-funkcija#a-nic
besedilo: »pri $a = 0$ dobimo linearno funkcijo.« -/
theorem a_nic (b c x : ℝ) : 0 * x ^ 2 + b * x + c = b * x + c := by ring

/-- Razlaga 1, Preveri: (x − 1)² − x² = −2x + 1, torej ni kvadratna funkcija.
trditev: MAT-SS-2/kvadratna-funkcija#preveri-ni-kvadratna
besedilo: »Preveri:* ali je $f(x) = (x - 1)^2 - x^2$ kvadratna funkcija? (Ne: člen $x^2$ se odšteje, ostane $f(x) = -2x + 1$.)« -/
theorem preveri_ni_kvadratna (x : ℝ) : (x - 1) ^ 2 - x ^ 2 = -2 * x + 1 := by ring

/-- Razlaga 2 (tabela in sodost): (±3)² = 9, (±2)² = 4, (±1)² = 1, 0² = 0; (−x)² = x²; teme (0, 0) je
najnižja točka: x² ≥ 0 = 0².
trditev: MAT-SS-2/kvadratna-funkcija#osnovna-parabola
besedilo: »$x^2 - 6x + 5 = (x^2 - 6x + 9) - 9 + 5 = (x - 3)^2 - 4$.« -/
theorem osnovna_parabola : ((-3 : ℝ) ^ 2 = 9 ∧ (-2 : ℝ) ^ 2 = 4 ∧ (-1 : ℝ) ^ 2 = 1 ∧ (0 : ℝ) ^ 2 = 0 ∧
    (1 : ℝ) ^ 2 = 1 ∧ (2 : ℝ) ^ 2 = 4 ∧ (3 : ℝ) ^ 2 = 9) ∧ (∀ x : ℝ, (-x) ^ 2 = x ^ 2) ∧
    ∀ x : ℝ, (0 : ℝ) ^ 2 ≤ x ^ 2 := by
  refine ⟨by norm_num, fun x => by ring, fun x => by simp [sq_nonneg]⟩

/-- Razlaga 3: pri a = 2 so namesto 1, 4, 9 vrednosti 2, 8, 18 (razteg v smeri osi y).
trditev: MAT-SS-2/kvadratna-funkcija#razteg-a2
besedilo: »Množenje z $a$ pomnoži vsako vrednost funkcije: namesto $1$, $4$, $9$ iz tabele dobimo pri $a = 2$ vrednosti $2$, $8$, $18$.« -/
theorem razteg_a2 : (2 : ℝ) * 1 = 2 ∧ (2 : ℝ) * 4 = 8 ∧ (2 : ℝ) * 9 = 18 := by norm_num

/-- Razlaga 3 (ožja/širša): pri |a| > 1 je |a·x²| > x², pri |a| < 1 je |a·x²| < x² (x ≠ 0).
trditev: MAT-SS-2/kvadratna-funkcija#ozja-sirsa
besedilo: »$|a| > 1$: parabola je ožja od $y = x^2$; $|a| < 1$: parabola je širša.« -/
theorem ozja_sirsa (a x : ℝ) (hx : x ≠ 0) :
    (1 < |a| → x ^ 2 < |a * x ^ 2|) ∧ (|a| < 1 → |a * x ^ 2| < x ^ 2) := by
  have hx2 : 0 < x ^ 2 := by positivity
  rw [abs_mul, abs_of_pos hx2]
  exact ⟨fun h => by nlinarith, fun h => by nlinarith⟩

/-- Predpostavka `ozja_sirsa` se da izpolniti (x = 1). -/
example : (1 < |(2 : ℝ)| → (1 : ℝ) ^ 2 < |2 * 1 ^ 2|) ∧ (|(2 : ℝ)| < 1 → |2 * (1 : ℝ) ^ 2| < 1 ^ 2) :=
  ozja_sirsa 2 1 one_ne_zero

/-- Razlaga 3, Preveri: y = −0,5x² je širša (|−0,5| < 1) in odprta navzdol (a < 0).
trditev: MAT-SS-2/kvadratna-funkcija#preveri-sirsa
besedilo: »Preveri:* je $y = -0{,}5x^2$ ožja ali širša od $y = x^2$? (Širša, ker je $|a| = 0{,}5 < 1$; odprta je navzdol.)« -/
theorem preveri_sirsa : |(-0.5 : ℝ)| < 1 ∧ (-0.5 : ℝ) < 0 := by
  rw [abs_lt]; norm_num

/-- Razlaga 3, Bolj natančno (ekstrem): za a > 0 je a(x − p)² + q ≥ q, enakost samo pri x = p (minimum);
za a < 0 je a(x − p)² + q ≤ q (maksimum).
trditev: MAT-SS-2/kvadratna-funkcija#ekstrem
besedilo: »Ekstrem.** Ker je $(x - p)^2 \ge 0$ in je enak nič samo pri $x = p$, za $a > 0$ velja $f(x) \ge q$ z enakostjo samo v temenu, zato je $q$ najmanjša vrednost. Za $a < 0$ je $f(x) \le q$, $q$ je največja vrednost.« -/
theorem ekstrem (a p q : ℝ) :
    (0 < a → ∀ x, q ≤ a * (x - p) ^ 2 + q ∧ (a * (x - p) ^ 2 + q = q ↔ x = p)) ∧
      (a < 0 → ∀ x, a * (x - p) ^ 2 + q ≤ q ∧ (a * (x - p) ^ 2 + q = q ↔ x = p)) := by
  have key : ∀ x, a ≠ 0 → (a * (x - p) ^ 2 + q = q ↔ x = p) := fun x ha => by
    simp [ha, sub_eq_zero]
  refine ⟨fun ha x => ⟨by nlinarith [sq_nonneg (x - p)], key x ha.ne'⟩,
    fun ha x => ⟨by nlinarith [sq_nonneg (x - p)], key x ha.ne⟩⟩

/-- Razlaga 4 (splošna oblika): presečišče z osjo y je (0, c); (temenska) vrednost v p je q;
(ničelna) a(x₁ − x₁)(x₁ − x₂) = 0 in a(x₂ − x₁)(x₂ − x₂) = 0.
trditev: MAT-SS-2/kvadratna-funkcija#tri-oblike
besedilo: »Ista funkcija ima lahko vse tri zapise, na primer $x^2 - 2x - 3 = (x - 1)^2 - 4 = (x + 1)(x - 3)$. Na sliki vsaka oblika pokaže svoje točke: splošna presečišče $(0, -3)$, temenska teme $T(1, -4)$, ničelna ničli $-1$ in $3$.« -/
theorem tri_oblike (a b c p q x₁ x₂ : ℝ) : a * 0 ^ 2 + b * 0 + c = c ∧ a * (p - p) ^ 2 + q = q ∧
    a * (x₁ - x₁) * (x₁ - x₂) = 0 ∧ a * (x₂ - x₁) * (x₂ - x₂) = 0 := by
  refine ⟨by ring, by ring, by ring, by ring⟩

/-- Razlaga 4: x² − 2x − 3 = (x − 1)² − 4 = (x + 1)(x − 3); f(0) = −3, f(1) = −4, ničli −1 in 3.
trditev: MAT-SS-2/kvadratna-funkcija#tri-zapisi
besedilo: »na primer $x^2 - 2x - 3 = (x - 1)^2 - 4 = (x + 1)(x - 3)$.« -/
theorem tri_zapisi (x : ℝ) : (x ^ 2 - 2 * x - 3 = (x - 1) ^ 2 - 4 ∧ (x - 1) ^ 2 - 4 = (x + 1) * (x - 3)) ∧
    ((0 : ℝ) ^ 2 - 2 * 0 - 3 = -3 ∧ (1 : ℝ) ^ 2 - 2 * 1 - 3 = -4) ∧
    (x ^ 2 - 2 * x - 3 = 0 ↔ x = -1 ∨ x = 3) := by
  refine ⟨⟨by ring, by ring⟩, by norm_num, ?_⟩
  rw [enacba_iff (P := (x - -1) * (x - 3)) (by ring), dva_faktorja]

/-- Razlaga 4, Preveri: ničli f(x) = 3(x + 1)(x − 4) sta −1 in 4.
trditev: MAT-SS-2/kvadratna-funkcija#preveri-nicelna
besedilo: »Preveri:* kaj takoj prebereš iz $f(x) = 3(x + 1)(x - 4)$? (Ničli $-1$ in $4$.)« -/
theorem preveri_nicelna (x : ℝ) : 3 * (x + 1) * (x - 4) = 0 ↔ x = -1 ∨ x = 4 := by
  rw [enacba_iff (P := 3 * ((x - -1) * (x - 4))) (by ring), mul_eq_zero, dva_faktorja,
    or_iff_right (by norm_num)]

/-- Razlaga 5: graf y = a(x − p)² + q je parabola y = ax², premaknjena za p v smeri x in za q v smeri y
(množica točk grafa je slika grafa y = ax² pri premiku (u, v) ↦ (u + p, v + q)).
trditev: MAT-SS-2/kvadratna-funkcija#premik
besedilo: »Teme.** Graf funkcije $f(x) = a(x - p)^2 + q$ dobimo tako, da parabolo $y = ax^2$ premaknemo za $p$ v smeri osi $x$ in za $q$ v smeri osi $y$.« -/
theorem premik (a p q : ℝ) : {P : ℝ × ℝ | P.2 = a * (P.1 - p) ^ 2 + q} =
    (fun P : ℝ × ℝ => (P.1 + p, P.2 + q)) '' {P : ℝ × ℝ | P.2 = a * P.1 ^ 2} := by
  ext ⟨x, y⟩
  simp only [mem_ofPred_eq, mem_image, Prod.exists, Prod.mk.injEq]
  constructor
  · intro h
    exact ⟨x - p, y - q, by rw [h]; ring, by ring, by ring⟩
  · rintro ⟨u, v, hv, rfl, rfl⟩
    rw [hv]; ring

/-- Razlaga 4: vodilni koeficient a je v vseh treh oblikah isti: če je ax² + bx + c = a'(x − p)² + q
za vse x, je a' = a, in če je ax² + bx + c = a''(x − x₁)(x − x₂) za vse x, je a'' = a.
trditev: MAT-SS-2/kvadratna-funkcija#isti-vodilni
besedilo: »$f(x) = a(x - p)^2 + q$« -/
theorem isti_vodilni (a b c a' p q a'' x₁ x₂ : ℝ) :
    ((∀ x, a * x ^ 2 + b * x + c = a' * (x - p) ^ 2 + q) → a' = a) ∧
      ((∀ x, a * x ^ 2 + b * x + c = a'' * (x - x₁) * (x - x₂)) → a'' = a) := by
  refine ⟨fun h => ?_, fun h => ?_⟩
  · linear_combination (-(h 1) - h (-1) + 2 * h 0) / 2
  · linear_combination (-(h 1) - h (-1) + 2 * h 0) / 2

/-- Predpostavke `isti_vodilni` se dajo izpolniti (x² − 2x − 3 = (x − 1)² − 4 = (x + 1)(x − 3)). -/
example : (1 : ℝ) = 1 ∧ (1 : ℝ) = 1 :=
  ⟨(isti_vodilni 1 (-2) (-3) 1 1 (-4) 1 (-1) 3).1 (fun x => by ring),
    (isti_vodilni 1 (-2) (-3) 1 1 (-4) 1 (-1) 3).2 (fun x => by ring)⟩

/-- Razlaga 4: ničelna oblika a(x − x₁)(x − x₂) z realnima x₁, x₂ obstaja natanko tedaj, ko ima funkcija
realne ničle, tj. ko je D = b² − 4ac ≥ 0 (a ≠ 0).
trditev: MAT-SS-2/kvadratna-funkcija#nicelna-obstaja
besedilo: »Ista funkcija ima lahko vse tri zapise, na primer $x^2 - 2x - 3 = (x - 1)^2 - 4 = (x + 1)(x - 3)$. Na sliki vsaka oblika pokaže svoje točke: splošna presečišče $(0, -3)$, temenska teme $T(1, -4)$, ničelna ničli $-1$ in $3$.« -/
theorem nicelna_obstaja (a b c : ℝ) (ha : a ≠ 0) :
    (∃ x₁ x₂ : ℝ, ∀ x, a * x ^ 2 + b * x + c = a * (x - x₁) * (x - x₂)) ↔ 0 ≤ b ^ 2 - 4 * a * c := by
  constructor
  · rintro ⟨x₁, x₂, h⟩
    have hc : c = a * x₁ * x₂ := by linear_combination h 0
    have hb : b = -a * (x₁ + x₂) := by linear_combination (h 1 - h (-1)) / 2
    rw [show b ^ 2 - 4 * a * c = (a * (x₁ - x₂)) ^ 2 by rw [hb, hc]; ring]
    positivity
  · intro hD
    have hs : Real.sqrt (b ^ 2 - 4 * a * c) ^ 2 = b ^ 2 - 4 * a * c := Real.sq_sqrt hD
    refine ⟨(-b + Real.sqrt (b ^ 2 - 4 * a * c)) / (2 * a),
      (-b - Real.sqrt (b ^ 2 - 4 * a * c)) / (2 * a), fun x => ?_⟩
    have key : a * (x - (-b + Real.sqrt (b ^ 2 - 4 * a * c)) / (2 * a)) *
        (x - (-b - Real.sqrt (b ^ 2 - 4 * a * c)) / (2 * a)) =
        a * x ^ 2 + b * x + (b ^ 2 - Real.sqrt (b ^ 2 - 4 * a * c) ^ 2) / (4 * a) := by
      field_simp; ring
    rw [key, hs]; field_simp; ring

/-- Predpostavka `nicelna_obstaja` se da izpolniti (a = 1). -/
example : ∃ x₁ x₂ : ℝ, ∀ x, 1 * x ^ 2 + (-2) * x + (-3) = 1 * (x - x₁) * (x - x₂) :=
  (nicelna_obstaja 1 (-2) (-3) one_ne_zero).2 (by norm_num)

/-- Pomožno: za a ≠ 0 je a(x − p)² + q = q natanko pri x = p (ekstrem je dosežen le v temenu).
pomozno -/
theorem le_v_temenu (a p q x : ℝ) (ha : a ≠ 0) : a * (x - p) ^ 2 + q = q ↔ x = p := by
  constructor
  · intro h
    have h2 : a * (x - p) ^ 2 = 0 := by linarith
    have := (mul_eq_zero.mp h2).resolve_left ha
    linarith [pow_eq_zero_iff (n := 2) (two_ne_zero) |>.mp this]
  · rintro rfl; ring

/-- Predpostavka `le_v_temenu` se da izpolniti (a = 1). -/
example : (1 : ℝ) * (0 - 0) ^ 2 + 0 = 0 ↔ (0 : ℝ) = 0 := le_v_temenu 1 0 0 0 one_ne_zero

/-- Razlaga 5, Bolj natančno (simetrija): f(p + d) = ad² + q = f(p − d); premica x = p je simetrijska
os.
trditev: MAT-SS-2/kvadratna-funkcija#simetrija
besedilo: »Simetrija.** Za poljuben $d$ velja $f(p + d) = ad^2 + q = f(p - d)$. Točki, ki sta enako oddaljeni od $p$, imata torej enako vrednost; premica $x = p$ je simetrijska os.« -/
theorem simetrija (a p q d : ℝ) :
    a * (p + d - p) ^ 2 + q = a * d ^ 2 + q ∧ a * d ^ 2 + q = a * (p - d - p) ^ 2 + q :=
  ⟨by ring, by ring⟩

/-- Razlaga 5, Primer 3 (formula), Povzetek: če je a ≠ 0 in f(t₁) = f(t₂) za t₁ ≠ t₂, leži simetrijska os
na sredini: p = (t₁ + t₂)/2 (tudi za ničli: p = (x₁ + x₂)/2).
trditev: MAT-SS-2/kvadratna-funkcija#os-na-sredini
besedilo: »$f(t) = a(t - p)^2 + q$; enaki vrednosti $f(t_1) = f(t_2)$ ležita simetrično glede na os: $p = \dfrac{t_1 + t_2}{2}$« -/
theorem os_na_sredini (a p q t₁ t₂ : ℝ) (ha : a ≠ 0) (hne : t₁ ≠ t₂)
    (h : a * (t₁ - p) ^ 2 + q = a * (t₂ - p) ^ 2 + q) : p = (t₁ + t₂) / 2 := by
  have h0 : a * ((t₁ - t₂) * (t₁ + t₂ - 2 * p)) = 0 := by linear_combination h
  rcases mul_eq_zero.mp h0 with h1 | h1
  · exact absurd h1 ha
  · rcases mul_eq_zero.mp h1 with h2 | h2
    · exact absurd (sub_eq_zero.mp h2) hne
    · linarith

/-- Predpostavke `os_na_sredini` se dajo izpolniti (a = 1, p = 0, t = ±1). -/
example : (0 : ℝ) = (1 + -1) / 2 :=
  os_na_sredini 1 0 0 1 (-1) one_ne_zero (by norm_num) (by norm_num)

/-- Razlaga 5: x² − 6x + 5: f(0) = 5 = f(6) (x² − 6x = x(x − 6)), sredina (0 + 6)/2 = 3, f(3) = −4;
x² − 6x + 5 = (x² − 6x + 9) − 9 + 5 = (x − 3)² − 4.
trditev: MAT-SS-2/kvadratna-funkcija#teme-x2-6x-5
besedilo: »$x^2 - 6x + 5 = (x^2 - 6x + 9) - 9 + 5 = (x - 3)^2 - 4$« -/
theorem teme_x2_6x_5 (x : ℝ) : ((0 : ℝ) ^ 2 - 6 * 0 + 5 = 5 ∧ (6 : ℝ) ^ 2 - 6 * 6 + 5 = 5) ∧
    x ^ 2 - 6 * x = x * (x - 6) ∧ ((0 : ℝ) + 6) / 2 = 3 ∧ (3 : ℝ) ^ 2 - 6 * 3 + 5 = -4 ∧
    (x ^ 2 - 6 * x + 5 = (x ^ 2 - 6 * x + 9) - 9 + 5 ∧ (x ^ 2 - 6 * x + 9) - 9 + 5 = (x - 3) ^ 2 - 4) := by
  refine ⟨by norm_num, by ring, by norm_num, by norm_num, by ring, by ring⟩

/-- Razlaga 5 (splošno): ax² + bx = x(ax + b) je 0 pri x = 0 in x = −b/a (a ≠ 0), tam je vrednost
funkcije c; sredina (0 + (−b/a))/2 = −b/(2a) = p.
trditev: MAT-SS-2/kvadratna-funkcija#teme-splosno
besedilo: »Izraz $ax^2 + bx = x(ax + b)$ je enak $0$ pri $x = 0$ in pri $x = -\dfrac{b}{a}$; tam je vrednost funkcije obakrat $c$.« -/
theorem teme_splosno (a b c : ℝ) (ha : a ≠ 0) :
    (∀ x, a * x ^ 2 + b * x = x * (a * x + b)) ∧ a * 0 ^ 2 + b * 0 + c = c ∧
      a * (-b / a) ^ 2 + b * (-b / a) + c = c ∧ (0 + -b / a) / 2 = -b / (2 * a) := by
  refine ⟨fun x => by ring, by ring, by field_simp; ring, by ring⟩

/-- Predpostavka `teme_splosno` se da izpolniti (a = 1). -/
example : (0 + -(2 : ℝ) / 1) / 2 = -2 / (2 * 1) := (teme_splosno 1 2 0 one_ne_zero).2.2.2

/-- Razlaga 5, Bolj natančno, Ustno vprašanje 2 (dopolnjevanje do popolnega kvadrata): za a ≠ 0 je
ax² + bx + c = a[(x + b/(2a))² − b²/(4a²)] + c = a(x + b/(2a))² − b²/(4a) + c; teme p = −b/(2a),
q = c − b²/(4a) = f(p).
trditev: MAT-SS-2/kvadratna-funkcija#dopolnjevanje
besedilo: »$$ax^2 + bx + c = a\left(x + \frac{b}{2a}\right)^2 - \frac{b^2}{4a} + c$$« -/
theorem dopolnjevanje (a b c x : ℝ) (ha : a ≠ 0) :
    a * x ^ 2 + b * x + c = a * ((x + b / (2 * a)) ^ 2 - b ^ 2 / (4 * a ^ 2)) + c ∧
      a * ((x + b / (2 * a)) ^ 2 - b ^ 2 / (4 * a ^ 2)) + c = a * (x + b / (2 * a)) ^ 2 - b ^ 2 / (4 * a) + c ∧
      a * (x + b / (2 * a)) ^ 2 - b ^ 2 / (4 * a) + c = a * (x - -b / (2 * a)) ^ 2 + (c - b ^ 2 / (4 * a)) ∧
      c - b ^ 2 / (4 * a) = a * (-b / (2 * a)) ^ 2 + b * (-b / (2 * a)) + c := by
  refine ⟨by field_simp; ring, by field_simp, by ring, by field_simp; ring⟩

/-- Predpostavka `dopolnjevanje` se da izpolniti (a = 1, b = −6, c = 5). -/
example : (1 : ℝ) * 3 ^ 2 + -6 * 3 + 5 = 1 * ((3 + -6 / (2 * 1)) ^ 2 - (-6) ^ 2 / (4 * 1 ^ 2)) + 5 :=
  (dopolnjevanje 1 (-6) 5 3 one_ne_zero).1

/-- Razlaga 5, premisli: parabola y = 2x² s temenom T(−1, 4), tj. 2(x + 1)² + 4, ne seka osi x
(vse vrednosti so ≥ 4 > 0).
trditev: MAT-SS-2/kvadratna-funkcija#premisli-2x2
besedilo: »Parabolo $y = 2x^2$ premaknemo tako, da ima teme $T(-1, 4)$.« -/
theorem premisli_2x2 (x : ℝ) : 4 ≤ 2 * (x - -1) ^ 2 + 4 ∧ 2 * (x - -1) ^ 2 + 4 ≠ 0 := by
  constructor <;> nlinarith [sq_nonneg (x + 1)]

/-- Razlaga 5, Preveri: teme x² − 4x + 1 je T(2, −3): p = −(−4)/(2·1) = 2, q = 4 − 8 + 1 = −3.
trditev: MAT-SS-2/kvadratna-funkcija#preveri-teme
besedilo: »Preveri:* kje je teme $f(x) = x^2 - 4x + 1$? ($p = 2$, $q = f(2) = 4 - 8 + 1 = -3$, torej $T(2, -3)$.)« -/
theorem preveri_teme (x : ℝ) : -(-4 : ℝ) / (2 * 1) = 2 ∧ ((2 : ℝ) ^ 2 - 4 * 2 + 1 = 4 - 8 + 1 ∧
    (4 : ℝ) - 8 + 1 = -3) ∧ x ^ 2 - 4 * x + 1 = (x - 2) ^ 2 + -3 := by
  refine ⟨by norm_num, by norm_num, by ring⟩

/-! ## Ničle -/

/-- Razlaga 6: a(x − p)² + q = 0 ⇔ (x − p)² = −q/a (a ≠ 0).
trditev: MAT-SS-2/kvadratna-funkcija#nicle-iz-temenske
besedilo: »iz temenske oblike**: rešimo $a(x - p)^2 + q = 0$, torej $(x - p)^2 = -\dfrac{q}{a}$, in korenimo (ne pozabi na $\pm$);« -/
theorem nicle_iz_temenske (a p q x : ℝ) (ha : a ≠ 0) :
    a * (x - p) ^ 2 + q = 0 ↔ (x - p) ^ 2 = -q / a := by
  rw [eq_div_iff ha]
  constructor <;> intro h <;> linarith

/-- Predpostavka `nicle_iz_temenske` se da izpolniti (a = 1). -/
example : (1 : ℝ) * (3 - 1) ^ 2 + -4 = 0 ↔ ((3 : ℝ) - 1) ^ 2 = -(-4) / 1 :=
  nicle_iz_temenske 1 1 (-4) 3 one_ne_zero

/-- Razlaga 6 (razstavljanje): x² − 5x + 6 = (x − 2)(x − 3), ničli 2 in 3; 2x² − 10x + 12 = 2(x² − 5x + 6).
trditev: MAT-SS-2/kvadratna-funkcija#razstavljanje
besedilo: »z razstavljanjem**, kot znaš iz 1. letnika: $x^2 - 5x + 6 = (x - 2)(x - 3)$, ničli sta $2$ in $3$. Pri $a \ne 1$ najprej izpostavi $a$: $2x^2 - 10x + 12 = 2(x^2 - 5x + 6)$.« -/
theorem razstavljanje (x : ℝ) : x ^ 2 - 5 * x + 6 = (x - 2) * (x - 3) ∧
    (x ^ 2 - 5 * x + 6 = 0 ↔ x = 2 ∨ x = 3) ∧ 2 * x ^ 2 - 10 * x + 12 = 2 * (x ^ 2 - 5 * x + 6) := by
  refine ⟨by ring, ?_, by ring⟩
  rw [enacba_iff (P := (x - 2) * (x - 3)) (by ring), dva_faktorja]

/-- Bolj natančno: za a ≠ 0 je −q/a > 0 natanko tedaj, ko sta a in q različno predznačena (a·q < 0).
trditev: MAT-SS-2/kvadratna-funkcija#desna-pozitivna
besedilo: »Število ničel.** Iz $(x - p)^2 = -\dfrac{q}{a}$ sledi: desna stran je pozitivna natanko tedaj, ko sta $a$ in $q$ različno predznačena; takrat sta ničli $x_{1,2} = p \pm \sqrt{-\dfrac{q}{a}}$, simetrični glede na $p$.« -/
theorem desna_pozitivna (a q : ℝ) (ha : a ≠ 0) : 0 < -q / a ↔ a * q < 0 := by
  have e : -q / a = -(a * q) / a ^ 2 := by field_simp
  rw [e, div_pos_iff_of_pos_right (by positivity)]
  constructor <;> intro h <;> linarith

/-- Predpostavka `desna_pozitivna` se da izpolniti (a = 1). -/
example : 0 < -(-4 : ℝ) / 1 ↔ (1 : ℝ) * (-4) < 0 := desna_pozitivna 1 (-4) one_ne_zero

/-- Razlaga 6, Povzetek, Bolj natančno, Ustno vprašanje 3 (število ničel): a, q različnih predznakov ⇒
ničli p ± √(−q/a) (simetrični glede na p, razdalja 2√(−q/a) ni odvisna od p); q = 0 ⇒ ena (dvojna) ničla
p in f(x) = a(x − p)²; a, q enakih predznakov ⇒ realnih ničel ni.
trditev: MAT-SS-2/kvadratna-funkcija#stevilo-nicel
besedilo: »Število ničel.** Iz $(x - p)^2 = -\dfrac{q}{a}$ sledi: desna stran je pozitivna natanko tedaj, ko sta $a$ in $q$ različno predznačena; takrat sta ničli $x_{1,2} = p \pm \sqrt{-\dfrac{q}{a}}$, simetrični glede na $p$.« -/
theorem stevilo_nicel (a p q : ℝ) (ha : a ≠ 0) :
    (a * q < 0 → (∀ x, a * (x - p) ^ 2 + q = 0 ↔ x = p - Real.sqrt (-q / a) ∨ x = p + Real.sqrt (-q / a)) ∧
        (p - Real.sqrt (-q / a) + (p + Real.sqrt (-q / a))) / 2 = p ∧
        (p + Real.sqrt (-q / a)) - (p - Real.sqrt (-q / a)) = 2 * Real.sqrt (-q / a)) ∧
      (q = 0 → ∀ x, (a * (x - p) ^ 2 + q = 0 ↔ x = p) ∧ a * (x - p) ^ 2 + q = a * (x - p) ^ 2) ∧
      (0 < a * q → ∀ x, a * (x - p) ^ 2 + q ≠ 0) := by
  refine ⟨fun hq => ⟨fun x => ?_, by ring, by ring⟩, fun hq x => ?_, fun hq x h => ?_⟩
  · have hpos : 0 < -q / a := (desna_pozitivna a q ha).2 hq
    have hs : Real.sqrt (-q / a) ^ 2 = -q / a := Real.sq_sqrt hpos.le
    have hq' : a * Real.sqrt (-q / a) ^ 2 = -q := by rw [hs]; field_simp
    have e : a * (x - p) ^ 2 + q =
        a * ((x - (p - Real.sqrt (-q / a))) * (x - (p + Real.sqrt (-q / a)))) := by
      linear_combination hq'
    rw [e, mul_eq_zero, or_iff_right ha, dva_faktorja]
  · subst hq
    refine ⟨?_, by ring⟩
    simp [ha, sub_eq_zero]
  · have h2 : a * (a * (x - p) ^ 2 + q) = 0 := by rw [h, mul_zero]
    nlinarith [sq_nonneg (a * (x - p))]

/-- Predpostavka `stevilo_nicel` se da izpolniti (a = 1). -/
example : (1 : ℝ) * (1 - 1) ^ 2 + 0 = 0 ↔ (1 : ℝ) = 1 := ((stevilo_nicel 1 1 0 one_ne_zero).2.1 rfl 1).1

/-- Razlaga 6 (slika): a = 1, p = 1, q = −4: ničli 1 ∓ √4, tj. −1 in 3.
trditev: MAT-SS-2/kvadratna-funkcija#slika-nicle
besedilo: »Na sliki je $a = 1$, $p = 1$ in $q = -4$, ista parabola kot v 4. točki: teme $T(1, -4)$ leži pod osjo $x$, ničli $x_1 = -1$ in $x_2 = 3$ (točki na osi $x$) sta enako daleč od črtkane osi.« -/
theorem slika_nicle (x : ℝ) : (x - 1) ^ 2 + -4 = 0 ↔ x = -1 ∨ x = 3 := by
  rw [enacba_iff (P := (x - -1) * (x - 3)) (by ring), dva_faktorja]

/-- Razlaga 6, premisli: f(x) = −2(x − 1)² + 8 seka os x pri x = −1 in x = 3; g(x) = 2(x − 1)² + 8 je
povsod ≥ 8 > 0 in osi ne seka.
trditev: MAT-SS-2/kvadratna-funkcija#premisli-f-g
besedilo: »Funkciji $f(x) = -2(x - 1)^2 + 8$ in $g(x) = 2(x - 1)^2 + 8$ imata isto teme. Napovej, kje graf $f$ seka os $x$, in pojasni, zakaj graf $g$ osi ne seka.« -/
theorem premisli_f_g (x : ℝ) : (-2 * (x - 1) ^ 2 + 8 = 0 ↔ x = -1 ∨ x = 3) ∧
    8 ≤ 2 * (x - 1) ^ 2 + 8 ∧ 2 * (x - 1) ^ 2 + 8 ≠ 0 := by
  refine ⟨?_, by nlinarith [sq_nonneg (x - 1)], by nlinarith [sq_nonneg (x - 1)]⟩
  rw [enacba_iff (P := -2 * ((x - -1) * (x - 3))) (by ring), mul_eq_zero, dva_faktorja,
    or_iff_right (by norm_num)]

/-- Razlaga 6, Preveri: ničli (x − 1)² − 3 sta 1 − √3 in 1 + √3.
trditev: MAT-SS-2/kvadratna-funkcija#preveri-koren3
besedilo: »Preveri:* kateri sta ničli $f(x) = (x - 1)^2 - 3$? (Iz $x - 1 = \pm\sqrt{3}$ sledi $x_1 = 1 - \sqrt{3}$ in $x_2 = 1 + \sqrt{3}$; ničli nista vedno celi števili.)« -/
theorem preveri_koren3 (x : ℝ) : (x - 1) ^ 2 - 3 = 0 ↔ x = 1 - Real.sqrt 3 ∨ x = 1 + Real.sqrt 3 := by
  have hs : Real.sqrt 3 ^ 2 = 3 := Real.sq_sqrt (by norm_num)
  rw [enacba_iff (P := (x - (1 - Real.sqrt 3)) * (x - (1 + Real.sqrt 3))) (by linear_combination hs),
    dva_faktorja]

/-! ## Lastnosti -/

/-- Razlaga 7, Povzetek: za a > 0 funkcija a(x − p)² + q pada na (−∞, p], narašča na [p, ∞).
trditev: MAT-SS-2/kvadratna-funkcija#monotonost-poz
besedilo: »Lastnosti.** Za $a > 0$ funkcija pada na intervalu $(-\infty, p]$ in narašča na $[p, \infty)$,« -/
theorem monotonost_poz (a p q : ℝ) (ha : 0 < a) :
    StrictAntiOn (fun x => a * (x - p) ^ 2 + q) (Iic p) ∧
      StrictMonoOn (fun x => a * (x - p) ^ 2 + q) (Ici p) := by
  refine ⟨fun x hx y hy hxy => ?_, fun x hx y hy hxy => ?_⟩
  · simp only [mem_Iic] at hx hy
    show a * (y - p) ^ 2 + q < a * (x - p) ^ 2 + q
    nlinarith [mul_pos ha (mul_pos (sub_pos.2 hxy) (by linarith : (0 : ℝ) < 2 * p - x - y))]
  · simp only [mem_Ici] at hx hy
    show a * (x - p) ^ 2 + q < a * (y - p) ^ 2 + q
    nlinarith [mul_pos ha (mul_pos (sub_pos.2 hxy) (by linarith : (0 : ℝ) < x + y - 2 * p))]

/-- Predpostavka `monotonost_poz` se da izpolniti (a = 1). -/
example : StrictMonoOn (fun x : ℝ => 1 * (x - 0) ^ 2 + 0) (Ici 0) := (monotonost_poz 1 0 0 one_pos).2

/-- Razlaga 7, Povzetek: za a < 0 funkcija a(x − p)² + q narašča na (−∞, p], pada na [p, ∞).
trditev: MAT-SS-2/kvadratna-funkcija#monotonost-neg
besedilo: »Za $a < 0$ je obratno: narašča na $(-\infty, p]$, pada na $[p, \infty)$, zaloga vrednosti je $(-\infty, q]$.« -/
theorem monotonost_neg (a p q : ℝ) (ha : a < 0) :
    StrictMonoOn (fun x => a * (x - p) ^ 2 + q) (Iic p) ∧
      StrictAntiOn (fun x => a * (x - p) ^ 2 + q) (Ici p) := by
  refine ⟨fun x hx y hy hxy => ?_, fun x hx y hy hxy => ?_⟩
  · simp only [mem_Iic] at hx hy
    show a * (x - p) ^ 2 + q < a * (y - p) ^ 2 + q
    nlinarith [mul_pos (neg_pos.2 ha) (mul_pos (sub_pos.2 hxy) (by linarith : (0 : ℝ) < 2 * p - x - y))]
  · simp only [mem_Ici] at hx hy
    show a * (y - p) ^ 2 + q < a * (x - p) ^ 2 + q
    nlinarith [mul_pos (neg_pos.2 ha) (mul_pos (sub_pos.2 hxy) (by linarith : (0 : ℝ) < x + y - 2 * p))]

/-- Predpostavka `monotonost_neg` se da izpolniti (a = −1). -/
example : StrictMonoOn (fun x : ℝ => -1 * (x - 0) ^ 2 + 0) (Iic 0) :=
  (monotonost_neg (-1) 0 0 (by norm_num)).1

/-- Razlaga 7, Povzetek: zaloga vrednosti a(x − p)² + q je [q, ∞) za a > 0 in (−∞, q] za a < 0.
trditev: MAT-SS-2/kvadratna-funkcija#zaloga
besedilo: »Preveri:* kakšna je zaloga vrednosti $f(x) = -(x - 2)^2 + 9$? ($(-\infty, 9]$, ker je $a < 0$.)« -/
theorem zaloga (a p q : ℝ) :
    (0 < a → range (fun x => a * (x - p) ^ 2 + q) = Ici q) ∧
      (a < 0 → range (fun x => a * (x - p) ^ 2 + q) = Iic q) := by
  refine ⟨fun ha => ?_, fun ha => ?_⟩
  · ext y
    simp only [mem_range, mem_Ici]
    constructor
    · rintro ⟨x, rfl⟩; nlinarith [sq_nonneg (x - p)]
    · intro hy
      have hd : 0 ≤ (y - q) / a := div_nonneg (by linarith) ha.le
      refine ⟨p + Real.sqrt ((y - q) / a), ?_⟩
      rw [show p + Real.sqrt ((y - q) / a) - p = Real.sqrt ((y - q) / a) by ring, Real.sq_sqrt hd]
      field_simp; ring
  · ext y
    simp only [mem_range, mem_Iic]
    constructor
    · rintro ⟨x, rfl⟩; nlinarith [sq_nonneg (x - p)]
    · intro hy
      have hd : 0 ≤ (y - q) / a := div_nonneg_of_nonpos (by linarith) ha.le
      have ha0 : a ≠ 0 := ha.ne
      refine ⟨p + Real.sqrt ((y - q) / a), ?_⟩
      rw [show p + Real.sqrt ((y - q) / a) - p = Real.sqrt ((y - q) / a) by ring, Real.sq_sqrt hd]
      field_simp; ring

/-- Razlaga 7, Preveri: zaloga vrednosti −(x − 2)² + 9 je (−∞, 9].
trditev: MAT-SS-2/kvadratna-funkcija#preveri-zaloga
besedilo: »Preveri:* kakšna je zaloga vrednosti $f(x) = -(x - 2)^2 + 9$? ($(-\infty, 9]$, ker je $a < 0$.)« -/
theorem preveri_zaloga : range (fun x : ℝ => -(x - 2) ^ 2 + 9) = Iic 9 := by
  have e : (fun x : ℝ => -(x - 2) ^ 2 + 9) = fun x => -1 * (x - 2) ^ 2 + 9 := by funext x; ring
  rw [e]; exact (zaloga (-1) 2 9).2 (by norm_num)

/-- Razlaga 8: parabola skozi (0, 3), (1, 2), (2, 5): c = 3, a + b = −1, 2a + b = 1, a = 2, b = −3
(enolično), f(x) = 2x² − 3x + 3.
trditev: MAT-SS-2/kvadratna-funkcija#predpis-iz-tock
besedilo: »Odštejemo: $a = 2$, torej $b = -3$ in $f(x) = 2x^2 - 3x + 3$.« -/
theorem predpis_iz_tock (a b c : ℝ) :
    (a * 0 ^ 2 + b * 0 + c = 3 ∧ a * 1 ^ 2 + b * 1 + c = 2 ∧ a * 2 ^ 2 + b * 2 + c = 5) ↔
      (a = 2 ∧ b = -3 ∧ c = 3) := by
  constructor
  · rintro ⟨h0, h1, h2⟩
    have hc : c = 3 := by linarith
    have e1 : a + b = -1 := by linarith
    have e2 : 2 * a + b = 1 := by linarith
    have ha : a = 2 := by linarith
    exact ⟨ha, by linarith, hc⟩
  · rintro ⟨rfl, rfl, rfl⟩; norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: f(x) = 2(x − 1)² − 8: teme T(1, −8) je minimum (a = 2 > 0, |2| > 1), f(0) = 2(0 − 1)² − 8 =
2 − 8 = −6, zrcalna točka f(2) = −6.
trditev: MAT-SS-2/kvadratna-funkcija#primer1-teme
besedilo: »$f(0) = 2(0 - 1)^2 - 8 = 2 - 8 = -6$« -/
theorem primer1_teme : (∀ x : ℝ, -8 ≤ 2 * (x - 1) ^ 2 - 8) ∧ 2 * ((1 : ℝ) - 1) ^ 2 - 8 = -8 ∧
    (0 : ℝ) < 2 ∧ 1 < |(2 : ℝ)| ∧ (2 * ((0 : ℝ) - 1) ^ 2 - 8 = 2 - 8 ∧ (2 : ℝ) - 8 = -6) ∧
    2 * ((2 : ℝ) - 1) ^ 2 - 8 = -6 := by
  refine ⟨fun x => by nlinarith [sq_nonneg (x - 1)], by norm_num, by norm_num, ?_, by norm_num,
    by norm_num⟩
  rw [abs_of_pos (by norm_num)]; norm_num

/-- Primer 1, korak 3: 2(x − 1)² − 8 = 0 ⇔ (x − 1)² = 4 ⇔ x − 1 = ±2 ⇔ x = −1 ali x = 3.
trditev: MAT-SS-2/kvadratna-funkcija#primer1-nicle
besedilo: »Ničle: $2(x - 1)^2 - 8 = 0$, $(x - 1)^2 = 4$, $x - 1 = \pm 2$. Dobimo $x_1 = -1$ in $x_2 = 3$.« -/
theorem primer1_nicle (x : ℝ) : 2 * (x - 1) ^ 2 - 8 = 0 ↔ x = -1 ∨ x = 3 := by
  calc 2 * (x - 1) ^ 2 - 8 = 0 ↔ (x - 1) ^ 2 = 4 := by constructor <;> intro h <;> linarith
    _ ↔ (x - 1) ^ 2 = 2 ^ 2 := by norm_num
    _ ↔ x = 1 + 2 ∨ x = 1 - 2 := kvadrat_iff x 1 2
    _ ↔ x = -1 ∨ x = 3 := by norm_num [or_comm]

/-- Primer 1, korak 4: f(3) = 2·4 − 8 = 0, f(−1) = 2·4 − 8 = 0; ničli sta simetrični glede na x = 1.
trditev: MAT-SS-2/kvadratna-funkcija#primer1-preverjanje
besedilo: »Preverjanje: $f(3) = 2 \cdot 4 - 8 = 0$ in $f(-1) = 2 \cdot 4 - 8 = 0$. Ničli sta simetrični glede na os $x = 1$.« -/
theorem primer1_preverjanje : 2 * ((3 : ℝ) - 1) ^ 2 - 8 = 2 * 4 - 8 ∧ (2 : ℝ) * 4 - 8 = 0 ∧
    2 * ((-1 : ℝ) - 1) ^ 2 - 8 = 2 * 4 - 8 ∧ ((-1 : ℝ) + 3) / 2 = 1 := by norm_num

/-- Primer 1, korak 5 in Razlaga 7: Z_f = [−8, ∞); graf pada do x = 1, nato narašča.
trditev: MAT-SS-2/kvadratna-funkcija#primer1-zaloga
besedilo: »Na risbi Primera 1 to vidiš: graf pada do $x = 1$, nato narašča, najmanjša vrednost je $-8$.« -/
theorem primer1_zaloga : range (fun x : ℝ => 2 * (x - 1) ^ 2 - 8) = Ici (-8) ∧
    StrictAntiOn (fun x : ℝ => 2 * (x - 1) ^ 2 - 8) (Iic 1) ∧
    StrictMonoOn (fun x : ℝ => 2 * (x - 1) ^ 2 - 8) (Ici 1) := by
  have e : (fun x : ℝ => 2 * (x - 1) ^ 2 - 8) = fun x => 2 * (x - 1) ^ 2 + -8 := by funext x; ring
  rw [e]
  exact ⟨(zaloga 2 1 (-8)).1 (by norm_num), monotonost_poz 2 1 (-8) (by norm_num)⟩

/-- Primer 2, koraka 1–2: p = −1,2/(2·(−0,25)) = 2,4; q = h(2,4) = −0,25·2,4² + 1,2·2,4 + 2,25 = 3,69;
ker je a < 0, je to največja vrednost, dosežena le pri x = 2,4.
trditev: MAT-SS-2/kvadratna-funkcija#primer2-teme
besedilo: »Druga koordinata: $q = h(2{,}4) = -0{,}25 \cdot 2{,}4^2 + 1{,}2 \cdot 2{,}4 + 2{,}25 = 3{,}69$. Ker je $a < 0$, je teme najvišja točka.« -/
theorem primer2_teme : -(1.2 : ℝ) / (2 * (-0.25)) = 2.4 ∧
    -0.25 * (2.4 : ℝ) ^ 2 + 1.2 * 2.4 + 2.25 = 3.69 ∧
    (∀ x : ℝ, -0.25 * x ^ 2 + 1.2 * x + 2.25 ≤ 3.69) ∧
    ∀ x : ℝ, -0.25 * x ^ 2 + 1.2 * x + 2.25 = 3.69 ↔ x = 2.4 := by
  refine ⟨by norm_num, by norm_num, fun x => by nlinarith [sq_nonneg (x - 2.4)], fun x => ?_⟩
  rw [show -0.25 * x ^ 2 + 1.2 * x + 2.25 = -0.25 * (x - 2.4) ^ 2 + 3.69 by ring]
  exact le_v_temenu _ _ _ _ (by norm_num)

/-- Primer 2, korak 3: h(x) = −0,25(x − 2,4)² + 3,69; h(0) = −0,25·5,76 + 3,69 = 2,25.
trditev: MAT-SS-2/kvadratna-funkcija#primer2-temenska
besedilo: »Temenska oblika: $h(x) = -0{,}25(x - 2{,}4)^2 + 3{,}69$. Kontrola s prostim členom: $h(0) = -0{,}25 \cdot 5{,}76 + 3{,}69 = 2{,}25$, višina izmeta.« -/
theorem primer2_temenska (x : ℝ) : -0.25 * x ^ 2 + 1.2 * x + 2.25 = -0.25 * (x - 2.4) ^ 2 + 3.69 ∧
    -0.25 * ((0 : ℝ) - 2.4) ^ 2 + 3.69 = -0.25 * 5.76 + 3.69 ∧ -0.25 * (5.76 : ℝ) + 3.69 = 2.25 := by
  refine ⟨by ring, by norm_num, by norm_num⟩

/-- Primer 2, korak 4: −0,25(x − 2,4)² + 3,69 = 3,05 ⇔ (x − 2,4)² = 2,56 ⇔ x − 2,4 = ±1,6 ⇔ x = 0,8
ali x = 4; obe sta simetrični glede na x = 2,4.
trditev: MAT-SS-2/kvadratna-funkcija#primer2-obroc
besedilo: »Višina obroča: enačba $-0{,}25(x - 2{,}4)^2 + 3{,}69 = 3{,}05$ da $(x - 2{,}4)^2 = 2{,}56$, torej $x - 2{,}4 = \pm 1{,}6$. Rešitvi sta $x = 0{,}8$ in $x = 4$, simetrični glede na os $x = 2{,}4$.« -/
theorem primer2_obroc (x : ℝ) : (-0.25 * (x - 2.4) ^ 2 + 3.69 = 3.05 ↔ x = 0.8 ∨ x = 4) ∧
    ((0.8 : ℝ) + 4) / 2 = 2.4 := by
  refine ⟨?_, by norm_num⟩
  calc -0.25 * (x - 2.4) ^ 2 + 3.69 = 3.05 ↔ (x - 2.4) ^ 2 = 2.56 := by
        constructor <;> intro h <;> linarith
    _ ↔ (x - 2.4) ^ 2 = 1.6 ^ 2 := by norm_num
    _ ↔ x = 2.4 + 1.6 ∨ x = 2.4 - 1.6 := kvadrat_iff x 2.4 1.6
    _ ↔ x = 0.8 ∨ x = 4 := by norm_num [or_comm]

/-- Primer 2, korak 5: h narašča na [0; 2,4] in pada na [2,4; ∞); od temena do obroča se žoga spusti za
3,69 − 3,05 = 0,64 m. Razlaga 5: ax² + bx je 0 pri 0 in −b/a = 4,8, sredina 2,4.
trditev: MAT-SS-2/kvadratna-funkcija#primer2-narascanje
besedilo: »Pri $x = 0{,}8$ se žoga še dviga (funkcija narašča na $[0; 2{,}4]$), pri $x = 4$ pa pada: od temena se spusti za $3{,}69 - 3{,}05 = 0{,}64\,\text{m}$ in pade v koš od zgoraj.« -/
theorem primer2_narascanje :
    StrictMonoOn (fun x : ℝ => -0.25 * x ^ 2 + 1.2 * x + 2.25) (Icc 0 2.4) ∧
      StrictAntiOn (fun x : ℝ => -0.25 * x ^ 2 + 1.2 * x + 2.25) (Ici 2.4) ∧
      (3.69 : ℝ) - 3.05 = 0.64 ∧ -(1.2 : ℝ) / (-0.25) = 4.8 ∧ ((0 : ℝ) + 4.8) / 2 = 2.4 := by
  have e : (fun x : ℝ => -0.25 * x ^ 2 + 1.2 * x + 2.25) = fun x => -0.25 * (x - 2.4) ^ 2 + 3.69 := by
    funext x; ring
  obtain ⟨h1, h2⟩ := monotonost_neg (-0.25) 2.4 3.69 (by norm_num)
  rw [e]
  exact ⟨h1.mono (fun x hx => hx.2), h2, by norm_num, by norm_num, by norm_num⟩

/-- Primer 3, korak 1 in formula: če model a(t − p)² + q (a ≠ 0) da f(12) = f(16) = 19 in f(8) = 11, je
p = (12 + 16)/2 = 14, a = −0,25 in q = 20 (model je enolično določen).
trditev: MAT-SS-2/kvadratna-funkcija#primer3-enolicnost
besedilo: »Model je $f(t) = -0{,}25(t - 14)^2 + 20$. Kontrola s četrto meritvijo: $f(20) = -0{,}25 \cdot 36 + 20 = 11$.« -/
theorem primer3_enolicnost (a p q : ℝ) (ha : a ≠ 0) (h12 : a * (12 - p) ^ 2 + q = 19)
    (h16 : a * (16 - p) ^ 2 + q = 19) (h8 : a * (8 - p) ^ 2 + q = 11) :
    p = 14 ∧ a = -0.25 ∧ q = 20 := by
  have hp : p = (12 + 16) / 2 := os_na_sredini a p q 12 16 ha (by norm_num) (h12.trans h16.symm)
  have hp' : p = 14 := by rw [hp]; norm_num
  subst hp'
  have e1 : 4 * a + q = 19 := by linarith
  have e2 : 36 * a + q = 11 := by linarith
  have e3 : -32 * a = 8 := by linarith
  have ha' : a = -0.25 := by linarith
  refine ⟨rfl, ha', ?_⟩
  calc q = 19 - 4 * a := by linarith
    _ = 19 - 4 * (-0.25) := by rw [ha']
    _ = 20 := by norm_num

/-- Predpostavke `primer3_enolicnost` se dajo izpolniti (a = −0,25, p = 14, q = 20), kontrola s četrto
meritvijo: f(20) = −0,25·36 + 20 = 11. -/
example : (-0.25 : ℝ) ≠ 0 ∧ -0.25 * ((12 : ℝ) - 14) ^ 2 + 20 = 19 ∧ -0.25 * ((16 : ℝ) - 14) ^ 2 + 20 = 19 ∧
    -0.25 * ((8 : ℝ) - 14) ^ 2 + 20 = 11 := by norm_num

/-- Predpostavke trditve `primer3_enolicnost` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (-0.25 : ℝ) ≠ 0 ∧ -0.25 * ((12 : ℝ) - 14) ^ 2 + 20 = 19 ∧ -0.25 * ((16 : ℝ) - 14) ^ 2 + 20 = 19 ∧ -0.25 * ((8 : ℝ) - 14) ^ 2 + 20 = 11 := by norm_num
  primer3_enolicnost (ha := w.1) (h12 := w.2.1) (h16 := w.2.2.1) (h8 := w.2.2.2)

/-- Primer 3, koraki 2–4: 4a + q = 19 in 36a + q = 11 ⇒ −32a = 8, a = −0,25, q = 19 − 4·(−0,25) = 20;
f(20) = −0,25·36 + 20 = 11.
trditev: MAT-SS-2/kvadratna-funkcija#primer3-racun
besedilo: »Drugo enačbo odštejemo od prve: $-32a = 8$, zato $a = -0{,}25$. Nato $q = 19 - 4 \cdot (-0{,}25) = 20$.« -/
theorem primer3_racun : (-0.25 : ℝ) * (12 - 14) ^ 2 = 4 * -0.25 ∧ (-0.25 : ℝ) * (8 - 14) ^ 2 = 36 * -0.25 ∧
    (4 : ℝ) * -0.25 - 36 * -0.25 = 8 ∧ -(32 : ℝ) * -0.25 = 8 ∧ (19 : ℝ) - 4 * (-0.25) = 20 ∧
    (-0.25 * ((20 : ℝ) - 14) ^ 2 + 20 = -0.25 * 36 + 20 ∧ -0.25 * (36 : ℝ) + 20 = 11) := by norm_num

/-- Primer 3, korak 5: −0,25(t − 14)² + 20 = 16 ⇔ (t − 14)² = 16 ⇔ t − 14 = ±4 ⇔ t = 10 ali t = 18.
trditev: MAT-SS-2/kvadratna-funkcija#primer3-16
besedilo: »Temperatura $16\,^\circ\text{C}$: $-0{,}25(t - 14)^2 + 20 = 16$, torej $(t - 14)^2 = 16$ in $t - 14 = \pm 4$. Dobimo $t = 10$ in $t = 18$.« -/
theorem primer3_16 (t : ℝ) : -0.25 * (t - 14) ^ 2 + 20 = 16 ↔ t = 10 ∨ t = 18 := by
  calc -0.25 * (t - 14) ^ 2 + 20 = 16 ↔ (t - 14) ^ 2 = 16 := by constructor <;> intro h <;> linarith
    _ ↔ (t - 14) ^ 2 = 4 ^ 2 := by norm_num
    _ ↔ t = 14 + 4 ∨ t = 14 - 4 := kvadrat_iff t 14 4
    _ ↔ t = 10 ∨ t = 18 := by norm_num [or_comm]

/-- Primer 3, koraka 6–7: največja temperatura po modelu je 20 °C ob 14.00 (višja od 19 °C, Jaka nima
prav); 20 °C je dosežena le ob 14.00; f(0) = −0,25·196 + 20 = −29. Razlaga 5: os je ob 14.00,
(12 + 16)/2 = 14.
trditev: MAT-SS-2/kvadratna-funkcija#primer3-vrh
besedilo: »Meja modela: velja le med 8.00 in 20.00. Za polnoč bi dal $f(0) = -0{,}25 \cdot 196 + 20 = -29$, torej nesmiselnih $-29\,^\circ\text{C}$. Tudi resnična temperatura je v jasnem dnevu najvišja navadno med 14. in 16. uro, a njen potek ni natančno parabola.« -/
theorem primer3_vrh : (∀ t : ℝ, -0.25 * (t - 14) ^ 2 + 20 ≤ 20) ∧ -0.25 * ((14 : ℝ) - 14) ^ 2 + 20 = 20 ∧
    (∀ t : ℝ, -0.25 * (t - 14) ^ 2 + 20 = 20 ↔ t = 14) ∧
    (19 : ℝ) < 20 ∧ (-0.25 * ((0 : ℝ) - 14) ^ 2 + 20 = -0.25 * 196 + 20 ∧ -0.25 * (196 : ℝ) + 20 = -29) ∧
    ((12 : ℝ) + 16) / 2 = 14 := by
  refine ⟨fun t => by nlinarith [sq_nonneg (t - 14)], by norm_num,
    fun t => le_v_temenu _ _ _ _ (by norm_num), by norm_num, by norm_num, by norm_num⟩

/-- Primer 4, koraka 1–2: f(x) = a(x − 3)² − 2 in f(1) = 6: 6 = a(1 − 3)² − 2 = 4a − 2 ⇔ a = 2 (enolično).
trditev: MAT-SS-2/kvadratna-funkcija#primer4-a
besedilo: »Iz $2(x - 3)^2 = 2$ sledi $(x - 3)^2 = 1$ in $x - 3 = \pm 1$, torej $x_1 = 2$ in $x_2 = 4$. Ničelna oblika je $f(x) = 2(x - 2)(x - 4)$. Kontrola: $f(1) = 2 \cdot (-1) \cdot (-3) = 6$.« -/
theorem primer4_a (a : ℝ) : (a * (1 - 3) ^ 2 - 2 = 4 * a - 2) ∧ (6 = a * (1 - 3) ^ 2 - 2 ↔ a = 2) := by
  refine ⟨by ring, by constructor <;> intro h <;> linarith⟩

/-- Primer 4, koraka 3–4: 2(x − 3)² − 2 = 2(x² − 6x + 9) − 2 = 2x² − 12x + 18 − 2 = 2x² − 12x + 16.
trditev: MAT-SS-2/kvadratna-funkcija#primer4-splosna
besedilo: »$2(x^2 - 6x + 9) - 2 = 2x^2 - 12x + 18 - 2 = 2x^2 - 12x + 16$« -/
theorem primer4_splosna (x : ℝ) : 2 * (x - 3) ^ 2 - 2 = 2 * (x ^ 2 - 6 * x + 9) - 2 ∧
    2 * (x ^ 2 - 6 * x + 9) - 2 = 2 * x ^ 2 - 12 * x + 18 - 2 ∧
    2 * x ^ 2 - 12 * x + 18 - 2 = 2 * x ^ 2 - 12 * x + 16 := ⟨by ring, by ring, by ring⟩

/-- Primer 4, premisli: 2(x − 3)² − 2 = 0 ⇔ (x − 3)² = 1 ⇔ x = 2 ali x = 4; ničelna oblika 2(x − 2)(x − 4),
kontrola f(1) = 2·(−1)·(−3) = 6.
trditev: MAT-SS-2/kvadratna-funkcija#primer4-nicle
besedilo: »Iz $2(x - 3)^2 = 2$ sledi $(x - 3)^2 = 1$ in $x - 3 = \pm 1$, torej $x_1 = 2$ in $x_2 = 4$. Ničelna oblika je $f(x) = 2(x - 2)(x - 4)$. Kontrola: $f(1) = 2 \cdot (-1) \cdot (-3) = 6$.« -/
theorem primer4_nicle (x : ℝ) : (2 * (x - 3) ^ 2 - 2 = 0 ↔ x = 2 ∨ x = 4) ∧
    2 * (x - 3) ^ 2 - 2 = 2 * (x - 2) * (x - 4) ∧ 2 * ((1 : ℝ) - 2) * (1 - 4) = 2 * (-1) * (-3) ∧
    (2 : ℝ) * (-1) * (-3) = 6 := by
  refine ⟨?_, by ring, by norm_num, by norm_num⟩
  calc 2 * (x - 3) ^ 2 - 2 = 0 ↔ (x - 3) ^ 2 = 1 ^ 2 := by constructor <;> intro h <;> linarith
    _ ↔ x = 3 + 1 ∨ x = 3 - 1 := kvadrat_iff x 3 1
    _ ↔ x = 2 ∨ x = 4 := by norm_num [or_comm]

/-! ## Pogoste napake -/

/-- Pogoste napake 1: (x + 3)² − 1 ima teme T(−3, −1) (x + 3 = x − (−3)), ne (3, −1).
trditev: MAT-SS-2/kvadratna-funkcija#napaka-teme
besedilo: »Napačen predznak v temenu.** Pri $f(x) = (x + 3)^2 - 1$ teme ni $(3, -1)$. Razlog: v temenski obliki je $x - p$, zato $x + 3 = x - (-3)$ in $p = -3$. Pravilno: $T(-3, -1)$. Kontrola: pri $x = p$ je oklepaj enak $0$.« -/
theorem napaka_teme : (∀ x : ℝ, (x + 3) ^ 2 - 1 = (x - -3) ^ 2 + -1) ∧ (∀ x : ℝ, -1 ≤ (x + 3) ^ 2 - 1) ∧
    ((-3 : ℝ) + 3) ^ 2 - 1 = -1 ∧ ((3 : ℝ) + 3) ^ 2 - 1 ≠ -1 := by
  refine ⟨fun x => by ring, fun x => by nlinarith [sq_nonneg (x + 3)], by norm_num, by norm_num⟩

/-- Pogoste napake 2: pri metu c = h(0) = 2,25, q = 3,69; pri b = 0 je c = q (teme pri p = 0).
trditev: MAT-SS-2/kvadratna-funkcija#napaka-c-q
besedilo: »$q = h(2{,}4) = -0{,}25 \cdot 2{,}4^2 + 1{,}2 \cdot 2{,}4 + 2{,}25 = 3{,}69$« -/
theorem napaka_c_q (a c : ℝ) : -0.25 * (0 : ℝ) ^ 2 + 1.2 * 0 + 2.25 = 2.25 ∧ (2.25 : ℝ) ≠ 3.69 ∧
    -(0 : ℝ) / (2 * a) = 0 ∧ a * 0 ^ 2 + 0 * 0 + c = c := by
  refine ⟨by norm_num, by norm_num, by simp, by ring⟩

/-- Pogoste napake 3: (x − 1)² = 4 ⇔ x − 1 = ±2 ⇔ x = 3 ali x = −1.
trditev: MAT-SS-2/kvadratna-funkcija#napaka-pm
besedilo: »Pozabljen $\pm$ pri korenjenju.** Iz $(x - 1)^2 = 4$ nekateri dobijo le $x = 3$. Razlog: enačba $(x - 1)^2 = 4$ ima dve rešitvi za oklepaj: $2$ in $-2$. Pravilno: $x - 1 = \pm 2$, torej $x = 3$ ali $x = -1$.« -/
theorem napaka_pm (x : ℝ) : (x - 1) ^ 2 = 4 ↔ x = 3 ∨ x = -1 := by
  calc (x - 1) ^ 2 = 4 ↔ (x - 1) ^ 2 = 2 ^ 2 := by norm_num
    _ ↔ x = 1 + 2 ∨ x = 1 - 2 := kvadrat_iff x 1 2
    _ ↔ x = 3 ∨ x = -1 := by norm_num

/-- Pogoste napake 4: pri 2x² − 12x + 16 je p = −(−12)/4 = 3, ne −3.
trditev: MAT-SS-2/kvadratna-funkcija#napaka-p
besedilo: »Napaka pri $p = -\dfrac{b}{2a}$.** Pri $f(x) = 2x^2 - 12x + 16$ je $b = -12$, zato $p = -\dfrac{-12}{4} = 3$, ne $-3$.« -/
theorem napaka_p : -(-12 : ℝ) / (2 * 2) = 3 ∧ -(-12 : ℝ) / (2 * 2) ≠ -3 := by norm_num

/-- Pogoste napake 5: pri −x² + 4x + 5 je f(−1) = −(−1)² − 4 + 5 = −1 − 4 + 5 = 0, ne 1 − 4 + 5 = 2.
trditev: MAT-SS-2/kvadratna-funkcija#napaka-minus
besedilo: »$-x^2$ in $(-x)^2$.** Pri $f(x) = -x^2 + 4x + 5$ je $f(-1) = -(-1)^2 - 4 + 5 = -1 - 4 + 5 = 0$, ne $1 - 4 + 5 = 2$.« -/
theorem napaka_minus : -(-1 : ℝ) ^ 2 + 4 * (-1) + 5 = -1 - 4 + 5 ∧ (-1 : ℝ) - 4 + 5 = 0 ∧
    (1 : ℝ) - 4 + 5 = 2 ∧ -(-1 : ℝ) ^ 2 + 4 * (-1) + 5 ≠ 2 := by norm_num

/-! ## Za maturo -/

/-- Za maturo, naloga 1: ničli −1 in 5 ⇒ f(x) = a(x + 1)(x − 5); a·1·(−5) = 10 ⇔ a = −2;
−2(x + 1)(x − 5) = −2(x² − 4x − 5) = −2x² + 8x + 10.
trditev: MAT-SS-2/kvadratna-funkcija#matura1
besedilo: »Odgovor: $f(x) = -2x^2 + 8x + 10$.« -/
theorem matura1 (a x : ℝ) : (a * (0 + 1) * (0 - 5) = 10 ↔ a = -2) ∧
    -2 * (x + 1) * (x - 5) = -2 * (x ^ 2 - 4 * x - 5) ∧ -2 * (x ^ 2 - 4 * x - 5) = -2 * x ^ 2 + 8 * x + 10 := by
  refine ⟨by constructor <;> intro h <;> linarith, by ring, by ring⟩

/-- Za maturo, naloga 1 (enoličnost): edina kvadratna funkcija z f(−1) = 0, f(5) = 0, f(0) = 10 je
−2x² + 8x + 10.
trditev: MAT-SS-2/kvadratna-funkcija#matura1-enolicnost
besedilo: »Odgovor: $f(x) = -2x^2 + 8x + 10$.« -/
theorem matura1_enolicnost (a b c : ℝ) :
    (a * (-1) ^ 2 + b * (-1) + c = 0 ∧ a * 5 ^ 2 + b * 5 + c = 0 ∧ a * 0 ^ 2 + b * 0 + c = 10) ↔
      (a = -2 ∧ b = 8 ∧ c = 10) := by
  constructor
  · rintro ⟨h1, h2, h3⟩
    refine ⟨by linarith, by linarith, by linarith⟩
  · rintro ⟨rfl, rfl, rfl⟩; norm_num

/-- Za maturo, naloga 2 a): f(x) = −x² − 2x + 3: p = −(−2)/(2·(−1)) = −1, q = f(−1) = −1 + 2 + 3 = 4,
f(x) = −(x + 1)² + 4.
trditev: MAT-SS-2/kvadratna-funkcija#matura2a
besedilo: »zato $p = -\dfrac{-2}{2 \cdot (-1)} = -1$ in $q = f(-1) = -1 + 2 + 3 = 4$.« -/
theorem matura2a (x : ℝ) : -(-2 : ℝ) / (2 * (-1)) = -1 ∧ (-(-1 : ℝ) ^ 2 - 2 * (-1) + 3 = -1 + 2 + 3 ∧
    (-1 : ℝ) + 2 + 3 = 4) ∧ -x ^ 2 - 2 * x + 3 = -(x + 1) ^ 2 + 4 := by
  refine ⟨by norm_num, by norm_num, by ring⟩

/-- Za maturo, naloga 2 b): −(x + 1)² + 4 = 0 ⇔ (x + 1)² = 4 ⇔ x + 1 = ±2 ⇔ x = −3 ali x = 1; f(0) = 3,
zrcalna točka f(−2) = 3.
trditev: MAT-SS-2/kvadratna-funkcija#matura2b
besedilo: »b) Iz $-(x + 1)^2 + 4 = 0$ sledi $(x + 1)^2 = 4$ in $x + 1 = \pm 2$, torej $x_1 = -3$ in $x_2 = 1$.« -/
theorem matura2b (x : ℝ) : (-(x + 1) ^ 2 + 4 = 0 ↔ x = -3 ∨ x = 1) ∧
    -(0 : ℝ) ^ 2 - 2 * 0 + 3 = 3 ∧ -(-2 : ℝ) ^ 2 - 2 * (-2) + 3 = 3 ∧ ((-2 : ℝ) + 0) / 2 = -1 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  calc -(x + 1) ^ 2 + 4 = 0 ↔ (x - -1) ^ 2 = 2 ^ 2 := by
        constructor <;> intro h <;> nlinarith
    _ ↔ x = -1 + 2 ∨ x = -1 - 2 := kvadrat_iff x (-1) 2
    _ ↔ x = -3 ∨ x = 1 := by norm_num [or_comm]

/-- Za maturo, naloga 2 c): Z_f = (−∞, 4], f narašča na (−∞, −1].
trditev: MAT-SS-2/kvadratna-funkcija#matura2c
besedilo: »Odgovor: $T(-1, 4)$, $f(x) = -(x + 1)^2 + 4$; ničli $-3$ in $1$, presečišče $(0, 3)$; $Z_f = (-\infty, 4]$, narašča na $(-\infty, -1]$.« -/
theorem matura2c : range (fun x : ℝ => -x ^ 2 - 2 * x + 3) = Iic 4 ∧
    StrictMonoOn (fun x : ℝ => -x ^ 2 - 2 * x + 3) (Iic (-1)) := by
  have e : (fun x : ℝ => -x ^ 2 - 2 * x + 3) = fun x => -1 * (x - -1) ^ 2 + 4 := by funext x; ring
  rw [e]
  exact ⟨(zaloga (-1) (-1) 4).2 (by norm_num), (monotonost_neg (-1) (-1) 4 (by norm_num)).1⟩

/-- Za maturo, naloga 3 a): ograja 3x, stranica ob zidu 120 − 3x, P(x) = x(120 − 3x) = −3x² + 120x; model
je smiseln za x > 0 in 120 − 3x > 0, tj. 0 < x < 40.
trditev: MAT-SS-2/kvadratna-funkcija#matura3a
besedilo: »a) Dolžini morata biti pozitivni: $x > 0$ in $120 - 3x > 0$, torej $0 < x < 40$.« -/
theorem matura3a (x : ℝ) : x * (120 - 3 * x) = -3 * x ^ 2 + 120 * x ∧
    ((0 < x ∧ 0 < 120 - 3 * x) ↔ (0 < x ∧ x < 40)) := by
  refine ⟨by ring, by constructor <;> rintro ⟨h1, h2⟩ <;> exact ⟨h1, by linarith⟩⟩

/-- Za maturo, naloga 3 b): P(x) = −3x(x − 40), ničli 0 in 40, p = (0 + 40)/2 = 20 = −120/(2·(−3));
največja ploščina P(20) = 20·60 = 1200 m² (dosežena le pri x = 20), 120 − 60 = 60 m.
trditev: MAT-SS-2/kvadratna-funkcija#matura3b
besedilo: »b) Ničelna oblika $P(x) = -3x(x - 40)$ ima ničli $0$ in $40$, zato je teme pri $p = \dfrac{0 + 40}{2} = 20$. Ker je $a = -3 < 0$, je tam največja vrednost.« -/
theorem matura3b (x : ℝ) : -3 * x ^ 2 + 120 * x = -3 * x * (x - 40) ∧ ((0 : ℝ) + 40) / 2 = 20 ∧
    -(120 : ℝ) / (2 * (-3)) = 20 ∧ (120 : ℝ) - 3 * 20 = 60 ∧
    (-3 * (20 : ℝ) ^ 2 + 120 * 20 = 20 * 60 ∧ (20 : ℝ) * 60 = 1200) ∧
    -3 * x ^ 2 + 120 * x ≤ 1200 ∧ (-3 * x ^ 2 + 120 * x = 1200 ↔ x = 20) := by
  refine ⟨by ring, by norm_num, by norm_num, by norm_num, by norm_num, by nlinarith [sq_nonneg (x - 20)],
    ?_⟩
  rw [show -3 * x ^ 2 + 120 * x = -3 * (x - 20) ^ 2 + 1200 by ring]
  exact le_v_temenu _ _ _ _ (by norm_num)

/-- Za maturo, naloga 3 c): −3x² + 120x = 900 ⇔ x² − 40x + 300 = 0 ⇔ (x − 10)(x − 30) = 0 ⇔ x = 10 ali
x = 30; mere 10 m × 90 m in 30 m × 30 m.
trditev: MAT-SS-2/kvadratna-funkcija#matura3c
besedilo: »c) Iz $-3x^2 + 120x = 900$ sledi $x^2 - 40x + 300 = 0$, torej $(x - 10)(x - 30) = 0$ in $x = 10$ ali $x = 30$.« -/
theorem matura3c (x : ℝ) : (-3 * x ^ 2 + 120 * x = 900 ↔ x ^ 2 - 40 * x + 300 = 0) ∧
    x ^ 2 - 40 * x + 300 = (x - 10) * (x - 30) ∧ (-3 * x ^ 2 + 120 * x = 900 ↔ x = 10 ∨ x = 30) ∧
    (120 : ℝ) - 3 * 10 = 90 ∧ (120 : ℝ) - 3 * 30 = 30 := by
  refine ⟨by constructor <;> intro h <;> linarith, by ring, ?_, by norm_num, by norm_num⟩
  rw [enacba_iff (P := -3 * ((x - 10) * (x - 30))) (by ring), mul_eq_zero, dva_faktorja,
    or_iff_right (by norm_num)]

/-- Za maturo, naloga 3 d): ploščina je vsaj 900 m² natanko za x ∈ [10, 30] (`RACUN`), kar je v
smiselnem območju (0, 40).
trditev: MAT-SS-2/kvadratna-funkcija#matura3d
besedilo: »zato je ploščina vsaj $900\,\text{m}^2$ za $x \in [10, 30]$.« -/
theorem matura3d (x : ℝ) : (900 ≤ -3 * x ^ 2 + 120 * x ↔ 10 ≤ x ∧ x ≤ 30) ∧
    Icc (10 : ℝ) 30 ⊆ Ioo 0 40 := by
  refine ⟨⟨fun h => ?_, fun ⟨h1, h2⟩ => by nlinarith⟩,
    fun y ⟨h1, h2⟩ => ⟨by linarith, by linarith⟩⟩
  have h0 : (x - 10) * (x - 30) ≤ 0 := by nlinarith
  constructor <;> nlinarith

/-- Ustno vprašanje 1 (definicija): pri a > 0 ima a(x − p)² + q v temenu najmanjšo vrednost, pri a < 0
največjo (glej `ekstrem`); |a| > 1 ožja, |a| < 1 širša (glej `ozja_sirsa`). Ustno vprašanje 3, primer:
(x − 2)² − 9 = 0 ⇔ x = −1 ali x = 5 (a > 0, q < 0).
trditev: MAT-SS-2/kvadratna-funkcija#ustno3
besedilo: »Funkcija $f(x) = (x - 2)^2 - 9$ ima na primer ničli $-1$ in $5$, ker je $a > 0$ in $q < 0$.« -/
theorem ustno3 (x : ℝ) : ((x - 2) ^ 2 - 9 = 0 ↔ x = -1 ∨ x = 5) ∧ (1 : ℝ) * (-9) < 0 := by
  refine ⟨?_, by norm_num⟩
  rw [enacba_iff (P := (x - -1) * (x - 5)) (by ring), dva_faktorja]

/-- Drugače: z analogijo (vrstni red): če parabolo najprej dvignemo za q in nato raztegnemo z a, je dno
na višini a·q.
trditev: MAT-SS-2/kvadratna-funkcija#analogija-vrstni-red
besedilo: »Vrstni red je pomemben: če bi folijo najprej dvignil za $q$ in jo šele nato raztegnil, bi dno pristalo na višini $a \cdot q$.« -/
theorem analogija_vrstni_red (a p q : ℝ) : a * ((p - p) ^ 2 + q) = a * q := by ring

/-! ## Preveri se -/

/-- Preveri se 1: teme T(−1, 2) in točka (0, 1): a(0 + 1)² + 2 = 1 ⇔ a = −1, torej f(x) = −(x + 1)² + 2;
(x + 1)² + 2 da pri 0 vrednost 3, −(x − 1)² + 2 ima pri −1 vrednost −2 ≠ 2, −(x + 1)² + 1 ima vrh 1 ≠ 2.
trditev: MAT-SS-2/kvadratna-funkcija#preveri1
besedilo: »Z mreže odčitaš teme $T(-1, 2)$ in točko $(0, 1)$. Teme da $f(x) = a(x + 1)^2 + 2$. Iz $f(0) = a + 2 = 1$ sledi $a = -1$.« -/
theorem preveri1 (a : ℝ) : (a * (0 + 1) ^ 2 + 2 = 1 ↔ a = -1) ∧ ((0 : ℝ) + 1) ^ 2 + 2 = 3 ∧
    -((-1 : ℝ) - 1) ^ 2 + 2 ≠ 2 ∧ -((-1 : ℝ) + 1) ^ 2 + 1 ≠ 2 := by
  refine ⟨by constructor <;> intro h <;> linarith, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 2: največje vrednosti: g(x) = −(x − 1)² + 7 ima 7, k(x) = −2x² + 8 ima 8,
f(x) = −x² + 4x + 5 ima pri p = 2 vrednost f(2) = −4 + 8 + 5 = 9; vrstni red g, k, f.
trditev: MAT-SS-2/kvadratna-funkcija#preveri2
besedilo: »Največja vrednost je $q$. Pri $g$ je $q = 7$, pri $k$ je $q = 8$, pri $f$ je $p = 2$ in $q = f(2) = -4 + 8 + 5 = 9$. Prosti člen $5$ pri $f$ je le vrednost pri $x = 0$, vodilni koeficient $-2$ pri $k$ pa parabolo zoži, ne zniža.« -/
theorem preveri2 : ((∀ x : ℝ, -(x - 1) ^ 2 + 7 ≤ 7) ∧ -((1 : ℝ) - 1) ^ 2 + 7 = 7) ∧
    ((∀ x : ℝ, -2 * x ^ 2 + 8 ≤ 8) ∧ -2 * (0 : ℝ) ^ 2 + 8 = 8) ∧
    ((∀ x : ℝ, -x ^ 2 + 4 * x + 5 ≤ 9) ∧ -(4 : ℝ) / (2 * (-1)) = 2 ∧
      (-(2 : ℝ) ^ 2 + 4 * 2 + 5 = -4 + 8 + 5 ∧ (-4 : ℝ) + 8 + 5 = 9)) ∧ (7 : ℝ) < 8 ∧ (8 : ℝ) < 9 := by
  refine ⟨⟨fun x => by nlinarith [sq_nonneg (x - 1)], by norm_num⟩,
    ⟨fun x => by nlinarith [sq_nonneg x], by norm_num⟩,
    ⟨fun x => by nlinarith [sq_nonneg (x - 2)], by norm_num, by norm_num⟩, by norm_num, by norm_num⟩

/-- Preveri se 3: 2(x − 3)² − 18 = 0 ⇔ x = 0 ali x = 6; f(3) = −18 (teme), f(0) = 2·9 − 18 = 0.
trditev: MAT-SS-2/kvadratna-funkcija#preveri3
besedilo: »Iz $(x - 3)^2 = 9$ sledi $x - 3 = \pm 3$, torej $x_1 = 0$ in $x_2 = 6$. Kontrola: $f(0) = 2 \cdot 9 - 18 = 0$.« -/
theorem preveri3 (x : ℝ) : (2 * (x - 3) ^ 2 - 18 = 0 ↔ x = 0 ∨ x = 6) ∧ 2 * ((3 : ℝ) - 3) ^ 2 - 18 = -18 ∧
    2 * ((0 : ℝ) - 3) ^ 2 - 18 = 2 * 9 - 18 ∧ (2 : ℝ) * 9 - 18 = 0 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  calc 2 * (x - 3) ^ 2 - 18 = 0 ↔ (x - 3) ^ 2 = 3 ^ 2 := by constructor <;> intro h <;> linarith
    _ ↔ x = 3 + 3 ∨ x = 3 - 3 := kvadrat_iff x 3 3
    _ ↔ x = 0 ∨ x = 6 := by norm_num [or_comm]

/-- Preveri se 4: parabola z ničlama −2 in 4: a(x + 2)(x − 4) = a(x − 1)² − 9a, p = (−2 + 4)/2 = 1.
trditev: MAT-SS-2/kvadratna-funkcija#preveri4
besedilo: »Ničli ležita simetrično glede na os, zato je $p = \dfrac{x_1 + x_2}{2} = \dfrac{-2 + 4}{2} = 1$.« -/
theorem preveri4 (a x : ℝ) : a * (x + 2) * (x - 4) = a * (x - 1) ^ 2 + -9 * a ∧ ((-2 : ℝ) + 4) / 2 = 1 :=
  ⟨by ring, by norm_num⟩

/-- Preveri se 5: −x² − 6x + 7: p = −(−6)/(2·(−1)) = −3, q = f(−3) = −9 + 18 + 7 = 16 (največja vrednost).
trditev: MAT-SS-2/kvadratna-funkcija#preveri5
besedilo: »$p = -\dfrac{-6}{2 \cdot (-1)} = -3$ in $q = f(-3) = -9 + 18 + 7 = 16$.« -/
theorem preveri5 : -(-6 : ℝ) / (2 * (-1)) = -3 ∧ (-(-3 : ℝ) ^ 2 - 6 * (-3) + 7 = -9 + 18 + 7 ∧
    (-9 : ℝ) + 18 + 7 = 16) ∧ ∀ x : ℝ, -x ^ 2 - 6 * x + 7 ≤ 16 := by
  refine ⟨by norm_num, by norm_num, fun x => by nlinarith [sq_nonneg (x + 3)]⟩

/-- Preveri se 6: 2(x + 1)(x − 5): p = (−1 + 5)/2 = 2, najmanjša vrednost f(2) = 2·3·(−3) = −18.
trditev: MAT-SS-2/kvadratna-funkcija#preveri6
besedilo: »Ničli sta $-1$ in $5$, zato je $p = \dfrac{-1 + 5}{2} = 2$. Ker je $a = 2 > 0$, je najmanjša vrednost $q = f(2) = 2 \cdot 3 \cdot (-3) = -18$.« -/
theorem preveri6 : ((-1 : ℝ) + 5) / 2 = 2 ∧ (2 * ((2 : ℝ) + 1) * (2 - 5) = 2 * 3 * (-3) ∧
    (2 : ℝ) * 3 * (-3) = -18) ∧ ∀ x : ℝ, -18 ≤ 2 * (x + 1) * (x - 5) := by
  refine ⟨by norm_num, by norm_num, fun x => by nlinarith [sq_nonneg (x - 2)]⟩

/-- Preveri se 7: g(x) = −(x − 1)² − 4 ima teme (1, −4), g(x) ≤ −4 < 0, zato nima realnih ničel.
trditev: MAT-SS-2/kvadratna-funkcija#preveri7
besedilo: »Funkcija $f(x) = (x - 1)^2 - 4$ ima teme $T(1, -4)$ in ničli $-1$ in $3$.« -/
theorem preveri7 : (∀ x : ℝ, -(x - 1) ^ 2 - 4 ≤ -4) ∧ -((1 : ℝ) - 1) ^ 2 - 4 = -4 ∧
    ∀ x : ℝ, -(x - 1) ^ 2 - 4 ≠ 0 := by
  refine ⟨fun x => by nlinarith [sq_nonneg (x - 1)], by norm_num,
    fun x => by nlinarith [sq_nonneg (x - 1)]⟩

/-- Preveri se 8: parabola skozi (0, 1), (1, 2), (−1, 6): c = 1, a + b = 1, a − b = 5, 2a = 6, a = 3,
b = −2 (enolično).
trditev: MAT-SS-2/kvadratna-funkcija#preveri8
besedilo: »$c = 1$, $a + b = 1$ in $a - b = 5$; seštejemo: $2a = 6$, $a = 3$, $b = -2$.« -/
theorem preveri8 (a b c : ℝ) :
    (a * 0 ^ 2 + b * 0 + c = 1 ∧ a * 1 ^ 2 + b * 1 + c = 2 ∧ a * (-1) ^ 2 + b * (-1) + c = 6) ↔
      (a = 3 ∧ b = -2 ∧ c = 1) := by
  constructor
  · rintro ⟨h0, h1, h2⟩
    have e1 : a + b = 1 := by linarith
    have e2 : a - b = 5 := by linarith
    have e3 : 2 * a = 6 := by linarith
    exact ⟨by linarith, by linarith, by linarith⟩
  · rintro ⟨rfl, rfl, rfl⟩; norm_num

end Evklid.Lekcije.MAT_SS_2.KvadratnaFunkcija
