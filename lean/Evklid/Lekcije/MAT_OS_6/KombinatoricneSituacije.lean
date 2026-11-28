/-
vir: content/lessons/MAT-OS-6/kombinatoricne-situacije.md
sha256: 556b766892134d1150ab952264c2650a24f2c4632ede9387321bc0ba3104c0d5
Model: možnosti so elementi končne množice (`Finset`, `Fintype`); termin je par (dan, ura) z dnevi kot števili
(torek = 2, sreda = 3, četrtek = 4); dvomestno število je n z 10 ≤ n ≤ 99, desetica n / 10, enica n % 10;
rokovanje je dvoelementna podmnožica oseb (`Finset.powersetCard 2`), vrstni red vaj je permutacija treh vaj.
Lean: deljenje v ℕ (20 : 2, 6 · 5 : 2) je celoštevilsko, tu vedno brez ostanka; v n · (n − 1) je odštevanje v ℕ
(za n = 0 je 0 − 1 = 0, kar da pravilno 0 rokovanj).
Ni v Leanu: zgodba o Mendlu in Punnettu; risbe drevesnih prikazov in branje drevesa (»vsaka pot je ena možnost«,
»drevo nas sili k redu«) kot slika – dokazano je štetje, ki ga drevo prikaže (pravilo produkta, tudi s
spremenljivimi izbirami, in seštevanje konic po vejah); navodila za risanje drevesa, postopek v 7 korakih in prvi
kviz (razvrščanje korakov) ter napotek za simulacijo – to so navodila, ne trditve; »ključavnice z več kolesci so
varnejše« (dokazano le 100 < 1000 kod); »$05$ … je število $5$« je dokazano kot 0 · 10 + 5 = 5 < 10.
`RACUN`: vse vrstice so dokazane v izrekih `termini`, `sreda`, `stevke_123`, `vecja_druga`, `primer3`,
`primer4`, `vsakdan_malica`, `vsakdan_kljucavnica`, `preveri4` in `preveri5`.
-/
module

public import Mathlib

public section

namespace Evklid.Lekcije.MAT_OS_6.KombinatoricneSituacije

/-! ## Razlaga 1–3: drevo in preglednica za termine -/

/-- Razlaga 1: termini (dan, ura) za torek (2) in četrtek (4) ob 8, 10, 12; teh je 6.
trditev: MAT-OS-6/kombinatoricne-situacije#termini
besedilo: »Tu jih je $6$, torej $6$ terminov.« -/
theorem termini : (({2, 4} : Finset ℕ) ×ˢ ({8, 10, 12} : Finset ℕ)) =
      {(2, 8), (2, 10), (2, 12), (4, 8), (4, 10), (4, 12)} ∧
    (({2, 4} : Finset ℕ) ×ˢ ({8, 10, 12} : Finset ℕ)).card = 6 ∧ 2 * 3 = 6 := by
  decide

/-- Razlaga 2 (premisli): s sredo (3) so dnevi trije, terminov je 3 + 3 + 3 = 9 = 3 · 3.
trditev: MAT-OS-6/kombinatoricne-situacije#sreda
besedilo: »Konic je $3 + 3 + 3 = 9$, to je $3 \cdot 3 = 9$ terminov.« -/
theorem sreda : (({2, 3, 4} : Finset ℕ) ×ˢ ({8, 10, 12} : Finset ℕ)).card = 3 + 3 + 3 ∧ 3 + 3 + 3 = 9 ∧
    3 * 3 = 9 := by
  decide

/-- Razlaga 3: preglednica z 2 vrsticama (dnevi) in 3 stolpci (ure) ima 2 · 3 = 6 polj, toliko kot je
terminov (konic drevesa).
trditev: MAT-OS-6/kombinatoricne-situacije#preglednica
besedilo: »Vrstici sta $2$, stolpci so $3$, polj je $2 \cdot 3 = 6$, enako kot konic na drevesu.« -/
theorem preglednica (A : Finset ℕ) (B : Finset ℕ) (hA : A.card = 2) (hB : B.card = 3) :
    (A ×ˢ B).card = 2 * 3 ∧ 2 * 3 = 6 := by
  rw [Finset.card_product, hA, hB]
  exact ⟨rfl, rfl⟩

