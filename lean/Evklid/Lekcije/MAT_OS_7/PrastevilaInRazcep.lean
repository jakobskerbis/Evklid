/-
vir: content/lessons/MAT-OS-7/prastevila-in-razcep.md
sha256: 953e5c8d61f378b3a22e0472d1c89c9def5db440b978fc989e009975691f4794
Ni v Leanu: zgodbe (športni dan, tekma, tek, žoge, šah, igra s kartami) so dokazane samo kot račun s
števili; simulacija »Razcep na prafaktorje« (drevo za 360) kot slika, dokazan je le razcep 360 = 2³·3²·5;
»za 7 preprostega pravila ni« ni matematična trditev (dokazano je le, da se z 7 deli z ostankom/brez);
navodila (»napovej«, »nadaljuj sam«, »vedno preveri z množenjem«) kot besedilo; »postopek« deljenja z
najmanjšim praštevilom je dokazan na vsakem primeru kot zaporedje deljenj (n / p in n % p = 0), ne kot
algoritem. Pravilo za 3 je Mathlibov `Nat.three_dvd_iff` (vsota števk v desetiškem zapisu). Razcep je
seznam `Nat.primeFactorsList` (naraščajoč); »do vrstnega reda« je permutacija seznamov (`List.Perm`).
Deljenje v ℕ je celoštevilsko (n / p), zato je ob vsakem deljenju dokazano še, da je ostanek 0.
Napačni odgovori kvizov: dokazano je, da napačne trditve ne veljajo.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_7.PrastevilaInRazcep

/-! ## Zakaj se tega učimo -/

/-- Zakaj se tega učimo: velikosti ekip od 5 do 15, ki razdelijo 84 učencev brez ostanka, so natanko
6, 7, 12 in 14 (delitelji 84 med 5 in 15). -/
theorem ekipe_84 :
    (Nat.divisors 84).filter (fun d => 5 ≤ d ∧ d ≤ 15) = {6, 7, 12, 14} := by decide

/-- Zakaj se tega učimo: 89 učencev se da razdeliti le v eno ekipo z vsemi ali v »ekipe« po enega:
delitelja 89 sta samo 1 in 89. -/
theorem ekipe_89 : Nat.divisors 89 = {1, 89} := Nat.Prime.divisors (by norm_num)

/-! ## Razlaga: lihost in praštevila -/

/-- Razlaga (mamljiva zmota): 9 = 3·3, 15 = 3·5 in 21 = 3·7 so liha števila, ki niso praštevila. -/
theorem lihe_sestavljene :
    (9 = 3 * 3 ∧ Odd 9 ∧ ¬ Nat.Prime 9) ∧ (15 = 3 * 5 ∧ Odd 15 ∧ ¬ Nat.Prime 15) ∧
      (21 = 3 * 7 ∧ Odd 21 ∧ ¬ Nat.Prime 21) := by
  refine ⟨⟨rfl, by decide, by norm_num⟩, ⟨rfl, by decide, by norm_num⟩, ⟨rfl, by decide, by norm_num⟩⟩

/-- Razlaga in Povzetek: »liho število je praštevilo« ne velja (liho število, večje od 1, ni nujno
praštevilo; protiprimer 9). -/
theorem liho_ni_nujno_prastevilo : ¬ ∀ n : ℕ, Odd n → 1 < n → Nat.Prime n := by
  intro h
  exact (by norm_num : ¬ Nat.Prime 9) (h 9 (by decide) (by norm_num))

/-- Razlaga: lihost pove le, da število ni deljivo z 2 (n je liho natanko tedaj, ko 2 ne deli n). -/
theorem liho_iff_ni_deljivo_z_2 (n : ℕ) : Odd n ↔ ¬ 2 ∣ n := by
  rw [Nat.odd_iff, Nat.dvd_iff_mod_eq_zero]
  omega

