/-
vir: content/lessons/MAT-SS-1/ulomljeni-izrazi.md
sha256: c1dd3bdb09347632b58f735c4e1aa804b8b1ec3095ef9b293dd224874061c76c
Ni v Leanu: »ni definiran« / »nima vrednosti«: v Leanu je x/0 = 0, zato je vsak pogoj zapisan kot
predpostavka (imenovalec ≠ 0) in dokazano je, pri katerih x je imenovalec 0 (npr. x² − 4 ≠ 0 ⇔ x ≠ ±2);
povsod, kjer krajšanje zahteva pogoj, ga trditev nosi (brez njega bi bila v Leanu marsikje napačna, npr.
(3x + 6)/(x² − 4) = 3/(x − 2) pri x = −2); definicije in poimenovanja (ulomljeni izraz, pogoji, skupni
imenovalec kot najmanjši skupni večkratnik, »enaka na skupnem definicijskem območju«), postopki in nasveti
(vrstni red korakov, »okrajšaj navzkriž«, »najmanjši skupni večkratnik je krajši«, »pogoje piši pred
krajšanjem«); trditvi, da se (6 − x)/((x − 3)(x + 3)) in (x − 3)/x »ne dajo več krajšati«, ker deljivost
ulomljenih izrazov ni formalizirana; glasbene in programske analogije (mreža, zidaki) kot opis (dokazani so
njihovi računi 1/3 + 1/4 = 7/12, 4/12, 3/12 in 1/x + 1/y = (x + y)/(xy)); simulacija in graf z luknjo (dokazano:
(x² − a²)/(x − a) = x + a za x ≠ a in imenovalec je 0 pri x = a); točkovanje maturitetnih nalog; besedila napačnih
odgovorov v Preveri se (dokazano je, da so napačni rezultati res napačni, npr. z vrednostjo pri enem x).
Pravila za ulomke nosijo pogoje lekcije (imenovalci ≠ 0, pri deljenju še C ≠ 0), čeprav jih Lean pri nekaterih
ne potrebuje. Decimalni števili 0,75 in 0,97 sta zapisani kot 3/4 in 97/100.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.UlomljeniIzrazi

/-! ## Pomožne trditve -/

/-- Pomožno (Razlaga 2): k(x − a)(x − b) ≠ 0 natanko tedaj, ko x ≠ a in x ≠ b (k ≠ 0).
pomozno – orodje za pogoje (produkt faktorjev ni 0) -/
theorem dva_faktorja (x a b k : ℝ) (hk : k ≠ 0) : k * ((x - a) * (x - b)) ≠ 0 ↔ x ≠ a ∧ x ≠ b := by
  simp [hk, sub_eq_zero]

/-- Predpostavka `dva_faktorja` se da izpolniti (k = 1). -/
example : (1 : ℝ) * ((0 - 2) * (0 - -2)) ≠ 0 ↔ (0 : ℝ) ≠ 2 ∧ (0 : ℝ) ≠ -2 :=
  dva_faktorja 0 2 (-2) 1 one_ne_zero

/-! ## Zakaj se tega učimo -/

/-- Zakaj se tega učimo: 1/2 + 1/4 + 1/4 = 1; za t ≠ 0 je 60/t + 30/t = 90/t, pri t = 120 je to 0,75 s.
trditev: MAT-SS-1/ulomljeni-izrazi#takt
besedilo: »Skupaj $\dfrac{60}{t} + \dfrac{30}{t} = \dfrac{90}{t}$ sekund, pri tempu $120$ torej $0{,}75\,\text{s}$.« -/
theorem takt (t : ℝ) (_ht : t ≠ 0) : (1 / 2 + 1 / 4 + 1 / 4 : ℝ) = 1 ∧ 60 / t + 30 / t = 90 / t ∧
    (90 : ℝ) / 120 = 3 / 4 := by
  refine ⟨by norm_num, ?_, by norm_num⟩
  rw [← add_div]; norm_num

/-- Predpostavka `takt` se da izpolniti (t = 120). -/
example : (60 : ℝ) / 120 + 30 / 120 = 90 / 120 := (takt 120 (by norm_num)).2.1

/-! ## Razlaga 1 in 2 -/

/-- Razlaga 1: za t ≠ 0 je 60/t + 60/(2t) = 120/(2t) + 60/(2t) = 180/(2t) = 90/t.
trditev: MAT-SS-1/ulomljeni-izrazi#razlaga1
besedilo: »$$\frac{60}{t} + \frac{60}{2t} = \frac{120}{2t} + \frac{60}{2t} = \frac{180}{2t} = \frac{90}{t}$$« -/
theorem razlaga1 (t : ℝ) (ht : t ≠ 0) : 60 / t + 60 / (2 * t) = 90 / t := by
  calc 60 / t + 60 / (2 * t) = 120 / (2 * t) + 60 / (2 * t) := by field_simp; ring
    _ = 180 / (2 * t) := by rw [← add_div]; norm_num
    _ = 90 / t := by field_simp; ring

/-- Predpostavka `razlaga1` se da izpolniti (t = 60). -/
example : (60 : ℝ) / 60 + 60 / (2 * 60) = 90 / 60 := razlaga1 60 (by norm_num)

/-- Razlaga 1, preizkus pri t = 60: 60/60 = 1, 60/120 = 0,5, skupaj 1,5 = 90/60.
trditev: MAT-SS-1/ulomljeni-izrazi#razlaga1-preizkus
besedilo: »Preizkus pri $t = 60$: udarca trajata $1\,\text{s}$ in $0{,}5\,\text{s}$, skupaj $1{,}5\,\text{s}$, in res je $\dfrac{90}{60} = 1{,}5$.« -/
theorem razlaga1_preizkus : (60 : ℝ) / 60 = 1 ∧ (60 : ℝ) / (2 * 60) = 1 / 2 ∧ (1 + 1 / 2 : ℝ) = 3 / 2 ∧
    (90 : ℝ) / 60 = 3 / 2 := by norm_num

/-- Razlaga 2, tabela: x − 5 ≠ 0 ⇔ x ≠ 5; x² − 4 = (x − 2)(x + 2) ≠ 0 ⇔ x ≠ ±2; x² + x = x(x + 1) ≠ 0 ⇔
x ≠ 0, x ≠ −1; x² + 1 ≥ 1, zato ni nikoli 0.
trditev: MAT-SS-1/ulomljeni-izrazi#razlaga2-pogoji
besedilo: »| $\dfrac{3}{x-5}$ | $x \neq 5$ | | $\dfrac{x}{x^2-4}$ | $x \neq 2$, $x \neq -2$ | | $\dfrac{1}{x^2+x}$ | $x \neq 0$, $x \neq -1$ | | $\dfrac{2}{x^2+1}$ | ni pogojev |« -/
theorem razlaga2_pogoji (x : ℝ) : (x - 5 ≠ 0 ↔ x ≠ 5) ∧ x ^ 2 - 4 = (x - 2) * (x + 2) ∧
    (x ^ 2 - 4 ≠ 0 ↔ x ≠ 2 ∧ x ≠ -2) ∧ x ^ 2 + x = x * (x + 1) ∧ (x ^ 2 + x ≠ 0 ↔ x ≠ 0 ∧ x ≠ -1) ∧
    1 ≤ x ^ 2 + 1 ∧ x ^ 2 + 1 ≠ 0 := by
  refine ⟨sub_ne_zero, by ring, ?_, by ring, ?_, by nlinarith [sq_nonneg x], by positivity⟩
  · rw [show x ^ 2 - 4 = 1 * ((x - 2) * (x - -2)) by ring, dva_faktorja _ _ _ _ one_ne_zero]
  · rw [show x ^ 2 + x = 1 * ((x - 0) * (x - -1)) by ring, dva_faktorja _ _ _ _ one_ne_zero]

/-- Razlaga 2, simulacija: za x ≠ a je (x² − a²)/(x − a) = x + a; pri x = a je imenovalec 0; pri a = 2 bi
premica y = x + 2 v x = 2 imela vrednost 4 (luknja v točki (2, 4)).
trditev: MAT-SS-1/ulomljeni-izrazi#simulacija
besedilo: »graf je povsod drugje premica $y = x + 2$, v točki $(2, 4)$ pa ima luknjo.« -/
theorem simulacija (a x : ℝ) (hx : x ≠ a) : (x ^ 2 - a ^ 2) / (x - a) = x + a ∧ a - a = 0 ∧
    (2 : ℝ) + 2 = 4 := by
  have h : x - a ≠ 0 := sub_ne_zero.mpr hx
  refine ⟨?_, sub_self a, by norm_num⟩
  rw [div_eq_iff h]; ring

