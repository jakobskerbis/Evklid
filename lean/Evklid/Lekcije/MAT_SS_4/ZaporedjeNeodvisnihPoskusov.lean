/-
vir: content/lessons/MAT-SS-4/zaporedje-neodvisnih-poskusov.md
sha256: 841c5450604e429da2262d68a720d48dbe163bcdef214e772bc1484f49c4a7e2
Ni v Leanu: stolpčni risbi (dokazane so prikazane vrednosti), simulacija »Ponavljanje neodvisnih poskusov«
(dokazano je le 16·3/8 = 6), pogoji za zaporedje neodvisnih poskusov in primeri, ki to niso (vlečenje brez
vračanja, »Preveri se 1«; opis modela, ne trditev), analogija z mešalno mizo (dokazano je C(5,4) = 5), vrstni red
korakov v »Razvrsti korake« (postopek), stavek »več o tem pri študiju statistike«. Približek
ln 0,05 / ln 0,7 ≈ 8,40 je dokazan kot meja 8,395 < … < 8,405. Neodvisnost je modelirana z verjetnostjo poteka p^k·q^(n−k) (produkt po poskusih); dokazano
je, da vsota po vseh potekih s k uspehi da Bernoullijevo formulo.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_SS_4.ZaporedjeNeodvisnihPoskusov

open Finset Filter

/-- Bernoullijeva formula: P_n(k) = C(n,k)·p^k·q^(n−k), q = 1 − p. -/
noncomputable def Pn (n k : ℕ) (p : ℝ) : ℝ := (Nat.choose n k : ℝ) * p ^ k * (1 - p) ^ (n - k)

/-! ## Razlaga 1 in 2 -/

/-- Razlaga 1: poteki ZZN, ZNZ, NZZ imajo verjetnost 0,8·0,8·0,2 = 0,8·0,2·0,8 = 0,2·0,8·0,8 = 0,128,
skupaj 3·0,128 = 0,384 = P₃(2).
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#razlaga1
besedilo: »| $ZZN$ | $0{,}8 \cdot 0{,}8 \cdot 0{,}2 = 0{,}128$ |« -/
theorem razlaga1 :
    (0.8 : ℝ) * 0.8 * 0.2 = 0.128 ∧ (0.8 : ℝ) * 0.2 * 0.8 = 0.128 ∧ (0.2 : ℝ) * 0.8 * 0.8 = 0.128 ∧
    (3 : ℝ) * 0.128 = 0.384 ∧ Pn 3 2 0.8 = 0.384 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, ?_⟩
  unfold Pn; rw [show Nat.choose 3 2 = 3 by decide]; norm_num

/-- Razlaga 2 in Ustno vprašanje 2 (izpeljava): potek je množica s uspešnih poskusov med n; potek ima
verjetnost (∏ p po s)·(∏ q po ostalih) = p^k·q^(n−k), potekov s k uspehi je C(n,k), vsota je C(n,k)·p^k·q^(n−k).
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#vsota-potekov
besedilo: »vsak potek s $k$ uspehi ima verjetnost $p^k q^{n-k}$,« -/
theorem vsota_potekov {R : Type*} [CommSemiring R] (n k : ℕ) (p q : R) :
    ∑ s ∈ (univ : Finset (Fin n)).powersetCard k, (∏ _i ∈ s, p) * ∏ _i ∈ univ \ s, q =
      (Nat.choose n k : R) * p ^ k * q ^ (n - k) := by
  calc ∑ s ∈ (univ : Finset (Fin n)).powersetCard k, (∏ _i ∈ s, p) * ∏ _i ∈ univ \ s, q
      = ∑ _s ∈ (univ : Finset (Fin n)).powersetCard k, p ^ k * q ^ (n - k) := by
        refine sum_congr rfl fun s hs => ?_
        rw [mem_powersetCard] at hs
        rw [prod_const, prod_const, card_univ_sdiff, Fintype.card_fin, hs.2]
    _ = (Nat.choose n k : R) * p ^ k * q ^ (n - k) := by
        rw [sum_const, card_powersetCard, card_univ, Fintype.card_fin, nsmul_eq_mul]; ring

