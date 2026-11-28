/-
vir: content/lessons/MAT-OS-8/algebrski-izrazi.md
sha256: 9e359601d80103395a651df7b974147ca2846b4e438b741e831bf005f484d8b4
Model: spremenljivke so realna števila (`ℝ`), algebrski izraz je funkcija spremenljivk. »Izraza sta
enakovredna« je dokazano kot enakost za vse vrednosti spremenljivk. »Izraza ne moremo zapisati z enim
členom« je dokazano kot: ni koeficienta c in eksponentov, da bi izraz za vse vrednosti spremenljivk bil enak
c · xᵏ (oziroma c · xⁱ · yʲ); »izraz A ni enak izrazu B« pa s števili iz lekcije (protiprimer).
Ni v Leanu: pojmi spremenljivka, algebrski izraz, člen, koeficient, črkovni del in podobni členi kot pojmi
o zapisu (Lean ne loči zapisa 2d od 2 · d; dokazane so enakosti, ki jih dogovori in pojmi utemeljujejo, npr.
1 · p = p, (−1) · x = −x, x · x = x², ma + na = (m + n)a, in a : 4 = a/4, ki je v Leanu, kjer je
»:« zapisan kot »/«, dokazano kot a/4 = a · (1/4)); da je pri −5xy koeficient −5 in
črkovni del xy ter da je 3x² »podoben« ali »ni podoben« drugemu členu (pojem; dokazano je, da 3x² ni
večkratnik x); simulacija s ploščicami in analogija s škatlami kot opisa (dokazani so računi v njih);
zgodbe (košarka, tek, žetoni, tenis) kot opisi in enote (m, €) – dokazana so števila; besedilo napačnih
odgovorov v Preveri se (dokazane so napačne vrednosti, ki jih razlaga navaja); prevod besedila v izraz
(tabela »Besede v izraz«) in vrstni red operacij ter pravilo »negativno število v oklepaj« kot dogovora
(dokazane so vrednosti, ki jih dogovora dajo, in da x − 7 ni 7 − x).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.AlgebrskiIzrazi

/-- Izraz za točke igralca iz Razlage: 2d + 3t + p (d dvojk, t trojk, p prostih metov). -/
noncomputable def tocke (d t p : ℝ) : ℝ := 2 * d + 3 * t + p

/-! ## Razlaga -/

/-- Razlaga, najprej en igralec: Jan ima 4 · 2 + 1 · 3 + 3 · 1 = 8 + 3 + 3 = 14 točk.
trditev: MAT-OS-8/algebrski-izrazi#jan
besedilo: »$$4 \cdot 2 + 1 \cdot 3 + 3 \cdot 1 = 8 + 3 + 3 = 14$$« -/
theorem jan : (4:ℝ) * 2 + 1 * 3 + 3 * 1 = 14 := by
  calc (4:ℝ) * 2 + 1 * 3 + 3 * 1 = 8 + 3 + 3 := by norm_num
    _ = 14 := by norm_num

/-- Razlaga, vrednost izraza: za d = 4, t = 1, p = 3 je vrednost izraza 2d + 3t + p enaka 14, enako kot
Janov račun.
trditev: MAT-OS-8/algebrski-izrazi#jan-iz-izraza
besedilo: »Za Jana smo vstavili $d = 4$, $t = 1$, $p = 3$ in dobili vrednost $14$.« -/
theorem jan_iz_izraza : tocke 4 1 3 = 14 := by norm_num [tocke]

/-- Razlaga, Premisli: Ema (d = 0, t = 5, p = 0): 2 · 0 + 3 · 5 + 0 = 15.
trditev: MAT-OS-8/algebrski-izrazi#ema
besedilo: »Vstavimo $d = 0$, $t = 5$, $p = 0$: $2 \cdot 0 + 3 \cdot 5 + 0 = 15$.« -/
theorem ema : tocke 0 5 0 = 15 := by
  calc tocke 0 5 0 = 2 * 0 + 3 * 5 + 0 := rfl
    _ = 15 := by norm_num

