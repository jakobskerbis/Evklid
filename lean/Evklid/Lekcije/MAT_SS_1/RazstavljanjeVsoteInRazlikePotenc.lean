/-
vir: content/lessons/MAT-SS-1/razstavljanje-vsote-in-razlike-potenc.md
sha256: 03d29c49f61f4a66981dd08fb93b71365da96486063217503be3c2c7649d18a6
Ni v Leanu: zgodovina (Mersenne, glasba) in vprašanje, za katere n je 2ⁿ − 1 praštevilo (lekcija ga ne reši;
dokazano je, da so 3, 7, 31, 127, 1023 števila 2ⁿ − 1 za n = 2, 3, 5, 7, 10); risba (kocka brez kocke) in
simulacija (dokazane so prostornine plošč in enakost (x + 3)(x − 3) = x² − 9); pravila za znake, postopki in
nasveti (»najprej izpostavi«, »pri sodem eksponentu začni z razliko kvadratov«, »prva pot takoj pride do
konca«, vrstni red korakov v Preveri se 5) kot navodila; trditev, da je razcep »dokončan« oz. »popoln« in da
se x³ + 9 ne razstavi s celimi koeficienti, ker nerazstavljivost s celimi koeficienti ni formalizirana (dokazano
je, da 9 ni kub celega števila); »a⁴ + b⁴ se da razstaviti z zahtevnejšim prijemom« (ni izpeljano v lekciji);
analogija z zborom in metronomom kot opis (dokazano: vsota eksponentov je n − 1 in pri sodem n zapis z
izmeničnimi znaki da aⁿ − bⁿ); točkovanje maturitetnih nalog; besedila napačnih odgovorov v Preveri se
(dokazano je, da so napačne vrednosti oz. razcepi res napačni).
»Drugi oklepaj a² ± ab + b² se z realnimi števili ne razstavi naprej« je dokazano kot: za b ≠ 0 ni realnih m, n,
da bi za vse a veljalo a² ± ab + b² = (a + m)(a + n) (pri b = 0 je izraz a², ki pa ni drugi oklepaj nobenega
kuba z b ≠ 0). »Ni faktor« je dokazano močneje: ni funkcije q, da bi izraz bil (faktor)·q za vse vrednosti.
Lean: x/0 = 0, zato krajšanje ulomkov (x⁵ − 1)/(x − 1) in A/B nosi lekcijine pogoje x ≠ 1 oz. x ≠ ±1/2
(vrstica RACUN (8x³ + 1)/(4x² − 1) = (4x² − 2x + 1)/(2x − 1) je dokazana s tem pogojem; pri x = −1/2 bi bila
v Leanu napačna). Odštevanje v eksponentih n − 1 − i je v ℕ, uporablja se le za i < n.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_1.RazstavljanjeVsoteInRazlikePotenc

open Finset

/-! ## Razlaga 1–3: razlika in vsota kubov -/

/-- Razlaga 1 (tabela plošč): a²(a − b) + ab(a − b) + b²(a − b) = a³ − b³.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#plosce
besedilo: »Ostane telo s prostornino $a^3 - b^3$. To telo razrežemo na tri plošče, ki so vse debele $a - b$« -/
theorem plosce (a b : ℝ) : a ^ 2 * (a - b) + a * b * (a - b) + b ^ 2 * (a - b) = a ^ 3 - b ^ 3 := by ring

/-- Razlaga 1, Povzetek, Ustno vprašanje 1: a³ − b³ = (a − b)(a² + ab + b²), preverjeno z množenjem
a³ + a²b + ab² − a²b − ab² − b³.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#razlika-kubov
besedilo: »Velja $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$, kar potrdimo z množenjem: $a^3 + a^2b + ab^2 - a^2b - ab^2 - b^3 = a^3 - b^3$.« -/
theorem razlika_kubov (a b : ℝ) : a ^ 3 - b ^ 3 = (a - b) * (a ^ 2 + a * b + b ^ 2) := by
  calc a ^ 3 - b ^ 3 = a ^ 3 + a ^ 2 * b + a * b ^ 2 - a ^ 2 * b - a * b ^ 2 - b ^ 3 := by ring
    _ = (a - b) * (a ^ 2 + a * b + b ^ 2) := by ring

/-- Razlaga 1: preizkus pri a = 4, b = 3: 64 − 27 = 37 = (4 − 3)(16 + 12 + 9).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#preizkus-4-3
besedilo: »Preizkus s številkami: pri $a = 4$ in $b = 3$ je $64 - 27 = 37$ in $(4 - 3)(16 + 12 + 9) = 37$.« -/
theorem preizkus_4_3 : (4 : ℝ) ^ 3 - 3 ^ 3 = 64 - 27 ∧ (64 - 27 : ℝ) = 37 ∧
    ((4 - 3) * (16 + 12 + 9) : ℝ) = 37 := by norm_num

/-- Razlaga 1, Premisli: 999 = 10³ − 1³ = (10 − 1)(100 + 10 + 1) = 9·111.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#devetsto99
besedilo: »$a = 10$, $b = 1$: $(10 - 1)(100 + 10 + 1) = 9 \cdot 111 = 999$.« -/
theorem devetsto99 : (999 : ℝ) = 10 ^ 3 - 1 ^ 3 ∧ (10 : ℝ) ^ 3 - 1 ^ 3 = (10 - 1) * (100 + 10 + 1) ∧
    ((10 - 1) * (100 + 10 + 1) : ℝ) = 9 * 111 ∧ (9 * 111 : ℝ) = 999 := by norm_num

/-- Razlaga 2, Ustno vprašanje 1: (−b)³ = −b³, a³ + b³ = a³ − (−b)³ = (a + b)(a² − ab + b²).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#vsota-kubov
besedilo: »Ker je $(-b)^3 = -b^3$, lahko vsoto zapišemo kot razliko $a^3 + b^3 = a^3 - (-b)^3$. V obrazec za razliko kubov vstavimo $-b$ namesto $b$ in dobimo $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$.« -/
theorem vsota_kubov (a b : ℝ) : (-b) ^ 3 = -b ^ 3 ∧ a ^ 3 + b ^ 3 = a ^ 3 - (-b) ^ 3 ∧
    a ^ 3 + b ^ 3 = (a + b) * (a ^ 2 - a * b + b ^ 2) := by
  refine ⟨by ring, by ring, ?_⟩
  calc a ^ 3 + b ^ 3 = a ^ 3 - (-b) ^ 3 := by ring
    _ = (a - -b) * (a ^ 2 + a * -b + (-b) ^ 2) := razlika_kubov a (-b)
    _ = (a + b) * (a ^ 2 - a * b + b ^ 2) := by ring

/-- Razlaga 2, Povzetek, Ustno vprašanje 1: drugi oklepaj a² + ab + b² (b ≠ 0) se z realnimi števili ne razstavi
naprej: ni realnih m, n, da bi za vse a veljalo a² + ab + b² = (a + m)(a + n).
pomozno – lekcija pove le skupaj za oba oklepaja (a² ± ab + b²); izrek dokaže le a² + ab + b², oklepaj z − dokaže drugi_oklepaj_vsota -/
theorem drugi_oklepaj_razlika (b : ℝ) (hb : b ≠ 0) :
    ¬ ∃ m n : ℝ, ∀ a : ℝ, a ^ 2 + a * b + b ^ 2 = (a + m) * (a + n) := by
  rintro ⟨m, n, h⟩
  have h0 := h (-m)
  rw [show -m + m = 0 by ring, zero_mul] at h0
  have hb2 : 0 < b ^ 2 := by positivity
  nlinarith [sq_nonneg (2 * m - b)]

