/-
vir: content/lessons/MAT-SS-2/transformacije-grafov.md
sha256: 90931abc94e276318075dcfd2b5c881e1ebde7018009e3389d07a3fbe2d226f2
Ni v Leanu: zgodba o senzorju (meritve, Freckmann in sod. 2007; dokazan je le model m, s, n in pretvorba
132 mg/dL ≈ 7,3 mmol/L z deliteljem 18,016 iz bloka RACUN), risbe, drsniki in simulacija (opis; dokazane so
trditve, ki jih opisujejo: lega temena, točke (1, a), presečišče √(kx) = 2 pri x = 4/k), »Kot zgodba«
(odrski delavci), Postopek in Pazi na (navodila), opisi »strmejši / položnejši / ožja / širša« kot
geometrijski pojem (dokazano je, da se vrednosti pomnožijo z a in da je |a·y| ≥ |y| za |a| ≥ 1 oz. ≤ za
|a| ≤ 1; vrstni red parabol v Preveri se 1 je dokazan kot vrstni red faktorjev 4 > 3 > 1 > 1/2), točkovanje.
Graf funkcije je množica `graf f = {(x, y) | y = f x}`. Lean definira √x tudi za x < 0 (√x = 0), zato je
definicijsko območje korena zapisano kot pogoj x + 4 ≥ 0 oz. x ≤ 0 in zaloga vrednosti kot slika tega območja.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.TransformacijeGrafov

open Real Set

/-- Graf funkcije f: množica točk (x, f(x)). -/
def graf (f : ℝ → ℝ) : Set (ℝ × ℝ) := {P | P.2 = f P.1}

/-! ## Razlaga -/

/-- Razlaga, tabela: vrednosti x², x² + 2 in (x − 2)² za x = −1, 0, 1, 2, 3, 4.
trditev: MAT-SS-2/transformacije-grafov#tabela
besedilo: »| $-1$ | $1$ | $3$ | $9$ | | $0$ | $0$ | $2$ | $4$ | | $1$ | $1$ | $3$ | $1$ | | $2$ | $4$ | $6$ | $0$ | | $3$ | $9$ | $11$ | $1$ | | $4$ | $16$ | $18$ | $4$ |« -/
theorem tabela :
    ((-1:ℝ) ^ 2 = 1 ∧ (-1:ℝ) ^ 2 + 2 = 3 ∧ ((-1:ℝ) - 2) ^ 2 = 9) ∧
    ((0:ℝ) ^ 2 = 0 ∧ (0:ℝ) ^ 2 + 2 = 2 ∧ ((0:ℝ) - 2) ^ 2 = 4) ∧
    ((1:ℝ) ^ 2 = 1 ∧ (1:ℝ) ^ 2 + 2 = 3 ∧ ((1:ℝ) - 2) ^ 2 = 1) ∧
    ((2:ℝ) ^ 2 = 4 ∧ (2:ℝ) ^ 2 + 2 = 6 ∧ ((2:ℝ) - 2) ^ 2 = 0) ∧
    ((3:ℝ) ^ 2 = 9 ∧ (3:ℝ) ^ 2 + 2 = 11 ∧ ((3:ℝ) - 2) ^ 2 = 1) ∧
    ((4:ℝ) ^ 2 = 16 ∧ (4:ℝ) ^ 2 + 2 = 18 ∧ ((4:ℝ) - 2) ^ 2 = 4) := by
  norm_num

/-- Razlaga (tabela in slika): teme x² + 2 je (0, 2), teme (x − 2)² je (2, 0): najmanjša vrednost 2 oz. 0 je
dosežena natanko pri x = 0 oz. x = 2 (premik v desno, čeprav smo 2 odšteli).
trditev: MAT-SS-2/transformacije-grafov#temeni
besedilo: »Graf se dvigne za $2$, teme parabole (njena najnižja točka) gre iz $(0, 0)$ v $(0, 2)$. V četrtem stolpcu so ista števila $0, 1, 4$ kot pri $x^2$, le dve vrstici niže: najmanjša vrednost $0$ je zdaj pri $x = 2$.« -/
theorem temeni :
    (∀ x : ℝ, 2 ≤ x ^ 2 + 2 ∧ (x ^ 2 + 2 = 2 ↔ x = 0)) ∧
    (∀ x : ℝ, 0 ≤ (x - 2) ^ 2 ∧ ((x - 2) ^ 2 = 0 ↔ x = 2)) := by
  refine ⟨fun x => ⟨by nlinarith [sq_nonneg x], ?_⟩, fun x => ⟨sq_nonneg _, ?_⟩⟩
  · constructor
    · intro h; exact pow_eq_zero_iff (n := 2) (by norm_num) |>.mp (by linarith)
    · rintro rfl; norm_num
  · constructor
    · intro h; have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h; linarith
    · rintro rfl; norm_num

/-- Zakaj se tega učimo: krivulja m(t) = −2(t − 1)² + 7, premaknjena za 2 uri v desno, ima vrh pri t = 3 (ob
10.00) in je pri t = 4 (ob 11.00) spet 5; sobotna vrednost ob 10.00 (t = 3) je enaka običajni ob 8.00 (t = 1).
trditev: MAT-SS-2/transformacije-grafov#uvod
besedilo: »Krivulja je ista, samo **premaknjena** za $2$ uri v desno: vrh bo ob 10.00, ob 11.00 bo sladkor spet pri $5$.« -/
theorem uvod :
    (∀ t : ℝ, -2 * ((t - 2) - 1) ^ 2 + 7 ≤ 7 ∧ (-2 * ((t - 2) - 1) ^ 2 + 7 = 7 ↔ t = 3)) ∧
    -2 * (((4:ℝ) - 2) - 1) ^ 2 + 7 = 5 ∧ -2 * (((3:ℝ) - 2) - 1) ^ 2 + 7 = -2 * ((1:ℝ) - 1) ^ 2 + 7 := by
  refine ⟨fun t => ⟨by nlinarith [sq_nonneg (t - 2 - 1)], ⟨fun h => ?_, by rintro rfl; norm_num⟩⟩, by norm_num,
    by norm_num⟩
  have h2 : (t - 2 - 1) ^ 2 = 0 := by linarith
  have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h2; linarith

/-- Razlaga, splošno pravilo »Vse skupaj« (in Povzetek, Ustno vprašanje 1): graf g(x) = a·f(x − p) + q je
slika grafa f pri preslikavi (x, y) ↦ (x + p, a·y + q). Velja za vse a, p, q.
trditev: MAT-SS-2/transformacije-grafov#vse-skupaj
besedilo: »Točka $(x, y)$ grafa $f$ preide v $(x + p,\ ay + q)$.« -/
theorem vse_skupaj (f : ℝ → ℝ) (a p q : ℝ) :
    graf (fun x => a * f (x - p) + q) = (fun P : ℝ × ℝ => (P.1 + p, a * P.2 + q)) '' graf f := by
  ext ⟨x, y⟩
  simp only [graf, mem_ofPred_eq, mem_image, Prod.exists, Prod.mk.injEq]
  constructor
  · intro h
    exact ⟨x - p, f (x - p), rfl, by ring, h.symm⟩
  · rintro ⟨u, v, hv, hx, hy⟩
    subst hx hy hv
    simp

/-- Razlaga »Vzporedni premik« in seznam preslikav: f(x) + q da (x, y) ↦ (x, y + q), f(x − p) da
(x, y) ↦ (x + p, y).
trditev: MAT-SS-2/transformacije-grafov#premika
besedilo: »$f(x) + q$: $(x, y) \to (x,\ y + q)$, premik navpično; - $f(x - p)$: $(x, y) \to (x + p,\ y)$, premik vodoravno;« -/
theorem premika (f : ℝ → ℝ) (p q : ℝ) :
    graf (fun x => f x + q) = (fun P : ℝ × ℝ => (P.1, P.2 + q)) '' graf f ∧
    graf (fun x => f (x - p)) = (fun P : ℝ × ℝ => (P.1 + p, P.2)) '' graf f := by
  constructor
  · have := vse_skupaj f 1 0 q
    simp only [sub_zero, one_mul, add_zero] at this
    exact this
  · have := vse_skupaj f 1 p 0
    simp only [one_mul, add_zero] at this
    exact this

