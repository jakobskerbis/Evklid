/-
vir: content/lessons/MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik.md
sha256: faa5054fe6a7e897e5a48685de378703548a5318a247e4bb405e62afb3f70193
Model: števila so naravna (ℕ); D(a) je `Nat.divisors a`, D(a, b) je `Nat.gcd a b`, v(a, b) je `Nat.lcm a b`,
»a je večkratnik b« je b ∣ a, razcep na prafaktorje je `Nat.factorization` (eksponent prafaktorja p). Ulomki so
v ℚ. Ura 6.00 je 6·60 minut.
Lean: naravna števila v lekciji so od 1 naprej, zato imajo splošne trditve pogoj a ≠ 0, b ≠ 0 (v Leanu je
D(0) = ∅, 0 ∣ a le za a = 0, vsako število deli 0). Naštevanja (D(12) = {…}, prvi skupni
večkratnik) so preverjena z `decide`. Deljenje v ℕ (a·b / D) je celoštevilsko; v trditvi v = a·b/D se deli
natančno (D deli a·b).
Ni v Leanu: uganki in zgodbe (kresnice, tulipani, sadike, postaji, dežemeri, ploščice) kot besedilo, njihovi
računi so dokazani; simulacija »D in v z Vennovim diagramom« (dokazano D(60, 84) = 12, v(60, 84) = 420 in
D(60, 77) = 1); izbira D ali v v besedilnih nalogah (»enake skupine → D«, »spet hkrati → v«, Pogoste napake 5) je
navodilo, dokazane so le matematične lastnosti; »računanje z najmanjšim imenovalcem pomeni manjša števila in manj
krajšanja« (opis; dokazano, da je v najmanjši pozitivni skupni večkratnik); napotki za lekcije o ulomkih.
Napačni odgovori kvizov: dokazano je, da napačne vrednosti niso pravilne.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.NajvecjiSkupniDeliteljInNajmanjsiSkupniVeckratnik

/-! ## Razlaga 1 in 2: delitelj in večkratnik -/

/-- Razlaga 1: D(12) = {1, 2, 3, 4, 6, 12}.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#delitelji-12
besedilo: »Vse delitelje števila zapišemo v množico, na primer $D(12)=\{1, 2, 3, 4, 6, 12\}$.« -/
theorem delitelji_12 : Nat.divisors 12 = {1, 2, 3, 4, 6, 12} := by decide

/-- Razlaga 1: d je delitelj a natanko tedaj, ko a deliš z d brez ostanka (a mod d = 0).
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#delitelj
besedilo: »Število $d$ je **delitelj** števila $a$, če $a$ deliš z $d$ brez ostanka.« -/
theorem delitelj_brez_ostanka (d a : ℕ) : d ∣ a ↔ a % d = 0 := Nat.dvd_iff_mod_eq_zero

