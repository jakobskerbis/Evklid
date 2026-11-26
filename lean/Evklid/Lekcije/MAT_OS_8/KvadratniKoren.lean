/-
vir: content/lessons/MAT-OS-8/kvadratni-koren.md
sha256: 688dceb0cb439b046bce2bd82ed18c88d88159083d8d8481922931018b23b002
Model: koren je `Real.sqrt` (√) v ℝ; decimalna števila so točni ulomki (0,49 = 49/100, 7,1 = 71/10); enote
(km², m) so le v docstringih. »Ni popolnega kvadrata, večjega od 1, za faktor« je zapisano kot
∀ k, 1 < k² → ¬ k² ∣ c v ℕ.
Lean: √a je definiran tudi za a < 0 (takrat √a = 0). Trditev »koren negativnega števila ne obstaja« je zato
dokazana v obliki lekcije: nobeno realno število na kvadrat ne da negativnega števila (`ni_korena_negativnega`).
Ni v Leanu: risbi (mreža 4 × 4, dve številski premici) in simulacija »Kvadratni koren in približki« (dokazane so
le številske trditve, ki jih kažejo, npr. 7 < √50 < 7,1; ne pa »odsek se skrči na desetino«); zgodba o
zemljevidu in štetju kvadratkov; analogija »vožnja tja in nazaj« in igra »više–niže« kot pripoved (dokazano je
(√49)² = 49, √(7²) = 7 in poskusi 7, 8, 7,1); »poznaj na pamet«; besede »tik ob«, »le malo nad«, »malo čez« (dokazane
so le ocene, ki jih podpirajo, npr. 7 < √50 < 7,1 in 14 < √200 < 15); »ploščina raste veliko hitreje kot
stranica« (dokazan je le primer 4 → 400, 2 → 20); »približno 7,7«, »približno 9,5«, »približno 1,4« so dokazani kot
ocene na desetinko z zaokrožitvijo (sredinski kvadrat);
splošno pravilo o štetju decimalk (»koren, ki se izide, ima pol toliko decimalk kot korenjenec«; dokazana sta
le primera √0,25 = 0,5 in √0,49 = 0,7).
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.KvadratniKoren

/-! ## Zakaj se tega učimo -/

/-- Zakaj se tega učimo: 7 · 7 = 49, zato je stranica rezervata √49 = 7 in pot naokoli 4 · 7 = 28.
trditev: MAT-OS-8/kvadratni-koren#rezervat49
besedilo: »$7 \cdot 7 = 49$. Pot naokoli je dolga $4 \cdot 7 = 28$ kilometrov.« -/
theorem rezervat49 : (7 : ℝ) * 7 = 49 ∧ Real.sqrt 49 = 7 ∧ (4 : ℝ) * 7 = 28 :=
  ⟨by norm_num, (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num), by norm_num⟩

/-- Zakaj se tega učimo: noben kvadrat iz celih kvadratkov nima točno 50 kvadratkov (50 ni n · n za noben
n ∈ ℕ).
trditev: MAT-OS-8/kvadratni-koren#ni-kvadrat-50
besedilo: »noben kvadrat iz celih kvadratkov nima točno $50$ kvadratkov« -/
theorem ni_kvadrat_50 : ¬ ∃ n : ℕ, n * n = 50 := by
  rintro ⟨n, hn⟩
  have : n ≤ 7 := by nlinarith
  interval_cases n <;> omega

/-! ## Razlaga -/

/-- Razlaga 1: iz 16 kvadratkov zložiš kvadrat le na en način, n · n = 16 natanko za n = 4.
trditev: MAT-OS-8/kvadratni-koren#kvadrat16
besedilo: »Iz $16$ enakih kvadratkov lahko zložiš kvadrat le na en način: $4$ vrste po $4$.« -/
theorem kvadrat16 (n : ℕ) : n * n = 16 ↔ n = 4 := by
  constructor
  · intro h
    have : n ≤ 4 := by nlinarith
    interval_cases n <;> omega
  · rintro rfl; rfl

/-- Razlaga 2 (tabela): kvadrati števil 1, …, 15 so 1, 4, 9, …, 225.
trditev: MAT-OS-8/kvadratni-koren#tabela-kvadratov
besedilo: »| 1 | 1 | 81 | 9 | | 4 | 2 | 100 | 10 | | 9 | 3 | 121 | 11 | | 16 | 4 | 144 | 12 | | 25 | 5 | 169 | 13 | | 36 | 6 | 196 | 14 | | 49 | 7 | 225 | 15 | | 64 | 8 | | |« -/
theorem tabela_kvadratov :
    (List.range 15).map (fun k => (k + 1) ^ 2) =
      [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225] := by decide

/-- Razlaga 2 (tabela, brana od ploščine proti stranici): za k ≥ 0 je √(k²) = k; zato ima vsak popoln kvadrat
iz tabele naraven koren.
trditev: MAT-OS-8/kvadratni-koren#koren-kvadrata
besedilo: »Števila v stolpcih »ploščina« so **popolni kvadrati**: njihova stranica je naravno število.« -/
theorem koren_kvadrata (k : ℝ) (hk : 0 ≤ k) : Real.sqrt (k ^ 2) = k := Real.sqrt_sq hk

/-- Predpostavka `koren_kvadrata` se da izpolniti (k = 15). -/
example : (0 : ℝ) ≤ 15 := by norm_num