/-- Predpostavka `drugi_oklepaj_razlika` se da izpolniti (b = 1). -/
example : ¬ ∃ m n : ℝ, ∀ a : ℝ, a ^ 2 + a * 1 + 1 ^ 2 = (a + m) * (a + n) :=
  drugi_oklepaj_razlika 1 one_ne_zero

/-- Razlaga 2, Povzetek: drugi oklepaj a² − ab + b² (b ≠ 0) se z realnimi števili ne razstavi naprej.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#drugi-oklepaj-vsota
besedilo: »Faktor $a^2 - 3a + 9$ je drugi oklepaj obrazca za vsoto kubov, zato se z realnimi števili ne razstavi naprej.« -/
theorem drugi_oklepaj_vsota (b : ℝ) (hb : b ≠ 0) :
    ¬ ∃ m n : ℝ, ∀ a : ℝ, a ^ 2 - a * b + b ^ 2 = (a + m) * (a + n) := by
  rintro ⟨m, n, h⟩
  have h0 := h (-m)
  rw [show -m + m = 0 by ring, zero_mul] at h0
  have hb2 : 0 < b ^ 2 := by positivity
  nlinarith [sq_nonneg (2 * m + b)]

/-- Predpostavka `drugi_oklepaj_vsota` se da izpolniti (b = 3, Primer 2: a² − 3a + 9). -/
example : ¬ ∃ m n : ℝ, ∀ a : ℝ, a ^ 2 - a * 3 + 3 ^ 2 = (a + m) * (a + n) :=
  drugi_oklepaj_vsota 3 (by norm_num)

/-- Razlaga 2 in 3, Povzetek: drugi oklepaj ni kvadrat dvočlenika: a² ± ab + b² ni (a + b)² ne (a − b)²
(za vse a, b).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#ni-kvadrat
besedilo: »Prav tako drugi oklepaj ni $(a - b)^2$ ali $(a + b)^2$.« -/
theorem ni_kvadrat : (¬ ∀ a b : ℝ, a ^ 2 + a * b + b ^ 2 = (a + b) ^ 2) ∧
    (¬ ∀ a b : ℝ, a ^ 2 + a * b + b ^ 2 = (a - b) ^ 2) ∧
    (¬ ∀ a b : ℝ, a ^ 2 - a * b + b ^ 2 = (a + b) ^ 2) ∧
    (¬ ∀ a b : ℝ, a ^ 2 - a * b + b ^ 2 = (a - b) ^ 2) := by
  refine ⟨fun h => ?_, fun h => ?_, fun h => ?_, fun h => ?_⟩ <;> · have := h 1 1; norm_num at this

/-- Razlaga 3, Povzetek: a³ − b³ ≠ (a − b)³ v splošnem (pri a = 2, b = 1: 8 − 1 = 7, (2 − 1)³ = 1).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#razlika-ni-kub
besedilo: »Razlika kubov ni isto kot kub razlike: $a^3 - b^3 \neq (a - b)^3$« -/
theorem razlika_ni_kub : (2 : ℝ) ^ 3 - 1 ^ 3 = 7 ∧ (2 - 1 : ℝ) ^ 3 = 1 ∧
    ¬ ∀ a b : ℝ, a ^ 3 - b ^ 3 = (a - b) ^ 3 := by
  refine ⟨by norm_num, by norm_num, fun h => ?_⟩
  have := h 2 1; norm_num at this

/-! ## Razlaga 4–6: višje potence -/

/-- Razlaga 4, tabela: aⁿ − bⁿ = (a − b)(…) za n = 2, 3, 4, 5.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#tabela
besedilo: »| $4$ | $a^3 + a^2b + ab^2 + b^3$ |« -/
theorem tabela (a b : ℝ) : a ^ 2 - b ^ 2 = (a - b) * (a + b) ∧
    a ^ 3 - b ^ 3 = (a - b) * (a ^ 2 + a * b + b ^ 2) ∧
    a ^ 4 - b ^ 4 = (a - b) * (a ^ 3 + a ^ 2 * b + a * b ^ 2 + b ^ 3) ∧
    a ^ 5 - b ^ 5 = (a - b) * (a ^ 4 + a ^ 3 * b + a ^ 2 * b ^ 2 + a * b ^ 3 + b ^ 4) := by
  refine ⟨by ring, by ring, by ring, by ring⟩

/-- Razlaga 4, Povzetek, Ustno vprašanje 2: za vsak naravni n je
aⁿ − bⁿ = (a − b)(aⁿ⁻¹ + aⁿ⁻²b + … + bⁿ⁻¹) = (a − b)·Σ_{i<n} aⁿ⁻¹⁻ⁱ bⁱ.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#razlika-potenc
besedilo: »Za vsak naravni $n$ velja $$a^n - b^n = (a - b)(a^{n-1} + a^{n-2}b + \ldots + ab^{n-2} + b^{n-1})$$« -/
theorem razlika_potenc (a b : ℝ) (n : ℕ) :
    a ^ n - b ^ n = (a - b) * ∑ i ∈ range n, a ^ (n - 1 - i) * b ^ i := by
  rw [← geom_sum₂_mul, mul_comm (a - b)]
  congr 1
  rw [← sum_range_reflect (fun i => a ^ (n - 1 - i) * b ^ i) n]
  refine sum_congr rfl fun i hi => ?_
  rw [mem_range] at hi
  rw [show n - 1 - (n - 1 - i) = i by omega]

/-- Razlaga 4 in Analogija: v drugem faktorju je n členov in vsota eksponentov vsakega člena je n − 1.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#stevilo-clenov
besedilo: »Na vsakem koraku je vsota obeh »višin« (eksponentov) enaka $n - 1$« -/
theorem stevilo_clenov (n : ℕ) : (range n).card = n ∧ ∀ i ∈ range n, (n - 1 - i) + i = n - 1 := by
  refine ⟨card_range n, fun i hi => ?_⟩
  rw [mem_range] at hi
  omega

/-- Razlaga 4: (x⁵ − 1)/(x − 1) = x⁴ + x³ + x² + x + 1 za x ≠ 1.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#krajsanje-x5
besedilo: »S tem tudi krajšamo: $\dfrac{x^5 - 1}{x - 1} = x^4 + x^3 + x^2 + x + 1$ za $x \neq 1$.« -/
theorem krajsanje_x5 (x : ℝ) (hx : x ≠ 1) : (x ^ 5 - 1) / (x - 1) = x ^ 4 + x ^ 3 + x ^ 2 + x + 1 := by
  have h : x - 1 ≠ 0 := sub_ne_zero.mpr hx
  rw [div_eq_iff h]
  ring

