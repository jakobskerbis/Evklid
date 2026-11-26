/-
vir: content/lessons/MAT-SS-2/eksponentna-funkcija.md
sha256: 3cb8acc42d988f7eba669f85a153706362e8e7e53fb60502f7b06513421486a4
Ni v Leanu: uvodna zgodba in opisi slušnega vtisa (»zveni razglašeno«); risbe, drsniki in simulacija
(dokazane so le točke, ki jih navajajo: (0, 1), (1, a), premiki, ničle, asimptote); trditve o strmini
(»graf je tem strmejši«: dokazano le za razliko 2ⁿ, 3ⁿ, 4ⁿ med x = 1 in x = 2 in primerjava vrednosti
pri x < 0); »graf nima lukenj« (zveznost ni posebej dokazana; dokazano je, da so dosežene vse
pozitivne vrednosti); »potence 2^1,4, 2^1,41, 2^1,414, … se približujejo 2^√2« kot konvergenca
(zahtevno, še ni dokazano; dokazano je, da naraščajo, da so manjše od 2^1,5 in da je 2^√2 ≈ 2,665);
razlaga 11: da je 685 prvo število, pri katerem 1,1ˣ prehiti x¹⁰ (dokazana sta le računa pri 685 in
686); »(−2)ˣ ni eksponentna funkcija« in »−2ˣ pomeni −(2ˣ)«
(dogovor o zapisu); ustno vprašanje 3 in analogija s torto (besedno); točkovanje; risanje grafov v
nalogi 3 c (dokazane so točke).
Dogovori Leana: aˣ je `Real.rpow`; »asimptota« je zapisana kot: vrednosti so pozitivne in za vsak ε > 0
obstaja meja, za katero (levo pri a > 1, desno pri 0 < a < 1) velja aˣ < ε. »≈ v« pomeni, da število
leži v intervalu pol enote zadnjega mesta okoli v (dokazani sta obe meji).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_2.EksponentnaFunkcija

/-! ## Pomožne trditve -/

/-- Pomožno (za vse približke): če je e·q = p in aᵠ < yᵖ < bᵠ (y > 0, a, b ≥ 0), potem leži y^e
med a in b, ker je (y^e)^q = y^p (a < 0 je trivialno).
pomozno -/
theorem koren_med {y a b e : ℝ} {p : ℤ} {q : ℕ} (hy : 0 < y)
    (hb : 0 ≤ b) (he : e * q = p) (h1 : a ^ q < y ^ p) (h2 : y ^ p < b ^ q) :
    a < y ^ e ∧ y ^ e < b := by
  have hz0 : 0 ≤ y ^ e := Real.rpow_nonneg hy.le e
  have hz : (y ^ e) ^ q = y ^ p := by
    rw [← Real.rpow_natCast, ← Real.rpow_mul hy.le, he, Real.rpow_intCast]
  constructor
  · by_contra h
    have := pow_le_pow_left₀ hz0 (not_lt.mp h) q
    linarith
  · by_contra h
    have := pow_le_pow_left₀ hb (not_lt.mp h) q
    linarith

/-- Predpostavke trditve `koren_med` se dajo izpolniti (y = 4, e = 1/2, p = 1, q = 2, a = 1, b = 3; a ≥ 0 ni pogoj). -/
example : (0 : ℝ) < 4 ∧ (0 : ℝ) ≤ 3 ∧ (1 / 2 : ℝ) * ((2 : ℕ) : ℝ) = ((1 : ℤ) : ℝ)
    ∧ (1 : ℝ) ^ 2 < (4 : ℝ) ^ (1 : ℤ) ∧ (4 : ℝ) ^ (1 : ℤ) < 3 ^ 2 := by norm_num

/-! ## Razlaga 5: lastnosti (najprej, ker jih rabijo primeri) -/

/-- Razlaga 5: pri a > 1 je aˣ strogo naraščajoča.
trditev: MAT-SS-2/eksponentna-funkcija#narasca
besedilo: »$a^x > 1$« -/
theorem narasca (a : ℝ) (ha : 1 < a) : StrictMono fun x : ℝ => a ^ x :=
  fun _ _ h => (Real.rpow_lt_rpow_left_iff ha).mpr h

/-- Predpostavke trditve `narasca` se dajo izpolniti (a = 2). -/
example : (1 : ℝ) < 2 := by norm_num

/-- Razlaga 5: pri 0 < a < 1 je aˣ strogo padajoča.
trditev: MAT-SS-2/eksponentna-funkcija#pada
besedilo: »| $x > 0$ | $a^x > 1$ | $0 < a^x < 1$ |« -/
theorem pada (a : ℝ) (h0 : 0 < a) (h1 : a < 1) : StrictAnti fun x : ℝ => a ^ x :=
  fun _ _ h => (Real.rpow_lt_rpow_left_iff_of_base_lt_one h0 h1).mpr h

/-- Predpostavke trditve `pada` se dajo izpolniti (a = 1/2). -/
example : (0 : ℝ) < 1 / 2 ∧ (1 / 2 : ℝ) < 1 := by norm_num

