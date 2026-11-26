/-
vir: content/lessons/MAT-OS-9/talesov-izrek.md
sha256: 6ec37e693689322db5c55827612b39b35965eeeb5d59bb4bd303547450dbf7d4
Model (geometrija): ravnina je poljuben realni normiran prostor V; kot z vrhom S ima kraka S + a·u in S + b·v
(a, b > 0) z linearno neodvisnima u, v (kraka nista na isti premici). A = S + a·u, C = S + c·u z 0 < a < c
(A bližje vrhu), B = S + b·v, D = S + d·v z b, d > 0. »AB ∥ CD« pomeni D − C = t·(B − A) za neki t ∈ ℝ.
Dolžina XY je dist X Y. Pri deljenju daljice so P_k = A + k·w (w ni vzporeden z AB), točke na premici AB pa
A + s·(B − A). Razmerje p : q je količnik p/q (Lean: x/0 = 0; sorazmerje p/q = r/x zato ni pravilno niti pri
x = 0, ker je p, q, r ≠ 0). Števila brez enot (cm, mm, km, m so le v docstringih); decimalna števila so točni
ulomki v ℝ (2,5 = 5/2, 1,2 = 12/10 …). »Približno« je dokazano kot |točna − približek| < meja.
Ni v Leanu: risbe, simulacija in fizikalna poskusa (krožec na oknu, kovanec, palica in senca) kot meritve:
dokazani so le računi; »žarka sta kraka kota, krožec in Luna sta vzporedni daljici« in »premera sta pravokotna
na smer pogleda« (geometrijski model, privzet); utemeljitev s podobnimi trikotniki (KK, enaki koti pri
vzporednicah) in dokaz s ploščinami v »Bolj natančno« (izrek je dokazan drugače, z vektorji); konstrukcija s
šestilom in ravnilom kot postopek (dokazano: vzporednica skozi P_m k P_{m+n}B seka AB v natanko eni točki T z
AT : TB = m : n; pri N enakih odsekih vzporednice sekajo AB v T_k = A + (k/N)·(B − A), deli so enako dolgi); »Talesov izrek o kotu v polkrogu« (le omenjen);
opozorilo o Soncu; »Uporaba: višina iz sence« je dokazana le kot račun kviza 5 (vzporedni žarki so privzeti);
»Drugače: Na sliki« (lijak, »povečane kopije«) kot slika: dokazano je le, da je 384 000 km : 55 cm med
690 000 000 in 700 000 000; »prava vrednost 3 474 km« in razdalje Lune 357 000–407 000 km so podatki; »mrk je
popoln/kolobarjast« je razlaga (dokazano: 357 000 < SA < 407 000); besedilo napačnih odgovorov v kvizih
(dokazano, da napačne vrednosti niso pravilne, in kje je račun napačne vrednosti točen).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_9.TalesovIzrek

/-! ## Sorazmerje: zmnožek zunanjih = zmnožek notranjih -/

/-- Primer 1, korak 2 (pravilo): p : q = r : x natanko tedaj, ko je zmnožek zunanjih členov enak zmnožku
notranjih, p·x = q·r (p, q, r ≠ 0; tudi pri x = 0, kjer v Leanu r/0 = 0, sta obe strani napačni). -/
theorem sorazmerje (p q r x : ℝ) (hp : p ≠ 0) (hq : q ≠ 0) (hr : r ≠ 0) : p / q = r / x ↔ p * x = q * r := by
  by_cases hx : x = 0
  · subst hx
    simp [hp, hq, hr]
  · rw [div_eq_div_iff hq hx]
    constructor <;> intro h <;> linarith

/-- Predpostavke `sorazmerje` se dajo izpolniti (p = 3, q = 9, r = 4). -/
example : (3:ℝ) ≠ 0 ∧ (9:ℝ) ≠ 0 ∧ (4:ℝ) ≠ 0 := by norm_num

/-- Razdalja od S do S + a·u je |a|·‖u‖. -/
theorem dist_vrh {V : Type*} [NormedAddCommGroup V] [NormedSpace ℝ V] (S u : V) (a : ℝ) :
    dist S (S + a • u) = |a| * ‖u‖ := by
  rw [dist_comm, dist_eq_norm, add_sub_cancel_left, norm_smul, Real.norm_eq_abs]

/-- Razdalja med S + a·u in S + c·u je |a − c|·‖u‖. -/
theorem dist_krak {V : Type*} [NormedAddCommGroup V] [NormedSpace ℝ V] (S u : V) (a c : ℝ) :
    dist (S + a • u) (S + c • u) = |a - c| * ‖u‖ := by
  rw [dist_eq_norm]
  have : S + a • u - (S + c • u) = (a - c) • u := by rw [sub_smul]; abel
  rw [this, norm_smul, Real.norm_eq_abs]

/-- Vzporednost AB ∥ CD na krakih kota da c = t·a in d = t·b (zaradi linearne neodvisnosti u, v). -/
theorem vzporednost_koef {V : Type*} [NormedAddCommGroup V] [NormedSpace ℝ V] (S u v : V)
    (hi : LinearIndependent ℝ ![u, v]) (a b c d t : ℝ)
    (ht : (S + d • v) - (S + c • u) = t • ((S + b • v) - (S + a • u))) : c = t * a ∧ d = t * b := by
  have h0 : (t * a - c) • u + (d - t * b) • v = 0 := by
    linear_combination (norm := module) ht
  obtain ⟨h1, h2⟩ := LinearIndependent.pair_iff.mp hi _ _ h0
  constructor <;> linarith