/-- Predpostavka `krajsanje_x5` se da izpolniti (x = 2: 31/1 = 31). -/
example : ((2 : ℝ) ^ 5 - 1) / (2 - 1) = 2 ^ 4 + 2 ^ 3 + 2 ^ 2 + 2 + 1 := krajsanje_x5 2 (by norm_num)

/-- Razlaga 5 in Analogija (pomožno): (a + b)·Σ_{i<n} (−1)ⁱ aⁿ⁻¹⁻ⁱ bⁱ = aⁿ − (−b)ⁿ (vstavimo −b namesto b).
pomozno – pomožna identiteta z vstavljenim −b namesto b, iz katere sledita vsota_lihih in sodi_izmenicno -/
theorem izmenicna (a b : ℝ) (n : ℕ) :
    (a + b) * ∑ i ∈ range n, (-1) ^ i * a ^ (n - 1 - i) * b ^ i = a ^ n - (-b) ^ n := by
  rw [razlika_potenc a (-b) n, sub_neg_eq_add]
  congr 1
  refine sum_congr rfl fun i _ => ?_
  rw [neg_pow]; ring

/-- Razlaga 5, Povzetek, Ustno vprašanje 3: za lih n je aⁿ + bⁿ = (a + b)(aⁿ⁻¹ − aⁿ⁻²b + … + bⁿ⁻¹).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#vsota-lihih
besedilo: »Izraz $a^n + b^n$ ima faktor $a + b$, kadar je eksponent $n$ lih.« -/
theorem vsota_lihih (a b : ℝ) (n : ℕ) (hn : Odd n) :
    a ^ n + b ^ n = (a + b) * ∑ i ∈ range n, (-1) ^ i * a ^ (n - 1 - i) * b ^ i := by
  rw [izmenicna, hn.neg_pow, sub_neg_eq_add]

/-- Predpostavka `vsota_lihih` se da izpolniti (n = 9, Preveri se 3: a⁹ + b⁹ ima faktor a + b). -/
example (a b : ℝ) : a ^ 9 + b ^ 9 = (a + b) * ∑ i ∈ range 9, (-1) ^ i * a ^ (9 - 1 - i) * b ^ i :=
  vsota_lihih a b 9 (by decide)

/-- Razlaga 5: a⁵ + b⁵ = (a + b)(a⁴ − a³b + a²b² − ab³ + b⁴).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#vsota-petih
besedilo: »Na primer $a^5 + b^5 = (a + b)(a^4 - a^3b + a^2b^2 - ab^3 + b^4)$.« -/
theorem vsota_petih (a b : ℝ) :
    a ^ 5 + b ^ 5 = (a + b) * (a ^ 4 - a ^ 3 * b + a ^ 2 * b ^ 2 - a * b ^ 3 + b ^ 4) := by ring

/-- Analogija, Pogoste napake 4: pri sodem n zapis z izmeničnimi znaki da spet aⁿ − bⁿ, ne vsote.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#sodi-izmenicno
besedilo: »Pri sodi potenci je členov sodo mnogo, zadnji udarec pade na minus in zmnožek je spet $a^n - b^n$.« -/
theorem sodi_izmenicno (a b : ℝ) (n : ℕ) (hn : Even n) :
    (a + b) * ∑ i ∈ range n, (-1) ^ i * a ^ (n - 1 - i) * b ^ i = a ^ n - b ^ n := by
  rw [izmenicna, hn.neg_pow]

/-- Predpostavka `sodi_izmenicno` se da izpolniti (n = 4). -/
example (a b : ℝ) : (a + b) * ∑ i ∈ range 4, (-1) ^ i * a ^ (4 - 1 - i) * b ^ i = a ^ 4 - b ^ 4 :=
  sodi_izmenicno a b 4 (by decide)

/-- Pogoste napake 4: (a + b)(a³ − a²b + ab² − b³) = a⁴ − b⁴, ne a⁴ + b⁴.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#napaka-sodi
besedilo: »Napačno: desno je $a^4 - b^4$.« -/
theorem napaka_sodi : (∀ a b : ℝ, (a + b) * (a ^ 3 - a ^ 2 * b + a * b ^ 2 - b ^ 3) = a ^ 4 - b ^ 4) ∧
    ¬ ∀ a b : ℝ, a ^ 4 + b ^ 4 = (a + b) * (a ^ 3 - a ^ 2 * b + a * b ^ 2 - b ^ 3) := by
  refine ⟨fun a b => by ring, fun h => ?_⟩
  have := h 0 1; norm_num at this

/-- Razlaga 5 (Premisli), Razlaga 6, Povzetek, Preveri se 3: pri sodem n je (−b)ⁿ = bⁿ; a + b ni faktor
aⁿ + bⁿ (pri a = 1, b = −1 je a + b = 0, izraz pa 2), prav tako ne a − b (pri a = b = 1).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#sodi-ni-faktor
besedilo: »Izraza $a^2 + b^2$ in $a^4 + b^4$ s faktorjem $a + b$ ali $a - b$ ne razstavimo: isti preizkus z $a = 1$, $b = \pm 1$ da $2 \neq 0$.« -/
theorem sodi_ni_faktor (n : ℕ) (hn : Even n) : (∀ b : ℝ, (-b) ^ n = b ^ n) ∧
    (1 : ℝ) ^ n + (-1) ^ n = 2 ∧
    (¬ ∃ q : ℝ → ℝ → ℝ, ∀ a b : ℝ, a ^ n + b ^ n = (a + b) * q a b) ∧
    (¬ ∃ q : ℝ → ℝ → ℝ, ∀ a b : ℝ, a ^ n + b ^ n = (a - b) * q a b) := by
  have h2 : (1 : ℝ) ^ n + (-1) ^ n = 2 := by rw [hn.neg_pow, one_pow]; norm_num
  refine ⟨fun b => hn.neg_pow b, h2, ?_, ?_⟩
  · rintro ⟨q, hq⟩
    have := hq 1 (-1)
    rw [h2] at this; norm_num at this
  · rintro ⟨q, hq⟩
    have := hq 1 1
    norm_num at this

/-- Predpostavka `sodi_ni_faktor` se da izpolniti (n = 2 in n = 4: a² + b², a⁴ + b⁴). -/
example : (¬ ∃ q : ℝ → ℝ → ℝ, ∀ a b : ℝ, a ^ 2 + b ^ 2 = (a + b) * q a b) ∧
    ¬ ∃ q : ℝ → ℝ → ℝ, ∀ a b : ℝ, a ^ 4 + b ^ 4 = (a + b) * q a b :=
  ⟨(sodi_ni_faktor 2 (by decide)).2.2.1, (sodi_ni_faktor 4 (by decide)).2.2.1⟩

/-- Ustno vprašanje 3: pri sodem n ima aⁿ + bⁿ pri b = −a vrednost 2aⁿ, ki za a ≠ 0 ni 0.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#sodi-vrednost
besedilo: »Pri sodem $n$ je $(-a)^n = a^n$, zato ima izraz pri $b = -a$ vrednost $2a^n$, ki za $a \neq 0$ ni $0$« -/
theorem sodi_vrednost (n : ℕ) (hn : Even n) (a : ℝ) (ha : a ≠ 0) :
    a ^ n + (-a) ^ n = 2 * a ^ n ∧ 2 * a ^ n ≠ 0 := by
  refine ⟨by rw [hn.neg_pow]; ring, ?_⟩
  exact mul_ne_zero two_ne_zero (pow_ne_zero n ha)