/-- Razlaga 5 (injektivnost): za a > 0, a ≠ 1 je aᵘ = aᵛ natanko tedaj, ko je u = v.
trditev: MAT-SS-2/eksponentna-funkcija#injektivna
besedilo: »| $x > 0$ | $a^x > 1$ | $0 < a^x < 1$ |« -/
theorem injektivna (a : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (u v : ℝ) : a ^ u = a ^ v ↔ u = v := by
  constructor
  · intro h
    rcases lt_or_gt_of_ne ha1 with h1 | h1
    · exact (pada a ha h1).injective h
    · exact (narasca a h1).injective h
  · intro h; rw [h]

/-- Predpostavke trditve `injektivna` se dajo izpolniti (a = 2). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 := by norm_num

/-- Razlaga 5: za a > 0, a ≠ 1 je zaloga vrednosti aˣ (definirane za vsak realen x) interval (0, ∞):
vse vrednosti so pozitivne (ničel ni) in vsaka pozitivna vrednost je dosežena.
trditev: MAT-SS-2/eksponentna-funkcija#zaloga
besedilo: »Pri vsaki osnovi je definicijsko območje $\mathbb{R}$, zaloga vrednosti $(0, \infty)$ in presečišče z osjo $y$ točka $(0, 1)$. Ničel ni. Funkcija je navzdol omejena (z $0$), navzgor ne, in strogo monotona. Os $x$ ($y = 0$) je asimptota. Osnova odloča le o tem:« -/
theorem zaloga (a : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) :
    Set.range (fun x : ℝ => a ^ x) = Set.Ioi 0 := by
  ext y
  constructor
  · rintro ⟨x, rfl⟩; exact Real.rpow_pos_of_pos ha x
  · intro hy; exact ⟨Real.logb a y, Real.rpow_logb ha ha1 hy⟩

/-- Predpostavke trditve `zaloga` se dajo izpolniti (a = 2). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 := by norm_num

/-- Razlaga 5: graf gre skozi (0, 1) in (1, a); ničel ni; funkcija je navzdol omejena z 0, navzgor pa
ni omejena (vsako mejo M preseže).
trditev: MAT-SS-2/eksponentna-funkcija#lastnosti
besedilo: »Pri vsaki osnovi je definicijsko območje $\mathbb{R}$, zaloga vrednosti $(0, \infty)$ in presečišče z osjo $y$ točka $(0, 1)$. Ničel ni. Funkcija je navzdol omejena (z $0$), navzgor ne, in strogo monotona. Os $x$ ($y = 0$) je asimptota. Osnova odloča le o tem:« -/
theorem lastnosti (a : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) :
    a ^ (0 : ℝ) = 1 ∧ a ^ (1 : ℝ) = a ∧ (∀ x : ℝ, a ^ x ≠ 0) ∧ (∀ x : ℝ, 0 < a ^ x) ∧
    (∀ M : ℝ, ∃ x : ℝ, M < a ^ x) := by
  refine ⟨Real.rpow_zero a, Real.rpow_one a, fun x => (Real.rpow_pos_of_pos ha x).ne',
    fun x => Real.rpow_pos_of_pos ha x, fun M => ?_⟩
  refine ⟨Real.logb a (|M| + 1), ?_⟩
  rw [Real.rpow_logb ha ha1 (by positivity)]
  linarith [le_abs_self M]

/-- Predpostavke trditve `lastnosti` se dajo izpolniti (a = 3). -/
example : (0 : ℝ) < 3 ∧ (3 : ℝ) ≠ 1 := by norm_num

/-- Razlaga 5 (tabela): pri a > 1 in x > 0 je aˣ > 1, pri 0 < a < 1 in x > 0 je 0 < aˣ < 1.
trditev: MAT-SS-2/eksponentna-funkcija#nad-pod-ena
besedilo: »| $x > 0$ | $a^x > 1$ | $0 < a^x < 1$ |« -/
theorem nad_pod_ena (a x : ℝ) (hx : 0 < x) :
    (1 < a → 1 < a ^ x) ∧ (0 < a → a < 1 → 0 < a ^ x ∧ a ^ x < 1) :=
  ⟨fun ha => Real.one_lt_rpow ha hx,
    fun h0 h1 => ⟨Real.rpow_pos_of_pos h0 x, Real.rpow_lt_one h0.le h1 hx⟩⟩

/-- Predpostavke trditve `nad_pod_ena` se dajo izpolniti (x = 1, a = 2 ali a = 1/2). -/
example : (0 : ℝ) < 1 ∧ (1 : ℝ) < 2 ∧ (0 : ℝ) < 1 / 2 ∧ (1 / 2 : ℝ) < 1 := by norm_num

/-- Razlaga 5 (asimptota y = 0): pri a > 1 so vrednosti levo od neke meje poljubno blizu 0 (asimptota
na levi), pri 0 < a < 1 pa desno od neke meje (asimptota na desni); 0 ni dosežena (`lastnosti`).
trditev: MAT-SS-2/eksponentna-funkcija#asimptota
besedilo: »| | $a > 1$ | $0 < a < 1$ |« -/
theorem asimptota (a : ℝ) (ε : ℝ) (hε : 0 < ε) :
    (1 < a → ∃ x₀ : ℝ, ∀ x, x < x₀ → a ^ x < ε) ∧
    (0 < a → a < 1 → ∃ x₀ : ℝ, ∀ x, x₀ < x → a ^ x < ε) := by
  constructor
  · intro ha
    refine ⟨Real.logb a ε, fun x hx => ?_⟩
    rw [← Real.rpow_logb (by linarith) ha.ne' hε]
    exact narasca a ha hx
  · intro h0 h1
    refine ⟨Real.logb a ε, fun x hx => ?_⟩
    rw [← Real.rpow_logb h0 h1.ne hε]
    exact pada a h0 h1 hx

/-- Predpostavke trditve `asimptota` se dajo izpolniti (ε = 1/100, a = 2 ali a = 1/2). -/
example : (0 : ℝ) < 1 / 100 ∧ (1 : ℝ) < 2 ∧ (0 : ℝ) < 1 / 2 ∧ (1 / 2 : ℝ) < 1 := by norm_num

/-- Razlaga 5: korak za 1 v desno vrednost pomnoži z a: a^(x+1) = aˣ·a (a > 0); primerjava: 2ˣ pri
x = 0, 1, 2, 3 da 1, 2, 4, 8, 2x + 1 pa 1, 3, 5, 7 (vsakič +2).
trditev: MAT-SS-2/eksponentna-funkcija#korak
besedilo: »Primerjaj vrednosti pri $x = 0, 1, 2, 3$: $2^x$ da $1, 2, 4, 8$ (vsakič krat $2$), $2x + 1$ pa $1, 3, 5, 7$ (vsakič plus $2$).« -/
theorem korak (a x : ℝ) (ha : 0 < a) :
    a ^ (x + 1) = a ^ x * a ∧
    ((2 : ℝ) ^ (0 : ℝ) = 1 ∧ (2 : ℝ) ^ (1 : ℝ) = 2 ∧ (2 : ℝ) ^ (2 : ℝ) = 4 ∧ (2 : ℝ) ^ (3 : ℝ) = 8) ∧
    ((2 : ℝ) * 0 + 1 = 1 ∧ (2 : ℝ) * 1 + 1 = 3 ∧ (2 : ℝ) * 2 + 1 = 5 ∧ (2 : ℝ) * 3 + 1 = 7) := by
  refine ⟨by rw [Real.rpow_add ha, Real.rpow_one], by norm_num, by norm_num⟩

/-- Predpostavke trditve `korak` se dajo izpolniti (a = 2). -/
example : (0 : ℝ) < 2 := by norm_num

/-! ## Razlaga 1: oktave -/

/-- Razlaga 1, tabela: 440·2ˣ pri x = −2, −1, 0, 1, 2 da 110, 220, 440, 880, 1760; 2^(1/2) = √2.
trditev: MAT-SS-2/eksponentna-funkcija#oktave
besedilo: »| $-2$ | $\frac{1}{4}$ | $110$ |« -/
theorem oktave :
    (2 : ℝ) ^ (-2 : ℝ) = 1 / 4 ∧ (440 : ℝ) * (1 / 4) = 110 ∧
    (2 : ℝ) ^ (-1 : ℝ) = 1 / 2 ∧ (440 : ℝ) * (1 / 2) = 220 ∧
    (2 : ℝ) ^ (0 : ℝ) = 1 ∧ (440 : ℝ) * 1 = 440 ∧
    (2 : ℝ) ^ (1 / 2 : ℝ) = Real.sqrt 2 ∧
    (2 : ℝ) ^ (1 : ℝ) = 2 ∧ (440 : ℝ) * 2 = 880 ∧
    (2 : ℝ) ^ (2 : ℝ) = 4 ∧ (440 : ℝ) * 4 = 1760 := by
  refine ⟨by norm_num [Real.rpow_neg], by norm_num, by norm_num [Real.rpow_neg], by norm_num,
    by norm_num, by norm_num, (Real.sqrt_eq_rpow 2).symm, by norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-- Razlaga 1: √2 ≈ 1,4142 in 440·√2 ≈ 622,25 (ne 660); ena dvanajstina: 2^(1/12) ≈ 1,0595;
prva zamisel: 880 − 440 = 440 in 440/12 ≈ 36,67; ton e² je 440·2^(7/12) ≈ 659,26, skoraj 660;
na sliki: razlika 660 − 622,25 ≈ 38.
trditev: MAT-SS-2/eksponentna-funkcija#oktave-priblizki
besedilo: »Ton na sredini oktave, $6$ poltonov nad a¹, ima torej $440 \cdot \sqrt{2} \approx 622{,}25\,\mathrm{Hz}$ in ne $660\,\mathrm{Hz}$, kot bi dala Nikina prva zamisel.« -/
theorem oktave_priblizki :
    (1.41415 < Real.sqrt 2 ∧ Real.sqrt 2 < 1.41425) ∧
    (622.245 < 440 * Real.sqrt 2 ∧ 440 * Real.sqrt 2 < 622.255) ∧
    (1.05945 < (2 : ℝ) ^ (1 / 12 : ℝ) ∧ (2 : ℝ) ^ (1 / 12 : ℝ) < 1.05955) ∧
    ((880 : ℝ) - 440 = 440 ∧ 36.665 < (440 : ℝ) / 12 ∧ (440 : ℝ) / 12 < 36.675) ∧
    (659.255 < 440 * (2 : ℝ) ^ (7 / 12 : ℝ) ∧ 440 * (2 : ℝ) ^ (7 / 12 : ℝ) < 659.265) ∧
    (37.5 < (660 : ℝ) - 622.25 ∧ (660 : ℝ) - 622.25 < 38.5) := by
  have hs : 622.245 / 440 < (2 : ℝ) ^ (1 / 2 : ℝ) ∧ (2 : ℝ) ^ (1 / 2 : ℝ) < 622.255 / 440 :=
    koren_med (p := 1) (q := 2) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  have h7 : 659.255 / 440 < (2 : ℝ) ^ (7 / 12 : ℝ) ∧ (2 : ℝ) ^ (7 / 12 : ℝ) < 659.265 / 440 :=
    koren_med (p := 7) (q := 12) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  rw [← Real.sqrt_eq_rpow] at hs
  refine ⟨⟨by linarith [hs.1], by linarith [hs.2]⟩, ⟨by linarith [hs.1], by linarith [hs.2]⟩, ?_,
    by norm_num, ⟨by linarith [h7.1], by linarith [h7.2]⟩, by norm_num⟩
  exact koren_med (p := 1) (q := 12) (by norm_num) (by norm_num) (by norm_num)
    (by norm_num) (by norm_num)

/-- Razlaga 1 (in slika): za 0 < n < 12 je pravilna uglasitev 440·2^(n/12) pod Nikino prvo zamislijo
440 + 440·n/12 (stroga konveksnost eksponentne funkcije); na koncih (n = 0, n = 12) sta enaki.
trditev: MAT-SS-2/eksponentna-funkcija#pod-premico
besedilo: »1. En primer do konca.** Nikin sintetizator najprej uglasimo po oktavah. Vsaka oktava navzgor frekvenco podvoji, vsaka navzdol jo razpolovi. Z $x$ označimo, za koliko oktav je ton nad a¹ (pod a¹ je $x$ negativen). Frekvenca je potem $440 \cdot 2^x$ hercev:« -/
theorem pod_premico (n : ℝ) (h0 : 0 < n) (h12 : n < 12) :
    440 * (2 : ℝ) ^ (n / 12) < 440 + 440 * n / 12 := by
  have t0 : 0 < n / 12 := by positivity
  have t1 : 0 < 1 - n / 12 := by linarith
  have hc := strictConvexOn_exp.2 (Set.mem_univ 0) (Set.mem_univ (Real.log 2))
    (by have := Real.log_pos (show (1 : ℝ) < 2 by norm_num); exact this.ne) t1 t0 (by ring)
  simp only [smul_eq_mul, mul_zero, zero_add, Real.exp_zero, mul_one,
    Real.exp_log (show (0 : ℝ) < 2 by norm_num)] at hc
  rw [Real.rpow_def_of_pos (by norm_num), mul_comm (Real.log 2) (n / 12)]
  linarith

/-- Predpostavke trditve `pod_premico` se dajo izpolniti (n = 6). -/
example : (0 : ℝ) < 6 ∧ (6 : ℝ) < 12 := by norm_num

/-- Razlaga 1, premisli: 10 oktav pod a¹ je 440·2^(−10) = 440/1024 ≈ 0,43 Hz > 0.
trditev: MAT-SS-2/eksponentna-funkcija#deset-oktav
besedilo: »$440 \cdot 2^{-10} = \dfrac{440}{1024} \approx 0{,}43\,\mathrm{Hz}$« -/
theorem deset_oktav : (440 : ℝ) * (2 : ℝ) ^ (-10 : ℝ) = 440 / 1024 ∧
    (0.425 : ℝ) < 440 / 1024 ∧ (440 : ℝ) / 1024 < 0.435 ∧ (0 : ℝ) < 440 / 1024 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  norm_num [Real.rpow_neg]

/-! ## Razlaga 3: definicija -/

/-- Razlaga 3 (in ustno vprašanje 1): (−2)^(1/2) = √(−2) ni realno število (noben realen x nima
kvadrata −2), pri a = 1 pa je 1ˣ = 1 za vsak x (konstantna funkcija).
trditev: MAT-SS-2/eksponentna-funkcija#zakaj-pogoji
besedilo: »Že $(-2)^{\frac{1}{2}} = \sqrt{-2}$ ni realno število,« -/
theorem zakaj_pogoji : (¬ ∃ x : ℝ, x ^ 2 = -2) ∧ (∀ x : ℝ, (1 : ℝ) ^ x = 1) := by
  refine ⟨?_, fun x => Real.one_rpow x⟩
  rintro ⟨x, hx⟩
  have := sq_nonneg x
  linarith

/-! ## Razlaga 4: tabela -/

/-- Razlaga 4, tabela: 2ˣ in (1/2)ˣ pri x = −3, …, 3.
trditev: MAT-SS-2/eksponentna-funkcija#tabela
besedilo: »Ob povečanju $x$ za $1$ se $2^x$ **podvoji**, $\left(\frac{1}{2}\right)^x$ pa **razpolovi**. Vrednosti so vedno pozitivne, tudi pri negativnih $x$: $2^{-3} = \dfrac{1}{8}$.« -/
theorem tabela :
    (2 : ℝ) ^ (-3 : ℝ) = 1 / 8 ∧ (1 / 2 : ℝ) ^ (-3 : ℝ) = 8 ∧
    (2 : ℝ) ^ (-2 : ℝ) = 1 / 4 ∧ (1 / 2 : ℝ) ^ (-2 : ℝ) = 4 ∧
    (2 : ℝ) ^ (-1 : ℝ) = 1 / 2 ∧ (1 / 2 : ℝ) ^ (-1 : ℝ) = 2 ∧
    (2 : ℝ) ^ (0 : ℝ) = 1 ∧ (1 / 2 : ℝ) ^ (0 : ℝ) = 1 ∧
    (2 : ℝ) ^ (1 : ℝ) = 2 ∧ (1 / 2 : ℝ) ^ (1 : ℝ) = 1 / 2 ∧
    (2 : ℝ) ^ (2 : ℝ) = 4 ∧ (1 / 2 : ℝ) ^ (2 : ℝ) = 1 / 4 ∧
    (2 : ℝ) ^ (3 : ℝ) = 8 ∧ (1 / 2 : ℝ) ^ (3 : ℝ) = 1 / 8 := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_, ?_⟩ <;> norm_num [Real.rpow_neg]

/-- Razlaga 4: ob povečanju x za 1 se 2ˣ podvoji, (1/2)ˣ pa razpolovi; vrednosti so pozitivne.
trditev: MAT-SS-2/eksponentna-funkcija#podvoji
besedilo: »Ob povečanju $x$ za $1$ se $2^x$ **podvoji**, $\left(\frac{1}{2}\right)^x$ pa **razpolovi**. Vrednosti so vedno pozitivne, tudi pri negativnih $x$: $2^{-3} = \dfrac{1}{8}$.« -/
theorem podvoji (x : ℝ) : (2 : ℝ) ^ (x + 1) = 2 * (2 : ℝ) ^ x ∧
    (1 / 2 : ℝ) ^ (x + 1) = (1 / 2 : ℝ) ^ x / 2 ∧ 0 < (2 : ℝ) ^ x ∧ 0 < (1 / 2 : ℝ) ^ x := by
  refine ⟨?_, ?_, Real.rpow_pos_of_pos (by norm_num) x, Real.rpow_pos_of_pos (by norm_num) x⟩
  · rw [Real.rpow_add (by norm_num), Real.rpow_one]; ring
  · rw [Real.rpow_add (by norm_num), Real.rpow_one]; ring

/-! ## Razlaga 6: vpliv osnove -/

/-- Razlaga 6: od x = 1 do x = 2 zraste 2ˣ za 2, 3ˣ za 6, 4ˣ za 12.
trditev: MAT-SS-2/eksponentna-funkcija#vpliv-osnove
besedilo: »Vpliv osnove.** Pri $a > 1$ je graf za $x > 0$ tem strmejši, čim večja je osnova: od $x = 1$ do $x = 2$ zraste $2^x$ za $2$, $3^x$ za $6$, $4^x$ pa za $12$.« -/
theorem vpliv_osnove : (2 : ℝ) ^ (2 : ℝ) - 2 ^ (1 : ℝ) = 2 ∧ (3 : ℝ) ^ (2 : ℝ) - 3 ^ (1 : ℝ) = 6 ∧
    (4 : ℝ) ^ (2 : ℝ) - 4 ^ (1 : ℝ) = 12 := by norm_num

/-- Razlaga 6, premisli: 2^(−1) = 1/2 > 3^(−1) = 1/3; splošno za 0 < a < b: pri x > 0 je aˣ < bˣ,
pri x < 0 pa bˣ < aˣ (levo od osi y je graf z večjo osnovo nižje).
trditev: MAT-SS-2/eksponentna-funkcija#vecja-osnova
besedilo: »Višje je $y = 2^x$, ker je $2^{-1} = \frac{1}{2}$ večje od $3^{-1} = \frac{1}{3}$. Negativni eksponent pomeni deljenje, večja osnova pa deli z večjim številom. Levo od osi $y$ je zato graf z večjo osnovo nižje in se tesneje prilega osi $x$.« -/
theorem vecja_osnova : (2 : ℝ) ^ (-1 : ℝ) = 1 / 2 ∧ (3 : ℝ) ^ (-1 : ℝ) = 1 / 3 ∧
    (1 / 3 : ℝ) < 1 / 2 ∧
    ∀ a b x : ℝ, 0 < a → a < b → (0 < x → a ^ x < b ^ x) ∧ (x < 0 → b ^ x < a ^ x) := by
  refine ⟨by norm_num, by norm_num, by norm_num, fun a b x ha hab => ⟨fun hx =>
    Real.rpow_lt_rpow ha.le hab hx, fun hx => ?_⟩⟩
  have hb : 0 < b := by linarith
  have h := Real.rpow_lt_rpow ha.le hab (show 0 < -x by linarith)
  rw [show x = -(-x) by ring, Real.rpow_neg hb.le, Real.rpow_neg ha.le]
  exact inv_strictAnti₀ (Real.rpow_pos_of_pos ha _) h

/-- Razlaga 6 (slika pri a = 2): stopnici od (−1, 1/2) do (0, 1) in od (0, 1) do (1, 2); pri a = 0,5 je
graf zrcalna slika grafa pri a = 2: 0,5ˣ = 2^(−x).
trditev: MAT-SS-2/eksponentna-funkcija#stopnici
besedilo: »Pod $1$ se obrneta navzdol in graf pada; pri $a = 0{,}5$ je natanko zrcalna slika grafa pri $a = 2$.« -/
theorem stopnici (x : ℝ) : (2 : ℝ) ^ (-1 : ℝ) = 1 / 2 ∧ (2 : ℝ) ^ (0 : ℝ) = 1 ∧ (2 : ℝ) ^ (1 : ℝ) = 2 ∧
    (2 : ℝ) * (1 / 2) = 1 ∧ (0.5 : ℝ) ^ x = (2 : ℝ) ^ (-x) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  rw [Real.rpow_neg (by norm_num), ← Real.inv_rpow (by norm_num)]; norm_num

/-! ## Razlaga 7: zrcaljenje -/

/-- Razlaga 7 (in Povzetek, Ponovitev): (1/a)ˣ = a^(−x) za a > 0; vrednost 2ˣ pri x = 3 je enaka
vrednosti (1/2)ˣ pri x = −3.
trditev: MAT-SS-2/eksponentna-funkcija#zrcaljenje
besedilo: »vrednost $2^x$ pri $x = 3$ je enaka vrednosti $\left(\frac{1}{2}\right)^x$ pri $x = -3$.« -/
theorem zrcaljenje (a x : ℝ) (ha : 0 < a) : (1 / a) ^ x = a ^ (-x) := by
  rw [one_div, Real.inv_rpow ha.le, Real.rpow_neg ha.le]

/-- Predpostavke trditve `zrcaljenje` se dajo izpolniti (a = 2). -/
example : (0 : ℝ) < 2 := by norm_num

/-- Razlaga 7: 2³ = (1/2)^(−3) = 8.
trditev: MAT-SS-2/eksponentna-funkcija#zrcaljenje-primer
besedilo: »$2^{-3} = \frac{1}{8}$« -/
theorem zrcaljenje_primer : (2 : ℝ) ^ (3 : ℝ) = (1 / 2 : ℝ) ^ (-3 : ℝ) := by
  rw [zrcaljenje 2 (-3) (by norm_num), neg_neg]

/-! ## Razlaga 8: število e -/

/-- Razlaga 8: e = 2,71828… (2,71825 < e < 2,71835, torej e ≈ 2,718 in 2 < e < 3); zato za x > 0 leži
eˣ med 2ˣ in 3ˣ, za x < 0 pa med 3ˣ in 2ˣ.
trditev: MAT-SS-2/eksponentna-funkcija#stevilo-e
besedilo: »Ker je $2 < e < 3$, leži njen graf med grafoma $2^x$ in $3^x$.« -/
theorem stevilo_e :
    (2.71825 < Real.exp 1 ∧ Real.exp 1 < 2.71835) ∧ (2.7175 < Real.exp 1 ∧ Real.exp 1 < 2.7185) ∧
    (2 < Real.exp 1 ∧ Real.exp 1 < 3) ∧
    ∀ x : ℝ, (0 < x → (2 : ℝ) ^ x < Real.exp x ∧ Real.exp x < (3 : ℝ) ^ x) ∧
      (x < 0 → (3 : ℝ) ^ x < Real.exp x ∧ Real.exp x < (2 : ℝ) ^ x) := by
  have h1 := Real.exp_one_gt_d9
  have h2 := Real.exp_one_lt_d9
  have he2 : (2 : ℝ) < Real.exp 1 := by linarith
  have he3 : Real.exp 1 < 3 := by linarith
  refine ⟨⟨by linarith, by linarith⟩, ⟨by linarith, by linarith⟩, ⟨he2, he3⟩, fun x => ?_⟩
  have hv := (vecja_osnova).2.2.2
  rw [← Real.exp_one_rpow]
  exact ⟨fun hx => ⟨(hv 2 _ x (by norm_num) he2).1 hx, (hv _ 3 x (by linarith) he3).1 hx⟩,
    fun hx => ⟨(hv _ 3 x (by linarith) he3).2 hx, (hv 2 _ x (by norm_num) he2).2 hx⟩⟩

set_option exponentiation.threshold 700 in
/-- Razlaga 8: (1 + 1/n)ⁿ pri n = 1, 2, 12, 365 je 2; 2,25; ≈ 2,613; ≈ 2,7146 (meja za računanje
velikih potenc je dvignjena, da norm_num izračuna 366³⁶⁵).
trditev: MAT-SS-2/eksponentna-funkcija#obresti-e
besedilo: »Po letu imamo $\left(1 + \frac{1}{n}\right)^n$ €: pri $n = 1, 2, 12, 365$ dobimo $2;\ 2{,}25;\ 2{,}613;\ 2{,}7146$.« -/
theorem obresti_e :
    ((1 : ℝ) + 1 / 1) ^ 1 = 2 ∧ ((1 : ℝ) + 1 / 2) ^ 2 = 2.25 ∧
    (2.6125 < ((1 : ℝ) + 1 / 12) ^ 12 ∧ ((1 : ℝ) + 1 / 12) ^ 12 < 2.6135) ∧
    (2.71455 < ((1 : ℝ) + 1 / 365) ^ 365 ∧ ((1 : ℝ) + 1 / 365) ^ 365 < 2.71465) := by
  norm_num

/-- Razlaga 8: z večanjem n se (1 + 1/n)ⁿ približuje številu e (limita).
trditev: MAT-SS-2/eksponentna-funkcija#limita-e
besedilo: »Z večanjem $n$ se vrednosti približujejo številu $e = 2{,}71828\ldots$.« -/
theorem limita_e :
    Filter.Tendsto (fun n : ℕ => (1 + 1 / (n : ℝ)) ^ n) Filter.atTop (nhds (Real.exp 1)) :=
  Real.tendsto_one_add_div_pow_exp 1

/-! ## Razlaga 9: premiki grafa -/

/-- Razlaga 9 (in Povzetek): za a > 0, a ≠ 1 ima y = a^(x−p) + q zalogo vrednosti (q, ∞) (asimptota
y = q), y = −aˣ zalogo (−∞, 0), y = c·aˣ (c > 0) zalogo (0, ∞) in gre skozi (0, c); graf a^(x−p) je
graf aˣ, premaknjen za p (vrednost pri x + p je vrednost aˣ pri x).
trditev: MAT-SS-2/eksponentna-funkcija#premiki
besedilo: »Graf $y = a^{x-p} + q$: graf $y = a^x$, premaknjen za $p$ po osi $x$ in za $q$ po osi $y$; asimptota $y = q$, zaloga vrednosti $(q, \infty)$.« -/
theorem premiki (a p q c : ℝ) (ha : 0 < a) (ha1 : a ≠ 1) (hc : 0 < c) :
    Set.range (fun x : ℝ => a ^ (x - p) + q) = Set.Ioi q ∧
    Set.range (fun x : ℝ => -a ^ x) = Set.Iio 0 ∧
    Set.range (fun x : ℝ => c * a ^ x) = Set.Ioi 0 ∧ c * a ^ (0 : ℝ) = c ∧
    (∀ x : ℝ, a ^ ((x + p) - p) = a ^ x) := by
  refine ⟨?_, ?_, ?_, by rw [Real.rpow_zero, mul_one], fun x => by rw [add_sub_cancel_right]⟩
  · ext y
    constructor
    · rintro ⟨x, rfl⟩
      show q < a ^ (x - p) + q
      linarith [Real.rpow_pos_of_pos ha (x - p)]
    · intro hy
      have hy' : q < y := hy
      refine ⟨Real.logb a (y - q) + p, ?_⟩
      show a ^ (Real.logb a (y - q) + p - p) + q = y
      rw [add_sub_cancel_right, Real.rpow_logb ha ha1 (by linarith)]; ring
  · ext y
    constructor
    · rintro ⟨x, rfl⟩
      show -a ^ x < 0
      linarith [Real.rpow_pos_of_pos ha x]
    · intro hy
      have hy' : y < 0 := hy
      refine ⟨Real.logb a (-y), ?_⟩
      show -a ^ Real.logb a (-y) = y
      rw [Real.rpow_logb ha ha1 (by linarith)]; ring
  · ext y
    constructor
    · rintro ⟨x, rfl⟩
      show 0 < c * a ^ x
      exact mul_pos hc (Real.rpow_pos_of_pos ha x)
    · intro hy
      have hy' : 0 < y := hy
      refine ⟨Real.logb a (y / c), ?_⟩
      show c * a ^ Real.logb a (y / c) = y
      rw [Real.rpow_logb ha ha1 (div_pos hy' hc)]; field_simp

/-- Predpostavke trditve `premiki` se dajo izpolniti (a = 2, p = 2, q = −2, c = 3). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) ≠ 1 ∧ (0 : ℝ) < 3 := by norm_num

/-- Razlaga 9, slika y = 2^(x−2) − 2: točka (0, 1) gre v (2, −1); edina ničla je x = 3 (2¹ − 2 = 0);
pri q ≥ 0 je 2^(x−p) + q > 0, zato ničle ni.
trditev: MAT-SS-2/eksponentna-funkcija#premik-primer
besedilo: »Slika kaže $y = 2^{x-2} - 2$: točka $(0, 1)$ osnovnega grafa se preseli v $(2, -1)$, asimptota pa z osi $x$ na premico $y = -2$.« -/
theorem premik_primer :
    (2 : ℝ) ^ ((2 : ℝ) - 2) - 2 = -1 ∧ (2 : ℝ) ^ ((3 : ℝ) - 2) - 2 = 0 ∧
    (∀ x : ℝ, (2 : ℝ) ^ (x - 2) - 2 = 0 ↔ x = 3) ∧
    (∀ p q x : ℝ, 0 ≤ q → 0 < (2 : ℝ) ^ (x - p) + q) := by
  refine ⟨by norm_num, by norm_num, fun x => ?_, fun p q x hq => ?_⟩
  · rw [sub_eq_zero, show (2 : ℝ) = (2 : ℝ) ^ (1 : ℝ) from (Real.rpow_one 2).symm]
    rw [← Real.rpow_one 2]
    constructor
    · intro h
      have := (injektivna 2 (by norm_num) (by norm_num) (x - 2) 1).mp (by simpa using h)
      linarith
    · intro h; rw [h]; norm_num
  · linarith [Real.rpow_pos_of_pos (show (0 : ℝ) < 2 by norm_num) (x - p)]

/-- Razlaga 9, simulacija: pri a = 2 in q = −2 gre točka (0, 1) v (0, −1) (asimptota y = −2), pri
p = 1 pa v (1, −1).
trditev: MAT-SS-2/eksponentna-funkcija#simulacija
besedilo: »V simulaciji spodaj (»Eksponentna funkcija«) pri a = 2 premakni drsnik q na $-2$. Opazuj, da se vodoravna asimptota premakne na $y = -2$, točka $(0, 1)$ pa v $(0, -1)$. Napovej, kam se ta točka premakne, če nastaviš še p = 1, in preveri.« -/
theorem simulacija : (2 : ℝ) ^ ((0 : ℝ) - 0) + (-2) = -1 ∧ (2 : ℝ) ^ ((1 : ℝ) - 1) + (-2) = -1 := by
  norm_num

/-! ## Razlaga 10: primerjanje potenc -/

/-- Razlaga 10: pri a > 1 iz x₁ < x₂ sledi a^x₁ < a^x₂, pri 0 < a < 1 pa a^x₁ > a^x₂.
trditev: MAT-SS-2/eksponentna-funkcija#primerjanje
besedilo: »10. Primerjanje potenc.** Ker je funkcija pri $a > 1$ strogo naraščajoča, iz $x_1 < x_2$ sledi $a^{x_1} < a^{x_2}$. Pri $0 < a < 1$ je strogo padajoča, zato iz $x_1 < x_2$ sledi $a^{x_1} > a^{x_2}$. Potence z isto osnovo tako primerjamo brez računanja.« -/
theorem primerjanje (a x₁ x₂ : ℝ) (h : x₁ < x₂) :
    (1 < a → a ^ x₁ < a ^ x₂) ∧ (0 < a → a < 1 → a ^ x₂ < a ^ x₁) :=
  ⟨fun ha => narasca a ha h, fun h0 h1 => pada a h0 h1 h⟩

/-- Predpostavke trditve `primerjanje` se dajo izpolniti (x₁ = 0, x₂ = 1). -/
example : (0 : ℝ) < 1 := by norm_num

/-! ## Razlaga 11: potenčna ali eksponentna rast -/

/-- Razlaga 11: x² proti 2ˣ pri x = 1, 2, 3, 4, 5, 10: 1 < 2, 4 = 4, 9 > 8, 16 = 16, 25 < 32,
100 < 1024; grafa se sekata v (2, 4) in (4, 16).
trditev: MAT-SS-2/eksponentna-funkcija#potencna-eksponentna
besedilo: »Potenčna ali eksponentna rast.** Primerjaj potenčno funkcijo $x^2$ in eksponentno $2^x$ pri $x = 1, 2, 3, 4, 5, 10$: $\;1 < 2,\; 4 = 4,\; 9 > 8,\; 16 = 16,\; 25 < 32,\; 100 < 1024$.« -/
theorem potencna_eksponentna :
    (1 : ℝ) ^ 2 < (2 : ℝ) ^ (1 : ℝ) ∧ (2 : ℝ) ^ 2 = (2 : ℝ) ^ (2 : ℝ) ∧
    (2 : ℝ) ^ (3 : ℝ) < (3 : ℝ) ^ 2 ∧ (4 : ℝ) ^ 2 = (2 : ℝ) ^ (4 : ℝ) ∧
    (5 : ℝ) ^ 2 < (2 : ℝ) ^ (5 : ℝ) ∧ (10 : ℝ) ^ 2 < (2 : ℝ) ^ (10 : ℝ) ∧
    (2 : ℝ) ^ (5 : ℝ) = 32 ∧ (2 : ℝ) ^ (10 : ℝ) = 1024 := by
  norm_num

/-- Razlaga 11: za naravna n ≥ 5 je 2ⁿ > n² (za realne x > 4 glej `presecisca`).
trditev: MAT-SS-2/eksponentna-funkcija#dve-na-n
besedilo: »za $x > 4$ pa je $2^x$ večja.« -/
theorem dve_na_n (n : ℕ) (hn : 5 ≤ n) : n ^ 2 < 2 ^ n := by
  induction n, hn using Nat.le_induction with
  | base => norm_num
  | succ k hk ih =>
    have e : 2 ^ (k + 1) = 2 * 2 ^ k := by ring
    rw [e]
    nlinarith [ih, hk]

/-- Predpostavke trditve `dve_na_n` se dajo izpolniti (n = 5). -/
example : 5 ≤ 5 := le_rfl

/-- Razlaga 11: korak za 1 vrednost 2ˣ podvoji (2^(x+1)/2ˣ = 2), x² pa pomnoži z ((x+1)/x)² (x ≠ 0;
v Leanu velja zapis tudi pri x = 0, ker je x/0 = 0).
trditev: MAT-SS-2/eksponentna-funkcija#razmerji
besedilo: »Razlog: korak za $1$ vrednost $2^x$ vedno podvoji, vrednost $x^2$ pa pomnoži le z $\left(\frac{x+1}{x}\right)^2$, kar je pri velikih $x$ blizu $1$.« -/
theorem razmerji (x : ℝ) :
    (2 : ℝ) ^ (x + 1) / (2 : ℝ) ^ x = 2 ∧ (x + 1) ^ 2 / x ^ 2 = ((x + 1) / x) ^ 2 := by
  refine ⟨?_, by rw [div_pow]⟩
  rw [Real.rpow_add (by norm_num), Real.rpow_one]
  have : (2 : ℝ) ^ x ≠ 0 := (Real.rpow_pos_of_pos (by norm_num) x).ne'
  field_simp

/-- Pomožno (stroga konkavnost ln): za 0 < a < b < c je (c − a)·ln b > (c − b)·ln a + (b − a)·ln c.
pomozno -/
theorem log_tri {a b c : ℝ} (ha : 0 < a) (hab : a < b) (hbc : b < c) :
    (c - b) * Real.log a + (b - a) * Real.log c < (c - a) * Real.log b := by
  have hca : 0 < c - a := by linarith
  have hne : c - a ≠ 0 := hca.ne'
  have h := strictConcaveOn_log_Ioi.2 (Set.mem_Ioi.mpr ha) (Set.mem_Ioi.mpr (by linarith))
    (by linarith : a ≠ c) (div_pos (by linarith : 0 < c - b) hca)
    (div_pos (by linarith : 0 < b - a) hca)
    (by rw [← add_div, show c - b + (b - a) = c - a by ring, div_self hne])
  have hb : ((c - b) / (c - a)) * a + ((b - a) / (c - a)) * c = b := by
    field_simp; ring
  simp only [smul_eq_mul] at h
  rw [hb] at h
  have e : (c - a) * ((c - b) / (c - a) * Real.log a + (b - a) / (c - a) * Real.log c) =
      (c - b) * Real.log a + (b - a) * Real.log c := by field_simp
  rw [← e]
  exact mul_lt_mul_of_pos_left h hca

/-- Predpostavke trditve `log_tri` se dajo izpolniti (a = 2, b = 3, c = 4). -/
example : (0 : ℝ) < 2 ∧ (2 : ℝ) < 3 ∧ (3 : ℝ) < 4 := by norm_num

/-- Razlaga 11: za x > 0 se grafa y = 2ˣ in y = x² sekata le v x = 2 in x = 4 (točki (2, 4) in
(4, 16)), za x > 4 pa je 2ˣ > x². Dokaz: 2ˣ = x² ⟺ 2·ln x = x·ln 2, ln pa je strogo konkavna, zato
tri različne rešitve niso mogoče.
trditev: MAT-SS-2/eksponentna-funkcija#presecisca
besedilo: »Za $x > 0$ se grafa sekata v $(2, 4)$ in $(4, 16)$, za $x > 4$ pa je $2^x$ večja.« -/
theorem presecisca : (∀ x : ℝ, 0 < x → ((2 : ℝ) ^ x = x ^ 2 ↔ x = 2 ∨ x = 4)) ∧
    ∀ x : ℝ, 4 < x → x ^ 2 < (2 : ℝ) ^ x := by
  have hsq : ∀ x : ℝ, 0 < x → x ^ 2 = Real.exp (2 * Real.log x) := by
    intro x hx; rw [two_mul, Real.exp_add, Real.exp_log hx]; ring
  have hpw : ∀ x : ℝ, (2 : ℝ) ^ x = Real.exp (Real.log 2 * x) :=
    fun x => Real.rpow_def_of_pos (by norm_num) x
  have h4 : Real.log 4 = 2 * Real.log 2 := by
    rw [show (4 : ℝ) = 2 ^ 2 by norm_num, Real.log_pow]; push_cast; ring
  have iff_eq : ∀ x : ℝ, 0 < x → ((2 : ℝ) ^ x = x ^ 2 ↔ 2 * Real.log x = Real.log 2 * x) := by
    intro x hx; rw [hpw, hsq x hx, Real.exp_eq_exp]; constructor <;> intro h <;> linarith
  -- tri ničle 2·ln t = t·ln 2 pri 0 < a < b < c niso mogoče
  have tri : ∀ a b c : ℝ, 0 < a → a < b → b < c → 2 * Real.log a = Real.log 2 * a →
      2 * Real.log b = Real.log 2 * b → 2 * Real.log c = Real.log 2 * c → False := by
    intro a b c ha hab hbc ea eb ec
    have k := log_tri ha hab hbc
    have e : (c - a) * Real.log b - ((c - b) * Real.log a + (b - a) * Real.log c) = 0 := by
      linear_combination (c - a) / 2 * eb - (c - b) / 2 * ea - (b - a) / 2 * ec
    linarith
  have e2 : 2 * Real.log 2 = Real.log 2 * 2 := by ring
  have e4 : 2 * Real.log 4 = Real.log 2 * 4 := by rw [h4]; ring
  refine ⟨fun x hx => ⟨fun h => ?_, ?_⟩, fun x hx => ?_⟩
  · have ex := (iff_eq x hx).mp h
    rcases lt_trichotomy x 2 with h1 | h1 | h1
    · exact (tri x 2 4 hx h1 (by norm_num) ex e2 e4).elim
    · exact Or.inl h1
    · rcases lt_trichotomy x 4 with h2 | h2 | h2
      · exact (tri 2 x 4 (by norm_num) h1 h2 e2 ex e4).elim
      · exact Or.inr h2
      · exact (tri 2 4 x (by norm_num) (by norm_num) h2 e2 e4 ex).elim
  · rintro (h | h) <;> subst h <;> norm_num
  · have hx0 : 0 < x := by linarith
    have k := log_tri (show (0 : ℝ) < 2 by norm_num) (show (2 : ℝ) < 4 by norm_num) hx
    rw [hsq x hx0, hpw, Real.exp_lt_exp]
    have e : (x - 2) * Real.log 4 - (x - 4) * Real.log 2 = Real.log 2 * x := by rw [h4]; ring
    linarith

/-- Razlaga 11 (splošno): pri a > 1 aˣ sčasoma prehiti vsako potenco xⁿ (xⁿ = o(aˣ)).
trditev: MAT-SS-2/eksponentna-funkcija#prehiti-vsako
besedilo: »Splošno: pri $a > 1$ funkcija $a^x$ prej ali slej preseže vsako potenco $x^n$, včasih šele pozno: $1{,}1^x$ prehiti $x^{10}$ pri $x \approx 685$.« -/
theorem prehiti_vsako (a : ℝ) (ha : 1 < a) (n : ℕ) :
    Asymptotics.IsLittleO Filter.atTop (fun x : ℝ => x ^ n) (fun x : ℝ => a ^ x) := by
  have h := isLittleO_pow_exp_pos_mul_atTop n (Real.log_pos ha)
  refine h.congr_right fun x => ?_
  rw [Real.rpow_def_of_pos (by linarith)]

/-- Predpostavke trditve `prehiti_vsako` se dajo izpolniti (a = 1,1). -/
example : (1 : ℝ) < 1.1 := by norm_num

set_option exponentiation.threshold 700 in
/-- Razlaga 11 in RAČUN: 1,1⁶⁸⁵/685¹⁰ ≈ 0,993 < 1 in 1,1⁶⁸⁶/686¹⁰ ≈ 1,077 > 1.
trditev: MAT-SS-2/eksponentna-funkcija#prehiti
besedilo: »$1{,}1^x$ prehiti $x^{10}$ pri $x \approx 685$.« -/
theorem prehiti :
    ((0.9925 : ℝ) < 1.1 ^ 685 / 685 ^ 10 ∧ (1.1 : ℝ) ^ 685 / 685 ^ 10 < 0.9935) ∧
    ((1.0765 : ℝ) < 1.1 ^ 686 / 686 ^ 10 ∧ (1.1 : ℝ) ^ 686 / 686 ^ 10 < 1.0775) := by
  norm_num

/-! ## Primer 1 -/

/-- Primer 1: f(x) = 3ˣ; f(−2) = 1/3² = 1/9, f(0) = 1, f(1/2) = √3 ≈ 1,73, f(2) = 9; 1/9 < 1 < 1,73 < 9;
od x = 0 do x = 2 zraste za 9 − 1 = 8, to je na 9-kratnik (9 = 3²); vsak korak za 2 pomnoži z 9
(tudi od 1/9 do 1).
trditev: MAT-SS-2/eksponentna-funkcija#primer1
besedilo: »Odgovor: vrednosti so $\dfrac{1}{9}$, $1$, $\sqrt{3} \approx 1{,}73$ in $9$. Funkcija narašča in seka os $y$ v $(0, 1)$. Od $x = 0$ do $x = 2$ zraste za $8$, to je $9$-krat.« -/
theorem primer1 :
    (3 : ℝ) ^ (-2 : ℝ) = 1 / 3 ^ 2 ∧ (1 : ℝ) / 3 ^ 2 = 1 / 9 ∧ (3 : ℝ) ^ (0 : ℝ) = 1 ∧
    (3 : ℝ) ^ (1 / 2 : ℝ) = Real.sqrt 3 ∧ (1.725 < Real.sqrt 3 ∧ Real.sqrt 3 < 1.735) ∧
    (3 : ℝ) ^ (2 : ℝ) = 9 ∧ ((1 : ℝ) / 9 < 1 ∧ (1 : ℝ) < 1.73 ∧ (1.73 : ℝ) < 9) ∧
    (9 : ℝ) - 1 = 8 ∧ (9 : ℝ) / 1 = 3 ^ 2 ∧ (∀ x : ℝ, (3 : ℝ) ^ (x + 2) = 9 * (3 : ℝ) ^ x) ∧
    (1 : ℝ) / 9 * 9 = 1 := by
  have hs : 1.725 < (3 : ℝ) ^ (1 / 2 : ℝ) ∧ (3 : ℝ) ^ (1 / 2 : ℝ) < 1.735 :=
    koren_med (p := 1) (q := 2) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  rw [← Real.sqrt_eq_rpow] at hs
  refine ⟨by norm_num [Real.rpow_neg], by norm_num, by norm_num, (Real.sqrt_eq_rpow 3).symm, hs,
    by norm_num, by norm_num, by norm_num, by norm_num, fun x => ?_, by norm_num⟩
  rw [Real.rpow_add (by norm_num)]; norm_num; ring

/-- Primer 1: osnova 3 > 1, zato je f(x) = 3ˣ strogo naraščajoča in seka os y v (0, 1).
trditev: MAT-SS-2/eksponentna-funkcija#primer1-narasca
besedilo: »Odgovor: vrednosti so $\dfrac{1}{9}$, $1$, $\sqrt{3} \approx 1{,}73$ in $9$. Funkcija narašča in seka os $y$ v $(0, 1)$. Od $x = 0$ do $x = 2$ zraste za $8$, to je $9$-krat.« -/
theorem primer1_narasca : StrictMono (fun x : ℝ => (3 : ℝ) ^ x) ∧ (3 : ℝ) ^ (0 : ℝ) = 1 :=
  ⟨narasca 3 (by norm_num), by norm_num⟩

/-! ## Primer 2 -/

/-- Primer 2: a) 2^0,4 < 2^0,7; b) 0,3^(−1,2) > 0,3^(−0,8); c) (1/2)^(−0,3) = 2^0,3 > 2^0,2.
trditev: MAT-SS-2/eksponentna-funkcija#primer2
besedilo: »Brez računala ugotovi, katero število je večje: a) $2^{0{,}7}$ ali $2^{0{,}4}$; b) $0{,}3^{-1{,}2}$ ali $0{,}3^{-0{,}8}$; c) $\left(\dfrac{1}{2}\right)^{-0{,}3}$ ali $2^{0{,}2}$.« -/
theorem primer2 :
    (2 : ℝ) ^ (0.4 : ℝ) < (2 : ℝ) ^ (0.7 : ℝ) ∧
    (0.3 : ℝ) ^ (-0.8 : ℝ) < (0.3 : ℝ) ^ (-1.2 : ℝ) ∧
    (1 / 2 : ℝ) ^ (-0.3 : ℝ) = (2 : ℝ) ^ (0.3 : ℝ) ∧ (2 : ℝ) ^ (0.2 : ℝ) < (2 : ℝ) ^ (0.3 : ℝ) := by
  refine ⟨narasca 2 (by norm_num) (by norm_num), pada 0.3 (by norm_num) (by norm_num) (by norm_num),
    ?_, narasca 2 (by norm_num) (by norm_num)⟩
  rw [zrcaljenje 2 (-0.3) (by norm_num), neg_neg]