/-- Bolj natančno: (p + q)ⁿ je vsota verjetnosti vseh potekov (vsak potek je produkt n neodvisnih faktorjev).
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#vsi-poteki
besedilo: »Dogodek $X = k$ je vsota $\binom{n}{k}$ nezdružljivih potekov; vsak potek je produkt $n$ neodvisnih dogodkov, $k$ z verjetnostjo $p$ in $n - k$ z verjetnostjo $q$.« -/
theorem vsi_poteki {R : Type*} [CommSemiring R] (n : ℕ) (p q : R) :
    (p + q) ^ n = ∑ s ∈ (univ : Finset (Fin n)).powerset, (∏ _i ∈ s, p) * ∏ _i ∈ univ \ s, q := by
  rw [← prod_add, prod_const, card_univ, Fintype.card_fin]

/-- Razlaga 2: `C(3,2) = 3`.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#trije-poteki
besedilo: »$\binom{3}{2} = 3$« -/
theorem trije_poteki : Nat.choose 3 2 = 3 := by decide

/-! ## Razlaga 4: vse verjetnosti skupaj -/

/-- Razlaga 4 (risba): za n = 3, p = 0,8: P₃(0) = 0,008, P₃(1) = 0,096, P₃(2) = 0,384, P₃(3) = 0,512
(0,8 %, 9,6 %, 38,4 %, 51,2 %), vsota 1.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#razlaga4
besedilo: »Vsota je $0{,}008 + 0{,}096 + 0{,}384 + 0{,}512 = 1$. To ni naključje. Členi $q^3$, $3pq^2$, $3p^2q$, $p^3$ so natanko členi razvoja $(q+p)^3$ po binomskem izreku. Zato za vsak $n$ velja« -/
theorem razlaga4 :
    Pn 3 0 0.8 = 0.008 ∧ Pn 3 1 0.8 = 0.096 ∧ Pn 3 2 0.8 = 0.384 ∧ Pn 3 3 0.8 = 0.512 ∧
    (0.008 : ℝ) + 0.096 + 0.384 + 0.512 = 1 ∧
    (0.2 : ℝ) ^ 3 + 3 * 0.8 * 0.2 ^ 2 + 3 * 0.8 ^ 2 * 0.2 + 0.8 ^ 3 = 1 := by
  unfold Pn
  rw [show Nat.choose 3 0 = 1 by decide, show Nat.choose 3 1 = 3 by decide, show Nat.choose 3 2 = 3 by decide,
    show Nat.choose 3 3 = 1 by decide]
  norm_num

/-- Razlaga 4: q³, 3pq², 3p²q, p³ so členi razvoja (q+p)³.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#razvoj-tretja
besedilo: »Členi $q^3$, $3pq^2$, $3p^2q$, $p^3$ so natanko členi razvoja $(q+p)^3$ po binomskem izreku.« -/
theorem razvoj_tretja {R : Type*} [CommRing R] (p q : R) :
    (q + p) ^ 3 = q ^ 3 + 3 * p * q ^ 2 + 3 * p ^ 2 * q + p ^ 3 := by ring

/-- Razlaga 4, Povzetek, Ustno vprašanje 3, Bolj natančno: P_n(0) + … + P_n(n) = (q+p)ⁿ = 1ⁿ = 1.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#vsota-ena
besedilo: »$$P_n(0) + P_n(1) + \dots + P_n(n) = (q+p)^n = 1^n = 1$$« -/
theorem vsota_ena (n : ℕ) (p : ℝ) : ∑ k ∈ range (n + 1), Pn n k p = 1 := by
  have h := add_pow p (1 - p) n
  rw [add_sub_cancel, one_pow] at h
  rw [h]
  refine sum_congr rfl fun k _ => ?_
  unfold Pn; ring

/-- Razlaga 4 (simulacija): met kovanca, P₃(2) = C(3,2)·0,5²·0,5 = 3/8; v 16 serijah pričakujemo 16·3/8 = 6.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#kovanec
besedilo: »Serijo ponovi vsaj $16$-krat in si zapisuj, kolikokrat padeta natanko dva grba: pričakuješ približno $6$ takih serij, torej $3$ od $8$, kot napove $P_3(2) = \binom{3}{2} \cdot 0{,}5^2 \cdot 0{,}5 = \frac{3}{8}$.« -/
theorem kovanec : Pn 3 2 0.5 = 3 / 8 ∧ (16 : ℝ) * (3 / 8) = 6 := by
  unfold Pn; rw [show Nat.choose 3 2 = 3 by decide]; norm_num

/-! ## Razlaga 5: »vsaj« in »največ« -/