/-- Razlaga »Zrcaljenje« in seznam preslikav: −f(x) da (x, y) ↦ (x, −y), f(−x) da (x, y) ↦ (−x, y),
a·f(x) da (x, y) ↦ (x, a·y).
trditev: MAT-SS-2/transformacije-grafov#zrcaljenji-razteg
besedilo: »$-f(x)$: $(x, y) \to (x,\ -y)$, zrcaljenje čez os $x$; - $f(-x)$: $(x, y) \to (-x,\ y)$, zrcaljenje čez os $y$; - $a \cdot f(x)$: $(x, y) \to (x,\ ay)$, razteg navpično;« -/
theorem zrcaljenji_razteg (f : ℝ → ℝ) (a : ℝ) :
    graf (fun x => -f x) = (fun P : ℝ × ℝ => (P.1, -P.2)) '' graf f ∧
    graf (fun x => f (-x)) = (fun P : ℝ × ℝ => (-P.1, P.2)) '' graf f ∧
    graf (fun x => a * f x) = (fun P : ℝ × ℝ => (P.1, a * P.2)) '' graf f := by
  refine ⟨?_, ?_, ?_⟩
  · have := vse_skupaj f (-1) 0 0
    simp only [sub_zero, add_zero, neg_one_mul] at this
    exact this
  · ext ⟨x, y⟩
    simp only [graf, mem_ofPred_eq, mem_image, Prod.exists, Prod.mk.injEq]
    constructor
    · intro h; exact ⟨-x, y, h, neg_neg x, rfl⟩
    · rintro ⟨u, v, hv, hx, hy⟩; subst hx hy hv; simp
  · have := vse_skupaj f a 0 0
    simp only [sub_zero, add_zero] at this
    exact this

/-- Razlaga »Raztezanje v smeri osi x« in seznam preslikav: za k ≠ 0 (v lekciji k > 0) f(kx) da
(x, y) ↦ (x/k, y).
trditev: MAT-SS-2/transformacije-grafov#skrcitev
besedilo: »$f(kx)$: $(x, y) \to \left(\frac{x}{k},\ y\right)$, skrčitev vodoravno.« -/
theorem skrcitev (f : ℝ → ℝ) (k : ℝ) (hk : k ≠ 0) :
    graf (fun x => f (k * x)) = (fun P : ℝ × ℝ => (P.1 / k, P.2)) '' graf f := by
  ext ⟨x, y⟩
  simp only [graf, mem_ofPred_eq, mem_image, Prod.exists, Prod.mk.injEq]
  constructor
  · intro h; exact ⟨k * x, y, h, by field_simp, rfl⟩
  · rintro ⟨u, v, hv, hx, hy⟩
    subst hx hy hv
    congr 1; field_simp

/-- Predpostavka izreka `skrcitev` se da izpolniti (k = 2). -/
example : (2:ℝ) ≠ 0 := by norm_num

/-- Predpostavke trditve `skrcitev` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (2:ℝ) ≠ 0 := by norm_num
  skrcitev (hk := w)

/-- Razlaga »Zakaj v desno?«: (x − 2)² pri x = 3 da 1² = 1, isto kot x² pri x = 1; pri p = 2 je g(x) = f(x − 2)
pri x enak f pri x − 2.
trditev: MAT-SS-2/transformacije-grafov#zakaj-desno
besedilo: »Funkcija $g$ pri $x$ izračuna to, kar je $f$ izračunala pri $x - p$, torej $p$ enot bolj levo. Vsaka vrednost grafa $f$ se zato pri $g$ pojavi $p$ enot bolj desno. S števili iz tabele, kjer je $p = 2$: pri $x = 3$ funkcija $(x - 2)^2$ izračuna $1^2 = 1$, torej isto kot $x^2$ pri $x = 1$.« -/
theorem zakaj_desno : ((3:ℝ) - 2) ^ 2 = 1 ^ 2 ∧ (1:ℝ) ^ 2 = 1 ∧
    ∀ (f : ℝ → ℝ) (x : ℝ), (fun t => f (t - 2)) x = f (x - 2) :=
  ⟨by norm_num, by norm_num, fun _ _ => rfl⟩

/-- Razlaga, slika z drsnikoma in Povzetek: za a > 0 ima a(x − p)² + q najmanjšo vrednost q natanko pri
x = p (teme (p, q)); pri p = 0, q = 0 je (x + 0)² + 0 = x².
trditev: MAT-SS-2/transformacije-grafov#teme-parabole
besedilo: »$g(x) = a(x - p)^2 + q$, teme je v $(p, q)$« -/
theorem teme_parabole (a p q : ℝ) (ha : 0 < a) :
    (∀ x, q ≤ a * (x - p) ^ 2 + q) ∧ (∀ x, a * (x - p) ^ 2 + q = q ↔ x = p) ∧
    (∀ x : ℝ, (x + 0) ^ 2 + 0 = x ^ 2) := by
  refine ⟨fun x => by nlinarith [sq_nonneg (x - p)], fun x => ⟨fun h => ?_, by rintro rfl; ring⟩,
    fun x => by ring⟩
  have h2 : a * (x - p) ^ 2 = 0 := by linarith
  rcases mul_eq_zero.mp h2 with h3 | h3
  · linarith
  · have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h3; linarith

/-- Predpostavka izreka `teme_parabole` se da izpolniti (a = 1). -/
example : (0:ℝ) < 1 := one_pos

/-- Predpostavke trditve `teme_parabole` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0:ℝ) < 1 := one_pos
  teme_parabole (ha := w)

/-- Razlaga, Premisli 1: (x + 3)² − 1 = (x − (−3))² + (−1), teme (−3, −1) (p = −3: 3 v levo, 1 navzdol);
preizkus pri x = −3: 0² − 1 = −1.
trditev: MAT-SS-2/transformacije-grafov#premisli1
besedilo: »V $(-3, -1)$. Ker je $x + 3 = x - (-3)$, je $p = -3$, premik za $3$ v levo, nato $1$ navzdol. Preizkus: pri $x = -3$ je $0^2 - 1 = -1$.« -/
theorem premisli1 :
    (∀ x : ℝ, (x + 3) ^ 2 - 1 = 1 * (x - (-3)) ^ 2 + (-1)) ∧ (∀ x : ℝ, -1 ≤ (x + 3) ^ 2 - 1) ∧
    (∀ x : ℝ, (x + 3) ^ 2 - 1 = -1 ↔ x = -3) ∧ ((-3:ℝ) + 3) ^ 2 - 1 = -1 := by
  obtain ⟨h1, h2, _⟩ := teme_parabole 1 (-3) (-1) one_pos
  refine ⟨fun x => by ring, fun x => ?_, fun x => ?_, by norm_num⟩
  · have := h1 x; linarith [show (x + 3) ^ 2 - 1 = 1 * (x - (-3)) ^ 2 + (-1) by ring]
  · rw [show (x + 3) ^ 2 - 1 = 1 * (x - (-3)) ^ 2 + (-1) by ring]; exact h2 x