/-- Primer 2, preizkus: 2^0,7 ≈ 1,62, 2^0,4 ≈ 1,32, 0,3^(−1,2) ≈ 4,24, 0,3^(−0,8) ≈ 2,62,
2^0,3 ≈ 1,23, 2^0,2 ≈ 1,15.
trditev: MAT-SS-2/eksponentna-funkcija#primer2-preizkus
besedilo: »Preizkus (z računalom, le za kontrolo): $2^{0{,}7} \approx 1{,}62 > 2^{0{,}4} \approx 1{,}32$; $0{,}3^{-1{,}2} \approx 4{,}24 > 0{,}3^{-0{,}8} \approx 2{,}62$; $2^{0{,}3} \approx 1{,}23 > 2^{0{,}2} \approx 1{,}15$.« -/
theorem primer2_preizkus :
    (1.615 < (2 : ℝ) ^ (0.7 : ℝ) ∧ (2 : ℝ) ^ (0.7 : ℝ) < 1.625) ∧
    (1.315 < (2 : ℝ) ^ (0.4 : ℝ) ∧ (2 : ℝ) ^ (0.4 : ℝ) < 1.325) ∧
    (4.235 < (0.3 : ℝ) ^ (-1.2 : ℝ) ∧ (0.3 : ℝ) ^ (-1.2 : ℝ) < 4.245) ∧
    (2.615 < (0.3 : ℝ) ^ (-0.8 : ℝ) ∧ (0.3 : ℝ) ^ (-0.8 : ℝ) < 2.625) ∧
    (1.225 < (2 : ℝ) ^ (0.3 : ℝ) ∧ (2 : ℝ) ^ (0.3 : ℝ) < 1.235) ∧
    (1.145 < (2 : ℝ) ^ (0.2 : ℝ) ∧ (2 : ℝ) ^ (0.2 : ℝ) < 1.155) := by
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_⟩
  · exact koren_med (p := 7) (q := 10) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  · exact koren_med (p := 2) (q := 5) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  · exact koren_med (p := -6) (q := 5) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  · exact koren_med (p := -4) (q := 5) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  · exact koren_med (p := 3) (q := 10) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  · exact koren_med (p := 1) (q := 5) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)