/-- Predpostavka `simulacija` se da izpolniti (a = 2, x = 3). -/
example : ((3 : ℝ) ^ 2 - 2 ^ 2) / (3 - 2) = 3 + 2 ∧ (2 : ℝ) - 2 = 0 ∧ (2 : ℝ) + 2 = 4 :=
  simulacija 2 3 (by norm_num)

/-! ## Razlaga 3: krajšanje -/

/-- Razlaga 3, Ponovitev, Ustno vprašanje 2, Bolj natančno: za B ≠ 0, C ≠ 0 je C/C = 1 in
AC/(BC) = A/B · C/C = A/B.
trditev: MAT-SS-1/ulomljeni-izrazi#krajsanje
besedilo: »Za $C \neq 0$ je $\dfrac{C}{C} = 1$, zato je $\dfrac{A \cdot C}{B \cdot C} = \dfrac{A}{B} \cdot \dfrac{C}{C} = \dfrac{A}{B}$.« -/
theorem krajsanje (A B C : ℝ) (_hB : B ≠ 0) (hC : C ≠ 0) :
    C / C = 1 ∧ A * C / (B * C) = A / B * (C / C) ∧ A * C / (B * C) = A / B := by
  refine ⟨div_self hC, ?_, mul_div_mul_right A B hC⟩
  rw [div_mul_div_comm]

/-- Predpostavki `krajsanje` se dajo izpolniti (B = 2, C = 3). -/
example : (3 : ℝ) / 3 = 1 ∧ (1 : ℝ) * 3 / (2 * 3) = 1 / 2 * (3 / 3) ∧ (1 : ℝ) * 3 / (2 * 3) = 1 / 2 :=
  krajsanje 1 2 3 (by norm_num) (by norm_num)

/-- Razlaga 3, Pogoste napake (zidaki): (x² − 9)/(x² + 3x) = (x − 3)(x + 3)/(x(x + 3)) = (x − 3)/x za x ≠ 0,
x ≠ −3.
trditev: MAT-SS-1/ulomljeni-izrazi#razlaga3-primer
besedilo: »$\dfrac{x^2-9}{x^2+3x} = \dfrac{(x-3)(x+3)}{x(x+3)} = \dfrac{x-3}{x}$, pogoja sta $x \neq 0$ in $x \neq -3$« -/
theorem razlaga3_primer (x : ℝ) (_h0 : x ≠ 0) (h3 : x ≠ -3) :
    (x ^ 2 - 9) / (x ^ 2 + 3 * x) = (x - 3) / x := by
  have h3' : x + 3 ≠ 0 := by intro h; apply h3; linarith
  calc (x ^ 2 - 9) / (x ^ 2 + 3 * x) = ((x - 3) * (x + 3)) / (x * (x + 3)) := by ring
    _ = (x - 3) / x := mul_div_mul_right _ _ h3'

/-- Predpostavki `razlaga3_primer` se dajo izpolniti (x = 100, Preveri se 6). -/
example : ((100 : ℝ) ^ 2 - 9) / (100 ^ 2 + 3 * 100) = (100 - 3) / 100 :=
  razlaga3_primer 100 (by norm_num) (by norm_num)

/-- Razlaga 3 in Preveri se 2: pogoja izhajata iz prvotnega imenovalca: x² + 3x ≠ 0 ⇔ x ≠ 0 in x ≠ −3.
trditev: MAT-SS-1/ulomljeni-izrazi#razlaga3-pogoji
besedilo: »pogoja sta $x \neq 0$ in $x \neq -3$« -/
theorem razlaga3_pogoji (x : ℝ) : x ^ 2 + 3 * x ≠ 0 ↔ x ≠ 0 ∧ x ≠ -3 := by
  rw [show x ^ 2 + 3 * x = 1 * ((x - 0) * (x - -3)) by ring, dva_faktorja _ _ _ _ one_ne_zero]

/-- Razlaga 3: a⁵/a² = a³ za a ≠ 0.
trditev: MAT-SS-1/ulomljeni-izrazi#potenci
besedilo: »$\dfrac{a^5}{a^2} = a^3$ za $a \neq 0$« -/
theorem potenci (a : ℝ) (ha : a ≠ 0) : a ^ 5 / a ^ 2 = a ^ 3 := by
  rw [div_eq_iff (pow_ne_zero 2 ha)]; ring

/-- Predpostavka `potenci` se da izpolniti (a = 2). -/
example : (2 : ℝ) ^ 5 / 2 ^ 2 = 2 ^ 3 := potenci 2 two_ne_zero