/-- Razlaga: naravno število je praštevilo natanko tedaj, ko je večje od 1 in sta njegova delitelja
natanko 1 in ono samo. -/
theorem prastevilo_iff (n : ℕ) : Nat.Prime n ↔ 1 < n ∧ Nat.divisors n = {1, n} := by
  constructor
  · intro hp
    exact ⟨hp.one_lt, hp.divisors⟩
  · rintro ⟨h1, hd⟩
    rw [Nat.prime_def]
    refine ⟨h1, fun m hm => ?_⟩
    have : m ∈ Nat.divisors n := Nat.mem_divisors.mpr ⟨hm, by omega⟩
    rw [hd] at this
    simpa using this

/-- Razlaga: praštevilo ima natanko dva delitelja. -/
theorem prastevilo_dva_delitelja (p : ℕ) (hp : Nat.Prime p) : (Nat.divisors p).card = 2 := by
  rw [hp.divisors]
  exact Finset.card_pair (Nat.ne_of_lt hp.one_lt)

/-- Predpostavka trditve `prastevilo_dva_delitelja` se da izpolniti (p = 2). -/
example : Nat.Prime 2 := Nat.prime_two

/-- Razlaga in Povzetek: praštevila, manjša od 30, so natanko 2, 3, 5, 7, 11, 13, 17, 19, 23, 29
(prva praštevila). -/
theorem prva_prastevila :
    (Finset.range 30).filter Nat.Prime = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29} := by decide

/-- Razlaga in Povzetek: 2 je edino sodo praštevilo. -/
theorem edino_sodo (p : ℕ) (hp : Nat.Prime p) : Even p ↔ p = 2 := hp.even_iff

/-- Predpostavka trditve `edino_sodo` se da izpolniti (p = 3), 2 pa je sodo praštevilo. -/
example : Nat.Prime 3 ∧ Nat.Prime 2 ∧ Even 2 := ⟨Nat.prime_three, Nat.prime_two, even_two⟩

/-- Razlaga: sestavljeno število (večje od 1, ni praštevilo) ima vsaj tri delitelje. -/
theorem sestavljeno_vsaj_tri (n : ℕ) (h1 : 1 < n) (hn : ¬ Nat.Prime n) :
    3 ≤ (Nat.divisors n).card := by
  have hn0 : n ≠ 0 := by omega
  have hm1 : Nat.minFac n ≠ 1 := by
    rw [Ne, Nat.minFac_eq_one_iff]; omega
  have hmn : Nat.minFac n ≠ n := by
    intro h
    exact hn (Nat.prime_def_minFac.mpr ⟨h1, h⟩)
  have hsub : ({1, Nat.minFac n, n} : Finset ℕ) ⊆ Nat.divisors n := by
    intro x hx
    simp only [Finset.mem_insert, Finset.mem_singleton] at hx
    rcases hx with rfl | rfl | rfl
    · exact Nat.mem_divisors.mpr ⟨one_dvd _, hn0⟩
    · exact Nat.mem_divisors.mpr ⟨Nat.minFac_dvd n, hn0⟩
    · exact Nat.mem_divisors.mpr ⟨dvd_rfl, hn0⟩
  have hc : ({1, Nat.minFac n, n} : Finset ℕ).card = 3 :=
    Finset.card_eq_three.mpr ⟨1, Nat.minFac n, n, hm1.symm, by omega, hmn, rfl⟩
  exact hc ▸ Finset.card_le_card hsub

/-- Predpostavke trditve `sestavljeno_vsaj_tri` se dajo izpolniti (n = 4). -/
example : 1 < 4 ∧ ¬ Nat.Prime 4 := ⟨by norm_num, by norm_num⟩

/-- Razlaga, Pogoste napake in Povzetek: 1 ni praštevilo in ima en sam delitelj (zato tudi ni
sestavljeno število, ki je po definiciji večje od 1). -/
theorem ena : ¬ Nat.Prime 1 ∧ Nat.divisors 1 = {1} ∧ (Nat.divisors 1).card = 1 :=
  ⟨Nat.not_prime_one, Nat.divisors_one, by rw [Nat.divisors_one]; rfl⟩