/-- Predpostavke `sodi_vrednost` se dajo izpolniti (n = 2, a = 1: 1² + (−1)² = 2). -/
example : (1 : ℝ) ^ 2 + (-1) ^ 2 = 2 * 1 ^ 2 ∧ 2 * (1 : ℝ) ^ 2 ≠ 0 :=
  sodi_vrednost 2 (by decide) 1 one_ne_zero

/-- Razlaga 6: a² + b² z realnimi števili sploh ne razstavimo (za b ≠ 0 kot (a + m)(a + n)).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#a2-plus-b2
besedilo: »Izraza $a^2 + b^2$ z realnimi števili sploh ne razstavimo« -/
theorem a2_plus_b2 (b : ℝ) (hb : b ≠ 0) : ¬ ∃ m n : ℝ, ∀ a : ℝ, a ^ 2 + b ^ 2 = (a + m) * (a + n) := by
  rintro ⟨m, n, h⟩
  have h0 := h (-m)
  rw [show -m + m = 0 by ring, zero_mul] at h0
  have hb2 : 0 < b ^ 2 := by positivity
  nlinarith [sq_nonneg m]

/-- Predpostavka `a2_plus_b2` se da izpolniti (b = 1). -/
example : ¬ ∃ m n : ℝ, ∀ a : ℝ, a ^ 2 + 1 ^ 2 = (a + m) * (a + n) := a2_plus_b2 1 one_ne_zero

/-- Razlaga 6: x⁶ − 1 = (x³ − 1)(x³ + 1) = (x − 1)(x² + x + 1)(x + 1)(x² − x + 1); druga pot
(x²)³ − 1³ = (x² − 1)(x⁴ + x² + 1) = (x − 1)(x + 1)(x⁴ + x² + 1) in x⁴ + x² + 1 = (x² + x + 1)(x² − x + 1).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#x6-minus-1
besedilo: »x^6 - 1 = (x - 1)(x^2 + x + 1)(x + 1)(x^2 - x + 1)« -/
theorem x6_minus_1 (x : ℝ) : x ^ 6 - 1 = (x ^ 3 - 1) * (x ^ 3 + 1) ∧
    (x ^ 3 - 1) * (x ^ 3 + 1) = (x - 1) * (x ^ 2 + x + 1) * (x + 1) * (x ^ 2 - x + 1) ∧
    x ^ 6 - 1 = (x ^ 2) ^ 3 - 1 ^ 3 ∧ (x ^ 2) ^ 3 - 1 ^ 3 = (x ^ 2 - 1) * (x ^ 4 + x ^ 2 + 1) ∧
    (x ^ 2 - 1) * (x ^ 4 + x ^ 2 + 1) = (x - 1) * (x + 1) * (x ^ 4 + x ^ 2 + 1) ∧
    x ^ 4 + x ^ 2 + 1 = (x ^ 2 + x + 1) * (x ^ 2 - x + 1) := by
  refine ⟨by ring, by ring, by ring, by ring, by ring, by ring⟩

/-- Razlaga 6, simulacija: (x + 3)(x − 3) = x² + 3x − 3x − 9 = x² − 9.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#simulacija
besedilo: »da ostane $(x + 3)(x - 3) = x^2 - 9$« -/
theorem simulacija (x : ℝ) : (x + 3) * (x - 3) = x ^ 2 + 3 * x - 3 * x - 9 ∧
    x ^ 2 + 3 * x - 3 * x - 9 = x ^ 2 - 9 := by
  constructor <;> ring

/-! ## Rešeni primeri -/

/-- Primer 1: 8x³ = (2x)³, 27 = 3³; a² = 4x², ab = 6x, b² = 9; 8x³ − 27 = (2x − 3)(4x² + 6x + 9).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#primer1
besedilo: »Odgovor: $8x^3 - 27 = (2x - 3)(4x^2 + 6x + 9)$.« -/
theorem primer1 (x : ℝ) : 8 * x ^ 3 = (2 * x) ^ 3 ∧ (27 : ℝ) = 3 ^ 3 ∧ (2 * x) ^ 2 = 4 * x ^ 2 ∧
    2 * x * 3 = 6 * x ∧ (3 : ℝ) ^ 2 = 9 ∧ 8 * x ^ 3 - 27 = (2 * x - 3) * (4 * x ^ 2 + 6 * x + 9) := by
  refine ⟨by ring, by norm_num, by ring, by ring, by norm_num, ?_⟩
  calc 8 * x ^ 3 - 27 = (2 * x) ^ 3 - 3 ^ 3 := by ring
    _ = (2 * x - 3) * ((2 * x) ^ 2 + 2 * x * 3 + 3 ^ 2) := razlika_kubov (2 * x) 3
    _ = (2 * x - 3) * (4 * x ^ 2 + 6 * x + 9) := by ring

/-- Primer 2: D(2, 54) = 2; 2a⁴ + 54a = 2a(a³ + 27) = 2a(a + 3)(a² − 3a + 9).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#primer2
besedilo: »Odgovor: $2a^4 + 54a = 2a(a + 3)(a^2 - 3a + 9)$.« -/
theorem primer2 (a : ℝ) : Nat.gcd 2 54 = 2 ∧ (27 : ℝ) = 3 ^ 3 ∧
    2 * a ^ 4 + 54 * a = 2 * a * (a + 3) * (a ^ 2 - 3 * a + 9) := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  calc 2 * a ^ 4 + 54 * a = 2 * a * (a ^ 3 + 27) := by ring
    _ = 2 * a * ((a + 3) * (a ^ 2 - 3 * a + 9)) := by ring
    _ = 2 * a * (a + 3) * (a ^ 2 - 3 * a + 9) := by ring

/-- Primer 3: a − b = 2, a² = 1024, ab = 960, b² = 900, vsota 2884, V = 2·2884 = 5768 = 32³ − 30³.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#primer3
besedilo: »Odgovor: mizar porabi $5768\,\mathrm{cm^3}$ lesa.« -/
theorem primer3 : (32 - 30 : ℝ) = 2 ∧ (32 : ℝ) ^ 2 = 1024 ∧ (32 * 30 : ℝ) = 960 ∧ (30 : ℝ) ^ 2 = 900 ∧
    (1024 + 960 + 900 : ℝ) = 2884 ∧ (32 : ℝ) ^ 3 - 30 ^ 3 = 5768 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  calc (32 : ℝ) ^ 3 - 30 ^ 3 = (32 - 30) * (32 ^ 2 + 32 * 30 + 30 ^ 2) := razlika_kubov 32 30
    _ = 2 * 2884 := by norm_num
    _ = 5768 := by norm_num