/-- Razlaga 2, Premisli: √4 = 2, √400 = 20 (20 · 20 = 400); ploščina je 100-krat večja, stranica le
10-krat (10 · 10 = 100).
trditev: MAT-OS-8/kvadratni-koren#premisli400
besedilo: »Stranica je $20$, ker je $20 \cdot 20 = 400$. Povečala se je le $10$-krat, saj je $10 \cdot 10 = 100$.« -/
theorem premisli400 :
    Real.sqrt 4 = 2 ∧ Real.sqrt 400 = 20 ∧ (400 : ℝ) = 100 * 4 ∧ (20 : ℝ) = 10 * 2 ∧ (10 : ℝ) * 10 = 100 :=
  ⟨(Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num),
    (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num), by norm_num, by norm_num,
    by norm_num⟩

/-- Razlaga 3 in Povzetek (definicija): za a ≥ 0 in b ≥ 0 je √a = b natanko tedaj, ko b² = a.
trditev: MAT-OS-8/kvadratni-koren#koren-def
besedilo: »$\sqrt{a} = b$ pomeni $b^2 = a$, pri čemer $a \ge 0$ in $b \ge 0$« -/
theorem koren_def (a b : ℝ) (ha : 0 ≤ a) (hb : 0 ≤ b) : Real.sqrt a = b ↔ b ^ 2 = a := by
  rw [Real.sqrt_eq_iff_eq_sq ha hb, eq_comm]

/-- Predpostavki `koren_def` se dajo izpolniti (a = 49, b = 7). -/
example : (0 : ℝ) ≤ 49 ∧ (0 : ℝ) ≤ 7 := by norm_num

/-- Razlaga 3: √49 = 7, ker je 7² = 49.
trditev: MAT-OS-8/kvadratni-koren#koren49
besedilo: »Tako je $\sqrt{49} = 7$, ker je $7^2 = 49$.« -/
theorem koren49 : Real.sqrt 49 = 7 ∧ (7 : ℝ) ^ 2 = 49 := by
  refine ⟨?_, by norm_num⟩
  rw [koren_def 49 7 (by norm_num) (by norm_num)]; norm_num

/-- Razlaga 3: korenjenje in kvadriranje se razveljavita, (√a)² = a za a ≥ 0.
trditev: MAT-OS-8/kvadratni-koren#koren-na-kvadrat
besedilo: »Korenjenje in kvadriranje se razveljavita: $\left(\sqrt{a}\right)^2 = a$.« -/
theorem koren_na_kvadrat (a : ℝ) (ha : 0 ≤ a) : Real.sqrt a ^ 2 = a := Real.sq_sqrt ha

/-- Predpostavka `koren_na_kvadrat` se da izpolniti (a = 49). -/
example : (0 : ℝ) ≤ 49 := by norm_num

/-- Razlaga 3, Pogoste napake in Povzetek: koren negativnega števila ne obstaja: za a < 0 ni realnega b z
b² = a, ker je kvadrat vsakega števila ≥ 0.
trditev: MAT-OS-8/kvadratni-koren#ni-korena-negativnega
besedilo: »Koren negativnega števila ne obstaja. Kvadrat vsakega števila je $\ge 0$« -/
theorem ni_korena_negativnega (a : ℝ) (ha : a < 0) : ¬ ∃ b : ℝ, b ^ 2 = a := by
  rintro ⟨b, hb⟩
  have := sq_nonneg b
  linarith

/-- Predpostavka `ni_korena_negativnega` se da izpolniti (a = −9, a = −16). -/
example : (-9 : ℝ) < 0 ∧ (-16 : ℝ) < 0 := by norm_num

/-- Razlaga 3, Pogoste napake in Povzetek: √16 = 4 in ne ±4; res je (−4)² = 16, a √16 ≠ −4, ker √ vedno da
nenegativno število.
trditev: MAT-OS-8/kvadratni-koren#koren16
besedilo: »$\sqrt{16}$ je samo $4$, ne »$\pm 4$«. Res je $(-4)^2 = 16$, a znak $\sqrt{\ }$ vedno pomeni nenegativno število« -/
theorem koren16 : Real.sqrt 16 = 4 ∧ (-4 : ℝ) ^ 2 = 16 ∧ Real.sqrt 16 ≠ -4 ∧ ∀ a : ℝ, 0 ≤ Real.sqrt a := by
  have h : Real.sqrt 16 = 4 := (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)
  exact ⟨h, by norm_num, by rw [h]; norm_num, fun a => Real.sqrt_nonneg a⟩

/-- Razlaga 4, Pogoste napake, Povzetek in Preveri se 2: √0,25 = 0,5 (0,5 · 0,5 = 0,25), √0,49 = 0,7 in ne 0,07,
ker je 0,07² = 0,0049.
trditev: MAT-OS-8/kvadratni-koren#decimalke
besedilo: »$\sqrt{0{,}25} = 0{,}5$, ker je $0{,}5 \cdot 0{,}5 = 0{,}25$. Korenjenec ima dve decimalki, koren eno. Zato je $\sqrt{0{,}49} = 0{,}7$ in ne $0{,}07$.« -/
theorem decimalke :
    Real.sqrt (25 / 100) = 5 / 10 ∧ Real.sqrt (49 / 100) = 7 / 10 ∧ Real.sqrt (49 / 100) ≠ 7 / 100 ∧
      ((7 : ℝ) / 100) ^ 2 = 49 / 10000 := by
  have h : Real.sqrt (49 / 100) = 7 / 10 :=
    (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)
  exact ⟨(Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num), h, by rw [h]; norm_num,
    by norm_num⟩