/-! ## Primer 3: prečke na kitari -/

/-- Primer 3 a): 2^(−n/12) = (2^(−1/12))ⁿ (vsak realen n), 2^(−1/12) ≈ 0,9439, zato L(n) = 650·2^(−n/12)
strogo pada; vsaka prečka skrajša za 1 − 2^(−1/12) ≈ 5,6 %.
trditev: MAT-SS-2/eksponentna-funkcija#primer3a
besedilo: »Osnova je med $0$ in $1$, zato $L$ strogo pada. Vsaka prečka nihajoči del **pomnoži** z $0{,}9439$, torej ga skrajša za približno $5{,}6\,\%$.« -/
theorem primer3a :
    (∀ n : ℝ, (2 : ℝ) ^ (-n / 12) = ((2 : ℝ) ^ (-1 / 12 : ℝ)) ^ n) ∧
    (0.94385 < (2 : ℝ) ^ (-1 / 12 : ℝ) ∧ (2 : ℝ) ^ (-1 / 12 : ℝ) < 0.94395) ∧
    StrictAnti (fun n : ℝ => 650 * (2 : ℝ) ^ (-n / 12)) ∧
    (0.0555 < 1 - (2 : ℝ) ^ (-1 / 12 : ℝ) ∧ 1 - (2 : ℝ) ^ (-1 / 12 : ℝ) < 0.0565) := by
  have hb : 0.94385 < (2 : ℝ) ^ (-1 / 12 : ℝ) ∧ (2 : ℝ) ^ (-1 / 12 : ℝ) < 0.94395 :=
    koren_med (p := -1) (q := 12) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  refine ⟨fun n => ?_, hb, fun x y h => ?_, ⟨by linarith [hb.2], by linarith [hb.1]⟩⟩
  · rw [← Real.rpow_mul (by norm_num)]; congr 1; ring
  · have : (2 : ℝ) ^ (-y / 12) < (2 : ℝ) ^ (-x / 12) := narasca 2 (by norm_num) (by linarith)
    show 650 * (2 : ℝ) ^ (-y / 12) < 650 * (2 : ℝ) ^ (-x / 12)
    linarith

