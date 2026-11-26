/-
vir: content/lessons/MAT-OS-8/zapis-z-desetiskimi-potencami.md
sha256: f44aa5633935cda1be056f8d0fc28e5e1786ed32b92c20477a486ae81e3225e6
Model: števila so realna, decimalna števila točni ulomki (4,5 = 45/10, 0,0032 = 32/10000); desetiška potenca s
celim eksponentom je `zpow` v ℝ ((10 : ℝ) ^ (n : ℤ)); enote (Hz, s, m, €) so le v docstringih. »Število ničel« in
»število števk« sta šteta v desetiških števkah naravnega števila (`Nat.digits 10`). Primer 3, »približno 95 let«:
leto je 365 dni (365 · 24 · 3600 s).
Ni v Leanu: »premik decimalne vejice« kot postopek (recept v štirih korakih, »vejico postavimo za trojko«, štetje
premikov) — dokazane so le enakosti, ki jih da (npr. 4 500 000 = 4,5 · 10⁶); fizikalni podatki (premik bobniča,
frekvence, valovne dolžine, debelina membrane) kot meritve — dokazani so le njihovi zapisi; simulacija »Od atoma do
galaksije« in »točka se pomakne levo od 10⁰« (dokazano je 0 < 10⁻² < 1 < 10²); »ta zapis je pregleden« in
»znanstveni zapis« (ime); »10⁰ = 1 in 10⁻ⁿ = 1/10ⁿ« je v lekciji dogovor, v Leanu pa izrek o `zpow`.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_8.ZapisZDesetiskimiPotencami

/-! ## Splošna pravila -/

/-- Razlaga 3 in Povzetek: 10⁰ = 1 in 10⁻ⁿ = 1/10ⁿ. -/
theorem potenca_nic_in_negativna (n : ℕ) : (10 : ℝ) ^ (0 : ℤ) = 1 ∧ (10 : ℝ) ^ (-(n : ℤ)) = 1 / 10 ^ n := by
  refine ⟨zpow_zero _, ?_⟩
  rw [zpow_neg, zpow_natCast, one_div]

/-- Razlaga 3 (tabela): vsak korak navzdol deli z 10 in zmanjša eksponent za 1: 10ⁿ⁻¹ = 10ⁿ/10 za vsak cel n. -/
theorem korak_navzdol (n : ℤ) : (10 : ℝ) ^ (n - 1) = 10 ^ n / 10 := by
  rw [zpow_sub_one₀ (by norm_num), div_eq_mul_inv]

/-- Razlaga 3, Pogoste napake, Povzetek in Preveri se 3: negativen eksponent da pozitivno število: 10ⁿ > 0 za vsak
cel n; pri n < 0 je 10ⁿ med 0 in 1. -/
theorem potenca_pozitivna (n : ℤ) : 0 < (10 : ℝ) ^ n ∧ (n < 0 → (10 : ℝ) ^ n < 1) := by
  refine ⟨zpow_pos (by norm_num) n, fun h => ?_⟩
  exact zpow_lt_one_of_neg₀ (by norm_num) h

/-- Razlaga 3, Premisli in Pogoste napake (zadnja): večji eksponent da večje število; pri negativnih eksponentih je
10⁻⁶ < 10⁻⁵ in 10⁻⁶ = 10⁻⁵/10. -/
theorem vecji_eksponent (m n : ℤ) (h : m < n) : (10 : ℝ) ^ m < 10 ^ n := zpow_lt_zpow_right₀ (by norm_num) h

/-- Predpostavka `vecji_eksponent` se da izpolniti (m = −6, n = −5). -/
example : (-6 : ℤ) < -5 := by norm_num

/-- Razlaga 3, Premisli: 10⁻⁶ < 10⁻⁵ = 0,00001 in 10⁻⁶ = 10⁻⁵/10. -/
theorem premisli_6_5 :
    (10 : ℝ) ^ (-6 : ℤ) < 10 ^ (-5 : ℤ) ∧ (10 : ℝ) ^ (-5 : ℤ) = 1 / 100000 ∧
      (10 : ℝ) ^ (-6 : ℤ) = 10 ^ (-5 : ℤ) / 10 := by
  refine ⟨vecji_eksponent _ _ (by norm_num), by norm_num, by norm_num⟩