/-- Razlaga 5, Primer 3, Primer 4, Povzetek in Bolj natančno (ocena brez računala): če je n² < a < (n + 1)²
(n naravno), je n < √a < n + 1.
trditev: MAT-OS-8/kvadratni-koren#ocena
besedilo: »Splošno: če je $n^2 < a < (n+1)^2$, je $n < \sqrt{a} < n + 1$.« -/
theorem ocena (n : ℕ) (a : ℝ) (h1 : (n : ℝ) ^ 2 < a) (h2 : a < ((n : ℝ) + 1) ^ 2) :
    (n : ℝ) < Real.sqrt a ∧ Real.sqrt a < n + 1 :=
  ⟨(Real.lt_sqrt (Nat.cast_nonneg n)).mpr h1, (Real.sqrt_lt' (by positivity)).mpr h2⟩

/-- Predpostavki `ocena` se dajo izpolniti (n = 7, a = 50). -/
example : ((7 : ℕ) : ℝ) ^ 2 < 50 ∧ (50 : ℝ) < ((7 : ℕ) + 1) ^ 2 := by norm_num

/-- Bolj natančno: za nenegativna števila večje število da večji kvadrat (0 ≤ x < y ⇒ x² < y²).
trditev: MAT-OS-8/kvadratni-koren#vecji-kvadrat
besedilo: »Za nenegativna števila večje število da večji kvadrat.« -/
theorem vecji_kvadrat (x y : ℝ) (hx : 0 ≤ x) (h : x < y) : x ^ 2 < y ^ 2 := by nlinarith

/-- Predpostavki `vecji_kvadrat` se dajo izpolniti (x = 7, y = 7,1). -/
example : (0 : ℝ) ≤ 7 ∧ (7 : ℝ) < 71 / 10 := by norm_num

/-- Razlaga 5 in Primer 3, korak 1–2: 49 < 50 < 64, zato 7 < √50 < 8; 7,1² = 50,41 > 50, zato 7 < √50 < 7,1.
trditev: MAT-OS-8/kvadratni-koren#koren50-ocena
besedilo: »$7{,}1^2 = 50{,}41$ je že preveč, $7^2 = 49$ premalo, zato je $7 < \sqrt{50} < 7{,}1$« -/
theorem koren50_ocena :
    (49 : ℝ) < 50 ∧ (50 : ℝ) < 64 ∧ 7 < Real.sqrt 50 ∧ Real.sqrt 50 < 8 ∧ ((71 : ℝ) / 10) ^ 2 = 5041 / 100 ∧
      Real.sqrt 50 < 71 / 10 := by
  refine ⟨by norm_num, by norm_num, (Real.lt_sqrt (by norm_num)).mpr (by norm_num),
    (Real.sqrt_lt' (by norm_num)).mpr (by norm_num), by norm_num, (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)⟩

/-- Razlaga 5: decimalke √50 se nikoli ne končajo: √50 je iracionalen in zato ni enak nobenemu končnemu
decimalnemu številu m/10ᵏ.
trditev: MAT-OS-8/kvadratni-koren#koren50-iracionalen
besedilo: »Decimalke korena $\sqrt{50}$ se nikoli ne končajo« -/
theorem koren50_iracionalen : Irrational (Real.sqrt 50) ∧ ¬ ∃ (m : ℤ) (k : ℕ), Real.sqrt 50 = m / 10 ^ k := by
  have hi : Irrational (Real.sqrt 50) := by
    have h := irrational_sqrt_natCast_iff (n := 50)
    push_cast at h
    refine h.mpr ?_
    rintro ⟨r, hr⟩
    have : r ≤ 7 := by nlinarith
    interval_cases r <;> omega
  refine ⟨hi, ?_⟩
  rintro ⟨m, k, h⟩
  exact hi ⟨(m : ℚ) / 10 ^ k, by push_cast; exact h.symm⟩

/-- Razlaga 5, Premisli: 7,5² = 56,25 < 60, zato √60 > 7,5; »približno 7,7«: 7,7² = 59,29 < 60 < 60,0625 = 7,75²,
zato 7,7 < √60 < 7,75 in je √60 na eno decimalko 7,7.
trditev: MAT-OS-8/kvadratni-koren#koren60
besedilo: »$7{,}5^2 = 56{,}25$, kar je manj od $60$. Kvadrat s stranico $7{,}5$ je premajhen, zato je $\sqrt{60} > 7{,}5$ (približno $7{,}7$).« -/
theorem koren60 :
    ((75 : ℝ) / 10) ^ 2 = 5625 / 100 ∧ (75 : ℝ) / 10 < Real.sqrt 60 ∧ (77 : ℝ) / 10 < Real.sqrt 60 ∧
      Real.sqrt 60 < 775 / 100 := by
  refine ⟨by norm_num, (Real.lt_sqrt (by norm_num)).mpr (by norm_num), (Real.lt_sqrt (by norm_num)).mpr (by norm_num),
    (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)⟩

/-- Razlaga 6, Primer 2, Povzetek in Bolj natančno (delno korenjenje): za a, b ≥ 0 je √(a · b) = √a · √b
(dokaz iz lekcije: x = √a, y = √b, x · y ≥ 0 in (x · y)² = x² · y² = a · b).
trditev: MAT-OS-8/kvadratni-koren#koren-produkta
besedilo: »Pravilo je $\sqrt{a \cdot b} = \sqrt{a} \cdot \sqrt{b}$ za $a, b \ge 0$.« -/
theorem koren_produkta (a b : ℝ) (ha : 0 ≤ a) (hb : 0 ≤ b) :
    Real.sqrt (a * b) = Real.sqrt a * Real.sqrt b := by
  rw [koren_def (a * b) _ (mul_nonneg ha hb) (mul_nonneg (Real.sqrt_nonneg a) (Real.sqrt_nonneg b))]
  calc (Real.sqrt a * Real.sqrt b) ^ 2 = Real.sqrt a ^ 2 * Real.sqrt b ^ 2 := by ring
    _ = a * b := by rw [Real.sq_sqrt ha, Real.sq_sqrt hb]

/-- Predpostavki `koren_produkta` se dajo izpolniti (a = 25, b = 2). -/
example : (0 : ℝ) ≤ 25 ∧ (0 : ℝ) ≤ 2 := by norm_num

/-- Razlaga 6: 50 : 25 = 2 in √50 = √(25 · 2) = √25 · √2 = 5√2.
trditev: MAT-OS-8/kvadratni-koren#koren50
besedilo: »\sqrt{50} = \sqrt{25 \cdot 2} = \sqrt{25} \cdot \sqrt{2} = 5\sqrt{2}« -/
theorem koren50 : (50 : ℝ) / 25 = 2 ∧ Real.sqrt 50 = 5 * Real.sqrt 2 := by
  refine ⟨by norm_num, ?_⟩
  calc Real.sqrt 50 = Real.sqrt (25 * 2) := by norm_num
    _ = Real.sqrt 25 * Real.sqrt 2 := koren_produkta 25 2 (by norm_num) (by norm_num)
    _ = 5 * Real.sqrt 2 := by
        rw [(Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num : (0 : ℝ) < 5)).mpr (by norm_num)]

/-- Razlaga 6 in Povzetek: za vsoto pravilo ne velja: √(9 + 16) = √25 = 5, √9 + √16 = 3 + 4 = 7.
trditev: MAT-OS-8/kvadratni-koren#koren-vsote
besedilo: »Za vsoto takega pravila ni: $\sqrt{9 + 16} = \sqrt{25} = 5$, $\sqrt{9} + \sqrt{16}$ pa je $7$.« -/
theorem koren_vsote :
    Real.sqrt (9 + 16) = 5 ∧ Real.sqrt 9 + Real.sqrt 16 = 7 ∧ Real.sqrt (9 + 16) ≠ Real.sqrt 9 + Real.sqrt 16 := by
  have h1 : Real.sqrt (9 + 16) = 5 := (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)
  have h2 : Real.sqrt 9 = 3 := (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)
  have h3 : Real.sqrt 16 = 4 := (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)
  refine ⟨h1, by rw [h2, h3]; norm_num, by rw [h1, h2, h3]; norm_num⟩

/-! ## Rešeni primeri -/

/-- Primer 1 (park, 2500 m²): 2500 = 25 · 100, √2500 = 5 · 10 = 50; preizkus 50 · 50 = 2500.
trditev: MAT-OS-8/kvadratni-koren#primer1
besedilo: »$2500 = 25 \cdot 100$. Zato je $\sqrt{2500} = 5 \cdot 10 = 50$. 2. Preverimo s kvadriranjem: $50 \cdot 50 = 2500$.« -/
theorem primer1 : (2500 : ℝ) = 25 * 100 ∧ Real.sqrt 2500 = 50 ∧ (50 : ℝ) * 50 = 2500 := by
  refine ⟨by norm_num, ?_, by norm_num⟩
  calc Real.sqrt 2500 = Real.sqrt (25 * 100) := by norm_num
    _ = Real.sqrt 25 * Real.sqrt 100 := koren_produkta 25 100 (by norm_num) (by norm_num)
    _ = 5 * 10 := by
        rw [(Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num : (0 : ℝ) < 5)).mpr (by norm_num),
          (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num : (0 : ℝ) < 10)).mpr (by norm_num)]
    _ = 50 := by norm_num