/-- Razlaga, dogovori o zapisu: 1 · p = p, (−1) · x = −x, x · x = x², a : 4 = a/4 (v Leanu je »:«
zapisan kot »/«, zato je dokazano a/4 = a · (1/4)), in vrstni red faktorjev ni pomemben (2 · d = d · 2,
zato pišemo 2d).
trditev: MAT-OS-8/algebrski-izrazi#dogovori
besedilo: »namesto $2 \cdot d$ pišemo $2d$. - Število pišemo pred črko: $5a$, ne $a5$. - Namesto $1 \cdot p$ pišemo $p$, namesto $(-1) \cdot x$ pa $-x$. - Namesto $x \cdot x$ pišemo $x^2$. - Deljenje zapišemo z ulomkom: $a : 4 = \dfrac{a}{4}$.« -/
theorem dogovori (p x a d : ℝ) :
    1 * p = p ∧ (-1) * x = -x ∧ x * x = x ^ 2 ∧ a / 4 = a * (1 / 4) ∧ 2 * d = d * 2 := by
  refine ⟨one_mul p, by ring, by ring, by ring, mul_comm 2 d⟩

/-- Razlaga, besede v izraz: x − 7 in 7 − x nista isto: enaka sta natanko pri x = 7.
trditev: MAT-OS-8/algebrski-izrazi#vrstni-red-odstevanja
besedilo: »Pri odštevanju je vrstni red pomemben: $x - 7$ in $7 - x$ nista isto.« -/
theorem vrstni_red_odstevanja (x : ℝ) : x - 7 = 7 - x ↔ x = 7 := by
  constructor <;> intro h <;> linarith

/-- Razlaga, členi: 4 dvojke in 3 dvojke je 7 dvojk, za mete po x točk pa 4x + 3x = 7x.
trditev: MAT-OS-8/algebrski-izrazi#stiri-plus-tri
besedilo: »$4$ meti po $x$ in še $3$ meti po $x$ so $7$ metov po $x$, torej $4x + 3x = 7x$.« -/
theorem stiri_plus_tri (x : ℝ) : (4:ℝ) + 3 = 7 ∧ 4 * x + 3 * x = 7 * x := ⟨by norm_num, by ring⟩

/-- Razlaga, členi: 4x + 3y ostane, kot je: ni enega člena c · xⁱ · yʲ, ki bi bil zanj enak za vse x, y.
trditev: MAT-OS-8/algebrski-izrazi#stiri-x-tri-y-ni-en-clen
besedilo: »Izraz $4x + 3y$ ostane, kot je.« -/
theorem stiri_x_tri_y_ni_en_clen :
    ¬ ∃ (c : ℝ) (i j : ℕ), ∀ x y : ℝ, 4 * x + 3 * y = c * x ^ i * y ^ j := by
  rintro ⟨c, i, j, h⟩
  have h1 := h 1 1
  have h2 := h 1 (-1)
  simp at h1 h2
  rcases neg_one_pow_eq_or ℝ j with hj | hj <;> rw [hj] at h2 <;> linarith

/-- Razlaga, podobni členi: člena brez črk se seštejeta (5 + (−2) = 3), 3x in −7x se seštejeta v −4x.
pomozno – lekcija pove le, da sta $3x$ in $-7x$ (in $5$, $-2$) podobna, vsot $5 + (-2) = 3$ in $3x - 7x = -4x$ ne navede -/
theorem podobni_primeri (x : ℝ) : (5:ℝ) + (-2) = 3 ∧ 3 * x + (-7) * x = -4 * x := ⟨by norm_num, by ring⟩

/-- Razlaga, podobni členi: 3x in 3x² nista podobna: 3x² ni oblike c · x (ni enak c · x za vse x).
trditev: MAT-OS-8/algebrski-izrazi#tri-x2-ni-veckratnik-x
besedilo: »Člena $3x$ in $3x^2$ nista podobna, ker je $x$ drugačen črkovni del kot $x^2$.« -/
theorem tri_x2_ni_veckratnik_x : ¬ ∃ c : ℝ, ∀ x : ℝ, 3 * x ^ 2 = c * x := by
  rintro ⟨c, h⟩
  have h1 := h 1
  have h2 := h 2
  norm_num at h1 h2
  linarith