/-- Konkretna slika kota: u = (1, 0), v = (0, 1) v ℝ × ℝ sta linearno neodvisna. -/
theorem primer_kota : LinearIndependent ℝ ![((1:ℝ), (0:ℝ)), ((0:ℝ), (1:ℝ))] := by
  rw [LinearIndependent.pair_iff]
  intro s t h
  have h1 := congrArg Prod.fst h
  have h2 := congrArg Prod.snd h
  simp at h1 h2
  exact ⟨h1, h2⟩

/-! ## Razlaga 2–5: Talesov izrek in obrat -/

section Izrek

variable {V : Type*} [NormedAddCommGroup V] [NormedSpace ℝ V]

/-- Razlaga 2 in Povzetek (Talesov izrek, cela odseka od vrha): če je AB ∥ CD, je SA : SC = SB : SD. -/
theorem tales_cela (S u v : V) (hi : LinearIndependent ℝ ![u, v]) (a b c d : ℝ) (ha : 0 < a) (hac : a < c)
    (hb : 0 < b) (hd : 0 < d) (hpar : ∃ t : ℝ, (S + d • v) - (S + c • u) = t • ((S + b • v) - (S + a • u))) :
    dist S (S + a • u) / dist S (S + c • u) = dist S (S + b • v) / dist S (S + d • v) := by
  obtain ⟨t, ht⟩ := hpar
  obtain ⟨hc', hd'⟩ := vzporednost_koef S u v hi a b c d t ht
  have hu : ‖u‖ ≠ 0 := norm_ne_zero_iff.mpr (hi.ne_zero 0)
  have hv : ‖v‖ ≠ 0 := norm_ne_zero_iff.mpr (hi.ne_zero 1)
  have hc : 0 < c := by linarith
  rw [dist_vrh, dist_vrh, dist_vrh, dist_vrh, abs_of_pos ha, abs_of_pos hb, abs_of_pos hc, abs_of_pos hd]
  rw [div_eq_div_iff (mul_ne_zero hc.ne' hu) (mul_ne_zero hd.ne' hv), hc', hd']
  ring

/-- Predpostavke `tales_cela` (in `tales_deli`, `tales_vzporednici`) se dajo izpolniti: u = (1, 0), v = (0, 1),
SA = 3, SC = 9, SB = 4, SD = 12, t = 3. -/
example : ∃ t : ℝ, ((0:ℝ × ℝ) + (12:ℝ) • ((0:ℝ), (1:ℝ))) - (0 + (9:ℝ) • ((1:ℝ), (0:ℝ))) =
    t • ((0 + (4:ℝ) • ((0:ℝ), (1:ℝ))) - (0 + (3:ℝ) • ((1:ℝ), (0:ℝ)))) ∧
    (0:ℝ) < 3 ∧ (3:ℝ) < 9 ∧ (0:ℝ) < 4 ∧ (0:ℝ) < 12 ∧ LinearIndependent ℝ ![((1:ℝ), (0:ℝ)), ((0:ℝ), (1:ℝ))] :=
  ⟨3, by ext <;> simp <;> norm_num, by norm_num, by norm_num, by norm_num, by norm_num, primer_kota⟩