/-- Primer 3 b): 2^(−5/12) ≈ 0,74915, 650·0,74915 ≈ 486,95 (tudi 650·2^(−5/12) ≈ 486,95), razdalja
prečke od sedla 650 − 486,95 = 163,05 mm (≈ 163 mm).
trditev: MAT-SS-2/eksponentna-funkcija#primer3b
besedilo: »b) $L(5) = 650 \cdot 2^{-\frac{5}{12}}$. Z računalom: $650 \cdot 0{,}74915 \approx 486{,}95$, torej niha še $486{,}95\,\mathrm{mm}$ strune.« -/
theorem primer3b :
    (0.749145 < (2 : ℝ) ^ (-5 / 12 : ℝ) ∧ (2 : ℝ) ^ (-5 / 12 : ℝ) < 0.749155) ∧
    (486.945 < (650 : ℝ) * 0.74915 ∧ (650 : ℝ) * 0.74915 < 486.955) ∧
    (486.945 < 650 * (2 : ℝ) ^ (-5 / 12 : ℝ) ∧ 650 * (2 : ℝ) ^ (-5 / 12 : ℝ) < 486.955) ∧
    (650 : ℝ) - 486.95 = 163.05 := by
  have hb : 486.945 / 650 < (2 : ℝ) ^ (-5 / 12 : ℝ) ∧ (2 : ℝ) ^ (-5 / 12 : ℝ) < 486.955 / 650 :=
    koren_med (p := -5) (q := 12) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  have hc : 0.749145 < (2 : ℝ) ^ (-5 / 12 : ℝ) ∧ (2 : ℝ) ^ (-5 / 12 : ℝ) < 0.749155 :=
    koren_med (p := -5) (q := 12) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  exact ⟨hc, by norm_num, ⟨by linarith [hb.1], by linarith [hb.2]⟩, by norm_num⟩

/-- Primer 3 c): 325 = 650·1/2 = 650·2^(−1); za realen n je 650·2^(−n/12) = 325 natanko pri n = 12.
trditev: MAT-SS-2/eksponentna-funkcija#primer3c
besedilo: »Ker je $325 = 650 \cdot \dfrac{1}{2} = 650 \cdot 2^{-1}$, mora biti eksponent $-\dfrac{n}{12}$ enak $-1$, torej $n = 12$.« -/
theorem primer3c (n : ℝ) : 650 * (2 : ℝ) ^ (-n / 12) = 325 ↔ n = 12 := by
  calc 650 * (2 : ℝ) ^ (-n / 12) = 325 ↔ (2 : ℝ) ^ (-n / 12) = (2 : ℝ) ^ (-1 : ℝ) := by
        rw [show (2 : ℝ) ^ (-1 : ℝ) = 1 / 2 by norm_num]
        constructor <;> intro h <;> linarith
    _ ↔ -n / 12 = -1 := injektivna 2 (by norm_num) (by norm_num) _ _
    _ ↔ n = 12 := by constructor <;> intro h <;> linarith

/-- Primer 3 d): L(1) ≈ 613,52, prvi razmik 650 − 613,52 = 36,48; L(11) ≈ 344,33, razmik med 11. in 12.
prečko 344,33 − 325 = 19,33 (L(12) = 325).
trditev: MAT-SS-2/eksponentna-funkcija#primer3d
besedilo: »Ta dolžina pada, zato padajo tudi razmiki: prvi meri $650 - 613{,}52 = 36{,}48\,\mathrm{mm}$, razmik med $11.$ in $12.$ prečko pa le še $344{,}33 - 325 = 19{,}33\,\mathrm{mm}$.« -/
theorem primer3d :
    (613.515 < 650 * (2 : ℝ) ^ (-1 / 12 : ℝ) ∧ 650 * (2 : ℝ) ^ (-1 / 12 : ℝ) < 613.525) ∧
    (650 : ℝ) - 613.52 = 36.48 ∧
    (344.325 < 650 * (2 : ℝ) ^ (-11 / 12 : ℝ) ∧ 650 * (2 : ℝ) ^ (-11 / 12 : ℝ) < 344.335) ∧
    650 * (2 : ℝ) ^ (-12 / 12 : ℝ) = 325 ∧ (344.33 : ℝ) - 325 = 19.33 := by
  have h1 : 613.515 / 650 < (2 : ℝ) ^ (-1 / 12 : ℝ) ∧ (2 : ℝ) ^ (-1 / 12 : ℝ) < 613.525 / 650 :=
    koren_med (p := -1) (q := 12) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  have h11 : 344.325 / 650 < (2 : ℝ) ^ (-11 / 12 : ℝ) ∧ (2 : ℝ) ^ (-11 / 12 : ℝ) < 344.335 / 650 :=
    koren_med (p := -11) (q := 12) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  exact ⟨⟨by linarith [h1.1], by linarith [h1.2]⟩, by norm_num,
    ⟨by linarith [h11.1], by linarith [h11.2]⟩, by norm_num, by norm_num⟩

/-- Primer 3 d) (splošno): razmik med n-to in (n+1)-to prečko L(n) − L(n+1) je (1 − 2^(−1/12))·L(n),
to je približno 5,6 % (0,0561 < 1 − 2^(−1/12) < 0,0562) dolžine L(n) = 650·2^(−n/12); ker L pada,
razmiki strogo padajo.
trditev: MAT-SS-2/eksponentna-funkcija#primer3d-razmiki
besedilo: »d) Vsak razmik je približno $5{,}6\,\%$ dolžine, ki še niha. Ta dolžina pada, zato padajo tudi razmiki: prvi meri $650 - 613{,}52 = 36{,}48\,\mathrm{mm}$, razmik med $11.$ in $12.$ prečko pa le še $344{,}33 - 325 = 19{,}33\,\mathrm{mm}$.« -/
theorem primer3d_razmiki :
    (∀ n : ℝ, 650 * (2 : ℝ) ^ (-n / 12) - 650 * (2 : ℝ) ^ (-(n + 1) / 12) =
      (1 - (2 : ℝ) ^ (-1 / 12 : ℝ)) * (650 * (2 : ℝ) ^ (-n / 12))) ∧
    (0.0561 < 1 - (2 : ℝ) ^ (-1 / 12 : ℝ) ∧ 1 - (2 : ℝ) ^ (-1 / 12 : ℝ) < 0.0562) ∧
    StrictAnti fun n : ℝ => 650 * (2 : ℝ) ^ (-n / 12) - 650 * (2 : ℝ) ^ (-(n + 1) / 12) := by
  have h1 : 1 - 0.0562 < (2 : ℝ) ^ (-1 / 12 : ℝ) ∧ (2 : ℝ) ^ (-1 / 12 : ℝ) < 1 - 0.0561 :=
    koren_med (p := -1) (q := 12) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  have hr : ∀ n : ℝ, 650 * (2 : ℝ) ^ (-n / 12) - 650 * (2 : ℝ) ^ (-(n + 1) / 12) =
      (1 - (2 : ℝ) ^ (-1 / 12 : ℝ)) * (650 * (2 : ℝ) ^ (-n / 12)) := by
    intro n
    rw [show -(n + 1) / 12 = -n / 12 + (-1 / 12) by ring, Real.rpow_add (by norm_num)]
    ring
  refine ⟨hr, ⟨by linarith [h1.2], by linarith [h1.1]⟩, fun u v huv => ?_⟩
  simp only [hr]
  have hd := narasca 2 (by norm_num) (show -v / 12 < -u / 12 by linarith)
  have hc : 0 < 1 - (2 : ℝ) ^ (-1 / 12 : ℝ) := by linarith [h1.2]
  simp only at hd
  nlinarith