/-- Razlaga 1: deliteljev števila a ≠ 0 je končno mnogo (so v D(a), ki je končna množica).
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#deliteljev-koncno
besedilo: »Deliteljev je vedno končno mnogo.« -/
theorem deliteljev_koncno (a : ℕ) (ha : a ≠ 0) : {d : ℕ | d ∣ a}.Finite := by
  apply (Nat.divisors a).finite_toSet.subset
  intro d hd
  have hd' : d ∣ a := hd
  simp [Nat.mem_divisors, hd', ha]

example := deliteljev_koncno 12 (by norm_num)

/-- Razlaga 1 (preveri): 7 je delitelj 42, 42 : 7 = 6.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#preveri-7-42
besedilo: »*(Da, $42:7=6$.)*« -/
theorem preveri_7_42 : 7 ∣ 42 ∧ 42 / 7 = 6 := by decide

/-- Razlaga 2: večkratniki 4 so 4·1, 4·2, 4·3, 4·4 = 4, 8, 12, 16.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#veckratniki-4
besedilo: »Večkratniki števila $4$ so $4, 8, 12, 16, \dots$« -/
theorem veckratniki_4 : (4 * 1, 4 * 2, 4 * 3, 4 * 4) = (4, 8, 12, 16) := by decide

/-- Razlaga 2: večkratnikov števila a ≠ 0 (a·1, a·2, …) je neskončno mnogo.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#veckratnikov-neskoncno
besedilo: »Teh je neskončno mnogo.« -/
theorem veckratnikov_neskoncno (a : ℕ) (ha : a ≠ 0) : {m : ℕ | ∃ k, 1 ≤ k ∧ m = a * k}.Infinite := by
  apply Set.infinite_of_injective_forall_mem (f := fun k : ℕ => a * (k + 1))
  · intro i j h
    have := Nat.eq_of_mul_eq_mul_left (Nat.pos_of_ne_zero ha) h
    omega
  · intro k
    exact ⟨k + 1, by omega, rfl⟩

example := veckratnikov_neskoncno 4 (by norm_num)

/-- Razlaga 2 (preveri): 54 je večkratnik 6, 6·9 = 54.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#preveri-54
besedilo: »*(Da, $6\cdot 9=54$.)*« -/
theorem preveri_54 : 6 * 9 = 54 ∧ 6 ∣ 54 := by decide

/-! ## Razlaga 3 in 4: D(a, b) in v(a, b) -/

/-- Razlaga 3 in Povzetek: D(a, b) je skupni delitelj in vsak skupni delitelj je največ D(a, b) (a ≠ 0; pogoj
b ≠ 0 iz lekcije ni potreben).
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#d-najvecji
besedilo: »Največjemu rečemo **največji skupni delitelj** in ga zapišemo $D(a, b)$.« -/
theorem D_najvecji (a b : ℕ) (ha : a ≠ 0) :
    Nat.gcd a b ∣ a ∧ Nat.gcd a b ∣ b ∧ ∀ d, d ∣ a → d ∣ b → d ≤ Nat.gcd a b := by
  refine ⟨Nat.gcd_dvd_left a b, Nat.gcd_dvd_right a b, fun d h1 h2 => ?_⟩
  exact Nat.le_of_dvd (Nat.gcd_pos_of_pos_left b (Nat.pos_of_ne_zero ha)) (Nat.dvd_gcd h1 h2)

example := (D_najvecji 12 18 (by norm_num)).2.2 3 (by norm_num) (by norm_num)

/-- Razlaga 3 (uganka B): D(18) = {1, 2, 3, 6, 9, 18}, skupni delitelji 12 in 18 so 1, 2, 3, 6, D(12, 18) = 6;
6 šopkov po 12 : 6 = 2 rumena in 18 : 6 = 3 bele.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#uganka-b
besedilo: »Torej je $D(12, 18)=6$: narediš $6$ šopkov, vsak ima $2$ rumena in $3$ bele tulipane.« -/
theorem uganka_B :
    Nat.divisors 18 = {1, 2, 3, 6, 9, 18} ∧ Nat.divisors 12 ∩ Nat.divisors 18 = {1, 2, 3, 6} ∧
      Nat.gcd 12 18 = 6 ∧ 12 / 6 = 2 ∧ 18 / 6 = 3 := by
  decide

/-- Razlaga 3 (preveri): skupni delitelji 8 in 12 so 1, 2, 4, D(8, 12) = 4.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#preveri-d-8-12
besedilo: »*(Skupni delitelji so $1, 2, 4$, zato $4$.)*« -/
theorem preveri_D_8_12 : Nat.divisors 8 ∩ Nat.divisors 12 = {1, 2, 4} ∧ Nat.gcd 8 12 = 4 := by decide

/-- Razlaga 4 in Povzetek: v(a, b) je pozitiven skupni večkratnik in vsak pozitiven skupni večkratnik je vsaj
v(a, b) (a, b ≠ 0).
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#v-najmanjsi
besedilo: »Najmanjšemu (večjemu od $0$) rečemo **najmanjši skupni večkratnik** in ga zapišemo $v(a, b)$.« -/
theorem v_najmanjsi (a b : ℕ) (ha : a ≠ 0) (hb : b ≠ 0) :
    0 < Nat.lcm a b ∧ a ∣ Nat.lcm a b ∧ b ∣ Nat.lcm a b ∧ ∀ m, 0 < m → a ∣ m → b ∣ m → Nat.lcm a b ≤ m := by
  refine ⟨Nat.lcm_pos (Nat.pos_of_ne_zero ha) (Nat.pos_of_ne_zero hb), Nat.dvd_lcm_left a b,
    Nat.dvd_lcm_right a b, fun m hm h1 h2 => Nat.le_of_dvd hm (Nat.lcm_dvd h1 h2)⟩

example := (v_najmanjsi 4 6 (by norm_num) (by norm_num)).2.2.2 24 (by norm_num) (by norm_num) (by norm_num)

/-- Razlaga 4 (uganka A): kresnici svetita pri 4, 8, 12, 16, 20, 24 s in 6, 12, 18, 24 s; prvič se ujameta pri
12 s: noben pozitiven čas pod 12 ni večkratnik obeh, v(4, 6) = 12.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#uganka-a
besedilo: »Prvič se ujameta pri $12$ s, torej $v(4, 6)=12$.« -/
theorem uganka_A :
    (4 * 1, 4 * 2, 4 * 3, 4 * 4, 4 * 5, 4 * 6) = (4, 8, 12, 16, 20, 24) ∧
      (6 * 1, 6 * 2, 6 * 3, 6 * 4) = (6, 12, 18, 24) ∧
      Nat.lcm 4 6 = 12 ∧ (∀ m < 12, 0 < m → ¬ (4 ∣ m ∧ 6 ∣ m)) := by decide

example := uganka_A.2.2.2 6 (by norm_num) (by norm_num)

/-- Razlaga 4 (premisli): vsi skupni večkratniki so večkratniki najmanjšega: a ∣ m in b ∣ m ⇔ v(a, b) ∣ m.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#skupni-veckratniki
besedilo: »Vsi skupni večkratniki so večkratniki najmanjšega: $12, 24, 36, \dots$« -/
theorem skupni_veckratniki (a b m : ℕ) : (a ∣ m ∧ b ∣ m) ↔ Nat.lcm a b ∣ m := Nat.lcm_dvd_iff.symm

/-- Razlaga 4 (premisli): po 12 s kresnici naslednjič zasvetita skupaj pri 24 s.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#kresnici-naslednjic
besedilo: »Pri $24$ sekundah.« -/
theorem kresnici_naslednjic : 4 ∣ 24 ∧ 6 ∣ 24 ∧ (∀ m < 24, 12 < m → ¬ (4 ∣ m ∧ 6 ∣ m)) := by decide

example := kresnici_naslednjic.2.2 18 (by norm_num) (by norm_num)

/-! ## Razlaga 5: tuja števila -/

/-- Razlaga 5 in kviz 1: D(8, 15) = 1, čeprav nobeno od 8 in 15 ni praštevilo.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#tuji-8-15
besedilo: »Primer: $D(8, 15)=1$, čeprav nobeno od njiju ni praštevilo.« -/
theorem tuji_8_15 : Nat.gcd 8 15 = 1 ∧ ¬ Nat.Prime 8 ∧ ¬ Nat.Prime 15 := by
  refine ⟨by decide, by decide, by decide⟩

/-- Razlaga 5 (preveri): 9 in 16 sta tuji; delitelja 3 in 9 ne delita 16.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#tuji-9-16
besedilo: »*(Da, delitelja $3$ in $9$ ne delita $16$.)*« -/
theorem tuji_9_16 : Nat.gcd 9 16 = 1 ∧ ¬ 3 ∣ 16 ∧ ¬ 9 ∣ 16 := by decide

/-! ## Razlaga 6: prafaktorji -/

/-- Razlaga 6 in Povzetek: D vzame vsak prafaktor z manjšim eksponentom (prafaktor, ki ga v enem številu ni, ima
eksponent 0, zato ga D ne vzame), v z večjim (a, b ≠ 0).
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#prafaktorji-d-v
besedilo: »Pri prafaktorjih: $D$ vzame skupne prafaktorje z manjšim eksponentom, $v$ vse prafaktorje z večjim eksponentom.« -/
theorem prafaktorji_D_v (a b : ℕ) (ha : a ≠ 0) (hb : b ≠ 0) (p : ℕ) :
    (Nat.gcd a b).factorization p = min (a.factorization p) (b.factorization p) ∧
      (Nat.lcm a b).factorization p = max (a.factorization p) (b.factorization p) := by
  rw [Nat.factorization_gcd ha hb, Nat.factorization_lcm ha hb]
  exact ⟨rfl, rfl⟩

example := prafaktorji_D_v 60 84 (by norm_num) (by norm_num) 2

/-- Razlaga 6: 60 = 2²·3·5, 84 = 2²·3·7, D(60, 84) = 2²·3 = 12, v(60, 84) = 2²·3·5·7 = 420.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#razcep-60-84
besedilo: »$D(60, 84)=2^2\cdot 3=12$. - **$v(a, b)$:** *vsi* prafaktorji iz vsaj enega števila, vsak z *večjo* potenco. $v(60, 84)=2^2\cdot 3\cdot 5\cdot 7=420$.« -/
theorem razcep_60_84 :
    60 = 2 ^ 2 * 3 * 5 ∧ 84 = 2 ^ 2 * 3 * 7 ∧ Nat.gcd 60 84 = 2 ^ 2 * 3 ∧ 2 ^ 2 * 3 = 12 ∧
      Nat.lcm 60 84 = 2 ^ 2 * 3 * 5 * 7 ∧ 2 ^ 2 * 3 * 5 * 7 = 420 := by
  decide

/-- Razlaga 6 (premisli): 84 ni deljivo s 5, zato 5 ne deli D(60, 84); v(60, 84) je večkratnik 60, zato ga 5 deli.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#premisli-5
besedilo: »$D$ mora deliti obe števili, $84$ pa ni deljivo s $5$. $v$ mora biti večkratnik obeh, zato mora vsebovati vse prafaktorje števila $60$, tudi $5$.« -/
theorem premisli_5 : ¬ 5 ∣ 84 ∧ ¬ 5 ∣ Nat.gcd 60 84 ∧ 5 ∣ 60 ∧ 5 ∣ Nat.lcm 60 84 := by decide

/-- Razlaga 6 (simulacija): pri a = 60, b = 77 ni skupnih prafaktorjev, števili sta tuji.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#simulacija-60-77
besedilo: »Nato nastavi $b=77$ in opazuj: presek je prazen, števili sta tuji.« -/
theorem simulacija_60_77 : Nat.gcd 60 77 = 1 := by decide

/-! ## Razlaga 7: ulomki -/

/-- Razlaga 7: 12/18 = (12 : 6)/(18 : 6) = 2/3, D(12, 18) = 6.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#skrajsaj-12-18
besedilo: »Če delimo z $D(12, 18)=6$, pridemo do konca v enem koraku: $\frac{12}{18}=\frac{2}{3}$.« -/
theorem skrajsaj_12_18 : (12 : ℚ) / 18 = (12 / 6) / (18 / 6) ∧ (12 / 6 : ℚ) / (18 / 6) = 2 / 3 := by
  norm_num

/-- Razlaga 7 in Povzetek: ulomek a/b, skrajšan z D(a, b), je skrajšan do konca (novi števec in imenovalec sta
tuja), vrednost pa ostane enaka (b ≠ 0).
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#skrajsaj-z-d
besedilo: »Ulomek do konca skrajšamo tako, da števec in imenovalec delimo z $D$ števca in imenovalca.« -/
theorem skrajsaj_z_D (a b : ℕ) (hb : b ≠ 0) :
    ((a / Nat.gcd a b : ℕ) : ℚ) / (b / Nat.gcd a b : ℕ) = (a : ℚ) / b ∧
      Nat.Coprime (a / Nat.gcd a b) (b / Nat.gcd a b) := by
  have hg : 0 < Nat.gcd a b := Nat.gcd_pos_of_pos_right a (Nat.pos_of_ne_zero hb)
  refine ⟨?_, Nat.coprime_div_gcd_div_gcd hg⟩
  rw [Nat.cast_div (Nat.gcd_dvd_left a b) (by exact_mod_cast hg.ne'),
    Nat.cast_div (Nat.gcd_dvd_right a b) (by exact_mod_cast hg.ne')]
  have : ((Nat.gcd a b : ℕ) : ℚ) ≠ 0 := by exact_mod_cast hg.ne'
  field_simp

example := skrajsaj_z_D 12 18 (by norm_num)

/-- Razlaga 7: 1/4 + 1/6 = 3/12 + 2/12 = 5/12, v(4, 6) = 12.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#vsota-1-4-1-6
besedilo: »Dobimo $\frac{3}{12}+\frac{2}{12}=\frac{5}{12}$.« -/
theorem vsota_1_4_1_6 : Nat.lcm 4 6 = 12 ∧ (1 : ℚ) / 4 + 1 / 6 = 3 / 12 + 2 / 12 ∧ (3 : ℚ) / 12 + 2 / 12 = 5 / 12 := by
  refine ⟨by decide, by norm_num, by norm_num⟩

/-- Razlaga 7 (preveri): D(8, 12) = 4, 8/12 = 2/3.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#preveri-8-12
besedilo: »*($D(8, 12)=4$, zato $\frac{2}{3}$.)*« -/
theorem preveri_8_12 : Nat.gcd 8 12 = 4 ∧ (8 : ℚ) / 12 = (8 / 4) / (12 / 4) ∧ (8 / 4 : ℚ) / (12 / 4) = 2 / 3 := by
  refine ⟨by decide, by norm_num, by norm_num⟩

/-- Razlaga 8 (preveri): dežemera praznimo vsake 3 in 5 dni; spet isti dan čez v(3, 5) = 15 dni.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#dezemera
besedilo: »*(Z $v$.)*«
besedilo-kratko: odgovor naloge je le »z v«; dokazano je v(3, 5) = 15 -/
theorem dezemera : Nat.lcm 3 5 = 15 := by decide

/-! ## Rešeni primeri -/

/-- Primer 1: D(16) = {1, 2, 4, 8, 16}, D(24) = {1, 2, 3, 4, 6, 8, 12, 24}, skupni 1, 2, 4, 8, D(16, 24) = 8;
večkratniki 16, 32, 48 in 24, 48, prvi skupni 48 = v(16, 24); 8 ≤ 16, 48 ≥ 24.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#primer-1
besedilo: »Odgovor: $D(16, 24)=8$ in $v(16, 24)=48$.« -/
theorem primer1 :
    Nat.divisors 16 = {1, 2, 4, 8, 16} ∧ Nat.divisors 24 = {1, 2, 3, 4, 6, 8, 12, 24} ∧
      Nat.divisors 16 ∩ Nat.divisors 24 = {1, 2, 4, 8} ∧ Nat.gcd 16 24 = 8 ∧
      (16 * 1, 16 * 2, 16 * 3) = (16, 32, 48) ∧ (24 * 1, 24 * 2) = (24, 48) ∧
      (∀ m < 48, 0 < m → ¬ (16 ∣ m ∧ 24 ∣ m)) ∧ Nat.lcm 16 24 = 48 ∧ 8 ≤ 16 ∧ 48 ≥ 24 := by
  decide

example := primer1.2.2.2.2.2.2.1 32 (by norm_num) (by norm_num)

/-- Primer 1 (smiselnost), Pogoste napake 1 in kviz 1: D(a, b) ni večji od manjšega števila, v(a, b) ni manjši
od večjega (a, b ≠ 0).
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#d-manjsi-v-vecji
besedilo: »Popravek: $D(a, b)$ je največ tako velik kot manjše število, $v(a, b)$ vsaj tako velik kot večje.« -/
theorem D_manjsi_v_vecji (a b : ℕ) (ha : a ≠ 0) (hb : b ≠ 0) :
    Nat.gcd a b ≤ min a b ∧ max a b ≤ Nat.lcm a b := by
  have hl : 0 < Nat.lcm a b := Nat.lcm_pos (Nat.pos_of_ne_zero ha) (Nat.pos_of_ne_zero hb)
  refine ⟨le_min (Nat.le_of_dvd (Nat.pos_of_ne_zero ha) (Nat.gcd_dvd_left a b))
    (Nat.le_of_dvd (Nat.pos_of_ne_zero hb) (Nat.gcd_dvd_right a b)),
    max_le (Nat.le_of_dvd hl (Nat.dvd_lcm_left a b)) (Nat.le_of_dvd hl (Nat.dvd_lcm_right a b))⟩

example := D_manjsi_v_vecji 16 24 (by norm_num) (by norm_num)

/-- Primer 2 a): 72 = 2³·3² = 8·9, 108 = 2²·3³ = 4·27; D(72, 108) = 2²·3² = 4·9 = 36, v(72, 108) = 2³·3³ = 8·27
= 216; preizkus 72 : 36 = 2, 108 : 36 = 3, 216 : 72 = 3, 216 : 108 = 2 brez ostanka.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#primer-2a
besedilo: »$D$ vzame manjši potenci: $D(72, 108)=2^2\cdot 3^2=4\cdot 9=36$. 3. $v$ vzame večji potenci: $v(72, 108)=2^3\cdot 3^3=8\cdot 27=216$.« -/
theorem primer2a :
    72 = 2 ^ 3 * 3 ^ 2 ∧ 8 * 9 = 72 ∧ 108 = 2 ^ 2 * 3 ^ 3 ∧ 4 * 27 = 108 ∧
      Nat.gcd 72 108 = 2 ^ 2 * 3 ^ 2 ∧ 2 ^ 2 * 3 ^ 2 = 4 * 9 ∧ 4 * 9 = 36 ∧
      Nat.lcm 72 108 = 2 ^ 3 * 3 ^ 3 ∧ 2 ^ 3 * 3 ^ 3 = 8 * 27 ∧ 8 * 27 = 216 ∧
      36 * 2 = 72 ∧ 36 * 3 = 108 ∧ 72 * 3 = 216 ∧ 108 * 2 = 216 := by
  decide

/-- Primer 2 b): 72/108 = (72 : 36)/(108 : 36) = 2/3.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#primer-2b
besedilo: »$\dfrac{72}{108}=\dfrac{72:36}{108:36}=\dfrac{2}{3}$« -/
theorem primer2b : (72 : ℚ) / 108 = (72 / 36) / (108 / 36) ∧ (72 / 36 : ℚ) / (108 / 36) = 2 / 3 := by
  norm_num

/-- Primer 2 c): 5/72 = 15/216, 7/108 = 14/216, 15/216 + 14/216 = 29/216; 29 je praštevilo in ne deli 216, zato
se 29/216 ne da krajšati.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#primer-2c
besedilo: »Krajšati ne moremo, ker je $29$ praštevilo in ne deli $216$.« -/
theorem primer2c :
    (5 : ℚ) / 72 = 15 / 216 ∧ (7 : ℚ) / 108 = 14 / 216 ∧ (15 : ℚ) / 216 + 14 / 216 = 29 / 216 ∧
      Nat.Prime 29 ∧ ¬ 29 ∣ 216 ∧ Nat.gcd 29 216 = 1 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by decide, by decide⟩

/-- Primer 3: 48 = 2⁴·3, 60 = 2²·3·5, D(48, 60) = 2²·3 = 12; v gruči 48 : 12 = 4 bukve in 60 : 12 = 5 smrek;
preizkus 12·4 = 48, 12·5 = 60. Več kot 12 gruč ni mogoče (število gruč deli 48 in 60).
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#primer-3
besedilo: »Odgovor: gozdar naredi $12$ gruč, v vsaki so $4$ bukve in $5$ smrek.« -/
theorem primer3 :
    48 = 2 ^ 4 * 3 ∧ 60 = 2 ^ 2 * 3 * 5 ∧ Nat.gcd 48 60 = 2 ^ 2 * 3 ∧ 2 ^ 2 * 3 = 12 ∧ 48 / 12 = 4 ∧
      60 / 12 = 5 ∧ 12 * 4 = 48 ∧ 12 * 5 = 60 ∧ (∀ k, k ∣ 48 → k ∣ 60 → k ≤ 12) := by
  refine ⟨by decide, by decide, by decide, by decide, by decide, by decide, by decide, by decide, ?_⟩
  intro k h1 h2
  exact (D_najvecji 48 60 (by norm_num)).2.2 k h1 h2 |>.trans (by decide)

example := primer3.2.2.2.2.2.2.2.2 6 (by norm_num) (by norm_num)

/-- Primer 4: 15 = 3·5, 20 = 2²·5, v(15, 20) = 2²·3·5 = 60; preizkus 60 : 15 = 4, 60 : 20 = 3; 6.00 + 60 min =
7.00.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#primer-4
besedilo: »$v(15, 20)=2^2\cdot 3\cdot 5=60$. Čez $60$ minut, torej ob 7.00.« -/
theorem primer4 :
    15 = 3 * 5 ∧ 20 = 2 ^ 2 * 5 ∧ Nat.lcm 15 20 = 2 ^ 2 * 3 * 5 ∧ 2 ^ 2 * 3 * 5 = 60 ∧ 60 / 15 = 4 ∧
      60 / 20 = 3 ∧ 6 * 60 + 60 = 7 * 60 := by
  decide

/-! ## Pogoste napake -/

/-- Pogoste napake 1: D(12, 18) = 6, ne 36 (36 ne deli 12).
pomozno – lekcija tu ne zapiše D(12, 18) = 6 niti 36 ∤ 12, le splošno pravilo -/
theorem napaka_zamenjava : Nat.gcd 12 18 = 6 ∧ ¬ 36 ∣ 12 := by decide

/-- Pogoste napake 2 in kviz 3: 12 = 2²·3, 30 = 2·3·5; 2·3 = 6 ni večkratnik 12; v(12, 30) = 2²·3·5 = 60;
12·30 = 360 je skupni večkratnik, a 60 < 360 je že deljivo z 12 in 30.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#napaka-v-12-30
besedilo: »Popravek: pri $v$ vzameš vse prafaktorje z večjo potenco, $2^2\cdot 3\cdot 5=60$.« -/
theorem napaka_v_12_30 :
    12 = 2 ^ 2 * 3 ∧ 30 = 2 * 3 * 5 ∧ 2 * 3 = 6 ∧ ¬ 12 ∣ 6 ∧ Nat.gcd 12 30 = 6 ∧
      Nat.lcm 12 30 = 2 ^ 2 * 3 * 5 ∧ 2 ^ 2 * 3 * 5 = 60 ∧ 12 * 30 = 360 ∧ 12 ∣ 60 ∧ 30 ∣ 60 ∧ 60 < 360 ∧
      6 < 12 := by
  decide

/-- Pogoste napake 3 in kviz 2: 6 deli 24 in 36, a 24/36 skrajšan s 6 je 4/6, ki se da še krajšati
(D(4, 6) = 2); D(24, 36) = 12 (24 = 2³·3, 36 = 2²·3², manjši potenci 2²·3); 72 je v(24, 36).
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#napaka-prvi-delitelj
besedilo: »Popravek: preglej vse skupne delitelje ali uporabi prafaktorje; $D(24, 36)=12$.« -/
theorem napaka_prvi_delitelj :
    6 ∣ 24 ∧ 6 ∣ 36 ∧ 24 / 6 = 4 ∧ 36 / 6 = 6 ∧ Nat.gcd 4 6 = 2 ∧ Nat.gcd 24 36 = 12 ∧ 24 = 2 ^ 3 * 3 ∧
      36 = 2 ^ 2 * 3 ^ 2 ∧ 2 ^ 2 * 3 = 12 ∧ Nat.lcm 24 36 = 72 ∧ 6 ≠ 12 ∧ 72 ≠ 12 := by
  decide

/-- Pogoste napake 4: produkt a·b je vedno skupni večkratnik a in b.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#produkt-skupni-veckratnik
besedilo: »Produkt je res skupni večkratnik« -/
theorem produkt_skupni_veckratnik (a b : ℕ) : a ∣ a * b ∧ b ∣ a * b :=
  ⟨Dvd.intro b rfl, Dvd.intro_left a rfl⟩

/-- Pogoste napake 4 in Bolj natančno: produkt je najmanjši skupni večkratnik natanko pri tujih številih
(a, b ≠ 0).
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#v-je-produkt
besedilo: »a najmanjši je samo pri tujih številih.« -/
theorem v_je_produkt_iff (a b : ℕ) (ha : a ≠ 0) (hb : b ≠ 0) : Nat.lcm a b = a * b ↔ Nat.gcd a b = 1 := by
  constructor
  · intro h
    have e := Nat.gcd_mul_lcm a b
    rw [h] at e
    have hab : 0 < a * b := Nat.mul_pos (Nat.pos_of_ne_zero ha) (Nat.pos_of_ne_zero hb)
    exact Nat.eq_of_mul_eq_mul_right hab (by rw [e, one_mul])
  · intro h
    exact Nat.Coprime.lcm_eq_mul h

example := v_je_produkt_iff 8 15 (by norm_num) (by norm_num)

/-- Pogoste napake 4: 4·6 = 24, v(4, 6) = 12.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#napaka-produkt
besedilo: »Za $4$ in $6$ je $4\cdot 6=24$, $v(4, 6)$ pa je $12$.« -/
theorem napaka_produkt : 4 * 6 = 24 ∧ Nat.lcm 4 6 = 12 := by decide

/-! ## Drugače -/

/-- Na sliki: pravokotnik 18 × 12 cm: stranica kvadratne ploščice deli 18 in 12, največja je D(12, 18) = 6 cm;
18 : 6 = 3 ploščice v vrsti, 12 : 6 = 2 vrsti, 3·2 = 6 ploščic.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#ploscice-d
besedilo: »Potrebuješ $18 : 6 = 3$ ploščice v vrsti in $12 : 6 = 2$ vrsti, skupaj $6$ ploščic.« -/
theorem ploscice_D :
    Nat.gcd 12 18 = 6 ∧ (∀ s, s ∣ 18 → s ∣ 12 → s ≤ 6) ∧ 18 / 6 = 3 ∧ 12 / 6 = 2 ∧ 3 * 2 = 6 := by
  refine ⟨by decide, fun s h1 h2 => ?_, by decide, by decide, by decide⟩
  exact (D_najvecji 12 18 (by norm_num)).2.2 s h2 h1 |>.trans (by decide)

example := ploscice_D.2.1 3 (by norm_num) (by norm_num)

/-- Na sliki: ploščice po 12 cm in 18 cm se prvič poravnajo pri v(12, 18) = 36 cm: 3·12 = 36, 2·18 = 36.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#ploscice-v
besedilo: »Stiki ploščic se prvič poravnajo pri $36\,\text{cm}$, torej $v(12, 18) = 36$.« -/
theorem ploscice_v :
    Nat.lcm 12 18 = 36 ∧ (∀ m < 36, 0 < m → ¬ (12 ∣ m ∧ 18 ∣ m)) ∧ 3 * 12 = 36 ∧ 2 * 18 = 36 := by
  decide

example := ploscice_v.2.1 12 (by norm_num) (by norm_num)

/-- Bolj natančno: D(a, b)·v(a, b) = a·b za poljubni naravni števili.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#d-krat-v
besedilo: »D(a, b) \cdot v(a, b) = a \cdot b.« -/
theorem D_krat_v (a b : ℕ) : Nat.gcd a b * Nat.lcm a b = a * b := Nat.gcd_mul_lcm a b

/-- Bolj natančno (zakaj): min(m, n) + max(m, n) = m + n.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#min-plus-max
besedilo: »$\min(m, n) + \max(m, n) = m + n$« -/
theorem min_plus_max (m n : ℕ) : min m n + max m n = m + n := min_add_max m n

/-- Bolj natančno (preizkus): D(12, 18)·v(12, 18) = 6·36 = 216 = 12·18.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#preizkus-12-18
besedilo: »Preizkus: $D(12, 18) \cdot v(12, 18) = 6 \cdot 36 = 216 = 12 \cdot 18$.« -/
theorem preizkus_12_18 : Nat.gcd 12 18 * Nat.lcm 12 18 = 6 * 36 ∧ 6 * 36 = 216 ∧ 216 = 12 * 18 := by decide

/-- Bolj natančno: v = a·b / D (deljenje se izide, D deli a·b), za tuji števili v(a, b) = a·b.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#v-iz-d
besedilo: »če poznaš $D$, lahko dobiš $v = \dfrac{a \cdot b}{D}$. Za tuji števili ($D = 1$) je $v(a, b) = a \cdot b$.« -/
theorem v_iz_D (a b : ℕ) : Nat.lcm a b = a * b / Nat.gcd a b ∧ Nat.gcd a b ∣ a * b ∧
    (Nat.gcd a b = 1 → Nat.lcm a b = a * b) :=
  ⟨rfl, (Nat.gcd_dvd_left a b).mul_right b, fun h => Nat.Coprime.lcm_eq_mul h⟩

example := (v_iz_D 8 15).2.2 (by decide)

/-- Bolj natančno: v(8, 15) = 120.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#v-8-15
besedilo: »Na primer $v(8, 15) = 120$.« -/
theorem v_8_15 : Nat.lcm 8 15 = 120 := by decide

/-- Bolj natančno: skupni imenovalec ulomkov p/a in q/b je večkratnik obeh imenovalcev: če p/a = r/c in
q/b = s/c (a, b, c ≠ 0) z naravnimi števci in p/a, q/b do konca skrajšanima, potem a ∣ c in b ∣ c, torej
v(a, b) ∣ c.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#skupni-imenovalec
besedilo: »Ko sta ulomka do konca skrajšana, mora biti skupni imenovalec večkratnik obeh imenovalcev, da ulomka lahko razširimo na isti imenovalec.« -/
theorem skupni_imenovalec (p a q b r s c : ℕ) (ha : a ≠ 0) (hb : b ≠ 0) (hc : c ≠ 0)
    (hpa : Nat.Coprime p a) (hqb : Nat.Coprime q b)
    (h1 : (p : ℚ) / a = r / c) (h2 : (q : ℚ) / b = s / c) : Nat.lcm a b ∣ c := by
  have ha' : (a : ℚ) ≠ 0 := by exact_mod_cast ha
  have hb' : (b : ℚ) ≠ 0 := by exact_mod_cast hb
  have hc' : (c : ℚ) ≠ 0 := by exact_mod_cast hc
  have e1 : p * c = r * a := by
    have : (p : ℚ) * c = r * a := by field_simp at h1; linarith
    exact_mod_cast this
  have e2 : q * c = s * b := by
    have : (q : ℚ) * c = s * b := by field_simp at h2; linarith
    exact_mod_cast this
  have d1 : a ∣ c := (Nat.Coprime.dvd_of_dvd_mul_left hpa.symm (Dvd.intro_left r e1.symm))
  have d2 : b ∣ c := (Nat.Coprime.dvd_of_dvd_mul_left hqb.symm (Dvd.intro_left s e2.symm))
  exact Nat.lcm_dvd d1 d2

example := skupni_imenovalec 1 4 1 6 3 2 12 (by norm_num) (by norm_num) (by norm_num) (by decide)
    (by decide) (by norm_num) (by norm_num)

/-! ## Preveri se -/

/-- Kviz 4: 4 in 5 sta tuji, v(4, 5) = 4·5 = 20; 4 = 2², 6 = 2·3, v(4, 6) = 2²·3 = 12; v(4, 5) je večji.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#kviz-4
besedilo: »$4$ in $5$ sta tuji, zato $v(4, 5)=4\cdot 5=20$. Pri $4=2^2$ in $6=2\cdot 3$ je $v(4, 6)=2^2\cdot 3=12$.« -/
theorem kviz4 :
    Nat.gcd 4 5 = 1 ∧ Nat.lcm 4 5 = 4 * 5 ∧ 4 * 5 = 20 ∧ Nat.lcm 4 6 = 2 ^ 2 * 3 ∧ 2 ^ 2 * 3 = 12 ∧
      Nat.lcm 4 6 < Nat.lcm 4 5 := by
  decide

/-- Kviz 5: 36 = 2²·3², 54 = 2·3³, D(36, 54) = 2·3² = 18; v vsakem šopku 36 : 18 = 2 tulipana in 54 : 18 = 3
narcise; 6 je skupni delitelj, a manjši; 108 = v(36, 54) ni D in je več kot 36 tulipanov.
trditev: MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik#kviz-5
besedilo: »$36=2^2\cdot 3^2$, $54=2\cdot 3^3$, $D(36, 54)=2\cdot 3^2=18$. V vsakem šopku sta $2$ tulipana in $3$ narcise.« -/
theorem kviz5 :
    36 = 2 ^ 2 * 3 ^ 2 ∧ 54 = 2 * 3 ^ 3 ∧ Nat.gcd 36 54 = 2 * 3 ^ 2 ∧ 2 * 3 ^ 2 = 18 ∧ 36 / 18 = 2 ∧
      54 / 18 = 3 ∧ 6 ∣ 36 ∧ 6 ∣ 54 ∧ 6 < 18 ∧ Nat.lcm 36 54 = 108 ∧ 108 ≠ 18 ∧ 36 < 108 := by
  decide

end Evklid.Lekcije.MAT_OS_7.NajvecjiSkupniDeliteljInNajmanjsiSkupniVeckratnik