/-- Razlaga, poenostavljanje: 3x + 5x = (3 + 5)x = 8x.
trditev: MAT-OS-8/algebrski-izrazi#poenostavljanje
besedilo: »Podobne člene seštejemo tako, da seštejemo koeficiente, črkovni del pa prepišemo: $$3x + 5x = (3 + 5)x = 8x$$« -/
theorem poenostavljanje (x : ℝ) : 3 * x + 5 * x = 8 * x := by
  calc 3 * x + 5 * x = (3 + 5) * x := by ring
    _ = 8 * x := by norm_num

/-- Razlaga, simulacija s ploščicami: 2x² − x + 3, ko dodamo +x, je 2x² + 3 (x in −x se izničita).
trditev: MAT-OS-8/algebrski-izrazi#ploscice
besedilo: »Opazuj, da se $x$ in $-x$ izničita, kvadrati in enice pa ostanejo, kot so bili.« -/
theorem ploscice (x : ℝ) : (2 * x ^ 2 - x + 3) + x = 2 * x ^ 2 + 3 := by ring

/-- Razlaga, Premisli: 3x + 2x² ni en sam člen (ni c · xᵏ za vse x); za x = 2 je 3x + 2x² = 6 + 8 = 14,
5x² pa 20.
trditev: MAT-OS-8/algebrski-izrazi#tri-x-dva-x2
besedilo: »Ne. Palica $x$ in kvadrat $x^2$ sta ploščici različne oblike, zato ju ne štejemo skupaj. Za $x = 2$ je $3x + 2x^2 = 6 + 8 = 14$, $5x^2$ pa bi dalo $20$.« -/
theorem tri_x_dva_x2 :
    (¬ ∃ (c : ℝ) (k : ℕ), ∀ x : ℝ, 3 * x + 2 * x ^ 2 = c * x ^ k) ∧
    (3:ℝ) * 2 + 2 * 2 ^ 2 = 6 + 8 ∧ (6:ℝ) + 8 = 14 ∧ (5:ℝ) * 2 ^ 2 = 20 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  rintro ⟨c, k, h⟩
  have h1 := h 1
  have h2 := h (-1)
  simp at h1 h2
  rcases neg_one_pow_eq_or ℝ k with hk | hk <;> rw [hk] at h2 <;> norm_num at h2 <;> linarith

/-! ## Rešeni primeri -/

/-- Primer 1: Majina pot je 400n + 150 metrov; za n = 3: 400 · 3 + 150 = 1350.
trditev: MAT-OS-8/algebrski-izrazi#primer1
besedilo: »Odgovor: Maja preteče $400n + 150$ metrov, pri treh krogih $1350\,\text{m}$.« -/
theorem primer1 : (fun n : ℝ => 400 * n + 150) 3 = 1350 := by norm_num

/-- Primer 2: 2a² − 3b za a = −3, b = 4: 2 · (−3)² − 3 · 4 = 2 · 9 − 3 · 4 = 18 − 12 = 6.
trditev: MAT-OS-8/algebrski-izrazi#primer2
besedilo: »Odgovor: vrednost izraza je $6$.« -/
theorem primer2 : (fun a b : ℝ => 2 * a ^ 2 - 3 * b) (-3) 4 = 6 := by
  calc (fun a b : ℝ => 2 * a ^ 2 - 3 * b) (-3) 4 = 2 * (-3) ^ 2 - 3 * 4 := rfl
    _ = 2 * 9 - 3 * 4 := by norm_num
    _ = 18 - 12 := by norm_num
    _ = 6 := by norm_num