/-- Razlaga, zrcaljenje (slika): točka (4, 2) leži na √x; minus zunaj jo pošlje v (4, −2) na −√x, minus
znotraj v (−4, 2) na √(−x); √(−x) je (realno) definiran natanko za x ≤ 0.
trditev: MAT-SS-2/transformacije-grafov#zrcaljenje-korena
besedilo: »Graf $\sqrt{x}$ leži desno od osi $y$, graf $\sqrt{-x}$ pa levo, saj je definiran za $x \le 0$. Na sliki sledi točki $(4, 2)$ grafa $\sqrt{x}$: minus zunaj jo pošlje v $(4, -2)$, minus znotraj v $(-4, 2)$.« -/
theorem zrcaljenje_korena : √(4:ℝ) = 2 ∧ -√(4:ℝ) = -2 ∧ √(-(-4):ℝ) = 2 ∧ ∀ x : ℝ, 0 ≤ -x ↔ x ≤ 0 := by
  have h : √(4:ℝ) = 2 := by
    rw [show (4:ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨h, by rw [h], by rw [neg_neg, h], fun x => neg_nonneg⟩

/-- Razlaga »Raztezanje v smeri osi y« (slika z drsnikom a): točka (1, 1) grafa |x| preide v (1, a), pri a = 2
v (1, 2); konica (0, 0) miruje (a·0 = 0); pri a = 1 se grafa pokrijeta, pri a = 0 je graf os x; za |a| ≥ 1 je
|a·y| ≥ |y| (stran od osi x), za |a| ≤ 1 je |a·y| ≤ |y| (proti osi x); pri a < 0 je a·y = −(|a|·y) (razteg s faktorjem |a| in zrcaljenje čez
os x).
trditev: MAT-SS-2/transformacije-grafov#razteg-y
besedilo: »točka $(x, y)$ preide v $(x, ay)$. Pri $a > 1$ se graf raztegne stran od osi $x$ in postane strmejši; pri $0 < a < 1$ se skrči proti osi $x$. Pri negativnem $a$ se graf raztegne ali skrči s faktorjem $|a|$ in še zrcali čez os $x$. Spodnja slika kaže $y = a \cdot |x|$ pri $a = 2$: točka $(1, 1)$ osnovnega grafa se dvigne v $(1, 2)$. V aplikaciji povleci drsnik $a$ od $2$ proti $0$ in naprej do $-3$. Opazi tri stvari: točka ostane na navpičnici $x = 1$, pri $a$ med $0$ in $1$ je graf položnejši od osnovnega, pri negativnem $a$ pa se »V« obrne navzdol. Vmes sta dva mejna primera: pri $a = 1$ se grafa pokrijeta, pri $a = 0$ se graf splošči v os $x$, ker so vse vrednosti $0$. Konica v $(0, 0)$ ves čas miruje, ker je $a \cdot 0 = 0$.« -/
theorem razteg_y (a : ℝ) :
    a * |(1:ℝ)| = a ∧ 2 * |(1:ℝ)| = 2 ∧ a * |(0:ℝ)| = 0 ∧ (∀ x : ℝ, 1 * |x| = |x|) ∧
    (∀ x : ℝ, 0 * |x| = 0) ∧ (1 ≤ |a| → ∀ y : ℝ, |y| ≤ |a * y|) ∧ (|a| ≤ 1 → ∀ y : ℝ, |a * y| ≤ |y|) ∧
    (a < 0 → ∀ y : ℝ, a * y = -(|a| * y)) := by
  refine ⟨by simp, by simp, by simp, fun x => one_mul _, fun x => zero_mul _, fun h y => ?_, fun h y => ?_,
    fun h y => by rw [abs_of_neg h]; ring⟩
  · rw [abs_mul]; nlinarith [abs_nonneg y]
  · rw [abs_mul]; nlinarith [abs_nonneg y]

/-- Razlaga »Raztezanje v smeri osi x«: x² doseže 4 pri x = 2, (2x)² že pri x = 1; (2x)² = 4x². Slika s
√(kx): za k > 0 in x ≥ 0 je √(kx) = 2 natanko pri x = 4/k; √(2·2) = 2; pri k = 4 je 4/k = 1, pri k = 0,5 je 8.
trditev: MAT-SS-2/transformacije-grafov#razteg-x
besedilo: »Preizkus: $x^2$ doseže $4$ pri $x = 2$, $(2x)^2$ pa že pri $x = 1$. Pri paraboli je $(2x)^2 = 4x^2$: vodoravna skrčitev s faktorjem $2$ da isti graf kot navpični razteg s faktorjem $4$. Na spodnji sliki je $y = \sqrt{kx}$ pri $k = 2$ ob črtkanem $\sqrt{x}$. Osnovni graf doseže vrednost $2$ pri $x = 4$, novi že pri $x = 2$, ker je $\sqrt{2 \cdot 2} = 2$. V aplikaciji premikaj drsnik $k$ in opazuj, kje graf seka črto $y = 2$: vedno pri $x = \frac{4}{k}$. Pri $k = 4$ je to $x = 1$, pri $k = 0{,}5$ šele $x = 8$.« -/
theorem razteg_x :
    (2:ℝ) ^ 2 = 4 ∧ (2 * 1 : ℝ) ^ 2 = 4 ∧ (∀ x : ℝ, (2 * x) ^ 2 = 4 * x ^ 2) ∧
    (∀ k x : ℝ, 0 < k → 0 ≤ x → (√(k * x) = 2 ↔ x = 4 / k)) ∧ √(2 * 2 : ℝ) = 2 ∧
    (4:ℝ) / 4 = 1 ∧ (4:ℝ) / 0.5 = 8 := by
  refine ⟨by norm_num, by norm_num, fun x => by ring, fun k x hk hx => ?_, ?_, by norm_num, by norm_num⟩
  · rw [Real.sqrt_eq_iff_mul_self_eq (by positivity) (by norm_num)]
    constructor
    · intro h; field_simp; linarith
    · intro h; rw [h]; field_simp; norm_num
  · rw [show (2 * 2 : ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Predpostavke četrtega dela `razteg_x` se dajo izpolniti (k = 2, x = 2). -/
example : (0:ℝ) < 2 ∧ (0:ℝ) ≤ 2 := by norm_num

/-- Razlaga »Več korakov hkrati«: vrstni red je pomemben; (1, 1) grafa x² gre pri »krat 2, nato plus 1« v
(1, 3), pri »plus 1, nato krat 2« v (1, 4); √(2 − x) = √(−(x − 2)), vrednost pri x = 2 je 0, pri x = −2 je 2;
koren je definiran za 2 − x ≥ 0, torej x ≤ 2 (graf gre od (2, 0) v levo).
trditev: MAT-SS-2/transformacije-grafov#vrstni-red
besedilo: »Točka $(1, 1)$ grafa $x^2$ gre pri »najprej krat $2$, nato plus $1$« v $(1, 3)$, pri »najprej plus $1$, nato krat $2$« pa v $(1, 4)$. Predpis $a \cdot f(x) + q$ pomeni prvo. Kadar je v korenu ali oklepaju minus pred $x$, ga najprej izpostavi: $\sqrt{2 - x}$ zapiši kot $\sqrt{-(x - 2)}$. To je graf $\sqrt{-x}$, premaknjen za $2$ v desno, ne v levo. Preizkus: pri $x = 2$ je vrednost $0$, pri $x = -2$ pa $\sqrt{4} = 2$; graf se začne v $(2, 0)$ in gre v levo.« -/
theorem vrstni_red :
    2 * (1:ℝ) ^ 2 + 1 = 3 ∧ 2 * ((1:ℝ) ^ 2 + 1) = 4 ∧ (∀ x : ℝ, √(2 - x) = √(-(x - 2))) ∧
    √(2 - 2 : ℝ) = 0 ∧ √(2 - (-2) : ℝ) = 2 ∧ (∀ x : ℝ, 0 ≤ 2 - x ↔ x ≤ 2) := by
  refine ⟨by norm_num, by norm_num, fun x => by ring_nf, by norm_num, ?_,
    fun x => ⟨fun h => by linarith, fun h => by linarith⟩⟩
  rw [show (2 - (-2) : ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]

/-- Razlaga, Premisli 2, Povzetek in Ustno vprašanje 2: |x| je soda (|−x| = |x|), zato se graf pri zrcaljenju
čez os y ne spremeni; x³ je liha, (−x)³ = −x³, zato zrcaljenje čez os y da isto kot čez os x; tudi x² je soda.
trditev: MAT-SS-2/transformacije-grafov#soda-liha
besedilo: »Graf $|x|$ se ne spremeni, ker je $|x|$ soda funkcija: $|-x| = |x|$, graf je že simetričen glede na os $y$. Pri $x^3$ dobiš $(-x)^3 = -x^3$: ker je $x^3$ liha, zrcaljenje čez os $y$ da isti graf kot zrcaljenje čez os $x$.« -/
theorem soda_liha :
    (∀ x : ℝ, |-x| = |x|) ∧ (∀ x : ℝ, (-x) ^ 3 = -x ^ 3) ∧ (∀ x : ℝ, (-x) ^ 2 = x ^ 2) ∧
    graf (fun x => |(-x)|) = graf (fun x => |x|) ∧
    graf (fun x => (-x) ^ 3) = graf (fun x => -x ^ 3) := by
  refine ⟨abs_neg, fun x => by ring, fun x => by ring, ?_, ?_⟩
  · simp only [abs_neg]
  · congr 1; funext x; ring

/-! ## Rešeni primeri -/

/-- Primer 1: g(x) = (x − 3)² + 1 je f(x − 3) + 1 za f(x) = x² (p = 3, q = 1); teme (0, 0) preide v (3, 1),
ki je najnižja točka; (1, 1), (−1, 1), (2, 4) preidejo v (4, 2), (2, 2), (5, 5); g(4) = 1² + 1 = 2,
g(5) = 2² + 1 = 5.
trditev: MAT-SS-2/transformacije-grafov#primer1
besedilo: »Primerjamo z $f(x - p) + q$: $p = 3$, $q = 1$. 2. Teme $(0, 0)$ preide v $(0 + 3,\ 0 + 1) = (3, 1)$. 3. Točki $(1, 1)$ in $(-1, 1)$ grafa $f$ preideta v $(4, 2)$ in $(2, 2)$. Preizkus: $g(4) = 1^2 + 1 = 2$. 4. Točka $(2, 4)$ preide v $(5, 5)$; $g(5) = 2^2 + 1 = 5$.« -/
theorem primer1 :
    (∀ x : ℝ, (x - 3) ^ 2 + 1 = 1 * (x - 3) ^ 2 + 1) ∧ ((0:ℝ) + 3, (0:ℝ) + 1) = (3, 1) ∧
    (∀ x : ℝ, 1 ≤ (x - 3) ^ 2 + 1 ∧ ((x - 3) ^ 2 + 1 = 1 ↔ x = 3)) ∧
    ((1:ℝ) + 3, (1:ℝ) + 1) = (4, 2) ∧ ((-1:ℝ) + 3, (1:ℝ) + 1) = (2, 2) ∧ ((2:ℝ) + 3, (4:ℝ) + 1) = (5, 5) ∧
    ((4:ℝ) - 3) ^ 2 + 1 = 1 ^ 2 + 1 ∧ (1:ℝ) ^ 2 + 1 = 2 ∧ ((2:ℝ) - 3) ^ 2 + 1 = 2 ∧
    ((5:ℝ) - 3) ^ 2 + 1 = 2 ^ 2 + 1 ∧ (2:ℝ) ^ 2 + 1 = 5 := by
  obtain ⟨h1, h2, _⟩ := teme_parabole 1 3 1 one_pos
  refine ⟨fun x => by ring, by norm_num, fun x => ⟨by linarith [h1 x], ?_⟩, by norm_num, by norm_num,
    by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  rw [show (x - 3) ^ 2 + 1 = 1 * (x - 3) ^ 2 + 1 by ring]; exact h2 x

/-- Primer 2: g(x) = −2|x| + 4 (a = −2, q = 4): (1, 1) → (1, 2) → (1, −2) → (1, 2), g(1) = −2 + 4 = 2;
ničli: −2|x| + 4 = 0 ⟺ |x| = 2 ⟺ x = −2 ali x = 2; vrh (0, 4) je najvišja točka in Z_g = (−∞, 4].
trditev: MAT-SS-2/transformacije-grafov#primer2
besedilo: »Primerjamo s pravilom: $a = -2$, $q = 4$. Faktor $2$ raztegne graf v smeri osi $y$: krak skozi $(1, 1)$ gre zdaj skozi $(1, 2)$, graf je strmejši. 2. Minus zrcali graf čez os $x$: »V« se obrne v »Λ«, točka $(1, 2)$ preide v $(1, -2)$. 3. Prištevanje $4$ dvigne vse za $4$: konica $(0, 0)$ gre v $(0, 4)$, točka $(1, -2)$ v $(1, 2)$. Preizkus: $g(1) = -2 + 4 = 2$. 4. Ničle iz $-2|x| + 4 = 0$: $|x| = 2$, torej $x = -2$ ali $x = 2$. 5. Po zrcaljenju je vrh najvišja točka, zato $Z_g = (-\infty, 4]$.« -/
theorem primer2 :
    (2 * (1:ℝ) = 2 ∧ -(2:ℝ) = -2 ∧ -(2:ℝ) + 4 = 2) ∧ -2 * |(1:ℝ)| + 4 = -2 + 4 ∧ (-2:ℝ) + 4 = 2 ∧
    (∀ x : ℝ, (-2 * |x| + 4 = 0 ↔ |x| = 2) ∧ (|x| = 2 ↔ x = -2 ∨ x = 2)) ∧
    -2 * |(0:ℝ)| + 4 = 4 ∧ (∀ x : ℝ, -2 * |x| + 4 ≤ 4) ∧ range (fun x : ℝ => -2 * |x| + 4) = Iic 4 := by
  refine ⟨by norm_num, by norm_num, by norm_num, fun x => ⟨⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    ?_⟩, by norm_num, fun x => by linarith [abs_nonneg x], ?_⟩
  · rw [abs_eq (by norm_num)]; tauto
  · ext y
    simp only [mem_range, mem_Iic]
    constructor
    · rintro ⟨x, rfl⟩; linarith [abs_nonneg x]
    · intro hy
      refine ⟨(4 - y) / 2, ?_⟩
      rw [abs_of_nonneg (by linarith)]; ring

/-- Primer 3, model: m(t) = −2(t − 1)² + 7 da m(0) = 5, m(1) = 7, m(2) = 5 (s 5 na 7 in nazaj na 5).
trditev: MAT-SS-2/transformacije-grafov#primer3-model
besedilo: »s $5\,\mathrm{mmol/L}$ se v eni uri dvigne na $7\,\mathrm{mmol/L}$ in se v naslednji uri vrne na $5$« -/
theorem primer3_model :
    -2 * ((0:ℝ) - 1) ^ 2 + 7 = 5 ∧ -2 * ((1:ℝ) - 1) ^ 2 + 7 = 7 ∧ -2 * ((2:ℝ) - 1) ^ 2 + 7 = 5 := by
  norm_num

/-- Primer 3, koraka 1–4: s(t) = m(t − 2) + 0,5 = −2(t − 3)² + 7,5 (ker je t − 2 − 1 = t − 3); vrh (1, 7) preide
v (1 + 2; 7 + 0,5) = (3; 7,5), na [2, 4] je največja vrednost 7,5 natanko pri t = 3; s(2) = −2·1 + 7,5 = 5,5 =
m(0) + 0,5.
trditev: MAT-SS-2/transformacije-grafov#primer3-s
besedilo: »Zajtrk je $2\,\mathrm{h}$ kasneje, zato graf $m$ premaknemo za $2$ v desno. Vsak $t$ zamenjamo s $t - 2$: $m(t - 2) = -2(t - 3)^2 + 7$, ker je $t - 2 - 1 = t - 3$. 2. Senzor kaže $0{,}5$ preveč, zato graf dvignemo za $0{,}5$: $s(t) = -2(t - 3)^2 + 7{,}5$ za $2 \le t \le 4$. 3. Vrh $(1, 7)$ grafa $m$ preide v $(1 + 2;\ 7 + 0{,}5) = (3;\ 7{,}5)$. Senzor kaže največ ob 10.00, in sicer $7{,}5\,\mathrm{mmol/L}$. 4. Preizkus na začetku: $s(2) = -2 \cdot 1 + 7{,}5 = 5{,}5$, kar je $m(0) + 0{,}5 = 5 + 0{,}5$.« -/
theorem primer3_s :
    (∀ t : ℝ, (-2 * ((t - 2) - 1) ^ 2 + 7) + 0.5 = -2 * (t - 3) ^ 2 + 7.5) ∧
    ((1:ℝ) + 2, (7:ℝ) + 0.5) = (3, 7.5) ∧
    (∀ t : ℝ, -2 * (t - 3) ^ 2 + 7.5 ≤ 7.5 ∧ (-2 * (t - 3) ^ 2 + 7.5 = 7.5 ↔ t = 3)) ∧
    -2 * ((2:ℝ) - 3) ^ 2 + 7.5 = -2 * 1 + 7.5 ∧ -2 * (1:ℝ) + 7.5 = 5.5 ∧
    (-2 * ((0:ℝ) - 1) ^ 2 + 7) + 0.5 = 5 + 0.5 ∧ (5:ℝ) + 0.5 = 5.5 := by
  refine ⟨fun t => by ring, by norm_num, fun t => ⟨by nlinarith [sq_nonneg (t - 3)], ⟨fun h => ?_,
    by rintro rfl; norm_num⟩⟩, by norm_num, by norm_num, by norm_num, by norm_num⟩
  have h2 : (t - 3) ^ 2 = 0 := by linarith
  have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h2; linarith

/-- Primer 3, korak 5: −2(t − 3)² + 7,5 = 7 ⟺ (t − 3)² = 0,25 ⟺ t − 3 = ±0,5 ⟺ t = 2,5 ali t = 3,5, in
s(t) ≥ 7 natanko za 2,5 ≤ t ≤ 3,5 (od 9.30 do 10.30).
trditev: MAT-SS-2/transformacije-grafov#primer3-meja
besedilo: »Enačba $-2(t - 3)^2 + 7{,}5 = 7$ da $(t - 3)^2 = 0{,}25$, torej $t - 3 = \pm 0{,}5$ in $t = 2{,}5$ ali $t = 3{,}5$. Med tema časoma je parabola nad mejo, ker je obrnjena navzdol.« -/
theorem primer3_meja (t : ℝ) :
    (-2 * (t - 3) ^ 2 + 7.5 = 7 ↔ (t - 3) ^ 2 = 0.25) ∧ ((t - 3) ^ 2 = 0.25 ↔ t - 3 = 0.5 ∨ t - 3 = -0.5) ∧
    (t - 3 = 0.5 ∨ t - 3 = -0.5 ↔ t = 3.5 ∨ t = 2.5) ∧
    (7 ≤ -2 * (t - 3) ^ 2 + 7.5 ↔ 2.5 ≤ t ∧ t ≤ 3.5) := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ?_, ⟨?_, ?_⟩, ⟨fun h => ⟨?_, ?_⟩, fun ⟨h1, h2⟩ => ?_⟩⟩
  · rw [show (0.25 : ℝ) = 0.5 ^ 2 by norm_num, sq_eq_sq_iff_eq_or_eq_neg]
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · nlinarith [sq_nonneg (t - 3.5)]
  · nlinarith [sq_nonneg (t - 2.5)]
  · nlinarith

/-- Primer 3, korak 6: n(t) = m(t/2) (k = 1/2): (t, y) ↦ (2t, y), vrh (1, 7) gre v (2, 7); n(2) = m(1) = 7 je
največja vrednost, dosežena natanko pri t = 2.
trditev: MAT-SS-2/transformacije-grafov#primer3-n
besedilo: »Pri $n(t) = m\left(\frac{t}{2}\right)$ je $k = \frac{1}{2}$: točka $(t, y)$ preide v $(2t, y)$, graf se vodoravno raztegne na dvojno širino. Vrh $(1, 7)$ gre v $(2, 7)$. Preizkus: $n(2) = m(1) = 7$.« -/
theorem primer3_n :
    (fun t : ℝ => -2 * (t / 2 - 1) ^ 2 + 7) 2 = (fun t : ℝ => -2 * (t - 1) ^ 2 + 7) 1 ∧
    -2 * ((1:ℝ) - 1) ^ 2 + 7 = 7 ∧
    (∀ t : ℝ, -2 * (t / 2 - 1) ^ 2 + 7 ≤ 7 ∧ (-2 * (t / 2 - 1) ^ 2 + 7 = 7 ↔ t = 2)) ∧
    graf (fun t => (fun u : ℝ => -2 * (u - 1) ^ 2 + 7) ((1 / 2) * t)) =
      (fun P : ℝ × ℝ => (P.1 / (1 / 2), P.2)) '' graf (fun u : ℝ => -2 * (u - 1) ^ 2 + 7) := by
  refine ⟨by norm_num, by norm_num, fun t => ⟨by nlinarith [sq_nonneg (t / 2 - 1)], ⟨fun h => ?_,
    by rintro rfl; norm_num⟩⟩, skrcitev (fun u : ℝ => -2 * (u - 1) ^ 2 + 7) (1 / 2) (by norm_num)⟩
  have h2 : (t / 2 - 1) ^ 2 = 0 := by linarith
  have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h2; linarith

/-- Primer 3 (blok RACUN): 132 mg/dL ≈ 7,3 mmol/L (132/18,016 se zaokroži na 7,3).
trditev: MAT-SS-2/transformacije-grafov#primer3-pretvorba
besedilo: »povprečni vrh po zajtrku $132\,\mathrm{mg/dL}$, to je približno $7{,}3\,\mathrm{mmol/L}$« -/
theorem primer3_pretvorba : |(132:ℝ) / 18.016 - 7.3| < 0.05 := by
  rw [abs_lt]; constructor <;> norm_num

/-- Primer 4: parabola s temenom (−2, −3) je g(x) = a(x + 2)² − 3; skozi (0, 5) gre natanko za a = 2
(5 = a·2² − 3, 4a = 8), torej g(x) = 2(x + 2)² − 3, preizkus g(0) = 2·4 − 3 = 5.
trditev: MAT-SS-2/transformacije-grafov#primer4
besedilo: »Enačba je $5 = a \cdot 2^2 - 3$, torej $4a = 8$, $a = 2$ in $g(x) = 2(x + 2)^2 - 3$. Preizkus: $g(0) = 2 \cdot 4 - 3 = 5$.« -/
theorem primer4 (a : ℝ) :
    (∀ x : ℝ, a * (x - (-2)) ^ 2 + (-3) = a * (x + 2) ^ 2 - 3) ∧
    (a * ((0:ℝ) + 2) ^ 2 - 3 = 5 ↔ a = 2) ∧ (5 = a * 2 ^ 2 - 3 ↔ 4 * a = 8) ∧
    2 * ((0:ℝ) + 2) ^ 2 - 3 = 2 * 4 - 3 ∧ (2:ℝ) * 4 - 3 = 5 := by
  refine ⟨fun x => by ring, ⟨fun h => by linarith, fun h => by rw [h]; norm_num⟩,
    ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num, by norm_num⟩

/-! ## Pogoste napake -/

/-- Pogoste napake: x² + 2 ima teme (0, 2), (x + 2)² pa (−2, 0) (najmanjša vrednost 0 natanko pri x = −2), zato
f(x) + 2 in f(x + 2) nista isto; 2x² ima pri x = 1 vrednost 2; ½x² ima pri 1 vrednost ½ (širša); (2x)² doseže
4 že pri x = 1; 2(x² + 1) = 2x² + 2 ≠ 2x² + 1.
trditev: MAT-SS-2/transformacije-grafov#napake
besedilo: »Prvo dvigne graf za $2$, drugo ga premakne za $2$ v levo. Pri $x^2$: $x^2 + 2$ ima teme $(0, 2)$, $(x + 2)^2$ pa $(-2, 0)$. - **Zamenjani osi pri zrcaljenju.** $-f(x)$ zrcali čez os $x$ (spremenijo se vrednosti), $f(-x)$ čez os $y$ (spremenijo se vhodi). Minus zunaj deluje na $y$, minus znotraj na $x$. - **»Faktor $2$ naredi parabolo širšo.«** $2x^2$ ima pri $x = 1$ vrednost $2$, ne $1$: graf je višji in zato videti ožji. Širšo parabolo da faktor med $0$ in $1$, na primer $\frac{1}{2}x^2$. Enako velja znotraj oklepaja: $(2x)^2$ grafa ne raztegne na dvojno širino, ampak ga stisne na polovico, saj doseže $4$ že pri $x = 1$. - **Napačen vrstni red.** $2(x^2 + 1) = 2x^2 + 2$ ni isto kot $2x^2 + 1$.« -/
theorem napake :
    (∀ x : ℝ, 0 ≤ (x + 2) ^ 2 ∧ ((x + 2) ^ 2 = 0 ↔ x = -2)) ∧ (0:ℝ) ^ 2 + 2 ≠ (0 + 2) ^ 2 ∧
    2 * (1:ℝ) ^ 2 = 2 ∧ 1 / 2 * (1:ℝ) ^ 2 = 1 / 2 ∧ (2 * (1:ℝ)) ^ 2 = 4 ∧
    (∀ x : ℝ, 2 * (x ^ 2 + 1) = 2 * x ^ 2 + 2 ∧ 2 * (x ^ 2 + 1) ≠ 2 * x ^ 2 + 1) := by
  refine ⟨fun x => ⟨sq_nonneg _, ⟨fun h => ?_, by rintro rfl; norm_num⟩⟩, by norm_num, by norm_num, by norm_num,
    by norm_num, fun x => ⟨by ring, fun h => by linarith⟩⟩
  have := pow_eq_zero_iff (n := 2) (by norm_num) |>.mp h; linarith

/-! ## Za maturo -/

/-- Naloga 1: premik za 4 v levo, zrcaljenje čez os x in premik za 3 navzgor dajo g(x) = −√(x + 4) + 3;
√(x + 4) je definiran natanko za x ≥ −4 (D_g = [−4, ∞)); (0, 0) preide v (−4, 3); g(−4) = 3, g(5) = −√9 + 3 = 0;
zaloga vrednosti na D_g je (−∞, 3].
trditev: MAT-SS-2/transformacije-grafov#naloga1
besedilo: »Premik za $4$ v levo: $f(x + 4) = \sqrt{x + 4}$. Zrcaljenje čez os $x$: $-\sqrt{x + 4}$. Premik za $3$ navzgor: $g(x) = -\sqrt{x + 4} + 3$. 2. Pod korenom mora biti $x + 4 \ge 0$, torej $D_g = [-4, \infty)$. Začetna točka $(0, 0)$ grafa $f$ preide v $(-4, 3)$. 3. Vrednosti $\sqrt{x + 4}$ so vsa nenegativna števila, vrednosti $-\sqrt{x + 4}$ vsa nepozitivna, zato je $Z_g = (-\infty, 3]$. Preizkus: $g(-4) = 3$ in $g(5) = -\sqrt{9} + 3 = 0$.« -/
theorem naloga1 :
    (fun x : ℝ => -1 * √(x - (-4)) + 3) = (fun x => -√(x + 4) + 3) ∧
    (∀ x : ℝ, 0 ≤ x + 4 ↔ -4 ≤ x) ∧ ((0:ℝ) + -4, -1 * (0:ℝ) + 3) = (-4, 3) ∧
    -√((-4:ℝ) + 4) + 3 = 3 ∧ -√((5:ℝ) + 4) + 3 = -√9 + 3 ∧ -√(9:ℝ) + 3 = 0 ∧
    (fun x : ℝ => -√(x + 4) + 3) '' Ici (-4) = Iic 3 := by
  have h9 : √(9:ℝ) = 3 := by rw [show (9:ℝ) = 3 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨by funext x; ring_nf, fun x => ⟨fun h => by linarith, fun h => by linarith⟩, by norm_num,
    by norm_num, by norm_num, by rw [h9]; norm_num, ?_⟩
  ext y
  simp only [mem_image, mem_Ici, mem_Iic]
  constructor
  · rintro ⟨x, _, rfl⟩; linarith [Real.sqrt_nonneg (x + 4)]
  · intro hy
    refine ⟨(3 - y) ^ 2 - 4, by nlinarith [sq_nonneg (3 - y)], ?_⟩
    rw [show (3 - y) ^ 2 - 4 + 4 = (3 - y) ^ 2 by ring, Real.sqrt_sq (by linarith)]; ring

/-- Naloga 2 a), c): g(x) = ½(x − 4)² − 2 je x² s faktorjem ½, premaknjen za 4 v desno in 2 navzdol; teme
(0, 0) → (4, −2) je najnižja točka, Z_g = [−2, ∞).
trditev: MAT-SS-2/transformacije-grafov#naloga2-ac
besedilo: »Graf $y = x^2$ s faktorjem $\frac{1}{2}$ skrčimo v smeri osi $y$ (parabola postane širša), premaknemo za $4$ v desno in za $2$ navzdol. 2. a) Teme $(0, 0)$ preide v $(4, -2)$. 3. b) Iz $\frac{1}{2}(x - 4)^2 - 2 = 0$ sledi $(x - 4)^2 = 4$, torej $x - 4 = \pm 2$ in $x = 2$ ali $x = 6$. 4. b) $g(0) = \frac{1}{2} \cdot 16 - 2 = 6$, presečišče z osjo $y$ je $(0, 6)$. 5. c) Parabola je odprta navzgor in ima najnižjo točko v temenu, zato je $Z_g = [-2, \infty)$.« -/
theorem naloga2_ac :
    (∀ x : ℝ, 1 / 2 * (x - 4) ^ 2 - 2 = 1 / 2 * (x - 4) ^ 2 + (-2)) ∧ ((0:ℝ) + 4, 1 / 2 * (0:ℝ) + -2) = (4, -2) ∧
    (∀ x : ℝ, -2 ≤ 1 / 2 * (x - 4) ^ 2 - 2 ∧ (1 / 2 * (x - 4) ^ 2 - 2 = -2 ↔ x = 4)) ∧
    range (fun x : ℝ => 1 / 2 * (x - 4) ^ 2 - 2) = Ici (-2) := by
  obtain ⟨h1, h2, _⟩ := teme_parabole (1 / 2) 4 (-2) (by norm_num)
  refine ⟨fun x => by ring, by norm_num, fun x => ⟨by linarith [h1 x], ?_⟩, ?_⟩
  · rw [show 1 / 2 * (x - 4) ^ 2 - 2 = 1 / 2 * (x - 4) ^ 2 + (-2) by ring]; exact h2 x
  · ext y
    simp only [mem_range, mem_Ici]
    constructor
    · rintro ⟨x, rfl⟩; linarith [h1 x]
    · intro hy
      refine ⟨4 + √(2 * (y + 2)), ?_⟩
      rw [show 4 + √(2 * (y + 2)) - 4 = √(2 * (y + 2)) by ring, Real.sq_sqrt (by linarith)]; ring