/-- Razlaga 3, Povzetek: b − a = −(a − b) in (a − b)/(b − a) = −1 za a ≠ b.
trditev: MAT-SS-1/ulomljeni-izrazi#nasprotna
besedilo: »Faktorja $a - b$ in $b - a$ sta nasprotna, saj je $b - a = -(a - b)$. Zato je $\dfrac{a-b}{b-a} = -1$ za $a \neq b$.« -/
theorem nasprotna (a b : ℝ) (h : a ≠ b) : b - a = -(a - b) ∧ (a - b) / (b - a) = -1 := by
  have h' : a - b ≠ 0 := sub_ne_zero.mpr h
  refine ⟨by ring, ?_⟩
  rw [show b - a = -(a - b) by ring, div_neg, div_self h']

/-- Predpostavka `nasprotna` se da izpolniti (a = 1, b = 0). -/
example : (0 : ℝ) - 1 = -(1 - 0) ∧ ((1 : ℝ) - 0) / (0 - 1) = -1 := nasprotna 1 0 one_ne_zero

/-- Razlaga 3, Premisli: (x − 3)/x pri x = −3 je 2, prvotni izraz pa ima tam števec in imenovalec 0.
trditev: MAT-SS-1/ulomljeni-izrazi#premisli-krajsanje
besedilo: »Prvotni izraz pri $x = -3$ da $\dfrac{0}{0}$, kar ni definirano.« -/
theorem premisli_krajsanje : ((-3 : ℝ) - 3) / (-3) = 2 ∧ (-3 : ℝ) ^ 2 - 9 = 0 ∧ (-3 : ℝ) ^ 2 + 3 * (-3) = 0 := by
  norm_num

/-! ## Razlaga 4: množenje in deljenje -/

/-- Razlaga 4, Povzetek: A/B · C/D = AC/(BD) (B, D ≠ 0).
trditev: MAT-SS-1/ulomljeni-izrazi#mnozenje
besedilo: »$$\frac{A}{B} \cdot \frac{C}{D} = \frac{A \cdot C}{B \cdot D}.$$« -/
theorem mnozenje (A B C D : ℝ) (_hB : B ≠ 0) (_hD : D ≠ 0) : A / B * (C / D) = A * C / (B * D) :=
  div_mul_div_comm A B C D

/-- Predpostavki `mnozenje` se dajo izpolniti (B = 2, D = 3). -/
example : (1 : ℝ) / 2 * (1 / 3) = 1 * 1 / (2 * 3) := mnozenje 1 2 1 3 (by norm_num) (by norm_num)

/-- Razlaga 4, Povzetek, Bolj natančno: A/B : C/D = A/B · D/C (B, D ≠ 0 in C ≠ 0), ker je C/D · D/C = 1.
trditev: MAT-SS-1/ulomljeni-izrazi#deljenje
besedilo: »Deljenje je množenje z obratnim ulomkom: $\dfrac{A}{B} : \dfrac{C}{D} = \dfrac{A}{B} \cdot \dfrac{D}{C}$, pri čemer mora biti tudi $C \neq 0$.« -/
theorem deljenje (A B C D : ℝ) (_hB : B ≠ 0) (hC : C ≠ 0) (hD : D ≠ 0) :
    C / D * (D / C) = 1 ∧ A / B / (C / D) = A / B * (D / C) := by
  refine ⟨by field_simp, ?_⟩
  rw [div_div_eq_mul_div, mul_div_assoc]

/-- Predpostavke `deljenje` se dajo izpolniti (B = 2, C = 3, D = 4). -/
example : (3 : ℝ) / 4 * (4 / 3) = 1 ∧ (1 : ℝ) / 2 / (3 / 4) = 1 / 2 * (4 / 3) :=
  deljenje 1 2 3 4 (by norm_num) (by norm_num) (by norm_num)

/-- Ustno vprašanje 1 in Bolj natančno: pri D ≠ 0 je C/D ≠ 0 natanko tedaj, ko C ≠ 0.
trditev: MAT-SS-1/ulomljeni-izrazi#delitelj-ni-nic
besedilo: »Deliti ne smemo z ničlo, zato mora biti $\dfrac{C}{D} \neq 0$, torej $C \neq 0$.« -/
theorem delitelj_ni_nic (C D : ℝ) (hD : D ≠ 0) : C / D ≠ 0 ↔ C ≠ 0 := by
  simp [hD]

/-- Predpostavka `delitelj_ni_nic` se da izpolniti (D = 1). -/
example : (2 : ℝ) / 1 ≠ 0 ↔ (2 : ℝ) ≠ 0 := delitelj_ni_nic 2 1 one_ne_zero

/-- Razlaga 4: 4x² = 2x·2x in 2x/(x − 1) · (x² − 1)/(4x²) = 2x/(x − 1) · (x − 1)(x + 1)/(4x²) = (x + 1)/(2x)
za x ≠ 1, x ≠ 0.
trditev: MAT-SS-1/ulomljeni-izrazi#razlaga4-mnozenje
besedilo: »$$\frac{2x}{x-1} \cdot \frac{x^2-1}{4x^2} = \frac{2x}{x-1} \cdot \frac{(x-1)(x+1)}{4x^2} = \frac{x+1}{2x}.$$ Okrajšali smo $x-1$ in $2x$, saj je $4x^2 = 2x \cdot 2x$. Pogoja sta $x \neq 1$ in $x \neq 0$.« -/
theorem razlaga4_mnozenje (x : ℝ) (h1 : x ≠ 1) (h0 : x ≠ 0) :
    4 * x ^ 2 = 2 * x * (2 * x) ∧
    2 * x / (x - 1) * ((x ^ 2 - 1) / (4 * x ^ 2)) = (x + 1) / (2 * x) := by
  have h1' : x - 1 ≠ 0 := sub_ne_zero.mpr h1
  refine ⟨by ring, ?_⟩
  calc 2 * x / (x - 1) * ((x ^ 2 - 1) / (4 * x ^ 2))
      = 2 * x / (x - 1) * ((x - 1) * (x + 1) / (4 * x ^ 2)) := by ring
    _ = (x + 1) / (2 * x) := by field_simp; ring

/-- Predpostavki `razlaga4_mnozenje` se dajo izpolniti (x = 2). -/
example : 4 * (2 : ℝ) ^ 2 = 2 * 2 * (2 * 2) ∧
    2 * 2 / ((2 : ℝ) - 1) * ((2 ^ 2 - 1) / (4 * 2 ^ 2)) = (2 + 1) / (2 * 2) :=
  razlaga4_mnozenje 2 (by norm_num) (by norm_num)

/-- Razlaga 4: (x² − 1)/x : (x + 1)/x² = (x − 1)(x + 1)/x · x²/(x + 1) = x(x − 1) za x ≠ 0, x ≠ −1.
trditev: MAT-SS-1/ulomljeni-izrazi#razlaga4-deljenje
besedilo: »Primer deljenja: $\dfrac{x^2-1}{x} : \dfrac{x+1}{x^2} = \dfrac{(x-1)(x+1)}{x} \cdot \dfrac{x^2}{x+1} = x(x-1)$.« -/
theorem razlaga4_deljenje (x : ℝ) (h0 : x ≠ 0) (h1 : x ≠ -1) :
    (x ^ 2 - 1) / x / ((x + 1) / x ^ 2) = x * (x - 1) := by
  have h1' : x + 1 ≠ 0 := by intro h; apply h1; linarith
  calc (x ^ 2 - 1) / x / ((x + 1) / x ^ 2) = (x - 1) * (x + 1) / x * (x ^ 2 / (x + 1)) := by
        rw [div_div_eq_mul_div]; ring
    _ = x * (x - 1) := by field_simp

/-- Predpostavki `razlaga4_deljenje` se dajo izpolniti (x = 2). -/
example : ((2 : ℝ) ^ 2 - 1) / 2 / ((2 + 1) / 2 ^ 2) = 2 * (2 - 1) :=
  razlaga4_deljenje 2 (by norm_num) (by norm_num)

/-! ## Razlaga 5: seštevanje -/

/-- Razlaga 5, Povzetek: A/C ± B/C = (A ± B)/C (C ≠ 0).
trditev: MAT-SS-1/ulomljeni-izrazi#enak-imenovalec
besedilo: »$$\frac{A}{C} \pm \frac{B}{C} = \frac{A \pm B}{C}.$$« -/
theorem enak_imenovalec (A B C : ℝ) (_hC : C ≠ 0) : A / C + B / C = (A + B) / C ∧
    A / C - B / C = (A - B) / C :=
  ⟨(add_div A B C).symm, (sub_div A B C).symm⟩

/-- Predpostavka `enak_imenovalec` se da izpolniti (C = 2). -/
example : (1 : ℝ) / 2 + 1 / 2 = (1 + 1) / 2 ∧ (1 : ℝ) / 2 - 1 / 2 = (1 - 1) / 2 :=
  enak_imenovalec 1 1 2 two_ne_zero

/-- Ustno vprašanje 3, Bolj natančno, RACUN: A/B + C/D = AD/(BD) + CB/(BD) = (AD + BC)/(BD) (B, D ≠ 0).
trditev: MAT-SS-1/ulomljeni-izrazi#razlicna-imenovalca
besedilo: »$\dfrac{A}{B} + \dfrac{C}{D} = \dfrac{AD}{BD} + \dfrac{CB}{BD} = \dfrac{AD + BC}{BD}$« -/
theorem razlicna_imenovalca (A B C D : ℝ) (hB : B ≠ 0) (hD : D ≠ 0) :
    A / B + C / D = A * D / (B * D) + C * B / (B * D) ∧ A / B + C / D = (A * D + B * C) / (B * D) := by
  constructor
  · field_simp
  · rw [div_add_div _ _ hB hD]

/-- Predpostavki `razlicna_imenovalca` se dajo izpolniti (B = 3, D = 4). -/
example : (1 : ℝ) / 3 + 1 / 4 = 1 * 4 / (3 * 4) + 1 * 3 / (3 * 4) ∧
    (1 : ℝ) / 3 + 1 / 4 = (1 * 4 + 3 * 1) / (3 * 4) :=
  razlicna_imenovalca 1 3 1 4 (by norm_num) (by norm_num)

/-- Razlaga 5: 1/x + 1/(x + 2) = ((x + 2) + x)/(x(x + 2)) = (2x + 2)/(x(x + 2)) = 2(x + 1)/(x(x + 2)) za x ≠ 0,
x ≠ −2.
trditev: MAT-SS-1/ulomljeni-izrazi#razlaga5-primer
besedilo: »$\dfrac{1}{x} + \dfrac{1}{x+2} = \dfrac{(x+2) + x}{x(x+2)} = \dfrac{2x+2}{x(x+2)} = \dfrac{2(x+1)}{x(x+2)}$« -/
theorem razlaga5_primer (x : ℝ) (h0 : x ≠ 0) (h2 : x ≠ -2) :
    1 / x + 1 / (x + 2) = 2 * (x + 1) / (x * (x + 2)) := by
  have h2' : x + 2 ≠ 0 := by intro h; apply h2; linarith
  calc 1 / x + 1 / (x + 2) = ((x + 2) + x) / (x * (x + 2)) := by field_simp
    _ = (2 * x + 2) / (x * (x + 2)) := by ring
    _ = 2 * (x + 1) / (x * (x + 2)) := by ring

/-- Predpostavki `razlaga5_primer` se dajo izpolniti (x = 1). -/
example : (1 : ℝ) / 1 + 1 / (1 + 2) = 2 * (1 + 1) / (1 * (1 + 2)) :=
  razlaga5_primer 1 one_ne_zero (by norm_num)

/-- Razlaga 5, Premisli: za x ≠ 0 je 1/x + 1/x² = (x + 1)/x², s skupnim imenovalcem x³ pa
(x² + x)/x³ = (x + 1)/x².
trditev: MAT-SS-1/ulomljeni-izrazi#premisli-skupni
besedilo: »Z njim takoj dobiš $\dfrac{x+1}{x^2}$. Z $x^3$ dobiš $\dfrac{x^2+x}{x^3}$, ki ga moraš še okrajšati z $x$, da prideš do istega rezultata.« -/
theorem premisli_skupni (x : ℝ) (h0 : x ≠ 0) : 1 / x + 1 / x ^ 2 = (x + 1) / x ^ 2 ∧
    1 / x + 1 / x ^ 2 = (x ^ 2 + x) / x ^ 3 ∧ (x ^ 2 + x) / x ^ 3 = (x + 1) / x ^ 2 := by
  refine ⟨by field_simp, by field_simp, by field_simp⟩

/-- Predpostavka `premisli_skupni` se da izpolniti (x = 1). -/
example : (1 : ℝ) / 1 + 1 / 1 ^ 2 = (1 + 1) / 1 ^ 2 ∧ (1 : ℝ) / 1 + 1 / 1 ^ 2 = (1 ^ 2 + 1) / 1 ^ 3 ∧
    ((1 : ℝ) ^ 2 + 1) / 1 ^ 3 = (1 + 1) / 1 ^ 2 := premisli_skupni 1 one_ne_zero

/-! ## Rešeni primeri -/

/-- Primer 1: 3x + 6 = 3(x + 2), x² − 4 = (x − 2)(x + 2); za x ≠ ±2 je (3x + 6)/(x² − 4) = 3(x + 2)/((x − 2)(x + 2))
= 3/(x − 2).
trditev: MAT-SS-1/ulomljeni-izrazi#primer1
besedilo: »Odgovor: $\dfrac{3x+6}{x^2-4} = \dfrac{3}{x-2}$ za $x \neq 2$ in $x \neq -2$.« -/
theorem primer1 (x : ℝ) (_h2 : x ≠ 2) (hm2 : x ≠ -2) :
    3 * x + 6 = 3 * (x + 2) ∧ (3 * x + 6) / (x ^ 2 - 4) = 3 / (x - 2) := by
  have hm2' : x + 2 ≠ 0 := by intro h; apply hm2; linarith
  refine ⟨by ring, ?_⟩
  calc (3 * x + 6) / (x ^ 2 - 4) = 3 * (x + 2) / ((x - 2) * (x + 2)) := by ring
    _ = 3 / (x - 2) := mul_div_mul_right _ _ hm2'

/-- Predpostavki `primer1` se dajo izpolniti (x = 3). -/
example : 3 * (3 : ℝ) + 6 = 3 * (3 + 2) ∧ (3 * (3 : ℝ) + 6) / (3 ^ 2 - 4) = 3 / (3 - 2) :=
  primer1 3 (by norm_num) (by norm_num)

/-- Primer 1, preizkus pri x = 3: (9 + 6)/(9 − 4) = 15/5 = 3 in 3/(3 − 2) = 3.
trditev: MAT-SS-1/ulomljeni-izrazi#primer1-preizkus
besedilo: »Preizkus pri $x = 3$: $\dfrac{9+6}{9-4} = \dfrac{15}{5} = 3$ in $\dfrac{3}{3-2} = 3$.« -/
theorem primer1_preizkus : ((9 + 6) / (9 - 4) : ℝ) = 15 / 5 ∧ (15 / 5 : ℝ) = 3 ∧ (3 / (3 - 2) : ℝ) = 3 := by
  norm_num

/-- Primer 2: za x ≠ ±3 je x/(x² − 9) − 2/(x + 3) = x/((x − 3)(x + 3)) − 2(x − 3)/((x − 3)(x + 3))
= (x − 2(x − 3))/((x − 3)(x + 3)) = (6 − x)/((x − 3)(x + 3)); števec x − 2(x − 3) = x − 2x + 6 = 6 − x.
trditev: MAT-SS-1/ulomljeni-izrazi#primer2
besedilo: »Odgovor: izraz je enak $\dfrac{6-x}{(x-3)(x+3)}$ za $x \neq 3$ in $x \neq -3$.« -/
theorem primer2 (x : ℝ) (h3 : x ≠ 3) (hm3 : x ≠ -3) :
    x - 2 * (x - 3) = 6 - x ∧ x / (x ^ 2 - 9) - 2 / (x + 3) = (6 - x) / ((x - 3) * (x + 3)) := by
  have h3' : x - 3 ≠ 0 := sub_ne_zero.mpr h3
  have hm3' : x + 3 ≠ 0 := by intro h; apply hm3; linarith
  refine ⟨by ring, ?_⟩
  calc x / (x ^ 2 - 9) - 2 / (x + 3)
      = x / ((x - 3) * (x + 3)) - 2 * (x - 3) / ((x - 3) * (x + 3)) := by
        rw [show x ^ 2 - 9 = (x - 3) * (x + 3) by ring, mul_comm (x - 3) (x + 3),
          mul_div_mul_right _ _ h3']
    _ = (x - 2 * (x - 3)) / ((x - 3) * (x + 3)) := (sub_div _ _ _).symm
    _ = (6 - x) / ((x - 3) * (x + 3)) := by ring

/-- Predpostavki `primer2` se dajo izpolniti (x = 1). -/
example : (1 : ℝ) - 2 * (1 - 3) = 6 - 1 ∧ (1 : ℝ) / (1 ^ 2 - 9) - 2 / (1 + 3) = (6 - 1) / ((1 - 3) * (1 + 3)) :=
  primer2 1 (by norm_num) (by norm_num)

/-- Primer 2, preizkus pri x = 1: 1/(1 − 9) − 2/4 = −1/8 − 4/8 = −5/8 in (6 − 1)/((1 − 3)(1 + 3)) = 5/(−8) = −5/8.
trditev: MAT-SS-1/ulomljeni-izrazi#primer2-preizkus
besedilo: »Preizkus pri $x = 1$: $\dfrac{1}{1-9} - \dfrac{2}{4} = -\dfrac{1}{8} - \dfrac{4}{8} = -\dfrac{5}{8}$ in $\dfrac{6-1}{(1-3)(1+3)} = \dfrac{5}{-8} = -\dfrac{5}{8}$.« -/
theorem primer2_preizkus : (1 / (1 - 9) - 2 / 4 : ℝ) = -1 / 8 - 4 / 8 ∧ (-1 / 8 - 4 / 8 : ℝ) = -5 / 8 ∧
    ((6 - 1) / ((1 - 3) * (1 + 3)) : ℝ) = 5 / (-8) ∧ (5 / (-8) : ℝ) = -5 / 8 := by norm_num

/-- Primer 3, pogoji: x² − 2x = x(x − 2), x² − 4x + 4 = (x − 2)², x² + 4x + 4 = (x + 2)²; imenovalci x − 2,
x² − 2x, x² + 4x + 4 so različni od 0 natanko pri x ≠ 0, x ≠ 2, x ≠ −2.
trditev: MAT-SS-1/ulomljeni-izrazi#primer3-pogoji
besedilo: »1. Razstavimo imenovalce in števce: $x^2 - 2x = x(x-2)$, $x^2 - 4x + 4 = (x-2)^2$, $x^2 + 4x + 4 = (x+2)^2$. 2. Pogoji: $x \neq 0$, $x \neq 2$ (iz $x(x-2)$) in $x \neq -2$ (iz $(x+2)^2$).« -/
theorem primer3_pogoji (x : ℝ) : x ^ 2 - 2 * x = x * (x - 2) ∧ x ^ 2 - 4 * x + 4 = (x - 2) ^ 2 ∧
    x ^ 2 + 4 * x + 4 = (x + 2) ^ 2 ∧
    (x - 2 ≠ 0 ∧ x ^ 2 - 2 * x ≠ 0 ∧ x ^ 2 + 4 * x + 4 ≠ 0 ↔ x ≠ 0 ∧ x ≠ 2 ∧ x ≠ -2) := by
  refine ⟨by ring, by ring, by ring, ?_⟩
  rw [show x ^ 2 - 2 * x = 1 * ((x - 0) * (x - 2)) by ring, dva_faktorja _ _ _ _ one_ne_zero,
    show x ^ 2 + 4 * x + 4 = 1 * ((x - -2) * (x - -2)) by ring, dva_faktorja _ _ _ _ one_ne_zero,
    sub_ne_zero]
  tauto

/-- Primer 3: za x ≠ 0, 2, −2 je (x/(x − 2) − 4/(x² − 2x))·(x² − 4x + 4)/(x² + 4x + 4)
= (x² − 4)/(x(x − 2)) · (x − 2)²/(x + 2)² = (x + 2)/x · (x − 2)²/(x + 2)² = (x − 2)²/(x(x + 2)); oklepaj
x/(x − 2) = x²/(x(x − 2)) in (x − 2)(x + 2)/(x(x − 2)) = (x + 2)/x.
trditev: MAT-SS-1/ulomljeni-izrazi#primer3
besedilo: »Odgovor: izraz je enak $\dfrac{(x-2)^2}{x(x+2)}$ za $x \neq 0$, $x \neq 2$ in $x \neq -2$.« -/
theorem primer3 (x : ℝ) (h0 : x ≠ 0) (h2 : x ≠ 2) (hm2 : x ≠ -2) :
    x / (x - 2) = x ^ 2 / (x * (x - 2)) ∧
    x / (x - 2) - 4 / (x ^ 2 - 2 * x) = (x + 2) / x ∧
    (x / (x - 2) - 4 / (x ^ 2 - 2 * x)) * ((x ^ 2 - 4 * x + 4) / (x ^ 2 + 4 * x + 4)) =
      (x - 2) ^ 2 / (x * (x + 2)) := by
  have h2' : x - 2 ≠ 0 := sub_ne_zero.mpr h2
  have hm2' : x + 2 ≠ 0 := by intro h; apply hm2; linarith
  have hok : x / (x - 2) - 4 / (x ^ 2 - 2 * x) = (x + 2) / x := by
    calc x / (x - 2) - 4 / (x ^ 2 - 2 * x) = x ^ 2 / (x * (x - 2)) - 4 / (x * (x - 2)) := by
          rw [show x ^ 2 - 2 * x = x * (x - 2) by ring]; field_simp
      _ = (x ^ 2 - 4) / (x * (x - 2)) := (sub_div _ _ _).symm
      _ = (x - 2) * (x + 2) / (x * (x - 2)) := by ring
      _ = (x + 2) / x := by field_simp
  refine ⟨by field_simp, hok, ?_⟩
  calc (x / (x - 2) - 4 / (x ^ 2 - 2 * x)) * ((x ^ 2 - 4 * x + 4) / (x ^ 2 + 4 * x + 4))
      = (x + 2) / x * ((x - 2) ^ 2 / (x + 2) ^ 2) := by
        rw [hok, show x ^ 2 - 4 * x + 4 = (x - 2) ^ 2 by ring, show x ^ 2 + 4 * x + 4 = (x + 2) ^ 2 by ring]
    _ = (x - 2) ^ 2 / (x * (x + 2)) := by field_simp

/-- Predpostavke `primer3` se dajo izpolniti (x = 3). -/
example : (3 : ℝ) / (3 - 2) - 4 / (3 ^ 2 - 2 * 3) = (3 + 2) / 3 :=
  (primer3 3 (by norm_num) (by norm_num) (by norm_num)).2.1

/-- Primer 3, preizkus pri x = 3: oklepaj 3 − 4/3 = 5/3, drugi ulomek 1/25, produkt 5/75 = 1/15 in
(3 − 2)²/(3·5) = 1/15.
trditev: MAT-SS-1/ulomljeni-izrazi#primer3-preizkus
besedilo: »Preizkus pri $x = 3$: oklepaj je $3 - \dfrac{4}{3} = \dfrac{5}{3}$, drugi ulomek je $\dfrac{1}{25}$, produkt $\dfrac{5}{75} = \dfrac{1}{15}$. Rezultat: $\dfrac{(3-2)^2}{3 \cdot 5} = \dfrac{1}{15}$.« -/
theorem primer3_preizkus : ((3 : ℝ) / (3 - 2) - 4 / (3 ^ 2 - 2 * 3)) = 3 - 4 / 3 ∧ (3 - 4 / 3 : ℝ) = 5 / 3 ∧
    (((3 : ℝ) ^ 2 - 4 * 3 + 4) / (3 ^ 2 + 4 * 3 + 4)) = 1 / 25 ∧ (5 / 3 * (1 / 25) : ℝ) = 5 / 75 ∧
    (5 / 75 : ℝ) = 1 / 15 ∧ ((3 - 2) ^ 2 / (3 * 5) : ℝ) = 1 / 15 := by norm_num

/-- Primer 4: 40·60/t = 2400/t, 40·60/(t + 20) = 2400/(t + 20); za t ≠ 0, t ≠ −20 je
2400/t + 2400/(t + 20) = (2400(t + 20) + 2400t)/(t(t + 20)) = (4800t + 48000)/(t(t + 20)) = 4800(t + 10)/(t(t + 20)).
trditev: MAT-SS-1/ulomljeni-izrazi#primer4
besedilo: »Števec je $2400t + 48000 + 2400t = 4800t + 48000 = 4800(t+10)$, torej je skupni čas $\dfrac{4800(t+10)}{t(t+20)}$ sekund.« -/
theorem primer4 (t : ℝ) (h0 : t ≠ 0) (h20 : t ≠ -20) :
    40 * (60 / t) = 2400 / t ∧ 40 * (60 / (t + 20)) = 2400 / (t + 20) ∧
    2400 / t + 2400 / (t + 20) = 4800 * (t + 10) / (t * (t + 20)) := by
  have h20' : t + 20 ≠ 0 := by intro h; apply h20; linarith
  refine ⟨by ring, by ring, ?_⟩
  calc 2400 / t + 2400 / (t + 20) = (2400 * (t + 20) + 2400 * t) / (t * (t + 20)) := by
        rw [div_add_div _ _ h0 h20']; ring
    _ = (4800 * t + 48000) / (t * (t + 20)) := by ring
    _ = 4800 * (t + 10) / (t * (t + 20)) := by ring

/-- Primer 4: tempo je pozitiven, zato sta pogoja t ≠ 0 in t ≠ −20 izpolnjena.
trditev: MAT-SS-1/ulomljeni-izrazi#primer4-pogoj
besedilo: »Tempo je pozitiven, zato sta v glasbi izpolnjena sama od sebe.« -/
theorem primer4_pogoj (t : ℝ) (ht : 0 < t) : t ≠ 0 ∧ t ≠ -20 := ⟨ht.ne', by intro h; linarith⟩

/-- Predpostavke `primer4` in `primer4_pogoj` se dajo izpolniti (t = 100). -/
example : (2400 : ℝ) / 100 + 2400 / (100 + 20) = 4800 * (100 + 10) / (100 * (100 + 20)) ∧
    (100 : ℝ) ≠ 0 ∧ (100 : ℝ) ≠ -20 :=
  ⟨(primer4 100 (by norm_num) (by norm_num)).2.2, primer4_pogoj 100 (by norm_num)⟩

/-- Primer 4, Premisli: pri t = 100 je 4800·110/(100·120) = 528000/12000 = 44 s; uvod 2400/100 = 24 s,
refren 2400/120 = 20 s, skupaj 44 s.
trditev: MAT-SS-1/ulomljeni-izrazi#primer4-vrednost
besedilo: »Pri $t = 100$ je to $\dfrac{4800 \cdot 110}{100 \cdot 120} = \dfrac{528000}{12000} = 44$ sekund. Preizkus: uvod traja $\dfrac{2400}{100} = 24\,\text{s}$, refren $\dfrac{2400}{120} = 20\,\text{s}$, skupaj $44\,\text{s}$.« -/
theorem primer4_vrednost : (4800 * (100 + 10) / (100 * (100 + 20)) : ℝ) = 528000 / 12000 ∧
    (528000 / 12000 : ℝ) = 44 ∧ (2400 / 100 : ℝ) = 24 ∧ (2400 / 120 : ℝ) = 20 ∧ (24 + 20 : ℝ) = 44 := by
  norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1, Ponovitev: (x + 3)/3 ni x (pri x = 3 je 2), (x² + 5)/(x² + 3) ni 5/3 (pri x = 1 je 3/2);
(x² + 2x)/x = x(x + 2)/x = x + 2 za x ≠ 0.
trditev: MAT-SS-1/ulomljeni-izrazi#napaka-cleni
besedilo: »Pravilno: razstavi in krajšaj faktorje, na primer $\dfrac{x^2+2x}{x} = \dfrac{x(x+2)}{x} = x+2$ za $x \neq 0$. Izraz $\dfrac{x+3}{3}$ pri $x = 3$ da $2$, ne $3$.« -/
theorem napaka_cleni : ((3 : ℝ) + 3) / 3 = 2 ∧ (¬ ∀ x : ℝ, (x + 3) / 3 = x) ∧
    (¬ ∀ x : ℝ, (x ^ 2 + 5) / (x ^ 2 + 3) = 5 / 3) ∧
    (∀ x : ℝ, x ≠ 0 → (x ^ 2 + 2 * x) / x = x + 2) := by
  refine ⟨by norm_num, fun h => ?_, fun h => ?_, fun x hx => ?_⟩
  · have := h 3; norm_num at this
  · have := h 1; norm_num at this
  · calc (x ^ 2 + 2 * x) / x = x * (x + 2) / x := by ring
      _ = x + 2 := by field_simp

/-- Pogoste napake 2, Ponovitev, Analogija: za x, y ≠ 0 je 1/x + 1/y = y/(xy) + x/(xy) = (x + y)/(xy); pri
x = y = 2 je vsota 1, napačni 2/(x + y) pa 1/2.
trditev: MAT-SS-1/ulomljeni-izrazi#napaka-sestevanje
besedilo: »Pravilno: $\dfrac{1}{x} + \dfrac{1}{y} = \dfrac{y}{xy} + \dfrac{x}{xy} = \dfrac{x+y}{xy}$. Pri $x = y = 2$ je vsota $1$, napačni izraz pa da $\dfrac{1}{2}$.« -/
theorem napaka_sestevanje (x y : ℝ) (hx : x ≠ 0) (hy : y ≠ 0) :
    1 / x + 1 / y = y / (x * y) + x / (x * y) ∧ 1 / x + 1 / y = (x + y) / (x * y) ∧
    (1 / 2 + 1 / 2 : ℝ) = 1 ∧ (2 / (2 + 2) : ℝ) = 1 / 2 := by
  refine ⟨by field_simp, by field_simp; ring, by norm_num, by norm_num⟩

/-- Predpostavki `napaka_sestevanje` se dajo izpolniti (x = y = 2). -/
example : (1 : ℝ) / 2 + 1 / 2 = (2 + 2) / (2 * 2) := (napaka_sestevanje 2 2 two_ne_zero two_ne_zero).2.1

/-- Pogoste napake 3: za x ≠ −1 je 5x/(x + 1) − (2x − 3)/(x + 1) = (5x − (2x − 3))/(x + 1) = (3x + 3)/(x + 1)
= 3(x + 1)/(x + 1) = 3; napačni (5x − 2x − 3)/(x + 1) ni vedno 3.
trditev: MAT-SS-1/ulomljeni-izrazi#napaka-oklepaj
besedilo: »Pravilno: $\dfrac{5x - (2x-3)}{x+1} = \dfrac{3x+3}{x+1} = \dfrac{3(x+1)}{x+1} = 3$ za $x \neq -1$.« -/
theorem napaka_oklepaj : (∀ x : ℝ, x ≠ -1 → 5 * x / (x + 1) - (2 * x - 3) / (x + 1) = 3) ∧
    ¬ ∀ x : ℝ, x ≠ -1 → (5 * x - 2 * x - 3) / (x + 1) = 3 := by
  refine ⟨fun x hx => ?_, fun h => ?_⟩
  · have h1 : x + 1 ≠ 0 := by intro h; apply hx; linarith
    calc 5 * x / (x + 1) - (2 * x - 3) / (x + 1) = (5 * x - (2 * x - 3)) / (x + 1) := (sub_div _ _ _).symm
      _ = (3 * x + 3) / (x + 1) := by ring
      _ = 3 * (x + 1) / (x + 1) := by ring
      _ = 3 := by field_simp
  · have := h 0 (by norm_num); norm_num at this

/-- Pogoste napake 4: (x² − x)/x = x(x − 1)/x = x − 1 za x ≠ 0; pri x = 0 je imenovalec 0.
trditev: MAT-SS-1/ulomljeni-izrazi#napaka-pogoji
besedilo: »Pravilno: $\dfrac{x(x-1)}{x} = x - 1$ za $x \neq 0$.« -/
theorem napaka_pogoji (x : ℝ) (hx : x ≠ 0) : (x ^ 2 - x) / x = x - 1 := by
  calc (x ^ 2 - x) / x = x * (x - 1) / x := by ring
    _ = x - 1 := by field_simp

/-- Predpostavka `napaka_pogoji` se da izpolniti (x = 2). -/
example : ((2 : ℝ) ^ 2 - 2) / 2 = 2 - 1 := napaka_pogoji 2 two_ne_zero

/-- Pogoste napake 5 in Preveri se 3: za x ≠ 3 je (x − 3)/(3 − x) = (x − 3)/(−(x − 3)) = −1 (ne 1); prav tako
(x − 5)/(5 − x) = −1 za x ≠ 5 (pri x = 7: x − 5 = 2, 5 − x = −2).
trditev: MAT-SS-1/ulomljeni-izrazi#napaka-nasprotna
besedilo: »Pravilno: $\dfrac{x-3}{3-x} = \dfrac{x-3}{-(x-3)} = -1$ za $x \neq 3$.« -/
theorem napaka_nasprotna : (∀ x : ℝ, x ≠ 3 → (x - 3) / (3 - x) = -1) ∧
    (∀ x : ℝ, x ≠ 5 → (x - 5) / (5 - x) = -1) ∧ (7 - 5 : ℝ) = 2 ∧ (5 - 7 : ℝ) = -2 ∧ (-1 : ℝ) ≠ 1 ∧
    (-1 : ℝ) ≠ 0 := by
  refine ⟨fun x hx => (nasprotna x 3 hx).2, fun x hx => (nasprotna x 5 hx).2, by norm_num, by norm_num,
    by norm_num, by norm_num⟩

/-! ## Za maturo -/

/-- Naloga 1: x² − 5x + 6 = (x − 2)(x − 3); 18 − 2x² = 2(9 − x²) = 2(3 − x)(3 + x); imenovalec je 0 natanko pri
x = 3 ali x = −3.
trditev: MAT-SS-1/ulomljeni-izrazi#naloga1-razcep
besedilo: »1. Števec razstavimo po Vietovem pravilu: $x^2 - 5x + 6 = (x - 2)(x - 3)$. 2. Imenovalec: $18 - 2x^2 = 2(9 - x^2) = 2(3 - x)(3 + x)$. Imenovalec je enak $0$ pri $x = 3$ in pri $x = -3$, zato mora veljati $x \neq 3$ in $x \neq -3$.« -/
theorem naloga1_razcep (x : ℝ) : x ^ 2 - 5 * x + 6 = (x - 2) * (x - 3) ∧ 18 - 2 * x ^ 2 = 2 * (9 - x ^ 2) ∧
    2 * (9 - x ^ 2) = 2 * (3 - x) * (3 + x) ∧ (18 - 2 * x ^ 2 ≠ 0 ↔ x ≠ 3 ∧ x ≠ -3) := by
  refine ⟨by ring, by ring, by ring, ?_⟩
  rw [show 18 - 2 * x ^ 2 = (-2) * ((x - 3) * (x - -3)) by ring, dva_faktorja _ _ _ _ (by norm_num)]

/-- Naloga 1: za x ≠ ±3 je (x² − 5x + 6)/(18 − 2x²) = (x − 2)(x − 3)/(−2(x − 3)(x + 3)) = −(x − 2)/(2(x + 3))
= (2 − x)/(2(x + 3)).
trditev: MAT-SS-1/ulomljeni-izrazi#naloga1
besedilo: »Odgovor: $\dfrac{x^2 - 5x + 6}{18 - 2x^2} = \dfrac{2 - x}{2(x + 3)}$ za $x \neq 3$ in $x \neq -3$.« -/
theorem naloga1 (x : ℝ) (h3 : x ≠ 3) (hm3 : x ≠ -3) :
    (x ^ 2 - 5 * x + 6) / (18 - 2 * x ^ 2) = (2 - x) / (2 * (x + 3)) := by
  have h3' : x - 3 ≠ 0 := sub_ne_zero.mpr h3
  have hm3' : x + 3 ≠ 0 := by intro h; apply hm3; linarith
  calc (x ^ 2 - 5 * x + 6) / (18 - 2 * x ^ 2) = (x - 2) * (x - 3) / (-2 * (x - 3) * (x + 3)) := by ring
    _ = -((x - 2) / (2 * (x + 3))) := by field_simp
    _ = (2 - x) / (2 * (x + 3)) := by ring

/-- Predpostavki `naloga1` se dajo izpolniti (x = 0). -/
example : ((0 : ℝ) ^ 2 - 5 * 0 + 6) / (18 - 2 * 0 ^ 2) = (2 - 0) / (2 * (0 + 3)) :=
  naloga1 0 (by norm_num) (by norm_num)

/-- Naloga 1, preizkus pri x = 0: 6/18 = 1/3 in 2/6 = 1/3.
trditev: MAT-SS-1/ulomljeni-izrazi#naloga1-preizkus
besedilo: »Preizkus pri $x = 0$: $\dfrac{6}{18} = \dfrac{1}{3}$ in $\dfrac{2}{6} = \dfrac{1}{3}$.« -/
theorem naloga1_preizkus : (6 / 18 : ℝ) = 1 / 3 ∧ (2 / 6 : ℝ) = 1 / 3 := by norm_num

/-- Naloga 2 a): vsi imenovalci (x − 1, x + 1, x² − 1) in delitelj 2x/(x² − 1) so različni od 0 natanko tedaj, ko
x ≠ 1, x ≠ −1 in x ≠ 0.
trditev: MAT-SS-1/ulomljeni-izrazi#naloga2a
besedilo: »Izraz ni definiran pri $x = 1$, $x = -1$ in $x = 0$.« -/
theorem naloga2a (x : ℝ) : (x - 1 ≠ 0 ∧ x + 1 ≠ 0 ∧ x ^ 2 - 1 ≠ 0 ∧ 2 * x / (x ^ 2 - 1) ≠ 0) ↔
    x ≠ 1 ∧ x ≠ -1 ∧ x ≠ 0 := by
  have e : x ^ 2 - 1 = 1 * ((x - 1) * (x - -1)) := by ring
  constructor
  · rintro ⟨h1, h2, h3, h4⟩
    refine ⟨sub_ne_zero.mp h1, fun h => h2 (by rw [h]; norm_num), fun h => h4 (by rw [h]; norm_num)⟩
  · rintro ⟨h1, h2, h0⟩
    have h3 : x ^ 2 - 1 ≠ 0 := by rw [e, dva_faktorja _ _ _ _ one_ne_zero]; exact ⟨h1, h2⟩
    refine ⟨sub_ne_zero.mpr h1, fun h => h2 (by linarith), h3, div_ne_zero (by simpa using h0) h3⟩

/-- Naloga 2 b): (x² + 2x + 1) − (x² − 2x + 1) = 4x in za x ≠ ±1 je
(x + 1)/(x − 1) − (x − 1)/(x + 1) = ((x + 1)² − (x − 1)²)/((x − 1)(x + 1)) = 4x/((x − 1)(x + 1)).
trditev: MAT-SS-1/ulomljeni-izrazi#naloga2b
besedilo: »Števec: $(x^2 + 2x + 1) - (x^2 - 2x + 1) = 4x$. Razlika v oklepaju je $\dfrac{4x}{(x - 1)(x + 1)}$.« -/
theorem naloga2b (x : ℝ) (h1 : x ≠ 1) (hm1 : x ≠ -1) :
    (x ^ 2 + 2 * x + 1) - (x ^ 2 - 2 * x + 1) = 4 * x ∧
    (x + 1) / (x - 1) - (x - 1) / (x + 1) = 4 * x / ((x - 1) * (x + 1)) := by
  have h1' : x - 1 ≠ 0 := sub_ne_zero.mpr h1
  have hm1' : x + 1 ≠ 0 := by intro h; apply hm1; linarith
  refine ⟨by ring, ?_⟩
  calc (x + 1) / (x - 1) - (x - 1) / (x + 1) = ((x + 1) ^ 2 - (x - 1) ^ 2) / ((x - 1) * (x + 1)) := by
        rw [div_sub_div _ _ h1' hm1']; ring
    _ = 4 * x / ((x - 1) * (x + 1)) := by ring

/-- Predpostavki `naloga2b` se dajo izpolniti (x = 2). -/
example : ((2 : ℝ) + 1) / (2 - 1) - (2 - 1) / (2 + 1) = 4 * 2 / ((2 - 1) * (2 + 1)) :=
  (naloga2b 2 (by norm_num) (by norm_num)).2

/-- Naloga 2 c): za x ≠ 1, −1, 0 je izraz 4x/((x − 1)(x + 1)) · (x − 1)(x + 1)/(2x) = 2, neodvisno od x.
trditev: MAT-SS-1/ulomljeni-izrazi#naloga2c
besedilo: »izraz je za vse dopustne $x$ enak $2$, njegova vrednost ni odvisna od $x$.« -/
theorem naloga2c (x : ℝ) (h1 : x ≠ 1) (hm1 : x ≠ -1) (h0 : x ≠ 0) :
    ((x + 1) / (x - 1) - (x - 1) / (x + 1)) / (2 * x / (x ^ 2 - 1)) = 2 := by
  have h1' : x - 1 ≠ 0 := sub_ne_zero.mpr h1
  have hm1' : x + 1 ≠ 0 := by intro h; apply hm1; linarith
  calc ((x + 1) / (x - 1) - (x - 1) / (x + 1)) / (2 * x / (x ^ 2 - 1))
      = 4 * x / ((x - 1) * (x + 1)) * ((x - 1) * (x + 1) / (2 * x)) := by
        rw [(naloga2b x h1 hm1).2, show x ^ 2 - 1 = (x - 1) * (x + 1) by ring, div_div_eq_mul_div,
          mul_div_assoc]
    _ = 2 := by field_simp; ring