/-- Primer 2, korak 1: popolni kvadrati, večji od 1, ki delijo 72, so natanko 4, 9 in 36 (k = 2, 3, 6);
največji je 36.
trditev: MAT-OS-8/kvadratni-koren#primer2-kvadrati
besedilo: »Popolni kvadrati, večji od $1$, ki delijo $72$, so $4$, $9$ in $36$.« -/
theorem primer2_kvadrati (k : ℕ) : (1 < k ^ 2 ∧ k ^ 2 ∣ 72) ↔ k = 2 ∨ k = 3 ∨ k = 6 := by
  constructor
  · rintro ⟨h1, h2⟩
    have hle : k ^ 2 ≤ 72 := Nat.le_of_dvd (by norm_num) h2
    have : k ≤ 8 := by nlinarith
    interval_cases k <;> simp_all
  · rintro (rfl | rfl | rfl) <;> norm_num

/-- Primer 2 (delno korenjenje √72): √72 = √36 · √2 = 6√2 (72 = 36 · 2); preizkus 6² · 2 = 36 · 2 = 72.
trditev: MAT-OS-8/kvadratni-koren#primer2
besedilo: »Preverimo s kvadriranjem: $6^2 \cdot 2 = 36 \cdot 2 = 72$. ✓ 5. Odgovor: $\sqrt{72} = 6\sqrt{2}$.« -/
theorem primer2 : Real.sqrt 72 = 6 * Real.sqrt 2 ∧ (6 : ℝ) ^ 2 * 2 = 36 * 2 ∧ (36 : ℝ) * 2 = 72 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  calc Real.sqrt 72 = Real.sqrt (36 * 2) := by norm_num
    _ = Real.sqrt 36 * Real.sqrt 2 := koren_produkta 36 2 (by norm_num) (by norm_num)
    _ = 6 * Real.sqrt 2 := by
        rw [(Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num : (0 : ℝ) < 6)).mpr (by norm_num)]