/-- Razlaga (premisli): 51 ni praštevilo; vsota števk 5 + 1 = 6 je deljiva s 3, zato 3 ∣ 51 in
51 = 3·17. -/
theorem stevilo_51 :
    (Nat.digits 10 51).sum = 5 + 1 ∧ 5 + 1 = 6 ∧ 3 ∣ 6 ∧ 3 ∣ 51 ∧ 51 = 3 * 17 ∧ ¬ Nat.Prime 51 := by
  refine ⟨by norm_num, rfl, by norm_num, by norm_num, rfl, by norm_num⟩

/-! ## Razlaga: pravila deljivosti in preverjanje praštevil -/

/-- Razlaga: število je deljivo z 2 natanko tedaj, ko je deljiva z 2 njegova zadnja števka. -/
theorem deljivost_2 (n : ℕ) : 2 ∣ n ↔ 2 ∣ n % 10 := by
  simp only [Nat.dvd_iff_mod_eq_zero]; omega

/-- Razlaga: število je deljivo s 3 natanko tedaj, ko je vsota njegovih števk deljiva s 3. -/
theorem deljivost_3 (n : ℕ) : 3 ∣ n ↔ 3 ∣ (Nat.digits 10 n).sum := Nat.three_dvd_iff n

/-- Razlaga: število je deljivo s 5 natanko tedaj, ko je njegova zadnja števka 0 ali 5. -/
theorem deljivost_5 (n : ℕ) : 5 ∣ n ↔ n % 10 = 0 ∨ n % 10 = 5 := by
  rw [Nat.dvd_iff_mod_eq_zero]; omega

/-- Razlaga: 89 ni sodo, vsota števk 17 ni deljiva s 3, ne konča se z 0 ali 5, pri deljenju s 7 ostane 5. -/
theorem stevilo_89_preizkus :
    ¬ 2 ∣ 89 ∧ (Nat.digits 10 89).sum = 17 ∧ ¬ 3 ∣ 17 ∧ ¬ 3 ∣ 89 ∧ (89 % 10 ≠ 0 ∧ 89 % 10 ≠ 5) ∧
      89 % 7 = 5 := by
  refine ⟨by norm_num, by norm_num, by norm_num, by norm_num, by norm_num, by norm_num⟩

/-- Razlaga (premisli): če bi bilo 89 = a·b z a, b ≥ 11, bi bil zmnožek vsaj 11·11 = 121 > 89; zato je
vsaj en faktor manjši od 11. -/
theorem stevilo_89_faktor (a b : ℕ) (h : a * b = 89) : a < 11 ∨ b < 11 := by
  by_contra hc
  rw [not_or, not_lt, not_lt] at hc
  have : 11 * 11 ≤ a * b := Nat.mul_le_mul hc.1 hc.2
  omega

/-- Predpostavka trditve `stevilo_89_faktor` se da izpolniti (a = 1, b = 89). -/
example : 1 * 89 = 89 := rfl

/-- Razlaga (premisli): 11·11 = 121 > 89, in 89 je praštevilo. -/
theorem stevilo_89 : 11 * 11 = 121 ∧ 121 > 89 ∧ Nat.Prime 89 := ⟨rfl, by norm_num, by norm_num⟩

/-- Razlaga, Primer 2 (formula) in Povzetek: število n ≥ 2 je praštevilo natanko tedaj, ko ga ne deli
nobeno praštevilo p s p·p ≤ n (deliti poskušamo samo s takimi p). -/
theorem preizkus_prastevila (n : ℕ) (hn : 2 ≤ n) :
    Nat.Prime n ↔ ∀ p, Nat.Prime p → p * p ≤ n → ¬ p ∣ n := by
  constructor
  · intro hpn p hp hpp hdvd
    have := (Nat.prime_dvd_prime_iff_eq hp hpn).mp hdvd
    subst this
    have : p * 2 ≤ p * p := Nat.mul_le_mul_left p hp.two_le
    omega
  · intro h
    by_contra hnp
    have hm : Nat.Prime (Nat.minFac n) := Nat.minFac_prime (by omega)
    have hsq := Nat.minFac_sq_le_self (by omega) hnp
    exact h _ hm (by rw [← pow_two]; exact hsq) (Nat.minFac_dvd n)

/-- Predpostavka trditve `preizkus_prastevila` se da izpolniti (n = 89). -/
example : 2 ≤ 89 := by norm_num