/-- Predpostavke `naloga2c` se dajo izpolniti (x = 2). -/
example : (((2 : ℝ) + 1) / (2 - 1) - (2 - 1) / (2 + 1)) / (2 * 2 / (2 ^ 2 - 1)) = 2 :=
  naloga2c 2 (by norm_num) (by norm_num) (by norm_num)

/-- Naloga 2 c), preizkus pri x = 2: (3 − 1/3) : 4/3 = 8/3 · 3/4 = 2.
trditev: MAT-SS-1/ulomljeni-izrazi#naloga2c-preizkus
besedilo: »Preizkus pri $x = 2$: $\left(3 - \dfrac{1}{3}\right) : \dfrac{4}{3} = \dfrac{8}{3} \cdot \dfrac{3}{4} = 2$.« -/
theorem naloga2c_preizkus : ((3 - 1 / 3) / (4 / 3) : ℝ) = 8 / 3 * (3 / 4) ∧ (8 / 3 * (3 / 4) : ℝ) = 2 := by
  norm_num

/-! ## Drugače -/

/-- Analogija (mreža): 1/3 = 4/12, 1/4 = 3/12, 1/3 + 1/4 = 7/12.
trditev: MAT-SS-1/ulomljeni-izrazi#mreza
besedilo: »Mreža dvanajstin ustreza obema: triolska osminka zasede $4$ kvadratke, šestnajstinka $3$. Skupaj je to $7$ kvadratkov od $12$, torej $\dfrac{1}{3} + \dfrac{1}{4} = \dfrac{7}{12}$ udarca.« -/
theorem mreza : (1 / 3 : ℝ) = 4 / 12 ∧ (1 / 4 : ℝ) = 3 / 12 ∧ (1 / 3 + 1 / 4 : ℝ) = 7 / 12 := by norm_num