/-- Primer 2: pod korenom ostane 2, ki nima več popolnega kvadrata, večjega od 1, za faktor.
pomozno – lekcija ne trdi izrecno, da 2 nima kvadratnega faktorja (pove le »Iščemo«) -/
theorem primer2_dokoncano (k : ℕ) (hk : 1 < k ^ 2) : ¬ k ^ 2 ∣ 2 := by
  intro h
  have := Nat.le_of_dvd (by norm_num) h
  have : k ≤ 1 := by nlinarith
  interval_cases k <;> omega

/-- Predpostavka `primer2_dokoncano` se da izpolniti (k = 2). -/
example : 1 < (2 : ℕ) ^ 2 := by norm_num

/-- Primer 2: z manjšim kvadratom √72 = 2√18; to ni napačno (2√18 = 6√2), a 18 = 9 · 2 ima še faktor 9.
trditev: MAT-OS-8/kvadratni-koren#primer2-nedokoncano
besedilo: »Z manjšim kvadratom bi dobil $\sqrt{72} = 2\sqrt{18}$. To ni napačno, a ni dokončano: $18$ ima še faktor $9$.« -/
theorem primer2_nedokoncano :
    Real.sqrt 72 = 2 * Real.sqrt 18 ∧ 2 * Real.sqrt 18 = 6 * Real.sqrt 2 ∧ (9 : ℕ) ∣ 18 := by
  have h18 : Real.sqrt 18 = 3 * Real.sqrt 2 := by
    calc Real.sqrt 18 = Real.sqrt (9 * 2) := by norm_num
      _ = Real.sqrt 9 * Real.sqrt 2 := koren_produkta 9 2 (by norm_num) (by norm_num)
      _ = 3 * Real.sqrt 2 := by
          rw [(Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num : (0 : ℝ) < 3)).mpr (by norm_num)]
  refine ⟨?_, by rw [h18]; ring, by norm_num⟩
  calc Real.sqrt 72 = Real.sqrt (4 * 18) := by norm_num
    _ = Real.sqrt 4 * Real.sqrt 18 := koren_produkta 4 18 (by norm_num) (by norm_num)
    _ = 2 * Real.sqrt 18 := by
        rw [(Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num : (0 : ℝ) < 2)).mpr (by norm_num)]

/-- Primer 3 (rezervat 50 km²), korak 3: 7,05² = 49,7025 < 50, zato 7,05 < √50 < 7,1 in je √50 ≈ 7,1.
trditev: MAT-OS-8/kvadratni-koren#primer3-zaokrozitev
besedilo: »$7{,}05^2 = 49{,}7025$, kar je manj od $50$. Stranica je daljša od $7{,}05$, zato je $a \approx 7{,}1\,\text{km}$.« -/
theorem primer3_zaokrozitev :
    ((705 : ℝ) / 100) ^ 2 = 497025 / 10000 ∧ (705 : ℝ) / 100 < Real.sqrt 50 ∧ Real.sqrt 50 < 71 / 10 :=
  ⟨by norm_num, (Real.lt_sqrt (by norm_num)).mpr (by norm_num), (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)⟩

/-- Primer 3, korak 4: 4 · 7,05 = 28,2 in 4 · 7,1 = 28,4, zato je obseg 4√50 med 28,2 in 28,4 (približno 28).
trditev: MAT-OS-8/kvadratni-koren#primer3-obseg
besedilo: »Obseg je med $4 \cdot 7{,}05 = 28{,}2$ in $4 \cdot 7{,}1 = 28{,}4$ kilometra.« -/
theorem primer3_obseg :
    (4 : ℝ) * (705 / 100) = 282 / 10 ∧ (4 : ℝ) * (71 / 10) = 284 / 10 ∧
      (282 : ℝ) / 10 < 4 * Real.sqrt 50 ∧ 4 * Real.sqrt 50 < 284 / 10 := by
  obtain ⟨-, h1, h2⟩ := primer3_zaokrozitev
  refine ⟨by norm_num, by norm_num, by linarith, by linarith⟩