/-! ## Razlaga: razcep na prafaktorje -/

/-- Razlaga (druga zmota) in Pogoste napake: 84 = 4·21 je pravilen račun, ni pa razcep, ker 4 in 21 nista
praštevili. -/
theorem nedokoncan_razcep : 84 = 4 * 21 ∧ ¬ Nat.Prime 4 ∧ ¬ Nat.Prime 21 :=
  ⟨rfl, by norm_num, by norm_num⟩

/-- Razlaga: vsako število n ≥ 1 (torej tudi vsako sestavljeno) je zmnožek seznama samih praštevil. -/
theorem obstoj_razcepa (n : ℕ) (hn : n ≠ 0) :
    (Nat.primeFactorsList n).prod = n ∧ ∀ p ∈ Nat.primeFactorsList n, Nat.Prime p :=
  ⟨Nat.prod_primeFactorsList hn, fun _ hp => Nat.prime_of_mem_primeFactorsList hp⟩

/-- Predpostavka trditve `obstoj_razcepa` se da izpolniti (n = 84). -/
example : (84 : ℕ) ≠ 0 := by norm_num

/-- Razlaga (postopek za 84): 84 : 2 = 42, 42 : 2 = 21, 21 : 3 = 7, 7 : 7 = 1 (vsakič brez ostanka). -/
theorem postopek_84 :
    (84 / 2 = 42 ∧ 84 % 2 = 0) ∧ (42 / 2 = 21 ∧ 42 % 2 = 0) ∧ (21 / 3 = 7 ∧ 21 % 3 = 0) ∧
      (7 / 7 = 1 ∧ 7 % 7 = 0) := by decide

/-- Razlaga: 84 = 2·2·3·7 = 2²·3·7, prafaktorji so 2, 2, 3, 7. -/
theorem razcep_84 :
    (84 : ℕ) = 2 * 2 * 3 * 7 ∧ (2 * 2 * 3 * 7 : ℕ) = 2 ^ 2 * 3 * 7 ∧
      Nat.primeFactorsList 84 = [2, 2, 3, 7] := by
  refine ⟨rfl, rfl, by simp⟩

/-- Razlaga (razcep je en sam) in Povzetek: vsak seznam praštevil z zmnožkom n je permutacija razcepa
`Nat.primeFactorsList n` (enolično do vrstnega reda). -/
theorem razcep_enolicen (n : ℕ) (l : List ℕ) (hprod : l.prod = n) (hp : ∀ p ∈ l, Nat.Prime p) :
    l.Perm (Nat.primeFactorsList n) := Nat.primeFactorsList_unique hprod hp

/-- Predpostavke trditve `razcep_enolicen` se dajo izpolniti (Mihin seznam 2, 3, 2, 7 za 84). -/
example : [2, 3, 2, 7].prod = 84 ∧ ∀ p ∈ [2, 3, 2, 7], Nat.Prime p := by
  refine ⟨rfl, ?_⟩
  intro p hp
  simp only [List.mem_cons, List.not_mem_nil, or_false] at hp
  rcases hp with rfl | rfl | rfl | rfl <;> norm_num

/-- Razlaga (Miha): 84 = 6·14, 6 = 2·3, 14 = 2·7; dobljeni prafaktorji 2, 3, 2, 7 so isti kot 2, 2, 3, 7,
le v drugem vrstnem redu. -/
theorem miha_84 :
    84 = 6 * 14 ∧ 6 = 2 * 3 ∧ 14 = 2 * 7 ∧ [2, 3, 2, 7].Perm [2, 2, 3, 7] := by
  refine ⟨rfl, rfl, rfl, by decide⟩

/-- Razlaga (simulacija): razcep števila 360 je 2·2·2·3·3·5 = 2³·3²·5. -/
theorem razcep_360 : Nat.primeFactorsList 360 = [2, 2, 2, 3, 3, 5] ∧ (360 : ℕ) = 2 ^ 3 * 3 ^ 2 * 5 := by
  refine ⟨by simp, rfl⟩