/-- Bolj natančno: x²/x = x za x ≠ 0.
trditev: MAT-SS-1/ulomljeni-izrazi#x2-x
besedilo: »Pravimo, da sta enaka na skupnem definicijskem območju, to je za vse $x \neq 0$.« -/
theorem x2_x (x : ℝ) (hx : x ≠ 0) : x ^ 2 / x = x := by field_simp

/-- Predpostavka `x2_x` se da izpolniti (x = 2). -/
example : (2 : ℝ) ^ 2 / 2 = 2 := x2_x 2 two_ne_zero

/-- Bolj natančno: za x ≠ ±3 je (x² − x − 6)/(x² − 9) = (x + 2)(x − 3)/((x − 3)(x + 3)) = (x + 2)/(x + 3).
trditev: MAT-SS-1/ulomljeni-izrazi#bolj-natancno
besedilo: »$\dfrac{x^2-x-6}{x^2-9} = \dfrac{(x+2)(x-3)}{(x-3)(x+3)} = \dfrac{x+2}{x+3}$ za $x \neq 3$ in $x \neq -3$« -/
theorem bolj_natancno (x : ℝ) (h3 : x ≠ 3) (_hm3 : x ≠ -3) :
    (x ^ 2 - x - 6) / (x ^ 2 - 9) = (x + 2) / (x + 3) := by
  have h3' : x - 3 ≠ 0 := sub_ne_zero.mpr h3
  calc (x ^ 2 - x - 6) / (x ^ 2 - 9) = ((x + 2) * (x - 3)) / ((x + 3) * (x - 3)) := by ring
    _ = (x + 2) / (x + 3) := mul_div_mul_right _ _ h3'