/-- Razlaga 6 in Povzetek (primerjava): pri 1 ≤ a, b < 10 in m < n je a · 10ᵐ < b · 10ⁿ (najprej odloča
eksponent). -/
theorem primerjava_eksponent (a b : ℝ) (m n : ℤ) (ha : 1 ≤ a ∧ a < 10) (hb : 1 ≤ b ∧ b < 10) (h : m < n) :
    a * 10 ^ m < b * 10 ^ n := by
  have hm : 0 < (10 : ℝ) ^ m := zpow_pos (by norm_num) m
  have hn : 0 < (10 : ℝ) ^ n := zpow_pos (by norm_num) n
  have h1 : (10 : ℝ) ^ (m + 1) ≤ 10 ^ n := zpow_le_zpow_right₀ (by norm_num) (by omega)
  have h2 : (10 : ℝ) ^ (m + 1) = 10 * 10 ^ m := by rw [zpow_add_one₀ (by norm_num)]; ring
  calc a * 10 ^ m < 10 * 10 ^ m := by nlinarith
    _ = 10 ^ (m + 1) := h2.symm
    _ ≤ 10 ^ n := h1
    _ ≤ b * 10 ^ n := by nlinarith

/-- Predpostavke `primerjava_eksponent` se dajo izpolniti (a = 9, b = 1,2, m = 4, n = 5). -/
example : (1 ≤ (9 : ℝ) ∧ (9 : ℝ) < 10) ∧ (1 ≤ (12 : ℝ) / 10 ∧ (12 : ℝ) / 10 < 10) ∧ (4 : ℤ) < 5 := by norm_num

/-- Razlaga 6 in Povzetek (primerjava): pri enakih eksponentih odloča a: a < b ⇒ a · 10ⁿ < b · 10ⁿ. -/
theorem primerjava_a (a b : ℝ) (n : ℤ) (h : a < b) : a * 10 ^ n < b * 10 ^ n :=
  mul_lt_mul_of_pos_right h (zpow_pos (by norm_num) n)

/-- Predpostavka `primerjava_a` se da izpolniti (a = 1,5, b = 3). -/
example : (15 : ℝ) / 10 < 3 := by norm_num