/-- Razlaga in Povzetek: vsak delitelj števila n ≠ 0 je zmnožek nekaterih njegovih prafaktorjev (podseznama
razcepa), in vsak tak zmnožek je delitelj. -/
theorem delitelj_iff (n d : ℕ) (hn : n ≠ 0) :
    d ∣ n ↔ ∃ l : List ℕ, l.Sublist (Nat.primeFactorsList n) ∧ l.prod = d := by
  constructor
  · intro hd
    have hd0 : d ≠ 0 := by rintro rfl; exact hn (Nat.eq_zero_of_zero_dvd hd)
    exact ⟨Nat.primeFactorsList d, Nat.primeFactorsList_sublist_of_dvd hd hn,
      Nat.prod_primeFactorsList hd0⟩
  · rintro ⟨l, hl, rfl⟩
    have := hl.prod_dvd_prod
    rwa [Nat.prod_primeFactorsList hn] at this

/-- Predpostavka trditve `delitelj_iff` se da izpolniti (n = 84). -/
example : (84 : ℕ) ≠ 0 := by norm_num

/-- Razlaga (kaj Tjaši pove razcep): iz 2, 2, 3, 7 dobimo 2·3 = 6, 7, 2·2·3 = 12 in 2·7 = 14; vsi delijo 84. -/
theorem tjasa_84 :
    2 * 3 = 6 ∧ 2 * 2 * 3 = 12 ∧ 2 * 7 = 14 ∧ 6 ∣ 84 ∧ 7 ∣ 84 ∧ 12 ∣ 84 ∧ 14 ∣ 84 := by decide

/-! ## Primer 1: 90 -/

/-- Primer 1, koraki 1–4: 90 : 2 = 45; 4 + 5 = 9 (deljivo s 3), 45 : 3 = 15; 1 + 5 = 6, 15 : 3 = 5;
5 : 5 = 1 (vsakič brez ostanka). -/
theorem primer1_koraki :
    (90 / 2 = 45 ∧ 90 % 2 = 0) ∧ (4 + 5 = 9 ∧ 3 ∣ 9 ∧ 45 / 3 = 15 ∧ 45 % 3 = 0) ∧
      (1 + 5 = 6 ∧ 3 ∣ 6 ∧ 15 / 3 = 5 ∧ 15 % 3 = 0) ∧ (Nat.Prime 5 ∧ 5 / 5 = 1 ∧ 5 % 5 = 0) := by
  refine ⟨by decide, by decide, by decide, ⟨by norm_num, by decide, by decide⟩⟩

/-- Primer 1: 90 = 2·45 = 2·3·15 = 2·3·3·5 = 2·3²·5, preizkus 2·3·3·5 = 90, razcep 2, 3, 3, 5. -/
theorem primer1 : (90 : ℕ) = 2 * 3 ^ 2 * 5 ∧ Nat.primeFactorsList 90 = [2, 3, 3, 5] := by
  refine ⟨?_, by simp⟩
  calc (90 : ℕ) = 2 * 45 := by norm_num
    _ = 2 * 3 * 15 := by norm_num
    _ = 2 * 3 * 3 * 5 := by norm_num
    _ = 2 * 3 ^ 2 * 5 := by norm_num

/-! ## Primer 2: 119 -/

/-- Primer 2, korak 1: 11·11 = 121 > 119, zato je dovolj preizkusiti 2, 3, 5 in 7 (vsa praštevila p
s p·p ≤ 119). -/
theorem primer2_meja :
    11 * 11 = 121 ∧ 121 > 119 ∧
      (Finset.range 120).filter (fun p => Nat.Prime p ∧ p * p ≤ 119) = {2, 3, 5, 7} := by
  refine ⟨rfl, by norm_num, by decide⟩