/-- Primer 4: 2¹⁰ − 1 = (2⁵)² − 1² = (2⁵ − 1)(2⁵ + 1) = 31·33 = 1023; 33 = 3·11, 1023 = 3·11·31, zato
3 ∣ 1023 in 31 ∣ 1023; tudi 2¹⁰ − 1 = 4⁵ − 1⁵ = (4 − 1)(4⁴ + 4³ + 4² + 4 + 1) = 3·341.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#primer4
besedilo: »Torej je $1023 = 3 \cdot 11 \cdot 31$.« -/
theorem primer4 : (2 : ℤ) ^ 10 - 1 = (2 ^ 5) ^ 2 - 1 ^ 2 ∧ ((2 : ℤ) ^ 5) ^ 2 - 1 ^ 2 = (2 ^ 5 - 1) * (2 ^ 5 + 1) ∧
    ((2 : ℤ) ^ 5 - 1) * (2 ^ 5 + 1) = 31 * 33 ∧ (31 * 33 : ℤ) = 1023 ∧ (33 : ℤ) = 3 * 11 ∧
    (1023 : ℤ) = 3 * 11 * 31 ∧ (3 : ℤ) ∣ 2 ^ 10 - 1 ∧ (31 : ℤ) ∣ 2 ^ 10 - 1 ∧
    (2 : ℤ) ^ 10 - 1 = 4 ^ 5 - 1 ^ 5 ∧ (4 : ℤ) ^ 5 - 1 ^ 5 = (4 - 1) * (4 ^ 4 + 4 ^ 3 + 4 ^ 2 + 4 + 1) ∧
    ((4 - 1) * (4 ^ 4 + 4 ^ 3 + 4 ^ 2 + 4 + 1) : ℤ) = 3 * 341 := by
  refine ⟨by norm_num, by ring, by norm_num, by norm_num, by norm_num, by norm_num,
    ⟨341, by norm_num⟩, ⟨33, by norm_num⟩, by norm_num, by ring, by norm_num⟩

/-- Zakaj se tega učimo: 3, 7, 31, 127, 1023 so 2ⁿ − 1 za n = 2, 3, 5, 7, 10.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#mersenne
besedilo: »Hkrati so ga zanimala števila oblike $2^n - 1$, na primer $3$, $7$, $31$, $127$, $1023$.« -/
theorem mersenne : (2 : ℤ) ^ 2 - 1 = 3 ∧ (2 : ℤ) ^ 3 - 1 = 7 ∧ (2 : ℤ) ^ 5 - 1 = 31 ∧
    (2 : ℤ) ^ 7 - 1 = 127 ∧ (2 : ℤ) ^ 10 - 1 = 1023 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1 in Povzetek: a³ + b³ ≠ (a + b)³ v splošnem (a = b = 1: 2 proti 8); (a + b)³ ima še
člena 3a²b in 3ab².
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#napaka-kub-vsote
besedilo: »Napačno: $(a + b)^3$ ima še člena $3a^2b$ in $3ab^2$. Pri $a = b = 1$ je levo $2$, desno $8$.« -/
theorem napaka_kub_vsote : (1 : ℝ) ^ 3 + 1 ^ 3 = 2 ∧ (1 + 1 : ℝ) ^ 3 = 8 ∧
    (¬ ∀ a b : ℝ, a ^ 3 + b ^ 3 = (a + b) ^ 3) ∧
    (∀ a b : ℝ, (a + b) ^ 3 = a ^ 3 + 3 * a ^ 2 * b + 3 * a * b ^ 2 + b ^ 3) := by
  refine ⟨by norm_num, by norm_num, fun h => ?_, fun a b => by ring⟩
  have := h 1 1; norm_num at this

/-- Pogoste napake 2 in Preveri se 2: 13³ − 12³ = (13 − 12)(169 + 156 + 144) = 1·469 = 469; napačno
(13 − 12)(13 − 12)² = 1, (13 − 12)(13 + 12)² = 625, (13 − 12)(13 + 12) = 25.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#trinajst
besedilo: »Pri $13^3 - 12^3$ prvo da $1$, drugo $625$, prav pa je $469$.« -/
theorem trinajst : (13 : ℝ) ^ 3 - 12 ^ 3 = 469 ∧ ((13 - 12) * (13 - 12) ^ 2 : ℝ) = 1 ∧
    ((13 - 12) * (13 + 12) ^ 2 : ℝ) = 625 ∧ ((13 - 12) * (13 + 12) : ℝ) = 25 ∧ (469 : ℝ) ≠ 1 ∧
    (469 : ℝ) ≠ 625 ∧ (469 : ℝ) ≠ 25 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  calc (13 : ℝ) ^ 3 - 12 ^ 3 = (13 - 12) * (13 ^ 2 + 13 * 12 + 12 ^ 2) := razlika_kubov 13 12
    _ = (13 - 12) * (169 + 156 + 144) := by norm_num
    _ = 1 * 469 := by norm_num
    _ = 469 := by norm_num

/-- Pogoste napake 3, Ponovitev, Preveri se 4 (korak 3): (x + 2)(x² + 2x + 4) = x³ + 4x² + 8x + 8 ≠ x³ + 8;
pravilno x³ + 8 = (x + 2)(x² − 2x + 4); koraka 1 in 2 sta pravilna.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#napaka-znak
besedilo: »Napačno: ta zmnožek da $x^3 + 4x^2 + 8x + 8$. Popravek: pri vsoti kubov je srednji člen negativen, $(x + 2)(x^2 - 2x + 4)$.« -/
theorem napaka_znak : (∀ x : ℝ, (x + 2) * (x ^ 2 + 2 * x + 4) = x ^ 3 + 4 * x ^ 2 + 8 * x + 8) ∧
    (¬ ∀ x : ℝ, x ^ 3 + 8 = (x + 2) * (x ^ 2 + 2 * x + 4)) ∧
    (∀ x : ℝ, x ^ 3 + 8 = (x + 2) * (x ^ 2 - 2 * x + 4)) ∧
    (∀ x : ℝ, x ^ 6 - 64 = (x ^ 3 - 8) * (x ^ 3 + 8)) ∧
    (∀ x : ℝ, x ^ 3 - 8 = (x - 2) * (x ^ 2 + 2 * x + 4)) := by
  refine ⟨fun x => by ring, fun h => ?_, fun x => by ring, fun x => by ring, fun x => by ring⟩
  have := h 1; norm_num at this

/-- Preveri se 4: pravilni razcep x⁶ − 64 = (x − 2)(x² + 2x + 4)(x + 2)(x² − 2x + 4); Anin korak 4 ni enak
x⁶ − 64.
pomozno – razlaga odgovora v Preveri se 4 razcepa x⁶ − 64 ne zapiše (le pravilo za srednji člen, ki ga citira napaka_znak) -/
theorem x6_minus_64 : (∀ x : ℝ, x ^ 6 - 64 = (x - 2) * (x ^ 2 + 2 * x + 4) * (x + 2) * (x ^ 2 - 2 * x + 4)) ∧
    ¬ ∀ x : ℝ, x ^ 6 - 64 = (x - 2) * (x ^ 2 + 2 * x + 4) * (x + 2) * (x ^ 2 + 2 * x + 4) := by
  refine ⟨fun x => by ring, fun h => ?_⟩
  have := h 1; norm_num at this

/-! ## Za maturo -/