example := preglednica {2, 4} {8, 10, 12} (by decide) (by decide)

/-! ## Razlaga 4 in 5: ponavljanje in vrstni red -/

/-- Dvomestna števila (10 ≤ n ≤ 99), katerih obe števki sta iz množice `D`. -/
def dvomestna (D : Finset ℕ) : Finset ℕ :=
  (Finset.Icc 10 99).filter (fun n => n / 10 ∈ D ∧ n % 10 ∈ D)

/-- Dvomestna števila iz števk množice `D`, v katerih se števka ne ponovi. -/
def dvomestnaRazlicne (D : Finset ℕ) : Finset ℕ :=
  (Finset.Icc 10 99).filter (fun n => n / 10 ∈ D ∧ n % 10 ∈ D ∧ n / 10 ≠ n % 10)

/-- Razlaga 4 (premisli) in Pogoste napake 3: iz števk 1, 2, 3 je s ponavljanjem 3 · 3 = 9 dvomestnih števil,
brez ponavljanja 3 · 2 = 6; odpadejo natanko 11, 22 in 33.
trditev: MAT-OS-6/kombinatoricne-situacije#stevke-123
besedilo: »Brez ponavljanja le $2$, ker porabljene števke ne smeš vzeti znova: $3 \cdot 2 = 6$. Odpadejo $11$, $22$ in $33$.« -/
theorem stevke_123 :
    (dvomestna {1, 2, 3}).card = 3 * 3 ∧ 3 * 3 = 9 ∧ (dvomestnaRazlicne {1, 2, 3}).card = 3 * 2 ∧ 3 * 2 = 6 ∧
      dvomestna {1, 2, 3} \ dvomestnaRazlicne {1, 2, 3} = {11, 22, 33} := by
  decide

/-- Razlaga 4: pri razporedu na stopničke (prvo in drugo mesto) isti tekmovalec ne more biti na obeh mestih:
v drugem koraku je za vsako izbiro prvega ena izbira manj (`erase`).
trditev: MAT-OS-6/kombinatoricne-situacije#ena-manj
besedilo: »V vsakem naslednjem koraku je zato ena izbira manj.« -/
theorem ena_manj {α : Type*} [DecidableEq α] (T : Finset α) (x : α) (hx : x ∈ T) :
    (T.erase x).card = T.card - 1 := Finset.card_erase_of_mem hx

example := ena_manj ({1, 2, 3} : Finset ℕ) 1 (by decide)

/-- Razlaga 5: pri dvomestnem številu je vrstni red pomemben (12 ≠ 21), pri rokovanju ne: par {Ana, Bor} je isti
kot {Bor, Ana}.
trditev: MAT-OS-6/kombinatoricne-situacije#vrstni-red
besedilo: »Pri dvomestnem številu je $12$ drugo število kot $21$, zato štejemo obe.« -/
theorem vrstni_red {α : Type*} [DecidableEq α] (a b : α) :
    1 * 10 + 2 ≠ 2 * 10 + 1 ∧ ({a, b} : Finset α) = {b, a} :=
  ⟨by decide, Finset.pair_comm a b⟩

/-! ## Razlaga 6: pravilo produkta -/

/-- Razlaga 6 in Povzetek: pravilo produkta za neodvisne izbire, N = a · b · c (A, B, C so izbire v treh korakih).
trditev: MAT-OS-6/kombinatoricne-situacije#pravilo-produkta
besedilo: »Če je v 1. koraku $a$ izbir, v 2. koraku $b$ izbir in v 3. koraku $c$ izbir, je vseh možnosti« -/
theorem pravilo_produkta {α β γ : Type*} (A : Finset α) (B : Finset β) (C : Finset γ) :
    (A ×ˢ B ×ˢ C).card = A.card * B.card * C.card := by
  rw [Finset.card_product, Finset.card_product, mul_assoc]

/-- Razlaga 6: pri dveh korakih je N = a · b.
trditev: MAT-OS-6/kombinatoricne-situacije#produkt-dva
besedilo: »Pri dveh korakih je $N = a \cdot b$.« -/
theorem produkt_dva {α β : Type*} (A : Finset α) (B : Finset β) : (A ×ˢ B).card = A.card * B.card :=
  Finset.card_product A B