/-- Naloga 2 b): ½(x − 4)² − 2 = 0 ⟺ (x − 4)² = 4 ⟺ x − 4 = ±2 ⟺ x = 2 ali x = 6; g(0) = ½·16 − 2 = 6.
trditev: MAT-SS-2/transformacije-grafov#naloga2-b
besedilo: »Iz $\frac{1}{2}(x - 4)^2 - 2 = 0$ sledi $(x - 4)^2 = 4$, torej $x - 4 = \pm 2$ in $x = 2$ ali $x = 6$. 4. b) $g(0) = \frac{1}{2} \cdot 16 - 2 = 6$« -/
theorem naloga2_b (x : ℝ) :
    (1 / 2 * (x - 4) ^ 2 - 2 = 0 ↔ (x - 4) ^ 2 = 4) ∧ ((x - 4) ^ 2 = 4 ↔ x - 4 = 2 ∨ x - 4 = -2) ∧
    (x - 4 = 2 ∨ x - 4 = -2 ↔ x = 6 ∨ x = 2) ∧ 1 / 2 * ((0:ℝ) - 4) ^ 2 - 2 = 1 / 2 * 16 - 2 ∧
    1 / 2 * (16:ℝ) - 2 = 6 := by
  refine ⟨⟨fun h => by linarith, fun h => by linarith⟩, ?_, ⟨?_, ?_⟩, by norm_num, by norm_num⟩
  · rw [show (4:ℝ) = 2 ^ 2 by norm_num, sq_eq_sq_iff_eq_or_eq_neg]
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · rintro (h | h)
    · left; linarith
    · right; linarith