/-- Naloga 1: 8 = 2³; (x + 1)³ − 2³ = [(x + 1) − 2][(x + 1)² + 2(x + 1) + 4] = (x − 1)(x² + 2x + 1 + 2x + 2 + 4)
= (x − 1)(x² + 4x + 7).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#naloga1
besedilo: »Odgovor: $(x + 1)^3 - 8 = (x - 1)(x^2 + 4x + 7)$.« -/
theorem naloga1 (x : ℝ) : (8 : ℝ) = 2 ^ 3 ∧ (x + 1) ^ 3 - 8 = (x - 1) * (x ^ 2 + 4 * x + 7) := by
  refine ⟨by norm_num, ?_⟩
  calc (x + 1) ^ 3 - 8 = (x + 1) ^ 3 - 2 ^ 3 := by norm_num
    _ = ((x + 1) - 2) * ((x + 1) ^ 2 + (x + 1) * 2 + 2 ^ 2) := razlika_kubov (x + 1) 2
    _ = (x - 1) * (x ^ 2 + 2 * x + 1 + 2 * x + 2 + 4) := by ring
    _ = (x - 1) * (x ^ 2 + 4 * x + 7) := by ring

/-- Naloga 1, preizkus pri x = 2: 27 − 8 = 19 in 1·(4 + 8 + 7) = 19.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#naloga1-preizkus
besedilo: »Preizkus pri $x = 2$: izvirni izraz je $27 - 8 = 19$, razcep pa $1 \cdot (4 + 8 + 7) = 19$.« -/
theorem naloga1_preizkus : (2 + 1 : ℝ) ^ 3 - 8 = 27 - 8 ∧ (27 - 8 : ℝ) = 19 ∧
    ((2 - 1) * (2 ^ 2 + 4 * 2 + 7) : ℝ) = 1 * (4 + 8 + 7) ∧ (1 * (4 + 8 + 7) : ℝ) = 19 := by norm_num

/-- Naloga 2 a), b): A = 8x³ + 1 = (2x + 1)(4x² − 2x + 1), B = 4x² − 1 = (2x − 1)(2x + 1).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#naloga2ab
besedilo: »$A = (2x + 1)(4x^2 - 2x + 1)$, $B = (2x - 1)(2x + 1)$« -/
theorem naloga2ab (x : ℝ) : 8 * x ^ 3 = (2 * x) ^ 3 ∧ 8 * x ^ 3 + 1 = (2 * x + 1) * (4 * x ^ 2 - 2 * x + 1) ∧
    4 * x ^ 2 = (2 * x) ^ 2 ∧ 4 * x ^ 2 - 1 = (2 * x - 1) * (2 * x + 1) := by
  refine ⟨by ring, by ring, by ring, by ring⟩

/-- Naloga 2 c): ulomek je definiran natanko za B ≠ 0 ⇔ x ≠ 1/2 in x ≠ −1/2.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#naloga2c-definiran
besedilo: »Ulomek je definiran, ko je $B \neq 0$, torej za $x \neq \dfrac{1}{2}$ in $x \neq -\dfrac{1}{2}$.« -/
theorem naloga2c_definiran (x : ℝ) : 4 * x ^ 2 - 1 ≠ 0 ↔ x ≠ 1 / 2 ∧ x ≠ -1 / 2 := by
  rw [show 4 * x ^ 2 - 1 = 4 * ((x - 1 / 2) * (x - -1 / 2)) by ring, mul_ne_zero_iff, mul_ne_zero_iff,
    sub_ne_zero, sub_ne_zero]
  simp

/-- Naloga 2 c): za x ≠ ±1/2 je A/B = (2x + 1)(4x² − 2x + 1)/((2x − 1)(2x + 1)) = (4x² − 2x + 1)/(2x − 1).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#naloga2c
besedilo: »Okrajšamo s skupnim faktorjem: $\dfrac{A}{B} = \dfrac{(2x + 1)(4x^2 - 2x + 1)}{(2x - 1)(2x + 1)} = \dfrac{4x^2 - 2x + 1}{2x - 1}$.« -/
theorem naloga2c (x : ℝ) (h1 : x ≠ 1 / 2) (h2 : x ≠ -1 / 2) :
    (8 * x ^ 3 + 1) / (4 * x ^ 2 - 1) = (4 * x ^ 2 - 2 * x + 1) / (2 * x - 1) := by
  have ha : 2 * x - 1 ≠ 0 := by
    intro h; apply h1; linarith
  have hb : 2 * x + 1 ≠ 0 := by
    intro h; apply h2; linarith
  calc (8 * x ^ 3 + 1) / (4 * x ^ 2 - 1)
      = ((2 * x + 1) * (4 * x ^ 2 - 2 * x + 1)) / ((2 * x - 1) * (2 * x + 1)) := by ring
    _ = (4 * x ^ 2 - 2 * x + 1) / (2 * x - 1) := by
      rw [mul_comm (2 * x - 1), mul_div_mul_left _ _ hb]

/-- Predpostavki `naloga2c` se dajo izpolniti (x = 2). -/
example : (8 * (2 : ℝ) ^ 3 + 1) / (4 * 2 ^ 2 - 1) = (4 * 2 ^ 2 - 2 * 2 + 1) / (2 * 2 - 1) :=
  naloga2c 2 (by norm_num) (by norm_num)

/-- Naloga 2 c): pri x = 2 je (16 − 4 + 1)/3 = 13/3 in (64 + 1)/(16 − 1) = 65/15 = 13/3.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#naloga2c-vrednost
besedilo: »Pri $x = 2$: $\dfrac{16 - 4 + 1}{3} = \dfrac{13}{3}$. Preizkus z izvirnim ulomkom: $\dfrac{64 + 1}{16 - 1} = \dfrac{65}{15} = \dfrac{13}{3}$.« -/
theorem naloga2c_vrednost : ((4 * 2 ^ 2 - 2 * 2 + 1) / (2 * 2 - 1) : ℝ) = (16 - 4 + 1) / 3 ∧
    ((16 - 4 + 1) / 3 : ℝ) = 13 / 3 ∧ ((8 * 2 ^ 3 + 1) / (4 * 2 ^ 2 - 1) : ℝ) = (64 + 1) / (16 - 1) ∧
    ((64 + 1) / (16 - 1) : ℝ) = 65 / 15 ∧ (65 / 15 : ℝ) = 13 / 3 := by norm_num

/-- Naloga 3 a), b): 32 = 2⁵; x⁵ − 32 = (x − 2)(x⁴ + 2x³ + 4x² + 8x + 16), x⁵ + 32 = (x + 2)(x⁴ − 2x³ + 4x² − 8x + 16).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#naloga3ab
besedilo: »$x^5 - 32 = (x - 2)(x^4 + 2x^3 + 4x^2 + 8x + 16)$, $x^5 + 32 = (x + 2)(x^4 - 2x^3 + 4x^2 - 8x + 16)$« -/
theorem naloga3ab (x : ℝ) : (32 : ℝ) = 2 ^ 5 ∧
    x ^ 5 - 32 = (x - 2) * (x ^ 4 + 2 * x ^ 3 + 4 * x ^ 2 + 8 * x + 16) ∧
    x ^ 5 + 32 = (x + 2) * (x ^ 4 - 2 * x ^ 3 + 4 * x ^ 2 - 8 * x + 16) := by
  refine ⟨by norm_num, by ring, by ring⟩