/-- Razlaga 6 in Povzetek: pravilo produkta velja tudi, ko so izbire v 2. in 3. koraku odvisne od prejšnjih
(npr. brez ponavljanja), če je *število* izbir pri vsaki veji enako: a, b, c.
trditev: MAT-OS-6/kombinatoricne-situacije#produkt-odvisno
besedilo: »Velja tudi, ko se izbira ne sme ponoviti: spremeni se, *katere* izbire ostanejo, *koliko* jih ostane, pa je pri vsaki veji enako.« -/
theorem produkt_odvisno {α β γ : Type*} (A : Finset α) (B : α → Finset β) (C : α → β → Finset γ) (a b c : ℕ)
    (hA : A.card = a) (hB : ∀ x ∈ A, (B x).card = b) (hC : ∀ x ∈ A, ∀ y ∈ B x, (C x y).card = c) :
    (A.sigma fun x => (B x).sigma fun y => C x y).card = a * b * c := by
  rw [Finset.card_sigma, Finset.sum_congr rfl (g := fun _ => b * c)]
  · rw [Finset.sum_const, hA, smul_eq_mul, mul_assoc]
  · intro x hx
    rw [Finset.card_sigma, Finset.sum_congr rfl (hC x hx), Finset.sum_const, hB x hx, smul_eq_mul]

example := produkt_odvisno ({1, 2, 3} : Finset ℕ) (fun x => ({1, 2, 3} : Finset ℕ).erase x)
  (fun x y => (({1, 2, 3} : Finset ℕ).erase x).erase y) 3 2 1 (by decide) (by decide) (by decide)

/-- Razlaga 6: kadar je število izbir odvisno od prejšnje (druga števka večja od prve), po 1 ostaneta 2 izbiri,
po 2 ena, po 3 nobena; števil je 2 + 1 + 0 = 3: 12, 13, 23.
trditev: MAT-OS-6/kombinatoricne-situacije#vecja-druga
besedilo: »Po $1$ sta še $2$ izbiri, po $2$ ena, po $3$ nobena, skupaj $2 + 1 + 0 = 3$ ($12$, $13$, $23$).« -/
theorem vecja_druga :
    (({1, 2, 3} : Finset ℕ).filter (1 < ·)).card = 2 ∧ (({1, 2, 3} : Finset ℕ).filter (2 < ·)).card = 1 ∧
      (({1, 2, 3} : Finset ℕ).filter (3 < ·)).card = 0 ∧
      (dvomestna {1, 2, 3}).filter (fun n => n / 10 < n % 10) = {12, 13, 23} ∧
      ((dvomestna {1, 2, 3}).filter (fun n => n / 10 < n % 10)).card = 2 + 1 + 0 ∧ 2 + 1 + 0 = 3 := by
  decide

/-! ## Rešeni primeri -/

/-- Primer 1: majice R, M, Z so 0, 1, 2 (`Fin 3`), hlače K, H so 0, 1 (`Fin 2`); vse obleke so RK, RH, MK, MH, ZK,
ZH; konic je 6 = 3 · 2.
trditev: MAT-OS-6/kombinatoricne-situacije#primer1
besedilo: »Odgovor: Nika se lahko obleče na $6$ različnih načinov.« -/
theorem primer1 :
    (Finset.univ : Finset (Fin 3 × Fin 2)) = {(0, 0), (0, 1), (1, 0), (1, 1), (2, 0), (2, 1)} ∧
      Fintype.card (Fin 3 × Fin 2) = 6 := by
  refine ⟨by decide, ?_⟩
  calc Fintype.card (Fin 3 × Fin 2) = Fintype.card (Fin 3) * Fintype.card (Fin 2) := Fintype.card_prod _ _
    _ = 3 * 2 := by simp
    _ = 6 := rfl