/-- Naloga 2 d): zrcaljenje čez os y da g(−x) = ½(−x − 4)² − 2 = ½(x + 4)² − 2 (ker je (−x − 4)² = (x + 4)²);
teme (4, −2) preide v (−4, −2) (najmanjša vrednost natanko pri x = −4).
trditev: MAT-SS-2/transformacije-grafov#naloga2-d
besedilo: »Zrcaljenje čez os $y$ da $g(-x) = \frac{1}{2}(-x - 4)^2 - 2 = \frac{1}{2}(x + 4)^2 - 2$, ker je $(-x - 4)^2 = (x + 4)^2$. 7. d) Teme $(4, -2)$ preide v $(-4, -2)$.« -/
theorem naloga2_d :
    (∀ x : ℝ, 1 / 2 * (-x - 4) ^ 2 - 2 = 1 / 2 * (x + 4) ^ 2 - 2 ∧ (-x - 4) ^ 2 = (x + 4) ^ 2) ∧
    (∀ x : ℝ, -2 ≤ 1 / 2 * (x + 4) ^ 2 - 2 ∧ (1 / 2 * (x + 4) ^ 2 - 2 = -2 ↔ x = -4)) := by
  obtain ⟨h1, h2, _⟩ := teme_parabole (1 / 2) (-4) (-2) (by norm_num)
  refine ⟨fun x => ⟨by ring, by ring⟩, fun x => ⟨?_, ?_⟩⟩
  · have := h1 x; rw [show x - -4 = x + 4 by ring] at this; linarith
  · have := h2 x; rw [show x - -4 = x + 4 by ring] at this
    rw [show 1 / 2 * (x + 4) ^ 2 - 2 = 1 / 2 * (x + 4) ^ 2 + -2 by ring]; exact this