/-- Primer 2, korak 2: (−3)² = 9.
trditev: MAT-OS-8/algebrski-izrazi#primer2-potenca
besedilo: »$(-3)^2 = 9$, ker je produkt dveh negativnih števil pozitiven.« -/
theorem primer2_potenca : ((-3):ℝ) ^ 2 = 9 := by norm_num

/-- Primer 3, koraka 1–3: 4x + 3y − 7x + 5 − y + 2 = (4x − 7x) + (3y − y) + (5 + 2) = −3x + 2y + 7 za vse
x, y.
trditev: MAT-OS-8/algebrski-izrazi#primer3-poenostavitev
besedilo: »Poenostavljen izraz: $-3x + 2y + 7$.« -/
theorem primer3_poenostavitev (x y : ℝ) : 4 * x + 3 * y - 7 * x + 5 - y + 2 = -3 * x + 2 * y + 7 := by
  calc 4 * x + 3 * y - 7 * x + 5 - y + 2 = (4 * x - 7 * x) + (3 * y - y) + (5 + 2) := by ring
    _ = -3 * x + 2 * y + 7 := by ring

/-- Primer 3, korak 4: za x = 2, y = −1: −3 · 2 + 2 · (−1) + 7 = −6 − 2 + 7 = −1.
trditev: MAT-OS-8/algebrski-izrazi#primer3-vrednost
besedilo: »Vstavimo: $-3 \cdot 2 + 2 \cdot (-1) + 7 = -6 - 2 + 7 = -1$.« -/
theorem primer3_vrednost : (-3:ℝ) * 2 + 2 * (-1) + 7 = -1 := by
  calc (-3:ℝ) * 2 + 2 * (-1) + 7 = -6 - 2 + 7 := by norm_num
    _ = -1 := by norm_num

/-- Primer 3, korak 5: preverba z začetnim izrazom: 4 · 2 + 3 · (−1) − 7 · 2 + 5 − (−1) + 2 =
8 − 3 − 14 + 5 + 1 + 2 = −1.
trditev: MAT-OS-8/algebrski-izrazi#primer3-preverba
besedilo: »Preverimo z začetnim izrazom: $8 - 3 - 14 + 5 + 1 + 2 = -1$.« -/
theorem primer3_preverba : (4:ℝ) * 2 + 3 * (-1) - 7 * 2 + 5 - (-1) + 2 = -1 := by
  calc (4:ℝ) * 2 + 3 * (-1) - 7 * 2 + 5 - (-1) + 2 = 8 - 3 - 14 + 5 + 1 + 2 := by norm_num
    _ = -1 := by norm_num

/-- Primer 4: 5x + 2y + 3x − y = 8x + y za vse x, y (5x + 3x = 8x, 2y − y = y).
trditev: MAT-OS-8/algebrski-izrazi#primer4-poenostavitev
besedilo: »Podobni členi: $5x + 3x = 8x$ in $2y - y = y$, torej $8x + y$.« -/
theorem primer4_poenostavitev (x y : ℝ) : 5 * x + 2 * y + 3 * x - y = 8 * x + y := by
  calc 5 * x + 2 * y + 3 * x - y = (5 * x + 3 * x) + (2 * y - y) := by ring
    _ = 8 * x + y := by ring

/-- Primer 4, Premisli: za x = 3, y = −2: 8 · 3 + (−2) = 24 − 2 = 22.
trditev: MAT-OS-8/algebrski-izrazi#primer4-vrednost
besedilo: »$8 \cdot 3 + (-2) = 24 - 2 = 22$. Lara ima $22$ točk.« -/
theorem primer4_vrednost : (8:ℝ) * 3 + (-2) = 22 := by
  calc (8:ℝ) * 3 + (-2) = 24 - 2 := by norm_num
    _ = 22 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake: 3x + 2y ni 5xy: za x = 2, y = 1 je 3x + 2y = 8, 5xy pa 10.