/-- Razlaga 3 in Povzetek (odseka med vzporednicama): če je AB ∥ CD, je SA : AC = SB : BD. -/
theorem tales_deli (S u v : V) (hi : LinearIndependent ℝ ![u, v]) (a b c d : ℝ) (ha : 0 < a) (hac : a < c)
    (hb : 0 < b) (hpar : ∃ t : ℝ, (S + d • v) - (S + c • u) = t • ((S + b • v) - (S + a • u))) :
    dist S (S + a • u) / dist (S + a • u) (S + c • u) = dist S (S + b • v) / dist (S + b • v) (S + d • v) := by
  obtain ⟨t, ht⟩ := hpar
  obtain ⟨hc', hd'⟩ := vzporednost_koef S u v hi a b c d t ht
  have hu : ‖u‖ ≠ 0 := norm_ne_zero_iff.mpr (hi.ne_zero 0)
  have hv : ‖v‖ ≠ 0 := norm_ne_zero_iff.mpr (hi.ne_zero 1)
  have ht1 : 1 < t := by nlinarith
  have hbd : b < d := by rw [hd']; nlinarith
  rw [dist_vrh, dist_vrh, dist_krak, dist_krak, abs_of_pos ha, abs_of_pos hb, abs_of_neg (by linarith),
    abs_of_neg (by linarith)]
  rw [div_eq_div_iff (mul_ne_zero (by linarith) hu) (mul_ne_zero (by linarith) hv), hc', hd']
  ring

/-- Razlaga 4 in Povzetek (vzporednici sami): če je AB ∥ CD, je SA : SC = AB : CD (s celima odsekoma od vrha). -/
theorem tales_vzporednici (S u v : V) (hi : LinearIndependent ℝ ![u, v]) (a b c d : ℝ) (ha : 0 < a)
    (hac : a < c) (hpar : ∃ t : ℝ, (S + d • v) - (S + c • u) = t • ((S + b • v) - (S + a • u))) :
    dist S (S + a • u) / dist S (S + c • u) = dist (S + a • u) (S + b • v) / dist (S + c • u) (S + d • v) := by
  obtain ⟨t, ht⟩ := hpar
  obtain ⟨hc', -⟩ := vzporednost_koef S u v hi a b c d t ht
  have hu : ‖u‖ ≠ 0 := norm_ne_zero_iff.mpr (hi.ne_zero 0)
  have hc : 0 < c := by linarith
  have htp : 0 < t := by nlinarith
  have hAB : (S + a • u) - (S + b • v) ≠ 0 := by
    intro h
    have h0 : a • u + (-b) • v = 0 := by
      rw [neg_smul, ← sub_eq_add_neg]
      have : (S + a • u) - (S + b • v) = a • u - b • v := by abel
      rw [← this, h]
    have := (LinearIndependent.pair_iff.mp hi _ _ h0).1
    linarith
  have hCD : dist (S + c • u) (S + d • v) = t * dist (S + a • u) (S + b • v) := by
    rw [dist_comm, dist_eq_norm, ht, norm_smul, Real.norm_eq_abs, abs_of_pos htp, dist_comm, dist_eq_norm]
  have hABpos : dist (S + a • u) (S + b • v) ≠ 0 := by
    rw [dist_eq_norm]; exact norm_ne_zero_iff.mpr hAB
  rw [hCD, dist_vrh, dist_vrh, abs_of_pos ha, abs_of_pos hc, hc']
  field_simp

/-- Razlaga 5 in Povzetek (obrat): če je SA : SC = SB : SD, sta AB in CD vzporedni (D − C = (c/a)·(B − A)). -/
theorem tales_obrat (S u v : V) (hi : LinearIndependent ℝ ![u, v]) (a b c d : ℝ) (ha : 0 < a) (hac : a < c)
    (hb : 0 < b) (hd : 0 < d)
    (h : dist S (S + a • u) / dist S (S + c • u) = dist S (S + b • v) / dist S (S + d • v)) :
    ∃ t : ℝ, (S + d • v) - (S + c • u) = t • ((S + b • v) - (S + a • u)) := by
  have hu : ‖u‖ ≠ 0 := norm_ne_zero_iff.mpr (hi.ne_zero 0)
  have hv : ‖v‖ ≠ 0 := norm_ne_zero_iff.mpr (hi.ne_zero 1)
  have hc : 0 < c := by linarith
  rw [dist_vrh, dist_vrh, dist_vrh, dist_vrh, abs_of_pos ha, abs_of_pos hb, abs_of_pos hc, abs_of_pos hd,
    div_eq_div_iff (mul_ne_zero hc.ne' hu) (mul_ne_zero hd.ne' hv)] at h
  have key : a * d = b * c := by
    have : (a * d - b * c) * (‖u‖ * ‖v‖) = 0 := by linear_combination h
    rcases mul_eq_zero.mp this with h' | h'
    · linarith
    · exact absurd h' (mul_ne_zero hu hv)
  refine ⟨c / a, ?_⟩
  have hd' : d = c / a * b := by field_simp; linarith
  have hc' : c = c / a * a := by field_simp
  linear_combination (norm := module) hd' • v - hc' • u

/-- Predpostavke `tales_obrat` se dajo izpolniti (Razlaga 5, preizkus: SA = 2, SC = 5, SB = 3, SD = 7,5 v ℝ × ℝ
z u = (1, 0), v = (0, 1); 2 : 5 = 3 : 7,5). -/
example : dist (0:ℝ × ℝ) (0 + (2:ℝ) • ((1:ℝ), (0:ℝ))) / dist (0:ℝ × ℝ) (0 + (5:ℝ) • ((1:ℝ), (0:ℝ))) =
    dist (0:ℝ × ℝ) (0 + (3:ℝ) • ((0:ℝ), (1:ℝ))) / dist (0:ℝ × ℝ) (0 + (15/2:ℝ) • ((0:ℝ), (1:ℝ))) ∧
    (0:ℝ) < 2 ∧ (2:ℝ) < 5 ∧ (0:ℝ) < 3 ∧ (0:ℝ) < 15/2 ∧
    LinearIndependent ℝ ![((1:ℝ), (0:ℝ)), ((0:ℝ), (1:ℝ))] := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, primer_kota⟩
  rw [dist_vrh, dist_vrh, dist_vrh, dist_vrh]
  have h1 : ‖((1:ℝ), (0:ℝ))‖ = 1 := by simp [Prod.norm_def]
  have h2 : ‖((0:ℝ), (1:ℝ))‖ = 1 := by simp [Prod.norm_def]
  rw [h1, h2]; norm_num

end Izrek

/-- Bolj natančno: iz SA : SC = AB : CD vzporednosti ne smemo sklepati, tudi ko je B' med S in D (bližje vrhu,
kot v lekciji). Protiprimer v evklidski ravnini: S(0, 0), A(50, 0), C(100, 0), D(30, 40) in B'(21, 28) = 0,7·D
na istem kraku kot D (SB' = 35 < SD = 50); AB' = √1625, CD = √6500 = 2√1625, zato SA : SC = AB' : CD = 1 : 2,
a D − C = (−70, 40) ni večkratnik B' − A = (−29, 28) (vzporednica bi šla skozi (15, 20)). -/
theorem obrat_ne_za_vzporednici :
    let S : EuclideanSpace ℝ (Fin 2) := !₂[0, 0]
    let A : EuclideanSpace ℝ (Fin 2) := !₂[50, 0]
    let C : EuclideanSpace ℝ (Fin 2) := !₂[100, 0]
    let B' : EuclideanSpace ℝ (Fin 2) := !₂[21, 28]
    let D : EuclideanSpace ℝ (Fin 2) := !₂[30, 40]
    B' = (7/10 : ℝ) • D ∧ dist S A / dist S C = dist A B' / dist C D ∧ ¬ ∃ t : ℝ, D - C = t • (B' - A) := by
  intro S A C B' D
  refine ⟨?_, ?_, ?_⟩
  · ext i; fin_cases i <;> norm_num [B', D]
  · have hSA : dist S A = 50 := by
      simp only [EuclideanSpace.dist_eq, Fin.sum_univ_two, Real.dist_eq, S, A]
      simp
    have hSC : dist S C = 100 := by
      simp only [EuclideanSpace.dist_eq, Fin.sum_univ_two, Real.dist_eq, S, C]
      simp
    have hAB : dist A B' = Real.sqrt 1625 := by
      simp only [EuclideanSpace.dist_eq, Fin.sum_univ_two, Real.dist_eq, A, B']
      simp
      norm_num
    have hCD : dist C D = 2 * Real.sqrt 1625 := by
      simp only [EuclideanSpace.dist_eq, Fin.sum_univ_two, Real.dist_eq, C, D]
      simp
      rw [show ((100:ℝ) - 30) ^ 2 + 40 ^ 2 = 2 ^ 2 * 1625 by norm_num, Real.sqrt_mul (by norm_num),
        Real.sqrt_sq (by norm_num)]
    have h0 : Real.sqrt 1625 ≠ 0 := by positivity
    rw [hSA, hSC, hAB, hCD]
    field_simp
    norm_num
  · rintro ⟨t, ht⟩
    have h0 := congrArg (fun x => x 0) ht
    have h1 := congrArg (fun x => x 1) ht
    simp [C, D, A, B'] at h0 h1
    norm_num at h0 h1
    linarith

/-- Razlaga 4: sorazmerje SA : AC = AB : CD je napačno. Protiprimer z vzporednicama v evklidski ravnini:
S(0, 0), A(3, 0), C(9, 0), B(0, 3), D(0, 9); D − C = 3·(B − A) (AB ∥ CD), SA : AC = 3 : 6 = 1/2, a
AB : CD = √18 : (3√18) = 1/3. -/
theorem del_ni_za_vzporednici :
    let S : EuclideanSpace ℝ (Fin 2) := !₂[0, 0]
    let A : EuclideanSpace ℝ (Fin 2) := !₂[3, 0]
    let C : EuclideanSpace ℝ (Fin 2) := !₂[9, 0]
    let B : EuclideanSpace ℝ (Fin 2) := !₂[0, 3]
    let D : EuclideanSpace ℝ (Fin 2) := !₂[0, 9]
    D - C = (3:ℝ) • (B - A) ∧ dist S A / dist A C = 1 / 2 ∧ dist A B / dist C D = 1 / 3 ∧
    dist S A / dist A C ≠ dist A B / dist C D := by
  intro S A C B D
  have hSA : dist S A = 3 := by
    simp only [EuclideanSpace.dist_eq, Fin.sum_univ_two, Real.dist_eq, S, A]
    simp
  have hAC : dist A C = 6 := by
    simp only [EuclideanSpace.dist_eq, Fin.sum_univ_two, Real.dist_eq, A, C]
    norm_num
  have hAB : dist A B = Real.sqrt 18 := by
    simp only [EuclideanSpace.dist_eq, Fin.sum_univ_two, Real.dist_eq, A, B]
    simp
    norm_num
  have hCD : dist C D = 3 * Real.sqrt 18 := by
    simp only [EuclideanSpace.dist_eq, Fin.sum_univ_two, Real.dist_eq, C, D]
    simp
    rw [show (9:ℝ) ^ 2 + 9 ^ 2 = 3 ^ 2 * 18 by norm_num, Real.sqrt_mul (by norm_num),
      Real.sqrt_sq (by norm_num)]
  have h0 : Real.sqrt 18 ≠ 0 := by positivity
  have h2 : dist A B / dist C D = 1 / 3 := by rw [hAB, hCD]; field_simp
  refine ⟨?_, by rw [hSA, hAC]; norm_num, h2, ?_⟩
  · ext i; fin_cases i <;> norm_num [B, A, C, D]
  · rw [h2, hSA, hAC]; norm_num

/-! ## Razlaga 6 in 7: deljenje daljice -/

section Deljenje

variable {V : Type*} [NormedAddCommGroup V] [NormedSpace ℝ V]

/-- Razlaga 7 in Povzetek (deljenje v razmerju m : n): z P_k = A + k·w (w ni vzporeden z AB) točka
T = A + (m/(m+n))·(B − A) leži na vzporednici k P_{m+n}B skozi P_m; to je edina točka premice AB na tej
vzporednici; in AT : TB = m : n. -/
theorem deljenje (A B w : V) (hi : LinearIndependent ℝ ![w, B - A]) (m n : ℝ) (hm : 0 < m) (hn : 0 < n) :
    (A + (m / (m + n)) • (B - A)) - (A + m • w) = (m / (m + n)) • (B - (A + (m + n) • w)) ∧
    (∀ s r : ℝ, (A + s • (B - A)) - (A + m • w) = r • (B - (A + (m + n) • w)) → s = m / (m + n)) ∧
    dist A (A + (m / (m + n)) • (B - A)) / dist (A + (m / (m + n)) • (B - A)) B = m / n := by
  have hmn : m + n ≠ 0 := by linarith
  refine ⟨?_, ?_, ?_⟩
  · have e : (m / (m + n)) * (m + n) = m := by field_simp
    linear_combination (norm := module) e • w
  · intro s r h
    have h0 : (r * (m + n) - m) • w + (s - r) • (B - A) = 0 := by
      linear_combination (norm := module) h
    obtain ⟨h1, h2⟩ := LinearIndependent.pair_iff.mp hi _ _ h0
    have hr : r = m / (m + n) := by field_simp; linarith
    linarith
  · have hBA : ‖B - A‖ ≠ 0 := norm_ne_zero_iff.mpr (hi.ne_zero 1)
    have e1 : dist A (A + (m / (m + n)) • (B - A)) = m / (m + n) * ‖B - A‖ := by
      rw [dist_vrh, abs_of_pos (by positivity)]
    have e2 : dist (A + (m / (m + n)) • (B - A)) B = n / (m + n) * ‖B - A‖ := by
      rw [dist_eq_norm]
      have : A + (m / (m + n)) • (B - A) - B = (-(n / (m + n))) • (B - A) := by
        have e : m / (m + n) + n / (m + n) = 1 := by field_simp
        linear_combination (norm := module) e • (B - A)
      rw [this, norm_smul, Real.norm_eq_abs, abs_neg, abs_of_pos (by positivity)]
    rw [e1, e2]
    field_simp

/-- Predpostavke `deljenje` se dajo izpolniti: A = (0, 0), B = (10, 0), w = (0, 1) v ℝ × ℝ, m = 2, n = 3
(slika iz razlage: T pri 4). -/
example : LinearIndependent ℝ ![((0:ℝ), (1:ℝ)), ((10:ℝ), (0:ℝ)) - ((0:ℝ), (0:ℝ))] ∧ (0:ℝ) < 2 ∧ (0:ℝ) < 3 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  rw [LinearIndependent.pair_iff]
  intro s t h
  have h1 := congrArg Prod.fst h
  have h2 := congrArg Prod.snd h
  simp at h1 h2
  exact ⟨h2, h1⟩

/-- Razlaga 6 (deljenje na N enakih delov), povezava s konstrukcijo: iz `deljenje` za m = k, n = N − k
(0 < k < N): vzporednica skozi P_k = A + k·w k P_N B seka premico AB natanko v T_k = A + (k/N)·(B − A). -/
theorem konstrukcija_T (A B w : V) (hi : LinearIndependent ℝ ![w, B - A]) (N k : ℕ) (hk : 0 < k) (hkN : k < N) :
    (A + ((k:ℝ) / N) • (B - A)) - (A + (k:ℝ) • w) = ((k:ℝ) / N) • (B - (A + (N:ℝ) • w)) ∧
    (∀ s r : ℝ, (A + s • (B - A)) - (A + (k:ℝ) • w) = r • (B - (A + (N:ℝ) • w)) → s = (k:ℝ) / N) := by
  have hk' : (0:ℝ) < k := by exact_mod_cast hk
  have hkN' : (0:ℝ) < (N:ℝ) - k := by
    have : (k:ℝ) < N := by exact_mod_cast hkN
    linarith
  have e : (k:ℝ) + ((N:ℝ) - k) = N := by ring
  have h := deljenje A B w hi (k:ℝ) ((N:ℝ) - k) hk' hkN'
  rw [e] at h
  exact ⟨h.1, h.2.1⟩

/-- Predpostavke `konstrukcija_T` se dajo izpolniti: A = (0, 0), B = (10, 0), w = (0, 1), N = 5, k = 2. -/
example : LinearIndependent ℝ ![((0:ℝ), (1:ℝ)), ((10:ℝ), (0:ℝ)) - ((0:ℝ), (0:ℝ))] ∧ 0 < 2 ∧ 2 < 5 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  rw [LinearIndependent.pair_iff]
  intro s t h
  have h1 := congrArg Prod.fst h
  have h2 := congrArg Prod.snd h
  simp at h1 h2
  exact ⟨h2, h1⟩

/-- Razlaga 6 (deljenje na N enakih delov): točke T_k = A + (k/N)·(B − A) (po `konstrukcija_T` presečišča
vzporednic z AB) razdelijo AB na dele enake dolžine AB/N; T_0 = A, T_N = B. -/
theorem enaki_deli (A B : V) (N : ℕ) (hN : 0 < N) (k : ℕ) :
    dist (A + ((k:ℝ) / N) • (B - A)) (A + (((k:ℝ) + 1) / N) • (B - A)) = dist A B / N ∧
    A + ((0:ℝ) / N) • (B - A) = A ∧ A + ((N:ℝ) / N) • (B - A) = B := by
  have hN' : (N:ℝ) ≠ 0 := by exact_mod_cast hN.ne'
  refine ⟨?_, by simp, ?_⟩
  · rw [dist_krak, dist_eq_norm, norm_sub_rev]
    have : (k:ℝ) / N - ((k:ℝ) + 1) / N = -(1 / N) := by field_simp; ring
    rw [this, abs_neg, abs_of_pos (by positivity)]
    ring
  · rw [div_self hN', one_smul]; abel

/-- Predpostavka `enaki_deli` se da izpolniti (N = 5). -/
example : 0 < 5 := by norm_num

end Deljenje

/-- Razlaga 6, preizkus: s 7 odseki na poltraku dobiš 7 enakih delov (vsak del je AB/7, sedem delov je AB). -/
theorem sedem_delov (AB : ℝ) : 7 * (AB / 7) = AB := by ring

/-! ## Preizkusi v razlagi -/

/-- Razlaga 2, preizkus: 2 : 6 = 2,5 : SD natanko pri SD = 7,5 (SC je trikrat SA, SD = 3·2,5). -/
theorem preizkus2 (x : ℝ) : (2:ℝ) / 6 = (5/2) / x ↔ x = 15/2 := by
  rw [sorazmerje _ _ _ _ (by norm_num) (by norm_num) (by norm_num)]
  constructor <;> intro h <;> linarith

/-- Razlaga 2, preizkus: SC = 3·SA (6 = 3·2) in SD = 3·2,5 = 7,5. -/
theorem preizkus2_racun : (6:ℝ) = 3 * 2 ∧ (3:ℝ) * (5/2) = 15/2 := by norm_num

/-- Razlaga 3, preizkus: 4 : 2 = 6 : BD natanko pri BD = 3 (= 6 : 2). -/
theorem preizkus3 (x : ℝ) : (4:ℝ) / 2 = 6 / x ↔ x = 3 := by
  rw [sorazmerje _ _ _ _ (by norm_num) (by norm_num) (by norm_num)]
  constructor <;> intro h <;> linarith

/-- Razlaga 3, premisli: če je SC = 2,5·SA, je AC = SC − SA = 1,5·SA. -/
theorem premisli3 (SA : ℝ) : 5/2 * SA - SA = 3/2 * SA := by ring

/-- Bolj natančno (drugo sorazmerje iz prvega): če je SC = k·SA in SD = k·SB (k > 1), je AC = (k − 1)·SA,
BD = (k − 1)·SB in SA : AC = SB : BD. -/
theorem drugo_iz_prvega (SA SB k : ℝ) (hA : 0 < SA) (hB : 0 < SB) (hk : 1 < k) :
    k * SA - SA = (k - 1) * SA ∧ k * SB - SB = (k - 1) * SB ∧ SA / (k * SA - SA) = SB / (k * SB - SB) := by
  refine ⟨by ring, by ring, ?_⟩
  have h1 : k - 1 ≠ 0 := by linarith
  rw [show k * SA - SA = (k - 1) * SA by ring, show k * SB - SB = (k - 1) * SB by ring]
  field_simp

/-- Predpostavke `drugo_iz_prvega` se dajo izpolniti (SA = 3, SB = 4, k = 2,5). -/
example : (0:ℝ) < 3 ∧ (0:ℝ) < 4 ∧ (1:ℝ) < 5/2 := by norm_num

/-- Razlaga 4, preizkus in Zakaj se tega učimo: 5 mm : 550 mm = CD : 384 000 km natanko pri
CD = 384 000·5 : 550, kar je ≈ 3 491 km (|CD − 3 491| < 1/2), torej približno 3 500 km (|CD − 3 500| < 10). -/
theorem luna (x : ℝ) :
    ((5:ℝ) / 550 = x / 384000 ↔ x = 384000 * 5 / 550) ∧
    |(384000:ℝ) * 5 / 550 - 3491| < 1/2 ∧ |(384000:ℝ) * 5 / 550 - 3500| < 10 := by
  refine ⟨?_, ?_, ?_⟩
  · rw [div_eq_div_iff (by norm_num) (by norm_num)]
    constructor <;> intro h <;> linarith
  · rw [abs_lt]; constructor <;> norm_num
  · rw [abs_lt]; constructor <;> norm_num

/-- Razlaga 5, preizkus: 2 : 5 = 0,4 in 3 : 7,5 = 0,4. -/
theorem preizkus5 : (2:ℝ) / 5 = 4/10 ∧ (3:ℝ) / (15/2) = 4/10 := by norm_num

/-- Razlaga 7, premisli: pri 2 : 3 ima cela daljica 2 + 3 = 5 delov; s 3 odseki bi dobil 1 : 2 ali 2 : 1
(1 + 2 = 3). -/
theorem premisli7 : (2:ℕ) + 3 = 5 ∧ (1:ℕ) + 2 = 3 ∧ (2:ℕ) + 1 = 3 := by norm_num

/-! ## Rešeni primeri -/

/-- Primer 1: 3 : 9 = 4 : SD ima natanko rešitev SD = 12, po korakih: 3·SD = 9·4 = 36, SD = 36 : 3 = 12. -/
theorem primer1 (x : ℝ) : (3:ℝ) / 9 = 4 / x ↔ x = 12 := by
  calc (3:ℝ) / 9 = 4 / x ↔ 3 * x = 9 * 4 := sorazmerje _ _ _ _ (by norm_num) (by norm_num) (by norm_num)
    _ ↔ 3 * x = 36 := by norm_num
    _ ↔ x = 36 / 3 := by constructor <;> intro h <;> linarith
    _ ↔ x = 12 := by norm_num

/-- Primer 1, preizkus: 3 : 9 = 1/3 in 4 : 12 = 1/3. -/
theorem primer1_preizkus : (3:ℝ) / 9 = 1/3 ∧ (4:ℝ) / 12 = 1/3 := by norm_num

/-- Primer 2: en del d = 10 : 5 = 2 cm, AT = 2·2 = 4, TB = 3·2 = 6; preizkus 4 + 6 = 10 in 4 : 6 = 2 : 3. -/
theorem primer2_racun :
    (10:ℝ) / (2 + 3) = 10 / 5 ∧ (10:ℝ) / 5 = 2 ∧ (2:ℝ) * 2 = 4 ∧ (3:ℝ) * 2 = 6 ∧ (4:ℝ) + 6 = 10 ∧
    (4:ℝ) / 6 = 2 / 3 := by norm_num

/-- Primer 2: AT + TB = 10 in AT : TB = 2 : 3 natanko pri AT = 4, TB = 6. -/
theorem primer2 (x y : ℝ) : (x + y = 10 ∧ x / y = 2 / 3) ↔ (x = 4 ∧ y = 6) := by
  constructor
  · rintro ⟨h1, h2⟩
    have hy : y ≠ 0 := by
      rintro rfl; norm_num at h2
    rw [div_eq_div_iff hy (by norm_num)] at h2
    constructor <;> linarith
  · rintro ⟨rfl, rfl⟩; norm_num

/-- Primer 3: SA : 149 600 000 = 3 474 : 1 392 000 natanko pri SA = 149 600 000·3 474 : 1 392 000 ≈ 373 355 km
(|SA − 373 355| < 1/2), približno 373 000 km (|SA − 373 000| < 500), in 357 000 < SA < 407 000. -/
theorem primer3 (x : ℝ) :
    (x / 149600000 = (3474:ℝ) / 1392000 ↔ x = 149600000 * 3474 / 1392000) ∧
    |(149600000:ℝ) * 3474 / 1392000 - 373355| < 1/2 ∧ |(149600000:ℝ) * 3474 / 1392000 - 373000| < 500 ∧
    (357000:ℝ) < 149600000 * 3474 / 1392000 ∧ (149600000:ℝ) * 3474 / 1392000 < 407000 := by
  refine ⟨?_, ?_, ?_, by norm_num, by norm_num⟩
  · rw [div_eq_div_iff (by norm_num) (by norm_num)]
    constructor <;> intro h
    · field_simp; linarith
    · rw [h]; ring
  · rw [abs_lt]; constructor <;> norm_num
  · rw [abs_lt]; constructor <;> norm_num

/-- Primer 4: 6 : 4 = 9 : BD ima natanko rešitev BD = 6, po korakih: 6·BD = 4·9 = 36, BD = 36 : 6 = 6. -/
theorem primer4 (x : ℝ) : (6:ℝ) / 4 = 9 / x ↔ x = 6 := by
  calc (6:ℝ) / 4 = 9 / x ↔ 6 * x = 4 * 9 := sorazmerje _ _ _ _ (by norm_num) (by norm_num) (by norm_num)
    _ ↔ 6 * x = 36 := by norm_num
    _ ↔ x = 36 / 6 := by constructor <;> intro h <;> linarith
    _ ↔ x = 6 := by norm_num

/-- Primer 4, preizkus: 6 : 4 = 1,5 in 9 : 6 = 1,5. -/
theorem primer4_preizkus : (6:ℝ) / 4 = 3/2 ∧ (9:ℝ) / 6 = 3/2 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake 1: napačno sorazmerje 6 : 4 = 9 : SD bi dalo SD = 6; pravilno je SA : SC = SB : SD s
SC = 6 + 4 = 10, torej SD = 15 (= 9 + BD, BD = 6). -/
theorem napaka_cel_del (x : ℝ) : ((6:ℝ) / 4 = 9 / x ↔ x = 6) ∧ ((6:ℝ) / (6 + 4) = 9 / x ↔ x = 15) ∧
    (9:ℝ) + 6 = 15 := by
  refine ⟨primer4 x, ?_, by norm_num⟩
  rw [sorazmerje _ _ _ _ (by norm_num) (by norm_num) (by norm_num)]
  constructor <;> intro h <;> linarith

/-- Pogoste napake 2: pri SA = 2, SC = 8 je SC štirikrat SA, zato je SD = 4·SB (iz 2 : 8 = SB : SD, SB ≠ 0);
pravilo »za isto razliko« bi dalo SD = SB + 6, kar je pri SB ≠ 2 drugo število. -/
theorem napaka_razlika (SB SD : ℝ) (hB : SB ≠ 0) : ((2:ℝ) / 8 = SB / SD ↔ SD = 4 * SB) ∧ (8:ℝ) = 4 * 2 ∧
    (SB ≠ 2 → 4 * SB ≠ SB + 6) := by
  refine ⟨?_, by norm_num, fun h h' => h (by linarith)⟩
  rw [sorazmerje _ _ _ _ (by norm_num) (by norm_num) hB]
  constructor <;> intro h <;> linarith

/-- Predpostavka `napaka_razlika` se da izpolniti (SB = 3). -/
example : (3:ℝ) ≠ 0 := by norm_num

/-- Pogoste napake 3 (obrnjeno sorazmerje): če je 0 < SA < SC in 0 < SB < SD, je SA : SC < 1 < SD : SB, zato
SA : SC = SD : SB ne more veljati. -/
theorem napaka_obrnjeno (SA SC SB SD : ℝ) (h1 : 0 < SA) (h2 : SA < SC) (h3 : 0 < SB) (h4 : SB < SD) :
    SA / SC < 1 ∧ 1 < SD / SB ∧ SA / SC ≠ SD / SB := by
  have a : SA / SC < 1 := (div_lt_one (by linarith)).mpr h2
  have b : 1 < SD / SB := (one_lt_div h3).mpr h4
  exact ⟨a, b, by intro h; linarith⟩

/-- Predpostavke `napaka_obrnjeno` se dajo izpolniti (2, 6, 3, 9). -/
example : (0:ℝ) < 2 ∧ (2:ℝ) < 6 ∧ (0:ℝ) < 3 ∧ (3:ℝ) < 9 := by norm_num

/-- Pogoste napake 4: za AT : TB = 2 : 3 je en del AB : 5, ne AB : 3 (pri AB > 0). -/
theorem napaka_deli (AB : ℝ) (h : 0 < AB) : AB / (2 + 3) = AB / 5 ∧ AB / 5 ≠ AB / 3 := by
  refine ⟨by norm_num, ?_⟩
  intro h'
  field_simp at h'
  linarith

/-- Predpostavka `napaka_deli` se da izpolniti (AB = 10). -/
example : (0:ℝ) < 10 := by norm_num

/-- Pogoste napake 5 (različne enote): 1 m = 1000 mm, zato je količnik x : y (x v mm, y v m) 1000-krat
količnik x : (1000y) (oba v mm); pri x ≠ 0, y ≠ 0 sta zato različna. -/
theorem napaka_enote (x y : ℝ) : x / y = 1000 * (x / (1000 * y)) := by
  by_cases hy : y = 0
  · subst hy; simp
  · field_simp

/-- Pogoste napake 5: pri x ≠ 0 in y ≠ 0 se razmerji x : y in x : (1000y) res razlikujeta. -/
theorem napaka_enote_razlicno (x y : ℝ) (hx : x ≠ 0) (hy : y ≠ 0) : x / y ≠ x / (1000 * y) := by
  intro h
  rw [div_eq_div_iff hy (by positivity)] at h
  have : x * y * 999 = 0 := by linarith
  simp_all

/-- Predpostavki `napaka_enote_razlicno` se dasta izpolniti (x = 2, y = 3). -/
example : (2:ℝ) ≠ 0 ∧ (3:ℝ) ≠ 0 := by norm_num

/-! ## Drugače: Na sliki -/

/-- Na sliki: 384 000 km = 38 400 000 000 cm; 38 400 000 000 : 55 je med 690 000 000 in 700 000 000
(»skoraj 700 000 000-krat«). -/
theorem na_sliki : (384000:ℝ) * 100000 = 38400000000 ∧ (690000000:ℝ) < 38400000000 / 55 ∧
    (38400000000:ℝ) / 55 < 700000000 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1: pri SA = 2, SC = 6, SB = 3 je SD = 9 edina pravilna vrednost (2 : 6 = 3 : SD ↔ SD = 9);
SD = 7, SD = 3 (z SB = 9) in SD = 6 niso; 6 je BD iz 2 : 4 = 3 : 6, cel odsek je 3 + 6 = 9. -/
theorem kviz1 (x : ℝ) :
    ((2:ℝ) / 6 = 3 / x ↔ x = 9) ∧ (2:ℝ) / 6 ≠ 3 / 7 ∧ (2:ℝ) / 6 ≠ 9 / 3 ∧ (2:ℝ) / 6 ≠ 3 / 6 ∧
    (2:ℝ) / (6 - 2) = 3 / 6 ∧ (3:ℝ) + 6 = 9 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩
  rw [sorazmerje _ _ _ _ (by norm_num) (by norm_num) (by norm_num)]
  constructor <;> intro h <;> linarith

/-- Preveri se 2: 2,2 m = 220 cm; 2 : 220 = CD : 384 000 natanko pri CD = 384 000·2 : 220 ≈ 3 491
(|CD − 3 491| < 1/2), približno 3 500 km. Napačni vrednosti: brez pretvorbe 384 000·2 : 2,2 ≈ 349 091,
s 2 200 cm 384 000·2 : 2 200 ≈ 349, obrnjeno 384 000·220 : 2 = 42 240 000. -/
theorem kviz2 (x : ℝ) :
    (22/10:ℝ) * 100 = 220 ∧ ((2:ℝ) / 220 = x / 384000 ↔ x = 384000 * 2 / 220) ∧
    |(384000:ℝ) * 2 / 220 - 3491| < 1/2 ∧ |(384000:ℝ) * 2 / 220 - 3500| < 10 ∧
    |(384000:ℝ) * 2 / (22/10) - 349091| < 1/2 ∧ |(384000:ℝ) * 2 / 2200 - 349| < 1/2 ∧
    (384000:ℝ) * 220 / 2 = 42240000 := by
  refine ⟨by norm_num, ?_, ?_, ?_, ?_, ?_, by norm_num⟩
  · rw [div_eq_div_iff (by norm_num) (by norm_num)]
    constructor <;> intro h <;> linarith
  all_goals (rw [abs_lt]; constructor <;> norm_num)

/-- Preveri se 3: za 3 : 4 je vseh delov 3 + 4 = 7; za 1 : 1 sta 2 (sodo). -/
theorem kviz3 : (3:ℕ) + 4 = 7 ∧ (1:ℕ) + 1 = 2 := by norm_num

/-- Preveri se 4: AT : TB = 1 : 3 in AT = 3 natanko pri TB = 9, torej AB = 3 + 9 = 12 = 4·3. -/
theorem kviz4 (y : ℝ) : ((3:ℝ) / y = 1 / 3 ↔ y = 9) ∧ (3:ℝ) + 9 = 12 ∧ (4:ℝ) * 3 = 12 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  rw [eq_comm, sorazmerje _ _ _ _ (by norm_num) (by norm_num) (by norm_num)]
  constructor <;> intro h <;> linarith

/-- Preveri se 5: 1,2 : 1,8 = h : 60 natanko pri h = 60·1,2 : 1,8 = 40 m. Napačni vrednosti: obrnjeno
60·1,8 : 1,2 = 90, »enaka razlika« 60 − (1,8 − 1,2) = 59,4. -/
theorem kviz5 (h : ℝ) :
    ((12/10:ℝ) / (18/10) = h / 60 ↔ h = 40) ∧ (60:ℝ) * (12/10) / (18/10) = 40 ∧
    (60:ℝ) * (18/10) / (12/10) = 90 ∧ (60:ℝ) - (18/10 - 12/10) = 594/10 := by
  refine ⟨?_, by norm_num, by norm_num, by norm_num⟩
  rw [div_eq_div_iff (by norm_num) (by norm_num)]
  constructor <;> intro h' <;> linarith

end Evklid.Lekcije.MAT_OS_9.TalesovIzrek