/-- Naloga 3 a), b): f(x) = 2|x − 1| − 4 je |x| raztegnjen s faktorjem 2, premaknjen za 1 v desno in 4 navzdol;
teme (1, −4) je najnižja točka; ničli: |x − 1| = 2 ⟺ x = −1 ali x = 3; f(0) = 2·1 − 4 = −2; Z_f = [−4, ∞).
trditev: MAT-SS-2/transformacije-grafov#naloga3-ab
besedilo: »Graf $y = |x|$ raztegnemo s faktorjem $2$ v smeri osi $y$, premaknemo za $1$ v desno in za $4$ navzdol. Teme $(0, 0)$ preide v $(1, -4)$. 2. b) Iz $2|x - 1| - 4 = 0$ sledi $|x - 1| = 2$, torej $x - 1 = \pm 2$ in $x = -1$ ali $x = 3$. 3. b) $f(0) = 2 \cdot 1 - 4 = -2$. Graf je »V« z najnižjo točko v temenu, zato je $Z_f = [-4, \infty)$.« -/
theorem naloga3_ab :
    (∀ x : ℝ, -4 ≤ 2 * |x - 1| - 4) ∧ 2 * |(1:ℝ) - 1| - 4 = -4 ∧
    (∀ x : ℝ, (2 * |x - 1| - 4 = 0 ↔ |x - 1| = 2) ∧ (|x - 1| = 2 ↔ x - 1 = 2 ∨ x - 1 = -2) ∧
      (x - 1 = 2 ∨ x - 1 = -2 ↔ x = 3 ∨ x = -1)) ∧
    2 * |(0:ℝ) - 1| - 4 = 2 * 1 - 4 ∧ (2:ℝ) * 1 - 4 = -2 ∧ range (fun x : ℝ => 2 * |x - 1| - 4) = Ici (-4) := by
  refine ⟨fun x => by linarith [abs_nonneg (x - 1)], by norm_num, fun x => ⟨⟨fun h => by linarith,
    fun h => by rw [h]; norm_num⟩, abs_eq (by norm_num), ⟨?_, ?_⟩⟩, by norm_num, by norm_num, ?_⟩
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · rintro (h | h)
    · left; linarith
    · right; linarith
  · ext y
    simp only [mem_range, mem_Ici]
    constructor
    · rintro ⟨x, rfl⟩; linarith [abs_nonneg (x - 1)]
    · intro hy
      refine ⟨1 + (y + 4) / 2, ?_⟩
      rw [show 1 + (y + 4) / 2 - 1 = (y + 4) / 2 by ring, abs_of_nonneg (by linarith)]; ring