/-! ## Primer 4 -/

/-- Primer 4: g(x) = 2^(x+1) − 4 = 2^(x−(−1)) − 4; D = ℝ, Z = (−4, ∞), g(0) = 2¹ − 4 = −2;
g(1) = 2² − 4 = 0 je edina ničla; g(x) < 0 ⟺ x < 1; g(−1) = 2⁰ − 4 = −3, g(2) = 2³ − 4 = 4.
trditev: MAT-SS-2/eksponentna-funkcija#primer4
besedilo: »Levo od ničle so vrednosti manjše, $g(-1) = 2^0 - 4 = -3 < 0$, desno večje, $g(2) = 2^3 - 4 = 4 > 0$.« -/
theorem primer4 :
    (∀ x : ℝ, (2 : ℝ) ^ (x + 1) - 4 = (2 : ℝ) ^ (x - (-1)) - 4) ∧
    Set.range (fun x : ℝ => (2 : ℝ) ^ (x + 1) - 4) = Set.Ioi (-4) ∧
    (2 : ℝ) ^ ((0 : ℝ) + 1) - 4 = -2 ∧ (2 : ℝ) ^ ((1 : ℝ) + 1) - 4 = 0 ∧
    (∀ x : ℝ, (2 : ℝ) ^ (x + 1) - 4 = 0 ↔ x = 1) ∧
    (∀ x : ℝ, (2 : ℝ) ^ (x + 1) - 4 < 0 ↔ x < 1) ∧
    (2 : ℝ) ^ ((-1 : ℝ) + 1) - 4 = -3 ∧ (2 : ℝ) ^ ((2 : ℝ) + 1) - 4 = 4 := by
  have h4 : (4 : ℝ) = (2 : ℝ) ^ (2 : ℝ) := by norm_num
  refine ⟨fun x => by rw [sub_neg_eq_add], ?_, by norm_num, by norm_num, fun x => ?_, fun x => ?_,
    by norm_num, by norm_num⟩
  · have h := (premiki 2 (-1) (-4) 1 (by norm_num) (by norm_num) (by norm_num)).1
    simpa [sub_neg_eq_add, ← sub_eq_add_neg] using h
  · rw [sub_eq_zero, h4, injektivna 2 (by norm_num) (by norm_num)]
    constructor <;> intro h <;> linarith
  · rw [sub_neg, h4, Real.rpow_lt_rpow_left_iff (by norm_num)]
    constructor <;> intro h <;> linarith

/-! ## Pogoste napake -/

/-- Pogoste napake: 2³ = 8, 3² = 9, 2¹⁰ = 1024, 10² = 100; 2^(−3) = 1/8 ≠ −8; 2^(x−3) = 1 natanko pri
x = 3; 0,5³ = 0,125 < 0,5² = 0,25; 8·0,5ˣ je padajoča.
trditev: MAT-SS-2/eksponentna-funkcija#napake
besedilo: »Napačna smer pri osnovi, manjši od $1$.** Pri $0 < a < 1$ funkcija pada, zato večji eksponent da manjšo vrednost: $0{,}5^3 = 0{,}125 < 0{,}5^2 = 0{,}25$. O smeri odloča le osnova, ne faktor pred potenco: $8 \cdot 0{,}5^x$ pada, čeprav je $8 > 1$.« -/
theorem napake :
    (2 : ℝ) ^ (3 : ℝ) = 8 ∧ (3 : ℝ) ^ 2 = 9 ∧ (2 : ℝ) ^ (10 : ℝ) = 1024 ∧ (10 : ℝ) ^ 2 = 100 ∧
    (2 : ℝ) ^ (-3 : ℝ) = 1 / 8 ∧ (1 / 8 : ℝ) ≠ -8 ∧
    (∀ x : ℝ, (2 : ℝ) ^ (x - 3) = 1 ↔ x = 3) ∧
    (0.5 : ℝ) ^ (3 : ℝ) = 0.125 ∧ (0.5 : ℝ) ^ (2 : ℝ) = 0.25 ∧ (0.125 : ℝ) < 0.25 ∧
    StrictAnti (fun x : ℝ => 8 * (0.5 : ℝ) ^ x) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num [Real.rpow_neg],
    by norm_num, fun x => ?_, by norm_num, by norm_num, by norm_num, fun x y h => ?_⟩
  · rw [show (1 : ℝ) = (2 : ℝ) ^ (0 : ℝ) by norm_num, injektivna 2 (by norm_num) (by norm_num)]
    constructor <;> intro h <;> linarith
  · have := pada 0.5 (by norm_num) (by norm_num) h
    show 8 * (0.5 : ℝ) ^ y < 8 * (0.5 : ℝ) ^ x
    linarith

/-! ## Za maturo -/

/-- Za maturo, naloga 1: za c > 0, a > 0 iz c·a^(−1) = 12 in c·a = 3 sledi a² = (c·a)/(c·a^(−1)) = 3/12
= 1/4; rešitev je natanko a = 1/2, c = 6 (preizkus 6·(1/2)^(−1) = 12).
trditev: MAT-SS-2/eksponentna-funkcija#matura1
besedilo: »Ker je $a > 0$, je $a = \dfrac{1}{2}$. Iz $c \cdot \dfrac{1}{2} = 3$ sledi $c = 6$. Preizkus: $6 \cdot \left(\dfrac{1}{2}\right)^{-1} = 6 \cdot 2 = 12$.« -/
theorem matura1 (a c : ℝ) (ha : 0 < a) (hc : 0 < c) :
    (c * a ^ (-1 : ℝ) = 12 ∧ c * a = 3) ↔ (a = 1 / 2 ∧ c = 6) := by
  rw [Real.rpow_neg_one]
  constructor
  · rintro ⟨h1, h2⟩
    have hk : (c * a) / (c * a⁻¹) = a ^ 2 := by field_simp
    have hsq : a ^ 2 = 3 / 12 := by rw [← hk, h1, h2]
    have hsq' : (a - 1 / 2) * (a + 1 / 2) = 0 := by nlinarith
    rcases mul_eq_zero.mp hsq' with h | h
    · have ha2 : a = 1 / 2 := by linarith
      refine ⟨ha2, ?_⟩
      rw [ha2] at h2; linarith
    · linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Predpostavke trditve `matura1` se dajo izpolniti (a = 1/2, c = 6). -/
example : (0 : ℝ) < 1 / 2 ∧ (0 : ℝ) < 6 := by norm_num

/-- Za maturo, naloga 1 in RAČUN: 3/12 = 1/4, 3/(1/2) = 6, 6·(1/2)^(−1) = 12; f(x) = 6·(1/2)ˣ pada.
trditev: MAT-SS-2/eksponentna-funkcija#matura1-racun
besedilo: »Ker je $a > 0$, je $a = \dfrac{1}{2}$. Iz $c \cdot \dfrac{1}{2} = 3$ sledi $c = 6$. Preizkus: $6 \cdot \left(\dfrac{1}{2}\right)^{-1} = 6 \cdot 2 = 12$.« -/
theorem matura1_racun : (3 : ℝ) / 12 = 1 / 4 ∧ (3 : ℝ) / (1 / 2) = 6 ∧ 6 * (1 / 2 : ℝ) ^ (-1 : ℝ) = 12 ∧
    StrictAnti (fun x : ℝ => 6 * (1 / 2 : ℝ) ^ x) := by
  refine ⟨by norm_num, by norm_num, by norm_num, fun x y h => ?_⟩
  have := pada (1 / 2) (by norm_num) (by norm_num) h
  show 6 * (1 / 2 : ℝ) ^ y < 6 * (1 / 2 : ℝ) ^ x
  linarith

/-- Za maturo, naloga 2 a), b), d) in RAČUN: faktor 1 − 0,15 = 0,85; m(3) = 400·0,85³ = 400·0,614125
= 245,65 ≈ 246; m(4) ≈ 208,80, m(5) ≈ 177,48; 0,85² = 0,7225, 1 − 0,7225 = 0,2775 (27,75 % < 30 %).
trditev: MAT-SS-2/eksponentna-funkcija#matura2
besedilo: »b) $m(3) = 400 \cdot 0{,}85^3 = 400 \cdot 0{,}614125 = 245{,}65$, zaokroženo $246\,\mathrm{mg}$.« -/
theorem matura2 :
    (1 : ℝ) - 0.15 = 0.85 ∧ (0.85 : ℝ) ^ (3 : ℝ) = 0.614125 ∧ (400 : ℝ) * 0.614125 = 245.65 ∧
    ((245.5 : ℝ) < 245.65 ∧ (245.65 : ℝ) < 246.5) ∧
    ((208.795 : ℝ) < 400 * (0.85 : ℝ) ^ (4 : ℝ) ∧ 400 * (0.85 : ℝ) ^ (4 : ℝ) < 208.805) ∧
    ((177.475 : ℝ) < 400 * (0.85 : ℝ) ^ (5 : ℝ) ∧ 400 * (0.85 : ℝ) ^ (5 : ℝ) < 177.485) ∧
    (0.85 : ℝ) ^ (2 : ℝ) = 0.7225 ∧ (1 : ℝ) - 0.85 ^ 2 = 0.2775 ∧ (27.75 : ℝ) < 2 * 15 := by
  norm_num

/-- Za maturo, naloga 2 c): m strogo pada; v celih urah je 400·0,85ⁿ < 200 natanko za n ≥ 5 (do četrte
ure je vsaj 400·0,85⁴ ≈ 208,8).
trditev: MAT-SS-2/eksponentna-funkcija#matura2c
besedilo: »c) Osnova $0{,}85$ je med $0$ in $1$, zato $m$ strogo pada. Izračunamo zaporedne vrednosti: $m(4) = 400 \cdot 0{,}85^4 \approx 208{,}80\,\mathrm{mg}$ in $m(5) = 400 \cdot 0{,}85^5 \approx 177{,}48\,\mathrm{mg}$.« -/
theorem matura2c :
    StrictAnti (fun t : ℝ => 400 * (0.85 : ℝ) ^ t) ∧
    ∀ n : ℕ, (400 : ℝ) * 0.85 ^ n < 200 ↔ 5 ≤ n := by
  refine ⟨fun x y h => ?_, fun n => ?_⟩
  · have := pada 0.85 (by norm_num) (by norm_num) h
    show 400 * (0.85 : ℝ) ^ y < 400 * (0.85 : ℝ) ^ x
    linarith
  · have h4 : (0.85 : ℝ) ^ 4 = 0.52200625 := by norm_num
    have h5 : (0.85 : ℝ) ^ 5 = 0.4437053125 := by norm_num
    constructor
    · intro h
      by_contra hn
      have : (0.85 : ℝ) ^ 4 ≤ 0.85 ^ n :=
        pow_le_pow_of_le_one (by norm_num) (by norm_num) (by omega)
      linarith
    · intro hn
      have : (0.85 : ℝ) ^ n ≤ 0.85 ^ 5 := pow_le_pow_of_le_one (by norm_num) (by norm_num) hn
      linarith

/-- Za maturo, naloga 3 a), b): f(x) = 2^(x−1) + 1 ima zalogo vrednosti (1, ∞) (asimptota y = 1),
f(0) = 2^(−1) + 1 = 3/2, ničel nima (f(x) > 1 > 0).
trditev: MAT-SS-2/eksponentna-funkcija#matura3ab
besedilo: »Odgovor: a) $D_f = \mathbb{R}$, $Z_f = (1, \infty)$, asimptota $y = 1$; b) $\left(0, \dfrac{3}{2}\right)$, ničel ni, ker je $f(x) > 1$; d) na intervalu $[-2, 3]$ velja $f(x) \le g(x)$ natanko za $x \in [1, 2]$; e) $h(x) > f(x)$, ker je $e > 2$ in $x - 1 > 0$.« -/
theorem matura3ab :
    Set.range (fun x : ℝ => (2 : ℝ) ^ (x - 1) + 1) = Set.Ioi 1 ∧
    (2 : ℝ) ^ ((0 : ℝ) - 1) + 1 = 3 / 2 ∧ (∀ x : ℝ, 0 < (2 : ℝ) ^ (x - 1) + 1) := by
  refine ⟨(premiki 2 1 1 1 (by norm_num) (by norm_num) (by norm_num)).1, by norm_num, fun x => ?_⟩
  linarith [Real.rpow_pos_of_pos (show (0 : ℝ) < 2 by norm_num) (x - 1)]