/-- Razlaga 5: P(vsaj en uspeh) = 1 − P_n(0) = 1 − qⁿ.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#vsaj-en
besedilo: »$$P(\text{vsaj en uspeh}) = 1 - P_n(0) = 1 - q^n$$« -/
theorem vsaj_en (n : ℕ) (p : ℝ) : 1 - Pn n 0 p = 1 - (1 - p) ^ n := by simp [Pn]

/-- Razlaga 5: nasprotni dogodek dogodka »vsaj 2« je »največ 1«: P(k ≥ 2) = 1 − P_n(0) − P_n(1).
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#vsaj-dva
besedilo: »Podobno je nasprotni dogodek dogodka »vsaj $2$« dogodek »največ $1$«, torej $k = 0$ ali $k = 1$.« -/
theorem vsaj_dva (n : ℕ) (hn : 1 ≤ n) (p : ℝ) :
    ∑ k ∈ Ico 2 (n + 1), Pn n k p = 1 - Pn n 0 p - Pn n 1 p := by
  have h := vsota_ena n p
  rw [range_eq_Ico, ← sum_Ico_consecutive _ (Nat.zero_le 1) (by omega : 1 ≤ n + 1),
    ← sum_Ico_consecutive _ (by norm_num : 1 ≤ 2) (by omega : 2 ≤ n + 1)] at h
  simp only [Nat.Ico_succ_singleton, sum_singleton] at h
  linarith

/-- Predpostavka trditve `vsaj_dva` se da izpolniti. -/
example : 1 ≤ 4 := by norm_num

/-- Predpostavke trditve `vsaj_dva` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : 1 ≤ 4 := by norm_num
  vsaj_dva (hn := w)

/-- Razlaga 5, »Premisli«: pri 0 ≤ q < 1 gre 1 − qⁿ proti 1, ko n raste.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#vsaj-en-limita
besedilo: »Raste proti $1$. Ker je $0 < q < 1$, postaja $q^n$ vse manjši, $1 - q^n$ pa se približuje $1$. Z dovolj poskusi skoraj gotovo vsaj enkrat uspeš.« -/
theorem vsaj_en_limita (q : ℝ) (h0 : 0 ≤ q) (h1 : q < 1) :
    Tendsto (fun n : ℕ => 1 - q ^ n) atTop (nhds 1) := by
  simpa using (tendsto_const_nhds (x := (1 : ℝ))).sub (tendsto_pow_atTop_nhds_zero_of_lt_one h0 h1)

/-- Predpostavke trditve `vsaj_en_limita` se dajo izpolniti. -/
example : (0 : ℝ) ≤ 0.7 ∧ (0.7 : ℝ) < 1 := by norm_num

/-! ## Rešeni primeri -/

/-- Predpostavke trditve `vsaj_en_limita` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : (0 : ℝ) ≤ 0.7 ∧ (0.7 : ℝ) < 1 := by norm_num
  vsaj_en_limita (h0 := w.1) (h1 := w.2)

/-- Primer 1: en potek ZZZN ima 0,9³·0,1 = 0,0729, `C(4,3) = 4`, P₄(3) = 4·0,0729 = 0,2916 ≈ 0,29.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#primer1
besedilo: »En potek, na primer $ZZZN$, ima verjetnost $0{,}9^3 \cdot 0{,}1 = 0{,}0729$.« -/
theorem primer1 :
    (0.9 : ℝ) ^ 3 * 0.1 = 0.0729 ∧ Nat.choose 4 3 = 4 ∧ |(0.2916 : ℝ) - 0.29| < 0.005 ∧
    Pn 4 3 0.9 = 0.2916 := by
  refine ⟨by norm_num, by decide, by norm_num [abs_lt], ?_⟩
  calc Pn 4 3 0.9 = 4 * ((0.9 : ℝ) ^ 3 * 0.1) := by
        unfold Pn; rw [show Nat.choose 4 3 = 4 by decide]; norm_num
    _ = 4 * 0.0729 := by norm_num
    _ = 0.2916 := by norm_num