/-- Primer 4 (počivališče 300 m²): 17² = 289 < 300 < 324 = 18²; 17,3² = 299,29 < 300 < 302,76 = 17,4² in
17,35² = 301,0225 > 300, zato 17,3 < √300 < 17,35 (bližje 17 kot 18) in √300 ≈ 17,3.
trditev: MAT-OS-8/kvadratni-koren#primer4
besedilo: »$17{,}3^2 = 299{,}29 < 300$ in $17{,}4^2 = 302{,}76 > 300$, zato je $17{,}3 < a < 17{,}4$. Ker je $17{,}35^2 = 301{,}0225 > 300$, je $a$ manjši od $17{,}35$, torej $a \approx 17{,}3\,\text{m}$.« -/
theorem primer4 :
    (17 : ℝ) ^ 2 = 289 ∧ (18 : ℝ) ^ 2 = 324 ∧ ((173 : ℝ) / 10) ^ 2 = 29929 / 100 ∧
      ((174 : ℝ) / 10) ^ 2 = 30276 / 100 ∧ ((1735 : ℝ) / 100) ^ 2 = 3010225 / 10000 ∧
      (17 : ℝ) < Real.sqrt 300 ∧ Real.sqrt 300 < 18 ∧ Real.sqrt 300 - 17 < 18 - Real.sqrt 300 ∧
      (173 : ℝ) / 10 < Real.sqrt 300 ∧ Real.sqrt 300 < 174 / 10 ∧ Real.sqrt 300 < 1735 / 100 := by
  have h1 : (173 : ℝ) / 10 < Real.sqrt 300 := (Real.lt_sqrt (by norm_num)).mpr (by norm_num)
  have h2 : Real.sqrt 300 < 1735 / 100 := (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by linarith, by linarith,
    by linarith, h1, by linarith, h2⟩

/-! ## Pogoste napake -/

/-- Pogoste napake: √36 = 6 in ne 18 (36 : 2).
trditev: MAT-OS-8/kvadratni-koren#koren36
besedilo: »$\sqrt{36}$ ni $18$. Iščeš število, ki **samo s seboj** pomnoženo da $36$: to je $6$.« -/
theorem koren36 : Real.sqrt 36 = 6 ∧ Real.sqrt 36 ≠ 36 / 2 := by
  have h : Real.sqrt 36 = 6 := (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)
  exact ⟨h, by rw [h]; norm_num⟩

/-- Pogoste napake in Preveri se 3: če se ploščina S ≥ 0 poveča 4-krat, se stranica poveča 2-krat:
√(4S) = 2√S.
trditev: MAT-OS-8/kvadratni-koren#stirikrat-ploscina
besedilo: »če se ploščina poveča $4$-krat, se stranica ne poveča $4$-krat, ampak $2$-krat.« -/
theorem stirikrat_ploscina (S : ℝ) (hS : 0 ≤ S) : Real.sqrt (4 * S) = 2 * Real.sqrt S := by
  rw [koren_produkta 4 S (by norm_num) hS,
    (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num : (0 : ℝ) < 2)).mpr (by norm_num)]

/-- Predpostavka `stirikrat_ploscina` se da izpolniti (S = 25). -/
example : (0 : ℝ) ≤ 25 := by norm_num

/-- Pogoste napake in Preveri se 4: √(36 + 64) = √100 = 10, ne 6 + 8 = 14 (14² = 196 ≠ 100).
trditev: MAT-OS-8/kvadratni-koren#koren-36-64
besedilo: »$\sqrt{36 + 64}$ ni $6 + 8$. Pravilo $\sqrt{a \cdot b} = \sqrt{a} \cdot \sqrt{b}$ velja za produkt, ne za vsoto. Najprej seštej: $\sqrt{100} = 10$.« -/
theorem koren_36_64 :
    Real.sqrt (36 + 64) = 10 ∧ Real.sqrt 36 + Real.sqrt 64 = 14 ∧ (14 : ℝ) ^ 2 = 196 ∧
      Real.sqrt (36 + 64) ≠ Real.sqrt 36 + Real.sqrt 64 := by
  have h1 : Real.sqrt (36 + 64) = 10 := (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)
  have h2 : Real.sqrt 36 = 6 := (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)
  have h3 : Real.sqrt 64 = 8 := (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)
  refine ⟨h1, by rw [h2, h3]; norm_num, by norm_num, by rw [h1, h2, h3]; norm_num⟩

/-- Pogoste napake: √48 = 2√12 še ni končni zapis, ker je 12 = 4 · 3; √48 = √(16 · 3) = 4√3, in pod korenom
ostane 3 brez popolnega kvadrata, večjega od 1.
trditev: MAT-OS-8/kvadratni-koren#koren48
besedilo: »$\sqrt{48} = 2\sqrt{12}$ še ni končni zapis, ker je $12 = 4 \cdot 3$. Takoj izlušči največji popolni kvadrat: $\sqrt{48} = \sqrt{16 \cdot 3} = 4\sqrt{3}$.« -/
theorem koren48 :
    Real.sqrt 48 = 2 * Real.sqrt 12 ∧ (12 : ℕ) = 4 * 3 ∧ Real.sqrt 48 = 4 * Real.sqrt 3 ∧
      ∀ k : ℕ, 1 < k ^ 2 → ¬ k ^ 2 ∣ 3 := by
  refine ⟨?_, by norm_num, ?_, ?_⟩
  · calc Real.sqrt 48 = Real.sqrt (4 * 12) := by norm_num
      _ = Real.sqrt 4 * Real.sqrt 12 := koren_produkta 4 12 (by norm_num) (by norm_num)
      _ = 2 * Real.sqrt 12 := by
          rw [(Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num : (0 : ℝ) < 2)).mpr (by norm_num)]
  · calc Real.sqrt 48 = Real.sqrt (16 * 3) := by norm_num
      _ = Real.sqrt 16 * Real.sqrt 3 := koren_produkta 16 3 (by norm_num) (by norm_num)
      _ = 4 * Real.sqrt 3 := by
          rw [(Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num : (0 : ℝ) < 4)).mpr (by norm_num)]
  · intro k hk h
    have := Nat.le_of_dvd (by norm_num) h
    have : k ≤ 1 := by nlinarith
    interval_cases k <;> omega

/-! ## Drugače -/

/-- Z analogijo: kvadriranje in korenjenje se razveljavita (√(7²) = 7, (√49)² = 49), tako kot odštevanje
razveljavi seštevanje ((x + a) − a = x).
trditev: MAT-OS-8/kvadratni-koren#tja-in-nazaj
besedilo: »Korenjenje je vožnja nazaj: iz $49$ se vrneš v $7$. Tako tudi odštevanje razveljavi seštevanje.« -/
theorem tja_in_nazaj (x a : ℝ) : Real.sqrt (7 ^ 2) = 7 ∧ Real.sqrt 49 ^ 2 = 49 ∧ x + a - a = x :=
  ⟨Real.sqrt_sq (by norm_num), Real.sq_sqrt (by norm_num), by ring⟩