/-- Razlaga 2, Premisli (en sam zapis): vsako pozitivno število x ima natanko en zapis x = a · 10ⁿ z 1 ≤ a < 10 in
celim n. -/
theorem en_sam_zapis (x : ℝ) (hx : 0 < x) : ∃! p : ℝ × ℤ, (1 ≤ p.1 ∧ p.1 < 10) ∧ x = p.1 * 10 ^ p.2 := by
  -- n je edino celo število z 10ⁿ ≤ x < 10ⁿ⁺¹
  have key : ∀ (a : ℝ) (n : ℤ), (1 ≤ a ∧ a < 10) → x = a * 10 ^ n → 10 ^ n ≤ x ∧ x < 10 ^ (n + 1) := by
    intro a n ha hxa
    have hp : 0 < (10 : ℝ) ^ n := zpow_pos (by norm_num) n
    rw [zpow_add_one₀ (by norm_num), hxa]
    constructor <;> nlinarith
  have uniq_n : ∀ n n' : ℤ, (10 ^ n ≤ x ∧ x < 10 ^ (n + 1)) → (10 ^ n' ≤ x ∧ x < 10 ^ (n' + 1)) → n = n' := by
    intro n n' h h'
    by_contra hne
    rcases lt_or_gt_of_ne hne with hlt | hlt
    · have : (10 : ℝ) ^ (n + 1) ≤ 10 ^ n' := zpow_le_zpow_right₀ (by norm_num) (by omega)
      linarith [h.2, h'.1]
    · have : (10 : ℝ) ^ (n' + 1) ≤ 10 ^ n := zpow_le_zpow_right₀ (by norm_num) (by omega)
      linarith [h.1, h'.2]
  set n := Int.log 10 x with hn
  have hlo : (10 : ℝ) ^ n ≤ x := by
    have := Int.zpow_log_le_self (b := 10) (by norm_num) hx; exact_mod_cast this
  have hhi : x < (10 : ℝ) ^ (n + 1) := by
    have := Int.lt_zpow_succ_log_self (b := 10) (by norm_num) x; exact_mod_cast this
  have hp : 0 < (10 : ℝ) ^ n := zpow_pos (by norm_num) n
  have h10 : (10 : ℝ) ^ (n + 1) = 10 * 10 ^ n := by rw [zpow_add_one₀ (by norm_num)]; ring
  refine ⟨(x / 10 ^ n, n), ⟨⟨?_, ?_⟩, ?_⟩, ?_⟩
  · rw [le_div_iff₀ hp]; linarith
  · rw [div_lt_iff₀ hp]; linarith
  · simp only; field_simp
  · rintro ⟨a, m⟩ ⟨ha, hxa⟩
    have hm := key a m ha hxa
    have e : m = n := uniq_n m n hm ⟨hlo, hhi⟩
    simp only at e hxa ⊢
    subst e
    have hp' : (10 : ℝ) ^ n ≠ 0 := hp.ne'
    rw [Prod.mk.injEq]
    refine ⟨?_, rfl⟩
    rw [hxa]; field_simp

/-- Predpostavka `en_sam_zapis` se da izpolniti (x = 4 500 000). -/
example : (0 : ℝ) < 4500000 := by norm_num

/-- Primer 3 (formula) in Povzetek: 10ᵐ · 10ⁿ = 10ᵐ⁺ⁿ; pri množenju množiš števili a in seštevaš eksponenta. -/
theorem mnozenje (a b : ℝ) (m n : ℤ) :
    (10 : ℝ) ^ m * 10 ^ n = 10 ^ (m + n) ∧ (a * 10 ^ m) * (b * 10 ^ n) = (a * b) * 10 ^ (m + n) := by
  have h : (10 : ℝ) ^ m * 10 ^ n = 10 ^ (m + n) := (zpow_add₀ (by norm_num) m n).symm
  exact ⟨h, by rw [← h]; ring⟩

/-! ## Zakaj se tega učimo in Razlaga -/

/-- Zakaj se tega učimo: 0,00000000001 = 10⁻¹¹ in 2 500 000 000 = 2,5 · 10⁹. -/
theorem uvod : (1 : ℝ) / 100000000000 = 10 ^ (-11 : ℤ) ∧ (2500000000 : ℝ) = 25 / 10 * 10 ^ (9 : ℤ) := by
  norm_num

/-- Razlaga 1: 10³ = 1000 in 10⁶ = 1 000 000 imata 3 oz. 6 ničel; 4 500 000 ima 5 ničel, a
4,5 · 10⁵ = 450 000 ≠ 4 500 000 = 4,5 · 1 000 000 = 4,5 · 10⁶. -/
theorem stetje_nicel :
    (10 : ℕ) ^ 3 = 1000 ∧ (Nat.digits 10 1000).count 0 = 3 ∧ (10 : ℕ) ^ 6 = 1000000 ∧
      (Nat.digits 10 1000000).count 0 = 6 ∧ (Nat.digits 10 4500000).count 0 = 5 ∧
      (45 : ℝ) / 10 * 10 ^ (5 : ℤ) = 450000 ∧ (450000 : ℝ) ≠ 4500000 ∧
      (45 : ℝ) / 10 * 1000000 = 4500000 ∧ (4500000 : ℝ) = 45 / 10 * 10 ^ (6 : ℤ) := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num,
    by norm_num⟩

/-- Razlaga 2, Premisli: 45 · 10⁵ = 4 500 000, a 45 ni manjši od 10. -/
theorem premisli45 : (45 : ℝ) * 10 ^ (5 : ℤ) = 4500000 ∧ ¬ (45 : ℝ) < 10 := by norm_num

/-- Razlaga 3 (tabela): 10² = 100, 10¹ = 10, 10⁰ = 1, 10⁻¹ = 0,1 = 1/10, 10⁻² = 0,01 = 1/100,
10⁻³ = 0,001 = 1/1000. -/
theorem tabela :
    (10 : ℝ) ^ (2 : ℤ) = 100 ∧ (10 : ℝ) ^ (1 : ℤ) = 10 ∧ (10 : ℝ) ^ (0 : ℤ) = 1 ∧
      (10 : ℝ) ^ (-1 : ℤ) = 1 / 10 ∧ (10 : ℝ) ^ (-2 : ℤ) = 1 / 100 ∧ (10 : ℝ) ^ (-3 : ℤ) = 1 / 1000 := by
  norm_num

/-- Razlaga 3 in Pogoste napake: 10⁻³ = 1/1000 = 0,001, ni −1000 = −10³. -/
theorem minus_v_eksponentu : (10 : ℝ) ^ (-3 : ℤ) = 1 / 1000 ∧ (10 : ℝ) ^ (-3 : ℤ) ≠ -1000 ∧ -(10 : ℝ) ^ 3 = -1000 := by
  norm_num

/-- Razlaga 4 in 5: 0,0032 = 3,2 · 10⁻³; 3 · 10⁴ = 30 000; 7 · 10⁻² = 0,07. -/
theorem razlaga4_5 :
    (32 : ℝ) / 10000 = 32 / 10 * 10 ^ (-3 : ℤ) ∧ (3 : ℝ) * 10 ^ (4 : ℤ) = 30000 ∧
      (7 : ℝ) * 10 ^ (-2 : ℤ) = 7 / 100 := by norm_num

/-- Razlaga 6 in Pogoste napake: 1,2 · 10⁵ > 9 · 10⁴, čeprav 9 > 1,2 (90 000 < 120 000). -/
theorem razlaga6 :
    (9 : ℝ) * 10 ^ (4 : ℤ) < 12 / 10 * 10 ^ (5 : ℤ) ∧ (12 : ℝ) / 10 < 9 ∧ (9 : ℝ) * 10 ^ (4 : ℤ) = 90000 ∧
      (12 : ℝ) / 10 * 10 ^ (5 : ℤ) = 120000 := by norm_num

/-- Razlaga 6 (simulacija): 10⁻² je pozitiven, med 0 in 1, in levo od 10⁰ = 1 < 10² = 100. -/
theorem simulacija : (0 : ℝ) < 10 ^ (-2 : ℤ) ∧ (10 : ℝ) ^ (-2 : ℤ) < 10 ^ (0 : ℤ) ∧ (10 : ℝ) ^ (0 : ℤ) < 10 ^ (2 : ℤ) := by
  norm_num

/-! ## Rešeni primeri -/

/-- Primer 1 (ultrazvok): 3,5 · 10⁶ = 3,5 · 1 000 000 = 3 500 000, 1 ≤ 3,5 < 10. -/
theorem primer1 :
    (35 : ℝ) / 10 * 10 ^ (6 : ℤ) = 35 / 10 * 1000000 ∧ (35 : ℝ) / 10 * 1000000 = 3500000 ∧
      1 ≤ (35 : ℝ) / 10 ∧ (35 : ℝ) / 10 < 10 := by norm_num

/-- Primer 2 (nihaj strune): 2,3 · 10⁻³ = 2,3 · 0,001 = 0,0023. -/
theorem primer2 :
    (23 : ℝ) / 10 * 10 ^ (-3 : ℤ) = 23 / 10 * (1 / 1000) ∧ (23 : ℝ) / 10 * (1 / 1000) = 23 / 10000 ∧
      1 ≤ (23 : ℝ) / 10 ∧ (23 : ℝ) / 10 < 10 := by norm_num

/-- Primer 3 (pesem): 200 = 2 · 10², 15 000 000 = 1,5 · 10⁷, 2 · 1,5 = 3, 10² · 10⁷ = 10⁹; skupaj
200 · 15 000 000 = 3 · 10⁹. -/
theorem primer3 : (200 : ℝ) * 15000000 = 3 * 10 ^ (9 : ℤ) := by
  calc (200 : ℝ) * 15000000 = (2 * 10 ^ (2 : ℤ)) * (15 / 10 * 10 ^ (7 : ℤ)) := by norm_num
    _ = (2 * (15 / 10)) * (10 ^ (2 : ℤ) * 10 ^ (7 : ℤ)) := by ring
    _ = 3 * 10 ^ ((2 : ℤ) + 7) := by rw [(mnozenje 1 1 2 7).1]; norm_num
    _ = 3 * 10 ^ (9 : ℤ) := by norm_num

/-- Primer 3, »približno 95 let«: 3 · 10⁹ s je med 95 in 96 let po 365 dni (365 · 24 · 3600 = 31 536 000 s). -/
theorem primer3_leta :
    (365 : ℝ) * 24 * 3600 = 31536000 ∧ (95 : ℝ) < 3 * 10 ^ (9 : ℤ) / 31536000 ∧
      (3 : ℝ) * 10 ^ (9 : ℤ) / 31536000 < 96 := by norm_num

/-- Primer 4 (najvišji ton): 0,017 = 1,7 · 10⁻²; preizkus 1,7 · 0,01 = 0,017. -/
theorem primer4 :
    (17 : ℝ) / 1000 = 17 / 10 * 10 ^ (-2 : ℤ) ∧ (17 : ℝ) / 10 * (1 / 100) = 17 / 1000 := by norm_num

/-! ## Pogoste napake -/

/-- Pogoste napake (a zunaj meja): 25 · 10⁵ = 2,5 · 10⁶ in 0,5 · 10⁻⁵ = 5 · 10⁻⁶. -/
theorem a_zunaj_meja :
    (25 : ℝ) * 10 ^ (5 : ℤ) = 25 / 10 * 10 ^ (6 : ℤ) ∧ (5 : ℝ) / 10 * 10 ^ (-5 : ℤ) = 5 * 10 ^ (-6 : ℤ) := by
  norm_num

/-! ## Drugače -/

/-- Kot zgodba: 1,2 · 10⁷ = 12 000 000 in 5 · 10⁻⁹ = 0,000000005. -/
theorem zgodba : (12 : ℝ) / 10 * 10 ^ (7 : ℤ) = 12000000 ∧ (5 : ℝ) * 10 ^ (-9 : ℤ) = 5 / 1000000000 := by
  norm_num

/-- Korak za korakom (tabela): 6300 = 6,3 · 10³, 520 000 = 5,2 · 10⁵, 4,8 = 4,8 · 10⁰, 0,07 = 7 · 10⁻²,
0,000091 = 9,1 · 10⁻⁵. -/
theorem recept_tabela :
    (6300 : ℝ) = 63 / 10 * 10 ^ (3 : ℤ) ∧ (520000 : ℝ) = 52 / 10 * 10 ^ (5 : ℤ) ∧
      (48 : ℝ) / 10 = 48 / 10 * 10 ^ (0 : ℤ) ∧ (7 : ℝ) / 100 = 7 * 10 ^ (-2 : ℤ) ∧
      (91 : ℝ) / 1000000 = 91 / 10 * 10 ^ (-5 : ℤ) := by norm_num

/-- Bolj natančno: 4 500 000 = 4 · 10⁶ + 5 · 10⁵, 5 · 10⁵ = 0,5 · 10⁶, 4 · 10⁶ + 0,5 · 10⁶ = 4,5 · 10⁶. -/
theorem mestne_vrednosti :
    (4500000 : ℝ) = 4 * 10 ^ (6 : ℤ) + 5 * 10 ^ (5 : ℤ) ∧ (5 : ℝ) * 10 ^ (5 : ℤ) = 5 / 10 * 10 ^ (6 : ℤ) ∧
      (4 : ℝ) * 10 ^ (6 : ℤ) + 5 / 10 * 10 ^ (6 : ℤ) = 45 / 10 * 10 ^ (6 : ℤ) := by norm_num

/-- Bolj natančno: 0,0032 = 3 · 10⁻³ + 2 · 10⁻⁴ = 3,2 · 10⁻³ (10⁻⁴ je desetina od 10⁻³). -/
theorem mestne_vrednosti_majhno :
    (32 : ℝ) / 10000 = 3 * 10 ^ (-3 : ℤ) + 2 * 10 ^ (-4 : ℤ) ∧ (10 : ℝ) ^ (-4 : ℤ) = 10 ^ (-3 : ℤ) / 10 ∧
      (3 : ℝ) * 10 ^ (-3 : ℤ) + 2 * 10 ^ (-4 : ℤ) = 32 / 10 * 10 ^ (-3 : ℤ) := by norm_num

/-- Bolj natančno: premik vejice za eno mesto pomnoži z 10, eksponent pa to popravi za 1:
a · 10ⁿ = (a/10) · 10ⁿ⁺¹ = (10a) · 10ⁿ⁻¹. -/
theorem premik_vejice (a : ℝ) (n : ℤ) : a * 10 ^ n = a / 10 * 10 ^ (n + 1) ∧ a * 10 ^ n = 10 * a * 10 ^ (n - 1) := by
  constructor
  · rw [zpow_add_one₀ (by norm_num)]; ring
  · rw [zpow_sub_one₀ (by norm_num)]; field_simp

/-! ## Preveri se -/

/-- Preveri se 1: 4,8 · 10⁴ = 4,8 · 10 000 = 48 000; 10⁴ = 10 · 10 · 10 · 10; 48 000 ima 3 ničle in 5 števk. -/
theorem kviz1 :
    (48 : ℝ) / 10 * 10 ^ (4 : ℤ) = 48 / 10 * 10000 ∧ (48 : ℝ) / 10 * 10000 = 48000 ∧
      (10 : ℝ) ^ (4 : ℤ) = 10 * 10 * 10 * 10 ∧ (Nat.digits 10 48000).count 0 = 3 ∧
      (Nat.digits 10 48000).length = 5 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Preveri se 2: 8 · 10⁻³ < 1,5 · 10⁻² < 3 · 10⁻² (0,008 < 0,015 < 0,03). -/
theorem kviz2 :
    (8 : ℝ) * 10 ^ (-3 : ℤ) < 15 / 10 * 10 ^ (-2 : ℤ) ∧ (15 : ℝ) / 10 * 10 ^ (-2 : ℤ) < 3 * 10 ^ (-2 : ℤ) ∧
      (8 : ℝ) * 10 ^ (-3 : ℤ) = 8 / 1000 ∧ (15 : ℝ) / 10 * 10 ^ (-2 : ℤ) = 15 / 1000 ∧
      (3 : ℝ) * 10 ^ (-2 : ℤ) = 3 / 100 := by norm_num

/-- Preveri se 3: 2 · 10⁻⁴ = (2 · 10⁻³)/10 = 0,0002 > 0 (desetkrat manjše, ne negativno); 2 · 10⁻³ = 0,002. -/
theorem kviz3 :
    (2 : ℝ) * 10 ^ (-4 : ℤ) = 2 * 10 ^ (-3 : ℤ) / 10 ∧ (2 : ℝ) * 10 ^ (-3 : ℤ) = 2 / 1000 ∧
      (2 : ℝ) * 10 ^ (-4 : ℤ) = 2 / 10000 ∧ (0 : ℝ) < 2 * 10 ^ (-4 : ℤ) := by norm_num

/-- Preveri se 4: 0,000005 = 5 · 10⁻⁶; ni 5 · 10⁻⁵ in ni 5 · 10⁶ = 5 000 000; 0,5 · 10⁻⁵ ima pravo vrednost. -/
theorem kviz4 :
    (5 : ℝ) / 1000000 = 5 * 10 ^ (-6 : ℤ) ∧ (5 : ℝ) / 1000000 ≠ 5 * 10 ^ (-5 : ℤ) ∧
      (5 : ℝ) * 10 ^ (6 : ℤ) = 5000000 ∧ (5 : ℝ) / 10 * 10 ^ (-5 : ℤ) = 5 / 1000000 := by norm_num

/-- Preveri se 5: 4 · 10⁴ · 5 · 10¹ = 20 · 10⁵ = 2 · 10⁶ = 2 000 000 (4 · 5 = 20, 10⁴ · 10¹ = 10⁵); ni 9 · 10⁵ in
ni 2 · 10⁵. -/
theorem kviz5 :
    (4 : ℝ) * 10 ^ (4 : ℤ) * (5 * 10 ^ (1 : ℤ)) = 20 * 10 ^ (5 : ℤ) ∧ (20 : ℝ) * 10 ^ (5 : ℤ) = 2 * 10 ^ (6 : ℤ) ∧
      (2 : ℝ) * 10 ^ (6 : ℤ) = 2000000 ∧ (2 : ℝ) * 10 ^ (6 : ℤ) ≠ 9 * 10 ^ (5 : ℤ) ∧
      (2 : ℝ) * 10 ^ (6 : ℤ) ≠ 2 * 10 ^ (5 : ℤ) := by norm_num

end Evklid.Lekcije.MAT_OS_8.ZapisZDesetiskimiPotencami