/-- Primer 2: P₆(0) = (5/6)⁶ ≈ 0,3349, 1 − 0,3349 = 0,6651, P₆(1) = 6·(1/6)·(5/6)⁵ ≈ 0,4019,
0,3349 + 0,4019 = 0,7368; točni vrednosti 1 − P₆(0) ≈ 0,665 in P₆(0) + P₆(1) ≈ 0,737.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#primer2
besedilo: »»Največ en« pomeni $0$ ali $1$: $0{,}3349 + 0{,}4019 = 0{,}7368$.« -/
theorem primer2 :
    Pn 6 0 (1 / 6) = (5 / 6) ^ 6 ∧ 0.33485 ≤ ((5 : ℝ) / 6) ^ 6 ∧ ((5 : ℝ) / 6) ^ 6 < 0.33495 ∧
    (1 : ℝ) - 0.3349 = 0.6651 ∧
    Pn 6 1 (1 / 6) = 6 * (1 / 6) * (5 / 6) ^ 5 ∧
    0.40185 ≤ (6 : ℝ) * (1 / 6) * (5 / 6) ^ 5 ∧ (6 : ℝ) * (1 / 6) * (5 / 6) ^ 5 < 0.40195 ∧
    (0.3349 : ℝ) + 0.4019 = 0.7368 ∧
    0.6645 ≤ 1 - Pn 6 0 (1 / 6) ∧ 1 - Pn 6 0 (1 / 6) < 0.6655 ∧
    0.7365 ≤ Pn 6 0 (1 / 6) + Pn 6 1 (1 / 6) ∧ Pn 6 0 (1 / 6) + Pn 6 1 (1 / 6) < 0.7375 := by
  have h0 : Pn 6 0 (1 / 6) = (5 / 6) ^ 6 := by unfold Pn; norm_num
  have h1 : Pn 6 1 (1 / 6) = 6 * (1 / 6) * (5 / 6) ^ 5 := by
    unfold Pn; rw [show Nat.choose 6 1 = 6 by decide]; norm_num
  rw [h0, h1]
  norm_num

/-- Pogoste napake: »vsaj en« ni n·p: 6·(1/6) = 1 bi bila gotovost, pri 10 ugibanjih 10/6 > 1.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#napaka-np
besedilo: »»Vsaj en« kot $n \cdot p$.** Pri $6$ ugibanjih s $p = \frac{1}{6}$ bi to dalo $1$, torej gotovost, kar ni res. Pri $10$ ugibanjih bi verjetnost presegla $1$. Pravilno: $1 - q^n$.« -/
theorem napaka_np : (6 : ℝ) * (1 / 6) = 1 ∧ (1 : ℝ) < 10 * (1 / 6) ∧ 1 - Pn 6 0 (1 / 6) < 1 := by
  refine ⟨by norm_num, by norm_num, ?_⟩
  unfold Pn; norm_num

/-- Primer 3, korak 2: 1 − 0,7ⁿ ≥ 0,95 ⇔ 0,7ⁿ ≤ 0,05.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#primer3-korak2
besedilo: »Pogoj $1 - 0{,}7^n \ge 0{,}95$ preoblikujemo v $0{,}7^n \le 0{,}05$.« -/
theorem primer3_korak2 (x : ℝ) : 1 - x ≥ 0.95 ↔ x ≤ 0.05 := by
  constructor <;> intro h <;> norm_num at * <;> linarith

/-- Primer 3, korak 3: ln 0,7 < 0, zato se pri deljenju znak obrne: 0,7ˣ ≤ 0,05 ⇔ x ≥ ln 0,05 / ln 0,7 (realni x).
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#primer3-logaritem
besedilo: »Ker je $\ln 0{,}7 < 0$, se znak neenakosti obrne: $n \ge \frac{\ln 0{,}05}{\ln 0{,}7} \approx 8{,}40$.« -/
theorem primer3_logaritem (x : ℝ) :
    Real.log 0.7 < 0 ∧ ((0.7 : ℝ) ^ x ≤ 0.05 ↔ Real.log 0.05 / Real.log 0.7 ≤ x) := by
  have hl : Real.log 0.7 < 0 := Real.log_neg (by norm_num) (by norm_num)
  refine ⟨hl, ?_⟩
  rw [← Real.log_le_log_iff (Real.rpow_pos_of_pos (by norm_num) x) (by norm_num), Real.log_rpow (by norm_num),
    div_le_iff_of_neg hl]