/-- Z analogijo (više–niže): 7² = 49 < 50 (više), 8² = 64 > 50 (niže), 7,1² = 50,41 > 50 (niže).
trditev: MAT-OS-8/kvadratni-koren#vise-nize
besedilo: »Rečeš »$7$?« in odgovori: »Više, $7^2 = 49$ je premalo.« Rečeš »$8$?«: »Niže, $64$ je preveč.« Nato poskusiš $7{,}1$: »Niže, $50{,}41$ je preveč.«« -/
theorem vise_nize : (7 : ℝ) ^ 2 = 49 ∧ (49 : ℝ) < 50 ∧ (8 : ℝ) ^ 2 = 64 ∧ (50 : ℝ) < 64 ∧
    ((71 : ℝ) / 10) ^ 2 = 5041 / 100 ∧ (50 : ℝ) < 5041 / 100 := by norm_num

/-- Iz vsakdanjega življenja: terasa 64 m² ima stranico √64 = 8.
trditev: MAT-OS-8/kvadratni-koren#terasa
besedilo: »Iščeš $\sqrt{64} = 8\,\text{m}$.« -/
theorem terasa : Real.sqrt 64 = 8 := (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num)

/-- Iz vsakdanjega življenja (vrt 200 m²): 14² = 196 < 200 < 225 = 15², zato 14 < √200 < 15 in je obseg
4√200 več kot 4 · 14 = 56.
trditev: MAT-OS-8/kvadratni-koren#vrt
besedilo: »$14^2 = 196$ in $15^2 = 225$, zato je stranica malo čez $14\,\text{m}$. To zadošča, da veš, koliko ograje kupiti: obseg je nekaj več kot $4 \cdot 14 = 56\,\text{m}$.« -/
theorem vrt :
    (14 : ℝ) ^ 2 = 196 ∧ (15 : ℝ) ^ 2 = 225 ∧ (14 : ℝ) < Real.sqrt 200 ∧ Real.sqrt 200 < 15 ∧
      (4 : ℝ) * 14 = 56 ∧ (56 : ℝ) < 4 * Real.sqrt 200 := by
  have h : (14 : ℝ) < Real.sqrt 200 := (Real.lt_sqrt (by norm_num)).mpr (by norm_num)
  exact ⟨by norm_num, by norm_num, h, (Real.sqrt_lt' (by norm_num)).mpr (by norm_num), by norm_num,
    by linarith⟩

/-- Iz vsakdanjega življenja: ko se ploščina S ≥ 0 podvoji, se stranica poveča √2-krat (√(2S) = √2 · √S), in
√2 ≈ 1,4: 1,4² = 1,96 < 2 < 2,1025 = 1,45², zato 1,4 < √2 < 1,45.
trditev: MAT-OS-8/kvadratni-koren#podvojena-greda
besedilo: »Stranica se poveča le približno $1{,}4$-krat, ker je $1{,}4^2 = 1{,}96$, kar je skoraj $2$.« -/
theorem podvojena_greda (S : ℝ) (hS : 0 ≤ S) :
    Real.sqrt (2 * S) = Real.sqrt 2 * Real.sqrt S ∧ ((14 : ℝ) / 10) ^ 2 = 196 / 100 ∧
      (14 : ℝ) / 10 < Real.sqrt 2 ∧ Real.sqrt 2 < 145 / 100 :=
  ⟨koren_produkta 2 S (by norm_num) hS, by norm_num, (Real.lt_sqrt (by norm_num)).mpr (by norm_num),
    (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)⟩

/-- Predpostavka `podvojena_greda` se da izpolniti (S = 25). -/
example : (0 : ℝ) ≤ 25 := by norm_num

/-- Korak za korakom (√180), korak 1: prafaktorji 180 so 2, 2, 3, 3, 5 in 180 = 2² · 3² · 5.
trditev: MAT-OS-8/kvadratni-koren#razcep180
besedilo: »$180 = 2 \cdot 2 \cdot 3 \cdot 3 \cdot 5 = 2^2 \cdot 3^2 \cdot 5$« -/
theorem razcep180 : Nat.primeFactorsList 180 = [2, 2, 3, 3, 5] ∧ 180 = 2 ^ 2 * 3 ^ 2 * 5 := by
  constructor
  · simp
  · norm_num

/-- Korak za korakom: √180 = √(2² · 3² · 5) = 2 · 3 · √5 = 6√5; preizkus 6² · 5 = 36 · 5 = 180.
trditev: MAT-OS-8/kvadratni-koren#koren180
besedilo: »Rezultat: $\sqrt{180} = 6\sqrt{5}$. 6. Preveri: $6^2 \cdot 5 = 36 \cdot 5 = 180$.« -/
theorem koren180 : Real.sqrt 180 = 6 * Real.sqrt 5 ∧ (6 : ℝ) ^ 2 * 5 = 36 * 5 ∧ (36 : ℝ) * 5 = 180 := by
  refine ⟨?_, by norm_num, by norm_num⟩
  calc Real.sqrt 180 = Real.sqrt ((2 * 3) ^ 2 * 5) := by norm_num
    _ = Real.sqrt ((2 * 3) ^ 2) * Real.sqrt 5 := koren_produkta _ 5 (by norm_num) (by norm_num)
    _ = 2 * 3 * Real.sqrt 5 := by rw [Real.sqrt_sq (by norm_num)]
    _ = 6 * Real.sqrt 5 := by norm_num

/-- Korak za korakom: pod korenom ostane 5, ki nima popolnega kvadrata, večjega od 1, za faktor.
trditev: MAT-OS-8/kvadratni-koren#koren180-dokoncano
besedilo: »Faktor $5$ nima para. 4. Zmnoži, kar je prišlo ven: $2 \cdot 3 = 6$. Pod korenom ostane $5$.« -/
theorem koren180_dokoncano (k : ℕ) (hk : 1 < k ^ 2) : ¬ k ^ 2 ∣ 5 := by
  intro h
  have := Nat.le_of_dvd (by norm_num) h
  have : k ≤ 2 := by nlinarith
  interval_cases k <;> omega

/-- Predpostavka `koren180_dokoncano` se da izpolniti (k = 2). -/
example : 1 < (2 : ℕ) ^ 2 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1: 121 = 11 · 11, 169 = 13 · 13, 196 = 14 · 14 so popolni kvadrati, 128 pa ne
(11² = 121 < 128 < 144 = 12²).
trditev: MAT-OS-8/kvadratni-koren#kviz1
besedilo: »$11^2 = 121$ in $12^2 = 144$, zato $128$ leži med zaporednima kvadratoma in ni popoln kvadrat.« -/
theorem kviz1 :
    (121 : ℕ) = 11 * 11 ∧ (169 : ℕ) = 13 * 13 ∧ (196 : ℕ) = 14 * 14 ∧ 11 ^ 2 < 128 ∧ 128 < 12 ^ 2 ∧
      ¬ ∃ n : ℕ, n * n = 128 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  rintro ⟨n, hn⟩
  have : n ≤ 12 := by nlinarith
  interval_cases n <;> omega

/-- Preveri se 1 (hiter znak): kvadrat naravnega števila se nikoli ne konča na 8.
trditev: MAT-OS-8/kvadratni-koren#kvadrat-ni-8
besedilo: »Hiter znak: popolni kvadrat se nikoli ne konča na $8$.« -/
theorem kvadrat_ni_8 (n : ℕ) : n ^ 2 % 10 ≠ 8 := by
  rw [Nat.pow_mod]
  have : n % 10 < 10 := Nat.mod_lt n (by norm_num)
  interval_cases n % 10 <;> norm_num

/-- Preveri se 2, napačni odgovori: 0,49 : 2 = 0,245 in 7² = 49, ne 0,49.
trditev: MAT-OS-8/kvadratni-koren#kviz2
besedilo: »$7^2 = 49$, ne $0{,}49$« -/
theorem kviz2 : (49 : ℝ) / 100 / 2 = 245 / 1000 ∧ (7 : ℝ) ^ 2 ≠ 49 / 100 := by norm_num

/-- Preveri se 3: √25 = 5, √100 = 10, √4 = 2 (stranica se poveča 2-krat); razlika ploščin je 100 − 25 = 75,
stranica pa zraste s 5 na 10; 4² = 16.
trditev: MAT-OS-8/kvadratni-koren#kviz3
besedilo: »$\sqrt{25} = 5$ in $\sqrt{100} = 10$. Stranica se poveča $\sqrt{4} = 2$-krat.« -/
theorem kviz3 :
    Real.sqrt 25 = 5 ∧ Real.sqrt 100 = 10 ∧ Real.sqrt 4 = 2 ∧ (10 : ℝ) = 2 * 5 ∧ (100 : ℝ) - 25 = 75 ∧
      (4 : ℝ) ^ 2 = 16 :=
  ⟨(Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num),
    (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num),
    (Real.sqrt_eq_iff_mul_self_eq_of_pos (by norm_num)).mpr (by norm_num), by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 5 (parcela 90 m²): 9² = 81 < 90 < 100 = 10², zato 9 < √90 < 10 (ne 8–9, ne 22–23, ne 45–46;
90 : 4 = 22,5, 90 : 2 = 45); »približno 9,5«: 9,45² = 89,3025 < 90 < 90,25 = 9,5², zato 9,45 < √90 < 9,5.
trditev: MAT-OS-8/kvadratni-koren#kviz5
besedilo: »$9^2 = 81 < 90 < 100 = 10^2$, zato je stranica med $9\,\text{m}$ in $10\,\text{m}$ (približno $9{,}5\,\text{m}$).« -/
theorem kviz5 :
    (9 : ℝ) ^ 2 = 81 ∧ (10 : ℝ) ^ 2 = 100 ∧ (9 : ℝ) < Real.sqrt 90 ∧ Real.sqrt 90 < 10 ∧
      (90 : ℝ) / 4 = 225 / 10 ∧ (90 : ℝ) / 2 = 45 ∧
      (945 : ℝ) / 100 < Real.sqrt 90 ∧ Real.sqrt 90 < 95 / 10 :=
  ⟨by norm_num, by norm_num, (Real.lt_sqrt (by norm_num)).mpr (by norm_num),
    (Real.sqrt_lt' (by norm_num)).mpr (by norm_num), by norm_num, by norm_num,
    (Real.lt_sqrt (by norm_num)).mpr (by norm_num), (Real.sqrt_lt' (by norm_num)).mpr (by norm_num)⟩

end Evklid.Lekcije.MAT_OS_8.KvadratniKoren