/-- Primer 2: iz števk 0, 1, 2, 3 brez ponavljanja: za desetice 3 izbire (0 odpade), za enice pri vsaki desetici
3 izbire; števila so 10, 12, 13, 20, 21, 23, 30, 31, 32, skupaj 3 + 3 + 3 = 9 = 3 · 3.
trditev: MAT-OS-6/kombinatoricne-situacije#primer2
besedilo: »Odgovor: laboratorij lahko sestavi $9$ različnih oznak.« -/
theorem primer2 :
    (({0, 1, 2, 3} : Finset ℕ).filter (· ≠ 0)).card = 3 ∧
      (∀ d ∈ ({1, 2, 3} : Finset ℕ), (({0, 1, 2, 3} : Finset ℕ).erase d).card = 3) ∧
      dvomestnaRazlicne {0, 1, 2, 3} = {10, 12, 13, 20, 21, 23, 30, 31, 32} ∧
      (dvomestnaRazlicne {0, 1, 2, 3}).card = 9 := by
  refine ⟨by decide, by decide, by decide, ?_⟩
  calc (dvomestnaRazlicne {0, 1, 2, 3}).card = 3 + 3 + 3 := by decide
    _ = 9 := rfl
    _ = 3 * 3 := rfl
    _ = 9 := rfl

example := primer2.2.1 1 (by decide)

/-- Primer 3: pet zdravnikov (Fin 5 po abecedi A, B, C, D, E); oseba i ima 4, 3, 2, 1, 0 novih rokovanj (z
osebami za njo), rokovanj je 4 + 3 + 2 + 1 = 10; preverba: urejenih parov različnih oseb je 5 · 4 = 20, 20 : 2 = 10.
trditev: MAT-OS-6/kombinatoricne-situacije#primer3
besedilo: »Odgovor: bilo je $10$ rokovanj.« -/
theorem primer3 :
    (∀ i : Fin 5, (Finset.univ.filter (fun j : Fin 5 => i < j)).card = 4 - i.val) ∧
      (Finset.powersetCard 2 (Finset.univ : Finset (Fin 5))).card = 10 ∧
      (Finset.univ.filter (fun p : Fin 5 × Fin 5 => p.1 ≠ p.2)).card = 20 ∧ 5 * 4 = 20 ∧ 20 / 2 = 10 := by
  refine ⟨by decide, ?_, by decide, rfl, rfl⟩
  calc (Finset.powersetCard 2 (Finset.univ : Finset (Fin 5))).card = Nat.choose 5 2 := by simp
    _ = 4 + 3 + 2 + 1 := by decide
    _ = 10 := rfl

/-- Primer 4 in Povzetek: vrstnih redov treh vaj R, P, M (kot 0, 1, 2; vsaka enkrat) je 3 · 2 · 1 = 6: RPM, RMP,
PRM, PMR, MRP, MPR (permutacije, tj. trojice različnih vaj).
trditev: MAT-OS-6/kombinatoricne-situacije#primer4
besedilo: »Ostane $1$ vaja, zato $N = 3 \cdot 2 \cdot 1 = 6$ vrstnih redov: RPM, RMP, PRM, PMR, MRP, MPR.« -/
theorem primer4 :
    Fintype.card (Equiv.Perm (Fin 3)) = 3 * 2 * 1 ∧ 3 * 2 * 1 = 6 ∧
      (Finset.range 3 ×ˢ Finset.range 3 ×ˢ Finset.range 3).filter
          (fun t => t.1 ≠ t.2.1 ∧ t.1 ≠ t.2.2 ∧ t.2.1 ≠ t.2.2) =
        {(0, 1, 2), (0, 2, 1), (1, 0, 2), (1, 2, 0), (2, 0, 1), (2, 1, 0)} := by
  refine ⟨?_, rfl, by decide⟩
  rw [Fintype.card_perm, Fintype.card_fin]
  rfl

/-! ## Pogoste napake -/

/-- Pogoste napake 2: 3 + 2 = 5 je število oblačil, oblek pa je 3 · 2 = 6.
trditev: MAT-OS-6/kombinatoricne-situacije#sestevanje-ne
besedilo: »Vsaka majica gre z vsakimi hlačami, zato je oblek $3 \cdot 2 = 6$.« -/
theorem sestevanje_ne : Fintype.card (Fin 3) + Fintype.card (Fin 2) = 5 ∧ Fintype.card (Fin 3 × Fin 2) = 3 * 2 := by
  simp