set_option exponentiation.threshold 2000 in
/-- Primer 3, korak 3: ln 0,05 / ln 0,7 ≈ 8,40, dokazano kot 8,395 < ln 0,05 / ln 0,7 < 8,405
(primerjava potenc 0,05²⁰⁰ s 0,7¹⁶⁷⁹ in 0,7¹⁶⁸¹).
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#primer3-priblizek
besedilo: »Ker je $\ln 0{,}7 < 0$, se znak neenakosti obrne: $n \ge \frac{\ln 0{,}05}{\ln 0{,}7} \approx 8{,}40$.« -/
theorem primer3_priblizek :
    8.395 < Real.log 0.05 / Real.log 0.7 ∧ Real.log 0.05 / Real.log 0.7 < 8.405 := by
  have hl : Real.log 0.7 < 0 := Real.log_neg (by norm_num) (by norm_num)
  refine ⟨?_, ?_⟩
  · rw [lt_div_iff_of_neg hl]
    have : (200 : ℝ) * Real.log 0.05 < 1679 * Real.log 0.7 := by
      have e1 := Real.log_pow (0.05 : ℝ) 200
      have e2 := Real.log_pow (0.7 : ℝ) 1679
      push_cast at e1 e2
      rw [← e1, ← e2]
      exact Real.log_lt_log (by positivity) (by norm_num)
    linarith
  · rw [div_lt_iff_of_neg hl]
    have : (1681 : ℝ) * Real.log 0.7 < 200 * Real.log 0.05 := by
      have e1 := Real.log_pow (0.7 : ℝ) 1681
      have e2 := Real.log_pow (0.05 : ℝ) 200
      push_cast at e1 e2
      rw [← e1, ← e2]
      exact Real.log_lt_log (by positivity) (by norm_num)
    linarith

/-- Primer 3, korak 4: 1 − 0,7⁸ ≈ 0,942 < 0,95 in 1 − 0,7⁹ ≈ 0,960 ≥ 0,95.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#primer3-preizkus
besedilo: »Preizkus: pri $n = 8$ je $1 - 0{,}7^8 \approx 0{,}942$, premalo; pri $n = 9$ je $1 - 0{,}7^9 \approx 0{,}960$.« -/
theorem primer3_preizkus :
    0.9415 ≤ (1 : ℝ) - 0.7 ^ 8 ∧ (1 : ℝ) - 0.7 ^ 8 < 0.9425 ∧ (1 : ℝ) - 0.7 ^ 8 < 0.95 ∧
    0.9595 ≤ (1 : ℝ) - 0.7 ^ 9 ∧ (1 : ℝ) - 0.7 ^ 9 < 0.9605 ∧ (0.95 : ℝ) ≤ 1 - 0.7 ^ 9 := by norm_num

/-- Primer 3, odgovor: za naravni n velja 1 − 0,7ⁿ ≥ 0,95 natanko tedaj, ko n ≥ 9 (najmanj 9 posnetkov).
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#primer3
besedilo: »$1 - 0{,}7^n \ge 0{,}95$« -/
theorem primer3 (n : ℕ) : 1 - (0.7 : ℝ) ^ n ≥ 0.95 ↔ 9 ≤ n := by
  rw [primer3_korak2]
  constructor
  · intro h
    by_contra h'
    have hle : (0.7 : ℝ) ^ 8 ≤ 0.7 ^ n := pow_le_pow_of_le_one (by norm_num) (by norm_num) (by omega)
    norm_num at hle h
    linarith
  · intro h
    have hle : (0.7 : ℝ) ^ n ≤ 0.7 ^ 9 := pow_le_pow_of_le_one (by norm_num) (by norm_num) h
    norm_num at hle ⊢
    linarith

/-- Primer 4: P₅(4) = 5·0,8⁴·0,2 = 0,4096, P₅(5) = 0,8⁵ = 0,32768, vsota 0,73728 ≈ 0,74 < 0,8.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#primer4
besedilo: »$P_5(5) = 0{,}8^5 = 0{,}32768$, skupaj $0{,}4096 + 0{,}32768 = 0{,}73728$. Sprejmejo jo z verjetnostjo približno $0{,}74$, kar je opazno manj od $0{,}8$.« -/
theorem primer4 :
    Pn 5 4 0.8 = 5 * 0.8 ^ 4 * 0.2 ∧ (5 : ℝ) * 0.8 ^ 4 * 0.2 = 0.4096 ∧
    Pn 5 5 0.8 = 0.8 ^ 5 ∧ (0.8 : ℝ) ^ 5 = 0.32768 ∧ (0.4096 : ℝ) + 0.32768 = 0.73728 ∧
    |(0.73728 : ℝ) - 0.74| < 0.005 ∧ (0.73728 : ℝ) < 0.8 := by
  refine ⟨?_, by norm_num, ?_, by norm_num, by norm_num, by norm_num [abs_lt], by norm_num⟩
  · unfold Pn; rw [show Nat.choose 5 4 = 5 by decide]; norm_num
  · unfold Pn; norm_num