/-- Primer 2, koraki 2–4: 119 ni deljivo z 2, 3, 5 (vsota števk 1 + 1 + 9 = 11); 119 : 7 = 17 brez
ostanka; 17 je praštevilo in 7·17 = 119; zato 119 ni praštevilo (Ema nima prav). -/
theorem primer2 :
    ¬ 2 ∣ 119 ∧ (Nat.digits 10 119).sum = 1 + 1 + 9 ∧ 1 + 1 + 9 = 11 ∧ ¬ 3 ∣ 119 ∧ ¬ 5 ∣ 119 ∧
      (119 / 7 = 17 ∧ 119 % 7 = 0) ∧ Nat.Prime 17 ∧ 7 * 17 = 119 ∧ ¬ Nat.Prime 119 ∧
      Nat.primeFactorsList 119 = [7, 17] := by
  refine ⟨by norm_num, by norm_num, rfl, by norm_num, by norm_num, by decide, by norm_num, rfl,
    by norm_num, by simp⟩

/-! ## Primer 3: 126 žog -/

/-- Primer 3, koraka 1–2: 126 : 2 = 63, 63 : 3 = 21, 21 : 3 = 7, 7 : 7 = 1; torej 126 = 2·3²·7. -/
theorem primer3_razcep :
    (126 / 2 = 63 ∧ 126 % 2 = 0) ∧ (63 / 3 = 21 ∧ 63 % 3 = 0) ∧ (21 / 3 = 7 ∧ 21 % 3 = 0) ∧
      (7 / 7 = 1 ∧ 7 % 7 = 0) ∧ (126 : ℕ) = 2 * 3 ^ 2 * 7 ∧ Nat.primeFactorsList 126 = [2, 3, 3, 7] := by
  refine ⟨by decide, by decide, by decide, by decide, rfl, by simp⟩

/-- Primer 3, koraki 3–4: 2·7 = 14 in 2·3·3 = 18; 3·3 = 9 je premajhno, 3·7 = 21 preveliko;
126 : 14 = 9 in 126 : 18 = 7. -/
theorem primer3_koraki :
    2 * 7 = 14 ∧ 2 * 3 * 3 = 18 ∧ 3 * 3 = 9 ∧ 9 < 10 ∧ 3 * 7 = 21 ∧ 21 > 20 ∧
      (126 / 14 = 9 ∧ 126 % 14 = 0) ∧ (126 / 18 = 7 ∧ 126 % 18 = 0) := by decide

/-- Primer 3 (odgovor): število žog v mreži (od 10 do 20, brez ostanka) je natanko 14 ali 18. -/
theorem primer3 : (Nat.divisors 126).filter (fun d => 10 ≤ d ∧ d ≤ 20) = {14, 18} := by decide

/-! ## Primer 4: 168 -/

/-- Primer 4 in rešitev v premisli: 168 : 2 = 84, 84 : 2 = 42, 42 : 2 = 21, 21 : 3 = 7, 7 : 7 = 1;
168 = 2³·3·7, preizkus 8·3·7 = 168. -/
theorem primer4 :
    (168 / 2 = 84 ∧ 168 % 2 = 0) ∧ (84 / 2 = 42 ∧ 42 / 2 = 21 ∧ 84 % 2 = 0 ∧ 42 % 2 = 0) ∧
      (21 / 3 = 7 ∧ 21 % 3 = 0) ∧ (7 / 7 = 1 ∧ 7 % 7 = 0) ∧ (168 : ℕ) = 2 ^ 3 * 3 * 7 ∧ 8 * 3 * 7 = 168 ∧
      Nat.primeFactorsList 168 = [2, 2, 2, 3, 7] := by
  refine ⟨by decide, by decide, by decide, by decide, rfl, rfl, by simp⟩

/-! ## Pogoste napake -/

/-- Pogoste napake: 21 = 3·7 ni praštevilo, čeprav je liho. -/
theorem napaka_21 : Odd 21 ∧ 21 = 3 * 7 ∧ ¬ Nat.Prime 21 := ⟨by decide, rfl, by norm_num⟩

/-- Pogoste napake (prehitro ustavljanje) in Preveri se 4: 91 ni deljivo z 2, 3, 5 (za 119 glej `primer2`),
a 7·7 = 49 ≤ 91, in 91 = 7·13, zato 91 ni praštevilo. -/
theorem napaka_91 :
    ¬ 2 ∣ 91 ∧ ¬ 3 ∣ 91 ∧ ¬ 5 ∣ 91 ∧ 7 * 7 = 49 ∧ 49 ≤ 91 ∧ 91 = 7 * 13 ∧ ¬ Nat.Prime 91 := by
  refine ⟨by norm_num, by norm_num, by norm_num, rfl, by norm_num, rfl, by norm_num⟩