/-- Naloga 3 c): 7⁵ − 32 = 5·(7⁴ + 2·7³ + 4·7² + 8·7 + 16) = 5·3355 in 3⁵ + 32 = 5·(3⁴ − 2·3³ + 4·3² − 8·3 + 16)
= 5·55; drugi faktor je celo število, zato 5 deli obe števili.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#naloga3c
besedilo: »števili $7^5 - 32$ in $3^5 + 32$ imata faktor $5$« -/
theorem naloga3c : (7 : ℤ) ^ 5 - 32 = (7 - 2) * (7 ^ 4 + 2 * 7 ^ 3 + 4 * 7 ^ 2 + 8 * 7 + 16) ∧
    (7 : ℤ) ^ 4 + 2 * 7 ^ 3 + 4 * 7 ^ 2 + 8 * 7 + 16 = 3355 ∧ (7 : ℤ) ^ 5 - 32 = 5 * 3355 ∧
    (5 : ℤ) ∣ 7 ^ 5 - 32 ∧
    (3 : ℤ) ^ 5 + 32 = (3 + 2) * (3 ^ 4 - 2 * 3 ^ 3 + 4 * 3 ^ 2 - 8 * 3 + 16) ∧
    (3 : ℤ) ^ 4 - 2 * 3 ^ 3 + 4 * 3 ^ 2 - 8 * 3 + 16 = 55 ∧ (3 : ℤ) ^ 5 + 32 = 5 * 55 ∧
    (5 : ℤ) ∣ 3 ^ 5 + 32 := by
  refine ⟨by ring, by norm_num, by norm_num, ⟨3355, by norm_num⟩, by ring, by norm_num, by norm_num,
    ⟨55, by norm_num⟩⟩

/-- Naloga 3 d): x⁸ − 256 = (x⁴ − 16)(x⁴ + 16), x⁴ − 16 = (x² − 4)(x² + 4) = (x − 2)(x + 2)(x² + 4),
skupaj (x − 2)(x + 2)(x² + 4)(x⁴ + 16).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#naloga3d
besedilo: »Torej $x^8 - 256 = (x - 2)(x + 2)(x^2 + 4)(x^4 + 16)$.« -/
theorem naloga3d (x : ℝ) : x ^ 8 - 256 = (x ^ 4 - 16) * (x ^ 4 + 16) ∧
    x ^ 4 - 16 = (x ^ 2 - 4) * (x ^ 2 + 4) ∧ (x ^ 2 - 4) * (x ^ 2 + 4) = (x - 2) * (x + 2) * (x ^ 2 + 4) ∧
    x ^ 8 - 256 = (x - 2) * (x + 2) * (x ^ 2 + 4) * (x ^ 4 + 16) := by
  refine ⟨by ring, by ring, by ring, by ring⟩

/-- Naloga 3 e), korak 7: če je x − c faktor izraza p (p(x) = (x − c)q(x) za vse x), je p(c) = 0.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#faktor-nicla
besedilo: »Če bi bil $x - c$ faktor izraza, bi bila vrednost izraza pri $x = c$ enaka $0$, saj bi bil tedaj ta faktor $0$.« -/
theorem faktor_nicla (p q : ℝ → ℝ) (c : ℝ) (h : ∀ x, p x = (x - c) * q x) : p c = 0 := by
  rw [h c, sub_self, zero_mul]

/-- Predpostavka `faktor_nicla` se da izpolniti (p(x) = x² − 4, q(x) = x + 2, c = 2). -/
example : (fun x : ℝ => x ^ 2 - 4) 2 = 0 :=
  faktor_nicla (fun x => x ^ 2 - 4) (fun x => x + 2) 2 (fun x => by ring)

/-- Naloga 3 e): x⁴ + 16 je pri x = ±2 enako 16 + 16 = 32 ≠ 0, zato niti x − 2 niti x + 2 ni faktor.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#naloga3e
besedilo: »Pri $x = 2$ in pri $x = -2$ je $x^4 + 16 = 16 + 16 = 32 \neq 0$, zato niti $x - 2$ niti $x + 2$ ni faktor izraza $x^4 + 16$.« -/
theorem naloga3e : (2 : ℝ) ^ 4 + 16 = 32 ∧ (-2 : ℝ) ^ 4 + 16 = 32 ∧
    (¬ ∃ q : ℝ → ℝ, ∀ x : ℝ, x ^ 4 + 16 = (x - 2) * q x) ∧
    (¬ ∃ q : ℝ → ℝ, ∀ x : ℝ, x ^ 4 + 16 = (x + 2) * q x) := by
  refine ⟨by norm_num, by norm_num, ?_, ?_⟩
  · rintro ⟨q, hq⟩
    have := faktor_nicla (fun x => x ^ 4 + 16) q 2 hq
    norm_num at this
  · rintro ⟨q, hq⟩
    have := faktor_nicla (fun x => x ^ 4 + 16) q (-2) (fun x => by rw [hq x]; ring)
    norm_num at this

/-! ## Drugače -/

/-- Analogija: a³ − b³ = (a − b)(a²b⁰ + a¹b¹ + a⁰b²).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#analogija
besedilo: »a^3 - b^3 = (a - b)(a^2 b^0 + a^1 b^1 + a^0 b^2)« -/
theorem analogija (a b : ℝ) : a ^ 3 - b ^ 3 = (a - b) * (a ^ 2 * b ^ 0 + a ^ 1 * b ^ 1 + a ^ 0 * b ^ 2) := by
  ring

/-- Iz vsakdanjega življenja: vsako trimestno število N, zapisano dvakrat (1000N + N), je N·1001;
1001 = 10³ + 1³ = (10 + 1)(100 − 10 + 1) = 11·91, 91 = 7·13, zato ga delijo 7, 11 in 13; 254254 = 254·1001.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#dvakrat-zapisano
besedilo: »Tako število je vedno deljivo s $7$, $11$ in $13$.« -/
theorem dvakrat_zapisano (N : ℤ) : 1000 * N + N = N * 1001 ∧ (1001 : ℤ) = 10 ^ 3 + 1 ^ 3 ∧
    (10 : ℤ) ^ 3 + 1 = (10 + 1) * (100 - 10 + 1) ∧ ((10 + 1) * (100 - 10 + 1) : ℤ) = 11 * 91 ∧
    (91 : ℤ) = 7 * 13 ∧ (1001 : ℤ) = 7 * 11 * 13 ∧
    (7 : ℤ) ∣ 1000 * N + N ∧ (11 : ℤ) ∣ 1000 * N + N ∧ (13 : ℤ) ∣ 1000 * N + N ∧
    (254254 : ℤ) = 254 * 1001 := by
  refine ⟨by ring, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    ⟨143 * N, by ring⟩, ⟨91 * N, by ring⟩, ⟨77 * N, by ring⟩, by norm_num⟩