/-- Predpostavki `bolj_natancno` se dajo izpolniti (x = 0). -/
example : ((0 : ℝ) ^ 2 - 0 - 6) / (0 ^ 2 - 9) = (0 + 2) / (0 + 3) := bolj_natancno 0 (by norm_num) (by norm_num)

/-- Bolj natančno, tabela: pri x = 0: −6/−9 = 2/3 = 2/3; pri x = 2: −4/−5 = 4/5; pri x = 3 sta števec in
imenovalec prvotnega ulomka 0, okrajšani pa da 5/6.
trditev: MAT-SS-1/ulomljeni-izrazi#bolj-natancno-tabela
besedilo: »| $0$ | $\dfrac{-6}{-9} = \dfrac{2}{3}$ | $\dfrac{2}{3}$ | | $2$ | $\dfrac{-4}{-5} = \dfrac{4}{5}$ | $\dfrac{4}{5}$ | | $3$ | $\dfrac{0}{0}$, ni definiran | $\dfrac{5}{6}$ |« -/
theorem bolj_natancno_tabela : ((-6) / (-9) : ℝ) = 2 / 3 ∧ ((0 + 2) / (0 + 3) : ℝ) = 2 / 3 ∧
    ((-4) / (-5) : ℝ) = 4 / 5 ∧ ((2 + 2) / (2 + 3) : ℝ) = 4 / 5 ∧ (3 : ℝ) ^ 2 - 3 - 6 = 0 ∧
    (3 : ℝ) ^ 2 - 9 = 0 ∧ ((3 + 2) / (3 + 3) : ℝ) = 5 / 6 ∧ (0 : ℝ) ^ 2 - 0 - 6 = -6 ∧
    (0 : ℝ) ^ 2 - 9 = -9 ∧ (2 : ℝ) ^ 2 - 2 - 6 = -4 ∧ (2 : ℝ) ^ 2 - 9 = -5 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1: pri 60/t je imenovalec t enak 0 le pri t = 0, zato izločimo samo t = 0; za vsak t ≠ 0 je