/-- Pogoste napake (branje potence): 2³ = 2·2·2 = 8, ne 2·3 = 6. -/
theorem napaka_potenca : (2 : ℕ) ^ 3 = 2 * 2 * 2 ∧ 2 * 2 * 2 = 8 ∧ (2 : ℕ) ^ 3 ≠ 2 * 3 := by decide

/-! ## Drugače: Kot zgodba -/

/-- Kot zgodba: 60 = 2·30, 30 ni praštevilo; 2·2·3·5 = 60; Jan: 60 = 3·20, 20 = 2·2·5; obe roki sta
2, 2, 3, 5; 1·1·2·2·3·5 = 60 (zato karte 1 ni); 13 je praštevilo. -/
theorem zgodba :
    60 = 2 * 30 ∧ ¬ Nat.Prime 30 ∧ 2 * 2 * 3 * 5 = 60 ∧ 60 = 3 * 20 ∧ 20 = 2 * 2 * 5 ∧
      Nat.primeFactorsList 60 = [2, 2, 3, 5] ∧ [3, 2, 2, 5].Perm [2, 2, 3, 5] ∧
      1 * 1 * 2 * 2 * 3 * 5 = 60 ∧ Nat.Prime 13 := by
  refine ⟨rfl, by norm_num, rfl, rfl, rfl, by simp, by decide, rfl, by norm_num⟩

/-! ## Drugače: Korak za korakom (1260) -/

/-- Korak za korakom: 1260 : 2 = 630, 630 : 2 = 315, 315 : 3 = 105 (3 + 1 + 5 = 9), 105 : 3 = 35
(1 + 0 + 5 = 6), 35 : 5 = 7, 7 : 7 = 1. -/
theorem korak_1260_deljenja :
    (1260 / 2 = 630 ∧ 1260 % 2 = 0) ∧ (630 / 2 = 315 ∧ 630 % 2 = 0) ∧
      (3 + 1 + 5 = 9 ∧ 315 / 3 = 105 ∧ 315 % 3 = 0) ∧ (1 + 0 + 5 = 6 ∧ 105 / 3 = 35 ∧ 105 % 3 = 0) ∧
      (35 / 5 = 7 ∧ 35 % 5 = 0) ∧ (7 / 7 = 1 ∧ 7 % 7 = 0) := by decide

/-- Korak za korakom: 1260 = 2²·3²·5·7, preizkus 4·9 = 36, 36·5 = 180, 180·7 = 1260; prafaktorji
2, 2, 3, 3, 5, 7. -/
theorem korak_1260 :
    Nat.primeFactorsList 1260 = [2, 2, 3, 3, 5, 7] ∧ (1260 : ℕ) = 2 ^ 2 * 3 ^ 2 * 5 * 7 := by
  refine ⟨by simp, ?_⟩
  calc (1260 : ℕ) = 180 * 7 := by norm_num
    _ = 36 * 5 * 7 := by norm_num
    _ = 4 * 9 * 5 * 7 := by norm_num
    _ = 2 ^ 2 * 3 ^ 2 * 5 * 7 := by norm_num

/-! ## Preveri se -/

/-- Preveri se 1: 2, 17 in 23 so praštevila (5·5 = 25 > 23), 27 = 3·3·3 pa ne. -/
theorem kviz1 :
    Nat.Prime 2 ∧ Nat.Prime 17 ∧ Nat.Prime 23 ∧ 5 * 5 = 25 ∧ 25 > 23 ∧ 27 = 3 * 3 * 3 ∧
      ¬ Nat.Prime 27 := by
  refine ⟨Nat.prime_two, by norm_num, by norm_num, rfl, by norm_num, rfl, by norm_num⟩