/-- Naloga 3 c): g(x) = f(2x) = 2|2x − 1| − 4; teme (1/2, −4) je najnižja točka; ničli: g(x) = 0 ⟺ x = −1/2
ali x = 3/2; preizkus g(3/2) = 2·|2| − 4 = 0.
trditev: MAT-SS-2/transformacije-grafov#naloga3-c
besedilo: »$g(x) = 2|2x - 1| - 4$. Vodoravna skrčitev s faktorjem $2$ prepolovi abscise: teme $(1, -4)$ preide v $\left(\frac{1}{2}, -4\right)$, ničli $-1$ in $3$ v $-\frac{1}{2}$ in $\frac{3}{2}$. 5. c) Preizkus: $g\left(\frac{3}{2}\right) = 2 \cdot |2| - 4 = 0$.« -/
theorem naloga3_c :
    (∀ x : ℝ, 2 * |2 * x - 1| - 4 = (fun u : ℝ => 2 * |u - 1| - 4) (2 * x)) ∧
    (∀ x : ℝ, -4 ≤ 2 * |2 * x - 1| - 4 ∧ (2 * |2 * x - 1| - 4 = -4 ↔ x = 1 / 2)) ∧
    (∀ x : ℝ, 2 * |2 * x - 1| - 4 = 0 ↔ x = -1 / 2 ∨ x = 3 / 2) ∧
    2 * |2 * (3 / 2 : ℝ) - 1| - 4 = 2 * |(2:ℝ)| - 4 ∧ 2 * |(2:ℝ)| - 4 = 0 := by
  refine ⟨fun x => rfl, fun x => ⟨by linarith [abs_nonneg (2 * x - 1)], ⟨fun h => ?_, ?_⟩⟩, fun x => ?_,
    by norm_num, by norm_num⟩
  · have : |2 * x - 1| = 0 := by linarith
    rw [abs_eq_zero] at this; linarith
  · rintro rfl; norm_num
  · constructor
    · intro h
      have : |2 * x - 1| = 2 := by linarith
      rcases (abs_eq (by norm_num)).mp this with h1 | h1
      · right; linarith
      · left; linarith
    · rintro (rfl | rfl) <;> norm_num

/-- Naloga 3 d), koraki: za x ≥ 1 je f(x) = 2x − 6 in 2x − 6 ≤ x − 1 ⟺ x ≤ 5; za x < 1 je f(x) = −2x − 2 in
−2x − 2 ≤ x − 1 ⟺ x ≥ −1/3; preizkus krajišč f(5) = 4 = 5 − 1, f(−1/3) = −4/3 = −1/3 − 1.
trditev: MAT-SS-2/transformacije-grafov#naloga3-d-koraki
besedilo: »Za $x \ge 1$ je $f(x) = 2(x - 1) - 4 = 2x - 6$. Iz $2x - 6 \le x - 1$ sledi $x \le 5$, s pogojem $x \ge 1$ torej $1 \le x \le 5$. 7. d) Za $x < 1$ je $f(x) = -2(x - 1) - 4 = -2x - 2$. Iz $-2x - 2 \le x - 1$ sledi $-3x \le 1$ in $x \ge -\frac{1}{3}$, s pogojem $x < 1$ torej $-\frac{1}{3} \le x < 1$. 8. d) Rešitev je unija obeh delov, $\left[-\frac{1}{3}, 5\right]$. Preizkus krajišč: $f(5) = 4 = 5 - 1$ in $f\left(-\frac{1}{3}\right) = -\frac{4}{3} = -\frac{1}{3} - 1$.« -/
theorem naloga3_d_koraki :
    (∀ x : ℝ, 1 ≤ x → 2 * |x - 1| - 4 = 2 * (x - 1) - 4 ∧ 2 * (x - 1) - 4 = 2 * x - 6) ∧
    (∀ x : ℝ, 2 * x - 6 ≤ x - 1 ↔ x ≤ 5) ∧
    (∀ x : ℝ, x < 1 → 2 * |x - 1| - 4 = -2 * (x - 1) - 4 ∧ -2 * (x - 1) - 4 = -2 * x - 2) ∧
    (∀ x : ℝ, -2 * x - 2 ≤ x - 1 ↔ -3 * x ≤ 1) ∧ (∀ x : ℝ, -3 * x ≤ 1 ↔ -1 / 3 ≤ x) ∧
    2 * |(5:ℝ) - 1| - 4 = 4 ∧ (4:ℝ) = 5 - 1 ∧ 2 * |(-1 / 3 : ℝ) - 1| - 4 = -4 / 3 ∧ (-4 / 3 : ℝ) = -1 / 3 - 1 := by
  refine ⟨fun x hx => ⟨by rw [abs_of_nonneg (by linarith)], by ring⟩,
    fun x => ⟨fun h => by linarith, fun h => by linarith⟩,
    fun x hx => ⟨by rw [abs_of_neg (by linarith)]; ring, by ring⟩,
    fun x => ⟨fun h => by linarith, fun h => by linarith⟩, fun x => ⟨fun h => by linarith, fun h => by linarith⟩,
    by norm_num, by norm_num, ?_, by norm_num⟩
  rw [abs_of_neg (by norm_num)]; norm_num

/-- Naloga 3 d) (in blok RACUN): f(x) ≤ x − 1 ⟺ x ∈ [−1/3, 5]; enačba f(x) = x − 1 ima natanko rešitvi −1/3 in 5.
trditev: MAT-SS-2/transformacije-grafov#naloga3-d
besedilo: »Rešitev je unija obeh delov, $\left[-\frac{1}{3}, 5\right]$. Preizkus krajišč: $f(5) = 4 = 5 - 1$ in $f\left(-\frac{1}{3}\right) = -\frac{4}{3} = -\frac{1}{3} - 1$.« -/
theorem naloga3_d (x : ℝ) :
    (2 * |x - 1| - 4 ≤ x - 1 ↔ -1 / 3 ≤ x ∧ x ≤ 5) ∧ (2 * |x - 1| - 4 = x - 1 ↔ x = -1 / 3 ∨ x = 5) := by
  rcases le_or_gt 1 x with hx | hx
  · rw [abs_of_nonneg (by linarith)]
    refine ⟨⟨fun h => ⟨by linarith, by linarith⟩, fun h => by linarith⟩, ⟨fun h => Or.inr (by linarith), ?_⟩⟩
    rintro (h | h) <;> linarith
  · rw [abs_of_neg (by linarith)]
    refine ⟨⟨fun h => ⟨by linarith, by linarith⟩, fun h => by linarith⟩, ⟨fun h => Or.inl (by linarith), ?_⟩⟩
    rintro (h | h) <;> linarith

/-! ## Drugače -/