/-- Bolj natančno: n·p = 5·0,8 = 4 in P₅(4) = 0,4096 je največja od P₅(0), …, P₅(5).
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#najbolj-verjetna
besedilo: »Najbolj verjetna vrednost leži blizu $n \cdot p$: pri Maji je $5 \cdot 0{,}8 = 4$ in res je $P_5(4) = 0{,}4096$ največja od vseh verjetnosti $P_5(k)$.« -/
theorem najbolj_verjetna : (5 : ℝ) * 0.8 = 4 ∧ ∀ k ≤ 5, Pn 5 k 0.8 ≤ Pn 5 4 0.8 := by
  refine ⟨by norm_num, fun k hk => ?_⟩
  have h4 : Pn 5 4 0.8 = 0.4096 := by unfold Pn; rw [show Nat.choose 5 4 = 5 by decide]; norm_num
  rw [h4]
  interval_cases k <;> unfold Pn
  · norm_num
  · rw [show Nat.choose 5 1 = 5 by decide]; norm_num
  · rw [show Nat.choose 5 2 = 10 by decide]; norm_num
  · rw [show Nat.choose 5 3 = 10 by decide]; norm_num
  · rw [show Nat.choose 5 4 = 5 by decide]; norm_num
  · norm_num

/-! ## Za maturo -/

/-- Naloga 1: n = 4, p = 2/3, q = 1/3; b) P₄(2) = 6·4/9·1/9 = 24/81 = 8/27; c) P₄(0) = (1/3)⁴ = 1/81,
1 − 1/81 = 80/81; d) P₄(3) = 4·8/27·1/3 = 32/81, P₄(4) = (2/3)⁴ = 16/81, vsota 48/81 = 16/27.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#naloga1
besedilo: »b) $P_4(2) = \binom{4}{2}\left(\frac{2}{3}\right)^2\left(\frac{1}{3}\right)^2 = 6 \cdot \frac{4}{9} \cdot \frac{1}{9} = \frac{24}{81} = \frac{8}{27}$.« -/
theorem naloga1 :
    (1 : ℝ) - 2 / 3 = 1 / 3 ∧
    Pn 4 2 (2 / 3) = 6 * (4 / 9) * (1 / 9) ∧ (6 : ℝ) * (4 / 9) * (1 / 9) = 24 / 81 ∧ (24 : ℝ) / 81 = 8 / 27 ∧
    Pn 4 0 (2 / 3) = (1 / 3) ^ 4 ∧ ((1 : ℝ) / 3) ^ 4 = 1 / 81 ∧ (1 : ℝ) - 1 / 81 = 80 / 81 ∧
    Pn 4 3 (2 / 3) = 4 * (8 / 27) * (1 / 3) ∧ (4 : ℝ) * (8 / 27) * (1 / 3) = 32 / 81 ∧
    Pn 4 4 (2 / 3) = (2 / 3) ^ 4 ∧ ((2 : ℝ) / 3) ^ 4 = 16 / 81 ∧
    (32 : ℝ) / 81 + 16 / 81 = 48 / 81 ∧ (48 : ℝ) / 81 = 16 / 27 := by
  refine ⟨by norm_num, ?_, by norm_num, by norm_num, ?_, by norm_num, by norm_num, ?_, by norm_num, ?_,
    by norm_num, by norm_num, by norm_num⟩
  · unfold Pn; rw [show Nat.choose 4 2 = 6 by decide]; norm_num
  · unfold Pn; norm_num
  · unfold Pn; rw [show Nat.choose 4 3 = 4 by decide]; norm_num
  · unfold Pn; norm_num

/-- Naloga 2 a): P₂₀(0) = 0,96²⁰ = 0,442002… ≈ 0,4420.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#naloga2-a
besedilo: »a) Gre za zaporedje neodvisnih poskusov z $n = 20$; $p = 0{,}04$; $q = 0{,}96$. $P_{20}(0) = 0{,}96^{20} = 0{,}442002\ldots \approx 0{,}4420$.« -/
theorem naloga2_a : Pn 20 0 0.04 = 0.96 ^ 20 ∧ 0.442002 ≤ (0.96 : ℝ) ^ 20 ∧ (0.96 : ℝ) ^ 20 < 0.442003 := by
  refine ⟨by unfold Pn; norm_num, by norm_num, by norm_num⟩