/-- Preveri se 2: 150 : 2 = 75, 75 : 3 = 25, 25 : 5 = 5, 5 : 5 = 1; razcep je 2·3·5²; 2·75 in 2·3·25 nista
razcepa (75 = 3·5·5 in 25 = 5·5 nista praštevili); 2·3²·5 = 90 ≠ 150. -/
theorem kviz2 :
    (150 / 2 = 75 ∧ 75 / 3 = 25 ∧ 25 / 5 = 5 ∧ 5 / 5 = 1 ∧
      150 % 2 = 0 ∧ 75 % 3 = 0 ∧ 25 % 5 = 0 ∧ 5 % 5 = 0) ∧ (150 : ℕ) = 2 * 3 * 5 ^ 2 ∧
      Nat.primeFactorsList 150 = [2, 3, 5, 5] ∧ 75 = 3 * 5 * 5 ∧ ¬ Nat.Prime 75 ∧ 25 = 5 * 5 ∧
      ¬ Nat.Prime 25 ∧ (2 * 3 ^ 2 * 5 : ℕ) = 90 ∧ (90 : ℕ) ≠ 150 := by
  refine ⟨by decide, rfl, by simp, rfl, by norm_num, rfl, by norm_num, rfl, by norm_num⟩

/-- Preveri se 3: če so prafaktorji števila 2, 3, 3 in 5, je število 90; zato je sodo, ni deljivo s 4,
je deljivo z 18 (90 : 18 = 5) in ni deljivo s 7. -/
theorem kviz3 (n : ℕ) (h : Nat.primeFactorsList n = [2, 3, 3, 5]) :
    n = 90 ∧ Even n ∧ ¬ 4 ∣ n ∧ 18 ∣ n ∧ 90 / 18 = 5 ∧ 90 % 18 = 0 ∧ ¬ 7 ∣ n := by
  have hn : n ≠ 0 := by rintro rfl; simp at h
  have h90 : n = 90 := by
    have := Nat.prod_primeFactorsList hn
    rw [h] at this
    simpa using this.symm
  subst h90
  refine ⟨rfl, by decide, by decide, by decide, rfl, rfl, by decide⟩

/-- Predpostavka trditve `kviz3` se da izpolniti (n = 90). -/
example : Nat.primeFactorsList 90 = [2, 3, 3, 5] := by simp

/-- Preveri se 4: Žanovi koraki (1)–(3) držijo, korak (4) ne: 7·7 = 49 < 91 in 91 = 7·13. -/
theorem kviz4 :
    (Odd 91 ∧ ¬ 2 ∣ 91) ∧ ((Nat.digits 10 91).sum = 10 ∧ ¬ 3 ∣ 10 ∧ ¬ 3 ∣ 91) ∧
      (91 % 10 ≠ 0 ∧ 91 % 10 ≠ 5 ∧ ¬ 5 ∣ 91) ∧ 7 * 7 = 49 ∧ 49 < 91 ∧ 91 = 7 * 13 ∧
      ¬ Nat.Prime 91 := by
  refine ⟨⟨by decide, by norm_num⟩, ⟨by norm_num, by norm_num, by norm_num⟩, by norm_num, rfl,
    by norm_num, rfl, by norm_num⟩

/-- Preveri se 5: 72 = 2³·3²; velikosti ekip od 6 do 10 brez ostanka so natanko 6, 8 in 9
(72 : 6 = 12, 72 : 8 = 9, 72 : 9 = 8); 7 in 10 ne delita 72. -/
theorem kviz5 :
    (72 : ℕ) = 2 ^ 3 * 3 ^ 2 ∧ (Nat.divisors 72).filter (fun d => 6 ≤ d ∧ d ≤ 10) = {6, 8, 9} ∧
      2 * 3 = 6 ∧ 2 * 2 * 2 = 8 ∧ 3 * 3 = 9 ∧ 72 / 6 = 12 ∧ 72 / 8 = 9 ∧ 72 / 9 = 8 ∧
      72 % 6 = 0 ∧ 72 % 8 = 0 ∧ 72 % 9 = 0 ∧ ¬ 7 ∣ 72 ∧ ¬ 10 ∣ 72 := by
  refine ⟨rfl, by decide, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, by decide, by decide⟩

end Evklid.Lekcije.MAT_OS_7.PrastevilaInRazcep