/-- Korak za korakom: g(x) = 3√(x + 1) − 2; (0, 0), (1, 1), (4, 2) → (−1, 0), (0, 1), (3, 2) → (−1, 0), (0, 3),
(3, 6) → (−1, −2), (0, 1), (3, 4); preizkus g(3) = 3√4 − 2 = 6 − 2 = 4 in g(−1) = −2, g(0) = 1.
trditev: MAT-SS-2/transformacije-grafov#korak-za-korakom
besedilo: »Na grafu $f(x) = \sqrt{x}$ izberi lahke točke: $(0, 0)$, $(1, 1)$, $(4, 2)$. 2. Oklepaj $x + 1 = x - (-1)$ da $p = -1$: vsak $x$ zmanjšaj za $1$. Točke so $(-1, 0)$, $(0, 1)$, $(3, 2)$. 3. Faktor $3$ pomnoži vrednosti: $(-1, 0)$, $(0, 3)$, $(3, 6)$. 4. Na koncu odštej $2$ od vrednosti: $(-1, -2)$, $(0, 1)$, $(3, 4)$. 5. Preizkus pri $x = 3$: $g(3) = 3\sqrt{4} - 2 = 6 - 2 = 4$.« -/
theorem korak_za_korakom :
    ((0:ℝ) + -1 = -1 ∧ (1:ℝ) + -1 = 0 ∧ (4:ℝ) + -1 = 3) ∧ (3 * (0:ℝ) = 0 ∧ 3 * (1:ℝ) = 3 ∧ 3 * (2:ℝ) = 6) ∧
    ((0:ℝ) - 2 = -2 ∧ (3:ℝ) - 2 = 1 ∧ (6:ℝ) - 2 = 4) ∧
    3 * √((3:ℝ) + 1) - 2 = 3 * √4 - 2 ∧ 3 * √(4:ℝ) - 2 = 6 - 2 ∧ (6:ℝ) - 2 = 4 ∧
    3 * √((-1:ℝ) + 1) - 2 = -2 ∧ 3 * √((0:ℝ) + 1) - 2 = 1 := by
  have h4 : √(4:ℝ) = 2 := by rw [show (4:ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by rw [h4]; norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-- Korak za korakom (zrcaljenje): g(x) = √(−x) + 1; (0, 0), (1, 1), (4, 2) → (0, 0), (−1, 1), (−4, 2) →
(0, 1), (−1, 2), (−4, 3); g(−4) = √4 + 1 = 3; √(−x) je definiran za x ≤ 0.
trditev: MAT-SS-2/transformacije-grafov#korak-zrcaljenje
besedilo: »Minus pri vhodu obrne predznak vsakega $x$: iz $(0, 0)$, $(1, 1)$, $(4, 2)$ nastanejo $(0, 0)$, $(-1, 1)$, $(-4, 2)$. Prištevanje $1$ jih dvigne v $(0, 1)$, $(-1, 2)$, $(-4, 3)$. Preizkus: $g(-4) = \sqrt{4} + 1 = 3$. Zrcali se tudi definicijsko območje: namesto $x \ge 0$ je zdaj $x \le 0$.« -/
theorem korak_zrcaljenje :
    √(-(0:ℝ)) + 1 = 1 ∧ √(-(-1:ℝ)) + 1 = 2 ∧ √(-(-4:ℝ)) + 1 = √4 + 1 ∧ √(4:ℝ) + 1 = 3 ∧
    ∀ x : ℝ, 0 ≤ -x ↔ x ≤ 0 := by
  have h4 : √(4:ℝ) = 2 := by rw [show (4:ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  refine ⟨by norm_num, by norm_num, by norm_num, by rw [h4]; norm_num, fun x => neg_nonneg⟩

/-! ## Preveri se -/

/-- Preveri se 1: (2x)² = 4x², x² + 5 = 1·x² + 5, faktorji 4 > 3 > 1 > ½ (od najožje do najširše).
trditev: MAT-SS-2/transformacije-grafov#kviz1
besedilo: »Širino določa samo faktor: $(2x)^2 = 4x^2$ je najožja, sledi $3x^2$. Prištevanje $5$ parabolo le dvigne, zato je $x^2 + 5$ široka kot $x^2$. Faktor $\frac{1}{2}$ jo razširi.« -/
theorem kviz1 :
    (∀ x : ℝ, (2 * x) ^ 2 = 4 * x ^ 2) ∧ (∀ x : ℝ, x ^ 2 + 5 = 1 * x ^ 2 + 5) ∧
    (3:ℝ) < 4 ∧ (1:ℝ) < 3 ∧ (1 / 2 : ℝ) < 1 := by
  refine ⟨fun x => by ring, fun x => by ring, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 2: (4, 2) preide pri g(x) = −2√(x − 1) + 3 v (4 + 1; −2·2 + 3) = (5, −1), in res g(5) = −1;
napačni odgovori: 2·2 + 3 = 7, −2·(2 + 3) = −10, g(4) = −2√3 + 3 ≈ −0,46.
trditev: MAT-SS-2/transformacije-grafov#kviz2
besedilo: »Točka $(x, y)$ preide v $(x + p,\ ay + q)$: $x = 4 + 1 = 5$ in $y = -2 \cdot 2 + 3 = -1$. Nova točka je $(5, -1)$.« -/
theorem kviz2 :
    ((4:ℝ) + 1, -2 * (2:ℝ) + 3) = (5, -1) ∧ -2 * √((5:ℝ) - 1) + 3 = -1 ∧ 2 * (2:ℝ) + 3 = 7 ∧
    -2 * ((2:ℝ) + 3) = -10 ∧ |(-2 * √((4:ℝ) - 1) + 3) - (-0.46)| < 0.005 := by
  have h4 : √(4:ℝ) = 2 := by rw [show (4:ℝ) = 2 ^ 2 by norm_num, Real.sqrt_sq (by norm_num)]
  have s1 : (1.7320 : ℝ) < √3 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have s2 : √3 < (1.7321 : ℝ) := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, by norm_num [h4], by norm_num, by norm_num, ?_⟩
  norm_num
  rw [abs_lt]; constructor <;> linarith

/-- Preveri se 3 in 6: g(x) = f(x − 3) ima pri x vrednost f pri x − 3 (graf 3 v desno: (x, y) ↦ (x + 3, y));
jutrišnja temperatura je T(t − 5), graf 5 minut v desno.
trditev: MAT-SS-2/transformacije-grafov#kviz3-6
besedilo: »Jutri ima zrak ob času $t$ tisto temperaturo, kot jo je danes imel ob $t - 5$. Graf se premakne za $5$ minut v desno.« -/
theorem kviz3_6 (f : ℝ → ℝ) :
    graf (fun x => f (x - 3)) = (fun P : ℝ × ℝ => (P.1 + 3, P.2)) '' graf f ∧
    graf (fun t => f (t - 5)) = (fun P : ℝ × ℝ => (P.1 + 5, P.2)) '' graf f :=
  ⟨(premika f 3 0).2, (premika f 5 0).2⟩

/-- Preveri se 4: g(x) = −2|x − 1| + 3 ima vrh (1, 3) (največja vrednost 3 natanko pri x = 1), en korak desno od
vrha je za 2 niže (g(2) = 1), zato a = −2.
trditev: MAT-SS-2/transformacije-grafov#kviz4
besedilo: »Vrh je v $(1, 3)$. En korak desno od vrha je graf za $2$ niže, pri $|x|$ pa bi bil za $1$ više: $a = -2$ in $g(x) = -2|x - 1| + 3$.« -/
theorem kviz4 :
    (∀ x : ℝ, -2 * |x - 1| + 3 ≤ 3 ∧ (-2 * |x - 1| + 3 = 3 ↔ x = 1)) ∧ -2 * |(2:ℝ) - 1| + 3 = 1 ∧
    (-2 * |(2:ℝ) - 1| + 3) - (-2 * |(1:ℝ) - 1| + 3) = -2 := by
  refine ⟨fun x => ⟨by linarith [abs_nonneg (x - 1)], ⟨fun h => ?_, by rintro rfl; norm_num⟩⟩, by norm_num,
    by norm_num⟩
  have : |x - 1| = 0 := by linarith
  rw [abs_eq_zero] at this; linarith

/-- Preveri se 5: −|x − 2| + 3 je zrcaljenje grafa |x − 2| čez os x (minus zunaj), nato dvig za 3; vrh je (2, 3):
g(2) = −0 + 3 = 3.
trditev: MAT-SS-2/transformacije-grafov#kviz5
besedilo: »Prištevanje zunaj res dvigne graf. Preizkus: $g(2) = -0 + 3 = 3$, vrh je v $(2, 3)$.« -/
theorem kviz5 :
    graf (fun x => -|x - 2|) = (fun P : ℝ × ℝ => (P.1, -P.2)) '' graf (fun x => |x - 2|) ∧
    -|(2:ℝ) - 2| + 3 = 3 ∧ ∀ x : ℝ, -|x - 2| + 3 ≤ 3 :=
  ⟨(zrcaljenji_razteg _ 1).1, by norm_num, fun x => by linarith [abs_nonneg (x - 2)]⟩

end Evklid.Lekcije.MAT_SS_2.TransformacijeGrafov