/-- Naloga 2 b): P₂₀(2) = `C(20,2)`·0,04²·0,96¹⁸ = 190·0,0016·0,479603… = 0,145799… ≈ 0,1458.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#naloga2-b
besedilo: »$P_{20}(2) = \binom{20}{2} \cdot 0{,}04^2 \cdot 0{,}96^{18} = 190 \cdot 0{,}0016 \cdot 0{,}479603\ldots = 0{,}145799\ldots \approx 0{,}1458$« -/
theorem naloga2_b :
    Nat.choose 20 2 = 190 ∧ (0.04 : ℝ) ^ 2 = 0.0016 ∧
    0.479603 ≤ (0.96 : ℝ) ^ 18 ∧ (0.96 : ℝ) ^ 18 < 0.479604 ∧
    Pn 20 2 0.04 = 190 * 0.0016 * 0.96 ^ 18 ∧
    0.145799 ≤ (190 : ℝ) * 0.0016 * 0.96 ^ 18 ∧ (190 : ℝ) * 0.0016 * 0.96 ^ 18 < 0.1458 := by
  refine ⟨by decide, by norm_num, by norm_num, by norm_num, ?_, by norm_num, by norm_num⟩
  unfold Pn; rw [show Nat.choose 20 2 = 190 by decide]; norm_num

/-- Naloga 2 c): P₂₀(1) = 20·0,04·0,96¹⁹ = 0,368335…; P = 1 − P₂₀(0) − P₂₀(1) = 0,189662… ≈ 0,1897.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#naloga2-c
besedilo: »$P_{20}(1) = 20 \cdot 0{,}04 \cdot 0{,}96^{19} = 0{,}368335\ldots$« -/
theorem naloga2_c :
    Pn 20 1 0.04 = 20 * 0.04 * 0.96 ^ 19 ∧
    0.368335 ≤ (20 : ℝ) * 0.04 * 0.96 ^ 19 ∧ (20 : ℝ) * 0.04 * 0.96 ^ 19 < 0.368336 ∧
    0.189662 ≤ 1 - Pn 20 0 0.04 - Pn 20 1 0.04 ∧ 1 - Pn 20 0 0.04 - Pn 20 1 0.04 < 0.189663 := by
  have h1 : Pn 20 1 0.04 = 20 * 0.04 * 0.96 ^ 19 := by
    unfold Pn; rw [show Nat.choose 20 1 = 20 by decide]; norm_num
  have h0 : Pn 20 0 0.04 = 0.96 ^ 20 := by unfold Pn; norm_num
  rw [h0, h1]
  norm_num

/-- Naloga 2 d): škatla ni vrnjena z verjetnostjo 1 − 0,189662… = 0,810337…, pet škatel (0,810337…)⁵ =
0,349406… ≈ 0,3494; z zaokroženo 0,8103 dobimo 0,8103⁵ ≈ 0,3493.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#naloga2-d
besedilo: »zato so neodvisni tudi dogodki »škatla ni vrnjena« za različne škatle in je $P = (0{,}810337\ldots)^5 = 0{,}349406\ldots \approx 0{,}3494$.« -/
theorem naloga2_d :
    0.810337 ≤ (0.96 : ℝ) ^ 20 + 20 * 0.04 * 0.96 ^ 19 ∧ (0.96 : ℝ) ^ 20 + 20 * 0.04 * 0.96 ^ 19 < 0.810338 ∧
    0.349406 ≤ ((0.96 : ℝ) ^ 20 + 20 * 0.04 * 0.96 ^ 19) ^ 5 ∧
    ((0.96 : ℝ) ^ 20 + 20 * 0.04 * 0.96 ^ 19) ^ 5 < 0.349407 ∧
    0.34925 ≤ (0.8103 : ℝ) ^ 5 ∧ (0.8103 : ℝ) ^ 5 < 0.34935 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 2: q⁵ = 0,03 ⇒ q¹⁰ = (q⁵)² = 0,03² = 0,0009 (ne 0,06, ne 0,015).
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#kviz2
besedilo: »$q^5 = 0{,}03$, zato $q^{10} = (q^5)^2 = 0{,}03^2 = 0{,}0009$.« -/
theorem kviz2 (q : ℝ) (h : q ^ 5 = 0.03) : q ^ 10 = 0.0009 := by
  calc q ^ 10 = (q ^ 5) ^ 2 := by ring
    _ = 0.03 ^ 2 := by rw [h]
    _ = 0.0009 := by norm_num