/-- Iz vsakdanjega življenja: 999 = 10³ − 1 = 9·111, 111 = 3·37, 999 = 27·37.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#devetsto99-vsakdan
besedilo: »Podobno razlika kubov $999 = 10^3 - 1 = 9 \cdot 111$ pove, da je $999$ deljivo s $111$, in ker je $111 = 3 \cdot 37$, je $999 = 27 \cdot 37$.« -/
theorem devetsto99_vsakdan : (999 : ℤ) = 10 ^ 3 - 1 ∧ (10 : ℤ) ^ 3 - 1 = 9 * 111 ∧ (111 : ℤ) ∣ 999 ∧
    (111 : ℤ) = 3 * 37 ∧ (999 : ℤ) = 27 * 37 := by
  refine ⟨by norm_num, by norm_num, ⟨9, by norm_num⟩, by norm_num, by norm_num⟩

/-! ## Preveri se -/

/-- Preveri se 1: x³ − 8 = (x − 2)(x² + 2x + 4), 27 + y³ = (3 + y)(9 − 3y + y²), 64a³ = (4a)³ in 1 = 1³;
9 ni kub celega števila.
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#preveri1
besedilo: »$9$ ni kub celega števila« -/
theorem preveri1 : (∀ x : ℝ, x ^ 3 - 8 = (x - 2) * (x ^ 2 + 2 * x + 4)) ∧
    (∀ y : ℝ, 27 + y ^ 3 = (3 + y) * (9 - 3 * y + y ^ 2)) ∧ (∀ a : ℝ, 64 * a ^ 3 = (4 * a) ^ 3) ∧
    (1 : ℤ) = 1 ^ 3 ∧ (8 : ℤ) = 2 ^ 3 ∧ (27 : ℤ) = 3 ^ 3 ∧ ¬ ∃ k : ℤ, k ^ 3 = 9 := by
  refine ⟨fun x => by ring, fun y => by ring, fun a => by ring, by norm_num, by norm_num, by norm_num, ?_⟩
  rintro ⟨k, hk⟩
  have h1 : k ≤ 2 := by
    by_contra h
    rw [not_le] at h
    have : (3 : ℤ) ^ 3 ≤ k ^ 3 := pow_le_pow_left₀ (by norm_num) h 3
    linarith
  have h2 : 0 < k := by
    by_contra h
    rw [not_lt] at h
    nlinarith [sq_nonneg k]
  interval_cases k <;> norm_num at hk

/-- Preveri se 5: 3x⁴ − 3x = 3x(x³ − 1) = 3x(x − 1)(x² + x + 1).
trditev: MAT-SS-1/razstavljanje-vsote-in-razlike-potenc#preveri5
besedilo: »$3x^4 - 3x = 3x(x - 1)(x^2 + x + 1)$« -/
theorem preveri5 (x : ℝ) : 3 * x ^ 4 - 3 * x = 3 * x * (x - 1) * (x ^ 2 + x + 1) := by
  calc 3 * x ^ 4 - 3 * x = 3 * x * (x ^ 3 - 1) := by ring
    _ = 3 * x * (x - 1) * (x ^ 2 + x + 1) := by ring

/-! ## RACUN -/

/-- Blok RACUN: vse vrstice enako in vrednost; vrstica z ulomkom (8x³ + 1)/(4x² − 1) je `naloga2c` (pogoj
x ≠ ±1/2).
pomozno – preverja vrstice bloka RACUN, ki ni vidno besedilo lekcije -/
theorem racun :
    (∀ a b : ℝ, a^3-b^3 = (a-b)*(a^2+a*b+b^2)) ∧ (∀ a b : ℝ, a^3+b^3 = (a+b)*(a^2-a*b+b^2)) ∧
    ((4:ℝ)^3-3^3 = 37) ∧ ((9:ℝ)*111 = 999) ∧
    (∀ a b : ℝ, a^5+b^5 = (a+b)*(a^4-a^3*b+a^2*b^2-a*b^3+b^4)) ∧
    (∀ a b : ℝ, a^4-b^4 = (a-b)*(a^3+a^2*b+a*b^2+b^3)) ∧
    (∀ x : ℝ, x^6-1 = (x-1)*(x^2+x+1)*(x+1)*(x^2-x+1)) ∧
    (∀ x : ℝ, x^4+x^2+1 = (x^2+x+1)*(x^2-x+1)) ∧
    (∀ x : ℝ, 8*x^3-27 = (2*x-3)*(4*x^2+6*x+9)) ∧ (∀ a : ℝ, 2*a^4+54*a = 2*a*(a+3)*(a^2-3*a+9)) ∧
    ((32:ℝ)^3-30^3 = 5768) ∧ ((2:ℝ)^10-1 = 1023) ∧ ((31:ℝ)*33 = 1023) ∧ ((13:ℝ)^3-12^3 = 469) ∧
    (∀ x : ℝ, x^6-64 = (x-2)*(x^2+2*x+4)*(x+2)*(x^2-2*x+4)) ∧
    (∀ x : ℝ, 3*x^4-3*x = 3*x*(x-1)*(x^2+x+1)) ∧ ((7:ℝ)*11*13 = 1001) ∧
    (∀ x : ℝ, (x+1)^3-8 = (x-1)*(x^2+4*x+7)) ∧ ((3:ℝ)^3-8 = 19) ∧
    (∀ x : ℝ, 8*x^3+1 = (2*x+1)*(4*x^2-2*x+1)) ∧ (∀ x : ℝ, 4*x^2-1 = (2*x-1)*(2*x+1)) ∧
    ((4*2^2-2*2+1)/(2*2-1) : ℝ) = 13/3 ∧ ((8*2^3+1)/(4*2^2-1) : ℝ) = 13/3 ∧
    (∀ x : ℝ, x^5-32 = (x-2)*(x^4+2*x^3+4*x^2+8*x+16)) ∧
    (∀ x : ℝ, x^5+32 = (x+2)*(x^4-2*x^3+4*x^2-8*x+16)) ∧
    ((7:ℝ)^5-32 = 5*3355) ∧ ((7:ℝ)^4+2*7^3+4*7^2+8*7+16 = 3355) ∧ ((3:ℝ)^5+32 = 5*55) ∧
    ((3:ℝ)^4-2*3^3+4*3^2-8*3+16 = 55) ∧ (∀ x : ℝ, x^8-256 = (x^4-16)*(x^4+16)) ∧
    (∀ x : ℝ, x^8-256 = (x-2)*(x+2)*(x^2+4)*(x^4+16)) ∧ ((-2:ℝ)^4+16 = 32) := by
  refine ⟨fun a b => by ring, fun a b => by ring, by norm_num, by norm_num, fun a b => by ring,
    fun a b => by ring, fun x => by ring, fun x => by ring, fun x => by ring, fun a => by ring,
    by norm_num, by norm_num, by norm_num, by norm_num, fun x => by ring, fun x => by ring, by norm_num,
    fun x => by ring, by norm_num, fun x => by ring, fun x => by ring, by norm_num, by norm_num,
    fun x => by ring, fun x => by ring, by norm_num, by norm_num, by norm_num, by norm_num,
    fun x => by ring, fun x => by ring, by norm_num⟩

end Evklid.Lekcije.MAT_SS_1.RazstavljanjeVsoteInRazlikePotenc