60/t res število s (60/t)·t = 60; napačni odgovor: rezultat 0 da 0/t, ne 60/t (60/t ≠ 0 za t ≠ 0); pri 0 < t < 60
je 60/t > 1 (udarec traja dlje kot 1 s), izraz pa je še vedno definiran.
trditev: MAT-SS-1/ulomljeni-izrazi#preveri1
besedilo: »Pri $\dfrac{60}{t}$ izločimo samo $t = 0$.« -/
theorem preveri1 : {t : ℝ | t = 0} = {0} ∧ (∀ t : ℝ, t ≠ 0 → 60 / t * t = 60) ∧
    (∀ t : ℝ, t ≠ 0 → (0 : ℝ) / t = 0 ∧ 60 / t ≠ 0) ∧ (∀ t : ℝ, 0 < t → t < 60 → 1 < 60 / t) := by
  refine ⟨rfl, fun t ht => div_mul_cancel₀ 60 ht, fun t ht => ⟨zero_div t, div_ne_zero (by norm_num) ht⟩,
    fun t h0 h60 => ?_⟩
  rw [lt_div_iff₀ h0]; linarith

/-- Predpostavke `preveri1` se dajo izpolniti (t = 40). -/
example : (60 : ℝ) / 40 * 40 = 60 ∧ 1 < (60 : ℝ) / 40 :=
  ⟨preveri1.2.1 40 (by norm_num), preveri1.2.2.2 40 (by norm_num) (by norm_num)⟩