trditev: MAT-OS-8/algebrski-izrazi#napaka-nepodobni
besedilo: »Za $x = 2$, $y = 1$ je $3x + 2y = 8$, $5xy$ pa je $10$.« -/
theorem napaka_nepodobni :
    (3:ℝ) * 2 + 2 * 1 = 8 ∧ (5:ℝ) * 2 * 1 = 10 ∧ ¬ ∀ x y : ℝ, 3 * x + 2 * y = 5 * x * y := by
  refine ⟨by norm_num, by norm_num, fun h => ?_⟩
  have := h 2 1
  norm_num at this

/-- Pogoste napake: 3x² + 2x² = 5x² za vse x, a ne 5x⁴ (protiprimer x = 2: 20 ≠ 80); potenca se poveča
le pri množenju, x · x = x².
trditev: MAT-OS-8/algebrski-izrazi#napaka-potenca
besedilo: »Pri seštevanju podobnih členov se spremeni samo koeficient, črkovni del ostane: $5x^2$. Potenca se poveča le pri množenju, $x \cdot x = x^2$.« -/
theorem napaka_potenca :
    (∀ x : ℝ, 3 * x ^ 2 + 2 * x ^ 2 = 5 * x ^ 2) ∧ ¬ (∀ x : ℝ, 3 * x ^ 2 + 2 * x ^ 2 = 5 * x ^ 4) ∧
    (∀ x : ℝ, x * x = x ^ 2) := by
  refine ⟨fun x => by ring, fun h => ?_, fun x => by ring⟩
  have := h 2
  norm_num at this

/-- Pogoste napake: 3y − y = 2y (člen −y ima koeficient −1).
trditev: MAT-OS-8/algebrski-izrazi#napaka-koeficient-ena
besedilo: »Člen $y$ ima koeficient $1$, člen $-y$ pa $-1$. Pravilno je $3y - y = 2y$.« -/
theorem napaka_koeficient_ena (y : ℝ) : 3 * y - y = 2 * y ∧ -y = (-1) * y := ⟨by ring, by ring⟩

/-- Pogoste napake: −2² = −4, (−2)² = 4.
trditev: MAT-OS-8/algebrski-izrazi#napaka-oklepaj
besedilo: »Brez oklepaja se kvadrira le $2$. Pravilno: $(-2)^2 = 4$.« -/
theorem napaka_oklepaj : -(2:ℝ) ^ 2 = -4 ∧ ((-2):ℝ) ^ 2 = 4 := by norm_num

/-- Pogoste napake: »7, zmanjšano za x« je 7 − x; za x = 2 je 7 − 2 = 5, medtem ko je x − 7 = −5.
trditev: MAT-OS-8/algebrski-izrazi#napaka-obrnjen-vrstni-red
besedilo: »Preveri s številom: za $x = 2$ je $7 - 2 = 5$.« -/
theorem napaka_obrnjen_vrstni_red : (7:ℝ) - 2 = 5 ∧ (2:ℝ) - 7 = -5 := by norm_num

/-! ## Drugače -/