/-- Predpostavka trditve `kviz2` se da izpolniti (q = 0,03^(1/5)). -/
example : ∃ q : ℝ, q ^ 5 = 0.03 :=
  ⟨(0.03 : ℝ) ^ ((1 : ℝ) / 5), by
    rw [← Real.rpow_natCast, ← Real.rpow_mul (by norm_num)]; norm_num⟩

/-- Predpostavke trditve `kviz2` se dajo izpolniti: izrek, uporabljen na primeru. -/
example :=
  have w : ∃ q : ℝ, q ^ 5 = 0.03 :=
    ⟨(0.03 : ℝ) ^ ((1 : ℝ) / 5), by
      rw [← Real.rpow_natCast, ← Real.rpow_mul (by norm_num)]; norm_num⟩
  kviz2 (h := w.choose_spec)

/-- Preveri se 3: Rokova napaka je korak (3): 0,7⁴ = 0,2401, 0,3·0,7³ = 0,1029 (en potek), 1 − 0,2401 − 0,1029 =
0,657; pravilno P₄(1) = 4·0,1029 = 0,4116 in 1 − 0,2401 − 0,4116 = 0,3483.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#kviz3
besedilo: »$P_4(1) = 4 \cdot 0{,}1029 = 0{,}4116$ in pravilni rezultat je $1 - 0{,}2401 - 0{,}4116 = 0{,}3483$.« -/
theorem kviz3 :
    Pn 4 0 0.3 = 0.7 ^ 4 ∧ (0.7 : ℝ) ^ 4 = 0.2401 ∧ (0.3 : ℝ) * 0.7 ^ 3 = 0.1029 ∧
    (1 : ℝ) - 0.2401 - 0.1029 = 0.657 ∧ Pn 4 1 0.3 = 4 * 0.1029 ∧ (4 : ℝ) * 0.1029 = 0.4116 ∧
    (1 : ℝ) - 0.2401 - 0.4116 = 0.3483 ∧ 1 - Pn 4 0 0.3 - Pn 4 1 0.3 = 0.3483 := by
  have h0 : Pn 4 0 0.3 = 0.7 ^ 4 := by unfold Pn; norm_num
  have h1 : Pn 4 1 0.3 = 4 * 0.1029 := by unfold Pn; rw [show Nat.choose 4 1 = 4 by decide]; norm_num
  refine ⟨h0, by norm_num, by norm_num, by norm_num, h1, by norm_num, by norm_num, ?_⟩
  rw [h0, h1]; norm_num

/-- Preveri se 5 (risba): p = 0,5: P₄(k) = 6,25 %, 25 %, 37,5 %, 25 %, 6,25 %; vsaj 3: 0,25 + 0,0625 = 0,3125
(napačno: 0,25, 0,6875 = »vsaj 2«, 0,0625).
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#kviz5
besedilo: »»Vsaj $3$« sta stolpca $k = 3$ in $k = 4$: $0{,}25 + 0{,}0625 = 0{,}3125$.« -/
theorem kviz5 :
    Pn 4 0 0.5 = 0.0625 ∧ Pn 4 1 0.5 = 0.25 ∧ Pn 4 2 0.5 = 0.375 ∧ Pn 4 3 0.5 = 0.25 ∧
    Pn 4 4 0.5 = 0.0625 ∧ (0.25 : ℝ) + 0.0625 = 0.3125 ∧ (0.375 : ℝ) + 0.25 + 0.0625 = 0.6875 := by
  unfold Pn
  rw [show Nat.choose 4 0 = 1 by decide, show Nat.choose 4 1 = 4 by decide, show Nat.choose 4 2 = 6 by decide,
    show Nat.choose 4 3 = 4 by decide, show Nat.choose 4 4 = 1 by decide]
  norm_num

/-- Z analogijo (mešalna miza): štiri stikala od petih gor: `C(5,4) = 5`, verjetnost P₅(4) = C(5,4)·p⁴·q.
trditev: MAT-SS-4/zaporedje-neodvisnih-poskusov#mesalna-miza
besedilo: »pri Maji je $5 \cdot 0{,}8 = 4$ in res je $P_5(4) = 0{,}4096$ največja od vseh verjetnosti $P_5(k)$.« -/
theorem mesalna_miza (p : ℝ) : Nat.choose 5 4 = 5 ∧ Pn 5 4 p = 5 * p ^ 4 * (1 - p) := by
  refine ⟨by decide, ?_⟩
  unfold Pn; rw [show Nat.choose 5 4 = 5 by decide]; norm_num

end Evklid.Lekcije.MAT_SS_4.ZaporedjeNeodvisnihPoskusov