/-- Preveri se 4: za x ≠ ±1 je 3/(x − 1) − 2/(x + 1) = (3(x + 1) − 2(x − 1))/((x − 1)(x + 1)) = (x + 5)/(x² − 1);
3(x + 1) − 2(x − 1) = 3x + 3 − 2x + 2 = x + 5; napačna odgovora pri x = 2 data 1 in 7/4 namesto 7/3.
trditev: MAT-SS-1/ulomljeni-izrazi#preveri4
besedilo: »Skupni imenovalec je $(x-1)(x+1) = x^2 - 1$. Števec je $3(x+1) - 2(x-1) = 3x + 3 - 2x + 2 = x + 5$.« -/
theorem preveri4 (x : ℝ) (h1 : x ≠ 1) (hm1 : x ≠ -1) :
    3 * (x + 1) - 2 * (x - 1) = 3 * x + 3 - 2 * x + 2 ∧ 3 * x + 3 - 2 * x + 2 = x + 5 ∧
    3 / (x - 1) - 2 / (x + 1) = (x + 5) / (x ^ 2 - 1) ∧
    ((2 + 5) / (2 ^ 2 - 1) : ℝ) = 7 / 3 ∧ ((2 + 1) / (2 ^ 2 - 1) : ℝ) = 1 ∧ ((2 + 5) / (2 * 2) : ℝ) = 7 / 4 := by
  have h1' : x - 1 ≠ 0 := sub_ne_zero.mpr h1
  have hm1' : x + 1 ≠ 0 := by intro h; apply hm1; linarith
  refine ⟨by ring, by ring, ?_, by norm_num, by norm_num, by norm_num⟩
  calc 3 / (x - 1) - 2 / (x + 1) = (3 * (x + 1) - 2 * (x - 1)) / ((x - 1) * (x + 1)) := by
        rw [div_sub_div _ _ h1' hm1']; ring
    _ = (x + 5) / (x ^ 2 - 1) := by ring

/-- Predpostavki `preveri4` se dajo izpolniti (x = 2). -/
example : (3 : ℝ) / (2 - 1) - 2 / (2 + 1) = (2 + 5) / (2 ^ 2 - 1) :=
  (preveri4 2 (by norm_num) (by norm_num)).2.2.1

/-- Preveri se 5: za x ≠ 2, 0, −1 je (x + 1)/(x − 2) · (x² − 4)/(x² + x) = (x + 1)/(x − 2) · (x − 2)(x + 2)/(x(x + 1))
= (x + 2)/x; napačni odgovori pri x = 1 dajo −1, 3/2, 6 namesto 3.
trditev: MAT-SS-1/ulomljeni-izrazi#preveri5
besedilo: »Razstavimo: $\dfrac{x+1}{x-2} \cdot \dfrac{(x-2)(x+2)}{x(x+1)}$. Okrajšamo $x+1$ in $x-2$, ostane $\dfrac{x+2}{x}$.« -/
theorem preveri5 (x : ℝ) (h2 : x ≠ 2) (h0 : x ≠ 0) (hm1 : x ≠ -1) :
    (x + 1) / (x - 2) * ((x ^ 2 - 4) / (x ^ 2 + x)) = (x + 2) / x ∧
    ((1 + 2) / 1 : ℝ) = 3 ∧ ((1 - 2) / 1 : ℝ) = -1 ∧ ((1 + 2) / (1 + 1) : ℝ) = 3 / 2 ∧
    ((1 + 1) * (1 + 2) / 1 : ℝ) = 6 := by
  have h2' : x - 2 ≠ 0 := sub_ne_zero.mpr h2
  have hm1' : x + 1 ≠ 0 := by intro h; apply hm1; linarith
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num⟩
  calc (x + 1) / (x - 2) * ((x ^ 2 - 4) / (x ^ 2 + x))
      = (x + 1) / (x - 2) * ((x - 2) * (x + 2) / (x * (x + 1))) := by ring
    _ = (x + 2) / x := by field_simp

/-- Predpostavke `preveri5` se dajo izpolniti (x = 1). -/
example : ((1 : ℝ) + 1) / (1 - 2) * ((1 ^ 2 - 4) / (1 ^ 2 + 1)) = (1 + 2) / 1 :=
  (preveri5 1 (by norm_num) (by norm_num) (by norm_num)).1

/-- Preveri se 6: pri x = 100 je (x − 3)/x = 97/100 = 0,97 in (10000 − 9)/(10000 + 300) = 9991/10300 = 0,97;
napačna 103/100 in −9/300 nista 0,97.
trditev: MAT-SS-1/ulomljeni-izrazi#preveri6
besedilo: »pri $x = 100$ je to $\dfrac{97}{100} = 0{,}97$. Preizkus brez krajšanja: $\dfrac{10\,000 - 9}{10\,000 + 300} = \dfrac{9\,991}{10\,300} = 0{,}97$.« -/
theorem preveri6 : ((100 : ℝ) - 3) / 100 = 97 / 100 ∧ ((100 : ℝ) ^ 2 - 9) / (100 ^ 2 + 3 * 100) = 97 / 100 ∧
    ((10000 - 9) / (10000 + 300) : ℝ) = 9991 / 10300 ∧ (9991 / 10300 : ℝ) = 97 / 100 ∧
    ((100 : ℝ) + 3) / 100 ≠ 97 / 100 ∧ (-9 : ℝ) / (3 * 100) ≠ 97 / 100 := by norm_num

/-! ## RACUN -/

/-- Blok RACUN: vrstice vrednost in razcepi brez ulomkov; vrstice z ulomki so dokazane s pogoji v `primer1`,
`primer2`, `primer3`, `primer4`, `preveri4`, `preveri5`, `naloga1`, `naloga2b`, `naloga2c`, `razlicna_imenovalca`.
pomozno – zbirka vrednosti iz skritega bloka RACUN -/
theorem racun :
    ((4800*(100+10)/(100*(100+20)) : ℝ) = 44) ∧ (((100:ℝ)-3)/100 = 0.97) ∧
    (∀ x : ℝ, x^2-5*x+6 = (x-2)*(x-3)) ∧ (∀ x : ℝ, 18-2*x^2 = 2*(3-x)*(3+x)) ∧
    (((0:ℝ)^2-5*0+6)/(18-2*0^2) = 1/3) ∧ (∀ x : ℝ, (x+1)^2-(x-1)^2 = 4*x) ∧
    (((3:ℝ)-1/3)/(4/3) = 2) := by
  refine ⟨by norm_num, by norm_num, fun x => by ring, fun x => by ring, by norm_num, fun x => by ring,
    by norm_num⟩

end Evklid.Lekcije.MAT_SS_1.UlomljeniIzrazi