/-- Drugače: z analogijo: 3x + 5x = 8x; 8x + 2 ostane tako (ni en sam člen c · xᵏ).
trditev: MAT-OS-8/algebrski-izrazi#analogija
besedilo: »Skupaj je to osem škatel: $3x + 5x = 8x$. Ne veš, koliko je bombonov, a število škatel znaš sešteti. - Če imaš še $2$ posamezna bombona, ju ne moreš prišteti k škatlam. Ne veš, koliko bombonov je v škatli, zato $8x + 2$ ostane tako.« -/
theorem analogija :
    (∀ x : ℝ, 3 * x + 5 * x = 8 * x) ∧ ¬ ∃ (c : ℝ) (k : ℕ), ∀ x : ℝ, 8 * x + 2 = c * x ^ k := by
  refine ⟨fun x => by ring, ?_⟩
  rintro ⟨c, k, h⟩
  have h0 := h 0
  have h1 := h 1
  rcases Nat.eq_zero_or_pos k with hk | hk
  · subst hk; norm_num at h0 h1; linarith
  · rw [zero_pow hk.ne'] at h0; norm_num at h0

/-- Drugače: bolj natančno: distributivnost ma + na = (m + n)a.
trditev: MAT-OS-8/algebrski-izrazi#distributivnost
besedilo: »Zaradi **distributivnosti** množenja glede na seštevanje, ki velja za vsa števila: $$ma + na = (m + n)a$$« -/
theorem distributivnost (m n a : ℝ) : m * a + n * a = (m + n) * a := (add_mul m n a).symm

/-- Drugače: bolj natančno: preverba za x = 4: 3 · 4 + 5 · 4 = 12 + 20 = 32 in 8 · 4 = 32.
trditev: MAT-OS-8/algebrski-izrazi#preverba-x4
besedilo: »Preveri za $x = 4$: leva stran $3 \cdot 4 + 5 \cdot 4 = 12 + 20 = 32$, desna stran $8 \cdot 4 = 32$.« -/
theorem preverba_x4 : (3:ℝ) * 4 + 5 * 4 = 32 ∧ (8:ℝ) * 4 = 32 := by
  constructor
  · calc (3:ℝ) * 4 + 5 * 4 = 12 + 20 := by norm_num
      _ = 32 := by norm_num
  · norm_num

/-- Drugače: bolj natančno: 3x + 5x in 8x sta enakovredna (enaka pri vsakem x).
trditev: MAT-OS-8/algebrski-izrazi#enakovredna
besedilo: »$3x + 5x$ in $8x$ imata pri vsakem $x$ isto vrednost, le zapisana sta različno.« -/
theorem enakovredna : (fun x : ℝ => 3 * x + 5 * x) = fun x => 8 * x := by
  funext x; ring

/-- Drugače: bolj natančno: x + x² ni en člen: protiprimer x = 2 (2 + 4 = 6, 2x² = 8), in splošneje ni
c · xᵏ, ki bi bil enak x + x² za vse x.
trditev: MAT-OS-8/algebrski-izrazi#x-plus-x2
besedilo: »Dovolj je en protiprimer: za $x = 2$ je $x + x^2 = 2 + 4 = 6$, $2x^2$ pa bi dalo $8$. Zato $x + x^2$ ne moremo zapisati z enim členom.« -/
theorem x_plus_x2 :
    (2:ℝ) + 2 ^ 2 = 2 + 4 ∧ (2:ℝ) + 4 = 6 ∧ (2:ℝ) * 2 ^ 2 = 8 ∧
    (¬ ∀ x : ℝ, x + x ^ 2 = 2 * x ^ 2) ∧
    ¬ ∃ (c : ℝ) (k : ℕ), ∀ x : ℝ, x + x ^ 2 = c * x ^ k := by
  refine ⟨by norm_num, by norm_num, by norm_num, fun h => ?_, ?_⟩
  · have := h 2; norm_num at this
  · rintro ⟨c, k, h⟩
    have h1 := h 1
    have h2 := h (-1)
    simp at h1 h2
    linarith

/-! ## Preveri se -/

/-- Preveri se, 1. vprašanje: x, −2x in 7x so večkratniki x (oblike c · x s koeficienti 1, −2, 7),
3x² pa ni (`tri_x2_ni_veckratnik_x`).
trditev: MAT-OS-8/algebrski-izrazi#preveri1
besedilo: »$x$, $-2x$ in $7x$ imajo črkovni del $x$. Člen $3x^2$ ima črkovni del $x^2$, zato ni podoben ostalim.« -/
theorem preveri1 :
    (∃ c : ℝ, c = 1 ∧ ∀ x : ℝ, x = c * x) ∧ (∃ c : ℝ, c = -2 ∧ ∀ x : ℝ, -2 * x = c * x) ∧
    (∃ c : ℝ, c = 7 ∧ ∀ x : ℝ, 7 * x = c * x) ∧ (¬ ∃ c : ℝ, ∀ x : ℝ, 3 * x ^ 2 = c * x) :=
  ⟨⟨1, rfl, fun x => (one_mul x).symm⟩, ⟨-2, rfl, fun _ => rfl⟩, ⟨7, rfl, fun _ => rfl⟩,
    tri_x2_ni_veckratnik_x⟩

/-- Preveri se, 2. vprašanje: 3x² − 2x za x = −2: 3 · (−2)² − 2 · (−2) = 3 · 4 + 4 = 16. Napačni
odgovori: −8 = 3 · (−2²) − 2 · (−2); 8 = 3 · 4 − 4; 40 = (3 · (−2))² − 2 · (−2).
trditev: MAT-OS-8/algebrski-izrazi#preveri2
besedilo: »$3 \cdot (-2)^2 - 2 \cdot (-2) = 3 \cdot 4 + 4 = 16$.« -/
theorem preveri2 :
    (3:ℝ) * (-2) ^ 2 - 2 * (-2) = 3 * 4 + 4 ∧ (3:ℝ) * 4 + 4 = 16 ∧
    (3:ℝ) * (-(2 ^ 2)) - 2 * (-2) = -8 ∧ (3:ℝ) * 4 - 4 = 8 ∧ ((3:ℝ) * (-2)) ^ 2 - 2 * (-2) = 40 := by
  norm_num

/-- Preveri se, 3. vprašanje: 4x + 3x = 7x za vsak x, za x = 2, y = 1 pa je 4x + 3y = 11, 7xy = 14,
zato enakost 4x + 3y = 7xy ne velja (za vse x, y).
trditev: MAT-OS-8/algebrski-izrazi#preveri3
besedilo: »Za $x = 2$, $y = 1$ je $4x + 3y = 11$, $7xy$ pa $14$, zato enakost ne velja.« -/
theorem preveri3 :
    (∀ x : ℝ, 4 * x + 3 * x = 7 * x) ∧ (4:ℝ) * 2 + 3 * 1 = 11 ∧ (7:ℝ) * 2 * 1 = 14 ∧
    ¬ ∀ x y : ℝ, 4 * x + 3 * y = 7 * x * y :=
  ⟨fun x => by ring, by norm_num, by norm_num, fun h => by have := h 2 1; norm_num at this⟩

/-- Preveri se, 4. vprašanje: 5a + 2b − 3a + b = 2a + 3b; 1. korak 5a − 3a = 2a je pravilen,
2b + b = 3b, Nikov 2. korak (2b + b = 2b) pa velja le pri b = 0.
trditev: MAT-OS-8/algebrski-izrazi#preveri4
besedilo: »$2b + b = 2b + 1b = 3b$. Pravilni rezultat je $2a + 3b$.« -/
theorem preveri4 (a b : ℝ) :
    5 * a + 2 * b - 3 * a + b = 2 * a + 3 * b ∧ 5 * a - 3 * a = 2 * a ∧ 2 * b + b = 3 * b ∧
    (2 * b + b = 2 * b ↔ b = 0) :=
  ⟨by ring, by ring, by ring, by constructor <;> intro h <;> linarith⟩

/-- Preveri se, 5. vprašanje: skupaj 8h + 3 + 8h + 2 = 16h + 5; za h = 2: 16 · 2 + 5 = 37 (€). Napačna
odgovora: 8 · 2 + 5 = 21 in 21 · 2 = 42.
trditev: MAT-OS-8/algebrski-izrazi#preveri5
besedilo: »Skupaj: $8h + 3 + 8h + 2 = 16h + 5$. Za $h = 2$: $16 \cdot 2 + 5 = 37$, torej $37\,\text{€}$.« -/
theorem preveri5 :
    (∀ h : ℝ, 8 * h + 3 + 8 * h + 2 = 16 * h + 5) ∧ (16:ℝ) * 2 + 5 = 37 ∧ (8:ℝ) * 2 + 5 = 21 ∧
    (21:ℝ) * 2 = 42 := ⟨fun h => by ring, by norm_num, by norm_num, by norm_num⟩

end Evklid.Lekcije.MAT_OS_8.AlgebrskiIzrazi