/-- Za maturo, naloga 3 c) in RAČUN: točke grafa f: (−2, 9/8), (−1, 5/4), (0, 3/2), (1, 2), (2, 3),
(3, 5); premica g(x) = x + 1 gre skozi (−1, 0) in (0, 1).
trditev: MAT-SS-2/eksponentna-funkcija#matura3c
besedilo: »c) Točke grafa $f$: $\left(-2, \dfrac{9}{8}\right)$, $\left(-1, \dfrac{5}{4}\right)$, $\left(0, \dfrac{3}{2}\right)$, $(1, 2)$, $(2, 3)$, $(3, 5)$; graf se na levi približuje asimptoti $y = 1$. Graf $g$ je premica skozi $(-1, 0)$ in $(0, 1)$.« -/
theorem matura3c :
    (2 : ℝ) ^ ((-2 : ℝ) - 1) + 1 = 9 / 8 ∧ (2 : ℝ) ^ ((-1 : ℝ) - 1) + 1 = 5 / 4 ∧
    (2 : ℝ) ^ ((0 : ℝ) - 1) + 1 = 3 / 2 ∧ (2 : ℝ) ^ ((1 : ℝ) - 1) + 1 = 2 ∧
    (2 : ℝ) ^ ((2 : ℝ) - 1) + 1 = 3 ∧ (2 : ℝ) ^ ((3 : ℝ) - 1) + 1 = 5 ∧
    (-1 : ℝ) + 1 = 0 ∧ (0 : ℝ) + 1 = 1 := by
  norm_num [Real.rpow_neg]

/-- Pomožno: za t < 0 in t > 1 je 2ᵗ > 1 + t, za 0 ≤ t ≤ 1 pa 2ᵗ ≤ 1 + t (konveksnost eksponentne
funkcije in ocena eᵘ ≥ 1 + u).
pomozno -/
theorem dve_na_t (t : ℝ) : (t < 0 → 1 + t < (2 : ℝ) ^ t) ∧ (1 < t → 1 + t < (2 : ℝ) ^ t) ∧
    (0 ≤ t → t ≤ 1 → (2 : ℝ) ^ t ≤ 1 + t) := by
  have hl1 := Real.log_two_gt_d9
  have hl2 := Real.log_two_lt_d9
  have hdef : ∀ s : ℝ, (2 : ℝ) ^ s = Real.exp (Real.log 2 * s) :=
    fun s => Real.rpow_def_of_pos (by norm_num) s
  refine ⟨fun ht => ?_, fun ht => ?_, fun h0 h1 => ?_⟩
  · rw [hdef]
    have := Real.add_one_le_exp (Real.log 2 * t)
    nlinarith
  · rw [show t = (t - 1) + 1 by ring, Real.rpow_add (by norm_num), Real.rpow_one, hdef]
    have := Real.add_one_le_exp (Real.log 2 * (t - 1))
    nlinarith
  · have hc := convexOn_exp.2 (Set.mem_univ 0) (Set.mem_univ (Real.log 2))
      (show (0 : ℝ) ≤ 1 - t by linarith) h0 (by ring)
    simp only [smul_eq_mul, mul_zero, zero_add, Real.exp_zero, mul_one,
      Real.exp_log (show (0 : ℝ) < 2 by norm_num)] at hc
    rw [hdef, mul_comm]
    linarith

/-- Za maturo, naloga 3 d): f(1) = 2 = g(1), f(2) = 3 = g(2); f(3/2) = √2 + 1 < 5/2 = g(3/2)
(√2 < 3/2); f(0) = 3/2 > 1 = g(0), f(3) = 5 > 4 = g(3); neenačba 2^(x−1) + 1 ≤ x + 1 velja natanko
za x ∈ [1, 2] (za vsak realen x, torej tudi na [−2, 3]).
trditev: MAT-SS-2/eksponentna-funkcija#matura3d
besedilo: »Na preostalem delu intervala $[-2, 3]$, levo od $x = 1$ in desno od $x = 2$, leži nad njo, na primer $f(0) = \dfrac{3}{2} > 1 = g(0)$ in $f(3) = 5 > 4 = g(3)$.« -/
theorem matura3d :
    (2 : ℝ) ^ ((1 : ℝ) - 1) + 1 = 1 + 1 ∧ (2 : ℝ) ^ ((2 : ℝ) - 1) + 1 = 2 + 1 ∧
    (2 : ℝ) ^ ((3 / 2 : ℝ) - 1) + 1 = Real.sqrt 2 + 1 ∧ Real.sqrt 2 < 3 / 2 ∧
    Real.sqrt 2 + 1 < 3 / 2 + 1 ∧
    (2 : ℝ) ^ ((0 : ℝ) - 1) + 1 = 3 / 2 ∧ (1 : ℝ) < 3 / 2 ∧
    (2 : ℝ) ^ ((3 : ℝ) - 1) + 1 = 5 ∧ (3 : ℝ) + 1 < 5 ∧
    ∀ x : ℝ, (2 : ℝ) ^ (x - 1) + 1 ≤ x + 1 ↔ x ∈ Set.Icc 1 2 := by
  have hs : Real.sqrt 2 < 3 / 2 := by
    rw [Real.sqrt_lt' (by norm_num)]; norm_num
  refine ⟨by norm_num, by norm_num, ?_, hs, by linarith, by norm_num [Real.rpow_neg], by norm_num,
    by norm_num, by norm_num, fun x => ?_⟩
  · rw [Real.sqrt_eq_rpow]; norm_num
  · obtain ⟨hA, hB, hC⟩ := dve_na_t (x - 1)
    rw [Set.mem_Icc]
    constructor
    · intro h
      constructor
      · by_contra hx; have hx' := not_le.mp hx; linarith [hA (by linarith)]
      · by_contra hx; have hx' := not_le.mp hx; linarith [hB (by linarith)]
    · rintro ⟨h1, h2⟩
      linarith [hC (by linarith) (by linarith)]

/-- Za maturo, naloga 3 e): za x > 1 je eˣ⁻¹ > 2ˣ⁻¹ (e > 2, pozitiven eksponent), zato
h(x) = eˣ⁻¹ + 1 > 2ˣ⁻¹ + 1 = f(x).
trditev: MAT-SS-2/eksponentna-funkcija#matura3e
besedilo: »e) Za $x > 1$ je eksponent $x - 1$ pozitiven. Pri pozitivnem eksponentu da večja osnova večjo potenco, in ker je $e \approx 2{,}718 > 2$, je $e^{x-1} > 2^{x-1}$. Zato je $h(x) = e^{x-1} + 1 > 2^{x-1} + 1 = f(x)$ za vsak $x > 1$.« -/
theorem matura3e (x : ℝ) (hx : 1 < x) : (2 : ℝ) ^ (x - 1) + 1 < Real.exp (x - 1) + 1 := by
  have he : (2 : ℝ) < Real.exp 1 := by linarith [Real.exp_one_gt_d9]
  rw [← Real.exp_one_rpow]
  linarith [Real.rpow_lt_rpow (by norm_num) he (show 0 < x - 1 by linarith)]

/-- Predpostavke trditve `matura3e` se dajo izpolniti (x = 2). -/
example : (1 : ℝ) < 2 := by norm_num

/-- RAČUN: 2^(3/2 − 1) + 1 ≈ 2,414 in (1 + 1/2)² = 2,25.
trditev: MAT-SS-2/eksponentna-funkcija#racun-sqrt
besedilo: »Po letu imamo $\left(1 + \frac{1}{n}\right)^n$ €: pri $n = 1, 2, 12, 365$ dobimo $2;\ 2{,}25;\ 2{,}613;\ 2{,}7146$.« -/
theorem racun_sqrt : (2.4135 < (2 : ℝ) ^ ((3 / 2 : ℝ) - 1) + 1 ∧ (2 : ℝ) ^ ((3 / 2 : ℝ) - 1) + 1 < 2.4145) ∧
    ((1 : ℝ) + 1 / 2) ^ 2 = 2.25 := by
  have hs : 1.4135 < (2 : ℝ) ^ (1 / 2 : ℝ) ∧ (2 : ℝ) ^ (1 / 2 : ℝ) < 1.4145 :=
    koren_med (p := 1) (q := 2) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)
  rw [show (3 / 2 : ℝ) - 1 = 1 / 2 by norm_num]
  exact ⟨⟨by linarith [hs.1], by linarith [hs.2]⟩, by norm_num⟩

/-! ## Ustno vprašanje 2 in »Bolj natančno« -/

/-- Ustno vprašanje 2 in Bolj natančno: za x₁ < x₂ je a^x₂ = a^x₁·a^(x₂−x₁); pri a > 1 je
a^(x₂−x₁) > 1 in zato a^x₂ > a^x₁; pri 0 < a < 1 je a^(x₂−x₁) < 1 in neenakost se obrne.
trditev: MAT-SS-2/eksponentna-funkcija#dokaz-monotonosti
besedilo: »Za $a > 1$ in pozitiven eksponent je $a^{x_2 - x_1} > 1$. Ker je $a^{x_1} > 0$, sledi $a^{x_2} > a^{x_1}$. Pri $0 < a < 1$ je $a^{x_2 - x_1} < 1$ in neenakost se obrne.« -/
theorem dokaz_monotonosti (a x₁ x₂ : ℝ) (ha : 0 < a) (h : x₁ < x₂) :
    a ^ x₂ = a ^ x₁ * a ^ (x₂ - x₁) ∧
    (1 < a → 1 < a ^ (x₂ - x₁) ∧ a ^ x₁ < a ^ x₂) ∧
    (a < 1 → a ^ (x₂ - x₁) < 1 ∧ a ^ x₂ < a ^ x₁) := by
  have hsplit : a ^ x₂ = a ^ x₁ * a ^ (x₂ - x₁) := by
    rw [← Real.rpow_add ha]; congr 1; ring
  have hp : 0 < a ^ x₁ := Real.rpow_pos_of_pos ha x₁
  have hd : 0 < x₂ - x₁ := by linarith
  refine ⟨hsplit, fun ha1 => ?_, fun ha1 => ?_⟩
  · have h1 : 1 < a ^ (x₂ - x₁) := Real.one_lt_rpow ha1 hd
    refine ⟨h1, ?_⟩
    rw [hsplit]; nlinarith
  · have h1 : a ^ (x₂ - x₁) < 1 := Real.rpow_lt_one ha.le ha1 hd
    refine ⟨h1, ?_⟩
    rw [hsplit]; nlinarith

/-- Predpostavke trditve `dokaz_monotonosti` se dajo izpolniti (a = 2, x₁ = 0, x₂ = 1). -/
example : (0 : ℝ) < 2 ∧ (0 : ℝ) < 1 := by norm_num

/-- Bolj natančno (iracionalni eksponenti): 2^1,4 < 2^1,41 < 2^1,414 < 2^1,5.
trditev: MAT-SS-2/eksponentna-funkcija#iracionalni
besedilo: »$2^{1{,}41}$,« -/
theorem iracionalni : (2 : ℝ) ^ (1.4 : ℝ) < (2 : ℝ) ^ (1.41 : ℝ) ∧
    (2 : ℝ) ^ (1.41 : ℝ) < (2 : ℝ) ^ (1.414 : ℝ) ∧ (2 : ℝ) ^ (1.414 : ℝ) < (2 : ℝ) ^ (1.5 : ℝ) := by
  refine ⟨?_, ?_, ?_⟩ <;> exact narasca 2 (by norm_num) (by norm_num)

/-- Bolj natančno: 2^√2 ≈ 2,665 (2,6645 < 2^√2 < 2,6655), ker je 140/99 < √2 < 99/70 in potenca z
osnovo 2 narašča.
trditev: MAT-SS-2/eksponentna-funkcija#dve-na-koren2
besedilo: »$2^{\sqrt{2}} \approx 2{,}665$.« -/
theorem dve_na_koren2 : 2.6645 < (2 : ℝ) ^ Real.sqrt 2 ∧ (2 : ℝ) ^ Real.sqrt 2 < 2.6655 := by
  have s1 : (140 / 99 : ℝ) < Real.sqrt 2 := by rw [Real.lt_sqrt (by norm_num)]; norm_num
  have s2 : Real.sqrt 2 < 99 / 70 := by rw [Real.sqrt_lt' (by norm_num)]; norm_num
  have b1 : 2.6645 < (2 : ℝ) ^ (140 / 99 : ℝ) :=
    (koren_med (p := 140) (q := 99) (b := 3) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)).1
  have b2 : (2 : ℝ) ^ (99 / 70 : ℝ) < 2.6655 :=
    (koren_med (p := 99) (q := 70) (a := 2) (by norm_num) (by norm_num) (by norm_num)
      (by norm_num) (by norm_num)).2
  exact ⟨b1.trans (narasca 2 (by norm_num) s1), (narasca 2 (by norm_num) s2).trans b2⟩