/-- Pogoste napake 4 in Povzetek: »05« je 0 · 10 + 5 = 5, ki ni dvomestno; dvomestno število nima ničle na mestu
desetic.
trditev: MAT-OS-6/kombinatoricne-situacije#nicla-spredaj
besedilo: »$05$ ni dvomestno število, ampak število $5$.« -/
theorem nicla_spredaj : 0 * 10 + 5 = 5 ∧ ¬ (10 ≤ 5 ∧ 5 ≤ 99) ∧ ∀ n ∈ Finset.Icc 10 99, n / 10 ≠ 0 := by
  refine ⟨rfl, by decide, ?_⟩
  intro n hn
  rw [Finset.mem_Icc] at hn
  omega

example := nicla_spredaj.2.2 10 (by decide)

/-- Pogoste napake 5 in Primer 3 (splošno): pri n osebah je rokovanj (n − 1) + … + 1 + 0, dvakrat toliko kot
rokovanj pa je urejenih parov n · (n − 1) – zato dobljeno število delimo z 2.
trditev: MAT-OS-6/kombinatoricne-situacije#dvojno-stetje
besedilo: »*Pravilno:* vsako osebo poveži le s tistimi, ki so v seznamu za njo, ali pa dobljeno število deli z $2$.« -/
theorem dvojno_stetje (n : ℕ) :
    (Finset.powersetCard 2 (Finset.range n)).card = ∑ i ∈ Finset.range n, i ∧
      (Finset.powersetCard 2 (Finset.range n)).card * 2 = n * (n - 1) := by
  have h1 : (Finset.powersetCard 2 (Finset.range n)).card * 2 = n * (n - 1) := by
    rw [Finset.card_powersetCard, Finset.card_range, Nat.choose_two_right]
    exact Nat.div_mul_cancel (Nat.even_mul_pred_self n).two_dvd
  refine ⟨?_, h1⟩
  have h2 := Finset.sum_range_id_mul_two n
  omega

/-! ## Drugače -/

/-- Drugače (analogija): 3 poti s po 2 stezicama dajo 3 · 2 = 6 klopi, z dodatnim razcepom 6 · 2 = 12; pravokotnik
2 × 3 ima 2 · 3 = 6 kvadratkov.
trditev: MAT-OS-6/kombinatoricne-situacije#analogija
besedilo: »Če bi se vsaka stezica še enkrat razcepila na dve, bi bilo klopi $6 \cdot 2 = 12$.« -/
theorem analogija : (Finset.range 3 ×ˢ Finset.range 2).card = 3 * 2 ∧ 3 * 2 = 6 ∧
    (Finset.range 3 ×ˢ Finset.range 2 ×ˢ Finset.range 2).card = 6 * 2 ∧ 6 * 2 = 12 ∧
    (Finset.range 2 ×ˢ Finset.range 3).card = 2 * 3 ∧ 2 * 3 = 6 := by
  decide

/-- Drugače (vsakdan): 2 kruha, 3 namazi, 2 napitka: 2 · 3 = 6 sendvičev, 6 · 2 = 12 malic.
trditev: MAT-OS-6/kombinatoricne-situacije#vsakdan-malica
besedilo: »K vsakemu vzameš čaj ali mleko, zato je malic $6 \cdot 2 = 12$.« -/
theorem vsakdan_malica : (Finset.range 2 ×ˢ Finset.range 3).card = 2 * 3 ∧ 2 * 3 = 6 ∧
    (Finset.range 2 ×ˢ Finset.range 3 ×ˢ Finset.range 2).card = 12 ∧ 6 * 2 = 12 := by
  decide

/-- Drugače (vsakdan): ključavnica s tremi kolesci po 10 števk ima 10 · 10 · 10 = 1000 kod (od 000 do 999, tj.
števila 0, …, 999); z dvema kolescema 10 · 10 = 100.
trditev: MAT-OS-6/kombinatoricne-situacije#vsakdan-kljucavnica
besedilo: »Na vsakem kolescu je $10$ izbir in števke se lahko ponavljajo, zato je kod $10 \cdot 10 \cdot 10 = 1000$, od $000$ do $999$.« -/
theorem vsakdan_kljucavnica :
    Fintype.card (Fin 10 × Fin 10 × Fin 10) = 10 * 10 * 10 ∧ 10 * 10 * 10 = 1000 ∧ 10 ^ 3 = 1000 ∧
      (Finset.range 1000).card = 1000 ∧ Fintype.card (Fin 10 × Fin 10) = 100 := by
  refine ⟨by simp, rfl, rfl, by simp, by simp⟩