/-- Bolj natančno (značilna lastnost): f(u + v) = f(u)·f(v) za f(x) = aˣ, a > 0.
trditev: MAT-SS-2/eksponentna-funkcija#produkt
besedilo: »Značilna lastnost.** Za eksponentno funkcijo velja $f(u + v) = f(u) \cdot f(v)$, ker je $a^{u+v} = a^u \cdot a^v$.« -/
theorem produkt (a u v : ℝ) (ha : 0 < a) : a ^ (u + v) = a ^ u * a ^ v := Real.rpow_add ha u v

/-- Predpostavke trditve `produkt` se dajo izpolniti (a = 2). -/
example : (0 : ℝ) < 2 := by norm_num

/-- Drugače, z analogijo: 0,1·2¹⁰ = 0,1·1024 = 102,4 mm > 100 mm; linearno 0,1 + 10·0,1 = 1,1 mm;
polovica pozitivnega kosa je še vedno pozitivna ((1/2)ˣ > 0).
trditev: MAT-SS-2/eksponentna-funkcija#analogija
besedilo: »Če bi list lahko prepognil $10$-krat, bi bil debel že $0{,}1 \cdot 1024 = 102{,}4\,\mathrm{mm}$, več kot $10\,\mathrm{cm}$.« -/
theorem analogija : (0.1 : ℝ) * 2 ^ 10 = 0.1 * 1024 ∧ (0.1 : ℝ) * 1024 = 102.4 ∧ (100 : ℝ) < 102.4 ∧
    (0.1 : ℝ) + 10 * 0.1 = 1.1 ∧ ∀ x : ℝ, 0 < (1 / 2 : ℝ) ^ x :=
  ⟨by norm_num, by norm_num, by norm_num, by norm_num, fun x => Real.rpow_pos_of_pos (by norm_num) x⟩

/-! ## Preveri se -/

/-- Preveri se 1: 0,5³ < 0,5^0,5 < 3⁰ = 1 < 3^0,2 < 0,5^(−2) = 4 (in 3^0,2 < 3¹ = 3).
trditev: MAT-SS-2/eksponentna-funkcija#kviz1
besedilo: »Funkcija $0{,}5^x$ pada, zato je $0{,}5^3 < 0{,}5^{0{,}5} < 0{,}5^0 = 1$, pri negativnem eksponentu pa je vrednost nad $1$: $0{,}5^{-2} = 2^2 = 4$.« -/
theorem kviz1 :
    (0.5 : ℝ) ^ (3 : ℝ) < (0.5 : ℝ) ^ (0.5 : ℝ) ∧ (0.5 : ℝ) ^ (0.5 : ℝ) < (3 : ℝ) ^ (0 : ℝ) ∧
    (3 : ℝ) ^ (0 : ℝ) < (3 : ℝ) ^ (0.2 : ℝ) ∧ (3 : ℝ) ^ (0.2 : ℝ) < (0.5 : ℝ) ^ (-2 : ℝ) ∧
    (0.5 : ℝ) ^ (-2 : ℝ) = 4 ∧ (3 : ℝ) ^ (0.2 : ℝ) < 3 := by
  have h4 : (0.5 : ℝ) ^ (-2 : ℝ) = 4 := by norm_num [Real.rpow_neg]
  have h3 : (3 : ℝ) ^ (0.2 : ℝ) < (3 : ℝ) ^ (1 : ℝ) := narasca 3 (by norm_num) (by norm_num)
  rw [Real.rpow_one] at h3
  refine ⟨pada 0.5 (by norm_num) (by norm_num) (by norm_num), ?_, narasca 3 (by norm_num) (by norm_num),
    by rw [h4]; linarith, h4, h3⟩
  rw [Real.rpow_zero]
  exact Real.rpow_lt_one (by norm_num) (by norm_num) (by norm_num)

/-- Preveri se 2: iz a^(−1) = 4 sledi a = 1/4; pri a = 4 bi bilo 4^(−1) = 1/4, pri a = 1/2 pa
(1/2)^(−1) = 2.
trditev: MAT-SS-2/eksponentna-funkcija#kviz2
besedilo: »Iz točke $(-1, 4)$ sledi $a^{-1} = 4$, torej $\dfrac{1}{a} = 4$ in $a = \dfrac{1}{4}$.« -/
theorem kviz2 (a : ℝ) : (a ^ (-1 : ℝ) = 4 ↔ a = 1 / 4) ∧
    (4 : ℝ) ^ (-1 : ℝ) = 1 / 4 ∧ (1 / 2 : ℝ) ^ (-1 : ℝ) = 2 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  rw [Real.rpow_neg_one]
  constructor
  · intro h
    have : a = (a⁻¹)⁻¹ := (inv_inv a).symm
    rw [this, h]; norm_num
  · intro h; rw [h]; norm_num

/-- Preveri se 3: graf y = 2ˣ − 3 ima asimptoto y = −3 (zaloga (−3, ∞)), seka os y v 2⁰ − 3 = −2 in gre
skozi (2, 1).
trditev: MAT-SS-2/eksponentna-funkcija#kviz3
besedilo: »Na levi se graf prilega premici $y = -3$, to je asimptota $y = q$, zato je $q = -3$. Preizkus: $2^0 - 3 = -2$, graf res seka os $y$ pri $-2$.« -/
theorem kviz3 :
    Set.range (fun x : ℝ => (2 : ℝ) ^ (x - 0) + (-3)) = Set.Ioi (-3) ∧
    (2 : ℝ) ^ (0 : ℝ) - 3 = -2 ∧ (2 : ℝ) ^ (2 : ℝ) - 3 = 1 :=
  ⟨(premiki 2 0 (-3) 1 (by norm_num) (by norm_num) (by norm_num)).1, by norm_num, by norm_num⟩

/-- Preveri se 4: za a > 0 je aˣ > 0 za vsak x, zato y = aˣ nima ničel; parabola 1 − x² gre skozi (0, 1)
in ima ničli ±1; 2^(−3) = 1/8.
trditev: MAT-SS-2/eksponentna-funkcija#kviz4
besedilo: »Tudi parabola $y = 1 - x^2$ gre skozi $(0, 1)$,« -/
theorem kviz4 (a : ℝ) (ha : 0 < a) : (∀ x : ℝ, 0 < a ^ x) ∧ (1 : ℝ) - 0 ^ 2 = 1 ∧
    (1 : ℝ) - (-1) ^ 2 = 0 ∧ (1 : ℝ) - 1 ^ 2 = 0 ∧ (2 : ℝ) ^ (-3 : ℝ) = 1 / 8 :=
  ⟨fun x => Real.rpow_pos_of_pos ha x, by norm_num, by norm_num, by norm_num, by norm_num [Real.rpow_neg]⟩

/-- Predpostavke trditve `kviz4` se dajo izpolniti (a = 1/2). -/
example : (0 : ℝ) < 1 / 2 := by norm_num

/-- Preveri se 5: 3^(x−2) ima vrednost 1 pri x = 2 (premik za 2 v desno); 3ˣ > 0; f(x) = 3^(x−2) − 1
ima zalogo vrednosti (−1, ∞).
trditev: MAT-SS-2/eksponentna-funkcija#kviz5
besedilo: »Rok določa lastnosti funkcije $f(x) = 3^{x-2} - 1$: (1) osnovni graf $y = 3^x$ ima asimptoto $y = 0$; (2) zapis $x - 2$ pomeni premik za $2$ v levo; (3) člen $-1$ premakne graf za $1$ navzdol, zato je asimptota $y = -1$; (4) zaloga vrednosti je $(-1, \infty)$.« -/
theorem kviz5 : (3 : ℝ) ^ ((2 : ℝ) - 2) = 1 ∧ (∀ x : ℝ, 0 < (3 : ℝ) ^ x) ∧
    Set.range (fun x : ℝ => (3 : ℝ) ^ (x - 2) + (-1)) = Set.Ioi (-1) :=
  ⟨by norm_num, fun x => Real.rpow_pos_of_pos (by norm_num) x,
    (premiki 3 2 (-1) 1 (by norm_num) (by norm_num) (by norm_num)).1⟩

/-- Preveri se 6: B: 3·2ˣ da 3, 6, 12, 24 (razmerja 2) in pri x = 4 vrednost 48 = 24·2; A ima stalne
razlike +3 (naslednja 15) in nima stalnih razmerij (9/6 ≠ 6/3), C = x² + 3 (3, 4, 7, 12; naslednja 19) nima stalnih razmerij (4/3 ≠ 7/4);
24 + 12 = 36.
trditev: MAT-SS-2/eksponentna-funkcija#kviz6
besedilo: »Tri funkcije imajo pri $x = 0, 1, 2, 3$ vrednosti: A: $3, 6, 9, 12$; B: $3, 6, 12, 24$; C: $3, 4, 7, 12$.« -/
theorem kviz6 :
    (3 : ℝ) * 2 ^ (0 : ℝ) = 3 ∧ (3 : ℝ) * 2 ^ (1 : ℝ) = 6 ∧ (3 : ℝ) * 2 ^ (2 : ℝ) = 12 ∧
    (3 : ℝ) * 2 ^ (3 : ℝ) = 24 ∧ (3 : ℝ) * 2 ^ (4 : ℝ) = 48 ∧ (24 : ℝ) * 2 = 48 ∧
    (6 : ℝ) / 3 = 2 ∧ (12 : ℝ) / 6 = 2 ∧ (24 : ℝ) / 12 = 2 ∧ (12 : ℝ) + 3 = 15 ∧
    ((0 : ℝ) ^ 2 + 3 = 3 ∧ (1 : ℝ) ^ 2 + 3 = 4 ∧ (2 : ℝ) ^ 2 + 3 = 7 ∧ (3 : ℝ) ^ 2 + 3 = 12 ∧
      (4 : ℝ) ^ 2 + 3 = 19) ∧ (9 : ℝ) / 6 ≠ 6 / 3 ∧ (4 : ℝ) / 3 ≠ 7 / 4 ∧ (24 : ℝ) + 12 = 36 := by
  norm_num

/-- Preveri se 7 in RAČUN: 2,7 < e < 2,8, 2,7² = 7,29, 2,8² = 7,84, zato 7,29 < e² < 7,84 in celi del
e² je 7; e² ≈ 7,389.
trditev: MAT-SS-2/eksponentna-funkcija#kviz7
besedilo: »$2{,}7 < e < 2{,}8$, zato je $7{,}29 < e^2 < 7{,}84$.« -/
theorem kviz7 : (2.7 < Real.exp 1 ∧ Real.exp 1 < 2.8) ∧ (2.7 : ℝ) ^ 2 = 7.29 ∧ (2.8 : ℝ) ^ 2 = 7.84 ∧
    (7.29 < Real.exp 2 ∧ Real.exp 2 < 7.84) ∧ ⌊Real.exp 2⌋ = 7 ∧
    (7.3885 < Real.exp 2 ∧ Real.exp 2 < 7.3895) := by
  have h1 := Real.exp_one_gt_d9
  have h2 := Real.exp_one_lt_d9
  have e2 : Real.exp 2 = Real.exp 1 * Real.exp 1 := by
    rw [← Real.exp_add]; norm_num
  have hp : 0 < Real.exp 1 := Real.exp_pos 1
  have b1 : 7.3885 < Real.exp 2 := by rw [e2]; nlinarith
  have b2 : Real.exp 2 < 7.3895 := by rw [e2]; nlinarith
  refine ⟨⟨by linarith, by linarith⟩, by norm_num, by norm_num, ⟨by linarith, by linarith⟩, ?_,
    ⟨b1, b2⟩⟩
  rw [Int.floor_eq_iff]
  constructor <;> push_cast <;> linarith

/-- RAČUN: exp(1) ≈ 2,71828.
trditev: MAT-SS-2/eksponentna-funkcija#racun-e
besedilo: »$e = 2{,}71828\ldots$« -/
theorem racun_e : 2.718275 < Real.exp 1 ∧ Real.exp 1 < 2.718285 :=
  ⟨by linarith [Real.exp_one_gt_d9], by linarith [Real.exp_one_lt_d9]⟩

end Evklid.Lekcije.MAT_SS_2.EksponentnaFunkcija