/-! ## Preveri se -/

/-- Preveri se 2: rokovanje Ane z Borom je isto kot Bora z Ano (neurejen par), pri šifri pa 12 ≠ 21.
trditev: MAT-OS-6/kombinatoricne-situacije#preveri2
besedilo: »Rokovanje Ane z Borom je isto kot rokovanje Bora z Ano, zato tak par štejemo samo enkrat.« -/
theorem preveri2 {α : Type*} [DecidableEq α] (ana bor : α) : ({ana, bor} : Finset α) = {bor, ana} :=
  Finset.pair_comm ana bor

/-- Preveri se 3: s tretjo obliko so 3 oblike po 3 okuse, možnosti je 3 · 3 = 9 (ne 8 = 2 · 4, ne 7, ne 12).
trditev: MAT-OS-6/kombinatoricne-situacije#preveri3
besedilo: »Oblike so zdaj $3$, okusi ostanejo $3$: $3 \cdot 3 = 9$.« -/
theorem preveri3 : (Finset.range 3 ×ˢ Finset.range 3).card = 3 * 3 ∧ 3 * 3 = 9 ∧ 2 * 4 = 8 ∧
    (Finset.range 3 ×ˢ Finset.range 3).card ≠ 8 ∧ (Finset.range 3 ×ˢ Finset.range 3).card ≠ 7 ∧
    (Finset.range 3 ×ˢ Finset.range 3).card ≠ 12 := by
  decide

/-- Preveri se 4: iz števk 0, 4, 7 brez ponavljanja sta za desetice le 2 izbiri, števila so 40, 47, 70, 74, teh je
2 · 2 = 4 (ne 6).
trditev: MAT-OS-6/kombinatoricne-situacije#preveri4
besedilo: »Ničla ne sme na mesto desetic, zato sta za desetice le $2$ izbiri: $2 \cdot 2 = 4$ števila ($40$, $47$, $70$, $74$).« -/
theorem preveri4 : (({0, 4, 7} : Finset ℕ).filter (· ≠ 0)).card = 2 ∧
    dvomestnaRazlicne {0, 4, 7} = {40, 47, 70, 74} ∧ (dvomestnaRazlicne {0, 4, 7}).card = 2 * 2 ∧ 2 * 2 = 4 := by
  decide

/-- Preveri se 5: 6 sester, rokovanj je 5 + 4 + 3 + 2 + 1 = 15 = 6 · 5 : 2.
trditev: MAT-OS-6/kombinatoricne-situacije#preveri5
besedilo: »$5 + 4 + 3 + 2 + 1 = 15$ ali $6 \cdot 5 : 2 = 15$.« -/
theorem preveri5 : (Finset.powersetCard 2 (Finset.range 6)).card = 15 ∧ 5 + 4 + 3 + 2 + 1 = 15 ∧
    6 * 5 / 2 = 15 := by
  refine ⟨?_, rfl, rfl⟩
  rw [Finset.card_powersetCard, Finset.card_range]
  rfl

/-- Preveri se 5 (povratna informacija): urejenih parov različnih sester je 6 · 5 = 30 (vsako rokovanje dvakrat),
vseh parov s seboj vred 6 · 6 = 36, 6 + 5 + 4 + 3 + 2 + 1 = 21; nobeno ni 15.
trditev: MAT-OS-6/kombinatoricne-situacije#preveri5-napacni
besedilo: »Vsako rokovanje si štel dvakrat: $6 \cdot 5 = 30$ moraš še deliti z $2$.« -/
theorem preveri5_napacni :
    (Finset.univ.filter (fun p : Fin 6 × Fin 6 => p.1 ≠ p.2)).card = 6 * 5 ∧ 6 * 5 = 30 ∧ 30 / 2 = 15 ∧
      Fintype.card (Fin 6 × Fin 6) = 36 ∧ 6 + 5 + 4 + 3 + 2 + 1 = 21 ∧ (21 : ℕ) ≠ 15 := by
  refine ⟨by decide, rfl, rfl, by simp, rfl, by decide⟩

end Evklid.Lekcije.MAT_OS_6.KombinatoricneSituacije
